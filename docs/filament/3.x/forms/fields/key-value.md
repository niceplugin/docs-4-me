---
title: Key-value
---
# [폼.필드] KeyValue

## 개요 {#overview}

Key-value 필드는 1차원 JSON 객체와 상호작용할 수 있도록 해줍니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
```

<AutoScreenshot name="forms/fields/key-value/simple" alt="Key-value" version="3.x" />

Eloquent에 데이터를 저장하는 경우, 모델 속성에 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $casts = [
        'meta' => 'array',
    ];

    // ...
}
```

## 행 추가하기 {#adding-rows}

필드 아래에 액션 버튼이 표시되어 사용자가 새 행을 추가할 수 있습니다.

## 추가 액션 버튼의 라벨 설정하기 {#setting-the-add-action-buttons-label}

`addActionLabel()` 메서드를 사용하여 행을 추가하는 버튼에 표시될 텍스트를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->addActionLabel('속성 추가')
```

### 사용자가 행을 추가하지 못하도록 방지하기 {#preventing-the-user-from-adding-rows}

`addable(false)` 메서드를 사용하여 사용자가 행을 추가하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->addable(false)
```

## 행 삭제하기 {#deleting-rows}

각 항목에 액션 버튼이 표시되어 사용자가 해당 항목을 삭제할 수 있습니다.

### 사용자가 행을 삭제하지 못하도록 방지하기 {#preventing-the-user-from-deleting-rows}

`deletable(false)` 메서드를 사용하여 사용자가 행을 삭제하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->deletable(false)
```

## 키 편집하기 {#editing-keys}

### 키 필드의 라벨 커스터마이즈하기 {#customizing-the-key-fields-label}

`keyLabel()` 메서드를 사용하여 키 필드의 라벨을 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->keyLabel('속성 이름')
```

### 키 필드에 플레이스홀더 추가하기 {#adding-key-field-placeholders}

`keyPlaceholder()` 메서드를 사용하여 키 필드에 플레이스홀더를 추가할 수도 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->keyPlaceholder('속성 이름')
```

### 사용자가 키를 편집하지 못하도록 방지하기 {#preventing-the-user-from-editing-keys}

`editableKeys(false)` 메서드를 사용하여 사용자가 키를 편집하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->editableKeys(false)
```

## 값 편집하기 {#editing-values}

### 값 필드의 라벨 커스터마이즈하기 {#customizing-the-value-fields-label}

`valueLabel()` 메서드를 사용하여 값 필드의 라벨을 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->valueLabel('속성 값')
```

### 값 필드에 플레이스홀더 추가하기 {#adding-value-field-placeholders}

`valuePlaceholder()` 메서드를 사용하여 값 필드에 플레이스홀더를 추가할 수도 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->valuePlaceholder('속성 값')
```

### 사용자가 값을 편집하지 못하도록 방지하기 {#preventing-the-user-from-editing-values}

`editableValues(false)` 메서드를 사용하여 사용자가 값을 편집하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->editableValues(false)
```

## 행 순서 변경하기 {#reordering-rows}

`reorderable()` 메서드를 사용하여 사용자가 테이블 내에서 행의 순서를 변경할 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->reorderable()
```

<AutoScreenshot name="forms/fields/key-value/reorderable" alt="Key-value with reorderable rows" version="3.x" />

## Key-value 액션 오브젝트 커스터마이즈하기 {#customizing-the-key-value-action-objects}

이 필드는 내부 버튼을 쉽게 커스터마이즈할 수 있도록 액션 오브젝트를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이즈할 수 있습니다. 함수는 `$action` 오브젝트에 접근할 수 있으며, 이를 사용해 [커스터마이즈](../../actions/trigger-button)할 수 있습니다. 다음 메서드들을 사용해 액션을 커스터마이즈할 수 있습니다:

- `addAction()`
- `deleteAction()`
- `reorderAction()`

다음은 액션을 커스터마이즈하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\KeyValue;

KeyValue::make('meta')
    ->deleteAction(
        fn (Action $action) => $action->icon('heroicon-m-x-mark'),
    )
```
