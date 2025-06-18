---
title: 사용자
---
# [패널] 사용자
## 개요 {#overview}

기본적으로 모든 `App\Models\User`는 로컬 환경에서 Filament에 접근할 수 있습니다. 프로덕션 환경에서 Filament에 접근할 수 있도록 하려면, 올바른 사용자만 앱에 접근할 수 있도록 몇 가지 추가 단계를 거쳐야 합니다.

## 패널에 대한 접근 권한 부여 {#authorizing-access-to-the-panel}

로컬 환경이 아닌 곳에서 `App\Models\User`가 Filament에 접근할 수 있도록 하려면, `FilamentUser` 계약을 구현해야 합니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser
{
    // ...

    public function canAccessPanel(Panel $panel): bool
    {
        return str_ends_with($this->email, '@yourdomain.com') && $this->hasVerifiedEmail();
    }
}
```

`canAccessPanel()` 메서드는 사용자가 `$panel`에 접근할 수 있는지 여부에 따라 `true` 또는 `false`를 반환합니다. 이 예시에서는 사용자의 이메일이 `@yourdomain.com`으로 끝나는지와 이메일 인증이 완료되었는지를 확인합니다.

현재 `$panel`에 접근할 수 있으므로, 별도의 패널마다 조건부 검사를 작성할 수 있습니다. 예를 들어, 관리자 패널에만 접근을 제한하고, 앱의 다른 패널은 모든 사용자가 접근할 수 있도록 할 수 있습니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser
{
    // ...

    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'admin') {
            return str_ends_with($this->email, '@yourdomain.com') && $this->hasVerifiedEmail();
        }

        return true;
    }
}
```

## 리소스에 대한 접근 권한 부여 {#authorizing-access-to-resources}

리소스 페이지와 해당 데이터 레코드에 대한 접근을 제어하려면 리소스 문서의 [권한 부여](resources/getting-started#authorization) 섹션을 참고하세요.

## 사용자 아바타 설정하기 {#setting-up-user-avatars}

기본적으로 Filament는 [ui-avatars.com](https://ui-avatars.com)을 사용하여 사용자의 이름을 기반으로 아바타를 생성합니다. 하지만, 사용자 모델에 `avatar_url` 속성이 있다면 해당 값이 대신 사용됩니다. Filament가 사용자의 아바타 URL을 가져오는 방식을 커스터마이즈하려면 `HasAvatar` 계약을 구현할 수 있습니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasAvatar
{
    // ...

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }
}
```

`getFilamentAvatarUrl()` 메서드는 현재 사용자의 아바타를 가져오는 데 사용됩니다. 이 메서드에서 `null`이 반환되면, Filament는 [ui-avatars.com](https://ui-avatars.com)을 기본값으로 사용합니다.

### 다른 아바타 제공자 사용하기 {#using-a-different-avatar-provider}

[ui-avatars.com](https://ui-avatars.com)을 다른 서비스로 쉽게 교체할 수 있으며, 새로운 아바타 제공자를 생성하면 됩니다.

이 예제에서는 [boringavatars.com](https://boringavatars.com)을 위해 `app/Filament/AvatarProviders/BoringAvatarsProvider.php` 파일을 새로 만듭니다. `get()` 메서드는 사용자 모델 인스턴스를 받아 해당 사용자의 아바타 URL을 반환합니다:

```php
<?php

namespace App\Filament\AvatarProviders;

use Filament\AvatarProviders\Contracts;
use Filament\Facades\Filament;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class BoringAvatarsProvider implements Contracts\AvatarProvider
{
    public function get(Model | Authenticatable $record): string
    {
        $name = str(Filament::getNameForDefaultAvatar($record))
            ->trim()
            ->explode(' ')
            ->map(fn (string $segment): string => filled($segment) ? mb_substr($segment, 0, 1) : '')
            ->join(' ');

        return 'https://source.boringavatars.com/beam/120/' . urlencode($name);
    }
}
```

이제 [설정](configuration)에서 이 새로운 아바타 제공자를 등록합니다:

```php
use App\Filament\AvatarProviders\BoringAvatarsProvider;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->defaultAvatarProvider(BoringAvatarsProvider::class);
}
```

## 사용자의 이름 속성 설정하기 {#configuring-the-users-name-attribute}

기본적으로 Filament는 앱에서 사용자의 이름을 표시할 때 `name` 속성을 사용합니다. 이를 변경하려면 `HasName` 계약을 구현하면 됩니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser, HasName
{
    // ...

    public function getFilamentName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
```

`getFilamentName()` 메서드는 현재 사용자의 이름을 가져오는 데 사용됩니다.

## 인증 기능 {#authentication-features}

구성 파일에서 패널에 대한 인증 기능을 쉽게 활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->login()
        ->registration()
        ->passwordReset()
        ->emailVerification()
        ->profile();
}
```

### 인증 기능 커스터마이징 {#customizing-the-authentication-features}

이 페이지들을 직접 교체하고 싶다면, 해당 메서드에 Filament 페이지 클래스를 전달하면 됩니다.

대부분의 경우, Filament 코드베이스의 기본 페이지 클래스를 확장하고, `form()`과 같은 메서드를 오버라이드한 뒤, 새로운 페이지 클래스를 설정에 전달하여 원하는 커스터마이징을 할 수 있습니다:

```php
use App\Filament\Pages\Auth\EditProfile;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->profile(EditProfile::class);
}
```

이 예시에서는 프로필 페이지를 커스터마이징합니다. `app/Filament/Pages/Auth/EditProfile.php`에 새로운 PHP 클래스를 생성해야 합니다:

```php
<?php

namespace App\Filament\Pages\Auth;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Auth\EditProfile as BaseEditProfile;

class EditProfile extends BaseEditProfile
{
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('username')
                    ->required()
                    ->maxLength(255),
                $this->getNameFormComponent(),
                $this->getEmailFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getPasswordConfirmationFormComponent(),
            ]);
    }
}
```

이 클래스는 Filament 코드베이스의 기본 프로필 페이지 클래스를 확장합니다. 확장할 수 있는 다른 페이지 클래스는 다음과 같습니다:

- `Filament\Pages\Auth\Login`
- `Filament\Pages\Auth\Register`
- `Filament\Pages\Auth\EmailVerification\EmailVerificationPrompt`
- `Filament\Pages\Auth\PasswordReset\RequestPasswordReset`
- `Filament\Pages\Auth\PasswordReset\ResetPassword`

예시의 `form()` 메서드에서는 `getNameFormComponent()`와 같은 메서드를 호출하여 페이지의 기본 폼 컴포넌트를 가져옵니다. 필요에 따라 이 컴포넌트들을 커스터마이징할 수 있습니다. 사용 가능한 모든 커스터마이징 옵션은 Filament 코드베이스의 기본 `EditProfile` 페이지 클래스에서 확인할 수 있으며, 변경을 위해 오버라이드할 수 있는 모든 메서드가 포함되어 있습니다.

#### 인증 필드를 폼을 재정의하지 않고 커스터마이징하기 {#customizing-an-authentication-field-without-needing-to-re-define-the-form}

인증 폼의 필드를 새 `form()` 메서드를 정의하지 않고 커스터마이즈하고 싶다면, 해당 필드 메서드를 확장한 후 커스텀 체이닝을 할 수 있습니다:

```php
use Filament\Forms\Components\Component;

protected function getPasswordFormComponent(): Component
{
    return parent::getPasswordFormComponent()
        ->revealable(false);
}
```

### 프로필 페이지에서 사이드바 사용하기 {#using-a-sidebar-on-the-profile-page}

기본적으로 프로필 페이지는 사이드바가 있는 표준 페이지 레이아웃을 사용하지 않습니다. 이는 [테넌시](tenancy) 기능과 함께 동작하도록 하기 위함인데, 그렇지 않으면 사용자가 테넌트가 없을 때 접근할 수 없게 되기 때문입니다. 사이드바의 링크들은 현재 테넌트로 라우팅되기 때문입니다.

패널에서 [테넌시](tenancy)를 사용하지 않고, 프로필 페이지가 사이드바가 있는 표준 페이지 레이아웃을 사용하도록 하고 싶다면, 페이지를 등록할 때 `$panel->profile()`에 `isSimple: false` 파라미터를 전달하면 됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->profile(isSimple: false);
}
```

### 인증 라우트 슬러그 커스터마이징 {#customizing-the-authentication-route-slugs}

[설정](configuration)에서 인증 라우트에 사용되는 URL 슬러그를 커스터마이징할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->loginRouteSlug('login')
        ->registrationRouteSlug('register')
        ->passwordResetRoutePrefix('password-reset')
        ->passwordResetRequestRouteSlug('request')
        ->passwordResetRouteSlug('reset')
        ->emailVerificationRoutePrefix('email-verification')
        ->emailVerificationPromptRouteSlug('prompt')
        ->emailVerificationRouteSlug('verify');
}
```

### 인증 가드 설정하기 {#setting-the-authentication-guard}

Filament에서 사용할 인증 가드를 설정하려면, `authGuard()` [설정](configuration) 메서드에 가드 이름을 전달하면 됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authGuard('web');
}
```

### 비밀번호 브로커 설정하기 {#setting-the-password-broker}

Filament에서 사용할 비밀번호 브로커를 설정하려면, `authPasswordBroker()` [구성](configuration) 메서드에 브로커 이름을 전달하면 됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authPasswordBroker('users');
}
```

### 비밀번호 입력란의 표시 기능 비활성화 {#disabling-revealable-password-inputs}

기본적으로 인증 폼의 모든 비밀번호 입력란은 [`revealable()`](../forms/fields/text-input#revealable-password-inputs) 기능이 활성화되어 있습니다. 이 기능을 통해 사용자는 버튼을 클릭하여 입력 중인 비밀번호를 일반 텍스트로 볼 수 있습니다. 이 기능을 비활성화하려면 `revealablePasswords()` [설정](configuration) 메서드에 `false`를 전달하면 됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->revealablePasswords(false);
}
```

또한, [기본 페이지 클래스를 확장](#customizing-an-authentication-field-without-needing-to-re-define-the-form)할 때 필드 객체에서 `->revealable(false)`를 호출하여 개별 필드 단위로도 이 기능을 비활성화할 수 있습니다.

## 패널에 게스트 접근 설정하기 {#setting-up-guest-access-to-a-panel}

기본적으로 Filament는 인증된 사용자만 사용할 수 있도록 설계되어 있습니다. 게스트가 패널에 접근할 수 있도록 하려면, 로그인된 사용자를 필요로 하는 컴포넌트(예: 프로필, 아바타 등)를 사용하지 않아야 하며, 내장된 인증 미들웨어를 제거해야 합니다:

- 패널 설정의 `authMiddleware()` 배열에서 기본값인 `Authenticate::class`를 제거하세요.
- 패널에서 `->login()` 및 기타 [인증 기능](#authentication-features)을 제거하세요.
- 현재 사용자의 데이터를 읽기 때문에, 기본값인 `AccountWidget`을 `widgets()` 배열에서 제거하세요.

### 정책에서 게스트 권한 부여하기 {#authorizing-guests-in-policies}

필라멘트는 [라라벨 모델 정책](https://laravel.com/docs/authorization#generating-policies)이 존재할 경우 이를 접근 제어에 사용합니다. [게스트 사용자를 위한 모델 정책에서 읽기 권한을 부여하려면](https://laravel.com/docs/authorization#guest-users), 정책을 생성한 후 `viewAny()`와 `view()` 메서드의 `User $user` 파라미터를 `?User $user`로 변경하여 선택적으로 만들고, `return true;`를 반환하도록 수정하세요. 또는, 해당 메서드들을 정책에서 완전히 제거할 수도 있습니다.
