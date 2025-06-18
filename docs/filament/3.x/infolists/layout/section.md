---
title: Section
---
# [인포리스트.레이아웃] Section

## 개요 {#overview}

엔트리을 여러 섹션으로 나누고, 각 섹션에 제목과 설명을 추가하고 싶을 수 있습니다. 이를 위해 섹션 컴포넌트를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Rate limiting')
    ->description('일정 기간 동안 요청 횟수를 제한하여 남용을 방지합니다')
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/section/simple" alt="Section" version="3.x" />

헤더 없이 섹션을 사용할 수도 있으며, 이 경우 컴포넌트들이 단순한 카드로 감싸집니다:

```php
use Filament\Infolists\Components\Section;

Section::make()
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/section/without-header" alt="Section without header" version="3.x" />

## 섹션의 헤더 또는 푸터에 액션 추가하기 {#adding-actions-to-the-sections-header-or-footer}

섹션은 [헤더](#adding-actions-to-the-sections-header)나 [푸터](#adding-actions-to-the-sections-footer)에 액션을 가질 수 있습니다.

### 섹션 헤더에 액션 추가하기 {#adding-actions-to-the-sections-header}

`headerActions()` 메서드를 사용하여 섹션의 헤더에 [액션](../actions)을 추가할 수 있습니다:

```php
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\Section;

Section::make('Rate limiting')
    ->headerActions([
        Action::make('edit')
            ->action(function () {
                // ...
            }),
    ])
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/section/header/actions" alt="헤더 액션이 있는 섹션" version="3.x" />

> [섹션에 제목이나 ID가 있는지 확인하세요](#adding-actions-to-a-section-without-heading)

### 섹션 푸터에 액션 추가하기 {#adding-actions-to-the-sections-footer}

[헤더 액션](#adding-an-icon-to-the-sections-header) 외에도, `footerActions()` 메서드를 사용하여 섹션의 푸터에 [액션](../actions)을 추가할 수 있습니다:

```php
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\Section;

Section::make('Rate limiting')
    ->footerActions([
        Action::make('edit')
            ->action(function () {
                // ...
            }),
    ])
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/section/footer/actions" alt="푸터 액션이 있는 섹션" version="3.x" />

> [섹션에 헤딩이나 ID가 있는지 확인하세요](#adding-actions-to-a-section-without-heading)

#### 섹션 푸터 액션 정렬 {#aligning-section-footer-actions}

푸터 액션은 기본적으로 인라인 시작(왼쪽)에 정렬됩니다. `footerActionsAlignment()` 메서드를 사용하여 정렬을 커스터마이즈할 수 있습니다:

```php
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\Section;
use Filament\Support\Enums\Alignment;

Section::make('Rate limiting')
    ->footerActions([
        Action::make('edit')
            ->action(function () {
                // ...
            }),
    ])
    ->footerActionsAlignment(Alignment::End)
    ->schema([
        // ...
    ])
```

### 제목이 없는 섹션에 액션 추가하기 {#adding-actions-to-a-section-without-heading}

섹션에 제목이 없는 경우, Filament는 그 안에 있는 액션을 찾을 방법이 없습니다. 이럴 때는 섹션에 고유한 `id()`를 전달해야 합니다:

```php
use Filament\Infolists\Components\Section;

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

섹션의 헤더에 `icon()` 메서드를 사용하여 아이콘을 추가할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품들')
    ->icon('heroicon-m-shopping-bag')
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/section/icons" alt="아이콘이 있는 섹션" version="3.x" />

## 제목과 설명을 옆에 배치하기 {#positioning-the-heading-and-description-aside}

`aside()` 메서드를 사용하여 제목과 설명을 왼쪽에 정렬하고, 카드 안의 인포리스트 컴포넌트들을 오른쪽에 배치할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Rate limiting')
    ->description('일정 기간 동안 요청 횟수를 제한하여 남용을 방지합니다')
    ->aside()
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/section/aside" alt="제목과 설명이 옆에 배치된 섹션" version="3.x" />

## 섹션 접기 {#collapsing-sections}

섹션은 `collapsible()`을 사용하여 긴 인포리스트에서 내용을 선택적으로 숨길 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품')
    ->schema([
        // ...
    ])
    ->collapsible()
```

섹션을 기본적으로 `collapsed()` 상태로 둘 수도 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Cart')
    ->description('구매를 위해 선택한 상품')
    ->schema([
        // ...
    ])
    ->collapsed()
```

<AutoScreenshot name="infolists/layout/section/collapsed" alt="접힌 섹션" version="3.x" />

### 섹션 접기 상태 유지 {#persisting-collapsed-sections}

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

접기 상태를 저장하려면, 로컬 스토리지에 상태를 저장할 고유한 ID가 필요합니다. 이 ID는 섹션의 헤딩(제목)을 기반으로 자동 생성됩니다. 만약 섹션에 헤딩이 없거나, 동일한 헤딩을 가진 여러 섹션이 있는데 이들이 함께 접히는 것을 원하지 않는 경우, `id()`를 직접 지정하여 ID 충돌을 방지할 수 있습니다:

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
use Filament\Infolists\Components\Section;

Section::make('Rate limiting')
    ->description('기간당 요청 수를 제한하여 남용을 방지합니다')
    ->schema([
        // ...
    ])
    ->compact()
```

<AutoScreenshot name="infolists/layout/section/compact" alt="컴팩트 섹션" version="3.x" />

## 섹션 내에서 그리드 열 사용하기 {#using-grid-columns-within-a-section}

`columns()` 메서드를 사용하여 섹션 내에 쉽게 [그리드](grid)를 생성할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make('Heading')
    ->schema([
        // ...
    ])
    ->columns(2)
```
