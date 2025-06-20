---
title: 탭
---
# [폼.레이아웃] Tabs

## 개요 {#overview}

일부 폼은 길고 복잡할 수 있습니다. 한 번에 보이는 컴포넌트의 수를 줄이기 위해 탭을 사용할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Tab 1')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 2')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 3')
            ->schema([
                // ...
            ]),
    ])
```

<AutoScreenshot name="forms/layout/tabs/simple" alt="탭" version="3.x" />

## 기본 활성 탭 설정하기 {#setting-the-default-active-tab}

첫 번째 탭이 기본적으로 열려 있습니다. `activeTab()` 메서드를 사용하여 기본으로 열리는 탭을 변경할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Tab 1')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 2')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 3')
            ->schema([
                // ...
            ]),
    ])
    ->activeTab(2)
```

## 탭 아이콘 설정하기 {#setting-a-tab-icon}

탭에는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 가질 수 있으며, `icon()` 메서드를 사용하여 설정할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Notifications')
            ->icon('heroicon-m-bell')
            ->schema([
                // ...
            ]),
        // ...
    ])
```

<AutoScreenshot name="forms/layout/tabs/icons" alt="아이콘이 있는 탭" version="3.x" />

### 탭 아이콘 위치 설정하기 {#setting-the-tab-icon-position}

`iconPosition()` 메서드를 사용하여 탭의 아이콘을 라벨 앞이나 뒤에 배치할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;
use Filament\Support\Enums\IconPosition;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Notifications')
            ->icon('heroicon-m-bell')
            ->iconPosition(IconPosition::After)
            ->schema([
                // ...
            ]),
        // ...
    ])
```

<AutoScreenshot name="forms/layout/tabs/icons-after" alt="라벨 뒤에 아이콘이 있는 탭" version="3.x" />

## 탭 배지 설정하기 {#setting-a-tab-badge}

탭에는 배지를 가질 수 있으며, `badge()` 메서드를 사용하여 설정할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Notifications')
            ->badge(5)
            ->schema([
                // ...
            ]),
        // ...
    ])
```

<AutoScreenshot name="forms/layout/tabs/badges" alt="배지가 있는 탭" version="3.x" />

배지의 색상을 변경하고 싶다면 `badgeColor()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Notifications')
            ->badge(5)
            ->badgeColor('success')
            ->schema([
                // ...
            ]),
        // ...
    ])
```

## 탭 내에서 그리드 컬럼 사용하기 {#using-grid-columns-within-a-tab}

탭 내에서 [그리드](grid)를 커스터마이즈하기 위해 `columns()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Tab 1')
            ->schema([
                // ...
            ])
            ->columns(3),
        // ...
    ])
```

## 스타일이 적용된 컨테이너 제거하기 {#removing-the-styled-container}

기본적으로, 탭과 그 내용은 카드로 스타일링된 컨테이너에 감싸져 있습니다. `contained()`를 사용하여 스타일이 적용된 컨테이너를 제거할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Tab 1')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 2')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 3')
            ->schema([
                // ...
            ]),
    ])
    ->contained(false)
```

## 현재 탭 상태 유지하기 {#persisting-the-current-tab}

기본적으로, 현재 탭은 브라우저의 로컬 스토리지에 저장되지 않습니다. `persistTab()` 메서드를 사용하여 이 동작을 변경할 수 있습니다. 또한 앱 내의 다른 탭 세트와 구분하기 위해 탭 컴포넌트에 고유한 `id()`를 전달해야 합니다. 이 ID는 로컬 스토리지에서 현재 탭을 저장하는 키로 사용됩니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        // ...
    ])
    ->persistTab()
    ->id('order-tabs')
```

### URL 쿼리 문자열에 현재 탭 상태 유지하기 {#persisting-the-current-tab-in-the-urls-query-string}

기본적으로, 현재 탭은 URL의 쿼리 문자열에 저장되지 않습니다. `persistTabInQueryString()` 메서드를 사용하여 이 동작을 변경할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Tab 1')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 2')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 3')
            ->schema([
                // ...
            ]),
    ])
    ->persistTabInQueryString()
```

기본적으로, 현재 탭은 `tab` 키를 사용하여 URL의 쿼리 문자열에 저장됩니다. 이 키는 `persistTabInQueryString()` 메서드에 전달하여 변경할 수 있습니다:

```php
use Filament\Forms\Components\Tabs;

Tabs::make('Tabs')
    ->tabs([
        Tabs\Tab::make('Tab 1')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 2')
            ->schema([
                // ...
            ]),
        Tabs\Tab::make('Tab 3')
            ->schema([
                // ...
            ]),
    ])
    ->persistTabInQueryString('settings-tab')
```

