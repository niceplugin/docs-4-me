# [HTML지시문] wire:cloak
`wire:cloak`은(는) 페이지가 로드될 때 Livewire가 완전히 초기화될 때까지 요소를 숨기는 디렉티브입니다. 이는 페이지가 Livewire가 초기화되기 전에 로드될 때 발생할 수 있는 "스타일이 적용되지 않은 콘텐츠의 깜빡임"을 방지하는 데 유용합니다.

## 기본 사용법 {#basic-usage}

`wire:cloak`을 사용하려면, 페이지 로드 중에 숨기고 싶은 어떤 요소에든 이 디렉티브를 추가하세요:

```blade
<div wire:cloak>
    이 내용은 Livewire가 완전히 로드될 때까지 숨겨집니다
</div>
```

### 동적 콘텐츠 {#dynamic-content}

`wire:cloak`은 `wire:show`를 사용하여 표시 또는 숨김 처리되는 요소와 같이 초기화되지 않은 동적 콘텐츠를 사용자가 보지 못하도록 방지하고 싶을 때 특히 유용합니다.

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

위 예시에서 `wire:cloak`이 없으면 Livewire가 초기화되기 전에 두 아이콘이 모두 표시됩니다. 하지만 `wire:cloak`을 사용하면 초기화될 때까지 두 요소 모두 숨겨집니다.
