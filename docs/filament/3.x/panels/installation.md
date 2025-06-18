---
title: 설치
---
# [패널] 설치
## 요구 사항 {#requirements}

Filament을 실행하려면 다음이 필요합니다:

- PHP 8.1 이상
- Laravel v10.0 이상
- Livewire v3.0 이상

## 설치 {#installation}

> Filament v2에서 업그레이드하는 경우, [업그레이드 가이드](upgrade-guide)를 참고하세요.

Laravel 프로젝트 디렉터리에서 다음 명령어를 실행하여 Filament 패널 빌더를 설치하세요:

```bash
composer require filament/filament:"^3.3" -W

php artisan filament:install --panels
```

이 명령어는 `app/Providers/Filament/AdminPanelProvider.php`라는 새로운 [Laravel 서비스 프로바이더](https://laravel.com/docs/providers)를 생성하고 등록합니다.

> 패널에 접근할 때 오류가 발생한다면, 서비스 프로바이더가 `bootstrap/providers.php`(Laravel 11 이상) 또는 `config/app.php`(Laravel 10 이하)에 등록되어 있는지 확인하세요. 등록되어 있지 않다면 수동으로 추가해야 합니다.

## 사용자 생성 {#create-a-user}

다음 명령어로 새 사용자 계정을 생성할 수 있습니다:

```bash
php artisan make:filament-user
```

웹 브라우저에서 `/admin`을 열고, 로그인한 후 앱을 만들어보세요!

어디서 시작해야 할지 모르겠나요? [시작 가이드](getting-started)를 참고하여 Filament 관리자 패널을 완성하는 방법을 배워보세요.

## 다른 Filament 패키지 사용하기 {#using-other-filament-packages}

Filament 패널 빌더는 [폼 빌더](/filament/3.x/forms), [테이블 빌더](/filament/3.x/tables), [알림](/filament/3.x/notifications), [액션](/filament/3.x/actions), [인포리스트](/filament/3.x/infolists), [위젯](/filament/3.x/widgets) 패키지를 미리 설치합니다. 패널 내에서 이 패키지들을 사용하기 위해 추가적인 설치 과정은 필요하지 않습니다.

## Filament 패널 성능 향상하기 {#improving-filament-panel-performance}

### 프로덕션 환경에서 Filament 최적화하기 {#optimizing-filament-for-production}

프로덕션 환경에서 Filament를 최적화하려면, 배포 스크립트에서 다음 명령어를 실행해야 합니다:

```bash
php artisan filament:optimize
```

이 명령어는 [Filament 컴포넌트 캐시](#caching-filament-components)와 추가적으로 [Blade 아이콘 캐시](#caching-blade-icons)를 생성하여 Filament 패널의 성능을 크게 향상시킬 수 있습니다. 이 명령어는 `php artisan filament:cache-components`와 `php artisan icons:cache` 명령어의 축약형입니다.

캐시를 한 번에 모두 삭제하려면 다음 명령어를 실행할 수 있습니다:

```bash
php artisan filament:optimize-clear
```

#### Filament 컴포넌트 캐싱 {#caching-filament-components}

[`filament:optimize` 명령어](#optimizing-filament-for-production)를 사용하지 않는 경우, 배포 스크립트에서 `php artisan filament:cache-components`를 실행하는 것을 고려해볼 수 있습니다. 특히 컴포넌트(리소스, 페이지, 위젯, 관계 매니저, 커스텀 Livewire 컴포넌트 등)가 많은 경우에 유용합니다. 이 명령어는 애플리케이션의 `bootstrap/cache/filament` 디렉터리에 각 컴포넌트 유형별 인덱스를 포함하는 캐시 파일을 생성합니다. 이로 인해 일부 앱에서는 컴포넌트 파일을 스캔하고 자동으로 발견하는 횟수가 줄어들어 Filament의 성능이 크게 향상될 수 있습니다.

하지만 로컬에서 앱을 적극적으로 개발 중이라면 이 명령어 사용을 피해야 합니다. 캐시가 삭제되거나 다시 빌드될 때까지 새로운 컴포넌트가 발견되지 않기 때문입니다.

언제든지 `php artisan filament:clear-cached-components` 명령어를 실행하여 캐시를 재생성하지 않고도 캐시를 삭제할 수 있습니다.

#### Blade 아이콘 캐싱 {#caching-blade-icons}

[`filament:optimize` 명령어](#optimizing-filament-for-production)를 사용하지 않는 경우, 로컬과 배포 스크립트에서 `php artisan icons:cache`를 실행하는 것을 고려해볼 수 있습니다. 이는 Filament가 [Blade Icons](https://blade-ui-kit.com/blade-icons) 패키지를 사용하기 때문이며, 캐싱할 경우 성능이 훨씬 더 좋아질 수 있습니다.

### 서버에서 OPcache 활성화하기 {#enabling-opcache-on-your-server}

[Laravel Forge 문서](https://forge.laravel.com/docs/servers/php.html#opcache)에서 발췌:

> 프로덕션 환경에서 PHP OPcache를 최적화하면 OPcache가 컴파일된 PHP 코드를 메모리에 저장하여 성능을 크게 향상시킵니다.

사용 중인 환경에 맞는 OPcache 설정 방법은 검색 엔진을 통해 찾아보시기 바랍니다.

### Laravel 앱 최적화하기 {#optimizing-your-laravel-app}

배포 스크립트에서 `php artisan optimize` 명령어를 실행하여 Laravel 앱을 프로덕션 환경에 맞게 최적화하는 것도 고려해야 합니다. 이 명령어는 설정 파일과 라우트를 캐시합니다.

## 프로덕션 배포 {#deploying-to-production}

### 사용자가 패널에 접근할 수 있도록 허용하기 {#allowing-users-to-access-a-panel}

기본적으로 모든 `User` 모델은 로컬 환경에서 Filament에 접근할 수 있습니다. 그러나 프로덕션에 배포하거나 단위 테스트를 실행할 때는 `App\Models\User.php`를 수정하여 `FilamentUser` 계약을 구현해야 합니다. 이렇게 하면 올바른 사용자만 패널에 접근할 수 있습니다:

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

> 이 단계를 완료하지 않으면 프로덕션 환경에서 앱에 접근할 때 403 Forbidden 오류가 반환됩니다.

[사용자](users)에 대해 더 알아보기.

### 프로덕션 준비가 완료된 스토리지 디스크 사용하기 {#using-a-production-ready-storage-disk}

Filament에는 [설정](#publishing-configuration)에서 정의된 스토리지 디스크가 있으며, 기본값은 `public`으로 설정되어 있습니다. 이 값을 변경하려면 `FILAMENT_FILESYSTEM_DISK` 환경 변수를 설정할 수 있습니다.

`public` 디스크는 로컬 개발에는 편리하지만, 프로덕션 환경에는 적합하지 않습니다. 이 디스크는 파일 가시성을 지원하지 않기 때문에, Filament의 [파일 업로드](../forms/fields/file-upload)와 같은 기능을 사용할 경우 파일이 모두 공개로 생성됩니다. 프로덕션 환경에서는 업로드된 파일에 대한 무단 접근을 방지하기 위해, `s3`와 같이 비공개 접근 정책을 가진 프로덕션 준비가 완료된 디스크를 사용해야 합니다.

## 구성 파일 퍼블리싱 {#publishing-configuration}

필요하다면 다음 명령어를 사용하여 Filament 패키지의 구성 파일을 퍼블리싱할 수 있습니다:

```bash
php artisan vendor:publish --tag=filament-config
```

## 번역 파일 퍼블리싱 {#publishing-translations}

필요하다면 다음 명령어를 사용하여 번역을 위한 언어 파일을 퍼블리싱할 수 있습니다:

```bash
php artisan vendor:publish --tag=filament-panels-translations
```

이 패키지는 다른 Filament 패키지에 의존하므로, 아래 명령어들을 사용하여 해당 패키지들의 언어 파일도 퍼블리싱할 수 있습니다:

```bash
php artisan vendor:publish --tag=filament-actions-translations

php artisan vendor:publish --tag=filament-forms-translations

php artisan vendor:publish --tag=filament-infolists-translations

php artisan vendor:publish --tag=filament-notifications-translations

php artisan vendor:publish --tag=filament-tables-translations

php artisan vendor:publish --tag=filament-translations
```

## 업그레이드 {#upgrading}

> Filament v2에서 업그레이드하시나요? [업그레이드 가이드](upgrade-guide)를 확인해 주세요.

Filament는 `composer update`를 실행할 때 자동으로 최신의 비파괴(non-breaking) 버전으로 업그레이드됩니다. 업데이트 후에는 모든 Laravel 캐시를 비워야 하며, 프론트엔드 에셋도 다시 배포해야 합니다. 이 모든 작업은 `filament:upgrade` 명령어로 한 번에 처리할 수 있으며, 이 명령어는 처음 `filament:install`을 실행할 때 `composer.json` 파일에 추가되어야 합니다:

```json
"post-autoload-dump": [
    // ...
    "@php artisan filament:upgrade"
],
```

`filament:upgrade`는 실제로 업데이트 과정을 처리하지 않는다는 점에 유의하세요. Composer가 이미 그 역할을 합니다. 만약 `post-autoload-dump` 훅 없이 수동으로 업그레이드한다면, 아래 명령어를 직접 실행할 수 있습니다:

```bash
composer update

php artisan filament:upgrade
```
