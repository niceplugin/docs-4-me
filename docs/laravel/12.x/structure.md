# 디렉터리 구조





























## 소개 {#introduction}

기본 Laravel 애플리케이션 구조는 대규모 및 소규모 애플리케이션 모두에 훌륭한 출발점을 제공하도록 설계되었습니다. 하지만 애플리케이션을 원하는 대로 자유롭게 구성할 수 있습니다. Laravel은 Composer가 클래스를 자동 로드할 수 있는 한, 특정 클래스가 어디에 위치해야 한다는 거의 제한을 두지 않습니다.


## 루트 디렉터리 {#the-root-directory}


### 앱 디렉터리 {#the-root-app-directory}

`app` 디렉터리는 애플리케이션의 핵심 코드를 포함하고 있습니다. 이 디렉터리를 곧 더 자세히 살펴보겠지만, 애플리케이션 내 거의 모든 클래스가 이 디렉터리에 위치합니다.


### 부트스트랩 디렉터리 {#the-bootstrap-directory}

`bootstrap` 디렉터리에는 프레임워크를 부트스트랩하는 `app.php` 파일이 포함되어 있습니다. 이 디렉터리에는 또한 라우트 및 서비스 캐시 파일과 같은 성능 최적화를 위한 프레임워크 생성 파일을 담고 있는 `cache` 디렉터리도 포함되어 있습니다.


### 설정 디렉터리 {#the-config-directory}

`config` 디렉터리는 이름에서 알 수 있듯이 애플리케이션의 모든 설정 파일을 포함하고 있습니다. 이 파일들을 모두 읽어보고 사용 가능한 옵션들을 익히는 것이 좋습니다.


### 데이터베이스 디렉터리 {#the-database-directory}

`database` 디렉터리에는 데이터베이스 마이그레이션, 모델 팩토리, 시드 파일이 포함되어 있습니다. 원한다면 이 디렉터리를 SQLite 데이터베이스를 저장하는 용도로도 사용할 수 있습니다.


### 퍼블릭 디렉터리 {#the-public-directory}

`public` 디렉터리에는 애플리케이션으로 들어오는 모든 요청의 진입점인 `index.php` 파일이 포함되어 있으며, 자동 로딩을 설정합니다. 이 디렉터리에는 이미지, 자바스크립트, CSS와 같은 자산 파일들도 함께 저장됩니다.


### 리소스 디렉터리 {#the-resources-directory}

`resources` 디렉터리에는 [뷰(views)](/laravel/12.x/views)와 CSS 또는 자바스크립트와 같은 원시 상태의 컴파일되지 않은 자산 파일들이 포함되어 있습니다.


### 라우트 디렉터리 {#the-routes-directory}

`routes` 디렉터리에는 애플리케이션의 모든 라우트 정의가 포함되어 있습니다. 기본적으로 Laravel에는 두 개의 라우트 파일이 포함되어 있습니다: `web.php`와 `console.php`.

`web.php` 파일에는 Laravel이 `web` 미들웨어 그룹에 배치하는 라우트가 포함되어 있으며, 이 그룹은 세션 상태, CSRF 보호, 쿠키 암호화를 제공합니다. 애플리케이션이 상태 비저장(stateless) RESTful API를 제공하지 않는다면, 대부분의 라우트가 `web.php` 파일에 정의될 것입니다.

`console.php` 파일은 클로저 기반 콘솔 명령어를 정의하는 곳입니다. 각 클로저는 명령 인스턴스에 바인딩되어 각 명령의 입출력(IO) 메서드와 간단히 상호작용할 수 있도록 합니다. 이 파일은 HTTP 라우트를 정의하지 않지만, 애플리케이션에 대한 콘솔 기반 진입점(라우트)을 정의합니다. 또한 `console.php` 파일에서 [스케줄링](/laravel/12.x/scheduling) 작업을 설정할 수 있습니다.

선택적으로, Artisan 명령어 `install:api`와 `install:broadcasting`을 통해 API 라우트(`api.php`)와 브로드캐스팅 채널(`channels.php`)용 추가 라우트 파일을 설치할 수 있습니다.

`api.php` 파일에는 상태 비저장(stateless)으로 설계된 라우트가 포함되어 있으며, 이 라우트를 통해 들어오는 요청은 [토큰](/laravel/12.x/sanctum)을 통해 인증되며 세션 상태에 접근할 수 없습니다.

`channels.php` 파일은 애플리케이션이 지원하는 모든 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 채널을 등록하는 곳입니다.


### 스토리지 디렉터리 {#the-storage-directory}

`storage` 디렉터리에는 로그, 컴파일된 Blade 템플릿, 파일 기반 세션, 파일 캐시 및 프레임워크에서 생성된 기타 파일들이 포함되어 있습니다. 이 디렉터리는 `app`, `framework`, `logs` 디렉터리로 구분되어 있습니다. `app` 디렉터리는 애플리케이션에서 생성된 파일을 저장하는 데 사용될 수 있습니다. `framework` 디렉터리는 프레임워크에서 생성된 파일과 캐시를 저장하는 데 사용됩니다. 마지막으로 `logs` 디렉터리에는 애플리케이션의 로그 파일이 포함되어 있습니다.

`storage/app/public` 디렉터리는 프로필 아바타와 같이 공개적으로 접근 가능해야 하는 사용자 생성 파일을 저장하는 데 사용할 수 있습니다. 이 디렉터리를 가리키는 심볼릭 링크를 `public/storage`에 생성해야 합니다. 이 링크는 `php artisan storage:link` Artisan 명령어를 사용하여 생성할 수 있습니다.


### 테스트 디렉터리 {#the-tests-directory}

`tests` 디렉터리에는 자동화된 테스트가 포함되어 있습니다. 기본적으로 [Pest](https://pestphp.com) 또는 [PHPUnit](https://phpunit.de/) 단위 테스트와 기능 테스트 예제가 제공됩니다. 각 테스트 클래스는 `Test`라는 접미사를 가져야 합니다. 테스트는 `/vendor/bin/pest` 또는 `/vendor/bin/phpunit` 명령어를 사용하여 실행할 수 있습니다. 또는 테스트 결과를 더 자세하고 보기 좋게 확인하고 싶다면, `php artisan test` Artisan 명령어를 사용하여 테스트를 실행할 수 있습니다.


### 벤더 디렉터리 {#the-vendor-directory}

`vendor` 디렉터리에는 [Composer](https://getcomposer.org) 의존성 패키지들이 포함되어 있습니다.


## 앱 디렉터리 {#the-app-directory}

애플리케이션의 대부분은 `app` 디렉터리에 저장됩니다. 기본적으로 이 디렉터리는 `App` 네임스페이스 아래에 위치하며, Composer가 [PSR-4 자동 로딩 표준](https://www.php-fig.org/psr/psr-4/)을 사용하여 자동 로드합니다.

기본적으로 `app` 디렉터리에는 `Http`, `Models`, `Providers` 디렉터리가 포함되어 있습니다. 하지만 시간이 지나면서 Artisan의 make 명령어를 사용해 클래스를 생성할 때 다양한 다른 디렉터리들이 `app` 디렉터리 내에 생성됩니다. 예를 들어, `app/Console` 디렉터리는 `make:command` Artisan 명령어를 실행하여 커맨드 클래스를 생성하기 전까지는 존재하지 않습니다.

`Console`과 `Http` 디렉터리는 아래 각 섹션에서 자세히 설명하지만, 이 두 디렉터리는 애플리케이션 핵심에 대한 API 역할을 한다고 생각하면 됩니다. HTTP 프로토콜과 CLI는 모두 애플리케이션과 상호작용하는 수단이지만, 실제 애플리케이션 로직을 포함하지는 않습니다. 즉, 이들은 애플리케이션에 명령을 전달하는 두 가지 방법입니다. `Console` 디렉터리에는 모든 Artisan 명령어가 포함되어 있고, `Http` 디렉터리에는 컨트롤러, 미들웨어, 요청이 포함되어 있습니다.

> [!참고]
> `app` 디렉터리 내 많은 클래스는 Artisan 명령어를 통해 생성할 수 있습니다. 사용 가능한 명령어를 확인하려면 터미널에서 `php artisan list make` 명령어를 실행하세요.


### 브로드캐스팅 디렉터리 {#the-broadcasting-directory}

`Broadcasting` 디렉터리에는 애플리케이션의 모든 브로드캐스트 채널 클래스가 포함되어 있습니다. 이 클래스들은 `make:channel` 명령어를 사용하여 생성됩니다. 이 디렉터리는 기본적으로 존재하지 않지만, 첫 번째 채널을 생성할 때 자동으로 생성됩니다. 채널에 대해 더 알고 싶다면 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 문서를 참고하세요.


### 콘솔 디렉터리 {#the-console-directory}

`Console` 디렉터리에는 애플리케이션의 모든 커스텀 Artisan 명령어가 포함되어 있습니다. 이 명령어들은 `make:command` 명령어를 사용하여 생성할 수 있습니다.


### 이벤트 디렉터리 {#the-events-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `event:generate` 및 `make:event` Artisan 명령어를 실행하면 생성됩니다. `Events` 디렉터리에는 [이벤트 클래스](/laravel/12.x/events)가 포함되어 있습니다. 이벤트는 특정 동작이 발생했음을 애플리케이션의 다른 부분에 알리는 데 사용되며, 높은 유연성과 디커플링을 제공합니다.


### 예외 디렉터리 {#the-exceptions-directory}

`Exceptions` 디렉터리에는 애플리케이션의 모든 커스텀 예외가 포함되어 있습니다. 이 예외들은 `make:exception` 명령어를 사용하여 생성할 수 있습니다.


### HTTP 디렉터리 {#the-http-directory}

`Http` 디렉터리에는 컨트롤러, 미들웨어, 폼 요청이 포함되어 있습니다. 애플리케이션으로 들어오는 요청을 처리하는 거의 모든 로직이 이 디렉터리에 위치합니다.


### 잡 디렉터리 {#the-jobs-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:job` Artisan 명령어를 실행하면 생성됩니다. `Jobs` 디렉터리에는 애플리케이션의 [큐잉 가능한 잡](/laravel/12.x/queues)이 포함되어 있습니다. 잡은 애플리케이션에서 큐에 넣어 비동기적으로 실행하거나, 현재 요청 라이프사이클 내에서 동기적으로 실행할 수 있습니다. 현재 요청 중 동기적으로 실행되는 잡은 [커맨드 패턴](https://en.wikipedia.org/wiki/Command_pattern)의 구현체이기 때문에 때때로 "커맨드"라고도 불립니다.


### 리스너 디렉터리 {#the-listeners-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `event:generate` 또는 `make:listener` Artisan 명령어를 실행하면 생성됩니다. `Listeners` 디렉터리에는 [이벤트](/laravel/12.x/events)를 처리하는 클래스들이 포함되어 있습니다. 이벤트 리스너는 이벤트 인스턴스를 받아 해당 이벤트가 발생했을 때 실행할 로직을 수행합니다. 예를 들어, `UserRegistered` 이벤트는 `SendWelcomeEmail` 리스너에 의해 처리될 수 있습니다.


### 메일 디렉터리 {#the-mail-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:mail` Artisan 명령어를 실행하면 생성됩니다. `Mail` 디렉터리에는 애플리케이션에서 전송하는 모든 [이메일을 나타내는 클래스](/laravel/12.x/mail)가 포함되어 있습니다. 메일 객체는 이메일 작성에 필요한 모든 로직을 하나의 간단한 클래스로 캡슐화하며, `Mail::send` 메서드를 사용해 전송할 수 있습니다.


### 모델 디렉터리 {#the-models-directory}

`Models` 디렉터리에는 모든 [Eloquent 모델 클래스](/laravel/12.x/eloquent)가 포함되어 있습니다. Laravel에 포함된 Eloquent ORM은 데이터베이스 작업을 위한 아름답고 간단한 ActiveRecord 구현을 제공합니다. 각 데이터베이스 테이블은 해당 테이블과 상호작용하는 데 사용되는 "모델"과 연결되어 있습니다. 모델을 통해 테이블의 데이터를 조회하거나 새 레코드를 삽입할 수 있습니다.


### 알림 디렉터리 {#the-notifications-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:notification` Artisan 명령어를 실행하면 생성됩니다. `Notifications` 디렉터리에는 애플리케이션에서 전송하는 모든 "트랜잭션" [알림](/laravel/12.x/notifications)이 포함되어 있습니다. 예를 들어, 애플리케이션 내에서 발생하는 이벤트에 대한 간단한 알림 등이 있습니다. Laravel의 알림 기능은 이메일, Slack, SMS 등 다양한 드라이버를 통해 알림을 전송하거나 데이터베이스에 저장하는 작업을 추상화합니다.


### 정책 디렉터리 {#the-policies-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:policy` Artisan 명령어를 실행하면 생성됩니다. `Policies` 디렉터리에는 애플리케이션의 [권한 부여 정책 클래스](/laravel/12.x/authorization)가 포함되어 있습니다. 정책은 사용자가 특정 리소스에 대해 특정 작업을 수행할 수 있는지 여부를 결정하는 데 사용됩니다.


### 프로바이더 디렉터리 {#the-providers-directory}

`Providers` 디렉터리에는 애플리케이션의 모든 [서비스 프로바이더](/laravel/12.x/providers)가 포함되어 있습니다. 서비스 프로바이더는 서비스 컨테이너에 서비스를 바인딩하거나, 이벤트를 등록하거나, 애플리케이션이 들어오는 요청을 처리할 준비를 할 수 있도록 기타 작업을 수행하여 애플리케이션을 부트스트랩합니다.

새로운 Laravel 애플리케이션에서는 이 디렉터리에 이미 `AppServiceProvider`가 포함되어 있습니다. 필요에 따라 이 디렉터리에 직접 프로바이더를 추가할 수 있습니다.


### 룰 디렉터리 {#the-rules-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:rule` Artisan 명령어를 실행하면 생성됩니다. `Rules` 디렉터리에는 애플리케이션의 커스텀 검증 룰 객체가 포함되어 있습니다. 룰은 복잡한 검증 로직을 간단한 객체로 캡슐화하는 데 사용됩니다. 자세한 내용은 [검증 문서](/laravel/12.x/validation)를 참고하세요.
