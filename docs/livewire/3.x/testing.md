# 테스트
## 첫 번째 테스트 생성하기 {#creating-your-first-test}

`make:livewire` 명령어에 `--test` 플래그를 추가하면, 컴포넌트와 함께 테스트 파일도 생성할 수 있습니다:

```shell
php artisan make:livewire create-post --test
```

위 명령어는 컴포넌트 파일 자체를 생성하는 것 외에도, 다음과 같은 테스트 파일 `tests/Feature/Livewire/CreatePostTest.php`를 생성합니다:

[Pest PHP](https://pestphp.com/) 테스트를 생성하고 싶다면, make:livewire 명령어에 `--pest` 옵션을 추가할 수 있습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_renders_successfully()
    {
        Livewire::test(CreatePost::class)
            ->assertStatus(200);
    }
}
```

물론, 이러한 파일들은 직접 수동으로 생성할 수도 있고, Laravel 애플리케이션의 기존 PHPUnit 테스트 내에서 Livewire의 테스트 유틸리티를 사용할 수도 있습니다.

더 읽기 전에, [Laravel의 자체 내장 테스트 기능](https://laravel.com/docs/testing)에 익숙해지는 것이 좋습니다.

## 페이지에 컴포넌트가 포함되어 있는지 테스트하기 {#testing-a-page-contains-a-component}

가장 간단한 Livewire 테스트는 애플리케이션의 특정 엔드포인트에 주어진 Livewire 컴포넌트가 포함되어 있고 성공적으로 렌더링되는지 확인하는 것입니다.

Livewire는 어떤 Laravel 테스트에서도 사용할 수 있는 `assertSeeLivewire()` 메서드를 제공합니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_component_exists_on_the_page()
    {
        $this->get('/posts/create')
            ->assertSeeLivewire(CreatePost::class);
    }
}
```

> [!tip] 이러한 테스트를 스모크 테스트(smoke test)라고 부릅니다
> 스모크 테스트는 애플리케이션에 치명적인 문제가 없는지 확인하는 광범위한 테스트입니다. 작성할 가치가 없어 보일 수 있지만, 실제로는 유지보수가 거의 필요 없으면서도 애플리케이션이 큰 오류 없이 성공적으로 렌더링된다는 기본적인 신뢰를 제공해주기 때문에 가장 가치 있는 테스트 중 하나입니다.

## 뷰 테스트하기 {#testing-views}

Livewire는 컴포넌트의 렌더링된 출력에 특정 텍스트가 존재하는지 확인할 수 있는 간단하면서도 강력한 유틸리티인 `assertSee()`를 제공합니다.

아래는 데이터베이스에 있는 모든 게시물이 페이지에 표시되는지 확인하기 위해 `assertSee()`를 사용하는 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_displays_posts()
    {
        Post::factory()->make(['title' => 'On bathing well']);
        Post::factory()->make(['title' => 'There\'s no time like bathtime']);

        Livewire::test(ShowPosts::class)
            ->assertSee('On bathing well')
            ->assertSee('There\'s no time like bathtime');
    }
}
```

### 뷰에서 전달되는 데이터 단언하기 {#asserting-data-from-the-view}

렌더링된 뷰의 출력값을 단언하는 것 외에도, 뷰로 전달되는 데이터를 테스트하는 것이 도움이 될 때가 있습니다.

아래는 위와 동일한 테스트이지만, 렌더링된 출력이 아니라 뷰 데이터 자체를 테스트하는 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_displays_all_posts()
    {
        Post::factory()->make(['title' => 'On bathing well']);
        Post::factory()->make(['title' => 'The bathtub is my sanctuary']);

        Livewire::test(ShowPosts::class)
            ->assertViewHas('posts', function ($posts) {
                return count($posts) == 2;
            });
    }
}
```

보시다시피, `assertViewHas()`는 지정한 데이터에 대해 원하는 단언을 할 수 있도록 제어권을 제공합니다.

좀 더 간단한 단언, 예를 들어 뷰 데이터가 특정 값과 일치하는지만 확인하고 싶다면, `assertViewHas()` 메서드의 두 번째 인자로 값을 직접 전달할 수 있습니다.

예를 들어, 뷰에 전달되는 `$postCount`라는 변수가 있다고 가정하면, 아래와 같이 해당 값에 대해 단언할 수 있습니다:

```php
$this->assertViewHas('postCount', 3)
```

## 인증된 사용자 설정하기 {#setting-the-authenticated-user}

대부분의 웹 애플리케이션은 사용자가 이용하기 전에 로그인을 요구합니다. 테스트 초기에 가짜 사용자를 수동으로 인증하는 대신, Livewire는 `actingAs()` 메서드를 제공합니다.

아래는 여러 사용자가 게시글을 가지고 있지만, 인증된 사용자만 자신의 게시글만 볼 수 있어야 하는 테스트 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\User;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_user_only_sees_their_own_posts()
    {
        $user = User::factory()
            ->has(Post::factory()->count(3))
            ->create();

        $stranger = User::factory()
            ->has(Post::factory()->count(2))
            ->create();

        Livewire::actingAs($user)
            ->test(ShowPosts::class)
            ->assertViewHas('posts', function ($posts) {
                return count($posts) == 3;
            });
    }
}
```

## 속성 테스트하기 {#testing-properties}

Livewire는 컴포넌트 내에서 속성을 설정하고 검증할 수 있는 유용한 테스트 유틸리티도 제공합니다.

컴포넌트 속성은 일반적으로 사용자가 `wire:model`이 포함된 폼 입력과 상호작용할 때 애플리케이션에서 업데이트됩니다. 하지만, 테스트에서는 실제 브라우저에서 입력을 직접 타이핑하지 않기 때문에, Livewire는 `set()` 메서드를 사용하여 속성을 직접 설정할 수 있도록 해줍니다.

아래는 `set()`을 사용하여 `CreatePost` 컴포넌트의 `$title` 속성을 업데이트하는 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_can_set_title()
    {
        Livewire::test(CreatePost::class)
            ->set('title', 'Confessions of a serial soaker')
            ->assertSet('title', 'Confessions of a serial soaker');
    }
}
```

### 속성 초기화 {#initializing-properties}

종종 Livewire 컴포넌트는 부모 컴포넌트나 라우트 파라미터로부터 데이터를 전달받습니다. Livewire 컴포넌트는 독립적으로 테스트되기 때문에, `Livewire::test()` 메서드의 두 번째 파라미터를 사용하여 데이터를 수동으로 전달할 수 있습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UpdatePost;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class UpdatePostTest extends TestCase
{
    public function test_title_field_is_populated()
    {
        $post = Post::factory()->make([
            'title' => 'Top ten bath bombs',
        ]);

        Livewire::test(UpdatePost::class, ['post' => $post])
            ->assertSet('title', 'Top ten bath bombs');
    }
}
```

테스트되는 기본 컴포넌트(`UpdatePost`)는 `mount()` 메서드를 통해 `$post`를 전달받게 됩니다. 이 기능을 더 명확하게 이해하기 위해 `UpdatePost`의 소스 코드를 살펴보겠습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
	public Post $post;

    public $title = '';

	public function mount(Post $post)
	{
		$this->post = $post;

		$this->title = $post->title;
	}

	// ...
}
```

### URL 매개변수 설정하기 {#setting-url-parameters}

Livewire 컴포넌트가 로드되는 페이지의 URL에 특정 쿼리 매개변수가 필요하다면, 테스트에서 `withQueryParams()` 메서드를 사용해 쿼리 매개변수를 수동으로 설정할 수 있습니다.

아래는 [Livewire의 URL 기능](/docs/url)을 사용하여 현재 검색 쿼리를 쿼리 문자열에 저장하고 추적하는 기본적인 `SearchPosts` 컴포넌트입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Url;
use App\Models\Post;

class SearchPosts extends Component
{
    #[Url] // [tl! highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.search-posts', [
            'posts' => Post::search($this->search)->get(),
        ]);
    }
}
```

위에서 볼 수 있듯이, `$search` 속성은 Livewire의 `#[Url]` 속성을 사용하여 해당 값이 URL에 저장되어야 함을 나타냅니다.

아래는 URL에 특정 쿼리 매개변수가 포함된 페이지에서 이 컴포넌트를 로드하는 시나리오를 시뮬레이션하는 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\SearchPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class SearchPostsTest extends TestCase
{
    public function test_can_search_posts_via_url_query_string()
    {
        Post::factory()->create(['title' => 'Testing the first water-proof hair dryer']);
        Post::factory()->create(['title' => 'Rubber duckies that actually float']);

        Livewire::withQueryParams(['search' => 'hair'])
            ->test(SearchPosts::class)
            ->assertSee('Testing the first')
            ->assertDontSee('Rubber duckies');
    }
}
```

### 쿠키 설정하기 {#setting-cookies}

Livewire 컴포넌트가 쿠키에 의존하는 경우, 테스트에서 `withCookie()` 또는 `withCookies()` 메서드를 사용하여 쿠키를 수동으로 설정할 수 있습니다.

아래는 마운트 시 쿠키에서 할인 토큰을 불러오는 기본적인 `Cart` 컴포넌트입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Url;
use App\Models\Post;

class Cart extends Component
{
    public $discountToken;

    public function mount()
    {
        $this->discountToken = request()->cookie('discountToken');
    }
}
```

위에서 볼 수 있듯이, `$discountToken` 속성은 요청의 쿠키에서 값을 가져옵니다.

아래는 쿠키가 있는 페이지에서 이 컴포넌트를 로드하는 시나리오를 시뮬레이션하는 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\Cart;
use Livewire\Livewire;
use Tests\TestCase;

class CartTest extends TestCase
{
    public function test_can_load_discount_token_from_a_cookie()
    {
        Livewire::withCookies(['discountToken' => 'CALEB2023'])
            ->test(Cart::class)
            ->assertSet('discountToken', 'CALEB2023');
    }
}
```

## 액션 호출하기 {#calling-actions}

Livewire 액션은 일반적으로 `wire:click`과 같은 프론트엔드에서 호출됩니다.

하지만 Livewire 컴포넌트 테스트는 실제 브라우저를 사용하지 않으므로, 테스트에서는 `call()` 메서드를 사용해 액션을 트리거할 수 있습니다.

아래는 `CreatePost` 컴포넌트에서 `call()` 메서드를 사용해 `save()` 액션을 트리거하는 예시입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_can_create_post()
    {
        $this->assertEquals(0, Post::count());

        Livewire::test(CreatePost::class)
            ->set('title', 'Wrinkly fingers? Try this one weird trick')
            ->set('content', '...')
            ->call('save');

        $this->assertEquals(1, Post::count());
    }
}
```

위 테스트에서는 `save()`를 호출하면 데이터베이스에 새로운 포스트가 생성되는지 검증합니다.

또한, `call()` 메서드에 추가 파라미터를 전달하여 액션에 인자를 넘길 수도 있습니다:

```php
->call('deletePost', $postId);
```

### 유효성 검사 {#validation}

유효성 검사 오류가 발생했는지 테스트하려면 Livewire의 `assertHasErrors()` 메서드를 사용할 수 있습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_title_field_is_required()
    {
        Livewire::test(CreatePost::class)
            ->set('title', '')
            ->call('save')
            ->assertHasErrors('title');
    }
}
```

특정 유효성 검사 규칙이 실패했는지 테스트하고 싶다면, 규칙 배열을 전달할 수 있습니다:

```php
$this->assertHasErrors(['title' => ['required']]);
```

또는 유효성 검사 메시지가 존재하는지 단언하고 싶다면, 다음과 같이 할 수 있습니다:

```php
$this->assertHasErrors(['title' => ['The title field is required.']]);
```

### Authorization {#authorization}

Livewire 컴포넌트에서 신뢰할 수 없는 입력에 의존하는 동작을 승인하는 것은 [필수적](/docs/properties#authorizing-the-input)입니다. Livewire는 인증 또는 권한 부여 검사가 실패했는지 확인할 수 있도록 `assertUnauthorized()` 및 `assertForbidden()` 메서드를 제공합니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UpdatePost;
use Livewire\Livewire;
use App\Models\User;
use App\Models\Post;
use Tests\TestCase;

class UpdatePostTest extends TestCase
{
    public function test_cant_update_another_users_post()
    {
        $user = User::factory()->create();
        $stranger = User::factory()->create();

        $post = Post::factory()->for($stranger)->create();

        Livewire::actingAs($user)
            ->test(UpdatePost::class, ['post' => $post])
            ->set('title', 'Living the lavender life')
            ->call('save')
            ->assertUnauthorized();

        Livewire::actingAs($user)
            ->test(UpdatePost::class, ['post' => $post])
            ->set('title', 'Living the lavender life')
            ->call('save')
            ->assertForbidden();
    }
}
```

원한다면, 컴포넌트 내의 동작이 트리거한 명시적인 상태 코드를 `assertStatus()`로 테스트할 수도 있습니다:

```php
->assertStatus(401); // 인증되지 않음(Unauthorized)
->assertStatus(403); // 금지됨(Forbidden)
```

### 리디렉션 {#redirects}

Livewire 액션이 리디렉션을 수행했는지 테스트하려면 `assertRedirect()` 메서드를 사용할 수 있습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_redirected_to_all_posts_after_creating_a_post()
    {
        Livewire::test(CreatePost::class)
            ->set('title', 'Using a loofah doesn\'t make you aloof...ugh')
            ->set('content', '...')
            ->call('save')
            ->assertRedirect('/posts');
    }
}
```

추가적으로, 하드코딩된 URL 대신 특정 페이지 컴포넌트로 리디렉션되었는지도 검증할 수 있습니다.

```php
->assertRedirect(CreatePost::class);
```

### 이벤트 {#events}

컴포넌트 내에서 이벤트가 디스패치되었는지 확인하려면 `->assertDispatched()` 메서드를 사용할 수 있습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_creating_a_post_dispatches_event()
    {
        Livewire::test(CreatePost::class)
            ->set('title', 'Top 100 bubble bath brands')
            ->set('content', '...')
            ->call('save')
            ->assertDispatched('post-created');
    }
}
```

두 컴포넌트가 이벤트를 디스패치하고 리스닝하여 서로 통신할 수 있는지 테스트하는 것이 종종 유용합니다. `dispatch()` 메서드를 사용하여, `CreatePost` 컴포넌트가 `create-post` 이벤트를 디스패치하는 상황을 시뮬레이션해봅시다. 그런 다음, 해당 이벤트를 리스닝하는 `PostCountBadge` 컴포넌트가 게시물 수를 적절히 업데이트하는지 확인하겠습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\PostCountBadge;
use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class PostCountBadgeTest extends TestCase
{
    public function test_post_count_is_updated_when_event_is_dispatched()
    {
        $badge = Livewire::test(PostCountBadge::class)
            ->assertSee("0");

        Livewire::test(CreatePost::class)
            ->set('title', 'Tear-free: the greatest lie ever told')
            ->set('content', '...')
            ->call('save')
            ->assertDispatched('post-created');

        $badge->dispatch('post-created')
            ->assertSee("1");
    }
}
```

이벤트가 하나 이상의 파라미터와 함께 디스패치되었는지 확인해야 할 때도 있습니다. `banner-message`라는 이벤트를 `message`라는 파라미터와 함께 디스패치하는 `ShowPosts` 컴포넌트를 살펴봅시다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_notification_is_dispatched_when_deleting_a_post()
    {
        Livewire::test(ShowPosts::class)
            ->call('delete', postId: 3)
            ->assertDispatched('notify',
                message: 'The post was deleted',
            );
    }
}
```

컴포넌트가 디스패치하는 이벤트의 파라미터 값을 조건부로 검증해야 한다면, 아래와 같이 `assertDispatched` 메서드의 두 번째 인자로 클로저를 전달할 수 있습니다. 이 클로저는 첫 번째 인자로 이벤트 이름을, 두 번째 인자로 파라미터 배열을 받습니다. 클로저는 반드시 불리언 값을 반환해야 합니다.

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_notification_is_dispatched_when_deleting_a_post()
    {
        Livewire::test(ShowPosts::class)
            ->call('delete', postId: 3)
            ->assertDispatched('notify', function($eventName, $params) {
                return ($params['message'] ?? '') === 'The post was deleted';
            })
    }
}
```

## 사용 가능한 모든 테스트 유틸리티 {#all-available-testing-utilities}

Livewire는 훨씬 더 많은 테스트 유틸리티를 제공합니다. 아래는 사용 가능한 모든 테스트 메서드와 그 용도에 대한 간단한 설명을 포함한 포괄적인 목록입니다:

### Setup methods {#setup-methods}
| 메서드                                                  | 설명                                                                                                      |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `Livewire::test(CreatePost::class)`                      | `CreatePost` 컴포넌트를 테스트합니다 |
| `Livewire::test(UpdatePost::class, ['post' => $post])`                      | `post` 파라미터와 함께 `UpdatePost` 컴포넌트를 테스트합니다 (`mount()` 메서드를 통해 전달받음) |
| `Livewire::actingAs($user)`                      | 지정한 사용자를 세션의 인증된 사용자로 설정합니다 |
| `Livewire::withQueryParams(['search' => '...'])`                      | 테스트의 `search` URL 쿼리 파라미터를 지정한 값(예: `?search=...`)으로 설정합니다. 주로 Livewire의 [`#[Url]` 속성](/docs/url)을 사용하는 프로퍼티와 관련하여 사용됩니다 |
| `Livewire::withCookie('color', 'blue')`                      | 테스트의 `color` 쿠키를 지정한 값(`blue`)으로 설정합니다. |
| `Livewire::withCookies(['color' => 'blue', 'name' => 'Taylor])`                      | 테스트의 `color`와 `name` 쿠키를 각각 지정한 값(`blue`, `Taylor`)으로 설정합니다. |
| `Livewire::withHeaders(['X-COLOR' => 'blue', 'X-NAME' => 'Taylor])`                      | 테스트의 `X-COLOR`와 `X-NAME` 헤더를 각각 지정한 값(`blue`, `Taylor`)으로 설정합니다. |
| `Livewire::withoutLazyLoading()`                      | 이 컴포넌트와 모든 자식 컴포넌트에서 지연 로딩을 비활성화합니다. |


### 컴포넌트와 상호작용하기 {#interacting-with-components}
| 메서드                                                  | 설명                                                                                                      |
|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `set('title', '...')`                      | `title` 속성에 제공된 값을 설정합니다 |
| `set(['title' => '...', ...])`                      | 연관 배열을 사용하여 여러 컴포넌트 속성을 설정합니다 |
| `toggle('sortAsc')`                      | `sortAsc` 속성을 `true`와 `false` 사이에서 토글합니다  |
| `call('save')`                      | `save` 액션/메서드를 호출합니다 |
| `call('remove', $post->id)`                      | `remove` 메서드를 호출하고 첫 번째 매개변수로 `$post->id`를 전달합니다 (이후 매개변수도 허용) |
| `refresh()`                      | 컴포넌트의 다시 렌더링을 트리거합니다 |
| `dispatch('post-created')`                      | 컴포넌트에서 `post-created` 이벤트를 디스패치합니다  |
| `dispatch('post-created', postId: $post->id)`                      | `$post->id`를 추가 매개변수로 하여 `post-created` 이벤트를 디스패치합니다 (Alpine의 `$event.detail`) |

### 어설션 {#assertions}
| 메서드                                                | 설명                                                                                                                                                                          |
|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `assertSet('title', '...')`                           | `title` 속성이 제공된 값으로 설정되었는지 확인합니다                                                                                                                        |
| `assertNotSet('title', '...')`                        | `title` 속성이 제공된 값으로 설정되지 않았는지 확인합니다                                                                                                                    |
| `assertSetStrict('title', '...')`                     | `title` 속성이 엄격한 비교로 제공된 값으로 설정되었는지 확인합니다                                                                                                                        |
| `assertNotSetStrict('title', '...')`                  | `title` 속성이 엄격한 비교로 제공된 값으로 설정되지 않았는지 확인합니다                                                                                                                  |
| `assertReturned('...')`                               | 이전 `->call(...)`이(가) 주어진 값을 반환했는지 확인합니다
| `assertCount('posts', 3)`                             | `posts` 속성이 3개의 항목을 가진 배열 또는 배열과 유사한 값인지 확인합니다                                                                                                         |
| `assertSnapshotSet('date', '08/26/1990')`             | `date` 속성의 원시/탈수화된 값(JSON에서)이 `08/26/1990`으로 설정되었는지 확인합니다. `date`의 하이드레이트된 `DateTime` 인스턴스 대신 사용할 수 있습니다. |
| `assertSnapshotNotSet('date', '08/26/1990')`          | `date`의 원시/탈수화된 값이 제공된 값과 같지 않은지 확인합니다                                                                                                       |
| `assertSee($post->title)`                             | 컴포넌트의 렌더링된 HTML에 제공된 값이 포함되어 있는지 확인합니다                                                                                                           |
| `assertDontSee($post->title)`                         | 렌더링된 HTML에 제공된 값이 포함되어 있지 않은지 확인합니다                                                                                                                    |
| `assertSeeHtml('<div>...</div>')`                     | 제공된 문자열 리터럴이 HTML 문자를 이스케이프하지 않고 렌더링된 HTML에 포함되어 있는지 확인합니다 (`assertSee`는 기본적으로 문자를 이스케이프함) |
| `assertDontSeeHtml('<div>...</div>')`                 | 제공된 문자열이 렌더링된 HTML에 포함되어 있지 않은지 확인합니다                                                                                                                         |
| `assertSeeText($post->title)`                         | 제공된 문자열이 렌더링된 HTML 텍스트 내에 포함되어 있는지 확인합니다. 어설션 전에 렌더링된 내용은 PHP의 `strip_tags` 함수로 처리됩니다                                                                                          |
| `assertDontSeeText($post->title)`                     | 제공된 문자열이 렌더링된 HTML 텍스트 내에 포함되어 있지 않은지 확인합니다. 어설션 전에 렌더링된 내용은 PHP의 `strip_tags` 함수로 처리됩니다                                                                                |
| `assertSeeInOrder(['...', '...'])`                    | 제공된 문자열들이 컴포넌트의 렌더링된 HTML 출력에서 순서대로 나타나는지 확인합니다                                                                                        |
| `assertSeeHtmlInOrder([$firstString, $secondString])` | 제공된 HTML 문자열들이 컴포넌트의 렌더링된 출력에서 순서대로 나타나는지 확인합니다                                                                                        |
| `assertDispatched('post-created')`                    | 컴포넌트에서 주어진 이벤트가 디스패치되었는지 확인합니다                                                                                                                     |
| `assertNotDispatched('post-created')`                 | 컴포넌트에서 주어진 이벤트가 디스패치되지 않았는지 확인합니다                                                                                                                 |
| `assertHasErrors('title')`                            | `title` 속성에 대한 유효성 검사에 실패했는지 확인합니다                                                                                                                           |
| `assertHasErrors(['title' => ['required', 'min:6']])`   | `title` 속성에 대해 제공된 유효성 검사 규칙이 실패했는지 확인합니다                                                                                                            |
| `assertHasNoErrors('title')`                          | `title` 속성에 대한 유효성 검사 오류가 없는지 확인합니다                                                                                                                  |
| `assertHasNoErrors(['title' => ['required', 'min:6']])` | `title` 속성에 대해 제공된 유효성 검사 규칙이 실패하지 않았는지 확인합니다                                                                                                    |
| `assertRedirect()`                                    | 컴포넌트 내에서 리디렉션이 발생했는지 확인합니다                                                                                                                  |
| `assertRedirect('/posts')`                            | 컴포넌트가 `/posts` 엔드포인트로 리디렉션을 발생시켰는지 확인합니다                                                                                                                   |
| `assertRedirect(ShowPosts::class)`                    | 컴포넌트가 `ShowPosts` 컴포넌트로 리디렉션을 발생시켰는지 확인합니다                                                                                                          |
| `assertRedirectToRoute('name', ['parameters'])`       | 컴포넌트가 주어진 라우트로 리디렉션을 발생시켰는지 확인합니다                                                                                                                    |
| `assertNoRedirect()`                                  | 리디렉션이 발생하지 않았는지 확인합니다                                                                                                                                           |
| `assertViewHas('posts')`                              | `render()` 메서드가 뷰 데이터에 `posts` 항목을 전달했는지 확인합니다                                                                                                         |
| `assertViewHas('postCount', 3)`                       | `postCount` 변수가 값 `3`으로 뷰에 전달되었는지 확인합니다                                                                                                   |
| `assertViewHas('posts', function ($posts) { ... })`   | `posts` 뷰 데이터가 존재하며, 제공된 콜백에서 선언된 모든 어설션을 통과하는지 확인합니다                                                                         |
| `assertViewIs('livewire.show-posts')`                 | 컴포넌트의 render 메서드가 제공된 뷰 이름을 반환했는지 확인합니다                                                                                                            |
| `assertFileDownloaded()`                              | 파일 다운로드가 트리거되었는지 확인합니다                                                                                                                                       |
| `assertFileDownloaded($filename)`                     | 제공된 파일 이름과 일치하는 파일 다운로드가 트리거되었는지 확인합니다                                                                                                       |
| `assertNoFileDownloaded()`                            | 파일 다운로드가 트리거되지 않았는지 확인합니다                                                                                                                                       |
| `assertUnauthorized()`                                | 컴포넌트 내에서 인증 예외가 발생했는지 확인합니다 (상태 코드: 401)                                                                                       |
| `assertForbidden()`                                   | 상태 코드 403으로 에러 응답이 트리거되었는지 확인합니다                                                                                                                |
| `assertStatus(500)`                                   | 최신 응답이 제공된 상태 코드와 일치하는지 확인합니다                                                                                                                     |
