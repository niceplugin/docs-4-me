---
title: 네비게이션
---
# [패널] 네비게이션

## 개요 {#overview}

기본적으로 Filament는 각 [리소스](resources/getting-started), [커스텀 페이지](pages), 그리고 [클러스터](clusters)에 대해 네비게이션 항목을 등록합니다. 이러한 클래스들은 정적 속성과 메서드를 포함하고 있으며, 이를 오버라이드하여 해당 네비게이션 항목을 구성할 수 있습니다.

앱에 두 번째 계층의 네비게이션을 추가하고 싶다면, [클러스터](clusters)를 사용할 수 있습니다. 이는 리소스와 페이지를 함께 그룹화하는 데 유용합니다.

## 네비게이션 항목의 라벨 커스터마이징 {#customizing-a-navigation-items-label}

기본적으로 네비게이션 라벨은 리소스나 페이지의 이름에서 생성됩니다. `$navigationLabel` 속성을 사용하여 이를 커스터마이징할 수 있습니다:

```php
protected static ?string $navigationLabel = '커스텀 네비게이션 라벨';
```

또는, `getNavigationLabel()` 메서드를 오버라이드할 수도 있습니다:

```php
public static function getNavigationLabel(): string
{
    return '커스텀 네비게이션 라벨';
}
```

## 네비게이션 항목의 아이콘 커스터마이징 {#customizing-a-navigation-items-icon}

네비게이션 항목의 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 커스터마이징하려면, [리소스](resources/getting-started)나 [페이지](pages) 클래스에서 `$navigationIcon` 속성을 오버라이드하면 됩니다:

```php
protected static ?string $navigationIcon = 'heroicon-o-document-text';
```

<AutoScreenshot name="panels/navigation/change-icon" alt="변경된 네비게이션 항목 아이콘" version="3.x" />

동일한 네비게이션 그룹 내의 모든 항목에 `$navigationIcon = null`로 설정하면, 해당 항목들은 그룹 라벨 아래에 수직 막대로 연결됩니다.

### 활성화된 경우 네비게이션 아이콘 변경하기 {#switching-navigation-item-icon-when-it-is-active}

활성화된 항목에만 사용될 네비게이션 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 `$activeNavigationIcon` 속성으로 지정할 수 있습니다:

```php
protected static ?string $activeNavigationIcon = 'heroicon-o-document-text';
```

<AutoScreenshot name="panels/navigation/active-icon" alt="활성화 시 다른 네비게이션 아이콘" version="3.x" />

## 네비게이션 항목 정렬하기 {#sorting-navigation-items}

기본적으로 네비게이션 항목은 알파벳 순으로 정렬됩니다. `$navigationSort` 속성을 사용하여 이를 커스터마이징할 수 있습니다:

```php
protected static ?int $navigationSort = 3;
```

이제, 더 낮은 정렬 값의 네비게이션 항목이 더 높은 값보다 먼저 나타납니다 - 오름차순입니다.

<AutoScreenshot name="panels/navigation/sort-items" alt="네비게이션 항목 정렬" version="3.x" />

## 네비게이션 항목에 배지 추가하기 {#adding-a-badge-to-a-navigation-item}

네비게이션 항목 옆에 배지를 추가하려면, `getNavigationBadge()` 메서드를 사용하여 배지의 내용을 반환하면 됩니다:

```php
public static function getNavigationBadge(): ?string
{
    return static::getModel()::count();
}
```

<AutoScreenshot name="panels/navigation/badge" alt="배지가 있는 네비게이션 항목" version="3.x" />

`getNavigationBadge()`에서 배지 값이 반환되면, 기본적으로 기본 색상으로 표시됩니다. 배지의 스타일을 상황에 맞게 지정하려면, `getNavigationBadgeColor()` 메서드에서 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나를 반환하세요:

```php
public static function getNavigationBadgeColor(): ?string
{
    return static::getModel()::count() > 10 ? 'warning' : 'primary';
}
```

<AutoScreenshot name="panels/navigation/badge-color" alt="배지 색상이 있는 네비게이션 항목" version="3.x" />

네비게이션 배지에 대한 커스텀 툴팁은 `$navigationBadgeTooltip`에 설정할 수 있습니다:

```php
protected static ?string $navigationBadgeTooltip = '사용자 수';
```

또는 `getNavigationBadgeTooltip()`에서 반환할 수도 있습니다:

```php
public static function getNavigationBadgeTooltip(): ?string
{
    return '사용자 수';
}
```

<AutoScreenshot name="panels/navigation/badge-tooltip" alt="배지 툴팁이 있는 네비게이션 항목" version="3.x" />

## 네비게이션 항목 그룹화하기 {#grouping-navigation-items}

[리소스](resources/getting-started)와 [커스텀 페이지](pages)에서 `$navigationGroup` 속성을 지정하여 네비게이션 항목을 그룹화할 수 있습니다:

```php
protected static ?string $navigationGroup = '설정';
```

<AutoScreenshot name="panels/navigation/group" alt="그룹화된 네비게이션 항목" version="3.x" />

동일한 네비게이션 그룹의 모든 항목은 같은 그룹 라벨(이 경우 "설정") 아래에 함께 표시됩니다. 그룹화되지 않은 항목은 네비게이션의 시작 부분에 남아 있습니다.

### 다른 항목 아래에 네비게이션 항목 그룹화하기 {#grouping-navigation-items-under-other-items}

네비게이션 항목을 다른 항목의 자식으로 그룹화하려면, 부모 항목의 라벨을 `$navigationParentItem`으로 전달하면 됩니다:

```php
protected static ?string $navigationParentItem = '알림';

protected static ?string $navigationGroup = '설정';
```

동적으로 부모 항목 라벨을 설정하려면 `getNavigationParentItem()` 메서드를 사용할 수도 있습니다:

```php
public static function getNavigationParentItem(): ?string
{
    return __('filament/navigation.groups.settings.items.notifications');
}
```

위에서 볼 수 있듯이, 부모 항목에 네비게이션 그룹이 있다면, 해당 네비게이션 그룹도 정의되어야 올바른 부모 항목을 식별할 수 있습니다.

> 이와 같이 세 번째 수준의 네비게이션이 필요하다면, [클러스터](clusters)를 사용하는 것이 더 적합합니다. 클러스터는 리소스와 커스텀 페이지를 논리적으로 그룹화하며, 자체적으로 별도의 네비게이션을 공유할 수 있습니다.

### 네비게이션 그룹 커스터마이징 {#customizing-navigation-groups}

[설정](configuration)에서 `navigationGroups()`를 호출하고, 순서대로 `NavigationGroup` 객체를 전달하여 네비게이션 그룹을 커스터마이징할 수 있습니다:

```php
use Filament\Navigation\NavigationGroup;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigationGroups([
            NavigationGroup::make()
                 ->label('상점')
                 ->icon('heroicon-o-shopping-cart'),
            NavigationGroup::make()
                ->label('블로그')
                ->icon('heroicon-o-pencil'),
            NavigationGroup::make()
                ->label(fn (): string => __('navigation.settings'))
                ->icon('heroicon-o-cog-6-tooth')
                ->collapsed(),
        ]);
}
```

이 예시에서는 그룹에 커스텀 `icon()`을 전달하고, 하나의 그룹을 기본적으로 `collapsed()`로 만듭니다.

#### 네비게이션 그룹 순서 지정하기 {#ordering-navigation-groups}

`navigationGroups()`를 사용하면 네비게이션 그룹의 새로운 순서를 정의하게 됩니다. 전체 `NavigationGroup` 객체를 정의하지 않고 그룹의 순서만 바꾸고 싶다면, 새로운 순서로 그룹 라벨만 전달하면 됩니다:

```php
$panel
    ->navigationGroups([
        '상점',
        '블로그',
        '설정',
    ])
```

#### 네비게이션 그룹을 접을 수 없게 만들기 {#making-navigation-groups-not-collapsible}

기본적으로 네비게이션 그룹은 접을 수 있습니다.

<AutoScreenshot name="panels/navigation/group-collapsible" alt="접을 수 있는 네비게이션 그룹" version="3.x" />

`NavigationGroup` 객체에서 `collapsible(false)`를 호출하여 이 동작을 비활성화할 수 있습니다:

```php
use Filament\Navigation\NavigationGroup;

NavigationGroup::make()
    ->label('설정')
    ->icon('heroicon-o-cog-6-tooth')
    ->collapsible(false);
```

<AutoScreenshot name="panels/navigation/group-not-collapsible" alt="접을 수 없는 네비게이션 그룹" version="3.x" />

또는, [설정](configuration)에서 모든 그룹에 대해 전역적으로 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->collapsibleNavigationGroups(false);
}
```

#### 네비게이션 그룹에 추가 HTML 속성 전달하기 {#adding-extra-html-attributes-to-navigation-groups}

네비게이션 그룹에 추가 HTML 속성을 전달할 수 있으며, 이는 외부 DOM 요소에 병합됩니다. `extraSidebarAttributes()` 또는 `extraTopbarAttributes()` 메서드에 속성 이름을 키로, 속성 값을 값으로 하는 배열을 전달하세요:

```php
NavigationGroup::make()
    ->extraSidebarAttributes(['class' => 'featured-sidebar-group']),
    ->extraTopbarAttributes(['class' => 'featured-topbar-group']),
```

`extraSidebarAttributes()`는 사이드바에 포함된 네비게이션 그룹 요소에 적용되며, `extraTopbarAttributes()`는 [상단 네비게이션](#using-top-navigation) 사용 시 상단바 네비게이션 그룹 드롭다운에만 적용됩니다.

## 데스크톱에서 사이드바 접기 {#collapsible-sidebar-on-desktop}

데스크톱과 모바일 모두에서 사이드바를 접을 수 있도록 하려면, [설정](configuration)을 사용하세요:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarCollapsibleOnDesktop();
}
```

<AutoScreenshot name="panels/navigation/sidebar-collapsible-on-desktop" alt="데스크톱에서 접을 수 있는 사이드바" version="3.x" />

기본적으로 데스크톱에서 사이드바를 접으면 네비게이션 아이콘은 계속 표시됩니다. `sidebarFullyCollapsibleOnDesktop()` 메서드를 사용하여 사이드바를 완전히 접을 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarFullyCollapsibleOnDesktop();
}
```

<AutoScreenshot name="panels/navigation/sidebar-fully-collapsible-on-desktop" alt="데스크톱에서 완전히 접을 수 있는 사이드바" version="3.x" />

### 데스크톱에서 접을 수 있는 사이드바의 네비게이션 그룹 {#navigation-groups-in-a-collapsible-sidebar-on-desktop}

> 이 섹션은 `sidebarCollapsibleOnDesktop()`에만 해당되며, `sidebarFullyCollapsibleOnDesktop()`에는 해당되지 않습니다. 완전히 접을 수 있는 UI는 디자인을 변경하는 대신 전체 사이드바를 숨깁니다.

데스크톱에서 접을 수 있는 사이드바를 사용할 때, [네비게이션 그룹](#grouping-navigation-items)도 자주 사용하게 됩니다. 기본적으로 사이드바가 접히면 각 네비게이션 그룹의 라벨이 숨겨집니다. 공간이 부족하기 때문입니다. 네비게이션 그룹 자체가 [접을 수 있더라도](#making-navigation-groups-not-collapsible), 접힌 사이드바에서는 모든 항목이 계속 표시됩니다. 그룹 라벨을 클릭하여 그룹을 확장할 수 없기 때문입니다.

이러한 문제는 네비게이션 그룹 객체에 [아이콘을 전달](#customizing-navigation-groups)하여 매우 미니멀한 사이드바 디자인을 구현함으로써 해결할 수 있습니다. 아이콘이 정의되면, 접힌 사이드바에서는 항상 항목 대신 아이콘이 표시됩니다. 아이콘을 클릭하면 아이콘 옆에 드롭다운이 열려 그룹 내 항목이 표시됩니다.

네비게이션 그룹에 아이콘을 전달하면, 항목에도 아이콘이 있더라도 확장된 사이드바 UI에서는 항목 아이콘이 표시되지 않습니다. 이는 네비게이션 계층 구조를 명확하게 하고 디자인을 미니멀하게 유지하기 위함입니다. 하지만, 접힌 사이드바의 드롭다운에서는 항목의 아이콘이 표시됩니다. 드롭다운이 열려 있다는 사실만으로도 계층 구조가 이미 명확하기 때문입니다.

## 커스텀 네비게이션 항목 등록하기 {#registering-custom-navigation-items}

새로운 네비게이션 항목을 등록하려면, [설정](configuration)을 사용하세요:

```php
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigationItems([
            NavigationItem::make('Analytics')
                ->url('https://filament.pirsch.io', shouldOpenInNewTab: true)
                ->icon('heroicon-o-presentation-chart-line')
                ->group('보고서')
                ->sort(3),
            NavigationItem::make('dashboard')
                ->label(fn (): string => __('filament-panels::pages/dashboard.title'))
                ->url(fn (): string => Dashboard::getUrl())
                ->isActiveWhen(fn () => request()->routeIs('filament.admin.pages.dashboard')),
            // ...
        ]);
}
```

## 조건부로 네비게이션 항목 숨기기 {#conditionally-hiding-navigation-items}

`visible()` 또는 `hidden()` 메서드를 사용하여 조건에 따라 네비게이션 항목을 숨길 수도 있습니다. 조건을 확인하는 함수를 전달하세요:

```php
use Filament\Navigation\NavigationItem;

NavigationItem::make('Analytics')
    ->visible(fn(): bool => auth()->user()->can('view-analytics'))
    // 또는
    ->hidden(fn(): bool => ! auth()->user()->can('view-analytics')),
```

## 리소스 또는 페이지 네비게이션 항목 비활성화하기 {#disabling-resource-or-page-navigation-items}

리소스나 페이지가 네비게이션에 표시되지 않도록 하려면 다음을 사용하세요:

```php
protected static bool $shouldRegisterNavigation = false;
```

또는, `shouldRegisterNavigation()` 메서드를 오버라이드할 수 있습니다:

```php
public static function shouldRegisterNavigation(): bool
{
    return false;
}
```

이 메서드들은 리소스나 페이지에 대한 직접 접근을 제어하지 않는다는 점에 유의하세요. 단지 네비게이션에 표시될지 여부만 제어합니다. 접근 제어도 하고 싶다면 [리소스 권한](resources/getting-started#authorization) 또는 [페이지 권한](pages#authorization)을 사용해야 합니다.

## 상단 네비게이션 사용하기 {#using-top-navigation}

기본적으로 Filament는 사이드바 네비게이션을 사용합니다. [설정](configuration)에서 상단 네비게이션을 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->topNavigation();
}
```

<AutoScreenshot name="panels/navigation/top-navigation" alt="상단 네비게이션" version="3.x" />

## 사이드바 너비 커스터마이징 {#customizing-the-width-of-the-sidebar}

[설정](configuration)에서 `sidebarWidth()` 메서드에 값을 전달하여 사이드바의 너비를 커스터마이징할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarWidth('40rem');
}
```

또한, `sidebarCollapsibleOnDesktop()` 메서드를 사용하는 경우, [설정](configuration)에서 `collapsedSidebarWidth()` 메서드를 사용하여 접힌 아이콘의 너비를 커스터마이징할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarCollapsibleOnDesktop()
        ->collapsedSidebarWidth('9rem');
}
```

## 고급 네비게이션 커스터마이징 {#advanced-navigation-customization}

`navigation()` 메서드는 [설정](configuration)에서 호출할 수 있습니다. 이 메서드는 Filament가 자동으로 생성하는 항목을 오버라이드하는 커스텀 네비게이션을 구축할 수 있게 해줍니다. 이 API는 네비게이션에 대한 완전한 제어를 제공합니다.

### 커스텀 네비게이션 항목 등록하기 {#registering-custom-navigation-items-1}

네비게이션 항목을 등록하려면, `items()` 메서드를 호출하세요:

```php
use App\Filament\Pages\Settings;
use App\Filament\Resources\UserResource;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(function (NavigationBuilder $builder): NavigationBuilder {
            return $builder->items([
                NavigationItem::make('Dashboard')
                    ->icon('heroicon-o-home')
                    ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.pages.dashboard'))
                    ->url(fn (): string => Dashboard::getUrl()),
                ...UserResource::getNavigationItems(),
                ...Settings::getNavigationItems(),
            ]);
        });
}
```

<AutoScreenshot name="panels/navigation/custom-items" alt="커스텀 네비게이션 항목" version="3.x" />

### 커스텀 네비게이션 그룹 등록하기 {#registering-custom-navigation-groups}

그룹을 등록하려면, `groups()` 메서드를 호출하세요:

```php
use App\Filament\Pages\HomePageSettings;
use App\Filament\Resources\CategoryResource;
use App\Filament\Resources\PageResource;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationGroup;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(function (NavigationBuilder $builder): NavigationBuilder {
            return $builder->groups([
                NavigationGroup::make('웹사이트')
                    ->items([
                        ...PageResource::getNavigationItems(),
                        ...CategoryResource::getNavigationItems(),
                        ...HomePageSettings::getNavigationItems(),
                    ]),
            ]);
        });
}
```

### 네비게이션 비활성화하기 {#disabling-navigation}

`navigation()` 메서드에 `false`를 전달하여 네비게이션을 완전히 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(false);
}
```

<AutoScreenshot name="panels/navigation/disabled-navigation" alt="비활성화된 네비게이션 사이드바" version="3.x" />

### 상단바 비활성화하기 {#disabling-the-topbar}

`topbar()` 메서드에 `false`를 전달하여 상단바를 완전히 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->topbar(false);
}
```

## 사용자 메뉴 커스터마이징 {#customizing-the-user-menu}

사용자 메뉴는 관리자 레이아웃의 오른쪽 상단에 표시됩니다. 완전히 커스터마이징할 수 있습니다.

사용자 메뉴에 새 항목을 등록하려면, [설정](configuration)을 사용하세요:

```php
use App\Filament\Pages\Settings;
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenuItems([
            MenuItem::make()
                ->label('설정')
                ->url(fn (): string => Settings::getUrl())
                ->icon('heroicon-o-cog-6-tooth'),
            // ...
        ]);
}
```

<AutoScreenshot name="panels/navigation/user-menu" alt="커스텀 메뉴 항목이 있는 사용자 메뉴" version="3.x" />

### 프로필 링크 커스터마이징 {#customizing-the-profile-link}

사용자 메뉴의 시작 부분에 있는 사용자 프로필 링크를 커스터마이징하려면, `profile` 배열 키로 새 항목을 등록하세요:

```php
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenuItems([
            'profile' => MenuItem::make()->label('프로필 편집'),
            // ...
        ]);
}
```

프로필 페이지 생성에 대한 자세한 내용은 [인증 기능 문서](users#authentication-features)를 참고하세요.

### 로그아웃 링크 커스터마이징 {#customizing-the-logout-link}

사용자 메뉴의 끝에 있는 로그아웃 링크를 커스터마이징하려면, `logout` 배열 키로 새 항목을 등록하세요:

```php
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenuItems([
            'logout' => MenuItem::make()->label('로그아웃'),
            // ...
        ]);
}
```

### 조건부로 사용자 메뉴 항목 숨기기 {#conditionally-hiding-user-menu-items}

`visible()` 또는 `hidden()` 메서드를 사용하여 조건에 따라 사용자 메뉴 항목을 숨길 수도 있습니다. 함수를 전달하면 메뉴가 실제로 렌더링될 때 조건 평가가 지연됩니다:

```php
use App\Models\Payment;
use Filament\Navigation\MenuItem;

MenuItem::make()
    ->label('결제')
    ->visible(fn (): bool => auth()->user()->can('viewAny', Payment::class))
    // 또는
    ->hidden(fn (): bool => ! auth()->user()->can('viewAny', Payment::class))
```

### 사용자 메뉴 항목에서 `POST` HTTP 요청 보내기 {#sending-a-post-http-request-from-a-user-menu-item}

`postAction()` 메서드에 URL을 전달하여 사용자 메뉴 항목에서 `POST` HTTP 요청을 보낼 수 있습니다:

```php
use Filament\Navigation\MenuItem;

MenuItem::make()
    ->label('세션 잠금')
    ->postAction(fn (): string => route('lock-session'))
```

## 브레드크럼 비활성화하기 {#disabling-breadcrumbs}

기본 레이아웃은 앱 내에서 현재 페이지의 위치를 나타내는 브레드크럼을 표시합니다.

[설정](configuration)에서 브레드크럼을 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->breadcrumbs(false);
}
```
