---
title: 아바타 블레이드 컴포넌트
---
# [핵심개념.Blade컴포넌트] avatar
## 개요 {#overview}

아바타 컴포넌트는 원형 또는 사각형 이미지를 렌더링하는 데 사용되며, 주로 사용자나 엔티티의 "프로필 사진"을 나타내는 데 사용됩니다:

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
/>
```

## 아바타의 둥글기 설정하기 {#setting-the-rounding-of-an-avatar}

아바타는 기본적으로 완전히 둥글게 표시되지만, `circular` 속성을 `false`로 설정하여 네모나게 만들 수 있습니다:

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
    :circular="false"
/>
```

## 아바타 크기 설정하기 {#setting-the-size-of-an-avatar}

기본적으로 아바타는 "medium" 크기로 표시됩니다. `size` 속성을 사용하여 크기를 `sm`, `md`, 또는 `lg`로 설정할 수 있습니다:

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
    size="lg"
/>
```

또한, `size` 속성에 직접 커스텀 크기 클래스를 전달할 수도 있습니다:

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
    size="w-12 h-12"
/>
