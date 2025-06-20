---
title: 입력 래퍼 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] input.wrapper
## 개요 {#overview}

입력 래퍼 컴포넌트는 [input](input) 또는 [select](select) 컴포넌트 주위에 래퍼로 사용해야 합니다. 이 컴포넌트는 테두리와 접두사 또는 접미사와 같은 기타 요소를 제공합니다.

```blade
<x-filament::input.wrapper>
    <x-filament::input
        type="text"
        wire:model="name"
    />
</x-filament::input.wrapper>

<x-filament::input.wrapper>
    <x-filament::input.select wire:model="status">
        <option value="draft">임시 저장</option>
        <option value="reviewing">검토 중</option>
        <option value="published">게시됨</option>
    </x-filament::input.select>
</x-filament::input.wrapper>
```

## 입력의 에러 상태 트리거하기 {#triggering-the-error-state-of-the-input}

이 컴포넌트는 유효하지 않을 때 사용할 수 있는 특별한 스타일을 가지고 있습니다. 이 스타일을 트리거하려면 Blade 또는 Alpine.js를 사용할 수 있습니다.

Blade를 사용하여 에러 상태를 트리거하려면, 입력이 유효한지 여부에 따라 true 또는 false 값을 가지는 `valid` 속성을 컴포넌트에 전달하면 됩니다:

```blade
<x-filament::input.wrapper :valid="! $errors->has('name')">
    <x-filament::input
        type="text"
        wire:model="name"
    />
</x-filament::input.wrapper>
```

또는 Alpine.js 표현식을 사용하여, 해당 값이 `true` 또는 `false`로 평가되는지에 따라 에러 상태를 트리거할 수 있습니다:

```blade
<div x-data="{ errors: ['name'] }">
    <x-filament::input.wrapper alpine-valid="! errors.includes('name')">
        <x-filament::input
            type="text"
            wire:model="name"
        />
    </x-filament::input.wrapper>
</div>
```

## 입력 비활성화하기 {#disabling-the-input}

입력을 비활성화하려면, 래퍼 컴포넌트에도 `disabled` 속성을 전달해야 합니다:

```blade
<x-filament::input.wrapper disabled>
    <x-filament::input
        type="text"
        wire:model="name"
        disabled
    />
</x-filament::input.wrapper>
```

## 입력 옆에 접두/접미 텍스트 추가하기 {#adding-affix-text-aside-the-input}

`prefix`와 `suffix` 슬롯을 사용하여 입력 앞뒤에 텍스트를 배치할 수 있습니다:

```blade
<x-filament::input.wrapper>
    <x-slot name="prefix">
        https://
    </x-slot>

    <x-filament::input
        type="text"
        wire:model="domain"
    />

    <x-slot name="suffix">
        .com
    </x-slot>
</x-filament::input.wrapper>
```

### 아이콘을 접두/접미로 사용하기 {#using-icons-as-affixes}

[아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 `prefix-icon` 및 `suffix-icon` 속성을 사용하여 입력 앞뒤에 배치할 수 있습니다:

```blade
<x-filament::input.wrapper suffix-icon="heroicon-m-globe-alt">
    <x-filament::input
        type="url"
        wire:model="domain"
    />
</x-filament::input.wrapper>
```

#### 접두/접미 아이콘 색상 설정하기 {#setting-the-affix-icons-color}

접두/접미 아이콘은 기본적으로 회색이지만, `prefix-icon-color` 및 `affix-icon-color` 속성을 사용하여 다른 색상으로 설정할 수 있습니다:

```blade
<x-filament::input.wrapper
    suffix-icon="heroicon-m-check-circle"
    suffix-icon-color="success"
>
    <x-filament::input
        type="url"
        wire:model="domain"
    />
</x-filament::input.wrapper>
```
