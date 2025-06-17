# 헬퍼














## 소개 {#introduction}

Laravel은 다양한 전역 "헬퍼" PHP 함수를 포함하고 있습니다. 이 함수들 중 다수는 프레임워크 자체에서 사용되지만, 여러분이 편리하다고 느낀다면 자신의 애플리케이션에서도 자유롭게 사용할 수 있습니다.


## 사용 가능한 메서드 {#available-methods}

<style>
    .collection-method-list > p {
        columns: 10.8em 3; -moz-columns: 10.8em 3; -webkit-columns: 10.8em 3;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>


### 배열 & 객체 {#arrays-and-objects-method-list}

<div class="collection-method-list" markdown="1">

[Arr::accessible](#method-array-accessible)
[Arr::add](#method-array-add)
[Arr::array](#method-array-array)
[Arr::boolean](#method-array-boolean)
[Arr::collapse](#method-array-collapse)
[Arr::crossJoin](#method-array-crossjoin)
[Arr::divide](#method-array-divide)
[Arr::dot](#method-array-dot)
[Arr::except](#method-array-except)
[Arr::exists](#method-array-exists)
[Arr::first](#method-array-first)
[Arr::flatten](#method-array-flatten)
[Arr::float](#method-array-float)
[Arr::forget](#method-array-forget)
[Arr::from](#method-array-from)
[Arr::get](#method-array-get)
[Arr::has](#method-array-has)
[Arr::hasAll](#method-array-hasall)
[Arr::hasAny](#method-array-hasany)
[Arr::integer](#method-array-integer)
[Arr::isAssoc](#method-array-isassoc)
[Arr::isList](#method-array-islist)
[Arr::join](#method-array-join)
[Arr::keyBy](#method-array-keyby)
[Arr::last](#method-array-last)
[Arr::map](#method-array-map)
[Arr::mapSpread](#method-array-map-spread)
[Arr::mapWithKeys](#method-array-map-with-keys)
[Arr::only](#method-array-only)
[Arr::partition](#method-array-partition)
[Arr::pluck](#method-array-pluck)
[Arr::prepend](#method-array-prepend)
[Arr::prependKeysWith](#method-array-prependkeyswith)
[Arr::pull](#method-array-pull)
[Arr::query](#method-array-query)
[Arr::random](#method-array-random)
[Arr::reject](#method-array-reject)
[Arr::select](#method-array-select)
[Arr::set](#method-array-set)
[Arr::shuffle](#method-array-shuffle)
[Arr::sole](#method-array-sole)
[Arr::sort](#method-array-sort)
[Arr::sortDesc](#method-array-sort-desc)
[Arr::sortRecursive](#method-array-sort-recursive)
[Arr::string](#method-array-string)
[Arr::take](#method-array-take)
[Arr::toCssClasses](#method-array-to-css-classes)
[Arr::toCssStyles](#method-array-to-css-styles)
[Arr::undot](#method-array-undot)
[Arr::where](#method-array-where)
[Arr::whereNotNull](#method-array-where-not-null)
[Arr::wrap](#method-array-wrap)
[data_fill](#method-data-fill)
[data_get](#method-data-get)
[data_set](#method-data-set)
[data_forget](#method-data-forget)
[head](#method-head)
[last](#method-last)
</div>


### 숫자 {#numbers-method-list}

<div class="collection-method-list" markdown="1">

[Number::abbreviate](#method-number-abbreviate)
[Number::clamp](#method-number-clamp)
[Number::currency](#method-number-currency)
[Number::defaultCurrency](#method-default-currency)
[Number::defaultLocale](#method-default-locale)
[Number::fileSize](#method-number-file-size)
[Number::forHumans](#method-number-for-humans)
[Number::format](#method-number-format)
[Number::ordinal](#method-number-ordinal)
[Number::pairs](#method-number-pairs)
[Number::percentage](#method-number-percentage)
[Number::spell](#method-number-spell)
[Number::spellOrdinal](#method-number-spell-ordinal)
[Number::trim](#method-number-trim)
[Number::useLocale](#method-number-use-locale)
[Number::withLocale](#method-number-with-locale)
[Number::useCurrency](#method-number-use-currency)
[Number::withCurrency](#method-number-with-currency)

</div>


### 경로 {#paths-method-list}

<div class="collection-method-list" markdown="1">

[app_path](#method-app-path)
[base_path](#method-base-path)
[config_path](#method-config-path)
[database_path](#method-database-path)
[lang_path](#method-lang-path)
[mix](#method-mix)
[public_path](#method-public-path)
[resource_path](#method-resource-path)
[storage_path](#method-storage-path)

</div>


### URL {#urls-method-list}

<div class="collection-method-list" markdown="1">

[action](#method-action)
[asset](#method-asset)
[route](#method-route)
[secure_asset](#method-secure-asset)
[secure_url](#method-secure-url)
[to_route](#method-to-route)
[uri](#method-uri)
[url](#method-url)

</div>


### 기타 {#miscellaneous-method-list}

<div class="collection-method-list" markdown="1">

[abort](#method-abort)
[abort_if](#method-abort-if)
[abort_unless](#method-abort-unless)
[app](#method-app)
[auth](#method-auth)
[back](#method-back)
[bcrypt](#method-bcrypt)
[blank](#method-blank)
[broadcast](#method-broadcast)
[cache](#method-cache)
[class_uses_recursive](#method-class-uses-recursive)
[collect](#method-collect)
[config](#method-config)
[context](#method-context)
[cookie](#method-cookie)
[csrf_field](#method-csrf-field)
[csrf_token](#method-csrf-token)
[decrypt](#method-decrypt)
[dd](#method-dd)
[dispatch](#method-dispatch)
[dispatch_sync](#method-dispatch-sync)
[dump](#method-dump)
[encrypt](#method-encrypt)
[env](#method-env)
[event](#method-event)
[fake](#method-fake)
[filled](#method-filled)
[info](#method-info)
[literal](#method-literal)
[logger](#method-logger)
[method_field](#method-method-field)
[now](#method-now)
[old](#method-old)
[once](#method-once)
[optional](#method-optional)
[policy](#method-policy)
[redirect](#method-redirect)
[report](#method-report)
[report_if](#method-report-if)
[report_unless](#method-report-unless)
[request](#method-request)
[rescue](#method-rescue)
[resolve](#method-resolve)
[response](#method-response)
[retry](#method-retry)
[session](#method-session)
[tap](#method-tap)
[throw_if](#method-throw-if)
[throw_unless](#method-throw-unless)
[today](#method-today)
[trait_uses_recursive](#method-trait-uses-recursive)
[transform](#method-transform)
[validator](#method-validator)
[value](#method-value)
[view](#method-view)
[with](#method-with)
[when](#method-when)

</div>


## 배열 & 객체 {#arrays}


#### `Arr::accessible()` {#method-array-accessible}

`Arr::accessible` 메서드는 주어진 값이 배열로 접근 가능한지 여부를 판단합니다:

```php
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

$isAccessible = Arr::accessible(['a' => 1, 'b' => 2]);

// true

$isAccessible = Arr::accessible(new Collection);

// true

$isAccessible = Arr::accessible('abc');

// false

$isAccessible = Arr::accessible(new stdClass);

// false
```


#### `Arr::add()` {#method-array-add}

`Arr::add` 메서드는 주어진 키가 배열에 존재하지 않거나 값이 `null`인 경우, 해당 키와 값을 배열에 추가합니다:

```php
use Illuminate\Support\Arr;

$array = Arr::add(['name' => 'Desk'], 'price', 100);

// ['name' => 'Desk', 'price' => 100]

$array = Arr::add(['name' => 'Desk', 'price' => null], 'price', 100);

// ['name' => 'Desk', 'price' => 100]
```


#### `Arr::array()` {#method-array-array}

`Arr::array` 메서드는 "dot" 표기법을 사용하여 깊이 중첩된 배열에서 값을 가져옵니다([Arr::get()](#method-array-get)과 동일하게 동작). 하지만 요청한 값이 배열이 아닐 경우 `InvalidArgumentException` 예외를 발생시킵니다:

```
use Illuminate\Support\Arr;

$array = ['name' => 'Joe', 'languages' => ['PHP', 'Ruby']];

$value = Arr::array($array, 'languages');

// ['PHP', 'Ruby']

$value = Arr::array($array, 'name');

// InvalidArgumentException 예외 발생
```


#### `Arr::boolean()` {#method-array-boolean}

`Arr::boolean` 메서드는 "dot" 표기법을 사용하여 깊게 중첩된 배열에서 값을 가져옵니다([Arr::get()](#method-array-get)과 동일). 하지만 요청한 값이 `boolean`이 아닐 경우 `InvalidArgumentException` 예외를 발생시킵니다:

```
use Illuminate\Support\Arr;

$array = ['name' => 'Joe', 'available' => true];

$value = Arr::boolean($array, 'available');

// true

$value = Arr::boolean($array, 'name');

// InvalidArgumentException 예외 발생
```



#### `Arr::collapse()` {#method-array-collapse}

`Arr::collapse` 메서드는 배열들의 배열을 하나의 배열로 합쳐줍니다:

```php
use Illuminate\Support\Arr;

$array = Arr::collapse([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```


#### `Arr::crossJoin()` {#method-array-crossjoin}

`Arr::crossJoin` 메서드는 주어진 배열들을 교차 조인하여, 가능한 모든 조합(데카르트 곱)을 반환합니다:

```php
use Illuminate\Support\Arr;

$matrix = Arr::crossJoin([1, 2], ['a', 'b']);

/*
    [
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
    ]
*/

$matrix = Arr::crossJoin([1, 2], ['a', 'b'], ['I', 'II']);

/*
    [
        [1, 'a', 'I'],
        [1, 'a', 'II'],
        [1, 'b', 'I'],
        [1, 'b', 'II'],
        [2, 'a', 'I'],
        [2, 'a', 'II'],
        [2, 'b', 'I'],
        [2, 'b', 'II'],
    ]
*/
```


#### `Arr::divide()` {#method-array-divide}

`Arr::divide` 메서드는 주어진 배열의 키와 값을 각각 별도의 배열로 반환합니다:

```php
use Illuminate\Support\Arr;

[$keys, $values] = Arr::divide(['name' => 'Desk']);

// $keys: ['name']

// $values: ['Desk']
```


#### `Arr::dot()` {#method-array-dot}

`Arr::dot` 메서드는 다차원 배열을 "점(dot) 표기법"을 사용하여 깊이를 나타내는 단일 레벨의 배열로 평탄화합니다:

```php
use Illuminate\Support\Arr;

$array = ['products' => ['desk' => ['price' => 100]]];

$flattened = Arr::dot($array);

// ['products.desk.price' => 100]
```


#### `Arr::except()` {#method-array-except}

`Arr::except` 메서드는 주어진 키/값 쌍을 배열에서 제거합니다:

```php
use Illuminate\Support\Arr;

$array = ['name' => 'Desk', 'price' => 100];

$filtered = Arr::except($array, ['price']);

// ['name' => 'Desk']
```


#### `Arr::exists()` {#method-array-exists}

`Arr::exists` 메서드는 주어진 배열에 특정 키가 존재하는지 확인합니다:

```php
use Illuminate\Support\Arr;

$array = ['name' => 'John Doe', 'age' => 17];

$exists = Arr::exists($array, 'name');

// true

$exists = Arr::exists($array, 'salary');

// false
```


#### `Arr::first()` {#method-array-first}

`Arr::first` 메서드는 주어진 조건을 만족하는 배열의 첫 번째 요소를 반환합니다:

```php
use Illuminate\Support\Arr;

$array = [100, 200, 300];

$first = Arr::first($array, function (int $value, int $key) {
    return $value >= 150;
});

// 200
```

또한, 세 번째 인자로 기본값을 전달할 수 있습니다. 만약 조건을 만족하는 값이 없을 경우 이 기본값이 반환됩니다:

```php
use Illuminate\Support\Arr;

$first = Arr::first($array, $callback, $default);
```


#### `Arr::flatten()` {#method-array-flatten}

`Arr::flatten` 메서드는 다차원 배열을 단일 레벨의 배열로 평탄화합니다:

```php
use Illuminate\Support\Arr;

$array = ['name' => 'Joe', 'languages' => ['PHP', 'Ruby']];

$flattened = Arr::flatten($array);

// ['Joe', 'PHP', 'Ruby']
```


#### `Arr::float()` {#method-array-float}

`Arr::float` 메서드는 "dot" 표기법을 사용하여 깊게 중첩된 배열에서 값을 가져옵니다([Arr::get()](#method-array-get)과 동일). 하지만 요청한 값이 `float` 타입이 아닐 경우 `InvalidArgumentException` 예외를 발생시킵니다:

```
use Illuminate\Support\Arr;

$array = ['name' => 'Joe', 'balance' => 123.45];

$value = Arr::float($array, 'balance');

// 123.45

$value = Arr::float($array, 'name');

// InvalidArgumentException 예외 발생
```


#### `Arr::forget()` {#method-array-forget}

`Arr::forget` 메서드는 "dot" 표기법을 사용하여 깊게 중첩된 배열에서 지정한 키/값 쌍을 제거합니다:

```php
use Illuminate\Support\Arr;

$array = ['products' => ['desk' => ['price' => 100]]];

Arr::forget($array, 'products.desk');

// ['products' => []]
```


#### `Arr::from()` {#method-array-from}

`Arr::from` 메서드는 다양한 입력 타입을 순수 PHP 배열로 변환합니다. 이 메서드는 배열, 객체뿐만 아니라 `Arrayable`, `Enumerable`, `Jsonable`, `JsonSerializable`와 같은 여러 Laravel의 일반적인 인터페이스도 지원합니다. 또한 `Traversable`과 `WeakMap` 인스턴스도 처리할 수 있습니다:

```php
use Illuminate\Support\Arr;

Arr::from((object) ['foo' => 'bar']); // ['foo' => 'bar']

class TestJsonableObject implements Jsonable
{
    public function toJson($options = 0)
    {
        return json_encode(['foo' => 'bar']);
    }
}

Arr::from(new TestJsonableObject); // ['foo' => 'bar']
```


#### `Arr::get()` {#method-array-get}

`Arr::get` 메서드는 "dot" 표기법을 사용하여 다차원 배열에서 값을 가져옵니다:

```php
use Illuminate\Support\Arr;

$array = ['products' => ['desk' => ['price' => 100]]];

$price = Arr::get($array, 'products.desk.price');

// 100
```

`Arr::get` 메서드는 기본값도 받을 수 있으며, 지정한 키가 배열에 없을 경우 이 기본값이 반환됩니다:

```php
use Illuminate\Support\Arr;

$discount = Arr::get($array, 'products.desk.discount', 0);

// 0
```


#### `Arr::has()` {#method-array-has}

`Arr::has` 메서드는 "dot" 표기법을 사용하여 주어진 항목 또는 항목들이 배열에 존재하는지 확인합니다:

```php
use Illuminate\Support\Arr;

$array = ['product' => ['name' => 'Desk', 'price' => 100]];

$contains = Arr::has($array, 'product.name');

// true

$contains = Arr::has($array, ['product.price', 'product.discount']);

// false
```


#### `Arr::hasAll()` {#method-array-hasall}

`Arr::hasAll` 메서드는 주어진 배열에 지정된 모든 키가 "dot" 표기법을 사용하여 존재하는지 확인합니다:

```php
use Illuminate\Support\Arr;

$array = ['name' => 'Taylor', 'language' => 'PHP'];

Arr::hasAll($array, ['name']); // true
Arr::hasAll($array, ['name', 'language']); // true
Arr::hasAll($array, ['name', 'IDE']); // false
```


#### `Arr::hasAny()` {#method-array-hasany}

`Arr::hasAny` 메서드는 주어진 배열에 대해 "dot" 표기법을 사용하여, 지정한 값들 중 하나라도 존재하는지 확인합니다:

```php
use Illuminate\Support\Arr;

$array = ['product' => ['name' => 'Desk', 'price' => 100]];

$contains = Arr::hasAny($array, 'product.name');

// true

$contains = Arr::hasAny($array, ['product.name', 'product.discount']);

// true

$contains = Arr::hasAny($array, ['category', 'product.discount']);

// false
```


#### `Arr::integer()` {#method-array-integer}

`Arr::integer` 메서드는 "dot" 표기법을 사용하여 깊게 중첩된 배열에서 값을 가져옵니다([Arr::get()](#method-array-get)과 동일). 하지만 요청한 값이 `int` 타입이 아닐 경우 `InvalidArgumentException`을 발생시킵니다:

```
use Illuminate\Support\Arr;

$array = ['name' => 'Joe', 'age' => 42];

$value = Arr::integer($array, 'age');

// 42

$value = Arr::integer($array, 'name');

// InvalidArgumentException 예외 발생
```


#### `Arr::isAssoc()` {#method-array-isassoc}

`Arr::isAssoc` 메서드는 주어진 배열이 연관 배열(associative array)인 경우 `true`를 반환합니다. 배열의 키가 0부터 시작하는 순차적인 숫자 키가 아닐 때, 해당 배열은 "연관 배열"로 간주됩니다.

```php
use Illuminate\Support\Arr;

$isAssoc = Arr::isAssoc(['product' => ['name' => 'Desk', 'price' => 100]]);

// true

$isAssoc = Arr::isAssoc([1, 2, 3]);

// false
```


#### `Arr::isList()` {#method-array-islist}

`Arr::isList` 메서드는 주어진 배열의 키가 0부터 시작하는 연속된 정수일 경우 `true`를 반환합니다:

```php
use Illuminate\Support\Arr;

$isList = Arr::isList(['foo', 'bar', 'baz']);

// true

$isList = Arr::isList(['product' => ['name' => 'Desk', 'price' => 100]]);

// false
```


#### `Arr::join()` {#method-array-join}

`Arr::join` 메서드는 배열의 요소들을 문자열로 결합합니다. 이 메서드의 두 번째 인자를 사용하면, 배열의 마지막 요소를 결합할 때 사용할 문자열도 지정할 수 있습니다:

```php
use Illuminate\Support\Arr;

$array = ['Tailwind', 'Alpine', 'Laravel', 'Livewire'];

$joined = Arr::join($array, ', ');

// Tailwind, Alpine, Laravel, Livewire

$joined = Arr::join($array, ', ', ' and ');

// Tailwind, Alpine, Laravel and Livewire
```


#### `Arr::keyBy()` {#method-array-keyby}

`Arr::keyBy` 메서드는 주어진 키로 배열의 키를 지정합니다. 만약 여러 항목이 동일한 키를 가지고 있다면, 마지막 항목만 새 배열에 남게 됩니다:

```php
use Illuminate\Support\Arr;

$array = [
    ['product_id' => 'prod-100', 'name' => 'Desk'],
    ['product_id' => 'prod-200', 'name' => 'Chair'],
];

$keyed = Arr::keyBy($array, 'product_id');

/*
    [
        'prod-100' => ['product_id' => 'prod-100', 'name' => 'Desk'],
        'prod-200' => ['product_id' => 'prod-200', 'name' => 'Chair'],
    ]
*/
```


#### `Arr::last()` {#method-array-last}

`Arr::last` 메서드는 주어진 조건을 만족하는 배열의 마지막 요소를 반환합니다:

```php
use Illuminate\Support\Arr;

$array = [100, 200, 300, 110];

$last = Arr::last($array, function (int $value, int $key) {
    return $value >= 150;
});

// 300
```

이 메서드는 세 번째 인자로 기본값을 전달할 수 있습니다. 만약 조건을 만족하는 값이 없다면 이 기본값이 반환됩니다:

```php
use Illuminate\Support\Arr;

$last = Arr::last($array, $callback, $default);
```


#### `Arr::map()` {#method-array-map}

`Arr::map` 메서드는 배열을 순회하면서 각 값과 키를 주어진 콜백에 전달합니다. 콜백에서 반환된 값으로 배열의 값이 대체됩니다:

```php
use Illuminate\Support\Arr;

$array = ['first' => 'james', 'last' => 'kirk'];

$mapped = Arr::map($array, function (string $value, string $key) {
    return ucfirst($value);
});

// ['first' => 'James', 'last' => 'Kirk']
```


#### `Arr::mapSpread()` {#method-array-map-spread}

`Arr::mapSpread` 메서드는 배열을 반복하면서 각 중첩된 항목의 값을 주어진 클로저에 전달합니다. 클로저는 항목을 자유롭게 수정하여 반환할 수 있으며, 이렇게 수정된 항목들로 새로운 배열이 생성됩니다:

```php
use Illuminate\Support\Arr;

$array = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
    [8, 9],
];

$mapped = Arr::mapSpread($array, function (int $even, int $odd) {
    return $even + $odd;
});

/*
    [1, 5, 9, 13, 17]
*/
```


#### `Arr::mapWithKeys()` {#method-array-map-with-keys}

`Arr::mapWithKeys` 메서드는 배열을 반복하면서 각 값을 주어진 콜백에 전달합니다. 콜백은 하나의 키/값 쌍을 포함하는 연관 배열을 반환해야 합니다:

```php
use Illuminate\Support\Arr;

$array = [
    [
        'name' => 'John',
        'department' => 'Sales',
        'email' => 'john@example.com',
    ],
    [
        'name' => 'Jane',
        'department' => 'Marketing',
        'email' => 'jane@example.com',
    ]
];

$mapped = Arr::mapWithKeys($array, function (array $item, int $key) {
    return [$item['email'] => $item['name']];
});

/*
    [
        'john@example.com' => 'John',
        'jane@example.com' => 'Jane',
    ]
*/
```


#### `Arr::only()` {#method-array-only}

`Arr::only` 메서드는 주어진 배열에서 지정한 키/값 쌍만 반환합니다:

```php
use Illuminate\Support\Arr;

$array = ['name' => 'Desk', 'price' => 100, 'orders' => 10];

$slice = Arr::only($array, ['name', 'price']);

// ['name' => 'Desk', 'price' => 100]
```


#### `Arr::partition()` {#method-array-partition}

`Arr::partition` 메서드는 PHP 배열 구조 분해와 결합하여, 주어진 조건을 통과하는 요소와 그렇지 않은 요소를 분리할 수 있습니다:

```php
<?php

use Illuminate\Support\Arr;

$numbers = [1, 2, 3, 4, 5, 6];

[$underThree, $equalOrAboveThree] = Arr::partition($numbers, function (int $i) {
    return $i < 3;
});

dump($underThree);

// [1, 2]

dump($equalOrAboveThree);

// [3, 4, 5, 6]
```


#### `Arr::pluck()` {#method-array-pluck}

`Arr::pluck` 메서드는 배열에서 주어진 키에 해당하는 모든 값을 가져옵니다:

```php
use Illuminate\Support\Arr;

$array = [
    ['developer' => ['id' => 1, 'name' => 'Taylor']],
    ['developer' => ['id' => 2, 'name' => 'Abigail']],
];

$names = Arr::pluck($array, 'developer.name');

// ['Taylor', 'Abigail']
```

결과 리스트의 키를 지정할 수도 있습니다:

```php
use Illuminate\Support\Arr;

$names = Arr::pluck($array, 'developer.name', 'developer.id');

// [1 => 'Taylor', 2 => 'Abigail']
```


#### `Arr::prepend()` {#method-array-prepend}

`Arr::prepend` 메서드는 배열의 맨 앞에 항목을 추가합니다:

```php
use Illuminate\Support\Arr;

$array = ['one', 'two', 'three', 'four'];

$array = Arr::prepend($array, 'zero');

// ['zero', 'one', 'two', 'three', 'four']
```

필요하다면, 값에 사용할 키를 지정할 수도 있습니다:

```php
use Illuminate\Support\Arr;

$array = ['price' => 100];

$array = Arr::prepend($array, 'Desk', 'name');

// ['name' => 'Desk', 'price' => 100]
```


#### `Arr::prependKeysWith()` {#method-array-prependkeyswith}

`Arr::prependKeysWith` 메서드는 연관 배열의 모든 키 이름 앞에 지정한 접두사를 붙여줍니다:

```php
use Illuminate\Support\Arr;

$array = [
    'name' => 'Desk',
    'price' => 100,
];

$keyed = Arr::prependKeysWith($array, 'product.');

/*
    [
        'product.name' => 'Desk',
        'product.price' => 100,
    ]
*/
```


#### `Arr::pull()` {#method-array-pull}

`Arr::pull` 메서드는 배열에서 지정한 키의 값(key / value 쌍)을 반환하고, 해당 요소를 배열에서 제거합니다:

```php
use Illuminate\Support\Arr;

$array = ['name' => 'Desk', 'price' => 100];

$name = Arr::pull($array, 'name');

// $name: Desk

// $array: ['price' => 100]
```

이 메서드의 세 번째 인자로 기본값을 전달할 수 있습니다. 만약 지정한 키가 존재하지 않으면, 이 기본값이 반환됩니다:

```php
use Illuminate\Support\Arr;

$value = Arr::pull($array, $key, $default);
```


#### `Arr::query()` {#method-array-query}

`Arr::query` 메서드는 배열을 쿼리 문자열로 변환합니다:

```php
use Illuminate\Support\Arr;

$array = [
    'name' => 'Taylor',
    'order' => [
        'column' => 'created_at',
        'direction' => 'desc'
    ]
];

Arr::query($array);

// name=Taylor&order[column]=created_at&order[direction]=desc
```


#### `Arr::random()` {#method-array-random}

`Arr::random` 메서드는 배열에서 임의의 값을 반환합니다:

```php
use Illuminate\Support\Arr;

$array = [1, 2, 3, 4, 5];

$random = Arr::random($array);

// 4 - (임의로 선택된 값)
```

반환할 항목의 개수를 두 번째 인자로 선택적으로 지정할 수도 있습니다. 이 인자를 지정하면, 하나의 항목만 원하더라도 항상 배열로 반환됩니다:

```php
use Illuminate\Support\Arr;

$items = Arr::random($array, 2);

// [2, 5] - (임의로 선택된 값들)
```


#### `Arr::reject()` {#method-array-reject}

`Arr::reject` 메서드는 주어진 클로저를 사용하여 배열에서 항목을 제거합니다:

```php
use Illuminate\Support\Arr;

$array = [100, '200', 300, '400', 500];

$filtered = Arr::reject($array, function (string|int $value, int $key) {
    return is_string($value);
});

// [0 => 100, 2 => 300, 4 => 500]
```


#### `Arr::select()` {#method-array-select}

`Arr::select` 메서드는 배열에서 특정 값들만 선택하여 새로운 배열을 만듭니다:

```php
use Illuminate\Support\Arr;

$array = [
    ['id' => 1, 'name' => 'Desk', 'price' => 200],
    ['id' => 2, 'name' => 'Table', 'price' => 150],
    ['id' => 3, 'name' => 'Chair', 'price' => 300],
];

Arr::select($array, ['name', 'price']);

// [['name' => 'Desk', 'price' => 200], ['name' => 'Table', 'price' => 150], ['name' => 'Chair', 'price' => 300]]
```


#### `Arr::set()` {#method-array-set}

`Arr::set` 메서드는 "dot" 표기법을 사용하여 다차원 배열 내에 값을 설정합니다:

```php
use Illuminate\Support\Arr;

$array = ['products' => ['desk' => ['price' => 100]]];

Arr::set($array, 'products.desk.price', 200);

// ['products' => ['desk' => ['price' => 200]]]
```


#### `Arr::shuffle()` {#method-array-shuffle}

`Arr::shuffle` 메서드는 배열의 항목들을 무작위로 섞어줍니다:

```php
use Illuminate\Support\Arr;

$array = Arr::shuffle([1, 2, 3, 4, 5]);

// [3, 2, 5, 1, 4] - (무작위로 생성됨)
```


#### `Arr::sole()` {#method-array-sole}

`Arr::sole` 메서드는 주어진 클로저를 사용하여 배열에서 단일 값을 가져옵니다. 배열 내에서 주어진 조건에 일치하는 값이 둘 이상일 경우 `Illuminate\Support\MultipleItemsFoundException` 예외가 발생합니다. 조건에 일치하는 값이 하나도 없을 경우에는 `Illuminate\Support\ItemNotFoundException` 예외가 발생합니다:

```php
use Illuminate\Support\Arr;

$array = ['Desk', 'Table', 'Chair'];

$value = Arr::sole($array, fn (string $value) => $value === 'Desk');

// 'Desk'
```


#### `Arr::sort()` {#method-array-sort}

`Arr::sort` 메서드는 배열을 값에 따라 정렬합니다:

```php
use Illuminate\Support\Arr;

$array = ['Desk', 'Table', 'Chair'];

$sorted = Arr::sort($array);

// ['Chair', 'Desk', 'Table']
```

또한, 주어진 클로저의 결과를 기준으로 배열을 정렬할 수도 있습니다:

```php
use Illuminate\Support\Arr;

$array = [
    ['name' => 'Desk'],
    ['name' => 'Table'],
    ['name' => 'Chair'],
];

$sorted = array_values(Arr::sort($array, function (array $value) {
    return $value['name'];
}));

/*
    [
        ['name' => 'Chair'],
        ['name' => 'Desk'],
        ['name' => 'Table'],
    ]
*/
```


#### `Arr::sortDesc()` {#method-array-sort-desc}

`Arr::sortDesc` 메서드는 배열을 값에 따라 내림차순으로 정렬합니다:

```php
use Illuminate\Support\Arr;

$array = ['Desk', 'Table', 'Chair'];

$sorted = Arr::sortDesc($array);

// ['Table', 'Desk', 'Chair']
```

또한, 주어진 클로저의 결과를 기준으로 배열을 정렬할 수도 있습니다:

```php
use Illuminate\Support\Arr;

$array = [
    ['name' => 'Desk'],
    ['name' => 'Table'],
    ['name' => 'Chair'],
];

$sorted = array_values(Arr::sortDesc($array, function (array $value) {
    return $value['name'];
}));

/*
    [
        ['name' => 'Table'],
        ['name' => 'Desk'],
        ['name' => 'Chair'],
    ]
*/
```


#### `Arr::sortRecursive()` {#method-array-sort-recursive}

`Arr::sortRecursive` 메서드는 배열을 재귀적으로 정렬합니다. 숫자 인덱스가 있는 하위 배열에는 `sort` 함수를, 연관 배열에는 `ksort` 함수를 사용합니다.

```php
use Illuminate\Support\Arr;

$array = [
    ['Roman', 'Taylor', 'Li'],
    ['PHP', 'Ruby', 'JavaScript'],
    ['one' => 1, 'two' => 2, 'three' => 3],
];

$sorted = Arr::sortRecursive($array);

/*
    [
        ['JavaScript', 'PHP', 'Ruby'],
        ['one' => 1, 'three' => 3, 'two' => 2],
        ['Li', 'Roman', 'Taylor'],
    ]
*/
```

결과를 내림차순으로 정렬하고 싶다면, `Arr::sortRecursiveDesc` 메서드를 사용할 수 있습니다.

```php
$sorted = Arr::sortRecursiveDesc($array);
```


#### `Arr::string()` {#method-array-string}

`Arr::string` 메서드는 "dot" 표기법을 사용하여 깊게 중첩된 배열에서 값을 가져옵니다([Arr::get()](#method-array-get)과 동일). 하지만 요청한 값이 `string`이 아닐 경우 `InvalidArgumentException`을 발생시킵니다.

```
use Illuminate\Support\Arr;

$array = ['name' => 'Joe', 'languages' => ['PHP', 'Ruby']];

$value = Arr::string($array, 'name');

// Joe

$value = Arr::string($array, 'languages');

// InvalidArgumentException 예외 발생
```


#### `Arr::take()` {#method-array-take}

`Arr::take` 메서드는 지정한 개수만큼의 항목을 포함하는 새로운 배열을 반환합니다:

```php
use Illuminate\Support\Arr;

$array = [0, 1, 2, 3, 4, 5];

$chunk = Arr::take($array, 3);

// [0, 1, 2]
```

음수 정수를 전달하면 배열의 끝에서부터 지정한 개수만큼의 항목을 가져올 수도 있습니다:

```php
$array = [0, 1, 2, 3, 4, 5];

$chunk = Arr::take($array, -2);

// [4, 5]
```


#### `Arr::toCssClasses()` {#method-array-to-css-classes}

`Arr::toCssClasses` 메서드는 조건에 따라 CSS 클래스 문자열을 조합합니다. 이 메서드는 클래스를 담은 배열을 인자로 받으며, 배열의 키에는 추가하고자 하는 클래스(들)를, 값에는 불리언 표현식을 넣습니다. 배열 요소의 키가 숫자일 경우, 해당 클래스는 항상 렌더링되는 클래스 목록에 포함됩니다:

```php
use Illuminate\Support\Arr;

$isActive = false;
$hasError = true;

$array = ['p-4', 'font-bold' => $isActive, 'bg-red' => $hasError];

$classes = Arr::toCssClasses($array);

/*
    'p-4 bg-red'
*/
```


#### `Arr::toCssStyles()` {#method-array-to-css-styles}

`Arr::toCssStyles` 메서드는 조건부로 CSS 스타일 문자열을 생성합니다. 이 메서드는 클래스를 담은 배열을 인자로 받으며, 배열의 키에는 추가하고자 하는 클래스(또는 여러 클래스)를, 값에는 불리언 표현식을 넣습니다. 배열 요소의 키가 숫자일 경우, 해당 스타일은 항상 렌더링된 스타일 목록에 포함됩니다:

```php
use Illuminate\Support\Arr;

$hasColor = true;

$array = ['background-color: blue', 'color: blue' => $hasColor];

$classes = Arr::toCssStyles($array);

/*
    'background-color: blue; color: blue;'
*/
```

이 메서드는 Laravel에서 [Blade 컴포넌트의 attribute bag에 클래스를 병합](/laravel/12.x/blade#conditionally-merge-classes)하거나, `@class` [Blade 지시어](/laravel/12.x/blade#conditional-classes)에서 조건부 클래스를 적용하는 기능을 지원합니다.


#### `Arr::undot()` {#method-array-undot}

`Arr::undot` 메서드는 "dot" 표기법을 사용하는 1차원 배열을 다차원 배열로 확장합니다:

```php
use Illuminate\Support\Arr;

$array = [
    'user.name' => 'Kevin Malone',
    'user.occupation' => 'Accountant',
];

$array = Arr::undot($array);

// ['user' => ['name' => 'Kevin Malone', 'occupation' => 'Accountant']]
```


#### `Arr::where()` {#method-array-where}

`Arr::where` 메서드는 주어진 클로저를 사용하여 배열을 필터링합니다:

```php
use Illuminate\Support\Arr;

$array = [100, '200', 300, '400', 500];

$filtered = Arr::where($array, function (string|int $value, int $key) {
    return is_string($value);
});

// [1 => '200', 3 => '400']
```


#### `Arr::whereNotNull()` {#method-array-where-not-null}

`Arr::whereNotNull` 메서드는 주어진 배열에서 모든 `null` 값을 제거합니다:

```php
use Illuminate\Support\Arr;

$array = [0, null];

$filtered = Arr::whereNotNull($array);

// [0 => 0]
```


#### `Arr::wrap()` {#method-array-wrap}

`Arr::wrap` 메서드는 주어진 값을 배열로 감쌉니다. 만약 주어진 값이 이미 배열이라면, 수정 없이 그대로 반환됩니다:

```php
use Illuminate\Support\Arr;

$string = 'Laravel';

$array = Arr::wrap($string);

// ['Laravel']
```

만약 주어진 값이 `null`이라면, 빈 배열이 반환됩니다:

```php
use Illuminate\Support\Arr;

$array = Arr::wrap(null);

// []
```


#### `data_fill()` {#method-data-fill}

`data_fill` 함수는 "dot" 표기법을 사용하여 중첩된 배열이나 객체에서 누락된 값을 설정합니다:

```php
$data = ['products' => ['desk' => ['price' => 100]]];

data_fill($data, 'products.desk.price', 200);

// ['products' => ['desk' => ['price' => 100]]]

data_fill($data, 'products.desk.discount', 10);

// ['products' => ['desk' => ['price' => 100, 'discount' => 10]]]
```

이 함수는 또한 별표(*)를 와일드카드로 허용하여 대상에 맞게 값을 채워줍니다:

```php
$data = [
    'products' => [
        ['name' => 'Desk 1', 'price' => 100],
        ['name' => 'Desk 2'],
    ],
];

data_fill($data, 'products.*.price', 200);

/*
    [
        'products' => [
            ['name' => 'Desk 1', 'price' => 100],
            ['name' => 'Desk 2', 'price' => 200],
        ],
    ]
*/
```


#### `data_get()` {#method-data-get}

`data_get` 함수는 "dot" 표기법을 사용하여 중첩된 배열이나 객체에서 값을 가져옵니다:

```php
$data = ['products' => ['desk' => ['price' => 100]]];

$price = data_get($data, 'products.desk.price');

// 100
```

`data_get` 함수는 기본값도 받을 수 있으며, 지정한 키가 존재하지 않을 경우 이 값이 반환됩니다:

```php
$discount = data_get($data, 'products.desk.discount', 0);

// 0
```

이 함수는 별표(*)를 사용한 와일드카드도 지원하여, 배열이나 객체의 모든 키를 대상으로 값을 가져올 수 있습니다:

```php
$data = [
    'product-one' => ['name' => 'Desk 1', 'price' => 100],
    'product-two' => ['name' => 'Desk 2', 'price' => 150],
];

data_get($data, '*.name');

// ['Desk 1', 'Desk 2'];
```

`{first}`와 `{last}` 플레이스홀더를 사용하면 배열의 첫 번째 또는 마지막 항목을 가져올 수 있습니다:

```php
$flight = [
    'segments' => [
        ['from' => 'LHR', 'departure' => '9:00', 'to' => 'IST', 'arrival' => '15:00'],
        ['from' => 'IST', 'departure' => '16:00', 'to' => 'PKX', 'arrival' => '20:00'],
    ],
];

data_get($flight, 'segments.{first}.arrival');

// 15:00
```


#### `data_set()` {#method-data-set}

`data_set` 함수는 "점(dot) 표기법"을 사용하여 중첩된 배열이나 객체 내에 값을 설정합니다:

```php
$data = ['products' => ['desk' => ['price' => 100]]];

data_set($data, 'products.desk.price', 200);

// ['products' => ['desk' => ['price' => 200]]]
```

이 함수는 별표(*)를 사용한 와일드카드도 지원하며, 대상에 맞게 값을 설정할 수 있습니다:

```php
$data = [
    'products' => [
        ['name' => 'Desk 1', 'price' => 100],
        ['name' => 'Desk 2', 'price' => 150],
    ],
];

data_set($data, 'products.*.price', 200);

/*
    [
        'products' => [
            ['name' => 'Desk 1', 'price' => 200],
            ['name' => 'Desk 2', 'price' => 200],
        ],
    ]
*/
```

기본적으로 기존 값이 있으면 덮어씁니다. 만약 값이 존재하지 않을 때만 설정하고 싶다면, 함수의 네 번째 인자로 `false`를 전달하면 됩니다:

```php
$data = ['products' => ['desk' => ['price' => 100]]];

data_set($data, 'products.desk.price', 200, overwrite: false);

// ['products' => ['desk' => ['price' => 100]]]
```


#### `data_forget()` {#method-data-forget}

`data_forget` 함수는 "점(dot) 표기법"을 사용하여 중첩된 배열이나 객체에서 값을 제거합니다:

```php
$data = ['products' => ['desk' => ['price' => 100]]];

data_forget($data, 'products.desk.price');

// ['products' => ['desk' => []]]
```

이 함수는 별표(*)를 사용한 와일드카드도 허용하며, 대상에 맞는 값을 모두 제거합니다:

```php
$data = [
    'products' => [
        ['name' => 'Desk 1', 'price' => 100],
        ['name' => 'Desk 2', 'price' => 150],
    ],
];

data_forget($data, 'products.*.price');

/*
    [
        'products' => [
            ['name' => 'Desk 1'],
            ['name' => 'Desk 2'],
        ],
    ]
*/
```


#### `head()` {#method-head}

`head` 함수는 주어진 배열에서 첫 번째 요소를 반환합니다:

```php
$array = [100, 200, 300];

$first = head($array);

// 100
```


#### `last()` {#method-last}

`last` 함수는 주어진 배열에서 마지막 요소를 반환합니다:

```php
$array = [100, 200, 300];

$last = last($array);

// 300
```


## 숫자 {#numbers}


#### `Number::abbreviate()` {#method-number-abbreviate}

`Number::abbreviate` 메서드는 전달된 숫자 값을 단위가 축약된 사람이 읽기 쉬운 형식으로 반환합니다:

```php
use Illuminate\Support\Number;

$number = Number::abbreviate(1000);

// 1K

$number = Number::abbreviate(489939);

// 490K

$number = Number::abbreviate(1230000, precision: 2);

// 1.23M
```


#### `Number::clamp()` {#method-number-clamp}

`Number::clamp` 메서드는 주어진 숫자가 지정된 범위 내에 있도록 보장합니다. 만약 숫자가 최소값보다 작으면 최소값을 반환하고, 최대값보다 크면 최대값을 반환합니다:

```php
use Illuminate\Support\Number;

$number = Number::clamp(105, min: 10, max: 100);

// 100

$number = Number::clamp(5, min: 10, max: 100);

// 10

$number = Number::clamp(10, min: 10, max: 100);

// 10

$number = Number::clamp(20, min: 10, max: 100);

// 20
```


#### `Number::currency()` {#method-number-currency}

`Number::currency` 메서드는 주어진 값을 통화 형식의 문자열로 반환합니다:

```php
use Illuminate\Support\Number;

$currency = Number::currency(1000);

// $1,000.00

$currency = Number::currency(1000, in: 'EUR');

// €1,000.00

$currency = Number::currency(1000, in: 'EUR', locale: 'de');

// 1.000,00 €

$currency = Number::currency(1000, in: 'EUR', locale: 'de', precision: 0);

// 1.000 €
```


#### `Number::defaultCurrency()` {#method-default-currency}

`Number::defaultCurrency` 메서드는 `Number` 클래스에서 사용 중인 기본 통화를 반환합니다:

```php
use Illuminate\Support\Number;

$currency = Number::defaultCurrency();

// USD
```


#### `Number::defaultLocale()` {#method-default-locale}

`Number::defaultLocale` 메서드는 `Number` 클래스에서 사용 중인 기본 로케일을 반환합니다:

```php
use Illuminate\Support\Number;

$locale = Number::defaultLocale();

// en
```


#### `Number::fileSize()` {#method-number-file-size}

`Number::fileSize` 메서드는 주어진 바이트 값을 파일 크기 문자열로 반환합니다:

```php
use Illuminate\Support\Number;

$size = Number::fileSize(1024);

// 1 KB

$size = Number::fileSize(1024 * 1024);

// 1 MB

$size = Number::fileSize(1024, precision: 2);

// 1.00 KB
```


#### `Number::forHumans()` {#method-number-for-humans}

`Number::forHumans` 메서드는 전달된 숫자 값을 사람이 읽기 쉬운 형식으로 반환합니다:

```php
use Illuminate\Support\Number;

$number = Number::forHumans(1000);

// 1천

$number = Number::forHumans(489939);

// 49만

$number = Number::forHumans(1230000, precision: 2);

// 123만
```


#### `Number::format()` {#method-number-format}

`Number::format` 메서드는 주어진 숫자를 로케일에 맞는 문자열로 포맷합니다:

```php
use Illuminate\Support\Number;

$number = Number::format(100000);

// 100,000

$number = Number::format(100000, precision: 2);

// 100,000.00

$number = Number::format(100000.123, maxPrecision: 2);

// 100,000.12

$number = Number::format(100000, locale: 'de');

// 100.000
```


#### `Number::ordinal()` {#method-number-ordinal}

`Number::ordinal` 메서드는 숫자의 서수(순서형) 표현을 반환합니다:

```php
use Illuminate\Support\Number;

$number = Number::ordinal(1);

// 1st

$number = Number::ordinal(2);

// 2nd

$number = Number::ordinal(21);

// 21st
```


#### `Number::pairs()` {#method-number-pairs}

`Number::pairs` 메서드는 지정된 범위와 단계 값(step)에 따라 숫자 쌍(하위 범위) 배열을 생성합니다. 이 메서드는 큰 숫자 범위를 더 작고 관리하기 쉬운 하위 범위로 나누어 페이지네이션이나 작업 배치 등에 유용하게 사용할 수 있습니다. `pairs` 메서드는 각 내부 배열이 숫자 쌍(하위 범위)을 나타내는 배열의 배열을 반환합니다:

```php
use Illuminate\Support\Number;

$result = Number::pairs(25, 10);

// [[0, 9], [10, 19], [20, 25]]

$result = Number::pairs(25, 10, offset: 0);

// [[0, 10], [10, 20], [20, 25]]
```


#### `Number::percentage()` {#method-number-percentage}

`Number::percentage` 메서드는 주어진 값을 퍼센트(%) 형태의 문자열로 반환합니다:

```php
use Illuminate\Support\Number;

$percentage = Number::percentage(10);

// 10%

$percentage = Number::percentage(10, precision: 2);

// 10.00%

$percentage = Number::percentage(10.123, maxPrecision: 2);

// 10.12%

$percentage = Number::percentage(10, precision: 2, locale: 'de');

// 10,00%
```


#### `Number::spell()` {#method-number-spell}

`Number::spell` 메서드는 주어진 숫자를 단어로 이루어진 문자열로 변환합니다:

```php
use Illuminate\Support\Number;

$number = Number::spell(102);

// one hundred and two

$number = Number::spell(88, locale: 'fr');

// quatre-vingt-huit
```

`after` 인자를 사용하면, 지정한 값보다 큰 숫자만 단어로 변환하도록 설정할 수 있습니다:

```php
$number = Number::spell(10, after: 10);

// 10

$number = Number::spell(11, after: 10);

// eleven
```

`until` 인자를 사용하면, 지정한 값보다 작은 숫자만 단어로 변환하도록 설정할 수 있습니다:

```php
$number = Number::spell(5, until: 10);

// five

$number = Number::spell(10, until: 10);

// 10
```


#### `Number::spellOrdinal()` {#method-number-spell-ordinal}

`Number::spellOrdinal` 메서드는 숫자의 서수(순서)를 단어 형태의 문자열로 반환합니다:

```php
use Illuminate\Support\Number;

$number = Number::spellOrdinal(1);

// first

$number = Number::spellOrdinal(2);

// second

$number = Number::spellOrdinal(21);

// twenty-first
```


#### `Number::trim()` {#method-number-trim}

`Number::trim` 메서드는 주어진 숫자의 소수점 뒤에 있는 불필요한 0을 모두 제거합니다:

```php
use Illuminate\Support\Number;

$number = Number::trim(12.0);

// 12

$number = Number::trim(12.30);

// 12.3
```


#### `Number::useLocale()` {#method-number-use-locale}

`Number::useLocale` 메서드는 전역적으로 기본 숫자 로케일을 설정합니다. 이 설정은 이후 `Number` 클래스의 메서드들이 숫자와 통화를 포맷할 때 영향을 미칩니다.

```php
use Illuminate\Support\Number;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Number::useLocale('de');
}
```


#### `Number::withLocale()` {#method-number-with-locale}

`Number::withLocale` 메서드는 지정한 로케일을 사용하여 주어진 클로저를 실행한 뒤, 콜백 실행이 끝나면 원래의 로케일로 복원합니다:

```php
use Illuminate\Support\Number;

$number = Number::withLocale('de', function () {
    return Number::format(1500);
});
```


#### `Number::useCurrency()` {#method-number-use-currency}

`Number::useCurrency` 메서드는 전역적으로 기본 숫자 통화(currency)를 설정합니다. 이 설정은 이후 `Number` 클래스의 메서드들이 통화를 포맷할 때 영향을 미칩니다.

```php
use Illuminate\Support\Number;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Number::useCurrency('GBP');
}
```


#### `Number::withCurrency()` {#method-number-with-currency}

`Number::withCurrency` 메서드는 지정한 통화를 사용하여 주어진 클로저를 실행한 뒤, 콜백 실행이 끝나면 원래의 통화로 복원합니다:

```php
use Illuminate\Support\Number;

$number = Number::withCurrency('GBP', function () {
    // ...
});
```


## 경로 {#paths}


#### `app_path()` {#method-app-path}

`app_path` 함수는 애플리케이션의 `app` 디렉터리에 대한 전체 경로를 반환합니다. 또한, `app_path` 함수를 사용하여 애플리케이션 디렉터리를 기준으로 상대적인 파일의 전체 경로를 생성할 수도 있습니다:

```php
$path = app_path();

$path = app_path('Http/Controllers/Controller.php');
```


#### `base_path()` {#method-base-path}

`base_path` 함수는 애플리케이션의 루트 디렉터리에 대한 전체 경로를 반환합니다. 또한, `base_path` 함수를 사용하여 프로젝트 루트 디렉터리를 기준으로 특정 파일의 전체 경로를 생성할 수도 있습니다:

```php
$path = base_path();

$path = base_path('vendor/bin');
```


#### `config_path()` {#method-config-path}

`config_path` 함수는 애플리케이션의 `config` 디렉터리에 대한 전체 경로를 반환합니다. 또한, 이 함수를 사용하여 설정 디렉터리 내의 특정 파일에 대한 전체 경로를 생성할 수도 있습니다:

```php
$path = config_path();

$path = config_path('app.php');
```


#### `database_path()` {#method-database-path}

`database_path` 함수는 애플리케이션의 `database` 디렉터리에 대한 전체 경로를 반환합니다. 또한, 이 함수를 사용하여 데이터베이스 디렉터리 내의 특정 파일에 대한 전체 경로를 생성할 수도 있습니다:

```php
$path = database_path();

$path = database_path('factories/UserFactory.php');
```


#### `lang_path()` {#method-lang-path}

`lang_path` 함수는 애플리케이션의 `lang` 디렉터리에 대한 전체 경로를 반환합니다. 또한, 이 함수를 사용하여 해당 디렉터리 내의 특정 파일에 대한 전체 경로를 생성할 수도 있습니다:

```php
$path = lang_path();

$path = lang_path('en/messages.php');
```

> [!NOTE]
> 기본적으로 Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하고 싶다면, `lang:publish` Artisan 명령어를 통해 해당 파일들을 퍼블리시할 수 있습니다.


#### `mix()` {#method-mix}

`mix` 함수는 [버전이 지정된 Mix 파일](/laravel/12.x/mix)의 경로를 반환합니다:

```php
$path = mix('css/app.css');
```


#### `public_path()` {#method-public-path}

`public_path` 함수는 애플리케이션의 `public` 디렉터리에 대한 전체 경로를 반환합니다. 또한, `public_path` 함수를 사용하여 public 디렉터리 내의 특정 파일에 대한 전체 경로를 생성할 수도 있습니다:

```php
$path = public_path();

$path = public_path('css/app.css');
```


#### `resource_path()` {#method-resource-path}

`resource_path` 함수는 애플리케이션의 `resources` 디렉터리에 대한 전체 경로를 반환합니다. 또한, `resource_path` 함수를 사용하여 resources 디렉터리 내의 특정 파일에 대한 전체 경로를 생성할 수도 있습니다:

```php
$path = resource_path();

$path = resource_path('sass/app.scss');
```


#### `storage_path()` {#method-storage-path}

`storage_path` 함수는 애플리케이션의 `storage` 디렉터리에 대한 전체 경로를 반환합니다. 또한, `storage_path` 함수를 사용하여 storage 디렉터리 내의 특정 파일에 대한 전체 경로를 생성할 수도 있습니다:

```php
$path = storage_path();

$path = storage_path('app/file.txt');
```


## URL {#urls}


#### `action()` {#method-action}

`action` 함수는 주어진 컨트롤러 액션에 대한 URL을 생성합니다:

```php
use App\Http\Controllers\HomeController;

$url = action([HomeController::class, 'index']);
```

만약 해당 메서드가 라우트 파라미터를 받는다면, 두 번째 인수로 파라미터를 전달할 수 있습니다:

```php
$url = action([UserController::class, 'profile'], ['id' => 1]);
```


#### `asset()` {#method-asset}

`asset` 함수는 현재 요청의 스킴(HTTP 또는 HTTPS)을 사용하여 에셋의 URL을 생성합니다.

```php
$url = asset('img/photo.jpg');
```

에셋 URL의 호스트는 `.env` 파일의 `ASSET_URL` 변수를 설정하여 구성할 수 있습니다. 이는 Amazon S3나 다른 CDN과 같이 외부 서비스에 에셋을 호스팅할 때 유용합니다.

```php
// ASSET_URL=http://example.com/assets

$url = asset('img/photo.jpg'); // http://example.com/assets/img/photo.jpg
```


#### `route()` {#method-route}

`route` 함수는 주어진 [이름이 지정된 라우트](/laravel/12.x/routing#named-routes)에 대한 URL을 생성합니다:

```php
$url = route('route.name');
```

라우트가 파라미터를 받는 경우, 두 번째 인수로 파라미터를 배열 형태로 전달할 수 있습니다:

```php
$url = route('route.name', ['id' => 1]);
```

기본적으로 `route` 함수는 절대 URL을 생성합니다. 만약 상대 URL을 생성하고 싶다면, 세 번째 인수로 `false`를 전달하면 됩니다:

```php
$url = route('route.name', ['id' => 1], false);
```


#### `secure_asset()` {#method-secure-asset}

`secure_asset` 함수는 HTTPS를 사용하여 에셋의 URL을 생성합니다:

```php
$url = secure_asset('img/photo.jpg');
```


#### `secure_url()` {#method-secure-url}

`secure_url` 함수는 주어진 경로에 대해 완전히 자격이 갖춰진 HTTPS URL을 생성합니다. 추가적인 URL 세그먼트는 함수의 두 번째 인자로 전달할 수 있습니다:

```php
$url = secure_url('user/profile');

$url = secure_url('user/profile', [1]);
```


#### `to_route()` {#method-to-route}

`to_route` 함수는 주어진 [이름이 지정된 라우트](/laravel/12.x/routing#named-routes)에 대한 [리디렉션 HTTP 응답](/laravel/12.x/responses#redirects)을 생성합니다:

```php
return to_route('users.show', ['user' => 1]);
```

필요하다면, 리디렉션에 할당할 HTTP 상태 코드와 추가적인 응답 헤더를 `to_route` 메서드의 세 번째와 네 번째 인수로 전달할 수 있습니다:

```php
return to_route('users.show', ['user' => 1], 302, ['X-Framework' => 'Laravel']);
```


#### `uri()` {#method-uri}

`uri` 함수는 주어진 URI에 대해 [유연한 URI 인스턴스](#uri)를 생성합니다:

```php
$uri = uri('https://example.com')
    ->withPath('/users')
    ->withQuery(['page' => 1])
```

만약 `uri` 함수에 콜러블 컨트롤러와 메서드 쌍이 담긴 배열을 전달하면, 해당 컨트롤러 메서드의 라우트 경로에 대한 `Uri` 인스턴스를 생성합니다:

```php
use App\Http\Controllers\UserController;

$uri = uri([UserController::class, 'show'], ['user' => $user])
```

컨트롤러가 인보커블(호출 가능한)이라면, 컨트롤러 클래스 이름만 전달해도 됩니다:

```php
use App\Http\Controllers\UserIndexController;

$uri = uri(UserIndexController::class);
```

`uri` 함수에 전달된 값이 [이름이 지정된 라우트](/laravel/12.x/routing#named-routes)의 이름과 일치하면, 해당 라우트 경로에 대한 `Uri` 인스턴스가 생성됩니다:

```php
$uri = uri('users.show', ['user' => $user]);
```


#### `url()` {#method-url}

`url` 함수는 주어진 경로에 대한 완전한 URL을 생성합니다:

```php
$url = url('user/profile');

$url = url('user/profile', [1]);
```

만약 경로를 지정하지 않으면, `Illuminate\Routing\UrlGenerator` 인스턴스가 반환됩니다:

```php
$current = url()->current();

$full = url()->full();

$previous = url()->previous();
```


## 기타 {#miscellaneous}


#### `abort()` {#method-abort}

`abort` 함수는 [HTTP 예외](/laravel/12.x/errors#http-exceptions)를 발생시키며, 이는 [예외 핸들러](/laravel/12.x/errors#handling-exceptions)에 의해 렌더링됩니다:

```php
abort(403);
```

예외의 메시지와 브라우저로 전송할 커스텀 HTTP 응답 헤더도 함께 지정할 수 있습니다:

```php
abort(403, 'Unauthorized.', $headers);
```


#### `abort_if()` {#method-abort-if}

`abort_if` 함수는 주어진 불리언 표현식이 `true`로 평가될 경우 HTTP 예외를 발생시킵니다:

```php
abort_if(! Auth::user()->isAdmin(), 403);
```

`abort` 메서드와 마찬가지로, 이 함수의 세 번째 인자로 예외의 응답 텍스트를, 네 번째 인자로 커스텀 응답 헤더의 배열을 전달할 수 있습니다.


#### `abort_unless()` {#method-abort-unless}

`abort_unless` 함수는 주어진 불리언 표현식이 `false`로 평가될 경우 HTTP 예외를 발생시킵니다:

```php
abort_unless(Auth::user()->isAdmin(), 403);
```

`abort` 메서드와 마찬가지로, 이 함수의 세 번째 인자로 예외의 응답 텍스트를, 네 번째 인자로 커스텀 응답 헤더의 배열을 전달할 수 있습니다.


#### `app()` {#method-app}

`app` 함수는 [서비스 컨테이너](/laravel/12.x/container) 인스턴스를 반환합니다:

```php
$container = app();
```

클래스명이나 인터페이스명을 전달하여 컨테이너에서 해당 인스턴스를 바로 꺼낼 수도 있습니다:

```php
$api = app('HelpSpot\API');
```


#### `auth()` {#method-auth}

`auth` 함수는 [인증자](/laravel/12.x/authentication) 인스턴스를 반환합니다. 이 함수는 `Auth` 파사드의 대안으로 사용할 수 있습니다:

```php
$user = auth()->user();
```

필요하다면, 접근하고자 하는 가드 인스턴스를 지정할 수도 있습니다:

```php
$user = auth('admin')->user();
```


#### `back()` {#method-back}

`back` 함수는 사용자의 이전 위치로 [리디렉션 HTTP 응답](/laravel/12.x/responses#redirects)을 생성합니다:

```php
return back($status = 302, $headers = [], $fallback = '/');

return back();
```


#### `bcrypt()` {#method-bcrypt}

`bcrypt` 함수는 주어진 값을 Bcrypt를 사용하여 [해싱](/laravel/12.x/hashing)합니다. 이 함수는 `Hash` 파사드의 대안으로 사용할 수 있습니다:

```php
$password = bcrypt('my-secret-password');
```


#### `blank()` {#method-blank}

`blank` 함수는 주어진 값이 "비어있는지"를 판단합니다:

```php
blank('');
blank('   ');
blank(null);
blank(collect());

// true

blank(0);
blank(true);
blank(false);

// false
```

`blank`의 반대 동작을 원한다면 [filled](#method-filled) 메서드를 참고하세요.


#### `broadcast()` {#method-broadcast}

`broadcast` 함수는 주어진 [이벤트](/laravel/12.x/events)를 해당 [리스너](/laravel/12.x/broadcasting)에게 브로드캐스트(전파)합니다:

```php
broadcast(new UserRegistered($user));

broadcast(new UserRegistered($user))->toOthers();
```


#### `cache()` {#method-cache}

`cache` 함수는 [캐시](/laravel/12.x/cache)에서 값을 가져올 때 사용할 수 있습니다. 만약 주어진 키가 캐시에 존재하지 않으면, 선택적으로 기본값을 반환합니다:

```php
$value = cache('key');

$value = cache('key', 'default');
```

키/값 쌍의 배열을 함수에 전달하여 캐시에 항목을 추가할 수도 있습니다. 이때, 캐시된 값이 유효하다고 간주될 초(seconds) 단위의 시간이나 기간(duration)도 함께 전달해야 합니다:

```php
cache(['key' => 'value'], 300);

cache(['key' => 'value'], now()->addSeconds(10));
```


#### `class_uses_recursive()` {#method-class-uses-recursive}

`class_uses_recursive` 함수는 클래스에서 사용된 모든 트레이트를 반환합니다. 이때, 해당 클래스의 모든 부모 클래스에서 사용된 트레이트도 포함됩니다.

```php
$traits = class_uses_recursive(App\Models\User::class);
```


#### `collect()` {#method-collect}

`collect` 함수는 주어진 값을 기반으로 [컬렉션](/laravel/12.x/collections) 인스턴스를 생성합니다:

```php
$collection = collect(['Taylor', 'Abigail']);
```


#### `config()` {#method-config}

`config` 함수는 [설정](/laravel/12.x/configuration) 변수의 값을 가져옵니다. 설정 값은 "점(dot) 표기법"을 사용하여 접근할 수 있으며, 여기에는 파일 이름과 접근하려는 옵션이 포함됩니다. 만약 해당 설정 옵션이 존재하지 않을 경우 반환할 기본값을 지정할 수 있습니다:

```php
$value = config('app.timezone');

$value = config('app.timezone', $default);
```

실행 중에 키/값 쌍의 배열을 전달하여 설정 변수를 지정할 수도 있습니다. 하지만 이 함수는 현재 요청에 대해서만 설정 값을 변경하며, 실제 설정 파일의 값이 변경되지는 않는다는 점에 유의하세요:

```php
config(['app.debug' => true]);
```


#### `context()` {#method-context}

`context` 함수는 [현재 컨텍스트](/laravel/12.x/context)에서 값을 가져옵니다. 만약 해당 컨텍스트 키가 존재하지 않으면, 기본값을 지정하여 반환할 수 있습니다:

```php
$value = context('trace_id');

$value = context('trace_id', $default);
```

배열 형태의 키/값 쌍을 전달하여 컨텍스트 값을 설정할 수도 있습니다:

```php
use Illuminate\Support\Str;

context(['trace_id' => Str::uuid()->toString()]);
```


#### `cookie()` {#method-cookie}

`cookie` 함수는 새로운 [쿠키](/laravel/12.x/requests#cookies) 인스턴스를 생성합니다:

```php
$cookie = cookie('name', 'value', $minutes);
```


#### `csrf_field()` {#method-csrf-field}

`csrf_field` 함수는 CSRF 토큰 값을 담고 있는 HTML `hidden` 입력 필드를 생성합니다. 예를 들어, [Blade 문법](/laravel/12.x/blade)를 사용할 때는 다음과 같이 작성할 수 있습니다.

```blade
{{ csrf_field() }}
```


#### `csrf_token()` {#method-csrf-token}

`csrf_token` 함수는 현재 CSRF 토큰의 값을 반환합니다:

```php
$token = csrf_token();
```


#### `decrypt()` {#method-decrypt}

`decrypt` 함수는 주어진 값을 [복호화](/laravel/12.x/encryption)합니다. 이 함수는 `Crypt` 파사드의 대안으로 사용할 수 있습니다:

```php
$password = decrypt($value);
```


#### `dd()` {#method-dd}

`dd` 함수는 전달된 변수를 출력(dump)하고 스크립트 실행을 종료합니다:

```php
dd($value);

dd($value1, $value2, $value3, ...);
```

만약 스크립트 실행을 중단하지 않고 변수를 출력하고 싶다면, 대신 [dump](#method-dump) 함수를 사용하세요.


#### `dispatch()` {#method-dispatch}

`dispatch` 함수는 주어진 [작업(job)](/laravel/12.x/queues#creating-jobs)을 Laravel [작업 큐(job queue)](/laravel/12.x/queues)에 추가합니다:

```php
dispatch(new App\Jobs\SendEmails);
```


#### `dispatch_sync()` {#method-dispatch-sync}

`dispatch_sync` 함수는 주어진 작업(Job)을 [sync](/laravel/12.x/queues#synchronous-dispatching) 큐에 바로 넣어 즉시 처리되도록 합니다:

```php
dispatch_sync(new App\Jobs\SendEmails);
```


#### `dump()` {#method-dump}

`dump` 함수는 전달된 변수를 출력합니다:

```php
dump($value);

dump($value1, $value2, $value3, ...);
```

변수를 출력한 후 스크립트 실행을 중단하고 싶다면, 대신 [dd](#method-dd) 함수를 사용하세요.


#### `encrypt()` {#method-encrypt}

`encrypt` 함수는 주어진 값을 [암호화](/laravel/12.x/encryption)합니다. 이 함수는 `Crypt` 파사드의 대안으로 사용할 수 있습니다:

```php
$secret = encrypt('my-secret-value');
```


#### `env()` {#method-env}

`env` 함수는 [환경 변수](/laravel/12.x/configuration#environment-configuration)의 값을 가져오거나, 기본값을 반환합니다:

```php
$env = env('APP_ENV');

$env = env('APP_ENV', 'production');
```

> [!WARNING]
> 배포 과정에서 `config:cache` 명령어를 실행하는 경우, 반드시 설정 파일 내에서만 `env` 함수를 호출해야 합니다. 설정이 캐시되면 `.env` 파일이 더 이상 로드되지 않으며, 이때 `env` 함수는 항상 `null`을 반환합니다.


#### `event()` {#method-event}

`event` 함수는 주어진 [이벤트](/laravel/12.x/events)를 해당 리스너들에게 디스패치(전달)합니다:

```php
event(new UserRegistered($user));
```


#### `fake()` {#method-fake}

`fake` 함수는 컨테이너에서 [Faker](https://github.com/FakerPHP/Faker) 싱글턴을 반환합니다. 이 함수는 모델 팩토리, 데이터베이스 시딩, 테스트, 프로토타입 뷰 등에서 가짜 데이터를 생성할 때 유용하게 사용할 수 있습니다.

```blade
@for($i = 0; $i < 10; $i++)
    <dl>
        <dt>이름</dt>
        <dd>{{ fake()->name() }}</dd>

        <dt>이메일</dt>
        <dd>{{ fake()->unique()->safeEmail() }}</dd>
    </dl>
@endfor
```

기본적으로 `fake` 함수는 `config/app.php` 설정 파일의 `app.faker_locale` 옵션을 사용합니다. 이 설정 옵션은 일반적으로 `APP_FAKER_LOCALE` 환경 변수를 통해 지정됩니다. 또한, `fake` 함수에 로케일을 직접 전달하여 사용할 수도 있습니다. 각 로케일마다 별도의 싱글턴이 생성됩니다.

```php
fake('nl_NL')->name()
```


#### `filled()` {#method-filled}

`filled` 함수는 주어진 값이 "비어있지 않은지"를 확인합니다.

```php
filled(0);
filled(true);
filled(false);

// true

filled('');
filled('   ');
filled(null);
filled(collect());

// false
```

`filled`의 반대 동작을 원한다면 [blank](#method-blank) 메서드를 참고하세요.


#### `info()` {#method-info}

`info` 함수는 애플리케이션의 [로그](/laravel/12.x/logging)에 정보를 기록합니다:

```php
info('Some helpful information!');
```

컨텍스트 데이터 배열도 함수에 전달할 수 있습니다:

```php
info('User login attempt failed.', ['id' => $user->id]);
```


#### `literal()` {#method-literal}

`literal` 함수는 주어진 이름이 지정된 인자들을 속성으로 갖는 새로운 [stdClass](https://www.php.net/manual/en/class.stdclass.php) 인스턴스를 생성합니다:

```php
$obj = literal(
    name: 'Joe',
    languages: ['PHP', 'Ruby'],
);

$obj->name; // 'Joe'
$obj->languages; // ['PHP', 'Ruby']
```


#### `logger()` {#method-logger}

`logger` 함수는 [로그](/laravel/12.x/logging)에 `debug` 레벨의 메시지를 기록할 때 사용할 수 있습니다:

```php
logger('Debug message');
```

함수에 컨텍스트 데이터의 배열도 함께 전달할 수 있습니다:

```php
logger('User has logged in.', ['id' => $user->id]);
```

만약 함수에 아무 값도 전달하지 않으면, [logger](/laravel/12.x/logging) 인스턴스가 반환됩니다:

```php
logger()->error('You are not allowed here.');
```


#### `method_field()` {#method-method-field}

`method_field` 함수는 폼의 HTTP 메서드 값을 위조(spoof)하여 담고 있는 HTML `hidden` 입력 필드를 생성합니다. 예를 들어, [Blade 문법](/laravel/12.x/blade)를 사용하면 다음과 같이 작성할 수 있습니다:

```blade
<form method="POST">
    {{ method_field('DELETE') }}
</form>
```


#### `now()` {#method-now}

`now` 함수는 현재 시간을 기준으로 새로운 `Illuminate\Support\Carbon` 인스턴스를 생성합니다:

```php
$now = now();
```


#### `old()` {#method-old}

`old` 함수는 [세션에 플래시된](/laravel/12.x/requests#retrieving-input) [이전 입력값](/laravel/12.x/requests#old-input)을 가져옵니다:

```php
$value = old('value');

$value = old('value', 'default');
```

`old` 함수의 두 번째 인자로 제공되는 "기본값"은 종종 Eloquent 모델의 속성인 경우가 많기 때문에, Laravel에서는 전체 Eloquent 모델을 두 번째 인자로 바로 전달할 수 있습니다. 이 경우, Laravel은 `old` 함수의 첫 번째 인자를 Eloquent 속성의 이름으로 간주하여 해당 속성값을 "기본값"으로 사용합니다:

```blade
{{ old('name', $user->name) }}

// 아래와 동일합니다...

{{ old('name', $user) }}
```


#### `once()` {#method-once}

`once` 함수는 주어진 콜백을 실행하고, 그 결과를 요청이 진행되는 동안 메모리에 캐시합니다. 동일한 콜백으로 `once` 함수를 여러 번 호출하면, 이전에 캐시된 결과를 반환합니다:

```php
function random(): int
{
    return once(function () {
        return random_int(1, 1000);
    });
}

random(); // 123
random(); // 123 (캐시된 결과)
random(); // 123 (캐시된 결과)
```

`once` 함수가 객체 인스턴스 내에서 실행될 경우, 캐시된 결과는 해당 객체 인스턴스에만 고유하게 적용됩니다:

```php
<?php

class NumberService
{
    public function all(): array
    {
        return once(fn () => [1, 2, 3]);
    }
}

$service = new NumberService;

$service->all();
$service->all(); // (캐시된 결과)

$secondService = new NumberService;

$secondService->all();
$secondService->all(); // (캐시된 결과)
```

#### `optional()` {#method-optional}

`optional` 함수는 어떤 인자든 받아서 해당 객체의 프로퍼티에 접근하거나 메서드를 호출할 수 있게 해줍니다. 만약 전달된 객체가 `null`이라면, 프로퍼티나 메서드는 에러를 발생시키는 대신 `null`을 반환합니다:

```php
return optional($user->address)->street;

{!! old('name', optional($user)->name) !!}
```

`optional` 함수는 두 번째 인자로 클로저도 받을 수 있습니다. 첫 번째 인자로 전달된 값이 null이 아닐 경우, 이 클로저가 실행됩니다:

```php
return optional(User::find($id), function (User $user) {
    return $user->name;
});
```


#### `policy()` {#method-policy}

`policy` 메서드는 주어진 클래스에 대한 [정책(Policy)](/laravel/12.x/authorization#creating-policies) 인스턴스를 반환합니다:

```php
$policy = policy(App\Models\User::class);
```


#### `redirect()` {#method-redirect}

`redirect` 함수는 [리디렉션 HTTP 응답](/laravel/12.x/responses#redirects)를 반환하거나, 인자가 없이 호출될 경우 리디렉터 인스턴스를 반환합니다:

```php
return redirect($to = null, $status = 302, $headers = [], $https = null);

return redirect('/home');

return redirect()->route('route.name');
```


#### `report()` {#method-report}

`report` 함수는 [예외 핸들러](/laravel/12.x/errors#handling-exceptions)를 사용하여 예외를 보고합니다:

```php
report($e);
```

`report` 함수는 문자열도 인자로 받을 수 있습니다. 문자열이 전달되면, 해당 문자열을 메시지로 하는 예외가 생성되어 보고됩니다:

```php
report('Something went wrong.');
```


#### `report_if()` {#method-report-if}

`report_if` 함수는 주어진 조건이 `true`일 때 [예외 핸들러](/laravel/12.x/errors#handling-exceptions)를 사용하여 예외를 보고합니다:

```php
report_if($shouldReport, $e);

report_if($shouldReport, '문제가 발생했습니다.');
```


#### `report_unless()` {#method-report-unless}

`report_unless` 함수는 주어진 조건이 `false`일 때 [예외 핸들러](/laravel/12.x/errors#handling-exceptions)를 사용하여 예외를 보고합니다:

```php
report_unless($reportingDisabled, $e);

report_unless($reportingDisabled, '문제가 발생했습니다.');
```


#### `request()` {#method-request}

`request` 함수는 현재 [request](/laravel/12.x/requests) 인스턴스를 반환하거나, 현재 요청에서 입력 필드의 값을 가져옵니다:

```php
$request = request();

$value = request('key', $default);
```


#### `rescue()` {#method-rescue}

`rescue` 함수는 주어진 클로저를 실행하고, 실행 중 발생하는 모든 예외를 포착합니다. 포착된 모든 예외는 [예외 핸들러](/laravel/12.x/errors#handling-exceptions)로 전달되지만, 요청 처리는 계속 진행됩니다.

```php
return rescue(function () {
    return $this->method();
});
```

또한 `rescue` 함수에 두 번째 인자를 전달할 수 있습니다. 이 인자는 클로저 실행 중 예외가 발생했을 때 반환할 "기본값"이 됩니다.

```php
return rescue(function () {
    return $this->method();
}, false);

return rescue(function () {
    return $this->method();
}, function () {
    return $this->failure();
});
```

`rescue` 함수에는 예외가 `report` 함수로 보고되어야 하는지 결정하는 `report` 인자를 전달할 수도 있습니다.

```php
return rescue(function () {
    return $this->method();
}, report: function (Throwable $throwable) {
    return $throwable instanceof InvalidArgumentException;
});
```


#### `resolve()` {#method-resolve}

`resolve` 함수는 [서비스 컨테이너](/laravel/12.x/container)를 사용하여 주어진 클래스 또는 인터페이스 이름을 인스턴스로 변환합니다:

```php
$api = resolve('HelpSpot\API');
```


#### `response()` {#method-response}

`response` 함수는 [response](/laravel/12.x/responses) 인스턴스를 생성하거나, response 팩토리의 인스턴스를 반환합니다:

```php
return response('Hello World', 200, $headers);

return response()->json(['foo' => 'bar'], 200, $headers);
```


#### `retry()` {#method-retry}

`retry` 함수는 주어진 콜백을 최대 시도 횟수만큼 실행하려고 시도합니다. 콜백이 예외를 발생시키지 않으면, 그 반환값이 반환됩니다. 콜백이 예외를 발생시키면 자동으로 재시도됩니다. 최대 시도 횟수를 초과하면 예외가 발생합니다:

```php
return retry(5, function () {
    // 100ms씩 쉬면서 최대 5번 시도합니다...
}, 100);
```

시도 사이에 대기할 밀리초를 직접 계산하고 싶다면, `retry` 함수의 세 번째 인자로 클로저를 전달할 수 있습니다:

```php
use Exception;

return retry(5, function () {
    // ...
}, function (int $attempt, Exception $exception) {
    return $attempt * 100;
});
```

편의를 위해, `retry` 함수의 첫 번째 인자로 배열을 전달할 수도 있습니다. 이 배열은 각 시도 사이에 대기할 밀리초를 결정하는 데 사용됩니다:

```php
return retry([100, 200], function () {
    // 첫 번째 재시도 시 100ms, 두 번째 재시도 시 200ms 대기...
});
```

특정 조건에서만 재시도하고 싶다면, `retry` 함수의 네 번째 인자로 클로저를 전달할 수 있습니다:

```php
use App\Exceptions\TemporaryException;
use Exception;

return retry(5, function () {
    // ...
}, 100, function (Exception $exception) {
    return $exception instanceof TemporaryException;
});
```


#### `session()` {#method-session}

`session` 함수는 [세션](/laravel/12.x/session) 값을 가져오거나 설정할 때 사용할 수 있습니다:

```php
$value = session('key');
```

배열 형태의 키/값 쌍을 함수에 전달하여 값을 설정할 수도 있습니다:

```php
session(['chairs' => 7, 'instruments' => 3]);
```

함수에 값을 전달하지 않으면 세션 저장소 인스턴스가 반환됩니다:

```php
$value = session()->get('key');

session()->put('key', $value);
```


#### `tap()` {#method-tap}

`tap` 함수는 두 개의 인자를 받습니다: 임의의 `$value`와 클로저입니다. `$value`는 클로저에 전달된 후, `tap` 함수에 의해 반환됩니다. 클로저의 반환값은 중요하지 않습니다:

```php
$user = tap(User::first(), function (User $user) {
    $user->name = 'Taylor';

    $user->save();
});
```

만약 `tap` 함수에 클로저를 전달하지 않으면, 주어진 `$value`에 대해 어떤 메서드든 호출할 수 있습니다. 이때 호출한 메서드의 실제 반환값과 상관없이 항상 `$value`가 반환됩니다. 예를 들어, Eloquent의 `update` 메서드는 일반적으로 정수를 반환하지만, `tap` 함수를 통해 `update`를 체이닝하면 모델 자체를 반환하도록 강제할 수 있습니다:

```php
$user = tap($user)->update([
    'name' => $name,
    'email' => $email,
]);
```

클래스에 `tap` 메서드를 추가하고 싶다면, 해당 클래스에 `Illuminate\Support\Traits\Tappable` 트레이트를 추가하면 됩니다. 이 트레이트의 `tap` 메서드는 오직 하나의 인자(클로저)만 받으며, 객체 인스턴스 자체가 클로저에 전달된 후 다시 반환됩니다:

```php
return $user->tap(function (User $user) {
    // ...
});
```


#### `throw_if()` {#method-throw-if}

`throw_if` 함수는 주어진 불리언 표현식이 `true`로 평가될 경우, 지정한 예외를 발생시킵니다:

```php
throw_if(! Auth::user()->isAdmin(), AuthorizationException::class);

throw_if(
    ! Auth::user()->isAdmin(),
    AuthorizationException::class,
    'You are not allowed to access this page.'
);
```


#### `throw_unless()` {#method-throw-unless}

`throw_unless` 함수는 주어진 불리언 표현식이 `false`로 평가될 경우, 지정된 예외를 발생시킵니다:

```php
throw_unless(Auth::user()->isAdmin(), AuthorizationException::class);

throw_unless(
    Auth::user()->isAdmin(),
    AuthorizationException::class,
    'You are not allowed to access this page.'
);
```


#### `today()` {#method-today}

`today` 함수는 현재 날짜에 대한 새로운 `Illuminate\Support\Carbon` 인스턴스를 생성합니다:

```php
$today = today();
```


#### `trait_uses_recursive()` {#method-trait-uses-recursive}

`trait_uses_recursive` 함수는 특정 트레이트가 사용하는 모든 트레이트를 반환합니다:

```php
$traits = trait_uses_recursive(\Illuminate\Notifications\Notifiable::class);
```


#### `transform()` {#method-transform}

`transform` 함수는 주어진 값이 [blank](#method-blank)가 아닐 때, 해당 값에 클로저를 실행하고 그 반환값을 반환합니다:

```php
$callback = function (int $value) {
    return $value * 2;
};

$result = transform(5, $callback);

// 10
```

함수의 세 번째 인자로 기본값이나 클로저를 전달할 수 있습니다. 주어진 값이 blank일 경우 이 값이 반환됩니다:

```php
$result = transform(null, $callback, '값이 비어 있습니다');

// 값이 비어 있습니다
```


#### `validator()` {#method-validator}

`validator` 함수는 주어진 인자를 사용하여 새로운 [validator](/laravel/12.x/validation) 인스턴스를 생성합니다. 이 함수는 `Validator` 파사드의 대안으로 사용할 수 있습니다:

```php
$validator = validator($data, $rules, $messages);
```


#### `value()` {#method-value}

`value` 함수는 전달된 값을 그대로 반환합니다. 하지만, 만약 클로저(Closure)를 전달하면 해당 클로저가 실행되고, 그 반환값이 반환됩니다:

```php
$result = value(true);

// true

$result = value(function () {
    return false;
});

// false
```

추가 인자를 `value` 함수에 전달할 수도 있습니다. 만약 첫 번째 인자가 클로저라면, 추가 인자들이 클로저의 인수로 전달됩니다. 그렇지 않으면 추가 인자들은 무시됩니다:

```php
$result = value(function (string $name) {
    return $name;
}, 'Taylor');

// 'Taylor'
```


#### `view()` {#method-view}

`view` 함수는 [뷰](/laravel/12.x/views) 인스턴스를 반환합니다:

```php
return view('auth.login');
```


#### `with()` {#method-with}

`with` 함수는 전달된 값을 그대로 반환합니다. 만약 두 번째 인자로 클로저(익명 함수)가 전달되면, 해당 클로저가 실행되고 그 반환값이 반환됩니다:

```php
$callback = function (mixed $value) {
    return is_numeric($value) ? $value * 2 : 0;
};

$result = with(5, $callback);

// 10

$result = with(null, $callback);

// 0

$result = with(5, null);

// 5
```


#### `when()` {#method-when}

`when` 함수는 주어진 조건이 `true`로 평가될 때, 전달된 값을 반환합니다. 조건이 `false`일 경우에는 `null`을 반환합니다. 만약 두 번째 인자로 클로저(익명 함수)를 전달하면, 해당 클로저가 실행되어 그 반환값이 반환됩니다:

```php
$value = when(true, 'Hello World');

$value = when(true, fn () => 'Hello World');
```

`when` 함수는 주로 HTML 속성을 조건부로 렌더링할 때 유용하게 사용됩니다:

```blade
<div {!! when($condition, 'wire:poll="calculate"') !!}>
    ...
</div>
```


## 기타 유틸리티 {#other-utilities}


### 벤치마킹 {#benchmarking}

때때로 애플리케이션의 특정 부분의 성능을 빠르게 테스트하고 싶을 때가 있습니다. 이런 경우, `Benchmark` 지원 클래스를 사용하여 주어진 콜백이 완료되는 데 걸리는 밀리초(ms) 시간을 측정할 수 있습니다.

```php
<?php

use App\Models\User;
use Illuminate\Support\Benchmark;

Benchmark::dd(fn () => User::find(1)); // 0.1 ms

Benchmark::dd([
    '시나리오 1' => fn () => User::count(), // 0.5 ms
    '시나리오 2' => fn () => User::all()->count(), // 20.0 ms
]);
```

기본적으로, 주어진 콜백은 한 번(1회 반복) 실행되며, 실행 시간은 브라우저 또는 콘솔에 표시됩니다.

콜백을 여러 번 실행하고 싶다면, 두 번째 인자로 반복 횟수를 지정할 수 있습니다. 콜백을 여러 번 실행할 경우, `Benchmark` 클래스는 모든 반복에서 콜백을 실행하는 데 걸린 평균 밀리초(ms) 시간을 반환합니다.

```php
Benchmark::dd(fn () => User::count(), iterations: 10); // 0.5 ms
```

때로는 콜백의 실행 시간을 벤치마킹하면서, 콜백이 반환하는 값도 함께 얻고 싶을 수 있습니다. `value` 메서드는 콜백이 반환한 값과 콜백 실행에 걸린 밀리초(ms) 시간을 튜플로 반환합니다.

```php
[$count, $duration] = Benchmark::value(fn () => User::count());
```


### 날짜 {#dates}

Laravel은 강력한 날짜 및 시간 조작 라이브러리인 [Carbon](https://carbon.nesbot.com/docs/)을 포함하고 있습니다. 새로운 `Carbon` 인스턴스를 생성하려면 `now` 함수를 사용할 수 있습니다. 이 함수는 Laravel 애플리케이션 내에서 전역적으로 사용할 수 있습니다:

```php
$now = now();
```

또는, `Illuminate\Support\Carbon` 클래스를 사용하여 새로운 `Carbon` 인스턴스를 생성할 수도 있습니다:

```php
use Illuminate\Support\Carbon;

$now = Carbon::now();
```

Carbon과 그 기능에 대한 자세한 내용은 [공식 Carbon 문서](https://carbon.nesbot.com/docs/)를 참고하세요.


### 지연 함수 {#deferred-functions}

Laravel의 [큐 작업](/laravel/12.x/queues)은 작업을 백그라운드에서 처리하도록 큐에 넣을 수 있게 해주지만, 때로는 복잡한 큐 워커를 설정하거나 유지하지 않고도 간단한 작업을 지연시키고 싶을 때가 있습니다.

지연 함수(Deferred functions)는 클로저의 실행을 HTTP 응답이 사용자에게 전송된 이후로 미룰 수 있게 해주어, 애플리케이션이 빠르고 반응성 있게 느껴지도록 도와줍니다. 클로저의 실행을 지연시키려면, 해당 클로저를 `Illuminate\Support\defer` 함수에 전달하면 됩니다:

```php
use App\Services\Metrics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use function Illuminate\Support\defer;

Route::post('/orders', function (Request $request) {
    // 주문 생성...

    defer(fn () => Metrics::reportOrder($order));

    return $order;
});
```

기본적으로, 지연 함수는 `Illuminate\Support\defer`가 호출된 HTTP 응답, Artisan 명령어, 또는 큐 작업이 정상적으로 완료된 경우에만 실행됩니다. 즉, 요청이 `4xx` 또는 `5xx` HTTP 응답을 반환하는 경우에는 지연 함수가 실행되지 않습니다. 만약 지연 함수가 항상 실행되길 원한다면, `always` 메서드를 체이닝하여 사용할 수 있습니다:

```php
defer(fn () => Metrics::reportOrder($order))->always();
```


#### 연기된 함수 취소하기 {#cancelling-deferred-functions}

연기된 함수가 실행되기 전에 취소해야 하는 경우, `forget` 메서드를 사용하여 함수 이름으로 해당 함수를 취소할 수 있습니다. 연기된 함수에 이름을 지정하려면 `Illuminate\Support\defer` 함수의 두 번째 인자로 이름을 전달하면 됩니다:

```php
defer(fn () => Metrics::report(), 'reportMetrics');

defer()->forget('reportMetrics');
```


#### 테스트에서 지연 함수 비활성화 {#disabling-deferred-functions-in-tests}

테스트를 작성할 때, 지연(Deferred) 함수를 비활성화하는 것이 유용할 수 있습니다. 테스트 내에서 `withoutDefer`를 호출하면 Laravel이 모든 지연 함수를 즉시 실행하도록 할 수 있습니다:
::: code-group
```php [Pest]
test('without defer', function () {
    $this->withoutDefer();

    // ...
});
```

```php [PHPUnit]
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_without_defer(): void
    {
        $this->withoutDefer();

        // ...
    }
}
```
:::
테스트 케이스 내의 모든 테스트에서 지연 함수를 비활성화하고 싶다면, 기본 `TestCase` 클래스의 `setUp` 메서드에서 `withoutDefer` 메서드를 호출하면 됩니다:

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutDefer();
    }
}
```


### Lottery {#lottery}

Laravel의 Lottery 클래스는 주어진 확률에 따라 콜백을 실행하는 데 사용할 수 있습니다. 이는 들어오는 요청 중 일부에만 코드를 실행하고 싶을 때 특히 유용합니다.

```php
use Illuminate\Support\Lottery;

Lottery::odds(1, 20)
    ->winner(fn () => $user->won())
    ->loser(fn () => $user->lost())
    ->choose();
```

Laravel의 Lottery 클래스는 다른 Laravel 기능과 결합하여 사용할 수 있습니다. 예를 들어, 느린 쿼리 중 일부만 예외 핸들러에 보고하고 싶을 수 있습니다. Lottery 클래스는 호출 가능한(callable) 객체이기 때문에, 호출 가능한 인자를 받는 어떤 메서드에도 인스턴스를 전달할 수 있습니다.

```php
use Carbon\CarbonInterval;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Lottery;

DB::whenQueryingForLongerThan(
    CarbonInterval::seconds(2),
    Lottery::odds(1, 100)->winner(fn () => report('Querying > 2 seconds.')),
);
```


#### 로터리 테스트 {#testing-lotteries}

Laravel은 애플리케이션의 로터리 호출을 쉽게 테스트할 수 있도록 간단한 메서드를 제공합니다:

```php
// 로터리가 항상 당첨됩니다...
Lottery::alwaysWin();

// 로터리가 항상 꽝이 됩니다...
Lottery::alwaysLose();

// 로터리가 한 번은 당첨, 그 다음은 꽝, 그리고 다시 정상 동작으로 돌아갑니다...
Lottery::fix([true, false]);

// 로터리가 정상 동작으로 돌아갑니다...
Lottery::determineResultsNormally();
```


### 파이프라인 {#pipeline}

Laravel의 `Pipeline` 파사드는 주어진 입력값을 일련의 호출 가능한 클래스, 클로저, 또는 콜러블을 통해 "파이프" 방식으로 전달할 수 있는 편리한 방법을 제공합니다. 각 클래스는 입력값을 검사하거나 수정할 기회를 가지며, 파이프라인의 다음 콜러블을 호출할 수 있습니다.

```php
use Closure;
use App\Models\User;
use Illuminate\Support\Facades\Pipeline;

$user = Pipeline::send($user)
    ->through([
        function (User $user, Closure $next) {
            // ...

            return $next($user);
        },
        function (User $user, Closure $next) {
            // ...

            return $next($user);
        },
    ])
    ->then(fn (User $user) => $user);
```

보시다시피, 파이프라인의 각 호출 가능한 클래스나 클로저에는 입력값과 `$next` 클로저가 전달됩니다. `$next` 클로저를 호출하면 파이프라인의 다음 콜러블이 실행됩니다. 이 방식은 [미들웨어](/laravel/12.x/middleware)와 매우 유사합니다.

파이프라인의 마지막 콜러블이 `$next` 클로저를 호출하면, `then` 메서드에 전달된 콜러블이 실행됩니다. 일반적으로 이 콜러블은 단순히 주어진 입력값을 반환합니다.

물론, 앞서 설명한 것처럼 파이프라인에 클로저만 제공할 필요는 없습니다. 호출 가능한 클래스를 제공할 수도 있습니다. 클래스 이름을 제공하면, 해당 클래스는 Laravel의 [서비스 컨테이너](/laravel/12.x/container)를 통해 인스턴스화되며, 의존성 주입도 가능합니다.

```php
$user = Pipeline::send($user)
    ->through([
        GenerateProfilePhoto::class,
        ActivateSubscription::class,
        SendWelcomeEmail::class,
    ])
    ->then(fn (User $user) => $user);
```


### Sleep {#sleep}

Laravel의 `Sleep` 클래스는 PHP의 기본 `sleep` 및 `usleep` 함수에 대한 경량 래퍼로, 더 나은 테스트 가능성과 개발자 친화적인 시간 제어 API를 제공합니다.

```php
use Illuminate\Support\Sleep;

$waiting = true;

while ($waiting) {
    Sleep::for(1)->second();

    $waiting = /* ... */;
}
```

`Sleep` 클래스는 다양한 시간 단위로 작업할 수 있는 여러 메서드를 제공합니다.

```php
// 일정 시간 대기 후 값을 반환합니다...
$result = Sleep::for(1)->second()->then(fn () => 1 + 1);

// 주어진 값이 true인 동안 대기합니다...
Sleep::for(1)->second()->while(fn () => shouldKeepSleeping());

// 90초 동안 실행을 일시 중지합니다...
Sleep::for(1.5)->minutes();

// 2초 동안 실행을 일시 중지합니다...
Sleep::for(2)->seconds();

// 500밀리초 동안 실행을 일시 중지합니다...
Sleep::for(500)->milliseconds();

// 5,000마이크로초 동안 실행을 일시 중지합니다...
Sleep::for(5000)->microseconds();

// 지정된 시간까지 실행을 일시 중지합니다...
Sleep::until(now()->addMinute());

// PHP의 기본 "sleep" 함수의 별칭입니다...
Sleep::sleep(2);

// PHP의 기본 "usleep" 함수의 별칭입니다...
Sleep::usleep(5000);
```

여러 시간 단위를 쉽게 조합하려면 `and` 메서드를 사용할 수 있습니다.

```php
Sleep::for(1)->second()->and(10)->milliseconds();
```


#### Sleep 테스트 {#testing-sleep}

`Sleep` 클래스나 PHP의 기본 sleep 함수를 사용하는 코드를 테스트할 때, 테스트 실행이 실제로 일시 중지됩니다. 예상할 수 있듯이, 이는 테스트 실행 속도를 크게 저하시킵니다. 예를 들어, 다음과 같은 코드를 테스트한다고 가정해봅시다:

```php
$waiting = /* ... */;

$seconds = 1;

while ($waiting) {
    Sleep::for($seconds++)->seconds();

    $waiting = /* ... */;
}
```

일반적으로 이 코드를 테스트하면 _최소_ 1초가 소요됩니다. 다행히도, `Sleep` 클래스는 "sleep"을 가짜로 처리할 수 있어 테스트 속도를 빠르게 유지할 수 있습니다:
::: code-group
```php [Pest]
it('waits until ready', function () {
    Sleep::fake();

    // ...
});
```

```php [PHPUnit]
public function test_it_waits_until_ready()
{
    Sleep::fake();

    // ...
}
```
:::
`Sleep` 클래스를 가짜로 처리하면 실제로 실행이 일시 중지되지 않아 테스트가 훨씬 빨라집니다.

`Sleep` 클래스를 가짜로 처리한 후에는, 실제로 "sleep"이 발생했어야 하는지에 대한 검증도 할 수 있습니다. 예를 들어, 실행이 세 번 일시 중지되고, 각 일시 중지마다 1초씩 증가하는 코드를 테스트한다고 가정해봅시다. `assertSequence` 메서드를 사용하면, 코드가 올바른 시간만큼 "sleep"했는지 빠르게 검증할 수 있습니다:
::: code-group
```php [Pest]
it('checks if ready three times', function () {
    Sleep::fake();

    // ...

    Sleep::assertSequence([
        Sleep::for(1)->second(),
        Sleep::for(2)->seconds(),
        Sleep::for(3)->seconds(),
    ]);
}
```

```php [PHPUnit]
public function test_it_checks_if_ready_three_times()
{
    Sleep::fake();

    // ...

    Sleep::assertSequence([
        Sleep::for(1)->second(),
        Sleep::for(2)->seconds(),
        Sleep::for(3)->seconds(),
    ]);
}
```
:::
물론, `Sleep` 클래스는 테스트 시 사용할 수 있는 다양한 검증 메서드를 제공합니다:

```php
use Carbon\CarbonInterval as Duration;
use Illuminate\Support\Sleep;

// sleep이 3번 호출되었는지 검증...
Sleep::assertSleptTimes(3);

// sleep의 지속 시간에 대해 검증...
Sleep::assertSlept(function (Duration $duration): bool {
    return /* ... */;
}, times: 1);

// Sleep 클래스가 한 번도 호출되지 않았는지 검증...
Sleep::assertNeverSlept();

// Sleep이 호출되었더라도 실제로 일시 중지가 발생하지 않았는지 검증...
Sleep::assertInsomniac();
```

가끔 애플리케이션 코드에서 가짜 sleep이 발생할 때마다 특정 동작을 수행하고 싶을 수 있습니다. 이를 위해 `whenFakingSleep` 메서드에 콜백을 전달할 수 있습니다. 아래 예시에서는 Laravel의 [시간 조작 헬퍼](/laravel/12.x/mocking#interacting-with-time)를 사용해 각 sleep의 지속 시간만큼 시간을 즉시 진행시킵니다:

```php
use Carbon\CarbonInterval as Duration;

$this->freezeTime();

Sleep::fake();

Sleep::whenFakingSleep(function (Duration $duration) {
    // 가짜 sleep 시 시간 진행...
    $this->travel($duration->totalMilliseconds)->milliseconds();
});
```

시간 진행이 자주 필요한 경우, `fake` 메서드에 `syncWithCarbon` 인자를 전달해 테스트 내에서 sleep이 발생할 때 Carbon과 시간을 동기화할 수 있습니다:

```php
Sleep::fake(syncWithCarbon: true);

$start = now();

Sleep::for(1)->second();

$start->diffForHumans(); // 1초 전
```

Laravel은 실행을 일시 중지할 때 내부적으로 항상 `Sleep` 클래스를 사용합니다. 예를 들어, [retry](#method-retry) 헬퍼는 sleep 시 `Sleep` 클래스를 사용하므로, 해당 헬퍼를 사용할 때도 테스트가 더 쉬워집니다.


### Timebox {#timebox}

Laravel의 `Timebox` 클래스는 주어진 콜백이 실제 실행이 더 빨리 끝나더라도 항상 고정된 시간만큼 실행되도록 보장합니다. 이는 암호화 작업이나 사용자 인증 검사와 같이, 공격자가 실행 시간의 변동을 이용해 민감한 정보를 추론할 수 있는 상황에서 특히 유용합니다.

만약 실행이 고정된 시간을 초과한다면, `Timebox`는 아무런 효과가 없습니다. 최악의 상황을 고려해 충분히 긴 시간을 고정 시간으로 선택하는 것은 개발자의 몫입니다.

`call` 메서드는 클로저와 마이크로초 단위의 시간 제한을 받아, 클로저를 실행한 뒤 시간 제한이 될 때까지 대기합니다:

```php
use Illuminate\Support\Timebox;

(new Timebox)->call(function ($timebox) {
    // ...
}, microseconds: 10000);
```

클로저 내부에서 예외가 발생하면, 이 클래스는 지정된 지연 시간을 지킨 후 예외를 다시 던집니다.


### URI {#uri}

Laravel의 `Uri` 클래스는 URI를 생성하고 조작할 수 있는 편리하고 유연한 인터페이스를 제공합니다. 이 클래스는 기본적으로 League URI 패키지의 기능을 감싸며, Laravel의 라우팅 시스템과도 매끄럽게 통합됩니다.

정적 메서드를 사용하여 손쉽게 `Uri` 인스턴스를 생성할 수 있습니다:

```php
use App\Http\Controllers\UserController;
use App\Http\Controllers\InvokableController;
use Illuminate\Support\Uri;

// 주어진 문자열로부터 URI 인스턴스 생성...
$uri = Uri::of('https://example.com/path');

// 경로, 네임드 라우트, 컨트롤러 액션 등으로 URI 인스턴스 생성...
$uri = Uri::to('/dashboard');
$uri = Uri::route('users.show', ['user' => 1]);
$uri = Uri::signedRoute('users.show', ['user' => 1]);
$uri = Uri::temporarySignedRoute('user.index', now()->addMinutes(5));
$uri = Uri::action([UserController::class, 'index']);
$uri = Uri::action(InvokableController::class);

// 현재 요청 URL로부터 URI 인스턴스 생성...
$uri = $request->uri();
```

URI 인스턴스를 얻은 후에는 다음과 같이 유연하게 수정할 수 있습니다:

```php
$uri = Uri::of('https://example.com')
    ->withScheme('http')
    ->withHost('test.com')
    ->withPort(8000)
    ->withPath('/users')
    ->withQuery(['page' => 2])
    ->withFragment('section-1');
```


#### URI 검사하기 {#inspecting-uris}

`Uri` 클래스는 기본 URI의 다양한 구성 요소를 쉽게 확인할 수 있도록 해줍니다:

```php
$scheme = $uri->scheme();
$host = $uri->host();
$port = $uri->port();
$path = $uri->path();
$segments = $uri->pathSegments();
$query = $uri->query();
$fragment = $uri->fragment();
```


#### 쿼리 문자열 조작하기 {#manipulating-query-strings}

`Uri` 클래스는 URI의 쿼리 문자열을 조작할 수 있는 여러 메서드를 제공합니다. `withQuery` 메서드는 기존 쿼리 문자열에 추가적인 쿼리 문자열 파라미터를 병합할 때 사용할 수 있습니다:

```php
$uri = $uri->withQuery(['sort' => 'name']);
```

`withQueryIfMissing` 메서드는 지정한 키가 쿼리 문자열에 이미 존재하지 않을 경우에만 추가적인 쿼리 문자열 파라미터를 병합할 때 사용할 수 있습니다:

```php
$uri = $uri->withQueryIfMissing(['page' => 1]);
```

`replaceQuery` 메서드는 기존 쿼리 문자열을 완전히 새로운 쿼리 문자열로 교체할 때 사용할 수 있습니다:

```php
$uri = $uri->replaceQuery(['page' => 1]);
```

`pushOntoQuery` 메서드는 배열 값을 가진 쿼리 문자열 파라미터에 추가적인 파라미터를 추가할 때 사용할 수 있습니다:

```php
$uri = $uri->pushOntoQuery('filter', ['active', 'pending']);
```

`withoutQuery` 메서드는 쿼리 문자열에서 특정 파라미터를 제거할 때 사용할 수 있습니다:

```php
$uri = $uri->withoutQuery(['page']);
```


#### URI로부터 응답 생성하기 {#generating-responses-from-uris}

`redirect` 메서드는 주어진 URI로의 `RedirectResponse` 인스턴스를 생성하는 데 사용할 수 있습니다:

```php
$uri = Uri::of('https://example.com');

return $uri->redirect();
```

또는, 라우트나 컨트롤러 액션에서 단순히 `Uri` 인스턴스를 반환할 수도 있습니다. 이 경우 반환된 URI로 자동으로 리다이렉트 응답이 생성됩니다:

```php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Uri;

Route::get('/redirect', function () {
    return Uri::to('/index')
        ->withQuery(['sort' => 'name']);
});
```
