# 인증































## 소개 {#introduction}

많은 웹 애플리케이션은 사용자가 애플리케이션에 인증하고 "로그인"할 수 있는 방법을 제공합니다. 이 기능을 웹 애플리케이션에 구현하는 것은 복잡하고 잠재적으로 위험할 수 있습니다. 이러한 이유로, Laravel은 인증을 빠르고, 안전하며, 쉽게 구현할 수 있도록 필요한 도구를 제공합니다.

Laravel의 인증 기능은 기본적으로 "가드(guards)"와 "프로바이더(providers)"로 구성되어 있습니다. 가드는 각 요청에 대해 사용자가 어떻게 인증되는지 정의합니다. 예를 들어, Laravel은 세션 저장소와 쿠키를 사용하여 상태를 유지하는 `session` 가드를 기본으로 제공합니다.

프로바이더는 사용자를 영구 저장소에서 어떻게 가져올지 정의합니다. Laravel은 [Eloquent](/laravel/12.x/eloquent)와 데이터베이스 쿼리 빌더를 사용하여 사용자를 가져오는 기능을 기본으로 지원합니다. 하지만, 필요에 따라 애플리케이션에 추가 프로바이더를 자유롭게 정의할 수 있습니다.

애플리케이션의 인증 설정 파일은 `config/auth.php`에 위치합니다. 이 파일에는 Laravel의 인증 서비스 동작을 조정할 수 있는 여러 잘 문서화된 옵션이 포함되어 있습니다.

> [!NOTE]
> 가드와 프로바이더는 "역할(roles)"과 "권한(permissions)"과 혼동해서는 안 됩니다. 권한을 통한 사용자 액션 허가에 대해 더 알고 싶다면 [권한 부여](/laravel/12.x/authorization) 문서를 참고하세요.


### 스타터 키트 {#starter-kits}

빠르게 시작하고 싶으신가요? 새로운 Laravel 애플리케이션에 [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 설치하세요. 데이터베이스 마이그레이션 후, 브라우저에서 `/register` 또는 애플리케이션에 할당된 다른 URL로 이동하면 됩니다. 스타터 키트가 전체 인증 시스템의 스캐폴딩을 자동으로 처리해줍니다!

**최종 Laravel 애플리케이션에서 스타터 키트를 사용하지 않더라도, [스타터 키트](/laravel/12.x/starter-kits)를 설치해보면 실제 Laravel 프로젝트에서 모든 인증 기능을 어떻게 구현하는지 배울 수 있는 좋은 기회가 됩니다.** Laravel 스타터 키트에는 인증 컨트롤러, 라우트, 뷰가 포함되어 있으므로, 이 파일들의 코드를 살펴보며 Laravel의 인증 기능이 어떻게 구현되는지 배울 수 있습니다.


### 데이터베이스 고려사항 {#introduction-database-considerations}

기본적으로, Laravel은 `app/Models` 디렉터리에 `App\Models\User` [Eloquent 모델](/laravel/12.x/eloquent)을 포함하고 있습니다. 이 모델은 기본 Eloquent 인증 드라이버와 함께 사용할 수 있습니다.

애플리케이션에서 Eloquent를 사용하지 않는 경우, Laravel 쿼리 빌더를 사용하는 `database` 인증 프로바이더를 사용할 수 있습니다. MongoDB를 사용하는 경우, MongoDB의 공식 [Laravel 사용자 인증 문서](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/current/user-authentication/)를 참고하세요.

`App\Models\User` 모델의 데이터베이스 스키마를 만들 때, 비밀번호 컬럼이 최소 60자 이상인지 확인하세요. 물론, 새로운 Laravel 애플리케이션에 포함된 `users` 테이블 마이그레이션은 이미 이 길이를 초과하는 컬럼을 생성합니다.

또한, `users`(또는 이에 상응하는) 테이블에 100자 길이의 nullable string 타입 `remember_token` 컬럼이 있는지 확인해야 합니다. 이 컬럼은 사용자가 "로그인 상태 유지" 옵션을 선택할 때 토큰을 저장하는 데 사용됩니다. 역시, 새로운 Laravel 애플리케이션에 포함된 기본 `users` 테이블 마이그레이션에는 이미 이 컬럼이 포함되어 있습니다.


### 에코시스템 개요 {#ecosystem-overview}

Laravel은 인증과 관련된 여러 패키지를 제공합니다. 계속하기 전에, Laravel의 일반적인 인증 에코시스템을 살펴보고 각 패키지의 목적을 설명하겠습니다.

먼저, 인증이 어떻게 동작하는지 생각해봅시다. 웹 브라우저를 사용할 때, 사용자는 로그인 폼을 통해 사용자명과 비밀번호를 입력합니다. 이 자격 증명이 올바르면, 애플리케이션은 인증된 사용자에 대한 정보를 사용자의 [세션](/laravel/12.x/session)에 저장합니다. 브라우저에 발급된 쿠키에는 세션 ID가 포함되어 있어, 이후 애플리케이션에 대한 요청에서 사용자를 올바른 세션과 연결할 수 있습니다. 세션 쿠키가 수신되면, 애플리케이션은 세션 ID를 기반으로 세션 데이터를 가져오고, 인증 정보가 세션에 저장되어 있음을 확인하여 사용자를 "인증됨"으로 간주합니다.

원격 서비스가 API에 접근하기 위해 인증해야 할 때는, 웹 브라우저가 없으므로 일반적으로 쿠키를 사용하지 않습니다. 대신, 원격 서비스는 각 요청마다 API 토큰을 API에 전송합니다. 애플리케이션은 들어오는 토큰을 유효한 API 토큰 테이블과 비교하여, 해당 API 토큰과 연결된 사용자가 요청을 수행한 것으로 "인증"할 수 있습니다.


#### Laravel의 내장 브라우저 인증 서비스 {#laravels-built-in-browser-authentication-services}

Laravel은 일반적으로 `Auth`와 `Session` 파사드를 통해 접근하는 내장 인증 및 세션 서비스를 제공합니다. 이 기능들은 웹 브라우저에서 시작된 요청에 대해 쿠키 기반 인증을 제공합니다. 사용자의 자격 증명을 검증하고 사용자를 인증할 수 있는 메서드를 제공합니다. 또한, 이 서비스들은 인증 데이터를 자동으로 사용자의 세션에 저장하고, 세션 쿠키를 발급합니다. 이 서비스의 사용 방법은 본 문서에서 다룹니다.

**애플리케이션 스타터 키트**

이 문서에서 설명한 대로, 이러한 인증 서비스와 직접 상호작용하여 애플리케이션만의 인증 레이어를 구축할 수 있습니다. 하지만, 더 빠르게 시작할 수 있도록 전체 인증 레이어의 견고하고 현대적인 스캐폴딩을 제공하는 [무료 스타터 키트](/laravel/12.x/starter-kits)를 제공합니다.


#### Laravel의 API 인증 서비스 {#laravels-api-authentication-services}

Laravel은 API 토큰을 관리하고 API 토큰으로 이루어진 요청을 인증하는 데 도움이 되는 두 가지 선택적 패키지인 [Passport](/laravel/12.x/passport)와 [Sanctum](/laravel/12.x/sanctum)를 제공합니다. 이 라이브러리들과 Laravel의 내장 쿠키 기반 인증 라이브러리는 상호 배타적이지 않습니다. 이 라이브러리들은 주로 API 토큰 인증에 초점을 맞추고, 내장 인증 서비스는 쿠키 기반 브라우저 인증에 초점을 맞춥니다. 많은 애플리케이션이 Laravel의 내장 쿠키 기반 인증 서비스와 API 인증 패키지 중 하나를 함께 사용할 수 있습니다.

**Passport**

Passport는 다양한 OAuth2 "grant type"을 제공하는 OAuth2 인증 제공자입니다. 일반적으로, API 인증을 위한 견고하고 복잡한 패키지입니다. 하지만 대부분의 애플리케이션은 OAuth2 명세에서 제공하는 복잡한 기능이 필요하지 않으며, 이는 사용자와 개발자 모두에게 혼란을 줄 수 있습니다. 또한, 개발자들은 SPA 애플리케이션이나 모바일 애플리케이션을 Passport와 같은 OAuth2 인증 제공자를 사용해 인증하는 방법에 대해 혼란을 겪어왔습니다.

**Sanctum**

OAuth2의 복잡성과 개발자 혼란에 대응하여, 우리는 웹 브라우저의 1차 요청과 토큰을 통한 API 요청 모두를 처리할 수 있는 더 간단하고 직관적인 인증 패키지를 만들고자 했습니다. 이 목표는 [Laravel Sanctum](/laravel/12.x/sanctum)의 출시로 실현되었으며, API와 함께 1차 웹 UI를 제공하거나, 백엔드 Laravel 애플리케이션과 별도로 존재하는 SPA, 또는 모바일 클라이언트를 제공하는 애플리케이션에 권장되는 인증 패키지입니다.

Laravel Sanctum은 웹/ API 인증 패키지로, 애플리케이션의 전체 인증 프로세스를 관리할 수 있습니다. 이는 Sanctum 기반 애플리케이션이 요청을 받을 때, 먼저 인증된 세션을 참조하는 세션 쿠키가 포함되어 있는지 확인하기 때문입니다. Sanctum은 앞서 설명한 Laravel의 내장 인증 서비스를 호출하여 이를 수행합니다. 요청이 세션 쿠키를 통해 인증되지 않는 경우, Sanctum은 API 토큰이 있는지 요청을 검사합니다. API 토큰이 있으면, 해당 토큰을 사용해 요청을 인증합니다. 이 과정에 대해 더 알고 싶다면 Sanctum의 ["작동 방식"](/laravel/12.x/sanctum#how-it-works) 문서를 참고하세요.


#### 요약 및 스택 선택 {#summary-choosing-your-stack}

요약하자면, 애플리케이션이 브라우저를 통해 접근되고 모놀리식 Laravel 애플리케이션을 구축하는 경우, Laravel의 내장 인증 서비스를 사용하게 됩니다.

다음으로, 애플리케이션이 제3자가 사용할 API를 제공한다면, [Passport](/laravel/12.x/passport) 또는 [Sanctum](/laravel/12.x/sanctum) 중에서 선택하여 API 토큰 인증을 제공할 수 있습니다. 일반적으로, Sanctum은 API 인증, SPA 인증, 모바일 인증을 위한 간단하고 완전한 솔루션이므로 가능한 경우 선호되어야 합니다. "스코프" 또는 "능력"도 지원합니다.

Laravel 백엔드로 구동되는 SPA를 구축하는 경우, [Laravel Sanctum](/laravel/12.x/sanctum)을 사용해야 합니다. Sanctum을 사용할 때는 [백엔드 인증 라우트를 직접 구현](#authenticating-users)하거나, 등록, 비밀번호 재설정, 이메일 인증 등 기능을 제공하는 헤드리스 인증 백엔드 서비스인 [Laravel Fortify](/laravel/12.x/fortify)를 사용할 수 있습니다.

OAuth2 명세에서 제공하는 모든 기능이 반드시 필요한 경우에만 Passport를 선택하세요.

그리고, 빠르게 시작하고 싶다면, [애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 사용하여 이미 권장 인증 스택이 적용된 새로운 Laravel 애플리케이션을 빠르게 시작할 수 있습니다.


## 인증 빠른 시작 {#authentication-quickstart}

> [!WARNING]
> 이 문서의 이 부분은 빠르게 시작할 수 있도록 UI 스캐폴딩이 포함된 [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 통한 사용자 인증에 대해 설명합니다. Laravel의 인증 시스템과 직접 통합하고 싶다면 [사용자 수동 인증](#authenticating-users) 문서를 참고하세요.


### 스타터 키트 설치 {#install-a-starter-kit}

먼저, [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 설치해야 합니다. 스타터 키트는 새로운 Laravel 애플리케이션에 인증을 통합할 수 있는 아름답게 디자인된 시작점을 제공합니다.


### 인증된 사용자 가져오기 {#retrieving-the-authenticated-user}

스타터 키트로 애플리케이션을 생성하고 사용자가 회원가입 및 인증할 수 있도록 한 후, 현재 인증된 사용자와 상호작용해야 할 때가 많습니다. 들어오는 요청을 처리할 때, `Auth` 파사드의 `user` 메서드를 통해 인증된 사용자에 접근할 수 있습니다:

```php
use Illuminate\Support\Facades\Auth;

// 현재 인증된 사용자 가져오기...
$user = Auth::user();

// 현재 인증된 사용자의 ID 가져오기...
$id = Auth::id();
```

또는, 사용자가 인증된 후에는 `Illuminate\Http\Request` 인스턴스를 통해 인증된 사용자에 접근할 수 있습니다. 타입힌트된 클래스는 컨트롤러 메서드에 자동으로 주입됩니다. `Illuminate\Http\Request` 객체를 타입힌트하면, 애플리케이션의 어떤 컨트롤러 메서드에서도 요청의 `user` 메서드를 통해 인증된 사용자에 편리하게 접근할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    /**
     * 기존 항공편의 정보를 업데이트합니다.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        // ...

        return redirect('/flights');
    }
}
```


#### 현재 사용자가 인증되었는지 확인하기 {#determining-if-the-current-user-is-authenticated}

들어오는 HTTP 요청을 보낸 사용자가 인증되었는지 확인하려면, `Auth` 파사드의 `check` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 인증된 경우 `true`를 반환합니다:

```php
use Illuminate\Support\Facades\Auth;

if (Auth::check()) {
    // 사용자가 로그인되어 있습니다...
}
```

> [!NOTE]
> `check` 메서드를 사용해 사용자가 인증되었는지 확인할 수 있지만, 일반적으로는 미들웨어를 사용해 사용자가 특정 라우트/컨트롤러에 접근하기 전에 인증되었는지 확인합니다. 자세한 내용은 [라우트 보호하기](/laravel/12.x/authentication#protecting-routes) 문서를 참고하세요.


### 라우트 보호하기 {#protecting-routes}

[라우트 미들웨어](/laravel/12.x/middleware)를 사용하여 인증된 사용자만 특정 라우트에 접근할 수 있도록 할 수 있습니다. Laravel은 `Illuminate\Auth\Middleware\Authenticate` 클래스를 위한 [미들웨어 별칭](/laravel/12.x/middleware#middleware-aliases)인 `auth` 미들웨어를 기본으로 제공합니다. 이 미들웨어는 Laravel 내부에서 이미 별칭이 지정되어 있으므로, 라우트 정의에 미들웨어를 추가하기만 하면 됩니다:

```php
Route::get('/flights', function () {
    // 인증된 사용자만 이 라우트에 접근할 수 있습니다...
})->middleware('auth');
```


#### 인증되지 않은 사용자 리디렉션 {#redirecting-unauthenticated-users}

`auth` 미들웨어가 인증되지 않은 사용자를 감지하면, 사용자를 `login` [네임드 라우트](/laravel/12.x/routing#named-routes)로 리디렉션합니다. 이 동작은 애플리케이션의 `bootstrap/app.php` 파일 내에서 `redirectGuestsTo` 메서드를 사용해 수정할 수 있습니다:

```php
use Illuminate\Http\Request;

->withMiddleware(function (Middleware $middleware) {
    $middleware->redirectGuestsTo('/login');

    // 클로저 사용...
    $middleware->redirectGuestsTo(fn (Request $request) => route('login'));
})
```


#### 인증된 사용자 리디렉션 {#redirecting-authenticated-users}

`guest` 미들웨어가 인증된 사용자를 감지하면, 사용자를 `dashboard` 또는 `home` 네임드 라우트로 리디렉션합니다. 이 동작은 애플리케이션의 `bootstrap/app.php` 파일 내에서 `redirectUsersTo` 메서드를 사용해 수정할 수 있습니다:

```php
use Illuminate\Http\Request;

->withMiddleware(function (Middleware $middleware) {
    $middleware->redirectUsersTo('/panel');

    // 클로저 사용...
    $middleware->redirectUsersTo(fn (Request $request) => route('panel'));
})
```


#### 가드 지정하기 {#specifying-a-guard}

`auth` 미들웨어를 라우트에 연결할 때, 사용자를 인증하는 데 사용할 "가드"를 지정할 수도 있습니다. 지정한 가드는 `auth.php` 설정 파일의 `guards` 배열에 있는 키 중 하나와 일치해야 합니다:

```php
Route::get('/flights', function () {
    // 인증된 사용자만 이 라우트에 접근할 수 있습니다...
})->middleware('auth:admin');
```


### 로그인 제한 {#login-throttling}

[애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 사용하는 경우, 로그인 시도에 자동으로 속도 제한이 적용됩니다. 기본적으로, 사용자가 여러 번 잘못된 자격 증명을 입력하면 1분 동안 로그인할 수 없습니다. 제한은 사용자의 사용자명/이메일 주소와 IP 주소별로 고유하게 적용됩니다.

> [!NOTE]
> 애플리케이션의 다른 라우트에도 속도 제한을 적용하고 싶다면, [속도 제한 문서](/laravel/12.x/routing#rate-limiting)를 참고하세요.


## 사용자 수동 인증 {#authenticating-users}

Laravel의 [애플리케이션 스타터 키트](/laravel/12.x/starter-kits)에 포함된 인증 스캐폴딩을 반드시 사용할 필요는 없습니다. 이 스캐폴딩을 사용하지 않기로 선택한 경우, Laravel 인증 클래스를 직접 사용해 사용자 인증을 관리해야 합니다. 걱정하지 마세요, 아주 간단합니다!

`Auth` [파사드](/laravel/12.x/facades)를 통해 Laravel의 인증 서비스에 접근할 것이므로, 클래스 상단에 `Auth` 파사드를 임포트해야 합니다. 다음으로, `attempt` 메서드를 살펴보겠습니다. `attempt` 메서드는 일반적으로 애플리케이션의 "로그인" 폼에서 인증 시도를 처리하는 데 사용됩니다. 인증에 성공하면, [세션](/laravel/12.x/session) 고정화(session fixation)를 방지하기 위해 사용자의 세션을 재생성해야 합니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * 인증 시도 처리.
     */
    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('dashboard');
        }

        return back()->withErrors([
            'email' => '제공된 자격 증명이 기록과 일치하지 않습니다.',
        ])->onlyInput('email');
    }
}
```

`attempt` 메서드는 첫 번째 인자로 키/값 쌍의 배열을 받습니다. 배열의 값은 데이터베이스 테이블에서 사용자를 찾는 데 사용됩니다. 위 예제에서는 `email` 컬럼의 값으로 사용자를 조회합니다. 사용자가 발견되면, 데이터베이스에 저장된 해시된 비밀번호와 배열을 통해 전달된 `password` 값이 비교됩니다. 요청의 `password` 값을 해시할 필요는 없습니다. 프레임워크가 자동으로 값을 해시하여 데이터베이스의 해시된 비밀번호와 비교합니다. 두 해시된 비밀번호가 일치하면, 사용자에 대한 인증 세션이 시작됩니다.

Laravel의 인증 서비스는 인증 가드의 "provider" 설정에 따라 데이터베이스에서 사용자를 조회합니다. 기본 `config/auth.php` 설정 파일에서는 Eloquent 사용자 제공자가 지정되어 있으며, 사용자를 조회할 때 `App\Models\User` 모델을 사용하도록 지시합니다. 애플리케이션의 필요에 따라 이 값을 설정 파일에서 변경할 수 있습니다.

`attempt` 메서드는 인증에 성공하면 `true`를 반환합니다. 그렇지 않으면 `false`가 반환됩니다.

Laravel의 리다이렉터가 제공하는 `intended` 메서드는 인증 미들웨어에 의해 가로채지기 전 사용자가 접근하려던 URL로 리다이렉트합니다. 의도한 목적지가 없을 경우를 대비해 대체 URI를 이 메서드에 전달할 수 있습니다.


#### 추가 조건 지정하기 {#specifying-additional-conditions}

원한다면, 사용자의 이메일과 비밀번호 외에 인증 쿼리에 추가 조건을 더할 수 있습니다. 이를 위해, `attempt` 메서드에 전달하는 배열에 쿼리 조건을 추가하면 됩니다. 예를 들어, 사용자가 "active"로 표시되어 있는지 확인할 수 있습니다:

```php
if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => 1])) {
    // 인증에 성공했습니다...
}
```

복잡한 쿼리 조건의 경우, 자격 증명 배열에 클로저를 제공할 수 있습니다. 이 클로저는 쿼리 인스턴스를 인자로 받아, 애플리케이션의 필요에 따라 쿼리를 커스터마이즈할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

if (Auth::attempt([
    'email' => $email,
    'password' => $password,
    fn (Builder $query) => $query->has('activeSubscription'),
])) {
    // 인증에 성공했습니다...
}
```

> [!WARNING]
> 이 예제에서 `email`은 필수 옵션이 아니며, 단지 예시로 사용되었습니다. 데이터베이스 테이블에서 "사용자명"에 해당하는 컬럼명을 사용해야 합니다.

`attemptWhen` 메서드는 두 번째 인자로 클로저를 받아, 실제로 사용자를 인증하기 전에 잠재적 사용자를 더 광범위하게 검사할 수 있습니다. 클로저는 잠재적 사용자를 인자로 받아, 인증이 가능한지 여부를 나타내는 `true` 또는 `false`를 반환해야 합니다:

```php
if (Auth::attemptWhen([
    'email' => $email,
    'password' => $password,
], function (User $user) {
    return $user->isNotBanned();
})) {
    // 인증에 성공했습니다...
}
```


#### 특정 가드 인스턴스 접근하기 {#accessing-specific-guard-instances}

`Auth` 파사드의 `guard` 메서드를 통해, 사용자를 인증할 때 사용할 가드 인스턴스를 지정할 수 있습니다. 이를 통해 애플리케이션의 별도 부분에서 완전히 별도의 인증 가능한 모델이나 사용자 테이블을 사용해 인증을 관리할 수 있습니다.

`guard` 메서드에 전달하는 가드 이름은 `auth.php` 설정 파일에 구성된 가드 중 하나와 일치해야 합니다:

```php
if (Auth::guard('admin')->attempt($credentials)) {
    // ...
}
```


### 사용자 기억하기 {#remembering-users}

많은 웹 애플리케이션은 로그인 폼에 "로그인 상태 유지" 체크박스를 제공합니다. 애플리케이션에서 "로그인 상태 유지" 기능을 제공하고 싶다면, `attempt` 메서드의 두 번째 인자로 불리언 값을 전달하면 됩니다.

이 값이 `true`이면, Laravel은 사용자가 수동으로 로그아웃할 때까지 또는 무기한 인증 상태를 유지합니다. `users` 테이블에는 "로그인 상태 유지" 토큰을 저장하는 데 사용되는 string 타입의 `remember_token` 컬럼이 포함되어 있어야 합니다. 새로운 Laravel 애플리케이션에 포함된 `users` 테이블 마이그레이션에는 이미 이 컬럼이 포함되어 있습니다:

```php
use Illuminate\Support\Facades\Auth;

if (Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
    // 사용자가 기억되고 있습니다...
}
```

애플리케이션에서 "로그인 상태 유지" 기능을 제공하는 경우, 현재 인증된 사용자가 "로그인 상태 유지" 쿠키를 사용해 인증되었는지 확인하려면 `viaRemember` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Auth;

if (Auth::viaRemember()) {
    // ...
}
```


### 기타 인증 방법 {#other-authentication-methods}


#### 사용자 인스턴스 인증하기 {#authenticate-a-user-instance}

기존 사용자 인스턴스를 현재 인증된 사용자로 설정해야 하는 경우, 해당 사용자 인스턴스를 `Auth` 파사드의 `login` 메서드에 전달할 수 있습니다. 전달된 사용자 인스턴스는 `Illuminate\Contracts\Auth\Authenticatable` [계약](/laravel/12.x/contracts)을 구현해야 합니다. Laravel에 포함된 `App\Models\User` 모델은 이미 이 인터페이스를 구현하고 있습니다. 이 인증 방법은 예를 들어 사용자가 회원가입을 마친 직후처럼 이미 유효한 사용자 인스턴스가 있을 때 유용합니다:

```php
use Illuminate\Support\Facades\Auth;

Auth::login($user);
```

`login` 메서드의 두 번째 인자로 불리언 값을 전달할 수 있습니다. 이 값은 인증 세션에 "로그인 상태 유지" 기능이 필요한지 여부를 나타냅니다. 즉, 세션이 무기한 인증되거나 사용자가 애플리케이션에서 수동으로 로그아웃할 때까지 인증 상태가 유지됩니다:

```php
Auth::login($user, $remember = true);
```

필요하다면, `login` 메서드를 호출하기 전에 인증 가드를 지정할 수 있습니다:

```php
Auth::guard('admin')->login($user);
```


#### 사용자 ID로 인증하기 {#authenticate-a-user-by-id}

데이터베이스 레코드의 기본 키를 사용해 사용자를 인증하려면, `loginUsingId` 메서드를 사용할 수 있습니다. 이 메서드는 인증하려는 사용자의 기본 키를 인자로 받습니다:

```php
Auth::loginUsingId(1);
```

`loginUsingId` 메서드의 `remember` 인자에 불리언 값을 전달할 수 있습니다. 이 값은 인증 세션에 "로그인 상태 유지" 기능이 필요한지 여부를 나타냅니다. 즉, 세션이 무기한 인증되거나 사용자가 애플리케이션에서 수동으로 로그아웃할 때까지 인증 상태가 유지됩니다:

```php
Auth::loginUsingId(1, remember: true);
```


#### 한 번만 사용자 인증하기 {#authenticate-a-user-once}

`once` 메서드를 사용해 한 번의 요청에 한해 사용자를 인증할 수 있습니다. 이 메서드를 호출할 때는 세션이나 쿠키가 사용되지 않습니다:

```php
if (Auth::once($credentials)) {
    // ...
}
```


## HTTP Basic 인증 {#http-basic-authentication}

[HTTP Basic 인증](https://en.wikipedia.org/wiki/Basic_access_authentication)은 별도의 "로그인" 페이지를 설정하지 않고도 애플리케이션 사용자를 빠르게 인증할 수 있는 방법을 제공합니다. 시작하려면, `auth.basic` [미들웨어](/laravel/12.x/middleware)를 라우트에 연결하세요. `auth.basic` 미들웨어는 Laravel 프레임워크에 포함되어 있으므로, 별도로 정의할 필요가 없습니다:

```php
Route::get('/profile', function () {
    // 인증된 사용자만 이 라우트에 접근할 수 있습니다...
})->middleware('auth.basic');
```

미들웨어가 라우트에 연결되면, 브라우저에서 해당 라우트에 접근할 때 자동으로 자격 증명을 입력하라는 프롬프트가 표시됩니다. 기본적으로, `auth.basic` 미들웨어는 `users` 데이터베이스 테이블의 `email` 컬럼을 사용자의 "사용자명"으로 간주합니다.


#### FastCGI 관련 참고사항 {#a-note-on-fastcgi}

PHP FastCGI와 Apache를 사용해 Laravel 애플리케이션을 서비스하는 경우, HTTP Basic 인증이 올바르게 동작하지 않을 수 있습니다. 이 문제를 해결하려면, 애플리케이션의 `.htaccess` 파일에 다음 줄을 추가하세요:

```apache
RewriteCond %{HTTP:Authorization} ^(.+)$
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
```


### Stateless HTTP Basic 인증 {#stateless-http-basic-authentication}

세션에 사용자 식별자 쿠키를 설정하지 않고도 HTTP Basic 인증을 사용할 수 있습니다. 이는 HTTP 인증을 사용해 애플리케이션의 API 요청을 인증하려는 경우에 주로 유용합니다. 이를 위해, [미들웨어를 정의](/laravel/12.x/middleware)하여 `onceBasic` 메서드를 호출하세요. `onceBasic` 메서드가 응답을 반환하지 않으면, 요청이 애플리케이션의 다음 단계로 전달됩니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateOnceWithBasicAuth
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return Auth::onceBasic() ?: $next($request);
    }

}
```

다음으로, 미들웨어를 라우트에 연결하세요:

```php
Route::get('/api/user', function () {
    // 인증된 사용자만 이 라우트에 접근할 수 있습니다...
})->middleware(AuthenticateOnceWithBasicAuth::class);
```


## 로그아웃 {#logging-out}

사용자를 애플리케이션에서 수동으로 로그아웃시키려면, `Auth` 파사드가 제공하는 `logout` 메서드를 사용할 수 있습니다. 이 메서드는 사용자의 세션에서 인증 정보를 제거하여 이후 요청이 인증되지 않도록 합니다.

`logout` 메서드를 호출하는 것 외에도, 사용자의 세션을 무효화하고 [CSRF 토큰](/laravel/12.x/csrf)을 재생성하는 것이 권장됩니다. 사용자를 로그아웃한 후에는 일반적으로 애플리케이션의 루트로 리디렉션합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

/**
 * 사용자를 애플리케이션에서 로그아웃합니다.
 */
public function logout(Request $request): RedirectResponse
{
    Auth::logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect('/');
}
```


### 다른 기기에서 세션 무효화 {#invalidating-sessions-on-other-devices}

Laravel은 사용자의 현재 기기 세션을 무효화하지 않고, 다른 기기에서 활성화된 사용자의 세션을 무효화하고 "로그아웃"할 수 있는 메커니즘도 제공합니다. 이 기능은 일반적으로 사용자가 비밀번호를 변경하거나 업데이트할 때, 다른 기기에서의 세션을 무효화하고 현재 기기는 인증 상태를 유지하고자 할 때 사용됩니다.

시작하기 전에, `Illuminate\Session\Middleware\AuthenticateSession` 미들웨어가 세션 인증을 받아야 하는 라우트에 포함되어 있는지 확인해야 합니다. 일반적으로, 이 미들웨어를 라우트 그룹 정의에 추가하여 애플리케이션의 대부분 라우트에 적용할 수 있습니다. 기본적으로, `AuthenticateSession` 미들웨어는 `auth.session` [미들웨어 별칭](/laravel/12.x/middleware#middleware-aliases)를 사용해 라우트에 연결할 수 있습니다:

```php
Route::middleware(['auth', 'auth.session'])->group(function () {
    Route::get('/', function () {
        // ...
    });
});
```

그런 다음, `Auth` 파사드가 제공하는 `logoutOtherDevices` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 현재 비밀번호를 확인해야 하며, 애플리케이션에서 입력 폼을 통해 비밀번호를 받아야 합니다:

```php
use Illuminate\Support\Facades\Auth;

Auth::logoutOtherDevices($currentPassword);
```

`logoutOtherDevices` 메서드가 호출되면, 사용자의 다른 세션이 완전히 무효화되어, 이전에 인증된 모든 가드에서 "로그아웃"됩니다.


## 비밀번호 확인 {#password-confirmation}

애플리케이션을 구축하다 보면, 사용자가 특정 작업을 수행하기 전에 또는 민감한 영역으로 리디렉션되기 전에 비밀번호를 다시 확인해야 하는 경우가 있습니다. Laravel은 이 과정을 쉽게 만들어주는 내장 미들웨어를 제공합니다. 이 기능을 구현하려면, 사용자가 비밀번호를 확인하도록 요청하는 뷰를 표시하는 라우트와, 비밀번호가 유효한지 확인하고 사용자를 의도한 위치로 리디렉션하는 라우트 두 개를 정의해야 합니다.

> [!NOTE]
> 아래 문서는 Laravel의 비밀번호 확인 기능과 직접 통합하는 방법을 설명합니다. 더 빠르게 시작하고 싶다면, [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)에서 이 기능을 지원합니다!


### 설정 {#password-confirmation-configuration}

비밀번호를 확인한 후, 사용자는 3시간 동안 다시 비밀번호를 확인하라는 요청을 받지 않습니다. 하지만, 애플리케이션의 `config/auth.php` 설정 파일에서 `password_timeout` 값을 변경하여 비밀번호 재확인까지의 시간을 조정할 수 있습니다.


### 라우팅 {#password-confirmation-routing}


#### 비밀번호 확인 폼 {#the-password-confirmation-form}

먼저, 사용자가 비밀번호를 확인하도록 요청하는 뷰를 표시하는 라우트를 정의합니다:

```php
Route::get('/confirm-password', function () {
    return view('auth.confirm-password');
})->middleware('auth')->name('password.confirm');
```

예상할 수 있듯이, 이 라우트에서 반환되는 뷰에는 `password` 필드가 포함된 폼이 있어야 합니다. 또한, 사용자가 애플리케이션의 보호된 영역에 진입하고 있으므로 비밀번호를 확인해야 한다는 설명을 뷰에 자유롭게 포함할 수 있습니다.


#### 비밀번호 확인 처리 {#confirming-the-password}

다음으로, "비밀번호 확인" 뷰에서 폼 요청을 처리할 라우트를 정의합니다. 이 라우트는 비밀번호를 검증하고 사용자를 의도한 위치로 리디렉션하는 역할을 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

Route::post('/confirm-password', function (Request $request) {
    if (! Hash::check($request->password, $request->user()->password)) {
        return back()->withErrors([
            'password' => ['제공된 비밀번호가 기록과 일치하지 않습니다.']
        ]);
    }

    $request->session()->passwordConfirmed();

    return redirect()->intended();
})->middleware(['auth', 'throttle:6,1']);
```

다음 단계로 넘어가기 전에, 이 라우트를 좀 더 자세히 살펴보겠습니다. 먼저, 요청의 `password` 필드가 실제로 인증된 사용자의 비밀번호와 일치하는지 확인합니다. 비밀번호가 유효하다면, Laravel 세션에 사용자가 비밀번호를 확인했음을 알려야 합니다. `passwordConfirmed` 메서드는 사용자의 세션에 Laravel이 사용자가 마지막으로 비밀번호를 확인한 시점을 판단할 수 있는 타임스탬프를 설정합니다. 마지막으로, 사용자를 의도한 위치로 리디렉션할 수 있습니다.


### 라우트 보호하기 {#password-confirmation-protecting-routes}

최근 비밀번호 확인이 필요한 작업을 수행하는 모든 라우트에 `password.confirm` 미들웨어가 할당되어 있는지 확인해야 합니다. 이 미들웨어는 Laravel 기본 설치에 포함되어 있으며, 사용자가 비밀번호를 확인한 후 해당 위치로 리디렉션할 수 있도록 사용자의 의도한 목적지를 세션에 자동으로 저장합니다. 사용자의 의도한 목적지를 세션에 저장한 후, 미들웨어는 사용자를 `password.confirm` [네임드 라우트](/laravel/12.x/routing#named-routes)로 리디렉션합니다:

```php
Route::get('/settings', function () {
    // ...
})->middleware(['password.confirm']);

Route::post('/settings', function () {
    // ...
})->middleware(['password.confirm']);
```


## 커스텀 가드 추가 {#adding-custom-guards}

`Auth` 파사드의 `extend` 메서드를 사용해 자체 인증 가드를 정의할 수 있습니다. [서비스 프로바이더](/laravel/12.x/providers) 내에서 `extend` 메서드를 호출해야 합니다. Laravel에는 이미 `AppServiceProvider`가 포함되어 있으므로, 해당 프로바이더에 코드를 추가할 수 있습니다:

```php
<?php

namespace App\Providers;

use App\Services\Auth\JwtGuard;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    // ...

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Auth::extend('jwt', function (Application $app, string $name, array $config) {
            // Illuminate\Contracts\Auth\Guard 인스턴스를 반환...

            return new JwtGuard(Auth::createUserProvider($config['provider']));
        });
    }
}
```

위 예제에서 볼 수 있듯이, `extend` 메서드에 전달된 콜백은 `Illuminate\Contracts\Auth\Guard`의 구현체를 반환해야 합니다. 이 인터페이스에는 커스텀 가드를 정의하기 위해 구현해야 할 몇 가지 메서드가 있습니다. 커스텀 가드를 정의한 후에는, `auth.php` 설정 파일의 `guards` 설정에서 해당 가드를 참조할 수 있습니다:

```php
'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```


### 클로저 요청 가드 {#closure-request-guards}

HTTP 요청 기반의 커스텀 인증 시스템을 구현하는 가장 간단한 방법은 `Auth::viaRequest` 메서드를 사용하는 것입니다. 이 메서드를 사용하면 단일 클로저로 인증 프로세스를 빠르게 정의할 수 있습니다.

시작하려면, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 `Auth::viaRequest` 메서드를 호출하세요. `viaRequest` 메서드는 첫 번째 인자로 인증 드라이버 이름을 받습니다. 이 이름은 커스텀 가드를 설명하는 임의의 문자열일 수 있습니다. 두 번째 인자는 들어오는 HTTP 요청을 받고 사용자 인스턴스를 반환하거나, 인증에 실패하면 `null`을 반환하는 클로저여야 합니다:

```php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Auth::viaRequest('custom-token', function (Request $request) {
        return User::where('token', (string) $request->token)->first();
    });
}
```

커스텀 인증 드라이버를 정의한 후에는, `auth.php` 설정 파일의 `guards` 설정에서 드라이버로 지정할 수 있습니다:

```php
'guards' => [
    'api' => [
        'driver' => 'custom-token',
    ],
],
```

마지막으로, 인증 미들웨어를 라우트에 할당할 때 해당 가드를 참조할 수 있습니다:

```php
Route::middleware('auth:api')->group(function () {
    // ...
});
```


## 커스텀 사용자 제공자 추가 {#adding-custom-user-providers}

전통적인 관계형 데이터베이스를 사용하지 않고 사용자를 저장하는 경우, Laravel에 자체 인증 사용자 제공자를 확장해야 합니다. `Auth` 파사드의 `provider` 메서드를 사용해 커스텀 사용자 제공자를 정의할 수 있습니다. 사용자 제공자 리졸버는 `Illuminate\Contracts\Auth\UserProvider`의 구현체를 반환해야 합니다:

```php
<?php

namespace App\Providers;

use App\Extensions\MongoUserProvider;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    // ...

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Auth::provider('mongo', function (Application $app, array $config) {
            // Illuminate\Contracts\Auth\UserProvider 인스턴스를 반환...

            return new MongoUserProvider($app->make('mongo.connection'));
        });
    }
}
```

`provider` 메서드를 사용해 제공자를 등록한 후, `auth.php` 설정 파일에서 새 사용자 제공자로 전환할 수 있습니다. 먼저, 새 드라이버를 사용하는 `provider`를 정의하세요:

```php
'providers' => [
    'users' => [
        'driver' => 'mongo',
    ],
],
```

마지막으로, 이 제공자를 `guards` 설정에서 참조할 수 있습니다:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
],
```


### User Provider 계약 {#the-user-provider-contract}

`Illuminate\Contracts\Auth\UserProvider` 구현체는 MySQL, MongoDB 등과 같은 영구 저장소 시스템에서 `Illuminate\Contracts\Auth\Authenticatable` 구현체를 가져오는 역할을 합니다. 이 두 인터페이스 덕분에 사용자 데이터가 어떻게 저장되든, 어떤 클래스가 인증된 사용자를 나타내든 Laravel 인증 메커니즘이 계속 동작할 수 있습니다:

`Illuminate\Contracts\Auth\UserProvider` 계약을 살펴봅시다:

```php
<?php

namespace Illuminate\Contracts\Auth;

interface UserProvider
{
    public function retrieveById($identifier);
    public function retrieveByToken($identifier, $token);
    public function updateRememberToken(Authenticatable $user, $token);
    public function retrieveByCredentials(array $credentials);
    public function validateCredentials(Authenticatable $user, array $credentials);
    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false);
}
```

`retrieveById` 함수는 일반적으로 MySQL 데이터베이스의 자동 증가 ID와 같은 사용자를 나타내는 키를 받습니다. 해당 ID와 일치하는 `Authenticatable` 구현체를 조회해 반환해야 합니다.

`retrieveByToken` 함수는 고유한 `$identifier`와 "로그인 상태 유지" `$token`으로 사용자를 조회합니다. 일반적으로 데이터베이스의 `remember_token` 컬럼에 저장됩니다. 이전 메서드와 마찬가지로, 토큰 값이 일치하는 `Authenticatable` 구현체를 반환해야 합니다.

`updateRememberToken` 메서드는 `$user` 인스턴스의 `remember_token`을 새 `$token`으로 업데이트합니다. "로그인 상태 유지" 인증 시도에 성공하거나 사용자가 로그아웃할 때 새로운 토큰이 할당됩니다.

`retrieveByCredentials` 메서드는 애플리케이션에서 인증을 시도할 때 `Auth::attempt` 메서드에 전달된 자격 증명 배열을 받습니다. 그런 다음, 해당 자격 증명과 일치하는 사용자를 영구 저장소에서 "쿼리"해야 합니다. 일반적으로 이 메서드는 `$credentials['username']` 값과 일치하는 사용자 레코드를 찾는 "where" 조건 쿼리를 실행합니다. 이 메서드는 `Authenticatable` 구현체를 반환해야 합니다. **이 메서드는 비밀번호 검증이나 인증을 시도해서는 안 됩니다.**

`validateCredentials` 메서드는 주어진 `$user`와 `$credentials`을 비교해 사용자를 인증해야 합니다. 예를 들어, 이 메서드는 일반적으로 `Hash::check` 메서드를 사용해 `$user->getAuthPassword()` 값과 `$credentials['password']` 값을 비교합니다. 이 메서드는 비밀번호가 유효한지 여부를 나타내는 `true` 또는 `false`를 반환해야 합니다.

`rehashPasswordIfRequired` 메서드는 필요하다면 주어진 `$user`의 비밀번호를 재해싱해야 합니다. 예를 들어, 이 메서드는 일반적으로 `Hash::needsRehash` 메서드를 사용해 `$credentials['password']` 값이 재해싱이 필요한지 확인합니다. 비밀번호가 재해싱이 필요하다면, `Hash::make` 메서드를 사용해 비밀번호를 재해싱하고, 사용자의 레코드를 영구 저장소에 업데이트해야 합니다.


### Authenticatable 계약 {#the-authenticatable-contract}

이제 `UserProvider`의 각 메서드를 살펴봤으니, `Authenticatable` 계약을 살펴봅시다. 사용자 제공자는 `retrieveById`, `retrieveByToken`, `retrieveByCredentials` 메서드에서 이 인터페이스의 구현체를 반환해야 합니다:

```php
<?php

namespace Illuminate\Contracts\Auth;

interface Authenticatable
{
    public function getAuthIdentifierName();
    public function getAuthIdentifier();
    public function getAuthPasswordName();
    public function getAuthPassword();
    public function getRememberToken();
    public function setRememberToken($value);
    public function getRememberTokenName();
}
```

이 인터페이스는 단순합니다. `getAuthIdentifierName` 메서드는 사용자의 "기본 키" 컬럼명을 반환해야 하며, `getAuthIdentifier` 메서드는 사용자의 "기본 키"를 반환해야 합니다. MySQL 백엔드를 사용하는 경우, 이는 사용자 레코드에 할당된 자동 증가 기본 키일 가능성이 높습니다. `getAuthPasswordName` 메서드는 사용자의 비밀번호 컬럼명을 반환해야 하며, `getAuthPassword` 메서드는 사용자의 해시된 비밀번호를 반환해야 합니다.

이 인터페이스 덕분에 인증 시스템은 어떤 ORM이나 저장소 추상화 계층을 사용하든 모든 "사용자" 클래스와 함께 동작할 수 있습니다. 기본적으로, Laravel은 `app/Models` 디렉터리에 이 인터페이스를 구현한 `App\Models\User` 클래스를 포함하고 있습니다.


## 자동 비밀번호 재해싱 {#automatic-password-rehashing}

Laravel의 기본 비밀번호 해싱 알고리즘은 bcrypt입니다. bcrypt 해시의 "작업 인자(work factor)"는 애플리케이션의 `config/hashing.php` 설정 파일이나 `BCRYPT_ROUNDS` 환경 변수로 조정할 수 있습니다.

일반적으로, CPU/GPU 처리 능력이 향상됨에 따라 bcrypt 작업 인자를 점진적으로 높여야 합니다. 애플리케이션의 bcrypt 작업 인자를 높이면, Laravel은 사용자가 Laravel 스타터 키트를 통해 인증하거나 [수동으로 인증](#authenticating-users)할 때 `attempt` 메서드를 통해 사용자 비밀번호를 자동으로 재해싱합니다.

일반적으로, 자동 비밀번호 재해싱은 애플리케이션에 영향을 주지 않지만, 이 동작을 비활성화하려면 `hashing` 설정 파일을 퍼블리시하세요:

```shell
php artisan config:publish hashing
```

설정 파일이 퍼블리시된 후, `rehash_on_login` 설정 값을 `false`로 변경할 수 있습니다:

```php
'rehash_on_login' => false,
```


## 이벤트 {#events}

Laravel은 인증 과정에서 다양한 [이벤트](/laravel/12.x/events)를 디스패치합니다. 다음 이벤트 중 어떤 것이든 [리스너를 정의](/laravel/12.x/events)할 수 있습니다:

<div class="overflow-auto">

| 이벤트 이름                                       |
|----------------------------------------------|
| `Illuminate\Auth\Events\Registered`          |
| `Illuminate\Auth\Events\Attempting`          |
| `Illuminate\Auth\Events\Authenticated`       |
| `Illuminate\Auth\Events\Login`               |
| `Illuminate\Auth\Events\Failed`              |
| `Illuminate\Auth\Events\Validated`           |
| `Illuminate\Auth\Events\Verified`            |
| `Illuminate\Auth\Events\Logout`              |
| `Illuminate\Auth\Events\CurrentDeviceLogout` |
| `Illuminate\Auth\Events\OtherDeviceLogout`   |
| `Illuminate\Auth\Events\Lockout`             |
| `Illuminate\Auth\Events\PasswordReset`       |

</div>
