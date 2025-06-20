# Laravel Pulse
























## 소개 {#introduction}

[Laravel Pulse](https://github.com/laravel/pulse)는 애플리케이션의 성능과 사용 현황을 한눈에 파악할 수 있는 인사이트를 제공합니다. Pulse를 사용하면 느린 작업이나 엔드포인트와 같은 병목 현상을 추적하고, 가장 활발한 사용자를 찾는 등 다양한 정보를 확인할 수 있습니다.

개별 이벤트의 심층 디버깅이 필요하다면 [Laravel Telescope](/laravel/12.x/telescope)를 참고하세요.


## 설치 {#installation}

> [!WARNING]
> Pulse의 공식 스토리지 구현은 현재 MySQL, MariaDB, 또는 PostgreSQL 데이터베이스가 필요합니다. 다른 데이터베이스 엔진을 사용하는 경우, Pulse 데이터를 위한 별도의 MySQL, MariaDB, 또는 PostgreSQL 데이터베이스가 필요합니다.

Composer 패키지 매니저를 사용하여 Pulse를 설치할 수 있습니다:

```shell
composer require laravel/pulse
```

다음으로, `vendor:publish` Artisan 명령어를 사용하여 Pulse 설정 및 마이그레이션 파일을 퍼블리시해야 합니다:

```shell
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
```

마지막으로, Pulse 데이터 저장에 필요한 테이블을 생성하기 위해 `migrate` 명령어를 실행해야 합니다:

```shell
php artisan migrate
```

Pulse의 데이터베이스 마이그레이션이 완료되면 `/pulse` 경로를 통해 Pulse 대시보드에 접근할 수 있습니다.

> [!NOTE]
> Pulse 데이터를 애플리케이션의 기본 데이터베이스에 저장하고 싶지 않다면, [전용 데이터베이스 연결을 지정](#using-a-different-database)할 수 있습니다.


### 설정 {#configuration}

Pulse의 많은 설정 옵션은 환경 변수로 제어할 수 있습니다. 사용 가능한 옵션을 확인하거나, 새로운 레코더를 등록하거나, 고급 옵션을 설정하려면 `config/pulse.php` 설정 파일을 퍼블리시할 수 있습니다:

```shell
php artisan vendor:publish --tag=pulse-config
```


## 대시보드 {#dashboard}


### 인증 {#dashboard-authorization}

Pulse 대시보드는 `/pulse` 경로를 통해 접근할 수 있습니다. 기본적으로 `local` 환경에서만 이 대시보드에 접근할 수 있으므로, 프로덕션 환경에서는 `'viewPulse'` 인증 게이트를 커스터마이징하여 인증을 설정해야 합니다. 이는 애플리케이션의 `app/Providers/AppServiceProvider.php` 파일에서 설정할 수 있습니다:

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

Pulse 대시보드의 카드와 레이아웃은 대시보드 뷰를 퍼블리시하여 설정할 수 있습니다. 대시보드 뷰는 `resources/views/vendor/pulse/dashboard.blade.php`에 퍼블리시됩니다:

```shell
php artisan vendor:publish --tag=pulse-dashboard
```

대시보드는 [Livewire](https://livewire.laravel.com/)로 구동되며, 자바스크립트 에셋을 다시 빌드하지 않고도 카드와 레이아웃을 커스터마이징할 수 있습니다.

이 파일 내에서 `<x-pulse>` 컴포넌트가 대시보드 렌더링을 담당하며, 카드들을 위한 그리드 레이아웃을 제공합니다. 대시보드를 화면 전체 너비로 확장하고 싶다면, 컴포넌트에 `full-width` prop을 전달할 수 있습니다:

```blade
<x-pulse full-width>
    ...
</x-pulse>
```

기본적으로 `<x-pulse>` 컴포넌트는 12 컬럼 그리드를 생성하지만, `cols` prop을 사용해 이를 커스터마이징할 수 있습니다:

```blade
<x-pulse cols="16">
    ...
</x-pulse>
```

각 카드는 공간과 위치를 제어하기 위해 `cols`와 `rows` prop을 받습니다:

```blade
<livewire:pulse.usage cols="4" rows="2" />
```

대부분의 카드에서는 스크롤 대신 전체 카드를 보여주기 위해 `expand` prop도 사용할 수 있습니다:

```blade
<livewire:pulse.slow-queries expand />
```


### 사용자 해석 {#dashboard-resolving-users}

Application Usage 카드 등 사용자 정보를 표시하는 카드의 경우, Pulse는 사용자의 ID만 기록합니다. 대시보드 렌더링 시 Pulse는 기본 `Authenticatable` 모델에서 `name`과 `email` 필드를 해석하고, Gravatar 웹 서비스를 통해 아바타를 표시합니다.

필드와 아바타를 커스터마이징하려면 애플리케이션의 `App\Providers\AppServiceProvider` 클래스에서 `Pulse::user` 메서드를 호출하면 됩니다.

`user` 메서드는 표시할 `Authenticatable` 모델을 받아, 사용자에 대한 `name`, `extra`, `avatar` 정보를 담은 배열을 반환하는 클로저를 받습니다:

```php
use Laravel\Pulse\Facades\Pulse;

/**
 * Bootstrap any application services.
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
> 인증된 사용자를 캡처하고 조회하는 방식을 완전히 커스터마이징하려면, `Laravel\Pulse\Contracts\ResolvesUsers` 계약을 구현하고 Laravel의 [서비스 컨테이너](/laravel/12.x/container#binding-a-singleton)에 바인딩하면 됩니다.


### 카드 {#dashboard-cards}


#### 서버 {#servers-card}

`<livewire:pulse.servers />` 카드는 `pulse:check` 명령어를 실행 중인 모든 서버의 시스템 리소스 사용량을 표시합니다. 시스템 리소스 리포팅에 대한 자세한 내용은 [서버 레코더](#servers-recorder) 문서를 참고하세요.

인프라에서 서버를 교체한 경우, 일정 시간이 지난 후 Pulse 대시보드에서 비활성 서버를 더 이상 표시하지 않도록 할 수 있습니다. 이를 위해 비활성 서버가 대시보드에서 제거될 시간을 초 단위로 받는 `ignore-after` prop을 사용할 수 있습니다. 또는 `1 hour`, `3 days and 1 hour`와 같은 상대적 시간 문자열도 사용할 수 있습니다:

```blade
<livewire:pulse.servers ignore-after="3 hours" />
```


#### 애플리케이션 사용량 {#application-usage-card}

`<livewire:pulse.usage />` 카드는 애플리케이션에 요청을 보내거나, 작업을 디스패치하거나, 느린 요청을 경험한 상위 10명의 사용자를 표시합니다.

모든 사용량 지표를 한 화면에서 보고 싶다면, 카드를 여러 번 포함하고 `type` 속성을 지정할 수 있습니다:

```blade
<livewire:pulse.usage type="requests" />
<livewire:pulse.usage type="slow_requests" />
<livewire:pulse.usage type="jobs" />
```

Pulse가 사용자 정보를 조회하고 표시하는 방식을 커스터마이징하는 방법은 [사용자 해석](#dashboard-resolving-users) 문서를 참고하세요.

> [!NOTE]
> 애플리케이션이 많은 요청을 받거나 작업을 많이 디스패치한다면, [샘플링](#sampling)을 활성화하는 것이 좋습니다. 자세한 내용은 [user requests recorder](#user-requests-recorder), [user jobs recorder](#user-jobs-recorder), [slow jobs recorder](#slow-jobs-recorder) 문서를 참고하세요.


#### 예외 {#exceptions-card}

`<livewire:pulse.exceptions />` 카드는 애플리케이션에서 발생한 예외의 빈도와 최근 발생 시점을 보여줍니다. 기본적으로 예외는 예외 클래스와 발생 위치를 기준으로 그룹화됩니다. 자세한 내용은 [exceptions recorder](#exceptions-recorder) 문서를 참고하세요.


#### 큐 {#queues-card}

`<livewire:pulse.queues />` 카드는 애플리케이션의 큐 처리량을 보여주며, 대기 중, 처리 중, 처리 완료, 릴리즈, 실패한 작업 수를 포함합니다. 자세한 내용은 [queues recorder](#queues-recorder) 문서를 참고하세요.


#### 느린 요청 {#slow-requests-card}

`<livewire:pulse.slow-requests />` 카드는 기본값 1,000ms를 초과하는 애플리케이션의 인커밍 요청을 보여줍니다. 자세한 내용은 [slow requests recorder](#slow-requests-recorder) 문서를 참고하세요.


#### 느린 작업 {#slow-jobs-card}

`<livewire:pulse.slow-jobs />` 카드는 기본값 1,000ms를 초과하는 애플리케이션의 대기 작업을 보여줍니다. 자세한 내용은 [slow jobs recorder](#slow-jobs-recorder) 문서를 참고하세요.


#### 느린 쿼리 {#slow-queries-card}

`<livewire:pulse.slow-queries />` 카드는 기본값 1,000ms를 초과하는 애플리케이션의 데이터베이스 쿼리를 보여줍니다.

기본적으로 느린 쿼리는 SQL 쿼리(바인딩 제외)와 발생 위치를 기준으로 그룹화되지만, 위치를 캡처하지 않고 SQL 쿼리만으로 그룹화할 수도 있습니다.

매우 큰 SQL 쿼리의 구문 하이라이팅으로 인해 렌더링 성능 문제가 발생한다면, `without-highlighting` prop을 추가하여 하이라이팅을 비활성화할 수 있습니다:

```blade
<livewire:pulse.slow-queries without-highlighting />
```

자세한 내용은 [slow queries recorder](#slow-queries-recorder) 문서를 참고하세요.


#### 느린 아웃고잉 요청 {#slow-outgoing-requests-card}

`<livewire:pulse.slow-outgoing-requests />` 카드는 Laravel의 [HTTP 클라이언트](/laravel/12.x/http-client)를 사용하여 기본값 1,000ms를 초과하는 아웃고잉 요청을 보여줍니다.

기본적으로 엔트리는 전체 URL로 그룹화됩니다. 하지만 정규식을 사용해 유사한 아웃고잉 요청을 정규화하거나 그룹화할 수 있습니다. 자세한 내용은 [slow outgoing requests recorder](#slow-outgoing-requests-recorder) 문서를 참고하세요.


#### 캐시 {#cache-card}

`<livewire:pulse.cache />` 카드는 애플리케이션의 캐시 적중 및 실패 통계를 전역 및 개별 키별로 보여줍니다.

기본적으로 엔트리는 키별로 그룹화됩니다. 하지만 정규식을 사용해 유사한 키를 정규화하거나 그룹화할 수 있습니다. 자세한 내용은 [cache interactions recorder](#cache-interactions-recorder) 문서를 참고하세요.


## 엔트리 캡처 {#capturing-entries}

대부분의 Pulse 레코더는 Laravel에서 디스패치되는 프레임워크 이벤트를 기반으로 자동으로 엔트리를 캡처합니다. 하지만 [서버 레코더](#servers-recorder) 및 일부 서드파티 카드는 정기적으로 정보를 폴링해야 합니다. 이러한 카드를 사용하려면 각 애플리케이션 서버에서 `pulse:check` 데몬을 실행해야 합니다:

```php
php artisan pulse:check
```

> [!NOTE]
> `pulse:check` 프로세스를 백그라운드에서 영구적으로 실행하려면 Supervisor와 같은 프로세스 모니터를 사용하여 명령어가 중단되지 않도록 해야 합니다.

`pulse:check` 명령어는 장시간 실행되는 프로세스이므로, 코드베이스 변경 사항을 감지하지 못합니다. 배포 과정에서 `pulse:restart` 명령어를 호출하여 명령어를 정상적으로 재시작해야 합니다:

```shell
php artisan pulse:restart
```

> [!NOTE]
> Pulse는 [캐시](/laravel/12.x/cache)를 사용해 재시작 신호를 저장하므로, 이 기능을 사용하기 전에 애플리케이션에 적절한 캐시 드라이버가 설정되어 있는지 확인해야 합니다.


### 레코더 {#recorders}

레코더는 애플리케이션에서 Pulse 데이터베이스에 기록할 엔트리를 캡처하는 역할을 합니다. 레코더는 [Pulse 설정 파일](#configuration)의 `recorders` 섹션에서 등록 및 설정됩니다.


#### 캐시 상호작용 {#cache-interactions-recorder}

`CacheInteractions` 레코더는 애플리케이션에서 발생하는 [캐시](/laravel/12.x/cache) 적중 및 실패 정보를 [Cache](#cache-card) 카드에 표시하기 위해 캡처합니다.

[샘플링 비율](#sampling)과 무시할 키 패턴을 선택적으로 조정할 수 있습니다.

또한 유사한 키를 하나의 엔트리로 그룹화하도록 키 그룹핑을 설정할 수 있습니다. 예를 들어, 동일한 유형의 정보를 캐싱하는 키에서 고유 ID를 제거하고 싶을 수 있습니다. 그룹은 정규식을 사용해 키의 일부를 "찾아 바꾸기" 방식으로 설정합니다. 설정 파일에 예시가 포함되어 있습니다:

```php
Recorders\CacheInteractions::class => [
    // ...
    'groups' => [
        // '/:\d+/' => ':*',
    ],
],
```

처음 일치하는 패턴이 사용됩니다. 일치하는 패턴이 없으면 키가 그대로 캡처됩니다.


#### 예외 {#exceptions-recorder}

`Exceptions` 레코더는 애플리케이션에서 발생한 보고 가능한 예외 정보를 [Exceptions](#exceptions-card) 카드에 표시하기 위해 캡처합니다.

[샘플링 비율](#sampling)과 무시할 예외 패턴을 선택적으로 조정할 수 있습니다. 또한 예외가 발생한 위치를 캡처할지 여부도 설정할 수 있습니다. 캡처된 위치는 Pulse 대시보드에 표시되어 예외의 원인을 추적하는 데 도움이 됩니다. 단, 동일한 예외가 여러 위치에서 발생하면 각 고유 위치마다 여러 번 표시됩니다.


#### 큐 {#queues-recorder}

`Queues` 레코더는 애플리케이션의 큐 정보를 [Queues](#queues-card)에 표시하기 위해 캡처합니다.

[샘플링 비율](#sampling)과 무시할 작업 패턴을 선택적으로 조정할 수 있습니다.


#### 느린 작업 {#slow-jobs-recorder}

`SlowJobs` 레코더는 애플리케이션에서 발생한 느린 작업 정보를 [Slow Jobs](#slow-jobs-recorder) 카드에 표시하기 위해 캡처합니다.

느린 작업 임계값, [샘플링 비율](#sampling), 무시할 작업 패턴을 선택적으로 조정할 수 있습니다.

일부 작업이 다른 작업보다 오래 걸릴 것으로 예상된다면, 작업별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowJobs::class => [
    // ...
    'threshold' => [
        '#^App\\Jobs\\GenerateYearlyReports$#' => 5000,
        'default' => env('PULSE_SLOW_JOBS_THRESHOLD', 1000),
    ],
],
```

작업 클래스명이 정규식 패턴과 일치하지 않으면 `'default'` 값이 사용됩니다.


#### 느린 아웃고잉 요청 {#slow-outgoing-requests-recorder}

`SlowOutgoingRequests` 레코더는 Laravel의 [HTTP 클라이언트](/laravel/12.x/http-client)를 사용해 임계값을 초과하는 아웃고잉 HTTP 요청 정보를 [Slow Outgoing Requests](#slow-outgoing-requests-card) 카드에 표시하기 위해 캡처합니다.

느린 아웃고잉 요청 임계값, [샘플링 비율](#sampling), 무시할 URL 패턴을 선택적으로 조정할 수 있습니다.

일부 아웃고잉 요청이 다른 요청보다 오래 걸릴 것으로 예상된다면, 요청별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowOutgoingRequests::class => [
    // ...
    'threshold' => [
        '#backup.zip$#' => 5000,
        'default' => env('PULSE_SLOW_OUTGOING_REQUESTS_THRESHOLD', 1000),
    ],
],
```

요청 URL이 정규식 패턴과 일치하지 않으면 `'default'` 값이 사용됩니다.

또한 유사한 URL을 하나의 엔트리로 그룹화하도록 URL 그룹핑을 설정할 수 있습니다. 예를 들어, URL 경로에서 고유 ID를 제거하거나 도메인별로 그룹화할 수 있습니다. 그룹은 정규식을 사용해 URL의 일부를 "찾아 바꾸기" 방식으로 설정합니다. 설정 파일에 몇 가지 예시가 포함되어 있습니다:

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

처음 일치하는 패턴이 사용됩니다. 일치하는 패턴이 없으면 URL이 그대로 캡처됩니다.


#### 느린 쿼리 {#slow-queries-recorder}

`SlowQueries` 레코더는 애플리케이션에서 임계값을 초과하는 데이터베이스 쿼리를 [Slow Queries](#slow-queries-card) 카드에 표시하기 위해 캡처합니다.

느린 쿼리 임계값, [샘플링 비율](#sampling), 무시할 쿼리 패턴을 선택적으로 조정할 수 있습니다. 쿼리 위치를 캡처할지 여부도 설정할 수 있습니다. 캡처된 위치는 Pulse 대시보드에 표시되어 쿼리의 원인을 추적하는 데 도움이 됩니다. 단, 동일한 쿼리가 여러 위치에서 실행되면 각 고유 위치마다 여러 번 표시됩니다.

일부 쿼리가 다른 쿼리보다 오래 걸릴 것으로 예상된다면, 쿼리별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowQueries::class => [
    // ...
    'threshold' => [
        '#^insert into `yearly_reports`#' => 5000,
        'default' => env('PULSE_SLOW_QUERIES_THRESHOLD', 1000),
    ],
],
```

쿼리 SQL이 정규식 패턴과 일치하지 않으면 `'default'` 값이 사용됩니다.


#### 느린 요청 {#slow-requests-recorder}

`Requests` 레코더는 애플리케이션에 대한 요청 정보를 [Slow Requests](#slow-requests-card) 및 [Application Usage](#application-usage-card) 카드에 표시하기 위해 캡처합니다.

느린 라우트 임계값, [샘플링 비율](#sampling), 무시할 경로를 선택적으로 조정할 수 있습니다.

일부 요청이 다른 요청보다 오래 걸릴 것으로 예상된다면, 요청별 임계값을 설정할 수 있습니다:

```php
Recorders\SlowRequests::class => [
    // ...
    'threshold' => [
        '#^/admin/#' => 5000,
        'default' => env('PULSE_SLOW_REQUESTS_THRESHOLD', 1000),
    ],
],
```

요청 URL이 정규식 패턴과 일치하지 않으면 `'default'` 값이 사용됩니다.


#### 서버 {#servers-recorder}

`Servers` 레코더는 애플리케이션을 구동하는 서버의 CPU, 메모리, 스토리지 사용량을 [Servers](#servers-card) 카드에 표시하기 위해 캡처합니다. 이 레코더는 모니터링하려는 각 서버에서 [pulse:check 명령어](#capturing-entries)가 실행 중이어야 합니다.

각 리포팅 서버는 고유한 이름을 가져야 합니다. 기본적으로 Pulse는 PHP의 `gethostname` 함수가 반환하는 값을 사용합니다. 이를 커스터마이징하려면 `PULSE_SERVER_NAME` 환경 변수를 설정할 수 있습니다:

```env
PULSE_SERVER_NAME=load-balancer
```

Pulse 설정 파일에서 모니터링할 디렉터리도 커스터마이징할 수 있습니다.


#### 사용자 작업 {#user-jobs-recorder}

`UserJobs` 레코더는 애플리케이션에서 작업을 디스패치하는 사용자 정보를 [Application Usage](#application-usage-card) 카드에 표시하기 위해 캡처합니다.

[샘플링 비율](#sampling)과 무시할 작업 패턴을 선택적으로 조정할 수 있습니다.


#### 사용자 요청 {#user-requests-recorder}

`UserRequests` 레코더는 애플리케이션에 요청을 보내는 사용자 정보를 [Application Usage](#application-usage-card) 카드에 표시하기 위해 캡처합니다.

[샘플링 비율](#sampling)과 무시할 URL 패턴을 선택적으로 조정할 수 있습니다.


### 필터링 {#filtering}

앞서 살펴본 것처럼, 많은 [레코더](#recorders)는 설정을 통해 요청 URL 등 값에 따라 들어오는 엔트리를 "무시"할 수 있습니다. 하지만 때로는 현재 인증된 사용자 등 다른 요소를 기준으로 레코드를 필터링하는 것이 유용할 수 있습니다. 이러한 레코드를 필터링하려면 Pulse의 `filter` 메서드에 클로저를 전달할 수 있습니다. 일반적으로 `filter` 메서드는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드 내에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Auth;
use Laravel\Pulse\Entry;
use Laravel\Pulse\Facades\Pulse;
use Laravel\Pulse\Value;

/**
 * Bootstrap any application services.
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

Pulse는 추가 인프라 없이 기존 애플리케이션에 바로 적용할 수 있도록 설계되었습니다. 하지만 트래픽이 많은 애플리케이션의 경우, Pulse가 애플리케이션 성능에 미치는 영향을 최소화할 수 있는 여러 방법이 있습니다.


### 다른 데이터베이스 사용 {#using-a-different-database}

트래픽이 많은 애플리케이션의 경우, Pulse를 위해 전용 데이터베이스 연결을 사용하여 애플리케이션 데이터베이스에 영향을 주지 않도록 할 수 있습니다.

Pulse에서 사용할 [데이터베이스 연결](/laravel/12.x/database#configuration)은 `PULSE_DB_CONNECTION` 환경 변수를 설정하여 커스터마이징할 수 있습니다.

```env
PULSE_DB_CONNECTION=pulse
```


### Redis 인제스트 {#ingest}

> [!WARNING]
> Redis 인제스트는 Redis 6.2 이상과 애플리케이션의 Redis 클라이언트 드라이버로 `phpredis` 또는 `predis`가 필요합니다.

기본적으로 Pulse는 [설정된 데이터베이스 연결](#using-a-different-database)에 HTTP 응답이 클라이언트에 전송되거나 작업이 처리된 후 엔트리를 직접 저장합니다. 하지만 Pulse의 Redis 인제스트 드라이버를 사용하면 엔트리를 Redis 스트림으로 전송할 수 있습니다. 이는 `PULSE_INGEST_DRIVER` 환경 변수를 설정하여 활성화할 수 있습니다:

```ini
PULSE_INGEST_DRIVER=redis
```

Pulse는 기본적으로 [Redis 연결](/laravel/12.x/redis#configuration)을 사용하지만, `PULSE_REDIS_CONNECTION` 환경 변수로 커스터마이징할 수 있습니다:

```ini
PULSE_REDIS_CONNECTION=pulse
```

Redis 인제스트를 사용할 때는 `pulse:work` 명령어를 실행하여 스트림을 모니터링하고 Redis에서 Pulse 데이터베이스 테이블로 엔트리를 이동해야 합니다.

```php
php artisan pulse:work
```

> [!NOTE]
> `pulse:work` 프로세스를 백그라운드에서 영구적으로 실행하려면 Supervisor와 같은 프로세스 모니터를 사용하여 Pulse 워커가 중단되지 않도록 해야 합니다.

`pulse:work` 명령어는 장시간 실행되는 프로세스이므로, 코드베이스 변경 사항을 감지하지 못합니다. 배포 과정에서 `pulse:restart` 명령어를 호출하여 명령어를 정상적으로 재시작해야 합니다:

```shell
php artisan pulse:restart
```

> [!NOTE]
> Pulse는 [캐시](/laravel/12.x/cache)를 사용해 재시작 신호를 저장하므로, 이 기능을 사용하기 전에 애플리케이션에 적절한 캐시 드라이버가 설정되어 있는지 확인해야 합니다.


### 샘플링 {#sampling}

기본적으로 Pulse는 애플리케이션에서 발생하는 모든 관련 이벤트를 캡처합니다. 트래픽이 많은 애플리케이션의 경우, 특히 긴 기간 동안 대시보드에서 수백만 개의 데이터베이스 행을 집계해야 할 수 있습니다.

이 대신, 특정 Pulse 데이터 레코더에서 "샘플링"을 활성화할 수 있습니다. 예를 들어, [User Requests](#user-requests-recorder) 레코더의 샘플 비율을 `0.1`로 설정하면 전체 요청의 약 10%만 기록하게 됩니다. 대시보드에서는 값이 상향 조정되어 `~` 기호가 붙어 근사치임을 나타냅니다.

일반적으로, 특정 지표에 대한 엔트리가 많을수록 샘플 비율을 더 낮게 설정해도 정확도가 크게 떨어지지 않습니다.


### 트리밍 {#trimming}

Pulse는 대시보드 윈도우를 벗어난 저장된 엔트리를 자동으로 트리밍합니다. 트리밍은 데이터 인제스트 시 로터리 시스템을 사용해 발생하며, Pulse [설정 파일](#configuration)에서 커스터마이징할 수 있습니다.


### Pulse 예외 처리 {#pulse-exceptions}

Pulse 데이터 캡처 중 예외가 발생하면(예: 스토리지 데이터베이스 연결 실패 등), Pulse는 애플리케이션에 영향을 주지 않도록 조용히 실패합니다.

이러한 예외 처리 방식을 커스터마이징하려면, `handleExceptionsUsing` 메서드에 클로저를 전달할 수 있습니다:

```php
use Laravel\Pulse\Facades\Pulse;
use Illuminate\Support\Facades\Log;

Pulse::handleExceptionsUsing(function ($e) {
    Log::debug('An exception happened in Pulse', [
        'message' => $e->getMessage(),
        'stack' => $e->getTraceAsString(),
    ]);
});
```


## 커스텀 카드 {#custom-cards}

Pulse를 사용하면 애플리케이션의 특정 요구에 맞는 데이터를 표시하는 커스텀 카드를 만들 수 있습니다. Pulse는 [Livewire](https://livewire.laravel.com)를 사용하므로, 첫 커스텀 카드를 만들기 전에 [공식 문서](https://livewire.laravel.com/docs)를 참고하는 것이 좋습니다.


### 카드 컴포넌트 {#custom-card-components}

Laravel Pulse에서 커스텀 카드를 만들려면 기본 `Card` Livewire 컴포넌트를 확장하고, 해당 뷰를 정의하는 것부터 시작합니다:

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

Livewire의 [lazy loading](https://livewire.laravel.com/docs/lazy) 기능을 사용할 때, `Card` 컴포넌트는 컴포넌트에 전달된 `cols`와 `rows` 속성을 반영하는 플레이스홀더를 자동으로 제공합니다.

Pulse 카드의 뷰를 작성할 때, 일관된 디자인을 위해 Pulse의 Blade 컴포넌트를 활용할 수 있습니다:

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

`$cols`, `$rows`, `$class`, `$expand` 변수는 각각의 Blade 컴포넌트에 전달되어 카드 레이아웃을 대시보드 뷰에서 커스터마이징할 수 있습니다. 또한 뷰에 `wire:poll.5s=""` 속성을 포함해 카드를 자동으로 갱신할 수도 있습니다.

Livewire 컴포넌트와 템플릿을 정의한 후, 카드를 [대시보드 뷰](#dashboard-customization)에 포함할 수 있습니다:

```blade
<x-pulse>
    ...

    <livewire:pulse.top-sellers cols="4" />
</x-pulse>
```

> [!NOTE]
> 카드가 패키지에 포함되어 있다면, `Livewire::component` 메서드를 사용해 컴포넌트를 Livewire에 등록해야 합니다.


### 스타일링 {#custom-card-styling}

카드에 Pulse에 포함된 클래스와 컴포넌트 외에 추가 스타일링이 필요하다면, 커스텀 CSS를 포함하는 몇 가지 방법이 있습니다.


#### Laravel Vite 통합 {#custom-card-styling-vite}

커스텀 카드가 애플리케이션 코드베이스 내에 있고, Laravel의 [Vite 통합](/laravel/12.x/vite)을 사용 중이라면, `vite.config.js` 파일을 수정해 카드 전용 CSS 엔트리포인트를 추가할 수 있습니다:

```js
laravel({
    input: [
        'resources/css/pulse/top-sellers.css',
        // ...
    ],
}),
```

그런 다음 [대시보드 뷰](#dashboard-customization)에서 `@vite` Blade 디렉티브를 사용해 카드의 CSS 엔트리포인트를 지정할 수 있습니다:

```blade
<x-pulse>
    @vite('resources/css/pulse/top-sellers.css')

    ...
</x-pulse>
```


#### CSS 파일 {#custom-card-styling-css}

패키지에 포함된 Pulse 카드 등 다른 경우에는, Livewire 컴포넌트에 CSS 파일 경로를 반환하는 `css` 메서드를 정의해 Pulse가 추가 스타일시트를 로드하도록 할 수 있습니다:

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

이 카드가 대시보드에 포함되면, Pulse는 이 파일의 내용을 `<style>` 태그 내에 자동으로 포함하므로 `public` 디렉터리에 퍼블리시할 필요가 없습니다.


#### Tailwind CSS {#custom-card-styling-tailwind}

Tailwind CSS를 사용할 때는 불필요한 CSS 로딩이나 Pulse의 Tailwind 클래스와의 충돌을 방지하기 위해 전용 Tailwind 설정 파일을 생성해야 합니다:

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

또한 Tailwind의 [important selector strategy](https://tailwindcss.com/docs/configuration#selector-strategy)에 전달한 선택자와 일치하는 `id` 또는 `class` 속성을 카드 뷰에 포함해야 합니다:

```blade
<x-pulse::card id="top-sellers" :cols="$cols" :rows="$rows" class="$class">
    ...
</x-pulse::card>
```


### 데이터 캡처 및 집계 {#custom-card-data}

커스텀 카드는 어디서든 데이터를 가져와 표시할 수 있지만, Pulse의 강력하고 효율적인 데이터 기록 및 집계 시스템을 활용할 수도 있습니다.


#### 엔트리 캡처 {#custom-card-data-capture}

Pulse는 `Pulse::record` 메서드를 사용해 "엔트리"를 기록할 수 있습니다:

```php
use Laravel\Pulse\Facades\Pulse;

Pulse::record('user_sale', $user->id, $sale->amount)
    ->sum()
    ->count();
```

`record` 메서드의 첫 번째 인자는 기록할 엔트리의 `type`, 두 번째 인자는 집계 데이터의 그룹화를 결정하는 `key`입니다. 대부분의 집계 메서드에서는 집계할 `value`도 지정해야 합니다. 위 예시에서는 `$sale->amount`가 집계 값입니다. 이후 하나 이상의 집계 메서드(예: `sum`)를 호출해 Pulse가 효율적인 조회를 위해 "버킷"에 미리 집계된 값을 캡처할 수 있도록 합니다.

사용 가능한 집계 메서드는 다음과 같습니다:

* `avg`
* `count`
* `max`
* `min`
* `sum`

> [!NOTE]
> 현재 인증된 사용자 ID를 캡처하는 카드 패키지를 만들 때는, 애플리케이션의 [사용자 해석 커스터마이징](#dashboard-resolving-users)을 존중하는 `Pulse::resolveAuthenticatedUserId()` 메서드를 사용해야 합니다.


#### 집계 데이터 조회 {#custom-card-data-retrieval}

Pulse의 `Card` Livewire 컴포넌트를 확장할 때, 대시보드에서 조회 중인 기간에 대한 집계 데이터를 가져오기 위해 `aggregate` 메서드를 사용할 수 있습니다:

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

`aggregate` 메서드는 PHP `stdClass` 객체의 컬렉션을 반환합니다. 각 객체에는 앞서 캡처한 `key` 속성과, 요청한 각 집계에 대한 키가 포함됩니다:

```blade
@foreach ($topSellers as $seller)
    {{ $seller->key }}
    {{ $seller->sum }}
    {{ $seller->count }}
@endforeach
```

Pulse는 주로 미리 집계된 버킷에서 데이터를 조회하므로, 지정한 집계는 반드시 `Pulse::record` 메서드를 사용해 미리 캡처되어야 합니다. 가장 오래된 버킷은 일반적으로 기간의 일부만 포함하므로, Pulse는 전체 기간에 대한 정확한 값을 제공하기 위해 가장 오래된 엔트리를 집계해 갭을 메웁니다. 이로써 각 폴링 요청마다 전체 기간을 집계할 필요가 없습니다.

특정 타입에 대한 전체 값을 조회하려면 `aggregateTotal` 메서드를 사용할 수도 있습니다. 예를 들어, 아래 메서드는 사용자별로 그룹화하지 않고 모든 사용자 판매의 합계를 조회합니다.

```php
$total = $this->aggregateTotal('user_sale', 'sum');
```


#### 사용자 표시 {#custom-card-displaying-users}

키로 사용자 ID를 기록한 집계 데이터를 사용할 때, `Pulse::resolveUsers` 메서드를 사용해 키를 사용자 레코드로 해석할 수 있습니다:

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

`find` 메서드는 `name`, `extra`, `avatar` 키를 포함하는 객체를 반환하며, 이를 `<x-pulse::user-card>` Blade 컴포넌트에 직접 전달할 수 있습니다:

```blade
<x-pulse::user-card :user="{{ $seller->user }}" :stats="{{ $seller->sum }}" />
```


#### 커스텀 레코더 {#custom-recorders}

패키지 작성자는 데이터 캡처 설정을 사용자가 구성할 수 있도록 레코더 클래스를 제공할 수 있습니다.

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

레코더는 `$listen` 속성을 지정해 이벤트를 리스닝할 수 있습니다. Pulse는 리스너를 자동으로 등록하고 레코더의 `record` 메서드를 호출합니다:

```php
<?php

namespace Acme\Recorders;

use Acme\Events\Deployment;
use Illuminate\Support\Facades\Config;
use Laravel\Pulse\Facades\Pulse;

class Deployments
{
    /**
     * 리스닝할 이벤트 목록.
     *
     * @var array<int, class-string>
     */
    public array $listen = [
        Deployment::class,
    ];

    /**
     * 배포 기록.
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
