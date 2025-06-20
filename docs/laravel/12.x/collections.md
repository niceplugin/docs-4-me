# 컬렉션













## 소개 {#introduction}

`Illuminate\Support\Collection` 클래스는 데이터 배열을 다루기 위한 유연하고 편리한 래퍼를 제공합니다. 예를 들어, 다음 코드를 확인해보세요. `collect` 헬퍼를 사용하여 배열로부터 새로운 컬렉션 인스턴스를 생성하고, 각 요소에 `strtoupper` 함수를 실행한 뒤, 모든 빈 요소를 제거합니다:

```php
$collection = collect(['Taylor', 'Abigail', null])->map(function (?string $name) {
    return strtoupper($name);
})->reject(function (string $name) {
    return empty($name);
});
```

보시다시피, `Collection` 클래스는 메서드 체이닝을 통해 기본 배열에 대해 유연한 매핑과 축소 작업을 수행할 수 있게 해줍니다. 일반적으로 컬렉션은 불변(immutable)이며, 모든 `Collection` 메서드는 완전히 새로운 `Collection` 인스턴스를 반환합니다.


### 컬렉션 생성하기 {#creating-collections}

위에서 언급한 것처럼, `collect` 헬퍼는 주어진 배열에 대해 새로운 `Illuminate\Support\Collection` 인스턴스를 반환합니다. 따라서 컬렉션을 생성하는 것은 다음과 같이 간단합니다:

```php
$collection = collect([1, 2, 3]);
```

또한 [make](#method-make) 및 [fromJson](#method-fromjson) 메서드를 사용하여 컬렉션을 생성할 수도 있습니다.

> [!NOTE]
> [Eloquent](/laravel/12.x/eloquent) 쿼리의 결과는 항상 `Collection` 인스턴스로 반환됩니다.


### 컬렉션 확장하기 {#extending-collections}

컬렉션은 "매크로(macroable)"이기 때문에 런타임에 `Collection` 클래스에 추가 메서드를 등록할 수 있습니다. `Illuminate\Support\Collection` 클래스의 `macro` 메서드는 매크로가 호출될 때 실행될 클로저를 인자로 받습니다. 매크로 클로저는 컬렉션 클래스의 실제 메서드처럼 `$this`를 통해 컬렉션의 다른 메서드에 접근할 수 있습니다. 예를 들어, 다음 코드는 `Collection` 클래스에 `toUpper` 메서드를 추가합니다:

```php
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

Collection::macro('toUpper', function () {
    return $this->map(function (string $value) {
        return Str::upper($value);
    });
});

$collection = collect(['first', 'second']);

$upper = $collection->toUpper();

// ['FIRST', 'SECOND']
```

일반적으로, 컬렉션 매크로는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 선언해야 합니다.


#### 매크로 인자 {#macro-arguments}

필요하다면, 추가 인자를 받는 매크로를 정의할 수도 있습니다:

```php
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Lang;

Collection::macro('toLocale', function (string $locale) {
    return $this->map(function (string $value) use ($locale) {
        return Lang::get($value, [], $locale);
    });
});

$collection = collect(['first', 'second']);

$translated = $collection->toLocale('es');
```


## 사용 가능한 메서드 {#available-methods}

이후의 컬렉션 문서 대부분에서는 `Collection` 클래스에서 사용할 수 있는 각 메서드에 대해 다룹니다. 이 모든 메서드는 기본 배열을 유연하게 조작하기 위해 체이닝할 수 있다는 점을 기억하세요. 또한, 거의 모든 메서드는 새로운 `Collection` 인스턴스를 반환하므로, 필요할 때 컬렉션의 원본을 보존할 수 있습니다:

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

<div class="collection-method-list" markdown="1">

[after](#method-after)
[all](#method-all)
[average](#method-average)
[avg](#method-avg)
[before](#method-before)
[chunk](#method-chunk)
[chunkWhile](#method-chunkwhile)
[collapse](#method-collapse)
[collapseWithKeys](#method-collapsewithkeys)
[collect](#method-collect)
[combine](#method-combine)
[concat](#method-concat)
[contains](#method-contains)
[containsOneItem](#method-containsoneitem)
[containsStrict](#method-containsstrict)
[count](#method-count)
[countBy](#method-countBy)
[crossJoin](#method-crossjoin)
[dd](#method-dd)
[diff](#method-diff)
[diffAssoc](#method-diffassoc)
[diffAssocUsing](#method-diffassocusing)
[diffKeys](#method-diffkeys)
[doesntContain](#method-doesntcontain)
[dot](#method-dot)
[dump](#method-dump)
[duplicates](#method-duplicates)
[duplicatesStrict](#method-duplicatesstrict)
[each](#method-each)
[eachSpread](#method-eachspread)
[ensure](#method-ensure)
[every](#method-every)
[except](#method-except)
[filter](#method-filter)
[first](#method-first)
[firstOrFail](#method-first-or-fail)
[firstWhere](#method-first-where)
[flatMap](#method-flatmap)
[flatten](#method-flatten)
[flip](#method-flip)
[forget](#method-forget)
[forPage](#method-forpage)
[fromJson](#method-fromjson)
[get](#method-get)
[groupBy](#method-groupby)
[has](#method-has)
[hasAny](#method-hasany)
[implode](#method-implode)
[intersect](#method-intersect)
[intersectUsing](#method-intersectusing)
[intersectAssoc](#method-intersectAssoc)
[intersectAssocUsing](#method-intersectassocusing)
[intersectByKeys](#method-intersectbykeys)
[isEmpty](#method-isempty)
[isNotEmpty](#method-isnotempty)
[join](#method-join)
[keyBy](#method-keyby)
[keys](#method-keys)
[last](#method-last)
[lazy](#method-lazy)
[macro](#method-macro)
[make](#method-make)
[map](#method-map)
[mapInto](#method-mapinto)
[mapSpread](#method-mapspread)
[mapToGroups](#method-maptogroups)
[mapWithKeys](#method-mapwithkeys)
[max](#method-max)
[median](#method-median)
[merge](#method-merge)
[mergeRecursive](#method-mergerecursive)
[min](#method-min)
[mode](#method-mode)
[multiply](#method-multiply)
[nth](#method-nth)
[only](#method-only)
[pad](#method-pad)
[partition](#method-partition)
[percentage](#method-percentage)
[pipe](#method-pipe)
[pipeInto](#method-pipeinto)
[pipeThrough](#method-pipethrough)
[pluck](#method-pluck)
[pop](#method-pop)
[prepend](#method-prepend)
[pull](#method-pull)
[push](#method-push)
[put](#method-put)
[random](#method-random)
[range](#method-range)
[reduce](#method-reduce)
[reduceSpread](#method-reduce-spread)
[reject](#method-reject)
[replace](#method-replace)
[replaceRecursive](#method-replacerecursive)
[reverse](#method-reverse)
[search](#method-search)
[select](#method-select)
[shift](#method-shift)
[shuffle](#method-shuffle)
[skip](#method-skip)
[skipUntil](#method-skipuntil)
[skipWhile](#method-skipwhile)
[slice](#method-slice)
[sliding](#method-sliding)
[sole](#method-sole)
[some](#method-some)
[sort](#method-sort)
[sortBy](#method-sortby)
[sortByDesc](#method-sortbydesc)
[sortDesc](#method-sortdesc)
[sortKeys](#method-sortkeys)
[sortKeysDesc](#method-sortkeysdesc)
[sortKeysUsing](#method-sortkeysusing)
[splice](#method-splice)
[split](#method-split)
[splitIn](#method-splitin)
[sum](#method-sum)
[take](#method-take)
[takeUntil](#method-takeuntil)
[takeWhile](#method-takewhile)
[tap](#method-tap)
[times](#method-times)
[toArray](#method-toarray)
[toJson](#method-tojson)
[transform](#method-transform)
[undot](#method-undot)
[union](#method-union)
[unique](#method-unique)
[uniqueStrict](#method-uniquestrict)
[unless](#method-unless)
[unlessEmpty](#method-unlessempty)
[unlessNotEmpty](#method-unlessnotempty)
[unwrap](#method-unwrap)
[value](#method-value)
[values](#method-values)
[when](#method-when)
[whenEmpty](#method-whenempty)
[whenNotEmpty](#method-whennotempty)
[where](#method-where)
[whereStrict](#method-wherestrict)
[whereBetween](#method-wherebetween)
[whereIn](#method-wherein)
[whereInStrict](#method-whereinstrict)
[whereInstanceOf](#method-whereinstanceof)
[whereNotBetween](#method-wherenotbetween)
[whereNotIn](#method-wherenotin)
[whereNotInStrict](#method-wherenotinstrict)
[whereNotNull](#method-wherenotnull)
[whereNull](#method-wherenull)
[wrap](#method-wrap)
[zip](#method-zip)

</div>


## 메서드 목록 {#method-listing}

<style>
    .collection-method code {
        font-size: 14px;
    }

    .collection-method:not(.first-collection-method) {
        margin-top: 50px;
    }
</style>


#### `after()` {#method-after}

`after` 메서드는 주어진 항목 다음의 항목을 반환합니다. 주어진 항목이 없거나 마지막 항목인 경우 `null`이 반환됩니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->after(3);

// 4

$collection->after(5);

// null
```

이 메서드는 "느슨한(loose)" 비교를 사용하여 주어진 항목을 검색합니다. 즉, 정수 값을 포함하는 문자열은 동일한 값의 정수와 같다고 간주됩니다. "엄격한(strict)" 비교를 사용하려면 `strict` 인자를 메서드에 전달할 수 있습니다:

```php
collect([2, 4, 6, 8])->after('4', strict: true);

// null
```

또는, 주어진 조건을 통과하는 첫 번째 항목을 검색하기 위해 직접 클로저를 제공할 수도 있습니다:

```php
collect([2, 4, 6, 8])->after(function (int $item, int $key) {
    return $item > 5;
});

// 8
```


#### `all()` {#method-all}

`all` 메서드는 컬렉션이 나타내는 기본 배열을 반환합니다:

```php
collect([1, 2, 3])->all();

// [1, 2, 3]
```


#### `average()` {#method-average}

[avg](#method-avg) 메서드의 별칭입니다.


#### `avg()` {#method-avg}

`avg` 메서드는 주어진 키의 [평균값](https://en.wikipedia.org/wiki/Average)을 반환합니다:

```php
$average = collect([
    ['foo' => 10],
    ['foo' => 10],
    ['foo' => 20],
    ['foo' => 40]
])->avg('foo');

// 20

$average = collect([1, 1, 2, 4])->avg();

// 2
```


#### `before()` {#method-before}

`before` 메서드는 [after](#method-after) 메서드의 반대입니다. 주어진 항목 이전의 항목을 반환합니다. 주어진 항목이 없거나 첫 번째 항목인 경우 `null`이 반환됩니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->before(3);

// 2

$collection->before(1);

// null

collect([2, 4, 6, 8])->before('4', strict: true);

// null

collect([2, 4, 6, 8])->before(function (int $item, int $key) {
    return $item > 5;
});

// 4
```


#### `chunk()` {#method-chunk}

`chunk` 메서드는 컬렉션을 주어진 크기의 여러 개의 작은 컬렉션으로 분할합니다:

```php
$collection = collect([1, 2, 3, 4, 5, 6, 7]);

$chunks = $collection->chunk(4);

$chunks->all();

// [[1, 2, 3, 4], [5, 6, 7]]
```

이 메서드는 [Bootstrap](https://getbootstrap.com/docs/5.3/layout/grid/)과 같은 그리드 시스템을 사용하는 [뷰](/laravel/12.x/views)에서 특히 유용합니다. 예를 들어, 그리드에 표시할 [Eloquent](/laravel/12.x/eloquent) 모델 컬렉션이 있다고 가정해봅시다:

```blade
@foreach ($products->chunk(3) as $chunk)
    <div class="row">
        @foreach ($chunk as $product)
            <div class="col-xs-4">{{ $product->name }}</div>
        @endforeach
    </div>
@endforeach
```


#### `chunkWhile()` {#method-chunkwhile}

`chunkWhile` 메서드는 주어진 콜백의 평가에 따라 컬렉션을 여러 개의 작은 컬렉션으로 분할합니다. 클로저에 전달되는 `$chunk` 변수는 이전 요소를 확인하는 데 사용할 수 있습니다:

```php
$collection = collect(str_split('AABBCCCD'));

$chunks = $collection->chunkWhile(function (string $value, int $key, Collection $chunk) {
    return $value === $chunk->last();
});

$chunks->all();

// [['A', 'A'], ['B', 'B'], ['C', 'C', 'C'], ['D']]
```


#### `collapse()` {#method-collapse}

`collapse` 메서드는 배열 또는 컬렉션의 컬렉션을 하나의 평면(flat) 컬렉션으로 합칩니다:

```php
$collection = collect([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]);

$collapsed = $collection->collapse();

$collapsed->all();

// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```


#### `collapseWithKeys()` {#method-collapsewithkeys}

`collapseWithKeys` 메서드는 배열 또는 컬렉션의 컬렉션을 하나의 컬렉션으로 평탄화하되, 원래의 키를 유지합니다:

```php
$collection = collect([
    ['first'  => collect([1, 2, 3])],
    ['second' => [4, 5, 6]],
    ['third'  => collect([7, 8, 9])]
]);

$collapsed = $collection->collapseWithKeys();

$collapsed->all();

// [
//     'first'  => [1, 2, 3],
//     'second' => [4, 5, 6],
//     'third'  => [7, 8, 9],
// ]
```


#### `collect()` {#method-collect}

`collect` 메서드는 현재 컬렉션에 있는 항목들로 새로운 `Collection` 인스턴스를 반환합니다:

```php
$collectionA = collect([1, 2, 3]);

$collectionB = $collectionA->collect();

$collectionB->all();

// [1, 2, 3]
```

`collect` 메서드는 [지연 컬렉션](#lazy-collections)을 표준 `Collection` 인스턴스로 변환할 때 주로 사용됩니다:

```php
$lazyCollection = LazyCollection::make(function () {
    yield 1;
    yield 2;
    yield 3;
});

$collection = $lazyCollection->collect();

$collection::class;

// 'Illuminate\Support\Collection'

$collection->all();

// [1, 2, 3]
```

> [!NOTE]
> `collect` 메서드는 `Enumerable` 인스턴스가 있을 때 비지연 컬렉션 인스턴스가 필요할 때 특히 유용합니다. `collect()`는 `Enumerable` 계약의 일부이므로, 안전하게 `Collection` 인스턴스를 얻기 위해 사용할 수 있습니다.


#### `combine()` {#method-combine}

`combine` 메서드는 컬렉션의 값을 키로, 다른 배열 또는 컬렉션의 값을 값으로 결합합니다:

```php
$collection = collect(['name', 'age']);

$combined = $collection->combine(['George', 29]);

$combined->all();

// ['name' => 'George', 'age' => 29]
```


#### `concat()` {#method-concat}

`concat` 메서드는 주어진 배열 또는 컬렉션의 값을 다른 컬렉션의 끝에 추가합니다:

```php
$collection = collect(['John Doe']);

$concatenated = $collection->concat(['Jane Doe'])->concat(['name' => 'Johnny Doe']);

$concatenated->all();

// ['John Doe', 'Jane Doe', 'Johnny Doe']
```

`concat` 메서드는 원래 컬렉션에 추가된 항목의 키를 숫자로 다시 인덱싱합니다. 연관 컬렉션의 키를 유지하려면 [merge](#method-merge) 메서드를 참고하세요.


#### `contains()` {#method-contains}

`contains` 메서드는 컬렉션에 주어진 항목이 포함되어 있는지 확인합니다. 클로저를 `contains` 메서드에 전달하여 주어진 조건을 만족하는 요소가 컬렉션에 존재하는지 확인할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->contains(function (int $value, int $key) {
    return $value > 5;
});

// false
```

또는, `contains` 메서드에 문자열을 전달하여 컬렉션에 해당 값이 존재하는지 확인할 수 있습니다:

```php
$collection = collect(['name' => 'Desk', 'price' => 100]);

$collection->contains('Desk');

// true

$collection->contains('New York');

// false
```

키/값 쌍을 `contains` 메서드에 전달하여 해당 쌍이 컬렉션에 존재하는지 확인할 수도 있습니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 100],
]);

$collection->contains('product', 'Bookcase');

// false
```

`contains` 메서드는 항목 값을 확인할 때 "느슨한(loose)" 비교를 사용합니다. 즉, 정수 값을 가진 문자열은 동일한 값의 정수와 같다고 간주됩니다. "엄격한(strict)" 비교를 사용하려면 [containsStrict](#method-containsstrict) 메서드를 사용하세요.

`contains`의 반대는 [doesntContain](#method-doesntcontain) 메서드를 참고하세요.


#### `containsOneItem()` {#method-containsoneitem}

`containsOneItem` 메서드는 컬렉션에 단일 항목이 포함되어 있는지 확인합니다:

```php
collect([])->containsOneItem();

// false

collect(['1'])->containsOneItem();

// true

collect(['1', '2'])->containsOneItem();

// false

collect([1, 2, 3])->containsOneItem(fn (int $item) => $item === 2);

// true
```


#### `containsStrict()` {#method-containsstrict}

이 메서드는 [contains](#method-contains) 메서드와 동일한 시그니처를 가지지만, 모든 값이 "엄격한(strict)" 비교로 비교됩니다.

> [!NOTE]
> 이 메서드는 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections#method-contains) 사용 시 동작이 변경됩니다.


#### `count()` {#method-count}

`count` 메서드는 컬렉션의 전체 항목 수를 반환합니다:

```php
$collection = collect([1, 2, 3, 4]);

$collection->count();

// 4
```


#### `countBy()` {#method-countBy}

`countBy` 메서드는 컬렉션 내 값의 발생 횟수를 셉니다. 기본적으로, 이 메서드는 모든 요소의 발생 횟수를 세어 컬렉션 내 특정 "타입"의 요소 개수를 셀 수 있게 해줍니다:

```php
$collection = collect([1, 2, 2, 2, 3]);

$counted = $collection->countBy();

$counted->all();

// [1 => 1, 2 => 3, 3 => 1]
```

클로저를 `countBy` 메서드에 전달하여 사용자 정의 값으로 모든 항목을 셀 수도 있습니다:

```php
$collection = collect(['alice@gmail.com', 'bob@yahoo.com', 'carlos@gmail.com']);

$counted = $collection->countBy(function (string $email) {
    return substr(strrchr($email, '@'), 1);
});

$counted->all();

// ['gmail.com' => 2, 'yahoo.com' => 1]
```


#### `crossJoin()` {#method-crossjoin}

`crossJoin` 메서드는 컬렉션의 값을 주어진 배열 또는 컬렉션과 교차 조인하여 가능한 모든 순열의 데카르트 곱을 반환합니다:

```php
$collection = collect([1, 2]);

$matrix = $collection->crossJoin(['a', 'b']);

$matrix->all();

/*
    [
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
    ]
*/

$collection = collect([1, 2]);

$matrix = $collection->crossJoin(['a', 'b'], ['I', 'II']);

$matrix->all();

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


#### `dd()` {#method-dd}

`dd` 메서드는 컬렉션의 항목을 덤프하고 스크립트 실행을 종료합니다:

```php
$collection = collect(['John Doe', 'Jane Doe']);

$collection->dd();

/*
    array:2 [
        0 => "John Doe"
        1 => "Jane Doe"
    ]
*/
```

스크립트 실행을 중단하지 않고 컬렉션을 덤프하려면 [dump](#method-dump) 메서드를 사용하세요.


#### `diff()` {#method-diff}

`diff` 메서드는 컬렉션을 다른 컬렉션 또는 일반 PHP `array`와 값 기준으로 비교합니다. 이 메서드는 원본 컬렉션에만 존재하는 값을 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$diff = $collection->diff([2, 4, 6, 8]);

$diff->all();

// [1, 3, 5]
```

> [!NOTE]
> 이 메서드는 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections#method-diff) 사용 시 동작이 변경됩니다.


#### `diffAssoc()` {#method-diffassoc}

`diffAssoc` 메서드는 컬렉션을 다른 컬렉션 또는 일반 PHP `array`와 키와 값 기준으로 비교합니다. 이 메서드는 원본 컬렉션에만 존재하는 키/값 쌍을 반환합니다:

```php
$collection = collect([
    'color' => 'orange',
    'type' => 'fruit',
    'remain' => 6,
]);

$diff = $collection->diffAssoc([
    'color' => 'yellow',
    'type' => 'fruit',
    'remain' => 3,
    'used' => 6,
]);

$diff->all();

// ['color' => 'orange', 'remain' => 6]
```


#### `diffAssocUsing()` {#method-diffassocusing}

`diffAssoc`와 달리, `diffAssocUsing`은 인덱스 비교를 위해 사용자가 제공한 콜백 함수를 받습니다:

```php
$collection = collect([
    'color' => 'orange',
    'type' => 'fruit',
    'remain' => 6,
]);

$diff = $collection->diffAssocUsing([
    'Color' => 'yellow',
    'Type' => 'fruit',
    'Remain' => 3,
], 'strnatcasecmp');

$diff->all();

// ['color' => 'orange', 'remain' => 6]
```

콜백은 0보다 작거나, 같거나, 크거나 한 정수를 반환하는 비교 함수여야 합니다. 자세한 내용은 PHP의 [array_diff_uassoc](https://www.php.net/array_diff_uassoc#refsect1-function.array-diff-uassoc-parameters) 문서를 참고하세요. 이 메서드는 내부적으로 해당 PHP 함수를 사용합니다.


#### `diffKeys()` {#method-diffkeys}

`diffKeys` 메서드는 컬렉션을 다른 컬렉션 또는 일반 PHP `array`와 키 기준으로 비교합니다. 이 메서드는 원본 컬렉션에만 존재하는 키/값 쌍을 반환합니다:

```php
$collection = collect([
    'one' => 10,
    'two' => 20,
    'three' => 30,
    'four' => 40,
    'five' => 50,
]);

$diff = $collection->diffKeys([
    'two' => 2,
    'four' => 4,
    'six' => 6,
    'eight' => 8,
]);

$diff->all();

// ['one' => 10, 'three' => 30, 'five' => 50]
```


#### `doesntContain()` {#method-doesntcontain}

`doesntContain` 메서드는 컬렉션에 주어진 항목이 포함되어 있지 않은지 확인합니다. 클로저를 `doesntContain` 메서드에 전달하여 주어진 조건을 만족하지 않는 요소가 컬렉션에 존재하는지 확인할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->doesntContain(function (int $value, int $key) {
    return $value < 5;
});

// false
```

또는, `doesntContain` 메서드에 문자열을 전달하여 컬렉션에 해당 값이 존재하지 않는지 확인할 수 있습니다:

```php
$collection = collect(['name' => 'Desk', 'price' => 100]);

$collection->doesntContain('Table');

// true

$collection->doesntContain('Desk');

// false
```

키/값 쌍을 `doesntContain` 메서드에 전달하여 해당 쌍이 컬렉션에 존재하지 않는지 확인할 수도 있습니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 100],
]);

$collection->doesntContain('product', 'Bookcase');

// true
```

`doesntContain` 메서드는 항목 값을 확인할 때 "느슨한(loose)" 비교를 사용합니다. 즉, 정수 값을 가진 문자열은 동일한 값의 정수와 같다고 간주됩니다.


#### `dot()` {#method-dot}

`dot` 메서드는 다차원 컬렉션을 "점(dot)" 표기법을 사용하여 깊이를 나타내는 단일 레벨 컬렉션으로 평탄화합니다:

```php
$collection = collect(['products' => ['desk' => ['price' => 100]]]);

$flattened = $collection->dot();

$flattened->all();

// ['products.desk.price' => 100]
```


#### `dump()` {#method-dump}

`dump` 메서드는 컬렉션의 항목을 덤프합니다:

```php
$collection = collect(['John Doe', 'Jane Doe']);

$collection->dump();

/*
    array:2 [
        0 => "John Doe"
        1 => "Jane Doe"
    ]
*/
```

컬렉션을 덤프한 후 스크립트 실행을 중단하려면 [dd](#method-dd) 메서드를 사용하세요.


#### `duplicates()` {#method-duplicates}

`duplicates` 메서드는 컬렉션에서 중복된 값을 찾아 반환합니다:

```php
$collection = collect(['a', 'b', 'a', 'c', 'b']);

$collection->duplicates();

// [2 => 'a', 4 => 'b']
```

컬렉션에 배열이나 객체가 포함되어 있다면, 중복 값을 확인할 속성의 키를 전달할 수 있습니다:

```php
$employees = collect([
    ['email' => 'abigail@example.com', 'position' => 'Developer'],
    ['email' => 'james@example.com', 'position' => 'Designer'],
    ['email' => 'victoria@example.com', 'position' => 'Developer'],
]);

$employees->duplicates('position');

// [2 => 'Developer']
```


#### `duplicatesStrict()` {#method-duplicatesstrict}

이 메서드는 [duplicates](#method-duplicates) 메서드와 동일한 시그니처를 가지지만, 모든 값이 "엄격한(strict)" 비교로 비교됩니다.


#### `each()` {#method-each}

`each` 메서드는 컬렉션의 항목을 반복(iterate)하며 각 항목을 클로저에 전달합니다:

```php
$collection = collect([1, 2, 3, 4]);

$collection->each(function (int $item, int $key) {
    // ...
});
```

항목 반복을 중단하고 싶다면, 클로저에서 `false`를 반환하면 됩니다:

```php
$collection->each(function (int $item, int $key) {
    if (/* 조건 */) {
        return false;
    }
});
```


#### `eachSpread()` {#method-eachspread}

`eachSpread` 메서드는 컬렉션의 항목을 반복하며, 각 중첩 항목 값을 주어진 콜백에 전달합니다:

```php
$collection = collect([['John Doe', 35], ['Jane Doe', 33]]);

$collection->eachSpread(function (string $name, int $age) {
    // ...
});
```

콜백에서 `false`를 반환하여 반복을 중단할 수 있습니다:

```php
$collection->eachSpread(function (string $name, int $age) {
    return false;
});
```


#### `ensure()` {#method-ensure}

`ensure` 메서드는 컬렉션의 모든 요소가 주어진 타입 또는 타입 목록에 속하는지 확인할 때 사용할 수 있습니다. 그렇지 않으면 `UnexpectedValueException`이 발생합니다:

```php
return $collection->ensure(User::class);

return $collection->ensure([User::class, Customer::class]);
```

`string`, `int`, `float`, `bool`, `array`와 같은 원시 타입도 지정할 수 있습니다:

```php
return $collection->ensure('int');
```

> [!WARNING]
> `ensure` 메서드는 이후에 다른 타입의 요소가 컬렉션에 추가되지 않음을 보장하지 않습니다.


#### `every()` {#method-every}

`every` 메서드는 컬렉션의 모든 요소가 주어진 조건을 통과하는지 확인할 때 사용할 수 있습니다:

```php
collect([1, 2, 3, 4])->every(function (int $value, int $key) {
    return $value > 2;
});

// false
```

컬렉션이 비어 있으면, `every` 메서드는 true를 반환합니다:

```php
$collection = collect([]);

$collection->every(function (int $value, int $key) {
    return $value > 2;
});

// true
```


#### `except()` {#method-except}

`except` 메서드는 지정된 키를 가진 항목을 제외한 컬렉션의 모든 항목을 반환합니다:

```php
$collection = collect(['product_id' => 1, 'price' => 100, 'discount' => false]);

$filtered = $collection->except(['price', 'discount']);

$filtered->all();

// ['product_id' => 1]
```

`except`의 반대는 [only](#method-only) 메서드를 참고하세요.

> [!NOTE]
> 이 메서드는 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections#method-except) 사용 시 동작이 변경됩니다.


#### `filter()` {#method-filter}

`filter` 메서드는 주어진 콜백을 사용하여 컬렉션을 필터링하며, 조건을 통과하는 항목만 남깁니다:

```php
$collection = collect([1, 2, 3, 4]);

$filtered = $collection->filter(function (int $value, int $key) {
    return $value > 2;
});

$filtered->all();

// [3, 4]
```

콜백을 제공하지 않으면, 컬렉션에서 `false`로 간주되는 모든 항목이 제거됩니다:

```php
$collection = collect([1, 2, 3, null, false, '', 0, []]);

$collection->filter()->all();

// [1, 2, 3]
```

`filter`의 반대는 [reject](#method-reject) 메서드를 참고하세요.


#### `first()` {#method-first}

`first` 메서드는 주어진 조건을 통과하는 컬렉션의 첫 번째 요소를 반환합니다:

```php
collect([1, 2, 3, 4])->first(function (int $value, int $key) {
    return $value > 2;
});

// 3
```

인자 없이 `first` 메서드를 호출하면 컬렉션의 첫 번째 요소를 반환합니다. 컬렉션이 비어 있으면 `null`이 반환됩니다:

```php
collect([1, 2, 3, 4])->first();

// 1
```


#### `firstOrFail()` {#method-first-or-fail}

`firstOrFail` 메서드는 `first` 메서드와 동일하지만, 결과가 없으면 `Illuminate\Support\ItemNotFoundException` 예외가 발생합니다:

```php
collect([1, 2, 3, 4])->firstOrFail(function (int $value, int $key) {
    return $value > 5;
});

// ItemNotFoundException 예외 발생...
```

인자 없이 `firstOrFail` 메서드를 호출하면 컬렉션의 첫 번째 요소를 반환합니다. 컬렉션이 비어 있으면 `Illuminate\Support\ItemNotFoundException` 예외가 발생합니다:

```php
collect([])->firstOrFail();

// ItemNotFoundException 예외 발생...
```


#### `firstWhere()` {#method-first-where}

`firstWhere` 메서드는 주어진 키/값 쌍을 가진 컬렉션의 첫 번째 요소를 반환합니다:

```php
$collection = collect([
    ['name' => 'Regena', 'age' => null],
    ['name' => 'Linda', 'age' => 14],
    ['name' => 'Diego', 'age' => 23],
    ['name' => 'Linda', 'age' => 84],
]);

$collection->firstWhere('name', 'Linda');

// ['name' => 'Linda', 'age' => 14]
```

비교 연산자를 사용하여 `firstWhere` 메서드를 호출할 수도 있습니다:

```php
$collection->firstWhere('age', '>=', 18);

// ['name' => 'Diego', 'age' => 23]
```

[where](#method-where) 메서드처럼, `firstWhere` 메서드에 인자를 하나만 전달할 수도 있습니다. 이 경우, 해당 키의 값이 "참(truthy)"인 첫 번째 항목을 반환합니다:

```php
$collection->firstWhere('age');

// ['name' => 'Linda', 'age' => 14]
```


#### `flatMap()` {#method-flatmap}

`flatMap` 메서드는 컬렉션을 반복하며 각 값을 주어진 클로저에 전달합니다. 클로저는 항목을 수정하여 반환할 수 있으며, 이렇게 수정된 항목들로 새로운 컬렉션이 만들어집니다. 그 후, 배열이 한 단계 평탄화됩니다:

```php
$collection = collect([
    ['name' => 'Sally'],
    ['school' => 'Arkansas'],
    ['age' => 28]
]);

$flattened = $collection->flatMap(function (array $values) {
    return array_map('strtoupper', $values);
});

$flattened->all();

// ['name' => 'SALLY', 'school' => 'ARKANSAS', 'age' => '28'];
```


#### `flatten()` {#method-flatten}

`flatten` 메서드는 다차원 컬렉션을 단일 차원으로 평탄화합니다:

```php
$collection = collect([
    'name' => 'Taylor',
    'languages' => [
        'PHP', 'JavaScript'
    ]
]);

$flattened = $collection->flatten();

$flattened->all();

// ['Taylor', 'PHP', 'JavaScript'];
```

필요하다면, `flatten` 메서드에 "깊이(depth)" 인자를 전달할 수 있습니다:

```php
$collection = collect([
    'Apple' => [
        [
            'name' => 'iPhone 6S',
            'brand' => 'Apple'
        ],
    ],
    'Samsung' => [
        [
            'name' => 'Galaxy S7',
            'brand' => 'Samsung'
        ],
    ],
]);

$products = $collection->flatten(1);

$products->values()->all();

/*
    [
        ['name' => 'iPhone 6S', 'brand' => 'Apple'],
        ['name' => 'Galaxy S7', 'brand' => 'Samsung'],
    ]
*/
```

이 예시에서, 깊이를 지정하지 않고 `flatten`을 호출하면 중첩 배열까지 모두 평탄화되어 `['iPhone 6S', 'Apple', 'Galaxy S7', 'Samsung']`이 됩니다. 깊이를 지정하면 중첩 배열이 평탄화되는 레벨을 지정할 수 있습니다.


#### `flip()` {#method-flip}

`flip` 메서드는 컬렉션의 키와 해당 값을 서로 바꿉니다:

```php
$collection = collect(['name' => 'Taylor', 'framework' => 'Laravel']);

$flipped = $collection->flip();

$flipped->all();

// ['Taylor' => 'name', 'Laravel' => 'framework']
```


#### `forget()` {#method-forget}

`forget` 메서드는 키를 기준으로 컬렉션에서 항목을 제거합니다:

```php
$collection = collect(['name' => 'Taylor', 'framework' => 'Laravel']);

// 단일 키 제거...
$collection->forget('name');

// ['framework' => 'Laravel']

// 여러 키 제거...
$collection->forget(['name', 'framework']);

// []
```

> [!WARNING]
> 대부분의 다른 컬렉션 메서드와 달리, `forget`은 새로운 수정된 컬렉션을 반환하지 않고, 호출된 컬렉션 자체를 수정하여 반환합니다.


#### `forPage()` {#method-forpage}

`forPage` 메서드는 주어진 페이지 번호에 해당하는 항목만 포함하는 새로운 컬렉션을 반환합니다. 첫 번째 인자는 페이지 번호, 두 번째 인자는 페이지당 표시할 항목 수입니다:

```php
$collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9]);

$chunk = $collection->forPage(2, 3);

$chunk->all();

// [4, 5, 6]
```


#### `fromJson()` {#method-fromjson}

정적 `fromJson` 메서드는 `json_decode` PHP 함수를 사용하여 주어진 JSON 문자열을 디코딩하여 새로운 컬렉션 인스턴스를 생성합니다:

```php
use Illuminate\Support\Collection;

$json = json_encode([
    'name' => 'Taylor Otwell',
    'role' => 'Developer',
    'status' => 'Active',
]);

$collection = Collection::fromJson($json);
```


#### `get()` {#method-get}

`get` 메서드는 주어진 키의 항목을 반환합니다. 키가 존재하지 않으면 `null`이 반환됩니다:

```php
$collection = collect(['name' => 'Taylor', 'framework' => 'Laravel']);

$value = $collection->get('name');

// Taylor
```

두 번째 인자로 기본값을 선택적으로 전달할 수 있습니다:

```php
$collection = collect(['name' => 'Taylor', 'framework' => 'Laravel']);

$value = $collection->get('age', 34);

// 34
```

기본값으로 콜백을 전달할 수도 있습니다. 지정한 키가 존재하지 않으면 콜백의 결과가 반환됩니다:

```php
$collection->get('email', function () {
    return 'taylor@example.com';
});

// taylor@example.com
```


#### `groupBy()` {#method-groupby}

`groupBy` 메서드는 컬렉션의 항목을 주어진 키로 그룹화합니다:

```php
$collection = collect([
    ['account_id' => 'account-x10', 'product' => 'Chair'],
    ['account_id' => 'account-x10', 'product' => 'Bookcase'],
    ['account_id' => 'account-x11', 'product' => 'Desk'],
]);

$grouped = $collection->groupBy('account_id');

$grouped->all();

/*
    [
        'account-x10' => [
            ['account_id' => 'account-x10', 'product' => 'Chair'],
            ['account_id' => 'account-x10', 'product' => 'Bookcase'],
        ],
        'account-x11' => [
            ['account_id' => 'account-x11', 'product' => 'Desk'],
        ],
    ]
*/
```

문자열 `key` 대신 콜백을 전달할 수도 있습니다. 콜백은 그룹의 키로 사용할 값을 반환해야 합니다:

```php
$grouped = $collection->groupBy(function (array $item, int $key) {
    return substr($item['account_id'], -3);
});

$grouped->all();

/*
    [
        'x10' => [
            ['account_id' => 'account-x10', 'product' => 'Chair'],
            ['account_id' => 'account-x10', 'product' => 'Bookcase'],
        ],
        'x11' => [
            ['account_id' => 'account-x11', 'product' => 'Desk'],
        ],
    ]
*/
```

여러 그룹화 기준을 배열로 전달할 수도 있습니다. 각 배열 요소는 다차원 배열 내의 해당 레벨에 적용됩니다:

```php
$data = new Collection([
    10 => ['user' => 1, 'skill' => 1, 'roles' => ['Role_1', 'Role_3']],
    20 => ['user' => 2, 'skill' => 1, 'roles' => ['Role_1', 'Role_2']],
    30 => ['user' => 3, 'skill' => 2, 'roles' => ['Role_1']],
    40 => ['user' => 4, 'skill' => 2, 'roles' => ['Role_2']],
]);

$result = $data->groupBy(['skill', function (array $item) {
    return $item['roles'];
}], preserveKeys: true);

/*
[
    1 => [
        'Role_1' => [
            10 => ['user' => 1, 'skill' => 1, 'roles' => ['Role_1', 'Role_3']],
            20 => ['user' => 2, 'skill' => 1, 'roles' => ['Role_1', 'Role_2']],
        ],
        'Role_2' => [
            20 => ['user' => 2, 'skill' => 1, 'roles' => ['Role_1', 'Role_2']],
        ],
        'Role_3' => [
            10 => ['user' => 1, 'skill' => 1, 'roles' => ['Role_1', 'Role_3']],
        ],
    ],
    2 => [
        'Role_1' => [
            30 => ['user' => 3, 'skill' => 2, 'roles' => ['Role_1']],
        ],
        'Role_2' => [
            40 => ['user' => 4, 'skill' => 2, 'roles' => ['Role_2']],
        ],
    ],
];
*/
```


#### `has()` {#method-has}

`has` 메서드는 주어진 키가 컬렉션에 존재하는지 확인합니다:

```php
$collection = collect(['account_id' => 1, 'product' => 'Desk', 'amount' => 5]);

$collection->has('product');

// true

$collection->has(['product', 'amount']);

// true

$collection->has(['amount', 'price']);

// false
```


#### `hasAny()` {#method-hasany}

`hasAny` 메서드는 주어진 키 중 하나라도 컬렉션에 존재하는지 확인합니다:

```php
$collection = collect(['account_id' => 1, 'product' => 'Desk', 'amount' => 5]);

$collection->hasAny(['product', 'price']);

// true

$collection->hasAny(['name', 'price']);

// false
```


#### `implode()` {#method-implode}

`implode` 메서드는 컬렉션의 항목을 결합(join)합니다. 인자는 컬렉션의 항목 타입에 따라 다릅니다. 컬렉션에 배열이나 객체가 포함되어 있다면, 결합할 속성의 키와 값 사이에 넣을 "글루(glue)" 문자열을 전달해야 합니다:

```php
$collection = collect([
    ['account_id' => 1, 'product' => 'Desk'],
    ['account_id' => 2, 'product' => 'Chair'],
]);

$collection->implode('product', ', ');

// 'Desk, Chair'
```

컬렉션에 단순 문자열이나 숫자 값이 포함되어 있다면, "글루"만 인자로 전달하면 됩니다:

```php
collect([1, 2, 3, 4, 5])->implode('-');

// '1-2-3-4-5'
```

값을 포맷팅하고 싶다면, 클로저를 `implode` 메서드에 전달할 수 있습니다:

```php
$collection->implode(function (array $item, int $key) {
    return strtoupper($item['product']);
}, ', ');

// 'DESK, CHAIR'
```


#### `intersect()` {#method-intersect}

`intersect` 메서드는 원본 컬렉션에 존재하지 않는 값을 제거합니다. 결과 컬렉션은 원본 컬렉션의 키를 유지합니다:

```php
$collection = collect(['Desk', 'Sofa', 'Chair']);

$intersect = $collection->intersect(['Desk', 'Chair', 'Bookcase']);

$intersect->all();

// [0 => 'Desk', 2 => 'Chair']
```

> [!NOTE]
> 이 메서드는 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections#method-intersect) 사용 시 동작이 변경됩니다.


#### `intersectUsing()` {#method-intersectusing}

`intersectUsing` 메서드는 원본 컬렉션에 존재하지 않는 값을 제거하되, 값 비교에 사용자 정의 콜백을 사용합니다. 결과 컬렉션은 원본 컬렉션의 키를 유지합니다:

```php
$collection = collect(['Desk', 'Sofa', 'Chair']);

$intersect = $collection->intersectUsing(['desk', 'chair', 'bookcase'], function (string $a, string $b) {
    return strcasecmp($a, $b);
});

$intersect->all();

// [0 => 'Desk', 2 => 'Chair']
```


#### `intersectAssoc()` {#method-intersectAssoc}

`intersectAssoc` 메서드는 원본 컬렉션을 다른 컬렉션 또는 배열과 비교하여, 모든 컬렉션에 존재하는 키/값 쌍을 반환합니다:

```php
$collection = collect([
    'color' => 'red',
    'size' => 'M',
    'material' => 'cotton'
]);

$intersect = $collection->intersectAssoc([
    'color' => 'blue',
    'size' => 'M',
    'material' => 'polyester'
]);

$intersect->all();

// ['size' => 'M']
```


#### `intersectAssocUsing()` {#method-intersectassocusing}

`intersectAssocUsing` 메서드는 원본 컬렉션을 다른 컬렉션 또는 배열과 비교하여, 둘 다에 존재하는 키/값 쌍을 반환하되, 키와 값의 동등성 판단에 사용자 정의 비교 콜백을 사용합니다:

```php
$collection = collect([
    'color' => 'red',
    'Size' => 'M',
    'material' => 'cotton',
]);

$intersect = $collection->intersectAssocUsing([
    'color' => 'blue',
    'size' => 'M',
    'material' => 'polyester',
], function (string $a, string $b) {
    return strcasecmp($a, $b);
});

$intersect->all();

// ['Size' => 'M']
```


#### `intersectByKeys()` {#method-intersectbykeys}

`intersectByKeys` 메서드는 원본 컬렉션에 존재하지 않는 키와 해당 값을 제거합니다:

```php
$collection = collect([
    'serial' => 'UX301', 'type' => 'screen', 'year' => 2009,
]);

$intersect = $collection->intersectByKeys([
    'reference' => 'UX404', 'type' => 'tab', 'year' => 2011,
]);

$intersect->all();

// ['type' => 'screen', 'year' => 2009]
```


#### `isEmpty()` {#method-isempty}

`isEmpty` 메서드는 컬렉션이 비어 있으면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다:

```php
collect([])->isEmpty();

// true
```


#### `isNotEmpty()` {#method-isnotempty}

`isNotEmpty` 메서드는 컬렉션이 비어 있지 않으면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다:

```php
collect([])->isNotEmpty();

// false
```


#### `join()` {#method-join}

`join` 메서드는 컬렉션의 값을 문자열로 결합합니다. 두 번째 인자를 사용하여 마지막 요소가 문자열에 어떻게 추가될지 지정할 수 있습니다:

```php
collect(['a', 'b', 'c'])->join(', '); // 'a, b, c'
collect(['a', 'b', 'c'])->join(', ', ', and '); // 'a, b, and c'
collect(['a', 'b'])->join(', ', ' and '); // 'a and b'
collect(['a'])->join(', ', ' and '); // 'a'
collect([])->join(', ', ' and '); // ''
```


#### `keyBy()` {#method-keyby}

`keyBy` 메서드는 컬렉션을 주어진 키로 키를 지정합니다. 동일한 키를 가진 항목이 여러 개 있으면 마지막 항목만 새 컬렉션에 나타납니다:

```php
$collection = collect([
    ['product_id' => 'prod-100', 'name' => 'Desk'],
    ['product_id' => 'prod-200', 'name' => 'Chair'],
]);

$keyed = $collection->keyBy('product_id');

$keyed->all();

/*
    [
        'prod-100' => ['product_id' => 'prod-100', 'name' => 'Desk'],
        'prod-200' => ['product_id' => 'prod-200', 'name' => 'Chair'],
    ]
*/
```

메서드에 콜백을 전달할 수도 있습니다. 콜백은 컬렉션의 키로 사용할 값을 반환해야 합니다:

```php
$keyed = $collection->keyBy(function (array $item, int $key) {
    return strtoupper($item['product_id']);
});

$keyed->all();

/*
    [
        'PROD-100' => ['product_id' => 'prod-100', 'name' => 'Desk'],
        'PROD-200' => ['product_id' => 'prod-200', 'name' => 'Chair'],
    ]
*/
```


#### `keys()` {#method-keys}

`keys` 메서드는 컬렉션의 모든 키를 반환합니다:

```php
$collection = collect([
    'prod-100' => ['product_id' => 'prod-100', 'name' => 'Desk'],
    'prod-200' => ['product_id' => 'prod-200', 'name' => 'Chair'],
]);

$keys = $collection->keys();

$keys->all();

// ['prod-100', 'prod-200']
```


#### `last()` {#method-last}

`last` 메서드는 주어진 조건을 통과하는 컬렉션의 마지막 요소를 반환합니다:

```php
collect([1, 2, 3, 4])->last(function (int $value, int $key) {
    return $value < 3;
});

// 2
```

인자 없이 `last` 메서드를 호출하면 컬렉션의 마지막 요소를 반환합니다. 컬렉션이 비어 있으면 `null`이 반환됩니다:

```php
collect([1, 2, 3, 4])->last();

// 4
```


#### `lazy()` {#method-lazy}

`lazy` 메서드는 기본 항목 배열로부터 새로운 [LazyCollection](#lazy-collections) 인스턴스를 반환합니다:

```php
$lazyCollection = collect([1, 2, 3, 4])->lazy();

$lazyCollection::class;

// Illuminate\Support\LazyCollection

$lazyCollection->all();

// [1, 2, 3, 4]
```

이 메서드는 많은 항목을 가진 거대한 `Collection`에서 변환 작업을 수행해야 할 때 특히 유용합니다:

```php
$count = $hugeCollection
    ->lazy()
    ->where('country', 'FR')
    ->where('balance', '>', '100')
    ->count();
```

컬렉션을 `LazyCollection`으로 변환함으로써 추가 메모리 할당을 피할 수 있습니다. 원본 컬렉션은 _자신의_ 값을 메모리에 유지하지만, 이후의 필터는 그렇지 않습니다. 따라서 컬렉션 결과를 필터링할 때 추가 메모리가 거의 할당되지 않습니다.


#### `macro()` {#method-macro}

정적 `macro` 메서드는 런타임에 `Collection` 클래스에 메서드를 추가할 수 있게 해줍니다. 자세한 내용은 [컬렉션 확장하기](#extending-collections) 문서를 참고하세요.


#### `make()` {#method-make}

정적 `make` 메서드는 새로운 컬렉션 인스턴스를 생성합니다. [컬렉션 생성하기](#creating-collections) 섹션을 참고하세요.

```php
use Illuminate\Support\Collection;

$collection = Collection::make([1, 2, 3]);
```


#### `map()` {#method-map}

`map` 메서드는 컬렉션을 반복하며 각 값을 주어진 콜백에 전달합니다. 콜백은 항목을 수정하여 반환할 수 있으며, 이렇게 수정된 항목들로 새로운 컬렉션이 만들어집니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$multiplied = $collection->map(function (int $item, int $key) {
    return $item * 2;
});

$multiplied->all();

// [2, 4, 6, 8, 10]
```

> [!WARNING]
> 대부분의 다른 컬렉션 메서드처럼, `map`은 새로운 컬렉션 인스턴스를 반환합니다. 호출된 컬렉션 자체를 수정하지 않습니다. 원본 컬렉션을 변환하려면 [transform](#method-transform) 메서드를 사용하세요.


#### `mapInto()` {#method-mapinto}

`mapInto()` 메서드는 컬렉션을 반복하며, 값을 생성자에 전달하여 주어진 클래스의 새 인스턴스를 생성합니다:

```php
class Currency
{
    /**
     * 새로운 통화 인스턴스 생성.
     */
    function __construct(
        public string $code,
    ) {}
}

$collection = collect(['USD', 'EUR', 'GBP']);

$currencies = $collection->mapInto(Currency::class);

$currencies->all();

// [Currency('USD'), Currency('EUR'), Currency('GBP')]
```


#### `mapSpread()` {#method-mapspread}

`mapSpread` 메서드는 컬렉션의 항목을 반복하며, 각 중첩 항목 값을 주어진 클로저에 전달합니다. 클로저는 항목을 수정하여 반환할 수 있으며, 이렇게 수정된 항목들로 새로운 컬렉션이 만들어집니다:

```php
$collection = collect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

$chunks = $collection->chunk(2);

$sequence = $chunks->mapSpread(function (int $even, int $odd) {
    return $even + $odd;
});

$sequence->all();

// [1, 5, 9, 13, 17]
```


#### `mapToGroups()` {#method-maptogroups}

`mapToGroups` 메서드는 컬렉션의 항목을 주어진 클로저로 그룹화합니다. 클로저는 단일 키/값 쌍을 포함하는 연관 배열을 반환해야 하며, 이렇게 그룹화된 값들로 새로운 컬렉션이 만들어집니다:

```php
$collection = collect([
    [
        'name' => 'John Doe',
        'department' => 'Sales',
    ],
    [
        'name' => 'Jane Doe',
        'department' => 'Sales',
    ],
    [
        'name' => 'Johnny Doe',
        'department' => 'Marketing',
    ]
]);

$grouped = $collection->mapToGroups(function (array $item, int $key) {
    return [$item['department'] => $item['name']];
});

$grouped->all();

/*
    [
        'Sales' => ['John Doe', 'Jane Doe'],
        'Marketing' => ['Johnny Doe'],
    ]
*/

$grouped->get('Sales')->all();

// ['John Doe', 'Jane Doe']
```


#### `mapWithKeys()` {#method-mapwithkeys}

`mapWithKeys` 메서드는 컬렉션을 반복하며 각 값을 주어진 콜백에 전달합니다. 콜백은 단일 키/값 쌍을 포함하는 연관 배열을 반환해야 합니다:

```php
$collection = collect([
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
]);

$keyed = $collection->mapWithKeys(function (array $item, int $key) {
    return [$item['email'] => $item['name']];
});

$keyed->all();

/*
    [
        'john@example.com' => 'John',
        'jane@example.com' => 'Jane',
    ]
*/
```


#### `max()` {#method-max}

`max` 메서드는 주어진 키의 최대값을 반환합니다:

```php
$max = collect([
    ['foo' => 10],
    ['foo' => 20]
])->max('foo');

// 20

$max = collect([1, 2, 3, 4, 5])->max();

// 5
```


#### `median()` {#method-median}

`median` 메서드는 주어진 키의 [중앙값](https://en.wikipedia.org/wiki/Median)을 반환합니다:

```php
$median = collect([
    ['foo' => 10],
    ['foo' => 10],
    ['foo' => 20],
    ['foo' => 40]
])->median('foo');

// 15

$median = collect([1, 1, 2, 4])->median();

// 1.5
```


#### `merge()` {#method-merge}

`merge` 메서드는 주어진 배열 또는 컬렉션을 원본 컬렉션과 병합합니다. 주어진 항목의 문자열 키가 원본 컬렉션의 문자열 키와 일치하면, 주어진 항목의 값이 원본 컬렉션의 값을 덮어씁니다:

```php
$collection = collect(['product_id' => 1, 'price' => 100]);

$merged = $collection->merge(['price' => 200, 'discount' => false]);

$merged->all();

// ['product_id' => 1, 'price' => 200, 'discount' => false]
```

주어진 항목의 키가 숫자라면, 값이 컬렉션 끝에 추가됩니다:

```php
$collection = collect(['Desk', 'Chair']);

$merged = $collection->merge(['Bookcase', 'Door']);

$merged->all();

// ['Desk', 'Chair', 'Bookcase', 'Door']
```


#### `mergeRecursive()` {#method-mergerecursive}

`mergeRecursive` 메서드는 주어진 배열 또는 컬렉션을 원본 컬렉션과 재귀적으로 병합합니다. 주어진 항목의 문자열 키가 원본 컬렉션의 문자열 키와 일치하면, 해당 키의 값이 배열로 병합되고, 이 작업이 재귀적으로 수행됩니다:

```php
$collection = collect(['product_id' => 1, 'price' => 100]);

$merged = $collection->mergeRecursive([
    'product_id' => 2,
    'price' => 200,
    'discount' => false
]);

$merged->all();

// ['product_id' => [1, 2], 'price' => [100, 200], 'discount' => false]
```


#### `min()` {#method-min}

`min` 메서드는 주어진 키의 최소값을 반환합니다:

```php
$min = collect([['foo' => 10], ['foo' => 20]])->min('foo');

// 10

$min = collect([1, 2, 3, 4, 5])->min();

// 1
```


#### `mode()` {#method-mode}

`mode` 메서드는 주어진 키의 [최빈값](https://en.wikipedia.org/wiki/Mode_(statistics))을 반환합니다:

```php
$mode = collect([
    ['foo' => 10],
    ['foo' => 10],
    ['foo' => 20],
    ['foo' => 40]
])->mode('foo');

// [10]

$mode = collect([1, 1, 2, 4])->mode();

// [1]

$mode = collect([1, 1, 2, 2])->mode();

// [1, 2]
```


#### `multiply()` {#method-multiply}

`multiply` 메서드는 컬렉션의 모든 항목을 지정한 횟수만큼 복제합니다:

```php
$users = collect([
    ['name' => 'User #1', 'email' => 'user1@example.com'],
    ['name' => 'User #2', 'email' => 'user2@example.com'],
])->multiply(3);

/*
    [
        ['name' => 'User #1', 'email' => 'user1@example.com'],
        ['name' => 'User #2', 'email' => 'user2@example.com'],
        ['name' => 'User #1', 'email' => 'user1@example.com'],
        ['name' => 'User #2', 'email' => 'user2@example.com'],
        ['name' => 'User #1', 'email' => 'user1@example.com'],
        ['name' => 'User #2', 'email' => 'user2@example.com'],
    ]
*/
```


#### `nth()` {#method-nth}

`nth` 메서드는 n번째마다의 요소로 구성된 새로운 컬렉션을 생성합니다:

```php
$collection = collect(['a', 'b', 'c', 'd', 'e', 'f']);

$collection->nth(4);

// ['a', 'e']
```

두 번째 인자로 시작 오프셋을 선택적으로 전달할 수 있습니다:

```php
$collection->nth(4, 1);

// ['b', 'f']
```


#### `only()` {#method-only}

`only` 메서드는 지정된 키를 가진 컬렉션의 항목만 반환합니다:

```php
$collection = collect([
    'product_id' => 1,
    'name' => 'Desk',
    'price' => 100,
    'discount' => false
]);

$filtered = $collection->only(['product_id', 'name']);

$filtered->all();

// ['product_id' => 1, 'name' => 'Desk']
```

`only`의 반대는 [except](#method-except) 메서드를 참고하세요.

> [!NOTE]
> 이 메서드는 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections#method-only) 사용 시 동작이 변경됩니다.


#### `pad()` {#method-pad}

`pad` 메서드는 배열이 지정된 크기에 도달할 때까지 주어진 값으로 배열을 채웁니다. 이 메서드는 [array_pad](https://secure.php.net/manual/en/function.array-pad.php) PHP 함수와 동일하게 동작합니다.

왼쪽으로 패딩하려면 음수 크기를 지정해야 합니다. 주어진 크기의 절대값이 배열 길이보다 작거나 같으면 패딩이 발생하지 않습니다:

```php
$collection = collect(['A', 'B', 'C']);

$filtered = $collection->pad(5, 0);

$filtered->all();

// ['A', 'B', 'C', 0, 0]

$filtered = $collection->pad(-5, 0);

$filtered->all();

// [0, 0, 'A', 'B', 'C']
```


#### `partition()` {#method-partition}

`partition` 메서드는 PHP 배열 구조 분해와 결합하여, 주어진 조건을 통과하는 요소와 그렇지 않은 요소를 분리할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5, 6]);

[$underThree, $equalOrAboveThree] = $collection->partition(function (int $i) {
    return $i < 3;
});

$underThree->all();

// [1, 2]

$equalOrAboveThree->all();

// [3, 4, 5, 6]
```

> [!NOTE]
> 이 메서드는 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections#method-partition)과 상호작용할 때 동작이 변경됩니다.


#### `percentage()` {#method-percentage}

`percentage` 메서드는 컬렉션에서 주어진 조건을 통과하는 항목의 비율(%)을 빠르게 구할 때 사용할 수 있습니다:

```php
$collection = collect([1, 1, 2, 2, 2, 3]);

$percentage = $collection->percentage(fn (int $value) => $value === 1);

// 33.33
```

기본적으로, 비율은 소수점 둘째 자리까지 반올림됩니다. 하지만, 두 번째 인자를 메서드에 전달하여 이 동작을 커스터마이즈할 수 있습니다:

```php
$percentage = $collection->percentage(fn (int $value) => $value === 1, precision: 3);

// 33.333
```


#### `pipe()` {#method-pipe}

`pipe` 메서드는 컬렉션을 주어진 클로저에 전달하고, 실행된 클로저의 결과를 반환합니다:

```php
$collection = collect([1, 2, 3]);

$piped = $collection->pipe(function (Collection $collection) {
    return $collection->sum();
});

// 6
```


#### `pipeInto()` {#method-pipeinto}

`pipeInto` 메서드는 주어진 클래스의 새 인스턴스를 생성하고 컬렉션을 생성자에 전달합니다:

```php
class ResourceCollection
{
    /**
     * 새로운 ResourceCollection 인스턴스를 생성합니다.
     */
    public function __construct(
        public Collection $collection,
    ) {}
}

$collection = collect([1, 2, 3]);

$resource = $collection->pipeInto(ResourceCollection::class);

$resource->collection->all();

// [1, 2, 3]
```


#### `pipeThrough()` {#method-pipethrough}

`pipeThrough` 메서드는 컬렉션을 주어진 클로저 배열에 전달하고, 실행된 클로저의 결과를 반환합니다:

```php
use Illuminate\Support\Collection;

$collection = collect([1, 2, 3]);

$result = $collection->pipeThrough([
    function (Collection $collection) {
        return $collection->merge([4, 5]);
    },
    function (Collection $collection) {
        return $collection->sum();
    },
]);

// 15
```


#### `pluck()` {#method-pluck}

`pluck` 메서드는 주어진 키에 대한 모든 값을 가져옵니다:

```php
$collection = collect([
    ['product_id' => 'prod-100', 'name' => 'Desk'],
    ['product_id' => 'prod-200', 'name' => 'Chair'],
]);

$plucked = $collection->pluck('name');

$plucked->all();

// ['Desk', 'Chair']
```

결과 컬렉션의 키를 지정할 수도 있습니다:

```php
$plucked = $collection->pluck('name', 'product_id');

$plucked->all();

// ['prod-100' => 'Desk', 'prod-200' => 'Chair']
```

`pluck` 메서드는 "점(dot)" 표기법을 사용하여 중첩된 값을 가져오는 것도 지원합니다:

```php
$collection = collect([
    [
        'name' => 'Laracon',
        'speakers' => [
            'first_day' => ['Rosa', 'Judith'],
        ],
    ],
    [
        'name' => 'VueConf',
        'speakers' => [
            'first_day' => ['Abigail', 'Joey'],
        ],
    ],
]);

$plucked = $collection->pluck('speakers.first_day');

$plucked->all();

// [['Rosa', 'Judith'], ['Abigail', 'Joey']]
```

중복된 키가 존재할 경우, 마지막에 일치하는 요소가 plucked 컬렉션에 삽입됩니다:

```php
$collection = collect([
    ['brand' => 'Tesla',  'color' => 'red'],
    ['brand' => 'Pagani', 'color' => 'white'],
    ['brand' => 'Tesla',  'color' => 'black'],
    ['brand' => 'Pagani', 'color' => 'orange'],
]);

$plucked = $collection->pluck('color', 'brand');

$plucked->all();

// ['Tesla' => 'black', 'Pagani' => 'orange']
```


#### `pop()` {#method-pop}

`pop` 메서드는 컬렉션의 마지막 항목을 제거하고 반환합니다. 컬렉션이 비어 있으면 `null`이 반환됩니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->pop();

// 5

$collection->all();

// [1, 2, 3, 4]
```

`pop` 메서드에 정수를 전달하여 컬렉션 끝에서 여러 항목을 제거하고 반환할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->pop(3);

// collect([5, 4, 3])

$collection->all();

// [1, 2]
```


#### `prepend()` {#method-prepend}

`prepend` 메서드는 컬렉션의 시작 부분에 항목을 추가합니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->prepend(0);

$collection->all();

// [0, 1, 2, 3, 4, 5]
```

두 번째 인자를 전달하여 추가되는 항목의 키를 지정할 수도 있습니다:

```php
$collection = collect(['one' => 1, 'two' => 2]);

$collection->prepend(0, 'zero');

$collection->all();

// ['zero' => 0, 'one' => 1, 'two' => 2]
```


#### `pull()` {#method-pull}

`pull` 메서드는 컬렉션에서 주어진 키의 항목을 제거하고 반환합니다:

```php
$collection = collect(['product_id' => 'prod-100', 'name' => 'Desk']);

$collection->pull('name');

// 'Desk'

$collection->all();

// ['product_id' => 'prod-100']
```


#### `push()` {#method-push}

`push` 메서드는 컬렉션의 끝에 항목을 추가합니다:

```php
$collection = collect([1, 2, 3, 4]);

$collection->push(5);

$collection->all();

// [1, 2, 3, 4, 5]
```


#### `put()` {#method-put}

`put` 메서드는 컬렉션에 주어진 키와 값을 설정합니다:

```php
$collection = collect(['product_id' => 1, 'name' => 'Desk']);

$collection->put('price', 100);

$collection->all();

// ['product_id' => 1, 'name' => 'Desk', 'price' => 100]
```


#### `random()` {#method-random}

`random` 메서드는 컬렉션에서 임의의 항목을 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->random();

// 4 - (임의로 추출됨)
```

`random`에 정수를 전달하여 임의로 여러 항목을 추출할 수 있습니다. 반환값은 항상 컬렉션입니다:

```php
$random = $collection->random(3);

$random->all();

// [2, 4, 5] - (임의로 추출됨)
```

컬렉션 인스턴스에 요청한 개수보다 적은 항목이 있으면, `random` 메서드는 `InvalidArgumentException`을 발생시킵니다.

`random` 메서드는 클로저도 받을 수 있으며, 이 클로저는 현재 컬렉션 인스턴스를 전달받습니다:

```php
use Illuminate\Support\Collection;

$random = $collection->random(fn (Collection $items) => min(10, count($items)));

$random->all();

// [1, 2, 3, 4, 5] - (임의로 추출됨)
```


#### `range()` {#method-range}

`range` 메서드는 지정된 범위의 정수를 포함하는 컬렉션을 반환합니다:

```php
$collection = collect()->range(3, 6);

$collection->all();

// [3, 4, 5, 6]
```


#### `reduce()` {#method-reduce}

`reduce` 메서드는 컬렉션을 단일 값으로 축소하며, 각 반복의 결과를 다음 반복에 전달합니다:

```php
$collection = collect([1, 2, 3]);

$total = $collection->reduce(function (?int $carry, int $item) {
    return $carry + $item;
});

// 6
```

첫 번째 반복에서 `$carry`의 값은 `null`입니다. 하지만 두 번째 인자를 `reduce`에 전달하여 초기값을 지정할 수 있습니다:

```php
$collection->reduce(function (int $carry, int $item) {
    return $carry + $item;
}, 4);

// 10
```

`reduce` 메서드는 배열 키도 콜백에 전달합니다:

```php
$collection = collect([
    'usd' => 1400,
    'gbp' => 1200,
    'eur' => 1000,
]);

$ratio = [
    'usd' => 1,
    'gbp' => 1.37,
    'eur' => 1.22,
];

$collection->reduce(function (int $carry, int $value, string $key) use ($ratio) {
    return $carry + ($value * $ratio[$key]);
}, 0);

// 4264
```


#### `reduceSpread()` {#method-reduce-spread}

`reduceSpread` 메서드는 컬렉션을 값의 배열로 축소하며, 각 반복의 결과를 다음 반복에 전달합니다. 이 메서드는 `reduce`와 유사하지만, 여러 개의 초기값을 받을 수 있습니다:

```php
[$creditsRemaining, $batch] = Image::where('status', 'unprocessed')
    ->get()
    ->reduceSpread(function (int $creditsRemaining, Collection $batch, Image $image) {
        if ($creditsRemaining >= $image->creditsRequired()) {
            $batch->push($image);

            $creditsRemaining -= $image->creditsRequired();
        }

        return [$creditsRemaining, $batch];
    }, $creditsAvailable, collect());
```


#### `reject()` {#method-reject}

`reject` 메서드는 주어진 클로저를 사용하여 컬렉션을 필터링합니다. 클로저가 `true`를 반환하면 해당 항목은 결과 컬렉션에서 제거됩니다:

```php
$collection = collect([1, 2, 3, 4]);

$filtered = $collection->reject(function (int $value, int $key) {
    return $value > 2;
});

$filtered->all();

// [1, 2]
```

`reject` 메서드의 반대 동작은 [filter](#method-filter) 메서드를 참고하세요.


#### `replace()` {#method-replace}

`replace` 메서드는 `merge`와 유사하게 동작하지만, 문자열 키를 가진 일치하는 항목을 덮어쓸 뿐만 아니라, 숫자 키를 가진 컬렉션의 항목도 덮어씁니다:

```php
$collection = collect(['Taylor', 'Abigail', 'James']);

$replaced = $collection->replace([1 => 'Victoria', 3 => 'Finn']);

$replaced->all();

// ['Taylor', 'Victoria', 'James', 'Finn']
```


#### `replaceRecursive()` {#method-replacerecursive}

`replaceRecursive` 메서드는 `replace`와 유사하게 동작하지만, 배열 내부로 재귀적으로 들어가서 내부 값에도 동일한 대체 과정을 적용합니다:

```php
$collection = collect([
    'Taylor',
    'Abigail',
    [
        'James',
        'Victoria',
        'Finn'
    ]
]);

$replaced = $collection->replaceRecursive([
    'Charlie',
    2 => [1 => 'King']
]);

$replaced->all();

// ['Charlie', 'Abigail', ['James', 'King', 'Finn']]
```


#### `reverse()` {#method-reverse}

`reverse` 메서드는 컬렉션의 항목 순서를 반대로 뒤집으며, 원래의 키를 유지합니다:

```php
$collection = collect(['a', 'b', 'c', 'd', 'e']);

$reversed = $collection->reverse();

$reversed->all();

/*
    [
        4 => 'e',
        3 => 'd',
        2 => 'c',
        1 => 'b',
        0 => 'a',
    ]
*/
```


#### `search()` {#method-search}

`search` 메서드는 컬렉션에서 주어진 값을 찾아, 발견되면 해당 키를 반환합니다. 항목을 찾지 못하면 `false`를 반환합니다:

```php
$collection = collect([2, 4, 6, 8]);

$collection->search(4);

// 1
```

검색은 "느슨한(loose)" 비교로 수행되므로, 정수 값의 문자열도 동일한 정수와 같다고 간주됩니다. "엄격한(strict)" 비교를 사용하려면 두 번째 인자로 `true`를 전달하세요:

```php
collect([2, 4, 6, 8])->search('4', strict: true);

// false
```

또는, 클로저를 제공하여 주어진 조건을 통과하는 첫 번째 항목을 검색할 수도 있습니다:

```php
collect([2, 4, 6, 8])->search(function (int $item, int $key) {
    return $item > 5;
});

// 2
```


#### `select()` {#method-select}

`select` 메서드는 SQL의 `SELECT` 문과 유사하게, 컬렉션에서 주어진 키만 선택합니다:

```php
$users = collect([
    ['name' => 'Taylor Otwell', 'role' => 'Developer', 'status' => 'active'],
    ['name' => 'Victoria Faith', 'role' => 'Researcher', 'status' => 'active'],
]);

$users->select(['name', 'role']);

/*
    [
        ['name' => 'Taylor Otwell', 'role' => 'Developer'],
        ['name' => 'Victoria Faith', 'role' => 'Researcher'],
    ],
*/
```


#### `shift()` {#method-shift}

`shift` 메서드는 컬렉션의 첫 번째 항목을 제거하고 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->shift();

// 1

$collection->all();

// [2, 3, 4, 5]
```

`shift` 메서드에 정수를 전달하여 컬렉션의 시작 부분에서 여러 항목을 제거하고 반환할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->shift(3);

// collect([1, 2, 3])

$collection->all();

// [4, 5]
```


#### `shuffle()` {#method-shuffle}

`shuffle` 메서드는 컬렉션의 항목을 무작위로 섞습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$shuffled = $collection->shuffle();

$shuffled->all();

// [3, 2, 5, 1, 4] - (무작위로 생성됨)
```


#### `skip()` {#method-skip}

`skip` 메서드는 컬렉션의 시작 부분에서 주어진 개수만큼 요소를 제거한 새로운 컬렉션을 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

$collection = $collection->skip(4);

$collection->all();

// [5, 6, 7, 8, 9, 10]
```


#### `skipUntil()` {#method-skipuntil}

`skipUntil` 메서드는 주어진 콜백이 `false`를 반환하는 동안 컬렉션의 항목을 건너뜁니다. 콜백이 `true`를 반환하면, 남은 모든 항목이 새로운 컬렉션으로 반환됩니다:

```php
$collection = collect([1, 2, 3, 4]);

$subset = $collection->skipUntil(function (int $item) {
    return $item >= 3;
});

$subset->all();

// [3, 4]
```

`skipUntil` 메서드에 단순 값을 전달하여 해당 값이 나올 때까지 모든 항목을 건너뛸 수도 있습니다:

```php
$collection = collect([1, 2, 3, 4]);

$subset = $collection->skipUntil(3);

$subset->all();

// [3, 4]
```

> [!WARNING]
> 주어진 값이 발견되지 않거나 콜백이 한 번도 `true`를 반환하지 않으면, `skipUntil` 메서드는 빈 컬렉션을 반환합니다.


#### `skipWhile()` {#method-skipwhile}

`skipWhile` 메서드는 주어진 콜백이 `true`를 반환하는 동안 컬렉션의 항목을 건너뜁니다. 콜백이 `false`를 반환하면, 남은 모든 항목이 새로운 컬렉션으로 반환됩니다:

```php
$collection = collect([1, 2, 3, 4]);

$subset = $collection->skipWhile(function (int $item) {
    return $item <= 3;
});

$subset->all();

// [4]
```

> [!WARNING]
> 콜백이 한 번도 `false`를 반환하지 않으면, `skipWhile` 메서드는 빈 컬렉션을 반환합니다.


#### `slice()` {#method-slice}

`slice` 메서드는 주어진 인덱스에서 시작하는 컬렉션의 일부를 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

$slice = $collection->slice(4);

$slice->all();

// [5, 6, 7, 8, 9, 10]
```

반환되는 슬라이스의 크기를 제한하려면, 두 번째 인자로 원하는 크기를 전달하세요:

```php
$slice = $collection->slice(4, 2);

$slice->all();

// [5, 6]
```

반환된 슬라이스는 기본적으로 키를 유지합니다. 원래의 키를 유지하지 않으려면 [values](#method-values) 메서드를 사용하여 재인덱싱할 수 있습니다.


#### `sliding()` {#method-sliding}

`sliding` 메서드는 컬렉션의 항목에 대해 "슬라이딩 윈도우" 뷰를 나타내는 청크의 새로운 컬렉션을 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$chunks = $collection->sliding(2);

$chunks->toArray();

// [[1, 2], [2, 3], [3, 4], [4, 5]]
```

이 메서드는 [eachSpread](#method-eachspread) 메서드와 함께 사용할 때 특히 유용합니다:

```php
$transactions->sliding(2)->eachSpread(function (Collection $previous, Collection $current) {
    $current->total = $previous->total + $current->amount;
});
```

선택적으로 두 번째 "step" 값을 전달하여 각 청크의 첫 번째 항목 사이의 거리를 지정할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$chunks = $collection->sliding(3, step: 2);

$chunks->toArray();

// [[1, 2, 3], [3, 4, 5]]
```


#### `sole()` {#method-sole}

`sole` 메서드는 주어진 조건을 통과하는 컬렉션의 첫 번째 요소를 반환하지만, 해당 조건을 정확히 하나의 요소만이 만족할 때만 반환합니다:

```php
collect([1, 2, 3, 4])->sole(function (int $value, int $key) {
    return $value === 2;
});

// 2
```

`sole` 메서드에 키/값 쌍을 전달하여, 해당 쌍과 일치하는 컬렉션의 첫 번째 요소를 반환할 수도 있습니다. 단, 정확히 하나의 요소만 일치해야 합니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 100],
]);

$collection->sole('product', 'Chair');

// ['product' => 'Chair', 'price' => 100]
```

또는, 인자 없이 `sole` 메서드를 호출하여 컬렉션에 요소가 하나만 있을 때 그 요소를 반환할 수도 있습니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
]);

$collection->sole();

// ['product' => 'Desk', 'price' => 200]
```

`sole` 메서드로 반환할 요소가 없으면 `\Illuminate\Collections\ItemNotFoundException` 예외가 발생합니다. 반환할 요소가 둘 이상이면 `\Illuminate\Collections\MultipleItemsFoundException` 예외가 발생합니다.


#### `some()` {#method-some}

[contains](#method-contains) 메서드의 별칭입니다.


#### `sort()` {#method-sort}

`sort` 메서드는 컬렉션을 정렬합니다. 정렬된 컬렉션은 원래 배열의 키를 유지하므로, 아래 예제에서는 [values](#method-values) 메서드를 사용하여 키를 연속된 인덱스로 재설정합니다:

```php
$collection = collect([5, 3, 1, 2, 4]);

$sorted = $collection->sort();

$sorted->values()->all();

// [1, 2, 3, 4, 5]
```

더 복잡한 정렬이 필요하다면, `sort`에 콜백을 전달하여 직접 알고리즘을 구현할 수 있습니다. 컬렉션의 `sort` 메서드는 내부적으로 PHP의 [uasort](https://secure.php.net/manual/en/function.uasort.php#refsect1-function.uasort-parameters)를 호출합니다.

> [!NOTE]
> 중첩 배열이나 객체의 컬렉션을 정렬해야 한다면, [sortBy](#method-sortby) 및 [sortByDesc](#method-sortbydesc) 메서드를 참고하세요.


#### `sortBy()` {#method-sortby}

`sortBy` 메서드는 주어진 키로 컬렉션을 정렬합니다. 정렬된 컬렉션은 원래 배열의 키를 유지하므로, 아래 예제에서는 [values](#method-values) 메서드를 사용하여 키를 연속된 인덱스로 재설정합니다:

```php
$collection = collect([
    ['name' => 'Desk', 'price' => 200],
    ['name' => 'Chair', 'price' => 100],
    ['name' => 'Bookcase', 'price' => 150],
]);

$sorted = $collection->sortBy('price');

$sorted->values()->all();

/*
    [
        ['name' => 'Chair', 'price' => 100],
        ['name' => 'Bookcase', 'price' => 150],
        ['name' => 'Desk', 'price' => 200],
    ]
*/
```

`sortBy` 메서드는 두 번째 인자로 [정렬 플래그](https://www.php.net/manual/en/function.sort.php)를 받을 수 있습니다:

```php
$collection = collect([
    ['title' => 'Item 1'],
    ['title' => 'Item 12'],
    ['title' => 'Item 3'],
]);

$sorted = $collection->sortBy('title', SORT_NATURAL);

$sorted->values()->all();

/*
    [
        ['title' => 'Item 1'],
        ['title' => 'Item 3'],
        ['title' => 'Item 12'],
    ]
*/
```

또는, 컬렉션의 값을 어떻게 정렬할지 직접 결정하는 클로저를 전달할 수도 있습니다:

```php
$collection = collect([
    ['name' => 'Desk', 'colors' => ['Black', 'Mahogany']],
    ['name' => 'Chair', 'colors' => ['Black']],
    ['name' => 'Bookcase', 'colors' => ['Red', 'Beige', 'Brown']],
]);

$sorted = $collection->sortBy(function (array $product, int $key) {
    return count($product['colors']);
});

$sorted->values()->all();

/*
    [
        ['name' => 'Chair', 'colors' => ['Black']],
        ['name' => 'Desk', 'colors' => ['Black', 'Mahogany']],
        ['name' => 'Bookcase', 'colors' => ['Red', 'Beige', 'Brown']],
    ]
*/
```

컬렉션을 여러 속성으로 정렬하려면, `sortBy` 메서드에 정렬 연산의 배열을 전달할 수 있습니다. 각 정렬 연산은 정렬할 속성과 정렬 방향이 포함된 배열이어야 합니다:

```php
$collection = collect([
    ['name' => 'Taylor Otwell', 'age' => 34],
    ['name' => 'Abigail Otwell', 'age' => 30],
    ['name' => 'Taylor Otwell', 'age' => 36],
    ['name' => 'Abigail Otwell', 'age' => 32],
]);

$sorted = $collection->sortBy([
    ['name', 'asc'],
    ['age', 'desc'],
]);

$sorted->values()->all();

/*
    [
        ['name' => 'Abigail Otwell', 'age' => 32],
        ['name' => 'Abigail Otwell', 'age' => 30],
        ['name' => 'Taylor Otwell', 'age' => 36],
        ['name' => 'Taylor Otwell', 'age' => 34],
    ]
*/
```

여러 속성으로 정렬할 때, 각 정렬 연산을 정의하는 클로저를 제공할 수도 있습니다:

```php
$collection = collect([
    ['name' => 'Taylor Otwell', 'age' => 34],
    ['name' => 'Abigail Otwell', 'age' => 30],
    ['name' => 'Taylor Otwell', 'age' => 36],
    ['name' => 'Abigail Otwell', 'age' => 32],
]);

$sorted = $collection->sortBy([
    fn (array $a, array $b) => $a['name'] <=> $b['name'],
    fn (array $a, array $b) => $b['age'] <=> $a['age'],
]);

$sorted->values()->all();

/*
    [
        ['name' => 'Abigail Otwell', 'age' => 32],
        ['name' => 'Abigail Otwell', 'age' => 30],
        ['name' => 'Taylor Otwell', 'age' => 36],
        ['name' => 'Taylor Otwell', 'age' => 34],
    ]
*/
```


#### `sortByDesc()` {#method-sortbydesc}

이 메서드는 [sortBy](#method-sortby) 메서드와 동일한 시그니처를 가지지만, 컬렉션을 반대 순서로 정렬합니다.


#### `sortDesc()` {#method-sortdesc}

이 메서드는 [sort](#method-sort) 메서드와 반대 순서로 컬렉션을 정렬합니다:

```php
$collection = collect([5, 3, 1, 2, 4]);

$sorted = $collection->sortDesc();

$sorted->values()->all();

// [5, 4, 3, 2, 1]
```

`sort`와는 달리, `sortDesc`에는 클로저를 전달할 수 없습니다. 대신 [sort](#method-sort) 메서드를 사용하고 비교를 반대로 하세요.


#### `sortKeys()` {#method-sortkeys}

`sortKeys` 메서드는 내부 연관 배열의 키로 컬렉션을 정렬합니다:

```php
$collection = collect([
    'id' => 22345,
    'first' => 'John',
    'last' => 'Doe',
]);

$sorted = $collection->sortKeys();

$sorted->all();

/*
    [
        'first' => 'John',
        'id' => 22345,
        'last' => 'Doe',
    ]
*/
```


#### `sortKeysDesc()` {#method-sortkeysdesc}

이 메서드는 [sortKeys](#method-sortkeys) 메서드와 동일한 시그니처를 가지지만, 컬렉션을 반대 순서로 정렬합니다.


#### `sortKeysUsing()` {#method-sortkeysusing}

`sortKeysUsing` 메서드는 콜백을 사용하여 내부 연관 배열의 키로 컬렉션을 정렬합니다:

```php
$collection = collect([
    'ID' => 22345,
    'first' => 'John',
    'last' => 'Doe',
]);

$sorted = $collection->sortKeysUsing('strnatcasecmp');

$sorted->all();

/*
    [
        'first' => 'John',
        'ID' => 22345,
        'last' => 'Doe',
    ]
*/
```

콜백은 0보다 작거나, 같거나, 크거나 한 정수를 반환하는 비교 함수여야 합니다. 자세한 내용은 PHP의 [uksort](https://www.php.net/manual/en/function.uksort.php#refsect1-function.uksort-parameters) 문서를 참고하세요. 이 함수는 `sortKeysUsing` 메서드가 내부적으로 사용하는 PHP 함수입니다.


#### `splice()` {#method-splice}

`splice` 메서드는 지정된 인덱스에서 시작하는 항목의 슬라이스를 제거하고 반환합니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$chunk = $collection->splice(2);

$chunk->all();

// [3, 4, 5]

$collection->all();

// [1, 2]
```

두 번째 인자를 전달하여 결과 컬렉션의 크기를 제한할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$chunk = $collection->splice(2, 1);

$chunk->all();

// [3]

$collection->all();

// [1, 2, 4, 5]
```

또한, 세 번째 인자로 제거된 항목을 대체할 새 항목을 전달할 수 있습니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$chunk = $collection->splice(2, 1, [10, 11]);

$chunk->all();

// [3]

$collection->all();

// [1, 2, 10, 11, 4, 5]
```


#### `split()` {#method-split}

`split` 메서드는 컬렉션을 주어진 개수의 그룹으로 나눕니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$groups = $collection->split(3);

$groups->all();

// [[1, 2], [3, 4], [5]]
```


#### `splitIn()` {#method-splitin}

`splitIn` 메서드는 컬렉션을 주어진 개수의 그룹으로 나누며, 마지막 그룹을 할당하기 전에 비종단 그룹을 완전히 채웁니다:

```php
$collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

$groups = $collection->splitIn(3);

$groups->all();

// [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]]
```


#### `sum()` {#method-sum}

`sum` 메서드는 컬렉션의 모든 항목의 합계를 반환합니다:

```php
collect([1, 2, 3, 4, 5])->sum();

// 15
```

컬렉션에 중첩 배열이나 객체가 포함되어 있다면, 합계를 구할 값을 결정할 키를 전달해야 합니다:

```php
$collection = collect([
    ['name' => 'JavaScript: The Good Parts', 'pages' => 176],
    ['name' => 'JavaScript: The Definitive Guide', 'pages' => 1096],
]);

$collection->sum('pages');

// 1272
```

또한, 컬렉션에서 합계를 구할 값을 결정하는 클로저를 직접 전달할 수도 있습니다:

```php
$collection = collect([
    ['name' => 'Chair', 'colors' => ['Black']],
    ['name' => 'Desk', 'colors' => ['Black', 'Mahogany']],
    ['name' => 'Bookcase', 'colors' => ['Red', 'Beige', 'Brown']],
]);

$collection->sum(function (array $product) {
    return count($product['colors']);
});

// 6
```


#### `take()` {#method-take}

`take` 메서드는 지정된 개수만큼의 항목을 가진 새로운 컬렉션을 반환합니다:

```php
$collection = collect([0, 1, 2, 3, 4, 5]);

$chunk = $collection->take(3);

$chunk->all();

// [0, 1, 2]
```

음수를 전달하면 컬렉션의 끝에서 지정된 개수만큼의 항목을 가져옵니다:

```php
$collection = collect([0, 1, 2, 3, 4, 5]);

$chunk = $collection->take(-2);

$chunk->all();

// [4, 5]
```


#### `takeUntil()` {#method-takeuntil}

`takeUntil` 메서드는 주어진 콜백이 `true`를 반환할 때까지 컬렉션의 항목을 반환합니다:

```php
$collection = collect([1, 2, 3, 4]);

$subset = $collection->takeUntil(function (int $item) {
    return $item >= 3;
});

$subset->all();

// [1, 2]
```

`takeUntil` 메서드에 단순 값을 전달하여 해당 값이 나올 때까지 항목을 가져올 수도 있습니다:

```php
$collection = collect([1, 2, 3, 4]);

$subset = $collection->takeUntil(3);

$subset->all();

// [1, 2]
```

> [!WARNING]
> 주어진 값이 발견되지 않거나 콜백이 한 번도 `true`를 반환하지 않으면, `takeUntil` 메서드는 컬렉션의 모든 항목을 반환합니다.


#### `takeWhile()` {#method-takewhile}

`takeWhile` 메서드는 주어진 콜백이 `false`를 반환할 때까지 컬렉션의 항목을 반환합니다:

```php
$collection = collect([1, 2, 3, 4]);

$subset = $collection->takeWhile(function (int $item) {
    return $item < 3;
});

$subset->all();

// [1, 2]
```

> [!WARNING]
> 콜백이 한 번도 `false`를 반환하지 않으면, `takeWhile` 메서드는 컬렉션의 모든 항목을 반환합니다.


#### `tap()` {#method-tap}

`tap` 메서드는 컬렉션을 주어진 콜백에 전달하여, 컬렉션 자체에는 영향을 주지 않으면서 특정 시점에 컬렉션을 "탭"하여 항목을 처리할 수 있게 합니다. `tap` 메서드는 컬렉션을 반환합니다:

```php
collect([2, 4, 3, 1, 5])
    ->sort()
    ->tap(function (Collection $collection) {
        Log::debug('정렬 후 값', $collection->values()->all());
    })
    ->shift();

// 1
```


#### `times()` {#method-times}

정적 `times` 메서드는 주어진 클로저를 지정된 횟수만큼 호출하여 새로운 컬렉션을 생성합니다:

```php
$collection = Collection::times(10, function (int $number) {
    return $number * 9;
});

$collection->all();

// [9, 18, 27, 36, 45, 54, 63, 72, 81, 90]
```


#### `toArray()` {#method-toarray}

`toArray` 메서드는 컬렉션을 일반 PHP `array`로 변환합니다. 컬렉션의 값이 [Eloquent](/laravel/12.x/eloquent) 모델인 경우, 모델도 배열로 변환됩니다:

```php
$collection = collect(['name' => 'Desk', 'price' => 200]);

$collection->toArray();

/*
    [
        ['name' => 'Desk', 'price' => 200],
    ]
*/
```

> [!WARNING]
> `toArray`는 컬렉션의 모든 중첩 객체 중 `Arrayable` 인스턴스도 배열로 변환합니다. 컬렉션의 원시 배열을 얻고 싶다면 [all](#method-all) 메서드를 사용하세요.


#### `toJson()` {#method-tojson}

`toJson` 메서드는 컬렉션을 JSON 직렬화된 문자열로 변환합니다:

```php
$collection = collect(['name' => 'Desk', 'price' => 200]);

$collection->toJson();

// '{"name":"Desk", "price":200}'
```


#### `transform()` {#method-transform}

`transform` 메서드는 컬렉션을 반복하며, 각 항목에 대해 주어진 콜백을 호출합니다. 컬렉션의 항목은 콜백이 반환한 값으로 대체됩니다:

```php
$collection = collect([1, 2, 3, 4, 5]);

$collection->transform(function (int $item, int $key) {
    return $item * 2;
});

$collection->all();

// [2, 4, 6, 8, 10]
```

> [!WARNING]
> 대부분의 다른 컬렉션 메서드와 달리, `transform`은 컬렉션 자체를 변경합니다. 새로운 컬렉션을 생성하려면 [map](#method-map) 메서드를 사용하세요.


#### `undot()` {#method-undot}

`undot` 메서드는 "점(dot)" 표기법을 사용하는 1차원 컬렉션을 다차원 컬렉션으로 확장합니다:

```php
$person = collect([
    'name.first_name' => 'Marie',
    'name.last_name' => 'Valentine',
    'address.line_1' => '2992 Eagle Drive',
    'address.line_2' => '',
    'address.suburb' => 'Detroit',
    'address.state' => 'MI',
    'address.postcode' => '48219'
]);

$person = $person->undot();

$person->toArray();

/*
    [
        "name" => [
            "first_name" => "Marie",
            "last_name" => "Valentine",
        ],
        "address" => [
            "line_1" => "2992 Eagle Drive",
            "line_2" => "",
            "suburb" => "Detroit",
            "state" => "MI",
            "postcode" => "48219",
        ],
    ]
*/
```


#### `union()` {#method-union}

`union` 메서드는 주어진 배열을 컬렉션에 추가합니다. 주어진 배열에 원래 컬렉션에 이미 있는 키가 있으면, 원래 컬렉션의 값이 우선됩니다:

```php
$collection = collect([1 => ['a'], 2 => ['b']]);

$union = $collection->union([3 => ['c'], 1 => ['d']]);

$union->all();

// [1 => ['a'], 2 => ['b'], 3 => ['c']]
```


#### `unique()` {#method-unique}

`unique` 메서드는 컬렉션의 고유한 모든 항목을 반환합니다. 반환된 컬렉션은 원래 배열의 키를 유지하므로, 아래 예제에서는 [values](#method-values) 메서드를 사용하여 키를 연속된 인덱스로 재설정합니다:

```php
$collection = collect([1, 1, 2, 2, 3, 4, 2]);

$unique = $collection->unique();

$unique->values()->all();

// [1, 2, 3, 4]
```

중첩 배열이나 객체를 다룰 때, 고유성을 결정할 키를 지정할 수 있습니다:

```php
$collection = collect([
    ['name' => 'iPhone 6', 'brand' => 'Apple', 'type' => 'phone'],
    ['name' => 'iPhone 5', 'brand' => 'Apple', 'type' => 'phone'],
    ['name' => 'Apple Watch', 'brand' => 'Apple', 'type' => 'watch'],
    ['name' => 'Galaxy S6', 'brand' => 'Samsung', 'type' => 'phone'],
    ['name' => 'Galaxy Gear', 'brand' => 'Samsung', 'type' => 'watch'],
]);

$unique = $collection->unique('brand');

$unique->values()->all();

/*
    [
        ['name' => 'iPhone 6', 'brand' => 'Apple', 'type' => 'phone'],
        ['name' => 'Galaxy S6', 'brand' => 'Samsung', 'type' => 'phone'],
    ]
*/
```

마지막으로, `unique` 메서드에 클로저를 전달하여 항목의 고유성을 결정할 값을 지정할 수도 있습니다:

```php
$unique = $collection->unique(function (array $item) {
    return $item['brand'].$item['type'];
});

$unique->values()->all();

/*
    [
        ['name' => 'iPhone 6', 'brand' => 'Apple', 'type' => 'phone'],
        ['name' => 'Apple Watch', 'brand' => 'Apple', 'type' => 'watch'],
        ['name' => 'Galaxy S6', 'brand' => 'Samsung', 'type' => 'phone'],
        ['name' => 'Galaxy Gear', 'brand' => 'Samsung', 'type' => 'watch'],
    ]
*/
```

`unique` 메서드는 항목 값을 비교할 때 "느슨한(loose)" 비교를 사용합니다. 즉, 정수 값의 문자열도 동일한 정수와 같다고 간주됩니다. "엄격한(strict)" 비교로 필터링하려면 [uniqueStrict](#method-uniquestrict) 메서드를 사용하세요.

> [!NOTE]
> [Eloquent Collections](/laravel/12.x/eloquent-collections#method-unique)를 사용할 때 이 메서드의 동작이 변경됩니다.


#### `uniqueStrict()` {#method-uniquestrict}

이 메서드는 [unique](#method-unique) 메서드와 동일한 시그니처를 가지지만, 모든 값을 "엄격한(strict)" 비교로 비교합니다.


#### `unless()` {#method-unless}

`unless` 메서드는 첫 번째 인자가 `true`로 평가되지 않을 때 주어진 콜백을 실행합니다. 컬렉션 인스턴스와 `unless` 메서드에 전달된 첫 번째 인자가 클로저에 제공됩니다:

```php
$collection = collect([1, 2, 3]);

$collection->unless(true, function (Collection $collection, bool $value) {
    return $collection->push(4);
});

$collection->unless(false, function (Collection $collection, bool $value) {
    return $collection->push(5);
});

$collection->all();

// [1, 2, 3, 5]
```

`unless` 메서드에 두 번째 콜백을 전달할 수 있습니다. 두 번째 콜백은 첫 번째 인자가 `true`로 평가될 때 실행됩니다:

```php
$collection = collect([1, 2, 3]);

$collection->unless(true, function (Collection $collection, bool $value) {
    return $collection->push(4);
}, function (Collection $collection, bool $value) {
    return $collection->push(5);
});

$collection->all();

// [1, 2, 3, 5]
```

`unless`의 반대 동작은 [when](#method-when) 메서드를 참고하세요.


#### `unlessEmpty()` {#method-unlessempty}

[whenNotEmpty](#method-whennotempty) 메서드의 별칭입니다.


#### `unlessNotEmpty()` {#method-unlessnotempty}

[whenEmpty](#method-whenempty) 메서드의 별칭입니다.


#### `unwrap()` {#method-unwrap}

정적 `unwrap` 메서드는 해당 값이 컬렉션일 경우 컬렉션의 내부 항목을 반환합니다:

```php
Collection::unwrap(collect('John Doe'));

// ['John Doe']

Collection::unwrap(['John Doe']);

// ['John Doe']

Collection::unwrap('John Doe');

// 'John Doe'
```


#### `value()` {#method-value}

`value` 메서드는 컬렉션의 첫 번째 요소에서 주어진 값을 가져옵니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Speaker', 'price' => 400],
]);

$value = $collection->value('price');

// 200
```


#### `values()` {#method-values}

`values` 메서드는 키를 연속된 정수로 재설정한 새로운 컬렉션을 반환합니다:

```php
$collection = collect([
    10 => ['product' => 'Desk', 'price' => 200],
    11 => ['product' => 'Desk', 'price' => 200],
]);

$values = $collection->values();

$values->all();

/*
    [
        0 => ['product' => 'Desk', 'price' => 200],
        1 => ['product' => 'Desk', 'price' => 200],
    ]
*/
```


#### `when()` {#method-when}

`when` 메서드는 첫 번째 인자가 `true`로 평가될 때 주어진 콜백을 실행합니다. 컬렉션 인스턴스와 `when` 메서드에 전달된 첫 번째 인자가 클로저에 제공됩니다:

```php
$collection = collect([1, 2, 3]);

$collection->when(true, function (Collection $collection, bool $value) {
    return $collection->push(4);
});

$collection->when(false, function (Collection $collection, bool $value) {
    return $collection->push(5);
});

$collection->all();

// [1, 2, 3, 4]
```

`when` 메서드에 두 번째 콜백을 전달할 수 있습니다. 두 번째 콜백은 첫 번째 인자가 `false`로 평가될 때 실행됩니다:

```php
$collection = collect([1, 2, 3]);

$collection->when(false, function (Collection $collection, bool $value) {
    return $collection->push(4);
}, function (Collection $collection, bool $value) {
    return $collection->push(5);
});

$collection->all();

// [1, 2, 3, 5]
```

`when`의 반대 동작은 [unless](#method-unless) 메서드를 참고하세요.


#### `whenEmpty()` {#method-whenempty}

`whenEmpty` 메서드는 컬렉션이 비어 있을 때 주어진 콜백을 실행합니다:

```php
$collection = collect(['Michael', 'Tom']);

$collection->whenEmpty(function (Collection $collection) {
    return $collection->push('Adam');
});

$collection->all();

// ['Michael', 'Tom']

$collection = collect();

$collection->whenEmpty(function (Collection $collection) {
    return $collection->push('Adam');
});

$collection->all();

// ['Adam']
```

`whenEmpty` 메서드에 두 번째 클로저를 전달하여, 컬렉션이 비어 있지 않을 때 실행할 수 있습니다:

```php
$collection = collect(['Michael', 'Tom']);

$collection->whenEmpty(function (Collection $collection) {
    return $collection->push('Adam');
}, function (Collection $collection) {
    return $collection->push('Taylor');
});

$collection->all();

// ['Michael', 'Tom', 'Taylor']
```

`whenEmpty`의 반대 동작은 [whenNotEmpty](#method-whennotempty) 메서드를 참고하세요.


#### `whenNotEmpty()` {#method-whennotempty}

`whenNotEmpty` 메서드는 컬렉션이 비어 있지 않을 때 주어진 콜백을 실행합니다:

```php
$collection = collect(['Michael', 'Tom']);

$collection->whenNotEmpty(function (Collection $collection) {
    return $collection->push('Adam');
});

$collection->all();

// ['Michael', 'Tom', 'Adam']

$collection = collect();

$collection->whenNotEmpty(function (Collection $collection) {
    return $collection->push('Adam');
});

$collection->all();

// []
```

`whenNotEmpty` 메서드에 두 번째 클로저를 전달하여, 컬렉션이 비어 있을 때 실행할 수 있습니다:

```php
$collection = collect();

$collection->whenNotEmpty(function (Collection $collection) {
    return $collection->push('Adam');
}, function (Collection $collection) {
    return $collection->push('Taylor');
});

$collection->all();

// ['Taylor']
```

`whenNotEmpty`의 반대 동작은 [whenEmpty](#method-whenempty) 메서드를 참고하세요.


#### `where()` {#method-where}

`where` 메서드는 주어진 키/값 쌍으로 컬렉션을 필터링합니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 100],
    ['product' => 'Bookcase', 'price' => 150],
    ['product' => 'Door', 'price' => 100],
]);

$filtered = $collection->where('price', 100);

$filtered->all();

/*
    [
        ['product' => 'Chair', 'price' => 100],
        ['product' => 'Door', 'price' => 100],
    ]
*/
```

`where` 메서드는 항목 값을 비교할 때 "느슨한(loose)" 비교를 사용합니다. 즉, 정수 값의 문자열도 동일한 정수와 같다고 간주됩니다. "엄격한(strict)" 비교로 필터링하려면 [whereStrict](#method-wherestrict) 메서드를 사용하세요.

선택적으로, 두 번째 인자로 비교 연산자를 전달할 수 있습니다. 지원되는 연산자는: '===', '!==', '!=', '==', '=', '<>', '>', '<', '>=', '<=' 입니다:

```php
$collection = collect([
    ['name' => 'Jim', 'deleted_at' => '2019-01-01 00:00:00'],
    ['name' => 'Sally', 'deleted_at' => '2019-01-02 00:00:00'],
    ['name' => 'Sue', 'deleted_at' => null],
]);

$filtered = $collection->where('deleted_at', '!=', null);

$filtered->all();

/*
    [
        ['name' => 'Jim', 'deleted_at' => '2019-01-01 00:00:00'],
        ['name' => 'Sally', 'deleted_at' => '2019-01-02 00:00:00'],
    ]
*/
```


#### `whereStrict()` {#method-wherestrict}

이 메서드는 [where](#method-where) 메서드와 동일한 시그니처를 가지지만, 모든 값을 "엄격한(strict)" 비교로 비교합니다.


#### `whereBetween()` {#method-wherebetween}

`whereBetween` 메서드는 지정된 항목 값이 주어진 범위 내에 있는지 확인하여 컬렉션을 필터링합니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 80],
    ['product' => 'Bookcase', 'price' => 150],
    ['product' => 'Pencil', 'price' => 30],
    ['product' => 'Door', 'price' => 100],
]);

$filtered = $collection->whereBetween('price', [100, 200]);

$filtered->all();

/*
    [
        ['product' => 'Desk', 'price' => 200],
        ['product' => 'Bookcase', 'price' => 150],
        ['product' => 'Door', 'price' => 100],
    ]
*/
```


#### `whereIn()` {#method-wherein}

`whereIn` 메서드는 지정된 항목 값이 주어진 배열에 포함되지 않은 요소를 컬렉션에서 제거합니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 100],
    ['product' => 'Bookcase', 'price' => 150],
    ['product' => 'Door', 'price' => 100],
]);

$filtered = $collection->whereIn('price', [150, 200]);

$filtered->all();

/*
    [
        ['product' => 'Desk', 'price' => 200],
        ['product' => 'Bookcase', 'price' => 150],
    ]
*/
```

`whereIn` 메서드는 항목 값을 비교할 때 "느슨한(loose)" 비교를 사용합니다. "엄격한(strict)" 비교로 필터링하려면 [whereInStrict](#method-whereinstrict) 메서드를 사용하세요.


#### `whereInStrict()` {#method-whereinstrict}

이 메서드는 [whereIn](#method-wherein) 메서드와 동일한 시그니처를 가지지만, 모든 값을 "엄격한(strict)" 비교로 비교합니다.


#### `whereInstanceOf()` {#method-whereinstanceof}

`whereInstanceOf` 메서드는 주어진 클래스 타입으로 컬렉션을 필터링합니다:

```php
use App\Models\User;
use App\Models\Post;

$collection = collect([
    new User,
    new User,
    new Post,
]);

$filtered = $collection->whereInstanceOf(User::class);

$filtered->all();

// [App\Models\User, App\Models\User]
```


#### `whereNotBetween()` {#method-wherenotbetween}

`whereNotBetween` 메서드는 지정된 항목 값이 주어진 범위 밖에 있는지 확인하여 컬렉션을 필터링합니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 80],
    ['product' => 'Bookcase', 'price' => 150],
    ['product' => 'Pencil', 'price' => 30],
    ['product' => 'Door', 'price' => 100],
]);

$filtered = $collection->whereNotBetween('price', [100, 200]);

$filtered->all();

/*
    [
        ['product' => 'Chair', 'price' => 80],
        ['product' => 'Pencil', 'price' => 30],
    ]
*/
```


#### `whereNotIn()` {#method-wherenotin}

`whereNotIn` 메서드는 지정된 항목 값이 주어진 배열에 포함된 요소를 컬렉션에서 제거합니다:

```php
$collection = collect([
    ['product' => 'Desk', 'price' => 200],
    ['product' => 'Chair', 'price' => 100],
    ['product' => 'Bookcase', 'price' => 150],
    ['product' => 'Door', 'price' => 100],
]);

$filtered = $collection->whereNotIn('price', [150, 200]);

$filtered->all();

/*
    [
        ['product' => 'Chair', 'price' => 100],
        ['product' => 'Door', 'price' => 100],
    ]
*/
```

`whereNotIn` 메서드는 항목 값을 비교할 때 "느슨한(loose)" 비교를 사용합니다. "엄격한(strict)" 비교로 필터링하려면 [whereNotInStrict](#method-wherenotinstrict) 메서드를 사용하세요.


#### `whereNotInStrict()` {#method-wherenotinstrict}

이 메서드는 [whereNotIn](#method-wherenotin) 메서드와 동일한 시그니처를 가지지만, 모든 값을 "엄격한(strict)" 비교로 비교합니다.


#### `whereNotNull()` {#method-wherenotnull}

`whereNotNull` 메서드는 주어진 키가 `null`이 아닌 컬렉션의 항목을 반환합니다:

```php
$collection = collect([
    ['name' => 'Desk'],
    ['name' => null],
    ['name' => 'Bookcase'],
]);

$filtered = $collection->whereNotNull('name');

$filtered->all();

/*
    [
        ['name' => 'Desk'],
        ['name' => 'Bookcase'],
    ]
*/
```


#### `whereNull()` {#method-wherenull}

`whereNull` 메서드는 주어진 키가 `null`인 컬렉션의 항목을 반환합니다:

```php
$collection = collect([
    ['name' => 'Desk'],
    ['name' => null],
    ['name' => 'Bookcase'],
]);

$filtered = $collection->whereNull('name');

$filtered->all();

/*
    [
        ['name' => null],
    ]
*/
```


#### `wrap()` {#method-wrap}

정적 `wrap` 메서드는 해당 값이 컬렉션일 경우 컬렉션으로 감쌉니다:

```php
use Illuminate\Support\Collection;

$collection = Collection::wrap('John Doe');

$collection->all();

// ['John Doe']

$collection = Collection::wrap(['John Doe']);

$collection->all();

// ['John Doe']

$collection = Collection::wrap(collect('John Doe'));

$collection->all();

// ['John Doe']
```


#### `zip()` {#method-zip}

`zip` 메서드는 주어진 배열의 값과 원래 컬렉션의 값을 각 인덱스에 맞게 합칩니다:

```php
$collection = collect(['Chair', 'Desk']);

$zipped = $collection->zip([100, 200]);

$zipped->all();

// [['Chair', 100], ['Desk', 200]]
```


## 고차 메시지(Higher Order Messages) {#higher-order-messages}

컬렉션은 "고차 메시지(higher order messages)"도 지원합니다. 이는 컬렉션에서 자주 사용하는 동작을 간단하게 수행할 수 있는 단축키입니다. 고차 메시지를 제공하는 컬렉션 메서드는 다음과 같습니다: [average](#method-average), [avg](#method-avg), [contains](#method-contains), [each](#method-each), [every](#method-every), [filter](#method-filter), [first](#method-first), [flatMap](#method-flatmap), [groupBy](#method-groupby), [keyBy](#method-keyby), [map](#method-map), [max](#method-max), [min](#method-min), [partition](#method-partition), [reject](#method-reject), [skipUntil](#method-skipuntil), [skipWhile](#method-skipwhile), [some](#method-some), [sortBy](#method-sortby), [sortByDesc](#method-sortbydesc), [sum](#method-sum), [takeUntil](#method-takeuntil), [takeWhile](#method-takewhile), [unique](#method-unique).

각 고차 메시지는 컬렉션 인스턴스의 동적 프로퍼티로 접근할 수 있습니다. 예를 들어, `each` 고차 메시지를 사용하여 컬렉션 내의 각 객체에 메서드를 호출할 수 있습니다:

```php
use App\Models\User;

$users = User::where('votes', '>', 500)->get();

$users->each->markAsVip();
```

마찬가지로, `sum` 고차 메시지를 사용하여 사용자 컬렉션의 "votes" 총합을 구할 수 있습니다:

```php
$users = User::where('group', 'Development')->get();

return $users->sum->votes;
```


## 지연 컬렉션(Lazy Collections) {#lazy-collections}


### 소개 {#lazy-collection-introduction}

> [!WARNING]
> Laravel의 지연 컬렉션을 더 배우기 전에, [PHP 제너레이터](https://www.php.net/manual/en/language.generators.overview.php)에 익숙해지는 시간을 가지세요.

이미 강력한 `Collection` 클래스를 보완하기 위해, `LazyCollection` 클래스는 PHP의 [제너레이터](https://www.php.net/manual/en/language.generators.overview.php)를 활용하여 매우 큰 데이터셋을 다루면서도 메모리 사용량을 낮게 유지할 수 있게 해줍니다.

예를 들어, 애플리케이션에서 수 기가바이트 크기의 로그 파일을 처리하면서 Laravel의 컬렉션 메서드를 사용해 로그를 파싱해야 한다고 가정해봅시다. 전체 파일을 한 번에 메모리로 읽어들이는 대신, 지연 컬렉션을 사용하면 한 번에 파일의 일부만 메모리에 유지할 수 있습니다:

```php
use App\Models\LogEntry;
use Illuminate\Support\LazyCollection;

LazyCollection::make(function () {
    $handle = fopen('log.txt', 'r');

    while (($line = fgets($handle)) !== false) {
        yield $line;
    }

    fclose($handle);
})->chunk(4)->map(function (array $lines) {
    return LogEntry::fromLines($lines);
})->each(function (LogEntry $logEntry) {
    // 로그 항목을 처리합니다...
});
```

또는, 10,000개의 Eloquent 모델을 반복해야 한다고 가정해봅시다. 기존의 Laravel 컬렉션을 사용할 경우, 10,000개의 Eloquent 모델을 한 번에 모두 메모리에 로드해야 합니다:

```php
use App\Models\User;

$users = User::all()->filter(function (User $user) {
    return $user->id > 500;
});
```

하지만, 쿼리 빌더의 `cursor` 메서드는 `LazyCollection` 인스턴스를 반환합니다. 이를 통해 데이터베이스에 단일 쿼리만 실행하면서도, 한 번에 하나의 Eloquent 모델만 메모리에 유지할 수 있습니다. 이 예제에서 `filter` 콜백은 실제로 각 사용자를 개별적으로 반복할 때까지 실행되지 않으므로, 메모리 사용량이 크게 줄어듭니다:

```php
use App\Models\User;

$users = User::cursor()->filter(function (User $user) {
    return $user->id > 500;
});

foreach ($users as $user) {
    echo $user->id;
}
```


### 지연 컬렉션 생성하기 {#creating-lazy-collections}

지연 컬렉션 인스턴스를 생성하려면, 컬렉션의 `make` 메서드에 PHP 제너레이터 함수를 전달해야 합니다:

```php
use Illuminate\Support\LazyCollection;

LazyCollection::make(function () {
    $handle = fopen('log.txt', 'r');

    while (($line = fgets($handle)) !== false) {
        yield $line;
    }

    fclose($handle);
});
```


### Enumerable 계약 {#the-enumerable-contract}

`Collection` 클래스에서 사용할 수 있는 거의 모든 메서드는 `LazyCollection` 클래스에서도 사용할 수 있습니다. 이 두 클래스는 모두 `Illuminate\Support\Enumerable` 계약을 구현하며, 이 계약에는 다음과 같은 메서드가 정의되어 있습니다:

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

<div class="collection-method-list" markdown="1">

[all](#method-all)
[average](#method-average)
[avg](#method-avg)
[chunk](#method-chunk)
[chunkWhile](#method-chunkwhile)
[collapse](#method-collapse)
[collect](#method-collect)
[combine](#method-combine)
[concat](#method-concat)
[contains](#method-contains)
[containsStrict](#method-containsstrict)
[count](#method-count)
[countBy](#method-countBy)
[crossJoin](#method-crossjoin)
[dd](#method-dd)
[diff](#method-diff)
[diffAssoc](#method-diffassoc)
[diffKeys](#method-diffkeys)
[dump](#method-dump)
[duplicates](#method-duplicates)
[duplicatesStrict](#method-duplicatesstrict)
[each](#method-each)
[eachSpread](#method-eachspread)
[every](#method-every)
[except](#method-except)
[filter](#method-filter)
[first](#method-first)
[firstOrFail](#method-first-or-fail)
[firstWhere](#method-first-where)
[flatMap](#method-flatmap)
[flatten](#method-flatten)
[flip](#method-flip)
[forPage](#method-forpage)
[get](#method-get)
[groupBy](#method-groupby)
[has](#method-has)
[implode](#method-implode)
[intersect](#method-intersect)
[intersectAssoc](#method-intersectAssoc)
[intersectByKeys](#method-intersectbykeys)
[isEmpty](#method-isempty)
[isNotEmpty](#method-isnotempty)
[join](#method-join)
[keyBy](#method-keyby)
[keys](#method-keys)
[last](#method-last)
[macro](#method-macro)
[make](#method-make)
[map](#method-map)
[mapInto](#method-mapinto)
[mapSpread](#method-mapspread)
[mapToGroups](#method-maptogroups)
[mapWithKeys](#method-mapwithkeys)
[max](#method-max)
[median](#method-median)
[merge](#method-merge)
[mergeRecursive](#method-mergerecursive)
[min](#method-min)
[mode](#method-mode)
[nth](#method-nth)
[only](#method-only)
[pad](#method-pad)
[partition](#method-partition)
[pipe](#method-pipe)
[pluck](#method-pluck)
[random](#method-random)
[reduce](#method-reduce)
[reject](#method-reject)
[replace](#method-replace)
[replaceRecursive](#method-replacerecursive)
[reverse](#method-reverse)
[search](#method-search)
[shuffle](#method-shuffle)
[skip](#method-skip)
[slice](#method-slice)
[sole](#method-sole)
[some](#method-some)
[sort](#method-sort)
[sortBy](#method-sortby)
[sortByDesc](#method-sortbydesc)
[sortKeys](#method-sortkeys)
[sortKeysDesc](#method-sortkeysdesc)
[split](#method-split)
[sum](#method-sum)
[take](#method-take)
[tap](#method-tap)
[times](#method-times)
[toArray](#method-toarray)
[toJson](#method-tojson)
[union](#method-union)
[unique](#method-unique)
[uniqueStrict](#method-uniquestrict)
[unless](#method-unless)
[unlessEmpty](#method-unlessempty)
[unlessNotEmpty](#method-unlessnotempty)
[unwrap](#method-unwrap)
[values](#method-values)
[when](#method-when)
[whenEmpty](#method-whenempty)
[whenNotEmpty](#method-whennotempty)
[where](#method-where)
[whereStrict](#method-wherestrict)
[whereBetween](#method-wherebetween)
[whereIn](#method-wherein)
[whereInStrict](#method-whereinstrict)
[whereInstanceOf](#method-whereinstanceof)
[whereNotBetween](#method-wherenotbetween)
[whereNotIn](#method-wherenotin)
[whereNotInStrict](#method-wherenotinstrict)
[wrap](#method-wrap)
[zip](#method-zip)

</div>

> [!WARNING]
> 컬렉션을 변경하는 메서드(예: `shift`, `pop`, `prepend` 등)는 `LazyCollection` 클래스에서 **사용할 수 없습니다**.


### 지연 컬렉션 메서드 {#lazy-collection-methods}

`Enumerable` 계약에 정의된 메서드 외에도, `LazyCollection` 클래스에는 다음과 같은 메서드가 있습니다:


#### `takeUntilTimeout()` {#method-takeUntilTimeout}

`takeUntilTimeout` 메서드는 지정된 시간까지 값을 열거하는 새로운 지연 컬렉션을 반환합니다. 그 시간이 지나면 컬렉션은 열거를 중단합니다:

```php
$lazyCollection = LazyCollection::times(INF)
    ->takeUntilTimeout(now()->addMinute());

$lazyCollection->each(function (int $number) {
    dump($number);

    sleep(1);
});

// 1
// 2
// ...
// 58
// 59
```

이 메서드의 사용 예시로, 데이터베이스에서 청구서를 커서로 제출하는 애플리케이션을 상상해보세요. 15분마다 실행되는 [스케줄 작업](/laravel/12.x/scheduling)을 정의하고, 최대 14분 동안만 청구서를 처리할 수 있습니다:

```php
use App\Models\Invoice;
use Illuminate\Support\Carbon;

Invoice::pending()->cursor()
    ->takeUntilTimeout(
        Carbon::createFromTimestamp(LARAVEL_START)->add(14, 'minutes')
    )
    ->each(fn (Invoice $invoice) => $invoice->submit());
```


#### `tapEach()` {#method-tapEach}

`each` 메서드는 컬렉션의 각 항목에 대해 즉시 주어진 콜백을 호출하지만, `tapEach` 메서드는 항목이 하나씩 리스트에서 꺼내질 때만 콜백을 호출합니다:

```php
// 아직 아무것도 dump되지 않았습니다...
$lazyCollection = LazyCollection::times(INF)->tapEach(function (int $value) {
    dump($value);
});

// 세 개의 항목이 dump됩니다...
$array = $lazyCollection->take(3)->all();

// 1
// 2
// 3
```


#### `throttle()` {#method-throttle}

`throttle` 메서드는 지연 컬렉션을 지정된 초마다 하나씩 값을 반환하도록 제한합니다. 이 메서드는 외부 API와 상호작용할 때 요청 제한이 있는 경우에 특히 유용합니다:

```php
use App\Models\User;

User::where('vip', true)
    ->cursor()
    ->throttle(seconds: 1)
    ->each(function (User $user) {
        // 외부 API 호출...
    });
```


#### `remember()` {#method-remember}

`remember` 메서드는 이미 열거된 값을 기억하고, 이후 컬렉션 열거 시 다시 가져오지 않는 새로운 지연 컬렉션을 반환합니다:

```php
// 아직 쿼리가 실행되지 않았습니다...
$users = User::cursor()->remember();

// 쿼리가 실행됩니다...
// 처음 5명의 사용자가 데이터베이스에서 하이드레이션됩니다...
$users->take(5)->all();

// 처음 5명의 사용자는 컬렉션의 캐시에서 가져옵니다...
// 나머지는 데이터베이스에서 하이드레이션됩니다...
$users->take(20)->all();
```
