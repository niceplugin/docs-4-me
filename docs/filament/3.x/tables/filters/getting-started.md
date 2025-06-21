---
title: 시작하기
---
# [테이블.필터] 시작하기


## 개요 {#overview}

<LaracastsBanner
    title="테이블 필터"
    description="Laracasts에서 Filament로 빠른 Laravel 개발 시리즈를 시청하세요 - Filament 리소스 테이블에 필터를 추가하는 기본 방법을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/10"
    series="rapid-laravel-development"
/>

필터를 사용하면 데이터에 특정 제약 조건을 정의할 수 있으며, 사용자가 원하는 정보를 찾을 수 있도록 범위를 지정할 수 있습니다. 필터는 `$table->filters()` 메서드에 넣습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ]);
}
```

<AutoScreenshot name="tables/filters/simple" alt="필터가 있는 테이블" version="3.x" />

필터는 고유한 이름을 전달하여 정적 `make()` 메서드를 사용해 생성할 수 있습니다. 그런 다음, 필터의 범위를 적용하는 콜백을 `query()`에 전달해야 합니다:

```php
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

Filter::make('is_featured')
    ->query(fn (Builder $query): Builder => $query->where('is_featured', true))
```

## 사용 가능한 필터 {#available-filters}

기본적으로, `Filter::make()` 메서드를 사용하면 체크박스 폼 컴포넌트가 렌더링됩니다. 체크박스가 켜지면 `query()`가 활성화됩니다.

- [체크박스를 토글 버튼으로 교체](#using-a-toggle-button-instead-of-a-checkbox)할 수도 있습니다.
- [삼항 필터](ternary)를 사용하여 체크박스를 셀렉트 필드로 교체해 사용자가 3가지 상태(보통 "참", "거짓", "공백") 중에서 선택할 수 있도록 할 수 있습니다. 이는 nullable인 불리언 컬럼을 필터링할 때 유용합니다.
- [삭제됨 필터](ternary#filtering-soft-deletable-records)는 소프트 삭제 가능한 레코드를 필터링할 수 있는 미리 만들어진 삼항 필터입니다.
- [셀렉트 필터](select)를 사용하여 사용자가 옵션 목록에서 선택하고, 선택을 통해 필터링할 수 있습니다.
- [쿼리 빌더](query-builder)를 사용하여 사용자가 제약 조건을 조합해 복잡한 필터 세트를 만들 수 있는 고급 UI를 제공합니다.
- [커스텀 필터](custom)를 다른 폼 필드와 함께 만들어 원하는 대로 사용할 수 있습니다.

## 라벨 설정하기 {#setting-a-label}

기본적으로, 필터의 라벨(필터 폼에 표시됨)은 필터의 이름에서 생성됩니다. `label()` 메서드를 사용해 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->label('Featured')
```

선택적으로, `translateLabel()` 메서드를 사용하여 [라라벨의 로컬라이제이션 기능](/laravel/12.x/localization)으로 라벨을 자동 번역할 수 있습니다:

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->translateLabel() // `label(__('Is featured'))`와 동일
```

## 필터 폼 커스터마이즈하기 {#customizing-the-filter-form}

기본적으로, `Filter` 클래스로 필터를 생성하면 [체크박스 폼 컴포넌트](../../forms/fields/checkbox)가 렌더링됩니다. 체크박스가 체크되면 `query()` 함수가 테이블 쿼리에 적용되어 테이블의 레코드 범위가 지정됩니다. 체크박스가 해제되면 `query()` 함수가 테이블 쿼리에서 제거됩니다.

필터는 Filament의 폼 필드만으로 완전히 구성됩니다. 어떤 조합의 폼 필드도 렌더링할 수 있으며, 사용자는 이를 통해 테이블을 필터링할 수 있습니다.

### 체크박스 대신 토글 버튼 사용하기 {#using-a-toggle-button-instead-of-a-checkbox}

필터에 사용되는 폼 필드를 관리하는 가장 간단한 예시는 [체크박스](../../forms/fields/checkbox)를 [토글 버튼](../../forms/fields/toggle)으로 교체하는 것으로, `toggle()` 메서드를 사용합니다:

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->toggle()
```

<AutoScreenshot name="tables/filters/toggle" alt="토글 필터가 있는 테이블" version="3.x" />

### 기본적으로 필터 적용하기 {#applying-the-filter-by-default}

`default()` 메서드를 사용하여 필터가 기본적으로 활성화되도록 설정할 수 있습니다:

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->default()
```

### 내장 필터 폼 필드 커스터마이즈하기 {#customizing-the-built-in-filter-form-field}

체크박스, [토글](#using-a-toggle-button-instead-of-a-checkbox), [셀렉트](select) 중 어떤 것을 사용하든, `modifyFormFieldUsing()` 메서드를 사용해 필터에 사용되는 내장 폼 필드를 커스터마이즈할 수 있습니다. 이 메서드는 폼 필드 객체에 접근할 수 있는 `$field` 파라미터를 가진 함수를 받습니다:

```php
use Filament\Forms\Components\Checkbox;
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->modifyFormFieldUsing(fn (Checkbox $field) => $field->inline(false))
```

## 세션에 필터 유지하기 {#persist-filters-in-session}

테이블 필터를 사용자의 세션에 유지하려면, `persistFiltersInSession()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->persistFiltersInSession();
}
```

## 필터 지연 적용하기 {#deferring-filters}

필터 변경이 테이블에 바로 적용되지 않고, 사용자가 "적용" 버튼을 클릭할 때까지 지연시킬 수 있습니다. 이를 위해 `deferFilters()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->deferFilters();
}
```

### 필터 적용 액션 커스터마이즈하기 {#customizing-the-apply-filters-action}

필터를 지연 적용할 때, `filtersApplyAction()` 메서드를 사용해 "적용" 버튼을 커스터마이즈할 수 있습니다. [액션 트리거 버튼 커스터마이즈](../../actions/trigger-button)에 사용할 수 있는 모든 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersApplyAction(
            fn (Action $action) => $action
                ->link()
                ->label('Save filters to table'),
        );
}
```

## 필터 변경 시 레코드 선택 해제 {#deselecting-records-when-filters-change}

기본적으로, 필터가 변경되면 모든 레코드가 선택 해제됩니다. `deselectAllRecordsWhenFiltered(false)` 메서드를 사용하여 이 동작을 비활성화할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->deselectAllRecordsWhenFiltered(false);
}
```

## 기본 쿼리 수정하기 {#modifying-the-base-query}

기본적으로, `query()` 메서드에서 수행된 Eloquent 쿼리 수정은 범위가 지정된 `where()` 절 내에서 적용됩니다. 이는 쿼리가 `orWhere()`를 사용하는 다른 필터와 충돌하지 않도록 하기 위함입니다.

하지만, 이로 인해 `query()` 메서드를 사용해 글로벌 스코프 제거와 같은 쿼리의 다른 부분을 수정할 수 없습니다. 기본 쿼리를 직접 수정해야 하기 때문입니다.

기본 쿼리를 직접 수정하려면, 클로저에 기본 쿼리를 전달하는 `baseQuery()` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('trashed')
    // ...
    ->baseQuery(fn (Builder $query) => $query->withoutGlobalScopes([
        SoftDeletingScope::class,
    ]))
```

## 필터 트리거 액션 커스터마이즈하기 {#customizing-the-filters-trigger-action}

필터 트리거 버튼을 커스터마이즈하려면, 클로저를 반환하는 `filtersTriggerAction()` 메서드를 사용할 수 있습니다. [액션 트리거 버튼 커스터마이즈](../../actions/trigger-button)에 사용할 수 있는 모든 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersTriggerAction(
            fn (Action $action) => $action
                ->button()
                ->label('Filter'),
        );
}
```

<AutoScreenshot name="tables/filters/custom-trigger-action" alt="커스텀 필터 트리거 액션이 있는 테이블" version="3.x" />

## 테이블 필터 유틸리티 주입 {#table-filter-utility-injection}

필터를 구성하는 데 사용되는 대부분의 메서드는 하드코딩된 값 대신 함수를 파라미터로 받습니다:

```php
use App\Models\Author;
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->options(fn (): array => Author::query()->pluck('name', 'id')->all())
```

이것만으로도 다양한 커스터마이즈가 가능합니다.

이 패키지는 또한 이러한 함수 내부에서 사용할 수 있도록 다양한 유틸리티를 파라미터로 주입할 수 있습니다. 함수 인자를 받는 모든 커스터마이즈 메서드는 유틸리티를 주입할 수 있습니다.

이 주입된 유틸리티는 특정 파라미터 이름을 사용해야 합니다. 그렇지 않으면 Filament가 무엇을 주입해야 하는지 알 수 없습니다.

### 현재 필터 인스턴스 주입하기 {#injecting-the-current-filter-instance}

현재 필터 인스턴스에 접근하려면, `$filter` 파라미터를 정의하세요:

```php
use Filament\Tables\Filters\BaseFilter;

function (BaseFilter $filter) {
    // ...
}
```

### 현재 Livewire 컴포넌트 인스턴스 주입하기 {#injecting-the-current-livewire-component-instance}

테이블이 속한 현재 Livewire 컴포넌트 인스턴스에 접근하려면, `$livewire` 파라미터를 정의하세요:

```php
use Filament\Tables\Contracts\HasTable;

function (HasTable $livewire) {
    // ...
}
```

### 현재 테이블 인스턴스 주입하기 {#injecting-the-current-table-instance}

필터가 속한 현재 테이블 구성 인스턴스에 접근하려면, `$table` 파라미터를 정의하세요:

```php
use Filament\Tables\Table;

function (Table $table) {
    // ...
}
```

### 여러 유틸리티 주입하기 {#injecting-multiple-utilities}

파라미터는 리플렉션을 사용해 동적으로 주입되므로, 여러 파라미터를 어떤 순서로든 조합할 수 있습니다:

```php
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

function (HasTable $livewire, Table $table) {
    // ...
}
```

### 라라벨 컨테이너에서 의존성 주입하기 {#injecting-dependencies-from-laravels-container}

유틸리티와 함께 라라벨 컨테이너에서 어떤 것이든 평소처럼 주입할 수 있습니다:

```php
use Filament\Tables\Table;
use Illuminate\Http\Request;

function (Request $request, Table $table) {
    // ...
}
```
