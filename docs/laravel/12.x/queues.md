# [고급] 큐(Queues)

























































## 소개 {#introduction}

웹 애플리케이션을 개발하다 보면, 업로드된 CSV 파일을 파싱하고 저장하는 작업처럼 일반적인 웹 요청 중에 처리하기에는 시간이 오래 걸리는 작업이 있을 수 있습니다. 다행히도 Laravel은 이러한 작업을 백그라운드에서 처리할 수 있도록 큐 작업(queued jobs)을 손쉽게 생성할 수 있게 해줍니다. 시간이 많이 소요되는 작업을 큐로 옮기면, 애플리케이션은 웹 요청에 훨씬 빠르게 응답할 수 있고, 사용자에게 더 나은 경험을 제공할 수 있습니다.

Laravel 큐는 [Amazon SQS](https://aws.amazon.com/sqs/), [Redis](https://redis.io), 또는 관계형 데이터베이스와 같은 다양한 큐 백엔드에 대해 통합된 큐 API를 제공합니다.

Laravel의 큐 설정 옵션은 애플리케이션의 `config/queue.php` 설정 파일에 저장되어 있습니다. 이 파일에는 프레임워크에 포함된 각 큐 드라이버(데이터베이스, [Amazon SQS](https://aws.amazon.com/sqs/), [Redis](https://redis.io), [Beanstalkd](https://beanstalkd.github.io/) 등)와 관련된 연결 설정이 포함되어 있습니다. 또한, 작업을 즉시 실행하는 동기(synchronous) 드라이버(로컬 개발 시 사용)와 큐에 쌓인 작업을 폐기하는 `null` 큐 드라이버도 포함되어 있습니다.

> [!NOTE]
> Laravel은 이제 Redis 기반 큐를 위한 아름다운 대시보드와 설정 시스템인 Horizon을 제공합니다. 자세한 내용은 [Horizon 공식 문서](/laravel/12.x/horizon)를 참고하세요.


### 연결(Connections)과 큐(Queues)의 차이점 {#connections-vs-queues}

Laravel 큐를 시작하기 전에 "연결(connection)"과 "큐(queue)"의 차이를 이해하는 것이 중요합니다. `config/queue.php` 설정 파일에는 `connections` 설정 배열이 있습니다. 이 옵션은 Amazon SQS, Beanstalk, Redis와 같은 백엔드 큐 서비스에 대한 연결을 정의합니다. 하지만 하나의 큐 연결에는 여러 개의 "큐"가 있을 수 있으며, 이는 서로 다른 작업(Job) 스택 또는 더미로 생각할 수 있습니다.

`queue` 설정 파일의 각 연결 설정 예제에는 `queue` 속성이 포함되어 있습니다. 이 속성은 해당 연결로 작업이 전송될 때 기본적으로 사용되는 큐를 지정합니다. 즉, 작업을 디스패치할 때 어떤 큐로 보낼지 명시하지 않으면, 해당 연결 설정의 `queue` 속성에 정의된 큐로 작업이 전송됩니다.

```php
use App\Jobs\ProcessPodcast;

// 이 작업은 기본 연결의 기본 큐로 전송됩니다...
ProcessPodcast::dispatch();

// 이 작업은 기본 연결의 "emails" 큐로 전송됩니다...
ProcessPodcast::dispatch()->onQueue('emails');
```

어떤 애플리케이션은 여러 큐에 작업을 보낼 필요 없이 하나의 간단한 큐만 사용할 수도 있습니다. 하지만 여러 큐에 작업을 분산시키는 것은 작업 처리 방식을 우선순위별로 나누거나 세분화하고 싶은 애플리케이션에 특히 유용합니다. Laravel 큐 워커는 어떤 큐를 어떤 우선순위로 처리할지 지정할 수 있기 때문입니다. 예를 들어, `high` 큐에 작업을 보내고, 해당 큐에 더 높은 우선순위로 작업을 처리하는 워커를 실행할 수 있습니다.

```shell
php artisan queue:work --queue=high,default
```


### 드라이버 참고 사항 및 사전 요구 사항 {#driver-prerequisites}


#### 데이터베이스 {#database}

`database` 큐 드라이버를 사용하려면 작업을 저장할 데이터베이스 테이블이 필요합니다. 일반적으로 이 테이블은 Laravel의 기본 `0001_01_01_000002_create_jobs_table.php` [데이터베이스 마이그레이션](/laravel/12.x/migrations)에 포함되어 있습니다. 그러나 애플리케이션에 이 마이그레이션이 없다면, `make:queue-table` Artisan 명령어를 사용하여 생성할 수 있습니다:

```shell
php artisan make:queue-table

php artisan migrate
```


#### Redis {#redis}

`redis` 큐 드라이버를 사용하려면, `config/database.php` 설정 파일에서 Redis 데이터베이스 연결을 구성해야 합니다.

> [!WARNING]
> `redis` 큐 드라이버는 `serializer` 및 `compression` Redis 옵션을 지원하지 않습니다.

**Redis 클러스터**

Redis 큐 연결이 Redis 클러스터를 사용하는 경우, 큐 이름에 [키 해시 태그](https://redis.io/docs/reference/cluster-spec/#hash-tags)를 포함해야 합니다. 이는 주어진 큐에 대한 모든 Redis 키가 동일한 해시 슬롯에 배치되도록 보장하기 위해 필요합니다:

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

Redis 큐를 사용할 때, `block_for` 설정 옵션을 사용하여 작업이 사용 가능해질 때까지 드라이버가 대기할 시간을 지정할 수 있습니다. 이 시간 동안 대기한 후, 워커 루프를 반복하며 Redis 데이터베이스를 다시 폴링합니다.

큐의 부하에 따라 이 값을 조정하면, 새로운 작업을 위해 Redis 데이터베이스를 계속해서 폴링하는 것보다 더 효율적일 수 있습니다. 예를 들어, 이 값을 `5`로 설정하면, 작업이 사용 가능해질 때까지 드라이버가 5초 동안 대기하도록 지정할 수 있습니다:

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
> `block_for` 값을 `0`으로 설정하면, 큐 워커는 작업이 사용 가능해질 때까지 무한정 대기하게 됩니다. 이 경우, 다음 작업이 처리될 때까지 `SIGTERM`과 같은 신호가 처리되지 않습니다.


#### 기타 드라이버 필수 조건 {#other-driver-prerequisites}

아래 큐 드라이버를 사용하려면 다음과 같은 의존성이 필요합니다. 이 의존성들은 Composer 패키지 매니저를 통해 설치할 수 있습니다:

<div class="content-list" markdown="1">

- Amazon SQS: `aws/aws-sdk-php ~3.0`
- Beanstalkd: `pda/pheanstalk ~5.0`
- Redis: `predis/predis ~2.0` 또는 phpredis PHP 확장 모듈
- [MongoDB](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/current/queues/): `mongodb/laravel-mongodb`

</div>


## 작업 생성하기 {#creating-jobs}


### 작업 클래스 생성 {#generating-job-classes}

기본적으로, 애플리케이션의 모든 큐 작업 클래스는 `app/Jobs` 디렉터리에 저장됩니다. 만약 `app/Jobs` 디렉터리가 존재하지 않는다면, `make:job` Artisan 명령어를 실행할 때 자동으로 생성됩니다:

```shell
php artisan make:job ProcessPodcast
```

생성된 클래스는 `Illuminate\Contracts\Queue\ShouldQueue` 인터페이스를 구현하며, 이는 해당 작업이 비동기적으로 실행되도록 큐에 푸시되어야 함을 Laravel에 알립니다.

> [!NOTE]
> 작업 스텁은 [스텁 커스터마이징](/laravel/12.x/artisan#stub-customization)을 통해 사용자 정의할 수 있습니다.


### 클래스 구조 {#class-structure}

Job 클래스는 매우 단순하며, 일반적으로 큐에서 작업이 처리될 때 호출되는 handle 메서드만을 포함합니다. 먼저, 예시 Job 클래스를 살펴보겠습니다. 이 예시에서는 팟캐스트 게시 서비스를 운영한다고 가정하고, 업로드된 팟캐스트 파일을 게시 전에 처리해야 한다고 해봅시다:

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
     * 새로운 Job 인스턴스 생성자.
     */
    public function __construct(
        public Podcast $podcast,
    ) {}

    /**
     * Job 실행 메서드.
     */
    public function handle(AudioProcessor $processor): void
    {
        // 업로드된 팟캐스트 처리...
    }
}
```

이 예시에서 볼 수 있듯이, [Eloquent 모델](/laravel/12.x/eloquent)을 큐에 등록된 Job의 생성자에 직접 전달할 수 있습니다. Job이 사용하는 Queueable 트레이트 덕분에, Eloquent 모델과 그에 로드된 관계들은 Job이 처리될 때 자동으로 직렬화 및 역직렬화됩니다.

큐에 등록된 Job이 생성자에서 Eloquent 모델을 받는 경우, 큐에는 모델의 식별자만 직렬화되어 저장됩니다. 실제로 Job이 처리될 때, 큐 시스템은 데이터베이스에서 전체 모델 인스턴스와 로드된 관계를 자동으로 다시 조회합니다. 이러한 모델 직렬화 방식은 큐 드라이버로 전송되는 Job 페이로드의 크기를 훨씬 더 작게 만들어줍니다.


#### `handle` 메서드 의존성 주입 {#handle-method-dependency-injection}

`handle` 메서드는 큐에서 작업이 처리될 때 호출됩니다. 이때 작업의 `handle` 메서드에 의존성을 타입힌트로 지정할 수 있습니다. Laravel의 [서비스 컨테이너](/laravel/12.x/container)는 이러한 의존성들을 자동으로 주입해줍니다.

만약 컨테이너가 `handle` 메서드에 의존성을 주입하는 방식을 완전히 제어하고 싶다면, 컨테이너의 `bindMethod` 메서드를 사용할 수 있습니다. `bindMethod`는 작업과 컨테이너를 인자로 받는 콜백을 전달받으며, 콜백 내부에서 원하는 방식으로 `handle` 메서드를 호출할 수 있습니다. 일반적으로 이 메서드는 `App\Providers\AppServiceProvider`의 `boot` 메서드에서 호출하는 것이 좋습니다. [서비스 프로바이더](/laravel/12.x/providers)에서 다음과 같이 사용할 수 있습니다:

```php
use App\Jobs\ProcessPodcast;
use App\Services\AudioProcessor;
use Illuminate\Contracts\Foundation\Application;

$this->app->bindMethod([ProcessPodcast::class, 'handle'], function (ProcessPodcast $job, Application $app) {
    return $job->handle($app->make(AudioProcessor::class));
});
```

> [!WARNING]
> 원시 이미지 데이터와 같은 바이너리 데이터는 큐 작업에 전달하기 전에 반드시 `base64_encode` 함수를 통해 인코딩해야 합니다. 그렇지 않으면 작업이 큐에 저장될 때 JSON으로 올바르게 직렬화되지 않을 수 있습니다.


#### 큐에 저장된 관계 {#handling-relationships}

모든 로드된 Eloquent 모델의 관계도 작업이 큐에 저장될 때 함께 직렬화되기 때문에, 직렬화된 작업 문자열이 매우 커질 수 있습니다. 또한, 작업이 역직렬화되고 모델의 관계가 데이터베이스에서 다시 조회될 때, 해당 관계는 전체가 조회됩니다. 작업이 큐에 저장되기 전에 적용된 이전의 관계 제약 조건들은 작업이 역직렬화될 때 적용되지 않습니다. 따라서, 특정 관계의 일부만을 다루고 싶다면, 큐에 저장된 작업 내에서 해당 관계에 다시 제약 조건을 걸어주어야 합니다.

또는, 관계가 직렬화되는 것을 방지하고 싶다면, 속성 값을 설정할 때 모델의 `withoutRelations` 메서드를 호출할 수 있습니다. 이 메서드는 로드된 관계가 없는 모델 인스턴스를 반환합니다:

```php
/**
 * 새로운 작업 인스턴스를 생성합니다.
 */
public function __construct(
    Podcast $podcast,
) {
    $this->podcast = $podcast->withoutRelations();
}
```

PHP의 생성자 프로퍼티 프로모션을 사용하고 있고, Eloquent 모델의 관계가 직렬화되지 않도록 지정하고 싶다면, `WithoutRelations` 속성을 사용할 수 있습니다:

```php
use Illuminate\Queue\Attributes\WithoutRelations;

/**
 * 새로운 작업 인스턴스를 생성합니다.
 */
public function __construct(
    #[WithoutRelations]
    public Podcast $podcast,
) {}
```

만약 작업이 단일 모델이 아닌 Eloquent 모델의 컬렉션이나 배열을 받는 경우, 해당 컬렉션 내의 모델들은 작업이 역직렬화되고 실행될 때 관계가 복원되지 않습니다. 이는 많은 수의 모델을 다루는 작업에서 과도한 리소스 사용을 방지하기 위함입니다.


### 유니크 잡 {#unique-jobs}

> [!WARNING]
> 유니크 잡은 [락](/laravel/12.x/cache#atomic-locks)를 지원하는 캐시 드라이버가 필요합니다. 현재 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 캐시 드라이버가 원자적 락을 지원합니다. 또한, 유니크 잡 제약 조건은 배치 내의 잡에는 적용되지 않습니다.

특정 잡의 인스턴스가 한 번에 큐에 하나만 존재하도록 보장하고 싶을 때가 있습니다. 이럴 때는 잡 클래스에 `ShouldBeUnique` 인터페이스를 구현하면 됩니다. 이 인터페이스는 클래스에 추가 메서드를 정의할 필요가 없습니다.

```php
<?php

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    // ...
}
```

위 예시에서 `UpdateSearchIndex` 잡은 유니크합니다. 즉, 동일한 잡의 다른 인스턴스가 이미 큐에 있고 아직 처리 중이라면, 잡이 디스패치되지 않습니다.

특정 "키"로 잡의 유니크함을 정의하거나, 잡이 더 이상 유니크하지 않게 되는 타임아웃을 지정하고 싶을 때가 있습니다. 이를 위해 잡 클래스에 `uniqueId`와 `uniqueFor` 속성 또는 메서드를 정의할 수 있습니다.

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
     * 잡의 유니크 락이 해제되기까지의 초(second) 단위 시간
     *
     * @var int
     */
    public $uniqueFor = 3600;

    /**
     * 잡의 유니크 ID를 반환
     */
    public function uniqueId(): string
    {
        return $this->product->id;
    }
}
```

위 예시에서 `UpdateSearchIndex` 잡은 상품 ID로 유니크합니다. 따라서 동일한 상품 ID로 잡이 새로 디스패치되더라도, 기존 잡이 처리 완료될 때까지 무시됩니다. 또한, 기존 잡이 1시간 이내에 처리되지 않으면 유니크 락이 해제되어 동일한 유니크 키를 가진 다른 잡이 큐에 디스패치될 수 있습니다.

> [!WARNING]
> 여러 웹 서버나 컨테이너에서 잡을 디스패치하는 경우, 모든 서버가 동일한 중앙 캐시 서버와 통신하도록 해야 Laravel이 잡의 유니크 여부를 정확히 판단할 수 있습니다.


#### 처리 시작 전까지 작업을 고유하게 유지하기 {#keeping-jobs-unique-until-processing-begins}

기본적으로, 고유(Unique) 작업은 작업이 처리 완료되거나 모든 재시도 시도가 실패한 후에 "잠금 해제(unlock)"됩니다. 하지만 작업이 처리되기 직전에 바로 잠금이 해제되길 원하는 상황이 있을 수 있습니다. 이를 위해서는 `ShouldBeUnique` 계약 대신 `ShouldBeUniqueUntilProcessing` 계약을 구현하면 됩니다:

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


#### 고유 잡 락 {#unique-job-locks}

`ShouldBeUnique` 잡이 디스패치될 때, Laravel은 내부적으로 `uniqueId` 키를 사용하여 [락](/laravel/12.x/cache#atomic-locks)을 획득하려고 시도합니다. 만약 락을 획득하지 못하면, 해당 잡은 디스패치되지 않습니다. 이 락은 잡이 정상적으로 처리되거나 모든 재시도에서 실패할 때 해제됩니다. 기본적으로 Laravel은 기본 캐시 드라이버를 사용하여 이 락을 획득합니다. 하지만, 락을 획득할 때 다른 드라이버를 사용하고 싶다면, 어떤 캐시 드라이버를 사용할지 반환하는 `uniqueVia` 메서드를 정의할 수 있습니다:

```php
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Cache;

class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    // ...

    /**
     * 고유 잡 락에 사용할 캐시 드라이버를 반환합니다.
     */
    public function uniqueVia(): Repository
    {
        return Cache::driver('redis');
    }
}
```

> [!NOTE]
> 만약 단순히 잡의 동시 실행만 제한하고 싶다면, [WithoutOverlapping](/laravel/12.x/queues#preventing-job-overlaps) 잡 미들웨어를 대신 사용하세요.


### 암호화된 작업 {#encrypted-jobs}

Laravel은 [암호화](/laravel/12.x/encryption)를 통해 작업 데이터의 프라이버시와 무결성을 보장할 수 있도록 지원합니다. 시작하려면, 작업 클래스에 `ShouldBeEncrypted` 인터페이스를 추가하기만 하면 됩니다. 이 인터페이스가 클래스에 추가되면, Laravel은 해당 작업을 큐에 넣기 전에 자동으로 암호화합니다:

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

잡 미들웨어를 사용하면 큐에 등록된 잡의 실행을 감싸는 커스텀 로직을 작성할 수 있어, 잡 내부의 반복적인 코드를 줄일 수 있습니다. 예를 들어, 아래의 `handle` 메서드는 Laravel의 Redis 속도 제한 기능을 활용하여 5초마다 하나의 잡만 처리하도록 합니다:

```php
use Illuminate\Support\Facades\Redis;

/**
 * 잡을 실행합니다.
 */
public function handle(): void
{
    Redis::throttle('key')->block(0)->allow(1)->every(5)->then(function () {
        info('락을 획득했습니다...');

        // 잡 처리...
    }, function () {
        // 락을 획득하지 못했습니다...

        return $this->release(5);
    });
}
```

이 코드는 유효하지만, `handle` 메서드가 Redis 속도 제한 로직으로 인해 복잡해집니다. 또한, 이 속도 제한 로직을 다른 잡에도 적용하려면 중복해서 작성해야 합니다.

`handle` 메서드에서 속도 제한을 처리하는 대신, 속도 제한을 담당하는 잡 미들웨어를 정의할 수 있습니다. Laravel은 잡 미들웨어의 기본 위치를 제공하지 않으므로, 애플리케이션 내 어디에나 자유롭게 둘 수 있습니다. 이 예제에서는 `app/Jobs/Middleware` 디렉터리에 미들웨어를 생성하겠습니다:

```php
<?php

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\Redis;

class RateLimited
{
    /**
     * 큐에 등록된 잡을 처리합니다.
     *
     * @param  \Closure(object): void  $next
     */
    public function handle(object $job, Closure $next): void
    {
        Redis::throttle('key')
            ->block(0)->allow(1)->every(5)
            ->then(function () use ($job, $next) {
                // 락을 획득했습니다...

                $next($job);
            }, function () use ($job) {
                // 락을 획득하지 못했습니다...

                $job->release(5);
            });
    }
}
```

보시다시피, [라우트 미들웨어](/laravel/12.x/middleware)와 마찬가지로 잡 미들웨어는 처리 중인 잡과 잡 처리를 계속 진행할 콜백을 전달받습니다.

`make:job-middleware` Artisan 명령어를 사용하여 새로운 잡 미들웨어 클래스를 생성할 수 있습니다. 잡 미들웨어를 생성한 후에는, 잡의 `middleware` 메서드에서 반환하여 해당 잡에 미들웨어를 적용할 수 있습니다. 이 메서드는 `make:job` Artisan 명령어로 생성된 잡에는 기본적으로 존재하지 않으므로, 직접 추가해야 합니다:

```php
use App\Jobs\Middleware\RateLimited;

/**
 * 잡이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new RateLimited];
}
```

> [!NOTE]
> 잡 미들웨어는 [큐 처리 이벤트 리스너](/laravel/12.x/events#queued-event-listeners), [메일러블](/laravel/12.x/mail#queueing-mail), [알림](/laravel/12.x/notifications#queueing-notifications)에도 적용할 수 있습니다.


### Rate Limiting {#rate-limiting}

직접 레이트 리미팅(요청 제한) 잡 미들웨어를 작성하는 방법을 앞서 살펴보았지만, 실제로 Laravel에는 잡에 사용할 수 있는 기본 레이트 리미팅 미들웨어가 포함되어 있습니다. [라우트 레이트 리미터](/laravel/12.x/routing#defining-rate-limiters)와 마찬가지로, 잡 레이트 리미터도 `RateLimiter` 파사드의 `for` 메서드를 사용해 정의할 수 있습니다.

예를 들어, 일반 사용자는 한 시간에 한 번만 데이터를 백업할 수 있도록 제한하고, 프리미엄 고객에게는 이런 제한을 두지 않으려 할 수 있습니다. 이를 위해 `AppServiceProvider`의 `boot` 메서드에서 `RateLimiter`를 다음과 같이 정의할 수 있습니다:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
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

위 예시에서는 시간 단위로 제한을 설정했지만, `perMinute` 메서드를 사용해 분 단위로도 쉽게 제한을 설정할 수 있습니다. 또한, `by` 메서드에는 원하는 값을 전달할 수 있으며, 주로 고객별로 제한을 구분할 때 사용합니다:

```php
return Limit::perMinute(50)->by($job->user->id);
```

레이트 리미터를 정의한 후에는, `Illuminate\Queue\Middleware\RateLimited` 미들웨어를 잡에 연결할 수 있습니다. 잡이 제한을 초과할 때마다 이 미들웨어는 잡을 제한 시간에 맞게 지연시켜 큐에 다시 반환합니다.

```php
use Illuminate\Queue\Middleware\RateLimited;

/**
 * 잡이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new RateLimited('backups')];
}
```

레이트 리미트로 인해 잡이 큐에 다시 반환되더라도, 해당 잡의 전체 `attempts`(시도 횟수)는 증가합니다. 따라서 잡 클래스의 `tries`와 `maxExceptions` 속성을 적절히 조정해야 할 수 있습니다. 또는 [retryUntil 메서드](#time-based-attempts)를 사용해 잡이 더 이상 시도되지 않아야 하는 시간을 정의할 수도 있습니다.

`releaseAfter` 메서드를 사용하면, 잡이 다시 시도되기 전까지 대기해야 할 초(second) 단위의 시간을 지정할 수 있습니다:

```php
/**
 * 잡이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new RateLimited('backups'))->releaseAfter(60)];
}
```

레이트 리미트에 걸렸을 때 잡을 재시도하지 않으려면, `dontRelease` 메서드를 사용할 수 있습니다:

```php
/**
 * 잡이 통과해야 할 미들웨어를 반환합니다.
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


### 작업 중복 방지 {#preventing-job-overlaps}

Laravel은 임의의 키를 기반으로 작업 중복을 방지할 수 있는 `Illuminate\Queue\Middleware\WithoutOverlapping` 미들웨어를 제공합니다. 이 기능은 큐에 등록된 작업이 한 번에 하나의 작업만 수정해야 하는 리소스를 변경할 때 유용합니다.

예를 들어, 사용자의 신용 점수를 업데이트하는 큐 작업이 있고, 동일한 사용자 ID에 대해 신용 점수 업데이트 작업이 중복 실행되는 것을 방지하고 싶다고 가정해봅시다. 이를 위해 작업의 `middleware` 메서드에서 `WithoutOverlapping` 미들웨어를 반환하면 됩니다.

```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new WithoutOverlapping($this->user->id)];
}
```

동일한 유형의 중복 작업은 큐로 다시 반환됩니다. 또한, 반환된 작업이 다시 시도되기까지 대기해야 하는 초(second) 단위의 시간을 지정할 수도 있습니다.

```php
/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new WithoutOverlapping($this->order->id))->releaseAfter(60)];
}
```

중복된 작업을 즉시 삭제하여 재시도되지 않도록 하려면 `dontRelease` 메서드를 사용할 수 있습니다.

```php
/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new WithoutOverlapping($this->order->id))->dontRelease()];
}
```

`WithoutOverlapping` 미들웨어는 Laravel의 원자적 락(atomic lock) 기능을 기반으로 동작합니다. 때때로 작업이 예기치 않게 실패하거나 타임아웃되어 락이 해제되지 않을 수 있습니다. 이런 경우를 대비해 `expireAfter` 메서드를 사용하여 락의 만료 시간을 명시적으로 지정할 수 있습니다. 아래 예시는 작업이 처리되기 시작한 후 3분(180초)이 지나면 `WithoutOverlapping` 락을 해제하도록 Laravel에 지시합니다.

```php
/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new WithoutOverlapping($this->order->id))->expireAfter(180)];
}
```

> [!WARNING]
> `WithoutOverlapping` 미들웨어는 [락](/laravel/12.x/cache#atomic-locks)를 지원하는 캐시 드라이버가 필요합니다. 현재 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 캐시 드라이버가 원자적 락을 지원합니다.


#### 작업 클래스 간의 Lock Key 공유 {#sharing-lock-keys}

기본적으로 `WithoutOverlapping` 미들웨어는 동일한 클래스의 중복 작업만 방지합니다. 따라서 두 개의 서로 다른 작업 클래스가 동일한 lock key를 사용하더라도, 이들은 중복 실행이 방지되지 않습니다. 하지만, Laravel의 `shared` 메서드를 사용하면 lock key를 작업 클래스 간에 공유하도록 지정할 수 있습니다:

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


### 예외 제한(Throttling Exceptions) {#throttling-exceptions}

Laravel에는 예외를 제한(throttle)할 수 있는 `Illuminate\Queue\Middleware\ThrottlesExceptions` 미들웨어가 포함되어 있습니다. 이 미들웨어를 사용하면, 작업이 지정된 횟수만큼 예외를 발생시키면 이후의 모든 작업 실행 시도가 지정된 시간 간격이 지날 때까지 지연됩니다. 이 미들웨어는 불안정한 서드파티 서비스와 상호작용하는 작업에 특히 유용합니다.

예를 들어, 서드파티 API와 상호작용하는 큐 작업이 예외를 발생시키기 시작했다고 가정해봅시다. 예외를 제한하려면, 작업의 `middleware` 메서드에서 `ThrottlesExceptions` 미들웨어를 반환하면 됩니다. 일반적으로 이 미들웨어는 [시간 기반 재시도](#time-based-attempts)를 구현한 작업과 함께 사용해야 합니다.

```php
use DateTime;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [new ThrottlesExceptions(10, 5 * 60)];
}

/**
 * 작업이 타임아웃되어야 하는 시점을 결정합니다.
 */
public function retryUntil(): DateTime
{
    return now()->addMinutes(30);
}
```

미들웨어의 첫 번째 생성자 인자는 작업이 제한되기 전에 발생할 수 있는 예외의 횟수이고, 두 번째 인자는 제한된 후 작업을 다시 시도하기까지 대기해야 하는 초(second) 단위의 시간입니다. 위의 예시 코드에서는 작업이 연속으로 10번 예외를 발생시키면, 5분 동안 대기한 후 다시 시도하며, 전체적으로 30분의 제한 시간 내에서만 시도합니다.

작업이 예외를 발생시켰지만 아직 예외 임계값에 도달하지 않은 경우, 작업은 일반적으로 즉시 재시도됩니다. 하지만, 미들웨어를 작업에 연결할 때 `backoff` 메서드를 호출하여 해당 작업이 지연될 분(minute) 수를 지정할 수 있습니다.

```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 5 * 60))->backoff(5)];
}
```

이 미들웨어는 내부적으로 Laravel의 캐시 시스템을 사용하여 속도 제한을 구현하며, 작업의 클래스명이 캐시 "키"로 사용됩니다. 미들웨어를 작업에 연결할 때 `by` 메서드를 호출하여 이 키를 오버라이드할 수 있습니다. 여러 작업이 동일한 서드파티 서비스를 사용하고, 이들이 동일한 제한 "버킷"을 공유하도록 하고 싶을 때 유용합니다.

```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(10, 10 * 60))->by('key')];
}
```

기본적으로 이 미들웨어는 모든 예외를 제한합니다. 이 동작을 변경하려면, 미들웨어를 작업에 연결할 때 `when` 메서드를 호출하면 됩니다. `when` 메서드에 전달된 클로저가 `true`를 반환할 때만 예외가 제한됩니다.

```php
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
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

`when` 메서드는 작업을 큐에 다시 올리거나 예외를 발생시키는 반면, `deleteWhen` 메서드는 특정 예외가 발생했을 때 작업을 완전히 삭제할 수 있습니다.

```php
use App\Exceptions\CustomerDeletedException;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(): array
{
    return [(new ThrottlesExceptions(2, 10 * 60))->deleteWhen(CustomerDeletedException::class)];
}
```

제한된 예외를 애플리케이션의 예외 핸들러에 보고하고 싶다면, 미들웨어를 작업에 연결할 때 `report` 메서드를 호출하면 됩니다. 선택적으로, `report` 메서드에 클로저를 전달하여 해당 클로저가 `true`를 반환할 때만 예외가 보고되도록 할 수 있습니다.

```php
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Queue\Middleware\ThrottlesExceptions;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
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
> Redis를 사용하는 경우, Redis에 최적화되어 있고 기본 예외 제한 미들웨어보다 더 효율적인 `Illuminate\Queue\Middleware\ThrottlesExceptionsWithRedis` 미들웨어를 사용할 수 있습니다.


### 작업 건너뛰기 {#skipping-jobs}

`Skip` 미들웨어를 사용하면 작업의 로직을 수정하지 않고도 해당 작업을 건너뛰거나 삭제할 수 있습니다. `Skip::when` 메서드는 주어진 조건이 `true`로 평가되면 작업을 삭제하고, `Skip::unless` 메서드는 조건이 `false`로 평가되면 작업을 삭제합니다:

```php
use Illuminate\Queue\Middleware\Skip;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 */
public function middleware(): array
{
    return [
        Skip::when($someCondition),
    ];
}
```

더 복잡한 조건 평가가 필요한 경우, `when`과 `unless` 메서드에 `Closure`를 전달할 수도 있습니다:

```php
use Illuminate\Queue\Middleware\Skip;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
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


## 작업 디스패치하기 {#dispatching-jobs}

작업 클래스(Job class)를 작성한 후에는 해당 작업에서 `dispatch` 메서드를 사용하여 작업을 디스패치할 수 있습니다. `dispatch` 메서드에 전달된 인수들은 작업의 생성자(constructor)로 전달됩니다.

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
     * 새로운 팟캐스트 저장.
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

작업을 조건부로 디스패치하고 싶다면, `dispatchIf`와 `dispatchUnless` 메서드를 사용할 수 있습니다.

```php
ProcessPodcast::dispatchIf($accountActive, $podcast);

ProcessPodcast::dispatchUnless($accountSuspended, $podcast);
```

새로운 Laravel 애플리케이션에서는 `sync` 드라이버가 기본 큐 드라이버로 설정되어 있습니다. 이 드라이버는 작업을 현재 요청의 전경(foreground)에서 동기적으로 실행하므로, 로컬 개발 환경에서 편리하게 사용할 수 있습니다. 실제로 작업을 백그라운드에서 큐잉하여 처리하고 싶다면, 애플리케이션의 `config/queue.php` 설정 파일에서 다른 큐 드라이버를 지정하면 됩니다.


### 지연 디스패치 {#delayed-dispatching}

만약 작업이 큐 워커에 의해 즉시 처리되지 않도록 지정하고 싶다면, 작업을 디스패치할 때 `delay` 메서드를 사용할 수 있습니다. 예를 들어, 작업이 디스패치된 후 10분이 지나야 처리 가능하도록 지정하려면 다음과 같이 작성할 수 있습니다:

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
     * 새로운 팟캐스트 저장.
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

경우에 따라 작업에 기본 지연 시간이 설정되어 있을 수 있습니다. 이 지연을 무시하고 작업을 즉시 처리하도록 디스패치하려면 `withoutDelay` 메서드를 사용할 수 있습니다:

```php
ProcessPodcast::dispatch($podcast)->withoutDelay();
```

> [!WARNING]
> Amazon SQS 큐 서비스는 최대 지연 시간이 15분입니다.


#### 응답이 브라우저로 전송된 후 작업 디스패치하기 {#dispatching-after-the-response-is-sent-to-browser}

또한, `dispatchAfterResponse` 메서드를 사용하면 웹 서버가 FastCGI를 사용할 경우, HTTP 응답이 사용자 브라우저로 전송된 이후에 작업(Job) 디스패치를 지연시킬 수 있습니다. 이를 통해 큐에 등록된 작업이 실행되는 동안에도 사용자는 애플리케이션을 바로 사용할 수 있습니다. 이 방법은 보통 이메일 전송과 같이 1초 이내에 끝나는 작업에만 사용하는 것이 좋습니다. 이러한 작업들은 현재 HTTP 요청 내에서 처리되기 때문에, 별도의 큐 워커가 실행 중이지 않아도 처리할 수 있습니다.

```php
use App\Jobs\SendNotification;

SendNotification::dispatchAfterResponse();
```

또한, 클로저(Closure)를 `dispatch`로 디스패치한 뒤, `afterResponse` 메서드를 체이닝하여 HTTP 응답이 브라우저로 전송된 후 클로저를 실행할 수도 있습니다:

```php
use App\Mail\WelcomeMessage;
use Illuminate\Support\Facades\Mail;

dispatch(function () {
    Mail::to('taylor@example.com')->send(new WelcomeMessage);
})->afterResponse();
```


### 동기적 디스패치 {#synchronous-dispatching}

만약 작업(Job)을 즉시(동기적으로) 실행하고 싶다면, dispatchSync 메서드를 사용할 수 있습니다. 이 메서드를 사용하면 작업이 큐에 저장되지 않고, 현재 프로세스 내에서 즉시 실행됩니다:

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
     * 새로운 팟캐스트 저장.
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


### 작업과 데이터베이스 트랜잭션 {#jobs-and-database-transactions}

데이터베이스 트랜잭션 내에서 작업(Job)을 디스패치하는 것은 전혀 문제되지 않지만, 작업이 실제로 성공적으로 실행될 수 있도록 특별히 주의해야 합니다. 트랜잭션 내에서 작업을 디스패치할 때, 부모 트랜잭션이 커밋되기 전에 작업이 워커에 의해 처리될 수 있습니다. 이 경우, 데이터베이스 트랜잭션 중에 모델이나 데이터베이스 레코드에 가한 변경 사항이 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 데이터베이스 레코드가 데이터베이스에 존재하지 않을 수도 있습니다.

다행히도, Laravel은 이 문제를 해결할 수 있는 여러 방법을 제공합니다. 먼저, 큐 커넥션의 설정 배열에서 `after_commit` 옵션을 설정할 수 있습니다:

```php
'redis' => [
    'driver' => 'redis',
    // ...
    'after_commit' => true,
],
```

`after_commit` 옵션이 `true`로 설정되어 있으면, 데이터베이스 트랜잭션 내에서 작업을 디스패치할 수 있습니다. 이 경우 Laravel은 열린 부모 데이터베이스 트랜잭션이 모두 커밋될 때까지 실제로 작업을 디스패치하지 않습니다. 물론, 현재 열린 데이터베이스 트랜잭션이 없다면 작업은 즉시 디스패치됩니다.

트랜잭션 중에 예외가 발생하여 트랜잭션이 롤백되는 경우, 해당 트랜잭션 중에 디스패치된 작업들은 모두 폐기됩니다.

> [!NOTE]
> `after_commit` 설정 옵션을 `true`로 지정하면, 큐에 등록된 이벤트 리스너, 메일, 알림, 브로드캐스트 이벤트 역시 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치됩니다.


#### 커밋 디스패치 동작을 인라인으로 지정하기 {#specifying-commit-dispatch-behavior-inline}

`after_commit` 큐 연결 설정 옵션을 `true`로 지정하지 않은 경우에도, 특정 작업이 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치되도록 지정할 수 있습니다. 이를 위해 디스패치 작업에 `afterCommit` 메서드를 체이닝하면 됩니다:

```php
use App\Jobs\ProcessPodcast;

ProcessPodcast::dispatch($podcast)->afterCommit();
```

반대로, `after_commit` 설정 옵션이 `true`로 지정된 경우에는, 특정 작업이 열린 데이터베이스 트랜잭션의 커밋을 기다리지 않고 즉시 디스패치되도록 지정할 수 있습니다:

```php
ProcessPodcast::dispatch($podcast)->beforeCommit();
```


### 작업 체이닝 {#job-chaining}

작업 체이닝은 기본 작업이 성공적으로 실행된 후 순차적으로 실행되어야 하는 큐 작업 목록을 지정할 수 있게 해줍니다. 체인 내의 작업 중 하나라도 실패하면, 나머지 작업들은 실행되지 않습니다. 큐 작업 체인을 실행하려면 `Bus` 파사드에서 제공하는 `chain` 메서드를 사용할 수 있습니다. 라라벨의 커맨드 버스는 큐 작업 디스패칭이 그 위에 구축된 하위 레벨 컴포넌트입니다:

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

작업 클래스 인스턴스뿐만 아니라, 클로저도 체이닝할 수 있습니다:

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
> 작업 내에서 `$this->delete()` 메서드를 사용해 작업을 삭제하더라도, 체이닝된 다음 작업의 실행을 막을 수 없습니다. 체인 내의 작업이 실패할 때만 체인의 실행이 중단됩니다.


#### 체인 연결 및 큐 {#chain-connection-queue}

체인에 연결된 작업들에 대해 사용될 연결(connection)과 큐(queue)를 지정하고 싶다면, `onConnection`과 `onQueue` 메서드를 사용할 수 있습니다. 이 메서드들은 큐 작업이 명시적으로 다른 연결이나 큐에 할당되지 않는 한, 사용할 큐 연결과 큐 이름을 지정합니다:

```php
Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->onConnection('redis')->onQueue('podcasts')->dispatch();
```


#### 체인에 작업 추가하기 {#adding-jobs-to-the-chain}

때때로, 체인에 속한 다른 작업 내에서 기존 작업 체인의 앞이나 뒤에 작업을 추가해야 할 수 있습니다. 이때는 `prependToChain` 및 `appendToChain` 메서드를 사용할 수 있습니다:

```php
/**
 * 작업 실행.
 */
public function handle(): void
{
    // ...

    // 현재 체인 앞에 추가, 현재 작업 바로 다음에 실행...
    $this->prependToChain(new TranscribePodcast);

    // 현재 체인 뒤에 추가, 체인 마지막에 실행...
    $this->appendToChain(new TranscribePodcast);
}
```


#### 체인 실패 {#chain-failures}

잡을 체이닝할 때, 체인 내의 잡 중 하나가 실패할 경우 실행할 클로저를 `catch` 메서드로 지정할 수 있습니다. 지정한 콜백은 잡 실패를 유발한 `Throwable` 인스턴스를 전달받습니다:

```php
use Illuminate\Support\Facades\Bus;
use Throwable;

Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->catch(function (Throwable $e) {
    // 체인 내의 잡 중 하나가 실패했습니다...
})->dispatch();
```

> [!WARNING]
> 체인 콜백은 직렬화되어 나중에 Laravel 큐에 의해 실행되므로, 체인 콜백 내에서 `$this` 변수를 사용하지 않아야 합니다.


### 큐와 커넥션 커스터마이징 {#customizing-the-queue-and-connection}


#### 특정 큐로 디스패치하기 {#dispatching-to-a-particular-queue}

작업을 서로 다른 큐에 푸시함으로써, 큐에 등록된 작업들을 "분류"할 수 있으며, 각 큐에 할당하는 워커(worker)의 수를 조정하여 우선순위를 지정할 수도 있습니다. 주의할 점은, 이는 큐 설정 파일에 정의된 서로 다른 큐 "커넥션"에 작업을 푸시하는 것이 아니라, 하나의 커넥션 내에서 특정 큐로 작업을 푸시하는 방법입니다. 작업을 디스패치할 때 `onQueue` 메서드를 사용하여 큐를 지정할 수 있습니다:

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
     * 새로운 팟캐스트 저장.
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

또는, 작업 클래스의 생성자에서 `onQueue` 메서드를 호출하여 작업이 사용할 큐를 지정할 수도 있습니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 작업 인스턴스 생성.
     */
    public function __construct()
    {
        $this->onQueue('processing');
    }
}
```


#### 특정 커넥션으로 디스패치하기 {#dispatching-to-a-particular-connection}

애플리케이션이 여러 큐 커넥션과 상호작용하는 경우, `onConnection` 메서드를 사용하여 작업을 특정 커넥션에 푸시할 수 있습니다:

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
     * 새로운 팟캐스트 저장.
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

`onConnection`과 `onQueue` 메서드를 체이닝하여 작업이 사용할 커넥션과 큐를 모두 지정할 수도 있습니다:

```php
ProcessPodcast::dispatch($podcast)
    ->onConnection('sqs')
    ->onQueue('processing');
```

또는, 작업 클래스의 생성자에서 `onConnection` 메서드를 호출하여 작업의 커넥션을 지정할 수도 있습니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 작업 인스턴스 생성.
     */
    public function __construct()
    {
        $this->onConnection('sqs');
    }
}
```


### 최대 작업 시도 횟수 / 타임아웃 값 지정하기 {#max-job-attempts-and-timeout}


#### 최대 시도 횟수 {#max-attempts}

큐에 등록된 작업 중 하나에서 오류가 발생할 경우, 무한정 재시도하는 것을 원하지 않을 수 있습니다. 이를 위해 Laravel은 작업이 시도될 수 있는 횟수나 기간을 지정할 수 있는 다양한 방법을 제공합니다.

작업이 시도될 수 있는 최대 횟수를 지정하는 한 가지 방법은 Artisan 명령어에서 `--tries` 옵션을 사용하는 것입니다. 이 옵션은 워커가 처리하는 모든 작업에 적용되며, 개별 작업에서 시도 횟수를 별도로 지정하지 않은 경우에만 적용됩니다:

```shell
php artisan queue:work --tries=3
```

작업이 최대 시도 횟수를 초과하면 해당 작업은 "실패"한 작업으로 간주됩니다. 실패한 작업 처리에 대한 자세한 내용은 [실패한 작업 문서](#dealing-with-failed-jobs)를 참고하세요. 만약 `queue:work` 명령어에 `--tries=0`을 지정하면, 해당 작업은 무한정 재시도됩니다.

더 세밀하게 제어하고 싶다면, 작업 클래스 자체에서 최대 시도 횟수를 지정할 수 있습니다. 작업 클래스에 최대 시도 횟수가 지정되어 있다면, 이는 명령줄에서 지정한 `--tries` 값보다 우선적으로 적용됩니다:

```php
<?php

namespace App\Jobs;

class ProcessPodcast implements ShouldQueue
{
    /**
     * 작업이 시도될 수 있는 최대 횟수
     *
     * @var int
     */
    public $tries = 5;
}
```

특정 작업의 최대 시도 횟수를 동적으로 제어해야 한다면, 작업 클래스에 `tries` 메서드를 정의할 수 있습니다:

```php
/**
 * 작업이 시도될 수 있는 횟수를 결정합니다.
 */
public function tries(): int
{
    return 5;
}
```


#### 시간 기반 시도 제한 {#time-based-attempts}

작업이 실패하기 전에 시도할 수 있는 횟수를 지정하는 대신, 작업이 더 이상 시도되지 않아야 하는 시간을 정의할 수도 있습니다. 이를 통해 주어진 시간 내에 작업이 여러 번 시도될 수 있습니다. 작업이 더 이상 시도되지 않아야 하는 시간을 정의하려면, 작업 클래스에 `retryUntil` 메서드를 추가하면 됩니다. 이 메서드는 `DateTime` 인스턴스를 반환해야 합니다:

```php
use DateTime;

/**
 * 작업이 언제까지 시도되어야 하는지 결정합니다.
 */
public function retryUntil(): DateTime
{
    return now()->addMinutes(10);
}
```

`retryUntil`과 `tries`가 모두 정의되어 있는 경우, Laravel은 `retryUntil` 메서드를 우선적으로 적용합니다.

> [!NOTE]
> [큐에 등록된 이벤트 리스너](/laravel/12.x/events#queued-event-listeners)와 [큐에 등록된 알림](/laravel/12.x/notifications#queueing-notifications)에도 `tries` 속성이나 `retryUntil` 메서드를 정의할 수 있습니다.


#### 최대 예외 수 {#max-exceptions}

때때로 작업을 여러 번 시도하도록 설정하고 싶지만, `release` 메서드로 직접 릴리즈되는 경우가 아니라 처리되지 않은 예외가 지정된 횟수만큼 발생하면 작업이 실패하도록 하고 싶을 수 있습니다. 이를 위해 작업 클래스에 `maxExceptions` 속성을 정의할 수 있습니다:

```php
<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Redis;

class ProcessPodcast implements ShouldQueue
{
    /**
     * 작업이 시도될 수 있는 최대 횟수입니다.
     *
     * @var int
     */
    public $tries = 25;

    /**
     * 실패로 간주되기 전 허용되는 최대 처리되지 않은 예외 수입니다.
     *
     * @var int
     */
    public $maxExceptions = 3;

    /**
     * 작업 실행.
     */
    public function handle(): void
    {
        Redis::throttle('key')->allow(10)->every(60)->then(function () {
            // 락을 획득했으므로 팟캐스트를 처리합니다...
        }, function () {
            // 락을 획득하지 못했습니다...
            return $this->release(10);
        });
    }
}
```

이 예시에서, 애플리케이션이 Redis 락을 획득하지 못하면 작업은 10초 동안 릴리즈되고, 최대 25번까지 재시도됩니다. 하지만 작업에서 처리되지 않은 예외가 3번 발생하면 해당 작업은 실패하게 됩니다.


#### 타임아웃 {#timeout}

대부분의 경우, 큐에 등록된 작업이 얼마나 오래 걸릴지 대략적으로 예상할 수 있습니다. 이러한 이유로, Laravel에서는 "타임아웃" 값을 지정할 수 있습니다. 기본적으로 타임아웃 값은 60초입니다. 만약 작업이 타임아웃 값으로 지정된 초 수보다 더 오래 처리된다면, 해당 작업을 처리하던 워커는 에러와 함께 종료됩니다. 일반적으로 워커는 [서버에 설정된 프로세스 매니저](#supervisor-configuration)에 의해 자동으로 재시작됩니다.

작업이 실행될 수 있는 최대 초 수는 Artisan 명령어에서 `--timeout` 옵션을 사용해 지정할 수 있습니다:

```shell
php artisan queue:work --timeout=30
```

작업이 타임아웃으로 인해 최대 시도 횟수를 초과하면, 해당 작업은 실패로 처리됩니다.

또한, 작업 클래스 자체에서 작업이 실행될 수 있는 최대 초 수를 정의할 수도 있습니다. 작업 클래스에 타임아웃이 지정되어 있다면, 명령줄에서 지정한 타임아웃보다 우선적으로 적용됩니다:

```php
<?php

namespace App\Jobs;

class ProcessPodcast implements ShouldQueue
{
    /**
     * 작업이 타임아웃되기 전까지 실행될 수 있는 초 단위 시간입니다.
     *
     * @var int
     */
    public $timeout = 120;
}
```

때때로, 소켓이나 외부 HTTP 연결과 같은 IO 블로킹 프로세스는 지정한 타임아웃을 제대로 준수하지 않을 수 있습니다. 따라서 이러한 기능을 사용할 때는 해당 API에서도 타임아웃을 반드시 지정해야 합니다. 예를 들어, Guzzle을 사용할 때는 항상 연결 및 요청 타임아웃 값을 지정해야 합니다.

> [!WARNING]
> 작업 타임아웃을 지정하려면 `pcntl` PHP 확장 모듈이 설치되어 있어야 합니다. 또한, 작업의 "타임아웃" 값은 항상 ["retry after"](#job-expiration) 값보다 작아야 합니다. 그렇지 않으면, 작업이 실제로 끝나거나 타임아웃되기 전에 재시도가 발생할 수 있습니다.


#### 타임아웃 시 실패로 처리하기 {#failing-on-timeout}

작업이 타임아웃될 때 해당 작업을 [실패](#dealing-with-failed-jobs)로 표시하고 싶다면, 작업 클래스에 `$failOnTimeout` 속성을 정의하면 됩니다:

```php
/**
 * 작업이 타임아웃 시 실패로 처리되어야 하는지 여부를 지정합니다.
 *
 * @var bool
 */
public $failOnTimeout = true;
```


### 에러 처리 {#error-handling}

작업이 처리되는 동안 예외가 발생하면, 해당 작업은 자동으로 큐에 다시 반환되어 재시도됩니다. 작업은 애플리케이션에서 허용한 최대 시도 횟수에 도달할 때까지 계속해서 다시 반환됩니다. 최대 시도 횟수는 `queue:work` Artisan 명령어에서 사용하는 `--tries` 옵션으로 정의할 수 있습니다. 또는, 작업 클래스 자체에서 최대 시도 횟수를 정의할 수도 있습니다. 큐 워커 실행에 대한 자세한 내용은 [아래에서 확인할 수 있습니다](#running-the-queue-worker).


#### 작업을 수동으로 재시도 큐에 반환하기 {#manually-releasing-a-job}

때때로 작업을 나중에 다시 시도할 수 있도록 수동으로 큐에 반환하고 싶을 때가 있습니다. 이 경우 `release` 메서드를 호출하여 작업을 다시 큐에 올릴 수 있습니다:

```php
/**
 * 작업 실행.
 */
public function handle(): void
{
    // ...

    $this->release();
}
```

기본적으로 `release` 메서드는 작업을 즉시 처리할 수 있도록 큐에 다시 반환합니다. 하지만 정수나 날짜 인스턴스를 `release` 메서드에 전달하여 지정한 초가 경과할 때까지 작업이 처리되지 않도록 할 수도 있습니다:

```php
$this->release(10);

$this->release(now()->addSeconds(10));
```


#### 작업을 수동으로 실패 처리하기 {#manually-failing-a-job}

가끔 작업을 수동으로 "실패"로 표시해야 할 때가 있습니다. 이럴 때는 `fail` 메서드를 호출하면 됩니다:

```php
/**
 * 작업 실행.
 */
public function handle(): void
{
    // ...

    $this->fail();
}
```

예외를 직접 처리한 후 작업을 실패로 표시하고 싶다면, 해당 예외를 `fail` 메서드에 전달할 수 있습니다. 또는, 편의를 위해 문자열 형태의 에러 메시지를 전달하면 자동으로 예외로 변환되어 처리됩니다:

```php
$this->fail($exception);

$this->fail('문제가 발생했습니다.');
```

> [!NOTE]
> 실패한 작업에 대한 더 자세한 내용은 [작업 실패 처리 문서](#dealing-with-failed-jobs)를 참고하세요.


## 작업 배치 {#job-batching}

Laravel의 작업 배치 기능을 사용하면 여러 작업을 한 번에 실행하고, 모든 작업이 완료된 후에 특정 동작을 수행할 수 있습니다. 시작하기 전에, 작업 배치의 진행률과 같은 메타 정보를 저장할 테이블을 생성하는 데이터베이스 마이그레이션을 만들어야 합니다. 이 마이그레이션은 `make:queue-batches-table` Artisan 명령어를 사용하여 생성할 수 있습니다:

```shell
php artisan make:queue-batches-table

php artisan migrate
```


### 배치 가능한 작업 정의하기 {#defining-batchable-jobs}

배치 가능한 작업을 정의하려면, 일반적으로 [큐 작업을 생성](#creating-jobs)하는 것과 동일하게 작업을 생성하면 됩니다. 다만, 작업 클래스에 `Illuminate\Bus\Batchable` 트레이트를 추가해야 합니다. 이 트레이트는 작업이 실행 중인 현재 배치에 접근할 수 있는 `batch` 메서드를 제공합니다:

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
     * 작업 실행.
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


### 배치 디스패치하기 {#dispatching-batches}

여러 개의 작업(Job)을 배치로 디스패치하려면 `Bus` 파사드의 `batch` 메서드를 사용하면 됩니다. 물론, 배치는 주로 완료 콜백과 결합할 때 유용하게 사용됩니다. 따라서 `then`, `catch`, `finally` 메서드를 사용해 배치의 완료 콜백을 정의할 수 있습니다. 이 콜백들은 호출될 때마다 `Illuminate\Bus\Batch` 인스턴스를 전달받습니다. 아래 예시에서는 각 작업이 CSV 파일의 특정 행을 처리하는 배치 작업을 큐에 넣는 상황을 가정합니다:

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
    // 배치가 생성되었지만 아직 작업이 추가되지 않은 상태...
})->progress(function (Batch $batch) {
    // 개별 작업이 성공적으로 완료됨...
})->then(function (Batch $batch) {
    // 모든 작업이 성공적으로 완료됨...
})->catch(function (Batch $batch, Throwable $e) {
    // 첫 번째 작업 실패가 감지됨...
})->finally(function (Batch $batch) {
    // 배치 실행이 모두 끝남...
})->dispatch();

return $batch->id;
```

배치의 ID는 `$batch->id` 속성을 통해 접근할 수 있으며, 디스패치 이후 [Laravel 커맨드 버스에서 배치 정보를 조회](#inspecting-batches)할 때 사용할 수 있습니다.

> [!WARNING]
> 배치 콜백은 직렬화되어 나중에 Laravel 큐에 의해 실행되므로, 콜백 내에서 `$this` 변수를 사용하지 않아야 합니다. 또한, 배치 작업은 데이터베이스 트랜잭션 내에서 실행되므로, 암시적 커밋을 유발하는 데이터베이스 쿼리는 작업 내에서 실행하지 않아야 합니다.


#### 배치 이름 지정 {#naming-batches}

Laravel Horizon이나 Laravel Telescope와 같은 일부 도구들은 배치에 이름이 지정되어 있으면 더 사용자 친화적인 디버그 정보를 제공할 수 있습니다. 배치에 임의의 이름을 지정하려면, 배치를 정의할 때 `name` 메서드를 호출하면 됩니다:

```php
$batch = Bus::batch([
    // ...
])->then(function (Batch $batch) {
    // 모든 작업이 성공적으로 완료됨...
})->name('Import CSV')->dispatch();
```


#### 배치 연결 및 큐 {#batch-connection-queue}

배치 작업에 사용할 연결(connection)과 큐(queue)를 지정하고 싶다면, `onConnection`과 `onQueue` 메서드를 사용할 수 있습니다. 모든 배치 작업은 동일한 연결과 큐에서 실행되어야 합니다:

```php
$batch = Bus::batch([
    // ...
])->then(function (Batch $batch) {
    // 모든 작업이 성공적으로 완료됨...
})->onConnection('redis')->onQueue('imports')->dispatch();
```


### 체인과 배치 {#chains-and-batches}

배치 내에서 [체인된 작업](#job-chaining) 집합을 정의하려면, 체인된 작업들을 배열 안에 배치하면 됩니다. 예를 들어, 두 개의 작업 체인을 병렬로 실행하고, 두 체인이 모두 처리된 후 콜백을 실행할 수 있습니다:

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

반대로, [체인](#job-chaining) 내에서 여러 개의 배치를 실행할 수도 있습니다. 즉, 체인 안에 배치들을 정의할 수 있습니다. 예를 들어, 먼저 여러 팟캐스트를 발행하는 작업 배치를 실행한 후, 발행 알림을 보내는 작업 배치를 실행할 수 있습니다:

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


### 배치에 작업 추가하기 {#adding-jobs-to-batches}

때로는 배치 작업 내에서 추가 작업을 배치에 더하는 것이 유용할 수 있습니다. 이 패턴은 수천 개의 작업을 한 번에 배치해야 할 때, 웹 요청 중에 모든 작업을 디스패치하기에는 시간이 너무 오래 걸릴 경우에 특히 유용합니다. 이런 경우, 초기 "로더" 작업 배치만 먼저 디스패치하고, 이 작업들이 더 많은 작업을 배치에 추가하도록 할 수 있습니다.

```php
$batch = Bus::batch([
    new LoadImportBatch,
    new LoadImportBatch,
    new LoadImportBatch,
])->then(function (Batch $batch) {
    // 모든 작업이 성공적으로 완료됨...
})->name('Import Contacts')->dispatch();
```

이 예시에서는 `LoadImportBatch` 작업을 사용해 배치에 추가 작업을 더하게 됩니다. 이를 위해, 작업의 `batch` 메서드를 통해 접근할 수 있는 배치 인스턴스의 `add` 메서드를 사용할 수 있습니다.

```php
use App\Jobs\ImportContacts;
use Illuminate\Support\Collection;

/**
 * 작업 실행.
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
> 동일한 배치에 속한 작업 내에서만 배치에 작업을 추가할 수 있습니다.


### 배치 검사하기 {#inspecting-batches}

배치 완료 콜백에 제공되는 `Illuminate\Bus\Batch` 인스턴스는 특정 작업 배치와 상호작용하고 검사하는 데 도움이 되는 다양한 속성과 메서드를 제공합니다:

```php
// 배치의 UUID...
$batch->id;

// 배치의 이름(해당되는 경우)...
$batch->name;

// 배치에 할당된 작업의 수...
$batch->totalJobs;

// 큐에서 아직 처리되지 않은 작업의 수...
$batch->pendingJobs;

// 실패한 작업의 수...
$batch->failedJobs;

// 지금까지 처리된 작업의 수...
$batch->processedJobs();

// 배치의 완료 비율(0-100)...
$batch->progress();

// 배치 실행이 완료되었는지 여부...
$batch->finished();

// 배치 실행을 취소...
$batch->cancel();

// 배치가 취소되었는지 여부...
$batch->cancelled();
```


#### 라우트에서 배치 반환하기 {#returning-batches-from-routes}

모든 `Illuminate\Bus\Batch` 인스턴스는 JSON 직렬화가 가능하므로, 애플리케이션의 라우트에서 직접 반환하여 배치의 완료 진행 상황을 포함한 정보를 담은 JSON 페이로드를 바로 받아볼 수 있습니다. 이를 통해 애플리케이션 UI에서 배치의 완료 진행 상황을 손쉽게 표시할 수 있습니다.

배치 ID로 배치를 조회하려면 `Bus` 파사드의 `findBatch` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Route;

Route::get('/batch/{batchId}', function (string $batchId) {
    return Bus::findBatch($batchId);
});
```


### 배치 취소하기 {#cancelling-batches}

때때로 특정 배치의 실행을 취소해야 할 때가 있습니다. 이는 `Illuminate\Bus\Batch` 인스턴스의 `cancel` 메서드를 호출하여 수행할 수 있습니다:

```php
/**
 * 작업을 실행합니다.
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

앞선 예제에서 볼 수 있듯이, 배치로 처리되는 작업은 일반적으로 실행을 계속하기 전에 해당 배치가 취소되었는지 확인해야 합니다. 하지만 더 편리하게 사용하려면, 대신 작업에 `SkipIfBatchCancelled` [미들웨어](#job-middleware)를 지정할 수 있습니다. 이름에서 알 수 있듯이, 이 미들웨어는 해당 배치가 취소된 경우 Laravel이 해당 작업을 처리하지 않도록 지시합니다:

```php
use Illuminate\Queue\Middleware\SkipIfBatchCancelled;

/**
 * 작업이 통과해야 할 미들웨어를 반환합니다.
 */
public function middleware(): array
{
    return [new SkipIfBatchCancelled];
}
```


### 배치 실패 {#batch-failures}

배치 작업이 실패하면, `catch` 콜백(지정된 경우)이 호출됩니다. 이 콜백은 배치 내에서 처음 실패한 작업에 대해서만 호출됩니다.


#### 실패 허용하기 {#allowing-failures}

배치 내의 작업이 실패하면, Laravel은 자동으로 해당 배치를 "취소됨" 상태로 표시합니다. 만약 작업 실패 시 배치가 자동으로 취소되지 않도록 하려면, 이 동작을 비활성화할 수 있습니다. 이를 위해 배치를 디스패치할 때 `allowFailures` 메서드를 호출하면 됩니다:

```php
$batch = Bus::batch([
    // ...
])->then(function (Batch $batch) {
    // 모든 작업이 성공적으로 완료됨...
})->allowFailures()->dispatch();
```


#### 실패한 배치 작업 재시도 {#retrying-failed-batch-jobs}

편의를 위해, Laravel은 주어진 배치의 모든 실패한 작업을 쉽게 재시도할 수 있도록 `queue:retry-batch` Artisan 명령어를 제공합니다. `queue:retry-batch` 명령어는 실패한 작업을 재시도할 배치의 UUID를 인자로 받습니다:

```shell
php artisan queue:retry-batch 32dbc76c-4f82-4749-b610-a639fe0099b5
```


### 배치 정리 {#pruning-batches}

정리를 하지 않으면 `job_batches` 테이블에 레코드가 매우 빠르게 쌓일 수 있습니다. 이를 방지하기 위해, [스케줄러](/laravel/12.x/scheduling)를 사용하여 `queue:prune-batches` Artisan 명령어를 매일 실행하도록 설정해야 합니다.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches')->daily();
```

기본적으로, 완료된 지 24시간이 지난 모든 배치는 정리됩니다. 명령어를 호출할 때 `hours` 옵션을 사용하여 배치 데이터를 얼마나 오래 보관할지 지정할 수 있습니다. 예를 들어, 아래 명령어는 완료된 지 48시간이 지난 모든 배치를 삭제합니다.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches --hours=48')->daily();
```

때때로, `jobs_batches` 테이블에는 성공적으로 완료되지 않은 배치의 레코드가 쌓일 수 있습니다. 예를 들어, 작업이 실패하고 해당 작업이 성공적으로 재시도되지 않은 경우입니다. `queue:prune-batches` 명령어에 `unfinished` 옵션을 사용하여 이러한 미완료 배치 레코드도 정리할 수 있습니다.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches --hours=48 --unfinished=72')->daily();
```

마찬가지로, `jobs_batches` 테이블에는 취소된 배치의 레코드도 쌓일 수 있습니다. `queue:prune-batches` 명령어에 `cancelled` 옵션을 사용하여 이러한 취소된 배치 레코드도 정리할 수 있습니다.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:prune-batches --hours=48 --cancelled=72')->daily();
```


### DynamoDB에 배치 정보 저장하기 {#storing-batches-in-dynamodb}

Laravel은 배치 메타 정보를 관계형 데이터베이스 대신 [DynamoDB](https://aws.amazon.com/dynamodb)에 저장하는 것도 지원합니다. 하지만, 모든 배치 레코드를 저장할 DynamoDB 테이블을 직접 생성해야 합니다.

일반적으로 이 테이블의 이름은 `job_batches`로 지정하지만, 애플리케이션의 `queue` 설정 파일 내 `queue.batching.table` 설정 값에 따라 테이블 이름을 지정해야 합니다.


#### DynamoDB 배치 테이블 구성 {#dynamodb-batch-table-configuration}

`job_batches` 테이블에는 문자열 기본 파티션 키인 `application`과 문자열 기본 정렬 키인 `id`가 있어야 합니다. 키의 `application` 부분에는 애플리케이션의 `app` 설정 파일 내 `name` 설정 값에 정의된 애플리케이션 이름이 저장됩니다. 애플리케이션 이름이 DynamoDB 테이블 키의 일부이기 때문에, 여러 Laravel 애플리케이션의 작업 배치를 동일한 테이블에 저장할 수 있습니다.

또한, [자동 배치 정리](#pruning-batches-in-dynamodb)를 활용하고 싶다면 테이블에 `ttl` 속성을 정의할 수 있습니다.


#### DynamoDB 설정 {#dynamodb-configuration}

다음으로, Laravel 애플리케이션이 Amazon DynamoDB와 통신할 수 있도록 AWS SDK를 설치합니다:

```shell
composer require aws/aws-sdk-php
```

그런 다음, `queue.batching.driver` 설정 옵션의 값을 `dynamodb`로 지정합니다. 또한, `batching` 설정 배열 내에 `key`, `secret`, `region` 옵션을 정의해야 합니다. 이 옵션들은 AWS 인증에 사용됩니다. `dynamodb` 드라이버를 사용할 때는 `queue.batching.database` 설정 옵션이 필요하지 않습니다:

```php
'batching' => [
    'driver' => env('QUEUE_BATCHING_DRIVER', 'dynamodb'),
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => 'job_batches',
],
```


#### DynamoDB에서 배치 정리하기 {#pruning-batches-in-dynamodb}

[ DynamoDB](https://aws.amazon.com/dynamodb)를 사용하여 작업 배치 정보를 저장할 때, 관계형 데이터베이스에 저장된 배치를 정리할 때 사용하는 일반적인 정리 명령어는 동작하지 않습니다. 대신, [DynamoDB의 기본 TTL 기능](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)을 활용하여 오래된 배치의 레코드를 자동으로 삭제할 수 있습니다.

DynamoDB 테이블에 `ttl` 속성을 정의했다면, Laravel이 배치 레코드를 어떻게 정리할지 설정하는 구성 파라미터를 지정할 수 있습니다. `queue.batching.ttl_attribute` 구성 값은 TTL을 저장하는 속성의 이름을 정의하며, `queue.batching.ttl` 구성 값은 레코드가 마지막으로 업데이트된 시점을 기준으로, 해당 배치 레코드가 DynamoDB 테이블에서 삭제될 수 있는(만료되는) 초 단위의 시간을 지정합니다:

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

잡 클래스를 큐에 디스패치하는 대신, 클로저를 큐에 디스패치할 수도 있습니다. 이는 현재 요청 사이클 외부에서 실행되어야 하는 간단하고 빠른 작업에 적합합니다. 클로저를 큐에 디스패치할 때, 클로저의 코드 내용은 전송 중에 수정될 수 없도록 암호화 서명됩니다.

```php
$podcast = App\Podcast::find(1);

dispatch(function () use ($podcast) {
    $podcast->publish();
});
```

큐잉된 클로저에 이름을 지정하여 큐 대시보드에서 사용하거나 `queue:work` 명령어에서 표시되도록 하려면 `name` 메서드를 사용할 수 있습니다.

```php
dispatch(function () {
    // ...
})->name('Publish Podcast');
```

`catch` 메서드를 사용하면, 큐잉된 클로저가 [설정된 재시도 횟수](#max-job-attempts-and-timeout)를 모두 소진한 후에도 성공적으로 완료되지 못했을 때 실행할 클로저를 지정할 수 있습니다.

```php
use Throwable;

dispatch(function () use ($podcast) {
    $podcast->publish();
})->catch(function (Throwable $e) {
    // 이 잡이 실패했습니다...
});
```

> [!WARNING]
> `catch` 콜백은 직렬화되어 나중에 Laravel 큐에 의해 실행되므로, `catch` 콜백 내에서 `$this` 변수를 사용하지 않아야 합니다.


## 큐 워커 실행하기 {#running-the-queue-worker}


### `queue:work` 명령어 {#the-queue-work-command}

Laravel은 Artisan 명령어를 통해 큐 워커를 시작하고, 큐에 새 작업이 추가될 때마다 이를 처리할 수 있습니다. `queue:work` Artisan 명령어를 사용하여 워커를 실행할 수 있습니다. `queue:work` 명령어가 시작되면, 수동으로 중지하거나 터미널을 닫을 때까지 계속 실행됩니다:

```shell
php artisan queue:work
```

> [!NOTE]
> `queue:work` 프로세스를 백그라운드에서 영구적으로 실행하려면, [Supervisor](#supervisor-configuration)와 같은 프로세스 모니터를 사용하여 큐 워커가 중단되지 않도록 관리해야 합니다.

처리된 작업의 ID를 명령어 출력에 포함하고 싶다면, `queue:work` 명령어 실행 시 `-v` 플래그를 추가할 수 있습니다:

```shell
php artisan queue:work -v
```

큐 워커는 장시간 실행되는 프로세스이며, 부팅된 애플리케이션 상태를 메모리에 저장합니다. 따라서 워커가 시작된 이후 코드베이스에 변경이 있어도 이를 감지하지 못합니다. 배포 과정에서는 반드시 [큐 워커를 재시작](#queue-workers-and-deployment)해야 합니다. 또한, 애플리케이션에서 생성되거나 수정된 모든 정적 상태는 작업 간에 자동으로 초기화되지 않는다는 점도 유의하세요.

또 다른 방법으로, `queue:listen` 명령어를 사용할 수도 있습니다. 이 명령어를 사용하면 코드가 업데이트되거나 애플리케이션 상태를 재설정하고 싶을 때 워커를 수동으로 재시작할 필요가 없습니다. 하지만, 이 명령어는 `queue:work` 명령어에 비해 성능이 크게 떨어집니다:

```shell
php artisan queue:listen
```


#### 여러 큐 워커 실행하기 {#running-multiple-queue-workers}

여러 워커를 큐에 할당하여 작업을 동시에 처리하려면, 단순히 여러 개의 `queue:work` 프로세스를 시작하면 됩니다. 이는 로컬에서는 터미널의 여러 탭을 통해 실행할 수 있고, 프로덕션 환경에서는 프로세스 관리자의 설정을 통해 구성할 수 있습니다. [Supervisor를 사용할 때](#supervisor-configuration)는 `numprocs` 설정 값을 사용할 수 있습니다.


#### 연결 및 큐 지정하기 {#specifying-the-connection-queue}

워커가 사용할 큐 연결을 지정할 수도 있습니다. `work` 명령어에 전달하는 연결 이름은 `config/queue.php` 설정 파일에 정의된 연결 중 하나와 일치해야 합니다:

```shell
php artisan queue:work redis
```

기본적으로 `queue:work` 명령어는 주어진 연결의 기본 큐에 있는 작업만 처리합니다. 하지만, 특정 연결에서 특정 큐만 처리하도록 큐 워커를 더욱 세밀하게 설정할 수도 있습니다. 예를 들어, 모든 이메일이 `redis` 큐 연결의 `emails` 큐에서 처리된다면, 아래와 같이 해당 큐만 처리하는 워커를 실행할 수 있습니다:

```shell
php artisan queue:work redis --queue=emails
```


#### 지정된 개수의 작업 처리하기 {#processing-a-specified-number-of-jobs}

`--once` 옵션을 사용하면 워커가 큐에서 단일 작업만 처리하도록 지시할 수 있습니다.

```shell
php artisan queue:work --once
```

`--max-jobs` 옵션을 사용하면 워커가 지정된 개수의 작업을 처리한 후 종료하도록 할 수 있습니다. 이 옵션은 [Supervisor](#supervisor-configuration)와 함께 사용하면, 워커가 일정 개수의 작업을 처리한 후 자동으로 재시작되어 누적된 메모리를 해제하는 데 유용합니다.

```shell
php artisan queue:work --max-jobs=1000
```


#### 모든 대기 중인 작업 처리 후 종료 {#processing-all-queued-jobs-then-exiting}

`--stop-when-empty` 옵션을 사용하면 워커가 모든 작업을 처리한 후 정상적으로 종료하도록 지시할 수 있습니다. 이 옵션은 Docker 컨테이너 내에서 Laravel 큐를 처리할 때, 큐가 비워진 후 컨테이너를 종료하고 싶을 때 유용합니다:

```shell
php artisan queue:work --stop-when-empty
```


#### 주어진 시간(초) 동안 작업 처리하기 {#processing-jobs-for-a-given-number-of-seconds}

`--max-time` 옵션을 사용하면 워커가 지정된 초만큼 작업을 처리한 후 종료하도록 지시할 수 있습니다. 이 옵션은 [Supervisor](#supervisor-configuration)와 함께 사용하면 유용한데, 워커가 일정 시간 동안 작업을 처리한 후 자동으로 재시작되어 누적된 메모리를 해제할 수 있습니다.

```shell
# 작업을 1시간 동안 처리한 후 종료하기
php artisan queue:work --max-time=3600
```


#### 워커 대기 시간 {#worker-sleep-duration}

큐에 작업이 있을 때, 워커는 작업들 사이에 지연 없이 계속해서 작업을 처리합니다. 하지만 `sleep` 옵션은 처리할 작업이 없을 때 워커가 "대기"할 시간을 초 단위로 지정합니다. 물론, 대기 중에는 워커가 새로운 작업을 처리하지 않습니다:

```shell
php artisan queue:work --sleep=3
```


#### 유지보수 모드와 큐 {#maintenance-mode-queues}

애플리케이션이 [유지보수 모드](/laravel/12.x/configuration#maintenance-mode)일 때는 큐에 등록된 작업이 처리되지 않습니다. 애플리케이션이 유지보수 모드에서 벗어나면 작업들은 정상적으로 처리됩니다.

유지보수 모드가 활성화되어 있어도 큐 워커가 작업을 강제로 처리하도록 하려면, `--force` 옵션을 사용할 수 있습니다:

```shell
php artisan queue:work --force
```


#### 리소스 고려사항 {#resource-considerations}

데몬 큐 워커는 각 작업을 처리하기 전에 프레임워크를 "재시작"하지 않습니다. 따라서 각 작업이 완료된 후에는 무거운 리소스를 반드시 해제해야 합니다. 예를 들어, GD 라이브러리를 사용하여 이미지 조작을 하는 경우, 이미지 처리가 끝난 후에는 `imagedestroy`를 사용하여 메모리를 해제해야 합니다.


### 큐 우선순위 {#queue-priorities}

때때로 큐가 처리되는 우선순위를 지정하고 싶을 수 있습니다. 예를 들어, `config/queue.php` 설정 파일에서 `redis` 연결의 기본 `queue`를 `low`로 설정할 수 있습니다. 하지만 가끔은 아래와 같이 `high` 우선순위 큐에 작업을 추가하고 싶을 때가 있습니다:

```php
dispatch((new Job)->onQueue('high'));
```

`high` 큐의 모든 작업이 먼저 처리된 후에 `low` 큐의 작업을 처리하도록 워커를 시작하려면, 큐 이름을 쉼표로 구분하여 `work` 명령어에 전달하면 됩니다:

```shell
php artisan queue:work --queue=high,low
```


### 큐 워커와 배포 {#queue-workers-and-deployment}

큐 워커는 장시간 실행되는 프로세스이기 때문에, 코드를 변경해도 워커를 재시작하지 않으면 변경 사항을 인식하지 못합니다. 따라서 큐 워커를 사용하는 애플리케이션을 배포하는 가장 간단한 방법은 배포 과정에서 워커를 재시작하는 것입니다. 모든 워커를 정상적으로 재시작하려면 `queue:restart` 명령어를 실행하면 됩니다:

```shell
php artisan queue:restart
```

이 명령어는 모든 큐 워커에게 현재 작업을 마친 후 정상적으로 종료하라는 신호를 보냅니다. 이로 인해 기존 작업이 유실되지 않습니다. `queue:restart` 명령어가 실행되면 큐 워커가 종료되므로, 큐 워커를 자동으로 재시작할 수 있도록 [Supervisor](#supervisor-configuration)와 같은 프로세스 관리자를 사용해야 합니다.

> [!NOTE]
> 큐는 재시작 신호를 저장하기 위해 [캐시](/laravel/12.x/cache)를 사용하므로, 이 기능을 사용하기 전에 애플리케이션에 캐시 드라이버가 올바르게 설정되어 있는지 반드시 확인해야 합니다.


### 작업 만료 및 타임아웃 {#job-expirations-and-timeouts}


#### 작업 만료 {#job-expiration}

`config/queue.php` 설정 파일에서 각 큐 연결은 `retry_after` 옵션을 정의합니다. 이 옵션은 처리 중인 작업을 다시 시도하기 전에 큐 연결이 몇 초 동안 대기해야 하는지를 지정합니다. 예를 들어, `retry_after` 값이 `90`으로 설정되어 있다면, 작업이 90초 동안 처리되고 있음에도 해제되거나 삭제되지 않았다면 해당 작업은 다시 큐에 반환됩니다. 일반적으로 `retry_after` 값은 작업이 합리적으로 완료될 수 있는 최대 시간을 초 단위로 설정해야 합니다.

> [!경고]
> `retry_after` 값을 포함하지 않는 유일한 큐 연결은 Amazon SQS입니다. SQS는 AWS 콘솔에서 관리되는 [기본 가시성 제한 시간(Default Visibility Timeout)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/AboutVT.html)에 따라 작업을 재시도합니다.


#### 워커 타임아웃 {#worker-timeouts}

`queue:work` Artisan 명령어는 `--timeout` 옵션을 제공합니다. 기본적으로 `--timeout` 값은 60초입니다. 만약 작업이 타임아웃 값으로 지정된 초보다 더 오래 처리된다면, 해당 작업을 처리하던 워커는 에러와 함께 종료됩니다. 일반적으로 워커는 [서버에 설정된 프로세스 매니저](#supervisor-configuration)에 의해 자동으로 재시작됩니다.

```shell
php artisan queue:work --timeout=60
```

`retry_after` 설정 옵션과 `--timeout` CLI 옵션은 서로 다르지만, 작업이 유실되지 않고 한 번만 성공적으로 처리되도록 함께 동작합니다.

> [!경고]
> `--timeout` 값은 항상 `retry_after` 설정 값보다 몇 초 이상 짧게 설정해야 합니다. 이렇게 하면 멈춰버린 작업을 처리하는 워커가 작업이 재시도되기 전에 항상 종료되도록 보장할 수 있습니다. 만약 `--timeout` 옵션이 `retry_after` 설정 값보다 길다면, 작업이 두 번 처리될 수 있습니다.


## Supervisor 구성 {#supervisor-configuration}

운영 환경에서는 `queue:work` 프로세스가 계속 실행되도록 관리할 방법이 필요합니다. `queue:work` 프로세스는 워커 타임아웃 초과나 `queue:restart` 명령 실행 등 다양한 이유로 중단될 수 있습니다.

이러한 이유로, `queue:work` 프로세스가 종료되었을 때 이를 감지하고 자동으로 재시작할 수 있는 프로세스 모니터를 설정해야 합니다. 또한, 프로세스 모니터를 사용하면 동시에 몇 개의 `queue:work` 프로세스를 실행할지 지정할 수도 있습니다. Supervisor는 리눅스 환경에서 널리 사용되는 프로세스 모니터로, 아래 문서에서는 Supervisor를 어떻게 설정하는지 설명합니다.


#### Supervisor 설치하기 {#installing-supervisor}

Supervisor는 리눅스 운영체제에서 동작하는 프로세스 모니터로, `queue:work` 프로세스가 실패할 경우 자동으로 재시작해줍니다. Ubuntu에 Supervisor를 설치하려면 다음 명령어를 사용할 수 있습니다:

```shell
sudo apt-get install supervisor
```

> [!NOTE]
> Supervisor를 직접 설정하고 관리하는 것이 부담스럽다면, [Laravel Cloud](https://cloud.laravel.com)와 같이 Laravel 큐 워커를 실행할 수 있는 완전 관리형 플랫폼을 사용하는 것도 고려해보세요.


#### Supervisor 설정 {#configuring-supervisor}

Supervisor 설정 파일은 일반적으로 `/etc/supervisor/conf.d` 디렉터리에 저장됩니다. 이 디렉터리 내에서, Supervisor가 프로세스를 어떻게 모니터링할지 지시하는 여러 개의 설정 파일을 생성할 수 있습니다. 예를 들어, `queue:work` 프로세스를 시작하고 모니터링하는 `laravel-worker.conf` 파일을 다음과 같이 생성할 수 있습니다:

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

이 예시에서 `numprocs` 지시어는 Supervisor에게 8개의 `queue:work` 프로세스를 실행하고 모두 모니터링하도록 지시하며, 만약 프로세스가 실패하면 자동으로 재시작합니다. 설정의 `command` 지시어는 원하는 큐 연결 및 워커 옵션에 맞게 변경해야 합니다.

> [!WARNING]
> `stopwaitsecs` 값이 가장 오래 실행되는 작업에 소요되는 시간(초)보다 커야 합니다. 그렇지 않으면 Supervisor가 작업이 끝나기 전에 강제로 종료시킬 수 있습니다.


#### Supervisor 시작하기 {#starting-supervisor}

설정 파일을 생성한 후, 다음 명령어를 사용하여 Supervisor 설정을 갱신하고 프로세스를 시작할 수 있습니다:

```shell
sudo supervisorctl reread

sudo supervisorctl update

sudo supervisorctl start "laravel-worker:*"
```

Supervisor에 대한 더 자세한 내용은 [Supervisor 공식 문서](http://supervisord.org/index.html)를 참고하세요.


## 실패한 작업 처리하기 {#dealing-with-failed-jobs}

가끔 큐에 등록된 작업이 실패할 수 있습니다. 걱정하지 마세요, 모든 일이 항상 계획대로 되지는 않으니까요! Laravel은 [작업이 시도될 최대 횟수](#max-job-attempts-and-timeout)를 지정할 수 있는 편리한 방법을 제공합니다. 비동기 작업이 이 횟수를 초과하면, 해당 작업은 `failed_jobs` 데이터베이스 테이블에 저장됩니다. [동기적으로 디스패치된 작업](/laravel/12.x/queues#synchronous-dispatching)이 실패할 경우에는 이 테이블에 저장되지 않고, 예외가 즉시 애플리케이션에서 처리됩니다.

새로운 Laravel 애플리케이션에는 일반적으로 `failed_jobs` 테이블을 생성하는 마이그레이션이 이미 포함되어 있습니다. 만약 애플리케이션에 이 테이블을 위한 마이그레이션이 없다면, `make:queue-failed-table` 명령어를 사용해 마이그레이션을 생성할 수 있습니다:

```shell
php artisan make:queue-failed-table

php artisan migrate
```

[큐 워커](#running-the-queue-worker) 프로세스를 실행할 때, `queue:work` 명령어의 `--tries` 옵션을 사용해 작업이 시도될 최대 횟수를 지정할 수 있습니다. `--tries` 옵션에 값을 지정하지 않으면, 작업은 한 번만 시도되거나 작업 클래스의 `$tries` 속성에 지정된 횟수만큼 시도됩니다:

```shell
php artisan queue:work redis --tries=3
```

`--backoff` 옵션을 사용하면, 예외가 발생한 작업을 다시 시도하기 전에 Laravel이 몇 초 동안 대기할지 지정할 수 있습니다. 기본적으로 작업은 즉시 큐에 다시 올려져 재시도됩니다:

```shell
php artisan queue:work redis --tries=3 --backoff=3
```

작업별로 예외 발생 시 재시도까지 대기할 시간을 설정하고 싶다면, 작업 클래스에 `backoff` 속성을 정의하면 됩니다:

```php
/**
 * 작업을 재시도하기 전 대기할 시간(초)
 *
 * @var int
 */
public $backoff = 3;
```

더 복잡한 로직으로 대기 시간을 결정해야 한다면, 작업 클래스에 `backoff` 메서드를 정의할 수 있습니다:

```php
/**
 * 작업을 재시도하기 전 대기할 시간(초)을 계산합니다.
 */
public function backoff(): int
{
    return 3;
}
```

"지수적" 백오프(재시도 간격 증가)를 쉽게 설정하려면, `backoff` 메서드에서 백오프 값을 배열로 반환하면 됩니다. 아래 예시에서는 첫 번째 재시도는 1초, 두 번째는 5초, 세 번째는 10초, 이후 남은 시도마다 10초씩 대기하게 됩니다:

```php
/**
 * 작업을 재시도하기 전 대기할 시간(초)을 계산합니다.
 *
 * @return array<int, int>
 */
public function backoff(): array
{
    return [1, 5, 10];
}
```


### 작업 실패 후 정리 {#cleaning-up-after-failed-jobs}

특정 작업이 실패했을 때, 사용자에게 알림을 보내거나 작업 도중 일부만 완료된 동작을 되돌리고 싶을 수 있습니다. 이를 위해 작업 클래스에 `failed` 메서드를 정의할 수 있습니다. 작업이 실패하게 만든 `Throwable` 인스턴스가 `failed` 메서드로 전달됩니다:

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
     * 새로운 작업 인스턴스 생성자.
     */
    public function __construct(
        public Podcast $podcast,
    ) {}

    /**
     * 작업 실행.
     */
    public function handle(AudioProcessor $processor): void
    {
        // 업로드된 팟캐스트 처리...
    }

    /**
     * 작업 실패 처리.
     */
    public function failed(?Throwable $exception): void
    {
        // 실패 알림 전송 등...
    }
}
```

> [!WARNING]
> `failed` 메서드가 호출되기 전에 작업의 새로운 인스턴스가 생성되므로, `handle` 메서드 내에서 변경된 클래스 속성 값은 모두 사라집니다.


### 실패한 작업 재시도 {#retrying-failed-jobs}

`failed_jobs` 데이터베이스 테이블에 저장된 모든 실패한 작업을 확인하려면, `queue:failed` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan queue:failed
```

`queue:failed` 명령어는 작업 ID, 연결 정보, 큐 이름, 실패 시간 등 작업에 대한 다양한 정보를 보여줍니다. 작업 ID는 실패한 작업을 재시도할 때 사용할 수 있습니다. 예를 들어, ID가 `ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece`인 실패한 작업을 재시도하려면 다음과 같이 명령어를 입력합니다:

```shell
php artisan queue:retry ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece
```

필요하다면 여러 개의 ID를 한 번에 전달할 수도 있습니다:

```shell
php artisan queue:retry ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece 91401d2c-0784-4f43-824c-34f94a33c24d
```

특정 큐의 모든 실패한 작업을 재시도하려면 다음과 같이 입력합니다:

```shell
php artisan queue:retry --queue=name
```

모든 실패한 작업을 한 번에 재시도하려면, `queue:retry` 명령어에 `all`을 ID로 전달하면 됩니다:

```shell
php artisan queue:retry all
```

실패한 작업을 삭제하고 싶다면, `queue:forget` 명령어를 사용할 수 있습니다:

```shell
php artisan queue:forget 91401d2c-0784-4f43-824c-34f94a33c24d
```

> [!NOTE]
> [Horizon](/laravel/12.x/horizon)을 사용할 경우, `queue:forget` 명령어 대신 `horizon:forget` 명령어로 실패한 작업을 삭제해야 합니다.

`failed_jobs` 테이블에 있는 모든 실패한 작업을 삭제하려면, `queue:flush` 명령어를 사용하세요:

```shell
php artisan queue:flush
```


### 누락된 모델 무시하기 {#ignoring-missing-models}

Eloquent 모델을 작업에 주입할 때, 해당 모델은 큐에 넣기 전에 자동으로 직렬화되고, 작업이 처리될 때 데이터베이스에서 다시 조회됩니다. 하지만 작업이 워커에 의해 처리되기를 기다리는 동안 모델이 삭제된 경우, 작업이 `ModelNotFoundException`과 함께 실패할 수 있습니다.

편의를 위해, 작업의 `deleteWhenMissingModels` 속성을 `true`로 설정하면 누락된 모델이 있는 작업을 자동으로 삭제하도록 할 수 있습니다. 이 속성이 `true`로 설정되면, Laravel은 예외를 발생시키지 않고 조용히 해당 작업을 폐기합니다:

```php
/**
 * 모델이 더 이상 존재하지 않으면 작업을 삭제합니다.
 *
 * @var bool
 */
public $deleteWhenMissingModels = true;
```


### 실패한 작업 레코드 정리 {#pruning-failed-jobs}

애플리케이션의 `failed_jobs` 테이블에 있는 레코드를 Artisan의 `queue:prune-failed` 명령어를 사용하여 정리할 수 있습니다.

```shell
php artisan queue:prune-failed
```

기본적으로 24시간이 지난 모든 실패한 작업 레코드가 정리됩니다. 명령어에 `--hours` 옵션을 추가하면, 최근 N시간 이내에 삽입된 실패한 작업 레코드만 남기고 그 이전의 레코드는 삭제됩니다. 예를 들어, 아래 명령어는 48시간이 지난 모든 실패한 작업 레코드를 삭제합니다.

```shell
php artisan queue:prune-failed --hours=48
```


### DynamoDB에 실패한 작업 저장하기 {#storing-failed-jobs-in-dynamodb}

Laravel은 관계형 데이터베이스 테이블 대신 [DynamoDB](https://aws.amazon.com/dynamodb)에 실패한 작업 레코드를 저장하는 것도 지원합니다. 하지만, 모든 실패한 작업 레코드를 저장할 DynamoDB 테이블을 직접 생성해야 합니다. 일반적으로 이 테이블의 이름은 `failed_jobs`로 지정하지만, 애플리케이션의 `queue` 설정 파일 내 `queue.failed.table` 설정 값에 따라 테이블 이름을 지정해야 합니다.

`failed_jobs` 테이블에는 문자열 타입의 파티션 키 `application`과 문자열 타입의 정렬 키 `uuid`가 있어야 합니다. 키의 `application` 부분에는 애플리케이션의 `app` 설정 파일 내 `name` 설정 값이 들어갑니다. 애플리케이션 이름이 DynamoDB 테이블 키의 일부이기 때문에, 여러 Laravel 애플리케이션의 실패한 작업을 동일한 테이블에 저장할 수 있습니다.

또한, Laravel 애플리케이션이 Amazon DynamoDB와 통신할 수 있도록 AWS SDK를 설치해야 합니다:

```shell
composer require aws/aws-sdk-php
```

그 다음, `queue.failed.driver` 설정 값을 `dynamodb`로 지정합니다. 추가로, 실패한 작업 설정 배열 내에 `key`, `secret`, `region` 설정 옵션을 정의해야 합니다. 이 옵션들은 AWS 인증에 사용됩니다. `dynamodb` 드라이버를 사용할 때는 `queue.failed.database` 설정 옵션이 필요하지 않습니다:

```php
'failed' => [
    'driver' => env('QUEUE_FAILED_DRIVER', 'dynamodb'),
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'table' => 'failed_jobs',
],
```


### 실패한 작업 저장 비활성화 {#disabling-failed-job-storage}

Laravel에서 실패한 작업을 저장하지 않고 바로 폐기하도록 하려면 `queue.failed.driver` 설정 옵션의 값을 `null`로 지정하면 됩니다. 일반적으로는 `QUEUE_FAILED_DRIVER` 환경 변수를 통해 다음과 같이 설정할 수 있습니다:

```ini
QUEUE_FAILED_DRIVER=null
```


### 실패한 작업 이벤트 {#failed-job-events}

작업이 실패했을 때 호출되는 이벤트 리스너를 등록하고 싶다면, `Queue` 파사드의 `failing` 메서드를 사용할 수 있습니다. 예를 들어, Laravel에 기본 포함된 `AppServiceProvider`의 `boot` 메서드에서 이 이벤트에 클로저를 연결할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;
use Illuminate\Queue\Events\JobFailed;

class AppServiceProvider extends ServiceProvider
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
        Queue::failing(function (JobFailed $event) {
            // $event->connectionName
            // $event->job
            // $event->exception
        });
    }
}
```


## 큐에서 작업 삭제하기 {#clearing-jobs-from-queues}

> [!NOTE]
> [Horizon](/laravel/12.x/horizon)를 사용하는 경우, `queue:clear` 명령어 대신 `horizon:clear` 명령어를 사용하여 큐에서 작업을 삭제해야 합니다.

기본 연결의 기본 큐에 있는 모든 작업을 삭제하려면 `queue:clear` Artisan 명령어를 사용할 수 있습니다.

```shell
php artisan queue:clear
```

특정 연결과 큐에서 작업을 삭제하려면 `connection` 인자와 `queue` 옵션을 함께 사용할 수 있습니다.

```shell
php artisan queue:clear redis --queue=emails
```

> [!WARNING]
> 큐에서 작업을 삭제하는 기능은 SQS, Redis, 데이터베이스 큐 드라이버에서만 사용할 수 있습니다. 또한, SQS의 메시지 삭제 과정은 최대 60초가 소요될 수 있으므로, 큐를 비운 후 60초 이내에 SQS 큐로 전송된 작업도 함께 삭제될 수 있습니다.


## 큐 모니터링 {#monitoring-your-queues}

큐에 갑작스럽게 많은 작업이 몰리면, 큐가 과부하되어 작업 완료까지 오랜 시간이 걸릴 수 있습니다. 원한다면, Laravel은 큐의 작업 수가 지정한 임계값을 초과할 때 알림을 보낼 수 있습니다.

먼저, `queue:monitor` 명령어를 [매 분마다 실행](/laravel/12.x/scheduling)하도록 스케줄링해야 합니다. 이 명령어는 모니터링할 큐의 이름과 원하는 작업 수 임계값을 인자로 받습니다:

```shell
php artisan queue:monitor redis:default,redis:deployments --max=100
```

이 명령어를 스케줄링하는 것만으로는 큐가 과부하 상태임을 알리는 알림이 자동으로 전송되지 않습니다. 명령어가 큐의 작업 수가 임계값을 초과한 것을 감지하면, `Illuminate\Queue\Events\QueueBusy` 이벤트가 발생합니다. 이 이벤트를 애플리케이션의 `AppServiceProvider`에서 감지하여, 개발자나 팀에게 알림을 보낼 수 있습니다:

```php
use App\Notifications\QueueHasLongWaitTime;
use Illuminate\Queue\Events\QueueBusy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
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

잡을 디스패치하는 코드를 테스트할 때, 해당 잡이 실제로 실행되지 않도록 Laravel에 지시하고 싶을 수 있습니다. 잡의 코드는 직접적으로, 그리고 디스패치하는 코드와는 별도로 테스트할 수 있기 때문입니다. 물론, 잡 자체를 테스트하려면 테스트에서 잡 인스턴스를 생성하고 `handle` 메서드를 직접 호출하면 됩니다.

큐에 잡이 실제로 푸시되는 것을 방지하려면 `Queue` 파사드의 `fake` 메서드를 사용할 수 있습니다. `Queue` 파사드의 `fake` 메서드를 호출한 후에는, 애플리케이션이 잡을 큐에 푸시하려고 시도했는지 단언할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Jobs\AnotherJob;
use App\Jobs\FinalJob;
use App\Jobs\ShipOrder;
use Illuminate\Support\Facades\Queue;

test('orders can be shipped', function () {
    Queue::fake();

    // 주문 배송 처리...

    // 어떤 잡도 푸시되지 않았는지 단언...
    Queue::assertNothingPushed();

    // 특정 큐에 잡이 푸시되었는지 단언...
    Queue::assertPushedOn('queue-name', ShipOrder::class);

    // 잡이 두 번 푸시되었는지 단언...
    Queue::assertPushed(ShipOrder::class, 2);

    // 잡이 푸시되지 않았는지 단언...
    Queue::assertNotPushed(AnotherJob::class);

    // 클로저가 큐에 푸시되었는지 단언...
    Queue::assertClosurePushed();

    // 푸시된 잡의 총 개수를 단언...
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

        // 주문 배송 처리...

        // 어떤 잡도 푸시되지 않았는지 단언...
        Queue::assertNothingPushed();

        // 특정 큐에 잡이 푸시되었는지 단언...
        Queue::assertPushedOn('queue-name', ShipOrder::class);

        // 잡이 두 번 푸시되었는지 단언...
        Queue::assertPushed(ShipOrder::class, 2);

        // 잡이 푸시되지 않았는지 단언...
        Queue::assertNotPushed(AnotherJob::class);

        // 클로저가 큐에 푸시되었는지 단언...
        Queue::assertClosurePushed();

        // 푸시된 잡의 총 개수를 단언...
        Queue::assertCount(3);
    }
}
```
:::
`assertPushed` 또는 `assertNotPushed` 메서드에 클로저를 전달하여, 주어진 "진리 테스트"를 통과하는 잡이 푸시되었는지 단언할 수 있습니다. 주어진 진리 테스트를 통과하는 잡이 하나라도 푸시되었다면, 해당 단언은 성공합니다:

```php
Queue::assertPushed(function (ShipOrder $job) use ($order) {
    return $job->order->id === $order->id;
});
```


### 일부 작업만 페이크 처리하기 {#faking-a-subset-of-jobs}

특정 작업만 페이크 처리하고 나머지 작업은 정상적으로 실행되도록 하려면, 페이크 처리할 작업의 클래스 이름을 `fake` 메서드에 전달하면 됩니다:
::: code-group
```php [Pest]
test('orders can be shipped', function () {
    Queue::fake([
        ShipOrder::class,
    ]);

    // 주문 배송 처리...

    // 작업이 두 번 푸시되었는지 확인...
    Queue::assertPushed(ShipOrder::class, 2);
});
```

```php [PHPUnit]
public function test_orders_can_be_shipped(): void
{
    Queue::fake([
        ShipOrder::class,
    ]);

    // 주문 배송 처리...

    // 작업이 두 번 푸시되었는지 확인...
    Queue::assertPushed(ShipOrder::class, 2);
}
```
:::
특정 작업을 제외한 모든 작업을 페이크 처리하고 싶다면, `except` 메서드를 사용할 수 있습니다:

```php
Queue::fake()->except([
    ShipOrder::class,
]);
```


### 잡 체인 테스트하기 {#testing-job-chains}

잡 체인을 테스트하려면 `Bus` 파사드의 페이크 기능을 활용해야 합니다. `Bus` 파사드의 `assertChained` 메서드는 [잡 체인](/laravel/12.x/queues#job-chaining)이 디스패치되었는지 확인하는 데 사용할 수 있습니다. `assertChained` 메서드는 체인에 포함된 잡들의 배열을 첫 번째 인자로 받습니다:

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

위 예시에서 볼 수 있듯이, 체인에 포함된 잡들의 배열은 잡 클래스 이름의 배열일 수 있습니다. 하지만 실제 잡 인스턴스의 배열을 제공할 수도 있습니다. 이 경우, Laravel은 해당 잡 인스턴스가 동일한 클래스이며, 애플리케이션에서 디스패치된 체인 잡들과 동일한 속성 값을 가지고 있는지 확인합니다:

```php
Bus::assertChained([
    new ShipOrder,
    new RecordShipment,
    new UpdateInventory,
]);
```

또한, `assertDispatchedWithoutChain` 메서드를 사용하여 잡이 체인 없이 디스패치되었는지 확인할 수 있습니다:

```php
Bus::assertDispatchedWithoutChain(ShipOrder::class);
```


#### 체인 수정 테스트 {#testing-chain-modifications}

체인으로 연결된 잡이 [기존 체인에 잡을 앞이나 뒤에 추가](#adding-jobs-to-the-chain)하는 경우, 잡의 `assertHasChain` 메서드를 사용하여 해당 잡에 예상한 순서의 남은 잡 체인이 있는지 확인할 수 있습니다.

```php
$job = new ProcessPodcast;

$job->handle();

$job->assertHasChain([
    new TranscribePodcast,
    new OptimizePodcast,
    new ReleasePodcast,
]);
```

`assertDoesntHaveChain` 메서드는 잡의 남은 체인이 비어 있는지 확인할 때 사용할 수 있습니다.

```php
$job->assertDoesntHaveChain();
```


#### 체인 배치 테스트 {#testing-chained-batches}

만약 여러분의 잡 체인에 [잡 배치가 포함](#chains-and-batches)되어 있다면, 체인 어설션 내에 `Bus::chainedBatch` 정의를 삽입하여 체인된 배치가 기대한 대로 동작하는지 검증할 수 있습니다:

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

`Bus` 파사드의 `assertBatched` 메서드를 사용하여 [잡 배치](/laravel/12.x/queues#job-batching)가 디스패치되었는지 확인할 수 있습니다. `assertBatched` 메서드에 전달되는 클로저는 `Illuminate\Bus\PendingBatch` 인스턴스를 받으며, 이를 통해 배치 내의 잡들을 검사할 수 있습니다:

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

`assertBatchCount` 메서드를 사용하면 특정 개수의 배치가 디스패치되었는지 확인할 수 있습니다:

```php
Bus::assertBatchCount(3);
```

`assertNothingBatched`를 사용하면 어떠한 배치도 디스패치되지 않았는지 확인할 수 있습니다:

```php
Bus::assertNothingBatched();
```


#### 잡 / 배치 상호작용 테스트 {#testing-job-batch-interaction}

또한, 개별 잡이 그 하위 배치와 어떻게 상호작용하는지 테스트해야 할 때가 있습니다. 예를 들어, 잡이 배치의 추가 처리를 취소했는지 테스트해야 할 수 있습니다. 이를 위해서는 `withFakeBatch` 메서드를 통해 잡에 가짜 배치를 할당해야 합니다. `withFakeBatch` 메서드는 잡 인스턴스와 가짜 배치가 포함된 튜플을 반환합니다:

```php
[$job, $batch] = (new ShipOrder)->withFakeBatch();

$job->handle();

$this->assertTrue($batch->cancelled());
$this->assertEmpty($batch->added);
```


### 작업 / 큐 상호작용 테스트하기 {#testing-job-queue-interactions}

때때로, 큐에 등록된 작업이 [스스로를 큐에 다시 릴리즈하는지](#manually-releasing-a-job) 테스트해야 할 때가 있습니다. 또는 작업이 스스로를 삭제했는지 테스트해야 할 수도 있습니다. 이러한 큐 상호작용을 테스트하려면 작업을 인스턴스화한 후 `withFakeQueueInteractions` 메서드를 호출하면 됩니다.

작업의 큐 상호작용이 페이크로 처리된 후에는 작업의 `handle` 메서드를 호출할 수 있습니다. 작업을 실행한 후에는 `assertReleased`, `assertDeleted`, `assertNotDeleted`, `assertFailed`, `assertFailedWith`, `assertNotFailed` 메서드를 사용하여 작업의 큐 상호작용에 대해 다양한 단언을 할 수 있습니다:

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


## 작업 이벤트 {#job-events}

`Queue` [파사드](/laravel/12.x/facades)의 `before`와 `after` 메서드를 사용하면, 큐에 등록된 작업이 처리되기 전이나 후에 실행할 콜백을 지정할 수 있습니다. 이러한 콜백은 추가적인 로깅을 하거나 대시보드 통계를 증가시키는 데 유용합니다. 일반적으로 이 메서드들은 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 호출하는 것이 좋습니다. 예를 들어, Laravel에 기본 포함된 `AppServiceProvider`를 사용할 수 있습니다:

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

`Queue` [파사드](/laravel/12.x/facades)의 `looping` 메서드를 사용하면, 워커가 큐에서 작업을 가져오기 전에 실행할 콜백을 지정할 수 있습니다. 예를 들어, 이전에 실패한 작업으로 인해 남아있는 트랜잭션을 롤백하는 클로저를 등록할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

Queue::looping(function () {
    while (DB::transactionLevel() > 0) {
        DB::rollBack();
    }
});
```
