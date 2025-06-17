# Redis












## 소개 {#introduction}

[Redis](https://redis.io)는 오픈 소스의 고급 키-값 저장소입니다. 키에 [문자열](https://redis.io/docs/data-types/strings/), [해시](https://redis.io/docs/data-types/hashes/), [리스트](https://redis.io/docs/data-types/lists/), [셋](https://redis.io/docs/data-types/sets/), [정렬된 셋](https://redis.io/docs/data-types/sorted-sets/) 등 다양한 데이터 구조를 저장할 수 있기 때문에 종종 데이터 구조 서버라고도 불립니다.

Laravel에서 Redis를 사용하기 전에, PECL을 통해 [PhpRedis](https://github.com/phpredis/phpredis) PHP 확장 프로그램을 설치하여 사용하는 것을 권장합니다. 이 확장 프로그램은 "유저랜드" PHP 패키지에 비해 설치가 더 복잡하지만, Redis를 많이 사용하는 애플리케이션에서는 더 나은 성능을 제공할 수 있습니다. [Laravel Sail](/laravel/12.x/sail)을 사용 중이라면, 이 확장 프로그램이 이미 애플리케이션의 Docker 컨테이너에 설치되어 있습니다.

PhpRedis 확장 프로그램을 설치할 수 없는 경우, Composer를 통해 `predis/predis` 패키지를 설치할 수 있습니다. Predis는 PHP로만 작성된 Redis 클라이언트로, 추가 확장 프로그램이 필요하지 않습니다:

```shell
composer require predis/predis:^2.0
```


## 설정 {#configuration}

애플리케이션의 Redis 설정은 `config/database.php` 설정 파일을 통해 구성할 수 있습니다. 이 파일 내에는 애플리케이션에서 사용하는 Redis 서버들을 포함하는 `redis` 배열이 있습니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'phpredis'),

    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
    ],

    'default' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
    ],

    'cache' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'username' => env('REDIS_USERNAME'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'),
    ],

],
```

설정 파일에 정의된 각 Redis 서버는 이름, 호스트, 포트를 반드시 가져야 하며, 단일 URL로 Redis 연결을 나타내는 경우에는 예외입니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'phpredis'),

    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
    ],

    'default' => [
        'url' => 'tcp://127.0.0.1:6379?database=0',
    ],

    'cache' => [
        'url' => 'tls://user:password@127.0.0.1:6380?database=1',
    ],

],
```


#### 연결 스킴 구성하기 {#configuring-the-connection-scheme}

기본적으로 Redis 클라이언트는 Redis 서버에 연결할 때 `tcp` 스킴을 사용합니다. 하지만, Redis 서버의 설정 배열에 `scheme` 구성 옵션을 지정하여 TLS / SSL 암호화를 사용할 수도 있습니다:

```php
'default' => [
    'scheme' => 'tls',
    'url' => env('REDIS_URL'),
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'username' => env('REDIS_USERNAME'),
    'password' => env('REDIS_PASSWORD'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_DB', '0'),
],
```


### 클러스터 {#clusters}

애플리케이션이 Redis 서버 클러스터를 사용하는 경우, 해당 클러스터를 Redis 설정의 `clusters` 키 내에 정의해야 합니다. 이 설정 키는 기본적으로 존재하지 않으므로, 애플리케이션의 `config/database.php` 설정 파일 내에 직접 생성해야 합니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'phpredis'),

    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
    ],

    'clusters' => [
        'default' => [
            [
                'url' => env('REDIS_URL'),
                'host' => env('REDIS_HOST', '127.0.0.1'),
                'username' => env('REDIS_USERNAME'),
                'password' => env('REDIS_PASSWORD'),
                'port' => env('REDIS_PORT', '6379'),
                'database' => env('REDIS_DB', '0'),
            ],
        ],
    ],

    // ...
],
```

기본적으로, Laravel은 `options.cluster` 설정 값이 `redis`로 지정되어 있기 때문에 네이티브 Redis 클러스터링을 사용합니다. Redis 클러스터링은 장애 조치를 원활하게 처리하므로 훌륭한 기본 옵션입니다.

Laravel은 또한 Predis를 사용할 때 클라이언트 측 샤딩도 지원합니다. 하지만 클라이언트 측 샤딩은 장애 조치를 처리하지 않으므로, 주로 다른 주요 데이터 저장소에서 가져올 수 있는 일시적인 캐시 데이터에 적합합니다.

네이티브 Redis 클러스터링 대신 클라이언트 측 샤딩을 사용하려면, 애플리케이션의 `config/database.php` 설정 파일에서 `options.cluster` 설정 값을 제거하면 됩니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'phpredis'),

    'clusters' => [
        // ...
    ],

    // ...
],
```


### Predis {#predis}

애플리케이션이 Predis 패키지를 통해 Redis와 상호작용하도록 하려면, `REDIS_CLIENT` 환경 변수의 값이 `predis`로 설정되어 있는지 확인해야 합니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'predis'),

    // ...
],
```

기본 설정 옵션 외에도, Predis는 각 Redis 서버에 대해 정의할 수 있는 추가 [연결 파라미터](https://github.com/nrk/predis/wiki/Connection-Parameters)를 지원합니다. 이러한 추가 설정 옵션을 사용하려면, 애플리케이션의 `config/database.php` 설정 파일에서 Redis 서버 설정에 해당 옵션을 추가하면 됩니다:

```php
'default' => [
    'url' => env('REDIS_URL'),
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'username' => env('REDIS_USERNAME'),
    'password' => env('REDIS_PASSWORD'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_DB', '0'),
    'read_write_timeout' => 60,
],
```


### PhpRedis {#phpredis}

기본적으로 Laravel은 Redis와 통신하기 위해 PhpRedis 확장 프로그램을 사용합니다. Laravel이 Redis와 통신할 때 사용할 클라이언트는 `redis.client` 설정 옵션의 값에 의해 결정되며, 이는 일반적으로 `REDIS_CLIENT` 환경 변수의 값을 반영합니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'phpredis'),

    // ...
],
```

기본 설정 옵션 외에도, PhpRedis는 다음과 같은 추가 연결 매개변수를 지원합니다: `name`, `persistent`, `persistent_id`, `prefix`, `read_timeout`, `retry_interval`, `max_retries`, `backoff_algorithm`, `backoff_base`, `backoff_cap`, `timeout`, 그리고 `context`. 이 옵션들 중 원하는 것을 `config/database.php` 설정 파일의 Redis 서버 설정에 추가할 수 있습니다:

```php
'default' => [
    'url' => env('REDIS_URL'),
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'username' => env('REDIS_USERNAME'),
    'password' => env('REDIS_PASSWORD'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_DB', '0'),
    'read_timeout' => 60,
    'context' => [
        // 'auth' => ['username', 'secret'],
        // 'stream' => ['verify_peer' => false],
    ],
],
```


#### 유닉스 소켓 연결 {#unix-socket-connections}

Redis 연결은 TCP 대신 유닉스 소켓을 사용하도록 구성할 수도 있습니다. 이는 애플리케이션과 동일한 서버에 있는 Redis 인스턴스에 대한 연결에서 TCP 오버헤드를 제거하여 성능을 향상시킬 수 있습니다. Redis가 유닉스 소켓을 사용하도록 구성하려면, `REDIS_HOST` 환경 변수를 Redis 소켓의 경로로 설정하고, `REDIS_PORT` 환경 변수를 `0`으로 설정하세요:

```env
REDIS_HOST=/run/redis/redis.sock
REDIS_PORT=0
```


#### PhpRedis 직렬화 및 압축 {#phpredis-serialization}

PhpRedis 확장 프로그램은 다양한 직렬화 및 압축 알고리즘을 사용하도록 구성할 수 있습니다. 이러한 알고리즘은 Redis 설정의 `options` 배열을 통해 구성할 수 있습니다:

```php
'redis' => [

    'client' => env('REDIS_CLIENT', 'phpredis'),

    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        'serializer' => Redis::SERIALIZER_MSGPACK,
        'compression' => Redis::COMPRESSION_LZ4,
    ],

    // ...
],
```

현재 지원되는 직렬화기는 다음과 같습니다: `Redis::SERIALIZER_NONE` (기본값), `Redis::SERIALIZER_PHP`, `Redis::SERIALIZER_JSON`, `Redis::SERIALIZER_IGBINARY`, 그리고 `Redis::SERIALIZER_MSGPACK`.

지원되는 압축 알고리즘은 다음과 같습니다: `Redis::COMPRESSION_NONE` (기본값), `Redis::COMPRESSION_LZF`, `Redis::COMPRESSION_ZSTD`, 그리고 `Redis::COMPRESSION_LZ4`.


## Redis와 상호작용하기 {#interacting-with-redis}

여러분은 `Redis` [파사드](/laravel/12.x/facades)의 다양한 메서드를 호출하여 Redis와 상호작용할 수 있습니다. `Redis` 파사드는 동적 메서드를 지원하므로, 파사드에서 어떤 [Redis 명령어](https://redis.io/commands)든 호출할 수 있으며 해당 명령어가 직접 Redis로 전달됩니다. 이 예제에서는 `Redis` 파사드의 `get` 메서드를 호출하여 Redis의 `GET` 명령어를 실행합니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redis;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 주어진 사용자의 프로필을 보여줍니다.
     */
    public function show(string $id): View
    {
        return view('user.profile', [
            'user' => Redis::get('user:profile:'.$id)
        ]);
    }
}
```

위에서 언급했듯이, 여러분은 `Redis` 파사드에서 Redis의 어떤 명령어든 호출할 수 있습니다. Laravel은 매직 메서드를 사용하여 명령어를 Redis 서버로 전달합니다. 만약 Redis 명령어가 인자를 기대한다면, 해당 인자들을 파사드의 해당 메서드에 전달하면 됩니다:

```php
use Illuminate\Support\Facades\Redis;

Redis::set('name', 'Taylor');

$values = Redis::lrange('names', 5, 10);
```

또는, `Redis` 파사드의 `command` 메서드를 사용하여 명령어를 서버에 전달할 수도 있습니다. 이 메서드는 첫 번째 인자로 명령어의 이름을, 두 번째 인자로 값의 배열을 받습니다:

```php
$values = Redis::command('lrange', ['name', 5, 10]);
```


#### 여러 Redis 연결 사용하기 {#using-multiple-redis-connections}

애플리케이션의 `config/database.php` 설정 파일에서는 여러 개의 Redis 연결/서버를 정의할 수 있습니다. 특정 Redis 연결에 접속하려면 `Redis` 파사드의 `connection` 메서드를 사용할 수 있습니다:

```php
$redis = Redis::connection('connection-name');
```

기본 Redis 연결 인스턴스를 얻으려면, 추가 인자 없이 `connection` 메서드를 호출하면 됩니다:

```php
$redis = Redis::connection();
```


### 트랜잭션 {#transactions}

`Redis` 파사드의 `transaction` 메서드는 Redis의 기본 `MULTI` 및 `EXEC` 명령어를 간편하게 감싸주는 래퍼를 제공합니다. `transaction` 메서드는 클로저를 유일한 인수로 받습니다. 이 클로저는 Redis 연결 인스턴스를 전달받으며, 이 인스턴스에 원하는 모든 명령을 실행할 수 있습니다. 클로저 내에서 실행된 모든 Redis 명령은 하나의 원자적 트랜잭션으로 실행됩니다:

```php
use Redis;
use Illuminate\Support\Facades;

Facades\Redis::transaction(function (Redis $redis) {
    $redis->incr('user_visits', 1);
    $redis->incr('total_visits', 1);
});
```

> [!WARNING]
> Redis 트랜잭션을 정의할 때는 Redis 연결에서 값을 조회할 수 없습니다. 트랜잭션은 하나의 원자적 연산으로 실행되며, 클로저 내의 모든 명령이 실행을 마칠 때까지 실제로 실행되지 않는다는 점을 기억하세요.

#### Lua 스크립트

`eval` 메서드는 여러 Redis 명령을 단일 원자적(atomic) 작업으로 실행할 수 있는 또 다른 방법을 제공합니다. 하지만 `eval` 메서드는 해당 작업 중에 Redis 키 값을 조회하고 조작할 수 있다는 장점이 있습니다. Redis 스크립트는 [Lua 프로그래밍 언어](https://www.lua.org)로 작성됩니다.

`eval` 메서드는 처음에는 다소 어렵게 느껴질 수 있지만, 간단한 예제를 통해 쉽게 이해할 수 있습니다. `eval` 메서드는 여러 인자를 기대합니다. 먼저, Lua 스크립트(문자열)를 메서드에 전달해야 합니다. 두 번째로, 스크립트가 조작할 키의 개수(정수)를 전달해야 합니다. 세 번째로, 해당 키들의 이름을 전달해야 합니다. 마지막으로, 스크립트 내에서 접근해야 하는 추가 인자가 있다면 함께 전달할 수 있습니다.

이 예제에서는 카운터를 증가시키고, 그 새로운 값을 확인한 뒤, 첫 번째 카운터의 값이 5보다 크면 두 번째 카운터도 증가시킵니다. 마지막으로 첫 번째 카운터의 값을 반환합니다:

```php
$value = Redis::eval(<<<'LUA'
    local counter = redis.call("incr", KEYS[1])

    if counter > 5 then
        redis.call("incr", KEYS[2])
    end

    return counter
LUA, 2, 'first-counter', 'second-counter');
```

> [!WARNING]
> Redis 스크립팅에 대한 더 자세한 내용은 [Redis 공식 문서](https://redis.io/commands/eval)를 참고하세요.


### 파이프라이닝 명령어 {#pipelining-commands}

때때로 여러 개의 Redis 명령어를 실행해야 할 때가 있습니다. 각 명령어마다 Redis 서버로 네트워크 요청을 보내는 대신, `pipeline` 메서드를 사용할 수 있습니다. `pipeline` 메서드는 하나의 인자를 받는데, 이 인자는 Redis 인스턴스를 전달받는 클로저입니다. 이 Redis 인스턴스에 모든 명령어를 전달하면, 해당 명령어들이 한 번에 Redis 서버로 전송되어 네트워크 요청 횟수를 줄일 수 있습니다. 명령어들은 여전히 작성된 순서대로 실행됩니다:

```php
use Redis;
use Illuminate\Support\Facades;

Facades\Redis::pipeline(function (Redis $pipe) {
    for ($i = 0; $i < 1000; $i++) {
        $pipe->set("key:$i", $i);
    }
});
```


## Pub / Sub {#pubsub}

Laravel은 Redis의 `publish` 및 `subscribe` 명령어에 대한 편리한 인터페이스를 제공합니다. 이 Redis 명령어들은 특정 "채널"에서 메시지를 수신 대기할 수 있게 해줍니다. 다른 애플리케이션이나 심지어 다른 프로그래밍 언어를 사용하여 채널에 메시지를 발행할 수 있으므로, 애플리케이션과 프로세스 간의 손쉬운 통신이 가능합니다.

먼저, `subscribe` 메서드를 사용하여 채널 리스너를 설정해봅시다. `subscribe` 메서드 호출은 장시간 실행되는 프로세스를 시작하므로, 이 메서드 호출을 [Artisan 커맨드](/laravel/12.x/artisan) 내에 배치하겠습니다:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisSubscribe extends Command
{
    /**
     * 콘솔 커맨드의 이름과 시그니처입니다.
     *
     * @var string
     */
    protected $signature = 'redis:subscribe';

    /**
     * 콘솔 커맨드 설명입니다.
     *
     * @var string
     */
    protected $description = 'Redis 채널을 구독합니다';

    /**
     * 콘솔 커맨드를 실행합니다.
     */
    public function handle(): void
    {
        Redis::subscribe(['test-channel'], function (string $message) {
            echo $message;
        });
    }
}
```

이제 `publish` 메서드를 사용하여 채널에 메시지를 발행할 수 있습니다:

```php
use Illuminate\Support\Facades\Redis;

Route::get('/publish', function () {
    // ...

    Redis::publish('test-channel', json_encode([
        'name' => 'Adam Wathan'
    ]));
});
```


#### 와일드카드 구독 {#wildcard-subscriptions}

`psubscribe` 메서드를 사용하면 와일드카드 채널에 구독할 수 있습니다. 이는 모든 채널의 모든 메시지를 수신해야 할 때 유용할 수 있습니다. 채널 이름은 제공된 클로저의 두 번째 인수로 전달됩니다:

```php
Redis::psubscribe(['*'], function (string $message, string $channel) {
    echo $message;
});

Redis::psubscribe(['users.*'], function (string $message, string $channel) {
    echo $message;
});
```
