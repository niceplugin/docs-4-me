---
title: 페이지
---
# [패널] 페이지
## 개요 {#overview}

Filament을 사용하면 앱을 위해 완전히 맞춤화된 페이지를 생성할 수 있습니다.

## 페이지 생성하기 {#creating-a-page}

새 페이지를 생성하려면 다음 명령어를 사용할 수 있습니다:

```bash
php artisan make:filament-page Settings
```

이 명령어는 Filament 디렉터리의 `/Pages` 디렉터리에 페이지 클래스 파일 하나와, Filament 뷰 디렉터리의 `/pages` 디렉터리에 뷰 파일 하나를 생성합니다.

페이지 클래스는 모두 패널에서 사용할 수 있는 몇 가지 추가 유틸리티가 포함된 전체 페이지 [Livewire](https://livewire.laravel.com) 컴포넌트입니다.

## 권한 부여 {#authorization}

Page 클래스에서 `canAccess()` 메서드를 오버라이드하여 메뉴에 페이지가 표시되지 않도록 할 수 있습니다. 이는 어떤 사용자가 내비게이션에서 페이지를 볼 수 있는지, 그리고 어떤 사용자가 페이지에 직접 방문할 수 있는지 제어하고 싶을 때 유용합니다:

```php
public static function canAccess(): bool
{
    return auth()->user()->canManageSettings();
}
```

## 페이지에 액션 추가하기 {#adding-actions-to-pages}

액션은 페이지에서 작업을 수행하거나 URL을 방문할 수 있는 버튼입니다. 그 기능에 대해 더 알고 싶다면 [여기](../actions/overview)를 참고하세요.

모든 페이지는 Livewire 컴포넌트이기 때문에, [액션을 어디서든 추가](../actions/adding-an-action-to-a-livewire-component#adding-the-action)할 수 있습니다. 페이지에는 이미 `InteractsWithActions` 트레이트, `HasActions` 인터페이스, `<x-filament-actions::modals />` Blade 컴포넌트가 모두 설정되어 있습니다.

### 헤더 액션 {#header-actions}

[리소스 페이지](resources/getting-started)를 포함한 모든 페이지의 헤더에 쉽게 액션을 추가할 수 있습니다. Blade 템플릿에 아무것도 추가할 필요가 없으며, 저희가 이를 처리해 드립니다. 페이지 클래스의 `getHeaderActions()` 메서드에서 액션을 반환하기만 하면 됩니다:

```php
use Filament\Actions\Action;

protected function getHeaderActions(): array
{
    return [
        Action::make('edit')
            ->url(route('posts.edit', ['post' => $this->post])),
        Action::make('delete')
            ->requiresConfirmation()
            ->action(fn () => $this->post->delete()),
    ];
}
```

### 페이지가 로드될 때 액션 모달 열기 {#opening-an-action-modal-when-a-page-loads}

페이지가 로드될 때 열고 싶은 액션의 이름을 `$defaultAction` 속성에 설정하여 액션을 열 수 있습니다:

```php
use Filament\Actions\Action;

public $defaultAction = 'onboarding';

public function onboardingAction(): Action
{
    return Action::make('onboarding')
        ->modalHeading('Welcome')
        ->visible(fn (): bool => ! auth()->user()->isOnBoarded());
}
```

또한 `$defaultActionArguments` 속성을 사용하여 기본 액션에 인자 배열을 전달할 수도 있습니다:

```php
public $defaultActionArguments = ['step' => 2];
```

또는, 페이지의 쿼리 문자열 파라미터로 `action`을 지정하여 페이지가 로드될 때 액션 모달을 열 수도 있습니다:

```
/admin/products/edit/932510?action=onboarding
```

### 폼 데이터 새로고침 {#refreshing-form-data}

[Edit](resources/editing-records) 또는 [View](resources/viewing-records) 리소스 페이지에서 액션을 사용할 때, `refreshFormData()` 메서드를 사용하여 메인 폼 내의 데이터를 새로고침할 수 있습니다:

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('approve')
    ->action(function (Post $record) {
        $record->approve();

        $this->refreshFormData([
            'status',
        ]);
    })
```

이 메서드는 폼에서 새로고침하고자 하는 모델 속성들의 배열을 인자로 받습니다.

## 페이지에 위젯 추가하기 {#adding-widgets-to-pages}

Filament에서는 페이지의 헤더 아래와 푸터 위에 [위젯](dashboard)을 표시할 수 있습니다.

페이지에 위젯을 추가하려면 `getHeaderWidgets()` 또는 `getFooterWidgets()` 메서드를 사용하세요:

```php
use App\Filament\Widgets\StatsOverviewWidget;

protected function getHeaderWidgets(): array
{
    return [
        StatsOverviewWidget::class
    ];
}
```

`getHeaderWidgets()`는 페이지 콘텐츠 위에 표시할 위젯 배열을 반환하며, `getFooterWidgets()`는 아래에 표시됩니다.

위젯을 만드는 방법과 커스터마이즈하는 방법을 알고 싶다면 [Dashboard](dashboard) 문서 섹션을 참고하세요.

### 위젯 그리드 커스터마이징 {#customizing-the-widgets-grid}

위젯을 표시하는 데 사용되는 그리드 열의 수를 변경할 수 있습니다.

`getHeaderWidgetsColumns()` 또는 `getFooterWidgetsColumns()` 메서드를 오버라이드하여 사용할 그리드 열의 수를 반환할 수 있습니다:

```php
public function getHeaderWidgetsColumns(): int | array
{
    return 3;
}
```

#### 반응형 위젯 그리드 {#responsive-widgets-grid}

브라우저의 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에 따라 위젯 그리드 열의 개수를 변경하고 싶을 수 있습니다. 각 브레이크포인트에서 사용해야 하는 열의 개수를 포함하는 배열을 사용하여 이를 설정할 수 있습니다:

```php
public function getHeaderWidgetsColumns(): int | array
{
    return [
        'md' => 4,
        'xl' => 5,
    ];
}
```

이는 [반응형 위젯 너비](dashboard#responsive-widget-widths)와 잘 어울립니다.

#### 페이지에서 위젯으로 데이터 전달하기 {#passing-data-to-widgets-from-the-page}

페이지에서 위젯으로 데이터를 전달하려면 `getWidgetsData()` 메서드를 사용할 수 있습니다:

```php
public function getWidgetData(): array
{
    return [
        'stats' => [
            'total' => 100,
        ],
    ];
}
```

이제 위젯 클래스에 해당하는 public `$stats` 배열 프로퍼티를 정의하면, 자동으로 값이 채워집니다:

```php
public $stats = [];
```

### 페이지에서 위젯에 속성 전달하기 {#passing-properties-to-widgets-on-pages}

페이지에 위젯을 등록할 때, `make()` 메서드를 사용하여 [Livewire 속성](https://livewire.laravel.com/docs/properties) 배열을 전달할 수 있습니다:

```php
use App\Filament\Widgets\StatsOverviewWidget;

protected function getHeaderWidgets(): array
{
    return [
        StatsOverviewWidget::make([
            'status' => 'active',
        ]),
    ];
}
```

이 속성 배열은 위젯 클래스의 [public Livewire 속성](https://livewire.laravel.com/docs/properties)으로 매핑됩니다:

```php
use Filament\Widgets\Widget;

class StatsOverviewWidget extends Widget
{
    public string $status;

    // ...
}
```

이제 위젯 클래스에서 `$this->status`를 사용하여 `status`에 접근할 수 있습니다.

## 페이지 제목 사용자 지정 {#customizing-the-page-title}

기본적으로 Filament는 페이지 이름을 기반으로 자동으로 제목을 생성합니다. 페이지 클래스에 `$title` 속성을 정의하여 이를 오버라이드할 수 있습니다:

```php
protected static ?string $title = 'Custom Page Title';
```

또는 `getTitle()` 메서드에서 문자열을 반환할 수도 있습니다:

```php
use Illuminate\Contracts\Support\Htmlable;

public function getTitle(): string | Htmlable
{
    return __('Custom Page Title');
}
```

## 페이지 네비게이션 라벨 커스터마이징 {#customizing-the-page-navigation-label}

기본적으로 Filament는 페이지의 [제목](#customizing-the-page-title)을 [네비게이션](navigation) 항목 라벨로 사용합니다. 페이지 클래스에서 `$navigationLabel` 프로퍼티를 정의하여 이를 오버라이드할 수 있습니다:

```php
protected static ?string $navigationLabel = '커스텀 네비게이션 라벨';
```

또는, `getNavigationLabel()` 메서드에서 문자열을 반환할 수도 있습니다:

```php
public static function getNavigationLabel(): string
{
    return __('커스텀 네비게이션 라벨');
}
```

## 페이지 URL 사용자 지정 {#customizing-the-page-url}

기본적으로 Filament는 페이지 이름을 기반으로 URL(슬러그)을 자동으로 생성합니다. 페이지 클래스에서 `$slug` 속성을 정의하여 이를 오버라이드할 수 있습니다:

```php
protected static ?string $slug = 'custom-url-slug';
```

## 페이지 헤딩 커스터마이징 {#customizing-the-page-heading}

기본적으로 Filament는 페이지의 [타이틀](#customizing-the-page-title)을 헤딩으로 사용합니다. 페이지 클래스에서 `$heading` 프로퍼티를 정의하여 이를 오버라이드할 수 있습니다:

```php
protected ?string $heading = '커스텀 페이지 헤딩';
```

또는, `getHeading()` 메서드에서 문자열을 반환할 수도 있습니다:

```php
public function getHeading(): string
{
    return __('커스텀 페이지 헤딩');
}
```

### 페이지 부제목 추가하기 {#adding-a-page-subheading}

페이지 클래스에 `$subheading` 속성을 정의하여 페이지에 부제목을 추가할 수도 있습니다:

```php
protected ?string $subheading = '사용자 지정 페이지 부제목';
```

또는 `getSubheading()` 메서드에서 문자열을 반환할 수도 있습니다:

```php
public function getSubheading(): ?string
{
    return __('사용자 지정 페이지 부제목');
}
```

## 페이지 헤더를 커스텀 뷰로 교체하기 {#replacing-the-page-header-with-a-custom-view}

기본 [헤딩](#customizing-the-page-heading), [서브헤딩](#adding-a-page-subheading), [액션](#header-actions)을 원하는 페이지에서 커스텀 헤더 뷰로 교체할 수 있습니다. `getHeader()` 메서드에서 이를 반환하면 됩니다:

```php
use Illuminate\Contracts\View\View;

public function getHeader(): ?View
{
    return view('filament.settings.custom-header');
}
```

이 예시는 `resources/views/filament/settings/custom-header.blade.php`에 Blade 뷰가 있다고 가정합니다.

## 페이지 하단에 커스텀 뷰 렌더링하기 {#rendering-a-custom-view-in-the-footer-of-the-page}

모든 페이지의 콘텐츠 아래에 푸터를 추가할 수도 있습니다. `getFooter()` 메서드에서 반환하면 됩니다:

```php
use Illuminate\Contracts\View\View;

public function getFooter(): ?View
{
    return view('filament.settings.custom-footer');
}
```

이 예제는 `resources/views/filament/settings/custom-footer.blade.php`에 Blade 뷰가 있다고 가정합니다.

## 최대 콘텐츠 너비 사용자 지정 {#customizing-the-maximum-content-width}

기본적으로 Filament는 페이지의 콘텐츠 너비를 제한하여, 큰 화면에서 너무 넓어지지 않도록 합니다. 이를 변경하려면 `getMaxContentWidth()` 메서드를 오버라이드하면 됩니다. 옵션은 [Tailwind의 max-width 스케일](https://tailwindcss.com/docs/max-width)에 해당합니다. 사용할 수 있는 옵션은 `ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`, `TwoExtraLarge`, `ThreeExtraLarge`, `FourExtraLarge`, `FiveExtraLarge`, `SixExtraLarge`, `SevenExtraLarge`, `Full`, `MinContent`, `MaxContent`, `FitContent`,  `Prose`, `ScreenSmall`, `ScreenMedium`, `ScreenLarge`, `ScreenExtraLarge`, `ScreenTwoExtraLarge`입니다. 기본값은 `SevenExtraLarge`입니다:

```php
use Filament\Support\Enums\MaxWidth;

public function getMaxContentWidth(): MaxWidth
{
    return MaxWidth::Full;
}
```

## 페이지로의 URL 생성 {#generating-urls-to-pages}

Filament는 페이지 클래스에서 URL을 생성할 수 있도록 `getUrl()` 정적 메서드를 제공합니다. 기존에는 URL을 직접 작성하거나 Laravel의 `route()` 헬퍼를 사용해야 했지만, 이러한 방법들은 페이지의 슬러그나 라우트 명명 규칙에 대한 지식이 필요합니다.

`getUrl()` 메서드는 인자 없이 호출하면 URL을 생성합니다:

```php
use App\Filament\Pages\Settings;

Settings::getUrl(); // /admin/settings
```

페이지가 URL 또는 쿼리 파라미터를 사용하는 경우, 인자를 전달해야 합니다:

```php
use App\Filament\Pages\Settings;

Settings::getUrl(['section' => 'notifications']); // /admin/settings?section=notifications
```

### 다른 패널의 페이지로 URL 생성하기 {#generating-urls-to-pages-in-other-panels}

앱에 여러 개의 패널이 있는 경우, `getUrl()`은 현재 패널 내에서의 URL을 생성합니다. 페이지가 연결된 패널을 지정하려면 `panel` 인자에 패널 ID를 전달할 수 있습니다:

```php
use App\Filament\Pages\Settings;

Settings::getUrl(panel: 'marketing');
```

## 페이지 간 하위 내비게이션 추가하기 {#adding-sub-navigation-between-pages}

여러 페이지에 공통 하위 내비게이션을 추가하여 사용자가 빠르게 이동할 수 있도록 할 수 있습니다. 이를 위해 [클러스터](clusters)를 정의하면 됩니다. 클러스터에는 [리소스](resources/getting-started)도 포함될 수 있으며, 클러스터 내에서 여러 페이지나 리소스 간에 전환할 수 있습니다.

## 페이지의 body 태그에 추가 속성 추가하기 {#adding-extra-attributes-to-the-body-tag-of-a-page}

페이지의 `<body>` 태그에 추가 속성을 넣고 싶을 수 있습니다. 이를 위해 `$extraBodyAttributes`에 속성 배열을 설정할 수 있습니다:

```php
protected array $extraBodyAttributes = [];
```

또는, `getExtraBodyAttributes()` 메서드에서 속성과 그 값의 배열을 반환할 수도 있습니다:

```php
public function getExtraBodyAttributes(): array
{
    return [
        'class' => 'settings-page',
    ];
}
```
