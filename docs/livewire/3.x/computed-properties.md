# Computed Properties(계산된 속성)
Computed properties는 Livewire에서 "파생" 속성을 생성하는 방법입니다. Eloquent 모델의 접근자(accessor)처럼, computed properties를 사용하면 값을 접근하고, 요청 중에 이후 접근을 위해 해당 값을 캐싱할 수 있습니다.

Computed properties는 컴포넌트의 public 속성과 조합하여 사용할 때 특히 유용합니다.

## 기본 사용법 {#basic-usage}

Computed property를 생성하려면, Livewire 컴포넌트의 어떤 메서드 위에 `#[Computed]` 속성을 추가하면 됩니다. 속성이 메서드에 추가되면, 다른 속성처럼 접근할 수 있습니다.

> [!warning] 속성 클래스 임포트 필수
> 모든 속성 클래스를 임포트해야 합니다. 예를 들어, 아래의 `#[Computed]` 속성은 `use Livewire\Attributes\Computed;` 임포트가 필요합니다.

예를 들어, 아래는 `$userId`라는 속성을 기반으로 `User` Eloquent 모델에 접근하는 `user()`라는 computed property를 사용하는 `ShowUser` 컴포넌트입니다:
```php
<?php

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\User;

class ShowUser extends Component
{
    public $userId;

    #[Computed]
    public function user()
    {
        return User::find($this->userId);
    }

    public function follow()
    {
        Auth::user()->follow($this->user);
    }

    public function render()
    {
        return view('livewire.show-user');
    }
}
```

```blade
<div>
    <h1>{{ $this->user->name }}</h1>

    <span>{{ $this->user->email }}</span>

    <button wire:click="follow">Follow</button>
</div>
```

`user()` 메서드에 `#[Computed]` 속성이 추가되었기 때문에, 해당 값은 컴포넌트의 다른 메서드와 Blade 템플릿 내에서 접근할 수 있습니다.

> [!info] 템플릿에서 반드시 `$this` 사용
> 일반 속성과 달리, computed property는 컴포넌트의 템플릿 내에서 직접적으로 사용할 수 없습니다. 대신, `$this` 객체를 통해 접근해야 합니다. 예를 들어, `posts()`라는 computed property는 템플릿 내에서 `$this->posts`로 접근해야 합니다.

> [!warning] Computed property는 `Livewire\Form` 객체에서 지원되지 않습니다.
> [Form](/livewire/3.x/forms) 내에서 Computed property를 사용하려고 하면, blade에서 $form->property 문법으로 속성에 접근할 때 오류가 발생합니다.

## 성능 이점 {#performance-advantage}

왜 굳이 computed property를 사용할까요? 그냥 메서드를 직접 호출하면 안 될까요?

메서드를 computed property로 접근하면, 메서드를 직접 호출하는 것보다 성능상 이점이 있습니다. 내부적으로, computed property가 처음 실행될 때 Livewire는 반환된 값을 캐싱합니다. 이렇게 하면, 같은 요청 내에서 이후 접근 시 여러 번 실행하지 않고 캐시된 값을 반환합니다.

따라서 파생된 값을 자유롭게 접근해도 성능에 대해 걱정할 필요가 없습니다.

> [!warning] Computed property는 한 번의 요청에만 캐싱됩니다
> Livewire가 computed property를 페이지 내 컴포넌트의 전체 수명 동안 캐싱한다고 오해하는 경우가 많습니다. 하지만 실제로는 그렇지 않습니다. Livewire는 단일 컴포넌트 요청 동안에만 결과를 캐싱합니다. 즉, computed property 메서드에 비용이 많이 드는 데이터베이스 쿼리가 있다면, Livewire 컴포넌트가 업데이트될 때마다 쿼리가 실행됩니다.

### 캐시 무효화 {#busting-the-cache}

다음과 같은 문제가 발생할 수 있습니다:
1) 특정 속성이나 데이터베이스 상태에 의존하는 computed property에 접근함
2) 해당 속성이나 데이터베이스 상태가 변경됨
3) 속성의 캐시된 값이 오래되어 다시 계산이 필요함

저장된 캐시를 지우거나 "무효화"하려면, PHP의 `unset()` 함수를 사용할 수 있습니다.

아래는 `createPost()`라는 액션의 예시입니다. 이 액션은 애플리케이션에 새 게시물을 생성하여 `posts()` computed property를 오래된 상태로 만듭니다. 즉, 새로 추가된 게시물을 포함하도록 `posts()` computed property를 다시 계산해야 합니다:

```php
<?php

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowPosts extends Component
{
    public function createPost()
    {
        if ($this->posts->count() > 10) {
            throw new \Exception('최대 게시물 수를 초과했습니다');
        }

        Auth::user()->posts()->create(...);

        unset($this->posts); // [!code highlight]
    }

    #[Computed]
    public function posts()
    {
        return Auth::user()->posts;
    }

    // ...
}
```

위 컴포넌트에서, 새 게시물이 생성되기 전에 computed property가 캐싱됩니다. 왜냐하면 `createPost()` 메서드가 새 게시물이 생성되기 전에 `$this->posts`에 접근하기 때문입니다. 뷰에서 `$this->posts`를 접근할 때 최신 내용을 보장하려면, `unset($this->posts)`로 캐시를 무효화해야 합니다.

### 요청 간 캐싱 {#caching-between-requests}

때로는 computed property의 값을 Livewire 컴포넌트의 수명 동안 캐싱하고 싶을 수 있습니다. 이런 경우에는 [Laravel의 캐싱 유틸리티](/laravel/12.x/cache#retrieve-store)를 사용할 수 있습니다.

아래는 `user()`라는 computed property의 예시입니다. Eloquent 쿼리를 직접 실행하는 대신, 쿼리를 `Cache::remember()`로 감싸서 이후 요청에서는 쿼리를 다시 실행하지 않고 Laravel의 캐시에서 값을 가져오도록 합니다:

```php
<?php

use Illuminate\Support\Facades\Cache;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\User;

class ShowUser extends Component
{
    public $userId;

    #[Computed]
    public function user()
    {
        $key = 'user'.$this->getId();
        $seconds = 3600; // 1시간...

        return Cache::remember($key, $seconds, function () {
            return User::find($this->userId);
        });
    }

    // ...
}
```

각 Livewire 컴포넌트의 고유 인스턴스는 고유한 ID를 가지므로, `$this->getId()`를 사용해 이 인스턴스에만 적용되는 고유한 캐시 키를 생성할 수 있습니다.

하지만, 대부분의 코드는 예측 가능하며 쉽게 추상화할 수 있습니다. 그래서 Livewire의 `#[Computed]` 속성은 유용한 `persist` 파라미터를 제공합니다. 메서드에 `#[Computed(persist: true)]`를 적용하면, 추가 코드 없이 동일한 결과를 얻을 수 있습니다:

```php
use Livewire\Attributes\Computed;
use App\Models\User;

#[Computed(persist: true)]
public function user()
{
    return User::find($this->userId);
}
```

위 예시에서, 컴포넌트에서 `$this->user`에 접근하면 Livewire 컴포넌트가 페이지에 있는 동안 계속 캐싱됩니다. 즉, 실제 Eloquent 쿼리는 한 번만 실행됩니다.

Livewire는 지속된 값을 3600초(1시간) 동안 캐싱합니다. 기본값을 변경하려면 `#[Computed]` 속성에 추가로 `seconds` 파라미터를 전달하면 됩니다:

```php
#[Computed(persist: true, seconds: 7200)]
```

> [!tip] `unset()` 호출 시 캐시가 무효화됩니다
> 앞서 설명한 것처럼, PHP의 `unset()` 메서드를 사용해 computed property의 캐시를 지울 수 있습니다. 이 동작은 `persist: true` 파라미터를 사용하는 computed property에도 적용됩니다. 캐싱된 computed property에 대해 `unset()`을 호출하면, Livewire는 computed property 캐시뿐만 아니라 Laravel의 내부 캐시 값도 함께 삭제합니다.

## 모든 컴포넌트 간 캐싱 {#caching-across-all-components}

단일 컴포넌트의 라이프사이클 동안만 computed property의 값을 캐싱하는 대신, `#[Computed]` 속성의 `cache: true` 파라미터를 사용해 애플리케이션의 모든 컴포넌트에서 computed property의 값을 공유할 수 있습니다:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true)]
public function posts()
{
    return Post::all();
}
```

위 예시에서, 캐시가 만료되거나 무효화될 때까지 애플리케이션 내 이 컴포넌트의 모든 인스턴스는 `$this->posts`에 대해 동일한 캐시 값을 공유합니다.

computed property의 캐시를 수동으로 지워야 할 경우, `key` 파라미터를 사용해 커스텀 캐시 키를 지정할 수 있습니다:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true, key: 'homepage-posts')]
public function posts()
{
    return Post::all();
}
```

## 언제 computed property를 사용해야 할까요? {#when-to-use-computed-properties}

성능상의 이점 외에도, computed property가 유용한 몇 가지 다른 시나리오가 있습니다.

특히, 컴포넌트의 Blade 템플릿에 데이터를 전달할 때, computed property가 더 나은 대안이 되는 경우가 있습니다. 아래는 `posts` 컬렉션을 Blade 템플릿에 전달하는 간단한 컴포넌트의 `render()` 메서드 예시입니다:

```php
public function render()
{
    return view('livewire.show-posts', [
        'posts' => Post::all(),
    ]);
}
```

```blade
<div>
    @foreach ($posts as $post)
        <!-- ... -->
    @endforeach
</div>
```

많은 경우 이 방법으로 충분하지만, computed property가 더 나은 대안이 되는 세 가지 시나리오가 있습니다:

### 조건부 값 접근 {#conditionally-accessing-values}

Blade 템플릿에서 계산 비용이 많이 드는 값을 조건부로 접근하는 경우, computed property를 사용해 성능 오버헤드를 줄일 수 있습니다.

아래는 computed property 없이 작성된 템플릿 예시입니다:

```blade
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

사용자가 게시물을 볼 수 없도록 제한된 경우에도, 게시물을 가져오는 데이터베이스 쿼리는 이미 실행되었지만, 템플릿에서는 게시물이 사용되지 않습니다.

아래는 위 시나리오를 computed property로 개선한 버전입니다:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed]
public function posts()
{
    return Post::all();
}

public function render()
{
    return view('livewire.show-posts');
}
```

```blade
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($this->posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

이제 computed property를 통해 템플릿에 게시물을 제공하므로, 데이터가 필요할 때만 데이터베이스 쿼리가 실행됩니다.

### 인라인 템플릿 사용 {#using-inline-templates}

computed property가 유용한 또 다른 시나리오는 컴포넌트에서 [인라인 템플릿](/livewire/3.x/components#inline-components)을 사용할 때입니다.

아래는 인라인 컴포넌트의 예시입니다. `render()`에서 템플릿 문자열을 직접 반환하기 때문에, 뷰에 데이터를 전달할 기회가 없습니다:

```php
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Computed]
    public function posts()
    {
        return Post::all();
    }

    public function render()
    {
        return <<<HTML
        <div>
            @foreach ($this->posts as $post)
                <!-- ... -->
            @endforeach
        </div>
        HTML;
    }
}
```

위 예시에서, computed property가 없다면 Blade 템플릿에 데이터를 명시적으로 전달할 방법이 없습니다.

### render 메서드 생략 {#omitting-the-render-method}

Livewire에서는 컴포넌트의 보일러플레이트를 줄이는 또 다른 방법으로 `render()` 메서드를 아예 생략할 수 있습니다. 생략하면, Livewire는 관례에 따라 해당 Blade 뷰를 반환하는 자체 `render()` 메서드를 사용합니다.

이 경우에는 Blade 뷰에 데이터를 전달할 `render()` 메서드가 없습니다.

컴포넌트에 `render()` 메서드를 다시 추가하는 대신, computed property를 통해 뷰에 데이터를 제공할 수 있습니다:

```php
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Computed]
    public function posts()
    {
        return Post::all();
    }
}
```

```blade
<div>
    @foreach ($this->posts as $post)
        <!-- ... -->
    @endforeach
</div>
```
