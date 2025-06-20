---
title: 트리거 버튼
---
# [액션] 트리거 버튼

## 개요 {#overview}

모든 액션에는 트리거 버튼이 있습니다. 사용자가 이 버튼을 클릭하면 액션이 실행됩니다. 즉, 모달이 열리거나, 클로저 함수가 실행되거나, URL로 리디렉션됩니다.

이 페이지는 해당 트리거 버튼의 모양을 커스터마이즈하는 방법에 대해 설명합니다.

## 트리거 스타일 선택하기 {#choosing-a-trigger-style}

기본적으로 액션 트리거에는 4가지 스타일이 있습니다 - "버튼", "링크", "아이콘 버튼", 그리고 "배지"입니다.

"버튼" 트리거는 배경색, 라벨, 그리고 선택적으로 [아이콘](#setting-an-icon)을 가질 수 있습니다. 일반적으로 이 스타일이 기본 버튼 스타일이지만, `button()` 메서드를 사용하여 수동으로 사용할 수도 있습니다:

```php
Action::make('edit')
    ->button()
```

<AutoScreenshot name="actions/trigger-button/button" alt="Button trigger" version="3.x" />

"링크" 트리거는 배경색이 없습니다. 반드시 라벨이 있어야 하며, 선택적으로 [아이콘](#setting-an-icon)을 가질 수 있습니다. 텍스트 내에 삽입된 링크처럼 보입니다. `link()` 메서드를 사용하여 이 스타일로 전환할 수 있습니다:

```php
Action::make('edit')
    ->link()
```

<AutoScreenshot name="actions/trigger-button/link" alt="Link trigger" version="3.x" />

"아이콘 버튼" 트리거는 [아이콘](#setting-an-icon)만 있고 라벨이 없는 원형 버튼입니다. `iconButton()` 메서드를 사용하여 이 스타일로 전환할 수 있습니다:

```php
Action::make('edit')
    ->icon('heroicon-m-pencil-square')
    ->iconButton()
```

<AutoScreenshot name="actions/trigger-button/icon-button" alt="Icon button trigger" version="3.x" />

"배지" 트리거는 배경색, 라벨, 그리고 선택적으로 [아이콘](#setting-an-icon)을 가질 수 있습니다. `badge()` 메서드를 사용하여 배지를 트리거로 사용할 수 있습니다:

```php
Action::make('edit')
    ->badge()
```

<AutoScreenshot name="actions/trigger-button/badge" alt="Badge trigger" version="3.x" />

### 모바일 기기에서만 아이콘 버튼 사용하기 {#using-an-icon-button-on-mobile-devices-only}

데스크톱에서는 라벨이 있는 버튼 스타일을 사용하고, 모바일에서는 라벨을 제거하고 싶을 수 있습니다. 이렇게 하면 아이콘 버튼으로 변환됩니다. `labeledFrom()` 메서드에 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)를 전달하여 버튼에 라벨이 추가될 시점을 지정할 수 있습니다:

```php
Action::make('edit')
    ->icon('heroicon-m-pencil-square')
    ->button()
    ->labeledFrom('md')
```

## 라벨 설정하기 {#setting-a-label}

기본적으로 트리거 버튼의 라벨은 이름에서 자동으로 생성됩니다. `label()` 메서드를 사용하여 이를 커스터마이즈할 수 있습니다:

```php
Action::make('edit')
    ->label('Edit post')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

선택적으로, `translateLabel()` 메서드를 사용하여 [라벨을 라라벨의 로컬라이제이션 기능](https://laravel.com/docs/localization)으로 자동 번역할 수 있습니다:

```php
Action::make('edit')
    ->translateLabel() // `label(__('Edit'))`과 동일
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

## 색상 설정하기 {#setting-a-color}

버튼은 그 중요성을 나타내기 위해 색상을 가질 수 있습니다. `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
Action::make('delete')
    ->color('danger')
```

<AutoScreenshot name="actions/trigger-button/danger" alt="Red trigger" version="3.x" />

## 크기 설정하기 {#setting-a-size}

버튼은 3가지 크기가 있습니다 - `ActionSize::Small`, `ActionSize::Medium`, `ActionSize::Large`입니다. `size()` 메서드를 사용하여 액션 트리거의 크기를 변경할 수 있습니다:

```php
use Filament\Support\Enums\ActionSize;

Action::make('create')
    ->size(ActionSize::Large)
```

<AutoScreenshot name="actions/trigger-button/large" alt="Large trigger" version="3.x" />

## 아이콘 설정하기 {#setting-an-icon}

버튼은 UI에 더 많은 디테일을 추가하기 위해 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 가질 수 있습니다. `icon()` 메서드를 사용하여 아이콘을 설정할 수 있습니다:

```php
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->icon('heroicon-m-pencil-square')
```

<AutoScreenshot name="actions/trigger-button/icon" alt="Trigger with icon" version="3.x" />

또한, `iconPosition()` 메서드를 사용하여 아이콘의 위치를 라벨 앞이 아닌 뒤로 변경할 수 있습니다:

```php
use Filament\Support\Enums\IconPosition;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->icon('heroicon-m-pencil-square')
    ->iconPosition(IconPosition::After)
```

<AutoScreenshot name="actions/trigger-button/icon-after" alt="Trigger with icon after the label" version="3.x" />

## 권한 부여 {#authorization}

특정 사용자에게만 액션을 조건부로 표시하거나 숨길 수 있습니다. 이를 위해 `visible()` 또는 `hidden()` 메서드를 사용할 수 있습니다:

```php
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->visible(auth()->user()->can('update', $this->post))

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->hidden(! auth()->user()->can('update', $this->post))
```

이 방법은 특정 권한이 있는 사용자만 액션을 사용할 수 있도록 할 때 유용합니다.

### 버튼 비활성화하기 {#disabling-a-button}

버튼을 숨기는 대신 비활성화하고 싶다면, `disabled()` 메서드를 사용할 수 있습니다:

```php
Action::make('delete')
    ->disabled()
```

불리언 값을 전달하여 버튼을 조건부로 비활성화할 수도 있습니다:

```php
Action::make('delete')
    ->disabled(! auth()->user()->can('delete', $this->post))
```

## 키 바인딩 등록하기 {#registering-keybindings}

트리거 버튼에 키보드 단축키를 연결할 수 있습니다. 이 단축키는 [Mousetrap](https://craig.is/killing/mice)과 동일한 키 코드를 사용합니다:

```php
use Filament\Actions\Action;

Action::make('save')
    ->action(fn () => $this->save())
    ->keyBindings(['command+s', 'ctrl+s'])
```

## 버튼 모서리에 배지 추가하기 {#adding-a-badge-to-the-corner-of-the-button}

버튼의 모서리에 배지를 추가하여 원하는 정보를 표시할 수 있습니다. 예를 들어, 어떤 개수나 상태 표시기에 유용합니다:

```php
use Filament\Actions\Action;

Action::make('filter')
    ->iconButton()
    ->icon('heroicon-m-funnel')
    ->badge(5)
```

<AutoScreenshot name="actions/trigger-button/badged" alt="Trigger with badge" version="3.x" />

배지에 사용할 색상도 전달할 수 있으며, `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
use Filament\Actions\Action;

Action::make('filter')
    ->iconButton()
    ->icon('heroicon-m-funnel')
    ->badge(5)
    ->badgeColor('success')
```

<AutoScreenshot name="actions/trigger-button/success-badged" alt="Trigger with green badge" version="3.x" />

## 아웃라인 버튼 스타일 {#outlined-button-style}

"버튼" 트리거 스타일을 사용할 때, 덜 두드러지게 만들고 싶을 수 있습니다. [색상](#setting-a-color)을 다르게 사용할 수도 있지만, 때로는 아웃라인 스타일로 만들고 싶을 때가 있습니다. `outlined()` 메서드를 사용하여 이렇게 할 수 있습니다:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->button()
    ->outlined()
```

<AutoScreenshot name="actions/trigger-button/outlined" alt="Outlined trigger button" version="3.x" />

## 추가 HTML 속성 부여하기 {#adding-extra-html-attributes}

버튼에 추가 HTML 속성을 전달할 수 있으며, 이는 외부 DOM 요소에 병합됩니다. `extraAttributes()` 메서드에 속성 이름을 키로, 속성 값을 값으로 하는 배열을 전달하세요:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->extraAttributes([
        'title' => 'Edit this post',
    ])
```

문자열로 CSS 클래스를 전달하면, 버튼의 다른 HTML 요소에 이미 적용된 기본 클래스와 병합됩니다:

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->extraAttributes([
        'class' => 'mx-auto my-8',
    ])
```
