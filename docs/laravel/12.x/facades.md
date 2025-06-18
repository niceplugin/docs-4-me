# [아키텍처개념] 파사드 (Facades)










## 소개 {#introduction}

Laravel 문서 전반에 걸쳐, "파사드(facade)"를 통해 Laravel의 다양한 기능과 상호작용하는 코드 예제를 자주 볼 수 있습니다. 파사드는 애플리케이션의 [서비스 컨테이너](/laravel/12.x/container)에 등록된 클래스에 "정적" 인터페이스를 제공합니다. Laravel은 거의 모든 기능에 접근할 수 있도록 다양한 파사드를 기본으로 제공합니다.

Laravel 파사드는 서비스 컨테이너에 있는 실제 클래스에 대한 "정적 프록시" 역할을 하며, 전통적인 정적 메서드보다 더 높은 테스트 용이성과 유연성을 유지하면서도 간결하고 표현력 있는 문법을 사용할 수 있게 해줍니다. 파사드가 어떻게 동작하는지 완전히 이해하지 못해도 괜찮으니, 일단 자연스럽게 따라가며 Laravel을 계속 학습해도 무방합니다.

Laravel의 모든 파사드는 `Illuminate\Support\Facades` 네임스페이스에 정의되어 있습니다. 따라서 아래와 같이 파사드를 쉽게 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/cache', function () {
    return Cache::get('key');
});
```

Laravel 문서 전반에 걸쳐 다양한 프레임워크 기능을 설명할 때 파사드를 활용한 예제가 자주 사용됩니다.


#### 헬퍼 함수 {#helper-functions}

파사드를 보완하기 위해, Laravel은 다양한 전역 "헬퍼 함수"를 제공하여 일반적인 Laravel 기능과 더욱 쉽게 상호작용할 수 있도록 돕습니다. 자주 사용되는 헬퍼 함수로는 `view`, `response`, `url`, `config` 등이 있습니다. Laravel에서 제공하는 각 헬퍼 함수는 해당 기능의 문서에서 함께 설명되어 있지만, 모든 헬퍼 함수의 전체 목록은 별도의 [헬퍼 함수 문서](/laravel/12.x/helpers)에서 확인할 수 있습니다.

예를 들어, JSON 응답을 생성할 때 `Illuminate\Support\Facades\Response` 파사드를 사용하는 대신, `response` 헬퍼 함수를 간단히 사용할 수 있습니다. 헬퍼 함수는 전역적으로 사용할 수 있으므로, 별도의 클래스를 import할 필요가 없습니다.

```php
use Illuminate\Support\Facades\Response;

Route::get('/users', function () {
    return Response::json([
        // ...
    ]);
});

Route::get('/users', function () {
    return response()->json([
        // ...
    ]);
});
```


## 파사드를 언제 활용해야 할까 {#when-to-use-facades}

파사드는 여러 가지 장점을 가지고 있습니다. 간결하고 기억하기 쉬운 문법을 제공하여, 복잡한 클래스 이름을 기억하거나 수동으로 주입하거나 설정할 필요 없이 Laravel의 다양한 기능을 사용할 수 있게 해줍니다. 또한, PHP의 동적 메서드 방식을 활용하기 때문에 테스트도 용이합니다.

하지만 파사드를 사용할 때는 몇 가지 주의할 점이 있습니다. 파사드의 주요 위험성은 클래스의 "책임 범위(scope)"가 점점 커질 수 있다는 것입니다. 파사드는 사용이 매우 간편하고 의존성 주입이 필요 없기 때문에, 한 클래스에서 여러 파사드를 무분별하게 사용하며 클래스가 점점 비대해질 수 있습니다. 반면, 의존성 주입을 사용할 경우 생성자가 커지면서 클래스가 너무 커지고 있다는 시각적 신호를 받을 수 있습니다. 따라서 파사드를 사용할 때는 클래스의 크기에 특별히 주의를 기울여, 클래스의 책임 범위가 좁게 유지되도록 해야 합니다. 만약 클래스가 너무 커진다면, 여러 개의 더 작은 클래스로 분리하는 것을 고려하세요.


### 파사드 vs. 의존성 주입 {#facades-vs-dependency-injection}

의존성 주입의 주요 장점 중 하나는 주입된 클래스의 구현체를 쉽게 교체할 수 있다는 점입니다. 이는 테스트 시에 특히 유용한데, 모의(mock) 객체나 스텁(stub)을 주입하여 특정 메서드가 호출되었는지 검증할 수 있기 때문입니다.

일반적으로, 진짜 정적(static) 클래스 메서드는 모킹(mocking)이나 스텁(stubbing)이 불가능합니다. 하지만 파사드는 동적 메서드를 사용해 서비스 컨테이너에서 객체를 해결하고 메서드 호출을 프록시하기 때문에, 실제로는 주입된 클래스 인스턴스를 테스트하는 것과 동일하게 파사드도 테스트할 수 있습니다. 예를 들어, 다음과 같은 라우트가 있다고 가정해봅시다:

```php
use Illuminate\Support\Facades\Cache;

Route::get('/cache', function () {
    return Cache::get('key');
});
```

Laravel의 파사드 테스트 메서드를 사용하면, 아래와 같이 `Cache::get` 메서드가 기대한 인자로 호출되었는지 검증하는 테스트를 작성할 수 있습니다:
::: code-group
```php [Pest]
use Illuminate\Support\Facades\Cache;

test('basic example', function () {
    Cache::shouldReceive('get')
        ->with('key')
        ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
});
```

```php [PHPUnit]
use Illuminate\Support\Facades\Cache;

/**
 * 기본 기능 테스트 예제.
 */
public function test_basic_example(): void
{
    Cache::shouldReceive('get')
        ->with('key')
        ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
}
```
:::

### 파사드 vs. 헬퍼 함수 {#facades-vs-helper-functions}

파사드 외에도, Laravel은 뷰 생성, 이벤트 발생, 작업 디스패치, HTTP 응답 전송 등과 같은 일반적인 작업을 수행할 수 있는 다양한 "헬퍼" 함수를 제공합니다. 이러한 헬퍼 함수 중 상당수는 해당 파사드와 동일한 기능을 수행합니다. 예를 들어, 아래의 파사드 호출과 헬퍼 함수 호출은 완전히 동일합니다:

```php
return Illuminate\Support\Facades\View::make('profile');

return view('profile');
```

파사드와 헬퍼 함수 사이에는 실질적인 차이가 전혀 없습니다. 헬퍼 함수를 사용할 때도, 해당 파사드를 사용할 때와 마찬가지로 동일하게 테스트할 수 있습니다. 예를 들어, 다음과 같은 라우트가 있다고 가정해봅시다:

```php
Route::get('/cache', function () {
    return cache('key');
});
```

`cache` 헬퍼 함수는 내부적으로 `Cache` 파사드의 기반 클래스의 `get` 메서드를 호출합니다. 따라서 헬퍼 함수를 사용하더라도, 아래와 같이 기대한 인자로 메서드가 호출되었는지 검증하는 테스트를 작성할 수 있습니다:

```php
use Illuminate\Support\Facades\Cache;

/**
 * 기본 기능 테스트 예제.
 */
public function test_basic_example(): void
{
    Cache::shouldReceive('get')
        ->with('key')
        ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
}
```


## 파사드는 어떻게 동작하는가 {#how-facades-work}

Laravel 애플리케이션에서 파사드는 컨테이너에 등록된 객체에 접근할 수 있도록 해주는 클래스입니다. 이러한 동작을 가능하게 하는 핵심은 `Facade` 클래스에 있습니다. Laravel의 모든 파사드와, 여러분이 직접 만드는 커스텀 파사드는 기본적으로 `Illuminate\Support\Facades\Facade` 클래스를 확장합니다.

`Facade` 기본 클래스는 `__callStatic()` 매직 메서드를 활용하여, 파사드에서 호출된 메서드를 컨테이너에서 해결된 객체로 위임합니다. 아래 예시에서는 Laravel의 캐시 시스템에 접근하는 코드가 있습니다. 이 코드를 보면, 마치 `Cache` 클래스의 정적 `get` 메서드를 호출하는 것처럼 보일 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 주어진 사용자의 프로필을 보여줍니다.
     */
    public function showProfile(string $id): View
    {
        $user = Cache::get('user:'.$id);

        return view('profile', ['user' => $user]);
    }
}
```

파일 상단에서 `Cache` 파사드를 "import"하고 있는 것을 볼 수 있습니다. 이 파사드는 실제로 `Illuminate\Contracts\Cache\Factory` 인터페이스의 구현체에 접근할 수 있도록 프록시 역할을 합니다. 파사드를 통해 호출하는 모든 메서드는 Laravel의 캐시 서비스의 실제 인스턴스로 전달됩니다.

`Illuminate\Support\Facades\Cache` 클래스를 살펴보면, 실제로 정적 메서드 `get`이 정의되어 있지 않다는 것을 알 수 있습니다:

```php
class Cache extends Facade
{
    /**
     * 컴포넌트의 등록된 이름을 반환합니다.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'cache';
    }
}
```

대신, `Cache` 파사드는 기본 `Facade` 클래스를 확장하고, `getFacadeAccessor()` 메서드를 정의합니다. 이 메서드는 서비스 컨테이너 바인딩의 이름을 반환하는 역할을 합니다. 사용자가 `Cache` 파사드에서 어떤 정적 메서드를 참조하면, Laravel은 [서비스 컨테이너](/laravel/12.x/container)에서 `cache` 바인딩을 해결하고, 해당 객체에 대해 요청된 메서드(이 예시에서는 `get`)를 실행합니다.


## 실시간 파사드(Real-Time Facades) {#real-time-facades}

실시간 파사드(Real-Time Facades)를 사용하면, 애플리케이션 내의 어떤 클래스든 마치 파사드처럼 사용할 수 있습니다. 이를 어떻게 활용할 수 있는지 살펴보기 위해, 먼저 실시간 파사드를 사용하지 않은 코드를 살펴보겠습니다. 예를 들어, `Podcast` 모델에 `publish` 메서드가 있다고 가정해봅시다. 하지만 팟캐스트를 발행하려면 `Publisher` 인스턴스를 주입받아야 합니다:

```php
<?php

namespace App\Models;

use App\Contracts\Publisher;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    /**
     * 팟캐스트를 발행합니다.
     */
    public function publish(Publisher $publisher): void
    {
        $this->update(['publishing' => now()]);

        $publisher->publish($this);
    }
}
```

이렇게 메서드에 퍼블리셔 구현체를 주입하면, 주입된 퍼블리셔를 모킹(mock)하여 메서드를 독립적으로 쉽게 테스트할 수 있습니다. 하지만, `publish` 메서드를 호출할 때마다 항상 퍼블리셔 인스턴스를 전달해야 한다는 번거로움이 있습니다. 실시간 파사드를 사용하면, 동일한 테스트 용이성을 유지하면서도 명시적으로 `Publisher` 인스턴스를 전달할 필요가 없습니다. 실시간 파사드를 생성하려면, import하는 클래스의 네임스페이스 앞에 `Facades`를 붙이면 됩니다:

```php
<?php

namespace App\Models;

use App\Contracts\Publisher; // [!code --]
use Facades\App\Contracts\Publisher; // [!code ++]
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    /**
     * 팟캐스트를 발행합니다.
     */
    public function publish(Publisher $publisher): void // [!code --]
    public function publish(): void // [!code ++]
    {
        $this->update(['publishing' => now()]);
        $publisher->publish($this); // [!code --]
        Publisher::publish($this); // [!code ++]
    }
}
```

실시간 파사드를 사용하면, `Facades` 접두사 뒤에 오는 인터페이스 또는 클래스 이름을 기준으로 서비스 컨테이너에서 해당 구현체가 해결됩니다. 테스트 시에는 Laravel의 내장 파사드 테스트 헬퍼를 사용해 이 메서드 호출을 모킹할 수 있습니다.
::: code-group
```php [Pest]
<?php

use App\Models\Podcast;
use Facades\App\Contracts\Publisher;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('podcast can be published', function () {
    $podcast = Podcast::factory()->create();

    Publisher::shouldReceive('publish')->once()->with($podcast);

    $podcast->publish();
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Models\Podcast;
use Facades\App\Contracts\Publisher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PodcastTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A test example.
     */
    public function test_podcast_can_be_published(): void
    {
        $podcast = Podcast::factory()->create();

        Publisher::shouldReceive('publish')->once()->with($podcast);

        $podcast->publish();
    }
}
```
:::

## 파사드 클래스 참조 {#facade-class-reference}

아래에는 모든 파사드와 그에 대응하는 실제 클래스가 나열되어 있습니다. 이 표는 특정 파사드의 루트 클래스에 대한 API 문서를 빠르게 찾아보고 싶을 때 유용하게 사용할 수 있습니다. 해당되는 경우, [서비스 컨테이너 바인딩](/laravel/12.x/container) 키도 함께 포함되어 있습니다.

<div class="overflow-auto">

| Facade | Class | Service Container Binding |
| --- | --- | --- |
| App | [Illuminate\Foundation\Application](https://api.laravel.com/docs/12.x/Illuminate/Foundation/Application.html) | `app` |
| Artisan | [Illuminate\Contracts\Console\Kernel](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Console/Kernel.html) | `artisan` |
| Auth (Instance) | [Illuminate\Contracts\Auth\Guard](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Auth/Guard.html) | `auth.driver` |
| Auth | [Illuminate\Auth\AuthManager](https://api.laravel.com/docs/12.x/Illuminate/Auth/AuthManager.html) | `auth` |
| Blade | [Illuminate\View\Compilers\BladeCompiler](https://api.laravel.com/docs/12.x/Illuminate/View/Compilers/BladeCompiler.html) | `blade.compiler` |
| Broadcast (Instance) | [Illuminate\Contracts\Broadcasting\Broadcaster](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Broadcasting/Broadcaster.html) | &nbsp; |
| Broadcast | [Illuminate\Contracts\Broadcasting\Factory](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Broadcasting/Factory.html) | &nbsp; |
| Bus | [Illuminate\Contracts\Bus\Dispatcher](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Bus/Dispatcher.html) | &nbsp; |
| Cache (Instance) | [Illuminate\Cache\Repository](https://api.laravel.com/docs/12.x/Illuminate/Cache/Repository.html) | `cache.store` |
| Cache | [Illuminate\Cache\CacheManager](https://api.laravel.com/docs/12.x/Illuminate/Cache/CacheManager.html) | `cache` |
| Config | [Illuminate\Config\Repository](https://api.laravel.com/docs/12.x/Illuminate/Config/Repository.html) | `config` |
| Context | [Illuminate\Log\Context\Repository](https://api.laravel.com/docs/12.x/Illuminate/Log/Context/Repository.html) | &nbsp; |
| Cookie | [Illuminate\Cookie\CookieJar](https://api.laravel.com/docs/12.x/Illuminate/Cookie/CookieJar.html) | `cookie` |
| Crypt | [Illuminate\Encryption\Encrypter](https://api.laravel.com/docs/12.x/Illuminate/Encryption/Encrypter.html) | `encrypter` |
| Date | [Illuminate\Support\DateFactory](https://api.laravel.com/docs/12.x/Illuminate/Support/DateFactory.html) | `date` |
| DB (Instance) | [Illuminate\Database\Connection](https://api.laravel.com/docs/12.x/Illuminate/Database/Connection.html) | `db.connection` |
| DB | [Illuminate\Database\DatabaseManager](https://api.laravel.com/docs/12.x/Illuminate/Database/DatabaseManager.html) | `db` |
| Event | [Illuminate\Events\Dispatcher](https://api.laravel.com/docs/12.x/Illuminate/Events/Dispatcher.html) | `events` |
| Exceptions (Instance) | [Illuminate\Contracts\Debug\ExceptionHandler](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Debug/ExceptionHandler.html) | &nbsp; |
| Exceptions | [Illuminate\Foundation\Exceptions\Handler](https://api.laravel.com/docs/12.x/Illuminate/Foundation/Exceptions/Handler.html) | &nbsp; |
| File | [Illuminate\Filesystem\Filesystem](https://api.laravel.com/docs/12.x/Illuminate/Filesystem/Filesystem.html) | `files` |
| Gate | [Illuminate\Contracts\Auth\Access\Gate](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Auth/Access/Gate.html) | &nbsp; |
| Hash | [Illuminate\Contracts\Hashing\Hasher](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Hashing/Hasher.html) | `hash` |
| Http | [Illuminate\Http\Client\Factory](https://api.laravel.com/docs/12.x/Illuminate/Http/Client/Factory.html) | &nbsp; |
| Lang | [Illuminate\Translation\Translator](https://api.laravel.com/docs/12.x/Illuminate/Translation/Translator.html) | `translator` |
| Log | [Illuminate\Log\LogManager](https://api.laravel.com/docs/12.x/Illuminate/Log/LogManager.html) | `log` |
| Mail | [Illuminate\Mail\Mailer](https://api.laravel.com/docs/12.x/Illuminate/Mail/Mailer.html) | `mailer` |
| Notification | [Illuminate\Notifications\ChannelManager](https://api.laravel.com/docs/12.x/Illuminate/Notifications/ChannelManager.html) | &nbsp; |
| Password (Instance) | [Illuminate\Auth\Passwords\PasswordBroker](https://api.laravel.com/docs/12.x/Illuminate/Auth/Passwords/PasswordBroker.html) | `auth.password.broker` |
| Password | [Illuminate\Auth\Passwords\PasswordBrokerManager](https://api.laravel.com/docs/12.x/Illuminate/Auth/Passwords/PasswordBrokerManager.html) | `auth.password` |
| Pipeline (Instance) | [Illuminate\Pipeline\Pipeline](https://api.laravel.com/docs/12.x/Illuminate/Pipeline/Pipeline.html) | &nbsp; |
| Process | [Illuminate\Process\Factory](https://api.laravel.com/docs/12.x/Illuminate/Process/Factory.html) | &nbsp; |
| Queue (Base Class) | [Illuminate\Queue\Queue](https://api.laravel.com/docs/12.x/Illuminate/Queue/Queue.html) | &nbsp; |
| Queue (Instance) | [Illuminate\Contracts\Queue\Queue](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Queue/Queue.html) | `queue.connection` |
| Queue | [Illuminate\Queue\QueueManager](https://api.laravel.com/docs/12.x/Illuminate/Queue/QueueManager.html) | `queue` |
| RateLimiter | [Illuminate\Cache\RateLimiter](https://api.laravel.com/docs/12.x/Illuminate/Cache/RateLimiter.html) | &nbsp; |
| Redirect | [Illuminate\Routing\Redirector](https://api.laravel.com/docs/12.x/Illuminate/Routing/Redirector.html) | `redirect` |
| Redis (Instance) | [Illuminate\Redis\Connections\Connection](https://api.laravel.com/docs/12.x/Illuminate/Redis/Connections/Connection.html) | `redis.connection` |
| Redis | [Illuminate\Redis\RedisManager](https://api.laravel.com/docs/12.x/Illuminate/Redis/RedisManager.html) | `redis` |
| Request | [Illuminate\Http\Request](https://api.laravel.com/docs/12.x/Illuminate/Http/Request.html) | `request` |
| Response (Instance) | [Illuminate\Http\Response](https://api.laravel.com/docs/12.x/Illuminate/Http/Response.html) | &nbsp; |
| Response | [Illuminate\Contracts\Routing\ResponseFactory](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Routing/ResponseFactory.html) | &nbsp; |
| Route | [Illuminate\Routing\Router](https://api.laravel.com/docs/12.x/Illuminate/Routing/Router.html) | `router` |
| Schedule | [Illuminate\Console\Scheduling\Schedule](https://api.laravel.com/docs/12.x/Illuminate/Console/Scheduling/Schedule.html) | &nbsp; |
| Schema | [Illuminate\Database\Schema\Builder](https://api.laravel.com/docs/12.x/Illuminate/Database/Schema/Builder.html) | &nbsp; |
| Session (Instance) | [Illuminate\Session\Store](https://api.laravel.com/docs/12.x/Illuminate/Session/Store.html) | `session.store` |
| Session | [Illuminate\Session\SessionManager](https://api.laravel.com/docs/12.x/Illuminate/Session/SessionManager.html) | `session` |
| Storage (Instance) | [Illuminate\Contracts\Filesystem\Filesystem](https://api.laravel.com/docs/12.x/Illuminate/Contracts/Filesystem/Filesystem.html) | `filesystem.disk` |
| Storage | [Illuminate\Filesystem\FilesystemManager](https://api.laravel.com/docs/12.x/Illuminate/Filesystem/FilesystemManager.html) | `filesystem` |
| URL | [Illuminate\Routing\UrlGenerator](https://api.laravel.com/docs/12.x/Illuminate/Routing/UrlGenerator.html) | `url` |
| Validator (Instance) | [Illuminate\Validation\Validator](https://api.laravel.com/docs/12.x/Illuminate/Validation/Validator.html) | &nbsp; |
| Validator | [Illuminate\Validation\Factory](https://api.laravel.com/docs/12.x/Illuminate/Validation/Factory.html) | `validator` |
| View (Instance) | [Illuminate\View\View](https://api.laravel.com/docs/12.x/Illuminate/View/View.html) | &nbsp; |
| View | [Illuminate\View\Factory](https://api.laravel.com/docs/12.x/Illuminate/View/Factory.html) | `view` |
| Vite | [Illuminate\Foundation\Vite](https://api.laravel.com/docs/12.x/Illuminate/Foundation/Vite.html) | &nbsp; |

</div>
