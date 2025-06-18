---
title: Toggle
---
# [폼.필드] Toggle

## 개요 {#overview}

토글 컴포넌트는 [체크박스](checkbox)와 유사하게 불리언 값을 조작할 수 있게 해줍니다.

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
```

<AutoScreenshot name="forms/fields/toggle/simple" alt="Toggle" version="3.x" />

불리언 값을 Eloquent를 사용해 저장하는 경우, 모델 속성에 `boolean` [캐스트](https://laravel.com/docs/eloquent-mutators#attribute-casting)를 반드시 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $casts = [
        'is_admin' => 'boolean',
    ];

    // ...
}
```

## 토글 버튼에 아이콘 추가하기 {#adding-icons-to-the-toggle-button}

토글은 버튼의 "켜짐"과 "꺼짐" 상태를 나타내기 위해 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 사용할 수도 있습니다. "켜짐" 상태에 아이콘을 추가하려면 `onIcon()` 메서드를 사용하세요. "꺼짐" 상태에 아이콘을 추가하려면 `offIcon()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->onIcon('heroicon-m-bolt')
    ->offIcon('heroicon-m-user')
```

<AutoScreenshot name="forms/fields/toggle/icons" alt="Toggle icons" version="3.x" />

## 토글 버튼의 색상 사용자 지정 {#customizing-the-color-of-the-toggle-button}

토글의 "켜짐" 또는 "꺼짐" 상태를 나타내는 색상도 사용자 지정할 수 있습니다. 사용할 수 있는 색상은 `danger`, `gray`, `info`, `primary`, `success`, `warning`입니다. "켜짐" 상태에 색상을 추가하려면 `onColor()` 메서드를 사용하세요. "꺼짐" 상태에 색상을 추가하려면 `offColor()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->onColor('success')
    ->offColor('danger')
```

<AutoScreenshot name="forms/fields/toggle/off-color" alt="Toggle off color" version="3.x" />

<AutoScreenshot name="forms/fields/toggle/on-color" alt="Toggle on color" version="3.x" />

## 레이블을 위에 위치시키기 {#positioning-the-label-above}

토글 필드는 인라인과 스택 두 가지 레이아웃 모드를 가집니다. 기본값은 인라인입니다.

토글이 인라인일 때, 레이블은 토글 옆에 위치합니다:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->inline()
```

<AutoScreenshot name="forms/fields/toggle/inline" alt="토글과 레이블이 인라인으로 배치됨" version="3.x" />

토글이 스택일 때, 레이블은 토글 위에 위치합니다:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->inline(false)
```

<AutoScreenshot name="forms/fields/toggle/not-inline" alt="토글과 레이블이 위아래로 배치됨" version="3.x" />

## 토글 유효성 검사 {#toggle-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙뿐만 아니라, 토글에만 적용되는 추가 규칙도 있습니다.

### 허용된 검증 {#accepted-validation}

토글이 "켜짐" 상태인지 `accepted()` 메서드를 사용하여 확인할 수 있습니다:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('terms_of_service')
    ->accepted()
```

### 거부됨 유효성 검사 {#declined-validation}

토글이 "꺼짐" 상태인지 `declined()` 메서드를 사용하여 확인할 수 있습니다:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_under_18')
    ->declined()
```
