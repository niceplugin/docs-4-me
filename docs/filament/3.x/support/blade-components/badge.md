---
title: 배지 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] badge
## 개요 {#overview}

배지 컴포넌트는 내부에 텍스트가 들어간 작은 상자를 렌더링하는 데 사용됩니다:

```blade
<x-filament::badge>
    New
</x-filament::badge>
```

## 배지의 크기 설정하기 {#setting-the-size-of-a-badge}

기본적으로 배지의 크기는 "medium"입니다. `size` 속성을 사용하여 "extra small" 또는 "small"로 변경할 수 있습니다:

```blade
<x-filament::badge size="xs">
    New
</x-filament::badge>

<x-filament::badge size="sm">
    New
</x-filament::badge>
```

## 배지의 색상 변경하기 {#changing-the-color-of-the-badge}

기본적으로 배지의 색상은 "primary"입니다. `color` 속성을 사용하여 `danger`, `gray`, `info`, `success` 또는 `warning`으로 변경할 수 있습니다:

```blade
<x-filament::badge color="danger">
    New
</x-filament::badge>

<x-filament::badge color="gray">
    New
</x-filament::badge>

<x-filament::badge color="info">
    New
</x-filament::badge>

<x-filament::badge color="success">
    New
</x-filament::badge>

<x-filament::badge color="warning">
    New
</x-filament::badge>
```

## 배지에 아이콘 추가하기 {#adding-an-icon-to-a-badge}

[아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 `icon` 속성을 사용하여 배지에 추가할 수 있습니다:

```blade
<x-filament::badge icon="heroicon-m-sparkles">
    New
</x-filament::badge>
```

또한 `icon-position` 속성을 사용하여 아이콘의 위치를 텍스트 뒤로 변경할 수 있습니다:

```blade
<x-filament::badge
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    New
</x-filament::badge>
```
