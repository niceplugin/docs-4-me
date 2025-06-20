# Eloquent: 컬렉션






## 소개 {#introduction}

여러 개의 모델 결과를 반환하는 모든 Eloquent 메서드는 `Illuminate\Database\Eloquent\Collection` 클래스의 인스턴스를 반환합니다. 여기에는 `get` 메서드로 조회하거나 관계를 통해 접근한 결과도 포함됩니다. Eloquent 컬렉션 객체는 Laravel의 [기본 컬렉션](/laravel/12.x/collections)을 확장하므로, Eloquent 모델의 배열을 유연하게 다루기 위한 수십 가지 메서드를 자연스럽게 상속받습니다. 이 유용한 메서드들에 대해 더 알고 싶다면 Laravel 컬렉션 문서를 꼭 확인해 보세요!

모든 컬렉션은 반복자 역할도 하므로, 단순한 PHP 배열처럼 반복문을 통해 순회할 수 있습니다:

```php
use App\Models\User;

$users = User::where('active', 1)->get();

foreach ($users as $user) {
    echo $user->name;
}
```

하지만 앞서 언급했듯이, 컬렉션은 배열보다 훨씬 강력하며, 직관적인 인터페이스로 체이닝할 수 있는 다양한 map/reduce 연산을 제공합니다. 예를 들어, 비활성화된 모델을 모두 제거한 뒤 남은 사용자 각각의 이름만 모을 수 있습니다:

```php
$names = User::all()->reject(function (User $user) {
    return $user->active === false;
})->map(function (User $user) {
    return $user->name;
});
```


#### Eloquent 컬렉션 변환 {#eloquent-collection-conversion}

대부분의 Eloquent 컬렉션 메서드는 새로운 Eloquent 컬렉션 인스턴스를 반환하지만, `collapse`, `flatten`, `flip`, `keys`, `pluck`, `zip` 메서드는 [기본 컬렉션](/laravel/12.x/collections) 인스턴스를 반환합니다. 마찬가지로, `map` 연산이 Eloquent 모델을 포함하지 않는 컬렉션을 반환할 경우, 기본 컬렉션 인스턴스로 변환됩니다.


## 사용 가능한 메서드 {#available-methods}

모든 Eloquent 컬렉션은 기본 [Laravel 컬렉션](/laravel/12.x/collections#available-methods) 객체를 확장하므로, 기본 컬렉션 클래스가 제공하는 강력한 메서드를 모두 상속받습니다.

또한, `Illuminate\Database\Eloquent\Collection` 클래스는 모델 컬렉션 관리를 돕기 위한 추가 메서드 집합을 제공합니다. 대부분의 메서드는 `Illuminate\Database\Eloquent\Collection` 인스턴스를 반환하지만, `modelKeys`와 같은 일부 메서드는 `Illuminate\Support\Collection` 인스턴스를 반환합니다.

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


#### `append($attributes)` {#method-append}

`append` 메서드는 컬렉션의 모든 모델에 대해 [속성을 추가](/laravel/12.x/eloquent-serialization#appending-values-to-json)하도록 지정할 때 사용합니다. 이 메서드는 속성 배열 또는 단일 속성을 인자로 받을 수 있습니다:

```php
$users->append('team');

$users->append(['team', 'is_admin']);
```


#### `contains($key, $operator = null, $value = null)` {#method-contains}

`contains` 메서드는 주어진 모델 인스턴스가 컬렉션에 포함되어 있는지 확인할 때 사용합니다. 이 메서드는 기본 키 또는 모델 인스턴스를 인자로 받을 수 있습니다:

```php
$users->contains(1);

$users->contains(User::find(1));
```


#### `diff($items)` {#method-diff}

`diff` 메서드는 주어진 컬렉션에 존재하지 않는 모든 모델을 반환합니다:

```php
use App\Models\User;

$users = $users->diff(User::whereIn('id', [1, 2, 3])->get());
```


#### `except($keys)` {#method-except}

`except` 메서드는 주어진 기본 키를 가지지 않은 모든 모델을 반환합니다:

```php
$users = $users->except([1, 2, 3]);
```


#### `find($key)` {#method-find}

`find` 메서드는 주어진 키와 일치하는 기본 키를 가진 모델을 반환합니다. `$key`가 모델 인스턴스인 경우, `find`는 해당 기본 키와 일치하는 모델을 반환하려고 시도합니다. `$key`가 키 배열인 경우, `find`는 해당 배열에 기본 키가 포함된 모든 모델을 반환합니다:

```php
$users = User::all();

$user = $users->find(1);
```


#### `findOrFail($key)` {#method-find-or-fail}

`findOrFail` 메서드는 주어진 키와 일치하는 기본 키를 가진 모델을 반환하거나, 컬렉션에서 일치하는 모델을 찾을 수 없으면 `Illuminate\Database\Eloquent\ModelNotFoundException` 예외를 발생시킵니다:

```php
$users = User::all();

$user = $users->findOrFail(1);
```


#### `fresh($with = [])` {#method-fresh}

`fresh` 메서드는 컬렉션의 각 모델에 대해 데이터베이스에서 새로운 인스턴스를 조회합니다. 또한, 지정한 관계가 있다면 eager loading도 수행합니다:

```php
$users = $users->fresh();

$users = $users->fresh('comments');
```


#### `intersect($items)` {#method-intersect}

`intersect` 메서드는 주어진 컬렉션에도 존재하는 모든 모델을 반환합니다:

```php
use App\Models\User;

$users = $users->intersect(User::whereIn('id', [1, 2, 3])->get());
```


#### `load($relations)` {#method-load}

`load` 메서드는 컬렉션의 모든 모델에 대해 지정한 관계를 eager loading합니다:

```php
$users->load(['comments', 'posts']);

$users->load('comments.author');

$users->load(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```


#### `loadMissing($relations)` {#method-loadMissing}

`loadMissing` 메서드는 컬렉션의 모든 모델에 대해 지정한 관계가 이미 로드되지 않은 경우에만 eager loading합니다:

```php
$users->loadMissing(['comments', 'posts']);

$users->loadMissing('comments.author');

$users->loadMissing(['comments', 'posts' => fn ($query) => $query->where('active', 1)]);
```


#### `modelKeys()` {#method-modelKeys}

`modelKeys` 메서드는 컬렉션의 모든 모델에 대한 기본 키를 반환합니다:

```php
$users->modelKeys();

// [1, 2, 3, 4, 5]
```


#### `makeVisible($attributes)` {#method-makeVisible}

`makeVisible` 메서드는 컬렉션의 각 모델에서 일반적으로 "숨겨진" 속성을 [노출](/laravel/12.x/eloquent-serialization#hiding-attributes-from-json)시킵니다:

```php
$users = $users->makeVisible(['address', 'phone_number']);
```


#### `makeHidden($attributes)` {#method-makeHidden}

`makeHidden` 메서드는 컬렉션의 각 모델에서 일반적으로 "노출된" 속성을 [숨김](/laravel/12.x/eloquent-serialization#hiding-attributes-from-json) 처리합니다:

```php
$users = $users->makeHidden(['address', 'phone_number']);
```


#### `only($keys)` {#method-only}

`only` 메서드는 주어진 기본 키를 가진 모든 모델을 반환합니다:

```php
$users = $users->only([1, 2, 3]);
```


#### `partition` {#method-partition}

`partition` 메서드는 `Illuminate\Support\Collection` 인스턴스를 반환하며, 이 안에는 `Illuminate\Database\Eloquent\Collection` 컬렉션 인스턴스가 포함됩니다:

```php
$partition = $users->partition(fn ($user) => $user->age > 18);

dump($partition::class);    // Illuminate\Support\Collection
dump($partition[0]::class); // Illuminate\Database\Eloquent\Collection
dump($partition[1]::class); // Illuminate\Database\Eloquent\Collection
```


#### `setVisible($attributes)` {#method-setVisible}

`setVisible` 메서드는 컬렉션의 각 모델에서 모든 노출 속성을 [임시로 재정의](/laravel/12.x/eloquent-serialization#temporarily-modifying-attribute-visibility)합니다:

```php
$users = $users->setVisible(['id', 'name']);
```


#### `setHidden($attributes)` {#method-setHidden}

`setHidden` 메서드는 컬렉션의 각 모델에서 모든 숨김 속성을 [임시로 재정의](/laravel/12.x/eloquent-serialization#temporarily-modifying-attribute-visibility)합니다:

```php
$users = $users->setHidden(['email', 'password', 'remember_token']);
```


#### `toQuery()` {#method-toquery}

`toQuery` 메서드는 컬렉션 모델의 기본 키에 대해 `whereIn` 제약 조건이 포함된 Eloquent 쿼리 빌더 인스턴스를 반환합니다:

```php
use App\Models\User;

$users = User::where('status', 'VIP')->get();

$users->toQuery()->update([
    'status' => 'Administrator',
]);
```


#### `unique($key = null, $strict = false)` {#method-unique}

`unique` 메서드는 컬렉션 내에서 고유한 모든 모델을 반환합니다. 컬렉션 내에서 기본 키가 중복되는 모델은 제거됩니다:

```php
$users = $users->unique();
```


## 커스텀 컬렉션 {#custom-collections}

특정 모델과 상호작용할 때 커스텀 `Collection` 객체를 사용하고 싶다면, 모델에 `CollectedBy` 속성을 추가할 수 있습니다:

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
