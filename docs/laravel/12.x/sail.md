# Laravel Sail

































## 소개 {#introduction}

[Laravel Sail](https://github.com/laravel/sail)은 Laravel의 기본 Docker 개발 환경과 상호작용할 수 있는 경량의 커맨드라인 인터페이스입니다. Sail을 사용하면 Docker에 대한 사전 지식 없이도 PHP, MySQL, Redis를 활용하여 Laravel 애플리케이션을 쉽게 구축할 수 있습니다.

Sail의 핵심은 프로젝트 루트에 위치한 `docker-compose.yml` 파일과 `sail` 스크립트입니다. `sail` 스크립트는 `docker-compose.yml` 파일에 정의된 Docker 컨테이너와 편리하게 상호작용할 수 있는 CLI를 제공합니다.

Laravel Sail은 macOS, Linux, Windows( [WSL2](https://docs.microsoft.com/en-us/windows/wsl/about) 사용)에서 지원됩니다.


## 설치 및 설정 {#installation}

Laravel Sail은 모든 새로운 Laravel 애플리케이션에 자동으로 설치되므로 즉시 사용할 수 있습니다.


### 기존 애플리케이션에 Sail 설치하기 {#installing-sail-into-existing-applications}

기존 Laravel 애플리케이션에서 Sail을 사용하고 싶다면 Composer 패키지 매니저를 통해 Sail을 설치할 수 있습니다. 물론, 이 단계는 기존 로컬 개발 환경에서 Composer 의존성 설치가 가능하다는 전제하에 진행됩니다:

```shell
composer require laravel/sail --dev
```

Sail 설치 후, `sail:install` Artisan 명령어를 실행할 수 있습니다. 이 명령어는 Sail의 `docker-compose.yml` 파일을 애플리케이션 루트에 복사하고, Docker 서비스와 연결할 수 있도록 `.env` 파일에 필요한 환경 변수를 추가합니다:

```shell
php artisan sail:install
```

마지막으로 Sail을 시작할 수 있습니다. Sail 사용법에 대해 더 알아보려면 아래 문서를 계속 읽어주세요:

```shell
./vendor/bin/sail up
```

> [!WARNING]
> Linux용 Docker Desktop을 사용하는 경우, 다음 명령어로 `default` Docker 컨텍스트를 사용해야 합니다: `docker context use default`.


#### 추가 서비스 설치하기 {#adding-additional-services}

기존 Sail 설치에 추가 서비스를 더하고 싶다면, `sail:add` Artisan 명령어를 실행할 수 있습니다:

```shell
php artisan sail:add
```


#### Devcontainer 사용하기 {#using-devcontainers}

[Devcontainer](https://code.visualstudio.com/docs/remote/containers) 환경에서 개발하고 싶다면, `sail:install` 명령어에 `--devcontainer` 옵션을 추가하세요. 이 옵션은 애플리케이션 루트에 기본 `.devcontainer/devcontainer.json` 파일을 생성합니다:

```shell
php artisan sail:install --devcontainer
```


### Sail 이미지 재빌드하기 {#rebuilding-sail-images}

Sail 이미지의 모든 패키지와 소프트웨어를 최신 상태로 유지하기 위해 이미지를 완전히 재빌드하고 싶을 때가 있습니다. `build` 명령어를 사용하여 이를 수행할 수 있습니다:

```shell
docker compose down -v

sail build --no-cache

sail up
```


### 셸 별칭 설정하기 {#configuring-a-shell-alias}

기본적으로 Sail 명령어는 모든 새로운 Laravel 애플리케이션에 포함된 `vendor/bin/sail` 스크립트를 통해 실행됩니다:

```shell
./vendor/bin/sail up
```

하지만 매번 `vendor/bin/sail`을 입력하는 대신, 셸 별칭을 설정하여 Sail 명령어를 더 쉽게 실행할 수 있습니다:

```shell
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

이 별칭을 항상 사용할 수 있도록, 홈 디렉터리의 셸 설정 파일(예: `~/.zshrc` 또는 `~/.bashrc`)에 추가한 후 셸을 재시작하세요.

셸 별칭이 설정되면, 단순히 `sail`만 입력하여 Sail 명령어를 실행할 수 있습니다. 이 문서의 예시들은 별칭이 설정되어 있다고 가정합니다:

```shell
sail up
```


## Sail 시작 및 중지 {#starting-and-stopping-sail}

Laravel Sail의 `docker-compose.yml` 파일에는 Laravel 애플리케이션 개발을 돕는 다양한 Docker 컨테이너가 정의되어 있습니다. 각 컨테이너는 `docker-compose.yml` 파일의 `services` 설정에 항목으로 존재합니다. `laravel.test` 컨테이너가 애플리케이션을 서비스하는 주요 컨테이너입니다.

Sail을 시작하기 전에, 로컬 컴퓨터에서 다른 웹 서버나 데이터베이스가 실행 중이지 않은지 확인하세요. 애플리케이션의 `docker-compose.yml` 파일에 정의된 모든 Docker 컨테이너를 시작하려면 `up` 명령어를 실행하세요:

```shell
sail up
```

모든 Docker 컨테이너를 백그라운드에서 실행하려면 "detached" 모드로 Sail을 시작할 수 있습니다:

```shell
sail up -d
```

애플리케이션 컨테이너가 시작되면, 웹 브라우저에서 http://localhost 로 프로젝트에 접근할 수 있습니다.

모든 컨테이너를 중지하려면 Control + C를 눌러 컨테이너 실행을 멈출 수 있습니다. 또는 컨테이너가 백그라운드에서 실행 중이라면 `stop` 명령어를 사용할 수 있습니다:

```shell
sail stop
```


## 명령어 실행하기 {#executing-sail-commands}

Laravel Sail을 사용할 때, 애플리케이션은 Docker 컨테이너 내에서 실행되며 로컬 컴퓨터와 격리되어 있습니다. 하지만 Sail은 임의의 PHP 명령어, Artisan 명령어, Composer 명령어, Node / NPM 명령어 등 다양한 명령어를 애플리케이션에 실행할 수 있는 편리한 방법을 제공합니다.

**Laravel 문서를 읽다 보면 Sail을 언급하지 않은 Composer, Artisan, Node / NPM 명령어 예시를 자주 볼 수 있습니다.** 이러한 예시는 해당 도구들이 로컬 컴퓨터에 설치되어 있다고 가정합니다. 로컬 Laravel 개발 환경에서 Sail을 사용한다면, 해당 명령어를 Sail을 통해 실행해야 합니다:

```shell
# 로컬에서 Artisan 명령어 실행...
php artisan queue:work

# Laravel Sail 내에서 Artisan 명령어 실행...
sail artisan queue:work
```


### PHP 명령어 실행하기 {#executing-php-commands}

PHP 명령어는 `php` 명령어를 사용해 실행할 수 있습니다. 이 명령어는 애플리케이션에 설정된 PHP 버전으로 실행됩니다. Sail에서 사용 가능한 PHP 버전에 대해 더 알고 싶다면 [PHP 버전 문서](#sail-php-versions)를 참고하세요:

```shell
sail php --version

sail php script.php
```


### Composer 명령어 실행하기 {#executing-composer-commands}

Composer 명령어는 `composer` 명령어를 사용해 실행할 수 있습니다. Laravel Sail의 애플리케이션 컨테이너에는 Composer가 설치되어 있습니다:

```shell
sail composer require laravel/sanctum
```


### Artisan 명령어 실행하기 {#executing-artisan-commands}

Laravel Artisan 명령어는 `artisan` 명령어를 사용해 실행할 수 있습니다:

```shell
sail artisan queue:work
```


### Node / NPM 명령어 실행하기 {#executing-node-npm-commands}

Node 명령어는 `node` 명령어로, NPM 명령어는 `npm` 명령어로 실행할 수 있습니다:

```shell
sail node --version

sail npm run dev
```

원한다면 NPM 대신 Yarn을 사용할 수도 있습니다:

```shell
sail yarn
```


## 데이터베이스와 상호작용하기 {#interacting-with-sail-databases}


### MySQL {#mysql}

애플리케이션의 `docker-compose.yml` 파일에는 MySQL 컨테이너 항목이 포함되어 있습니다. 이 컨테이너는 [Docker 볼륨](https://docs.docker.com/storage/volumes/)을 사용하여, 컨테이너를 중지하거나 재시작해도 데이터베이스에 저장된 데이터가 유지됩니다.

또한 MySQL 컨테이너가 처음 시작될 때, 두 개의 데이터베이스가 생성됩니다. 첫 번째 데이터베이스는 `DB_DATABASE` 환경 변수의 값으로 이름이 지정되며, 로컬 개발용입니다. 두 번째는 `testing`이라는 이름의 전용 테스트 데이터베이스로, 테스트가 개발 데이터에 영향을 주지 않도록 보장합니다.

컨테이너를 시작한 후, 애플리케이션의 `.env` 파일에서 `DB_HOST` 환경 변수를 `mysql`로 설정하면 MySQL 인스턴스에 연결할 수 있습니다.

로컬 컴퓨터에서 애플리케이션의 MySQL 데이터베이스에 연결하려면 [TablePlus](https://tableplus.com)와 같은 GUI 데이터베이스 관리 도구를 사용할 수 있습니다. 기본적으로 MySQL 데이터베이스는 `localhost`의 3306 포트에서 접근 가능하며, 접속 정보는 `DB_USERNAME`과 `DB_PASSWORD` 환경 변수의 값과 일치합니다. 또는 `root` 사용자로도 접속할 수 있으며, 이때 비밀번호는 `DB_PASSWORD` 환경 변수의 값을 사용합니다.


### MongoDB {#mongodb}

Sail 설치 시 [MongoDB](https://www.mongodb.com/) 서비스를 선택했다면, 애플리케이션의 `docker-compose.yml` 파일에는 [MongoDB Atlas Local](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-local-cloud/) 컨테이너 항목이 추가됩니다. 이 컨테이너는 [Search Indexes](https://www.mongodb.com/docs/atlas/atlas-search/)와 같은 Atlas 기능을 제공하는 MongoDB 문서 데이터베이스를 제공합니다. 이 컨테이너 역시 [Docker 볼륨](https://docs.docker.com/storage/volumes/)을 사용하여 데이터가 유지됩니다.

컨테이너를 시작한 후, 애플리케이션의 `.env` 파일에서 `MONGODB_URI` 환경 변수를 `mongodb://mongodb:27017`로 설정하면 MongoDB 인스턴스에 연결할 수 있습니다. 인증은 기본적으로 비활성화되어 있지만, `MONGODB_USERNAME`과 `MONGODB_PASSWORD` 환경 변수를 설정하여 인증을 활성화할 수 있습니다. 그런 다음 연결 문자열에 인증 정보를 추가하세요:

```ini
MONGODB_USERNAME=user
MONGODB_PASSWORD=laravel
MONGODB_URI=mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@mongodb:27017
```

MongoDB를 애플리케이션과 원활하게 통합하려면 [MongoDB에서 공식적으로 관리하는 패키지](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/)를 설치할 수 있습니다.

로컬 컴퓨터에서 애플리케이션의 MongoDB 데이터베이스에 연결하려면 [Compass](https://www.mongodb.com/products/tools/compass)와 같은 GUI를 사용할 수 있습니다. 기본적으로 MongoDB 데이터베이스는 `localhost`의 `27017` 포트에서 접근 가능합니다.


### Redis {#redis}

애플리케이션의 `docker-compose.yml` 파일에는 [Redis](https://redis.io) 컨테이너 항목도 포함되어 있습니다. 이 컨테이너는 [Docker 볼륨](https://docs.docker.com/storage/volumes/)을 사용하여, 컨테이너를 중지하거나 재시작해도 Redis 인스턴스의 데이터가 유지됩니다. 컨테이너를 시작한 후, 애플리케이션의 `.env` 파일에서 `REDIS_HOST` 환경 변수를 `redis`로 설정하면 Redis 인스턴스에 연결할 수 있습니다.

로컬 컴퓨터에서 애플리케이션의 Redis 데이터베이스에 연결하려면 [TablePlus](https://tableplus.com)와 같은 GUI 데이터베이스 관리 도구를 사용할 수 있습니다. 기본적으로 Redis 데이터베이스는 `localhost`의 6379 포트에서 접근 가능합니다.


### Valkey {#valkey}

Sail 설치 시 Valkey 서비스를 선택했다면, 애플리케이션의 `docker-compose.yml` 파일에 [Valkey](https://valkey.io/) 항목이 추가됩니다. 이 컨테이너 역시 [Docker 볼륨](https://docs.docker.com/storage/volumes/)을 사용하여, 컨테이너를 중지하거나 재시작해도 Valkey 인스턴스의 데이터가 유지됩니다. 애플리케이션의 `.env` 파일에서 `REDIS_HOST` 환경 변수를 `valkey`로 설정하면 이 컨테이너에 연결할 수 있습니다.

로컬 컴퓨터에서 애플리케이션의 Valkey 데이터베이스에 연결하려면 [TablePlus](https://tableplus.com)와 같은 GUI 데이터베이스 관리 도구를 사용할 수 있습니다. 기본적으로 Valkey 데이터베이스는 `localhost`의 6379 포트에서 접근 가능합니다.


### Meilisearch {#meilisearch}

Sail 설치 시 [Meilisearch](https://www.meilisearch.com) 서비스를 선택했다면, 애플리케이션의 `docker-compose.yml` 파일에 이 강력한 검색 엔진 항목이 추가됩니다. Meilisearch는 [Laravel Scout](/laravel/12.x/scout)와 통합되어 있습니다. 컨테이너를 시작한 후, 애플리케이션에서 `MEILISEARCH_HOST` 환경 변수를 `http://meilisearch:7700`으로 설정하면 Meilisearch 인스턴스에 연결할 수 있습니다.

로컬 컴퓨터에서는 웹 브라우저에서 `http://localhost:7700`으로 접속하여 Meilisearch의 웹 기반 관리 패널에 접근할 수 있습니다.


### Typesense {#typesense}

Sail 설치 시 [Typesense](https://typesense.org) 서비스를 선택했다면, 애플리케이션의 `docker-compose.yml` 파일에 이 초고속 오픈소스 검색 엔진 항목이 추가됩니다. Typesense는 [Laravel Scout](/laravel/12.x/scout#typesense)와 네이티브로 통합되어 있습니다. 컨테이너를 시작한 후, 아래 환경 변수를 설정하여 Typesense 인스턴스에 연결할 수 있습니다:

```ini
TYPESENSE_HOST=typesense
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
```

로컬 컴퓨터에서는 `http://localhost:8108`을 통해 Typesense의 API에 접근할 수 있습니다.


## 파일 스토리지 {#file-storage}

프로덕션 환경에서 Amazon S3를 사용해 파일을 저장할 계획이라면, Sail 설치 시 [MinIO](https://min.io) 서비스를 설치하는 것이 좋습니다. MinIO는 S3와 호환되는 API를 제공하므로, 프로덕션 S3 환경에 "테스트" 버킷을 만들지 않고도 로컬에서 Laravel의 `s3` 파일 스토리지 드라이버를 사용할 수 있습니다. Sail 설치 시 MinIO를 선택하면, 애플리케이션의 `docker-compose.yml` 파일에 MinIO 설정 섹션이 추가됩니다.

기본적으로 애플리케이션의 `filesystems` 설정 파일에는 이미 `s3` 디스크 구성이 포함되어 있습니다. 이 디스크를 사용해 Amazon S3뿐만 아니라 MinIO와 같은 S3 호환 파일 스토리지 서비스와도 연동할 수 있습니다. MinIO를 사용할 때는 관련 환경 변수를 다음과 같이 설정하세요:

```ini
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=sail
AWS_SECRET_ACCESS_KEY=password
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=local
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

MinIO 사용 시 Flysystem이 올바른 URL을 생성하도록 하려면, `AWS_URL` 환경 변수를 애플리케이션의 로컬 URL과 버킷 이름을 포함하도록 정의해야 합니다:

```ini
AWS_URL=http://localhost:9000/local
```

MinIO 콘솔( `http://localhost:8900` )에서 버킷을 생성할 수 있습니다. 기본 사용자명은 `sail`, 기본 비밀번호는 `password`입니다.

> [!WARNING]
> MinIO 사용 시 `temporaryUrl` 메서드를 통한 임시 스토리지 URL 생성은 지원되지 않습니다.


## 테스트 실행하기 {#running-tests}

Laravel은 기본적으로 뛰어난 테스트 지원을 제공하며, Sail의 `test` 명령어를 사용해 [기능 및 단위 테스트](/laravel/12.x/testing)를 실행할 수 있습니다. Pest / PHPUnit에서 허용하는 모든 CLI 옵션을 `test` 명령어에 전달할 수 있습니다:

```shell
sail test

sail test --group orders
```

Sail의 `test` 명령어는 `test` Artisan 명령어를 실행하는 것과 동일합니다:

```shell
sail artisan test
```

기본적으로 Sail은 전용 `testing` 데이터베이스를 생성하여 테스트가 현재 데이터베이스 상태에 영향을 주지 않도록 합니다. 기본 Laravel 설치에서는 Sail이 테스트 실행 시 이 데이터베이스를 사용하도록 `phpunit.xml` 파일도 자동으로 설정합니다:

```xml
<env name="DB_DATABASE" value="testing"/>
```


### Laravel Dusk {#laravel-dusk}

[Laravel Dusk](/laravel/12.x/dusk)는 표현력 있고 사용하기 쉬운 브라우저 자동화 및 테스트 API를 제공합니다. Sail 덕분에 로컬 컴퓨터에 Selenium이나 기타 도구를 설치하지 않고도 이러한 테스트를 실행할 수 있습니다. 시작하려면, 애플리케이션의 `docker-compose.yml` 파일에서 Selenium 서비스를 주석 해제하세요:

```yaml
selenium:
    image: 'selenium/standalone-chrome'
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    volumes:
        - '/dev/shm:/dev/shm'
    networks:
        - sail
```

다음으로, 애플리케이션의 `docker-compose.yml` 파일에서 `laravel.test` 서비스가 `selenium`에 대한 `depends_on` 항목을 포함하는지 확인하세요:

```yaml
depends_on:
    - mysql
    - redis
    - selenium
```

마지막으로 Sail을 시작하고 `dusk` 명령어를 실행하여 Dusk 테스트 스위트를 실행할 수 있습니다:

```shell
sail dusk
```


#### Apple Silicon에서 Selenium 사용하기 {#selenium-on-apple-silicon}

로컬 컴퓨터에 Apple Silicon 칩이 있다면, `selenium` 서비스는 `selenium/standalone-chromium` 이미지를 사용해야 합니다:

```yaml
selenium:
    image: 'selenium/standalone-chromium'
    extra_hosts:
        - 'host.docker.internal:host-gateway'
    volumes:
        - '/dev/shm:/dev/shm'
    networks:
        - sail
```


## 이메일 미리보기 {#previewing-emails}

Laravel Sail의 기본 `docker-compose.yml` 파일에는 [Mailpit](https://github.com/axllent/mailpit) 서비스 항목이 포함되어 있습니다. Mailpit은 로컬 개발 중 애플리케이션에서 전송된 이메일을 가로채고, 웹 인터페이스를 통해 이메일 메시지를 브라우저에서 미리볼 수 있도록 해줍니다. Sail 사용 시 Mailpit의 기본 호스트는 `mailpit`이며, 1025 포트로 접근할 수 있습니다:

```ini
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_ENCRYPTION=null
```

Sail이 실행 중일 때, `http://localhost:8025` 에서 Mailpit 웹 인터페이스에 접근할 수 있습니다.


## 컨테이너 CLI {#sail-container-cli}

때때로 애플리케이션 컨테이너 내에서 Bash 세션을 시작하고 싶을 수 있습니다. `shell` 명령어를 사용해 애플리케이션 컨테이너에 접속하면, 컨테이너 내 파일과 설치된 서비스 확인, 임의의 셸 명령어 실행 등이 가능합니다:

```shell
sail shell

sail root-shell
```

새로운 [Laravel Tinker](https://github.com/laravel/tinker) 세션을 시작하려면 `tinker` 명령어를 실행하세요:

```shell
sail tinker
```


## PHP 버전 {#sail-php-versions}

Sail은 현재 PHP 8.4, 8.3, 8.2, 8.1, 8.0을 통해 애플리케이션을 서비스할 수 있습니다. Sail의 기본 PHP 버전은 PHP 8.4입니다. 사용 중인 PHP 버전을 변경하려면, 애플리케이션의 `docker-compose.yml` 파일에서 `laravel.test` 컨테이너의 `build` 정의를 수정하세요:

```yaml
# PHP 8.4
context: ./vendor/laravel/sail/runtimes/8.4

# PHP 8.3
context: ./vendor/laravel/sail/runtimes/8.3

# PHP 8.2
context: ./vendor/laravel/sail/runtimes/8.2

# PHP 8.1
context: ./vendor/laravel/sail/runtimes/8.1

# PHP 8.0
context: ./vendor/laravel/sail/runtimes/8.0
```

또한, 애플리케이션에서 사용 중인 PHP 버전을 반영하도록 `image` 이름도 업데이트할 수 있습니다. 이 옵션 역시 `docker-compose.yml` 파일에 정의되어 있습니다:

```yaml
image: sail-8.2/app
```

`docker-compose.yml` 파일을 수정한 후에는 컨테이너 이미지를 재빌드해야 합니다:

```shell
sail build --no-cache

sail up
```


## Node 버전 {#sail-node-versions}

Sail은 기본적으로 Node 22를 설치합니다. 이미지 빌드 시 설치되는 Node 버전을 변경하려면, 애플리케이션의 `docker-compose.yml` 파일에서 `laravel.test` 서비스의 `build.args` 정의를 수정하세요:

```yaml
build:
    args:
        WWWGROUP: '${WWWGROUP}'
        NODE_VERSION: '18'
```

`docker-compose.yml` 파일을 수정한 후에는 컨테이너 이미지를 재빌드해야 합니다:

```shell
sail build --no-cache

sail up
```


## 사이트 공유하기 {#sharing-your-site}

동료에게 사이트를 미리 보여주거나, 애플리케이션의 웹훅 통합을 테스트하기 위해 사이트를 공개적으로 공유해야 할 때가 있습니다. 이럴 때는 `share` 명령어를 사용할 수 있습니다. 명령어 실행 후, 애플리케이션에 접근할 수 있는 무작위 `laravel-sail.site` URL이 발급됩니다:

```shell
sail share
```

`share` 명령어로 사이트를 공유할 때는, 애플리케이션의 `bootstrap/app.php` 파일에서 `trustProxies` 미들웨어 메서드를 사용해 신뢰할 수 있는 프록시를 설정해야 합니다. 그렇지 않으면 `url`, `route`와 같은 URL 생성 헬퍼가 올바른 HTTP 호스트를 결정하지 못할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```

공유 사이트의 서브도메인을 직접 지정하고 싶다면, `share` 명령어 실행 시 `subdomain` 옵션을 사용할 수 있습니다:

```shell
sail share --subdomain=my-sail-site
```

> [!NOTE]
> `share` 명령어는 [BeyondCode](https://beyondco.de)의 오픈소스 터널링 서비스인 [Expose](https://github.com/beyondcode/expose)로 구동됩니다.


## Xdebug로 디버깅하기 {#debugging-with-xdebug}

Laravel Sail의 Docker 구성에는 PHP의 인기 있고 강력한 디버거인 [Xdebug](https://xdebug.org/) 지원이 포함되어 있습니다. Xdebug를 활성화하려면, [Sail 설정을 퍼블리시](#sail-customization)했는지 확인한 후, 애플리케이션의 `.env` 파일에 다음 변수를 추가하세요:

```ini
SAIL_XDEBUG_MODE=develop,debug,coverage
```

다음으로, 퍼블리시된 `php.ini` 파일에 아래 설정이 포함되어 Xdebug가 지정된 모드로 활성화되도록 하세요:

```ini
[xdebug]
xdebug.mode=${XDEBUG_MODE}
```

`php.ini` 파일을 수정한 후에는 변경 사항이 적용되도록 Docker 이미지를 재빌드해야 합니다:

```shell
sail build --no-cache
```

#### Linux 호스트 IP 설정

내부적으로 `XDEBUG_CONFIG` 환경 변수는 `client_host=host.docker.internal`로 정의되어 있어 Mac과 Windows(WSL2)에서 Xdebug가 올바르게 동작합니다. 로컬 컴퓨터가 Linux이고 Docker 20.10 이상을 사용한다면 `host.docker.internal`이 지원되므로 별도 설정이 필요 없습니다.

Docker 20.10 미만 버전에서는 Linux에서 `host.docker.internal`이 지원되지 않으므로, 호스트 IP를 수동으로 지정해야 합니다. 이를 위해 `docker-compose.yml` 파일에 커스텀 네트워크를 정의하여 컨테이너에 고정 IP를 할당하세요:

```yaml
networks:
  custom_network:
    ipam:
      config:
        - subnet: 172.20.0.0/16

services:
  laravel.test:
    networks:
      custom_network:
        ipv4_address: 172.20.0.2
```

고정 IP를 설정한 후, 애플리케이션의 .env 파일에 SAIL_XDEBUG_CONFIG 변수를 정의하세요:

```ini
SAIL_XDEBUG_CONFIG="client_host=172.20.0.2"
```


### Xdebug CLI 사용법 {#xdebug-cli-usage}

`artisan` 명령어 실행 시 디버깅 세션을 시작하려면 `sail debug` 명령어를 사용할 수 있습니다:

```shell
# Xdebug 없이 Artisan 명령어 실행...
sail artisan migrate

# Xdebug와 함께 Artisan 명령어 실행...
sail debug migrate
```


### Xdebug 브라우저 사용법 {#xdebug-browser-usage}

웹 브라우저를 통해 애플리케이션과 상호작용하며 디버깅하려면, [Xdebug에서 제공하는 안내](https://xdebug.org/docs/step_debug#web-application)를 따라 웹 브라우저에서 Xdebug 세션을 시작하세요.

PhpStorm을 사용한다면, [제로-구성 디버깅](https://www.jetbrains.com/help/phpstorm/zero-configuration-debugging.html)에 관한 JetBrains 문서를 참고하세요.

> [!WARNING]
> Laravel Sail은 애플리케이션을 서비스하기 위해 `artisan serve`를 사용합니다. `artisan serve` 명령어는 Laravel 8.53.0 이상에서만 `XDEBUG_CONFIG`와 `XDEBUG_MODE` 변수를 지원합니다. Laravel 8.52.0 이하 버전에서는 이 변수들이 지원되지 않아 디버그 연결이 불가능합니다.


## 커스터마이징 {#sail-customization}

Sail은 단순히 Docker이기 때문에 거의 모든 부분을 자유롭게 커스터마이징할 수 있습니다. Sail의 Dockerfile을 퍼블리시하려면 `sail:publish` 명령어를 실행하세요:

```shell
sail artisan sail:publish
```

이 명령어를 실행하면, Laravel Sail에서 사용하는 Dockerfile과 기타 설정 파일이 애플리케이션 루트의 `docker` 디렉터리에 복사됩니다. Sail 설치를 커스터마이징한 후에는, 애플리케이션 컨테이너의 이미지 이름을 `docker-compose.yml` 파일에서 변경할 수 있습니다. 변경 후에는 `build` 명령어로 컨테이너를 재빌드하세요. 여러 Laravel 애플리케이션을 한 대의 컴퓨터에서 Sail로 개발할 때는 애플리케이션 이미지에 고유한 이름을 지정하는 것이 특히 중요합니다:

```shell
sail build --no-cache
```
