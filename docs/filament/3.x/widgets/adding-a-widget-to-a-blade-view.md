---
title: 위젯을 Blade 뷰에 추가하기
---
# [위젯] 위젯을 Blade 뷰에 추가하기
## 개요 {#overview}

위젯은 Livewire 컴포넌트이기 때문에, `@livewire` 디렉티브를 사용하여 어떤 Blade 뷰에서도 쉽게 위젯을 렌더링할 수 있습니다:

```blade
<div>
    @livewire(\App\Livewire\Dashboard\PostsChart::class)
</div>
```
