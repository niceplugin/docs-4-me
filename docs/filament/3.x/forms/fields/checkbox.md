---
title: Checkbox
---
# [폼.필드] Checkbox

## 개요 {#overview}

체크박스 컴포넌트는 [토글](toggle)과 유사하게 불리언 값을 조작할 수 있게 해줍니다.

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')
```

<AutoScreenshot name="forms/fields/checkbox/simple" alt="Checkbox" version="3.x" />

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

## 레이블을 위에 배치하기 {#positioning-the-label-above}

체크박스 필드는 인라인과 스택 두 가지 레이아웃 모드를 제공합니다. 기본값은 인라인입니다.

체크박스가 인라인일 때, 레이블은 체크박스 옆에 위치합니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')->inline()
```

<AutoScreenshot name="forms/fields/checkbox/inline" alt="레이블이 인라인으로 배치된 체크박스" version="3.x" />

체크박스가 스택일 때, 레이블은 체크박스 위에 위치합니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')->inline(false)
```

<AutoScreenshot name="forms/fields/checkbox/not-inline" alt="레이블이 위에 배치된 체크박스" version="3.x" />

## 체크박스 검증 {#checkbox-validation}

[검증](../validation) 페이지에 나열된 모든 규칙뿐만 아니라, 체크박스에만 적용되는 추가 규칙도 있습니다.

### 허용됨 검증 {#accepted-validation}

체크박스가 선택되었는지 확인하려면 `accepted()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('terms_of_service')
    ->accepted()
```

### 거부됨 검증 {#declined-validation}

체크박스가 선택되지 않았는지 확인하려면 `declined()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_under_18')
    ->declined()
```
