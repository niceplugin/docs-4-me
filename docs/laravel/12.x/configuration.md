# [시작하기] 환경설정














## 소개 {#introduction}

Laravel 프레임워크의 모든 설정 파일은 `config` 디렉터리에 저장되어 있습니다. 각 옵션에는 문서가 포함되어 있으니, 파일을 살펴보며 사용 가능한 옵션에 익숙해지시기 바랍니다.

이 설정 파일들을 통해 데이터베이스 연결 정보, 메일 서버 정보, 애플리케이션 URL, 암호화 키 등 다양한 핵심 설정 값을 구성할 수 있습니다.


#### `about` 명령어 {#the-about-command}

Laravel은 `about` Artisan 명령어를 통해 애플리케이션의 설정, 드라이버, 환경에 대한 개요를 표시할 수 있습니다.

```shell
php artisan about
```

애플리케이션 개요 출력 중 특정 섹션만 보고 싶다면, `--only` 옵션을 사용해 해당 섹션만 필터링할 수 있습니다.

```shell
php artisan about --only=environment
```

또는, 특정 설정 파일의 값을 자세히 확인하고 싶다면 `config:show` Artisan 명령어를 사용할 수 있습니다.

```shell
php artisan config:show database
```


## 환경 설정 {#environment-configuration}

애플리케이션이 실행되는 환경에 따라 서로 다른 설정 값을 사용하는 것이 유용할 때가 많습니다. 예를 들어, 로컬에서는 프로덕션 서버와 다른 캐시 드라이버를 사용하고 싶을 수 있습니다.

이를 간편하게 처리하기 위해 Laravel은 [DotEnv](https://github.com/vlucas/phpdotenv) PHP 라이브러리를 사용합니다. 새롭게 설치된 Laravel 애플리케이션의 루트 디렉터리에는 `.env.example` 파일이 포함되어 있으며, 이 파일에는 여러 일반적인 환경 변수가 정의되어 있습니다. Laravel 설치 과정에서 이 파일은 자동으로 `.env` 파일로 복사됩니다.

Laravel의 기본 `.env` 파일에는 애플리케이션이 로컬에서 실행되는지, 프로덕션 웹 서버에서 실행되는지에 따라 달라질 수 있는 일반적인 설정 값들이 포함되어 있습니다. 이러한 값들은 `config` 디렉터리 내의 설정 파일에서 Laravel의 `env` 함수를 통해 읽어들입니다.

팀 단위로 개발할 경우, `.env.example` 파일을 계속 포함하고 업데이트하는 것이 좋습니다. 예시 설정 파일에 플레이스홀더 값을 넣어두면, 팀의 다른 개발자들도 애플리케이션 실행에 필요한 환경 변수가 무엇인지 명확하게 알 수 있습니다.

> [!NOTE]
> `.env` 파일의 모든 변수는 서버 수준이나 시스템 수준의 외부 환경 변수에 의해 덮어써질 수 있습니다.


#### 환경 파일 보안 {#environment-file-security}

`.env` 파일은 애플리케이션의 소스 컨트롤에 커밋하지 않아야 합니다. 애플리케이션을 사용하는 각 개발자나 서버마다 서로 다른 환경 설정이 필요할 수 있기 때문입니다. 또한, 소스 컨트롤 저장소에 침입자가 접근할 경우 민감한 자격 증명이 노출될 수 있으므로 보안상 위험이 있습니다.

하지만, Laravel의 내장 [환경 파일 암호화](#encrypting-environment-files) 기능을 사용해 환경 파일을 암호화할 수 있습니다. 암호화된 환경 파일은 소스 컨트롤에 안전하게 포함시킬 수 있습니다.


#### 추가 환경 파일 {#additional-environment-files}

애플리케이션의 환경 변수를 로드하기 전에, Laravel은 `APP_ENV` 환경 변수가 외부에서 제공되었는지 또는 `--env` CLI 인자가 지정되었는지 확인합니다. 만약 그렇다면, Laravel은 해당하는 `.env.[APP_ENV]` 파일이 존재하는지 확인한 후, 존재할 경우 이를 로드합니다. 만약 해당 파일이 없다면 기본 `.env` 파일이 로드됩니다.


### 환경 변수 타입 {#environment-variable-types}

`.env` 파일의 모든 변수는 일반적으로 문자열로 해석됩니다. 하지만 `env()` 함수에서 더 다양한 타입을 반환할 수 있도록 몇 가지 예약된 값이 마련되어 있습니다.

<div class="overflow-auto">

| `.env` 값 | `env()` 값    |
|----------|--------------|
| true     | (bool) true  |
| (true)   | (bool) true  |
| false    | (bool) false |
| (false)  | (bool) false |
| empty    | (string) ''  |
| (empty)  | (string) ''  |
| null     | (null) null  |
| (null)   | (null) null  |

</div>

값에 공백이 포함된 환경 변수를 정의해야 할 경우, 값을 큰따옴표로 감싸서 지정할 수 있습니다.

```ini
APP_NAME="My Application"
```


### 환경 설정 값 가져오기 {#retrieving-environment-configuration}

`.env` 파일에 나열된 모든 변수는 애플리케이션이 요청을 받을 때 `$_ENV` PHP 슈퍼글로벌에 로드됩니다. 하지만, 설정 파일 내에서는 `env` 함수를 사용해 이러한 변수의 값을 가져올 수 있습니다. 실제로 Laravel의 설정 파일을 살펴보면, 많은 옵션들이 이미 이 함수를 사용하고 있음을 알 수 있습니다.

```php
'debug' => env('APP_DEBUG', false),
```

`env` 함수에 전달되는 두 번째 값은 "기본값"입니다. 지정한 키에 해당하는 환경 변수가 존재하지 않을 경우 이 값이 반환됩니다.


### 현재 환경 확인하기 {#determining-the-current-environment}

현재 애플리케이션 환경은 `.env` 파일의 `APP_ENV` 변수로 결정됩니다. 이 값은 `App` [파사드](/laravel/12.x/facades)의 `environment` 메서드를 통해 접근할 수 있습니다.

```php
use Illuminate\Support\Facades\App;

$environment = App::environment();
```

또한, `environment` 메서드에 인자를 전달하여 현재 환경이 특정 값과 일치하는지 확인할 수 있습니다. 환경이 전달한 값 중 하나와 일치하면 이 메서드는 `true`를 반환합니다.

```php
if (App::environment('local')) {
    // 현재 환경이 local입니다.
}

if (App::environment(['local', 'staging'])) {
    // 현재 환경이 local 또는 staging입니다...
}
```

> [!NOTE]
> 현재 애플리케이션 환경 감지는 서버 수준의 `APP_ENV` 환경 변수를 정의함으로써 덮어쓸 수 있습니다.


### 환경 파일 암호화 {#encrypting-environment-files}

암호화되지 않은 환경 파일은 절대 소스 컨트롤에 저장해서는 안 됩니다. 하지만 Laravel은 환경 파일을 암호화할 수 있도록 지원하므로, 애플리케이션의 다른 파일들과 함께 안전하게 소스 컨트롤에 추가할 수 있습니다.


#### 암호화 {#encryption}

환경 파일을 암호화하려면 `env:encrypt` 명령어를 사용할 수 있습니다.

```shell
php artisan env:encrypt
```

`env:encrypt` 명령어를 실행하면 `.env` 파일이 암호화되어 `.env.encrypted` 파일에 저장됩니다. 복호화 키는 명령어 실행 결과에 출력되며, 반드시 안전한 비밀번호 관리 프로그램에 보관해야 합니다. 직접 암호화 키를 지정하고 싶다면 명령어 실행 시 `--key` 옵션을 사용할 수 있습니다.

```shell
php artisan env:encrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

> [!NOTE]
> 제공하는 키의 길이는 사용 중인 암호화 알고리즘이 요구하는 키 길이와 일치해야 합니다. 기본적으로 Laravel은 `AES-256-CBC` 암호화를 사용하며, 32자의 키가 필요합니다. 명령어 실행 시 `--cipher` 옵션을 통해 Laravel의 [encrypter](/laravel/12.x/encryption)가 지원하는 다른 암호화 알고리즘을 자유롭게 사용할 수 있습니다.

애플리케이션에 `.env`와 `.env.staging`처럼 여러 환경 파일이 있는 경우, `--env` 옵션을 통해 암호화할 환경 파일의 이름을 지정할 수 있습니다.

```shell
php artisan env:encrypt --env=staging
```


#### 복호화 {#decryption}

환경 파일을 복호화하려면 `env:decrypt` 명령어를 사용할 수 있습니다. 이 명령어는 복호화 키가 필요하며, Laravel은 이 키를 `LARAVEL_ENV_ENCRYPTION_KEY` 환경 변수에서 가져옵니다.

```shell
php artisan env:decrypt
```

또는, `--key` 옵션을 사용해 키를 명령어에 직접 전달할 수도 있습니다.

```shell
php artisan env:decrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

`env:decrypt` 명령어가 실행되면, Laravel은 `.env.encrypted` 파일의 내용을 복호화하여 `.env` 파일에 저장합니다.

커스텀 암호화 알고리즘을 사용하려면 `env:decrypt` 명령어에 `--cipher` 옵션을 추가할 수 있습니다.

```shell
php artisan env:decrypt --key=qUWuNRdfuImXcKxZ --cipher=AES-128-CBC
```

애플리케이션에 `.env`와 `.env.staging`처럼 여러 환경 파일이 있는 경우, `--env` 옵션을 통해 복호화할 환경 파일의 이름을 지정할 수 있습니다.

```shell
php artisan env:decrypt --env=staging
```

기존 환경 파일을 덮어쓰려면, `env:decrypt` 명령어에 `--force` 옵션을 추가하면 됩니다.

```shell
php artisan env:decrypt --force
```


## 설정 값 접근하기 {#accessing-configuration-values}

애플리케이션 어디에서든 `Config` 파사드나 전역 `config` 함수를 사용해 손쉽게 설정 값에 접근할 수 있습니다. 설정 값은 "점(dot) 표기법"을 사용해 접근할 수 있으며, 여기에는 파일명과 접근하려는 옵션명이 포함됩니다. 또한, 기본값을 지정할 수 있으며, 해당 설정 옵션이 존재하지 않을 경우 이 값이 반환됩니다.

```php
use Illuminate\Support\Facades\Config;

$value = Config::get('app.timezone');

$value = config('app.timezone');

// 설정 값이 존재하지 않을 경우 기본값을 반환...
$value = config('app.timezone', 'Asia/Seoul');
```

실행 중에 설정 값을 변경하려면, `Config` 파사드의 `set` 메서드를 호출하거나 배열을 `config` 함수에 전달하면 됩니다.

```php
Config::set('app.timezone', 'America/Chicago');

config(['app.timezone' => 'America/Chicago']);
```

정적 분석을 돕기 위해, `Config` 파사드는 타입이 지정된 설정 값 조회 메서드도 제공합니다. 조회한 설정 값이 기대하는 타입과 일치하지 않으면 예외가 발생합니다.

```php
Config::string('config-key');
Config::integer('config-key');
Config::float('config-key');
Config::boolean('config-key');
Config::array('config-key');
```


## 설정 캐싱 {#configuration-caching}

애플리케이션의 속도를 높이기 위해, `config:cache` Artisan 명령어를 사용해 모든 설정 파일을 하나의 파일로 캐싱하는 것이 좋습니다. 이 명령어는 애플리케이션의 모든 설정 옵션을 하나의 파일로 합쳐 프레임워크가 빠르게 로드할 수 있도록 합니다.

일반적으로 `php artisan config:cache` 명령어는 프로덕션 배포 과정의 일부로 실행해야 합니다. 개발 중에는 설정 옵션을 자주 변경해야 하므로, 로컬 개발 환경에서는 이 명령어를 실행하지 않는 것이 좋습니다.

설정이 캐싱되면, 애플리케이션의 `.env` 파일은 요청이나 Artisan 명령어 실행 시 프레임워크에 의해 로드되지 않습니다. 따라서 `env` 함수는 외부, 시스템 수준의 환경 변수만 반환하게 됩니다.

이러한 이유로, 반드시 애플리케이션의 설정(`config`) 파일 내에서만 `env` 함수를 호출해야 합니다. Laravel의 기본 설정 파일을 살펴보면 이러한 예시를 많이 확인할 수 있습니다. 설정 값은 애플리케이션 어디에서든 [위에서 설명한](#accessing-configuration-values) `config` 함수를 통해 접근할 수 있습니다.

캐싱된 설정을 삭제하려면 `config:clear` 명령어를 사용할 수 있습니다.

```shell
php artisan config:clear
```

> [!WARNING]
> 배포 과정에서 `config:cache` 명령어를 실행한다면, 반드시 `env` 함수를 설정 파일 내에서만 호출하고 있는지 확인해야 합니다. 설정이 캐싱되면 `.env` 파일이 로드되지 않으므로, `env` 함수는 외부, 시스템 수준의 환경 변수만 반환하게 됩니다.


## 설정 파일 퍼블리싱 {#configuration-publishing}

Laravel의 대부분의 설정 파일은 이미 애플리케이션의 `config` 디렉터리에 퍼블리시되어 있습니다. 하지만 `cors.php`나 `view.php`와 같은 일부 설정 파일은 기본적으로 퍼블리시되지 않습니다. 이는 대부분의 애플리케이션에서 해당 파일을 수정할 필요가 없기 때문입니다.

하지만, 기본적으로 퍼블리시되지 않은 설정 파일도 `config:publish` Artisan 명령어를 사용해 퍼블리시할 수 있습니다.

```shell
php artisan config:publish

php artisan config:publish --all
```


## 디버그 모드 {#debug-mode}

`config/app.php` 설정 파일의 `debug` 옵션은 오류 발생 시 사용자에게 얼마나 많은 정보를 표시할지 결정합니다. 기본적으로 이 옵션은 `.env` 파일에 저장된 `APP_DEBUG` 환경 변수의 값을 따릅니다.

> [!WARNING]
> 로컬 개발 환경에서는 `APP_DEBUG` 환경 변수를 `true`로 설정해야 합니다. **프로덕션 환경에서는 이 값을 반드시 `false`로 설정해야 합니다. 만약 프로덕션에서 이 변수가 `true`로 설정되어 있다면, 민감한 설정 값이 애플리케이션의 최종 사용자에게 노출될 위험이 있습니다.**


## 유지보수 모드 {#maintenance-mode}

애플리케이션이 유지보수 모드에 들어가면, 모든 요청에 대해 커스텀 뷰가 표시됩니다. 이를 통해 업데이트 중이거나 유지보수 작업을 할 때 애플리케이션을 쉽게 "비활성화"할 수 있습니다. 유지보수 모드 체크는 애플리케이션의 기본 미들웨어 스택에 포함되어 있습니다. 애플리케이션이 유지보수 모드일 경우, 상태 코드 503과 함께 `Symfony\Component\HttpKernel\Exception\HttpException` 인스턴스가 발생합니다.

유지보수 모드를 활성화하려면 `down` Artisan 명령어를 실행하세요.

```shell
php artisan down
```

유지보수 모드 응답에 모든 HTTP 요청마다 `Refresh` 헤더를 포함하고 싶다면, `down` 명령어 실행 시 `refresh` 옵션을 사용할 수 있습니다. `Refresh` 헤더는 브라우저가 지정한 초 후에 페이지를 자동으로 새로고침하도록 지시합니다.

```shell
php artisan down --refresh=15
```

또한, `down` 명령어에 `retry` 옵션을 제공할 수 있으며, 이 값은 `Retry-After` HTTP 헤더로 설정됩니다. 다만, 대부분의 브라우저는 이 헤더를 무시합니다.

```shell
php artisan down --retry=60
```


#### 유지보수 모드 우회 {#bypassing-maintenance-mode}

비밀 토큰을 사용해 유지보수 모드를 우회할 수 있도록 하려면, `secret` 옵션을 사용해 유지보수 모드 우회 토큰을 지정할 수 있습니다.

```shell
php artisan down --secret="1630542a-246b-4b66-afa1-dd72a4c43515"
```

애플리케이션을 유지보수 모드로 전환한 후, 이 토큰과 일치하는 애플리케이션 URL로 접속하면 Laravel이 브라우저에 유지보수 모드 우회 쿠키를 발급합니다.

```shell
https://example.com/1630542a-246b-4b66-afa1-dd72a4c43515
```

Laravel이 비밀 토큰을 자동으로 생성하도록 하려면, `with-secret` 옵션을 사용할 수 있습니다. 애플리케이션이 유지보수 모드에 들어가면 비밀 토큰이 표시됩니다.

```shell
php artisan down --with-secret
```

이 숨겨진 경로에 접근하면, 애플리케이션의 `/` 경로로 리디렉션됩니다. 쿠키가 브라우저에 발급된 후에는 유지보수 모드가 아닌 것처럼 애플리케이션을 정상적으로 이용할 수 있습니다.

> [!NOTE]
> 유지보수 모드 비밀 토큰은 일반적으로 영숫자와 선택적으로 대시(-)로 구성되어야 합니다. `?`나 `&`처럼 URL에서 특별한 의미를 가지는 문자는 사용하지 않는 것이 좋습니다.


#### 여러 서버에서의 유지보수 모드 {#maintenance-mode-on-multiple-servers}

기본적으로 Laravel은 파일 기반 시스템을 사용해 애플리케이션이 유지보수 모드인지 판단합니다. 즉, 유지보수 모드를 활성화하려면 애플리케이션을 호스팅하는 각 서버에서 `php artisan down` 명령어를 실행해야 합니다.

대안으로, Laravel은 캐시 기반의 유지보수 모드 관리 방법도 제공합니다. 이 방법을 사용하면 한 서버에서만 `php artisan down` 명령어를 실행하면 됩니다. 이를 위해 애플리케이션의 `.env` 파일에서 유지보수 모드 관련 변수를 다음과 같이 수정해야 합니다. 모든 서버에서 접근 가능한 캐시 `store`를 선택해야 하며, 이를 통해 모든 서버에서 유지보수 모드 상태가 일관되게 유지됩니다.

```ini
APP_MAINTENANCE_DRIVER=cache
APP_MAINTENANCE_STORE=database
```


#### 유지보수 모드 뷰 미리 렌더링하기 {#pre-rendering-the-maintenance-mode-view}

배포 과정에서 `php artisan down` 명령어를 사용할 경우, 사용자가 Composer 의존성이나 기타 인프라 구성 요소가 업데이트되는 동안 애플리케이션에 접근하면 간헐적으로 오류가 발생할 수 있습니다. 이는 유지보수 모드임을 판단하고, 템플릿 엔진을 통해 유지보수 모드 뷰를 렌더링하기 위해 Laravel 프레임워크의 상당 부분이 부팅되어야 하기 때문입니다.

이러한 문제를 방지하기 위해, Laravel은 요청 사이클의 가장 초기에 반환될 유지보수 모드 뷰를 미리 렌더링할 수 있도록 지원합니다. 이 뷰는 애플리케이션의 어떤 의존성도 로드되기 전에 렌더링됩니다. `down` 명령어의 `render` 옵션을 사용해 원하는 템플릿을 미리 렌더링할 수 있습니다.

```shell
php artisan down --render="errors::503"
```


#### 유지보수 모드 요청 리디렉션 {#redirecting-maintenance-mode-requests}

유지보수 모드에서는 사용자가 접근하는 모든 애플리케이션 URL에 대해 유지보수 모드 뷰가 표시됩니다. 만약 모든 요청을 특정 URL로 리디렉션하고 싶다면, `redirect` 옵션을 사용할 수 있습니다. 예를 들어, 모든 요청을 `/` URI로 리디렉션하려면 다음과 같이 명령어를 실행하면 됩니다.

```shell
php artisan down --redirect=/
```


#### 유지보수 모드 해제 {#disabling-maintenance-mode}

유지보수 모드를 해제하려면 `up` 명령어를 사용하세요.

```shell
php artisan up
```

> [!NOTE]
> 기본 유지보수 모드 템플릿은 `resources/views/errors/503.blade.php`에 직접 템플릿을 정의하여 커스터마이즈할 수 있습니다.


#### 유지보수 모드와 큐 {#maintenance-mode-queues}

애플리케이션이 유지보수 모드에 있는 동안에는 [큐에 등록된 작업](/laravel/12.x/queues)이 처리되지 않습니다. 애플리케이션이 유지보수 모드에서 해제되면, 작업들은 정상적으로 다시 처리됩니다.


#### 유지보수 모드의 대안 {#alternatives-to-maintenance-mode}

유지보수 모드는 애플리케이션이 몇 초간 중단되는 것을 필요로 하므로, 완전한 무중단 배포를 원한다면 [Laravel Cloud](https://cloud.laravel.com)와 같은 완전 관리형 플랫폼에서 애플리케이션을 운영하는 것을 고려해보세요. 이를 통해 Laravel로 무중단 배포를 구현할 수 있습니다.
