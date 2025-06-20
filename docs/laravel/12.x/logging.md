# 로깅




















## 소개 {#introduction}

애플리케이션 내에서 무슨 일이 일어나고 있는지 더 잘 파악할 수 있도록, Laravel은 파일, 시스템 에러 로그, 심지어 Slack을 통해 팀 전체에 알릴 수 있는 강력한 로깅 서비스를 제공합니다.

Laravel의 로깅은 "채널"을 기반으로 합니다. 각 채널은 로그 정보를 기록하는 특정 방식을 나타냅니다. 예를 들어, `single` 채널은 로그 파일을 하나의 파일에 기록하고, `slack` 채널은 로그 메시지를 Slack으로 전송합니다. 로그 메시지는 심각도에 따라 여러 채널에 기록될 수 있습니다.

Laravel은 내부적으로 [Monolog](https://github.com/Seldaek/monolog) 라이브러리를 사용하며, 이는 다양한 강력한 로그 핸들러를 지원합니다. Laravel은 이러한 핸들러를 손쉽게 설정할 수 있도록 하여, 애플리케이션의 로그 처리를 자유롭게 조합하고 커스터마이징할 수 있게 해줍니다.


## 설정 {#configuration}

애플리케이션의 로깅 동작을 제어하는 모든 설정 옵션은 `config/logging.php` 설정 파일에 있습니다. 이 파일을 통해 애플리케이션의 로그 채널을 구성할 수 있으니, 사용 가능한 각 채널과 그 옵션을 꼭 확인하세요. 아래에서 몇 가지 일반적인 옵션을 살펴보겠습니다.

기본적으로 Laravel은 메시지를 기록할 때 `stack` 채널을 사용합니다. `stack` 채널은 여러 로그 채널을 하나의 채널로 집계하는 데 사용됩니다. 스택 구축에 대한 자세한 내용은 [아래 문서](#building-log-stacks)를 참고하세요.


### 사용 가능한 채널 드라이버 {#available-channel-drivers}

각 로그 채널은 "드라이버"에 의해 구동됩니다. 드라이버는 로그 메시지가 실제로 어떻게, 어디에 기록될지를 결정합니다. 다음 로그 채널 드라이버는 모든 Laravel 애플리케이션에서 사용할 수 있습니다. 대부분의 드라이버에 대한 항목이 이미 애플리케이션의 `config/logging.php` 설정 파일에 있으니, 이 파일을 검토하여 내용을 숙지하세요:

<div class="overflow-auto">

| 이름         | 설명                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `custom`     | 지정된 팩토리를 호출하여 채널을 생성하는 드라이버                    |
| `daily`      | 매일 회전하는 `RotatingFileHandler` 기반 Monolog 드라이버             |
| `errorlog`   | `ErrorLogHandler` 기반 Monolog 드라이버                              |
| `monolog`    | 지원되는 Monolog 핸들러를 사용할 수 있는 Monolog 팩토리 드라이버     |
| `papertrail` | `SyslogUdpHandler` 기반 Monolog 드라이버                             |
| `single`     | 단일 파일 또는 경로 기반 로거 채널 (`StreamHandler`)                 |
| `slack`      | `SlackWebhookHandler` 기반 Monolog 드라이버                          |
| `stack`      | "멀티 채널" 채널 생성을 돕는 래퍼                                   |
| `syslog`     | `SyslogHandler` 기반 Monolog 드라이버                                |

</div>

> [!NOTE]
> `monolog` 및 `custom` 드라이버에 대해 더 알고 싶다면 [고급 채널 커스터마이징](#monolog-channel-customization) 문서를 참고하세요.


#### 채널 이름 설정 {#configuring-the-channel-name}

기본적으로 Monolog은 현재 환경(`production` 또는 `local` 등)과 일치하는 "채널 이름"으로 인스턴스화됩니다. 이 값을 변경하려면 채널 설정에 `name` 옵션을 추가하면 됩니다:

```php
'stack' => [
    'driver' => 'stack',
    'name' => 'channel-name',
    'channels' => ['single', 'slack'],
],
```


### 채널 사전 준비 사항 {#channel-prerequisites}


#### Single 및 Daily 채널 설정 {#configuring-the-single-and-daily-channels}

`single` 및 `daily` 채널에는 `bubble`, `permission`, `locking` 세 가지 선택적 설정 옵션이 있습니다.

<div class="overflow-auto">

| 이름         | 설명                                                                 | 기본값  |
| ------------ | -------------------------------------------------------------------- | ------- |
| `bubble`     | 메시지 처리 후 다른 채널로 버블링할지 여부                           | `true`  |
| `locking`    | 기록 전 로그 파일을 잠글지 여부                                      | `false` |
| `permission` | 로그 파일의 권한                                                     | `0644`  |

</div>

또한, `daily` 채널의 보존 정책은 `LOG_DAILY_DAYS` 환경 변수 또는 `days` 설정 옵션을 통해 구성할 수 있습니다.

<div class="overflow-auto">

| 이름   | 설명                                         | 기본값 |
| ------ | -------------------------------------------- | ------ |
| `days` | 일일 로그 파일을 보존할 일수                  | `14`   |

</div>


#### Papertrail 채널 설정 {#configuring-the-papertrail-channel}

`papertrail` 채널은 `host`와 `port` 설정 옵션이 필요합니다. 이 값들은 `PAPERTRAIL_URL` 및 `PAPERTRAIL_PORT` 환경 변수로 정의할 수 있습니다. 해당 값은 [Papertrail](https://help.papertrailapp.com/kb/configuration/configuring-centralized-logging-from-php-apps/#send-events-from-php-app)에서 확인할 수 있습니다.


#### Slack 채널 설정 {#configuring-the-slack-channel}

`slack` 채널은 `url` 설정 옵션이 필요합니다. 이 값은 `LOG_SLACK_WEBHOOK_URL` 환경 변수로 정의할 수 있습니다. 이 URL은 Slack 팀에 대해 구성한 [인커밍 웹훅](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)의 URL과 일치해야 합니다.

기본적으로 Slack은 `critical` 레벨 이상의 로그만 수신합니다. 하지만, `LOG_LEVEL` 환경 변수나 Slack 로그 채널 설정 배열 내의 `level` 옵션을 수정하여 이를 조정할 수 있습니다.


### 사용 중단 경고 로깅 {#logging-deprecation-warnings}

PHP, Laravel, 그리고 기타 라이브러리는 종종 일부 기능이 사용 중단(deprecated)되었으며, 향후 버전에서 제거될 예정임을 사용자에게 알립니다. 이러한 사용 중단 경고를 로그로 남기고 싶다면, `LOG_DEPRECATIONS_CHANNEL` 환경 변수 또는 애플리케이션의 `config/logging.php` 설정 파일에서 원하는 `deprecations` 로그 채널을 지정할 수 있습니다:

```php
'deprecations' => [
    'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
    'trace' => env('LOG_DEPRECATIONS_TRACE', false),
],

'channels' => [
    // ...
]
```

또는, `deprecations`라는 이름의 로그 채널을 정의할 수도 있습니다. 이 이름의 로그 채널이 존재하면, 항상 사용 중단 경고를 기록하는 데 사용됩니다:

```php
'channels' => [
    'deprecations' => [
        'driver' => 'single',
        'path' => storage_path('logs/php-deprecation-warnings.log'),
    ],
],
```


## 로그 스택 구축 {#building-log-stacks}

앞서 언급했듯이, `stack` 드라이버를 사용하면 여러 채널을 하나의 로그 채널로 결합할 수 있습니다. 로그 스택 사용 방법을 보여주기 위해, 실제 운영 환경에서 볼 수 있는 예시 설정을 살펴보겠습니다:

```php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['syslog', 'slack'], // [!code ++]
        'ignore_exceptions' => false,
    ],

    'syslog' => [
        'driver' => 'syslog',
        'level' => env('LOG_LEVEL', 'debug'),
        'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
        'replace_placeholders' => true,
    ],

    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => env('LOG_SLACK_USERNAME', 'Laravel Log'),
        'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
        'level' => env('LOG_LEVEL', 'critical'),
        'replace_placeholders' => true,
    ],
],
```

이 설정을 살펴보면, 먼저 `stack` 채널이 `channels` 옵션을 통해 `syslog`와 `slack` 두 채널을 집계하고 있음을 알 수 있습니다. 따라서 로그 메시지를 기록할 때 두 채널 모두 메시지를 기록할 기회를 갖게 됩니다. 하지만 아래에서 보듯, 실제로 메시지가 기록되는지는 메시지의 심각도/레벨에 따라 달라질 수 있습니다.


#### 로그 레벨 {#log-levels}

위 예시에서 `syslog`와 `slack` 채널 설정에 있는 `level` 옵션에 주목하세요. 이 옵션은 해당 채널이 로그를 기록하기 위해 메시지가 가져야 할 최소 "레벨"을 결정합니다. Laravel의 로깅 서비스를 구동하는 Monolog은 [RFC 5424 명세](https://tools.ietf.org/html/rfc5424)에 정의된 모든 로그 레벨을 제공합니다. 심각도 순으로는 **emergency**, **alert**, **critical**, **error**, **warning**, **notice**, **info**, **debug** 입니다.

예를 들어, `debug` 메서드를 사용해 메시지를 기록한다고 가정해봅시다:

```php
Log::debug('An informational message.');
```

이 설정에서는 `syslog` 채널이 메시지를 시스템 로그에 기록하지만, 에러 메시지가 `critical` 이상이 아니므로 Slack에는 전송되지 않습니다. 하지만 `emergency` 메시지를 기록하면, `emergency` 레벨이 두 채널의 최소 레벨 임계값을 초과하므로 시스템 로그와 Slack 모두에 전송됩니다:

```php
Log::emergency('The system is down!');
```


## 로그 메시지 작성 {#writing-log-messages}

`Log` [파사드](/laravel/12.x/facades)를 사용하여 로그에 정보를 기록할 수 있습니다. 앞서 언급했듯이, 로거는 [RFC 5424 명세](https://tools.ietf.org/html/rfc5424)에 정의된 8가지 로그 레벨을 제공합니다: **emergency**, **alert**, **critical**, **error**, **warning**, **notice**, **info**, **debug**:

```php
use Illuminate\Support\Facades\Log;

Log::emergency($message);
Log::alert($message);
Log::critical($message);
Log::error($message);
Log::warning($message);
Log::notice($message);
Log::info($message);
Log::debug($message);
```

이 메서드 중 아무거나 호출하여 해당 레벨에 맞는 메시지를 기록할 수 있습니다. 기본적으로 메시지는 `logging` 설정 파일에 지정된 기본 로그 채널에 기록됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 주어진 사용자의 프로필을 보여줍니다.
     */
    public function show(string $id): View
    {
        Log::info('Showing the user profile for user: {id}', ['id' => $id]);

        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```


### 컨텍스트 정보 {#contextual-information}

컨텍스트 데이터 배열을 로그 메서드에 전달할 수 있습니다. 이 컨텍스트 데이터는 로그 메시지와 함께 포맷되어 표시됩니다:

```php
use Illuminate\Support\Facades\Log;

Log::info('User {id} failed to login.', ['id' => $user->id]);
```

때때로, 특정 채널의 모든 이후 로그 항목에 포함되어야 하는 컨텍스트 정보를 지정하고 싶을 수 있습니다. 예를 들어, 각 요청에 연관된 요청 ID를 로그에 남기고 싶을 때가 있습니다. 이를 위해 `Log` 파사드의 `withContext` 메서드를 호출할 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AssignRequestId
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = (string) Str::uuid();

        Log::withContext([
            'request-id' => $requestId
        ]);

        $response = $next($request);

        $response->headers->set('Request-Id', $requestId);

        return $response;
    }
}
```

_모든_ 로깅 채널에 컨텍스트 정보를 공유하고 싶다면, `Log::shareContext()` 메서드를 사용할 수 있습니다. 이 메서드는 이미 생성된 모든 채널과 이후 생성되는 채널에 컨텍스트 정보를 제공합니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AssignRequestId
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = (string) Str::uuid();

        Log::shareContext([
            'request-id' => $requestId
        ]);

        // ...
    }
}
```

> [!NOTE]
> 큐 작업을 처리하는 동안 로그 컨텍스트를 공유해야 한다면, [작업 미들웨어](/laravel/12.x/queues#job-middleware)를 활용할 수 있습니다.


### 특정 채널에 기록하기 {#writing-to-specific-channels}

때로는 애플리케이션의 기본 채널이 아닌 다른 채널에 메시지를 기록하고 싶을 수 있습니다. 이럴 때는 `Log` 파사드의 `channel` 메서드를 사용하여 설정 파일에 정의된 아무 채널이나 가져와서 기록할 수 있습니다:

```php
use Illuminate\Support\Facades\Log;

Log::channel('slack')->info('Something happened!');
```

여러 채널로 구성된 온디맨드(즉석) 로깅 스택을 만들고 싶다면, `stack` 메서드를 사용할 수 있습니다:

```php
Log::stack(['single', 'slack'])->info('Something happened!');
```


#### 온디맨드 채널 {#on-demand-channels}

애플리케이션의 `logging` 설정 파일에 해당 설정이 없어도, 런타임에 설정을 제공하여 온디맨드 채널을 생성할 수도 있습니다. 이를 위해 `Log` 파사드의 `build` 메서드에 설정 배열을 전달하면 됩니다:

```php
use Illuminate\Support\Facades\Log;

Log::build([
  'driver' => 'single',
  'path' => storage_path('logs/custom.log'),
])->info('Something happened!');
```

온디맨드 채널을 온디맨드 로깅 스택에 포함하고 싶을 수도 있습니다. 이 경우, `stack` 메서드에 전달하는 배열에 온디맨드 채널 인스턴스를 포함하면 됩니다:

```php
use Illuminate\Support\Facades\Log;

$channel = Log::build([
  'driver' => 'single',
  'path' => storage_path('logs/custom.log'),
]);

Log::stack(['slack', $channel])->info('Something happened!');
```


## Monolog 채널 커스터마이징 {#monolog-channel-customization}


### 채널별 Monolog 커스터마이징 {#customizing-monolog-for-channels}

기존 채널에 대해 Monolog이 어떻게 구성되는지 완전히 제어해야 할 때가 있습니다. 예를 들어, Laravel 내장 `single` 채널에 대해 커스텀 Monolog `FormatterInterface` 구현체를 설정하고 싶을 수 있습니다.

먼저, 채널 설정에 `tap` 배열을 정의하세요. `tap` 배열에는 Monolog 인스턴스가 생성된 후 이를 커스터마이징(또는 "탭")할 수 있는 클래스 목록이 들어갑니다. 이 클래스들을 둘 위치에 대한 규칙은 없으니, 애플리케이션 내에 디렉터리를 만들어 자유롭게 관리할 수 있습니다:

```php
'single' => [
    'driver' => 'single',
    'tap' => [App\Logging\CustomizeFormatter::class],
    'path' => storage_path('logs/laravel.log'),
    'level' => env('LOG_LEVEL', 'debug'),
    'replace_placeholders' => true,
],
```

채널의 `tap` 옵션을 설정했다면, 이제 Monolog 인스턴스를 커스터마이징할 클래스를 정의할 차례입니다. 이 클래스는 `Illuminate\Log\Logger` 인스턴스를 받는 `__invoke` 메서드 하나만 필요합니다. `Illuminate\Log\Logger` 인스턴스는 모든 메서드 호출을 내부 Monolog 인스턴스로 프록시합니다:

```php
<?php

namespace App\Logging;

use Illuminate\Log\Logger;
use Monolog\Formatter\LineFormatter;

class CustomizeFormatter
{
    /**
     * 주어진 로거 인스턴스를 커스터마이징합니다.
     */
    public function __invoke(Logger $logger): void
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new LineFormatter(
                '[%datetime%] %channel%.%level_name%: %message% %context% %extra%'
            ));
        }
    }
}
```

> [!NOTE]
> 모든 "tap" 클래스는 [서비스 컨테이너](/laravel/12.x/container)에 의해 해석되므로, 생성자에서 필요한 의존성은 자동으로 주입됩니다.


### Monolog 핸들러 채널 생성 {#creating-monolog-handler-channels}

Monolog에는 다양한 [핸들러](https://github.com/Seldaek/monolog/tree/main/src/Monolog/Handler)가 있지만, Laravel은 각각에 대한 내장 채널을 제공하지 않습니다. 경우에 따라, Laravel 로그 드라이버에 해당하는 것이 없는 특정 Monolog 핸들러 인스턴스만으로 커스텀 채널을 만들고 싶을 수 있습니다. 이런 채널은 `monolog` 드라이버를 사용해 쉽게 만들 수 있습니다.

`monolog` 드라이버를 사용할 때는, `handler` 설정 옵션으로 어떤 핸들러를 인스턴스화할지 지정합니다. 선택적으로, 핸들러가 필요로 하는 생성자 파라미터는 `handler_with` 설정 옵션으로 지정할 수 있습니다:

```php
'logentries' => [
    'driver'  => 'monolog',
    'handler' => Monolog\Handler\SyslogUdpHandler::class,
    'handler_with' => [
        'host' => 'my.logentries.internal.datahubhost.company.com',
        'port' => '10000',
    ],
],
```


#### Monolog 포매터 {#monolog-formatters}

`monolog` 드라이버를 사용할 때는 Monolog의 `LineFormatter`가 기본 포매터로 사용됩니다. 하지만, `formatter` 및 `formatter_with` 설정 옵션을 사용해 핸들러에 전달되는 포매터의 종류를 커스터마이징할 수 있습니다:

```php
'browser' => [
    'driver' => 'monolog',
    'handler' => Monolog\Handler\BrowserConsoleHandler::class,
    'formatter' => Monolog\Formatter\HtmlFormatter::class,
    'formatter_with' => [
        'dateFormat' => 'Y-m-d',
    ],
],
```

자체 포매터를 제공할 수 있는 Monolog 핸들러를 사용하는 경우, `formatter` 설정 옵션 값을 `default`로 지정할 수 있습니다:

```php
'newrelic' => [
    'driver' => 'monolog',
    'handler' => Monolog\Handler\NewRelicHandler::class,
    'formatter' => 'default',
],
```


#### Monolog 프로세서 {#monolog-processors}

Monolog은 로그를 기록하기 전에 메시지를 처리할 수도 있습니다. 직접 프로세서를 만들거나, [Monolog에서 제공하는 기존 프로세서](https://github.com/Seldaek/monolog/tree/main/src/Monolog/Processor)를 사용할 수 있습니다.

`monolog` 드라이버의 프로세서를 커스터마이징하려면, 채널 설정에 `processors` 값을 추가하세요:

```php
'memory' => [
    'driver' => 'monolog',
    'handler' => Monolog\Handler\StreamHandler::class,
    'handler_with' => [
        'stream' => 'php://stderr',
    ],
    'processors' => [
        // 간단한 문법...
        Monolog\Processor\MemoryUsageProcessor::class,

        // 옵션과 함께...
        [
            'processor' => Monolog\Processor\PsrLogMessageProcessor::class,
            'with' => ['removeUsedContextFields' => true],
        ],
    ],
],
```


### 팩토리를 통한 커스텀 채널 생성 {#creating-custom-channels-via-factories}

Monolog의 인스턴스화 및 설정을 완전히 제어할 수 있는 완전한 커스텀 채널을 정의하고 싶다면, `config/logging.php` 설정 파일에서 `custom` 드라이버 타입을 지정할 수 있습니다. 설정에는 Monolog 인스턴스를 생성할 팩토리 클래스의 이름이 들어간 `via` 옵션이 포함되어야 합니다:

```php
'channels' => [
    'example-custom-channel' => [
        'driver' => 'custom',
        'via' => App\Logging\CreateCustomLogger::class,
    ],
],
```

`custom` 드라이버 채널을 설정했다면, 이제 Monolog 인스턴스를 생성할 클래스를 정의할 차례입니다. 이 클래스는 Monolog 로거 인스턴스를 반환하는 `__invoke` 메서드 하나만 필요합니다. 이 메서드는 채널 설정 배열을 유일한 인자로 받습니다:

```php
<?php

namespace App\Logging;

use Monolog\Logger;

class CreateCustomLogger
{
    /**
     * 커스텀 Monolog 인스턴스를 생성합니다.
     */
    public function __invoke(array $config): Logger
    {
        return new Logger(/* ... */);
    }
}
```


## Pail을 사용한 로그 메시지 실시간 확인 {#tailing-log-messages-using-pail}

실시간으로 애플리케이션의 로그를 확인해야 할 때가 종종 있습니다. 예를 들어, 문제를 디버깅하거나 특정 유형의 에러를 모니터링할 때 그렇습니다.

Laravel Pail은 커맨드라인에서 Laravel 애플리케이션의 로그 파일을 쉽게 탐색할 수 있게 해주는 패키지입니다. 표준 `tail` 명령과 달리, Pail은 Sentry나 Flare 등 어떤 로그 드라이버와도 작동하도록 설계되었습니다. 또한, 원하는 정보를 빠르게 찾을 수 있도록 유용한 필터 기능도 제공합니다.

<img src="https://laravel.com/img/docs/pail-example.png">


### 설치 {#pail-installation}

> [!WARNING]
> Laravel Pail은 [PHP 8.2+](https://php.net/releases/) 및 [PCNTL](https://www.php.net/manual/en/book.pcntl.php) 확장이 필요합니다.

먼저, Composer 패키지 매니저를 사용해 Pail을 프로젝트에 설치하세요:

```shell
composer require laravel/pail
```


### 사용법 {#pail-usage}

로그 실시간 확인을 시작하려면, `pail` 명령을 실행하세요:

```shell
php artisan pail
```

출력의 상세도를 높이고 생략(…)을 방지하려면, `-v` 옵션을 사용하세요:

```shell
php artisan pail -v
```

최대 상세도와 예외 스택 트레이스 표시를 원한다면, `-vv` 옵션을 사용하세요:

```shell
php artisan pail -vv
```

로그 실시간 확인을 중지하려면 언제든 `Ctrl+C`를 누르세요.


### 로그 필터링 {#pail-filtering-logs}


#### `--filter` {#pail-filtering-logs-filter-option}

`--filter` 옵션을 사용해 로그를 타입, 파일, 메시지, 스택 트레이스 내용별로 필터링할 수 있습니다:

```shell
php artisan pail --filter="QueryException"
```


#### `--message` {#pail-filtering-logs-message-option}

메시지로만 로그를 필터링하려면, `--message` 옵션을 사용하세요:

```shell
php artisan pail --message="User created"
```


#### `--level` {#pail-filtering-logs-level-option}

`--level` 옵션을 사용해 [로그 레벨](#log-levels)별로 로그를 필터링할 수 있습니다:

```shell
php artisan pail --level=error
```


#### `--user` {#pail-filtering-logs-user-option}

특정 사용자가 인증된 상태에서 기록된 로그만 표시하려면, `--user` 옵션에 해당 사용자의 ID를 지정하세요:

```shell
php artisan pail --user=1
```
