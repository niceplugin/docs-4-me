---
title: Section Blade component
---
# [핵심개념.Blade컴포넌트] section
## 개요 {#overview}

섹션은 선택적인 헤딩과 함께 콘텐츠를 그룹화하는 데 사용할 수 있습니다:

```blade
<x-filament::section>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

## 섹션에 설명 추가하기 {#adding-a-description-to-the-section}

`description` 슬롯을 사용하여 섹션의 헤딩 아래에 설명을 추가할 수 있습니다:

```blade
<x-filament::section>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    <x-slot name="description">
        이것은 우리가 보유하고 있는 모든 사용자 정보입니다.
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

## 섹션 헤더에 아이콘 추가하기 {#adding-an-icon-to-the-section-header}

`icon` 속성을 사용하여 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 섹션에 추가할 수 있습니다:

```blade
<x-filament::section icon="heroicon-o-user">
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

### 섹션 아이콘 색상 변경하기 {#changing-the-color-of-the-section-icon}

기본적으로 섹션 아이콘의 색상은 "gray"입니다. `icon-color` 속성을 사용하여 `danger`, `info`, `primary`, `success`, `warning` 중 하나로 변경할 수 있습니다:

```blade
<x-filament::section
    icon="heroicon-o-user"
    icon-color="info"
>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

### 섹션 아이콘 크기 변경하기 {#changing-the-size-of-the-section-icon}

기본적으로 섹션 아이콘의 크기는 "large"입니다. `icon-size` 속성을 사용하여 "small" 또는 "medium"으로 변경할 수 있습니다:

```blade
<x-filament::section
    icon="heroicon-m-user"
    icon-size="sm"
>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>

<x-filament::section
    icon="heroicon-m-user"
    icon-size="md"
>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

## 헤더 끝에 콘텐츠 추가하기 {#adding-content-to-the-end-of-the-header}

`headerEnd` 슬롯을 사용하여 헤딩과 설명 옆, 헤더 끝에 추가 콘텐츠를 렌더링할 수 있습니다:

```blade
<x-filament::section>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    <x-slot name="headerEnd">
        {{-- 사용자의 ID를 선택하는 입력 --}}
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

## 섹션을 접을 수 있도록 만들기 {#making-a-section-collapsible}

`collapsible` 속성을 사용하여 섹션의 콘텐츠를 접을 수 있도록 만들 수 있습니다:

```blade
<x-filament::section collapsible>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

### 기본적으로 접힌 섹션 만들기 {#making-a-section-collapsed-by-default}

`collapsed` 속성을 사용하여 섹션이 기본적으로 접힌 상태가 되도록 할 수 있습니다:

```blade
<x-filament::section
    collapsible
    collapsed
>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

### 접힌 섹션 상태 유지하기 {#persisting-collapsed-sections}

`persist-collapsed` 속성을 사용하여 섹션이 접힌 상태를 로컬 스토리지에 저장할 수 있습니다. 이렇게 하면 사용자가 페이지를 새로고침해도 접힌 상태가 유지됩니다. 각 섹션이 자신의 접힘 상태를 유지할 수 있도록 고유한 `id` 속성도 필요합니다:

```blade
<x-filament::section
    collapsible
    collapsed
    persist-collapsed
    id="user-details"
>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

## 섹션 헤더를 콘텐츠 옆에 배치하기 {#adding-the-section-header-aside-the-content-instead-of-above-it}

`aside` 속성을 사용하여 섹션 헤더의 위치를 콘텐츠 위가 아닌 옆으로 변경할 수 있습니다:

```blade
<x-filament::section aside>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```

### 콘텐츠를 헤더 앞에 배치하기 {#positioning-the-content-before-the-header}

`content-before` 속성을 사용하여 콘텐츠의 위치를 헤더 뒤가 아닌 앞에 오도록 변경할 수 있습니다:

```blade
<x-filament::section
    aside
    content-before
>
    <x-slot name="heading">
        사용자 정보
    </x-slot>

    {{-- 콘텐츠 --}}
</x-filament::section>
```
