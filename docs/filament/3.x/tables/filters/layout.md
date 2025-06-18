---
title: 필터 레이아웃
---
# [테이블.필터] 필터 레이아웃

## 필터를 그리드 열에 배치하기 {#positioning-filters-into-grid-columns}

필터가 차지할 수 있는 열의 수를 변경하려면 `filtersFormColumns()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersFormColumns(3);
}
```

## 필터 드롭다운의 너비 제어하기 {#controlling-the-width-of-the-filters-dropdown}

드롭다운의 너비를 커스터마이즈하려면 `filtersFormWidth()` 메서드를 사용하고, 원하는 너비를 지정할 수 있습니다. 지정 가능한 값은 `ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`, `TwoExtraLarge`, `ThreeExtraLarge`, `FourExtraLarge`, `FiveExtraLarge`, `SixExtraLarge`, `SevenExtraLarge`입니다. 기본값은 `ExtraSmall`입니다:

```php
use Filament\Support\Enums\MaxWidth;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersFormWidth(MaxWidth::FourExtraLarge);
}
```

## 필터 드롭다운의 최대 높이 제어하기 {#controlling-the-maximum-height-of-the-filters-dropdown}

필터 드롭다운의 내용에 최대 높이를 추가하여 스크롤이 가능하도록 하려면, [CSS 길이](https://developer.mozilla.org/en-US/docs/Web/CSS/length)를 인자로 `filtersFormMaxHeight()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersFormMaxHeight('400px');
}
```

## 모달에서 필터 표시하기 {#displaying-filters-in-a-modal}

필터를 드롭다운 대신 모달에서 렌더링하려면 다음과 같이 사용할 수 있습니다:

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::Modal);
}
```

[트리거 액션 API](getting-started#customizing-the-filters-trigger-action)를 사용하여 [모달을 커스터마이즈](../actions/modals)할 수 있으며, [slideOver()를 사용하는 것](../actions/modals#using-a-slide-over-instead-of-a-modal)도 가능합니다.

## 테이블 내용 위에 필터 표시하기 {#displaying-filters-above-the-table-content}

필터를 드롭다운 대신 테이블 내용 위에 렌더링하려면 다음과 같이 사용할 수 있습니다:

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::AboveContent);
}
```

<AutoScreenshot name="tables/filters/above-content" alt="테이블 내용 위에 필터가 있는 모습" version="3.x" />

### 테이블 내용 위의 필터를 접을 수 있도록 허용하기 {#allowing-filters-above-the-table-content-to-be-collapsed}

테이블 내용 위의 필터를 접을 수 있도록 허용하려면 다음과 같이 사용할 수 있습니다:

```php
use Filament\Tables\Enums\FiltersLayout;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::AboveContentCollapsible);
}
```

## 테이블 내용 아래에 필터 표시하기 {#displaying-filters-below-the-table-content}

필터를 드롭다운 대신 테이블 내용 아래에 렌더링하려면 다음과 같이 사용할 수 있습니다:

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::BelowContent);
}
```

<AutoScreenshot name="tables/filters/below-content" alt="테이블 내용 아래에 필터가 있는 모습" version="3.x" />

## 필터 인디케이터 숨기기 {#hiding-the-filter-indicators}

테이블 위에 활성화된 필터 인디케이터를 숨기려면 `hiddenFilterIndicators()`를 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->hiddenFilterIndicators();
}
```

## 필터 폼 스키마 커스터마이징 {#customizing-the-filter-form-schema}

필터 폼 전체의 [폼 스키마](../../forms/layout/getting-started)를 한 번에 커스터마이징하여, 원하는 레이아웃으로 필터를 재배치하고, 폼에서 사용할 수 있는 [레이아웃 컴포넌트](../../forms/layout/getting-started)를 사용할 수 있습니다. 이를 위해 `filterFormSchema()` 메서드를 사용하며, 정의된 `$filters` 배열을 전달받는 클로저 함수를 전달할 수 있습니다:

```php
use Filament\Forms\Components\Section;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            Filter::make('is_featured'),
            Filter::make('published_at'),
            Filter::make('author'),
        ])
        ->filtersFormColumns(2)
        ->filtersFormSchema(fn (array $filters): array => [
            Section::make('Visibility')
                ->description('이 필터들은 테이블의 레코드 표시 여부에 영향을 줍니다.')
                ->schema([
                    $filters['is_featured'],
                    $filters['published_at'],
                ])
                    ->columns(2)
                ->columnSpanFull(),
            $filters['author'],
        ]);
}
```

이 예시에서는 두 개의 필터를 [섹션](../../forms/layout/section) 컴포넌트 안에 넣고, `columns()` 메서드를 사용하여 해당 섹션이 두 개의 컬럼을 가지도록 지정했습니다. 또한 `columnSpanFull()` 메서드를 사용하여 섹션이 필터 폼의 전체 너비(2 컬럼)를 차지하도록 했습니다. 각 필터는 `$filters` 배열에서 필터의 이름을 키로 사용하여 폼 스키마에 삽입했습니다.
