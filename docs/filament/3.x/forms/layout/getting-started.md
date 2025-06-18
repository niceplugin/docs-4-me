---
title: 시작하기
---
# [폼.레이아웃] 시작하기

## 개요 {#overview}

<LaracastsBanner
    title="레이아웃"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈에서 Filament 폼 레이아웃 커스터마이징의 기초를 배워보세요."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/6"
    series="rapid-laravel-development"
/>

Filament 폼은 단순히 필드만 표시하는 데 그치지 않습니다. "레이아웃 컴포넌트"를 사용하여 폼을 무한히 중첩 가능한 구조로 구성할 수 있습니다.

레이아웃 컴포넌트 클래스는 `Filament\Forms\Components` 네임스페이스에 있습니다. 이들은 폼의 스키마 내에서 [필드](/filament/3.x/forms/fields/getting-started)와 함께 위치합니다.

컴포넌트는 보통 정적 `make()` 메서드를 사용해 생성합니다. 일반적으로 자식 컴포넌트를 표시하기 위해 `schema()`를 정의합니다:

```php
use Filament\Forms\Components\Grid;

Grid::make(2)
    ->schema([
        // ...
    ])
```

## 사용 가능한 레이아웃 컴포넌트 {#available-layout-components}

Filament는 다양한 레이아웃 컴포넌트를 기본으로 제공하여, 필요에 따라 폼 필드를 배치할 수 있습니다:

- [그리드](grid)
- [필드셋](fieldset)
- [탭](tabs)
- [위저드](wizard)
- [섹션](section)
- [스플릿](split)
- [플레이스홀더](placeholder)

또한, [사용자 정의 레이아웃 컴포넌트](custom)를 만들어 원하는 방식으로 필드를 구성할 수도 있습니다.

## ID 설정하기 {#setting-an-id}

`id()` 메서드를 사용하여 컴포넌트의 ID를 정의할 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make()
    ->id('main-section')
```

## 추가 HTML 속성 추가하기 {#adding-extra-html-attributes}

컴포넌트에 추가 HTML 속성을 전달할 수 있으며, 이는 외부 DOM 요소에 병합됩니다. `extraAttributes()` 메서드에 속성 이름을 키로, 속성 값을 값으로 하는 배열을 전달하세요:

```php
use Filament\Forms\Components\Section;

Section::make()
    ->extraAttributes(['class' => 'custom-section-style'])
```

클래스는 기본 클래스와 병합되며, 그 외의 속성은 기본 속성을 덮어씁니다.

## 전역 설정 {#global-settings}

컴포넌트의 기본 동작을 전역적으로 변경하고 싶다면, 서비스 프로바이더의 `boot()` 메소드 안에서 정적 메소드인 `configureUsing()`을 호출할 수 있습니다. 이 메소드에는 컴포넌트를 수정할 수 있는 클로저를 전달합니다. 예를 들어, 모든 section 컴포넌트가 기본적으로 [2열](grid)을 가지도록 하려면 다음과 같이 할 수 있습니다:

```php
use Filament\Forms\Components\Section;

Section::configureUsing(function (Section $section): void {
    $section
        ->columns(2);
});
```

물론, 각 필드에서 개별적으로 이 설정을 덮어쓸 수도 있습니다:

```php
use Filament\Forms\Components\Section;

Section::make()
    ->columns(1)
```
