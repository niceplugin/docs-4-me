---
title: Section
---
# [폼.레이아웃] Section

## 개요 {#overview}

필드를 각기 다른 섹션으로 구분하고, 각 섹션에 제목과 설명을 추가하고 싶을 수 있습니다. 이를 위해 섹션 컴포넌트를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Rate limiting')
    ->description('기간당 요청 수를 제한하여 남용을 방지합니다')
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="forms/layout/section/simple" alt="Section" version="3.x" />

헤더 없이 섹션을 사용할 수도 있으며, 이 경우 컴포넌트들이 단순한 카드로 감싸집니다:

```php
use Filament\Forms\Components\Section;

Section::make()
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="forms/layout/section/without-header" alt="Section without header" version="3.x" />

## 섹션 헤더 또는 푸터에 액션 추가하기 {#adding-actions-to-the-sections-header-or-footer}

섹션은 [헤더](#adding-actions-to-the-sections-header)나 [푸터](#adding-actions-to-the-sections-footer)에 액션을 가질 수 있습니다.

### 섹션 헤더에 액션 추가하기 {#adding-actions-to-the-sections-header}

`headerActions()` 메서드를 사용하여 섹션의 헤더에 [액션](../actions)을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Section;

Section::make('Rate limiting')
    ->headerActions([
        Action::make('test')
            ->action(function () {
                // ...
            }),
    ])
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="forms/layout/section/header/actions" alt="Section with header actions" version="3.x" />

> [섹션에 제목이나 ID가 있는지 확인하세요](#adding-actions-to-a-section-without-heading)

### 섹션 푸터에 액션 추가하기 {#adding-actions-to-the-sections-footer}

[헤더 액션](#adding-an-icon-to-the-sections-header) 외에도, `footerActions()` 메서드를 사용하여 섹션의 푸터에 [액션](../actions)을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Section;

Section::make('Rate limiting')
    ->schema([
        // ...
    ])
    ->footerActions([
        Action::make('test')
            ->action(function () {
                // ...
            }),
    ])
```

<AutoScreenshot name="forms/layout/section/footer/actions" alt="Section with footer actions" version="3.x" />

> [섹션에 제목이나 ID가 있는지 확인하세요](#adding-actions-to-a-section-without-heading)

#### 섹션 푸터 액션 정렬하기 {#aligning-section-footer-actions}

푸터 액션은 기본적으로 인라인 시작(왼쪽)에 정렬됩니다. `footerActionsAlignment()` 메서드를 사용하여 정렬을 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Support\Enums\Alignment;

Section::make('Rate limiting')
    ->schema([
        // ...
    ])
    ->footerActions([
        Action::make('test')
            ->action(function () {
                // ...
            }),
    ])
    ->footerActionsAlignment(Alignment::End)
```

### 제목 없는 섹션에 액션 추가하기 {#adding-actions-to-a-section-without-heading}

섹션에 제목이 없는 경우, Filament는 그 안의 액션을 찾을 방법이 없습니다. 이 경우, 반드시 고유한 `id()`를 섹션에 전달해야 합니다:

```php
use Filament\Forms\Components\Section;

Section::make()
    ->id('rateLimitingSection')
    ->headerActions([
        // ...
    ])
    ->schema([
        // ...
    ])
```

## 섹션 헤더에 아이콘 추가하기 {#adding-an-icon-to-the-sections-header}

`icon()` 메서드를 사용하여 섹션의 헤더에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품들')
    ->icon('heroicon-m-shopping-bag')
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="forms/layout/section/icons" alt="Section with icon" version="3.x" />

## 제목과 설명을 옆에 배치하기 {#positioning-the-heading-and-description-aside}

`aside()`를 사용하면 제목과 설명을 왼쪽에, 폼 컴포넌트는 오른쪽 카드 안에 정렬할 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Rate limiting')
    ->description('기간당 요청 수를 제한하여 남용을 방지합니다')
    ->aside()
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="forms/layout/section/aside" alt="Section with heading and description aside" version="3.x" />

## 섹션 접기 {#collapsing-sections}

섹션은 `collapsible()`로 설정하여 긴 폼에서 내용을 선택적으로 숨길 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품들')
    ->schema([
        // ...
    ])
    ->collapsible()
```

섹션을 기본적으로 `collapsed()` 상태로 둘 수도 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품들')
    ->schema([
        // ...
    ])
    ->collapsed()
```

<AutoScreenshot name="forms/layout/section/collapsed" alt="Collapsed section" version="3.x" />

### 접힌 섹션 상태 유지하기 {#persisting-collapsed-sections}

`persistCollapsed()` 메서드를 사용하면 섹션이 접힌 상태를 로컬 스토리지에 저장할 수 있어, 사용자가 페이지를 새로고침해도 접힌 상태가 유지됩니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품들')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed()
```

접힘 상태를 저장하려면, 로컬 스토리지에 상태를 저장할 고유한 ID가 필요합니다. 이 ID는 섹션의 제목을 기반으로 생성됩니다. 섹션에 제목이 없거나, 같은 제목을 가진 여러 섹션이 있는데 이들을 함께 접고 싶지 않다면, 해당 섹션의 `id()`를 수동으로 지정하여 ID 충돌을 방지할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품들')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed()
    ->id('order-cart')
```

## 컴팩트 섹션 스타일링 {#compact-section-styling}

섹션을 중첩할 때, 더 컴팩트한 스타일을 사용할 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Rate limiting')
    ->description('기간당 요청 수를 제한하여 남용을 방지합니다')
    ->schema([
        // ...
    ])
    ->compact()
```

<AutoScreenshot name="forms/layout/section/compact" alt="Compact section" version="3.x" />

## 섹션 내에서 그리드 컬럼 사용하기 {#using-grid-columns-within-a-section}

`columns()` 메서드를 사용하여 섹션 내에 [그리드](grid)를 쉽게 만들 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make('Heading')
    ->schema([
        // ...
    ])
    ->columns(2)
```
