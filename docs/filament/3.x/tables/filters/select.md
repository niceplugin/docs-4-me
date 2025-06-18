---
title: SelectFilter
---
# [테이블.필터] SelectFilter


## 개요 {#overview}

종종 [선택 필드](../../forms/fields/select)를 체크박스 대신 사용하고 싶을 때가 있습니다. 특히 사용자가 선택할 수 있는 미리 정의된 옵션 집합을 기반으로 컬럼을 필터링하려는 경우에 그렇습니다. 이를 위해 `SelectFilter` 클래스를 사용하여 필터를 생성할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

필터에 전달되는 `options()`는 [선택 필드](../../forms/fields/select)에 전달되는 것과 동일합니다.

## SelectFilter에서 사용되는 컬럼 커스터마이징하기 {#customizing-the-column-used-by-a-select-filter}

SelectFilter는 커스텀 `query()` 메서드를 필요로 하지 않습니다. 쿼리에 사용되는 컬럼명은 필터의 이름과 동일합니다. 이를 커스터마이즈하려면 `attribute()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->attribute('status_id')
```

## 다중 선택 필터 {#multi-select-filters}

이 기능을 사용하면 사용자가 여러 옵션을 선택하여 테이블에 필터를 적용할 수 있습니다. 예를 들어, 상태 필터는 사용자가 몇 가지 상태 옵션 중에서 선택하여 테이블을 필터링할 수 있도록 합니다. 사용자가 여러 옵션을 선택하면, 테이블은 선택된 옵션 중 하나라도 일치하는 레코드만 표시하게 됩니다. 이러한 동작은 `multiple()` 메서드를 사용하여 활성화할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->multiple()
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

## 관계 SelectFilter {#relationship-select-filters}

SelectFilter는 관계를 기반으로 자동으로 값을 채울 수도 있습니다. 예를 들어, 테이블에 `author` 관계와 `name` 컬럼이 있다면, `relationship()`을 사용하여 특정 저자에 속한 레코드만 필터링할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name')
```

### 선택 필터 관계 옵션 미리 불러오기 {#preloading-the-select-filter-relationship-options}

페이지가 로드될 때 데이터베이스에서 검색 가능한 옵션을 미리 불러오고 싶다면, 사용자가 검색할 때가 아니라 `preload()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name')
    ->searchable()
    ->preload()
```

### 선택 필터 관계 쿼리 커스터마이징하기 {#customizing-the-select-filter-relationship-query}

옵션을 가져오는 데이터베이스 쿼리는 `relationship()` 메서드의 세 번째 매개변수를 사용하여 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;

SelectFilter::make('author')
    ->relationship('author', 'name', fn (Builder $query) => $query->withTrashed())
```

### 선택 필터 옵션 검색하기 {#searching-select-filter-options}

여러 옵션에 더 쉽게 접근할 수 있도록 `searchable()` 메서드를 사용하여 검색 입력을 활성화할 수 있습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name')
    ->searchable()
```

## 플레이스홀더 선택 비활성화 {#disable-placeholder-selection}

플레이스홀더(null 옵션)를 제거하여, 필터가 비활성화되지 않고 모든 옵션이 적용되도록 하려면 `selectablePlaceholder()` 메서드를 사용하세요:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => '초안',
        'reviewing' => '검토 중',
        'published' => '게시됨',
    ])
    ->default('draft')
    ->selectablePlaceholder(false)
```

## 기본적으로 선택 필터 적용하기 {#applying-select-filters-by-default}

`default()` 메서드를 사용하여 선택 필터를 기본적으로 활성화할 수 있습니다. 단일 선택 필터를 사용하는 경우, `default()` 메서드는 하나의 옵션 값을 받습니다. `multiple()` 선택 필터를 사용하는 경우, `default()` 메서드는 옵션 값들의 배열을 받습니다:

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->multiple()
    ->default(['draft', 'reviewing'])
```

