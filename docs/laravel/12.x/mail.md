# 메일



































## 소개 {#introduction}

이메일 전송은 복잡할 필요가 없습니다. Laravel은 인기 있는 [Symfony Mailer](https://symfony.com/doc/current/mailer.html) 컴포넌트를 기반으로 한 깔끔하고 간단한 이메일 API를 제공합니다. Laravel과 Symfony Mailer는 SMTP, Mailgun, Postmark, Resend, Amazon SES, 그리고 `sendmail`을 통한 이메일 전송 드라이버를 제공하여, 로컬 또는 클라우드 기반 서비스 중 원하는 것을 통해 빠르게 메일 전송을 시작할 수 있습니다.


### 설정 {#configuration}

Laravel의 이메일 서비스는 애플리케이션의 `config/mail.php` 설정 파일을 통해 구성할 수 있습니다. 이 파일에 설정된 각 메일러는 고유한 설정과 "트랜스포트"를 가질 수 있어, 애플리케이션이 특정 이메일 메시지를 전송할 때 서로 다른 이메일 서비스를 사용할 수 있습니다. 예를 들어, 애플리케이션이 거래성 이메일은 Postmark로, 대량 이메일은 Amazon SES로 전송하도록 구성할 수 있습니다.

`mail` 설정 파일 내에는 `mailers` 설정 배열이 있습니다. 이 배열에는 Laravel이 지원하는 주요 메일 드라이버/트랜스포트에 대한 샘플 설정 항목이 포함되어 있으며, `default` 설정 값은 애플리케이션이 이메일 메시지를 전송할 때 기본적으로 사용할 메일러를 결정합니다.


### 드라이버 / 트랜스포트 사전 준비 사항 {#driver-prerequisites}

Mailgun, Postmark, Resend, MailerSend와 같은 API 기반 드라이버는 SMTP 서버를 통한 메일 전송보다 더 간단하고 빠른 경우가 많습니다. 가능하다면 이러한 드라이버 중 하나를 사용하는 것을 권장합니다.


#### Mailgun 드라이버 {#mailgun-driver}

Mailgun 드라이버를 사용하려면, Composer를 통해 Symfony의 Mailgun Mailer 트랜스포트를 설치해야 합니다:

```shell
composer require symfony/mailgun-mailer symfony/http-client
```

다음으로, 애플리케이션의 `config/mail.php` 설정 파일에서 두 가지를 변경해야 합니다. 먼저, 기본 메일러를 `mailgun`으로 설정합니다:

```php
'default' => env('MAIL_MAILER', 'mailgun'),
```

두 번째로, `mailers` 배열에 다음 설정 배열을 추가합니다:

```php
'mailgun' => [
    'transport' => 'mailgun',
    // 'client' => [
    //     'timeout' => 5,
    // ],
],
```

기본 메일러를 설정한 후, `config/services.php` 설정 파일에 다음 옵션을 추가합니다:

```php
'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    'scheme' => 'https',
],
```

미국 [Mailgun 리전](https://documentation.mailgun.com/en/latest/api-intro.html#mailgun-regions)을 사용하지 않는 경우, `services` 설정 파일에서 해당 리전의 엔드포인트를 정의할 수 있습니다:

```php
'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.eu.mailgun.net'),
    'scheme' => 'https',
],
```


#### Postmark 드라이버 {#postmark-driver}

[Postmark](https://postmarkapp.com/) 드라이버를 사용하려면, Composer를 통해 Symfony의 Postmark Mailer 트랜스포트를 설치해야 합니다:

```shell
composer require symfony/postmark-mailer symfony/http-client
```

다음으로, 애플리케이션의 `config/mail.php` 설정 파일에서 `default` 옵션을 `postmark`로 설정합니다. 기본 메일러를 설정한 후, `config/services.php` 설정 파일에 다음 옵션이 포함되어 있는지 확인합니다:

```php
'postmark' => [
    'token' => env('POSTMARK_TOKEN'),
],
```

특정 메일러에서 사용할 Postmark 메시지 스트림을 지정하려면, 메일러의 설정 배열에 `message_stream_id` 옵션을 추가할 수 있습니다. 이 설정 배열은 애플리케이션의 `config/mail.php` 설정 파일에서 찾을 수 있습니다:

```php
'postmark' => [
    'transport' => 'postmark',
    'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
    // 'client' => [
    //     'timeout' => 5,
    // ],
],
```

이렇게 하면 서로 다른 메시지 스트림을 가진 여러 Postmark 메일러를 설정할 수도 있습니다.


#### Resend 드라이버 {#resend-driver}

[Resend](https://resend.com/) 드라이버를 사용하려면, Composer를 통해 Resend의 PHP SDK를 설치해야 합니다:

```shell
composer require resend/resend-php
```

다음으로, 애플리케이션의 `config/mail.php` 설정 파일에서 `default` 옵션을 `resend`로 설정합니다. 기본 메일러를 설정한 후, `config/services.php` 설정 파일에 다음 옵션이 포함되어 있는지 확인합니다:

```php
'resend' => [
    'key' => env('RESEND_KEY'),
],
```


#### SES 드라이버 {#ses-driver}

Amazon SES 드라이버를 사용하려면 먼저 Amazon AWS SDK for PHP를 설치해야 합니다. Composer 패키지 매니저를 통해 이 라이브러리를 설치할 수 있습니다:

```shell
composer require aws/aws-sdk-php
```

다음으로, `config/mail.php` 설정 파일에서 `default` 옵션을 `ses`로 설정하고, `config/services.php` 설정 파일에 다음 옵션이 포함되어 있는지 확인합니다:

```php
'ses' => [
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
],
```

AWS [임시 자격 증명](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)을 세션 토큰을 통해 사용하려면, SES 설정에 `token` 키를 추가할 수 있습니다:

```php
'ses' => [
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'token' => env('AWS_SESSION_TOKEN'),
],
```

SES의 [구독 관리 기능](https://docs.aws.amazon.com/ses/latest/dg/sending-email-subscription-management.html)을 사용하려면, 메일 메시지의 [headers](#headers) 메서드에서 반환되는 배열에 `X-Ses-List-Management-Options` 헤더를 반환할 수 있습니다:

```php
/**
 * Get the message headers.
 */
public function headers(): Headers
{
    return new Headers(
        text: [
            'X-Ses-List-Management-Options' => 'contactListName=MyContactList;topicName=MyTopic',
        ],
    );
}
```

이메일 전송 시 Laravel이 AWS SDK의 `SendEmail` 메서드에 전달해야 할 [추가 옵션](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-sesv2-2019-09-27.html#sendemail)을 정의하려면, `ses` 설정 내에 `options` 배열을 정의할 수 있습니다:

```php
'ses' => [
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'options' => [
        'ConfigurationSetName' => 'MyConfigurationSet',
        'EmailTags' => [
            ['Name' => 'foo', 'Value' => 'bar'],
        ],
    ],
],
```


#### MailerSend 드라이버 {#mailersend-driver}

[MailerSend](https://www.mailersend.com/)는 트랜잭션 이메일 및 SMS 서비스로, Laravel용 자체 API 기반 메일 드라이버를 제공합니다. 드라이버가 포함된 패키지는 Composer 패키지 매니저를 통해 설치할 수 있습니다:

```shell
composer require mailersend/laravel-driver
```

패키지 설치 후, 애플리케이션의 `.env` 파일에 `MAILERSEND_API_KEY` 환경 변수를 추가합니다. 또한, `MAIL_MAILER` 환경 변수는 `mailersend`로 정의해야 합니다:

```ini
MAIL_MAILER=mailersend
MAIL_FROM_ADDRESS=app@yourdomain.com
MAIL_FROM_NAME="App Name"

MAILERSEND_API_KEY=your-api-key
```

마지막으로, 애플리케이션의 `config/mail.php` 설정 파일의 `mailers` 배열에 MailerSend를 추가합니다:

```php
'mailersend' => [
    'transport' => 'mailersend',
],
```

MailerSend에 대해 더 자세히 알아보고, 호스팅된 템플릿 사용 방법 등은 [MailerSend 드라이버 문서](https://github.com/mailersend/mailersend-laravel-driver#usage)를 참고하세요.


### 장애 조치(failover) 설정 {#failover-configuration}

애플리케이션의 메일 전송에 사용되는 외부 서비스가 다운될 수 있습니다. 이런 경우, 기본 전송 드라이버가 다운되었을 때 사용할 하나 이상의 백업 메일 전송 설정을 정의하는 것이 유용할 수 있습니다.

이를 위해, 애플리케이션의 `mail` 설정 파일에 `failover` 트랜스포트를 사용하는 메일러를 정의해야 합니다. `failover` 메일러의 설정 배열에는 전송에 사용할 메일러의 선택 순서를 참조하는 `mailers` 배열이 포함되어야 합니다:

```php
'mailers' => [
    'failover' => [
        'transport' => 'failover',
        'mailers' => [
            'postmark',
            'mailgun',
            'sendmail',
        ],
    ],

    // ...
],
```

장애 조치 메일러를 정의한 후, 애플리케이션의 `mail` 설정 파일에서 `default` 설정 키의 값으로 해당 메일러의 이름을 지정하여 기본 메일러로 설정해야 합니다:

```php
'default' => env('MAIL_MAILER', 'failover'),
```


### 라운드 로빈(round robin) 설정 {#round-robin-configuration}

`roundrobin` 트랜스포트는 여러 메일러에 메일 전송 작업을 분산시킬 수 있습니다. 시작하려면, 애플리케이션의 `mail` 설정 파일에 `roundrobin` 트랜스포트를 사용하는 메일러를 정의합니다. `roundrobin` 메일러의 설정 배열에는 전송에 사용할 메일러를 참조하는 `mailers` 배열이 포함되어야 합니다:

```php
'mailers' => [
    'roundrobin' => [
        'transport' => 'roundrobin',
        'mailers' => [
            'ses',
            'postmark',
        ],
    ],

    // ...
],
```

라운드 로빈 메일러를 정의한 후, 애플리케이션의 `mail` 설정 파일에서 `default` 설정 키의 값으로 해당 메일러의 이름을 지정하여 기본 메일러로 설정해야 합니다:

```php
'default' => env('MAIL_MAILER', 'roundrobin'),
```

라운드 로빈 트랜스포트는 설정된 메일러 목록에서 무작위로 메일러를 선택한 후, 이후 이메일마다 다음 사용 가능한 메일러로 전환합니다. 이는 *[고가용성](https://en.wikipedia.org/wiki/High_availability)*을 위한 `failover` 트랜스포트와 달리, *[로드 밸런싱](https://en.wikipedia.org/wiki/Load_balancing_(computing))*을 제공합니다.


## 메일러블 생성 {#generating-mailables}

Laravel 애플리케이션을 구축할 때, 애플리케이션에서 전송하는 각 유형의 이메일은 "메일러블" 클래스 형태로 표현됩니다. 이 클래스들은 `app/Mail` 디렉터리에 저장됩니다. 이 디렉터리가 애플리케이션에 없다면 걱정하지 마세요. `make:mail` Artisan 명령어로 첫 메일러블 클래스를 생성할 때 자동으로 생성됩니다:

```shell
php artisan make:mail OrderShipped
```


## 메일러블 작성 {#writing-mailables}

메일러블 클래스를 생성했다면, 해당 파일을 열어 내용을 살펴봅시다. 메일러블 클래스의 설정은 `envelope`, `content`, `attachments` 등 여러 메서드에서 이루어집니다.

`envelope` 메서드는 메시지의 제목과 때로는 수신자를 정의하는 `Illuminate\Mail\Mailables\Envelope` 객체를 반환합니다. `content` 메서드는 메시지 내용을 생성할 때 사용할 [Blade 템플릿](/laravel/12.x/blade)을 정의하는 `Illuminate\Mail\Mailables\Content` 객체를 반환합니다.


### 발신자 설정 {#configuring-the-sender}


#### Envelope 사용하기 {#using-the-envelope}

먼저, 이메일의 발신자(즉, "from"이 누구인지)를 설정하는 방법을 살펴봅시다. 발신자를 설정하는 방법은 두 가지가 있습니다. 첫 번째로, 메시지의 envelope에서 "from" 주소를 지정할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Get the message envelope.
 */
public function envelope(): Envelope
{
    return new Envelope(
        from: new Address('jeffrey@example.com', 'Jeffrey Way'),
        subject: 'Order Shipped',
    );
}
```

원한다면, `replyTo` 주소도 지정할 수 있습니다:

```php
return new Envelope(
    from: new Address('jeffrey@example.com', 'Jeffrey Way'),
    replyTo: [
        new Address('taylor@example.com', 'Taylor Otwell'),
    ],
    subject: 'Order Shipped',
);
```


#### 전역 `from` 주소 사용하기 {#using-a-global-from-address}

하지만 애플리케이션에서 모든 이메일에 동일한 "from" 주소를 사용한다면, 생성하는 각 메일러블 클래스마다 이를 추가하는 것이 번거로울 수 있습니다. 대신, `config/mail.php` 설정 파일에 전역 "from" 주소를 지정할 수 있습니다. 메일러블 클래스 내에서 별도의 "from" 주소를 지정하지 않은 경우 이 주소가 사용됩니다:

```php
'from' => [
    'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
    'name' => env('MAIL_FROM_NAME', 'Example'),
],
```

또한, `config/mail.php` 설정 파일에 전역 "reply_to" 주소도 정의할 수 있습니다:

```php
'reply_to' => ['address' => 'example@example.com', 'name' => 'App Name'],
```


### 뷰 설정 {#configuring-the-view}

메일러블 클래스의 `content` 메서드 내에서 이메일 내용 렌더링에 사용할 `view`(템플릿)를 정의할 수 있습니다. 각 이메일은 일반적으로 [Blade 템플릿](/laravel/12.x/blade)을 사용하므로, 이메일의 HTML을 만들 때 Blade 템플릿 엔진의 모든 기능과 편리함을 활용할 수 있습니다:

```php
/**
 * Get the message content definition.
 */
public function content(): Content
{
    return new Content(
        view: 'mail.orders.shipped',
    );
}
```

> [!NOTE]
> 모든 이메일 템플릿을 보관할 `resources/views/emails` 디렉터리를 생성하는 것이 좋지만, `resources/views` 디렉터리 내 원하는 위치에 자유롭게 둘 수 있습니다.


#### 일반 텍스트 이메일 {#plain-text-emails}

이메일의 일반 텍스트 버전을 정의하고 싶다면, 메시지의 `Content` 정의 시 plain-text 템플릿을 지정할 수 있습니다. `view` 파라미터와 마찬가지로, `text` 파라미터도 이메일 내용을 렌더링할 템플릿 이름이어야 합니다. HTML과 plain-text 버전을 모두 정의할 수 있습니다:

```php
/**
 * Get the message content definition.
 */
public function content(): Content
{
    return new Content(
        view: 'mail.orders.shipped',
        text: 'mail.orders.shipped-text'
    );
}
```

명확성을 위해, `html` 파라미터를 `view` 파라미터의 별칭으로 사용할 수 있습니다:

```php
return new Content(
    html: 'mail.orders.shipped',
    text: 'mail.orders.shipped-text'
);
```


### 뷰 데이터 {#view-data}


#### public 프로퍼티를 통한 전달 {#via-public-properties}

일반적으로, 이메일의 HTML을 렌더링할 때 사용할 데이터를 뷰에 전달하고 싶을 것입니다. 뷰에 데이터를 전달하는 방법은 두 가지가 있습니다. 첫 번째로, 메일러블 클래스에 정의된 public 프로퍼티는 자동으로 뷰에서 사용할 수 있게 됩니다. 예를 들어, 생성자에서 데이터를 받아 클래스의 public 프로퍼티에 할당할 수 있습니다:

```php
<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Order $order,
    ) {}

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.orders.shipped',
        );
    }
}
```

데이터가 public 프로퍼티에 할당되면, 뷰에서 자동으로 사용할 수 있으므로 Blade 템플릿에서 다른 데이터처럼 접근할 수 있습니다:

```blade
<div>
    Price: {{ $order->price }}
</div>
```


#### `with` 파라미터를 통한 전달 {#via-the-with-parameter}

이메일 데이터의 포맷을 템플릿에 전달하기 전에 커스터마이징하고 싶다면, `Content` 정의의 `with` 파라미터를 통해 데이터를 뷰에 수동으로 전달할 수 있습니다. 일반적으로 생성자를 통해 데이터를 전달하되, 이 데이터를 protected 또는 private 프로퍼티에 할당하여 템플릿에 자동으로 노출되지 않도록 해야 합니다:

```php
<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        protected Order $order,
    ) {}

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.orders.shipped',
            with: [
                'orderName' => $this->order->name,
                'orderPrice' => $this->order->price,
            ],
        );
    }
}
```

데이터가 `with` 메서드로 전달되면, 뷰에서 자동으로 사용할 수 있으므로 Blade 템플릿에서 다른 데이터처럼 접근할 수 있습니다:

```blade
<div>
    Price: {{ $orderPrice }}
</div>
```


### 첨부 파일 {#attachments}

이메일에 첨부 파일을 추가하려면, 메시지의 `attachments` 메서드에서 반환되는 배열에 첨부 파일을 추가하면 됩니다. 먼저, `Attachment` 클래스에서 제공하는 `fromPath` 메서드에 파일 경로를 전달하여 첨부 파일을 추가할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Attachment;

/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [
        Attachment::fromPath('/path/to/file'),
    ];
}
```

파일을 첨부할 때, `as`와 `withMime` 메서드를 사용하여 첨부 파일의 표시 이름과 MIME 타입을 지정할 수도 있습니다:

```php
/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [
        Attachment::fromPath('/path/to/file')
            ->as('name.pdf')
            ->withMime('application/pdf'),
    ];
}
```


#### 디스크에서 파일 첨부 {#attaching-files-from-disk}

[파일 시스템 디스크](/laravel/12.x/filesystem)에 파일을 저장했다면, `fromStorage` 첨부 메서드를 사용하여 이메일에 첨부할 수 있습니다:

```php
/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [
        Attachment::fromStorage('/path/to/file'),
    ];
}
```

물론, 첨부 파일의 이름과 MIME 타입도 지정할 수 있습니다:

```php
/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [
        Attachment::fromStorage('/path/to/file')
            ->as('name.pdf')
            ->withMime('application/pdf'),
    ];
}
```

기본 디스크가 아닌 다른 저장소 디스크를 지정해야 한다면, `fromStorageDisk` 메서드를 사용할 수 있습니다:

```php
/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [
        Attachment::fromStorageDisk('s3', '/path/to/file')
            ->as('name.pdf')
            ->withMime('application/pdf'),
    ];
}
```


#### Raw 데이터 첨부 {#raw-data-attachments}

`fromData` 첨부 메서드는 바이트 문자열을 첨부 파일로 첨부할 때 사용할 수 있습니다. 예를 들어, 메모리에서 PDF를 생성하고 이를 디스크에 저장하지 않고 이메일에 첨부하고 싶을 때 사용할 수 있습니다. `fromData` 메서드는 raw 데이터 바이트를 반환하는 클로저와 첨부 파일의 이름을 인자로 받습니다:

```php
/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [
        Attachment::fromData(fn () => $this->pdf, 'Report.pdf')
            ->withMime('application/pdf'),
    ];
}
```


### 인라인 첨부 파일 {#inline-attachments}

이메일에 인라인 이미지를 삽입하는 것은 일반적으로 번거롭지만, Laravel은 이미지를 이메일에 첨부하는 편리한 방법을 제공합니다. 인라인 이미지를 삽입하려면, 이메일 템플릿 내에서 `$message` 변수의 `embed` 메서드를 사용하세요. Laravel은 모든 이메일 템플릿에 `$message` 변수를 자동으로 제공하므로, 수동으로 전달할 필요가 없습니다:

```blade
<body>
    Here is an image:

    <img src="{{ $message->embed($pathToImage) }}">
</body>
```

> [!WARNING]
> `$message` 변수는 plain-text 메시지 템플릿에서는 사용할 수 없습니다. plain-text 메시지는 인라인 첨부 파일을 사용하지 않기 때문입니다.


#### Raw 데이터 첨부 파일 임베딩 {#embedding-raw-data-attachments}

이미 이메일 템플릿에 임베드하고 싶은 raw 이미지 데이터 문자열이 있다면, `$message` 변수의 `embedData` 메서드를 호출할 수 있습니다. 이때, 임베드될 이미지에 할당할 파일명을 지정해야 합니다:

```blade
<body>
    Here is an image from raw data:

    <img src="{{ $message->embedData($data, 'example-image.jpg') }}">
</body>
```


### Attachable 객체 {#attachable-objects}

문자열 경로로 파일을 첨부하는 것만으로 충분한 경우가 많지만, 애플리케이션 내에서 첨부 가능한 엔티티가 클래스로 표현되는 경우도 많습니다. 예를 들어, 애플리케이션이 메시지에 사진을 첨부한다면, 해당 사진을 나타내는 `Photo` 모델이 있을 수 있습니다. 이럴 때, `Photo` 모델을 `attach` 메서드에 바로 전달할 수 있다면 편리하지 않을까요? Attachable 객체가 바로 이를 가능하게 해줍니다.

시작하려면, 첨부 가능한 객체에 `Illuminate\Contracts\Mail\Attachable` 인터페이스를 구현하세요. 이 인터페이스는 클래스가 `Illuminate\Mail\Attachment` 인스턴스를 반환하는 `toMailAttachment` 메서드를 정의하도록 요구합니다:

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Mail\Attachable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Attachment;

class Photo extends Model implements Attachable
{
    /**
     * Get the attachable representation of the model.
     */
    public function toMailAttachment(): Attachment
    {
        return Attachment::fromPath('/path/to/file');
    }
}
```

Attachable 객체를 정의한 후, 이메일 메시지를 작성할 때 `attachments` 메서드에서 해당 객체의 인스턴스를 반환할 수 있습니다:

```php
/**
 * Get the attachments for the message.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [$this->photo];
}
```

물론, 첨부 데이터가 Amazon S3와 같은 원격 파일 저장 서비스에 저장될 수도 있습니다. 따라서 Laravel은 애플리케이션의 [파일 시스템 디스크](/laravel/12.x/filesystem)에 저장된 데이터로부터 첨부 인스턴스를 생성할 수 있도록 지원합니다:

```php
// 기본 디스크의 파일로부터 첨부 생성...
return Attachment::fromStorage($this->path);

// 특정 디스크의 파일로부터 첨부 생성...
return Attachment::fromStorageDisk('backblaze', $this->path);
```

또한, 메모리에 있는 데이터로 첨부 인스턴스를 생성할 수도 있습니다. 이를 위해, `fromData` 메서드에 클로저를 전달하세요. 클로저는 첨부 파일을 나타내는 raw 데이터를 반환해야 합니다:

```php
return Attachment::fromData(fn () => $this->content, 'Photo Name');
```

Laravel은 첨부 파일을 커스터마이징할 수 있는 추가 메서드도 제공합니다. 예를 들어, `as`와 `withMime` 메서드를 사용하여 파일의 이름과 MIME 타입을 커스터마이징할 수 있습니다:

```php
return Attachment::fromPath('/path/to/file')
    ->as('Photo Name')
    ->withMime('image/jpeg');
```


### 헤더 {#headers}

때로는 발신 메시지에 추가 헤더를 첨부해야 할 수도 있습니다. 예를 들어, 커스텀 `Message-Id`나 기타 임의의 텍스트 헤더를 설정해야 할 수 있습니다.

이를 위해, 메일러블에 `headers` 메서드를 정의하세요. `headers` 메서드는 `Illuminate\Mail\Mailables\Headers` 인스턴스를 반환해야 합니다. 이 클래스는 `messageId`, `references`, `text` 파라미터를 받습니다. 필요한 파라미터만 제공하면 됩니다:

```php
use Illuminate\Mail\Mailables\Headers;

/**
 * Get the message headers.
 */
public function headers(): Headers
{
    return new Headers(
        messageId: 'custom-message-id@example.com',
        references: ['previous-message@example.com'],
        text: [
            'X-Custom-Header' => 'Custom Value',
        ],
    );
}
```


### 태그와 메타데이터 {#tags-and-metadata}

Mailgun, Postmark와 같은 일부 서드파티 이메일 제공업체는 메시지 "태그"와 "메타데이터"를 지원합니다. 이를 통해 애플리케이션에서 전송한 이메일을 그룹화하고 추적할 수 있습니다. `Envelope` 정의를 통해 이메일 메시지에 태그와 메타데이터를 추가할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Envelope;

/**
 * Get the message envelope.
 *
 * @return \Illuminate\Mail\Mailables\Envelope
 */
public function envelope(): Envelope
{
    return new Envelope(
        subject: 'Order Shipped',
        tags: ['shipment'],
        metadata: [
            'order_id' => $this->order->id,
        ],
    );
}
```

Mailgun 드라이버를 사용하는 경우, [태그](https://documentation.mailgun.com/docs/mailgun/user-manual/tracking-messages/#tagging)와 [메타데이터](https://documentation.mailgun.com/docs/mailgun/user-manual/tracking-messages/#attaching-data-to-messages)에 대한 자세한 내용은 Mailgun 문서를 참고하세요. 마찬가지로, Postmark의 [태그](https://postmarkapp.com/blog/tags-support-for-smtp)와 [메타데이터](https://postmarkapp.com/support/article/1125-custom-metadata-faq) 지원에 대한 자세한 내용은 Postmark 문서를 참고하세요.

Amazon SES를 사용하여 이메일을 전송하는 경우, 메시지에 [SES "태그"](https://docs.aws.amazon.com/ses/latest/APIReference/API_MessageTag.html)를 첨부하려면 `metadata` 메서드를 사용해야 합니다.


### Symfony 메시지 커스터마이징 {#customizing-the-symfony-message}

Laravel의 메일 기능은 Symfony Mailer를 기반으로 합니다. Laravel은 메시지 전송 전에 Symfony Message 인스턴스와 함께 호출되는 커스텀 콜백을 등록할 수 있도록 지원합니다. 이를 통해 메시지가 전송되기 전에 메시지를 깊이 있게 커스터마이징할 수 있습니다. 이를 위해, `Envelope` 정의에 `using` 파라미터를 지정하세요:

```php
use Illuminate\Mail\Mailables\Envelope;
use Symfony\Component\Mime\Email;

/**
 * Get the message envelope.
 */
public function envelope(): Envelope
{
    return new Envelope(
        subject: 'Order Shipped',
        using: [
            function (Email $message) {
                // ...
            },
        ]
    );
}
```


## 마크다운 메일러블 {#markdown-mailables}

마크다운 메일러블 메시지를 사용하면 [메일 알림](/laravel/12.x/notifications#mail-notifications)의 미리 만들어진 템플릿과 컴포넌트를 메일러블에서 활용할 수 있습니다. 메시지가 마크다운으로 작성되기 때문에, Laravel은 메시지에 대해 아름답고 반응형인 HTML 템플릿을 렌더링하고, plain-text 버전도 자동으로 생성합니다.


### 마크다운 메일러블 생성 {#generating-markdown-mailables}

마크다운 템플릿이 포함된 메일러블을 생성하려면, `make:mail` Artisan 명령어의 `--markdown` 옵션을 사용할 수 있습니다:

```shell
php artisan make:mail OrderShipped --markdown=mail.orders.shipped
```

그런 다음, `content` 메서드 내에서 메일러블의 `Content` 정의를 설정할 때 `view` 파라미터 대신 `markdown` 파라미터를 사용하세요:

```php
use Illuminate\Mail\Mailables\Content;

/**
 * Get the message content definition.
 */
public function content(): Content
{
    return new Content(
        markdown: 'mail.orders.shipped',
        with: [
            'url' => $this->orderUrl,
        ],
    );
}
```


### 마크다운 메시지 작성 {#writing-markdown-messages}

마크다운 메일러블은 Blade 컴포넌트와 마크다운 문법을 조합하여, Laravel의 미리 만들어진 이메일 UI 컴포넌트를 활용하면서 메일 메시지를 쉽게 구성할 수 있습니다:

```blade
<x-mail::message>
# Order Shipped

Your order has been shipped!

<x-mail::button :url="$url">
View Order
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
```

> [!NOTE]
> 마크다운 이메일을 작성할 때 과도한 들여쓰기를 사용하지 마세요. 마크다운 표준에 따라, 마크다운 파서는 들여쓰기된 내용을 코드 블록으로 렌더링합니다.


#### 버튼 컴포넌트 {#button-component}

버튼 컴포넌트는 가운데 정렬된 버튼 링크를 렌더링합니다. 이 컴포넌트는 `url`과 선택적 `color` 두 가지 인자를 받습니다. 지원되는 색상은 `primary`, `success`, `error`입니다. 메시지에 원하는 만큼 버튼 컴포넌트를 추가할 수 있습니다:

```blade
<x-mail::button :url="$url" color="success">
View Order
</x-mail::button>
```


#### 패널 컴포넌트 {#panel-component}

패널 컴포넌트는 주어진 텍스트 블록을 메시지의 나머지 부분과 약간 다른 배경색의 패널에 렌더링합니다. 이를 통해 특정 텍스트 블록에 주의를 집중시킬 수 있습니다:

```blade
<x-mail::panel>
This is the panel content.
</x-mail::panel>
```


#### 테이블 컴포넌트 {#table-component}

테이블 컴포넌트를 사용하면 마크다운 테이블을 HTML 테이블로 변환할 수 있습니다. 이 컴포넌트는 마크다운 테이블을 내용으로 받습니다. 테이블 열 정렬은 기본 마크다운 테이블 정렬 문법을 사용하여 지원됩니다:

```blade
<x-mail::table>
| Laravel       | Table         | Example       |
| ------------- | :-----------: | ------------: |
| Col 2 is      | Centered      | $10           |
| Col 3 is      | Right-Aligned | $20           |
</x-mail::table>
```


### 컴포넌트 커스터마이징 {#customizing-the-components}

마크다운 메일 컴포넌트를 애플리케이션에 내보내어 커스터마이징할 수 있습니다. 컴포넌트를 내보내려면, `vendor:publish` Artisan 명령어를 사용하여 `laravel-mail` 에셋 태그를 퍼블리시하세요:

```shell
php artisan vendor:publish --tag=laravel-mail
```

이 명령어는 마크다운 메일 컴포넌트를 `resources/views/vendor/mail` 디렉터리에 퍼블리시합니다. `mail` 디렉터리에는 각각의 컴포넌트에 대한 `html`과 `text` 디렉터리가 포함되어 있습니다. 이 컴포넌트들은 자유롭게 커스터마이징할 수 있습니다.


#### CSS 커스터마이징 {#customizing-the-css}

컴포넌트를 내보낸 후, `resources/views/vendor/mail/html/themes` 디렉터리에는 `default.css` 파일이 있습니다. 이 파일의 CSS를 커스터마이징하면, 스타일이 마크다운 메일 메시지의 HTML 표현 내에서 자동으로 인라인 CSS 스타일로 변환됩니다.

Laravel의 마크다운 컴포넌트에 대해 완전히 새로운 테마를 만들고 싶다면, `html/themes` 디렉터리에 CSS 파일을 추가하면 됩니다. CSS 파일의 이름을 지정하고 저장한 후, 애플리케이션의 `config/mail.php` 설정 파일의 `theme` 옵션을 새 테마 이름으로 업데이트하세요.

개별 메일러블에 대해 테마를 커스터마이징하려면, 메일러블 클래스의 `$theme` 프로퍼티를 해당 메일러블 전송 시 사용할 테마 이름으로 설정하면 됩니다.


## 메일 전송 {#sending-mail}

메시지를 전송하려면, `Mail` [파사드](/laravel/12.x/facades)의 `to` 메서드를 사용하세요. `to` 메서드는 이메일 주소, 사용자 인스턴스, 또는 사용자 컬렉션을 받을 수 있습니다. 객체나 객체 컬렉션을 전달하면, 메일러는 자동으로 해당 객체의 `email`과 `name` 프로퍼티를 사용하여 이메일 수신자를 결정하므로, 이 속성들이 객체에 존재하는지 확인하세요. 수신자를 지정한 후, 메일러블 클래스의 인스턴스를 `send` 메서드에 전달할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use App\Mail\OrderShipped;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OrderShipmentController extends Controller
{
    /**
     * Ship the given order.
     */
    public function store(Request $request): RedirectResponse
    {
        $order = Order::findOrFail($request->order_id);

        // Ship the order...

        Mail::to($request->user())->send(new OrderShipped($order));

        return redirect('/orders');
    }
}
```

메시지 전송 시 "to" 수신자만 지정할 필요는 없습니다. "to", "cc", "bcc" 수신자를 각각의 메서드를 체이닝하여 자유롭게 설정할 수 있습니다:

```php
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->send(new OrderShipped($order));
```


#### 수신자 반복 처리 {#looping-over-recipients}

때때로, 수신자/이메일 주소 배열을 반복하여 메일러블을 여러 수신자에게 전송해야 할 수 있습니다. 하지만, `to` 메서드는 이메일 주소를 메일러블의 수신자 목록에 추가하므로, 반복문을 돌 때마다 이전 수신자에게도 또다시 이메일이 전송됩니다. 따라서, 각 수신자마다 메일러블 인스턴스를 새로 생성해야 합니다:

```php
foreach (['taylor@example.com', 'dries@example.com'] as $recipient) {
    Mail::to($recipient)->send(new OrderShipped($order));
}
```


#### 특정 메일러로 메일 전송 {#sending-mail-via-a-specific-mailer}

기본적으로, Laravel은 애플리케이션의 `mail` 설정 파일에서 `default`로 설정된 메일러를 사용하여 이메일을 전송합니다. 하지만, `mailer` 메서드를 사용하여 특정 메일러 설정을 통해 메시지를 전송할 수 있습니다:

```php
Mail::mailer('postmark')
    ->to($request->user())
    ->send(new OrderShipped($order));
```


### 메일 큐잉 {#queueing-mail}


#### 메일 메시지 큐잉 {#queueing-a-mail-message}

이메일 전송은 애플리케이션의 응답 시간을 저하시킬 수 있으므로, 많은 개발자들이 이메일 메시지를 백그라운드에서 전송하도록 큐에 넣는 방식을 선택합니다. Laravel은 내장 [통합 큐 API](/laravel/12.x/queues)를 통해 이를 쉽게 처리할 수 있습니다. 메일 메시지를 큐에 넣으려면, 수신자를 지정한 후 `Mail` 파사드의 `queue` 메서드를 사용하세요:

```php
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->queue(new OrderShipped($order));
```

이 메서드는 메시지가 백그라운드에서 전송되도록 자동으로 큐에 작업을 추가합니다. 이 기능을 사용하기 전에 [큐를 설정](/laravel/12.x/queues)해야 합니다.


#### 지연된 메시지 큐잉 {#delayed-message-queueing}

큐에 넣은 이메일 메시지의 전송을 지연시키고 싶다면, `later` 메서드를 사용할 수 있습니다. `later` 메서드의 첫 번째 인자는 메시지를 전송할 시점을 나타내는 `DateTime` 인스턴스입니다:

```php
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->later(now()->addMinutes(10), new OrderShipped($order));
```


#### 특정 큐에 푸시하기 {#pushing-to-specific-queues}

`make:mail` 명령어로 생성된 모든 메일러블 클래스는 `Illuminate\Bus\Queueable` 트레이트를 사용하므로, 어떤 메일러블 클래스 인스턴스에서도 `onQueue`와 `onConnection` 메서드를 호출하여 메시지의 커넥션과 큐 이름을 지정할 수 있습니다:

```php
$message = (new OrderShipped($order))
    ->onConnection('sqs')
    ->onQueue('emails');

Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->queue($message);
```


#### 기본적으로 큐잉하기 {#queueing-by-default}

항상 큐에 넣어 전송하고 싶은 메일러블 클래스가 있다면, 해당 클래스에 `ShouldQueue` 계약을 구현하면 됩니다. 이제 `send` 메서드로 메일을 전송하더라도, 계약을 구현했기 때문에 메일러블은 큐에 넣어집니다:

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderShipped extends Mailable implements ShouldQueue
{
    // ...
}
```


#### 큐잉된 메일러블과 데이터베이스 트랜잭션 {#queued-mailables-and-database-transactions}

큐잉된 메일러블이 데이터베이스 트랜잭션 내에서 디스패치될 때, 큐가 데이터베이스 트랜잭션이 커밋되기 전에 작업을 처리할 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 가한 변경 사항이 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 레코드가 데이터베이스에 존재하지 않을 수도 있습니다. 메일러블이 이러한 모델에 의존한다면, 큐잉된 메일러블을 전송하는 작업이 처리될 때 예기치 않은 오류가 발생할 수 있습니다.

큐 커넥션의 `after_commit` 설정 옵션이 `false`로 되어 있다면, 메일 메시지를 전송할 때 `afterCommit` 메서드를 호출하여 해당 큐잉된 메일러블이 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치되도록 지정할 수 있습니다:

```php
Mail::to($request->user())->send(
    (new OrderShipped($order))->afterCommit()
);
```

또는, 메일러블의 생성자에서 `afterCommit` 메서드를 호출할 수도 있습니다:

```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct()
    {
        $this->afterCommit();
    }
}
```

> [!NOTE]
> 이러한 문제를 우회하는 방법에 대해 더 알아보려면, [큐 작업과 데이터베이스 트랜잭션](/laravel/12.x/queues#jobs-and-database-transactions) 문서를 참고하세요.


## 메일러블 렌더링 {#rendering-mailables}

때로는 메일러블을 실제로 전송하지 않고 HTML 내용을 캡처하고 싶을 수 있습니다. 이를 위해, 메일러블의 `render` 메서드를 호출할 수 있습니다. 이 메서드는 메일러블의 평가된 HTML 내용을 문자열로 반환합니다:

```php
use App\Mail\InvoicePaid;
use App\Models\Invoice;

$invoice = Invoice::find(1);

return (new InvoicePaid($invoice))->render();
```


### 브라우저에서 메일러블 미리보기 {#previewing-mailables-in-the-browser}

메일러블 템플릿을 디자인할 때, 일반 Blade 템플릿처럼 브라우저에서 렌더링된 메일러블을 빠르게 미리보는 것이 편리합니다. 이를 위해, Laravel은 라우트 클로저나 컨트롤러에서 메일러블을 직접 반환할 수 있도록 지원합니다. 메일러블이 반환되면, 렌더링되어 브라우저에 표시되므로 실제 이메일 주소로 전송하지 않고도 디자인을 빠르게 미리볼 수 있습니다:

```php
Route::get('/mailable', function () {
    $invoice = App\Models\Invoice::find(1);

    return new App\Mail\InvoicePaid($invoice);
});
```


## 메일러블 현지화 {#localizing-mailables}

Laravel은 요청의 현재 로케일과 다른 로케일로 메일러블을 전송할 수 있으며, 메일이 큐에 들어가더라도 이 로케일을 기억합니다.

이를 위해, `Mail` 파사드는 원하는 언어를 설정할 수 있는 `locale` 메서드를 제공합니다. 메일러블의 템플릿이 평가되는 동안 애플리케이션은 이 로케일로 변경되었다가, 평가가 끝나면 이전 로케일로 되돌아갑니다:

```php
Mail::to($request->user())->locale('es')->send(
    new OrderShipped($order)
);
```


### 사용자 선호 로케일 {#user-preferred-locales}

애플리케이션이 각 사용자의 선호 로케일을 저장하는 경우가 있습니다. 모델 중 하나 이상에 `HasLocalePreference` 계약을 구현하면, Laravel이 메일 전송 시 저장된 로케일을 사용하도록 할 수 있습니다:

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

인터페이스를 구현하면, Laravel은 메일러블과 알림을 해당 모델에 전송할 때 자동으로 선호 로케일을 사용합니다. 따라서 이 인터페이스를 사용할 때는 `locale` 메서드를 호출할 필요가 없습니다:

```php
Mail::to($request->user())->send(new OrderShipped($order));
```


## 테스트 {#testing-mailables}


### 메일러블 내용 테스트 {#testing-mailable-content}

Laravel은 메일러블의 구조를 검사할 수 있는 다양한 메서드를 제공합니다. 또한, 메일러블에 기대하는 내용이 포함되어 있는지 테스트할 수 있는 여러 편리한 메서드도 제공합니다. 이 메서드들은 `assertSeeInHtml`, `assertDontSeeInHtml`, `assertSeeInOrderInHtml`, `assertSeeInText`, `assertDontSeeInText`, `assertSeeInOrderInText`, `assertHasAttachment`, `assertHasAttachedData`, `assertHasAttachmentFromStorage`, `assertHasAttachmentFromStorageDisk`입니다.

예상할 수 있듯이, "HTML" 어설션은 메일러블의 HTML 버전에 특정 문자열이 포함되어 있는지 검사하고, "text" 어설션은 plain-text 버전에 특정 문자열이 포함되어 있는지 검사합니다:
::: code-group
```php [Pest]
use App\Mail\InvoicePaid;
use App\Models\User;

test('mailable content', function () {
    $user = User::factory()->create();

    $mailable = new InvoicePaid($user);

    $mailable->assertFrom('jeffrey@example.com');
    $mailable->assertTo('taylor@example.com');
    $mailable->assertHasCc('abigail@example.com');
    $mailable->assertHasBcc('victoria@example.com');
    $mailable->assertHasReplyTo('tyler@example.com');
    $mailable->assertHasSubject('Invoice Paid');
    $mailable->assertHasTag('example-tag');
    $mailable->assertHasMetadata('key', 'value');

    $mailable->assertSeeInHtml($user->email);
    $mailable->assertSeeInHtml('Invoice Paid');
    $mailable->assertSeeInOrderInHtml(['Invoice Paid', 'Thanks']);

    $mailable->assertSeeInText($user->email);
    $mailable->assertSeeInOrderInText(['Invoice Paid', 'Thanks']);

    $mailable->assertHasAttachment('/path/to/file');
    $mailable->assertHasAttachment(Attachment::fromPath('/path/to/file'));
    $mailable->assertHasAttachedData($pdfData, 'name.pdf', ['mime' => 'application/pdf']);
    $mailable->assertHasAttachmentFromStorage('/path/to/file', 'name.pdf', ['mime' => 'application/pdf']);
    $mailable->assertHasAttachmentFromStorageDisk('s3', '/path/to/file', 'name.pdf', ['mime' => 'application/pdf']);
});
```

```php [PHPUnit]
use App\Mail\InvoicePaid;
use App\Models\User;

public function test_mailable_content(): void
{
    $user = User::factory()->create();

    $mailable = new InvoicePaid($user);

    $mailable->assertFrom('jeffrey@example.com');
    $mailable->assertTo('taylor@example.com');
    $mailable->assertHasCc('abigail@example.com');
    $mailable->assertHasBcc('victoria@example.com');
    $mailable->assertHasReplyTo('tyler@example.com');
    $mailable->assertHasSubject('Invoice Paid');
    $mailable->assertHasTag('example-tag');
    $mailable->assertHasMetadata('key', 'value');

    $mailable->assertSeeInHtml($user->email);
    $mailable->assertSeeInHtml('Invoice Paid');
    $mailable->assertSeeInOrderInHtml(['Invoice Paid', 'Thanks']);

    $mailable->assertSeeInText($user->email);
    $mailable->assertSeeInOrderInText(['Invoice Paid', 'Thanks']);

    $mailable->assertHasAttachment('/path/to/file');
    $mailable->assertHasAttachment(Attachment::fromPath('/path/to/file'));
    $mailable->assertHasAttachedData($pdfData, 'name.pdf', ['mime' => 'application/pdf']);
    $mailable->assertHasAttachmentFromStorage('/path/to/file', 'name.pdf', ['mime' => 'application/pdf']);
    $mailable->assertHasAttachmentFromStorageDisk('s3', '/path/to/file', 'name.pdf', ['mime' => 'application/pdf']);
}
```
:::

### 메일러블 전송 테스트 {#testing-mailable-sending}

메일러블의 내용을 테스트하는 것과, 특정 메일러블이 특정 사용자에게 "전송"되었는지 어설션하는 테스트는 분리하는 것이 좋습니다. 일반적으로, 메일러블의 내용은 테스트하려는 코드와 관련이 없으며, Laravel이 특정 메일러블을 전송하도록 지시받았는지만 어설션하면 충분합니다.

`Mail` 파사드의 `fake` 메서드를 사용하여 실제 메일 전송을 방지할 수 있습니다. `Mail` 파사드의 `fake` 메서드를 호출한 후, 메일러블이 사용자에게 전송되었는지 어설션하고, 메일러블이 받은 데이터도 검사할 수 있습니다:
::: code-group
```php [Pest]
<?php

use App\Mail\OrderShipped;
use Illuminate\Support\Facades\Mail;

test('orders can be shipped', function () {
    Mail::fake();

    // Perform order shipping...

    // Assert that no mailables were sent...
    Mail::assertNothingSent();

    // Assert that a mailable was sent...
    Mail::assertSent(OrderShipped::class);

    // Assert a mailable was sent twice...
    Mail::assertSent(OrderShipped::class, 2);

    // Assert a mailable was sent to an email address...
    Mail::assertSent(OrderShipped::class, 'example@laravel.com');

    // Assert a mailable was sent to multiple email addresses...
    Mail::assertSent(OrderShipped::class, ['example@laravel.com', '...']);

    // Assert a mailable was not sent...
    Mail::assertNotSent(AnotherMailable::class);

    // Assert 3 total mailables were sent...
    Mail::assertSentCount(3);
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Mail\OrderShipped;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_orders_can_be_shipped(): void
    {
        Mail::fake();

        // Perform order shipping...

        // Assert that no mailables were sent...
        Mail::assertNothingSent();

        // Assert that a mailable was sent...
        Mail::assertSent(OrderShipped::class);

        // Assert a mailable was sent twice...
        Mail::assertSent(OrderShipped::class, 2);

        // Assert a mailable was sent to an email address...
        Mail::assertSent(OrderShipped::class, 'example@laravel.com');

        // Assert a mailable was sent to multiple email addresses...
        Mail::assertSent(OrderShipped::class, ['example@laravel.com', '...']);

        // Assert a mailable was not sent...
        Mail::assertNotSent(AnotherMailable::class);

        // Assert 3 total mailables were sent...
        Mail::assertSentCount(3);
    }
}
```
:::
백그라운드에서 메일러블을 큐에 넣어 전송하는 경우, `assertSent` 대신 `assertQueued` 메서드를 사용해야 합니다:

```php
Mail::assertQueued(OrderShipped::class);
Mail::assertNotQueued(OrderShipped::class);
Mail::assertNothingQueued();
Mail::assertQueuedCount(3);
```

`assertSent`, `assertNotSent`, `assertQueued`, `assertNotQueued` 메서드에 클로저를 전달하여, 주어진 "진리 테스트"를 통과하는 메일러블이 전송되었는지 어설션할 수 있습니다. 주어진 진리 테스트를 통과하는 메일러블이 하나라도 전송되었다면 어설션은 성공합니다:

```php
Mail::assertSent(function (OrderShipped $mail) use ($order) {
    return $mail->order->id === $order->id;
});
```

`Mail` 파사드의 어설션 메서드를 호출할 때, 제공된 클로저에서 전달받는 메일러블 인스턴스는 메일러블을 검사할 수 있는 유용한 메서드를 제공합니다:

```php
Mail::assertSent(OrderShipped::class, function (OrderShipped $mail) use ($user) {
    return $mail->hasTo($user->email) &&
           $mail->hasCc('...') &&
           $mail->hasBcc('...') &&
           $mail->hasReplyTo('...') &&
           $mail->hasFrom('...') &&
           $mail->hasSubject('...');
});
```

메일러블 인스턴스는 첨부 파일을 검사할 수 있는 여러 유용한 메서드도 포함하고 있습니다:

```php
use Illuminate\Mail\Mailables\Attachment;

Mail::assertSent(OrderShipped::class, function (OrderShipped $mail) {
    return $mail->hasAttachment(
        Attachment::fromPath('/path/to/file')
            ->as('name.pdf')
            ->withMime('application/pdf')
    );
});

Mail::assertSent(OrderShipped::class, function (OrderShipped $mail) {
    return $mail->hasAttachment(
        Attachment::fromStorageDisk('s3', '/path/to/file')
    );
});

Mail::assertSent(OrderShipped::class, function (OrderShipped $mail) use ($pdfData) {
    return $mail->hasAttachment(
        Attachment::fromData(fn () => $pdfData, 'name.pdf')
    );
});
```

메일이 전송되지 않았음을 어설션하는 두 가지 메서드가 있다는 점에 주목하세요: `assertNotSent`와 `assertNotQueued`. 때로는 메일이 전송 **또는** 큐잉되지 않았음을 어설션하고 싶을 수 있습니다. 이를 위해, `assertNothingOutgoing`와 `assertNotOutgoing` 메서드를 사용할 수 있습니다:

```php
Mail::assertNothingOutgoing();

Mail::assertNotOutgoing(function (OrderShipped $mail) use ($order) {
    return $mail->order->id === $order->id;
});
```


## 메일과 로컬 개발 {#mail-and-local-development}

이메일을 전송하는 애플리케이션을 개발할 때, 실제 이메일 주소로 메일을 전송하고 싶지 않을 것입니다. Laravel은 로컬 개발 중 실제 이메일 전송을 "비활성화"할 수 있는 여러 방법을 제공합니다.


#### 로그 드라이버 {#log-driver}

이메일을 전송하는 대신, `log` 메일 드라이버는 모든 이메일 메시지를 로그 파일에 기록하여 확인할 수 있게 합니다. 일반적으로 이 드라이버는 로컬 개발 중에만 사용됩니다. 환경별로 애플리케이션을 설정하는 방법에 대한 자세한 내용은 [설정 문서](/laravel/12.x/configuration#environment-configuration)를 참고하세요.


#### HELO / Mailtrap / Mailpit {#mailtrap}

또는, [HELO](https://usehelo.com)나 [Mailtrap](https://mailtrap.io)과 같은 서비스를 사용하고, `smtp` 드라이버를 통해 이메일 메시지를 "더미" 메일박스로 전송하여 실제 이메일 클라이언트에서 확인할 수 있습니다. 이 방법은 Mailtrap의 메시지 뷰어에서 최종 이메일을 실제로 확인할 수 있다는 장점이 있습니다.

[Laravel Sail](/laravel/12.x/sail)을 사용하는 경우, [Mailpit](https://github.com/axllent/mailpit)을 통해 메시지를 미리볼 수 있습니다. Sail이 실행 중일 때, Mailpit 인터페이스는 `http://localhost:8025`에서 접근할 수 있습니다.


#### 전역 `to` 주소 사용하기 {#using-a-global-to-address}

마지막으로, `Mail` 파사드의 `alwaysTo` 메서드를 호출하여 전역 "to" 주소를 지정할 수 있습니다. 일반적으로 이 메서드는 애플리케이션 서비스 프로바이더 중 하나의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Mail;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    if ($this->app->environment('local')) {
        Mail::alwaysTo('taylor@example.com');
    }
}
```


## 이벤트 {#events}

Laravel은 메일 메시지를 전송하는 동안 두 가지 이벤트를 디스패치합니다. `MessageSending` 이벤트는 메시지가 전송되기 전에, `MessageSent` 이벤트는 메시지가 전송된 후에 디스패치됩니다. 이 이벤트들은 메일이 *전송*될 때 디스패치되며, 큐잉될 때가 아님을 기억하세요. 애플리케이션 내에서 이 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Mail\Events\MessageSending;
// use Illuminate\Mail\Events\MessageSent;

class LogMessage
{
    /**
     * Handle the event.
     */
    public function handle(MessageSending $event): void
    {
        // ...
    }
}
```


## 커스텀 트랜스포트 {#custom-transports}

Laravel은 다양한 메일 트랜스포트를 포함하고 있지만, Laravel이 기본적으로 지원하지 않는 다른 서비스로 이메일을 전송하기 위해 직접 트랜스포트를 작성하고 싶을 수 있습니다. 시작하려면, `Symfony\Component\Mailer\Transport\AbstractTransport` 클래스를 확장하는 클래스를 정의하세요. 그런 다음, 트랜스포트에 `doSend`와 `__toString()` 메서드를 구현하세요:

```php
use MailchimpTransactional\ApiClient;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\MessageConverter;

class MailchimpTransport extends AbstractTransport
{
    /**
     * Create a new Mailchimp transport instance.
     */
    public function __construct(
        protected ApiClient $client,
    ) {
        parent::__construct();
    }

    /**
     * {@inheritDoc}
     */
    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());

        $this->client->messages->send(['message' => [
            'from_email' => $email->getFrom(),
            'to' => collect($email->getTo())->map(function (Address $email) {
                return ['email' => $email->getAddress(), 'type' => 'to'];
            })->all(),
            'subject' => $email->getSubject(),
            'text' => $email->getTextBody(),
        ]]);
    }

    /**
     * Get the string representation of the transport.
     */
    public function __toString(): string
    {
        return 'mailchimp';
    }
}
```

커스텀 트랜스포트를 정의한 후, `Mail` 파사드의 `extend` 메서드를 통해 등록할 수 있습니다. 일반적으로, 이는 애플리케이션의 `AppServiceProvider` 서비스 프로바이더의 `boot` 메서드 내에서 수행해야 합니다. `extend` 메서드에 제공되는 클로저에는 `$config` 인자가 전달되며, 이 인자에는 애플리케이션의 `config/mail.php` 설정 파일에 정의된 메일러의 설정 배열이 포함됩니다:

```php
use App\Mail\MailchimpTransport;
use Illuminate\Support\Facades\Mail;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Mail::extend('mailchimp', function (array $config = []) {
        return new MailchimpTransport(/* ... */);
    });
}
```

커스텀 트랜스포트를 정의하고 등록한 후, 애플리케이션의 `config/mail.php` 설정 파일에 새로운 트랜스포트를 사용하는 메일러 정의를 생성할 수 있습니다:

```php
'mailchimp' => [
    'transport' => 'mailchimp',
    // ...
],
```


### 추가 Symfony 트랜스포트 {#additional-symfony-transports}

Laravel은 Mailgun, Postmark와 같은 일부 Symfony에서 관리하는 메일 트랜스포트를 지원합니다. 하지만, 추가적인 Symfony 관리 트랜스포트에 대한 지원을 Laravel에 확장하고 싶을 수 있습니다. 필요한 Symfony 메일러를 Composer로 설치하고, Laravel에 트랜스포트를 등록하면 됩니다. 예를 들어, "Brevo"(이전 "Sendinblue") Symfony 메일러를 설치하고 등록할 수 있습니다:

```shell
composer require symfony/brevo-mailer symfony/http-client
```

Brevo 메일러 패키지를 설치한 후, 애플리케이션의 `services` 설정 파일에 Brevo API 자격 증명 항목을 추가할 수 있습니다:

```php
'brevo' => [
    'key' => 'your-api-key',
],
```

다음으로, `Mail` 파사드의 `extend` 메서드를 사용하여 Laravel에 트랜스포트를 등록할 수 있습니다. 일반적으로, 이는 서비스 프로바이더의 `boot` 메서드 내에서 수행해야 합니다:

```php
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Mail::extend('brevo', function () {
        return (new BrevoTransportFactory)->create(
            new Dsn(
                'brevo+api',
                'default',
                config('services.brevo.key')
            )
        );
    });
}
```

트랜스포트가 등록되면, 애플리케이션의 config/mail.php 설정 파일에 새로운 트랜스포트를 사용하는 메일러 정의를 생성할 수 있습니다:

```php
'brevo' => [
    'transport' => 'brevo',
    // ...
],
```
