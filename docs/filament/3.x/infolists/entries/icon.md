---
title: 아이콘 항목
---
# [인포리스트.엔트리] IconEntry

## 개요 {#overview}

아이콘 항목은 해당 내용을 나타내는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 렌더링합니다:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->icon(fn (string $state): string => match ($state) {
        'draft' => 'heroicon-o-pencil',
        'reviewing' => 'heroicon-o-clock',
        'published' => 'heroicon-o-check-circle',
    })
```

함수에서 `$state`는 항목의 값이며, `$record`를 사용하여 기본 Eloquent 레코드에 접근할 수 있습니다.

<AutoScreenshot name="infolists/entries/icon/simple" alt="아이콘 항목" version="3.x" />

## 색상 커스터마이징 {#customizing-the-color}

아이콘 항목은 동일한 문법을 사용하여 아이콘 색상 세트를 가질 수도 있습니다. 색상은 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'info',
        'reviewing' => 'warning',
        'published' => 'success',
        default => 'gray',
    })
```

함수에서 `$state`는 항목의 값이며, `$record`를 사용하여 기본 Eloquent 레코드에 접근할 수 있습니다.

<AutoScreenshot name="infolists/entries/icon/color" alt="색상이 적용된 아이콘 항목" version="3.x" />

## 크기 커스터마이징 {#customizing-the-size}

기본 아이콘 크기는 `IconEntrySize::Large`이지만, `IconEntrySize::ExtraSmall`, `IconEntrySize::Small`, `IconEntrySize::Medium`, `IconEntrySize::ExtraLarge`, `IconEntrySize::TwoExtraLarge` 중 하나로 크기를 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->size(IconEntry\IconEntrySize::Medium)
```

<AutoScreenshot name="infolists/entries/icon/medium" alt="중간 크기의 아이콘 항목" version="3.x" />

## 불리언 처리 {#handling-booleans}

아이콘 항목은 데이터베이스 항목의 내용이 true 또는 false일 때, `boolean()` 메서드를 사용하여 체크 또는 엑스 아이콘을 표시할 수 있습니다:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
```

> 모델 클래스의 이 컬럼이 이미 `bool` 또는 `boolean`으로 캐스팅되어 있다면, Filament가 이를 감지할 수 있으므로 `boolean()`을 수동으로 사용할 필요가 없습니다.

<AutoScreenshot name="infolists/entries/icon/boolean" alt="불리언을 표시하는 아이콘 항목" version="3.x" />

### 불리언 아이콘 커스터마이징 {#customizing-the-boolean-icons}

각 상태를 나타내는 아이콘을 커스터마이징할 수 있습니다. 아이콘은 Blade 컴포넌트의 이름입니다. 기본적으로 [Heroicons](https://heroicons.com)가 설치되어 있습니다:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
    ->trueIcon('heroicon-o-check-badge')
    ->falseIcon('heroicon-o-x-mark')
```

<AutoScreenshot name="infolists/entries/icon/boolean-icon" alt="커스텀 아이콘으로 불리언을 표시하는 아이콘 항목" version="3.x" />

### 불리언 색상 커스터마이징 {#customizing-the-boolean-colors}

각 상태를 나타내는 아이콘 색상을 커스터마이징할 수 있습니다. 색상은 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
    ->trueColor('info')
    ->falseColor('warning')
```

<AutoScreenshot name="infolists/entries/icon/boolean-color" alt="커스텀 색상으로 불리언을 표시하는 아이콘 항목" version="3.x" />