# 인가


























## 소개 {#introduction}

Laravel은 내장된 [인증](/docs/{{version}}/authentication) 서비스를 제공할 뿐만 아니라, 주어진 리소스에 대해 사용자 행동을 인가(authorization)하는 간단한 방법도 제공합니다. 예를 들어, 사용자가 인증되었더라도, 애플리케이션에서 관리하는 특정 Eloquent 모델이나 데이터베이스 레코드를 수정하거나 삭제할 권한이 없을 수 있습니다. Laravel의 인가 기능은 이러한 유형의 인가 검사를 쉽고 체계적으로 관리할 수 있는 방법을 제공합니다.

Laravel은 행동을 인가하는 두 가지 주요 방법, 즉 [게이트](#gates)와 [정책](#creating-policies)을 제공합니다. 게이트와 정책을 각각 라우트와 컨트롤러에 비유할 수 있습니다. 게이트는 클로저 기반의 간단한 인가 방식을 제공하며, 정책은 컨트롤러처럼 특정 모델이나 리소스에 대한 로직을 그룹화합니다. 이 문서에서는 먼저 게이트를 살펴보고, 그 다음에 정책을 살펴보겠습니다.

애플리케이션을 구축할 때 게이트만 사용하거나 정책만 사용해야 하는 것은 아닙니다. 대부분의 애플리케이션은 게이트와 정책이 혼합되어 있을 가능성이 높으며, 이는 전혀 문제가 되지 않습니다! 게이트는 관리자 대시보드 보기와 같이 특정 모델이나 리소스와 관련 없는 행동에 가장 적합합니다. 반면, 정책은 특정 모델이나 리소스에 대한 행동을 인가하고자 할 때 사용해야 합니다.


## 게이트 {#gates}


### 게이트 작성하기 {#writing-gates}

> [!WARNING]
> 게이트는 Laravel의 인가 기능의 기본을 배우기에 좋은 방법입니다. 하지만, 더 견고한 Laravel 애플리케이션을 구축할 때는 인가 규칙을 정리하기 위해 [정책(Policies)](#creating-policies) 사용을 고려해야 합니다.

게이트는 사용자가 주어진 작업을 수행할 권한이 있는지 판단하는 클로저(Closure)입니다. 일반적으로 게이트는 `Gate` 파사드를 사용하여 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드 내에서 정의합니다. 게이트는 항상 첫 번째 인자로 사용자 인스턴스를 받고, 필요에 따라 관련된 Eloquent 모델과 같은 추가 인자를 받을 수 있습니다.

이 예제에서는 사용자가 특정 `App\Models\Post` 모델을 업데이트할 수 있는지 판단하는 게이트를 정의합니다. 이 게이트는 사용자의 `id`와 게시글을 작성한 사용자의 `user_id`를 비교하여 권한을 확인합니다:

```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Gate::define('update-post', function (User $user, Post $post) {
        return $user->id === $post->user_id;
    });
}
```

컨트롤러와 마찬가지로, 게이트도 클래스 콜백 배열을 사용하여 정의할 수 있습니다:

```php
use App\Policies\PostPolicy;
use Illuminate\Support\Facades\Gate;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Gate::define('update-post', [PostPolicy::class, 'update']);
}
```


### 액션 권한 부여 {#authorizing-actions-via-gates}

게이트를 사용하여 액션에 권한을 부여하려면 `Gate` 파사드에서 제공하는 `allows` 또는 `denies` 메서드를 사용하면 됩니다. 현재 인증된 사용자를 이 메서드에 전달할 필요는 없습니다. Laravel이 자동으로 게이트 클로저에 사용자를 전달해줍니다. 일반적으로 권한이 필요한 액션을 수행하기 전에 애플리케이션의 컨트롤러 내에서 게이트 권한 부여 메서드를 호출합니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * 주어진 게시글을 업데이트합니다.
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        if (! Gate::allows('update-post', $post)) {
            abort(403);
        }

        // 게시글을 업데이트...

        return redirect('/posts');
    }
}
```

현재 인증된 사용자 이외의 사용자가 액션을 수행할 권한이 있는지 확인하고 싶다면, `Gate` 파사드의 `forUser` 메서드를 사용할 수 있습니다:

```php
if (Gate::forUser($user)->allows('update-post', $post)) {
    // 해당 사용자가 게시글을 업데이트할 수 있습니다...
}

if (Gate::forUser($user)->denies('update-post', $post)) {
    // 해당 사용자가 게시글을 업데이트할 수 없습니다...
}
```

`any` 또는 `none` 메서드를 사용하여 여러 액션에 대해 한 번에 권한을 부여할 수도 있습니다:

```php
if (Gate::any(['update-post', 'delete-post'], $post)) {
    // 사용자가 게시글을 업데이트하거나 삭제할 수 있습니다...
}

if (Gate::none(['update-post', 'delete-post'], $post)) {
    // 사용자가 게시글을 업데이트하거나 삭제할 수 없습니다...
}
```


#### 권한 부여 또는 예외 발생 {#authorizing-or-throwing-exceptions}

특정 작업에 대한 권한을 시도하고, 사용자가 해당 작업을 수행할 수 없는 경우 자동으로 `Illuminate\Auth\Access\AuthorizationException` 예외를 발생시키고 싶다면, `Gate` 파사드의 `authorize` 메서드를 사용할 수 있습니다. `AuthorizationException` 인스턴스는 Laravel에 의해 자동으로 403 HTTP 응답으로 변환됩니다:

```php
Gate::authorize('update-post', $post);

// 작업이 허가되었습니다...
```


#### 추가 컨텍스트 제공 {#gates-supplying-additional-context}

권한 부여를 위한 게이트 메서드들(`allows`, `denies`, `check`, `any`, `none`, `authorize`, `can`, `cannot`)과 권한 부여 [Blade 지시문](#via-blade-templates)들(`@can`, `@cannot`, `@canany`)은 두 번째 인자로 배열을 받을 수 있습니다. 이 배열의 요소들은 게이트 클로저의 파라미터로 전달되며, 권한 부여 결정을 내릴 때 추가적인 컨텍스트로 사용할 수 있습니다:

```php
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::define('create-post', function (User $user, Category $category, bool $pinned) {
    if (! $user->canPublishToGroup($category->group)) {
        return false;
    } elseif ($pinned && ! $user->canPinPosts()) {
        return false;
    }

    return true;
});

if (Gate::check('create-post', [$category, $pinned])) {
    // 사용자가 게시글을 생성할 수 있습니다...
}
```


### 게이트 응답 {#gate-responses}

지금까지 우리는 단순한 불리언 값을 반환하는 게이트만 살펴보았습니다. 그러나 때로는 오류 메시지를 포함한 더 자세한 응답을 반환하고 싶을 수 있습니다. 이를 위해 게이트에서 `Illuminate\Auth\Access\Response`를 반환할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

Gate::define('edit-settings', function (User $user) {
    return $user->isAdmin
        ? Response::allow()
        : Response::deny('관리자여야 합니다.');
});
```

게이트에서 인가 응답을 반환하더라도, `Gate::allows` 메서드는 여전히 단순한 불리언 값을 반환합니다. 그러나 `Gate::inspect` 메서드를 사용하면 게이트에서 반환된 전체 인가 응답을 확인할 수 있습니다:

```php
$response = Gate::inspect('edit-settings');

if ($response->allowed()) {
    // 이 동작은 인가되었습니다...
} else {
    echo $response->message();
}
```

동작이 인가되지 않은 경우 `AuthorizationException`을 발생시키는 `Gate::authorize` 메서드를 사용할 때, 인가 응답에서 제공된 오류 메시지가 HTTP 응답으로 전달됩니다:

```php
Gate::authorize('edit-settings');

// 이 동작은 인가되었습니다...
```


#### HTTP 응답 상태 커스터마이징 {#customizing-gate-response-status}

Gate를 통해 액션이 거부되면 기본적으로 `403` HTTP 응답이 반환됩니다. 하지만 때로는 다른 HTTP 상태 코드를 반환하는 것이 유용할 수 있습니다. 권한 부여 검사에 실패했을 때 반환되는 HTTP 상태 코드는 `Illuminate\Auth\Access\Response` 클래스의 `denyWithStatus` 정적 생성자를 사용하여 커스터마이즈할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

Gate::define('edit-settings', function (User $user) {
    return $user->isAdmin
        ? Response::allow()
        : Response::denyWithStatus(404);
});
```

웹 애플리케이션에서 `404` 응답을 통해 리소스를 숨기는 패턴이 매우 흔하기 때문에, 편의를 위해 `denyAsNotFound` 메서드도 제공됩니다:

```php
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;

Gate::define('edit-settings', function (User $user) {
    return $user->isAdmin
        ? Response::allow()
        : Response::denyAsNotFound();
});
```


### 게이트 검사 가로채기 {#intercepting-gate-checks}

때때로, 특정 사용자에게 모든 권한을 부여하고 싶을 수 있습니다. 이럴 때는 `before` 메서드를 사용하여 모든 권한 검사 전에 실행되는 클로저를 정의할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::before(function (User $user, string $ability) {
    if ($user->isAdministrator()) {
        return true;
    }
});
```

`before` 클로저가 null이 아닌 값을 반환하면, 그 값이 권한 검사 결과로 간주됩니다.

모든 권한 검사 후에 실행되는 클로저를 정의하려면 `after` 메서드를 사용할 수 있습니다:

```php
use App\Models\User;

Gate::after(function (User $user, string $ability, bool|null $result, mixed $arguments) {
    if ($user->isAdministrator()) {
        return true;
    }
});
```

`after` 클로저에서 반환된 값은 게이트나 정책이 `null`을 반환한 경우를 제외하고는 권한 검사 결과를 덮어쓰지 않습니다.


### 인라인 인가 {#inline-authorization}

때때로, 현재 인증된 사용자가 특정 작업을 수행할 권한이 있는지 확인하고 싶지만, 해당 작업에 대응하는 전용 게이트를 작성하고 싶지 않을 수 있습니다. 라라벨은 `Gate::allowIf` 및 `Gate::denyIf` 메서드를 통해 이러한 종류의 "인라인" 인가 검사를 수행할 수 있도록 지원합니다. 인라인 인가는 정의된 ["before" 또는 "after" 인가 훅](#intercepting-gate-checks)을 실행하지 않습니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

Gate::allowIf(fn (User $user) => $user->isAdministrator());

Gate::denyIf(fn (User $user) => $user->banned());
```

만약 해당 작업이 인가되지 않았거나, 현재 인증된 사용자가 없다면, 라라벨은 자동으로 `Illuminate\Auth\Access\AuthorizationException` 예외를 발생시킵니다. `AuthorizationException` 인스턴스는 라라벨의 예외 핸들러에 의해 자동으로 403 HTTP 응답으로 변환됩니다.


## 정책 생성하기 {#creating-policies}


### 정책 생성하기 {#generating-policies}

정책(Policy)은 특정 모델이나 리소스에 대한 인가(authorization) 로직을 정리하는 클래스입니다. 예를 들어, 애플리케이션이 블로그라면, `App\Models\Post` 모델과 게시글 생성이나 수정과 같은 사용자 행동을 인가하는 `App\Policies\PostPolicy`를 가질 수 있습니다.

`make:policy` Artisan 명령어를 사용하여 정책을 생성할 수 있습니다. 생성된 정책 클래스는 `app/Policies` 디렉터리에 위치하게 됩니다. 만약 이 디렉터리가 애플리케이션에 없다면, Laravel이 자동으로 생성해줍니다:

```shell
php artisan make:policy PostPolicy
```

`make:policy` 명령어는 비어 있는 정책 클래스를 생성합니다. 리소스의 조회, 생성, 수정, 삭제와 관련된 예시 정책 메서드가 포함된 클래스를 생성하고 싶다면, 명령어 실행 시 `--model` 옵션을 제공할 수 있습니다:

```shell
php artisan make:policy PostPolicy --model=Post
```


### 정책 등록하기 {#registering-policies}


#### 정책 자동 발견 {#policy-discovery}

기본적으로 Laravel은 모델과 정책이 표준 Laravel 네이밍 규칙을 따르기만 하면 정책을 자동으로 발견합니다. 구체적으로, 정책 클래스는 모델을 포함하는 디렉터리와 같거나 그 상위에 있는 `Policies` 디렉터리에 위치해야 합니다. 예를 들어, 모델이 `app/Models` 디렉터리에 있고 정책이 `app/Policies` 디렉터리에 있을 수 있습니다. 이 경우, Laravel은 먼저 `app/Models/Policies`에서 정책을 찾고, 그 다음 `app/Policies`에서 찾습니다. 또한, 정책 클래스의 이름은 모델 이름과 일치해야 하며, `Policy` 접미사가 붙어야 합니다. 따라서 `User` 모델은 `UserPolicy` 정책 클래스와 매칭됩니다.

정책 자동 발견 로직을 직접 정의하고 싶다면, `Gate::guessPolicyNamesUsing` 메서드를 사용하여 커스텀 정책 발견 콜백을 등록할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Gate;

Gate::guessPolicyNamesUsing(function (string $modelClass) {
    // 주어진 모델에 대한 정책 클래스 이름을 반환합니다...
});
```


#### 정책 수동 등록 {#manually-registering-policies}

`Gate` 파사드를 사용하여, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 정책과 해당 모델을 수동으로 등록할 수 있습니다:

```php
use App\Models\Order;
use App\Policies\OrderPolicy;
use Illuminate\Support\Facades\Gate;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Gate::policy(Order::class, OrderPolicy::class);
}
```

또는, 모델 클래스에 `UsePolicy` 속성을 지정하여 해당 모델의 정책을 Laravel에 알릴 수도 있습니다:

```php
<?php

namespace App\Models;

use App\Policies\OrderPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;

#[UsePolicy(OrderPolicy::class)]
class Order extends Model
{
    //
}
```


## 정책 작성하기 {#writing-policies}


### 정책 메서드 {#policy-methods}

정책 클래스가 등록되면, 각 액션을 허가하는 메서드를 추가할 수 있습니다. 예를 들어, 주어진 `App\Models\User`가 주어진 `App\Models\Post` 인스턴스를 업데이트할 수 있는지 결정하는 `PostPolicy`의 `update` 메서드를 정의해봅시다.

`update` 메서드는 `User`와 `Post` 인스턴스를 인자로 받아, 해당 사용자가 주어진 `Post`를 업데이트할 권한이 있는지 여부를 나타내는 `true` 또는 `false`를 반환해야 합니다. 이 예제에서는 사용자의 `id`가 게시글의 `user_id`와 일치하는지 확인합니다:

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * 주어진 게시글이 사용자가 업데이트할 수 있는지 결정합니다.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```

정책에서 허가하는 다양한 액션에 대해 필요에 따라 추가 메서드를 계속 정의할 수 있습니다. 예를 들어, 다양한 `Post` 관련 액션을 허가하기 위해 `view`나 `delete` 메서드를 정의할 수 있지만, 정책 메서드의 이름은 자유롭게 지정할 수 있습니다.

Artisan 콘솔을 통해 정책을 생성할 때 `--model` 옵션을 사용했다면, 이미 `viewAny`, `view`, `create`, `update`, `delete`, `restore`, `forceDelete` 액션에 대한 메서드가 포함되어 있을 것입니다.

> [!NOTE]
> 모든 정책은 Laravel [서비스 컨테이너](/docs/{{version}}/container)를 통해 해석되므로, 정책의 생성자에서 필요한 의존성을 타입힌트하면 자동으로 주입받을 수 있습니다.


### 정책 응답 {#policy-responses}

지금까지 우리는 단순한 불리언 값을 반환하는 정책 메서드만 살펴보았습니다. 하지만 때로는 오류 메시지를 포함한 더 자세한 응답을 반환하고 싶을 수 있습니다. 이를 위해 정책 메서드에서 `Illuminate\Auth\Access\Response` 인스턴스를 반환할 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * 주어진 게시글을 사용자가 수정할 수 있는지 판단합니다.
 */
public function update(User $user, Post $post): Response
{
    return $user->id === $post->user_id
        ? Response::allow()
        : Response::deny('이 게시글의 소유자가 아닙니다.');
}
```

정책에서 인가 응답을 반환할 때, `Gate::allows` 메서드는 여전히 단순한 불리언 값을 반환합니다. 하지만, `Gate::inspect` 메서드를 사용하면 게이트에서 반환된 전체 인가 응답을 얻을 수 있습니다:

```php
use Illuminate\Support\Facades\Gate;

$response = Gate::inspect('update', $post);

if ($response->allowed()) {
    // 이 동작은 인가되었습니다...
} else {
    echo $response->message();
}
```

인가되지 않은 경우 예외를 발생시키는 `Gate::authorize` 메서드를 사용할 때, 인가 응답에서 제공된 오류 메시지가 HTTP 응답으로 전달됩니다:

```php
Gate::authorize('update', $post);

// 이 동작은 인가되었습니다...
```


#### HTTP 응답 상태 커스터마이징 {#customizing-policy-response-status}

정책 메서드를 통해 액션이 거부될 때는 기본적으로 `403` HTTP 응답이 반환됩니다. 하지만 경우에 따라 다른 HTTP 상태 코드를 반환하는 것이 유용할 수 있습니다. 실패한 인가 검사에 대해 반환되는 HTTP 상태 코드는 `Illuminate\Auth\Access\Response` 클래스의 `denyWithStatus` 정적 생성자를 사용하여 커스터마이즈할 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * 주어진 게시글을 사용자가 수정할 수 있는지 판단합니다.
 */
public function update(User $user, Post $post): Response
{
    return $user->id === $post->user_id
        ? Response::allow()
        : Response::denyWithStatus(404);
}
```

웹 애플리케이션에서 `404` 응답을 통해 리소스를 숨기는 패턴이 매우 흔하기 때문에, 편의를 위해 `denyAsNotFound` 메서드도 제공됩니다:

```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * 주어진 게시글을 사용자가 수정할 수 있는지 판단합니다.
 */
public function update(User $user, Post $post): Response
{
    return $user->id === $post->user_id
        ? Response::allow()
        : Response::denyAsNotFound();
}
```


### 모델이 없는 메서드 {#methods-without-models}

일부 정책 메서드는 현재 인증된 사용자 인스턴스만을 전달받습니다. 이러한 상황은 주로 `create` 액션을 인가할 때 가장 많이 발생합니다. 예를 들어, 블로그를 만들고 있다면 사용자가 게시글을 생성할 수 있는 권한이 있는지 확인하고 싶을 수 있습니다. 이런 경우, 정책 메서드는 사용자 인스턴스만을 인자로 받도록 작성해야 합니다:

```php
/**
 * 주어진 사용자가 게시글을 생성할 수 있는지 판단합니다.
 */
public function create(User $user): bool
{
    return $user->role == 'writer';
}
```


### 게스트 사용자 {#guest-users}

기본적으로, 모든 게이트와 정책은 인증된 사용자가 아닌 경우 들어오는 HTTP 요청에 대해 자동으로 `false`를 반환합니다. 그러나 "옵셔널" 타입 힌트를 선언하거나 사용자 인자 정의에 `null` 기본값을 제공함으로써 이러한 인가 검사가 게이트와 정책에 전달되도록 허용할 수 있습니다:

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * 주어진 게시글이 해당 사용자에 의해 수정될 수 있는지 판단합니다.
     */
    public function update(?User $user, Post $post): bool
    {
        return $user?->id === $post->user_id;
    }
}
```


### 정책 필터 {#policy-filters}

특정 사용자에 대해, 주어진 정책 내의 모든 동작을 허용하고 싶을 수 있습니다. 이를 위해 정책에 `before` 메서드를 정의하세요. `before` 메서드는 정책의 다른 어떤 메서드보다 먼저 실행되며, 실제로 의도된 정책 메서드가 호출되기 전에 동작을 허가할 기회를 제공합니다. 이 기능은 주로 애플리케이션 관리자가 모든 동작을 수행할 수 있도록 허가할 때 사용됩니다:

```php
use App\Models\User;

/**
 * 사전 인가(authorization) 체크를 수행합니다.
 */
public function before(User $user, string $ability): bool|null
{
    if ($user->isAdministrator()) {
        return true;
    }

    return null;
}
```

특정 유형의 사용자에 대해 모든 인가(authorization) 검사를 거부하고 싶다면, `before` 메서드에서 `false`를 반환하면 됩니다. `null`이 반환되면, 인가 검사는 정책 메서드로 넘어가게 됩니다.

> [!WARNING]
> 정책 클래스에 검사하려는 권한 이름과 일치하는 메서드가 포함되어 있지 않으면, 해당 클래스의 `before` 메서드는 호출되지 않습니다.


## 정책을 사용한 액션 권한 부여 {#authorizing-actions-using-policies}


### 사용자 모델을 통한 방법 {#via-the-user-model}

Laravel 애플리케이션에 기본으로 포함된 `App\Models\User` 모델에는 권한 부여를 위한 두 가지 유용한 메서드인 `can`과 `cannot`이 있습니다. `can`과 `cannot` 메서드는 권한을 확인하고자 하는 액션의 이름과 관련 모델을 인자로 받습니다. 예를 들어, 사용자가 특정 `App\Models\Post` 모델을 업데이트할 권한이 있는지 확인해보겠습니다. 일반적으로 이는 컨트롤러 메서드 내에서 수행됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * 주어진 게시글을 업데이트합니다.
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        if ($request->user()->cannot('update', $post)) {
            abort(403);
        }

        // 게시글을 업데이트합니다...

        return redirect('/posts');
    }
}
```

해당 모델에 대해 [정책이 등록](#registering-policies)되어 있다면, `can` 메서드는 자동으로 적절한 정책을 호출하고 불리언 결과를 반환합니다. 만약 모델에 대한 정책이 등록되어 있지 않다면, `can` 메서드는 주어진 액션 이름과 일치하는 클로저 기반 Gate를 호출하려고 시도합니다.


#### 모델이 필요하지 않은 액션 {#user-model-actions-that-dont-require-models}

일부 액션은 `create`와 같이 모델 인스턴스가 필요하지 않은 정책 메서드에 해당할 수 있습니다. 이러한 경우에는 `can` 메서드에 클래스 이름을 전달할 수 있습니다. 클래스 이름은 해당 액션을 인가할 때 어떤 정책을 사용할지 결정하는 데 사용됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * 게시글 생성.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->cannot('create', Post::class)) {
            abort(403);
        }

        // 게시글 생성...

        return redirect('/posts');
    }
}
```


### `Gate` 파사드 사용하기 {#via-the-gate-facade}

`App\Models\User` 모델에 제공되는 유용한 메서드 외에도, 항상 `Gate` 파사드의 `authorize` 메서드를 통해 액션을 인가할 수 있습니다.

`can` 메서드와 마찬가지로, 이 메서드는 인가하려는 액션의 이름과 관련 모델을 인수로 받습니다. 만약 액션이 인가되지 않으면, `authorize` 메서드는 `Illuminate\Auth\Access\AuthorizationException` 예외를 발생시키며, 이 예외는 라라벨 예외 핸들러에 의해 자동으로 403 상태 코드의 HTTP 응답으로 변환됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * 주어진 블로그 포스트를 업데이트합니다.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        // 현재 사용자가 블로그 포스트를 업데이트할 수 있습니다...

        return redirect('/posts');
    }
}
```


#### 모델이 필요하지 않은 액션 {#controller-actions-that-dont-require-models}

앞서 설명한 것처럼, `create`와 같은 일부 정책 메서드는 모델 인스턴스를 필요로 하지 않습니다. 이러한 경우에는 `authorize` 메서드에 클래스 이름을 전달해야 합니다. 클래스 이름은 해당 액션을 인가할 때 어떤 정책을 사용할지 결정하는 데 사용됩니다:

```php
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * 새로운 블로그 포스트를 생성합니다.
 *
 * @throws \Illuminate\Auth\Access\AuthorizationException
 */
public function create(Request $request): RedirectResponse
{
    Gate::authorize('create', Post::class);

    // 현재 사용자는 블로그 포스트를 생성할 수 있습니다...

    return redirect('/posts');
}
```


### 미들웨어를 통한 권한 부여 {#via-middleware}

Laravel에는 들어오는 요청이 라우트나 컨트롤러에 도달하기 전에 동작을 승인할 수 있는 미들웨어가 포함되어 있습니다. 기본적으로, `Illuminate\Auth\Middleware\Authorize` 미들웨어는 `can` [미들웨어 별칭](/docs/{{version}}/middleware#middleware-aliases)를 사용하여 라우트에 연결할 수 있으며, 이 별칭은 Laravel에 의해 자동으로 등록됩니다. `can` 미들웨어를 사용하여 사용자가 게시글을 수정할 수 있는지 권한을 부여하는 예제를 살펴보겠습니다:

```php
use App\Models\Post;

Route::put('/post/{post}', function (Post $post) {
    // 현재 사용자가 게시글을 수정할 수 있습니다...
})->middleware('can:update,post');
```

이 예제에서는 `can` 미들웨어에 두 개의 인수를 전달하고 있습니다. 첫 번째는 승인하려는 동작의 이름이고, 두 번째는 정책 메서드에 전달하려는 라우트 파라미터입니다. 이 경우, [암시적 모델 바인딩](/docs/{{version}}/routing#implicit-binding)을 사용하고 있으므로, `App\Models\Post` 모델이 정책 메서드에 전달됩니다. 사용자가 해당 동작을 수행할 권한이 없으면, 미들웨어는 403 상태 코드의 HTTP 응답을 반환합니다.

편의를 위해, `can` 미들웨어를 `can` 메서드를 사용하여 라우트에 연결할 수도 있습니다:

```php
use App\Models\Post;

Route::put('/post/{post}', function (Post $post) {
    // 현재 사용자가 게시글을 수정할 수 있습니다...
})->can('update', 'post');
```


#### 모델이 필요하지 않은 액션 {#middleware-actions-that-dont-require-models}

다시 말해, `create`와 같은 일부 정책 메서드는 모델 인스턴스를 필요로 하지 않습니다. 이러한 경우에는 미들웨어에 클래스 이름을 전달할 수 있습니다. 클래스 이름은 해당 액션을 인가할 때 어떤 정책을 사용할지 결정하는 데 사용됩니다:

```php
Route::post('/post', function () {
    // 현재 사용자가 게시글을 생성할 수 있습니다...
})->middleware('can:create,App\Models\Post');
```

문자열 미들웨어 정의 내에 전체 클래스 이름을 지정하는 것은 번거로울 수 있습니다. 이러한 이유로, `can` 미들웨어를 `can` 메서드를 사용하여 라우트에 연결할 수도 있습니다:

```php
use App\Models\Post;

Route::post('/post', function () {
    // 현재 사용자가 게시글을 생성할 수 있습니다...
})->can('create', Post::class);
```


### Blade 템플릿을 통한 사용 {#via-blade-templates}

Blade 템플릿을 작성할 때, 사용자가 특정 작업을 수행할 권한이 있을 때만 페이지의 일부를 표시하고 싶을 수 있습니다. 예를 들어, 사용자가 실제로 게시글을 수정할 수 있을 때만 블로그 게시글의 수정 폼을 보여주고 싶을 수 있습니다. 이런 상황에서는 `@can` 및 `@cannot` 지시어를 사용할 수 있습니다:

```blade
@can('update', $post)
    <!-- 현재 사용자가 게시글을 수정할 수 있습니다... -->
@elsecan('create', App\Models\Post::class)
    <!-- 현재 사용자가 새 게시글을 생성할 수 있습니다... -->
@else
    <!-- ... -->
@endcan

@cannot('update', $post)
    <!-- 현재 사용자가 게시글을 수정할 수 없습니다... -->
@elsecannot('create', App\Models\Post::class)
    <!-- 현재 사용자가 새 게시글을 생성할 수 없습니다... -->
@endcannot
```

이 지시어들은 `@if` 및 `@unless` 문을 작성하는 데 편리한 단축키입니다. 위의 `@can` 및 `@cannot` 문은 다음과 같은 문과 동일합니다:

```blade
@if (Auth::user()->can('update', $post))
    <!-- 현재 사용자가 게시글을 수정할 수 있습니다... -->
@endif

@unless (Auth::user()->can('update', $post))
    <!-- 현재 사용자가 게시글을 수정할 수 없습니다... -->
@endunless
```

또한, 주어진 작업 배열 중 하나라도 사용자가 수행할 권한이 있는지 확인할 수도 있습니다. 이를 위해서는 `@canany` 지시어를 사용하세요:

```blade
@canany(['update', 'view', 'delete'], $post)
    <!-- 현재 사용자가 게시글을 수정, 조회 또는 삭제할 수 있습니다... -->
@elsecanany(['create'], \App\Models\Post::class)
    <!-- 현재 사용자가 게시글을 생성할 수 있습니다... -->
@endcanany
```


#### 모델이 필요하지 않은 액션 {#blade-actions-that-dont-require-models}

다른 대부분의 인가 메서드와 마찬가지로, 액션에 모델 인스턴스가 필요하지 않은 경우 `@can` 및 `@cannot` 디렉티브에 클래스 이름을 전달할 수 있습니다:

```blade
@can('create', App\Models\Post::class)
    <!-- 현재 사용자가 게시물을 생성할 수 있습니다... -->
@endcan

@cannot('create', App\Models\Post::class)
    <!-- 현재 사용자가 게시물을 생성할 수 없습니다... -->
@endcannot
```


### 추가 컨텍스트 제공 {#supplying-additional-context}

정책(Policy)을 사용하여 액션을 인가할 때, 다양한 인가 함수와 헬퍼에 두 번째 인수로 배열을 전달할 수 있습니다. 배열의 첫 번째 요소는 어떤 정책이 호출될지 결정하는 데 사용되며, 나머지 배열 요소들은 정책 메서드의 파라미터로 전달되어 인가 결정을 내릴 때 추가 컨텍스트로 활용할 수 있습니다. 예를 들어, 다음과 같이 추가 `$category` 파라미터를 포함하는 `PostPolicy` 메서드 정의를 살펴보겠습니다:

```php
/**
 * 주어진 게시글을 사용자가 수정할 수 있는지 판단합니다.
 */
public function update(User $user, Post $post, int $category): bool
{
    return $user->id === $post->user_id &&
           $user->canUpdateCategory($category);
}
```

인증된 사용자가 특정 게시글을 수정할 수 있는지 확인하려면, 다음과 같이 이 정책 메서드를 호출할 수 있습니다:

```php
/**
 * 주어진 블로그 게시글을 수정합니다.
 *
 * @throws \Illuminate\Auth\Access\AuthorizationException
 */
public function update(Request $request, Post $post): RedirectResponse
{
    Gate::authorize('update', [$post, $request->category]);

    // 현재 사용자가 블로그 게시글을 수정할 수 있습니다...

    return redirect('/posts');
}
```


## 권한 부여 & Inertia {#authorization-and-inertia}

권한 부여는 항상 서버에서 처리되어야 하지만, 프론트엔드 애플리케이션이 애플리케이션의 UI를 적절하게 렌더링할 수 있도록 권한 데이터를 제공하는 것이 편리할 때가 많습니다. Laravel은 Inertia 기반 프론트엔드에 권한 정보를 노출하는 데 필요한 규칙을 정의하지 않습니다.

하지만, Laravel의 Inertia 기반 [스타터 키트](/docs/{{version}}/starter-kits) 중 하나를 사용하고 있다면, 애플리케이션에는 이미 `HandleInertiaRequests` 미들웨어가 포함되어 있습니다. 이 미들웨어의 `share` 메서드 내에서, 애플리케이션의 모든 Inertia 페이지에 제공될 공유 데이터를 반환할 수 있습니다. 이 공유 데이터는 사용자에 대한 권한 정보를 정의하기에 편리한 위치가 될 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    // ...

    /**
     * 기본적으로 공유되는 props를 정의합니다.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request)
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => [
                    'post' => [
                        'create' => $request->user()->can('create', Post::class),
                    ],
                ],
            ],
        ];
    }
}
```
