# 알림(Notifications)





















































## 소개 {#introduction}

[이메일 전송](/laravel/12.x/mail) 지원 외에도, Laravel은 이메일, SMS([Vonage](https://www.vonage.com/communications-apis/), 이전 명칭 Nexmo), [Slack](https://slack.com) 등 다양한 전송 채널을 통한 알림(Notification) 기능을 제공합니다. 또한, [커뮤니티에서 제작한 다양한 알림 채널](https://laravel-notification-channels.com/about/#suggesting-a-new-channel)도 있어 수십 가지의 채널을 통해 알림을 전송할 수 있습니다! 알림은 데이터베이스에 저장하여 웹 인터페이스에서 표시할 수도 있습니다.

일반적으로 알림은 애플리케이션에서 발생한 이벤트를 사용자에게 알려주는 짧고 정보성 메시지여야 합니다. 예를 들어, 결제 애플리케이션을 작성하는 경우, 사용자가 송장 결제를 완료했을 때 이메일과 SMS 채널을 통해 "송장 결제 완료" 알림을 보낼 수 있습니다.


## 알림 생성하기 {#generating-notifications}

Laravel에서 각 알림은 하나의 클래스로 표현되며, 일반적으로 `app/Notifications` 디렉터리에 저장됩니다. 만약 이 디렉터리가 애플리케이션에 없다면 걱정하지 마세요. `make:notification` Artisan 명령어를 실행하면 자동으로 생성됩니다.

```shell
php artisan make:notification InvoicePaid
```

이 명령어를 실행하면 새로운 알림 클래스가 `app/Notifications` 디렉터리에 생성됩니다. 각 알림 클래스에는 `via` 메서드와, 해당 채널에 맞는 메시지로 알림을 변환하는 `toMail`, `toDatabase`와 같은 여러 메시지 빌더 메서드가 포함되어 있습니다.


## 알림 보내기 {#sending-notifications}


### Notifiable 트레잇 사용하기 {#using-the-notifiable-trait}

알림은 `Notifiable` 트레잇의 `notify` 메서드나 `Notification` [파사드](/laravel/12.x/facades)를 사용하여 두 가지 방법으로 보낼 수 있습니다. `Notifiable` 트레잇은 기본적으로 애플리케이션의 `App\Models\User` 모델에 포함되어 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;
}
```

이 트레잇에서 제공하는 `notify` 메서드는 알림 인스턴스를 인자로 받습니다:

```php
use App\Notifications\InvoicePaid;

$user->notify(new InvoicePaid($invoice));
```

> [!NOTE]
> `Notifiable` 트레잇은 어떤 모델에도 사용할 수 있습니다. 반드시 `User` 모델에만 포함해야 하는 것은 아닙니다.


### Notification 파사드 사용하기 {#using-the-notification-facade}

또한, `Notification` [파사드](/laravel/12.x/facades)를 통해 알림을 보낼 수도 있습니다. 이 방법은 여러 명의 알림 수신자(예: 사용자 컬렉션)에게 알림을 보내야 할 때 유용합니다. 파사드를 사용해 알림을 보내려면, 모든 알림 수신자와 알림 인스턴스를 `send` 메서드에 전달하면 됩니다:

```php
use Illuminate\Support\Facades\Notification;

Notification::send($users, new InvoicePaid($invoice));
```

또한, `sendNow` 메서드를 사용하여 즉시 알림을 보낼 수도 있습니다. 이 메서드는 알림이 `ShouldQueue` 인터페이스를 구현하더라도 즉시 알림을 전송합니다:

```php
Notification::sendNow($developers, new DeploymentCompleted($deployment));
```


### 전달 채널 지정하기 {#specifying-delivery-channels}

모든 알림 클래스에는 해당 알림이 어떤 채널로 전달될지 결정하는 `via` 메서드가 있습니다. 알림은 `mail`, `database`, `broadcast`, `vonage`, `slack` 채널로 보낼 수 있습니다.

> [!NOTE]
> Telegram이나 Pusher와 같은 다른 전달 채널을 사용하고 싶다면, 커뮤니티에서 운영하는 [Laravel Notification Channels 웹사이트](http://laravel-notification-channels.com)를 참고하세요.

`via` 메서드는 `$notifiable` 인스턴스를 전달받으며, 이 인스턴스는 알림이 전송될 대상 클래스의 인스턴스입니다. `$notifiable`을 활용해 알림이 어떤 채널로 전달될지 결정할 수 있습니다:

```php
/**
 * 알림의 전달 채널을 반환합니다.
 *
 * @return array<int, string>
 */
public function via(object $notifiable): array
{
    return $notifiable->prefers_sms ? ['vonage'] : ['mail', 'database'];
}
```


### 알림 큐잉 {#queueing-notifications}

> [!WARNING]
> 알림을 큐에 넣기 전에 큐를 설정하고 [워커를 시작](/laravel/12.x/queues#running-the-queue-worker)해야 합니다.

알림을 전송하는 데는 시간이 걸릴 수 있습니다. 특히 채널이 알림을 전달하기 위해 외부 API 호출이 필요한 경우에는 더욱 그렇습니다. 애플리케이션의 응답 속도를 높이기 위해, 알림 클래스에 `ShouldQueue` 인터페이스와 `Queueable` 트레이트를 추가하여 알림을 큐에 넣을 수 있습니다. 이 인터페이스와 트레이트는 `make:notification` 명령어로 생성된 모든 알림에 이미 임포트되어 있으므로, 바로 알림 클래스에 추가할 수 있습니다:

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    // ...
}
```

`ShouldQueue` 인터페이스가 알림에 추가되면, 평소처럼 알림을 전송할 수 있습니다. Laravel은 클래스에서 `ShouldQueue` 인터페이스를 감지하여 자동으로 알림 전송을 큐에 넣습니다:

```php
$user->notify(new InvoicePaid($invoice));
```

알림을 큐에 넣을 때, 각 수신자와 채널 조합마다 큐에 하나의 작업이 생성됩니다. 예를 들어, 알림에 세 명의 수신자와 두 개의 채널이 있다면, 큐에는 총 여섯 개의 작업이 디스패치됩니다.


#### 알림 지연시키기 {#delaying-notifications}

알림 전송을 지연시키고 싶다면, 알림 인스턴스 생성 시 `delay` 메서드를 체이닝하여 사용할 수 있습니다:

```php
$delay = now()->addMinutes(10);

$user->notify((new InvoicePaid($invoice))->delay($delay));
```

특정 채널별로 지연 시간을 지정하고 싶다면, `delay` 메서드에 배열을 전달할 수 있습니다:

```php
$user->notify((new InvoicePaid($invoice))->delay([
    'mail' => now()->addMinutes(5),
    'sms' => now()->addMinutes(10),
]));
```

또는, 알림 클래스 자체에 `withDelay` 메서드를 정의할 수도 있습니다. `withDelay` 메서드는 채널명과 지연 값을 담은 배열을 반환해야 합니다:

```php
/**
 * 알림의 전송 지연 시간을 결정합니다.
 *
 * @return array<string, \Illuminate\Support\Carbon>
 */
public function withDelay(object $notifiable): array
{
    return [
        'mail' => now()->addMinutes(5),
        'sms' => now()->addMinutes(10),
    ];
}
```


#### 알림 큐 연결 커스터마이징 {#customizing-the-notification-queue-connection}

기본적으로 큐에 저장되는 알림은 애플리케이션의 기본 큐 연결을 사용합니다. 특정 알림에 대해 다른 연결을 사용하고 싶다면, 알림의 생성자에서 `onConnection` 메서드를 호출하면 됩니다:

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 알림 인스턴스 생성
     */
    public function __construct()
    {
        $this->onConnection('redis');
    }
}
```

또는, 알림이 지원하는 각 알림 채널별로 사용할 큐 연결을 지정하고 싶다면, 알림 클래스에 `viaConnections` 메서드를 정의할 수 있습니다. 이 메서드는 채널 이름과 큐 연결 이름의 쌍으로 이루어진 배열을 반환해야 합니다:

```php
/**
 * 각 알림 채널에 사용할 연결을 결정합니다.
 *
 * @return array<string, string>
 */
public function viaConnections(): array
{
    return [
        'mail' => 'redis',
        'database' => 'sync',
    ];
}
```


#### 알림 채널 큐 커스터마이징 {#customizing-notification-channel-queues}

각 알림 채널별로 사용될 큐를 지정하고 싶다면, 알림 클래스에 `viaQueues` 메서드를 정의할 수 있습니다. 이 메서드는 채널 이름과 큐 이름의 쌍으로 이루어진 배열을 반환해야 합니다:

```php
/**
 * 각 알림 채널에 사용할 큐를 결정합니다.
 *
 * @return array<string, string>
 */
public function viaQueues(): array
{
    return [
        'mail' => 'mail-queue',
        'slack' => 'slack-queue',
    ];
}
```


#### 큐잉된 알림 미들웨어 {#queued-notification-middleware}

큐잉된 알림은 [큐잉된 작업](/laravel/12.x/queues#job-middleware)과 마찬가지로 미들웨어를 정의할 수 있습니다. 시작하려면, 알림 클래스에 `middleware` 메서드를 정의하세요. `middleware` 메서드는 `$notifiable`과 `$channel` 변수를 전달받으며, 이를 통해 알림의 전송 대상에 따라 반환할 미들웨어를 커스터마이즈할 수 있습니다:

```php
use Illuminate\Queue\Middleware\RateLimited;

/**
 * 알림 작업이 통과해야 할 미들웨어를 반환합니다.
 *
 * @return array<int, object>
 */
public function middleware(object $notifiable, string $channel)
{
    return match ($channel) {
        'mail' => [new RateLimited('postmark')],
        'slack' => [new RateLimited('slack')],
        default => [],
    };
}
```


#### 큐잉된 알림과 데이터베이스 트랜잭션 {#queued-notifications-and-database-transactions}

데이터베이스 트랜잭션 내에서 큐잉된 알림이 디스패치될 때, 큐가 데이터베이스 트랜잭션이 커밋되기 전에 알림을 처리할 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 대해 수행한 업데이트가 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 데이터베이스 레코드가 아직 데이터베이스에 존재하지 않을 수도 있습니다. 만약 알림이 이러한 모델에 의존한다면, 큐잉된 알림을 전송하는 작업이 처리될 때 예기치 않은 오류가 발생할 수 있습니다.

큐 연결의 `after_commit` 설정 옵션이 `false`로 되어 있더라도, 알림을 전송할 때 `afterCommit` 메서드를 호출하여 해당 큐잉된 알림이 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치되도록 지정할 수 있습니다:

```php
use App\Notifications\InvoicePaid;

$user->notify((new InvoicePaid($invoice))->afterCommit());
```

또는, 알림 클래스의 생성자에서 `afterCommit` 메서드를 호출할 수도 있습니다:

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 알림 인스턴스 생성
     */
    public function __construct()
    {
        $this->afterCommit();
    }
}
```

> [!NOTE]
> 이러한 문제를 우회하는 방법에 대해 더 알아보려면 [큐잉된 작업과 데이터베이스 트랜잭션](/laravel/12.x/queues#jobs-and-database-transactions) 문서를 참고하세요.


#### 큐에 등록된 알림이 전송되어야 하는지 결정하기 {#determining-if-the-queued-notification-should-be-sent}

큐에 등록된 알림이 백그라운드 처리를 위해 큐에 디스패치된 후, 일반적으로 큐 워커에 의해 받아들여져 해당 수신자에게 전송됩니다.

하지만, 큐 워커가 알림을 처리한 이후에 최종적으로 이 알림을 전송할지 여부를 결정하고 싶다면, 알림 클래스에 `shouldSend` 메서드를 정의할 수 있습니다. 이 메서드가 `false`를 반환하면, 해당 알림은 전송되지 않습니다:

```php
/**
 * 알림을 전송할지 여부를 결정합니다.
 */
public function shouldSend(object $notifiable, string $channel): bool
{
    return $this->invoice->isPaid();
}
```


### 온디맨드 알림 {#on-demand-notifications}

때때로 애플리케이션의 "사용자"로 저장되어 있지 않은 사람에게 알림을 보내야 할 수도 있습니다. `Notification` 파사드의 `route` 메서드를 사용하면 알림을 보내기 전에 임시로 라우팅 정보를 지정할 수 있습니다.

```php
use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\Notification;

Notification::route('mail', 'taylor@example.com')
    ->route('vonage', '5555555555')
    ->route('slack', '#slack-channel')
    ->route('broadcast', [new Channel('channel-name')])
    ->notify(new InvoicePaid($invoice));
```

`mail` 라우트로 온디맨드 알림을 보낼 때 수신자의 이름도 함께 제공하고 싶다면, 배열의 첫 번째 요소에 이메일 주소를 키로, 이름을 값으로 하는 배열을 전달할 수 있습니다.

```php
Notification::route('mail', [
    'barrett@example.com' => 'Barrett Blair',
])->notify(new InvoicePaid($invoice));
```

`routes` 메서드를 사용하면 여러 알림 채널에 대한 임시 라우팅 정보를 한 번에 지정할 수 있습니다.

```php
Notification::routes([
    'mail' => ['barrett@example.com' => 'Barrett Blair'],
    'vonage' => '5555555555',
])->notify(new InvoicePaid($invoice));
```


## 메일 알림 {#mail-notifications}


### 메일 메시지 포맷팅 {#formatting-mail-messages}

알림이 이메일로 전송되는 것을 지원한다면, 알림 클래스에 `toMail` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 받아서 `Illuminate\Notifications\Messages\MailMessage` 인스턴스를 반환해야 합니다.

`MailMessage` 클래스는 트랜잭션 이메일 메시지를 쉽게 작성할 수 있도록 몇 가지 간단한 메서드를 제공합니다. 메일 메시지에는 텍스트 줄과 "콜 투 액션(버튼)"을 포함할 수 있습니다. 아래는 `toMail` 메서드의 예시입니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    $url = url('/invoice/'.$this->invoice->id);

    return (new MailMessage)
        ->greeting('안녕하세요!')
        ->line('고객님의 인보이스 중 하나가 결제되었습니다!')
        ->lineIf($this->amount > 0, "결제 금액: {$this->amount}")
        ->action('인보이스 보기', $url)
        ->line('저희 서비스를 이용해주셔서 감사합니다!');
}
```

> [!NOTE]
> 위 예시의 `toMail` 메서드에서 `$this->invoice->id`를 사용하고 있습니다. 알림 메시지 생성을 위해 필요한 모든 데이터는 알림의 생성자에 전달할 수 있습니다.

이 예시에서는 인사말, 텍스트 한 줄, 콜 투 액션, 그리고 또 다른 텍스트 한 줄을 등록하고 있습니다. `MailMessage` 객체가 제공하는 이 메서드들을 사용하면 간단하고 빠르게 소규모 트랜잭션 이메일을 포맷할 수 있습니다. 메일 채널은 메시지 구성 요소를 아름답고 반응형인 HTML 이메일 템플릿(텍스트 버전 포함)으로 변환해줍니다. 아래는 `mail` 채널로 생성된 이메일 예시입니다:

<img src="https://laravel.com/img/docs/notification-example-2.png">

> [!NOTE]
> 메일 알림을 보낼 때는 반드시 `config/app.php` 설정 파일의 `name` 옵션을 설정하세요. 이 값은 메일 알림 메시지의 헤더와 푸터에 사용됩니다.


#### 에러 메시지 {#error-messages}

일부 알림은 인보이스 결제 실패와 같이 사용자에게 오류를 알립니다. 메시지를 작성할 때 `error` 메서드를 호출하여 메일 메시지가 오류와 관련되어 있음을 표시할 수 있습니다. 메일 메시지에서 `error` 메서드를 사용하면, 호출 버튼(call to action)이 검정색 대신 빨간색으로 표시됩니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->error()
        ->subject('인보이스 결제 실패')
        ->line('...');
}
```


#### 기타 메일 알림 포맷 옵션 {#other-mail-notification-formatting-options}

알림 클래스에서 텍스트의 "라인"을 정의하는 대신, `view` 메서드를 사용하여 알림 이메일을 렌더링할 때 사용할 커스텀 템플릿을 지정할 수 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)->view(
        'mail.invoice.paid', ['invoice' => $this->invoice]
    );
}
```

메일 메시지에 대해 plain-text 뷰를 지정하려면, `view` 메서드에 배열의 두 번째 요소로 뷰 이름을 전달하면 됩니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)->view(
        ['mail.invoice.paid', 'mail.invoice.paid-text'],
        ['invoice' => $this->invoice]
    );
}
```

또는, 메시지가 plain-text 뷰만 가지고 있다면 `text` 메서드를 사용할 수 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)->text(
        'mail.invoice.paid-text', ['invoice' => $this->invoice]
    );
}
```


### 발신자 사용자 지정 {#customizing-the-sender}

기본적으로 이메일의 발신자 / from 주소는 `config/mail.php` 설정 파일에서 정의됩니다. 그러나 특정 알림에 대해 `from` 메서드를 사용하여 발신자 주소를 지정할 수 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->from('barrett@example.com', 'Barrett Blair')
        ->line('...');
}
```


### 수신자 커스터마이징 {#customizing-the-recipient}

`mail` 채널을 통해 알림을 보낼 때, 알림 시스템은 자동으로 notifiable 엔터티에서 `email` 속성을 찾습니다. 알림을 전달할 이메일 주소를 커스터마이징하려면, notifiable 엔터티에 `routeNotificationForMail` 메서드를 정의하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * 메일 채널을 위한 알림 라우팅.
     *
     * @return  array<string, string>|string
     */
    public function routeNotificationForMail(Notification $notification): array|string
    {
        // 이메일 주소만 반환...
        return $this->email_address;

        // 이메일 주소와 이름을 함께 반환...
        return [$this->email_address => $this->name];
    }
}
```


### 제목 커스터마이징 {#customizing-the-subject}

기본적으로 이메일의 제목은 알림 클래스의 이름이 "Title Case"로 변환되어 사용됩니다. 예를 들어, 알림 클래스의 이름이 `InvoicePaid`라면 이메일 제목은 `Invoice Paid`가 됩니다. 만약 메시지에 다른 제목을 지정하고 싶다면, 메시지를 생성할 때 `subject` 메서드를 호출하면 됩니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Notification Subject')
        ->line('...');
}
```


### 메일러 커스터마이징 {#customizing-the-mailer}

기본적으로 이메일 알림은 `config/mail.php` 설정 파일에 정의된 기본 메일러를 사용하여 전송됩니다. 하지만 메시지를 생성할 때 `mailer` 메서드를 호출하여 런타임에 다른 메일러를 지정할 수 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->mailer('postmark')
        ->line('...');
}
```


### 템플릿 커스터마이징 {#customizing-the-templates}

메일 알림에 사용되는 HTML 및 일반 텍스트 템플릿은 알림 패키지의 리소스를 퍼블리시하여 수정할 수 있습니다. 아래 명령어를 실행하면 메일 알림 템플릿이 `resources/views/vendor/notifications` 디렉터리에 생성됩니다:

```shell
php artisan vendor:publish --tag=laravel-notifications
```


### 첨부 파일 {#mail-attachments}

이메일 알림에 첨부 파일을 추가하려면 메시지를 생성할 때 `attach` 메서드를 사용하세요. `attach` 메서드는 첫 번째 인자로 파일의 절대 경로를 받습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('Hello!')
        ->attach('/path/to/file');
}
```

> [!NOTE]
> 알림 메일 메시지에서 제공하는 `attach` 메서드는 [첨부 객체](/laravel/12.x/mail#attachable-objects)도 받을 수 있습니다. 자세한 내용은 [첨부 객체 문서](/laravel/12.x/mail#attachable-objects)를 참고하세요.

파일을 메시지에 첨부할 때, 두 번째 인자로 `array`를 전달하여 표시 이름이나 MIME 타입을 지정할 수도 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('Hello!')
        ->attach('/path/to/file', [
            'as' => 'name.pdf',
            'mime' => 'application/pdf',
        ]);
}
```

mailable 객체에서 파일을 첨부하는 것과 달리, `attachFromStorage`를 사용하여 저장소 디스크에서 직접 파일을 첨부할 수 없습니다. 대신, 저장소 디스크에 있는 파일의 절대 경로를 사용하여 `attach` 메서드를 사용해야 합니다. 또는, `toMail` 메서드에서 [mailable](/laravel/12.x/mail#generating-mailables)를 반환할 수도 있습니다:

```php
use App\Mail\InvoicePaid as InvoicePaidMailable;

/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): Mailable
{
    return (new InvoicePaidMailable($this->invoice))
        ->to($notifiable->email)
        ->attachFromStorage('/path/to/file');
}
```

필요하다면, `attachMany` 메서드를 사용하여 여러 파일을 한 번에 첨부할 수도 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('Hello!')
        ->attachMany([
            '/path/to/forge.svg',
            '/path/to/vapor.svg' => [
                'as' => 'Logo.svg',
                'mime' => 'image/svg+xml',
            ],
        ]);
}
```


#### 원시 데이터 첨부 {#raw-data-attachments}

`attachData` 메서드는 바이트의 원시 문자열을 첨부 파일로 첨부할 때 사용할 수 있습니다. `attachData` 메서드를 호출할 때는 첨부 파일에 할당할 파일 이름을 지정해야 합니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('안녕하세요!')
        ->attachData($this->pdf, 'name.pdf', [
            'mime' => 'application/pdf',
        ]);
}
```


### 태그 및 메타데이터 추가하기 {#adding-tags-metadata}

Mailgun, Postmark와 같은 일부 서드파티 이메일 제공업체는 메시지 "태그"와 "메타데이터"를 지원합니다. 이를 통해 애플리케이션에서 발송한 이메일을 그룹화하거나 추적할 수 있습니다. 이메일 메시지에 태그와 메타데이터를 추가하려면 `tag` 및 `metadata` 메서드를 사용할 수 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('댓글이 추천되었습니다!')
        ->tag('upvote')
        ->metadata('comment_id', $this->comment->id);
}
```

애플리케이션에서 Mailgun 드라이버를 사용 중이라면, [태그](https://documentation.mailgun.com/en/latest/user_manual.html#tagging-1)와 [메타데이터](https://documentation.mailgun.com/en/latest/user_manual.html#attaching-data-to-messages)에 대한 자세한 내용은 Mailgun 공식 문서를 참고하세요. 마찬가지로, Postmark의 [태그](https://postmarkapp.com/blog/tags-support-for-smtp) 및 [메타데이터](https://postmarkapp.com/support/article/1125-custom-metadata-faq) 지원에 대한 자세한 내용도 공식 문서를 참고할 수 있습니다.

만약 Amazon SES를 사용하여 이메일을 발송한다면, 메시지에 [SES "태그"](https://docs.aws.amazon.com/ses/latest/APIReference/API_MessageTag.html)를 첨부하기 위해 `metadata` 메서드를 사용해야 합니다.


### Symfony 메시지 커스터마이징 {#customizing-the-symfony-message}

`MailMessage` 클래스의 `withSymfonyMessage` 메서드를 사용하면, 메시지가 전송되기 전에 Symfony Message 인스턴스와 함께 호출되는 클로저를 등록할 수 있습니다. 이를 통해 메시지가 실제로 전달되기 전에 더욱 깊이 있게 커스터마이징할 수 있습니다.

```php
use Symfony\Component\Mime\Email;

/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->withSymfonyMessage(function (Email $message) {
            $message->getHeaders()->addTextHeader(
                'Custom-Header', 'Header Value'
            );
        });
}
```


### 메일러블(Mailable) 사용하기 {#using-mailables}

필요하다면, 알림의 `toMail` 메서드에서 전체 [메일러블 객체](/laravel/12.x/mail)를 반환할 수 있습니다. `MailMessage` 대신 `Mailable`을 반환할 경우, 메일러블 객체의 `to` 메서드를 사용하여 수신자를 직접 지정해야 합니다:

```php
use App\Mail\InvoicePaid as InvoicePaidMailable;
use Illuminate\Mail\Mailable;

/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): Mailable
{
    return (new InvoicePaidMailable($this->invoice))
        ->to($notifiable->email);
}
```


#### 메일러블과 온디맨드 알림 {#mailables-and-on-demand-notifications}

[온디맨드 알림](#on-demand-notifications)을 전송하는 경우, `toMail` 메서드에 전달되는 `$notifiable` 인스턴스는 `Illuminate\Notifications\AnonymousNotifiable`의 인스턴스가 됩니다. 이 클래스는 온디맨드 알림을 보낼 이메일 주소를 가져올 수 있는 `routeNotificationFor` 메서드를 제공합니다:

```php
use App\Mail\InvoicePaid as InvoicePaidMailable;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Mail\Mailable;

/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): Mailable
{
    $address = $notifiable instanceof AnonymousNotifiable
        ? $notifiable->routeNotificationFor('mail')
        : $notifiable->email;

    return (new InvoicePaidMailable($this->invoice))
        ->to($address);
}
```


### 메일 알림 미리보기 {#previewing-mail-notifications}

메일 알림 템플릿을 디자인할 때, 일반적인 Blade 템플릿처럼 렌더링된 메일 메시지를 브라우저에서 빠르게 미리보는 것이 편리합니다. 이를 위해 Laravel은 라우트 클로저나 컨트롤러에서 생성된 메일 알림 메시지를 직접 반환할 수 있도록 지원합니다. `MailMessage`가 반환되면, 실제 이메일 주소로 전송하지 않고도 브라우저에서 렌더링되어 디자인을 빠르게 미리볼 수 있습니다.

```php
use App\Models\Invoice;
use App\Notifications\InvoicePaid;

Route::get('/notification', function () {
    $invoice = Invoice::find(1);

    return (new InvoicePaid($invoice))
        ->toMail($invoice->user);
});
```


## 마크다운 메일 알림 {#markdown-mail-notifications}

마크다운 메일 알림을 사용하면 미리 만들어진 메일 알림 템플릿을 활용하면서도, 더 길고 맞춤화된 메시지를 자유롭게 작성할 수 있습니다. 메시지가 마크다운으로 작성되기 때문에, Laravel은 메시지에 대해 아름답고 반응형인 HTML 템플릿을 렌더링할 수 있으며, 동시에 자동으로 일반 텍스트 버전도 생성합니다.


### 메시지 생성하기 {#generating-the-message}

해당하는 Markdown 템플릿과 함께 알림을 생성하려면, `make:notification` Artisan 명령어의 `--markdown` 옵션을 사용할 수 있습니다:

```shell
php artisan make:notification InvoicePaid --markdown=mail.invoice.paid
```

다른 모든 메일 알림과 마찬가지로, Markdown 템플릿을 사용하는 알림은 알림 클래스에 `toMail` 메서드를 정의해야 합니다. 하지만, 알림을 구성할 때 `line`과 `action` 메서드 대신, `markdown` 메서드를 사용하여 사용할 Markdown 템플릿의 이름을 지정합니다. 템플릿에서 사용할 데이터를 배열 형태로 두 번째 인자로 전달할 수 있습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    $url = url('/invoice/'.$this->invoice->id);

    return (new MailMessage)
        ->subject('Invoice Paid')
        ->markdown('mail.invoice.paid', ['url' => $url]);
}
```


### 메시지 작성하기 {#writing-the-message}

Markdown 메일 알림은 Blade 컴포넌트와 Markdown 문법을 조합하여 사용합니다. 이를 통해 Laravel에서 미리 만들어진 알림 컴포넌트를 활용하면서 손쉽게 알림 메시지를 작성할 수 있습니다:

```blade
<x-mail::message>
# 인보이스 결제 완료

고객님의 인보이스가 결제되었습니다!

<x-mail::button :url="$url">
인보이스 보기
</x-mail::button>

감사합니다.<br>
{{ config('app.name') }}
</x-mail::message>
```

> [!NOTE]
> 마크다운 이메일을 작성할 때 불필요한 들여쓰기를 사용하지 마세요. 마크다운 표준에 따라, 마크다운 파서는 들여쓰기된 내용을 코드 블록으로 렌더링합니다.


#### 버튼 컴포넌트 {#button-component}

버튼 컴포넌트는 중앙에 정렬된 버튼 링크를 렌더링합니다. 이 컴포넌트는 두 개의 인자를 받으며, `url`과 선택적으로 `color`를 지정할 수 있습니다. 지원되는 색상은 `primary`, `green`, `red`입니다. 알림에 원하는 만큼 버튼 컴포넌트를 추가할 수 있습니다:

```blade
<x-mail::button :url="$url" color="green">
인보이스 보기
</x-mail::button>
```


#### 패널 컴포넌트 {#panel-component}

패널 컴포넌트는 지정된 텍스트 블록을 알림의 나머지 부분과 약간 다른 배경색을 가진 패널에 렌더링합니다. 이를 통해 특정 텍스트 블록에 주목할 수 있습니다:

```blade
<x-mail::panel>
이곳이 패널의 내용입니다.
</x-mail::panel>
```


#### 테이블 컴포넌트 {#table-component}

테이블 컴포넌트는 마크다운 테이블을 HTML 테이블로 변환할 수 있도록 해줍니다. 이 컴포넌트는 마크다운 테이블을 콘텐츠로 받아들입니다. 테이블 열 정렬은 기본 마크다운 테이블 정렬 문법을 사용하여 지원됩니다:

```blade
<x-mail::table>
| Laravel       | Table         | Example       |
| ------------- | :-----------: | ------------: |
| Col 2 is      | Centered      | $10           |
| Col 3 is      | Right-Aligned | $20           |
</x-mail::table>
```


### 컴포넌트 커스터마이징 {#customizing-the-components}

모든 Markdown 알림 컴포넌트를 직접 애플리케이션으로 내보내어 커스터마이즈할 수 있습니다. 컴포넌트를 내보내려면, `vendor:publish` Artisan 명령어를 사용하여 `laravel-mail` 에셋 태그를 퍼블리시하세요:

```shell
php artisan vendor:publish --tag=laravel-mail
```

이 명령어를 실행하면 Markdown 메일 컴포넌트가 `resources/views/vendor/mail` 디렉터리에 퍼블리시됩니다. `mail` 디렉터리에는 각각의 컴포넌트에 대한 `html`과 `text` 디렉터리가 포함되어 있습니다. 각 디렉터리에는 해당 컴포넌트의 HTML 및 텍스트 버전이 들어 있습니다. 이 컴포넌트들은 자유롭게 원하는 대로 커스터마이즈할 수 있습니다.


#### CSS 커스터마이징 {#customizing-the-css}

컴포넌트를 내보낸 후에는 `resources/views/vendor/mail/html/themes` 디렉터리에 `default.css` 파일이 생성됩니다. 이 파일의 CSS를 자유롭게 수정할 수 있으며, 수정한 스타일은 Markdown 알림의 HTML 표현에 자동으로 인라인 처리됩니다.

Laravel의 Markdown 컴포넌트에 대해 완전히 새로운 테마를 만들고 싶다면, `html/themes` 디렉터리에 CSS 파일을 추가하면 됩니다. CSS 파일을 원하는 이름으로 저장한 후, `mail` 설정 파일의 `theme` 옵션을 새 테마 이름으로 변경해주면 됩니다.

개별 알림에 대해 테마를 커스터마이징하고 싶다면, 알림의 메일 메시지를 생성할 때 `theme` 메서드를 호출하면 됩니다. `theme` 메서드는 알림을 보낼 때 사용할 테마의 이름을 인자로 받습니다:

```php
/**
 * 알림의 메일 표현을 반환합니다.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->theme('invoice')
        ->subject('Invoice Paid')
        ->markdown('mail.invoice.paid', ['url' => $url]);
}
```


## 데이터베이스 알림 {#database-notifications}


### 사전 준비 사항 {#database-prerequisites}

`database` 알림 채널은 알림 정보를 데이터베이스 테이블에 저장합니다. 이 테이블에는 알림 유형과 알림을 설명하는 JSON 데이터 구조와 같은 정보가 포함됩니다.

이 테이블을 조회하여 애플리케이션의 사용자 인터페이스에 알림을 표시할 수 있습니다. 하지만, 이를 위해서는 먼저 알림을 저장할 데이터베이스 테이블을 생성해야 합니다. `make:notifications-table` 명령어를 사용하여 적절한 테이블 스키마가 포함된 [마이그레이션](/laravel/12.x/migrations)을 생성할 수 있습니다.

```shell
php artisan make:notifications-table

php artisan migrate
```

> [!NOTE]
> 만약 알림을 받을 모델이 [UUID 또는 ULID 기본 키](/laravel/12.x/eloquent#uuid-and-ulid-keys)를 사용한다면, 알림 테이블 마이그레이션에서 `morphs` 메서드를 [uuidMorphs](/laravel/12.x/migrations#column-method-uuidMorphs) 또는 [ulidMorphs](/laravel/12.x/migrations#column-method-ulidMorphs)로 교체해야 합니다.


### 데이터베이스 알림 포맷팅 {#formatting-database-notifications}

알림을 데이터베이스 테이블에 저장할 수 있도록 지원하려면, 알림 클래스에 `toDatabase` 또는 `toArray` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 인자로 받아야 하며, 일반 PHP 배열을 반환해야 합니다. 반환된 배열은 JSON으로 인코딩되어 `notifications` 테이블의 `data` 컬럼에 저장됩니다. 아래는 `toArray` 메서드의 예시입니다:

```php
/**
 * 알림의 배열 표현을 반환합니다.
 *
 * @return array<string, mixed>
 */
public function toArray(object $notifiable): array
{
    return [
        'invoice_id' => $this->invoice->id,
        'amount' => $this->invoice->amount,
    ];
}
```

알림이 애플리케이션의 데이터베이스에 저장될 때, 기본적으로 `type` 컬럼에는 알림 클래스의 이름이 저장되고, `read_at` 컬럼은 `null`로 설정됩니다. 하지만, 알림 클래스에서 `databaseType` 및 `initialDatabaseReadAtValue` 메서드를 정의하여 이 동작을 커스터마이즈할 수 있습니다:

```php
use Illuminate\Support\Carbon;

/**
 * 알림의 데이터베이스 타입을 반환합니다.
 */
public function databaseType(object $notifiable): string
{
    return 'invoice-paid';
}

/**
 * "read_at" 컬럼의 초기값을 반환합니다.
 */
public function initialDatabaseReadAtValue(): ?Carbon
{
    return null;
}
```


#### `toDatabase` vs. `toArray` {#todatabase-vs-toarray}

`toArray` 메서드는 `broadcast` 채널에서 자바스크립트 기반 프론트엔드로 어떤 데이터를 전송할지 결정할 때도 사용됩니다. 만약 `database` 채널과 `broadcast` 채널에 대해 서로 다른 배열 형태의 데이터를 사용하고 싶다면, `toArray` 메서드 대신 `toDatabase` 메서드를 정의해야 합니다.


### 알림 접근하기 {#accessing-the-notifications}

알림이 데이터베이스에 저장된 후에는, 알림을 받을 수 있는 엔티티에서 이를 편리하게 조회할 수 있어야 합니다. Laravel의 기본 `App\Models\User` 모델에 포함된 `Illuminate\Notifications\Notifiable` 트레이트에는 해당 엔티티의 알림을 반환하는 `notifications` [Eloquent 관계](/laravel/12.x/eloquent-relationships)가 포함되어 있습니다. 알림을 조회하려면, 다른 Eloquent 관계와 마찬가지로 이 메서드에 접근하면 됩니다. 기본적으로 알림은 `created_at` 타임스탬프를 기준으로 가장 최근 알림이 컬렉션의 맨 앞에 오도록 정렬됩니다:

```php
$user = App\Models\User::find(1);

foreach ($user->notifications as $notification) {
    echo $notification->type;
}
```

"읽지 않은" 알림만 조회하고 싶다면, `unreadNotifications` 관계를 사용할 수 있습니다. 이 역시 `created_at` 타임스탬프를 기준으로 가장 최근 알림이 맨 앞에 오도록 정렬됩니다:

```php
$user = App\Models\User::find(1);

foreach ($user->unreadNotifications as $notification) {
    echo $notification->type;
}
```

> [!NOTE]
> JavaScript 클라이언트에서 알림에 접근하려면, 알림을 받을 수 있는 엔티티(예: 현재 사용자)의 알림을 반환하는 알림 컨트롤러를 애플리케이션에 정의해야 합니다. 그런 다음, JavaScript 클라이언트에서 해당 컨트롤러의 URL로 HTTP 요청을 보내면 됩니다.


### 알림을 읽음으로 표시하기 {#marking-notifications-as-read}

일반적으로 사용자가 알림을 확인하면 해당 알림을 "읽음"으로 표시하고 싶을 것입니다. `Illuminate\Notifications\Notifiable` 트레이트는 `markAsRead` 메서드를 제공하며, 이 메서드는 알림의 데이터베이스 레코드에서 `read_at` 컬럼을 업데이트합니다:

```php
$user = App\Models\User::find(1);

foreach ($user->unreadNotifications as $notification) {
    $notification->markAsRead();
}
```

하지만 각 알림을 반복 처리하는 대신, 알림 컬렉션에 직접 `markAsRead` 메서드를 사용할 수도 있습니다:

```php
$user->unreadNotifications->markAsRead();
```

또한, 데이터베이스에서 알림을 조회하지 않고도 대량 업데이트 쿼리를 사용해 모든 알림을 읽음으로 표시할 수 있습니다:

```php
$user = App\Models\User::find(1);

$user->unreadNotifications()->update(['read_at' => now()]);
```

알림을 테이블에서 완전히 삭제하려면 `delete` 메서드를 사용할 수 있습니다:

```php
$user->notifications()->delete();
```


## 브로드캐스트 알림 {#broadcast-notifications}


### 사전 준비 사항 {#broadcast-prerequisites}

알림을 브로드캐스트하기 전에, Laravel의 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 서비스를 설정하고 숙지해야 합니다. 이벤트 브로드캐스팅은 서버 측 Laravel 이벤트에 자바스크립트 기반 프론트엔드에서 반응할 수 있는 방법을 제공합니다.


### 브로드캐스트 알림 포맷팅 {#formatting-broadcast-notifications}

`broadcast` 채널은 Laravel의 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 서비스를 사용하여 알림을 브로드캐스트합니다. 이를 통해 자바스크립트 기반 프론트엔드에서 실시간으로 알림을 받을 수 있습니다. 알림이 브로드캐스트를 지원하는 경우, 알림 클래스에 `toBroadcast` 메서드를 정의할 수 있습니다. 이 메서드는 `$notifiable` 엔티티를 인자로 받아야 하며, `BroadcastMessage` 인스턴스를 반환해야 합니다. 만약 `toBroadcast` 메서드가 존재하지 않으면, 브로드캐스트할 데이터를 수집하기 위해 `toArray` 메서드가 사용됩니다. 반환된 데이터는 JSON으로 인코딩되어 자바스크립트 기반 프론트엔드로 브로드캐스트됩니다. 아래는 `toBroadcast` 메서드의 예시입니다:

```php
use Illuminate\Notifications\Messages\BroadcastMessage;

/**
 * 알림의 브로드캐스트 가능한 표현을 반환합니다.
 */
public function toBroadcast(object $notifiable): BroadcastMessage
{
    return new BroadcastMessage([
        'invoice_id' => $this->invoice->id,
        'amount' => $this->invoice->amount,
    ]);
}
```


#### 브로드캐스트 큐 설정 {#broadcast-queue-configuration}

모든 브로드캐스트 알림은 브로드캐스팅을 위해 큐에 저장됩니다. 브로드캐스트 작업을 큐에 저장할 때 사용할 큐 연결(connection)이나 큐 이름(queue name)을 설정하고 싶다면, `BroadcastMessage`의 `onConnection` 및 `onQueue` 메서드를 사용할 수 있습니다:

```php
return (new BroadcastMessage($data))
    ->onConnection('sqs')
    ->onQueue('broadcasts');
```


#### 알림 타입 커스터마이징 {#customizing-the-notification-type}

지정한 데이터 외에도, 모든 브로드캐스트 알림에는 알림의 전체 클래스 이름이 담긴 type 필드가 포함됩니다. 알림의 type을 커스터마이징하고 싶다면, 알림 클래스에 broadcastType 메서드를 정의하면 됩니다:

```php
/**
 * 브로드캐스트되는 알림의 타입을 반환합니다.
 */
public function broadcastType(): string
{
    return 'broadcast.message';
}
```


### 알림 수신 대기 {#listening-for-notifications}

알림은 `{notifiable}.{id}` 형식의 프라이빗 채널에서 브로드캐스트됩니다. 예를 들어, ID가 `1`인 `App\Models\User` 인스턴스에 알림을 보낼 경우, 해당 알림은 `App.Models.User.1` 프라이빗 채널에서 브로드캐스트됩니다. [Laravel Echo](/laravel/12.x/broadcasting#client-side-installation)를 사용할 때는, `notification` 메서드를 이용해 해당 채널에서 손쉽게 알림을 수신할 수 있습니다:

```js
Echo.private('App.Models.User.' + userId)
    .notification((notification) => {
        console.log(notification.type);
    });
```


#### React 또는 Vue 사용하기 {#using-react-or-vue}

Laravel Echo는 알림을 손쉽게 수신할 수 있도록 React와 Vue용 훅을 제공합니다. 시작하려면, 알림을 수신하는 데 사용되는 useEchoNotification 훅을 호출하세요. useEchoNotification 훅은 컴포넌트가 언마운트될 때 자동으로 채널을 떠납니다:
::: code-group
```js [React]
import { useEchoNotification } from "@laravel/echo-react";

useEchoNotification(
    `App.Models.User.${userId}`,
    (notification) => {
        console.log(notification.type);
    },
);
```

```vue [Vue]
<script setup lang="ts">
import { useEchoNotification } from "@laravel/echo-vue";

useEchoNotification(
    `App.Models.User.${userId}`,
    (notification) => {
        console.log(notification.type);
    },
);
</script>
```
:::
기본적으로 이 훅은 모든 알림을 수신합니다. 특정 알림 타입만 수신하고 싶다면, useEchoNotification에 문자열 또는 타입의 배열을 세 번째 인자로 전달할 수 있습니다:
::: code-group
```js [React]
import { useEchoNotification } from "@laravel/echo-react";

useEchoNotification(
    `App.Models.User.${userId}`,
    (notification) => {
        console.log(notification.type);
    },
    'App.Notifications.InvoicePaid',
);
```

```vue [Vue]
<script setup lang="ts">
import { useEchoNotification } from "@laravel/echo-vue";

useEchoNotification(
    `App.Models.User.${userId}`,
    (notification) => {
        console.log(notification.type);
    },
    'App.Notifications.InvoicePaid',
);
</script>
```
:::
또한 알림 페이로드 데이터의 형태를 지정하여 더 높은 타입 안정성과 편리한 편집 기능을 제공할 수 있습니다:

```ts
type InvoicePaidNotification = {
    invoice_id: number;
    created_at: string;
};

useEchoNotification<InvoicePaidNotification>(
    `App.Models.User.${userId}`,
    (notification) => {
        console.log(notification.invoice_id);
        console.log(notification.created_at);
        console.log(notification.type);
    },
    'App.Notifications.InvoicePaid',
);
```


#### 알림 채널 커스터마이징 {#customizing-the-notification-channel}

엔티티의 브로드캐스트 알림이 어떤 채널로 전송될지 커스터마이징하고 싶다면, 해당 엔티티에 `receivesBroadcastNotificationsOn` 메서드를 정의하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * 사용자가 알림 브로드캐스트를 수신하는 채널을 반환합니다.
     */
    public function receivesBroadcastNotificationsOn(): string
    {
        return 'users.'.$this->id;
    }
}
```


## SMS 알림 {#sms-notifications}


### 사전 준비 사항 {#sms-prerequisites}

Laravel에서 SMS 알림 전송은 [Vonage](https://www.vonage.com/) (이전 명칭: Nexmo)를 통해 제공됩니다. Vonage를 통해 알림을 전송하려면 `laravel/vonage-notification-channel`과 `guzzlehttp/guzzle` 패키지를 설치해야 합니다:

```shell
composer require laravel/vonage-notification-channel guzzlehttp/guzzle
```

이 패키지에는 [설정 파일](https://github.com/laravel/vonage-notification-channel/blob/3.x/config/vonage.php)이 포함되어 있습니다. 하지만 이 설정 파일을 애플리케이션에 직접 내보낼 필요는 없습니다. `VONAGE_KEY`와 `VONAGE_SECRET` 환경 변수를 사용하여 Vonage의 공개 키와 비밀 키를 정의하면 됩니다.

키를 정의한 후에는 SMS 메시지를 기본적으로 발송할 전화번호를 지정하는 `VONAGE_SMS_FROM` 환경 변수를 설정해야 합니다. 이 전화번호는 Vonage 콘트롤 패널에서 생성할 수 있습니다:

```ini
VONAGE_SMS_FROM=15556666666
```


### SMS 알림 포맷팅 {#formatting-sms-notifications}

알림이 SMS로 전송되는 것을 지원한다면, 알림 클래스에 `toVonage` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 인자로 받으며, `Illuminate\Notifications\Messages\VonageMessage` 인스턴스를 반환해야 합니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * 알림의 Vonage / SMS 표현을 반환합니다.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('여기에 SMS 메시지 내용을 입력하세요');
}
```


#### 유니코드 내용 {#unicode-content}

SMS 메시지에 유니코드 문자가 포함될 경우, `VonageMessage` 인스턴스를 생성할 때 `unicode` 메서드를 호출해야 합니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * 알림의 Vonage / SMS 표현을 반환합니다.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('유니코드 메시지 내용')
        ->unicode();
}
```


### "From" 번호 커스터마이징 {#customizing-the-from-number}

알림을 보낼 때, `VONAGE_SMS_FROM` 환경 변수에 지정된 전화번호와 다른 번호로 메시지를 보내고 싶다면, `VonageMessage` 인스턴스에서 `from` 메서드를 호출하면 됩니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * 알림의 Vonage / SMS 표현을 반환합니다.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('Your SMS message content')
        ->from('15554443333');
}
```


### 클라이언트 참조 추가하기 {#adding-a-client-reference}

사용자, 팀 또는 클라이언트별로 비용을 추적하고 싶다면, 알림에 "클라이언트 참조(client reference)"를 추가할 수 있습니다. Vonage는 이 클라이언트 참조를 사용하여 보고서를 생성할 수 있으므로, 특정 고객의 SMS 사용량을 더 잘 파악할 수 있습니다. 클라이언트 참조는 최대 40자까지의 문자열이면 됩니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * 알림의 Vonage / SMS 표현을 반환합니다.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->clientReference((string) $notifiable->id)
        ->content('Your SMS message content');
}
```


### SMS 알림 라우팅 {#routing-sms-notifications}

Vonage 알림을 올바른 전화번호로 라우팅하려면, 알림을 받을 엔티티(예: User 모델)에 `routeNotificationForVonage` 메서드를 정의하세요:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * Vonage 채널을 위한 알림 라우팅.
     */
    public function routeNotificationForVonage(Notification $notification): string
    {
        return $this->phone_number;
    }
}
```


## 슬랙 알림 {#slack-notifications}


### 사전 준비 사항 {#slack-prerequisites}

Slack 알림을 보내기 전에 Composer를 통해 Slack 알림 채널을 설치해야 합니다:

```shell
composer require laravel/slack-notification-channel
```

또한, Slack 워크스페이스에 사용할 [Slack 앱](https://api.slack.com/apps?new_app=1)을 생성해야 합니다.

알림을 앱이 생성된 동일한 Slack 워크스페이스로만 보낼 경우, 앱에 `chat:write`, `chat:write.public`, `chat:write.customize` 권한이 있는지 확인해야 합니다. 이 권한들은 Slack의 "OAuth & Permissions" 앱 관리 탭에서 추가할 수 있습니다.

다음으로, 앱의 "Bot User OAuth Token"을 복사하여 애플리케이션의 `services.php` 설정 파일 내 `slack` 설정 배열에 추가합니다. 이 토큰은 Slack의 "OAuth & Permissions" 탭에서 확인할 수 있습니다:

```php
'slack' => [
    'notifications' => [
        'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
        'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
    ],
],
```


#### 앱 배포 {#slack-app-distribution}

만약 여러분의 애플리케이션이 애플리케이션 사용자가 소유한 외부 Slack 워크스페이스로 알림을 전송해야 한다면, Slack을 통해 앱을 "배포"해야 합니다. 앱 배포는 Slack 내의 앱 "배포 관리(Manage Distribution)" 탭에서 관리할 수 있습니다. 앱이 배포된 후에는 [Socialite](/laravel/12.x/socialite)를 사용하여 애플리케이션 사용자를 대신해 [Slack Bot 토큰](/laravel/12.x/socialite#slack-bot-scopes)를 획득할 수 있습니다.


### Slack 알림 포맷팅 {#formatting-slack-notifications}

알림이 Slack 메시지로 전송되는 것을 지원한다면, 알림 클래스에 `toSlack` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 인자로 받으며, `Illuminate\Notifications\Slack\SlackMessage` 인스턴스를 반환해야 합니다. [Slack의 Block Kit API](https://api.slack.com/block-kit)를 사용하여 다양한 형태의 알림을 구성할 수 있습니다. 아래 예시는 [Slack의 Block Kit builder](https://app.slack.com/block-kit-builder/T01KWS6K23Z#%7B%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Invoice%20Paid%22%7D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22plain_text%22,%22text%22:%22Customer%20%231234%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22An%20invoice%20has%20been%20paid.%22%7D,%22fields%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Invoice%20No:*%5Cn1000%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Invoice%20Recipient:*%5Cntaylor@laravel.com%22%7D%5D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Congratulations!%22%7D%7D%5D%7D)에서 미리 볼 수 있습니다.

```php
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\BlockKit\Composites\ConfirmObject;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * 알림의 Slack 표현을 반환합니다.
 */
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('귀하의 인보이스 중 하나가 결제되었습니다!')
        ->headerBlock('인보이스 결제 완료')
        ->contextBlock(function (ContextBlock $block) {
            $block->text('고객 #1234');
        })
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('인보이스가 결제되었습니다.');
            $block->field("*인보이스 번호:*\n1000")->markdown();
            $block->field("*수신자:*\ntaylor@laravel.com")->markdown();
        })
        ->dividerBlock()
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('축하합니다!');
        });
}
```


#### Slack의 Block Kit Builder 템플릿 사용하기 {#using-slacks-block-kit-builder-template}

Block Kit 메시지를 구성할 때, 플루언트 메시지 빌더 메서드를 사용하는 대신 Slack의 Block Kit Builder에서 생성된 원시 JSON 페이로드를 usingBlockKitTemplate 메서드에 전달할 수 있습니다:

```php
use Illuminate\Notifications\Slack\SlackMessage;
use Illuminate\Support\Str;

/**
 * 알림의 Slack 표현을 반환합니다.
 */
public function toSlack(object $notifiable): SlackMessage
{
    $template = <<<JSON
        {
          "blocks": [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "Team Announcement"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "plain_text",
                "text": "We are hiring!"
              }
            }
          ]
        }
    JSON;

    return (new SlackMessage)
        ->usingBlockKitTemplate($template);
}
```


### Slack 상호작용 {#slack-interactivity}

Slack의 Block Kit 알림 시스템은 [사용자 상호작용 처리](https://api.slack.com/interactivity/handling)를 위한 강력한 기능을 제공합니다. 이러한 기능을 활용하려면, Slack 앱에서 "Interactivity"를 활성화하고, 애플리케이션에서 제공하는 URL을 "Request URL"로 설정해야 합니다. 이 설정은 Slack의 "Interactivity & Shortcuts" 앱 관리 탭에서 관리할 수 있습니다.

아래 예제는 `actionsBlock` 메서드를 활용한 것으로, 사용자가 버튼을 클릭하면 Slack이 "Request URL"로 Slack 사용자 정보, 클릭된 버튼의 ID 등 다양한 정보를 포함한 payload와 함께 `POST` 요청을 전송합니다. 애플리케이션은 이 payload를 바탕으로 적절한 동작을 수행할 수 있습니다. 또한, [요청이 Slack에서 온 것인지 검증](https://api.slack.com/authentication/verifying-requests-from-slack)하는 것이 좋습니다.

```php
use Illuminate\Notifications\Slack\BlockKit\Blocks\ActionsBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * 알림의 Slack 표현을 반환합니다.
 */
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('귀하의 인보이스 중 하나가 결제되었습니다!')
        ->headerBlock('인보이스 결제 완료')
        ->contextBlock(function (ContextBlock $block) {
            $block->text('고객 #1234');
        })
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('인보이스가 결제되었습니다.');
        })
        ->actionsBlock(function (ActionsBlock $block) {
             // ID는 기본적으로 "button_acknowledge_invoice"로 설정됩니다...
            $block->button('인보이스 확인')->primary();

            // ID를 수동으로 설정할 수도 있습니다...
            $block->button('거부')->danger()->id('deny_invoice');
        });
}
```


#### 확인 모달 {#slack-confirmation-modals}

사용자가 어떤 동작을 수행하기 전에 반드시 확인하도록 요구하고 싶다면, 버튼을 정의할 때 `confirm` 메서드를 호출할 수 있습니다. `confirm` 메서드는 메시지와, `ConfirmObject` 인스턴스를 받는 클로저를 인자로 받습니다:

```php
use Illuminate\Notifications\Slack\BlockKit\Blocks\ActionsBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\BlockKit\Composites\ConfirmObject;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * 알림의 Slack 표현을 반환합니다.
 */
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('귀하의 인보이스 중 하나가 결제되었습니다!')
        ->headerBlock('인보이스 결제 완료')
        ->contextBlock(function (ContextBlock $block) {
            $block->text('고객 #1234');
        })
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('인보이스가 결제되었습니다.');
        })
        ->actionsBlock(function (ActionsBlock $block) {
            $block->button('인보이스 확인')
                ->primary()
                ->confirm(
                    '결제를 확인하고 감사 이메일을 보내시겠습니까?',
                    function (ConfirmObject $dialog) {
                        $dialog->confirm('예');
                        $dialog->deny('아니오');
                    }
                );
        });
}
```


#### Slack 블록 검사하기 {#inspecting-slack-blocks}

만약 여러분이 작성 중인 블록을 빠르게 확인하고 싶다면, `SlackMessage` 인스턴스에서 `dd` 메서드를 호출할 수 있습니다. `dd` 메서드는 Slack의 [Block Kit Builder](https://app.slack.com/block-kit-builder/)로 연결되는 URL을 생성하여 출력해주며, 브라우저에서 페이로드와 알림의 미리보기를 확인할 수 있습니다. `dd` 메서드에 `true`를 전달하면 원시 페이로드를 출력합니다:

```php
return (new SlackMessage)
    ->text('귀하의 인보이스 중 하나가 결제되었습니다!')
    ->headerBlock('인보이스 결제 완료')
    ->dd();
```


### Slack 알림 라우팅 {#routing-slack-notifications}

Slack 알림을 적절한 Slack 팀과 채널로 전송하려면, 알림을 받을 모델에 `routeNotificationForSlack` 메서드를 정의해야 합니다. 이 메서드는 다음 세 가지 값 중 하나를 반환할 수 있습니다:

- `null` - 알림 자체에 설정된 채널로 라우팅을 위임합니다. 알림을 생성할 때 `SlackMessage`의 `to` 메서드를 사용해 채널을 지정할 수 있습니다.
- 알림을 보낼 Slack 채널을 지정하는 문자열, 예: `#support-channel`
- `SlackRoute` 인스턴스. 이 방법을 사용하면 OAuth 토큰과 채널명을 지정할 수 있습니다. 예: `SlackRoute::make($this->slack_channel, $this->slack_token)`. 이 방법은 외부 워크스페이스로 알림을 보낼 때 사용합니다.

예를 들어, `routeNotificationForSlack` 메서드에서 `#support-channel`을 반환하면, 애플리케이션의 `services.php` 설정 파일에 있는 Bot User OAuth 토큰과 연결된 워크스페이스의 `#support-channel` 채널로 알림이 전송됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * Slack 채널로 알림을 라우팅합니다.
     */
    public function routeNotificationForSlack(Notification $notification): mixed
    {
        return '#support-channel';
    }
}
```


### 외부 Slack 워크스페이스에 알림 보내기 {#notifying-external-slack-workspaces}

> [!NOTE]
> 외부 Slack 워크스페이스로 알림을 보내기 전에, Slack 앱이 [배포(distributed)](#slack-app-distribution)되어 있어야 합니다.

당연히, 애플리케이션 사용자가 소유한 Slack 워크스페이스로 알림을 보내고 싶을 때가 많을 것입니다. 이를 위해서는 먼저 사용자의 Slack OAuth 토큰을 획득해야 합니다. 다행히도, [Laravel Socialite](/laravel/12.x/socialite)는 Slack 드라이버를 제공하여 애플리케이션 사용자를 Slack으로 쉽게 인증하고 [봇 토큰을 획득](/laravel/12.x/socialite#slack-bot-scopes)할 수 있습니다.

봇 토큰을 획득하여 애플리케이션의 데이터베이스에 저장한 후, `SlackRoute::make` 메서드를 사용해 해당 사용자의 워크스페이스로 알림을 라우팅할 수 있습니다. 또한, 애플리케이션에서 사용자가 알림을 받을 채널을 지정할 수 있도록 기능을 제공해야 할 수도 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\SlackRoute;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * Slack 채널로 알림을 라우팅합니다.
     */
    public function routeNotificationForSlack(Notification $notification): mixed
    {
        return SlackRoute::make($this->slack_channel, $this->slack_token);
    }
}
```


## 알림의 지역화 {#localizing-notifications}

Laravel은 HTTP 요청의 현재 로케일과 다른 언어로 알림을 보낼 수 있도록 하며, 알림이 큐에 저장된 경우에도 이 로케일을 기억합니다.

이를 위해 `Illuminate\Notifications\Notification` 클래스는 원하는 언어를 설정할 수 있는 `locale` 메서드를 제공합니다. 알림이 평가되는 동안 애플리케이션은 해당 로케일로 변경되며, 평가가 끝나면 이전 로케일로 다시 돌아갑니다.

```php
$user->notify((new InvoicePaid($invoice))->locale('es'));
```

여러 명의 알림 수신자에게도 `Notification` 파사드를 통해 지역화를 적용할 수 있습니다.

```php
Notification::locale('es')->send(
    $users, new InvoicePaid($invoice)
);
```


### 사용자 선호 로케일 {#user-preferred-locales}

때때로 애플리케이션은 각 사용자의 선호 로케일을 저장합니다. 알림을 보낼 때 Laravel이 이 저장된 로케일을 사용하도록 하려면, 알림을 받을 수 있는 모델에 `HasLocalePreference` 계약을 구현하면 됩니다.

```php
use Illuminate\Contracts\Translation\HasLocalePreference;

class User extends Model implements HasLocalePreference
{
    /**
     * 사용자의 선호 로케일을 반환합니다.
     */
    public function preferredLocale(): string
    {
        return $this->locale;
    }
}
```

이 인터페이스를 구현하면, Laravel은 해당 모델에 알림이나 메일을 보낼 때 자동으로 사용자의 선호 로케일을 사용합니다. 따라서 이 인터페이스를 사용할 경우 `locale` 메서드를 따로 호출할 필요가 없습니다.

```php
$user->notify(new InvoicePaid($invoice));
```


## 테스트 {#testing}

`Notification` 파사드의 `fake` 메서드를 사용하면 실제로 알림이 전송되는 것을 방지할 수 있습니다. 일반적으로 알림 전송은 실제로 테스트하려는 코드와는 관련이 없습니다. 대부분의 경우, Laravel이 특정 알림을 전송하도록 지시받았는지만 검증하면 충분합니다.

`Notification` 파사드의 `fake` 메서드를 호출한 후, 알림이 사용자에게 전송되었는지, 그리고 알림이 받은 데이터까지도 검증할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Notifications\OrderShipped;
use Illuminate\Support\Facades\Notification;

test('orders can be shipped', function () {
    Notification::fake();

    // 주문 배송 처리...

    // 알림이 전혀 전송되지 않았는지 확인...
    Notification::assertNothingSent();

    // 특정 사용자에게 알림이 전송되었는지 확인...
    Notification::assertSentTo(
        [$user], OrderShipped::class
    );

    // 알림이 전송되지 않았는지 확인...
    Notification::assertNotSentTo(
        [$user], AnotherNotification::class
    );

    // 총 3개의 알림이 전송되었는지 확인...
    Notification::assertCount(3);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Notifications\OrderShipped;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_orders_can_be_shipped(): void
    {
        Notification::fake();

        // 주문 배송 처리...

        // 알림이 전혀 전송되지 않았는지 확인...
        Notification::assertNothingSent();

        // 특정 사용자에게 알림이 전송되었는지 확인...
        Notification::assertSentTo(
            [$user], OrderShipped::class
        );

        // 알림이 전송되지 않았는지 확인...
        Notification::assertNotSentTo(
            [$user], AnotherNotification::class
        );

        // 총 3개의 알림이 전송되었는지 확인...
        Notification::assertCount(3);
    }
}
```
:::
`assertSentTo` 또는 `assertNotSentTo` 메서드에 클로저를 전달하여, 특정 "진위 테스트"를 통과하는 알림이 전송되었는지 검증할 수 있습니다. 주어진 진위 테스트를 통과하는 알림이 하나라도 전송되었다면, 해당 검증은 성공합니다:

```php
Notification::assertSentTo(
    $user,
    function (OrderShipped $notification, array $channels) use ($order) {
        return $notification->order->id === $order->id;
    }
);
```


#### 온디맨드 알림 {#on-demand-notifications-test}

테스트 중인 코드가 [온디맨드 알림](#on-demand-notifications)을 전송하는 경우, `assertSentOnDemand` 메서드를 사용하여 온디맨드 알림이 전송되었는지 테스트할 수 있습니다.

```php
Notification::assertSentOnDemand(OrderShipped::class);
```

`assertSentOnDemand` 메서드의 두 번째 인자로 클로저를 전달하면, 온디맨드 알림이 올바른 "route" 주소로 전송되었는지 확인할 수 있습니다.

```php
Notification::assertSentOnDemand(
    OrderShipped::class,
    function (OrderShipped $notification, array $channels, object $notifiable) use ($user) {
        return $notifiable->routes['mail'] === $user->email;
    }
);
```


## 알림 이벤트 {#notification-events}


#### Notification Sending 이벤트 {#notification-sending-event}

알림이 전송될 때, 알림 시스템은 `Illuminate\Notifications\Events\NotificationSending` 이벤트를 디스패치합니다. 이 이벤트에는 "notifiable" 엔티티와 알림 인스턴스 자체가 포함되어 있습니다. 애플리케이션 내에서 이 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Notifications\Events\NotificationSending;

class CheckNotificationStatus
{
    /**
     * 이벤트를 처리합니다.
     */
    public function handle(NotificationSending $event): void
    {
        // ...
    }
}
```

만약 `NotificationSending` 이벤트에 대한 이벤트 리스너의 `handle` 메서드가 `false`를 반환하면, 해당 알림은 전송되지 않습니다:

```php
/**
 * 이벤트를 처리합니다.
 */
public function handle(NotificationSending $event): bool
{
    return false;
}
```

이벤트 리스너 내에서는 이벤트의 `notifiable`, `notification`, `channel` 속성에 접근하여 알림 수신자나 알림 자체에 대한 더 많은 정보를 얻을 수 있습니다:

```php
/**
 * 이벤트를 처리합니다.
 */
public function handle(NotificationSending $event): void
{
    // $event->channel
    // $event->notifiable
    // $event->notification
}
```


#### Notification Sent 이벤트 {#notification-sent-event}

알림이 전송될 때, 알림 시스템은 `Illuminate\Notifications\Events\NotificationSent` [이벤트](/laravel/12.x/events)를 디스패치합니다. 이 이벤트에는 "notifiable" 엔티티와 알림 인스턴스 자체가 포함되어 있습니다. 애플리케이션 내에서 이 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Notifications\Events\NotificationSent;

class LogNotification
{
    /**
     * 이벤트를 처리합니다.
     */
    public function handle(NotificationSent $event): void
    {
        // ...
    }
}
```

이벤트 리스너 내에서는 이벤트의 `notifiable`, `notification`, `channel`, `response` 속성에 접근하여 알림 수신자나 알림 자체에 대한 더 많은 정보를 얻을 수 있습니다:

```php
/**
 * 이벤트를 처리합니다.
 */
public function handle(NotificationSent $event): void
{
    // $event->channel
    // $event->notifiable
    // $event->notification
    // $event->response
}
```


## 커스텀 채널 {#custom-channels}

Laravel은 몇 가지 기본 알림 채널을 제공하지만, 다른 채널을 통해 알림을 전달하고 싶을 때 직접 드라이버를 작성할 수 있습니다. Laravel에서는 이를 간단하게 구현할 수 있습니다. 먼저, `send` 메서드를 포함하는 클래스를 정의하세요. 이 메서드는 두 개의 인자, 즉 `$notifiable`과 `$notification`을 받아야 합니다.

`send` 메서드 안에서는 알림에서 메시지 객체를 가져오는 메서드를 호출한 뒤, 원하는 방식으로 `$notifiable` 인스턴스에 알림을 보낼 수 있습니다.

```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class VoiceChannel
{
    /**
     * 주어진 알림을 전송합니다.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $message = $notification->toVoice($notifiable);

        // $notifiable 인스턴스에 알림을 전송하는 로직...
    }
}
```

알림 채널 클래스가 정의되면, 알림 클래스의 `via` 메서드에서 해당 클래스명을 반환할 수 있습니다. 이 예시에서 알림의 `toVoice` 메서드는 음성 메시지를 나타내는 임의의 객체를 반환할 수 있습니다. 예를 들어, 이러한 메시지를 표현하기 위해 직접 `VoiceMessage` 클래스를 정의할 수 있습니다.

```php
<?php

namespace App\Notifications;

use App\Notifications\Messages\VoiceMessage;
use App\Notifications\VoiceChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification
{
    use Queueable;

    /**
     * 알림 채널을 반환합니다.
     */
    public function via(object $notifiable): string
    {
        return VoiceChannel::class;
    }

    /**
     * 알림의 음성 메시지 표현을 반환합니다.
     */
    public function toVoice(object $notifiable): VoiceMessage
    {
        // ...
    }
}
```
