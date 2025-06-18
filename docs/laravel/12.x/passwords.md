# [보안] 비밀번호 재설정












## 소개 {#introduction}

대부분의 웹 애플리케이션은 사용자가 잊어버린 비밀번호를 재설정할 수 있는 방법을 제공합니다. 매번 애플리케이션을 만들 때마다 이를 직접 구현하지 않도록, Laravel은 비밀번호 재설정 링크를 보내고 안전하게 비밀번호를 재설정할 수 있는 편리한 서비스를 제공합니다.

> [!NOTE]
> 빠르게 시작하고 싶으신가요? 새로운 Laravel 애플리케이션에 Laravel [애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 설치하세요. Laravel의 스타터 키트는 비밀번호 재설정을 포함한 전체 인증 시스템의 스캐폴딩을 자동으로 처리해줍니다.


### 모델 준비 {#model-preparation}

Laravel의 비밀번호 재설정 기능을 사용하기 전에, 애플리케이션의 `App\Models\User` 모델이 `Illuminate\Notifications\Notifiable` 트레이트를 사용하고 있는지 확인해야 합니다. 일반적으로 이 트레이트는 새로운 Laravel 애플리케이션에서 생성되는 기본 `App\Models\User` 모델에 이미 포함되어 있습니다.

다음으로, `App\Models\User` 모델이 `Illuminate\Contracts\Auth\CanResetPassword` 계약을 구현하고 있는지 확인하세요. 프레임워크에 포함된 `App\Models\User` 모델은 이미 이 인터페이스를 구현하고 있으며, `Illuminate\Auth\Passwords\CanResetPassword` 트레이트를 사용하여 인터페이스 구현에 필요한 메서드들을 포함하고 있습니다.


### 데이터베이스 준비 {#database-preparation}

애플리케이션의 비밀번호 재설정 토큰을 저장하기 위해 테이블을 생성해야 합니다. 일반적으로 이는 Laravel의 기본 `0001_01_01_000000_create_users_table.php` 데이터베이스 마이그레이션에 포함되어 있습니다.


### 신뢰할 수 있는 호스트 구성하기 {#configuring-trusted-hosts}

기본적으로 Laravel은 HTTP 요청의 `Host` 헤더 내용과 상관없이 수신하는 모든 요청에 응답합니다. 또한, 웹 요청 중 애플리케이션의 절대 URL을 생성할 때 `Host` 헤더의 값이 사용됩니다.

일반적으로 Nginx나 Apache와 같은 웹 서버를 구성하여 특정 호스트명과 일치하는 요청만 애플리케이션으로 전달하도록 설정해야 합니다. 하지만 웹 서버를 직접 커스터마이즈할 수 없는 경우, Laravel이 특정 호스트명에만 응답하도록 하려면 애플리케이션의 `bootstrap/app.php` 파일에서 `trustHosts` 미들웨어 메서드를 사용할 수 있습니다. 이는 애플리케이션이 비밀번호 재설정 기능을 제공할 때 특히 중요합니다.

이 미들웨어 메서드에 대해 더 자세히 알아보려면 [TrustHosts 미들웨어 문서](/laravel/12.x/requests#configuring-trusted-hosts)를 참고하세요.


## 라우팅 {#routing}

사용자가 비밀번호를 재설정할 수 있도록 지원하려면 여러 라우트를 정의해야 합니다. 먼저, 사용자가 자신의 이메일 주소를 통해 비밀번호 재설정 링크를 요청할 수 있도록 처리하는 두 개의 라우트가 필요합니다. 두 번째로, 사용자가 이메일로 전송된 비밀번호 재설정 링크를 방문하고 비밀번호 재설정 폼을 완료하면 실제로 비밀번호를 재설정하는 두 개의 라우트가 필요합니다.


### 비밀번호 재설정 링크 요청하기 {#requesting-the-password-reset-link}


#### 비밀번호 재설정 링크 요청 폼 {#the-password-reset-link-request-form}

먼저, 비밀번호 재설정 링크를 요청하는 데 필요한 라우트를 정의하겠습니다. 시작하기 위해, 비밀번호 재설정 링크 요청 폼이 포함된 뷰를 반환하는 라우트를 정의합니다:

```php
Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');
```

이 라우트에서 반환되는 뷰에는 `email` 필드가 포함된 폼이 있어야 하며, 사용자가 해당 이메일 주소로 비밀번호 재설정 링크를 요청할 수 있도록 해야 합니다.


#### 폼 제출 처리 {#password-reset-link-handling-the-form-submission}

다음으로, "비밀번호 찾기" 뷰에서 폼 제출 요청을 처리하는 라우트를 정의하겠습니다. 이 라우트는 이메일 주소를 검증하고 해당 사용자에게 비밀번호 재설정 요청을 보내는 역할을 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::ResetLinkSent
        ? back()->with(['status' => __($status)])
        : back()->withErrors(['email' => __($status)]);
})->middleware('guest')->name('password.email');
```

다음 단계로 넘어가기 전에, 이 라우트를 좀 더 자세히 살펴보겠습니다. 먼저, 요청의 `email` 속성이 검증됩니다. 그 다음, Laravel의 내장 "비밀번호 브로커"(`Password` 파사드를 통해 제공)를 사용하여 사용자에게 비밀번호 재설정 링크를 보냅니다. 비밀번호 브로커는 주어진 필드(이 경우 이메일 주소)로 사용자를 조회하고, Laravel의 내장 [알림 시스템](/laravel/12.x/notifications)을 통해 비밀번호 재설정 링크를 사용자에게 전송합니다.

`sendResetLink` 메서드는 "status" 슬러그를 반환합니다. 이 status는 Laravel의 [로컬라이제이션](/laravel/12.x/localization) 헬퍼를 사용하여 사용자의 요청 상태에 대해 사용자 친화적인 메시지를 표시할 수 있도록 번역할 수 있습니다. 비밀번호 재설정 상태의 번역은 애플리케이션의 `lang/{lang}/passwords.php` 언어 파일에 의해 결정됩니다. status 슬러그의 가능한 각 값에 대한 항목이 `passwords` 언어 파일 내에 위치합니다.

> [!NOTE]
> 기본적으로, Laravel 애플리케이션 스캐폴딩에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하고 싶다면, `lang:publish` Artisan 명령어를 통해 파일을 퍼블리시할 수 있습니다.

`Password` 파사드의 `sendResetLink` 메서드를 호출할 때, Laravel이 어떻게 애플리케이션 데이터베이스에서 사용자 레코드를 조회하는지 궁금할 수 있습니다. Laravel 비밀번호 브로커는 인증 시스템의 "user providers"를 사용하여 데이터베이스 레코드를 조회합니다. 비밀번호 브로커에서 사용하는 user provider는 `config/auth.php` 설정 파일의 `passwords` 설정 배열 내에서 구성됩니다. 커스텀 user provider 작성에 대해 더 알고 싶다면 [인증 문서](/laravel/12.x/authentication#adding-custom-user-providers)를 참고하세요.

> [!NOTE]
> 비밀번호 재설정을 수동으로 구현할 때는 뷰와 라우트의 내용을 직접 정의해야 합니다. 모든 필요한 인증 및 검증 로직이 포함된 스캐폴딩이 필요하다면, [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 확인해보세요.


### 비밀번호 재설정 {#resetting-the-password}


#### 비밀번호 재설정 폼 {#the-password-reset-form}

다음으로, 사용자가 이메일로 받은 비밀번호 재설정 링크를 클릭하고 새 비밀번호를 입력했을 때 실제로 비밀번호를 재설정하는 데 필요한 라우트를 정의하겠습니다. 먼저, 사용자가 비밀번호 재설정 링크를 클릭했을 때 표시되는 비밀번호 재설정 폼을 보여주는 라우트를 정의해봅시다. 이 라우트는 나중에 비밀번호 재설정 요청을 검증하는 데 사용할 `token` 파라미터를 받게 됩니다:

```php
Route::get('/reset-password/{token}', function (string $token) {
    return view('auth.reset-password', ['token' => $token]);
})->middleware('guest')->name('password.reset');
```

이 라우트에서 반환되는 뷰는 `email` 필드, `password` 필드, `password_confirmation` 필드, 그리고 숨겨진 `token` 필드를 포함하는 폼을 표시해야 하며, 이 `token` 필드에는 라우트에서 받은 비밀 `$token` 값이 들어가야 합니다.


#### 폼 제출 처리 {#password-reset-handling-the-form-submission}

물론, 실제로 비밀번호 재설정 폼 제출을 처리할 라우트를 정의해야 합니다. 이 라우트는 들어오는 요청을 검증하고 데이터베이스에서 사용자의 비밀번호를 업데이트하는 역할을 합니다:

```php
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PasswordReset
        ? redirect()->route('login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');
```

다음으로 넘어가기 전에, 이 라우트를 좀 더 자세히 살펴보겠습니다. 먼저, 요청의 `token`, `email`, `password` 속성이 검증됩니다. 그 다음, Laravel의 내장 "비밀번호 브로커"(`Password` 파사드를 통해 제공)를 사용하여 비밀번호 재설정 요청 자격 증명을 검증합니다.

토큰, 이메일 주소, 비밀번호가 비밀번호 브로커에 의해 유효하다고 판단되면, `reset` 메서드에 전달된 클로저가 호출됩니다. 이 클로저는 비밀번호 재설정 폼에 입력된 평문 비밀번호와 사용자 인스턴스를 받아 데이터베이스에서 사용자의 비밀번호를 업데이트할 수 있습니다.

`reset` 메서드는 "status" 슬러그를 반환합니다. 이 status는 Laravel의 [로컬라이제이션](/laravel/12.x/localization) 헬퍼를 사용하여, 요청 상태에 대한 사용자 친화적인 메시지를 표시할 수 있도록 번역할 수 있습니다. 비밀번호 재설정 status의 번역은 애플리케이션의 `lang/{lang}/passwords.php` 언어 파일에 의해 결정됩니다. status 슬러그의 가능한 값마다 `passwords` 언어 파일에 항목이 존재합니다. 애플리케이션에 `lang` 디렉터리가 없다면, `lang:publish` Artisan 명령어를 사용해 생성할 수 있습니다.

다음으로 넘어가기 전에, `Password` 파사드의 `reset` 메서드를 호출할 때 Laravel이 어떻게 애플리케이션 데이터베이스에서 사용자 레코드를 가져오는지 궁금할 수 있습니다. Laravel 비밀번호 브로커는 인증 시스템의 "user providers"를 사용하여 데이터베이스 레코드를 조회합니다. 비밀번호 브로커에서 사용하는 user provider는 `config/auth.php` 설정 파일의 `passwords` 설정 배열에서 구성됩니다. 커스텀 user provider 작성에 대해 더 알고 싶다면 [인증 문서](/laravel/12.x/authentication#adding-custom-user-providers)를 참고하세요.


## 만료된 토큰 삭제하기 {#deleting-expired-tokens}

만료된 비밀번호 재설정 토큰은 여전히 데이터베이스에 남아 있을 수 있습니다. 하지만 `auth:clear-resets` Artisan 명령어를 사용하여 이러한 레코드를 쉽게 삭제할 수 있습니다:

```shell
php artisan auth:clear-resets
```

이 과정을 자동화하고 싶다면, 해당 명령어를 애플리케이션의 [스케줄러](/laravel/12.x/scheduling)에 추가하는 것을 고려해보세요:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('auth:clear-resets')->everyFifteenMinutes();
```


## 사용자 지정 {#password-customization}


#### 재설정 링크 커스터마이징 {#reset-link-customization}

`ResetPassword` 알림 클래스에서 제공하는 `createUrlUsing` 메서드를 사용하여 비밀번호 재설정 링크 URL을 커스터마이즈할 수 있습니다. 이 메서드는 알림을 받는 사용자 인스턴스와 비밀번호 재설정 링크 토큰을 전달받는 클로저를 인자로 받습니다. 일반적으로 이 메서드는 `App\Providers\AppServiceProvider` 서비스 프로바이더의 `boot` 메서드에서 호출해야 합니다:

```php
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    ResetPassword::createUrlUsing(function (User $user, string $token) {
        return 'https://example.com/reset-password?token='.$token;
    });
}
```


#### 비밀번호 재설정 이메일 커스터마이징 {#reset-email-customization}

비밀번호 재설정 링크를 사용자에게 전송할 때 사용되는 알림 클래스를 쉽게 수정할 수 있습니다. 시작하려면, `App\Models\User` 모델에서 `sendPasswordResetNotification` 메서드를 오버라이드하세요. 이 메서드 내에서, 여러분이 직접 만든 [알림 클래스](/laravel/12.x/notifications)를 사용하여 알림을 전송할 수 있습니다. 비밀번호 재설정 `$token`은 이 메서드가 받는 첫 번째 인자입니다. 이 `$token`을 사용하여 원하는 비밀번호 재설정 URL을 만들고, 해당 알림을 사용자에게 전송할 수 있습니다:

```php
use App\Notifications\ResetPasswordNotification;

/**
 * 사용자에게 비밀번호 재설정 알림을 전송합니다.
 *
 * @param  string  $token
 */
public function sendPasswordResetNotification($token): void
{
    $url = 'https://example.com/reset-password?token='.$token;

    $this->notify(new ResetPasswordNotification($url));
}
```
