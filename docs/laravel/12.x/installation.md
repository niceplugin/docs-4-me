# 설치



















## 라라벨 만나기 {#meet-laravel}

라라벨은 표현력 있고 우아한 문법을 가진 웹 애플리케이션 프레임워크입니다. 웹 프레임워크는 애플리케이션을 만들기 위한 구조와 출발점을 제공하여, 여러분이 세부 사항에 신경 쓰는 대신 멋진 것을 만드는 데 집중할 수 있도록 도와줍니다.

라라벨은 강력한 의존성 주입, 표현력 있는 데이터베이스 추상화 계층, 큐 및 예약 작업, 단위 및 통합 테스트 등 강력한 기능을 제공하면서도 뛰어난 개발자 경험을 제공하기 위해 노력합니다.

PHP 웹 프레임워크가 처음이든, 다년간의 경험이 있든, 라라벨은 여러분과 함께 성장할 수 있는 프레임워크입니다. 웹 개발자로서 첫걸음을 내딛는 분들에게도, 전문성을 한 단계 끌어올리고 싶은 분들에게도 라라벨이 힘이 되어드릴 것입니다. 여러분이 무엇을 만들지 기대됩니다.


### 왜 라라벨인가? {#why-laravel}

웹 애플리케이션을 만들 때 사용할 수 있는 다양한 도구와 프레임워크가 있습니다. 하지만 저희는 라라벨이 현대적인 풀스택 웹 애플리케이션을 구축하는 데 최고의 선택이라고 믿습니다.

#### 점진적(Progressive) 프레임워크

라라벨을 "점진적" 프레임워크라고 부릅니다. 이는 라라벨이 여러분과 함께 성장한다는 의미입니다. 웹 개발을 처음 시작하는 분이라면, 라라벨의 방대한 문서, 가이드, [비디오 튜토리얼](https://laracasts.com) 덕분에 부담 없이 기초를 익힐 수 있습니다.

시니어 개발자라면, 라라벨은 [의존성 주입](/laravel/12.x/container), [단위 테스트](/laravel/12.x/testing), [큐](/laravel/12.x/queues), [실시간 이벤트](/laravel/12.x/broadcasting) 등 강력한 도구를 제공합니다. 라라벨은 전문적인 웹 애플리케이션 구축에 최적화되어 있으며, 엔터프라이즈급 워크로드도 거뜬히 처리할 수 있습니다.

#### 확장 가능한 프레임워크

라라벨은 매우 확장성이 뛰어납니다. PHP의 확장 친화적인 특성과 Redis와 같은 빠르고 분산된 캐시 시스템에 대한 라라벨의 내장 지원 덕분에, 라라벨로 수평 확장은 매우 쉽습니다. 실제로 라라벨 애플리케이션은 월 수억 건의 요청도 무리 없이 처리할 수 있습니다.

극한의 확장이 필요하다면, [Laravel Cloud](https://cloud.laravel.com)와 같은 플랫폼을 통해 거의 무제한에 가까운 규모로 라라벨 애플리케이션을 운영할 수 있습니다.

#### 커뮤니티 프레임워크

라라벨은 PHP 생태계의 최고의 패키지들을 결합하여 가장 강력하고 개발자 친화적인 프레임워크를 제공합니다. 또한, 전 세계 수천 명의 뛰어난 개발자들이 [프레임워크에 기여](https://github.com/laravel/framework)하고 있습니다. 어쩌면 여러분도 라라벨 기여자가 될 수 있습니다.


## 라라벨 애플리케이션 생성 {#creating-a-laravel-project}


### PHP 및 라라벨 인스톨러 설치 {#installing-php}

첫 번째 라라벨 애플리케이션을 만들기 전에, 로컬 컴퓨터에 [PHP](https://php.net), [Composer](https://getcomposer.org), [라라벨 인스톨러](https://github.com/laravel/installer)가 설치되어 있는지 확인하세요. 또한, 애플리케이션의 프론트엔드 에셋을 컴파일할 수 있도록 [Node와 NPM](https://nodejs.org) 또는 [Bun](https://bun.sh/)을 설치해야 합니다.

로컬 컴퓨터에 PHP와 Composer가 설치되어 있지 않다면, 아래 명령어를 통해 macOS, Windows, Linux에서 PHP, Composer, 라라벨 인스톨러를 설치할 수 있습니다:
::: code-group
```shell [macOS]
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

```shell [Windows PowerShell]
# 관리자 권한으로 실행...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

```shell [Linux]
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```
:::
위 명령어 중 하나를 실행한 후에는 터미널 세션을 재시작해야 합니다. `php.new`를 통해 설치한 후 PHP, Composer, 라라벨 인스톨러를 업데이트하려면 터미널에서 명령어를 다시 실행하면 됩니다.

이미 PHP와 Composer가 설치되어 있다면, Composer를 통해 라라벨 인스톨러를 설치할 수 있습니다:

```shell
composer global require laravel/installer
```

> [!NOTE]
> 완전한 기능의 그래픽 PHP 설치 및 관리 환경이 필요하다면 [Laravel Herd](#installation-using-herd)를 확인해보세요.


### 애플리케이션 생성 {#creating-an-application}

PHP, Composer, 라라벨 인스톨러를 설치했다면, 이제 새로운 라라벨 애플리케이션을 만들 준비가 되었습니다. 라라벨 인스톨러는 선호하는 테스트 프레임워크, 데이터베이스, 스타터 키트 선택을 안내합니다:

```shell
laravel new example-app
```

애플리케이션이 생성되면, `dev` Composer 스크립트를 사용해 라라벨의 로컬 개발 서버, 큐 워커, Vite 개발 서버를 시작할 수 있습니다:

```shell
cd example-app
npm install && npm run build
composer run dev
```

개발 서버를 시작하면, 웹 브라우저에서 `http://localhost:8000`에서 애플리케이션에 접근할 수 있습니다. 이제 [라라벨 생태계의 다음 단계](#next-steps)를 시작할 준비가 되었습니다. 물론, [데이터베이스 설정](#databases-and-migrations)도 원할 수 있습니다.

> [!NOTE]
> 라라벨 애플리케이션 개발을 빠르게 시작하고 싶다면, [스타터 키트](/laravel/12.x/starter-kits) 중 하나를 사용해보세요. 라라벨의 스타터 키트는 새로운 라라벨 애플리케이션을 위한 백엔드 및 프론트엔드 인증 스캐폴딩을 제공합니다.


## 초기 설정 {#initial-configuration}

라라벨 프레임워크의 모든 설정 파일은 `config` 디렉터리에 저장되어 있습니다. 각 옵션에는 문서가 포함되어 있으니, 파일을 살펴보며 사용 가능한 옵션에 익숙해지시기 바랍니다.

라라벨은 기본적으로 거의 추가 설정이 필요하지 않습니다. 바로 개발을 시작할 수 있습니다! 하지만, `config/app.php` 파일과 그 문서를 검토해보는 것이 좋습니다. 이 파일에는 `url`, `locale` 등 애플리케이션에 맞게 변경할 수 있는 여러 옵션이 포함되어 있습니다.


### 환경 기반 설정 {#environment-based-configuration}

라라벨의 많은 설정 옵션 값은 애플리케이션이 로컬 컴퓨터에서 실행되는지, 프로덕션 웹 서버에서 실행되는지에 따라 달라질 수 있으므로, 중요한 설정 값 대부분은 애플리케이션 루트에 위치한 `.env` 파일을 통해 정의됩니다.

`.env` 파일은 애플리케이션의 소스 컨트롤에 커밋하지 않아야 합니다. 각 개발자/서버마다 환경 설정이 다를 수 있기 때문입니다. 또한, 소스 컨트롤 저장소에 침입자가 접근할 경우 민감한 자격 증명이 노출될 수 있으므로 보안상 위험합니다.

> [!NOTE]
> `.env` 파일과 환경 기반 설정에 대한 자세한 내용은 [설정 문서](/laravel/12.x/configuration#environment-configuration)를 참고하세요.


### 데이터베이스 및 마이그레이션 {#databases-and-migrations}

라라벨 애플리케이션을 만들었다면, 이제 데이터를 데이터베이스에 저장하고 싶을 것입니다. 기본적으로, 애플리케이션의 `.env` 설정 파일은 라라벨이 SQLite 데이터베이스와 상호작용하도록 지정되어 있습니다.

애플리케이션 생성 시, 라라벨은 `database/database.sqlite` 파일을 생성하고, 애플리케이션의 데이터베이스 테이블을 만들기 위한 필요한 마이그레이션을 실행합니다.

MySQL이나 PostgreSQL 등 다른 데이터베이스 드라이버를 사용하고 싶다면, `.env` 설정 파일을 적절한 데이터베이스로 변경하면 됩니다. 예를 들어, MySQL을 사용하려면 `.env` 파일의 `DB_*` 변수를 다음과 같이 수정하세요:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

SQLite 이외의 데이터베이스를 사용할 경우, 데이터베이스를 생성하고 애플리케이션의 [데이터베이스 마이그레이션](/laravel/12.x/migrations)을 실행해야 합니다:

```shell
php artisan migrate
```

> [!NOTE]
> macOS 또는 Windows에서 개발 중이고, MySQL, PostgreSQL, Redis를 로컬에 설치해야 한다면 [Herd Pro](https://herd.laravel.com/#plans) 또는 [DBngin](https://dbngin.com/)을 사용해보세요.


### 디렉터리 설정 {#directory-configuration}

라라벨은 항상 웹 서버에 설정된 "웹 디렉터리"의 루트에서 서비스되어야 합니다. "웹 디렉터리"의 하위 디렉터리에서 라라벨 애플리케이션을 서비스하려고 시도해서는 안 됩니다. 그렇게 하면 애플리케이션 내의 민감한 파일이 노출될 수 있습니다.


## Herd를 이용한 설치 {#installation-using-herd}

[Laravel Herd](https://herd.laravel.com)는 macOS와 Windows에서 사용할 수 있는 매우 빠르고, 네이티브한 라라벨 및 PHP 개발 환경입니다. Herd에는 라라벨 개발을 시작하는 데 필요한 모든 것이 포함되어 있으며, PHP와 Nginx도 함께 제공됩니다.

Herd를 설치하면, 바로 라라벨 개발을 시작할 수 있습니다. Herd에는 `php`, `composer`, `laravel`, `expose`, `node`, `npm`, `nvm` 등의 커맨드라인 도구가 포함되어 있습니다.

> [!NOTE]
> [Herd Pro](https://herd.laravel.com/#plans)는 Herd에 추가적인 강력한 기능을 더해줍니다. 예를 들어, 로컬 MySQL, Postgres, Redis 데이터베이스 생성 및 관리, 로컬 메일 뷰어, 로그 모니터링 등이 가능합니다.


### macOS에서 Herd {#herd-on-macos}

macOS에서 개발한다면, [Herd 웹사이트](https://herd.laravel.com)에서 Herd 인스톨러를 다운로드할 수 있습니다. 인스톨러는 최신 버전의 PHP를 자동으로 다운로드하고, Mac이 항상 [Nginx](https://www.nginx.com/)를 백그라운드에서 실행하도록 설정합니다.

macOS용 Herd는 [dnsmasq](https://en.wikipedia.org/wiki/Dnsmasq)를 사용하여 "파킹된" 디렉터리를 지원합니다. 파킹된 디렉터리 내의 모든 라라벨 애플리케이션은 Herd에 의해 자동으로 서비스됩니다. 기본적으로 Herd는 `~/Herd`에 파킹 디렉터리를 생성하며, 이 디렉터리 내의 라라벨 애플리케이션은 디렉터리 이름을 사용해 `.test` 도메인에서 접근할 수 있습니다.

Herd 설치 후, 새로운 라라벨 애플리케이션을 만드는 가장 빠른 방법은 Herd에 번들된 라라벨 CLI를 사용하는 것입니다:

```shell
cd ~/Herd
laravel new my-app
cd my-app
herd open
```

물론, 시스템 트레이의 Herd 메뉴에서 Herd UI를 열어 파킹 디렉터리 및 기타 PHP 설정을 관리할 수도 있습니다.

Herd에 대해 더 알고 싶다면 [Herd 문서](https://herd.laravel.com/docs)를 참고하세요.


### Windows에서 Herd {#herd-on-windows}

Windows용 Herd 인스톨러는 [Herd 웹사이트](https://herd.laravel.com/windows)에서 다운로드할 수 있습니다. 설치가 완료되면 Herd를 시작하여 온보딩 과정을 마치고, 처음으로 Herd UI에 접근할 수 있습니다.

Herd UI는 시스템 트레이의 Herd 아이콘을 왼쪽 클릭하면 접근할 수 있습니다. 오른쪽 클릭 시에는 일상적으로 필요한 모든 도구에 접근할 수 있는 빠른 메뉴가 열립니다.

설치 과정에서 Herd는 홈 디렉터리 내 `%USERPROFILE%\Herd`에 "파킹된" 디렉터리를 생성합니다. 파킹된 디렉터리 내의 모든 라라벨 애플리케이션은 Herd에 의해 자동으로 서비스되며, 이 디렉터리 내의 라라벨 애플리케이션은 디렉터리 이름을 사용해 `.test` 도메인에서 접근할 수 있습니다.

Herd 설치 후, 새로운 라라벨 애플리케이션을 만드는 가장 빠른 방법은 Herd에 번들된 라라벨 CLI를 사용하는 것입니다. 시작하려면 Powershell을 열고 다음 명령어를 실행하세요:

```shell
cd ~\Herd
laravel new my-app
cd my-app
herd open
```

Windows용 Herd에 대해 더 알고 싶다면 [Herd 문서](https://herd.laravel.com/docs/windows)를 참고하세요.


## IDE 지원 {#ide-support}

라라벨 애플리케이션을 개발할 때 원하는 코드 에디터를 자유롭게 사용할 수 있습니다. 하지만, [PhpStorm](https://www.jetbrains.com/phpstorm/laravel/)은 라라벨 및 그 생태계에 대한 광범위한 지원을 제공하며, [Laravel Pint](https://www.jetbrains.com/help/phpstorm/using-laravel-pint.html)도 지원합니다.

또한, 커뮤니티에서 관리하는 [Laravel Idea](https://laravel-idea.com/) PhpStorm 플러그인은 코드 생성, Eloquent 문법 자동완성, 검증 규칙 자동완성 등 다양한 유용한 IDE 기능을 제공합니다.

[Visual Studio Code (VS Code)](https://code.visualstudio.com)에서 개발한다면, 공식 [Laravel VS Code Extension](https://marketplace.visualstudio.com/items?itemName=laravel.vscode-laravel)을 사용할 수 있습니다. 이 확장 프로그램은 라라벨 전용 도구를 VS Code 환경에 직접 제공하여 생산성을 높여줍니다.


## 다음 단계 {#next-steps}

라라벨 애플리케이션을 만들었다면, 다음에 무엇을 배워야 할지 궁금할 수 있습니다. 먼저, 라라벨이 어떻게 동작하는지 아래 문서를 읽으며 익숙해지길 강력히 추천합니다:

<div class="content-list" markdown="1">

- [요청 라이프사이클](/laravel/12.x/lifecycle)
- [설정](/laravel/12.x/configuration)
- [디렉터리 구조](/laravel/12.x/structure)
- [프론트엔드](/laravel/12.x/frontend)
- [서비스 컨테이너](/laravel/12.x/container)
- [파사드](/laravel/12.x/facades)

</div>

라라벨을 어떻게 사용할지에 따라 다음 단계가 달라집니다. 라라벨을 사용하는 다양한 방법이 있으며, 아래에서는 프레임워크의 두 가지 주요 사용 사례를 살펴봅니다.


### 풀스택 프레임워크로서의 라라벨 {#laravel-the-fullstack-framework}

라라벨은 풀스택 프레임워크로 사용할 수 있습니다. "풀스택" 프레임워크란, 라라벨을 사용해 애플리케이션의 요청을 라우팅하고, [Blade 템플릿](/laravel/12.x/blade)이나 [Inertia](https://inertiajs.com)와 같은 싱글 페이지 애플리케이션 하이브리드 기술로 프론트엔드를 렌더링하는 것을 의미합니다. 이는 라라벨 프레임워크를 사용하는 가장 일반적이고, 저희가 생각하기에 가장 생산적인 방법입니다.

이 방식으로 라라벨을 사용하려면, [프론트엔드 개발](/laravel/12.x/frontend), [라우팅](/laravel/12.x/routing), [뷰](/laravel/12.x/views), [Eloquent ORM](/laravel/12.x/eloquent) 문서를 참고하세요. 또한, [Livewire](https://livewire.laravel.com), [Inertia](https://inertiajs.com)와 같은 커뮤니티 패키지에도 관심을 가져볼 수 있습니다. 이 패키지들은 라라벨을 풀스택 프레임워크로 사용하면서도 싱글 페이지 자바스크립트 애플리케이션이 제공하는 UI 이점을 누릴 수 있게 해줍니다.

풀스택 프레임워크로 라라벨을 사용할 경우, [Vite](/laravel/12.x/vite)를 사용해 애플리케이션의 CSS와 자바스크립트를 컴파일하는 방법도 꼭 익혀두시길 권장합니다.

> [!NOTE]
> 애플리케이션 개발을 빠르게 시작하고 싶다면, 공식 [애플리케이션 스타터 키트](/laravel/12.x/starter-kits) 중 하나를 확인해보세요.


### API 백엔드로서의 라라벨 {#laravel-the-api-backend}

라라벨은 자바스크립트 싱글 페이지 애플리케이션이나 모바일 애플리케이션을 위한 API 백엔드로도 사용할 수 있습니다. 예를 들어, [Next.js](https://nextjs.org) 애플리케이션의 API 백엔드로 라라벨을 사용할 수 있습니다. 이 경우, 라라벨을 통해 애플리케이션의 [인증](/laravel/12.x/sanctum) 및 데이터 저장/조회 기능을 제공하면서, 큐, 이메일, 알림 등 라라벨의 강력한 서비스도 활용할 수 있습니다.

이 방식으로 라라벨을 사용하려면, [라우팅](/laravel/12.x/routing), [Laravel Sanctum](/laravel/12.x/sanctum), [Eloquent ORM](/laravel/12.x/eloquent) 문서를 참고하세요.
