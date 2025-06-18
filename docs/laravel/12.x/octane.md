# [패키지] Laravel Octane


























## 소개 {#introduction}

[Laravel Octane](https://github.com/laravel/octane)는 [FrankenPHP](https://frankenphp.dev/), [Open Swoole](https://openswoole.com/), [Swoole](https://github.com/swoole/swoole-src), [RoadRunner](https://roadrunner.dev)와 같은 고성능 애플리케이션 서버를 사용하여 애플리케이션의 성능을 극대화합니다. Octane은 애플리케이션을 한 번 부팅한 후 메모리에 유지하고, 이후 초고속으로 요청을 처리합니다.


## 설치 {#installation}

Octane은 Composer 패키지 관리자를 통해 설치할 수 있습니다:

```shell
composer require laravel/octane
```

Octane을 설치한 후, `octane:install` Artisan 명령어를 실행하여 Octane의 설정 파일을 애플리케이션에 설치할 수 있습니다:

```shell
php artisan octane:install
```


## 서버 필수 조건 {#server-prerequisites}

> [!WARNING]
> Laravel Octane은 [PHP 8.1+](https://php.net/releases/)가 필요합니다.


### FrankenPHP {#frankenphp}

[FrankenPHP](https://frankenphp.dev)는 Go로 작성된 PHP 애플리케이션 서버로, early hints, Brotli, Zstandard 압축과 같은 최신 웹 기능을 지원합니다. Octane을 설치하고 서버로 FrankenPHP를 선택하면, Octane이 FrankenPHP 바이너리를 자동으로 다운로드하고 설치해줍니다.


#### FrankenPHP를 Laravel Sail에서 사용하기 {#frankenphp-via-laravel-sail}

[Laravel Sail](/laravel/12.x/sail)을 사용하여 애플리케이션을 개발할 계획이라면, 다음 명령어를 실행하여 Octane과 FrankenPHP를 설치해야 합니다:

```shell
./vendor/bin/sail up

./vendor/bin/sail composer require laravel/octane
```

다음으로, `octane:install` Artisan 명령어를 사용하여 FrankenPHP 바이너리를 설치해야 합니다:

```shell
./vendor/bin/sail artisan octane:install --server=frankenphp
```

마지막으로, 애플리케이션의 `docker-compose.yml` 파일에서 `laravel.test` 서비스 정의에 `SUPERVISOR_PHP_COMMAND` 환경 변수를 추가하세요. 이 환경 변수에는 Sail이 PHP 개발 서버 대신 Octane을 사용하여 애플리케이션을 제공할 때 사용할 명령어가 들어갑니다:

```yaml
services:
  laravel.test:
    environment:
      SUPERVISOR_PHP_COMMAND: "/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan octane:start --server=frankenphp --host=0.0.0.0 --admin-port=2019 --port='${APP_PORT:-80}'" # [!code ++]
      XDG_CONFIG_HOME:  /var/www/html/config # [!code ++]
      XDG_DATA_HOME:  /var/www/html/data # [!code ++]
```

HTTPS, HTTP/2, HTTP/3를 활성화하려면, 대신 다음과 같이 수정하세요:

```yaml
services:
  laravel.test:
    ports:
        - '${APP_PORT:-80}:80'
        - '${VITE_PORT:-5173}:${VITE_PORT:-5173}'
        - '443:443' # [!code ++]
        - '443:443/udp' # [!code ++]
    environment:
      SUPERVISOR_PHP_COMMAND: "/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan octane:start --host=localhost --port=443 --admin-port=2019 --https" # [!code ++]
      XDG_CONFIG_HOME:  /var/www/html/config # [!code ++]
      XDG_DATA_HOME:  /var/www/html/data # [!code ++]
```

일반적으로 FrankenPHP Sail 애플리케이션에는 `https://localhost`로 접속해야 하며, `https://127.0.0.1`을 사용하려면 추가 구성이 필요하므로 [권장되지 않습니다](https://frankenphp.dev/docs/known-issues/#using-https127001-with-docker).


#### Docker를 통한 FrankenPHP 사용 {#frankenphp-via-docker}

FrankenPHP의 공식 Docker 이미지를 사용하면 성능이 향상되고, FrankenPHP의 정적 설치에 포함되지 않은 추가 확장 기능을 사용할 수 있습니다. 또한, 공식 Docker 이미지는 FrankenPHP가 기본적으로 지원하지 않는 Windows와 같은 플랫폼에서도 실행할 수 있도록 지원합니다. FrankenPHP의 공식 Docker 이미지는 로컬 개발과 프로덕션 환경 모두에 적합합니다.

FrankenPHP 기반의 Laravel 애플리케이션을 컨테이너화할 때 다음 Dockerfile을 시작점으로 사용할 수 있습니다:

```dockerfile
FROM dunglas/frankenphp

RUN install-php-extensions \
    pcntl
    # 여기에 다른 PHP 확장 기능을 추가하세요...

COPY . /app

ENTRYPOINT ["php", "artisan", "octane:frankenphp"]
```

개발 중에는 다음 Docker Compose 파일을 사용하여 애플리케이션을 실행할 수 있습니다:

```yaml
# compose.yaml
services:
  frankenphp:
    build:
      context: .
    entrypoint: php artisan octane:frankenphp --workers=1 --max-requests=1
    ports:
      - "8000:8000"
    volumes:
      - .:/app
```

`php artisan octane:start` 명령어에 `--log-level` 옵션을 명시적으로 전달하면, Octane은 FrankenPHP의 기본 로거를 사용하며, 별도로 설정하지 않는 한 구조화된 JSON 로그를 생성합니다.

FrankenPHP를 Docker와 함께 실행하는 방법에 대한 자세한 내용은 [공식 FrankenPHP 문서](https://frankenphp.dev/docs/docker/)를 참고하세요.


### RoadRunner {#roadrunner}

[RoadRunner](https://roadrunner.dev)는 Go로 작성된 RoadRunner 바이너리를 기반으로 동작합니다. RoadRunner 기반의 Octane 서버를 처음 시작할 때, Octane은 RoadRunner 바이너리를 다운로드하고 설치할 것인지 안내합니다.


#### Laravel Sail을 통한 RoadRunner {#roadrunner-via-laravel-sail}

[Laravel Sail](/laravel/12.x/sail)를 사용하여 애플리케이션을 개발할 계획이라면, 다음 명령어를 실행하여 Octane과 RoadRunner를 설치해야 합니다:

```shell
./vendor/bin/sail up

./vendor/bin/sail composer require laravel/octane spiral/roadrunner-cli spiral/roadrunner-http
```

다음으로, Sail 셸을 시작한 후 `rr` 실행 파일을 사용하여 RoadRunner 바이너리의 최신 Linux 기반 빌드를 받아야 합니다:

```shell
./vendor/bin/sail shell

# Sail 셸 내에서...
./vendor/bin/rr get-binary
```

그런 다음, 애플리케이션의 `docker-compose.yml` 파일에서 `laravel.test` 서비스 정의에 `SUPERVISOR_PHP_COMMAND` 환경 변수를 추가하세요. 이 환경 변수에는 Sail이 PHP 개발 서버 대신 Octane을 사용하여 애플리케이션을 제공할 때 사용할 명령어가 포함됩니다:

```yaml
services:
  laravel.test:
    environment:
      SUPERVISOR_PHP_COMMAND: "/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan octane:start --server=roadrunner --host=0.0.0.0 --rpc-port=6001 --port='${APP_PORT:-80}'" # [!code ++]
```

마지막으로, `rr` 바이너리가 실행 가능하도록 설정하고 Sail 이미지를 빌드하세요:

```shell
chmod +x ./rr

./vendor/bin/sail build --no-cache
```


### Swoole {#swoole}

Laravel Octane 애플리케이션을 Swoole 애플리케이션 서버로 제공하려면 Swoole PHP 확장 프로그램을 설치해야 합니다. 일반적으로 PECL을 통해 설치할 수 있습니다:

```shell
pecl install swoole
```


#### Open Swoole {#openswoole}

Laravel Octane 애플리케이션을 Open Swoole 애플리케이션 서버로 제공하려면 Open Swoole PHP 확장 프로그램을 설치해야 합니다. 일반적으로 PECL을 통해 설치할 수 있습니다:

```shell
pecl install openswoole
```

Open Swoole과 함께 Laravel Octane을 사용하면 Swoole이 제공하는 동시 작업, 틱, 인터벌과 같은 동일한 기능을 사용할 수 있습니다.


#### Laravel Sail을 통한 Swoole {#swoole-via-laravel-sail}

> [!WARNING]
> Octane 애플리케이션을 Sail을 통해 제공하기 전에, Laravel Sail의 최신 버전을 사용하고 있는지 확인한 후 애플리케이션의 루트 디렉터리에서 `./vendor/bin/sail build --no-cache` 명령어를 실행하세요.

또는, [Laravel Sail](/laravel/12.x/sail)을 사용하여 Swoole 기반 Octane 애플리케이션을 개발할 수도 있습니다. Laravel Sail은 Laravel의 공식 Docker 기반 개발 환경이며, 기본적으로 Swoole 확장 기능을 포함하고 있습니다. 하지만, Sail에서 사용하는 `docker-compose.yml` 파일을 여전히 수정해야 합니다.

시작하려면, 애플리케이션의 `docker-compose.yml` 파일에서 `laravel.test` 서비스 정의에 `SUPERVISOR_PHP_COMMAND` 환경 변수를 추가하세요. 이 환경 변수에는 Sail이 PHP 개발 서버 대신 Octane을 사용하여 애플리케이션을 제공할 때 사용할 명령어가 들어갑니다:

```yaml
services:
  laravel.test:
    environment:
      SUPERVISOR_PHP_COMMAND: "/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan octane:start --server=swoole --host=0.0.0.0 --port='${APP_PORT:-80}'" # [!code ++]
```

마지막으로, Sail 이미지를 빌드하세요:

```shell
./vendor/bin/sail build --no-cache
```


#### Swoole 설정 {#swoole-configuration}

Swoole은 필요하다면 `octane` 설정 파일에 추가할 수 있는 몇 가지 추가 설정 옵션을 지원합니다. 이러한 옵션들은 거의 수정할 필요가 없기 때문에 기본 설정 파일에는 포함되어 있지 않습니다:

```php
'swoole' => [
    'options' => [
        'log_file' => storage_path('logs/swoole_http.log'),
        'package_max_length' => 10 * 1024 * 1024,
    ],
],
```


## 애플리케이션 제공 {#serving-your-application}

Octane 서버는 `octane:start` Artisan 명령어를 통해 시작할 수 있습니다. 기본적으로 이 명령어는 애플리케이션의 `octane` 설정 파일에 있는 `server` 설정 옵션에 지정된 서버를 사용합니다:

```shell
php artisan octane:start
```

기본적으로 Octane은 8000번 포트에서 서버를 시작하므로, 웹 브라우저에서 `http://localhost:8000`을 통해 애플리케이션에 접근할 수 있습니다.


### HTTPS를 통한 애플리케이션 제공 {#serving-your-application-via-https}

기본적으로 Octane을 통해 실행되는 애플리케이션은 `http://`로 시작하는 링크를 생성합니다. 애플리케이션의 `config/octane.php` 설정 파일에서 사용되는 `OCTANE_HTTPS` 환경 변수를 HTTPS를 통해 애플리케이션을 제공할 때 `true`로 설정할 수 있습니다. 이 설정 값을 `true`로 지정하면, Octane은 Laravel에게 생성되는 모든 링크를 `https://`로 시작하도록 지시합니다:

```php
'https' => env('OCTANE_HTTPS', false),
```


### Nginx를 통한 애플리케이션 서비스 {#serving-your-application-via-nginx}

> [!NOTE]
> 서버 설정을 직접 관리할 준비가 되어 있지 않거나, 강력한 Laravel Octane 애플리케이션을 실행하는 데 필요한 다양한 서비스를 설정하는 것이 익숙하지 않다면, 완전 관리형 Laravel Octane 지원을 제공하는 [Laravel Cloud](https://cloud.laravel.com)를 확인해보세요.

프로덕션 환경에서는 Octane 애플리케이션을 Nginx나 Apache와 같은 전통적인 웹 서버 뒤에서 서비스해야 합니다. 이렇게 하면 웹 서버가 이미지나 스타일시트와 같은 정적 자산을 제공하고, SSL 인증서 종료도 관리할 수 있습니다.

아래의 Nginx 설정 예시에서는, Nginx가 사이트의 정적 자산을 제공하고 8000번 포트에서 실행 중인 Octane 서버로 요청을 프록시합니다:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    listen [::]:80;
    server_name domain.com;
    server_tokens off;
    root /home/forge/domain.com/public;

    index index.php;

    charset utf-8;

    location /index.php {
        try_files /not_exists @octane;
    }

    location / {
        try_files $uri $uri/ @octane;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/domain.com-error.log error;

    error_page 404 /index.php;

    location @octane {
        set $suffix "";

        if ($uri = /index.php) {
            set $suffix ?$query_string;
        }

        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header Scheme $scheme;
        proxy_set_header SERVER_PORT $server_port;
        proxy_set_header REMOTE_ADDR $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_pass http://127.0.0.1:8000$suffix;
    }
}
```


### 파일 변경 감지하기 {#watching-for-file-changes}

Octane 서버가 시작될 때 애플리케이션이 한 번 메모리에 로드되기 때문에, 애플리케이션 파일에 변경이 있어도 브라우저를 새로고침할 때 반영되지 않습니다. 예를 들어, `routes/web.php` 파일에 라우트 정의를 추가해도 서버를 재시작하기 전까지는 반영되지 않습니다. 편의를 위해, Octane이 애플리케이션 내 파일 변경 시 자동으로 서버를 재시작하도록 `--watch` 플래그를 사용할 수 있습니다:

```shell
php artisan octane:start --watch
```

이 기능을 사용하기 전에, 로컬 개발 환경에 [Node](https://nodejs.org)가 설치되어 있는지 확인해야 합니다. 또한, 프로젝트 내에 [Chokidar](https://github.com/paulmillr/chokidar) 파일 감지 라이브러리를 설치해야 합니다:

```shell
npm install --save-dev chokidar
```

감지할 디렉터리와 파일은 애플리케이션의 `config/octane.php` 설정 파일 내 `watch` 설정 옵션을 사용해 구성할 수 있습니다.


### 워커 수 지정하기 {#specifying-the-worker-count}

기본적으로 Octane은 사용 중인 머신의 각 CPU 코어마다 애플리케이션 요청 워커를 시작합니다. 이 워커들은 애플리케이션에 들어오는 HTTP 요청을 처리하는 데 사용됩니다. `octane:start` 명령을 실행할 때 `--workers` 옵션을 사용하여 시작할 워커 수를 직접 지정할 수 있습니다:

```shell
php artisan octane:start --workers=4
```

Swoole 애플리케이션 서버를 사용하는 경우, 시작할 ["태스크 워커"](#concurrent-tasks) 수 또한 지정할 수 있습니다:

```shell
php artisan octane:start --workers=4 --task-workers=6
```


### 최대 요청 수 지정하기 {#specifying-the-max-request-count}

예기치 않은 메모리 누수를 방지하기 위해, Octane은 워커가 500개의 요청을 처리하면 자동으로 워커를 정상적으로 재시작합니다. 이 숫자를 조정하려면 `--max-requests` 옵션을 사용할 수 있습니다:

```shell
php artisan octane:start --max-requests=250
```


### 워커 재로드하기 {#reloading-the-workers}

`octane:reload` 명령어를 사용하여 Octane 서버의 애플리케이션 워커를 우아하게 재시작할 수 있습니다. 일반적으로, 이는 배포 후에 수행되어야 하며, 새로 배포된 코드가 메모리에 로드되어 이후의 요청에 사용될 수 있도록 합니다:

```shell
php artisan octane:reload
```


### 서버 중지하기 {#stopping-the-server}

`octane:stop` Artisan 명령어를 사용하여 Octane 서버를 중지할 수 있습니다:

```shell
php artisan octane:stop
```


#### 서버 상태 확인 {#checking-the-server-status}

`octane:status` Artisan 명령어를 사용하여 Octane 서버의 현재 상태를 확인할 수 있습니다:

```shell
php artisan octane:status
```


## 의존성 주입과 Octane {#dependency-injection-and-octane}

Octane은 애플리케이션을 한 번 부팅한 후 메모리에 유지하면서 요청을 처리하므로, 애플리케이션을 개발할 때 몇 가지 주의해야 할 점이 있습니다. 예를 들어, 애플리케이션 서비스 프로바이더의 `register` 및 `boot` 메서드는 요청 워커가 처음 부팅될 때 한 번만 실행됩니다. 이후의 요청에서는 동일한 애플리케이션 인스턴스가 재사용됩니다.

이러한 점을 고려하여, 애플리케이션 서비스 컨테이너나 요청 객체를 어떤 객체의 생성자에 주입할 때는 특별히 주의해야 합니다. 그렇게 하면 해당 객체가 이후 요청에서 오래된 컨테이너나 요청 객체를 갖게 될 수 있습니다.

Octane은 요청 간에 프레임워크의 1차 상태를 자동으로 리셋해줍니다. 하지만 Octane이 애플리케이션에서 생성된 전역 상태를 항상 어떻게 리셋해야 하는지 알지는 못합니다. 따라서 Octane에 적합한 방식으로 애플리케이션을 구축하는 방법을 숙지해야 합니다. 아래에서는 Octane을 사용할 때 문제가 발생할 수 있는 가장 일반적인 상황에 대해 설명합니다.


### 컨테이너 주입 {#container-injection}

일반적으로, 애플리케이션 서비스 컨테이너나 HTTP 요청 인스턴스를 다른 객체의 생성자에 주입하는 것은 피해야 합니다. 예를 들어, 아래의 바인딩은 전체 애플리케이션 서비스 컨테이너를 싱글톤으로 바인딩된 객체에 주입합니다:

```php
use App\Service;
use Illuminate\Contracts\Foundation\Application;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->app->singleton(Service::class, function (Application $app) {
        return new Service($app);
    });
}
```

이 예시에서, 만약 `Service` 인스턴스가 애플리케이션 부트 과정 중에 해석된다면, 컨테이너가 서비스에 주입되고 이후 요청에서도 동일한 컨테이너가 `Service` 인스턴스에 의해 유지됩니다. 이것이 **반드시** 문제를 일으키는 것은 아니지만, 부트 사이클 후반이나 이후 요청에서 추가된 바인딩이 컨테이너에 누락되는 예기치 않은 상황이 발생할 수 있습니다.

이 문제를 해결하기 위해, 바인딩을 싱글톤으로 등록하지 않거나, 항상 최신 컨테이너 인스턴스를 해석하는 컨테이너 리졸버 클로저를 서비스에 주입할 수 있습니다:

```php
use App\Service;
use Illuminate\Container\Container;
use Illuminate\Contracts\Foundation\Application;

$this->app->bind(Service::class, function (Application $app) {
    return new Service($app);
});

$this->app->singleton(Service::class, function () {
    return new Service(fn () => Container::getInstance());
});
```

글로벌 `app` 헬퍼와 `Container::getInstance()` 메서드는 항상 최신 버전의 애플리케이션 컨테이너를 반환합니다.


### 요청 주입 {#request-injection}

일반적으로, 애플리케이션 서비스 컨테이너나 HTTP 요청 인스턴스를 다른 객체의 생성자에 주입하는 것은 피해야 합니다. 예를 들어, 아래의 바인딩은 전체 요청 인스턴스를 싱글톤으로 바인딩된 객체에 주입합니다:

```php
use App\Service;
use Illuminate\Contracts\Foundation\Application;

/**
 * Register any application services.
 */
public function register(): void
{
    $this->app->singleton(Service::class, function (Application $app) {
        return new Service($app['request']);
    });
}
```

이 예시에서, 만약 `Service` 인스턴스가 애플리케이션 부트 과정 중에 해석된다면, HTTP 요청이 서비스에 주입되고 이후의 모든 요청에서도 동일한 요청 인스턴스가 `Service` 인스턴스에 유지됩니다. 따라서 모든 헤더, 입력값, 쿼리 스트링 데이터 및 기타 모든 요청 데이터가 올바르지 않게 됩니다.

이 문제를 해결하기 위해서는 바인딩을 싱글톤으로 등록하지 않거나, 항상 현재 요청 인스턴스를 반환하는 요청 리졸버 클로저를 서비스에 주입할 수 있습니다. 또는 가장 권장되는 방법은 객체가 필요로 하는 특정 요청 정보를 런타임에 객체의 메서드로 전달하는 것입니다:

```php
use App\Service;
use Illuminate\Contracts\Foundation\Application;

$this->app->bind(Service::class, function (Application $app) {
    return new Service($app['request']);
});

$this->app->singleton(Service::class, function (Application $app) {
    return new Service(fn () => $app['request']);
});

// 또는...

$service->method($request->input('name'));
```

글로벌 `request` 헬퍼는 항상 애플리케이션이 현재 처리 중인 요청을 반환하므로, 애플리케이션 내에서 안전하게 사용할 수 있습니다.

> [!WARNING]
> 컨트롤러 메서드나 라우트 클로저에서 `Illuminate\Http\Request` 인스턴스를 타입힌트하는 것은 허용됩니다.


### 구성 리포지토리 주입 {#configuration-repository-injection}

일반적으로, 다른 객체의 생성자에 구성 리포지토리 인스턴스를 주입하는 것은 피해야 합니다. 예를 들어, 아래의 바인딩은 싱글톤으로 바인딩된 객체에 구성 리포지토리를 주입합니다:

```php
use App\Service;
use Illuminate\Contracts\Foundation\Application;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->app->singleton(Service::class, function (Application $app) {
        return new Service($app->make('config'));
    });
}
```

이 예시에서, 요청 사이에 구성 값이 변경되면 해당 서비스는 새로운 값에 접근할 수 없습니다. 이는 원래의 리포지토리 인스턴스에 의존하기 때문입니다.

해결 방법으로는, 바인딩을 싱글톤으로 등록하지 않거나, 클래스에 구성 리포지토리 리졸버 클로저를 주입할 수 있습니다:

```php
use App\Service;
use Illuminate\Container\Container;
use Illuminate\Contracts\Foundation\Application;

$this->app->bind(Service::class, function (Application $app) {
    return new Service($app->make('config'));
});

$this->app->singleton(Service::class, function () {
    return new Service(fn () => Container::getInstance()->make('config'));
});
```

글로벌 `config` 헬퍼는 항상 최신 버전의 구성 리포지토리를 반환하므로, 애플리케이션 내에서 안전하게 사용할 수 있습니다.


### 메모리 누수 관리 {#managing-memory-leaks}

Octane은 요청 간에 애플리케이션을 메모리에 유지하므로, 정적으로 관리되는 배열에 데이터를 추가하면 메모리 누수가 발생할 수 있습니다. 예를 들어, 아래 컨트롤러는 각 애플리케이션 요청마다 static `$data` 배열에 데이터가 계속 추가되기 때문에 메모리 누수가 발생합니다:

```php
use App\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Handle an incoming request.
 */
public function index(Request $request): array
{
    Service::$data[] = Str::random(10);

    return [
        // ...
    ];
}
```

애플리케이션을 개발할 때 이러한 유형의 메모리 누수가 발생하지 않도록 특별히 주의해야 합니다. 로컬 개발 중에는 애플리케이션의 메모리 사용량을 모니터링하여 새로운 메모리 누수가 발생하지 않도록 하는 것이 좋습니다.


## 동시 작업 {#concurrent-tasks}

> [!WARNING]
> 이 기능은 [Swoole](#swoole)이 필요합니다.

Swoole을 사용할 때, 경량의 백그라운드 작업을 통해 작업을 동시에 실행할 수 있습니다. Octane의 `concurrently` 메서드를 사용하여 이를 수행할 수 있습니다. 이 메서드는 PHP 배열 구조 분해와 결합하여 각 작업의 결과를 쉽게 가져올 수 있습니다:

```php
use App\Models\User;
use App\Models\Server;
use Laravel\Octane\Facades\Octane;

[$users, $servers] = Octane::concurrently([
    fn () => User::all(),
    fn () => Server::all(),
]);
```

Octane이 처리하는 동시 작업은 Swoole의 "task workers"를 사용하며, 들어오는 요청과는 완전히 다른 프로세스에서 실행됩니다. 동시 작업을 처리할 수 있는 워커의 수는 `octane:start` 명령어의 `--task-workers` 옵션으로 결정됩니다:

```shell
php artisan octane:start --workers=4 --task-workers=6
```

`concurrently` 메서드를 호출할 때는 Swoole의 작업 시스템이 가진 제한으로 인해 1024개를 초과하는 작업을 제공해서는 안 됩니다.


## 틱과 인터벌 {#ticks-and-intervals}

> [!WARNING]
> 이 기능은 [Swoole](#swoole)이 필요합니다.

Swoole을 사용할 때, 지정한 초마다 실행되는 "틱" 작업을 등록할 수 있습니다. `tick` 메서드를 통해 "틱" 콜백을 등록할 수 있습니다. `tick` 메서드의 첫 번째 인자는 티커의 이름을 나타내는 문자열이어야 합니다. 두 번째 인자는 지정한 간격마다 호출될 수 있는 콜러블이어야 합니다.

이 예제에서는 10초마다 호출되는 클로저를 등록합니다. 일반적으로 `tick` 메서드는 애플리케이션의 서비스 프로바이더 중 하나의 `boot` 메서드 내에서 호출해야 합니다:

```php
Octane::tick('simple-ticker', fn () => ray('Ticking...'))
    ->seconds(10);
```

`immediate` 메서드를 사용하면, Octane 서버가 처음 부팅될 때 즉시 틱 콜백을 실행하고, 이후 매 N초마다 실행하도록 지시할 수 있습니다:

```php
Octane::tick('simple-ticker', fn () => ray('Ticking...'))
    ->seconds(10)
    ->immediate();
```


## Octane 캐시 {#the-octane-cache}

> [!WARNING]
> 이 기능은 [Swoole](#swoole)이 필요합니다.

Swoole을 사용할 때, Octane 캐시 드라이버를 활용할 수 있으며, 이는 초당 최대 2백만 번의 읽기 및 쓰기 속도를 제공합니다. 따라서 이 캐시 드라이버는 캐싱 계층에서 극한의 읽기/쓰기 속도가 필요한 애플리케이션에 탁월한 선택입니다.

이 캐시 드라이버는 [Swoole 테이블](https://www.swoole.co.uk/docs/modules/swoole-table)에 의해 구동됩니다. 캐시에 저장된 모든 데이터는 서버의 모든 워커에서 사용할 수 있습니다. 하지만 서버가 재시작되면 캐시된 데이터는 모두 삭제됩니다:

```php
Cache::store('octane')->put('framework', 'Laravel', 30);
```

> [!NOTE]
> Octane 캐시에 허용되는 최대 항목 수는 애플리케이션의 `octane` 설정 파일에서 정의할 수 있습니다.


### 캐시 인터벌 {#cache-intervals}

Laravel의 일반적인 캐시 시스템에서 제공하는 메서드 외에도, Octane 캐시 드라이버는 인터벌 기반 캐시 기능을 제공합니다. 이 캐시는 지정된 주기마다 자동으로 갱신되며, 애플리케이션의 서비스 프로바이더 중 하나의 `boot` 메서드 내에서 등록해야 합니다. 예를 들어, 아래의 캐시는 5초마다 갱신됩니다:

```php
use Illuminate\Support\Str;

Cache::store('octane')->interval('random', function () {
    return Str::random(10);
}, seconds: 5);
```


## 테이블 {#tables}

> [!WARNING]
> 이 기능은 [Swoole](#swoole)이 필요합니다.

Swoole을 사용할 때, 임의의 [Swoole 테이블](https://www.swoole.co.uk/docs/modules/swoole-table)을 정의하고 상호작용할 수 있습니다. Swoole 테이블은 매우 뛰어난 성능을 제공하며, 이 테이블의 데이터는 서버의 모든 워커에서 접근할 수 있습니다. 하지만, 서버가 재시작되면 이 안의 데이터는 모두 사라집니다.

테이블은 애플리케이션의 `octane` 설정 파일 내 `tables` 설정 배열에서 정의해야 합니다. 최대 1000개의 행을 허용하는 예시 테이블이 이미 구성되어 있습니다. 문자열 컬럼의 최대 크기는 아래와 같이 컬럼 타입 뒤에 크기를 지정하여 설정할 수 있습니다:

```php
'tables' => [
    'example:1000' => [
        'name' => 'string:1000',
        'votes' => 'int',
    ],
],
```

테이블에 접근하려면 `Octane::table` 메서드를 사용할 수 있습니다:

```php
use Laravel\Octane\Facades\Octane;

Octane::table('example')->set('uuid', [
    'name' => 'Nuno Maduro',
    'votes' => 1000,
]);

return Octane::table('example')->get('uuid');
```

> [!WARNING]
> Swoole 테이블에서 지원하는 컬럼 타입은 `string`, `int`, `float`입니다.
