# [고급] 동시성






## 소개 {#introduction}

때때로 서로 의존하지 않는 여러 개의 느린 작업을 실행해야 할 때가 있습니다. 많은 경우, 이러한 작업을 동시에 실행함으로써 성능을 크게 향상시킬 수 있습니다. Laravel의 `Concurrency` 파사드는 클로저를 동시에 실행할 수 있는 간단하고 편리한 API를 제공합니다.


#### 작동 방식 {#how-it-works}

Laravel은 주어진 클로저를 직렬화(serialize)한 뒤, 이를 숨겨진 Artisan CLI 명령어에 전달하여 병렬 처리를 구현합니다. 이 명령어는 클로저를 역직렬화(unserialize)하여 별도의 PHP 프로세스에서 실행합니다. 클로저가 실행된 후, 그 결과값은 다시 부모 프로세스로 직렬화되어 반환됩니다.

`Concurrency` 파사드는 세 가지 드라이버를 지원합니다: 기본값인 `process`, `fork`, 그리고 `sync`입니다.

`fork` 드라이버는 기본값인 `process` 드라이버에 비해 더 나은 성능을 제공하지만, PHP가 웹 요청 중에는 포크(fork)를 지원하지 않기 때문에 오직 PHP의 CLI 환경에서만 사용할 수 있습니다. `fork` 드라이버를 사용하기 전에, 다음과 같이 `spatie/fork` 패키지를 설치해야 합니다:

```shell
composer require spatie/fork
```

`sync` 드라이버는 주로 테스트 시에 유용합니다. 이 드라이버를 사용하면 모든 동시성을 비활성화하고, 주어진 클로저들을 부모 프로세스 내에서 순차적으로 실행할 수 있습니다.


## 동시 작업 실행하기 {#running-concurrent-tasks}

동시 작업을 실행하려면 `Concurrency` 파사드의 `run` 메서드를 사용할 수 있습니다. `run` 메서드는 동시에 실행되어야 하는 클로저 배열을 인자로 받아, 각각을 자식 PHP 프로세스에서 동시에 실행합니다:

```php
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\DB;

[$userCount, $orderCount] = Concurrency::run([
    fn () => DB::table('users')->count(),
    fn () => DB::table('orders')->count(),
]);
```

특정 드라이버를 사용하려면 `driver` 메서드를 사용할 수 있습니다:

```php
$results = Concurrency::driver('fork')->run(...);
```

기본 동시성 드라이버를 변경하려면, `config:publish` Artisan 명령어를 통해 `concurrency` 설정 파일을 퍼블리시한 후, 해당 파일의 `default` 옵션을 수정하면 됩니다:

```shell
php artisan config:publish concurrency
```


## 동시 작업 지연 실행 {#deferring-concurrent-tasks}

여러 개의 클로저를 동시에 실행하고 싶지만, 해당 클로저들이 반환하는 결과에는 관심이 없다면 `defer` 메서드 사용을 고려해보세요. `defer` 메서드를 호출하면, 전달된 클로저들은 즉시 실행되지 않습니다. 대신, Laravel은 HTTP 응답이 사용자에게 전송된 후에 이 클로저들을 동시에 실행합니다:

```php
use App\Services\Metrics;
use Illuminate\Support\Facades\Concurrency;

Concurrency::defer([
    fn () => Metrics::report('users'),
    fn () => Metrics::report('orders'),
]);
```
