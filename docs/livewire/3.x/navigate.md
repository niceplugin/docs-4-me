# 네비게이트
많은 현대 웹 애플리케이션은 "싱글 페이지 애플리케이션(SPA)"으로 구축됩니다. 이러한 애플리케이션에서는 각 페이지가 렌더링될 때마다 전체 브라우저 페이지를 새로고침할 필요가 없어, 매 요청마다 JavaScript와 CSS 에셋을 다시 다운로드하는 오버헤드를 피할 수 있습니다.

*싱글 페이지 애플리케이션*의 대안은 *멀티 페이지 애플리케이션*입니다. 이러한 애플리케이션에서는 사용자가 링크를 클릭할 때마다 완전히 새로운 HTML 페이지가 브라우저에서 요청되고 렌더링됩니다.

대부분의 PHP 애플리케이션은 전통적으로 멀티 페이지 애플리케이션이었지만, Livewire는 애플리케이션의 링크에 간단한 속성 하나(`wire:navigate`)를 추가함으로써 싱글 페이지 애플리케이션 경험을 제공합니다.

## 기본 사용법 {#basic-usage}

`wire:navigate` 사용 예제를 살펴보겠습니다. 아래는 세 개의 Livewire 컴포넌트가 라우트로 정의된 일반적인 Laravel 라우트 파일(`routes/web.php`)입니다:

```php
use App\Livewire\Dashboard;
use App\Livewire\ShowPosts;
use App\Livewire\ShowUsers;

Route::get('/', Dashboard::class);

Route::get('/posts', ShowPosts::class);

Route::get('/users', ShowUsers::class);
```

각 페이지의 내비게이션 메뉴에 있는 각 링크에 `wire:navigate`를 추가하면, Livewire가 링크 클릭의 표준 동작을 방지하고 자체적으로 더 빠른 버전으로 대체합니다:

```blade
<nav>
    <a href="/" wire:navigate>Dashboard</a>
    <a href="/posts" wire:navigate>Posts</a>
    <a href="/users" wire:navigate>Users</a>
</nav>
```

아래는 `wire:navigate` 링크를 클릭했을 때 일어나는 일의 단계별 설명입니다:

* 사용자가 링크를 클릭합니다
* Livewire가 브라우저가 새 페이지로 이동하는 것을 방지합니다
* 대신, Livewire가 백그라운드에서 페이지를 요청하고 페이지 상단에 로딩 바를 표시합니다
* 새 페이지의 HTML을 수신하면, Livewire가 현재 페이지의 URL, `<title>` 태그, `<body>` 내용을 새 페이지의 요소로 교체합니다

이 기술은 훨씬 더 빠른 페이지 로드 시간을 제공하며(종종 두 배 이상 빠름), 애플리케이션이 JavaScript로 구동되는 싱글 페이지 애플리케이션처럼 "느껴지게" 만듭니다.

## 리다이렉트 {#redirects}

Livewire 컴포넌트 중 하나가 애플리케이션 내의 다른 URL로 사용자를 리다이렉트할 때, Livewire가 `wire:navigate` 기능을 사용하여 새 페이지를 로드하도록 지시할 수도 있습니다. 이를 위해 `redirect()` 메서드에 `navigate` 인자를 전달하세요:

```php
return $this->redirect('/posts', navigate: true);
```

이제 전체 페이지 요청을 사용하여 사용자를 새 URL로 리다이렉트하는 대신, Livewire가 현재 페이지의 내용과 URL을 새 페이지로 교체합니다.

## 링크 프리페치 {#prefetching-links}

기본적으로 Livewire는 사용자가 링크를 클릭하기 전에 페이지를 _프리페치_하는 부드러운 전략을 포함하고 있습니다:

* 사용자가 마우스 버튼을 누릅니다
* Livewire가 페이지 요청을 시작합니다
* 사용자가 마우스 버튼을 떼어 _클릭_을 완료합니다
* Livewire가 요청을 마치고 새 페이지로 이동합니다

놀랍게도, 사용자가 마우스 버튼을 누르고 떼는 사이의 시간만으로도 서버에서 페이지의 절반 또는 전체를 불러올 수 있는 경우가 많습니다.

프리페치에 대해 더 공격적인 접근을 원한다면, 링크에 `.hover` 수식어를 사용할 수 있습니다:

```blade
<a href="/posts" wire:navigate.hover>Posts</a>
```

`.hover` 수식어는 사용자가 링크 위에 60밀리초 동안 마우스를 올려두면 Livewire가 페이지를 프리페치하도록 지시합니다.

> [!warning] hover 프리페치는 서버 사용량을 증가시킵니다
> 모든 사용자가 마우스를 올린 링크를 클릭하는 것은 아니기 때문에, `.hover`를 추가하면 필요하지 않을 수도 있는 페이지를 요청하게 됩니다. Livewire는 페이지를 프리페치하기 전에 60밀리초를 기다려 이 오버헤드를 일부 완화하려고 시도합니다.

## 페이지 방문 간 요소 유지 {#persisting-elements-across-page-visits}

때때로 오디오나 비디오 플레이어와 같이 페이지 로드 간에 유지해야 하는 UI 부분이 있습니다. 예를 들어, 팟캐스트 애플리케이션에서 사용자가 다른 페이지를 탐색하면서도 에피소드를 계속 듣고 싶어할 수 있습니다.

Livewire에서는 `@persist` 디렉티브로 이를 달성할 수 있습니다.

요소를 `@persist`로 감싸고 이름을 제공하면, `wire:navigate`를 사용해 새 페이지를 요청할 때 Livewire는 새 페이지에서 일치하는 `@persist`가 있는 요소를 찾습니다. 일반적으로 요소를 교체하는 대신, Livewire는 이전 페이지의 기존 DOM 요소를 새 페이지에서 사용하여 요소 내의 상태를 보존합니다.

아래는 `@persist`를 사용해 페이지 간에 오디오 플레이어 요소를 유지하는 예시입니다:

```blade
@persist('player')
    <audio src="{{ $episode->file }}" controls></audio>
@endpersist
```

위 HTML이 두 페이지(현재 페이지와 다음 페이지) 모두에 나타나면, 원래 요소가 새 페이지에서 재사용됩니다. 오디오 플레이어의 경우, 한 페이지에서 다른 페이지로 이동해도 오디오 재생이 중단되지 않습니다.

유지되는 요소는 반드시 Livewire 컴포넌트 외부에 배치해야 한다는 점에 유의하세요. 일반적인 방법은 유지되는 요소를 메인 레이아웃(예: `resources/views/components/layouts/app.blade.php`)에 위치시키는 것입니다.

```html
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        <main>
            {{ $slot }}
        </main>

        @persist('player') <!-- [!code highlight:3] -->
            <audio src="{{ $episode->file }}" controls></audio>
        @endpersist
    </body>
</html>
```

### 활성 링크 강조 표시 {#highlighting-active-links}

서버 사이드 Blade를 사용해 내비게이션 바에서 현재 활성 페이지 링크를 다음과 같이 강조 표시하는 데 익숙할 수 있습니다:

```blade
<nav>
    <a href="/" class="@if (request->is('/')) font-bold text-zinc-800 @endif">Dashboard</a>
    <a href="/posts" class="@if (request->is('/posts')) font-bold text-zinc-800 @endif">Posts</a>
    <a href="/users" class="@if (request->is('/users')) font-bold text-zinc-800 @endif">Users</a>
</nav>
```

하지만, 이는 페이지 로드 간에 재사용되는 유지 요소 내에서는 동작하지 않습니다. 대신, 현재 활성 링크를 강조 표시하려면 Livewire의 `wire:current` 디렉티브를 사용해야 합니다.

적용하고자 하는 CSS 클래스를 `wire:current`에 전달하기만 하면 됩니다:

```blade
<nav>
    <a href="/dashboard" ... wire:current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... wire:current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... wire:current="font-bold text-zinc-800">Users</a>
</nav>
```

이제 `/posts` 페이지를 방문하면 "Posts" 링크가 다른 링크보다 더 강한 폰트 스타일로 표시됩니다.

자세한 내용은 [`wire:current` 문서](/livewire/3.x/wire-current)를 참고하세요.

### 스크롤 위치 유지 {#preserving-scroll-position}

기본적으로 Livewire는 페이지 간 앞뒤로 이동할 때 페이지의 스크롤 위치를 유지합니다. 하지만, 때로는 페이지 로드 간에 유지되는 개별 요소의 스크롤 위치를 보존하고 싶을 수 있습니다.

이를 위해서는 스크롤바가 있는 요소에 `wire:scroll`을 추가해야 합니다:

```html
@persist('scrollbar')
<div class="overflow-y-scroll" wire:scroll> <!-- [!code highlight] -->
    <!-- ... -->
</div>
@endpersist
```

## 자바스크립트 훅 {#javascript-hooks}

각 페이지 내비게이션은 세 가지 라이프사이클 훅을 트리거합니다:

* `livewire:navigate`
* `livewire:navigating`
* `livewire:navigated`

이 세 가지 훅 이벤트는 모든 유형의 내비게이션에서 디스패치된다는 점이 중요합니다. 여기에는 `Livewire.navigate()`를 사용한 수동 내비게이션, 내비게이션이 활성화된 리다이렉트, 브라우저의 뒤로/앞으로 버튼 클릭이 모두 포함됩니다.

아래는 각 이벤트에 대한 리스너를 등록하는 예시입니다:

```js
document.addEventListener('livewire:navigate', (event) => {
    // 내비게이션이 트리거될 때 실행됩니다.

    // "취소"할 수 있습니다(실제로 내비게이션이 수행되지 않도록 방지):
    event.preventDefault()

    // 내비게이션 트리거에 대한 유용한 컨텍스트가 포함되어 있습니다:
    let context = event.detail

    // 내비게이션의 의도된 목적지의 URL 객체...
    context.url

    // 이 내비게이션이 뒤로/앞으로(히스토리 상태) 내비게이션에 의해
    // 트리거되었는지 여부를 나타내는 불리언 값 [true/false]...
    context.history

    // 이 페이지의 캐시된 버전을 네트워크 왕복 없이
    // 사용할 수 있는지 여부를 나타내는
    // 불리언 값 [true/false]...
    context.cached
})

document.addEventListener('livewire:navigating', () => {
    // 새 HTML이 페이지에 교체되기 직전에 트리거됩니다...

    // 페이지를 벗어나기 전에
    // HTML을 변형할 수 있는 좋은 위치입니다...
})

document.addEventListener('livewire:navigated', () => {
    // 모든 페이지 내비게이션의 마지막 단계에서 트리거됩니다...

    // "DOMContentLoaded" 대신 페이지 로드 시에도 트리거됩니다...
})
```

> [!warning] 이벤트 리스너는 페이지 간에 유지됩니다
>
> 문서에 이벤트 리스너를 추가하면 다른 페이지로 이동해도 제거되지 않습니다. 특정 페이지로 이동한 후에만 코드가 실행되어야 하거나, 모든 페이지에서 동일한 이벤트 리스너를 추가하는 경우 예기치 않은 동작이 발생할 수 있습니다. 이벤트 리스너를 제거하지 않으면 존재하지 않는 요소를 찾으려 할 때 다른 페이지에서 예외가 발생하거나, 내비게이션마다 이벤트 리스너가 여러 번 실행될 수 있습니다.
>
> 이벤트 리스너가 실행된 후 제거하는 쉬운 방법은 `addEventListener` 함수의 세 번째 인자로 `{once: true}` 옵션을 전달하는 것입니다.
> ```js
> document.addEventListener('livewire:navigated', () => {
>     // ...
> }, { once: true })
> ```

## 새 페이지로 수동 이동 {#manually-visiting-a-new-page}

`wire:navigate` 외에도, JavaScript를 사용해 `Livewire.navigate()` 메서드를 수동으로 호출하여 새 페이지로 이동을 트리거할 수 있습니다:

```html
<script>
    // ...

    Livewire.navigate('/new/url')
</script>
```

## 분석 소프트웨어와 함께 사용하기 {#using-with-analytics-software}

앱에서 `wire:navigate`를 사용해 페이지를 이동할 때, `<head>` 내의 모든 `<script>` 태그는 페이지가 처음 로드될 때만 실행됩니다.

이로 인해 [Fathom Analytics](https://usefathom.com/)와 같은 분석 소프트웨어에 문제가 발생할 수 있습니다. 이러한 도구는 모든 페이지 변경마다 `<script>` 스니펫이 실행되기를 기대하지만, 첫 번째 페이지만 실행됩니다.

[Google Analytics](https://marketingplatform.google.com/about/analytics/)와 같은 도구는 이를 자동으로 처리할 만큼 똑똑하지만, Fathom Analytics를 사용할 때는 각 페이지 방문이 제대로 추적되도록 `<script>` 태그에 `data-spa="auto"`를 추가해야 합니다:

```blade
<head>
    <!-- ... -->

    <!-- Fathom Analytics -->
    @if (! config('app.debug'))
        <script src="https://cdn.usefathom.com/script.js" data-site="ABCDEFG" data-spa="auto" defer></script> <!-- [!code highlight] -->
    @endif
</head>
```

## 스크립트 평가 {#script-evaluation}

`wire:navigate`를 사용해 새 페이지로 이동할 때, 브라우저가 페이지를 변경한 것처럼 _느껴지지만_, 브라우저 관점에서는 기술적으로 여전히 원래 페이지에 있습니다.

이로 인해 스타일과 스크립트는 첫 번째 페이지에서 정상적으로 실행되지만, 이후 페이지에서는 JavaScript를 작성하는 방식을 약간 조정해야 할 수 있습니다.

`wire:navigate`를 사용할 때 알아야 할 몇 가지 주의사항과 시나리오가 있습니다.

### `DOMContentLoaded`에 의존하지 마세요 {#dont-rely-on-domcontentloaded}

JavaScript를 `DOMContentLoaded` 이벤트 리스너 안에 두어, 실행하고자 하는 코드가 페이지가 완전히 로드된 후에만 실행되도록 하는 것이 일반적입니다.

`wire:navigate`를 사용할 때는, `DOMContentLoaded`가 첫 번째 페이지 방문에서만 발생하고 이후 방문에서는 발생하지 않습니다.

모든 페이지 방문마다 코드를 실행하려면, 모든 `DOMContentLoaded` 인스턴스를 `livewire:navigated`로 교체하세요:

```js
document.addEventListener('DOMContentLoaded', () => { // [!code --]
document.addEventListener('livewire:navigated', () => { // [!code ++]
    // ...
})
```

이제 이 리스너 안에 둔 코드는 초기 페이지 방문 시와 Livewire가 이후 페이지로 내비게이션을 마친 후에도 실행됩니다.

이 이벤트를 듣는 것은 서드파티 라이브러리 초기화와 같은 작업에 유용합니다.

### `<head>`의 스크립트는 한 번만 로드됨 {#scripts-in-head-are-loaded-once}

두 페이지가 `<head>`에 동일한 `<script>` 태그를 포함하고 있다면, 해당 스크립트는 초기 페이지 방문에서만 실행되고 이후 페이지 방문에서는 실행되지 않습니다.

```blade
<!-- 첫 번째 페이지 -->
<head>
    <script src="/app.js"></script>
</head>

<!-- 두 번째 페이지 -->
<head>
    <script src="/app.js"></script>
</head>
```

### 새로운 `<head>` 스크립트는 평가됨 {#new-head-scripts-are-evaluated}

이후 페이지가 초기 페이지 방문의 `<head>`에 없던 새로운 `<script>` 태그를 `<head>`에 포함하고 있다면, Livewire가 새 `<script>` 태그를 실행합니다.

아래 예시에서 _두 번째 페이지_는 서드파티 도구용 새로운 JavaScript 라이브러리를 포함합니다. 사용자가 _두 번째 페이지_로 이동하면 해당 라이브러리가 평가됩니다.

```blade
<!-- 첫 번째 페이지 -->
<head>
    <script src="/app.js"></script>
</head>

<!-- 두 번째 페이지 -->
<head>
    <script src="/app.js"></script>
    <script src="/third-party.js"></script>
</head>
```

> [!info] head 에셋은 블로킹됩니다
> 새 페이지에 `<head>` 태그 내에 `<script src="...">`와 같은 에셋이 포함되어 있다면, 해당 에셋은 내비게이션이 완료되어 새 페이지가 교체되기 전에 가져와지고 처리됩니다. 이는 놀라운 동작일 수 있지만, 해당 에셋에 의존하는 스크립트가 즉시 접근할 수 있도록 보장합니다.

### 에셋이 변경될 때 새로고침 {#reloading-when-assets-change}

애플리케이션의 메인 JavaScript 파일 이름에 버전 해시를 포함하는 것이 일반적입니다. 이렇게 하면 새 버전의 애플리케이션을 배포한 후 사용자가 브라우저 캐시에서 오래된 버전이 아닌 최신 JavaScript 에셋을 받게 됩니다.

하지만, 이제 `wire:navigate`를 사용해 각 페이지 방문이 더 이상 새로운 브라우저 페이지 로드가 아니므로, 배포 후에도 사용자가 여전히 오래된 JavaScript를 받을 수 있습니다.

이를 방지하려면 `<head>`의 `<script>` 태그에 `data-navigate-track`을 추가하세요:

```blade
<!-- 첫 번째 페이지 -->
<head>
    <script src="/app.js?id=123" data-navigate-track></script>
</head>

<!-- 두 번째 페이지 -->
<head>
    <script src="/app.js?id=456" data-navigate-track></script>
</head>
```

사용자가 _두 번째 페이지_를 방문하면, Livewire가 새로운 JavaScript 에셋을 감지하고 전체 브라우저 페이지를 새로고침합니다.

[Laravel의 Vite 플러그인](/laravel/12.x/vite#loading-your-scripts-and-styles)을 사용해 에셋을 번들링하고 제공하는 경우, Livewire는 렌더링된 HTML 에셋 태그에 `data-navigate-track`을 자동으로 추가합니다. 평소처럼 에셋과 스크립트를 참조하면 됩니다:

```blade
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

Livewire가 렌더링된 HTML 태그에 `data-navigate-track`을 자동으로 주입합니다.

> [!warning] 쿼리 문자열 변경만 추적됩니다
> Livewire는 `[data-navigate-track]` 요소의 쿼리 문자열(`?id="456"`)이 변경될 때만 페이지를 새로고침하며, URI 자체(`/app.js`)가 변경되어도 새로고침하지 않습니다.

### `<body>`의 스크립트는 다시 평가됨 {#scripts-in-the-body-are-re-evaluated}

Livewire는 새 페이지마다 `<body>`의 전체 내용을 교체하기 때문에, 새 페이지의 모든 `<script>` 태그가 실행됩니다:

```blade
<!-- 첫 번째 페이지 -->
<body>
    <script>
        console.log('Runs on page one')
    </script>
</body>

<!-- 두 번째 페이지 -->
<body>
    <script>
        console.log('Runs on page two')
    </script>
</body>
```

`<body>`에 한 번만 실행되길 원하는 `<script>` 태그가 있다면, `<script>` 태그에 `data-navigate-once` 속성을 추가하면 Livewire가 초기 페이지 방문에서만 실행합니다:

```blade
<script data-navigate-once>
    console.log('Runs only on page one')
</script>
```

## 진행 바 커스터마이징 {#customizing-the-progress-bar}

페이지 로드에 150ms 이상 걸릴 때, Livewire는 페이지 상단에 진행 바를 표시합니다.

이 바의 색상을 커스터마이징하거나 Livewire의 설정 파일(`config/livewire.php`)에서 완전히 비활성화할 수 있습니다:

```php
'navigate' => [
    'show_progress_bar' => false,
    'progress_bar_color' => '#2299dd',
],
```
