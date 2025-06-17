# 이벤트
Livewire는 페이지의 서로 다른 컴포넌트 간에 통신할 수 있는 강력한 이벤트 시스템을 제공합니다. 내부적으로 브라우저 이벤트를 사용하기 때문에, Livewire의 이벤트 시스템을 통해 Alpine 컴포넌트나 일반 바닐라 자바스크립트와도 통신할 수 있습니다.

이벤트를 트리거하려면 컴포넌트 내부 어디에서든 `dispatch()` 메서드를 사용할 수 있으며, 페이지의 다른 어떤 컴포넌트에서도 해당 이벤트를 청취할 수 있습니다.

## 이벤트 디스패치하기 {#dispatching-events}

Livewire 컴포넌트에서 이벤트를 디스패치하려면, `dispatch()` 메서드를 호출하고 이벤트 이름과 함께 이벤트와 함께 전달할 추가 데이터를 인자로 넘기면 됩니다.

아래는 `CreatePost` 컴포넌트에서 `post-created` 이벤트를 디스패치하는 예시입니다:
```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created'); // [tl! highlight]
    }
}
```

이 예시에서 `dispatch()` 메서드가 호출되면, `post-created` 이벤트가 디스패치되고, 이 이벤트를 리스닝하고 있는 페이지의 모든 다른 컴포넌트가 알림을 받게 됩니다.

이벤트와 함께 추가 데이터를 전달하려면, `dispatch()` 메서드의 두 번째 인자로 데이터를 넘기면 됩니다:

```php
$this->dispatch('post-created', title: $post->title);
```

## 이벤트 수신 대기 {#listening-for-events}

Livewire 컴포넌트에서 이벤트를 수신하려면, 해당 이벤트가 디스패치될 때 호출되길 원하는 메서드 위에 `#[On]` 속성을 추가하세요:

> [!warning] 속성 클래스 임포트 필수
> 모든 속성 클래스를 반드시 임포트해야 합니다. 예를 들어, 아래의 `#[On()]` 속성을 사용하려면 `use Livewire\Attributes\On;`을 임포트해야 합니다.

```php
use Livewire\Component;
use Livewire\Attributes\On; // [tl! highlight]

class Dashboard extends Component
{
	#[On('post-created')] // [tl! highlight]
    public function updatePostList($title)
    {
		// ...
    }
}
```

이제 `CreatePost`에서 `post-created` 이벤트가 디스패치되면 네트워크 요청이 발생하고, `updatePostList()` 액션이 호출됩니다.

보시다시피, 이벤트와 함께 전달된 추가 데이터는 해당 액션의 첫 번째 인자로 제공됩니다.

### 동적 이벤트 이름 리스닝 {#listening-for-dynamic-event-names}

때때로, 컴포넌트의 데이터를 사용하여 런타임에 이벤트 리스너 이름을 동적으로 생성하고 싶을 수 있습니다.

예를 들어, 특정 Eloquent 모델에 이벤트 리스너의 범위를 지정하고 싶다면, 이벤트를 디스패치할 때 모델의 ID를 이벤트 이름에 추가할 수 있습니다:

```php
use Livewire\Component;

class UpdatePost extends Component
{
    public function update()
    {
        // ...

        $this->dispatch("post-updated.{$post->id}"); // [tl! highlight]
    }
}
```

그리고 그 특정 모델에 대해 리스닝할 수 있습니다:

```php
use Livewire\Component;
use App\Models\Post;
use Livewire\Attributes\On; // [tl! highlight]

class ShowPost extends Component
{
    public Post $post;

	#[On('post-updated.{post.id}')] // [tl! highlight]
    public function refreshPost()
    {
		// ...
    }
}
```

위의 `$post` 모델의 ID가 `3`이라면, `refreshPost()` 메서드는 `post-updated.3`이라는 이름의 이벤트에 의해서만 트리거됩니다.

### 특정 자식 컴포넌트의 이벤트 리스닝 {#listening-for-events-from-specific-child-components}

Livewire를 사용하면 Blade 템플릿에서 개별 자식 컴포넌트의 이벤트를 직접 리스닝할 수 있습니다:

```blade
<div>
    <livewire:edit-post @saved="$refresh">

    <!-- ... -->
</div>
```

위 예시에서 `edit-post` 자식 컴포넌트가 `saved` 이벤트를 디스패치하면, 부모의 `$refresh`가 호출되어 부모가 새로고침됩니다.

`$refresh`를 전달하는 대신, 평소 `wire:click` 등에 전달하는 메서드를 사용할 수도 있습니다. 예를 들어, 모달 다이얼로그를 닫는 `close()` 메서드를 호출하는 예시는 다음과 같습니다:

```blade
<livewire:edit-post @saved="close">
```

만약 자식 컴포넌트가 파라미터와 함께 이벤트를 디스패치했다면, 예를 들어 `$this->dispatch('saved', postId: 1)`와 같이 했다면, 다음과 같은 문법으로 해당 값을 부모 메서드에 전달할 수 있습니다:

```blade
<livewire:edit-post @saved="close($event.detail.postId)">
```

## 이벤트와 상호작용하기 위해 JavaScript 사용하기 {#using-javascript-to-interact-with-events}

Livewire의 이벤트 시스템은 애플리케이션 내부에서 JavaScript로 상호작용할 때 훨씬 더 강력해집니다. 이를 통해 애플리케이션의 다른 JavaScript가 페이지의 Livewire 컴포넌트와 통신할 수 있는 기능이 열립니다.

### 컴포넌트 스크립트 내부에서 이벤트 리스닝하기 {#listening-for-events-inside-component-scripts}

아래와 같이 `@script` 지시문을 사용하여 컴포넌트의 템플릿 내부에서 `post-created` 이벤트를 쉽게 감지할 수 있습니다:

```html
@script
<script>
    $wire.on('post-created', () => {
        //
    });
</script>
@endscript
```

위 코드는 해당 컴포넌트 내에서 발생하는 `post-created` 이벤트를 감지합니다. 만약 해당 컴포넌트가 페이지에 더 이상 존재하지 않는다면, 이벤트 리스너도 더 이상 동작하지 않습니다.

[Livewire 컴포넌트에서 JavaScript 사용에 대해 더 알아보기 →](/livewire/3.x/javascript#using-javascript-in-livewire-components)

### 컴포넌트 스크립트에서 이벤트 디스패치하기 {#dispatching-events-from-component-scripts}

또한, 컴포넌트의 `@script` 내부에서 다음과 같이 이벤트를 디스패치할 수 있습니다:

```html
@script
<script>
    $wire.dispatch('post-created');
</script>
@endscript
```

위의 `@script`가 실행되면, `post-created` 이벤트가 해당 컴포넌트에 디스패치됩니다.

스크립트가 위치한 컴포넌트에만 이벤트를 디스패치하고, 페이지의 다른 컴포넌트에는 전달되지 않도록(이벤트가 "버블링"되는 것을 방지) 하려면 `dispatchSelf()`를 사용할 수 있습니다:

```js
$wire.dispatchSelf('post-created');
```

이벤트에 추가 파라미터를 전달하려면, `dispatch()`의 두 번째 인자로 객체를 넘기면 됩니다:

```html
@script
<script>
    $wire.dispatch('post-created', { refreshPosts: true });
</script>
@endscript
```

이제 이러한 이벤트 파라미터는 Livewire 클래스와 다른 자바스크립트 이벤트 리스너 모두에서 접근할 수 있습니다.

다음은 Livewire 클래스 내에서 `refreshPosts` 파라미터를 받는 예시입니다:

```php
use Livewire\Attributes\On;

// ...

#[On('post-created')]
public function handleNewPost($refreshPosts = false)
{
    //
}
```

또한 자바스크립트 이벤트 리스너에서 이벤트의 `detail` 속성을 통해 `refreshPosts` 파라미터에 접근할 수 있습니다:

```html
@script
<script>
    $wire.on('post-created', (event) => {
        let refreshPosts = event.detail.refreshPosts

        // ...
    });
</script>
@endscript
```

[Livewire 컴포넌트에서 자바스크립트 사용에 대해 더 알아보기 →](/livewire/3.x/javascript#using-javascript-in-livewire-components)

### 전역 JavaScript에서 Livewire 이벤트 리스닝하기 {#listening-for-livewire-events-from-global-javascript}

또는 애플리케이션의 어떤 스크립트에서든 `Livewire.on`을 사용하여 Livewire 이벤트를 전역적으로 리스닝할 수 있습니다:

```html
<script>
    document.addEventListener('livewire:init', () => {
       Livewire.on('post-created', (event) => {
           //
       });
    });
</script>
```

위의 코드는 페이지의 어떤 컴포넌트에서든 디스패치된 `post-created` 이벤트를 리스닝합니다.

이벤트 리스너를 어떤 이유로든 제거하고 싶다면, 반환된 `cleanup` 함수를 사용하면 됩니다:

```html
<script>
    document.addEventListener('livewire:init', () => {
        let cleanup = Livewire.on('post-created', (event) => {
            //
        });

        // "cleanup()"을 호출하면 위의 이벤트 리스너가 해제됩니다...
        cleanup();
    });
</script>
```

## Alpine에서의 이벤트 {#events-in-alpine}

Livewire 이벤트는 내부적으로 일반 브라우저 이벤트이기 때문에, Alpine을 사용하여 해당 이벤트를 수신하거나 직접 디스패치할 수 있습니다.

### Alpine에서 Livewire 이벤트 리스닝하기 {#listening-for-livewire-events-in-alpine}

예를 들어, Alpine을 사용하여 `post-created` 이벤트를 쉽게 리스닝할 수 있습니다:

```blade
<div x-on:post-created="..."></div>
```

위의 코드는 `x-on` 디렉티브가 할당된 HTML 요소의 자식인 모든 Livewire 컴포넌트에서 발생하는 `post-created` 이벤트를 리스닝합니다.

페이지의 모든 Livewire 컴포넌트에서 발생하는 이벤트를 리스닝하려면, 리스너에 `.window`를 추가하면 됩니다:

```blade
<div x-on:post-created.window="..."></div>
```

이벤트와 함께 전송된 추가 데이터를 접근하고 싶다면, `$event.detail`을 사용할 수 있습니다:

```blade
<div x-on:post-created="notify('New post: ' + $event.detail.title)"></div>
```

Alpine 공식 문서에서 [이벤트 리스닝](https://alpinejs.dev/directives/on)에 대한 추가 정보를 확인할 수 있습니다.

### Alpine에서 Livewire 이벤트 디스패치하기 {#dispatching-livewire-events-from-alpine}

Alpine에서 디스패치된 모든 이벤트는 Livewire 컴포넌트에서 가로챌 수 있습니다.

예를 들어, Alpine에서 `post-created` 이벤트를 쉽게 디스패치할 수 있습니다:

```blade
<button @click="$dispatch('post-created')">...</button>
```

Livewire의 `dispatch()` 메서드처럼, 이벤트와 함께 추가 데이터를 두 번째 인자로 전달할 수 있습니다:

```blade
<button @click="$dispatch('post-created', { title: 'Post Title' })">...</button>
```

Alpine을 사용하여 이벤트를 디스패치하는 방법에 대해 더 알고 싶다면 [Alpine 문서](https://alpinejs.dev/magics/dispatch)를 참고하세요.

> [!tip] 이벤트가 필요하지 않을 수도 있습니다
> 자식에서 부모의 동작을 호출하기 위해 이벤트를 사용하고 있다면, Blade 템플릿에서 `$parent`를 사용하여 자식에서 직접 액션을 호출할 수 있습니다. 예를 들어:
>
> ```blade
> <button wire:click="$parent.showCreatePostForm()">Create Post</button>
> ```
>
> [$parent에 대해 더 알아보기](/livewire/3.x/nesting#directly-accessing-the-parent-from-the-child).

## 다른 컴포넌트로 직접 디스패치하기 {#dispatching-directly-to-another-component}

페이지에 있는 두 컴포넌트 간에 직접적으로 이벤트로 소통하고 싶다면, `dispatch()->to()` 수식어를 사용할 수 있습니다.

아래는 `CreatePost` 컴포넌트가 `post-created` 이벤트를 `Dashboard` 컴포넌트로 직접 디스패치하여, 해당 이벤트를 듣고 있는 다른 컴포넌트들은 건너뛰는 예시입니다:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created')->to(Dashboard::class);
    }
}
```

## 컴포넌트 이벤트를 자기 자신에게 디스패치하기 {#dispatching-a-component-event-to-itself}

`dispatch()->self()` 수식어를 사용하면, 이벤트가 트리거된 컴포넌트에서만 해당 이벤트를 가로챌 수 있도록 제한할 수 있습니다:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created')->self();
    }
}
```

## Blade 템플릿에서 이벤트 디스패치하기 {#dispatching-events-from-blade-templates}

Blade 템플릿에서 `$dispatch` JavaScript 함수를 사용하여 직접 이벤트를 디스패치할 수 있습니다. 이는 버튼 클릭과 같은 사용자 상호작용에서 이벤트를 트리거하고 싶을 때 유용합니다:

```blade
<button wire:click="$dispatch('show-post-modal', { id: {{ $post->id }} })">
    EditPost
</button>
```

이 예시에서 버튼이 클릭되면, 지정된 데이터와 함께 `show-post-modal` 이벤트가 디스패치됩니다.

다른 컴포넌트로 직접 이벤트를 디스패치하고 싶다면 `$dispatchTo()` JavaScript 함수를 사용할 수 있습니다:

```blade
<button wire:click="$dispatchTo('posts', 'show-post-modal', { id: {{ $post->id }} })">
    EditPost
</button>
```

이 예시에서 버튼이 클릭되면, `show-post-modal` 이벤트가 `Posts` 컴포넌트로 직접 디스패치됩니다.

## 디스패치된 이벤트 테스트하기 {#testing-dispatched-events}

컴포넌트에서 디스패치된 이벤트를 테스트하려면 Livewire 테스트에서 `assertDispatched()` 메서드를 사용하세요. 이 메서드는 컴포넌트의 라이프사이클 동안 특정 이벤트가 디스패치되었는지 확인합니다:

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Livewire\CreatePost;
use Livewire\Livewire;

class CreatePostTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_dispatches_post_created_event()
    {
        Livewire::test(CreatePost::class)
            ->call('save')
            ->assertDispatched('post-created');
    }
}
```

이 예제에서는 `CreatePost` 컴포넌트에서 `save()` 메서드를 호출할 때 `post-created` 이벤트가 지정된 데이터와 함께 디스패치되는지 테스트합니다.

### 이벤트 리스너 테스트하기 {#testing-event-listeners}

이벤트 리스너를 테스트하려면, 테스트 환경에서 이벤트를 디스패치하고 해당 이벤트에 대한 예상 동작이 수행되는지 검증할 수 있습니다:

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Livewire\Dashboard;
use Livewire\Livewire;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_post_count_when_a_post_is_created()
    {
        Livewire::test(Dashboard::class)
            ->assertSee('Posts created: 0')
            ->dispatch('post-created')
            ->assertSee('Posts created: 1');
    }
}
```

이 예제에서 테스트는 `post-created` 이벤트를 디스패치한 후, `Dashboard` 컴포넌트가 해당 이벤트를 올바르게 처리하고 업데이트된 개수를 표시하는지 확인합니다.

## Laravel Echo를 사용한 실시간 이벤트 {#real-time-events-using-laravel-echo}

Livewire는 [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation)와 잘 연동되어 WebSocket을 사용한 웹 페이지의 실시간 기능을 제공합니다.

> [!warning] Laravel Echo 설치가 선행되어야 합니다
> 이 기능을 사용하려면 Laravel Echo가 설치되어 있고, `window.Echo` 객체가 애플리케이션에서 전역으로 사용 가능해야 합니다. Echo 설치에 대한 자세한 내용은 [Laravel Echo 문서](https://laravel.com/docs/broadcasting#client-side-installation)를 참고하세요.

### Echo 이벤트 리스닝 {#listening-for-echo-events}

Laravel 애플리케이션에 `OrderShipped`라는 이벤트가 있다고 가정해봅시다:

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;

    public function broadcastOn()
    {
        return new Channel('orders');
    }
}
```

애플리케이션의 다른 부분에서 이 이벤트를 다음과 같이 디스패치할 수 있습니다:

```php
use App\Events\OrderShipped;

OrderShipped::dispatch();
```

만약 JavaScript에서 Laravel Echo만을 사용하여 이 이벤트를 리스닝한다면, 다음과 같이 작성할 수 있습니다:

```js
Echo.channel('orders')
    .listen('OrderShipped', e => {
        console.log(e.order)
    })
```

Laravel Echo가 설치 및 구성되어 있다고 가정하면, Livewire 컴포넌트 내부에서도 이 이벤트를 리스닝할 수 있습니다.

아래는 `OrderShipped` 이벤트를 리스닝하여 사용자에게 새 주문 알림을 시각적으로 표시하는 `OrderTracker` 컴포넌트의 예시입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On; // [tl! highlight]
use Livewire\Component;

class OrderTracker extends Component
{
    public $showNewOrderNotification = false;

    #[On('echo:orders,OrderShipped')]
    public function notifyNewOrder()
    {
        $this->showNewOrderNotification = true;
    }

    // ...
}
```

만약 Echo 채널에 변수(예: 주문 ID)가 포함되어 있다면, `#[On]` 속성 대신 `getListeners()` 메서드를 통해 리스너를 정의할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On; // [tl! highlight]
use Livewire\Component;
use App\Models\Order;

class OrderTracker extends Component
{
    public Order $order;

    public $showOrderShippedNotification = false;

    public function getListeners()
    {
        return [
            "echo:orders.{$this->order->id},OrderShipped" => 'notifyShipped',
        ];
    }

    public function notifyShipped()
    {
        $this->showOrderShippedNotification = true;
    }

    // ...
}
```

또는, 동적 이벤트 이름 문법을 사용할 수도 있습니다:

```php
#[On('echo:orders.{order.id},OrderShipped')]
public function notifyNewOrder()
{
    $this->showNewOrderNotification = true;
}
```

이벤트 페이로드에 접근해야 한다면, 전달된 `$event` 파라미터를 통해 접근할 수 있습니다:

```php
#[On('echo:orders.{order.id},OrderShipped')]
public function notifyNewOrder($event)
{
    $order = Order::find($event['orderId']);

    //
}
```

### 프라이빗 & 프레즌스 채널 {#private-presence-channels}

프라이빗 및 프레즌스 채널로 브로드캐스트된 이벤트도 수신할 수 있습니다:

> [!info]
> 진행하기 전에, 브로드캐스트 채널에 대한 <a href="https://laravel.com/docs/master/broadcasting#defining-authorization-callbacks">인증 콜백</a>을 정의했는지 확인하세요.

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class OrderTracker extends Component
{
    public $showNewOrderNotification = false;

    public function getListeners()
    {
        return [
            // 퍼블릭 채널
            "echo:orders,OrderShipped" => 'notifyNewOrder',

            // 프라이빗 채널
            "echo-private:orders,OrderShipped" => 'notifyNewOrder',

            // 프레즌스 채널
            "echo-presence:orders,OrderShipped" => 'notifyNewOrder',
            "echo-presence:orders,here" => 'notifyNewOrder',
            "echo-presence:orders,joining" => 'notifyNewOrder',
            "echo-presence:orders,leaving" => 'notifyNewOrder',
        ];
    }

    public function notifyNewOrder()
    {
        $this->showNewOrderNotification = true;
    }
}
```
