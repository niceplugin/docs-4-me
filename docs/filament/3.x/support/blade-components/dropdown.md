---
title: 드롭다운 블레이드 컴포넌트
---
# [핵심개념.Blade컴포넌트] dropdown
## 개요 {#overview}

드롭다운 컴포넌트는 버튼을 클릭하여 드롭다운 메뉴를 렌더링할 수 있게 해줍니다:

```blade
<x-filament::dropdown>
    <x-slot name="trigger">
        <x-filament::button>
            더 많은 작업
        </x-filament::button>
    </x-slot>
    
    <x-filament::dropdown.list>
        <x-filament::dropdown.list.item wire:click="openViewModal">
            보기
        </x-filament::dropdown.list.item>
        
        <x-filament::dropdown.list.item wire:click="openEditModal">
            수정
        </x-filament::dropdown.list.item>
        
        <x-filament::dropdown.list.item wire:click="openDeleteModal">
            삭제
        </x-filament::dropdown.list.item>
    </x-filament::dropdown.list>
</x-filament::dropdown>
```

## 드롭다운 항목을 앵커 링크로 사용하기 {#using-a-dropdown-item-as-an-anchor-link}

기본적으로 드롭다운 항목의 하위 HTML 태그는 `<button>`입니다. `tag` 속성을 사용하여 `<a>` 태그로 변경할 수 있습니다:

```blade
<x-filament::dropdown.list.item
    href="https://filamentphp.com"
    tag="a"
>
    Filament
</x-filament::dropdown.list.item>
```

## 드롭다운 항목의 색상 변경하기 {#changing-the-color-of-a-dropdown-item}

기본적으로 드롭다운 항목의 색상은 "gray"입니다. `color` 속성을 사용하여 `danger`, `info`, `primary`, `success`, `warning` 중 하나로 변경할 수 있습니다:

```blade
<x-filament::dropdown.list.item color="danger">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="info">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="primary">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="success">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="warning">
    Edit
</x-filament::dropdown.list.item>
```

## 드롭다운 항목에 아이콘 추가하기 {#adding-an-icon-to-a-dropdown-item}

`icon` 속성을 사용하여 드롭다운 항목에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수 있습니다:

```blade
<x-filament::dropdown.list.item icon="heroicon-m-pencil">
    Edit
</x-filament::dropdown.list.item>
```

### 드롭다운 항목의 아이콘 색상 변경하기 {#changing-the-icon-color-of-a-dropdown-item}

기본적으로 아이콘 색상은 [항목 자체의 색상과 동일하게](#changing-the-color-of-a-dropdown-item) 사용됩니다. `icon-color` 속성을 사용하여 `danger`, `info`, `primary`, `success`, `warning` 중 하나로 오버라이드할 수 있습니다:

```blade
<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="danger">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="info">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="primary">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="success">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="warning">
    Edit
</x-filament::dropdown.list.item>
```

## 드롭다운 항목에 이미지 추가하기 {#adding-an-image-to-a-dropdown-item}

`image` 속성을 사용하여 드롭다운 항목에 원형 이미지를 추가할 수 있습니다:

```blade
<x-filament::dropdown.list.item image="https://filamentphp.com/dan.jpg">
    Dan Harrin
</x-filament::dropdown.list.item>
```

## 드롭다운 항목에 배지 추가하기 {#adding-a-badge-to-a-dropdown-item}

`badge` 슬롯을 사용하여 드롭다운 항목 위에 [배지](badge)를 렌더링할 수 있습니다:

```blade
<x-filament::dropdown.list.item>
    알림을 읽음으로 표시
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::dropdown.list.item>
```
`badge-color` 속성을 사용하여 배지의 [색상을 변경](badge#changing-the-color-of-the-badge)할 수 있습니다:

```blade

<x-filament::dropdown.list.item badge-color="danger">
    알림을 읽음으로 표시
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::dropdown.list.item>
```



## 드롭다운의 위치 설정하기 {#setting-the-placement-of-a-dropdown}

드롭다운은 `placement` 속성을 사용하여 트리거 버튼을 기준으로 위치를 지정할 수 있습니다:

```blade
<x-filament::dropdown placement="top-start">
    {{-- 드롭다운 항목들 --}}
</x-filament::dropdown>
```

## 드롭다운의 너비 설정하기 {#setting-the-width-of-a-dropdown}

드롭다운의 너비는 `width` 속성을 사용하여 설정할 수 있습니다. 옵션은 [Tailwind의 max-width 스케일](https://tailwindcss.com/docs/max-width)과 일치합니다. 사용 가능한 옵션은 `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`입니다:

```blade
<x-filament::dropdown width="xs">
    {{-- 드롭다운 항목들 --}}
</x-filament::dropdown>
```

## 드롭다운의 최대 높이 제어하기 {#controlling-the-maximum-height-of-a-dropdown}

드롭다운 내용은 `max-height` 속성을 사용하여 최대 높이를 지정할 수 있으며, 이로 인해 스크롤이 생깁니다. [CSS 길이](https://developer.mozilla.org/en-US/docs/Web/CSS/length)를 전달할 수 있습니다:

```blade
<x-filament::dropdown max-height="400px">
    {{-- 드롭다운 항목 --}}
</x-filament::dropdown>
```
