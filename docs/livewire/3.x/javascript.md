# 자바스크립트
## Livewire 컴포넌트에서 JavaScript 사용하기 {#using-javascript-in-livewire-components}

Livewire와 Alpine은 동적인 컴포넌트를 HTML 내에서 직접 만들 수 있는 다양한 유틸리티를 제공합니다. 하지만 때로는 HTML을 벗어나 컴포넌트에 대해 순수 JavaScript를 실행하는 것이 도움이 될 때가 있습니다. Livewire의 `@script`와 `@assets` 디렉티브를 사용하면 이를 예측 가능하고 유지보수하기 쉬운 방식으로 할 수 있습니다.

### 스크립트 실행하기 {#executing-scripts}

Livewire 컴포넌트에서 맞춤 JavaScript를 실행하려면, `<script>` 요소를 `@script`와 `@endscript`로 감싸기만 하면 됩니다. 이렇게 하면 Livewire가 이 JavaScript의 실행을 처리하게 됩니다.

`@script` 내부의 스크립트는 Livewire에 의해 처리되기 때문에, 페이지가 로드된 후이면서 Livewire 컴포넌트가 렌더링되기 전의 완벽한 타이밍에 실행됩니다. 즉, 더 이상 스크립트를 제대로 로드하기 위해 `document.addEventListener('...')`로 감쌀 필요가 없습니다.

또한, 지연 로드되거나 조건부로 로드되는 Livewire 컴포넌트도 페이지가 초기화된 후에 JavaScript를 실행할 수 있습니다.

```blade
<div>
    ...
</div>

@script
<script>
    // 이 JavaScript는 이 컴포넌트가 페이지에 로드될 때마다 실행됩니다...
</script>
@endscript
```

아래는 Livewire 컴포넌트에서 사용할 JavaScript 액션을 등록하는 예시입니다.

```blade
<div>
    <button wire:click="$js.increment">+</button>
</div>

@script
<script>
    $js('increment', () => {
        console.log('increment')
    })
</script>
@endscript
```

JavaScript 액션에 대해 더 알아보려면, [액션 문서](/livewire/3.x/actions#javascript-actions)를 참고하세요.

### 스크립트에서 `$wire` 사용하기 {#using-wire-from-scripts}

자바스크립트에 `@script`를 사용할 때 또 다른 유용한 기능은 Livewire 컴포넌트의 `$wire` 객체에 자동으로 접근할 수 있다는 점입니다.

아래는 간단한 `setInterval`을 사용하여 컴포넌트를 2초마다 새로고침하는 예시입니다. (이 작업은 [`wire:poll`](/livewire/3.x/wire-poll)로도 쉽게 할 수 있지만, 이 방법이 개념을 설명하기에 간단합니다.)

`$wire`에 대해 더 알고 싶다면 [`$wire` 문서](#the-wire-object)를 참고하세요.

```blade
@script
<script>
    setInterval(() => {
        $wire.$refresh()
    }, 2000)
</script>
@endscript
```

### 일회성 JavaScript 표현식 평가하기 {#evaluating-one-off-javascript-expressions}

전체 메서드를 JavaScript에서 평가하도록 지정하는 것 외에도, `js()` 메서드를 사용하여 백엔드에서 더 작고 개별적인 표현식을 평가할 수 있습니다.

이는 일반적으로 서버 측 작업이 수행된 후 클라이언트 측에서 후속 작업을 수행할 때 유용합니다.

예를 들어, 다음은 게시글이 데이터베이스에 저장된 후 클라이언트 측 알림 대화상자를 트리거하는 `CreatePost` 컴포넌트의 예시입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = '';

    public function save()
    {
        // ...

        $this->js("alert('Post saved!')"); // [!code highlight:6]
    }
}
```

이제 JavaScript 표현식 `alert('Post saved!')`는 서버에서 게시글이 데이터베이스에 저장된 후 클라이언트에서 실행됩니다.

표현식 내부에서 현재 컴포넌트의 `$wire` 객체에 접근할 수 있습니다.

### 에셋 로딩 {#loading-assets}

`@script` 디렉티브는 Livewire 컴포넌트가 로드될 때마다 JavaScript 코드를 실행하는 데 유용하지만, 때로는 컴포넌트와 함께 전체 스크립트 및 스타일 에셋을 페이지에 로드하고 싶을 때가 있습니다.

다음은 `@assets`를 사용하여 [Pikaday](https://github.com/Pikaday/Pikaday)라는 날짜 선택기 라이브러리를 로드하고, `@script`를 사용해 컴포넌트 내부에서 초기화하는 예시입니다:

```blade
<div>
    <input type="text" data-picker>
</div>

@assets
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js" defer></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endassets

@script
<script>
    new Pikaday({ field: $wire.$el.querySelector('[data-picker]') });
</script>
@endscript
```

이 컴포넌트가 로드될 때, Livewire는 모든 `@script`를 평가하기 전에 해당 페이지에 `@assets`가 로드되도록 보장합니다. 또한, 제공된 `@assets`는 이 컴포넌트의 인스턴스가 페이지에 몇 개 있든 상관없이 페이지당 한 번만 로드되도록 보장합니다. 반면, `@script`는 페이지에 있는 모든 컴포넌트 인스턴스마다 평가됩니다.

## 글로벌 Livewire 이벤트 {#global-livewire-events}

Livewire는 외부 스크립트에서 커스텀 확장 포인트를 등록할 수 있도록 두 가지 유용한 브라우저 이벤트를 디스패치합니다:

```html
<script>
    document.addEventListener('livewire:init', () => {
        // Livewire가 로드된 후,
        // 페이지에서 초기화되기 전에 실행됩니다...
    })

    document.addEventListener('livewire:initialized', () => {
        // Livewire가 페이지에서 초기화를 마친 직후
        // 실행됩니다...
    })
</script>
```

> [!info]
> [커스텀 디렉티브](#registering-custom-directives)나 [라이프사이클 훅](#javascript-hooks)을 `livewire:init` 내부에 등록하면, Livewire가 페이지에서 초기화되기 전에 사용할 수 있으므로 유용합니다.

## `Livewire` 전역 객체 {#the-livewire-global-object}

Livewire의 전역 객체는 외부 스크립트에서 Livewire와 상호작용할 때 가장 좋은 출발점입니다.

클라이언트 측 코드 어디에서든 `window`의 전역 `Livewire` JavaScript 객체에 접근할 수 있습니다.

보통 `livewire:init` 이벤트 리스너 안에서 `window.Livewire`를 사용하는 것이 유용합니다.

### 컴포넌트 접근하기 {#accessing-components}

다음과 같은 메서드를 사용하여 현재 페이지에 로드된 특정 Livewire 컴포넌트에 접근할 수 있습니다:

```js
// 페이지에서 첫 번째 컴포넌트의 $wire 객체를 가져옵니다...
let component = Livewire.first()

// 주어진 ID로 컴포넌트의 `$wire` 객체를 가져옵니다...
let component = Livewire.find(id)

// 이름으로 컴포넌트 `$wire` 객체의 배열을 가져옵니다...
let components = Livewire.getByName(name)

// 페이지의 모든 컴포넌트에 대한 $wire 객체를 가져옵니다...
let components = Livewire.all()
```

> [!info]
> 이 메서드들은 각각 컴포넌트의 상태를 나타내는 `$wire` 객체를 반환합니다.
> <br><br>
> 이러한 객체에 대해 더 알고 싶다면 [ `$wire` 문서 ](#the-wire-object)를 참고하세요.

### 이벤트와 상호작용하기 {#interacting-with-events}

개별 컴포넌트에서 PHP로 이벤트를 디스패치하고 리스닝하는 것 외에도, 전역 `Livewire` 객체를 사용하면 애플리케이션 어디에서나 [Livewire의 이벤트 시스템](/livewire/3.x/events)과 상호작용할 수 있습니다:

```js
// 이벤트를 리스닝 중인 모든 Livewire 컴포넌트에 디스패치...
Livewire.dispatch('post-created', { postId: 2 })

// 지정한 Livewire 컴포넌트 이름에 이벤트를 디스패치...
Livewire.dispatchTo('dashboard', 'post-created', { postId: 2 })

// Livewire 컴포넌트에서 디스패치된 이벤트를 리스닝...
Livewire.on('post-created', ({ postId }) => {
    // ...
})
```

특정 상황에서는 전역 Livewire 이벤트의 등록을 해제해야 할 수도 있습니다. 예를 들어, Alpine 컴포넌트와 `wire:navigate`를 함께 사용할 때, 페이지 간 이동 시 `init`이 호출되어 여러 리스너가 등록될 수 있습니다. 이를 해결하려면 Alpine에서 자동으로 호출되는 `destroy` 함수를 활용하세요. 이 함수 내에서 모든 리스너를 순회하며 등록 해제하여 불필요한 누적을 방지할 수 있습니다.

```js
Alpine.data('MyComponent', () => ({
    listeners: [],
    init() {
        this.listeners.push(
            Livewire.on('post-created', (options) => {
                // 무언가를 수행...
            })
        );
    },
    destroy() {
        this.listeners.forEach((listener) => {
            listener();
        });
    }
}));
```
### 라이프사이클 훅 사용하기 {#using-lifecycle-hooks}

Livewire는 `Livewire.hook()`을 사용하여 전역 라이프사이클의 다양한 부분에 훅을 걸 수 있습니다:

```js
// 내부 Livewire 훅에서 실행할 콜백을 등록합니다...
Livewire.hook('component.init', ({ component, cleanup }) => {
    // ...
})
```

Livewire의 JavaScript 훅에 대한 더 많은 정보는 [아래에서 확인할 수 있습니다](#javascript-hooks).

### 커스텀 디렉티브 등록하기 {#registering-custom-directives}

Livewire는 `Livewire.directive()`를 사용하여 커스텀 디렉티브를 등록할 수 있습니다.

아래는 JavaScript의 `confirm()` 대화상자를 사용하여 서버로 액션이 전송되기 전에 확인 또는 취소할 수 있도록 하는 커스텀 `wire:confirm` 디렉티브의 예시입니다:

```html
<button wire:confirm="정말로 진행하시겠습니까?" wire:click="delete">게시글 삭제</button>
```

아래는 `Livewire.directive()`를 사용한 `wire:confirm`의 구현 예시입니다:

```js
Livewire.directive('confirm', ({ el, directive, component, cleanup }) => {
    let content =  directive.expression

    // "directive" 객체를 통해 파싱된 디렉티브에 접근할 수 있습니다.
    // 예를 들어, wire:click.prevent="deletePost(1)"의 경우 값은 다음과 같습니다.
    //
    // directive.raw = wire:click.prevent
    // directive.value = "click"
    // directive.modifiers = ['prevent']
    // directive.expression = "deletePost(1)"

    let onClick = e => {
        if (! confirm(content)) {
            e.preventDefault()
            e.stopImmediatePropagation()
        }
    }

    el.addEventListener('click', onClick, { capture: true })

    // Livewire 컴포넌트가 DOM에서 제거되더라도
    // 페이지가 활성 상태일 때 정리(cleanup) 코드가 실행되도록
    // `cleanup()` 내부에 정리 코드를 등록하세요.
    cleanup(() => {
        el.removeEventListener('click', onClick)
    })
})
```

## 오브젝트 스키마 {#object-schemas}

Livewire의 JavaScript 시스템을 확장할 때, 마주칠 수 있는 다양한 오브젝트를 이해하는 것이 중요합니다.

아래는 Livewire의 관련 내부 속성 각각에 대한 포괄적인 참고 자료입니다.

참고로, 일반적인 Livewire 사용자는 이 오브젝트들과 직접 상호작용할 일이 거의 없습니다. 이 오브젝트들 대부분은 Livewire의 내부 시스템이나 고급 사용자를 위해 제공됩니다.

### `$wire` 객체 {#the-wire-object}

다음과 같은 일반적인 `Counter` 컴포넌트가 있다고 가정해봅시다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

Livewire는 서버 사이드 컴포넌트의 JavaScript 표현을 객체 형태로 노출하는데, 이를 일반적으로 `$wire`라고 부릅니다:

```js
let $wire = {
    // 모든 컴포넌트의 public 속성은 $wire에서 직접 접근할 수 있습니다...
    count: 0,

    // 모든 public 메서드는 $wire에서 노출되어 호출할 수 있습니다...
    increment() { ... },

    // 부모 컴포넌트의 `$wire` 객체에 접근합니다(존재하는 경우)...
    $parent,

    // Livewire 컴포넌트의 루트 DOM 요소에 접근합니다...
    $el,

    // 현재 Livewire 컴포넌트의 ID에 접근합니다...
    $id,

    // 속성 이름으로 값을 가져옵니다...
    // 사용 예: $wire.$get('count')
    $get(name) { ... },

    // 속성 이름으로 컴포넌트의 값을 설정합니다...
    // 사용 예: $wire.$set('count', 5)
    $set(name, value, live = true) { ... },

    // 불리언 속성의 값을 토글합니다...
    $toggle(name, live = true) { ... },

    // 메서드를 호출합니다...
    // 사용 예: $wire.$call('increment')
    $call(method, ...params) { ... },

    // JavaScript 액션을 정의합니다...
    // 사용 예: $wire.$js('increment', () => { ... })
    $js(name, callback) { ... },

    // Livewire 속성의 값을 Alpine 등 임의의 다른 속성과
    // 연결(entangle)합니다...
    // 사용 예: <div x-data="{ count: $wire.$entangle('count') }">
    $entangle(name, live = false) { ... },

    // 속성의 값이 변경될 때 감시합니다...
    // 사용 예: Alpine.$watch('count', (value, old) => { ... })
    $watch(name, callback) { ... },

    // 서버에 커밋을 보내 컴포넌트를
    // 새로고침(HTML을 다시 렌더링하여 페이지에 반영)합니다...
    $refresh() { ... },

    // 위의 `$refresh`와 동일합니다. 좀 더 기술적인 이름일 뿐입니다...
    $commit() { ... },

    // 이 컴포넌트 또는 자식 컴포넌트에서 디스패치된 이벤트를 수신합니다...
    // 사용 예: $wire.$on('post-created', () => { ... })
    $on(event, callback) { ... },

    // 이 컴포넌트 또는 요청에서 트리거된 라이프사이클 훅을 수신합니다...
    // 사용 예: $wire.$hook('commit', () => { ... })
    $hook(name, callback) { ... },

    // 이 컴포넌트에서 이벤트를 디스패치합니다...
    // 사용 예: $wire.$dispatch('post-created', { postId: 2 })
    $dispatch(event, params = {}) { ... },

    // 다른 컴포넌트에 이벤트를 디스패치합니다...
    // 사용 예: $wire.$dispatchTo('dashboard', 'post-created', { postId: 2 })
    $dispatchTo(otherComponentName, event, params = {}) { ... },

    // 이 컴포넌트에만 이벤트를 디스패치합니다(다른 컴포넌트에는 전달되지 않음)...
    $dispatchSelf(event, params = {}) { ... },

    // wire:model을 사용하지 않고
    // JS API로 파일을 직접 업로드합니다...
    $upload(
        name, // 속성 이름
        file, // JavaScript File 객체
        finish = () => { ... }, // 업로드가 완료되면 실행...
        error = () => { ... }, // 업로드 중 오류 발생 시 실행...
        progress = (event) => { // 업로드 진행 중 실행...
            event.detail.progress // 1~100의 정수...
        },
    ) { ... },

    // 여러 파일을 동시에 업로드하는 API...
    $uploadMultiple(name, files, finish, error, progress) { },

    // 임시 업로드된 파일을 저장하지 않고 제거합니다...
    $removeUpload(name, tmpFilename, finish, error) { ... },

    // 내부 "component" 객체를 가져옵니다...
    __instance() { ... },
}
```

자세한 내용은 [Livewire 공식 문서의 JavaScript에서 속성 접근하기](/livewire/3.x/properties#accessing-properties-from-javascript)에서 확인할 수 있습니다.

### `snapshot` 객체

각 네트워크 요청 사이에, Livewire는 PHP 컴포넌트를 JavaScript에서 사용할 수 있는 객체로 직렬화합니다. 이 스냅샷은 컴포넌트를 다시 PHP 객체로 역직렬화하는 데 사용되며, 변조를 방지하기 위한 메커니즘이 내장되어 있습니다:

```js
let snapshot = {
    // 컴포넌트의 직렬화된 상태(공개 속성)...
    data: { count: 0 },

    // 컴포넌트에 대한 장기적인 정보...
    memo: {
        // 컴포넌트의 고유 ID...
        id: '0qCY3ri9pzSSMIXPGg8F',

        // 컴포넌트의 이름. 예: <livewire:[name] />
        name: 'counter',

        // 컴포넌트가 처음 로드된 웹 페이지의 URI, 메서드, 로케일.
        // 이는 원래 요청의 미들웨어를 이후,
        // 컴포넌트 업데이트 요청(커밋)에
        // 다시 적용하는 데 사용됩니다...
        path: '/',
        method: 'GET',
        locale: 'en',

        // 중첩된 "자식" 컴포넌트의 목록. 내부 템플릿 ID를 키로,
        // 컴포넌트 ID를 값으로 가집니다...
        children: [],

        // 이 컴포넌트가 "지연 로딩"되었는지 여부...
        lazyLoaded: false,

        // 마지막 요청 중 발생한
        // 유효성 검사 오류 목록...
        errors: [],
    },

    // 이 스냅샷의 안전하게 암호화된 해시값.
    // 악의적인 사용자가 스냅샷을 변조하여 서버의 소유하지 않은
    // 리소스에 접근하려고 할 경우,
    // 체크섬 검증이 실패하고
    // 오류가 발생합니다...
    checksum: '1bc274eea17a434e33d26bcaba4a247a4a7768bd286456a83ea6e9be2d18c1e7',
}
```

### `component` 객체

페이지의 모든 컴포넌트는 상태를 추적하고 내부 기능을 노출하는 해당 컴포넌트 객체를 백그라운드에서 가지고 있습니다. 이 객체는 `$wire`보다 한 단계 더 깊은 레이어입니다. 고급 사용을 위한 용도로만 제공됩니다.

아래는 위의 `Counter` 컴포넌트에 대한 실제 컴포넌트 객체이며, 관련 속성에 대한 설명이 JS 주석으로 포함되어 있습니다:

```js
let component = {
    // 컴포넌트의 루트 HTML 요소...
    el: HTMLElement,

    // 컴포넌트의 고유 ID...
    id: '0qCY3ri9pzSSMIXPGg8F',

    // 컴포넌트의 "이름" (<livewire:[name] />)...
    name: 'counter',

    // 최신 "effects" 객체. effect는 서버 왕복에서 발생하는
    // "부수 효과"입니다. 예: 리디렉션, 파일 다운로드 등...
    effects: {},

    // 컴포넌트의 마지막으로 알려진 서버 측 상태...
    canonical: { count: 0 },

    // 컴포넌트의 변경 가능한 데이터 객체로,
    // 클라이언트 측에서 실시간 상태를 나타냅니다...
    ephemeral: { count: 0 },

    // `this.ephemeral`의 반응형 버전.
    // 이 객체의 변경 사항은 AlpineJS 표현식에서 감지됩니다...
    reactive: Proxy,

    // 일반적으로 Alpine 표현식 내에서 `$wire`로 사용되는 Proxy 객체.
    // Livewire 컴포넌트에 친숙한
    // JS 객체 인터페이스를 제공합니다...
   $wire: Proxy,

    // 중첩된 "자식" 컴포넌트의 목록. 내부 템플릿 ID를 키로,
    // 컴포넌트 ID를 값으로 가집니다...
    children: [],

    // 이 컴포넌트의 마지막으로 알려진 "snapshot" 표현.
    // 스냅샷은 서버 측 컴포넌트에서 가져오며,
    // 백엔드에서 PHP 객체를 재생성하는 데 사용됩니다...
    snapshot: {...},

    // 위의 snapshot의 파싱되지 않은 버전.
    // JS 파싱이 PHP 인코딩을 변경하여 체크섬 불일치가 자주 발생하므로,
    // 다음 왕복 요청 시 서버로 다시 보낼 때 사용됩니다.
    snapshotEncoded: '{"data":{"count":0},"memo":{"id":"0qCY3ri9pzSSMIXPGg8F","name":"counter","path":"\/","method":"GET","children":[],"lazyLoaded":true,"errors":[],"locale":"en"},"checksum":"1bc274eea17a434e33d26bcaba4a247a4a7768bd286456a83ea6e9be2d18c1e7"}',
}
```

### `commit` 페이로드 {#the-commit-payload}

브라우저에서 Livewire 컴포넌트에 대한 액션이 수행되면 네트워크 요청이 발생합니다. 이 네트워크 요청에는 하나 이상의 컴포넌트와 서버를 위한 다양한 지시사항이 포함되어 있습니다. 내부적으로 이러한 컴포넌트 네트워크 페이로드를 "커밋(commit)"이라고 부릅니다.

"커밋"이라는 용어는 Livewire의 프론트엔드와 백엔드 간의 관계를 이해하는 데 도움이 되는 방식으로 선택되었습니다. 컴포넌트는 프론트엔드에서 렌더링되고 조작되다가, 상태와 업데이트를 백엔드에 "커밋"해야 하는 액션이 발생하면 그때 서버로 전송됩니다.

이 구조는 브라우저의 개발자 도구 네트워크 탭에서 페이로드를 통해 확인할 수 있으며, [Livewire의 자바스크립트 훅](#javascript-hooks)에서도 볼 수 있습니다:

```js
let commit = {
    // 스냅샷 객체...
    snapshot: { ... },

    // 서버에서 업데이트할
    // 속성의 키-값 쌍 목록...
    updates: {},

    // 서버 측에서 호출할 메서드(파라미터 포함) 배열...
    calls: [
        { method: 'increment', params: [] },
    ],
}
```

## 자바스크립트 훅 {#javascript-hooks}

고급 사용자를 위해 Livewire는 내부 클라이언트 측 "훅" 시스템을 제공합니다. 다음 훅을 사용하여 Livewire의 기능을 확장하거나 Livewire 애플리케이션에 대한 더 많은 정보를 얻을 수 있습니다.

### 컴포넌트 초기화 {#component-initialization}

Livewire가 새로운 컴포넌트를 발견할 때마다 — 초기 페이지 로드 시든, 이후든 — `component.init` 이벤트가 트리거됩니다. 이 이벤트에 훅을 걸어 새로운 컴포넌트와 관련된 작업을 가로채거나 초기화할 수 있습니다:

```js
Livewire.hook('component.init', ({ component, cleanup }) => {
    //
})
```

자세한 내용은 [컴포넌트 객체에 대한 문서](#the-component-object)를 참고하세요.

### DOM 요소 초기화 {#dom-element-initialization}

새 컴포넌트가 초기화될 때 이벤트를 트리거하는 것 외에도, Livewire는 주어진 Livewire 컴포넌트 내의 각 DOM 요소에 대해 이벤트를 트리거합니다.

이 기능은 애플리케이션 내에서 사용자 지정 Livewire HTML 속성을 제공하는 데 사용할 수 있습니다:

```js
Livewire.hook('element.init', ({ component, el }) => {
    //
})
```

### DOM Morph 훅 {#dom-morph-hooks}

DOM morphing 단계에서는—Livewire가 네트워크 왕복을 완료한 후—Livewire는 변경된 각 요소마다 일련의 이벤트를 트리거합니다.

```js
Livewire.hook('morph.updating',  ({ el, component, toEl, skip, childrenOnly }) => {
	//
})

Livewire.hook('morph.updated', ({ el, component }) => {
	//
})

Livewire.hook('morph.removing', ({ el, component, skip }) => {
	//
})

Livewire.hook('morph.removed', ({ el, component }) => {
	//
})

Livewire.hook('morph.adding',  ({ el, component }) => {
	//
})

Livewire.hook('morph.added',  ({ el }) => {
	//
})
```

요소별로 발생하는 이벤트 외에도, 각 Livewire 컴포넌트마다 `morph`와 `morphed` 이벤트가 발생합니다:

```js
Livewire.hook('morph',  ({ el, component }) => {
	// `component`의 자식 요소들이 morph되기 직전에 실행됨 (부분 morph 제외)
})

Livewire.hook('morphed',  ({ el, component }) => {
    // `component`의 모든 자식 요소들이 morph된 후에 실행됨 (부분 morph 제외)
})
```

**부분 morph 훅**

부분(Partial)은 일반적인 Livewire 요청과는 다르게 morph됩니다. 다음은 부분 DOM 업데이트 시 추가로 트리거되는 Livewire 이벤트입니다:

```js
Livewire.hook('partial.morph',  ({ startNode, endNode, component }) => {
	// `component`의 부분이 morph되기 직전에 실행됨
    //
    // startNode: DOM에서 partial의 시작을 표시하는 주석 노드입니다.
    // endNode: DOM에서 partial의 끝을 표시하는 주석 노드입니다.
})

Livewire.hook('partial.morphed',  ({ startNode, endNode, component }) => {
    // `component`의 부분이 morph된 후에 실행됨
    //
    // startNode: DOM에서 partial의 시작을 표시하는 주석 노드입니다.
    // endNode: DOM에서 partial의 끝을 표시하는 주석 노드입니다.
})
```

### 커밋 훅 {#commit-hooks}

Livewire 요청에는 여러 컴포넌트가 포함되어 있기 때문에, _request_라는 용어는 개별 컴포넌트의 요청 및 응답 페이로드를 지칭하기에는 너무 포괄적입니다. 대신, 내부적으로 Livewire는 컴포넌트의 업데이트를 _커밋_이라고 부르며, 이는 컴포넌트 상태를 서버에 _커밋_하는 것에 대한 참조입니다.

이 훅들은 `commit` 객체를 노출합니다. 해당 객체의 스키마에 대해 더 알고 싶다면 [커밋 객체 문서](#the-commit-payload)를 참고하세요.

#### 커밋 준비하기 {#preparing-commits}

`commit.prepare` 훅은 요청이 서버로 전송되기 직전에 트리거됩니다. 이를 통해 나가는 요청에 마지막 업데이트나 작업을 추가할 수 있는 기회를 제공합니다:

```js
Livewire.hook('commit.prepare', ({ component }) => {
    // 커밋 페이로드가 수집되어 서버로 전송되기 전에 실행됩니다...
})
```

#### 커밋 가로채기 {#intercepting-commits}

Livewire 컴포넌트가 서버로 전송될 때마다 _커밋_ 이 발생합니다. 개별 커밋의 라이프사이클과 내용을 후킹하기 위해 Livewire는 `commit` 후크를 제공합니다.

이 후크는 Livewire 커밋의 요청과 응답 모두에 후킹할 수 있는 메서드를 제공하므로 매우 강력합니다:

```js
Livewire.hook('commit', ({ component, commit, respond, succeed, fail }) => {
    // 커밋의 페이로드가 서버로 전송되기 직전에 실행됩니다...

    respond(() => {
        // 응답을 받은 후, 처리되기 전에 실행됩니다...
    })

    succeed(({ snapshot, effects }) => {
        // 성공적인 응답을 받고 처리된 후,
        // 새로운 스냅샷과 효과 목록과 함께 실행됩니다...
    })

    fail(() => {
        // 요청의 일부가 실패했을 때 실행됩니다...
    })
})
```

## 요청 훅 {#request-hooks}

서버로의 전체 HTTP 요청을 보내고 반환받는 과정에 훅을 걸고 싶다면, `request` 훅을 사용할 수 있습니다:

```js
Livewire.hook('request', ({ url, options, payload, respond, succeed, fail }) => {
    // 커밋 페이로드가 컴파일된 후, 네트워크 요청이 보내지기 전에 실행됩니다...

    respond(({ status, response }) => {
        // 응답이 수신되었을 때 실행됩니다...
        // "response"는 await response.text()가 실행되기 전의
        // 원시 HTTP 응답 객체입니다...
    })

    succeed(({ status, json }) => {
        // 응답이 수신되었을 때 실행됩니다...
        // "json"은 JSON 응답 객체입니다...
    })

    fail(({ status, content, preventDefault }) => {
        // 응답이 에러 상태 코드를 가질 때 실행됩니다...
        // "preventDefault"를 사용하면 Livewire의
        // 기본 에러 처리를 비활성화할 수 있습니다...
        // "content"는 원시 응답 내용입니다...
    })
})
```

### 페이지 만료 동작 커스터마이징 {#customizing-page-expiration-behavior}

기본 페이지 만료 다이얼로그가 애플리케이션에 적합하지 않은 경우, `request` 훅을 사용하여 커스텀 솔루션을 구현할 수 있습니다:

```html
<script>
    document.addEventListener('livewire:init', () => {
        Livewire.hook('request', ({ fail }) => {
            fail(({ status, preventDefault }) => {
                if (status === 419) {
                    confirm('사용자 정의 페이지 만료 동작...')

                    preventDefault()
                }
            })
        })
    })
</script>
```

위 코드를 애플리케이션에 추가하면, 사용자의 세션이 만료되었을 때 커스텀 다이얼로그가 표시됩니다.
