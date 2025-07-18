---
title: 시작하기
---
# [인포리스트.레이아웃] 시작하기
## 개요 {#overview}

인포리스트는 단순히 항목을 표시하는 것에만 국한되지 않습니다. "레이아웃 컴포넌트"를 사용하여 무한히 중첩 가능한 구조로 구성할 수도 있습니다.

레이아웃 컴포넌트 클래스는 `Filament\Infolists\Components` 네임스페이스에서 찾을 수 있습니다. 이들은 인포리스트의 스키마 내에 [항목](../entries/getting-started)과 함께 위치합니다.

컴포넌트는 정적 `make()` 메서드를 사용하여 생성할 수 있습니다. 일반적으로, 그 안에 표시할 자식 컴포넌트의 `schema()`를 정의하게 됩니다:

```php
use Filament\Infolists\Components\Grid;

Grid::make(2)
    ->schema([
        // ...
    ])
```

## 사용 가능한 레이아웃 컴포넌트 {#available-layout-components}

Filament는 필요에 따라 폼 필드를 배치할 수 있는 몇 가지 레이아웃 컴포넌트를 기본으로 제공합니다:

- [Grid](grid)
- [Fieldset](fieldset)
- [Tabs](tabs)
- [Section](section)
- [Split](split)

필요에 따라 [사용자 정의 레이아웃 컴포넌트](custom)를 만들어 원하는 방식으로 필드를 구성할 수도 있습니다.

## ID 설정하기 {#setting-an-id}

`id()` 메서드를 사용하여 컴포넌트의 ID를 정의할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make()
    ->id('main-section')
```

## 추가 HTML 속성 지정하기 {#adding-extra-html-attributes}

컴포넌트에 추가 HTML 속성을 전달할 수 있으며, 이는 외부 DOM 요소에 병합됩니다. `extraAttributes()` 메서드에 속성 이름을 키로, 속성 값을 값으로 하는 배열을 전달하세요:

```php
use Filament\Infolists\Components\Group;

Section::make()
    ->extraAttributes(['class' => 'custom-section-style'])
```

클래스는 기본 클래스와 병합되며, 다른 속성은 기본 속성을 덮어씁니다.

## 전역 설정 {#global-settings}

컴포넌트의 기본 동작을 전역적으로 변경하고 싶다면, 서비스 프로바이더의 `boot()` 메서드 내에서 정적 `configureUsing()` 메서드를 호출할 수 있습니다. 이때 컴포넌트를 수정할 클로저를 전달합니다. 예를 들어, 모든 section 컴포넌트가 기본적으로 [2열](grid)이 되도록 하려면 다음과 같이 할 수 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::configureUsing(function (Section $section): void {
    $section
        ->columns(2);
});
```

물론, 각 필드별로 이를 개별적으로 덮어쓸 수도 있습니다:

```php
use Filament\Infolists\Components\Section;

Section::make()
    ->columns(1)
```
