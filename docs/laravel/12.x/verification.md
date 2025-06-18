# [보안] 이메일 인증













## 소개 {#introduction}

많은 웹 애플리케이션에서는 사용자가 애플리케이션을 사용하기 전에 이메일 주소를 인증하도록 요구합니다. 매번 직접 이 기능을 구현하지 않도록, Laravel은 이메일 인증 요청을 보내고 검증하는 편리한 내장 서비스를 제공합니다.

> [!NOTE]
> 빠르게 시작하고 싶으신가요? 새로운 Laravel 애플리케이션에 [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits) 중 하나를 설치하세요. 스타터 키트는 이메일 인증 지원을 포함하여 전체 인증 시스템의 스캐폴딩을 자동으로 처리해줍니다.


### 모델 준비 {#model-preparation}

시작하기 전에, `App\Models\User` 모델이 `Illuminate\Contracts\Auth\MustVerifyEmail` 계약을 구현하고 있는지 확인하세요:

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    // ...
}
```

이 인터페이스를 모델에 추가하면, 새로 등록된 사용자에게 이메일 인증 링크가 포함된 이메일이 자동으로 전송됩니다. 이는 Laravel이 `Illuminate\Auth\Events\Registered` 이벤트에 대해 `Illuminate\Auth\Listeners\SendEmailVerificationNotification` [리스너](/laravel/12.x/events)를 자동으로 등록하기 때문에 원활하게 처리됩니다.

[스타터 키트](/laravel/12.x/starter-kits)를 사용하지 않고 애플리케이션 내에서 직접 회원가입을 구현하는 경우, 사용자의 회원가입이 성공한 후에 `Illuminate\Auth\Events\Registered` 이벤트를 디스패치하고 있는지 확인해야 합니다:

```php
use Illuminate\Auth\Events\Registered;

event(new Registered($user));
```


### 데이터베이스 준비 {#database-preparation}

다음으로, `users` 테이블에는 사용자의 이메일 주소가 인증된 날짜와 시간을 저장하기 위한 `email_verified_at` 컬럼이 포함되어야 합니다. 일반적으로 이 컬럼은 Laravel의 기본 `0001_01_01_000000_create_users_table.php` 데이터베이스 마이그레이션에 포함되어 있습니다.


## 라우팅 {#verification-routing}

이메일 인증을 올바르게 구현하려면 세 가지 라우트를 정의해야 합니다. 먼저, 사용자가 회원가입 후 Laravel이 보낸 인증 이메일의 링크를 클릭해야 한다는 알림을 표시하는 라우트가 필요합니다.

두 번째로, 사용자가 이메일 내의 인증 링크를 클릭할 때 생성되는 요청을 처리하는 라우트가 필요합니다.

세 번째로, 사용자가 첫 번째 인증 링크를 실수로 잃어버린 경우 인증 링크를 다시 보낼 수 있는 라우트가 필요합니다.


### 이메일 인증 알림 {#the-email-verification-notice}

앞서 언급했듯이, 사용자가 회원가입 후 Laravel에서 이메일로 전송된 이메일 인증 링크를 클릭하도록 안내하는 뷰를 반환하는 라우트를 정의해야 합니다. 이 뷰는 사용자가 이메일 주소를 먼저 인증하지 않고 애플리케이션의 다른 부분에 접근하려고 할 때 표시됩니다. `App\Models\User` 모델이 `MustVerifyEmail` 인터페이스를 구현하고 있다면, 이 링크는 자동으로 사용자에게 이메일로 전송됩니다:

```php
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');
```

이메일 인증 알림을 반환하는 라우트는 반드시 `verification.notice`라는 이름을 가져야 합니다. 이 라우트에 정확히 이 이름이 할당되어야 하는 이유는, [Laravel에 포함된](#protecting-routes) `verified` 미들웨어가 사용자가 이메일 주소를 인증하지 않은 경우 자동으로 이 라우트 이름으로 리디렉션하기 때문입니다.

> [!NOTE]
> 이메일 인증을 수동으로 구현할 때는 인증 알림 뷰의 내용을 직접 정의해야 합니다. 모든 필요한 인증 및 인증 관련 뷰가 포함된 스캐폴딩이 필요하다면, [Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 확인해 보세요.


### 이메일 인증 처리기 {#the-email-verification-handler}

다음으로, 사용자가 이메일로 받은 인증 링크를 클릭할 때 발생하는 요청을 처리할 라우트를 정의해야 합니다. 이 라우트는 `verification.verify`라는 이름을 가져야 하며, `auth`와 `signed` 미들웨어가 할당되어야 합니다:

```php
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');
```

다음 단계로 넘어가기 전에, 이 라우트를 좀 더 자세히 살펴보겠습니다. 먼저, 일반적으로 사용하는 `Illuminate\Http\Request` 인스턴스 대신 `EmailVerificationRequest` 요청 타입을 사용하고 있다는 점을 알 수 있습니다. `EmailVerificationRequest`는 Laravel에 포함된 [폼 요청](/laravel/12.x/validation#form-request-validation)입니다. 이 요청은 자동으로 요청의 `id`와 `hash` 파라미터를 검증해줍니다.

다음으로, 요청에서 바로 `fulfill` 메서드를 호출할 수 있습니다. 이 메서드는 인증된 사용자에 대해 `markEmailAsVerified` 메서드를 호출하고, `Illuminate\Auth\Events\Verified` 이벤트를 디스패치합니다. `markEmailAsVerified` 메서드는 기본 `App\Models\User` 모델이 `Illuminate\Foundation\Auth\User` 기본 클래스를 통해 사용할 수 있습니다. 사용자의 이메일 주소가 인증되면, 원하는 곳으로 리다이렉트할 수 있습니다.


### 인증 이메일 재전송 {#resending-the-verification-email}

때때로 사용자가 이메일 주소 인증 메일을 분실하거나 실수로 삭제할 수 있습니다. 이를 위해, 사용자가 인증 이메일을 다시 받을 수 있도록 라우트를 정의할 수 있습니다. 그런 다음, [인증 알림 뷰](#the-email-verification-notice) 내에 간단한 폼 제출 버튼을 배치하여 이 라우트로 요청을 보낼 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
```


### 라우트 보호하기 {#protecting-routes}

[라우트 미들웨어](/laravel/12.x/middleware)는 인증된 사용자만 특정 라우트에 접근할 수 있도록 사용할 수 있습니다. Laravel에는 `verified`라는 [미들웨어 별칭](/laravel/12.x/middleware#middleware-aliases)이 포함되어 있으며, 이는 `Illuminate\Auth\Middleware\EnsureEmailIsVerified` 미들웨어 클래스의 별칭입니다. 이 별칭은 Laravel에서 이미 자동으로 등록되어 있으므로, 라우트 정의에 `verified` 미들웨어만 추가하면 됩니다. 일반적으로 이 미들웨어는 `auth` 미들웨어와 함께 사용됩니다:

```php
Route::get('/profile', function () {
    // 인증된 사용자만 이 라우트에 접근할 수 있습니다...
})->middleware(['auth', 'verified']);
```

인증되지 않은 사용자가 이 미들웨어가 할당된 라우트에 접근하려고 하면, 자동으로 `verification.notice` [네임드 라우트](/laravel/12.x/routing#named-routes)로 리디렉션됩니다.


## 사용자 정의 {#customization}


#### 인증 이메일 커스터마이징 {#verification-email-customization}

기본 이메일 인증 알림은 대부분의 애플리케이션 요구 사항을 충족하지만, Laravel은 이메일 인증 메일 메시지를 구성하는 방법을 커스터마이즈할 수 있도록 지원합니다.

시작하려면, `Illuminate\Auth\Notifications\VerifyEmail` 알림에서 제공하는 `toMailUsing` 메서드에 클로저를 전달하세요. 이 클로저는 알림을 받는 notifiable 모델 인스턴스와 사용자가 이메일 주소를 인증하기 위해 방문해야 하는 서명된 이메일 인증 URL을 전달받습니다. 클로저는 `Illuminate\Notifications\Messages\MailMessage` 인스턴스를 반환해야 합니다. 일반적으로, 이 `toMailUsing` 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    // ...

    VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
        return (new MailMessage)
            ->subject('이메일 주소 인증')
            ->line('아래 버튼을 클릭하여 이메일 주소를 인증하세요.')
            ->action('이메일 주소 인증', $url);
    });
}
```

> [!NOTE]
> 메일 알림에 대해 더 자세히 알아보려면 [메일 알림 문서](/laravel/12.x/notifications#mail-notifications)를 참고하세요.


## 이벤트 {#events}

[Laravel 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 사용할 때, Laravel은 이메일 인증 과정에서 `Illuminate\Auth\Events\Verified` [이벤트](/laravel/12.x/events)를 디스패치합니다. 애플리케이션에서 이메일 인증을 수동으로 처리하는 경우, 인증이 완료된 후 이러한 이벤트를 수동으로 디스패치할 수 있습니다.
