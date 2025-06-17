# 메일



































## 소개 {#introduction}

이메일 전송은 복잡할 필요가 없습니다. Laravel은 인기 있는 [Symfony Mailer](https://symfony.com/doc/current/mailer.html) 컴포넌트를 기반으로 한 깔끔하고 간단한 이메일 API를 제공합니다. Laravel과 Symfony Mailer는 SMTP, Mailgun, Postmark, Resend, Amazon SES, 그리고 `sendmail`을 통한 이메일 전송 드라이버를 제공하므로, 로컬 또는 클라우드 기반 서비스 중 원하는 방식을 통해 빠르게 메일 전송을 시작할 수 있습니다.


### 설정 {#configuration}

Laravel의 이메일 서비스는 애플리케이션의 `config/mail.php` 설정 파일을 통해 구성할 수 있습니다. 이 파일에 설정된 각 메일러는 고유한 설정과 "트랜스포트"를 가질 수 있어, 애플리케이션이 특정 이메일 메시지를 보낼 때 서로 다른 이메일 서비스를 사용할 수 있습니다. 예를 들어, 애플리케이션에서 거래 관련 이메일은 Postmark를 사용하고, 대량 이메일은 Amazon SES를 사용할 수 있습니다.

`mail` 설정 파일 내에는 `mailers` 설정 배열이 있습니다. 이 배열에는 Laravel이 지원하는 주요 메일 드라이버/트랜스포트에 대한 샘플 설정 항목이 포함되어 있으며, `default` 설정 값은 애플리케이션에서 이메일 메시지를 보낼 때 기본적으로 사용할 메일러를 결정합니다.


### 드라이버 / 전송 사전 준비 사항 {#driver-prerequisites}

Mailgun, Postmark, Resend, MailerSend과 같은 API 기반 드라이버는 SMTP 서버를 통해 메일을 전송하는 것보다 더 간단하고 빠른 경우가 많습니다. 가능하다면 이러한 드라이버 중 하나를 사용하는 것을 권장합니다.


#### Mailgun 드라이버 {#mailgun-driver}

Mailgun 드라이버를 사용하려면 Composer를 통해 Symfony의 Mailgun Mailer 전송 패키지를 설치해야 합니다:

```shell
composer require symfony/mailgun-mailer symfony/http-client
```

그 다음, 애플리케이션의 `config/mail.php` 설정 파일에서 두 가지를 변경해야 합니다. 먼저, 기본 메일러를 `mailgun`으로 설정합니다:

```php
'default' => env('MAIL_MAILER', 'mailgun'),
```

그리고 `mailers` 배열에 다음 설정 배열을 추가합니다:

```php
'mailgun' => [
    'transport' => 'mailgun',
    // 'client' => [
    //     'timeout' => 5,
    // ],
],
```

애플리케이션의 기본 메일러를 설정한 후, `config/services.php` 설정 파일에 다음 옵션을 추가합니다:

```php
'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    'scheme' => 'https',
],
```

만약 미국 [Mailgun 리전](https://documentation.mailgun.com/en/latest/api-intro.html#mailgun-regions)을 사용하지 않는 경우, `services` 설정 파일에서 해당 리전의 엔드포인트를 지정할 수 있습니다:

```php
'mailgun' => [
    'domain' => env('MAILGUN_DOMAIN'),
    'secret' => env('MAILGUN_SECRET'),
    'endpoint' => env('MAILGUN_ENDPOINT', 'api.eu.mailgun.net'),
    'scheme' => 'https',
],
```


#### Postmark 드라이버 {#postmark-driver}

[Postmark](https://postmarkapp.com/) 드라이버를 사용하려면 Composer를 통해 Symfony의 Postmark Mailer 전송 패키지를 설치해야 합니다:

```shell
composer require symfony/postmark-mailer symfony/http-client
```

그 다음, 애플리케이션의 `config/mail.php` 설정 파일에서 `default` 옵션을 `postmark`로 설정하세요. 기본 메일러를 설정한 후, `config/services.php` 설정 파일에 다음 옵션이 포함되어 있는지 확인합니다:

```php
'postmark' => [
    'token' => env('POSTMARK_TOKEN'),
],
```

특정 메일러에서 사용할 Postmark 메시지 스트림을 지정하고 싶다면, 해당 메일러의 설정 배열에 `message_stream_id` 옵션을 추가할 수 있습니다. 이 설정 배열은 애플리케이션의 `config/mail.php` 파일에서 찾을 수 있습니다:

```php
'postmark' => [
    'transport' => 'postmark',
    'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
    // 'client' => [
    //     'timeout' => 5,
    // ],
],
```

이 방법을 사용하면 서로 다른 메시지 스트림을 가진 여러 개의 Postmark 메일러를 설정할 수도 있습니다.


#### Resend 드라이버 {#resend-driver}

[Resend](https://resend.com/) 드라이버를 사용하려면 Composer를 통해 Resend의 PHP SDK를 설치해야 합니다:

```shell
composer require resend/resend-php
```

그 다음, 애플리케이션의 `config/mail.php` 설정 파일에서 `default` 옵션을 `resend`로 지정하세요. 기본 메일러를 설정한 후, `config/services.php` 설정 파일에 다음 옵션이 포함되어 있는지 확인하세요:

```php
'resend' => [
    'key' => env('RESEND_KEY'),
],
```


#### SES 드라이버 {#ses-driver}

Amazon SES 드라이버를 사용하려면 먼저 Amazon AWS SDK for PHP를 설치해야 합니다. 이 라이브러리는 Composer 패키지 매니저를 통해 설치할 수 있습니다:

```shell
composer require aws/aws-sdk-php
```

다음으로, `config/mail.php` 설정 파일의 `default` 옵션을 `ses`로 설정하고, `config/services.php` 설정 파일에 아래와 같은 옵션이 포함되어 있는지 확인하세요:

```php
'ses' => [
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
],
```

세션 토큰을 통한 AWS [임시 자격 증명](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)을 사용하려면, SES 설정에 `token` 키를 추가할 수 있습니다:

```php
'ses' => [
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'token' => env('AWS_SESSION_TOKEN'),
],
```

SES의 [구독 관리 기능](https://docs.aws.amazon.com/ses/latest/dg/sending-email-subscription-management.html)을 사용하려면, 메일 메시지의 [headers](#headers) 메서드에서 반환되는 배열에 `X-Ses-List-Management-Options` 헤더를 추가할 수 있습니다:

```php
/**
 * 메시지 헤더를 반환합니다.
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

이메일을 보낼 때 Laravel이 AWS SDK의 `SendEmail` 메서드에 전달해야 하는 [추가 옵션](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-sesv2-2019-09-27.html#sendemail)을 정의하고 싶다면, `ses` 설정 내에 `options` 배열을 정의할 수 있습니다:

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

[MailerSend](https://www.mailersend.com/)는 트랜잭션 이메일 및 SMS 서비스를 제공하며, Laravel을 위한 자체 API 기반 메일 드라이버를 제공합니다. 이 드라이버가 포함된 패키지는 Composer 패키지 매니저를 통해 설치할 수 있습니다:

```shell
composer require mailersend/laravel-driver
```

패키지 설치 후, `MAILERSEND_API_KEY` 환경 변수를 애플리케이션의 `.env` 파일에 추가하세요. 또한, `MAIL_MAILER` 환경 변수는 `mailersend`로 지정해야 합니다:

```ini
MAIL_MAILER=mailersend
MAIL_FROM_ADDRESS=app@yourdomain.com
MAIL_FROM_NAME="App Name"

MAILERSEND_API_KEY=your-api-key
```

마지막으로, 애플리케이션의 `config/mail.php` 설정 파일의 `mailers` 배열에 MailerSend를 추가하세요:

```php
'mailersend' => [
    'transport' => 'mailersend',
],
```

MailerSend에 대해 더 자세히 알아보고, 호스팅된 템플릿 사용 방법 등 추가 정보가 필요하다면 [MailerSend 드라이버 문서](https://github.com/mailersend/mailersend-laravel-driver#usage)를 참고하세요.


### 장애 조치(Failover) 구성 {#failover-configuration}

외부 서비스를 통해 애플리케이션의 메일을 전송하도록 설정했을 때, 해당 외부 서비스가 다운될 수 있습니다. 이런 경우를 대비해, 기본 메일 전송 드라이버가 동작하지 않을 때 사용할 하나 이상의 백업 메일 전송 구성을 정의하는 것이 유용할 수 있습니다.

이를 위해, 애플리케이션의 `mail` 설정 파일에서 `failover` 전송 방식을 사용하는 메일러를 정의해야 합니다. 애플리케이션의 `failover` 메일러 설정 배열에는 메일 전송 시 선택될 메일러의 순서를 지정하는 `mailers` 배열이 포함되어야 합니다:

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

장애 조치 메일러를 정의한 후에는, 애플리케이션에서 기본적으로 사용할 메일러로 이 메일러를 지정해야 합니다. 이를 위해 애플리케이션의 `mail` 설정 파일에서 `default` 설정 키의 값으로 해당 메일러의 이름을 지정하면 됩니다:

```php
'default' => env('MAIL_MAILER', 'failover'),
```


### 라운드 로빈(Round Robin) 설정 {#round-robin-configuration}

`roundrobin` 전송 방식은 여러 메일러에 걸쳐 메일 발송 작업을 분산할 수 있도록 해줍니다. 시작하려면, 애플리케이션의 `mail` 설정 파일에서 `roundrobin` 전송 방식을 사용하는 메일러를 정의하세요. 애플리케이션의 `roundrobin` 메일러 설정 배열에는 메일 발송에 사용할 메일러들을 참조하는 `mailers` 배열이 포함되어야 합니다.

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

라운드 로빈 메일러를 정의한 후에는, 애플리케이션에서 기본적으로 사용할 메일러로 이 메일러를 지정해야 합니다. 이를 위해 애플리케이션의 `mail` 설정 파일에서 `default` 설정 키의 값으로 해당 메일러의 이름을 지정하세요.

```php
'default' => env('MAIL_MAILER', 'roundrobin'),
```

라운드 로빈 전송 방식은 설정된 메일러 목록 중에서 무작위로 하나를 선택한 뒤, 이후의 각 이메일 발송 시마다 다음 사용 가능한 메일러로 전환합니다. 이는 *[고가용성(high availability)](https://en.wikipedia.org/wiki/High_availability)*을 달성하는 데 도움을 주는 `failover` 전송 방식과 달리, *[로드 밸런싱(load balancing)](https://en.wikipedia.org/wiki/Load_balancing_(computing))*을 제공합니다.


## 메일러블 생성하기 {#generating-mailables}

Laravel 애플리케이션을 개발할 때, 애플리케이션에서 전송하는 각 이메일 유형은 "메일러블(mailable)" 클래스에 의해 표현됩니다. 이 클래스들은 `app/Mail` 디렉터리에 저장됩니다. 만약 이 디렉터리가 애플리케이션에 없다면 걱정하지 마세요. `make:mail` 아티즌(Artisan) 명령어를 사용해 첫 번째 메일러블 클래스를 생성할 때 자동으로 만들어집니다:

```shell
php artisan make:mail OrderShipped
```


## 메일러블 작성하기 {#writing-mailables}

메일러블 클래스를 생성했다면, 해당 파일을 열어 내용을 살펴봅시다. 메일러블 클래스의 설정은 `envelope`, `content`, `attachments` 메서드 등에서 이루어집니다.

`envelope` 메서드는 메일의 제목과 때로는 수신자를 정의하는 `Illuminate\Mail\Mailables\Envelope` 객체를 반환합니다. `content` 메서드는 메시지 내용을 생성하는 데 사용될 [Blade 템플릿](/laravel/12.x/blade)을 정의하는 `Illuminate\Mail\Mailables\Content` 객체를 반환합니다.


### 발신자 구성하기 {#configuring-the-sender}


#### Envelope 사용하기 {#using-the-envelope}

먼저, 이메일의 발신자를 설정하는 방법을 살펴보겠습니다. 즉, 이메일이 "누구로부터" 발송되는지 지정하는 방법입니다. 발신자를 설정하는 방법에는 두 가지가 있습니다. 첫 번째로, 메시지의 envelope에서 "from" 주소를 지정할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;

/**
 * 메시지 envelope을 반환합니다.
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

하지만 애플리케이션에서 모든 이메일에 동일한 "from" 주소를 사용하는 경우, 생성하는 각 mailable 클래스에 이를 추가하는 것은 번거로울 수 있습니다. 대신, `config/mail.php` 설정 파일에서 전역 "from" 주소를 지정할 수 있습니다. mailable 클래스 내에서 별도의 "from" 주소를 지정하지 않으면 이 주소가 사용됩니다:

```php
'from' => [
    'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
    'name' => env('MAIL_FROM_NAME', 'Example'),
],
```

또한, `config/mail.php` 설정 파일에서 전역 "reply_to" 주소도 정의할 수 있습니다:

```php
'reply_to' => ['address' => 'example@example.com', 'name' => 'App Name'],
```


### 뷰 설정하기 {#configuring-the-view}

메일러블 클래스의 `content` 메서드 내에서 이메일 내용을 렌더링할 때 사용할 `view`(템플릿)를 정의할 수 있습니다. 각 이메일은 일반적으로 [Blade 템플릿](/laravel/12.x/blade)을 사용하여 내용을 렌더링하므로, 이메일의 HTML을 작성할 때 Blade 템플릿 엔진의 모든 기능과 편리함을 활용할 수 있습니다:

```php
/**
 * 메시지 내용 정의를 반환합니다.
 */
public function content(): Content
{
    return new Content(
        view: 'mail.orders.shipped',
    );
}
```

> [!NOTE]
> 모든 이메일 템플릿을 보관하기 위해 `resources/views/emails` 디렉터리를 생성하는 것이 좋습니다. 하지만, 이메일 템플릿은 `resources/views` 디렉터리 내 원하는 위치에 자유롭게 배치할 수 있습니다.


#### 일반 텍스트 이메일 {#plain-text-emails}

이메일의 일반 텍스트 버전을 정의하고 싶다면, 메시지의 Content 정의를 생성할 때 plain-text 템플릿을 지정할 수 있습니다. view 파라미터와 마찬가지로, text 파라미터에는 이메일 내용을 렌더링할 때 사용할 템플릿 이름을 지정하면 됩니다. 메시지의 HTML 버전과 일반 텍스트 버전을 모두 자유롭게 정의할 수 있습니다:

```php
/**
 * 메시지 콘텐츠 정의를 반환합니다.
 */
public function content(): Content
{
    return new Content(
        view: 'mail.orders.shipped',
        text: 'mail.orders.shipped-text'
    );
}
```

더 명확하게 하기 위해, html 파라미터를 view 파라미터의 별칭으로 사용할 수도 있습니다:

```php
return new Content(
    html: 'mail.orders.shipped',
    text: 'mail.orders.shipped-text'
);
```


### 뷰 데이터 {#view-data}


#### 퍼블릭 프로퍼티를 통한 데이터 전달 {#via-public-properties}

일반적으로 이메일의 HTML을 렌더링할 때 사용할 수 있는 데이터를 뷰에 전달하고 싶을 것입니다. 뷰에서 데이터를 사용할 수 있게 만드는 방법은 두 가지가 있습니다. 첫 번째로, mailable 클래스에 정의된 모든 public 프로퍼티는 자동으로 뷰에서 사용할 수 있게 됩니다. 예를 들어, mailable 클래스의 생성자에서 데이터를 받아 해당 데이터를 클래스에 정의된 public 프로퍼티에 할당할 수 있습니다:

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
     * 새로운 메시지 인스턴스를 생성합니다.
     */
    public function __construct(
        public Order $order,
    ) {}

    /**
     * 메시지 콘텐츠 정의를 반환합니다.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.orders.shipped',
        );
    }
}
```

데이터가 public 프로퍼티에 할당되면, 해당 데이터는 자동으로 뷰에서 사용할 수 있게 되므로, Blade 템플릿에서 다른 데이터와 마찬가지로 접근할 수 있습니다:

```blade
<div>
    가격: {{ $order->price }}
</div>
```


#### `with` 파라미터를 통한 데이터 전달 {#via-the-with-parameter}

이메일의 데이터 형식을 템플릿에 전달하기 전에 커스터마이즈하고 싶다면, `Content` 정의의 `with` 파라미터를 통해 데이터를 뷰에 직접 전달할 수 있습니다. 일반적으로는 mailable 클래스의 생성자를 통해 데이터를 전달하지만, 이 데이터를 템플릿에 자동으로 노출하지 않으려면 `protected` 또는 `private` 속성에 저장해야 합니다.

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
     * 새로운 메시지 인스턴스 생성
     */
    public function __construct(
        protected Order $order,
    ) {}

    /**
     * 메시지 콘텐츠 정의 반환
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

이렇게 데이터를 `with` 메서드로 전달하면, 해당 데이터는 뷰에서 자동으로 사용할 수 있게 되며, Blade 템플릿에서 다른 데이터와 동일하게 접근할 수 있습니다.

```blade
<div>
    Price: {{ $orderPrice }}
</div>
```


### 첨부 파일 {#attachments}

이메일에 첨부 파일을 추가하려면, 메시지의 attachments 메서드에서 반환하는 배열에 첨부 파일을 추가하면 됩니다. 먼저, Attachment 클래스에서 제공하는 fromPath 메서드에 파일 경로를 전달하여 첨부 파일을 추가할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Attachment;

/**
 * 메시지에 첨부할 파일을 반환합니다.
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

메시지에 파일을 첨부할 때, as 및 withMime 메서드를 사용하여 첨부 파일의 표시 이름이나 MIME 타입을 지정할 수도 있습니다:

```php
/**
 * 메시지에 첨부할 파일을 반환합니다.
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


#### 디스크에서 파일 첨부하기 {#attaching-files-from-disk}

[파일 시스템 디스크](/laravel/12.x/filesystem)에 파일을 저장한 경우, `fromStorage` 첨부 메서드를 사용하여 이메일에 파일을 첨부할 수 있습니다:

```php
/**
 * 메시지에 첨부할 파일을 반환합니다.
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
 * 메시지에 첨부할 파일을 반환합니다.
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

기본 디스크가 아닌 다른 저장소 디스크를 지정해야 하는 경우에는 `fromStorageDisk` 메서드를 사용할 수 있습니다:

```php
/**
 * 메시지에 첨부할 파일을 반환합니다.
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


#### 원시 데이터 첨부 {#raw-data-attachments}

`fromData` 첨부 메서드는 바이트의 원시 문자열을 첨부 파일로 첨부할 때 사용할 수 있습니다. 예를 들어, 메모리에서 PDF를 생성한 후 디스크에 저장하지 않고 이메일에 첨부하고 싶을 때 이 메서드를 사용할 수 있습니다. `fromData` 메서드는 원시 데이터 바이트를 반환하는 클로저와 첨부 파일에 할당할 이름을 인자로 받습니다:

```php
/**
 * 메시지에 첨부할 파일들을 반환합니다.
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


### 인라인 첨부파일 {#inline-attachments}

이메일에 인라인 이미지를 삽입하는 것은 일반적으로 번거로운 작업이지만, Laravel은 이미지를 이메일에 첨부하는 편리한 방법을 제공합니다. 인라인 이미지를 삽입하려면 이메일 템플릿 내에서 `$message` 변수의 `embed` 메서드를 사용하면 됩니다. Laravel은 모든 이메일 템플릿에서 `$message` 변수를 자동으로 사용할 수 있도록 해주기 때문에, 직접 전달할 필요가 없습니다:

```blade
<body>
    여기에 이미지가 있습니다:

    <img src="{{ $message->embed($pathToImage) }}">
</body>
```

> [!WARNING]
> `$message` 변수는 일반 텍스트 메시지 템플릿에서는 사용할 수 없습니다. 일반 텍스트 메시지는 인라인 첨부파일을 지원하지 않기 때문입니다.


#### 원시 데이터 첨부 파일 임베딩 {#embedding-raw-data-attachments}

이미 이메일 템플릿에 임베드하고 싶은 원시 이미지 데이터 문자열이 있다면, `$message` 변수에서 `embedData` 메서드를 호출하면 됩니다. `embedData` 메서드를 호출할 때는 임베드할 이미지에 할당할 파일명을 함께 전달해야 합니다:

```blade
<body>
    원시 데이터로부터 가져온 이미지입니다:

    <img src="{{ $message->embedData($data, 'example-image.jpg') }}">
</body>
```


### 첨부 가능한 객체 {#attachable-objects}

파일을 메시지에 첨부할 때 단순히 문자열 경로를 사용하는 것으로 충분한 경우가 많지만, 실제로는 애플리케이션 내에서 첨부할 엔티티가 클래스로 표현되는 경우가 많습니다. 예를 들어, 애플리케이션에서 사진을 메시지에 첨부한다면, 해당 사진을 나타내는 `Photo` 모델이 있을 수 있습니다. 이런 경우, `attach` 메서드에 `Photo` 모델을 바로 전달할 수 있다면 훨씬 편리하지 않을까요? 첨부 가능한 객체(Attachable Objects)는 바로 이런 기능을 제공합니다.

먼저, 메시지에 첨부할 객체에 `Illuminate\Contracts\Mail\Attachable` 인터페이스를 구현하세요. 이 인터페이스는 클래스에 `toMailAttachment` 메서드를 정의하도록 요구하며, 이 메서드는 `Illuminate\Mail\Attachment` 인스턴스를 반환해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Mail\Attachable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Attachment;

class Photo extends Model implements Attachable
{
    /**
     * 모델의 첨부 파일 표현을 반환합니다.
     */
    public function toMailAttachment(): Attachment
    {
        return Attachment::fromPath('/path/to/file');
    }
}
```

첨부 가능한 객체를 정의했다면, 이메일 메시지를 생성할 때 `attachments` 메서드에서 해당 객체의 인스턴스를 반환할 수 있습니다:

```php
/**
 * 메시지에 첨부할 파일을 반환합니다.
 *
 * @return array<int, \Illuminate\Mail\Mailables\Attachment>
 */
public function attachments(): array
{
    return [$this->photo];
}
```

물론, 첨부 파일 데이터가 Amazon S3와 같은 원격 파일 저장소 서비스에 저장되어 있을 수도 있습니다. 이 경우, Laravel은 애플리케이션의 [파일시스템 디스크](/laravel/12.x/filesystem)에 저장된 데이터를 기반으로 첨부 파일 인스턴스를 생성할 수 있도록 지원합니다:

```php
// 기본 디스크에 있는 파일로부터 첨부 파일 생성...
return Attachment::fromStorage($this->path);

// 특정 디스크에 있는 파일로부터 첨부 파일 생성...
return Attachment::fromStorageDisk('backblaze', $this->path);
```

또한, 메모리에 있는 데이터를 이용해 첨부 파일 인스턴스를 생성할 수도 있습니다. 이를 위해 `fromData` 메서드에 클로저를 전달하면 됩니다. 이 클로저는 첨부 파일을 나타내는 원시 데이터를 반환해야 합니다:

```php
return Attachment::fromData(fn () => $this->content, 'Photo Name');
```

Laravel은 첨부 파일을 커스터마이즈할 수 있는 추가 메서드도 제공합니다. 예를 들어, `as`와 `withMime` 메서드를 사용해 파일 이름과 MIME 타입을 지정할 수 있습니다:

```php
return Attachment::fromPath('/path/to/file')
    ->as('Photo Name')
    ->withMime('image/jpeg');
```


### 헤더 {#headers}

때때로 발신 메시지에 추가 헤더를 첨부해야 할 수도 있습니다. 예를 들어, 커스텀 `Message-Id`나 기타 임의의 텍스트 헤더를 설정해야 할 수 있습니다.

이를 위해, mailable 클래스에 `headers` 메서드를 정의하면 됩니다. `headers` 메서드는 `Illuminate\Mail\Mailables\Headers` 인스턴스를 반환해야 합니다. 이 클래스는 `messageId`, `references`, `text` 파라미터를 받습니다. 물론, 필요한 파라미터만 선택적으로 제공할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Headers;

/**
 * 메시지 헤더를 반환합니다.
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

Mailgun, Postmark와 같은 일부 서드파티 이메일 제공업체는 메시지 "태그"와 "메타데이터"를 지원합니다. 이를 통해 애플리케이션에서 발송한 이메일을 그룹화하거나 추적할 수 있습니다. 이메일 메시지에 태그와 메타데이터를 추가하려면 `Envelope` 정의에서 다음과 같이 설정할 수 있습니다:

```php
use Illuminate\Mail\Mailables\Envelope;

/**
 * 메시지 봉투(Envelope)를 반환합니다.
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

애플리케이션에서 Mailgun 드라이버를 사용 중이라면, [태그](https://documentation.mailgun.com/docs/mailgun/user-manual/tracking-messages/#tagging)와 [메타데이터](https://documentation.mailgun.com/docs/mailgun/user-manual/tracking-messages/#attaching-data-to-messages)에 대한 자세한 내용은 Mailgun 공식 문서를 참고하세요. 마찬가지로, Postmark의 [태그](https://postmarkapp.com/blog/tags-support-for-smtp) 및 [메타데이터](https://postmarkapp.com/support/article/1125-custom-metadata-faq) 지원에 대한 자세한 내용도 공식 문서를 참고할 수 있습니다.

만약 Amazon SES를 사용하여 이메일을 발송한다면, 메시지에 [SES "태그"](https://docs.aws.amazon.com/ses/latest/APIReference/API_MessageTag.html)를 추가하려면 `metadata` 메서드를 사용해야 합니다.


### Symfony 메시지 커스터마이징 {#customizing-the-symfony-message}

Laravel의 메일 기능은 Symfony Mailer를 기반으로 동작합니다. Laravel에서는 메시지를 전송하기 전에 Symfony Message 인스턴스와 함께 호출되는 커스텀 콜백을 등록할 수 있습니다. 이를 통해 메시지가 전송되기 전에 깊이 있게 커스터마이징할 수 있습니다. 이를 위해 `Envelope` 정의에서 `using` 파라미터를 지정하면 됩니다:

```php
use Illuminate\Mail\Mailables\Envelope;
use Symfony\Component\Mime\Email;

/**
 * 메시지 봉투(envelope)를 반환합니다.
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

마크다운 메일러블 메시지를 사용하면, 메일러블에서 [메일 알림](/laravel/12.x/notifications#mail-notifications)의 미리 만들어진 템플릿과 컴포넌트를 활용할 수 있습니다. 메시지가 마크다운으로 작성되기 때문에, Laravel은 메시지에 대해 아름답고 반응형인 HTML 템플릿을 렌더링할 수 있으며, 동시에 자동으로 일반 텍스트 버전도 생성합니다.


### 마크다운 메일러블 생성하기 {#generating-markdown-mailables}

마크다운 템플릿이 포함된 메일러블을 생성하려면, `make:mail` 아티즌 명령어의 `--markdown` 옵션을 사용할 수 있습니다:

```shell
php artisan make:mail OrderShipped --markdown=mail.orders.shipped
```

그런 다음, 메일러블의 `content` 메서드에서 `Content` 정의를 설정할 때 `view` 파라미터 대신 `markdown` 파라미터를 사용하세요:

```php
use Illuminate\Mail\Mailables\Content;

/**
 * 메시지 콘텐츠 정의를 반환합니다.
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

마크다운 메일러블은 Blade 컴포넌트와 마크다운 문법을 조합하여 사용합니다. 이를 통해 Laravel에서 미리 제공하는 이메일 UI 컴포넌트를 활용하면서도 손쉽게 메일 메시지를 작성할 수 있습니다:

```blade
<x-mail::message>
# 주문이 발송되었습니다

고객님의 주문이 발송되었습니다!

<x-mail::button :url="$url">
주문 확인하기
</x-mail::button>

감사합니다.<br>
{{ config('app.name') }}
</x-mail::message>
```

> [!NOTE]
> 마크다운 이메일을 작성할 때 불필요한 들여쓰기를 사용하지 마세요. 마크다운 표준에 따라, 마크다운 파서는 들여쓰기된 내용을 코드 블록으로 렌더링합니다.


#### 버튼 컴포넌트 {#button-component}

버튼 컴포넌트는 중앙에 정렬된 버튼 링크를 렌더링합니다. 이 컴포넌트는 두 개의 인자를 받으며, `url`과 선택적으로 `color`를 지정할 수 있습니다. 지원되는 색상은 `primary`, `success`, `error`입니다. 메시지에 원하는 만큼 버튼 컴포넌트를 추가할 수 있습니다:

```blade
<x-mail::button :url="$url" color="success">
주문 보기
</x-mail::button>
```


#### 패널 컴포넌트 {#panel-component}

패널 컴포넌트는 지정된 텍스트 블록을 메시지의 나머지 부분과 약간 다른 배경색을 가진 패널에 렌더링합니다. 이를 통해 특정 텍스트 블록에 주목할 수 있습니다:

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

모든 Markdown 메일 컴포넌트를 직접 커스터마이징할 수 있도록 애플리케이션으로 내보낼 수 있습니다. 컴포넌트를 내보내려면 `vendor:publish` Artisan 명령어를 사용하여 `laravel-mail` 에셋 태그를 퍼블리시하세요:

```shell
php artisan vendor:publish --tag=laravel-mail
```

이 명령어를 실행하면 Markdown 메일 컴포넌트가 `resources/views/vendor/mail` 디렉터리에 퍼블리시됩니다. `mail` 디렉터리에는 각각의 컴포넌트에 대한 `html`과 `text` 디렉터리가 포함되어 있습니다. 각 디렉터리에는 해당 컴포넌트의 HTML 및 텍스트 버전이 들어 있습니다. 이 컴포넌트들은 자유롭게 원하는 대로 커스터마이징할 수 있습니다.


#### CSS 커스터마이징 {#customizing-the-css}

컴포넌트를 내보낸 후에는 `resources/views/vendor/mail/html/themes` 디렉터리에 `default.css` 파일이 생성됩니다. 이 파일의 CSS를 자유롭게 수정할 수 있으며, 작성한 스타일은 자동으로 HTML 형태의 Markdown 메일 메시지에 인라인 CSS 스타일로 변환되어 적용됩니다.

Laravel의 Markdown 컴포넌트에 대해 완전히 새로운 테마를 만들고 싶다면, `html/themes` 디렉터리에 CSS 파일을 추가하면 됩니다. CSS 파일의 이름을 정하고 저장한 후, 애플리케이션의 `config/mail.php` 설정 파일에서 `theme` 옵션을 새 테마의 이름으로 변경해주면 됩니다.

개별 Mailable에 대해 테마를 커스터마이징하고 싶다면, 해당 Mailable 클래스의 `$theme` 프로퍼티를 사용하고자 하는 테마 이름으로 설정하면 됩니다.


## 메일 보내기 {#sending-mail}

메시지를 보내려면 `Mail` [파사드](/laravel/12.x/facades)의 `to` 메서드를 사용하세요. `to` 메서드는 이메일 주소, 사용자 인스턴스, 또는 사용자 컬렉션을 인자로 받을 수 있습니다. 객체나 객체의 컬렉션을 전달하면, 메일러는 해당 객체의 `email`과 `name` 속성을 자동으로 사용하여 이메일 수신자를 결정하므로, 이 속성들이 객체에 반드시 존재해야 합니다. 수신자를 지정한 후에는, `send` 메서드에 메일 클래스의 인스턴스를 전달하면 됩니다:

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
     * 주어진 주문을 배송합니다.
     */
    public function store(Request $request): RedirectResponse
    {
        $order = Order::findOrFail($request->order_id);

        // 주문을 배송 처리...

        Mail::to($request->user())->send(new OrderShipped($order));

        return redirect('/orders');
    }
}
```

메시지를 보낼 때 "to" 수신자만 지정할 필요는 없습니다. "to", "cc", "bcc" 수신자를 각각의 메서드를 체이닝하여 자유롭게 설정할 수 있습니다:

```php
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->send(new OrderShipped($order));
```


#### 수신자 반복 처리 {#looping-over-recipients}

때때로, 수신자 또는 이메일 주소 배열을 반복하여 메일을 여러 명에게 보내야 할 때가 있습니다. 하지만 `to` 메서드는 메일 객체의 수신자 목록에 이메일 주소를 추가하기 때문에, 반복문을 돌 때마다 이전 수신자 모두에게 또다시 메일이 전송됩니다. 따라서, 각 수신자마다 메일 객체를 새로 생성해야 합니다:

```php
foreach (['taylor@example.com', 'dries@example.com'] as $recipient) {
    Mail::to($recipient)->send(new OrderShipped($order));
}
```


#### 특정 메일러를 통해 메일 보내기 {#sending-mail-via-a-specific-mailer}

기본적으로 Laravel은 애플리케이션의 `mail` 설정 파일에서 `default`로 지정된 메일러를 사용하여 이메일을 전송합니다. 그러나 `mailer` 메서드를 사용하면 특정 메일러 설정을 통해 메시지를 보낼 수 있습니다:

```php
Mail::mailer('postmark')
    ->to($request->user())
    ->send(new OrderShipped($order));
```


### 메일 큐잉 {#queueing-mail}


#### 메일 메시지 큐잉 {#queueing-a-mail-message}

이메일 메시지 전송은 애플리케이션의 응답 속도에 부정적인 영향을 줄 수 있기 때문에, 많은 개발자들이 이메일 메시지를 백그라운드에서 전송하도록 큐에 넣는 방식을 선택합니다. Laravel은 내장된 [통합 큐 API](/laravel/12.x/queues)를 통해 이 작업을 쉽게 처리할 수 있습니다. 메일 메시지를 큐에 넣으려면, 메시지의 수신자를 지정한 후 `Mail` 파사드의 `queue` 메서드를 사용하면 됩니다:

```php
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->queue(new OrderShipped($order));
```

이 메서드는 메시지가 백그라운드에서 전송될 수 있도록 자동으로 작업을 큐에 추가합니다. 이 기능을 사용하기 전에 [큐를 설정](/laravel/12.x/queues)해야 합니다.


#### 지연된 메시지 큐잉 {#delayed-message-queueing}

큐에 저장된 이메일 메시지의 발송을 지연시키고 싶다면, `later` 메서드를 사용할 수 있습니다. `later` 메서드는 첫 번째 인자로 메시지를 언제 보낼지 지정하는 `DateTime` 인스턴스를 받습니다:

```php
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->later(now()->addMinutes(10), new OrderShipped($order));
```


#### 특정 큐에 푸시하기 {#pushing-to-specific-queues}

`make:mail` 명령어로 생성된 모든 메일러블 클래스는 `Illuminate\Bus\Queueable` 트레이트를 사용하므로, 어떤 메일러블 클래스 인스턴스에서도 `onQueue`와 `onConnection` 메서드를 호출할 수 있습니다. 이를 통해 메시지에 사용할 연결(connection)과 큐(queue) 이름을 지정할 수 있습니다.

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

항상 큐에 넣고 싶은 메일 클래스가 있다면, 해당 클래스에 `ShouldQueue` 계약을 구현하면 됩니다. 이제 메일을 보낼 때 `send` 메서드를 호출하더라도, 이 계약을 구현했기 때문에 해당 메일은 큐에 자동으로 등록됩니다:

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderShipped extends Mailable implements ShouldQueue
{
    // ...
}
```


#### 큐잉된 메일러블과 데이터베이스 트랜잭션 {#queued-mailables-and-database-transactions}

큐잉된 메일러블이 데이터베이스 트랜잭션 내에서 디스패치될 때, 큐가 데이터베이스 트랜잭션이 커밋되기 전에 해당 작업을 처리할 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 대해 수행한 업데이트가 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 레코드가 데이터베이스에 존재하지 않을 수도 있습니다. 만약 메일러블이 이러한 모델에 의존한다면, 큐잉된 메일러블을 전송하는 작업이 처리될 때 예기치 않은 오류가 발생할 수 있습니다.

큐 연결의 `after_commit` 설정 옵션이 `false`로 되어 있더라도, 메일 메시지를 전송할 때 `afterCommit` 메서드를 호출하여 특정 큐잉된 메일러블이 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 디스패치되도록 지정할 수 있습니다:

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
     * 새로운 메시지 인스턴스를 생성합니다.
     */
    public function __construct()
    {
        $this->afterCommit();
    }
}
```

> [!NOTE]
> 이러한 문제를 우회하는 방법에 대해 더 자세히 알아보려면 [큐잉된 작업과 데이터베이스 트랜잭션](/laravel/12.x/queues#jobs-and-database-transactions) 문서를 참고하세요.


## 메일러블 렌더링 {#rendering-mailables}

가끔 메일을 실제로 보내지 않고, 메일러블의 HTML 내용을 캡처하고 싶을 때가 있습니다. 이를 위해 메일러블의 `render` 메서드를 호출할 수 있습니다. 이 메서드는 메일러블의 평가된 HTML 내용을 문자열로 반환합니다:

```php
use App\Mail\InvoicePaid;
use App\Models\Invoice;

$invoice = Invoice::find(1);

return (new InvoicePaid($invoice))->render();
```


### 브라우저에서 Mailable 미리보기 {#previewing-mailables-in-the-browser}

Mailable의 템플릿을 디자인할 때, 일반적인 Blade 템플릿처럼 렌더링된 mailable을 브라우저에서 빠르게 미리보는 것이 편리합니다. 이를 위해 Laravel은 라우트 클로저나 컨트롤러에서 mailable을 직접 반환할 수 있도록 지원합니다. mailable을 반환하면, 해당 mailable이 렌더링되어 브라우저에 표시되므로 실제 이메일 주소로 전송하지 않고도 디자인을 빠르게 미리볼 수 있습니다:

```php
Route::get('/mailable', function () {
    $invoice = App\Models\Invoice::find(1);

    return new App\Mail\InvoicePaid($invoice);
});
```


## 메일러블의 지역화 {#localizing-mailables}

Laravel은 메일러블을 현재 요청의 로케일과 다른 언어로 보낼 수 있도록 지원하며, 메일이 큐에 저장되더라도 이 로케일을 기억합니다.

이를 위해 `Mail` 파사드는 원하는 언어를 설정할 수 있는 `locale` 메서드를 제공합니다. 애플리케이션은 메일러블의 템플릿이 평가되는 동안 해당 로케일로 변경되었다가, 평가가 끝나면 이전 로케일로 되돌아갑니다:

```php
Mail::to($request->user())->locale('es')->send(
    new OrderShipped($order)
);
```


### 사용자 선호 로케일 {#user-preferred-locales}

때때로 애플리케이션은 각 사용자의 선호 로케일을 저장합니다. 모델 중 하나 이상에 `HasLocalePreference` 계약을 구현하면, Laravel이 메일을 보낼 때 이 저장된 로케일을 사용하도록 지시할 수 있습니다:

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

이 인터페이스를 구현하면, Laravel은 해당 모델에 메일러블이나 알림을 보낼 때 자동으로 선호 로케일을 사용합니다. 따라서 이 인터페이스를 사용할 때는 `locale` 메서드를 따로 호출할 필요가 없습니다:

```php
Mail::to($request->user())->send(new OrderShipped($order));
```


## 테스트 {#testing-mailables}


### 메일러블(Mailable) 내용 테스트 {#testing-mailable-content}

Laravel은 메일러블의 구조를 검사할 수 있는 다양한 메서드를 제공합니다. 또한, 메일러블에 기대하는 내용이 포함되어 있는지 테스트할 수 있는 여러 편리한 메서드도 제공합니다. 이러한 메서드에는 `assertSeeInHtml`, `assertDontSeeInHtml`, `assertSeeInOrderInHtml`, `assertSeeInText`, `assertDontSeeInText`, `assertSeeInOrderInText`, `assertHasAttachment`, `assertHasAttachedData`, `assertHasAttachmentFromStorage`, `assertHasAttachmentFromStorageDisk`가 있습니다.

예상할 수 있듯이, "HTML" 관련 어서션은 메일러블의 HTML 버전에 특정 문자열이 포함되어 있는지 확인하고, "text" 관련 어서션은 메일러블의 일반 텍스트 버전에 특정 문자열이 포함되어 있는지 확인합니다.

```php tab=Pest
use App\Mail\InvoicePaid;
use App\Models\User;

test('메일러블 내용 테스트', function () {
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

```php tab=PHPUnit
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


### 메일러블 전송 테스트 {#testing-mailable-sending}

특정 메일러블이 특정 사용자에게 "전송"되었는지 검증하는 테스트와는 별도로, 메일러블의 내용을 개별적으로 테스트하는 것을 권장합니다. 일반적으로 메일러블의 내용은 테스트하려는 코드와 직접적인 관련이 없으므로, Laravel이 특정 메일러블을 전송하도록 지시했는지만 검증하면 충분합니다.

메일이 실제로 전송되지 않도록 하려면 `Mail` 파사드의 `fake` 메서드를 사용할 수 있습니다. `Mail::fake()`를 호출한 후에는, 메일러블이 사용자에게 전송되었는지, 그리고 메일러블이 받은 데이터를 검사할 수 있습니다.

```php tab=Pest
<?php

use App\Mail\OrderShipped;
use Illuminate\Support\Facades\Mail;

test('orders can be shipped', function () {
    Mail::fake();

    // 주문 배송 처리...

    // 메일러블이 전혀 전송되지 않았는지 확인...
    Mail::assertNothingSent();

    // 메일러블이 전송되었는지 확인...
    Mail::assertSent(OrderShipped::class);

    // 메일러블이 두 번 전송되었는지 확인...
    Mail::assertSent(OrderShipped::class, 2);

    // 특정 이메일 주소로 메일러블이 전송되었는지 확인...
    Mail::assertSent(OrderShipped::class, 'example@laravel.com');

    // 여러 이메일 주소로 메일러블이 전송되었는지 확인...
    Mail::assertSent(OrderShipped::class, ['example@laravel.com', '...']);

    // 특정 메일러블이 전송되지 않았는지 확인...
    Mail::assertNotSent(AnotherMailable::class);

    // 총 3개의 메일러블이 전송되었는지 확인...
    Mail::assertSentCount(3);
});
```

```php tab=PHPUnit
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

        // 주문 배송 처리...

        // 메일러블이 전혀 전송되지 않았는지 확인...
        Mail::assertNothingSent();

        // 메일러블이 전송되었는지 확인...
        Mail::assertSent(OrderShipped::class);

        // 메일러블이 두 번 전송되었는지 확인...
        Mail::assertSent(OrderShipped::class, 2);

        // 특정 이메일 주소로 메일러블이 전송되었는지 확인...
        Mail::assertSent(OrderShipped::class, 'example@laravel.com');

        // 여러 이메일 주소로 메일러블이 전송되었는지 확인...
        Mail::assertSent(OrderShipped::class, ['example@laravel.com', '...']);

        // 특정 메일러블이 전송되지 않았는지 확인...
        Mail::assertNotSent(AnotherMailable::class);

        // 총 3개의 메일러블이 전송되었는지 확인...
        Mail::assertSentCount(3);
    }
}
```

만약 메일러블을 백그라운드에서 큐잉하여 전송한다면, `assertSent` 대신 `assertQueued` 메서드를 사용해야 합니다.

```php
Mail::assertQueued(OrderShipped::class);
Mail::assertNotQueued(OrderShipped::class);
Mail::assertNothingQueued();
Mail::assertQueuedCount(3);
```

`assertSent`, `assertNotSent`, `assertQueued`, `assertNotQueued` 메서드에 클로저를 전달하여, 특정 "진리 테스트"를 통과하는 메일러블이 전송되었는지 검증할 수 있습니다. 해당 조건을 만족하는 메일러블이 하나라도 전송되었다면, 검증은 성공합니다.

```php
Mail::assertSent(function (OrderShipped $mail) use ($order) {
    return $mail->order->id === $order->id;
});
```

`Mail` 파사드의 검증 메서드에 전달된 클로저에서, 메일러블 인스턴스는 메일러블을 검사할 수 있는 다양한 유용한 메서드를 제공합니다.

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

메일러블 인스턴스는 첨부파일을 검사할 수 있는 여러 유용한 메서드도 포함하고 있습니다.

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

메일이 전송되지 않았는지 검증하는 방법에는 `assertNotSent`와 `assertNotQueued` 두 가지가 있습니다. 때로는 메일이 전송 **또는** 큐잉되지 않았는지 모두 확인하고 싶을 수 있습니다. 이럴 때는 `assertNothingOutgoing`과 `assertNotOutgoing` 메서드를 사용할 수 있습니다.

```php
Mail::assertNothingOutgoing();

Mail::assertNotOutgoing(function (OrderShipped $mail) use ($order) {
    return $mail->order->id === $order->id;
});
```


## 메일과 로컬 개발 {#mail-and-local-development}

이메일을 보내는 애플리케이션을 개발할 때 실제 이메일 주소로 메일이 전송되는 것을 원하지 않을 수 있습니다. Laravel은 로컬 개발 중에 실제로 이메일이 전송되지 않도록 "비활성화"할 수 있는 여러 가지 방법을 제공합니다.


#### 로그 드라이버 {#log-driver}

`log` 메일 드라이버는 실제로 이메일을 전송하는 대신, 모든 이메일 메시지를 로그 파일에 기록하여 확인할 수 있도록 합니다. 일반적으로 이 드라이버는 로컬 개발 환경에서만 사용됩니다. 환경별로 애플리케이션을 설정하는 방법에 대한 자세한 내용은 [설정 문서](/laravel/12.x/configuration#environment-configuration)를 참고하세요.


#### HELO / Mailtrap / Mailpit {#mailtrap}

또는 [HELO](https://usehelo.com)나 [Mailtrap](https://mailtrap.io)와 같은 서비스를 사용하고, `smtp` 드라이버를 통해 이메일 메시지를 "더미" 메일박스로 전송할 수 있습니다. 이렇게 하면 실제 이메일 클라이언트에서 메시지를 확인할 수 있으며, Mailtrap의 메시지 뷰어에서 최종 이메일을 직접 점검할 수 있다는 장점이 있습니다.

[Laravel Sail](/laravel/12.x/sail)을 사용 중이라면, [Mailpit](https://github.com/axllent/mailpit)을 통해 메시지를 미리 볼 수 있습니다. Sail이 실행 중일 때는 `http://localhost:8025`에서 Mailpit 인터페이스에 접속할 수 있습니다.


#### 전역 `to` 주소 사용하기 {#using-a-global-to-address}

마지막으로, `Mail` 파사드에서 제공하는 `alwaysTo` 메서드를 호출하여 전역 "to" 주소를 지정할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 서비스 프로바이더 중 하나의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Mail;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    if ($this->app->environment('local')) {
        Mail::alwaysTo('taylor@example.com');
    }
}
```


## 이벤트 {#events}

Laravel은 메일 메시지를 전송하는 동안 두 가지 이벤트를 발생시킵니다. `MessageSending` 이벤트는 메시지가 전송되기 전에 발생하며, `MessageSent` 이벤트는 메시지가 전송된 후에 발생합니다. 이 이벤트들은 메일이 *전송*될 때 발생한다는 점을 기억하세요. 큐에 등록될 때가 아니라는 점에 유의해야 합니다. 애플리케이션 내에서 이러한 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Mail\Events\MessageSending;
// use Illuminate\Mail\Events\MessageSent;

class LogMessage
{
    /**
     * 이벤트를 처리합니다.
     */
    public function handle(MessageSending $event): void
    {
        // ...
    }
}
```


## 커스텀 트랜스포트 {#custom-transports}

Laravel은 다양한 메일 트랜스포트를 기본으로 제공하지만, Laravel에서 기본적으로 지원하지 않는 다른 서비스로 이메일을 전송하고 싶을 때 직접 트랜스포트를 작성할 수 있습니다. 시작하려면, `Symfony\Component\Mailer\Transport\AbstractTransport` 클래스를 확장하는 클래스를 정의하세요. 그리고 해당 트랜스포트에서 `doSend`와 `__toString()` 메서드를 구현하면 됩니다.

```php
use MailchimpTransactional\ApiClient;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\MessageConverter;

class MailchimpTransport extends AbstractTransport
{
    /**
     * 새로운 Mailchimp 트랜스포트 인스턴스를 생성합니다.
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
     * 트랜스포트의 문자열 표현을 반환합니다.
     */
    public function __toString(): string
    {
        return 'mailchimp';
    }
}
```

커스텀 트랜스포트를 정의했다면, `Mail` 파사드에서 제공하는 `extend` 메서드를 통해 등록할 수 있습니다. 일반적으로 이 작업은 애플리케이션의 `AppServiceProvider` 서비스 프로바이더의 `boot` 메서드 내에서 수행합니다. `extend` 메서드에 전달되는 클로저에는 `$config` 인자가 전달되며, 이 인자에는 애플리케이션의 `config/mail.php` 설정 파일에 정의된 메일러 설정 배열이 담겨 있습니다.

```php
use App\Mail\MailchimpTransport;
use Illuminate\Support\Facades\Mail;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Mail::extend('mailchimp', function (array $config = []) {
        return new MailchimpTransport(/* ... */);
    });
}
```

커스텀 트랜스포트를 정의하고 등록한 후에는, 애플리케이션의 `config/mail.php` 설정 파일에서 새로운 트랜스포트를 사용하는 메일러 정의를 추가할 수 있습니다.

```php
'mailchimp' => [
    'transport' => 'mailchimp',
    // ...
],
```


### 추가 Symfony 전송 방식 {#additional-symfony-transports}

Laravel은 Mailgun, Postmark와 같은 기존 Symfony에서 관리하는 메일 전송 방식을 기본적으로 지원합니다. 그러나, 추가적으로 Symfony에서 관리하는 다른 전송 방식을 Laravel에 확장하여 사용할 수도 있습니다. 이를 위해서는 Composer를 통해 필요한 Symfony 메일러 패키지를 설치하고, Laravel에 해당 전송 방식을 등록하면 됩니다. 예를 들어, "Brevo"(이전 명칭: "Sendinblue") Symfony 메일러를 설치하고 등록하는 방법은 다음과 같습니다:

```shell
composer require symfony/brevo-mailer symfony/http-client
```

Brevo 메일러 패키지를 설치한 후, 애플리케이션의 `services` 설정 파일에 Brevo API 자격 증명을 추가합니다:

```php
'brevo' => [
    'key' => 'your-api-key',
],
```

다음으로, `Mail` 파사드의 `extend` 메서드를 사용하여 Laravel에 전송 방식을 등록할 수 있습니다. 일반적으로 이 작업은 서비스 프로바이더의 `boot` 메서드 내에서 수행합니다:

```php
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
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

전송 방식이 등록되면, 애플리케이션의 config/mail.php 설정 파일에 새로운 전송 방식을 사용하는 메일러 정의를 추가할 수 있습니다:

```php
'brevo' => [
    'transport' => 'brevo',
    // ...
],
```
