# HTTP 세션
















## 소개 {#introduction}

HTTP 기반 애플리케이션은 상태를 저장하지 않기 때문에, 세션은 여러 요청에 걸쳐 사용자에 대한 정보를 저장하는 방법을 제공합니다. 이러한 사용자 정보는 일반적으로 이후의 요청에서도 접근할 수 있는 영속적인 저장소/백엔드에 저장됩니다.

Laravel은 다양한 세션 백엔드를 제공하며, 이를 표현력 있고 통합된 API를 통해 사용할 수 있습니다. [Memcached](https://memcached.org), [Redis](https://redis.io), 데이터베이스 등과 같은 인기 있는 백엔드에 대한 지원도 포함되어 있습니다.


### 설정 {#configuration}

애플리케이션의 세션 설정 파일은 `config/session.php`에 저장되어 있습니다. 이 파일에서 제공되는 다양한 옵션을 꼭 확인하세요. 기본적으로 Laravel은 `database` 세션 드라이버를 사용하도록 설정되어 있습니다.

세션의 `driver` 설정 옵션은 각 요청에 대해 세션 데이터가 어디에 저장될지를 정의합니다. Laravel은 다양한 드라이버를 제공합니다:

<div class="content-list" markdown="1">

- `file` - 세션이 `storage/framework/sessions`에 저장됩니다.
- `cookie` - 세션이 보안이 유지되고 암호화된 쿠키에 저장됩니다.
- `database` - 세션이 관계형 데이터베이스에 저장됩니다.
- `memcached` / `redis` - 세션이 빠른 캐시 기반 저장소인 memcached 또는 redis에 저장됩니다.
- `dynamodb` - 세션이 AWS DynamoDB에 저장됩니다.
- `array` - 세션이 PHP 배열에 저장되며, 영구적으로 저장되지 않습니다.

</div>

> [!NOTE]
> array 드라이버는 주로 [테스트](/docs/{{version}}/testing) 시에 사용되며, 세션에 저장된 데이터가 영구적으로 저장되지 않도록 합니다.


### 드라이버 필수 조건 {#driver-prerequisites}


#### 데이터베이스 {#database}

`database` 세션 드라이버를 사용할 때는 세션 데이터를 저장할 데이터베이스 테이블이 필요합니다. 일반적으로 이 테이블은 Laravel의 기본 `0001_01_01_000000_create_users_table.php` [데이터베이스 마이그레이션](/docs/{{version}}/migrations)에 포함되어 있습니다. 그러나 어떤 이유로든 `sessions` 테이블이 없다면, `make:session-table` Artisan 명령어를 사용하여 해당 마이그레이션을 생성할 수 있습니다:

```shell
php artisan make:session-table

php artisan migrate
```


#### Redis {#redis}

Laravel에서 Redis 세션을 사용하기 전에 PECL을 통해 PhpRedis PHP 확장 프로그램을 설치하거나 Composer를 통해 `predis/predis` 패키지(~1.0)를 설치해야 합니다. Redis 설정에 대한 자세한 내용은 Laravel의 [Redis 문서](/docs/{{version}}/redis#configuration)를 참고하세요.

> [!NOTE]
> `SESSION_CONNECTION` 환경 변수 또는 `session.php` 설정 파일의 `connection` 옵션을 사용하여 세션 저장에 사용할 Redis 연결을 지정할 수 있습니다.


## 세션과 상호작용하기 {#interacting-with-the-session}


### 데이터 조회 {#retrieving-data}

Laravel에서 세션 데이터를 다루는 주요 방법은 두 가지가 있습니다: 전역 `session` 헬퍼를 사용하는 방법과 `Request` 인스턴스를 사용하는 방법입니다. 먼저, 라우트 클로저나 컨트롤러 메서드에서 타입힌트로 주입받을 수 있는 `Request` 인스턴스를 통해 세션에 접근하는 방법을 살펴보겠습니다. 참고로, 컨트롤러 메서드의 의존성은 Laravel [서비스 컨테이너](/docs/{{version}}/container)를 통해 자동으로 주입됩니다.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 주어진 사용자의 프로필을 보여줍니다.
     */
    public function show(Request $request, string $id): View
    {
        $value = $request->session()->get('key');

        // ...

        $user = $this->users->find($id);

        return view('user.profile', ['user' => $user]);
    }
}
```

세션에서 항목을 조회할 때, `get` 메서드의 두 번째 인자로 기본값을 전달할 수 있습니다. 지정한 키가 세션에 존재하지 않으면 이 기본값이 반환됩니다. 만약 기본값으로 클로저를 전달하면, 요청한 키가 존재하지 않을 때 해당 클로저가 실행되고 그 결과가 반환됩니다.

```php
$value = $request->session()->get('key', 'default');

$value = $request->session()->get('key', function () {
    return 'default';
});
```


#### 글로벌 세션 헬퍼 {#the-global-session-helper}

세션에 데이터를 저장하거나 조회할 때 글로벌 `session` PHP 함수를 사용할 수도 있습니다. `session` 헬퍼에 문자열 하나만 인자로 전달하면 해당 세션 키의 값을 반환합니다. 키/값 쌍의 배열을 전달하면 해당 값들이 세션에 저장됩니다:

```php
Route::get('/home', function () {
    // 세션에서 데이터를 조회합니다...
    $value = session('key');

    // 기본값을 지정할 수도 있습니다...
    $value = session('key', 'default');

    // 세션에 데이터를 저장합니다...
    session(['key' => 'value']);
});
```

> [!NOTE]
> HTTP 요청 인스턴스를 통해 세션을 사용하는 것과 글로벌 `session` 헬퍼를 사용하는 것 사이에는 실질적인 차이가 거의 없습니다. 두 방법 모두 모든 테스트 케이스에서 사용할 수 있는 `assertSessionHas` 메서드를 통해 [테스트](https://laravel.com/docs/{{version}}/testing)할 수 있습니다.


#### 모든 세션 데이터 가져오기 {#retrieving-all-session-data}

세션에 저장된 모든 데이터를 가져오고 싶다면, `all` 메서드를 사용할 수 있습니다:

```php
$data = $request->session()->all();
```


#### 세션 데이터의 일부 가져오기 {#retrieving-a-portion-of-the-session-data}

`only`와 `except` 메서드를 사용하여 세션 데이터의 일부만 선택적으로 가져올 수 있습니다:

```php
$data = $request->session()->only(['username', 'email']);

$data = $request->session()->except(['username', 'email']);
```


#### 세션에 항목이 존재하는지 확인하기 {#determining-if-an-item-exists-in-the-session}

세션에 특정 항목이 존재하는지 확인하려면 `has` 메서드를 사용할 수 있습니다. `has` 메서드는 해당 항목이 존재하고 값이 `null`이 아닐 때 `true`를 반환합니다:

```php
if ($request->session()->has('users')) {
    // ...
}
```

세션에 항목이 존재하는지만 확인하고, 값이 `null`이어도 상관없다면 `exists` 메서드를 사용할 수 있습니다:

```php
if ($request->session()->exists('users')) {
    // ...
}
```

세션에 항목이 존재하지 않는지 확인하려면 `missing` 메서드를 사용할 수 있습니다. `missing` 메서드는 해당 항목이 존재하지 않을 때 `true`를 반환합니다:

```php
if ($request->session()->missing('users')) {
    // ...
}
```


### 데이터 저장 {#storing-data}

세션에 데이터를 저장하려면 일반적으로 요청 인스턴스의 `put` 메서드나 전역 `session` 헬퍼를 사용합니다:

```php
// 요청 인스턴스를 통해...
$request->session()->put('key', 'value');

// 전역 "session" 헬퍼를 통해...
session(['key' => 'value']);
```


#### 배열 세션 값에 값 추가하기 {#pushing-to-array-session-values}

`push` 메서드는 배열인 세션 값에 새로운 값을 추가할 때 사용할 수 있습니다. 예를 들어, `user.teams` 키에 팀 이름들의 배열이 저장되어 있다면, 아래와 같이 배열에 새로운 값을 추가할 수 있습니다:

```php
$request->session()->push('user.teams', 'developers');
```


#### 항목 조회 및 삭제 {#retrieving-deleting-an-item}

`pull` 메서드는 세션에서 항목을 한 번에 조회하고 삭제합니다:

```php
$value = $request->session()->pull('key', 'default');
```


#### 세션 값 증가 및 감소 {#incrementing-and-decrementing-session-values}

세션 데이터에 증가시키거나 감소시키고 싶은 정수 값이 있다면, `increment`와 `decrement` 메서드를 사용할 수 있습니다:

```php
$request->session()->increment('count');

$request->session()->increment('count', $incrementBy = 2);

$request->session()->decrement('count');

$request->session()->decrement('count', $decrementBy = 2);
```


### 플래시 데이터 {#flash-data}

때때로 다음 요청에서만 세션에 항목을 저장하고 싶을 때가 있습니다. 이럴 때는 `flash` 메서드를 사용할 수 있습니다. 이 메서드를 통해 세션에 저장된 데이터는 즉시 사용 가능하며, 다음 HTTP 요청 동안에도 유지됩니다. 이후의 HTTP 요청에서는 플래시 데이터가 삭제됩니다. 플래시 데이터는 주로 짧은 상태 메시지를 전달할 때 유용합니다:

```php
$request->session()->flash('status', '작업이 성공적으로 완료되었습니다!');
```

플래시 데이터를 여러 요청에 걸쳐 유지해야 한다면, `reflash` 메서드를 사용할 수 있습니다. 이 메서드는 모든 플래시 데이터를 한 번 더 요청이 유지되도록 해줍니다. 특정 플래시 데이터만 유지하고 싶다면, `keep` 메서드를 사용할 수 있습니다:

```php
$request->session()->reflash();

$request->session()->keep(['username', 'email']);
```

플래시 데이터를 현재 요청에서만 유지하고 싶다면, `now` 메서드를 사용할 수 있습니다:

```php
$request->session()->now('status', '작업이 성공적으로 완료되었습니다!');
```


### 데이터 삭제 {#deleting-data}

`forget` 메서드는 세션에서 특정 데이터를 제거합니다. 세션의 모든 데이터를 제거하고 싶다면 `flush` 메서드를 사용할 수 있습니다:

```php
// 단일 키 삭제...
$request->session()->forget('name');

// 여러 키 삭제...
$request->session()->forget(['name', 'status']);

$request->session()->flush();
```


### 세션 ID 재생성 {#regenerating-the-session-id}

세션 ID를 재생성하는 것은 악의적인 사용자가 애플리케이션에서 [세션 고정(Session Fixation)](https://owasp.org/www-community/attacks/Session_fixation) 공격을 악용하는 것을 방지하기 위해 자주 수행됩니다.

Laravel은 [애플리케이션 스타터 키트](/docs/{{version}}/starter-kits)나 [Laravel Fortify](/docs/{{version}}/fortify)를 사용하는 경우 인증 시 자동으로 세션 ID를 재생성합니다. 그러나 세션 ID를 수동으로 재생성해야 하는 경우, `regenerate` 메서드를 사용할 수 있습니다:

```php
$request->session()->regenerate();
```

세션 ID를 재생성함과 동시에 세션의 모든 데이터를 한 번에 삭제하려면, `invalidate` 메서드를 사용할 수 있습니다:

```php
$request->session()->invalidate();
```


## 세션 블로킹 {#session-blocking}

> [!WARNING]
> 세션 블로킹을 사용하려면, 애플리케이션에서 [원자적 락](/docs/{{version}}/cache#atomic-locks)을 지원하는 캐시 드라이버를 사용해야 합니다. 현재 지원되는 캐시 드라이버는 `memcached`, `dynamodb`, `redis`, `mongodb`(공식 `mongodb/laravel-mongodb` 패키지 포함), `database`, `file`, `array` 드라이버입니다. 또한, `cookie` 세션 드라이버는 사용할 수 없습니다.

기본적으로 Laravel은 동일한 세션을 사용하는 요청들이 동시에 실행되는 것을 허용합니다. 예를 들어, JavaScript HTTP 라이브러리를 사용해 두 개의 HTTP 요청을 애플리케이션에 보낼 경우, 두 요청이 동시에 처리됩니다. 대부분의 애플리케이션에서는 문제가 없지만, 서로 다른 엔드포인트에 동시에 요청을 보내고 두 엔드포인트 모두 세션에 데이터를 쓸 경우, 일부 애플리케이션에서는 세션 데이터 손실이 발생할 수 있습니다.

이를 방지하기 위해, Laravel은 특정 세션에 대해 동시 요청을 제한할 수 있는 기능을 제공합니다. 사용 방법은 간단히 라우트 정의에 `block` 메서드를 체이닝하면 됩니다. 아래 예시에서 `/profile` 엔드포인트로 들어오는 요청은 세션 락을 획득합니다. 이 락이 유지되는 동안, 동일한 세션 ID를 공유하는 `/profile` 또는 `/order` 엔드포인트로의 추가 요청은 첫 번째 요청이 실행을 마칠 때까지 대기하게 됩니다:

```php
Route::post('/profile', function () {
    // ...
})->block($lockSeconds = 10, $waitSeconds = 10);

Route::post('/order', function () {
    // ...
})->block($lockSeconds = 10, $waitSeconds = 10);
```

`block` 메서드는 두 개의 선택적 인자를 받습니다. 첫 번째 인자는 세션 락이 해제되기 전까지 최대 유지 시간(초)입니다. 물론, 요청이 이 시간보다 빨리 끝나면 락도 더 일찍 해제됩니다.

두 번째 인자는 세션 락을 획득하기 위해 요청이 대기할 최대 시간(초)입니다. 만약 지정한 시간 내에 세션 락을 획득하지 못하면 `Illuminate\Contracts\Cache\LockTimeoutException` 예외가 발생합니다.

이 두 인자 모두 생략하면, 락은 최대 10초 동안 유지되고, 락을 획득하기 위해 최대 10초 동안 대기합니다:

```php
Route::post('/profile', function () {
    // ...
})->block();
```


## 커스텀 세션 드라이버 추가하기 {#adding-custom-session-drivers}


### 드라이버 구현하기 {#implementing-the-driver}

기존의 세션 드라이버가 애플리케이션의 요구 사항에 맞지 않는 경우, Laravel에서는 직접 세션 핸들러를 작성할 수 있습니다. 커스텀 세션 드라이버는 PHP의 내장 `SessionHandlerInterface`를 구현해야 합니다. 이 인터페이스는 몇 가지 간단한 메서드만을 포함하고 있습니다. MongoDB를 예시로 한 기본 구현은 다음과 같습니다:

```php
<?php

namespace App\Extensions;

class MongoSessionHandler implements \SessionHandlerInterface
{
    public function open($savePath, $sessionName) {}
    public function close() {}
    public function read($sessionId) {}
    public function write($sessionId, $data) {}
    public function destroy($sessionId) {}
    public function gc($lifetime) {}
}
```

Laravel은 확장 기능을 위한 기본 디렉터리를 제공하지 않으므로, 원하는 위치에 자유롭게 파일을 둘 수 있습니다. 위 예시에서는 `Extensions` 디렉터리를 생성하여 `MongoSessionHandler`를 보관했습니다.

각 메서드의 목적이 바로 이해되지 않을 수 있으니, 아래에 각 메서드의 역할을 간단히 설명합니다:

<div class="content-list" markdown="1">

- `open` 메서드는 주로 파일 기반 세션 저장 시스템에서 사용됩니다. Laravel에는 이미 `file` 세션 드라이버가 포함되어 있으므로, 이 메서드에 별도의 구현이 필요 없는 경우가 많습니다. 비워 두어도 무방합니다.
- `close` 메서드 역시 `open`과 마찬가지로 대부분의 드라이버에서 무시해도 됩니다. 특별한 처리가 필요하지 않습니다.
- `read` 메서드는 주어진 `$sessionId`와 연관된 세션 데이터를 문자열로 반환해야 합니다. 세션 데이터를 가져오거나 저장할 때 별도의 직렬화나 인코딩을 할 필요는 없습니다. Laravel이 자동으로 직렬화를 처리해줍니다.
- `write` 메서드는 주어진 `$sessionId`와 연관된 `$data` 문자열을 MongoDB나 원하는 영구 저장소에 저장해야 합니다. 이때도 별도의 직렬화는 필요하지 않습니다. Laravel이 이미 처리합니다.
- `destroy` 메서드는 주어진 `$sessionId`와 연관된 데이터를 영구 저장소에서 삭제해야 합니다.
- `gc` 메서드는 주어진 `$lifetime`(UNIX 타임스탬프)보다 오래된 모든 세션 데이터를 삭제해야 합니다. Memcached나 Redis처럼 자동 만료 기능이 있는 시스템에서는 이 메서드를 비워 두어도 됩니다.

</div>


### 드라이버 등록하기 {#registering-the-driver}

드라이버 구현이 완료되면, 이제 Laravel에 드라이버를 등록할 준비가 된 것입니다. Laravel의 세션 백엔드에 추가 드라이버를 등록하려면, `Session` [파사드](/docs/{{version}}/facades)에서 제공하는 `extend` 메서드를 사용할 수 있습니다. 이 `extend` 메서드는 [서비스 프로바이더](/docs/{{version}}/providers)의 `boot` 메서드에서 호출해야 합니다. 기존의 `App\Providers\AppServiceProvider`에서 호출할 수도 있고, 별도의 프로바이더를 새로 만들어서 사용할 수도 있습니다:

```php
<?php

namespace App\Providers;

use App\Extensions\MongoSessionHandler;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class SessionServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 등록합니다.
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Session::extend('mongo', function (Application $app) {
            // SessionHandlerInterface의 구현체를 반환합니다...
            return new MongoSessionHandler;
        });
    }
}
```

세션 드라이버가 등록되면, `SESSION_DRIVER` 환경 변수나 애플리케이션의 `config/session.php` 설정 파일에서 세션 드라이버로 `mongo`를 지정할 수 있습니다.
