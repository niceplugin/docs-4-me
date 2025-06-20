# 배포

















## 소개 {#introduction}

Laravel 애플리케이션을 프로덕션 환경에 배포할 준비가 되었다면, 애플리케이션이 최대한 효율적으로 동작하도록 하기 위해 할 수 있는 중요한 일들이 있습니다. 이 문서에서는 Laravel 애플리케이션이 올바르게 배포되었는지 확인하기 위한 좋은 시작점을 다룹니다.


## 서버 요구사항 {#server-requirements}

Laravel 프레임워크는 몇 가지 시스템 요구사항이 있습니다. 웹 서버가 다음의 최소 PHP 버전과 확장 모듈을 갖추고 있는지 확인해야 합니다:

<div class="content-list" markdown="1">

- PHP >= 8.2
- PHP 확장: Ctype
- PHP 확장: cURL
- PHP 확장: DOM
- PHP 확장: Fileinfo
- PHP 확장: Filter
- PHP 확장: Hash
- PHP 확장: Mbstring
- PHP 확장: OpenSSL
- PHP 확장: PCRE
- PHP 확장: PDO
- PHP 확장: Session
- PHP 확장: Tokenizer
- PHP 확장: XML

</div>


## 서버 설정 {#server-configuration}


### Nginx {#nginx}

애플리케이션을 Nginx가 실행 중인 서버에 배포하는 경우, 웹 서버를 설정하기 위한 시작점으로 아래의 설정 파일을 사용할 수 있습니다. 대부분의 경우, 이 파일은 서버의 환경에 맞게 커스터마이즈해야 합니다. **서버 관리에 도움이 필요하다면, [Laravel Cloud](https://cloud.laravel.com)와 같은 완전 관리형 Laravel 플랫폼을 사용하는 것을 고려해보세요.**

아래 설정과 같이, 웹 서버가 모든 요청을 애플리케이션의 `public/index.php` 파일로 전달하도록 해야 합니다. `index.php` 파일을 프로젝트 루트로 이동하려고 시도해서는 안 됩니다. 프로젝트 루트에서 애플리케이션을 제공하면 많은 민감한 설정 파일이 외부에 노출될 수 있습니다:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    root /srv/example.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```


### FrankenPHP {#frankenphp}

[FrankenPHP](https://frankenphp.dev/)를 사용하여 Laravel 애플리케이션을 서비스할 수도 있습니다. FrankenPHP는 Go로 작성된 최신 PHP 애플리케이션 서버입니다. FrankenPHP를 사용하여 Laravel PHP 애플리케이션을 서비스하려면, 단순히 `php-server` 명령어를 실행하면 됩니다:

```shell
frankenphp php-server -r public/
```

FrankenPHP가 지원하는 [Laravel Octane](/laravel/12.x/octane) 통합, HTTP/3, 최신 압축, 또는 Laravel 애플리케이션을 독립 실행형 바이너리로 패키징하는 기능 등 더 강력한 기능을 활용하려면, FrankenPHP의 [Laravel 문서](https://frankenphp.dev/docs/laravel/)를 참고하세요.


### 디렉터리 권한 {#directory-permissions}

Laravel은 `bootstrap/cache`와 `storage` 디렉터리에 쓰기 작업이 필요하므로, 웹 서버 프로세스 소유자가 이 디렉터리에 쓸 수 있는 권한이 있는지 확인해야 합니다.


## 최적화 {#optimization}

애플리케이션을 프로덕션에 배포할 때는 설정, 이벤트, 라우트, 뷰 등 다양한 파일을 캐싱해야 합니다. Laravel은 이 모든 파일을 캐싱하는 편리한 `optimize` Artisan 명령어를 제공합니다. 이 명령어는 일반적으로 애플리케이션 배포 과정의 일부로 실행해야 합니다:

```shell
php artisan optimize
```

`optimize:clear` 명령어는 `optimize` 명령어로 생성된 모든 캐시 파일과 기본 캐시 드라이버의 모든 키를 제거할 수 있습니다:

```shell
php artisan optimize:clear
```

아래 문서에서는 `optimize` 명령어로 실행되는 각 세부 최적화 명령어에 대해 설명합니다.


### 설정 캐싱 {#optimizing-configuration-loading}

애플리케이션을 프로덕션에 배포할 때는 배포 과정에서 반드시 `config:cache` Artisan 명령어를 실행해야 합니다:

```shell
php artisan config:cache
```

이 명령어는 Laravel의 모든 설정 파일을 하나의 캐시 파일로 결합하여, 설정 값을 불러올 때 프레임워크가 파일 시스템에 접근하는 횟수를 크게 줄여줍니다.

> [!WARNING]
> 배포 과정에서 `config:cache` 명령어를 실행했다면, 반드시 설정 파일 내에서만 `env` 함수를 호출해야 합니다. 설정이 캐시되면 `.env` 파일이 로드되지 않으며, `.env` 변수에 대한 `env` 함수 호출은 모두 `null`을 반환합니다.


### 이벤트 캐싱 {#caching-events}

배포 과정에서 애플리케이션의 자동 감지된 이벤트와 리스너 매핑을 캐싱해야 합니다. 이는 배포 시 `event:cache` Artisan 명령어를 실행하여 할 수 있습니다:

```shell
php artisan event:cache
```


### 라우트 캐싱 {#optimizing-route-loading}

많은 라우트를 가진 대규모 애플리케이션을 구축하는 경우, 배포 과정에서 반드시 `route:cache` Artisan 명령어를 실행해야 합니다:

```shell
php artisan route:cache
```

이 명령어는 모든 라우트 등록을 캐시 파일 내의 하나의 메서드 호출로 축소하여, 수백 개의 라우트를 등록할 때 라우트 등록 성능을 향상시킵니다.


### 뷰 캐싱 {#optimizing-view-loading}

애플리케이션을 프로덕션에 배포할 때는 배포 과정에서 반드시 `view:cache` Artisan 명령어를 실행해야 합니다:

```shell
php artisan view:cache
```

이 명령어는 모든 Blade 뷰를 미리 컴파일하여, 뷰가 반환될 때마다 즉시 사용할 수 있도록 하여 요청 성능을 향상시킵니다.


## 디버그 모드 {#debug-mode}

`config/app.php` 설정 파일의 debug 옵션은 실제로 사용자에게 얼마나 많은 오류 정보를 표시할지 결정합니다. 기본적으로 이 옵션은 애플리케이션의 `.env` 파일에 저장된 `APP_DEBUG` 환경 변수 값을 따릅니다.

> [!WARNING]
> **프로덕션 환경에서는 이 값이 항상 `false`여야 합니다. 프로덕션에서 `APP_DEBUG` 변수가 `true`로 설정되어 있으면, 민감한 설정 값이 애플리케이션의 최종 사용자에게 노출될 위험이 있습니다.**


## 헬스 라우트 {#the-health-route}

Laravel에는 애플리케이션의 상태를 모니터링할 수 있는 내장 헬스 체크 라우트가 포함되어 있습니다. 프로덕션 환경에서는 이 라우트를 사용하여 애플리케이션의 상태를 업타임 모니터, 로드 밸런서, 또는 Kubernetes와 같은 오케스트레이션 시스템에 보고할 수 있습니다.

기본적으로 헬스 체크 라우트는 `/up`에서 제공되며, 애플리케이션이 예외 없이 부팅되었다면 200 HTTP 응답을 반환합니다. 그렇지 않으면 500 HTTP 응답이 반환됩니다. 이 라우트의 URI는 애플리케이션의 `bootstrap/app` 파일에서 설정할 수 있습니다:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up', // [!code --]
    health: '/status', // [!code ++]
)
```

이 라우트로 HTTP 요청이 들어오면, Laravel은 `Illuminate\Foundation\Events\DiagnosingHealth` 이벤트도 디스패치하여 애플리케이션에 관련된 추가 헬스 체크를 수행할 수 있도록 합니다. 이 이벤트의 [리스너](/laravel/12.x/events) 내에서 데이터베이스나 캐시 상태를 확인할 수 있습니다. 애플리케이션에 문제가 감지되면, 리스너에서 예외를 던지기만 하면 됩니다.


## Laravel Cloud 또는 Forge로 배포하기 {#deploying-with-cloud-or-forge}


#### Laravel Cloud {#laravel-cloud}

완전 관리형, 자동 확장형 Laravel 전용 배포 플랫폼을 원한다면 [Laravel Cloud](https://cloud.laravel.com)를 확인해보세요. Laravel Cloud는 관리형 컴퓨트, 데이터베이스, 캐시, 오브젝트 스토리지를 제공하는 강력한 Laravel 배포 플랫폼입니다.

Cloud에서 Laravel 애플리케이션을 시작하고 확장 가능한 단순함에 반해보세요. Laravel Cloud는 Laravel 제작진이 프레임워크와 완벽하게 연동되도록 미세 조정했으므로, 익숙한 방식 그대로 Laravel 애플리케이션을 개발할 수 있습니다.


#### Laravel Forge {#laravel-forge}

직접 서버를 관리하고 싶지만, 강력한 Laravel 애플리케이션을 실행하는 데 필요한 다양한 서비스를 설정하는 것이 어렵다면, [Laravel Forge](https://forge.laravel.com)는 Laravel 애플리케이션을 위한 VPS 서버 관리 플랫폼입니다.

Laravel Forge는 DigitalOcean, Linode, AWS 등 다양한 인프라 제공업체에 서버를 생성할 수 있습니다. 또한, Forge는 Nginx, MySQL, Redis, Memcached, Beanstalk 등 강력한 Laravel 애플리케이션 구축에 필요한 모든 도구를 설치하고 관리합니다.
