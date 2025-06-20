# 오프라인 상태
실시간 애플리케이션에서는 사용자의 기기가 더 이상 인터넷에 연결되어 있지 않다는 시각적 표시를 제공하는 것이 도움이 될 수 있습니다.

Livewire는 이러한 경우를 위해 `wire:offline` 지시어를 제공합니다.

Livewire 컴포넌트 내부의 요소에 `wire:offline`을 추가하면, 해당 요소는 기본적으로 숨겨지며 사용자가 연결을 잃었을 때 표시됩니다:
```blade
<div wire:offline>
    이 기기는 현재 오프라인 상태입니다.
</div>
```

## 클래스 토글링 {#toggling-classes}

`class` 수정자를 추가하면 사용자가 연결을 잃었을 때 요소에 클래스를 추가할 수 있습니다. 사용자가 다시 온라인이 되면 클래스는 다시 제거됩니다:

```blade
<div wire:offline.class="bg-red-300">
```

또는 `.remove` 수정자를 사용하여 사용자가 연결을 잃었을 때 클래스를 제거할 수 있습니다. 이 예제에서는 사용자가 연결을 잃었을 때 `<div>`에서 `bg-green-300` 클래스가 제거됩니다:

```blade
<div class="bg-green-300" wire:offline.class.remove="bg-green-300">
```

## 속성 토글링 {#toggling-attributes}

`.attr` 수정자를 사용하면 사용자가 연결을 잃었을 때 요소에 속성을 추가할 수 있습니다. 이 예제에서는 사용자가 연결을 잃었을 때 "저장" 버튼이 비활성화됩니다:

```blade
<button wire:offline.attr="disabled">저장</button>
```

