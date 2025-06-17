# Laravel Telescope


































## 소개 {#introduction}

[Laravel Telescope](https://github.com/laravel/telescope)는 여러분의 로컬 Laravel 개발 환경에 훌륭한 동반자가 되어줍니다. Telescope는 애플리케이션으로 들어오는 요청, 예외, 로그 항목, 데이터베이스 쿼리, 큐 작업, 메일, 알림, 캐시 작업, 예약된 작업, 변수 덤프 등 다양한 정보를 제공합니다.

<img src="https://laravel.com/img/docs/telescope-example.png">


## 설치 {#installation}

Composer 패키지 관리자를 사용하여 Laravel 프로젝트에 Telescope를 설치할 수 있습니다:

```shell
composer require laravel/telescope
```

Telescope를 설치한 후, `telescope:install` Artisan 명령어를 사용하여 자산과 마이그레이션을 게시하세요. Telescope 설치 후에는 Telescope의 데이터를 저장하는 데 필요한 테이블을 생성하기 위해 `migrate` 명령어도 실행해야 합니다:

```shell
php artisan telescope:install

php artisan migrate
```

마지막으로, `/telescope` 경로를 통해 Telescope 대시보드에 접근할 수 있습니다.


### 로컬 전용 설치 {#local-only-installation}

Telescope를 오직 로컬 개발에만 사용할 계획이라면, `--dev` 플래그를 사용하여 Telescope를 설치할 수 있습니다:

```shell
composer require laravel/telescope --dev

php artisan telescope:install

php artisan migrate
```

`telescope:install` 명령을 실행한 후에는, 애플리케이션의 `bootstrap/providers.php` 설정 파일에서 `TelescopeServiceProvider` 서비스 프로바이더 등록을 제거해야 합니다. 대신, `App\Providers\AppServiceProvider` 클래스의 `register` 메서드에서 Telescope의 서비스 프로바이더를 수동으로 등록하세요. 프로바이더를 등록하기 전에 현재 환경이 `local`인지 확인합니다:

```php
/**
 * Register any application services.
 */
public function register(): void
{
    if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
        $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
        $this->app->register(TelescopeServiceProvider::class);
    }
}
```

마지막으로, 아래와 같이 `composer.json` 파일에 추가하여 Telescope 패키지가 [자동 검색](/docs/{{version}}/packages#package-discovery)되지 않도록 해야 합니다:

```json
"extra": {
    "laravel": {
        "dont-discover": [
            "laravel/telescope"
        ]
    }
},
```


### 설정 {#configuration}

Telescope의 에셋을 퍼블리시한 후, 주요 설정 파일은 `config/telescope.php`에 위치하게 됩니다. 이 설정 파일을 통해 [워처 옵션](#available-watchers)을 구성할 수 있습니다. 각 설정 옵션에는 그 목적에 대한 설명이 포함되어 있으니, 이 파일을 꼼꼼히 살펴보시기 바랍니다.

원한다면, `enabled` 설정 옵션을 사용하여 Telescope의 데이터 수집을 완전히 비활성화할 수 있습니다:

```php
'enabled' => env('TELESCOPE_ENABLED', true),
```


### 데이터 정리 {#data-pruning}

정리를 하지 않으면 `telescope_entries` 테이블에 레코드가 매우 빠르게 쌓일 수 있습니다. 이를 방지하기 위해 [스케줄링](/docs/{{version}}/scheduling)을 통해 `telescope:prune` Artisan 명령어를 매일 실행하도록 설정해야 합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('telescope:prune')->daily();
```

기본적으로 24시간이 지난 모든 항목이 정리됩니다. 명령어를 호출할 때 `hours` 옵션을 사용하여 Telescope 데이터를 얼마나 오래 보관할지 지정할 수 있습니다. 예를 들어, 아래 명령어는 48시간이 지난 모든 레코드를 삭제합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('telescope:prune --hours=48')->daily();
```


### 대시보드 권한 부여 {#dashboard-authorization}

Telescope 대시보드는 `/telescope` 경로를 통해 접근할 수 있습니다. 기본적으로, 이 대시보드는 `local` 환경에서만 접근할 수 있습니다. `app/Providers/TelescopeServiceProvider.php` 파일 내에는 [인증 게이트](/docs/{{version}}/authorization#gates) 정의가 있습니다. 이 인증 게이트는 **비로컬** 환경에서 Telescope에 대한 접근을 제어합니다. 필요에 따라 이 게이트를 수정하여 Telescope 설치에 대한 접근을 제한할 수 있습니다:

```php
use App\Models\User;

/**
 * Telescope 게이트를 등록합니다.
 *
 * 이 게이트는 비로컬 환경에서 누가 Telescope에 접근할 수 있는지 결정합니다.
 */
protected function gate(): void
{
    Gate::define('viewTelescope', function (User $user) {
        return in_array($user->email, [
            'taylor@laravel.com',
        ]);
    });
}
```

> [!WARNING]
> 운영 환경에서는 반드시 `APP_ENV` 환경 변수를 `production`으로 변경해야 합니다. 그렇지 않으면 Telescope 설치가 외부에 공개될 수 있습니다.


## Telescope 업그레이드 {#upgrading-telescope}

Telescope의 새로운 메이저 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/telescope/blob/master/UPGRADE.md)를 꼼꼼히 확인하는 것이 중요합니다.

또한, 새로운 Telescope 버전으로 업그레이드할 때마다 Telescope의 에셋을 다시 퍼블리시해야 합니다:

```shell
php artisan telescope:publish
```

에셋을 최신 상태로 유지하고 향후 업데이트 시 문제를 방지하려면, 애플리케이션의 `composer.json` 파일 내 `post-update-cmd` 스크립트에 `vendor:publish --tag=laravel-assets` 명령어를 추가할 수 있습니다:

```json
{
    "scripts": {
        "post-update-cmd": [
            "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
        ]
    }
}
```


## 필터링 {#filtering}


### 엔트리 {#filtering-entries}

Telescope에 기록되는 데이터를 `App\Providers\TelescopeServiceProvider` 클래스에 정의된 `filter` 클로저를 통해 필터링할 수 있습니다. 기본적으로 이 클로저는 `local` 환경에서는 모든 데이터를 기록하며, 그 외의 환경에서는 예외, 실패한 작업, 예약된 작업, 모니터링 태그가 있는 데이터만 기록합니다:

```php
use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->hideSensitiveRequestDetails();

    Telescope::filter(function (IncomingEntry $entry) {
        if ($this->app->environment('local')) {
            return true;
        }

        return $entry->isReportableException() ||
            $entry->isFailedJob() ||
            $entry->isScheduledTask() ||
            $entry->isSlowQuery() ||
            $entry->hasMonitoredTag();
    });
}
```


### 배치 {#filtering-batches}

`filter` 클로저가 개별 항목의 데이터를 필터링하는 반면, `filterBatch` 메서드를 사용하여 주어진 요청 또는 콘솔 명령에 대한 모든 데이터를 필터링하는 클로저를 등록할 수 있습니다. 클로저가 `true`를 반환하면, 해당 요청의 모든 항목이 Telescope에 기록됩니다:

```php
use Illuminate\Support\Collection;
use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->hideSensitiveRequestDetails();

    Telescope::filterBatch(function (Collection $entries) {
        if ($this->app->environment('local')) {
            return true;
        }

        return $entries->contains(function (IncomingEntry $entry) {
            return $entry->isReportableException() ||
                $entry->isFailedJob() ||
                $entry->isScheduledTask() ||
                $entry->isSlowQuery() ||
                $entry->hasMonitoredTag();
            });
    });
}
```


## 태깅 {#tagging}

Telescope는 "태그"를 통해 엔트리를 검색할 수 있습니다. 보통 태그는 Eloquent 모델 클래스 이름이나 인증된 사용자 ID로, Telescope가 엔트리에 자동으로 추가합니다. 때로는 직접 커스텀 태그를 엔트리에 추가하고 싶을 때가 있습니다. 이를 위해 `Telescope::tag` 메서드를 사용할 수 있습니다. `tag` 메서드는 클로저를 인자로 받으며, 이 클로저는 태그 배열을 반환해야 합니다. 클로저에서 반환된 태그는 Telescope가 자동으로 엔트리에 추가하는 태그와 병합됩니다. 일반적으로 `App\Providers\TelescopeServiceProvider` 클래스의 `register` 메서드 내에서 `tag` 메서드를 호출하면 됩니다:

```php
use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->hideSensitiveRequestDetails();

    Telescope::tag(function (IncomingEntry $entry) {
        return $entry->type === 'request'
            ? ['status:'.$entry->content['response_status']]
            : [];
    });
}
```


## 사용 가능한 워처 {#available-watchers}

Telescope의 "워처"는 요청이나 콘솔 명령이 실행될 때 애플리케이션 데이터를 수집합니다. `config/telescope.php` 설정 파일에서 활성화할 워처 목록을 커스터마이즈할 수 있습니다:

```php
'watchers' => [
    Watchers\CacheWatcher::class => true,
    Watchers\CommandWatcher::class => true,
    // ...
],
```

일부 워처는 추가적인 커스터마이즈 옵션을 제공하기도 합니다:

```php
'watchers' => [
    Watchers\QueryWatcher::class => [
        'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
        'slow' => 100,
    ],
    // ...
],
```


### 배치 워처 {#batch-watcher}

배치 워처는 큐에 등록된 [배치](/docs/{{version}}/queues#job-batching)에 대한 정보와 작업 및 연결 정보를 기록합니다.


### 캐시 워처 {#cache-watcher}

캐시 워처는 캐시 키가 히트(hit), 미스(miss), 업데이트, 삭제(forgotten)될 때 데이터를 기록합니다.


### 커맨드 워처 {#command-watcher}

커맨드 워처는 아티즌(Artisan) 커맨드가 실행될 때마다 인자, 옵션, 종료 코드, 출력을 기록합니다. 특정 커맨드가 워처에 의해 기록되지 않도록 제외하고 싶다면, `config/telescope.php` 파일의 `ignore` 옵션에 해당 커맨드를 지정할 수 있습니다:

```php
'watchers' => [
    Watchers\CommandWatcher::class => [
        'enabled' => env('TELESCOPE_COMMAND_WATCHER', true),
        'ignore' => ['key:generate'],
    ],
    // ...
],
```


### Dump Watcher {#dump-watcher}

Dump Watcher는 Telescope에서 변수 덤프를 기록하고 표시합니다. Laravel을 사용할 때는 전역 `dump` 함수를 사용하여 변수를 덤프할 수 있습니다. 덤프가 기록되려면 브라우저에서 dump watcher 탭이 열려 있어야 하며, 그렇지 않으면 watcher가 덤프를 무시합니다.


### 이벤트 워처 {#event-watcher}

이벤트 워처는 애플리케이션에서 디스패치된 [이벤트](/docs/{{version}}/events)의 페이로드, 리스너, 브로드캐스트 데이터를 기록합니다. Laravel 프레임워크의 내부 이벤트는 이벤트 워처에 의해 무시됩니다.


### 예외 감시자 {#exception-watcher}

예외 감시자는 애플리케이션에서 발생하는 보고 가능한 예외의 데이터와 스택 트레이스를 기록합니다.


### 게이트 워처 {#gate-watcher}

게이트 워처는 애플리케이션에서 [게이트와 정책](/docs/{{version}}/authorization) 검사의 데이터와 결과를 기록합니다. 특정 권한을 워처에서 기록하지 않으려면, `config/telescope.php` 파일의 `ignore_abilities` 옵션에 해당 권한을 지정할 수 있습니다:

```php
'watchers' => [
    Watchers\GateWatcher::class => [
        'enabled' => env('TELESCOPE_GATE_WATCHER', true),
        'ignore_abilities' => ['viewNova'],
    ],
    // ...
],
```


### HTTP 클라이언트 워처 {#http-client-watcher}

HTTP 클라이언트 워처는 애플리케이션에서 발생하는 [HTTP 클라이언트 요청](/docs/{{version}}/http-client)을 기록합니다.


### 작업 감시자 {#job-watcher}

작업 감시자는 애플리케이션에서 디스패치된 [작업](/docs/{{version}}/queues)의 데이터와 상태를 기록합니다.


### 로그 워처 {#log-watcher}

로그 워처는 애플리케이션에서 작성된 [로그 데이터](/docs/{{version}}/logging)를 기록합니다.

기본적으로 Telescope는 `error` 레벨 이상의 로그만 기록합니다. 하지만, 애플리케이션의 `config/telescope.php` 설정 파일에서 `level` 옵션을 수정하여 이 동작을 변경할 수 있습니다:

```php
'watchers' => [
    Watchers\LogWatcher::class => [
        'enabled' => env('TELESCOPE_LOG_WATCHER', true),
        'level' => 'debug',
    ],

    // ...
],
```


### 메일 워처 {#mail-watcher}

메일 워처를 사용하면 애플리케이션에서 전송된 [이메일](/docs/{{version}}/mail)의 브라우저 내 미리보기를 관련 데이터와 함께 확인할 수 있습니다. 또한 이메일을 `.eml` 파일로 다운로드할 수도 있습니다.


### 모델 워처 {#model-watcher}

모델 워처는 Eloquent [모델 이벤트](/docs/{{version}}/eloquent#events)가 디스패치될 때마다 모델의 변경 사항을 기록합니다. 워처의 `events` 옵션을 통해 어떤 모델 이벤트를 기록할지 지정할 수 있습니다:

```php
'watchers' => [
    Watchers\ModelWatcher::class => [
        'enabled' => env('TELESCOPE_MODEL_WATCHER', true),
        'events' => ['eloquent.created*', 'eloquent.updated*'],
    ],
    // ...
],
```

특정 요청 중에 하이드레이션된 모델의 개수를 기록하고 싶다면, `hydrations` 옵션을 활성화하세요:

```php
'watchers' => [
    Watchers\ModelWatcher::class => [
        'enabled' => env('TELESCOPE_MODEL_WATCHER', true),
        'events' => ['eloquent.created*', 'eloquent.updated*'],
        'hydrations' => true,
    ],
    // ...
],
```


### 알림 감시자 {#notification-watcher}

알림 감시자는 애플리케이션에서 전송된 모든 [알림](/docs/{{version}}/notifications)을 기록합니다. 만약 알림이 이메일을 트리거하고 메일 감시자가 활성화되어 있다면, 해당 이메일도 메일 감시자 화면에서 미리 볼 수 있습니다.


### 쿼리 워처 {#query-watcher}

쿼리 워처는 애플리케이션에서 실행되는 모든 쿼리에 대해 원시 SQL, 바인딩, 실행 시간을 기록합니다. 또한 100밀리초보다 느린 쿼리에는 `slow` 태그를 추가합니다. 워처의 `slow` 옵션을 사용하여 느린 쿼리 임계값을 커스터마이즈할 수 있습니다:

```php
'watchers' => [
    Watchers\QueryWatcher::class => [
        'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
        'slow' => 50,
    ],
    // ...
],
```


### Redis 감시자 {#redis-watcher}

Redis 감시자는 애플리케이션에서 실행된 모든 [Redis](/docs/{{version}}/redis) 명령어를 기록합니다. Redis를 캐싱에 사용하고 있다면, 캐시 명령어 또한 Redis 감시자에 의해 기록됩니다.


### 요청 감시자 {#request-watcher}

요청 감시자는 애플리케이션에서 처리된 모든 요청과 관련된 요청, 헤더, 세션, 응답 데이터를 기록합니다. `size_limit`(킬로바이트 단위) 옵션을 통해 기록되는 응답 데이터의 크기를 제한할 수 있습니다:

```php
'watchers' => [
    Watchers\RequestWatcher::class => [
        'enabled' => env('TELESCOPE_REQUEST_WATCHER', true),
        'size_limit' => env('TELESCOPE_RESPONSE_SIZE_LIMIT', 64),
    ],
    // ...
],
```


### 스케줄 감시자 {#schedule-watcher}

스케줄 감시자는 애플리케이션에서 실행되는 [스케줄된 작업](/docs/{{version}}/scheduling)의 명령어와 출력을 기록합니다.


### 뷰 워처 {#view-watcher}

뷰 워처는 뷰를 렌더링할 때 사용된 [뷰](/docs/{{version}}/views) 이름, 경로, 데이터, 그리고 "컴포저"를 기록합니다.


## 사용자 아바타 표시 {#displaying-user-avatars}

Telescope 대시보드는 각 항목이 저장될 때 인증된 사용자의 아바타를 표시합니다. 기본적으로 Telescope는 Gravatar 웹 서비스를 사용하여 아바타를 가져옵니다. 그러나 `App\Providers\TelescopeServiceProvider` 클래스에서 콜백을 등록하여 아바타 URL을 커스터마이즈할 수 있습니다. 이 콜백은 사용자의 ID와 이메일 주소를 인자로 받아 사용자의 아바타 이미지 URL을 반환해야 합니다:

```php
use App\Models\User;
use Laravel\Telescope\Telescope;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    // ...

    Telescope::avatar(function (?string $id, ?string $email) {
        return ! is_null($id)
            ? '/avatars/'.User::find($id)->avatar_path
            : '/generic-avatar.jpg';
    });
}
```
