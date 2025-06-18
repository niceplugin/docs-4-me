---
title: 테스트
---
# [테이블] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면, Pest 문서의 플러그인 설치 안내를 참고하세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만, 이를 PHPUnit에 쉽게 적용할 수도 있습니다.

Table Builder는 Livewire 컴포넌트에서 동작하므로, [Livewire 테스트 헬퍼](https://livewire.laravel.com/docs/testing)를 사용할 수 있습니다. 또한, 테이블을 위해 사용할 수 있는 다양한 커스텀 테스트 헬퍼도 제공됩니다.

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

> 테이블이 페이지네이션을 사용하는 경우, `assertCanSeeTableRecords()`는 첫 번째 페이지의 레코드만 확인합니다. 다른 페이지로 이동하려면 `call('gotoPage', 2)`를 호출하세요.

> 테이블이 `deferLoading()`을 사용하는 경우, `assertCanSeeTableRecords()`를 호출하기 전에 `loadTable()`을 호출해야 합니다.

## 컬럼 {#columns}

특정 컬럼이 렌더링되는지 확인하려면, 컬럼 이름을 `assertCanRenderTableColumn()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('can render post titles', function () {
    Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanRenderTableColumn('title');
});
```

이 헬퍼는 해당 컬럼의 HTML을 가져와서, 테이블에 존재하는지 확인합니다.

컬럼이 렌더링되지 않는지 테스트하려면 `assertCanNotRenderTableColumn()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can not render post comments', function () {
    Post::factory()->count(10)->create()

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanNotRenderTableColumn('comments');
});
```

이 헬퍼는 해당 컬럼의 HTML이 기본적으로 현재 테이블에 표시되지 않는지 검증합니다.

### 정렬 {#sorting}

테이블 레코드를 정렬하려면 `sortTable()`을 호출하고, 정렬할 열의 이름을 전달하면 됩니다. `sortTable()`의 두 번째 매개변수에 `'desc'`를 사용하면 정렬 방향을 반대로 할 수 있습니다.

테이블이 정렬된 후에는 `assertCanSeeTableRecords()`의 `inOrder` 매개변수를 사용하여 테이블 레코드가 올바른 순서로 렌더링되는지 확인할 수 있습니다:

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

### 검색하기 {#searching}

테이블을 검색하려면 `searchTable()` 메서드에 검색어를 전달하세요.

그런 다음 `assertCanSeeTableRecords()`를 사용하여 필터링된 테이블 레코드를 확인하고, `assertCanNotSeeTableRecords()`를 사용하여 일부 레코드가 더 이상 테이블에 없는지 확인할 수 있습니다:

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

개별 컬럼을 검색하려면, `searchTableColumns()`에 검색어 배열을 전달할 수 있습니다:

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

특정 컬럼이 레코드에 대해 상태를 가지고 있는지 또는 가지고 있지 않은지 확인하려면 `assertTableColumnStateSet()`과 `assertTableColumnStateNotSet()`을 사용할 수 있습니다:

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

특정 컬럼이 레코드에 대해 포맷된 상태를 가지고 있는지 또는 가지고 있지 않은지 확인하려면 `assertTableColumnFormattedStateSet()`과 `assertTableColumnFormattedStateNotSet()`을 사용할 수 있습니다:

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

특정 "진리 테스트"를 통과하는지 확인하기 위해 함수형 인자를 추가로 전달할 수 있습니다. 이는 컬럼이 특정 설정을 가지고 있는지 검증할 때 유용합니다. 또한, 세 번째 파라미터로 레코드를 전달할 수도 있는데, 이는 어떤 테이블 행이 렌더링되는지에 따라 검증이 달라질 때 유용합니다:

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

### 권한 부여 {#authorization}

특정 사용자가 컬럼을 볼 수 없도록 하려면 `assertTableColumnVisible()` 및 `assertTableColumnHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('shows the correct columns', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnVisible('created_at')
        ->assertTableColumnHidden('author');
});
```

### 설명 {#descriptions}

컬럼 위나 아래에 올바른 설명이 있는지 확인하려면 `assertTableColumnHasDescription()` 및 `assertTableColumnDoesNotHaveDescription()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('author 위와 아래에 올바른 설명이 있는지 확인합니다', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableColumnHasDescription('author', 'Author! ↓↓↓', $post, 'above')
        ->assertTableColumnHasDescription('author', 'Author! ↑↑↑', $post)
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↑↑↑', $post, 'above')
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↓↓↓', $post);
});
```

### 추가 속성 {#extra-attributes}

컬럼에 올바른 추가 속성이 있는지 확인하려면 `assertTableColumnHasExtraAttributes()` 및 `assertTableColumnDoesNotHaveExtraAttributes()` 메서드를 사용할 수 있습니다:

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

선택(select) 컬럼이 있는 경우, `assertTableSelectColumnHasOptions()`와 `assertTableSelectColumnDoesNotHaveOptions()`를 사용하여 올바른 옵션이 있는지 확인할 수 있습니다:

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

테이블 레코드를 필터링하려면 `filterTable()` 메서드와 함께 `assertCanSeeTableRecords()`, `assertCanNotSeeTableRecords()`를 사용할 수 있습니다:

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

간단한 필터의 경우, 이 코드는 필터를 활성화하기만 합니다.

`SelectFilter` 또는 `TernaryFilter`의 값을 설정하려면, 두 번째 인자로 값을 전달하세요:

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

### 필터 재설정 {#resetting-filters}

모든 필터를 원래 상태로 재설정하려면 `resetTableFilters()`를 호출하세요:

```php
use function Pest\Livewire\livewire;

it('can reset table filters', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->resetTableFilters();
});
```

### 필터 제거하기 {#removing-filters}

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

특정 사용자가 필터를 볼 수 없도록 하려면 `assertTableFilterVisible()` 및 `assertTableFilterHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('shows the correct filters', function () {
    livewire(PostsTable::class)
        ->assertTableFilterVisible('created_at')
        ->assertTableFilterHidden('author');
```

### 필터 존재 여부 확인 {#filter-existence}

필터가 존재하는지 확인하려면 `assertTableFilterExists()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('has an author filter', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableFilterExists('author');
});
```

필터가 특정 "진리 테스트"를 통과하는지 확인하기 위해 추가 인수로 함수를 전달할 수 있습니다. 이는 필터가 특정 설정을 가지고 있는지 검증할 때 유용합니다:

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

### 액션 호출하기 {#calling-actions}

액션을 호출하려면 `callTableAction()`에 액션의 이름이나 클래스를 전달하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('can delete posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableAction(DeleteAction::class, $post);

    $this->assertModelMissing($post);
});
```

이 예제는 테이블에 `DeleteAction`이 있다고 가정합니다. 만약 커스텀 `Action::make('reorder')`가 있다면, `callTableAction('reorder')`를 사용할 수 있습니다.

컬럼 액션의 경우에도 마찬가지로 `callTableColumnAction()`을 사용하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('can copy posts', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableColumnAction('copy', $post);

    $this->assertDatabaseCount((new Post)->getTable(), 2);
});
```

일괄 액션의 경우에도 마찬가지로, 여러 레코드를 전달하여 `callTableBulkAction()`으로 일괄 액션을 실행할 수 있습니다:

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

액션에 데이터 배열을 전달하려면 `data` 파라미터를 사용하세요:

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

액션 또는 벌크 액션이 중단되었는지 확인하려면 `assertTableActionHalted()` / `assertTableBulkActionHalted()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('게시물이 플래그 처리된 경우 삭제가 중단된다', function () {
    $posts = Post::factory()->count(2)->flagged()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->callTableAction('delete', $posts->first())
        ->callTableBulkAction('delete', $posts)
        ->assertTableActionHalted('delete')
        ->assertTableBulkActionHalted('delete');

    $this->assertModelExists($post);
});
```

### 오류 {#errors}

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

일괄 액션의 경우 이 메서드들은 `assertHasTableBulkActionErrors()`와 `assertHasNoTableBulkActionErrors()`로 호출됩니다.

### 미리 채워진 데이터 {#pre-filled-data}

액션이나 일괄 액션이 데이터로 미리 채워져 있는지 확인하려면 `assertTableActionDataSet()` 또는 `assertTableBulkActionDataSet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('기존 게시글 데이터를 편집용으로 불러올 수 있다', function () {
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

또한 `assertTableActionDataSet()` 및 `assertTableBulkActionDataSet()` 메서드에 함수를 전달하여 폼의 `$state`에 접근하고 추가적인 검증을 수행할 수도 있습니다:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('제목에서 공백 없이 자동으로 슬러그를 생성할 수 있다', function () {
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

테이블에서 액션 또는 일괄 액션이 존재하는지 또는 존재하지 않는지 확인하려면 `assertTableActionExists()` / `assertTableActionDoesNotExist()` 또는 `assertTableBulkActionExists()` / `assertTableBulkActionDoesNotExist()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('게시글을 발행할 수 있지만, 발행 취소는 할 수 없다', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionExists('publish')
        ->assertTableActionDoesNotExist('unpublish')
        ->assertTableBulkActionExists('publish')
        ->assertTableBulkActionDoesNotExist('unpublish');
});
```

서로 다른 액션 세트가 올바른 순서로 존재하는지 확인하려면 다양한 "InOrder" 어서션을 사용할 수 있습니다.

```php
use function Pest\Livewire\livewire;

it('모든 액션이 예상 순서대로 있다', function () {
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

it('게시글을 발행할 수는 없지만, 삭제는 할 수 있다', function () {
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

it('게시글을 발행할 수는 없지만, 삭제는 할 수 있다', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHidden('publish', $post)
        ->assertTableActionVisible('delete', $post)
        ->assertTableBulkActionHidden('publish')
        ->assertTableBulkActionVisible('delete');
});
```

### 버튼 스타일 {#button-style}

액션 또는 일괄 액션에 올바른 라벨이 있는지 확인하려면 `assertTableActionHasLabel()` / `assertTableBulkActionHasLabel()` 및 `assertTableActionDoesNotHaveLabel()` / `assertTableBulkActionDoesNotHaveLabel()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('삭제 액션에 올바른 라벨이 있는지 확인', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasLabel('delete', 'Archive Post', $post)
        ->assertTableActionDoesNotHaveLabel('delete', 'Delete', $post);
        ->assertTableBulkActionHasLabel('delete', 'Archive Post', $post)
        ->assertTableBulkActionDoesNotHaveLabel('delete', 'Delete', $post);
});
```

액션 또는 일괄 액션의 버튼에 올바른 아이콘이 표시되는지 확인하려면 `assertTableActionHasIcon()` / `assertTableBulkActionHasIcon()` 또는 `assertTableActionDoesNotHaveIcon()` / `assertTableBulkActionDoesNotHaveIcon()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('삭제 액션에 올바른 아이콘이 있는지 확인', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasIcon('delete', 'heroicon-m-archive-box', $post)
        ->assertTableActionDoesNotHaveIcon('delete', 'heroicon-m-trash', $post);
        ->assertTableBulkActionHasIcon('delete', 'heroicon-m-archive-box', $post)
        ->assertTableBulkActionDoesNotHaveIcon('delete', 'heroicon-m-trash', $post);
});
```

액션 또는 일괄 액션의 버튼에 올바른 색상이 표시되는지 확인하려면 `assertTableActionHasColor()` / `assertTableBulkActionHasColor()` 또는 `assertTableActionDoesNotHaveColor()` / `assertTableBulkActionDoesNotHaveColor()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('삭제 액션에 올바른 색상이 있는지 확인', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasColor('delete', 'warning', $post)
        ->assertTableActionDoesNotHaveColor('delete', 'danger', $post);
        ->assertTableBulkActionHasColor('delete', 'warning', $post)
        ->assertTableBulkActionDoesNotHaveColor('delete', 'danger', $post);
});
```

### URL {#url}

액션 또는 일괄 액션이 올바른 URL 특성을 가지는지 확인하려면 `assertTableActionHasUrl()`, `assertTableActionDoesNotHaveUrl()`, `assertTableActionShouldOpenUrlInNewTab()`, `assertTableActionShouldNotOpenUrlInNewTab()`을 사용할 수 있습니다.

```php
use function Pest\Livewire\livewire;

it('올바른 Filament 사이트로 링크되는지 확인합니다', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableActionHasUrl('filament', 'https://filamentphp.com/', $post)
        ->assertTableActionDoesNotHaveUrl('filament', 'https://github.com/filamentphp/filament', $post)
        ->assertTableActionShouldOpenUrlInNewTab('filament', $post)
        ->assertTableActionShouldNotOpenUrlInNewTab('github', $post);
});
```

## 요약 {#summaries}

요약 계산이 제대로 작동하는지 테스트하려면 `assertTableColumnSummarySet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertTableColumnSummarySet('rating', 'average', $posts->avg('rating'));
});
```

첫 번째 인자는 컬럼 이름이고, 두 번째는 요약자 ID, 세 번째는 기대하는 값입니다.

기대값과 실제값은 정규화되어 비교되므로, `123.12`와 `"123.12"`는 동일하게 간주되고, `['Fred', 'Jim']`과 `['Jim', 'Fred']`도 동일하게 간주됩니다.

요약자 ID는 `make()` 메서드에 전달하여 설정할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make('average'))
```

ID는 해당 컬럼 내의 요약자들 사이에서 고유해야 합니다.

### 한 페이지만 요약하기 {#summarizing-only-one-pagination-page}

한 페이지만의 평균을 계산하려면 `isCurrentPaginationPageOnly` 인수를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(20)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts->take(10))
        ->assertTableColumnSummarySet('rating', 'average', $posts->take(10)->avg('rating'), isCurrentPaginationPageOnly: true);
});
```

### 범위 요약자 테스트하기 {#testing-a-range-summarizer}

범위를 테스트하려면 최소값과 최대값을 튜플 형식의 `[$minimum, $maximum]` 배열로 전달하세요:

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertTableColumnSummarySet('rating', 'range', [$posts->min('rating'), $posts->max('rating')]);
});
```
