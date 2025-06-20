# 테스트: 시작하기










## 소개 {#introduction}

Laravel은 테스트를 염두에 두고 설계되었습니다. 실제로, [Pest](https://pestphp.com)와 [PHPUnit](https://phpunit.de)를 이용한 테스트 지원이 기본적으로 포함되어 있으며, 애플리케이션에 이미 `phpunit.xml` 파일이 설정되어 있습니다. 프레임워크는 또한 애플리케이션을 표현력 있게 테스트할 수 있는 편리한 헬퍼 메서드도 제공합니다.

기본적으로, 애플리케이션의 `tests` 디렉터리에는 `Feature`와 `Unit` 두 개의 디렉터리가 포함되어 있습니다. 단위 테스트(Unit test)는 코드의 아주 작고 독립적인 부분에 집중하는 테스트입니다. 실제로 대부분의 단위 테스트는 하나의 메서드에 집중할 것입니다. "Unit" 테스트 디렉터리 내의 테스트는 Laravel 애플리케이션을 부트하지 않으므로, 애플리케이션의 데이터베이스나 다른 프레임워크 서비스를 사용할 수 없습니다.

기능 테스트(Feature test)는 여러 객체가 서로 상호작용하는 방식이나 JSON 엔드포인트에 대한 전체 HTTP 요청 등, 더 큰 코드 영역을 테스트할 수 있습니다. **일반적으로, 대부분의 테스트는 기능 테스트여야 합니다. 이러한 유형의 테스트가 시스템 전체가 의도한 대로 동작하는지에 대한 가장 큰 신뢰를 제공합니다.**

`Feature`와 `Unit` 테스트 디렉터리 모두에 `ExampleTest.php` 파일이 제공됩니다. 새로운 Laravel 애플리케이션을 설치한 후, `vendor/bin/pest`, `vendor/bin/phpunit`, 또는 `php artisan test` 명령어를 실행하여 테스트를 실행할 수 있습니다.


## 환경 {#environment}

테스트를 실행할 때, Laravel은 `phpunit.xml` 파일에 정의된 환경 변수로 인해 [설정 환경](/laravel/12.x/configuration#environment-configuration)을 자동으로 `testing`으로 설정합니다. 또한, Laravel은 세션과 캐시를 `array` 드라이버로 자동 설정하여 테스트 중에는 세션이나 캐시 데이터가 저장되지 않도록 합니다.

필요에 따라 다른 테스트 환경 설정 값을 자유롭게 정의할 수 있습니다. `testing` 환경 변수는 애플리케이션의 `phpunit.xml` 파일에서 설정할 수 있지만, 테스트를 실행하기 전에 반드시 `config:clear` Artisan 명령어로 설정 캐시를 비워야 합니다!


#### `.env.testing` 환경 파일 {#the-env-testing-environment-file}

또한, 프로젝트 루트에 `.env.testing` 파일을 생성할 수 있습니다. 이 파일은 Pest 및 PHPUnit 테스트를 실행하거나 `--env=testing` 옵션으로 Artisan 명령어를 실행할 때 `.env` 파일 대신 사용됩니다.


## 테스트 생성 {#creating-tests}

새로운 테스트 케이스를 생성하려면 `make:test` Artisan 명령어를 사용하세요. 기본적으로 테스트는 `tests/Feature` 디렉터리에 생성됩니다:

```shell
php artisan make:test UserTest
```

`tests/Unit` 디렉터리 내에 테스트를 생성하고 싶다면, `make:test` 명령어 실행 시 `--unit` 옵션을 사용할 수 있습니다:

```shell
php artisan make:test UserTest --unit
```

> [!NOTE]
> 테스트 스텁은 [스텁 퍼블리싱](/laravel/12.x/artisan#stub-customization)을 사용하여 커스터마이즈할 수 있습니다.

테스트가 생성되면, Pest 또는 PHPUnit을 사용하여 일반적으로 테스트를 정의할 수 있습니다. 테스트를 실행하려면 터미널에서 `vendor/bin/pest`, `vendor/bin/phpunit`, 또는 `php artisan test` 명령어를 실행하세요:
::: code-group
```php [Pest]
<?php

test('basic', function () {
    expect(true)->toBeTrue();
});
```

```php [PHPUnit]
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    /**
     * 기본 테스트 예시입니다.
     */
    public function test_basic_test(): void
    {
        $this->assertTrue(true);
    }
}
```
:::
> [!WARNING]
> 테스트 클래스 내에 직접 `setUp` / `tearDown` 메서드를 정의하는 경우, 반드시 부모 클래스의 `parent::setUp()` / `parent::tearDown()` 메서드를 호출해야 합니다. 일반적으로, 자신의 `setUp` 메서드 시작 부분에 `parent::setUp()`을, `tearDown` 메서드 끝에 `parent::tearDown()`을 호출해야 합니다.


## 테스트 실행 {#running-tests}

앞서 언급한 것처럼, 테스트를 작성한 후에는 `pest` 또는 `phpunit`을 사용하여 실행할 수 있습니다:
::: code-group
```shell [Pest]
./vendor/bin/pest
```

```shell [PHPUnit]
./vendor/bin/phpunit
```
:::
`pest` 또는 `phpunit` 명령어 외에도, `test` Artisan 명령어를 사용하여 테스트를 실행할 수 있습니다. Artisan 테스트 러너는 개발 및 디버깅을 쉽게 하기 위해 자세한 테스트 리포트를 제공합니다:

```shell
php artisan test
```

`pest` 또는 `phpunit` 명령어에 전달할 수 있는 모든 인수는 Artisan `test` 명령어에도 전달할 수 있습니다:

```shell
php artisan test --testsuite=Feature --stop-on-failure
```


### 테스트 병렬 실행 {#running-tests-in-parallel}

기본적으로, Laravel과 Pest / PHPUnit은 단일 프로세스 내에서 테스트를 순차적으로 실행합니다. 하지만, 여러 프로세스에서 동시에 테스트를 실행하면 테스트 실행 시간을 크게 줄일 수 있습니다. 시작하려면, `brianium/paratest` Composer 패키지를 "dev" 의존성으로 설치해야 합니다. 그런 다음, `test` Artisan 명령어 실행 시 `--parallel` 옵션을 추가하세요:

```shell
composer require brianium/paratest --dev

php artisan test --parallel
```

기본적으로, Laravel은 머신의 사용 가능한 CPU 코어 수만큼 프로세스를 생성합니다. 하지만, `--processes` 옵션을 사용하여 프로세스 수를 조정할 수 있습니다:

```shell
php artisan test --parallel --processes=4
```

> [!WARNING]
> 테스트를 병렬로 실행할 때, 일부 Pest / PHPUnit 옵션(예: `--do-not-cache-result`)은 사용할 수 없습니다.


#### 병렬 테스트와 데이터베이스 {#parallel-testing-and-databases}

기본 데이터베이스 연결이 설정되어 있다면, Laravel은 테스트를 실행하는 각 병렬 프로세스마다 테스트 데이터베이스를 자동으로 생성 및 마이그레이션합니다. 테스트 데이터베이스는 각 프로세스마다 고유한 프로세스 토큰이 접미사로 붙습니다. 예를 들어, 두 개의 병렬 테스트 프로세스가 있다면, Laravel은 `your_db_test_1`과 `your_db_test_2` 테스트 데이터베이스를 생성 및 사용합니다.

기본적으로, 테스트 데이터베이스는 `test` Artisan 명령어 호출 간에 유지되어 이후의 `test` 실행에서도 재사용할 수 있습니다. 하지만, `--recreate-databases` 옵션을 사용하여 데이터베이스를 다시 생성할 수 있습니다:

```shell
php artisan test --parallel --recreate-databases
```


#### 병렬 테스트 훅 {#parallel-testing-hooks}

때때로, 애플리케이션 테스트에서 여러 테스트 프로세스가 안전하게 사용할 수 있도록 특정 리소스를 준비해야 할 수 있습니다.

`ParallelTesting` 파사드를 사용하여 프로세스 또는 테스트 케이스의 `setUp` 및 `tearDown` 시점에 실행할 코드를 지정할 수 있습니다. 전달된 클로저는 프로세스 토큰과 현재 테스트 케이스를 담고 있는 `$token` 및 `$testCase` 변수를 받습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\ParallelTesting;
use Illuminate\Support\ServiceProvider;
use PHPUnit\Framework\TestCase;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        ParallelTesting::setUpProcess(function (int $token) {
            // ...
        });

        ParallelTesting::setUpTestCase(function (int $token, TestCase $testCase) {
            // ...
        });

        // 테스트 데이터베이스가 생성될 때 실행됩니다...
        ParallelTesting::setUpTestDatabase(function (string $database, int $token) {
            Artisan::call('db:seed');
        });

        ParallelTesting::tearDownTestCase(function (int $token, TestCase $testCase) {
            // ...
        });

        ParallelTesting::tearDownProcess(function (int $token) {
            // ...
        });
    }
}
```


#### 병렬 테스트 토큰 접근 {#accessing-the-parallel-testing-token}

애플리케이션의 테스트 코드 내 다른 위치에서 현재 병렬 프로세스의 "토큰"에 접근하고 싶다면, `token` 메서드를 사용할 수 있습니다. 이 토큰은 개별 테스트 프로세스에 대한 고유한 문자열 식별자이며, 병렬 테스트 프로세스 간에 리소스를 분리하는 데 사용할 수 있습니다. 예를 들어, Laravel은 각 병렬 테스트 프로세스가 생성한 테스트 데이터베이스 끝에 이 토큰을 자동으로 추가합니다:

    $token = ParallelTesting::token();


### 테스트 커버리지 리포트 {#reporting-test-coverage}

> [!WARNING]
> 이 기능은 [Xdebug](https://xdebug.org) 또는 [PCOV](https://pecl.php.net/package/pcov)가 필요합니다.

애플리케이션 테스트를 실행할 때, 테스트 케이스가 실제로 애플리케이션 코드를 얼마나 커버하는지, 그리고 테스트 실행 시 얼마나 많은 애플리케이션 코드가 사용되는지 확인하고 싶을 수 있습니다. 이를 위해, `test` 명령어 실행 시 `--coverage` 옵션을 제공할 수 있습니다:

```shell
php artisan test --coverage
```


#### 최소 커버리지 임계값 강제 적용 {#enforcing-a-minimum-coverage-threshold}

`--min` 옵션을 사용하여 애플리케이션의 최소 테스트 커버리지 임계값을 정의할 수 있습니다. 이 임계값을 충족하지 못하면 테스트 스위트가 실패합니다:

```shell
php artisan test --coverage --min=80.3
```


### 테스트 프로파일링 {#profiling-tests}

Artisan 테스트 러너는 애플리케이션의 가장 느린 테스트를 나열하는 편리한 메커니즘도 제공합니다. `--profile` 옵션과 함께 `test` 명령어를 실행하면, 가장 느린 10개의 테스트 목록이 표시되어 테스트 스위트를 빠르게 개선할 수 있는 테스트를 쉽게 조사할 수 있습니다:

```shell
php artisan test --profile
```
