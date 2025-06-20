---
title: 버튼 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] button
## 개요 {#overview}

버튼 컴포넌트는 클릭 가능한 버튼을 렌더링하여 동작을 수행할 수 있도록 사용됩니다:

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

## 버튼의 크기 설정하기 {#setting-the-size-of-a-button}

기본적으로 버튼의 크기는 "medium"입니다. `size` 속성을 사용하여 "extra small", "small", "large" 또는 "extra large"로 변경할 수 있습니다:

```blade
<x-filament::button size="xs">
    새 사용자
</x-filament::button>

<x-filament::button size="sm">
    새 사용자
</x-filament::button>

<x-filament::button size="lg">
    새 사용자
</x-filament::button>

<x-filament::button size="xl">
    새 사용자
</x-filament::button>
```

## 버튼 색상 변경하기 {#changing-the-color-of-a-button}

기본적으로 버튼의 색상은 "primary"입니다. `color` 속성을 사용하여 `danger`, `gray`, `info`, `success` 또는 `warning`으로 변경할 수 있습니다:

```blade
<x-filament::button color="danger">
    새 사용자
</x-filament::button>

<x-filament::button color="gray">
    새 사용자
</x-filament::button>

<x-filament::button color="info">
    새 사용자
</x-filament::button>

<x-filament::button color="success">
    새 사용자
</x-filament::button>

<x-filament::button color="warning">
    새 사용자
</x-filament::button>
```

## 버튼에 아이콘 추가하기 {#adding-an-icon-to-a-button}

[아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 `icon` 속성을 사용하여 버튼에 추가할 수 있습니다:

```blade
<x-filament::button icon="heroicon-m-sparkles">
    새 사용자
</x-filament::button>
```

또한 `icon-position` 속성을 사용하여 아이콘의 위치를 텍스트 뒤로 변경할 수 있습니다:

```blade
<x-filament::button
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    새 사용자
</x-filament::button>
```

## 버튼을 아웃라인으로 만들기 {#making-a-button-outlined}

`outlined` 속성을 사용하여 버튼을 "아웃라인" 디자인으로 만들 수 있습니다:

```blade
<x-filament::button outlined>
    새 사용자
</x-filament::button>
```

## 버튼에 툴팁 추가하기 {#adding-a-tooltip-to-a-button}

`tooltip` 속성을 사용하여 버튼에 툴팁을 추가할 수 있습니다:

```blade
<x-filament::button tooltip="사용자 등록">
    새 사용자
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

`badge-color` 속성을 사용하여 [배지의 색상](badge#changing-the-color-of-the-badge)을 변경할 수 있습니다:

```blade
<x-filament::button badge-color="danger">
    알림을 읽음으로 표시
    
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::button>
```
