---
title: 커스텀 필드
---
# [폼.필드] 커스텀 필드

<LaracastsBanner
    title="커스텀 폼 필드 만들기"
    description="Laracasts의 Build Advanced Components for Filament 시리즈를 시청하세요 - 컴포넌트 제작 방법을 배우고, 내부 도구들을 모두 익힐 수 있습니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/6"
    series="building-advanced-components"
/>

## 뷰 필드 {#view-fields}

[커스텀 필드 만들기](#custom-field-classes) 외에도, 추가적인 PHP 클래스 없이 커스텀 필드를 만들 수 있는 "뷰" 필드를 생성할 수 있습니다.

```php
use Filament\Forms\Components\ViewField;

ViewField::make('rating')
    ->view('filament.forms.components.range-slider')
```

이는 `resources/views/filament/forms/components/range-slider.blade.php` 파일이 존재한다고 가정합니다.

### 뷰 필드에 데이터 전달하기 {#passing-data-to-view-fields}

`viewData()`를 사용하여 뷰에 간단한 데이터 배열을 전달할 수 있습니다:

```php
use Filament\Forms\Components\ViewField;

ViewField::make('rating')
    ->view('filament.forms.components.range-slider')
    ->viewData([
        'min' => 1,
        'max' => 5,
    ])
```

하지만, 더 복잡한 설정은 [커스텀 필드 클래스](#custom-field-classes)를 통해 구현할 수 있습니다.

## 커스텀 필드 클래스 {#custom-field-classes}

프로젝트 전반에 재사용하거나, 커뮤니티에 플러그인으로 배포할 수 있는 커스텀 필드 클래스와 뷰를 직접 만들 수 있습니다.

> 단순히 한 번만 사용할 커스텀 필드를 만든다면, [뷰 필드](#view)를 사용하여 원하는 Blade 파일을 렌더링할 수 있습니다.

커스텀 필드 클래스와 뷰를 생성하려면 다음 명령어를 사용할 수 있습니다:

```bash
php artisan make:form-field RangeSlider
```

이 명령어는 다음과 같은 필드 클래스를 생성합니다:

```php
use Filament\Forms\Components\Field;

class RangeSlider extends Field
{
    protected string $view = 'filament.forms.components.range-slider';
}
```

또한 `resources/views/filament/forms/components/range-slider.blade.php` 위치에 뷰 파일도 생성됩니다.

## 필드의 동작 방식 {#how-fields-work}

Livewire 컴포넌트는 사용자의 브라우저에 상태가 저장되는 PHP 클래스입니다. 네트워크 요청이 발생하면, 상태가 서버로 전송되어 Livewire 컴포넌트 클래스의 public 속성에 채워지며, PHP의 다른 클래스 속성과 동일하게 접근할 수 있습니다.

예를 들어, `$name`이라는 public 속성을 가진 Livewire 컴포넌트가 있다고 가정해봅시다. 이 속성을 Livewire 컴포넌트의 HTML 입력 필드에 두 가지 방법으로 바인딩할 수 있습니다: [`wire:model` 속성](/livewire/3.x/properties#data-binding)을 사용하거나, Alpine.js 속성과 [엔탱글링](/livewire/3.x/javascript#the-wire-object)하는 방법입니다:

```blade
<input wire:model="name" />

<!-- 또는 -->

<div x-data="{ state: $wire.$entangle('name') }">
    <input x-model="state" />
</div>
```

사용자가 입력 필드에 값을 입력하면, `$name` 속성이 Livewire 컴포넌트 클래스에서 업데이트됩니다. 사용자가 폼을 제출하면, `$name` 속성이 서버로 전송되어 저장할 수 있습니다.

이것이 Filament에서 필드가 동작하는 기본 원리입니다. 각 필드는 Livewire 컴포넌트 클래스의 public 속성에 할당되며, 이곳에 필드의 상태가 저장됩니다. 이 속성의 이름을 필드의 "state path"라고 부릅니다. 필드의 뷰에서 `$getStatePath()` 함수를 사용하여 state path에 접근할 수 있습니다:

```blade
<input wire:model="{{ $getStatePath() }}" />

<!-- 또는 -->

<div x-data="{ state: $wire.$entangle('{{ $getStatePath() }}') }">
    <input x-model="state" />
</div>
```

컴포넌트가 서드파티 라이브러리에 크게 의존한다면, Filament 에셋 시스템을 사용하여 Alpine.js 컴포넌트를 비동기적으로 로드하는 것을 권장합니다. 이렇게 하면 Alpine.js 컴포넌트가 필요할 때만 로드되고, 모든 페이지 로드 시마다 불필요하게 로드되지 않습니다. 자세한 방법은 [에셋 문서](../../support/assets#asynchronous-alpinejs-components)를 참고하세요.

## 필드 래퍼 렌더링하기 {#rendering-the-field-wrapper}

Filament에는 필드의 라벨, 유효성 검사 오류, 기타 텍스트를 렌더링할 수 있는 "필드 래퍼" 컴포넌트가 포함되어 있습니다. 뷰에서 다음과 같이 필드 래퍼를 렌더링할 수 있습니다:

```blade
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <!-- 필드 -->
</x-dynamic-component>
```

필요할 때마다 필드 래퍼 컴포넌트를 사용하는 것이 권장되며, 이를 통해 필드의 디자인이 폼의 나머지 부분과 일관성을 유지할 수 있습니다.

## Eloquent 레코드 접근하기 {#accessing-the-eloquent-record}

뷰 내부에서 `$getRecord()` 함수를 사용하여 Eloquent 레코드에 접근할 수 있습니다:

```blade
<div>
    {{ $getRecord()->name }}
</div>
```

## 상태 바인딩 수정자 준수하기 {#obeying-state-binding-modifiers}

필드를 state path에 바인딩할 때, `defer` 수정자를 사용하여 사용자가 폼을 제출하거나 다음 Livewire 요청이 발생할 때만 상태가 서버로 전송되도록 할 수 있습니다. 이것이 기본 동작입니다.

하지만, 필드에 [`live()`](../advanced#the-basics-of-reactivity)를 사용하면 사용자가 필드와 상호작용할 때마다 상태가 즉시 서버로 전송됩니다. 이는 [고급](../advanced) 문서에서 설명된 다양한 고급 사용 사례에 활용할 수 있습니다.

Filament는 뷰에서 `wire:model` 또는 `$wire.$entangle()` 바인딩에 상태 바인딩 수정자를 적용할 수 있는 `$applyStateBindingModifiers()` 함수를 제공합니다:

```blade
<input {{ $applyStateBindingModifiers('wire:model') }}="{{ $getStatePath() }}" />

<!-- 또는 -->

<div x-data="{ state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$getStatePath()}')") }} }">
    <input x-model="state" />
</div>
```
