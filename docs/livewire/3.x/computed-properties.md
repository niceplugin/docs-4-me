# 계산된 속성(Computed Properties)
계산된 속성은 Livewire에서 "파생" 속성을 생성하는 방법입니다. Eloquent 모델의 접근자(accessor)처럼, 계산된 속성을 사용하면 값을 접근하고, 요청 중에 이후 접근을 위해 해당 값을 캐싱할 수 있습니다.

계산된 속성은 컴포넌트의 public 속성과 결합하여 사용할 때 특히 유용합니다.

## 기본 사용법 {#basic-usage}

계산된 속성을 생성하려면 Livewire 컴포넌트의 메서드 위에 `#[Computed]` 어트리뷰트를 추가하면 됩니다. 어트리뷰트를 메서드에 추가하면, 다른 속성처럼 해당 값을 접근할 수 있습니다.

> [!warning] 어트리뷰트 클래스 임포트 필수
> 어트리뷰트 클래스를 반드시 임포트해야 합니다. 예를 들어, 아래의 `#[Computed]` 어트리뷰트를 사용하려면 `use Livewire\Attributes\Computed;`를 임포트해야 합니다.

예를 들어, 아래는 `user()`라는 계산된 속성을 사용하여 `$userId` 속성을 기반으로 `User` Eloquent 모델에 접근하는 `ShowUser` 컴포넌트입니다:
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

`user()` 메서드에 `#[Computed]` 어트리뷰트가 추가되어 있기 때문에, 이 값은 컴포넌트의 다른 메서드나 Blade 템플릿 내에서 접근할 수 있습니다.

> [!info] 템플릿에서 반드시 `$this` 사용
> 일반 속성과 달리, 계산된 속성은 컴포넌트의 템플릿에서 직접 사용할 수 없습니다. 대신, `$this` 객체를 통해 접근해야 합니다. 예를 들어, `posts()`라는 계산된 속성은 템플릿 내에서 반드시 `$this->posts`로 접근해야 합니다.

> [!warning] 계산된 속성은 `Livewire\Form` 객체에서 지원되지 않습니다.
> [Form](https://livewire.laravel.com/docs/forms) 내에서 계산된 속성을 사용하려고 하면, blade에서 $form->property 문법으로 속성에 접근할 때 오류가 발생합니다.

## 성능 이점 {#performance-advantage}

왜 굳이 계산된 속성(computed property)을 사용해야 할까요? 그냥 메서드를 직접 호출하면 안 될까요?

메서드를 계산된 속성으로 접근하면, 메서드를 직접 호출하는 것보다 성능상 이점이 있습니다. 내부적으로 계산된 속성이 처음 실행될 때 Livewire는 반환된 값을 캐싱합니다. 이렇게 하면, 같은 요청 내에서 이후에 접근할 때는 여러 번 실행하지 않고 캐시된 값을 반환합니다.

이 덕분에 파생된 값을 자유롭게 접근하면서 성능에 대해 걱정할 필요가 없습니다.

> [!warning] 계산된 속성은 한 번의 요청에만 캐시됩니다
> Livewire가 계산된 속성을 페이지에서 Livewire 컴포넌트의 전체 수명 동안 캐시한다고 오해하는 경우가 많습니다. 하지만 실제로는 그렇지 않습니다. Livewire는 한 번의 컴포넌트 요청 동안에만 결과를 캐시합니다. 즉, 계산된 속성 메서드에 비용이 많이 드는 데이터베이스 쿼리가 있다면, Livewire 컴포넌트가 업데이트될 때마다 해당 쿼리가 매번 실행됩니다.

### 캐시 무효화하기 {#busting-the-cache}

다음과 같은 문제가 발생할 수 있는 시나리오를 생각해봅시다:
1) 특정 속성이나 데이터베이스 상태에 의존하는 계산된 속성에 접근합니다.
2) 해당 속성이나 데이터베이스 상태가 변경됩니다.
3) 속성에 대한 캐시된 값이 오래되어 다시 계산이 필요해집니다.

저장된 캐시를 지우거나 "무효화(bust)"하려면 PHP의 `unset()` 함수를 사용할 수 있습니다.

아래는 `createPost()`라는 액션의 예시입니다. 이 액션은 애플리케이션에 새 게시물을 생성함으로써 `posts()` 계산된 속성을 오래된 상태로 만듭니다. 즉, 계산된 속성 `posts()`가 새로 추가된 게시물을 포함하도록 다시 계산되어야 합니다:

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
            throw new \Exception('Maximum post count exceeded');
        }

        Auth::user()->posts()->create(...);

        unset($this->posts); // [tl! highlight]
    }

    #[Computed]
    public function posts()
    {
        return Auth::user()->posts;
    }

    // ...
}
```

위 컴포넌트에서, 새 게시물이 생성되기 전에 `createPost()` 메서드가 `$this->posts`에 접근하기 때문에 계산된 속성이 캐시됩니다. 뷰에서 `$this->posts`를 접근할 때 가장 최신의 내용을 포함하도록 하려면, `unset($this->posts)`를 사용해 캐시를 무효화해야 합니다.

### 요청 간 캐싱 {#caching-between-requests}

때때로 Livewire 컴포넌트의 수명 동안 계산된 프로퍼티의 값을 캐싱하고 싶을 때가 있습니다. 이렇게 하면 매 요청마다 값이 초기화되지 않습니다. 이런 경우에는 [Laravel의 캐싱 유틸리티](https://laravel.com/docs/cache#retrieve-store)를 사용할 수 있습니다.

아래는 `user()`라는 계산된 프로퍼티의 예시입니다. Eloquent 쿼리를 직접 실행하는 대신, 쿼리를 `Cache::remember()`로 감싸서 이후의 요청에서는 쿼리를 다시 실행하지 않고 Laravel의 캐시에서 값을 가져오도록 합니다:

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

각 Livewire 컴포넌트의 고유 인스턴스는 고유한 ID를 가지므로, `$this->getId()`를 사용해 이 컴포넌트 인스턴스에만 적용되는 고유한 캐시 키를 생성할 수 있습니다.

하지만, 보시다시피 이 코드의 대부분은 예측 가능하며 쉽게 추상화할 수 있습니다. 그래서 Livewire의 `#[Computed]` 속성은 유용한 `persist` 파라미터를 제공합니다. 메서드에 `#[Computed(persist: true)]`를 적용하면, 추가 코드 없이 동일한 결과를 얻을 수 있습니다:

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

Livewire는 지속된 값을 3600초(1시간) 동안 캐싱합니다. 이 기본값은 `#[Computed]` 속성에 추가로 `seconds` 파라미터를 전달하여 변경할 수 있습니다:

```php
#[Computed(persist: true, seconds: 7200)]
```

> [!tip] `unset()`을 호출하면 이 캐시가 삭제됩니다
> 앞서 설명한 것처럼, PHP의 `unset()` 메서드를 사용해 계산된 프로퍼티의 캐시를 지울 수 있습니다. 이 방법은 `persist: true` 파라미터를 사용하는 계산된 프로퍼티에도 적용됩니다. 캐싱된 계산 프로퍼티에 `unset()`을 호출하면, Livewire는 계산 프로퍼티 캐시뿐만 아니라 Laravel 캐시에 저장된 값도 함께 삭제합니다.

## 모든 컴포넌트에서 캐싱하기 {#caching-across-all-components}

단일 컴포넌트의 생명주기 동안 계산된 프로퍼티의 값을 캐싱하는 대신, `#[Computed]` 속성에서 제공하는 `cache: true` 파라미터를 사용하여 애플리케이션의 모든 컴포넌트에서 계산된 값의 캐시를 공유할 수 있습니다:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true)]
public function posts()
{
    return Post::all();
}
```

위 예시에서, 캐시가 만료되거나 삭제되기 전까지 애플리케이션 내 이 컴포넌트의 모든 인스턴스는 `$this->posts`에 대해 동일한 캐시 값을 공유하게 됩니다.

계산된 프로퍼티의 캐시를 수동으로 삭제해야 하는 경우, `key` 파라미터를 사용하여 커스텀 캐시 키를 지정할 수 있습니다:

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true, key: 'homepage-posts')]
public function posts()
{
    return Post::all();
}
```

## 계산된 속성을 언제 사용해야 하나요? {#when-to-use-computed-properties}

성능상의 이점 외에도, 계산된 속성이 유용한 몇 가지 다른 상황이 있습니다.

특히, 컴포넌트의 Blade 템플릿에 데이터를 전달할 때, 계산된 속성이 더 나은 대안이 되는 경우가 있습니다. 아래는 간단한 컴포넌트의 `render()` 메서드가 `posts` 컬렉션을 Blade 템플릿에 전달하는 예시입니다:

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

이 방법이 많은 경우에 충분하지만, 계산된 속성이 더 나은 대안이 되는 세 가지 상황이 있습니다:

### 조건부로 값에 접근하기 {#conditionally-accessing-values}

Blade 템플릿에서 계산 비용이 많이 드는 값을 조건부로 접근해야 할 때, 계산된 속성(computed property)을 사용하면 성능 오버헤드를 줄일 수 있습니다.

계산된 속성을 사용하지 않은 아래의 템플릿을 살펴보세요:

```blade
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

만약 사용자가 게시글을 볼 수 없도록 제한되어 있다면, 게시글을 가져오는 데이터베이스 쿼리는 이미 실행되었지만, 실제로 템플릿에서는 게시글이 사용되지 않습니다.

위의 상황을 계산된 속성을 사용하여 개선한 예시는 다음과 같습니다:

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

이제 계산된 속성을 통해 템플릿에 게시글을 제공하므로, 데이터가 실제로 필요할 때만 데이터베이스 쿼리가 실행됩니다.

### 인라인 템플릿 사용하기 {#using-inline-templates}

계산된 속성이 유용한 또 다른 시나리오는 컴포넌트에서 [인라인 템플릿](/livewire/3.x/components#inline-components)을 사용할 때입니다.

아래는 인라인 컴포넌트의 예시로, `render()` 메서드 안에서 템플릿 문자열을 직접 반환하기 때문에 뷰에 데이터를 전달할 기회가 전혀 없습니다:

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

위 예시에서 계산된 속성이 없다면, Blade 템플릿에 데이터를 명시적으로 전달할 방법이 없습니다.

### render 메서드 생략하기 {#omitting-the-render-method}

Livewire에서는 컴포넌트의 보일러플레이트 코드를 줄이는 또 다른 방법으로 `render()` 메서드를 아예 생략할 수 있습니다. 생략할 경우, Livewire는 관례에 따라 해당 Blade 뷰를 반환하는 자체 `render()` 메서드를 사용합니다.

이 경우에는 Blade 뷰로 데이터를 전달할 수 있는 `render()` 메서드가 당연히 존재하지 않습니다.

컴포넌트에 `render()` 메서드를 다시 추가하는 대신, 계산된 속성(computed properties)을 통해 뷰에 데이터를 제공할 수 있습니다:

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
