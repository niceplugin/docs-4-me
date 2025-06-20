---
title: 모달 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] modal
## 개요 {#overview}

모달 컴포넌트는 어떤 내용이든 다이얼로그 창이나 슬라이드 오버로 열 수 있습니다:

```blade
<x-filament::modal>
    <x-slot name="trigger">
        <x-filament::button>
            모달 열기
        </x-filament::button>
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

## JavaScript에서 모달 제어하기 {#controlling-a-modal-from-javascript}

`trigger` 슬롯을 사용하여 모달을 여는 버튼을 렌더링할 수 있습니다. 하지만, 이는 필수가 아닙니다. JavaScript를 통해 모달이 열리고 닫히는 시점을 완전히 제어할 수 있습니다. 먼저, 모달에 ID를 부여하여 참조할 수 있도록 합니다:

```blade
<x-filament::modal id="edit-user">
    {{-- 모달 내용 --}}
</x-filament::modal>
```

이제, `open-modal` 또는 `close-modal` 브라우저 이벤트를 디스패치하면서 모달의 ID를 전달하면 모달을 열거나 닫을 수 있습니다. 예를 들어, Livewire 컴포넌트에서:

```php
$this->dispatch('open-modal', id: 'edit-user');
```

또는 Alpine.js에서:

```php
$dispatch('open-modal', { id: 'edit-user' })
```

## 모달에 헤딩 추가하기 {#adding-a-heading-to-a-modal}

`heading` 슬롯을 사용하여 모달에 헤딩을 추가할 수 있습니다:

```blade
<x-filament::modal>
    <x-slot name="heading">
        모달 헤딩
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달에 설명 추가하기 {#adding-a-description-to-a-modal}

`description` 슬롯을 사용하여 모달의 헤딩 아래에 설명을 추가할 수 있습니다:

```blade
<x-filament::modal>
    <x-slot name="heading">
        모달 헤딩
    </x-slot>

    <x-slot name="description">
        모달 설명
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달에 아이콘 추가하기 {#adding-an-icon-to-a-modal}

`icon` 속성을 사용하여 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 모달에 추가할 수 있습니다:

```blade
<x-filament::modal icon="heroicon-o-information-circle">
    <x-slot name="heading">
        모달 헤딩
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

기본적으로 아이콘의 색상은 "primary"입니다. `icon-color` 속성을 사용하여 `danger`, `gray`, `info`, `success`, `warning` 중 하나로 변경할 수 있습니다:

```blade
<x-filament::modal
    icon="heroicon-o-exclamation-triangle"
    icon-color="danger"
>
    <x-slot name="heading">
        모달 헤딩
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달에 푸터 추가하기 {#adding-a-footer-to-a-modal}

`footer` 슬롯을 사용하여 모달에 푸터를 추가할 수 있습니다:

```blade
<x-filament::modal>
    {{-- 모달 내용 --}}
    
    <x-slot name="footer">
        {{-- 모달 푸터 내용 --}}
    </x-slot>
</x-filament::modal>
```

또는, `footerActions` 슬롯을 사용하여 푸터에 액션을 추가할 수 있습니다:

```blade
<x-filament::modal>
    {{-- 모달 내용 --}}
    
    <x-slot name="footerActions">
        {{-- 모달 푸터 액션 --}}
    </x-slot>
</x-filament::modal>
```

## 모달 정렬 변경하기 {#changing-the-modals-alignment}

기본적으로 모달 내용은 시작점에 정렬되며, 모달의 [너비](#changing-the-modal-width)가 `xs` 또는 `sm`일 경우 중앙에 정렬됩니다. 모달의 내용 정렬을 변경하려면 `alignment` 속성에 `start` 또는 `center`를 전달하면 됩니다:

```blade
<x-filament::modal alignment="center">
    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달 대신 슬라이드 오버 사용하기 {#using-a-slide-over-instead-of-a-modal}

`slide-over` 속성을 사용하여 모달 대신 "슬라이드 오버" 다이얼로그를 열 수 있습니다:

```blade
<x-filament::modal slide-over>
    {{-- 슬라이드 오버 내용 --}}
</x-filament::modal>
```

## 모달 헤더를 스티키로 만들기 {#making-the-modal-header-sticky}

모달의 헤더는 모달 내용이 모달 크기를 초과할 때 스크롤되어 화면에서 사라집니다. 하지만, 슬라이드 오버는 항상 보이는 스티키 모달 헤더를 가집니다. `sticky-header` 속성을 사용하여 이 동작을 제어할 수 있습니다:

```blade
<x-filament::modal sticky-header>
    <x-slot name="heading">
        모달 헤딩
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달 푸터를 스티키로 만들기 {#making-the-modal-footer-sticky}

모달의 푸터는 기본적으로 내용 뒤에 인라인으로 렌더링됩니다. 하지만, 슬라이드 오버는 스크롤 시 항상 보이는 스티키 푸터를 가집니다. `sticky-footer` 속성을 사용하여 모달에서도 이 기능을 활성화할 수 있습니다:

```blade
<x-filament::modal sticky-footer>
    {{-- 모달 내용 --}}
    
    <x-slot name="footer">
        {{-- 모달 푸터 내용 --}}
    </x-slot>
</x-filament::modal>
```

## 모달 너비 변경하기 {#changing-the-modal-width}

`width` 속성을 사용하여 모달의 너비를 변경할 수 있습니다. 옵션은 [Tailwind의 max-width scale](https://tailwindcss.com/docs/max-width)에 해당합니다. 옵션은 `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `screen`입니다:

```blade
<x-filament::modal width="5xl">
    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 바깥 클릭으로 모달 닫기 {#closing-the-modal-by-clicking-away}

기본적으로 모달 바깥을 클릭하면 모달이 닫힙니다. 특정 동작에 대해 이 동작을 비활성화하려면 `close-by-clicking-away` 속성을 사용할 수 있습니다:

```blade
<x-filament::modal :close-by-clicking-away="false">
    {{-- 모달 내용 --}}
</x-filament::modal>
```

## ESC 키로 모달 닫기 {#closing-the-modal-by-escaping}

기본적으로 모달에서 ESC 키를 누르면 모달이 닫힙니다. 특정 동작에 대해 이 동작을 비활성화하려면 `close-by-escaping` 속성을 사용할 수 있습니다:

```blade
<x-filament::modal :close-by-escaping="false">
    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달 닫기 버튼 숨기기 {#hiding-the-modal-close-button}

기본적으로 헤더가 있는 모달은 오른쪽 상단에 닫기 버튼이 있습니다. `close-button` 속성을 사용하여 모달에서 닫기 버튼을 제거할 수 있습니다:

```blade
<x-filament::modal :close-button="false">
    <x-slot name="heading">
        모달 헤딩
    </x-slot>

    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달 자동 포커스 방지하기 {#preventing-the-modal-from-autofocusing}

기본적으로 모달이 열릴 때 첫 번째 포커스 가능한 요소에 자동으로 포커스됩니다. 이 동작을 비활성화하려면 `autofocus` 속성을 사용할 수 있습니다:

```blade
<x-filament::modal :autofocus="false">
    {{-- 모달 내용 --}}
</x-filament::modal>
```

## 모달 트리거 버튼 비활성화하기 {#disabling-the-modal-trigger-button}

기본적으로 트리거 버튼이 비활성화되어 있어도 모달이 열립니다. 이는 클릭 이벤트 리스너가 버튼 자체의 래핑 요소에 등록되어 있기 때문입니다. 모달이 열리지 않도록 하려면 트리거 슬롯에도 `disabled` 속성을 사용해야 합니다:

```blade
<x-filament::modal>
    <x-slot name="trigger" disabled>
        <x-filament::button :disabled="true">
            모달 열기
        </x-filament::button>
    </x-slot>
    {{-- 모달 내용 --}}
</x-filament::modal>
```

