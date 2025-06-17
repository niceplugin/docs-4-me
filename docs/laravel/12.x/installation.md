# 설치



















## Laravel 소개 {#meet-laravel}

Laravel은 표현적이고 우아한 문법을 자랑하는 웹 애플리케이션 프레임워크입니다. 웹 프레임워크는 애플리케이션을 만들기 위한 구조와 출발점을 제공하여, 여러분이 세부적인 부분에 신경 쓰지 않고 멋진 것을 만드는 데 집중할 수 있게 합니다.

Laravel은 강력한 의존성 주입, 표현력 있는 데이터베이스 추상화 레이어, 큐 및 예약 작업, 단위 및 통합 테스트 등 다양한 강력한 기능을 제공하면서, 뛰어난 개발자 경험을 목표로 합니다.

PHP 웹 프레임워크가 처음이든, 오랜 경험이 있든, Laravel은 여러분과 함께 성장할 수 있는 프레임워크입니다. 여러분이 웹 개발자로서 어떤 것을 만들어낼지 기대하고 있겠습니다.


### 왜 Laravel인가? {#why-laravel}

웹 애플리케이션을 구축할 때 사용할 수 있는 다양한 도구와 프레임워크가 존재합니다. 그럼에도 불구하고, 저희는 라라벨이 현대적인 풀스택 웹 애플리케이션을 개발하는 데 가장 적합한 선택이라고 믿습니다.

#### 발전하는 프레임워크

우리는 Laravel을 "진보적인(Progressive)" 프레임워크라 부릅니다. 이는 Laravel이 여러분의 성장에 맞춰 함께 발전한다는 의미입니다. 웹 개발을 이제 막 시작하는 분들도, Laravel의 방대한 문서, 가이드, [동영상 튜토리얼](https://laracasts.com)을 통해 쉽게 학습할 수 있습니다.

시니어 개발자라면, Laravel이 제공하는 [의존성 주입](/laravel/12.x/container), [단위 테스트](/laravel/12.x/testing), [큐](/laravel/12.x/queues), [실시간 이벤트](/laravel/12.x/broadcasting) 등 강력한 도구를 만나보실 수 있습니다. Laravel은 프로페셔널 웹 애플리케이션 구축에 최적화되어 있으며, 엔터프라이즈급 작업량도 충분히 소화 가능합니다.

#### 확장 가능한 프레임워크

Laravel은 놀라울 만큼 확장성이 뛰어납니다. PHP의 확장에 친화적인 특성과, Redis와 같은 빠르고 분산된 캐시 시스템에 대한 Laravel의 내장 지원 덕분에, Laravel로의 수평 확장은 매우 간편합니다. 실제로, Laravel 애플리케이션은 월 수억 건의 요청도 손쉽게 처리하며 확장할 수 있습니다.

더 극한의 확장이 필요하시다면, [Laravel Cloud](https://cloud.laravel.com)와 같은 플랫폼을 통해 사실상 무제한에 가까운 규모로 라라벨 애플리케이션을 운영할 수 있습니다.

#### 커뮤니티 중심의 프레임워크

라라벨은 PHP 생태계 내 최고의 패키지들을 결합하여, 가장 견고하고 개발자 친화적인 프레임워크를 제공합니다. 무엇보다 전 세계 수많은 재능 있는 개발자들이 [프레임워크에 기여](https://github.com/laravel/framework)해왔습니다. 언젠가는 여러분도 Laravel의 기여자가 될 수도 있습니다.


## Laravel 애플리케이션 생성하기 {#creating-a-laravel-project}


### PHP 및 Laravel 인스톨러 설치하기 {#installing-php}

첫 번째 Laravel 애플리케이션을 만들기 전에, 로컬 컴퓨터에 [PHP](https://php.net), [Composer](https://getcomposer.org), 그리고 [Laravel 인스톨러](https://github.com/laravel/installer)가 설치되어 있는지 확인하세요. 또한, 애플리케이션의 프론트엔드 에셋을 컴파일하기 위해 [Node와 NPM](https://nodejs.org) 또는 [Bun](https://bun.sh/) 중 하나도 설치해야 합니다.

만약 로컬 컴퓨터에 PHP와 Composer가 설치되어 있지 않다면, 아래 명령어를 통해 macOS, Windows, 또는 Linux에서 PHP, Composer, 그리고 Laravel 인스톨러를 설치할 수 있습니다:
::: code-group
```shell [macOS]
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

```shell [Windows PowerShell]
# 관리자 권한 모드로 실행...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

```shell [Linux]
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```
:::
위 명령어 중 하나를 실행한 후에는 터미널 세션을 재시작해야 합니다. `php.new`를 통해 PHP, Composer, 그리고 Laravel 인스톨러를 설치한 경우, 이들을 업데이트하려면 터미널에서 해당 명령어를 다시 실행하면 됩니다.

이미 PHP와 Composer가 설치되어 있다면, Composer를 통해 Laravel 인스톨러를 설치할 수 있습니다:

```shell
composer global require laravel/installer
```

> [!NOTE]
> 완전한 기능과 그래픽 환경에서 PHP를 설치하고 관리하고 싶다면, [Laravel Herd](#installation-using-herd)를 확인해보세요.


### 애플리케이션 생성하기 {#creating-an-application}

PHP, Composer, 그리고 Laravel 인스톨러를 모두 설치했다면, 이제 새로운 Laravel 애플리케이션을 생성할 준비가 되었습니다. Laravel 인스톨러는 선호하는 테스트 프레임워크, 데이터베이스, 그리고 스타터 키트를 선택하도록 안내합니다:

```shell
laravel new example-app
```

애플리케이션이 생성되면, `dev` Composer 스크립트를 사용하여 Laravel의 로컬 개발 서버, 큐 워커, 그리고 Vite 개발 서버를 시작할 수 있습니다:

```shell
cd example-app
npm install && npm run build
composer run dev
```

개발 서버를 시작하면, 웹 브라우저에서 `http://localhost:8000` 주소로 애플리케이션에 접속할 수 있습니다. 이제 [Laravel 생태계의 다음 단계](#next-steps)를 시작할 준비가 되었습니다. 물론, [데이터베이스를 설정](#databases-and-migrations)하는 것도 고려할 수 있습니다.

> [!NOTE]
> Laravel 애플리케이션 개발을 빠르게 시작하고 싶다면, [스타터 키트](/laravel/12.x/starter-kits) 중 하나를 사용하는 것을 고려해보세요. Laravel의 스타터 키트는 새로운 애플리케이션에 백엔드와 프론트엔드 인증 스캐폴딩을 제공합니다.


## 초기 설정 {#initial-configuration}

Laravel 프레임워크의 모든 설정 파일은 `config` 디렉터리에 저장되어 있습니다. 각 옵션에는 문서가 포함되어 있으니, 파일을 살펴보며 사용 가능한 옵션에 익숙해지시기 바랍니다.

Laravel은 기본적으로 거의 추가 설정 없이 바로 사용할 수 있습니다. 바로 개발을 시작하셔도 됩니다! 하지만, `config/app.php` 파일과 그 문서를 한 번 검토해보는 것이 좋습니다. 이 파일에는 `url`, `locale` 등 애플리케이션에 맞게 변경할 수 있는 여러 옵션이 포함되어 있습니다.


### 환경 기반 설정 {#environment-based-configuration}

Laravel의 많은 설정 옵션 값들은 애플리케이션이 로컬 컴퓨터에서 실행되는지, 프로덕션 웹 서버에서 실행되는지에 따라 달라질 수 있습니다. 그래서 많은 중요한 설정 값들은 애플리케이션 루트에 위치한 `.env` 파일을 통해 정의됩니다.

`.env` 파일은 애플리케이션의 소스 컨트롤에 커밋하지 않아야 합니다. 왜냐하면 애플리케이션을 사용하는 각 개발자나 서버마다 서로 다른 환경 설정이 필요할 수 있기 때문입니다. 또한, 만약 침입자가 소스 컨트롤 저장소에 접근하게 된다면, 민감한 자격 증명이 노출될 수 있으므로 보안상 위험이 있습니다.

> [!NOTE]
> `.env` 파일과 환경 기반 설정에 대한 더 자세한 내용은 [설정 문서](/laravel/12.x/configuration#environment-configuration)에서 확인할 수 있습니다.


### 데이터베이스와 마이그레이션 {#databases-and-migrations}

이제 Laravel 애플리케이션을 생성했으니, 데이터를 데이터베이스에 저장하고 싶을 것입니다. 기본적으로 애플리케이션의 `.env` 설정 파일에는 Laravel이 SQLite 데이터베이스와 상호작용하도록 지정되어 있습니다.

애플리케이션을 생성할 때, Laravel은 자동으로 `database/database.sqlite` 파일을 생성하고, 애플리케이션의 데이터베이스 테이블을 만들기 위한 필요한 마이그레이션을 실행합니다.

만약 MySQL이나 PostgreSQL과 같은 다른 데이터베이스 드라이버를 사용하고 싶다면, `.env` 설정 파일을 적절한 데이터베이스에 맞게 수정하면 됩니다. 예를 들어, MySQL을 사용하려면 `.env` 파일의 `DB_*` 변수를 다음과 같이 변경하세요:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

SQLite가 아닌 다른 데이터베이스를 사용할 경우, 해당 데이터베이스를 직접 생성한 후 애플리케이션의 [데이터베이스 마이그레이션](/laravel/12.x/migrations)을 실행해야 합니다:

```shell
php artisan migrate
```

> [!NOTE]
> macOS 또는 Windows에서 개발 중이고 MySQL, PostgreSQL, Redis 등을 로컬에 설치해야 한다면 [Herd Pro](https://herd.laravel.com/#plans) 또는 [DBngin](https://dbngin.com/) 사용을 고려해보세요.


### 디렉터리 설정 {#directory-configuration}

Laravel은 항상 웹 서버에 설정된 "웹 디렉터리"의 루트에서 서비스되어야 합니다. "웹 디렉터리"의 하위 디렉터리에서 Laravel 애플리케이션을 서비스하려고 시도해서는 안 됩니다. 그렇게 하면 애플리케이션 내에 존재하는 민감한 파일들이 노출될 수 있습니다.


## Herd를 이용한 설치 {#installation-using-herd}

[Laravel Herd](https://herd.laravel.com)는 macOS와 Windows에서 사용할 수 있는 매우 빠르고, 네이티브 Laravel 및 PHP 개발 환경입니다. Herd에는 Laravel 개발을 시작하는 데 필요한 모든 것이 포함되어 있으며, PHP와 Nginx도 함께 제공됩니다.

Herd를 설치하면 바로 Laravel 개발을 시작할 수 있습니다. Herd에는 `php`, `composer`, `laravel`, `expose`, `node`, `npm`, `nvm`과 같은 명령줄 도구도 포함되어 있습니다.

> [!NOTE]
> [Herd Pro](https://herd.laravel.com/#plans)는 Herd에 추가적인 강력한 기능을 제공합니다. 예를 들어, 로컬 MySQL, Postgres, Redis 데이터베이스 생성 및 관리, 로컬 메일 뷰어, 로그 모니터링 기능 등이 포함되어 있습니다.


### macOS에서 Herd 사용하기 {#herd-on-macos}

macOS에서 개발하는 경우, [Herd 웹사이트](https://herd.laravel.com)에서 Herd 설치 프로그램을 다운로드할 수 있습니다. 설치 프로그램은 최신 버전의 PHP를 자동으로 다운로드하고, Mac에서 [Nginx](https://www.nginx.com/)가 항상 백그라운드에서 실행되도록 설정합니다.

macOS용 Herd는 [dnsmasq](https://en.wikipedia.org/wiki/Dnsmasq)를 사용하여 "파킹된" 디렉터리를 지원합니다. 파킹된 디렉터리에 있는 모든 Laravel 애플리케이션은 Herd에 의해 자동으로 서비스됩니다. 기본적으로 Herd는 `~/Herd`에 파킹 디렉터리를 생성하며, 이 디렉터리 내의 Laravel 애플리케이션은 디렉터리 이름을 사용해 `.test` 도메인으로 접근할 수 있습니다.

Herd를 설치한 후, 새로운 Laravel 애플리케이션을 만드는 가장 빠른 방법은 Herd에 포함된 Laravel CLI를 사용하는 것입니다:

```shell
cd ~/Herd
laravel new my-app
cd my-app
herd open
```

물론, 시스템 트레이의 Herd 메뉴에서 Herd UI를 열어 파킹 디렉터리와 기타 PHP 설정을 언제든지 관리할 수 있습니다.

Herd에 대해 더 자세히 알고 싶다면 [Herd 문서](https://herd.laravel.com/docs)를 참고하세요.


### Windows에서 Herd 사용하기 {#herd-on-windows}

Windows용 Herd 설치 프로그램은 [Herd 웹사이트](https://herd.laravel.com/windows)에서 다운로드할 수 있습니다. 설치가 완료되면 Herd를 실행하여 온보딩 과정을 마치고, 처음으로 Herd UI에 접근할 수 있습니다.

Herd UI는 시스템 트레이에 있는 Herd 아이콘을 왼쪽 클릭하면 열 수 있습니다. 오른쪽 클릭을 하면 일상적으로 필요한 모든 도구에 접근할 수 있는 빠른 메뉴가 나타납니다.

설치 과정에서 Herd는 홈 디렉터리 내 `%USERPROFILE%\Herd`에 "파킹된" 디렉터리를 생성합니다. 이 파킹 디렉터리에 있는 모든 Laravel 애플리케이션은 Herd에 의해 자동으로 서비스되며, 디렉터리 이름을 사용해 `.test` 도메인으로 해당 애플리케이션에 접근할 수 있습니다.

Herd를 설치한 후, 새로운 Laravel 애플리케이션을 만드는 가장 빠른 방법은 Herd에 포함된 Laravel CLI를 사용하는 것입니다. 시작하려면 Powershell을 열고 다음 명령어를 실행하세요:

```shell
cd ~\Herd
laravel new my-app
cd my-app
herd open
```

Windows용 Herd에 대해 더 자세히 알고 싶다면 [Herd 문서](https://herd.laravel.com/docs/windows)를 참고하세요.


## IDE 지원 {#ide-support}

Laravel 애플리케이션을 개발할 때 원하는 어떤 코드 에디터든 자유롭게 사용할 수 있습니다. 하지만 [PhpStorm](https://www.jetbrains.com/phpstorm/laravel/)은 [Laravel Pint](https://www.jetbrains.com/help/phpstorm/using-laravel-pint.html)를 포함해 Laravel 및 그 생태계에 대한 폭넓은 지원을 제공합니다.

또한, 커뮤니티에서 관리하는 [Laravel Idea](https://laravel-idea.com/) PhpStorm 플러그인은 코드 생성, Eloquent 문법 자동완성, 검증 규칙 자동완성 등 다양한 유용한 IDE 기능을 추가로 제공합니다.

[Visual Studio Code (VS Code)](https://code.visualstudio.com)에서 개발하는 경우, 공식 [Laravel VS Code 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=laravel.vscode-laravel)을 사용할 수 있습니다. 이 확장 프로그램은 Laravel 전용 도구를 VS Code 환경에 직접 제공하여 생산성을 높여줍니다.


## 다음 단계 {#next-steps}

이제 Laravel 애플리케이션을 생성했으니, 다음에 무엇을 배워야 할지 궁금할 수 있습니다. 먼저, 아래의 문서를 읽으며 Laravel이 어떻게 동작하는지 익히는 것을 강력히 추천합니다:

<div class="content-list" markdown="1">

- [요청 라이프사이클](/laravel/12.x/lifecycle)
- [환경설정](/laravel/12.x/configuration)
- [디렉터리 구조](/laravel/12.x/structure)
- [프론트엔드](/laravel/12.x/frontend)
- [서비스 컨테이너](/laravel/12.x/container)
- [파사드(facades)](/laravel/12.x/facades)
- 
</div>

Laravel을 어떻게 활용하고 싶은지에 따라 앞으로의 학습 방향도 달라집니다. Laravel을 사용하는 방법에는 여러 가지가 있으며, 아래에서는 프레임워크의 두 가지 주요 활용 사례를 살펴보겠습니다.


### Laravel: 풀스택 프레임워크로 사용하기 {#laravel-the-fullstack-framework}

Laravel은 풀스택 프레임워크로 활용할 수 있습니다. 여기서 "풀스택" 프레임워크란, Laravel을 사용해 애플리케이션의 요청을 라우팅하고, [Blade 템플릿](/laravel/12.x/blade)이나 [Inertia](https://inertiajs.com)와 같은 싱글 페이지 애플리케이션 하이브리드 기술을 통해 프론트엔드를 렌더링하는 방식을 의미합니다. 이는 Laravel 프레임워크를 사용하는 가장 일반적인 방법이며, 저희가 생각하기에 가장 생산적인 방법이기도 합니다.

이 방식으로 Laravel을 사용하려면 [프론트엔드 개발](/laravel/12.x/frontend), [라우팅](/laravel/12.x/routing), [뷰(views)](/laravel/12.x/views), [Eloquent ORM](/laravel/12.x/eloquent) 관련 문서를 참고해보세요. 또한, [Livewire](https://livewire.laravel.com)나 [Inertia](https://inertiajs.com)와 같은 커뮤니티 패키지에도 관심을 가져볼 만합니다. 이 패키지들은 Laravel을 풀스택 프레임워크로 활용하면서도 싱글 페이지 자바스크립트 애플리케이션이 제공하는 다양한 UI 이점을 누릴 수 있게 해줍니다.

풀스택 프레임워크로 Laravel을 사용할 경우, [Vite](/laravel/12.x/vite)를 이용해 애플리케이션의 CSS와 JavaScript를 컴파일하는 방법도 꼭 익혀두시길 권장합니다.

> [!NOTE]
> 애플리케이션 개발을 빠르게 시작하고 싶다면, 공식 [애플리케이션 스타터 키트](/laravel/12.x/starter-kits) 중 하나를 확인해보세요.


### Laravel: API 백엔드로 사용하기 {#laravel-the-api-backend}

Laravel은 자바스크립트 싱글 페이지 애플리케이션이나 모바일 애플리케이션을 위한 API 백엔드로도 활용할 수 있습니다. 예를 들어, [Next.js](https://nextjs.org) 애플리케이션의 API 백엔드로 Laravel을 사용할 수 있습니다. 이와 같은 상황에서는 Laravel을 통해 애플리케이션의 [인증](/laravel/12.x/sanctum)과 데이터 저장/조회 기능을 제공할 수 있으며, 큐, 이메일, 알림 등 Laravel의 강력한 서비스들도 함께 활용할 수 있습니다.

이 방식으로 Laravel을 사용하려면 [라우팅](/laravel/12.x/routing), [Laravel Sanctum](/laravel/12.x/sanctum), [Eloquent ORM](/laravel/12.x/eloquent) 관련 문서를 참고해보세요.
