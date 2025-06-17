# HTTP 테스트



















## 소개 {#introduction}

Laravel은 애플리케이션에 HTTP 요청을 보내고 응답을 검사할 수 있는 매우 유연한 API를 제공합니다. 예를 들어, 아래에 정의된 기능 테스트를 살펴보세요:

```php tab=Pest
<?php

test('the application returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 테스트 예제입니다.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```

`get` 메서드는 애플리케이션에 `GET` 요청을 보내며, `assertStatus` 메서드는 반환된 응답이 지정된 HTTP 상태 코드를 가져야 함을 단언합니다. 이 간단한 단언 외에도, Laravel은 응답 헤더, 내용, JSON 구조 등 다양한 항목을 검사할 수 있는 여러 단언 메서드를 제공합니다.


## 요청 만들기 {#making-requests}

애플리케이션에 요청을 보내기 위해 테스트 내에서 `get`, `post`, `put`, `patch`, 또는 `delete` 메서드를 호출할 수 있습니다. 이 메서드들은 실제로 "진짜" HTTP 요청을 애플리케이션에 보내는 것이 아니라, 전체 네트워크 요청을 내부적으로 시뮬레이션합니다.

테스트 요청 메서드는 `Illuminate\Http\Response` 인스턴스를 반환하는 대신, `Illuminate\Testing\TestResponse` 인스턴스를 반환합니다. 이 인스턴스는 애플리케이션의 응답을 검사할 수 있는 [다양한 유용한 어서션](#available-assertions)을 제공합니다:

```php tab=Pest
<?php

test('기본 요청', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 테스트 예시.
     */
    public function test_a_basic_request(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```

일반적으로 각 테스트는 애플리케이션에 한 번만 요청을 보내야 합니다. 하나의 테스트 메서드 내에서 여러 번 요청을 실행하면 예기치 않은 동작이 발생할 수 있습니다.

> [!NOTE]
> 편의를 위해, 테스트를 실행할 때 CSRF 미들웨어는 자동으로 비활성화됩니다.


### 요청 헤더 커스터마이징 {#customizing-request-headers}

`withHeaders` 메서드를 사용하여 애플리케이션에 요청이 전송되기 전에 요청의 헤더를 커스터마이징할 수 있습니다. 이 메서드를 통해 원하는 커스텀 헤더를 요청에 추가할 수 있습니다:

```php tab=Pest
<?php

test('헤더와 상호작용', function () {
    $response = $this->withHeaders([
        'X-Header' => 'Value',
    ])->post('/user', ['name' => 'Sally']);

    $response->assertStatus(201);
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 기능 테스트 예제.
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


### Cookies {#cookies}

요청을 보내기 전에 `withCookie` 또는 `withCookies` 메서드를 사용하여 쿠키 값을 설정할 수 있습니다. `withCookie` 메서드는 쿠키 이름과 값을 두 개의 인수로 받으며, `withCookies` 메서드는 이름/값 쌍의 배열을 인수로 받습니다:

```php tab=Pest
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

```php tab=PHPUnit
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


### 세션 / 인증 {#session-and-authentication}

라라벨은 HTTP 테스트 중 세션과 상호작용할 수 있는 여러 헬퍼를 제공합니다. 먼저, `withSession` 메서드를 사용하여 세션 데이터를 주어진 배열로 설정할 수 있습니다. 이는 애플리케이션에 요청을 보내기 전에 세션에 데이터를 미리 로드할 때 유용합니다:

```php tab=Pest
<?php

test('세션과 상호작용', function () {
    $response = $this->withSession(['banned' => false])->get('/');

    //
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_세션과_상호작용(): void
    {
        $response = $this->withSession(['banned' => false])->get('/');

        //
    }
}
```

라라벨의 세션은 일반적으로 현재 인증된 사용자의 상태를 유지하는 데 사용됩니다. 따라서 `actingAs` 헬퍼 메서드는 주어진 사용자를 현재 사용자로 인증하는 간단한 방법을 제공합니다. 예를 들어, [모델 팩토리](/laravel/12.x/eloquent-factories)를 사용하여 사용자를 생성하고 인증할 수 있습니다:

```php tab=Pest
<?php

use App\Models\User;

test('인증이 필요한 동작', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->withSession(['banned' => false])
        ->get('/');

    //
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_인증이_필요한_동작(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['banned' => false])
            ->get('/');

        //
    }
}
```

또한 `actingAs` 메서드의 두 번째 인수로 가드 이름을 전달하여 어떤 가드를 사용해 주어진 사용자를 인증할지 지정할 수 있습니다. `actingAs` 메서드에 제공된 가드는 테스트가 진행되는 동안 기본 가드가 됩니다:

```php
$this->actingAs($user, 'web')
```


### 디버깅 응답 {#debugging-responses}

애플리케이션에 테스트 요청을 보낸 후, `dump`, `dumpHeaders`, `dumpSession` 메서드를 사용하여 응답 내용을 확인하고 디버깅할 수 있습니다:

```php tab=Pest
<?php

test('basic test', function () {
    $response = $this->get('/');

    $response->dumpHeaders();

    $response->dumpSession();

    $response->dump();
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 테스트 예제.
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

또는, `dd`, `ddHeaders`, `ddBody`, `ddJson`, `ddSession` 메서드를 사용하여 응답에 대한 정보를 출력하고 실행을 중단할 수도 있습니다:

```php tab=Pest
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

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 테스트 예제.
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


### 예외 처리 {#exception-handling}

때때로 애플리케이션이 특정 예외를 발생시키는지 테스트해야 할 때가 있습니다. 이를 위해 `Exceptions` 파사드를 통해 예외 핸들러를 "가짜"로 만들 수 있습니다. 예외 핸들러를 가짜로 만든 후에는 `assertReported` 및 `assertNotReported` 메서드를 사용하여 요청 중에 발생한 예외에 대해 어설션을 할 수 있습니다:

```php tab=Pest
<?php

use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Exceptions;

test('exception is thrown', function () {
    Exceptions::fake();

    $response = $this->get('/order/1');

    // 예외가 발생했는지 확인...
    Exceptions::assertReported(InvalidOrderException::class);

    // 예외에 대해 어설션...
    Exceptions::assertReported(function (InvalidOrderException $e) {
        return $e->getMessage() === 'The order was invalid.';
    });
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use App\Exceptions\InvalidOrderException;
use Illuminate\Support\Facades\Exceptions;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 테스트 예시.
     */
    public function test_exception_is_thrown(): void
    {
        Exceptions::fake();

        $response = $this->get('/');

        // 예외가 발생했는지 확인...
        Exceptions::assertReported(InvalidOrderException::class);

        // 예외에 대해 어설션...
        Exceptions::assertReported(function (InvalidOrderException $e) {
            return $e->getMessage() === 'The order was invalid.';
        });
    }
}
```

`assertNotReported` 및 `assertNothingReported` 메서드는 요청 중에 특정 예외가 발생하지 않았거나, 아무 예외도 발생하지 않았는지 어설션할 때 사용할 수 있습니다:

```php
Exceptions::assertNotReported(InvalidOrderException::class);

Exceptions::assertNothingReported();
```

요청을 보내기 전에 `withoutExceptionHandling` 메서드를 호출하여 해당 요청에 대한 예외 처리를 완전히 비활성화할 수 있습니다:

```php
$response = $this->withoutExceptionHandling()->get('/');
```

또한, 애플리케이션이 PHP 언어나 사용하는 라이브러리에서 더 이상 지원되지 않는 기능을 사용하지 않는지 확인하고 싶다면, 요청을 보내기 전에 `withoutDeprecationHandling` 메서드를 호출할 수 있습니다. 사용 중단(deprecation) 처리가 비활성화되면, 사용 중단 경고가 예외로 변환되어 테스트가 실패하게 됩니다:

```php
$response = $this->withoutDeprecationHandling()->get('/');
```

`assertThrows` 메서드는 주어진 클로저 내의 코드가 지정한 타입의 예외를 발생시키는지 어설션할 때 사용할 수 있습니다:

```php
$this->assertThrows(
    fn () => (new ProcessOrder)->execute(),
    OrderInvalid::class
);
```

발생한 예외를 검사하고 추가 어설션을 하고 싶다면, `assertThrows` 메서드의 두 번째 인자로 클로저를 전달할 수 있습니다:

```php
$this->assertThrows(
    fn () => (new ProcessOrder)->execute(),
    fn (OrderInvalid $e) => $e->orderId() === 123;
);
```

`assertDoesntThrow` 메서드는 주어진 클로저 내의 코드가 어떤 예외도 발생시키지 않는지 어설션할 때 사용할 수 있습니다:

```php
$this->assertDoesntThrow(fn () => (new ProcessOrder)->execute());
```


## JSON API 테스트 {#testing-json-apis}

Laravel은 JSON API와 그 응답을 테스트하기 위한 여러 헬퍼도 제공합니다. 예를 들어, `json`, `getJson`, `postJson`, `putJson`, `patchJson`, `deleteJson`, `optionsJson` 메서드를 사용하여 다양한 HTTP 메서드로 JSON 요청을 보낼 수 있습니다. 또한 이 메서드들에 데이터를 헤더와 함께 쉽게 전달할 수 있습니다. 시작을 위해, `/api/user`에 `POST` 요청을 보내고 예상한 JSON 데이터가 반환되었는지 확인하는 테스트를 작성해봅시다:

```php tab=Pest
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

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 기능 테스트 예시.
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

또한, JSON 응답 데이터는 응답 객체에서 배열 변수처럼 접근할 수 있으므로, JSON 응답 내에 반환된 개별 값을 쉽게 확인할 수 있습니다:

```php tab=Pest
expect($response['created'])->toBeTrue();
```

```php tab=PHPUnit
$this->assertTrue($response['created']);
```

> [!NOTE]
> `assertJson` 메서드는 응답을 배열로 변환하여, 주어진 배열이 애플리케이션에서 반환된 JSON 응답 내에 존재하는지 확인합니다. 따라서 JSON 응답에 다른 속성이 더 있더라도, 주어진 조각이 포함되어 있으면 이 테스트는 통과합니다.


#### 정확한 JSON 일치 단언 {#verifying-exact-match}

앞서 언급했듯이, `assertJson` 메서드는 JSON 응답 내에 특정 JSON 조각이 존재하는지 단언하는 데 사용할 수 있습니다. 만약 주어진 배열이 애플리케이션에서 반환된 JSON과 **정확히 일치**하는지 확인하고 싶다면, `assertExactJson` 메서드를 사용해야 합니다:

```php tab=Pest
<?php

test('정확한 json 일치 단언', function () {
    $response = $this->postJson('/user', ['name' => 'Sally']);

    $response
        ->assertStatus(201)
        ->assertExactJson([
            'created' => true,
        ]);
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 기능 테스트 예시.
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


#### JSON 경로에 대한 단언 {#verifying-json-paths}

지정된 경로에 JSON 응답이 주어진 데이터를 포함하고 있는지 확인하려면 `assertJsonPath` 메서드를 사용해야 합니다:

```php tab=Pest
<?php

test('json 경로 값 단언', function () {
    $response = $this->postJson('/user', ['name' => 'Sally']);

    $response
        ->assertStatus(201)
        ->assertJsonPath('team.owner.name', 'Darian');
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 기능 테스트 예제.
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

`assertJsonPath` 메서드는 클로저도 허용하며, 이를 통해 단언이 통과해야 하는지 동적으로 판단할 수 있습니다:

```php
$response->assertJsonPath('team.owner.name', fn (string $name) => strlen($name) >= 3);
```


### 유연한 JSON 테스트 {#fluent-json-testing}

Laravel은 애플리케이션의 JSON 응답을 유연하게 테스트할 수 있는 아름다운 방법도 제공합니다. 시작하려면, `assertJson` 메서드에 클로저를 전달하세요. 이 클로저는 `Illuminate\Testing\Fluent\AssertableJson` 인스턴스와 함께 호출되며, 이를 사용해 애플리케이션에서 반환된 JSON에 대해 다양한 단언을 할 수 있습니다. `where` 메서드는 JSON의 특정 속성에 대해 단언할 때 사용하고, `missing` 메서드는 JSON에서 특정 속성이 없는지 단언할 때 사용할 수 있습니다:

```php tab=Pest
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

```php tab=PHPUnit
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * 기본 기능 테스트 예시입니다.
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

#### `etc` 메서드 이해하기

위의 예제에서, 우리는 assertion 체인의 끝에 `etc` 메서드를 호출한 것을 볼 수 있습니다. 이 메서드는 JSON 객체에 다른 속성이 존재할 수 있음을 Laravel에 알립니다. 만약 `etc` 메서드를 사용하지 않으면, assertion을 하지 않은 다른 속성이 JSON 객체에 존재할 경우 테스트가 실패하게 됩니다.

이러한 동작의 의도는, 속성에 대해 명시적으로 assertion을 하거나 `etc` 메서드를 통해 추가 속성을 명시적으로 허용하도록 강제함으로써, JSON 응답에서 민감한 정보가 의도치 않게 노출되는 것을 방지하기 위함입니다.

하지만 assertion 체인에 `etc` 메서드를 포함하지 않는다고 해서, JSON 객체 내에 중첩된 배열에 추가 속성이 포함되지 않는다는 것을 보장하지는 않는다는 점을 알아두어야 합니다. `etc` 메서드는 오직 해당 메서드가 호출된 중첩 수준에서만 추가 속성이 존재하지 않음을 보장합니다.


#### 속성 존재 / 부재 단언하기 {#asserting-json-attribute-presence-and-absence}

속성이 존재하는지 또는 존재하지 않는지 단언하려면 `has`와 `missing` 메서드를 사용할 수 있습니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->has('data')
        ->missing('message')
);
```

또한, `hasAll`과 `missingAll` 메서드를 사용하면 여러 속성의 존재 또는 부재를 동시에 단언할 수 있습니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->hasAll(['status', 'data'])
        ->missingAll(['message', 'code'])
);
```

주어진 속성 목록 중 적어도 하나가 존재하는지 확인하려면 `hasAny` 메서드를 사용할 수 있습니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->has('status')
        ->hasAny('data', 'message', 'code')
);
```


#### JSON 컬렉션에 대한 단언 {#asserting-against-json-collections}

종종, 라우트가 여러 항목(예: 여러 사용자)을 포함하는 JSON 응답을 반환할 수 있습니다:

```php
Route::get('/users', function () {
    return User::all();
});
```

이러한 상황에서는, fluent JSON 객체의 `has` 메서드를 사용하여 응답에 포함된 사용자에 대해 단언할 수 있습니다. 예를 들어, JSON 응답에 세 명의 사용자가 포함되어 있는지 단언해보겠습니다. 다음으로, `first` 메서드를 사용하여 컬렉션의 첫 번째 사용자에 대해 몇 가지 단언을 해보겠습니다. `first` 메서드는 클로저를 인자로 받아, JSON 컬렉션의 첫 번째 객체에 대해 단언할 수 있는 또 다른 assertable JSON 문자열을 전달합니다:

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


#### JSON 컬렉션 단언의 범위 지정 {#scoping-json-collection-assertions}

때때로, 애플리케이션의 라우트가 이름이 지정된 키에 할당된 JSON 컬렉션을 반환할 수 있습니다:

```php
Route::get('/users', function () {
    return [
        'meta' => [...],
        'users' => User::all(),
    ];
})
```

이러한 라우트를 테스트할 때, `has` 메서드를 사용하여 컬렉션의 항목 수를 단언할 수 있습니다. 또한, `has` 메서드를 사용하여 일련의 단언의 범위를 지정할 수도 있습니다:

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

하지만, `users` 컬렉션에 대해 단언하기 위해 `has` 메서드를 두 번 호출하는 대신, 세 번째 매개변수로 클로저를 제공하여 한 번만 호출할 수도 있습니다. 이렇게 하면, 클로저가 자동으로 호출되어 컬렉션의 첫 번째 항목에 범위가 지정됩니다:

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


#### JSON 타입 단언하기 {#asserting-json-types}

JSON 응답의 속성이 특정 타입인지 단언하고 싶을 때가 있습니다. `Illuminate\Testing\Fluent\AssertableJson` 클래스는 이를 위해 `whereType`과 `whereAllType` 메서드를 제공합니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->whereType('id', 'integer')
        ->whereAllType([
            'users.0.name' => 'string',
            'meta' => 'array'
        ])
);
```

`|` 문자를 사용하거나, `whereType` 메서드의 두 번째 인자로 타입 배열을 전달하여 여러 타입을 지정할 수 있습니다. 응답 값이 나열된 타입 중 하나라도 일치하면 단언이 성공합니다:

```php
$response->assertJson(fn (AssertableJson $json) =>
    $json->whereType('name', 'string|null')
        ->whereType('id', ['string', 'integer'])
);
```

`whereType`과 `whereAllType` 메서드는 다음 타입을 인식합니다: `string`, `integer`, `double`, `boolean`, `array`, 그리고 `null`.


## 파일 업로드 테스트 {#testing-file-uploads}

`Illuminate\Http\UploadedFile` 클래스는 테스트를 위해 더미 파일이나 이미지를 생성할 수 있는 `fake` 메서드를 제공합니다. 이 메서드는 `Storage` 파사드의 `fake` 메서드와 결합하여 파일 업로드 테스트를 매우 간단하게 만들어줍니다. 예를 들어, 이 두 기능을 조합하여 아바타 업로드 폼을 손쉽게 테스트할 수 있습니다:

```php tab=Pest
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

```php tab=PHPUnit
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

특정 파일이 존재하지 않는다는 것을 검증하고 싶다면, `Storage` 파사드에서 제공하는 `assertMissing` 메서드를 사용할 수 있습니다:

```php
Storage::fake('avatars');

// ...

Storage::disk('avatars')->assertMissing('missing.jpg');
```


#### 가짜 파일 커스터마이징 {#fake-file-customization}

`UploadedFile` 클래스에서 제공하는 `fake` 메서드를 사용하여 파일을 생성할 때, 이미지의 너비, 높이, 크기(킬로바이트 단위)를 지정하여 애플리케이션의 유효성 검사 규칙을 더 잘 테스트할 수 있습니다:

```php
UploadedFile::fake()->image('avatar.jpg', $width, $height)->size(100);
```

이미지 생성 외에도, `create` 메서드를 사용하여 다른 모든 유형의 파일도 생성할 수 있습니다:

```php
UploadedFile::fake()->create('document.pdf', $sizeInKilobytes);
```

필요하다면, 메서드에 `$mimeType` 인자를 전달하여 파일이 반환할 MIME 타입을 명시적으로 지정할 수 있습니다:

```php
UploadedFile::fake()->create(
    'document.pdf', $sizeInKilobytes, 'application/pdf'
);
```


## 뷰 테스트하기 {#testing-views}

Laravel은 애플리케이션에 대한 모의 HTTP 요청을 만들지 않고도 뷰를 렌더링할 수 있도록 지원합니다. 이를 위해 테스트 내에서 `view` 메서드를 호출할 수 있습니다. `view` 메서드는 뷰 이름과 선택적으로 데이터 배열을 인수로 받습니다. 이 메서드는 `Illuminate\Testing\TestView` 인스턴스를 반환하며, 이 인스턴스는 뷰의 내용을 편리하게 검증할 수 있는 여러 메서드를 제공합니다:

```php tab=Pest
<?php

test('a welcome view can be rendered', function () {
    $view = $this->view('welcome', ['name' => 'Taylor']);

    $view->assertSee('Taylor');
});
```

```php tab=PHPUnit
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

`TestView` 클래스는 다음과 같은 검증 메서드를 제공합니다: `assertSee`, `assertSeeInOrder`, `assertSeeText`, `assertSeeTextInOrder`, `assertDontSee`, 그리고 `assertDontSeeText`.

필요하다면, `TestView` 인스턴스를 문자열로 캐스팅하여 렌더링된 뷰의 원본 내용을 얻을 수 있습니다:

```php
$contents = (string) $this->view('welcome');
```


#### 에러 공유하기 {#sharing-errors}

일부 뷰는 [Laravel이 제공하는 글로벌 에러 백](/laravel/12.x/validation#quick-displaying-the-validation-errors)에 공유된 에러에 의존할 수 있습니다. 에러 백에 에러 메시지를 주입하려면 `withViewErrors` 메서드를 사용할 수 있습니다:

```php
$view = $this->withViewErrors([
    'name' => ['Please provide a valid name.']
])->view('form');

$view->assertSee('Please provide a valid name.');
```


### Blade 및 컴포넌트 렌더링 {#rendering-blade-and-components}

필요하다면, `blade` 메서드를 사용하여 원시 [Blade](/laravel/12.x/blade) 문자열을 평가하고 렌더링할 수 있습니다. `view` 메서드와 마찬가지로, `blade` 메서드는 `Illuminate\Testing\TestView` 인스턴스를 반환합니다:

```php
$view = $this->blade(
    '<x-component :name="$name" />',
    ['name' => 'Taylor']
);

$view->assertSee('Taylor');
```

[Blade 컴포넌트](/laravel/12.x/blade#components)를 평가하고 렌더링하려면 `component` 메서드를 사용할 수 있습니다. `component` 메서드는 `Illuminate\Testing\TestComponent` 인스턴스를 반환합니다:

```php
$view = $this->component(Profile::class, ['name' => 'Taylor']);

$view->assertSee('Taylor');
```


## 사용 가능한 어서션 {#available-assertions}


### 응답 어서션 {#response-assertions}

Laravel의 `Illuminate\Testing\TestResponse` 클래스는 애플리케이션을 테스트할 때 사용할 수 있는 다양한 커스텀 어서션 메서드를 제공합니다. 이러한 어서션은 `json`, `get`, `post`, `put`, `delete` 테스트 메서드에서 반환된 응답에서 사용할 수 있습니다:

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

응답이 accepted(202) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertAccepted();
```


#### assertBadRequest {#assert-bad-request}

응답이 잘못된 요청(400) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertBadRequest();
```


#### assertClientError {#assert-client-error}

응답이 클라이언트 오류(>= 400, < 500) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertClientError();
```


#### assertConflict {#assert-conflict}

응답이 conflict (409) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertConflict();
```


#### assertCookie {#assert-cookie}

응답에 지정된 쿠키가 포함되어 있는지 단언합니다:

```php
$response->assertCookie($cookieName, $value = null);
```


#### assertCookieExpired {#assert-cookie-expired}

응답에 지정된 쿠키가 존재하며 만료되었는지 단언합니다:

```php
$response->assertCookieExpired($cookieName);
```


#### assertCookieNotExpired {#assert-cookie-not-expired}

응답에 지정된 쿠키가 존재하며 만료되지 않았는지 확인합니다:

```php
$response->assertCookieNotExpired($cookieName);
```


#### assertCookieMissing {#assert-cookie-missing}

응답에 지정한 쿠키가 포함되어 있지 않은지 확인합니다:

```php
$response->assertCookieMissing($cookieName);
```


#### assertCreated {#assert-created}

응답이 201 HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertCreated();
```


#### assertDontSee {#assert-dont-see}

애플리케이션이 반환한 응답에 주어진 문자열이 포함되어 있지 않은지 확인합니다. 이 어설션은 두 번째 인자로 `false`를 전달하지 않는 한, 주어진 문자열을 자동으로 이스케이프합니다:

```php
$response->assertDontSee($value, $escape = true);
```


#### assertDontSeeText {#assert-dont-see-text}

응답 텍스트에 주어진 문자열이 포함되어 있지 않은지 단언합니다. 이 단언은 두 번째 인자로 `false`를 전달하지 않는 한, 주어진 문자열을 자동으로 이스케이프합니다. 이 메서드는 단언을 수행하기 전에 응답 내용을 `strip_tags` PHP 함수에 전달합니다:

```php
$response->assertDontSeeText($value, $escape = true);
```


#### assertDownload {#assert-download}

응답이 "다운로드"임을 단언합니다. 일반적으로 이는 호출된 라우트가 `Response::download` 응답, `BinaryFileResponse`, 또는 `Storage::download` 응답을 반환했음을 의미합니다:

```php
$response->assertDownload();
```

원한다면, 다운로드 가능한 파일이 특정 파일명으로 지정되었는지도 단언할 수 있습니다:

```php
$response->assertDownload('image.jpg');
```


#### assertExactJson {#assert-exact-json}

응답이 주어진 JSON 데이터와 정확히 일치하는지 단언합니다:

```php
$response->assertExactJson(array $data);
```


#### assertExactJsonStructure {#assert-exact-json-structure}

응답이 주어진 JSON 구조와 정확히 일치하는지 단언합니다:

```php
$response->assertExactJsonStructure(array $data);
```

이 메서드는 [assertJsonStructure](#assert-json-structure)의 더 엄격한 버전입니다. `assertJsonStructure`와 달리, 이 메서드는 응답에 예상한 JSON 구조에 명시적으로 포함되지 않은 키가 하나라도 있으면 실패합니다.


#### assertForbidden {#assert-forbidden}

응답이 금지됨(403) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertForbidden();
```


#### assertFound {#assert-found}

응답이 found(302) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertFound();
```


#### assertGone {#assert-gone}

응답이 gone(410) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertGone();
```


#### assertHeader {#assert-header}

응답에 주어진 헤더와 값이 존재하는지 단언합니다:

```php
$response->assertHeader($headerName, $value = null);
```


#### assertHeaderMissing {#assert-header-missing}

응답에 지정한 헤더가 존재하지 않는지 확인합니다:

```php
$response->assertHeaderMissing($headerName);
```


#### assertInternalServerError {#assert-internal-server-error}

응답이 "내부 서버 오류"(500) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertInternalServerError();
```


#### assertJson {#assert-json}

응답에 지정된 JSON 데이터가 포함되어 있는지 단언합니다:

```php
$response->assertJson(array $data, $strict = false);
```

`assertJson` 메서드는 응답을 배열로 변환하여, 애플리케이션이 반환한 JSON 응답 내에 지정된 배열이 존재하는지 확인합니다. 따라서 JSON 응답에 다른 속성이 있더라도, 지정된 조각이 존재하면 이 테스트는 통과합니다.


#### assertJsonCount {#assert-json-count}

응답 JSON이 주어진 키에서 예상한 개수의 항목을 가진 배열인지 확인합니다:

```php
$response->assertJsonCount($count, $key = null);
```


#### assertJsonFragment {#assert-json-fragment}

응답에 주어진 JSON 데이터가 어디에든 포함되어 있는지 단언합니다:

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

응답 JSON이 배열임을 단언합니다:

```php
$response->assertJsonIsArray();
```


#### assertJsonIsObject {#assert-json-is-object}

응답 JSON이 객체임을 단언합니다:

```php
$response->assertJsonIsObject();
```


#### assertJsonMissing {#assert-json-missing}

응답에 주어진 JSON 데이터가 포함되어 있지 않은지 단언합니다:

```php
$response->assertJsonMissing(array $data);
```


#### assertJsonMissingExact {#assert-json-missing-exact}

응답에 정확히 일치하는 JSON 데이터가 포함되어 있지 않은지 단언합니다:

```php
$response->assertJsonMissingExact(array $data);
```


#### assertJsonMissingValidationErrors {#assert-json-missing-validation-errors}

지정된 키에 대해 응답에 JSON 유효성 검사 오류가 없는지 단언합니다:

```php
$response->assertJsonMissingValidationErrors($keys);
```

> [!NOTE]
> 더 일반적인 [assertValid](#assert-valid) 메서드는 응답에 JSON으로 반환된 유효성 검사 오류가 없고, 세션 저장소에 오류가 플래시되지 않았음을 단언하는 데 사용할 수 있습니다.


#### assertJsonPath {#assert-json-path}

응답이 지정된 경로에 주어진 데이터를 포함하고 있는지 단언합니다:

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

`user` 객체의 `name` 속성이 주어진 값과 일치하는지 다음과 같이 단언할 수 있습니다:

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

`user` 객체에 `email` 속성이 포함되어 있지 않음을 단언할 수 있습니다:

```php
$response->assertJsonMissingPath('user.email');
```


#### assertJsonStructure {#assert-json-structure}

응답이 지정된 JSON 구조를 가지고 있는지 단언합니다:

```php
$response->assertJsonStructure(array $structure);
```

예를 들어, 애플리케이션에서 반환된 JSON 응답이 다음과 같은 데이터를 포함하고 있다면:

```json
{
    "user": {
        "name": "Steve Schoger"
    }
}
```

아래와 같이 JSON 구조가 기대한 대로 일치하는지 단언할 수 있습니다:

```php
$response->assertJsonStructure([
    'user' => [
        'name',
    ]
]);
```

때때로, 애플리케이션에서 반환된 JSON 응답이 객체의 배열을 포함할 수도 있습니다:

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

이런 경우, 배열 내 모든 객체의 구조를 단언하기 위해 `*` 문자를 사용할 수 있습니다:

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

응답이 주어진 키에 대해 지정된 JSON 유효성 검사 오류를 가지고 있는지 단언합니다. 이 메서드는 유효성 검사 오류가 세션에 플래시되는 대신 JSON 구조로 반환되는 응답에 대해 단언할 때 사용해야 합니다:

```php
$response->assertJsonValidationErrors(array $data, $responseKey = 'errors');
```

> [!NOTE]
> 보다 일반적인 [assertInvalid](#assert-invalid) 메서드는 응답에 유효성 검사 오류가 JSON으로 반환되었는지 **또는** 오류가 세션 저장소에 플래시되었는지 단언할 때 사용할 수 있습니다.


#### assertJsonValidationErrorFor {#assert-json-validation-error-for}

주어진 키에 대한 JSON 유효성 검사 오류가 응답에 있는지 확인합니다:

```php
$response->assertJsonValidationErrorFor(string $key, $responseKey = 'errors');
```


#### assertMethodNotAllowed {#assert-method-not-allowed}

응답이 메서드 허용 안 됨(405) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertMethodNotAllowed();
```


#### assertMovedPermanently {#assert-moved-permanently}

응답이 영구적으로 이동됨(301) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertMovedPermanently();
```


#### assertLocation {#assert-location}

응답의 `Location` 헤더에 지정한 URI 값이 있는지 단언합니다:

```php
$response->assertLocation($uri);
```


#### assertContent {#assert-content}

주어진 문자열이 응답 내용과 일치하는지 단언합니다:

```php
$response->assertContent($value);
```


#### assertNoContent {#assert-no-content}

응답이 지정된 HTTP 상태 코드를 가지며 내용이 없음을 단언합니다:

```php
$response->assertNoContent($status = 204);
```


#### assertStreamed {#assert-streamed}

응답이 스트림된 응답임을 단언합니다:

    $response->assertStreamed();


#### assertStreamedContent {#assert-streamed-content}

주어진 문자열이 스트림된 응답 내용과 일치하는지 단언합니다:

```php
$response->assertStreamedContent($value);
```


#### assertNotFound {#assert-not-found}

응답이 찾을 수 없음(404) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertNotFound();
```


#### assertOk {#assert-ok}

응답이 200 HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertOk();
```


#### assertPaymentRequired {#assert-payment-required}

응답이 결제 필요(402) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertPaymentRequired();
```


#### assertPlainCookie {#assert-plain-cookie}

응답에 주어진 암호화되지 않은 쿠키가 포함되어 있는지 단언합니다:

```php
$response->assertPlainCookie($cookieName, $value = null);
```


#### assertRedirect {#assert-redirect}

응답이 주어진 URI로 리다이렉트되는지 단언합니다:

```php
$response->assertRedirect($uri = null);
```


#### assertRedirectBack {#assert-redirect-back}

응답이 이전 페이지로 리디렉션되는지 확인합니다:

```php
$response->assertRedirectBack();
```


#### assertRedirectContains {#assert-redirect-contains}

응답이 주어진 문자열을 포함하는 URI로 리디렉션되는지 확인합니다:

```php
$response->assertRedirectContains($string);
```


#### assertRedirectToRoute {#assert-redirect-to-route}

응답이 주어진 [네임드 라우트](/laravel/12.x/routing#named-routes)로 리다이렉트되는지 단언합니다:

```php
$response->assertRedirectToRoute($name, $parameters = []);
```


#### assertRedirectToSignedRoute {#assert-redirect-to-signed-route}

응답이 주어진 [서명된 라우트](/laravel/12.x/urls#signed-urls)로 리디렉션되는지 단언합니다:

```php
$response->assertRedirectToSignedRoute($name = null, $parameters = []);
```


#### assertRequestTimeout {#assert-request-timeout}

응답이 요청 시간 초과(408) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertRequestTimeout();
```


#### assertSee {#assert-see}

응답에 주어진 문자열이 포함되어 있는지 단언합니다. 이 단언은 두 번째 인수로 `false`를 전달하지 않는 한, 주어진 문자열을 자동으로 이스케이프합니다:

```php
$response->assertSee($value, $escape = true);
```


#### assertSeeInOrder {#assert-see-in-order}

응답 내에 주어진 문자열들이 순서대로 포함되어 있는지 단언합니다. 이 단언은 두 번째 인자로 `false`를 전달하지 않는 한, 주어진 문자열들을 자동으로 이스케이프합니다:

```php
$response->assertSeeInOrder(array $values, $escape = true);
```


#### assertSeeText {#assert-see-text}

응답 텍스트에 주어진 문자열이 포함되어 있는지 확인합니다. 이 어설션은 두 번째 인자로 `false`를 전달하지 않는 한, 주어진 문자열을 자동으로 이스케이프합니다. 어설션이 실행되기 전에 응답 내용은 `strip_tags` PHP 함수에 전달됩니다:

```php
$response->assertSeeText($value, $escape = true);
```


#### assertSeeTextInOrder {#assert-see-text-in-order}

응답 텍스트 내에 주어진 문자열들이 순서대로 포함되어 있는지 단언합니다. 이 단언은 두 번째 인자로 `false`를 전달하지 않는 한, 주어진 문자열들을 자동으로 이스케이프합니다. 단언이 실행되기 전에 응답 내용은 `strip_tags` PHP 함수에 전달됩니다:

```php
$response->assertSeeTextInOrder(array $values, $escape = true);
```


#### assertServerError {#assert-server-error}

응답이 서버 오류(HTTP 상태 코드가 500 이상, 600 미만)임을 단언합니다:

```php
$response->assertServerError();
```


#### assertServiceUnavailable {#assert-service-unavailable}

응답이 "Service Unavailable"(503) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertServiceUnavailable();
```


#### assertSessionHas {#assert-session-has}

세션에 주어진 데이터가 포함되어 있는지 단언합니다:

```php
$response->assertSessionHas($key, $value = null);
```

필요하다면, `assertSessionHas` 메서드의 두 번째 인자로 클로저를 전달할 수 있습니다. 클로저가 `true`를 반환하면 단언이 통과합니다:

```php
$response->assertSessionHas($key, function (User $value) {
    return $value->name === 'Taylor Otwell';
});
```


#### assertSessionHasInput {#assert-session-has-input}

[플래시된 입력 배열](/laravel/12.x/responses#redirecting-with-flashed-session-data)에 주어진 값이 세션에 있는지 단언합니다:

```php
$response->assertSessionHasInput($key, $value = null);
```

필요하다면, `assertSessionHasInput` 메서드의 두 번째 인자로 클로저를 전달할 수 있습니다. 클로저가 `true`를 반환하면 단언이 통과합니다:

```php
use Illuminate\Support\Facades\Crypt;

$response->assertSessionHasInput($key, function (string $value) {
    return Crypt::decryptString($value) === 'secret';
});
```


#### assertSessionHasAll {#assert-session-has-all}

세션에 주어진 키 / 값 쌍의 배열이 포함되어 있는지 단언합니다:

```php
$response->assertSessionHasAll(array $data);
```

예를 들어, 애플리케이션의 세션에 `name`과 `status` 키가 포함되어 있다면, 다음과 같이 두 값이 모두 존재하고 지정된 값을 가지고 있는지 단언할 수 있습니다:

```php
$response->assertSessionHasAll([
    'name' => 'Taylor Otwell',
    'status' => 'active',
]);
```


#### assertSessionHasErrors {#assert-session-has-errors}

세션에 주어진 `$keys`에 대한 에러가 포함되어 있는지 단언합니다. `$keys`가 연관 배열인 경우, 세션에 각 필드(키)에 대해 특정 에러 메시지(값)가 포함되어 있는지 단언합니다. 이 메서드는 검증 에러가 JSON 구조로 반환되는 대신 세션에 플래시되는 라우트를 테스트할 때 사용해야 합니다:

```php
$response->assertSessionHasErrors(
    array $keys = [], $format = null, $errorBag = 'default'
);
```

예를 들어, `name`과 `email` 필드에 대한 검증 에러 메시지가 세션에 플래시되었는지 단언하려면, 다음과 같이 `assertSessionHasErrors` 메서드를 호출할 수 있습니다:

```php
$response->assertSessionHasErrors(['name', 'email']);
```

또는, 특정 필드에 대해 특정 검증 에러 메시지가 있는지 단언할 수도 있습니다:

```php
$response->assertSessionHasErrors([
    'name' => 'The given name was invalid.'
]);
```

> [!NOTE]
> 더 일반적인 [assertInvalid](#assert-invalid) 메서드는 응답에 검증 에러가 JSON으로 반환되었는지 **또는** 에러가 세션 스토리지에 플래시되었는지 단언하는 데 사용할 수 있습니다.


#### assertSessionHasErrorsIn {#assert-session-has-errors-in}

세션이 특정 [에러 백](/laravel/12.x/validation#named-error-bags) 내에서 주어진 `$keys`에 대한 에러를 포함하고 있는지 단언합니다. `$keys`가 연관 배열인 경우, 에러 백 내에서 각 필드(키)에 대해 특정 에러 메시지(값)가 세션에 포함되어 있는지 단언합니다:

```php
$response->assertSessionHasErrorsIn($errorBag, $keys = [], $format = null);
```


#### assertSessionHasNoErrors {#assert-session-has-no-errors}

세션에 유효성 검사 오류가 없는지 확인합니다:

```php
$response->assertSessionHasNoErrors();
```


#### assertSessionDoesntHaveErrors {#assert-session-doesnt-have-errors}

지정된 키에 대해 세션에 유효성 검사 오류가 없는지 단언합니다:

```php
$response->assertSessionDoesntHaveErrors($keys = [], $format = null, $errorBag = 'default');
```

> [!NOTE]
> 더 일반적인 [assertValid](#assert-valid) 메서드는 응답에 JSON으로 반환된 유효성 검사 오류가 없고, 세션 저장소에 오류가 플래시되지 않았음을 단언하는 데 사용할 수 있습니다.


#### assertSessionMissing {#assert-session-missing}

세션에 주어진 키가 존재하지 않음을 단언합니다:

```php
$response->assertSessionMissing($key);
```


#### assertStatus {#assert-status}

응답이 지정된 HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertStatus($code);
```


#### assertSuccessful {#assert-successful}

응답이 성공적인(>= 200 그리고 < 300) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertSuccessful();
```


#### assertTooManyRequests {#assert-too-many-requests}

응답이 너무 많은 요청(429) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertTooManyRequests();
```


#### assertUnauthorized {#assert-unauthorized}

응답이 인증되지 않음(401) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertUnauthorized();
```


#### assertUnprocessable {#assert-unprocessable}

응답이 처리할 수 없는 엔터티(422) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertUnprocessable();
```


#### assertUnsupportedMediaType {#assert-unsupported-media-type}

응답이 지원되지 않는 미디어 타입(415) HTTP 상태 코드를 가지고 있는지 단언합니다:

```php
$response->assertUnsupportedMediaType();
```


#### assertValid {#assert-valid}

응답에 주어진 키에 대한 유효성 검사 오류가 없는지 단언합니다. 이 메서드는 유효성 검사 오류가 JSON 구조로 반환되거나, 유효성 검사 오류가 세션에 플래시된 응답에 대해 단언할 때 사용할 수 있습니다:

```php
// 유효성 검사 오류가 없는지 단언...
$response->assertValid();

// 주어진 키에 유효성 검사 오류가 없는지 단언...
$response->assertValid(['name', 'email']);
```


#### assertInvalid {#assert-invalid}

응답에 주어진 키에 대한 유효성 검사 오류가 있는지 확인합니다. 이 메서드는 유효성 검사 오류가 JSON 구조로 반환되거나, 유효성 검사 오류가 세션에 플래시된 응답에 대해 단언할 때 사용할 수 있습니다:

```php
$response->assertInvalid(['name', 'email']);
```

특정 키에 대해 특정 유효성 검사 오류 메시지가 있는지 단언할 수도 있습니다. 이때 전체 메시지 또는 메시지의 일부만 제공할 수 있습니다:

```php
$response->assertInvalid([
    'name' => 'The name field is required.',
    'email' => 'valid email address',
]);
```

주어진 필드만 유효성 검사 오류가 있는지 단언하고 싶다면, `assertOnlyInvalid` 메서드를 사용할 수 있습니다:

```php
$response->assertOnlyInvalid(['name', 'email']);
```


#### assertViewHas {#assert-view-has}

응답 뷰에 특정 데이터가 포함되어 있는지 단언합니다:

```php
$response->assertViewHas($key, $value = null);
```

`assertViewHas` 메서드의 두 번째 인수로 클로저를 전달하면, 특정 뷰 데이터에 대해 검사하고 단언할 수 있습니다:

```php
$response->assertViewHas('user', function (User $user) {
    return $user->name === 'Taylor';
});
```

또한, 뷰 데이터는 응답에서 배열 변수처럼 접근할 수 있으므로, 편리하게 데이터를 검사할 수 있습니다:

```php tab=Pest
expect($response['name'])->toBe('Taylor');
```

```php tab=PHPUnit
$this->assertEquals('Taylor', $response['name']);
```


#### assertViewHasAll {#assert-view-has-all}

응답 뷰에 주어진 데이터 목록이 있는지 단언합니다:

```php
$response->assertViewHasAll(array $data);
```

이 메서드는 뷰에 단순히 주어진 키와 일치하는 데이터가 포함되어 있는지 단언할 때 사용할 수 있습니다:

```php
$response->assertViewHasAll([
    'name',
    'email',
]);
```

또는, 뷰 데이터가 존재하며 특정 값을 가지고 있는지 단언할 수도 있습니다:

```php
$response->assertViewHasAll([
    'name' => 'Taylor Otwell',
    'email' => 'taylor@example.com,',
]);
```


#### assertViewIs {#assert-view-is}

지정된 뷰가 라우트에 의해 반환되었는지 단언합니다:

```php
$response->assertViewIs($value);
```


#### assertViewMissing {#assert-view-missing}

애플리케이션의 응답에서 반환된 뷰에 지정된 데이터 키가 제공되지 않았는지 확인합니다:

```php
$response->assertViewMissing($key);
```


### 인증 어서션 {#authentication-assertions}

Laravel은 애플리케이션의 기능 테스트에서 사용할 수 있는 다양한 인증 관련 어서션도 제공합니다. 이 메서드들은 `get` 및 `post`와 같은 메서드에서 반환되는 `Illuminate\Testing\TestResponse` 인스턴스가 아니라, 테스트 클래스 자체에서 호출된다는 점에 유의하세요.


#### assertAuthenticated {#assert-authenticated}

사용자가 인증되었는지 단언합니다:

```php
$this->assertAuthenticated($guard = null);
```


#### assertGuest {#assert-guest}

사용자가 인증되지 않았는지 확인합니다:

```php
$this->assertGuest($guard = null);
```


#### assertAuthenticatedAs {#assert-authenticated-as}

특정 사용자가 인증되었는지 단언합니다:

```php
$this->assertAuthenticatedAs($user, $guard = null);
```


## 유효성 검사 어서션 {#validation-assertions}

라라벨은 요청에 제공된 데이터가 유효한지 또는 유효하지 않은지 확인할 수 있도록 두 가지 주요 유효성 검사 관련 어서션을 제공합니다.


#### assertValid {#validation-assert-valid}

지정된 키에 대해 응답에 유효성 검사 오류가 없는지 단언합니다. 이 메서드는 유효성 검사 오류가 JSON 구조로 반환되거나, 유효성 검사 오류가 세션에 플래시된 응답에 대해 단언할 때 사용할 수 있습니다:

```php
// 유효성 검사 오류가 없는지 단언...
$response->assertValid();

// 지정된 키에 유효성 검사 오류가 없는지 단언...
$response->assertValid(['name', 'email']);
```


#### assertInvalid {#validation-assert-invalid}

응답에 주어진 키에 대한 유효성 검사 오류가 있는지 단언합니다. 이 메서드는 유효성 검사 오류가 JSON 구조로 반환되거나, 유효성 검사 오류가 세션에 플래시된 응답에 대해 단언할 때 사용할 수 있습니다:

```php
$response->assertInvalid(['name', 'email']);
```

특정 키에 대해 특정 유효성 검사 오류 메시지가 있는지도 단언할 수 있습니다. 이때 전체 메시지를 제공하거나, 메시지의 일부분만 제공할 수도 있습니다:

```php
$response->assertInvalid([
    'name' => 'The name field is required.',
    'email' => 'valid email address',
]);
```
