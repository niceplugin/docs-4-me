# Laravel Pulse
























## 소개 {#introduction}

[Laravel Pulse](https://github.com/laravel/pulse)는 애플리케이션의 성능과 사용 현황을 한눈에 파악할 수 있는 인사이트를 제공합니다. Pulse를 사용하면 느린 작업과 엔드포인트와 같은 병목 현상을 추적하고, 가장 활발한 사용자를 찾는 등 다양한 정보를 확인할 수 있습니다.

개별 이벤트에 대한 심층 디버깅이 필요하다면 [Laravel Telescope](/laravel/12.x/telescope)를 참고하세요.


## 설치 {#installation}

> [!WARNING]
> Pulse의 기본 스토리지 구현은 현재 MySQL, MariaDB, 또는 PostgreSQL 데이터베이스가 필요합니다. 다른 데이터베이스 엔진을 사용하는 경우, Pulse 데이터를 위해 별도의 MySQL, MariaDB, 또는 PostgreSQL 데이터베이스가 필요합니다.

Pulse는 Composer 패키지 관리자를 사용하여 설치할 수 있습니다:

```shell
composer require laravel/pulse
```

다음으로, `vendor:publish` Artisan 명령어를 사용하여 Pulse의 설정 및 마이그레이션 파일을 게시해야 합니다:

```shell
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
```

마지막으로, Pulse의 데이터를 저장하는 데 필요한 테이블을 생성하기 위해 `migrate` 명령어를 실행해야 합니다:

```shell
php artisan migrate
```

Pulse의 데이터베이스 마이그레이션이 완료되면, `/pulse` 경로를 통해 Pulse 대시보드에 접근할 수 있습니다.

> [!NOTE]
> Pulse 데이터를 애플리케이션의 기본 데이터베이스에 저장하고 싶지 않은 경우, [별도의 데이터베이스 연결을 지정](#using-a-different-database)할 수 있습니다.


### 설정 {#configuration}

Pulse의 많은 설정 옵션은 환경 변수를 사용하여 제어할 수 있습니다. 사용 가능한 옵션을 확인하거나, 새로운 레코더를 등록하거나, 고급 옵션을 설정하려면 `config/pulse.php` 설정 파일을 퍼블리시할 수 있습니다:

```shell
php artisan vendor:publish --tag=pulse-config
```


## 대시보드 {#dashboard}


### 권한 부여 {#dashboard-authorization}

Pulse 대시보드는 `/pulse` 경로를 통해 접근할 수 있습니다. 기본적으로 이 대시보드는 `local` 환경에서만 접근할 수 있으므로, 프로덕션 환경에서 접근하려면 `'viewPulse'` 권한 게이트를 커스터마이징하여 권한을 설정해야 합니다. 이는 애플리케이션의 `app/Providers/AppServiceProvider.php` 파일에서 설정할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Gate;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Gate::define('viewPulse', function (User $user) {
        return $user->isAdmin();
    });

    // ...
}
```


### 커스터마이징 {#dashboard-customization}

Pulse 대시보드 카드와 레이아웃은 대시보드 뷰를 퍼블리시하여 구성할 수 있습니다. 대시보드 뷰는 `resources/views/vendor/pulse/dashboard.blade.php` 경로에 퍼블리시됩니다:

```shell
php artisan vendor:publish --tag=pulse-dashboard
```

대시보드는 [Livewire](https://livewire.laravel.com/)로 구동되며, JavaScript 에셋을 다시 빌드하지 않고도 카드와 레이아웃을 커스터마이즈할 수 있습니다.

이 파일 내에서 `<x-pulse>` 컴포넌트가 대시보드 렌더링을 담당하며, 카드들을 위한 그리드 레이아웃을 제공합니다. 대시보드를 화면 전체 너비로 확장하고 싶다면, 컴포넌트에 `full-width` prop을 전달하면 됩니다:

```blade
<x-pulse full-width>
    ...
</x-pulse>
```

기본적으로 `<x-pulse>` 컴포넌트는 12 컬럼 그리드를 생성하지만, `cols` prop을 사용하여 이를 커스터마이즈할 수 있습니다:

```blade
<x-pulse cols="16">
    ...
</x-pulse>
```

각 카드는 `cols`와 `rows` prop을 받아 공간과 위치를 제어할 수 있습니다:

```blade
<livewire:pulse.usage cols="4" rows="2" />
```

대부분의 카드에서는 `expand` prop도 지원하여, 스크롤 대신 전체 카드를 표시할 수 있습니다:

```blade
<livewire:pulse.slow-queries expand />
```


### 사용자 정보 해석하기 {#dashboard-resolving-users}

Application Usage 카드와 같이 사용자 정보를 표시하는 카드의 경우, Pulse는 사용자의 ID만 기록합니다. 대시보드를 렌더링할 때 Pulse는 기본 `Authenticatable` 모델에서 `name`과 `email` 필드를 해석하고, Gravatar 웹 서비스를 사용하여 아바타를 표시합니다.

필드와 아바타는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스 내에서 `Pulse::user` 메서드를 호출하여 커스터마이즈할 수 있습니다.

`user` 메서드는 표시할 `Authenticatable` 모델을 인자로 받는 클로저를 인수로 받아야 하며, 사용자에 대한 `name`, `extra`, `avatar` 정보를 담은 배열을 반환해야 합니다:

```php
use Laravel\Pulse\Facades\Pulse;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Pulse::user(fn ($user) => [
        'name' => $user->name,
        'extra' => $user->email,
        'avatar' => $user->avatar_url,
    ]);

    // ...
}
```

> [!NOTE]
> 인증된 사용자를 캡처하고 조회하는 방식을 완전히 커스터마이즈하려면 `Laravel\Pulse\Contracts\ResolvesUsers` 계약을 구현하고, Laravel의 [서비스 컨테이너](/laravel/12.x/container#binding-a-singleton)에 바인딩하면 됩니다.


### 카드 {#dashboard-cards}


#### 서버 {#servers-card}

`<livewire:pulse.servers />` 카드는 `pulse:check` 명령어를 실행 중인 모든 서버의 시스템 리소스 사용량을 표시합니다. 시스템 리소스 보고에 대한 자세한 내용은 [서버 레코더](#servers-recorder) 문서를 참고하세요.

인프라에서 서버를 교체한 경우, 일정 시간이 지난 후 Pulse 대시보드에서 비활성 서버의 표시를 중지하고 싶을 수 있습니다. 이를 위해 `ignore-after` prop을 사용할 수 있으며, 이 prop은 비활성 서버가 Pulse 대시보드에서 제거되어야 하는 초 단위의 시간을 받습니다. 또는 `1 hour`나 `3 days and 1 hour`와 같은 상대적 시간 형식의 문자열도 사용할 수 있습니다:

```blade
<livewire:pulse.servers ignore-after="3 hours" />
```


#### 애플리케이션 사용량 {#application-usage-card}

`<livewire:pulse.usage />` 카드는 애플리케이션에 요청을 보내거나, 작업을 디스패치하거나, 느린 요청을 경험하는 상위 10명의 사용자를 표시합니다.

모든 사용량 지표를 한 화면에서 동시에 보고 싶다면, 카드를 여러 번 포함하고 `type` 속성을 지정할 수 있습니다:

```blade
<livewire:pulse.usage type="requests" />
<livewire:pulse.usage type="slow_requests" />
<livewire:pulse.usage type="jobs" />
```

Pulse가 사용자 정보를 가져오고 표시하는 방식을 커스터마이즈하는 방법을 알아보려면, [사용자 확인](#dashboard-resolving-users) 문서를 참고하세요.

> [!NOTE]
> 애플리케이션이 많은 요청을 받거나 많은 작업을 디스패치한다면, [샘플링](#sampling)을 활성화하는 것이 좋습니다. 자세한 내용은 [사용자 요청 기록기](#user-requests-recorder), [사용자 작업 기록기](#user-jobs-recorder), [느린 작업 기록기](#slow-jobs-recorder) 문서를 참고하세요.


#### 예외 {#exceptions-card}

`<livewire:pulse.exceptions />` 카드는 애플리케이션에서 발생하는 예외의 빈도와 최근 발생 시점을 보여줍니다. 기본적으로 예외는 예외 클래스와 발생 위치를 기준으로 그룹화됩니다. 자세한 내용은 [예외 기록기](#exceptions-recorder) 문서를 참고하세요.


#### 큐 {#queues-card}

`<livewire:pulse.queues />` 카드는 애플리케이션의 큐 처리량을 보여주며, 대기 중인 작업, 처리 중인 작업, 처리 완료된 작업, 재시도된 작업, 실패한 작업의 수를 포함합니다. 자세한 내용은 [큐 레코더](#queues-recorder) 문서를 참고하세요.


#### 느린 요청 {#slow-requests-card}

`<livewire:pulse.slow-requests />` 카드는 기본적으로 1,000ms로 설정된 임계값을 초과하는 애플리케이션의 들어오는 요청을 보여줍니다. 자세한 내용은 [느린 요청 기록기](#slow-requests-recorder) 문서를 참고하세요.


#### 느린 작업 {#slow-jobs-card}

`<livewire:pulse.slow-jobs />` 카드는 기본적으로 1,000ms로 설정된 임계값을 초과하는 애플리케이션의 대기열 작업을 보여줍니다. 자세한 내용은 [느린 작업 기록기](#slow-jobs-recorder) 문서를 참고하세요.


#### 느린 쿼리 {#slow-queries-card}

`<livewire:pulse.slow-queries />` 카드는 애플리케이션에서 설정된 임계값(기본값은 1,000ms)을 초과하는 데이터베이스 쿼리를 보여줍니다.

기본적으로 느린 쿼리는 SQL 쿼리(바인딩 제외)와 발생 위치를 기준으로 그룹화되지만, 원한다면 위치 캡처를 비활성화하여 SQL 쿼리만으로 그룹화할 수도 있습니다.

매우 큰 SQL 쿼리에 구문 하이라이팅이 적용되어 렌더링 성능 문제가 발생하는 경우, `without-highlighting` 속성을 추가하여 하이라이팅을 비활성화할 수 있습니다:

```blade
<livewire:pulse.slow-queries without-highlighting />
```

자세한 내용은 [느린 쿼리 기록기](#slow-queries-recorder) 문서를 참고하세요.


#### 느린 외부 요청 {#slow-outgoing-requests-card}

`<livewire:pulse.slow-outgoing-requests />` 카드는 Laravel의 [HTTP 클라이언트](/laravel/12.x/http-client)를 사용하여 설정된 임계값(기본값은 1,000ms)을 초과한 외부 요청을 보여줍니다.

기본적으로 항목은 전체 URL로 그룹화됩니다. 하지만 정규식을 사용하여 유사한 외부 요청을 정규화하거나 그룹화할 수도 있습니다. 자세한 내용은 [느린 외부 요청 기록기](#slow-outgoing-requests-recorder) 문서를 참고하세요.


#### 캐시 {#cache-card}

`<livewire:pulse.cache />` 카드는 애플리케이션의 캐시 적중 및 미스 통계를 전역적으로와 개별 키별로 보여줍니다.

기본적으로 항목은 키별로 그룹화됩니다. 그러나 정규식을 사용하여 유사한 키를 정규화하거나 그룹화할 수도 있습니다. 자세한 내용은 [캐시 상호작용 기록기](#cache-interactions-recorder) 문서를 참고하세요.


## 엔트리 캡처하기 {#capturing-entries}

대부분의 Pulse 레코더는 Laravel에서 디스패치하는 프레임워크 이벤트를 기반으로 자동으로 엔트리를 캡처합니다. 하지만 [서버 레코더](#servers-recorder)와 일부 서드파티 카드들은 정보를 정기적으로 폴링해야 합니다. 이러한 카드들을 사용하려면, 각 애플리케이션 서버에서 `pulse:check` 데몬을 실행해야 합니다:

```php
php artisan pulse:check
```

> [!NOTE]
> `pulse:check` 프로세스를 백그라운드에서 영구적으로 실행하려면, Supervisor와 같은 프로세스 모니터를 사용하여 명령어가 중단되지 않도록 해야 합니다.

`pulse:check` 명령어는 장시간 실행되는 프로세스이기 때문에, 재시작하지 않으면 코드베이스의 변경 사항을 감지하지 못합니다. 애플리케이션 배포 과정에서 `pulse:restart` 명령어를 호출하여 명령어를 정상적으로 재시작해야 합니다:

```shell
php artisan pulse:restart
```

> [!NOTE]
> Pulse는 재시작 신호를 저장하기 위해 [캐시](/laravel/12.x/cache)를 사용하므로, 이 기능을 사용하기 전에 애플리케이션에 적절한 캐시 드라이버가 설정되어 있는지 확인해야 합니다.


### 레코더 {#recorders}

레코더는 애플리케이션에서 발생하는 엔트리를 캡처하여 Pulse 데이터베이스에 기록하는 역할을 합니다. 레코더는 [Pulse 설정 파일](#configuration)의 `recorders` 섹션에서 등록 및 구성됩니다.


#### 캐시 상호작용 {#cache-interactions-recorder}

`CacheInteractions` 레코더는 애플리케이션에서 발생하는 [캐시](/laravel/12.x/cache) 히트와 미스를 캡처하여 [Cache](#cache-card) 카드에 표시합니다.

원한다면 [샘플링 비율](#sampling)과 무시할 키 패턴을 조정할 수 있습니다.

또한 비슷한 키를 하나의 항목으로 그룹화하도록 키 그룹핑을 설정할 수 있습니다. 예를 들어, 동일한 유형의 정보를 캐싱하는 키에서 고유 ID를 제거하고 싶을 수 있습니다. 그룹은 정규식을 사용하여 키의 일부를 "찾아 바꾸기" 방식으로 설정합니다. 설정 파일에 예시가 포함되어 있습니다:

```php
Recorders\CacheInteractions::class => [
    // ...
    'groups' => [
        // '/:\d+/' => ':*',
    ],
],
```

처음으로 일치하는 패턴이 사용됩니다. 어떤 패턴과도 일치하지 않으면, 키는 있는 그대로 캡처됩니다.


#### 예외 {#exceptions-recorder}

`Exceptions` 레코더는 애플리케이션에서 발생하는 보고 가능한 예외에 대한 정보를 캡처하여 [Exceptions](#exceptions-card) 카드에 표시합니다.

원한다면 [샘플 비율](#sampling)과 무시할 예외 패턴을 조정할 수 있습니다. 또한 예외가 발생한 위치를 캡처할지 여부도 설정할 수 있습니다. 캡처된 위치는 Pulse 대시보드에 표시되어 예외의 발생 원인을 추적하는 데 도움이 됩니다. 하지만 동일한 예외가 여러 위치에서 발생하면 각 고유 위치마다 여러 번 표시됩니다.


#### 큐 {#queues-recorder}

`Queues` 레코더는 [Queues](#queues-card)에서 표시할 수 있도록 애플리케이션의 큐에 대한 정보를 캡처합니다.

원한다면 [샘플링 비율](#sampling)과 무시할 작업 패턴을 조정할 수 있습니다.


#### 느린 작업 {#slow-jobs-recorder}

`SlowJobs` 레코더는 애플리케이션에서 발생하는 느린 작업에 대한 정보를 캡처하여 [느린 작업](#slow-jobs-recorder) 카드에 표시합니다.

느린 작업 임계값, [샘플 비율](#sampling), 무시할 작업 패턴을 선택적으로 조정할 수 있습니다.

다른 작업보다 오래 걸릴 것으로 예상되는 작업이 있을 수 있습니다. 이러한 경우 작업별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowJobs::class => [
    // ...
    'threshold' => [
        '#^App\\Jobs\\GenerateYearlyReports$#' => 5000,
        'default' => env('PULSE_SLOW_JOBS_THRESHOLD', 1000),
    ],
],
```

정규식 패턴이 작업의 클래스명과 일치하지 않으면 `'default'` 값이 사용됩니다.


#### 느린 외부 요청 {#slow-outgoing-requests-recorder}

`SlowOutgoingRequests` 레코더는 Laravel의 [HTTP 클라이언트](/laravel/12.x/http-client)를 사용하여 발생한 외부 HTTP 요청 중, 설정된 임계값을 초과하는 요청에 대한 정보를 [느린 외부 요청](#slow-outgoing-requests-card) 카드에 표시하기 위해 캡처합니다.

느린 외부 요청 임계값, [샘플링 비율](#sampling), 무시할 URL 패턴을 선택적으로 조정할 수 있습니다.

다른 요청보다 오래 걸릴 것으로 예상되는 외부 요청이 있을 수 있습니다. 이런 경우, 요청별로 임계값을 설정할 수 있습니다:

```php
Recorders\SlowOutgoingRequests::class => [
    // ...
    'threshold' => [
        '#backup.zip$#' => 5000,
        'default' => env('PULSE_SLOW_OUTGOING_REQUESTS_THRESHOLD', 1000),
    ],
],
```

정규식 패턴이 요청의 URL과 일치하지 않으면 `'default'` 값이 사용됩니다.

또한, 비슷한 URL을 하나의 항목으로 그룹화할 수 있도록 URL 그룹화를 설정할 수 있습니다. 예를 들어, URL 경로에서 고유 ID를 제거하거나 도메인별로만 그룹화할 수 있습니다. 그룹은 정규식을 사용하여 URL의 일부를 "찾아 바꾸기" 방식으로 설정합니다. 몇 가지 예시는 설정 파일에 포함되어 있습니다:

```php
Recorders\SlowOutgoingRequests::class => [
    // ...
    'groups' => [
        // '#^https://api\.github\.com/repos/.*$#' => 'api.github.com/repos/*',
        // '#^https?://([^/]*).*$#' => '\1',
        // '#/\d+#' => '/*',
    ],
],
```

처음으로 일치하는 패턴이 사용됩니다. 일치하는 패턴이 없으면 URL이 그대로 캡처됩니다.


#### 느린 쿼리 {#slow-queries-recorder}

`SlowQueries` 레코더는 애플리케이션에서 설정된 임계값을 초과하는 모든 데이터베이스 쿼리를 [느린 쿼리](#slow-queries-card) 카드에 표시하기 위해 캡처합니다.

느린 쿼리 임계값, [샘플 비율](#sampling), 무시할 쿼리 패턴을 선택적으로 조정할 수 있습니다. 또한 쿼리 위치를 캡처할지 여부도 설정할 수 있습니다. 캡처된 위치는 Pulse 대시보드에 표시되어 쿼리의 출처를 추적하는 데 도움이 됩니다. 하지만 동일한 쿼리가 여러 위치에서 실행된다면, 각 고유 위치마다 여러 번 표시됩니다.

일부 쿼리는 다른 쿼리보다 오래 걸릴 것으로 예상할 수 있습니다. 이런 경우, 쿼리별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowQueries::class => [
    // ...
    'threshold' => [
        '#^insert into `yearly_reports`#' => 5000,
        'default' => env('PULSE_SLOW_QUERIES_THRESHOLD', 1000),
    ],
],
```

정규식 패턴이 쿼리의 SQL과 일치하지 않으면 `'default'` 값이 사용됩니다.


#### 느린 요청 {#slow-requests-recorder}

`Requests` 레코더는 애플리케이션에 대한 요청 정보를 캡처하여 [느린 요청](#slow-requests-card) 및 [애플리케이션 사용량](#application-usage-card) 카드에 표시합니다.

느린 라우트 임계값, [샘플 비율](#sampling), 무시할 경로를 선택적으로 조정할 수 있습니다.

일부 요청은 다른 요청보다 더 오래 걸릴 것으로 예상될 수 있습니다. 이러한 경우, 요청별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowRequests::class => [
    // ...
    'threshold' => [
        '#^/admin/#' => 5000,
        'default' => env('PULSE_SLOW_REQUESTS_THRESHOLD', 1000),
    ],
],
```

정규식 패턴이 요청의 URL과 일치하지 않으면 `'default'` 값이 사용됩니다.


#### 서버 {#servers-recorder}

`Servers` 레코더는 애플리케이션을 구동하는 서버의 CPU, 메모리, 저장소 사용량을 캡처하여 [서버](#servers-card) 카드에 표시합니다. 이 레코더를 사용하려면 모니터링하려는 각 서버에서 [pulse:check 명령어](#capturing-entries)가 실행 중이어야 합니다.

각 보고 서버는 고유한 이름을 가져야 합니다. 기본적으로 Pulse는 PHP의 `gethostname` 함수가 반환하는 값을 사용합니다. 이를 커스터마이즈하고 싶다면 `PULSE_SERVER_NAME` 환경 변수를 설정할 수 있습니다:

```env
PULSE_SERVER_NAME=load-balancer
```

Pulse 설정 파일을 통해 모니터링할 디렉터리도 커스터마이즈할 수 있습니다.


#### 사용자 작업 {#user-jobs-recorder}

`UserJobs` 기록기는 애플리케이션에서 작업을 디스패치하는 사용자에 대한 정보를 캡처하여 [애플리케이션 사용량](#application-usage-card) 카드에 표시합니다.

원한다면 [샘플링 비율](#sampling)과 무시할 작업 패턴을 조정할 수 있습니다.


#### 사용자 요청 {#user-requests-recorder}

`UserRequests` 기록기는 애플리케이션에 요청을 보내는 사용자에 대한 정보를 캡처하여 [애플리케이션 사용량](#application-usage-card) 카드에 표시합니다.

원하는 경우 [샘플링 비율](#sampling)과 무시할 URL 패턴을 조정할 수 있습니다.


### 필터링 {#filtering}

앞서 살펴본 바와 같이, 많은 [레코더](#recorders)들은 설정을 통해 요청의 URL과 같은 값에 따라 들어오는 항목을 "무시"할 수 있는 기능을 제공합니다. 하지만 때로는 현재 인증된 사용자와 같은 다른 요소를 기준으로 레코드를 필터링하는 것이 유용할 수 있습니다. 이러한 레코드를 필터링하려면 Pulse의 `filter` 메서드에 클로저를 전달하면 됩니다. 일반적으로 `filter` 메서드는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Auth;
use Laravel\Pulse\Entry;
use Laravel\Pulse\Facades\Pulse;
use Laravel\Pulse\Value;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Pulse::filter(function (Entry|Value $entry) {
        return Auth::user()->isNotAdmin();
    });

    // ...
}
```


## 성능 {#performance}

Pulse는 추가적인 인프라 없이 기존 애플리케이션에 바로 적용할 수 있도록 설계되었습니다. 하지만 트래픽이 많은 애플리케이션의 경우, Pulse가 애플리케이션 성능에 미칠 수 있는 영향을 최소화할 수 있는 여러 가지 방법이 있습니다.


### 다른 데이터베이스 사용하기 {#using-a-different-database}

트래픽이 많은 애플리케이션의 경우, Pulse가 애플리케이션 데이터베이스에 영향을 주지 않도록 전용 데이터베이스 연결을 사용하는 것이 좋습니다.

Pulse에서 사용하는 [데이터베이스 연결](/laravel/12.x/database#configuration)은 `PULSE_DB_CONNECTION` 환경 변수를 설정하여 커스터마이즈할 수 있습니다.

```env
PULSE_DB_CONNECTION=pulse
```


### Redis Ingest {#ingest}

> [!WARNING]
> Redis Ingest는 Redis 6.2 이상과 애플리케이션에 설정된 Redis 클라이언트 드라이버로 `phpredis` 또는 `predis`가 필요합니다.

기본적으로 Pulse는 HTTP 응답이 클라이언트에 전송된 후 또는 작업이 처리된 후에 [설정된 데이터베이스 연결](#using-a-different-database)에 엔트리를 직접 저장합니다. 그러나 Pulse의 Redis ingest 드라이버를 사용하여 엔트리를 대신 Redis 스트림으로 보낼 수 있습니다. 이는 `PULSE_INGEST_DRIVER` 환경 변수를 설정하여 활성화할 수 있습니다:

```ini
PULSE_INGEST_DRIVER=redis
```

Pulse는 기본적으로 기본 [Redis 연결](/laravel/12.x/redis#configuration)을 사용하지만, `PULSE_REDIS_CONNECTION` 환경 변수를 통해 이를 커스터마이즈할 수 있습니다:

```ini
PULSE_REDIS_CONNECTION=pulse
```

Redis ingest를 사용할 때는 `pulse:work` 명령어를 실행하여 스트림을 모니터링하고 Redis에서 Pulse의 데이터베이스 테이블로 엔트리를 이동시켜야 합니다.

```php
php artisan pulse:work
```

> [!NOTE]
> `pulse:work` 프로세스를 백그라운드에서 영구적으로 실행하려면 Supervisor와 같은 프로세스 모니터를 사용하여 Pulse 워커가 중단되지 않도록 해야 합니다.

`pulse:work` 명령어는 장시간 실행되는 프로세스이므로, 재시작하지 않으면 코드베이스의 변경 사항을 인식하지 못합니다. 애플리케이션 배포 과정에서 `pulse:restart` 명령어를 호출하여 명령어를 정상적으로 재시작해야 합니다:

```shell
php artisan pulse:restart
```

> [!NOTE]
> Pulse는 [캐시](/laravel/12.x/cache)를 사용하여 재시작 신호를 저장하므로, 이 기능을 사용하기 전에 애플리케이션에 적절한 캐시 드라이버가 설정되어 있는지 확인해야 합니다.


### 샘플링 {#sampling}

기본적으로 Pulse는 애플리케이션에서 발생하는 모든 관련 이벤트를 캡처합니다. 트래픽이 많은 애플리케이션의 경우, 특히 더 긴 기간 동안 대시보드에서 수백만 개의 데이터베이스 행을 집계해야 할 수 있습니다.

대신, 특정 Pulse 데이터 기록기에 "샘플링"을 활성화하도록 선택할 수 있습니다. 예를 들어, [사용자 요청](#user-requests-recorder) 기록기에서 샘플 비율을 `0.1`로 설정하면 애플리케이션에 대한 요청 중 약 10%만 기록하게 됩니다. 대시보드에서는 값이 확대되어 표시되며, 근사치임을 나타내기 위해 `~` 기호가 접두사로 붙습니다.

일반적으로, 특정 지표에 대한 엔트리가 많을수록 정확도를 크게 희생하지 않고도 샘플 비율을 더 낮게 안전하게 설정할 수 있습니다.


### 트리밍 {#trimming}

Pulse는 대시보드 창을 벗어난 저장된 항목들을 자동으로 트리밍합니다. 트리밍은 로터리 시스템을 사용하여 데이터를 수집할 때 발생하며, Pulse [구성 파일](#configuration)에서 사용자 정의할 수 있습니다.


### Pulse 예외 처리 {#pulse-exceptions}

Pulse 데이터 캡처 중에 저장소 데이터베이스에 연결할 수 없는 등 예외가 발생하면, Pulse는 애플리케이션에 영향을 주지 않기 위해 조용히 실패합니다.

이러한 예외 처리 방식을 커스터마이즈하고 싶다면, `handleExceptionsUsing` 메서드에 클로저를 전달할 수 있습니다:

```php
use Laravel\Pulse\Facades\Pulse;
use Illuminate\Support\Facades\Log;

Pulse::handleExceptionsUsing(function ($e) {
    Log::debug('Pulse에서 예외가 발생했습니다.', [
        'message' => $e->getMessage(),
        'stack' => $e->getTraceAsString(),
    ]);
});
```


## 커스텀 카드 {#custom-cards}

Pulse는 애플리케이션의 특정 요구에 맞는 데이터를 표시할 수 있도록 커스텀 카드를 만들 수 있게 해줍니다. Pulse는 [Livewire](https://livewire.laravel.com)를 사용하므로, 첫 번째 커스텀 카드를 만들기 전에 [Livewire 문서](https://livewire.laravel.com/docs)를 검토하는 것이 좋습니다.


### 카드 컴포넌트 {#custom-card-components}

Laravel Pulse에서 커스텀 카드를 생성하려면 기본 `Card` Livewire 컴포넌트를 확장하고, 이에 해당하는 뷰를 정의하는 것부터 시작합니다:

```php
namespace App\Livewire\Pulse;

use Laravel\Pulse\Livewire\Card;
use Livewire\Attributes\Lazy;

#[Lazy]
class TopSellers extends Card
{
    public function render()
    {
        return view('livewire.pulse.top-sellers');
    }
}
```

Livewire의 [지연 로딩](https://livewire.laravel.com/docs/lazy) 기능을 사용할 때, `Card` 컴포넌트는 컴포넌트에 전달된 `cols`와 `rows` 속성을 반영하는 플레이스홀더를 자동으로 제공합니다.

Pulse 카드에 해당하는 뷰를 작성할 때, 일관된 디자인을 위해 Pulse의 Blade 컴포넌트를 활용할 수 있습니다:

```blade
<x-pulse::card :cols="$cols" :rows="$rows" :class="$class" wire:poll.5s="">
    <x-pulse::card-header name="Top Sellers">
        <x-slot:icon>
            ...
        </x-slot:icon>
    </x-pulse::card-header>

    <x-pulse::scroll :expand="$expand">
        ...
    </x-pulse::scroll>
</x-pulse::card>
```

`$cols`, `$rows`, `$class`, `$expand` 변수는 각각의 Blade 컴포넌트에 전달되어야 하며, 이를 통해 카드 레이아웃을 대시보드 뷰에서 커스터마이즈할 수 있습니다. 또한, 카드가 자동으로 갱신되도록 뷰에 `wire:poll.5s=""` 속성을 포함하는 것도 좋습니다.

Livewire 컴포넌트와 템플릿을 정의한 후에는, 해당 카드를 [대시보드 뷰](#dashboard-customization)에 포함시킬 수 있습니다:

```blade
<x-pulse>
    ...

    <livewire:pulse.top-sellers cols="4" />
</x-pulse>
```

> [!NOTE]
> 카드가 패키지에 포함되어 있다면, `Livewire::component` 메서드를 사용하여 해당 컴포넌트를 Livewire에 등록해야 합니다.


### 스타일링 {#custom-card-styling}

카드에 Pulse에 포함된 클래스와 컴포넌트 이상의 추가 스타일링이 필요한 경우, 카드에 맞춤 CSS를 포함할 수 있는 몇 가지 방법이 있습니다.


#### Laravel Vite 통합 {#custom-card-styling-vite}

커스텀 카드가 애플리케이션 코드베이스 내에 있고 Laravel의 [Vite 통합](/laravel/12.x/vite)을 사용 중이라면, `vite.config.js` 파일을 수정하여 카드 전용 CSS 엔트리 포인트를 추가할 수 있습니다:

```js
laravel({
    input: [
        'resources/css/pulse/top-sellers.css',
        // ...
    ],
}),
```

그런 다음, [대시보드 뷰](#dashboard-customization)에서 카드의 CSS 엔트리포인트를 지정하여 `@vite` Blade 디렉티브를 사용할 수 있습니다:

```blade
<x-pulse>
    @vite('resources/css/pulse/top-sellers.css')

    ...
</x-pulse>
```


#### CSS 파일 {#custom-card-styling-css}

패키지에 포함된 Pulse 카드 등 다른 사용 사례의 경우, Livewire 컴포넌트에 `css` 메서드를 정의하여 Pulse가 추가 스타일시트를 로드하도록 할 수 있습니다. 이 메서드는 CSS 파일의 경로를 반환해야 합니다:

```php
class TopSellers extends Card
{
    // ...

    protected function css()
    {
        return __DIR__.'/../../dist/top-sellers.css';
    }
}
```

이 카드가 대시보드에 포함되면, Pulse는 이 파일의 내용을 자동으로 `<style>` 태그 안에 포함시키므로, 해당 파일을 `public` 디렉터리에 별도로 배포할 필요가 없습니다.


#### Tailwind CSS {#custom-card-styling-tailwind}

Tailwind CSS를 사용할 때는 불필요한 CSS가 로드되거나 Pulse의 Tailwind 클래스와 충돌하는 것을 방지하기 위해 전용 Tailwind 설정 파일을 생성해야 합니다:

```js
export default {
    darkMode: 'class',
    important: '#top-sellers',
    content: [
        './resources/views/livewire/pulse/top-sellers.blade.php',
    ],
    corePlugins: {
        preflight: false,
    },
};
```

그런 다음 CSS 엔트리포인트에서 설정 파일을 지정할 수 있습니다:

```css
@config "../../tailwind.top-sellers.config.js";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

또한 카드 뷰에 Tailwind의 [important selector 전략](https://tailwindcss.com/docs/configuration#selector-strategy)에 전달한 선택자와 일치하는 `id` 또는 `class` 속성을 포함해야 합니다:

```blade
<x-pulse::card id="top-sellers" :cols="$cols" :rows="$rows" class="$class">
    ...
</x-pulse::card>
```


### 데이터 수집 및 집계 {#custom-card-data}

커스텀 카드는 어디에서든 데이터를 가져와 표시할 수 있지만, Pulse의 강력하고 효율적인 데이터 기록 및 집계 시스템을 활용하고 싶을 수도 있습니다.


#### 엔트리 캡처하기 {#custom-card-data-capture}

Pulse는 `Pulse::record` 메서드를 사용하여 "엔트리"를 기록할 수 있습니다:

```php
use Laravel\Pulse\Facades\Pulse;

Pulse::record('user_sale', $user->id, $sale->amount)
    ->sum()
    ->count();
```

`record` 메서드에 제공되는 첫 번째 인자는 기록할 엔트리의 `type`이고, 두 번째 인자는 집계된 데이터가 어떻게 그룹화될지 결정하는 `key`입니다. 대부분의 집계 메서드에서는 집계할 `value`도 지정해야 합니다. 위 예시에서는 집계되는 값이 `$sale->amount`입니다. 이후 하나 이상의 집계 메서드(예: `sum`)를 호출하여, Pulse가 사전에 집계된 값을 "버킷"에 저장해 나중에 효율적으로 조회할 수 있도록 할 수 있습니다.

사용 가능한 집계 메서드는 다음과 같습니다:

* `avg`
* `count`
* `max`
* `min`
* `sum`

> [!NOTE]
> 현재 인증된 사용자 ID를 캡처하는 카드 패키지를 만들 때는, 애플리케이션에 적용된 [사용자 리졸버 커스터마이징](#dashboard-resolving-users)을 존중하는 `Pulse::resolveAuthenticatedUserId()` 메서드를 사용해야 합니다.


#### 집계 데이터 가져오기 {#custom-card-data-retrieval}

Pulse의 `Card` Livewire 컴포넌트를 확장할 때, 대시보드에서 보고 있는 기간에 대한 집계 데이터를 가져오기 위해 `aggregate` 메서드를 사용할 수 있습니다:

```php
class TopSellers extends Card
{
    public function render()
    {
        return view('livewire.pulse.top-sellers', [
            'topSellers' => $this->aggregate('user_sale', ['sum', 'count'])
        ]);
    }
}
```

`aggregate` 메서드는 PHP의 `stdClass` 객체 컬렉션을 반환합니다. 각 객체는 앞서 캡처된 `key` 속성과, 요청한 각 집계에 대한 키를 포함하게 됩니다:

```blade
@foreach ($topSellers as $seller)
    {{ $seller->key }}
    {{ $seller->sum }}
    {{ $seller->count }}
@endforeach
```

Pulse는 주로 사전 집계된 버킷에서 데이터를 가져오므로, 지정한 집계는 반드시 `Pulse::record` 메서드를 사용해 미리 캡처되어 있어야 합니다. 가장 오래된 버킷은 일반적으로 기간의 일부만 포함하므로, Pulse는 전체 기간에 대해 정확한 값을 제공하기 위해 가장 오래된 항목을 집계하여 그 차이를 메웁니다. 이로 인해 매 폴링 요청마다 전체 기간을 집계할 필요가 없습니다.

또한, `aggregateTotal` 메서드를 사용하여 특정 타입의 전체 값을 가져올 수도 있습니다. 예를 들어, 아래 메서드는 사용자별로 그룹화하지 않고 모든 사용자 판매의 합계를 가져옵니다.

```php
$total = $this->aggregateTotal('user_sale', 'sum');
```


#### 사용자 표시 {#custom-card-displaying-users}

사용자 ID를 키로 기록하는 집계를 다룰 때, `Pulse::resolveUsers` 메서드를 사용하여 해당 키를 사용자 레코드로 변환할 수 있습니다:

```php
$aggregates = $this->aggregate('user_sale', ['sum', 'count']);

$users = Pulse::resolveUsers($aggregates->pluck('key'));

return view('livewire.pulse.top-sellers', [
    'sellers' => $aggregates->map(fn ($aggregate) => (object) [
        'user' => $users->find($aggregate->key),
        'sum' => $aggregate->sum,
        'count' => $aggregate->count,
    ])
]);
```

`find` 메서드는 `name`, `extra`, `avatar` 키를 포함하는 객체를 반환하며, 이 객체를 `<x-pulse::user-card>` Blade 컴포넌트에 직접 전달할 수 있습니다:

```blade
<x-pulse::user-card :user="{{ $seller->user }}" :stats="{{ $seller->sum }}" />
```


#### 커스텀 레코더 {#custom-recorders}

패키지 작성자는 사용자가 데이터 캡처 구성을 할 수 있도록 레코더 클래스를 제공할 수 있습니다.

레코더는 애플리케이션의 `config/pulse.php` 설정 파일의 `recorders` 섹션에 등록됩니다:

```php
[
    // ...
    'recorders' => [
        Acme\Recorders\Deployments::class => [
            // ...
        ],

        // ...
    ],
]
```

레코더는 `$listen` 프로퍼티를 지정하여 이벤트를 청취할 수 있습니다. Pulse는 리스너를 자동으로 등록하고 레코더의 `record` 메서드를 호출합니다:

```php
<?php

namespace Acme\Recorders;

use Acme\Events\Deployment;
use Illuminate\Support\Facades\Config;
use Laravel\Pulse\Facades\Pulse;

class Deployments
{
    /**
     * 청취할 이벤트 목록입니다.
     *
     * @var array<int, class-string>
     */
    public array $listen = [
        Deployment::class,
    ];

    /**
     * 배포를 기록합니다.
     */
    public function record(Deployment $event): void
    {
        $config = Config::get('pulse.recorders.'.static::class);

        Pulse::record(
            // ...
        );
    }
}
```
