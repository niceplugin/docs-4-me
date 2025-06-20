---
title: 체크박스 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] input.checkbox
## 개요 {#overview}

체크박스 컴포넌트를 사용하여 불리언 값을 토글할 수 있는 체크박스 입력을 렌더링할 수 있습니다:

```blade
<label>
    <x-filament::input.checkbox wire:model="isAdmin" />

    <span>
        관리자 여부
    </span>
</label>
```

## 체크박스의 에러 상태 트리거하기 {#triggering-the-error-state-of-the-checkbox}

체크박스에는 유효하지 않을 때 사용할 수 있는 특별한 스타일이 있습니다. 이 스타일을 트리거하려면 Blade 또는 Alpine.js를 사용할 수 있습니다.

Blade를 사용하여 에러 상태를 트리거하려면, 컴포넌트에 `valid` 속성을 전달할 수 있으며, 이 속성은 체크박스가 유효한지 여부에 따라 true 또는 false 값을 가집니다:

```blade
<x-filament::input.checkbox
    wire:model="isAdmin"
    :valid="! $errors->has('isAdmin')"
/>
```

또는, Alpine.js 표현식을 사용하여 에러 상태를 트리거할 수도 있으며, 해당 표현식이 `true` 또는 `false`로 평가되는지에 따라 달라집니다:

```blade
<div x-data="{ errors: ['isAdmin'] }">
    <x-filament::input.checkbox
        x-model="isAdmin"
        alpine-valid="! errors.includes('isAdmin')"
    />
</div>
```
