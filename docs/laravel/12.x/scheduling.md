# 작업 스케줄링





















## 소개 {#introduction}

과거에는 서버에서 예약해야 하는 각 작업마다 크론(cron) 설정 항목을 작성했을 수 있습니다. 하지만 이렇게 하면 작업 스케줄이 소스 컨트롤에 포함되지 않고, 기존 크론 항목을 확인하거나 새로운 항목을 추가하려면 서버에 SSH로 접속해야 하므로 관리가 번거로워집니다.

Laravel의 명령 스케줄러는 서버에서 예약 작업을 관리하는 새로운 방식을 제공합니다. 스케줄러를 사용하면 Laravel 애플리케이션 내에서 명령 스케줄을 유연하고 직관적으로 정의할 수 있습니다. 스케줄러를 사용할 때는 서버에 단 하나의 크론 항목만 필요합니다. 작업 스케줄은 일반적으로 애플리케이션의 `routes/console.php` 파일에서 정의합니다.


## 스케줄 정의하기 {#defining-schedules}

모든 예약 작업은 애플리케이션의 `routes/console.php` 파일에서 정의할 수 있습니다. 먼저 예제를 살펴보겠습니다. 이 예제에서는 매일 자정에 호출되는 클로저를 예약합니다. 클로저 내부에서는 데이터베이스 쿼리를 실행하여 테이블을 비웁니다:

```php
<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('recent_users')->delete();
})->daily();
```

클로저를 사용한 예약 외에도, [호출 가능한 객체](https://secure.php.net/manual/en/language.oop5.magic.php#object.invoke)를 예약할 수도 있습니다. 호출 가능한 객체는 `__invoke` 메서드를 포함하는 간단한 PHP 클래스입니다:

```php
Schedule::call(new DeleteRecentUsers)->daily();
```

`routes/console.php` 파일을 명령어 정의에만 사용하고 싶다면, 애플리케이션의 `bootstrap/app.php` 파일에서 `withSchedule` 메서드를 사용하여 예약 작업을 정의할 수 있습니다. 이 메서드는 스케줄러 인스턴스를 받는 클로저를 인자로 받습니다:

```php
use Illuminate\Console\Scheduling\Schedule;

->withSchedule(function (Schedule $schedule) {
    $schedule->call(new DeleteRecentUsers)->daily();
})
```

예약된 작업의 개요와 다음 실행 예정 시간을 확인하고 싶다면, `schedule:list` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan schedule:list
```


### 아티즌 명령어 스케줄링 {#scheduling-artisan-commands}

클로저를 스케줄링하는 것 외에도, [아티즌 명령어](/docs/{{version}}/artisan)와 시스템 명령어도 스케줄링할 수 있습니다. 예를 들어, `command` 메서드를 사용하여 명령어의 이름이나 클래스명을 통해 아티즌 명령어를 스케줄링할 수 있습니다.

아티즌 명령어를 클래스명으로 스케줄링할 때는, 명령어가 실행될 때 전달되어야 하는 추가 커맨드라인 인자를 배열로 전달할 수 있습니다:

```php
use App\Console\Commands\SendEmailsCommand;
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send Taylor --force')->daily();

Schedule::command(SendEmailsCommand::class, ['Taylor', '--force'])->daily();
```


#### 아티즌 클로저 명령어 스케줄링 {#scheduling-artisan-closure-commands}

클로저로 정의된 아티즌(Artisan) 명령어를 스케줄링하고 싶다면, 명령어 정의 후에 스케줄 관련 메서드를 체이닝하여 사용할 수 있습니다:

```php
Artisan::command('delete:recent-users', function () {
    DB::table('recent_users')->delete();
})->purpose('최근 사용자 삭제')->daily();
```

클로저 명령어에 인자를 전달해야 하는 경우, `schedule` 메서드에 인자를 배열로 전달할 수 있습니다:

```php
Artisan::command('emails:send {user} {--force}', function ($user) {
    // ...
})->purpose('지정된 사용자에게 이메일 전송')->schedule(['Taylor', '--force'])->daily();
```


### 큐 작업 스케줄링 {#scheduling-queued-jobs}

`job` 메서드는 [큐 작업](/docs/{{version}}/queues)을 스케줄링하는 데 사용할 수 있습니다. 이 메서드는 큐 작업을 큐에 넣기 위해 클로저를 정의하는 `call` 메서드를 사용하지 않고도, 큐 작업을 간편하게 스케줄링할 수 있는 방법을 제공합니다.

```php
use App\Jobs\Heartbeat;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new Heartbeat)->everyFiveMinutes();
```

`job` 메서드에는 선택적으로 두 번째와 세 번째 인자를 전달할 수 있습니다. 이 인자들은 각각 큐 작업이 사용해야 할 큐 이름과 큐 연결(connection)을 지정합니다.

```php
use App\Jobs\Heartbeat;
use Illuminate\Support\Facades\Schedule;

// "sqs" 연결의 "heartbeats" 큐로 작업을 디스패치합니다...
Schedule::job(new Heartbeat, 'heartbeats', 'sqs')->everyFiveMinutes();
```


### 셸 명령어 스케줄링 {#scheduling-shell-commands}

`exec` 메서드를 사용하면 운영 체제에 명령어를 실행하도록 지시할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::exec('node /home/forge/script.js')->daily();
```


### 스케줄 빈도 옵션 {#schedule-frequency-options}

지정된 간격으로 작업을 실행하도록 구성하는 몇 가지 예시를 이미 살펴보았습니다. 하지만 작업에 지정할 수 있는 더 다양한 스케줄 빈도 옵션이 있습니다:

<div class="overflow-auto">

| 메서드                                 | 설명                                                      |
| -------------------------------------- | --------------------------------------------------------- |
| `->cron('* * * * *');`                 | 커스텀 크론 스케줄로 작업을 실행합니다.                   |
| `->everySecond();`                     | 매초 작업을 실행합니다.                                   |
| `->everyTwoSeconds();`                 | 2초마다 작업을 실행합니다.                                |
| `->everyFiveSeconds();`                | 5초마다 작업을 실행합니다.                                |
| `->everyTenSeconds();`                 | 10초마다 작업을 실행합니다.                               |
| `->everyFifteenSeconds();`             | 15초마다 작업을 실행합니다.                               |
| `->everyTwentySeconds();`               | 20초마다 작업을 실행합니다.                               |
| `->everyThirtySeconds();`              | 30초마다 작업을 실행합니다.                               |
| `->everyMinute();`                     | 매분 작업을 실행합니다.                                   |
| `->everyTwoMinutes();`                 | 2분마다 작업을 실행합니다.                                |
| `->everyThreeMinutes();`               | 3분마다 작업을 실행합니다.                                |
| `->everyFourMinutes();`                | 4분마다 작업을 실행합니다.                                |
| `->everyFiveMinutes();`                | 5분마다 작업을 실행합니다.                                |
| `->everyTenMinutes();`                 | 10분마다 작업을 실행합니다.                               |
| `->everyFifteenMinutes();`             | 15분마다 작업을 실행합니다.                               |
| `->everyThirtyMinutes();`              | 30분마다 작업을 실행합니다.                               |
| `->hourly();`                          | 매시간 작업을 실행합니다.                                 |
| `->hourlyAt(17);`                      | 매시간 17분에 작업을 실행합니다.                          |
| `->everyOddHour($minutes = 0);`        | 홀수 시간마다 작업을 실행합니다.                          |
| `->everyTwoHours($minutes = 0);`       | 2시간마다 작업을 실행합니다.                              |
| `->everyThreeHours($minutes = 0);`     | 3시간마다 작업을 실행합니다.                              |
| `->everyFourHours($minutes = 0);`      | 4시간마다 작업을 실행합니다.                              |
| `->everySixHours($minutes = 0);`       | 6시간마다 작업을 실행합니다.                              |
| `->daily();`                           | 매일 자정에 작업을 실행합니다.                            |
| `->dailyAt('13:00');`                  | 매일 13:00에 작업을 실행합니다.                           |
| `->twiceDaily(1, 13);`                 | 매일 1:00과 13:00에 작업을 실행합니다.                    |
| `->twiceDailyAt(1, 13, 15);`           | 매일 1:15과 13:15에 작업을 실행합니다.                    |
| `->weekly();`                          | 매주 일요일 00:00에 작업을 실행합니다.                    |
| `->weeklyOn(1, '8:00');`               | 매주 월요일 8:00에 작업을 실행합니다.                     |
| `->monthly();`                         | 매월 1일 00:00에 작업을 실행합니다.                       |
| `->monthlyOn(4, '15:00');`             | 매월 4일 15:00에 작업을 실행합니다.                       |
| `->twiceMonthly(1, 16, '13:00');`      | 매월 1일과 16일 13:00에 작업을 실행합니다.                |
| `->lastDayOfMonth('15:00');`           | 매월 마지막 날 15:00에 작업을 실행합니다.                 |
| `->quarterly();`                       | 매 분기 첫날 00:00에 작업을 실행합니다.                   |
| `->quarterlyOn(4, '14:00');`           | 매 분기 4일 14:00에 작업을 실행합니다.                    |
| `->yearly();`                          | 매년 1월 1일 00:00에 작업을 실행합니다.                   |
| `->yearlyOn(6, 1, '17:00');`           | 매년 6월 1일 17:00에 작업을 실행합니다.                   |
| `->timezone('America/New_York');`      | 작업의 타임존을 설정합니다.                               |

</div>

이러한 메서드는 추가 제약 조건과 결합하여 특정 요일에만 실행되는 등 더욱 세밀하게 스케줄을 조정할 수 있습니다. 예를 들어, 명령어를 매주 월요일에 실행하도록 예약할 수 있습니다:

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

| 메서드                                   | 설명                                                      |
| ---------------------------------------- | --------------------------------------------------------- |
| `->weekdays();`                          | 평일에만 작업을 제한합니다.                               |
| `->weekends();`                          | 주말에만 작업을 제한합니다.                               |
| `->sundays();`                           | 일요일에만 작업을 제한합니다.                             |
| `->mondays();`                           | 월요일에만 작업을 제한합니다.                             |
| `->tuesdays();`                          | 화요일에만 작업을 제한합니다.                             |
| `->wednesdays();`                        | 수요일에만 작업을 제한합니다.                             |
| `->thursdays();`                         | 목요일에만 작업을 제한합니다.                             |
| `->fridays();`                           | 금요일에만 작업을 제한합니다.                             |
| `->saturdays();`                         | 토요일에만 작업을 제한합니다.                             |
| `->days(array\|mixed);`                  | 특정 요일에만 작업을 제한합니다.                          |
| `->between($startTime, $endTime);`       | 시작 시간과 종료 시간 사이에만 작업을 실행합니다.          |
| `->unlessBetween($startTime, $endTime);` | 시작 시간과 종료 시간 사이에는 작업을 실행하지 않습니다.   |
| `->when(Closure);`                       | 조건이 참일 때만 작업을 실행합니다.                        |
| `->environments($env);`                  | 특정 환경에서만 작업을 실행합니다.                         |

</div>


#### 요일 제한 {#day-constraints}

`days` 메서드를 사용하면 작업이 실행될 요일을 특정할 수 있습니다. 예를 들어, 명령어를 일요일과 수요일에만 매시간 실행하도록 예약할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')
    ->hourly()
    ->days([0, 3]);
```

또는, 작업이 실행될 요일을 정의할 때 `Illuminate\Console\Scheduling\Schedule` 클래스에서 제공하는 상수를 사용할 수도 있습니다:

```php
use Illuminate\Support\Facades;
use Illuminate\Console\Scheduling\Schedule;

Facades\Schedule::command('emails:send')
    ->hourly()
    ->days([Schedule::SUNDAY, Schedule::WEDNESDAY]);
```


#### 시간 범위 제약 {#between-time-constraints}

`between` 메서드는 작업이 실행될 시간을 하루 중 특정 시간대로 제한할 때 사용할 수 있습니다:

```php
Schedule::command('emails:send')
    ->hourly()
    ->between('7:00', '22:00');
```

마찬가지로, `unlessBetween` 메서드를 사용하면 특정 시간대에는 작업이 실행되지 않도록 제외할 수 있습니다:

```php
Schedule::command('emails:send')
    ->hourly()
    ->unlessBetween('23:00', '4:00');
```


#### 진리 테스트 제약 {#truth-test-constraints}

`when` 메서드는 주어진 진리 테스트의 결과에 따라 작업 실행을 제한하는 데 사용할 수 있습니다. 즉, 주어진 클로저가 `true`를 반환하면, 다른 제약 조건이 없는 한 해당 작업이 실행됩니다:

```php
Schedule::command('emails:send')->daily()->when(function () {
    return true;
});
```

`skip` 메서드는 `when`의 반대 개념으로 볼 수 있습니다. `skip` 메서드가 `true`를 반환하면, 예약된 작업은 실행되지 않습니다:

```php
Schedule::command('emails:send')->daily()->skip(function () {
    return true;
});
```

여러 개의 `when` 메서드를 체이닝해서 사용할 경우, 모든 `when` 조건이 `true`를 반환해야 예약된 명령이 실행됩니다.


#### 환경 제약 {#environment-constraints}

`environments` 메서드는 지정된 환경(즉, `APP_ENV` [환경 변수](/docs/{{version}}/configuration#environment-configuration)로 정의된)에만 작업을 실행하도록 사용할 수 있습니다:

```php
Schedule::command('emails:send')
    ->daily()
    ->environments(['staging', 'production']);
```


### 타임존 {#timezones}

`schedule` 메서드의 `timezone`을 사용하면, 예약된 작업의 시간이 특정 타임존을 기준으로 해석되도록 지정할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('report:generate')
    ->timezone('America/New_York')
    ->at('2:00')
```

만약 모든 예약 작업에 동일한 타임존을 반복적으로 지정하고 있다면, 애플리케이션의 `app` 설정 파일에서 `schedule_timezone` 옵션을 정의하여 모든 예약 작업에 적용할 타임존을 지정할 수 있습니다:

```php
'timezone' => 'UTC',

'schedule_timezone' => 'America/Chicago',
```

> [!WARNING]
> 일부 타임존은 일광 절약 시간제(Daylight Saving Time, DST)를 사용합니다. 일광 절약 시간제가 변경될 때 예약된 작업이 두 번 실행되거나 아예 실행되지 않을 수 있습니다. 이러한 이유로, 가능하다면 타임존 기반 예약을 피하는 것을 권장합니다.


### 작업 중복 방지 {#preventing-task-overlaps}

기본적으로 예약된 작업은 이전 인스턴스가 아직 실행 중이더라도 계속 실행됩니다. 이를 방지하려면 `withoutOverlapping` 메서드를 사용할 수 있습니다.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')->withoutOverlapping();
```

이 예시에서 `emails:send` [Artisan 명령어](/docs/{{version}}/artisan)는 이미 실행 중이지 않은 경우에만 매 분마다 실행됩니다. `withoutOverlapping` 메서드는 실행 시간이 크게 달라질 수 있는 작업에 특히 유용하며, 작업이 정확히 얼마나 걸릴지 예측할 수 없을 때 중복 실행을 방지해줍니다.

필요하다면, "중복 방지" 잠금이 만료되기까지 몇 분이 지나야 하는지 지정할 수 있습니다. 기본적으로 이 잠금은 24시간 후에 만료됩니다.

```php
Schedule::command('emails:send')->withoutOverlapping(10);
```

내부적으로 `withoutOverlapping` 메서드는 애플리케이션의 [캐시](/docs/{{version}}/cache)를 이용해 잠금을 관리합니다. 만약 필요하다면, `schedule:clear-cache` Artisan 명령어를 사용해 이러한 캐시 잠금을 해제할 수 있습니다. 이는 일반적으로 예기치 않은 서버 문제로 인해 작업이 멈췄을 때만 필요합니다.


### 한 서버에서만 작업 실행하기 {#running-tasks-on-one-server}

> [!WARNING]
> 이 기능을 사용하려면, 애플리케이션의 기본 캐시 드라이버로 `database`, `memcached`, `dynamodb`, 또는 `redis` 중 하나를 사용해야 합니다. 또한, 모든 서버가 동일한 중앙 캐시 서버와 통신해야 합니다.

애플리케이션의 스케줄러가 여러 서버에서 실행되고 있다면, 특정 예약 작업이 오직 한 서버에서만 실행되도록 제한할 수 있습니다. 예를 들어, 매주 금요일 밤마다 새로운 리포트를 생성하는 예약 작업이 있다고 가정해봅시다. 작업 스케줄러가 세 개의 워커 서버에서 실행 중이라면, 예약 작업이 세 서버 모두에서 실행되어 리포트가 세 번 생성될 수 있습니다. 이는 바람직하지 않습니다!

작업이 한 서버에서만 실행되도록 하려면, 예약 작업을 정의할 때 `onOneServer` 메서드를 사용하면 됩니다. 작업을 가장 먼저 획득한 서버가 해당 작업에 대한 원자적 락을 확보하여, 다른 서버에서 동시에 같은 작업이 실행되지 않도록 방지합니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('report:generate')
    ->fridays()
    ->at('17:00')
    ->onOneServer();
```

단일 서버 작업에 필요한 원자적 락을 얻기 위해 스케줄러가 사용할 캐시 스토어를 커스터마이즈하려면 `useCache` 메서드를 사용할 수 있습니다:

```php
Schedule::useCache('database');
```


#### 단일 서버 작업의 이름 지정 {#naming-unique-jobs}

때때로 동일한 작업을 서로 다른 매개변수로 예약해야 하면서도, 각 작업 조합이 단일 서버에서만 실행되도록 Laravel에 지시해야 할 수 있습니다. 이를 위해 각 스케줄 정의에 name 메서드를 사용해 고유한 이름을 지정할 수 있습니다:

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

마찬가지로, 예약된 클로저도 단일 서버에서 실행되도록 하려면 반드시 이름을 지정해야 합니다:

```php
Schedule::call(fn () => User::resetApiRequestCount())
    ->name('reset-api-request-count')
    ->daily()
    ->onOneServer();
```


### 백그라운드 작업 {#background-tasks}

기본적으로, 동일한 시간에 예약된 여러 작업들은 `schedule` 메서드에 정의된 순서대로 순차적으로 실행됩니다. 만약 실행 시간이 긴 작업이 있다면, 이후 작업들이 예상보다 훨씬 늦게 시작될 수 있습니다. 모든 작업을 동시에 실행하고 싶다면, `runInBackground` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('analytics:report')
    ->daily()
    ->runInBackground();
```

> [!WARNING]
> `runInBackground` 메서드는 `command`와 `exec` 메서드를 통해 작업을 예약할 때만 사용할 수 있습니다.


### 유지보수 모드 {#maintenance-mode}

애플리케이션이 [유지보수 모드](/docs/{{version}}/configuration#maintenance-mode)일 때는, 서버에서 진행 중인 유지보수 작업에 스케줄된 작업이 방해가 되지 않도록 스케줄된 작업이 실행되지 않습니다. 그러나 유지보수 모드에서도 특정 작업을 강제로 실행하고 싶다면, 작업을 정의할 때 `evenInMaintenanceMode` 메서드를 호출하면 됩니다.

```php
Schedule::command('emails:send')->evenInMaintenanceMode();
```


### 스케줄 그룹 {#schedule-groups}

비슷한 설정을 가진 여러 예약 작업을 정의할 때, 라라벨의 작업 그룹화 기능을 사용하면 각 작업마다 동일한 설정을 반복하지 않아도 됩니다. 작업을 그룹화하면 코드가 간결해지고, 관련 작업들 간의 일관성을 유지할 수 있습니다.

예약 작업 그룹을 생성하려면, 원하는 작업 설정 메서드들을 호출한 뒤 `group` 메서드를 사용하면 됩니다. `group` 메서드는 클로저를 인자로 받으며, 이 클로저 안에서 지정한 설정을 공유하는 작업들을 정의합니다:

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


## 스케줄러 실행하기 {#running-the-scheduler}

이제 예약 작업을 정의하는 방법을 배웠으니, 실제로 서버에서 이 작업들을 어떻게 실행하는지 알아보겠습니다. `schedule:run` Artisan 명령어는 모든 예약 작업을 평가하여, 서버의 현재 시간에 따라 실행이 필요한지 판단합니다.

따라서 Laravel의 스케줄러를 사용할 때는, 서버에 `schedule:run` 명령어를 매 분마다 실행하는 크론(cron) 설정을 한 줄만 추가하면 됩니다. 서버에 크론 항목을 추가하는 방법을 잘 모른다면, [Laravel Cloud](https://cloud.laravel.com)와 같은 관리형 플랫폼을 사용하여 예약 작업 실행을 자동으로 관리할 수도 있습니다.

```shell
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```


### 1분 미만 간격의 예약 작업 {#sub-minute-scheduled-tasks}

대부분의 운영 체제에서 크론 작업(cron job)은 최대 1분에 한 번만 실행할 수 있습니다. 하지만 Laravel의 스케줄러는 작업을 더 짧은 간격, 심지어 1초마다 실행하도록 예약할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('recent_users')->delete();
})->everySecond();
```

애플리케이션 내에서 1분 미만 간격의 작업이 정의되어 있으면, `schedule:run` 명령은 즉시 종료되지 않고 현재 분이 끝날 때까지 계속 실행됩니다. 이를 통해 해당 분 동안 필요한 모든 1분 미만 간격의 작업을 호출할 수 있습니다.

1분 미만 간격의 작업이 예상보다 오래 걸릴 경우 이후 작업의 실행이 지연될 수 있으므로, 모든 1분 미만 간격의 작업은 큐에 작업을 디스패치하거나 백그라운드 명령을 실행하여 실제 처리를 맡기는 것이 권장됩니다:

```php
use App\Jobs\DeleteRecentUsers;

Schedule::job(new DeleteRecentUsers)->everyTenSeconds();

Schedule::command('users:delete')->everyTenSeconds()->runInBackground();
```


#### 1분 미만 작업 중단하기 {#interrupting-sub-minute-tasks}

`schedule:run` 명령어는 1분 미만의 작업이 정의되어 있을 때 호출된 전체 1분 동안 실행됩니다. 이로 인해 애플리케이션을 배포할 때 해당 명령어를 중단해야 할 필요가 있을 수 있습니다. 그렇지 않으면 이미 실행 중인 `schedule:run` 명령어 인스턴스가 현재 분이 끝날 때까지 이전에 배포된 애플리케이션 코드를 계속 사용할 수 있습니다.

진행 중인 `schedule:run` 실행을 중단하려면, 애플리케이션의 배포 스크립트에 `schedule:interrupt` 명령어를 추가할 수 있습니다. 이 명령어는 애플리케이션 배포가 완료된 후에 실행해야 합니다:

```shell
php artisan schedule:interrupt
```


### 스케줄러를 로컬에서 실행하기 {#running-the-scheduler-locally}

일반적으로 로컬 개발 환경에서는 스케줄러를 위한 크론(cron) 엔트리를 추가하지 않습니다. 대신, `schedule:work` Artisan 명령어를 사용할 수 있습니다. 이 명령어는 포그라운드에서 실행되며, 명령어를 종료할 때까지 매 분마다 스케줄러를 호출합니다. 1분 미만의 작업이 정의되어 있을 경우, 스케줄러는 해당 작업들을 처리하기 위해 각 분 내에서도 계속 실행됩니다:

```shell
php artisan schedule:work
```


## 작업 출력 {#task-output}

Laravel 스케줄러는 예약된 작업에서 생성된 출력을 다루기 위한 여러 편리한 메서드를 제공합니다. 먼저, `sendOutputTo` 메서드를 사용하면 출력을 파일로 보내 나중에 확인할 수 있습니다.

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send')
    ->daily()
    ->sendOutputTo($filePath);
```

출력을 지정한 파일에 이어서 기록하고 싶다면, `appendOutputTo` 메서드를 사용할 수 있습니다.

```php
Schedule::command('emails:send')
    ->daily()
    ->appendOutputTo($filePath);
```

`emailOutputTo` 메서드를 사용하면 원하는 이메일 주소로 출력을 전송할 수 있습니다. 작업의 출력을 이메일로 보내기 전에 Laravel의 [이메일 서비스](/docs/{{version}}/mail)를 먼저 설정해야 합니다.

```php
Schedule::command('report:generate')
    ->daily()
    ->sendOutputTo($filePath)
    ->emailOutputTo('taylor@example.com');
```

예약된 Artisan 또는 시스템 명령이 0이 아닌 종료 코드로 종료될 때만 출력을 이메일로 보내고 싶다면, `emailOutputOnFailure` 메서드를 사용하세요.

```php
Schedule::command('report:generate')
    ->daily()
    ->emailOutputOnFailure('taylor@example.com');
```

> [!WARNING]
> `emailOutputTo`, `emailOutputOnFailure`, `sendOutputTo`, `appendOutputTo` 메서드는 `command` 및 `exec` 메서드에서만 사용할 수 있습니다.


## 작업 훅 {#task-hooks}

`before`와 `after` 메서드를 사용하여 예약된 작업이 실행되기 전과 후에 실행할 코드를 지정할 수 있습니다:

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

`onSuccess`와 `onFailure` 메서드를 사용하면 예약된 작업이 성공하거나 실패했을 때 실행할 코드를 지정할 수 있습니다. 실패란 예약된 Artisan 또는 시스템 명령이 0이 아닌 종료 코드로 종료된 경우를 의미합니다:

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

명령에서 출력 결과가 있는 경우, `after`, `onSuccess`, `onFailure` 훅의 클로저 정의에서 `$output` 인수로 `Illuminate\Support\Stringable` 인스턴스를 타입힌트하여 해당 출력을 확인할 수 있습니다:

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


#### URL 핑(Pinging URLs) {#pinging-urls}

`schedule`에서 `pingBefore`와 `thenPing` 메서드를 사용하면, 작업이 실행되기 전이나 후에 지정한 URL로 자동으로 핑(ping)을 보낼 수 있습니다. 이 방법은 [Envoyer](https://envoyer.io)와 같은 외부 서비스에 예약된 작업이 시작되었거나 완료되었음을 알릴 때 유용합니다.

```php
Schedule::command('emails:send')
    ->daily()
    ->pingBefore($url)
    ->thenPing($url);
```

`pingOnSuccess`와 `pingOnFailure` 메서드는 작업이 성공하거나 실패했을 때에만 지정한 URL로 핑을 보낼 수 있습니다. 실패는 예약된 Artisan 또는 시스템 명령이 0이 아닌 종료 코드로 종료된 경우를 의미합니다.

```php
Schedule::command('emails:send')
    ->daily()
    ->pingOnSuccess($successUrl)
    ->pingOnFailure($failureUrl);
```

`pingBeforeIf`, `thenPingIf`, `pingOnSuccessIf`, `pingOnFailureIf` 메서드는 주어진 조건이 `true`일 때에만 지정한 URL로 핑을 보낼 수 있습니다.

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

Laravel은 스케줄링 과정에서 다양한 [이벤트](/docs/{{version}}/events)를 디스패치합니다. 아래의 이벤트들에 대해 [리스너를 정의](/docs/{{version}}/events)할 수 있습니다:

<div class="overflow-auto">

| 이벤트 이름                                                      |
|-------------------------------------------------------------|
| `Illuminate\Console\Events\ScheduledTaskStarting`           |
| `Illuminate\Console\Events\ScheduledTaskFinished`           |
| `Illuminate\Console\Events\ScheduledBackgroundTaskFinished` |
| `Illuminate\Console\Events\ScheduledTaskSkipped`            |
| `Illuminate\Console\Events\ScheduledTaskFailed`             |

</div>
