---
title: 테스트
---
# [패널] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면 Pest 문서의 플러그인 설치 안내를 따라주세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만 PHPUnit에 맞게 쉽게 변환할 수 있습니다.

앱의 모든 페이지가 Livewire 컴포넌트이므로, 우리는 어디서나 Livewire 테스트 헬퍼를 사용합니다. Livewire 컴포넌트를 테스트해본 적이 없다면, Livewire 문서의 [이 가이드](/livewire/3.x/testing)를 먼저 읽어보세요.

## 시작하기 {#getting-started}

`TestCase`에서 앱에 접근할 수 있도록 인증되어 있는지 확인하세요:

```php
protected function setUp(): void
{
    parent::setUp();

    $this->actingAs(User::factory()->create());
}
```

### 여러 패널 테스트하기 {#testing-multiple-panels}

여러 개의 패널이 있고 기본이 아닌 패널을 테스트하고 싶다면, Filament에 어떤 패널을 테스트할 것인지 알려주어야 합니다. 이는 테스트 케이스의 `setUp()` 메서드에서 하거나, 특정 테스트의 시작 부분에서 할 수 있습니다. Filament는 일반적으로 요청을 통해 패널에 접근할 때 미들웨어에서 이 작업을 수행합니다. 하지만 Livewire 컴포넌트를 테스트할 때처럼 테스트에서 요청을 만들지 않는 경우, 현재 패널을 수동으로 설정해야 합니다:

```php
use Filament\Facades\Filament;

Filament::setCurrentPanel(
    Filament::getPanel('app'), // 여기서 `app`은 테스트하려는 패널의 ID입니다.
);
```

## 리소스 {#resources}

### 페이지 {#pages}

#### 목록 {#list}

##### 라우팅 & 렌더링 {#routing-render}

`PostResource`의 목록 페이지가 성공적으로 렌더링되는지 확인하려면, 페이지 URL을 생성하고 이 URL로 요청을 수행한 후 성공적인지 확인하세요:

```php
it('can render page', function () {
    $this->get(PostResource::getUrl('index'))->assertSuccessful();
});
```

##### 테이블 {#table}

Filament는 테이블 테스트를 위한 다양한 헬퍼를 제공합니다. 테이블 테스트에 대한 전체 가이드는 [Table Builder 문서](../tables/testing)에서 확인할 수 있습니다.

테이블 [테스트 헬퍼](../tables/testing)를 사용하려면, 테이블을 포함하는 리소스의 목록 페이지 클래스에서 어설션을 수행하세요:

```php
use function Pest\Livewire\livewire;

it('can list posts', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts);
});
```

#### 생성 {#create}

##### 라우팅 & 렌더링 {#routing-render-1}

`PostResource`의 생성 페이지가 성공적으로 렌더링되는지 확인하려면, 페이지 URL을 생성하고 이 URL로 요청을 수행한 후 성공적인지 확인하세요:

```php
it('can render page', function () {
    $this->get(PostResource::getUrl('create'))->assertSuccessful();
});
```

##### 생성하기 {#creating}

`fillForm()`에 폼 데이터를 전달한 후, 데이터베이스에 일치하는 레코드가 있는지 어설션하여 데이터가 올바르게 저장되는지 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can create', function () {
    $newData = Post::factory()->make();

    livewire(PostResource\Pages\CreatePost::class)
        ->fillForm([
            'author_id' => $newData->author->getKey(),
            'content' => $newData->content,
            'tags' => $newData->tags,
            'title' => $newData->title,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $this->assertDatabaseHas(Post::class, [
        'author_id' => $newData->author->getKey(),
        'content' => $newData->content,
        'tags' => json_encode($newData->tags),
        'title' => $newData->title,
    ]);
});
```

##### 유효성 검사 {#validation}

`assertHasFormErrors()`를 사용하여 폼에서 데이터가 올바르게 검증되는지 확인하세요:

```php
use function Pest\Livewire\livewire;

it('can validate input', function () {
    livewire(PostResource\Pages\CreatePost::class)
        ->fillForm([
            'title' => null,
        ])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required']);
});
```

#### 수정 {#edit}

##### 라우팅 & 렌더링 {#routing-render-2}

`PostResource`의 수정 페이지가 성공적으로 렌더링되는지 확인하려면, 페이지 URL을 생성하고 이 URL로 요청을 수행한 후 성공적인지 확인하세요:

```php
it('can render page', function () {
    $this->get(PostResource::getUrl('edit', [
        'record' => Post::factory()->create(),
    ]))->assertSuccessful();
});
```

##### 기존 데이터 채우기 {#filling-existing-data}

폼이 데이터베이스의 올바른 데이터로 채워지는지 확인하려면, 폼의 데이터가 레코드와 일치하는지 `assertFormSet()`으로 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can retrieve data', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\EditPost::class, [
        'record' => $post->getRouteKey(),
    ])
        ->assertFormSet([
            'author_id' => $post->author->getKey(),
            'content' => $post->content,
            'tags' => $post->tags,
            'title' => $post->title,
        ]);
});
```

##### 저장하기 {#saving}

`fillForm()`에 폼 데이터를 전달한 후, 데이터베이스에 일치하는 레코드가 있는지 어설션하여 데이터가 올바르게 저장되는지 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can save', function () {
    $post = Post::factory()->create();
    $newData = Post::factory()->make();

    livewire(PostResource\Pages\EditPost::class, [
        'record' => $post->getRouteKey(),
    ])
        ->fillForm([
            'author_id' => $newData->author->getKey(),
            'content' => $newData->content,
            'tags' => $newData->tags,
            'title' => $newData->title,
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    expect($post->refresh())
        ->author_id->toBe($newData->author->getKey())
        ->content->toBe($newData->content)
        ->tags->toBe($newData->tags)
        ->title->toBe($newData->title);
});
```

##### 유효성 검사 {#validation-1}

`assertHasFormErrors()`를 사용하여 폼에서 데이터가 올바르게 검증되는지 확인하세요:

```php
use function Pest\Livewire\livewire;

it('can validate input', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\EditPost::class, [
        'record' => $post->getRouteKey(),
    ])
        ->fillForm([
            'title' => null,
        ])
        ->call('save')
        ->assertHasFormErrors(['title' => 'required']);
});
```

##### 삭제하기 {#deleting}

`callAction()`을 사용하여 `DeleteAction`을 테스트할 수 있습니다:

```php
use Filament\Actions\DeleteAction;
use function Pest\Livewire\livewire;

it('can delete', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\EditPost::class, [
        'record' => $post->getRouteKey(),
    ])
        ->callAction(DeleteAction::class);

    $this->assertModelMissing($post);
});
```

특정 사용자가 `DeleteAction`을 볼 수 없는지 `assertActionHidden()`으로 확인할 수 있습니다:

```php
use Filament\Actions\DeleteAction;
use function Pest\Livewire\livewire;

it('can not delete', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\EditPost::class, [
        'record' => $post->getRouteKey(),
    ])
        ->assertActionHidden(DeleteAction::class);
});
```

#### 보기 {#view}

##### 라우팅 & 렌더링 {#routing-render-3}

`PostResource`의 보기 페이지가 성공적으로 렌더링되는지 확인하려면, 페이지 URL을 생성하고 이 URL로 요청을 수행한 후 성공적인지 확인하세요:

```php
it('can render page', function () {
    $this->get(PostResource::getUrl('view', [
        'record' => Post::factory()->create(),
    ]))->assertSuccessful();
});
```

##### 기존 데이터 채우기 {#filling-existing-data-1}

폼이 데이터베이스의 올바른 데이터로 채워지는지 확인하려면, 폼의 데이터가 레코드와 일치하는지 `assertFormSet()`으로 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can retrieve data', function () {
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ViewPost::class, [
        'record' => $post->getRouteKey(),
    ])
        ->assertFormSet([
            'author_id' => $post->author->getKey(),
            'content' => $post->content,
            'tags' => $post->tags,
            'title' => $post->title,
        ]);
});
```

### 관계 매니저 {#relation-managers}

##### 렌더링 {#render}

관계 매니저가 성공적으로 렌더링되는지 확인하려면, Livewire 컴포넌트를 마운트하세요:

```php
use App\Filament\Resources\CategoryResource\Pages\EditCategory;
use function Pest\Livewire\livewire;

it('can render relation manager', function () {
    $category = Category::factory()
        ->has(Post::factory()->count(10))
        ->create();

    livewire(CategoryResource\RelationManagers\PostsRelationManager::class, [
        'ownerRecord' => $category,
        'pageClass' => EditCategory::class,
    ])
        ->assertSuccessful();
});
```

##### 테이블 {#table-1}

Filament는 테이블 테스트를 위한 다양한 헬퍼를 제공합니다. 테이블 테스트에 대한 전체 가이드는 [Table Builder 문서](../tables/testing)에서 확인할 수 있습니다.

테이블 [테스트 헬퍼](../tables/testing)를 사용하려면, 테이블을 포함하는 관계 매니저 클래스에서 어설션을 수행하세요:

```php
use App\Filament\Resources\CategoryResource\Pages\EditCategory;
use function Pest\Livewire\livewire;

it('can list posts', function () {
    $category = Category::factory()
        ->has(Post::factory()->count(10))
        ->create();

    livewire(CategoryResource\RelationManagers\PostsRelationManager::class, [
        'ownerRecord' => $category,
        'pageClass' => EditCategory::class,
    ])
        ->assertCanSeeTableRecords($category->posts);
});
```
