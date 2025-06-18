---
title: 설정
---
# [패널] 설정
## 개요 {#overview}

기본적으로 설정 파일은 `app/Providers/Filament/AdminPanelProvider.php`에 위치합니다. [패널](#introducing-panels)에 대해 더 알아보고, 각 패널이 [자신만의 설정 파일](#creating-a-new-panel)을 어떻게 가지는지 계속 읽어보세요.

## 패널 소개 {#introducing-panels}

기본적으로 패키지를 설치하면 하나의 패널이 자동으로 설정되며, 이 패널은 `/admin` 경로에 위치합니다. 여러분이 생성하는 모든 [리소스](resources/getting-started), [커스텀 페이지](pages), 그리고 [대시보드 위젯](dashboard)들은 이 패널에 등록됩니다.

하지만 원하는 만큼 여러 개의 패널을 생성할 수 있으며, 각 패널마다 고유한 리소스, 페이지, 위젯 세트를 가질 수 있습니다.

예를 들어, 사용자가 `/app`에서 로그인하여 자신의 대시보드에 접근할 수 있는 패널과, 관리자가 `/admin`에서 로그인하여 앱을 관리할 수 있는 패널을 만들 수 있습니다. `/app` 패널과 `/admin` 패널은 각각의 리소스를 가지며, 각 사용자 그룹마다 요구 사항이 다르기 때문입니다. Filament는 여러 개의 패널을 생성할 수 있는 기능을 제공하여 이를 가능하게 합니다.

### 기본 관리자 패널 {#the-default-admin-panel}

`filament:install` 명령어를 실행하면 `app/Providers/Filament` 디렉터리에 `AdminPanelProvider.php`라는 새 파일이 생성됩니다. 이 파일에는 `/admin` 패널에 대한 설정이 포함되어 있습니다.

이 문서에서 "설정"을 언급할 때는 이 파일을 수정해야 함을 의미합니다. 이 파일을 통해 앱을 완전히 커스터마이즈할 수 있습니다.

### 새 패널 생성하기 {#creating-a-new-panel}

새 패널을 생성하려면 `make:filament-panel` 명령어를 사용하고, 새 패널의 고유한 이름을 전달하면 됩니다:

```bash
php artisan make:filament-panel app
```

이 명령어는 "app"이라는 새 패널을 생성합니다. 설정 파일은 `app/Providers/Filament/AppPanelProvider.php`에 생성됩니다. 이 패널은 `/app`에서 접근할 수 있지만, 원하지 않는 경우 [경로를 커스터마이즈](#changing-the-path)할 수 있습니다.

이 설정 파일은 [Laravel 서비스 프로바이더](https://laravel.com/docs/providers)이기도 하므로, `bootstrap/providers.php`(Laravel 11 이상) 또는 `config/app.php`(Laravel 10 이하)에 등록되어야 합니다. Filament가 이를 자동으로 시도하지만, 패널에 접근할 때 오류가 발생한다면 이 과정이 실패했을 가능성이 높습니다.

## 경로 변경하기 {#changing-the-path}

패널 설정 파일에서 `path()` 메서드를 사용하여 앱에 접근할 수 있는 경로를 변경할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->path('app');
}
```

앱에 접두사 없이 접근하고 싶다면, 빈 문자열로 설정할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->path('');
}
```

`routes/web.php` 파일에 이미 `''` 또는 `'/'` 경로가 정의되어 있지 않은지 반드시 확인하세요. 이미 정의되어 있다면 해당 경로가 우선 적용됩니다.

## 렌더 훅 {#render-hooks}

[렌더 훅](../support/render-hooks)은 프레임워크 뷰의 다양한 지점에서 Blade 콘텐츠를 렌더링할 수 있도록 해줍니다. 서비스 프로바이더나 미들웨어에서 [글로벌 렌더 훅을 등록](../support/render-hooks#registering-render-hooks)할 수 있지만, 패널에만 적용되는 렌더 훅을 등록할 수도 있습니다. 이를 위해 패널 설정 객체에서 `renderHook()` 메서드를 사용할 수 있습니다. 다음은 [`wire-elements/modal`](https://github.com/wire-elements/modal)을 Filament와 통합하는 예시입니다:

```php
use Filament\Panel;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->renderHook(
            PanelsRenderHook::BODY_START,
            fn (): string => Blade::render('@livewire(\'livewire-ui-modal\')'),
        );
}
```

사용 가능한 렌더 훅의 전체 목록은 [여기](../support/render-hooks#available-render-hooks)에서 확인할 수 있습니다.

## 도메인 설정 {#setting-a-domain}

기본적으로 Filament는 모든 도메인에서 오는 요청에 응답합니다. 특정 도메인으로 범위를 제한하고 싶다면, [`Laravel의 Route::domain()`](https://laravel.com/docs/routing#route-group-subdomain-routing)과 유사하게 `domain()` 메서드를 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->domain('admin.example.com');
}
```

## 최대 콘텐츠 너비 사용자 지정 {#customizing-the-maximum-content-width}

기본적으로 Filament는 페이지의 콘텐츠 너비를 제한하여, 큰 화면에서 너무 넓어지지 않도록 합니다. 이를 변경하려면 `maxContentWidth()` 메서드를 사용할 수 있습니다. 옵션은 [Tailwind의 max-width 스케일](https://tailwindcss.com/docs/max-width)과 일치합니다. 사용 가능한 옵션은 `ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`, `TwoExtraLarge`, `ThreeExtraLarge`, `FourExtraLarge`, `FiveExtraLarge`, `SixExtraLarge`, `SevenExtraLarge`, `Full`, `MinContent`, `MaxContent`, `FitContent`,  `Prose`, `ScreenSmall`, `ScreenMedium`, `ScreenLarge`, `ScreenExtraLarge`, `ScreenTwoExtraLarge`입니다. 기본값은 `SevenExtraLarge`입니다:

```php
use Filament\Panel;
use Filament\Support\Enums\MaxWidth;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->maxContentWidth(MaxWidth::Full);
}
```

로그인 및 회원가입 페이지와 같이 `SimplePage` 유형의 페이지에 대해 최대 콘텐츠 너비를 설정하고 싶다면, `simplePageMaxContentWidth()` 메서드를 사용할 수 있습니다. 기본값은 `Large`입니다:

```php
use Filament\Panel;
use Filament\Support\Enums\MaxWidth;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->simplePageMaxContentWidth(MaxWidth::Small);
}
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅은 패널의 라이프사이클 동안 코드를 실행하는 데 사용할 수 있습니다. `bootUsing()`은 해당 패널 내에서 발생하는 모든 요청마다 실행되는 훅입니다. 여러 개의 패널이 있을 경우, 현재 패널의 `bootUsing()`만 실행됩니다. 이 함수는 모든 서비스 프로바이더가 부팅된 후, 미들웨어에서 실행됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->bootUsing(function (Panel $panel) {
            // ...
        });
}
```

## SPA 모드 {#spa-mode}

SPA 모드는 [Livewire의 `wire:navigate` 기능](https://livewire.laravel.com/docs/navigate)을 활용하여, 서버에서 렌더링된 패널이 싱글 페이지 애플리케이션처럼 느껴지도록 해줍니다. 이로 인해 페이지 로드 간의 지연이 줄어들고, 긴 요청에는 로딩 바가 표시됩니다. 패널에서 SPA 모드를 활성화하려면 `spa()` 메서드를 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa();
}
```

### 특정 URL에 대해 SPA 내비게이션 비활성화하기 {#disabling-spa-navigation-for-specific-urls}

기본적으로 SPA 모드를 활성화하면, 현재 요청과 동일한 도메인에 있는 모든 URL은 Livewire의 [`wire:navigate`](https://livewire.laravel.com/docs/navigate) 기능을 사용하여 내비게이션됩니다. 특정 URL에 대해 이 기능을 비활성화하고 싶다면, `spaUrlExceptions()` 메서드를 사용할 수 있습니다:

```php
use App\Filament\Resources\PostResource;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa()
        ->spaUrlExceptions(fn (): array => [
            url('/admin'),
            PostResource::getUrl(),
        ]);
}
```

> 이 예시에서는 리소스의 인덱스 페이지 URL을 얻기 위해 [`getUrl()`](https://filamentphp.com/resources/getting-started#generating-urls-to-resource-pages) 메서드를 사용하고 있습니다. 이 기능은 패널이 이미 등록되어 있어야 사용할 수 있지만, 이 설정은 요청 라이프사이클에서 너무 이른 시점에 실행됩니다. 대신 함수를 사용하여 URL을 반환하도록 하면, 패널이 등록된 후에 해당 함수가 실행되어 올바르게 동작합니다.

이 URL들은 사용자가 이동하려는 URL과 도메인 및 프로토콜까지 정확히 일치해야 합니다. 여러 URL을 패턴으로 매칭하고 싶다면, 별표(`*`)를 와일드카드 문자로 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa()
        ->spaUrlExceptions([
            '*/admin/posts/*',
        ]);
}
```

## 저장되지 않은 변경 사항 알림 {#unsaved-changes-alerts}

사용자가 변경 사항을 저장하지 않고 페이지를 벗어나려고 할 때 알림을 표시할 수 있습니다. 이 기능은 리소스의 [생성](resources/creating-records) 및 [수정](resources/editing-records) 페이지, 그리고 열려 있는 모든 액션 모달에 적용됩니다. 이 기능을 활성화하려면 `unsavedChangesAlerts()` 메서드를 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->unsavedChangesAlerts();
}
```

## 데이터베이스 트랜잭션 활성화 {#enabling-database-transactions}

기본적으로 Filament는 작업을 데이터베이스 트랜잭션으로 감싸지 않으며, 사용자가 직접 작업이 트랜잭션으로 감싸도 안전한지 테스트한 후에 이를 활성화할 수 있도록 허용합니다. 하지만 `databaseTransactions()` 메서드를 사용하면 모든 작업에 대해 한 번에 데이터베이스 트랜잭션을 활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->databaseTransactions();
}
```

트랜잭션으로 감싸지 않기를 원하는 작업이 있다면, `databaseTransaction(false)` 메서드를 사용할 수 있습니다:

```php
CreateAction::make()
    ->databaseTransaction(false)
```

그리고 [리소스 생성](resources/creating-records) 및 [리소스 수정](resources/editing-records)과 같은 페이지의 경우, 페이지 클래스에서 `$hasDatabaseTransactions` 속성을 `false`로 정의할 수 있습니다:

```php
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    protected ?bool $hasDatabaseTransactions = false;

    // ...
}
```

### 특정 액션 및 페이지에 대해 데이터베이스 트랜잭션 사용하기 {#opting-in-to-database-transactions-for-specific-actions-and-pages}

모든 곳에서 데이터베이스 트랜잭션을 활성화하고 특정 액션 및 페이지에서 이를 비활성화하는 대신, 특정 액션 및 페이지에 대해서만 데이터베이스 트랜잭션을 사용할 수 있습니다.

액션의 경우, `databaseTransaction()` 메서드를 사용할 수 있습니다:

```php
CreateAction::make()
    ->databaseTransaction()
```

[리소스 생성](resources/creating-records) 및 [리소스 수정](resources/editing-records)과 같은 페이지의 경우, 페이지 클래스에서 `$hasDatabaseTransactions` 속성을 `true`로 정의할 수 있습니다:

```php
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    protected ?bool $hasDatabaseTransactions = true;

    // ...
}
```

## 패널에 에셋 등록하기 {#registering-assets-for-a-panel}

특정 패널 내의 페이지에서만 로드되고, 앱의 나머지 부분에서는 로드되지 않는 [에셋](../support/assets)을 등록할 수 있습니다. 이를 위해 `assets()` 메서드에 에셋 배열을 전달하면 됩니다:

```php
use Filament\Panel;
use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->assets([
            Css::make('custom-stylesheet', resource_path('css/custom.css')),
            Js::make('custom-script', resource_path('js/custom.js')),
        ]);
}
```

이 [에셋](../support/assets)들을 사용하기 전에, `php artisan filament:assets` 명령어를 실행해야 합니다.

## 미들웨어 적용하기 {#applying-middleware}

구성에서 `middleware()` 메서드에 미들웨어 클래스 배열을 전달하여 모든 라우트에 추가 미들웨어를 적용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->middleware([
            // ...
        ]);
}
```

기본적으로 미들웨어는 페이지가 처음 로드될 때만 실행되며, 이후의 Livewire AJAX 요청에서는 실행되지 않습니다. 모든 요청마다 미들웨어를 실행하고 싶다면, `middleware()` 메서드의 두 번째 인자로 `true`를 전달하여 영구적으로 만들 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->middleware([
            // ...
        ], isPersistent: true);
}
```

### 인증된 라우트에 미들웨어 적용하기 {#applying-middleware-to-authenticated-routes}

구성에서 `authMiddleware()` 메서드에 미들웨어 클래스 배열을 전달하여 모든 인증된 라우트에 미들웨어를 적용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authMiddleware([
            // ...
        ]);
}
```

기본적으로 미들웨어는 페이지가 처음 로드될 때만 실행되며, 이후의 Livewire AJAX 요청에서는 실행되지 않습니다. 모든 요청마다 미들웨어를 실행하고 싶다면, `authMiddleware()` 메서드의 두 번째 인자로 `true`를 전달하여 영구적으로 만들 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authMiddleware([
            // ...
        ], isPersistent: true);
}
```

## 브로드캐스팅 비활성화 {#disabling-broadcasting}

기본적으로, Laravel Echo는 [발행된 `config/filament.php` 설정 파일](installation#publishing-configuration)에서 자격 증명이 설정되어 있다면 모든 패널에 대해 자동으로 연결됩니다. 패널에서 이 자동 연결을 비활성화하려면 `broadcasting(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->broadcasting(false);
}
```
