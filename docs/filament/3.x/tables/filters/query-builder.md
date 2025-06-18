---
title: QueryBuilder
---
# [테이블.필터] QueryBuilder
## 개요 {#overview}

QueryBuilder는 테이블의 데이터를 필터링하기 위해 복잡한 조건 집합을 정의할 수 있도록 해줍니다. "and" 및 "or" 연산으로 그룹화할 수 있는 무제한 중첩 조건을 처리할 수 있습니다.

이를 사용하려면 데이터를 필터링하는 데 사용할 "제약 조건" 집합을 정의해야 합니다. Filament에는 일반적인 데이터 유형을 따르는 몇 가지 내장 제약 조건이 포함되어 있지만, 직접 커스텀 제약 조건을 정의할 수도 있습니다.

`QueryBuilder` 필터를 사용하여 모든 테이블에 QueryBuilder를 추가할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\DateConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

QueryBuilder::make()
    ->constraints([
        TextConstraint::make('name'),
        BooleanConstraint::make('is_visible'),
        NumberConstraint::make('stock'),
        SelectConstraint::make('status')
            ->options([
                'draft' => 'Draft',
                'reviewing' => 'Reviewing',
                'published' => 'Published',
            ])
            ->multiple(),
        DateConstraint::make('created_at'),
        RelationshipConstraint::make('categories')
            ->multiple()
            ->selectable(
                IsRelatedToOperator::make()
                    ->titleAttribute('name')
                    ->searchable()
                    ->multiple(),
            ),
        NumberConstraint::make('reviewsRating')
            ->relationship('reviews', 'rating')
            ->integer(),
    ])
```

QueryBuilder를 깊게 중첩해서 사용할 때는 필터가 차지할 수 있는 공간을 늘려야 할 수도 있습니다. 이를 위한 한 가지 방법은 [필터를 테이블 콘텐츠 위에 배치](layout#displaying-filters-above-the-table-content)하는 것입니다:

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            QueryBuilder::make()
                ->constraints([
                    // ...
                ]),
        ], layout: FiltersLayout::AboveContent);
}
```

## 사용 가능한 제약 조건 {#available-constraints}

Filament에는 바로 사용할 수 있는 다양한 제약 조건이 기본으로 제공됩니다. 또한 [사용자 정의 제약 조건을 직접 생성](#creating-custom-constraints)할 수도 있습니다:

- [텍스트 제약 조건](#text-constraints)
- [불리언 제약 조건](#boolean-constraints)
- [숫자 제약 조건](#number-constraints)
- [날짜 제약 조건](#date-constraints)
- [셀렉트 제약 조건](#select-constraints)
- [관계 제약 조건](#relationship-constraints)

### 텍스트 제약 조건 {#text-constraints}

텍스트 제약 조건을 사용하면 텍스트 필드를 필터링할 수 있습니다. 관계를 통해서도 포함하여 모든 텍스트 필드를 필터링하는 데 사용할 수 있습니다.

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('name') // `name` 컬럼을 필터링

TextConstraint::make('creatorName')
    ->relationship(name: 'creator', titleAttribute: 'name') // `creator` 관계의 `name` 컬럼을 필터링
```

기본적으로 다음 연산자가 제공됩니다:

- 포함 - 컬럼이 검색어를 포함하도록 필터링
- 포함하지 않음 - 컬럼이 검색어를 포함하지 않도록 필터링
- 시작함 - 컬럼이 검색어로 시작하도록 필터링
- 시작하지 않음 - 컬럼이 검색어로 시작하지 않도록 필터링
- 끝남 - 컬럼이 검색어로 끝나도록 필터링
- 끝나지 않음 - 컬럼이 검색어로 끝나지 않도록 필터링
- 일치함 - 컬럼이 검색어와 일치하도록 필터링
- 일치하지 않음 - 컬럼이 검색어와 일치하지 않도록 필터링
- 값이 있음 - 컬럼이 비어 있지 않도록 필터링
- 값이 없음 - 컬럼이 비어 있도록 필터링

### 불리언 제약 조건 {#boolean-constraints}

불리언 제약 조건을 사용하면 불리언 필드를 필터링할 수 있습니다. 관계를 통해서도 포함하여, 모든 불리언 필드를 필터링하는 데 사용할 수 있습니다.

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\BooleanConstraint;

BooleanConstraint::make('is_visible') // `is_visible` 컬럼을 필터링

BooleanConstraint::make('creatorIsAdmin')
    ->relationship(name: 'creator', titleAttribute: 'is_admin') // `creator` 관계의 `is_admin` 컬럼을 필터링
```

기본적으로 다음 연산자를 사용할 수 있습니다:

- 참임 - 컬럼이 `true`인 경우로 필터링
- 거짓임 - 컬럼이 `false`인 경우로 필터링

### 숫자 제약 조건 {#number-constraints}

숫자 제약 조건을 사용하면 숫자 필드를 필터링할 수 있습니다. 이 제약 조건은 관계를 통해서도 포함하여 모든 숫자 필드에 사용할 수 있습니다.

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;

NumberConstraint::make('stock') // `stock` 컬럼을 필터링

NumberConstraint::make('ordersItemCount')
    ->relationship(name: 'orders', titleAttribute: 'item_count') // `orders` 관계의 `item_count` 컬럼을 필터링
```

기본적으로 다음 연산자를 사용할 수 있습니다:

- 최소값 이상 - 컬럼이 검색 숫자보다 크거나 같은 값을 필터링
- 미만 - 컬럼이 검색 숫자보다 작은 값을 필터링
- 최대값 이하 - 컬럼이 검색 숫자보다 작거나 같은 값을 필터링
- 초과 - 컬럼이 검색 숫자보다 큰 값을 필터링
- 일치 - 컬럼이 검색 숫자와 같은 값을 필터링
- 불일치 - 컬럼이 검색 숫자와 같지 않은 값을 필터링
- 값이 있음 - 컬럼이 비어 있지 않은 값을 필터링
- 값이 없음 - 컬럼이 비어 있는 값을 필터링

숫자 제약 조건에서 `relationship()`을 사용할 때, 사용자는 관련 레코드를 "집계"할 수도 있습니다. 즉, 관련된 모든 레코드의 합계, 평균, 최소값 또는 최대값을 한 번에 필터링할 수 있습니다.

#### 정수 제약 조건 {#integer-constraints}

기본적으로 숫자 제약 조건은 소수 값을 허용합니다. 정수 값만 허용하고 싶다면 `integer()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\NumberConstraint;

NumberConstraint::make('stock')
    ->integer()
```

### 날짜 제약 조건 {#date-constraints}

날짜 제약 조건을 사용하면 날짜 필드를 필터링할 수 있습니다. 이 제약 조건은 관계를 통한 필드를 포함하여 모든 날짜 필드에 사용할 수 있습니다.

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\DateConstraint;

DateConstraint::make('created_at') // `created_at` 컬럼을 필터링

DateConstraint::make('creatorCreatedAt')
    ->relationship(name: 'creator', titleAttribute: 'created_at') // `creator` 관계의 `created_at` 컬럼을 필터링
```

기본적으로 다음 연산자들이 제공됩니다:

- 이후임 - 컬럼이 검색 날짜 이후인 경우로 필터링
- 이후가 아님 - 컬럼이 검색 날짜 이후가 아니거나 같은 날짜인 경우로 필터링
- 이전임 - 컬럼이 검색 날짜 이전인 경우로 필터링
- 이전이 아님 - 컬럼이 검색 날짜 이전이 아니거나 같은 날짜인 경우로 필터링
- 날짜임 - 컬럼이 검색 날짜와 같은 날짜인 경우로 필터링
- 날짜가 아님 - 컬럼이 검색 날짜와 같은 날짜가 아닌 경우로 필터링
- 월임 - 컬럼이 선택한 월과 같은 월인 경우로 필터링
- 월이 아님 - 컬럼이 선택한 월과 같은 월이 아닌 경우로 필터링
- 연도임 - 컬럼이 검색한 연도와 같은 연도인 경우로 필터링
- 연도가 아님 - 컬럼이 검색한 연도와 같은 연도가 아닌 경우로 필터링

### 선택 제약 조건 {#select-constraints}

선택 제약 조건을 사용하면 선택 필드를 통해 필드를 필터링할 수 있습니다. 관계를 포함한 모든 필드를 필터링하는 데 사용할 수 있습니다.

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;

SelectConstraint::make('status') // `status` 컬럼을 필터링
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    
SelectConstraint::make('creatorStatus')
    ->relationship(name: 'creator', titleAttribute: 'department') // `creator` 관계의 `department` 컬럼을 필터링
    ->options([
        'sales' => 'Sales',
        'marketing' => 'Marketing',
        'engineering' => 'Engineering',
        'purchasing' => 'Purchasing',
    ])
```

#### 검색 가능한 선택 제약 조건 {#searchable-select-constraints}

기본적으로, 선택 제약 조건은 사용자가 옵션을 검색할 수 없도록 합니다. 사용자가 옵션을 검색할 수 있도록 허용하려면 `searchable()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;

SelectConstraint::make('status')
    ->searchable()
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

#### 다중 선택 제약 조건 {#multi-select-constraints}

기본적으로, 선택 제약 조건은 사용자가 하나의 옵션만 선택할 수 있도록 허용합니다. 사용자가 여러 옵션을 선택할 수 있도록 하려면 `multiple()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\SelectConstraint;

SelectConstraint::make('status')
    ->multiple()
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

사용자가 여러 옵션을 선택하면, 테이블은 선택된 옵션 중 하나와 일치하는 레코드만 표시하도록 필터링됩니다.

### 관계 제약 조건 {#relationship-constraints}

관계 제약 조건을 사용하면 관계에 대한 데이터를 이용해 필드를 필터링할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;

RelationshipConstraint::make('creator') // `creator` 관계를 필터링합니다
    ->selectable(
        IsRelatedToOperator::make()
            ->titleAttribute('name')
            ->searchable()
            ->multiple(),
    )
```

`IsRelatedToOperator`는 "Is / Contains"와 "Is not / Does not contain" 연산자를 구성하는 데 사용됩니다. 이 연산자는 사용자가 어떤 레코드가 연결되어 있는지에 따라 관계를 필터링할 수 있도록 선택 필드를 제공합니다. `titleAttribute()` 메서드는 목록에서 각 관련 레코드를 식별하는 데 사용할 속성을 지정합니다. `searchable()` 메서드는 목록을 검색 가능하게 만듭니다. `multiple()` 메서드는 사용자가 여러 관련 레코드를 선택할 수 있도록 하며, 여러 개를 선택하면 테이블은 선택된 관련 레코드 중 하나와 일치하는 레코드만 표시하도록 필터링됩니다.

#### 다중 관계 {#multiple-relationships}

기본적으로, 관계 제약 조건은 `BelongsTo`와 같이 단일 관계를 필터링하는 데 적합한 연산자만 포함합니다. 만약 `HasMany`나 `BelongsToMany`와 같은 관계가 있다면, 제약 조건에 `multiple()`을 표시할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;

RelationshipConstraint::make('categories')
    ->multiple()
```

이렇게 하면 다음과 같은 연산자가 제약 조건에 추가됩니다:

- 최소 보유 - 지정한 개수 이상의 관련 레코드를 가진 컬럼을 필터링합니다
- 미만 보유 - 지정한 개수 미만의 관련 레코드를 가진 컬럼을 필터링합니다
- 최대 보유 - 지정한 개수 이하의 관련 레코드를 가진 컬럼을 필터링합니다
- 초과 보유 - 지정한 개수 초과의 관련 레코드를 가진 컬럼을 필터링합니다
- 보유 - 지정한 개수의 관련 레코드를 가진 컬럼을 필터링합니다
- 미보유 - 지정한 개수의 관련 레코드를 가지지 않은 컬럼을 필터링합니다

#### 빈 관계 제약 조건 {#empty-relationship-constraints}

`RelationshipConstraint`는 다른 제약 조건에서 사용하는 [`nullable()`](#nullable-constraints)와 동일한 방식으로 동작하지 않습니다.

관계가 `multiple()`인 경우, 제약 조건은 "비어 있는" 관계를 필터링할 수 있는 옵션을 표시합니다. 이는 해당 관계에 연관된 레코드가 없음을 의미합니다. 관계가 단수인 경우, `emptyable()` 메서드를 사용하여 "비어 있는" 관계를 필터링할 수 있는 옵션을 표시할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;

RelationshipConstraint::make('creator')
    ->emptyable()
```

`multiple()` 관계이지만 항상 최소 1개의 연관 레코드가 있어야 하는 경우, `emptyable(false)` 메서드를 사용하여 "비어 있는" 관계를 필터링하는 옵션을 숨길 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\RelationshipConstraint;

RelationshipConstraint::make('categories')
    ->emptyable(false)
```

#### Nullable 제약 조건 {#nullable-constraints}

기본적으로 제약 조건에는 `null` 값을 필터링하는 옵션이 표시되지 않습니다. `null` 값을 필터링하는 옵션을 표시하려면 `nullable()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('name')
    ->nullable()
```

이제 다음 연산자도 사용할 수 있습니다:

- 채워짐 - 컬럼이 비어 있지 않은 경우로 필터링
- 비어 있음 - 컬럼이 비어 있는 경우로 필터링

## 관계 범위 지정 {#scoping-relationships}

제약 조건에서 `relationship()` 메서드를 사용할 때, `modifyQueryUsing` 인수를 사용하여 관계를 범위 지정하고 관련 레코드를 필터링할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;
use Illuminate\Database\Eloquent\Builder;

TextConstraint::make('adminCreatorName')
    ->relationship(
        name: 'creator',
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->where('is_admin', true),
    )
```

## 제약 조건 아이콘 사용자 지정 {#customizing-the-constraint-icon}

각 제약 조건 유형에는 기본 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)이 있으며, 이 아이콘은 선택기에서 라벨 옆에 표시됩니다. `icon()` 메서드에 아이콘 이름을 전달하여 제약 조건의 아이콘을 사용자 지정할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->icon('heroicon-m-user')
```

## 기본 연산자 재정의하기 {#overriding-the-default-operators}

각 제약 조건 타입에는 기본 연산자 집합이 있으며, `operators()` 메서드를 사용해 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Operators\IsFilledOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->operators([
        IsFilledOperator::make(),
    ])
```

이렇게 하면 모든 연산자가 제거되고, `EqualsOperator`가 등록됩니다.

연산자를 목록의 끝에 추가하고 싶다면, 대신 `pushOperators()`를 사용하세요:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Operators\IsFilledOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->pushOperators([
        IsFilledOperator::class,
    ])
```

연산자를 목록의 맨 앞에 추가하고 싶다면, 대신 `unshiftOperators()`를 사용하세요:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Operators\IsFilledOperator;
use Filament\Tables\Filters\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->unshiftOperators([
        IsFilledOperator::class,
    ])
```

## 사용자 지정 제약 조건 생성 {#creating-custom-constraints}

사용자 지정 제약 조건은 `Constraint::make()` 메서드를 사용하여 다른 제약 조건과 "인라인"으로 생성할 수 있습니다. 또한 [아이콘 커스터마이징](#customizing-the-constraint-icon)을 위해 `icon()` 메서드에 아이콘을 전달해야 합니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Constraint;

Constraint::make('subscribed')
    ->icon('heroicon-m-bell')
    ->operators([
        // ...
    ]),
```

제약 조건의 라벨을 커스터마이즈하고 싶다면 `label()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Constraint;

Constraint::make('subscribed')
    ->label('Subscribed to updates')
    ->icon('heroicon-m-bell')
    ->operators([
        // ...
    ]),
```

이제 제약 조건에 대한 [연산자 정의](#creating-custom-operators)를 해야 합니다. 이 연산자들은 컬럼을 필터링할 때 선택할 수 있는 옵션입니다. 만약 컬럼이 [nullable](#nullable-constraints)하다면, 해당 내장 연산자를 사용자 지정 제약 조건에 등록할 수도 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Constraint;
use Filament\Tables\Filters\QueryBuilder\Constraints\Operators\IsFilledOperator;

Constraint::make('subscribed')
    ->label('Subscribed to updates')
    ->icon('heroicon-m-bell')
    ->operators([
        // ...
        IsFilledOperator::class,
    ]),
```

### 커스텀 연산자 생성하기 {#creating-custom-operators}

커스텀 연산자는 `Operator::make()` 메서드를 사용하여 생성할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder\Constraints\Operators\Operator;

Operator::make('subscribed')
    ->label(fn (bool $isInverse): string => $isInverse ? '구독하지 않음' : '구독함')
    ->summary(fn (bool $isInverse): string => $isInverse ? '구독하지 않았습니다' : '구독 중입니다')
    ->baseQuery(fn (Builder $query, bool $isInverse) => $query->{$isInverse ? 'whereDoesntHave' : 'whereHas'}(
        'subscriptions.user',
        fn (Builder $query) => $query->whereKey(auth()->user()),
    )),
```

이 예시에서 연산자는 인증된 사용자가 해당 레코드를 구독하고 있는지 여부에 따라 레코드를 필터링할 수 있습니다. 구독 정보는 테이블의 `subscriptions` 관계에 기록됩니다.

`baseQuery()` 메서드는 레코드를 필터링하는 데 사용될 쿼리를 정의하는 데 사용됩니다. `$isInverse` 인자는 "구독함" 옵션이 선택되었을 때는 `false`, "구독하지 않음" 옵션이 선택되었을 때는 `true`입니다. 이 함수는 테이블의 기본 쿼리에 적용되며, 여기서 `whereHas()`를 사용할 수 있습니다. 만약 함수가 테이블의 기본 쿼리에 적용될 필요가 없고, 단순히 `where()`나 `whereIn()`을 사용할 경우에는, 대신 `query()` 메서드를 사용할 수 있습니다. 이 방법은 중첩된 "OR" 그룹 내에서도 사용할 수 있다는 장점이 있습니다.

`label()` 메서드는 연산자 선택에서 옵션을 렌더링하는 데 사용됩니다. 각 연산자마다 반전되지 않은 경우와 반전된 경우, 두 가지 옵션이 등록됩니다.

`summary()` 메서드는 쿼리에 제약 조건이 적용될 때, 해당 제약 조건의 개요를 제공하기 위해 제약 조건 헤더에 사용됩니다.

## 제약 조건 선택기 사용자 지정하기 {#customizing-the-constraint-picker}

### 제약 조건 선택기에서 열 수 변경하기 {#changing-the-number-of-columns-in-the-constraint-picker}

제약 조건 선택기는 기본적으로 1개의 열만 가집니다. `constraintPickerColumns()`에 열의 개수를 전달하여 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Filters\QueryBuilder;

QueryBuilder::make()
    ->constraintPickerColumns(2)
    ->constraints([
        // ...
    ])
```

이 메서드는 여러 가지 방식으로 사용할 수 있습니다:

- `constraintPickerColumns(2)`처럼 정수를 전달할 수 있습니다. 이 정수는 `lg` 브레이크포인트 이상에서 사용되는 열의 개수입니다. 더 작은 기기에서는 항상 1개의 열만 사용됩니다.
- 배열을 전달할 수도 있는데, 이 경우 키는 브레이크포인트이고 값은 열의 개수입니다. 예를 들어, `constraintPickerColumns(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서 2열 레이아웃을, 매우 큰 기기에서 4열 레이아웃을 만듭니다. 더 작은 기기의 기본 브레이크포인트는 1열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.

브레이크포인트(`sm`, `md`, `lg`, `xl`, `2xl`)는 Tailwind에서 정의되며, [Tailwind 문서](https://tailwindcss.com/docs/responsive-design#overview)에서 확인할 수 있습니다.

### 제약 조건 선택기의 너비 늘리기 {#increasing-the-width-of-the-constraint-picker}

[열의 개수를 늘릴 때](#changing-the-number-of-columns-in-the-constraint-picker), 드롭다운의 너비도 추가된 열을 처리할 수 있도록 점진적으로 증가해야 합니다. 더 세밀하게 제어하고 싶다면, `constraintPickerWidth()` 메서드를 사용하여 드롭다운의 최대 너비를 수동으로 설정할 수 있습니다. 옵션은 [Tailwind의 max-width 스케일](https://tailwindcss.com/docs/max-width)과 일치합니다. 사용 가능한 옵션은 `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`입니다.

```php
use Filament\Tables\Filters\QueryBuilder;

QueryBuilder::make()
    ->constraintPickerColumns(3)
    ->constraintPickerWidth('2xl')
    ->constraints([
        // ...
    ])
```
