# 디렉터리 구조





























## 소개 {#introduction}

기본 라라벨 애플리케이션 구조는 대규모 및 소규모 애플리케이션 모두에 훌륭한 출발점을 제공하도록 설계되었습니다. 하지만 여러분은 원하는 대로 애플리케이션을 구성할 수 있습니다. 라라벨은 특정 클래스가 어디에 위치해야 하는지에 대해 거의 제한을 두지 않습니다. 단, Composer가 해당 클래스를 오토로딩할 수 있으면 됩니다.


## 루트 디렉터리 {#the-root-directory}


### App 디렉터리 {#the-root-app-directory}

`app` 디렉터리에는 애플리케이션의 핵심 코드가 들어 있습니다. 이 디렉터리에 대해 곧 더 자세히 살펴보겠지만, 애플리케이션의 거의 모든 클래스는 이 디렉터리에 위치하게 됩니다.


### Bootstrap 디렉터리 {#the-bootstrap-directory}

`bootstrap` 디렉터리에는 프레임워크를 부트스트랩하는 `app.php` 파일이 들어 있습니다. 이 디렉터리에는 또한 프레임워크가 성능 최적화를 위해 생성한 파일(예: 라우트 및 서비스 캐시 파일 등)이 저장되는 `cache` 디렉터리도 포함되어 있습니다.


### Config 디렉터리 {#the-config-directory}

`config` 디렉터리는 이름에서 알 수 있듯이, 애플리케이션의 모든 설정 파일을 포함하고 있습니다. 이 파일들을 모두 읽어보고, 여러분이 사용할 수 있는 다양한 옵션에 익숙해지는 것이 좋습니다.


### Database 디렉터리 {#the-database-directory}

`database` 디렉터리에는 데이터베이스 마이그레이션, 모델 팩토리, 시드가 들어 있습니다. 원한다면 이 디렉터리에 SQLite 데이터베이스를 보관할 수도 있습니다.


### Public 디렉터리 {#the-public-directory}

`public` 디렉터리에는 모든 요청이 애플리케이션에 진입할 때의 진입점이 되는 `index.php` 파일이 들어 있으며, 오토로딩을 설정합니다. 이 디렉터리에는 이미지, 자바스크립트, CSS와 같은 에셋도 포함되어 있습니다.


### Resources 디렉터리 {#the-resources-directory}

`resources` 디렉터리에는 [뷰](/laravel/12.x/views)와 CSS 또는 자바스크립트와 같은 원시, 미컴파일 에셋이 들어 있습니다.


### Routes 디렉터리 {#the-routes-directory}

`routes` 디렉터리에는 애플리케이션의 모든 라우트 정의가 들어 있습니다. 기본적으로 라라벨에는 `web.php`와 `console.php` 두 개의 라우트 파일이 포함되어 있습니다.

`web.php` 파일에는 라라벨이 `web` 미들웨어 그룹에 배치하는 라우트가 들어 있습니다. 이 그룹은 세션 상태, CSRF 보호, 쿠키 암호화를 제공합니다. 애플리케이션이 상태 비저장 RESTful API를 제공하지 않는다면, 대부분의 라우트는 `web.php` 파일에 정의될 것입니다.

`console.php` 파일에서는 클로저 기반의 콘솔 명령어를 모두 정의할 수 있습니다. 각 클로저는 명령어 인스턴스에 바인딩되어 각 명령어의 IO 메서드와 쉽게 상호작용할 수 있습니다. 이 파일은 HTTP 라우트를 정의하지 않지만, 애플리케이션에 대한 콘솔 기반 진입점(라우트)을 정의합니다. 또한 `console.php` 파일에서 [작업 스케줄링](/laravel/12.x/scheduling)도 할 수 있습니다.

선택적으로, `install:api` 및 `install:broadcasting` Artisan 명령어를 통해 API 라우트(`api.php`)와 브로드캐스팅 채널(`channels.php`)을 위한 추가 라우트 파일을 설치할 수 있습니다.

`api.php` 파일에는 상태 비저장(stateless) 라우트가 들어 있습니다. 이 라우트를 통해 들어오는 요청은 [토큰](/laravel/12.x/sanctum)으로 인증되며, 세션 상태에 접근할 수 없습니다.

`channels.php` 파일에서는 애플리케이션이 지원하는 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 채널을 모두 등록할 수 있습니다.


### Storage 디렉터리 {#the-storage-directory}

`storage` 디렉터리에는 로그, 컴파일된 블레이드 템플릿, 파일 기반 세션, 파일 캐시, 프레임워크가 생성한 기타 파일이 들어 있습니다. 이 디렉터리는 `app`, `framework`, `logs` 디렉터리로 구분되어 있습니다. `app` 디렉터리는 애플리케이션에서 생성한 파일을 저장하는 데 사용할 수 있습니다. `framework` 디렉터리는 프레임워크가 생성한 파일과 캐시를 저장하는 데 사용됩니다. 마지막으로 `logs` 디렉터리에는 애플리케이션의 로그 파일이 들어 있습니다.

`storage/app/public` 디렉터리는 프로필 아바타와 같이 공개적으로 접근 가능한 사용자 생성 파일을 저장하는 데 사용할 수 있습니다. 이 디렉터리를 가리키는 심볼릭 링크를 `public/storage`에 생성해야 합니다. `php artisan storage:link` Artisan 명령어를 사용하여 이 링크를 만들 수 있습니다.


### Tests 디렉터리 {#the-tests-directory}

`tests` 디렉터리에는 자동화된 테스트가 들어 있습니다. 예시 [Pest](https://pestphp.com) 또는 [PHPUnit](https://phpunit.de/) 단위 테스트와 기능 테스트가 기본으로 제공됩니다. 각 테스트 클래스는 `Test`라는 접미사를 붙여야 합니다. `/vendor/bin/pest` 또는 `/vendor/bin/phpunit` 명령어로 테스트를 실행할 수 있습니다. 또는, 테스트 결과를 더 자세하고 아름답게 보고 싶다면 `php artisan test` Artisan 명령어로 테스트를 실행할 수 있습니다.


### Vendor 디렉터리 {#the-vendor-directory}

`vendor` 디렉터리에는 [Composer](https://getcomposer.org) 의존성이 들어 있습니다.


## App 디렉터리 {#the-app-directory}

애플리케이션의 대부분은 `app` 디렉터리에 위치합니다. 기본적으로 이 디렉터리는 `App` 네임스페이스 아래에 있으며, [PSR-4 오토로딩 표준](https://www.php-fig.org/psr/psr-4/)을 사용하여 Composer에 의해 오토로딩됩니다.

기본적으로 `app` 디렉터리에는 `Http`, `Models`, `Providers` 디렉터리가 포함되어 있습니다. 하지만 시간이 지나면서, Artisan의 make 명령어로 클래스를 생성할 때 다양한 다른 디렉터리도 app 디렉터리 내에 생성됩니다. 예를 들어, `app/Console` 디렉터리는 `make:command` Artisan 명령어로 명령어 클래스를 생성할 때까지 존재하지 않습니다.

`Console`과 `Http` 디렉터리는 아래의 각 섹션에서 더 자세히 설명되지만, 이 두 디렉터리는 애플리케이션의 핵심에 대한 API를 제공한다고 생각하면 됩니다. HTTP 프로토콜과 CLI는 모두 애플리케이션과 상호작용하는 수단이지만, 실제 애플리케이션 로직을 포함하지는 않습니다. 즉, 이들은 애플리케이션에 명령을 내리는 두 가지 방법입니다. `Console` 디렉터리에는 모든 Artisan 명령어가, `Http` 디렉터리에는 컨트롤러, 미들웨어, 요청이 들어 있습니다.

> [!NOTE]
> `app` 디렉터리의 많은 클래스는 Artisan 명령어로 생성할 수 있습니다. 사용 가능한 명령어를 확인하려면 터미널에서 `php artisan list make` 명령어를 실행하세요.


### Broadcasting 디렉터리 {#the-broadcasting-directory}

`Broadcasting` 디렉터리에는 애플리케이션의 모든 브로드캐스트 채널 클래스가 들어 있습니다. 이 클래스들은 `make:channel` 명령어로 생성됩니다. 이 디렉터리는 기본적으로 존재하지 않지만, 첫 번째 채널을 생성할 때 자동으로 만들어집니다. 채널에 대해 더 알고 싶다면 [이벤트 브로드캐스팅](/laravel/12.x/broadcasting) 문서를 참고하세요.


### Console 디렉터리 {#the-console-directory}

`Console` 디렉터리에는 애플리케이션의 모든 커스텀 Artisan 명령어가 들어 있습니다. 이 명령어들은 `make:command` 명령어로 생성할 수 있습니다.


### Events 디렉터리 {#the-events-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `event:generate` 또는 `make:event` Artisan 명령어로 생성됩니다. `Events` 디렉터리에는 [이벤트 클래스](/laravel/12.x/events)가 들어 있습니다. 이벤트는 특정 동작이 발생했음을 애플리케이션의 다른 부분에 알리는 데 사용되며, 높은 유연성과 결합도 감소를 제공합니다.


### Exceptions 디렉터리 {#the-exceptions-directory}

`Exceptions` 디렉터리에는 애플리케이션의 모든 커스텀 예외가 들어 있습니다. 이 예외들은 `make:exception` 명령어로 생성할 수 있습니다.


### Http 디렉터리 {#the-http-directory}

`Http` 디렉터리에는 컨트롤러, 미들웨어, 폼 요청이 들어 있습니다. 애플리케이션에 들어오는 요청을 처리하는 거의 모든 로직은 이 디렉터리에 위치하게 됩니다.


### Jobs 디렉터리 {#the-jobs-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:job` Artisan 명령어를 실행하면 생성됩니다. `Jobs` 디렉터리에는 애플리케이션의 [큐잉 가능한 작업](/laravel/12.x/queues)이 들어 있습니다. 작업은 애플리케이션에서 큐에 넣거나, 현재 요청 라이프사이클 내에서 동기적으로 실행할 수 있습니다. 현재 요청 중에 동기적으로 실행되는 작업은 "명령어"라고도 불리며, 이는 [커맨드 패턴](https://en.wikipedia.org/wiki/Command_pattern)의 구현이기 때문입니다.


### Listeners 디렉터리 {#the-listeners-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `event:generate` 또는 `make:listener` Artisan 명령어를 실행하면 생성됩니다. `Listeners` 디렉터리에는 [이벤트](/laravel/12.x/events)를 처리하는 클래스가 들어 있습니다. 이벤트 리스너는 이벤트 인스턴스를 받아 이벤트가 발생했을 때 로직을 수행합니다. 예를 들어, `UserRegistered` 이벤트는 `SendWelcomeEmail` 리스너에 의해 처리될 수 있습니다.


### Mail 디렉터리 {#the-mail-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:mail` Artisan 명령어를 실행하면 생성됩니다. `Mail` 디렉터리에는 애플리케이션에서 발송하는 [이메일을 나타내는 클래스](/laravel/12.x/mail)가 모두 들어 있습니다. 메일 객체는 이메일을 작성하는 모든 로직을 하나의 간단한 클래스에 캡슐화할 수 있게 해주며, `Mail::send` 메서드로 발송할 수 있습니다.


### Models 디렉터리 {#the-models-directory}

`Models` 디렉터리에는 모든 [Eloquent 모델 클래스](/laravel/12.x/eloquent)가 들어 있습니다. 라라벨에 포함된 Eloquent ORM은 데이터베이스 작업을 위한 아름답고 간단한 액티브 레코드 구현을 제공합니다. 각 데이터베이스 테이블에는 해당 테이블과 상호작용하는 "모델"이 있습니다. 모델을 통해 테이블의 데이터를 쿼리하거나, 새 레코드를 삽입할 수 있습니다.


### Notifications 디렉터리 {#the-notifications-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:notification` Artisan 명령어를 실행하면 생성됩니다. `Notifications` 디렉터리에는 애플리케이션에서 발송하는 모든 "트랜잭션" [알림](/laravel/12.x/notifications)이 들어 있습니다. 예를 들어, 애플리케이션 내에서 발생하는 이벤트에 대한 간단한 알림 등이 있습니다. 라라벨의 알림 기능은 이메일, 슬랙, SMS, 데이터베이스 저장 등 다양한 드라이버를 통해 알림을 발송하는 것을 추상화합니다.


### Policies 디렉터리 {#the-policies-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:policy` Artisan 명령어를 실행하면 생성됩니다. `Policies` 디렉터리에는 애플리케이션의 [권한 정책 클래스](/laravel/12.x/authorization)가 들어 있습니다. 정책은 사용자가 특정 리소스에 대해 주어진 동작을 수행할 수 있는지 여부를 결정하는 데 사용됩니다.


### Providers 디렉터리 {#the-providers-directory}

`Providers` 디렉터리에는 애플리케이션의 모든 [서비스 프로바이더](/laravel/12.x/providers)가 들어 있습니다. 서비스 프로바이더는 서비스 컨테이너에 서비스를 바인딩하거나, 이벤트를 등록하거나, 애플리케이션이 들어오는 요청을 처리할 준비를 하는 등 애플리케이션을 부트스트랩합니다.

새로운 라라벨 애플리케이션에서는 이 디렉터리에 이미 `AppServiceProvider`가 포함되어 있습니다. 필요에 따라 이 디렉터리에 직접 프로바이더를 추가할 수 있습니다.


### Rules 디렉터리 {#the-rules-directory}

이 디렉터리는 기본적으로 존재하지 않지만, `make:rule` Artisan 명령어를 실행하면 생성됩니다. `Rules` 디렉터리에는 애플리케이션의 커스텀 유효성 검사 규칙 객체가 들어 있습니다. 규칙은 복잡한 유효성 검사 로직을 간단한 객체로 캡슐화하는 데 사용됩니다. 자세한 내용은 [유효성 검사 문서](/laravel/12.x/validation)를 참고하세요.
