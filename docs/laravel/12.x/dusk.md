# Laravel Dusk




















































## 소개 {#introduction}

[Laravel Dusk](https://github.com/laravel/dusk)는 표현력 있고 사용하기 쉬운 브라우저 자동화 및 테스트 API를 제공합니다. 기본적으로 Dusk는 로컬 컴퓨터에 JDK나 Selenium을 설치할 필요가 없습니다. 대신, Dusk는 독립 실행형 [ChromeDriver](https://sites.google.com/chromium.org/driver) 설치를 사용합니다. 그러나 원하는 경우 Selenium 호환 드라이버를 자유롭게 사용할 수 있습니다.


## 설치 {#installation}

시작하려면 [Google Chrome](https://www.google.com/chrome)을 설치하고 `laravel/dusk` Composer 의존성을 프로젝트에 추가해야 합니다:

```shell
composer require laravel/dusk --dev
```

> [!WARNING]
> Dusk의 서비스 프로바이더를 수동으로 등록하는 경우, **절대** 프로덕션 환경에서 등록해서는 안 됩니다. 그렇게 하면 임의의 사용자가 애플리케이션에 인증할 수 있게 될 수 있습니다.

Dusk 패키지를 설치한 후, `dusk:install` Artisan 명령어를 실행하세요. `dusk:install` 명령어는 `tests/Browser` 디렉터리, 예제 Dusk 테스트, 그리고 운영 체제에 맞는 Chrome Driver 바이너리를 설치합니다:

```shell
php artisan dusk:install
```

다음으로, 애플리케이션의 `.env` 파일에 `APP_URL` 환경 변수를 설정하세요. 이 값은 브라우저에서 애플리케이션에 접근할 때 사용하는 URL과 일치해야 합니다.

> [!NOTE]
> 로컬 개발 환경을 관리하기 위해 [Laravel Sail](/laravel/12.x/sail)을 사용하는 경우, [Dusk 테스트 구성 및 실행](/laravel/12.x/sail#laravel-dusk)에 대한 Sail 문서도 참고하세요.


### ChromeDriver 설치 관리 {#managing-chromedriver-installations}

`dusk:install` 명령어로 Laravel Dusk가 설치하는 ChromeDriver와 다른 버전을 설치하고 싶다면, `dusk:chrome-driver` 명령어를 사용할 수 있습니다:

```shell
# 운영 체제에 맞는 최신 ChromeDriver 설치...
php artisan dusk:chrome-driver

# 운영 체제에 맞는 특정 버전의 ChromeDriver 설치...
php artisan dusk:chrome-driver 86

# 지원되는 모든 운영 체제에 특정 버전의 ChromeDriver 설치...
php artisan dusk:chrome-driver --all

# 운영 체제에서 감지된 Chrome / Chromium 버전에 맞는 ChromeDriver 설치...
php artisan dusk:chrome-driver --detect
```

> [!WARNING]
> Dusk는 `chromedriver` 바이너리가 실행 가능해야 합니다. Dusk 실행에 문제가 있다면, 다음 명령어로 바이너리가 실행 가능한지 확인하세요: `chmod -R 0755 vendor/laravel/dusk/bin/`.


### 다른 브라우저 사용하기 {#using-other-browsers}

기본적으로 Dusk는 Google Chrome과 독립 실행형 [ChromeDriver](https://sites.google.com/chromium.org/driver) 설치를 사용하여 브라우저 테스트를 실행합니다. 그러나 직접 Selenium 서버를 시작하고 원하는 브라우저로 테스트를 실행할 수 있습니다.

시작하려면, 애플리케이션의 기본 Dusk 테스트 케이스인 `tests/DuskTestCase.php` 파일을 엽니다. 이 파일에서 `startChromeDriver` 메서드 호출을 제거할 수 있습니다. 이렇게 하면 Dusk가 ChromeDriver를 자동으로 시작하지 않습니다:

```php
/**
 * Dusk 테스트 실행 준비.
 *
 * @beforeClass
 */
public static function prepare(): void
{
    // static::startChromeDriver();
}
```

다음으로, 원하는 URL과 포트에 연결하도록 `driver` 메서드를 수정할 수 있습니다. 또한 WebDriver에 전달할 "원하는 기능(desired capabilities)"도 수정할 수 있습니다:

```php
use Facebook\WebDriver\Remote\RemoteWebDriver;

/**
 * RemoteWebDriver 인스턴스 생성.
 */
protected function driver(): RemoteWebDriver
{
    return RemoteWebDriver::create(
        'http://localhost:4444/wd/hub', DesiredCapabilities::phantomjs()
    );
}
```


## 시작하기 {#getting-started}


### 테스트 생성하기 {#generating-tests}

Dusk 테스트를 생성하려면, `dusk:make` Artisan 명령어를 사용하세요. 생성된 테스트는 `tests/Browser` 디렉터리에 위치합니다:

```shell
php artisan dusk:make LoginTest
```


### 각 테스트 후 데이터베이스 초기화 {#resetting-the-database-after-each-test}

작성하는 대부분의 테스트는 애플리케이션 데이터베이스에서 데이터를 가져오는 페이지와 상호작용합니다. 그러나 Dusk 테스트에서는 `RefreshDatabase` 트레이트를 절대 사용해서는 안 됩니다. `RefreshDatabase` 트레이트는 데이터베이스 트랜잭션을 활용하는데, 이는 HTTP 요청 간에 적용되거나 사용될 수 없습니다. 대신, `DatabaseMigrations` 트레이트와 `DatabaseTruncation` 트레이트 두 가지 옵션이 있습니다.


#### 데이터베이스 마이그레이션 사용하기 {#reset-migrations}

`DatabaseMigrations` 트레이트는 각 테스트 전에 데이터베이스 마이그레이션을 실행합니다. 하지만 각 테스트마다 데이터베이스 테이블을 삭제하고 다시 생성하는 것은 테이블을 잘라내는(truncate) 것보다 일반적으로 느립니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;

uses(DatabaseMigrations::class);

//
```

```php [PHPUnit]
<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    use DatabaseMigrations;

    //
}
```
:::
> [!WARNING]
> Dusk 테스트를 실행할 때 SQLite 인메모리 데이터베이스는 사용할 수 없습니다. 브라우저가 자체 프로세스 내에서 실행되기 때문에, 다른 프로세스의 인메모리 데이터베이스에 접근할 수 없습니다.


#### 데이터베이스 잘라내기 사용하기 {#reset-truncation}

`DatabaseTruncation` 트레이트는 첫 번째 테스트에서 데이터베이스를 마이그레이션하여 데이터베이스 테이블이 제대로 생성되었는지 확인합니다. 그러나 이후 테스트에서는 데이터베이스의 테이블만 잘라내어(truncate) 모든 마이그레이션을 다시 실행하는 것보다 속도가 빨라집니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;

uses(DatabaseTruncation::class);

//
```

```php [PHPUnit]
<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    use DatabaseTruncation;

    //
}
```
:::
기본적으로 이 트레이트는 `migrations` 테이블을 제외한 모든 테이블을 잘라냅니다. 잘라낼 테이블을 커스터마이즈하려면, 테스트 클래스에 `$tablesToTruncate` 프로퍼티를 정의할 수 있습니다:

> [!NOTE]
> Pest를 사용하는 경우, 속성이나 메서드는 기본 `DuskTestCase` 클래스 또는 테스트 파일이 확장하는 클래스에 정의해야 합니다.

```php
/**
 * 잘라낼 테이블을 지정합니다.
 *
 * @var array
 */
protected $tablesToTruncate = ['users'];
```

또는, 잘라내기에서 제외할 테이블을 지정하려면 `$exceptTables` 프로퍼티를 정의할 수 있습니다:

```php
/**
 * 잘라내기에서 제외할 테이블을 지정합니다.
 *
 * @var array
 */
protected $exceptTables = ['users'];
```

잘라낼 테이블이 있는 데이터베이스 연결을 지정하려면, `$connectionsToTruncate` 프로퍼티를 정의할 수 있습니다:

```php
/**
 * 잘라낼 테이블이 있는 연결을 지정합니다.
 *
 * @var array
 */
protected $connectionsToTruncate = ['mysql'];
```

데이터베이스 잘라내기 전후에 코드를 실행하고 싶다면, 테스트 클래스에 `beforeTruncatingDatabase` 또는 `afterTruncatingDatabase` 메서드를 정의할 수 있습니다:

```php
/**
 * 데이터베이스 잘라내기가 시작되기 전에 실행할 작업.
 */
protected function beforeTruncatingDatabase(): void
{
    //
}

/**
 * 데이터베이스 잘라내기가 끝난 후 실행할 작업.
 */
protected function afterTruncatingDatabase(): void
{
    //
}
```


### 테스트 실행하기 {#running-tests}

브라우저 테스트를 실행하려면, `dusk` Artisan 명령어를 실행하세요:

```shell
php artisan dusk
```

마지막으로 `dusk` 명령어를 실행했을 때 테스트가 실패했다면, `dusk:fails` 명령어를 사용하여 실패한 테스트만 먼저 다시 실행하여 시간을 절약할 수 있습니다:

```shell
php artisan dusk:fails
```

`dusk` 명령어는 Pest / PHPUnit 테스트 러너가 일반적으로 허용하는 모든 인자를 허용합니다. 예를 들어, [그룹](https://docs.phpunit.de/en/10.5/annotations.html#group)별로 테스트만 실행할 수 있습니다:

```shell
php artisan dusk --group=foo
```

> [!NOTE]
> 로컬 개발 환경을 관리하기 위해 [Laravel Sail](/laravel/12.x/sail)을 사용하는 경우, [Dusk 테스트 구성 및 실행](/laravel/12.x/sail#laravel-dusk)에 대한 Sail 문서를 참고하세요.


#### ChromeDriver 수동 시작 {#manually-starting-chromedriver}

기본적으로 Dusk는 ChromeDriver를 자동으로 시작하려고 시도합니다. 시스템에 따라 이 방법이 동작하지 않는 경우, `dusk` 명령어를 실행하기 전에 ChromeDriver를 수동으로 시작할 수 있습니다. ChromeDriver를 수동으로 시작하는 경우, `tests/DuskTestCase.php` 파일의 다음 줄을 주석 처리해야 합니다:

```php
/**
 * Dusk 테스트 실행 준비.
 *
 * @beforeClass
 */
public static function prepare(): void
{
    // static::startChromeDriver();
}
```

또한, ChromeDriver를 9515번 포트가 아닌 다른 포트에서 시작했다면, 같은 클래스의 `driver` 메서드를 올바른 포트로 수정해야 합니다:

```php
use Facebook\WebDriver\Remote\RemoteWebDriver;

/**
 * RemoteWebDriver 인스턴스 생성.
 */
protected function driver(): RemoteWebDriver
{
    return RemoteWebDriver::create(
        'http://localhost:9515', DesiredCapabilities::chrome()
    );
}
```


### 환경 파일 처리 {#environment-handling}

테스트 실행 시 Dusk가 자체 환경 파일을 사용하도록 강제하려면, 프로젝트 루트에 `.env.dusk.{environment}` 파일을 생성하세요. 예를 들어, `local` 환경에서 `dusk` 명령어를 실행할 예정이라면, `.env.dusk.local` 파일을 생성해야 합니다.

테스트 실행 시, Dusk는 `.env` 파일을 백업하고 Dusk 환경 파일을 `.env`로 이름을 바꿉니다. 테스트가 완료되면, 원래의 `.env` 파일이 복원됩니다.


## 브라우저 기본 {#browser-basics}


### 브라우저 생성하기 {#creating-browsers}

시작하려면, 애플리케이션에 로그인할 수 있는지 확인하는 테스트를 작성해봅시다. 테스트를 생성한 후, 로그인 페이지로 이동하고, 자격 증명을 입력한 뒤 "Login" 버튼을 클릭하도록 수정할 수 있습니다. 브라우저 인스턴스를 생성하려면, Dusk 테스트 내에서 `browse` 메서드를 호출하면 됩니다:
::: code-group
```php [Pest]
<?php

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;

uses(DatabaseMigrations::class);

test('basic example', function () {
    $user = User::factory()->create([
        'email' => 'taylor@laravel.com',
    ]);

    $this->browse(function (Browser $browser) use ($user) {
        $browser->visit('/login')
            ->type('email', $user->email)
            ->type('password', 'password')
            ->press('Login')
            ->assertPathIs('/home');
    });
});
```

```php [PHPUnit]
<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * 기본 브라우저 테스트 예제.
     */
    public function test_basic_example(): void
    {
        $user = User::factory()->create([
            'email' => 'taylor@laravel.com',
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                ->type('email', $user->email)
                ->type('password', 'password')
                ->press('Login')
                ->assertPathIs('/home');
        });
    }
}
```
:::
위 예제에서 볼 수 있듯이, `browse` 메서드는 클로저를 인자로 받습니다. 브라우저 인스턴스는 Dusk에 의해 이 클로저에 자동으로 전달되며, 애플리케이션과 상호작용하고 어서션을 수행하는 데 사용되는 주요 객체입니다.


#### 여러 브라우저 생성하기 {#creating-multiple-browsers}

때로는 테스트를 제대로 수행하기 위해 여러 브라우저가 필요할 수 있습니다. 예를 들어, 웹소켓과 상호작용하는 채팅 화면을 테스트하려면 여러 브라우저가 필요할 수 있습니다. 여러 브라우저를 생성하려면, `browse` 메서드에 전달하는 클로저의 시그니처에 브라우저 인자를 더 추가하면 됩니다:

```php
$this->browse(function (Browser $first, Browser $second) {
    $first->loginAs(User::find(1))
        ->visit('/home')
        ->waitForText('Message');

    $second->loginAs(User::find(2))
        ->visit('/home')
        ->waitForText('Message')
        ->type('message', 'Hey Taylor')
        ->press('Send');

    $first->waitForText('Hey Taylor')
        ->assertSee('Jeffrey Way');
});
```


### 네비게이션 {#navigation}

`visit` 메서드는 애플리케이션 내에서 주어진 URI로 이동하는 데 사용할 수 있습니다:

```php
$browser->visit('/login');
```

`visitRoute` 메서드를 사용하여 [이름이 지정된 라우트](/laravel/12.x/routing#named-routes)로 이동할 수 있습니다:

```php
$browser->visitRoute($routeName, $parameters);
```

`back` 및 `forward` 메서드를 사용하여 "뒤로" 및 "앞으로" 이동할 수 있습니다:

```php
$browser->back();

$browser->forward();
```

`refresh` 메서드를 사용하여 페이지를 새로고침할 수 있습니다:

```php
$browser->refresh();
```


### 브라우저 창 크기 조정 {#resizing-browser-windows}

`resize` 메서드를 사용하여 브라우저 창의 크기를 조정할 수 있습니다:

```php
$browser->resize(1920, 1080);
```

`maximize` 메서드는 브라우저 창을 최대화하는 데 사용할 수 있습니다:

```php
$browser->maximize();
```

`fitContent` 메서드는 브라우저 창을 콘텐츠 크기에 맞게 조정합니다:

```php
$browser->fitContent();
```

테스트가 실패할 때, Dusk는 스크린샷을 찍기 전에 자동으로 브라우저를 콘텐츠에 맞게 크기를 조정합니다. 이 기능을 비활성화하려면, 테스트 내에서 `disableFitOnFailure` 메서드를 호출하세요:

```php
$browser->disableFitOnFailure();
```

`move` 메서드를 사용하여 브라우저 창을 화면의 다른 위치로 이동할 수 있습니다:

```php
$browser->move($x = 100, $y = 100);
```


### 브라우저 매크로 {#browser-macros}

여러 테스트에서 재사용할 수 있는 커스텀 브라우저 메서드를 정의하고 싶다면, `Browser` 클래스의 `macro` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 호출해야 합니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Dusk\Browser;

class DuskServiceProvider extends ServiceProvider
{
    /**
     * Dusk의 브라우저 매크로 등록.
     */
    public function boot(): void
    {
        Browser::macro('scrollToElement', function (string $element = null) {
            $this->script("$('html, body').animate({ scrollTop: $('$element').offset().top }, 0);");

            return $this;
        });
    }
}
```

`macro` 함수는 첫 번째 인자로 이름, 두 번째 인자로 클로저를 받습니다. 매크로의 클로저는 `Browser` 인스턴스에서 해당 매크로를 메서드로 호출할 때 실행됩니다:

```php
$this->browse(function (Browser $browser) use ($user) {
    $browser->visit('/pay')
        ->scrollToElement('#credit-card-details')
        ->assertSee('Enter Credit Card Details');
});
```


### 인증 {#authentication}

종종 인증이 필요한 페이지를 테스트하게 됩니다. 매 테스트마다 애플리케이션의 로그인 화면과 상호작용하지 않으려면, Dusk의 `loginAs` 메서드를 사용할 수 있습니다. `loginAs` 메서드는 인증 가능한 모델의 기본 키 또는 모델 인스턴스를 인자로 받습니다:

```php
use App\Models\User;
use Laravel\Dusk\Browser;

$this->browse(function (Browser $browser) {
    $browser->loginAs(User::find(1))
        ->visit('/home');
});
```

> [!WARNING]
> `loginAs` 메서드를 사용한 후에는, 해당 파일 내의 모든 테스트에서 사용자 세션이 유지됩니다.


### 쿠키 {#cookies}

`cookie` 메서드를 사용하여 암호화된 쿠키의 값을 가져오거나 설정할 수 있습니다. 기본적으로 Laravel이 생성하는 모든 쿠키는 암호화되어 있습니다:

```php
$browser->cookie('name');

$browser->cookie('name', 'Taylor');
```

`plainCookie` 메서드를 사용하여 암호화되지 않은 쿠키의 값을 가져오거나 설정할 수 있습니다:

```php
$browser->plainCookie('name');

$browser->plainCookie('name', 'Taylor');
```

`deleteCookie` 메서드를 사용하여 주어진 쿠키를 삭제할 수 있습니다:

```php
$browser->deleteCookie('name');
```


### JavaScript 실행 {#executing-javascript}

`script` 메서드를 사용하여 브라우저 내에서 임의의 JavaScript 문을 실행할 수 있습니다:

```php
$browser->script('document.documentElement.scrollTop = 0');

$browser->script([
    'document.body.scrollTop = 0',
    'document.documentElement.scrollTop = 0',
]);

$output = $browser->script('return window.location.pathname');
```


### 스크린샷 찍기 {#taking-a-screenshot}

`screenshot` 메서드를 사용하여 스크린샷을 찍고 주어진 파일명으로 저장할 수 있습니다. 모든 스크린샷은 `tests/Browser/screenshots` 디렉터리에 저장됩니다:

```php
$browser->screenshot('filename');
```

`responsiveScreenshots` 메서드는 다양한 브레이크포인트에서 일련의 스크린샷을 찍는 데 사용할 수 있습니다:

```php
$browser->responsiveScreenshots('filename');
```

`screenshotElement` 메서드는 페이지의 특정 요소의 스크린샷을 찍는 데 사용할 수 있습니다:

```php
$browser->screenshotElement('#selector', 'filename');
```


### 콘솔 출력 디스크에 저장 {#storing-console-output-to-disk}

`storeConsoleLog` 메서드를 사용하여 현재 브라우저의 콘솔 출력을 주어진 파일명으로 디스크에 저장할 수 있습니다. 콘솔 출력은 `tests/Browser/console` 디렉터리에 저장됩니다:

```php
$browser->storeConsoleLog('filename');
```


### 페이지 소스 디스크에 저장 {#storing-page-source-to-disk}

`storeSource` 메서드를 사용하여 현재 페이지의 소스를 주어진 파일명으로 디스크에 저장할 수 있습니다. 페이지 소스는 `tests/Browser/source` 디렉터리에 저장됩니다:

```php
$browser->storeSource('filename');
```


## 요소와 상호작용하기 {#interacting-with-elements}


### Dusk 셀렉터 {#dusk-selectors}

요소와 상호작용할 때 좋은 CSS 셀렉터를 선택하는 것은 Dusk 테스트를 작성할 때 가장 어려운 부분 중 하나입니다. 시간이 지나면서 프론트엔드가 변경되면 아래와 같은 CSS 셀렉터가 테스트를 깨뜨릴 수 있습니다:

```html
// HTML...

<button>Login</button>
```

```php
// 테스트...

$browser->click('.login-page .container div > button');
```

Dusk 셀렉터를 사용하면 CSS 셀렉터를 기억하는 대신 효과적인 테스트 작성에 집중할 수 있습니다. 셀렉터를 정의하려면, HTML 요소에 `dusk` 속성을 추가하세요. 그런 다음, Dusk 브라우저에서 셀렉터 앞에 `@`를 붙여 테스트 내에서 해당 요소를 조작할 수 있습니다:

```html
// HTML...

<button dusk="login-button">Login</button>
```

```php
// 테스트...

$browser->click('@login-button');
```

원한다면, Dusk 셀렉터가 사용하는 HTML 속성을 `selectorHtmlAttribute` 메서드로 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Dusk\Dusk;

Dusk::selectorHtmlAttribute('data-dusk');
```


### 텍스트, 값, 속성 {#text-values-and-attributes}


#### 값 가져오기 및 설정하기 {#retrieving-setting-values}

Dusk는 페이지의 요소의 현재 값, 표시 텍스트, 속성과 상호작용할 수 있는 여러 메서드를 제공합니다. 예를 들어, 주어진 CSS 또는 Dusk 셀렉터와 일치하는 요소의 "value"를 가져오려면 `value` 메서드를 사용하세요:

```php
// 값 가져오기...
$value = $browser->value('selector');

// 값 설정하기...
$browser->value('selector', 'value');
```

`inputValue` 메서드를 사용하여 주어진 필드 이름을 가진 input 요소의 "value"를 가져올 수 있습니다:

```php
$value = $browser->inputValue('field');
```


#### 텍스트 가져오기 {#retrieving-text}

`text` 메서드는 주어진 셀렉터와 일치하는 요소의 표시 텍스트를 가져오는 데 사용할 수 있습니다:

```php
$text = $browser->text('selector');
```


#### 속성 가져오기 {#retrieving-attributes}

마지막으로, `attribute` 메서드는 주어진 셀렉터와 일치하는 요소의 속성 값을 가져오는 데 사용할 수 있습니다:

```php
$attribute = $browser->attribute('selector', 'value');
```


### 폼과 상호작용하기 {#interacting-with-forms}


#### 값 입력하기 {#typing-values}

Dusk는 폼 및 입력 요소와 상호작용할 수 있는 다양한 메서드를 제공합니다. 먼저, 입력 필드에 텍스트를 입력하는 예제를 살펴봅시다:

```php
$browser->type('email', 'taylor@laravel.com');
```

필요하다면 CSS 셀렉터를 전달할 수 있지만, `type` 메서드에 CSS 셀렉터를 반드시 전달할 필요는 없습니다. CSS 셀렉터가 제공되지 않으면, Dusk는 주어진 `name` 속성을 가진 `input` 또는 `textarea` 필드를 찾습니다.

필드의 내용을 지우지 않고 텍스트를 추가하려면, `append` 메서드를 사용할 수 있습니다:

```php
$browser->type('tags', 'foo')
    ->append('tags', ', bar, baz');
```

`clear` 메서드를 사용하여 입력값을 지울 수 있습니다:

```php
$browser->clear('email');
```

Dusk가 천천히 입력하도록 하려면, `typeSlowly` 메서드를 사용할 수 있습니다. 기본적으로 Dusk는 키를 누를 때마다 100밀리초 동안 일시정지합니다. 키 입력 간의 시간을 커스터마이즈하려면, 세 번째 인자로 밀리초 단위의 값을 전달하세요:

```php
$browser->typeSlowly('mobile', '+1 (202) 555-5555');

$browser->typeSlowly('mobile', '+1 (202) 555-5555', 300);
```

`appendSlowly` 메서드를 사용하여 천천히 텍스트를 추가할 수 있습니다:

```php
$browser->type('tags', 'foo')
    ->appendSlowly('tags', ', bar, baz');
```


#### 드롭다운 {#dropdowns}

`select` 요소에서 값을 선택하려면, `select` 메서드를 사용할 수 있습니다. `type` 메서드와 마찬가지로, `select` 메서드는 전체 CSS 셀렉터가 필요하지 않습니다. 값을 전달할 때는 표시 텍스트가 아닌 실제 옵션 값을 전달해야 합니다:

```php
$browser->select('size', 'Large');
```

두 번째 인자를 생략하면 임의의 옵션을 선택할 수 있습니다:

```php
$browser->select('size');
```

두 번째 인자로 배열을 전달하면, 여러 옵션을 선택하도록 할 수 있습니다:

```php
$browser->select('categories', ['Art', 'Music']);
```


#### 체크박스 {#checkboxes}

체크박스 input을 "체크"하려면, `check` 메서드를 사용할 수 있습니다. 다른 입력 관련 메서드와 마찬가지로, 전체 CSS 셀렉터가 필요하지 않습니다. CSS 셀렉터가 일치하지 않으면, Dusk는 일치하는 `name` 속성을 가진 체크박스를 찾습니다:

```php
$browser->check('terms');
```

`uncheck` 메서드는 체크박스 input의 체크를 해제하는 데 사용할 수 있습니다:

```php
$browser->uncheck('terms');
```


#### 라디오 버튼 {#radio-buttons}

`radio` input 옵션을 "선택"하려면, `radio` 메서드를 사용할 수 있습니다. 다른 입력 관련 메서드와 마찬가지로, 전체 CSS 셀렉터가 필요하지 않습니다. CSS 셀렉터가 일치하지 않으면, Dusk는 일치하는 `name` 및 `value` 속성을 가진 `radio` input을 찾습니다:

```php
$browser->radio('size', 'large');
```


### 파일 첨부하기 {#attaching-files}

`attach` 메서드는 `file` input 요소에 파일을 첨부하는 데 사용할 수 있습니다. 다른 입력 관련 메서드와 마찬가지로, 전체 CSS 셀렉터가 필요하지 않습니다. CSS 셀렉터가 일치하지 않으면, Dusk는 일치하는 `name` 속성을 가진 `file` input을 찾습니다:

```php
$browser->attach('photo', __DIR__.'/photos/mountains.png');
```

> [!WARNING]
> attach 함수는 서버에 `Zip` PHP 확장 모듈이 설치되고 활성화되어 있어야 합니다.


### 버튼 누르기 {#pressing-buttons}

`press` 메서드는 페이지의 버튼 요소를 클릭하는 데 사용할 수 있습니다. `press` 메서드에 전달하는 인자는 버튼의 표시 텍스트이거나 CSS / Dusk 셀렉터일 수 있습니다:

```php
$browser->press('Login');
```

폼을 제출할 때, 많은 애플리케이션은 폼 제출 버튼을 누른 후 비활성화하고, 폼 제출의 HTTP 요청이 완료되면 다시 활성화합니다. 버튼을 누르고 버튼이 다시 활성화될 때까지 대기하려면, `pressAndWaitFor` 메서드를 사용할 수 있습니다:

```php
// 버튼을 누르고 최대 5초 동안 활성화될 때까지 대기...
$browser->pressAndWaitFor('Save');

// 버튼을 누르고 최대 1초 동안 활성화될 때까지 대기...
$browser->pressAndWaitFor('Save', 1);
```


### 링크 클릭하기 {#clicking-links}

링크를 클릭하려면, 브라우저 인스턴스의 `clickLink` 메서드를 사용할 수 있습니다. `clickLink` 메서드는 주어진 표시 텍스트를 가진 링크를 클릭합니다:

```php
$browser->clickLink($linkText);
```

`seeLink` 메서드를 사용하여 주어진 표시 텍스트를 가진 링크가 페이지에 표시되는지 확인할 수 있습니다:

```php
if ($browser->seeLink($linkText)) {
    // ...
}
```

> [!WARNING]
> 이 메서드들은 jQuery와 상호작용합니다. 페이지에 jQuery가 없으면, Dusk가 테스트가 실행되는 동안 사용할 수 있도록 자동으로 jQuery를 주입합니다.


### 키보드 사용하기 {#using-the-keyboard}

`keys` 메서드를 사용하면, `type` 메서드로는 불가능한 더 복잡한 입력 시퀀스를 요소에 제공할 수 있습니다. 예를 들어, 값을 입력하는 동안 수정자 키를 누르도록 Dusk에 지시할 수 있습니다. 이 예제에서는, `shift` 키를 누른 채로 `taylor`가 입력되고, 그 후 `swift`는 수정자 키 없이 입력됩니다:

```php
$browser->keys('selector', ['{shift}', 'taylor'], 'swift');
```

`keys` 메서드의 또 다른 유용한 사용 사례는 애플리케이션의 주요 CSS 셀렉터에 "키보드 단축키" 조합을 보내는 것입니다:

```php
$browser->keys('.app', ['{command}', 'j']);
```

> [!NOTE]
> `{command}`와 같은 모든 수정자 키는 `{}` 문자로 감싸며, `Facebook\WebDriver\WebDriverKeys` 클래스에 정의된 상수와 일치합니다. [GitHub에서 확인할 수 있습니다](https://github.com/php-webdriver/php-webdriver/blob/master/lib/WebDriverKeys.php).


#### 유창한 키보드 상호작용 {#fluent-keyboard-interactions}

Dusk는 또한 `withKeyboard` 메서드를 제공하여, `Laravel\Dusk\Keyboard` 클래스를 통해 복잡한 키보드 상호작용을 유창하게 수행할 수 있습니다. `Keyboard` 클래스는 `press`, `release`, `type`, `pause` 메서드를 제공합니다:

```php
use Laravel\Dusk\Keyboard;

$browser->withKeyboard(function (Keyboard $keyboard) {
    $keyboard->press('c')
        ->pause(1000)
        ->release('c')
        ->type(['c', 'e', 'o']);
});
```


#### 키보드 매크로 {#keyboard-macros}

테스트 전체에서 쉽게 재사용할 수 있는 커스텀 키보드 상호작용을 정의하고 싶다면, `Keyboard` 클래스가 제공하는 `macro` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 호출해야 합니다:

```php
<?php

namespace App\Providers;

use Facebook\WebDriver\WebDriverKeys;
use Illuminate\Support\ServiceProvider;
use Laravel\Dusk\Keyboard;
use Laravel\Dusk\OperatingSystem;

class DuskServiceProvider extends ServiceProvider
{
    /**
     * Dusk의 브라우저 매크로 등록.
     */
    public function boot(): void
    {
        Keyboard::macro('copy', function (string $element = null) {
            $this->type([
                OperatingSystem::onMac() ? WebDriverKeys::META : WebDriverKeys::CONTROL, 'c',
            ]);

            return $this;
        });

        Keyboard::macro('paste', function (string $element = null) {
            $this->type([
                OperatingSystem::onMac() ? WebDriverKeys::META : WebDriverKeys::CONTROL, 'v',
            ]);

            return $this;
        });
    }
}
```

`macro` 함수는 첫 번째 인자로 이름, 두 번째 인자로 클로저를 받습니다. 매크로의 클로저는 `Keyboard` 인스턴스에서 해당 매크로를 메서드로 호출할 때 실행됩니다:

```php
$browser->click('@textarea')
    ->withKeyboard(fn (Keyboard $keyboard) => $keyboard->copy())
    ->click('@another-textarea')
    ->withKeyboard(fn (Keyboard $keyboard) => $keyboard->paste());
```


### 마우스 사용하기 {#using-the-mouse}


#### 요소 클릭하기 {#clicking-on-elements}

`click` 메서드는 주어진 CSS 또는 Dusk 셀렉터와 일치하는 요소를 클릭하는 데 사용할 수 있습니다:

```php
$browser->click('.selector');
```

`clickAtXPath` 메서드는 주어진 XPath 표현식과 일치하는 요소를 클릭하는 데 사용할 수 있습니다:

```php
$browser->clickAtXPath('//div[@class = "selector"]');
```

`clickAtPoint` 메서드는 브라우저의 보이는 영역을 기준으로 주어진 좌표에 있는 최상위 요소를 클릭하는 데 사용할 수 있습니다:

```php
$browser->clickAtPoint($x = 0, $y = 0);
```

`doubleClick` 메서드는 마우스의 더블 클릭을 시뮬레이션하는 데 사용할 수 있습니다:

```php
$browser->doubleClick();

$browser->doubleClick('.selector');
```

`rightClick` 메서드는 마우스의 우클릭을 시뮬레이션하는 데 사용할 수 있습니다:

```php
$browser->rightClick();

$browser->rightClick('.selector');
```

`clickAndHold` 메서드는 마우스 버튼을 클릭한 채로 누르고 있는 동작을 시뮬레이션합니다. 이후 `releaseMouse` 메서드를 호출하면 이 동작이 해제됩니다:

```php
$browser->clickAndHold('.selector');

$browser->clickAndHold()
    ->pause(1000)
    ->releaseMouse();
```

`controlClick` 메서드는 브라우저 내에서 `ctrl+click` 이벤트를 시뮬레이션하는 데 사용할 수 있습니다:

```php
$browser->controlClick();

$browser->controlClick('.selector');
```


#### 마우스오버 {#mouseover}

`mouseover` 메서드는 주어진 CSS 또는 Dusk 셀렉터와 일치하는 요소 위로 마우스를 이동해야 할 때 사용할 수 있습니다:

```php
$browser->mouseover('.selector');
```


#### 드래그 앤 드롭 {#drag-drop}

`drag` 메서드는 주어진 셀렉터와 일치하는 요소를 다른 요소로 드래그하는 데 사용할 수 있습니다:

```php
$browser->drag('.from-selector', '.to-selector');
```

또는, 한 방향으로 요소를 드래그할 수 있습니다:

```php
$browser->dragLeft('.selector', $pixels = 10);
$browser->dragRight('.selector', $pixels = 10);
$browser->dragUp('.selector', $pixels = 10);
$browser->dragDown('.selector', $pixels = 10);
```

마지막으로, 주어진 오프셋만큼 요소를 드래그할 수 있습니다:

```php
$browser->dragOffset('.selector', $x = 10, $y = 10);
```


### JavaScript 다이얼로그 {#javascript-dialogs}

Dusk는 JavaScript 다이얼로그와 상호작용할 수 있는 다양한 메서드를 제공합니다. 예를 들어, `waitForDialog` 메서드를 사용하여 JavaScript 다이얼로그가 나타날 때까지 대기할 수 있습니다. 이 메서드는 다이얼로그가 나타날 때까지 대기할 초를 선택적으로 인자로 받습니다:

```php
$browser->waitForDialog($seconds = null);
```

`assertDialogOpened` 메서드는 다이얼로그가 표시되고 주어진 메시지를 포함하는지 어서트할 수 있습니다:

```php
$browser->assertDialogOpened('Dialog message');
```

JavaScript 다이얼로그에 프롬프트가 있다면, `typeInDialog` 메서드를 사용하여 프롬프트에 값을 입력할 수 있습니다:

```php
$browser->typeInDialog('Hello World');
```

열려 있는 JavaScript 다이얼로그의 "확인" 버튼을 클릭하여 닫으려면, `acceptDialog` 메서드를 호출하세요:

```php
$browser->acceptDialog();
```

열려 있는 JavaScript 다이얼로그의 "취소" 버튼을 클릭하여 닫으려면, `dismissDialog` 메서드를 호출하세요:

```php
$browser->dismissDialog();
```


### 인라인 프레임과 상호작용하기 {#interacting-with-iframes}

iframe 내의 요소와 상호작용해야 한다면, `withinFrame` 메서드를 사용할 수 있습니다. `withinFrame` 메서드에 제공된 클로저 내에서 이루어지는 모든 요소 상호작용은 지정된 iframe의 컨텍스트로 범위가 지정됩니다:

```php
$browser->withinFrame('#credit-card-details', function ($browser) {
    $browser->type('input[name="cardnumber"]', '4242424242424242')
        ->type('input[name="exp-date"]', '1224')
        ->type('input[name="cvc"]', '123')
        ->press('Pay');
});
```


### 셀렉터 범위 지정 {#scoping-selectors}

때로는 주어진 셀렉터 내에서 모든 작업의 범위를 지정하여 여러 작업을 수행하고 싶을 수 있습니다. 예를 들어, 어떤 텍스트가 테이블 내에만 존재하는지 어서트한 후, 해당 테이블 내의 버튼을 클릭하고 싶을 수 있습니다. 이를 위해 `with` 메서드를 사용할 수 있습니다. `with` 메서드에 제공된 클로저 내에서 수행되는 모든 작업은 원래 셀렉터로 범위가 지정됩니다:

```php
$browser->with('.table', function (Browser $table) {
    $table->assertSee('Hello World')
        ->clickLink('Delete');
});
```

가끔 현재 범위 밖에서 어서션을 실행해야 할 수도 있습니다. 이럴 때는 `elsewhere` 및 `elsewhereWhenAvailable` 메서드를 사용할 수 있습니다:

```php
$browser->with('.table', function (Browser $table) {
    // 현재 범위는 `body .table`...

    $browser->elsewhere('.page-title', function (Browser $title) {
        // 현재 범위는 `body .page-title`...
        $title->assertSee('Hello World');
    });

    $browser->elsewhereWhenAvailable('.page-title', function (Browser $title) {
        // 현재 범위는 `body .page-title`...
        $title->assertSee('Hello World');
    });
});
```


### 요소 대기 {#waiting-for-elements}

JavaScript를 많이 사용하는 애플리케이션을 테스트할 때, 테스트를 진행하기 전에 특정 요소나 데이터가 준비될 때까지 "대기"해야 할 필요가 자주 생깁니다. Dusk는 이를 매우 쉽게 처리할 수 있습니다. 다양한 메서드를 사용하여, 페이지에 요소가 표시될 때까지 또는 주어진 JavaScript 표현식이 `true`가 될 때까지 대기할 수 있습니다.


#### 대기 {#waiting}

테스트를 주어진 밀리초만큼 일시정지해야 한다면, `pause` 메서드를 사용하세요:

```php
$browser->pause(1000);
```

주어진 조건이 `true`일 때만 테스트를 일시정지해야 한다면, `pauseIf` 메서드를 사용하세요:

```php
$browser->pauseIf(App::environment('production'), 1000);
```

마찬가지로, 주어진 조건이 `true`가 아니면 테스트를 일시정지해야 한다면, `pauseUnless` 메서드를 사용할 수 있습니다:

```php
$browser->pauseUnless(App::environment('testing'), 1000);
```


#### 셀렉터 대기 {#waiting-for-selectors}

`waitFor` 메서드는 주어진 CSS 또는 Dusk 셀렉터와 일치하는 요소가 페이지에 표시될 때까지 테스트 실행을 일시정지하는 데 사용할 수 있습니다. 기본적으로, 이 메서드는 최대 5초 동안 대기한 후 예외를 발생시킵니다. 필요하다면, 두 번째 인자로 커스텀 타임아웃을 전달할 수 있습니다:

```php
// 셀렉터를 최대 5초 동안 대기...
$browser->waitFor('.selector');

// 셀렉터를 최대 1초 동안 대기...
$browser->waitFor('.selector', 1);
```

주어진 셀렉터와 일치하는 요소가 주어진 텍스트를 포함할 때까지 대기할 수도 있습니다:

```php
// 셀렉터가 주어진 텍스트를 포함할 때까지 최대 5초 대기...
$browser->waitForTextIn('.selector', 'Hello World');

// 셀렉터가 주어진 텍스트를 포함할 때까지 최대 1초 대기...
$browser->waitForTextIn('.selector', 'Hello World', 1);
```

주어진 셀렉터와 일치하는 요소가 페이지에서 사라질 때까지 대기할 수도 있습니다:

```php
// 셀렉터가 사라질 때까지 최대 5초 대기...
$browser->waitUntilMissing('.selector');

// 셀렉터가 사라질 때까지 최대 1초 대기...
$browser->waitUntilMissing('.selector', 1);
```

또는, 주어진 셀렉터와 일치하는 요소가 활성화되거나 비활성화될 때까지 대기할 수 있습니다:

```php
// 셀렉터가 활성화될 때까지 최대 5초 대기...
$browser->waitUntilEnabled('.selector');

// 셀렉터가 활성화될 때까지 최대 1초 대기...
$browser->waitUntilEnabled('.selector', 1);

// 셀렉터가 비활성화될 때까지 최대 5초 대기...
$browser->waitUntilDisabled('.selector');

// 셀렉터가 비활성화될 때까지 최대 1초 대기...
$browser->waitUntilDisabled('.selector', 1);
```


#### 셀렉터가 사용 가능할 때 범위 지정 {#scoping-selectors-when-available}

때로는 주어진 셀렉터와 일치하는 요소가 나타날 때까지 대기한 후, 해당 요소와 상호작용하고 싶을 수 있습니다. 예를 들어, 모달 창이 나타날 때까지 대기한 후, 모달 내에서 "OK" 버튼을 누르고 싶을 수 있습니다. 이를 위해 `whenAvailable` 메서드를 사용할 수 있습니다. 클로저 내에서 수행되는 모든 요소 작업은 원래 셀렉터로 범위가 지정됩니다:

```php
$browser->whenAvailable('.modal', function (Browser $modal) {
    $modal->assertSee('Hello World')
        ->press('OK');
});
```


#### 텍스트 대기 {#waiting-for-text}

`waitForText` 메서드는 주어진 텍스트가 페이지에 표시될 때까지 대기하는 데 사용할 수 있습니다:

```php
// 텍스트가 표시될 때까지 최대 5초 대기...
$browser->waitForText('Hello World');

// 텍스트가 표시될 때까지 최대 1초 대기...
$browser->waitForText('Hello World', 1);
```

`waitUntilMissingText` 메서드를 사용하여 표시된 텍스트가 페이지에서 사라질 때까지 대기할 수 있습니다:

```php
// 텍스트가 사라질 때까지 최대 5초 대기...
$browser->waitUntilMissingText('Hello World');

// 텍스트가 사라질 때까지 최대 1초 대기...
$browser->waitUntilMissingText('Hello World', 1);
```


#### 링크 대기 {#waiting-for-links}

`waitForLink` 메서드는 주어진 링크 텍스트가 페이지에 표시될 때까지 대기하는 데 사용할 수 있습니다:

```php
// 링크가 표시될 때까지 최대 5초 대기...
$browser->waitForLink('Create');

// 링크가 표시될 때까지 최대 1초 대기...
$browser->waitForLink('Create', 1);
```


#### 입력 필드 대기 {#waiting-for-inputs}

`waitForInput` 메서드는 주어진 입력 필드가 페이지에 표시될 때까지 대기하는 데 사용할 수 있습니다:

```php
// 입력 필드가 표시될 때까지 최대 5초 대기...
$browser->waitForInput($field);

// 입력 필드가 표시될 때까지 최대 1초 대기...
$browser->waitForInput($field, 1);
```


#### 페이지 위치 대기 {#waiting-on-the-page-location}

`$browser->assertPathIs('/home')`와 같은 경로 어서션을 할 때, `window.location.pathname`이 비동기적으로 업데이트되고 있다면 어서션이 실패할 수 있습니다. `waitForLocation` 메서드를 사용하여 위치가 주어진 값이 될 때까지 대기할 수 있습니다:

```php
$browser->waitForLocation('/secret');
```

`waitForLocation` 메서드는 현재 창의 위치가 완전한 URL이 될 때까지 대기하는 데도 사용할 수 있습니다:

```php
$browser->waitForLocation('https://example.com/path');
```

[이름이 지정된 라우트](/laravel/12.x/routing#named-routes)의 위치를 대기할 수도 있습니다:

```php
$browser->waitForRoute($routeName, $parameters);
```


#### 페이지 리로드 대기 {#waiting-for-page-reloads}

어떤 동작을 수행한 후 페이지가 리로드될 때까지 대기해야 한다면, `waitForReload` 메서드를 사용하세요:

```php
use Laravel\Dusk\Browser;

$browser->waitForReload(function (Browser $browser) {
    $browser->press('Submit');
})
->assertSee('Success!');
```

일반적으로 버튼을 클릭한 후 페이지가 리로드될 때 대기해야 하므로, 편의를 위해 `clickAndWaitForReload` 메서드를 사용할 수 있습니다:

```php
$browser->clickAndWaitForReload('.selector')
    ->assertSee('something');
```


#### JavaScript 표현식 대기 {#waiting-on-javascript-expressions}

때로는 주어진 JavaScript 표현식이 `true`가 될 때까지 테스트 실행을 일시정지하고 싶을 수 있습니다. `waitUntil` 메서드를 사용하여 쉽게 처리할 수 있습니다. 이 메서드에 표현식을 전달할 때는 `return` 키워드나 세미콜론을 포함할 필요가 없습니다:

```php
// 표현식이 true가 될 때까지 최대 5초 대기...
$browser->waitUntil('App.data.servers.length > 0');

// 표현식이 true가 될 때까지 최대 1초 대기...
$browser->waitUntil('App.data.servers.length > 0', 1);
```


#### Vue 표현식 대기 {#waiting-on-vue-expressions}

`waitUntilVue` 및 `waitUntilVueIsNot` 메서드는 [Vue 컴포넌트](https://vuejs.org) 속성이 주어진 값을 가질 때까지 대기하는 데 사용할 수 있습니다:

```php
// 컴포넌트 속성이 주어진 값을 가질 때까지 대기...
$browser->waitUntilVue('user.name', 'Taylor', '@user');

// 컴포넌트 속성이 주어진 값을 가지지 않을 때까지 대기...
$browser->waitUntilVueIsNot('user.name', null, '@user');
```


#### JavaScript 이벤트 대기 {#waiting-for-javascript-events}

`waitForEvent` 메서드는 JavaScript 이벤트가 발생할 때까지 테스트 실행을 일시정지하는 데 사용할 수 있습니다:

```php
$browser->waitForEvent('load');
```

이벤트 리스너는 기본적으로 현재 범위, 즉 `body` 요소에 연결됩니다. 범위가 지정된 셀렉터를 사용할 때는, 이벤트 리스너가 일치하는 요소에 연결됩니다:

```php
$browser->with('iframe', function (Browser $iframe) {
    // iframe의 load 이벤트를 대기...
    $iframe->waitForEvent('load');
});
```

`waitForEvent` 메서드의 두 번째 인자로 셀렉터를 제공하여 특정 요소에 이벤트 리스너를 연결할 수도 있습니다:

```php
$browser->waitForEvent('load', '.selector');
```

`document` 및 `window` 객체의 이벤트도 대기할 수 있습니다:

```php
// document가 스크롤될 때까지 대기...
$browser->waitForEvent('scroll', 'document');

// window가 리사이즈될 때까지 최대 5초 대기...
$browser->waitForEvent('resize', 'window', 5);
```


#### 콜백과 함께 대기 {#waiting-with-a-callback}

Dusk의 많은 "wait" 메서드는 내부적으로 `waitUsing` 메서드를 사용합니다. 이 메서드를 직접 사용하여, 주어진 클로저가 `true`를 반환할 때까지 대기할 수 있습니다. `waitUsing` 메서드는 대기할 최대 초, 클로저를 평가할 간격, 클로저, 그리고 선택적 실패 메시지를 인자로 받습니다:

```php
$browser->waitUsing(10, 1, function () use ($something) {
    return $something->isReady();
}, "Something wasn't ready in time.");
```


### 요소를 뷰로 스크롤 {#scrolling-an-element-into-view}

때로는 요소가 브라우저의 보이는 영역 밖에 있어서 클릭할 수 없을 수 있습니다. `scrollIntoView` 메서드는 주어진 셀렉터의 요소가 뷰 내에 들어올 때까지 브라우저 창을 스크롤합니다:

```php
$browser->scrollIntoView('.selector')
    ->click('.selector');
```


## 사용 가능한 어서션 {#available-assertions}

Dusk는 애플리케이션에 대해 다양한 어서션을 제공합니다. 사용 가능한 모든 어서션은 아래 목록에 문서화되어 있습니다:

<style>
    .collection-method-list > p {
        columns: 10.8em 3; -moz-columns: 10.8em 3; -webkit-columns: 10.8em 3;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<div class="collection-method-list" markdown="1">

[assertTitle](#assert-title)
[assertTitleContains](#assert-title-contains)
[assertUrlIs](#assert-url-is)
[assertSchemeIs](#assert-scheme-is)
[assertSchemeIsNot](#assert-scheme-is-not)
[assertHostIs](#assert-host-is)
[assertHostIsNot](#assert-host-is-not)
[assertPortIs](#assert-port-is)
[assertPortIsNot](#assert-port-is-not)
[assertPathBeginsWith](#assert-path-begins-with)
[assertPathEndsWith](#assert-path-ends-with)
[assertPathContains](#assert-path-contains)
[assertPathIs](#assert-path-is)
[assertPathIsNot](#assert-path-is-not)
[assertRouteIs](#assert-route-is)
[assertQueryStringHas](#assert-query-string-has)
[assertQueryStringMissing](#assert-query-string-missing)
[assertFragmentIs](#assert-fragment-is)
[assertFragmentBeginsWith](#assert-fragment-begins-with)
[assertFragmentIsNot](#assert-fragment-is-not)
[assertHasCookie](#assert-has-cookie)
[assertHasPlainCookie](#assert-has-plain-cookie)
[assertCookieMissing](#assert-cookie-missing)
[assertPlainCookieMissing](#assert-plain-cookie-missing)
[assertCookieValue](#assert-cookie-value)
[assertPlainCookieValue](#assert-plain-cookie-value)
[assertSee](#assert-see)
[assertDontSee](#assert-dont-see)
[assertSeeIn](#assert-see-in)
[assertDontSeeIn](#assert-dont-see-in)
[assertSeeAnythingIn](#assert-see-anything-in)
[assertSeeNothingIn](#assert-see-nothing-in)
[assertCount](#assert-count)
[assertScript](#assert-script)
[assertSourceHas](#assert-source-has)
[assertSourceMissing](#assert-source-missing)
[assertSeeLink](#assert-see-link)
[assertDontSeeLink](#assert-dont-see-link)
[assertInputValue](#assert-input-value)
[assertInputValueIsNot](#assert-input-value-is-not)
[assertChecked](#assert-checked)
[assertNotChecked](#assert-not-checked)
[assertIndeterminate](#assert-indeterminate)
[assertRadioSelected](#assert-radio-selected)
[assertRadioNotSelected](#assert-radio-not-selected)
[assertSelected](#assert-selected)
[assertNotSelected](#assert-not-selected)
[assertSelectHasOptions](#assert-select-has-options)
[assertSelectMissingOptions](#assert-select-missing-options)
[assertSelectHasOption](#assert-select-has-option)
[assertSelectMissingOption](#assert-select-missing-option)
[assertValue](#assert-value)
[assertValueIsNot](#assert-value-is-not)
[assertAttribute](#assert-attribute)
[assertAttributeMissing](#assert-attribute-missing)
[assertAttributeContains](#assert-attribute-contains)
[assertAttributeDoesntContain](#assert-attribute-doesnt-contain)
[assertAriaAttribute](#assert-aria-attribute)
[assertDataAttribute](#assert-data-attribute)
[assertVisible](#assert-visible)
[assertPresent](#assert-present)
[assertNotPresent](#assert-not-present)
[assertMissing](#assert-missing)
[assertInputPresent](#assert-input-present)
[assertInputMissing](#assert-input-missing)
[assertDialogOpened](#assert-dialog-opened)
[assertEnabled](#assert-enabled)
[assertDisabled](#assert-disabled)
[assertButtonEnabled](#assert-button-enabled)
[assertButtonDisabled](#assert-button-disabled)
[assertFocused](#assert-focused)
[assertNotFocused](#assert-not-focused)
[assertAuthenticated](#assert-authenticated)
[assertGuest](#assert-guest)
[assertAuthenticatedAs](#assert-authenticated-as)
[assertVue](#assert-vue)
[assertVueIsNot](#assert-vue-is-not)
[assertVueContains](#assert-vue-contains)
[assertVueDoesntContain](#assert-vue-doesnt-contain)

</div>


#### assertTitle {#assert-title}

페이지 제목이 주어진 텍스트와 일치하는지 어서트합니다:

```php
$browser->assertTitle($title);
```


#### assertTitleContains {#assert-title-contains}

페이지 제목이 주어진 텍스트를 포함하는지 어서트합니다:

```php
$browser->assertTitleContains($title);
```


#### assertUrlIs {#assert-url-is}

현재 URL(쿼리 스트링 제외)이 주어진 문자열과 일치하는지 어서트합니다:

```php
$browser->assertUrlIs($url);
```


#### assertSchemeIs {#assert-scheme-is}

현재 URL 스킴이 주어진 스킴과 일치하는지 어서트합니다:

```php
$browser->assertSchemeIs($scheme);
```


#### assertSchemeIsNot {#assert-scheme-is-not}

현재 URL 스킴이 주어진 스킴과 일치하지 않는지 어서트합니다:

```php
$browser->assertSchemeIsNot($scheme);
```


#### assertHostIs {#assert-host-is}

현재 URL 호스트가 주어진 호스트와 일치하는지 어서트합니다:

```php
$browser->assertHostIs($host);
```


#### assertHostIsNot {#assert-host-is-not}

현재 URL 호스트가 주어진 호스트와 일치하지 않는지 어서트합니다:

```php
$browser->assertHostIsNot($host);
```


#### assertPortIs {#assert-port-is}

현재 URL 포트가 주어진 포트와 일치하는지 어서트합니다:

```php
$browser->assertPortIs($port);
```


#### assertPortIsNot {#assert-port-is-not}

현재 URL 포트가 주어진 포트와 일치하지 않는지 어서트합니다:

```php
$browser->assertPortIsNot($port);
```


#### assertPathBeginsWith {#assert-path-begins-with}

현재 URL 경로가 주어진 경로로 시작하는지 어서트합니다:

```php
$browser->assertPathBeginsWith('/home');
```


#### assertPathEndsWith {#assert-path-ends-with}

현재 URL 경로가 주어진 경로로 끝나는지 어서트합니다:

```php
$browser->assertPathEndsWith('/home');
```


#### assertPathContains {#assert-path-contains}

현재 URL 경로가 주어진 경로를 포함하는지 어서트합니다:

```php
$browser->assertPathContains('/home');
```


#### assertPathIs {#assert-path-is}

현재 경로가 주어진 경로와 일치하는지 어서트합니다:

```php
$browser->assertPathIs('/home');
```


#### assertPathIsNot {#assert-path-is-not}

현재 경로가 주어진 경로와 일치하지 않는지 어서트합니다:

```php
$browser->assertPathIsNot('/home');
```


#### assertRouteIs {#assert-route-is}

현재 URL이 주어진 [이름이 지정된 라우트](/laravel/12.x/routing#named-routes)의 URL과 일치하는지 어서트합니다:

```php
$browser->assertRouteIs($name, $parameters);
```


#### assertQueryStringHas {#assert-query-string-has}

주어진 쿼리 스트링 파라미터가 존재하는지 어서트합니다:

```php
$browser->assertQueryStringHas($name);
```

주어진 쿼리 스트링 파라미터가 존재하고 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertQueryStringHas($name, $value);
```


#### assertQueryStringMissing {#assert-query-string-missing}

주어진 쿼리 스트링 파라미터가 없는지 어서트합니다:

```php
$browser->assertQueryStringMissing($name);
```


#### assertFragmentIs {#assert-fragment-is}

URL의 현재 해시 프래그먼트가 주어진 프래그먼트와 일치하는지 어서트합니다:

```php
$browser->assertFragmentIs('anchor');
```


#### assertFragmentBeginsWith {#assert-fragment-begins-with}

URL의 현재 해시 프래그먼트가 주어진 프래그먼트로 시작하는지 어서트합니다:

```php
$browser->assertFragmentBeginsWith('anchor');
```


#### assertFragmentIsNot {#assert-fragment-is-not}

URL의 현재 해시 프래그먼트가 주어진 프래그먼트와 일치하지 않는지 어서트합니다:

```php
$browser->assertFragmentIsNot('anchor');
```


#### assertHasCookie {#assert-has-cookie}

주어진 암호화된 쿠키가 존재하는지 어서트합니다:

```php
$browser->assertHasCookie($name);
```


#### assertHasPlainCookie {#assert-has-plain-cookie}

주어진 암호화되지 않은 쿠키가 존재하는지 어서트합니다:

```php
$browser->assertHasPlainCookie($name);
```


#### assertCookieMissing {#assert-cookie-missing}

주어진 암호화된 쿠키가 존재하지 않는지 어서트합니다:

```php
$browser->assertCookieMissing($name);
```


#### assertPlainCookieMissing {#assert-plain-cookie-missing}

주어진 암호화되지 않은 쿠키가 존재하지 않는지 어서트합니다:

```php
$browser->assertPlainCookieMissing($name);
```


#### assertCookieValue {#assert-cookie-value}

암호화된 쿠키가 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertCookieValue($name, $value);
```


#### assertPlainCookieValue {#assert-plain-cookie-value}

암호화되지 않은 쿠키가 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertPlainCookieValue($name, $value);
```


#### assertSee {#assert-see}

주어진 텍스트가 페이지에 존재하는지 어서트합니다:

```php
$browser->assertSee($text);
```


#### assertDontSee {#assert-dont-see}

주어진 텍스트가 페이지에 존재하지 않는지 어서트합니다:

```php
$browser->assertDontSee($text);
```


#### assertSeeIn {#assert-see-in}

주어진 텍스트가 셀렉터 내에 존재하는지 어서트합니다:

```php
$browser->assertSeeIn($selector, $text);
```


#### assertDontSeeIn {#assert-dont-see-in}

주어진 텍스트가 셀렉터 내에 존재하지 않는지 어서트합니다:

```php
$browser->assertDontSeeIn($selector, $text);
```


#### assertSeeAnythingIn {#assert-see-anything-in}

어떤 텍스트라도 셀렉터 내에 존재하는지 어서트합니다:

```php
$browser->assertSeeAnythingIn($selector);
```


#### assertSeeNothingIn {#assert-see-nothing-in}

어떤 텍스트도 셀렉터 내에 존재하지 않는지 어서트합니다:

```php
$browser->assertSeeNothingIn($selector);
```


#### assertCount {#assert-count}

주어진 셀렉터와 일치하는 요소가 지정된 횟수만큼 나타나는지 어서트합니다:

```php
$browser->assertCount($selector, $count);
```


#### assertScript {#assert-script}

주어진 JavaScript 표현식이 주어진 값과 일치하는지 어서트합니다:

```php
$browser->assertScript('window.isLoaded')
    ->assertScript('document.readyState', 'complete');
```


#### assertSourceHas {#assert-source-has}

주어진 소스 코드가 페이지에 존재하는지 어서트합니다:

```php
$browser->assertSourceHas($code);
```


#### assertSourceMissing {#assert-source-missing}

주어진 소스 코드가 페이지에 존재하지 않는지 어서트합니다:

```php
$browser->assertSourceMissing($code);
```


#### assertSeeLink {#assert-see-link}

주어진 링크가 페이지에 존재하는지 어서트합니다:

```php
$browser->assertSeeLink($linkText);
```


#### assertDontSeeLink {#assert-dont-see-link}

주어진 링크가 페이지에 존재하지 않는지 어서트합니다:

```php
$browser->assertDontSeeLink($linkText);
```


#### assertInputValue {#assert-input-value}

주어진 입력 필드가 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertInputValue($field, $value);
```


#### assertInputValueIsNot {#assert-input-value-is-not}

주어진 입력 필드가 주어진 값을 가지지 않는지 어서트합니다:

```php
$browser->assertInputValueIsNot($field, $value);
```


#### assertChecked {#assert-checked}

주어진 체크박스가 체크되어 있는지 어서트합니다:

```php
$browser->assertChecked($field);
```


#### assertNotChecked {#assert-not-checked}

주어진 체크박스가 체크되어 있지 않은지 어서트합니다:

```php
$browser->assertNotChecked($field);
```


#### assertIndeterminate {#assert-indeterminate}

주어진 체크박스가 불확정(indeterminate) 상태인지 어서트합니다:

```php
$browser->assertIndeterminate($field);
```


#### assertRadioSelected {#assert-radio-selected}

주어진 라디오 필드가 선택되어 있는지 어서트합니다:

```php
$browser->assertRadioSelected($field, $value);
```


#### assertRadioNotSelected {#assert-radio-not-selected}

주어진 라디오 필드가 선택되어 있지 않은지 어서트합니다:

```php
$browser->assertRadioNotSelected($field, $value);
```


#### assertSelected {#assert-selected}

주어진 드롭다운이 주어진 값이 선택되어 있는지 어서트합니다:

```php
$browser->assertSelected($field, $value);
```


#### assertNotSelected {#assert-not-selected}

주어진 드롭다운이 주어진 값이 선택되어 있지 않은지 어서트합니다:

```php
$browser->assertNotSelected($field, $value);
```


#### assertSelectHasOptions {#assert-select-has-options}

주어진 값 배열이 선택 가능 옵션으로 존재하는지 어서트합니다:

```php
$browser->assertSelectHasOptions($field, $values);
```


#### assertSelectMissingOptions {#assert-select-missing-options}

주어진 값 배열이 선택 가능 옵션으로 존재하지 않는지 어서트합니다:

```php
$browser->assertSelectMissingOptions($field, $values);
```


#### assertSelectHasOption {#assert-select-has-option}

주어진 값이 해당 필드에서 선택 가능 옵션으로 존재하는지 어서트합니다:

```php
$browser->assertSelectHasOption($field, $value);
```


#### assertSelectMissingOption {#assert-select-missing-option}

주어진 값이 선택 가능 옵션으로 존재하지 않는지 어서트합니다:

```php
$browser->assertSelectMissingOption($field, $value);
```


#### assertValue {#assert-value}

주어진 셀렉터와 일치하는 요소가 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertValue($selector, $value);
```


#### assertValueIsNot {#assert-value-is-not}

주어진 셀렉터와 일치하는 요소가 주어진 값을 가지지 않는지 어서트합니다:

```php
$browser->assertValueIsNot($selector, $value);
```


#### assertAttribute {#assert-attribute}

주어진 셀렉터와 일치하는 요소가 주어진 속성에 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertAttribute($selector, $attribute, $value);
```


#### assertAttributeMissing {#assert-attribute-missing}

주어진 셀렉터와 일치하는 요소가 주어진 속성을 가지지 않는지 어서트합니다:

```php
$browser->assertAttributeMissing($selector, $attribute);
```


#### assertAttributeContains {#assert-attribute-contains}

주어진 셀렉터와 일치하는 요소가 주어진 속성에 주어진 값을 포함하는지 어서트합니다:

```php
$browser->assertAttributeContains($selector, $attribute, $value);
```


#### assertAttributeDoesntContain {#assert-attribute-doesnt-contain}

주어진 셀렉터와 일치하는 요소가 주어진 속성에 주어진 값을 포함하지 않는지 어서트합니다:

```php
$browser->assertAttributeDoesntContain($selector, $attribute, $value);
```


#### assertAriaAttribute {#assert-aria-attribute}

주어진 셀렉터와 일치하는 요소가 주어진 aria 속성에 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertAriaAttribute($selector, $attribute, $value);
```

예를 들어, `<button aria-label="Add"></button>` 마크업이 있다면, 아래와 같이 `aria-label` 속성을 어서트할 수 있습니다:

```php
$browser->assertAriaAttribute('button', 'label', 'Add')
```


#### assertDataAttribute {#assert-data-attribute}

주어진 셀렉터와 일치하는 요소가 주어진 data 속성에 주어진 값을 가지는지 어서트합니다:

```php
$browser->assertDataAttribute($selector, $attribute, $value);
```

예를 들어, `<tr id="row-1" data-content="attendees"></tr>` 마크업이 있다면, 아래와 같이 `data-label` 속성을 어서트할 수 있습니다:

```php
$browser->assertDataAttribute('#row-1', 'content', 'attendees')
```


#### assertVisible {#assert-visible}

주어진 셀렉터와 일치하는 요소가 보이는지 어서트합니다:

```php
$browser->assertVisible($selector);
```


#### assertPresent {#assert-present}

주어진 셀렉터와 일치하는 요소가 소스에 존재하는지 어서트합니다:

```php
$browser->assertPresent($selector);
```


#### assertNotPresent {#assert-not-present}

주어진 셀렉터와 일치하는 요소가 소스에 존재하지 않는지 어서트합니다:

```php
$browser->assertNotPresent($selector);
```


#### assertMissing {#assert-missing}

주어진 셀렉터와 일치하는 요소가 보이지 않는지 어서트합니다:

```php
$browser->assertMissing($selector);
```


#### assertInputPresent {#assert-input-present}

주어진 이름을 가진 input이 존재하는지 어서트합니다:

```php
$browser->assertInputPresent($name);
```


#### assertInputMissing {#assert-input-missing}

주어진 이름을 가진 input이 소스에 존재하지 않는지 어서트합니다:

```php
$browser->assertInputMissing($name);
```


#### assertDialogOpened {#assert-dialog-opened}

주어진 메시지를 가진 JavaScript 다이얼로그가 열렸는지 어서트합니다:

```php
$browser->assertDialogOpened($message);
```


#### assertEnabled {#assert-enabled}

주어진 필드가 활성화되어 있는지 어서트합니다:

```php
$browser->assertEnabled($field);
```


#### assertDisabled {#assert-disabled}

주어진 필드가 비활성화되어 있는지 어서트합니다:

```php
$browser->assertDisabled($field);
```


#### assertButtonEnabled {#assert-button-enabled}

주어진 버튼이 활성화되어 있는지 어서트합니다:

```php
$browser->assertButtonEnabled($button);
```


#### assertButtonDisabled {#assert-button-disabled}

주어진 버튼이 비활성화되어 있는지 어서트합니다:

```php
$browser->assertButtonDisabled($button);
```


#### assertFocused {#assert-focused}

주어진 필드가 포커스되어 있는지 어서트합니다:

```php
$browser->assertFocused($field);
```


#### assertNotFocused {#assert-not-focused}

주어진 필드가 포커스되어 있지 않은지 어서트합니다:

```php
$browser->assertNotFocused($field);
```


#### assertAuthenticated {#assert-authenticated}

사용자가 인증되어 있는지 어서트합니다:

```php
$browser->assertAuthenticated();
```


#### assertGuest {#assert-guest}

사용자가 인증되어 있지 않은지 어서트합니다:

```php
$browser->assertGuest();
```


#### assertAuthenticatedAs {#assert-authenticated-as}

사용자가 주어진 사용자로 인증되어 있는지 어서트합니다:

```php
$browser->assertAuthenticatedAs($user);
```


#### assertVue {#assert-vue}

Dusk는 [Vue 컴포넌트](https://vuejs.org) 데이터의 상태에 대해 어서션을 할 수 있습니다. 예를 들어, 애플리케이션에 다음과 같은 Vue 컴포넌트가 있다고 가정해봅시다:
```html
    // HTML...

    <profile dusk="profile-component"></profile>

    // 컴포넌트 정의...

    Vue.component('profile', {
        template: '<div>{{ user.name }}</div>',

        data: function () {
            return {
                user: {
                    name: 'Taylor'
                }
            };
        }
    });
```
아래와 같이 Vue 컴포넌트의 상태를 어서트할 수 있습니다:
::: code-group
```php [Pest]
test('vue', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/')
            ->assertVue('user.name', 'Taylor', '@profile-component');
    });
});
```

```php [PHPUnit]
/**
 * 기본 Vue 테스트 예제.
 */
public function test_vue(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit('/')
            ->assertVue('user.name', 'Taylor', '@profile-component');
    });
}
```
:::

#### assertVueIsNot {#assert-vue-is-not}

주어진 Vue 컴포넌트 데이터 속성이 주어진 값과 일치하지 않는지 어서트합니다:

```php
$browser->assertVueIsNot($property, $value, $componentSelector = null);
```


#### assertVueContains {#assert-vue-contains}

주어진 Vue 컴포넌트 데이터 속성이 배열이고, 주어진 값을 포함하는지 어서트합니다:

```php
$browser->assertVueContains($property, $value, $componentSelector = null);
```


#### assertVueDoesntContain {#assert-vue-doesnt-contain}

주어진 Vue 컴포넌트 데이터 속성이 배열이고, 주어진 값을 포함하지 않는지 어서트합니다:

```php
$browser->assertVueDoesntContain($property, $value, $componentSelector = null);
```


## 페이지 {#pages}

때로는 테스트에서 여러 복잡한 작업을 순차적으로 수행해야 할 수 있습니다. 이렇게 하면 테스트가 읽기 어렵고 이해하기 어려워질 수 있습니다. Dusk 페이지를 사용하면, 주어진 페이지에서 단일 메서드로 수행할 수 있는 표현력 있는 작업을 정의할 수 있습니다. 또한, 애플리케이션 또는 단일 페이지에서 자주 사용하는 셀렉터에 대한 단축키를 정의할 수 있습니다.


### 페이지 생성하기 {#generating-pages}

페이지 객체를 생성하려면, `dusk:page` Artisan 명령어를 실행하세요. 모든 페이지 객체는 애플리케이션의 `tests/Browser/Pages` 디렉터리에 생성됩니다:

```shell
php artisan dusk:page Login
```


### 페이지 설정하기 {#configuring-pages}

기본적으로 페이지에는 세 가지 메서드가 있습니다: `url`, `assert`, `elements`. 지금은 `url`과 `assert` 메서드에 대해 설명하겠습니다. `elements` 메서드는 [아래에서 더 자세히 설명합니다](#shorthand-selectors).


#### `url` 메서드 {#the-url-method}

`url` 메서드는 페이지를 나타내는 URL의 경로를 반환해야 합니다. Dusk는 브라우저에서 페이지로 이동할 때 이 URL을 사용합니다:

```php
/**
 * 페이지의 URL을 가져옵니다.
 */
public function url(): string
{
    return '/login';
}
```


#### `assert` 메서드 {#the-assert-method}

`assert` 메서드는 브라우저가 실제로 주어진 페이지에 있는지 확인하는 데 필요한 어서션을 수행할 수 있습니다. 이 메서드에 아무것도 넣을 필요는 없지만, 원한다면 어서션을 자유롭게 추가할 수 있습니다. 이 어서션은 페이지로 이동할 때 자동으로 실행됩니다:

```php
/**
 * 브라우저가 페이지에 있는지 어서트합니다.
 */
public function assert(Browser $browser): void
{
    $browser->assertPathIs($this->url());
}
```


### 페이지로 이동하기 {#navigating-to-pages}

페이지가 정의되면, `visit` 메서드를 사용하여 해당 페이지로 이동할 수 있습니다:

```php
use Tests\Browser\Pages\Login;

$browser->visit(new Login);
```

이미 주어진 페이지에 있고, 현재 테스트 컨텍스트에 페이지의 셀렉터와 메서드를 "로드"해야 할 때가 있습니다. 이는 버튼을 누르고 명시적으로 이동하지 않고 특정 페이지로 리디렉션될 때 일반적입니다. 이 경우, `on` 메서드를 사용하여 페이지를 로드할 수 있습니다:

```php
use Tests\Browser\Pages\CreatePlaylist;

$browser->visit('/dashboard')
    ->clickLink('Create Playlist')
    ->on(new CreatePlaylist)
    ->assertSee('@create');
```


### 단축 셀렉터 {#shorthand-selectors}

페이지 클래스 내의 `elements` 메서드를 사용하면, 페이지의 어떤 CSS 셀렉터에 대해서도 빠르고 기억하기 쉬운 단축키를 정의할 수 있습니다. 예를 들어, 애플리케이션 로그인 페이지의 "email" 입력 필드에 대한 단축키를 정의해봅시다:

```php
/**
 * 페이지의 요소 단축키를 가져옵니다.
 *
 * @return array<string, string>
 */
public function elements(): array
{
    return [
        '@email' => 'input[name=email]',
    ];
}
```

단축키가 정의되면, 전체 CSS 셀렉터를 사용할 수 있는 모든 곳에서 단축 셀렉터를 사용할 수 있습니다:

```php
$browser->type('@email', 'taylor@laravel.com');
```


#### 전역 단축 셀렉터 {#global-shorthand-selectors}

Dusk를 설치하면, 기본 `Page` 클래스가 `tests/Browser/Pages` 디렉터리에 생성됩니다. 이 클래스에는 애플리케이션 전체의 모든 페이지에서 사용할 수 있는 전역 단축 셀렉터를 정의할 수 있는 `siteElements` 메서드가 있습니다:

```php
/**
 * 사이트의 전역 요소 단축키를 가져옵니다.
 *
 * @return array<string, string>
 */
public static function siteElements(): array
{
    return [
        '@element' => '#selector',
    ];
}
```


### 페이지 메서드 {#page-methods}

페이지에 정의된 기본 메서드 외에도, 테스트 전체에서 사용할 수 있는 추가 메서드를 정의할 수 있습니다. 예를 들어, 음악 관리 애플리케이션을 만든다고 가정해봅시다. 애플리케이션의 한 페이지에서 자주 수행하는 작업은 플레이리스트를 생성하는 것일 수 있습니다. 각 테스트마다 플레이리스트 생성 로직을 반복해서 작성하는 대신, 페이지 클래스에 `createPlaylist` 메서드를 정의할 수 있습니다:

```php
<?php

namespace Tests\Browser\Pages;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Page;

class Dashboard extends Page
{
    // 다른 페이지 메서드...

    /**
     * 새 플레이리스트 생성.
     */
    public function createPlaylist(Browser $browser, string $name): void
    {
        $browser->type('name', $name)
            ->check('share')
            ->press('Create Playlist');
    }
}
```

메서드가 정의되면, 해당 페이지를 사용하는 모든 테스트에서 사용할 수 있습니다. 브라우저 인스턴스는 커스텀 페이지 메서드의 첫 번째 인자로 자동으로 전달됩니다:

```php
use Tests\Browser\Pages\Dashboard;

$browser->visit(new Dashboard)
    ->createPlaylist('My Playlist')
    ->assertSee('My Playlist');
```


## 컴포넌트 {#components}

컴포넌트는 Dusk의 "페이지 객체"와 유사하지만, 내비게이션 바나 알림 창과 같이 애플리케이션 전체에서 재사용되는 UI 및 기능 조각을 위한 것입니다. 따라서 컴포넌트는 특정 URL에 바인딩되지 않습니다.


### 컴포넌트 생성하기 {#generating-components}

컴포넌트를 생성하려면, `dusk:component` Artisan 명령어를 실행하세요. 새 컴포넌트는 `tests/Browser/Components` 디렉터리에 생성됩니다:

```shell
php artisan dusk:component DatePicker
```

위에서 보듯이, "날짜 선택기"는 애플리케이션의 다양한 페이지에 존재할 수 있는 컴포넌트의 예입니다. 테스트 전체에서 날짜를 선택하는 브라우저 자동화 로직을 수동으로 작성하는 것은 번거로울 수 있습니다. 대신, 날짜 선택기를 나타내는 Dusk 컴포넌트를 정의하여, 해당 로직을 컴포넌트 내에 캡슐화할 수 있습니다:

```php
<?php

namespace Tests\Browser\Components;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Component as BaseComponent;

class DatePicker extends BaseComponent
{
    /**
     * 컴포넌트의 루트 셀렉터를 가져옵니다.
     */
    public function selector(): string
    {
        return '.date-picker';
    }

    /**
     * 브라우저 페이지에 컴포넌트가 포함되어 있는지 어서트합니다.
     */
    public function assert(Browser $browser): void
    {
        $browser->assertVisible($this->selector());
    }

    /**
     * 컴포넌트의 요소 단축키를 가져옵니다.
     *
     * @return array<string, string>
     */
    public function elements(): array
    {
        return [
            '@date-field' => 'input.datepicker-input',
            '@year-list' => 'div > div.datepicker-years',
            '@month-list' => 'div > div.datepicker-months',
            '@day-list' => 'div > div.datepicker-days',
        ];
    }

    /**
     * 주어진 날짜를 선택합니다.
     */
    public function selectDate(Browser $browser, int $year, int $month, int $day): void
    {
        $browser->click('@date-field')
            ->within('@year-list', function (Browser $browser) use ($year) {
                $browser->click($year);
            })
            ->within('@month-list', function (Browser $browser) use ($month) {
                $browser->click($month);
            })
            ->within('@day-list', function (Browser $browser) use ($day) {
                $browser->click($day);
            });
    }
}
```


### 컴포넌트 사용하기 {#using-components}

컴포넌트가 정의되면, 어떤 테스트에서든 날짜 선택기 내에서 쉽게 날짜를 선택할 수 있습니다. 날짜를 선택하는 데 필요한 로직이 변경되더라도, 컴포넌트만 업데이트하면 됩니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\Browser\Components\DatePicker;

uses(DatabaseMigrations::class);

test('basic example', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/')
            ->within(new DatePicker, function (Browser $browser) {
                $browser->selectDate(2019, 1, 30);
            })
            ->assertSee('January');
    });
});
```

```php [PHPUnit]
<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\Browser\Components\DatePicker;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    /**
     * 기본 컴포넌트 테스트 예제.
     */
    public function test_basic_example(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->within(new DatePicker, function (Browser $browser) {
                    $browser->selectDate(2019, 1, 30);
                })
                ->assertSee('January');
        });
    }
}
```
:::
`component` 메서드는 주어진 컴포넌트에 범위가 지정된 브라우저 인스턴스를 반환하는 데 사용할 수 있습니다:

```php
$datePicker = $browser->component(new DatePickerComponent);

$datePicker->selectDate(2019, 1, 30);

$datePicker->assertSee('January');
```


## 지속적 통합 {#continuous-integration}

> [!WARNING]
> 대부분의 Dusk 지속적 통합 구성은 Laravel 애플리케이션이 8000번 포트에서 내장 PHP 개발 서버로 서비스된다고 가정합니다. 따라서 계속 진행하기 전에, 지속적 통합 환경에 `APP_URL` 환경 변수 값이 `http://127.0.0.1:8000`인지 확인해야 합니다.


### Heroku CI {#running-tests-on-heroku-ci}

[Heroku CI](https://www.heroku.com/continuous-integration)에서 Dusk 테스트를 실행하려면, 다음 Google Chrome 빌드팩과 스크립트를 Heroku `app.json` 파일에 추가하세요:

```json
{
  "environments": {
    "test": {
      "buildpacks": [
        { "url": "heroku/php" },
        { "url": "https://github.com/heroku/heroku-buildpack-chrome-for-testing" }
      ],
      "scripts": {
        "test-setup": "cp .env.testing .env",
        "test": "nohup bash -c './vendor/laravel/dusk/bin/chromedriver-linux --port=9515 > /dev/null 2>&1 &' && nohup bash -c 'php artisan serve --no-reload > /dev/null 2>&1 &' && php artisan dusk"
      }
    }
  }
}
```


### Travis CI {#running-tests-on-travis-ci}

[Travis CI](https://travis-ci.org)에서 Dusk 테스트를 실행하려면, 다음 `.travis.yml` 구성을 사용하세요. Travis CI는 그래픽 환경이 아니므로, Chrome 브라우저를 실행하기 위해 몇 가지 추가 단계를 거쳐야 합니다. 또한, `php artisan serve`를 사용하여 PHP의 내장 웹 서버를 실행합니다:

```yaml
language: php

php:
  - 8.2

addons:
  chrome: stable

install:
  - cp .env.testing .env
  - travis_retry composer install --no-interaction --prefer-dist
  - php artisan key:generate
  - php artisan dusk:chrome-driver

before_script:
  - google-chrome-stable --headless --disable-gpu --remote-debugging-port=9222 http://localhost &
  - php artisan serve --no-reload &

script:
  - php artisan dusk
```


### GitHub Actions {#running-tests-on-github-actions}

[GitHub Actions](https://github.com/features/actions)에서 Dusk 테스트를 실행하는 경우, 다음 구성 파일을 시작점으로 사용할 수 있습니다. TravisCI와 마찬가지로, `php artisan serve` 명령어를 사용하여 PHP의 내장 웹 서버를 실행합니다:

```yaml
name: CI
on: [push]
jobs:

  dusk-php:
    runs-on: ubuntu-latest
    env:
      APP_URL: "http://127.0.0.1:8000"
      DB_USERNAME: root
      DB_PASSWORD: root
      MAIL_MAILER: log
    steps:
      - uses: actions/checkout@v4
      - name: Prepare The Environment
        run: cp .env.example .env
      - name: Create Database
        run: |
          sudo systemctl start mysql
          mysql --user="root" --password="root" -e "CREATE DATABASE \`my-database\` character set UTF8mb4 collate utf8mb4_bin;"
      - name: Install Composer Dependencies
        run: composer install --no-progress --prefer-dist --optimize-autoloader
      - name: Generate Application Key
        run: php artisan key:generate
      - name: Upgrade Chrome Driver
        run: php artisan dusk:chrome-driver --detect
      - name: Start Chrome Driver
        run: ./vendor/laravel/dusk/bin/chromedriver-linux --port=9515 &
      - name: Run Laravel Server
        run: php artisan serve --no-reload &
      - name: Run Dusk Tests
        run: php artisan dusk
      - name: Upload Screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: tests/Browser/screenshots
      - name: Upload Console Logs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: console
          path: tests/Browser/console
```


### Chipper CI {#running-tests-on-chipper-ci}

[Chipper CI](https://chipperci.com)에서 Dusk 테스트를 실행하는 경우, 다음 구성 파일을 시작점으로 사용할 수 있습니다. Laravel을 실행하기 위해 PHP의 내장 서버를 사용하여 요청을 수신합니다:

```yaml
# 파일 .chipperci.yml
version: 1

environment:
  php: 8.2
  node: 16

# 빌드 환경에 Chrome 포함
services:
  - dusk

# 모든 커밋 빌드
on:
   push:
      branches: .*

pipeline:
  - name: Setup
    cmd: |
      cp -v .env.example .env
      composer install --no-interaction --prefer-dist --optimize-autoloader
      php artisan key:generate

      # dusk 환경 파일 생성, APP_URL이 BUILD_HOST를 사용하도록 보장
      cp -v .env .env.dusk.ci
      sed -i "s@APP_URL=.*@APP_URL=http://$BUILD_HOST:8000@g" .env.dusk.ci

  - name: Compile Assets
    cmd: |
      npm ci --no-audit
      npm run build

  - name: Browser Tests
    cmd: |
      php -S [::0]:8000 -t public 2>server.log &
      sleep 2
      php artisan dusk:chrome-driver $CHROME_DRIVER
      php artisan dusk --env=ci
```

Chipper CI에서 Dusk 테스트 실행 및 데이터베이스 사용 방법 등 자세한 내용은 [공식 Chipper CI 문서](https://chipperci.com/docs/testing/laravel-dusk-new/)를 참고하세요.
