# wire:cloak
`wire:cloak`는 Livewire가 완전히 초기화될 때까지 페이지 로드 시 요소를 숨기는 지시어입니다. 이는 페이지가 Livewire가 초기화되기 전에 로드될 때 발생할 수 있는 "스타일이 적용되지 않은 콘텐츠의 깜빡임"을 방지하는 데 유용합니다.

## 기본 사용법 {#basic-usage}

`wire:cloak`을 사용하려면, 페이지 로드 중에 숨기고 싶은 요소에 이 지시어를 추가하세요:

```blade
<div wire:cloak>
    이 콘텐츠는 Livewire가 완전히 로드될 때까지 숨겨집니다
</div>
```

### 동적 콘텐츠 {#dynamic-content}

`wire:cloak`는 `wire:show`를 사용하여 표시되거나 숨겨지는 요소와 같은 초기화되지 않은 동적 콘텐츠를 사용자가 보지 못하게 하고 싶을 때 특히 유용합니다.

```blade
<div>
    <div wire:show="starred" wire:cloak>
        <!-- 노란색 별 아이콘... -->
    </div>

    <div wire:show="!starred" wire:cloak>
        <!-- 회색 별 아이콘... -->
    </div>
</div>
```

위 예시에서, `wire:cloak` 없이라면 Livewire가 초기화되기 전에 두 아이콘 모두 표시됩니다. 그러나 `wire:cloak`을 사용하면 초기화될 때까지 두 요소 모두 숨겨집니다.
