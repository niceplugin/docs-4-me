# Alpine
[AlpineJS](https://alpinejs.dev/)는 웹 페이지에 클라이언트 측 상호작용을 쉽게 추가할 수 있게 해주는 경량 자바스크립트 라이브러리입니다. 원래는 Livewire와 같은 도구를 보완하기 위해 만들어졌으며, 앱 곳곳에 상호작용을 추가할 때 자바스크립트 중심의 유틸리티가 필요할 때 유용합니다.

Livewire는 Alpine을 기본적으로 내장하고 있으므로, 별도로 프로젝트에 설치할 필요가 없습니다.

AlpineJS 사용법을 배우기에 가장 좋은 곳은 [Alpine 공식 문서](https://alpinejs.dev)입니다.

## 기본 Alpine 컴포넌트 {#a-basic-alpine-component}

이 문서의 나머지 부분을 위한 기초를 다지기 위해, 가장 간단하면서도 유익한 Alpine 컴포넌트 예제를 소개합니다. 페이지에 숫자를 표시하고, 사용자가 버튼을 클릭하여 그 숫자를 증가시킬 수 있는 작은 "카운터"입니다:

```html
<!-- JavaScript 데이터 객체를 선언합니다... -->
<div x-data="{ count: 0 }">
    <!-- 현재 "count" 값을 요소 안에 렌더링합니다... -->
    <h2 x-text="count"></h2>

    <!-- 클릭 이벤트가 발생하면 "count" 값을 "1" 증가시킵니다... -->
    <button x-on:click="count++">+</button>
</div>
```

위의 Alpine 컴포넌트는 애플리케이션의 어떤 Livewire 컴포넌트 안에서도 문제없이 사용할 수 있습니다. Livewire는 Livewire 컴포넌트가 업데이트될 때 Alpine의 상태를 유지해줍니다. 본질적으로, Alpine을 다른 비-Livewire 환경에서 사용하는 것처럼 Livewire 내부에서도 자유롭게 Alpine 컴포넌트를 사용할 수 있습니다.

## Livewire 내부에서 Alpine 사용하기 {#using-alpine-inside-livewire}

Alpine 컴포넌트를 Livewire 컴포넌트 내부에서 사용하는 실제 예제를 살펴보겠습니다.

아래는 데이터베이스에서 가져온 게시글 모델의 세부 정보를 보여주는 간단한 Livewire 컴포넌트입니다. 기본적으로 게시글의 제목만 표시됩니다:

```html
<div>
    <h1>{{ $post->title }}</h1>

    <div x-data="{ expanded: false }">
        <button type="button" x-on:click="expanded = ! expanded">
            <span x-show="! expanded">Show post content...</span>
            <span x-show="expanded">Hide post content...</span>
        </button>

        <div x-show="expanded">
            {{ $post->content }}
        </div>
    </div>
</div>
```

Alpine을 사용하면 사용자가 "Show post content..." 버튼을 누를 때까지 게시글의 내용을 숨길 수 있습니다. 이 시점에서 Alpine의 `expanded` 속성이 `true`로 설정되고, `x-show="expanded"`가 사용되어 Alpine이 게시글 내용의 표시 여부를 제어하기 때문에 내용이 페이지에 표시됩니다.

이것이 바로 Alpine이 빛을 발하는 예시입니다. Livewire의 서버 라운드트립을 발생시키지 않고 애플리케이션에 상호작용성을 추가할 수 있습니다.

## Alpine에서 `$wire`를 사용하여 Livewire 제어하기 {#controlling-livewire-from-alpine-using-wire}

Livewire 개발자로서 사용할 수 있는 가장 강력한 기능 중 하나는 `$wire`입니다. `$wire` 객체는 Livewire 내부에서 사용되는 모든 Alpine 컴포넌트에서 사용할 수 있는 매직 객체입니다.

`$wire`는 JavaScript에서 PHP로 진입하는 관문이라고 생각할 수 있습니다. 이를 통해 AlpineJS 내부에서 Livewire 컴포넌트의 속성에 접근하고 수정할 수 있으며, Livewire 컴포넌트의 메서드를 호출하는 등 다양한 작업을 할 수 있습니다.

### Livewire 속성 접근하기 {#accessing-livewire-properties}

아래는 게시글을 작성하는 폼에서 사용할 수 있는 간단한 "글자 수 세기" 유틸리티의 예시입니다. 사용자가 입력할 때마다 게시글 내용에 포함된 글자 수를 즉시 보여줍니다:

```html
<form wire:submit="save">
    <!-- ... -->

    <input wire:model="content" type="text">

    <small>
        글자 수: <span x-text="$wire.content.length"></span> <!-- [tl! highlight] -->
    </small>

    <button type="submit">저장</button>
</form>
```

위 예시에서 볼 수 있듯이, `x-text`는 Alpine이 `<span>` 요소의 텍스트 내용을 제어할 수 있도록 사용됩니다. `x-text`는 내부에 어떤 JavaScript 표현식도 허용하며, 의존성이 업데이트될 때마다 자동으로 반응합니다. `$wire.content`를 사용해 `$content`의 값을 접근하고 있기 때문에, Alpine은 Livewire에서 `$wire.content`가 업데이트될 때마다 텍스트 내용을 자동으로 갱신합니다. 이 경우에는 `wire:model="content"`에 의해 업데이트됩니다.

### Livewire 속성 변경하기 {#mutating-livewire-properties}

아래는 Alpine 내부에서 `$wire`를 사용하여 게시글 작성 폼의 "title" 필드를 초기화하는 예시입니다.

```html
<form wire:submit="save">
    <input wire:model="title" type="text">

    <button type="button" x-on:click="$wire.title = ''">Clear</button> <!-- [tl! highlight] -->

    <!-- ... -->

    <button type="submit">Save</button>
</form>
```

위의 Livewire 폼을 사용자가 작성하는 도중, "Clear" 버튼을 누르면 Livewire에서 네트워크 요청을 보내지 않고도 title 필드가 즉시 초기화됩니다. 이 상호작용은 "즉각적"으로 일어납니다.

이 동작이 어떻게 가능한지 간단히 설명하면 다음과 같습니다:

* `x-on:click`은 Alpine에게 버튼 요소의 클릭을 감지하도록 지시합니다
* 클릭 시 Alpine은 제공된 JS 표현식 `$wire.title = ''`을 실행합니다
* `$wire`는 Livewire 컴포넌트를 나타내는 매직 객체이므로, 컴포넌트의 모든 속성에 JavaScript에서 직접 접근하거나 변경할 수 있습니다
* `$wire.title = ''`은 Livewire 컴포넌트의 `$title` 값을 빈 문자열로 설정합니다
* `wire:model`과 같은 Livewire 유틸리티는 이 변경에 즉시 반응하며, 서버로의 왕복 없이 동작합니다
* 다음 Livewire 네트워크 요청 시, 백엔드의 `$title` 속성도 빈 문자열로 업데이트됩니다

### Livewire 메서드 호출하기 {#calling-livewire-methods}

Alpine은 `$wire`에서 직접 메서드를 호출함으로써 Livewire의 모든 메서드/액션을 쉽게 호출할 수 있습니다.

아래는 Alpine을 사용하여 input 요소에서 "blur" 이벤트를 감지하고 폼 저장을 트리거하는 예시입니다. "blur" 이벤트는 사용자가 "tab" 키를 눌러 현재 요소의 포커스를 해제하고 페이지의 다음 요소로 포커스를 이동할 때 브라우저에서 발생합니다:

```html
<form wire:submit="save">
    <input wire:model="title" type="text" x-on:blur="$wire.save()">  <!-- [tl! highlight] -->

    <!-- ... -->

    <button type="submit">Save</button>
</form>
```

일반적으로 이 상황에서는 `wire:model.blur="title"`을 사용하는 것이 더 간단하지만, Alpine을 사용하여 이 동작을 어떻게 구현할 수 있는지 보여주기 위한 예시입니다.

#### 매개변수 전달하기 {#passing-parameters}

Livewire 메서드에 매개변수를 전달하려면 `$wire` 메서드 호출에 단순히 매개변수를 넘기면 됩니다.

다음과 같이 `deletePost()` 메서드를 가진 컴포넌트를 예로 들어보겠습니다:

```php
public function deletePost($postId)
{
    $post = Post::find($postId);

    // 사용자가 삭제 권한이 있는지 확인...
    auth()->user()->can('update', $post);

    $post->delete();
}
```

이제 Alpine에서 `deletePost()` 메서드에 `$postId` 매개변수를 다음과 같이 전달할 수 있습니다:

```html
<button type="button" x-on:click="$wire.deletePost(1)">
```

일반적으로 `$postId`와 같은 값은 Blade에서 생성됩니다. Alpine이 `deletePost()`에 어떤 `$postId`를 전달할지 Blade를 사용하는 예시는 다음과 같습니다:

```html
@foreach ($posts as $post)
    <button type="button" x-on:click="$wire.deletePost({{ $post->id }})">
        Delete "{{ $post->title }}"
    </button>
@endforeach
```

페이지에 게시글이 세 개 있다면, 위의 Blade 템플릿은 브라우저에서 다음과 같이 렌더링됩니다:

```html
<button type="button" x-on:click="$wire.deletePost(1)">
    Delete "The power of walking"
</button>

<button type="button" x-on:click="$wire.deletePost(2)">
    Delete "How to record a song"
</button>

<button type="button" x-on:click="$wire.deletePost(3)">
    Delete "Teach what you learn"
</button>
```

보시다시피, Blade를 사용해 각 게시글의 ID를 Alpine의 `x-on:click` 표현식에 렌더링했습니다.

#### Blade 파라미터 "주의사항" {#blade-parameter-gotchas}

이 기법은 매우 강력하지만, Blade 템플릿을 읽을 때 혼란스러울 수 있습니다. 처음에는 어떤 부분이 Blade이고 어떤 부분이 Alpine인지 한눈에 알기 어려울 수 있습니다. 따라서, 페이지에 렌더링된 HTML을 검사하여 기대한 대로 렌더링되고 있는지 확인하는 것이 도움이 됩니다.

다음은 사람들이 자주 혼동하는 예시입니다:

예를 들어, Post 모델이 ID 대신 UUID를 인덱스로 사용한다고 가정해봅시다(ID는 정수이고, UUID는 긴 문자열입니다).

ID를 사용할 때와 똑같이 아래와 같이 렌더링하면 문제가 발생합니다:

```html
<!-- 경고: 문제가 있는 코드 예시입니다... -->
<button
    type="button"
    x-on:click="$wire.deletePost({{ $post->uuid }})"
>
```

위 Blade 템플릿은 HTML에서 다음과 같이 렌더링됩니다:

```html
<!-- 경고: 문제가 있는 코드 예시입니다... -->
<button
    type="button"
    x-on:click="$wire.deletePost(93c7b04c-c9a4-4524-aa7d-39196011b81a)"
>
```

UUID 문자열에 따옴표가 없는 것에 주목하세요. Alpine이 이 표현식을 평가하려고 할 때, JavaScript에서 "Uncaught SyntaxError: Invalid or unexpected token" 오류가 발생합니다.

이 문제를 해결하려면, Blade 표현식에 따옴표를 추가해야 합니다:

```html
<button
    type="button"
    x-on:click="$wire.deletePost('{{ $post->uuid }}')"
>
```

이제 위 템플릿은 올바르게 렌더링되어 모든 것이 기대한 대로 동작합니다:

```html
<button
    type="button"
    x-on:click="$wire.deletePost('93c7b04c-c9a4-4524-aa7d-39196011b81a')"
>
```

### 컴포넌트 새로고침 {#refreshing-a-component}

Livewire 컴포넌트는 `$wire.$refresh()`를 사용하여 쉽게 새로고침(네트워크 왕복을 트리거하여 컴포넌트의 Blade 뷰를 다시 렌더링)할 수 있습니다:

```html
<button type="button" x-on:click="$wire.$refresh()">
```

## `$wire.entangle`를 사용한 상태 공유 {#sharing-state-using-wireentangle}

대부분의 경우, Alpine에서 Livewire 상태와 상호작용할 때는 `$wire`만으로 충분합니다. 그러나 Livewire는 추가적으로 `$wire.entangle()` 유틸리티를 제공하여 Livewire의 값을 Alpine의 값과 동기화할 수 있습니다.

예를 들어, 아래 드롭다운 예시에서는 `showDropdown` 속성이 `$wire.entangle()`을 사용해 Livewire와 Alpine 사이에서 얽혀 있습니다. 엔탱글먼트를 사용함으로써 이제 Alpine과 Livewire 양쪽에서 드롭다운의 상태를 제어할 수 있습니다:


```php
use Livewire\Component;

class PostDropdown extends Component
{
    public $showDropdown = false;

    public function archive()
    {
        // ...

        $this->showDropdown = false;
    }

    public function delete()
    {
        // ...

        $this->showDropdown = false;
    }
}
```

```blade
<div x-data="{ open: $wire.entangle('showDropdown') }">
    <button x-on:click="open = true">Show More...</button>

    <ul x-show="open" x-on:click.outside="open = false">
        <li><button wire:click="archive">Archive</button></li>

        <li><button wire:click="delete">Delete</button></li>
    </ul>
</div>
```

이제 사용자는 Alpine을 통해 즉시 드롭다운을 토글할 수 있지만, "Archive"와 같은 Livewire 액션을 클릭하면 드롭다운이 Livewire에서 닫히도록 지시됩니다. Alpine과 Livewire 모두 각자의 속성을 자유롭게 조작할 수 있으며, 상대방도 자동으로 업데이트됩니다.

기본적으로 상태 업데이트는 지연되어(클라이언트에서 변경되지만 서버에는 즉시 반영되지 않음) 다음 Livewire 요청 시 동기화됩니다. 사용자가 클릭하자마자 서버 측 상태를 즉시 업데이트해야 한다면, 아래와 같이 `.live` 수식어를 체이닝하세요:

```blade
<div x-data="{ open: $wire.entangle('showDropdown').live }">
    ...
</div>
```

> [!tip] `$wire.entangle`가 필요하지 않을 수도 있습니다
> 대부분의 경우, Alpine에서 Livewire 속성에 직접 접근하는 `$wire`만으로 원하는 동작을 구현할 수 있습니다. 두 속성을 얽히게(entangle) 하는 대신 하나만 사용하는 것이 예측 가능성과 성능 면에서 더 좋습니다. 특히 자주 변경되는 깊게 중첩된 객체를 사용할 때 문제가 발생할 수 있습니다. 이런 이유로, Livewire 3 버전부터는 `$wire.entangle`의 사용이 문서에서 덜 강조되고 있습니다.

> [!warning] @@entangle 디렉티브 사용 자제
> Livewire 2 버전에서는 Blade의 `@@entangle` 디렉티브 사용이 권장되었습니다. 그러나 v3에서는 더 이상 해당 방법을 사용하지 않습니다. `$wire.entangle()`이 더 견고한 유틸리티이며, [DOM 요소 제거 시 발생하는 특정 문제](https://github.com/livewire/livewire/pull/6833#issuecomment-1902260844)를 피할 수 있기 때문에 선호됩니다.

## Alpine을 JavaScript 빌드에 수동으로 번들링하기 {#manually-bundling-alpine-in-your-javascript-build}

기본적으로 Livewire와 Alpine의 JavaScript는 각 Livewire 페이지에 자동으로 삽입됩니다.

이 방식은 간단한 설정에 이상적이지만, 프로젝트에 직접 Alpine 컴포넌트, 스토어, 플러그인을 포함하고 싶을 수 있습니다.

Livewire와 Alpine을 직접 만든 JavaScript 번들을 통해 페이지에 포함하는 것은 간단합니다.

먼저, 레이아웃 파일에 `@livewireScriptConfig` 디렉티브를 다음과 같이 포함해야 합니다:

```blade
<html>
<head>
    <!-- ... -->
    @livewireStyles
    @vite(['resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    @livewireScriptConfig <!-- [tl! highlight] -->
</body>
</html>
```

이렇게 하면 Livewire가 앱이 제대로 동작하는 데 필요한 특정 설정을 번들에 제공할 수 있습니다.

이제 `resources/js/app.js` 파일에서 Livewire와 Alpine을 다음과 같이 import할 수 있습니다:

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

// 여기에서 Alpine 디렉티브, 컴포넌트, 플러그인 등을 등록하세요...

Livewire.start()
```

아래는 "x-clipboard"라는 커스텀 Alpine 디렉티브를 애플리케이션에 등록하는 예시입니다:

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

Alpine.directive('clipboard', (el) => {
    let text = el.textContent

    el.addEventListener('click', () => {
        navigator.clipboard.writeText(text)
    })
})

Livewire.start()
```

이제 `x-clipboard` 디렉티브를 Livewire 애플리케이션의 모든 Alpine 컴포넌트에서 사용할 수 있습니다.
