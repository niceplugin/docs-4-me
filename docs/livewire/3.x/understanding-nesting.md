# [개념] 중첩 이해하기
다른 많은 컴포넌트 기반 프레임워크와 마찬가지로, Livewire 컴포넌트는 중첩이 가능합니다. 즉, 하나의 컴포넌트가 자신 안에 여러 컴포넌트를 렌더링할 수 있습니다.

하지만 Livewire의 중첩 시스템은 다른 프레임워크와 다르게 설계되어 있기 때문에, 반드시 알아두어야 할 몇 가지 중요한 의미와 제약이 있습니다.

> [!tip] 먼저 하이드레이션을 이해하세요
> Livewire의 중첩 시스템을 더 배우기 전에, Livewire가 컴포넌트를 어떻게 하이드레이트하는지 완전히 이해하는 것이 도움이 됩니다. 자세한 내용은 [하이드레이션 문서](/livewire/3.x/hydration)를 참고하세요.

## 모든 컴포넌트는 독립적인 섬입니다 {#every-component-is-an-island}

Livewire에서 페이지의 모든 컴포넌트는 자신의 상태를 추적하고, 다른 컴포넌트와 독립적으로 업데이트를 수행합니다.

예를 들어, 다음과 같은 `Posts` 컴포넌트와 중첩된 `ShowPost` 컴포넌트를 살펴보겠습니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Posts extends Component
{
    public $postLimit = 2;

    public function render()
    {
        return view('livewire.posts', [
            'posts' => Auth::user()->posts()
                ->limit($this->postLimit)->get(),
        ]);
    }
}
```

```blade
<div>
    Post Limit: <input type="number" wire:model.live="postLimit">

    @foreach ($posts as $post)
        <livewire:show-post :$post :key="$post->id">
    @endforeach
</div>
```

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```blade
<div>
    <h1>{{ $post->title }}</h1>

    <p>{{ $post->content }}</p>

    <button wire:click="$refresh">Refresh post</button>
</div>
```

초기 페이지 로드 시 전체 컴포넌트 트리의 HTML은 다음과 같을 수 있습니다:

```html
<div wire:id="123" wire:snapshot="...">
    Post Limit: <input type="number" wire:model.live="postLimit">

    <div wire:id="456" wire:snapshot="...">
        <h1>The first post</h1>

        <p>Post content</p>

        <button wire:click="$refresh">Refresh post</button>
    </div>

    <div wire:id="789" wire:snapshot="...">
        <h1>The second post</h1>

        <p>Post content</p>

        <button wire:click="$refresh">Refresh post</button>
    </div>
</div>
```

부모 컴포넌트가 자신의 렌더링된 템플릿뿐만 아니라, 그 안에 중첩된 모든 컴포넌트의 렌더링된 템플릿도 포함하고 있다는 점에 주목하세요.

각 컴포넌트는 독립적이기 때문에, 각각의 HTML에는 Livewire의 자바스크립트 코어가 추출하고 추적할 수 있도록 고유한 ID와 스냅샷(`wire:id`와 `wire:snapshot`)이 포함되어 있습니다.

이제 다양한 업데이트 시나리오를 살펴보며, Livewire가 서로 다른 중첩 수준에서 어떻게 동작하는지 차이점을 알아보겠습니다.

### 자식 컴포넌트 업데이트하기 {#updating-a-child}

만약 자식 `show-post` 컴포넌트 중 하나에서 "Refresh post" 버튼을 클릭한다면, 서버로 전송되는 내용은 다음과 같습니다:

```js
{
    memo: { name: 'show-post', id: '456' },

    state: { ... },
}
```

서버에서 다시 전송되는 HTML은 다음과 같습니다:

```html
<div wire:id="456">
    <h1>The first post</h1>

    <p>Post content</p>

    <button wire:click="$refresh">Refresh post</button>
</div>
```

여기서 중요한 점은, 자식 컴포넌트에서 업데이트가 발생하면 해당 컴포넌트의 데이터만 서버로 전송되고, 해당 컴포넌트만 다시 렌더링된다는 것입니다.

이제 덜 직관적인 시나리오인 부모 컴포넌트 업데이트에 대해 살펴보겠습니다.

### 부모 업데이트하기 {#updating-the-parent}

다시 한 번 상기시키자면, 아래는 부모 `Posts` 컴포넌트의 Blade 템플릿입니다:

```blade
<div>
    Post Limit: <input type="number" wire:model.live="postLimit">

    @foreach ($posts as $post)
        <livewire:show-post :$post :key="$post->id">
    @endforeach
</div>
```

사용자가 "Post Limit" 값을 `2`에서 `1`로 변경하면, 부모 컴포넌트에만 업데이트가 트리거됩니다.

요청 페이로드 예시는 다음과 같습니다:

```js
{
    updates: { postLimit: 1 },

    snapshot: {
        memo: { name: 'posts', id: '123' },

        state: { postLimit: 2, ... },
    },
}
```

보시다시피, 부모 `Posts` 컴포넌트의 스냅샷만 서버로 전송됩니다.

여기서 중요한 질문이 생깁니다. 부모 컴포넌트가 다시 렌더링될 때, 자식 `show-post` 컴포넌트들을 만나면 어떻게 될까요? 자식 컴포넌트의 스냅샷이 요청 페이로드에 포함되어 있지 않은데, 어떻게 자식들을 다시 렌더링할 수 있을까요?

정답은: 자식들은 다시 렌더링되지 않습니다.

Livewire가 `Posts` 컴포넌트를 렌더링할 때, 만나는 모든 자식 컴포넌트에 대해 플레이스홀더를 렌더링합니다.

위와 같은 업데이트 이후, `Posts` 컴포넌트의 렌더링된 HTML 예시는 다음과 같습니다:

```html
<div wire:id="123">
    Post Limit: <input type="number" wire:model.live="postLimit">

    <div wire:id="456"></div>
</div>
```

보시다시피, `postLimit`이 `1`로 업데이트되어 자식이 하나만 렌더링되었습니다. 하지만 전체 자식 컴포넌트 대신, 일치하는 `wire:id` 속성을 가진 빈 `<div></div>`만 존재하는 것을 볼 수 있습니다.

이 HTML이 프론트엔드에서 수신되면, Livewire는 이 컴포넌트의 기존 HTML을 새로운 HTML로 _변형(morph)_ 하지만, 자식 컴포넌트 플레이스홀더는 지능적으로 건너뜁니다.

이 효과로 인해, _변형_ 이후 부모 `Posts` 컴포넌트의 최종 DOM 내용은 다음과 같습니다:

```html
<div wire:id="123">
    Post Limit: <input type="number" wire:model.live="postLimit">

    <div wire:id="456">
        <h1>The first post</h1>

        <p>Post content</p>

        <button wire:click="$refresh">Refresh post</button>
    </div>
</div>
```

## 성능 영향 {#performance-implications}

Livewire의 "아일랜드" 아키텍처는 애플리케이션에 긍정적이면서도 부정적인 영향을 모두 미칠 수 있습니다.

이 아키텍처의 장점은 애플리케이션에서 비용이 많이 드는 부분을 격리할 수 있다는 점입니다. 예를 들어, 느린 데이터베이스 쿼리를 독립적인 컴포넌트로 분리하면, 그로 인한 성능 저하가 페이지의 다른 부분에 영향을 주지 않습니다.

하지만 이 접근 방식의 가장 큰 단점은 컴포넌트들이 완전히 분리되어 있기 때문에, 컴포넌트 간의 통신이나 의존성이 더 어려워진다는 점입니다.

예를 들어, 상위 `Posts` 컴포넌트에서 하위 `ShowPost` 컴포넌트로 속성을 전달하는 경우, 이 속성은 "반응형"이 되지 않습니다. 각 컴포넌트가 아일랜드이기 때문에, 상위 컴포넌트에서 `ShowPost`로 전달되는 속성의 값이 변경되어도, `ShowPost` 내부에서는 업데이트되지 않습니다.

Livewire는 이러한 여러 문제를 극복했으며, [반응형 속성](/livewire/3.x/nesting#reactive-props), [모델링 가능한 컴포넌트](/livewire/3.x/nesting#binding-to-child-data-using-wiremodel), [ `$parent` 객체](/livewire/3.x/nesting#directly-accessing-the-parent-from-the-child)와 같은 전용 API를 제공합니다.

중첩된 Livewire 컴포넌트가 어떻게 동작하는지에 대한 이 지식을 바탕으로, 애플리케이션 내에서 언제, 어떻게 컴포넌트를 중첩할지 더 현명하게 결정할 수 있습니다.



