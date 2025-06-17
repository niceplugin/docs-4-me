# 계약(Contracts)








## 소개 {#introduction}

Laravel의 "컨트랙트(contracts)"는 프레임워크가 제공하는 핵심 서비스들을 정의하는 일련의 인터페이스입니다. 예를 들어, `Illuminate\Contracts\Queue\Queue` 컨트랙트는 작업을 큐에 넣기 위해 필요한 메서드들을 정의하고, `Illuminate\Contracts\Mail\Mailer` 컨트랙트는 이메일을 전송하는 데 필요한 메서드들을 정의합니다.

각 컨트랙트는 프레임워크에서 제공하는 해당 구현체가 존재합니다. 예를 들어, Laravel은 다양한 드라이버를 지원하는 큐 구현체와 [Symfony Mailer](https://symfony.com/doc/current/mailer.html)를 기반으로 하는 메일러 구현체를 제공합니다.

모든 Laravel 컨트랙트는 [별도의 GitHub 저장소](https://github.com/illuminate/contracts)에 위치해 있습니다. 이를 통해 사용 가능한 모든 컨트랙트를 빠르게 참고할 수 있으며, Laravel 서비스와 상호작용하는 패키지를 개발할 때 활용할 수 있는 독립적인 패키지로 사용할 수 있습니다.


### Contracts vs. Facades {#contracts-vs-facades}

Laravel의 [파사드](/laravel/12.x/facades)와 헬퍼 함수는 서비스 컨테이너에서 계약(Contract)을 타입힌트하고 해석할 필요 없이 Laravel의 서비스를 간편하게 사용할 수 있는 방법을 제공합니다. 대부분의 경우, 각 파사드는 동등한 계약(Contract)을 가지고 있습니다.

파사드는 클래스의 생성자에서 명시적으로 의존성을 요구하지 않아도 되지만, 계약(Contract)은 클래스의 명확한 의존성을 정의할 수 있게 해줍니다. 일부 개발자들은 이러한 방식으로 의존성을 명확하게 정의하는 것을 선호하여 계약(Contract) 사용을 선호하고, 다른 개발자들은 파사드의 편리함을 선호합니다. **일반적으로 대부분의 애플리케이션은 개발 중에 파사드를 사용해도 문제가 없습니다.**


## 언제 Contracts를 사용해야 할까요? {#when-to-use-contracts}

Contracts와 Facade 중 무엇을 사용할지는 개인의 취향과 개발팀의 선호에 따라 달라집니다. 두 방식 모두 견고하고 테스트가 잘 된 Laravel 애플리케이션을 만드는 데 사용할 수 있습니다. Contracts와 Facade는 상호 배타적인 개념이 아니며, 애플리케이션의 일부는 Facade를, 다른 부분은 Contract에 의존할 수 있습니다. 클래스의 책임이 명확하게 분리되어 있다면, Contracts와 Facade를 사용하는 데 있어 실질적인 차이는 거의 느끼지 못할 것입니다.

일반적으로 대부분의 애플리케이션은 개발 중에 Facade를 사용하는 데 문제가 없습니다. 만약 여러 PHP 프레임워크와 통합되는 패키지를 개발하고 있다면, `illuminate/contracts` 패키지를 사용하여 Laravel의 서비스와의 통합을 정의할 수 있습니다. 이 경우 패키지의 `composer.json` 파일에 Laravel의 구체적인 구현체를 추가할 필요가 없습니다.


## 계약(Contracts) 사용 방법 {#how-to-use-contracts}

그렇다면, 계약(Contract)의 구현체는 어떻게 얻을 수 있을까요? 사실 매우 간단합니다.

Laravel에서는 컨트롤러, 이벤트 리스너, 미들웨어, 큐 작업, 그리고 라우트 클로저 등 다양한 종류의 클래스가 [서비스 컨테이너](/laravel/12.x/container)를 통해 해석(resolved)됩니다. 따라서, 계약의 구현체를 얻으려면 해당 클래스의 생성자에서 인터페이스를 "타입힌트"로 지정하면 됩니다.

예를 들어, 아래의 이벤트 리스너를 살펴보세요:

```php
<?php

namespace App\Listeners;

use App\Events\OrderWasPlaced;
use App\Models\User;
use Illuminate\Contracts\Redis\Factory;

class CacheOrderInformation
{
    /**
     * 이벤트 리스너 생성자.
     */
    public function __construct(
        protected Factory $redis,
    ) {}

    /**
     * 이벤트 처리 메서드.
     */
    public function handle(OrderWasPlaced $event): void
    {
        // ...
    }
}
```

이벤트 리스너가 해석될 때, 서비스 컨테이너는 클래스 생성자의 타입힌트를 읽고 적절한 값을 주입합니다. 서비스 컨테이너에 항목을 등록하는 방법에 대해 더 알고 싶다면 [관련 문서](/laravel/12.x/container)를 참고하세요.


## 계약(Contract) 참조 {#contract-reference}

이 표는 모든 Laravel 계약(Contract)과 그에 해당하는 파사드(Facade)를 빠르게 참고할 수 있도록 제공합니다:

<div class="overflow-auto">

| 계약(Contract) | 참조 파사드(Facade) |
| --- | --- |
| [Illuminate\Contracts\Auth\Access\Authorizable](https://github.com/illuminate/contracts/blob/12.x/Auth/Access/Authorizable.php) | &nbsp; |
| [Illuminate\Contracts\Auth\Access\Gate](https://github.com/illuminate/contracts/blob/12.x/Auth/Access/Gate.php) | `Gate` |
| [Illuminate\Contracts\Auth\Authenticatable](https://github.com/illuminate/contracts/blob/12.x/Auth/Authenticatable.php) | &nbsp; |
| [Illuminate\Contracts\Auth\CanResetPassword](https://github.com/illuminate/contracts/blob/12.x/Auth/CanResetPassword.php) | &nbsp; |
| [Illuminate\Contracts\Auth\Factory](https://github.com/illuminate/contracts/blob/12.x/Auth/Factory.php) | `Auth` |
| [Illuminate\Contracts\Auth\Guard](https://github.com/illuminate/contracts/blob/12.x/Auth/Guard.php) | `Auth::guard()` |
| [Illuminate\Contracts\Auth\PasswordBroker](https://github.com/illuminate/contracts/blob/12.x/Auth/PasswordBroker.php) | `Password::broker()` |
| [Illuminate\Contracts\Auth\PasswordBrokerFactory](https://github.com/illuminate/contracts/blob/12.x/Auth/PasswordBrokerFactory.php) | `Password` |
| [Illuminate\Contracts\Auth\StatefulGuard](https://github.com/illuminate/contracts/blob/12.x/Auth/StatefulGuard.php) | &nbsp; |
| [Illuminate\Contracts\Auth\SupportsBasicAuth](https://github.com/illuminate/contracts/blob/12.x/Auth/SupportsBasicAuth.php) | &nbsp; |
| [Illuminate\Contracts\Auth\UserProvider](https://github.com/illuminate/contracts/blob/12.x/Auth/UserProvider.php) | &nbsp; |
| [Illuminate\Contracts\Broadcasting\Broadcaster](https://github.com/illuminate/contracts/blob/12.x/Broadcasting/Broadcaster.php) | `Broadcast::connection()` |
| [Illuminate\Contracts\Broadcasting\Factory](https://github.com/illuminate/contracts/blob/12.x/Broadcasting/Factory.php) | `Broadcast` |
| [Illuminate\Contracts\Broadcasting\ShouldBroadcast](https://github.com/illuminate/contracts/blob/12.x/Broadcasting/ShouldBroadcast.php) | &nbsp; |
| [Illuminate\Contracts\Broadcasting\ShouldBroadcastNow](https://github.com/illuminate/contracts/blob/12.x/Broadcasting/ShouldBroadcastNow.php) | &nbsp; |
| [Illuminate\Contracts\Bus\Dispatcher](https://github.com/illuminate/contracts/blob/12.x/Bus/Dispatcher.php) | `Bus` |
| [Illuminate\Contracts\Bus\QueueingDispatcher](https://github.com/illuminate/contracts/blob/12.x/Bus/QueueingDispatcher.php) | `Bus::dispatchToQueue()` |
| [Illuminate\Contracts\Cache\Factory](https://github.com/illuminate/contracts/blob/12.x/Cache/Factory.php) | `Cache` |
| [Illuminate\Contracts\Cache\Lock](https://github.com/illuminate/contracts/blob/12.x/Cache/Lock.php) | &nbsp; |
| [Illuminate\Contracts\Cache\LockProvider](https://github.com/illuminate/contracts/blob/12.x/Cache/LockProvider.php) | &nbsp; |
| [Illuminate\Contracts\Cache\Repository](https://github.com/illuminate/contracts/blob/12.x/Cache/Repository.php) | `Cache::driver()` |
| [Illuminate\Contracts\Cache\Store](https://github.com/illuminate/contracts/blob/12.x/Cache/Store.php) | &nbsp; |
| [Illuminate\Contracts\Config\Repository](https://github.com/illuminate/contracts/blob/12.x/Config/Repository.php) | `Config` |
| [Illuminate\Contracts\Console\Application](https://github.com/illuminate/contracts/blob/12.x/Console/Application.php) | &nbsp; |
| [Illuminate\Contracts\Console\Kernel](https://github.com/illuminate/contracts/blob/12.x/Console/Kernel.php) | `Artisan` |
| [Illuminate\Contracts\Container\Container](https://github.com/illuminate/contracts/blob/12.x/Container/Container.php) | `App` |
| [Illuminate\Contracts\Cookie\Factory](https://github.com/illuminate/contracts/blob/12.x/Cookie/Factory.php) | `Cookie` |
| [Illuminate\Contracts\Cookie\QueueingFactory](https://github.com/illuminate/contracts/blob/12.x/Cookie/QueueingFactory.php) | `Cookie::queue()` |
| [Illuminate\Contracts\Database\ModelIdentifier](https://github.com/illuminate/contracts/blob/12.x/Database/ModelIdentifier.php) | &nbsp; |
| [Illuminate\Contracts\Debug\ExceptionHandler](https://github.com/illuminate/contracts/blob/12.x/Debug/ExceptionHandler.php) | &nbsp; |
| [Illuminate\Contracts\Encryption\Encrypter](https://github.com/illuminate/contracts/blob/12.x/Encryption/Encrypter.php) | `Crypt` |
| [Illuminate\Contracts\Events\Dispatcher](https://github.com/illuminate/contracts/blob/12.x/Events/Dispatcher.php) | `Event` |
| [Illuminate\Contracts\Filesystem\Cloud](https://github.com/illuminate/contracts/blob/12.x/Filesystem/Cloud.php) | `Storage::cloud()` |
| [Illuminate\Contracts\Filesystem\Factory](https://github.com/illuminate/contracts/blob/12.x/Filesystem/Factory.php) | `Storage` |
| [Illuminate\Contracts\Filesystem\Filesystem](https://github.com/illuminate/contracts/blob/12.x/Filesystem/Filesystem.php) | `Storage::disk()` |
| [Illuminate\Contracts\Foundation\Application](https://github.com/illuminate/contracts/blob/12.x/Foundation/Application.php) | `App` |
| [Illuminate\Contracts\Hashing\Hasher](https://github.com/illuminate/contracts/blob/12.x/Hashing/Hasher.php) | `Hash` |
| [Illuminate\Contracts\Http\Kernel](https://github.com/illuminate/contracts/blob/12.x/Http/Kernel.php) | &nbsp; |
| [Illuminate\Contracts\Mail\Mailable](https://github.com/illuminate/contracts/blob/12.x/Mail/Mailable.php) | &nbsp; |
| [Illuminate\Contracts\Mail\Mailer](https://github.com/illuminate/contracts/blob/12.x/Mail/Mailer.php) | `Mail` |
| [Illuminate\Contracts\Mail\MailQueue](https://github.com/illuminate/contracts/blob/12.x/Mail/MailQueue.php) | `Mail::queue()` |
| [Illuminate\Contracts\Notifications\Dispatcher](https://github.com/illuminate/contracts/blob/12.x/Notifications/Dispatcher.php) | `Notification`|
| [Illuminate\Contracts\Notifications\Factory](https://github.com/illuminate/contracts/blob/12.x/Notifications/Factory.php) | `Notification` |
| [Illuminate\Contracts\Pagination\LengthAwarePaginator](https://github.com/illuminate/contracts/blob/12.x/Pagination/LengthAwarePaginator.php) | &nbsp; |
| [Illuminate\Contracts\Pagination\Paginator](https://github.com/illuminate/contracts/blob/12.x/Pagination/Paginator.php) | &nbsp; |
| [Illuminate\Contracts\Pipeline\Hub](https://github.com/illuminate/contracts/blob/12.x/Pipeline/Hub.php) | &nbsp; |
| [Illuminate\Contracts\Pipeline\Pipeline](https://github.com/illuminate/contracts/blob/12.x/Pipeline/Pipeline.php) | `Pipeline` |
| [Illuminate\Contracts\Queue\EntityResolver](https://github.com/illuminate/contracts/blob/12.x/Queue/EntityResolver.php) | &nbsp; |
| [Illuminate\Contracts\Queue\Factory](https://github.com/illuminate/contracts/blob/12.x/Queue/Factory.php) | `Queue` |
| [Illuminate\Contracts\Queue\Job](https://github.com/illuminate/contracts/blob/12.x/Queue/Job.php) | &nbsp; |
| [Illuminate\Contracts\Queue\Monitor](https://github.com/illuminate/contracts/blob/12.x/Queue/Monitor.php) | `Queue` |
| [Illuminate\Contracts\Queue\Queue](https://github.com/illuminate/contracts/blob/12.x/Queue/Queue.php) | `Queue::connection()` |
| [Illuminate\Contracts\Queue\QueueableCollection](https://github.com/illuminate/contracts/blob/12.x/Queue/QueueableCollection.php) | &nbsp; |
| [Illuminate\Contracts\Queue\QueueableEntity](https://github.com/illuminate/contracts/blob/12.x/Queue/QueueableEntity.php) | &nbsp; |
| [Illuminate\Contracts\Queue\ShouldQueue](https://github.com/illuminate/contracts/blob/12.x/Queue/ShouldQueue.php) | &nbsp; |
| [Illuminate\Contracts\Redis\Factory](https://github.com/illuminate/contracts/blob/12.x/Redis/Factory.php) | `Redis` |
| [Illuminate\Contracts\Routing\BindingRegistrar](https://github.com/illuminate/contracts/blob/12.x/Routing/BindingRegistrar.php) | `Route` |
| [Illuminate\Contracts\Routing\Registrar](https://github.com/illuminate/contracts/blob/12.x/Routing/Registrar.php) | `Route` |
| [Illuminate\Contracts\Routing\ResponseFactory](https://github.com/illuminate/contracts/blob/12.x/Routing/ResponseFactory.php) | `Response` |
| [Illuminate\Contracts\Routing\UrlGenerator](https://github.com/illuminate/contracts/blob/12.x/Routing/UrlGenerator.php) | `URL` |
| [Illuminate\Contracts\Routing\UrlRoutable](https://github.com/illuminate/contracts/blob/12.x/Routing/UrlRoutable.php) | &nbsp; |
| [Illuminate\Contracts\Session\Session](https://github.com/illuminate/contracts/blob/12.x/Session/Session.php) | `Session::driver()` |
| [Illuminate\Contracts\Support\Arrayable](https://github.com/illuminate/contracts/blob/12.x/Support/Arrayable.php) | &nbsp; |
| [Illuminate\Contracts\Support\Htmlable](https://github.com/illuminate/contracts/blob/12.x/Support/Htmlable.php) | &nbsp; |
| [Illuminate\Contracts\Support\Jsonable](https://github.com/illuminate/contracts/blob/12.x/Support/Jsonable.php) | &nbsp; |
| [Illuminate\Contracts\Support\MessageBag](https://github.com/illuminate/contracts/blob/12.x/Support/MessageBag.php) | &nbsp; |
| [Illuminate\Contracts\Support\MessageProvider](https://github.com/illuminate/contracts/blob/12.x/Support/MessageProvider.php) | &nbsp; |
| [Illuminate\Contracts\Support\Renderable](https://github.com/illuminate/contracts/blob/12.x/Support/Renderable.php) | &nbsp; |
| [Illuminate\Contracts\Support\Responsable](https://github.com/illuminate/contracts/blob/12.x/Support/Responsable.php) | &nbsp; |
| [Illuminate\Contracts\Translation\Loader](https://github.com/illuminate/contracts/blob/12.x/Translation/Loader.php) | &nbsp; |
| [Illuminate\Contracts\Translation\Translator](https://github.com/illuminate/contracts/blob/12.x/Translation/Translator.php) | `Lang` |
| [Illuminate\Contracts\Validation\Factory](https://github.com/illuminate/contracts/blob/12.x/Validation/Factory.php) | `Validator` |
| [Illuminate\Contracts\Validation\ValidatesWhenResolved](https://github.com/illuminate/contracts/blob/12.x/Validation/ValidatesWhenResolved.php) | &nbsp; |
| [Illuminate\Contracts\Validation\ValidationRule](https://github.com/illuminate/contracts/blob/12.x/Validation/ValidationRule.php) | &nbsp; |
| [Illuminate\Contracts\Validation\Validator](https://github.com/illuminate/contracts/blob/12.x/Validation/Validator.php) | `Validator::make()` |
| [Illuminate\Contracts\View\Engine](https://github.com/illuminate/contracts/blob/12.x/View/Engine.php) | &nbsp; |
| [Illuminate\Contracts\View\Factory](https://github.com/illuminate/contracts/blob/12.x/View/Factory.php) | `View` |
| [Illuminate\Contracts\View\View](https://github.com/illuminate/contracts/blob/12.x/View/View.php) | `View::make()` |

</div>
