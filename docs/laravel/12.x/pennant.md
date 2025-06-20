# Laravel Pennant

































## 소개 {#introduction}

[Laravel Pennant](https://github.com/laravel/pennant)는 불필요한 요소 없이 간단하고 가벼운 기능 플래그 패키지입니다. 기능 플래그를 사용하면 새로운 애플리케이션 기능을 점진적으로 자신 있게 롤아웃하고, 새로운 인터페이스 디자인을 A/B 테스트하며, trunk 기반 개발 전략을 보완하는 등 다양한 작업을 수행할 수 있습니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 사용하여 Pennant를 프로젝트에 설치하세요:

```shell
composer require laravel/pennant
```

다음으로, `vendor:publish` Artisan 명령어를 사용하여 Pennant의 설정 및 마이그레이션 파일을 퍼블리시해야 합니다:

```shell
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
```

마지막으로, 애플리케이션의 데이터베이스 마이그레이션을 실행해야 합니다. 이 작업은 Pennant가 `database` 드라이버에서 사용하는 `features` 테이블을 생성합니다:

```shell
php artisan migrate
```


## 설정 {#configuration}

Pennant의 에셋을 퍼블리시한 후, 설정 파일은 `config/pennant.php`에 위치하게 됩니다. 이 설정 파일을 통해 Pennant가 기능 플래그 값을 저장할 때 사용할 기본 저장소 방식을 지정할 수 있습니다.

Pennant는 `array` 드라이버를 통해 인메모리 배열에 기능 플래그 값을 저장하는 것을 지원합니다. 또는, Pennant는 `database` 드라이버를 통해 관계형 데이터베이스에 기능 플래그 값을 영구적으로 저장할 수도 있습니다. `database` 드라이버가 Pennant의 기본 저장소 방식입니다.


## 기능 정의 {#defining-features}

기능을 정의하려면, `Feature` 파사드에서 제공하는 `define` 메서드를 사용할 수 있습니다. 기능의 이름과, 기능의 초기 값을 결정할 클로저를 제공해야 합니다.

일반적으로 기능은 서비스 프로바이더에서 `Feature` 파사드를 사용해 정의합니다. 클로저는 기능 확인을 위한 "스코프"를 전달받습니다. 대부분의 경우, 스코프는 현재 인증된 사용자입니다. 아래 예시에서는 애플리케이션 사용자에게 새로운 API를 점진적으로 롤아웃하는 기능을 정의합니다:

```php
<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Lottery;
use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Feature::define('new-api', fn (User $user) => match (true) {
            $user->isInternalTeamMember() => true,
            $user->isHighTrafficCustomer() => false,
            default => Lottery::odds(1 / 100),
        });
    }
}
```

위에서 볼 수 있듯이, 기능에 대한 규칙은 다음과 같습니다:

- 모든 내부 팀원은 새로운 API를 사용해야 합니다.
- 트래픽이 많은 고객은 새로운 API를 사용하지 않아야 합니다.
- 그 외의 경우, 1/100 확률로 기능이 활성화된 사용자에게 무작위로 할당됩니다.

특정 사용자에 대해 `new-api` 기능이 처음 확인될 때, 클로저의 결과가 저장소 드라이버에 의해 저장됩니다. 이후 동일한 사용자에 대해 기능이 다시 확인되면, 값은 저장소에서 조회되며 클로저는 다시 호출되지 않습니다.

편의를 위해, 기능 정의가 로터리만 반환한다면 클로저를 생략할 수 있습니다:

    Feature::define('site-redesign', Lottery::odds(1, 1000));


### 클래스 기반 기능 {#class-based-features}

Pennant는 클래스 기반 기능 정의도 지원합니다. 클로저 기반 기능 정의와 달리, 클래스 기반 기능은 서비스 프로바이더에 등록할 필요가 없습니다. 클래스 기반 기능을 생성하려면 `pennant:feature` Artisan 명령어를 실행하세요. 기본적으로 기능 클래스는 애플리케이션의 `app/Features` 디렉터리에 생성됩니다:

```shell
php artisan pennant:feature NewApi
```

기능 클래스를 작성할 때는, 주어진 스코프에 대해 기능의 초기 값을 결정하는 `resolve` 메서드만 정의하면 됩니다. 역시 스코프는 일반적으로 현재 인증된 사용자입니다:

```php
<?php

namespace App\Features;

use App\Models\User;
use Illuminate\Support\Lottery;

class NewApi
{
    /**
     * Resolve the feature's initial value.
     */
    public function resolve(User $user): mixed
    {
        return match (true) {
            $user->isInternalTeamMember() => true,
            $user->isHighTrafficCustomer() => false,
            default => Lottery::odds(1 / 100),
        };
    }
}
```

클래스 기반 기능의 인스턴스를 수동으로 해석하고 싶다면, `Feature` 파사드의 `instance` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Feature;

$instance = Feature::instance(NewApi::class);
```

> [!NOTE]
> 기능 클래스는 [컨테이너](/laravel/12.x/container)를 통해 해석되므로, 필요하다면 생성자에 의존성을 주입할 수 있습니다.

#### 저장되는 기능 이름 커스터마이징

기본적으로 Pennant는 기능 클래스의 전체 네임스페이스가 포함된 클래스 이름을 저장합니다. 저장되는 기능 이름을 애플리케이션의 내부 구조와 분리하고 싶다면, 기능 클래스에 `$name` 프로퍼티를 지정할 수 있습니다. 이 프로퍼티의 값이 클래스 이름 대신 저장됩니다:

```php
<?php

namespace App\Features;

class NewApi
{
    /**
     * The stored name of the feature.
     *
     * @var string
     */
    public $name = 'new-api';

    // ...
}
```


## 기능 확인 {#checking-features}

기능이 활성화되어 있는지 확인하려면, `Feature` 파사드의 `active` 메서드를 사용할 수 있습니다. 기본적으로 기능은 현재 인증된 사용자에 대해 확인됩니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Pennant\Feature;

class PodcastController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        return Feature::active('new-api')
            ? $this->resolveNewApiResponse($request)
            : $this->resolveLegacyApiResponse($request);
    }

    // ...
}
```

기본적으로 기능은 현재 인증된 사용자에 대해 확인되지만, 다른 사용자나 [스코프](#scope)에 대해 기능을 확인할 수도 있습니다. 이를 위해 `Feature` 파사드의 `for` 메서드를 사용하세요:

```php
return Feature::for($user)->active('new-api')
    ? $this->resolveNewApiResponse($request)
    : $this->resolveLegacyApiResponse($request);
```

Pennant는 기능이 활성화되어 있는지 여부를 확인할 때 유용한 추가 편의 메서드도 제공합니다:

```php
// 주어진 모든 기능이 활성화되어 있는지 확인...
Feature::allAreActive(['new-api', 'site-redesign']);

// 주어진 기능 중 하나라도 활성화되어 있는지 확인...
Feature::someAreActive(['new-api', 'site-redesign']);

// 기능이 비활성화되어 있는지 확인...
Feature::inactive('new-api');

// 주어진 모든 기능이 비활성화되어 있는지 확인...
Feature::allAreInactive(['new-api', 'site-redesign']);

// 주어진 기능 중 하나라도 비활성화되어 있는지 확인...
Feature::someAreInactive(['new-api', 'site-redesign']);
```

> [!NOTE]
> Artisan 명령어나 큐 작업 등 HTTP 컨텍스트 외부에서 Pennant를 사용할 때는 [기능의 스코프를 명시적으로 지정](#specifying-the-scope)해야 합니다. 또는, 인증된 HTTP 컨텍스트와 인증되지 않은 컨텍스트 모두를 고려하는 [기본 스코프](#default-scope)를 정의할 수도 있습니다.


#### 클래스 기반 기능 확인 {#checking-class-based-features}

클래스 기반 기능의 경우, 기능을 확인할 때 클래스 이름을 제공해야 합니다:

```php
<?php

namespace App\Http\Controllers;

use App\Features\NewApi;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Pennant\Feature;

class PodcastController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        return Feature::active(NewApi::class)
            ? $this->resolveNewApiResponse($request)
            : $this->resolveLegacyApiResponse($request);
    }

    // ...
}
```


### 조건부 실행 {#conditional-execution}

`when` 메서드를 사용하면, 기능이 활성화된 경우 주어진 클로저를 유연하게 실행할 수 있습니다. 또한, 두 번째 클로저를 제공하면 기능이 비활성화된 경우 실행됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Features\NewApi;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Pennant\Feature;

class PodcastController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        return Feature::when(NewApi::class,
            fn () => $this->resolveNewApiResponse($request),
            fn () => $this->resolveLegacyApiResponse($request),
        );
    }

    // ...
}
```

`unless` 메서드는 `when` 메서드의 반대로, 기능이 비활성화된 경우 첫 번째 클로저를 실행합니다:

```php
return Feature::unless(NewApi::class,
    fn () => $this->resolveLegacyApiResponse($request),
    fn () => $this->resolveNewApiResponse($request),
);
```


### `HasFeatures` 트레이트 {#the-has-features-trait}

Pennant의 `HasFeatures` 트레이트를 애플리케이션의 `User` 모델(또는 기능을 가지는 다른 모델)에 추가하면, 모델에서 직접 기능을 확인할 수 있는 유연하고 편리한 방법을 제공합니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Pennant\Concerns\HasFeatures;

class User extends Authenticatable
{
    use HasFeatures;

    // ...
}
```

트레이트를 모델에 추가한 후에는, `features` 메서드를 호출하여 쉽게 기능을 확인할 수 있습니다:

```php
if ($user->features()->active('new-api')) {
    // ...
}
```

물론, `features` 메서드는 기능과 상호작용할 수 있는 다양한 편의 메서드도 제공합니다:

```php
// 값 조회...
$value = $user->features()->value('purchase-button')
$values = $user->features()->values(['new-api', 'purchase-button']);

// 상태 확인...
$user->features()->active('new-api');
$user->features()->allAreActive(['new-api', 'server-api']);
$user->features()->someAreActive(['new-api', 'server-api']);

$user->features()->inactive('new-api');
$user->features()->allAreInactive(['new-api', 'server-api']);
$user->features()->someAreInactive(['new-api', 'server-api']);

// 조건부 실행...
$user->features()->when('new-api',
    fn () => /* ... */,
    fn () => /* ... */,
);

$user->features()->unless('new-api',
    fn () => /* ... */,
    fn () => /* ... */,
);
```


### Blade 디렉티브 {#blade-directive}

Blade에서 기능 확인을 원활하게 하기 위해, Pennant는 `@feature` 및 `@featureany` 디렉티브를 제공합니다:

```blade
@feature('site-redesign')
    <!-- 'site-redesign'가 활성화됨 -->
@else
    <!-- 'site-redesign'가 비활성화됨 -->
@endfeature

@featureany(['site-redesign', 'beta'])
    <!-- 'site-redesign' 또는 `beta`가 활성화됨 -->
@endfeatureany
```


### 미들웨어 {#middleware}

Pennant는 [미들웨어](/laravel/12.x/middleware)도 포함하고 있어, 라우트가 호출되기 전에 현재 인증된 사용자가 기능에 접근할 수 있는지 확인할 수 있습니다. 미들웨어를 라우트에 할당하고, 라우트에 접근하기 위해 필요한 기능을 지정할 수 있습니다. 지정된 기능 중 하나라도 현재 인증된 사용자에게 비활성화되어 있다면, 라우트는 `400 Bad Request` HTTP 응답을 반환합니다. 여러 기능은 static `using` 메서드에 전달할 수 있습니다.

```php
use Illuminate\Support\Facades\Route;
use Laravel\Pennant\Middleware\EnsureFeaturesAreActive;

Route::get('/api/servers', function () {
    // ...
})->middleware(EnsureFeaturesAreActive::using('new-api', 'servers-api'));
```


#### 응답 커스터마이징 {#customizing-the-response}

나열된 기능 중 하나가 비활성화된 경우 미들웨어가 반환하는 응답을 커스터마이징하고 싶다면, `EnsureFeaturesAreActive` 미들웨어에서 제공하는 `whenInactive` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 서비스 프로바이더 중 하나의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Laravel\Pennant\Middleware\EnsureFeaturesAreActive;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    EnsureFeaturesAreActive::whenInactive(
        function (Request $request, array $features) {
            return new Response(status: 403);
        }
    );

    // ...
}
```


### 기능 확인 가로채기 {#intercepting-feature-checks}

때로는 특정 기능의 저장된 값을 조회하기 전에 인메모리에서 확인을 수행하는 것이 유용할 수 있습니다. 예를 들어, 기능 플래그 뒤에 새로운 API를 개발 중이고, 저장된 기능 값은 그대로 두면서 새로운 API를 비활성화할 수 있는 기능이 필요할 수 있습니다. 새로운 API에서 버그를 발견했다면, 내부 팀원을 제외한 모든 사용자에게 쉽게 비활성화하고, 버그를 수정한 후 이전에 기능에 접근할 수 있었던 사용자에게 다시 활성화할 수 있습니다.

이러한 경우 [클래스 기반 기능](#class-based-features)의 `before` 메서드를 사용할 수 있습니다. 이 메서드가 존재하면, 항상 인메모리에서 저장된 값을 조회하기 전에 실행됩니다. 메서드에서 `null`이 아닌 값을 반환하면, 해당 요청 동안 기능의 저장된 값 대신 사용됩니다:

```php
<?php

namespace App\Features;

use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Lottery;

class NewApi
{
    /**
     * Run an always-in-memory check before the stored value is retrieved.
     */
    public function before(User $user): mixed
    {
        if (Config::get('features.new-api.disabled')) {
            return $user->isInternalTeamMember();
        }
    }

    /**
     * Resolve the feature's initial value.
     */
    public function resolve(User $user): mixed
    {
        return match (true) {
            $user->isInternalTeamMember() => true,
            $user->isHighTrafficCustomer() => false,
            default => Lottery::odds(1 / 100),
        };
    }
}
```

이 기능을 사용해 이전에 기능 플래그 뒤에 있던 기능의 전역 롤아웃을 예약할 수도 있습니다:

```php
<?php

namespace App\Features;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

class NewApi
{
    /**
     * Run an always-in-memory check before the stored value is retrieved.
     */
    public function before(User $user): mixed
    {
        if (Config::get('features.new-api.disabled')) {
            return $user->isInternalTeamMember();
        }

        if (Carbon::parse(Config::get('features.new-api.rollout-date'))->isPast()) {
            return true;
        }
    }

    // ...
}
```


### 인메모리 캐시 {#in-memory-cache}

기능을 확인할 때, Pennant는 결과의 인메모리 캐시를 생성합니다. `database` 드라이버를 사용하는 경우, 하나의 요청 내에서 동일한 기능 플래그를 다시 확인해도 추가적인 데이터베이스 쿼리가 발생하지 않습니다. 또한, 요청이 진행되는 동안 기능의 결과가 일관되게 유지됩니다.

인메모리 캐시를 수동으로 비우고 싶다면, `Feature` 파사드의 `flushCache` 메서드를 사용할 수 있습니다:

```php
Feature::flushCache();
```


## 스코프 {#scope}


### 스코프 지정 {#specifying-the-scope}

앞서 설명했듯이, 기능은 일반적으로 현재 인증된 사용자에 대해 확인됩니다. 하지만 항상 이 방식이 적합하지 않을 수 있습니다. 따라서, `Feature` 파사드의 `for` 메서드를 통해 특정 기능을 확인할 스코프를 지정할 수 있습니다:

```php
return Feature::for($user)->active('new-api')
    ? $this->resolveNewApiResponse($request)
    : $this->resolveLegacyApiResponse($request);
```

물론, 기능 스코프는 "사용자"에만 국한되지 않습니다. 예를 들어, 전체 팀에 대해 새로운 결제 경험을 롤아웃하고 싶을 수 있습니다. 오래된 팀에는 더 느리게, 새로운 팀에는 더 빠르게 롤아웃하고 싶다면, 기능 해석 클로저는 다음과 같이 작성할 수 있습니다:

```php
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Support\Lottery;
use Laravel\Pennant\Feature;

Feature::define('billing-v2', function (Team $team) {
    if ($team->created_at->isAfter(new Carbon('1st Jan, 2023'))) {
        return true;
    }

    if ($team->created_at->isAfter(new Carbon('1st Jan, 2019'))) {
        return Lottery::odds(1 / 100);
    }

    return Lottery::odds(1 / 1000);
});
```

정의한 클로저가 `User`가 아닌 `Team` 모델을 기대한다는 점에 주목하세요. 사용자의 팀에 대해 이 기능이 활성화되어 있는지 확인하려면, `Feature` 파사드의 `for` 메서드에 팀을 전달해야 합니다:

```php
if (Feature::for($user->team)->active('billing-v2')) {
    return redirect('/billing/v2');
}

// ...
```


### 기본 스코프 {#default-scope}

Pennant가 기능을 확인할 때 사용하는 기본 스코프를 커스터마이징할 수도 있습니다. 예를 들어, 모든 기능을 현재 인증된 사용자의 팀에 대해 확인하고 싶을 수 있습니다. 매번 `Feature::for($user->team)`를 호출하는 대신, 팀을 기본 스코프로 지정할 수 있습니다. 일반적으로 이 작업은 애플리케이션의 서비스 프로바이더 중 하나에서 수행해야 합니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Feature::resolveScopeUsing(fn ($driver) => Auth::user()?->team);

        // ...
    }
}
```

`for` 메서드를 통해 스코프가 명시적으로 제공되지 않으면, 이제 기능 확인은 현재 인증된 사용자의 팀을 기본 스코프로 사용합니다:

```php
Feature::active('billing-v2');

// 이제 아래와 동일합니다...

Feature::for($user->team)->active('billing-v2');
```


### Nullable 스코프 {#nullable-scope}

기능을 확인할 때 제공한 스코프가 `null`이고, 기능 정의가 nullable 타입이나 union 타입에 `null`을 포함하지 않는다면, Pennant는 자동으로 기능의 결과 값을 `false`로 반환합니다.

따라서, 기능에 전달하는 스코프가 `null`일 수 있고, 기능 값 해석기를 실행하고 싶다면, 기능 정의에서 이를 고려해야 합니다. Artisan 명령어, 큐 작업, 인증되지 않은 라우트에서 기능을 확인하면 스코프가 `null`이 될 수 있습니다. 이러한 컨텍스트에서는 일반적으로 인증된 사용자가 없으므로, 기본 스코프가 `null`이 됩니다.

항상 [기능 스코프를 명시적으로 지정](#specifying-the-scope)하지 않는다면, 스코프 타입을 "nullable"로 지정하고, 기능 정의 로직 내에서 `null` 스코프 값을 처리해야 합니다:

```php
use App\Models\User;
use Illuminate\Support\Lottery;
use Laravel\Pennant\Feature;

Feature::define('new-api', fn (User $user) => match (true) {// [!code --]
Feature::define('new-api', fn (User|null $user) => match (true) {// [!code ++]
    $user === null => true,// [!code ++]
    $user->isInternalTeamMember() => true,
    $user->isHighTrafficCustomer() => false,
    default => Lottery::odds(1 / 100),
});
```


### 스코프 식별 {#identifying-scope}

Pennant의 기본 `array` 및 `database` 저장소 드라이버는 모든 PHP 데이터 타입과 Eloquent 모델에 대해 스코프 식별자를 올바르게 저장하는 방법을 알고 있습니다. 하지만, 애플리케이션에서 서드파티 Pennant 드라이버를 사용하는 경우, 해당 드라이버는 Eloquent 모델이나 애플리케이션의 커스텀 타입에 대한 식별자를 올바르게 저장하는 방법을 모를 수 있습니다.

이러한 상황을 위해, Pennant는 애플리케이션에서 Pennant 스코프로 사용하는 객체에 `FeatureScopeable` 계약을 구현하여 스코프 값을 저장할 수 있도록 허용합니다.

예를 들어, 하나의 애플리케이션에서 내장 `database` 드라이버와 서드파티 "Flag Rocket" 드라이버 두 가지를 사용하는 경우를 가정해봅시다. "Flag Rocket" 드라이버는 Eloquent 모델을 올바르게 저장할 수 없고, 대신 `FlagRocketUser` 인스턴스를 필요로 합니다. `FeatureScopeable` 계약에서 정의한 `toFeatureIdentifier`를 구현함으로써, 애플리케이션에서 사용하는 각 드라이버에 맞는 저장 가능한 스코프 값을 커스터마이징할 수 있습니다:

```php
<?php

namespace App\Models;

use FlagRocket\FlagRocketUser;
use Illuminate\Database\Eloquent\Model;
use Laravel\Pennant\Contracts\FeatureScopeable;

class User extends Model implements FeatureScopeable
{
    /**
     * Cast the object to a feature scope identifier for the given driver.
     */
    public function toFeatureIdentifier(string $driver): mixed
    {
        return match($driver) {
            'database' => $this,
            'flag-rocket' => FlagRocketUser::fromId($this->flag_rocket_id),
        };
    }
}
```


### 스코프 직렬화 {#serializing-scope}

기본적으로 Pennant는 Eloquent 모델과 연관된 기능을 저장할 때 전체 네임스페이스가 포함된 클래스 이름을 사용합니다. 이미 [Eloquent morph map](/laravel/12.x/eloquent-relationships#custom-polymorphic-types)을 사용하고 있다면, Pennant도 morph map을 사용하여 저장된 기능이 애플리케이션 구조와 분리되도록 할 수 있습니다.

이를 위해, 서비스 프로바이더에서 Eloquent morph map을 정의한 후, `Feature` 파사드의 `useMorphMap` 메서드를 호출하세요:

```php
use Illuminate\Database\Eloquent\Relations\Relation;
use Laravel\Pennant\Feature;

Relation::enforceMorphMap([
    'post' => 'App\Models\Post',
    'video' => 'App\Models\Video',
]);

Feature::useMorphMap();
```


## 리치 기능 값 {#rich-feature-values}

지금까지는 기능이 "활성" 또는 "비활성"의 이진 상태로만 존재하는 예시를 주로 보여드렸지만, Pennant는 리치 값을 저장하는 것도 지원합니다.

예를 들어, 애플리케이션의 "지금 구매" 버튼에 대해 세 가지 새로운 색상을 테스트하고 있다고 가정해봅시다. 기능 정의에서 `true`나 `false` 대신 문자열을 반환할 수 있습니다:

```php
use Illuminate\Support\Arr;
use Laravel\Pennant\Feature;

Feature::define('purchase-button', fn (User $user) => Arr::random([
    'blue-sapphire',
    'seafoam-green',
    'tart-orange',
]));
```

`purchase-button` 기능의 값을 `value` 메서드로 조회할 수 있습니다:

```php
$color = Feature::value('purchase-button');
```

Pennant의 Blade 디렉티브를 사용하면, 기능의 현재 값에 따라 콘텐츠를 조건부로 렌더링하기도 쉽습니다:

```blade
@feature('purchase-button', 'blue-sapphire')
    <!-- 'blue-sapphire'가 활성화됨 -->
@elsefeature('purchase-button', 'seafoam-green')
    <!-- 'seafoam-green'가 활성화됨 -->
@elsefeature('purchase-button', 'tart-orange')
    <!-- 'tart-orange'가 활성화됨 -->
@endfeature
```

> [!NOTE]
> 리치 값을 사용할 때, 기능이 `false`가 아닌 어떤 값이라도 가지고 있으면 "활성"으로 간주된다는 점을 알아두세요.

[조건부 `when`](#conditional-execution) 메서드를 호출할 때, 기능의 리치 값이 첫 번째 클로저에 전달됩니다:

```php
Feature::when('purchase-button',
    fn ($color) => /* ... */,
    fn () => /* ... */,
);
```

마찬가지로, 조건부 `unless` 메서드를 호출할 때, 기능의 리치 값이 선택적 두 번째 클로저에 전달됩니다:

```php
Feature::unless('purchase-button',
    fn () => /* ... */,
    fn ($color) => /* ... */,
);
```


## 여러 기능 조회 {#retrieving-multiple-features}

`values` 메서드를 사용하면, 주어진 스코프에 대해 여러 기능을 조회할 수 있습니다:

```php
Feature::values(['billing-v2', 'purchase-button']);

// [
//     'billing-v2' => false,
//     'purchase-button' => 'blue-sapphire',
// ]
```

또는, `all` 메서드를 사용해 주어진 스코프에 대해 정의된 모든 기능의 값을 조회할 수 있습니다:

```php
Feature::all();

// [
//     'billing-v2' => false,
//     'purchase-button' => 'blue-sapphire',
//     'site-redesign' => true,
// ]
```

하지만, 클래스 기반 기능은 동적으로 등록되며, Pennant가 명시적으로 확인하기 전까지는 인식하지 못합니다. 즉, 현재 요청 중에 이미 확인되지 않은 경우, 애플리케이션의 클래스 기반 기능은 `all` 메서드의 결과에 나타나지 않을 수 있습니다.

기능 클래스가 항상 `all` 메서드에 포함되도록 하려면, Pennant의 기능 디스커버리 기능을 사용할 수 있습니다. 시작하려면, 애플리케이션의 서비스 프로바이더 중 하나에서 `discover` 메서드를 호출하세요:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Feature::discover();

        // ...
    }
}
```

`discover` 메서드는 애플리케이션의 `app/Features` 디렉터리에 있는 모든 기능 클래스를 등록합니다. 이제 `all` 메서드는 현재 요청 중에 확인되었는지 여부와 상관없이 이 클래스들을 결과에 포함합니다:

```php
Feature::all();

// [
//     'App\Features\NewApi' => true,
//     'billing-v2' => false,
//     'purchase-button' => 'blue-sapphire',
//     'site-redesign' => true,
// ]
```


## Eager 로딩 {#eager-loading}

Pennant는 하나의 요청에 대해 모든 해석된 기능을 인메모리 캐시에 보관하지만, 여전히 성능 문제가 발생할 수 있습니다. 이를 완화하기 위해 Pennant는 기능 값을 eager 로딩할 수 있는 기능을 제공합니다.

예를 들어, 루프 내에서 기능이 활성화되어 있는지 확인하는 경우를 생각해봅시다:

```php
use Laravel\Pennant\Feature;

foreach ($users as $user) {
    if (Feature::for($user)->active('notifications-beta')) {
        $user->notify(new RegistrationSuccess);
    }
}
```

데이터베이스 드라이버를 사용한다고 가정하면, 이 코드는 루프 내의 모든 사용자에 대해 데이터베이스 쿼리를 실행하게 되어 수백 번의 쿼리가 발생할 수 있습니다. 하지만, Pennant의 `load` 메서드를 사용하면, 사용자 또는 스코프 컬렉션에 대해 기능 값을 eager 로딩하여 이러한 성능 병목을 제거할 수 있습니다:

```php
Feature::for($users)->load(['notifications-beta']);

foreach ($users as $user) {
    if (Feature::for($user)->active('notifications-beta')) {
        $user->notify(new RegistrationSuccess);
    }
}
```

이미 로딩되지 않은 경우에만 기능 값을 로딩하려면, `loadMissing` 메서드를 사용할 수 있습니다:

```php
Feature::for($users)->loadMissing([
    'new-api',
    'purchase-button',
    'notifications-beta',
]);
```

정의된 모든 기능을 로딩하려면, `loadAll` 메서드를 사용할 수 있습니다:

```php
Feature::for($users)->loadAll();
```


## 값 업데이트 {#updating-values}

기능의 값이 처음 해석될 때, 기본 드라이버는 결과를 저장소에 저장합니다. 이는 여러 요청에 걸쳐 사용자에게 일관된 경험을 제공하기 위해 종종 필요합니다. 하지만, 때로는 기능의 저장된 값을 수동으로 업데이트하고 싶을 수 있습니다.

이를 위해, `activate` 및 `deactivate` 메서드를 사용해 기능을 "켜기" 또는 "끄기"로 전환할 수 있습니다:

```php
use Laravel\Pennant\Feature;

// 기본 스코프에 대해 기능 활성화...
Feature::activate('new-api');

// 주어진 스코프에 대해 기능 비활성화...
Feature::for($user->team)->deactivate('billing-v2');
```

또한, `activate` 메서드에 두 번째 인자를 제공하여 기능에 리치 값을 수동으로 설정할 수도 있습니다:

```php
Feature::activate('purchase-button', 'seafoam-green');
```

Pennant가 기능의 저장된 값을 잊도록 하려면, `forget` 메서드를 사용할 수 있습니다. 기능이 다시 확인되면, Pennant는 기능 정의에서 값을 다시 해석합니다:

```php
Feature::forget('purchase-button');
```


### 일괄 업데이트 {#bulk-updates}

저장된 기능 값을 일괄로 업데이트하려면, `activateForEveryone` 및 `deactivateForEveryone` 메서드를 사용할 수 있습니다.

예를 들어, 이제 `new-api` 기능의 안정성에 확신이 생겼고, 결제 플로우에 가장 적합한 `'purchase-button'` 색상을 결정했다면, 모든 사용자에 대해 저장된 값을 다음과 같이 업데이트할 수 있습니다:

```php
use Laravel\Pennant\Feature;

Feature::activateForEveryone('new-api');

Feature::activateForEveryone('purchase-button', 'seafoam-green');
```

또는, 모든 사용자에 대해 기능을 비활성화할 수도 있습니다:

```php
Feature::deactivateForEveryone('new-api');
```

> [!NOTE]
> 이는 Pennant의 저장소 드라이버에 저장된 해석된 기능 값만 업데이트합니다. 애플리케이션의 기능 정의도 함께 업데이트해야 합니다.


### 기능 정리 {#purging-features}

때로는 저장소에서 전체 기능을 정리하는 것이 유용할 수 있습니다. 일반적으로 기능을 애플리케이션에서 제거했거나, 모든 사용자에게 롤아웃하고 싶은 기능 정의를 조정한 경우에 필요합니다.

`purge` 메서드를 사용해 기능의 모든 저장된 값을 제거할 수 있습니다:

```php
// 단일 기능 정리...
Feature::purge('new-api');

// 여러 기능 정리...
Feature::purge(['new-api', 'purchase-button']);
```

모든 기능을 저장소에서 정리하고 싶다면, 인자 없이 `purge` 메서드를 호출하세요:

```php
Feature::purge();
```

기능 정리를 애플리케이션의 배포 파이프라인의 일부로 사용하는 것이 유용할 수 있으므로, Pennant는 지정한 기능을 저장소에서 정리하는 `pennant:purge` Artisan 명령어도 제공합니다:

```shell
php artisan pennant:purge new-api

php artisan pennant:purge new-api purchase-button
```

지정한 기능 목록을 제외한 모든 기능을 정리할 수도 있습니다. 예를 들어, "new-api"와 "purchase-button" 기능의 값만 저장소에 남기고 나머지 모든 기능을 정리하고 싶다면, `--except` 옵션에 해당 기능 이름을 전달하세요:

```shell
php artisan pennant:purge --except=new-api --except=purchase-button
```

편의를 위해, `pennant:purge` 명령어는 `--except-registered` 플래그도 지원합니다. 이 플래그는 서비스 프로바이더에 명시적으로 등록된 기능을 제외한 모든 기능을 정리함을 의미합니다:

```shell
php artisan pennant:purge --except-registered
```


## 테스트 {#testing}

기능 플래그와 상호작용하는 코드를 테스트할 때, 테스트에서 기능 플래그의 반환 값을 제어하는 가장 쉬운 방법은 기능을 다시 정의하는 것입니다. 예를 들어, 애플리케이션의 서비스 프로바이더 중 하나에 다음과 같이 기능이 정의되어 있다고 가정해봅시다:

```php
use Illuminate\Support\Arr;
use Laravel\Pennant\Feature;

Feature::define('purchase-button', fn () => Arr::random([
    'blue-sapphire',
    'seafoam-green',
    'tart-orange',
]));
```

테스트에서 기능의 반환 값을 변경하려면, 테스트 시작 시 기능을 다시 정의하면 됩니다. 아래 테스트는 `Arr::random()` 구현이 여전히 서비스 프로바이더에 존재하더라도 항상 통과합니다:
::: code-group
```php [Pest]
use Laravel\Pennant\Feature;

test('it can control feature values', function () {
    Feature::define('purchase-button', 'seafoam-green');

    expect(Feature::value('purchase-button'))->toBe('seafoam-green');
});
```

```php [PHPUnit]
use Laravel\Pennant\Feature;

public function test_it_can_control_feature_values()
{
    Feature::define('purchase-button', 'seafoam-green');

    $this->assertSame('seafoam-green', Feature::value('purchase-button'));
}
```
:::
동일한 접근 방식은 클래스 기반 기능에도 사용할 수 있습니다:
::: code-group
```php [Pest]
use Laravel\Pennant\Feature;

test('it can control feature values', function () {
    Feature::define(NewApi::class, true);

    expect(Feature::value(NewApi::class))->toBeTrue();
});
```

```php [PHPUnit]
use App\Features\NewApi;
use Laravel\Pennant\Feature;

public function test_it_can_control_feature_values()
{
    Feature::define(NewApi::class, true);

    $this->assertTrue(Feature::value(NewApi::class));
}
```
:::
기능이 `Lottery` 인스턴스를 반환하는 경우, [테스트용 헬퍼](/laravel/12.x/helpers#testing-lotteries)를 사용할 수 있습니다.


#### 저장소 설정 {#store-configuration}

테스트 중에 Pennant가 사용할 저장소를 설정하려면, 애플리케이션의 `phpunit.xml` 파일에 `PENNANT_STORE` 환경 변수를 정의하세요:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit colors="true">
    <!-- ... -->
    <php>
        <env name="PENNANT_STORE" value="array"/>
        <!-- ... -->
    </php>
</phpunit>
```


## 커스텀 Pennant 드라이버 추가 {#adding-custom-pennant-drivers}


#### 드라이버 구현 {#implementing-the-driver}

Pennant의 기존 저장소 드라이버가 애플리케이션의 요구에 맞지 않는다면, 직접 저장소 드라이버를 작성할 수 있습니다. 커스텀 드라이버는 `Laravel\Pennant\Contracts\Driver` 인터페이스를 구현해야 합니다:

```php
<?php

namespace App\Extensions;

use Laravel\Pennant\Contracts\Driver;

class RedisFeatureDriver implements Driver
{
    public function define(string $feature, callable $resolver): void {}
    public function defined(): array {}
    public function getAll(array $features): array {}
    public function get(string $feature, mixed $scope): mixed {}
    public function set(string $feature, mixed $scope, mixed $value): void {}
    public function setForAllScopes(string $feature, mixed $value): void {}
    public function delete(string $feature, mixed $scope): void {}
    public function purge(array|null $features): void {}
}
```

이제 Redis 연결을 사용해 각 메서드를 구현하면 됩니다. 각 메서드의 구현 예시는 [Pennant 소스 코드](https://github.com/laravel/pennant/blob/1.x/src/Drivers/DatabaseDriver.php)의 `Laravel\Pennant\Drivers\DatabaseDriver`를 참고하세요.

> [!NOTE]
> Laravel은 확장 기능을 담을 디렉터리를 기본 제공하지 않습니다. 원하는 위치에 자유롭게 생성할 수 있습니다. 이 예시에서는 `Extensions` 디렉터리를 만들어 `RedisFeatureDriver`를 보관했습니다.


#### 드라이버 등록 {#registering-the-driver}

드라이버 구현이 완료되면, Laravel에 등록할 준비가 된 것입니다. Pennant에 추가 드라이버를 등록하려면, `Feature` 파사드에서 제공하는 `extend` 메서드를 사용할 수 있습니다. 이 메서드는 애플리케이션의 [서비스 프로바이더](/laravel/12.x/providers) 중 하나의 `boot` 메서드에서 호출해야 합니다:

```php
<?php

namespace App\Providers;

use App\Extensions\RedisFeatureDriver;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // ...
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Feature::extend('redis', function (Application $app) {
            return new RedisFeatureDriver($app->make('redis'), $app->make('events'), []);
        });
    }
}
```

드라이버가 등록되면, 애플리케이션의 `config/pennant.php` 설정 파일에서 `redis` 드라이버를 사용할 수 있습니다:

```php
'stores' => [

    'redis' => [
        'driver' => 'redis',
        'connection' => null,
    ],

    // ...

],
```


### 외부에서 기능 정의 {#defining-features-externally}

드라이버가 서드파티 기능 플래그 플랫폼의 래퍼인 경우, Pennant의 `Feature::define` 메서드 대신 플랫폼에서 기능을 정의할 수 있습니다. 이 경우, 커스텀 드라이버는 `Laravel\Pennant\Contracts\DefinesFeaturesExternally` 인터페이스도 구현해야 합니다:

```php
<?php

namespace App\Extensions;

use Laravel\Pennant\Contracts\Driver;
use Laravel\Pennant\Contracts\DefinesFeaturesExternally;

class FeatureFlagServiceDriver implements Driver, DefinesFeaturesExternally
{
    /**
     * Get the features defined for the given scope.
     */
    public function definedFeaturesForScope(mixed $scope): array {}

    /* ... */
}
```

`definedFeaturesForScope` 메서드는 제공된 스코프에 대해 정의된 기능 이름 목록을 반환해야 합니다.


## 이벤트 {#events}

Pennant는 애플리케이션 전반에서 기능 플래그를 추적할 때 유용한 다양한 이벤트를 디스패치합니다.

### `Laravel\Pennant\Events\FeatureRetrieved`

이 이벤트는 [기능이 확인될 때](#checking-features)마다 디스패치됩니다. 이 이벤트는 애플리케이션 전반에서 기능 플래그 사용에 대한 메트릭을 생성하고 추적하는 데 유용할 수 있습니다.

### `Laravel\Pennant\Events\FeatureResolved`

이 이벤트는 특정 스코프에 대해 기능의 값이 처음 해석될 때 디스패치됩니다.

### `Laravel\Pennant\Events\UnknownFeatureResolved`

이 이벤트는 특정 스코프에 대해 알 수 없는 기능이 처음 해석될 때 디스패치됩니다. 이 이벤트를 리스닝하면, 기능 플래그를 제거하려 했지만 애플리케이션 곳곳에 남아있는 참조를 실수로 남겨둔 경우를 감지하는 데 유용할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Laravel\Pennant\Events\UnknownFeatureResolved;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(function (UnknownFeatureResolved $event) {
            Log::error("Resolving unknown feature [{$event->feature}].");
        });
    }
}
```

### `Laravel\Pennant\Events\DynamicallyRegisteringFeatureClass`

이 이벤트는 [클래스 기반 기능](#class-based-features)이 요청 중 처음으로 동적으로 확인될 때 디스패치됩니다.

### `Laravel\Pennant\Events\UnexpectedNullScopeEncountered`

이 이벤트는 [null을 지원하지 않는](#nullable-scope) 기능 정의에 `null` 스코프가 전달될 때 디스패치됩니다.

이 상황은 우아하게 처리되어 기능은 `false`를 반환합니다. 하지만, 이 기능의 기본 우아한 동작을 비활성화하고 싶다면, 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 이 이벤트에 대한 리스너를 등록할 수 있습니다:

```php
use Illuminate\Support\Facades\Log;
use Laravel\Pennant\Events\UnexpectedNullScopeEncountered;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(UnexpectedNullScopeEncountered::class, fn () => abort(500));
}
```

### `Laravel\Pennant\Events\FeatureUpdated`

이 이벤트는 스코프에 대해 기능을 업데이트할 때, 보통 `activate` 또는 `deactivate`를 호출할 때 디스패치됩니다.

### `Laravel\Pennant\Events\FeatureUpdatedForAllScopes`

이 이벤트는 모든 스코프에 대해 기능을 업데이트할 때, 보통 `activateForEveryone` 또는 `deactivateForEveryone`을 호출할 때 디스패치됩니다.

### `Laravel\Pennant\Events\FeatureDeleted`

이 이벤트는 스코프에 대해 기능을 삭제할 때, 보통 `forget`을 호출할 때 디스패치됩니다.

### `Laravel\Pennant\Events\FeaturesPurged`

이 이벤트는 특정 기능을 정리할 때 디스패치됩니다.

### `Laravel\Pennant\Events\AllFeaturesPurged`

이 이벤트는 모든 기능을 정리할 때 디스패치됩니다.
