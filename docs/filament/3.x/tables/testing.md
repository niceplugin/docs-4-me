---
title: 테스트
---
# [테이블] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면 Pest 문서의 플러그인 설치 안내를 따라주세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만 PHPUnit에 맞게 쉽게 변환할 수 있습니다.

Table Builder는 Livewire 컴포넌트에서 동작하므로, [Livewire 테스트 헬퍼](/livewire/3.x/testing)를 사용할 수 있습니다. 하지만, 테이블을 위해 사용할 수 있는 많은 커스텀 테스트 헬퍼도 제공합니다:

## 렌더링 {#render}

테이블 컴포넌트가 렌더링되는지 확인하려면 `assertSuccessful()` Livewire 헬퍼를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can render page', function () {
    livewire(ListPosts::class)->assertSuccessful();
});
```

어떤 레코드가 표시되는지 테스트하려면 `assertCanSeeTableRecords()`, `assertCanNotSeeTableRecords()`, `assertCountTableRecords()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('cannot display trashed posts by default', function () {
    $posts = Post::factory()->count(4)->create();
    $trashedPosts = Post::factory()->trashed()->count(6)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertCanNotSeeTableRecords($trashedPosts)
        ->assertCountTableRecords(4);
});
```

> 테이블이 페이지네이션을 사용하는 경우, `assertCanSeeTableRecords()`는 첫 번째 페이지의 레코드만 확인합니다. 페이지를 전환하려면 `call('gotoPage', 2)`를 호출하세요.

> 테이블이 `deferLoading()`을 사용하는 경우, `assertCanSeeTableRecords()` 전에 `loadTable()`을 호출해야 합니다.

## 컬럼 {#columns}

특정 컬럼이 렌더링되는지 확인하려면 컬럼 이름을 `assertCanRenderTableColumn()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('can render post titles', function () {
    Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanRenderTableColumn('title');
});
```

이 헬퍼는 해당 컬럼의 HTML을 가져와 테이블에 존재하는지 확인합니다.

컬럼이 렌더링되지 않는지 테스트하려면 `assertCanNotRenderTableColumn()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can not render post comments', function () {
    Post::factory()->count(10)->create()

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanNotRenderTableColumn('comments');
});
```

이 헬퍼는 해당 컬럼의 HTML이 기본적으로 현재 테이블에 표시되지 않는지 확인합니다.

### 정렬 {#sorting}

테이블 레코드를 정렬하려면, 정렬할 컬럼 이름을 전달하여 `sortTable()`을 호출하세요. 정렬 방향을 반대로 하려면 `sortTable()`의 두 번째 매개변수에 `'desc'`를 사용할 수 있습니다.

테이블이 정렬된 후, `assertCanSeeTableRecords()`의 `inOrder` 매개변수를 사용하여 테이블 레코드가 올바른 순서로 렌더링되는지 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can sort posts by title', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->sortTable('title')
        ->assertCanSeeTableRecords($posts->sortBy('title'), inOrder: true)
        ->sortTable('title', 'desc')
        ->assertCanSeeTableRecords($posts->sortByDesc('title'), inOrder: true);
});
```

### 검색 {#searching}

테이블을 검색하려면, 검색 쿼리와 함께 `searchTable()` 메서드를 호출하세요.

그런 다음 `assertCanSeeTableRecords()`로 필터링된 테이블 레코드를 확인하고, `assertCanNotSeeTableRecords()`로 일부 레코드가 더 이상 테이블에 없는지 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can search posts by title', function () {
    $posts = Post::factory()->count(10)->create();

    $title = $posts->first()->title;

    livewire(PostResource\Pages\ListPosts::class)
        ->searchTable($title)
        ->assertCanSeeTableRecords($posts->where('title', $title))
        ->assertCanNotSeeTableRecords($posts->where('title', '!=', $title));
});
```

개별 컬럼을 검색하려면, `searchTableColumns()`에 검색 배열을 전달할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can search posts by title column', function () {
    $posts = Post::factory()->count(10)->create();

    $title = $posts->first()->title;

    livewire(PostResource\Pages\ListPosts::class)
        ->searchTableColumns(['title' => $title])
        ->assertCanSeeTableRecords($posts->where('title', $title))
        ->assertCanNotSeeTableRecords($posts->where('title', '!=', $title));
});
```

### 상태 {#state}

특정 컬럼이 레코드에 대해 상태를 가지거나 가지지 않는지 확인하려면 `assertTableColumnStateSet()`과 `assertTableColumnStateNotSet()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can get post author names', function () {
    $posts = Post::factory()->count(10)->create();

    $post = $posts->first();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnStateSet('author.name', $post->author->name, record: $post)
        ->assertTableColumnStateNotSet('author.name', 'Anonymous', record: $post);
});
```

특정 컬럼이 포맷된 상태를 가지거나 가지지 않는지 확인하려면 `assertTableColumnFormattedStateSet()`과 `assertTableColumnFormattedStateNotSet()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can get post author names', function () {
    $post = Post::factory(['name' => 'John Smith'])->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnFormattedStateSet('author.name', 'Smith, John', record: $post)
        ->assertTableColumnFormattedStateNotSet('author.name', $post->author->name, record: $post);
});
```

### 존재 여부 {#existence}

컬럼이 존재하는지 확인하려면 `assertTableColumnExists()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('has an author column', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnExists('author');
});
```

특정 "진리 테스트"를 통과하는지 확인하기 위해 추가 인수로 함수를 전달할 수 있습니다. 이는 컬럼이 특정 설정을 가지고 있는지 확인할 때 유용합니다. 또한, 세 번째 매개변수로 레코드를 전달할 수 있는데, 이는 체크가 렌더링되는 테이블 행에 따라 달라질 때 유용합니다:

```php
use function Pest\Livewire\livewire;
use Filament\Tables\Columns\TextColumn;

it('has an author column', function () {
    $post = Post::factory()->create();
    
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnExists('author', function (TextColumn $column): bool {
            return $column->getDescriptionBelow() === $post->subtitle;
        }, $post);
});
```

### 권한 {#authorization}

특정 사용자가 컬럼을 볼 수 없는지 확인하려면 `assertTableColumnVisible()`과 `assertTableColumnHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('shows the correct columns', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnVisible('created_at')
        ->assertTableColumnHidden('author');
});
```

### 설명 {#descriptions}

컬럼이 올바른 설명을 위 또는 아래에 가지고 있는지 확인하려면 `assertTableColumnHasDescription()`과 `assertTableColumnDoesNotHaveDescription()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('has the correct descriptions above and below author', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableColumnHasDescription('author', 'Author! ↓↓↓', $post, 'above')
        ->assertTableColumnHasDescription('author', 'Author! ↑↑↑', $post)
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↑↑↑', $post, 'above')
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↓↓↓', $post);
});
```

### 추가 속성 {#extra-attributes}

컬럼이 올바른 추가 속성을 가지고 있는지 확인하려면 `assertTableColumnHasExtraAttributes()`와 `assertTableColumnDoesNotHaveExtraAttributes()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('displays author in red', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableColumnHasExtraAttributes('author', ['class' => 'text-danger-500'], $post)
        ->assertTableColumnDoesNotHaveExtraAttributes('author', ['class' => 'text-primary-500'], $post);
});
```

### 선택 컬럼 {#select-columns}

선택 컬럼이 있다면, `assertTableSelectColumnHasOptions()`와 `assertTableSelectColumnDoesNotHaveOptions()`로 올바른 옵션이 있는지 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('has the correct statuses', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableSelectColumnHasOptions('status', ['unpublished' => 'Unpublished', 'published' => 'Published'], $post)
        ->assertTableSelectColumnDoesNotHaveOptions('status', ['archived' => 'Archived'], $post);
});
```

## 필터 {#filters}

테이블 레코드를 필터링하려면, `filterTable()` 메서드와 함께 `assertCanSeeTableRecords()`, `assertCanNotSeeTableRecords()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can filter posts by `is_published`', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->filterTable('is_published')
        ->assertCanSeeTableRecords($posts->where('is_published', true))
        ->assertCanNotSeeTableRecords($posts->where('is_published', false));
});
```

간단한 필터의 경우, 이 메서드는 필터를 활성화합니다.

`SelectFilter` 또는 `TernaryFilter`의 값을 설정하려면 두 번째 인수로 값을 전달하세요:

```php
use function Pest\Livewire\livewire;

it('can filter posts by `author_id`', function () {
    $posts = Post::factory()->count(10)->create();

    $authorId = $posts->first()->author_id;

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->filterTable('author_id', $authorId)
        ->assertCanSeeTableRecords($posts->where('author_id', $authorId))
        ->assertCanNotSeeTableRecords($posts->where('author_id', '!=', $authorId));
});
```

### 필터 초기화 {#resetting-filters}

모든 필터를 원래 상태로 초기화하려면 `resetTableFilters()`를 호출하세요:

```php
use function Pest\Livewire\livewire;

it('can reset table filters', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->resetTableFilters();
});
```

### 필터 제거 {#removing-filters}

단일 필터를 제거하려면 `removeTableFilter()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('filters list by published', function () {
    $posts = Post::factory()->count(10)->create();

    $unpublishedPosts = $posts->where('is_published', false)->get();

    livewire(PostsTable::class)
        ->filterTable('is_published')
        ->assertCanNotSeeTableRecords($unpublishedPosts)
        ->removeTableFilter('is_published')
        ->assertCanSeeTableRecords($posts);
});
```

모든 필터를 제거하려면 `removeTableFilters()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can remove all table filters', function () {
    $posts = Post::factory()->count(10)->forAuthor()->create();

    $unpublishedPosts = $posts
        ->where('is_published', false)
        ->where('author_id', $posts->first()->author->getKey());

    livewire(PostsTable::class)
        ->filterTable('is_published')
        ->filterTable('author', $author)
        ->assertCanNotSeeTableRecords($unpublishedPosts)
        ->removeTableFilters()
        ->assertCanSeeTableRecords($posts);
});
```

### 숨겨진 필터 {#hidden-filters}

특정 사용자가 필터를 볼 수 없는지 확인하려면 `assertTableFilterVisible()`과 `assertTableFilterHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('shows the correct filters', function () {
    livewire(PostsTable::class)
        ->assertTableFilterVisible('created_at')
        ->assertTableFilterHidden('author');
```

### 필터 존재 여부 {#filter-existence}

필터가 존재하는지 확인하려면 `assertTableFilterExists()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('has an author filter', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableFilterExists('author');
});
```

특정 "진리 테스트"를 통과하는지 확인하기 위해 추가 인수로 함수를 전달할 수 있습니다. 이는 필터가 특정 설정을 가지고 있는지 확인할 때 유용합니다:

```php
use function Pest\Livewire\livewire;
use Filament\Tables\Filters\SelectFilter;

it('has an author filter', function () {    
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableFilterExists('author', function (SelectFilter $column): bool {
            return $column->getLabel() === 'Select author';
        });
});
```

## 액션 {#actions}

### 액션 호출 {#calling-actions}

액션의 이름이나 클래스를 `callTableAction()`에 전달하여 액션을 호출할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can delete posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableAction(DeleteAction::class, $post);

    $this->assertModelMissing($post);
});
```

이 예제는 테이블에 `DeleteAction`이 있다고 가정합니다. 커스텀 `Action::make('reorder')`가 있다면, `callTableAction('reorder')`를 사용할 수 있습니다.

컬럼 액션의 경우, 동일하게 `callTableColumnAction()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can copy posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableColumnAction('copy', $post);

    $this->assertDatabaseCount((new Post)->getTable(), 2);
});
```

일괄 액션의 경우, 여러 레코드를 전달하여 `callTableBulkAction()`으로 일괄 액션을 실행할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can bulk delete posts', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableBulkAction(DeleteBulkAction::class, $posts);

    foreach ($posts as $post) {
        $this->assertModelMissing($post);
    }
});
```

액션에 데이터 배열을 전달하려면 `data` 매개변수를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can edit posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableAction(EditAction::class, $post, data: [
            'title' => $title = fake()->words(asText: true),
        ])
        ->assertHasNoTableActionErrors();

    expect($post->refresh())
        ->title->toBe($title);
});
```

### 실행 {#execution}

액션 또는 일괄 액션이 중단되었는지 확인하려면 `assertTableActionHalted()` / `assertTableBulkActionHalted()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('will halt delete if post is flagged', function () {
    $posts= Post::factory()->count(2)->flagged()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableAction('delete', $posts->first())
        ->callTableBulkAction('delete', $posts)
        ->assertTableActionHalted('delete')
        ->assertTableBulkActionHalted('delete');

    $this->assertModelExists($post);
});
```

### 에러 {#errors}

`assertHasNoTableActionErrors()`는 액션 폼을 제출할 때 검증 오류가 발생하지 않았는지 확인하는 데 사용됩니다.

데이터에 검증 오류가 발생했는지 확인하려면, Livewire의 `assertHasErrors()`와 유사하게 `assertHasTableActionErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can validate edited post data', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableAction(EditAction::class, $post, data: [
            'title' => null,
        ])
        ->assertHasTableActionErrors(['title' => ['required']]);
});
```

일괄 액션의 경우, 이 메서드는 `assertHasTableBulkActionErrors()`와 `assertHasNoTableBulkActionErrors()`입니다.

### 미리 채워진 데이터 {#pre-filled-data}

액션 또는 일괄 액션이 데이터로 미리 채워져 있는지 확인하려면 `assertTableActionDataSet()` 또는 `assertTableBulkActionDataSet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can load existing post data for editing', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->mountTableAction(EditAction::class, $post)
        ->assertTableActionDataSet([
            'title' => $post->title,
        ])
        ->setTableActionData([
            'title' => $title = fake()->words(asText: true),
        ])
        ->callMountedTableAction()
        ->assertHasNoTableActionErrors();

    expect($post->refresh())
        ->title->toBe($title);
});
```

`assertTableActionDataSet()` 및 `assertTableBulkActionDataSet()` 메서드에 함수를 전달하여 폼 `$state`에 접근하고 추가적인 검증을 수행할 수도 있습니다:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title without any spaces', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->mountTableAction(EditAction::class, $post)
        ->assertTableActionDataSet(function (array $state) use ($post): array {
            expect($state['slug'])
                ->not->toContain(' ');
                
            return [
                'slug' => Str::slug($post->title),
            ];
        });
});
```

### 액션 상태 {#action-state}

테이블에 액션 또는 일괄 액션이 존재하거나 존재하지 않는지 확인하려면 `assertTableActionExists()` / `assertTableActionDoesNotExist()` 또는  `assertTableBulkActionExists()` / `assertTableBulkActionDoesNotExist()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can publish but not unpublish posts', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionExists('publish')
        ->assertTableActionDoesNotExist('unpublish')
        ->assertTableBulkActionExists('publish')
        ->assertTableBulkActionDoesNotExist('unpublish');
});
```

다른 액션 세트가 올바른 순서로 존재하는지 확인하려면 다양한 "InOrder" 검증을 사용할 수 있습니다

```php
use function Pest\Livewire\livewire;

it('has all actions in expected order', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionsExistInOrder(['edit', 'delete'])
        ->assertTableBulkActionsExistInOrder(['restore', 'forceDelete'])
        ->assertTableHeaderActionsExistInOrder(['create', 'attach'])
        ->assertTableEmptyStateActionsExistInOrder(['create', 'toggle-trashed-filter'])
});
```

액션 또는 일괄 액션이 사용자에게 활성화 또는 비활성화되어 있는지 확인하려면 `assertTableActionEnabled()` / `assertTableActionDisabled()` 또는 `assertTableBulkActionEnabled()` / `assertTableBulkActionDisabled()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can not publish, but can delete posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionDisabled('publish', $post)
        ->assertTableActionEnabled('delete', $post)
        ->assertTableBulkActionDisabled('publish')
        ->assertTableBulkActionEnabled('delete');
});
```


액션 또는 일괄 액션이 사용자에게 표시되거나 숨겨져 있는지 확인하려면 `assertTableActionVisible()` / `assertTableActionHidden()` 또는 `assertTableBulkActionVisible()` / `assertTableBulkActionHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can not publish, but can delete posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHidden('publish', $post)
        ->assertTableActionVisible('delete', $post)
        ->assertTableBulkActionHidden('publish')
        ->assertTableBulkActionVisible('delete');
});
```

### 버튼 스타일 {#button-style}

액션 또는 일괄 액션이 올바른 라벨을 가지고 있는지 확인하려면 `assertTableActionHasLabel()` / `assertTableBulkActionHasLabel()` 및 `assertTableActionDoesNotHaveLabel()` / `assertTableBulkActionDoesNotHaveLabel()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('delete actions have correct labels', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasLabel('delete', 'Archive Post', $post)
        ->assertTableActionDoesNotHaveLabel('delete', 'Delete', $post);
        ->assertTableBulkActionHasLabel('delete', 'Archive Post', $post)
        ->assertTableBulkActionDoesNotHaveLabel('delete', 'Delete', $post);
});
```

액션 또는 일괄 액션의 버튼이 올바른 아이콘을 표시하는지 확인하려면 `assertTableActionHasIcon()` / `assertTableBulkActionHasIcon()` 또는 `assertTableActionDoesNotHaveIcon()` / `assertTableBulkActionDoesNotHaveIcon()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('delete actions have correct icons', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasIcon('delete', 'heroicon-m-archive-box', $post)
        ->assertTableActionDoesNotHaveIcon('delete', 'heroicon-m-trash', $post);
        ->assertTableBulkActionHasIcon('delete', 'heroicon-m-archive-box', $post)
        ->assertTableBulkActionDoesNotHaveIcon('delete', 'heroicon-m-trash', $post);
});
```

액션 또는 일괄 액션의 버튼이 올바른 색상을 표시하는지 확인하려면 `assertTableActionHasColor()` / `assertTableBulkActionHasColor()` 또는 `assertTableActionDoesNotHaveColor()` / `assertTableBulkActionDoesNotHaveColor()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('delete actions have correct colors', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasColor('delete', 'warning', $post)
        ->assertTableActionDoesNotHaveColor('delete', 'danger', $post);
        ->assertTableBulkActionHasColor('delete', 'warning', $post)
        ->assertTableBulkActionDoesNotHaveColor('delete', 'danger', $post);
});
```

### URL {#url}

액션 또는 일괄 액션이 올바른 URL 속성을 가지고 있는지 확인하려면 `assertTableActionHasUrl()`, `assertTableActionDoesNotHaveUrl()`, `assertTableActionShouldOpenUrlInNewTab()`, `assertTableActionShouldNotOpenUrlInNewTab()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('links to the correct Filament sites', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasUrl('filament', 'https://filamentphp.com/', $post)
        ->assertTableActionDoesNotHaveUrl('filament', 'https://github.com/filamentphp/filament', $post)
        ->assertTableActionShouldOpenUrlInNewTab('filament', $post)
        ->assertTableActionShouldNotOpenUrlInNewTab('github', $post);
});
```

## 요약 {#summaries}

요약 계산이 동작하는지 테스트하려면 `assertTableColumnSummarySet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertTableColumnSummarySet('rating', 'average', $posts->avg('rating'));
});
```

첫 번째 인수는 컬럼 이름, 두 번째는 요약자 ID, 세 번째는 기대값입니다.

기대값과 실제값은 정규화되어, `123.12`와 `"123.12"`는 동일하게 간주되고, `['Fred', 'Jim']`과 `['Jim', 'Fred']`도 동일하게 간주됩니다.

요약자 ID는 `make()` 메서드에 전달하여 설정할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make('average'))
```

ID는 해당 컬럼 내 요약자들 사이에서 고유해야 합니다.

### 한 페이지네이션 페이지만 요약하기 {#summarizing-only-one-pagination-page}

한 페이지네이션 페이지만 평균을 계산하려면 `isCurrentPaginationPageOnly` 인수를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(20)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts->take(10))
        ->assertTableColumnSummarySet('rating', 'average', $posts->take(10)->avg('rating'), isCurrentPaginationPageOnly: true);
});
```

### 범위 요약자 테스트 {#testing-a-range-summarizer}

범위를 테스트하려면, 최소값과 최대값을 튜플 형태의 `[$minimum, $maximum]` 배열로 전달하세요:

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertTableColumnSummarySet('rating', 'range', [$posts->min('rating'), $posts->max('rating')]);
});
```
