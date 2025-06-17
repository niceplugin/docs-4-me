# wire:current
`wire:current` 지시어를 사용하면 페이지에서 현재 활성화된 링크를 쉽게 감지하고 스타일을 지정할 수 있습니다.

다음은 네비게이션 바의 링크에 `wire:current`를 추가하여 현재 활성화된 링크에 더 강한 글꼴 두께를 적용하는 간단한 예시입니다:

```blade
<nav>
    <a href="/dashboard" ... wire:current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... wire:current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... wire:current="font-bold text-zinc-800">Users</a>
</nav>
```

이제 사용자가 `/posts`를 방문하면 "Posts" 링크가 다른 링크보다 더 두드러진 글꼴 스타일로 표시됩니다.

`wire:current`는 `wire:navigate` 링크 및 페이지 변경과 함께 별도의 설정 없이 바로 작동한다는 점에 유의하세요.

## 정확히 일치시키기 {#exact-matching}

기본적으로 `wire:current`는 부분 일치 전략을 사용합니다. 즉, 링크와 현재 페이지의 URL 경로가 시작 부분에서 일치하면 적용됩니다.

예를 들어, 링크가 `/posts`이고 현재 페이지가 `/posts/1`인 경우, `wire:current` 지시문이 적용됩니다.

정확히 일치시키고 싶다면, 지시문에 `.exact` 수식어를 추가할 수 있습니다.

아래는 사용자가 `/posts`를 방문할 때 "Dashboard" 링크가 강조 표시되지 않도록 정확히 일치시키는 예시입니다:

```blade
<nav>
    <a href="/" wire:current.exact="font-bold">Dashboard</a>
</nav>
```

## 엄격한 일치 {#strict-matching}

기본적으로 `wire:current`는 비교 시 끝에 있는 슬래시(`/`)를 제거합니다.

이 동작을 비활성화하고 경로 문자열을 엄격하게 비교하고 싶다면, `.strict` 수식어를 추가할 수 있습니다:

```blade
<nav>
    <a href="/posts/" wire:current.strict="font-bold">Dashboard</a>
</nav>
```

## 문제 해결 {#troubleshooting}

`wire:current`가 현재 링크를 올바르게 감지하지 못하는 경우, 다음 사항을 확인하세요:

* 페이지에 적어도 하나의 Livewire 컴포넌트가 있거나, 레이아웃에 `@livewireScripts`를 하드코딩했는지 확인하세요.
* 링크에 `href` 속성이 있는지 확인하세요.
