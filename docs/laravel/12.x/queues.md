# 큐(Queues)

























































## 소개 {#introduction}

웹 애플리케이션을 개발하다 보면, 업로드된 CSV 파일을 파싱하고 저장하는 작업처럼 일반적인 웹 요청 중에 처리하기에는 너무 오래 걸리는 작업이 있을 수 있습니다. 다행히도, Laravel은 백그라운드에서 처리할 수 있는 큐 잡을 쉽게 생성할 수 있도록 해줍니다. 시간 소모가 많은 작업을 큐로 옮기면, 애플리케이션은 웹 요청에 매우 빠르게 응답할 수 있고, 고객에게 더 나은 사용자 경험을 제공할 수 있습니다.

Laravel 큐는 [Amazon SQS](https://aws.amazon.com/sqs/), [Redis](https://redis.io), 또는 관계형 데이터베이스와 같은 다양한 큐 백엔드에 대해 통합된 큐 API를 제공합니다.

Laravel의 큐 설정 옵션은 애플리케이션의 `config/queue.php` 설정 파일에 저장되어 있습니다. 이 파일에는 프레임워크에 포함된 각 큐 드라이버(데이터베이스, [Amazon SQS](https://aws.amazon.com/sqs/), [Redis](https://redis.io), [Beanstalkd](https://beanstalkd.github.io/) 드라이버 등)와, 잡을 즉시 실행하는 동기 드라이버(로컬 개발용), 그리고 큐에 쌓인 잡을 폐기하는 `null` 큐 드라이버의 커넥션 설정이 포함되어 있습니다.

> [!NOTE]
> Laravel은 이제 Redis 기반 큐를 위한 아름다운 대시보드와 설정 시스템인 Horizon을 제공합니다. 자세한 내용은 [Horizon 문서](/laravel/12.x/horizon)를 참고하세요.


### 커넥션 vs. 큐 {#connections-vs-queues}

Laravel 큐를 시작하기 전에 "커넥션"과 "큐"의 차이를 이해하는 것이 중요합니다. `config/queue.php` 설정 파일에는 `connections` 설정 배열이 있습니다. 이 옵션은 Amazon SQS, Beanstalk, Redis와 같은 백엔드 큐 서비스에 대한 커넥션을 정의합니다. 하지만, 하나의 큐 커넥션에는 여러 개의 "큐"가 있을 수 있으며, 이는 서로 다른 잡 스택 또는 잡 더미로 생각할 수 있습니다.

`queue` 설정 파일의 각 커넥션 설정 예제에는 `queue` 속성이 포함되어 있습니다. 이는 잡이 해당 커넥션으로 전송될 때 디스패치되는 기본 큐입니다. 즉, 잡을 디스패치할 때 명시적으로 어떤 큐로 보낼지 정의하지 않으면, 커넥션 설정의 `queue` 속성에 정의된 큐에 잡이 쌓입니다:

```php
use App\Jobs\ProcessPodcast;

// 이 잡은 기본 커넥션의 기본 큐로 전송됩니다...
ProcessPodcast::dispatch();

// 이 잡은 기본 커넥션의 "emails" 큐로 전송됩니다...
ProcessPodcast::dispatch()->onQueue('emails');
```

일부 애플리케이션은 여러 큐에 잡을 넣을 필요가 없고, 단순한 하나의 큐만 사용할 수도 있습니다. 하지만, 여러 큐에 잡을 넣는 것은 잡 처리 방식을 우선순위별로 나누거나 세분화하고자 할 때 특히 유용합니다. Laravel 큐 워커는 어떤 큐를 어떤 우선순위로 처리할지 지정할 수 있기 때문입니다. 예를 들어, `high` 큐에 잡을 넣으면, 해당 큐에 더 높은 우선순위를 부여하는 워커를 실행할 수 있습니다:

```shell
php artisan queue:work --queue=high,default
```


### 드라이버 참고사항 및 사전 준비 {#driver-prerequisites}


#### 데이터베이스 {#database}

`database` 큐 드라이버를 사용하려면, 잡을 저장할 데이터베이스 테이블이 필요합니다. 일반적으로, 이는 Laravel의 기본 `0001_01_01_000002_create_jobs_table.php` [데이터베이스 마이그레이션](/laravel/12.x/migrations)에 포함되어 있습니다. 하지만, 애플리케이션에 이 마이그레이션이 없다면, `make:queue-table` Artisan 명령어를 사용해 생성할 수 있습니다:

```shell
php artisan make:queue-table

php artisan migrate
```


#### Redis {#redis}

`redis` 큐 드라이버를 사용하려면, `config/database.php` 설정 파일에서 Redis 데이터베이스 커넥션을 설정해야 합니다.

> [!WARNING]
> `redis` 큐 드라이버는 `serializer` 및 `compression` Redis 옵션을 지원하지 않습니다.

**Redis 클러스터**

Redis 큐 커넥션이 Redis 클러스터를 사용하는 경우, 큐 이름에 [키 해시 태그](https://redis.io/docs/reference/cluster-spec/#hash-tags)가 포함되어야 합니다. 이는 주어진 큐의 모든 Redis 키가 동일한 해시 슬롯에 배치되도록 보장하기 위해 필요합니다:

```php
'redis' => [
    'driver' => 'redis',
    'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
    'queue' => env('REDIS_QUEUE', '{default}'),
    'retry_after' => env('REDIS_QUEUE_RETRY_AFTER', 90),
    'block_for' => null,
    'after_commit' => false,
],
```

**블로킹(Blocking)**

Redis 큐를 사용할 때, `block_for` 설정 옵션을 사용하여 잡이 사용 가능해질 때까지 드라이버가 대기할 시간을 지정할 수 있습니다. 이 값은 워커 루프를 반복하고 Redis 데이터베이스를 다시 폴링하기 전에 대기하는 시간입니다.

큐의 부하에 따라 이 값을 조정하면, 새로운 잡을 위해 Redis 데이터베이스를 계속 폴링하는 것보다 더 효율적일 수 있습니다. 예를 들어, 값을 `5`로 설정하면, 잡이 사용 가능해질 때까지 드라이버가 5초 동안 블로킹됩니다:

```php
'redis' => [
    'driver' => 'redis',
    'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
    'queue' => env('REDIS_QUEUE', 'default'),
    'retry_after' => env('REDIS_QUEUE_RETRY_AFTER', 90),
    'block_for' => 5,
    'after_commit' => false,
],
```

> [!WARNING]
> `block_for`를 `0`으로 설정하면, 잡이 사용 가능해질 때까지 큐 워커가 무한정 블로킹됩니다. 이로 인해 `SIGTERM`과 같은 신호가 다음 잡이 처리될 때까지 처리되지 않을 수 있습니다.


#### 기타 드라이버 사전 준비 {#other-driver-prerequisites}

아래 큐 드라이버를 사용하려면 다음과 같은 의존성이 필요합니다. 이 의존성들은 Composer 패키지 매니저를 통해 설치할 수 있습니다:

<div class="content-list" markdown="1">

- Amazon SQS: `aws/aws-sdk-php ~3.0`
- Beanstalkd: `pda/pheanstalk ~5.0`
- Redis: `predis/predis ~2.0` 또는 phpredis PHP 확장
- [MongoDB](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/current/queues/): `mongodb/laravel-mongodb`

</div>


## 잡 생성 {#creating-jobs}


### 잡 클래스 생성 {#generating-job-classes}

기본적으로, 애플리케이션의 모든 큐잉 가능한 잡은 `app/Jobs` 디렉터리에 저장됩니다. 만약 `app/Jobs` 디렉터리가 없다면, `make:job` Artisan 명령어를 실행할 때 자동으로 생성됩니다:

```shell
php artisan make:job ProcessPodcast
```

생성된 클래스는 `Illuminate\Contracts\Queue\ShouldQueue` 인터페이스를 구현하며, 이는 Laravel에게 해당 잡이 비동기적으로 큐에 쌓여야 함을 알립니다.

> [!NOTE]
> 잡 스텁은 [스텁 퍼블리싱](/laravel/12.x/artisan#stub-customization)을 통해 커스터마이즈할 수 있습니다.


### 클래스 구조 {#class-structure}

잡 클래스는 매우 단순하며, 일반적으로 큐에서 잡이 처리될 때 호출되는 `handle` 메서드만 포함합니다. 시작을 위해, 예제 잡 클래스를 살펴보겠습니다. 이 예제에서는 팟캐스트 게시 서비스를 관리하며, 업로드된 팟캐스트 파일을 게시 전에 처리해야 한다고 가정합니다:

```php
<?php

namespace App\Jobs;

use App\Models\Podcast;
use App\Services\AudioProcessor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 잡 인스턴스 생성
     */
    public function __construct(
        public Podcast $podcast,
    ) {}

    /**
     * 잡 실행
     */
    public function handle(AudioProcessor $processor): void
    {
        // 업로드된 팟캐스트 처리...
    }
}
```

이 예제에서, [Eloquent 모델](/laravel/12.x/eloquent)을 큐잉 잡의 생성자에 직접 전달할 수 있음을 알 수 있습니다. 잡이 사용하는 `Queueable` 트레이트 덕분에, Eloquent 모델과 로드된 관계는 잡이 처리될 때 우아하게 직렬화 및 역직렬화됩니다.

큐잉 잡이 생성자에서 Eloquent 모델을 받는 경우, 모델의 식별자만 큐에 직렬화됩니다. 잡이 실제로 처리될 때, 큐 시스템은 데이터베이스에서 전체 모델 인스턴스와 로드된 관계를 자동으로 다시 조회합니다. 이 모델 직렬화 방식은 큐 드라이버로 전송되는 잡 페이로드를 훨씬 작게 만듭니다.


#### `handle` 메서드 의존성 주입 {#handle-method-dependency-injection}

`handle` 메서드는 큐에서 잡이 처리될 때 호출됩니다. 잡의 `handle` 메서드에서 의존성을 타입힌트로 지정할 수 있습니다. Laravel [서비스 컨테이너](/laravel/12.x/container)가 이러한 의존성을 자동으로 주입합니다.

컨테이너가 `handle` 메서드에 의존성을 주입하는 방식을 완전히 제어하고 싶다면, 컨테이너의 `bindMethod` 메서드를 사용할 수 있습니다. `bindMethod`는 잡과 컨테이너를 받는 콜백을 인자로 받습니다. 콜백 내에서 원하는 방식으로 `handle` 메서드를 호출할 수 있습니다. 일반적으로, 이 메서드는 `App\Providers\AppServiceProvider` [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 호출해야 합니다:

```php
use App\Jobs\ProcessPodcast;
use App\Services\AudioProcessor;
use Illuminate\Contracts\Foundation\Application;

$this->app->bindMethod([ProcessPodcast::class, 'handle'], function (ProcessPodcast $job, Application $app) {
    return $job->handle($app->make(AudioProcessor::class));
});
```

> [!WARNING]
> 원시 이미지 데이터와 같은 바이너리 데이터는 큐잉 잡에 전달하기 전에 반드시 `base64_encode` 함수를 통해 인코딩해야 합니다. 그렇지 않으면 잡이 큐에 쌓일 때 JSON으로 올바르게 직렬화되지 않을 수 있습니다.


#### 큐잉된 관계(Queued Relationships) {#handling-relationships}

큐잉 잡이 큐에 쌓일 때 로드된 모든 Eloquent 모델 관계도 직렬화되기 때문에, 직렬화된 잡 문자열이 매우 커질 수 있습니다. 또한, 잡이 역직렬화되고 모델 관계가 데이터베이스에서 다시 조회될 때, 관계 전체가 조회됩니다. 잡 큐잉 과정에서 모델이 직렬화되기 전에 적용된 관계 제약 조건은 잡이 역직렬화될 때 적용되지 않습니다. 따라서, 특정 관계의 일부만 작업하려면, 큐잉 잡 내에서 해당 관계를 다시 제약해야 합니다.

또는, 관계가 직렬화되는 것을 방지하려면, 속성 값을 설정할 때 모델의 `withoutRelations` 메서드를 호출할 수 있습니다. 이 메서드는 로드된 관계가 없는 모델 인스턴스를 반환합니다:

```php
/**
 * 새로운 잡 인스턴스 생성
 */
public function __construct(
    Podcast $podcast,
) {
    $this->podcast = $podcast->withoutRelations();
}
```

PHP 생성자 프로퍼티 프로모션을 사용하고 있고, Eloquent 모델이 관계를 직렬화하지 않도록 지정하고 싶다면, `WithoutRelations` 속성을 사용할 수 있습니다:

```php
use Illuminate\Queue\Attributes\WithoutRelations;

/**
 * 새로운 잡 인스턴스 생성
 */
public function __construct(
    #[WithoutRelations]
    public Podcast $podcast,
) {}
```

잡이 단일 모델이 아닌 Eloquent 모델의 컬렉션이나 배열을 받는 경우, 해당 컬렉션 내의 모델들은 잡이 역직렬화 및 실행될 때 관계가 복원되지 않습니다. 이는 많은 수의 모델을 다루는 잡에서 과도한 리소스 사용을 방지하기 위함입니다.


### 유니크 잡 {#unique-jobs}

> [!WARNING]
> 유니크 잡은 [락](/laravel/12.x/cache#atomic-locks)을 지원하는 캐시 드라이버가 필요합니다. 현재 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 캐시 드라이버가 원자적 락을 지원합니다. 또한, 유니크 잡 제약은 배치 내의 잡에는 적용되지 않습니다.

특정 잡의 인스턴스가 한 번에 큐에 하나만 존재하도록 보장하고 싶을 때가 있습니다. 이를 위해 잡 클래스에 `ShouldBeUnique` 인터페이스를 구현하면 됩니다. 이 인터페이스는 클래스에 추가 메서드를 정의할 필요가 없습니다:

```php
<?php

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    // ...
}
```

위 예제에서, `UpdateSearchIndex` 잡은 유니크합니다. 따라서, 동일한 잡의 다른 인스턴스가 이미 큐에 있고 아직 처리되지 않았다면, 잡이 디스패치되지 않습니다.

특정 "키"로 잡을 유니크하게 만들거나, 잡이 더 이상 유니크하지 않게 되는 타임아웃을 지정하고 싶을 때가 있습니다. 이를 위해 잡 클래스에 `uniqueId` 및 `uniqueFor` 속성 또는 메서드를 정의할 수 있습니다:

```php
<?php

use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    /**
     * 상품 인스턴스
     *
     * @var \App\Product
     */
    public $product;

    /**
     * 잡의 유니크 락이 해제될 때까지의 초 단위 시간
     *
     * @var int
     */
    public $uniqueFor = 3600;

    /**
     * 잡의 유니크 ID 반환
     */
    public function uniqueId(): string
    {
        return $this->product->id;
    }
}
```

위 예제에서, `UpdateSearchIndex` 잡은 상품 ID로 유니크합니다. 따라서, 동일한 상품 ID로 잡이 새로 디스패치되면 기존 잡이 처리될 때까지 무시됩니다. 또한, 기존 잡이 1시간 내에 처리되지 않으면 유니크 락이 해제되어 동일한 유니크 키로 또 다른 잡이 큐에 디스패치될 수 있습니다.

> [!WARNING]
> 애플리케이션이 여러 웹 서버나 컨테이너에서 잡을 디스패치하는 경우, 모든 서버가 동일한 중앙 캐시 서버와 통신하도록 해야 Laravel이 잡의 유니크 여부를 정확히 판단할 수 있습니다.


#### 처리 시작 전까지 잡을 유니크하게 유지 {#keeping-jobs-unique-until-processing-begins}

기본적으로, 유니크 잡은 잡이 처리 완료되거나 모든 재시도 시도가 실패한 후 "언락"됩니다. 하지만, 잡이 처리되기 직전에 언락되길 원할 때가 있습니다. 이 경우, 잡이 `ShouldBeUnique` 대신 `ShouldBeUniqueUntilProcessing` 계약을 구현해야 합니다:

```php
<?php

use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUniqueUntilProcessing
{
    // ...
}
```


#### 유니크 잡 락 {#unique-job-locks}

내부적으로, `ShouldBeUnique` 잡이 디스패치될 때 Laravel은 `uniqueId` 키로 [락](/laravel/12.x/cache#atomic-locks)을 획득하려고 시도합니다. 락을 획득하지 못하면 잡이 디스패치되지 않습니다. 이 락은 잡이 처리 완료되거나 모든 재시도 시도가 실패하면 해제됩니다. 기본적으로 Laravel은 기본 캐시 드라이버를 사용해 락을 획득합니다. 하지만, 다른 드라이버를 사용하고 싶다면, 락을 획득할 캐시 드라이버를 반환하는 `uniqueVia` 메서드를 정의할 수 있습니다:

```php
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Cache;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    // ...

    /**
     * 유니크 잡 락을 위한 캐시 드라이버 반환
     */
    public function uniqueVia(): Repository
    {
        return Cache::driver('redis');
    }
}
```

> [!NOTE]
> 잡의 동시 처리만 제한하고 싶다면, [WithoutOverlapping](/laravel/12.x/queues#preventing-job-overlaps) 잡 미들웨어를 대신 사용하세요.


### 암호화된 잡 {#encrypted-jobs}

Laravel은 [암호화](/laravel/12.x/encryption)를 통해 잡 데이터의 프라이버시와 무결성을 보장할 수 있습니다. 시작하려면, 잡 클래스에 `ShouldBeEncrypted` 인터페이스를 추가하세요. 이 인터페이스가 클래스에 추가되면, Laravel은 잡을 큐에 넣기 전에 자동으로 암호화합니다:

```php
<?php

use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateSearchIndex implements ShouldQueue, ShouldBeEncrypted
{
    // ...
}
```


## 잡 미들웨어 {#job-middleware}

잡 미들웨어를 사용하면 큐잉된 잡 실행을 감싸는 커스텀 로직을 작성할 수 있어, 잡 자체의 보일러플레이트를 줄일 수 있습니다. 예를 들어, 아래 `handle` 메서드는 Laravel의 Redis 속도 제한 기능을 활용해 5초마다 한 번씩만 잡을 처리하도록 합니다:

```php
use Illuminate\Support\Facades\Redis;

/**
 * 잡 실행
 */
public function handle(): void
{
    Redis::throttle('key')->block(0)->allow(1)->every(5)->then(function () {
        info('락 획득...');

        // 잡 처리...
    }, function () {
        // 락 획득 실패...

        return $this->release(5);
    });
}
```

이 코드는 유효하지만, `handle` 메서드가 Redis 속도 제한 로직으로 인해 복잡해집니다. 또한, 이 속도 제한 로직을 속도 제한이 필요한 다른 잡에도 중복해서 작성해야 합니다.

`handle` 메서드에서 속도 제한을 구현하는 대신, 속도 제한을 처리하는 잡 미들웨어를 정의할 수 있습니다. Laravel은 잡 미들웨어의 기본 위치를 제공하지 않으므로, 애플리케이션 내 어디에나 자유롭게 둘 수 있습니다. 이 예제에서는 `app/Jobs/Middleware` 디렉터리에 미들웨어를 둘 것입니다:

```php
<?php

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Redis;

class RateLimited
{
    /**
     * 큐잉된 잡 처리
     *
     * @param  \Closure(object): void  $next
     */
    public function handle(object $job, Closure $next): void
    {
        Redis::throttle('key')
            ->block(0)->allow(1)->every(5)
            ->then(function () use ($job, $next) {
                // 락 획득...

                $next($job);
            }, function () use ($job) {
                // 락 획득 실패...

                $job->release(5);
            });
    }
}
```

[라우트 미들웨어](/laravel/12.x/middleware)처럼, 잡 미들웨어도 처리 중인 잡과 잡 처리를 계속할 콜백을 받습니다.

`make:job-middleware` Artisan 명령어로 새로운 잡 미들웨어 클래스를 생성할 수 있습니다. 잡 미들웨어를 생성한 후에는 잡의 `middleware` 메서드에서 반환하여 잡에 연결할 수 있습니다. 이 메서드는 `make:job` Artisan 명령어로 스캐폴딩된 잡에는 존재하지 않으므로, 잡 클래스에 직접 추가해야 합니다:

```php
use App\Jobs\Middleware\RateLimited;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new RateLimited];
}
```

> [!NOTE]
> 잡 미들웨어는 [큐잉 이벤트 리스너](/laravel/12.x/events#queued-event-listeners), [메일러블](/laravel/12.x/mail#queueing-mail), [알림](/laravel/12.x/notifications#queueing-notifications)에도 할당할 수 있습니다.


### 속도 제한 {#rate-limiting}

방금 직접 속도 제한 잡 미들웨어를 작성하는 방법을 보여드렸지만, Laravel에는 잡을 속도 제한할 수 있는 미들웨어가 기본 포함되어 있습니다. [라우트 속도 제한자](/laravel/12.x/routing#defining-rate-limiters)처럼, 잡 속도 제한자는 `RateLimiter` 파사드의 `for` 메서드를 사용해 정의합니다.

예를 들어, 일반 사용자는 한 시간에 한 번만 데이터를 백업할 수 있도록 하고, 프리미엄 고객에게는 제한을 두지 않으려 할 수 있습니다. 이를 위해, `AppServiceProvider`의 `boot` 메서드에서 `RateLimiter`를 정의할 수 있습니다:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

/**
 * 애플리케이션 서비스 부트스트랩
 */
public function boot(): void
{
    RateLimiter::for('backups', function (object $job) {
        return $job->user->vipCustomer()
            ? Limit::none()
            : Limit::perHour(1)->by($job->user->id);
    });
}
```

위 예제에서는 시간 단위로 속도 제한을 정의했지만, `perMinute` 메서드를 사용해 분 단위로도 쉽게 제한할 수 있습니다. 또한, `by` 메서드에는 원하는 값을 전달할 수 있지만, 주로 고객별로 속도 제한을 구분하는 데 사용됩니다:

```php
return Limit::perMinute(50)->by($job->user->id);
```

속도 제한을 정의한 후에는 `Illuminate\Queue\Middleware\RateLimited` 미들웨어를 사용해 잡에 속도 제한자를 연결할 수 있습니다. 잡이 속도 제한을 초과할 때마다, 이 미들웨어는 잡을 적절한 지연과 함께 큐로 다시 릴리즈합니다.

```php
use Illuminate\Queue\Middleware\RateLimited;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new RateLimited('backups')];
}
```

속도 제한된 잡을 큐에 다시 릴리즈해도 잡의 전체 `attempts` 횟수는 증가합니다. 따라서, 잡 클래스의 `tries` 및 `maxExceptions` 속성을 적절히 조정해야 할 수 있습니다. 또는, [retryUntil 메서드](#time-based-attempts)를 사용해 잡을 더 이상 시도하지 않을 시간을 정의할 수 있습니다.

`releaseAfter` 메서드를 사용해, 릴리즈된 잡이 다시 시도되기 전까지 경과해야 할 초를 지정할 수도 있습니다:

```php
/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new RateLimited('backups'))->releaseAfter(60)];
}
```

잡이 속도 제한될 때 재시도하지 않으려면, `dontRelease` 메서드를 사용할 수 있습니다:

```php
/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new RateLimited('backups'))->dontRelease()];
}
```

> [!NOTE]
> Redis를 사용하는 경우, Redis에 최적화되어 더 효율적인 `Illuminate\Queue\Middleware\RateLimitedWithRedis` 미들웨어를 사용할 수 있습니다.


### 잡 중복 방지 {#preventing-job-overlaps}

Laravel에는 임의의 키를 기준으로 잡 중복을 방지할 수 있는 `Illuminate\Queue\Middleware\WithoutOverlapping` 미들웨어가 포함되어 있습니다. 이는 한 번에 하나의 잡만 리소스를 수정해야 할 때 유용합니다.

예를 들어, 사용자의 신용 점수를 업데이트하는 큐잉 잡이 있고, 동일한 사용자 ID에 대해 신용 점수 업데이트 잡이 중복 실행되는 것을 방지하고 싶다고 가정해봅시다. 이를 위해, 잡의 `middleware` 메서드에서 `WithoutOverlapping` 미들웨어를 반환할 수 있습니다:

```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new WithoutOverlapping($this->user->id)];
}
```

동일 타입의 중복 잡은 큐로 다시 릴리즈됩니다. 릴리즈된 잡이 다시 시도되기 전까지 경과해야 할 초를 지정할 수도 있습니다:

```php
/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new WithoutOverlapping($this->order->id))->releaseAfter(60)];
}
```

중복 잡을 즉시 삭제하여 재시도되지 않도록 하려면, `dontRelease` 메서드를 사용할 수 있습니다:

```php
/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new WithoutOverlapping($this->order->id))->dontRelease()];
}
```

`WithoutOverlapping` 미들웨어는 Laravel의 원자적 락 기능을 기반으로 합니다. 때때로, 잡이 예기치 않게 실패하거나 타임아웃되어 락이 해제되지 않을 수 있습니다. 따라서, `expireAfter` 메서드를 사용해 락 만료 시간을 명시적으로 정의할 수 있습니다. 아래 예제는 잡이 처리 시작 후 3분이 지나면 `WithoutOverlapping` 락을 해제하도록 Laravel에 지시합니다:

```php
/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new WithoutOverlapping($this->order->id))->expireAfter(180)];
}
```

> [!WARNING]
> `WithoutOverlapping` 미들웨어는 [락](/laravel/12.x/cache#atomic-locks)을 지원하는 캐시 드라이버가 필요합니다. 현재 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 캐시 드라이버가 원자적 락을 지원합니다.


#### 잡 클래스 간 락 키 공유 {#sharing-lock-keys}

기본적으로, `WithoutOverlapping` 미들웨어는 동일 클래스의 중복 잡만 방지합니다. 따라서, 두 개의 다른 잡 클래스가 동일한 락 키를 사용하더라도 중복이 방지되지 않습니다. 하지만, `shared` 메서드를 사용해 Laravel이 잡 클래스 간에도 키를 적용하도록 지시할 수 있습니다:

```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

class ProviderIsDown
{
    // ...

    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("status:{$this->provider}"))->shared(),
        ];
    }
}

class ProviderIsUp
{
    // ...

    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("status:{$this->provider}"))->shared(),
        ];
    }
}
```


### 예외 제한 {#throttling-exceptions}

Laravel에는 예외를 제한할 수 있는 `Illuminate\Queue\Middleware\ThrottlesExceptions` 미들웨어가 포함되어 있습니다. 잡이 지정된 횟수만큼 예외를 던지면, 지정된 시간 간격이 경과할 때까지 잡 실행이 지연됩니다. 이 미들웨어는 불안정한 서드파티 서비스와 상호작용하는 잡에 특히 유용합니다.

예를 들어, 서드파티 API와 상호작용하는 큐잉 잡이 예외를 던지기 시작했다고 가정해봅시다. 예외를 제한하려면, 잡의 `middleware` 메서드에서 `ThrottlesExceptions` 미들웨어를 반환할 수 있습니다. 일반적으로, 이 미들웨어는 [시간 기반 시도](#time-based-attempts)를 구현한 잡과 함께 사용해야 합니다:

```php
use DateTime;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new ThrottlesExceptions(10, 5 * 60)];
}

/**
 * 잡이 타임아웃될 시간 반환
 */
public function retryUntil(): DateTime
{
    return now()->addMinutes(30);
}
```

미들웨어의 첫 번째 생성자 인자는 잡이 예외를 던질 수 있는 최대 횟수이고, 두 번째 인자는 잡이 제한된 후 다시 시도되기까지 경과해야 할 초입니다. 위 코드에서, 잡이 10번 연속 예외를 던지면, 5분 후에 다시 시도하며, 30분 제한 내에서만 시도합니다.

잡이 예외를 던졌지만 예외 임계값에 도달하지 않은 경우, 잡은 일반적으로 즉시 재시도됩니다. 하지만, 미들웨어를 잡에 연결할 때 `backoff` 메서드를 호출해 지연 시간을 지정할 수 있습니다:

```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 5 * 60))->backoff(5)];
}
```

내부적으로, 이 미들웨어는 Laravel의 캐시 시스템을 사용해 속도 제한을 구현하며, 잡 클래스명이 캐시 "키"로 사용됩니다. 잡에 미들웨어를 연결할 때 `by` 메서드를 호출해 이 키를 오버라이드할 수 있습니다. 이는 여러 잡이 동일한 서드파티 서비스와 상호작용하고, 공통 제한 "버킷"을 공유하길 원할 때 유용합니다:

```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 10 * 60))->by('key')];
}
```

기본적으로, 이 미들웨어는 모든 예외를 제한합니다. 잡에 미들웨어를 연결할 때 `when` 메서드를 호출해 이 동작을 수정할 수 있습니다. `when` 메서드에 제공된 클로저가 `true`를 반환할 때만 예외가 제한됩니다:

```php
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 10 * 60))->when(
        fn (Throwable $throwable) => $throwable instanceof HttpClientException
    )];
}
```

`when` 메서드는 잡을 큐에 다시 릴리즈하거나 예외를 던지지만, `deleteWhen` 메서드는 특정 예외가 발생할 때 잡을 완전히 삭제할 수 있습니다:

```php
use App\Exceptions\CustomerDeletedException;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(2, 10 * 60))->deleteWhen(CustomerDeletedException::class)];
}
```

제한된 예외를 애플리케이션의 예외 핸들러에 보고하고 싶다면, 잡에 미들웨어를 연결할 때 `report` 메서드를 호출하면 됩니다. 선택적으로, `report` 메서드에 클로저를 제공하면, 해당 클로저가 `true`를 반환할 때만 예외가 보고됩니다:

```php
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 잡이 통과해야 할 미들웨어 반환
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 10 * 60))->report(
        fn (Throwable $throwable) => $throwable instanceof HttpClientException
    )];
}
```

> [!NOTE]
> Redis를 사용하는 경우, Redis에 최적화되어 더 효율적인 `Illuminate\Queue\Middleware\ThrottlesExceptionsWithRedis` 미들웨어를 사용할 수 있습니다.


### 잡 건너뛰기 {#skipping-jobs}

`Skip` 미들웨어를 사용하면 잡의 로직을 수정하지 않고도 잡을 건너뛰거나 삭제할 수 있습니다. `Skip::when` 메서드는 주어진 조건이 `true`로 평가되면 잡을 삭제하고, `Skip::unless` 메서드는 조건이 `false`로 평가되면 잡을 삭제합니다:

```php
use Illuminate\Queue\Middleware\Skip;

/**
 * 잡이 통과해야 할 미들웨어 반환
 */
public function middleware(): array
{
    return [
        Skip::when($someCondition),
    ];
}
```

더 복잡한 조건 평가를 위해 `when` 및 `unless` 메서드에 `Closure`를 전달할 수도 있습니다:

```php
use Illuminate\Queue\Middleware\Skip;

/**
 * 잡이 통과해야 할 미들웨어 반환
 */
public function middleware(): array
{
    return [
        Skip::when(function (): bool {
            return $this->shouldSkip();
        }),
    ];
}
```


## 잡 디스패치 {#dispatching-jobs}

잡 클래스를 작성한 후에는, 잡 자체의 `dispatch` 메서드를 사용해 디스패치할 수 있습니다. `dispatch` 메서드에 전달된 인자는 잡의 생성자에 전달됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PodcastController extends Controller
{
    /**
     * 새 팟캐스트 저장
     */
    public function store(Request $request): RedirectResponse
    {
        $podcast = Podcast::create(/* ... */);

        // ...

        ProcessPodcast::dispatch($podcast);

        return redirect('/podcasts');
    }
}
```

조건부로 잡을 디스패치하려면, `dispatchIf` 및 `dispatchUnless` 메서드를 사용할 수 있습니다:

```php
ProcessPodcast::dispatchIf($accountActive, $podcast);

ProcessPodcast::dispatchUnless($accountSuspended, $podcast);
```

새로운 Laravel 애플리케이션에서는 `sync` 드라이버가 기본 큐 드라이버입니다. 이 드라이버는 잡을 현재 요청의 포그라운드에서 동기적으로 실행하므로, 로컬 개발 중에 편리합니다. 실제로 백그라운드 처리를 위해 잡을 큐잉하려면, 애플리케이션의 `config/queue.php` 설정 파일에서 다른 큐 드라이버를 지정해야 합니다.


### 지연 디스패치 {#delayed-dispatching}

잡이 큐 워커에 의해 즉시 처리되지 않도록 하려면, 잡을 디스패치할 때 `delay` 메서드를 사용할 수 있습니다. 예를 들어, 잡이 디스패치된 후 10분이 지나야 처리 가능하도록 지정할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PodcastController extends Controller
{
    /**
     * 새 팟캐스트 저장
     */
    public function store(Request $request): RedirectResponse
    {
        $podcast = Podcast::create(/* ... */);

        // ...

        ProcessPodcast::dispatch($podcast)
            ->delay(now()->addMinutes(10));

        return redirect('/podcasts');
    }
}
```

경우에 따라, 잡에 기본 지연이 설정되어 있을 수 있습니다. 이 지연을 우회하고 잡을 즉시 처리하려면, `withoutDelay` 메서드를 사용할 수 있습니다:

```php
ProcessPodcast::dispatch($podcast)->withoutDelay();
```

> [!WARNING]
> Amazon SQS 큐 서비스는 최대 지연 시간이 15분입니다.


#### 응답이 브라우저에 전송된 후 디스패치 {#dispatching-after-the-response-is-sent-to-browser}

또는, `dispatchAfterResponse` 메서드는 웹 서버가 FastCGI를 사용할 경우, HTTP 응답이 사용자 브라우저에 전송된 후 잡을 디스패치합니다. 이렇게 하면, 큐잉 잡이 실행 중이어도 사용자가 애플리케이션을 바로 사용할 수 있습니다. 일반적으로 1초 정도 걸리는 작업(예: 이메일 전송)에만 사용해야 하며, 이 방식으로 디스패치된 잡은 현재 HTTP 요청 내에서 처리되므로 큐 워커가 실행 중일 필요가 없습니다:

```php
use App\Jobs\SendNotification;

SendNotification::dispatchAfterResponse();
```

클로저를 `dispatch`하고, `afterResponse` 메서드를 체이닝하여 HTTP 응답이 브라우저에 전송된 후 클로저를 실행할 수도 있습니다:

```php
use App\Mail\WelcomeMessage;
use Illuminate\Support\Facades\Mail;

dispatch(function () {
    Mail::to('taylor@example.com')->send(new WelcomeMessage);
})->afterResponse();
```


### 동기 디스패치 {#synchronous-dispatching}

잡을 즉시(동기적으로) 디스패치하려면, `dispatchSync` 메서드를 사용할 수 있습니다. 이 메서드를 사용하면 잡이 큐에 쌓이지 않고, 현재 프로세스 내에서 즉시 실행됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PodcastController extends Controller
{
    /**
     * 새 팟캐스트 저장
     */
    public function store(Request $request): RedirectResponse
    {
        $podcast = Podcast::create(/* ... */);

        // 팟캐스트 생성...

        ProcessPodcast::dispatchSync($podcast);

        return redirect('/podcasts');
    }
}
```


### 잡 & 데이터베이스 트랜잭션 {#jobs-and-database-transactions}

데이터베이스 트랜잭션 내에서 잡을 디스패치해도 괜찮지만, 잡이 실제로 성공적으로 실행될 수 있도록 특별히 주의해야 합니다. 트랜잭션 내에서 잡을 디스패치할 때, 잡이 워커에 의해 부모 트랜잭션이 커밋되기 전에 처리될 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 가한 업데이트가 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 레코드가 데이터베이스에 존재하지 않을 수도 있습니다.

다행히도, Laravel은 이 문제를 해결할 여러 방법을 제공합니다. 첫째, 큐 커넥션 설정 배열에서 `after_commit` 옵션을 설정할 수 있습니다:

```php
'redis' => [
    'driver' => 'redis',
    // ...
    'after_commit' => true,
],
```

`after_commit` 옵션이 `true`이면, 데이터베이스 트랜잭션 내에서 잡을 디스패치할 수 있지만, Laravel은 열린 부모 데이터베이스 트랜잭션이 커밋될 때까지 실제로 잡을 디스패치하지 않습니다. 물론, 현재 열린 데이터베이스 트랜잭션이 없다면, 잡은 즉시 디스패치됩니다.

트랜잭션 중 예외로 인해 롤백되면, 해당 트랜잭션 중에 디스패치된 잡은 폐기됩니다.

> [!NOTE]
> `after_commit` 설정 옵션을 `true`로 설정하면, 큐잉 이벤트 리스너, 메일러블, 알림, 브로드캐스트 이벤트도 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치됩니다.


#### 커밋 디스패치 동작을 인라인으로 지정 {#specifying-commit-dispatch-behavior-inline}

`after_commit` 큐 커넥션 설정 옵션을 `true`로 설정하지 않아도, 특정 잡이 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치되도록 지정할 수 있습니다. 이를 위해, 디스패치 작업에 `afterCommit` 메서드를 체이닝하면 됩니다:

```php
use App\Jobs\ProcessPodcast;

ProcessPodcast::dispatch($podcast)->afterCommit();
```

마찬가지로, `after_commit` 설정 옵션이 `true`로 설정된 경우, 특정 잡이 열린 데이터베이스 트랜잭션 커밋을 기다리지 않고 즉시 디스패치되도록 지정할 수 있습니다:

```php
ProcessPodcast::dispatch($podcast)->beforeCommit();
```


### 잡 체이닝 {#job-chaining}

잡 체이닝을 사용하면, 기본 잡이 성공적으로 실행된 후 순차적으로 실행되어야 할 큐잉 잡 목록을 지정할 수 있습니다. 체인 내 잡 중 하나라도 실패하면, 나머지 잡은 실행되지 않습니다. 큐잉 잡 체인을 실행하려면, `Bus` 파사드가 제공하는 `chain` 메서드를 사용할 수 있습니다. Laravel의 커맨드 버스는 큐잉 잡 디스패치의 하위 컴포넌트입니다:

```php
use App\Jobs\OptimizePodcast;
use App\Jobs\ProcessPodcast;
use App\Jobs\ReleasePodcast;
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->dispatch();
```

잡 클래스 인스턴스뿐만 아니라, 클로저도 체이닝할 수 있습니다:

```php
Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    function () {
        Podcast::update(/* ... */);
    },
])->dispatch();
```

> [!WARNING]
> 잡 내에서 `$this->delete()` 메서드를 사용해 잡을 삭제해도 체인된 잡의 처리는 중단되지 않습니다. 체인은 체인 내 잡이 실패할 때만 실행이 중단됩니다.


#### 체인 커넥션 및 큐 {#chain-connection-queue}

체인된 잡에 사용할 커넥션과 큐를 지정하려면, `onConnection` 및 `onQueue` 메서드를 사용할 수 있습니다. 이 메서드는 큐잉 잡이 명시적으로 다른 커넥션/큐에 할당되지 않는 한, 체인된 잡에 사용할 큐 커넥션과 큐 이름을 지정합니다:

```php
Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->onConnection('redis')->onQueue('podcasts')->dispatch();
```


#### 체인에 잡 추가 {#adding-jobs-to-the-chain}

때때로, 체인 내의 다른 잡에서 기존 잡 체인에 잡을 앞이나 뒤에 추가해야 할 수 있습니다. 이를 위해, `prependToChain` 및 `appendToChain` 메서드를 사용할 수 있습니다:

```php
/**
 * 잡 실행
 */
public function handle(): void
{
    // ...

    // 현재 체인 앞에 추가, 현재 잡 직후 실행...
    $this->prependToChain(new TranscribePodcast);

    // 현재 체인 뒤에 추가, 체인 마지막에 실행...
    $this->appendToChain(new TranscribePodcast);
}
```


#### 체인 실패 {#chain-failures}

잡을 체이닝할 때, 체인 내 잡이 실패하면 호출될 클로저를 `catch` 메서드로 지정할 수 있습니다. 지정된 콜백은 잡 실패를 유발한 `Throwable` 인스턴스를 받습니다:

```php
use Illuminate\Support\Facades\Bus;
use Throwable;

Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->catch(function (Throwable $e) {
    // 체인 내 잡이 실패함...
})->dispatch();
```

> [!WARNING]
> 체인 콜백은 직렬화되어 나중에 Laravel 큐에 의해 실행되므로, 콜백 내에서 `$this` 변수를 사용하지 마세요.


### 큐 및 커넥션 커스터마이징 {#customizing-the-queue-and-connection}


#### 특정 큐로 디스패치 {#dispatching-to-a-particular-queue}

잡을 서로 다른 큐에 넣으면, 큐잉 잡을 "카테고리화"하거나, 다양한 큐에 할당할 워커 수를 우선순위별로 조정할 수 있습니다. 이는 큐 설정 파일에 정의된 큐 "커넥션"이 아니라, 단일 커넥션 내의 특정 큐에만 잡을 넣는다는 점에 유의하세요. 큐를 지정하려면, 잡을 디스패치할 때 `onQueue` 메서드를 사용하세요:

```php
<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PodcastController extends Controller
{
    /**
     * 새 팟캐스트 저장
     */
    public function store(Request $request): RedirectResponse
    {
        $podcast = Podcast::create(/* ... */);

        // 팟캐스트 생성...

        ProcessPodcast::dispatch($podcast)->onQueue('processing');

        return redirect('/podcasts');
    }
}
```

또는, 잡 생성자 내에서 `onQueue` 메서드를 호출해 잡의 큐를 지정할 수도 있습니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 잡 인스턴스 생성
     */
    public function __construct()
    {
        $this->onQueue('processing');
    }
}
```


#### 특정 커넥션으로 디스패치 {#dispatching-to-a-particular-connection}

애플리케이션이 여러 큐 커넥션과 상호작용하는 경우, `onConnection` 메서드를 사용해 잡을 보낼 커넥션을 지정할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PodcastController extends Controller
{
    /**
     * 새 팟캐스트 저장
     */
    public function store(Request $request): RedirectResponse
    {
        $podcast = Podcast::create(/* ... */);

        // 팟캐스트 생성...

        ProcessPodcast::dispatch($podcast)->onConnection('sqs');

        return redirect('/podcasts');
    }
}
```

`onConnection`과 `onQueue` 메서드를 함께 체이닝해 잡의 커넥션과 큐를 모두 지정할 수 있습니다:

```php
ProcessPodcast::dispatch($podcast)
    ->onConnection('sqs')
    ->onQueue('processing');
```

또는, 잡 생성자 내에서 `onConnection` 메서드를 호출해 잡의 커넥션을 지정할 수도 있습니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 잡 인스턴스 생성
     */
    public function __construct()
    {
        $this->onConnection('sqs');
    }
}
```


### 최대 잡 시도 횟수/타임아웃 값 지정 {#max-job-attempts-and-timeout}


#### 최대 시도 횟수 {#max-attempts}

큐잉 잡이 에러를 만나면, 무한정 재시도하지 않도록 하고 싶을 것입니다. 따라서, Laravel은 잡이 시도될 수 있는 횟수나 기간을 지정할 수 있는 다양한 방법을 제공합니다.

잡이 시도될 수 있는 최대 횟수를 지정하는 한 가지 방법은 Artisan 커맨드 라인에서 `--tries` 스위치를 사용하는 것입니다. 이는 워커가 처리하는 모든 잡에 적용되며, 처리 중인 잡이 시도 횟수를 별도로 지정하지 않은 경우에만 적용됩니다:

```shell
php artisan queue:work --tries=3
```

잡이 최대 시도 횟수를 초과하면, "실패한" 잡으로 간주됩니다. 실패한 잡 처리에 대한 자세한 내용은 [실패한 잡 문서](#dealing-with-failed-jobs)를 참고하세요. `--tries=0`을 `queue:work` 명령에 제공하면, 잡이 무한정 재시도됩니다.

잡 클래스 자체에서 잡이 시도될 수 있는 최대 횟수를 지정해 더 세밀하게 제어할 수 있습니다. 잡에 최대 시도 횟수가 지정되어 있으면, 커맨드 라인에서 제공된 `--tries` 값보다 우선합니다:

```php
<?php

namespace App\Jobs;

class ProcessPodcast implements ShouldQueue
{
    /**
     * 잡이 시도될 수 있는 횟수
     *
     * @var int
     */
    public $tries = 5;
}
```

특정 잡의 최대 시도 횟수를 동적으로 제어해야 한다면, 잡에 `tries` 메서드를 정의할 수 있습니다:

```php
/**
 * 잡이 시도될 수 있는 횟수 반환
 */
public function tries(): int
{
    return 5;
}
```


#### 시간 기반 시도 {#time-based-attempts}

잡이 실패하기 전 시도 횟수를 지정하는 대신, 잡이 더 이상 시도되지 않아야 할 시간을 정의할 수도 있습니다. 이를 통해, 잡이 주어진 시간 내에 원하는 만큼 시도될 수 있습니다. 잡이 더 이상 시도되지 않아야 할 시간을 정의하려면, 잡 클래스에 `retryUntil` 메서드를 추가하세요. 이 메서드는 `DateTime` 인스턴스를 반환해야 합니다:

```php
use DateTime;

/**
 * 잡이 타임아웃될 시간 반환
 */
public function retryUntil(): DateTime
{
    return now()->addMinutes(10);
}
```

`retryUntil`과 `tries`가 모두 정의된 경우, Laravel은 `retryUntil` 메서드를 우선합니다.

> [!NOTE]
> [큐잉 이벤트 리스너](/laravel/12.x/events#queued-event-listeners)와 [큐잉 알림](/laravel/12.x/notifications#queueing-notifications)에도 `tries` 속성이나 `retryUntil` 메서드를 정의할 수 있습니다.


#### 최대 예외 {#max-exceptions}

잡이 여러 번 시도될 수 있도록 하되, 직접 `release` 메서드로 릴리즈된 경우가 아니라, 지정된 횟수만큼 처리되지 않은 예외가 발생하면 실패하도록 하고 싶을 때가 있습니다. 이를 위해, 잡 클래스에 `maxExceptions` 속성을 정의할 수 있습니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Redis;

class ProcessPodcast implements ShouldQueue
{
    /**
     * 잡이 시도될 수 있는 횟수
     *
     * @var int
     */
    public $tries = 25;

    /**
     * 실패 전 허용할 최대 미처리 예외 수
     *
     * @var int
     */
    public $maxExceptions = 3;

    /**
     * 잡 실행
     */
    public function handle(): void
    {
        Redis::throttle('key')->allow(10)->every(60)->then(function () {
            // 락 획득, 팟캐스트 처리...
        }, function () {
            // 락 획득 실패...
            return $this->release(10);
        });
    }
}
```

이 예제에서, 애플리케이션이 Redis 락을 획득하지 못하면 잡이 10초간 릴리즈되고, 최대 25번까지 재시도됩니다. 하지만, 잡이 3번 미처리 예외를 던지면 실패합니다.


#### 타임아웃 {#timeout}

대개, 큐잉 잡이 얼마나 오래 걸릴지 대략적으로 알 수 있습니다. 이를 위해, Laravel은 "타임아웃" 값을 지정할 수 있습니다. 기본 타임아웃 값은 60초입니다. 잡이 지정된 초보다 오래 처리되면, 잡을 처리하는 워커가 에러와 함께 종료됩니다. 일반적으로, 워커는 [서버에 설정된 프로세스 매니저](#supervisor-configuration)에 의해 자동으로 재시작됩니다.

잡이 실행될 수 있는 최대 초는 Artisan 커맨드 라인에서 `--timeout` 스위치를 사용해 지정할 수 있습니다:

```shell
php artisan queue:work --timeout=30
```

잡이 타임아웃으로 인해 최대 시도 횟수를 초과하면, 실패한 것으로 표시됩니다.

잡 클래스 자체에서 잡이 실행될 수 있는 최대 초를 정의할 수도 있습니다. 잡에 타임아웃이 지정되어 있으면, 커맨드 라인에서 지정한 타임아웃보다 우선합니다:

```php
<?php

namespace App\Jobs;

class ProcessPodcast implements ShouldQueue
{
    /**
     * 잡이 타임아웃되기 전 실행될 수 있는 초
     *
     * @var int
     */
    public $timeout = 120;
}
```

때때로, 소켓이나 외부 HTTP 연결과 같은 IO 블로킹 프로세스는 지정한 타임아웃을 준수하지 않을 수 있습니다. 따라서, 이러한 기능을 사용할 때는 해당 API에서도 타임아웃을 지정해야 합니다. 예를 들어, Guzzle을 사용할 때는 항상 연결 및 요청 타임아웃 값을 지정해야 합니다.

> [!WARNING]
> 잡 타임아웃을 지정하려면 `pcntl` PHP 확장이 설치되어 있어야 합니다. 또한, 잡의 "타임아웃" 값은 항상 ["retry after"](#job-expiration) 값보다 작아야 합니다. 그렇지 않으면, 잡이 실제로 실행 완료 또는 타임아웃되기 전에 재시도될 수 있습니다.


#### 타임아웃 시 실패 처리 {#failing-on-timeout}

잡이 [실패한](#dealing-with-failed-jobs) 것으로 표시되어야 할 때, 잡 클래스에 `$failOnTimeout` 속성을 정의할 수 있습니다:

```php
/**
 * 잡이 타임아웃 시 실패로 표시할지 여부
 *
 * @var bool
 */
public $failOnTimeout = true;
```


### 에러 처리 {#error-handling}

잡이 처리되는 동안 예외가 발생하면, 잡은 자동으로 큐에 다시 릴리즈되어 재시도됩니다. 잡은 애플리케이션에서 허용하는 최대 시도 횟수만큼 계속 릴리즈됩니다. 최대 시도 횟수는 `queue:work` Artisan 명령어의 `--tries` 스위치로 정의됩니다. 또는, 잡 클래스 자체에서 최대 시도 횟수를 정의할 수 있습니다. 큐 워커 실행에 대한 자세한 내용은 [아래에서 확인할 수 있습니다](#running-the-queue-worker).


#### 잡 수동 릴리즈 {#manually-releasing-a-job}

때때로, 잡을 수동으로 큐에 다시 릴리즈해 나중에 다시 시도할 수 있도록 하고 싶을 수 있습니다. 이를 위해, `release` 메서드를 호출하면 됩니다:

```php
/**
 * 잡 실행
 */
public function handle(): void
{
    // ...

    $this->release();
}
```

기본적으로, `release` 메서드는 잡을 즉시 처리할 수 있도록 큐에 다시 릴리즈합니다. 하지만, 정수나 날짜 인스턴스를 `release` 메서드에 전달해 지정된 초가 경과할 때까지 잡이 처리되지 않도록 할 수 있습니다:

```php
$this->release(10);

$this->release(now()->addSeconds(10));
```


#### 잡 수동 실패 처리 {#manually-failing-a-job}

가끔 잡을 "실패"로 수동 표시해야 할 때가 있습니다. 이를 위해, `fail` 메서드를 호출하면 됩니다:

```php
/**
 * 잡 실행
 */
public function handle(): void
{
    // ...

    $this->fail();
}
```

잡이 예외로 인해 실패로 표시되어야 한다면, 예외를 `fail` 메서드에 전달할 수 있습니다. 또는, 편의를 위해 문자열 에러 메시지를 전달하면, 예외로 변환됩니다:

```php
$this->fail($exception);

$this->fail('문제가 발생했습니다.');
```

> [!NOTE]
> 실패한 잡에 대한 자세한 내용은 [잡 실패 처리 문서](#dealing-with-failed-jobs)를 참고하세요.


## 잡 배치 {#job-batching}

Laravel의 잡 배치 기능을 사용하면, 잡 배치를 쉽게 실행하고, 잡 배치가 모두 실행된 후 작업을 수행할 수 있습니다. 시작하기 전에, 잡 배치의 완료율 등 메타 정보를 저장할 테이블을 생성하는 데이터베이스 마이그레이션을 만들어야 합니다. 이 마이그레이션은 `make:queue-batches-table` Artisan 명령어로 생성할 수 있습니다:

```shell
php artisan make:queue-batches-table

php artisan migrate
```


### 배치 가능한 잡 정의 {#defining-batchable-jobs}

배치 가능한 잡을 정의하려면, [큐잉 가능한 잡](#creating-jobs)을 평소처럼 생성하되, 잡 클래스에 `Illuminate\Bus\Batchable` 트레이트를 추가해야 합니다. 이 트레이트는 잡이 실행 중인 현재 배치를 조회할 수 있는 `batch` 메서드를 제공합니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ImportCsv implements ShouldQueue
{
    use Batchable, Queueable;

    /**
     * 잡 실행
     */
    public function handle(): void
    {
        if ($this->batch()->cancelled()) {
            // 배치가 취소되었는지 확인...

            return;
        }

        // CSV 파일의 일부를 가져오기...
    }
}
```


### 배치 디스패치 {#dispatching-batches}

잡 배치를 디스패치하려면, `Bus` 파사드의 `batch` 메서드를 사용해야 합니다. 물론, 배치는 완료 콜백과 함께 사용할 때 가장 유용합니다. 따라서, `then`, `catch`, `finally` 메서드를 사용해 배치의 완료 콜백을 정의할 수 있습니다. 각 콜백은 호출될 때 `Illuminate\Bus\Batch` 인스턴스를 받습니다. 이 예제에서는, 각 잡이 CSV 파일의 일정 행을 처리하는 잡 배치를 큐잉한다고 가정합니다:

```php
use App\Jobs\ImportCsv;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Throwable;

$batch = Bus::batch([
    new ImportCsv(1, 100),
    new ImportCsv(101, 200),
    new ImportCsv(201, 300),
    new ImportCsv(301, 400),
    new ImportCsv(401, 500),
])->before(function (Batch $batch) {
    // 배치가 생성되었지만 아직 잡이 추가되지 않음...
})->progress(function (Batch $batch) {
    // 단일 잡이 성공적으로 완료됨...
})->then(function (Batch $batch) {
    // 모든 잡이 성공적으로 완료됨...
})->catch(function (Batch $batch, Throwable $e) {
    // 첫 번째 배치 잡 실패 감지...
})->finally(function (Batch $batch) {
    // 배치 실행 완료...
})->dispatch();

return $batch->id;
```

배치의 ID는 `$batch->id` 속성으로 접근할 수 있으며, [Laravel 커맨드 버스](#inspecting-batches)를 통해 배치에 대한 정보를 조회할 때 사용할 수 있습니다.

> [!WARNING]
> 배치 콜백은 직렬화되어 나중에 Laravel 큐에 의해 실행되므로, 콜백 내에서 `$this` 변수를 사용하지 마세요. 또한, 배치 잡은 데이터베이스 트랜잭션 내에 래핑되므로, 암시적 커밋을 유발하는 데이터베이스 문은 잡 내에서 실행하지 마세요.


#### 배치 이름 지정 {#naming-batches}

Laravel Horizon, Laravel Telescope와 같은 일부 도구는 배치에 이름이 지정되어 있으면 더 사용자 친화적인 디버그 정보를 제공할 수 있습니다. 배치에 임의의 이름을 지정하려면, 배치 정의 시 `name` 메서드를 호출하면 됩니다:

```php
$batch = Bus::batch([
    // ...
])->then(function (Batch $batch) {
    // 모든 잡이 성공적으로 완료됨...
})->name('Import CSV')->dispatch();
```


#### 배치 커넥션 및 큐 {#batch-connection-queue}

배치 잡에 사용할 커넥션과 큐를 지정하려면, `onConnection` 및 `onQueue` 메서드를 사용할 수 있습니다. 모든 배치 잡은 동일한 커넥션과 큐에서 실행되어야 합니다:

```php
$batch = Bus::batch([
    // ...
])->then(function (Batch $batch) {
    // 모든 잡이 성공적으로 완료됨...
})->onConnection('redis')->onQueue('imports')->dispatch();
```


### 체인과 배치 {#chains-and-batches}

[체인 잡](#job-chaining) 집합을 배열 내에 배치함으로써, 배치 내에서 잡 체인을 정의할 수 있습니다. 예를 들어, 두 개의 잡 체인을 병렬로 실행하고, 두 체인이 모두 처리 완료되면 콜백을 실행할 수 있습니다:

```php
use App\Jobs\ReleasePodcast;
use App\Jobs\SendPodcastReleaseNotification;
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;

Bus::batch([
    [
        new ReleasePodcast(1),
        new SendPodcastReleaseNotification(1),
    ],
    [
        new ReleasePodcast(2),
        new SendPodcastReleaseNotification(2),
    ],
])->then(function (Batch $batch) {
    // ...
})->dispatch();
```

반대로, [체인](#job-chaining) 내에 배치를 정의해 배치 잡을 체인으로 실행할 수도 있습니다. 예를 들어, 여러 팟캐스트를 릴리즈하는 배치 잡을 먼저 실행한 후, 릴리즈 알림을 보내는 배치 잡을 실행할 수 있습니다:

```php
use App\Jobs\FlushPodcastCache;
use App\Jobs\ReleasePodcast;
use App\Jobs\SendPodcastReleaseNotification;
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new FlushPodcastCache,
    Bus::batch([
        new ReleasePodcast(1),
        new ReleasePodcast(2),
    ]),
    Bus::batch([
        new SendPodcastReleaseNotification(1),
        new SendPodcastReleaseNotification(2),
    ]),
])->dispatch();
```


### 배치에 잡 추가 {#adding-jobs-to-batches}

때때로, 배치 잡 내에서 추가 잡을 배치에 추가하는 것이 유용할 수 있습니다. 이 패턴은 수천 개의 잡을 배치해야 하며, 웹 요청 중에 디스패치하기에는 너무 오래 걸릴 때 유용합니다. 대신, 배치를 "로더" 잡으로 먼저 디스패치해, 배치를 더 많은 잡으로 채울 수 있습니다:

```php
$batch = Bus::batch([
    new LoadImportBatch,
    new LoadImportBatch,
    new LoadImportBatch,
])->then(function (Batch $batch) {
    // 모든 잡이 성공적으로 완료됨...
})->name('Import Contacts')->dispatch();
```

이 예제에서는, `LoadImportBatch` 잡을 사용해 배치를 추가 잡으로 채웁니다. 이를 위해, 잡의 `batch` 메서드로 접근할 수 있는 배치 인스턴스의 `add` 메서드를 사용할 수 있습니다:

```php
use App\Jobs\ImportContacts;
use Illuminate\Support\Collection;

/**
 * 잡 실행
 */
public function handle(): void
{
    if ($this->batch()->cancelled()) {
        return;
    }

    $this->batch()->add(Collection::times(1000, function () {
        return new ImportContacts;
    }));
}
```

> [!WARNING]
> 동일한 배치에 속한 잡 내에서만 배치에 잡을 추가할 수 있습니다.


### 배치 조회 {#inspecting-batches}

배치 완료 콜백에 제공되는 `Illuminate\Bus\Batch` 인스턴스에는 주어진 잡 배치와 상호작용하고 조회하는 데 도움이 되는 다양한 속성과 메서드가 있습니다:

```php
// 배치의 UUID...
$batch->id;

// 배치 이름(해당되는 경우)...
$batch->name;

// 배치에 할당된 잡 수...
$batch->totalJobs;

// 큐에서 아직 처리되지 않은 잡 수...
$batch->pendingJobs;

// 실패한 잡 수...
$batch->failedJobs;

// 지금까지 처리된 잡 수...
$batch->processedJobs();

// 배치의 완료율(0-100)...
$batch->progress();

// 배치 실행이 완료되었는지 여부...
$batch->finished();

// 배치 실행 취소...
$batch->cancel();

// 배치가 취소되었는지 여부...
$batch->cancelled();
```


#### 라우트에서 배치 반환 {#returning-batches-from-routes}

모든 `Illuminate\Bus\Batch` 인스턴스는 JSON 직렬화가 가능하므로, 애플리케이션의 라우트에서 직접 반환해 배치의 완료 진행률 등 정보를 포함한 JSON 페이로드를 얻을 수 있습니다. 이를 통해, 애플리케이션 UI에서 배치의 완료 진행률 정보를 쉽게 표시할 수 있습니다.

ID로 배치를 조회하려면, `Bus` 파사드의 `findBatch` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Route;

Route::get('/batch/{batchId}', function (string $batchId) {
    return Bus::findBatch($batchId);
});
```


### 배치 취소 {#cancelling-batches}

때때로, 특정 배치의 실행을 취소해야 할 수 있습니다. 이는 `Illuminate\Bus\Batch` 인스턴스의 `cancel` 메서드를 호출해 수행할 수 있습니다:

```php
/**
 * 잡 실행
 */
public function handle(): void
{
    if ($this->user->exceedsImportLimit()) {
        return $this->batch()->cancel();
    }

    if ($this->batch()->cancelled()) {
        return;
    }
}
```

이전 예제에서 볼 수 있듯이, 배치 잡은 일반적으로 실행을 계속하기 전에 해당 배치가 취소되었는지 확인해야 합니다. 하지만, 편의를 위해 잡에 `SkipIfBatchCancelled` [미들웨어](#job-middleware)를 할당할 수도 있습니다. 이 미들웨어는 해당 배치가 취소된 경우 잡을 처리하지 않도록 Laravel에 지시합니다:

```php
use Illuminate\Queue\Middleware\SkipIfBatchCancelled;

/**
 * 잡이 통과해야 할 미들웨어 반환
 */
public function middleware(): array
{
    return [new SkipIfBatchCancelled];
}
```


### 배치 실패 {#batch-failures}

배치 잡이 실패하면, `catch` 콜백(지정된 경우)이 호출됩니다. 이 콜백은 배치 내에서 처음 실패한 잡에 대해서만 호출됩니다.


#### 실패 허용 {#allowing-failures}

배치 내 잡이 실패하면, Laravel은 자동으로 배치를 "취소됨"으로 표시합니다. 원한다면, 이 동작을 비활성화해 잡 실패가 자동으로 배치를 취소로 표시하지 않도록 할 수 있습니다. 이는 배치를 디스패치할 때 `allowFailures` 메서드를 호출해 수행할 수 있습니다:

```php
$batch = Bus::batch([
    // ...
])->then(function (Batch $batch) {
    // 모든 잡이 성공적으로 완료됨...
})->allowFailures()->dispatch();
```


#### 실패한 배치 잡 재시도 {#retrying-failed-batch-jobs}

편의를 위해, Laravel은 주어진 배치의 모든 실패한 잡을 쉽게 재시도할 수 있는 `queue:retry-batch` Artisan 명령어를 제공합니다. `queue:retry-batch` 명령어는 실패한 잡을 재시도할 배치의 UUID를 인자로 받습니다:

```shell
php artisan queue:retry-batch 32dbc76c-4f82-4749-b610-a639fe0099b5
```


### 배치 정리 {#pruning-batches}

정리를 하지 않으면, `job_batches` 테이블에 레코드가 매우 빠르게 쌓일 수 있습니다. 이를 완화하기 위해, [스케줄러](/laravel/12.x/scheduling)를 사용해 `queue:prune-batches` Artisan 명령어를 매일 실행해야 합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches')->daily();
```

기본적으로, 24시간이 지난 모든 완료된 배치가 정리됩니다. 명령어 호출 시 `hours` 옵션을 사용해 배치 데이터를 얼마나 오래 보관할지 결정할 수 있습니다. 예를 들어, 아래 명령어는 48시간이 지난 모든 완료된 배치를 삭제합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches --hours=48')->daily();
```

때때로, `jobs_batches` 테이블에 성공적으로 완료되지 않은 배치(예: 잡이 실패하고 재시도되지 않은 배치)의 레코드가 쌓일 수 있습니다. `queue:prune-batches` 명령어에 `unfinished` 옵션을 사용해 이러한 미완료 배치 레코드를 정리할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches --hours=48 --unfinished=72')->daily();
```

마찬가지로, `jobs_batches` 테이블에 취소된 배치의 레코드가 쌓일 수 있습니다. `queue:prune-batches` 명령어에 `cancelled` 옵션을 사용해 이러한 취소된 배치 레코드를 정리할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches --hours=48 --cancelled=72')->daily();
```


### DynamoDB에 배치 저장 {#storing-batches-in-dynamodb}

Laravel은 [DynamoDB](https://aws.amazon.com/dynamodb)에 배치 메타 정보를 저장하는 것도 지원합니다. 하지만, 모든 배치 레코드를 저장할 DynamoDB 테이블을 수동으로 생성해야 합니다.

일반적으로, 이 테이블 이름은 `job_batches`여야 하지만, 애플리케이션의 `queue` 설정 파일 내 `queue.batching.table` 설정 값에 따라 테이블 이름을 지정해야 합니다.


#### DynamoDB 배치 테이블 설정 {#dynamodb-batch-table-configuration}

`job_batches` 테이블에는 문자열 기본 파티션 키 `application`과 문자열 기본 정렬 키 `id`가 있어야 합니다. `application` 키에는 애플리케이션의 `app` 설정 파일 내 `name` 설정 값이 들어갑니다. 애플리케이션 이름이 DynamoDB 테이블 키의 일부이므로, 여러 Laravel 애플리케이션의 잡 배치를 동일한 테이블에 저장할 수 있습니다.

또한, [자동 배치 정리](#pruning-batches-in-dynamodb)를 활용하려면 테이블에 `ttl` 속성을 정의할 수 있습니다.


#### DynamoDB 설정 {#dynamodb-configuration}

다음으로, Laravel 애플리케이션이 Amazon DynamoDB와 통신할 수 있도록 AWS SDK를 설치하세요:

```shell
composer require aws/aws-sdk-php
```

그런 다음, `queue.batching.driver` 설정 값을 `dynamodb`로 지정하세요. 또한, `batching` 설정 배열 내에 `key`, `secret`, `region` 설정 옵션을 정의해야 합니다. 이 옵션들은 AWS 인증에 사용됩니다. `dynamodb` 드라이버를 사용할 때는 `queue.batching.database` 설정 옵션이 필요하지 않습니다:

```php
'batching' => [
    'driver' => env('QUEUE_BATCHING_DRIVER', 'dynamodb'),
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => 'job_batches',
],
```


#### DynamoDB에서 배치 정리 {#pruning-batches-in-dynamodb}

[DynamoDB](https://aws.amazon.com/dynamodb)에 잡 배치 정보를 저장할 때, 관계형 데이터베이스에 저장된 배치를 정리하는 데 사용하는 일반적인 정리 명령어는 작동하지 않습니다. 대신, [DynamoDB의 기본 TTL 기능](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)을 활용해 오래된 배치 레코드를 자동으로 제거할 수 있습니다.

DynamoDB 테이블에 `ttl` 속성을 정의했다면, Laravel에 배치 레코드를 어떻게 정리할지 지시하는 설정 파라미터를 정의할 수 있습니다. `queue.batching.ttl_attribute` 설정 값은 TTL을 보유하는 속성의 이름을 정의하고, `queue.batching.ttl` 설정 값은 레코드가 마지막으로 업데이트된 시점 기준으로 배치 레코드를 DynamoDB 테이블에서 제거할 수 있는 초 단위 시간을 정의합니다:

```php
'batching' => [
    'driver' => env('QUEUE_FAILED_DRIVER', 'dynamodb'),
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => 'job_batches',
    'ttl_attribute' => 'ttl',
    'ttl' => 60 * 60 * 24 * 7, // 7일...
],
```


## 클로저 큐잉 {#queueing-closures}

잡 클래스를 큐에 디스패치하는 대신, 클로저도 큐에 디스패치할 수 있습니다. 이는 현재 요청 사이클 외부에서 실행해야 하는 간단한 작업에 적합합니다. 클로저를 큐에 디스패치할 때, 클로저의 코드 내용은 암호학적으로 서명되어 전송 중에 수정될 수 없습니다:

```php
$podcast = App\Podcast::find(1);

dispatch(function () use ($podcast) {
    $podcast->publish();
});
```

큐잉된 클로저에 이름을 지정해 큐 리포팅 대시보드에서 사용하거나, `queue:work` 명령어에서 표시하려면, `name` 메서드를 사용할 수 있습니다:

```php
dispatch(function () {
    // ...
})->name('Publish Podcast');
```

`catch` 메서드를 사용해, 큐잉된 클로저가 [설정된 재시도 횟수](#max-job-attempts-and-timeout)를 모두 소진한 후에도 성공적으로 완료되지 않으면 실행할 클로저를 지정할 수 있습니다:

```php
use Throwable;

dispatch(function () use ($podcast) {
    $podcast->publish();
})->catch(function (Throwable $e) {
    // 이 잡이 실패함...
});
```

> [!WARNING]
> `catch` 콜백은 직렬화되어 나중에 Laravel 큐에 의해 실행되므로, 콜백 내에서 `$this` 변수를 사용하지 마세요.


## 큐 워커 실행 {#running-the-queue-worker}


### `queue:work` 명령어 {#the-queue-work-command}

Laravel에는 큐 워커를 시작하고, 큐에 쌓인 새 잡을 처리하는 Artisan 명령어가 포함되어 있습니다. `queue:work` Artisan 명령어를 사용해 워커를 실행할 수 있습니다. `queue:work` 명령어가 시작되면, 수동으로 중지하거나 터미널을 닫을 때까지 계속 실행됩니다:

```shell
php artisan queue:work
```

> [!NOTE]
> `queue:work` 프로세스를 백그라운드에서 영구적으로 실행하려면, [Supervisor](#supervisor-configuration)와 같은 프로세스 모니터를 사용해 큐 워커가 중단되지 않도록 해야 합니다.

처리된 잡 ID를 명령어 출력에 포함하려면, `queue:work` 명령어 실행 시 `-v` 플래그를 포함할 수 있습니다:

```shell
php artisan queue:work -v
```

큐 워커는 장시간 실행되는 프로세스이며, 부팅된 애플리케이션 상태를 메모리에 저장합니다. 따라서, 시작된 후 코드베이스의 변경 사항을 인식하지 못합니다. 배포 과정에서 반드시 [큐 워커를 재시작](#queue-workers-and-deployment)해야 합니다. 또한, 애플리케이션에서 생성되거나 수정된 모든 정적 상태는 잡 간에 자동으로 리셋되지 않음을 기억하세요.

또는, `queue:listen` 명령어를 실행할 수도 있습니다. `queue:listen` 명령어를 사용할 때는, 코드 업데이트나 애플리케이션 상태를 리셋하려면 워커를 수동으로 재시작할 필요가 없습니다. 하지만, 이 명령어는 `queue:work` 명령어보다 훨씬 비효율적입니다:

```shell
php artisan queue:listen
```


#### 여러 큐 워커 실행 {#running-multiple-queue-workers}

큐에 여러 워커를 할당해 잡을 동시에 처리하려면, 단순히 여러 개의 `queue:work` 프로세스를 시작하면 됩니다. 이는 로컬에서는 터미널의 여러 탭을 통해, 프로덕션에서는 프로세스 매니저의 설정을 통해 할 수 있습니다. [Supervisor 사용 시](#supervisor-configuration), `numprocs` 설정 값을 사용할 수 있습니다.


#### 커넥션 및 큐 지정 {#specifying-the-connection-queue}

워커가 사용할 큐 커넥션을 지정할 수도 있습니다. `work` 명령어에 전달된 커넥션 이름은 `config/queue.php` 설정 파일에 정의된 커넥션 중 하나와 일치해야 합니다:

```shell
php artisan queue:work redis
```

기본적으로, `queue:work` 명령어는 주어진 커넥션의 기본 큐에 대해서만 잡을 처리합니다. 하지만, 특정 커넥션의 특정 큐만 처리하도록 큐 워커를 더 세밀하게 커스터마이즈할 수 있습니다. 예를 들어, 모든 이메일이 `redis` 큐 커넥션의 `emails` 큐에서 처리된다면, 해당 큐만 처리하는 워커를 다음과 같이 시작할 수 있습니다:

```shell
php artisan queue:work redis --queue=emails
```


#### 지정된 수의 잡 처리 {#processing-a-specified-number-of-jobs}

`--once` 옵션을 사용해 워커가 큐에서 단일 잡만 처리하도록 지시할 수 있습니다:

```shell
php artisan queue:work --once
```

`--max-jobs` 옵션을 사용해 워커가 지정된 수의 잡을 처리한 후 종료하도록 할 수 있습니다. 이 옵션은 [Supervisor](#supervisor-configuration)와 함께 사용하면, 워커가 지정된 수의 잡을 처리한 후 자동으로 재시작되어 누적된 메모리를 해제할 수 있습니다:

```shell
php artisan queue:work --max-jobs=1000
```


#### 모든 큐잉 잡 처리 후 종료 {#processing-all-queued-jobs-then-exiting}

`--stop-when-empty` 옵션을 사용해 워커가 모든 잡을 처리한 후 정상적으로 종료하도록 할 수 있습니다. 이 옵션은 Docker 컨테이너 내에서 Laravel 큐를 처리할 때, 큐가 비면 컨테이너를 종료하고자 할 때 유용합니다:

```shell
php artisan queue:work --stop-when-empty
```


#### 지정된 초 동안 잡 처리 {#processing-jobs-for-a-given-number-of-seconds}

`--max-time` 옵션을 사용해 워커가 지정된 초 동안 잡을 처리한 후 종료하도록 할 수 있습니다. 이 옵션은 [Supervisor](#supervisor-configuration)와 함께 사용하면, 워커가 지정된 시간 동안 잡을 처리한 후 자동으로 재시작되어 누적된 메모리를 해제할 수 있습니다:

```shell
# 한 시간 동안 잡을 처리한 후 종료...
php artisan queue:work --max-time=3600
```


#### 워커 슬립 지속 시간 {#worker-sleep-duration}

큐에 잡이 있으면, 워커는 잡 간에 지연 없이 계속 잡을 처리합니다. 하지만, `sleep` 옵션은 잡이 없을 때 워커가 "슬립"할 초를 결정합니다. 슬립 중에는 워커가 새 잡을 처리하지 않습니다:

```shell
php artisan queue:work --sleep=3
```


#### 유지보수 모드와 큐 {#maintenance-mode-queues}

애플리케이션이 [유지보수 모드](/laravel/12.x/configuration#maintenance-mode)일 때는 큐잉 잡이 처리되지 않습니다. 애플리케이션이 유지보수 모드에서 벗어나면 잡이 정상적으로 처리됩니다.

유지보수 모드가 활성화되어 있어도 큐 워커가 잡을 처리하도록 하려면, `--force` 옵션을 사용할 수 있습니다:

```shell
php artisan queue:work --force
```


#### 리소스 고려사항 {#resource-considerations}

데몬 큐 워커는 각 잡을 처리하기 전에 프레임워크를 "재부팅"하지 않습니다. 따라서, 각 잡이 완료된 후 무거운 리소스를 해제해야 합니다. 예를 들어, GD 라이브러리로 이미지 조작을 한다면, 이미지 처리가 끝난 후 `imagedestroy`로 메모리를 해제해야 합니다.


### 큐 우선순위 {#queue-priorities}

때때로, 큐 처리 우선순위를 지정하고 싶을 수 있습니다. 예를 들어, `config/queue.php` 설정 파일에서 `redis` 커넥션의 기본 `queue`를 `low`로 설정할 수 있습니다. 하지만, 때때로 잡을 `high` 우선순위 큐에 넣고 싶을 수 있습니다:

```php
dispatch((new Job)->onQueue('high'));
```

`high` 큐의 잡이 모두 처리된 후에만 `low` 큐의 잡을 처리하도록 워커를 시작하려면, 큐 이름을 쉼표로 구분해 `work` 명령어에 전달하면 됩니다:

```shell
php artisan queue:work --queue=high,low
```


### 큐 워커와 배포 {#queue-workers-and-deployment}

큐 워커는 장시간 실행되는 프로세스이므로, 코드를 변경해도 워커가 이를 인식하지 못합니다. 따라서, 큐 워커를 사용하는 애플리케이션을 배포하는 가장 간단한 방법은 배포 과정에서 워커를 재시작하는 것입니다. `queue:restart` 명령어를 실행해 모든 워커를 정상적으로 재시작할 수 있습니다:

```shell
php artisan queue:restart
```

이 명령어는 모든 큐 워커에게 현재 잡 처리가 끝난 후 정상적으로 종료하라고 지시하므로, 기존 잡이 손실되지 않습니다. 큐 워커가 `queue:restart` 명령어 실행 시 종료되므로, [Supervisor](#supervisor-configuration)와 같은 프로세스 매니저를 사용해 큐 워커를 자동으로 재시작해야 합니다.

> [!NOTE]
> 큐는 [캐시](/laravel/12.x/cache)를 사용해 재시작 신호를 저장하므로, 이 기능을 사용하기 전에 애플리케이션에 캐시 드라이버가 올바르게 설정되어 있는지 확인해야 합니다.


### 잡 만료 및 타임아웃 {#job-expirations-and-timeouts}


#### 잡 만료 {#job-expiration}

`config/queue.php` 설정 파일에서 각 큐 커넥션은 `retry_after` 옵션을 정의합니다. 이 옵션은 큐 커넥션이 처리 중인 잡을 재시도하기 전에 대기할 초를 지정합니다. 예를 들어, `retry_after` 값이 `90`이면, 잡이 90초 동안 처리 중이면서 릴리즈되거나 삭제되지 않으면 큐에 다시 릴리즈됩니다. 일반적으로, `retry_after` 값은 잡이 합리적으로 완료될 수 있는 최대 초로 설정해야 합니다.

> [!WARNING]
> `retry_after` 값을 포함하지 않는 유일한 큐 커넥션은 Amazon SQS입니다. SQS는 AWS 콘솔에서 관리되는 [기본 가시성 타임아웃(Default Visibility Timeout)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/AboutVT.html)에 따라 잡을 재시도합니다.


#### 워커 타임아웃 {#worker-timeouts}

`queue:work` Artisan 명령어는 `--timeout` 옵션을 제공합니다. 기본적으로, `--timeout` 값은 60초입니다. 잡이 지정된 초보다 오래 처리되면, 잡을 처리하는 워커가 에러와 함께 종료됩니다. 일반적으로, 워커는 [서버에 설정된 프로세스 매니저](#supervisor-configuration)에 의해 자동으로 재시작됩니다:

```shell
php artisan queue:work --timeout=60
```

`retry_after` 설정 옵션과 `--timeout` CLI 옵션은 다르지만, 잡이 손실되지 않고 한 번만 성공적으로 처리되도록 함께 작동합니다.

> [!WARNING]
> `--timeout` 값은 항상 `retry_after` 설정 값보다 몇 초 이상 짧아야 합니다. 이렇게 하면, 워커가 멈춘 잡을 재시도 전에 항상 종료하도록 보장할 수 있습니다. `--timeout` 옵션이 `retry_after` 값보다 길면, 잡이 두 번 처리될 수 있습니다.


## Supervisor 설정 {#supervisor-configuration}

프로덕션 환경에서는 `queue:work` 프로세스가 계속 실행되도록 해야 합니다. `queue:work` 프로세스는 워커 타임아웃 초과, `queue:restart` 명령어 실행 등 다양한 이유로 중단될 수 있습니다.

따라서, `queue:work` 프로세스가 종료되면 이를 감지해 자동으로 재시작하는 프로세스 모니터를 설정해야 합니다. 또한, 프로세스 모니터를 사용하면 동시에 실행할 `queue:work` 프로세스 수를 지정할 수 있습니다. Supervisor는 Linux 환경에서 일반적으로 사용되는 프로세스 모니터이며, 아래에서 설정 방법을 설명합니다.


#### Supervisor 설치 {#installing-supervisor}

Supervisor는 Linux 운영체제용 프로세스 모니터로, `queue:work` 프로세스가 실패하면 자동으로 재시작합니다. Ubuntu에 Supervisor를 설치하려면, 다음 명령어를 사용할 수 있습니다:

```shell
sudo apt-get install supervisor
```

> [!NOTE]
> Supervisor 설정 및 관리가 부담스럽다면, [Laravel Cloud](https://cloud.laravel.com)를 고려해보세요. Laravel Cloud는 Laravel 큐 워커 실행을 위한 완전 관리형 플랫폼을 제공합니다.


#### Supervisor 설정 {#configuring-supervisor}

Supervisor 설정 파일은 일반적으로 `/etc/supervisor/conf.d` 디렉터리에 저장됩니다. 이 디렉터리 내에, 프로세스 모니터링 방법을 Supervisor에 지시하는 설정 파일을 원하는 만큼 생성할 수 있습니다. 예를 들어, `queue:work` 프로세스를 시작하고 모니터링하는 `laravel-worker.conf` 파일을 생성해봅시다:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/forge/app.com/artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=forge
numprocs=8
redirect_stderr=true
stdout_logfile=/home/forge/app.com/worker.log
stopwaitsecs=3600
```

이 예제에서, `numprocs` 지시어는 Supervisor가 8개의 `queue:work` 프로세스를 실행하고 모두 모니터링하도록 지시합니다. 설정의 `command` 지시어는 원하는 큐 커넥션 및 워커 옵션에 맞게 변경해야 합니다.

> [!WARNING]
> `stopwaitsecs` 값이 가장 오래 실행되는 잡의 소요 시간보다 커야 합니다. 그렇지 않으면, Supervisor가 잡이 처리 완료 전에 잡을 종료할 수 있습니다.


#### Supervisor 시작 {#starting-supervisor}

설정 파일을 생성한 후, 다음 명령어를 사용해 Supervisor 설정을 업데이트하고 프로세스를 시작할 수 있습니다:

```shell
sudo supervisorctl reread

sudo supervisorctl update

sudo supervisorctl start "laravel-worker:*"
```

Supervisor에 대한 자세한 내용은 [Supervisor 문서](http://supervisord.org/index.html)를 참고하세요.


## 실패한 잡 처리 {#dealing-with-failed-jobs}

때때로 큐잉 잡이 실패할 수 있습니다. 걱정하지 마세요, 모든 일이 항상 계획대로 되지는 않습니다! Laravel은 [잡이 시도될 수 있는 최대 횟수](#max-job-attempts-and-timeout)를 지정할 수 있는 편리한 방법을 제공합니다. 비동기 잡이 이 횟수를 초과하면, `failed_jobs` 데이터베이스 테이블에 삽입됩니다. [동기적으로 디스패치된 잡](/laravel/12.x/queues#synchronous-dispatching)이 실패하면 이 테이블에 저장되지 않고, 예외가 즉시 애플리케이션에서 처리됩니다.

새로운 Laravel 애플리케이션에는 `failed_jobs` 테이블을 생성하는 마이그레이션이 일반적으로 이미 포함되어 있습니다. 하지만, 애플리케이션에 이 테이블에 대한 마이그레이션이 없다면, `make:queue-failed-table` 명령어로 마이그레이션을 생성할 수 있습니다:

```shell
php artisan make:queue-failed-table

php artisan migrate
```

[큐 워커](#running-the-queue-worker) 프로세스를 실행할 때, `queue:work` 명령어의 `--tries` 스위치를 사용해 잡이 시도될 수 있는 최대 횟수를 지정할 수 있습니다. `--tries` 옵션에 값을 지정하지 않으면, 잡은 한 번만 시도되거나 잡 클래스의 `$tries` 속성에 지정된 횟수만큼 시도됩니다:

```shell
php artisan queue:work redis --tries=3
```

`--backoff` 옵션을 사용해, 예외가 발생한 잡을 재시도하기 전 Laravel이 대기할 초를 지정할 수 있습니다. 기본적으로, 잡은 즉시 큐에 다시 릴리즈되어 재시도됩니다:

```shell
php artisan queue:work redis --tries=3 --backoff=3
```

잡별로 예외 발생 후 재시도 전 대기할 초를 지정하려면, 잡 클래스에 `backoff` 속성을 정의하면 됩니다:

```php
/**
 * 잡을 재시도하기 전 대기할 초
 *
 * @var int
 */
public $backoff = 3;
```

잡의 backoff 시간을 더 복잡하게 제어해야 한다면, 잡 클래스에 `backoff` 메서드를 정의할 수 있습니다:

```php
/**
 * 잡을 재시도하기 전 대기할 초 계산
 */
public function backoff(): int
{
    return 3;
}
```

`backoff` 메서드에서 backoff 값 배열을 반환해 "지수" backoff를 쉽게 구성할 수 있습니다. 아래 예제에서는, 첫 번째 재시도는 1초, 두 번째는 5초, 세 번째는 10초, 이후 남은 시도는 모두 10초의 지연이 적용됩니다:

```php
/**
 * 잡을 재시도하기 전 대기할 초 계산
 *
 * @return array<int, int>
 */
public function backoff(): array
{
    return [1, 5, 10];
}
```


### 실패한 잡 정리 {#cleaning-up-after-failed-jobs}

특정 잡이 실패하면, 사용자에게 알림을 보내거나 잡이 부분적으로 완료한 작업을 되돌리고 싶을 수 있습니다. 이를 위해, 잡 클래스에 `failed` 메서드를 정의할 수 있습니다. 잡이 실패한 원인이 되는 `Throwable` 인스턴스가 `failed` 메서드에 전달됩니다:

```php
<?php

namespace App\Jobs;

use App\Models\Podcast;
use App\Services\AudioProcessor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 잡 인스턴스 생성
     */
    public function __construct(
        public Podcast $podcast,
    ) {}

    /**
     * 잡 실행
     */
    public function handle(AudioProcessor $processor): void
    {
        // 업로드된 팟캐스트 처리...
    }

    /**
     * 잡 실패 처리
     */
    public function failed(?Throwable $exception): void
    {
        // 실패 알림 전송 등...
    }
}
```

> [!WARNING]
> `failed` 메서드가 호출되기 전에 잡의 새 인스턴스가 인스턴스화되므로, `handle` 메서드 내에서 변경된 클래스 속성은 모두 사라집니다.


### 실패한 잡 재시도 {#retrying-failed-jobs}

`failed_jobs` 데이터베이스 테이블에 삽입된 모든 실패한 잡을 조회하려면, `queue:failed` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan queue:failed
```

`queue:failed` 명령어는 잡 ID, 커넥션, 큐, 실패 시간 등 잡에 대한 정보를 나열합니다. 잡 ID는 실패한 잡을 재시도할 때 사용할 수 있습니다. 예를 들어, ID가 `ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece`인 실패한 잡을 재시도하려면 다음 명령어를 실행하세요:

```shell
php artisan queue:retry ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece
```

필요하다면, 여러 ID를 명령어에 전달할 수 있습니다:

```shell
php artisan queue:retry ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece 91401d2c-0784-4f43-824c-34f94a33c24d
```

특정 큐의 모든 실패한 잡을 재시도할 수도 있습니다:

```shell
php artisan queue:retry --queue=name
```

모든 실패한 잡을 재시도하려면, `queue:retry` 명령어에 `all`을 ID로 전달하세요:

```shell
php artisan queue:retry all
```

실패한 잡을 삭제하려면, `queue:forget` 명령어를 사용할 수 있습니다:

```shell
php artisan queue:forget 91401d2c-0784-4f43-824c-34f94a33c24d
```

> [!NOTE]
> [Horizon](/laravel/12.x/horizon)을 사용하는 경우, `queue:forget` 명령어 대신 `horizon:forget` 명령어로 실패한 잡을 삭제해야 합니다.

`failed_jobs` 테이블에서 모든 실패한 잡을 삭제하려면, `queue:flush` 명령어를 사용할 수 있습니다:

```shell
php artisan queue:flush
```


### 누락된 모델 무시 {#ignoring-missing-models}

Eloquent 모델을 잡에 주입하면, 모델이 큐에 쌓이기 전에 자동으로 직렬화되고, 잡이 처리될 때 데이터베이스에서 다시 조회됩니다. 하지만, 잡이 워커에 의해 처리되기 전 모델이 삭제된 경우, 잡이 `ModelNotFoundException`으로 실패할 수 있습니다.

편의를 위해, 잡의 `deleteWhenMissingModels` 속성을 `true`로 설정해 누락된 모델이 있는 잡을 자동으로 삭제할 수 있습니다. 이 속성이 `true`로 설정되면, Laravel은 예외를 발생시키지 않고 조용히 잡을 폐기합니다:

```php
/**
 * 모델이 더 이상 존재하지 않으면 잡 삭제
 *
 * @var bool
 */
public $deleteWhenMissingModels = true;
```


### 실패한 잡 정리 {#pruning-failed-jobs}

애플리케이션의 `failed_jobs` 테이블에서 레코드를 정리하려면, `queue:prune-failed` Artisan 명령어를 실행하세요:

```shell
php artisan queue:prune-failed
```

기본적으로, 24시간이 지난 모든 실패한 잡 레코드가 정리됩니다. 명령어에 `--hours` 옵션을 제공하면, 최근 N시간 내에 삽입된 실패한 잡 레코드만 유지됩니다. 예를 들어, 아래 명령어는 48시간이 지난 모든 실패한 잡 레코드를 삭제합니다:

```shell
php artisan queue:prune-failed --hours=48
```


### DynamoDB에 실패한 잡 저장 {#storing-failed-jobs-in-dynamodb}

Laravel은 [DynamoDB](https://aws.amazon.com/dynamodb)에 실패한 잡 레코드를 저장하는 것도 지원합니다. 하지만, 모든 실패한 잡 레코드를 저장할 DynamoDB 테이블을 수동으로 생성해야 합니다. 일반적으로, 이 테이블 이름은 `failed_jobs`여야 하지만, 애플리케이션의 `queue` 설정 파일 내 `queue.failed.table` 설정 값에 따라 테이블 이름을 지정해야 합니다.

`failed_jobs` 테이블에는 문자열 기본 파티션 키 `application`과 문자열 기본 정렬 키 `uuid`가 있어야 합니다. `application` 키에는 애플리케이션의 `app` 설정 파일 내 `name` 설정 값이 들어갑니다. 애플리케이션 이름이 DynamoDB 테이블 키의 일부이므로, 여러 Laravel 애플리케이션의 실패한 잡을 동일한 테이블에 저장할 수 있습니다.

또한, Laravel 애플리케이션이 Amazon DynamoDB와 통신할 수 있도록 AWS SDK를 설치해야 합니다:

```shell
composer require aws/aws-sdk-php
```

다음으로, `queue.failed.driver` 설정 값을 `dynamodb`로 지정하세요. 또한, 실패한 잡 설정 배열 내에 `key`, `secret`, `region` 설정 옵션을 정의해야 합니다. 이 옵션들은 AWS 인증에 사용됩니다. `dynamodb` 드라이버를 사용할 때는 `queue.failed.database` 설정 옵션이 필요하지 않습니다:

```php
'failed' => [
    'driver' => env('QUEUE_FAILED_DRIVER', 'dynamodb'),
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => 'failed_jobs',
],
```


### 실패한 잡 저장 비활성화 {#disabling-failed-job-storage}

`queue.failed.driver` 설정 값을 `null`로 지정해 Laravel이 실패한 잡을 저장하지 않고 폐기하도록 할 수 있습니다. 일반적으로, 이는 `QUEUE_FAILED_DRIVER` 환경 변수로 지정할 수 있습니다:

```ini
QUEUE_FAILED_DRIVER=null
```


### 실패한 잡 이벤트 {#failed-job-events}

잡이 실패할 때 호출될 이벤트 리스너를 등록하려면, `Queue` 파사드의 `failing` 메서드를 사용할 수 있습니다. 예를 들어, Laravel에 포함된 `AppServiceProvider`의 `boot` 메서드에서 이 이벤트에 클로저를 연결할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;
use Illuminate\Queue\Events\JobFailed;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 등록
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스 부트스트랩
     */
    public function boot(): void
    {
        Queue::failing(function (JobFailed $event) {
            // $event->connectionName
            // $event->job
            // $event->exception
        });
    }
}
```


## 큐에서 잡 삭제 {#clearing-jobs-from-queues}

> [!NOTE]
> [Horizon](/laravel/12.x/horizon)을 사용하는 경우, `queue:clear` 명령어 대신 `horizon:clear` 명령어로 큐에서 잡을 삭제해야 합니다.

기본 커넥션의 기본 큐에서 모든 잡을 삭제하려면, `queue:clear` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan queue:clear
```

특정 커넥션과 큐에서 잡을 삭제하려면, `connection` 인자와 `queue` 옵션을 제공할 수 있습니다:

```shell
php artisan queue:clear redis --queue=emails
```

> [!WARNING]
> 큐에서 잡을 삭제하는 기능은 SQS, Redis, 데이터베이스 큐 드라이버에서만 사용할 수 있습니다. 또한, SQS 메시지 삭제 과정은 최대 60초가 소요되므로, 큐를 삭제한 후 60초 이내에 SQS 큐로 전송된 잡도 삭제될 수 있습니다.


## 큐 모니터링 {#monitoring-your-queues}

큐에 갑자기 잡이 몰리면, 큐가 과부하되어 잡 완료 대기 시간이 길어질 수 있습니다. 원한다면, Laravel이 큐 잡 수가 지정된 임계값을 초과할 때 알림을 보낼 수 있습니다.

시작하려면, [매 분마다 실행](/laravel/12.x/scheduling)되도록 `queue:monitor` 명령어를 스케줄링해야 합니다. 이 명령어는 모니터링할 큐 이름과 원하는 잡 수 임계값을 인자로 받습니다:

```shell
php artisan queue:monitor redis:default,redis:deployments --max=100
```

이 명령어만 스케줄링하는 것으로는 큐 과부하 상태를 알리는 알림이 트리거되지 않습니다. 명령어가 잡 수가 임계값을 초과한 큐를 발견하면, `Illuminate\Queue\Events\QueueBusy` 이벤트가 디스패치됩니다. 이 이벤트를 애플리케이션의 `AppServiceProvider`에서 리스닝해, 개발팀이나 본인에게 알림을 보낼 수 있습니다:

```php
use App\Notifications\QueueHasLongWaitTime;
use Illuminate\Queue\Events\QueueBusy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

/**
 * 애플리케이션 서비스 부트스트랩
 */
public function boot(): void
{
    Event::listen(function (QueueBusy $event) {
        Notification::route('mail', 'dev@example.com')
            ->notify(new QueueHasLongWaitTime(
                $event->connection,
                $event->queue,
                $event->size
            ));
    });
}
```


## 테스트 {#testing}

잡을 디스패치하는 코드를 테스트할 때, 잡 자체를 실제로 실행하지 않도록 Laravel에 지시하고 싶을 수 있습니다. 잡의 코드는 직접, 디스패치 코드와 별도로 테스트할 수 있기 때문입니다. 잡 자체를 테스트하려면, 잡 인스턴스를 생성해 테스트에서 `handle` 메서드를 직접 호출하면 됩니다.

`Queue` 파사드의 `fake` 메서드를 사용해 큐잉 잡이 실제로 큐에 쌓이지 않도록 할 수 있습니다. `Queue` 파사드의 `fake` 메서드를 호출한 후, 애플리케이션이 잡을 큐에 넣으려 했는지 단언할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Jobs\AnotherJob;
use App\Jobs\FinalJob;
use App\Jobs\ShipOrder;
use Illuminate\Support\Facades\Queue;

test('orders can be shipped', function () {
    Queue::fake();

    // 주문 배송 수행...

    // 잡이 푸시되지 않았는지 단언...
    Queue::assertNothingPushed();

    // 특정 큐에 잡이 푸시되었는지 단언...
    Queue::assertPushedOn('queue-name', ShipOrder::class);

    // 잡이 두 번 푸시되었는지 단언...
    Queue::assertPushed(ShipOrder::class, 2);

    // 잡이 푸시되지 않았는지 단언...
    Queue::assertNotPushed(AnotherJob::class);

    // 클로저가 큐에 푸시되었는지 단언...
    Queue::assertClosurePushed();

    // 푸시된 잡의 총 개수 단언...
    Queue::assertCount(3);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Jobs\AnotherJob;
use App\Jobs\FinalJob;
use App\Jobs\ShipOrder;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_orders_can_be_shipped(): void
    {
        Queue::fake();

        // 주문 배송 수행...

        // 잡이 푸시되지 않았는지 단언...
        Queue::assertNothingPushed();

        // 특정 큐에 잡이 푸시되었는지 단언...
        Queue::assertPushedOn('queue-name', ShipOrder::class);

        // 잡이 두 번 푸시되었는지 단언...
        Queue::assertPushed(ShipOrder::class, 2);

        // 잡이 푸시되지 않았는지 단언...
        Queue::assertNotPushed(AnotherJob::class);

        // 클로저가 큐에 푸시되었는지 단언...
        Queue::assertClosurePushed();

        // 푸시된 잡의 총 개수 단언...
        Queue::assertCount(3);
    }
}
```
:::
`assertPushed` 또는 `assertNotPushed` 메서드에 클로저를 전달해, 주어진 "진리 테스트"를 통과하는 잡이 푸시되었는지 단언할 수 있습니다. 최소 하나의 잡이 진리 테스트를 통과하면 단언이 성공합니다:

```php
Queue::assertPushed(function (ShipOrder $job) use ($order) {
    return $job->order->id === $order->id;
});
```


### 일부 잡만 페이크하기 {#faking-a-subset-of-jobs}

특정 잡만 페이크하고, 나머지 잡은 정상적으로 실행되도록 하려면, 페이크할 잡 클래스 이름을 `fake` 메서드에 전달하면 됩니다:
::: code-group
```php [Pest]
test('orders can be shipped', function () {
    Queue::fake([
        ShipOrder::class,
    ]);

    // 주문 배송 수행...

    // 잡이 두 번 푸시되었는지 단언...
    Queue::assertPushed(ShipOrder::class, 2);
});
```

```php [PHPUnit]
public function test_orders_can_be_shipped(): void
{
    Queue::fake([
        ShipOrder::class,
    ]);

    // 주문 배송 수행...

    // 잡이 두 번 푸시되었는지 단언...
    Queue::assertPushed(ShipOrder::class, 2);
}
```
:::
`except` 메서드를 사용해, 지정한 잡을 제외한 모든 잡을 페이크할 수도 있습니다:

```php
Queue::fake()->except([
    ShipOrder::class,
]);
```


### 잡 체인 테스트 {#testing-job-chains}

잡 체인을 테스트하려면, `Bus` 파사드의 페이크 기능을 활용해야 합니다. `Bus` 파사드의 `assertChained` 메서드는 [잡 체인](/laravel/12.x/queues#job-chaining)이 디스패치되었는지 단언할 때 사용할 수 있습니다. `assertChained` 메서드는 체인된 잡 배열을 첫 번째 인자로 받습니다:

```php
use App\Jobs\RecordShipment;
use App\Jobs\ShipOrder;
use App\Jobs\UpdateInventory;
use Illuminate\Support\Facades\Bus;

Bus::fake();

// ...

Bus::assertChained([
    ShipOrder::class,
    RecordShipment::class,
    UpdateInventory::class
]);
```

위 예제에서 볼 수 있듯이, 체인 잡 배열은 잡 클래스 이름 배열일 수 있습니다. 하지만, 실제 잡 인스턴스 배열을 제공할 수도 있습니다. 이 경우, Laravel은 잡 인스턴스가 동일 클래스이고, 디스패치된 체인 잡과 동일한 속성 값을 가지는지 확인합니다:

```php
Bus::assertChained([
    new ShipOrder,
    new RecordShipment,
    new UpdateInventory,
]);
```

`assertDispatchedWithoutChain` 메서드를 사용해, 잡이 체인 없이 푸시되었는지 단언할 수 있습니다:

```php
Bus::assertDispatchedWithoutChain(ShipOrder::class);
```


#### 체인 수정 테스트 {#testing-chain-modifications}

체인 잡이 [기존 체인에 잡을 앞이나 뒤에 추가](#adding-jobs-to-the-chain)하는 경우, 잡의 `assertHasChain` 메서드를 사용해 잡에 예상 체인 잡이 남아 있는지 단언할 수 있습니다:

```php
$job = new ProcessPodcast;

$job->handle();

$job->assertHasChain([
    new TranscribePodcast,
    new OptimizePodcast,
    new ReleasePodcast,
]);
```

`assertDoesntHaveChain` 메서드를 사용해 잡의 남은 체인이 비어 있는지 단언할 수 있습니다:

```php
$job->assertDoesntHaveChain();
```


#### 체인된 배치 테스트 {#testing-chained-batches}

잡 체인에 [배치 잡이 포함](#chains-and-batches)된 경우, 체인 단언 내에 `Bus::chainedBatch` 정의를 삽입해 체인된 배치가 예상과 일치하는지 단언할 수 있습니다:

```php
use App\Jobs\ShipOrder;
use App\Jobs\UpdateInventory;
use Illuminate\Bus\PendingBatch;
use Illuminate\Support\Facades\Bus;

Bus::assertChained([
    new ShipOrder,
    Bus::chainedBatch(function (PendingBatch $batch) {
        return $batch->jobs->count() === 3;
    }),
    new UpdateInventory,
]);
```


### 잡 배치 테스트 {#testing-job-batches}

`Bus` 파사드의 `assertBatched` 메서드를 사용해 [잡 배치](/laravel/12.x/queues#job-batching)가 디스패치되었는지 단언할 수 있습니다. `assertBatched` 메서드에 전달된 클로저는 `Illuminate\Bus\PendingBatch` 인스턴스를 받아, 배치 내 잡을 조회할 수 있습니다:

```php
use Illuminate\Bus\PendingBatch;
use Illuminate\Support\Facades\Bus;

Bus::fake();

// ...

Bus::assertBatched(function (PendingBatch $batch) {
    return $batch->name == 'import-csv' &&
           $batch->jobs->count() === 10;
});
```

`assertBatchCount` 메서드를 사용해, 지정된 수의 배치가 디스패치되었는지 단언할 수 있습니다:

```php
Bus::assertBatchCount(3);
```

`assertNothingBatched`를 사용해, 배치가 디스패치되지 않았는지 단언할 수 있습니다:

```php
Bus::assertNothingBatched();
```


#### 잡/배치 상호작용 테스트 {#testing-job-batch-interaction}

또한, 개별 잡이 기본 배치와 상호작용하는지 테스트해야 할 때가 있습니다. 예를 들어, 잡이 배치의 추가 처리를 취소했는지 테스트해야 할 수 있습니다. 이를 위해, `withFakeBatch` 메서드를 사용해 잡에 페이크 배치를 할당해야 합니다. `withFakeBatch` 메서드는 잡 인스턴스와 페이크 배치가 포함된 튜플을 반환합니다:

```php
[$job, $batch] = (new ShipOrder)->withFakeBatch();

$job->handle();

$this->assertTrue($batch->cancelled());
$this->assertEmpty($batch->added);
```


### 잡/큐 상호작용 테스트 {#testing-job-queue-interactions}

때때로, 큐잉 잡이 [스스로를 큐에 다시 릴리즈](#manually-releasing-a-job)했는지 테스트해야 할 수 있습니다. 또는, 잡이 스스로를 삭제했는지 테스트해야 할 수도 있습니다. 잡을 인스턴스화하고 `withFakeQueueInteractions` 메서드를 호출해 이러한 큐 상호작용을 테스트할 수 있습니다.

잡의 큐 상호작용이 페이크된 후, 잡의 `handle` 메서드를 호출할 수 있습니다. 잡을 호출한 후, `assertReleased`, `assertDeleted`, `assertNotDeleted`, `assertFailed`, `assertFailedWith`, `assertNotFailed` 메서드를 사용해 잡의 큐 상호작용에 대해 단언할 수 있습니다:

```php
use App\Exceptions\CorruptedAudioException;
use App\Jobs\ProcessPodcast;

$job = (new ProcessPodcast)->withFakeQueueInteractions();

$job->handle();

$job->assertReleased(delay: 30);
$job->assertDeleted();
$job->assertNotDeleted();
$job->assertFailed();
$job->assertFailedWith(CorruptedAudioException::class);
$job->assertNotFailed();
```


## 잡 이벤트 {#job-events}

`Queue` [파사드](/laravel/12.x/facades)의 `before` 및 `after` 메서드를 사용해, 큐잉 잡이 처리되기 전이나 후에 실행할 콜백을 지정할 수 있습니다. 이 콜백은 추가 로깅을 하거나 대시보드 통계를 증가시키는 데 유용합니다. 일반적으로, [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 이 메서드를 호출해야 합니다. 예를 들어, Laravel에 포함된 `AppServiceProvider`를 사용할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 등록
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스 부트스트랩
     */
    public function boot(): void
    {
        Queue::before(function (JobProcessing $event) {
            // $event->connectionName
            // $event->job
            // $event->job->payload()
        });

        Queue::after(function (JobProcessed $event) {
            // $event->connectionName
            // $event->job
            // $event->job->payload()
        });
    }
}
```

`Queue` [파사드](/laravel/12.x/facades)의 `looping` 메서드를 사용해, 워커가 큐에서 잡을 가져오기 전에 실행할 콜백을 지정할 수 있습니다. 예를 들어, 이전에 실패한 잡으로 인해 열린 트랜잭션이 남아 있다면, 롤백하는 클로저를 등록할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

Queue::looping(function () {
    while (DB::transactionLevel() > 0) {
        DB::rollBack();
    }
});
```
