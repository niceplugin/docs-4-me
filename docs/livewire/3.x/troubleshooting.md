# 문제 해결
여기 Livewire HQ에서는 여러분이 문제에 부딪히기 전에 미리 문제를 제거하려고 노력합니다. 하지만 때로는, 새로운 문제를 만들지 않고는 해결할 수 없는 문제도 있고, 또 때로는 예측하지 못한 문제도 있습니다.

여기 여러분의 Livewire 앱에서 마주칠 수 있는 일반적인 오류와 상황들을 소개합니다.

## 컴포넌트 불일치 {#component-mismatches}

페이지에서 Livewire 컴포넌트와 상호작용할 때, 다음과 같은 이상한 동작이나 오류 메시지를 만날 수 있습니다:
```
오류: 컴포넌트가 이미 초기화되었습니다
```

```
오류: id가 ...인 Livewire 컴포넌트에서 스냅샷이 없습니다
```

이러한 메시지를 만나는 이유는 여러 가지가 있지만, 가장 흔한 원인은 `@foreach` 루프 안의 요소와 컴포넌트에 `wire:key`를 추가하는 것을 잊는 것입니다.

### `wire:key` 추가하기 {#adding-wirekey}

Blade 템플릿에서 `@foreach`와 같은 루프를 사용할 때마다, 루프 내 첫 번째 요소의 오프닝 태그에 `wire:key`를 추가해야 합니다:

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}"> <!-- [!code highlight] -->
        ...
    </div>
@endforeach
```

이렇게 하면 루프가 변경될 때 Livewire가 루프 내의 서로 다른 요소들을 추적할 수 있습니다.

루프 내의 Livewire 컴포넌트에도 동일하게 적용됩니다:

```blade
@foreach($posts as $post)
    <livewire:show-post :$post :key="$post->id" /> <!-- [!code highlight] -->
@endforeach
```

하지만, 여러분이 예상하지 못할 수 있는 까다로운 상황이 있습니다:

Livewire 컴포넌트가 `@foreach` 루프 안에 깊게 중첩되어 있을 때도, 여전히 해당 컴포넌트에 key를 추가해야 합니다. 예를 들어:

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}">
        ...
        <livewire:show-post :$post :key="$post->id" /> <!-- [!code highlight] -->
        ...
    </div>
@endforeach
```

중첩된 Livewire 컴포넌트에 key가 없으면, Livewire는 네트워크 요청 간에 루프된 컴포넌트들을 일치시킬 수 없습니다.

#### 키에 접두사 붙이기 {#prefixing-keys}

또 다른 까다로운 상황은 동일한 컴포넌트 내에서 중복된 키가 발생하는 경우입니다. 이는 종종 모델 ID를 키로 사용할 때 발생하며, 때때로 충돌이 일어날 수 있습니다.

아래 예시에서는 각 키 집합을 고유하게 지정하기 위해 `post-`와 `author-` 접두사를 추가해야 합니다. 그렇지 않으면, `$post`와 `$author` 모델이 동일한 ID를 가질 경우 ID 충돌이 발생합니다:

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

## Alpine의 다중 인스턴스 {#multiple-instances-of-alpine}

Livewire를 설치할 때, 다음과 같은 오류 메시지를 만날 수 있습니다:

```
오류: 여러 인스턴스의 Alpine이 실행 중임이 감지됨
```

```
Alpine 식 오류: $wire가 정의되지 않음
```

이런 경우, 한 페이지에 두 개의 Alpine 버전이 실행되고 있을 가능성이 높습니다. Livewire는 내부적으로 자체 Alpine 번들을 포함하고 있으므로, 애플리케이션의 Livewire 페이지에서는 다른 Alpine 버전을 모두 제거해야 합니다.

이런 일이 발생하는 일반적인 상황 중 하나는 이미 Alpine이 포함된 기존 애플리케이션에 Livewire를 추가하는 경우입니다. 예를 들어, Laravel Breeze 스타터 킷을 설치한 후 나중에 Livewire를 추가했다면 이런 문제가 발생할 수 있습니다.

이 문제의 해결 방법은 간단합니다: 추가 Alpine 인스턴스를 제거하세요.

### Laravel Breeze의 Alpine 제거하기 {#removing-laravel-breezes-alpine}

기존 Laravel Breeze(Blade + Alpine 버전) 안에 Livewire를 설치하는 경우, `resources/js/app.js`에서 다음 줄을 제거해야 합니다:

```js
import './bootstrap';

import Alpine from 'alpinejs'; // [!code --:5]

window.Alpine = Alpine;

Alpine.start();
```

### CDN 버전의 Alpine 제거하기 {#removing-a-cdn-version-of-alpine}

Livewire 2 버전 이하에서는 Alpine이 기본적으로 포함되어 있지 않았기 때문에, 레이아웃의 head에 Alpine CDN을 script 태그로 추가했을 수 있습니다. Livewire v3에서는 이 CDN을 완전히 제거할 수 있으며, Livewire가 자동으로 Alpine을 제공합니다:

```html
    ...
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script> <!-- [!code --] -->
</head>
```

참고: Livewire는 `@alpinejs/ui`를 제외한 모든 Alpine 플러그인을 포함하므로, 추가 Alpine 플러그인도 제거할 수 있습니다.

## `@alpinejs/ui` 누락 {#missing-alpinejsui}

Livewire에 번들된 Alpine 버전은 `@alpinejs/ui`를 제외한 모든 Alpine 플러그인을 포함합니다. [Alpine Components](https://alpinejs.dev/components)의 헤드리스 컴포넌트를 사용하고 있다면, 이 플러그인에 의존하기 때문에 다음과 같은 오류가 발생할 수 있습니다:

```
Uncaught Alpine: x-anchor에 제공된 요소가 없습니다
```

이 문제를 해결하려면, 레이아웃 파일에 다음과 같이 `@alpinejs/ui` 플러그인을 CDN으로 추가하면 됩니다:

```html
    ...
    <script defer src="https://unpkg.com/@alpinejs/ui@3.13.7-beta.0/dist/cdn.min.js"></script> <!-- [!code ++] -->
</head>
```

참고: 이 플러그인의 최신 버전을 반드시 포함해야 하며, [각 컴포넌트의 문서 페이지](https://alpinejs.dev/component/headless-dialog/docs)에서 최신 버전을 확인할 수 있습니다.
