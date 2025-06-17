# 라우팅
































## 기본 라우팅 {#basic-routing}

가장 기본적인 Laravel 라우트는 URI와 클로저를 받아, 복잡한 라우팅 설정 파일 없이도 매우 간단하고 직관적으로 라우트와 동작을 정의할 수 있는 방법을 제공합니다:

```php
use Illuminate\Support\Facades\Route;

Route::get('/greeting', function () {
    return 'Hello World';
});
```


### 기본 라우트 파일 {#the-default-route-files}

모든 Laravel 라우트는 `routes` 디렉터리에 위치한 라우트 파일에서 정의됩니다. 이 파일들은 애플리케이션의 `bootstrap/app.php` 파일에 지정된 설정을 통해 Laravel에 의해 자동으로 로드됩니다. `routes/web.php` 파일은 웹 인터페이스를 위한 라우트를 정의합니다. 이 라우트들은 세션 상태와 CSRF 보호와 같은 기능을 제공하는 `web` [미들웨어 그룹](/laravel/12.x/middleware#laravels-default-middleware-groups)에 할당됩니다.

대부분의 애플리케이션에서는 `routes/web.php` 파일에 라우트를 정의하는 것부터 시작합니다. `routes/web.php`에 정의된 라우트는 브라우저에서 해당 라우트의 URL을 입력하여 접근할 수 있습니다. 예를 들어, 아래와 같은 라우트는 브라우저에서 `http://example.com/user`로 접속하여 접근할 수 있습니다:

```php
use App\Http\Controllers\UserController;

Route::get('/user', [UserController::class, 'index']);
```


#### API 라우트 {#api-routes}

애플리케이션에서 상태를 저장하지 않는(stateless) API도 제공하려면, `install:api` Artisan 명령어를 사용하여 API 라우팅을 활성화할 수 있습니다:

```shell
php artisan install:api
```

`install:api` 명령어는 [Laravel Sanctum](/laravel/12.x/sanctum)을 설치합니다. Sanctum은 서드파티 API 소비자, SPA, 모바일 애플리케이션 인증에 사용할 수 있는 강력하면서도 간단한 API 토큰 인증 가드를 제공합니다. 또한, `install:api` 명령어는 `routes/api.php` 파일을 생성합니다:

```php
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

`routes/api.php`에 정의된 라우트는 상태를 저장하지 않으며, `api` [미들웨어 그룹](/laravel/12.x/middleware#laravels-default-middleware-groups)에 할당됩니다. 또한, 이 라우트들에는 `/api` URI 접두사가 자동으로 적용되므로, 파일 내의 각 라우트에 직접 접두사를 지정할 필요가 없습니다. 접두사를 변경하려면 애플리케이션의 `bootstrap/app.php` 파일을 수정하면 됩니다:

```php
->withRouting(
    api: **DIR**.'/../routes/api.php',
    apiPrefix: 'api/admin',
    // ...
)
```


#### 사용 가능한 라우터 메서드 {#available-router-methods}

라우터는 모든 HTTP 메서드에 응답하는 라우트를 등록할 수 있도록 지원합니다:

```php
Route::get($uri, $callback);
Route::post($uri, $callback);
Route::put($uri, $callback);
Route::patch($uri, $callback);
Route::delete($uri, $callback);
Route::options($uri, $callback);
```

때로는 여러 HTTP 메서드에 응답하는 라우트를 등록해야 할 수도 있습니다. 이럴 때는 `match` 메서드를 사용할 수 있습니다. 또는, `any` 메서드를 사용하여 모든 HTTP 메서드에 응답하는 라우트를 등록할 수도 있습니다:

```php
Route::match(['get', 'post'], '/', function () {
    // ...
});

Route::any('/', function () {
    // ...
});
```

> [!NOTE]
> 동일한 URI를 공유하는 여러 라우트를 정의할 때, `get`, `post`, `put`, `patch`, `delete`, `options` 메서드를 사용하는 라우트는 `any`, `match`, `redirect` 메서드를 사용하는 라우트보다 먼저 정의해야 합니다. 이렇게 해야 들어오는 요청이 올바른 라우트와 매칭됩니다.


#### 의존성 주입 {#dependency-injection}

라우트의 콜백 시그니처에서 필요한 의존성을 타입힌트로 지정할 수 있습니다. 선언된 의존성은 Laravel [서비스 컨테이너](/laravel/12.x/container)에 의해 자동으로 해결되어 콜백에 주입됩니다. 예를 들어, 현재 HTTP 요청을 자동으로 라우트 콜백에 주입받으려면 `Illuminate\Http\Request` 클래스를 타입힌트로 지정할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/users', function (Request $request) {
    // ...
});
```


#### CSRF 보호 {#csrf-protection}

`web` 라우트 파일에 정의된 `POST`, `PUT`, `PATCH`, 또는 `DELETE` 라우트를 대상으로 하는 모든 HTML 폼에는 반드시 CSRF 토큰 필드가 포함되어야 합니다. 그렇지 않으면 요청이 거부됩니다. CSRF 보호에 대한 자세한 내용은 [CSRF 문서](/laravel/12.x/csrf)에서 확인할 수 있습니다:

```blade
<form method="POST" action="/profile">
    @csrf
    ...
</form>
```


### 리다이렉트 라우트 {#redirect-routes}

다른 URI로 리다이렉트하는 라우트를 정의할 때는 `Route::redirect` 메서드를 사용할 수 있습니다. 이 메서드는 간단한 리다이렉트를 위해 전체 라우트나 컨트롤러를 정의하지 않아도 되는 편리한 단축 방법을 제공합니다:

```php
Route::redirect('/here', '/there');
```

기본적으로 `Route::redirect`는 `302` 상태 코드를 반환합니다. 선택적인 세 번째 매개변수를 사용하여 상태 코드를 커스터마이즈할 수 있습니다:

```php
Route::redirect('/here', '/there', 301);
```

또는, `Route::permanentRedirect` 메서드를 사용하여 `301` 상태 코드를 반환할 수도 있습니다:

```php
Route::permanentRedirect('/here', '/there');
```

> [!WARNING]
> 리다이렉트 라우트에서 라우트 파라미터를 사용할 때, `destination`과 `status` 파라미터는 Laravel에서 예약되어 있으므로 사용할 수 없습니다.


### 뷰 라우트 {#view-routes}

라우트가 단순히 [뷰](/laravel/12.x/views)만 반환하면 될 경우, `Route::view` 메서드를 사용할 수 있습니다. 이 메서드는 `redirect` 메서드처럼 전체 라우트나 컨트롤러를 정의하지 않아도 되는 간단한 단축 방법을 제공합니다. `view` 메서드는 첫 번째 인자로 URI, 두 번째 인자로 뷰 이름을 받습니다. 또한, 선택적인 세 번째 인자로 뷰에 전달할 데이터를 배열로 넘길 수 있습니다:

```php
Route::view('/welcome', 'welcome');

Route::view('/welcome', 'welcome', ['name' => 'Taylor']);
```

> [!WARNING]
> 뷰 라우트에서 라우트 파라미터를 사용할 때, `view`, `data`, `status`, `headers` 파라미터는 Laravel에서 예약되어 있으므로 사용할 수 없습니다.


### 라우트 목록 확인하기 {#listing-your-routes}

`route:list` Artisan 명령어를 사용하면 애플리케이션에 정의된 모든 라우트의 개요를 쉽게 확인할 수 있습니다:

```shell
php artisan route:list
```

기본적으로 각 라우트에 할당된 미들웨어는 `route:list` 출력에 표시되지 않습니다. 하지만, 명령어에 `-v` 옵션을 추가하면 라우트 미들웨어와 미들웨어 그룹 이름을 표시하도록 Laravel에 지시할 수 있습니다:

```shell
php artisan route:list -v

# 미들웨어 그룹을 확장하려면...
php artisan route:list -vv
```

특정 URI로 시작하는 라우트만 표시하도록 Laravel에 지시할 수도 있습니다:

```shell
php artisan route:list --path=api
```

또한, `route:list` 명령어 실행 시 `--except-vendor` 옵션을 제공하면 서드파티 패키지에서 정의한 라우트를 숨길 수 있습니다:

```shell
php artisan route:list --except-vendor
```

마찬가지로, `--only-vendor` 옵션을 제공하면 서드파티 패키지에서 정의한 라우트만 표시하도록 할 수 있습니다:

```shell
php artisan route:list --only-vendor
```


### 라우팅 커스터마이징 {#routing-customization}

기본적으로 애플리케이션의 라우트는 `bootstrap/app.php` 파일에서 설정되고 로드됩니다:

```php
<?php

use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: **DIR**.'/../routes/web.php',
        commands: **DIR**.'/../routes/console.php',
        health: '/up',
    )->create();
```

하지만, 애플리케이션의 라우트 일부를 별도의 파일에 정의하고 싶을 때가 있습니다. 이를 위해 `withRouting` 메서드에 `then` 클로저를 전달할 수 있습니다. 이 클로저 안에서 애플리케이션에 필요한 추가 라우트를 등록할 수 있습니다:

```php
use Illuminate\Support\Facades\Route;

->withRouting(
    web: **DIR**.'/../routes/web.php',
    commands: **DIR**.'/../routes/console.php',
    health: '/up',
    then: function () {
        Route::middleware('api')
            ->prefix('webhooks')
            ->name('webhooks.')
            ->group(base_path('routes/webhooks.php'));
    },
)
```

또는, `withRouting` 메서드에 `using` 클로저를 전달하여 라우트 등록을 완전히 직접 제어할 수도 있습니다. 이 인자를 전달하면 프레임워크가 HTTP 라우트를 자동으로 등록하지 않으며, 모든 라우트를 직접 수동으로 등록해야 합니다:

```php
use Illuminate\Support\Facades\Route;

->withRouting(
    commands: **DIR**.'/../routes/console.php',
    using: function () {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    },
)
```


## 라우트 파라미터 {#route-parameters}


### 필수 파라미터 {#required-parameters}

때때로 라우트에서 URI의 일부를 캡처해야 할 때가 있습니다. 예를 들어, URL에서 사용자의 ID를 캡처해야 할 수 있습니다. 이럴 때는 라우트 파라미터를 정의하여 사용할 수 있습니다:

```php
Route::get('/user/{id}', function (string $id) {
    return 'User '.$id;
});
```

라우트에 필요한 만큼 여러 개의 라우트 파라미터를 정의할 수 있습니다:

```php
Route::get('/posts/{post}/comments/{comment}', function (string $postId, string $commentId) {
    // ...
});
```

라우트 파라미터는 항상 `{}` 중괄호로 감싸야 하며, 알파벳 문자로 구성되어야 합니다. 파라미터 이름에는 밑줄(`_`)도 사용할 수 있습니다. 라우트 파라미터는 정의된 순서대로 라우트 콜백이나 컨트롤러에 주입되며, 콜백이나 컨트롤러의 인자 이름은 중요하지 않습니다.


#### 파라미터와 의존성 주입 {#parameters-and-dependency-injection}

라우트에 Laravel 서비스 컨테이너가 자동으로 주입해주길 원하는 의존성이 있다면, 해당 의존성 뒤에 라우트 파라미터를 나열해야 합니다:

```php
use Illuminate\Http\Request;

Route::get('/user/{id}', function (Request $request, string $id) {
    return 'User '.$id;
});
```


### 선택적 파라미터 {#parameters-optional-parameters}

가끔 URI에 항상 존재하지 않을 수도 있는 라우트 파라미터를 지정해야 할 때가 있습니다. 이럴 때는 파라미터 이름 뒤에 `?` 기호를 붙이면 됩니다. 그리고 해당 라우트의 변수에 기본값을 반드시 지정해주어야 합니다:

```php
Route::get('/user/{name?}', function (?string $name = null) {
    return $name;
});

Route::get('/user/{name?}', function (?string $name = 'John') {
    return $name;
});
```


### 정규 표현식 제약 조건 {#parameters-regular-expression-constraints}

라우트 인스턴스의 `where` 메서드를 사용하여 라우트 파라미터의 형식을 제약할 수 있습니다. `where` 메서드는 파라미터 이름과 해당 파라미터에 적용할 정규 표현식을 인자로 받습니다:

```php
Route::get('/user/{name}', function (string $name) {
    // ...
})->where('name', '[A-Za-z]+');

Route::get('/user/{id}', function (string $id) {
    // ...
})->where('id', '[0-9]+');

Route::get('/user/{id}/{name}', function (string $id, string $name) {
    // ...
})->where(['id' => '[0-9]+', 'name' => '[a-z]+']);
```

편의를 위해, 자주 사용되는 정규 표현식 패턴은 헬퍼 메서드로도 제공되어 라우트에 패턴 제약을 빠르게 추가할 수 있습니다:

```php
Route::get('/user/{id}/{name}', function (string $id, string $name) {
    // ...
})->whereNumber('id')->whereAlpha('name');

Route::get('/user/{name}', function (string $name) {
    // ...
})->whereAlphaNumeric('name');

Route::get('/user/{id}', function (string $id) {
    // ...
})->whereUuid('id');

Route::get('/user/{id}', function (string $id) {
    // ...
})->whereUlid('id');

Route::get('/category/{category}', function (string $category) {
    // ...
})->whereIn('category', ['movie', 'song', 'painting']);

Route::get('/category/{category}', function (string $category) {
    // ...
})->whereIn('category', CategoryEnum::cases());
```

들어오는 요청이 라우트 패턴 제약 조건과 일치하지 않으면, 404 HTTP 응답이 반환됩니다.


#### 전역 제약 조건 {#parameters-global-constraints}

특정 라우트 파라미터에 항상 정규 표현식 제약을 적용하고 싶다면, `pattern` 메서드를 사용할 수 있습니다. 이러한 패턴은 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 정의해야 합니다:

```php
use Illuminate\Support\Facades\Route;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Route::pattern('id', '[0-9]+');
}
```

이렇게 패턴을 정의하면, 해당 파라미터 이름을 사용하는 모든 라우트에 자동으로 적용됩니다:

```php
Route::get('/user/{id}', function (string $id) {
    // {id}가 숫자일 때만 실행됩니다...
});
```


#### 인코딩된 슬래시(/) 허용 {#parameters-encoded-forward-slashes}

Laravel 라우팅 컴포넌트는 라우트 파라미터 값에 `/`를 제외한 모든 문자를 허용합니다. 만약 `/`를 플레이스홀더의 일부로 허용하고 싶다면, `where` 조건의 정규 표현식을 사용해 명시적으로 허용해야 합니다:

```php
Route::get('/search/{search}', function (string $search) {
    return $search;
})->where('search', '.*');
```

> [!WARNING]
> 인코딩된 슬래시는 마지막 라우트 세그먼트에서만 지원됩니다.


## 네임드 라우트 {#named-routes}

네임드 라우트를 사용하면 특정 라우트에 대해 URL이나 리다이렉트를 편리하게 생성할 수 있습니다. 라우트 정의에 `name` 메서드를 체이닝하여 라우트에 이름을 지정할 수 있습니다:

```php
Route::get('/user/profile', function () {
    // ...
})->name('profile');
```

컨트롤러 액션에도 라우트 이름을 지정할 수 있습니다:

```php
Route::get(
    '/user/profile',
    [UserProfileController::class, 'show']
)->name('profile');
```

> [!WARNING]
> 라우트 이름은 항상 고유해야 합니다.


#### 네임드 라우트로 URL 생성하기 {#generating-urls-to-named-routes}

특정 라우트에 이름을 지정한 후에는, Laravel의 `route` 및 `redirect` 헬퍼 함수를 사용하여 해당 라우트의 이름으로 URL이나 리다이렉트를 생성할 수 있습니다:

```php
// URL 생성...
$url = route('profile');

// 리다이렉트 생성...
return redirect()->route('profile');

return to_route('profile');
```

네임드 라우트에 파라미터가 정의되어 있다면, `route` 함수의 두 번째 인자로 파라미터를 전달할 수 있습니다. 전달된 파라미터는 자동으로 생성된 URL의 올바른 위치에 삽입됩니다:

```php
Route::get('/user/{id}/profile', function (string $id) {
    // ...
})->name('profile');

$url = route('profile', ['id' => 1]);
```

배열에 추가적인 파라미터를 전달하면, 해당 키/값 쌍이 자동으로 생성된 URL의 쿼리 문자열에 추가됩니다:

```php
Route::get('/user/{id}/profile', function (string $id) {
    // ...
})->name('profile');

$url = route('profile', ['id' => 1, 'photos' => 'yes']);

// /user/1/profile?photos=yes
```

> [!NOTE]
> 때로는 현재 로케일과 같이 요청 전체에서 사용할 URL 파라미터의 기본값을 지정하고 싶을 수 있습니다. 이를 위해 [URL::defaults 메서드](/laravel/12.x/urls#default-values)를 사용할 수 있습니다.


#### 현재 라우트 확인하기 {#inspecting-the-current-route}

현재 요청이 특정 네임드 라우트로 라우팅되었는지 확인하려면, Route 인스턴스의 `named` 메서드를 사용할 수 있습니다. 예를 들어, 라우트 미들웨어에서 현재 라우트 이름을 확인할 수 있습니다:

```php
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * 들어오는 요청을 처리합니다.
 *
 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
 */
public function handle(Request $request, Closure $next): Response
{
    if ($request->route()->named('profile')) {
        // ...
    }

    return $next($request);
}
```


## 라우트 그룹 {#route-groups}

라우트 그룹을 사용하면 미들웨어와 같은 라우트 속성을 여러 라우트에 걸쳐 공유할 수 있어, 각 라우트마다 해당 속성을 개별적으로 정의할 필요가 없습니다.

중첩된 그룹은 상위 그룹의 속성과 "지능적으로 병합"되도록 동작합니다. 미들웨어와 `where` 조건은 병합되고, 이름(name)과 접두사(prefix)는 덧붙여집니다. 네임스페이스 구분자와 URI 접두사의 슬래시는 적절한 위치에 자동으로 추가됩니다.


### 미들웨어 {#route-group-middleware}

그룹 내의 모든 라우트에 [미들웨어](/laravel/12.x/middleware)를 지정하려면, 그룹을 정의하기 전에 `middleware` 메서드를 사용할 수 있습니다. 미들웨어는 배열에 나열된 순서대로 실행됩니다:

```php
Route::middleware(['first', 'second'])->group(function () {
    Route::get('/', function () {
        // first와 second 미들웨어를 사용합니다...
    });

    Route::get('/user/profile', function () {
        // first와 second 미들웨어를 사용합니다...
    });
});
```


### 컨트롤러 {#route-group-controllers}

여러 라우트가 모두 동일한 [컨트롤러](/laravel/12.x/controllers)를 사용할 경우, `controller` 메서드를 사용해 그룹 내 모든 라우트에 공통 컨트롤러를 지정할 수 있습니다. 이후 라우트를 정의할 때는 호출할 컨트롤러 메서드만 지정하면 됩니다:

```php
use App\Http\Controllers\OrderController;

Route::controller(OrderController::class)->group(function () {
    Route::get('/orders/{id}', 'show');
    Route::post('/orders', 'store');
});
```


### 서브도메인 라우팅 {#route-group-subdomain-routing}

라우트 그룹은 서브도메인 라우팅을 처리하는 데에도 사용할 수 있습니다. 서브도메인에도 라우트 URI처럼 라우트 파라미터를 지정할 수 있어, 서브도메인의 일부를 라우트나 컨트롤러에서 사용할 수 있습니다. 서브도메인은 그룹을 정의하기 전에 `domain` 메서드를 호출하여 지정할 수 있습니다:

```php
Route::domain('{account}.example.com')->group(function () {
    Route::get('/user/{id}', function (string $account, string $id) {
        // ...
    });
});
```

> [!WARNING]
> 서브도메인 라우트가 정상적으로 동작하려면, 루트 도메인 라우트보다 먼저 서브도메인 라우트를 등록해야 합니다. 이렇게 하면 동일한 URI 경로를 가진 루트 도메인 라우트가 서브도메인 라우트를 덮어쓰는 것을 방지할 수 있습니다.


### 라우트 접두사 {#route-group-prefixes}

`prefix` 메서드를 사용하면 그룹 내의 각 라우트에 지정한 URI 접두사를 붙일 수 있습니다. 예를 들어, 그룹 내 모든 라우트 URI에 `admin` 접두사를 붙이고 싶을 때 사용할 수 있습니다:

```php
Route::prefix('admin')->group(function () {
    Route::get('/users', function () {
        // "/admin/users" URL과 매칭됩니다
    });
});
```


### 라우트 이름 접두사 {#route-group-name-prefixes}

`name` 메서드를 사용하면 그룹 내의 각 라우트 이름에 지정한 문자열을 접두사로 붙일 수 있습니다. 예를 들어, 그룹 내 모든 라우트 이름에 `admin` 접두사를 붙이고 싶을 때 사용할 수 있습니다. 지정한 문자열이 그대로 라우트 이름 앞에 붙으므로, 접미사로 `.` 문자를 포함하는 것이 좋습니다:

```php
Route::name('admin.')->group(function () {
    Route::get('/users', function () {
        // "admin.users"라는 라우트 이름이 할당됩니다...
    })->name('users');
});
```


## 라우트 모델 바인딩 {#route-model-binding}

라우트나 컨트롤러 액션에 모델 ID를 주입할 때, 해당 ID에 해당하는 모델을 데이터베이스에서 조회하는 경우가 많습니다. Laravel의 라우트 모델 바인딩을 사용하면, 모델 인스턴스를 라우트에 자동으로 주입할 수 있어 매우 편리합니다. 예를 들어, 사용자의 ID를 주입하는 대신, 해당 ID와 일치하는 전체 `User` 모델 인스턴스를 바로 주입받을 수 있습니다.


### 암시적 바인딩 {#implicit-binding}

Laravel은 라우트나 컨트롤러 액션에서 타입힌트된 변수 이름이 라우트 세그먼트 이름과 일치할 경우, 해당 Eloquent 모델을 자동으로 해결해줍니다. 예를 들어:

```php
use App\Models\User;

Route::get('/users/{user}', function (User $user) {
    return $user->email;
});
```

여기서 `$user` 변수는 `App\Models\User` Eloquent 모델로 타입힌트되어 있고, 변수 이름이 `{user}` URI 세그먼트와 일치하므로, Laravel은 요청 URI에서 전달된 값과 ID가 일치하는 모델 인스턴스를 자동으로 주입합니다. 만약 일치하는 모델 인스턴스를 데이터베이스에서 찾지 못하면, 404 HTTP 응답이 자동으로 반환됩니다.

물론, 컨트롤러 메서드를 사용할 때도 암시적 바인딩이 가능합니다. 이때도 `{user}` URI 세그먼트가 컨트롤러의 `$user` 변수와 일치하며, 이 변수는 `App\Models\User` 타입힌트를 가지고 있습니다:

```php
use App\Http\Controllers\UserController;
use App\Models\User;

// 라우트 정의...
Route::get('/users/{user}', [UserController::class, 'show']);

// 컨트롤러 메서드 정의...
public function show(User $user)
{
    return view('user.profile', ['user' => $user]);
}
```


#### 소프트 삭제된 모델 {#implicit-soft-deleted-models}

일반적으로 암시적 모델 바인딩은 [소프트 삭제](/laravel/12.x/eloquent#soft-deleting)된 모델을 조회하지 않습니다. 하지만, 라우트 정의에 `withTrashed` 메서드를 체이닝하면 소프트 삭제된 모델도 조회할 수 있습니다:

```php
use App\Models\User;

Route::get('/users/{user}', function (User $user) {
    return $user->email;
})->withTrashed();
```


#### 기본 키 커스터마이징 {#customizing-the-default-key-name}

때로는 `id`가 아닌 다른 컬럼을 사용해 Eloquent 모델을 조회하고 싶을 수 있습니다. 이럴 때는 라우트 파라미터 정의에서 사용할 컬럼을 지정할 수 있습니다:

```php
use App\Models\Post;

Route::get('/posts/{post:slug}', function (Post $post) {
    return $post;
});
```

특정 모델 클래스를 조회할 때 항상 `id`가 아닌 다른 데이터베이스 컬럼을 사용하고 싶다면, Eloquent 모델에서 `getRouteKeyName` 메서드를 오버라이드하면 됩니다:

```php
/**
 * 모델의 라우트 키를 반환합니다.
 */
public function getRouteKeyName(): string
{
    return 'slug';
}
```


#### 커스텀 키와 스코핑 {#implicit-model-binding-scoping}

하나의 라우트 정의에서 여러 Eloquent 모델을 암시적으로 바인딩할 때, 두 번째 Eloquent 모델이 반드시 이전 Eloquent 모델의 자식이어야 하는 경우가 있습니다. 예를 들어, 특정 사용자의 블로그 포스트를 슬러그로 조회하는 다음과 같은 라우트 정의를 생각해볼 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;

Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post;
});
```

커스텀 키를 사용한 암시적 바인딩이 중첩 라우트 파라미터로 사용될 때, Laravel은 관례에 따라 부모 모델의 관계 이름을 추측하여 쿼리를 자동으로 스코프 처리합니다. 위 예시에서는 `User` 모델에 `posts`(라우트 파라미터 이름의 복수형)라는 관계가 있다고 가정하고, 이를 통해 `Post` 모델을 조회합니다.

원한다면, 커스텀 키를 지정하지 않아도 "자식" 바인딩이 스코프되도록 Laravel에 지시할 수 있습니다. 이를 위해 라우트 정의 시 `scopeBindings` 메서드를 호출하면 됩니다:

```php
use App\Models\Post;
use App\Models\User;

Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    return $post;
})->scopeBindings();
```

또는, 라우트 그룹 전체에 대해 스코프 바인딩을 적용할 수도 있습니다:

```php
Route::scopeBindings()->group(function () {
    Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
        return $post;
    });
});
```

반대로, `withoutScopedBindings` 메서드를 호출하여 바인딩 스코프를 명시적으로 비활성화할 수도 있습니다:

```php
Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post;
})->withoutScopedBindings();
```


#### 모델이 없을 때의 동작 커스터마이징 {#customizing-missing-model-behavior}

일반적으로 암시적으로 바인딩된 모델을 찾을 수 없으면 404 HTTP 응답이 반환됩니다. 하지만, 라우트 정의 시 `missing` 메서드를 호출하여 이 동작을 커스터마이징할 수 있습니다. `missing` 메서드는 암시적으로 바인딩된 모델을 찾지 못했을 때 호출되는 클로저를 인자로 받습니다:

```php
use App\Http\Controllers\LocationsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

Route::get('/locations/{location:slug}', [LocationsController::class, 'show'])
    ->name('locations.view')
    ->missing(function (Request $request) {
        return Redirect::route('locations.index');
    });
```


### 암시적 Enum 바인딩 {#implicit-enum-binding}

PHP 8.1에서는 [Enum](https://www.php.net/manual/en/language.enumerations.backed.php) 기능이 도입되었습니다. 이 기능을 보완하기 위해, Laravel에서는 라우트 정의에서 [문자열 기반 Enum](https://www.php.net/manual/en/language.enumerations.backed.php)을 타입힌트로 지정할 수 있으며, 해당 라우트 세그먼트가 유효한 Enum 값일 때만 라우트가 실행됩니다. 그렇지 않으면 404 HTTP 응답이 자동으로 반환됩니다. 예를 들어, 다음과 같은 Enum이 있다고 가정해봅시다:

```php
<?php

namespace App\Enums;

enum Category: string
{
    case Fruits = 'fruits';
    case People = 'people';
}
```

이제 `{category}` 라우트 세그먼트가 `fruits` 또는 `people`일 때만 라우트가 실행되도록 정의할 수 있습니다. 그렇지 않으면 Laravel은 404 HTTP 응답을 반환합니다:

```php
use App\Enums\Category;
use Illuminate\Support\Facades\Route;

Route::get('/categories/{category}', function (Category $category) {
    return $category->value;
});
```


### 명시적 바인딩 {#explicit-binding}

모델 바인딩을 사용할 때 Laravel의 암시적이고 관례 기반의 모델 해결 방식을 반드시 사용해야 하는 것은 아닙니다. 라우트 파라미터가 모델과 어떻게 매핑되는지 명시적으로 정의할 수도 있습니다. 명시적 바인딩을 등록하려면, 라우터의 `model` 메서드를 사용해 특정 파라미터에 대한 클래스를 지정하면 됩니다. 명시적 모델 바인딩은 `AppServiceProvider` 클래스의 `boot` 메서드 초반에 정의하는 것이 좋습니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Route;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Route::model('user', User::class);
}
```

그 다음, `{user}` 파라미터를 포함하는 라우트를 정의합니다:

```php
use App\Models\User;

Route::get('/users/{user}', function (User $user) {
    // ...
});
```

이제 모든 `{user}` 파라미터는 `App\Models\User` 모델에 바인딩되므로, 해당 클래스의 인스턴스가 라우트에 주입됩니다. 예를 들어, `users/1`로 요청하면 데이터베이스에서 ID가 `1`인 `User` 인스턴스가 주입됩니다.

만약 데이터베이스에서 일치하는 모델 인스턴스를 찾지 못하면, 404 HTTP 응답이 자동으로 반환됩니다.


#### 바인딩 로직 커스터마이징 {#customizing-the-resolution-logic}

모델 바인딩의 해결 로직을 직접 정의하고 싶다면, `Route::bind` 메서드를 사용할 수 있습니다. `bind` 메서드에 전달하는 클로저는 URI 세그먼트의 값을 받아, 라우트에 주입할 클래스의 인스턴스를 반환해야 합니다. 이 커스터마이징은 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 수행해야 합니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Route;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Route::bind('user', function (string $value) {
        return User::where('name', $value)->firstOrFail();
    });
}
```

또는, Eloquent 모델에서 `resolveRouteBinding` 메서드를 오버라이드할 수도 있습니다. 이 메서드는 URI 세그먼트의 값을 받아, 라우트에 주입할 클래스의 인스턴스를 반환해야 합니다:

```php
/**
 * 바인딩된 값에 대한 모델을 반환합니다.
 *
 * @param  mixed  $value
 * @param  string|null  $field
 * @return \Illuminate\Database\Eloquent\Model|null
 */
public function resolveRouteBinding($value, $field = null)
{
    return $this->where('name', $value)->firstOrFail();
}
```

라우트가 [암시적 바인딩 스코핑](#implicit-model-binding-scoping)을 사용하는 경우, 부모 모델의 자식 바인딩을 해결하기 위해 `resolveChildRouteBinding` 메서드가 사용됩니다:

```php
/**
 * 바인딩된 값에 대한 자식 모델을 반환합니다.
 *
 * @param  string  $childType
 * @param  mixed  $value
 * @param  string|null  $field
 * @return \Illuminate\Database\Eloquent\Model|null
 */
public function resolveChildRouteBinding($childType, $value, $field)
{
    return parent::resolveChildRouteBinding($childType, $value, $field);
}
```


## 폴백 라우트 {#fallback-routes}

`Route::fallback` 메서드를 사용하면, 들어오는 요청과 일치하는 다른 라우트가 없을 때 실행되는 라우트를 정의할 수 있습니다. 일반적으로 처리되지 않은 요청은 애플리케이션의 예외 핸들러를 통해 자동으로 "404" 페이지가 렌더링됩니다. 하지만, 보통 `fallback` 라우트는 `routes/web.php` 파일 내에 정의하므로, `web` 미들웨어 그룹의 모든 미들웨어가 이 라우트에도 적용됩니다. 필요에 따라 이 라우트에 추가 미들웨어를 자유롭게 지정할 수 있습니다:

```php
Route::fallback(function () {
    // ...
});
```


## 속도 제한(Rate Limiting) {#rate-limiting}


### 속도 제한기 정의하기 {#defining-rate-limiters}

Laravel은 강력하고 커스터마이즈 가능한 속도 제한 서비스를 제공하여, 특정 라우트 또는 라우트 그룹에 대한 트래픽 양을 제한할 수 있습니다. 먼저, 애플리케이션에 맞는 속도 제한기 설정을 정의해야 합니다.

속도 제한기는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드 내에서 정의할 수 있습니다:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
protected function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
}
```

속도 제한기는 `RateLimiter` 파사드의 `for` 메서드를 사용해 정의합니다. `for` 메서드는 속도 제한기 이름과, 해당 제한기가 할당된 라우트에 적용할 제한 설정을 반환하는 클로저를 인자로 받습니다. 제한 설정은 `Illuminate\Cache\RateLimiting\Limit` 클래스의 인스턴스입니다. 이 클래스는 제한을 빠르게 정의할 수 있도록 다양한 "빌더" 메서드를 제공합니다. 속도 제한기 이름은 원하는 아무 문자열이나 사용할 수 있습니다:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
protected function boot(): void
{
    RateLimiter::for('global', function (Request $request) {
        return Limit::perMinute(1000);
    });
}
```

들어오는 요청이 지정된 속도 제한을 초과하면, Laravel은 자동으로 429 HTTP 상태 코드가 포함된 응답을 반환합니다. 속도 제한에 의해 반환될 응답을 직접 정의하고 싶다면, `response` 메서드를 사용할 수 있습니다:

```php
RateLimiter::for('global', function (Request $request) {
    return Limit::perMinute(1000)->response(function (Request $request, array $headers) {
        return response('Custom response...', 429, $headers);
    });
});
```

속도 제한기 콜백은 들어오는 HTTP 요청 인스턴스를 받기 때문에, 요청 정보나 인증된 사용자에 따라 동적으로 적절한 속도 제한을 설정할 수 있습니다:

```php
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()->vipCustomer()
        ? Limit::none()
        : Limit::perMinute(100);
});
```


#### 속도 제한 세분화 {#segmenting-rate-limits}

때로는 임의의 값에 따라 속도 제한을 세분화하고 싶을 수 있습니다. 예를 들어, 각 IP 주소별로 특정 라우트를 분당 100회까지 허용하고 싶을 때가 있습니다. 이를 위해 제한을 설정할 때 `by` 메서드를 사용할 수 있습니다:

```php
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()->vipCustomer()
        ? Limit::none()
        : Limit::perMinute(100)->by($request->ip());
});
```

이 기능을 다른 예시로 설명하자면, 인증된 사용자 ID별로 분당 100회, 비회원(게스트)에게는 IP 주소별로 분당 10회로 접근을 제한할 수도 있습니다:

```php
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(100)->by($request->user()->id)
        : Limit::perMinute(10)->by($request->ip());
});
```


#### 다중 속도 제한 {#multiple-rate-limits}

필요하다면, 하나의 속도 제한기 설정에서 여러 개의 속도 제한을 배열로 반환할 수 있습니다. 배열에 정의된 순서대로 각 제한이 라우트에 대해 평가됩니다:

```php
RateLimiter::for('login', function (Request $request) {
    return [
        Limit::perMinute(500),
        Limit::perMinute(3)->by($request->input('email')),
    ];
});
```

동일한 `by` 값으로 세분화된 여러 속도 제한을 할당하는 경우, 각 `by` 값이 고유하도록 해야 합니다. 가장 쉬운 방법은 `by` 메서드에 전달하는 값에 접두사를 붙이는 것입니다:

```php
RateLimiter::for('uploads', function (Request $request) {
    return [
        Limit::perMinute(10)->by('minute:'.$request->user()->id),
        Limit::perDay(1000)->by('day:'.$request->user()->id),
    ];
});
```


### 라우트에 속도 제한기 적용하기 {#attaching-rate-limiters-to-routes}

속도 제한기는 `throttle` [미들웨어](/laravel/12.x/middleware)를 사용하여 라우트 또는 라우트 그룹에 적용할 수 있습니다. `throttle` 미들웨어에는 라우트에 할당할 속도 제한기의 이름을 전달합니다:

```php
Route::middleware(['throttle:uploads'])->group(function () {
    Route::post('/audio', function () {
        // ...
    });

    Route::post('/video', function () {
        // ...
    });
});
```


#### Redis를 이용한 속도 제한 {#throttling-with-redis}

기본적으로 `throttle` 미들웨어는 `Illuminate\Routing\Middleware\ThrottleRequests` 클래스에 매핑되어 있습니다. 하지만, 애플리케이션의 캐시 드라이버로 Redis를 사용한다면, Laravel이 속도 제한 관리를 Redis로 처리하도록 지정할 수 있습니다. 이를 위해 애플리케이션의 `bootstrap/app.php` 파일에서 `throttleWithRedis` 메서드를 사용하면 됩니다. 이 메서드는 `throttle` 미들웨어를 `Illuminate\Routing\Middleware\ThrottleRequestsWithRedis` 미들웨어 클래스로 매핑합니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->throttleWithRedis();
    // ...
})
```


## 폼 메서드 스푸핑 {#form-method-spoofing}

HTML 폼은 `PUT`, `PATCH`, `DELETE` 액션을 직접 지원하지 않습니다. 따라서 HTML 폼에서 `PUT`, `PATCH`, `DELETE` 라우트를 호출하려면, 폼에 숨겨진 `_method` 필드를 추가해야 합니다. 이 필드에 전달된 값이 HTTP 요청 메서드로 사용됩니다:

```blade
<form action="/example" method="POST">
    <input type="hidden" name="_method" value="PUT">
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
</form>
```

편의를 위해, `@method` [Blade 지시어](/laravel/12.x/blade)를 사용하여 `_method` 입력 필드를 생성할 수 있습니다:

```blade
<form action="/example" method="POST">
    @method('PUT')
    @csrf
</form>
```


## 현재 라우트 정보 접근하기 {#accessing-the-current-route}

`Route` 파사드의 `current`, `currentRouteName`, `currentRouteAction` 메서드를 사용하면, 들어오는 요청을 처리하는 라우트에 대한 정보를 확인할 수 있습니다:

```php
use Illuminate\Support\Facades\Route;

$route = Route::current(); // Illuminate\Routing\Route
$name = Route::currentRouteName(); // string
$action = Route::currentRouteAction(); // string
```

라우터와 라우트 클래스에서 사용할 수 있는 모든 메서드를 확인하려면, [Route 파사드의 기반 클래스](https://api.laravel.com/docs/12.x/Illuminate/Routing/Router.html)와 [Route 인스턴스](https://api.laravel.com/docs/12.x/Illuminate/Routing/Route.html)의 API 문서를 참고하세요.


## 교차 출처 리소스 공유(CORS) {#cors}

Laravel은 CORS `OPTIONS` HTTP 요청에 대해, 여러분이 설정한 값으로 자동으로 응답할 수 있습니다. `OPTIONS` 요청은 애플리케이션의 글로벌 미들웨어 스택에 자동으로 포함된 `HandleCors` [미들웨어](/laravel/12.x/middleware)에 의해 자동으로 처리됩니다.

때로는 애플리케이션의 CORS 설정 값을 커스터마이즈해야 할 수도 있습니다. 이럴 때는 `config:publish` Artisan 명령어를 사용해 `cors` 설정 파일을 퍼블리시할 수 있습니다:

```shell
php artisan config:publish cors
```

이 명령어를 실행하면 애플리케이션의 `config` 디렉터리에 `cors.php` 설정 파일이 생성됩니다.

> [!NOTE]
> CORS와 CORS 헤더에 대한 더 자세한 정보는 [MDN 웹 문서의 CORS 설명](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers)을 참고하세요.


## 라우트 캐싱 {#route-caching}

애플리케이션을 프로덕션 환경에 배포할 때는 Laravel의 라우트 캐시 기능을 활용하는 것이 좋습니다. 라우트 캐시를 사용하면 애플리케이션의 모든 라우트를 등록하는 데 걸리는 시간이 크게 단축됩니다. 라우트 캐시를 생성하려면 `route:cache` Artisan 명령어를 실행하세요:

```shell
php artisan route:cache
```

이 명령어를 실행하면, 모든 요청마다 캐시된 라우트 파일이 로드됩니다. 새로운 라우트를 추가했다면 반드시 라우트 캐시를 새로 생성해야 한다는 점을 기억하세요. 따라서 `route:cache` 명령어는 프로젝트 배포 시에만 실행하는 것이 좋습니다.

라우트 캐시를 삭제하려면 `route:clear` 명령어를 사용할 수 있습니다:

```shell
php artisan route:clear
```
