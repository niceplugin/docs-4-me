# [패키지] Laravel Horizon

















## 소개 {#introduction}

> [!NOTE]
> Laravel Horizon을 살펴보기 전에, Laravel의 기본 [큐 서비스](/laravel/12.x/queues)에 익숙해지는 것이 좋습니다. Horizon은 Laravel의 큐에 추가 기능을 제공하므로, Laravel이 제공하는 기본 큐 기능에 익숙하지 않다면 혼란스러울 수 있습니다.

[Laravel Horizon](https://github.com/laravel/horizon)은 Laravel 기반의 [Redis 큐](/laravel/12.x/queues)를 위한 아름다운 대시보드와 코드 기반 설정을 제공합니다. Horizon을 사용하면 작업 처리량, 실행 시간, 작업 실패와 같은 큐 시스템의 주요 지표를 쉽게 모니터링할 수 있습니다.

Horizon을 사용할 때 모든 큐 워커 설정은 하나의 간단한 설정 파일에 저장됩니다. 애플리케이션의 워커 구성을 버전 관리되는 파일에 정의함으로써, 애플리케이션을 배포할 때 큐 워커를 손쉽게 확장하거나 수정할 수 있습니다.

<img src="https://laravel.com/img/docs/horizon-example.png">


## 설치 {#installation}

> [!WARNING]
> Laravel Horizon은 큐를 구동하기 위해 [Redis](https://redis.io)를 사용해야 합니다. 따라서, 애플리케이션의 `config/queue.php` 설정 파일에서 큐 연결이 `redis`로 설정되어 있는지 확인해야 합니다.

Composer 패키지 관리자를 사용하여 Horizon을 프로젝트에 설치할 수 있습니다:

```shell
composer require laravel/horizon
```

Horizon을 설치한 후, `horizon:install` Artisan 명령어를 사용하여 에셋을 퍼블리시하세요:

```shell
php artisan horizon:install
```


### 설정 {#configuration}

Horizon의 에셋을 퍼블리시한 후, 주요 설정 파일은 `config/horizon.php`에 위치하게 됩니다. 이 설정 파일을 통해 애플리케이션의 큐 워커 옵션을 구성할 수 있습니다. 각 설정 옵션에는 그 목적에 대한 설명이 포함되어 있으니, 이 파일을 꼼꼼히 살펴보시기 바랍니다.

> [!WARNING]
> Horizon은 내부적으로 `horizon`이라는 이름의 Redis 연결을 사용합니다. 이 Redis 연결 이름은 예약되어 있으므로, `database.php` 설정 파일에서 다른 Redis 연결에 할당하거나 `horizon.php` 설정 파일의 `use` 옵션 값으로 지정해서는 안 됩니다.


#### 환경 {#environments}

설치 후, 가장 먼저 익숙해져야 할 Horizon의 주요 설정 옵션은 `environments` 설정 옵션입니다. 이 설정 옵션은 애플리케이션이 실행되는 환경들의 배열이며, 각 환경에 대한 워커 프로세스 옵션을 정의합니다. 기본적으로 이 항목에는 `production`과 `local` 환경이 포함되어 있습니다. 하지만 필요에 따라 더 많은 환경을 자유롭게 추가할 수 있습니다:

```php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'maxProcesses' => 10,
            'balanceMaxShift' => 1,
            'balanceCooldown' => 3,
        ],
    ],

    'local' => [
        'supervisor-1' => [
            'maxProcesses' => 3,
        ],
    ],
],
```

또한, 일치하는 환경이 없을 때 사용되는 와일드카드 환경(`*`)을 정의할 수도 있습니다:

```php
'environments' => [
    // ...

    '*' => [
        'supervisor-1' => [
            'maxProcesses' => 3,
        ],
    ],
],
```

Horizon을 시작하면, 애플리케이션이 실행 중인 환경에 맞는 워커 프로세스 설정 옵션을 사용하게 됩니다. 일반적으로 환경은 `APP_ENV` [환경 변수](/laravel/12.x/configuration#determining-the-current-environment)의 값에 의해 결정됩니다. 예를 들어, 기본 `local` Horizon 환경은 세 개의 워커 프로세스를 시작하고, 각 큐에 할당된 워커 프로세스 수를 자동으로 조절하도록 설정되어 있습니다. 기본 `production` 환경은 최대 10개의 워커 프로세스를 시작하고, 각 큐에 할당된 워커 프로세스 수를 자동으로 조절하도록 설정되어 있습니다.

> [!WARNING]
> `horizon` 설정 파일의 `environments` 부분에 Horizon을 실행할 계획인 각 [환경](/laravel/12.x/configuration#environment-configuration)에 대한 항목이 포함되어 있는지 반드시 확인해야 합니다.


#### 슈퍼바이저 {#supervisors}

Horizon의 기본 설정 파일에서 볼 수 있듯이, 각 환경에는 하나 이상의 "슈퍼바이저"를 포함할 수 있습니다. 기본적으로 설정 파일은 이 슈퍼바이저를 `supervisor-1`로 정의하지만, 슈퍼바이저의 이름은 자유롭게 지정할 수 있습니다. 각 슈퍼바이저는 본질적으로 워커 프로세스 그룹을 "감독"하는 역할을 하며, 큐 전반에 걸쳐 워커 프로세스를 균형 있게 분배하는 일을 담당합니다.

특정 환경에서 실행되어야 하는 새로운 워커 프로세스 그룹을 정의하고 싶다면, 해당 환경에 추가 슈퍼바이저를 추가할 수 있습니다. 애플리케이션에서 사용하는 특정 큐에 대해 다른 균형 전략이나 워커 프로세스 수를 정의하고 싶을 때 이렇게 할 수 있습니다.


#### 유지 관리 모드 {#maintenance-mode}

애플리케이션이 [유지 관리 모드](/laravel/12.x/configuration#maintenance-mode)일 때, Horizon은 Horizon 설정 파일 내에서 supervisor의 `force` 옵션이 `true`로 정의되지 않는 한 대기 중인 작업을 처리하지 않습니다:

```php
'environments' => [
    'production' => [
        'supervisor-1' => [
            // ...
            'force' => true,
        ],
    ],
],
```


#### 기본값 {#default-values}

Horizon의 기본 설정 파일에는 `defaults` 설정 옵션이 있습니다. 이 설정 옵션은 애플리케이션의 [supervisors](#supervisors)에 대한 기본값을 지정합니다. supervisor의 기본 설정 값은 각 환경의 supervisor 설정에 병합되어, supervisor를 정의할 때 불필요한 반복을 피할 수 있습니다.


### 밸런싱 전략 {#balancing-strategies}

Laravel의 기본 큐 시스템과 달리, Horizon은 세 가지 워커 밸런싱 전략인 `simple`, `auto`, `false` 중에서 선택할 수 있습니다. `simple` 전략은 들어오는 작업을 워커 프로세스 간에 고르게 분배합니다:

    'balance' => 'simple',

설정 파일의 기본값인 `auto` 전략은 큐의 현재 작업량에 따라 큐별 워커 프로세스 수를 조정합니다. 예를 들어, `notifications` 큐에 1,000개의 대기 중인 작업이 있고 `render` 큐가 비어 있다면, Horizon은 `notifications` 큐가 비워질 때까지 더 많은 워커를 할당합니다.

`auto` 전략을 사용할 때는 `minProcesses`와 `maxProcesses` 설정 옵션을 정의하여 큐별 최소 프로세스 수와 Horizon이 확장 및 축소할 수 있는 전체 워커 프로세스의 최대 수를 제어할 수 있습니다:

```php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default'],
            'balance' => 'auto',
            'autoScalingStrategy' => 'time',
            'minProcesses' => 1,
            'maxProcesses' => 10,
            'balanceMaxShift' => 1,
            'balanceCooldown' => 3,
            'tries' => 3,
        ],
    ],
],
```

`autoScalingStrategy` 설정 값은 Horizon이 큐를 비우는 데 걸리는 전체 시간(`time` 전략) 또는 큐에 있는 전체 작업 수(`size` 전략)를 기준으로 더 많은 워커 프로세스를 큐에 할당할지 결정합니다.

`balanceMaxShift`와 `balanceCooldown` 설정 값은 Horizon이 워커 수요를 충족하기 위해 얼마나 빠르게 확장 또는 축소할지 결정합니다. 위 예시에서는 최대 1개의 새 프로세스가 3초마다 생성되거나 제거됩니다. 애플리케이션의 필요에 따라 이 값들은 자유롭게 조정할 수 있습니다.

`balance` 옵션이 `false`로 설정되면, 설정 파일에 나열된 순서대로 큐가 처리되는 기본 Laravel 동작이 사용됩니다.


### 대시보드 권한 부여 {#dashboard-authorization}

Horizon 대시보드는 `/horizon` 경로를 통해 접근할 수 있습니다. 기본적으로 이 대시보드는 `local` 환경에서만 접근할 수 있습니다. 하지만, `app/Providers/HorizonServiceProvider.php` 파일 내에는 [권한 게이트](/laravel/12.x/authorization#gates) 정의가 있습니다. 이 권한 게이트는 **비로컬** 환경에서 Horizon에 대한 접근을 제어합니다. 필요에 따라 이 게이트를 수정하여 Horizon 설치에 대한 접근을 제한할 수 있습니다:

```php
/**
 * Horizon 게이트를 등록합니다.
 *
 * 이 게이트는 비로컬 환경에서 누가 Horizon에 접근할 수 있는지 결정합니다.
 */
protected function gate(): void
{
    Gate::define('viewHorizon', function (User $user) {
        return in_array($user->email, [
            'taylor@laravel.com',
        ]);
    });
}
```


#### 대체 인증 전략 {#alternative-authentication-strategies}

라라벨은 게이트 클로저에 인증된 사용자를 자동으로 주입한다는 점을 기억하세요. 만약 애플리케이션이 IP 제한과 같은 다른 방법으로 Horizon 보안을 제공한다면, Horizon 사용자들은 "로그인"할 필요가 없을 수 있습니다. 따라서 위의 `function (User $user)` 클로저 시그니처를 `function (User $user = null)`로 변경하여 라라벨이 인증을 요구하지 않도록 해야 합니다.


### 무음 처리된 작업 {#silenced-jobs}

때때로, 애플리케이션이나 서드파티 패키지에서 디스패치된 특정 작업을 보고 싶지 않을 수 있습니다. 이러한 작업이 "완료된 작업" 목록에 공간을 차지하는 대신, 무음 처리할 수 있습니다. 시작하려면, 애플리케이션의 `horizon` 설정 파일의 `silenced` 설정 옵션에 작업의 클래스 이름을 추가하세요:

```php
'silenced' => [
    App\Jobs\ProcessPodcast::class,
],
```

또는, 무음 처리하고자 하는 작업이 `Laravel\Horizon\Contracts\Silenced` 인터페이스를 구현할 수도 있습니다. 만약 작업이 이 인터페이스를 구현한다면, `silenced` 설정 배열에 없어도 자동으로 무음 처리됩니다:

```php
use Laravel\Horizon\Contracts\Silenced;

class ProcessPodcast implements ShouldQueue, Silenced
{
    use Queueable;

    // ...
}
```


## Horizon 업그레이드 {#upgrading-horizon}

Horizon의 새로운 주요 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/horizon/blob/master/UPGRADE.md)를 꼼꼼히 확인하는 것이 중요합니다.


## Horizon 실행하기 {#running-horizon}

애플리케이션의 `config/horizon.php` 설정 파일에서 슈퍼바이저와 워커를 구성한 후, `horizon` 아티즌 명령어를 사용하여 Horizon을 시작할 수 있습니다. 이 단일 명령어는 현재 환경에 대해 구성된 모든 워커 프로세스를 시작합니다:

```shell
php artisan horizon
```

`horizon:pause` 및 `horizon:continue` 아티즌 명령어를 사용하여 Horizon 프로세스를 일시 중지하거나 작업 처리를 계속하도록 지시할 수 있습니다:

```shell
php artisan horizon:pause

php artisan horizon:continue
```

또한, `horizon:pause-supervisor` 및 `horizon:continue-supervisor` 아티즌 명령어를 사용하여 특정 Horizon [슈퍼바이저](#supervisors)를 일시 중지하거나 계속할 수 있습니다:

```shell
php artisan horizon:pause-supervisor supervisor-1

php artisan horizon:continue-supervisor supervisor-1
```

`horizon:status` 아티즌 명령어를 사용하여 Horizon 프로세스의 현재 상태를 확인할 수 있습니다:

```shell
php artisan horizon:status
```

`horizon:supervisor-status` 아티즌 명령어를 사용하여 특정 Horizon [슈퍼바이저](#supervisors)의 현재 상태를 확인할 수 있습니다:

```shell
php artisan horizon:supervisor-status supervisor-1
```

`horizon:terminate` 아티즌 명령어를 사용하여 Horizon 프로세스를 정상적으로 종료할 수 있습니다. 현재 처리 중인 작업은 완료된 후 Horizon이 실행을 중지합니다:

```shell
php artisan horizon:terminate
```


### Horizon 배포하기 {#deploying-horizon}

애플리케이션을 실제 서버에 Horizon과 함께 배포할 준비가 되었다면, `php artisan horizon` 명령어를 모니터링하고 예기치 않게 종료될 경우 재시작하는 프로세스 모니터를 설정해야 합니다. 걱정하지 마세요. 아래에서 프로세스 모니터를 설치하는 방법에 대해 설명하겠습니다.

애플리케이션의 배포 과정 중에는 Horizon 프로세스를 종료하도록 지시해야 하며, 이렇게 하면 프로세스 모니터가 Horizon을 재시작하고 코드 변경 사항을 반영할 수 있습니다:

```shell
php artisan horizon:terminate
```


#### Supervisor 설치 {#installing-supervisor}

Supervisor는 Linux 운영 체제를 위한 프로세스 모니터로, `horizon` 프로세스가 실행을 멈추면 자동으로 재시작해줍니다. Ubuntu에서 Supervisor를 설치하려면 다음 명령어를 사용할 수 있습니다. Ubuntu를 사용하지 않는 경우, 운영 체제의 패키지 관리자를 통해 Supervisor를 설치할 수 있습니다:

```shell
sudo apt-get install supervisor
```

> [!NOTE]
> Supervisor 설정이 부담스럽게 느껴진다면, [Laravel Cloud](https://cloud.laravel.com)를 사용하는 것을 고려해보세요. Laravel Cloud는 Laravel 애플리케이션의 백그라운드 프로세스를 관리해줍니다.


#### Supervisor 구성 {#supervisor-configuration}

Supervisor 구성 파일은 일반적으로 서버의 `/etc/supervisor/conf.d` 디렉터리에 저장됩니다. 이 디렉터리 내에서 Supervisor가 프로세스를 어떻게 모니터링할지 지시하는 구성 파일을 원하는 만큼 생성할 수 있습니다. 예를 들어, `horizon` 프로세스를 시작하고 모니터링하는 `horizon.conf` 파일을 만들어 보겠습니다:

```ini
[program:horizon]
process_name=%(program_name)s
command=php /home/forge/example.com/artisan horizon
autostart=true
autorestart=true
user=forge
redirect_stderr=true
stdout_logfile=/home/forge/example.com/horizon.log
stopwaitsecs=3600
```

Supervisor 구성을 정의할 때, `stopwaitsecs` 값이 가장 오래 실행되는 작업에 소요되는 초보다 커야 합니다. 그렇지 않으면 Supervisor가 작업이 끝나기 전에 강제로 종료시킬 수 있습니다.

> [!WARNING]
> 위 예제는 Ubuntu 기반 서버에 유효하지만, Supervisor 구성 파일의 위치와 파일 확장자는 다른 서버 운영체제마다 다를 수 있습니다. 자세한 내용은 서버의 문서를 참고하세요.


#### Supervisor 시작하기 {#starting-supervisor}

구성 파일을 생성한 후에는 다음 명령어를 사용하여 Supervisor 구성을 업데이트하고 모니터링할 프로세스를 시작할 수 있습니다:

```shell
sudo supervisorctl reread

sudo supervisorctl update

sudo supervisorctl start horizon
```

> [!NOTE]
> Supervisor 실행에 대한 자세한 내용은 [Supervisor 문서](http://supervisord.org/index.html)를 참고하세요.


## 태그 {#tags}

Horizon은 메일러블, 브로드캐스트 이벤트, 알림, 큐에 등록된 이벤트 리스너를 포함한 작업에 “태그”를 지정할 수 있도록 해줍니다. 실제로 Horizon은 작업에 연결된 Eloquent 모델에 따라 대부분의 작업에 대해 지능적으로 자동으로 태그를 지정합니다. 예를 들어, 다음 작업을 살펴보세요:

```php
<?php

namespace App\Jobs;

use App\Models\Video;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RenderVideo implements ShouldQueue
{
    use Queueable;

    /**
     * 새로운 작업 인스턴스를 생성합니다.
     */
    public function __construct(
        public Video $video,
    ) {}

    /**
     * 작업을 실행합니다.
     */
    public function handle(): void
    {
        // ...
    }
}
```

이 작업이 `id` 속성이 `1`인 `App\Models\Video` 인스턴스와 함께 큐에 등록된다면, 자동으로 `App\Models\Video:1` 태그를 받게 됩니다. 이는 Horizon이 작업의 속성에서 Eloquent 모델을 검색하기 때문입니다. Eloquent 모델이 발견되면, Horizon은 모델의 클래스명과 기본 키를 사용하여 지능적으로 작업에 태그를 지정합니다:

```php
use App\Jobs\RenderVideo;
use App\Models\Video;

$video = Video::find(1);

RenderVideo::dispatch($video);
```


#### 작업에 태그 수동 지정하기 {#manually-tagging-jobs}

큐에 넣을 객체에 대해 태그를 수동으로 지정하고 싶다면, 클래스에 `tags` 메서드를 정의할 수 있습니다:

```php
class RenderVideo implements ShouldQueue
{
    /**
     * 작업에 할당할 태그를 가져옵니다.
     *
     * @return array<int, string>
     */
    public function tags(): array
    {
        return ['render', 'video:'.$this->video->id];
    }
}
```


#### 이벤트 리스너에 태그 수동 지정하기 {#manually-tagging-event-listeners}

큐에 등록된 이벤트 리스너의 태그를 가져올 때, Horizon은 이벤트 인스턴스를 `tags` 메서드에 자동으로 전달하여 이벤트 데이터를 태그에 추가할 수 있도록 합니다:

```php
class SendRenderNotifications implements ShouldQueue
{
    /**
     * 리스너에 할당할 태그를 가져옵니다.
     *
     * @return array<int, string>
     */
    public function tags(VideoRendered $event): array
    {
        return ['video:'.$event->video->id];
    }
}
```


## 알림 {#notifications}

> [!WARNING]
> Horizon에서 Slack 또는 SMS 알림을 설정하려면, [해당 알림 채널의 사전 요구 사항](/laravel/12.x/notifications)을 확인해야 합니다.

큐 중 하나에 대기 시간이 길어질 때 알림을 받고 싶다면, `Horizon::routeMailNotificationsTo`, `Horizon::routeSlackNotificationsTo`, `Horizon::routeSmsNotificationsTo` 메서드를 사용할 수 있습니다. 이 메서드들은 애플리케이션의 `App\Providers\HorizonServiceProvider`의 `boot` 메서드에서 호출할 수 있습니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    parent::boot();

    Horizon::routeSmsNotificationsTo('15556667777');
    Horizon::routeMailNotificationsTo('example@example.com');
    Horizon::routeSlackNotificationsTo('slack-webhook-url', '#channel');
}
```


#### 알림 대기 시간 임계값 구성 {#configuring-notification-wait-time-thresholds}

애플리케이션의 `config/horizon.php` 설정 파일에서 몇 초를 "긴 대기"로 간주할지 구성할 수 있습니다. 이 파일의 `waits` 설정 옵션을 통해 각 연결/큐 조합에 대한 긴 대기 임계값을 제어할 수 있습니다. 정의되지 않은 연결/큐 조합은 기본적으로 60초의 긴 대기 임계값이 적용됩니다:

```php
'waits' => [
    'redis:critical' => 30,
    'redis:default' => 60,
    'redis:batch' => 120,
],
```


## 메트릭스 {#metrics}

Horizon에는 작업 및 큐 대기 시간과 처리량에 대한 정보를 제공하는 메트릭스 대시보드가 포함되어 있습니다. 이 대시보드를 채우기 위해서는 애플리케이션의 `routes/console.php` 파일에서 Horizon의 `snapshot` Artisan 명령어가 5분마다 실행되도록 설정해야 합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('horizon:snapshot')->everyFiveMinutes();
```


## 실패한 작업 삭제하기 {#deleting-failed-jobs}

실패한 작업을 삭제하고 싶다면, `horizon:forget` 명령어를 사용할 수 있습니다. `horizon:forget` 명령어는 실패한 작업의 ID 또는 UUID를 유일한 인자로 받습니다:

```shell
php artisan horizon:forget 5
```

모든 실패한 작업을 삭제하고 싶다면, `horizon:forget` 명령어에 `--all` 옵션을 추가하면 됩니다:

```shell
php artisan horizon:forget --all
```


## 큐에서 작업 삭제하기 {#clearing-jobs-from-queues}

애플리케이션의 기본 큐에서 모든 작업을 삭제하고 싶다면, `horizon:clear` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan horizon:clear
```

특정 큐에서 작업을 삭제하려면 `queue` 옵션을 제공할 수 있습니다:

```shell
php artisan horizon:clear --queue=emails
```
