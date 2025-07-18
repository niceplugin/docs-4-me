# Laravel Fortify


























## 소개 {#introduction}

[Laravel Fortify](https://github.com/laravel/fortify)는 프론트엔드에 종속되지 않는 Laravel용 인증 백엔드 구현체입니다. Fortify는 로그인, 회원가입, 비밀번호 재설정, 이메일 인증 등 Laravel의 모든 인증 기능을 구현하는 데 필요한 라우트와 컨트롤러를 등록합니다. Fortify를 설치한 후에는 `route:list` 아티즌 명령어를 실행하여 Fortify가 등록한 라우트를 확인할 수 있습니다.

Fortify는 자체 사용자 인터페이스를 제공하지 않으므로, Fortify가 등록한 라우트에 요청을 보내는 여러분만의 사용자 인터페이스와 함께 사용해야 합니다. 이 문서의 나머지 부분에서는 이러한 라우트에 요청을 보내는 방법을 자세히 다룹니다.

> [!NOTE]
> Fortify는 Laravel의 인증 기능 구현을 빠르게 시작할 수 있도록 도와주는 패키지입니다. **반드시 사용해야 하는 것은 아닙니다.** [인증](/laravel/12.x/authentication), [비밀번호 재설정](/laravel/12.x/passwords), [이메일 인증](/laravel/12.x/verification) 문서를 참고하여 Laravel의 인증 서비스를 직접 다룰 수도 있습니다.


### Fortify란? {#what-is-fortify}

앞서 언급했듯이, Laravel Fortify는 프론트엔드에 종속되지 않는 Laravel용 인증 백엔드 구현체입니다. Fortify는 로그인, 회원가입, 비밀번호 재설정, 이메일 인증 등 Laravel의 모든 인증 기능을 구현하는 데 필요한 라우트와 컨트롤러를 등록합니다.

**Laravel의 인증 기능을 사용하기 위해 반드시 Fortify를 사용할 필요는 없습니다.** [인증](/laravel/12.x/authentication), [비밀번호 재설정](/laravel/12.x/passwords), [이메일 인증](/laravel/12.x/verification) 문서를 참고하여 직접 인증 서비스를 다룰 수 있습니다.

Laravel을 처음 접하는 경우, Laravel Fortify를 사용하기 전에 [스타터 키트](/laravel/12.x/starter-kits)를 먼저 살펴보는 것이 좋습니다. 스타터 키트는 [Tailwind CSS](https://tailwindcss.com)로 제작된 사용자 인터페이스와 함께 인증 스캐폴딩을 제공합니다. 이를 통해 Fortify가 대신 구현해주기 전에 Laravel의 인증 기능을 직접 익힐 수 있습니다.

Laravel Fortify는 스타터 키트의 라우트와 컨트롤러를 별도의 패키지로 제공하지만, 사용자 인터페이스는 포함하지 않습니다. 이를 통해 특정 프론트엔드 방식에 얽매이지 않고, 애플리케이션의 인증 백엔드 구현을 빠르게 스캐폴딩할 수 있습니다.


### 언제 Fortify를 사용해야 하나요? {#when-should-i-use-fortify}

Laravel Fortify를 언제 사용하는 것이 적절한지 궁금할 수 있습니다. 먼저, Laravel의 [스타터 키트](/laravel/12.x/starter-kits)를 사용 중이라면 별도로 Fortify를 설치할 필요가 없습니다. 모든 스타터 키트에는 이미 완전한 인증 구현이 포함되어 있습니다.

스타터 키트를 사용하지 않고 애플리케이션에 인증 기능이 필요하다면, 두 가지 선택지가 있습니다: 직접 인증 기능을 구현하거나, Fortify를 사용해 백엔드 구현을 제공받는 것입니다.

Fortify를 설치하면, 여러분의 사용자 인터페이스는 이 문서에서 설명하는 Fortify의 인증 라우트에 요청을 보내 인증 및 회원가입을 처리하게 됩니다.

Fortify 대신 직접 인증 서비스를 다루고 싶다면, [인증](/laravel/12.x/authentication), [비밀번호 재설정](/laravel/12.x/passwords), [이메일 인증](/laravel/12.x/verification) 문서를 참고하시면 됩니다.


#### Laravel Fortify와 Laravel Sanctum {#laravel-fortify-and-laravel-sanctum}

일부 개발자들은 [Laravel Sanctum](/laravel/12.x/sanctum)과 Laravel Fortify의 차이점에 대해 혼동할 수 있습니다. 두 패키지는 서로 다른(하지만 관련된) 문제를 해결하므로, Fortify와 Sanctum은 상호 배타적이거나 경쟁 관계가 아닙니다.

Laravel Sanctum은 API 토큰 관리와 세션 쿠키 또는 토큰을 이용한 기존 사용자 인증만을 담당합니다. Sanctum은 회원가입, 비밀번호 재설정 등과 관련된 라우트를 제공하지 않습니다.

API를 제공하거나 싱글 페이지 애플리케이션의 백엔드로 동작하는 인증 레이어를 직접 구축하려는 경우, Fortify(회원가입, 비밀번호 재설정 등)와 Sanctum(API 토큰 관리, 세션 인증)을 함께 사용할 수 있습니다.


## 설치 {#installation}

먼저, Composer 패키지 매니저를 사용해 Fortify를 설치하세요:

```shell
composer require laravel/fortify
```

다음으로, `fortify:install` 아티즌 명령어를 사용해 Fortify의 리소스를 퍼블리시하세요:

```shell
php artisan fortify:install
```

이 명령어는 Fortify의 액션을 `app/Actions` 디렉터리에 퍼블리시합니다(디렉터리가 없으면 생성됨). 또한, `FortifyServiceProvider`, 설정 파일, 필요한 데이터베이스 마이그레이션도 함께 퍼블리시됩니다.

다음으로, 데이터베이스 마이그레이션을 실행하세요:

```shell
php artisan migrate
```


### Fortify 기능 {#fortify-features}

`fortify` 설정 파일에는 `features` 설정 배열이 있습니다. 이 배열은 Fortify가 기본적으로 노출할 백엔드 라우트/기능을 정의합니다. 대부분의 Laravel 애플리케이션에서 제공하는 기본 인증 기능만 활성화하는 것을 권장합니다:

```php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
],
```


### 뷰 비활성화 {#disabling-views}

기본적으로 Fortify는 로그인 화면이나 회원가입 화면 등 뷰를 반환하는 라우트를 정의합니다. 하지만 JavaScript 기반의 싱글 페이지 애플리케이션을 개발 중이라면 이러한 라우트가 필요 없을 수 있습니다. 이 경우, 애플리케이션의 `config/fortify.php` 설정 파일에서 `views` 값을 `false`로 설정하여 해당 라우트를 완전히 비활성화할 수 있습니다:

```php
'views' => false,
```


#### 뷰 비활성화와 비밀번호 재설정 {#disabling-views-and-password-reset}

Fortify의 뷰를 비활성화하고 애플리케이션에서 비밀번호 재설정 기능을 구현할 경우, "비밀번호 재설정" 뷰를 표시하는 `password.reset` 이름의 라우트는 반드시 정의해야 합니다. 이는 Laravel의 `Illuminate\Auth\Notifications\ResetPassword` 알림이 `password.reset` 이름의 라우트를 통해 비밀번호 재설정 URL을 생성하기 때문입니다.


## 인증 {#authentication}

먼저, Fortify가 "로그인" 뷰를 반환하는 방법을 지정해야 합니다. Fortify는 헤드리스 인증 라이브러리임을 기억하세요. 이미 완성된 프론트엔드 인증 구현이 필요하다면 [스타터 키트](/laravel/12.x/starter-kits)를 사용하세요.

모든 인증 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다. Fortify는 이 뷰를 반환하는 `/login` 라우트를 자동으로 정의합니다:

```php
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::loginView(function () {
        return view('auth.login');
    });

    // ...
}
```

로그인 템플릿에는 `/login`으로 POST 요청을 보내는 폼이 포함되어야 합니다. `/login` 엔드포인트는 문자열 `email`/`username`과 `password`를 기대합니다. 이메일/유저네임 필드의 이름은 `config/fortify.php` 설정 파일의 `username` 값과 일치해야 합니다. 또한, 사용자가 Laravel의 "로그인 유지" 기능을 사용하고자 할 경우, 불리언 `remember` 필드를 추가할 수 있습니다.

로그인에 성공하면, Fortify는 애플리케이션의 `fortify` 설정 파일의 `home` 옵션에 설정된 URI로 리디렉션합니다. 로그인 요청이 XHR 요청이었다면 200 HTTP 응답이 반환됩니다.

로그인에 실패하면 사용자는 로그인 화면으로 다시 리디렉션되며, 검증 오류는 공유된 `$errors` [Blade 템플릿 변수](/laravel/12.x/validation#quick-displaying-the-validation-errors)를 통해 확인할 수 있습니다. XHR 요청의 경우, 검증 오류가 422 HTTP 응답과 함께 반환됩니다.


### 사용자 인증 커스터마이징 {#customizing-user-authentication}

Fortify는 제공된 자격 증명과 애플리케이션에 설정된 인증 가드를 기반으로 사용자를 자동으로 조회하고 인증합니다. 하지만 로그인 자격 증명 인증 및 사용자 조회 방식을 완전히 커스터마이즈하고 싶을 때가 있습니다. Fortify는 `Fortify::authenticateUsing` 메서드를 통해 이를 쉽게 구현할 수 있도록 지원합니다.

이 메서드는 들어오는 HTTP 요청을 받는 클로저를 인자로 받습니다. 클로저는 요청에 첨부된 로그인 자격 증명을 검증하고, 해당 사용자 인스턴스를 반환해야 합니다. 자격 증명이 유효하지 않거나 사용자를 찾을 수 없는 경우, 클로저는 `null` 또는 `false`를 반환해야 합니다. 일반적으로 이 메서드는 `FortifyServiceProvider`의 `boot` 메서드에서 호출해야 합니다:

```php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::authenticateUsing(function (Request $request) {
        $user = User::where('email', $request->email)->first();

        if ($user &&
            Hash::check($request->password, $user->password)) {
            return $user;
        }
    });

    // ...
}
```


#### 인증 가드 {#authentication-guard}

Fortify에서 사용할 인증 가드는 애플리케이션의 `fortify` 설정 파일에서 커스터마이즈할 수 있습니다. 단, 설정된 가드는 반드시 `Illuminate\Contracts\Auth\StatefulGuard`의 구현체여야 합니다. SPA 인증에 Fortify를 사용하려면, Laravel의 기본 `web` 가드를 [Laravel Sanctum](/laravel/12.x/sanctum)과 함께 사용해야 합니다.


### 인증 파이프라인 커스터마이징 {#customizing-the-authentication-pipeline}

Laravel Fortify는 로그인 요청을 호출 가능한 클래스의 파이프라인을 통해 인증합니다. 원한다면 로그인 요청이 거치는 커스텀 파이프라인을 정의할 수 있습니다. 각 클래스는 들어오는 `Illuminate\Http\Request` 인스턴스와, 파이프라인의 다음 클래스로 요청을 전달하는 `$next` 변수를 받는 `__invoke` 메서드를 가져야 합니다([미들웨어](/laravel/12.x/middleware)와 유사).

커스텀 파이프라인을 정의하려면 `Fortify::authenticateThrough` 메서드를 사용하세요. 이 메서드는 로그인 요청이 거칠 클래스 배열을 반환하는 클로저를 인자로 받습니다. 일반적으로 이 메서드는 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다.

아래 예시는 커스터마이징의 출발점으로 사용할 수 있는 기본 파이프라인 정의입니다:

```php
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\CanonicalizeUsername;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;

Fortify::authenticateThrough(function (Request $request) {
    return array_filter([
            config('fortify.limiters.login') ? null : EnsureLoginIsNotThrottled::class,
            config('fortify.lowercase_usernames') ? CanonicalizeUsername::class : null,
            Features::enabled(Features::twoFactorAuthentication()) ? RedirectIfTwoFactorAuthenticatable::class : null,
            AttemptToAuthenticate::class,
            PrepareAuthenticatedSession::class,
    ]);
});
```

#### 인증 시도 제한(Throttling)

기본적으로 Fortify는 `EnsureLoginIsNotThrottled` 미들웨어를 사용해 인증 시도를 제한합니다. 이 미들웨어는 유저네임과 IP 주소 조합별로 시도를 제한합니다.

일부 애플리케이션에서는 IP 주소만으로 인증 시도를 제한하는 등 다른 방식이 필요할 수 있습니다. Fortify는 `fortify.limiters.login` 설정 옵션을 통해 [사용자 지정 속도 제한자](/laravel/12.x/routing#rate-limiting)를 지정할 수 있습니다. 이 설정 옵션은 애플리케이션의 `config/fortify.php` 파일에 있습니다.

> [!NOTE]
> 인증 시도 제한, [2단계 인증](/laravel/12.x/fortify#two-factor-authentication), 외부 웹 애플리케이션 방화벽(WAF)을 함께 사용하면 합법적인 사용자에게 가장 강력한 방어를 제공할 수 있습니다.


### 리디렉션 커스터마이징 {#customizing-authentication-redirects}

로그인에 성공하면, Fortify는 애플리케이션의 `fortify` 설정 파일의 `home` 옵션에 설정된 URI로 리디렉션합니다. 로그인 요청이 XHR 요청이었다면 200 HTTP 응답이 반환됩니다. 사용자가 로그아웃하면 `/` URI로 리디렉션됩니다.

이 동작을 더 세밀하게 커스터마이즈하려면, `LoginResponse`와 `LogoutResponse` 계약의 구현체를 Laravel [서비스 컨테이너](/laravel/12.x/container)에 바인딩할 수 있습니다. 일반적으로 이 작업은 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `register` 메서드에서 수행합니다:

```php
use Laravel\Fortify\Contracts\LogoutResponse;

/**
 * 애플리케이션 서비스 등록.
 */
public function register(): void
{
    $this->app->instance(LogoutResponse::class, new class implements LogoutResponse {
        public function toResponse($request)
        {
            return redirect('/');
        }
    });
}
```


## 2단계 인증 {#two-factor-authentication}

Fortify의 2단계 인증 기능이 활성화되면, 사용자는 인증 과정에서 6자리 숫자 토큰을 입력해야 합니다. 이 토큰은 Google Authenticator와 같은 TOTP 호환 모바일 인증 앱에서 가져올 수 있는 시간 기반 일회용 비밀번호(TOTP)로 생성됩니다.

먼저, 애플리케이션의 `App\Models\User` 모델이 `Laravel\Fortify\TwoFactorAuthenticatable` 트레이트를 사용하는지 확인하세요:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use Notifiable, TwoFactorAuthenticatable;
}
```

다음으로, 사용자가 2단계 인증 설정을 관리할 수 있는 화면을 애플리케이션에 구현해야 합니다. 이 화면에서는 2단계 인증 활성화/비활성화, 복구 코드 재생성 기능을 제공해야 합니다.

> 기본적으로 `fortify` 설정 파일의 `features` 배열은 2단계 인증 설정 변경 시 비밀번호 확인을 요구하도록 Fortify에 지시합니다. 따라서, 계속 진행하기 전에 Fortify의 [비밀번호 확인](#password-confirmation) 기능을 구현해야 합니다.


### 2단계 인증 활성화 {#enabling-two-factor-authentication}

2단계 인증을 활성화하려면, 애플리케이션에서 Fortify가 정의한 `/user/two-factor-authentication` 엔드포인트로 POST 요청을 보내야 합니다. 요청이 성공하면 사용자는 이전 URL로 리디렉션되고, `status` 세션 변수에 `two-factor-authentication-enabled`가 설정됩니다. 이 세션 변수를 템플릿에서 감지해 성공 메시지를 표시할 수 있습니다. XHR 요청의 경우 200 HTTP 응답이 반환됩니다.

2단계 인증을 활성화한 후, 사용자는 유효한 2단계 인증 코드를 입력해 2단계 인증 구성을 "확인"해야 합니다. 따라서 "성공" 메시지에는 2단계 인증 확인이 아직 필요하다는 안내가 포함되어야 합니다:

```html
@if (session('status') == 'two-factor-authentication-enabled')
    <div class="mb-4 font-medium text-sm">
        아래에서 2단계 인증 구성을 완료하세요.
    </div>
@endif
```

다음으로, 사용자가 인증 앱에 등록할 수 있도록 2단계 인증 QR 코드를 표시해야 합니다. Blade를 사용해 프론트엔드를 렌더링하는 경우, 사용자 인스턴스의 `twoFactorQrCodeSvg` 메서드를 사용해 QR 코드 SVG를 가져올 수 있습니다:

```php
$request->user()->twoFactorQrCodeSvg();
```

JavaScript 기반 프론트엔드를 구축하는 경우, `/user/two-factor-qr-code` 엔드포인트에 XHR GET 요청을 보내 사용자의 2단계 인증 QR 코드를 가져올 수 있습니다. 이 엔드포인트는 `svg` 키가 포함된 JSON 객체를 반환합니다.


#### 2단계 인증 확인 {#confirming-two-factor-authentication}

사용자의 2단계 인증 QR 코드를 표시하는 것 외에도, 사용자가 유효한 인증 코드를 입력해 2단계 인증 구성을 "확인"할 수 있는 텍스트 입력란을 제공해야 합니다. 이 코드는 Fortify가 정의한 `/user/confirmed-two-factor-authentication` 엔드포인트로 POST 요청을 통해 Laravel 애플리케이션에 전달되어야 합니다.

요청이 성공하면 사용자는 이전 URL로 리디렉션되고, `status` 세션 변수에 `two-factor-authentication-confirmed`가 설정됩니다:

```html
@if (session('status') == 'two-factor-authentication-confirmed')
    <div class="mb-4 font-medium text-sm">
        2단계 인증이 성공적으로 확인 및 활성화되었습니다.
    </div>
@endif
```

2단계 인증 확인 엔드포인트에 XHR 요청을 보낸 경우, 200 HTTP 응답이 반환됩니다.


#### 복구 코드 표시 {#displaying-the-recovery-codes}

사용자의 2단계 인증 복구 코드도 표시해야 합니다. 복구 코드는 사용자가 모바일 기기에 접근할 수 없을 때 인증에 사용할 수 있습니다. Blade를 사용해 프론트엔드를 렌더링하는 경우, 인증된 사용자 인스턴스에서 복구 코드를 가져올 수 있습니다:

```php
(array) $request->user()->recoveryCodes()
```

JavaScript 기반 프론트엔드를 구축하는 경우, `/user/two-factor-recovery-codes` 엔드포인트에 XHR GET 요청을 보내면 사용자의 복구 코드가 포함된 JSON 배열을 받을 수 있습니다.

복구 코드를 재생성하려면, `/user/two-factor-recovery-codes` 엔드포인트로 POST 요청을 보내면 됩니다.


### 2단계 인증으로 인증하기 {#authenticating-with-two-factor-authentication}

인증 과정에서 Fortify는 사용자를 애플리케이션의 2단계 인증 도전 화면으로 자동 리디렉션합니다. 하지만 애플리케이션이 XHR 로그인 요청을 보내는 경우, 인증 성공 시 반환되는 JSON 응답에는 `two_factor` 불리언 속성이 포함된 객체가 있습니다. 이 값을 확인해 2단계 인증 도전 화면으로 리디렉션할지 결정해야 합니다.

2단계 인증 기능을 구현하려면, Fortify가 2단계 인증 도전 뷰를 반환하는 방법을 지정해야 합니다. 모든 인증 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::twoFactorChallengeView(function () {
        return view('auth.two-factor-challenge');
    });

    // ...
}
```

Fortify는 이 뷰를 반환하는 `/two-factor-challenge` 라우트를 자동으로 정의합니다. `two-factor-challenge` 템플릿에는 `/two-factor-challenge` 엔드포인트로 POST 요청을 보내는 폼이 포함되어야 합니다. 이 엔드포인트는 유효한 TOTP 토큰이 담긴 `code` 필드 또는 복구 코드가 담긴 `recovery_code` 필드를 기대합니다.

로그인에 성공하면, Fortify는 애플리케이션의 `fortify` 설정 파일의 `home` 옵션에 설정된 URI로 사용자를 리디렉션합니다. 로그인 요청이 XHR 요청이었다면 204 HTTP 응답이 반환됩니다.

로그인에 실패하면 사용자는 2단계 인증 도전 화면으로 다시 리디렉션되며, 검증 오류는 공유된 `$errors` [Blade 템플릿 변수](/laravel/12.x/validation#quick-displaying-the-validation-errors)를 통해 확인할 수 있습니다. XHR 요청의 경우, 검증 오류가 422 HTTP 응답과 함께 반환됩니다.


### 2단계 인증 비활성화 {#disabling-two-factor-authentication}

2단계 인증을 비활성화하려면, 애플리케이션에서 `/user/two-factor-authentication` 엔드포인트로 DELETE 요청을 보내야 합니다. Fortify의 2단계 인증 엔드포인트는 호출 전에 [비밀번호 확인](#password-confirmation)이 필요함을 기억하세요.


## 회원가입 {#registration}

애플리케이션의 회원가입 기능을 구현하려면, Fortify가 "회원가입" 뷰를 반환하는 방법을 지정해야 합니다. Fortify는 헤드리스 인증 라이브러리임을 기억하세요. 이미 완성된 프론트엔드 인증 구현이 필요하다면 [스타터 키트](/laravel/12.x/starter-kits)를 사용하세요.

모든 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::registerView(function () {
        return view('auth.register');
    });

    // ...
}
```

Fortify는 이 뷰를 반환하는 `/register` 라우트를 자동으로 정의합니다. `register` 템플릿에는 Fortify가 정의한 `/register` 엔드포인트로 POST 요청을 보내는 폼이 포함되어야 합니다.

`/register` 엔드포인트는 문자열 `name`, 문자열 이메일 주소/유저네임, `password`, `password_confirmation` 필드를 기대합니다. 이메일/유저네임 필드의 이름은 애플리케이션의 `fortify` 설정 파일에 정의된 `username` 값과 일치해야 합니다.

회원가입에 성공하면, Fortify는 애플리케이션의 `fortify` 설정 파일의 `home` 옵션에 설정된 URI로 사용자를 리디렉션합니다. 요청이 XHR 요청이었다면 201 HTTP 응답이 반환됩니다.

회원가입에 실패하면 사용자는 회원가입 화면으로 다시 리디렉션되며, 검증 오류는 공유된 `$errors` [Blade 템플릿 변수](/laravel/12.x/validation#quick-displaying-the-validation-errors)를 통해 확인할 수 있습니다. XHR 요청의 경우, 검증 오류가 422 HTTP 응답과 함께 반환됩니다.


### 회원가입 커스터마이징 {#customizing-registration}

사용자 검증 및 생성 과정은 Laravel Fortify 설치 시 생성된 `App\Actions\Fortify\CreateNewUser` 액션을 수정하여 커스터마이즈할 수 있습니다.


## 비밀번호 재설정 {#password-reset}


### 비밀번호 재설정 링크 요청 {#requesting-a-password-reset-link}

애플리케이션의 비밀번호 재설정 기능을 구현하려면, Fortify가 "비밀번호 찾기" 뷰를 반환하는 방법을 지정해야 합니다. Fortify는 헤드리스 인증 라이브러리임을 기억하세요. 이미 완성된 프론트엔드 인증 구현이 필요하다면 [스타터 키트](/laravel/12.x/starter-kits)를 사용하세요.

모든 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::requestPasswordResetLinkView(function () {
        return view('auth.forgot-password');
    });

    // ...
}
```

Fortify는 이 뷰를 반환하는 `/forgot-password` 엔드포인트를 자동으로 정의합니다. `forgot-password` 템플릿에는 `/forgot-password` 엔드포인트로 POST 요청을 보내는 폼이 포함되어야 합니다.

`/forgot-password` 엔드포인트는 문자열 `email` 필드를 기대합니다. 이 필드/데이터베이스 컬럼의 이름은 애플리케이션의 `fortify` 설정 파일의 `email` 값과 일치해야 합니다.


#### 비밀번호 재설정 링크 요청 응답 처리 {#handling-the-password-reset-link-request-response}

비밀번호 재설정 링크 요청이 성공하면, Fortify는 사용자를 `/forgot-password` 엔드포인트로 다시 리디렉션하고, 사용자가 비밀번호를 재설정할 수 있는 보안 링크가 포함된 이메일을 발송합니다. 요청이 XHR 요청이었다면 200 HTTP 응답이 반환됩니다.

성공적인 요청 후 `/forgot-password` 엔드포인트로 리디렉션되면, `status` 세션 변수를 사용해 비밀번호 재설정 링크 요청의 상태를 표시할 수 있습니다.

`$status` 세션 변수의 값은 애플리케이션의 `passwords` [언어 파일](/laravel/12.x/localization)에 정의된 번역 문자열 중 하나와 일치합니다. 이 값을 커스터마이즈하고 싶고, Laravel의 언어 파일을 퍼블리시하지 않았다면 `lang:publish` 아티즌 명령어를 사용하세요:

```html
@if (session('status'))
    <div class="mb-4 font-medium text-sm text-green-600">
        {{ session('status') }}
    </div>
@endif
```

요청이 실패하면 사용자는 비밀번호 재설정 링크 요청 화면으로 다시 리디렉션되며, 검증 오류는 공유된 `$errors` [Blade 템플릿 변수](/laravel/12.x/validation#quick-displaying-the-validation-errors)를 통해 확인할 수 있습니다. XHR 요청의 경우, 검증 오류가 422 HTTP 응답과 함께 반환됩니다.


### 비밀번호 재설정 {#resetting-the-password}

비밀번호 재설정 기능 구현을 마치려면, Fortify가 "비밀번호 재설정" 뷰를 반환하는 방법을 지정해야 합니다.

모든 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::resetPasswordView(function (Request $request) {
        return view('auth.reset-password', ['request' => $request]);
    });

    // ...
}
```

Fortify는 이 뷰를 표시하는 라우트를 자동으로 정의합니다. `reset-password` 템플릿에는 `/reset-password`로 POST 요청을 보내는 폼이 포함되어야 합니다.

`/reset-password` 엔드포인트는 문자열 `email` 필드, `password` 필드, `password_confirmation` 필드, 그리고 `request()->route('token')` 값을 담은 숨겨진 `token` 필드를 기대합니다. "email" 필드/데이터베이스 컬럼의 이름은 애플리케이션의 `fortify` 설정 파일에 정의된 `email` 값과 일치해야 합니다.


#### 비밀번호 재설정 응답 처리 {#handling-the-password-reset-response}

비밀번호 재설정 요청이 성공하면, Fortify는 사용자가 새 비밀번호로 로그인할 수 있도록 `/login` 라우트로 리디렉션합니다. 또한, 로그인 화면에서 성공 상태를 표시할 수 있도록 `status` 세션 변수가 설정됩니다:

```blade
@if (session('status'))
    <div class="mb-4 font-medium text-sm text-green-600">
        {{ session('status') }}
    </div>
@endif
```

요청이 XHR 요청이었다면 200 HTTP 응답이 반환됩니다.

요청이 실패하면 사용자는 비밀번호 재설정 화면으로 다시 리디렉션되며, 검증 오류는 공유된 `$errors` [Blade 템플릿 변수](/laravel/12.x/validation#quick-displaying-the-validation-errors)를 통해 확인할 수 있습니다. XHR 요청의 경우, 검증 오류가 422 HTTP 응답과 함께 반환됩니다.


### 비밀번호 재설정 커스터마이징 {#customizing-password-resets}

비밀번호 재설정 과정은 Laravel Fortify 설치 시 생성된 `App\Actions\ResetUserPassword` 액션을 수정하여 커스터마이즈할 수 있습니다.


## 이메일 인증 {#email-verification}

회원가입 후, 사용자가 애플리케이션에 계속 접근하기 전에 이메일 주소를 인증하도록 요구할 수 있습니다. 먼저, `fortify` 설정 파일의 `features` 배열에서 `emailVerification` 기능이 활성화되어 있는지 확인하세요. 다음으로, `App\Models\User` 클래스가 `Illuminate\Contracts\Auth\MustVerifyEmail` 인터페이스를 구현하는지 확인해야 합니다.

이 두 가지 설정이 완료되면, 새로 가입한 사용자에게 이메일 주소 소유권을 인증하라는 이메일이 전송됩니다. 하지만, 사용자가 이메일의 인증 링크를 클릭해야 함을 안내하는 이메일 인증 화면을 Fortify가 표시하는 방법을 지정해야 합니다.

모든 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::verifyEmailView(function () {
        return view('auth.verify-email');
    });

    // ...
}
```

Fortify는 사용자가 Laravel의 내장 `verified` 미들웨어에 의해 `/email/verify` 엔드포인트로 리디렉션될 때 이 뷰를 표시하는 라우트를 자동으로 정의합니다.

`verify-email` 템플릿에는 사용자가 이메일로 전송된 인증 링크를 클릭해야 함을 안내하는 메시지가 포함되어야 합니다.


#### 이메일 인증 링크 재전송 {#resending-email-verification-links}

원한다면, 애플리케이션의 `verify-email` 템플릿에 `/email/verification-notification` 엔드포인트로 POST 요청을 트리거하는 버튼을 추가할 수 있습니다. 이 엔드포인트가 요청을 받으면, 사용자에게 새로운 인증 이메일 링크가 전송되어 이전 링크를 실수로 삭제하거나 분실한 경우에도 새 인증 링크를 받을 수 있습니다.

인증 링크 이메일 재전송 요청이 성공하면, Fortify는 사용자를 `/email/verify` 엔드포인트로 다시 리디렉션하고, `status` 세션 변수를 통해 성공 메시지를 표시할 수 있습니다. XHR 요청의 경우 202 HTTP 응답이 반환됩니다:

```blade
@if (session('status') == 'verification-link-sent')
    <div class="mb-4 font-medium text-sm text-green-600">
        새로운 이메일 인증 링크가 전송되었습니다!
    </div>
@endif
```


### 라우트 보호 {#protecting-routes}

특정 라우트 또는 라우트 그룹이 사용자의 이메일 인증을 요구하도록 하려면, 해당 라우트에 Laravel의 내장 `verified` 미들웨어를 적용하세요. `verified` 미들웨어 별칭은 Laravel에 의해 자동으로 등록되며, `Illuminate\Auth\Middleware\EnsureEmailIsVerified` 미들웨어의 별칭 역할을 합니다:

```php
Route::get('/dashboard', function () {
    // ...
})->middleware(['verified']);
```


## 비밀번호 확인 {#password-confirmation}

애플리케이션을 개발하다 보면, 사용자가 특정 작업을 수행하기 전에 비밀번호를 다시 확인해야 하는 경우가 있습니다. 일반적으로 이러한 라우트는 Laravel의 내장 `password.confirm` 미들웨어로 보호됩니다.

비밀번호 확인 기능을 구현하려면, Fortify가 애플리케이션의 "비밀번호 확인" 뷰를 반환하는 방법을 지정해야 합니다. Fortify는 헤드리스 인증 라이브러리임을 기억하세요. 이미 완성된 프론트엔드 인증 구현이 필요하다면 [스타터 키트](/laravel/12.x/starter-kits)를 사용하세요.

모든 뷰 렌더링 로직은 `Laravel\Fortify\Fortify` 클래스의 적절한 메서드를 통해 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\FortifyServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Fortify\Fortify;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Fortify::confirmPasswordView(function () {
        return view('auth.confirm-password');
    });

    // ...
}
```

Fortify는 이 뷰를 반환하는 `/user/confirm-password` 엔드포인트를 자동으로 정의합니다. `confirm-password` 템플릿에는 `/user/confirm-password` 엔드포인트로 POST 요청을 보내는 폼이 포함되어야 합니다. 이 엔드포인트는 사용자의 현재 비밀번호가 담긴 `password` 필드를 기대합니다.

비밀번호가 사용자의 현재 비밀번호와 일치하면, Fortify는 사용자가 접근하려던 라우트로 리디렉션합니다. 요청이 XHR 요청이었다면 201 HTTP 응답이 반환됩니다.

요청이 실패하면 사용자는 비밀번호 확인 화면으로 다시 리디렉션되며, 검증 오류는 공유된 `$errors` Blade 템플릿 변수를 통해 확인할 수 있습니다. XHR 요청의 경우, 검증 오류가 422 HTTP 응답과 함께 반환됩니다.
