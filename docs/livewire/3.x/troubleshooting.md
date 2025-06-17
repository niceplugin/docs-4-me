# 문제 해결
여기 Livewire 본사에서는 여러분이 문제에 부딪히기 전에 미리 제거하려고 노력합니다. 하지만 때로는, 새로운 문제를 만들지 않고는 해결할 수 없는 문제들도 있고, 또 때로는 예상하지 못한 문제들도 있습니다.

여기 여러분의 Livewire 앱에서 마주칠 수 있는 일반적인 오류와 상황들을 소개합니다.

## 컴포넌트 불일치 {#component-mismatches}

페이지에서 Livewire 컴포넌트와 상호작용할 때, 다음과 같은 이상한 동작이나 오류 메시지를 접할 수 있습니다:
```
Error: Component already initialized
```

```
Error: Snapshot missing on Livewire component with id: ...
```

이러한 메시지를 접하는 이유는 여러 가지가 있지만, 가장 흔한 원인은 `@foreach` 루프 안의 요소나 컴포넌트에 `wire:key`를 추가하는 것을 잊었기 때문입니다.

### `wire:key` 추가하기 {#adding-wirekey}

Blade 템플릿에서 `@foreach`와 같은 반복문을 사용할 때는, 반복문 내 첫 번째 요소의 시작 태그에 반드시 `wire:key`를 추가해야 합니다:

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}"> <!-- [!code highlight] -->
        ...
    </div>
@endforeach
```

이렇게 하면 반복문이 변경될 때 Livewire가 각 요소를 제대로 추적할 수 있습니다.

반복문 내에 Livewire 컴포넌트가 있을 때도 마찬가지입니다:

```blade
@foreach($posts as $post)
    <livewire:show-post :$post :key="$post->id" /> <!-- [!code highlight] -->
@endforeach
```

하지만, 여러분이 예상하지 못할 수 있는 까다로운 상황이 있습니다:

Livewire 컴포넌트가 `@foreach` 반복문 안에 깊게 중첩되어 있을 때도, 반드시 해당 컴포넌트에 key를 추가해야 합니다. 예를 들어:

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}">
        ...
        <livewire:show-post :$post :key="$post->id" /> <!-- [!code highlight] -->
        ...
    </div>
@endforeach
```

중첩된 Livewire 컴포넌트에 key가 없으면, Livewire는 네트워크 요청 간에 반복되는 컴포넌트들을 제대로 매칭할 수 없습니다.

#### 키에 접두사 추가하기 {#prefixing-keys}

동일한 컴포넌트 내에서 중복된 키가 발생하는 또 다른 까다로운 상황이 있을 수 있습니다. 이는 종종 모델의 ID를 키로 사용할 때 발생하며, 때때로 충돌이 일어날 수 있습니다.

아래 예시에서는 각각의 키 집합이 고유하도록 `post-`와 `author-` 접두사를 추가해야 합니다. 그렇지 않으면, `$post`와 `$author` 모델이 동일한 ID를 가질 경우 ID 충돌이 발생할 수 있습니다:

```blade
<div>
    @foreach($posts as $post)
        <div wire:key="post-{{ $post->id }}">...</div> <!-- [!code highlight] -->
    @endforeach

    @foreach($authors as $author)
        <div wire:key="author-{{ $author->id }}">...</div> <!-- [!code highlight] -->
    @endforeach
</div>
```

## Alpine의 여러 인스턴스 {#multiple-instances-of-alpine}

Livewire를 설치할 때 다음과 같은 오류 메시지가 표시될 수 있습니다:

```
Error: Detected multiple instances of Alpine running
```

```
Alpine Expression Error: $wire is not defined
```

이 경우, 동일한 페이지에서 두 개의 Alpine 버전이 실행되고 있을 가능성이 높습니다. Livewire는 내부적으로 자체 Alpine 번들을 포함하고 있으므로, 애플리케이션의 Livewire 페이지에서는 다른 Alpine 버전을 모두 제거해야 합니다.

이런 일이 자주 발생하는 일반적인 시나리오는 이미 Alpine이 포함된 기존 애플리케이션에 Livewire를 추가하는 경우입니다. 예를 들어, Laravel Breeze 스타터 키트를 설치한 후 나중에 Livewire를 추가했다면 이러한 문제가 발생할 수 있습니다.

이 문제의 해결 방법은 간단합니다: 추가된 Alpine 인스턴스를 제거하세요.

### Laravel Breeze의 Alpine 제거하기 {#removing-laravel-breezes-alpine}

Livewire를 기존 Laravel Breeze(Blade + Alpine 버전)에 설치하는 경우, `resources/js/app.js` 파일에서 다음 줄을 제거해야 합니다:

```js
import './bootstrap';

import Alpine from 'alpinejs'; // [tl! remove:4]

window.Alpine = Alpine;

Alpine.start();
```

### Alpine CDN 버전 제거하기 {#removing-a-cdn-version-of-alpine}

Livewire 2 버전 이하에서는 Alpine이 기본적으로 포함되어 있지 않았기 때문에, 레이아웃의 head에 Alpine CDN을 script 태그로 추가했을 수 있습니다. Livewire v3에서는 이 CDN을 완전히 제거해도 되며, Livewire가 자동으로 Alpine을 제공합니다:

```html
    ...
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script> <!-- [tl! remove] -->
</head>
```

참고: Livewire는 `@alpinejs/ui`를 제외한 모든 Alpine 플러그인을 포함하므로, 추가로 포함한 Alpine 플러그인도 제거할 수 있습니다.

## `@alpinejs/ui` 누락 {#missing-alpinejsui}

Livewire에 번들로 포함된 Alpine은 모든 Alpine 플러그인을 포함하지만 `@alpinejs/ui`는 제외됩니다. 만약 [Alpine Components](https://alpinejs.dev/components)의 헤드리스 컴포넌트를 사용하고 있고, 이 플러그인에 의존한다면 다음과 같은 오류가 발생할 수 있습니다:

```
Uncaught Alpine: no element provided to x-anchor
```

이 문제를 해결하려면, 레이아웃 파일에 아래와 같이 CDN 방식으로 `@alpinejs/ui` 플러그인을 추가하면 됩니다:

```html
    ...
    <script defer src="https://unpkg.com/@alpinejs/ui@3.13.7-beta.0/dist/cdn.min.js"></script> <!-- [tl! add] -->
</head>
```

참고: 이 플러그인의 최신 버전을 반드시 포함해야 하며, [각 컴포넌트의 문서 페이지](https://alpinejs.dev/component/headless-dialog/docs)에서 최신 버전을 확인할 수 있습니다.
