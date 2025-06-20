# Mocking








## 소개 {#introduction}

Laravel 애플리케이션을 테스트할 때, 특정 부분이 실제로 실행되지 않도록 "모킹(mock)"하고 싶을 수 있습니다. 예를 들어, 이벤트를 디스패치하는 컨트롤러를 테스트할 때, 이벤트 리스너가 실제로 실행되지 않도록 모킹할 수 있습니다. 이렇게 하면 이벤트 리스너의 실행 여부와 상관없이 컨트롤러의 HTTP 응답만 테스트할 수 있으며, 이벤트 리스너는 별도의 테스트 케이스에서 테스트할 수 있습니다.

Laravel은 이벤트, 잡, 기타 파사드 등을 모킹할 수 있는 유용한 메서드를 기본적으로 제공합니다. 이러한 헬퍼들은 주로 Mockery 위에 편의 레이어를 제공하여, 복잡한 Mockery 메서드 호출을 직접 작성하지 않아도 되도록 도와줍니다.


## 객체 모킹 {#mocking-objects}

Laravel의 [서비스 컨테이너](/laravel/12.x/container)를 통해 애플리케이션에 주입될 객체를 모킹할 때는, 모킹한 인스턴스를 `instance` 바인딩으로 컨테이너에 바인딩해야 합니다. 이렇게 하면 컨테이너가 직접 객체를 생성하는 대신, 모킹한 인스턴스를 사용하게 됩니다:
::: code-group
```php [Pest]
use App\Service;
use Mockery;
use Mockery\MockInterface;

test('something can be mocked', function () {
    $this->instance(
        Service::class,
        Mockery::mock(Service::class, function (MockInterface $mock) {
            $mock->expects('process');
        })
    );
});
```

```php [PHPUnit]
use App\Service;
use Mockery;
use Mockery\MockInterface;

public function test_something_can_be_mocked(): void
{
    $this->instance(
        Service::class,
        Mockery::mock(Service::class, function (MockInterface $mock) {
            $mock->expects('process');
        })
    );
}
```
:::
이를 더 편리하게 하기 위해, Laravel의 기본 테스트 케이스 클래스에서 제공하는 `mock` 메서드를 사용할 수 있습니다. 예를 들어, 아래 예시는 위의 예제와 동일합니다:

```php
use App\Service;
use Mockery\MockInterface;

$mock = $this->mock(Service::class, function (MockInterface $mock) {
    $mock->expects('process');
});
```

객체의 일부 메서드만 모킹해야 할 경우 `partialMock` 메서드를 사용할 수 있습니다. 모킹되지 않은 메서드는 호출 시 정상적으로 실행됩니다:

```php
use App\Service;
use Mockery\MockInterface;

$mock = $this->partialMock(Service::class, function (MockInterface $mock) {
    $mock->expects('process');
});
```

마찬가지로, 객체를 [스파이](http://docs.mockery.io/en/latest/reference/spies.html)하고 싶다면, Laravel의 기본 테스트 케이스 클래스에서 `Mockery::spy` 메서드를 감싼 `spy` 메서드를 사용할 수 있습니다. 스파이는 모킹과 비슷하지만, 테스트 중인 코드와의 모든 상호작용을 기록하여 코드 실행 후에 어설션을 할 수 있습니다:

```php
use App\Service;

$spy = $this->spy(Service::class);

// ...

$spy->shouldHaveReceived('process');
```


## 파사드 모킹 {#mocking-facades}

전통적인 정적 메서드 호출과 달리, [파사드](/laravel/12.x/facades) (및 [실시간 파사드](/laravel/12.x/facades#real-time-facades))는 모킹이 가능합니다. 이는 전통적인 정적 메서드보다 큰 이점을 제공하며, 의존성 주입을 사용할 때와 동일한 테스트 용이성을 제공합니다. 테스트 시, 컨트롤러 등에서 발생하는 Laravel 파사드 호출을 모킹하고 싶을 때가 많습니다. 예를 들어, 다음과 같은 컨트롤러 액션을 생각해봅시다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    /**
     * 애플리케이션의 모든 사용자 목록을 조회합니다.
     */
    public function index(): array
    {
        $value = Cache::get('key');

        return [
            // ...
        ];
    }
}
```

`Cache` 파사드 호출은 `expects` 메서드를 사용해 모킹할 수 있으며, 이는 [Mockery](https://github.com/padraic/mockery) 모킹 인스턴스를 반환합니다. 파사드는 실제로 Laravel [서비스 컨테이너](/laravel/12.x/container)에서 해석되고 관리되기 때문에, 일반적인 정적 클래스보다 훨씬 더 테스트하기 쉽습니다. 예를 들어, `Cache` 파사드의 `get` 메서드 호출을 모킹해봅시다:
::: code-group
```php [Pest]
<?php

use Illuminate\Support\Facades\Cache;

test('get index', function () {
    Cache::expects('get')
        ->with('key')
        ->andReturn('value');

    $response = $this->get('/users');

    // ...
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    public function test_get_index(): void
    {
        Cache::expects('get')
            ->with('key')
            ->andReturn('value');

        $response = $this->get('/users');

        // ...
    }
}
```
:::
> [!WARNING]
> `Request` 파사드는 모킹하지 않아야 합니다. 대신, 테스트를 실행할 때 원하는 입력값을 [HTTP 테스트 메서드](/laravel/12.x/http-tests)인 `get`이나 `post` 등에 전달하세요. 마찬가지로, `Config` 파사드를 모킹하는 대신 테스트 내에서 `Config::set` 메서드를 호출하세요.


### 파사드 스파이 {#facade-spies}

파사드를 [스파이](http://docs.mockery.io/en/latest/reference/spies.html)하고 싶다면, 해당 파사드에서 `spy` 메서드를 호출할 수 있습니다. 스파이는 모킹과 비슷하지만, 테스트 중인 코드와의 모든 상호작용을 기록하여 코드 실행 후에 어설션을 할 수 있습니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Support\Facades\Cache;

test('values are be stored in cache', function () {
    Cache::spy();

    $response = $this->get('/');

    $response->assertStatus(200);

    Cache::shouldHaveReceived('put')->with('name', 'Taylor', 10);
});
```

```php [PHPUnit]
use Illuminate\Support\Facades\Cache;

public function test_values_are_be_stored_in_cache(): void
{
    Cache::spy();

    $response = $this->get('/');

    $response->assertStatus(200);

    Cache::shouldHaveReceived('put')->with('name', 'Taylor', 10);
}
```
:::

## 시간과 상호작용하기 {#interacting-with-time}

테스트를 할 때, `now`나 `Illuminate\Support\Carbon::now()`와 같은 헬퍼가 반환하는 시간을 수정해야 할 때가 있습니다. 다행히도, Laravel의 기본 기능 테스트 클래스에는 현재 시간을 조작할 수 있는 헬퍼가 포함되어 있습니다:
::: code-group
```php [Pest]
test('time can be manipulated', function () {
    // 미래로 이동...
    $this->travel(5)->milliseconds();
    $this->travel(5)->seconds();
    $this->travel(5)->minutes();
    $this->travel(5)->hours();
    $this->travel(5)->days();
    $this->travel(5)->weeks();
    $this->travel(5)->years();

    // 과거로 이동...
    $this->travel(-5)->hours();

    // 특정 시간으로 이동...
    $this->travelTo(now()->subHours(6));

    // 현재 시간으로 복귀...
    $this->travelBack();
});
```

```php [PHPUnit]
public function test_time_can_be_manipulated(): void
{
    // 미래로 이동...
    $this->travel(5)->milliseconds();
    $this->travel(5)->seconds();
    $this->travel(5)->minutes();
    $this->travel(5)->hours();
    $this->travel(5)->days();
    $this->travel(5)->weeks();
    $this->travel(5)->years();

    // 과거로 이동...
    $this->travel(-5)->hours();

    // 특정 시간으로 이동...
    $this->travelTo(now()->subHours(6));

    // 현재 시간으로 복귀...
    $this->travelBack();
}
```
:::
여러 시간 이동 메서드에 클로저를 전달할 수도 있습니다. 이 클로저는 지정된 시간에 시간이 멈춘 상태로 호출됩니다. 클로저가 실행된 후에는 시간이 정상적으로 다시 흐릅니다:

```php
$this->travel(5)->days(function () {
    // 5일 후의 미래에서 무언가를 테스트...
});

$this->travelTo(now()->subDays(10), function () {
    // 특정 시점에서 무언가를 테스트...
});
```

`freezeTime` 메서드는 현재 시간을 멈추는 데 사용할 수 있습니다. 마찬가지로, `freezeSecond` 메서드는 현재 초의 시작 시점에 시간을 멈춥니다:

```php
use Illuminate\Support\Carbon;

// 시간을 멈추고, 클로저 실행 후 정상 시간으로 복귀...
$this->freezeTime(function (Carbon $time) {
    // ...
});

// 현재 초의 시작 시점에 시간을 멈추고, 클로저 실행 후 정상 시간으로 복귀...
$this->freezeSecond(function (Carbon $time) {
    // ...
})
```

위에서 설명한 모든 메서드는 주로 시간에 민감한 애플리케이션 동작(예: 포럼에서 비활성 게시글 잠금 등)을 테스트할 때 유용합니다:
::: code-group
```php [Pest]
use App\Models\Thread;

test('포럼 스레드는 1주일간 활동이 없으면 잠긴다', function () {
    $thread = Thread::factory()->create();

    $this->travel(1)->week();

    expect($thread->isLockedByInactivity())->toBeTrue();
});
```

```php [PHPUnit]
use App\Models\Thread;

public function test_forum_threads_lock_after_one_week_of_inactivity()
{
    $thread = Thread::factory()->create();

    $this->travel(1)->week();

    $this->assertTrue($thread->isLockedByInactivity());
}
```
:::