---
title: 체크박스
---
# [폼.필드] Checkbox

## 개요 {#overview}

체크박스 컴포넌트는 [토글](toggle)과 유사하게 불리언 값을 조작할 수 있게 해줍니다.

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')
```

<AutoScreenshot name="forms/fields/checkbox/simple" alt="Checkbox" version="3.x" />

불리언 값을 Eloquent를 사용해 저장하는 경우, 모델 속성에 `boolean` [캐스트](/laravel/12.x/eloquent-mutators#attribute-casting)를 추가해야 합니다:

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

## 라벨을 위에 배치하기 {#positioning-the-label-above}

체크박스 필드는 인라인과 스택 두 가지 레이아웃 모드를 가집니다. 기본적으로 인라인입니다.

체크박스가 인라인일 때, 라벨은 체크박스 옆에 위치합니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')->inline()
```

<AutoScreenshot name="forms/fields/checkbox/inline" alt="Checkbox with its label inline" version="3.x" />

체크박스가 스택일 때, 라벨은 체크박스 위에 위치합니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')->inline(false)
```

<AutoScreenshot name="forms/fields/checkbox/not-inline" alt="Checkbox with its label above" version="3.x" />

## 체크박스 검증 {#checkbox-validation}

[검증](../validation) 페이지에 나열된 모든 규칙 외에도, 체크박스에만 적용되는 추가 규칙이 있습니다.

### 허용(accepted) 검증 {#accepted-validation}

`accepted()` 메서드를 사용하여 체크박스가 체크되었는지 확인할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('terms_of_service')
    ->accepted()
```

### 거부(declined) 검증 {#declined-validation}

`declined()` 메서드를 사용하여 체크박스가 체크되지 않았는지 확인할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_under_18')
    ->declined()
```
