---
title: 반복 가능한 항목
---
# [인포리스트.엔트리] RepeatableEntry

## 개요 {#overview}

반복 가능한 항목은 배열이나 관계에 있는 항목들에 대해 일련의 항목 및 레이아웃 컴포넌트를 반복할 수 있게 해줍니다.

```php
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;

RepeatableEntry::make('comments')
    ->schema([
        TextEntry::make('author.name'),
        TextEntry::make('title'),
        TextEntry::make('content')
            ->columnSpan(2),
    ])
    ->columns(2)
```

보시다시피, 반복 가능한 항목에는 각 항목마다 반복되는 내장된 `schema()`가 있습니다.

<AutoScreenshot name="infolists/entries/repeatable/simple" alt="반복 가능한 항목" version="3.x" />

## 그리드 레이아웃 {#grid-layout}

`grid()` 메서드를 사용하여 반복 가능한 항목들을 열로 정렬할 수 있습니다:

```php
use Filament\Infolists\Components\RepeatableEntry;

RepeatableEntry::make('comments')
    ->schema([
        // ...
    ])
    ->grid(2)
```

이 메서드는 [grid](../layout/grid)의 `columns()` 메서드와 동일한 옵션을 허용합니다. 이를 통해 다양한 브레이크포인트에서 그리드 열의 개수를 반응형으로 커스터마이즈할 수 있습니다.

<AutoScreenshot name="infolists/entries/repeatable/grid" alt="그리드 레이아웃의 반복 가능한 항목" version="3.x" />

## 스타일이 적용된 컨테이너 제거 {#removing-the-styled-container}

기본적으로 반복 가능한 항목의 각 항목은 카드로 스타일링된 컨테이너에 감싸져 있습니다. `contained()`를 사용하여 스타일이 적용된 컨테이너를 제거할 수 있습니다:

```php
use Filament\Infolists\Components\RepeatableEntry;

RepeatableEntry::make('comments')
    ->schema([
        // ...
    ])
    ->contained(false)
```