# 콘솔 테스트







## 소개 {#introduction}

HTTP 테스트를 간소화하는 것 외에도, Laravel은 애플리케이션의 [커스텀 콘솔 명령어](/laravel/12.x/artisan)를 테스트할 수 있는 간단한 API를 제공합니다.


## 성공 / 실패 기대값 {#success-failure-expectations}

먼저, Artisan 명령어의 종료 코드에 대한 어설션을 어떻게 작성하는지 살펴보겠습니다. 이를 위해 테스트에서 `artisan` 메서드를 사용해 Artisan 명령어를 호출한 뒤, `assertExitCode` 메서드로 명령어가 특정 종료 코드로 완료되었는지 검증할 수 있습니다:
::: code-group
```php [Pest]
test('console command', function () {
    $this->artisan('inspire')->assertExitCode(0);
});
```

```php [PHPUnit]
/**
 * 콘솔 명령어 테스트.
 */
public function test_console_command(): void
{
    $this->artisan('inspire')->assertExitCode(0);
}
```
:::
`assertNotExitCode` 메서드를 사용하면 명령어가 특정 종료 코드로 종료되지 않았는지 검증할 수 있습니다:

```php
$this->artisan('inspire')->assertNotExitCode(1);
```

물론, 모든 터미널 명령어는 일반적으로 성공 시 `0`의 상태 코드로 종료되고, 실패 시 0이 아닌 종료 코드로 종료됩니다. 따라서 편의를 위해, `assertSuccessful`과 `assertFailed` 어설션을 사용해 명령어가 성공적으로 종료되었는지 또는 실패했는지 검증할 수 있습니다:

```php
$this->artisan('inspire')->assertSuccessful();

$this->artisan('inspire')->assertFailed();
```


## 입력 / 출력 기대값 {#input-output-expectations}

Laravel은 `expectsQuestion` 메서드를 사용해 콘솔 명령어의 사용자 입력을 손쉽게 "모킹"할 수 있도록 지원합니다. 또한, `assertExitCode`와 `expectsOutput` 메서드를 사용해 콘솔 명령어가 출력할 것으로 기대되는 종료 코드와 텍스트를 지정할 수 있습니다. 예를 들어, 다음과 같은 콘솔 명령어가 있다고 가정해봅시다:

```php
Artisan::command('question', function () {
    $name = $this->ask('What is your name?');

    $language = $this->choice('Which language do you prefer?', [
        'PHP',
        'Ruby',
        'Python',
    ]);

    $this->line('Your name is '.$name.' and you prefer '.$language.'.');
});
```

이 명령어는 다음과 같은 테스트로 검증할 수 있습니다:
::: code-group
```php [Pest]
test('console command', function () {
    $this->artisan('question')
        ->expectsQuestion('What is your name?', 'Taylor Otwell')
        ->expectsQuestion('Which language do you prefer?', 'PHP')
        ->expectsOutput('Your name is Taylor Otwell and you prefer PHP.')
        ->doesntExpectOutput('Your name is Taylor Otwell and you prefer Ruby.')
        ->assertExitCode(0);
});
```

```php [PHPUnit]
/**
 * 콘솔 명령어 테스트.
 */
public function test_console_command(): void
{
    $this->artisan('question')
        ->expectsQuestion('What is your name?', 'Taylor Otwell')
        ->expectsQuestion('Which language do you prefer?', 'PHP')
        ->expectsOutput('Your name is Taylor Otwell and you prefer PHP.')
        ->doesntExpectOutput('Your name is Taylor Otwell and you prefer Ruby.')
        ->assertExitCode(0);
}
```
:::
[Laravel Prompts](/laravel/12.x/prompts)에서 제공하는 `search` 또는 `multisearch` 기능을 사용하는 경우, `expectsSearch` 어설션을 사용해 사용자의 입력, 검색 결과, 선택값을 모킹할 수 있습니다:
::: code-group
```php [Pest]
test('console command', function () {
    $this->artisan('example')
        ->expectsSearch('What is your name?', search: 'Tay', answers: [
            'Taylor Otwell',
            'Taylor Swift',
            'Darian Taylor'
        ], answer: 'Taylor Otwell')
        ->assertExitCode(0);
});
```

```php [PHPUnit]
/**
 * 콘솔 명령어 테스트.
 */
public function test_console_command(): void
{
    $this->artisan('example')
        ->expectsSearch('What is your name?', search: 'Tay', answers: [
            'Taylor Otwell',
            'Taylor Swift',
            'Darian Taylor'
        ], answer: 'Taylor Otwell')
        ->assertExitCode(0);
}
```
:::
또한, `doesntExpectOutput` 메서드를 사용해 콘솔 명령어가 아무런 출력을 생성하지 않는지 검증할 수도 있습니다:
::: code-group
```php [Pest]
test('console command', function () {
    $this->artisan('example')
        ->doesntExpectOutput()
        ->assertExitCode(0);
});
```

```php [PHPUnit]
/**
 * 콘솔 명령어 테스트.
 */
public function test_console_command(): void
{
    $this->artisan('example')
        ->doesntExpectOutput()
        ->assertExitCode(0);
}
```
:::
`expectsOutputToContain`과 `doesntExpectOutputToContain` 메서드는 출력의 일부에 대해 어설션을 작성할 때 사용할 수 있습니다:
::: code-group
```php [Pest]
test('console command', function () {
    $this->artisan('example')
        ->expectsOutputToContain('Taylor')
        ->assertExitCode(0);
});
```

```php [PHPUnit]
/**
 * 콘솔 명령어 테스트.
 */
public function test_console_command(): void
{
    $this->artisan('example')
        ->expectsOutputToContain('Taylor')
        ->assertExitCode(0);
}
```
:::

#### 확인(Confirmation) 기대값 {#confirmation-expectations}

"예" 또는 "아니오" 형태의 확인을 요구하는 명령어를 작성할 때는 `expectsConfirmation` 메서드를 사용할 수 있습니다:

```php
$this->artisan('module:import')
    ->expectsConfirmation('Do you really wish to run this command?', 'no')
    ->assertExitCode(1);
```


#### 테이블 기대값 {#table-expectations}

명령어가 Artisan의 `table` 메서드를 사용해 정보를 테이블 형태로 출력하는 경우, 전체 테이블에 대한 출력 기대값을 작성하는 것은 번거로울 수 있습니다. 이럴 때는 `expectsTable` 메서드를 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 테이블의 헤더, 두 번째 인자로 테이블의 데이터를 받습니다:

```php
$this->artisan('users:all')
    ->expectsTable([
        'ID',
        'Email',
    ], [
        [1, 'taylor@example.com'],
        [2, 'abigail@example.com'],
    ]);
```


## 콘솔 이벤트 {#console-events}

기본적으로, 애플리케이션 테스트를 실행할 때 `Illuminate\Console\Events\CommandStarting` 및 `Illuminate\Console\Events\CommandFinished` 이벤트는 디스패치되지 않습니다. 하지만, 테스트 클래스에 `Illuminate\Foundation\Testing\WithConsoleEvents` 트레이트를 추가하면 해당 이벤트를 활성화할 수 있습니다:
::: code-group
```php [Pest]
<?php

use Illuminate\Foundation\Testing\WithConsoleEvents;

uses(WithConsoleEvents::class);

// ...
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithConsoleEvents;
use Tests\TestCase;

class ConsoleEventTest extends TestCase
{
    use WithConsoleEvents;

    // ...
}
```
:::