# wire:init
Livewire는 컴포넌트가 렌더링되자마자 액션을 실행할 수 있도록 `wire:init` 디렉티브를 제공합니다. 이 기능은 전체 페이지 로드를 지연시키고 싶지 않지만, 페이지 로드 직후에 일부 데이터를 즉시 불러오고 싶을 때 유용합니다.

```blade
<div wire:init="loadPosts">
    <!-- ... -->
</div>
```

`loadPosts` 액션은 Livewire 컴포넌트가 페이지에 렌더링된 직후에 즉시 실행됩니다.

하지만 대부분의 경우에는 [`Livewire의 지연 로딩 기능`](/livewire/3.x/lazy)을 사용하는 것이 `wire:init`을 사용하는 것보다 더 바람직합니다.
