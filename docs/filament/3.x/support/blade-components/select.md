---
title: Select 블레이드 컴포넌트
---
# [핵심개념.Blade컴포넌트] input.select
## 개요 {#overview}

select 컴포넌트는 기본 `<select>` 요소를 감싸는 래퍼입니다. 옵션 목록에서 단일 값을 선택할 수 있는 간단한 인터페이스를 제공합니다:

```blade
<x-filament::input.wrapper>
    <x-filament::input.select wire:model="status">
        <option value="draft">임시 저장</option>
        <option value="reviewing">검토 중</option>
        <option value="published">게시됨</option>
    </x-filament::input.select>
</x-filament::input.wrapper>
```

select 컴포넌트를 사용하려면, 반드시 "input wrapper" 컴포넌트로 감싸야 하며, 이 컴포넌트는 테두리와 접두사 또는 접미사와 같은 기타 요소를 제공합니다. input wrapper 컴포넌트의 커스터마이징에 대해 더 알고 싶다면 [여기](input-wrapper)를 참고하세요.
