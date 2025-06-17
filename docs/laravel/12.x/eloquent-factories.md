# Eloquent: 팩토리



















## 소개 {#introduction}

애플리케이션을 테스트하거나 데이터베이스에 시딩할 때, 데이터베이스에 몇 개의 레코드를 삽입해야 할 수도 있습니다. 각 컬럼의 값을 수동으로 지정하는 대신, Laravel은 [Eloquent 모델](/laravel/12.x/eloquent)마다 모델 팩토리를 사용하여 기본 속성 집합을 정의할 수 있도록 해줍니다.

팩토리를 작성하는 예제를 보려면, 애플리케이션의 `database/factories/UserFactory.php` 파일을 확인해 보세요. 이 팩토리는 모든 새로운 Laravel 애플리케이션에 포함되어 있으며, 다음과 같은 팩토리 정의를 담고 있습니다:

```php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * 팩토리에서 사용 중인 현재 비밀번호입니다.
     */
    protected static ?string $password;

    /**
     * 모델의 기본 상태를 정의합니다.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * 모델의 이메일 주소가 인증되지 않았음을 나타냅니다.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
```

보시다시피, 가장 기본적인 형태에서 팩토리는 Laravel의 기본 팩토리 클래스를 확장하고 `definition` 메서드를 정의하는 클래스입니다. `definition` 메서드는 팩토리를 사용해 모델을 생성할 때 적용되어야 하는 기본 속성 값 집합을 반환합니다.

팩토리에서는 `fake` 헬퍼를 통해 [Faker](https://github.com/FakerPHP/Faker) PHP 라이브러리에 접근할 수 있으며, 이를 통해 테스트 및 시딩에 사용할 다양한 종류의 랜덤 데이터를 편리하게 생성할 수 있습니다.

> [!NOTE]
> 애플리케이션의 Faker 로케일은 `config/app.php` 설정 파일의 `faker_locale` 옵션을 수정하여 변경할 수 있습니다.


## 모델 팩토리 정의하기 {#defining-model-factories}


### 팩토리 생성하기 {#generating-factories}

팩토리를 생성하려면 `make:factory` [Artisan 명령어](/laravel/12.x/artisan)를 실행하세요:

```shell
php artisan make:factory PostFactory
```

새로 생성된 팩토리 클래스는 `database/factories` 디렉터리에 위치하게 됩니다.


#### 모델 및 팩토리 자동 검색 규칙 {#factory-and-model-discovery-conventions}

팩토리를 정의한 후에는, `Illuminate\Database\Eloquent\Factories\HasFactory` 트레이트가 모델에 제공하는 정적 `factory` 메서드를 사용하여 해당 모델의 팩토리 인스턴스를 생성할 수 있습니다.

`HasFactory` 트레이트의 `factory` 메서드는 규칙을 사용하여 트레이트가 할당된 모델에 적합한 팩토리를 결정합니다. 구체적으로, 이 메서드는 `Database\Factories` 네임스페이스에서 모델 이름과 일치하고 `Factory`로 끝나는 클래스명을 가진 팩토리를 찾습니다. 이러한 규칙이 애플리케이션이나 팩토리에 적용되지 않는 경우, 모델에서 `newFactory` 메서드를 오버라이드하여 해당 모델에 맞는 팩토리 인스턴스를 직접 반환할 수 있습니다:

```php
use Database\Factories\Administration\FlightFactory;

/**
 * 모델을 위한 새로운 팩토리 인스턴스를 생성합니다.
 */
protected static function newFactory()
{
    return FlightFactory::new();
}
```

그런 다음, 해당 팩토리에서 `model` 프로퍼티를 정의합니다:

```php
use App\Administration\Flight;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlightFactory extends Factory
{
    /**
     * 팩토리가 대응하는 모델의 이름입니다.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Flight::class;
}
```


### 팩토리 상태 {#factory-states}

상태 조작 메서드를 사용하면 모델 팩토리에 대해 개별적으로 적용할 수 있는 수정 사항을 정의할 수 있습니다. 예를 들어, `Database\Factories\UserFactory` 팩토리에는 기본 속성 값 중 하나를 수정하는 `suspended` 상태 메서드가 포함될 수 있습니다.

상태 변환 메서드는 일반적으로 Laravel의 기본 팩토리 클래스에서 제공하는 `state` 메서드를 호출합니다. `state` 메서드는 팩토리에 정의된 원시 속성 배열을 전달받는 클로저를 인수로 받아, 수정할 속성 배열을 반환해야 합니다:

```php
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 사용자가 정지되었음을 나타냅니다.
 */
public function suspended(): Factory
{
    return $this->state(function (array $attributes) {
        return [
            'account_status' => 'suspended',
        ];
    });
}
```


#### "Trashed" 상태 {#trashed-state}

만약 여러분의 Eloquent 모델이 [소프트 삭제](/laravel/12.x/eloquent#soft-deleting)를 지원한다면, 내장된 `trashed` 상태 메서드를 호출하여 생성된 모델이 이미 "소프트 삭제"된 상태임을 나타낼 수 있습니다. `trashed` 상태는 모든 팩토리에서 자동으로 제공되므로, 직접 정의할 필요가 없습니다:

```php
use App\Models\User;

$user = User::factory()->trashed()->create();
```


### 팩토리 콜백 {#factory-callbacks}

팩토리 콜백은 `afterMaking` 및 `afterCreating` 메서드를 사용하여 등록하며, 모델을 생성하거나 만든 후에 추가 작업을 수행할 수 있도록 해줍니다. 이러한 콜백은 팩토리 클래스에 `configure` 메서드를 정의하여 등록해야 합니다. 이 메서드는 팩토리가 인스턴스화될 때 Laravel에 의해 자동으로 호출됩니다:

```php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * 모델 팩토리 구성.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (User $user) {
            // ...
        })->afterCreating(function (User $user) {
            // ...
        });
    }

    // ...
}
```

또한, 상태 메서드 내에서 팩토리 콜백을 등록하여 특정 상태에만 해당하는 추가 작업을 수행할 수도 있습니다:

```php
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 사용자가 정지 상태임을 나타냅니다.
 */
public function suspended(): Factory
{
    return $this->state(function (array $attributes) {
        return [
            'account_status' => 'suspended',
        ];
    })->afterMaking(function (User $user) {
        // ...
    })->afterCreating(function (User $user) {
        // ...
    });
}
```


## 팩토리를 사용한 모델 생성 {#creating-models-using-factories}


### 모델 인스턴스화 {#instantiating-models}

팩토리를 정의한 후에는, `Illuminate\Database\Eloquent\Factories\HasFactory` 트레이트가 모델에 제공하는 정적 `factory` 메서드를 사용하여 해당 모델의 팩토리 인스턴스를 생성할 수 있습니다. 모델을 생성하는 몇 가지 예제를 살펴보겠습니다. 먼저, `make` 메서드를 사용하여 데이터베이스에 저장하지 않고 모델을 생성해보겠습니다:

```php
use App\Models\User;

$user = User::factory()->make();
```

`count` 메서드를 사용하여 여러 개의 모델 컬렉션을 생성할 수도 있습니다:

```php
$users = User::factory()->count(3)->make();
```


#### 상태 적용하기 {#applying-states}

[상태](#factory-states) 중 어떤 것이든 모델에 적용할 수 있습니다. 여러 상태 변환을 모델에 적용하고 싶다면, 상태 변환 메서드를 직접 호출하면 됩니다:

```php
$users = User::factory()->count(5)->suspended()->make();
```


#### 속성 재정의 {#overriding-attributes}

모델의 기본값 중 일부를 재정의하고 싶다면, `make` 메서드에 값의 배열을 전달할 수 있습니다. 지정한 속성만 교체되며, 나머지 속성은 팩토리에서 지정한 기본값으로 설정된 상태로 유지됩니다:

```php
$user = User::factory()->make([
    'name' => 'Abigail Otwell',
]);
```

또는, 팩토리 인스턴스에서 `state` 메서드를 직접 호출하여 인라인 상태 변환을 수행할 수도 있습니다:

```php
$user = User::factory()->state([
    'name' => 'Abigail Otwell',
])->make();
```

> [!NOTE]
> 팩토리를 사용해 모델을 생성할 때는 [대량 할당 보호](/laravel/12.x/eloquent#mass-assignment)가 자동으로 비활성화됩니다.


### 모델 영속화 {#persisting-models}

`create` 메서드는 모델 인스턴스를 생성하고 Eloquent의 `save` 메서드를 사용하여 데이터베이스에 저장합니다:

```php
use App\Models\User;

// 단일 App\Models\User 인스턴스 생성...
$user = User::factory()->create();

// 세 개의 App\Models\User 인스턴스 생성...
$users = User::factory()->count(3)->create();
```

`create` 메서드에 속성 배열을 전달하여 팩토리의 기본 모델 속성을 오버라이드할 수 있습니다:

```php
$user = User::factory()->create([
    'name' => 'Abigail',
]);
```


### 시퀀스 {#sequences}

때때로 각 모델이 생성될 때마다 특정 모델 속성의 값을 번갈아가며 지정하고 싶을 수 있습니다. 이럴 때는 상태 변환을 시퀀스로 정의하여 해결할 수 있습니다. 예를 들어, 각 생성된 사용자에 대해 `admin` 컬럼의 값을 `Y`와 `N`으로 번갈아가며 지정하고 싶을 때 다음과 같이 할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;

$users = User::factory()
    ->count(10)
    ->state(new Sequence(
        ['admin' => 'Y'],
        ['admin' => 'N'],
    ))
    ->create();
```

이 예제에서는 `admin` 값이 `Y`인 사용자 5명과 `N`인 사용자 5명이 생성됩니다.

필요하다면, 시퀀스 값으로 클로저를 포함할 수도 있습니다. 시퀀스가 새로운 값이 필요할 때마다 해당 클로저가 호출됩니다:

```php
use Illuminate\Database\Eloquent\Factories\Sequence;

$users = User::factory()
    ->count(10)
    ->state(new Sequence(
        fn (Sequence $sequence) => ['role' => UserRoles::all()->random()],
    ))
    ->create();
```

시퀀스 클로저 내부에서는 클로저에 주입된 시퀀스 인스턴스의 `$index` 또는 `$count` 속성에 접근할 수 있습니다. `$index` 속성은 지금까지 시퀀스를 반복한 횟수를, `$count` 속성은 시퀀스가 호출될 총 횟수를 나타냅니다:

```php
$users = User::factory()
    ->count(10)
    ->sequence(fn (Sequence $sequence) => ['name' => 'Name '.$sequence->index])
    ->create();
```

편의를 위해, 시퀀스는 `sequence` 메서드를 사용하여 적용할 수도 있습니다. 이 메서드는 내부적으로 단순히 `state` 메서드를 호출합니다. `sequence` 메서드는 클로저 또는 시퀀스 속성 배열을 인수로 받을 수 있습니다:

```php
$users = User::factory()
    ->count(2)
    ->sequence(
        ['name' => 'First User'],
        ['name' => 'Second User'],
    )
    ->create();
```


## 팩토리 관계 {#factory-relationships}


### Has Many Relationships {#has-many-relationships}

다음으로, Laravel의 유연한 팩토리 메서드를 사용하여 Eloquent 모델 관계를 구축하는 방법을 살펴보겠습니다. 먼저, 애플리케이션에 `App\Models\User` 모델과 `App\Models\Post` 모델이 있다고 가정해봅시다. 또한, `User` 모델이 `Post`와 `hasMany` 관계를 정의하고 있다고 가정합니다. Laravel의 팩토리에서 제공하는 `has` 메서드를 사용하여 세 개의 게시글을 가진 사용자를 생성할 수 있습니다. `has` 메서드는 팩토리 인스턴스를 인수로 받습니다:

```php
use App\Models\Post;
use App\Models\User;

$user = User::factory()
    ->has(Post::factory()->count(3))
    ->create();
```

관례상, `has` 메서드에 `Post` 모델을 전달하면, Laravel은 `User` 모델에 관계를 정의하는 `posts` 메서드가 있어야 한다고 가정합니다. 필요하다면, 조작하고자 하는 관계의 이름을 명시적으로 지정할 수도 있습니다:

```php
$user = User::factory()
    ->has(Post::factory()->count(3), 'posts')
    ->create();
```

물론, 관련 모델에 대해 상태 조작을 수행할 수도 있습니다. 또한, 상태 변경 시 상위(부모) 모델에 접근해야 한다면 클로저 기반의 상태 변환을 전달할 수도 있습니다:

```php
$user = User::factory()
    ->has(
        Post::factory()
            ->count(3)
            ->state(function (array $attributes, User $user) {
                return ['user_type' => $user->type];
            })
        )
    ->create();
```


#### 매직 메서드 사용하기 {#has-many-relationships-using-magic-methods}

편의를 위해, 라라벨의 매직 팩토리 관계 메서드를 사용하여 관계를 생성할 수 있습니다. 예를 들어, 아래 예제는 관례에 따라 관련 모델이 `User` 모델의 `posts` 관계 메서드를 통해 생성되어야 함을 결정합니다:

```php
$user = User::factory()
    ->hasPosts(3)
    ->create();
```

매직 메서드를 사용하여 팩토리 관계를 생성할 때, 관련 모델에서 오버라이드할 속성의 배열을 전달할 수 있습니다:

```php
$user = User::factory()
    ->hasPosts(3, [
        'published' => false,
    ])
    ->create();
```

상태 변경에 부모 모델에 대한 접근이 필요한 경우, 클로저 기반의 상태 변환을 제공할 수 있습니다:

```php
$user = User::factory()
    ->hasPosts(3, function (array $attributes, User $user) {
        return ['user_type' => $user->type];
    })
    ->create();
```


### Belongs To Relationships {#belongs-to-relationships}

이제 팩토리를 사용하여 "has many" 관계를 구축하는 방법을 살펴보았으니, 관계의 반대편을 살펴보겠습니다. `for` 메서드는 팩토리가 생성한 모델이 소속될 부모 모델을 정의하는 데 사용할 수 있습니다. 예를 들어, 하나의 사용자에 속하는 세 개의 `App\Models\Post` 모델 인스턴스를 생성할 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;

$posts = Post::factory()
    ->count(3)
    ->for(User::factory()->state([
        'name' => 'Jessica Archer',
    ]))
    ->create();
```

이미 생성된 부모 모델 인스턴스가 있고, 생성할 모델들과 연관시키고 싶다면 해당 모델 인스턴스를 `for` 메서드에 전달할 수 있습니다:

```php
$user = User::factory()->create();

$posts = Post::factory()
    ->count(3)
    ->for($user)
    ->create();
```


#### 매직 메서드 사용하기 {#belongs-to-relationships-using-magic-methods}

편의를 위해, Laravel의 매직 팩토리 관계 메서드를 사용하여 "belongs to" 관계를 정의할 수 있습니다. 예를 들어, 아래 예제는 관례에 따라 세 개의 게시물이 `Post` 모델의 `user` 관계에 속해야 함을 결정합니다:

```php
$posts = Post::factory()
    ->count(3)
    ->forUser([
        'name' => 'Jessica Archer',
    ])
    ->create();
```


### 다대다 관계 {#many-to-many-relationships}

[has many 관계](#has-many-relationships)와 마찬가지로, "다대다" 관계도 `has` 메서드를 사용하여 생성할 수 있습니다:

```php
use App\Models\Role;
use App\Models\User;

$user = User::factory()
    ->has(Role::factory()->count(3))
    ->create();
```


#### 피벗 테이블 속성 {#pivot-table-attributes}

모델을 연결하는 피벗/중간 테이블에 설정해야 하는 속성을 정의해야 하는 경우, `hasAttached` 메서드를 사용할 수 있습니다. 이 메서드는 두 번째 인수로 피벗 테이블 속성 이름과 값의 배열을 받습니다:

```php
use App\Models\Role;
use App\Models\User;

$user = User::factory()
    ->hasAttached(
        Role::factory()->count(3),
        ['active' => true]
    )
    ->create();
```

상태 변경에 관련 모델에 대한 접근이 필요한 경우, 클로저 기반의 상태 변환을 제공할 수 있습니다:

```php
$user = User::factory()
    ->hasAttached(
        Role::factory()
            ->count(3)
            ->state(function (array $attributes, User $user) {
                return ['name' => $user->name.' Role'];
            }),
        ['active' => true]
    )
    ->create();
```

이미 생성된 모델 인스턴스를 생성 중인 모델에 연결하고 싶다면, 해당 모델 인스턴스를 `hasAttached` 메서드에 전달할 수 있습니다. 이 예제에서는 동일한 세 개의 역할이 세 명의 사용자 모두에 연결됩니다:

```php
$roles = Role::factory()->count(3)->create();

$user = User::factory()
    ->count(3)
    ->hasAttached($roles, ['active' => true])
    ->create();
```


#### 매직 메서드 사용하기 {#many-to-many-relationships-using-magic-methods}

편의를 위해, 라라벨의 매직 팩토리 관계 메서드를 사용하여 다대다 관계를 정의할 수 있습니다. 예를 들어, 아래 예제는 컨벤션을 사용하여 관련 모델이 `User` 모델의 `roles` 관계 메서드를 통해 생성되어야 함을 결정합니다:

```php
$user = User::factory()
    ->hasRoles(1, [
        'name' => 'Editor'
    ])
    ->create();
```


### 다형성 관계 {#polymorphic-relationships}

[다형성 관계](/laravel/12.x/eloquent-relationships#polymorphic-relationships)도 팩토리를 사용하여 생성할 수 있습니다. 다형성 "morph many" 관계는 일반적인 "has many" 관계와 동일한 방식으로 생성됩니다. 예를 들어, `App\Models\Post` 모델이 `App\Models\Comment` 모델과 `morphMany` 관계를 가지고 있다면:

```php
use App\Models\Post;

$post = Post::factory()->hasComments(3)->create();
```


#### Morph To Relationships {#morph-to-relationships}

매직 메서드는 `morphTo` 관계를 생성하는 데 사용할 수 없습니다. 대신, `for` 메서드를 직접 사용해야 하며 관계의 이름을 명시적으로 지정해야 합니다. 예를 들어, `Comment` 모델에 `morphTo` 관계를 정의하는 `commentable` 메서드가 있다고 가정해봅시다. 이 경우, 아래와 같이 `for` 메서드를 직접 사용하여 하나의 게시물에 속하는 세 개의 댓글을 생성할 수 있습니다:

```php
$comments = Comment::factory()->count(3)->for(
    Post::factory(), 'commentable'
)->create();
```


#### 다형성 다대다 관계 {#polymorphic-many-to-many-relationships}

다형성 "다대다"(`morphToMany` / `morphedByMany`) 관계는 비다형성 "다대다" 관계와 마찬가지로 생성할 수 있습니다:

```php
use App\Models\Tag;
use App\Models\Video;

$videos = Video::factory()
    ->hasAttached(
        Tag::factory()->count(3),
        ['public' => true]
    )
    ->create();
```

물론, 매직 `has` 메서드도 다형성 "다대다" 관계를 생성하는 데 사용할 수 있습니다:

```php
$videos = Video::factory()
    ->hasTags(3, ['public' => true])
    ->create();
```


### 팩토리 내에서 관계 정의하기 {#defining-relationships-within-factories}

모델 팩토리 내에서 관계를 정의하려면, 일반적으로 관계의 외래 키에 새로운 팩토리 인스턴스를 할당합니다. 이는 주로 `belongsTo` 및 `morphTo`와 같은 "역방향" 관계에서 사용됩니다. 예를 들어, 게시글을 생성할 때 새로운 사용자를 함께 생성하고 싶다면 다음과 같이 할 수 있습니다:

```php
use App\Models\User;

/**
 * 모델의 기본 상태를 정의합니다.
 *
 * @return array<string, mixed>
 */
public function definition(): array
{
    return [
        'user_id' => User::factory(),
        'title' => fake()->title(),
        'content' => fake()->paragraph(),
    ];
}
```

관계의 컬럼이 이를 정의하는 팩토리에 의존하는 경우, 속성에 클로저를 할당할 수 있습니다. 이 클로저는 팩토리에서 평가된 속성 배열을 인자로 받습니다:

```php
/**
 * 모델의 기본 상태를 정의합니다.
 *
 * @return array<string, mixed>
 */
public function definition(): array
{
    return [
        'user_id' => User::factory(),
        'user_type' => function (array $attributes) {
            return User::find($attributes['user_id'])->type;
        },
        'title' => fake()->title(),
        'content' => fake()->paragraph(),
    ];
}
```


### 기존 모델을 관계에 재활용하기 {#recycling-an-existing-model-for-relationships}

여러 모델이 다른 모델과 공통된 관계를 공유하는 경우, `recycle` 메서드를 사용하여 팩토리가 생성하는 모든 관계에 대해 관련 모델의 단일 인스턴스가 재활용되도록 할 수 있습니다.

예를 들어, `Airline`, `Flight`, `Ticket` 모델이 있고, 티켓은 항공사와 항공편에 속하며, 항공편도 항공사에 속한다고 가정해봅시다. 티켓을 생성할 때 티켓과 항공편 모두에 동일한 항공사를 사용하고 싶을 수 있으므로, `recycle` 메서드에 항공사 인스턴스를 전달할 수 있습니다:

```php
Ticket::factory()
    ->recycle(Airline::factory()->create())
    ->create();
```

`recycle` 메서드는 여러 모델이 공통된 사용자나 팀에 속하는 경우에 특히 유용합니다.

`recycle` 메서드는 기존 모델의 컬렉션도 인수로 받을 수 있습니다. 컬렉션이 `recycle` 메서드에 전달되면, 팩토리가 해당 타입의 모델이 필요할 때마다 컬렉션에서 무작위로 하나의 모델이 선택됩니다:

```php
Ticket::factory()
    ->recycle($airlines)
    ->create();
```
