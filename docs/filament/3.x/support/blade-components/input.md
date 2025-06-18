---
title: Input Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] input
## 개요 {#overview}

입력 컴포넌트는 기본 `<input>` 요소를 감싸는 래퍼입니다. 한 줄의 텍스트를 입력할 수 있는 간단한 인터페이스를 제공합니다.

```blade
<x-filament::input.wrapper>
    <x-filament::input
        type="text"
        wire:model="name"
    />
</x-filament::input.wrapper>
```

입력 컴포넌트를 사용하려면 반드시 "input wrapper" 컴포넌트로 감싸야 하며, 이 컴포넌트는 테두리와 접두사 또는 접미사와 같은 기타 요소를 제공합니다. 입력 래퍼 컴포넌트의 커스터마이징 방법은 [여기](input-wrapper)에서 자세히 확인할 수 있습니다.
