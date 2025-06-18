# [패키지] Laravel Reverb





















## 소개 {#introduction}

[Laravel Reverb](https://github.com/laravel/reverb)는 매우 빠르고 확장 가능한 실시간 WebSocket 통신을 Laravel 애플리케이션에 직접 제공하며, Laravel의 기존 [이벤트 브로드캐스팅 도구](/laravel/12.x/broadcasting)와의 완벽한 통합을 지원합니다.


## 설치 {#installation}

`install:broadcasting` Artisan 명령어를 사용하여 Reverb를 설치할 수 있습니다:

```shell
php artisan install:broadcasting
```


## 설정 {#configuration}

백그라운드에서 `install:broadcasting` Artisan 명령은 `reverb:install` 명령을 실행하여, 합리적인 기본 설정 옵션과 함께 Reverb를 설치합니다. 설정을 변경하고 싶다면, Reverb의 환경 변수를 업데이트하거나 `config/reverb.php` 설정 파일을 수정하면 됩니다.


### 애플리케이션 자격 증명 {#application-credentials}

Reverb에 연결을 설정하려면 클라이언트와 서버 간에 Reverb "애플리케이션" 자격 증명 세트를 교환해야 합니다. 이 자격 증명은 서버에 구성되며, 클라이언트의 요청을 검증하는 데 사용됩니다. 다음 환경 변수를 사용하여 이 자격 증명을 정의할 수 있습니다:

```ini
REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
```


### 허용된 오리진 {#allowed-origins}

클라이언트 요청이 발생할 수 있는 오리진을 정의하려면 `config/reverb.php` 설정 파일의 `apps` 섹션 내에 있는 `allowed_origins` 설정 값을 수정하면 됩니다. 허용된 오리진에 포함되지 않은 오리진에서의 모든 요청은 거부됩니다. 모든 오리진을 허용하려면 `*`를 사용할 수 있습니다:

```php
'apps' => [
    [
        'app_id' => 'my-app-id',
        'allowed_origins' => ['laravel.com'],
        // ...
    ]
]
```


### 추가 애플리케이션 {#additional-applications}

일반적으로 Reverb는 설치된 애플리케이션을 위한 WebSocket 서버를 제공합니다. 하지만 하나의 Reverb 설치로 여러 애플리케이션을 서비스하는 것도 가능합니다.

예를 들어, 하나의 Laravel 애플리케이션을 유지하면서 Reverb를 통해 여러 애플리케이션에 WebSocket 연결을 제공하고 싶을 수 있습니다. 이는 애플리케이션의 `config/reverb.php` 설정 파일에서 여러 개의 `apps`를 정의함으로써 달성할 수 있습니다:

```php
'apps' => [
    [
        'app_id' => 'my-app-one',
        // ...
    ],
    [
        'app_id' => 'my-app-two',
        // ...
    ],
],
```


### SSL {#ssl}

대부분의 경우, 보안 WebSocket 연결은 요청이 Reverb 서버로 프록시되기 전에 상위 웹 서버(Nginx 등)에서 처리됩니다.

하지만 로컬 개발 중과 같이 Reverb 서버가 직접 보안 연결을 처리하는 것이 유용할 때도 있습니다. [Laravel Herd](https://herd.laravel.com)의 보안 사이트 기능을 사용하거나, [Laravel Valet](/laravel/12.x/valet)를 사용 중이고 애플리케이션에 [secure 명령어](/laravel/12.x/valet#securing-sites)를 실행했다면, 사이트에 대해 생성된 Herd / Valet 인증서를 사용하여 Reverb 연결을 보호할 수 있습니다. 이를 위해서는 `REVERB_HOST` 환경 변수를 사이트의 호스트명으로 설정하거나, Reverb 서버를 시작할 때 명시적으로 hostname 옵션을 전달하면 됩니다:

```shell
php artisan reverb:start --host="0.0.0.0" --port=8080 --hostname="laravel.test"
```

Herd와 Valet 도메인은 `localhost`로 해석되므로, 위 명령어를 실행하면 Reverb 서버에 보안 WebSocket 프로토콜(`wss`)을 통해 `wss://laravel.test:8080`으로 접근할 수 있습니다.

또한, 애플리케이션의 `config/reverb.php` 설정 파일에서 `tls` 옵션을 정의하여 인증서를 직접 선택할 수도 있습니다. `tls` 옵션 배열 내에는 [PHP의 SSL 컨텍스트 옵션](https://www.php.net/manual/en/context.ssl.php)에서 지원하는 어떤 옵션도 지정할 수 있습니다:

```php
'options' => [
    'tls' => [
        'local_cert' => '/path/to/cert.pem'
    ],
],
```


## 서버 실행하기 {#running-server}

Reverb 서버는 `reverb:start` Artisan 명령어를 사용하여 시작할 수 있습니다:

```shell
php artisan reverb:start
```

기본적으로 Reverb 서버는 `0.0.0.0:8080`에서 시작되며, 모든 네트워크 인터페이스에서 접근할 수 있습니다.

서버를 시작할 때 `--host`와 `--port` 옵션을 통해 사용자 지정 호스트나 포트를 지정할 수도 있습니다:

```shell
php artisan reverb:start --host=127.0.0.1 --port=9000
```

또는, 애플리케이션의 `.env` 설정 파일에 `REVERB_SERVER_HOST`와 `REVERB_SERVER_PORT` 환경 변수를 정의할 수도 있습니다.

`REVERB_SERVER_HOST`와 `REVERB_SERVER_PORT` 환경 변수는 `REVERB_HOST`와 `REVERB_PORT`와 혼동해서는 안 됩니다. 전자는 Reverb 서버 자체가 실행될 호스트와 포트를 지정하며, 후자는 Laravel이 브로드캐스트 메시지를 어디로 보낼지 지정합니다. 예를 들어, 프로덕션 환경에서는 공개 Reverb 호스트네임의 443 포트에서 들어오는 요청을 `0.0.0.0:8080`에서 동작하는 Reverb 서버로 라우팅할 수 있습니다. 이 경우 환경 변수는 다음과 같이 정의됩니다:

```ini
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080

REVERB_HOST=ws.laravel.com
REVERB_PORT=443
```


### 디버깅 {#debugging}

성능 향상을 위해 Reverb는 기본적으로 디버그 정보를 출력하지 않습니다. Reverb 서버를 통과하는 데이터 스트림을 확인하고 싶다면, `reverb:start` 명령어에 `--debug` 옵션을 추가하면 됩니다:

```shell
php artisan reverb:start --debug
```


### 재시작 {#restarting}

Reverb는 장시간 실행되는 프로세스이기 때문에, 코드에 변경 사항이 있을 경우 `reverb:restart` Artisan 명령어를 통해 서버를 재시작해야만 변경 사항이 반영됩니다.

`reverb:restart` 명령어는 서버를 중지하기 전에 모든 연결이 정상적으로 종료되도록 보장합니다. 만약 Supervisor와 같은 프로세스 관리자를 사용하여 Reverb를 실행 중이라면, 모든 연결이 종료된 후 프로세스 관리자가 서버를 자동으로 재시작합니다:

```shell
php artisan reverb:restart
```


## 모니터링 {#monitoring}

Reverb는 [Laravel Pulse](/laravel/12.x/pulse)와의 통합을 통해 모니터링할 수 있습니다. Reverb의 Pulse 통합을 활성화하면 서버에서 처리되는 연결 수와 메시지 수를 추적할 수 있습니다.

통합을 활성화하려면 먼저 [Pulse를 설치](/laravel/12.x/pulse#installation)했는지 확인해야 합니다. 그런 다음, Reverb의 레코더 중 원하는 것을 애플리케이션의 `config/pulse.php` 설정 파일에 추가하세요:

```php
use Laravel\Reverb\Pulse\Recorders\ReverbConnections;
use Laravel\Reverb\Pulse\Recorders\ReverbMessages;

'recorders' => [
    ReverbConnections::class => [
        'sample_rate' => 1,
    ],

    ReverbMessages::class => [
        'sample_rate' => 1,
    ],

    // ...
],
```

다음으로, 각 레코더에 대한 Pulse 카드를 [Pulse 대시보드](/laravel/12.x/pulse#dashboard-customization)에 추가하세요:

```blade
<x-pulse>
    <livewire:reverb.connections cols="full" />
    <livewire:reverb.messages cols="full" />
    ...
</x-pulse>
```

연결 활동은 주기적으로 새로운 업데이트를 폴링하여 기록됩니다. 이 정보가 Pulse 대시보드에 올바르게 표시되도록 하려면, Reverb 서버에서 `pulse:check` 데몬을 실행해야 합니다. 만약 Reverb를 [수평 확장](#scaling) 구성으로 실행 중이라면, 이 데몬은 서버 중 한 곳에서만 실행해야 합니다.


## 프로덕션 환경에서 Reverb 실행하기 {#production}

WebSocket 서버는 장시간 실행되기 때문에, 서버와 호스팅 환경을 최적화하여 Reverb 서버가 사용 가능한 리소스 내에서 최적의 연결 수를 효과적으로 처리할 수 있도록 해야 할 수 있습니다.

> [!NOTE]
> 만약 여러분의 사이트가 [Laravel Forge](https://forge.laravel.com)로 관리되고 있다면, "Application" 패널에서 Reverb를 위한 서버 최적화를 자동으로 수행할 수 있습니다. Reverb 통합을 활성화하면, Forge는 필요한 확장 프로그램 설치와 허용 연결 수 증가 등 서버가 프로덕션 환경에 적합하도록 보장해줍니다.


### 열린 파일 {#open-files}

각 WebSocket 연결은 클라이언트나 서버가 연결을 끊을 때까지 메모리에 유지됩니다. Unix 및 Unix 계열 환경에서는 각 연결이 파일로 표현됩니다. 하지만 운영 체제와 애플리케이션 수준 모두에서 허용되는 열린 파일의 수에는 종종 제한이 있습니다.


#### 운영 체제 {#operating-system}

유닉스 기반 운영 체제에서는 `ulimit` 명령어를 사용하여 허용된 열린 파일 수를 확인할 수 있습니다:

```shell
ulimit -n
```

이 명령어는 서로 다른 사용자에 대해 허용된 열린 파일 제한을 표시합니다. 이러한 값을 변경하려면 `/etc/security/limits.conf` 파일을 수정하면 됩니다. 예를 들어, `forge` 사용자에 대해 최대 열린 파일 수를 10,000으로 업데이트하려면 다음과 같이 설정할 수 있습니다:

```ini
# /etc/security/limits.conf
forge        soft  nofile  10000
forge        hard  nofile  10000
```


### 이벤트 루프 {#event-loop}

내부적으로 Reverb는 서버에서 WebSocket 연결을 관리하기 위해 ReactPHP 이벤트 루프를 사용합니다. 기본적으로 이 이벤트 루프는 추가 확장 없이 사용할 수 있는 `stream_select`에 의해 구동됩니다. 하지만 `stream_select`는 일반적으로 1,024개의 열린 파일로 제한됩니다. 따라서 1,000개 이상의 동시 연결을 처리할 계획이라면 동일한 제한에 묶이지 않는 대체 이벤트 루프를 사용해야 합니다.

Reverb는 `ext-uv` 기반의 루프가 사용 가능할 경우 자동으로 해당 루프로 전환합니다. 이 PHP 확장은 PECL을 통해 설치할 수 있습니다:

```shell
pecl install uv
```


### 웹 서버 {#web-server}

대부분의 경우, Reverb는 서버에서 외부에 노출되지 않는 포트에서 실행됩니다. 따라서 Reverb로 트래픽을 라우팅하려면 리버스 프록시를 구성해야 합니다. Reverb가 호스트 `0.0.0.0`과 포트 `8080`에서 실행되고 있고, 서버가 Nginx 웹 서버를 사용한다고 가정하면, 다음과 같은 Nginx 사이트 설정을 통해 Reverb 서버에 대한 리버스 프록시를 정의할 수 있습니다:

```nginx
server {
    ...

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header Scheme $scheme;
        proxy_set_header SERVER_PORT $server_port;
        proxy_set_header REMOTE_ADDR $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        proxy_pass http://0.0.0.0:8080;
    }

    ...
}
```

> [!WARNING]
> Reverb는 `/app`에서 WebSocket 연결을 수신하고, `/apps`에서 API 요청을 처리합니다. Reverb 요청을 처리하는 웹 서버가 이 두 URI 모두를 제공할 수 있는지 반드시 확인해야 합니다. 서버 관리를 위해 [Laravel Forge](https://forge.laravel.com)를 사용하는 경우, Reverb 서버는 기본적으로 올바르게 구성됩니다.

일반적으로 웹 서버는 서버 과부하를 방지하기 위해 허용되는 연결 수를 제한하도록 설정되어 있습니다. Nginx 웹 서버에서 허용되는 연결 수를 10,000으로 늘리려면, `nginx.conf` 파일의 `worker_rlimit_nofile` 및 `worker_connections` 값을 다음과 같이 수정해야 합니다:

```nginx
user forge;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
worker_rlimit_nofile 10000;

events {
  worker_connections 10000;
  multi_accept on;
}
```

위 설정은 프로세스당 최대 10,000개의 Nginx 워커가 생성될 수 있도록 허용합니다. 또한, 이 설정은 Nginx의 열린 파일 제한을 10,000으로 설정합니다.


### 포트 {#ports}

유닉스 기반 운영 체제는 일반적으로 서버에서 열 수 있는 포트의 수를 제한합니다. 현재 허용된 범위는 다음 명령어로 확인할 수 있습니다:

```shell
cat /proc/sys/net/ipv4/ip_local_port_range
# 32768	60999
```

위 출력 결과는 서버가 최대 28,231개(60,999 - 32,768)의 연결을 처리할 수 있음을 보여줍니다. 이는 각 연결마다 사용 가능한 포트가 필요하기 때문입니다. 허용되는 연결 수를 늘리기 위해 [수평 확장](#scaling)을 권장하지만, 서버의 `/etc/sysctl.conf` 설정 파일에서 허용 포트 범위를 업데이트하여 사용 가능한 오픈 포트 수를 늘릴 수도 있습니다.


### 프로세스 관리 {#process-management}

대부분의 경우, Reverb 서버가 지속적으로 실행되도록 Supervisor와 같은 프로세스 관리자를 사용하는 것이 좋습니다. Supervisor를 사용하여 Reverb를 실행하는 경우, 서버의 `supervisor.conf` 파일에서 `minfds` 설정을 업데이트하여 Supervisor가 Reverb 서버에 대한 연결을 처리하는 데 필요한 파일을 열 수 있도록 해야 합니다:

```ini
[supervisord]
...
minfds=10000
```


### 확장 {#scaling}

단일 서버에서 허용하는 것보다 더 많은 연결을 처리해야 하는 경우, Reverb 서버를 수평적으로 확장할 수 있습니다. Redis의 publish / subscribe 기능을 활용하여, Reverb는 여러 서버에 걸쳐 연결을 관리할 수 있습니다. 애플리케이션의 Reverb 서버 중 하나가 메시지를 수신하면, 해당 서버는 Redis를 사용하여 들어오는 메시지를 다른 모든 서버에 게시합니다.

수평 확장을 활성화하려면, 애플리케이션의 `.env` 구성 파일에서 `REVERB_SCALING_ENABLED` 환경 변수를 `true`로 설정해야 합니다:

```env
REVERB_SCALING_ENABLED=true
```

다음으로, 모든 Reverb 서버가 통신할 수 있는 전용 중앙 Redis 서버를 준비해야 합니다. Reverb는 [애플리케이션에 구성된 기본 Redis 연결](/laravel/12.x/redis#configuration)을 사용하여 모든 Reverb 서버에 메시지를 게시합니다.

Reverb의 확장 옵션을 활성화하고 Redis 서버를 구성한 후에는, Redis 서버와 통신할 수 있는 여러 서버에서 `reverb:start` 명령을 실행하면 됩니다. 이러한 Reverb 서버들은 로드 밸런서 뒤에 배치되어, 들어오는 요청이 서버들에 고르게 분산되도록 해야 합니다.
