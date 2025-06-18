---
title: 버튼 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] button
## 개요 {#overview}

버튼 컴포넌트는 클릭 가능한 버튼을 렌더링하여 동작을 수행할 때 사용됩니다:

```blade
<x-filament::button wire:click="openNewUserModal">
    새 사용자
</x-filament::button>
```

## 버튼을 앵커 링크로 사용하기 {#using-a-button-as-an-anchor-link}

기본적으로 버튼의 하위 HTML 태그는 `<button>`입니다. `tag` 속성을 사용하여 `<a>` 태그로 변경할 수 있습니다:

```blade
<x-filament::button
    href="https://filamentphp.com"
    tag="a"
>
    Filament
</x-filament::button>
```

## 버튼 크기 설정하기 {#setting-the-size-of-a-button}

기본적으로 버튼의 크기는 "medium"입니다. `size` 속성을 사용하여 "extra small", "small", "large", "extra large"로 변경할 수 있습니다:

```blade
<x-filament::button size="xs">
    New user
</x-filament::button>

<x-filament::button size="sm">
    New user
</x-filament::button>

<x-filament::button size="lg">
    New user
</x-filament::button>

<x-filament::button size="xl">
    New user
</x-filament::button>
```

## 버튼 색상 변경하기 {#changing-the-color-of-a-button}

기본적으로 버튼의 색상은 "primary"입니다. `color` 속성을 사용하여 `danger`, `gray`, `info`, `success`, `warning` 중 하나로 변경할 수 있습니다:

```blade
<x-filament::button color="danger">
    New user
</x-filament::button>

<x-filament::button color="gray">
    New user
</x-filament::button>

<x-filament::button color="info">
    New user
</x-filament::button>

<x-filament::button color="success">
    New user
</x-filament::button>

<x-filament::button color="warning">
    New user
</x-filament::button>
```

## 버튼에 아이콘 추가하기 {#adding-an-icon-to-a-button}

`icon` 속성을 사용하여 버튼에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수 있습니다:

```blade
<x-filament::button icon="heroicon-m-sparkles">
    New user
</x-filament::button>
```

또한, `icon-position` 속성을 사용하여 아이콘의 위치를 텍스트 뒤로 변경할 수도 있습니다:

```blade
<x-filament::button
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    New user
</x-filament::button>
```

## 버튼을 아웃라인 형태로 만들기 {#making-a-button-outlined}

`outlined` 속성을 사용하여 버튼을 "아웃라인" 디자인으로 만들 수 있습니다:

```blade
<x-filament::button outlined>
    New user
</x-filament::button>
```

## 버튼에 툴팁 추가하기 {#adding-a-tooltip-to-a-button}

`tooltip` 속성을 사용하여 버튼에 툴팁을 추가할 수 있습니다:

```blade
<x-filament::button tooltip="Register a user">
    New user
</x-filament::button>
```

## 버튼에 배지 추가하기 {#adding-a-badge-to-a-button}

`badge` 슬롯을 사용하여 버튼 위에 [배지](badge)를 렌더링할 수 있습니다:

```blade
<x-filament::button>
    알림을 읽음으로 표시

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::button>
```

`badge-color` 속성을 사용하여 배지의 [색상을 변경](badge#changing-the-color-of-the-badge)할 수 있습니다:

```blade
<x-filament::button badge-color="danger">
    알림을 읽음으로 표시

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::button>
```
