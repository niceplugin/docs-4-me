---
title: 링크 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] link
## 개요 {#overview}

링크 컴포넌트는 동작을 수행할 수 있는 클릭 가능한 링크를 렌더링하는 데 사용됩니다:

```blade
<x-filament::link :href="route('users.create')">
    새 사용자
</x-filament::link>
```

## 링크를 버튼으로 사용하기 {#using-a-link-as-a-button}

기본적으로 링크의 하위 HTML 태그는 `<a>`입니다. `tag` 속성을 사용하여 `<button>` 태그로 변경할 수 있습니다:

```blade
<x-filament::link
    wire:click="openNewUserModal"
    tag="button"
>
    새 사용자
</x-filament::link>
```

## 링크의 크기 설정하기 {#setting-the-size-of-a-link}

기본적으로 링크의 크기는 "medium"입니다. `size` 속성을 사용하여 "small", "large", "extra large" 또는 "extra extra large"로 변경할 수 있습니다:

```blade
<x-filament::link size="sm">
    새 사용자
</x-filament::link>

<x-filament::link size="lg">
    새 사용자
</x-filament::link>

<x-filament::link size="xl">
    새 사용자
</x-filament::link>

<x-filament::link size="2xl">
    새 사용자
</x-filament::link>
```

## 링크의 글꼴 두께 설정하기 {#setting-the-font-weight-of-a-link}

기본적으로 링크의 글꼴 두께는 `semibold`입니다. `weight` 속성을 사용하여 `thin`, `extralight`, `light`, `normal`, `medium`, `bold`, `extrabold` 또는 `black`으로 변경할 수 있습니다:

```blade
<x-filament::link weight="thin">
    새 사용자
</x-filament::link>

<x-filament::link weight="extralight">
    새 사용자
</x-filament::link>

<x-filament::link weight="light">
    새 사용자
</x-filament::link>

<x-filament::link weight="normal">
    새 사용자
</x-filament::link>

<x-filament::link weight="medium">
    새 사용자
</x-filament::link>

<x-filament::link weight="semibold">
    새 사용자
</x-filament::link>
   
<x-filament::link weight="bold">
    새 사용자
</x-filament::link>

<x-filament::link weight="black">
    새 사용자
</x-filament::link> 
```

또는, 커스텀 CSS 클래스를 전달하여 두께를 정의할 수 있습니다:

```blade
<x-filament::link weight="md:font-[650]">
    새 사용자
</x-filament::link>
```

## 링크의 색상 변경하기 {#changing-the-color-of-a-link}

기본적으로 링크의 색상은 "primary"입니다. `color` 속성을 사용하여 `danger`, `gray`, `info`, `success` 또는 `warning`으로 변경할 수 있습니다:

```blade
<x-filament::link color="danger">
    새 사용자
</x-filament::link>

<x-filament::link color="gray">
    새 사용자
</x-filament::link>

<x-filament::link color="info">
    새 사용자
</x-filament::link>

<x-filament::link color="success">
    새 사용자
</x-filament::link>

<x-filament::link color="warning">
    새 사용자
</x-filament::link>
```

## 링크에 아이콘 추가하기 {#adding-an-icon-to-a-link}

`icon` 속성을 사용하여 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 링크에 추가할 수 있습니다:

```blade
<x-filament::link icon="heroicon-m-sparkles">
    새 사용자
</x-filament::link>
```

또한, `icon-position` 속성을 사용하여 아이콘의 위치를 텍스트 뒤로 변경할 수 있습니다:

```blade
<x-filament::link
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    새 사용자
</x-filament::link>
```

## 링크에 툴팁 추가하기 {#adding-a-tooltip-to-a-link}

`tooltip` 속성을 사용하여 링크에 툴팁을 추가할 수 있습니다:

```blade
<x-filament::link tooltip="사용자 등록">
    새 사용자
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

`badge-color` 속성을 사용하여 [배지의 색상](badge#changing-the-color-of-the-badge)을 변경할 수 있습니다:

```blade
<x-filament::link badge-color="danger">
    알림을 읽음으로 표시

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::link>
```
