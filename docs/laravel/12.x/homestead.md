# Laravel Homestead



































## 소개 {#introduction}

> [!WARNING]
> Laravel Homestead는 더 이상 적극적으로 유지 관리되지 않는 레거시 패키지입니다. [Laravel Sail](/laravel/12.x/sail)을 현대적인 대안으로 사용할 수 있습니다.

Laravel은 로컬 개발 환경을 포함하여 전체 PHP 개발 경험을 즐겁게 만들기 위해 노력합니다. [Laravel Homestead](https://github.com/laravel/homestead)는 공식적으로 제공되는, 사전 패키징된 Vagrant 박스로, 로컬 컴퓨터에 PHP, 웹 서버 또는 기타 서버 소프트웨어를 설치하지 않고도 훌륭한 개발 환경을 제공합니다.

[Vagrant](https://www.vagrantup.com)는 가상 머신을 관리하고 프로비저닝하는 간단하고 우아한 방법을 제공합니다. Vagrant 박스는 완전히 폐기할 수 있습니다. 문제가 발생하면 박스를 몇 분 만에 삭제하고 다시 만들 수 있습니다!

Homestead는 Windows, macOS, Linux 시스템에서 모두 실행되며, Nginx, PHP, MySQL, PostgreSQL, Redis, Memcached, Node 등 Laravel 애플리케이션 개발에 필요한 모든 소프트웨어를 포함합니다.

> [!WARNING]
> Windows를 사용하는 경우 하드웨어 가상화(VT-x)를 활성화해야 할 수 있습니다. 일반적으로 BIOS에서 활성화할 수 있습니다. UEFI 시스템에서 Hyper-V를 사용하는 경우 VT-x에 접근하려면 Hyper-V를 비활성화해야 할 수도 있습니다.


### 포함된 소프트웨어 {#included-software}

<style>
    #software-list > ul {
        column-count: 2; -moz-column-count: 2; -webkit-column-count: 2;
        column-gap: 5em; -moz-column-gap: 5em; -webkit-column-gap: 5em;
        line-height: 1.9;
    }
</style>

<div id="software-list" markdown="1">

- Ubuntu 22.04
- Git
- PHP 8.3
- PHP 8.2
- PHP 8.1
- PHP 8.0
- PHP 7.4
- PHP 7.3
- PHP 7.2
- PHP 7.1
- PHP 7.0
- PHP 5.6
- Nginx
- MySQL 8.0
- lmm
- Sqlite3
- PostgreSQL 15
- Composer
- Docker
- Node (Yarn, Bower, Grunt, Gulp 포함)
- Redis
- Memcached
- Beanstalkd
- Mailpit
- avahi
- ngrok
- Xdebug
- XHProf / Tideways / XHGui
- wp-cli

</div>


### 선택적 소프트웨어 {#optional-software}

<style>
    #software-list > ul {
        column-count: 2; -moz-column-count: 2; -webkit-column-count: 2;
        column-gap: 5em; -moz-column-gap: 5em; -webkit-column-gap: 5em;
        line-height: 1.9;
    }
</style>

<div id="software-list" markdown="1">

- Apache
- Blackfire
- Cassandra
- Chronograf
- CouchDB
- Crystal & Lucky Framework
- Elasticsearch
- EventStoreDB
- Flyway
- Gearman
- Go
- Grafana
- InfluxDB
- Logstash
- MariaDB
- Meilisearch
- MinIO
- MongoDB
- Neo4j
- Oh My Zsh
- Open Resty
- PM2
- Python
- R
- RabbitMQ
- Rust
- RVM (Ruby Version Manager)
- Solr
- TimescaleDB
- Trader <small>(PHP 확장)</small>
- Webdriver & Laravel Dusk Utilities

</div>


## 설치 및 설정 {#installation-and-setup}


### 첫 단계 {#first-steps}

Homestead 환경을 실행하기 전에 [Vagrant](https://developer.hashicorp.com/vagrant/downloads)와 다음 중 하나의 지원되는 프로바이더를 설치해야 합니다:

- [VirtualBox 6.1.x](https://www.virtualbox.org/wiki/Download_Old_Builds_6_1)
- [Parallels](https://www.parallels.com/products/desktop/)

이 소프트웨어 패키지들은 모든 주요 운영체제에서 쉽게 사용할 수 있는 설치 관리자를 제공합니다.

Parallels 프로바이더를 사용하려면 [Parallels Vagrant 플러그인](https://github.com/Parallels/vagrant-parallels)을 설치해야 합니다. 이 플러그인은 무료입니다.


#### Homestead 설치 {#installing-homestead}

Homestead는 호스트 머신에 Homestead 저장소를 클론하여 설치할 수 있습니다. Homestead 가상 머신이 모든 Laravel 애플리케이션의 호스트 역할을 하므로, "홈" 디렉터리 내에 `Homestead` 폴더로 저장소를 클론하는 것이 좋습니다. 이 문서 전체에서 이 디렉터리를 "Homestead 디렉터리"라고 부릅니다:

```shell
git clone https://github.com/laravel/homestead.git ~/Homestead
```

Laravel Homestead 저장소를 클론한 후에는 `release` 브랜치로 체크아웃해야 합니다. 이 브랜치는 항상 Homestead의 최신 안정 버전을 포함합니다:

```shell
cd ~/Homestead

git checkout release
```

다음으로, Homestead 디렉터리에서 `bash init.sh` 명령을 실행하여 `Homestead.yaml` 설정 파일을 생성합니다. `Homestead.yaml` 파일은 Homestead 설치에 대한 모든 설정을 구성하는 곳입니다. 이 파일은 Homestead 디렉터리에 생성됩니다:

```shell
# macOS / Linux...
bash init.sh

# Windows...
init.bat
```


### Homestead 설정 {#configuring-homestead}


#### 프로바이더 설정 {#setting-your-provider}

`Homestead.yaml` 파일의 `provider` 키는 사용할 Vagrant 프로바이더(`virtualbox` 또는 `parallels`)를 지정합니다:

    provider: virtualbox

> [!WARNING]
> Apple Silicon을 사용하는 경우 Parallels 프로바이더가 필수입니다.


#### 공유 폴더 설정 {#configuring-shared-folders}

`Homestead.yaml` 파일의 `folders` 속성에는 Homestead 환경과 공유할 폴더 목록이 있습니다. 이 폴더 내의 파일이 변경되면 로컬 머신과 Homestead 가상 환경 간에 동기화됩니다. 필요한 만큼 많은 공유 폴더를 설정할 수 있습니다:

```yaml
folders:
    - map: ~/code/project1
      to: /home/vagrant/project1
```

> [!WARNING]
> Windows 사용자는 `~/` 경로 구문을 사용하지 말고, `C:\Users\user\Code\project1`와 같이 프로젝트의 전체 경로를 사용해야 합니다.

항상 각 애플리케이션을 개별 폴더 매핑에 매핑해야 하며, 모든 애플리케이션을 포함하는 하나의 큰 디렉터리를 매핑하지 않아야 합니다. 폴더를 매핑하면 가상 머신이 폴더 내 *모든* 파일의 디스크 IO를 추적해야 하므로, 파일 수가 많은 폴더에서는 성능 저하가 발생할 수 있습니다:

```yaml
folders:
    - map: ~/code/project1
      to: /home/vagrant/project1
    - map: ~/code/project2
      to: /home/vagrant/project2
```

> [!WARNING]
> Homestead를 사용할 때는 절대 `.`(현재 디렉터리)를 마운트하지 마세요. 이렇게 하면 Vagrant가 현재 폴더를 `/vagrant`에 매핑하지 않아 선택적 기능이 동작하지 않거나 예기치 않은 결과가 발생할 수 있습니다.

[NFS](https://developer.hashicorp.com/vagrant/docs/synced-folders/nfs)를 활성화하려면 폴더 매핑에 `type` 옵션을 추가할 수 있습니다:

```yaml
folders:
    - map: ~/code/project1
      to: /home/vagrant/project1
      type: "nfs"
```

> [!WARNING]
> Windows에서 NFS를 사용할 경우 [vagrant-winnfsd](https://github.com/winnfsd/vagrant-winnfsd) 플러그인 설치를 고려하세요. 이 플러그인은 Homestead 가상 머신 내 파일 및 디렉터리의 올바른 사용자/그룹 권한을 유지합니다.

Vagrant의 [Synced Folders](https://developer.hashicorp.com/vagrant/docs/synced-folders/basic_usage)에서 지원하는 모든 옵션을 `options` 키 아래에 나열하여 전달할 수도 있습니다:

```yaml
folders:
    - map: ~/code/project1
      to: /home/vagrant/project1
      type: "rsync"
      options:
          rsync__args: ["--verbose", "--archive", "--delete", "-zz"]
          rsync__exclude: ["node_modules"]
```


### Nginx 사이트 설정 {#configuring-nginx-sites}

Nginx에 익숙하지 않으신가요? 걱정하지 마세요. `Homestead.yaml` 파일의 `sites` 속성을 사용하면 Homestead 환경의 폴더에 "도메인"을 쉽게 매핑할 수 있습니다. 예시 사이트 설정이 `Homestead.yaml` 파일에 포함되어 있습니다. 필요에 따라 Homestead 환경에 여러 사이트를 추가할 수 있습니다. Homestead는 여러분이 작업 중인 모든 Laravel 애플리케이션에 편리한 가상화 환경을 제공합니다:

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/project1/public
```

Homestead 가상 머신을 프로비저닝한 후 `sites` 속성을 변경했다면, 터미널에서 `vagrant reload --provision` 명령을 실행하여 가상 머신의 Nginx 설정을 업데이트해야 합니다.

> [!WARNING]
> Homestead 스크립트는 최대한 멱등성(idempotent)을 유지하도록 설계되었습니다. 그러나 프로비저닝 중 문제가 발생하면 `vagrant destroy && vagrant up` 명령을 실행하여 머신을 삭제하고 다시 빌드해야 합니다.


#### 호스트네임 해상도 {#hostname-resolution}

Homestead는 자동 호스트 해상도를 위해 `mDNS`를 사용하여 호스트네임을 게시합니다. `Homestead.yaml` 파일에 `hostname: homestead`를 설정하면 호스트는 `homestead.local`에서 접근할 수 있습니다. macOS, iOS, Linux 데스크톱 배포판에는 기본적으로 `mDNS` 지원이 포함되어 있습니다. Windows를 사용하는 경우 [Bonjour Print Services for Windows](https://support.apple.com/kb/DL999?viewlocale=en_US&locale=en_US)를 설치해야 합니다.

자동 호스트네임은 Homestead의 [프로젝트별 설치](#per-project-installation)에서 가장 잘 작동합니다. 하나의 Homestead 인스턴스에서 여러 사이트를 호스팅하는 경우, 웹 사이트의 "도메인"을 로컬 머신의 `hosts` 파일에 추가할 수 있습니다. `hosts` 파일은 Homestead 사이트에 대한 요청을 Homestead 가상 머신으로 리디렉션합니다. macOS와 Linux에서는 `/etc/hosts`, Windows에서는 `C:\Windows\System32\drivers\etc\hosts`에 위치합니다. 이 파일에 추가할 줄은 다음과 같습니다:

```text
192.168.56.56  homestead.test
```

IP 주소가 `Homestead.yaml` 파일에 설정된 것과 일치하는지 확인하세요. 도메인을 `hosts` 파일에 추가하고 Vagrant 박스를 실행하면 웹 브라우저에서 사이트에 접근할 수 있습니다:

```shell
http://homestead.test
```


### 서비스 설정 {#configuring-services}

Homestead는 기본적으로 여러 서비스를 시작하지만, 프로비저닝 중 활성화 또는 비활성화할 서비스를 사용자 지정할 수 있습니다. 예를 들어, `Homestead.yaml` 파일의 `services` 옵션을 수정하여 PostgreSQL을 활성화하고 MySQL을 비활성화할 수 있습니다:

```yaml
services:
    - enabled:
        - "postgresql"
    - disabled:
        - "mysql"
```

지정된 서비스는 `enabled`와 `disabled` 지시문에 따라 순서대로 시작 또는 중지됩니다.


### Vagrant 박스 실행 {#launching-the-vagrant-box}

`Homestead.yaml` 파일을 원하는 대로 수정한 후, Homestead 디렉터리에서 `vagrant up` 명령을 실행하세요. Vagrant가 가상 머신을 부팅하고 공유 폴더와 Nginx 사이트를 자동으로 설정합니다.

머신을 삭제하려면 `vagrant destroy` 명령을 사용할 수 있습니다.


### 프로젝트별 설치 {#per-project-installation}

Homestead를 전역으로 설치하여 모든 프로젝트에서 동일한 Homestead 가상 머신을 공유하는 대신, 관리하는 각 프로젝트마다 Homestead 인스턴스를 설정할 수 있습니다. 프로젝트별로 Homestead를 설치하면, 프로젝트에 `Vagrantfile`을 함께 제공하여 다른 개발자가 저장소를 클론한 후 바로 `vagrant up`을 실행할 수 있습니다.

Composer 패키지 관리자를 사용하여 프로젝트에 Homestead를 설치할 수 있습니다:

```shell
composer require laravel/homestead --dev
```

Homestead를 설치한 후, Homestead의 `make` 명령을 실행하여 프로젝트용 `Vagrantfile`과 `Homestead.yaml` 파일을 생성하세요. 이 파일들은 프로젝트 루트에 생성됩니다. `make` 명령은 `Homestead.yaml` 파일의 `sites`와 `folders` 지시문을 자동으로 설정합니다:

```shell
# macOS / Linux...
php vendor/bin/homestead make

# Windows...
vendor\\bin\\homestead make
```

다음으로, 터미널에서 `vagrant up` 명령을 실행하고 브라우저에서 `http://homestead.test`로 프로젝트에 접근하세요. 자동 [호스트네임 해상도](#hostname-resolution)를 사용하지 않는 경우, `homestead.test` 또는 원하는 도메인에 대한 `/etc/hosts` 파일 항목을 추가해야 합니다.


### 선택적 기능 설치 {#installing-optional-features}

선택적 소프트웨어는 `Homestead.yaml` 파일의 `features` 옵션을 사용하여 설치합니다. 대부분의 기능은 불리언 값으로 활성화 또는 비활성화할 수 있으며, 일부 기능은 여러 설정 옵션을 허용합니다:

```yaml
features:
    - blackfire:
        server_id: "server_id"
        server_token: "server_value"
        client_id: "client_id"
        client_token: "client_value"
    - cassandra: true
    - chronograf: true
    - couchdb: true
    - crystal: true
    - dragonflydb: true
    - elasticsearch:
        version: 7.9.0
    - eventstore: true
        version: 21.2.0
    - flyway: true
    - gearman: true
    - golang: true
    - grafana: true
    - influxdb: true
    - logstash: true
    - mariadb: true
    - meilisearch: true
    - minio: true
    - mongodb: true
    - neo4j: true
    - ohmyzsh: true
    - openresty: true
    - pm2: true
    - python: true
    - r-base: true
    - rabbitmq: true
    - rustc: true
    - rvm: true
    - solr: true
    - timescaledb: true
    - trader: true
    - webdriver: true
```


#### Elasticsearch {#elasticsearch}

Elasticsearch의 지원되는 버전을 지정할 수 있으며, 반드시 정확한 버전(major.minor.patch)이어야 합니다. 기본 설치는 'homestead'라는 클러스터를 생성합니다. Elasticsearch에 운영체제 메모리의 절반 이상을 할당해서는 안 되므로, Homestead 가상 머신이 Elasticsearch 할당량의 두 배 이상의 메모리를 갖도록 하세요.

> [!NOTE]
> [Elasticsearch 문서](https://www.elastic.co/guide/en/elasticsearch/reference/current)를 참고하여 설정을 커스터마이즈하는 방법을 확인하세요.


#### MariaDB {#mariadb}

MariaDB를 활성화하면 MySQL이 제거되고 MariaDB가 설치됩니다. MariaDB는 일반적으로 MySQL의 대체제로 사용되므로, 애플리케이션의 데이터베이스 설정에서 여전히 `mysql` 데이터베이스 드라이버를 사용해야 합니다.


#### MongoDB {#mongodb}

기본 MongoDB 설치는 데이터베이스 사용자명을 `homestead`, 비밀번호를 `secret`으로 설정합니다.


#### Neo4j {#neo4j}

기본 Neo4j 설치는 데이터베이스 사용자명을 `homestead`, 비밀번호를 `secret`으로 설정합니다. Neo4j 브라우저에 접속하려면 웹 브라우저에서 `http://homestead.test:7474`로 방문하세요. 포트 `7687`(Bolt), `7474`(HTTP), `7473`(HTTPS)이 Neo4j 클라이언트 요청을 처리할 준비가 되어 있습니다.


### 별칭(Aliases) {#aliases}

Homestead 디렉터리 내의 `aliases` 파일을 수정하여 Homestead 가상 머신에 Bash 별칭을 추가할 수 있습니다:

```shell
alias c='clear'
alias ..='cd ..'
```

`aliases` 파일을 업데이트한 후에는 `vagrant reload --provision` 명령을 실행하여 Homestead 가상 머신을 다시 프로비저닝해야 합니다. 이렇게 하면 새 별칭이 머신에서 사용 가능해집니다.


## Homestead 업데이트 {#updating-homestead}

Homestead를 업데이트하기 전에, Homestead 디렉터리에서 다음 명령을 실행하여 현재 가상 머신을 삭제해야 합니다:

```shell
vagrant destroy
```

다음으로, Homestead 소스 코드를 업데이트해야 합니다. 저장소를 클론했다면, 저장소를 클론한 위치에서 다음 명령을 실행할 수 있습니다:

```shell
git fetch

git pull origin release
```

이 명령들은 GitHub 저장소에서 최신 Homestead 코드를 가져오고, 최신 태그를 가져온 후 최신 태그 릴리스를 체크아웃합니다. Homestead의 [GitHub 릴리스 페이지](https://github.com/laravel/homestead/releases)에서 최신 안정 버전을 확인할 수 있습니다.

프로젝트의 `composer.json` 파일을 통해 Homestead를 설치했다면, `composer.json` 파일에 `"laravel/homestead": "^12"`가 포함되어 있는지 확인하고, 의존성을 업데이트하세요:

```shell
composer update
```

다음으로, `vagrant box update` 명령을 사용하여 Vagrant 박스를 업데이트해야 합니다:

```shell
vagrant box update
```

Vagrant 박스를 업데이트한 후, Homestead 디렉터리에서 `bash init.sh` 명령을 실행하여 Homestead의 추가 설정 파일을 업데이트해야 합니다. 기존 `Homestead.yaml`, `after.sh`, `aliases` 파일을 덮어쓸지 여부를 묻는 메시지가 표시됩니다:

```shell
# macOS / Linux...
bash init.sh

# Windows...
init.bat
```

마지막으로, 최신 Vagrant 설치를 사용하려면 Homestead 가상 머신을 다시 생성해야 합니다:

```shell
vagrant up
```


## 일상적인 사용 {#daily-usage}


### SSH로 접속하기 {#connecting-via-ssh}

Homestead 디렉터리에서 `vagrant ssh` 터미널 명령을 실행하여 가상 머신에 SSH로 접속할 수 있습니다.


### 추가 사이트 등록 {#adding-additional-sites}

Homestead 환경이 프로비저닝되고 실행 중이라면, 다른 Laravel 프로젝트를 위한 추가 Nginx 사이트를 등록할 수 있습니다. 하나의 Homestead 환경에서 원하는 만큼 많은 Laravel 프로젝트를 실행할 수 있습니다. 추가 사이트를 등록하려면, `Homestead.yaml` 파일에 사이트를 추가하세요.

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/project1/public
    - map: another.test
      to: /home/vagrant/project2/public
```

> [!WARNING]
> 사이트를 추가하기 전에 해당 프로젝트 디렉터리에 대한 [폴더 매핑](#configuring-shared-folders)이 설정되어 있는지 확인해야 합니다.

Vagrant가 "hosts" 파일을 자동으로 관리하지 않는 경우, 새 사이트를 해당 파일에 추가해야 할 수도 있습니다. macOS와 Linux에서는 `/etc/hosts`, Windows에서는 `C:\Windows\System32\drivers\etc\hosts`에 위치합니다:

```text
192.168.56.56  homestead.test
192.168.56.56  another.test
```

사이트를 추가한 후, Homestead 디렉터리에서 `vagrant reload --provision` 터미널 명령을 실행하세요.


#### 사이트 타입 {#site-types}

Homestead는 Laravel 기반이 아닌 프로젝트도 쉽게 실행할 수 있도록 여러 "타입"의 사이트를 지원합니다. 예를 들어, `statamic` 사이트 타입을 사용하여 Statamic 애플리케이션을 Homestead에 쉽게 추가할 수 있습니다:

```yaml
sites:
    - map: statamic.test
      to: /home/vagrant/my-symfony-project/web
      type: "statamic"
```

사용 가능한 사이트 타입은 다음과 같습니다: `apache`, `apache-proxy`, `apigility`, `expressive`, `laravel`(기본값), `proxy`(nginx용), `silverstripe`, `statamic`, `symfony2`, `symfony4`, `zf`.


#### 사이트 파라미터 {#site-parameters}

사이트에 추가 Nginx `fastcgi_param` 값을 `params` 사이트 지시문을 통해 추가할 수 있습니다:

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/project1/public
      params:
          - key: FOO
            value: BAR
```


### 환경 변수 {#environment-variables}

`Homestead.yaml` 파일에 환경 변수를 추가하여 전역 환경 변수를 정의할 수 있습니다:

```yaml
variables:
    - key: APP_ENV
      value: local
    - key: FOO
      value: bar
```

`Homestead.yaml` 파일을 업데이트한 후에는 `vagrant reload --provision` 명령을 실행하여 머신을 다시 프로비저닝해야 합니다. 이렇게 하면 설치된 모든 PHP 버전의 PHP-FPM 설정과 `vagrant` 사용자의 환경이 업데이트됩니다.


### 포트 {#ports}

기본적으로 다음 포트가 Homestead 환경으로 포워딩됩니다:

<div class="content-list" markdown="1">

- **HTTP:** 8000 &rarr; 80으로 포워딩
- **HTTPS:** 44300 &rarr; 443으로 포워딩

</div>


#### 추가 포트 포워딩 {#forwarding-additional-ports}

원한다면, `Homestead.yaml` 파일에 `ports` 설정 항목을 정의하여 Vagrant 박스로 추가 포트를 포워딩할 수 있습니다. `Homestead.yaml` 파일을 업데이트한 후에는 `vagrant reload --provision` 명령을 실행하여 머신을 다시 프로비저닝해야 합니다:

```yaml
ports:
    - send: 50000
      to: 5000
    - send: 7777
      to: 777
      protocol: udp
```

아래는 호스트 머신에서 Vagrant 박스로 매핑할 수 있는 추가 Homestead 서비스 포트 목록입니다:

<div class="content-list" markdown="1">

- **SSH:** 2222 &rarr; 22로
- **ngrok UI:** 4040 &rarr; 4040으로
- **MySQL:** 33060 &rarr; 3306으로
- **PostgreSQL:** 54320 &rarr; 5432로
- **MongoDB:** 27017 &rarr; 27017로
- **Mailpit:** 8025 &rarr; 8025로
- **Minio:** 9600 &rarr; 9600으로

</div>


### PHP 버전 {#php-versions}

Homestead는 하나의 가상 머신에서 여러 PHP 버전을 실행할 수 있습니다. `Homestead.yaml` 파일에서 사이트별로 사용할 PHP 버전을 지정할 수 있습니다. 사용 가능한 PHP 버전은 "5.6", "7.0", "7.1", "7.2", "7.3", "7.4", "8.0", "8.1", "8.2", "8.3"(기본값)입니다:

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/project1/public
      php: "7.1"
```

[Homestead 가상 머신 내](#connecting-via-ssh)에서는 CLI를 통해 지원되는 모든 PHP 버전을 사용할 수 있습니다:

```shell
php5.6 artisan list
php7.0 artisan list
php7.1 artisan list
php7.2 artisan list
php7.3 artisan list
php7.4 artisan list
php8.0 artisan list
php8.1 artisan list
php8.2 artisan list
php8.3 artisan list
```

CLI에서 기본 PHP 버전을 변경하려면 Homestead 가상 머신 내에서 다음 명령을 실행하세요:

```shell
php56
php70
php71
php72
php73
php74
php80
php81
php82
php83
```


### 데이터베이스 연결 {#connecting-to-databases}

MySQL과 PostgreSQL 모두에 대해 `homestead` 데이터베이스가 기본으로 설정되어 있습니다. 호스트 머신의 데이터베이스 클라이언트에서 MySQL 또는 PostgreSQL 데이터베이스에 연결하려면, `127.0.0.1`의 포트 `33060`(MySQL) 또는 `54320`(PostgreSQL)으로 연결해야 합니다. 두 데이터베이스의 사용자명과 비밀번호는 `homestead` / `secret`입니다.

> [!WARNING]
> 호스트 머신에서 데이터베이스에 연결할 때만 이 비표준 포트를 사용해야 합니다. Laravel 애플리케이션의 `database` 설정 파일에서는 기본 포트 3306, 5432를 사용해야 하며, Laravel은 _가상 머신 내_에서 실행됩니다.


### 데이터베이스 백업 {#database-backups}

Homestead는 Homestead 가상 머신이 삭제될 때 데이터베이스를 자동으로 백업할 수 있습니다. 이 기능을 사용하려면 Vagrant 2.1.0 이상을 사용해야 하며, 이전 버전의 Vagrant를 사용하는 경우 `vagrant-triggers` 플러그인을 설치해야 합니다. 자동 데이터베이스 백업을 활성화하려면 `Homestead.yaml` 파일에 다음 줄을 추가하세요:

```yaml
backup: true
```

설정이 완료되면, `vagrant destroy` 명령이 실행될 때 Homestead가 데이터베이스를 `.backup/mysql_backup` 및 `.backup/postgres_backup` 디렉터리에 내보냅니다. 이 디렉터리는 Homestead를 설치한 폴더 또는 [프로젝트별 설치](#per-project-installation) 방법을 사용하는 경우 프로젝트 루트에 위치합니다.


### 크론 스케줄 설정 {#configuring-cron-schedules}

Laravel은 [크론 작업 예약](/laravel/12.x/scheduling)을 위해 매 분마다 단일 `schedule:run` Artisan 명령을 예약하는 편리한 방법을 제공합니다. `schedule:run` 명령은 `routes/console.php` 파일에 정의된 작업 스케줄을 검사하여 실행할 예약 작업을 결정합니다.

Homestead 사이트에 대해 `schedule:run` 명령을 실행하려면, 사이트를 정의할 때 `schedule` 옵션을 `true`로 설정하세요:

```yaml
sites:
    - map: homestead.test
      to: /home/vagrant/project1/public
      schedule: true
```

해당 사이트의 크론 작업은 Homestead 가상 머신의 `/etc/cron.d` 디렉터리에 정의됩니다.


### Mailpit 설정 {#configuring-mailpit}

[Mailpit](https://github.com/axllent/mailpit)은 발송되는 이메일을 가로채 실제 수신자에게 메일을 보내지 않고도 내용을 확인할 수 있게 해줍니다. 시작하려면 애플리케이션의 `.env` 파일을 다음과 같이 설정하세요:

```ini
MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

Mailpit이 설정되면, `http://localhost:8025`에서 Mailpit 대시보드에 접근할 수 있습니다.


### Minio 설정 {#configuring-minio}

[Minio](https://github.com/minio/minio)는 Amazon S3 호환 API를 제공하는 오픈 소스 오브젝트 스토리지 서버입니다. Minio를 설치하려면 [features](#installing-optional-features) 섹션에 다음 설정 옵션을 추가하세요:

    minio: true

기본적으로 Minio는 9600 포트에서 사용 가능합니다. `http://localhost:9600`에서 Minio 관리 패널에 접근할 수 있습니다. 기본 access key는 `homestead`, 기본 secret key는 `secretkey`입니다. Minio에 접근할 때는 항상 region을 `us-east-1`로 사용해야 합니다.

Minio를 사용하려면 `.env` 파일에 다음 옵션이 있는지 확인하세요:

```ini
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_ENDPOINT=http://localhost:9600
AWS_ACCESS_KEY_ID=homestead
AWS_SECRET_ACCESS_KEY=secretkey
AWS_DEFAULT_REGION=us-east-1
```

Minio 기반 "S3" 버킷을 프로비저닝하려면, `Homestead.yaml` 파일에 `buckets` 지시문을 추가하세요. 버킷을 정의한 후에는 터미널에서 `vagrant reload --provision` 명령을 실행해야 합니다:

```yaml
buckets:
    - name: your-bucket
      policy: public
    - name: your-private-bucket
      policy: none
```

지원되는 `policy` 값은 `none`, `download`, `upload`, `public`입니다.


### Laravel Dusk {#laravel-dusk}

[Laravel Dusk](/laravel/12.x/dusk) 테스트를 Homestead 내에서 실행하려면, Homestead 설정에서 [webdriver 기능](#installing-optional-features)을 활성화해야 합니다:

```yaml
features:
    - webdriver: true
```

`webdriver` 기능을 활성화한 후에는 터미널에서 `vagrant reload --provision` 명령을 실행해야 합니다.


### 환경 공유 {#sharing-your-environment}

때때로 현재 작업 중인 내용을 동료나 클라이언트와 공유하고 싶을 수 있습니다. Vagrant는 `vagrant share` 명령을 통해 이를 기본적으로 지원하지만, `Homestead.yaml` 파일에 여러 사이트가 설정되어 있으면 동작하지 않습니다.

이 문제를 해결하기 위해 Homestead에는 자체 `share` 명령이 포함되어 있습니다. 먼저, `vagrant ssh`를 통해 [Homestead 가상 머신에 SSH로 접속](#connecting-via-ssh)한 후, `share homestead.test` 명령을 실행하세요. 이 명령은 `Homestead.yaml` 설정 파일에 있는 `homestead.test` 사이트를 공유합니다. `homestead.test` 대신 다른 사이트를 지정할 수도 있습니다:

```shell
share homestead.test
```

명령을 실행하면 Ngrok 화면이 나타나며, 활동 로그와 공유 사이트의 공개 접근 가능한 URL이 표시됩니다. 사용자 지정 region, 서브도메인 등 Ngrok 런타임 옵션을 지정하려면 `share` 명령에 추가할 수 있습니다:

```shell
share homestead.test -region=eu -subdomain=laravel
```

HTTP 대신 HTTPS로 콘텐츠를 공유해야 한다면, `share` 대신 `sshare` 명령을 사용하면 됩니다.

> [!WARNING]
> Vagrant는 본질적으로 보안이 취약하므로, `share` 명령을 실행할 때 가상 머신이 인터넷에 노출된다는 점을 기억하세요.


## 디버깅 및 프로파일링 {#debugging-and-profiling}


### Xdebug로 웹 요청 디버깅 {#debugging-web-requests}

Homestead는 [Xdebug](https://xdebug.org)를 사용한 단계별 디버깅을 지원합니다. 예를 들어, 브라우저에서 페이지에 접근하면 PHP가 IDE에 연결되어 실행 중인 코드를 검사하고 수정할 수 있습니다.

기본적으로 Xdebug는 이미 실행 중이며 연결을 받을 준비가 되어 있습니다. CLI에서 Xdebug를 활성화해야 한다면, Homestead 가상 머신 내에서 `sudo phpenmod xdebug` 명령을 실행하세요. 다음으로, IDE의 안내에 따라 디버깅을 활성화하세요. 마지막으로, 브라우저에서 확장 프로그램이나 [북마클릿](https://www.jetbrains.com/phpstorm/marklets/)을 사용하여 Xdebug를 트리거하세요.

> [!WARNING]
> Xdebug는 PHP 실행 속도를 크게 저하시킵니다. Xdebug를 비활성화하려면 Homestead 가상 머신 내에서 `sudo phpdismod xdebug`를 실행하고 FPM 서비스를 재시작하세요.


#### Xdebug 자동 시작 {#autostarting-xdebug}

웹 서버에 요청을 보내는 기능 테스트를 디버깅할 때, 디버깅을 트리거하기 위해 테스트를 수정하는 대신 디버깅을 자동 시작하는 것이 더 쉽습니다. Xdebug를 자동으로 시작하려면, Homestead 가상 머신 내의 `/etc/php/7.x/fpm/conf.d/20-xdebug.ini` 파일을 수정하고 다음 설정을 추가하세요:

```ini
; Homestead.yaml에 IP 주소의 다른 서브넷이 포함된 경우, 이 주소가 다를 수 있습니다...
xdebug.client_host = 192.168.10.1
xdebug.mode = debug
xdebug.start_with_request = yes
```


### CLI 애플리케이션 디버깅 {#debugging-cli-applications}

PHP CLI 애플리케이션을 디버깅하려면, Homestead 가상 머신 내에서 `xphp` 셸 별칭을 사용하세요:

```shell
xphp /path/to/script
```


### Blackfire로 애플리케이션 프로파일링 {#profiling-applications-with-blackfire}

[Blackfire](https://blackfire.io/docs/introduction)는 웹 요청 및 CLI 애플리케이션을 프로파일링하는 서비스입니다. 호출 그래프와 타임라인으로 프로파일 데이터를 표시하는 인터랙티브 UI를 제공합니다. 개발, 스테이징, 프로덕션 환경에서 사용할 수 있으며, 최종 사용자에게는 오버헤드가 없습니다. 또한 Blackfire는 코드와 `php.ini` 설정에 대한 성능, 품질, 보안 검사를 제공합니다.

[Blackfire Player](https://blackfire.io/docs/player/index)는 Blackfire와 함께 사용할 수 있는 오픈 소스 웹 크롤링, 웹 테스트, 웹 스크래핑 애플리케이션입니다.

Blackfire를 활성화하려면, Homestead 설정 파일의 "features" 설정을 사용하세요:

```yaml
features:
    - blackfire:
        server_id: "server_id"
        server_token: "server_value"
        client_id: "client_id"
        client_token: "client_value"
```

Blackfire 서버 자격 증명과 클라이언트 자격 증명은 [Blackfire 계정](https://blackfire.io/signup)이 필요합니다. Blackfire는 CLI 도구와 브라우저 확장 등 다양한 애플리케이션 프로파일링 옵션을 제공합니다. 자세한 내용은 [Blackfire 문서](https://blackfire.io/docs/php/integrations/laravel/index)를 참고하세요.


## 네트워크 인터페이스 {#network-interfaces}

`Homestead.yaml` 파일의 `networks` 속성은 Homestead 가상 머신의 네트워크 인터페이스를 설정합니다. 필요한 만큼 많은 인터페이스를 설정할 수 있습니다:

```yaml
networks:
    - type: "private_network"
      ip: "192.168.10.20"
```

[브릿지드](https://developer.hashicorp.com/vagrant/docs/networking/public_network) 인터페이스를 활성화하려면, 네트워크에 `bridge` 설정을 추가하고 네트워크 타입을 `public_network`로 변경하세요:

```yaml
networks:
    - type: "public_network"
      ip: "192.168.10.20"
      bridge: "en1: Wi-Fi (AirPort)"
```

[DHCP](https://developer.hashicorp.com/vagrant/docs/networking/public_network#dhcp)를 활성화하려면, 설정에서 `ip` 옵션을 제거하세요:

```yaml
networks:
    - type: "public_network"
      bridge: "en1: Wi-Fi (AirPort)"
```

네트워크가 사용할 장치를 업데이트하려면, 네트워크 설정에 `dev` 옵션을 추가할 수 있습니다. 기본 `dev` 값은 `eth0`입니다:

```yaml
networks:
    - type: "public_network"
      ip: "192.168.10.20"
      bridge: "en1: Wi-Fi (AirPort)"
      dev: "enp2s0"
```


## Homestead 확장 {#extending-homestead}

Homestead 디렉터리 루트에 있는 `after.sh` 스크립트를 사용하여 Homestead를 확장할 수 있습니다. 이 파일 내에서 가상 머신을 적절히 구성하고 커스터마이즈하는 데 필요한 셸 명령을 추가할 수 있습니다.

Homestead를 커스터마이즈할 때, Ubuntu는 패키지의 기존 설정을 유지할지 아니면 새 설정 파일로 덮어쓸지 물어볼 수 있습니다. 이를 방지하려면, Homestead에서 이전에 작성한 설정을 덮어쓰지 않도록 다음 명령을 사용하여 패키지를 설치하세요:

```shell
sudo apt-get -y \
    -o Dpkg::Options::="--force-confdef" \
    -o Dpkg::Options::="--force-confold" \
    install package-name
```


### 사용자 커스터마이즈 {#user-customizations}

팀과 함께 Homestead를 사용할 때, 개인 개발 스타일에 맞게 Homestead를 조정하고 싶을 수 있습니다. 이를 위해 Homestead 디렉터리 루트(즉, `Homestead.yaml` 파일이 있는 디렉터리)에 `user-customizations.sh` 파일을 생성할 수 있습니다. 이 파일 내에서 원하는 모든 커스터마이즈를 할 수 있지만, `user-customizations.sh` 파일은 버전 관리에 포함하지 않아야 합니다.


## 프로바이더별 설정 {#provider-specific-settings}


### VirtualBox {#provider-specific-virtualbox}


#### `natdnshostresolver` {#natdnshostresolver}

기본적으로 Homestead는 `natdnshostresolver` 설정을 `on`으로 구성합니다. 이를 통해 Homestead가 호스트 운영체제의 DNS 설정을 사용할 수 있습니다. 이 동작을 변경하려면, `Homestead.yaml` 파일에 다음 설정 옵션을 추가하세요:

```yaml
provider: virtualbox
natdnshostresolver: 'off'
```
