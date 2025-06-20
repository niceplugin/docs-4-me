# HTTP 테스트



















## 소개 {#introduction}

Laravel은 애플리케이션에 HTTP 요청을 보내고 응답을 검사할 수 있는 매우 유창한 API를 제공합니다. 예를 들어, 아래에 정의된 기능 테스트를 살펴보세요:
::: code-group
```php [Pest]
<?php

test('the application returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```
:::
`get` 메서드는 애플리케이션에 `GET` 요청을 보내며, `assertStatus` 메서드는 반환된 응답이 지정된 HTTP 상태 코드를 가져야 함을 단언합니다. 이 간단한 어서션 외에도, Laravel은 응답 헤더, 내용, JSON 구조 등 다양한 항목을 검사할 수 있는 여러 어서션을 제공합니다.


## 요청 만들기 {#making-requests}

애플리케이션에 요청을 보내려면 테스트 내에서 `get`, `post`, `put`, `patch`, `delete` 메서드를 호출할 수 있습니다. 이 메서드들은 실제로 "진짜" HTTP 요청을 애플리케이션에 보내지 않습니다. 대신, 전체 네트워크 요청이 내부적으로 시뮬레이션됩니다.

테스트 요청 메서드는 `Illuminate\Http\Response` 인스턴스를 반환하는 대신, `Illuminate\Testing\TestResponse` 인스턴스를 반환합니다. 이 인스턴스는 애플리케이션의 응답을 검사할 수 있는 [다양한 유용한 어서션](#available-assertions)을 제공합니다:
::: code-group
```php [Pest]
<?php

test('basic request', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_a_basic_request(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```
:::
일반적으로 각 테스트는 애플리케이션에 한 번만 요청을 보내야 합니다. 하나의 테스트 메서드 내에서 여러 요청이 실행되면 예기치 않은 동작이 발생할 수 있습니다.

> [!NOTE]
> 편의를 위해, 테스트를 실행할 때 CSRF 미들웨어는 자동으로 비활성화됩니다.


### 요청 헤더 커스터마이징 {#customizing-request-headers}

요청이 애플리케이션에 전송되기 전에 `withHeaders` 메서드를 사용하여 요청 헤더를 커스터마이징할 수 있습니다. 이 메서드를 통해 원하는 커스텀 헤더를 요청에 추가할 수 있습니다:
::: code-group
```php [Pest]
<?php

test('interacting with headers', function () {
    $response = $this->withHeaders([
        'X-Header' => 'Value',
    ])->post('/user', ['name' => 'Sally']);

    $response->assertStatus(201);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic functional test example.
     */
    public function test_interacting_with_headers(): void
    {
        $response = $this->withHeaders([
            'X-Header' => 'Value',
        ])->post('/user', ['name' => 'Sally']);

        $response->assertStatus(201);
    }
}
```
:::

### 쿠키 {#cookies}

요청을 보내기 전에 `withCookie` 또는 `withCookies` 메서드를 사용하여 쿠키 값을 설정할 수 있습니다. `withCookie` 메서드는 쿠키 이름과 값을 두 개의 인수로 받고, `withCookies` 메서드는 이름/값 쌍의 배열을 받습니다:
::: code-group
```php [Pest]
<?php

test('interacting with cookies', function () {
    $response = $this->withCookie('color', 'blue')->get('/');

    $response = $this->withCookies([
        'color' => 'blue',
        'name' => 'Taylor',
    ])->get('/');

    //
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_interacting_with_cookies(): void
    {
        $response = $this->withCookie('color', 'blue')->get('/');

        $response = $this->withCookies([
            'color' => 'blue',
            'name' => 'Taylor',
        ])->get('/');

        //
    }
}
```
:::

### 세션 / 인증 {#session-and-authentication}

Laravel은 HTTP 테스트 중 세션과 상호작용할 수 있는 여러 헬퍼를 제공합니다. 먼저, `withSession` 메서드를 사용하여 세션 데이터를 지정된 배열로 설정할 수 있습니다. 이는 요청을 보내기 전에 세션에 데이터를 미리 로드할 때 유용합니다:
::: code-group
```php [Pest]
<?php

test('interacting with the session', function () {
    $response = $this->withSession(['banned' => false])->get('/');

    //
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_interacting_with_the_session(): void
    {
        $response = $this->withSession(['banned' => false])->get('/');

        //
    }
}
```
:::
Laravel의 세션은 일반적으로 현재 인증된 사용자의 상태를 유지하는 데 사용됩니다. 따라서 `actingAs` 헬퍼 메서드는 지정된 사용자를 현재 사용자로 인증하는 간단한 방법을 제공합니다. 예를 들어, [모델 팩토리](/laravel/12.x/eloquent-factories)를 사용하여 사용자를 생성하고 인증할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Models\User;

test('an action that requires authentication', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->withSession(['banned' => false])
        ->get('/');

    //
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_an_action_that_requires_authentication(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['banned' => false])
            ->get('/');

        //
    }
}
```
:::
`actingAs` 메서드의 두 번째 인수로 가드 이름을 전달하여 인증에 사용할 가드를 지정할 수도 있습니다. `actingAs` 메서드에 제공된 가드는 테스트가 실행되는 동안 기본 가드가 됩니다:

```php
$this->actingAs($user, 'web')
```


### 응답 디버깅 {#debugging-responses}

애플리케이션에 테스트 요청을 보낸 후, `dump`, `dumpHeaders`, `dumpSession` 메서드를 사용하여 응답 내용을 검사하고 디버깅할 수 있습니다:
::: code-group
```php [Pest]
<?php

test('basic test', function () {
    $response = $this->get('/');

    $response->dumpHeaders();

    $response->dumpSession();

    $response->dump();
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_basic_test(): void
    {
        $response = $this->get('/');

        $response->dumpHeaders();

        $response->dumpSession();

        $response->dump();
    }
}
```
:::
또는, `dd`, `ddHeaders`, `ddBody`, `ddJson`, `ddSession` 메서드를 사용하여 응답 정보를 출력하고 실행을 중단할 수 있습니다:
::: code-group
```php [Pest]
<?php

test('basic test', function () {
    $response = $this->get('/');

    $response->dd();
    $response->ddHeaders();
    $response->ddBody();
    $response->ddJson();
    $response->ddSession();
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_basic_test(): void
    {
        $response = $this->get('/');

        $response->dd();
        $response->ddHeaders();
        $response->ddBody();
        $response->ddJson();
        $response->ddSession();
    }
}
```
:::

### 예외 처리 {#exception-handling}

때때로 애플리케이션이 특정 예외를 발생시키는지 테스트해야 할 수 있습니다. 이를 위해 `Exceptions` 파사드를 통해 예외 핸들러를 "가짜"로 만들 수 있습니다. 예외 핸들러가 가짜로 설정되면, 요청 중에 발생한 예외에 대해 `assertReported` 및 `assertNotReported` 메서드를 사용할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Exceptions;

test('exception is thrown', function () {
    Exceptions::fake();

    $response = $this->get('/order/1');

    // Assert an exception was thrown...
    Exceptions::assertReported(InvalidOrderException::class);

    // Assert against the exception...
    Exceptions::assertReported(function (InvalidOrderException $e) {
        return $e->getMessage() === 'The order was invalid.';
    });
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Exceptions;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_exception_is_thrown(): void
    {
        Exceptions::fake();

        $response = $this->get('/');

        // Assert an exception was thrown...
        Exceptions::assertReported(InvalidOrderException::class);

        // Assert against the exception...
        Exceptions::assertReported(function (InvalidOrderException $e) {
            return $e->getMessage() === 'The order was invalid.';
        });
    }
}
```
:::
`assertNotReported` 및 `assertNothingReported` 메서드는 요청 중에 특정 예외가 발생하지 않았거나, 아무 예외도 발생하지 않았음을 단언할 때 사용할 수 있습니다:

```php
Exceptions::assertNotReported(InvalidOrderException::class);

Exceptions::assertNothingReported();
```

`withoutExceptionHandling` 메서드를 요청 전에 호출하면 해당 요청에 대해 예외 처리를 완전히 비활성화할 수 있습니다:

```php
$response = $this->withoutExceptionHandling()->get('/');
```

또한, 애플리케이션이 PHP 언어나 사용하는 라이브러리에서 더 이상 지원되지 않는 기능을 사용하지 않는지 확인하고 싶다면, 요청 전에 `withoutDeprecationHandling` 메서드를 호출할 수 있습니다. 감쇠(deprecation) 처리가 비활성화되면 감쇠 경고가 예외로 변환되어 테스트가 실패하게 됩니다:

```php
$response = $this->withoutDeprecationHandling()->get('/');
```

`assertThrows` 메서드는 주어진 클로저 내의 코드가 지정된 타입의 예외를 발생시키는지 단언할 때 사용할 수 있습니다:

```php
$this->assertThrows(
    fn () => (new ProcessOrder)->execute(),
    OrderInvalid::class
);
```

발생한 예외를 검사하고 어서션을 하고 싶다면, `assertThrows` 메서드의 두 번째 인수로 클로저를 전달할 수 있습니다:

```php
$this->assertThrows(
    fn () => (new ProcessOrder)->execute(),
    fn (OrderInvalid $e) => $e->orderId() === 123;
);
```

`assertDoesntThrow` 메서드는 주어진 클로저 내의 코드가 예외를 발생시키지 않는지 단언할 때 사용할 수 있습니다:

```php
$this->assertDoesntThrow(fn () => (new ProcessOrder)->execute());
```


## JSON API 테스트 {#testing-json-apis}

Laravel은 JSON API 및 그 응답을 테스트할 수 있는 여러 헬퍼도 제공합니다. 예를 들어, `json`, `getJson`, `postJson`, `putJson`, `patchJson`, `deleteJson`, `optionsJson` 메서드를 사용하여 다양한 HTTP 메서드로 JSON 요청을 보낼 수 있습니다. 이 메서드들에 데이터를 쉽게 전달하거나 헤더를 지정할 수도 있습니다. 먼저, `/api/user`에 `POST` 요청을 보내고 예상한 JSON 데이터가 반환되는지 테스트해봅시다:
::: code-group
```php [Pest]
<?php

test('making an api request', function () {
    $response = $this->postJson('/api/user', ['name' => 'Sally']);

    $response
        ->assertStatus(201)
        ->assertJson([
            'created' => true,
        ]);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic functional test example.
     */
    public function test_making_an_api_request(): void
    {
        $response = $this->postJson('/api/user', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertJson([
                'created' => true,
            ]);
    }
}
```
:::
또한, JSON 응답 데이터는 응답에서 배열 변수처럼 접근할 수 있어, JSON 응답 내 개별 값을 편리하게 검사할 수 있습니다:
::: code-group
```php [Pest]
expect($response['created'])->toBeTrue();
```

```php [PHPUnit]
$this->assertTrue($response['created']);
```
:::
> [!NOTE]
> `assertJson` 메서드는 응답을 배열로 변환하여, 지정된 배열이 애플리케이션에서 반환된 JSON 응답 내에 존재하는지 확인합니다. 따라서 JSON 응답에 다른 속성이 있더라도, 지정된 조각이 존재하면 이 테스트는 통과합니다.


#### 정확한 JSON 일치 단언 {#verifying-exact-match}

앞서 언급한 것처럼, `assertJson` 메서드는 JSON 응답 내에 지정된 JSON 조각이 존재하는지 단언할 때 사용합니다. 만약 지정된 배열이 애플리케이션에서 반환된 JSON과 **정확히 일치**하는지 확인하고 싶다면, `assertExactJson` 메서드를 사용해야 합니다:
::: code-group
```php [Pest]
<?php

test('asserting an exact json match', function () {
    $response = $this->postJson('/user', ['name' => 'Sally']);

    $response
        ->assertStatus(201)
        ->assertExactJson([
            'created' => true,
        ]);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic functional test example.
     */
    public function test_asserting_an_exact_json_match(): void
    {
        $response = $this->postJson('/user', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertExactJson([
                'created' => true,
            ]);
    }
}
```
:::

#### JSON 경로 단언 {#verifying-json-paths}

JSON 응답이 지정된 경로에 원하는 데이터를 포함하는지 확인하려면, `assertJsonPath` 메서드를 사용해야 합니다:
::: code-group
```php [Pest]
<?php

test('asserting a json path value', function () {
    $response = $this->postJson('/user', ['name' => 'Sally']);

    $response
        ->assertStatus(201)
        ->assertJsonPath('team.owner.name', 'Darian');
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic functional test example.
     */
    public function test_asserting_a_json_paths_value(): void
    {
        $response = $this->postJson('/user', ['name' => 'Sally']);

        $response
            ->assertStatus(201)
            ->assertJsonPath('team.owner.name', 'Darian');
    }
}
```
:::
`assertJsonPath` 메서드는 클로저도 받을 수 있으며, 이를 통해 어서션이 통과해야 하는지 동적으로 판단할 수 있습니다:

```php
$response->assertJsonPath('team.owner.name', fn (string $name) => strlen($name) >= 3);
```


### 유창한 JSON 테스트 {#fluent-json-testing}

Laravel은 애플리케이션의 JSON 응답을 유창하게 테스트할 수 있는 아름다운 방법도 제공합니다. 시작하려면, `assertJson` 메서드에 클로저를 전달하세요. 이 클로저는 `Illuminate\Testing\Fluent\AssertableJson` 인스턴스를 인수로 받아, 반환된 JSON에 대해 어서션을 할 수 있습니다. `where` 메서드는 JSON의 특정 속성에 대해 어서션을 할 수 있고, `missing` 메서드는 특정 속성이 JSON에 없는지 단언할 수 있습니다:
::: code-group
```php [Pest]
use Illuminate\Testing\Fluent\AssertableJson;

test('fluent json', function () {
    $response = $this->getJson('/users/1');

    $response
        ->assertJson(fn (AssertableJson $json) =>
            $json->where('id', 1)
                ->where('name', 'Victoria Faith')
                ->where('email', fn (string $email) => str($email)->is('victoria@gmail.com'))
                ->whereNot('status', 'pending')
                ->missing('password')
                ->etc()
        );
});
```

```php [PHPUnit]
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * A basic functional test example.
 */
public function test_fluent_json(): void
{
    $response = $this->getJson('/users/1');

    $response
        ->assertJson(fn (AssertableJson $json) =>
            $json->where('id', 1)
                ->where('name', 'Victoria Faith')
                ->where('email', fn (string $email) => str($email)->is('victoria@gmail.com'))
                ->whereNot('status', 'pending')
                ->missing('password')
                ->etc()
        );
}
```
:::
#### `etc` 메서드 이해하기

위 예제에서, 어서션 체인의 마지막에 `etc` 메서드를 호출한 것을 볼 수 있습니다. 이 메서드는 JSON 객체에 다른 속성이 존재할 수 있음을 Laravel에 알립니다. `etc` 메서드를 사용하지 않으면, 어서션하지 않은 다른 속성이 JSON 객체에 존재할 경우 테스트가 실패합니다.

이 동작의 의도는, 민감한 정보가 JSON 응답에 의도치 않게 노출되는 것을 방지하기 위해, 속성에 대해 명시적으로 어서션을 하거나 `etc` 메서드를 통해 추가 속성을 명시적으로 허용하도록 강제하는 것입니다.

하지만, 어서션 체인에 `etc` 메서드를 포함하지 않는다고 해서, JSON 객체 내에 중첩된 배열에 추가 속성이 추가되지 않는다는 보장은 없습니다. `etc` 메서드는 해당 메서드가 호출된 중첩 레벨에서만 추가 속성이 없는지 보장합니다.


#### 속성 존재/부재 단언 {#asserting-json-attribute-presence-and-absence}

속성이 존재하는지 또는 없는지 단언하려면, `has` 및 `missing` 메서드를 사용할 수 있습니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->has('data')
        ->missing('message')
);
```

또한, `hasAll` 및 `missingAll` 메서드를 사용하면 여러 속성의 존재 또는 부재를 한 번에 단언할 수 있습니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->hasAll(['status', 'data'])
        ->missingAll(['message', 'code'])
);
```

`hasAny` 메서드를 사용하면 주어진 속성 목록 중 하나라도 존재하는지 확인할 수 있습니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->has('status')
        ->hasAny('data', 'message', 'code')
);
```


#### JSON 컬렉션에 대한 어서션 {#asserting-against-json-collections}

종종, 라우트가 여러 항목(예: 여러 사용자)을 포함하는 JSON 응답을 반환할 수 있습니다:

```php
Route::get('/users', function () {
    return User::all();
});
```

이런 경우, 유창한 JSON 객체의 `has` 메서드를 사용하여 응답에 포함된 사용자에 대해 어서션할 수 있습니다. 예를 들어, JSON 응답에 세 명의 사용자가 포함되어 있는지 어서션하고, `first` 메서드를 사용해 컬렉션의 첫 번째 사용자에 대해 추가 어서션을 할 수 있습니다. `first` 메서드는 클로저를 받아, JSON 컬렉션의 첫 번째 객체에 대해 어서션할 수 있습니다:

```php
$response
    ->assertJson(fn (AssertableJson $json) =>
        $json->has(3)
            ->first(fn (AssertableJson $json) =>
                $json->where('id', 1)
                    ->where('name', 'Victoria Faith')
                    ->where('email', fn (string $email) => str($email)->is('victoria@gmail.com'))
                    ->missing('password')
                    ->etc()
            )
    );
```


#### JSON 컬렉션 어서션 범위 지정 {#scoping-json-collection-assertions}

때때로, 애플리케이션의 라우트가 이름이 지정된 키에 할당된 JSON 컬렉션을 반환할 수 있습니다:

```php
Route::get('/users', function () {
    return [
        'meta' => [...],
        'users' => User::all(),
    ];
})
```

이런 라우트를 테스트할 때, `has` 메서드를 사용해 컬렉션의 항목 수를 어서션할 수 있습니다. 또한, `has` 메서드를 사용해 어서션 체인의 범위를 지정할 수도 있습니다:

```php
$response
    ->assertJson(fn (AssertableJson $json) =>
        $json->has('meta')
            ->has('users', 3)
            ->has('users.0', fn (AssertableJson $json) =>
                $json->where('id', 1)
                    ->where('name', 'Victoria Faith')
                    ->where('email', fn (string $email) => str($email)->is('victoria@gmail.com'))
                    ->missing('password')
                    ->etc()
            )
    );
```

하지만, `users` 컬렉션에 대해 두 번의 `has` 메서드 호출을 하는 대신, 세 번째 인수로 클로저를 제공하는 한 번의 호출로도 가능합니다. 이 경우, 클로저는 자동으로 컬렉션의 첫 번째 항목에 범위가 지정되어 호출됩니다:

```php
$response
    ->assertJson(fn (AssertableJson $json) =>
        $json->has('meta')
            ->has('users', 3, fn (AssertableJson $json) =>
                $json->where('id', 1)
                    ->where('name', 'Victoria Faith')
                    ->where('email', fn (string $email) => str($email)->is('victoria@gmail.com'))
                    ->missing('password')
                    ->etc()
            )
    );
```


#### JSON 타입 어서션 {#asserting-json-types}

JSON 응답의 속성이 특정 타입인지 단언하고 싶을 수 있습니다. `Illuminate\Testing\Fluent\AssertableJson` 클래스는 이를 위해 `whereType` 및 `whereAllType` 메서드를 제공합니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->whereType('id', 'integer')
        ->whereAllType([
            'users.0.name' => 'string',
            'meta' => 'array'
        ])
);
```

`|` 문자를 사용하거나, 두 번째 인수로 타입 배열을 전달하여 여러 타입을 지정할 수 있습니다. 응답 값이 나열된 타입 중 하나라도 해당하면 어서션이 성공합니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->whereType('name', 'string|null')
        ->whereType('id', ['string', 'integer'])
);
```

`whereType` 및 `whereAllType` 메서드는 다음 타입을 인식합니다: `string`, `integer`, `double`, `boolean`, `array`, `null`.


## 파일 업로드 테스트 {#testing-file-uploads}

`Illuminate\Http\UploadedFile` 클래스는 테스트용 더미 파일이나 이미지를 생성할 수 있는 `fake` 메서드를 제공합니다. 이는 `Storage` 파사드의 `fake` 메서드와 결합하여 파일 업로드 테스트를 매우 간단하게 만듭니다. 예를 들어, 이 두 기능을 결합하여 아바타 업로드 폼을 쉽게 테스트할 수 있습니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('avatars can be uploaded', function () {
    Storage::fake('avatars');

    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this->post('/avatar', [
        'avatar' => $file,
    ]);

    Storage::disk('avatars')->assertExists($file->hashName());
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_avatars_can_be_uploaded(): void
    {
        Storage::fake('avatars');

        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->post('/avatar', [
            'avatar' => $file,
        ]);

        Storage::disk('avatars')->assertExists($file->hashName());
    }
}
```
:::
특정 파일이 존재하지 않는지 단언하려면, `Storage` 파사드의 `assertMissing` 메서드를 사용할 수 있습니다:

```php
Storage::fake('avatars');

// ...

Storage::disk('avatars')->assertMissing('missing.jpg');
```


#### 가짜 파일 커스터마이징 {#fake-file-customization}

`UploadedFile` 클래스의 `fake` 메서드를 사용해 파일을 생성할 때, 이미지의 너비, 높이, 크기(킬로바이트 단위)를 지정하여 애플리케이션의 유효성 검사 규칙을 더 잘 테스트할 수 있습니다:

```php
UploadedFile::fake()->image('avatar.jpg', $width, $height)->size(100);
```

이미지 외에도, `create` 메서드를 사용해 다른 타입의 파일도 생성할 수 있습니다:

```php
UploadedFile::fake()->create('document.pdf', $sizeInKilobytes);
```

필요하다면, 메서드에 `$mimeType` 인수를 전달하여 파일이 반환해야 하는 MIME 타입을 명시적으로 지정할 수 있습니다:

```php
UploadedFile::fake()->create(
    'document.pdf', $sizeInKilobytes, 'application/pdf'
);
```


## 뷰 테스트 {#testing-views}

Laravel은 애플리케이션에 시뮬레이션된 HTTP 요청을 보내지 않고도 뷰를 렌더링할 수 있게 해줍니다. 이를 위해 테스트 내에서 `view` 메서드를 호출하면 됩니다. `view` 메서드는 뷰 이름과 선택적으로 데이터 배열을 인수로 받습니다. 이 메서드는 `Illuminate\Testing\TestView` 인스턴스를 반환하며, 뷰의 내용을 편리하게 어서션할 수 있는 여러 메서드를 제공합니다:
::: code-group
```php [Pest]
<?php

test('a welcome view can be rendered', function () {
    $view = $this->view('welcome', ['name' => 'Taylor']);

    $view->assertSee('Taylor');
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_a_welcome_view_can_be_rendered(): void
    {
        $view = $this->view('welcome', ['name' => 'Taylor']);

        $view->assertSee('Taylor');
    }
}
```
:::
`TestView` 클래스는 다음과 같은 어서션 메서드를 제공합니다: `assertSee`, `assertSeeInOrder`, `assertSeeText`, `assertSeeTextInOrder`, `assertDontSee`, `assertDontSeeText`.

필요하다면, `TestView` 인스턴스를 문자열로 캐스팅하여 렌더링된 뷰의 원본 내용을 얻을 수 있습니다:

```php
$contents = (string) $this->view('welcome');
```


#### 에러 공유하기 {#sharing-errors}

일부 뷰는 [Laravel이 제공하는 전역 에러 백](/laravel/12.x/validation#quick-displaying-the-validation-errors)에 공유된 에러에 의존할 수 있습니다. 에러 메시지로 에러 백을 채우려면, `withViewErrors` 메서드를 사용할 수 있습니다:

```php
$view = $this->withViewErrors([
    'name' => ['Please provide a valid name.']
])->view('form');

$view->assertSee('Please provide a valid name.');
```


### Blade 및 컴포넌트 렌더링 {#rendering-blade-and-components}

필요하다면, `blade` 메서드를 사용해 [Blade](/laravel/12.x/blade) 원시 문자열을 평가하고 렌더링할 수 있습니다. `view` 메서드와 마찬가지로, `blade` 메서드는 `Illuminate\Testing\TestView` 인스턴스를 반환합니다:

```php
$view = $this->blade(
    '<x-component :name="$name" />',
    ['name' => 'Taylor']
);

$view->assertSee('Taylor');
```

`component` 메서드를 사용해 [Blade 컴포넌트](/laravel/12.x/blade#components)를 평가하고 렌더링할 수 있습니다. `component` 메서드는 `Illuminate\Testing\TestComponent` 인스턴스를 반환합니다:

```php
$view = $this->component(Profile::class, ['name' => 'Taylor']);

$view->assertSee('Taylor');
```


## 사용 가능한 어서션 {#available-assertions}


### 응답 어서션 {#response-assertions}

Laravel의 `Illuminate\Testing\TestResponse` 클래스는 애플리케이션을 테스트할 때 사용할 수 있는 다양한 커스텀 어서션 메서드를 제공합니다. 이 어서션들은 `json`, `get`, `post`, `put`, `delete` 테스트 메서드가 반환하는 응답에서 사용할 수 있습니다:

<style>
    .collection-method-list > p {
        columns: 14.4em 2; -moz-columns: 14.4em 2; -webkit-columns: 14.4em 2;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<div class="collection-method-list" markdown="1">

[assertAccepted](#assert-accepted)
[assertBadRequest](#assert-bad-request)
[assertClientError](#assert-client-error)
[assertConflict](#assert-conflict)
[assertCookie](#assert-cookie)
[assertCookieExpired](#assert-cookie-expired)
[assertCookieNotExpired](#assert-cookie-not-expired)
[assertCookieMissing](#assert-cookie-missing)
[assertCreated](#assert-created)
[assertDontSee](#assert-dont-see)
[assertDontSeeText](#assert-dont-see-text)
[assertDownload](#assert-download)
[assertExactJson](#assert-exact-json)
[assertExactJsonStructure](#assert-exact-json-structure)
[assertForbidden](#assert-forbidden)
[assertFound](#assert-found)
[assertGone](#assert-gone)
[assertHeader](#assert-header)
[assertHeaderMissing](#assert-header-missing)
[assertInternalServerError](#assert-internal-server-error)
[assertJson](#assert-json)
[assertJsonCount](#assert-json-count)
[assertJsonFragment](#assert-json-fragment)
[assertJsonIsArray](#assert-json-is-array)
[assertJsonIsObject](#assert-json-is-object)
[assertJsonMissing](#assert-json-missing)
[assertJsonMissingExact](#assert-json-missing-exact)
[assertJsonMissingValidationErrors](#assert-json-missing-validation-errors)
[assertJsonPath](#assert-json-path)
[assertJsonMissingPath](#assert-json-missing-path)
[assertJsonStructure](#assert-json-structure)
[assertJsonValidationErrors](#assert-json-validation-errors)
[assertJsonValidationErrorFor](#assert-json-validation-error-for)
[assertLocation](#assert-location)
[assertMethodNotAllowed](#assert-method-not-allowed)
[assertMovedPermanently](#assert-moved-permanently)
[assertContent](#assert-content)
[assertNoContent](#assert-no-content)
[assertStreamed](#assert-streamed)
[assertStreamedContent](#assert-streamed-content)
[assertNotFound](#assert-not-found)
[assertOk](#assert-ok)
[assertPaymentRequired](#assert-payment-required)
[assertPlainCookie](#assert-plain-cookie)
[assertRedirect](#assert-redirect)
[assertRedirectBack](#assert-redirect-back)
[assertRedirectContains](#assert-redirect-contains)
[assertRedirectToRoute](#assert-redirect-to-route)
[assertRedirectToSignedRoute](#assert-redirect-to-signed-route)
[assertRequestTimeout](#assert-request-timeout)
[assertSee](#assert-see)
[assertSeeInOrder](#assert-see-in-order)
[assertSeeText](#assert-see-text)
[assertSeeTextInOrder](#assert-see-text-in-order)
[assertServerError](#assert-server-error)
[assertServiceUnavailable](#assert-service-unavailable)
[assertSessionHas](#assert-session-has)
[assertSessionHasInput](#assert-session-has-input)
[assertSessionHasAll](#assert-session-has-all)
[assertSessionHasErrors](#assert-session-has-errors)
[assertSessionHasErrorsIn](#assert-session-has-errors-in)
[assertSessionHasNoErrors](#assert-session-has-no-errors)
[assertSessionDoesntHaveErrors](#assert-session-doesnt-have-errors)
[assertSessionMissing](#assert-session-missing)
[assertStatus](#assert-status)
[assertSuccessful](#assert-successful)
[assertTooManyRequests](#assert-too-many-requests)
[assertUnauthorized](#assert-unauthorized)
[assertUnprocessable](#assert-unprocessable)
[assertUnsupportedMediaType](#assert-unsupported-media-type)
[assertValid](#assert-valid)
[assertInvalid](#assert-invalid)
[assertViewHas](#assert-view-has)
[assertViewHasAll](#assert-view-has-all)
[assertViewIs](#assert-view-is)
[assertViewMissing](#assert-view-missing)

</div>


#### assertAccepted {#assert-accepted}

응답이 accepted(202) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertAccepted();
```


#### assertBadRequest {#assert-bad-request}

응답이 bad request(400) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertBadRequest();
```


#### assertClientError {#assert-client-error}

응답이 클라이언트 에러(>= 400, < 500) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertClientError();
```


#### assertConflict {#assert-conflict}

응답이 conflict(409) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertConflict();
```


#### assertCookie {#assert-cookie}

응답에 지정된 쿠키가 포함되어 있는지 단언합니다:

```php
$response->assertCookie($cookieName, $value = null);
```


#### assertCookieExpired {#assert-cookie-expired}

응답에 지정된 쿠키가 포함되어 있고, 만료되었는지 단언합니다:

```php
$response->assertCookieExpired($cookieName);
```


#### assertCookieNotExpired {#assert-cookie-not-expired}

응답에 지정된 쿠키가 포함되어 있고, 만료되지 않았는지 단언합니다:

```php
$response->assertCookieNotExpired($cookieName);
```


#### assertCookieMissing {#assert-cookie-missing}

응답에 지정된 쿠키가 포함되어 있지 않은지 단언합니다:

```php
$response->assertCookieMissing($cookieName);
```


#### assertCreated {#assert-created}

응답이 201 HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertCreated();
```


#### assertDontSee {#assert-dont-see}

응답에 지정된 문자열이 포함되어 있지 않은지 단언합니다. 두 번째 인수로 `false`를 전달하지 않는 한, 이 어서션은 자동으로 문자열을 이스케이프합니다:

```php
$response->assertDontSee($value, $escape = true);
```


#### assertDontSeeText {#assert-dont-see-text}

응답 텍스트에 지정된 문자열이 포함되어 있지 않은지 단언합니다. 두 번째 인수로 `false`를 전달하지 않는 한, 이 어서션은 자동으로 문자열을 이스케이프합니다. 이 메서드는 어서션 전에 응답 내용을 PHP의 `strip_tags` 함수에 전달합니다:

```php
$response->assertDontSeeText($value, $escape = true);
```


#### assertDownload {#assert-download}

응답이 "다운로드"인지 단언합니다. 일반적으로, 이는 반환된 응답이 `Response::download`, `BinaryFileResponse`, 또는 `Storage::download` 응답임을 의미합니다:

```php
$response->assertDownload();
```

원한다면, 다운로드 파일이 지정된 파일명으로 할당되었는지 단언할 수 있습니다:

```php
$response->assertDownload('image.jpg');
```


#### assertExactJson {#assert-exact-json}

응답이 지정된 JSON 데이터와 정확히 일치하는지 단언합니다:

```php
$response->assertExactJson(array $data);
```


#### assertExactJsonStructure {#assert-exact-json-structure}

응답이 지정된 JSON 구조와 정확히 일치하는지 단언합니다:

```php
$response->assertExactJsonStructure(array $data);
```

이 메서드는 [assertJsonStructure](#assert-json-structure)의 더 엄격한 변형입니다. `assertJsonStructure`와 달리, 이 메서드는 응답에 예상 JSON 구조에 명시적으로 포함되지 않은 키가 있으면 실패합니다.


#### assertForbidden {#assert-forbidden}

응답이 forbidden(403) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertForbidden();
```


#### assertFound {#assert-found}

응답이 found(302) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertFound();
```


#### assertGone {#assert-gone}

응답이 gone(410) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertGone();
```


#### assertHeader {#assert-header}

응답에 지정된 헤더와 값이 존재하는지 단언합니다:

```php
$response->assertHeader($headerName, $value = null);
```


#### assertHeaderMissing {#assert-header-missing}

응답에 지정된 헤더가 존재하지 않는지 단언합니다:

```php
$response->assertHeaderMissing($headerName);
```


#### assertInternalServerError {#assert-internal-server-error}

응답이 "Internal Server Error"(500) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertInternalServerError();
```


#### assertJson {#assert-json}

응답이 지정된 JSON 데이터를 포함하는지 단언합니다:

```php
$response->assertJson(array $data, $strict = false);
```

`assertJson` 메서드는 응답을 배열로 변환하여, 지정된 배열이 애플리케이션에서 반환된 JSON 응답 내에 존재하는지 확인합니다. 따라서 JSON 응답에 다른 속성이 있더라도, 지정된 조각이 존재하면 이 테스트는 통과합니다.


#### assertJsonCount {#assert-json-count}

응답 JSON이 지정된 키에 대해 예상한 개수의 배열을 가지고 있는지 단언합니다:

```php
$response->assertJsonCount($count, $key = null);
```


#### assertJsonFragment {#assert-json-fragment}

응답이 지정된 JSON 데이터를 응답 내 어디에서든 포함하는지 단언합니다:

```php
Route::get('/users', function () {
    return [
        'users' => [
            [
                'name' => 'Taylor Otwell',
            ],
        ],
    ];
});

$response->assertJsonFragment(['name' => 'Taylor Otwell']);
```


#### assertJsonIsArray {#assert-json-is-array}

응답 JSON이 배열인지 단언합니다:

```php
$response->assertJsonIsArray();
```


#### assertJsonIsObject {#assert-json-is-object}

응답 JSON이 객체인지 단언합니다:

```php
$response->assertJsonIsObject();
```


#### assertJsonMissing {#assert-json-missing}

응답에 지정된 JSON 데이터가 포함되어 있지 않은지 단언합니다:

```php
$response->assertJsonMissing(array $data);
```


#### assertJsonMissingExact {#assert-json-missing-exact}

응답에 지정된 JSON 데이터가 정확히 포함되어 있지 않은지 단언합니다:

```php
$response->assertJsonMissingExact(array $data);
```


#### assertJsonMissingValidationErrors {#assert-json-missing-validation-errors}

응답에 지정된 키에 대한 JSON 유효성 검사 에러가 없는지 단언합니다:

```php
$response->assertJsonMissingValidationErrors($keys);
```

> [!NOTE]
> 더 일반적인 [assertValid](#assert-valid) 메서드는, 응답에 JSON으로 반환된 유효성 검사 에러가 없고, 세션 스토리지에 에러가 플래시되지 않았음을 단언할 때 사용할 수 있습니다.


#### assertJsonPath {#assert-json-path}

응답이 지정된 경로에 지정된 데이터를 포함하는지 단언합니다:

```php
$response->assertJsonPath($path, $expectedValue);
```

예를 들어, 애플리케이션에서 다음과 같은 JSON 응답이 반환된다면:

```json
{
    "user": {
        "name": "Steve Schoger"
    }
}
```

`user` 객체의 `name` 속성이 지정된 값과 일치하는지 다음과 같이 단언할 수 있습니다:

```php
$response->assertJsonPath('user.name', 'Steve Schoger');
```


#### assertJsonMissingPath {#assert-json-missing-path}

응답에 지정된 경로가 포함되어 있지 않은지 단언합니다:

```php
$response->assertJsonMissingPath($path);
```

예를 들어, 애플리케이션에서 다음과 같은 JSON 응답이 반환된다면:

```json
{
    "user": {
        "name": "Steve Schoger"
    }
}
```

`user` 객체에 `email` 속성이 포함되어 있지 않은지 단언할 수 있습니다:

```php
$response->assertJsonMissingPath('user.email');
```


#### assertJsonStructure {#assert-json-structure}

응답이 지정된 JSON 구조를 가지고 있는지 단언합니다:

```php
$response->assertJsonStructure(array $structure);
```

예를 들어, 애플리케이션에서 반환된 JSON 응답이 다음과 같은 데이터를 포함한다면:

```json
{
    "user": {
        "name": "Steve Schoger"
    }
}
```

다음과 같이 JSON 구조가 기대와 일치하는지 단언할 수 있습니다:

```php
$response->assertJsonStructure([
    'user' => [
        'name',
    ]
]);
```

때때로, 애플리케이션에서 반환된 JSON 응답에 객체 배열이 포함될 수 있습니다:

```json
{
    "user": [
        {
            "name": "Steve Schoger",
            "age": 55,
            "location": "Earth"
        },
        {
            "name": "Mary Schoger",
            "age": 60,
            "location": "Earth"
        }
    ]
}
```

이 경우, 배열 내 모든 객체의 구조를 어서션하려면 `*` 문자를 사용할 수 있습니다:

```php
$response->assertJsonStructure([
    'user' => [
        '*' => [
             'name',
             'age',
             'location'
        ]
    ]
]);
```


#### assertJsonValidationErrors {#assert-json-validation-errors}

응답이 지정된 키에 대한 JSON 유효성 검사 에러를 가지고 있는지 단언합니다. 이 메서드는 유효성 검사 에러가 세션에 플래시되지 않고 JSON 구조로 반환되는 응답을 어서션할 때 사용해야 합니다:

```php
$response->assertJsonValidationErrors(array $data, $responseKey = 'errors');
```

> [!NOTE]
> 더 일반적인 [assertInvalid](#assert-invalid) 메서드는, 응답에 JSON으로 반환된 유효성 검사 에러가 있거나, 세션 스토리지에 에러가 플래시되었는지 단언할 때 사용할 수 있습니다.


#### assertJsonValidationErrorFor {#assert-json-validation-error-for}

응답이 지정된 키에 대한 JSON 유효성 검사 에러를 가지고 있는지 단언합니다:

```php
$response->assertJsonValidationErrorFor(string $key, $responseKey = 'errors');
```


#### assertMethodNotAllowed {#assert-method-not-allowed}

응답이 method not allowed(405) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertMethodNotAllowed();
```


#### assertMovedPermanently {#assert-moved-permanently}

응답이 moved permanently(301) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertMovedPermanently();
```


#### assertLocation {#assert-location}

응답의 `Location` 헤더에 지정된 URI 값이 있는지 단언합니다:

```php
$response->assertLocation($uri);
```


#### assertContent {#assert-content}

지정된 문자열이 응답 내용과 일치하는지 단언합니다:

```php
$response->assertContent($value);
```


#### assertNoContent {#assert-no-content}

응답이 지정된 HTTP 상태 코드와 내용을 가지지 않는지 단언합니다:

```php
$response->assertNoContent($status = 204);
```


#### assertStreamed {#assert-streamed}

응답이 스트리밍된 응답인지 단언합니다:

    $response->assertStreamed();


#### assertStreamedContent {#assert-streamed-content}

지정된 문자열이 스트리밍된 응답 내용과 일치하는지 단언합니다:

```php
$response->assertStreamedContent($value);
```


#### assertNotFound {#assert-not-found}

응답이 not found(404) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertNotFound();
```


#### assertOk {#assert-ok}

응답이 200 HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertOk();
```


#### assertPaymentRequired {#assert-payment-required}

응답이 payment required(402) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertPaymentRequired();
```


#### assertPlainCookie {#assert-plain-cookie}

응답에 지정된 암호화되지 않은 쿠키가 포함되어 있는지 단언합니다:

```php
$response->assertPlainCookie($cookieName, $value = null);
```


#### assertRedirect {#assert-redirect}

응답이 지정된 URI로 리디렉션되는지 단언합니다:

```php
$response->assertRedirect($uri = null);
```


#### assertRedirectBack {#assert-redirect-back}

응답이 이전 페이지로 리디렉션되는지 단언합니다:

```php
$response->assertRedirectBack();
```


#### assertRedirectContains {#assert-redirect-contains}

응답이 지정된 문자열을 포함하는 URI로 리디렉션되는지 단언합니다:

```php
$response->assertRedirectContains($string);
```


#### assertRedirectToRoute {#assert-redirect-to-route}

응답이 지정된 [이름 있는 라우트](/laravel/12.x/routing#named-routes)로 리디렉션되는지 단언합니다:

```php
$response->assertRedirectToRoute($name, $parameters = []);
```


#### assertRedirectToSignedRoute {#assert-redirect-to-signed-route}

응답이 지정된 [서명된 라우트](/laravel/12.x/urls#signed-urls)로 리디렉션되는지 단언합니다:

```php
$response->assertRedirectToSignedRoute($name = null, $parameters = []);
```


#### assertRequestTimeout {#assert-request-timeout}

응답이 request timeout(408) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertRequestTimeout();
```


#### assertSee {#assert-see}

응답에 지정된 문자열이 포함되어 있는지 단언합니다. 두 번째 인수로 `false`를 전달하지 않는 한, 이 어서션은 자동으로 문자열을 이스케이프합니다:

```php
$response->assertSee($value, $escape = true);
```


#### assertSeeInOrder {#assert-see-in-order}

응답에 지정된 문자열들이 순서대로 포함되어 있는지 단언합니다. 두 번째 인수로 `false`를 전달하지 않는 한, 이 어서션은 자동으로 문자열을 이스케이프합니다:

```php
$response->assertSeeInOrder(array $values, $escape = true);
```


#### assertSeeText {#assert-see-text}

응답 텍스트에 지정된 문자열이 포함되어 있는지 단언합니다. 두 번째 인수로 `false`를 전달하지 않는 한, 이 어서션은 자동으로 문자열을 이스케이프합니다. 어서션 전에 응답 내용이 PHP의 `strip_tags` 함수에 전달됩니다:

```php
$response->assertSeeText($value, $escape = true);
```


#### assertSeeTextInOrder {#assert-see-text-in-order}

응답 텍스트에 지정된 문자열들이 순서대로 포함되어 있는지 단언합니다. 두 번째 인수로 `false`를 전달하지 않는 한, 이 어서션은 자동으로 문자열을 이스케이프합니다. 어서션 전에 응답 내용이 PHP의 `strip_tags` 함수에 전달됩니다:

```php
$response->assertSeeTextInOrder(array $values, $escape = true);
```


#### assertServerError {#assert-server-error}

응답이 서버 에러(>= 500, < 600) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertServerError();
```


#### assertServiceUnavailable {#assert-service-unavailable}

응답이 "Service Unavailable"(503) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertServiceUnavailable();
```


#### assertSessionHas {#assert-session-has}

세션에 지정된 데이터가 포함되어 있는지 단언합니다:

```php
$response->assertSessionHas($key, $value = null);
```

필요하다면, `assertSessionHas` 메서드의 두 번째 인수로 클로저를 전달할 수 있습니다. 클로저가 `true`를 반환하면 어서션이 통과합니다:

```php
$response->assertSessionHas($key, function (User $value) {
    return $value->name === 'Taylor Otwell';
});
```


#### assertSessionHasInput {#assert-session-has-input}

세션의 [플래시된 입력 배열](/laravel/12.x/responses#redirecting-with-flashed-session-data)에 지정된 값이 있는지 단언합니다:

```php
$response->assertSessionHasInput($key, $value = null);
```

필요하다면, `assertSessionHasInput` 메서드의 두 번째 인수로 클로저를 전달할 수 있습니다. 클로저가 `true`를 반환하면 어서션이 통과합니다:

```php
use Illuminate\Support\Facades\Crypt;

$response->assertSessionHasInput($key, function (string $value) {
    return Crypt::decryptString($value) === 'secret';
});
```


#### assertSessionHasAll {#assert-session-has-all}

세션에 지정된 키/값 쌍 배열이 모두 포함되어 있는지 단언합니다:

```php
$response->assertSessionHasAll(array $data);
```

예를 들어, 애플리케이션의 세션에 `name`과 `status` 키가 포함되어 있다면, 다음과 같이 둘 다 존재하고 지정된 값을 가지는지 단언할 수 있습니다:

```php
$response->assertSessionHasAll([
    'name' => 'Taylor Otwell',
    'status' => 'active',
]);
```


#### assertSessionHasErrors {#assert-session-has-errors}

세션에 지정된 `$keys`에 대한 에러가 포함되어 있는지 단언합니다. `$keys`가 연관 배열이면, 세션에 각 필드(키)에 대한 특정 에러 메시지(값)가 포함되어 있는지 단언합니다. 이 메서드는 유효성 검사 에러가 세션에 플래시되고 JSON 구조로 반환되지 않는 라우트를 테스트할 때 사용해야 합니다:

```php
$response->assertSessionHasErrors(
    array $keys = [], $format = null, $errorBag = 'default'
);
```

예를 들어, `name`과 `email` 필드에 대한 유효성 검사 에러 메시지가 세션에 플래시되었는지 단언하려면, 다음과 같이 `assertSessionHasErrors` 메서드를 호출할 수 있습니다:

```php
$response->assertSessionHasErrors(['name', 'email']);
```

또는, 특정 필드에 특정 유효성 검사 에러 메시지가 있는지 단언할 수 있습니다:

```php
$response->assertSessionHasErrors([
    'name' => 'The given name was invalid.'
]);
```

> [!NOTE]
> 더 일반적인 [assertInvalid](#assert-invalid) 메서드는, 응답에 JSON으로 반환된 유효성 검사 에러가 있거나, 세션 스토리지에 에러가 플래시되었는지 단언할 때 사용할 수 있습니다.


#### assertSessionHasErrorsIn {#assert-session-has-errors-in}

지정된 [에러 백](/laravel/12.x/validation#named-error-bags) 내에서 `$keys`에 대한 에러가 세션에 포함되어 있는지 단언합니다. `$keys`가 연관 배열이면, 에러 백 내에서 각 필드(키)에 대한 특정 에러 메시지(값)가 포함되어 있는지 단언합니다:

```php
$response->assertSessionHasErrorsIn($errorBag, $keys = [], $format = null);
```


#### assertSessionHasNoErrors {#assert-session-has-no-errors}

세션에 유효성 검사 에러가 없는지 단언합니다:

```php
$response->assertSessionHasNoErrors();
```


#### assertSessionDoesntHaveErrors {#assert-session-doesnt-have-errors}

지정된 키에 대해 세션에 유효성 검사 에러가 없는지 단언합니다:

```php
$response->assertSessionDoesntHaveErrors($keys = [], $format = null, $errorBag = 'default');
```

> [!NOTE]
> 더 일반적인 [assertValid](#assert-valid) 메서드는, 응답에 JSON으로 반환된 유효성 검사 에러가 없고, 세션 스토리지에 에러가 플래시되지 않았음을 단언할 때 사용할 수 있습니다.


#### assertSessionMissing {#assert-session-missing}

세션에 지정된 키가 포함되어 있지 않은지 단언합니다:

```php
$response->assertSessionMissing($key);
```


#### assertStatus {#assert-status}

응답이 지정된 HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertStatus($code);
```


#### assertSuccessful {#assert-successful}

응답이 성공(>= 200 and < 300) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertSuccessful();
```


#### assertTooManyRequests {#assert-too-many-requests}

응답이 too many requests(429) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertTooManyRequests();
```


#### assertUnauthorized {#assert-unauthorized}

응답이 unauthorized(401) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertUnauthorized();
```


#### assertUnprocessable {#assert-unprocessable}

응답이 unprocessable entity(422) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertUnprocessable();
```


#### assertUnsupportedMediaType {#assert-unsupported-media-type}

응답이 unsupported media type(415) HTTP 상태 코드를 가졌는지 단언합니다:

```php
$response->assertUnsupportedMediaType();
```


#### assertValid {#assert-valid}

응답에 지정된 키에 대한 유효성 검사 에러가 없는지 단언합니다. 이 메서드는 유효성 검사 에러가 JSON 구조로 반환되거나, 세션에 플래시된 경우 모두 어서션할 때 사용할 수 있습니다:

```php
// 유효성 검사 에러가 없는지 단언...
$response->assertValid();

// 지정된 키에 유효성 검사 에러가 없는지 단언...
$response->assertValid(['name', 'email']);
```


#### assertInvalid {#assert-invalid}

응답에 지정된 키에 대한 유효성 검사 에러가 있는지 단언합니다. 이 메서드는 유효성 검사 에러가 JSON 구조로 반환되거나, 세션에 플래시된 경우 모두 어서션할 때 사용할 수 있습니다:

```php
$response->assertInvalid(['name', 'email']);
```

특정 키에 특정 유효성 검사 에러 메시지가 있는지 단언할 수도 있습니다. 이때 전체 메시지 또는 메시지의 일부만 제공할 수 있습니다:

```php
$response->assertInvalid([
    'name' => 'The name field is required.',
    'email' => 'valid email address',
]);
```

지정된 필드만 유효성 검사 에러가 있는지 단언하려면, `assertOnlyInvalid` 메서드를 사용할 수 있습니다:

```php
$response->assertOnlyInvalid(['name', 'email']);
```


#### assertViewHas {#assert-view-has}

응답 뷰에 지정된 데이터가 포함되어 있는지 단언합니다:

```php
$response->assertViewHas($key, $value = null);
```

`assertViewHas` 메서드의 두 번째 인수로 클로저를 전달하면, 특정 뷰 데이터에 대해 검사하고 어서션할 수 있습니다:

```php
$response->assertViewHas('user', function (User $user) {
    return $user->name === 'Taylor';
});
```

또한, 뷰 데이터는 응답에서 배열 변수처럼 접근할 수 있어, 편리하게 검사할 수 있습니다:
::: code-group
```php [Pest]
expect($response['name'])->toBe('Taylor');
```

```php [PHPUnit]
$this->assertEquals('Taylor', $response['name']);
```
:::

#### assertViewHasAll {#assert-view-has-all}

응답 뷰에 지정된 데이터 목록이 모두 포함되어 있는지 단언합니다:

```php
$response->assertViewHasAll(array $data);
```

이 메서드는 뷰에 지정된 키와 일치하는 데이터가 포함되어 있는지만 단언할 때 사용할 수 있습니다:

```php
$response->assertViewHasAll([
    'name',
    'email',
]);
```

또는, 뷰 데이터가 존재하고 특정 값을 가지는지 단언할 수도 있습니다:

```php
$response->assertViewHasAll([
    'name' => 'Taylor Otwell',
    'email' => 'taylor@example.com,',
]);
```


#### assertViewIs {#assert-view-is}

지정된 뷰가 라우트에서 반환되었는지 단언합니다:

```php
$response->assertViewIs($value);
```


#### assertViewMissing {#assert-view-missing}

애플리케이션의 응답에서 반환된 뷰에 지정된 데이터 키가 제공되지 않았는지 단언합니다:

```php
$response->assertViewMissing($key);
```


### 인증 어서션 {#authentication-assertions}

Laravel은 애플리케이션의 기능 테스트 내에서 사용할 수 있는 다양한 인증 관련 어서션도 제공합니다. 이 메서드들은 `get`, `post` 등에서 반환된 `Illuminate\Testing\TestResponse` 인스턴스가 아니라, 테스트 클래스 자체에서 호출됩니다.


#### assertAuthenticated {#assert-authenticated}

사용자가 인증되었는지 단언합니다:

```php
$this->assertAuthenticated($guard = null);
```


#### assertGuest {#assert-guest}

사용자가 인증되지 않았는지 단언합니다:

```php
$this->assertGuest($guard = null);
```


#### assertAuthenticatedAs {#assert-authenticated-as}

특정 사용자가 인증되었는지 단언합니다:

```php
$this->assertAuthenticatedAs($user, $guard = null);
```


## 유효성 검사 어서션 {#validation-assertions}

Laravel은 요청에 제공된 데이터가 유효하거나 유효하지 않음을 보장하기 위해 사용할 수 있는 두 가지 주요 유효성 검사 관련 어서션을 제공합니다.


#### assertValid {#validation-assert-valid}

응답에 지정된 키에 대한 유효성 검사 에러가 없는지 단언합니다. 이 메서드는 유효성 검사 에러가 JSON 구조로 반환되거나, 세션에 플래시된 경우 모두 어서션할 때 사용할 수 있습니다:

```php
// 유효성 검사 에러가 없는지 단언...
$response->assertValid();

// 지정된 키에 유효성 검사 에러가 없는지 단언...
$response->assertValid(['name', 'email']);
```


#### assertInvalid {#validation-assert-invalid}

응답에 지정된 키에 대한 유효성 검사 에러가 있는지 단언합니다. 이 메서드는 유효성 검사 에러가 JSON 구조로 반환되거나, 세션에 플래시된 경우 모두 어서션할 때 사용할 수 있습니다:

```php
$response->assertInvalid(['name', 'email']);
```

특정 키에 특정 유효성 검사 에러 메시지가 있는지 단언할 수도 있습니다. 이때 전체 메시지 또는 메시지의 일부만 제공할 수 있습니다:

```php
$response->assertInvalid([
    'name' => 'The name field is required.',
    'email' => 'valid email address',
]);
```
