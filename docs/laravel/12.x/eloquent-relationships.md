# Eloquent: 관계












































## 소개 {#introduction}

데이터베이스 테이블은 종종 서로 연관되어 있습니다. 예를 들어, 블로그 게시물에는 여러 개의 댓글이 있을 수 있고, 주문은 주문을 한 사용자와 연관될 수 있습니다. Eloquent는 이러한 관계를 쉽게 관리하고 작업할 수 있도록 하며, 다양한 일반적인 관계를 지원합니다:

<div class="content-list" markdown="1">

- [일대일(One To One)](#one-to-one)
- [일대다(One To Many)](#one-to-many)
- [다대다(Many To Many)](#many-to-many)
- [Has One Through](#has-one-through)
- [Has Many Through](#has-many-through)
- [일대일(다형성)](#one-to-one-polymorphic-relations)
- [일대다(다형성)](#one-to-many-polymorphic-relations)
- [다대다(다형성)](#many-to-many-polymorphic-relations)

</div>


## 관계 정의하기 {#defining-relationships}

Eloquent 관계는 Eloquent 모델 클래스의 메서드로 정의됩니다. 관계는 강력한 [쿼리 빌더](/docs/{{version}}/queries) 역할도 하기 때문에, 메서드로 관계를 정의하면 강력한 메서드 체이닝과 쿼리 기능을 사용할 수 있습니다. 예를 들어, 이 `posts` 관계에 추가적인 쿼리 제약 조건을 체이닝할 수 있습니다:

```php
$user->posts()->where('active', 1)->get();
```

하지만 관계를 본격적으로 사용하기 전에, Eloquent에서 지원하는 각 관계 유형을 어떻게 정의하는지 먼저 알아보겠습니다.


### 일대일 / Has One {#one-to-one}

일대일 관계는 가장 기본적인 유형의 데이터베이스 관계입니다. 예를 들어, `User` 모델은 하나의 `Phone` 모델과 연관될 수 있습니다. 이 관계를 정의하기 위해 `User` 모델에 `phone` 메서드를 추가합니다. `phone` 메서드는 `hasOne` 메서드를 호출하고 그 결과를 반환해야 합니다. `hasOne` 메서드는 모델의 `Illuminate\Database\Eloquent\Model` 기본 클래스를 통해 사용할 수 있습니다:

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

`hasOne` 메서드에 전달되는 첫 번째 인자는 연관된 모델 클래스의 이름입니다. 관계가 정의되면, Eloquent의 동적 속성을 사용하여 연관된 레코드를 조회할 수 있습니다. 동적 속성을 사용하면 관계 메서드를 마치 모델에 정의된 속성처럼 접근할 수 있습니다:

```php
$phone = User::find(1)->phone;
```

Eloquent는 부모 모델 이름을 기준으로 관계의 외래 키를 결정합니다. 이 경우, `Phone` 모델에는 자동으로 `user_id` 외래 키가 있다고 가정합니다. 이 규칙을 변경하고 싶다면, `hasOne` 메서드에 두 번째 인자를 전달할 수 있습니다:

```php
return $this->hasOne(Phone::class, 'foreign_key');
```

또한, Eloquent는 외래 키의 값이 부모의 기본 키 컬럼과 일치해야 한다고 가정합니다. 즉, Eloquent는 사용자의 `id` 컬럼 값을 `Phone` 레코드의 `user_id` 컬럼에서 찾습니다. 만약 관계에서 `id`나 모델의 `$primaryKey` 속성 이외의 기본 키 값을 사용하고 싶다면, `hasOne` 메서드에 세 번째 인자를 전달할 수 있습니다:

```php
return $this->hasOne(Phone::class, 'foreign_key', 'local_key');
```


#### 관계의 역방향 정의하기 {#one-to-one-defining-the-inverse-of-the-relationship}

이제 `User` 모델에서 `Phone` 모델에 접근할 수 있습니다. 다음으로, `Phone` 모델에서 해당 전화기를 소유한 사용자를 접근할 수 있는 관계를 정의해봅시다. `hasOne` 관계의 역방향은 `belongsTo` 메서드를 사용하여 정의할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Phone extends Model
{
    /**
     * 이 전화기를 소유한 사용자를 가져옵니다.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`user` 메서드를 호출하면, Eloquent는 `Phone` 모델의 `user_id` 컬럼과 일치하는 `id`를 가진 `User` 모델을 찾으려고 시도합니다.

Eloquent는 관계 메서드의 이름을 확인하고 그 이름 뒤에 `_id`를 붙여 외래 키 이름을 결정합니다. 따라서 이 경우, Eloquent는 `Phone` 모델에 `user_id` 컬럼이 있다고 가정합니다. 하지만 만약 `Phone` 모델의 외래 키가 `user_id`가 아니라면, `belongsTo` 메서드의 두 번째 인자로 사용자 지정 키 이름을 전달할 수 있습니다:

```php
/**
 * 이 전화기를 소유한 사용자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'foreign_key');
}
```

만약 부모 모델이 기본 키로 `id`를 사용하지 않거나, 다른 컬럼을 사용하여 연관된 모델을 찾고 싶다면, `belongsTo` 메서드의 세 번째 인자로 부모 테이블의 사용자 지정 키를 지정할 수 있습니다:

```php
/**
 * 이 전화기를 소유한 사용자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'foreign_key', 'owner_key');
}
```


### 일대다 / Has Many {#one-to-many}

일대다 관계는 하나의 모델이 하나 이상의 자식 모델의 부모가 되는 관계를 정의할 때 사용됩니다. 예를 들어, 하나의 블로그 게시글에는 무한한 수의 댓글이 달릴 수 있습니다. 다른 모든 Eloquent 관계와 마찬가지로, 일대다 관계는 Eloquent 모델에 메서드를 정의하여 설정합니다:

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

Eloquent는 `Comment` 모델에 대한 적절한 외래 키 컬럼을 자동으로 결정한다는 점을 기억하세요. 관례상, Eloquent는 부모 모델의 이름을 "스네이크 케이스"로 변환한 뒤, 그 뒤에 `_id`를 붙입니다. 따라서 이 예제에서 Eloquent는 `Comment` 모델의 외래 키 컬럼이 `post_id`라고 가정합니다.

관계 메서드를 정의한 후에는 `comments` 프로퍼티에 접근하여 관련된 [컬렉션](/docs/{{version}}/eloquent-collections)의 댓글들을 가져올 수 있습니다. Eloquent는 "동적 관계 프로퍼티"를 제공하므로, 관계 메서드에 마치 모델의 프로퍼티인 것처럼 접근할 수 있습니다:

```php
use App\Models\Post;

$comments = Post::find(1)->comments;

foreach ($comments as $comment) {
    // ...
}
```

모든 관계는 쿼리 빌더로도 동작하므로, `comments` 메서드를 호출한 뒤 쿼리에 조건을 추가하여 관계 쿼리에 추가 제약을 걸 수 있습니다:

```php
$comment = Post::find(1)->comments()
    ->where('title', 'foo')
    ->first();
```

`hasOne` 메서드와 마찬가지로, 추가 인자를 `hasMany` 메서드에 전달하여 외래 키와 로컬 키를 오버라이드할 수도 있습니다:

```php
return $this->hasMany(Comment::class, 'foreign_key');

return $this->hasMany(Comment::class, 'foreign_key', 'local_key');
```


#### 자식 모델에서 부모 모델을 자동으로 하이드레이팅하기 {#automatically-hydrating-parent-models-on-children}

Eloquent의 eager loading을 사용하더라도, 자식 모델을 반복하면서 자식 모델에서 부모 모델에 접근하려고 하면 "N + 1" 쿼리 문제가 발생할 수 있습니다:

```php
$posts = Post::with('comments')->get();

foreach ($posts as $post) {
    foreach ($post->comments as $comment) {
        echo $comment->post->title;
    }
}
```

위 예제에서는, 모든 `Post` 모델에 대해 댓글이 eager load 되었음에도 불구하고, Eloquent는 각 자식 `Comment` 모델에 부모 `Post`를 자동으로 하이드레이팅하지 않기 때문에 "N + 1" 쿼리 문제가 발생합니다.

Eloquent가 부모 모델을 자식 모델에 자동으로 하이드레이팅하도록 하려면, `hasMany` 관계를 정의할 때 `chaperone` 메서드를 호출하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /**
     * 블로그 포스트의 댓글을 가져옵니다.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->chaperone();
    }
}
```

또는, 런타임에 자동 부모 하이드레이팅을 선택적으로 사용하고 싶다면, 관계를 eager load할 때 `chaperone` 메서드를 호출할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::with([
    'comments' => fn ($comments) => $comments->chaperone(),
])->get();
```


### 일대다(역방향) / Belongs To {#one-to-many-inverse}

이제 게시글의 모든 댓글에 접근할 수 있게 되었으니, 이번에는 댓글이 자신의 부모 게시글에 접근할 수 있도록 관계를 정의해봅시다. `hasMany` 관계의 역방향을 정의하려면, 자식 모델에 `belongsTo` 메서드를 호출하는 관계 메서드를 정의하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    /**
     * 댓글이 소속된 게시글을 가져옵니다.
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

위 예제에서 Eloquent는 `Comment` 모델의 `post_id` 컬럼과 일치하는 `id`를 가진 `Post` 모델을 찾으려고 시도합니다.

Eloquent는 관계 메서드의 이름을 확인하고, 그 이름 뒤에 부모 모델의 기본 키 컬럼명을 `_`로 이어붙여 기본 외래 키 이름을 결정합니다. 따라서 이 예제에서는 Eloquent가 `comments` 테이블에서 `Post` 모델의 외래 키를 `post_id`로 가정합니다.

하지만 관계의 외래 키가 이러한 규칙을 따르지 않는 경우, `belongsTo` 메서드의 두 번째 인수로 커스텀 외래 키 이름을 전달할 수 있습니다:

```php
/**
 * 댓글이 소속된 게시글을 가져옵니다.
 */
public function post(): BelongsTo
{
    return $this->belongsTo(Post::class, 'foreign_key');
}
```

부모 모델이 기본 키로 `id`를 사용하지 않거나, 다른 컬럼을 사용하여 연관된 모델을 찾고 싶다면, `belongsTo` 메서드의 세 번째 인수로 부모 테이블의 커스텀 키를 지정할 수 있습니다:

```php
/**
 * 댓글이 소속된 게시글을 가져옵니다.
 */
public function post(): BelongsTo
{
    return $this->belongsTo(Post::class, 'foreign_key', 'owner_key');
}
```


#### 기본 모델 {#default-models}

`belongsTo`, `hasOne`, `hasOneThrough`, 그리고 `morphOne` 관계에서는 해당 관계가 `null`일 경우 반환될 기본 모델을 정의할 수 있습니다. 이 패턴은 종종 [Null Object 패턴](https://en.wikipedia.org/wiki/Null_Object_pattern)이라고 불리며, 코드에서 조건문을 제거하는 데 도움이 됩니다. 아래 예시에서, `user` 관계는 `Post` 모델에 연결된 사용자가 없을 경우 빈 `App\Models\User` 모델을 반환합니다:

```php
/**
 * 게시글의 작성자를 가져옵니다.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class)->withDefault();
}
```

기본 모델에 속성을 채워넣으려면, 배열이나 클로저를 `withDefault` 메서드에 전달할 수 있습니다:

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

"Belongs to" 관계의 자식들을 쿼리할 때, 해당 Eloquent 모델을 가져오기 위해 `where` 절을 수동으로 작성할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::where('user_id', $user->id)->get();
```

하지만, `whereBelongsTo` 메서드를 사용하면 주어진 모델에 대해 적절한 관계와 외래 키를 자동으로 결정해주기 때문에 더 편리하게 사용할 수 있습니다:

```php
$posts = Post::whereBelongsTo($user)->get();
```

또한, `whereBelongsTo` 메서드에 [컬렉션](/docs/{{version}}/eloquent-collections) 인스턴스를 전달할 수도 있습니다. 이 경우, Laravel은 컬렉션 내의 부모 모델 중 하나에 속하는 모든 모델을 조회합니다:

```php
$users = User::where('vip', true)->get();

$posts = Post::whereBelongsTo($users)->get();
```

기본적으로 Laravel은 주어진 모델의 클래스 이름을 기반으로 관계를 결정하지만, `whereBelongsTo` 메서드의 두 번째 인자로 관계 이름을 직접 지정할 수도 있습니다:

```php
$posts = Post::whereBelongsTo($user, 'author')->get();
```


### Has One of Many {#has-one-of-many}

때때로 한 모델이 여러 관련 모델을 가질 수 있지만, 관계에서 "가장 최신" 또는 "가장 오래된" 관련 모델을 쉽게 가져오고 싶을 때가 있습니다. 예를 들어, `User` 모델이 여러 개의 `Order` 모델과 연관되어 있을 수 있지만, 사용자가 가장 최근에 주문한 내역에 편리하게 접근할 수 있는 방법을 정의하고 싶을 수 있습니다. 이는 `hasOne` 관계 타입과 `ofMany` 메서드를 조합하여 구현할 수 있습니다:

```php
/**
 * 사용자의 가장 최근 주문을 가져옵니다.
 */
public function latestOrder(): HasOne
{
    return $this->hasOne(Order::class)->latestOfMany();
}
```

마찬가지로, 관계에서 "가장 오래된" 또는 첫 번째 관련 모델을 가져오는 메서드를 정의할 수도 있습니다:

```php
/**
 * 사용자의 가장 오래된 주문을 가져옵니다.
 */
public function oldestOrder(): HasOne
{
    return $this->hasOne(Order::class)->oldestOfMany();
}
```

기본적으로 `latestOfMany`와 `oldestOfMany` 메서드는 모델의 기본 키를 기준으로 가장 최신 또는 가장 오래된 관련 모델을 가져오며, 이 키는 정렬이 가능해야 합니다. 하지만 때로는 더 큰 관계에서 다른 정렬 기준을 사용하여 단일 모델을 가져오고 싶을 수도 있습니다.

예를 들어, `ofMany` 메서드를 사용하여 사용자의 가장 비싼 주문을 가져올 수 있습니다. `ofMany` 메서드는 첫 번째 인자로 정렬할 컬럼명을, 두 번째 인자로 관련 모델을 조회할 때 사용할 집계 함수(`min` 또는 `max`)를 받습니다:

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
> PostgreSQL은 UUID 컬럼에 대해 `MAX` 함수를 실행하는 것을 지원하지 않으므로, 현재 PostgreSQL UUID 컬럼과 one-of-many 관계를 조합하여 사용하는 것은 불가능합니다.


#### "Many" 관계를 Has One 관계로 변환하기 {#converting-many-relationships-to-has-one-relationships}

종종 `latestOfMany`, `oldestOfMany`, 또는 `ofMany` 메서드를 사용하여 단일 모델을 조회할 때, 동일한 모델에 대해 이미 "has many" 관계가 정의되어 있을 수 있습니다. 편의를 위해, Laravel은 관계에서 `one` 메서드를 호출하여 이 관계를 쉽게 "has one" 관계로 변환할 수 있도록 지원합니다:

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

또한 `one` 메서드를 사용하여 `HasManyThrough` 관계를 `HasOneThrough` 관계로 변환할 수도 있습니다:

```php
public function latestDeployment(): HasOneThrough
{
    return $this->deployments()->one()->latestOfMany();
}
```


#### 고급 Has One of Many 관계 {#advanced-has-one-of-many-relationships}

더 고급스러운 "has one of many" 관계를 구성하는 것도 가능합니다. 예를 들어, `Product` 모델은 새로운 가격이 게시된 후에도 시스템에 보관되는 여러 개의 `Price` 모델과 연관될 수 있습니다. 또한, 제품에 대한 새로운 가격 데이터는 `published_at` 컬럼을 통해 미래의 특정 시점에 적용되도록 미리 게시될 수도 있습니다.

요약하자면, 우리는 게시일이 미래가 아닌 최신의 게시된 가격을 조회해야 합니다. 또한, 두 가격의 게시일이 동일하다면, 더 큰 ID를 가진 가격을 우선적으로 선택해야 합니다. 이를 위해서는, 최신 가격을 결정하는 정렬 가능한 컬럼들을 포함하는 배열을 `ofMany` 메서드에 전달해야 합니다. 그리고 두 번째 인자로 클로저를 제공하여, 이 클로저에서 관계 쿼리에 추가적인 게시일 제약 조건을 추가할 수 있습니다:

```php
/**
 * 해당 제품의 현재 가격을 가져옵니다.
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


### Has One Through {#has-one-through}

"has-one-through" 관계는 다른 모델과의 일대일 관계를 정의합니다. 그러나 이 관계는 선언된 모델이 _중간_ 모델을 거쳐 다른 모델의 한 인스턴스와 매칭될 수 있음을 나타냅니다.

예를 들어, 차량 정비소 애플리케이션에서 각 `Mechanic`(정비사) 모델은 하나의 `Car`(자동차) 모델과 연관될 수 있고, 각 `Car` 모델은 하나의 `Owner`(소유자) 모델과 연관될 수 있습니다. 정비사와 소유자는 데이터베이스 내에서 직접적인 관계가 없지만, 정비사는 `Car` 모델을 _통해_ 소유자에 접근할 수 있습니다. 이 관계를 정의하는 데 필요한 테이블을 살펴보겠습니다:

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

이제 관계를 위한 테이블 구조를 살펴보았으니, `Mechanic` 모델에서 관계를 정의해봅시다:

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

`hasOneThrough` 메서드에 전달되는 첫 번째 인자는 접근하고자 하는 최종 모델의 이름이고, 두 번째 인자는 중간 모델의 이름입니다.

또는, 관계에 관련된 모든 모델에 이미 해당 관계가 정의되어 있다면, `through` 메서드를 호출하고 그 관계의 이름을 전달하여 "has-one-through" 관계를 유연하게 정의할 수 있습니다. 예를 들어, `Mechanic` 모델에 `cars` 관계가 있고, `Car` 모델에 `owner` 관계가 있다면, 다음과 같이 정비사와 소유자를 연결하는 "has-one-through" 관계를 정의할 수 있습니다:

```php
// 문자열 기반 문법...
return $this->through('cars')->has('owner');

// 동적 문법...
return $this->throughCars()->hasOwner();
```


#### 주요 규칙 {#has-one-through-key-conventions}

관계 쿼리를 수행할 때는 일반적인 Eloquent 외래 키 규칙이 사용됩니다. 관계의 키를 커스터마이즈하고 싶다면, `hasOneThrough` 메서드의 세 번째와 네 번째 인수로 전달할 수 있습니다. 세 번째 인수는 중간 모델에 있는 외래 키의 이름입니다. 네 번째 인수는 최종 모델에 있는 외래 키의 이름입니다. 다섯 번째 인수는 로컬 키이고, 여섯 번째 인수는 중간 모델의 로컬 키입니다:

```php
class Mechanic extends Model
{
    /**
     * 자동차 소유자를 가져옵니다.
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

또는 앞서 설명한 것처럼, 관계에 관련된 모든 모델에 이미 해당 관계가 정의되어 있다면, `through` 메서드를 호출하고 해당 관계의 이름을 전달하여 "has-one-through" 관계를 간결하게 정의할 수 있습니다. 이 방법은 기존 관계에 이미 정의된 키 규칙을 재사용할 수 있다는 장점이 있습니다:

```php
// 문자열 기반 문법...
return $this->through('cars')->has('owner');

// 동적 문법...
return $this->throughCars()->hasOwner();
```


### Has Many Through {#has-many-through}

"has-many-through" 관계는 중간 관계를 통해 먼 관계에 쉽게 접근할 수 있는 방법을 제공합니다. 예를 들어, [Laravel Cloud](https://cloud.laravel.com)와 같은 배포 플랫폼을 구축한다고 가정해 봅시다. `Application` 모델은 중간에 있는 `Environment` 모델을 통해 여러 개의 `Deployment` 모델에 접근할 수 있습니다. 이 예시를 사용하면, 특정 애플리케이션에 대한 모든 배포 정보를 쉽게 모을 수 있습니다. 이 관계를 정의하기 위해 필요한 테이블을 살펴보겠습니다:

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

이제 관계를 위한 테이블 구조를 살펴보았으니, `Application` 모델에서 이 관계를 정의해 보겠습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Application extends Model
{
    /**
     * 애플리케이션의 모든 배포 정보를 가져옵니다.
     */
    public function deployments(): HasManyThrough
    {
        return $this->hasManyThrough(Deployment::class, Environment::class);
    }
}
```

`hasManyThrough` 메서드에 전달되는 첫 번째 인자는 최종적으로 접근하고자 하는 모델의 이름이고, 두 번째 인자는 중간 모델의 이름입니다.

또는, 관계에 관련된 모든 모델에 이미 해당 관계가 정의되어 있다면, `through` 메서드를 호출하고 그 관계의 이름을 전달하여 "has-many-through" 관계를 유연하게 정의할 수 있습니다. 예를 들어, `Application` 모델에 `environments` 관계가 있고, `Environment` 모델에 `deployments` 관계가 있다면, 아래와 같이 애플리케이션과 배포 정보를 연결하는 "has-many-through" 관계를 정의할 수 있습니다:

```php
// 문자열 기반 문법...
return $this->through('environments')->has('deployments');

// 동적 문법...
return $this->throughEnvironments()->hasDeployments();
```

`Deployment` 모델의 테이블에는 `application_id` 컬럼이 없지만, `hasManyThrough` 관계를 통해 `$application->deployments`로 애플리케이션의 배포 정보에 접근할 수 있습니다. 이러한 모델을 조회하기 위해 Eloquent는 중간 `Environment` 모델의 테이블에서 `application_id` 컬럼을 확인합니다. 관련된 환경 ID를 찾은 후, 이를 사용해 `Deployment` 모델의 테이블을 조회합니다.


#### 주요 규약 {#has-many-through-key-conventions}

관계 쿼리를 수행할 때는 일반적인 Eloquent 외래 키 규약이 사용됩니다. 관계의 키를 커스터마이즈하고 싶다면, `hasManyThrough` 메서드의 세 번째와 네 번째 인수로 전달할 수 있습니다. 세 번째 인수는 중간 모델에 있는 외래 키의 이름입니다. 네 번째 인수는 최종 모델에 있는 외래 키의 이름입니다. 다섯 번째 인수는 로컬 키이며, 여섯 번째 인수는 중간 모델의 로컬 키입니다:

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

또는 앞서 설명한 것처럼, 관계에 관련된 모든 모델에 이미 해당 관계가 정의되어 있다면, `through` 메서드를 호출하고 해당 관계의 이름을 전달하여 "has-many-through" 관계를 유연하게 정의할 수 있습니다. 이 방법은 기존 관계에 이미 정의된 키 규약을 재사용할 수 있다는 장점이 있습니다:

```php
// 문자열 기반 문법...
return $this->through('environments')->has('deployments');

// 동적 문법...
return $this->throughEnvironments()->hasDeployments();
```


### 범위가 지정된 관계 {#scoped-relationships}

모델에 관계를 제한하는 추가 메서드를 추가하는 것은 일반적인 일입니다. 예를 들어, `User` 모델에 `featuredPosts` 메서드를 추가하여 더 넓은 `posts` 관계에 추가적인 `where` 제약 조건을 둘 수 있습니다:

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

하지만 `featuredPosts` 메서드를 통해 모델을 생성하려고 하면, 해당 모델의 `featured` 속성이 `true`로 설정되지 않습니다. 관계 메서드를 통해 모델을 생성할 때, 해당 관계를 통해 생성되는 모든 모델에 추가되어야 하는 속성을 지정하고 싶다면, 관계 쿼리를 작성할 때 `withAttributes` 메서드를 사용할 수 있습니다:

```php
/**
 * 사용자의 추천 게시글을 가져옵니다.
 */
public function featuredPosts(): HasMany
{
    return $this->posts()->withAttributes(['featured' => true]);
}
```

`withAttributes` 메서드는 주어진 속성으로 쿼리에 `where` 조건을 추가하고, 관계 메서드를 통해 생성된 모든 모델에도 해당 속성을 추가합니다:

```php
$post = $user->featuredPosts()->create(['title' => 'Featured Post']);

$post->featured; // true
```

`withAttributes` 메서드가 쿼리에 `where` 조건을 추가하지 않도록 하려면, `asConditions` 인자를 `false`로 설정할 수 있습니다:

```php
return $this->posts()->withAttributes(['featured' => true], asConditions: false);
```


## 다대다 관계 {#many-to-many}

다대다 관계는 `hasOne` 및 `hasMany` 관계보다 약간 더 복잡합니다. 다대다 관계의 예로는 여러 역할을 가진 사용자가 있고, 그 역할들이 애플리케이션의 다른 사용자들과도 공유되는 경우가 있습니다. 예를 들어, 한 사용자가 "Author(작성자)"와 "Editor(편집자)" 역할을 모두 가질 수 있습니다. 하지만 이러한 역할들은 다른 사용자에게도 할당될 수 있습니다. 즉, 한 사용자는 여러 역할을 가질 수 있고, 하나의 역할도 여러 사용자가 가질 수 있습니다.


#### 테이블 구조 {#many-to-many-table-structure}

이 관계를 정의하기 위해서는 `users`, `roles`, `role_user` 세 개의 데이터베이스 테이블이 필요합니다. `role_user` 테이블은 관련 모델 이름의 알파벳 순서에 따라 만들어지며, `user_id`와 `role_id` 컬럼을 포함합니다. 이 테이블은 사용자와 역할을 연결하는 중간 테이블로 사용됩니다.

역할이 여러 사용자에게 속할 수 있으므로, 단순히 `roles` 테이블에 `user_id` 컬럼을 추가할 수는 없습니다. 그렇게 하면 하나의 역할이 오직 한 명의 사용자에게만 속할 수 있게 되기 때문입니다. 여러 사용자에게 역할을 할당할 수 있도록 지원하려면 `role_user` 테이블이 필요합니다. 관계의 테이블 구조는 다음과 같이 요약할 수 있습니다:

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

다대다 관계는 `belongsToMany` 메서드의 결과를 반환하는 메서드를 작성하여 정의합니다. `belongsToMany` 메서드는 여러분의 애플리케이션의 모든 Eloquent 모델이 사용하는 `Illuminate\Database\Eloquent\Model` 기본 클래스에서 제공됩니다. 예를 들어, `User` 모델에 `roles` 메서드를 정의해보겠습니다. 이 메서드에 전달되는 첫 번째 인수는 연관된 모델 클래스의 이름입니다:

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

관계가 정의되면, `roles` 동적 관계 프로퍼티를 사용하여 사용자의 역할에 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->roles as $role) {
    // ...
}
```

모든 관계는 쿼리 빌더로도 동작하므로, `roles` 메서드를 호출하고 쿼리에 조건을 체이닝하여 관계 쿼리에 추가 제약을 걸 수 있습니다:

```php
$roles = User::find(1)->roles()->orderBy('name')->get();
```

관계의 중간 테이블 이름을 결정하기 위해, Eloquent는 두 관련 모델 이름을 알파벳 순으로 결합합니다. 하지만, 이 규칙을 자유롭게 오버라이드할 수 있습니다. `belongsToMany` 메서드에 두 번째 인수를 전달하여 이를 지정할 수 있습니다:

```php
return $this->belongsToMany(Role::class, 'role_user');
```

중간 테이블의 이름을 커스터마이징하는 것 외에도, 추가 인수를 `belongsToMany` 메서드에 전달하여 테이블의 키 컬럼 이름도 커스터마이징할 수 있습니다. 세 번째 인수는 관계를 정의하는 모델의 외래 키 이름이고, 네 번째 인수는 조인되는 모델의 외래 키 이름입니다:

```php
return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
```


#### 관계의 역방향 정의하기 {#many-to-many-defining-the-inverse-of-the-relationship}

다대다(many-to-many) 관계의 "역방향"을 정의하려면, 관련 모델에 `belongsToMany` 메서드의 결과를 반환하는 메서드를 정의해야 합니다. 사용자(user)와 역할(role) 예제를 완성하기 위해, `Role` 모델에 `users` 메서드를 다음과 같이 정의해봅시다:

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

보시다시피, 이 관계는 `App\Models\User` 모델을 참조하는 것만 제외하면 `User` 모델에서 정의한 것과 정확히 동일하게 정의됩니다. `belongsToMany` 메서드를 재사용하기 때문에, 다대다 관계의 "역방향"을 정의할 때도 모든 일반적인 테이블 및 키 커스터마이징 옵션을 사용할 수 있습니다.


### 중간 테이블 컬럼 조회하기 {#retrieving-intermediate-table-columns}

이미 배운 것처럼, 다대다 관계를 다루기 위해서는 중간 테이블이 필요합니다. Eloquent는 이 테이블과 상호작용할 수 있는 매우 유용한 방법들을 제공합니다. 예를 들어, 우리의 `User` 모델이 여러 개의 `Role` 모델과 관계를 맺고 있다고 가정해봅시다. 이 관계에 접근한 후, 모델의 `pivot` 속성을 사용하여 중간 테이블에 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->roles as $role) {
    echo $role->pivot->created_at;
}
```

가져온 각 `Role` 모델에는 자동으로 `pivot` 속성이 할당된다는 점에 주목하세요. 이 속성은 중간 테이블을 나타내는 모델을 포함합니다.

기본적으로, `pivot` 모델에는 모델 키만 존재합니다. 만약 중간 테이블에 추가 속성이 있다면, 관계를 정의할 때 이를 명시해야 합니다:

```php
return $this->belongsToMany(Role::class)->withPivot('active', 'created_by');
```

중간 테이블에 Eloquent가 자동으로 관리하는 `created_at` 및 `updated_at` 타임스탬프가 포함되길 원한다면, 관계를 정의할 때 `withTimestamps` 메서드를 호출하세요:

```php
return $this->belongsToMany(Role::class)->withTimestamps();
```

> [!WARNING]
> Eloquent의 자동 타임스탬프 기능을 사용하는 중간 테이블에는 반드시 `created_at`과 `updated_at` 타임스탬프 컬럼이 모두 존재해야 합니다.


#### `pivot` 속성 이름 사용자 지정 {#customizing-the-pivot-attribute-name}

앞서 언급했듯이, 중간 테이블의 속성들은 모델에서 `pivot` 속성을 통해 접근할 수 있습니다. 하지만, 이 속성의 이름을 애플리케이션의 목적에 맞게 자유롭게 변경할 수 있습니다.

예를 들어, 애플리케이션에 사용자가 팟캐스트를 구독할 수 있는 기능이 있다면, 사용자와 팟캐스트 사이에 다대다 관계가 있을 것입니다. 이 경우, 중간 테이블 속성의 이름을 `pivot` 대신 `subscription`으로 변경하고 싶을 수 있습니다. 관계를 정의할 때 `as` 메서드를 사용하여 이를 지정할 수 있습니다:

```php
return $this->belongsToMany(Podcast::class)
    ->as('subscription')
    ->withTimestamps();
```

사용자 지정 중간 테이블 속성을 지정한 후에는, 지정한 이름을 사용하여 중간 테이블 데이터를 접근할 수 있습니다:

```php
$users = User::with('podcasts')->get();

foreach ($users->flatMap->podcasts as $podcast) {
    echo $podcast->subscription->created_at;
}
```


### 중간 테이블 컬럼을 통한 쿼리 필터링 {#filtering-queries-via-intermediate-table-columns}

`belongsToMany` 관계 쿼리를 정의할 때 `wherePivot`, `wherePivotIn`, `wherePivotNotIn`, `wherePivotBetween`, `wherePivotNotBetween`, `wherePivotNull`, `wherePivotNotNull` 메서드를 사용하여 반환되는 결과를 필터링할 수도 있습니다:

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

`wherePivot`는 쿼리에 where 절 제약 조건을 추가하지만, 정의된 관계를 통해 새로운 모델을 생성할 때 지정된 값을 추가하지는 않습니다. 만약 특정 pivot 값을 사용하여 쿼리와 생성 모두를 해야 한다면, `withPivotValue` 메서드를 사용할 수 있습니다:

```php
return $this->belongsToMany(Role::class)
    ->withPivotValue('approved', 1);
```


### 중간 테이블 컬럼을 통한 쿼리 정렬 {#ordering-queries-via-intermediate-table-columns}

`belongsToMany` 관계 쿼리에서 `orderByPivot` 메서드를 사용하여 반환되는 결과를 정렬할 수 있습니다. 다음 예제에서는 사용자의 최신 배지를 모두 조회합니다:

```php
return $this->belongsToMany(Badge::class)
    ->where('rank', 'gold')
    ->orderByPivot('created_at', 'desc');
```


### 커스텀 중간 테이블 모델 정의하기 {#defining-custom-intermediate-table-models}

다대다 관계의 중간 테이블을 나타내는 커스텀 모델을 정의하고 싶다면, 관계를 정의할 때 `using` 메서드를 호출하면 됩니다. 커스텀 피벗 모델을 사용하면 피벗 모델에 메서드나 캐스트 등 추가 동작을 정의할 수 있습니다.

커스텀 다대다 피벗 모델은 `Illuminate\Database\Eloquent\Relations\Pivot` 클래스를 확장해야 하며, 커스텀 다형 다대다 피벗 모델은 `Illuminate\Database\Eloquent\Relations\MorphPivot` 클래스를 확장해야 합니다. 예를 들어, 커스텀 `RoleUser` 피벗 모델을 사용하는 `Role` 모델을 다음과 같이 정의할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    /**
     * 이 역할에 속한 사용자들.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->using(RoleUser::class);
    }
}
```

`RoleUser` 모델을 정의할 때는 `Illuminate\Database\Eloquent\Relations\Pivot` 클래스를 확장해야 합니다:

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
> 피벗 모델에서는 `SoftDeletes` 트레이트를 사용할 수 없습니다. 피벗 레코드를 소프트 삭제해야 한다면, 피벗 모델을 실제 Eloquent 모델로 변환하는 것을 고려하세요.


#### 커스텀 피벗 모델과 자동 증가 ID {#custom-pivot-models-and-incrementing-ids}

만약 커스텀 피벗 모델을 사용하는 다대다 관계를 정의했고, 해당 피벗 모델에 자동 증가 기본 키가 있다면, 커스텀 피벗 모델 클래스에 `incrementing` 속성이 `true`로 설정되어 있는지 확인해야 합니다.

```php
/**
 * ID가 자동 증가하는지 여부를 나타냅니다.
 *
 * @var bool
 */
public $incrementing = true;
```


## 다형성 관계 {#polymorphic-relationships}

다형성 관계는 자식 모델이 하나의 연관을 통해 둘 이상의 타입의 모델에 속할 수 있도록 해줍니다. 예를 들어, 사용자가 블로그 게시글과 비디오를 공유할 수 있는 애플리케이션을 만든다고 가정해봅시다. 이런 애플리케이션에서 `Comment` 모델은 `Post` 모델과 `Video` 모델 모두에 속할 수 있습니다.


### 일대일(다형성) 관계 {#one-to-one-polymorphic-relations}


#### 테이블 구조 {#one-to-one-polymorphic-table-structure}

일대일 다형성 관계는 일반적인 일대일 관계와 유사하지만, 자식 모델이 단일 연관을 통해 둘 이상의 모델 타입에 속할 수 있다는 점이 다릅니다. 예를 들어, 블로그의 `Post`와 `User`가 `Image` 모델과 다형성 관계를 가질 수 있습니다. 일대일 다형성 관계를 사용하면 게시글과 사용자 모두에 연관될 수 있는 고유한 이미지들을 하나의 테이블에 저장할 수 있습니다. 먼저, 테이블 구조를 살펴보겠습니다:

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

`images` 테이블의 `imageable_id`와 `imageable_type` 컬럼에 주목하세요. `imageable_id` 컬럼에는 게시글 또는 사용자의 ID 값이 저장되고, `imageable_type` 컬럼에는 부모 모델의 클래스명이 저장됩니다. Eloquent는 `imageable_type` 컬럼을 사용하여 `imageable` 관계를 접근할 때 어떤 "타입"의 부모 모델을 반환할지 결정합니다. 이 경우, 해당 컬럼에는 `App\Models\Post` 또는 `App\Models\User`가 저장됩니다.


#### 모델 구조 {#one-to-one-polymorphic-model-structure}

다음으로, 이 관계를 구축하는 데 필요한 모델 정의를 살펴보겠습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    /**
     * 상위 imageable 모델(사용자 또는 게시글)을 가져옵니다.
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

다형성 모델의 부모를 조회하려면 `morphTo`를 호출하는 메서드의 이름에 접근하면 됩니다. 이 경우, `Image` 모델의 `imageable` 메서드가 해당합니다. 따라서, 이 메서드에 동적 관계 프로퍼티로 접근할 수 있습니다:

```php
use App\Models\Image;

$image = Image::find(1);

$imageable = $image->imageable;
```

`Image` 모델의 `imageable` 관계는 이미지를 소유한 모델의 타입에 따라 `Post` 또는 `User` 인스턴스를 반환합니다.


#### 주요 규칙 {#morph-one-to-one-key-conventions}

필요하다면, 다형성 자식 모델에서 사용되는 "id"와 "type" 컬럼의 이름을 지정할 수 있습니다. 이 경우, 항상 관계의 이름을 `morphTo` 메서드의 첫 번째 인수로 전달해야 합니다. 일반적으로 이 값은 메서드 이름과 일치해야 하므로, PHP의 `__FUNCTION__` 상수를 사용할 수 있습니다:

```php
/**
 * 이미지를 소유한 모델을 가져옵니다.
 */
public function imageable(): MorphTo
{
    return $this->morphTo(__FUNCTION__, 'imageable_type', 'imageable_id');
}
```


### 일대다(다형성) 관계 {#one-to-many-polymorphic-relations}


#### 테이블 구조 {#one-to-many-polymorphic-table-structure}

일대다 폴리모픽(다형성) 관계는 일반적인 일대다 관계와 유사하지만, 자식 모델이 단일 연관을 통해 둘 이상의 모델 타입에 속할 수 있다는 점이 다릅니다. 예를 들어, 여러분의 애플리케이션 사용자들이 게시글과 동영상에 "댓글"을 달 수 있다고 가정해봅시다. 폴리모픽 관계를 사용하면, 하나의 `comments` 테이블을 통해 게시글과 동영상 모두에 대한 댓글을 저장할 수 있습니다. 먼저, 이 관계를 구축하는 데 필요한 테이블 구조를 살펴보겠습니다:

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

이제 이 관계를 구축하는 데 필요한 모델 정의를 살펴보겠습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    /**
     * 상위 commentable 모델(포스트 또는 비디오)을 가져옵니다.
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
     * 포스트의 모든 댓글을 가져옵니다.
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
     * 비디오의 모든 댓글을 가져옵니다.
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```


#### 관계 조회하기 {#one-to-many-polymorphic-retrieving-the-relationship}

데이터베이스 테이블과 모델이 정의되면, 모델의 동적 관계 프로퍼티를 통해 관계에 접근할 수 있습니다. 예를 들어, 게시글의 모든 댓글에 접근하려면 `comments` 동적 프로퍼티를 사용할 수 있습니다:

```php
use App\Models\Post;

$post = Post::find(1);

foreach ($post->comments as $comment) {
    // ...
}
```

또한, 다형성 자식 모델의 부모를 조회하려면 `morphTo`를 호출하는 메서드의 이름을 통해 접근할 수 있습니다. 이 경우, `Comment` 모델의 `commentable` 메서드가 해당 역할을 합니다. 따라서, 이 메서드를 동적 관계 프로퍼티로 접근하여 댓글의 부모 모델에 접근할 수 있습니다:

```php
use App\Models\Comment;

$comment = Comment::find(1);

$commentable = $comment->commentable;
```

`Comment` 모델의 `commentable` 관계는 댓글의 부모 모델이 무엇이냐에 따라 `Post` 또는 `Video` 인스턴스를 반환합니다.


#### 자식 모델에서 부모 모델을 자동으로 하이드레이팅하기 {#polymorphic-automatically-hydrating-parent-models-on-children}

Eloquent의 eager loading을 사용하더라도, 자식 모델을 반복하면서 부모 모델에 접근하려고 하면 "N + 1" 쿼리 문제가 발생할 수 있습니다:

```php
$posts = Post::with('comments')->get();

foreach ($posts as $post) {
    foreach ($post->comments as $comment) {
        echo $comment->commentable->title;
    }
}
```

위 예시에서는, 모든 `Post` 모델에 대해 comments가 eager load 되었음에도 불구하고, Eloquent는 각 자식 `Comment` 모델에 부모 `Post`를 자동으로 하이드레이팅하지 않기 때문에 "N + 1" 쿼리 문제가 발생합니다.

Eloquent가 부모 모델을 자식 모델에 자동으로 하이드레이팅하도록 하려면, `morphMany` 관계를 정의할 때 `chaperone` 메서드를 호출하면 됩니다:

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

또는, 런타임에 자동 부모 하이드레이팅을 선택적으로 적용하고 싶다면, 관계를 eager load할 때 `chaperone` 메서드를 호출할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::with([
    'comments' => fn ($comments) => $comments->chaperone(),
])->get();
```


### One of Many (Polymorphic) {#one-of-many-polymorphic-relations}

때때로 한 모델이 여러 관련 모델을 가질 수 있지만, 이 중에서 관계된 모델 중 "가장 최신" 또는 "가장 오래된" 모델을 쉽게 가져오고 싶을 때가 있습니다. 예를 들어, `User` 모델이 여러 개의 `Image` 모델과 연관되어 있을 수 있지만, 사용자가 업로드한 가장 최근 이미지를 편리하게 다루는 방법을 정의하고 싶을 수 있습니다. 이럴 때는 `morphOne` 관계 타입과 `ofMany` 메서드를 함께 사용할 수 있습니다:

```php
/**
 * 사용자의 가장 최근 이미지를 가져옵니다.
 */
public function latestImage(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable')->latestOfMany();
}
```

마찬가지로, 관계된 모델 중 "가장 오래된" 또는 첫 번째 모델을 가져오는 메서드도 정의할 수 있습니다:

```php
/**
 * 사용자의 가장 오래된 이미지를 가져옵니다.
 */
public function oldestImage(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable')->oldestOfMany();
}
```

기본적으로 `latestOfMany`와 `oldestOfMany` 메서드는 모델의 기본 키를 기준으로 가장 최신 또는 가장 오래된 관련 모델을 가져오며, 이 키는 정렬이 가능해야 합니다. 하지만 때로는 더 큰 관계에서 다른 정렬 기준을 사용해 단일 모델을 가져오고 싶을 수도 있습니다.

예를 들어, `ofMany` 메서드를 사용하면 사용자의 "가장 많은 좋아요를 받은" 이미지를 가져올 수 있습니다. `ofMany` 메서드는 첫 번째 인자로 정렬할 컬럼명을, 두 번째 인자로 관련 모델을 조회할 때 사용할 집계 함수(`min` 또는 `max`)를 받습니다:

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
> 더 고급의 "one of many" 관계를 구성하는 것도 가능합니다. 자세한 내용은 [has one of many 문서](#advanced-has-one-of-many-relationships)를 참고하세요.


### 다대다(폴리모픽) {#many-to-many-polymorphic-relations}


#### 테이블 구조 {#many-to-many-polymorphic-table-structure}

다대다 폴리모픽(다형성) 관계는 "morph one"과 "morph many" 관계보다 약간 더 복잡합니다. 예를 들어, `Post` 모델과 `Video` 모델이 `Tag` 모델과 폴리모픽 관계를 공유할 수 있습니다. 이 상황에서 다대다 폴리모픽 관계를 사용하면, 게시글이나 비디오에 연결될 수 있는 고유한 태그의 단일 테이블을 애플리케이션에서 가질 수 있습니다. 먼저, 이 관계를 구축하는 데 필요한 테이블 구조를 살펴보겠습니다:

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
> 폴리모픽 다대다 관계를 본격적으로 살펴보기 전에, 일반적인 [다대다 관계](#many-to-many)에 대한 문서를 먼저 읽어보는 것이 도움이 될 수 있습니다.


#### 모델 구조 {#many-to-many-polymorphic-model-structure}

이제 모델에서 관계를 정의할 준비가 되었습니다. `Post`와 `Video` 모델 모두 기본 Eloquent 모델 클래스에서 제공하는 `morphToMany` 메서드를 호출하는 `tags` 메서드를 포함하게 됩니다.

`morphToMany` 메서드는 연관된 모델의 이름과 "관계 이름"을 인수로 받습니다. 우리가 중간 테이블 이름과 그 안에 포함된 키에 지정한 이름을 기준으로, 이 관계를 "taggable"이라고 부를 것입니다:

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

다음으로, `Tag` 모델에서 각 가능한 부모 모델에 대한 메서드를 정의해야 합니다. 이 예제에서는 `posts` 메서드와 `videos` 메서드를 정의하겠습니다. 이 두 메서드는 모두 `morphedByMany` 메서드의 결과를 반환해야 합니다.

`morphedByMany` 메서드는 연관된 모델의 이름과 "관계 이름"을 인자로 받습니다. 우리가 중간 테이블 이름과 그 안에 포함된 키에 할당한 이름을 기준으로, 이 관계를 "taggable"로 참조하겠습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    /**
     * 이 태그가 할당된 모든 포스트를 가져옵니다.
     */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    /**
     * 이 태그가 할당된 모든 비디오를 가져옵니다.
     */
    public function videos(): MorphToMany
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}
```


#### 관계 조회하기 {#many-to-many-polymorphic-retrieving-the-relationship}

데이터베이스 테이블과 모델이 정의되면, 모델을 통해 관계에 접근할 수 있습니다. 예를 들어, 게시물의 모든 태그에 접근하려면 `tags` 동적 관계 프로퍼티를 사용할 수 있습니다:

```php
use App\Models\Post;

$post = Post::find(1);

foreach ($post->tags as $tag) {
    // ...
}
```

다형성 관계의 자식 모델에서 부모를 조회하려면, `morphedByMany`를 호출하는 메서드의 이름을 통해 접근할 수 있습니다. 이 경우, `Tag` 모델의 `posts` 또는 `videos` 메서드가 해당됩니다:

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


### 커스텀 다형성 타입 {#custom-polymorphic-types}

기본적으로 Laravel은 연관된 모델의 "타입"을 저장할 때 완전히 한정된 클래스 이름을 사용합니다. 예를 들어, 위의 일대다 관계 예시에서 `Comment` 모델이 `Post` 또는 `Video` 모델에 속할 수 있다면, 기본 `commentable_type` 값은 각각 `App\Models\Post` 또는 `App\Models\Video`가 됩니다. 하지만, 이러한 값들을 애플리케이션의 내부 구조와 분리하고 싶을 수도 있습니다.

예를 들어, 모델 이름 대신 `post`와 `video`와 같은 간단한 문자열을 "타입"으로 사용할 수 있습니다. 이렇게 하면, 데이터베이스의 다형성 "타입" 컬럼 값은 모델 이름이 변경되더라도 유효하게 유지됩니다:

```php
use Illuminate\Database\Eloquent\Relations\Relation;

Relation::enforceMorphMap([
    'post' => 'App\Models\Post',
    'video' => 'App\Models\Video',
]);
```

`enforceMorphMap` 메서드는 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출하거나, 별도의 서비스 프로바이더를 생성하여 호출할 수도 있습니다.

런타임에 주어진 모델의 morph 별칭을 확인하려면 모델의 `getMorphClass` 메서드를 사용할 수 있습니다. 반대로, morph 별칭에 연결된 완전히 한정된 클래스 이름을 확인하려면 `Relation::getMorphedModel` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Relations\Relation;

$alias = $post->getMorphClass();

$class = Relation::getMorphedModel($alias);
```

> [!WARNING]
> 기존 애플리케이션에 "morph map"을 추가할 때, 데이터베이스에 아직 완전히 한정된 클래스가 저장되어 있는 모든 다형성 `*_type` 컬럼 값은 반드시 "map" 이름으로 변환해야 합니다.


### 동적 관계 {#dynamic-relationships}

`resolveRelationUsing` 메서드를 사용하여 런타임에 Eloquent 모델 간의 관계를 정의할 수 있습니다. 일반적인 애플리케이션 개발에서는 권장되지 않지만, Laravel 패키지를 개발할 때는 가끔 유용할 수 있습니다.

`resolveRelationUsing` 메서드는 첫 번째 인자로 원하는 관계 이름을 받습니다. 두 번째 인자는 모델 인스턴스를 받아 유효한 Eloquent 관계 정의를 반환하는 클로저여야 합니다. 일반적으로 동적 관계는 [서비스 프로바이더](/docs/{{version}}/providers)의 boot 메서드 내에서 설정해야 합니다:

```php
use App\Models\Order;
use App\Models\Customer;

Order::resolveRelationUsing('customer', function (Order $orderModel) {
    return $orderModel->belongsTo(Customer::class, 'customer_id');
});
```

> [!WARNING]
> 동적 관계를 정의할 때는 항상 Eloquent 관계 메서드에 명시적인 키 이름 인자를 제공해야 합니다.


## 관계 쿼리하기 {#querying-relations}

모든 Eloquent 관계는 메서드를 통해 정의되므로, 해당 메서드를 호출하여 실제로 관련 모델을 로드하는 쿼리를 실행하지 않고도 관계 인스턴스를 얻을 수 있습니다. 또한, 모든 유형의 Eloquent 관계는 [쿼리 빌더](/docs/{{version}}/queries)로도 동작하므로, 관계 쿼리에 제약 조건을 계속 체이닝한 후 마지막에 데이터베이스에 대해 SQL 쿼리를 실행할 수 있습니다.

예를 들어, `User` 모델이 여러 개의 `Post` 모델과 연관된 블로그 애플리케이션을 상상해보세요:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /**
     * 해당 사용자의 모든 게시글을 가져옵니다.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

아래와 같이 `posts` 관계를 쿼리하고 추가 제약 조건을 더할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->posts()->where('active', 1)->get();
```

관계에서 Laravel [쿼리 빌더](/docs/{{version}}/queries)의 모든 메서드를 사용할 수 있으니, 쿼리 빌더 문서를 참고하여 사용할 수 있는 모든 메서드를 꼭 확인해보세요.


#### 관계 이후에 `orWhere` 절 체이닝하기 {#chaining-orwhere-clauses-after-relationships}

위의 예제에서 볼 수 있듯이, 관계를 쿼리할 때 추가적인 제약 조건을 자유롭게 추가할 수 있습니다. 하지만 관계에 `orWhere` 절을 체이닝할 때는 주의해야 합니다. `orWhere` 절은 관계 제약 조건과 동일한 논리적 수준에서 그룹화되기 때문입니다:

```php
$user->posts()
    ->where('active', 1)
    ->orWhere('votes', '>=', 100)
    ->get();
```

위의 예제는 다음과 같은 SQL을 생성합니다. 보시다시피, `or` 절로 인해 _100표 이상_ 받은 모든 게시글이 반환됩니다. 쿼리는 더 이상 특정 사용자로 제한되지 않습니다:

```sql
select *
from posts
where user_id = ? and active = 1 or votes >= 100
```

대부분의 상황에서는 [논리 그룹](/docs/{{version}}/queries#logical-grouping)을 사용하여 조건 검사를 괄호로 묶어야 합니다:

```php
use Illuminate\Database\Eloquent\Builder;

$user->posts()
    ->where(function (Builder $query) {
        return $query->where('active', 1)
            ->orWhere('votes', '>=', 100);
    })
    ->get();
```

위의 예제는 다음과 같은 SQL을 생성합니다. 논리 그룹이 올바르게 제약 조건을 묶어주어 쿼리가 특정 사용자로 제한된 것을 확인할 수 있습니다:

```sql
select *
from posts
where user_id = ? and (active = 1 or votes >= 100)
```


### 관계 메서드 vs. 동적 프로퍼티 {#relationship-methods-vs-dynamic-properties}

Eloquent 관계 쿼리에 추가 제약 조건을 추가할 필요가 없다면, 관계를 마치 프로퍼티처럼 접근할 수 있습니다. 예를 들어, `User`와 `Post` 예제 모델을 계속 사용한다면, 한 사용자의 모든 게시물을 다음과 같이 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

foreach ($user->posts as $post) {
    // ...
}
```

동적 관계 프로퍼티는 "지연 로딩(lazy loading)"을 수행합니다. 즉, 실제로 해당 관계 데이터에 접근할 때만 데이터를 로드합니다. 이러한 이유로, 개발자들은 모델을 로드한 후 접근할 것이 확실한 관계를 미리 로드하기 위해 [즉시 로딩(eager loading)](#eager-loading)을 자주 사용합니다. 즉시 로딩은 모델의 관계를 로드할 때 실행해야 하는 SQL 쿼리 수를 크게 줄여줍니다.


### 관계 존재 여부 쿼리하기 {#querying-relationship-existence}

모델 레코드를 조회할 때, 관계의 존재 여부에 따라 결과를 제한하고 싶을 수 있습니다. 예를 들어, 하나 이상의 댓글이 있는 모든 블로그 게시글을 조회하고 싶다고 가정해봅시다. 이를 위해 `has` 및 `orHas` 메서드에 관계의 이름을 전달할 수 있습니다:

```php
use App\Models\Post;

// 하나 이상의 댓글이 있는 모든 게시글을 조회...
$posts = Post::has('comments')->get();
```

연산자와 개수 값을 지정하여 쿼리를 더욱 세밀하게 조정할 수도 있습니다:

```php
// 세 개 이상의 댓글이 있는 모든 게시글을 조회...
$posts = Post::has('comments', '>=', 3)->get();
```

중첩된 `has` 구문은 "점" 표기법을 사용하여 작성할 수 있습니다. 예를 들어, 하나 이상의 이미지를 가진 댓글이 하나 이상 있는 모든 게시글을 조회할 수 있습니다:

```php
// 하나 이상의 이미지를 가진 댓글이 있는 게시글을 조회...
$posts = Post::has('comments.images')->get();
```

더 강력한 기능이 필요하다면, `whereHas` 및 `orWhereHas` 메서드를 사용하여 `has` 쿼리에 추가적인 쿼리 제약 조건을 정의할 수 있습니다. 예를 들어, 댓글의 내용을 검사할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

// code%와 같은 단어가 포함된 댓글이 하나 이상 있는 게시글을 조회...
$posts = Post::whereHas('comments', function (Builder $query) {
    $query->where('content', 'like', 'code%');
})->get();

// code%와 같은 단어가 포함된 댓글이 열 개 이상 있는 게시글을 조회...
$posts = Post::whereHas('comments', function (Builder $query) {
    $query->where('content', 'like', 'code%');
}, '>=', 10)->get();
```

> [!WARNING]
> Eloquent는 현재 데이터베이스를 넘나드는 관계 존재 여부 쿼리를 지원하지 않습니다. 관계는 반드시 동일한 데이터베이스 내에 존재해야 합니다.


#### 다대다 관계 존재 쿼리 {#many-to-many-relationship-existence-queries}

`whereAttachedTo` 메서드는 한 모델 또는 모델 컬렉션에 다대다로 연결된 모델을 쿼리할 때 사용할 수 있습니다:

```php
$users = User::whereAttachedTo($role)->get();
```

또한 `whereAttachedTo` 메서드에 [컬렉션](/docs/{{version}}/eloquent-collections) 인스턴스를 전달할 수도 있습니다. 이 경우, Laravel은 컬렉션 내의 어떤 모델과도 연결된 모델들을 조회합니다:

```php
$tags = Tag::whereLike('name', '%laravel%')->get();

$posts = Post::whereAttachedTo($tags)->get();
```


#### 인라인 관계 존재 쿼리 {#inline-relationship-existence-queries}

관계 쿼리에 단일하고 간단한 where 조건을 추가하여 관계의 존재 여부를 쿼리하고 싶다면, `whereRelation`, `orWhereRelation`, `whereMorphRelation`, `orWhereMorphRelation` 메서드를 사용하는 것이 더 편리할 수 있습니다. 예를 들어, 승인되지 않은 댓글이 있는 모든 게시글을 쿼리할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::whereRelation('comments', 'is_approved', false)->get();
```

물론, 쿼리 빌더의 `where` 메서드와 마찬가지로 연산자를 지정할 수도 있습니다:

```php
$posts = Post::whereRelation(
    'comments', 'created_at', '>=', now()->subHour()
)->get();
```


### 관계 부재 쿼리하기 {#querying-relationship-absence}

모델 레코드를 조회할 때, 관계가 없는 경우에만 결과를 제한하고 싶을 수 있습니다. 예를 들어, **댓글이 없는** 모든 블로그 게시글을 조회하고 싶다고 가정해봅시다. 이를 위해 `doesntHave` 및 `orDoesntHave` 메서드에 관계의 이름을 전달할 수 있습니다:

```php
use App\Models\Post;

$posts = Post::doesntHave('comments')->get();
```

더 강력한 기능이 필요하다면, `whereDoesntHave` 및 `orWhereDoesntHave` 메서드를 사용하여 `doesntHave` 쿼리에 추가적인 쿼리 제약 조건을 추가할 수 있습니다. 예를 들어, 댓글의 내용을 검사할 수도 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::whereDoesntHave('comments', function (Builder $query) {
    $query->where('content', 'like', 'code%');
})->get();
```

"dot" 표기법을 사용하여 중첩된 관계에 대해 쿼리를 실행할 수도 있습니다. 예를 들어, 아래 쿼리는 댓글이 없는 게시글과, 댓글이 있더라도 그 댓글 중 금지된 사용자가 작성한 댓글이 하나도 없는 게시글을 모두 조회합니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::whereDoesntHave('comments.author', function (Builder $query) {
    $query->where('banned', 1);
})->get();
```


### Morph To 관계 쿼리하기 {#querying-morph-to-relationships}

"morph to" 관계의 존재 여부를 쿼리하려면 `whereHasMorph` 및 `whereDoesntHaveMorph` 메서드를 사용할 수 있습니다. 이 메서드들은 첫 번째 인수로 관계의 이름을 받습니다. 다음으로, 쿼리에 포함하고자 하는 관련 모델의 이름을 인수로 전달합니다. 마지막으로, 관계 쿼리를 커스터마이즈할 수 있는 클로저를 전달할 수 있습니다:

```php
use App\Models\Comment;
use App\Models\Post;
use App\Models\Video;
use Illuminate\Database\Eloquent\Builder;

// 제목이 code%로 시작하는 포스트 또는 비디오와 연관된 댓글 조회...
$comments = Comment::whereHasMorph(
    'commentable',
    [Post::class, Video::class],
    function (Builder $query) {
        $query->where('title', 'like', 'code%');
    }
)->get();

// 제목이 code%로 시작하지 않는 포스트와 연관된 댓글 조회...
$comments = Comment::whereDoesntHaveMorph(
    'commentable',
    Post::class,
    function (Builder $query) {
        $query->where('title', 'like', 'code%');
    }
)->get();
```

때때로 관련 다형성 모델의 "type"에 따라 쿼리 제약 조건을 추가해야 할 수도 있습니다. `whereHasMorph` 메서드에 전달된 클로저는 두 번째 인수로 `$type` 값을 받을 수 있습니다. 이 인수를 통해 빌드 중인 쿼리의 "type"을 확인할 수 있습니다:

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

때로는 "morph to" 관계의 부모의 자식들을 쿼리하고 싶을 수 있습니다. 이 경우 `whereMorphedTo` 및 `whereNotMorphedTo` 메서드를 사용하면 주어진 모델에 대해 적절한 morph type 매핑을 자동으로 결정합니다. 이 메서드들은 첫 번째 인수로 `morphTo` 관계의 이름을, 두 번째 인수로 관련 부모 모델을 받습니다:

```php
$comments = Comment::whereMorphedTo('commentable', $post)
    ->orWhereMorphedTo('commentable', $video)
    ->get();
```


#### 모든 관련 모델 쿼리하기 {#querying-all-morph-to-related-models}

가능한 폴리모픽 모델의 배열을 전달하는 대신, `*`를 와일드카드 값으로 제공할 수 있습니다. 이렇게 하면 Laravel은 데이터베이스에서 가능한 모든 폴리모픽 타입을 조회하도록 지시합니다. 이 작업을 수행하기 위해 Laravel은 추가 쿼리를 실행합니다:

```php
use Illuminate\Database\Eloquent\Builder;

$comments = Comment::whereHasMorph('commentable', '*', function (Builder $query) {
    $query->where('title', 'like', 'foo%');
})->get();
```


## 관련 모델 집계하기 {#aggregating-related-models}


### 관련 모델 개수 세기 {#counting-related-models}

때때로 실제로 모델을 로드하지 않고도 주어진 관계에 대한 관련 모델의 개수를 세고 싶을 수 있습니다. 이를 위해 `withCount` 메서드를 사용할 수 있습니다. `withCount` 메서드는 결과 모델에 `{relation}_count` 속성을 추가합니다:

```php
use App\Models\Post;

$posts = Post::withCount('comments')->get();

foreach ($posts as $post) {
    echo $post->comments_count;
}
```

`withCount` 메서드에 배열을 전달하면 여러 관계에 대한 "개수"를 추가할 수 있을 뿐만 아니라 쿼리에 추가 제약 조건도 추가할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

$posts = Post::withCount(['votes', 'comments' => function (Builder $query) {
    $query->where('content', 'like', 'code%');
}])->get();

echo $posts[0]->votes_count;
echo $posts[0]->comments_count;
```

관계 개수 결과에 별칭을 지정할 수도 있어, 동일한 관계에 대해 여러 개수를 구할 수 있습니다:

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


#### 지연 카운트 로딩 {#deferred-count-loading}

`loadCount` 메서드를 사용하면, 부모 모델을 이미 조회한 후에 관계의 개수를 로드할 수 있습니다:

```php
$book = Book::first();

$book->loadCount('genres');
```

카운트 쿼리에 추가적인 쿼리 제약 조건을 설정해야 하는 경우, 카운트하려는 관계를 키로 하는 배열을 전달할 수 있습니다. 배열의 값은 쿼리 빌더 인스턴스를 받는 클로저여야 합니다:

```php
$book->loadCount(['reviews' => function (Builder $query) {
    $query->where('rating', 5);
}])
```


#### 관계 개수 세기 및 커스텀 Select 구문 {#relationship-counting-and-custom-select-statements}

`withCount`를 `select` 구문과 함께 사용할 때는, 반드시 `select` 메서드 이후에 `withCount`를 호출해야 합니다:

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

집계 함수의 결과를 다른 이름으로 접근하고 싶다면, 별칭을 지정할 수 있습니다:

```php
$posts = Post::withSum('comments as total_comments', 'votes')->get();

foreach ($posts as $post) {
    echo $post->total_comments;
}
```

`loadCount` 메서드와 마찬가지로, 이러한 메서드의 지연 버전도 사용할 수 있습니다. 이미 조회된 Eloquent 모델에 대해 추가 집계 연산을 수행할 수 있습니다:

```php
$post = Post::first();

$post->loadSum('comments', 'votes');
```

이 집계 메서드들을 `select` 문과 함께 사용할 경우, 반드시 `select` 메서드 이후에 집계 메서드를 호출해야 합니다:

```php
$posts = Post::select(['title', 'body'])
    ->withExists('comments')
    ->get();
```


### Morph To 관계에서 관련 모델 수 세기 {#counting-related-models-on-morph-to-relationships}

"morph to" 관계를 eager load 하면서, 해당 관계를 통해 반환될 수 있는 다양한 엔티티의 관련 모델 개수도 함께 가져오고 싶다면, `with` 메서드와 morphTo 관계의 `morphWithCount` 메서드를 조합해서 사용할 수 있습니다.

이 예제에서는 `Photo`와 `Post` 모델이 `ActivityFeed` 모델을 생성할 수 있다고 가정해봅시다. 그리고 `ActivityFeed` 모델이 `parentable`이라는 "morph to" 관계를 정의하고 있어, 주어진 `ActivityFeed` 인스턴스에 대해 상위 `Photo` 또는 `Post` 모델을 가져올 수 있다고 가정합니다. 또한, `Photo` 모델은 여러 개의 `Tag` 모델을 "가지고" 있고, `Post` 모델은 여러 개의 `Comment` 모델을 "가지고" 있다고 가정합니다.

이제, `ActivityFeed` 인스턴스를 조회하면서 각 `ActivityFeed` 인스턴스의 상위 `parentable` 모델을 eager load 하고 싶다고 해봅시다. 추가로, 각 상위 photo에 연결된 태그의 개수와 각 상위 post에 연결된 댓글의 개수도 함께 조회하고 싶다면 다음과 같이 할 수 있습니다:

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


#### 지연된 카운트 로딩 {#morph-to-deferred-count-loading}

이미 `ActivityFeed` 모델 집합을 조회했다고 가정해봅시다. 이제 활동 피드와 연관된 다양한 `parentable` 모델에 대해 중첩된 관계의 개수를 로드하고 싶을 때가 있습니다. 이를 위해 `loadMorphCount` 메서드를 사용할 수 있습니다:

```php
$activities = ActivityFeed::with('parentable')->get();

$activities->loadMorphCount('parentable', [
    Photo::class => ['tags'],
    Post::class => ['comments'],
]);
```


## Eager Loading {#eager-loading}

Eloquent 관계를 속성으로 접근할 때, 관련된 모델들은 "지연 로딩(lazy loaded)"됩니다. 즉, 관계 데이터는 해당 속성에 처음 접근할 때 실제로 로드됩니다. 하지만, Eloquent는 부모 모델을 쿼리할 때 관계를 "즉시 로딩(eager load)"할 수 있습니다. 즉시 로딩은 "N + 1" 쿼리 문제를 완화해줍니다. N + 1 쿼리 문제를 설명하기 위해, `Book` 모델이 `Author` 모델에 "belongs to" 관계를 가진다고 가정해봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    /**
     * 이 책을 쓴 저자를 가져옵니다.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }
}
```

이제, 모든 책과 그 저자를 조회해봅시다:

```php
use App\Models\Book;

$books = Book::all();

foreach ($books as $book) {
    echo $book->author->name;
}
```

이 반복문은 데이터베이스 테이블에서 모든 책을 가져오는 쿼리 한 번과, 각 책의 저자를 가져오기 위한 쿼리를 각각 실행합니다. 즉, 책이 25권 있다면 위 코드는 총 26번의 쿼리를 실행하게 됩니다: 원래의 책을 위한 쿼리 1번, 그리고 각 책의 저자를 가져오기 위한 추가 쿼리 25번입니다.

다행히도, 즉시 로딩을 사용하면 이 작업을 단 두 번의 쿼리로 줄일 수 있습니다. 쿼리를 작성할 때 `with` 메서드를 사용하여 어떤 관계를 즉시 로딩할지 지정할 수 있습니다:

```php
$books = Book::with('author')->get();

foreach ($books as $book) {
    echo $book->author->name;
}
```

이 작업에서는 단 두 번의 쿼리만 실행됩니다. 하나는 모든 책을 가져오는 쿼리, 다른 하나는 모든 책의 저자를 한 번에 가져오는 쿼리입니다:

```sql
select * from books

select * from authors where id in (1, 2, 3, 4, 5, ...)
```


#### 여러 관계를 한 번에 Eager Loading 하기 {#eager-loading-multiple-relationships}

때때로 여러 다른 관계를 한 번에 eager load 해야 할 수도 있습니다. 이럴 때는 `with` 메서드에 관계들의 배열을 전달하면 됩니다:

```php
$books = Book::with(['author', 'publisher'])->get();
```


#### 중첩 Eager 로딩 {#nested-eager-loading}

관계의 관계까지 eager 로딩하려면 "dot" 문법을 사용할 수 있습니다. 예를 들어, 모든 책의 저자와 그 저자의 개인 연락처까지 eager 로딩하려면 다음과 같이 할 수 있습니다:

```php
$books = Book::with('author.contacts')->get();
```

또는, 여러 중첩 관계를 eager 로딩할 때 편리하게 `with` 메서드에 중첩 배열을 전달하여 중첩 eager 로딩 관계를 지정할 수도 있습니다:

```php
$books = Book::with([
    'author' => [
        'contacts',
        'publisher',
    ],
])->get();
```


#### 중첩 Eager Loading `morphTo` 관계 {#nested-eager-loading-morphto-relationships}

`morphTo` 관계를 eager load하고, 해당 관계에서 반환될 수 있는 다양한 엔티티의 중첩 관계도 함께 eager load하고 싶다면, `with` 메서드와 `morphTo` 관계의 `morphWith` 메서드를 조합해서 사용할 수 있습니다. 이 방법을 설명하기 위해 다음과 같은 모델을 예로 들어보겠습니다:

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityFeed extends Model
{
    /**
     * 활동 피드 레코드의 상위 엔티티를 가져옵니다.
     */
    public function parentable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

이 예제에서, `Event`, `Photo`, `Post` 모델이 `ActivityFeed` 모델을 생성할 수 있다고 가정해봅시다. 또한, `Event` 모델은 `Calendar` 모델에 속하고, `Photo` 모델은 `Tag` 모델과 연관되어 있으며, `Post` 모델은 `Author` 모델에 속한다고 가정합니다.

이러한 모델 정의와 관계를 바탕으로, 모든 `parentable` 모델과 각각의 중첩 관계를 eager load 하여 `ActivityFeed` 모델 인스턴스를 조회할 수 있습니다:

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


#### 특정 컬럼만 Eager Loading 하기 {#eager-loading-specific-columns}

관계에서 모든 컬럼이 항상 필요한 것은 아닙니다. 이러한 이유로, Eloquent는 관계에서 어떤 컬럼을 가져올지 지정할 수 있도록 해줍니다:

```php
$books = Book::with('author:id,name,book_id')->get();
```

> [!WARNING]
> 이 기능을 사용할 때는 항상 `id` 컬럼과 관련된 외래 키 컬럼을 컬럼 목록에 포함해야 합니다.


#### 기본적으로 Eager Loading 하기 {#eager-loading-by-default}

때때로 모델을 조회할 때 항상 일부 관계를 로드하고 싶을 수 있습니다. 이를 위해 모델에 `$with` 프로퍼티를 정의할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    /**
     * 항상 로드되어야 하는 관계들.
     *
     * @var array
     */
    protected $with = ['author'];

    /**
     * 이 책을 쓴 저자를 가져옵니다.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    /**
     * 이 책의 장르를 가져옵니다.
     */
    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }
}
```

단일 쿼리에서 `$with` 프로퍼티의 항목을 제거하고 싶다면, `without` 메서드를 사용할 수 있습니다:

```php
$books = Book::without('author')->get();
```

단일 쿼리에서 `$with` 프로퍼티의 모든 항목을 덮어쓰고 싶다면, `withOnly` 메서드를 사용할 수 있습니다:

```php
$books = Book::withOnly('genre')->get();
```


### Eager Load 제약 조건 지정 {#constraining-eager-loads}

때때로 관계를 eager load 하면서 eager loading 쿼리에 추가적인 조건을 지정하고 싶을 수 있습니다. 이럴 때는 `with` 메서드에 관계명을 키로, 추가 제약 조건을 지정하는 클로저를 값으로 하는 배열을 전달하면 됩니다:

```php
use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;

$users = User::with(['posts' => function (Builder $query) {
    $query->where('title', 'like', '%code%');
}])->get();
```

이 예제에서 Eloquent는 게시글의 `title` 컬럼에 `code`라는 단어가 포함된 게시글만 eager load 합니다. [쿼리 빌더](/docs/{{version}}/queries) 메서드를 호출하여 eager loading 동작을 더 세밀하게 커스터마이즈할 수도 있습니다:

```php
$users = User::with(['posts' => function (Builder $query) {
    $query->orderBy('created_at', 'desc');
}])->get();
```


#### `morphTo` 관계의 Eager Loading 제약 {#constraining-eager-loading-of-morph-to-relationships}

`morphTo` 관계를 eager loading할 때, Eloquent는 각 관련 모델 타입마다 여러 쿼리를 실행합니다. 이 쿼리들 각각에 대해 `MorphTo` 관계의 `constrain` 메서드를 사용하여 추가 제약 조건을 지정할 수 있습니다:

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

이 예시에서 Eloquent는 숨겨지지 않은 게시글과 `type` 값이 "educational"인 비디오만 eager load합니다.


#### 관계 존재로 Eager Load 제한하기 {#constraining-eager-loads-with-relationship-existence}

관계의 존재를 확인하면서 동시에 동일한 조건으로 해당 관계를 로드해야 할 때가 있습니다. 예를 들어, 특정 쿼리 조건과 일치하는 자식 `Post` 모델이 있는 `User` 모델만 조회하고, 일치하는 게시글도 eager load 하고 싶을 수 있습니다. 이럴 때는 `withWhereHas` 메서드를 사용할 수 있습니다:

```php
use App\Models\User;

$users = User::withWhereHas('posts', function ($query) {
    $query->where('featured', true);
})->get();
```


### Lazy Eager Loading {#lazy-eager-loading}

때때로 부모 모델을 이미 조회한 후에 관계를 eager load 해야 할 필요가 있을 수 있습니다. 예를 들어, 관련 모델을 동적으로 로드할지 결정해야 할 때 유용할 수 있습니다:

```php
use App\Models\Book;

$books = Book::all();

if ($someCondition) {
    $books->load('author', 'publisher');
}
```

eager loading 쿼리에 추가적인 쿼리 제약 조건을 설정해야 한다면, 로드하려는 관계를 키로 하는 배열을 전달할 수 있습니다. 배열의 값은 쿼리 인스턴스를 받는 클로저 인스턴스여야 합니다:

```php
$author->load(['books' => function (Builder $query) {
    $query->orderBy('published_date', 'asc');
}]);
```

관계가 아직 로드되지 않은 경우에만 로드하려면 `loadMissing` 메서드를 사용하세요:

```php
$book->loadMissing('author');
```


#### 중첩 지연 로딩과 `morphTo` {#nested-lazy-eager-loading-morphto}

`morphTo` 관계를 즉시 로드하고, 해당 관계에서 반환될 수 있는 다양한 엔티티의 중첩 관계도 함께 로드하고 싶다면, `loadMorph` 메서드를 사용할 수 있습니다.

이 메서드는 첫 번째 인자로 `morphTo` 관계의 이름을, 두 번째 인자로는 모델/관계 쌍의 배열을 받습니다. 이 메서드를 설명하기 위해 다음과 같은 모델을 예로 들어보겠습니다.

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityFeed extends Model
{
    /**
     * 활동 피드 레코드의 상위 엔티티를 가져옵니다.
     */
    public function parentable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

이 예시에서, `Event`, `Photo`, `Post` 모델이 `ActivityFeed` 모델을 생성할 수 있다고 가정해봅시다. 또한, `Event` 모델은 `Calendar` 모델에 속하고, `Photo` 모델은 `Tag` 모델과 연관되어 있으며, `Post` 모델은 `Author` 모델에 속한다고 가정합니다.

이러한 모델 정의와 관계를 바탕으로, `ActivityFeed` 모델 인스턴스를 조회하고 모든 `parentable` 모델과 각각의 중첩 관계를 즉시 로드할 수 있습니다.

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

많은 경우에 Laravel은 여러분이 접근하는 관계를 자동으로 즉시 로딩할 수 있습니다. 자동 즉시 로딩을 활성화하려면, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 `Model::automaticallyEagerLoadRelationships` 메서드를 호출해야 합니다.

```php
use Illuminate\Database\Eloquent\Model;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Model::automaticallyEagerLoadRelationships();
}
```

이 기능이 활성화되면, Laravel은 이전에 로드되지 않은 관계에 접근할 때 자동으로 해당 관계를 로드하려고 시도합니다. 예를 들어, 다음과 같은 상황을 생각해보세요.

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

일반적으로 위의 코드는 각 사용자의 게시글을 가져오기 위해 쿼리를 실행하고, 각 게시글의 댓글을 가져오기 위해 또 다른 쿼리를 실행합니다. 하지만 `automaticallyEagerLoadRelationships` 기능이 활성화되어 있다면, 컬렉션 내의 어떤 사용자에서 게시글에 접근할 때 Laravel은 모든 사용자의 게시글을 자동으로 [지연 즉시 로딩](#lazy-eager-loading)합니다. 마찬가지로, 어떤 게시글의 댓글에 접근할 때도 처음에 조회된 모든 게시글의 댓글이 지연 즉시 로딩됩니다.

자동 즉시 로딩을 전역적으로 활성화하고 싶지 않다면, 컬렉션 인스턴스에서 `withRelationshipAutoloading` 메서드를 호출하여 단일 Eloquent 컬렉션에만 이 기능을 활성화할 수 있습니다.

```php
$users = User::where('vip', true)->get();

return $users->withRelationshipAutoloading();
```


### 지연 로딩 방지 {#preventing-lazy-loading}

앞서 논의한 바와 같이, 관계를 eager loading(즉시 로딩)하면 애플리케이션의 성능이 크게 향상될 수 있습니다. 따라서 원한다면 Laravel이 항상 관계의 지연 로딩을 방지하도록 설정할 수 있습니다. 이를 위해서는 기본 Eloquent 모델 클래스에서 제공하는 `preventLazyLoading` 메서드를 호출하면 됩니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 호출해야 합니다.

`preventLazyLoading` 메서드는 지연 로딩을 방지할지 여부를 나타내는 선택적 불리언 인자를 받습니다. 예를 들어, 프로덕션 환경이 아닌 경우에만 지연 로딩을 비활성화하여, 프로덕션 코드에 실수로 지연 로딩 관계가 있더라도 프로덕션 환경에서는 정상적으로 동작하도록 할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
}
```

지연 로딩을 방지하면, 애플리케이션이 Eloquent 관계를 지연 로딩하려고 시도할 때 Eloquent는 `Illuminate\Database\LazyLoadingViolationException` 예외를 발생시킵니다.

`handleLazyLoadingViolationsUsing` 메서드를 사용하여 지연 로딩 위반 시의 동작을 커스터마이즈할 수 있습니다. 예를 들어, 이 메서드를 사용하면 예외로 인해 애플리케이션 실행이 중단되는 대신, 지연 로딩 위반이 로그에만 기록되도록 할 수 있습니다:

```php
Model::handleLazyLoadingViolationUsing(function (Model $model, string $relation) {
    $class = $model::class;

    info("Attempted to lazy load [{$relation}] on model [{$class}].");
});
```


## 관련 모델 삽입 및 업데이트 {#inserting-and-updating-related-models}


### `save` 메서드 {#the-save-method}

Eloquent는 관계에 새로운 모델을 추가하기 위한 편리한 메서드를 제공합니다. 예를 들어, 게시글에 새로운 댓글을 추가해야 할 수도 있습니다. `Comment` 모델의 `post_id` 속성을 수동으로 설정하는 대신, 관계의 `save` 메서드를 사용하여 댓글을 삽입할 수 있습니다:

```php
use App\Models\Comment;
use App\Models\Post;

$comment = new Comment(['message' => 'A new comment.']);

$post = Post::find(1);

$post->comments()->save($comment);
```

여기서 `comments` 관계를 동적 속성으로 접근하지 않고, `comments` 메서드를 호출하여 관계 인스턴스를 얻는 점에 주의하세요. `save` 메서드는 새로운 `Comment` 모델에 적절한 `post_id` 값을 자동으로 추가합니다.

여러 개의 관련 모델을 저장해야 한다면, `saveMany` 메서드를 사용할 수 있습니다:

```php
$post = Post::find(1);

$post->comments()->saveMany([
    new Comment(['message' => 'A new comment.']),
    new Comment(['message' => 'Another new comment.']),
]);
```

`save` 및 `saveMany` 메서드는 전달된 모델 인스턴스를 영속화하지만, 이미 부모 모델에 로드된 메모리 내 관계에 새로 저장된 모델을 추가하지는 않습니다. `save` 또는 `saveMany` 메서드 사용 후 관계에 접근할 계획이라면, `refresh` 메서드를 사용하여 모델과 그 관계를 다시 로드하는 것이 좋습니다:

```php
$post->comments()->save($comment);

$post->refresh();

// 새로 저장된 댓글을 포함한 모든 댓글...
$post->comments;
```


#### 모델과 관계를 재귀적으로 저장하기 {#the-push-method}

모델과 그에 연관된 모든 관계를 `save`하고 싶다면, `push` 메서드를 사용할 수 있습니다. 이 예제에서는 `Post` 모델뿐만 아니라, 그에 연결된 댓글과 댓글의 작성자까지 모두 저장됩니다:

```php
$post = Post::find(1);

$post->comments[0]->message = 'Message';
$post->comments[0]->author->name = 'Author Name';

$post->push();
```

`pushQuietly` 메서드는 이벤트를 발생시키지 않고 모델과 그에 연관된 관계를 저장할 때 사용할 수 있습니다:

```php
$post->pushQuietly();
```


### `create` 메서드 {#the-create-method}

`save` 및 `saveMany` 메서드 외에도, 속성 배열을 받아 모델을 생성하고 데이터베이스에 삽입하는 `create` 메서드를 사용할 수 있습니다. `save`와 `create`의 차이점은 `save`는 전체 Eloquent 모델 인스턴스를 받는 반면, `create`는 일반 PHP `array`를 받는다는 점입니다. 새로 생성된 모델은 `create` 메서드에 의해 반환됩니다:

```php
use App\Models\Post;

$post = Post::find(1);

$comment = $post->comments()->create([
    'message' => 'A new comment.',
]);
```

`createMany` 메서드를 사용하여 여러 관련 모델을 한 번에 생성할 수도 있습니다:

```php
$post = Post::find(1);

$post->comments()->createMany([
    ['message' => 'A new comment.'],
    ['message' => 'Another new comment.'],
]);
```

`createQuietly` 및 `createManyQuietly` 메서드는 이벤트를 발생시키지 않고 모델을 생성할 때 사용할 수 있습니다:

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

또한 `findOrNew`, `firstOrNew`, `firstOrCreate`, `updateOrCreate` 메서드를 사용하여 [관계에서 모델을 생성 및 업데이트](/docs/{{version}}/eloquent#upserts)할 수 있습니다.

> [!NOTE]
> `create` 메서드를 사용하기 전에 [대량 할당](/docs/{{version}}/eloquent#mass-assignment) 문서를 반드시 확인하세요.


### Belongs To 관계 {#updating-belongs-to-relationships}

자식 모델을 새로운 부모 모델에 할당하고 싶다면, `associate` 메서드를 사용할 수 있습니다. 이 예제에서 `User` 모델은 `Account` 모델에 대한 `belongsTo` 관계를 정의합니다. 이 `associate` 메서드는 자식 모델의 외래 키를 설정합니다:

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


#### 연결 / 분리 {#attaching-detaching}

Eloquent는 다대다(many-to-many) 관계를 더 편리하게 다룰 수 있도록 여러 메서드를 제공합니다. 예를 들어, 한 사용자가 여러 역할을 가질 수 있고, 한 역할도 여러 사용자를 가질 수 있다고 가정해봅시다. `attach` 메서드를 사용하면 관계의 중간 테이블에 레코드를 삽입하여 역할을 사용자에게 연결할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->roles()->attach($roleId);
```

관계를 모델에 연결할 때, 중간 테이블에 추가로 삽입할 데이터를 배열로 전달할 수도 있습니다:

```php
$user->roles()->attach($roleId, ['expires' => $expires]);
```

때때로 사용자의 역할을 제거해야 할 수도 있습니다. 다대다 관계 레코드를 제거하려면 `detach` 메서드를 사용하세요. `detach` 메서드는 중간 테이블에서 해당 레코드를 삭제하지만, 두 모델 모두 데이터베이스에는 남아 있습니다:

```php
// 사용자로부터 단일 역할을 분리...
$user->roles()->detach($roleId);

// 사용자로부터 모든 역할을 분리...
$user->roles()->detach();
```

편의를 위해, `attach`와 `detach`는 ID 배열도 입력값으로 받을 수 있습니다:

```php
$user = User::find(1);

$user->roles()->detach([1, 2, 3]);

$user->roles()->attach([
    1 => ['expires' => $expires],
    2 => ['expires' => $expires],
]);
```


#### 연관 관계 동기화 {#syncing-associations}

`sync` 메서드를 사용하여 다대다 연관 관계를 생성할 수도 있습니다. `sync` 메서드는 중간 테이블에 저장할 ID 배열을 인수로 받습니다. 주어진 배열에 없는 ID는 중간 테이블에서 제거됩니다. 따라서 이 작업이 완료된 후에는 주어진 배열에 있는 ID만 중간 테이블에 존재하게 됩니다:

```php
$user->roles()->sync([1, 2, 3]);
```

ID와 함께 추가적인 중간 테이블 값을 전달할 수도 있습니다:

```php
$user->roles()->sync([1 => ['expires' => true], 2, 3]);
```

동기화할 각 모델 ID에 동일한 중간 테이블 값을 삽입하고 싶다면, `syncWithPivotValues` 메서드를 사용할 수 있습니다:

```php
$user->roles()->syncWithPivotValues([1, 2, 3], ['active' => true]);
```

주어진 배열에 없는 기존 ID를 분리(detach)하고 싶지 않다면, `syncWithoutDetaching` 메서드를 사용할 수 있습니다:

```php
$user->roles()->syncWithoutDetaching([1, 2, 3]);
```


#### 연관 관계 토글링 {#toggling-associations}

다대다(many-to-many) 관계에서는 주어진 관련 모델 ID의 연결 상태를 "토글"하는 `toggle` 메서드도 제공합니다. 만약 주어진 ID가 현재 연결되어 있다면, 연결이 해제됩니다. 반대로, 현재 연결이 해제되어 있다면 연결됩니다:

```php
$user->roles()->toggle([1, 2, 3]);
```

ID와 함께 추가적인 중간 테이블 값을 전달할 수도 있습니다:

```php
$user->roles()->toggle([
    1 => ['expires' => true],
    2 => ['expires' => true],
]);
```


#### 중간 테이블의 레코드 업데이트하기 {#updating-a-record-on-the-intermediate-table}

관계의 중간 테이블에 있는 기존 행을 업데이트해야 하는 경우, `updateExistingPivot` 메서드를 사용할 수 있습니다. 이 메서드는 중간 레코드의 외래 키와 업데이트할 속성 배열을 인수로 받습니다:

```php
$user = User::find(1);

$user->roles()->updateExistingPivot($roleId, [
    'active' => false,
]);
```


## 상위 타임스탬프 갱신하기 {#touching-parent-timestamps}

모델이 다른 모델에 대해 `belongsTo` 또는 `belongsToMany` 관계를 정의할 때, 예를 들어 `Comment`가 `Post`에 속하는 경우, 자식 모델이 업데이트될 때 상위 모델의 타임스탬프를 갱신하는 것이 유용할 때가 있습니다.

예를 들어, `Comment` 모델이 업데이트될 때 소유하고 있는 `Post`의 `updated_at` 타임스탬프를 자동으로 "터치"하여 현재 날짜와 시간으로 설정하고 싶을 수 있습니다. 이를 위해 자식 모델에 `touches` 속성을 추가하고, 자식 모델이 업데이트될 때 `updated_at` 타임스탬프가 갱신되어야 하는 관계의 이름을 배열로 지정할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    /**
     * 터치되어야 하는 모든 관계들.
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
> 상위 모델의 타임스탬프는 자식 모델이 Eloquent의 `save` 메서드를 사용하여 업데이트될 때만 갱신됩니다.
