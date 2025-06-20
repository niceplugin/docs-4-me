# 설정














## 소개 {#introduction}

Laravel 프레임워크의 모든 설정 파일은 `config` 디렉터리에 저장되어 있습니다. 각 옵션에는 문서가 포함되어 있으니, 파일을 살펴보며 사용 가능한 옵션에 익숙해지시기 바랍니다.

이 설정 파일들을 통해 데이터베이스 연결 정보, 메일 서버 정보, 애플리케이션 URL, 암호화 키 등 다양한 핵심 설정 값을 구성할 수 있습니다.


#### `about` 명령어 {#the-about-command}

Laravel은 `about` Artisan 명령어를 통해 애플리케이션의 설정, 드라이버, 환경에 대한 개요를 표시할 수 있습니다.

```shell
php artisan about
```

애플리케이션 개요 출력 중 특정 섹션만 보고 싶다면, `--only` 옵션을 사용해 해당 섹션만 필터링할 수 있습니다:

```shell
php artisan about --only=environment
```

또는, 특정 설정 파일의 값을 자세히 확인하고 싶다면 `config:show` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan config:show database
```


## 환경 설정 {#environment-configuration}

애플리케이션이 실행되는 환경에 따라 서로 다른 설정 값을 사용하는 것이 유용할 때가 많습니다. 예를 들어, 로컬에서는 프로덕션 서버와 다른 캐시 드라이버를 사용하고 싶을 수 있습니다.

이를 쉽게 하기 위해 Laravel은 [DotEnv](https://github.com/vlucas/phpdotenv) PHP 라이브러리를 사용합니다. 새로 설치한 Laravel 애플리케이션의 루트 디렉터리에는 `.env.example` 파일이 포함되어 있으며, 이 파일에는 여러 일반적인 환경 변수가 정의되어 있습니다. Laravel 설치 과정에서 이 파일은 자동으로 `.env`로 복사됩니다.

Laravel의 기본 `.env` 파일에는 애플리케이션이 로컬에서 실행되는지, 프로덕션 웹 서버에서 실행되는지에 따라 달라질 수 있는 일반적인 설정 값이 포함되어 있습니다. 이 값들은 `config` 디렉터리 내의 설정 파일에서 Laravel의 `env` 함수를 통해 읽어들입니다.

팀과 함께 개발 중이라면, `.env.example` 파일을 계속 포함하고 업데이트하는 것이 좋습니다. 예시 설정 파일에 플레이스홀더 값을 넣어두면, 팀의 다른 개발자들도 애플리케이션 실행에 필요한 환경 변수를 명확히 알 수 있습니다.

> [!NOTE]
> `.env` 파일의 모든 변수는 서버 레벨 또는 시스템 레벨 환경 변수와 같은 외부 환경 변수로 덮어쓸 수 있습니다.


#### 환경 파일 보안 {#environment-file-security}

`.env` 파일은 각 개발자/서버마다 다른 환경 구성이 필요할 수 있으므로, 소스 컨트롤에 커밋하지 않아야 합니다. 또한, 소스 컨트롤 저장소에 침입자가 접근할 경우 민감한 자격 증명이 노출될 수 있으므로 보안상 위험합니다.

하지만, Laravel의 내장 [환경 파일 암호화](#encrypting-environment-files) 기능을 사용해 환경 파일을 암호화할 수 있습니다. 암호화된 환경 파일은 소스 컨트롤에 안전하게 포함시킬 수 있습니다.


#### 추가 환경 파일 {#additional-environment-files}

애플리케이션의 환경 변수를 로드하기 전에, Laravel은 `APP_ENV` 환경 변수가 외부에서 제공되었는지 또는 `--env` CLI 인자가 지정되었는지 확인합니다. 만약 그렇다면, Laravel은 `.env.[APP_ENV]` 파일이 존재하는지 확인 후, 존재하면 해당 파일을 로드합니다. 존재하지 않으면 기본 `.env` 파일을 로드합니다.


### 환경 변수 타입 {#environment-variable-types}

`.env` 파일의 모든 변수는 일반적으로 문자열로 파싱되지만, `env()` 함수에서 더 다양한 타입을 반환할 수 있도록 일부 예약 값을 사용할 수 있습니다:

<div class="overflow-auto">

| `.env` 값   | `env()` 값    |
|------------|--------------|
| true       | (bool) true  |
| (true)     | (bool) true  |
| false      | (bool) false |
| (false)    | (bool) false |
| empty      | (string) ''  |
| (empty)    | (string) ''  |
| null       | (null) null  |
| (null)     | (null) null  |

</div>

값에 공백이 포함된 환경 변수를 정의해야 할 경우, 값을 큰따옴표로 감싸면 됩니다:

```ini
APP_NAME="My Application"
```


### 환경 설정 값 가져오기 {#retrieving-environment-configuration}

`.env` 파일에 나열된 모든 변수는 애플리케이션이 요청을 받을 때 `$_ENV` PHP 슈퍼글로벌에 로드됩니다. 하지만, 설정 파일 내에서는 `env` 함수를 사용해 이 변수들의 값을 가져올 수 있습니다. 실제로 Laravel의 설정 파일을 살펴보면 많은 옵션이 이미 이 함수를 사용하고 있음을 알 수 있습니다:

```php
'debug' => env('APP_DEBUG', false),
```

`env` 함수에 전달하는 두 번째 값은 "기본값"입니다. 해당 키에 대한 환경 변수가 없을 경우 이 값이 반환됩니다.


### 현재 환경 확인하기 {#determining-the-current-environment}

현재 애플리케이션 환경은 `.env` 파일의 `APP_ENV` 변수로 결정됩니다. 이 값은 `App` [파사드](/laravel/12.x/facades)의 `environment` 메서드를 통해 접근할 수 있습니다:

```php
use Illuminate\Support\Facades\App;

$environment = App::environment();
```

`environment` 메서드에 인자를 전달해 환경이 특정 값과 일치하는지 확인할 수도 있습니다. 환경이 전달된 값 중 하나와 일치하면 `true`를 반환합니다:

```php
if (App::environment('local')) {
    // 환경이 local입니다.
}

if (App::environment(['local', 'staging'])) {
    // 환경이 local 또는 staging입니다...
}
```

> [!NOTE]
> 현재 애플리케이션 환경 감지는 서버 레벨의 `APP_ENV` 환경 변수로 덮어쓸 수 있습니다.


### 환경 파일 암호화 {#encrypting-environment-files}

암호화되지 않은 환경 파일은 소스 컨트롤에 저장해서는 안 됩니다. 하지만, Laravel은 환경 파일을 암호화하여 애플리케이션의 나머지 파일들과 함께 소스 컨트롤에 안전하게 추가할 수 있도록 지원합니다.


#### 암호화 {#encryption}

환경 파일을 암호화하려면, `env:encrypt` 명령어를 사용할 수 있습니다:

```shell
php artisan env:encrypt
```

`env:encrypt` 명령어를 실행하면 `.env` 파일이 암호화되어 `.env.encrypted` 파일에 저장됩니다. 복호화 키는 명령어 실행 결과에 표시되며, 안전한 비밀번호 관리 프로그램에 저장해야 합니다. 직접 암호화 키를 제공하려면 명령어 실행 시 `--key` 옵션을 사용할 수 있습니다:

```shell
php artisan env:encrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

> [!NOTE]
> 제공하는 키의 길이는 사용 중인 암호화 알고리즘이 요구하는 키 길이와 일치해야 합니다. 기본적으로 Laravel은 32자 키가 필요한 `AES-256-CBC` 암호화를 사용합니다. 명령어 실행 시 `--cipher` 옵션을 전달하여 Laravel의 [encrypter](/laravel/12.x/encryption)가 지원하는 다른 암호화 알고리즘을 사용할 수도 있습니다.

애플리케이션에 `.env`와 `.env.staging` 등 여러 환경 파일이 있다면, `--env` 옵션을 통해 암호화할 환경 파일을 지정할 수 있습니다:

```shell
php artisan env:encrypt --env=staging
```


#### 복호화 {#decryption}

환경 파일을 복호화하려면, `env:decrypt` 명령어를 사용할 수 있습니다. 이 명령어는 복호화 키가 필요하며, Laravel은 `LARAVEL_ENV_ENCRYPTION_KEY` 환경 변수에서 키를 가져옵니다:

```shell
php artisan env:decrypt
```

또는, `--key` 옵션을 통해 키를 직접 명령어에 전달할 수 있습니다:

```shell
php artisan env:decrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

`env:decrypt` 명령어가 실행되면, Laravel은 `.env.encrypted` 파일의 내용을 복호화하여 `.env` 파일에 저장합니다.

`--cipher` 옵션을 `env:decrypt` 명령어에 제공하여 커스텀 암호화 알고리즘을 사용할 수도 있습니다:

```shell
php artisan env:decrypt --key=qUWuNRdfuImXcKxZ --cipher=AES-128-CBC
```

애플리케이션에 `.env`와 `.env.staging` 등 여러 환경 파일이 있다면, `--env` 옵션을 통해 복호화할 환경 파일을 지정할 수 있습니다:

```shell
php artisan env:decrypt --env=staging
```

기존 환경 파일을 덮어쓰려면, `env:decrypt` 명령어에 `--force` 옵션을 제공하면 됩니다:

```shell
php artisan env:decrypt --force
```


## 설정 값 접근 {#accessing-configuration-values}

애플리케이션 어디에서나 `Config` 파사드 또는 전역 `config` 함수를 사용해 설정 값에 쉽게 접근할 수 있습니다. 설정 값은 "dot" 문법(파일명.옵션명)으로 접근할 수 있습니다. 기본값도 지정할 수 있으며, 해당 설정 옵션이 없을 경우 반환됩니다:

```php
use Illuminate\Support\Facades\Config;

$value = Config::get('app.timezone');

$value = config('app.timezone');

// 설정 값이 없을 경우 기본값을 반환...
$value = config('app.timezone', 'Asia/Seoul');
```

런타임에 설정 값을 변경하려면, `Config` 파사드의 `set` 메서드를 호출하거나 배열을 `config` 함수에 전달하면 됩니다:

```php
Config::set('app.timezone', 'America/Chicago');

config(['app.timezone' => 'America/Chicago']);
```

정적 분석을 돕기 위해, `Config` 파사드는 타입이 지정된 설정 값 조회 메서드도 제공합니다. 조회한 설정 값이 기대한 타입과 일치하지 않으면 예외가 발생합니다:

```php
Config::string('config-key');
Config::integer('config-key');
Config::float('config-key');
Config::boolean('config-key');
Config::array('config-key');
```


## 설정 캐싱 {#configuration-caching}

애플리케이션의 속도를 높이기 위해, `config:cache` Artisan 명령어를 사용해 모든 설정 파일을 하나의 파일로 캐싱해야 합니다. 이 명령어는 애플리케이션의 모든 설정 옵션을 하나의 파일로 합쳐 프레임워크가 빠르게 로드할 수 있도록 합니다.

일반적으로 `php artisan config:cache` 명령어는 프로덕션 배포 과정의 일부로 실행해야 합니다. 로컬 개발 중에는 애플리케이션 개발 과정에서 설정 옵션을 자주 변경해야 하므로 이 명령어를 실행하지 않는 것이 좋습니다.

설정이 캐싱되면, 애플리케이션의 `.env` 파일은 요청이나 Artisan 명령어 실행 시 프레임워크에서 로드되지 않습니다. 따라서, `env` 함수는 외부 시스템 레벨 환경 변수만 반환합니다.

이러한 이유로, `env` 함수는 반드시 애플리케이션의 설정(`config`) 파일 내에서만 호출해야 합니다. Laravel의 기본 설정 파일을 살펴보면 많은 예시를 확인할 수 있습니다. 설정 값은 애플리케이션 어디에서나 [위에서 설명한](#accessing-configuration-values) `config` 함수를 통해 접근할 수 있습니다.

`config:clear` 명령어를 사용해 캐싱된 설정을 삭제할 수 있습니다:

```shell
php artisan config:clear
```

> [!WARNING]
> 배포 과정에서 `config:cache` 명령어를 실행한다면, 반드시 `env` 함수를 설정 파일 내에서만 호출해야 합니다. 설정이 캐싱되면 `.env` 파일은 로드되지 않으므로, `env` 함수는 외부 시스템 레벨 환경 변수만 반환합니다.


## 설정 퍼블리싱 {#configuration-publishing}

대부분의 Laravel 설정 파일은 이미 애플리케이션의 `config` 디렉터리에 퍼블리시되어 있습니다. 하지만, `cors.php`나 `view.php`와 같은 일부 설정 파일은 기본적으로 퍼블리시되지 않습니다. 대부분의 애플리케이션에서는 이 파일들을 수정할 필요가 없기 때문입니다.

하지만, 기본적으로 퍼블리시되지 않은 설정 파일도 `config:publish` Artisan 명령어를 사용해 퍼블리시할 수 있습니다:

```shell
php artisan config:publish

php artisan config:publish --all
```


## 디버그 모드 {#debug-mode}

`config/app.php` 설정 파일의 `debug` 옵션은 에러에 대한 정보가 사용자에게 얼마나 표시될지 결정합니다. 기본적으로 이 옵션은 `.env` 파일에 저장된 `APP_DEBUG` 환경 변수의 값을 따릅니다.

> [!WARNING]
> 로컬 개발 환경에서는 `APP_DEBUG` 환경 변수를 `true`로 설정해야 합니다. **프로덕션 환경에서는 이 값을 반드시 `false`로 설정해야 합니다. 프로덕션에서 이 변수가 `true`로 설정되어 있으면, 민감한 설정 값이 애플리케이션의 최종 사용자에게 노출될 위험이 있습니다.**


## 유지보수 모드 {#maintenance-mode}

애플리케이션이 유지보수 모드일 때는 모든 요청에 대해 커스텀 뷰가 표시됩니다. 이를 통해 업데이트 중이거나 유지보수 작업을 할 때 애플리케이션을 "비활성화"하기 쉽습니다. 유지보수 모드 체크는 애플리케이션의 기본 미들웨어 스택에 포함되어 있습니다. 애플리케이션이 유지보수 모드일 경우, `Symfony\Component\HttpKernel\Exception\HttpException` 인스턴스가 503 상태 코드와 함께 발생합니다.

유지보수 모드를 활성화하려면, `down` Artisan 명령어를 실행하세요:

```shell
php artisan down
```

모든 유지보수 모드 응답에 `Refresh` HTTP 헤더를 포함하고 싶다면, `down` 명령어 실행 시 `refresh` 옵션을 제공할 수 있습니다. `Refresh` 헤더는 브라우저에 지정한 초 후에 페이지를 자동으로 새로고침하도록 지시합니다:

```shell
php artisan down --refresh=15
```

또한, `down` 명령어에 `retry` 옵션을 제공해 `Retry-After` HTTP 헤더 값을 설정할 수 있습니다. 다만, 대부분의 브라우저는 이 헤더를 무시합니다:

```shell
php artisan down --retry=60
```


#### 유지보수 모드 우회 {#bypassing-maintenance-mode}

비밀 토큰을 사용해 유지보수 모드를 우회할 수 있도록 하려면, `secret` 옵션을 사용해 유지보수 모드 우회 토큰을 지정할 수 있습니다:

```shell
php artisan down --secret="1630542a-246b-4b66-afa1-dd72a4c43515"
```

애플리케이션을 유지보수 모드로 전환한 후, 이 토큰과 일치하는 애플리케이션 URL로 접속하면 Laravel이 브라우저에 유지보수 모드 우회 쿠키를 발급합니다:

```shell
https://example.com/1630542a-246b-4b66-afa1-dd72a4c43515
```

Laravel이 비밀 토큰을 자동으로 생성하도록 하려면, `with-secret` 옵션을 사용할 수 있습니다. 애플리케이션이 유지보수 모드에 들어가면 비밀 토큰이 표시됩니다:

```shell
php artisan down --with-secret
```

이 숨겨진 경로에 접근하면 `/` 경로로 리디렉션됩니다. 쿠키가 브라우저에 발급되면, 유지보수 모드가 아닌 것처럼 애플리케이션을 정상적으로 이용할 수 있습니다.

> [!NOTE]
> 유지보수 모드 비밀 토큰은 일반적으로 영문자, 숫자, 그리고 선택적으로 대시(-)로 구성되어야 합니다. URL에서 특별한 의미를 가지는 `?`나 `&`와 같은 문자는 사용하지 않는 것이 좋습니다.


#### 여러 서버에서의 유지보수 모드 {#maintenance-mode-on-multiple-servers}

기본적으로 Laravel은 파일 기반 시스템을 사용해 애플리케이션이 유지보수 모드인지 확인합니다. 즉, 유지보수 모드를 활성화하려면 애플리케이션을 호스팅하는 각 서버에서 `php artisan down` 명령어를 실행해야 합니다.

대안으로, Laravel은 캐시 기반 유지보수 모드 방식을 제공합니다. 이 방법은 한 서버에서만 `php artisan down` 명령어를 실행하면 됩니다. 이 방식을 사용하려면, 애플리케이션의 `.env` 파일에서 유지보수 모드 변수를 수정해야 합니다. 모든 서버에서 접근 가능한 캐시 `store`를 선택해야 하며, 이를 통해 모든 서버에서 유지보수 모드 상태가 일관되게 유지됩니다:

```ini
APP_MAINTENANCE_DRIVER=cache
APP_MAINTENANCE_STORE=database
```


#### 유지보수 모드 뷰 미리 렌더링하기 {#pre-rendering-the-maintenance-mode-view}

배포 중에 `php artisan down` 명령어를 사용할 경우, 사용자가 Composer 의존성이나 기타 인프라 구성 요소가 업데이트되는 동안 애플리케이션에 접근하면 간헐적으로 에러가 발생할 수 있습니다. 이는 Laravel 프레임워크의 상당 부분이 부팅되어야 유지보수 모드임을 판단하고, 템플릿 엔진을 사용해 유지보수 모드 뷰를 렌더링하기 때문입니다.

이런 이유로, Laravel은 요청 사이클의 가장 초기에 반환될 유지보수 모드 뷰를 미리 렌더링할 수 있도록 지원합니다. 이 뷰는 애플리케이션의 의존성이 로드되기 전에 렌더링됩니다. `down` 명령어의 `render` 옵션을 사용해 원하는 템플릿을 미리 렌더링할 수 있습니다:

```shell
php artisan down --render="errors::503"
```


#### 유지보수 모드 요청 리디렉션 {#redirecting-maintenance-mode-requests}

유지보수 모드일 때, Laravel은 사용자가 접근하려는 모든 애플리케이션 URL에 대해 유지보수 모드 뷰를 표시합니다. 원한다면, 모든 요청을 특정 URL로 리디렉션하도록 Laravel에 지시할 수 있습니다. 이는 `redirect` 옵션을 사용해 수행할 수 있습니다. 예를 들어, 모든 요청을 `/` URI로 리디렉션하고 싶다면:

```shell
php artisan down --redirect=/
```


#### 유지보수 모드 해제 {#disabling-maintenance-mode}

유지보수 모드를 해제하려면, `up` 명령어를 사용하세요:

```shell
php artisan up
```

> [!NOTE]
> 기본 유지보수 모드 템플릿을 커스터마이즈하려면, `resources/views/errors/503.blade.php`에 직접 템플릿을 정의하면 됩니다.


#### 유지보수 모드와 큐 {#maintenance-mode-queues}

애플리케이션이 유지보수 모드일 때는 [큐 작업](/laravel/12.x/queues)이 처리되지 않습니다. 애플리케이션이 유지보수 모드에서 벗어나면 작업이 정상적으로 처리됩니다.


#### 유지보수 모드의 대안 {#alternatives-to-maintenance-mode}

유지보수 모드는 애플리케이션이 몇 초간 다운타임을 가지게 하므로, [Laravel Cloud](https://cloud.laravel.com)와 같은 완전 관리형 플랫폼에서 애플리케이션을 실행해 Laravel로 무중단 배포(zero-downtime deployment)를 고려해보세요.
