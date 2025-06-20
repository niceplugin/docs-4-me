# 이벤트























## 소개 {#introduction}

Laravel의 이벤트는 간단한 옵저버 패턴 구현을 제공하여, 애플리케이션 내에서 발생하는 다양한 이벤트를 구독하고 청취할 수 있게 해줍니다. 이벤트 클래스는 일반적으로 `app/Events` 디렉터리에, 해당 리스너는 `app/Listeners` 디렉터리에 저장됩니다. 만약 애플리케이션에 이 디렉터리가 없다면 Artisan 콘솔 명령어로 이벤트와 리스너를 생성할 때 자동으로 생성되니 걱정하지 않으셔도 됩니다.

이벤트는 애플리케이션의 다양한 부분을 느슨하게 결합하는 훌륭한 방법입니다. 하나의 이벤트에 여러 리스너가 존재할 수 있으며, 이 리스너들은 서로에게 의존하지 않습니다. 예를 들어, 주문이 배송될 때마다 사용자에게 Slack 알림을 보내고 싶을 수 있습니다. 주문 처리 코드와 Slack 알림 코드를 직접 연결하는 대신, `App\Events\OrderShipped` 이벤트를 발생시키고, 리스너가 이를 받아 Slack 알림을 전송하도록 할 수 있습니다.


## 이벤트 및 리스너 생성 {#generating-events-and-listeners}

이벤트와 리스너를 빠르게 생성하려면 `make:event` 및 `make:listener` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan make:event PodcastProcessed

php artisan make:listener SendPodcastNotification --event=PodcastProcessed
```

편의를 위해, 추가 인자 없이 `make:event` 및 `make:listener` Artisan 명령어를 실행할 수도 있습니다. 이 경우, Laravel이 클래스 이름을 물어보고, 리스너를 생성할 때는 어떤 이벤트를 청취할지 물어봅니다:

```shell
php artisan make:event

php artisan make:listener
```


## 이벤트 및 리스너 등록 {#registering-events-and-listeners}


### 이벤트 자동 탐색 {#event-discovery}

기본적으로 Laravel은 애플리케이션의 `Listeners` 디렉터리를 스캔하여 이벤트 리스너를 자동으로 찾고 등록합니다. Laravel이 `handle` 또는 `__invoke`로 시작하는 메서드를 가진 리스너 클래스를 찾으면, 해당 메서드의 시그니처에 타입힌트된 이벤트에 대한 리스너로 등록합니다:

```php
use App\Events\PodcastProcessed;

class SendPodcastNotification
{
    /**
     * 이벤트를 처리합니다.
     */
    public function handle(PodcastProcessed $event): void
    {
        // ...
    }
}
```

PHP의 유니언 타입을 사용하여 여러 이벤트를 청취할 수도 있습니다:

```php
/**
 * 이벤트를 처리합니다.
 */
public function handle(PodcastProcessed|PodcastPublished $event): void
{
    // ...
}
```

리스너를 다른 디렉터리나 여러 디렉터리에 저장하려는 경우, 애플리케이션의 `bootstrap/app.php` 파일에서 `withEvents` 메서드를 사용하여 해당 디렉터리를 스캔하도록 Laravel에 지시할 수 있습니다:

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/Orders/Listeners',
])
```

`*` 문자를 와일드카드로 사용하여 유사한 여러 디렉터리를 스캔할 수도 있습니다:

```php
->withEvents(discover: [
    __DIR__.'/../app/Domain/*/Listeners',
])
```

`event:list` 명령어를 사용하면 애플리케이션에 등록된 모든 리스너를 나열할 수 있습니다:

```shell
php artisan event:list
```


#### 프로덕션에서의 이벤트 자동 탐색 {#event-discovery-in-production}

애플리케이션의 속도를 높이기 위해, `optimize` 또는 `event:cache` Artisan 명령어를 사용하여 모든 리스너의 매니페스트를 캐시해야 합니다. 일반적으로 이 명령어는 애플리케이션의 [배포 과정](/laravel/12.x/deployment#optimization)에서 실행되어야 합니다. 이 매니페스트는 프레임워크가 이벤트 등록 과정을 빠르게 처리하는 데 사용됩니다. `event:clear` 명령어로 이벤트 캐시를 삭제할 수 있습니다.


### 이벤트 수동 등록 {#manually-registering-events}

`Event` 파사드를 사용하여, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 이벤트와 해당 리스너를 수동으로 등록할 수 있습니다:

```php
use App\Domain\Orders\Events\PodcastProcessed;
use App\Domain\Orders\Listeners\SendPodcastNotification;
use Illuminate\Support\Facades\Event;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Event::listen(
        PodcastProcessed::class,
        SendPodcastNotification::class,
    );
}
```

`event:list` 명령어를 사용하면 애플리케이션에 등록된 모든 리스너를 나열할 수 있습니다:

```shell
php artisan event:list
```


### 클로저 리스너 {#closure-listeners}

일반적으로 리스너는 클래스로 정의되지만, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 클로저 기반 이벤트 리스너를 수동으로 등록할 수도 있습니다:

```php
use App\Events\PodcastProcessed;
use Illuminate\Support\Facades\Event;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Event::listen(function (PodcastProcessed $event) {
        // ...
    });
}
```


#### 큐잉 가능한 익명 이벤트 리스너 {#queuable-anonymous-event-listeners}

클로저 기반 이벤트 리스너를 등록할 때, 리스너 클로저를 `Illuminate\Events\queueable` 함수로 감싸면 Laravel이 해당 리스너를 [큐](/laravel/12.x/queues)를 사용해 실행하도록 할 수 있습니다:

```php
use App\Events\PodcastProcessed;
use function Illuminate\Events\queueable;
use Illuminate\Support\Facades\Event;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Event::listen(queueable(function (PodcastProcessed $event) {
        // ...
    }));
}
```

큐잉된 작업과 마찬가지로, `onConnection`, `onQueue`, `delay` 메서드를 사용해 큐 리스너의 실행을 커스터마이즈할 수 있습니다:

```php
Event::listen(queueable(function (PodcastProcessed $event) {
    // ...
})->onConnection('redis')->onQueue('podcasts')->delay(now()->addSeconds(10)));
```

익명 큐 리스너의 실패를 처리하고 싶다면, `queueable` 리스너를 정의할 때 `catch` 메서드에 클로저를 전달할 수 있습니다. 이 클로저는 이벤트 인스턴스와 리스너 실패를 유발한 `Throwable` 인스턴스를 받습니다:

```php
use App\Events\PodcastProcessed;
use function Illuminate\Events\queueable;
use Illuminate\Support\Facades\Event;
use Throwable;

Event::listen(queueable(function (PodcastProcessed $event) {
    // ...
})->catch(function (PodcastProcessed $event, Throwable $e) {
    // 큐잉된 리스너가 실패했습니다...
}));
```


#### 와일드카드 이벤트 리스너 {#wildcard-event-listeners}

`*` 문자를 와일드카드 파라미터로 사용하여 리스너를 등록할 수도 있습니다. 이를 통해 동일한 리스너에서 여러 이벤트를 포착할 수 있습니다. 와일드카드 리스너는 첫 번째 인자로 이벤트 이름, 두 번째 인자로 전체 이벤트 데이터 배열을 받습니다:

```php
Event::listen('event.*', function (string $eventName, array $data) {
    // ...
});
```


## 이벤트 정의 {#defining-events}

이벤트 클래스는 이벤트와 관련된 정보를 담는 데이터 컨테이너에 불과합니다. 예를 들어, `App\Events\OrderShipped` 이벤트가 [Eloquent ORM](/laravel/12.x/eloquent) 객체를 받는다고 가정해봅시다:

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * 새로운 이벤트 인스턴스를 생성합니다.
     */
    public function __construct(
        public Order $order,
    ) {}
}
```

보시다시피, 이 이벤트 클래스에는 로직이 없습니다. 구매된 `App\Models\Order` 인스턴스를 담는 컨테이너입니다. 이벤트에서 사용하는 `SerializesModels` 트레이트는, 이벤트 객체가 PHP의 `serialize` 함수로 직렬화될 때(예: [큐잉된 리스너](#queued-event-listeners) 사용 시) Eloquent 모델을 적절히 직렬화해줍니다.


## 리스너 정의 {#defining-listeners}

다음으로, 예시 이벤트의 리스너를 살펴보겠습니다. 이벤트 리스너는 `handle` 메서드에서 이벤트 인스턴스를 받습니다. `make:listener` Artisan 명령어를 `--event` 옵션과 함께 실행하면, 적절한 이벤트 클래스를 자동으로 임포트하고 `handle` 메서드에 타입힌트를 추가해줍니다. `handle` 메서드 내에서 이벤트에 대응하는 필요한 작업을 수행할 수 있습니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;

class SendShipmentNotification
{
    /**
     * 이벤트 리스너를 생성합니다.
     */
    public function __construct() {}

    /**
     * 이벤트를 처리합니다.
     */
    public function handle(OrderShipped $event): void
    {
        // $event->order로 주문에 접근...
    }
}
```

> [!NOTE]
> 이벤트 리스너는 생성자에서 필요한 의존성을 타입힌트로 지정할 수도 있습니다. 모든 이벤트 리스너는 Laravel [서비스 컨테이너](/laravel/12.x/container)를 통해 해석되므로, 의존성이 자동으로 주입됩니다.


#### 이벤트 전파 중단하기 {#stopping-the-propagation-of-an-event}

때때로, 이벤트가 다른 리스너로 전파되는 것을 중단하고 싶을 수 있습니다. 이럴 때는 리스너의 `handle` 메서드에서 `false`를 반환하면 됩니다.


## 큐잉된 이벤트 리스너 {#queued-event-listeners}

리스너가 이메일 전송이나 HTTP 요청과 같이 느린 작업을 수행해야 한다면, 리스너를 큐잉하는 것이 유용할 수 있습니다. 큐잉된 리스너를 사용하기 전에 [큐를 설정](/laravel/12.x/queues)하고, 서버나 로컬 개발 환경에서 큐 워커를 시작해야 합니다.

리스너가 큐잉되어야 함을 지정하려면, 리스너 클래스에 `ShouldQueue` 인터페이스를 추가하세요. `make:listener` Artisan 명령어로 생성된 리스너는 이미 이 인터페이스가 현재 네임스페이스에 임포트되어 있으므로 바로 사용할 수 있습니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendShipmentNotification implements ShouldQueue
{
    // ...
}
```

이제 이 리스너가 처리하는 이벤트가 디스패치되면, 이벤트 디스패처가 Laravel의 [큐 시스템](/laravel/12.x/queues)을 사용해 자동으로 리스너를 큐잉합니다. 큐에서 리스너가 실행될 때 예외가 발생하지 않으면, 큐잉된 작업은 처리 후 자동으로 삭제됩니다.


#### 큐 연결, 이름, 지연 시간 커스터마이즈 {#customizing-the-queue-connection-queue-name}

이벤트 리스너의 큐 연결, 큐 이름, 큐 지연 시간을 커스터마이즈하려면, 리스너 클래스에 `$connection`, `$queue`, `$delay` 속성을 정의할 수 있습니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendShipmentNotification implements ShouldQueue
{
    /**
     * 작업이 전송될 연결 이름.
     *
     * @var string|null
     */
    public $connection = 'sqs';

    /**
     * 작업이 전송될 큐 이름.
     *
     * @var string|null
     */
    public $queue = 'listeners';

    /**
     * 작업이 처리되기 전까지의 시간(초).
     *
     * @var int
     */
    public $delay = 60;
}
```

런타임에 리스너의 큐 연결, 큐 이름, 지연 시간을 정의하고 싶다면, `viaConnection`, `viaQueue`, `withDelay` 메서드를 리스너에 정의할 수 있습니다:

```php
/**
 * 리스너의 큐 연결 이름을 반환합니다.
 */
public function viaConnection(): string
{
    return 'sqs';
}

/**
 * 리스너의 큐 이름을 반환합니다.
 */
public function viaQueue(): string
{
    return 'listeners';
}

/**
 * 작업이 처리되기 전까지의 초를 반환합니다.
 */
public function withDelay(OrderShipped $event): int
{
    return $event->highPriority ? 0 : 60;
}
```


#### 조건부로 리스너 큐잉하기 {#conditionally-queueing-listeners}

때로는 런타임에만 알 수 있는 데이터에 따라 리스너를 큐잉할지 결정해야 할 수 있습니다. 이를 위해, 리스너에 `shouldQueue` 메서드를 추가하여 리스너가 큐잉되어야 하는지 판단할 수 있습니다. `shouldQueue` 메서드가 `false`를 반환하면, 리스너는 큐잉되지 않습니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class RewardGiftCard implements ShouldQueue
{
    /**
     * 고객에게 기프트카드를 보상합니다.
     */
    public function handle(OrderCreated $event): void
    {
        // ...
    }

    /**
     * 리스너가 큐잉되어야 하는지 판단합니다.
     */
    public function shouldQueue(OrderCreated $event): bool
    {
        return $event->order->subtotal >= 5000;
    }
}
```


### 큐 수동 조작 {#manually-interacting-with-the-queue}

리스너의 기본 큐 작업인 `delete`와 `release` 메서드에 수동으로 접근해야 한다면, `Illuminate\Queue\InteractsWithQueue` 트레이트를 사용할 수 있습니다. 이 트레이트는 기본적으로 생성된 리스너에 임포트되어 있으며, 해당 메서드에 접근할 수 있게 해줍니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * 이벤트를 처리합니다.
     */
    public function handle(OrderShipped $event): void
    {
        if (true) {
            $this->release(30);
        }
    }
}
```


### 큐잉된 이벤트 리스너와 데이터베이스 트랜잭션 {#queued-event-listeners-and-database-transactions}

큐잉된 리스너가 데이터베이스 트랜잭션 내에서 디스패치될 때, 큐가 데이터베이스 트랜잭션이 커밋되기 전에 리스너를 처리할 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 가한 변경사항이 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 레코드가 데이터베이스에 존재하지 않을 수도 있습니다. 리스너가 이러한 모델에 의존한다면, 큐잉된 리스너가 처리될 때 예기치 않은 오류가 발생할 수 있습니다.

큐 연결의 `after_commit` 설정이 `false`로 되어 있다면, 특정 큐잉된 리스너만 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치되도록 하려면, 리스너 클래스에 `ShouldQueueAfterCommit` 인터페이스를 구현하면 됩니다:

```php
<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueueAfterCommit
{
    use InteractsWithQueue;
}
```

> [!NOTE]
> 이러한 문제를 우회하는 방법에 대해 더 알고 싶다면, [큐잉된 작업과 데이터베이스 트랜잭션](/laravel/12.x/queues#jobs-and-database-transactions) 문서를 참고하세요.


### 실패한 작업 처리 {#handling-failed-jobs}

큐잉된 이벤트 리스너가 실패할 때가 있습니다. 큐잉된 리스너가 큐 워커에서 정의한 최대 시도 횟수를 초과하면, 리스너의 `failed` 메서드가 호출됩니다. `failed` 메서드는 이벤트 인스턴스와 실패를 유발한 `Throwable`을 받습니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Throwable;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * 이벤트를 처리합니다.
     */
    public function handle(OrderShipped $event): void
    {
        // ...
    }

    /**
     * 작업 실패를 처리합니다.
     */
    public function failed(OrderShipped $event, Throwable $exception): void
    {
        // ...
    }
}
```


#### 큐잉된 리스너의 최대 시도 횟수 지정 {#specifying-queued-listener-maximum-attempts}

큐잉된 리스너 중 하나가 오류를 만나면, 무한정 재시도하는 것을 원하지 않을 수 있습니다. 따라서 Laravel은 리스너가 몇 번 또는 얼마 동안 시도될 수 있는지 지정하는 다양한 방법을 제공합니다.

리스너 클래스에 `$tries` 속성을 정의하여, 리스너가 실패로 간주되기 전까지 시도할 수 있는 횟수를 지정할 수 있습니다:

```php
<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * 큐잉된 리스너가 시도될 수 있는 횟수.
     *
     * @var int
     */
    public $tries = 5;
}
```

리스너가 실패하기 전까지 몇 번 시도할지 지정하는 대신, 더 이상 시도하지 않아야 할 시간을 지정할 수도 있습니다. 이를 통해 주어진 시간 내에 리스너가 여러 번 시도될 수 있습니다. 리스너가 더 이상 시도되지 않아야 할 시간을 지정하려면, 리스너 클래스에 `retryUntil` 메서드를 추가하세요. 이 메서드는 `DateTime` 인스턴스를 반환해야 합니다:

```php
use DateTime;

/**
 * 리스너가 타임아웃되어야 할 시간을 결정합니다.
 */
public function retryUntil(): DateTime
{
    return now()->addMinutes(5);
}
```

`retryUntil`과 `tries`가 모두 정의되어 있다면, Laravel은 `retryUntil` 메서드를 우선시합니다.


#### 큐잉된 리스너의 백오프 지정 {#specifying-queued-listener-backoff}

예외가 발생한 리스너를 재시도하기 전에 Laravel이 몇 초를 대기해야 할지 설정하려면, 리스너 클래스에 `backoff` 속성을 정의할 수 있습니다:

```php
/**
 * 큐잉된 리스너를 재시도하기 전 대기할 초 수.
 *
 * @var int
 */
public $backoff = 3;
```

리스너의 백오프 시간을 더 복잡하게 결정해야 한다면, 리스너 클래스에 `backoff` 메서드를 정의할 수 있습니다:

```php
/**
 * 큐잉된 리스너를 재시도하기 전 대기할 초 수를 계산합니다.
 */
public function backoff(): int
{
    return 3;
}
```

`backoff` 메서드에서 백오프 값을 배열로 반환하여 "지수적" 백오프를 쉽게 설정할 수 있습니다. 이 예시에서는 첫 번째 재시도는 1초, 두 번째는 5초, 세 번째는 10초, 이후 남은 시도는 모두 10초의 지연이 적용됩니다:

```php
/**
 * 큐잉된 리스너를 재시도하기 전 대기할 초 수를 계산합니다.
 *
 * @return list<int>
 */
public function backoff(): array
{
    return [1, 5, 10];
}
```


## 이벤트 디스패치 {#dispatching-events}

이벤트를 디스패치하려면, 이벤트의 정적 `dispatch` 메서드를 호출하면 됩니다. 이 메서드는 `Illuminate\Foundation\Events\Dispatchable` 트레이트에 의해 이벤트에 제공됩니다. `dispatch` 메서드에 전달된 모든 인자는 이벤트의 생성자로 전달됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Events\OrderShipped;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OrderShipmentController extends Controller
{
    /**
     * 주어진 주문을 배송합니다.
     */
    public function store(Request $request): RedirectResponse
    {
        $order = Order::findOrFail($request->order_id);

        // 주문 배송 로직...

        OrderShipped::dispatch($order);

        return redirect('/orders');
    }
}
```

조건부로 이벤트를 디스패치하고 싶다면, `dispatchIf` 및 `dispatchUnless` 메서드를 사용할 수 있습니다:

```php
OrderShipped::dispatchIf($condition, $order);

OrderShipped::dispatchUnless($condition, $order);
```

> [!NOTE]
> 테스트 시, 실제로 리스너를 트리거하지 않고 특정 이벤트가 디스패치되었는지 검증하는 것이 유용할 수 있습니다. Laravel의 [내장 테스트 헬퍼](#testing)를 사용하면 쉽게 할 수 있습니다.


### 데이터베이스 트랜잭션 후 이벤트 디스패치 {#dispatching-events-after-database-transactions}

때로는 활성 데이터베이스 트랜잭션이 커밋된 후에만 이벤트를 디스패치하도록 Laravel에 지시하고 싶을 수 있습니다. 이를 위해 이벤트 클래스에 `ShouldDispatchAfterCommit` 인터페이스를 구현하면 됩니다.

이 인터페이스는 현재 데이터베이스 트랜잭션이 커밋될 때까지 이벤트를 디스패치하지 않도록 Laravel에 지시합니다. 트랜잭션이 실패하면 이벤트는 폐기됩니다. 이벤트가 디스패치될 때 트랜잭션이 진행 중이 아니라면, 이벤트는 즉시 디스패치됩니다:

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldDispatchAfterCommit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * 새로운 이벤트 인스턴스를 생성합니다.
     */
    public function __construct(
        public Order $order,
    ) {}
}
```


## 이벤트 구독자 {#event-subscribers}


### 이벤트 구독자 작성 {#writing-event-subscribers}

이벤트 구독자는 구독자 클래스 내에서 여러 이벤트를 구독할 수 있는 클래스입니다. 이를 통해 하나의 클래스에서 여러 이벤트 핸들러를 정의할 수 있습니다. 구독자는 `subscribe` 메서드를 정의해야 하며, 이 메서드는 이벤트 디스패처 인스턴스를 받습니다. 주어진 디스패처의 `listen` 메서드를 호출하여 이벤트 리스너를 등록할 수 있습니다:

```php
<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

class UserEventSubscriber
{
    /**
     * 사용자 로그인 이벤트를 처리합니다.
     */
    public function handleUserLogin(Login $event): void {}

    /**
     * 사용자 로그아웃 이벤트를 처리합니다.
     */
    public function handleUserLogout(Logout $event): void {}

    /**
     * 구독자의 리스너를 등록합니다.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            Login::class,
            [UserEventSubscriber::class, 'handleUserLogin']
        );

        $events->listen(
            Logout::class,
            [UserEventSubscriber::class, 'handleUserLogout']
        );
    }
}
```

이벤트 리스너 메서드가 구독자 내에 정의되어 있다면, 구독자의 `subscribe` 메서드에서 이벤트와 메서드 이름의 배열을 반환하는 것이 더 편리할 수 있습니다. Laravel은 이벤트 리스너를 등록할 때 구독자의 클래스 이름을 자동으로 결정합니다:

```php
<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

class UserEventSubscriber
{
    /**
     * 사용자 로그인 이벤트를 처리합니다.
     */
    public function handleUserLogin(Login $event): void {}

    /**
     * 사용자 로그아웃 이벤트를 처리합니다.
     */
    public function handleUserLogout(Logout $event): void {}

    /**
     * 구독자의 리스너를 등록합니다.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleUserLogin',
            Logout::class => 'handleUserLogout',
        ];
    }
}
```


### 이벤트 구독자 등록 {#registering-event-subscribers}

구독자를 작성한 후, 구독자가 [이벤트 자동 탐색 규칙](#event-discovery)을 따르는 경우 Laravel이 구독자 내의 핸들러 메서드를 자동으로 등록합니다. 그렇지 않은 경우, `Event` 파사드의 `subscribe` 메서드를 사용해 구독자를 수동으로 등록할 수 있습니다. 일반적으로 이는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 수행해야 합니다:

```php
<?php

namespace App\Providers;

use App\Listeners\UserEventSubscriber;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Event::subscribe(UserEventSubscriber::class);
    }
}
```


## 테스트 {#testing}

이벤트를 디스패치하는 코드를 테스트할 때, 실제로 이벤트의 리스너를 실행하지 않도록 Laravel에 지시하고 싶을 수 있습니다. 리스너의 코드는 직접, 그리고 해당 이벤트를 디스패치하는 코드와 별도로 테스트할 수 있기 때문입니다. 물론, 리스너 자체를 테스트하려면 리스너 인스턴스를 생성하고 테스트에서 직접 `handle` 메서드를 호출하면 됩니다.

`Event` 파사드의 `fake` 메서드를 사용하면, 리스너 실행을 방지하고, 테스트할 코드를 실행한 뒤, `assertDispatched`, `assertNotDispatched`, `assertNothingDispatched` 메서드를 사용해 어떤 이벤트가 디스패치되었는지 검증할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Events\OrderFailedToShip;
use App\Events\OrderShipped;
use Illuminate\Support\Facades\Event;

test('orders can be shipped', function () {
    Event::fake();

    // 주문 배송 수행...

    // 이벤트가 디스패치되었는지 검증...
    Event::assertDispatched(OrderShipped::class);

    // 이벤트가 두 번 디스패치되었는지 검증...
    Event::assertDispatched(OrderShipped::class, 2);

    // 이벤트가 디스패치되지 않았는지 검증...
    Event::assertNotDispatched(OrderFailedToShip::class);

    // 아무 이벤트도 디스패치되지 않았는지 검증...
    Event::assertNothingDispatched();
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Events\OrderFailedToShip;
use App\Events\OrderShipped;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 주문 배송 테스트.
     */
    public function test_orders_can_be_shipped(): void
    {
        Event::fake();

        // 주문 배송 수행...

        // 이벤트가 디스패치되었는지 검증...
        Event::assertDispatched(OrderShipped::class);

        // 이벤트가 두 번 디스패치되었는지 검증...
        Event::assertDispatched(OrderShipped::class, 2);

        // 이벤트가 디스패치되지 않았는지 검증...
        Event::assertNotDispatched(OrderFailedToShip::class);

        // 아무 이벤트도 디스패치되지 않았는지 검증...
        Event::assertNothingDispatched();
    }
}
```
:::
`assertDispatched` 또는 `assertNotDispatched` 메서드에 클로저를 전달하여, 주어진 "진리 테스트"를 통과하는 이벤트가 디스패치되었는지 검증할 수 있습니다. 해당 테스트를 통과하는 이벤트가 하나라도 디스패치되었다면, 검증은 성공합니다:

```php
Event::assertDispatched(function (OrderShipped $event) use ($order) {
    return $event->order->id === $order->id;
});
```

특정 이벤트에 리스너가 등록되어 있는지만 검증하고 싶다면, `assertListening` 메서드를 사용할 수 있습니다:

```php
Event::assertListening(
    OrderShipped::class,
    SendShipmentNotification::class
);
```

> [!WARNING]
> `Event::fake()`를 호출한 후에는 어떤 이벤트 리스너도 실행되지 않습니다. 따라서, 모델의 `creating` 이벤트에서 UUID를 생성하는 등 이벤트에 의존하는 모델 팩토리를 사용하는 테스트라면, 팩토리 사용 **이후에** `Event::fake()`를 호출해야 합니다.


### 일부 이벤트만 페이크하기 {#faking-a-subset-of-events}

특정 이벤트 집합에 대해서만 이벤트 리스너를 페이크하고 싶다면, `fake` 또는 `fakeFor` 메서드에 해당 이벤트들을 전달할 수 있습니다:
::: code-group
```php [Pest]
test('orders can be processed', function () {
    Event::fake([
        OrderCreated::class,
    ]);

    $order = Order::factory()->create();

    Event::assertDispatched(OrderCreated::class);

    // 다른 이벤트는 평소처럼 디스패치됨...
    $order->update([
        // ...
    ]);
});
```

```php [PHPUnit]
/**
 * 주문 처리 테스트.
 */
public function test_orders_can_be_processed(): void
{
    Event::fake([
        OrderCreated::class,
    ]);

    $order = Order::factory()->create();

    Event::assertDispatched(OrderCreated::class);

    // 다른 이벤트는 평소처럼 디스패치됨...
    $order->update([
        // ...
    ]);
}
```
:::
특정 이벤트를 제외한 모든 이벤트를 페이크하고 싶다면, `except` 메서드를 사용할 수 있습니다:

```php
Event::fake()->except([
    OrderCreated::class,
]);
```


### 스코프 이벤트 페이크 {#scoped-event-fakes}

테스트의 일부 구간에서만 이벤트 리스너를 페이크하고 싶다면, `fakeFor` 메서드를 사용할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Events\OrderCreated;
use App\Models\Order;
use Illuminate\Support\Facades\Event;

test('orders can be processed', function () {
    $order = Event::fakeFor(function () {
        $order = Order::factory()->create();

        Event::assertDispatched(OrderCreated::class);

        return $order;
    });

    // 이벤트는 평소처럼 디스패치되고 옵저버도 실행됨...
    $order->update([
        // ...
    ]);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Events\OrderCreated;
use App\Models\Order;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 주문 처리 테스트.
     */
    public function test_orders_can_be_processed(): void
    {
        $order = Event::fakeFor(function () {
            $order = Order::factory()->create();

            Event::assertDispatched(OrderCreated::class);

            return $order;
        });

        // 이벤트는 평소처럼 디스패치되고 옵저버도 실행됨...
        $order->update([
            // ...
        ]);
    }
}
```
:::