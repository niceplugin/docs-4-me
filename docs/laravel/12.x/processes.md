# 프로세스






















## 소개 {#introduction}

Laravel은 [Symfony Process 컴포넌트](https://symfony.com/doc/current/components/process.html)를 기반으로 한 간결하고 표현력 있는 API를 제공하여, Laravel 애플리케이션에서 외부 프로세스를 편리하게 실행할 수 있도록 해줍니다. Laravel의 프로세스 기능은 가장 일반적인 사용 사례와 뛰어난 개발자 경험에 초점을 맞추고 있습니다.


## 프로세스 실행 {#invoking-processes}

프로세스를 실행하려면 `Process` 파사드에서 제공하는 `run` 및 `start` 메서드를 사용할 수 있습니다. `run` 메서드는 프로세스를 실행하고 완료될 때까지 기다리며, `start` 메서드는 비동기적으로 프로세스를 실행할 때 사용합니다. 이 문서에서는 두 가지 접근 방식을 모두 살펴봅니다. 먼저, 기본적인 동기 프로세스를 실행하고 결과를 확인하는 방법을 살펴보겠습니다:

```php
use Illuminate\Support\Facades\Process;

$result = Process::run('ls -la');

return $result->output();
```

물론, `run` 메서드가 반환하는 `Illuminate\Contracts\Process\ProcessResult` 인스턴스는 프로세스 결과를 확인할 수 있는 다양한 유용한 메서드를 제공합니다:

```php
$result = Process::run('ls -la');

$result->successful();
$result->failed();
$result->exitCode();
$result->output();
$result->errorOutput();
```


#### 예외 발생 {#throwing-exceptions}

프로세스 결과가 있고, 종료 코드가 0보다 크면(즉, 실패를 의미) `Illuminate\Process\Exceptions\ProcessFailedException` 예외를 발생시키고 싶다면, `throw` 및 `throwIf` 메서드를 사용할 수 있습니다. 프로세스가 실패하지 않았다면 프로세스 결과 인스턴스가 반환됩니다:

```php
$result = Process::run('ls -la')->throw();

$result = Process::run('ls -la')->throwIf($condition);
```


### 프로세스 옵션 {#process-options}

물론, 프로세스를 실행하기 전에 동작을 커스터마이즈해야 할 수도 있습니다. 다행히도 Laravel은 작업 디렉터리, 타임아웃, 환경 변수 등 다양한 프로세스 기능을 조정할 수 있도록 해줍니다.


#### 작업 디렉터리 경로 {#working-directory-path}

`path` 메서드를 사용하여 프로세스의 작업 디렉터리를 지정할 수 있습니다. 이 메서드를 호출하지 않으면, 현재 실행 중인 PHP 스크립트의 작업 디렉터리를 상속받습니다:

```php
$result = Process::path(__DIR__)->run('ls -la');
```


#### 입력값 {#input}

`input` 메서드를 사용하여 프로세스의 "표준 입력"을 통해 입력값을 제공할 수 있습니다:

```php
$result = Process::input('Hello World')->run('cat');
```


#### 타임아웃 {#timeouts}

기본적으로 프로세스는 60초 이상 실행되면 `Illuminate\Process\Exceptions\ProcessTimedOutException` 인스턴스를 발생시킵니다. 하지만 `timeout` 메서드를 통해 이 동작을 커스터마이즈할 수 있습니다:

```php
$result = Process::timeout(120)->run('bash import.sh');
```

또는, 프로세스 타임아웃을 완전히 비활성화하고 싶다면 `forever` 메서드를 호출할 수 있습니다:

```php
$result = Process::forever()->run('bash import.sh');
```

`idleTimeout` 메서드는 프로세스가 아무런 출력을 반환하지 않고 실행될 수 있는 최대 초를 지정할 때 사용할 수 있습니다:

```php
$result = Process::timeout(60)->idleTimeout(30)->run('bash import.sh');
```


#### 환경 변수 {#environment-variables}

`env` 메서드를 통해 프로세스에 환경 변수를 제공할 수 있습니다. 실행된 프로세스는 시스템에 정의된 모든 환경 변수도 상속받습니다:

```php
$result = Process::forever()
    ->env(['IMPORT_PATH' => __DIR__])
    ->run('bash import.sh');
```

상속된 환경 변수를 실행된 프로세스에서 제거하고 싶다면, 해당 환경 변수에 `false` 값을 지정하면 됩니다:

```php
$result = Process::forever()
    ->env(['LOAD_PATH' => false])
    ->run('bash import.sh');
```


#### TTY 모드 {#tty-mode}

`tty` 메서드를 사용하여 프로세스에 TTY 모드를 활성화할 수 있습니다. TTY 모드는 프로세스의 입력과 출력을 프로그램의 입력 및 출력에 연결하여, Vim이나 Nano와 같은 에디터를 프로세스로 열 수 있게 해줍니다:

```php
Process::forever()->tty()->run('vim');
```


### 프로세스 출력 {#process-output}

앞서 설명한 것처럼, 프로세스 결과의 `output`(stdout) 및 `errorOutput`(stderr) 메서드를 사용하여 프로세스 출력을 확인할 수 있습니다:

```php
use Illuminate\Support\Facades\Process;

$result = Process::run('ls -la');

echo $result->output();
echo $result->errorOutput();
```

하지만, `run` 메서드의 두 번째 인자로 클로저를 전달하면 실시간으로 출력을 수집할 수도 있습니다. 이 클로저는 "출력 타입"(`stdout` 또는 `stderr`)과 출력 문자열 두 개의 인자를 받습니다:

```php
$result = Process::run('ls -la', function (string $type, string $output) {
    echo $output;
});
```

Laravel은 또한 `seeInOutput` 및 `seeInErrorOutput` 메서드를 제공하여, 특정 문자열이 프로세스 출력에 포함되어 있는지 쉽게 확인할 수 있습니다:

```php
if (Process::run('ls -la')->seeInOutput('laravel')) {
    // ...
}
```


#### 프로세스 출력 비활성화 {#disabling-process-output}

프로세스가 많은 양의 출력을 생성하지만 그 결과에 관심이 없다면, 출력을 완전히 비활성화하여 메모리를 절약할 수 있습니다. 이를 위해 프로세스를 빌드할 때 `quietly` 메서드를 호출하면 됩니다:

```php
use Illuminate\Support\Facades\Process;

$result = Process::quietly()->run('bash import.sh');
```


### 파이프라인 {#process-pipelines}

때로는 한 프로세스의 출력을 다른 프로세스의 입력으로 사용하고 싶을 수 있습니다. 이는 흔히 프로세스의 출력을 다른 프로세스로 "파이프"한다고 부릅니다. `Process` 파사드에서 제공하는 `pipe` 메서드를 사용하면 이를 쉽게 구현할 수 있습니다. `pipe` 메서드는 파이프된 프로세스들을 동기적으로 실행하고, 파이프라인의 마지막 프로세스 결과를 반환합니다:

```php
use Illuminate\Process\Pipe;
use Illuminate\Support\Facades\Process;

$result = Process::pipe(function (Pipe $pipe) {
    $pipe->command('cat example.txt');
    $pipe->command('grep -i "laravel"');
});

if ($result->successful()) {
    // ...
}
```

파이프라인을 구성하는 개별 프로세스를 커스터마이즈할 필요가 없다면, 명령어 문자열 배열을 `pipe` 메서드에 바로 전달할 수 있습니다:

```php
$result = Process::pipe([
    'cat example.txt',
    'grep -i "laravel"',
]);
```

`pipe` 메서드의 두 번째 인자로 클로저를 전달하면, 파이프라인의 프로세스 출력을 실시간으로 수집할 수 있습니다. 이 클로저는 "출력 타입"(`stdout` 또는 `stderr`)과 출력 문자열 두 개의 인자를 받습니다:

```php
$result = Process::pipe(function (Pipe $pipe) {
    $pipe->command('cat example.txt');
    $pipe->command('grep -i "laravel"');
}, function (string $type, string $output) {
    echo $output;
});
```

Laravel은 또한 `as` 메서드를 통해 파이프라인 내 각 프로세스에 문자열 키를 할당할 수 있도록 해줍니다. 이 키는 `pipe` 메서드에 제공된 출력 클로저에도 전달되어, 어떤 프로세스의 출력인지 구분할 수 있습니다:

```php
$result = Process::pipe(function (Pipe $pipe) {
    $pipe->as('first')->command('cat example.txt');
    $pipe->as('second')->command('grep -i "laravel"');
})->start(function (string $type, string $output, string $key) {
    // ...
});
```


## 비동기 프로세스 {#asynchronous-processes}

`run` 메서드는 프로세스를 동기적으로 실행하지만, `start` 메서드를 사용하면 비동기적으로 프로세스를 실행할 수 있습니다. 이를 통해 애플리케이션이 프로세스가 백그라운드에서 실행되는 동안 다른 작업을 계속 수행할 수 있습니다. 프로세스가 실행된 후에는 `running` 메서드를 사용하여 프로세스가 아직 실행 중인지 확인할 수 있습니다:

```php
$process = Process::timeout(120)->start('bash import.sh');

while ($process->running()) {
    // ...
}

$result = $process->wait();
```

보시다시피, `wait` 메서드를 호출하여 프로세스가 실행을 마칠 때까지 기다리고 프로세스 결과 인스턴스를 가져올 수 있습니다:

```php
$process = Process::timeout(120)->start('bash import.sh');

// ...

$result = $process->wait();
```


### 프로세스 ID와 시그널 {#process-ids-and-signals}

`id` 메서드를 사용하여 실행 중인 프로세스의 운영체제 할당 프로세스 ID를 가져올 수 있습니다:

```php
$process = Process::start('bash import.sh');

return $process->id();
```

`signal` 메서드를 사용하여 실행 중인 프로세스에 "시그널"을 보낼 수 있습니다. 미리 정의된 시그널 상수 목록은 [PHP 문서](https://www.php.net/manual/en/pcntl.constants.php)에서 확인할 수 있습니다:

```php
$process->signal(SIGUSR2);
```


### 비동기 프로세스 출력 {#asynchronous-process-output}

비동기 프로세스가 실행 중일 때, `output` 및 `errorOutput` 메서드를 사용하여 현재까지의 전체 출력을 확인할 수 있습니다. 하지만, `latestOutput` 및 `latestErrorOutput`을 사용하면 마지막으로 출력을 가져온 이후의 출력만 확인할 수 있습니다:

```php
$process = Process::timeout(120)->start('bash import.sh');

while ($process->running()) {
    echo $process->latestOutput();
    echo $process->latestErrorOutput();

    sleep(1);
}
```

`run` 메서드와 마찬가지로, `start` 메서드의 두 번째 인자로 클로저를 전달하면 비동기 프로세스의 출력을 실시간으로 수집할 수 있습니다. 이 클로저는 "출력 타입"(`stdout` 또는 `stderr`)과 출력 문자열 두 개의 인자를 받습니다:

```php
$process = Process::start('bash import.sh', function (string $type, string $output) {
    echo $output;
});

$result = $process->wait();
```

프로세스가 끝날 때까지 기다리는 대신, `waitUntil` 메서드를 사용하여 프로세스 출력에 따라 대기를 중단할 수 있습니다. `waitUntil` 메서드에 전달된 클로저가 `true`를 반환하면 Laravel은 프로세스가 끝나기를 기다리는 것을 중단합니다:

```php
$process = Process::start('bash import.sh');

$process->waitUntil(function (string $type, string $output) {
    return $output === 'Ready...';
});
```


### 비동기 프로세스 타임아웃 {#asynchronous-process-timeouts}

비동기 프로세스가 실행 중일 때, `ensureNotTimedOut` 메서드를 사용하여 프로세스가 타임아웃되지 않았는지 확인할 수 있습니다. 이 메서드는 프로세스가 타임아웃된 경우 [타임아웃 예외](#timeouts)를 발생시킵니다:

```php
$process = Process::timeout(120)->start('bash import.sh');

while ($process->running()) {
    $process->ensureNotTimedOut();

    // ...

    sleep(1);
}
```


## 동시 프로세스 {#concurrent-processes}

Laravel은 동시 비동기 프로세스 풀을 쉽게 관리할 수 있도록 하여, 여러 작업을 동시에 손쉽게 실행할 수 있게 해줍니다. 시작하려면, `Illuminate\Process\Pool` 인스턴스를 받는 클로저를 인자로 하는 `pool` 메서드를 호출하세요.

이 클로저 내에서 풀에 속하는 프로세스를 정의할 수 있습니다. 프로세스 풀이 `start` 메서드를 통해 시작되면, `running` 메서드를 통해 실행 중인 프로세스의 [컬렉션](/laravel/12.x/collections)에 접근할 수 있습니다:

```php
use Illuminate\Process\Pool;
use Illuminate\Support\Facades\Process;

$pool = Process::pool(function (Pool $pool) {
    $pool->path(__DIR__)->command('bash import-1.sh');
    $pool->path(__DIR__)->command('bash import-2.sh');
    $pool->path(__DIR__)->command('bash import-3.sh');
})->start(function (string $type, string $output, int $key) {
    // ...
});

while ($pool->running()->isNotEmpty()) {
    // ...
}

$results = $pool->wait();
```

보시다시피, `wait` 메서드를 통해 모든 풀 프로세스가 실행을 마칠 때까지 기다리고 결과를 확인할 수 있습니다. `wait` 메서드는 배열 접근이 가능한 객체를 반환하며, 각 프로세스의 키로 풀 내 프로세스 결과 인스턴스에 접근할 수 있습니다:

```php
$results = $pool->wait();

echo $results[0]->output();
```

또는, 편의를 위해 `concurrently` 메서드를 사용하여 비동기 프로세스 풀을 시작하고 즉시 결과를 기다릴 수 있습니다. 이는 PHP의 배열 구조 분해 기능과 결합하면 매우 표현력 있는 문법을 제공합니다:

```php
[$first, $second, $third] = Process::concurrently(function (Pool $pool) {
    $pool->path(__DIR__)->command('ls -la');
    $pool->path(app_path())->command('ls -la');
    $pool->path(storage_path())->command('ls -la');
});

echo $first->output();
```


### 풀 프로세스 이름 지정 {#naming-pool-processes}

숫자 키로 프로세스 풀 결과에 접근하는 것은 그리 직관적이지 않으므로, Laravel은 `as` 메서드를 통해 풀 내 각 프로세스에 문자열 키를 할당할 수 있도록 해줍니다. 이 키는 `start` 메서드에 제공된 클로저에도 전달되어, 어떤 프로세스의 출력인지 구분할 수 있습니다:

```php
$pool = Process::pool(function (Pool $pool) {
    $pool->as('first')->command('bash import-1.sh');
    $pool->as('second')->command('bash import-2.sh');
    $pool->as('third')->command('bash import-3.sh');
})->start(function (string $type, string $output, string $key) {
    // ...
});

$results = $pool->wait();

return $results['first']->output();
```


### 풀 프로세스 ID와 시그널 {#pool-process-ids-and-signals}

프로세스 풀의 `running` 메서드는 풀 내에서 실행된 모든 프로세스의 컬렉션을 제공하므로, 풀 프로세스의 ID에 쉽게 접근할 수 있습니다:

```php
$processIds = $pool->running()->each->id();
```

또한, 편의를 위해 프로세스 풀에서 `signal` 메서드를 호출하여 풀 내 모든 프로세스에 시그널을 보낼 수 있습니다:

```php
$pool->signal(SIGUSR2);
```


## 테스트 {#testing}

많은 Laravel 서비스는 테스트를 쉽고 표현력 있게 작성할 수 있도록 기능을 제공하며, Laravel의 프로세스 서비스도 예외는 아닙니다. `Process` 파사드의 `fake` 메서드를 사용하면 프로세스가 실행될 때 스텁/더미 결과를 반환하도록 Laravel에 지시할 수 있습니다.


### 프로세스 페이크 {#faking-processes}

Laravel의 프로세스 페이크 기능을 살펴보기 위해, 프로세스를 실행하는 라우트를 가정해봅시다:

```php
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Route;

Route::get('/import', function () {
    Process::run('bash import.sh');

    return 'Import complete!';
});
```

이 라우트를 테스트할 때, `Process` 파사드의 `fake` 메서드를 인자 없이 호출하면 모든 실행된 프로세스에 대해 페이크 성공 결과를 반환하도록 Laravel에 지시할 수 있습니다. 또한, 주어진 프로세스가 "실행"되었는지 [assert](#available-assertions)로 검증할 수도 있습니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Process\PendingProcess;
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Support\Facades\Process;

test('process is invoked', function () {
    Process::fake();

    $response = $this->get('/import');

    // 간단한 프로세스 어서션...
    Process::assertRan('bash import.sh');

    // 또는, 프로세스 설정을 검사...
    Process::assertRan(function (PendingProcess $process, ProcessResult $result) {
        return $process->command === 'bash import.sh' &&
               $process->timeout === 60;
    });
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Illuminate\Process\PendingProcess;
use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Support\Facades\Process;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_process_is_invoked(): void
    {
        Process::fake();

        $response = $this->get('/import');

        // 간단한 프로세스 어서션...
        Process::assertRan('bash import.sh');

        // 또는, 프로세스 설정을 검사...
        Process::assertRan(function (PendingProcess $process, ProcessResult $result) {
            return $process->command === 'bash import.sh' &&
                   $process->timeout === 60;
        });
    }
}
```
:::
설명한 대로, `Process` 파사드의 `fake` 메서드를 호출하면 항상 출력이 없는 성공적인 프로세스 결과를 반환하도록 Laravel에 지시합니다. 하지만, `Process` 파사드의 `result` 메서드를 사용하여 페이크 프로세스의 출력과 종료 코드를 쉽게 지정할 수 있습니다:

```php
Process::fake([
    '*' => Process::result(
        output: 'Test output',
        errorOutput: 'Test error output',
        exitCode: 1,
    ),
]);
```


### 특정 프로세스 페이크 {#faking-specific-processes}

앞선 예제에서 볼 수 있듯이, `Process` 파사드는 배열을 `fake` 메서드에 전달하여 프로세스별로 다른 페이크 결과를 지정할 수 있습니다.

배열의 키는 페이크하고자 하는 명령 패턴을 나타내며, 값은 해당 결과입니다. `*` 문자는 와일드카드로 사용할 수 있습니다. 페이크되지 않은 프로세스 명령은 실제로 실행됩니다. 이러한 명령에 대한 스텁/페이크 결과는 `Process` 파사드의 `result` 메서드를 사용해 만들 수 있습니다:

```php
Process::fake([
    'cat *' => Process::result(
        output: 'Test "cat" output',
    ),
    'ls *' => Process::result(
        output: 'Test "ls" output',
    ),
]);
```

페이크 프로세스의 종료 코드나 에러 출력을 커스터마이즈할 필요가 없다면, 페이크 프로세스 결과를 간단한 문자열로 지정하는 것이 더 편리할 수 있습니다:

```php
Process::fake([
    'cat *' => 'Test "cat" output',
    'ls *' => 'Test "ls" output',
]);
```


### 프로세스 시퀀스 페이크 {#faking-process-sequences}

테스트 중인 코드가 동일한 명령으로 여러 프로세스를 실행한다면, 각 프로세스 실행마다 다른 페이크 결과를 할당하고 싶을 수 있습니다. 이를 위해 `Process` 파사드의 `sequence` 메서드를 사용할 수 있습니다:

```php
Process::fake([
    'ls *' => Process::sequence()
        ->push(Process::result('First invocation'))
        ->push(Process::result('Second invocation')),
]);
```


### 비동기 프로세스 라이프사이클 페이크 {#faking-asynchronous-process-lifecycles}

지금까지는 주로 `run` 메서드를 사용해 동기적으로 실행되는 프로세스의 페이크에 대해 다뤘습니다. 하지만, `start`를 통해 비동기적으로 실행되는 프로세스와 상호작용하는 코드를 테스트하려면 더 정교한 페이크가 필요할 수 있습니다.

예를 들어, 다음과 같이 비동기 프로세스와 상호작용하는 라우트를 가정해봅시다:

```php
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/import', function () {
    $process = Process::start('bash import.sh');

    while ($process->running()) {
        Log::info($process->latestOutput());
        Log::info($process->latestErrorOutput());
    }

    return 'Done';
});
```

이 프로세스를 제대로 페이크하려면, `running` 메서드가 몇 번 `true`를 반환해야 하는지 지정할 수 있어야 합니다. 또한, 순차적으로 반환될 여러 줄의 출력을 지정하고 싶을 수도 있습니다. 이를 위해 `Process` 파사드의 `describe` 메서드를 사용할 수 있습니다:

```php
Process::fake([
    'bash import.sh' => Process::describe()
        ->output('First line of standard output')
        ->errorOutput('First line of error output')
        ->output('Second line of standard output')
        ->exitCode(0)
        ->iterations(3),
]);
```

위 예제를 살펴보면, `output` 및 `errorOutput` 메서드를 사용해 순차적으로 반환될 여러 줄의 출력을 지정할 수 있습니다. `exitCode` 메서드는 페이크 프로세스의 최종 종료 코드를 지정하는 데 사용됩니다. 마지막으로, `iterations` 메서드는 `running` 메서드가 몇 번 `true`를 반환할지 지정하는 데 사용됩니다.


### 사용 가능한 어서션 {#available-assertions}

[앞서 설명한 대로](#faking-processes), Laravel은 기능 테스트를 위한 여러 프로세스 어서션을 제공합니다. 아래에서 각 어서션에 대해 살펴보겠습니다.


#### assertRan {#assert-process-ran}

주어진 프로세스가 실행되었는지 어서트합니다:

```php
use Illuminate\Support\Facades\Process;

Process::assertRan('ls -la');
```

`assertRan` 메서드는 클로저도 받을 수 있으며, 이 클로저는 프로세스 인스턴스와 프로세스 결과를 받아 프로세스의 설정 옵션을 검사할 수 있습니다. 이 클로저가 `true`를 반환하면 어서션이 "통과"합니다:

```php
Process::assertRan(fn ($process, $result) =>
    $process->command === 'ls -la' &&
    $process->path === __DIR__ &&
    $process->timeout === 60
);
```

`assertRan` 클로저에 전달되는 `$process`는 `Illuminate\Process\PendingProcess`의 인스턴스이고, `$result`는 `Illuminate\Contracts\Process\ProcessResult`의 인스턴스입니다.


#### assertDidntRun {#assert-process-didnt-run}

주어진 프로세스가 실행되지 않았는지 어서트합니다:

```php
use Illuminate\Support\Facades\Process;

Process::assertDidntRun('ls -la');
```

`assertRan` 메서드와 마찬가지로, `assertDidntRun` 메서드도 클로저를 받을 수 있으며, 이 클로저가 `true`를 반환하면 어서션이 "실패"합니다:

```php
Process::assertDidntRun(fn (PendingProcess $process, ProcessResult $result) =>
    $process->command === 'ls -la'
);
```


#### assertRanTimes {#assert-process-ran-times}

주어진 프로세스가 지정된 횟수만큼 실행되었는지 어서트합니다:

```php
use Illuminate\Support\Facades\Process;

Process::assertRanTimes('ls -la', times: 3);
```

`assertRanTimes` 메서드도 클로저를 받을 수 있으며, 이 클로저가 `true`를 반환하고 프로세스가 지정된 횟수만큼 실행되었다면 어서션이 "통과"합니다:

```php
Process::assertRanTimes(function (PendingProcess $process, ProcessResult $result) {
    return $process->command === 'ls -la';
}, times: 3);
```


### 불필요한 프로세스 방지 {#preventing-stray-processes}

개별 테스트 또는 전체 테스트 스위트에서 실행된 모든 프로세스가 페이크되었는지 보장하고 싶다면, `preventStrayProcesses` 메서드를 호출할 수 있습니다. 이 메서드를 호출한 후에는, 페이크 결과가 없는 프로세스가 실제로 실행되는 대신 예외가 발생합니다:

```php
use Illuminate\Support\Facades\Process;

Process::preventStrayProcesses();

Process::fake([
    'ls *' => 'Test output...',
]);

// 페이크 응답이 반환됨...
Process::run('ls -la');

// 예외가 발생함...
Process::run('bash import.sh');
```
