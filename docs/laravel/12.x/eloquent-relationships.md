# Eloquent: 관계












































## 소개 {#introduction}

데이터베이스 테이블은 종종 서로 연관되어 있습니다. 예를 들어, 블로그 게시글에는 여러 개의 댓글이 있을 수 있고, 주문은 주문한 사용자와 연관될 수 있습니다. Eloquent는 이러한 관계를 쉽게 관리하고 사용할 수 있도록 하며, 다양한 일반적인 관계를 지원합니다:

<div class="content-list" markdown="1">

- [일대일](#one-to-one)
- [일대다](#one-to-many)
- [다대다](#many-to-many)
- [중간을 통한 hasOne](#has-one-through)
- [중간을 통한 hasMany](#has-many-through)
- [일대일(폴리모픽)](#one-to-one-polymorphic-relations)
- [일대다(폴리모픽)](#one-to-many-polymorphic-relations)
- [다대다(폴리모픽)](#many-to-many-polymorphic-relations)

</div>


## 관계 정의하기 {#defining-relationships}

Eloquent 관계는 Eloquent 모델 클래스의 메서드로 정의됩니다. 관계는 강력한 [쿼리 빌더](/laravel/12.x/queries) 역할도 하므로, 메서드로 정의하면 강력한 메서드 체이닝과 쿼리 기능을 제공합니다. 예를 들어, `posts` 관계에 추가 쿼리 제약을 체이닝할 수 있습니다:

```php
$user->posts()->where('active', 1)->get();
```

관계를 본격적으로 사용하기 전에, Eloquent가 지원하는 각 관계 유형을 어떻게 정의하는지 알아봅시다.


### 일대일 / hasOne {#one-to-one}

일대일 관계는 가장 기본적인 데이터베이스 관계 유형입니다. 예를 들어, `User` 모델은 하나의 `Phone` 모델과 연관될 수 있습니다. 이 관계를 정의하려면, `User` 모델에 `phone` 메서드를 추가합니다. `phone` 메서드는 `hasOne` 메서드를 호출하고 그 결과를 반환해야 합니다. `hasOne` 메서드는 모델의 `Illuminate\Database\Eloquent\Model` 기본 클래스에서 제공됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    /**
     * 사용자와 연관된 전화번호를 가져옵니다.
     */
    public function phone(): HasOne
    {
        return $this->hasOne(Phone::class);
    }
}
```

`hasOne` 메서드에 전달되는 첫 번째 인자는 연관 모델 클래스의 이름입니다. 관계가 정의되면, Eloquent의 동적 프로퍼티를 사용해 연관 레코드를 조회할 수 있습니다. 동적 프로퍼티를 사용하면 관계 메서드를 마치 모델의 프로퍼티처럼 접근할 수 있습니다:

```php
$phone = User::find(1)->phone;
```

Eloquent는 부모 모델 이름을 기준으로 관계의 외래 키를 결정합니다. 이 경우, `Phone` 모델에는 자동으로 `user_id` 외래 키가 있다고 가정합니다. 이 규칙을 변경하고 싶다면, `hasOne` 메서드에 두 번째 인자를 전달할 수 있습니다:

```php
return $this->hasOne(Phone::class, 'foreign_key');
```

또한, Eloquent는 외래 키 값이 부모의 기본 키 컬럼과 일치해야 한다고 가정합니다. 즉, Eloquent는 `Phone` 레코드의 `user_id` 컬럼에서 사용자의 `id` 값을 찾습니다. 만약 관계가 `id`나 모델의 `$primaryKey`가 아닌 다른 기본 키 값을 사용하길 원한다면, `hasOne` 메서드에 세 번째 인자를 전달할 수 있습니다:

```php
return $this->hasOne(Phone::class, 'foreign_key', 'local_key');
```


#### 관계의 역방향 정의하기 {#one-to-one-defining-the-inverse-of-the-relationship}

이제 `User` 모델에서 `Phone` 모델에 접근할 수 있습니다. 다음으로, `Phone` 모델에서 전화번호의 소유자를 접근할 수 있도록 관계를 정의해봅시다. `hasOne` 관계의 역방향은 `belongsTo` 메서드를 사용해 정의할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Phone extends Model
{
    /**
     * 전화번호의 소유자인 사용자를 가져옵니다.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`user` 메서드를 호출하면, Eloquent는 `Phone` 모델의 `user_id` 컬럼과 일치하는 `id` 값을 가진 `User` 모델을 찾으려고 시도합니다.

Eloquent는 관계 메서드의 이름에 `_id`를 붙여 외래 키 이름을 결정합니다. 즉, 이 경우 `Phone` 모델에 `user_id` 컬럼이 있다고 가정합니다. 만약 `Phone` 모델의 외래 키가 `user_id`가 아니라면, `belongsTo` 메서드에 두 번째 인자로 커스텀 키 이름을 전달할 수 있습니다:

```php
/**
 * 전화번호의 소유자인 사용자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'foreign_key');
}
```

부모 모델이 `id`가 아닌 다른 컬럼을 기본 키로 사용하거나, 연관 모델을 다른 컬럼으로 찾고 싶다면, `belongsTo` 메서드에 세 번째 인자로 부모 테이블의 커스텀 키를 지정할 수 있습니다:

```php
/**
 * 전화번호의 소유자인 사용자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'foreign_key', 'owner_key');
}
```


### 일대다 / hasMany {#one-to-many}

일대다 관계는 하나의 모델이 하나 이상의 자식 모델을 가질 때 사용합니다. 예를 들어, 블로그 게시글에는 무한히 많은 댓글이 있을 수 있습니다. 다른 Eloquent 관계와 마찬가지로, 일대다 관계도 모델에 메서드를 정의하여 만듭니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /**
     * 블로그 게시글의 댓글을 가져옵니다.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

Eloquent는 `Comment` 모델의 적절한 외래 키 컬럼을 자동으로 결정합니다. 관례상, Eloquent는 부모 모델의 "스네이크 케이스" 이름에 `_id`를 붙입니다. 이 예시에서는 `Comment` 모델의 외래 키 컬럼이 `post_id`라고 가정합니다.

관계 메서드가 정의되면, `comments` 프로퍼티에 접근하여 [컬렉션](/laravel/12.x/eloquent-collections) 형태로 연관 댓글을 조회할 수 있습니다. Eloquent의 "동적 관계 프로퍼티" 덕분에, 관계 메서드를 마치 모델의 프로퍼티처럼 접근할 수 있습니다:

```php
use App\Models\Post;

$comments = Post::find(1)->comments;

foreach ($comments as $comment) {
    // ...
}
```

모든 관계는 쿼리 빌더 역할도 하므로, `comments` 메서드를 호출하고 쿼리 조건을 체이닝하여 관계 쿼리에 추가 제약을 줄 수 있습니다:

```php
$comment = Post::find(1)->comments()
    ->where('title', 'foo')
    ->first();
```

`hasOne` 메서드와 마찬가지로, `hasMany` 메서드에 추가 인자를 전달하여 외래 키와 로컬 키를 오버라이드할 수 있습니다:

```php
return $this->hasMany(Comment::class, 'foreign_key');

return $this->hasMany(Comment::class, 'foreign_key', 'local_key');
```


#### 자식에서 부모 모델 자동 하이드레이션 {#automatically-hydrating-parent-models-on-children}

Eloquent 즉시 로딩을 사용하더라도, 자식 모델을 반복하면서 부모 모델에 접근하면 "N + 1" 쿼리 문제가 발생할 수 있습니다:

```php
$posts = Post::with('comments')->get();

foreach ($posts as $post) {
    foreach ($post->comments as $comment) {
        echo $comment->post->title;
    }
}
```

위 예시에서는, 모든 `Post` 모델에 대해 댓글을 즉시 로딩했음에도 불구하고, Eloquent는 각 자식 `Comment` 모델에서 부모 `Post`를 자동으로 하이드레이션하지 않기 때문에 "N + 1" 쿼리 문제가 발생합니다.

Eloquent가 부모 모델을 자식에 자동으로 하이드레이션하도록 하려면, `hasMany` 관계 정의 시 `chaperone` 메서드를 호출하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /**
     * 블로그 게시글의 댓글을 가져옵니다.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->chaperone();
    }
}
```

또는, 런타임에 자동 부모 하이드레이션을 선택적으로 적용하려면, 관계를 즉시 로딩할 때 `chaperone`을 호출할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::with([
    'comments' => fn ($comments) => $comments->chaperone(),
])->get();
```


### 일대다(역방향) / Belongs To {#one-to-many-inverse}

이제 게시글의 모든 댓글에 접근할 수 있으니, 댓글에서 부모 게시글에 접근할 수 있도록 관계를 정의해봅시다. `hasMany` 관계의 역방향은 자식 모델에 `belongsTo` 메서드를 호출하는 관계 메서드를 정의하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    /**
     * 댓글이 속한 게시글을 가져옵니다.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

관계가 정의되면, `post` "동적 관계 프로퍼티"에 접근하여 댓글의 부모 게시글을 조회할 수 있습니다:

```php
use App\Models\Comment;

$comment = Comment::find(1);

return $comment->post->title;
```

위 예시에서, Eloquent는 `Comment` 모델의 `post_id` 컬럼과 일치하는 `id` 값을 가진 `Post` 모델을 찾으려고 시도합니다.

Eloquent는 관계 메서드의 이름에 `_`와 부모 모델의 기본 키 컬럼 이름을 붙여 기본 외래 키 이름을 결정합니다. 이 예시에서는 `comments` 테이블의 외래 키가 `post_id`라고 가정합니다.

관례를 따르지 않는 외래 키를 사용한다면, `belongsTo` 메서드에 두 번째 인자로 커스텀 외래 키 이름을 전달할 수 있습니다:

```php
/**
 * 댓글이 속한 게시글을 가져옵니다.
 */
public function post(): BelongsTo
{
    return $this->belongsTo(Post::class, 'foreign_key');
}
```

부모 모델이 `id`가 아닌 다른 컬럼을 기본 키로 사용하거나, 연관 모델을 다른 컬럼으로 찾고 싶다면, `belongsTo` 메서드에 세 번째 인자로 부모 테이블의 커스텀 키를 지정할 수 있습니다:

```php
/**
 * 댓글이 속한 게시글을 가져옵니다.
 */
public function post(): BelongsTo
{
    return $this->belongsTo(Post::class, 'foreign_key', 'owner_key');
}
```


#### 기본 모델 {#default-models}

`belongsTo`, `hasOne`, `hasOneThrough`, `morphOne` 관계에서는 주어진 관계가 `null`일 때 반환할 기본 모델을 정의할 수 있습니다. 이 패턴은 [Null Object 패턴](https://en.wikipedia.org/wiki/Null_Object_pattern)이라고 하며, 코드에서 조건문을 줄이는 데 도움이 됩니다. 아래 예시에서, `user` 관계는 `Post` 모델에 사용자가 연결되어 있지 않으면 빈 `App\Models\User` 모델을 반환합니다:

```php
/**
 * 게시글의 작성자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class)->withDefault();
}
```

기본 모델에 속성을 채우려면, `withDefault` 메서드에 배열이나 클로저를 전달할 수 있습니다:

```php
/**
 * 게시글의 작성자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class)->withDefault([
        'name' => 'Guest Author',
    ]);
}

/**
 * 게시글의 작성자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class)->withDefault(function (User $user, Post $post) {
        $user->name = 'Guest Author';
    });
}
```


#### Belongs To 관계 쿼리하기 {#querying-belongs-to-relationships}

"belongs to" 관계의 자식을 쿼리할 때, 직접 `where` 절을 작성하여 해당 Eloquent 모델을 조회할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::where('user_id', $user->id)->get();
```

하지만, `whereBelongsTo` 메서드를 사용하면 적절한 관계와 외래 키를 자동으로 결정해주므로 더 편리합니다:

```php
$posts = Post::whereBelongsTo($user)->get();
```

[컬렉션](/laravel/12.x/eloquent-collections) 인스턴스를 `whereBelongsTo` 메서드에 전달할 수도 있습니다. 이 경우, 컬렉션 내의 부모 모델 중 하나에 속한 모델을 모두 조회합니다:

```php
$users = User::where('vip', true)->get();

$posts = Post::whereBelongsTo($users)->get();
```

기본적으로 Laravel은 주어진 모델의 클래스 이름을 기반으로 관계를 결정하지만, 두 번째 인자로 관계 이름을 직접 지정할 수도 있습니다:

```php
$posts = Post::whereBelongsTo($user, 'author')->get();
```


### 여러 개 중 하나 / Has One of Many {#has-one-of-many}

때로는 한 모델이 여러 연관 모델을 가질 수 있지만, 그 중 "최신" 또는 "가장 오래된" 연관 모델만 쉽게 조회하고 싶을 수 있습니다. 예를 들어, `User` 모델이 여러 `Order` 모델과 연관되어 있지만, 사용자가 가장 최근에 주문한 주문만 편리하게 조회하고 싶을 때가 있습니다. `hasOne` 관계와 `ofMany` 메서드를 조합해 이를 구현할 수 있습니다:

```php
/**
 * 사용자의 가장 최근 주문을 가져옵니다.
 */
public function latestOrder(): HasOne
{
    return $this->hasOne(Order::class)->latestOfMany();
}
```

마찬가지로, "가장 오래된" 또는 첫 번째 연관 모델을 조회하는 메서드도 정의할 수 있습니다:

```php
/**
 * 사용자의 가장 오래된 주문을 가져옵니다.
 */
public function oldestOrder(): HasOne
{
    return $this->hasOne(Order::class)->oldestOfMany();
}
```

기본적으로 `latestOfMany`와 `oldestOfMany` 메서드는 모델의 기본 키를 기준으로 최신 또는 가장 오래된 연관 모델을 조회합니다(기본 키는 정렬 가능해야 합니다). 하지만, 더 큰 관계에서 다른 정렬 기준으로 단일 모델을 조회하고 싶을 때도 있습니다.

예를 들어, `ofMany` 메서드를 사용해 사용자의 가장 비싼 주문을 조회할 수 있습니다. `ofMany` 메서드는 첫 번째 인자로 정렬할 컬럼, 두 번째 인자로 집계 함수(`min` 또는 `max`)를 받습니다:

```php
/**
 * 사용자의 가장 큰 주문을 가져옵니다.
 */
public function largestOrder(): HasOne
{
    return $this->hasOne(Order::class)->ofMany('price', 'max');
}
```

> [!WARNING]
> PostgreSQL은 UUID 컬럼에 대해 `MAX` 함수를 실행하는 것을 지원하지 않으므로, PostgreSQL UUID 컬럼과 one-of-many 관계를 조합해 사용할 수 없습니다.


#### "Many" 관계를 Has One 관계로 변환하기 {#converting-many-relationships-to-has-one-relationships}

대개 `latestOfMany`, `oldestOfMany`, `ofMany` 메서드를 사용해 단일 모델을 조회할 때, 이미 같은 모델에 대한 "has many" 관계가 정의되어 있습니다. Laravel은 이 관계를 `one` 메서드를 호출해 쉽게 "has one" 관계로 변환할 수 있도록 지원합니다:

```php
/**
 * 사용자의 주문 목록을 가져옵니다.
 */
public function orders(): HasMany
{
    return $this->hasMany(Order::class);
}

/**
 * 사용자의 가장 큰 주문을 가져옵니다.
 */
public function largestOrder(): HasOne
{
    return $this->orders()->one()->ofMany('price', 'max');
}
```

`one` 메서드를 사용해 `HasManyThrough` 관계를 `HasOneThrough` 관계로 변환할 수도 있습니다:

```php
public function latestDeployment(): HasOneThrough
{
    return $this->deployments()->one()->latestOfMany();
}
```


#### 고급 Has One of Many 관계 {#advanced-has-one-of-many-relationships}

더 고급의 "has one of many" 관계도 구성할 수 있습니다. 예를 들어, `Product` 모델은 여러 `Price` 모델과 연관될 수 있으며, 새로운 가격이 게시되어도 기존 가격이 시스템에 남아 있을 수 있습니다. 또한, `published_at` 컬럼을 통해 미래에 적용될 가격 데이터를 미리 게시할 수도 있습니다.

즉, 미래가 아닌 날짜의 최신 게시 가격을 조회해야 하며, 게시 날짜가 같은 가격이 두 개라면 ID가 더 큰 가격을 우선시해야 합니다. 이를 위해, `ofMany` 메서드에 정렬할 컬럼 배열을 전달하고, 두 번째 인자로 클로저를 전달해 추가 제약을 줄 수 있습니다:

```php
/**
 * 상품의 현재 가격을 가져옵니다.
 */
public function currentPricing(): HasOne
{
    return $this->hasOne(Price::class)->ofMany([
        'published_at' => 'max',
        'id' => 'max',
    ], function (Builder $query) {
        $query->where('published_at', '<', now());
    });
}
```


### 중간을 통한 hasOne / Has One Through {#has-one-through}

"has-one-through" 관계는 다른 모델과의 일대일 관계를 정의합니다. 하지만, 이 관계는 선언 모델이 _중간_ 모델을 통해 다른 모델의 한 인스턴스와 매칭될 수 있음을 의미합니다.

예를 들어, 자동차 정비소 애플리케이션에서 각 `Mechanic` 모델은 하나의 `Car` 모델과 연관될 수 있고, 각 `Car` 모델은 하나의 `Owner` 모델과 연관될 수 있습니다. 정비공과 소유자는 데이터베이스상 직접적인 관계가 없지만, 정비공은 `Car` 모델을 _통해_ 소유자에 접근할 수 있습니다. 이 관계를 정의하는 데 필요한 테이블을 살펴봅시다:

```text
mechanics
    id - integer
    name - string

cars
    id - integer
    model - string
    mechanic_id - integer

owners
    id - integer
    name - string
    car_id - integer
```

테이블 구조를 살펴봤으니, 이제 `Mechanic` 모델에 관계를 정의해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Mechanic extends Model
{
    /**
     * 자동차의 소유자를 가져옵니다.
     */
    public function carOwner(): HasOneThrough
    {
        return $this->hasOneThrough(Owner::class, Car::class);
    }
}
```

`hasOneThrough` 메서드의 첫 번째 인자는 최종적으로 접근하고자 하는 모델의 이름이고, 두 번째 인자는 중간 모델의 이름입니다.

또는, 관계에 포함된 모든 모델에 관련 관계가 이미 정의되어 있다면, `through` 메서드와 관계 이름을 사용해 "has-one-through" 관계를 유연하게 정의할 수 있습니다. 예를 들어, `Mechanic` 모델에 `cars` 관계가 있고, `Car` 모델에 `owner` 관계가 있다면, 다음과 같이 정비공과 소유자를 연결하는 "has-one-through" 관계를 정의할 수 있습니다:

```php
// 문자열 기반 문법...
return $this->through('cars')->has('owner');

// 동적 문법...
return $this->throughCars()->hasOwner();
```


#### 키 규칙 {#has-one-through-key-conventions}

관계 쿼리를 수행할 때 일반적인 Eloquent 외래 키 규칙이 사용됩니다. 관계의 키를 커스터마이즈하고 싶다면, `hasOneThrough` 메서드의 세 번째, 네 번째 인자로 전달할 수 있습니다. 세 번째 인자는 중간 모델의 외래 키 이름, 네 번째 인자는 최종 모델의 외래 키 이름, 다섯 번째 인자는 로컬 키, 여섯 번째 인자는 중간 모델의 로컬 키입니다:

```php
class Mechanic extends Model
{
    /**
     * 자동차의 소유자를 가져옵니다.
     */
    public function carOwner(): HasOneThrough
    {
        return $this->hasOneThrough(
            Owner::class,
            Car::class,
            'mechanic_id', // cars 테이블의 외래 키...
            'car_id', // owners 테이블의 외래 키...
            'id', // mechanics 테이블의 로컬 키...
            'id' // cars 테이블의 로컬 키...
        );
    }
}
```

또는, 앞서 설명한 것처럼, 관계에 포함된 모든 모델에 관련 관계가 이미 정의되어 있다면, `through` 메서드와 관계 이름을 사용해 "has-one-through" 관계를 유연하게 정의할 수 있습니다. 이 방식은 기존 관계에 정의된 키 규칙을 재사용할 수 있다는 장점이 있습니다:

```php
// 문자열 기반 문법...
return $this->through('cars')->has('owner');

// 동적 문법...
return $this->throughCars()->hasOwner();
```


### 중간을 통한 hasMany / Has Many Through {#has-many-through}

"has-many-through" 관계는 중간 관계를 통해 먼 관계에 쉽게 접근할 수 있는 방법을 제공합니다. 예를 들어, [Laravel Cloud](https://cloud.laravel.com)와 같은 배포 플랫폼을 만든다고 가정해봅시다. `Application` 모델은 중간 `Environment` 모델을 통해 여러 `Deployment` 모델에 접근할 수 있습니다. 이 예시를 사용하면, 특정 애플리케이션의 모든 배포를 쉽게 모을 수 있습니다. 이 관계를 정의하는 데 필요한 테이블을 살펴봅시다:

```text
applications
    id - integer
    name - string

environments
    id - integer
    application_id - integer
    name - string

deployments
    id - integer
    environment_id - integer
    commit_hash - string
```

테이블 구조를 살펴봤으니, 이제 `Application` 모델에 관계를 정의해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Application extends Model
{
    /**
     * 애플리케이션의 모든 배포를 가져옵니다.
     */
    public function deployments(): HasManyThrough
    {
        return $this->hasManyThrough(Deployment::class, Environment::class);
    }
}
```

`hasManyThrough` 메서드의 첫 번째 인자는 최종적으로 접근하고자 하는 모델의 이름이고, 두 번째 인자는 중간 모델의 이름입니다.

또는, 관계에 포함된 모든 모델에 관련 관계가 이미 정의되어 있다면, `through` 메서드와 관계 이름을 사용해 "has-many-through" 관계를 유연하게 정의할 수 있습니다. 예를 들어, `Application` 모델에 `environments` 관계가 있고, `Environment` 모델에 `deployments` 관계가 있다면, 다음과 같이 애플리케이션과 배포를 연결하는 "has-many-through" 관계를 정의할 수 있습니다:

```php
// 문자열 기반 문법...
return $this->through('environments')->has('deployments');

// 동적 문법...
return $this->throughEnvironments()->hasDeployments();
```

`Deployment` 모델의 테이블에는 `application_id` 컬럼이 없지만, `hasManyThrough` 관계를 통해 `$application->deployments`로 애플리케이션의 배포에 접근할 수 있습니다. Eloquent는 중간 `Environment` 모델의 테이블에서 `application_id` 컬럼을 조회한 뒤, 해당 환경 ID를 사용해 `Deployment` 모델의 테이블을 쿼리합니다.


#### 키 규칙 {#has-many-through-key-conventions}

관계 쿼리를 수행할 때 일반적인 Eloquent 외래 키 규칙이 사용됩니다. 관계의 키를 커스터마이즈하고 싶다면, `hasManyThrough` 메서드의 세 번째, 네 번째 인자로 전달할 수 있습니다. 세 번째 인자는 중간 모델의 외래 키 이름, 네 번째 인자는 최종 모델의 외래 키 이름, 다섯 번째 인자는 로컬 키, 여섯 번째 인자는 중간 모델의 로컬 키입니다:

```php
class Application extends Model
{
    public function deployments(): HasManyThrough
    {
        return $this->hasManyThrough(
            Deployment::class,
            Environment::class,
            'application_id', // environments 테이블의 외래 키...
            'environment_id', // deployments 테이블의 외래 키...
            'id', // applications 테이블의 로컬 키...
            'id' // environments 테이블의 로컬 키...
        );
    }
}
```

또는, 앞서 설명한 것처럼, 관계에 포함된 모든 모델에 관련 관계가 이미 정의되어 있다면, `through` 메서드와 관계 이름을 사용해 "has-many-through" 관계를 유연하게 정의할 수 있습니다. 이 방식은 기존 관계에 정의된 키 규칙을 재사용할 수 있다는 장점이 있습니다:

```php
// 문자열 기반 문법...
return $this->through('environments')->has('deployments');

// 동적 문법...
return $this->throughEnvironments()->hasDeployments();
```


### 스코프 관계 {#scoped-relationships}

관계를 제약하는 추가 메서드를 모델에 추가하는 경우가 많습니다. 예를 들어, `User` 모델에 `featuredPosts` 메서드를 추가해, 더 넓은 `posts` 관계에 추가 `where` 제약을 줄 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /**
     * 사용자의 게시글을 가져옵니다.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class)->latest();
    }

    /**
     * 사용자의 추천 게시글을 가져옵니다.
     */
    public function featuredPosts(): HasMany
    {
        return $this->posts()->where('featured', true);
    }
}
```

하지만, `featuredPosts` 메서드를 통해 모델을 생성하면, `featured` 속성이 `true`로 설정되지 않습니다. 관계 메서드를 통해 모델을 생성할 때, 해당 관계로 생성되는 모든 모델에 추가할 속성을 지정하고 싶다면, 관계 쿼리 빌더에서 `withAttributes` 메서드를 사용할 수 있습니다:

```php
/**
 * 사용자의 추천 게시글을 가져옵니다.
 */
public function featuredPosts(): HasMany
{
    return $this->posts()->withAttributes(['featured' => true]);
}
```

`withAttributes` 메서드는 주어진 속성으로 쿼리에 `where` 조건을 추가하고, 관계 메서드를 통해 생성되는 모든 모델에도 해당 속성을 추가합니다:

```php
$post = $user->featuredPosts()->create(['title' => 'Featured Post']);

$post->featured; // true
```

`withAttributes` 메서드가 쿼리에 `where` 조건을 추가하지 않도록 하려면, `asConditions` 인자를 `false`로 설정할 수 있습니다:

```php
return $this->posts()->withAttributes(['featured' => true], asConditions: false);
```


## 다대다 관계 {#many-to-many}

다대다 관계는 `hasOne` 및 `hasMany` 관계보다 약간 더 복잡합니다. 다대다 관계의 예로는, 한 사용자가 여러 역할을 가질 수 있고, 그 역할이 애플리케이션의 다른 사용자와도 공유될 수 있는 경우가 있습니다. 예를 들어, 한 사용자가 "Author"와 "Editor" 역할을 가질 수 있지만, 이 역할은 다른 사용자에게도 할당될 수 있습니다. 즉, 한 사용자는 여러 역할을 가질 수 있고, 한 역할은 여러 사용자를 가질 수 있습니다.


#### 테이블 구조 {#many-to-many-table-structure}

이 관계를 정의하려면, `users`, `roles`, `role_user` 세 개의 데이터베이스 테이블이 필요합니다. `role_user` 테이블은 연관 모델 이름의 알파벳 순서로 만들어지며, `user_id`와 `role_id` 컬럼을 포함합니다. 이 테이블은 사용자와 역할을 연결하는 중간 테이블로 사용됩니다.

역할이 여러 사용자에 속할 수 있으므로, 단순히 `roles` 테이블에 `user_id` 컬럼을 추가할 수 없습니다. 그렇게 하면 한 역할이 한 사용자에게만 속할 수 있기 때문입니다. 여러 사용자에게 역할을 할당하려면 `role_user` 테이블이 필요합니다. 관계의 테이블 구조는 다음과 같이 요약할 수 있습니다:

```text
users
    id - integer
    name - string

roles
    id - integer
    name - string

role_user
    user_id - integer
    role_id - integer
```


#### 모델 구조 {#many-to-many-model-structure}

다대다 관계는 `belongsToMany` 메서드의 결과를 반환하는 메서드를 작성하여 정의합니다. `belongsToMany` 메서드는 모든 Eloquent 모델이 사용하는 `Illuminate\Database\Eloquent\Model` 기본 클래스에서 제공됩니다. 예를 들어, `User` 모델에 `roles` 메서드를 정의해봅시다. 이 메서드의 첫 번째 인자는 연관 모델 클래스의 이름입니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Model
{
    /**
     * 사용자에 속한 역할들.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}
```

관계가 정의되면, `roles` 동적 관계 프로퍼티를 사용해 사용자의 역할에 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->roles as $role) {
    // ...
}
```

모든 관계는 쿼리 빌더 역할도 하므로, `roles` 메서드를 호출하고 쿼리 조건을 체이닝하여 관계 쿼리에 추가 제약을 줄 수 있습니다:

```php
$roles = User::find(1)->roles()->orderBy('name')->get();
```

관계의 중간 테이블 이름을 결정할 때, Eloquent는 두 연관 모델 이름을 알파벳 순서로 조인합니다. 하지만, 이 규칙을 오버라이드할 수도 있습니다. `belongsToMany` 메서드에 두 번째 인자를 전달하면 됩니다:

```php
return $this->belongsToMany(Role::class, 'role_user');
```

중간 테이블의 이름뿐만 아니라, 테이블의 키 컬럼 이름도 추가 인자를 전달해 커스터마이즈할 수 있습니다. 세 번째 인자는 관계를 정의하는 모델의 외래 키 이름, 네 번째 인자는 조인할 모델의 외래 키 이름입니다:

```php
return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
```


#### 관계의 역방향 정의하기 {#many-to-many-defining-the-inverse-of-the-relationship}

다대다 관계의 "역방향"을 정의하려면, 연관 모델에 `belongsToMany` 메서드의 결과를 반환하는 메서드를 정의해야 합니다. 사용자/역할 예시를 완성하기 위해, `Role` 모델에 `users` 메서드를 정의해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    /**
     * 역할에 속한 사용자들.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
```

보시다시피, 관계 정의는 `User` 모델과 거의 동일하며, `App\Models\User` 모델만 참조가 다릅니다. `belongsToMany` 메서드를 재사용하므로, 다대다 관계의 "역방향"을 정의할 때도 모든 테이블 및 키 커스터마이즈 옵션을 사용할 수 있습니다.


### 중간 테이블 컬럼 조회 {#retrieving-intermediate-table-columns}

이미 배운 것처럼, 다대다 관계를 사용하려면 중간 테이블이 필요합니다. Eloquent는 이 테이블을 다루는 데 매우 유용한 방법을 제공합니다. 예를 들어, `User` 모델이 여러 `Role` 모델과 연관되어 있다고 가정해봅시다. 이 관계에 접근한 후, 모델의 `pivot` 속성을 사용해 중간 테이블에 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->roles as $role) {
    echo $role->pivot->created_at;
}
```

조회된 각 `Role` 모델에는 자동으로 `pivot` 속성이 할당됩니다. 이 속성은 중간 테이블을 나타내는 모델을 포함합니다.

기본적으로, `pivot` 모델에는 모델 키만 존재합니다. 중간 테이블에 추가 속성이 있다면, 관계 정의 시 이를 명시해야 합니다:

```php
return $this->belongsToMany(Role::class)->withPivot('active', 'created_by');
```

중간 테이블에 Eloquent가 자동으로 관리하는 `created_at` 및 `updated_at` 타임스탬프가 필요하다면, 관계 정의 시 `withTimestamps` 메서드를 호출하세요:

```php
return $this->belongsToMany(Role::class)->withTimestamps();
```

> [!WARNING]
> Eloquent의 자동 타임스탬프를 사용하는 중간 테이블에는 반드시 `created_at`과 `updated_at` 컬럼이 모두 있어야 합니다.


#### `pivot` 속성 이름 커스터마이즈 {#customizing-the-pivot-attribute-name}

앞서 설명한 것처럼, 중간 테이블의 속성은 모델의 `pivot` 속성을 통해 접근할 수 있습니다. 하지만, 애플리케이션의 목적에 맞게 이 속성 이름을 자유롭게 변경할 수 있습니다.

예를 들어, 사용자가 팟캐스트를 구독할 수 있는 애플리케이션이라면, 사용자와 팟캐스트 사이에 다대다 관계가 있을 것입니다. 이 경우, 중간 테이블 속성 이름을 `pivot` 대신 `subscription`으로 변경하고 싶을 수 있습니다. 관계 정의 시 `as` 메서드를 사용하면 됩니다:

```php
return $this->belongsToMany(Podcast::class)
    ->as('subscription')
    ->withTimestamps();
```

커스텀 중간 테이블 속성을 지정하면, 해당 이름으로 중간 테이블 데이터를 조회할 수 있습니다:

```php
$users = User::with('podcasts')->get();

foreach ($users->flatMap->podcasts as $podcast) {
    echo $podcast->subscription->created_at;
}
```


### 중간 테이블 컬럼을 통한 쿼리 필터링 {#filtering-queries-via-intermediate-table-columns}

`belongsToMany` 관계 쿼리에서 `wherePivot`, `wherePivotIn`, `wherePivotNotIn`, `wherePivotBetween`, `wherePivotNotBetween`, `wherePivotNull`, `wherePivotNotNull` 메서드를 사용해 결과를 필터링할 수 있습니다:

```php
return $this->belongsToMany(Role::class)
    ->wherePivot('approved', 1);

return $this->belongsToMany(Role::class)
    ->wherePivotIn('priority', [1, 2]);

return $this->belongsToMany(Role::class)
    ->wherePivotNotIn('priority', [1, 2]);

return $this->belongsToMany(Podcast::class)
    ->as('subscriptions')
    ->wherePivotBetween('created_at', ['2020-01-01 00:00:00', '2020-12-31 00:00:00']);

return $this->belongsToMany(Podcast::class)
    ->as('subscriptions')
    ->wherePivotNotBetween('created_at', ['2020-01-01 00:00:00', '2020-12-31 00:00:00']);

return $this->belongsToMany(Podcast::class)
    ->as('subscriptions')
    ->wherePivotNull('expired_at');

return $this->belongsToMany(Podcast::class)
    ->as('subscriptions')
    ->wherePivotNotNull('expired_at');
```

`wherePivot`은 쿼리에 where 절 제약을 추가하지만, 관계를 통해 새 모델을 생성할 때 지정한 값을 추가하지는 않습니다. 쿼리와 생성 모두에서 특정 pivot 값을 사용하려면, `withPivotValue` 메서드를 사용할 수 있습니다:

```php
return $this->belongsToMany(Role::class)
    ->withPivotValue('approved', 1);
```


### 중간 테이블 컬럼을 통한 쿼리 정렬 {#ordering-queries-via-intermediate-table-columns}

`belongsToMany` 관계 쿼리에서 `orderByPivot` 메서드를 사용해 결과를 정렬할 수 있습니다. 아래 예시에서는 사용자의 최신 배지를 모두 조회합니다:

```php
return $this->belongsToMany(Badge::class)
    ->where('rank', 'gold')
    ->orderByPivot('created_at', 'desc');
```


### 커스텀 중간 테이블 모델 정의 {#defining-custom-intermediate-table-models}

다대다 관계의 중간 테이블을 나타내는 커스텀 모델을 정의하고 싶다면, 관계 정의 시 `using` 메서드를 사용할 수 있습니다. 커스텀 pivot 모델을 사용하면, pivot 모델에 추가 동작(메서드, 캐스트 등)을 정의할 수 있습니다.

커스텀 다대다 pivot 모델은 `Illuminate\Database\Eloquent\Relations\Pivot` 클래스를, 커스텀 폴리모픽 다대다 pivot 모델은 `Illuminate\Database\Eloquent\Relations\MorphPivot` 클래스를 상속해야 합니다. 예를 들어, 커스텀 `RoleUser` pivot 모델을 사용하는 `Role` 모델을 정의해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    /**
     * 역할에 속한 사용자들.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->using(RoleUser::class);
    }
}
```

`RoleUser` 모델을 정의할 때는 `Illuminate\Database\Eloquent\Relations\Pivot` 클래스를 상속해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleUser extends Pivot
{
    // ...
}
```

> [!WARNING]
> Pivot 모델은 `SoftDeletes` 트레이트를 사용할 수 없습니다. Pivot 레코드를 소프트 삭제해야 한다면, pivot 모델을 실제 Eloquent 모델로 변환하는 것을 고려하세요.


#### 커스텀 Pivot 모델과 자동 증가 ID {#custom-pivot-models-and-incrementing-ids}

커스텀 pivot 모델을 사용하는 다대다 관계를 정의했고, 해당 pivot 모델에 자동 증가 기본 키가 있다면, 커스텀 pivot 모델 클래스에 `incrementing` 속성을 `true`로 설정해야 합니다.

```php
/**
 * ID가 자동 증가하는지 여부.
 *
 * @var bool
 */
public $incrementing = true;
```


## 폴리모픽 관계 {#polymorphic-relationships}

폴리모픽 관계는 자식 모델이 하나의 연관을 통해 둘 이상의 모델에 속할 수 있도록 합니다. 예를 들어, 사용자가 블로그 게시글과 동영상을 공유할 수 있는 애플리케이션을 만든다고 가정해봅시다. 이런 애플리케이션에서 `Comment` 모델은 `Post`와 `Video` 모델 모두에 속할 수 있습니다.


### 일대일(폴리모픽) {#one-to-one-polymorphic-relations}


#### 테이블 구조 {#one-to-one-polymorphic-table-structure}

일대일 폴리모픽 관계는 일반적인 일대일 관계와 비슷하지만, 자식 모델이 하나의 연관을 통해 둘 이상의 모델에 속할 수 있습니다. 예를 들어, 블로그 `Post`와 `User`가 `Image` 모델과 폴리모픽 관계를 가질 수 있습니다. 일대일 폴리모픽 관계를 사용하면, 게시글과 사용자 모두에 연관될 수 있는 고유 이미지 테이블을 하나만 가질 수 있습니다. 먼저, 테이블 구조를 살펴봅시다:

```text
posts
    id - integer
    name - string

users
    id - integer
    name - string

images
    id - integer
    url - string
    imageable_id - integer
    imageable_type - string
```

`images` 테이블의 `imageable_id`와 `imageable_type` 컬럼에 주목하세요. `imageable_id` 컬럼에는 게시글 또는 사용자의 ID 값이, `imageable_type` 컬럼에는 부모 모델의 클래스 이름이 저장됩니다. `imageable_type` 컬럼은 Eloquent가 `imageable` 관계에 접근할 때 어떤 "타입"의 부모 모델을 반환할지 결정하는 데 사용됩니다. 이 경우, 컬럼 값은 `App\Models\Post` 또는 `App\Models\User`가 됩니다.


#### 모델 구조 {#one-to-one-polymorphic-model-structure}

다음으로, 이 관계를 구축하는 데 필요한 모델 정의를 살펴봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    /**
     * 부모 imageable 모델(사용자 또는 게시글)을 가져옵니다.
     */
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Post extends Model
{
    /**
     * 게시글의 이미지를 가져옵니다.
     */
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class User extends Model
{
    /**
     * 사용자의 이미지를 가져옵니다.
     */
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
```


#### 관계 조회하기 {#one-to-one-polymorphic-retrieving-the-relationship}

데이터베이스 테이블과 모델이 정의되면, 모델을 통해 관계에 접근할 수 있습니다. 예를 들어, 게시글의 이미지를 조회하려면 `image` 동적 관계 프로퍼티에 접근하면 됩니다:

```php
use App\Models\Post;

$post = Post::find(1);

$image = $post->image;
```

폴리모픽 모델의 부모를 조회하려면, `morphTo`를 호출하는 메서드 이름에 접근하면 됩니다. 이 경우, `Image` 모델의 `imageable` 메서드입니다. 따라서, 동적 관계 프로퍼티로 해당 메서드에 접근합니다:

```php
use App\Models\Image;

$image = Image::find(1);

$imageable = $image->imageable;
```

`Image` 모델의 `imageable` 관계는 이미지의 소유자 타입에 따라 `Post` 또는 `User` 인스턴스를 반환합니다.


#### 키 규칙 {#morph-one-to-one-key-conventions}

필요하다면, 폴리모픽 자식 모델에서 사용하는 "id"와 "type" 컬럼의 이름을 지정할 수 있습니다. 이 경우, `morphTo` 메서드의 첫 번째 인자로 항상 관계 이름을 전달해야 합니다. 일반적으로 이 값은 메서드 이름과 일치하므로, PHP의 `__FUNCTION__` 상수를 사용할 수 있습니다:

```php
/**
 * 이미지가 속한 모델을 가져옵니다.
 */
public function imageable(): MorphTo
{
    return $this->morphTo(__FUNCTION__, 'imageable_type', 'imageable_id');
}
```


### 일대다(폴리모픽) {#one-to-many-polymorphic-relations}


#### 테이블 구조 {#one-to-many-polymorphic-table-structure}

일대다 폴리모픽 관계는 일반적인 일대다 관계와 비슷하지만, 자식 모델이 하나의 연관을 통해 둘 이상의 모델에 속할 수 있습니다. 예를 들어, 애플리케이션 사용자가 게시글과 동영상에 "댓글"을 달 수 있다고 가정해봅시다. 폴리모픽 관계를 사용하면, 하나의 `comments` 테이블로 게시글과 동영상의 댓글을 모두 저장할 수 있습니다. 이 관계를 구축하는 데 필요한 테이블 구조는 다음과 같습니다:

```text
posts
    id - integer
    title - string
    body - text

videos
    id - integer
    title - string
    url - string

comments
    id - integer
    body - text
    commentable_id - integer
    commentable_type - string
```


#### 모델 구조 {#one-to-many-polymorphic-model-structure}

다음으로, 이 관계를 구축하는 데 필요한 모델 정의를 살펴봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    /**
     * 부모 commentable 모델(게시글 또는 동영상)을 가져옵니다.
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    /**
     * 게시글의 모든 댓글을 가져옵니다.
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Video extends Model
{
    /**
     * 동영상의 모든 댓글을 가져옵니다.
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```


#### 관계 조회하기 {#one-to-many-polymorphic-retrieving-the-relationship}

데이터베이스 테이블과 모델이 정의되면, 모델의 동적 관계 프로퍼티를 통해 관계에 접근할 수 있습니다. 예를 들어, 게시글의 모든 댓글에 접근하려면 `comments` 동적 프로퍼티를 사용하면 됩니다:

```php
use App\Models\Post;

$post = Post::find(1);

foreach ($post->comments as $comment) {
    // ...
}
```

폴리모픽 자식 모델의 부모를 조회하려면, `morphTo`를 호출하는 메서드 이름에 접근하면 됩니다. 이 경우, `Comment` 모델의 `commentable` 메서드입니다. 따라서, 동적 관계 프로퍼티로 해당 메서드에 접근해 댓글의 부모 모델에 접근할 수 있습니다:

```php
use App\Models\Comment;

$comment = Comment::find(1);

$commentable = $comment->commentable;
```

`Comment` 모델의 `commentable` 관계는 댓글의 부모 타입에 따라 `Post` 또는 `Video` 인스턴스를 반환합니다.


#### 자식에서 부모 모델 자동 하이드레이션(폴리모픽) {#polymorphic-automatically-hydrating-parent-models-on-children}

Eloquent 즉시 로딩을 사용하더라도, 자식 모델을 반복하면서 부모 모델에 접근하면 "N + 1" 쿼리 문제가 발생할 수 있습니다:

```php
$posts = Post::with('comments')->get();

foreach ($posts as $post) {
    foreach ($post->comments as $comment) {
        echo $comment->commentable->title;
    }
}
```

위 예시에서는, 모든 `Post` 모델에 대해 댓글을 즉시 로딩했음에도 불구하고, Eloquent는 각 자식 `Comment` 모델에서 부모 `Post`를 자동으로 하이드레이션하지 않기 때문에 "N + 1" 쿼리 문제가 발생합니다.

Eloquent가 부모 모델을 자식에 자동으로 하이드레이션하도록 하려면, `morphMany` 관계 정의 시 `chaperone` 메서드를 호출하면 됩니다:

```php
class Post extends Model
{
    /**
     * 게시글의 모든 댓글을 가져옵니다.
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable')->chaperone();
    }
}
```

또는, 런타임에 자동 부모 하이드레이션을 선택적으로 적용하려면, 관계를 즉시 로딩할 때 `chaperone`을 호출할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::with([
    'comments' => fn ($comments) => $comments->chaperone(),
])->get();
```


### 여러 개 중 하나(폴리모픽) {#one-of-many-polymorphic-relations}

때로는 한 모델이 여러 연관 모델을 가질 수 있지만, 그 중 "최신" 또는 "가장 오래된" 연관 모델만 쉽게 조회하고 싶을 수 있습니다. 예를 들어, `User` 모델이 여러 `Image` 모델과 연관되어 있지만, 사용자가 가장 최근에 업로드한 이미지만 편리하게 조회하고 싶을 때가 있습니다. `morphOne` 관계와 `ofMany` 메서드를 조합해 이를 구현할 수 있습니다:

```php
/**
 * 사용자의 가장 최근 이미지를 가져옵니다.
 */
public function latestImage(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable')->latestOfMany();
}
```

마찬가지로, "가장 오래된" 또는 첫 번째 연관 모델을 조회하는 메서드도 정의할 수 있습니다:

```php
/**
 * 사용자의 가장 오래된 이미지를 가져옵니다.
 */
public function oldestImage(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable')->oldestOfMany();
}
```

기본적으로 `latestOfMany`와 `oldestOfMany` 메서드는 모델의 기본 키를 기준으로 최신 또는 가장 오래된 연관 모델을 조회합니다(기본 키는 정렬 가능해야 합니다). 하지만, 더 큰 관계에서 다른 정렬 기준으로 단일 모델을 조회하고 싶을 때도 있습니다.

예를 들어, `ofMany` 메서드를 사용해 사용자의 "좋아요"가 가장 많은 이미지를 조회할 수 있습니다. `ofMany` 메서드는 첫 번째 인자로 정렬할 컬럼, 두 번째 인자로 집계 함수(`min` 또는 `max`)를 받습니다:

```php
/**
 * 사용자의 가장 인기 있는 이미지를 가져옵니다.
 */
public function bestImage(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable')->ofMany('likes', 'max');
}
```

> [!NOTE]
> 더 고급의 "one of many" 관계도 구성할 수 있습니다. 자세한 내용은 [has one of many 문서](#advanced-has-one-of-many-relationships)를 참고하세요.


### 다대다(폴리모픽) {#many-to-many-polymorphic-relations}


#### 테이블 구조 {#many-to-many-polymorphic-table-structure}

다대다 폴리모픽 관계는 "morph one" 및 "morph many" 관계보다 약간 더 복잡합니다. 예를 들어, `Post` 모델과 `Video` 모델이 `Tag` 모델과 폴리모픽 관계를 가질 수 있습니다. 이 경우, 다대다 폴리모픽 관계를 사용하면 게시글과 동영상 모두에 연관될 수 있는 고유 태그 테이블을 하나만 가질 수 있습니다. 이 관계를 구축하는 데 필요한 테이블 구조는 다음과 같습니다:

```text
posts
    id - integer
    name - string

videos
    id - integer
    name - string

tags
    id - integer
    name - string

taggables
    tag_id - integer
    taggable_id - integer
    taggable_type - string
```

> [!NOTE]
> 폴리모픽 다대다 관계를 본격적으로 다루기 전에, 일반적인 [다대다 관계](#many-to-many) 문서를 읽어보는 것이 도움이 될 수 있습니다.


#### 모델 구조 {#many-to-many-polymorphic-model-structure}

다음으로, 모델에 관계를 정의할 준비가 되었습니다. `Post`와 `Video` 모델 모두에 `tags` 메서드를 추가하고, 이 메서드에서 기본 Eloquent 모델 클래스가 제공하는 `morphToMany` 메서드를 호출합니다.

`morphToMany` 메서드는 연관 모델의 이름과 "관계 이름"을 인자로 받습니다. 중간 테이블 이름과 키에 따라, 이 관계를 "taggable"로 부릅니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Post extends Model
{
    /**
     * 게시글의 모든 태그를 가져옵니다.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
```


#### 관계의 역방향 정의하기 {#many-to-many-polymorphic-defining-the-inverse-of-the-relationship}

다음으로, `Tag` 모델에 각 부모 모델에 대한 메서드를 정의해야 합니다. 이 예시에서는 `posts`와 `videos` 메서드를 정의합니다. 두 메서드 모두 `morphedByMany` 메서드의 결과를 반환해야 합니다.

`morphedByMany` 메서드는 연관 모델의 이름과 "관계 이름"을 인자로 받습니다. 중간 테이블 이름과 키에 따라, 이 관계를 "taggable"로 부릅니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    /**
     * 이 태그가 할당된 모든 게시글을 가져옵니다.
     */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    /**
     * 이 태그가 할당된 모든 동영상을 가져옵니다.
     */
    public function videos(): MorphToMany
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}
```


#### 관계 조회하기 {#many-to-many-polymorphic-retrieving-the-relationship}

데이터베이스 테이블과 모델이 정의되면, 모델을 통해 관계에 접근할 수 있습니다. 예를 들어, 게시글의 모든 태그에 접근하려면 `tags` 동적 관계 프로퍼티를 사용하면 됩니다:

```php
use App\Models\Post;

$post = Post::find(1);

foreach ($post->tags as $tag) {
    // ...
}
```

폴리모픽 자식 모델에서 폴리모픽 관계의 부모를 조회하려면, `morphedByMany`를 호출하는 메서드 이름에 접근하면 됩니다. 이 경우, `Tag` 모델의 `posts` 또는 `videos` 메서드입니다:

```php
use App\Models\Tag;

$tag = Tag::find(1);

foreach ($tag->posts as $post) {
    // ...
}

foreach ($tag->videos as $video) {
    // ...
}
```


### 커스텀 폴리모픽 타입 {#custom-polymorphic-types}

기본적으로, Laravel은 연관 모델의 "타입"을 저장할 때 완전한 클래스 이름을 사용합니다. 예를 들어, 위의 일대다 관계 예시에서 `Comment` 모델이 `Post` 또는 `Video` 모델에 속할 수 있다면, 기본 `commentable_type` 값은 각각 `App\Models\Post` 또는 `App\Models\Video`가 됩니다. 하지만, 이 값을 애플리케이션의 내부 구조와 분리하고 싶을 수 있습니다.

예를 들어, 모델 이름 대신 "타입"으로 간단한 문자열(`post`, `video` 등)을 사용할 수 있습니다. 이렇게 하면, 모델 이름이 변경되어도 데이터베이스의 폴리모픽 "타입" 컬럼 값이 유효하게 유지됩니다:

```php
use Illuminate\Database\Eloquent\Relations\Relation;

Relation::enforceMorphMap([
    'post' => 'App\Models\Post',
    'video' => 'App\Models\Video',
]);
```

`enforceMorphMap` 메서드는 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출하거나, 별도의 서비스 프로바이더를 만들어 호출할 수 있습니다.

런타임에 모델의 morph 별칭을 확인하려면, 모델의 `getMorphClass` 메서드를 사용할 수 있습니다. 반대로, morph 별칭에 해당하는 완전한 클래스 이름을 확인하려면 `Relation::getMorphedModel` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Relations\Relation;

$alias = $post->getMorphClass();

$class = Relation::getMorphedModel($alias);
```

> [!WARNING]
> 기존 애플리케이션에 "morph map"을 추가할 때, 데이터베이스의 모든 morphable `*_type` 컬럼 값이 완전한 클래스 이름으로 남아 있다면, 이를 "map" 이름으로 변환해야 합니다.


### 동적 관계 {#dynamic-relationships}

`resolveRelationUsing` 메서드를 사용해 런타임에 Eloquent 모델 간의 관계를 정의할 수 있습니다. 일반적인 애플리케이션 개발에서는 권장되지 않지만, Laravel 패키지 개발 시 유용할 수 있습니다.

`resolveRelationUsing` 메서드는 첫 번째 인자로 원하는 관계 이름을, 두 번째 인자로 모델 인스턴스를 받아 유효한 Eloquent 관계 정의를 반환하는 클로저를 받습니다. 일반적으로, [서비스 프로바이더](/laravel/12.x/providers)의 boot 메서드에서 동적 관계를 설정해야 합니다:

```php
use App\Models\Order;
use App\Models\Customer;

Order::resolveRelationUsing('customer', function (Order $orderModel) {
    return $orderModel->belongsTo(Customer::class, 'customer_id');
});
```

> [!WARNING]
> 동적 관계를 정의할 때는 항상 Eloquent 관계 메서드에 명시적인 키 이름 인자를 제공해야 합니다.


## 관계 쿼리 {#querying-relations}

모든 Eloquent 관계는 메서드로 정의되므로, 해당 메서드를 호출해 실제로 연관 모델을 쿼리하지 않고도 관계 인스턴스를 얻을 수 있습니다. 또한, 모든 Eloquent 관계는 [쿼리 빌더](/laravel/12.x/queries) 역할도 하므로, 관계 쿼리에 추가 제약을 체이닝한 뒤 최종적으로 데이터베이스에 SQL 쿼리를 실행할 수 있습니다.

예를 들어, `User` 모델이 여러 `Post` 모델과 연관된 블로그 애플리케이션을 생각해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /**
     * 사용자의 모든 게시글을 가져옵니다.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

`posts` 관계를 쿼리하고 추가 제약을 줄 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->posts()->where('active', 1)->get();
```

관계에서 Laravel [쿼리 빌더](/laravel/12.x/queries)의 모든 메서드를 사용할 수 있으니, 쿼리 빌더 문서를 참고해 다양한 메서드를 익혀보세요.


#### 관계 뒤에 `orWhere` 체이닝하기 {#chaining-orwhere-clauses-after-relationships}

위 예시처럼, 관계를 쿼리할 때 추가 제약을 자유롭게 체이닝할 수 있습니다. 하지만, 관계 뒤에 `orWhere` 절을 체이닝할 때는 주의해야 합니다. `orWhere` 절은 관계 제약과 같은 레벨로 논리적으로 그룹화됩니다:

```php
$user->posts()
    ->where('active', 1)
    ->orWhere('votes', '>=', 100)
    ->get();
```

위 예시는 다음과 같은 SQL을 생성합니다. 보시다시피, `or` 절 때문에 100표 이상인 _모든_ 게시글이 반환됩니다. 쿼리가 특정 사용자로 제한되지 않습니다:

```sql
select *
from posts
where user_id = ? and active = 1 or votes >= 100
```

대부분의 상황에서는 [논리 그룹](/laravel/12.x/queries#logical-grouping)을 사용해 조건을 괄호로 묶어야 합니다:

```php
use Illuminate\Database\Eloquent\Builder;

$user->posts()
    ->where(function (Builder $query) {
        return $query->where('active', 1)
            ->orWhere('votes', '>=', 100);
    })
    ->get();
```

위 예시는 다음과 같은 SQL을 생성합니다. 논리 그룹이 올바르게 묶여 쿼리가 특정 사용자로 제한됩니다:

```sql
select *
from posts
where user_id = ? and (active = 1 or votes >= 100)
```


### 관계 메서드 vs. 동적 프로퍼티 {#relationship-methods-vs-dynamic-properties}

Eloquent 관계 쿼리에 추가 제약을 줄 필요가 없다면, 관계를 프로퍼티처럼 접근할 수 있습니다. 예를 들어, `User`와 `Post` 예시 모델을 계속 사용하면, 사용자의 모든 게시글에 다음과 같이 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->posts as $post) {
    // ...
}
```

동적 관계 프로퍼티는 "지연 로딩"을 수행하므로, 실제로 접근할 때만 관계 데이터를 로드합니다. 이 때문에, 개발자들은 [즉시 로딩](#eager-loading)을 사용해 모델을 로드한 후 접근할 관계를 미리 로드하곤 합니다. 즉시 로딩은 모델의 관계를 로드하는 데 필요한 SQL 쿼리 수를 크게 줄여줍니다.


### 관계 존재 쿼리 {#querying-relationship-existence}

모델 레코드를 조회할 때, 관계의 존재 여부에 따라 결과를 제한하고 싶을 수 있습니다. 예를 들어, 댓글이 하나 이상 있는 모든 블로그 게시글을 조회하고 싶다면, `has` 및 `orHas` 메서드에 관계 이름을 전달하면 됩니다:

```php
use App\Models\Post;

// 댓글이 하나 이상 있는 모든 게시글 조회...
$posts = Post::has('comments')->get();
```

연산자와 개수 값을 지정해 쿼리를 더 세밀하게 조정할 수도 있습니다:

```php
// 댓글이 3개 이상 있는 모든 게시글 조회...
$posts = Post::has('comments', '>=', 3)->get();
```

중첩된 `has` 문은 "점(.)" 표기법을 사용해 만들 수 있습니다. 예를 들어, 댓글이 하나 이상 있고, 그 댓글에 이미지가 하나 이상 있는 모든 게시글을 조회할 수 있습니다:

```php
// 이미지가 있는 댓글이 하나 이상 있는 게시글 조회...
$posts = Post::has('comments.images')->get();
```

더 강력한 쿼리가 필요하다면, `whereHas` 및 `orWhereHas` 메서드를 사용해 `has` 쿼리에 추가 제약을 줄 수 있습니다. 예를 들어, 댓글 내용에 특정 단어가 포함된 게시글을 조회할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

// code%로 시작하는 단어가 포함된 댓글이 하나 이상 있는 게시글 조회...
$posts = Post::whereHas('comments', function (Builder $query) {
    $query->where('content', 'like', 'code%');
})->get();

// code%로 시작하는 단어가 포함된 댓글이 10개 이상 있는 게시글 조회...
$posts = Post::whereHas('comments', function (Builder $query) {
    $query->where('content', 'like', 'code%');
}, '>=', 10)->get();
```

> [!WARNING]
> Eloquent는 현재 데이터베이스를 넘나드는 관계 존재 쿼리를 지원하지 않습니다. 관계는 반드시 같은 데이터베이스 내에 존재해야 합니다.


#### 다대다 관계 존재 쿼리 {#many-to-many-relationship-existence-queries}

`whereAttachedTo` 메서드를 사용해, 특정 모델 또는 모델 컬렉션에 다대다로 연결된 모델을 쿼리할 수 있습니다:

```php
$users = User::whereAttachedTo($role)->get();
```

[컬렉션](/laravel/12.x/eloquent-collections) 인스턴스를 `whereAttachedTo` 메서드에 전달할 수도 있습니다. 이 경우, 컬렉션 내의 모델 중 하나에 연결된 모델을 모두 조회합니다:

```php
$tags = Tag::whereLike('name', '%laravel%')->get();

$posts = Post::whereAttachedTo($tags)->get();
```


#### 인라인 관계 존재 쿼리 {#inline-relationship-existence-queries}

관계 쿼리에 단일, 간단한 where 조건을 붙여 관계 존재를 쿼리하고 싶다면, `whereRelation`, `orWhereRelation`, `whereMorphRelation`, `orWhereMorphRelation` 메서드를 사용하는 것이 더 편리할 수 있습니다. 예를 들어, 승인되지 않은 댓글이 있는 모든 게시글을 쿼리할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::whereRelation('comments', 'is_approved', false)->get();
```

물론, 쿼리 빌더의 `where` 메서드처럼 연산자를 지정할 수도 있습니다:

```php
$posts = Post::whereRelation(
    'comments', 'created_at', '>=', now()->subHour()
)->get();
```


### 관계 부재 쿼리 {#querying-relationship-absence}

모델 레코드를 조회할 때, 관계가 없는 경우에만 결과를 제한하고 싶을 수 있습니다. 예를 들어, 댓글이 **없는** 모든 블로그 게시글을 조회하고 싶다면, `doesntHave` 및 `orDoesntHave` 메서드에 관계 이름을 전달하면 됩니다:

```php
use App\Models\Post;

$posts = Post::doesntHave('comments')->get();
```

더 강력한 쿼리가 필요하다면, `whereDoesntHave` 및 `orWhereDoesntHave` 메서드를 사용해 `doesntHave` 쿼리에 추가 제약을 줄 수 있습니다. 예를 들어, 댓글 내용에 특정 단어가 포함된 경우를 제외하고 게시글을 조회할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::whereDoesntHave('comments', function (Builder $query) {
    $query->where('content', 'like', 'code%');
})->get();
```

"점(.)" 표기법을 사용해 중첩 관계에 쿼리를 실행할 수도 있습니다. 예를 들어, 다음 쿼리는 댓글이 없는 게시글과, 댓글이 있더라도 댓글 작성자가 차단된 사용자가 아닌 게시글을 모두 조회합니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::whereDoesntHave('comments.author', function (Builder $query) {
    $query->where('banned', 1);
})->get();
```


### Morph To 관계 쿼리 {#querying-morph-to-relationships}

"morph to" 관계의 존재를 쿼리하려면, `whereHasMorph` 및 `whereDoesntHaveMorph` 메서드를 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 관계 이름을, 두 번째 인자로 쿼리에 포함할 연관 모델 이름을 받습니다. 마지막으로, 관계 쿼리를 커스터마이즈할 클로저를 전달할 수 있습니다:

```php
use App\Models\Comment;
use App\Models\Post;
use App\Models\Video;
use Illuminate\Database\Eloquent\Builder;

// 제목이 code%로 시작하는 게시글 또는 동영상에 연결된 댓글 조회...
$comments = Comment::whereHasMorph(
    'commentable',
    [Post::class, Video::class],
    function (Builder $query) {
        $query->where('title', 'like', 'code%');
    }
)->get();

// 제목이 code%로 시작하지 않는 게시글에 연결된 댓글 조회...
$comments = Comment::whereDoesntHaveMorph(
    'commentable',
    Post::class,
    function (Builder $query) {
        $query->where('title', 'like', 'code%');
    }
)->get();
```

때로는 연관 폴리모픽 모델의 "타입"에 따라 쿼리 제약을 추가해야 할 수 있습니다. `whereHasMorph` 메서드에 전달하는 클로저는 두 번째 인자로 `$type` 값을 받을 수 있습니다. 이 인자를 사용해 빌드 중인 쿼리의 "타입"을 확인할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

$comments = Comment::whereHasMorph(
    'commentable',
    [Post::class, Video::class],
    function (Builder $query, string $type) {
        $column = $type === Post::class ? 'content' : 'title';

        $query->where($column, 'like', 'code%');
    }
)->get();
```

때로는 "morph to" 관계의 부모의 자식을 쿼리하고 싶을 수 있습니다. 이때는 `whereMorphedTo` 및 `whereNotMorphedTo` 메서드를 사용하면, 주어진 모델에 대한 적절한 morph 타입 매핑을 자동으로 결정합니다. 이 메서드는 첫 번째 인자로 `morphTo` 관계 이름, 두 번째 인자로 연관 부모 모델을 받습니다:

```php
$comments = Comment::whereMorphedTo('commentable', $post)
    ->orWhereMorphedTo('commentable', $video)
    ->get();
```


#### 모든 연관 모델 쿼리하기 {#querying-all-morph-to-related-models}

가능한 모든 폴리모픽 모델을 배열로 전달하는 대신, `*`를 와일드카드 값으로 사용할 수 있습니다. 이 경우, Laravel은 데이터베이스에서 가능한 모든 폴리모픽 타입을 조회합니다. 이 작업을 위해 추가 쿼리가 실행됩니다:

```php
use Illuminate\Database\Eloquent\Builder;

$comments = Comment::whereHasMorph('commentable', '*', function (Builder $query) {
    $query->where('title', 'like', 'foo%');
})->get();
```


## 연관 모델 집계 {#aggregating-related-models}


### 연관 모델 개수 세기 {#counting-related-models}

때로는 실제로 모델을 로드하지 않고도, 주어진 관계의 연관 모델 개수를 세고 싶을 수 있습니다. 이를 위해 `withCount` 메서드를 사용할 수 있습니다. `withCount` 메서드는 결과 모델에 `{relation}_count` 속성을 추가합니다:

```php
use App\Models\Post;

$posts = Post::withCount('comments')->get();

foreach ($posts as $post) {
    echo $post->comments_count;
}
```

`withCount` 메서드에 배열을 전달하면, 여러 관계의 "개수"를 추가하거나 쿼리에 추가 제약을 줄 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::withCount(['votes', 'comments' => function (Builder $query) {
    $query->where('content', 'like', 'code%');
}])->get();

echo $posts[0]->votes_count;
echo $posts[0]->comments_count;
```

관계 개수 결과에 별칭을 지정해, 같은 관계에 대해 여러 개의 개수를 추가할 수도 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::withCount([
    'comments',
    'comments as pending_comments_count' => function (Builder $query) {
        $query->where('approved', false);
    },
])->get();

echo $posts[0]->comments_count;
echo $posts[0]->pending_comments_count;
```


#### 지연 개수 로딩 {#deferred-count-loading}

`loadCount` 메서드를 사용하면, 부모 모델을 이미 조회한 후에 관계 개수를 로드할 수 있습니다:

```php
$book = Book::first();

$book->loadCount('genres');
```

개수 쿼리에 추가 제약을 주고 싶다면, 개수를 셀 관계를 키로 하는 배열을 전달할 수 있습니다. 배열 값은 쿼리 빌더 인스턴스를 받는 클로저여야 합니다:

```php
$book->loadCount(['reviews' => function (Builder $query) {
    $query->where('rating', 5);
}])
```


#### 관계 개수와 커스텀 select 문 {#relationship-counting-and-custom-select-statements}

`withCount`와 `select` 문을 조합할 때는, 반드시 `select` 메서드 뒤에 `withCount`를 호출해야 합니다:

```php
$posts = Post::select(['title', 'body'])
    ->withCount('comments')
    ->get();
```


### 기타 집계 함수 {#other-aggregate-functions}

`withCount` 메서드 외에도, Eloquent는 `withMin`, `withMax`, `withAvg`, `withSum`, `withExists` 메서드를 제공합니다. 이 메서드들은 결과 모델에 `{relation}_{function}_{column}` 속성을 추가합니다:

```php
use App\Models\Post;

$posts = Post::withSum('comments', 'votes')->get();

foreach ($posts as $post) {
    echo $post->comments_sum_votes;
}
```

집계 함수 결과를 다른 이름으로 접근하고 싶다면, 별칭을 지정할 수 있습니다:

```php
$posts = Post::withSum('comments as total_comments', 'votes')->get();

foreach ($posts as $post) {
    echo $post->total_comments;
}
```

`loadCount` 메서드처럼, 이 메서드들의 지연 버전도 사용할 수 있습니다. 이미 조회한 Eloquent 모델에 대해 추가 집계 연산을 수행할 수 있습니다:

```php
$post = Post::first();

$post->loadSum('comments', 'votes');
```

이 집계 메서드들을 `select` 문과 조합할 때는, 반드시 `select` 메서드 뒤에 집계 메서드를 호출해야 합니다:

```php
$posts = Post::select(['title', 'body'])
    ->withExists('comments')
    ->get();
```


### Morph To 관계에서 연관 모델 개수 세기 {#counting-related-models-on-morph-to-relationships}

"morph to" 관계를 즉시 로딩하면서, 해당 관계에서 반환될 수 있는 다양한 엔티티의 연관 모델 개수도 함께 로드하고 싶다면, `with` 메서드와 `morphTo` 관계의 `morphWithCount` 메서드를 조합해 사용할 수 있습니다.

이 예시에서는, `Photo`와 `Post` 모델이 `ActivityFeed` 모델을 생성할 수 있다고 가정합니다. `ActivityFeed` 모델은 "morph to" 관계인 `parentable`을 정의해, 각 `ActivityFeed` 인스턴스의 부모 `Photo` 또는 `Post` 모델을 조회할 수 있습니다. 또한, `Photo` 모델은 "has many" `Tag` 모델, `Post` 모델은 "has many" `Comment` 모델을 가진다고 가정합니다.

이제, `ActivityFeed` 인스턴스를 조회하고, 각 인스턴스의 `parentable` 부모 모델을 즉시 로딩하며, 각 부모 사진의 태그 개수와 각 부모 게시글의 댓글 개수도 함께 조회하고 싶다고 가정해봅시다:

```php
use Illuminate\Database\Eloquent\Relations\MorphTo;

$activities = ActivityFeed::with([
    'parentable' => function (MorphTo $morphTo) {
        $morphTo->morphWithCount([
            Photo::class => ['tags'],
            Post::class => ['comments'],
        ]);
    }])->get();
```


#### 지연 개수 로딩 {#morph-to-deferred-count-loading}

이미 `ActivityFeed` 모델 집합을 조회한 상태에서, 각 `parentable` 모델의 중첩 관계 개수를 로드하고 싶다면, `loadMorphCount` 메서드를 사용할 수 있습니다:

```php
$activities = ActivityFeed::with('parentable')->get();

$activities->loadMorphCount('parentable', [
    Photo::class => ['tags'],
    Post::class => ['comments'],
]);
```


## 즉시 로딩(Eager Loading) {#eager-loading}

Eloquent 관계에 프로퍼티로 접근하면, 연관 모델이 "지연 로딩"됩니다. 즉, 해당 프로퍼티에 처음 접근할 때까지 관계 데이터가 실제로 로드되지 않습니다. 하지만, Eloquent는 부모 모델을 쿼리할 때 관계를 "즉시 로딩"할 수 있습니다. 즉시 로딩은 "N + 1" 쿼리 문제를 완화합니다. N + 1 쿼리 문제를 설명하기 위해, `Book` 모델이 `Author` 모델에 "belongs to" 관계를 가진다고 가정해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    /**
     * 책을 쓴 저자를 가져옵니다.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }
}
```

이제 모든 책과 저자를 조회해봅시다:

```php
use App\Models\Book;

$books = Book::all();

foreach ($books as $book) {
    echo $book->author->name;
}
```

이 반복문은 데이터베이스에서 모든 책을 조회하는 쿼리 1개와, 각 책의 저자를 조회하는 쿼리 1개씩을 실행합니다. 즉, 책이 25권이라면, 위 코드는 총 26개의 쿼리를 실행합니다(책 1개, 저자 25개).

즉시 로딩을 사용하면 이 작업을 단 2개의 쿼리로 줄일 수 있습니다. 쿼리를 작성할 때, `with` 메서드를 사용해 즉시 로딩할 관계를 지정할 수 있습니다:

```php
$books = Book::with('author')->get();

foreach ($books as $book) {
    echo $book->author->name;
}
```

이 작업에서는 단 2개의 쿼리만 실행됩니다. 하나는 모든 책을 조회하고, 다른 하나는 모든 책의 저자를 조회합니다:

```sql
select * from books

select * from authors where id in (1, 2, 3, 4, 5, ...)
```


#### 여러 관계 즉시 로딩 {#eager-loading-multiple-relationships}

여러 관계를 즉시 로딩해야 할 때도 있습니다. 이 경우, `with` 메서드에 관계 배열을 전달하면 됩니다:

```php
$books = Book::with(['author', 'publisher'])->get();
```


#### 중첩 즉시 로딩 {#nested-eager-loading}

관계의 관계도 즉시 로딩하려면, "점(.)" 문법을 사용할 수 있습니다. 예를 들어, 모든 책의 저자와 저자의 연락처를 즉시 로딩하려면 다음과 같이 합니다:

```php
$books = Book::with('author.contacts')->get();
```

또는, 여러 중첩 관계를 즉시 로딩할 때는, `with` 메서드에 중첩 배열을 전달할 수도 있습니다:

```php
$books = Book::with([
    'author' => [
        'contacts',
        'publisher',
    ],
])->get();
```


#### 중첩 즉시 로딩 `morphTo` 관계 {#nested-eager-loading-morphto-relationships}

`morphTo` 관계와, 해당 관계에서 반환될 수 있는 다양한 엔티티의 중첩 관계도 즉시 로딩하려면, `with` 메서드와 `morphTo` 관계의 `morphWith` 메서드를 조합해 사용할 수 있습니다. 예시 모델을 살펴봅시다:

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityFeed extends Model
{
    /**
     * 활동 피드 레코드의 부모를 가져옵니다.
     */
    public function parentable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

이 예시에서, `Event`, `Photo`, `Post` 모델이 `ActivityFeed` 모델을 생성할 수 있다고 가정합니다. 또한, `Event` 모델은 `Calendar` 모델에 "belongs to", `Photo` 모델은 `Tag` 모델과 연관, `Post` 모델은 `Author` 모델에 "belongs to" 관계를 가진다고 가정합니다.

이 모델 정의와 관계를 사용해, `ActivityFeed` 모델 인스턴스를 조회하고, 모든 `parentable` 모델과 각자의 중첩 관계를 즉시 로딩할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Relations\MorphTo;

$activities = ActivityFeed::query()
    ->with(['parentable' => function (MorphTo $morphTo) {
        $morphTo->morphWith([
            Event::class => ['calendar'],
            Photo::class => ['tags'],
            Post::class => ['author'],
        ]);
    }])->get();
```


#### 즉시 로딩 시 특정 컬럼만 조회 {#eager-loading-specific-columns}

항상 관계의 모든 컬럼이 필요한 것은 아닙니다. 그래서 Eloquent는 관계에서 조회할 컬럼을 지정할 수 있도록 지원합니다:

```php
$books = Book::with('author:id,name,book_id')->get();
```

> [!WARNING]
> 이 기능을 사용할 때는, 항상 `id` 컬럼과 관련 외래 키 컬럼을 컬럼 목록에 포함해야 합니다.


#### 기본 즉시 로딩 {#eager-loading-by-default}

모델을 조회할 때 항상 특정 관계를 로드하고 싶을 때가 있습니다. 이럴 때는 모델에 `$with` 속성을 정의하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    /**
     * 항상 로드해야 하는 관계.
     *
     * @var array
     */
    protected $with = ['author'];

    /**
     * 책을 쓴 저자를 가져옵니다.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    /**
     * 책의 장르를 가져옵니다.
     */
    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }
}
```

단일 쿼리에서 `$with` 속성의 항목을 제거하고 싶다면, `without` 메서드를 사용할 수 있습니다:

```php
$books = Book::without('author')->get();
```

단일 쿼리에서 `$with` 속성의 모든 항목을 오버라이드하고 싶다면, `withOnly` 메서드를 사용할 수 있습니다:

```php
$books = Book::withOnly('genre')->get();
```


### 즉시 로딩 제약 {#constraining-eager-loads}

관계를 즉시 로딩하면서, 즉시 로딩 쿼리에 추가 쿼리 조건을 지정하고 싶을 때가 있습니다. 이럴 때는, `with` 메서드에 관계 이름을 키로, 추가 제약을 주는 클로저를 값으로 하는 배열을 전달하면 됩니다:

```php
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;

$users = User::with(['posts' => function (Builder $query) {
    $query->where('title', 'like', '%code%');
}])->get();
```

이 예시에서, Eloquent는 게시글의 `title` 컬럼에 `code`가 포함된 게시글만 즉시 로딩합니다. 다른 [쿼리 빌더](/laravel/12.x/queries) 메서드를 호출해 즉시 로딩 작업을 더 커스터마이즈할 수 있습니다:

```php
$users = User::with(['posts' => function (Builder $query) {
    $query->orderBy('created_at', 'desc');
}])->get();
```


#### `morphTo` 관계의 즉시 로딩 제약 {#constraining-eager-loading-of-morph-to-relationships}

`morphTo` 관계를 즉시 로딩할 때, Eloquent는 각 연관 모델 타입별로 여러 쿼리를 실행합니다. 이 쿼리들에 추가 제약을 주고 싶다면, `MorphTo` 관계의 `constrain` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Relations\MorphTo;

$comments = Comment::with(['commentable' => function (MorphTo $morphTo) {
    $morphTo->constrain([
        Post::class => function ($query) {
            $query->whereNull('hidden_at');
        },
        Video::class => function ($query) {
            $query->where('type', 'educational');
        },
    ]);
}])->get();
```

이 예시에서, Eloquent는 숨겨지지 않은 게시글과 `type` 값이 "educational"인 동영상만 즉시 로딩합니다.


#### 관계 존재로 즉시 로딩 제약 {#constraining-eager-loads-with-relationship-existence}

관계의 존재를 확인하면서, 동시에 같은 조건으로 관계를 즉시 로딩해야 할 때가 있습니다. 예를 들어, 특정 쿼리 조건에 맞는 자식 `Post` 모델이 있는 `User` 모델만 조회하면서, 해당 게시글도 즉시 로딩하고 싶을 수 있습니다. 이럴 때는 `withWhereHas` 메서드를 사용할 수 있습니다:

```php
use App\Models\User;

$users = User::withWhereHas('posts', function ($query) {
    $query->where('featured', true);
})->get();
```


### 지연 즉시 로딩(Lazy Eager Loading) {#lazy-eager-loading}

부모 모델을 이미 조회한 후에 관계를 즉시 로딩해야 할 때가 있습니다. 예를 들어, 동적으로 연관 모델을 로드할지 결정해야 할 때 유용합니다:

```php
use App\Models\Book;

$books = Book::all();

if ($someCondition) {
    $books->load('author', 'publisher');
}
```

즉시 로딩 쿼리에 추가 제약을 주고 싶다면, 로드할 관계를 키로 하는 배열을 전달할 수 있습니다. 배열 값은 쿼리 인스턴스를 받는 클로저여야 합니다:

```php
$author->load(['books' => function (Builder $query) {
    $query->orderBy('published_date', 'asc');
}]);
```

이미 로드되지 않은 관계만 로드하려면, `loadMissing` 메서드를 사용하세요:

```php
$book->loadMissing('author');
```


#### 중첩 지연 즉시 로딩과 `morphTo` {#nested-lazy-eager-loading-morphto}

`morphTo` 관계와, 해당 관계에서 반환될 수 있는 다양한 엔티티의 중첩 관계도 즉시 로딩하려면, `loadMorph` 메서드를 사용할 수 있습니다.

이 메서드는 첫 번째 인자로 `morphTo` 관계 이름, 두 번째 인자로 모델/관계 쌍의 배열을 받습니다. 예시 모델을 살펴봅시다:

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityFeed extends Model
{
    /**
     * 활동 피드 레코드의 부모를 가져옵니다.
     */
    public function parentable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

이 예시에서, `Event`, `Photo`, `Post` 모델이 `ActivityFeed` 모델을 생성할 수 있다고 가정합니다. 또한, `Event` 모델은 `Calendar` 모델에 "belongs to", `Photo` 모델은 `Tag` 모델과 연관, `Post` 모델은 `Author` 모델에 "belongs to" 관계를 가진다고 가정합니다.

이 모델 정의와 관계를 사용해, `ActivityFeed` 모델 인스턴스를 조회하고, 모든 `parentable` 모델과 각자의 중첩 관계를 즉시 로딩할 수 있습니다:

```php
$activities = ActivityFeed::with('parentable')
    ->get()
    ->loadMorph('parentable', [
        Event::class => ['calendar'],
        Photo::class => ['tags'],
        Post::class => ['author'],
    ]);
```


### 자동 즉시 로딩 {#automatic-eager-loading}

> [!WARNING]
> 이 기능은 현재 커뮤니티 피드백을 수집하기 위해 베타 상태입니다. 이 기능의 동작과 기능은 패치 릴리스에서도 변경될 수 있습니다.

많은 경우, Laravel은 접근하는 관계를 자동으로 즉시 로딩할 수 있습니다. 자동 즉시 로딩을 활성화하려면, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 `Model::automaticallyEagerLoadRelationships` 메서드를 호출해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Model::automaticallyEagerLoadRelationships();
}
```

이 기능이 활성화되면, Laravel은 아직 로드되지 않은 관계에 접근할 때 자동으로 해당 관계를 로드하려고 시도합니다. 예를 들어, 다음과 같은 시나리오를 생각해봅시다:

```php
use App\Models\User;

$users = User::all();

foreach ($users as $user) {
    foreach ($user->posts as $post) {
        foreach ($post->comments as $comment) {
            echo $comment->content;
        }
    }
}
```

일반적으로, 위 코드는 각 사용자의 게시글을 조회하는 쿼리와, 각 게시글의 댓글을 조회하는 쿼리를 실행합니다. 하지만, `automaticallyEagerLoadRelationships` 기능이 활성화되어 있으면, 사용자의 게시글에 접근할 때 모든 사용자 컬렉션에 대해 게시글이 [지연 즉시 로딩](#lazy-eager-loading)되고, 게시글의 댓글에 접근할 때도 모든 게시글에 대해 댓글이 지연 즉시 로딩됩니다.

자동 즉시 로딩을 전역적으로 활성화하고 싶지 않다면, Eloquent 컬렉션 인스턴스에 `withRelationshipAutoloading` 메서드를 호출해 이 기능을 단일 컬렉션에만 적용할 수 있습니다:

```php
$users = User::where('vip', true)->get();

return $users->withRelationshipAutoloading();
```


### 지연 로딩 방지 {#preventing-lazy-loading}

앞서 설명했듯이, 관계를 즉시 로딩하면 애플리케이션의 성능이 크게 향상될 수 있습니다. 따라서, 원한다면 Laravel이 항상 관계의 지연 로딩을 방지하도록 설정할 수 있습니다. 이를 위해, 기본 Eloquent 모델 클래스의 `preventLazyLoading` 메서드를 호출하면 됩니다. 일반적으로, 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드에서 이 메서드를 호출해야 합니다.

`preventLazyLoading` 메서드는 지연 로딩을 방지할지 여부를 나타내는 불리언 인자를 선택적으로 받습니다. 예를 들어, 프로덕션 환경이 아닌 경우에만 지연 로딩을 비활성화하고 싶을 수 있습니다. 이렇게 하면, 프로덕션 환경에서 실수로 지연 로딩이 발생해도 애플리케이션이 정상적으로 동작합니다:

```php
use Illuminate\Database\Eloquent\Model;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
}
```

지연 로딩을 방지하면, 애플리케이션이 Eloquent 관계를 지연 로딩하려고 시도할 때 `Illuminate\Database\LazyLoadingViolationException` 예외가 발생합니다.

`handleLazyLoadingViolationsUsing` 메서드를 사용해 지연 로딩 위반의 동작을 커스터마이즈할 수 있습니다. 예를 들어, 이 메서드를 사용해 예외 대신 로그만 남기도록 할 수 있습니다:

```php
Model::handleLazyLoadingViolationUsing(function (Model $model, string $relation) {
    $class = $model::class;

    info("Attempted to lazy load [{$relation}] on model [{$class}].");
});
```


## 연관 모델 삽입 및 수정 {#inserting-and-updating-related-models}


### `save` 메서드 {#the-save-method}

Eloquent는 관계에 새 모델을 추가하는 편리한 메서드를 제공합니다. 예를 들어, 게시글에 새 댓글을 추가해야 한다고 가정해봅시다. `Comment` 모델의 `post_id` 속성을 수동으로 설정하는 대신, 관계의 `save` 메서드를 사용해 댓글을 삽입할 수 있습니다:

```php
use App\Models\Comment;
use App\Models\Post;

$comment = new Comment(['message' => 'A new comment.']);

$post = Post::find(1);

$post->comments()->save($comment);
```

`comments` 관계에 동적 프로퍼티로 접근하지 않고, 메서드를 호출해 관계 인스턴스를 얻는 점에 주의하세요. `save` 메서드는 새 `Comment` 모델에 적절한 `post_id` 값을 자동으로 추가합니다.

여러 연관 모델을 저장해야 한다면, `saveMany` 메서드를 사용할 수 있습니다:

```php
$post = Post::find(1);

$post->comments()->saveMany([
    new Comment(['message' => 'A new comment.']),
    new Comment(['message' => 'Another new comment.']),
]);
```

`save`와 `saveMany` 메서드는 주어진 모델 인스턴스를 저장하지만, 이미 부모 모델에 로드된 인메모리 관계에는 새로 저장된 모델을 추가하지 않습니다. `save` 또는 `saveMany` 메서드 사용 후 관계에 접근할 계획이라면, `refresh` 메서드를 사용해 모델과 관계를 다시 로드하는 것이 좋습니다:

```php
$post->comments()->save($comment);

$post->refresh();

// 새로 저장된 댓글을 포함한 모든 댓글...
$post->comments;
```


#### 모델과 관계 재귀적으로 저장하기 {#the-push-method}

모델과 모든 연관 관계를 함께 `save`하고 싶다면, `push` 메서드를 사용할 수 있습니다. 이 예시에서는, `Post` 모델과 그 댓글, 댓글의 작성자까지 모두 저장됩니다:

```php
$post = Post::find(1);

$post->comments[0]->message = 'Message';
$post->comments[0]->author->name = 'Author Name';

$post->push();
```

`pushQuietly` 메서드를 사용하면, 이벤트를 발생시키지 않고 모델과 연관 관계를 저장할 수 있습니다:

```php
$post->pushQuietly();
```


### `create` 메서드 {#the-create-method}

`save`와 `saveMany` 메서드 외에도, `create` 메서드를 사용할 수 있습니다. 이 메서드는 속성 배열을 받아 모델을 생성하고 데이터베이스에 삽입합니다. `save`는 전체 Eloquent 모델 인스턴스를 받는 반면, `create`는 일반 PHP `array`를 받는 점이 다릅니다. `create` 메서드는 새로 생성된 모델을 반환합니다:

```php
use App\Models\Post;

$post = Post::find(1);

$comment = $post->comments()->create([
    'message' => 'A new comment.',
]);
```

`createMany` 메서드를 사용해 여러 연관 모델을 한 번에 생성할 수도 있습니다:

```php
$post = Post::find(1);

$post->comments()->createMany([
    ['message' => 'A new comment.'],
    ['message' => 'Another new comment.'],
]);
```

`createQuietly`와 `createManyQuietly` 메서드를 사용하면, 이벤트를 발생시키지 않고 모델을 생성할 수 있습니다:

```php
$user = User::find(1);

$user->posts()->createQuietly([
    'title' => 'Post title.',
]);

$user->posts()->createManyQuietly([
    ['title' => 'First post.'],
    ['title' => 'Second post.'],
]);
```

`findOrNew`, `firstOrNew`, `firstOrCreate`, `updateOrCreate` 메서드를 사용해 [관계에서 모델을 생성 및 수정](/laravel/12.x/eloquent#upserts)할 수도 있습니다.

> [!NOTE]
> `create` 메서드를 사용하기 전에, [대량 할당](/laravel/12.x/eloquent#mass-assignment) 문서를 반드시 확인하세요.


### Belongs To 관계 {#updating-belongs-to-relationships}

자식 모델을 새 부모 모델에 할당하고 싶다면, `associate` 메서드를 사용할 수 있습니다. 이 예시에서, `User` 모델은 `Account` 모델에 `belongsTo` 관계를 정의합니다. `associate` 메서드는 자식 모델의 외래 키를 설정합니다:

```php
use App\Models\Account;

$account = Account::find(10);

$user->account()->associate($account);

$user->save();
```

자식 모델에서 부모 모델을 제거하려면, `dissociate` 메서드를 사용할 수 있습니다. 이 메서드는 관계의 외래 키를 `null`로 설정합니다:

```php
$user->account()->dissociate();

$user->save();
```


### 다대다 관계 {#updating-many-to-many-relationships}


#### 연결/해제(Attaching / Detaching) {#attaching-detaching}

Eloquent는 다대다 관계를 더 편리하게 다룰 수 있는 메서드도 제공합니다. 예를 들어, 사용자가 여러 역할을 가질 수 있고, 역할도 여러 사용자를 가질 수 있다고 가정해봅시다. `attach` 메서드를 사용해 중간 테이블에 레코드를 삽입함으로써 역할을 사용자에 연결할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->roles()->attach($roleId);
```

관계를 연결할 때, 중간 테이블에 삽입할 추가 데이터를 배열로 전달할 수도 있습니다:

```php
$user->roles()->attach($roleId, ['expires' => $expires]);
```

때로는 사용자에서 역할을 제거해야 할 수도 있습니다. 다대다 관계 레코드를 제거하려면, `detach` 메서드를 사용하세요. 이 메서드는 중간 테이블에서 해당 레코드를 삭제하지만, 두 모델은 데이터베이스에 남아 있습니다:

```php
// 사용자에서 단일 역할 해제...
$user->roles()->detach($roleId);

// 사용자에서 모든 역할 해제...
$user->roles()->detach();
```

편의를 위해, `attach`와 `detach`는 ID 배열도 입력으로 받을 수 있습니다:

```php
$user = User::find(1);

$user->roles()->detach([1, 2, 3]);

$user->roles()->attach([
    1 => ['expires' => $expires],
    2 => ['expires' => $expires],
]);
```


#### 동기화(Syncing Associations) {#syncing-associations}

`sync` 메서드를 사용해 다대다 관계를 동기화할 수도 있습니다. `sync` 메서드는 중간 테이블에 남길 ID 배열을 받습니다. 주어진 배열에 없는 ID는 중간 테이블에서 제거됩니다. 이 작업이 끝나면, 중간 테이블에는 주어진 배열의 ID만 남게 됩니다:

```php
$user->roles()->sync([1, 2, 3]);
```

ID와 함께 추가 중간 테이블 값을 전달할 수도 있습니다:

```php
$user->roles()->sync([1 => ['expires' => true], 2, 3]);
```

동기화되는 모든 모델 ID에 동일한 중간 테이블 값을 삽입하고 싶다면, `syncWithPivotValues` 메서드를 사용할 수 있습니다:

```php
$user->roles()->syncWithPivotValues([1, 2, 3], ['active' => true]);
```

주어진 배열에 없는 기존 ID를 해제하지 않으려면, `syncWithoutDetaching` 메서드를 사용할 수 있습니다:

```php
$user->roles()->syncWithoutDetaching([1, 2, 3]);
```


#### 연결 상태 토글(Toggling Associations) {#toggling-associations}

다대다 관계는 주어진 연관 모델 ID의 연결 상태를 "토글"하는 `toggle` 메서드도 제공합니다. 주어진 ID가 현재 연결되어 있으면 해제되고, 해제되어 있으면 연결됩니다:

```php
$user->roles()->toggle([1, 2, 3]);
```

ID와 함께 추가 중간 테이블 값을 전달할 수도 있습니다:

```php
$user->roles()->toggle([
    1 => ['expires' => true],
    2 => ['expires' => true],
]);
```


#### 중간 테이블 레코드 수정 {#updating-a-record-on-the-intermediate-table}

관계의 중간 테이블에 있는 기존 행을 수정해야 한다면, `updateExistingPivot` 메서드를 사용할 수 있습니다. 이 메서드는 중간 레코드의 외래 키와 수정할 속성 배열을 받습니다:

```php
$user = User::find(1);

$user->roles()->updateExistingPivot($roleId, [
    'active' => false,
]);
```


## 부모 타임스탬프 갱신 {#touching-parent-timestamps}

`Comment`처럼 다른 모델에 `belongsTo` 또는 `belongsToMany` 관계를 정의하는 모델에서는, 자식 모델이 수정될 때 부모의 타임스탬프를 갱신하는 것이 도움이 될 때가 있습니다.

예를 들어, `Comment` 모델이 수정될 때, 소유한 `Post`의 `updated_at` 타임스탬프를 자동으로 "터치"해 현재 날짜와 시간으로 설정하고 싶을 수 있습니다. 이를 위해, 자식 모델에 `touches` 속성을 추가하고, 자식 모델이 수정될 때 `updated_at` 타임스탬프를 갱신할 관계 이름을 배열로 지정하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    /**
     * 터치할 모든 관계.
     *
     * @var array
     */
    protected $touches = ['post'];

    /**
     * 댓글이 속한 게시글을 가져옵니다.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

> [!WARNING]
> 부모 모델의 타임스탬프는 자식 모델이 Eloquent의 `save` 메서드로 수정될 때만 갱신됩니다.
