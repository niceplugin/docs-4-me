---
title: 탭스 블레이드 컴포넌트
---
# [핵심개념.Blade컴포넌트] tabs
## 개요 {#overview}

탭 컴포넌트는 여러 콘텐츠 섹션 간을 전환할 수 있는 탭 집합을 렌더링할 수 있게 해줍니다:

```blade
<x-filament::tabs label="Content tabs">
    <x-filament::tabs.item>
        탭 1
    </x-filament::tabs.item>

    <x-filament::tabs.item>
        탭 2
    </x-filament::tabs.item>

    <x-filament::tabs.item>
        탭 3
    </x-filament::tabs.item>
</x-filament::tabs>
```

## 탭의 활성 상태 트리거하기 {#triggering-the-active-state-of-the-tab}

기본적으로 탭은 "활성" 상태로 표시되지 않습니다. 탭을 활성 상태로 보이게 하려면 `active` 속성을 사용할 수 있습니다:

```blade
<x-filament::tabs>
    <x-filament::tabs.item active>
        탭 1
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```

또한 `active` 속성을 사용하여 조건부로 탭을 활성 상태로 만들 수 있습니다:

```blade
<x-filament::tabs>
    <x-filament::tabs.item
        :active="$activeTab === 'tab1'"
        wire:click="$set('activeTab', 'tab1')"
    >
        탭 1
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```

또는 Alpine.js를 사용하여 `alpine-active` 속성으로 조건부로 탭을 활성 상태로 만들 수도 있습니다:

```blade
<x-filament::tabs x-data="{ activeTab: 'tab1' }">
    <x-filament::tabs.item
        alpine-active="activeTab === 'tab1'"
        x-on:click="activeTab = 'tab1'"
    >
        탭 1
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```

## 탭 아이콘 설정하기 {#setting-a-tab-icon}

탭에는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 사용할 수 있으며, `icon` 속성을 사용하여 설정할 수 있습니다:

```blade
<x-filament::tabs>
    <x-filament::tabs.item icon="heroicon-m-bell">
        알림
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```

### 탭 아이콘 위치 설정 {#setting-the-tab-icon-position}

탭의 아이콘은 `icon-position` 속성을 사용하여 라벨 앞이나 뒤에 위치시킬 수 있습니다:

```blade
<x-filament::tabs>
    <x-filament::tabs.item
        icon="heroicon-m-bell"
        icon-position="after"
    >
        알림
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```

## 탭 배지 설정하기 {#setting-a-tab-badge}

탭에는 [배지](badge)를 추가할 수 있으며, `badge` 슬롯을 사용하여 설정할 수 있습니다:

```blade
<x-filament::tabs>
    <x-filament::tabs.item>
        알림

        <x-slot name="badge">
            5
        </x-slot>
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```

## 탭을 앵커 링크로 사용하기 {#using-a-tab-as-an-anchor-link}

기본적으로 탭의 하위 HTML 태그는 `<button>`입니다. `tag` 속성을 사용하여 `<a>` 태그로 변경할 수 있습니다:

```blade
<x-filament::tabs>
    <x-filament::tabs.item
        :href="route('notifications')"
        tag="a"
    >
        Notifications
    </x-filament::tabs.item>

    {{-- 다른 탭들 --}}
</x-filament::tabs>
```
