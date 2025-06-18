---
title: IconColumn
---
# [테이블.컬럼] IconColumn

## 개요 {#overview}

IconColumn은 해당 내용물을 나타내는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 렌더링합니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('status')
    ->icon(fn (string $state): string => match ($state) {
        'draft' => 'heroicon-o-pencil',
        'reviewing' => 'heroicon-o-clock',
        'published' => 'heroicon-o-check-circle',
    })
```

이 함수에서 `$state`는 컬럼의 값이며, `$record`를 사용하여 해당 Eloquent 레코드에 접근할 수 있습니다.

<AutoScreenshot name="tables/columns/icon/simple" alt="IconColumn" version="3.x" />

## 색상 사용자 지정 {#customizing-the-color}

IconColumn은 동일한 문법을 사용하여 아이콘 색상도 지정할 수 있습니다. 색상은 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('status')
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'info',
        'reviewing' => 'warning',
        'published' => 'success',
        default => 'gray',
    })
```

이 함수에서 `$state`는 컬럼의 값이며, `$record`를 사용하여 해당 Eloquent 레코드에 접근할 수 있습니다.

<AutoScreenshot name="tables/columns/icon/color" alt="색상이 적용된 IconColumn" version="3.x" />

## 크기 커스터마이징 {#customizing-the-size}

기본 아이콘 크기는 `IconColumnSize::Large`이지만, `IconColumnSize::ExtraSmall`, `IconColumnSize::Small`, `IconColumnSize::Medium`, `IconColumnSize::ExtraLarge`, `IconColumnSize::TwoExtraLarge` 중 하나로 크기를 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('status')
    ->size(IconColumn\IconColumnSize::Medium)
```

<AutoScreenshot name="tables/columns/icon/medium" alt="중간 크기의 IconColumn" version="3.x" />

## 불리언 처리 {#handling-booleans}

IconColumn은 `boolean()` 메서드를 사용하여 데이터베이스 컬럼의 값이 true 또는 false인 경우 체크 또는 크로스 아이콘을 표시할 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_featured')
    ->boolean()
```

> 모델 클래스에서 이 컬럼이 이미 `bool` 또는 `boolean`으로 캐스팅되어 있다면, Filament가 이를 자동으로 감지하므로 `boolean()`을 수동으로 사용할 필요가 없습니다.

<AutoScreenshot name="tables/columns/icon/boolean" alt="불리언을 표시하는 IconColumn" version="3.x" />

### 불리언 아이콘 커스터마이징 {#customizing-the-boolean-icons}

각 상태를 나타내는 아이콘을 커스터마이즈할 수 있습니다. 아이콘은 존재하는 Blade 컴포넌트의 이름입니다. 기본적으로 [Heroicons](https://heroicons.com)이 설치되어 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_featured')
    ->boolean()
    ->trueIcon('heroicon-o-check-badge')
    ->falseIcon('heroicon-o-x-mark')
```

<AutoScreenshot name="tables/columns/icon/boolean-icon" alt="커스텀 아이콘으로 불리언을 표시하는 IconColumn" version="3.x" />

### 불리언 색상 커스터마이징 {#customizing-the-boolean-colors}

각 상태를 나타내는 아이콘 색상을 커스터마이즈할 수 있습니다. 색상은 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_featured')
    ->boolean()
    ->trueColor('info')
    ->falseColor('warning')
```

<AutoScreenshot name="tables/columns/icon/boolean-color" alt="커스텀 색상으로 불리언을 표시하는 IconColumn" version="3.x" />

## 여러 아이콘 감싸기 {#wrapping-multiple-icons}

여러 아이콘을 표시할 때, 한 줄에 모두 들어가지 않으면 `wrap()`을 사용하여 감쌀 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('icon')
    ->wrap()
```

참고: 감싸기의 "너비"는 컬럼 라벨에 의해 영향을 받으므로, 더 촘촘하게 감싸고 싶다면 더 짧거나 숨겨진 라벨을 사용해야 할 수 있습니다.

