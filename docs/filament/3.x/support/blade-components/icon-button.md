---
title: 아이콘 버튼 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] icon-button
## 개요 {#overview}

버튼 컴포넌트는 클릭 가능한 버튼을 렌더링하여 동작을 수행할 때 사용됩니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    wire:click="openNewUserModal"
    label="New label"
/>
```

## 아이콘 버튼을 앵커 링크로 사용하기 {#using-an-icon-button-as-an-anchor-link}

기본적으로 아이콘 버튼의 HTML 태그는 `<button>`입니다. `tag` 속성을 사용하여 `<a>` 태그로 변경할 수 있습니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-arrow-top-right-on-square"
    href="https://filamentphp.com"
    tag="a"
    label="Filament"
/>
```

## 아이콘 버튼의 크기 설정하기 {#setting-the-size-of-an-icon-button}

기본적으로 아이콘 버튼의 크기는 "medium"입니다. `size` 속성을 사용하여 "extra small", "small", "large", "extra large"로 변경할 수 있습니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    size="xs"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    size="sm"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-s-plus"
    size="lg"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-s-plus"
    size="xl"
    label="New label"
/>
```

## 아이콘 버튼의 색상 변경하기 {#changing-the-color-of-an-icon-button}

기본적으로 아이콘 버튼의 색상은 "primary"입니다. `color` 속성을 사용하여 `danger`, `gray`, `info`, `success`, `warning` 중 하나로 변경할 수 있습니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    color="danger"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="gray"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="info"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="success"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="warning"
    label="New label"
/>
```

## 아이콘 버튼에 툴팁 추가하기 {#adding-a-tooltip-to-an-icon-button}

`tooltip` 속성을 사용하여 아이콘 버튼에 툴팁을 추가할 수 있습니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    tooltip="사용자 등록"
    label="새 레이블"
/>
```

## 아이콘 버튼에 배지 추가하기 {#adding-a-badge-to-an-icon-button}

`badge` 슬롯을 사용하여 아이콘 버튼 위에 [배지](badge)를 렌더링할 수 있습니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-x-mark"
    label="Mark notifications as read"
>
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::icon-button>
```

`badge-color` 속성을 사용하여 배지의 [색상을 변경](badge#changing-the-color-of-the-badge)할 수 있습니다:

```blade
<x-filament::icon-button
    icon="heroicon-m-x-mark"
    label="Mark notifications as read"
    badge-color="danger"
>
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::icon-button>
```
