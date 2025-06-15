# 미들웨어













## 소개 {#introduction}

미들웨어는 애플리케이션에 들어오는 HTTP 요청을 검사하고 필터링할 수 있는 편리한 메커니즘을 제공합니다. 예를 들어, Laravel에는 사용자가 인증되었는지 확인하는 미들웨어가 포함되어 있습니다. 사용자가 인증되지 않은 경우, 미들웨어는 사용자를 애플리케이션의 로그인 화면으로 리디렉션합니다. 반면, 사용자가 인증된 경우에는 미들웨어가 요청이 애플리케이션 내부로 더 진행될 수 있도록 허용합니다.

인증 외에도 다양한 작업을 수행하는 추가 미들웨어를 작성할 수 있습니다. 예를 들어, 로깅 미들웨어는 애플리케이션에 들어오는 모든 요청을 기록할 수 있습니다. Laravel에는 인증 및 CSRF 보호를 위한 미들웨어 등 다양한 미들웨어가 기본적으로 포함되어 있습니다. 하지만, 사용자가 직접 정의한 모든 미들웨어는 일반적으로 애플리케이션의 `app/Http/Middleware` 디렉터리에 위치합니다.


## 미들웨어 정의하기 {#defining-middleware}

새로운 미들웨어를 생성하려면 `make:middleware` Artisan 명령어를 사용하세요:

```shell
php artisan make:middleware EnsureTokenIsValid
```

이 명령어는 새로운 `EnsureTokenIsValid` 클래스를 `app/Http/Middleware` 디렉터리에 생성합니다. 이 미들웨어에서는 전달된 `token` 입력값이 지정된 값과 일치할 때만 해당 라우트에 접근을 허용합니다. 그렇지 않으면 사용자를 `/home` URI로 리디렉션합니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->input('token') !== 'my-secret-token') {
            return redirect('/home');
        }

        return $next($request);
    }
}
```

위 예시에서 볼 수 있듯이, 전달된 `token`이 우리의 비밀 토큰과 일치하지 않으면 미들웨어는 클라이언트에게 HTTP 리디렉션을 반환합니다. 그렇지 않으면 요청이 애플리케이션 내부로 더 전달됩니다. 요청을 더 깊이 전달하려면(즉, 미들웨어를 "통과"시키려면) `$next` 콜백에 `$request`를 전달해야 합니다.

미들웨어는 HTTP 요청이 애플리케이션에 도달하기 전에 반드시 통과해야 하는 일련의 "레이어"로 생각하는 것이 가장 좋습니다. 각 레이어는 요청을 검사하고, 필요하다면 요청을 완전히 거부할 수도 있습니다.

> [!NOTE]
> 모든 미들웨어는 [서비스 컨테이너](/laravel/12.x/container)를 통해 해석되므로, 미들웨어의 생성자에서 필요한 의존성을 타입힌트로 지정할 수 있습니다.


#### 미들웨어와 응답 {#middleware-and-responses}

물론, 미들웨어는 요청을 애플리케이션 내부로 더 전달하기 **전**이나 **후**에 작업을 수행할 수 있습니다. 예를 들어, 아래의 미들웨어는 요청이 애플리케이션에서 처리되기 **전**에 어떤 작업을 수행합니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BeforeMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // 작업 수행

        return $next($request);
    }
}
```

반면, 아래의 미들웨어는 요청이 애플리케이션에서 처리된 **후**에 작업을 수행합니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AfterMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // 작업 수행

        return $response;
    }
}
```


## 미들웨어 등록하기 {#registering-middleware}


### 전역 미들웨어 {#global-middleware}

애플리케이션의 모든 HTTP 요청에서 미들웨어가 실행되도록 하려면, `bootstrap/app.php` 파일의 전역 미들웨어 스택에 해당 미들웨어를 추가하면 됩니다:

```php
use App\Http\Middleware\EnsureTokenIsValid;

->withMiddleware(function (Middleware $middleware) {
     $middleware->append(EnsureTokenIsValid::class);
})
```

`withMiddleware` 클로저에 전달되는 `$middleware` 객체는 `Illuminate\Foundation\Configuration\Middleware`의 인스턴스이며, 애플리케이션의 라우트에 할당된 미들웨어를 관리하는 역할을 합니다. `append` 메서드는 미들웨어를 전역 미들웨어 목록의 끝에 추가합니다. 만약 미들웨어를 목록의 맨 앞에 추가하고 싶다면, `prepend` 메서드를 사용하면 됩니다.


#### Laravel의 기본 전역 미들웨어 수동 관리 {#manually-managing-laravels-default-global-middleware}

Laravel의 전역 미들웨어 스택을 직접 관리하고 싶다면, `use` 메서드에 Laravel의 기본 전역 미들웨어 스택을 전달할 수 있습니다. 그런 다음, 필요에 따라 기본 미들웨어 스택을 조정할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->use([
        \Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks::class,
        // \Illuminate\Http\Middleware\TrustHosts::class,
        \Illuminate\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ]);
})
```


### 미들웨어를 라우트에 할당하기 {#assigning-middleware-to-routes}

특정 라우트에 미들웨어를 할당하고 싶다면, 라우트를 정의할 때 `middleware` 메서드를 호출하면 됩니다:

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::get('/profile', function () {
    // ...
})->middleware(EnsureTokenIsValid::class);
```

여러 개의 미들웨어를 라우트에 할당하려면, `middleware` 메서드에 미들웨어 이름의 배열을 전달하면 됩니다:

```php
Route::get('/', function () {
    // ...
})->middleware([First::class, Second::class]);
```


#### 미들웨어 제외하기 {#excluding-middleware}

라우트 그룹에 미들웨어를 할당할 때, 때로는 그룹 내의 특정 라우트에서 해당 미들웨어가 적용되지 않도록 해야 할 수도 있습니다. 이럴 때는 `withoutMiddleware` 메서드를 사용할 수 있습니다:

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::get('/', function () {
        // ...
    });

    Route::get('/profile', function () {
        // ...
    })->withoutMiddleware([EnsureTokenIsValid::class]);
});
```

또한, 특정 미들웨어 집합을 [라우트 그룹](/laravel/12.x/routing#route-groups) 전체에서 제외할 수도 있습니다:

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::withoutMiddleware([EnsureTokenIsValid::class])->group(function () {
    Route::get('/profile', function () {
        // ...
    });
});
```

`withoutMiddleware` 메서드는 라우트 미들웨어만 제거할 수 있으며, [전역 미들웨어](#global-middleware)에는 적용되지 않습니다.


### 미들웨어 그룹 {#middleware-groups}

여러 개의 미들웨어를 하나의 키로 묶어서 라우트에 더 쉽게 할당하고 싶을 때가 있습니다. 이럴 때는 애플리케이션의 `bootstrap/app.php` 파일에서 `appendToGroup` 메서드를 사용하면 됩니다:

```php
use App\Http\Middleware\First;
use App\Http\Middleware\Second;

->withMiddleware(function (Middleware $middleware) {
    $middleware->appendToGroup('group-name', [
        First::class,
        Second::class,
    ]);

    $middleware->prependToGroup('group-name', [
        First::class,
        Second::class,
    ]);
})
```

미들웨어 그룹은 개별 미들웨어와 동일한 문법으로 라우트나 컨트롤러 액션에 할당할 수 있습니다:

```php
Route::get('/', function () {
    // ...
})->middleware('group-name');

Route::middleware(['group-name'])->group(function () {
    // ...
});
```


#### Laravel의 기본 미들웨어 그룹 {#laravels-default-middleware-groups}

Laravel에는 웹과 API 라우트에 적용할 수 있는 공통 미들웨어를 포함한 사전 정의된 `web` 및 `api` 미들웨어 그룹이 있습니다. Laravel은 이 미들웨어 그룹들을 각각 `routes/web.php`와 `routes/api.php` 파일에 자동으로 적용합니다:

<div class="overflow-auto">

| `web` 미들웨어 그룹                                             |
|-----------------------------------------------------------|
| `Illuminate\Cookie\Middleware\EncryptCookies`             |
| `Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse` |
| `Illuminate\Session\Middleware\StartSession`              |
| `Illuminate\View\Middleware\ShareErrorsFromSession`       |
| `Illuminate\Foundation\Http\Middleware\ValidateCsrfToken` |
| `Illuminate\Routing\Middleware\SubstituteBindings`        |

</div>

<div class="overflow-auto">

| `api` 미들웨어 그룹                                      |
|----------------------------------------------------|
| `Illuminate\Routing\Middleware\SubstituteBindings` |

</div>

이 그룹에 미들웨어를 추가하거나 앞에 삽입하고 싶다면, 애플리케이션의 `bootstrap/app.php` 파일에서 `web` 및 `api` 메서드를 사용할 수 있습니다. `web`과 `api` 메서드는 `appendToGroup` 메서드의 편리한 대안입니다:

```php
use App\Http\Middleware\EnsureTokenIsValid;
use App\Http\Middleware\EnsureUserIsSubscribed;

->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        EnsureUserIsSubscribed::class,
    ]);

    $middleware->api(prepend: [
        EnsureTokenIsValid::class,
    ]);
})
```

Laravel의 기본 미들웨어 그룹 항목 중 하나를 사용자 정의 미들웨어로 교체할 수도 있습니다:

```php
use App\Http\Middleware\StartCustomSession;
use Illuminate\Session\Middleware\StartSession;

$middleware->web(replace: [
    StartSession::class => StartCustomSession::class,
]);
```

또는, 미들웨어를 완전히 제거할 수도 있습니다:

```php
$middleware->web(remove: [
    StartSession::class,
]);
```


#### Laravel의 기본 미들웨어 그룹 수동 관리 {#manually-managing-laravels-default-middleware-groups}

Laravel의 기본 `web` 및 `api` 미들웨어 그룹에 포함된 모든 미들웨어를 직접 관리하고 싶다면, 그룹을 완전히 재정의할 수 있습니다. 아래 예시는 `web`과 `api` 미들웨어 그룹을 기본 미들웨어로 정의하며, 필요에 따라 자유롭게 커스터마이즈할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->group('web', [
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        // \Illuminate\Session\Middleware\AuthenticateSession::class,
    ]);

    $middleware->group('api', [
        // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // 'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);
})
```

> [!NOTE]
> 기본적으로 `web`과 `api` 미들웨어 그룹은 `bootstrap/app.php` 파일에 의해 애플리케이션의 각 `routes/web.php`와 `routes/api.php` 파일에 자동으로 적용됩니다.


### 미들웨어 별칭 {#middleware-aliases}

애플리케이션의 `bootstrap/app.php` 파일에서 미들웨어에 별칭을 지정할 수 있습니다. 미들웨어 별칭을 사용하면 특정 미들웨어 클래스에 짧은 이름을 부여할 수 있어, 클래스 이름이 긴 미들웨어를 사용할 때 특히 유용합니다:

```php
use App\Http\Middleware\EnsureUserIsSubscribed;

->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'subscribed' => EnsureUserIsSubscribed::class
    ]);
})
```

한 번 별칭이 `bootstrap/app.php` 파일에 정의되면, 라우트에 미들웨어를 할당할 때 해당 별칭을 사용할 수 있습니다:

```php
Route::get('/profile', function () {
    // ...
})->middleware('subscribed');
```

편의를 위해, Laravel의 일부 내장 미들웨어는 기본적으로 별칭이 지정되어 있습니다. 예를 들어, `auth` 미들웨어는 `Illuminate\Auth\Middleware\Authenticate` 미들웨어의 별칭입니다. 아래는 기본 미들웨어 별칭 목록입니다:

<div class="overflow-auto">

| 별칭                 | 미들웨어                                                                                                          |
|--------------------|---------------------------------------------------------------------------------------------------------------|
| `auth`             | `Illuminate\Auth\Middleware\Authenticate`                                                                     |
| `auth.basic`       | `Illuminate\Auth\Middleware\AuthenticateWithBasicAuth`                                                        |
| `auth.session`     | `Illuminate\Session\Middleware\AuthenticateSession`                                                           |
| `cache.headers`    | `Illuminate\Http\Middleware\SetCacheHeaders`                                                                  |
| `can`              | `Illuminate\Auth\Middleware\Authorize`                                                                        |
| `guest`            | `Illuminate\Auth\Middleware\RedirectIfAuthenticated`                                                          |
| `password.confirm` | `Illuminate\Auth\Middleware\RequirePassword`                                                                  |
| `precognitive`     | `Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests`                                            |
| `signed`           | `Illuminate\Routing\Middleware\ValidateSignature`                                                             |
| `subscribed`       | `\Spark\Http\Middleware\VerifyBillableIsSubscribed`                                                           |
| `throttle`         | `Illuminate\Routing\Middleware\ThrottleRequests` 또는 `Illuminate\Routing\Middleware\ThrottleRequestsWithRedis` |
| `verified`         | `Illuminate\Auth\Middleware\EnsureEmailIsVerified`                                                            |

</div>


### 미들웨어 정렬 {#sorting-middleware}

드물게, 미들웨어가 특정 순서로 실행되어야 하지만 라우트에 할당할 때 그 순서를 제어할 수 없는 경우가 있습니다. 이런 상황에서는 애플리케이션의 `bootstrap/app.php` 파일에서 `priority` 메서드를 사용해 미들웨어의 우선순위를 지정할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->priority([
        \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        \Illuminate\Routing\Middleware\ThrottleRequests::class,
        \Illuminate\Routing\Middleware\ThrottleRequestsWithRedis::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class,
        \Illuminate\Auth\Middleware\Authorize::class,
    ]);
})
```


## 미들웨어 파라미터 {#middleware-parameters}

미들웨어는 추가적인 파라미터도 받을 수 있습니다. 예를 들어, 애플리케이션에서 인증된 사용자가 특정 "역할(role)"을 가지고 있는지 확인해야 한다면, 역할 이름을 추가 인자로 받는 `EnsureUserHasRole` 미들웨어를 만들 수 있습니다.

추가 미들웨어 파라미터는 `$next` 인자 뒤에 전달됩니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! $request->user()->hasRole($role)) {
            // 리디렉션 등 처리...
        }

        return $next($request);
    }
}
```

미들웨어 파라미터는 라우트를 정의할 때, 미들웨어 이름과 파라미터를 `:`로 구분하여 지정할 수 있습니다:

```php
use App\Http\Middleware\EnsureUserHasRole;

Route::put('/post/{id}', function (string $id) {
    // ...
})->middleware(EnsureUserHasRole::class.':editor');
```

여러 개의 파라미터는 쉼표로 구분할 수 있습니다:

```php
Route::put('/post/{id}', function (string $id) {
    // ...
})->middleware(EnsureUserHasRole::class.':editor,publisher');
```


## 종료 가능한(Terminable) 미들웨어 {#terminable-middleware}

때때로 미들웨어가 HTTP 응답이 브라우저로 전송된 후에 작업을 수행해야 할 수도 있습니다. 미들웨어에 `terminate` 메서드를 정의하고, 웹 서버가 FastCGI를 사용 중이라면, 응답이 브라우저로 전송된 후 `terminate` 메서드가 자동으로 호출됩니다:

```php
<?php

namespace Illuminate\Session\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TerminatingMiddleware
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * 응답이 브라우저로 전송된 후 작업을 처리합니다.
     */
    public function terminate(Request $request, Response $response): void
    {
        // ...
    }
}
```

`terminate` 메서드는 요청과 응답을 모두 받아야 합니다. 종료 가능한 미들웨어를 정의했다면, 애플리케이션의 `bootstrap/app.php` 파일에서 해당 미들웨어를 라우트 또는 전역 미들웨어 목록에 추가해야 합니다.

미들웨어의 `terminate` 메서드를 호출할 때, Laravel은 [서비스 컨테이너](/laravel/12.x/container)에서 새로운 미들웨어 인스턴스를 해석합니다. 만약 `handle`과 `terminate` 메서드가 호출될 때 동일한 미들웨어 인스턴스를 사용하고 싶다면, 컨테이너의 `singleton` 메서드를 사용해 미들웨어를 등록해야 합니다. 일반적으로 이는 `AppServiceProvider`의 `register` 메서드에서 처리합니다:

```php
use App\Http\Middleware\TerminatingMiddleware;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->app->singleton(TerminatingMiddleware::class);
}
```
