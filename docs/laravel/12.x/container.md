# 서비스 컨테이너






















## 소개 {#introduction}

Laravel 서비스 컨테이너는 클래스 의존성 관리와 의존성 주입을 수행하는 강력한 도구입니다. 의존성 주입이란, 클래스의 의존성이 생성자나 경우에 따라 "세터" 메서드를 통해 클래스에 "주입"된다는 의미입니다.

간단한 예제를 살펴보겠습니다:

```php
<?php

namespace App\Http\Controllers;

use App\Services\AppleMusic;
use Illuminate\View\View;

class PodcastController extends Controller
{
    /**
     * 새로운 컨트롤러 인스턴스 생성.
     */
    public function __construct(
        protected AppleMusic $apple,
    ) {}

    /**
     * 주어진 팟캐스트에 대한 정보 표시.
     */
    public function show(string $id): View
    {
        return view('podcasts.show', [
            'podcast' => $this->apple->findPodcast($id)
        ]);
    }
}
```

이 예제에서 `PodcastController`는 Apple Music과 같은 데이터 소스에서 팟캐스트를 가져와야 합니다. 그래서 팟캐스트를 가져올 수 있는 서비스를 **주입**합니다. 서비스가 주입되었기 때문에, 테스트 시 `AppleMusic` 서비스의 더미 구현(모킹)을 쉽게 만들 수 있습니다.

Laravel 서비스 컨테이너를 깊이 이해하는 것은 강력하고 대규모 애플리케이션을 구축하거나, Laravel 코어에 기여할 때 필수적입니다.


### 제로 설정(Zero Configuration) 해석 {#zero-configuration-resolution}

클래스에 의존성이 없거나, 오직 다른 구체 클래스(인터페이스가 아님)에만 의존하는 경우, 컨테이너는 해당 클래스를 어떻게 해석할지 별도의 지시가 필요하지 않습니다. 예를 들어, 다음 코드를 `routes/web.php` 파일에 작성할 수 있습니다:

```php
<?php

class Service
{
    // ...
}

Route::get('/', function (Service $service) {
    dd($service::class);
});
```

이 예제에서, 애플리케이션의 `/` 라우트에 접근하면 `Service` 클래스가 자동으로 해석되어 라우트 핸들러에 주입됩니다. 이는 혁신적입니다. 즉, 복잡한 설정 파일을 걱정하지 않고도 의존성 주입의 이점을 누리며 애플리케이션을 개발할 수 있습니다.

다행히도, Laravel 애플리케이션을 개발할 때 작성하는 많은 클래스들은 컨테이너를 통해 자동으로 의존성을 주입받습니다. 여기에는 [컨트롤러](/laravel/12.x/controllers), [이벤트 리스너](/laravel/12.x/events), [미들웨어](/laravel/12.x/middleware) 등이 포함됩니다. 또한, [큐 작업](/laravel/12.x/queues)의 `handle` 메서드에서도 의존성을 타입힌트할 수 있습니다. 자동 및 제로 설정 의존성 주입의 강력함을 경험하면, 이를 빼고 개발하는 것이 불가능하게 느껴질 것입니다.


### 컨테이너를 언제 활용해야 할까 {#when-to-use-the-container}

제로 설정 해석 덕분에, 라우트, 컨트롤러, 이벤트 리스너 등에서 의존성을 타입힌트하는 경우가 많지만, 컨테이너와 직접적으로 상호작용할 필요는 거의 없습니다. 예를 들어, 라우트 정의에서 `Illuminate\Http\Request` 객체를 타입힌트하여 현재 요청에 쉽게 접근할 수 있습니다. 이 코드를 작성할 때 컨테이너와 직접 상호작용하지 않지만, 실제로는 컨테이너가 이러한 의존성 주입을 관리합니다:

```php
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {
    // ...
});
```

대부분의 경우, 자동 의존성 주입과 [파사드](/laravel/12.x/facades) 덕분에 컨테이너에서 무언가를 직접 바인딩하거나 해석할 필요 없이 Laravel 애플리케이션을 개발할 수 있습니다. **그렇다면 언제 컨테이너와 직접 상호작용해야 할까요?** 두 가지 상황을 살펴보겠습니다.

첫째, 인터페이스를 구현하는 클래스를 작성하고, 해당 인터페이스를 라우트나 클래스 생성자에서 타입힌트하고 싶다면, [컨테이너에 해당 인터페이스를 어떻게 해석할지 알려주어야](#binding-interfaces-to-implementations) 합니다. 둘째, [Laravel 패키지](/laravel/12.x/packages)를 작성하여 다른 Laravel 개발자와 공유하려는 경우, 패키지의 서비스를 컨테이너에 바인딩해야 할 수 있습니다.


## 바인딩 {#binding}


### 바인딩 기본 {#binding-basics}


#### 단순 바인딩 {#simple-bindings}

대부분의 서비스 컨테이너 바인딩은 [서비스 프로바이더](/laravel/12.x/providers) 내에서 등록됩니다. 따라서 대부분의 예제는 이 컨텍스트에서 컨테이너를 사용하는 방법을 보여줍니다.

서비스 프로바이더 내에서는 항상 `$this->app` 속성을 통해 컨테이너에 접근할 수 있습니다. `bind` 메서드를 사용하여 바인딩을 등록할 수 있으며, 등록하려는 클래스 또는 인터페이스 이름과 해당 클래스의 인스턴스를 반환하는 클로저를 전달합니다:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;

$this->app->bind(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

해결자(클로저)의 인자로 컨테이너 자체를 받는다는 점에 주목하세요. 이를 통해 우리가 생성하는 객체의 하위 의존성도 컨테이너로부터 해석할 수 있습니다.

앞서 언급했듯이, 일반적으로 서비스 프로바이더 내에서 컨테이너와 상호작용하게 됩니다. 하지만 서비스 프로바이더 외부에서 컨테이너와 상호작용하고 싶다면, `App` [파사드](/laravel/12.x/facades)를 통해서도 가능합니다:

```php
use App\Services\Transistor;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\App;

App::bind(Transistor::class, function (Application $app) {
    // ...
});
```

`bindIf` 메서드를 사용하면, 주어진 타입에 대한 바인딩이 이미 등록되어 있지 않은 경우에만 컨테이너 바인딩을 등록할 수 있습니다:

```php
$this->app->bindIf(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

편의를 위해, 등록하려는 클래스나 인터페이스 이름을 별도의 인자로 제공하지 않고, `bind` 메서드에 전달하는 클로저의 반환 타입에서 Laravel이 타입을 추론하도록 할 수 있습니다:

```php
App::bind(function (Application $app): Transistor {
    return new Transistor($app->make(PodcastParser::class));
});
```

> [!NOTE]
> 클래스가 어떤 인터페이스에도 의존하지 않는다면, 컨테이너에 바인딩할 필요가 없습니다. 컨테이너는 리플렉션을 통해 이러한 객체를 자동으로 해석할 수 있기 때문입니다.


#### 싱글톤 바인딩 {#binding-a-singleton}

`singleton` 메서드는 한 번만 해석되어야 하는 클래스나 인터페이스를 컨테이너에 바인딩합니다. 싱글톤 바인딩이 한 번 해석되면, 이후 컨테이너에서 해당 타입을 요청할 때마다 동일한 객체 인스턴스가 반환됩니다:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;

$this->app->singleton(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

`singletonIf` 메서드를 사용하면, 주어진 타입에 대한 바인딩이 이미 등록되어 있지 않은 경우에만 싱글톤 바인딩을 등록할 수 있습니다:

```php
$this->app->singletonIf(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```


#### 스코프 싱글톤 바인딩 {#binding-scoped}

`scoped` 메서드는 주어진 Laravel 요청/작업 라이프사이클 내에서 한 번만 해석되어야 하는 클래스나 인터페이스를 컨테이너에 바인딩합니다. 이 메서드는 `singleton`과 유사하지만, `scoped`로 등록된 인스턴스는 Laravel 애플리케이션이 새로운 "라이프사이클"을 시작할 때마다(예: [Laravel Octane](/laravel/12.x/octane) 워커가 새 요청을 처리하거나, [큐 워커](/laravel/12.x/queues)가 새 작업을 처리할 때) 플러시됩니다:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;

$this->app->scoped(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

`scopedIf` 메서드를 사용하면, 주어진 타입에 대한 바인딩이 이미 등록되어 있지 않은 경우에만 스코프 바인딩을 등록할 수 있습니다:

```php
$this->app->scopedIf(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```


#### 인스턴스 바인딩 {#binding-instances}

이미 생성된 객체 인스턴스를 `instance` 메서드를 사용하여 컨테이너에 바인딩할 수도 있습니다. 주어진 인스턴스는 이후 컨테이너에서 해당 타입을 요청할 때마다 항상 반환됩니다:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;

$service = new Transistor(new PodcastParser);

$this->app->instance(Transistor::class, $service);
```


### 인터페이스를 구현체에 바인딩하기 {#binding-interfaces-to-implementations}

서비스 컨테이너의 매우 강력한 기능 중 하나는 인터페이스를 특정 구현체에 바인딩할 수 있다는 점입니다. 예를 들어, `EventPusher` 인터페이스와 `RedisEventPusher` 구현체가 있다고 가정해봅시다. 이 인터페이스의 `RedisEventPusher` 구현체를 작성한 후, 다음과 같이 서비스 컨테이너에 등록할 수 있습니다:

```php
use App\Contracts\EventPusher;
use App\Services\RedisEventPusher;

$this->app->bind(EventPusher::class, RedisEventPusher::class);
```

이 코드는, 어떤 클래스가 `EventPusher` 구현체가 필요할 때 컨테이너가 `RedisEventPusher`를 주입하도록 지시합니다. 이제 컨테이너로 해석되는 클래스의 생성자에서 `EventPusher` 인터페이스를 타입힌트할 수 있습니다. 컨트롤러, 이벤트 리스너, 미들웨어 등 Laravel 애플리케이션 내 다양한 클래스는 항상 컨테이너를 통해 해석된다는 점을 기억하세요:

```php
use App\Contracts\EventPusher;

/**
 * 새로운 클래스 인스턴스 생성.
 */
public function __construct(
    protected EventPusher $pusher,
) {}
```


### 컨텍스트 바인딩 {#contextual-binding}

때로는 동일한 인터페이스를 사용하는 두 클래스가 있지만, 각 클래스에 서로 다른 구현체를 주입하고 싶을 수 있습니다. 예를 들어, 두 컨트롤러가 `Illuminate\Contracts\Filesystem\Filesystem` [계약](/laravel/12.x/contracts)의 서로 다른 구현체에 의존할 수 있습니다. Laravel은 이 동작을 정의할 수 있는 간단하고 유연한 인터페이스를 제공합니다:

```php
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\VideoController;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

$this->app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(function () {
        return Storage::disk('local');
    });

$this->app->when([VideoController::class, UploadController::class])
    ->needs(Filesystem::class)
    ->give(function () {
        return Storage::disk('s3');
    });
```


### 컨텍스트 속성 {#contextual-attributes}

컨텍스트 바인딩은 드라이버 구현체나 설정 값을 주입할 때 자주 사용되므로, Laravel은 이러한 값을 서비스 프로바이더에서 직접 컨텍스트 바인딩을 정의하지 않고도 주입할 수 있는 다양한 컨텍스트 바인딩 속성을 제공합니다.

예를 들어, `Storage` 속성을 사용하여 특정 [스토리지 디스크](/laravel/12.x/filesystem)를 주입할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Container\Attributes\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;

class PhotoController extends Controller
{
    public function __construct(
        #[Storage('local')] protected Filesystem $filesystem
    )
    {
        // ...
    }
}
```

`Storage` 속성 외에도, Laravel은 `Auth`, `Cache`, `Config`, `Context`, `DB`, `Give`, `Log`, `RouteParameter`, 그리고 [Tag](#tagging) 속성을 제공합니다:

```php
<?php

namespace App\Http\Controllers;

use App\Contracts\UserRepository;
use App\Models\Photo;
use App\Repositories\DatabaseRepository;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Container\Attributes\Cache;
use Illuminate\Container\Attributes\Config;
use Illuminate\Container\Attributes\Context;
use Illuminate\Container\Attributes\DB;
use Illuminate\Container\Attributes\Give;
use Illuminate\Container\Attributes\Log;
use Illuminate\Container\Attributes\RouteParameter;
use Illuminate\Container\Attributes\Tag;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Database\Connection;
use Psr\Log\LoggerInterface;

class PhotoController extends Controller
{
    public function __construct(
        #[Auth('web')] protected Guard $auth,
        #[Cache('redis')] protected Repository $cache,
        #[Config('app.timezone')] protected string $timezone,
        #[Context('uuid')] protected string $uuid,
        #[Context('ulid', hidden: true)] protected string $ulid,
        #[DB('mysql')] protected Connection $connection,
        #[Give(DatabaseRepository::class)] protected UserRepository $users,
        #[Log('daily')] protected LoggerInterface $log,
        #[RouteParameter('photo')] protected Photo $photo,
        #[Tag('reports')] protected iterable $reports,
    ) {
        // ...
    }
}
```

또한, Laravel은 현재 인증된 사용자를 주어진 라우트나 클래스에 주입할 수 있는 `CurrentUser` 속성도 제공합니다:

```php
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;

Route::get('/user', function (#[CurrentUser] User $user) {
    return $user;
})->middleware('auth');
```


#### 커스텀 속성 정의하기 {#defining-custom-attributes}

`Illuminate\Contracts\Container\ContextualAttribute` 계약을 구현하여 자신만의 컨텍스트 속성을 만들 수 있습니다. 컨테이너는 속성을 사용하는 클래스에 주입할 값을 해석하기 위해 속성의 `resolve` 메서드를 호출합니다. 아래 예제에서는 Laravel의 내장 `Config` 속성을 재구현합니다:

```php
<?php

namespace App\Attributes;

use Attribute;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Container\ContextualAttribute;

#[Attribute(Attribute::TARGET_PARAMETER)]
class Config implements ContextualAttribute
{
    /**
     * 새로운 속성 인스턴스 생성.
     */
    public function __construct(public string $key, public mixed $default = null)
    {
    }

    /**
     * 설정 값 해석.
     *
     * @param  self  $attribute
     * @param  \Illuminate\Contracts\Container\Container  $container
     * @return mixed
     */
    public static function resolve(self $attribute, Container $container)
    {
        return $container->make('config')->get($attribute->key, $attribute->default);
    }
}
```


### 원시값 바인딩 {#binding-primitives}

클래스가 주입된 클래스 외에도 정수와 같은 원시값을 주입받아야 할 때가 있습니다. 컨텍스트 바인딩을 사용하여 클래스가 필요로 하는 어떤 값이든 쉽게 주입할 수 있습니다:

```php
use App\Http\Controllers\UserController;

$this->app->when(UserController::class)
    ->needs('$variableName')
    ->give($value);
```

클래스가 [태그된](#tagging) 인스턴스의 배열에 의존할 수도 있습니다. `giveTagged` 메서드를 사용하면 해당 태그가 지정된 모든 컨테이너 바인딩을 쉽게 주입할 수 있습니다:

```php
$this->app->when(ReportAggregator::class)
    ->needs('$reports')
    ->giveTagged('reports');
```

애플리케이션의 설정 파일에서 값을 주입해야 한다면, `giveConfig` 메서드를 사용할 수 있습니다:

```php
$this->app->when(ReportAggregator::class)
    ->needs('$timezone')
    ->giveConfig('app.timezone');
```


### 타입 지정 가변 인자 바인딩 {#binding-typed-variadics}

가끔, 가변 인자 생성자 인자를 사용하여 타입이 지정된 객체 배열을 받는 클래스가 있을 수 있습니다:

```php
<?php

use App\Models\Filter;
use App\Services\Logger;

class Firewall
{
    /**
     * 필터 인스턴스.
     *
     * @var array
     */
    protected $filters;

    /**
     * 새로운 클래스 인스턴스 생성.
     */
    public function __construct(
        protected Logger $logger,
        Filter ...$filters,
    ) {
        $this->filters = $filters;
    }
}
```

컨텍스트 바인딩을 사용하여, `give` 메서드에 `Filter` 인스턴스 배열을 반환하는 클로저를 제공하여 이 의존성을 해석할 수 있습니다:

```php
$this->app->when(Firewall::class)
    ->needs(Filter::class)
    ->give(function (Application $app) {
          return [
              $app->make(NullFilter::class),
              $app->make(ProfanityFilter::class),
              $app->make(TooLongFilter::class),
          ];
    });
```

편의를 위해, `Firewall`이 `Filter` 인스턴스를 필요로 할 때 컨테이너가 해석할 클래스 이름 배열만 제공할 수도 있습니다:

```php
$this->app->when(Firewall::class)
    ->needs(Filter::class)
    ->give([
        NullFilter::class,
        ProfanityFilter::class,
        TooLongFilter::class,
    ]);
```


#### 가변 태그 의존성 {#variadic-tag-dependencies}

클래스가 특정 클래스(`Report ...$reports`)로 타입힌트된 가변 의존성을 가질 때가 있습니다. `needs`와 `giveTagged` 메서드를 사용하여 해당 [태그](#tagging)가 지정된 모든 컨테이너 바인딩을 쉽게 주입할 수 있습니다:

```php
$this->app->when(ReportAggregator::class)
    ->needs(Report::class)
    ->giveTagged('reports');
```


### 태깅 {#tagging}

때로는 특정 "카테고리"의 모든 바인딩을 해석해야 할 때가 있습니다. 예를 들어, 다양한 `Report` 인터페이스 구현체 배열을 받는 리포트 분석기를 만들고 있다고 가정해봅시다. `Report` 구현체를 등록한 후, `tag` 메서드를 사용하여 태그를 지정할 수 있습니다:

```php
$this->app->bind(CpuReport::class, function () {
    // ...
});

$this->app->bind(MemoryReport::class, function () {
    // ...
});

$this->app->tag([CpuReport::class, MemoryReport::class], 'reports');
```

서비스에 태그가 지정되면, 컨테이너의 `tagged` 메서드를 통해 모두 쉽게 해석할 수 있습니다:

```php
$this->app->bind(ReportAnalyzer::class, function (Application $app) {
    return new ReportAnalyzer($app->tagged('reports'));
});
```


### 바인딩 확장 {#extending-bindings}

`extend` 메서드를 사용하면 해석된 서비스를 수정할 수 있습니다. 예를 들어, 서비스가 해석될 때 추가 코드를 실행하여 서비스를 데코레이트하거나 설정할 수 있습니다. `extend` 메서드는 두 개의 인자를 받으며, 확장할 서비스 클래스와 수정된 서비스를 반환해야 하는 클로저입니다. 클로저는 해석 중인 서비스와 컨테이너 인스턴스를 받습니다:

```php
$this->app->extend(Service::class, function (Service $service, Application $app) {
    return new DecoratedService($service);
});
```


## 해석(Resolving) {#resolving}


### `make` 메서드 {#the-make-method}

`make` 메서드를 사용하여 컨테이너에서 클래스 인스턴스를 해석할 수 있습니다. `make` 메서드는 해석하려는 클래스 또는 인터페이스의 이름을 받습니다:

```php
use App\Services\Transistor;

$transistor = $this->app->make(Transistor::class);
```

클래스의 일부 의존성이 컨테이너를 통해 해석할 수 없는 경우, `makeWith` 메서드에 연관 배열로 전달하여 주입할 수 있습니다. 예를 들어, `Transistor` 서비스에 필요한 `$id` 생성자 인자를 수동으로 전달할 수 있습니다:

```php
use App\Services\Transistor;

$transistor = $this->app->makeWith(Transistor::class, ['id' => 1]);
```

`bound` 메서드를 사용하면 클래스나 인터페이스가 컨테이너에 명시적으로 바인딩되어 있는지 확인할 수 있습니다:

```php
if ($this->app->bound(Transistor::class)) {
    // ...
}
```

서비스 프로바이더 외부에서, `$app` 변수에 접근할 수 없는 코드 위치에서는 `App` [파사드](/laravel/12.x/facades)나 `app` [헬퍼](/laravel/12.x/helpers#method-app)를 사용하여 컨테이너에서 클래스 인스턴스를 해석할 수 있습니다:

```php
use App\Services\Transistor;
use Illuminate\Support\Facades\App;

$transistor = App::make(Transistor::class);

$transistor = app(Transistor::class);
```

컨테이너에서 해석되는 클래스에 Laravel 컨테이너 인스턴스 자체를 주입받고 싶다면, 클래스 생성자에서 `Illuminate\Container\Container` 클래스를 타입힌트하면 됩니다:

```php
use Illuminate\Container\Container;

/**
 * 새로운 클래스 인스턴스 생성.
 */
public function __construct(
    protected Container $container,
) {}
```


### 자동 주입 {#automatic-injection}

또한, 컨테이너에서 해석되는 클래스의 생성자에서 의존성을 타입힌트할 수 있습니다. 여기에는 [컨트롤러](/laravel/12.x/controllers), [이벤트 리스너](/laravel/12.x/events), [미들웨어](/laravel/12.x/middleware) 등이 포함됩니다. 또한, [큐 작업](/laravel/12.x/queues)의 `handle` 메서드에서도 의존성을 타입힌트할 수 있습니다. 실제로, 대부분의 객체는 이 방식으로 컨테이너에 의해 해석되어야 합니다.

예를 들어, 컨트롤러의 생성자에서 애플리케이션에 정의된 서비스를 타입힌트할 수 있습니다. 서비스는 자동으로 해석되어 클래스에 주입됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Services\AppleMusic;

class PodcastController extends Controller
{
    /**
     * 새로운 컨트롤러 인스턴스 생성.
     */
    public function __construct(
        protected AppleMusic $apple,
    ) {}

    /**
     * 주어진 팟캐스트에 대한 정보 표시.
     */
    public function show(string $id): Podcast
    {
        return $this->apple->findPodcast($id);
    }
}
```


## 메서드 호출 및 주입 {#method-invocation-and-injection}

때로는 객체 인스턴스의 메서드를 호출하면서, 컨테이너가 해당 메서드의 의존성을 자동으로 주입해주길 원할 수 있습니다. 예를 들어, 다음과 같은 클래스가 있다고 가정해봅시다:

```php
<?php

namespace App;

use App\Services\AppleMusic;

class PodcastStats
{
    /**
     * 새로운 팟캐스트 통계 리포트 생성.
     */
    public function generate(AppleMusic $apple): array
    {
        return [
            // ...
        ];
    }
}
```

컨테이너를 통해 `generate` 메서드를 다음과 같이 호출할 수 있습니다:

```php
use App\PodcastStats;
use Illuminate\Support\Facades\App;

$stats = App::call([new PodcastStats, 'generate']);
```

`call` 메서드는 어떤 PHP 콜러블도 받을 수 있습니다. 컨테이너의 `call` 메서드는 클로저를 호출하면서도 의존성을 자동으로 주입할 수 있습니다:

```php
use App\Services\AppleMusic;
use Illuminate\Support\Facades\App;

$result = App::call(function (AppleMusic $apple) {
    // ...
});
```


## 컨테이너 이벤트 {#container-events}

서비스 컨테이너는 객체를 해석할 때마다 이벤트를 발생시킵니다. `resolving` 메서드를 사용하여 이 이벤트를 청취할 수 있습니다:

```php
use App\Services\Transistor;
use Illuminate\Contracts\Foundation\Application;

$this->app->resolving(Transistor::class, function (Transistor $transistor, Application $app) {
    // 컨테이너가 "Transistor" 타입 객체를 해석할 때 호출됨...
});

$this->app->resolving(function (mixed $object, Application $app) {
    // 컨테이너가 어떤 타입의 객체든 해석할 때 호출됨...
});
```

보시다시피, 해석되는 객체가 콜백에 전달되어, 객체가 소비자에게 전달되기 전에 추가 속성을 설정할 수 있습니다.


### 리바인딩(Rebinding) {#rebinding}

`rebinding` 메서드를 사용하면 서비스가 컨테이너에 다시 바인딩(즉, 처음 바인딩된 후 다시 등록 또는 오버라이드)될 때를 감지할 수 있습니다. 이는 특정 바인딩이 업데이트될 때마다 의존성을 갱신하거나 동작을 수정해야 할 때 유용합니다:

```php
use App\Contracts\PodcastPublisher;
use App\Services\SpotifyPublisher;
use App\Services\TransistorPublisher;
use Illuminate\Contracts\Foundation\Application;

$this->app->bind(PodcastPublisher::class, SpotifyPublisher::class);

$this->app->rebinding(
    PodcastPublisher::class,
    function (Application $app, PodcastPublisher $newInstance) {
        //
    },
);

// 새로운 바인딩이 리바인딩 클로저를 트리거함...
$this->app->bind(PodcastPublisher::class, TransistorPublisher::class);
```


## PSR-11 {#psr-11}

Laravel의 서비스 컨테이너는 [PSR-11](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-11-container.md) 인터페이스를 구현합니다. 따라서 PSR-11 컨테이너 인터페이스를 타입힌트하여 Laravel 컨테이너 인스턴스를 얻을 수 있습니다:

```php
use App\Services\Transistor;
use Psr\Container\ContainerInterface;

Route::get('/', function (ContainerInterface $container) {
    $service = $container->get(Transistor::class);

    // ...
});
```

주어진 식별자를 해석할 수 없는 경우 예외가 발생합니다. 식별자가 한 번도 바인딩된 적이 없다면 `Psr\Container\NotFoundExceptionInterface` 인스턴스가, 식별자가 바인딩되었으나 해석할 수 없는 경우에는 `Psr\Container\ContainerExceptionInterface` 인스턴스가 발생합니다.
