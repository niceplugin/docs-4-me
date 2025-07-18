# wire:navigate
Livewire의 `wire:navigate` 기능은 페이지 네비게이션을 훨씬 더 빠르게 만들어, 사용자에게 SPA와 같은 경험을 제공합니다.

이 페이지는 `wire:navigate` 지시어에 대한 간단한 참고 자료입니다. 보다 완벽한 문서는 [Livewire의 Navigate 기능 페이지](/livewire/3.x/navigate)를 꼭 읽어보세요.

아래는 내비게이션 바의 링크에 `wire:navigate`를 추가하는 간단한 예시입니다:

```blade
<nav>
    <a href="/" wire:navigate>Dashboard</a>
    <a href="/posts" wire:navigate>Posts</a>
    <a href="/users" wire:navigate>Users</a>
</nav>
```

이 링크들 중 하나를 클릭하면, Livewire가 클릭을 가로채고 브라우저가 전체 페이지 이동을 수행하는 대신, Livewire가 백그라운드에서 페이지를 가져와 현재 페이지와 교체합니다(이로 인해 훨씬 더 빠르고 부드러운 페이지 네비게이션이 이루어집니다).

## 호버 시 페이지 미리 가져오기 {#prefetching-pages-on-hover}

`.hover` 수식어를 추가하면, 사용자가 링크 위에 마우스를 올렸을 때 Livewire가 해당 페이지를 미리 가져옵니다. 이렇게 하면 사용자가 링크를 클릭할 때 이미 서버에서 페이지가 다운로드되어 있게 됩니다.

```blade
<a href="/" wire:navigate.hover>Dashboard</a>
```

## 더 깊이 알아보기 {#going-deeper}

이 기능에 대한 보다 완벽한 문서는 [Livewire의 navigate 문서 페이지](/livewire/3.x/navigate)를 방문하세요.
