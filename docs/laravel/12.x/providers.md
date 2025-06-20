# 서비스 프로바이더









## 소개 {#introduction}

서비스 프로바이더는 모든 Laravel 애플리케이션 부트스트래핑의 중심입니다. 여러분의 애플리케이션뿐만 아니라, Laravel의 모든 핵심 서비스들도 서비스 프로바이더를 통해 부트스트랩됩니다.

그렇다면 "부트스트랩"이란 무엇을 의미할까요? 일반적으로, **등록**하는 것을 의미합니다. 여기에는 서비스 컨테이너 바인딩, 이벤트 리스너, 미들웨어, 라우트 등록 등이 포함됩니다. 서비스 프로바이더는 애플리케이션을 구성하는 중심 장소입니다.

Laravel은 메일러, 큐, 캐시 등과 같은 핵심 서비스를 부트스트랩하기 위해 내부적으로 수십 개의 서비스 프로바이더를 사용합니다. 이 중 많은 프로바이더는 "지연" 프로바이더로, 제공하는 서비스가 실제로 필요할 때만 로드되고, 모든 요청마다 로드되지는 않습니다.

모든 사용자 정의 서비스 프로바이더는 `bootstrap/providers.php` 파일에 등록됩니다. 아래 문서에서는 직접 서비스 프로바이더를 작성하고, 이를 Laravel 애플리케이션에 등록하는 방법을 배웁니다.

> [!NOTE]
> Laravel이 요청을 처리하고 내부적으로 어떻게 동작하는지 더 알고 싶다면, Laravel [요청 라이프사이클](/laravel/12.x/lifecycle) 문서를 참고하세요.


## 서비스 프로바이더 작성하기 {#writing-service-providers}

모든 서비스 프로바이더는 `Illuminate\Support\ServiceProvider` 클래스를 확장합니다. 대부분의 서비스 프로바이더는 `register`와 `boot` 메서드를 포함합니다. `register` 메서드 내에서는 **[서비스 컨테이너](/laravel/12.x/container)에 바인딩만** 해야 합니다. 이 메서드 내에서 이벤트 리스너, 라우트, 기타 기능을 등록해서는 안 됩니다.

Artisan CLI를 통해 `make:provider` 명령어로 새 프로바이더를 생성할 수 있습니다. Laravel은 새 프로바이더를 애플리케이션의 `bootstrap/providers.php` 파일에 자동으로 등록합니다:

```shell
php artisan make:provider RiakServiceProvider
```


### Register 메서드 {#the-register-method}

앞서 언급했듯이, `register` 메서드 내에서는 [서비스 컨테이너](/laravel/12.x/container)에 바인딩만 해야 합니다. 이 메서드 내에서 이벤트 리스너, 라우트, 기타 기능을 등록해서는 안 됩니다. 그렇지 않으면 아직 로드되지 않은 서비스 프로바이더가 제공하는 서비스를 실수로 사용할 수 있습니다.

기본적인 서비스 프로바이더 예제를 살펴보겠습니다. 서비스 프로바이더의 어떤 메서드에서도 `$app` 프로퍼티를 통해 서비스 컨테이너에 접근할 수 있습니다:

```php
<?php

namespace App\Providers;

use App\Services\Riak\Connection;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class RiakServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Connection::class, function (Application $app) {
            return new Connection(config('riak'));
        });
    }
}
```

이 서비스 프로바이더는 `register` 메서드만 정의하며, 이 메서드를 사용해 서비스 컨테이너에 `App\Services\Riak\Connection`의 구현을 정의합니다. Laravel의 서비스 컨테이너에 익숙하지 않다면, [관련 문서](/laravel/12.x/container)를 참고하세요.


#### `bindings`와 `singletons` 프로퍼티 {#the-bindings-and-singletons-properties}

서비스 프로바이더에서 여러 개의 간단한 바인딩을 등록해야 한다면, 각 컨테이너 바인딩을 수동으로 등록하는 대신 `bindings`와 `singletons` 프로퍼티를 사용할 수 있습니다. 프레임워크가 서비스 프로바이더를 로드할 때, 이 프로퍼티들을 자동으로 확인하고 바인딩을 등록합니다:

```php
<?php

namespace App\Providers;

use App\Contracts\DowntimeNotifier;
use App\Contracts\ServerProvider;
use App\Services\DigitalOceanServerProvider;
use App\Services\PingdomDowntimeNotifier;
use App\Services\ServerToolsProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 등록해야 할 모든 컨테이너 바인딩.
     *
     * @var array
     */
    public $bindings = [
        ServerProvider::class => DigitalOceanServerProvider::class,
    ];

    /**
     * 등록해야 할 모든 컨테이너 싱글턴.
     *
     * @var array
     */
    public $singletons = [
        DowntimeNotifier::class => PingdomDowntimeNotifier::class,
        ServerProvider::class => ServerToolsProvider::class,
    ];
}
```


### Boot 메서드 {#the-boot-method}

그렇다면, 서비스 프로바이더 내에서 [뷰 컴포저](/laravel/12.x/views#view-composers)를 등록해야 한다면 어떻게 해야 할까요? 이는 `boot` 메서드 내에서 처리해야 합니다. **이 메서드는 다른 모든 서비스 프로바이더가 등록된 후에 호출**되므로, 프레임워크에 의해 등록된 모든 서비스에 접근할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        View::composer('view', function () {
            // ...
        });
    }
}
```


#### Boot 메서드 의존성 주입 {#boot-method-dependency-injection}

서비스 프로바이더의 `boot` 메서드에 의존성을 타입힌트로 지정할 수 있습니다. [서비스 컨테이너](/laravel/12.x/container)가 필요한 의존성을 자동으로 주입해줍니다:

```php
use Illuminate\Contracts\Routing\ResponseFactory;

/**
 * Bootstrap any application services.
 */
public function boot(ResponseFactory $response): void
{
    $response->macro('serialized', function (mixed $value) {
        // ...
    });
}
```


## 프로바이더 등록하기 {#registering-providers}

모든 서비스 프로바이더는 `bootstrap/providers.php` 설정 파일에 등록됩니다. 이 파일은 애플리케이션의 서비스 프로바이더 클래스명을 담은 배열을 반환합니다:

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
];
```

`make:provider` Artisan 명령어를 실행하면, Laravel이 생성된 프로바이더를 `bootstrap/providers.php` 파일에 자동으로 추가합니다. 하지만 프로바이더 클래스를 수동으로 생성했다면, 배열에 직접 추가해야 합니다:

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\ComposerServiceProvider::class, // [!code ++]
];
```


## 지연 프로바이더 {#deferred-providers}

프로바이더가 [서비스 컨테이너](/laravel/12.x/container)에 바인딩만 **등록**한다면, 등록된 바인딩이 실제로 필요할 때까지 등록을 지연할 수 있습니다. 이러한 프로바이더의 로딩을 지연하면, 매 요청마다 파일시스템에서 로드되지 않으므로 애플리케이션의 성능이 향상됩니다.

Laravel은 지연 서비스 프로바이더가 제공하는 모든 서비스의 목록과 해당 서비스 프로바이더 클래스명을 컴파일하여 저장합니다. 그리고 이 서비스들 중 하나를 해석하려고 할 때만 서비스 프로바이더를 로드합니다.

프로바이더의 로딩을 지연하려면, `\Illuminate\Contracts\Support\DeferrableProvider` 인터페이스를 구현하고 `provides` 메서드를 정의하세요. `provides` 메서드는 프로바이더가 등록한 서비스 컨테이너 바인딩을 반환해야 합니다:

```php
<?php

namespace App\Providers;

use App\Services\Riak\Connection;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class RiakServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Connection::class, function (Application $app) {
            return new Connection($app['config']['riak']);
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [Connection::class];
    }
}
```
