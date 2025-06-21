# 보안
Livewire 앱이 안전하고 애플리케이션 취약점을 노출하지 않도록 하는 것은 매우 중요합니다. Livewire는 많은 경우를 처리할 수 있는 내부 보안 기능을 제공하지만, 컴포넌트의 보안을 유지하는 것은 애플리케이션 코드에 달려 있는 경우도 있습니다.

## 액션 파라미터 권한 부여 {#authorizing-action-parameters}

Livewire 액션은 매우 강력하지만, Livewire 액션에 전달되는 모든 파라미터는 클라이언트에서 변경 가능하며 신뢰할 수 없는 사용자 입력으로 간주해야 합니다.

Livewire에서 가장 흔한 보안 실수 중 하나는 데이터베이스에 변경 사항을 저장하기 전에 Livewire 액션 호출을 검증하고 권한을 부여하지 않는 것입니다.

다음은 권한 부여가 부족하여 발생하는 보안 취약점의 예시입니다:
```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    // ...

    public function delete($id)
    {
        // 보안 취약!

        $post = Post::find($id);

        $post->delete();
    }
}
```

```html
<button wire:click="delete({{ $post->id }})">Delete Post</button>
```


위 예제가 보안상 취약한 이유는 `wire:click="delete(...)"`가 브라우저에서 수정되어 악의적인 사용자가 원하는 어떤 게시글 ID든 전달할 수 있기 때문입니다.

액션 파라미터(이 경우 `$id`와 같은)는 브라우저로부터의 신뢰할 수 없는 입력과 동일하게 취급해야 합니다.

따라서, 이 애플리케이션을 안전하게 유지하고 사용자가 다른 사용자의 게시글을 삭제하지 못하도록 하려면 `delete()` 액션에 권한 부여를 추가해야 합니다.

먼저, 다음 명령어를 실행하여 Post 모델에 대한 [Laravel Policy](/laravel/12.x/authorization#creating-policies)를 생성합시다:

```bash
php artisan make:policy PostPolicy --model=Post
```

위 명령어를 실행하면 `app/Policies/PostPolicy.php`에 새로운 Policy가 생성됩니다. 그런 다음, 다음과 같이 `delete` 메서드를 추가하여 내용을 업데이트할 수 있습니다:

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * 주어진 게시글을 사용자가 삭제할 수 있는지 결정합니다.
     */
    public function delete(?User $user, Post $post): bool
    {
        return $user?->id === $post->user_id;
    }
}
```

이제 Livewire 컴포넌트에서 `$this->authorize()` 메서드를 사용하여 사용자가 게시글의 소유자인지 확인한 후 삭제할 수 있습니다:

```php
public function delete($id)
{
    $post = Post::find($id);

    // 사용자가 게시글의 소유자가 아니라면,
    // AuthorizationException이 발생합니다...
    $this->authorize('delete', $post); // [!code highlight]

    $post->delete();
}
```

더 읽어보기:
* [Laravel Gates](/laravel/12.x/authorization#gates)
* [Laravel Policies](/laravel/12.x/authorization#creating-policies)

## 공개 속성 권한 부여 {#authorizing-public-properties}

액션 파라미터와 마찬가지로, Livewire의 공개 속성도 사용자로부터의 신뢰할 수 없는 입력으로 간주해야 합니다.

아래는 게시글을 삭제하는 동일한 예제를 다른 방식으로 보안에 취약하게 작성한 예시입니다:

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId;

    public function mount($postId)
    {
        $this->postId = $postId;
    }

    public function delete()
    {
        // 보안 취약!

        $post = Post::find($this->postId);

        $post->delete();
    }
}
```

```html
<button wire:click="delete">Delete Post</button>
```

보시다시피, `wire:click`에서 `$postId`를 `delete` 메서드의 파라미터로 전달하는 대신, Livewire 컴포넌트의 공개 속성으로 저장하고 있습니다.

이 접근 방식의 문제는 악의적인 사용자가 다음과 같은 커스텀 요소를 페이지에 삽입할 수 있다는 점입니다:

```html
<input type="text" wire:model="postId">
```

이렇게 하면 "Delete Post"를 누르기 전에 `$postId` 값을 자유롭게 수정할 수 있습니다. `delete` 액션이 `$postId`의 값을 권한 부여하지 않기 때문에, 사용자는 자신이 소유하지 않은 게시글도 데이터베이스에서 삭제할 수 있습니다.

이 위험으로부터 보호하기 위한 두 가지 가능한 해결책이 있습니다:

### 모델 속성 사용하기 {#using-model-properties}

공개 속성을 설정할 때, Livewire는 문자열이나 정수와 같은 일반 값과 달리 모델을 다르게 처리합니다. 따라서, 컴포넌트에 전체 게시글 모델을 속성으로 저장하면, Livewire는 ID가 변조되지 않도록 보장합니다.

다음은 단순한 `$postId` 속성 대신 `$post` 속성을 저장하는 예시입니다:

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount($postId)
    {
        $this->post = Post::find($postId);
    }

    public function delete()
    {
        $this->post->delete();
    }
}
```

```html
<button wire:click="delete">Delete Post</button>
```

이제 이 컴포넌트는 악의적인 사용자가 `$post` 속성을 다른 Eloquent 모델로 변경할 방법이 없으므로 안전합니다.

### 속성 잠그기 {#locking-the-property}
원하지 않는 값으로 속성이 설정되는 것을 방지하는 또 다른 방법은 [잠긴 속성](/livewire/3.x/locked)을 사용하는 것입니다. 속성 잠금은 `#[Locked]` 속성(Attribute)을 적용하여 수행합니다. 사용자가 이 값을 변조하려고 시도하면 오류가 발생합니다.

잠긴 속성은 백엔드에서 여전히 변경될 수 있으므로, 신뢰할 수 없는 사용자 입력이 Livewire 함수 내에서 속성에 전달되지 않도록 주의해야 합니다.

```php
<?php

use App\Models\Post;
use Livewire\Component;
use Livewire\Attributes\Locked;

class ShowPost extends Component
{
    #[Locked] // [!code highlight]
    public $postId;

    public function mount($postId)
    {
        $this->postId = $postId;
    }

    public function delete()
    {
        $post = Post::find($this->postId);

        $post->delete();
    }
}
```

### 속성 권한 부여 {#authorizing-the-property}

모델 속성 사용이 상황에 맞지 않는 경우, 물론 `delete` 액션 내에서 게시글 삭제를 수동으로 권한 부여하는 방법으로 돌아갈 수 있습니다:

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId;

    public function mount($postId)
    {
        $this->postId = $postId;
    }

    public function delete()
    {
        $post = Post::find($this->postId);

        $this->authorize('delete', $post); // [!code highlight]

        $post->delete();
    }
}
```

```html
<button wire:click="delete">Delete Post</button>
```

이제 악의적인 사용자가 `$postId` 값을 자유롭게 수정할 수 있더라도, `delete` 액션이 호출될 때 사용자가 게시글의 소유자가 아니라면 `$this->authorize()`가 `AuthorizationException`을 발생시킵니다.

더 읽어보기:
* [Laravel Gates](/laravel/12.x/authorization#gates)
* [Laravel Policies](/laravel/12.x/authorization#creating-policies)

## 미들웨어 {#middleware}

Livewire 컴포넌트가 다음과 같이 라우트 수준의 [Authorization Middleware](/laravel/12.x/authorization#via-middleware)가 포함된 페이지에 로드될 때:

```php
Route::get('/post/{post}', App\Livewire\UpdatePost::class)
    ->middleware('can:update,post'); // [!code highlight]
```

Livewire는 이러한 미들웨어가 이후의 Livewire 네트워크 요청에도 다시 적용되도록 보장합니다. 이것을 Livewire의 코어에서는 "Persistent Middleware(지속적 미들웨어)"라고 부릅니다.

지속적 미들웨어는 초기 페이지 로드 이후 권한 규칙이나 사용자 권한이 변경된 경우에도 보호해줍니다.

다음은 이러한 시나리오의 좀 더 심층적인 예시입니다:

```php
Route::get('/post/{post}', App\Livewire\UpdatePost::class)
    ->middleware('can:update,post'); // [!code highlight]
```

```php
<?php

use App\Models\Post;
use Livewire\Component;
use Livewire\Attributes\Validate;

class UpdatePost extends Component
{
    public Post $post;

    #[Validate('required|min:5')]
    public $title = '';

    public $content = '';

    public function mount()
    {
        $this->title = $this->post->title;
        $this->content = $this->post->content;
    }

    public function update()
    {
        $this->post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);
    }
}
```

보시다시피, `can:update,post` 미들웨어가 라우트 수준에서 적용되어 있습니다. 즉, 게시글을 수정할 권한이 없는 사용자는 페이지를 볼 수 없습니다.

하지만 다음과 같은 시나리오를 생각해봅시다:
* 사용자가 페이지를 로드함
* 페이지 로드 후 수정 권한을 잃음
* 권한을 잃은 후 게시글을 수정 시도함

Livewire가 이미 페이지를 성공적으로 로드했기 때문에, "Livewire가 게시글을 수정하기 위한 후속 요청을 할 때 `can:update,post` 미들웨어가 다시 적용될까? 아니면 권한이 없는 사용자가 게시글을 성공적으로 수정할 수 있을까?"라는 의문이 들 수 있습니다.

Livewire는 원래 엔드포인트의 미들웨어를 다시 적용하는 내부 메커니즘을 가지고 있기 때문에, 이 시나리오에서도 보호받을 수 있습니다.

### 지속적 미들웨어 설정하기 {#configuring-persistent-middleware}

기본적으로 Livewire는 다음 미들웨어를 네트워크 요청 간에 지속합니다:

```php
\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
\Laravel\Jetstream\Http\Middleware\AuthenticateSession::class,
\Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
\Illuminate\Routing\Middleware\SubstituteBindings::class,
\App\Http\Middleware\RedirectIfAuthenticated::class,
\Illuminate\Auth\Middleware\Authenticate::class,
\Illuminate\Auth\Middleware\Authorize::class,
```

위 미들웨어 중 하나라도 초기 페이지 로드에 적용되었다면, 이후의 모든 네트워크 요청에도 지속적으로(다시) 적용됩니다.

하지만, 애플리케이션에서 커스텀 미들웨어를 초기 페이지 로드에 적용하고, Livewire 요청 간에도 지속되길 원한다면, [서비스 프로바이더](/laravel/12.x/providers#main-content)에서 다음과 같이 이 목록에 추가해야 합니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Livewire;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Livewire::addPersistentMiddleware([ // [!code highlight:3]
            App\Http\Middleware\EnsureUserHasRole::class,
        ]);
    }
}
```

이제 Livewire 컴포넌트가 애플리케이션의 `EnsureUserHasRole` 미들웨어를 사용하는 페이지에 로드되면, 해당 미들웨어가 이후의 모든 네트워크 요청에도 지속적으로 적용됩니다.

> [!warning] 미들웨어 인자는 지원되지 않습니다
> Livewire는 현재 지속적 미들웨어 정의에 대해 미들웨어 인자를 지원하지 않습니다.
>
> ```php
> // 잘못된 예...
> Livewire::addPersistentMiddleware(AuthorizeResource::class.':admin');
>
> // 올바른 예...
> Livewire::addPersistentMiddleware(AuthorizeResource::class);
> ```


### 글로벌 Livewire 미들웨어 적용하기 {#applying-global-livewire-middleware}

또는, 모든 Livewire 업데이트 네트워크 요청에 특정 미들웨어를 적용하고 싶다면, 원하는 미들웨어와 함께 자체 Livewire 업데이트 라우트를 등록하여 적용할 수 있습니다:

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/livewire/update', $handle)
        ->middleware(App\Http\Middleware\LocalizeViewPaths::class);
});
```

서버로 전송되는 모든 Livewire AJAX/fetch 요청은 위 엔드포인트를 사용하며, 컴포넌트 업데이트를 처리하기 전에 `LocalizeViewPaths` 미들웨어가 적용됩니다.

[설치 페이지에서 업데이트 라우트 커스터마이징에 대해 더 알아보세요.](/livewire/3.x/installation#configuring-livewires-update-endpoint)

## 스냅샷 체크섬 {#snapshot-checksums}

모든 Livewire 요청 사이에, Livewire 컴포넌트의 스냅샷이 생성되어 브라우저로 전송됩니다. 이 스냅샷은 다음 서버 라운드트립에서 컴포넌트를 다시 빌드하는 데 사용됩니다.

[Hydration 문서에서 Livewire 스냅샷에 대해 더 알아보세요.](/livewire/3.x/hydration#the-snapshot)

fetch 요청은 브라우저에서 가로채거나 변조될 수 있기 때문에, Livewire는 각 스냅샷에 대한 "체크섬"을 생성하여 함께 전송합니다.

이 체크섬은 다음 네트워크 요청에서 스냅샷이 어떤 식으로든 변경되지 않았는지 검증하는 데 사용됩니다.

Livewire가 체크섬 불일치를 발견하면, `CorruptComponentPayloadException`을 발생시키고 요청이 실패합니다.

이로써, 악의적인 변조로 인해 사용자가 관련 없는 코드를 실행하거나 수정할 수 있는 모든 형태의 공격으로부터 보호할 수 있습니다.
