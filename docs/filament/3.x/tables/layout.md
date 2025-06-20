---
title: 레이아웃
---
# [테이블] 레이아웃

## 기존 테이블 레이아웃의 문제점 {#the-problem-with-traditional-table-layouts}

기존의 테이블은 반응형이 좋지 않기로 악명이 높습니다. 모바일에서는 가로로 긴 콘텐츠를 렌더링할 때 유연성이 제한적입니다:

- 사용자가 더 많은 테이블 콘텐츠를 보기 위해 가로로 스크롤할 수 있도록 허용
- 작은 기기에서는 중요하지 않은 컬럼을 숨김

이 두 가지 모두 Filament에서 가능합니다. 테이블은 어차피 넘칠 경우 자동으로 가로 스크롤이 가능하며, 브라우저의 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에 따라 컬럼을 표시하거나 숨길 수 있습니다. 이를 위해 `visibleFrom()` 또는 `hiddenFrom()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('slug')
    ->visibleFrom('md')
```

이 방법도 괜찮지만, 여전히 명백한 문제가 있습니다 - **모바일에서는 사용자가 한 번에 테이블 행의 많은 정보를 볼 수 없습니다(스크롤 없이)**.

다행히도, Filament는 HTML이나 CSS를 직접 다루지 않고도 반응형 테이블 인터페이스를 구축할 수 있게 해줍니다. 이러한 레이아웃을 통해 각 반응형 브레이크포인트에서 테이블 행에 콘텐츠가 정확히 어디에 나타날지 정의할 수 있습니다.

<AutoScreenshot name="tables/layout/demo" alt="반응형 레이아웃이 적용된 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/demo/mobile" alt="모바일에서 반응형 레이아웃이 적용된 테이블" version="3.x" />

## 모바일에서 컬럼을 쌓아올리기 허용 {#allowing-columns-to-stack-on-mobile}

`Split` 컴포넌트를 소개해보겠습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    TextColumn::make('email'),
])
```

<AutoScreenshot name="tables/layout/split" alt="Split 레이아웃이 적용된 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/split/mobile" alt="모바일에서 Split 레이아웃이 적용된 테이블" version="3.x" />

`Split` 컴포넌트는 컬럼을 감싸 모바일에서 쌓아올릴 수 있도록 해줍니다.

기본적으로 split 내의 컬럼들은 항상 나란히 표시됩니다. 하지만 이 동작이 시작되는 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)를 `from()`으로 지정할 수 있습니다. 이 지점 이전에는 컬럼이 위아래로 쌓입니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    TextColumn::make('email'),
])->from('md')
```

이 예시에서는 컬럼들이 `md` [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview) 이상의 기기에서만 가로로 나란히 표시됩니다:

<AutoScreenshot name="tables/layout/split-desktop" alt="데스크톱에서 Split 레이아웃이 적용된 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/split-desktop/mobile" alt="모바일에서 쌓인 레이아웃이 적용된 테이블" version="3.x" />

### 컬럼이 공백을 만들지 않도록 방지하기 {#preventing-a-column-from-creating-whitespace}

Split은 테이블 컬럼처럼 각 컬럼이 비례적으로 분리되도록 자동으로 공백을 조정합니다. `grow(false)`를 사용하여 이를 방지할 수 있습니다. 이 예시에서는 아바타 이미지가 이름 컬럼에 딱 붙어 있도록 합니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular()
        ->grow(false),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    TextColumn::make('email'),
])
```

`grow()`가 허용된 다른 컬럼들은 새로 확보된 공간을 차지하도록 조정됩니다:

<AutoScreenshot name="tables/layout/grow-disabled" alt="grow되지 않는 컬럼이 있는 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/grow-disabled/mobile" alt="모바일에서 grow되지 않는 컬럼이 있는 테이블" version="3.x" />

### Split 내에서 쌓기 {#stacking-within-a-split}

Split 내부에서 여러 컬럼을 수직으로 쌓을 수 있습니다. 이를 통해 데스크톱에서 더 적은 컬럼 안에 더 많은 데이터를 표시할 수 있습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    Stack::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ]),
])
```

<AutoScreenshot name="tables/layout/stack" alt="Stack이 적용된 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/stack/mobile" alt="모바일에서 Stack이 적용된 테이블" version="3.x" />

#### 모바일에서 Stack 숨기기 {#hiding-a-stack-on-mobile}

개별 컬럼과 마찬가지로, 브라우저의 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에 따라 stack을 숨길 수 있습니다. 이를 위해 `visibleFrom()` 메서드를 사용할 수 있습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    Stack::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])->visibleFrom('md'),
])
```

<AutoScreenshot name="tables/layout/stack-hidden-on-mobile" alt="Stack이 적용된 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/stack-hidden-on-mobile/mobile" alt="모바일에서 Stack이 없는 테이블" version="3.x" />

#### Stack 내 콘텐츠 정렬하기 {#aligning-stacked-content}

기본적으로 stack 내의 컬럼은 시작점에 정렬됩니다. stack 내 컬럼을 `Alignment::Center` 또는 `Alignment::End`로 정렬할 수 있습니다:

```php
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    Stack::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone')
            ->grow(false),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope')
            ->grow(false),
    ])
        ->alignment(Alignment::End)
        ->visibleFrom('md'),
])
```

stack 내 컬럼에 `grow(false)`가 설정되어 있어야 합니다. 그렇지 않으면 컬럼이 stack의 전체 너비를 채우며, stack의 정렬 설정이 아닌 각 컬럼의 정렬 설정을 따르게 됩니다.

<AutoScreenshot name="tables/layout/stack-aligned-right" alt="오른쪽 정렬된 Stack이 있는 테이블" version="3.x" />

#### Stack 내 콘텐츠 간격 조정하기 {#spacing-stacked-content}

기본적으로 stack 내 콘텐츠는 컬럼 간에 수직 패딩이 없습니다. `space()` 메서드를 사용해 패딩을 추가할 수 있으며, `1`, `2`, `3` 중 하나를 받아 [Tailwind의 spacing scale](https://tailwindcss.com/docs/space)에 대응합니다:

```php
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;

Stack::make([
    TextColumn::make('phone')
        ->icon('heroicon-m-phone'),
    TextColumn::make('email')
        ->icon('heroicon-m-envelope'),
])->space(1)
```

## 그리드를 사용한 컬럼 너비 제어 {#controlling-column-width-using-a-grid}

때로는 `Split`을 사용할 때 컬럼에 많은 콘텐츠가 있으면 너비가 일관되지 않을 수 있습니다. 이는 내부적으로 Flexbox를 사용하고 각 행이 콘텐츠에 할당되는 공간을 개별적으로 제어하기 때문입니다.

대신, CSS Grid Layout을 사용하는 `Grid` 레이아웃을 사용하여 컬럼 너비를 제어할 수 있습니다:

```php
use Filament\Tables\Columns\Layout\Grid;
use Filament\Tables\Columns\TextColumn;

Grid::make([
    'lg' => 2,
])
    ->schema([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])
```

이 컬럼들은 `lg` [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)부터 항상 그리드 내에서 동일한 너비를 차지합니다.

다른 브레이크포인트에서 그리드 내 컬럼 수를 커스터마이즈할 수도 있습니다:

```php
use Filament\Tables\Columns\Layout\Grid;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;

Grid::make([
    'lg' => 2,
    '2xl' => 4,
])
    ->schema([
        Stack::make([
            TextColumn::make('name'),
            TextColumn::make('job'),
        ]),
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])
```

그리고 각 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에서 각 컴포넌트가 차지할 그리드 컬럼 수까지 제어할 수 있습니다:

```php
use Filament\Tables\Columns\Layout\Grid;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;

Grid::make([
    'lg' => 2,
    '2xl' => 5,
])
    ->schema([
        Stack::make([
            TextColumn::make('name'),
            TextColumn::make('job'),
        ])->columnSpan([
            'lg' => 'full',
            '2xl' => 2,
        ]),
        TextColumn::make('phone')
            ->icon('heroicon-m-phone')
            ->columnSpan([
                '2xl' => 2,
            ]),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])
```

## 접을 수 있는 콘텐츠 {#collapsible-content}

split이나 stack과 같은 컬럼 레이아웃을 사용할 때, 접을 수 있는 콘텐츠도 추가할 수 있습니다. 이는 모든 데이터를 한 번에 테이블에 표시하고 싶지 않지만, 사용자가 필요할 때 접근할 수 있도록 하고 싶을 때 매우 유용합니다(다른 페이지로 이동하지 않고).

Split과 stack 컴포넌트는 `collapsible()`로 만들 수 있으며, 접을 수 있는 콘텐츠를 나머지와 구분하기 위해 미리 스타일된 배경색과 테두리 반경을 제공하는 전용 `Panel` 컴포넌트도 있습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Panel;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

[
    Split::make([
        ImageColumn::make('avatar')
            ->circular(),
        TextColumn::make('name')
            ->weight(FontWeight::Bold)
            ->searchable()
            ->sortable(),
    ]),
    Panel::make([
        Stack::make([
            TextColumn::make('phone')
                ->icon('heroicon-m-phone'),
            TextColumn::make('email')
                ->icon('heroicon-m-envelope'),
        ]),
    ])->collapsible(),
]
```

`collapsed(false)` 메서드를 사용하여 기본적으로 패널을 확장할 수 있습니다:

```php
use Filament\Tables\Columns\Layout\Panel;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\TextColumn;

Panel::make([
    Split::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])->from('md'),
])->collapsed(false)
```

<AutoScreenshot name="tables/layout/collapsible" alt="접을 수 있는 콘텐츠가 있는 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/collapsible/mobile" alt="모바일에서 접을 수 있는 콘텐츠가 있는 테이블" version="3.x" />

## 레코드를 그리드로 배열하기 {#arranging-records-into-a-grid}

때로는 데이터가 리스트보다 그리드 형식에 더 잘 맞을 수 있습니다. Filament도 이를 지원합니다!

간단히 `$table->contentGrid()` 메서드를 사용하세요:

```php
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Stack::make([
                // 컬럼들
            ]),
        ])
        ->contentGrid([
            'md' => 2,
            'xl' => 3,
        ]);
}
```

이 예시에서는 행이 그리드로 표시됩니다:

- 모바일에서는 1개의 컬럼으로만 표시됩니다.
- `md` [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)부터 2개의 컬럼으로 표시됩니다.
- `xl` [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)부터는 3개의 컬럼으로 표시됩니다.

이 설정은 완전히 커스터마이즈할 수 있으며, `sm`부터 `2xl`까지의 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에서 `1`~`12`개의 컬럼을 지정할 수 있습니다.

<AutoScreenshot name="tables/layout/grid" alt="그리드 레이아웃이 적용된 테이블" version="3.x" />

<AutoScreenshot name="tables/layout/grid/mobile" alt="모바일에서 그리드 레이아웃이 적용된 테이블" version="3.x" />

## 커스텀 HTML {#custom-html}

`View` 컴포넌트를 사용하여 테이블에 커스텀 HTML을 추가할 수 있습니다. `collapsible()`로도 만들 수 있습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\View;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

[
    Split::make([
        ImageColumn::make('avatar')
            ->circular(),
        TextColumn::make('name')
            ->weight(FontWeight::Bold)
            ->searchable()
            ->sortable(),
    ]),
    View::make('users.table.collapsible-row-content')
        ->collapsible(),
]
```

이제 `/resources/views/users/table/collapsible-row-content.blade.php` 파일을 생성하고 HTML을 추가하세요. `$getRecord()`를 사용해 테이블 레코드에 접근할 수 있습니다:

```blade
<p class="px-4 py-3 bg-gray-100 rounded-lg">
    <span class="font-medium">
        이메일 주소:
    </span>

    <span>
        {{ $getRecord()->email }}
    </span>
</p>
```

### 다른 컴포넌트 임베딩하기 {#embedding-other-components}

`components()` 메서드에 컬럼이나 다른 레이아웃 컴포넌트를 전달할 수도 있습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\View;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

[
    Split::make([
        ImageColumn::make('avatar')
            ->circular(),
        TextColumn::make('name')
            ->weight(FontWeight::Bold)
            ->searchable()
            ->sortable(),
    ]),
    View::make('users.table.collapsible-row-content')
        ->components([
            TextColumn::make('email')
                ->icon('heroicon-m-envelope'),
        ])
        ->collapsible(),
]
```

이제 Blade 파일에서 컴포넌트를 렌더링하세요:

```blade
<div class="px-4 py-3 bg-gray-100 rounded-lg">
    <x-filament-tables::columns.layout
        :components="$getComponents()"
        :record="$getRecord()"
        :record-key="$recordKey"
    />
</div>
```
