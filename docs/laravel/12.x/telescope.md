# Laravel Telescope


































## 소개 {#introduction}

[Laravel Telescope](https://github.com/laravel/telescope)는 로컬 Laravel 개발 환경에 훌륭한 동반자가 되어줍니다. Telescope는 애플리케이션에 들어오는 요청, 예외, 로그 엔트리, 데이터베이스 쿼리, 큐 작업, 메일, 알림, 캐시 작업, 예약된 작업, 변수 덤프 등 다양한 정보를 제공합니다.

<img src="https://laravel.com/img/docs/telescope-example.png">


## 설치 {#installation}

Composer 패키지 관리자를 사용하여 Laravel 프로젝트에 Telescope를 설치할 수 있습니다:

```shell
composer require laravel/telescope
```

Telescope를 설치한 후, `telescope:install` Artisan 명령어를 사용하여 에셋과 마이그레이션을 퍼블리시하세요. 설치가 완료되면, Telescope의 데이터를 저장할 테이블을 생성하기 위해 `migrate` 명령어도 실행해야 합니다:

```shell
php artisan telescope:install

php artisan migrate
```

마지막으로, `/telescope` 경로를 통해 Telescope 대시보드에 접근할 수 있습니다.


### 로컬 전용 설치 {#local-only-installation}

Telescope를 로컬 개발 지원 용도로만 사용할 계획이라면, `--dev` 플래그를 사용하여 설치할 수 있습니다:

```shell
composer require laravel/telescope --dev

php artisan telescope:install

php artisan migrate
```

`telescope:install`을 실행한 후에는, 애플리케이션의 `bootstrap/providers.php` 설정 파일에서 `TelescopeServiceProvider` 서비스 프로바이더 등록을 제거해야 합니다. 대신, `App\Providers\AppServiceProvider` 클래스의 `register` 메서드에서 Telescope의 서비스 프로바이더를 수동으로 등록하세요. 현재 환경이 `local`인지 확인한 후 프로바이더를 등록합니다:

```php
/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
        $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
        $this->app->register(TelescopeServiceProvider::class);
    }
}
```

마지막으로, 아래와 같이 `composer.json` 파일에 추가하여 Telescope 패키지가 [자동 디스커버리](/laravel/12.x/packages#package-discovery)되지 않도록 해야 합니다:

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

정리를 하지 않으면, `telescope_entries` 테이블에 레코드가 매우 빠르게 쌓일 수 있습니다. 이를 방지하기 위해, [스케줄러](/laravel/12.x/scheduling)를 사용하여 `telescope:prune` Artisan 명령어를 매일 실행하도록 해야 합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('telescope:prune')->daily();
```

기본적으로 24시간이 지난 모든 엔트리가 정리됩니다. 명령어를 호출할 때 `hours` 옵션을 사용하여 Telescope 데이터를 얼마나 오래 보관할지 지정할 수 있습니다. 예를 들어, 아래 명령어는 48시간이 지난 모든 레코드를 삭제합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('telescope:prune --hours=48')->daily();
```


### 대시보드 권한 부여 {#dashboard-authorization}

Telescope 대시보드는 `/telescope` 경로를 통해 접근할 수 있습니다. 기본적으로, 이 대시보드는 `local` 환경에서만 접근할 수 있습니다. `app/Providers/TelescopeServiceProvider.php` 파일 내에는 [권한 게이트](/laravel/12.x/authorization#gates) 정의가 있습니다. 이 권한 게이트는 **로컬이 아닌** 환경에서 Telescope 접근을 제어합니다. 필요에 따라 이 게이트를 수정하여 Telescope 설치에 대한 접근을 제한할 수 있습니다:

```php
use App\Models\User;

/**
 * Telescope 게이트를 등록합니다.
 *
 * 이 게이트는 로컬이 아닌 환경에서 누가 Telescope에 접근할 수 있는지 결정합니다.
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
> 운영 환경에서는 반드시 `APP_ENV` 환경 변수를 `production`으로 변경해야 합니다. 그렇지 않으면 Telescope 설치가 공개적으로 노출될 수 있습니다.


## Telescope 업그레이드 {#upgrading-telescope}

Telescope의 새로운 주요 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/telescope/blob/master/UPGRADE.md)를 꼼꼼히 확인하는 것이 중요합니다.

또한, Telescope의 새 버전으로 업그레이드할 때마다 Telescope의 에셋을 다시 퍼블리시해야 합니다:

```shell
php artisan telescope:publish
```

에셋을 최신 상태로 유지하고 향후 업데이트 시 문제를 방지하려면, 애플리케이션의 `composer.json` 파일의 `post-update-cmd` 스크립트에 `vendor:publish --tag=laravel-assets` 명령어를 추가할 수 있습니다:

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

Telescope에 기록되는 데이터를 `App\Providers\TelescopeServiceProvider` 클래스에 정의된 `filter` 클로저를 통해 필터링할 수 있습니다. 기본적으로 이 클로저는 `local` 환경에서는 모든 데이터를 기록하고, 그 외 환경에서는 예외, 실패한 작업, 예약된 작업, 모니터링된 태그가 있는 데이터만 기록합니다:

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

`filter` 클로저가 개별 엔트리에 대한 데이터를 필터링하는 반면, `filterBatch` 메서드를 사용하여 주어진 요청 또는 콘솔 명령에 대한 모든 데이터를 필터링하는 클로저를 등록할 수 있습니다. 클로저가 `true`를 반환하면, 모든 엔트리가 Telescope에 기록됩니다:

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

Telescope는 "태그"로 엔트리를 검색할 수 있도록 해줍니다. 종종 태그는 Eloquent 모델 클래스명이나 인증된 사용자 ID로, Telescope가 자동으로 엔트리에 추가합니다. 때때로, 직접 커스텀 태그를 엔트리에 추가하고 싶을 수 있습니다. 이를 위해 `Telescope::tag` 메서드를 사용할 수 있습니다. `tag` 메서드는 태그 배열을 반환하는 클로저를 받습니다. 클로저가 반환한 태그는 Telescope가 자동으로 엔트리에 추가하는 태그와 병합됩니다. 일반적으로 `App\Providers\TelescopeServiceProvider` 클래스의 `register` 메서드 내에서 `tag` 메서드를 호출해야 합니다:

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

일부 워처는 추가 커스터마이즈 옵션도 제공합니다:

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

배치 워처는 큐에 등록된 [배치](/laravel/12.x/queues#job-batching)에 대한 정보(작업 및 연결 정보 포함)를 기록합니다.


### 캐시 워처 {#cache-watcher}

캐시 워처는 캐시 키가 히트, 미스, 업데이트, 삭제될 때 데이터를 기록합니다.


### 커맨드 워처 {#command-watcher}

커맨드 워처는 Artisan 명령이 실행될 때 인자, 옵션, 종료 코드, 출력을 기록합니다. 특정 명령이 워처에 의해 기록되지 않도록 하려면, `config/telescope.php` 파일의 `ignore` 옵션에 명령을 지정할 수 있습니다:

```php
'watchers' => [
    Watchers\CommandWatcher::class => [
        'enabled' => env('TELESCOPE_COMMAND_WATCHER', true),
        'ignore' => ['key:generate'],
    ],
    // ...
],
```


### 덤프 워처 {#dump-watcher}

덤프 워처는 변수 덤프를 기록하고 Telescope에서 표시합니다. Laravel을 사용할 때는 전역 `dump` 함수를 사용하여 변수를 덤프할 수 있습니다. 덤프 워처 탭이 브라우저에서 열려 있어야 덤프가 기록되며, 그렇지 않으면 덤프는 워처에 의해 무시됩니다.


### 이벤트 워처 {#event-watcher}

이벤트 워처는 애플리케이션에서 디스패치된 [이벤트](/laravel/12.x/events)의 페이로드, 리스너, 브로드캐스트 데이터를 기록합니다. Laravel 프레임워크의 내부 이벤트는 이벤트 워처에서 무시됩니다.


### 예외 워처 {#exception-watcher}

예외 워처는 애플리케이션에서 발생한 보고 가능한 예외의 데이터와 스택 트레이스를 기록합니다.


### 게이트 워처 {#gate-watcher}

게이트 워처는 애플리케이션의 [게이트 및 정책](/laravel/12.x/authorization) 검사에 대한 데이터와 결과를 기록합니다. 특정 권한이 워처에 의해 기록되지 않도록 하려면, `config/telescope.php` 파일의 `ignore_abilities` 옵션에 해당 권한을 지정할 수 있습니다:

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

HTTP 클라이언트 워처는 애플리케이션에서 발생한 [HTTP 클라이언트 요청](/laravel/12.x/http-client)을 기록합니다.


### 잡 워처 {#job-watcher}

잡 워처는 애플리케이션에서 디스패치된 [잡](/laravel/12.x/queues)의 데이터와 상태를 기록합니다.


### 로그 워처 {#log-watcher}

로그 워처는 애플리케이션에서 작성된 [로그 데이터](/laravel/12.x/logging)를 기록합니다.

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

메일 워처를 사용하면 애플리케이션에서 전송된 [이메일](/laravel/12.x/mail)의 브라우저 미리보기와 관련 데이터를 볼 수 있습니다. 또한 이메일을 `.eml` 파일로 다운로드할 수도 있습니다.


### 모델 워처 {#model-watcher}

모델 워처는 Eloquent [모델 이벤트](/laravel/12.x/eloquent#events)가 디스패치될 때마다 모델 변경 사항을 기록합니다. 워처의 `events` 옵션을 통해 어떤 모델 이벤트를 기록할지 지정할 수 있습니다:

```php
'watchers' => [
    Watchers\ModelWatcher::class => [
        'enabled' => env('TELESCOPE_MODEL_WATCHER', true),
        'events' => ['eloquent.created*', 'eloquent.updated*'],
    ],
    // ...
],
```

특정 요청 동안 하이드레이트된 모델의 수를 기록하고 싶다면, `hydrations` 옵션을 활성화하세요:

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


### 알림 워처 {#notification-watcher}

알림 워처는 애플리케이션에서 전송된 모든 [알림](/laravel/12.x/notifications)을 기록합니다. 알림이 이메일을 트리거하고 메일 워처가 활성화되어 있다면, 해당 이메일도 메일 워처 화면에서 미리보기로 확인할 수 있습니다.


### 쿼리 워처 {#query-watcher}

쿼리 워처는 애플리케이션에서 실행된 모든 쿼리의 원시 SQL, 바인딩, 실행 시간을 기록합니다. 워처는 100밀리초보다 느린 쿼리에 `slow` 태그를 자동으로 추가합니다. 워처의 `slow` 옵션을 사용하여 느린 쿼리 임계값을 커스터마이즈할 수 있습니다:

```php
'watchers' => [
    Watchers\QueryWatcher::class => [
        'enabled' => env('TELESCOPE_QUERY_WATCHER', true),
        'slow' => 50,
    ],
    // ...
],
```


### Redis 워처 {#redis-watcher}

Redis 워처는 애플리케이션에서 실행된 모든 [Redis](/laravel/12.x/redis) 명령을 기록합니다. Redis를 캐시로 사용할 경우, 캐시 명령도 Redis 워처에 의해 기록됩니다.


### 요청 워처 {#request-watcher}

요청 워처는 애플리케이션이 처리한 요청, 헤더, 세션, 응답 데이터를 기록합니다. `size_limit`(킬로바이트 단위) 옵션을 통해 기록되는 응답 데이터의 크기를 제한할 수 있습니다:

```php
'watchers' => [
    Watchers\RequestWatcher::class => [
        'enabled' => env('TELESCOPE_REQUEST_WATCHER', true),
        'size_limit' => env('TELESCOPE_RESPONSE_SIZE_LIMIT', 64),
    ],
    // ...
],
```


### 스케줄 워처 {#schedule-watcher}

스케줄 워처는 애플리케이션에서 실행된 [예약된 작업](/laravel/12.x/scheduling)의 명령과 출력을 기록합니다.


### 뷰 워처 {#view-watcher}

뷰 워처는 [뷰](/laravel/12.x/views) 이름, 경로, 데이터, 뷰 렌더링 시 사용된 "컴포저"를 기록합니다.


## 사용자 아바타 표시 {#displaying-user-avatars}

Telescope 대시보드는 특정 엔트리가 저장될 때 인증된 사용자의 아바타를 표시합니다. 기본적으로 Telescope는 Gravatar 웹 서비스를 사용하여 아바타를 가져옵니다. 하지만, `App\Providers\TelescopeServiceProvider` 클래스에서 콜백을 등록하여 아바타 URL을 커스터마이즈할 수 있습니다. 콜백은 사용자의 ID와 이메일 주소를 받아 사용자 아바타 이미지의 URL을 반환해야 합니다:

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
