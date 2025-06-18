---
title: 필드셋 블레이드 컴포넌트
---
# [핵심개념.Blade컴포넌트] fieldset
## 개요 {#overview}

여러 개의 폼 필드를 함께 그룹화하기 위해 필드셋(fieldset)을 사용할 수 있으며, 선택적으로 라벨을 추가할 수 있습니다:

```blade
<x-filament::fieldset>
    <x-slot name="label">
        주소
    </x-slot>
    
    {{-- 폼 필드 --}}
</x-filament::fieldset>
```
