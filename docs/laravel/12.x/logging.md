# [기본] 로깅




















## 소개 {#introduction}

애플리케이션에서 어떤 일이 일어나고 있는지 더 잘 파악할 수 있도록, Laravel은 강력한 로깅 서비스를 제공합니다. 이를 통해 메시지를 파일, 시스템 에러 로그, 심지어 Slack으로도 전송하여 팀 전체에 알릴 수 있습니다.

Laravel의 로깅은 "채널"을 기반으로 동작합니다. 각 채널은 로그 정보를 기록하는 특정 방식을 나타냅니다. 예를 들어, `single` 채널은 모든 로그를 하나의 파일에 기록하고, `slack` 채널은 로그 메시지를 Slack으로 전송합니다. 로그 메시지는 심각도에 따라 여러 채널에 동시에 기록될 수도 있습니다.

Laravel은 내부적으로 [Monolog](https://github.com/Seldaek/monolog) 라이브러리를 사용합니다. Monolog은 다양한 강력한 로그 핸들러를 지원하며, Laravel은 이러한 핸들러를 손쉽게 설정할 수 있도록 도와줍니다. 이를 통해 애플리케이션의 로그 처리 방식을 자유롭게 조합하고 커스터마이즈할 수 있습니다.


## 설정 {#configuration}

애플리케이션의 로깅 동작을 제어하는 모든 설정 옵션은 `config/logging.php` 설정 파일에 있습니다. 이 파일을 통해 애플리케이션의 로그 채널을 구성할 수 있으니, 사용 가능한 각 채널과 그 옵션을 꼭 확인해보세요. 아래에서는 몇 가지 일반적인 옵션을 살펴보겠습니다.

기본적으로 Laravel은 로그 메시지를 기록할 때 `stack` 채널을 사용합니다. `stack` 채널은 여러 로그 채널을 하나의 채널로 집계하는 데 사용됩니다. 스택을 구성하는 방법에 대한 자세한 내용은 [아래 문서](#building-log-stacks)를 참고하세요.


### 사용 가능한 채널 드라이버 {#available-channel-drivers}

각 로그 채널은 "드라이버"에 의해 구동됩니다. 드라이버는 로그 메시지가 실제로 어떻게, 어디에 기록될지를 결정합니다. 다음은 모든 Laravel 애플리케이션에서 사용할 수 있는 로그 채널 드라이버입니다. 대부분의 드라이버에 대한 항목이 이미 애플리케이션의 `config/logging.php` 설정 파일에 포함되어 있으니, 이 파일을 확인하여 내용을 숙지하시기 바랍니다.

<div class="overflow-auto">

| 이름           | 설명                                                                 |
| -------------- | -------------------------------------------------------------------- |
| `custom`       | 지정된 팩토리를 호출하여 채널을 생성하는 드라이버입니다.              |
| `daily`        | 매일 로그 파일을 순환하는 `RotatingFileHandler` 기반 Monolog 드라이버입니다. |
| `errorlog`     | `ErrorLogHandler` 기반 Monolog 드라이버입니다.                        |
| `monolog`      | 지원되는 모든 Monolog 핸들러를 사용할 수 있는 Monolog 팩토리 드라이버입니다. |
| `papertrail`   | `SyslogUdpHandler` 기반 Monolog 드라이버입니다.                       |
| `single`       | 단일 파일 또는 경로 기반의 로거 채널(`StreamHandler`)입니다.          |
| `slack`        | `SlackWebhookHandler` 기반 Monolog 드라이버입니다.                    |
| `stack`        | "멀티 채널" 채널 생성을 쉽게 해주는 래퍼입니다.                       |
| `syslog`       | `SyslogHandler` 기반 Monolog 드라이버입니다.                          |

</div>

> [!NOTE]
> `monolog` 및 `custom` 드라이버에 대해 더 자세히 알고 싶다면 [고급 채널 커스터마이징](#monolog-channel-customization) 문서를 참고하세요.


#### 채널 이름 설정하기 {#configuring-the-channel-name}

기본적으로 Monolog는 현재 환경(예: `production` 또는 `local`)과 일치하는 "채널 이름"으로 인스턴스화됩니다. 이 값을 변경하려면 채널 설정에 `name` 옵션을 추가하면 됩니다:

```php
'stack' => [
    'driver' => 'stack',
    'name' => 'channel-name',
    'channels' => ['single', 'slack'],
],
```


### 채널 사전 준비 사항 {#channel-prerequisites}


#### Single 및 Daily 채널 설정 {#configuring-the-single-and-daily-channels}

`single` 및 `daily` 채널에는 `bubble`, `permission`, `locking`의 세 가지 선택적 설정 옵션이 있습니다.

<div class="overflow-auto">

| 이름           | 설명                                                                 | 기본값   |
| -------------- | -------------------------------------------------------------------- | -------- |
| `bubble`       | 메시지가 처리된 후 다른 채널로 전파(bubble)되어야 하는지 여부를 지정합니다. | `true`   |
| `locking`      | 로그 파일에 기록하기 전에 파일 잠금을 시도할지 여부를 지정합니다.           | `false`  |
| `permission`   | 로그 파일의 권한을 지정합니다.                                         | `0644`   |

</div>

또한, `daily` 채널의 로그 보관 정책은 `LOG_DAILY_DAYS` 환경 변수 또는 `days` 설정 옵션을 통해 지정할 수 있습니다.

<div class="overflow-auto">

| 이름     | 설명                                              | 기본값   |
| -------- | ------------------------------------------------- | -------- |
| `days`   | 일별 로그 파일을 보관할 일 수를 지정합니다.        | `14`     |

</div>


#### Papertrail 채널 설정 {#configuring-the-papertrail-channel}

`papertrail` 채널은 `host`와 `port` 설정 옵션이 필요합니다. 이 값들은 `PAPERTRAIL_URL` 및 `PAPERTRAIL_PORT` 환경 변수로 정의할 수 있습니다. 해당 값들은 [Papertrail](https://help.papertrailapp.com/kb/configuration/configuring-centralized-logging-from-php-apps/#send-events-from-php-app)에서 확인할 수 있습니다.


#### Slack 채널 설정하기 {#configuring-the-slack-channel}

`slack` 채널은 `url` 설정 옵션이 필요합니다. 이 값은 `LOG_SLACK_WEBHOOK_URL` 환경 변수로 정의할 수 있습니다. 이 URL은 여러분이 Slack 팀에 대해 설정한 [인커밍 웹훅](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)의 URL과 일치해야 합니다.

기본적으로 Slack은 `critical` 레벨 이상의 로그만 수신합니다. 하지만, `LOG_LEVEL` 환경 변수를 사용하거나 Slack 로그 채널의 설정 배열 내에서 `level` 설정 옵션을 수정하여 이 동작을 조정할 수 있습니다.


### 사용 중단 경고 로깅 {#logging-deprecation-warnings}

PHP, Laravel, 그리고 기타 라이브러리들은 종종 일부 기능이 더 이상 지원되지 않으며, 향후 버전에서 제거될 예정임을 사용자에게 알립니다. 이러한 사용 중단(deprecation) 경고를 로깅하고 싶다면, `LOG_DEPRECATIONS_CHANNEL` 환경 변수를 사용하거나 애플리케이션의 `config/logging.php` 설정 파일에서 원하는 `deprecations` 로그 채널을 지정할 수 있습니다:

```php
'deprecations' => [
    'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
    'trace' => env('LOG_DEPRECATIONS_TRACE', false),
],

'channels' => [
    // ...
]
```

또는, `deprecations`라는 이름의 로그 채널을 직접 정의할 수도 있습니다. 만약 이 이름의 로그 채널이 존재한다면, 항상 해당 채널이 사용 중단 경고를 기록하는 데 사용됩니다:

```php
'channels' => [
    'deprecations' => [
        'driver' => 'single',
        'path' => storage_path('logs/php-deprecation-warnings.log'),
    ],
],
```


## 로그 스택 구축하기 {#building-log-stacks}

앞서 언급했듯이, `stack` 드라이버를 사용하면 여러 채널을 하나의 로그 채널로 결합하여 편리하게 사용할 수 있습니다. 로그 스택을 사용하는 방법을 설명하기 위해, 실제 운영 환경에서 볼 수 있는 예시 설정을 살펴보겠습니다:

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

이 설정을 하나씩 살펴보겠습니다. 먼저, `stack` 채널이 `channels` 옵션을 통해 `syslog`와 `slack` 두 개의 다른 채널을 집계하고 있다는 점에 주목하세요. 따라서 로그 메시지를 기록할 때, 이 두 채널 모두 해당 메시지를 기록할 기회를 갖게 됩니다. 하지만 아래에서 보겠지만, 실제로 이 채널들이 메시지를 기록할지는 메시지의 심각도(레벨)에 따라 결정될 수 있습니다.


#### 로그 레벨 {#log-levels}

위 예시에서 `syslog`와 `slack` 채널 설정에 있는 `level` 구성 옵션에 주목하세요. 이 옵션은 해당 채널에 로그가 기록되기 위해 메시지가 가져야 하는 최소 "레벨"을 결정합니다. 라라벨의 로깅 서비스를 구동하는 Monolog는 [RFC 5424 명세](https://tools.ietf.org/html/rfc5424)에 정의된 모든 로그 레벨을 제공합니다. 심각도 순서대로 나열하면 다음과 같습니다: **emergency**, **alert**, **critical**, **error**, **warning**, **notice**, **info**, **debug**.

예를 들어, `debug` 메서드를 사용해 메시지를 기록한다고 가정해봅시다:

```php
Log::debug('An informational message.');
```

이 설정에 따르면, `syslog` 채널은 이 메시지를 시스템 로그에 기록합니다. 하지만 이 메시지는 `critical` 이상의 레벨이 아니기 때문에 Slack으로는 전송되지 않습니다. 반면, `emergency` 메시지를 기록하면, `emergency` 레벨이 두 채널 모두의 최소 레벨 임계값을 초과하므로 시스템 로그와 Slack 모두에 전송됩니다:

```php
Log::emergency('The system is down!');
```


## 로그 메시지 작성하기 {#writing-log-messages}

`Log` [파사드](/laravel/12.x/facades)를 사용하여 로그에 정보를 기록할 수 있습니다. 앞서 언급했듯이, 로거는 [RFC 5424 명세](https://tools.ietf.org/html/rfc5424)에 정의된 여덟 가지 로그 레벨을 제공합니다: **emergency**, **alert**, **critical**, **error**, **warning**, **notice**, **info**, **debug**:

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

이 메서드들 중 어떤 것이든 호출하여 해당 레벨에 맞는 로그 메시지를 기록할 수 있습니다. 기본적으로 메시지는 `logging` 설정 파일에서 지정한 기본 로그 채널에 기록됩니다:

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

로그 메서드에 컨텍스트 데이터를 배열로 전달할 수 있습니다. 이 컨텍스트 데이터는 로그 메시지와 함께 포맷되어 표시됩니다:

```php
use Illuminate\Support\Facades\Log;

Log::info('User {id} failed to login.', ['id' => $user->id]);
```

때때로, 특정 채널의 이후 모든 로그 항목에 포함되어야 하는 컨텍스트 정보를 지정하고 싶을 수 있습니다. 예를 들어, 애플리케이션에 들어오는 각 요청에 연관된 요청 ID를 로그에 남기고 싶을 때가 있습니다. 이를 위해 `Log` 파사드의 `withContext` 메서드를 사용할 수 있습니다:

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

_모든_ 로깅 채널에 걸쳐 컨텍스트 정보를 공유하고 싶다면, `Log::shareContext()` 메서드를 사용할 수 있습니다. 이 메서드는 이미 생성된 채널과 이후에 생성되는 모든 채널에 컨텍스트 정보를 제공합니다:

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
> 큐에 등록된 작업을 처리하는 동안 로그 컨텍스트를 공유해야 한다면, [작업 미들웨어](/laravel/12.x/queues#job-middleware)를 활용할 수 있습니다.


### 특정 채널에 로그 기록하기 {#writing-to-specific-channels}

때때로 애플리케이션의 기본 채널이 아닌 다른 채널에 로그 메시지를 기록하고 싶을 수 있습니다. 이럴 때는 설정 파일에 정의된 채널 중 원하는 채널을 `Log` 파사드의 `channel` 메서드를 사용해 가져와 로그를 남길 수 있습니다:

```php
use Illuminate\Support\Facades\Log;

Log::channel('slack')->info('Something happened!');
```

여러 채널로 구성된 임시 로그 스택을 생성하고 싶다면, `stack` 메서드를 사용할 수 있습니다:

```php
Log::stack(['single', 'slack'])->info('Something happened!');
```


#### 온디맨드 채널 {#on-demand-channels}

애플리케이션의 `logging` 설정 파일에 해당 설정이 없어도, 런타임에 설정을 제공하여 온디맨드 채널을 생성할 수 있습니다. 이를 위해 `Log` 파사드의 `build` 메서드에 설정 배열을 전달하면 됩니다:

```php
use Illuminate\Support\Facades\Log;

Log::build([
  'driver' => 'single',
  'path' => storage_path('logs/custom.log'),
])->info('Something happened!');
```

온디맨드 채널을 온디맨드 로깅 스택에 포함시키고 싶을 수도 있습니다. 이 경우, `stack` 메서드에 전달하는 배열에 온디맨드 채널 인스턴스를 포함시키면 됩니다:

```php
use Illuminate\Support\Facades\Log;

$channel = Log::build([
  'driver' => 'single',
  'path' => storage_path('logs/custom.log'),
]);

Log::stack(['slack', $channel])->info('Something happened!');
```


## Monolog 채널 커스터마이징 {#monolog-channel-customization}


### 채널을 위한 Monolog 커스터마이징 {#customizing-monolog-for-channels}

때때로 기존 채널에 대해 Monolog이 어떻게 구성되는지 완전히 제어해야 할 때가 있습니다. 예를 들어, Laravel의 기본 `single` 채널에 대해 커스텀 Monolog `FormatterInterface` 구현을 설정하고 싶을 수 있습니다.

시작하려면, 채널 설정에 `tap` 배열을 정의하세요. `tap` 배열에는 Monolog 인스턴스가 생성된 후 이를 커스터마이즈(또는 "탭")할 수 있는 클래스들의 목록이 들어갑니다. 이러한 클래스들을 저장할 위치에 대한 규칙은 없으므로, 애플리케이션 내에 디렉터리를 만들어 자유롭게 관리할 수 있습니다:

```php
'single' => [
    'driver' => 'single',
    'tap' => [App\Logging\CustomizeFormatter::class],
    'path' => storage_path('logs/laravel.log'),
    'level' => env('LOG_LEVEL', 'debug'),
    'replace_placeholders' => true,
],
```

채널에 `tap` 옵션을 설정했다면, 이제 Monolog 인스턴스를 커스터마이즈할 클래스를 정의할 차례입니다. 이 클래스는 단 하나의 메서드, 즉 `Illuminate\Log\Logger` 인스턴스를 받는 `__invoke` 메서드만 필요합니다. `Illuminate\Log\Logger` 인스턴스는 모든 메서드 호출을 내부의 Monolog 인스턴스로 프록시합니다:

```php
<?php

namespace App\Logging;

use Illuminate\Log\Logger;
use Monolog\Formatter\LineFormatter;

class CustomizeFormatter
{
    /**
     * 주어진 로거 인스턴스를 커스터마이즈합니다.
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


### Monolog 핸들러 채널 생성하기 {#creating-monolog-handler-channels}

Monolog에는 다양한 [사용 가능한 핸들러](https://github.com/Seldaek/monolog/tree/main/src/Monolog/Handler)가 있으며, Laravel은 각 핸들러에 대한 내장 채널을 모두 제공하지 않습니다. 경우에 따라, Laravel 로그 드라이버가 따로 없는 특정 Monolog 핸들러의 인스턴스를 사용하는 커스텀 채널을 직접 만들고 싶을 수 있습니다. 이러한 채널은 `monolog` 드라이버를 사용하여 쉽게 생성할 수 있습니다.

`monolog` 드라이버를 사용할 때는, `handler` 설정 옵션을 통해 인스턴스화할 핸들러를 지정합니다. 선택적으로, 해당 핸들러의 생성자에 필요한 파라미터는 `handler_with` 설정 옵션을 사용해 전달할 수 있습니다:

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

`monolog` 드라이버를 사용할 때, 기본적으로 Monolog의 `LineFormatter`가 사용됩니다. 하지만, `formatter`와 `formatter_with` 설정 옵션을 사용하여 핸들러에 전달되는 포매터의 종류를 커스터마이즈할 수 있습니다:

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

만약 자체적으로 포매터를 제공할 수 있는 Monolog 핸들러를 사용한다면, `formatter` 설정 옵션의 값을 `default`로 지정할 수 있습니다:

```php
'newrelic' => [
    'driver' => 'monolog',
    'handler' => Monolog\Handler\NewRelicHandler::class,
    'formatter' => 'default',
],
```


#### Monolog 프로세서 {#monolog-processors}

Monolog은 로그를 기록하기 전에 메시지를 처리할 수도 있습니다. 직접 프로세서를 만들거나 [Monolog에서 제공하는 기존 프로세서](https://github.com/Seldaek/monolog/tree/main/src/Monolog/Processor)를 사용할 수 있습니다.

`monolog` 드라이버의 프로세서를 커스터마이즈하고 싶다면, 채널 설정에 `processors` 설정 값을 추가하면 됩니다:

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

        // 옵션과 함께 사용...
        [
            'processor' => Monolog\Processor\PsrLogMessageProcessor::class,
            'with' => ['removeUsedContextFields' => true],
        ],
    ],
],
```


### 팩토리를 통한 커스텀 채널 생성 {#creating-custom-channels-via-factories}

Monolog의 인스턴스화와 설정을 완전히 제어할 수 있는 완전한 커스텀 채널을 정의하고 싶다면, `config/logging.php` 설정 파일에서 `custom` 드라이버 타입을 지정할 수 있습니다. 이 설정에는 Monolog 인스턴스를 생성할 때 호출될 팩토리 클래스의 이름을 담는 `via` 옵션이 포함되어야 합니다:

```php
'channels' => [
    'example-custom-channel' => [
        'driver' => 'custom',
        'via' => App\Logging\CreateCustomLogger::class,
    ],
],
```

`custom` 드라이버 채널을 설정했다면, 이제 Monolog 인스턴스를 생성할 클래스를 정의할 차례입니다. 이 클래스는 단일 `__invoke` 메서드만 필요하며, 이 메서드는 Monolog 로거 인스턴스를 반환해야 합니다. 이 메서드는 채널의 설정 배열을 유일한 인자로 받게 됩니다:

```php
<?php

namespace App\Logging;

use Monolog\Logger;

class CreateCustomLogger
{
    /**
     * 커스텀 Monolog 인스턴스 생성.
     */
    public function __invoke(array $config): Logger
    {
        return new Logger(/* ... */);
    }
}
```


## Pail을 사용한 로그 메시지 실시간 확인 {#tailing-log-messages-using-pail}

애플리케이션의 로그를 실시간으로 확인해야 할 때가 자주 있습니다. 예를 들어, 문제를 디버깅하거나 특정 유형의 오류를 모니터링할 때 로그를 실시간으로 확인하는 것이 유용합니다.

Laravel Pail은 명령줄에서 직접 Laravel 애플리케이션의 로그 파일을 손쉽게 탐색할 수 있도록 도와주는 패키지입니다. 표준 `tail` 명령어와 달리, Pail은 Sentry나 Flare와 같은 다양한 로그 드라이버와도 호환되도록 설계되었습니다. 또한, Pail은 원하는 정보를 빠르게 찾을 수 있도록 다양한 유용한 필터 기능을 제공합니다.

<img src="https://laravel.com/img/docs/pail-example.png">


### 설치 {#pail-installation}

> [!WARNING]
> Laravel Pail은 [PHP 8.2 이상](https://php.net/releases/)과 [PCNTL](https://www.php.net/manual/en/book.pcntl.php) 확장 모듈이 필요합니다.

시작하려면 Composer 패키지 관리자를 사용하여 프로젝트에 Pail을 설치하세요:

```shell
composer require laravel/pail
```


### 사용법 {#pail-usage}

로그를 실시간으로 확인하려면 `pail` 명령어를 실행하세요:

```shell
php artisan pail
```

출력의 상세 수준을 높이고 생략(…)을 방지하려면 `-v` 옵션을 사용하세요:

```shell
php artisan pail -v
```

최대 상세 수준으로 예외의 스택 트레이스까지 표시하려면 `-vv` 옵션을 사용하세요:

```shell
php artisan pail -vv
```

로그 확인을 중지하려면 언제든지 `Ctrl+C`를 누르세요.


### 로그 필터링 {#pail-filtering-logs}


#### `--filter` {#pail-filtering-logs-filter-option}

`--filter` 옵션을 사용하여 로그를 타입, 파일, 메시지, 스택 트레이스 내용으로 필터링할 수 있습니다:

```shell
php artisan pail --filter="QueryException"
```


#### `--message` {#pail-filtering-logs-message-option}

로그를 메시지 내용으로만 필터링하려면 `--message` 옵션을 사용할 수 있습니다:

```shell
php artisan pail --message="User created"
```


#### `--level` {#pail-filtering-logs-level-option}

`--level` 옵션은 [로그 레벨](#log-levels)로 로그를 필터링할 때 사용할 수 있습니다:

```shell
php artisan pail --level=error
```


#### `--user` {#pail-filtering-logs-user-option}

특정 사용자가 인증된 상태에서 작성된 로그만 표시하려면, `--user` 옵션에 해당 사용자의 ID를 지정할 수 있습니다:

```shell
php artisan pail --user=1
```
