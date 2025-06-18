---
title: Grid
---
# [폼.레이아웃] Grid
## 개요 {#overview}

Filament의 그리드 시스템을 사용하면 어떤 레이아웃 컴포넌트로도 반응형 다중 열 레이아웃을 만들 수 있습니다.

## 그리드 열 수를 반응형으로 설정하기 {#responsively-setting-the-number-of-grid-columns}

모든 레이아웃 컴포넌트에는 `columns()` 메서드가 있으며, 여러 가지 방법으로 사용할 수 있습니다:

- 정수 값을 전달할 수 있습니다. 예를 들어 `columns(2)`와 같이 사용합니다. 이 정수는 `lg` 브레이크포인트 이상에서 사용되는 열의 수를 의미합니다. 더 작은 기기에서는 항상 1개의 열만 사용됩니다.
- 배열을 전달할 수도 있습니다. 이때 키는 브레이크포인트, 값은 열의 수입니다. 예를 들어 `columns(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서 2열, 매우 큰 기기에서 4열 레이아웃을 만듭니다. 더 작은 기기의 기본 브레이크포인트는 1열을 사용하며, `default` 배열 키를 사용하면 이를 변경할 수 있습니다.

브레이크포인트(`sm`, `md`, `lg`, `xl`, `2xl`)는 Tailwind에서 정의되어 있으며, [Tailwind 문서](https://tailwindcss.com/docs/responsive-design#overview)에서 확인할 수 있습니다.

## 컴포넌트가 차지할 열의 수 제어하기 {#controlling-how-many-columns-a-component-should-span}

레이아웃 컴포넌트가 가질 열의 수를 지정하는 것 외에도, `columnSpan()` 메서드를 사용하여 컴포넌트가 부모 그리드 내에서 차지할 열의 수를 지정할 수 있습니다. 이 메서드는 정수 또는 브레이크포인트와 열 수의 배열을 인수로 받습니다:

- `columnSpan(2)`는 모든 브레이크포인트에서 컴포넌트가 최대 2개의 열을 차지하도록 만듭니다.
- `columnSpan(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서는 최대 2개의 열, 초대형 기기에서는 최대 4개의 열을 차지하도록 만듭니다. 더 작은 기기의 기본 브레이크포인트는 1개의 열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.
- `columnSpan('full')` 또는 `columnSpanFull()` 또는 `columnSpan(['default' => 'full'])`는 컴포넌트가 부모 그리드의 열 수와 상관없이 전체 너비를 차지하도록 만듭니다.

## 반응형 그리드 레이아웃 예시 {#an-example-of-a-responsive-grid-layout}

이 예시에서는 [섹션](section) 레이아웃 컴포넌트를 가진 폼이 있습니다. 모든 레이아웃 컴포넌트는 `columns()` 메서드를 지원하므로, 이를 사용해 섹션 내부에 반응형 그리드 레이아웃을 만들 수 있습니다.

`columns()`에 배열을 전달하는 이유는, 각기 다른 브레이크포인트마다 컬럼 수를 다르게 지정하고 싶기 때문입니다. `sm` [Tailwind 브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)보다 작은 기기에서는 1개의 컬럼(기본값)을 사용합니다. `sm` 브레이크포인트보다 큰 기기에서는 3개의 컬럼, `xl`보다 크면 6개의 컬럼, `2xl`보다 크면 8개의 컬럼을 사용합니다.

섹션 내부에는 [텍스트 입력](../fields/text-input)이 있습니다. 텍스트 입력은 폼 컴포넌트이며, 모든 폼 컴포넌트는 `columnSpan()` 메서드를 가지고 있으므로, 텍스트 입력이 몇 개의 컬럼을 차지할지 지정할 수 있습니다. `sm` 브레이크포인트보다 작은 기기에서는 1개의 컬럼(기본값), `sm`보다 크면 2개의 컬럼, `xl`보다 크면 3개의 컬럼, `2xl`보다 크면 4개의 컬럼을 차지하도록 설정합니다.

```php
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;

Section::make()
    ->columns([
        'sm' => 3,
        'xl' => 6,
        '2xl' => 8,
    ])
    ->schema([
        TextInput::make('name')
            ->columnSpan([
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ]),
        // ...
    ])
```

## 그리드 컴포넌트 {#grid-component}

모든 레이아웃 컴포넌트는 `columns()` 메서드를 지원하지만, 추가적으로 `Grid` 컴포넌트도 사용할 수 있습니다. 폼 스키마에 별도의 스타일 없이 명시적인 그리드 문법이 도움이 된다고 생각된다면, 이 컴포넌트가 유용할 수 있습니다. `columns()` 메서드를 사용하는 대신, 컬럼 구성을 직접 `Grid::make()`에 전달할 수 있습니다:

```php
use Filament\Forms\Components\Grid;

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

그리드에서 컴포넌트를 특정 열에서 시작하고 싶다면, `columnStart()` 메서드를 사용할 수 있습니다. 이 메서드는 정수 또는 브레이크포인트와 컴포넌트가 시작할 열을 지정하는 배열을 인자로 받습니다:

- `columnStart(2)`는 모든 브레이크포인트에서 컴포넌트를 2번째 열에서 시작하게 합니다.
- `columnStart(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서는 2번째 열, 초대형 기기에서는 4번째 열에서 컴포넌트를 시작하게 합니다. 더 작은 기기의 기본 브레이크포인트는 1번째 열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.

```php
use Filament\Forms\Components\Section;

Section::make()
    ->columns([
        'sm' => 3,
        'xl' => 6,
        '2xl' => 8,
    ])
    ->schema([
        TextInput::make('name')
            ->columnStart([
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ]),
        // ...
    ])
```

이 예시에서, 그리드는 작은 기기에서는 3열, 초대형 기기에서는 6열, 초초대형 기기에서는 8열로 구성됩니다. 텍스트 입력은 작은 기기에서는 2번째 열, 초대형 기기에서는 3번째 열, 초초대형 기기에서는 4번째 열에서 시작합니다. 이는 그리드의 열 개수와 상관없이 텍스트 입력이 항상 그리드의 중간에서 시작하도록 레이아웃을 구성하는 방식입니다.
