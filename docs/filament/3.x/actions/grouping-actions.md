---
title: 액션 그룹화
---
# [액션] 액션 그룹화

## 개요 {#overview}

여러 액션을 `ActionGroup` 객체를 사용하여 드롭다운 메뉴로 그룹화할 수 있습니다. 그룹에는 여러 액션이나 다른 그룹을 포함할 수 있습니다:

```php
ActionGroup::make([
    Action::make('view'),
    Action::make('edit'),
    Action::make('delete'),
])
```

<AutoScreenshot name="actions/group/simple" alt="액션 그룹" version="3.x" />

이 페이지에서는 그룹의 트리거 버튼과 드롭다운의 모양을 커스터마이즈하는 방법에 대해 다룹니다.

## 그룹 트리거 스타일 커스터마이징 {#customizing-the-group-trigger-style}

드롭다운을 여는 버튼은 일반 액션과 동일한 방식으로 커스터마이즈할 수 있습니다. [트리거 버튼에 사용할 수 있는 모든 메서드](trigger-button)를 그룹 트리거 버튼에도 사용할 수 있습니다:

```php
use Filament\Support\Enums\ActionSize;

ActionGroup::make([
    // 액션 배열
])
    ->label('추가 작업')
    ->icon('heroicon-m-ellipsis-vertical')
    ->size(ActionSize::Small)
    ->color('primary')
    ->button()
```

<AutoScreenshot name="actions/group/customized" alt="커스텀 트리거 스타일의 액션 그룹" version="3.x" />

## 드롭다운 위치 설정하기 {#setting-the-placement-of-the-dropdown}

드롭다운은 `dropdownPlacement()` 메서드를 사용하여 트리거 버튼을 기준으로 위치를 지정할 수 있습니다:

```php
ActionGroup::make([
    // 액션 배열
])
    ->dropdownPlacement('top-start')
```

<AutoScreenshot name="actions/group/placement" alt="상단 위치 스타일의 액션 그룹" version="3.x" />

## 작업들 사이에 구분선 추가하기 {#adding-dividers-between-actions}

중첩된 `ActionGroup` 객체를 사용하여 작업 그룹 사이에 구분선을 추가할 수 있습니다:

```php
ActionGroup::make([
    ActionGroup::make([
        // 작업 배열
    ])->dropdown(false),
    // 작업 배열
])
```

`dropdown(false)` 메서드는 새로운 중첩 드롭다운 대신 상위 드롭다운 안에 작업들을 배치합니다.

<AutoScreenshot name="actions/group/nested" alt="구분선이 있는 중첩 작업 그룹" version="3.x" />

## 드롭다운의 너비 설정하기 {#setting-the-width-of-the-dropdown}

드롭다운의 너비는 `dropdownWidth()` 메서드를 사용하여 설정할 수 있습니다. 옵션은 [Tailwind의 max-width 스케일](https://tailwindcss.com/docs/max-width)에 해당합니다. 사용 가능한 옵션은 `ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`, `TwoExtraLarge`, `ThreeExtraLarge`, `FourExtraLarge`, `FiveExtraLarge`, `SixExtraLarge`, `SevenExtraLarge`입니다:

```php
use Filament\Support\Enums\MaxWidth;

ActionGroup::make([
    // 액션 배열
])
    ->dropdownWidth(MaxWidth::ExtraSmall)
```

## 드롭다운의 최대 높이 제어하기 {#controlling-the-maximum-height-of-the-dropdown}

드롭다운 내용은 `maxHeight()` 메서드를 사용하여 최대 높이를 지정할 수 있으며, 이로 인해 스크롤이 생깁니다. [CSS 길이](https://developer.mozilla.org/en-US/docs/Web/CSS/length)를 전달할 수 있습니다:

```php
ActionGroup::make([
    // 액션 배열
])
    ->maxHeight('400px')
```

## 드롭다운 오프셋 제어하기 {#controlling-the-dropdown-offset}

기본적으로 오프셋이 `8`로 설정되어 있지만, `dropdownOffset()` 메서드를 사용하여 드롭다운의 오프셋을 제어할 수 있습니다.

```php
ActionGroup::make([
    // 액션 배열
])
    ->dropdownOffset(16)
```
