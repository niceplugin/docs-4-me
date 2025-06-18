---
title: 링크 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] link
## 개요 {#overview}

링크 컴포넌트는 클릭 가능한 링크를 렌더링하여 동작을 수행할 수 있도록 사용됩니다:

```blade
<x-filament::link :href="route('users.create')">
    새 사용자
</x-filament::link>
```

## 버튼으로 링크 사용하기 {#using-a-link-as-a-button}

기본적으로 링크의 하위 HTML 태그는 `<a>`입니다. `tag` 속성을 사용하여 `<button>` 태그로 변경할 수 있습니다:

```blade
<x-filament::link
    wire:click="openNewUserModal"
    tag="button"
>
    New user
</x-filament::link>
```

## 링크의 크기 설정하기 {#setting-the-size-of-a-link}

기본적으로 링크의 크기는 "medium"입니다. `size` 속성을 사용하여 "small", "large", "extra large" 또는 "extra extra large"로 변경할 수 있습니다:

```blade
<x-filament::link size="sm">
    New user
</x-filament::link>

<x-filament::link size="lg">
    New user
</x-filament::link>

<x-filament::link size="xl">
    New user
</x-filament::link>

<x-filament::link size="2xl">
    New user
</x-filament::link>
```

## 링크의 글꼴 두께 설정하기 {#setting-the-font-weight-of-a-link}

기본적으로 링크의 글꼴 두께는 `semibold`입니다. `weight` 속성을 사용하여 `thin`, `extralight`, `light`, `normal`, `medium`, `bold`, `extrabold`, `black` 중 하나로 변경할 수 있습니다:

```blade
<x-filament::link weight="thin">
    New user
</x-filament::link>

<x-filament::link weight="extralight">
    New user
</x-filament::link>

<x-filament::link weight="light">
    New user
</x-filament::link>

<x-filament::link weight="normal">
    New user
</x-filament::link>

<x-filament::link weight="medium">
    New user
</x-filament::link>

<x-filament::link weight="semibold">
    New user
</x-filament::link>
   
<x-filament::link weight="bold">
    New user
</x-filament::link>

<x-filament::link weight="black">
    New user
</x-filament::link> 
```

또는, 커스텀 CSS 클래스를 전달하여 두께를 직접 지정할 수도 있습니다:

```blade
<x-filament::link weight="md:font-[650]">
    New user
</x-filament::link>
```

## 링크 색상 변경하기 {#changing-the-color-of-a-link}

기본적으로 링크의 색상은 "primary"입니다. `color` 속성을 사용하여 `danger`, `gray`, `info`, `success`, 또는 `warning`으로 변경할 수 있습니다:

```blade
<x-filament::link color="danger">
    New user
</x-filament::link>

<x-filament::link color="gray">
    New user
</x-filament::link>

<x-filament::link color="info">
    New user
</x-filament::link>

<x-filament::link color="success">
    New user
</x-filament::link>

<x-filament::link color="warning">
    New user
</x-filament::link>
```

## 링크에 아이콘 추가하기 {#adding-an-icon-to-a-link}

`icon` 속성을 사용하여 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 링크에 추가할 수 있습니다:

```blade
<x-filament::link icon="heroicon-m-sparkles">
    New user
</x-filament::link>
```

또한, `icon-position` 속성을 사용하여 아이콘의 위치를 텍스트 뒤로 변경할 수도 있습니다:

```blade
<x-filament::link
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    New user
</x-filament::link>
```

## 링크에 툴팁 추가하기 {#adding-a-tooltip-to-a-link}

`tooltip` 속성을 사용하여 링크에 툴팁을 추가할 수 있습니다:

```blade
<x-filament::link tooltip="Register a user">
    New user
</x-filament::link>
```

## 링크에 배지 추가하기 {#adding-a-badge-to-a-link}

`badge` 슬롯을 사용하여 링크 위에 [배지](badge)를 렌더링할 수 있습니다:

```blade
<x-filament::link>
    알림을 읽음으로 표시

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::link>
```

`badge-color` 속성을 사용하여 배지의 [색상을 변경](badge#changing-the-color-of-the-badge)할 수 있습니다:

```blade
<x-filament::link badge-color="danger">
    알림을 읽음으로 표시

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::link>
```
