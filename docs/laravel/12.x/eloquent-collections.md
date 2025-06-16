# Eloquent: 컬렉션






## 소개 {#introduction}

여러 개의 모델 결과를 반환하는 모든 Eloquent 메서드는 `Illuminate\Database\Eloquent\Collection` 클래스의 인스턴스를 반환합니다. 이는 `get` 메서드를 통해 조회한 결과나 관계를 통해 접근한 결과 모두에 해당합니다. Eloquent 컬렉션 객체는 Laravel의 [기본 컬렉션](/docs/{{version}}/collections)을 확장하므로, Eloquent 모델의 배열을 유연하게 다루기 위한 수십 가지 메서드를 자연스럽게 상속받습니다. 이러한 유용한 메서드에 대해 더 자세히 알아보려면 Laravel 컬렉션 문서를 꼭 확인해 보세요!

모든 컬렉션은 반복자 역할도 하므로, 단순한 PHP 배열처럼 반복문을 통해 순회할 수 있습니다:

```php
use App\Models\User;

$users = User::where('active', 1)->get();

foreach ($users as $user) {
    echo $user->name;
}
```

하지만 앞서 언급했듯이, 컬렉션은 배열보다 훨씬 강력하며, 직관적인 인터페이스를 통해 체이닝할 수 있는 다양한 map / reduce 연산을 제공합니다. 예를 들어, 비활성화된 모든 모델을 제거한 뒤 남은 각 사용자의 이름만 모을 수도 있습니다:

```php
$names = User::all()->reject(function (User $user) {
    return $user->active === false;
})->map(function (User $user) {
    return $user->name;
});
```


#### Eloquent 컬렉션 변환 {#eloquent-collection-conversion}

대부분의 Eloquent 컬렉션 메서드는 새로운 Eloquent 컬렉션 인스턴스를 반환하지만, `collapse`, `flatten`, `flip`, `keys`, `pluck`, `zip` 메서드는 [기본 컬렉션](/docs/{{version}}/collections) 인스턴스를 반환합니다. 마찬가지로, `map` 연산이 Eloquent 모델을 포함하지 않는 컬렉션을 반환하는 경우, 해당 컬렉션은 기본 컬렉션 인스턴스로 변환됩니다.


## 사용 가능한 메서드 {#available-methods}

모든 Eloquent 컬렉션은 기본 [Laravel 컬렉션](/docs/{{version}}/collections#available-methods) 객체를 확장하므로, 기본 컬렉션 클래스에서 제공하는 강력한 메서드들을 모두 상속받습니다.

또한, `Illuminate\Database\Eloquent\Collection` 클래스는 모델 컬렉션을 관리하는 데 도움이 되는 추가적인 메서드 집합을 제공합니다. 대부분의 메서드는 `Illuminate\Database\Eloquent\Collection` 인스턴스를 반환하지만, `modelKeys`와 같은 일부 메서드는 `Illuminate\Support\Collection` 인스턴스를 반환합니다.

<style>
    .collection-method-list > p {
        columns: 14.4em 1; -moz-columns: 14.4em 1; -webkit-columns: 14.4em 1;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .collection-method code {
        font-size: 14px;
    }

    .collection-method:not(.first-collection-method) {
        margin-top: 50px;
    }
</style>

<div class="collection-method-list" markdown="1">

[append](#method-append)
[contains](#method-contains)
[diff](#method-diff)
[except](#method-except)
[find](#method-find)
[findOrFail](#method-find-or-fail)
[fresh](#method-fresh)
[intersect](#method-intersect)
[load](#method-load)
[loadMissing](#method-loadMissing)
[modelKeys](#method-modelKeys)
[makeVisible](#method-makeVisible)
[makeHidden](#method-makeHidden)
[only](#method-only)
[partition](#method-partition)
[setVisible](#method-setVisible)
[setHidden](#method-setHidden)
[toQuery](#method-toquery)
[unique](#method-unique)

</div>


#### `append($attributes)` {.collection-method .first-collection-method} {#method-append}

`append` 메서드는 컬렉션의 모든 모델에 대해 [속성을 추가](/docs/{{version}}/eloquent-serialization#appending-values-to-json)해야 함을 나타내는 데 사용할 수 있습니다. 이 메서드는 속성의 배열 또는 단일 속성을 인수로 받습니다:

```php
$users->append('team');

$users->append(['team', 'is_admin']);
```


#### `contains($key, $operator = null, $value = null)` {.collection-method} {#method-contains}

`contains` 메서드는 주어진 모델 인스턴스가 컬렉션에 포함되어 있는지 확인할 때 사용할 수 있습니다. 이 메서드는 기본 키 또는 모델 인스턴스를 인자로 받습니다:

```php
$users->contains(1);

$users->contains(User::find(1));
```


#### `diff($items)` {.collection-method} {#method-diff}

`diff` 메서드는 주어진 컬렉션에 존재하지 않는 모든 모델을 반환합니다:

```php
use App\Models\User;

$users = $users->diff(User::whereIn('id', [1, 2, 3])->get());
```


#### `except($keys)` {.collection-method} {#method-except}

`except` 메서드는 주어진 기본 키를 가지지 않은 모든 모델을 반환합니다:

```php
$users = $users->except([1, 2, 3]);
```


#### `find($key)` {.collection-method} {#method-find}

`find` 메서드는 주어진 키와 일치하는 기본 키를 가진 모델을 반환합니다. 만약 `$key`가 모델 인스턴스라면, `find`는 해당 기본 키와 일치하는 모델을 반환하려고 시도합니다. `$key`가 키들의 배열이라면, `find`는 주어진 배열에 포함된 기본 키를 가진 모든 모델을 반환합니다:

```php
$users = User::all();

$user = $users->find(1);
```


#### `findOrFail($key)` {.collection-method} {#method-find-or-fail}

`findOrFail` 메서드는 주어진 키와 일치하는 기본 키를 가진 모델을 반환하거나, 컬렉션에서 일치하는 모델을 찾을 수 없는 경우 `Illuminate\Database\Eloquent\ModelNotFoundException` 예외를 발생시킵니다:

```php
$users = User::all();

$user = $users->findOrFail(1);
```


#### `fresh($with = [])` {.collection-method} {#method-fresh}

`fresh` 메서드는 컬렉션에 있는 각 모델의 최신 인스턴스를 데이터베이스에서 다시 가져옵니다. 또한, 지정된 관계가 있다면 즉시 로드됩니다:

```php
$users = $users->fresh();

$users = $users->fresh('comments');
```


#### `intersect($items)` {.collection-method} {#method-intersect}

`intersect` 메서드는 주어진 컬렉션에도 존재하는 모든 모델을 반환합니다:

```php
use App\Models\User;

$users = $users->intersect(User::whereIn('id', [1, 2, 3])->get());
```


#### `load($relations)` {.collection-method} {#method-load}

`load` 메서드는 컬렉션에 있는 모든 모델에 대해 지정된 관계를 즉시 로드(eager load)합니다:

```php
$users->load(['comments', 'posts']);

$users->load('comments.author');

$users->load(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```


#### `loadMissing($relations)` {.collection-method} {#method-loadMissing}

`loadMissing` 메서드는 컬렉션의 모든 모델에 대해 지정된 관계가 아직 로드되지 않은 경우, 해당 관계를 eager load(즉시 로드)합니다:

```php
$users->loadMissing(['comments', 'posts']);

$users->loadMissing('comments.author');

$users->loadMissing(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```


#### `modelKeys()` {.collection-method} {#method-modelKeys}

`modelKeys` 메서드는 컬렉션에 있는 모든 모델의 기본 키(primary key)들을 반환합니다:

```php
$users->modelKeys();

// [1, 2, 3, 4, 5]
```


#### `makeVisible($attributes)` {.collection-method} {#method-makeVisible}

`makeVisible` 메서드는 컬렉션의 각 모델에서 일반적으로 "숨겨진" [속성을 보이게 만듭니다](/docs/{{version}}/eloquent-serialization#hiding-attributes-from-json):

```php
$users = $users->makeVisible(['address', 'phone_number']);
```


#### `makeHidden($attributes)` {.collection-method} {#method-makeHidden}

`makeHidden` 메서드는 컬렉션의 각 모델에서 일반적으로 "보이는" [속성들을 숨깁니다](/docs/{{version}}/eloquent-serialization#hiding-attributes-from-json):

```php
$users = $users->makeHidden(['address', 'phone_number']);
```


#### `only($keys)` {.collection-method} {#method-only}

`only` 메서드는 주어진 기본 키를 가진 모든 모델을 반환합니다:

```php
$users = $users->only([1, 2, 3]);
```


#### `partition` {.collection-method} {#method-partition}

`partition` 메서드는 `Illuminate\Database\Eloquent\Collection` 컬렉션 인스턴스를 포함하는 `Illuminate\Support\Collection` 인스턴스를 반환합니다:

```php
$partition = $users->partition(fn ($user) => $user->age > 18);

dump($partition::class);    // Illuminate\Support\Collection
dump($partition[0]::class); // Illuminate\Database\Eloquent\Collection
dump($partition[1]::class); // Illuminate\Database\Eloquent\Collection
```


#### `setVisible($attributes)` {.collection-method} {#method-setVisible}

`setVisible` 메서드는 컬렉션의 각 모델에서 모든 표시 속성을 [임시로 재정의](/docs/{{version}}/eloquent-serialization#temporarily-modifying-attribute-visibility)합니다:

```php
$users = $users->setVisible(['id', 'name']);
```


#### `setHidden($attributes)` {.collection-method} {#method-setHidden}

`setHidden` 메서드는 컬렉션 내 각 모델의 모든 hidden 속성을 [임시로 재정의](/docs/{{version}}/eloquent-serialization#temporarily-modifying-attribute-visibility)합니다:

```php
$users = $users->setHidden(['email', 'password', 'remember_token']);
```


#### `toQuery()` {.collection-method} {#method-toquery}

`toQuery` 메서드는 컬렉션 모델의 기본 키에 대한 `whereIn` 제약 조건이 포함된 Eloquent 쿼리 빌더 인스턴스를 반환합니다:

```php
use App\Models\User;

$users = User::where('status', 'VIP')->get();

$users->toQuery()->update([
    'status' => 'Administrator',
]);
```


#### `unique($key = null, $strict = false)` {.collection-method} {#method-unique}

`unique` 메서드는 컬렉션에서 모든 고유한 모델을 반환합니다. 컬렉션 내에서 다른 모델과 동일한 기본 키를 가진 모델은 제거됩니다:

```php
$users = $users->unique();
```


## 커스텀 컬렉션 {#custom-collections}

특정 모델과 상호작용할 때 커스텀 `Collection` 객체를 사용하고 싶다면, 모델에 `CollectedBy` 속성을 추가하면 됩니다:

```php
<?php

namespace App\Models;

use App\Support\UserCollection;
use Illuminate\Database\Eloquent\Attributes\CollectedBy;
use Illuminate\Database\Eloquent\Model;

#[CollectedBy(UserCollection::class)]
class User extends Model
{
    // ...
}
```

또는, 모델에 `newCollection` 메서드를 정의할 수도 있습니다:

```php
<?php

namespace App\Models;

use App\Support\UserCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 새로운 Eloquent Collection 인스턴스를 생성합니다.
     *
     * @param  array<int, \Illuminate\Database\Eloquent\Model>  $models
     * @return \Illuminate\Database\Eloquent\Collection<int, \Illuminate\Database\Eloquent\Model>
     */
    public function newCollection(array $models = []): Collection
    {
        return new UserCollection($models);
    }
}
```

`newCollection` 메서드를 정의하거나 모델에 `CollectedBy` 속성을 추가하면, Eloquent가 일반적으로 `Illuminate\Database\Eloquent\Collection` 인스턴스를 반환하는 모든 경우에 커스텀 컬렉션 인스턴스를 받게 됩니다.

애플리케이션의 모든 모델에 대해 커스텀 컬렉션을 사용하고 싶다면, 모든 모델이 상속하는 기본 모델 클래스에 `newCollection` 메서드를 정의하면 됩니다.
