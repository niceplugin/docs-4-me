# 작업 스케줄링





















## 소개 {#introduction}

과거에는 서버에서 예약해야 하는 각 작업마다 크론(cron) 설정 항목을 작성했을 수 있습니다. 하지만 이렇게 하면 작업 스케줄이 소스 컨트롤에 포함되지 않고, 기존 크론 항목을 확인하거나 추가하려면 서버에 SSH로 접속해야 하므로 관리가 번거로워집니다.

Laravel의 명령어 스케줄러는 서버에서 예약 작업을 관리하는 새로운 방식을 제공합니다. 스케줄러를 사용하면 Laravel 애플리케이션 내에서 명령어 스케줄을 유연하고 직관적으로 정의할 수 있습니다. 스케줄러를 사용할 때는 서버에 단 하나의 크론 항목만 필요합니다. 작업 스케줄은 일반적으로 애플리케이션의 `routes/console.php` 파일에 정의합니다.


## 스케줄 정의 {#defining-schedules}

모든 예약 작업은 애플리케이션의 `routes/console.php` 파일에 정의할 수 있습니다. 먼저 예제를 살펴보겠습니다. 이 예제에서는 매일 자정에 호출되는 클로저를 예약합니다. 클로저 내에서 데이터베이스 쿼리를 실행하여 테이블을 비웁니다:

```php
<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('recent_users')->delete();
})->daily();
```

클로저를 사용한 스케줄링 외에도, [호출 가능한 객체](https://secure.php.net/manual/en/language.oop5.magic.php#object.invoke)를 예약할 수도 있습니다. 호출 가능한 객체는 `__invoke` 메서드를 포함하는 간단한 PHP 클래스입니다:

```php
Schedule::call(new DeleteRecentUsers)->daily();
```

`routes/console.php` 파일을 명령어 정의 전용으로 사용하고 싶다면, 애플리케이션의 `bootstrap/app.php` 파일에서 `withSchedule` 메서드를 사용해 예약 작업을 정의할 수 있습니다. 이 메서드는 스케줄러 인스턴스를 받는 클로저를 인자로 받습니다:

```php
use Illuminate\Console\Scheduling\Schedule;

->withSchedule(function (Schedule $schedule) {
    $schedule->call(new DeleteRecentUsers)->daily();
})
```

예약된 작업과 다음 실행 예정 시간을 한눈에 보고 싶다면, `schedule:list` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan schedule:list
```


### Artisan 명령어 스케줄링 {#scheduling-artisan-commands}

클로저 예약 외에도, [Artisan 명령어](/laravel/12.x/artisan) 및 시스템 명령어도 예약할 수 있습니다. 예를 들어, `command` 메서드를 사용해 명령어 이름이나 클래스명으로 Artisan 명령어를 예약할 수 있습니다.

명령어의 클래스명을 사용해 Artisan 명령어를 예약할 때는, 명령어 실행 시 전달할 추가 커맨드라인 인자를 배열로 전달할 수 있습니다:

```php
use App\Console\Commands\SendEmailsCommand;
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send Taylor --force')->daily();

Schedule::command(SendEmailsCommand::class, ['Taylor', '--force'])->daily();
```


#### Artisan 클로저 명령어 스케줄링 {#scheduling-artisan-closure-commands}

클로저로 정의된 Artisan 명령어를 예약하려면, 명령어 정의 후에 스케줄 관련 메서드를 체이닝할 수 있습니다:

```php
Artisan::command('delete:recent-users', function () {
    DB::table('recent_users')->delete();
})->purpose('Delete recent users')->daily();
```

클로저 명령어에 인자를 전달해야 한다면, `schedule` 메서드에 인자를 넘길 수 있습니다:

```php
Artisan::command('emails:send {user} {--force}', function ($user) {
    // ...
})->purpose('Send emails to the specified user')->schedule(['Taylor', '--force'])->daily();
```


### 큐 작업 스케줄링 {#scheduling-queued-jobs}

`job` 메서드를 사용해 [큐 작업](/laravel/12.x/queues)을 예약할 수 있습니다. 이 메서드는 클로저를 사용해 작업을 큐에 넣지 않고도 큐 작업을 예약할 수 있는 편리한 방법을 제공합니다:

```php
use App\Jobs\Heartbeat;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new Heartbeat)->everyFiveMinutes();
```

`job` 메서드에는 선택적으로 두 번째, 세 번째 인자를 전달해 작업을 큐에 넣을 큐 이름과 큐 연결을 지정할 수 있습니다:

```php
use App\Jobs\Heartbeat;
use Illuminate\Support\Facades\Schedule;

// "heartbeats" 큐를 "sqs" 연결로 작업을 디스패치...
Schedule::job(new Heartbeat, 'heartbeats', 'sqs')->everyFiveMinutes();
```


### 셸 명령어 스케줄링 {#scheduling-shell-commands}

`exec` 메서드를 사용해 운영체제에 명령어를 실행할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::exec('node /home/forge/script.js')->daily();
```


### 스케줄 빈도 옵션 {#schedule-frequency-options}

지정한 간격으로 작업을 실행하도록 설정하는 몇 가지 예시를 이미 살펴보았습니다. 하지만 작업에 할당할 수 있는 다양한 스케줄 빈도 옵션이 더 있습니다:

<div class="overflow-auto">

| 메서드                             | 설명                                                    |
| ---------------------------------- | ------------------------------------------------------ |
| `->cron('* * * * *');`             | 커스텀 크론 스케줄로 작업 실행.                        |
| `->everySecond();`                 | 매초 작업 실행.                                        |
| `->everyTwoSeconds();`             | 2초마다 작업 실행.                                     |
| `->everyFiveSeconds();`            | 5초마다 작업 실행.                                     |
| `->everyTenSeconds();`             | 10초마다 작업 실행.                                    |
| `->everyFifteenSeconds();`         | 15초마다 작업 실행.                                    |
| `->everyTwentySeconds();`          | 20초마다 작업 실행.                                    |
| `->everyThirtySeconds();`          | 30초마다 작업 실행.                                    |
| `->everyMinute();`                 | 매분 작업 실행.                                        |
| `->everyTwoMinutes();`             | 2분마다 작업 실행.                                     |
| `->everyThreeMinutes();`           | 3분마다 작업 실행.                                     |
| `->everyFourMinutes();`            | 4분마다 작업 실행.                                     |
| `->everyFiveMinutes();`            | 5분마다 작업 실행.                                     |
| `->everyTenMinutes();`             | 10분마다 작업 실행.                                    |
| `->everyFifteenMinutes();`         | 15분마다 작업 실행.                                    |
| `->everyThirtyMinutes();`          | 30분마다 작업 실행.                                    |
| `->hourly();`                      | 매시간 작업 실행.                                      |
| `->hourlyAt(17);`                  | 매시간 17분에 작업 실행.                               |
| `->everyOddHour($minutes = 0);`    | 홀수 시간마다 작업 실행.                               |
| `->everyTwoHours($minutes = 0);`   | 2시간마다 작업 실행.                                   |
| `->everyThreeHours($minutes = 0);` | 3시간마다 작업 실행.                                   |
| `->everyFourHours($minutes = 0);`  | 4시간마다 작업 실행.                                   |
| `->everySixHours($minutes = 0);`   | 6시간마다 작업 실행.                                   |
| `->daily();`                       | 매일 자정에 작업 실행.                                 |
| `->dailyAt('13:00');`              | 매일 13:00에 작업 실행.                                |
| `->twiceDaily(1, 13);`             | 매일 1:00, 13:00에 작업 실행.                          |
| `->twiceDailyAt(1, 13, 15);`       | 매일 1:15, 13:15에 작업 실행.                          |
| `->weekly();`                      | 매주 일요일 00:00에 작업 실행.                         |
| `->weeklyOn(1, '8:00');`           | 매주 월요일 8:00에 작업 실행.                          |
| `->monthly();`                     | 매월 1일 00:00에 작업 실행.                            |
| `->monthlyOn(4, '15:00');`         | 매월 4일 15:00에 작업 실행.                            |
| `->twiceMonthly(1, 16, '13:00');`  | 매월 1일, 16일 13:00에 작업 실행.                      |
| `->lastDayOfMonth('15:00');`       | 매월 마지막 날 15:00에 작업 실행.                      |
| `->quarterly();`                   | 매 분기 첫날 00:00에 작업 실행.                        |
| `->quarterlyOn(4, '14:00');`       | 매 분기 4일 14:00에 작업 실행.                         |
| `->yearly();`                      | 매년 1월 1일 00:00에 작업 실행.                        |
| `->yearlyOn(6, 1, '17:00');`       | 매년 6월 1일 17:00에 작업 실행.                        |
| `->timezone('America/New_York');`  | 작업의 타임존 설정.                                    |

</div>

이 메서드들은 추가 제약 조건과 결합해 특정 요일에만 실행되는 등 더욱 세밀한 스케줄을 만들 수 있습니다. 예를 들어, 명령어를 매주 월요일에 실행하도록 예약할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

// 매주 월요일 오후 1시에 한 번 실행...
Schedule::call(function () {
    // ...
})->weekly()->mondays()->at('13:00');

// 평일 오전 8시부터 오후 5시까지 매시간 실행...
Schedule::command('foo')
    ->weekdays()
    ->hourly()
    ->timezone('America/Chicago')
    ->between('8:00', '17:00');
```

추가 스케줄 제약 조건 목록은 아래와 같습니다:

<div class="overflow-auto">

| 메서드                                   | 설명                                                    |
| ---------------------------------------- | ------------------------------------------------------ |
| `->weekdays();`                          | 평일에만 작업 실행.                                    |
| `->weekends();`                          | 주말에만 작업 실행.                                    |
| `->sundays();`                           | 일요일에만 작업 실행.                                  |
| `->mondays();`                           | 월요일에만 작업 실행.                                  |
| `->tuesdays();`                          | 화요일에만 작업 실행.                                  |
| `->wednesdays();`                        | 수요일에만 작업 실행.                                  |
| `->thursdays();`                         | 목요일에만 작업 실행.                                  |
| `->fridays();`                           | 금요일에만 작업 실행.                                  |
| `->saturdays();`                         | 토요일에만 작업 실행.                                  |
| `->days(array\|mixed);`                  | 특정 요일에만 작업 실행.                               |
| `->between($startTime, $endTime);`       | 시작~종료 시간 사이에만 작업 실행.                     |
| `->unlessBetween($startTime, $endTime);` | 시작~종료 시간 사이에는 작업 실행 안 함.               |
| `->when(Closure);`                       | 참/거짓 테스트 결과에 따라 작업 실행.                  |
| `->environments($env);`                  | 특정 환경에서만 작업 실행.                             |

</div>


#### 요일 제약 조건 {#day-constraints}

`days` 메서드를 사용해 작업 실행을 특정 요일로 제한할 수 있습니다. 예를 들어, 명령어를 매시간 일요일과 수요일에 실행하도록 예약할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')
    ->hourly()
    ->days([0, 3]);
```

또는, 작업이 실행될 요일을 정의할 때 `Illuminate\Console\Scheduling\Schedule` 클래스의 상수를 사용할 수도 있습니다:

```php
use Illuminate\Support\Facades;
use Illuminate\Console\Scheduling\Schedule;

Facades\Schedule::command('emails:send')
    ->hourly()
    ->days([Schedule::SUNDAY, Schedule::WEDNESDAY]);
```


#### 시간대 제약 조건 {#between-time-constraints}

`between` 메서드를 사용해 작업 실행을 하루 중 특정 시간대로 제한할 수 있습니다:

```php
Schedule::command('emails:send')
    ->hourly()
    ->between('7:00', '22:00');
```

마찬가지로, `unlessBetween` 메서드를 사용해 특정 시간대에는 작업이 실행되지 않도록 할 수 있습니다:

```php
Schedule::command('emails:send')
    ->hourly()
    ->unlessBetween('23:00', '4:00');
```


#### 참/거짓 테스트 제약 조건 {#truth-test-constraints}

`when` 메서드는 주어진 참/거짓 테스트 결과에 따라 작업 실행을 제한할 수 있습니다. 즉, 클로저가 `true`를 반환하면, 다른 제약 조건이 없을 때 작업이 실행됩니다:

```php
Schedule::command('emails:send')->daily()->when(function () {
    return true;
});
```

`skip` 메서드는 `when`의 반대 역할을 합니다. `skip` 메서드가 `true`를 반환하면 예약된 작업이 실행되지 않습니다:

```php
Schedule::command('emails:send')->daily()->skip(function () {
    return true;
});
```

`when` 메서드를 체이닝해서 사용할 때, 모든 `when` 조건이 `true`를 반환해야 명령어가 실행됩니다.


#### 환경 제약 조건 {#environment-constraints}

`environments` 메서드를 사용해 주어진 환경(예: `APP_ENV` [환경 변수](/laravel/12.x/configuration#environment-configuration))에서만 작업을 실행할 수 있습니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->environments(['staging', 'production']);
```


### 타임존 {#timezones}

`timezone` 메서드를 사용해 예약 작업의 시간이 특정 타임존에서 해석되도록 지정할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('report:generate')
    ->timezone('America/New_York')
    ->at('2:00')
```

모든 예약 작업에 동일한 타임존을 반복적으로 지정하고 있다면, 애플리케이션의 `app` 설정 파일에 `schedule_timezone` 옵션을 정의해 모든 스케줄에 적용할 타임존을 지정할 수 있습니다:

```php
'timezone' => 'UTC',

'schedule_timezone' => 'America/Chicago',
```

> [!WARNING]
> 일부 타임존은 서머타임(일광 절약 시간제)을 사용합니다. 서머타임 변경이 발생하면 예약 작업이 두 번 실행되거나 아예 실행되지 않을 수 있습니다. 이런 이유로, 가능하다면 타임존 스케줄링은 피하는 것을 권장합니다.


### 작업 중복 방지 {#preventing-task-overlaps}

기본적으로 예약 작업은 이전 작업 인스턴스가 아직 실행 중이어도 계속 실행됩니다. 이를 방지하려면 `withoutOverlapping` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')->withoutOverlapping();
```

이 예제에서 `emails:send` [Artisan 명령어](/laravel/12.x/artisan)는 이미 실행 중이 아니면 매분 실행됩니다. `withoutOverlapping` 메서드는 실행 시간이 크게 달라질 수 있는 작업에 특히 유용하며, 작업이 얼마나 걸릴지 예측하기 어려울 때 중복 실행을 방지할 수 있습니다.

필요하다면, "중복 방지" 락이 만료되기까지 지나야 하는 분(minute) 수를 지정할 수 있습니다. 기본적으로 락은 24시간 후 만료됩니다:

```php
Schedule::command('emails:send')->withoutOverlapping(10);
```

내부적으로 `withoutOverlapping` 메서드는 애플리케이션의 [캐시](/laravel/12.x/cache)를 사용해 락을 획득합니다. 필요하다면 `schedule:clear-cache` Artisan 명령어로 이 캐시 락을 해제할 수 있습니다. 이는 주로 예기치 않은 서버 문제로 작업이 멈췄을 때만 필요합니다.


### 한 서버에서만 작업 실행 {#running-tasks-on-one-server}

> [!WARNING]
> 이 기능을 사용하려면, 애플리케이션의 기본 캐시 드라이버가 `database`, `memcached`, `dynamodb`, 또는 `redis`여야 합니다. 또한 모든 서버가 동일한 중앙 캐시 서버와 통신해야 합니다.

애플리케이션의 스케줄러가 여러 서버에서 실행 중이라면, 예약 작업을 한 서버에서만 실행하도록 제한할 수 있습니다. 예를 들어, 매주 금요일 밤에 새 보고서를 생성하는 예약 작업이 있다고 가정해봅시다. 작업 스케줄러가 세 개의 워커 서버에서 실행 중이라면, 예약 작업이 세 서버 모두에서 실행되어 보고서가 세 번 생성됩니다. 이는 바람직하지 않습니다!

작업을 한 서버에서만 실행하도록 하려면, 예약 작업 정의 시 `onOneServer` 메서드를 사용하세요. 작업을 먼저 획득한 서버가 해당 작업에 대한 원자적 락을 확보해 다른 서버에서 동시에 실행되지 않도록 합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('report:generate')
    ->fridays()
    ->at('17:00')
    ->onOneServer();
```

스케줄러가 단일 서버 작업에 필요한 원자적 락을 획득할 때 사용할 캐시 스토어를 `useCache` 메서드로 커스터마이즈할 수 있습니다:

```php
Schedule::useCache('database');
```


#### 단일 서버 작업 이름 지정 {#naming-unique-jobs}

때로는 동일한 작업을 서로 다른 파라미터로 예약하면서, 각 작업 조합이 한 서버에서만 실행되도록 하고 싶을 수 있습니다. 이를 위해 각 스케줄 정의에 `name` 메서드로 고유한 이름을 지정할 수 있습니다:

```php
Schedule::job(new CheckUptime('https://laravel.com'))
    ->name('check_uptime:laravel.com')
    ->everyFiveMinutes()
    ->onOneServer();

Schedule::job(new CheckUptime('https://vapor.laravel.com'))
    ->name('check_uptime:vapor.laravel.com')
    ->everyFiveMinutes()
    ->onOneServer();
```

마찬가지로, 한 서버에서만 실행되도록 의도된 예약 클로저도 이름을 지정해야 합니다:

```php
Schedule::call(fn () => User::resetApiRequestCount())
    ->name('reset-api-request-count')
    ->daily()
    ->onOneServer();
```


### 백그라운드 작업 {#background-tasks}

기본적으로, 같은 시간에 예약된 여러 작업은 `schedule` 메서드에 정의된 순서대로 순차적으로 실행됩니다. 실행 시간이 긴 작업이 있다면, 이후 작업이 예상보다 훨씬 늦게 시작될 수 있습니다. 모든 작업을 동시에 실행하고 싶다면, `runInBackground` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('analytics:report')
    ->daily()
    ->runInBackground();
```

> [!WARNING]
> `runInBackground` 메서드는 `command` 및 `exec` 메서드를 통해 예약된 작업에서만 사용할 수 있습니다.


### 유지보수 모드 {#maintenance-mode}

애플리케이션이 [유지보수 모드](/laravel/12.x/configuration#maintenance-mode)일 때는 예약 작업이 실행되지 않습니다. 이는 서버에서 진행 중인 유지보수 작업에 예약 작업이 방해되지 않도록 하기 위함입니다. 하지만 유지보수 모드에서도 작업을 강제로 실행하고 싶다면, 작업 정의 시 `evenInMaintenanceMode` 메서드를 호출할 수 있습니다:

```php
Schedule::command('emails:send')->evenInMaintenanceMode();
```


### 스케줄 그룹 {#schedule-groups}

비슷한 설정을 가진 여러 예약 작업을 정의할 때, Laravel의 작업 그룹화 기능을 사용하면 각 작업마다 동일한 설정을 반복하지 않아도 됩니다. 작업 그룹화는 코드를 간결하게 하고, 관련 작업 간의 일관성을 보장합니다.

예약 작업 그룹을 만들려면, 원하는 작업 설정 메서드들을 호출한 뒤 `group` 메서드를 사용하세요. `group` 메서드는 지정한 설정을 공유하는 작업들을 정의하는 클로저를 인자로 받습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::daily()
    ->onOneServer()
    ->timezone('America/New_York')
    ->group(function () {
        Schedule::command('emails:send --force');
        Schedule::command('emails:prune');
    });
```


## 스케줄러 실행 {#running-the-scheduler}

이제 예약 작업을 정의하는 방법을 배웠으니, 실제로 서버에서 어떻게 실행하는지 알아보겠습니다. `schedule:run` Artisan 명령어는 모든 예약 작업을 평가하고, 서버의 현재 시간에 따라 실행 여부를 결정합니다.

따라서 Laravel의 스케줄러를 사용할 때는, 서버에 `schedule:run` 명령어를 매분 실행하는 단 하나의 크론 설정만 추가하면 됩니다. 서버에 크론 항목을 추가하는 방법을 모른다면, [Laravel Cloud](https://cloud.laravel.com)와 같은 관리형 플랫폼을 사용해 예약 작업 실행을 관리할 수도 있습니다:

```shell
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```


### 1분 미만 간격의 스케줄 작업 {#sub-minute-scheduled-tasks}

대부분의 운영체제에서 크론 작업은 최대 1분에 한 번만 실행할 수 있습니다. 하지만 Laravel의 스케줄러는 1초마다 실행하는 등 더 짧은 간격으로 작업을 예약할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('recent_users')->delete();
})->everySecond();
```

애플리케이션에 1분 미만 작업이 정의되어 있으면, `schedule:run` 명령어는 즉시 종료하지 않고 현재 분이 끝날 때까지 계속 실행됩니다. 이를 통해 명령어가 해당 분 동안 필요한 모든 1분 미만 작업을 호출할 수 있습니다.

예상보다 오래 걸리는 1분 미만 작업이 이후 작업 실행을 지연시킬 수 있으므로, 모든 1분 미만 작업은 큐 작업이나 백그라운드 명령어를 디스패치해 실제 작업 처리를 하도록 권장합니다:

```php
use App\Jobs\DeleteRecentUsers;

Schedule::job(new DeleteRecentUsers)->everyTenSeconds();

Schedule::command('users:delete')->everyTenSeconds()->runInBackground();
```


#### 1분 미만 작업 중단하기 {#interrupting-sub-minute-tasks}

1분 미만 작업이 정의되어 있을 때 `schedule:run` 명령어는 호출된 분 전체 동안 실행됩니다. 애플리케이션을 배포할 때 이 명령어를 중단해야 할 때가 있습니다. 그렇지 않으면 이미 실행 중인 `schedule:run` 인스턴스가 현재 분이 끝날 때까지 이전에 배포된 코드를 계속 사용할 수 있습니다.

진행 중인 `schedule:run` 실행을 중단하려면, 애플리케이션 배포 스크립트에 `schedule:interrupt` 명령어를 추가하세요. 이 명령어는 애플리케이션 배포가 끝난 후에 실행해야 합니다:

```shell
php artisan schedule:interrupt
```


### 로컬에서 스케줄러 실행 {#running-the-scheduler-locally}

일반적으로 로컬 개발 환경에는 스케줄러 크론 항목을 추가하지 않습니다. 대신, `schedule:work` Artisan 명령어를 사용할 수 있습니다. 이 명령어는 포그라운드에서 실행되며, 사용자가 명령어를 종료할 때까지 매분 스케줄러를 호출합니다. 1분 미만 작업이 정의되어 있으면, 스케줄러는 각 분마다 계속 실행되어 해당 작업을 처리합니다:

```shell
php artisan schedule:work
```


## 작업 출력 {#task-output}

Laravel 스케줄러는 예약 작업에서 생성된 출력을 다루기 위한 여러 편리한 메서드를 제공합니다. 먼저, `sendOutputTo` 메서드를 사용해 출력을 파일로 보낼 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')
    ->daily()
    ->sendOutputTo($filePath);
```

출력을 파일에 추가(append)하고 싶다면, `appendOutputTo` 메서드를 사용할 수 있습니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->appendOutputTo($filePath);
```

`emailOutputTo` 메서드를 사용하면 원하는 이메일 주소로 출력을 전송할 수 있습니다. 작업의 출력을 이메일로 보내기 전에 Laravel의 [이메일 서비스](/laravel/12.x/mail)를 설정해야 합니다:

```php
Schedule::command('report:generate')
    ->daily()
    ->sendOutputTo($filePath)
    ->emailOutputTo('taylor@example.com');
```

예약된 Artisan 또는 시스템 명령어가 0이 아닌 종료 코드로 종료될 때만 출력을 이메일로 보내고 싶다면, `emailOutputOnFailure` 메서드를 사용하세요:

```php
Schedule::command('report:generate')
    ->daily()
    ->emailOutputOnFailure('taylor@example.com');
```

> [!WARNING]
> `emailOutputTo`, `emailOutputOnFailure`, `sendOutputTo`, `appendOutputTo` 메서드는 `command` 및 `exec` 메서드에서만 사용할 수 있습니다.


## 작업 후크 {#task-hooks}

`before` 및 `after` 메서드를 사용해 예약 작업이 실행되기 전과 후에 실행할 코드를 지정할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')
    ->daily()
    ->before(function () {
        // 작업이 곧 실행됩니다...
    })
    ->after(function () {
        // 작업이 실행되었습니다...
    });
```

`onSuccess` 및 `onFailure` 메서드를 사용해 예약 작업이 성공하거나 실패할 때 실행할 코드를 지정할 수 있습니다. 실패란 예약된 Artisan 또는 시스템 명령어가 0이 아닌 종료 코드로 종료된 경우를 의미합니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->onSuccess(function () {
        // 작업이 성공했습니다...
    })
    ->onFailure(function () {
        // 작업이 실패했습니다...
    });
```

명령어에서 출력이 생성된다면, 후크의 클로저 정의에서 `$output` 인자로 `Illuminate\Support\Stringable` 인스턴스를 타입힌트하여 출력에 접근할 수 있습니다:

```php
use Illuminate\Support\Stringable;

Schedule::command('emails:send')
    ->daily()
    ->onSuccess(function (Stringable $output) {
        // 작업이 성공했습니다...
    })
    ->onFailure(function (Stringable $output) {
        // 작업이 실패했습니다...
    });
```


#### URL 핑(ping)하기 {#pinging-urls}

`pingBefore` 및 `thenPing` 메서드를 사용하면, 작업이 실행되기 전이나 후에 지정한 URL로 자동으로 핑(ping)을 보낼 수 있습니다. 이 방법은 [Envoyer](https://envoyer.io)와 같은 외부 서비스에 예약 작업이 시작되거나 완료되었음을 알릴 때 유용합니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->pingBefore($url)
    ->thenPing($url);
```

`pingOnSuccess` 및 `pingOnFailure` 메서드는 작업이 성공하거나 실패할 때만 지정한 URL로 핑을 보낼 수 있습니다. 실패란 예약된 Artisan 또는 시스템 명령어가 0이 아닌 종료 코드로 종료된 경우를 의미합니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->pingOnSuccess($successUrl)
    ->pingOnFailure($failureUrl);
```

`pingBeforeIf`, `thenPingIf`, `pingOnSuccessIf`, `pingOnFailureIf` 메서드는 주어진 조건이 `true`일 때만 지정한 URL로 핑을 보냅니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->pingBeforeIf($condition, $url)
    ->thenPingIf($condition, $url);

Schedule::command('emails:send')
    ->daily()
    ->pingOnSuccessIf($condition, $successUrl)
    ->pingOnFailureIf($condition, $failureUrl);
```


## 이벤트 {#events}

Laravel은 스케줄링 과정에서 다양한 [이벤트](/laravel/12.x/events)를 디스패치합니다. 다음 이벤트 중 원하는 이벤트에 [리스너를 정의](/laravel/12.x/events)할 수 있습니다:

<div class="overflow-auto">

| 이벤트 이름                                                      |
|-------------------------------------------------------------|
| `Illuminate\Console\Events\ScheduledTaskStarting`           |
| `Illuminate\Console\Events\ScheduledTaskFinished`           |
| `Illuminate\Console\Events\ScheduledBackgroundTaskFinished` |
| `Illuminate\Console\Events\ScheduledTaskSkipped`            |
| `Illuminate\Console\Events\ScheduledTaskFailed`             |

</div>
