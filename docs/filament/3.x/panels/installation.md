---
title: 설치
---
# [패널] 설치
## 요구 사항 {#requirements}

Filament를 실행하려면 다음이 필요합니다:

- PHP 8.1+
- Laravel v10.0+
- Livewire v3.0+

## 설치 {#installation}

> Filament v2에서 업그레이드하는 경우, [업그레이드 가이드](https://filamentphp.com/docs/3.x/panels/upgrade-guide)를 확인하세요.

다음 명령어를 Laravel 프로젝트 디렉터리에서 실행하여 Filament 패널 빌더를 설치하세요:

```bash
composer require filament/filament:"^3.3" -W

php artisan filament:install --panels
```

이 명령은 `app/Providers/Filament/AdminPanelProvider.php`라는 새로운 [Laravel 서비스 프로바이더](/laravel/12.x/providers)를 생성하고 등록합니다.

> 패널에 접근할 때 오류가 발생한다면, 서비스 프로바이더가 `bootstrap/providers.php`(Laravel 11 이상) 또는 `config/app.php`(Laravel 10 이하)에 등록되어 있는지 확인하세요. 등록되어 있지 않다면 수동으로 추가해야 합니다.

## 사용자 생성 {#create-a-user}

다음 명령어로 새 사용자 계정을 생성할 수 있습니다:

```bash
php artisan make:filament-user
```

웹 브라우저에서 `/admin`을 열고, 로그인한 후 앱 빌드를 시작하세요!

어디서부터 시작해야 할지 모르겠다면, [시작 가이드](getting-started)를 참고하여 Filament 관리 패널을 완성하는 방법을 배워보세요.

## 다른 Filament 패키지 사용하기 {#using-other-filament-packages}

Filament 패널 빌더는 [Form Builder](/filament/3.x/forms/getting-started), [Table Builder](/filament/3.x/tables/getting-started), [Notifications](/filament/3.x/notifications/installation), [Actions](/filament/3.x/actions/overview), [Infolists](/filament/3.x/infolists/getting-started), [Widgets](/filament/3.x/widgets/installation) 패키지를 미리 설치합니다. 이 패키지들을 패널 내에서 사용하기 위해 추가 설치 과정이 필요하지 않습니다.

## Filament 패널 성능 향상 {#improving-filament-panel-performance}

### 프로덕션 환경에서 Filament 최적화 {#optimizing-filament-for-production}

프로덕션 환경에서 Filament를 최적화하려면, 배포 스크립트에서 다음 명령어를 실행해야 합니다:

```bash
php artisan filament:optimize
```

이 명령은 [Filament 컴포넌트 캐시](#caching-filament-components)와 추가로 [Blade 아이콘 캐시](#caching-blade-icons)를 생성하여, Filament 패널의 성능을 크게 향상시킬 수 있습니다. 이 명령은 `php artisan filament:cache-components`와 `php artisan icons:cache` 명령을 축약한 것입니다.

캐시를 한 번에 모두 지우려면 다음을 실행할 수 있습니다:

```bash
php artisan filament:optimize-clear
```

#### Filament 컴포넌트 캐싱 {#caching-filament-components}

[`filament:optimize` 명령](#optimizing-filament-for-production)을 사용하지 않는 경우, 배포 스크립트에서 `php artisan filament:cache-components`를 실행하는 것을 고려할 수 있습니다. 특히 컴포넌트(리소스, 페이지, 위젯, 관계 매니저, 커스텀 Livewire 컴포넌트 등)가 많은 경우에 유용합니다. 이 명령은 애플리케이션의 `bootstrap/cache/filament` 디렉터리에 각 컴포넌트 유형별 인덱스를 포함하는 캐시 파일을 생성합니다. 이는 컴포넌트 자동 검색 및 파일 스캔 수를 줄여 일부 앱에서 Filament의 성능을 크게 향상시킬 수 있습니다.

하지만 로컬에서 앱을 적극적으로 개발 중이라면, 이 명령을 사용하지 않는 것이 좋습니다. 캐시가 지워지거나 재생성되기 전까지는 새 컴포넌트가 인식되지 않기 때문입니다.

언제든지 캐시를 재생성하지 않고 지우려면 `php artisan filament:clear-cached-components`를 실행할 수 있습니다.

#### Blade 아이콘 캐싱 {#caching-blade-icons}

[`filament:optimize` 명령](#optimizing-filament-for-production)을 사용하지 않는 경우, 로컬 및 배포 스크립트에서 `php artisan icons:cache`를 실행하는 것을 고려할 수 있습니다. Filament는 [Blade Icons](https://blade-ui-kit.com/blade-icons) 패키지를 사용하며, 캐시 시 성능이 훨씬 향상될 수 있기 때문입니다.

### 서버에서 OPcache 활성화 {#enabling-opcache-on-your-server}

[Laravel Forge 문서](https://forge.laravel.com/docs/servers/php.html#opcache)에서:

> 프로덕션 환경에서 PHP OPcache를 최적화하면, OPcache가 컴파일된 PHP 코드를 메모리에 저장하여 성능을 크게 향상시킵니다.

환경에 맞는 OPcache 설정 방법은 검색 엔진을 통해 찾아보시기 바랍니다.

### Laravel 앱 최적화 {#optimizing-your-laravel-app}

배포 스크립트에서 `php artisan optimize`를 실행하여 Laravel 앱을 프로덕션 환경에 맞게 최적화하는 것도 고려해야 합니다. 이 명령은 설정 파일과 라우트를 캐시합니다.

## 프로덕션 배포 {#deploying-to-production}

### 사용자가 패널에 접근할 수 있도록 허용하기 {#allowing-users-to-access-a-panel}

기본적으로 모든 `User` 모델은 로컬에서 Filament에 접근할 수 있습니다. 하지만 프로덕션 환경에 배포하거나 단위 테스트를 실행할 때는, `App\Models\User.php`를 수정하여 `FilamentUser` 계약을 구현해야 합니다. 이를 통해 올바른 사용자만 패널에 접근할 수 있도록 보장합니다:

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

> 이 단계를 완료하지 않으면, 프로덕션 환경에서 앱에 접근할 때 403 Forbidden 오류가 반환됩니다.

[사용자](users)에 대해 더 알아보세요.

### 프로덕션 환경에 적합한 스토리지 디스크 사용하기 {#using-a-production-ready-storage-disk}

Filament는 [설정](#publishing-configuration)에서 정의된 스토리지 디스크를 사용하며, 기본값은 `public`입니다. 이 값을 변경하려면 `FILAMENT_FILESYSTEM_DISK` 환경 변수를 설정할 수 있습니다.

`public` 디스크는 로컬 개발에는 적합하지만, 프로덕션 환경에는 적합하지 않습니다. 파일 가시성을 지원하지 않으므로, Filament의 [파일 업로드](../forms/fields/file-upload)와 같은 기능이 공개 파일을 생성하게 됩니다. 프로덕션 환경에서는 `s3`와 같이 비공개 접근 정책을 가진 프로덕션용 디스크를 사용하여 업로드된 파일에 대한 무단 접근을 방지해야 합니다.

## 설정 파일 퍼블리싱 {#publishing-configuration}

필요하다면 다음 명령어로 Filament 패키지의 설정 파일을 퍼블리시할 수 있습니다:

```bash
php artisan vendor:publish --tag=filament-config
```

## 번역 파일 퍼블리싱 {#publishing-translations}

필요하다면 다음 명령어로 번역을 위한 언어 파일을 퍼블리시할 수 있습니다:

```bash
php artisan vendor:publish --tag=filament-panels-translations
```

이 패키지는 다른 Filament 패키지에 의존하므로, 다음 명령어로 해당 패키지의 언어 파일도 퍼블리시할 수 있습니다:

```bash
php artisan vendor:publish --tag=filament-actions-translations

php artisan vendor:publish --tag=filament-forms-translations

php artisan vendor:publish --tag=filament-infolists-translations

php artisan vendor:publish --tag=filament-notifications-translations

php artisan vendor:publish --tag=filament-tables-translations

php artisan vendor:publish --tag=filament-translations
```

## 업그레이드 {#upgrading}

> Filament v2에서 업그레이드 중이신가요? [업그레이드 가이드](https://filamentphp.com/docs/3.x/panels/upgrade-guide)를 확인하세요.

`composer update`를 실행하면 Filament는 자동으로 최신의 비파괴(non-breaking) 버전으로 업그레이드됩니다. 업데이트 후에는 모든 Laravel 캐시를 지우고, 프론트엔드 에셋을 다시 퍼블리시해야 합니다. 이 모든 작업은 `filament:upgrade` 명령으로 한 번에 처리할 수 있으며, 이 명령은 처음 `filament:install`을 실행할 때 `composer.json` 파일에 추가되어야 합니다:

```json
"post-autoload-dump": [
    // ...
    "@php artisan filament:upgrade"
],
```

`filament:upgrade`는 실제로 업데이트 과정을 처리하지 않으며, Composer가 이미 처리합니다. `post-autoload-dump` 후크 없이 수동으로 업그레이드하는 경우, 직접 명령을 실행할 수 있습니다:

```bash
composer update

php artisan filament:upgrade
```
