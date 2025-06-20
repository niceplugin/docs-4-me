---
title: Repeater
---
# [폼.필드] Repeater

## 개요 {#overview}

리피터 컴포넌트는 반복되는 폼 컴포넌트의 JSON 배열을 출력할 수 있게 해줍니다.

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

Repeater::make('members')
    ->schema([
        TextInput::make('name')->required(),
        Select::make('role')
            ->options([
                'member' => 'Member',
                'administrator' => 'Administrator',
                'owner' => 'Owner',
            ])
            ->required(),
    ])
    ->columns(2)
```

<AutoScreenshot name="forms/fields/repeater/simple" alt="Repeater" version="3.x" />

리피터 데이터를 데이터베이스의 `JSON` 컬럼에 저장하는 것을 권장합니다. 또한 Eloquent를 사용하는 경우 해당 컬럼에 `array` 캐스트가 적용되어 있는지 확인하세요.

위 예시에서 볼 수 있듯이, 컴포넌트의 스키마는 `schema()` 메서드 내에서 정의할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

Repeater::make('members')
    ->schema([
        TextInput::make('name')->required(),
        // ...
    ])
```

여러 개의 스키마 블록을 임의의 순서로 반복할 수 있는 리피터를 정의하고 싶다면 [builder](builder)를 사용하세요.

## 빈 기본 항목 설정하기 {#setting-empty-default-items}

리피터는 `defaultItems()` 메서드를 사용하여 기본적으로 생성되는 빈 항목의 개수를 지정할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->defaultItems(3)
```

이 기본 항목들은 폼이 기존 데이터 없이 로드될 때만 생성된다는 점에 유의하세요. [패널 리소스](/filament/3.x/panels/resources/getting-started#resource-forms) 내에서는 생성 페이지에서만 동작하며, 수정 페이지에서는 항상 모델의 데이터로 채워집니다.

## 항목 추가하기 {#adding-items}

사용자가 새 항목을 추가할 수 있도록 리피터 아래에 액션 버튼이 표시됩니다.

## 추가 액션 버튼의 라벨 설정하기 {#setting-the-add-action-buttons-label}

`addActionLabel()` 메서드를 사용하여 리피터 항목을 추가하는 버튼에 표시될 텍스트를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->addActionLabel('Add member')
```

### 추가 액션 버튼 정렬하기 {#aligning-the-add-action-button}

기본적으로 추가 액션은 중앙에 정렬되어 있습니다. `addActionAlignment()` 메서드에 `Alignment::Start` 또는 `Alignment::End` 옵션을 전달하여 이를 조정할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;
use Filament\Support\Enums\Alignment;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->addActionAlignment(Alignment::Start)
```

### 사용자가 항목을 추가하지 못하게 막기 {#preventing-the-user-from-adding-items}

`addable(false)` 메서드를 사용하여 사용자가 리피터에 항목을 추가하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->addable(false)
```

## 항목 삭제하기 {#deleting-items}

각 항목마다 사용자가 해당 항목을 삭제할 수 있도록 액션 버튼이 표시됩니다.

### 사용자가 항목을 삭제하지 못하게 막기 {#preventing-the-user-from-deleting-items}

`deletable(false)` 메서드를 사용하여 사용자가 리피터에서 항목을 삭제하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->deletable(false)
```

## 항목 순서 변경하기 {#reordering-items}

각 항목마다 사용자가 드래그 앤 드롭으로 목록 내에서 순서를 변경할 수 있도록 버튼이 표시됩니다.

### 사용자가 항목 순서를 변경하지 못하게 막기 {#preventing-the-user-from-reordering-items}

`reorderable(false)` 메서드를 사용하여 사용자가 리피터에서 항목의 순서를 변경하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderable(false)
```

### 버튼으로 항목 순서 변경하기 {#reordering-items-with-buttons}

`reorderableWithButtons()` 메서드를 사용하여 항목을 위아래로 이동시키는 버튼으로 순서를 변경할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderableWithButtons()
```

<AutoScreenshot name="forms/fields/repeater/reorderable-with-buttons" alt="Repeater that is reorderable with buttons" version="3.x" />

### 드래그 앤 드롭으로 순서 변경 막기 {#preventing-reordering-with-drag-and-drop}

`reorderableWithDragAndDrop(false)` 메서드를 사용하여 드래그 앤 드롭으로 항목의 순서를 변경하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderableWithDragAndDrop(false)
```

## 항목 접기 {#collapsing-items}

리피터는 `collapsible()`을 사용하여 긴 폼에서 내용을 선택적으로 숨길 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->collapsible()
```

모든 항목을 기본적으로 접을 수도 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->collapsed()
```

<AutoScreenshot name="forms/fields/repeater/collapsed" alt="Collapsed repeater" version="3.x" />

## 항목 복제하기 {#cloning-items}

`cloneable()` 메서드를 사용하여 리피터 항목을 복제할 수 있도록 허용할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->cloneable()
```

<AutoScreenshot name="forms/fields/repeater/cloneable" alt="Cloneable repeater" version="3.x" />

## Eloquent 관계와 통합하기 {#integrating-with-an-eloquent-relationship}

> Livewire 컴포넌트 내에서 폼을 빌드하는 경우, 반드시 [폼의 모델](../adding-a-form-to-a-livewire-component#setting-a-form-model)을 설정해야 합니다. 그렇지 않으면 Filament는 어떤 모델에서 관계를 가져와야 하는지 알 수 없습니다.

`Repeater`의 `relationship()` 메서드를 사용하여 `HasMany` 관계를 설정할 수 있습니다. Filament는 관계에서 항목 데이터를 불러오고, 폼이 제출될 때 다시 관계에 저장합니다. `relationship()`에 커스텀 관계명을 전달하지 않으면, Filament는 필드명을 관계명으로 사용합니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
```

`relationship()`과 함께 `disabled()`를 사용할 때는, 반드시 `disabled()`를 `relationship()`보다 먼저 호출해야 합니다. 이렇게 하면 `relationship()` 내부의 `dehydrated()` 호출이 `disabled()`의 호출에 의해 덮어써지지 않습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->disabled()
    ->relationship()
    ->schema([
        // ...
    ])
```

### 관계에서 항목 순서 변경하기 {#reordering-items-in-a-relationship}

기본적으로 [순서 변경](#reordering-items) 기능은 관계 리피터 항목에서 비활성화되어 있습니다. 이는 관련 모델에 관련 레코드의 순서를 저장할 `sort` 컬럼이 필요하기 때문입니다. 순서 변경을 활성화하려면, 관련 모델에서 순서를 저장할 컬럼명을 `orderColumn()` 메서드에 전달하면 됩니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->orderColumn('sort')
```

[`spatie/eloquent-sortable`](https://github.com/spatie/eloquent-sortable)와 같이 `order_column`과 같은 정렬 컬럼을 사용하는 경우, 이를 `orderColumn()`에 전달할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->orderColumn('order_column')
```

### `BelongsToMany` Eloquent 관계와 통합하기 {#integrating-with-a-belongstomany-eloquent-relationship}

`BelongsToMany` 관계를 리피터와 함께 사용하는 것이 `HasMany` 관계와 같이 간단하다고 오해하는 경우가 많습니다. 하지만 실제로는 `BelongsToMany` 관계는 관계 데이터를 저장하기 위해 피벗 테이블이 필요합니다. 리피터는 관련 모델에 데이터를 저장하지, 피벗 테이블에 저장하지 않습니다. 따라서 각 리피터 항목을 피벗 테이블의 행에 매핑하려면, 피벗 모델과 함께 `HasMany` 관계를 사용해야 합니다.

예를 들어, 새로운 `Order` 모델을 생성하는 폼이 있다고 가정해봅시다. 각 주문은 여러 `Product` 모델에 속하고, 각 상품도 여러 주문에 속합니다. 관계 데이터를 저장하기 위해 `order_product` 피벗 테이블이 있습니다. 리피터에 `products` 관계를 사용하는 대신, `Order` 모델에 `orderProducts`라는 새로운 관계를 만들고 이를 리피터와 함께 사용해야 합니다:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function orderProducts(): HasMany
{
    return $this->hasMany(OrderProduct::class);
}
```

아직 `OrderProduct` 피벗 모델이 없다면, 이를 생성하고 `Order`와 `Product`에 대한 역관계를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderProduct extends Pivot
{
    public $incrementing = true;

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
```

> 피벗 모델에 `id`와 같은 기본 키 컬럼이 있어야 Filament가 어떤 리피터 항목이 생성, 수정, 삭제되었는지 추적할 수 있습니다. Filament가 기본 키를 추적할 수 있도록 피벗 모델의 `$incrementing` 속성을 `true`로 설정해야 합니다.

이제 `orderProducts` 관계를 리피터와 함께 사용할 수 있으며, 데이터는 `order_product` 피벗 테이블에 저장됩니다:

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

Repeater::make('orderProducts')
    ->relationship()
    ->schema([
        Select::make('product_id')
            ->relationship('product', 'name')
            ->required(),
        // ...
    ])
```

### 필드에 값을 채우기 전에 관련 항목 데이터 변형하기 {#mutating-related-item-data-before-filling-the-field}

`mutateRelationshipDataBeforeFillUsing()` 메서드를 사용하여 관련 항목의 데이터를 필드에 채우기 전에 변형할 수 있습니다. 이 메서드는 현재 항목의 데이터를 `$data` 변수로 받는 클로저를 인자로 받습니다. 수정된 데이터 배열을 반환해야 합니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->mutateRelationshipDataBeforeFillUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

### 생성 전에 관련 항목 데이터 변형하기 {#mutating-related-item-data-before-creating}

`mutateRelationshipDataBeforeCreateUsing()` 메서드를 사용하여 새 관련 항목이 데이터베이스에 생성되기 전에 데이터를 변형할 수 있습니다. 이 메서드는 현재 항목의 데이터를 `$data` 변수로 받는 클로저를 인자로 받습니다. 수정된 데이터 배열을 반환하거나, 항목 생성을 방지하려면 `null`을 반환할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->mutateRelationshipDataBeforeCreateUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

### 저장 전에 관련 항목 데이터 변형하기 {#mutating-related-item-data-before-saving}

`mutateRelationshipDataBeforeSaveUsing()` 메서드를 사용하여 기존 관련 항목이 데이터베이스에 저장되기 전에 데이터를 변형할 수 있습니다. 이 메서드는 현재 항목의 데이터를 `$data` 변수로 받는 클로저를 인자로 받습니다. 수정된 데이터 배열을 반환하거나, 항목 저장을 방지하려면 `null`을 반환할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->mutateRelationshipDataBeforeSaveUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

## 그리드 레이아웃 {#grid-layout}

`grid()` 메서드를 사용하여 리피터 항목을 여러 열로 정렬할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->grid(2)
```

<AutoScreenshot name="forms/fields/repeater/grid" alt="Repeater with a 2 column grid of items" version="3.x" />

이 메서드는 [grid](../layout/grid)의 `columns()` 메서드와 동일한 옵션을 받습니다. 이를 통해 다양한 브레이크포인트에서 그리드 열의 개수를 반응형으로 커스터마이즈할 수 있습니다.

## 리피터 항목의 내용에 따라 라벨 추가하기 {#adding-a-label-to-repeater-items-based-on-their-content}

`itemLabel()` 메서드를 사용하여 리피터 항목에 라벨을 추가할 수 있습니다. 이 메서드는 현재 항목의 데이터를 `$state` 변수로 받는 클로저를 인자로 받습니다. 항목 라벨로 사용할 문자열을 반환해야 합니다:

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;

Repeater::make('members')
    ->schema([
        TextInput::make('name')
            ->required()
            ->live(onBlur: true),
        Select::make('role')
            ->options([
                'member' => 'Member',
                'administrator' => 'Administrator',
                'owner' => 'Owner',
            ])
            ->required(),
    ])
    ->columns(2)
    ->itemLabel(fn (array $state): ?string => $state['name'] ?? null),
```

폼을 사용하는 동안 항목 라벨이 실시간으로 업데이트되길 원한다면, `$state`에서 사용하는 필드는 반드시 `live()`이어야 합니다.

<AutoScreenshot name="forms/fields/repeater/labelled" alt="Repeater with item labels" version="3.x" />

## 필드가 하나인 단순 리피터 {#simple-repeaters-with-one-field}

`simple()` 메서드를 사용하여 단일 필드로 구성된, 미니멀한 디자인의 리피터를 만들 수 있습니다

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

Repeater::make('invitations')
    ->simple(
        TextInput::make('email')
            ->email()
            ->required(),
    )
```

<AutoScreenshot name="forms/fields/repeater/simple-one-field" alt="Simple repeater design with only one field" version="3.x" />

데이터를 중첩 배열로 저장하는 대신, 단순 리피터는 값의 평면 배열을 사용합니다. 위 예시의 데이터 구조는 다음과 같을 수 있습니다:

```php
[
    'invitations' => [
        'dan@filamentphp.com',
        'ryan@filamentphp.com',
    ],
],
```

## `$get()`을 사용하여 상위 필드 값 접근하기 {#using-get-to-access-parent-field-values}

모든 폼 컴포넌트는 [다른 필드의 값을 `$get()` 및 `$set()`](../advanced)으로 접근할 수 있습니다. 하지만 리피터의 스키마 내부에서 이를 사용할 때 예상치 못한 동작이 발생할 수 있습니다.

이는 `$get()`과 `$set()`이 기본적으로 현재 리피터 항목에 스코프되기 때문입니다. 즉, 현재 폼 컴포넌트가 속한 리피터 항목이 무엇인지 몰라도 해당 리피터 항목 내의 다른 필드와 쉽게 상호작용할 수 있습니다.

이로 인해 리피터 외부의 필드와 상호작용할 수 없을 때 혼란스러울 수 있습니다. 이 문제를 해결하기 위해 `../` 문법을 사용합니다 - `$get('../../parent_field_name')`.

폼의 데이터 구조가 다음과 같다고 가정해봅시다:

```php
[
    'client_id' => 1,

    'repeater' => [
        'item1' => [
            'service_id' => 2,
        ],
    ],
]
```

리피터 항목 내부에서 `client_id` 값을 가져오려고 합니다.

`$get()`은 현재 리피터 항목을 기준으로 상대적이므로, `$get('client_id')`는 `$get('repeater.item1.client_id')`를 찾게 됩니다.

`../`를 사용하면 데이터 구조에서 한 단계 위로 올라갈 수 있으므로, `$get('../client_id')`는 `$get('repeater.client_id')`이고, `$get('../../client_id')`는 `$get('client_id')`가 됩니다.

특수한 경우로, 인자가 없는 `$get()`, 또는 `$get('')`, `$get('./')`는 항상 현재 리피터 항목의 전체 데이터 배열을 반환합니다.

## 리피터 검증 {#repeater-validation}

[validation](../validation) 페이지에 나열된 모든 규칙 외에도, 리피터에만 적용되는 추가 규칙이 있습니다.

### 항목 개수 검증 {#number-of-items-validation}

`minItems()` 및 `maxItems()` 메서드를 설정하여 리피터에 가질 수 있는 최소 및 최대 항목 개수를 검증할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->minItems(2)
    ->maxItems(5)
```

### 고유 상태 검증 {#distinct-state-validation}

많은 경우, 리피터 항목 간에 어떤 형태의 고유성을 보장하고 싶을 수 있습니다. 몇 가지 일반적인 예시는 다음과 같습니다:

- 리피터 내 항목 전체에서 오직 하나의 [checkbox](checkbox) 또는 [toggle](toggle)만 활성화되도록 보장하기.
- 리피터 내 [select](select), [radio](radio), [checkbox list](checkbox-list), [toggle buttons](toggle-buttons) 필드에서 각 옵션이 한 번만 선택되도록 보장하기.

`distinct()` 메서드를 사용하여 필드의 상태가 리피터의 모든 항목에서 고유한지 검증할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Repeater;

Repeater::make('answers')
    ->schema([
        // ...
        Checkbox::make('is_correct')
            ->distinct(),
    ])
```

`distinct()` 검증의 동작은 필드가 다루는 데이터 타입에 따라 달라집니다

- 필드가 [checkbox](checkbox)나 [toggle](toggle)처럼 불리언을 반환하는 경우, 검증은 오직 하나의 항목만 값이 `true`가 되도록 보장합니다. 여러 필드가 `false` 값을 가질 수 있습니다.
- 그 외에 [select](select), [radio](radio), [checkbox list](checkbox-list), [toggle buttons](toggle-buttons)와 같은 필드의 경우, 검증은 각 옵션이 리피터의 모든 항목에서 한 번만 선택되도록 보장합니다.

#### 고유하지 않은 상태 자동 수정하기 {#automatically-fixing-indistinct-state}

고유하지 않은 상태를 자동으로 수정하고 싶다면, `fixIndistinctState()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Repeater;

Repeater::make('answers')
    ->schema([
        // ...
        Checkbox::make('is_correct')
            ->fixIndistinctState(),
    ])
```

이 메서드는 필드에 `distinct()`와 `live()` 메서드를 자동으로 활성화합니다.

필드가 다루는 데이터 타입에 따라 `fixIndistinctState()`의 동작이 달라집니다:

- 필드가 [checkbox](checkbox)나 [toggle](toggle)처럼 불리언을 반환하고, 필드 중 하나가 활성화된 경우, Filament는 사용자를 대신하여 다른 모든 활성화된 필드를 자동으로 비활성화합니다.
- 그 외에 [select](select), [radio](radio), [checkbox list](checkbox-list), [toggle buttons](toggle-buttons)와 같은 필드의 경우, 사용자가 옵션을 선택하면 Filament는 사용자를 대신하여 해당 옵션의 다른 모든 사용을 자동으로 선택 해제합니다.

#### 다른 항목에서 이미 선택된 옵션 비활성화하기 {#disabling-options-when-they-are-already-selected-in-another-item}

[select](select), [radio](radio), [checkbox list](checkbox-list), [toggle buttons](toggle-buttons)에서 다른 항목에서 이미 선택된 옵션을 비활성화하고 싶다면, `disableOptionsWhenSelectedInSiblingRepeaterItems()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

Repeater::make('members')
    ->schema([
        Select::make('role')
            ->options([
                // ...
            ])
            ->disableOptionsWhenSelectedInSiblingRepeaterItems(),
    ])
```

이 메서드는 필드에 `distinct()`와 `live()` 메서드를 자동으로 활성화합니다.

[disable options](./select#disabling-specific-options)에 다른 조건을 추가하고 싶다면, `merge: true` 인자를 사용하여 `disableOptionWhen()`을 체이닝할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

Repeater::make('members')
    ->schema([
        Select::make('role')
            ->options([
                // ...
            ])
            ->disableOptionsWhenSelectedInSiblingRepeaterItems()
            ->disableOptionWhen(fn (string $value): bool => $value === 'super_admin', merge: true),
    ])
```

## 리피터 항목 액션 커스터마이즈하기 {#customizing-the-repeater-item-actions}

이 필드는 내부 버튼을 쉽게 커스터마이즈할 수 있도록 액션 객체를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이즈할 수 있습니다. 함수는 `$action` 객체에 접근할 수 있으며, 이를 사용해 [커스터마이즈](../../actions/trigger-button)할 수 있습니다. 다음 메서드들을 사용해 액션을 커스터마이즈할 수 있습니다:

- `addAction()`
- `cloneAction()`
- `collapseAction()`
- `collapseAllAction()`
- `deleteAction()`
- `expandAction()`
- `expandAllAction()`
- `moveDownAction()`
- `moveUpAction()`
- `reorderAction()`

다음은 액션을 커스터마이즈하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->collapseAllAction(
        fn (Action $action) => $action->label('Collapse all members'),
    )
```

### 모달로 리피터 액션 확인하기 {#confirming-repeater-actions-with-a-modal}

액션 객체의 `requiresConfirmation()` 메서드를 사용하여 액션을 모달로 확인할 수 있습니다. [모든 모달 커스터마이즈 메서드](../../actions/modals)를 사용해 내용과 동작을 변경할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->deleteAction(
        fn (Action $action) => $action->requiresConfirmation(),
    )
```

> `collapseAction()`, `collapseAllAction()`, `expandAction()`, `expandAllAction()`, `reorderAction()` 메서드는 버튼 클릭 시 모달을 표시하는 데 필요한 네트워크 요청을 하지 않으므로 확인 모달을 지원하지 않습니다.

### 리피터에 추가 항목 액션 버튼 추가하기 {#adding-extra-item-actions-to-a-repeater}

`extraItemActions()`에 `Action` 객체를 전달하여 각 리피터 항목의 헤더에 새로운 [액션 버튼](../actions)을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Mail;

Repeater::make('members')
    ->schema([
        TextInput::make('email')
            ->label('Email address')
            ->email(),
        // ...
    ])
    ->extraItemActions([
        Action::make('sendEmail')
            ->icon('heroicon-m-envelope')
            ->action(function (array $arguments, Repeater $component): void {
                $itemData = $component->getItemState($arguments['item']);

                Mail::to($itemData['email'])
                    ->send(
                        // ...
                    );
            }),
    ])
```

이 예시에서 `$arguments['item']`은 현재 리피터 항목의 ID를 제공합니다. 해당 리피터 항목의 데이터를 `getItemState()` 메서드로 검증할 수 있습니다. 이 메서드는 항목의 검증된 데이터를 반환합니다. 항목이 유효하지 않으면 액션이 취소되고 해당 항목에 대한 오류 메시지가 폼에 표시됩니다.

현재 항목의 원시 데이터를 검증 없이 가져오고 싶다면, `$component->getRawItemState($arguments['item'])`를 사용할 수 있습니다.

리피터 전체의 원시 데이터를 조작하고 싶다면(예: 항목 추가, 삭제, 수정 등), `$component->getState()`로 데이터를 가져오고, `$component->state($state)`로 다시 설정할 수 있습니다:

```php
use Illuminate\Support\Str;

// 리피터 전체의 원시 데이터 가져오기
$state = $component->getState();

// 무작위 UUID를 키로 하여 항목 추가
$state[Str::uuid()] = [
    'email' => auth()->user()->email,
];

// 리피터에 새 데이터 설정
$component->state($state);
```

## 리피터 테스트하기 {#testing-repeaters}

내부적으로, 리피터는 Livewire HTML에서 항목을 추적하기 위해 항목마다 UUID를 생성합니다. 따라서 리피터가 있는 폼을 테스트할 때, 폼과 테스트 간에 UUID가 일치하는지 확인해야 합니다. 이 작업이 까다로울 수 있으며, 제대로 하지 않으면 테스트가 UUID가 아닌 숫자 키를 기대하기 때문에 실패할 수 있습니다.

하지만 Livewire는 테스트에서 UUID를 추적할 필요가 없으므로, 테스트 시작 시 `Repeater::fake()` 메서드를 사용하여 UUID 생성을 비활성화하고 숫자 키로 대체할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;
use function Pest\Livewire\livewire;

$undoRepeaterFake = Repeater::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertFormSet([
        'quotes' => [
            [
                'content' => 'First quote',
            ],
            [
                'content' => 'Second quote',
            ],
        ],
        // ...
    ]);

$undoRepeaterFake();
```

`assertFormSet()` 메서드에 함수를 전달하여 리피터의 항목 개수를 테스트하는 것도 유용할 수 있습니다:

```php
use Filament\Forms\Components\Repeater;
use function Pest\Livewire\livewire;

$undoRepeaterFake = Repeater::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertFormSet(function (array $state) {
        expect($state['quotes'])
            ->toHaveCount(2);
    });

$undoRepeaterFake();
```

### 리피터 액션 테스트하기 {#testing-repeater-actions}

리피터 액션이 예상대로 동작하는지 테스트하려면, `callFormComponentAction()` 메서드를 사용하여 리피터 액션을 호출한 뒤 [추가적인 검증](../testing#actions)을 수행할 수 있습니다.

특정 리피터 항목의 액션과 상호작용하려면, 해당 리피터 항목의 키와 함께 `item` 인자를 전달해야 합니다. 리피터가 관계에서 읽어오는 경우, 관련 레코드의 ID(키) 앞에 `record-`를 붙여 리피터 항목의 키를 만듭니다:  

```php
use App\Models\Quote;
use Filament\Forms\Components\Repeater;
use function Pest\Livewire\livewire;

$quote = Quote::first();

livewire(EditPost::class, ['record' => $post])
    ->callFormComponentAction('quotes', 'sendQuote', arguments: [
        'item' => "record-{$quote->getKey()}",
    ])
    ->assertNotified('Quote sent!');
```
