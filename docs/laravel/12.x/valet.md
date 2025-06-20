# Laravel Valet





















## 소개 {#introduction}

> [!NOTE]
> macOS 또는 Windows에서 Laravel 애플리케이션을 더 쉽게 개발하고 싶으신가요? [Laravel Herd](https://herd.laravel.com)를 확인해보세요. Herd는 Valet, PHP, Composer 등 Laravel 개발에 필요한 모든 것을 포함하고 있습니다.

[Laravel Valet](https://github.com/laravel/valet)는 macOS 미니멀리스트를 위한 개발 환경입니다. Laravel Valet은 Mac이 부팅될 때마다 [Nginx](https://www.nginx.com/)가 백그라운드에서 항상 실행되도록 설정합니다. 그리고 [DnsMasq](https://en.wikipedia.org/wiki/Dnsmasq)를 사용하여, Valet은 `*.test` 도메인에 대한 모든 요청을 로컬 머신에 설치된 사이트로 프록시합니다.

즉, Valet은 약 7MB의 RAM만 사용하는 매우 빠른 Laravel 개발 환경입니다. Valet은 [Sail](/laravel/12.x/sail)이나 [Homestead](/laravel/12.x/homestead)를 완전히 대체하지는 않지만, 유연한 기본 기능, 극한의 속도, 또는 제한된 RAM을 가진 머신에서 작업할 때 훌륭한 대안을 제공합니다.

기본적으로 Valet은 다음과 같은 다양한 프레임워크 및 CMS를 지원합니다(이에 국한되지 않음):

<style>
    #valet-support > ul {
        column-count: 3; -moz-column-count: 3; -webkit-column-count: 3;
        line-height: 1.9;
    }
</style>

<div id="valet-support" markdown="1">

- [Laravel](https://laravel.com)
- [Bedrock](https://roots.io/bedrock/)
- [CakePHP 3](https://cakephp.org)
- [ConcreteCMS](https://www.concretecms.com/)
- [Contao](https://contao.org/en/)
- [Craft](https://craftcms.com)
- [Drupal](https://www.drupal.org/)
- [ExpressionEngine](https://www.expressionengine.com/)
- [Jigsaw](https://jigsaw.tighten.co)
- [Joomla](https://www.joomla.org/)
- [Katana](https://github.com/themsaid/katana)
- [Kirby](https://getkirby.com/)
- [Magento](https://magento.com/)
- [OctoberCMS](https://octobercms.com/)
- [Sculpin](https://sculpin.io/)
- [Slim](https://www.slimframework.com)
- [Statamic](https://statamic.com)
- 정적 HTML
- [Symfony](https://symfony.com)
- [WordPress](https://wordpress.org)
- [Zend](https://framework.zend.com)

</div>

또한, [커스텀 드라이버](#custom-valet-drivers)를 통해 Valet을 확장할 수 있습니다.


## 설치 {#installation}

> [!WARNING]
> Valet은 macOS와 [Homebrew](https://brew.sh/)가 필요합니다. 설치 전에 Apache나 Nginx와 같은 다른 프로그램이 로컬 머신의 80번 포트를 사용하고 있지 않은지 확인하세요.

시작하려면 먼저 `update` 명령어를 사용하여 Homebrew가 최신 상태인지 확인해야 합니다:

```shell
brew update
```

다음으로, Homebrew를 사용하여 PHP를 설치해야 합니다:

```shell
brew install php
```

PHP를 설치한 후, [Composer 패키지 매니저](https://getcomposer.org)를 설치할 준비가 되었습니다. 또한, `$HOME/.composer/vendor/bin` 디렉터리가 시스템의 "PATH"에 포함되어 있는지 확인해야 합니다. Composer가 설치되면, Laravel Valet을 글로벌 Composer 패키지로 설치할 수 있습니다:

```shell
composer global require laravel/valet
```

마지막으로, Valet의 `install` 명령어를 실행할 수 있습니다. 이 명령어는 Valet과 DnsMasq를 설정 및 설치합니다. 또한, Valet이 의존하는 데몬들이 시스템이 시작될 때 자동으로 실행되도록 설정됩니다:

```shell
valet install
```

Valet이 설치되면, 터미널에서 `ping foobar.test`와 같은 명령어로 `*.test` 도메인을 핑해보세요. Valet이 올바르게 설치되었다면, 이 도메인이 `127.0.0.1`에서 응답하는 것을 볼 수 있습니다.

Valet은 머신이 부팅될 때마다 필요한 서비스를 자동으로 시작합니다.


#### PHP 버전 {#php-versions}

> [!NOTE]
> 글로벌 PHP 버전을 변경하는 대신, `isolate` [명령어](#per-site-php-versions)를 통해 사이트별 PHP 버전을 지정할 수 있습니다.

Valet은 `valet use php@version` 명령어를 사용하여 PHP 버전을 전환할 수 있습니다. 지정한 PHP 버전이 설치되어 있지 않으면 Homebrew를 통해 자동으로 설치됩니다:

```shell
valet use php@8.2

valet use php
```

또한, 프로젝트 루트에 `.valetrc` 파일을 생성할 수 있습니다. `.valetrc` 파일에는 사이트에서 사용할 PHP 버전을 지정해야 합니다:

```shell
php=php@8.2
```

이 파일이 생성되면, `valet use` 명령어를 실행하여 파일을 읽어 사이트의 선호 PHP 버전을 자동으로 결정할 수 있습니다.

> [!WARNING]
> 여러 PHP 버전이 설치되어 있더라도, Valet은 한 번에 하나의 PHP 버전만 제공합니다.


#### 데이터베이스 {#database}

애플리케이션에 데이터베이스가 필요하다면, MySQL, PostgreSQL, Redis를 포함한 무료 통합 데이터베이스 관리 도구인 [DBngin](https://dbngin.com)을 확인해보세요. DBngin을 설치한 후에는 `127.0.0.1`에서 `root` 사용자명과 비밀번호 없이 데이터베이스에 연결할 수 있습니다.


#### 설치 초기화 {#resetting-your-installation}

Valet 설치가 제대로 동작하지 않는 경우, `composer global require laravel/valet` 명령어를 실행한 후 `valet install`을 실행하면 설치가 초기화되어 다양한 문제를 해결할 수 있습니다. 드물게, `valet uninstall --force`를 실행한 후 `valet install`을 실행하여 Valet을 "강제 초기화"해야 할 수도 있습니다.


### Valet 업그레이드 {#upgrading-valet}

터미널에서 `composer global require laravel/valet` 명령어를 실행하여 Valet 설치를 업데이트할 수 있습니다. 업그레이드 후에는 `valet install` 명령어를 실행하여 필요하다면 Valet이 구성 파일을 추가로 업그레이드할 수 있도록 하는 것이 좋습니다.


#### Valet 4로 업그레이드 {#upgrading-to-valet-4}

Valet 3에서 Valet 4로 업그레이드하는 경우, 다음 단계를 따라 Valet 설치를 올바르게 업그레이드하세요:

<div class="content-list" markdown="1">

- 사이트의 PHP 버전을 커스터마이즈하기 위해 `.valetphprc` 파일을 추가했다면, 각 `.valetphprc` 파일을 `.valetrc`로 이름을 변경하세요. 그리고 `.valetrc` 파일의 기존 내용 앞에 `php=`를 추가하세요.
- 커스텀 드라이버가 있다면, 새로운 드라이버 시스템의 네임스페이스, 확장자, 타입 힌트, 반환 타입 힌트에 맞게 업데이트하세요. 예시는 Valet의 [SampleValetDriver](https://github.com/laravel/valet/blob/d7787c025e60abc24a5195dc7d4c5c6f2d984339/cli/stubs/SampleValetDriver.php)를 참고하세요.
- PHP 7.1~7.4로 사이트를 제공하는 경우, Homebrew를 통해 PHP 8.0 이상 버전을 설치해야 합니다. Valet은 이 버전을 사용하여 일부 스크립트를 실행하므로, 기본 연결 버전이 아니더라도 필요합니다.

</div>


## 사이트 제공 {#serving-sites}

Valet이 설치되면, Laravel 애플리케이션을 제공할 준비가 된 것입니다. Valet은 애플리케이션을 제공하는 데 도움이 되는 두 가지 명령어, `park`와 `link`를 제공합니다.


### `park` 명령어 {#the-park-command}

`park` 명령어는 애플리케이션이 포함된 디렉터리를 등록합니다. 디렉터리가 Valet에 "주차"되면, 해당 디렉터리 내의 모든 디렉터리에 대해 `http://<directory-name>.test`로 웹 브라우저에서 접근할 수 있습니다:

```shell
cd ~/Sites

valet park
```

이게 전부입니다. 이제 "주차"된 디렉터리 내에 생성하는 모든 애플리케이션은 `http://<directory-name>.test` 규칙에 따라 자동으로 제공됩니다. 예를 들어, 주차된 디렉터리에 "laravel"이라는 디렉터리가 있다면, 해당 디렉터리 내의 애플리케이션은 `http://laravel.test`에서 접근할 수 있습니다. 또한, Valet은 와일드카드 서브도메인(`http://foo.laravel.test`)으로도 사이트에 접근할 수 있도록 자동으로 허용합니다.


### `link` 명령어 {#the-link-command}

`link` 명령어도 Laravel 애플리케이션을 제공하는 데 사용할 수 있습니다. 이 명령어는 디렉터리 내의 단일 사이트만 제공하고 싶을 때 유용합니다:

```shell
cd ~/Sites/laravel

valet link
```

애플리케이션이 `link` 명령어로 Valet에 연결되면, 디렉터리 이름을 사용하여 애플리케이션에 접근할 수 있습니다. 위 예시에서 연결된 사이트는 `http://laravel.test`에서 접근할 수 있습니다. 또한, Valet은 와일드카드 서브도메인(`http://foo.laravel.test`)으로도 사이트에 접근할 수 있도록 자동으로 허용합니다.

다른 호스트명으로 애플리케이션을 제공하고 싶다면, `link` 명령어에 호스트명을 전달할 수 있습니다. 예를 들어, 다음 명령어를 실행하면 애플리케이션을 `http://application.test`에서 사용할 수 있습니다:

```shell
cd ~/Sites/laravel

valet link application
```

물론, `link` 명령어를 사용하여 서브도메인에서도 애플리케이션을 제공할 수 있습니다:

```shell
valet link api.application
```

`links` 명령어를 실행하면 연결된 모든 디렉터리 목록을 확인할 수 있습니다:

```shell
valet links
```

`unlink` 명령어는 사이트의 심볼릭 링크를 제거하는 데 사용할 수 있습니다:

```shell
cd ~/Sites/laravel

valet unlink
```


### TLS로 사이트 보안 {#securing-sites}

기본적으로 Valet은 사이트를 HTTP로 제공합니다. 하지만, 암호화된 TLS와 HTTP/2로 사이트를 제공하고 싶다면 `secure` 명령어를 사용할 수 있습니다. 예를 들어, 사이트가 `laravel.test` 도메인에서 Valet에 의해 제공되고 있다면, 다음 명령어를 실행하여 보안 설정을 할 수 있습니다:

```shell
valet secure laravel
```

사이트의 보안을 해제하고 일반 HTTP로 다시 제공하려면 `unsecure` 명령어를 사용하세요. 이 명령어도 보안을 해제할 호스트명을 인자로 받습니다:

```shell
valet unsecure laravel
```


### 기본 사이트 제공 {#serving-a-default-site}

때때로, 알 수 없는 `test` 도메인에 접속할 때 `404` 대신 "기본" 사이트를 제공하도록 Valet을 설정하고 싶을 수 있습니다. 이를 위해, `~/.config/valet/config.json` 구성 파일에 `default` 옵션을 추가하고, 기본 사이트로 사용할 경로를 지정하세요:

    "default": "/Users/Sally/Sites/example-site",


### 사이트별 PHP 버전 {#per-site-php-versions}

기본적으로 Valet은 글로벌 PHP 설치를 사용하여 사이트를 제공합니다. 하지만, 여러 사이트에서 다양한 PHP 버전을 지원해야 한다면, `isolate` 명령어를 사용하여 특정 사이트에 사용할 PHP 버전을 지정할 수 있습니다. `isolate` 명령어는 현재 작업 중인 디렉터리에 있는 사이트에 대해 지정한 PHP 버전을 사용하도록 Valet을 설정합니다:

```shell
cd ~/Sites/example-site

valet isolate php@8.0
```

사이트 이름이 해당 디렉터리 이름과 다르다면, `--site` 옵션을 사용하여 사이트 이름을 지정할 수 있습니다:

```shell
valet isolate php@8.0 --site="site-name"
```

편의를 위해, `valet php`, `composer`, `which-php` 명령어를 사용하여 사이트에 설정된 PHP 버전에 맞는 PHP CLI 또는 도구를 프록시할 수 있습니다:

```shell
valet php
valet composer
valet which-php
```

`isolated` 명령어를 실행하면 모든 격리된 사이트와 해당 PHP 버전 목록을 확인할 수 있습니다:

```shell
valet isolated
```

사이트를 Valet의 글로벌 PHP 버전으로 되돌리려면, 사이트 루트 디렉터리에서 `unisolate` 명령어를 실행하세요:

```shell
valet unisolate
```


## 사이트 공유 {#sharing-sites}

Valet은 로컬 사이트를 외부에 공유할 수 있는 명령어를 포함하고 있어, 모바일 기기에서 사이트를 테스트하거나 팀원 및 클라이언트와 쉽게 공유할 수 있습니다.

기본적으로 Valet은 ngrok 또는 Expose를 통해 사이트 공유를 지원합니다. 사이트를 공유하기 전에, `share-tool` 명령어를 사용하여 Valet 설정을 업데이트하고 `ngrok`, `expose`, 또는 `cloudflared`를 지정하세요:

```shell
valet share-tool ngrok
```

도구를 선택했는데 Homebrew(ngrok, cloudflared) 또는 Composer(Expose)로 설치되어 있지 않다면, Valet이 자동으로 설치를 안내합니다. 물론, 두 도구 모두 사이트 공유를 시작하기 전에 ngrok 또는 Expose 계정 인증이 필요합니다.

사이트를 공유하려면, 터미널에서 사이트 디렉터리로 이동한 후 Valet의 `share` 명령어를 실행하세요. 공개적으로 접근 가능한 URL이 클립보드에 복사되어 바로 브라우저에 붙여넣거나 팀과 공유할 수 있습니다:

```shell
cd ~/Sites/laravel

valet share
```

사이트 공유를 중지하려면 `Control + C`를 누르세요.

> [!WARNING]
> 커스텀 DNS 서버(예: `1.1.1.1`)를 사용하는 경우, ngrok 공유가 제대로 동작하지 않을 수 있습니다. 이 경우, Mac 시스템 설정에서 네트워크 설정으로 이동한 후 고급 설정의 DNS 탭에서 `127.0.0.1`을 첫 번째 DNS 서버로 추가하세요.


#### Ngrok을 통한 사이트 공유 {#sharing-sites-via-ngrok}

ngrok을 사용하여 사이트를 공유하려면 [ngrok 계정 생성](https://dashboard.ngrok.com/signup) 및 [인증 토큰 설정](https://dashboard.ngrok.com/get-started/your-authtoken)이 필요합니다. 인증 토큰을 받았다면, 해당 토큰으로 Valet 설정을 업데이트할 수 있습니다:

```shell
valet set-ngrok-token YOUR_TOKEN_HERE
```

> [!NOTE]
> `valet share --region=eu`와 같이, share 명령어에 추가 ngrok 파라미터를 전달할 수 있습니다. 자세한 내용은 [ngrok 문서](https://ngrok.com/docs)를 참고하세요.


#### Expose를 통한 사이트 공유 {#sharing-sites-via-expose}

Expose를 사용하여 사이트를 공유하려면 [Expose 계정 생성](https://expose.dev/register) 및 [인증 토큰을 통한 Expose 인증](https://expose.dev/docs/getting-started/getting-your-token)이 필요합니다.

지원하는 추가 커맨드라인 파라미터에 대한 정보는 [Expose 문서](https://expose.dev/docs)를 참고하세요.


### 로컬 네트워크에서 사이트 공유 {#sharing-sites-on-your-local-network}

Valet은 기본적으로 개발 머신이 인터넷으로부터 보안 위험에 노출되지 않도록 내부 `127.0.0.1` 인터페이스로 들어오는 트래픽만 허용합니다.

로컬 네트워크의 다른 기기에서 머신의 IP 주소(예: `192.168.1.10/application.test`)로 Valet 사이트에 접근하고 싶다면, 해당 사이트의 Nginx 설정 파일을 수동으로 수정하여 `listen` 지시어의 제한을 제거해야 합니다. 80번과 443번 포트의 `listen` 지시어에서 `127.0.0.1:` 접두사를 제거하세요.

프로젝트에서 `valet secure`를 실행하지 않았다면, `/usr/local/etc/nginx/valet/valet.conf` 파일을 수정하여 모든 비 HTTPS 사이트에 대한 네트워크 접근을 열 수 있습니다. 하지만, 프로젝트 사이트를 HTTPS로 제공 중(`valet secure`를 실행한 경우)이라면, `~/.config/valet/Nginx/app-name.test` 파일을 수정해야 합니다.

Nginx 설정을 업데이트한 후에는 `valet restart` 명령어를 실행하여 변경 사항을 적용하세요.


## 사이트별 환경 변수 {#site-specific-environment-variables}

다른 프레임워크를 사용하는 일부 애플리케이션은 서버 환경 변수에 의존하지만, 프로젝트 내에서 해당 변수를 설정할 방법을 제공하지 않을 수 있습니다. Valet은 프로젝트 루트에 `.valet-env.php` 파일을 추가하여 사이트별 환경 변수를 설정할 수 있습니다. 이 파일은 사이트/환경 변수 쌍의 배열을 반환해야 하며, 배열에 지정된 각 사이트에 대해 글로벌 `$_SERVER` 배열에 추가됩니다:

```php
<?php

return [
    // laravel.test 사이트에 대해 $_SERVER['key']를 "value"로 설정...
    'laravel' => [
        'key' => 'value',
    ],

    // 모든 사이트에 대해 $_SERVER['key']를 "value"로 설정...
    '*' => [
        'key' => 'value',
    ],
];
```


## 서비스 프록시 {#proxying-services}

때때로 Valet 도메인을 로컬 머신의 다른 서비스로 프록시하고 싶을 수 있습니다. 예를 들어, Valet을 실행하면서 Docker에서 별도의 사이트를 실행해야 할 때가 있지만, Valet과 Docker는 동시에 80번 포트를 사용할 수 없습니다.

이 문제를 해결하려면 `proxy` 명령어를 사용하여 프록시를 생성할 수 있습니다. 예를 들어, `http://elasticsearch.test`의 모든 트래픽을 `http://127.0.0.1:9200`으로 프록시할 수 있습니다:

```shell
# HTTP로 프록시...
valet proxy elasticsearch http://127.0.0.1:9200

# TLS + HTTP/2로 프록시...
valet proxy elasticsearch http://127.0.0.1:9200 --secure
```

`unproxy` 명령어를 사용하여 프록시를 제거할 수 있습니다:

```shell
valet unproxy elasticsearch
```

`proxies` 명령어를 사용하여 프록시된 모든 사이트 구성을 확인할 수 있습니다:

```shell
valet proxies
```


## 커스텀 Valet 드라이버 {#custom-valet-drivers}

Valet이 기본적으로 지원하지 않는 프레임워크나 CMS에서 실행되는 PHP 애플리케이션을 제공하기 위해 직접 Valet "드라이버"를 작성할 수 있습니다. Valet을 설치하면 `~/.config/valet/Drivers` 디렉터리가 생성되며, 이 안에 `SampleValetDriver.php` 파일이 포함되어 있습니다. 이 파일은 커스텀 드라이버를 작성하는 방법을 보여주는 샘플 구현입니다. 드라이버를 작성하려면 `serves`, `isStaticFile`, `frontControllerPath` 세 가지 메서드만 구현하면 됩니다.

세 메서드 모두 `$sitePath`, `$siteName`, `$uri` 값을 인자로 받습니다. `$sitePath`는 머신에서 제공 중인 사이트의 전체 경로(예: `/Users/Lisa/Sites/my-project`)입니다. `$siteName`은 도메인의 "호스트"/"사이트 이름" 부분(`my-project`)입니다. `$uri`는 들어오는 요청의 URI(`/foo/bar`)입니다.

커스텀 Valet 드라이버를 완성했다면, `~/.config/valet/Drivers` 디렉터리에 `FrameworkValetDriver.php` 네이밍 규칙으로 파일을 배치하세요. 예를 들어, WordPress용 커스텀 드라이버를 작성한다면 파일명은 `WordPressValetDriver.php`여야 합니다.

이제 커스텀 Valet 드라이버가 구현해야 할 각 메서드의 샘플 구현을 살펴보겠습니다.


#### `serves` 메서드 {#the-serves-method}

`serves` 메서드는 드라이버가 들어오는 요청을 처리해야 한다면 `true`를 반환해야 합니다. 그렇지 않으면 `false`를 반환해야 합니다. 따라서 이 메서드 내에서 주어진 `$sitePath`에 제공하려는 프로젝트 유형이 포함되어 있는지 확인해야 합니다.

예를 들어, `WordPressValetDriver`를 작성한다고 가정해봅시다. 우리의 `serves` 메서드는 다음과 같을 수 있습니다:

```php
/**
 * 드라이버가 요청을 처리하는지 확인합니다.
 */
public function serves(string $sitePath, string $siteName, string $uri): bool
{
    return is_dir($sitePath.'/wp-admin');
}
```


#### `isStaticFile` 메서드 {#the-isstaticfile-method}

`isStaticFile` 메서드는 들어오는 요청이 이미지나 스타일시트와 같은 "정적" 파일에 대한 것인지 확인해야 합니다. 파일이 정적이라면, 디스크에 있는 정적 파일의 전체 경로를 반환해야 합니다. 들어오는 요청이 정적 파일이 아니라면, `false`를 반환해야 합니다:

```php
/**
 * 들어오는 요청이 정적 파일에 대한 것인지 확인합니다.
 *
 * @return string|false
 */
public function isStaticFile(string $sitePath, string $siteName, string $uri)
{
    if (file_exists($staticFilePath = $sitePath.'/public/'.$uri)) {
        return $staticFilePath;
    }

    return false;
}
```

> [!WARNING]
> `isStaticFile` 메서드는 `serves` 메서드가 들어오는 요청에 대해 `true`를 반환하고, 요청 URI가 `/`가 아닐 때만 호출됩니다.


#### `frontControllerPath` 메서드 {#the-frontcontrollerpath-method}

`frontControllerPath` 메서드는 애플리케이션의 "프론트 컨트롤러"(일반적으로 "index.php" 파일 또는 이에 상응하는 파일)의 전체 경로를 반환해야 합니다:

```php
/**
 * 애플리케이션의 프론트 컨트롤러의 전체 경로를 반환합니다.
 */
public function frontControllerPath(string $sitePath, string $siteName, string $uri): string
{
    return $sitePath.'/public/index.php';
}
```


### 로컬 드라이버 {#local-drivers}

단일 애플리케이션에 대한 커스텀 Valet 드라이버를 정의하고 싶다면, 애플리케이션 루트 디렉터리에 `LocalValetDriver.php` 파일을 생성하세요. 커스텀 드라이버는 기본 `ValetDriver` 클래스를 확장하거나, `LaravelValetDriver`와 같은 기존 애플리케이션 전용 드라이버를 확장할 수 있습니다:

```php
use Valet\Drivers\LaravelValetDriver;

class LocalValetDriver extends LaravelValetDriver
{
    /**
     * 드라이버가 요청을 처리하는지 확인합니다.
     */
    public function serves(string $sitePath, string $siteName, string $uri): bool
    {
        return true;
    }

    /**
     * 애플리케이션의 프론트 컨트롤러의 전체 경로를 반환합니다.
     */
    public function frontControllerPath(string $sitePath, string $siteName, string $uri): string
    {
        return $sitePath.'/public_html/index.php';
    }
}
```


## 기타 Valet 명령어 {#other-valet-commands}

<div class="overflow-auto">

| 명령어 | 설명 |
| --- | --- |
| `valet list` | 모든 Valet 명령어 목록을 표시합니다. |
| `valet diagnose` | Valet 디버깅을 돕기 위한 진단 정보를 출력합니다. |
| `valet directory-listing` | 디렉터리 목록 표시 동작을 결정합니다. 기본값은 "off"로, 디렉터리에 대해 404 페이지를 렌더링합니다. |
| `valet forget` | "주차"된 디렉터리에서 실행하여 주차 디렉터리 목록에서 제거합니다. |
| `valet log` | Valet 서비스에서 기록한 로그 목록을 확인합니다. |
| `valet paths` | 모든 "주차"된 경로를 확인합니다. |
| `valet restart` | Valet 데몬을 재시작합니다. |
| `valet start` | Valet 데몬을 시작합니다. |
| `valet stop` | Valet 데몬을 중지합니다. |
| `valet trust` | Brew와 Valet에 대한 sudoers 파일을 추가하여 비밀번호 입력 없이 Valet 명령어를 실행할 수 있도록 합니다. |
| `valet uninstall` | Valet을 제거합니다: 수동 제거 방법을 안내합니다. `--force` 옵션을 전달하면 Valet의 모든 리소스를 강제로 삭제합니다. |

</div>


## Valet 디렉터리 및 파일 {#valet-directories-and-files}

Valet 환경에서 문제를 해결할 때 다음 디렉터리 및 파일 정보를 참고하면 도움이 될 수 있습니다:

#### `~/.config/valet`

Valet의 모든 설정이 포함되어 있습니다. 이 디렉터리를 백업해두는 것이 좋습니다.

#### `~/.config/valet/dnsmasq.d/`

이 디렉터리에는 DNSMasq의 설정이 포함되어 있습니다.

#### `~/.config/valet/Drivers/`

이 디렉터리에는 Valet의 드라이버가 포함되어 있습니다. 드라이버는 특정 프레임워크/CMS가 어떻게 제공되는지 결정합니다.

#### `~/.config/valet/Nginx/`

이 디렉터리에는 Valet의 모든 Nginx 사이트 설정이 포함되어 있습니다. 이 파일들은 `install` 및 `secure` 명령어를 실행할 때 재생성됩니다.

#### `~/.config/valet/Sites/`

이 디렉터리에는 [링크된 프로젝트](#the-link-command)에 대한 모든 심볼릭 링크가 포함되어 있습니다.

#### `~/.config/valet/config.json`

이 파일은 Valet의 마스터 설정 파일입니다.

#### `~/.config/valet/valet.sock`

이 파일은 Valet의 Nginx 설치에서 사용하는 PHP-FPM 소켓입니다. PHP가 정상적으로 실행 중일 때만 존재합니다.

#### `~/.config/valet/Log/fpm-php.www.log`

이 파일은 PHP 오류에 대한 사용자 로그입니다.

#### `~/.config/valet/Log/nginx-error.log`

이 파일은 Nginx 오류에 대한 사용자 로그입니다.

#### `/usr/local/var/log/php-fpm.log`

이 파일은 PHP-FPM 오류에 대한 시스템 로그입니다.

#### `/usr/local/var/log/nginx`

이 디렉터리에는 Nginx 접근 및 오류 로그가 포함되어 있습니다.

#### `/usr/local/etc/php/X.X/conf.d`

이 디렉터리에는 다양한 PHP 설정을 위한 `*.ini` 파일이 포함되어 있습니다.

#### `/usr/local/etc/php/X.X/php-fpm.d/valet-fpm.conf`

이 파일은 PHP-FPM 풀 설정 파일입니다.

#### `~/.composer/vendor/laravel/valet/cli/stubs/secure.valet.conf`

이 파일은 사이트의 SSL 인증서를 생성할 때 사용하는 기본 Nginx 설정입니다.


### 디스크 접근 권한 {#disk-access}

macOS 10.14부터 [일부 파일 및 디렉터리에 대한 접근이 기본적으로 제한](https://manuals.info.apple.com/MANUALS/1000/MA1902/en_US/apple-platform-security-guide.pdf)됩니다. 이 제한에는 데스크탑, 문서, 다운로드 디렉터리가 포함됩니다. 또한, 네트워크 볼륨 및 이동식 볼륨 접근도 제한됩니다. 따라서 Valet은 사이트 폴더가 이러한 보호된 위치 외부에 위치하도록 권장합니다.

하지만, 이러한 위치 내에서 사이트를 제공하고 싶다면, Nginx에 "전체 디스크 접근 권한"을 부여해야 합니다. 그렇지 않으면, 정적 자산 제공 시 서버 오류나 예기치 않은 동작이 발생할 수 있습니다. 일반적으로 macOS는 이러한 위치에 접근할 때 Nginx에 전체 접근 권한을 부여하라는 메시지를 자동으로 표시합니다. 또는, `시스템 환경설정` > `보안 및 개인정보 보호` > `개인정보 보호`에서 수동으로 "전체 디스크 접근 권한"을 부여할 수 있습니다. 이후, 메인 창에서 모든 `nginx` 항목을 활성화하세요.
