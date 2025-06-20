# 아티즌 콘솔


























## 소개 {#introduction}

Artisan은 Laravel에 포함된 명령줄 인터페이스입니다. Artisan은 애플리케이션의 루트에 `artisan` 스크립트로 존재하며, 애플리케이션을 개발할 때 유용한 다양한 명령어를 제공합니다. 사용 가능한 모든 Artisan 명령어 목록을 보려면 `list` 명령어를 사용할 수 있습니다:

```shell
php artisan list
```

모든 명령어에는 명령어의 사용 가능한 인자와 옵션을 표시하고 설명하는 "도움말" 화면이 포함되어 있습니다. 도움말 화면을 보려면 명령어 이름 앞에 `help`를 붙이세요:

```shell
php artisan help migrate
```


#### Laravel Sail {#laravel-sail}

[Laravel Sail](/laravel/12.x/sail)을 로컬 개발 환경으로 사용하는 경우, Artisan 명령어를 실행할 때 `sail` 명령줄을 사용해야 합니다. Sail은 애플리케이션의 Docker 컨테이너 내에서 Artisan 명령어를 실행합니다:

```shell
./vendor/bin/sail artisan list
```


### Tinker (REPL) {#tinker}

[Laravel Tinker](https://github.com/laravel/tinker)는 [PsySH](https://github.com/bobthecow/psysh) 패키지로 구동되는 Laravel 프레임워크용 강력한 REPL입니다.


#### 설치 {#installation}

모든 Laravel 애플리케이션에는 기본적으로 Tinker가 포함되어 있습니다. 그러나 애플리케이션에서 Tinker를 제거한 경우 Composer를 사용하여 다시 설치할 수 있습니다:

```shell
composer require laravel/tinker
```

> [!NOTE]
> Laravel 애플리케이션과 상호작용할 때 핫 리로딩, 멀티라인 코드 편집, 자동완성을 원하시나요? [Tinkerwell](https://tinkerwell.app)을 확인해보세요!


#### 사용법 {#usage}

Tinker를 사용하면 Eloquent 모델, 작업, 이벤트 등 전체 Laravel 애플리케이션과 명령줄에서 상호작용할 수 있습니다. Tinker 환경에 진입하려면 `tinker` Artisan 명령어를 실행하세요:

```shell
php artisan tinker
```

`vendor:publish` 명령어를 사용하여 Tinker의 설정 파일을 퍼블리시할 수 있습니다:

```shell
php artisan vendor:publish --provider="Laravel\Tinker\TinkerServiceProvider"
```

> [!WARNING]
> `dispatch` 헬퍼 함수와 `Dispatchable` 클래스의 `dispatch` 메서드는 작업을 큐에 넣기 위해 가비지 컬렉션에 의존합니다. 따라서 tinker를 사용할 때는 작업을 디스패치할 때 `Bus::dispatch` 또는 `Queue::push`를 사용해야 합니다.


#### 명령어 허용 목록 {#command-allow-list}

Tinker는 "허용" 목록을 사용하여 셸 내에서 실행할 수 있는 Artisan 명령어를 결정합니다. 기본적으로 `clear-compiled`, `down`, `env`, `inspire`, `migrate`, `migrate:install`, `up`, `optimize` 명령어를 실행할 수 있습니다. 더 많은 명령어를 허용하려면 `tinker.php` 설정 파일의 `commands` 배열에 추가하면 됩니다:

```php
'commands' => [
    // App\Console\Commands\ExampleCommand::class,
],
```


#### 별칭을 만들지 않을 클래스 {#classes-that-should-not-be-aliased}

일반적으로 Tinker는 Tinker에서 상호작용하는 클래스에 대해 자동으로 별칭을 만듭니다. 그러나 일부 클래스는 절대 별칭을 만들지 않도록 할 수 있습니다. `tinker.php` 설정 파일의 `dont_alias` 배열에 클래스를 나열하면 됩니다:

```php
'dont_alias' => [
    App\Models\User::class,
],
```


## 명령어 작성하기 {#writing-commands}

Artisan에서 제공하는 명령어 외에도, 직접 커스텀 명령어를 만들 수 있습니다. 명령어는 일반적으로 `app/Console/Commands` 디렉터리에 저장되지만, [다른 디렉터리도 Artisan 명령어로 스캔](#registering-commands)하도록 Laravel에 지시하면 원하는 위치에 저장할 수 있습니다.


### 명령어 생성하기 {#generating-commands}

새 명령어를 만들려면 `make:command` Artisan 명령어를 사용할 수 있습니다. 이 명령어는 `app/Console/Commands` 디렉터리에 새 명령어 클래스를 생성합니다. 이 디렉터리가 애플리케이션에 없다면, `make:command` Artisan 명령어를 처음 실행할 때 자동으로 생성됩니다:

```shell
php artisan make:command SendEmails
```


### 명령어 구조 {#command-structure}

명령어를 생성한 후에는 클래스의 `signature`와 `description` 속성에 적절한 값을 정의해야 합니다. 이 속성들은 `list` 화면에 명령어를 표시할 때 사용됩니다. `signature` 속성을 통해 [명령어의 입력 기대값](#defining-input-expectations)도 정의할 수 있습니다. 명령어가 실행되면 `handle` 메서드가 호출됩니다. 이 메서드에 명령어의 로직을 작성하면 됩니다.

예시 명령어를 살펴보겠습니다. 명령어의 `handle` 메서드를 통해 필요한 의존성을 요청할 수 있습니다. Laravel [서비스 컨테이너](/laravel/12.x/container)는 이 메서드의 시그니처에 타입힌트된 모든 의존성을 자동으로 주입합니다:

```php
<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\DripEmailer;
use Illuminate\Console\Command;

class SendEmails extends Command
{
    /**
     * 콘솔 명령어의 이름과 시그니처.
     *
     * @var string
     */
    protected $signature = 'mail:send {user}';

    /**
     * 콘솔 명령어 설명.
     *
     * @var string
     */
    protected $description = 'Send a marketing email to a user';

    /**
     * 콘솔 명령어 실행.
     */
    public function handle(DripEmailer $drip): void
    {
        $drip->send(User::find($this->argument('user')));
    }
}
```

> [!NOTE]
> 코드 재사용성을 높이기 위해, 콘솔 명령어는 가볍게 유지하고 실제 작업은 애플리케이션 서비스에 위임하는 것이 좋습니다. 위 예시에서 이메일 전송의 "실질적인 작업"은 서비스 클래스를 주입하여 처리하고 있습니다.


#### 종료 코드 {#exit-codes}

`handle` 메서드에서 아무것도 반환하지 않고 명령어가 성공적으로 실행되면, 명령어는 성공을 나타내는 `0` 종료 코드로 종료됩니다. 그러나 `handle` 메서드에서 정수를 반환하여 명령어의 종료 코드를 수동으로 지정할 수도 있습니다:

```php
$this->error('Something went wrong.');

return 1;
```

명령어 내의 어떤 메서드에서든 명령어를 "실패" 상태로 종료하고 싶다면 `fail` 메서드를 사용할 수 있습니다. `fail` 메서드는 즉시 명령어 실행을 중단하고 종료 코드를 `1`로 반환합니다:

```php
$this->fail('Something went wrong.');
```


### 클로저 명령어 {#closure-commands}

클로저 기반 명령어는 콘솔 명령어를 클래스로 정의하는 것에 대한 대안입니다. 라우트 클로저가 컨트롤러의 대안인 것처럼, 명령어 클로저도 명령어 클래스의 대안으로 생각할 수 있습니다.

`routes/console.php` 파일은 HTTP 라우트를 정의하지 않지만, 애플리케이션에 대한 콘솔 기반 진입점(라우트)을 정의합니다. 이 파일 내에서 `Artisan::command` 메서드를 사용하여 모든 클로저 기반 콘솔 명령어를 정의할 수 있습니다. `command` 메서드는 [명령어 시그니처](#defining-input-expectations)와 명령어의 인자 및 옵션을 받는 클로저를 인수로 받습니다:

```php
Artisan::command('mail:send {user}', function (string $user) {
    $this->info("Sending email to: {$user}!");
});
```

클로저는 기본 명령어 인스턴스에 바인딩되므로, 전체 명령어 클래스에서 접근할 수 있는 모든 헬퍼 메서드를 사용할 수 있습니다.


#### 의존성 타입힌트 {#type-hinting-dependencies}

명령어의 인자와 옵션을 받을 뿐만 아니라, 명령어 클로저에서 [서비스 컨테이너](/laravel/12.x/container)에서 해결할 추가 의존성을 타입힌트로 지정할 수도 있습니다:

```php
use App\Models\User;
use App\Support\DripEmailer;

Artisan::command('mail:send {user}', function (DripEmailer $drip, string $user) {
    $drip->send(User::find($user));
});
```


#### 클로저 명령어 설명 {#closure-command-descriptions}

클로저 기반 명령어를 정의할 때, `purpose` 메서드를 사용하여 명령어에 설명을 추가할 수 있습니다. 이 설명은 `php artisan list` 또는 `php artisan help` 명령어를 실행할 때 표시됩니다:

```php
Artisan::command('mail:send {user}', function (string $user) {
    // ...
})->purpose('Send a marketing email to a user');
```


### Isolatable 명령어 {#isolatable-commands}

> [!WARNING]
> 이 기능을 사용하려면, 애플리케이션의 기본 캐시 드라이버로 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 중 하나를 사용해야 합니다. 또한 모든 서버가 동일한 중앙 캐시 서버와 통신해야 합니다.

때로는 한 번에 하나의 명령어 인스턴스만 실행되도록 보장하고 싶을 수 있습니다. 이를 위해 명령어 클래스에 `Illuminate\Contracts\Console\Isolatable` 인터페이스를 구현하면 됩니다:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;

class SendEmails extends Command implements Isolatable
{
    // ...
}
```

명령어를 `Isolatable`로 표시하면, 명령어의 옵션에 명시적으로 정의하지 않아도 Laravel이 자동으로 `--isolated` 옵션을 사용할 수 있게 만듭니다. 이 옵션과 함께 명령어를 실행하면, Laravel은 해당 명령어의 다른 인스턴스가 이미 실행 중인지 확인합니다. 이는 애플리케이션의 기본 캐시 드라이버를 사용하여 원자적 락을 획득하려 시도함으로써 이루어집니다. 다른 인스턴스가 실행 중이면 명령어는 실행되지 않지만, 성공적인 종료 상태 코드로 종료됩니다:

```shell
php artisan mail:send 1 --isolated
```

명령어가 실행되지 못할 때 반환할 종료 상태 코드를 지정하고 싶다면, `isolated` 옵션에 원하는 상태 코드를 지정할 수 있습니다:

```shell
php artisan mail:send 1 --isolated=12
```


#### 락 ID {#lock-id}

기본적으로 Laravel은 명령어의 이름을 사용하여 애플리케이션 캐시에서 원자적 락을 획득하는 데 사용되는 문자열 키를 생성합니다. 그러나 Artisan 명령어 클래스에 `isolatableId` 메서드를 정의하여 이 키를 커스터마이징할 수 있으며, 명령어의 인자나 옵션을 키에 통합할 수 있습니다:

```php
/**
 * 명령어의 isolatable ID를 반환.
 */
public function isolatableId(): string
{
    return $this->argument('user');
}
```


#### 락 만료 시간 {#lock-expiration-time}

기본적으로 isolation 락은 명령어가 끝나면 만료됩니다. 또는 명령어가 중단되어 끝나지 못한 경우, 락은 1시간 후에 만료됩니다. 그러나 명령어에 `isolationLockExpiresAt` 메서드를 정의하여 락 만료 시간을 조정할 수 있습니다:

```php
use DateTimeInterface;
use DateInterval;

/**
 * 명령어의 isolation 락 만료 시점 결정.
 */
public function isolationLockExpiresAt(): DateTimeInterface|DateInterval
{
    return now()->addMinutes(5);
}
```


## 입력 기대값 정의하기 {#defining-input-expectations}

콘솔 명령어를 작성할 때, 인자나 옵션을 통해 사용자로부터 입력을 받는 것이 일반적입니다. Laravel은 명령어의 `signature` 속성을 사용하여 사용자가 입력해야 하는 값을 매우 편리하게 정의할 수 있도록 해줍니다. `signature` 속성을 통해 명령어의 이름, 인자, 옵션을 한 번에, 직관적이고 라우트와 유사한 문법으로 정의할 수 있습니다.


### 인자(Arguments) {#arguments}

사용자가 제공하는 모든 인자와 옵션은 중괄호로 감쌉니다. 다음 예시에서 명령어는 하나의 필수 인자 `user`를 정의합니다:

```php
/**
 * 콘솔 명령어의 이름과 시그니처.
 *
 * @var string
 */
protected $signature = 'mail:send {user}';
```

인자를 선택적으로 만들거나, 인자에 기본값을 정의할 수도 있습니다:

```php
// 선택적 인자...
'mail:send {user?}'

// 기본값이 있는 선택적 인자...
'mail:send {user=foo}'
```


### 옵션(Options) {#options}

옵션도 인자와 마찬가지로 사용자 입력의 한 형태입니다. 옵션은 명령줄에서 두 개의 하이픈(`--`)으로 시작합니다. 옵션에는 값을 받는 옵션과 받지 않는 옵션, 두 가지 유형이 있습니다. 값을 받지 않는 옵션은 불리언 "스위치" 역할을 합니다. 예시를 살펴보겠습니다:

```php
/**
 * 콘솔 명령어의 이름과 시그니처.
 *
 * @var string
 */
protected $signature = 'mail:send {user} {--queue}';
```

이 예시에서 `--queue` 스위치는 Artisan 명령어를 호출할 때 지정할 수 있습니다. `--queue` 스위치가 전달되면 옵션의 값은 `true`가 되고, 그렇지 않으면 `false`가 됩니다:

```shell
php artisan mail:send 1 --queue
```


#### 값이 있는 옵션 {#options-with-values}

다음으로, 값을 기대하는 옵션을 살펴보겠습니다. 사용자가 옵션에 값을 반드시 지정해야 한다면, 옵션 이름 뒤에 `=` 기호를 붙이세요:

```php
/**
 * 콘솔 명령어의 이름과 시그니처.
 *
 * @var string
 */
protected $signature = 'mail:send {user} {--queue=}';
```

이 예시에서 사용자는 다음과 같이 옵션에 값을 전달할 수 있습니다. 명령어를 실행할 때 옵션이 지정되지 않으면 값은 `null`이 됩니다:

```shell
php artisan mail:send 1 --queue=default
```

옵션 이름 뒤에 기본값을 지정하여 옵션에 기본값을 할당할 수 있습니다. 사용자가 옵션 값을 전달하지 않으면 기본값이 사용됩니다:

```php
'mail:send {user} {--queue=default}'
```


#### 옵션 단축키 {#option-shortcuts}

옵션을 정의할 때 단축키를 지정하려면, 옵션 이름 앞에 단축키를 지정하고 `|` 문자를 구분자로 사용하세요:

```php
'mail:send {user} {--Q|queue}'
```

터미널에서 명령어를 실행할 때, 옵션 단축키는 한 개의 하이픈으로 시작하며, 옵션 값 지정 시 `=` 문자를 포함하지 않아야 합니다:

```shell
php artisan mail:send 1 -Qdefault
```


### 입력 배열 {#input-arrays}

여러 입력값을 기대하는 인자나 옵션을 정의하려면 `*` 문자를 사용할 수 있습니다. 먼저, 인자에 대해 예시를 살펴보겠습니다:

```php
'mail:send {user*}'
```

이 명령어를 실행할 때, `user` 인자에 여러 값을 순서대로 전달할 수 있습니다. 예를 들어, 다음 명령어는 `user`의 값을 `1`과 `2`가 담긴 배열로 설정합니다:

```shell
php artisan mail:send 1 2
```

`*` 문자는 선택적 인자 정의와 결합하여 0개 이상의 인자를 허용할 수도 있습니다:

```php
'mail:send {user?*}'
```


#### 옵션 배열 {#option-arrays}

여러 입력값을 기대하는 옵션을 정의할 때, 명령어에 전달되는 각 옵션 값 앞에 옵션 이름을 붙여야 합니다:

```php
'mail:send {--id=*}'
```

이런 명령어는 여러 개의 `--id` 인자를 전달하여 실행할 수 있습니다:

```shell
php artisan mail:send --id=1 --id=2
```


### 입력 설명 {#input-descriptions}

인자와 옵션에 설명을 추가하려면, 인자 이름과 설명 사이에 콜론을 사용하세요. 명령어 정의가 길어질 경우, 여러 줄로 나누어 작성해도 됩니다:

```php
/**
 * 콘솔 명령어의 이름과 시그니처.
 *
 * @var string
 */
protected $signature = 'mail:send
                        {user : The ID of the user}
                        {--queue : Whether the job should be queued}';
```


### 누락된 입력 프롬프트 {#prompting-for-missing-input}

명령어에 필수 인자가 포함되어 있으면, 사용자가 인자를 제공하지 않을 때 오류 메시지가 표시됩니다. 또는, `PromptsForMissingInput` 인터페이스를 구현하여 필수 인자가 누락된 경우 자동으로 사용자에게 프롬프트를 표시하도록 명령어를 구성할 수 있습니다:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;

class SendEmails extends Command implements PromptsForMissingInput
{
    /**
     * 콘솔 명령어의 이름과 시그니처.
     *
     * @var string
     */
    protected $signature = 'mail:send {user}';

    // ...
}
```

Laravel이 사용자로부터 필수 인자를 받아야 할 때, 인자 이름이나 설명을 사용하여 질문을 지능적으로 구성해 자동으로 사용자에게 인자를 요청합니다. 질문을 커스터마이징하고 싶다면, `promptForMissingArgumentsUsing` 메서드를 구현하여 인자 이름을 키로 하는 질문 배열을 반환하면 됩니다:

```php
/**
 * 누락된 입력 인자에 대해 반환된 질문으로 프롬프트.
 *
 * @return array<string, string>
 */
protected function promptForMissingArgumentsUsing(): array
{
    return [
        'user' => 'Which user ID should receive the mail?',
    ];
}
```

튜플을 사용해 플레이스홀더 텍스트도 제공할 수 있습니다:

```php
return [
    'user' => ['Which user ID should receive the mail?', 'E.g. 123'],
];
```

프롬프트를 완전히 제어하고 싶다면, 사용자를 프롬프트하고 답변을 반환하는 클로저를 제공할 수 있습니다:

```php
use App\Models\User;
use function Laravel\Prompts\search;

// ...

return [
    'user' => fn () => search(
        label: 'Search for a user:',
        placeholder: 'E.g. Taylor Otwell',
        options: fn ($value) => strlen($value) > 0
            ? User::where('name', 'like', "%{$value}%")->pluck('name', 'id')->all()
            : []
    ),
];
```

> [!NOTE]
> [Laravel Prompts](/laravel/12.x/prompts) 문서에는 사용 가능한 프롬프트와 그 사용법에 대한 추가 정보가 포함되어 있습니다.

[옵션](#options)을 선택하거나 입력하도록 사용자에게 프롬프트를 표시하려면, 명령어의 `handle` 메서드에서 프롬프트를 포함할 수 있습니다. 그러나 누락된 인자에 대해 자동으로 프롬프트된 경우에만 추가로 프롬프트를 표시하고 싶다면, `afterPromptingForMissingArguments` 메서드를 구현하면 됩니다:

```php
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use function Laravel\Prompts\confirm;

// ...

/**
 * 사용자가 누락된 인자에 대해 프롬프트된 후 실행할 작업.
 */
protected function afterPromptingForMissingArguments(InputInterface $input, OutputInterface $output): void
{
    $input->setOption('queue', confirm(
        label: 'Would you like to queue the mail?',
        default: $this->option('queue')
    ));
}
```


## 명령어 I/O {#command-io}


### 입력값 가져오기 {#retrieving-input}

명령어가 실행되는 동안, 명령어가 받는 인자와 옵션의 값을 접근해야 할 수 있습니다. 이를 위해 `argument`와 `option` 메서드를 사용할 수 있습니다. 인자나 옵션이 존재하지 않으면 `null`이 반환됩니다:

```php
/**
 * 콘솔 명령어 실행.
 */
public function handle(): void
{
    $userId = $this->argument('user');
}
```

모든 인자를 `array`로 가져오려면 `arguments` 메서드를 호출하세요:

```php
$arguments = $this->arguments();
```

옵션도 `option` 메서드를 사용해 인자처럼 쉽게 가져올 수 있습니다. 모든 옵션을 배열로 가져오려면 `options` 메서드를 호출하세요:

```php
// 특정 옵션 가져오기...
$queueName = $this->option('queue');

// 모든 옵션을 배열로 가져오기...
$options = $this->options();
```


### 입력값 프롬프트 {#prompting-for-input}

> [!NOTE]
> [Laravel Prompts](/laravel/12.x/prompts)는 명령줄 애플리케이션에 아름답고 사용자 친화적인 폼을 추가할 수 있는 PHP 패키지로, 플레이스홀더 텍스트와 검증 등 브라우저와 유사한 기능을 제공합니다.

출력을 표시하는 것 외에도, 명령어 실행 중에 사용자에게 입력을 요청할 수도 있습니다. `ask` 메서드는 주어진 질문으로 사용자를 프롬프트하고, 입력을 받아 명령어로 반환합니다:

```php
/**
 * 콘솔 명령어 실행.
 */
public function handle(): void
{
    $name = $this->ask('What is your name?');

    // ...
}
```

`ask` 메서드는 두 번째 인수로 기본값을 지정할 수 있습니다. 사용자가 입력하지 않으면 이 값이 반환됩니다:

```php
$name = $this->ask('What is your name?', 'Taylor');
```

`secret` 메서드는 `ask`와 비슷하지만, 사용자가 콘솔에 입력하는 내용이 보이지 않습니다. 비밀번호 등 민감한 정보를 요청할 때 유용합니다:

```php
$password = $this->secret('What is the password?');
```


#### 확인 요청하기 {#asking-for-confirmation}

사용자에게 단순한 "예/아니오" 확인을 요청해야 한다면, `confirm` 메서드를 사용할 수 있습니다. 기본적으로 이 메서드는 `false`를 반환합니다. 그러나 사용자가 프롬프트에 `y` 또는 `yes`를 입력하면, 메서드는 `true`를 반환합니다.

```php
if ($this->confirm('Do you wish to continue?')) {
    // ...
}
```

필요하다면, `confirm` 메서드의 두 번째 인수로 `true`를 전달하여 기본값을 `true`로 지정할 수 있습니다:

```php
if ($this->confirm('Do you wish to continue?', true)) {
    // ...
}
```


#### 자동 완성 {#auto-completion}

`anticipate` 메서드는 가능한 선택지에 대한 자동 완성을 제공할 수 있습니다. 사용자는 자동 완성 힌트와 상관없이 어떤 답변이든 입력할 수 있습니다:

```php
$name = $this->anticipate('What is your name?', ['Taylor', 'Dayle']);
```

또는, `anticipate` 메서드의 두 번째 인수로 클로저를 전달할 수 있습니다. 사용자가 입력할 때마다 클로저가 호출되며, 클로저는 지금까지의 입력값을 인수로 받아 자동 완성 옵션 배열을 반환해야 합니다:

```php
use App\Models\Address;

$name = $this->anticipate('What is your address?', function (string $input) {
    return Address::whereLike('name', "{$input}%")
        ->limit(5)
        ->pluck('name')
        ->all();
});
```


#### 다중 선택 질문 {#multiple-choice-questions}

사용자에게 미리 정의된 선택지 중에서 선택하도록 하려면, `choice` 메서드를 사용할 수 있습니다. 옵션을 선택하지 않을 경우 반환할 기본값의 배열 인덱스를 세 번째 인수로 지정할 수 있습니다:

```php
$name = $this->choice(
    'What is your name?',
    ['Taylor', 'Dayle'],
    $defaultIndex
);
```

또한, `choice` 메서드는 네 번째, 다섯 번째 인수로 유효한 응답을 선택할 수 있는 최대 시도 횟수와 다중 선택 허용 여부를 지정할 수 있습니다:

```php
$name = $this->choice(
    'What is your name?',
    ['Taylor', 'Dayle'],
    $defaultIndex,
    $maxAttempts = null,
    $allowMultipleSelections = false
);
```


### 출력 작성하기 {#writing-output}

콘솔에 출력을 보내려면, `line`, `info`, `comment`, `question`, `warn`, `error` 메서드를 사용할 수 있습니다. 각 메서드는 목적에 맞는 ANSI 색상을 사용합니다. 예를 들어, 사용자에게 일반 정보를 표시할 때는 `info` 메서드를 사용하면 콘솔에 초록색 텍스트로 표시됩니다:

```php
/**
 * 콘솔 명령어 실행.
 */
public function handle(): void
{
    // ...

    $this->info('The command was successful!');
}
```

오류 메시지를 표시하려면 `error` 메서드를 사용하세요. 오류 메시지는 일반적으로 빨간색으로 표시됩니다:

```php
$this->error('Something went wrong!');
```

`line` 메서드를 사용하면 색상 없는 일반 텍스트를 표시할 수 있습니다:

```php
$this->line('Display this on the screen');
```

`newLine` 메서드를 사용하면 빈 줄을 표시할 수 있습니다:

```php
// 빈 줄 한 줄 출력...
$this->newLine();

// 빈 줄 세 줄 출력...
$this->newLine(3);
```


#### 테이블 {#tables}

`table` 메서드를 사용하면 여러 행/열의 데이터를 올바르게 포맷하여 쉽게 표시할 수 있습니다. 열 이름과 테이블 데이터를 제공하면, Laravel이 자동으로 적절한 너비와 높이로 테이블을 계산해줍니다:

```php
use App\Models\User;

$this->table(
    ['Name', 'Email'],
    User::all(['name', 'email'])->toArray()
);
```


#### 진행 바 {#progress-bars}

오래 걸리는 작업의 경우, 작업이 얼마나 완료되었는지 사용자에게 알려주는 진행 바를 표시하면 유용합니다. `withProgressBar` 메서드를 사용하면, Laravel이 주어진 반복 가능한 값에 대해 각 반복마다 진행 바를 표시하고 진행도를 업데이트합니다:

```php
use App\Models\User;

$users = $this->withProgressBar(User::all(), function (User $user) {
    $this->performTask($user);
});
```

진행 바를 더 수동으로 제어해야 할 때도 있습니다. 먼저, 프로세스가 반복할 총 단계 수를 정의하세요. 그런 다음 각 항목을 처리한 후 진행 바를 업데이트합니다:

```php
$users = App\Models\User::all();

$bar = $this->output->createProgressBar(count($users));

$bar->start();

foreach ($users as $user) {
    $this->performTask($user);

    $bar->advance();
}

$bar->finish();
```

> [!NOTE]
> 더 고급 옵션은 [Symfony Progress Bar 컴포넌트 문서](https://symfony.com/doc/current/components/console/helpers/progressbar.html)를 참고하세요.


## 명령어 등록하기 {#registering-commands}

기본적으로 Laravel은 `app/Console/Commands` 디렉터리 내의 모든 명령어를 자동으로 등록합니다. 그러나 애플리케이션의 `bootstrap/app.php` 파일에서 `withCommands` 메서드를 사용하여 Laravel이 다른 디렉터리도 Artisan 명령어로 스캔하도록 지시할 수 있습니다:

```php
->withCommands([
    __DIR__.'/../app/Domain/Orders/Commands',
])
```

필요하다면, 명령어의 클래스 이름을 `withCommands` 메서드에 직접 제공하여 수동으로 명령어를 등록할 수도 있습니다:

```php
use App\Domain\Orders\Commands\SendEmails;

->withCommands([
    SendEmails::class,
])
```

Artisan이 부팅되면, 애플리케이션의 모든 명령어가 [서비스 컨테이너](/laravel/12.x/container)에 의해 해결되고 Artisan에 등록됩니다.


## 프로그램적으로 명령어 실행하기 {#programmatically-executing-commands}

때로는 CLI 외부에서 Artisan 명령어를 실행하고 싶을 수 있습니다. 예를 들어, 라우트나 컨트롤러에서 Artisan 명령어를 실행하고 싶을 수 있습니다. 이를 위해 `Artisan` 파사드의 `call` 메서드를 사용할 수 있습니다. `call` 메서드는 첫 번째 인수로 명령어의 시그니처 이름 또는 클래스 이름, 두 번째 인수로 명령어 파라미터 배열을 받습니다. 종료 코드가 반환됩니다:

```php
use Illuminate\Support\Facades\Artisan;

Route::post('/user/{user}/mail', function (string $user) {
    $exitCode = Artisan::call('mail:send', [
        'user' => $user, '--queue' => 'default'
    ]);

    // ...
});
```

또는, 전체 Artisan 명령어를 문자열로 `call` 메서드에 전달할 수도 있습니다:

```php
Artisan::call('mail:send 1 --queue=default');
```


#### 배열 값 전달하기 {#passing-array-values}

명령어에 배열을 받는 옵션이 정의되어 있다면, 해당 옵션에 값 배열을 전달할 수 있습니다:

```php
use Illuminate\Support\Facades\Artisan;

Route::post('/mail', function () {
    $exitCode = Artisan::call('mail:send', [
        '--id' => [5, 13]
    ]);
});
```


#### 불리언 값 전달하기 {#passing-boolean-values}

문자열 값을 받지 않는 옵션(예: `migrate:refresh` 명령어의 `--force` 플래그)의 값을 지정해야 한다면, 옵션 값으로 `true` 또는 `false`를 전달해야 합니다:

```php
$exitCode = Artisan::call('migrate:refresh', [
    '--force' => true,
]);
```


#### Artisan 명령어 큐잉하기 {#queueing-artisan-commands}

`Artisan` 파사드의 `queue` 메서드를 사용하면, Artisan 명령어를 [큐 워커](/laravel/12.x/queues)가 백그라운드에서 처리하도록 큐에 넣을 수도 있습니다. 이 메서드를 사용하기 전에 큐를 설정하고 큐 리스너를 실행 중인지 확인하세요:

```php
use Illuminate\Support\Facades\Artisan;

Route::post('/user/{user}/mail', function (string $user) {
    Artisan::queue('mail:send', [
        'user' => $user, '--queue' => 'default'
    ]);

    // ...
});
```

`onConnection` 및 `onQueue` 메서드를 사용하여 Artisan 명령어가 디스패치될 연결 또는 큐를 지정할 수 있습니다:

```php
Artisan::queue('mail:send', [
    'user' => 1, '--queue' => 'default'
])->onConnection('redis')->onQueue('commands');
```


### 다른 명령어에서 명령어 호출하기 {#calling-commands-from-other-commands}

기존 Artisan 명령어에서 다른 명령어를 호출하고 싶을 때가 있습니다. 이럴 때는 `call` 메서드를 사용할 수 있습니다. 이 메서드는 명령어 이름과 명령어 인자/옵션 배열을 받습니다:

```php
/**
 * 콘솔 명령어 실행.
 */
public function handle(): void
{
    $this->call('mail:send', [
        'user' => 1, '--queue' => 'default'
    ]);

    // ...
}
```

다른 콘솔 명령어를 호출하면서 모든 출력을 숨기고 싶다면, `callSilently` 메서드를 사용할 수 있습니다. 이 메서드는 `call` 메서드와 동일한 시그니처를 가집니다:

```php
$this->callSilently('mail:send', [
    'user' => 1, '--queue' => 'default'
]);
```


## 시그널 핸들링 {#signal-handling}

운영체제는 실행 중인 프로세스에 시그널을 보낼 수 있습니다. 예를 들어, `SIGTERM` 시그널은 운영체제가 프로그램에 종료를 요청하는 방법입니다. Artisan 콘솔 명령어에서 시그널을 감지하고 발생 시 코드를 실행하고 싶다면, `trap` 메서드를 사용할 수 있습니다:

```php
/**
 * 콘솔 명령어 실행.
 */
public function handle(): void
{
    $this->trap(SIGTERM, fn () => $this->shouldKeepRunning = false);

    while ($this->shouldKeepRunning) {
        // ...
    }
}
```

여러 시그널을 한 번에 감지하려면, `trap` 메서드에 시그널 배열을 전달할 수 있습니다:

```php
$this->trap([SIGTERM, SIGQUIT], function (int $signal) {
    $this->shouldKeepRunning = false;

    dump($signal); // SIGTERM / SIGQUIT
});
```


## 스텁 커스터마이징 {#stub-customization}

Artisan 콘솔의 `make` 명령어는 컨트롤러, 작업, 마이그레이션, 테스트 등 다양한 클래스를 생성하는 데 사용됩니다. 이 클래스들은 입력값을 기반으로 값이 채워지는 "스텁" 파일을 사용해 생성됩니다. 그러나 Artisan이 생성하는 파일에 약간의 변경을 가하고 싶을 수 있습니다. 이를 위해 `stub:publish` 명령어를 사용해 가장 일반적인 스텁을 애플리케이션에 퍼블리시하여 커스터마이징할 수 있습니다:

```shell
php artisan stub:publish
```

퍼블리시된 스텁은 애플리케이션 루트의 `stubs` 디렉터리에 위치합니다. 이 스텁을 수정하면, Artisan의 `make` 명령어로 해당 클래스를 생성할 때 변경 사항이 반영됩니다.


## 이벤트 {#events}

Artisan은 명령어 실행 시 세 가지 이벤트를 디스패치합니다: `Illuminate\Console\Events\ArtisanStarting`, `Illuminate\Console\Events\CommandStarting`, `Illuminate\Console\Events\CommandFinished`. `ArtisanStarting` 이벤트는 Artisan이 실행되자마자 디스패치됩니다. 그 다음, `CommandStarting` 이벤트가 명령어 실행 직전에 디스패치됩니다. 마지막으로, `CommandFinished` 이벤트는 명령어 실행이 끝나면 디스패치됩니다.
