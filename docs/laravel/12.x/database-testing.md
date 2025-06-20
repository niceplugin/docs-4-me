# 데이터베이스 테스트








## 소개 {#introduction}

Laravel은 데이터베이스 기반 애플리케이션을 더 쉽게 테스트할 수 있도록 다양한 유용한 도구와 어서션을 제공합니다. 또한, Laravel의 모델 팩토리와 시더를 사용하면 애플리케이션의 Eloquent 모델과 관계를 활용해 테스트용 데이터베이스 레코드를 손쉽게 생성할 수 있습니다. 이 문서에서는 이러한 강력한 기능들을 모두 다룹니다.


### 각 테스트 후 데이터베이스 초기화 {#resetting-the-database-after-each-test}

더 진행하기 전에, 각 테스트 후 데이터베이스를 어떻게 초기화하여 이전 테스트의 데이터가 이후 테스트에 영향을 주지 않도록 할 수 있는지 알아보겠습니다. Laravel에 포함된 `Illuminate\Foundation\Testing\RefreshDatabase` 트레이트가 이 작업을 처리해줍니다. 테스트 클래스에서 이 트레이트를 사용하기만 하면 됩니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('basic example', function () {
    $response = $this->get('/');

    // ...
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic functional test example.
     */
    public function test_basic_example(): void
    {
        $response = $this->get('/');

        // ...
    }
}
```
:::
`Illuminate\Foundation\Testing\RefreshDatabase` 트레이트는 데이터베이스 스키마가 최신 상태라면 마이그레이션을 실행하지 않습니다. 대신, 데이터베이스 트랜잭션 내에서 테스트를 실행합니다. 따라서 이 트레이트를 사용하지 않는 테스트 케이스에서 추가된 레코드는 데이터베이스에 남아 있을 수 있습니다.

데이터베이스를 완전히 초기화하고 싶다면 `Illuminate\Foundation\Testing\DatabaseMigrations` 또는 `Illuminate\Foundation\Testing\DatabaseTruncation` 트레이트를 대신 사용할 수 있습니다. 하지만 이 두 옵션은 `RefreshDatabase` 트레이트보다 훨씬 느립니다.


## 모델 팩토리 {#model-factories}

테스트를 할 때, 테스트 실행 전에 데이터베이스에 몇 개의 레코드를 삽입해야 할 수도 있습니다. 이때 테스트 데이터를 생성할 때 각 컬럼의 값을 일일이 지정하는 대신, Laravel에서는 [모델 팩토리](/laravel/12.x/eloquent-factories)를 사용해 각 [Eloquent 모델](/laravel/12.x/eloquent)에 대한 기본 속성 집합을 정의할 수 있습니다.

모델 팩토리를 생성하고 활용하는 방법에 대해 더 알고 싶다면 [모델 팩토리 문서](/laravel/12.x/eloquent-factories)를 참고하세요. 모델 팩토리를 정의한 후에는 테스트 내에서 팩토리를 사용해 모델을 생성할 수 있습니다:
::: code-group
```php [Pest]
use App\Models\User;

test('models can be instantiated', function () {
    $user = User::factory()->create();

    // ...
});
```

```php [PHPUnit]
use App\Models\User;

public function test_models_can_be_instantiated(): void
{
    $user = User::factory()->create();

    // ...
}
```
:::

## 시더 실행 {#running-seeders}

[데이터베이스 시더](/laravel/12.x/seeding)를 사용해 기능 테스트 중 데이터베이스를 채우고 싶다면, `seed` 메서드를 호출하면 됩니다. 기본적으로 `seed` 메서드는 `DatabaseSeeder`를 실행하며, 이 시더는 다른 모든 시더를 실행해야 합니다. 또는, 특정 시더 클래스 이름을 `seed` 메서드에 전달할 수도 있습니다:
::: code-group
```php [Pest]
<?php

use Database\Seeders\OrderStatusSeeder;
use Database\Seeders\TransactionStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('orders can be created', function () {
    // DatabaseSeeder 실행...
    $this->seed();

    // 특정 시더 실행...
    $this->seed(OrderStatusSeeder::class);

    // ...

    // 여러 시더 배열 실행...
    $this->seed([
        OrderStatusSeeder::class,
        TransactionStatusSeeder::class,
        // ...
    ]);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Database\Seeders\OrderStatusSeeder;
use Database\Seeders\TransactionStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test creating a new order.
     */
    public function test_orders_can_be_created(): void
    {
        // DatabaseSeeder 실행...
        $this->seed();

        // 특정 시더 실행...
        $this->seed(OrderStatusSeeder::class);

        // ...

        // 여러 시더 배열 실행...
        $this->seed([
            OrderStatusSeeder::class,
            TransactionStatusSeeder::class,
            // ...
        ]);
    }
}
```
:::
또는, `RefreshDatabase` 트레이트를 사용하는 각 테스트 전에 Laravel이 자동으로 데이터베이스를 시딩하도록 할 수도 있습니다. 이를 위해서는 기본 테스트 클래스에 `$seed` 프로퍼티를 정의하면 됩니다:

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;
}
```

`$seed` 프로퍼티가 `true`이면, `RefreshDatabase` 트레이트를 사용하는 각 테스트 전에 `Database\Seeders\DatabaseSeeder` 클래스가 실행됩니다. 하지만, 테스트 클래스에 `$seeder` 프로퍼티를 정의하여 실행할 특정 시더를 지정할 수도 있습니다:

```php
use Database\Seeders\OrderStatusSeeder;

/**
 * Run a specific seeder before each test.
 *
 * @var string
 */
protected $seeder = OrderStatusSeeder::class;
```


## 사용 가능한 어서션 {#available-assertions}

Laravel은 [Pest](https://pestphp.com) 또는 [PHPUnit](https://phpunit.de) 기능 테스트를 위한 여러 데이터베이스 어서션을 제공합니다. 아래에서 각 어서션에 대해 설명합니다.


#### assertDatabaseCount {#assert-database-count}

데이터베이스의 테이블에 지정한 개수의 레코드가 있는지 확인합니다:

```php
$this->assertDatabaseCount('users', 5);
```


#### assertDatabaseEmpty {#assert-database-empty}

데이터베이스의 테이블에 레코드가 없는지 확인합니다:

```php
$this->assertDatabaseEmpty('users');
```


#### assertDatabaseHas {#assert-database-has}

데이터베이스의 테이블에 주어진 키/값 쿼리 조건과 일치하는 레코드가 있는지 확인합니다:

```php
$this->assertDatabaseHas('users', [
    'email' => 'sally@example.com',
]);
```


#### assertDatabaseMissing {#assert-database-missing}

데이터베이스의 테이블에 주어진 키/값 쿼리 조건과 일치하는 레코드가 없는지 확인합니다:

```php
$this->assertDatabaseMissing('users', [
    'email' => 'sally@example.com',
]);
```


#### assertSoftDeleted {#assert-deleted}

`assertSoftDeleted` 메서드는 지정한 Eloquent 모델이 "소프트 삭제" 되었는지 확인할 때 사용할 수 있습니다:

```php
$this->assertSoftDeleted($user);
```


#### assertNotSoftDeleted {#assert-not-deleted}

`assertNotSoftDeleted` 메서드는 지정한 Eloquent 모델이 "소프트 삭제"되지 않았는지 확인할 때 사용할 수 있습니다:

```php
$this->assertNotSoftDeleted($user);
```


#### assertModelExists {#assert-model-exists}

지정한 모델이 데이터베이스에 존재하는지 확인합니다:

```php
use App\Models\User;

$user = User::factory()->create();

$this->assertModelExists($user);
```


#### assertModelMissing {#assert-model-missing}

지정한 모델이 데이터베이스에 존재하지 않는지 확인합니다:

```php
use App\Models\User;

$user = User::factory()->create();

$user->delete();

$this->assertModelMissing($user);
```


#### expectsDatabaseQueryCount {#expects-database-query-count}

`expectsDatabaseQueryCount` 메서드는 테스트 시작 시 해당 테스트에서 실행될 것으로 예상되는 전체 데이터베이스 쿼리 수를 지정할 수 있습니다. 실제 실행된 쿼리 수가 이 기대치와 정확히 일치하지 않으면 테스트가 실패합니다:

```php
$this->expectsDatabaseQueryCount(5);

// Test...
```
