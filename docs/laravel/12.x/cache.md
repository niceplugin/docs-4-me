# 캐시




















## 소개 {#introduction}

애플리케이션에서 수행하는 일부 데이터 조회 또는 처리 작업은 CPU를 많이 사용하거나 완료하는 데 몇 초가 걸릴 수 있습니다. 이런 경우, 조회된 데이터를 일정 시간 동안 캐시에 저장하여 동일한 데이터에 대한 후속 요청 시 빠르게 가져올 수 있도록 하는 것이 일반적입니다. 캐시된 데이터는 보통 [Memcached](https://memcached.org)나 [Redis](https://redis.io)와 같은 매우 빠른 데이터 저장소에 저장됩니다.

다행히도, Laravel은 다양한 캐시 백엔드에 대해 표현력 있고 통합된 API를 제공하여, 이들의 빠른 데이터 조회 속도를 활용하고 웹 애플리케이션의 속도를 높일 수 있습니다.


## 설정 {#configuration}

애플리케이션의 캐시 설정 파일은 `config/cache.php`에 위치합니다. 이 파일에서 애플리케이션 전체에서 기본적으로 사용할 캐시 저장소를 지정할 수 있습니다. Laravel은 [Memcached](https://memcached.org), [Redis](https://redis.io), [DynamoDB](https://aws.amazon.com/dynamodb), 관계형 데이터베이스 등 인기 있는 캐시 백엔드를 기본적으로 지원합니다. 또한 파일 기반 캐시 드라이버도 제공되며, `array`와 `null` 캐시 드라이버는 자동화된 테스트에 편리한 캐시 백엔드를 제공합니다.

캐시 설정 파일에는 검토할 수 있는 다양한 옵션이 포함되어 있습니다. 기본적으로 Laravel은 `database` 캐시 드라이버를 사용하도록 설정되어 있으며, 이는 직렬화된 캐시 객체를 애플리케이션의 데이터베이스에 저장합니다.


### 드라이버 사전 준비 사항 {#driver-prerequisites}


#### 데이터베이스 {#prerequisites-database}

`database` 캐시 드라이버를 사용할 때는 캐시 데이터를 저장할 데이터베이스 테이블이 필요합니다. 일반적으로 이는 Laravel의 기본 `0001_01_01_000001_create_cache_table.php` [데이터베이스 마이그레이션](/laravel/12.x/migrations)에 포함되어 있습니다. 하지만 애플리케이션에 이 마이그레이션이 없다면, `make:cache-table` Artisan 명령어를 사용해 생성할 수 있습니다:

```shell
php artisan make:cache-table

php artisan migrate
```


#### Memcached {#memcached}

Memcached 드라이버를 사용하려면 [Memcached PECL 패키지](https://pecl.php.net/package/memcached)를 설치해야 합니다. 모든 Memcached 서버는 `config/cache.php` 설정 파일에 나열할 수 있습니다. 이 파일에는 이미 시작할 수 있도록 `memcached.servers` 항목이 포함되어 있습니다:

```php
'memcached' => [
    // ...

    'servers' => [
        [
            'host' => env('MEMCACHED_HOST', '127.0.0.1'),
            'port' => env('MEMCACHED_PORT', 11211),
            'weight' => 100,
        ],
    ],
],
```

필요하다면, `host` 옵션을 UNIX 소켓 경로로 설정할 수 있습니다. 이 경우 `port` 옵션은 `0`으로 설정해야 합니다:

```php
'memcached' => [
    // ...

    'servers' => [
        [
            'host' => '/var/run/memcached/memcached.sock',
            'port' => 0,
            'weight' => 100
        ],
    ],
],
```


#### Redis {#redis}

Laravel에서 Redis 캐시를 사용하기 전에 PECL을 통해 PhpRedis PHP 확장 프로그램을 설치하거나 Composer를 통해 `predis/predis` 패키지(~2.0)를 설치해야 합니다. [Laravel Sail](/laravel/12.x/sail)에는 이미 이 확장 프로그램이 포함되어 있습니다. 또한 [Laravel Cloud](https://cloud.laravel.com)나 [Laravel Forge](https://forge.laravel.com)와 같은 공식 Laravel 애플리케이션 플랫폼에는 PhpRedis 확장 프로그램이 기본적으로 설치되어 있습니다.

Redis 설정에 대한 자세한 내용은 [Laravel 문서 페이지](/laravel/12.x/redis#configuration)를 참고하세요.


#### DynamoDB {#dynamodb}

[DynamoDB](https://aws.amazon.com/dynamodb) 캐시 드라이버를 사용하기 전에, 모든 캐시 데이터를 저장할 DynamoDB 테이블을 생성해야 합니다. 일반적으로 이 테이블의 이름은 `cache`여야 합니다. 하지만, 테이블 이름은 `cache` 설정 파일 내 `stores.dynamodb.table` 설정 값에 따라 지정해야 합니다. 테이블 이름은 `DYNAMODB_CACHE_TABLE` 환경 변수로도 설정할 수 있습니다.

이 테이블에는 또한 애플리케이션의 `cache` 설정 파일 내 `stores.dynamodb.attributes.key` 설정 항목 값에 해당하는 이름의 문자열 파티션 키가 있어야 합니다. 기본적으로 파티션 키의 이름은 `key`여야 합니다.

일반적으로 DynamoDB는 만료된 항목을 테이블에서 선제적으로 제거하지 않습니다. 따라서 테이블에서 [Time to Live (TTL)](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)을 활성화해야 합니다. 테이블의 TTL 설정을 구성할 때 TTL 속성 이름을 `expires_at`으로 지정해야 합니다.

다음으로, Laravel 애플리케이션이 DynamoDB와 통신할 수 있도록 AWS SDK를 설치하세요:

```shell
composer require aws/aws-sdk-php
```

또한 DynamoDB 캐시 저장소 설정 옵션에 값이 제공되어야 합니다. 일반적으로 이러한 옵션(`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 등)은 애플리케이션의 `.env` 설정 파일에 정의해야 합니다:

```php
'dynamodb' => [
    'driver' => 'dynamodb',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
    'endpoint' => env('DYNAMODB_ENDPOINT'),
],
```


#### MongoDB {#mongodb}

MongoDB를 사용하는 경우, 공식 `mongodb/laravel-mongodb` 패키지에서 제공하는 `mongodb` 캐시 드라이버를 사용할 수 있으며, `mongodb` 데이터베이스 연결을 통해 설정할 수 있습니다. MongoDB는 TTL 인덱스를 지원하여 만료된 캐시 항목을 자동으로 삭제할 수 있습니다.

MongoDB 설정에 대한 자세한 내용은 MongoDB [Cache and Locks documentation](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/current/cache/)을 참고하세요.


## 캐시 사용법 {#cache-usage}


### 캐시 인스턴스 얻기 {#obtaining-a-cache-instance}

캐시 저장소 인스턴스를 얻으려면, 이 문서 전체에서 사용할 `Cache` 파사드를 사용할 수 있습니다. `Cache` 파사드는 Laravel 캐시 계약의 기본 구현에 간결하게 접근할 수 있도록 해줍니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    /**
     * 애플리케이션의 모든 사용자 목록을 보여줍니다.
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


#### 여러 캐시 저장소 접근하기 {#accessing-multiple-cache-stores}

`Cache` 파사드를 사용하면 `store` 메서드를 통해 다양한 캐시 저장소에 접근할 수 있습니다. `store` 메서드에 전달하는 키는 `cache` 설정 파일의 `stores` 설정 배열에 나열된 저장소 중 하나와 일치해야 합니다:

```php
$value = Cache::store('file')->get('foo');

Cache::store('redis')->put('bar', 'baz', 600); // 10분
```


### 캐시에서 항목 가져오기 {#retrieving-items-from-the-cache}

`Cache` 파사드의 `get` 메서드는 캐시에서 항목을 가져오는 데 사용됩니다. 항목이 캐시에 존재하지 않으면 `null`이 반환됩니다. 원한다면, 항목이 존재하지 않을 때 반환할 기본값을 두 번째 인수로 전달할 수 있습니다:

```php
$value = Cache::get('key');

$value = Cache::get('key', 'default');
```

기본값으로 클로저를 전달할 수도 있습니다. 지정한 항목이 캐시에 없으면 클로저의 결과가 반환됩니다. 클로저를 전달하면 데이터베이스나 다른 외부 서비스에서 기본값을 지연해서 가져올 수 있습니다:

```php
$value = Cache::get('key', function () {
    return DB::table(/* ... */)->get();
});
```


#### 항목 존재 여부 확인하기 {#determining-item-existence}

`has` 메서드를 사용하여 캐시에 항목이 존재하는지 확인할 수 있습니다. 이 메서드는 항목이 존재하지만 값이 `null`인 경우에도 `false`를 반환합니다:

```php
if (Cache::has('key')) {
    // ...
}
```


#### 값 증가/감소시키기 {#incrementing-decrementing-values}

`increment`와 `decrement` 메서드를 사용하여 캐시에 저장된 정수 항목의 값을 조정할 수 있습니다. 두 메서드 모두 항목 값을 얼마나 증가 또는 감소시킬지 나타내는 두 번째 인수를 선택적으로 받을 수 있습니다:

```php
// 값이 존재하지 않으면 초기화...
Cache::add('key', 0, now()->addHours(4));

// 값 증가 또는 감소...
Cache::increment('key');
Cache::increment('key', $amount);
Cache::decrement('key');
Cache::decrement('key', $amount);
```


#### 가져오고 저장하기 {#retrieve-store}

때때로 캐시에서 항목을 가져오고, 요청한 항목이 없으면 기본값을 저장하고 싶을 수 있습니다. 예를 들어, 모든 사용자를 캐시에서 가져오거나, 없으면 데이터베이스에서 가져와 캐시에 추가할 수 있습니다. `Cache::remember` 메서드를 사용하면 됩니다:

```php
$value = Cache::remember('users', $seconds, function () {
    return DB::table('users')->get();
});
```

항목이 캐시에 없으면, `remember` 메서드에 전달된 클로저가 실행되고 그 결과가 캐시에 저장됩니다.

항목을 캐시에서 가져오거나, 없으면 영구적으로 저장하려면 `rememberForever` 메서드를 사용할 수 있습니다:

```php
$value = Cache::rememberForever('users', function () {
    return DB::table('users')->get();
});
```


#### Stale While Revalidate {#swr}

`Cache::remember` 메서드를 사용할 때, 캐시된 값이 만료되면 일부 사용자는 느린 응답을 경험할 수 있습니다. 특정 유형의 데이터의 경우, 캐시된 값이 백그라운드에서 재계산되는 동안 부분적으로 오래된 데이터를 제공하여 일부 사용자가 느린 응답을 경험하지 않도록 하는 것이 유용할 수 있습니다. 이는 "stale-while-revalidate" 패턴이라고 하며, `Cache::flexible` 메서드가 이 패턴을 구현합니다.

flexible 메서드는 캐시된 값이 “신선”하다고 간주되는 시간과 “오래됨”으로 간주되는 시점을 지정하는 배열을 받습니다. 배열의 첫 번째 값은 캐시가 신선하다고 간주되는 초 수이고, 두 번째 값은 재계산이 필요하기 전까지 오래된 데이터로 제공될 수 있는 시간을 정의합니다.

신선 기간(첫 번째 값 이전)에 요청이 오면 캐시가 즉시 반환됩니다. 오래된 기간(두 값 사이)에 요청이 오면, 오래된 값이 사용자에게 제공되고, [지연 함수](/laravel/12.x/helpers#deferred-functions)가 등록되어 응답 후 캐시 값을 새로 고칩니다. 두 번째 값 이후에 요청이 오면 캐시가 만료된 것으로 간주되어 즉시 값을 재계산하며, 이 경우 사용자는 느린 응답을 경험할 수 있습니다:

```php
$value = Cache::flexible('users', [5, 10], function () {
    return DB::table('users')->get();
});
```


#### 가져오고 삭제하기 {#retrieve-delete}

캐시에서 항목을 가져온 후 삭제해야 한다면, `pull` 메서드를 사용할 수 있습니다. `get` 메서드와 마찬가지로, 항목이 캐시에 없으면 `null`이 반환됩니다:

```php
$value = Cache::pull('key');

$value = Cache::pull('key', 'default');
```


### 캐시에 항목 저장하기 {#storing-items-in-the-cache}

`Cache` 파사드의 `put` 메서드를 사용하여 캐시에 항목을 저장할 수 있습니다:

```php
Cache::put('key', 'value', $seconds = 10);
```

저장 시간을 `put` 메서드에 전달하지 않으면, 항목은 무기한 저장됩니다:

```php
Cache::put('key', 'value');
```

정수로 초를 전달하는 대신, 캐시 항목의 만료 시간을 나타내는 `DateTime` 인스턴스를 전달할 수도 있습니다:

```php
Cache::put('key', 'value', now()->addMinutes(10));
```


#### 존재하지 않을 때만 저장하기 {#store-if-not-present}

`add` 메서드는 항목이 캐시 저장소에 이미 존재하지 않을 때만 항목을 추가합니다. 항목이 실제로 캐시에 추가되면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다. `add` 메서드는 원자적(atomic) 연산입니다:

```php
Cache::add('key', 'value', $seconds);
```


#### 영구적으로 항목 저장하기 {#storing-items-forever}

`forever` 메서드를 사용하여 항목을 영구적으로 캐시에 저장할 수 있습니다. 이러한 항목은 만료되지 않으므로, `forget` 메서드를 사용해 수동으로 제거해야 합니다:

```php
Cache::forever('key', 'value');
```

> [!NOTE]
> Memcached 드라이버를 사용하는 경우, "영구적"으로 저장된 항목도 캐시 크기 제한에 도달하면 제거될 수 있습니다.


### 캐시에서 항목 제거하기 {#removing-items-from-the-cache}

`forget` 메서드를 사용하여 캐시에서 항목을 제거할 수 있습니다:

```php
Cache::forget('key');
```

만료 시간을 0 또는 음수로 지정하여 항목을 제거할 수도 있습니다:

```php
Cache::put('key', 'value', 0);

Cache::put('key', 'value', -5);
```

`flush` 메서드를 사용하여 전체 캐시를 비울 수 있습니다:

```php
Cache::flush();
```

> [!WARNING]
> 캐시를 플러시하면 설정된 캐시 "prefix"를 무시하고 모든 캐시 항목이 제거됩니다. 다른 애플리케이션과 캐시를 공유하는 경우, 캐시를 비우기 전에 신중히 고려하세요.


### 캐시 메모이제이션 {#cache-memoization}

Laravel의 `memo` 캐시 드라이버는 단일 요청 또는 작업 실행 중에 해결된 캐시 값을 메모리에 임시로 저장할 수 있게 해줍니다. 이를 통해 동일한 실행 내에서 반복적으로 캐시에 접근하는 것을 방지하여 성능을 크게 향상시킬 수 있습니다.

메모이제이션된 캐시를 사용하려면 `memo` 메서드를 호출하세요:

```php
use Illuminate\Support\Facades\Cache;

$value = Cache::memo()->get('key');
```

`memo` 메서드는 선택적으로 캐시 저장소의 이름을 받을 수 있으며, 이는 메모이제이션 드라이버가 데코레이트할 기본 캐시 저장소를 지정합니다:

```php
// 기본 캐시 저장소 사용...
$value = Cache::memo()->get('key');

// Redis 캐시 저장소 사용...
$value = Cache::memo('redis')->get('key');
```

주어진 키에 대한 첫 번째 `get` 호출은 캐시 저장소에서 값을 가져오지만, 동일한 요청 또는 작업 내에서 이후 호출은 메모리에서 값을 가져옵니다:

```php
// 캐시에서 조회...
$value = Cache::memo()->get('key');

// 캐시를 조회하지 않고, 메모이제이션된 값 반환...
$value = Cache::memo()->get('key');
```

캐시 값을 변경하는 메서드(`put`, `increment`, `remember` 등)를 호출하면, 메모이제이션된 캐시는 자동으로 해당 값을 잊고, 변경 메서드 호출을 기본 캐시 저장소에 위임합니다:

```php
Cache::memo()->put('name', 'Taylor'); // 기본 캐시에 기록...
Cache::memo()->get('name');           // 기본 캐시에서 조회...
Cache::memo()->get('name');           // 메모이제이션, 캐시 조회 안 함...

Cache::memo()->put('name', 'Tim');    // 메모이제이션 값 잊고, 새 값 기록...
Cache::memo()->get('name');           // 다시 기본 캐시에서 조회...
```


### 캐시 헬퍼 {#the-cache-helper}

`Cache` 파사드 외에도, 전역 `cache` 함수를 사용하여 캐시를 통해 데이터를 조회하고 저장할 수 있습니다. `cache` 함수에 문자열 하나만 전달하면 해당 키의 값을 반환합니다:

```php
$value = cache('key');
```

키/값 쌍의 배열과 만료 시간을 함수에 제공하면, 지정한 기간 동안 값을 캐시에 저장합니다:

```php
cache(['key' => 'value'], $seconds);

cache(['key' => 'value'], now()->addMinutes(10));
```

`cache` 함수를 인수 없이 호출하면, `Illuminate\Contracts\Cache\Factory` 구현 인스턴스를 반환하여 다른 캐싱 메서드를 호출할 수 있습니다:

```php
cache()->remember('users', $seconds, function () {
    return DB::table('users')->get();
});
```

> [!NOTE]
> 전역 `cache` 함수 호출을 테스트할 때는 [파사드 테스트](/laravel/12.x/mocking#mocking-facades)와 마찬가지로 `Cache::shouldReceive` 메서드를 사용할 수 있습니다.


## 원자적 락 {#atomic-locks}

> [!WARNING]
> 이 기능을 사용하려면, 애플리케이션의 기본 캐시 드라이버로 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 중 하나를 사용해야 합니다. 또한 모든 서버가 동일한 중앙 캐시 서버와 통신해야 합니다.


### 락 관리하기 {#managing-locks}

원자적 락을 사용하면 경쟁 조건(race condition)에 대해 걱정하지 않고 분산 락을 조작할 수 있습니다. 예를 들어, [Laravel Cloud](https://cloud.laravel.com)는 원자적 락을 사용하여 한 번에 하나의 원격 작업만 서버에서 실행되도록 보장합니다. `Cache::lock` 메서드를 사용하여 락을 생성하고 관리할 수 있습니다:

```php
use Illuminate\Support\Facades\Cache;

$lock = Cache::lock('foo', 10);

if ($lock->get()) {
    // 10초 동안 락 획득...

    $lock->release();
}
```

`get` 메서드는 클로저도 받을 수 있습니다. 클로저가 실행된 후 Laravel이 자동으로 락을 해제합니다:

```php
Cache::lock('foo', 10)->get(function () {
    // 10초 동안 락 획득 후 자동 해제...
});
```

요청 시점에 락을 사용할 수 없다면, Laravel이 지정한 초만큼 대기하도록 할 수 있습니다. 지정한 시간 내에 락을 획득하지 못하면 `Illuminate\Contracts\Cache\LockTimeoutException`이 발생합니다:

```php
use Illuminate\Contracts\Cache\LockTimeoutException;

$lock = Cache::lock('foo', 10);

try {
    $lock->block(5);

    // 최대 5초 대기 후 락 획득...
} catch (LockTimeoutException $e) {
    // 락 획득 실패...
} finally {
    $lock->release();
}
```

위 예제는 `block` 메서드에 클로저를 전달하여 더 간단하게 만들 수 있습니다. 이 메서드에 클로저를 전달하면, Laravel은 지정한 시간 동안 락을 획득하려 시도하고, 클로저 실행 후 자동으로 락을 해제합니다:

```php
Cache::lock('foo', 10)->block(5, function () {
    // 최대 5초 대기 후 10초 동안 락 획득...
});
```


### 프로세스 간 락 관리하기 {#managing-locks-across-processes}

때로는 한 프로세스에서 락을 획득하고, 다른 프로세스에서 락을 해제하고 싶을 수 있습니다. 예를 들어, 웹 요청 중에 락을 획득하고, 해당 요청에 의해 트리거된 큐 작업의 끝에서 락을 해제하고 싶을 수 있습니다. 이 경우, 락의 범위 "owner token"을 큐 작업에 전달하여, 해당 토큰을 사용해 락을 다시 인스턴스화할 수 있습니다.

아래 예제에서는 락을 성공적으로 획득하면 큐 작업을 디스패치합니다. 또한 락의 `owner` 메서드를 통해 락의 owner token을 큐 작업에 전달합니다:

```php
$podcast = Podcast::find($id);

$lock = Cache::lock('processing', 120);

if ($lock->get()) {
    ProcessPodcast::dispatch($podcast, $lock->owner());
}
```

애플리케이션의 `ProcessPodcast` 작업 내에서는 owner token을 사용해 락을 복원하고 해제할 수 있습니다:

```php
Cache::restoreLock('processing', $this->owner)->release();
```

현재 owner를 무시하고 락을 해제하고 싶다면, `forceRelease` 메서드를 사용할 수 있습니다:

```php
Cache::lock('processing')->forceRelease();
```


## 커스텀 캐시 드라이버 추가하기 {#adding-custom-cache-drivers}


### 드라이버 작성하기 {#writing-the-driver}

커스텀 캐시 드라이버를 만들기 위해서는 먼저 `Illuminate\Contracts\Cache\Store` [계약](/laravel/12.x/contracts)을 구현해야 합니다. 예를 들어, MongoDB 캐시 구현은 다음과 같을 수 있습니다:

```php
<?php

namespace App\Extensions;

use Illuminate\Contracts\Cache\Store;

class MongoStore implements Store
{
    public function get($key) {}
    public function many(array $keys) {}
    public function put($key, $value, $seconds) {}
    public function putMany(array $values, $seconds) {}
    public function increment($key, $value = 1) {}
    public function decrement($key, $value = 1) {}
    public function forever($key, $value) {}
    public function forget($key) {}
    public function flush() {}
    public function getPrefix() {}
}
```

각 메서드는 MongoDB 연결을 사용해 구현하면 됩니다. 각 메서드 구현 예시는 [Laravel 프레임워크 소스 코드](https://github.com/laravel/framework)의 `Illuminate\Cache\MemcachedStore`를 참고하세요. 구현이 완료되면, `Cache` 파사드의 `extend` 메서드를 호출하여 커스텀 드라이버 등록을 마무리할 수 있습니다:

```php
Cache::extend('mongo', function (Application $app) {
    return Cache::repository(new MongoStore);
});
```

> [!NOTE]
> 커스텀 캐시 드라이버 코드를 어디에 둘지 궁금하다면, `app` 디렉터리 내에 `Extensions` 네임스페이스를 생성할 수 있습니다. 하지만 Laravel은 엄격한 애플리케이션 구조를 강제하지 않으므로, 원하는 대로 애플리케이션을 구성할 수 있습니다.


### 드라이버 등록하기 {#registering-the-driver}

커스텀 캐시 드라이버를 Laravel에 등록하려면, `Cache` 파사드의 `extend` 메서드를 사용합니다. 다른 서비스 프로바이더가 자신의 `boot` 메서드 내에서 캐시 값을 읽으려 할 수 있으므로, 커스텀 드라이버는 `booting` 콜백 내에서 등록합니다. `booting` 콜백을 사용하면, 커스텀 드라이버가 애플리케이션의 서비스 프로바이더의 `boot` 메서드가 호출되기 직전에, 그리고 모든 서비스 프로바이더의 `register` 메서드가 호출된 후에 등록됨을 보장할 수 있습니다. `App\Providers\AppServiceProvider` 클래스의 `register` 메서드 내에서 `booting` 콜백을 등록합니다:

```php
<?php

namespace App\Providers;

use App\Extensions\MongoStore;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 등록합니다.
     */
    public function register(): void
    {
        $this->app->booting(function () {
             Cache::extend('mongo', function (Application $app) {
                 return Cache::repository(new MongoStore);
             });
         });
    }

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        // ...
    }
}
```

`extend` 메서드에 전달되는 첫 번째 인수는 드라이버의 이름입니다. 이는 `config/cache.php` 설정 파일의 `driver` 옵션과 일치해야 합니다. 두 번째 인수는 `Illuminate\Cache\Repository` 인스턴스를 반환해야 하는 클로저입니다. 이 클로저에는 [서비스 컨테이너](/laravel/12.x/container) 인스턴스인 `$app`이 전달됩니다.

확장이 등록되면, 애플리케이션의 `config/cache.php` 설정 파일 내 `CACHE_STORE` 환경 변수 또는 `default` 옵션을 확장 이름으로 업데이트하세요.


## 이벤트 {#events}

모든 캐시 작업 시 코드를 실행하려면, 캐시에서 디스패치하는 다양한 [이벤트](/laravel/12.x/events)를 리스닝할 수 있습니다:

<div class="overflow-auto">

| 이벤트 이름                                       |
|----------------------------------------------|
| `Illuminate\Cache\Events\CacheFlushed`       |
| `Illuminate\Cache\Events\CacheFlushing`      |
| `Illuminate\Cache\Events\CacheHit`           |
| `Illuminate\Cache\Events\CacheMissed`        |
| `Illuminate\Cache\Events\ForgettingKey`      |
| `Illuminate\Cache\Events\KeyForgetFailed`    |
| `Illuminate\Cache\Events\KeyForgotten`       |
| `Illuminate\Cache\Events\KeyWriteFailed`     |
| `Illuminate\Cache\Events\KeyWritten`         |
| `Illuminate\Cache\Events\RetrievingKey`      |
| `Illuminate\Cache\Events\RetrievingManyKeys` |
| `Illuminate\Cache\Events\WritingKey`         |
| `Illuminate\Cache\Events\WritingManyKeys`    |

</div>

성능 향상을 위해, 애플리케이션의 `config/cache.php` 설정 파일에서 특정 캐시 저장소의 `events` 설정 옵션을 `false`로 설정하여 캐시 이벤트를 비활성화할 수 있습니다:

```php
'database' => [
    'driver' => 'database',
    // ...
    'events' => false,
],
```
