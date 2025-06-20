# 알림(Notifications)





















































## 소개 {#introduction}

[이메일 전송](/laravel/12.x/mail) 지원 외에도, Laravel은 이메일, SMS([Vonage](https://www.vonage.com/communications-apis/), 이전 Nexmo), [Slack](https://slack.com) 등 다양한 전송 채널을 통한 알림 전송을 지원합니다. 또한, [커뮤니티에서 제작한 다양한 알림 채널](https://laravel-notification-channels.com/about/#suggesting-a-new-channel)도 있어 수십 가지 채널로 알림을 보낼 수 있습니다! 알림은 데이터베이스에 저장하여 웹 인터페이스에 표시할 수도 있습니다.

일반적으로 알림은 애플리케이션에서 발생한 일을 사용자에게 알리는 짧고 정보성 메시지여야 합니다. 예를 들어, 결제 애플리케이션을 작성하는 경우, 사용자의 이메일 및 SMS 채널을 통해 "청구서 결제 완료" 알림을 보낼 수 있습니다.


## 알림 생성 {#generating-notifications}

Laravel에서 각 알림은 보통 `app/Notifications` 디렉터리에 저장되는 단일 클래스로 표현됩니다. 이 디렉터리가 없다면, `make:notification` 아티즌 명령어를 실행하면 자동으로 생성됩니다:

```shell
php artisan make:notification InvoicePaid
```

이 명령어는 새로운 알림 클래스를 `app/Notifications` 디렉터리에 생성합니다. 각 알림 클래스에는 `via` 메서드와, 해당 채널에 맞는 메시지로 변환하는 `toMail`, `toDatabase` 등 다양한 메시지 빌더 메서드가 포함됩니다.


## 알림 전송 {#sending-notifications}


### Notifiable 트레이트 사용 {#using-the-notifiable-trait}

알림은 `Notifiable` 트레이트의 `notify` 메서드 또는 `Notification` [파사드](/laravel/12.x/facades)를 사용해 두 가지 방법으로 전송할 수 있습니다. `Notifiable` 트레이트는 기본적으로 애플리케이션의 `App\Models\User` 모델에 포함되어 있습니다:

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

이 트레이트가 제공하는 `notify` 메서드는 알림 인스턴스를 인자로 받습니다:

```php
use App\Notifications\InvoicePaid;

$user->notify(new InvoicePaid($invoice));
```

> [!NOTE]
> `Notifiable` 트레이트는 어떤 모델에도 사용할 수 있습니다. 반드시 `User` 모델에만 포함할 필요는 없습니다.


### Notification 파사드 사용 {#using-the-notification-facade}

또는, `Notification` [파사드](/laravel/12.x/facades)를 통해 알림을 전송할 수 있습니다. 이 방법은 여러 notifiable 엔티티(예: 사용자 컬렉션)에게 알림을 보낼 때 유용합니다. 파사드를 사용할 때는 모든 notifiable 엔티티와 알림 인스턴스를 `send` 메서드에 전달합니다:

```php
use Illuminate\Support\Facades\Notification;

Notification::send($users, new InvoicePaid($invoice));
```

`sendNow` 메서드를 사용하면 알림이 즉시 전송됩니다. 이 메서드는 알림이 `ShouldQueue` 인터페이스를 구현하더라도 즉시 전송합니다:

```php
Notification::sendNow($developers, new DeploymentCompleted($deployment));
```


### 전송 채널 지정 {#specifying-delivery-channels}

모든 알림 클래스에는 알림이 어떤 채널로 전송될지 결정하는 `via` 메서드가 있습니다. 알림은 `mail`, `database`, `broadcast`, `vonage`, `slack` 채널로 전송할 수 있습니다.

> [!NOTE]
> Telegram, Pusher 등 다른 전송 채널을 사용하려면 커뮤니티 기반 [Laravel Notification Channels 웹사이트](http://laravel-notification-channels.com)를 참고하세요.

`via` 메서드는 `$notifiable` 인스턴스를 받으며, 이 인스턴스는 알림이 전송되는 클래스의 인스턴스입니다. `$notifiable`을 사용해 알림이 어떤 채널로 전송될지 결정할 수 있습니다:

```php
/**
 * Get the notification's delivery channels.
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
> 알림을 큐잉하기 전에 큐를 설정하고 [워커를 시작](/laravel/12.x/queues#running-the-queue-worker)해야 합니다.

알림 전송은 시간이 걸릴 수 있으며, 특히 외부 API 호출이 필요한 경우 더욱 그렇습니다. 애플리케이션의 응답 속도를 높이기 위해, `ShouldQueue` 인터페이스와 `Queueable` 트레이트를 클래스에 추가하여 알림을 큐에 넣을 수 있습니다. 이 인터페이스와 트레이트는 `make:notification` 명령어로 생성된 모든 알림에 이미 import되어 있으므로, 바로 알림 클래스에 추가할 수 있습니다:

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

`ShouldQueue` 인터페이스가 알림에 추가되면, 평소처럼 알림을 전송할 수 있습니다. Laravel은 클래스에서 `ShouldQueue` 인터페이스를 감지하고 자동으로 알림 전송을 큐에 넣습니다:

```php
$user->notify(new InvoicePaid($invoice));
```

알림을 큐잉할 때, 각 수신자와 채널 조합마다 큐 작업이 생성됩니다. 예를 들어, 수신자가 3명이고 채널이 2개라면 6개의 작업이 큐에 추가됩니다.


#### 알림 지연 전송 {#delaying-notifications}

알림 전송을 지연하고 싶다면, 알림 인스턴스 생성 시 `delay` 메서드를 체이닝할 수 있습니다:

```php
$delay = now()->addMinutes(10);

$user->notify((new InvoicePaid($invoice))->delay($delay));
```

특정 채널별로 지연 시간을 지정하려면 배열을 `delay` 메서드에 전달할 수 있습니다:

```php
$user->notify((new InvoicePaid($invoice))->delay([
    'mail' => now()->addMinutes(5),
    'sms' => now()->addMinutes(10),
]));
```

또는, 알림 클래스 자체에 `withDelay` 메서드를 정의할 수도 있습니다. `withDelay` 메서드는 채널명과 지연 값을 담은 배열을 반환해야 합니다:

```php
/**
 * Determine the notification's delivery delay.
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

기본적으로 큐잉된 알림은 애플리케이션의 기본 큐 연결을 사용합니다. 특정 알림에 대해 다른 연결을 사용하려면, 알림의 생성자에서 `onConnection` 메서드를 호출할 수 있습니다:

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
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->onConnection('redis');
    }
}
```

또는, 알림이 지원하는 각 채널별로 사용할 큐 연결을 지정하려면 `viaConnections` 메서드를 정의할 수 있습니다. 이 메서드는 채널명/큐 연결명 쌍의 배열을 반환해야 합니다:

```php
/**
 * Determine which connections should be used for each notification channel.
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

알림이 지원하는 각 채널별로 사용할 큐를 지정하려면, 알림에 `viaQueues` 메서드를 정의할 수 있습니다. 이 메서드는 채널명/큐명 쌍의 배열을 반환해야 합니다:

```php
/**
 * Determine which queues should be used for each notification channel.
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

큐잉된 알림은 [큐잉된 작업과 마찬가지로](/laravel/12.x/queues#job-middleware) 미들웨어를 정의할 수 있습니다. 시작하려면 알림 클래스에 `middleware` 메서드를 정의하세요. `middleware` 메서드는 `$notifiable`과 `$channel` 변수를 받아, 알림의 목적지에 따라 반환할 미들웨어를 커스터마이징할 수 있습니다:

```php
use Illuminate\Queue\Middleware\RateLimited;

/**
 * Get the middleware the notification job should pass through.
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

큐잉된 알림이 데이터베이스 트랜잭션 내에서 디스패치될 때, 큐가 데이터베이스 트랜잭션이 커밋되기 전에 작업을 처리할 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 가한 변경 사항이 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 레코드가 데이터베이스에 존재하지 않을 수도 있습니다. 알림이 이러한 모델에 의존한다면, 큐잉된 알림을 전송하는 작업이 처리될 때 예기치 않은 오류가 발생할 수 있습니다.

큐 연결의 `after_commit` 설정이 `false`인 경우에도, 알림 전송 시 `afterCommit` 메서드를 호출하여 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 큐잉된 알림이 디스패치되도록 지정할 수 있습니다:

```php
use App\Notifications\InvoicePaid;

$user->notify((new InvoicePaid($invoice))->afterCommit());
```

또는, 알림의 생성자에서 `afterCommit` 메서드를 호출할 수도 있습니다:

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
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->afterCommit();
    }
}
```

> [!NOTE]
> 이러한 문제를 우회하는 방법에 대해 더 알고 싶다면 [큐잉된 작업과 데이터베이스 트랜잭션](/laravel/12.x/queues#jobs-and-database-transactions) 문서를 참고하세요.


#### 큐잉된 알림이 전송되어야 하는지 결정하기 {#determining-if-the-queued-notification-should-be-sent}

큐잉된 알림이 백그라운드 처리를 위해 큐에 디스패치된 후, 일반적으로 큐 워커가 이를 받아 의도한 수신자에게 전송합니다.

그러나, 큐 워커가 알림을 처리한 후 실제로 전송할지 최종적으로 결정하고 싶다면, 알림 클래스에 `shouldSend` 메서드를 정의할 수 있습니다. 이 메서드가 `false`를 반환하면 알림이 전송되지 않습니다:

```php
/**
 * Determine if the notification should be sent.
 */
public function shouldSend(object $notifiable, string $channel): bool
{
    return $this->invoice->isPaid();
}
```


### 온디맨드 알림 {#on-demand-notifications}

때로는 애플리케이션의 "사용자"로 저장되지 않은 사람에게 알림을 보내야 할 수도 있습니다. `Notification` 파사드의 `route` 메서드를 사용하면, 알림을 전송하기 전에 임시 라우팅 정보를 지정할 수 있습니다:

```php
use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\Notification;

Notification::route('mail', 'taylor@example.com')
    ->route('vonage', '5555555555')
    ->route('slack', '#slack-channel')
    ->route('broadcast', [new Channel('channel-name')])
    ->notify(new InvoicePaid($invoice));
```

온디맨드 알림을 `mail` 라우트로 보낼 때 수신자의 이름을 제공하려면, 이메일 주소를 키로, 이름을 값으로 하는 배열을 전달할 수 있습니다:

```php
Notification::route('mail', [
    'barrett@example.com' => 'Barrett Blair',
])->notify(new InvoicePaid($invoice));
```

`routes` 메서드를 사용하면 여러 알림 채널에 대한 임시 라우팅 정보를 한 번에 제공할 수 있습니다:

```php
Notification::routes([
    'mail' => ['barrett@example.com' => 'Barrett Blair'],
    'vonage' => '5555555555',
])->notify(new InvoicePaid($invoice));
```


## 메일 알림 {#mail-notifications}


### 메일 메시지 포맷팅 {#formatting-mail-messages}

알림이 이메일로 전송될 수 있다면, 알림 클래스에 `toMail` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 받아 `Illuminate\Notifications\Messages\MailMessage` 인스턴스를 반환해야 합니다.

`MailMessage` 클래스는 트랜잭션 이메일 메시지를 쉽게 작성할 수 있는 몇 가지 간단한 메서드를 제공합니다. 메일 메시지는 텍스트 라인과 "콜 투 액션"을 포함할 수 있습니다. 예시 `toMail` 메서드를 살펴보겠습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    $url = url('/invoice/'.$this->invoice->id);

    return (new MailMessage)
        ->greeting('Hello!')
        ->line('One of your invoices has been paid!')
        ->lineIf($this->amount > 0, "Amount paid: {$this->amount}")
        ->action('View Invoice', $url)
        ->line('Thank you for using our application!');
}
```

> [!NOTE]
> `toMail` 메서드에서 `$this->invoice->id`를 사용하는 것을 볼 수 있습니다. 알림이 메시지를 생성하는 데 필요한 모든 데이터를 알림의 생성자에 전달할 수 있습니다.

이 예시에서는 인사말, 텍스트 라인, 콜 투 액션, 그리고 또 다른 텍스트 라인을 등록합니다. `MailMessage` 객체가 제공하는 이 메서드들로 간단하고 빠르게 트랜잭션 이메일을 포맷할 수 있습니다. 메일 채널은 메시지 구성 요소를 아름답고 반응형인 HTML 이메일 템플릿과 일반 텍스트 버전으로 변환합니다. 아래는 `mail` 채널이 생성한 이메일 예시입니다:

<img src="https://laravel.com/img/docs/notification-example-2.png">

> [!NOTE]
> 메일 알림을 보낼 때는 `config/app.php` 설정 파일의 `name` 옵션을 반드시 설정하세요. 이 값은 메일 알림 메시지의 헤더와 푸터에 사용됩니다.


#### 에러 메시지 {#error-messages}

일부 알림은 결제 실패 등 오류를 사용자에게 알립니다. 메시지를 작성할 때 `error` 메서드를 호출하여 메일 메시지가 오류와 관련 있음을 표시할 수 있습니다. `error` 메서드를 사용하면 콜 투 액션 버튼이 검정색 대신 빨간색으로 표시됩니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->error()
        ->subject('Invoice Payment Failed')
        ->line('...');
}
```


#### 기타 메일 알림 포맷팅 옵션 {#other-mail-notification-formatting-options}

알림 클래스에서 텍스트 "라인"을 정의하는 대신, `view` 메서드를 사용해 알림 이메일을 렌더링할 커스텀 템플릿을 지정할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)->view(
        'mail.invoice.paid', ['invoice' => $this->invoice]
    );
}
```

메일 메시지에 일반 텍스트 뷰를 지정하려면, 뷰 이름을 배열의 두 번째 요소로 `view` 메서드에 전달하면 됩니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)->view(
        ['mail.invoice.paid', 'mail.invoice.paid-text'],
        ['invoice' => $this->invoice]
    );
}
```

또는, 메시지에 일반 텍스트 뷰만 있다면 `text` 메서드를 사용할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)->text(
        'mail.invoice.paid-text', ['invoice' => $this->invoice]
    );
}
```


### 발신자 커스터마이징 {#customizing-the-sender}

기본적으로 이메일의 발신자/From 주소는 `config/mail.php` 설정 파일에 정의되어 있습니다. 하지만, 특정 알림에 대해 `from` 메서드를 사용해 발신자 주소를 지정할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->from('barrett@example.com', 'Barrett Blair')
        ->line('...');
}
```


### 수신자 커스터마이징 {#customizing-the-recipient}

`mail` 채널을 통해 알림을 보낼 때, 알림 시스템은 notifiable 엔티티에서 `email` 속성을 자동으로 찾습니다. 알림을 전달할 이메일 주소를 커스터마이징하려면, notifiable 엔티티에 `routeNotificationForMail` 메서드를 정의할 수 있습니다:

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
     * Route notifications for the mail channel.
     *
     * @return  array<string, string>|string
     */
    public function routeNotificationForMail(Notification $notification): array|string
    {
        // 이메일 주소만 반환...
        return $this->email_address;

        // 이메일 주소와 이름 반환...
        return [$this->email_address => $this->name];
    }
}
```


### 제목 커스터마이징 {#customizing-the-subject}

기본적으로 이메일의 제목은 알림 클래스명을 "Title Case"로 포맷한 값입니다. 예를 들어, 알림 클래스명이 `InvoicePaid`라면 이메일 제목은 `Invoice Paid`가 됩니다. 메시지에 다른 제목을 지정하려면, 메시지 작성 시 `subject` 메서드를 호출하면 됩니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Notification Subject')
        ->line('...');
}
```


### 메일러 커스터마이징 {#customizing-the-mailer}

기본적으로 이메일 알림은 `config/mail.php` 설정 파일에 정의된 기본 메일러를 사용해 전송됩니다. 하지만, 메시지 작성 시 `mailer` 메서드를 호출해 런타임에 다른 메일러를 지정할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->mailer('postmark')
        ->line('...');
}
```


### 템플릿 커스터마이징 {#customizing-the-templates}

메일 알림에 사용되는 HTML 및 일반 텍스트 템플릿을 커스터마이징하려면, 알림 패키지의 리소스를 퍼블리시하면 됩니다. 이 명령어를 실행하면 메일 알림 템플릿이 `resources/views/vendor/notifications` 디렉터리에 위치하게 됩니다:

```shell
php artisan vendor:publish --tag=laravel-notifications
```


### 첨부파일 {#mail-attachments}

이메일 알림에 첨부파일을 추가하려면, 메시지 작성 시 `attach` 메서드를 사용하세요. `attach` 메서드는 첫 번째 인자로 파일의 절대 경로를 받습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('Hello!')
        ->attach('/path/to/file');
}
```

> [!NOTE]
> 알림 메일 메시지의 `attach` 메서드는 [attachable 객체](/laravel/12.x/mail#attachable-objects)도 지원합니다. 자세한 내용은 [attachable 객체 문서](/laravel/12.x/mail#attachable-objects)를 참고하세요.

파일을 첨부할 때, 두 번째 인자로 배열을 전달하여 표시 이름이나 MIME 타입을 지정할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
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

메일러블 객체에서 파일을 첨부할 때와 달리, `attachFromStorage`를 사용해 저장소 디스크에서 직접 파일을 첨부할 수 없습니다. 대신, 저장소 디스크의 파일 절대 경로를 `attach` 메서드에 전달해야 합니다. 또는, `toMail` 메서드에서 [메일러블](/laravel/12.x/mail#generating-mailables)를 반환할 수도 있습니다:

```php
use App\Mail\InvoicePaid as InvoicePaidMailable;

/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): Mailable
{
    return (new InvoicePaidMailable($this->invoice))
        ->to($notifiable->email)
        ->attachFromStorage('/path/to/file');
}
```

필요하다면, `attachMany` 메서드를 사용해 여러 파일을 한 번에 첨부할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
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


#### Raw 데이터 첨부 {#raw-data-attachments}

`attachData` 메서드는 바이트 문자열을 첨부파일로 첨부할 때 사용합니다. `attachData` 호출 시 첨부파일에 할당할 파일명을 지정해야 합니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('Hello!')
        ->attachData($this->pdf, 'name.pdf', [
            'mime' => 'application/pdf',
        ]);
}
```


### 태그 및 메타데이터 추가 {#adding-tags-metadata}

Mailgun, Postmark 등 일부 서드파티 이메일 제공업체는 메시지 "태그"와 "메타데이터"를 지원합니다. 이를 통해 애플리케이션에서 보낸 이메일을 그룹화하고 추적할 수 있습니다. `tag` 및 `metadata` 메서드를 통해 이메일 메시지에 태그와 메타데이터를 추가할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->greeting('Comment Upvoted!')
        ->tag('upvote')
        ->metadata('comment_id', $this->comment->id);
}
```

Mailgun 드라이버를 사용하는 경우, [태그](https://documentation.mailgun.com/en/latest/user_manual.html#tagging-1) 및 [메타데이터](https://documentation.mailgun.com/en/latest/user_manual.html#attaching-data-to-messages)에 대한 자세한 내용은 Mailgun 문서를 참고하세요. Postmark의 [태그](https://postmarkapp.com/blog/tags-support-for-smtp) 및 [메타데이터](https://postmarkapp.com/support/article/1125-custom-metadata-faq) 지원에 대해서도 Postmark 문서를 참고할 수 있습니다.

Amazon SES를 사용해 이메일을 전송하는 경우, `metadata` 메서드를 사용해 메시지에 [SES "태그"](https://docs.aws.amazon.com/ses/latest/APIReference/API_MessageTag.html)를 첨부해야 합니다.


### Symfony 메시지 커스터마이징 {#customizing-the-symfony-message}

`MailMessage` 클래스의 `withSymfonyMessage` 메서드를 사용하면, 메시지 전송 전에 Symfony Message 인스턴스와 함께 호출되는 클로저를 등록할 수 있습니다. 이를 통해 메시지를 전송 전에 깊이 있게 커스터마이징할 수 있습니다:

```php
use Symfony\Component\Mime\Email;

/**
 * Get the mail representation of the notification.
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


### 메일러블 사용 {#using-mailables}

필요하다면, 알림의 `toMail` 메서드에서 전체 [메일러블 객체](/laravel/12.x/mail)를 반환할 수 있습니다. `MailMessage` 대신 `Mailable`을 반환할 때는, 메일러블 객체의 `to` 메서드를 사용해 메시지 수신자를 지정해야 합니다:

```php
use App\Mail\InvoicePaid as InvoicePaidMailable;
use Illuminate\Mail\Mailable;

/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): Mailable
{
    return (new InvoicePaidMailable($this->invoice))
        ->to($notifiable->email);
}
```


#### 메일러블과 온디맨드 알림 {#mailables-and-on-demand-notifications}

[온디맨드 알림](#on-demand-notifications)을 전송하는 경우, `toMail` 메서드에 전달되는 `$notifiable` 인스턴스는 `Illuminate\Notifications\AnonymousNotifiable`의 인스턴스입니다. 이 객체는 온디맨드 알림을 보낼 이메일 주소를 가져올 수 있는 `routeNotificationFor` 메서드를 제공합니다:

```php
use App\Mail\InvoicePaid as InvoicePaidMailable;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Mail\Mailable;

/**
 * Get the mail representation of the notification.
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

메일 알림 템플릿을 디자인할 때, 일반 Blade 템플릿처럼 렌더링된 메일 메시지를 브라우저에서 빠르게 미리보는 것이 편리합니다. 이를 위해, Laravel은 메일 알림이 생성한 모든 메일 메시지를 라우트 클로저나 컨트롤러에서 직접 반환할 수 있도록 허용합니다. `MailMessage`가 반환되면, 브라우저에서 렌더링되어 실제 이메일 주소로 전송하지 않고도 디자인을 빠르게 미리볼 수 있습니다:

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

마크다운 메일 알림을 사용하면, 미리 만들어진 메일 알림 템플릿의 이점을 누리면서도 더 길고 커스터마이징된 메시지를 자유롭게 작성할 수 있습니다. 메시지가 마크다운으로 작성되므로, Laravel은 메시지에 대해 아름답고 반응형인 HTML 템플릿을 렌더링하고, 일반 텍스트 버전도 자동으로 생성합니다.


### 메시지 생성 {#generating-the-message}

마크다운 템플릿이 포함된 알림을 생성하려면, `make:notification` 아티즌 명령어의 `--markdown` 옵션을 사용하세요:

```shell
php artisan make:notification InvoicePaid --markdown=mail.invoice.paid
```

다른 메일 알림과 마찬가지로, 마크다운 템플릿을 사용하는 알림도 알림 클래스에 `toMail` 메서드를 정의해야 합니다. 하지만, 알림을 구성할 때 `line`과 `action` 메서드 대신, 사용할 마크다운 템플릿의 이름을 `markdown` 메서드에 지정하세요. 템플릿에서 사용할 데이터를 배열로 두 번째 인자에 전달할 수 있습니다:

```php
/**
 * Get the mail representation of the notification.
 */
public function toMail(object $notifiable): MailMessage
{
    $url = url('/invoice/'.$this->invoice->id);

    return (new MailMessage)
        ->subject('Invoice Paid')
        ->markdown('mail.invoice.paid', ['url' => $url]);
}
```


### 메시지 작성 {#writing-the-message}

마크다운 메일 알림은 Blade 컴포넌트와 마크다운 문법을 조합해, Laravel의 미리 제작된 알림 컴포넌트를 활용하면서도 쉽게 알림을 작성할 수 있습니다:

```blade
<x-mail::message>
# Invoice Paid

Your invoice has been paid!

<x-mail::button :url="$url">
View Invoice
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
```

> [!NOTE]
> 마크다운 이메일을 작성할 때는 과도한 들여쓰기를 사용하지 마세요. 마크다운 표준에 따라, 마크다운 파서는 들여쓰기된 내용을 코드 블록으로 렌더링합니다.


#### 버튼 컴포넌트 {#button-component}

버튼 컴포넌트는 가운데 정렬된 버튼 링크를 렌더링합니다. 이 컴포넌트는 `url`과 선택적 `color` 인자를 받습니다. 지원되는 색상은 `primary`, `green`, `red`입니다. 원하는 만큼 버튼 컴포넌트를 알림에 추가할 수 있습니다:

```blade
<x-mail::button :url="$url" color="green">
View Invoice
</x-mail::button>
```


#### 패널 컴포넌트 {#panel-component}

패널 컴포넌트는 지정된 텍스트 블록을 알림의 나머지 부분과 약간 다른 배경색의 패널에 렌더링합니다. 이를 통해 특정 텍스트 블록에 주의를 끌 수 있습니다:

```blade
<x-mail::panel>
This is the panel content.
</x-mail::panel>
```


#### 테이블 컴포넌트 {#table-component}

테이블 컴포넌트를 사용하면 마크다운 테이블을 HTML 테이블로 변환할 수 있습니다. 이 컴포넌트는 마크다운 테이블을 콘텐츠로 받습니다. 테이블 열 정렬은 기본 마크다운 테이블 정렬 문법을 사용해 지원됩니다:

```blade
<x-mail::table>
| Laravel       | Table         | Example       |
| ------------- | :-----------: | ------------: |
| Col 2 is      | Centered      | $10           |
| Col 3 is      | Right-Aligned | $20           |
</x-mail::table>
```


### 컴포넌트 커스터마이징 {#customizing-the-components}

마크다운 알림 컴포넌트를 내 애플리케이션으로 내보내 커스터마이징할 수 있습니다. 컴포넌트를 내보내려면, `vendor:publish` 아티즌 명령어로 `laravel-mail` 에셋 태그를 퍼블리시하세요:

```shell
php artisan vendor:publish --tag=laravel-mail
```

이 명령어는 마크다운 메일 컴포넌트를 `resources/views/vendor/mail` 디렉터리에 퍼블리시합니다. `mail` 디렉터리에는 각각의 컴포넌트에 대한 `html`과 `text` 디렉터리가 포함되어 있습니다. 이 컴포넌트들은 자유롭게 커스터마이징할 수 있습니다.


#### CSS 커스터마이징 {#customizing-the-css}

컴포넌트를 내보낸 후, `resources/views/vendor/mail/html/themes` 디렉터리에는 `default.css` 파일이 있습니다. 이 파일의 CSS를 커스터마이징하면, 스타일이 마크다운 알림의 HTML 표현에 자동으로 인라인됩니다.

Laravel의 마크다운 컴포넌트에 대해 완전히 새로운 테마를 만들고 싶다면, CSS 파일을 `html/themes` 디렉터리에 추가하세요. 파일을 저장한 후, `mail` 설정 파일의 `theme` 옵션을 새 테마 이름으로 업데이트하세요.

개별 알림에 대해 테마를 커스터마이징하려면, 알림의 메일 메시지 작성 시 `theme` 메서드를 호출하세요. `theme` 메서드는 알림 전송 시 사용할 테마 이름을 받습니다:

```php
/**
 * Get the mail representation of the notification.
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


### 사전 준비 {#database-prerequisites}

`database` 알림 채널은 알림 정보를 데이터베이스 테이블에 저장합니다. 이 테이블에는 알림 타입과 알림을 설명하는 JSON 데이터 구조가 포함됩니다.

이 테이블을 쿼리해 애플리케이션의 사용자 인터페이스에 알림을 표시할 수 있습니다. 하지만, 그 전에 알림을 저장할 데이터베이스 테이블을 생성해야 합니다. `make:notifications-table` 명령어를 사용해 적절한 테이블 스키마를 가진 [마이그레이션](/laravel/12.x/migrations)을 생성할 수 있습니다:

```shell
php artisan make:notifications-table

php artisan migrate
```

> [!NOTE]
> notifiable 모델이 [UUID 또는 ULID 기본 키](/laravel/12.x/eloquent#uuid-and-ulid-keys)를 사용하는 경우, 알림 테이블 마이그레이션에서 `morphs` 메서드를 [uuidMorphs](/laravel/12.x/migrations#column-method-uuidMorphs) 또는 [ulidMorphs](/laravel/12.x/migrations#column-method-ulidMorphs)로 교체해야 합니다.


### 데이터베이스 알림 포맷팅 {#formatting-database-notifications}

알림이 데이터베이스 테이블에 저장될 수 있다면, 알림 클래스에 `toDatabase` 또는 `toArray` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 받아 평범한 PHP 배열을 반환해야 합니다. 반환된 배열은 JSON으로 인코딩되어 `notifications` 테이블의 `data` 컬럼에 저장됩니다. 예시 `toArray` 메서드는 다음과 같습니다:

```php
/**
 * Get the array representation of the notification.
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

알림이 애플리케이션의 데이터베이스에 저장되면, `type` 컬럼은 기본적으로 알림의 클래스명으로 설정되고, `read_at` 컬럼은 `null`이 됩니다. 하지만, 알림 클래스에 `databaseType` 및 `initialDatabaseReadAtValue` 메서드를 정의해 이 동작을 커스터마이징할 수 있습니다:

```php
use Illuminate\Support\Carbon;

/**
 * Get the notification's database type.
 */
public function databaseType(object $notifiable): string
{
    return 'invoice-paid';
}

/**
 * Get the initial value for the "read_at" column.
 */
public function initialDatabaseReadAtValue(): ?Carbon
{
    return null;
}
```


#### `toDatabase` vs. `toArray` {#todatabase-vs-toarray}

`toArray` 메서드는 `broadcast` 채널에서도 프론트엔드로 브로드캐스트할 데이터를 결정하는 데 사용됩니다. `database`와 `broadcast` 채널에 대해 서로 다른 배열 표현이 필요하다면, `toArray` 대신 `toDatabase` 메서드를 정의하세요.


### 알림 접근 {#accessing-the-notifications}

알림이 데이터베이스에 저장되면, notifiable 엔티티에서 알림에 쉽게 접근할 수 있어야 합니다. Laravel의 기본 `App\Models\User` 모델에 포함된 `Illuminate\Notifications\Notifiable` 트레이트에는 엔티티의 알림을 반환하는 `notifications` [Eloquent 관계](/laravel/12.x/eloquent-relationships)가 포함되어 있습니다. 알림을 가져오려면, 다른 Eloquent 관계처럼 이 메서드에 접근하면 됩니다. 기본적으로 알림은 `created_at` 타임스탬프 기준으로 최신 순으로 정렬됩니다:

```php
$user = App\Models\User::find(1);

foreach ($user->notifications as $notification) {
    echo $notification->type;
}
```

"읽지 않은" 알림만 가져오려면, `unreadNotifications` 관계를 사용할 수 있습니다. 이 역시 `created_at` 타임스탬프 기준으로 최신 순으로 정렬됩니다:

```php
$user = App\Models\User::find(1);

foreach ($user->unreadNotifications as $notification) {
    echo $notification->type;
}
```

> [!NOTE]
> 자바스크립트 클라이언트에서 알림에 접근하려면, notifiable 엔티티(예: 현재 사용자)의 알림을 반환하는 알림 컨트롤러를 정의해야 합니다. 그런 다음, 자바스크립트 클라이언트에서 해당 컨트롤러의 URL로 HTTP 요청을 보낼 수 있습니다.


### 알림 읽음 처리 {#marking-notifications-as-read}

일반적으로 사용자가 알림을 확인하면 "읽음"으로 표시하고 싶을 것입니다. `Illuminate\Notifications\Notifiable` 트레이트는 알림의 데이터베이스 레코드의 `read_at` 컬럼을 업데이트하는 `markAsRead` 메서드를 제공합니다:

```php
$user = App\Models\User::find(1);

foreach ($user->unreadNotifications as $notification) {
    $notification->markAsRead();
}
```

각 알림을 반복하는 대신, 알림 컬렉션에 직접 `markAsRead` 메서드를 사용할 수도 있습니다:

```php
$user->unreadNotifications->markAsRead();
```

또는, 데이터베이스에서 알림을 가져오지 않고도 모든 알림을 읽음 처리하려면 대량 업데이트 쿼리를 사용할 수 있습니다:

```php
$user = App\Models\User::find(1);

$user->unreadNotifications()->update(['read_at' => now()]);
```

알림을 테이블에서 완전히 제거하려면 `delete` 메서드를 사용할 수 있습니다:

```php
$user->notifications()->delete();
```


## 브로드캐스트 알림 {#broadcast-notifications}


### 사전 준비 {#broadcast-prerequisites}

브로드캐스트 알림을 전송하기 전에, Laravel의 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 서비스를 설정하고 익숙해져야 합니다. 이벤트 브로드캐스팅은 자바스크립트 기반 프론트엔드에서 서버 측 Laravel 이벤트에 반응할 수 있는 방법을 제공합니다.


### 브로드캐스트 알림 포맷팅 {#formatting-broadcast-notifications}

`broadcast` 채널은 Laravel의 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 서비스를 사용해 알림을 브로드캐스트하므로, 자바스크립트 기반 프론트엔드에서 실시간으로 알림을 받을 수 있습니다. 알림이 브로드캐스트를 지원한다면, 알림 클래스에 `toBroadcast` 메서드를 정의할 수 있습니다. 이 메서드는 `$notifiable` 엔티티를 받아 `BroadcastMessage` 인스턴스를 반환해야 합니다. `toBroadcast` 메서드가 없으면, 브로드캐스트할 데이터를 수집하기 위해 `toArray` 메서드가 사용됩니다. 반환된 데이터는 JSON으로 인코딩되어 자바스크립트 프론트엔드로 브로드캐스트됩니다. 예시 `toBroadcast` 메서드는 다음과 같습니다:

```php
use Illuminate\Notifications\Messages\BroadcastMessage;

/**
 * Get the broadcastable representation of the notification.
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

모든 브로드캐스트 알림은 브로드캐스트를 위해 큐에 들어갑니다. 브로드캐스트 작업을 큐잉할 때 사용할 큐 연결이나 큐 이름을 설정하려면, `BroadcastMessage`의 `onConnection` 및 `onQueue` 메서드를 사용할 수 있습니다:

```php
return (new BroadcastMessage($data))
    ->onConnection('sqs')
    ->onQueue('broadcasts');
```


#### 알림 타입 커스터마이징 {#customizing-the-notification-type}

지정한 데이터 외에도, 모든 브로드캐스트 알림에는 알림의 전체 클래스명이 포함된 `type` 필드가 있습니다. 알림 `type`을 커스터마이징하려면, 알림 클래스에 `broadcastType` 메서드를 정의할 수 있습니다:

```php
/**
 * Get the type of the notification being broadcast.
 */
public function broadcastType(): string
{
    return 'broadcast.message';
}
```


### 알림 수신 대기 {#listening-for-notifications}

알림은 `{notifiable}.{id}` 규칙을 사용한 프라이빗 채널에서 브로드캐스트됩니다. 예를 들어, ID가 `1`인 `App\Models\User` 인스턴스에 알림을 보내면, 알림은 `App.Models.User.1` 프라이빗 채널에서 브로드캐스트됩니다. [Laravel Echo](/laravel/12.x/broadcasting#client-side-installation)를 사용할 때, `notification` 메서드를 사용해 채널에서 쉽게 알림을 수신할 수 있습니다:

```js
Echo.private('App.Models.User.' + userId)
    .notification((notification) => {
        console.log(notification.type);
    });
```


#### React 또는 Vue 사용하기 {#using-react-or-vue}

Laravel Echo는 알림을 수신하기 쉽게 해주는 React 및 Vue 훅을 제공합니다. 시작하려면, 알림을 수신하는 데 사용되는 `useEchoNotification` 훅을 호출하세요. 이 훅은 컴포넌트가 언마운트될 때 자동으로 채널을 떠납니다:
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
기본적으로 훅은 모든 알림을 수신합니다. 수신할 알림 타입을 지정하려면, `useEchoNotification`에 문자열 또는 타입 배열을 전달할 수 있습니다:
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
알림 페이로드 데이터의 형태를 지정해 타입 안정성과 편집 편의성을 높일 수도 있습니다:

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

엔티티의 브로드캐스트 알림이 브로드캐스트될 채널을 커스터마이징하려면, notifiable 엔티티에 `receivesBroadcastNotificationsOn` 메서드를 정의할 수 있습니다:

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
     * The channels the user receives notification broadcasts on.
     */
    public function receivesBroadcastNotificationsOn(): string
    {
        return 'users.'.$this->id;
    }
}
```


## SMS 알림 {#sms-notifications}


### 사전 준비 {#sms-prerequisites}

Laravel에서 SMS 알림 전송은 [Vonage](https://www.vonage.com/) (이전 Nexmo)로 구동됩니다. Vonage를 통해 알림을 보내려면, `laravel/vonage-notification-channel`과 `guzzlehttp/guzzle` 패키지를 설치해야 합니다:

```shell
composer require laravel/vonage-notification-channel guzzlehttp/guzzle
```

이 패키지에는 [설정 파일](https://github.com/laravel/vonage-notification-channel/blob/3.x/config/vonage.php)이 포함되어 있습니다. 하지만, 이 설정 파일을 애플리케이션에 내보낼 필요는 없습니다. `VONAGE_KEY`와 `VONAGE_SECRET` 환경 변수를 사용해 Vonage 공개 및 비밀 키를 정의할 수 있습니다.

키를 정의한 후, SMS 메시지의 기본 발신 번호를 지정하는 `VONAGE_SMS_FROM` 환경 변수를 설정해야 합니다. 이 번호는 Vonage 콘트롤 패널에서 생성할 수 있습니다:

```ini
VONAGE_SMS_FROM=15556666666
```


### SMS 알림 포맷팅 {#formatting-sms-notifications}

알림이 SMS로 전송될 수 있다면, 알림 클래스에 `toVonage` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 받아 `Illuminate\Notifications\Messages\VonageMessage` 인스턴스를 반환해야 합니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * Get the Vonage / SMS representation of the notification.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('Your SMS message content');
}
```


#### 유니코드 콘텐츠 {#unicode-content}

SMS 메시지에 유니코드 문자가 포함될 경우, `VonageMessage` 인스턴스를 생성할 때 `unicode` 메서드를 호출해야 합니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * Get the Vonage / SMS representation of the notification.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('Your unicode message')
        ->unicode();
}
```


### "From" 번호 커스터마이징 {#customizing-the-from-number}

일부 알림을 `VONAGE_SMS_FROM` 환경 변수에 지정된 번호와 다른 번호로 보내고 싶다면, `VonageMessage` 인스턴스에서 `from` 메서드를 호출할 수 있습니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * Get the Vonage / SMS representation of the notification.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->content('Your SMS message content')
        ->from('15554443333');
}
```


### 클라이언트 참조 추가 {#adding-a-client-reference}

사용자, 팀, 클라이언트별로 비용을 추적하고 싶다면, 알림에 "클라이언트 참조"를 추가할 수 있습니다. Vonage는 이 클라이언트 참조를 사용해 특정 고객의 SMS 사용량을 더 잘 파악할 수 있도록 리포트를 생성할 수 있습니다. 클라이언트 참조는 최대 40자까지의 문자열입니다:

```php
use Illuminate\Notifications\Messages\VonageMessage;

/**
 * Get the Vonage / SMS representation of the notification.
 */
public function toVonage(object $notifiable): VonageMessage
{
    return (new VonageMessage)
        ->clientReference((string) $notifiable->id)
        ->content('Your SMS message content');
}
```


### SMS 알림 라우팅 {#routing-sms-notifications}

Vonage 알림을 올바른 전화번호로 라우팅하려면, notifiable 엔티티에 `routeNotificationForVonage` 메서드를 정의하세요:

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
     * Route notifications for the Vonage channel.
     */
    public function routeNotificationForVonage(Notification $notification): string
    {
        return $this->phone_number;
    }
}
```


## 슬랙 알림 {#slack-notifications}


### 사전 준비 {#slack-prerequisites}

슬랙 알림을 보내기 전에, Composer를 통해 슬랙 알림 채널을 설치해야 합니다:

```shell
composer require laravel/slack-notification-channel
```

또한, 슬랙 워크스페이스용 [Slack App](https://api.slack.com/apps?new_app=1)을 생성해야 합니다.

앱을 생성한 워크스페이스에만 알림을 보낼 경우, 앱에 `chat:write`, `chat:write.public`, `chat:write.customize` 스코프가 있는지 확인하세요. 이 스코프는 슬랙의 "OAuth & Permissions" 앱 관리 탭에서 추가할 수 있습니다.

다음으로, 앱의 "Bot User OAuth Token"을 복사해 애플리케이션의 `services.php` 설정 파일의 `slack` 설정 배열에 넣으세요. 이 토큰은 슬랙의 "OAuth & Permissions" 탭에서 찾을 수 있습니다:

```php
'slack' => [
    'notifications' => [
        'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
        'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
    ],
],
```


#### 앱 배포 {#slack-app-distribution}

애플리케이션이 사용자 소유의 외부 슬랙 워크스페이스에 알림을 보낼 경우, 앱을 슬랙을 통해 "배포"해야 합니다. 앱 배포는 슬랙의 "Manage Distribution" 탭에서 관리할 수 있습니다. 앱이 배포되면, [Socialite](/laravel/12.x/socialite)를 사용해 [슬랙 봇 토큰](/laravel/12.x/socialite#slack-bot-scopes)을 사용자 대신 얻을 수 있습니다.


### 슬랙 알림 포맷팅 {#formatting-slack-notifications}

알림이 슬랙 메시지로 전송될 수 있다면, 알림 클래스에 `toSlack` 메서드를 정의해야 합니다. 이 메서드는 `$notifiable` 엔티티를 받아 `Illuminate\Notifications\Slack\SlackMessage` 인스턴스를 반환해야 합니다. [Slack의 Block Kit API](https://api.slack.com/block-kit)를 사용해 풍부한 알림을 구성할 수 있습니다. 아래 예시는 [Slack의 Block Kit builder](https://app.slack.com/block-kit-builder/T01KWS6K23Z#%7B%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Invoice%20Paid%22%7D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22plain_text%22,%22text%22:%22Customer%20%231234%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22An%20invoice%20has%20been%20paid.%22%7D,%22fields%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Invoice%20No:*%5Cn1000%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Invoice%20Recipient:*%5Cntaylor@laravel.com%22%7D%5D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Congratulations!%22%7D%7D%5D%7D)에서 미리볼 수 있습니다:

```php
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\BlockKit\Composites\ConfirmObject;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * Get the Slack representation of the notification.
 */
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('One of your invoices has been paid!')
        ->headerBlock('Invoice Paid')
        ->contextBlock(function (ContextBlock $block) {
            $block->text('Customer #1234');
        })
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('An invoice has been paid.');
            $block->field("*Invoice No:*\n1000")->markdown();
            $block->field("*Invoice Recipient:*\ntaylor@laravel.com")->markdown();
        })
        ->dividerBlock()
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('Congratulations!');
        });
}
```


#### Slack의 Block Kit Builder 템플릿 사용 {#using-slacks-block-kit-builder-template}

Block Kit 메시지를 구성할 때 유창한 메시지 빌더 메서드 대신, Slack의 Block Kit Builder에서 생성한 원시 JSON 페이로드를 `usingBlockKitTemplate` 메서드에 전달할 수 있습니다:

```php
use Illuminate\Notifications\Slack\SlackMessage;
use Illuminate\Support\Str;

/**
 * Get the Slack representation of the notification.
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


### 슬랙 상호작용 {#slack-interactivity}

슬랙의 Block Kit 알림 시스템은 [사용자 상호작용 처리](https://api.slack.com/interactivity/handling)와 같은 강력한 기능을 제공합니다. 이 기능을 사용하려면, Slack App에서 "Interactivity"를 활성화하고, 애플리케이션이 제공하는 URL을 "Request URL"로 설정해야 합니다. 이 설정은 슬랙의 "Interactivity & Shortcuts" 앱 관리 탭에서 관리할 수 있습니다.

아래 예시는 `actionsBlock` 메서드를 사용합니다. 슬랙은 버튼을 클릭한 사용자, 클릭된 버튼의 ID 등 다양한 정보를 담은 페이로드와 함께 "Request URL"로 `POST` 요청을 보냅니다. 애플리케이션은 이 페이로드를 기반으로 적절한 동작을 결정할 수 있습니다. 또한, [요청이 슬랙에서 온 것인지 검증](https://api.slack.com/authentication/verifying-requests-from-slack)해야 합니다:

```php
use Illuminate\Notifications\Slack\BlockKit\Blocks\ActionsBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * Get the Slack representation of the notification.
 */
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('One of your invoices has been paid!')
        ->headerBlock('Invoice Paid')
        ->contextBlock(function (ContextBlock $block) {
            $block->text('Customer #1234');
        })
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('An invoice has been paid.');
        })
        ->actionsBlock(function (ActionsBlock $block) {
             // ID는 기본적으로 "button_acknowledge_invoice"...
            $block->button('Acknowledge Invoice')->primary();

            // ID를 수동으로 설정...
            $block->button('Deny')->danger()->id('deny_invoice');
        });
}
```


#### 확인 모달 {#slack-confirmation-modals}

사용자가 동작을 수행하기 전에 확인을 요구하고 싶다면, 버튼을 정의할 때 `confirm` 메서드를 호출할 수 있습니다. `confirm` 메서드는 메시지와 `ConfirmObject` 인스턴스를 받는 클로저를 인자로 받습니다:

```php
use Illuminate\Notifications\Slack\BlockKit\Blocks\ActionsBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\BlockKit\Composites\ConfirmObject;
use Illuminate\Notifications\Slack\SlackMessage;

/**
 * Get the Slack representation of the notification.
 */
public function toSlack(object $notifiable): SlackMessage
{
    return (new SlackMessage)
        ->text('One of your invoices has been paid!')
        ->headerBlock('Invoice Paid')
        ->contextBlock(function (ContextBlock $block) {
            $block->text('Customer #1234');
        })
        ->sectionBlock(function (SectionBlock $block) {
            $block->text('An invoice has been paid.');
        })
        ->actionsBlock(function (ActionsBlock $block) {
            $block->button('Acknowledge Invoice')
                ->primary()
                ->confirm(
                    'Acknowledge the payment and send a thank you email?',
                    function (ConfirmObject $dialog) {
                        $dialog->confirm('Yes');
                        $dialog->deny('No');
                    }
                );
        });
}
```


#### 슬랙 블록 검사 {#inspecting-slack-blocks}

구성한 블록을 빠르게 확인하고 싶다면, `SlackMessage` 인스턴스에서 `dd` 메서드를 호출할 수 있습니다. `dd` 메서드는 Slack의 [Block Kit Builder](https://app.slack.com/block-kit-builder/)로 연결되는 URL을 생성해 덤프합니다. 이 URL에서 페이로드와 알림을 브라우저에서 미리볼 수 있습니다. 원시 페이로드를 덤프하려면 `dd` 메서드에 `true`를 전달하세요:

```php
return (new SlackMessage)
    ->text('One of your invoices has been paid!')
    ->headerBlock('Invoice Paid')
    ->dd();
```


### 슬랙 알림 라우팅 {#routing-slack-notifications}

슬랙 알림을 적절한 슬랙 팀과 채널로 라우팅하려면, notifiable 모델에 `routeNotificationForSlack` 메서드를 정의하세요. 이 메서드는 다음 중 하나를 반환할 수 있습니다:

- `null` - 알림 자체에 설정된 채널로 라우팅을 위임합니다. 알림 내에서 `SlackMessage`의 `to` 메서드를 사용해 채널을 설정할 수 있습니다.
- 알림을 보낼 슬랙 채널을 지정하는 문자열(예: `#support-channel`)
- OAuth 토큰과 채널명을 지정할 수 있는 `SlackRoute` 인스턴스(예: `SlackRoute::make($this->slack_channel, $this->slack_token)`). 이 방법은 외부 워크스페이스로 알림을 보낼 때 사용합니다.

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
     * Route notifications for the Slack channel.
     */
    public function routeNotificationForSlack(Notification $notification): mixed
    {
        return '#support-channel';
    }
}
```


### 외부 슬랙 워크스페이스 알림 {#notifying-external-slack-workspaces}

> [!NOTE]
> 외부 슬랙 워크스페이스로 알림을 보내기 전에, Slack App이 [배포](#slack-app-distribution)되어 있어야 합니다.

물론, 애플리케이션 사용자 소유의 슬랙 워크스페이스로 알림을 보내고 싶을 때가 많습니다. 이를 위해서는 먼저 사용자의 슬랙 OAuth 토큰을 얻어야 합니다. 다행히도, [Laravel Socialite](/laravel/12.x/socialite)는 슬랙 드라이버를 포함하고 있어, 애플리케이션 사용자를 슬랙으로 쉽게 인증하고 [봇 토큰](/laravel/12.x/socialite#slack-bot-scopes)을 얻을 수 있습니다.

봇 토큰을 얻어 애플리케이션 데이터베이스에 저장했다면, `SlackRoute::make` 메서드를 사용해 사용자의 워크스페이스로 알림을 라우팅할 수 있습니다. 또한, 애플리케이션은 사용자가 알림을 보낼 채널을 지정할 수 있는 기회를 제공해야 할 수도 있습니다:

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
     * Route notifications for the Slack channel.
     */
    public function routeNotificationForSlack(Notification $notification): mixed
    {
        return SlackRoute::make($this->slack_channel, $this->slack_token);
    }
}
```


## 알림 현지화 {#localizing-notifications}

Laravel은 알림을 HTTP 요청의 현재 로케일과 다른 로케일로 전송할 수 있으며, 알림이 큐잉된 경우에도 이 로케일을 기억합니다.

이를 위해, `Illuminate\Notifications\Notification` 클래스는 원하는 언어를 설정할 수 있는 `locale` 메서드를 제공합니다. 알림이 평가될 때 애플리케이션은 이 로케일로 변경되었다가, 평가가 끝나면 이전 로케일로 되돌아갑니다:

```php
$user->notify((new InvoicePaid($invoice))->locale('es'));
```

여러 notifiable 엔트리에 대해 현지화하려면, `Notification` 파사드를 사용할 수 있습니다:

```php
Notification::locale('es')->send(
    $users, new InvoicePaid($invoice)
);
```


### 사용자 선호 로케일 {#user-preferred-locales}

애플리케이션이 각 사용자의 선호 로케일을 저장하는 경우가 있습니다. notifiable 모델에 `HasLocalePreference` 계약을 구현하면, 알림 전송 시 이 저장된 로케일을 사용하도록 Laravel에 지시할 수 있습니다:

```php
use Illuminate\Contracts\Translation\HasLocalePreference;

class User extends Model implements HasLocalePreference
{
    /**
     * Get the user's preferred locale.
     */
    public function preferredLocale(): string
    {
        return $this->locale;
    }
}
```

인터페이스를 구현하면, Laravel은 알림과 메일러블을 모델에 전송할 때 자동으로 선호 로케일을 사용합니다. 따라서 이 인터페이스를 사용할 때는 `locale` 메서드를 호출할 필요가 없습니다:

```php
$user->notify(new InvoicePaid($invoice));
```


## 테스트 {#testing}

`Notification` 파사드의 `fake` 메서드를 사용해 알림 전송을 방지할 수 있습니다. 일반적으로 알림 전송은 실제로 테스트하는 코드와 관련이 없습니다. 대부분의 경우, Laravel이 특정 알림을 전송하도록 지시받았는지만 단순히 검증하면 충분합니다.

`Notification` 파사드의 `fake` 메서드를 호출한 후, 알림이 사용자에게 전송되었는지, 알림이 받은 데이터를 검사할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Notifications\OrderShipped;
use Illuminate\Support\Facades\Notification;

test('orders can be shipped', function () {
    Notification::fake();

    // 주문 배송 수행...

    // 알림이 전송되지 않았는지 확인...
    Notification::assertNothingSent();

    // 주어진 사용자에게 알림이 전송되었는지 확인...
    Notification::assertSentTo(
        [$user], OrderShipped::class
    );

    // 알림이 전송되지 않았는지 확인...
    Notification::assertNotSentTo(
        [$user], AnotherNotification::class
    );

    // 주어진 개수만큼 알림이 전송되었는지 확인...
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

        // 주문 배송 수행...

        // 알림이 전송되지 않았는지 확인...
        Notification::assertNothingSent();

        // 주어진 사용자에게 알림이 전송되었는지 확인...
        Notification::assertSentTo(
            [$user], OrderShipped::class
        );

        // 알림이 전송되지 않았는지 확인...
        Notification::assertNotSentTo(
            [$user], AnotherNotification::class
        );

        // 주어진 개수만큼 알림이 전송되었는지 확인...
        Notification::assertCount(3);
    }
}
```
:::
`assertSentTo` 또는 `assertNotSentTo` 메서드에 클로저를 전달해, 주어진 "진리 테스트"를 통과하는 알림이 전송되었는지 검증할 수 있습니다. 하나 이상의 알림이 진리 테스트를 통과하면 검증이 성공합니다:

```php
Notification::assertSentTo(
    $user,
    function (OrderShipped $notification, array $channels) use ($order) {
        return $notification->order->id === $order->id;
    }
);
```


#### 온디맨드 알림 {#on-demand-notifications-1}

테스트하는 코드가 [온디맨드 알림](#on-demand-notifications)을 전송한다면, `assertSentOnDemand` 메서드를 사용해 온디맨드 알림이 전송되었는지 테스트할 수 있습니다:

```php
Notification::assertSentOnDemand(OrderShipped::class);
```

`assertSentOnDemand` 메서드의 두 번째 인자로 클로저를 전달해, 온디맨드 알림이 올바른 "route" 주소로 전송되었는지 확인할 수 있습니다:

```php
Notification::assertSentOnDemand(
    OrderShipped::class,
    function (OrderShipped $notification, array $channels, object $notifiable) use ($user) {
        return $notifiable->routes['mail'] === $user->email;
    }
);
```


## 알림 이벤트 {#notification-events}


#### 알림 전송 이벤트 {#notification-sending-event}

알림이 전송될 때, 알림 시스템은 `Illuminate\Notifications\Events\NotificationSending` 이벤트를 디스패치합니다. 이 이벤트에는 "notifiable" 엔티티와 알림 인스턴스 자체가 포함됩니다. 애플리케이션에서 이 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Notifications\Events\NotificationSending;

class CheckNotificationStatus
{
    /**
     * Handle the event.
     */
    public function handle(NotificationSending $event): void
    {
        // ...
    }
}
```

`NotificationSending` 이벤트의 이벤트 리스너에서 `handle` 메서드가 `false`를 반환하면, 알림이 전송되지 않습니다:

```php
/**
 * Handle the event.
 */
public function handle(NotificationSending $event): bool
{
    return false;
}
```

이벤트 리스너 내에서, 이벤트의 `notifiable`, `notification`, `channel` 속성에 접근해 알림 수신자나 알림 자체에 대한 정보를 얻을 수 있습니다:

```php
/**
 * Handle the event.
 */
public function handle(NotificationSending $event): void
{
    // $event->channel
    // $event->notifiable
    // $event->notification
}
```


#### 알림 전송 완료 이벤트 {#notification-sent-event}

알림이 전송되면, 알림 시스템은 `Illuminate\Notifications\Events\NotificationSent` [이벤트](/laravel/12.x/events)를 디스패치합니다. 이 이벤트에는 "notifiable" 엔티티와 알림 인스턴스 자체가 포함됩니다. 애플리케이션에서 이 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Notifications\Events\NotificationSent;

class LogNotification
{
    /**
     * Handle the event.
     */
    public function handle(NotificationSent $event): void
    {
        // ...
    }
}
```

이벤트 리스너 내에서, 이벤트의 `notifiable`, `notification`, `channel`, `response` 속성에 접근해 알림 수신자나 알림 자체에 대한 정보를 얻을 수 있습니다:

```php
/**
 * Handle the event.
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

Laravel은 몇 가지 알림 채널을 기본 제공하지만, 다른 채널을 통해 알림을 전송하는 드라이버를 직접 작성할 수도 있습니다. Laravel에서는 이를 간단하게 만들 수 있습니다. 시작하려면, `send` 메서드를 포함하는 클래스를 정의하세요. 이 메서드는 `$notifiable`과 `$notification` 두 인자를 받아야 합니다.

`send` 메서드 내에서, 알림의 메서드를 호출해 해당 채널이 이해할 수 있는 메시지 객체를 가져온 후, 원하는 방식으로 `$notifiable` 인스턴스에 알림을 전송할 수 있습니다:

```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class VoiceChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        $message = $notification->toVoice($notifiable);

        // $notifiable 인스턴스에 알림 전송...
    }
}
```

알림 채널 클래스가 정의되면, 알림의 `via` 메서드에서 클래스명을 반환할 수 있습니다. 이 예시에서, 알림의 `toVoice` 메서드는 음성 메시지를 표현하는 원하는 객체를 반환할 수 있습니다. 예를 들어, 이러한 메시지를 표현하는 자체 `VoiceMessage` 클래스를 정의할 수 있습니다:

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
     * Get the notification channels.
     */
    public function via(object $notifiable): string
    {
        return VoiceChannel::class;
    }

    /**
     * Get the voice representation of the notification.
     */
    public function toVoice(object $notifiable): VoiceMessage
    {
        // ...
    }
}
```
