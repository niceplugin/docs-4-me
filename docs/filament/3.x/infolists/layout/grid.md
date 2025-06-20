---
title: 그리드
---
# [인포리스트.레이아웃] Grid
## 개요 {#overview}

Filament의 그리드 시스템을 사용하면 모든 레이아웃 컴포넌트를 이용해 반응형 다중 열 레이아웃을 만들 수 있습니다.

## 반응형으로 그리드 열 수 설정하기 {#responsively-setting-the-number-of-grid-columns}

모든 레이아웃 컴포넌트에는 여러 가지 방법으로 사용할 수 있는 `columns()` 메서드가 있습니다:

- `columns(2)`와 같이 정수를 전달할 수 있습니다. 이 정수는 `lg` 브레이크포인트 이상에서 사용되는 열의 수입니다. 더 작은 기기에서는 1개의 열만 사용됩니다.
- 배열을 전달할 수도 있는데, 이때 키는 브레이크포인트이고 값은 열의 수입니다. 예를 들어, `columns(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서 2열, 매우 큰 기기에서 4열 레이아웃을 만듭니다. 더 작은 기기의 기본 브레이크포인트는 1열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.

브레이크포인트(`sm`, `md`, `lg`, `xl`, `2xl`)는 Tailwind에서 정의되어 있으며, [Tailwind 문서](https://tailwindcss.com/docs/responsive-design#overview)에서 확인할 수 있습니다.

## 컴포넌트가 차지할 열 수 제어하기 {#controlling-how-many-columns-a-component-should-span}

레이아웃 컴포넌트가 가질 열의 수를 지정하는 것 외에도, `columnSpan()` 메서드를 사용하여 부모 그리드 내에서 컴포넌트가 차지할 열의 수를 지정할 수 있습니다. 이 메서드는 정수 또는 브레이크포인트와 열 수의 배열을 받을 수 있습니다:

- `columnSpan(2)`는 모든 브레이크포인트에서 컴포넌트가 최대 2열을 차지하게 합니다.
- `columnSpan(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서 최대 2열, 매우 큰 기기에서 최대 4열을 차지하게 합니다. 더 작은 기기의 기본 브레이크포인트는 1열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.
- `columnSpan('full')` 또는 `columnSpanFull()` 또는 `columnSpan(['default' => 'full'])`는 컴포넌트가 부모 그리드의 열 수와 상관없이 전체 너비를 차지하게 합니다.

## 반응형 그리드 레이아웃 예시 {#an-example-of-a-responsive-grid-layout}

이 예시에서는 [section](section) 레이아웃 컴포넌트가 있는 infolist가 있습니다. 모든 레이아웃 컴포넌트가 `columns()` 메서드를 지원하므로, 이를 사용해 section 내부에 반응형 그리드 레이아웃을 만들 수 있습니다.

`columns()`에 배열을 전달하는데, 이는 브레이크포인트마다 다른 열 수를 지정하고 싶기 때문입니다. `sm` [Tailwind 브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)보다 작은 기기에서는 1열(기본값)을 사용합니다. `sm` 브레이크포인트보다 큰 기기에서는 3열, `xl` 브레이크포인트보다 큰 기기에서는 6열, `2xl` 브레이크포인트보다 큰 기기에서는 8열을 사용합니다.

section 내부에는 [텍스트 엔트리](../entries/text)가 있습니다. 텍스트 엔트리는 infolist 컴포넌트이며, 모든 폼 컴포넌트는 `columnSpan()` 메서드를 가지고 있으므로, 이를 사용해 텍스트 엔트리가 차지할 열의 수를 지정할 수 있습니다. `sm` 브레이크포인트보다 작은 기기에서는 1열(기본값), `sm` 브레이크포인트보다 큰 기기에서는 2열, `xl` 브레이크포인트보다 큰 기기에서는 3열, `2xl` 브레이크포인트보다 큰 기기에서는 4열을 차지하게 합니다.

```php
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;

Section::make()
    ->columns([
        'sm' => 3,
        'xl' => 6,
        '2xl' => 8,
    ])
    ->schema([
        TextEntry::make('name')
            ->columnSpan([
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ]),
        // ...
    ])
```

## 그리드 컴포넌트 {#grid-component}

모든 레이아웃 컴포넌트가 `columns()` 메서드를 지원하지만, 추가적으로 `Grid` 컴포넌트도 사용할 수 있습니다. 폼 스키마에 별도의 스타일링 없이 명시적인 그리드 문법이 도움이 된다고 생각된다면 유용할 수 있습니다. `columns()` 메서드 대신, 열 구성을 `Grid::make()`에 직접 전달할 수 있습니다:

```php
use Filament\Infolists\Components\Grid;

Grid::make([
    'default' => 1,
    'sm' => 2,
    'md' => 3,
    'lg' => 4,
    'xl' => 6,
    '2xl' => 8,
])
    ->schema([
        // ...
    ])
```

## 그리드에서 컴포넌트의 시작 열 설정하기 {#setting-the-starting-column-of-a-component-in-a-grid}

그리드에서 컴포넌트를 특정 열에서 시작하고 싶다면, `columnStart()` 메서드를 사용할 수 있습니다. 이 메서드는 정수 또는 브레이크포인트와 시작 열의 배열을 받을 수 있습니다:

- `columnStart(2)`는 모든 브레이크포인트에서 컴포넌트가 2번째 열에서 시작하게 합니다.
- `columnStart(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서 2번째 열, 매우 큰 기기에서 4번째 열에서 시작하게 합니다. 더 작은 기기의 기본 브레이크포인트는 1열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.

```php
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\TextEntry;

Grid::make()
    ->columns([
        'sm' => 3,
        'xl' => 6,
        '2xl' => 8,
    ])
    ->schema([
        TextEntry::make('name')
            ->columnStart([
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ]),
        // ...
    ])
```

이 예시에서, 그리드는 작은 기기에서 3열, 매우 큰 기기에서 6열, 매우 매우 큰 기기에서 8열을 가집니다. 텍스트 엔트리는 작은 기기에서 2번째 열, 매우 큰 기기에서 3번째 열, 매우 매우 큰 기기에서 4번째 열에서 시작합니다. 이는 그리드가 몇 열이든 상관없이 텍스트 엔트리가 항상 그리드의 중간에서 시작하는 레이아웃을 만드는 것과 같습니다.
