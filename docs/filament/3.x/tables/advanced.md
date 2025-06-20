---
title: 고급
---
# [테이블] 고급

## 페이지네이션 {#pagination}

### 페이지네이션 비활성화 {#disabling-pagination}

기본적으로 테이블은 페이지네이션이 적용됩니다. 이를 비활성화하려면 `$table->paginated(false)` 메서드를 사용해야 합니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginated(false);
}
```

### 페이지네이션 옵션 커스터마이징 {#customizing-the-pagination-options}

페이지네이션된 레코드의 페이지당 선택 옵션을 `paginated()` 메서드에 전달하여 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginated([10, 25, 50, 100, 'all']);
}
```

### 기본 페이지네이션 페이지 옵션 커스터마이징 {#customizing-the-default-pagination-page-option}

기본적으로 표시되는 레코드 수를 커스터마이징하려면 `defaultPaginationPageOption()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->defaultPaginationPageOption(25);
}
```

### 페이지네이션 페이지와 쿼리 문자열 충돌 방지 {#preventing-query-string-conflicts-with-the-pagination-page}

기본적으로 Livewire는 페이지네이션 상태를 URL 쿼리 문자열의 `page` 파라미터에 저장합니다. 동일한 페이지에 여러 테이블이 있는 경우, 한 테이블의 페이지네이션 상태가 다른 테이블의 상태에 의해 덮어써질 수 있습니다.

이를 해결하려면, 해당 테이블에 대해 고유한 쿼리 문자열 식별자를 반환하는 `$table->queryStringIdentifier()`를 정의할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->queryStringIdentifier('users');
}
```

### 첫 페이지와 마지막 페이지로의 링크 표시 {#displaying-links-to-the-first-and-the-last-pagination-page}

`extremePaginationLinks()` 메서드를 사용하여 첫 페이지와 마지막 페이지로 이동하는 "극단" 링크를 추가할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->extremePaginationLinks();
}
```

### 단순 페이지네이션 사용하기 {#using-simple-pagination}

`paginateTableQuery()` 메서드를 오버라이드하여 단순 페이지네이션을 사용할 수 있습니다.

먼저, Livewire 컴포넌트를 찾으세요. Panel Builder의 리소스를 사용하고 있고 List 페이지에 단순 페이지네이션을 추가하려면, 리소스 클래스 자체가 아니라 리소스의 `Pages/List.php` 파일을 여세요.

```php
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;

protected function paginateTableQuery(Builder $query): Paginator
{
    return $query->simplePaginate(($this->getTableRecordsPerPage() === 'all') ? $query->count() : $this->getTableRecordsPerPage());
}
```

### 커서 페이지네이션 사용하기 {#using-cursor-pagination}

`paginateTableQuery()` 메서드를 오버라이드하여 커서 페이지네이션을 사용할 수 있습니다.

먼저, Livewire 컴포넌트를 찾으세요. Panel Builder의 리소스를 사용하고 있고 List 페이지에 단순 페이지네이션을 추가하려면, 리소스 클래스 자체가 아니라 리소스의 `Pages/List.php` 파일을 여세요.

```php
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Builder;

protected function paginateTableQuery(Builder $query): CursorPaginator
{
    return $query->cursorPaginate(($this->getTableRecordsPerPage() === 'all') ? $query->count() : $this->getTableRecordsPerPage());
}
```

## 레코드 URL(클릭 가능한 행) {#record-urls-clickable-rows}

`$table->recordUrl()` 메서드를 사용하여 테이블 행 전체를 클릭 가능하게 만들 수 있습니다:

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->recordUrl(
            fn (Model $record): string => route('posts.edit', ['record' => $record]),
        );
}
```

이 예시에서는 각 게시글을 클릭하면 `posts.edit` 라우트로 이동합니다.

URL을 새 탭에서 열 수도 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->openRecordUrlInNewTab();
}
```

특정 컬럼에 대해 [URL을 오버라이드](columns/getting-started#opening-urls)하거나, 컬럼 클릭 시 [액션을 실행](columns/getting-started#running-actions)하고 싶다면 [컬럼 문서](columns/getting-started#opening-urls)를 참고하세요.

## 레코드 순서 변경 {#reordering-records}

테이블에서 드래그 앤 드롭으로 레코드의 순서를 변경할 수 있도록 하려면 `$table->reorderable()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('sort');
}
```

모델에서 대량 할당 보호를 사용 중이라면, `$fillable` 배열에 `sort` 속성을 추가해야 합니다.

테이블을 순서 변경 가능하게 만들면, 순서 변경을 토글하는 새로운 버튼이 테이블에 표시됩니다.

<AutoScreenshot name="tables/reordering" alt="순서 변경 가능한 행이 있는 테이블" version="3.x" />

`reorderable()` 메서드는 레코드 순서를 저장할 컬럼명을 인자로 받습니다. [`spatie/eloquent-sortable`](https://github.com/spatie/eloquent-sortable)과 같이 `order_column`과 같은 정렬 컬럼을 사용하는 경우, 이를 대신 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('order_column');
}
```

`reorderable()` 메서드는 두 번째 인자로 불리언 조건도 받을 수 있어, 조건부로 순서 변경을 활성화할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('sort', auth()->user()->isAdmin());
}
```

### 순서 변경 중 페이지네이션 활성화 {#enabling-pagination-while-reordering}

순서 변경 모드에서는 페이지 간 레코드 이동을 허용하기 위해 페이지네이션이 비활성화됩니다. 순서 변경 중에 페이지네이션을 다시 활성화하는 것은 일반적으로 좋지 않은 UX이지만, 확실하다면 `$table->paginatedWhileReordering()`을 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginatedWhileReordering();
}
```

### 순서 변경 트리거 액션 커스터마이징 {#customizing-the-reordering-trigger-action}

순서 변경 트리거 버튼을 커스터마이징하려면, 클로저를 전달하여 액션을 반환하는 `reorderRecordsTriggerAction()` 메서드를 사용할 수 있습니다. [액션 트리거 버튼 커스터마이징](../actions/trigger-button)에 사용할 수 있는 모든 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderRecordsTriggerAction(
            fn (Action $action, bool $isReordering) => $action
                ->button()
                ->label($isReordering ? '순서 변경 비활성화' : '순서 변경 활성화'),
        );
}
```

<AutoScreenshot name="tables/reordering/custom-trigger-action" alt="순서 변경 가능한 행과 커스텀 트리거 액션이 있는 테이블" version="3.x" />

## 테이블 헤더 커스터마이징 {#customizing-the-table-header}

`$table->heading()` 메서드를 사용하여 테이블에 제목을 추가할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->heading('Clients')
        ->columns([
            // ...
        ]);
```

`$table->description()` 메서드를 사용하여 제목 아래에 설명을 추가할 수도 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->heading('Clients')
        ->description('여기에서 클라이언트를 관리하세요.')
        ->columns([
            // ...
        ]);
```

`$table->header()` 메서드에 뷰를 전달하여 전체 헤더를 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->header(view('tables.header', [
            'heading' => 'Clients',
        ]))
        ->columns([
            // ...
        ]);
```

## 테이블 내용 폴링 {#polling-table-content}

`$table->poll()` 메서드를 사용하여 테이블 내용을 일정 간격으로 새로고침할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->poll('10s');
}
```

## 로딩 지연 {#deferring-loading}

데이터가 많은 테이블은 로딩에 시간이 걸릴 수 있으므로, `deferLoading()` 메서드를 사용하여 테이블 데이터를 비동기적으로 로드할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->deferLoading();
}
```

## Laravel Scout로 레코드 검색하기 {#searching-records-with-laravel-scout}

Filament는 [Laravel Scout](https://laravel.com/docs/scout)와 직접 통합을 제공하지 않지만, 메서드를 오버라이드하여 통합할 수 있습니다.

`whereIn()` 절을 사용하여 Scout 결과에 대해 쿼리를 필터링하세요:

```php
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;

protected function applySearchToTableQuery(Builder $query): Builder
{
    $this->applyColumnSearchesToTableQuery($query);
    
    if (filled($search = $this->getTableSearch())) {
        $query->whereIn('id', Post::search($search)->keys());
    }

    return $query;
}
```

Scout는 내부적으로 이 `whereIn()` 메서드를 사용하여 결과를 가져오므로, 이를 사용하는 데 성능 저하가 없습니다.

`applyColumnSearchesToTableQuery()` 메서드는 개별 컬럼 검색이 계속 작동하도록 보장합니다. 해당 입력에도 Scout를 사용하고 싶다면, 이 메서드를 직접 구현할 수 있습니다.

글로벌 검색 입력이 표시되려면, 테이블의 최소 한 컬럼이 `searchable()`이어야 합니다. 또는 이미 Scout로 검색 가능한 컬럼을 제어하고 있다면, 테이블 전체에 `searchable()`을 전달할 수도 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->searchable();
}
```

## 쿼리 문자열 {#query-string}

Livewire는 요청 간에 접근할 수 있도록 데이터를 URL의 쿼리 문자열에 저장하는 기능을 제공합니다.

Filament에서는 이를 통해 테이블의 필터, 정렬, 검색, 페이지네이션 상태를 URL에 저장할 수 있습니다.

테이블의 필터, 정렬, 검색 상태를 쿼리 문자열에 저장하려면:

```php
use Livewire\Attributes\Url;

#[Url]
public bool $isTableReordering = false;

/**
 * @var array<string, mixed> | null
 */
#[Url]
public ?array $tableFilters = null;

#[Url]
public ?string $tableGrouping = null;

#[Url]
public ?string $tableGroupingDirection = null;

/**
 * @var ?string
 */
#[Url]
public $tableSearch = '';

#[Url]
public ?string $tableSortColumn = null;

#[Url]
public ?string $tableSortDirection = null;
```

## 테이블 행 스타일링 {#styling-table-rows}

### 줄무늬 테이블 행 {#striped-table-rows}

줄무늬 테이블 행을 활성화하려면 `striped()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->striped();
}
```

<AutoScreenshot name="tables/striped" alt="줄무늬 행이 있는 테이블" version="3.x" />

### 커스텀 행 클래스 {#custom-row-classes}

레코드 데이터에 따라 조건부로 행을 스타일링하고 싶을 수 있습니다. `$table->recordClasses()` 메서드를 사용하여 행에 적용할 문자열 또는 CSS 클래스 배열을 지정하면 됩니다:

```php
use Closure;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->recordClasses(fn (Model $record) => match ($record->status) {
            'draft' => 'opacity-30',
            'reviewing' => 'border-s-2 border-orange-600 dark:border-orange-300',
            'published' => 'border-s-2 border-green-600 dark:border-green-300',
            default => null,
        });
}
```

이 클래스들은 Tailwind CSS에 의해 자동으로 컴파일되지 않습니다. Blade 파일에서 이미 사용되지 않은 Tailwind CSS 클래스를 적용하려면, `tailwind.config.js`의 `content` 설정에 `'./app/Filament/**/*.php'` 디렉터리도 스캔하도록 추가해야 합니다.

## 테이블 리셋 {#resetting-the-table}

Livewire 요청 중에 테이블 정의를 변경하는 경우(예: `table()` 메서드에서 public 속성을 사용하는 경우), 변경 사항이 적용되도록 테이블을 리셋해야 할 수 있습니다. 이를 위해 Livewire 컴포넌트에서 `resetTable()` 메서드를 호출할 수 있습니다:

```php
$this->resetTable();
```

## 전역 설정 {#global-settings}

모든 테이블에 사용되는 기본 구성을 커스터마이징하려면, 서비스 프로바이더의 `boot()` 메서드에서 정적 `configureUsing()` 메서드를 호출할 수 있습니다. 이 함수는 생성되는 각 테이블에 대해 실행됩니다:

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

Table::configureUsing(function (Table $table): void {
    $table
        ->filtersLayout(FiltersLayout::AboveContentCollapsible)
        ->paginationPageOptions([10, 25, 50]);
});
```
