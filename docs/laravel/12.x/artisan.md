# Artisan 콘솔


























## 소개 {#introduction}

Artisan은 Laravel에 포함된 명령줄 인터페이스입니다. Artisan은 애플리케이션의 루트 디렉터리에 `artisan` 스크립트로 존재하며, 애플리케이션을 개발할 때 유용한 다양한 명령어를 제공합니다. 사용 가능한 모든 Artisan 명령어 목록을 보려면 `list` 명령어를 사용할 수 있습니다:

```shell
php artisan list
```

모든 명령어에는 해당 명령어에서 사용할 수 있는 인수와 옵션을 보여주고 설명하는 "도움말" 화면도 포함되어 있습니다. 도움말 화면을 보려면 명령어 이름 앞에 `help`를 붙이면 됩니다:

```shell
php artisan help migrate
```


#### Laravel Sail {#laravel-sail}

[Laravel Sail](/docs/{{version}}/sail)를 로컬 개발 환경으로 사용하고 있다면, Artisan 명령어를 실행할 때 `sail` 명령줄을 사용해야 합니다. Sail은 여러분의 애플리케이션 Docker 컨테이너 내에서 Artisan 명령어를 실행합니다:

```shell
./vendor/bin/sail artisan list
```


### Tinker (REPL) {#tinker}

[Laravel Tinker](https://github.com/laravel/tinker)는 [PsySH](https://github.com/bobthecow/psysh) 패키지로 구동되는, Laravel 프레임워크를 위한 강력한 REPL입니다.


#### 설치 {#installation}

모든 Laravel 애플리케이션에는 기본적으로 Tinker가 포함되어 있습니다. 그러나 이전에 애플리케이션에서 Tinker를 제거했다면 Composer를 사용하여 다시 설치할 수 있습니다:

```shell
composer require laravel/tinker
```

> [!NOTE]
> Laravel 애플리케이션과 상호작용할 때 핫 리로딩, 멀티라인 코드 편집, 자동 완성 기능을 찾고 계신가요? [Tinkerwell](https://tinkerwell.app)을 확인해보세요!


#### 사용법 {#usage}

Tinker를 사용하면 Eloquent 모델, 작업(jobs), 이벤트 등 전체 Laravel 애플리케이션과 커맨드 라인에서 상호작용할 수 있습니다. Tinker 환경에 진입하려면 `tinker` Artisan 명령어를 실행하세요:

```shell
php artisan tinker
```

Tinker의 설정 파일을 게시하려면 `vendor:publish` 명령어를 사용하세요:

```shell
php artisan vendor:publish --provider="Laravel\Tinker\TinkerServiceProvider"
```

> [!WARNING]
> `dispatch` 헬퍼 함수와 `Dispatchable` 클래스의 `dispatch` 메서드는 작업을 큐에 넣기 위해 가비지 컬렉션에 의존합니다. 따라서 tinker를 사용할 때는 작업을 디스패치할 때 `Bus::dispatch` 또는 `Queue::push`를 사용해야 합니다.


#### 명령어 허용 목록 {#command-allow-list}

Tinker는 "허용" 목록을 사용하여 셸 내에서 실행할 수 있는 Artisan 명령어를 결정합니다. 기본적으로 `clear-compiled`, `down`, `env`, `inspire`, `migrate`, `migrate:install`, `up`, `optimize` 명령어를 실행할 수 있습니다. 추가로 더 많은 명령어를 허용하고 싶다면, `tinker.php` 설정 파일의 `commands` 배열에 해당 명령어를 추가하면 됩니다:

```php
'commands' => [
    // App\Console\Commands\ExampleCommand::class,
],
```


#### 별칭을 지정하지 않아야 하는 클래스 {#classes-that-should-not-be-aliased}

일반적으로 Tinker는 Tinker에서 클래스를 사용할 때 자동으로 별칭을 지정합니다. 그러나 일부 클래스는 절대 별칭을 지정하지 않도록 하고 싶을 수 있습니다. 이 경우, `tinker.php` 설정 파일의 `dont_alias` 배열에 해당 클래스를 나열하면 됩니다:

```php
'dont_alias' => [
    App\Models\User::class,
],
```


## 명령어 작성하기 {#writing-commands}

Artisan에서 기본으로 제공하는 명령어 외에도, 직접 커스텀 명령어를 만들 수 있습니다. 명령어는 일반적으로 `app/Console/Commands` 디렉터리에 저장되지만, 원하는 위치에 저장해도 무방합니다. 단, [다른 디렉터리에서 Artisan 명령어를 스캔하도록](#registering-commands) Laravel에 알려주어야 합니다.


### 명령어 생성하기 {#generating-commands}

새로운 명령어를 생성하려면 `make:command` Artisan 명령어를 사용할 수 있습니다. 이 명령어는 `app/Console/Commands` 디렉터리에 새로운 명령어 클래스를 생성합니다. 만약 이 디렉터리가 애플리케이션에 없다면, `make:command` Artisan 명령어를 처음 실행할 때 자동으로 생성됩니다:

```shell
php artisan make:command SendEmails
```


### 명령어 구조 {#command-structure}

명령어를 생성한 후에는 클래스의 `signature`와 `description` 속성에 적절한 값을 정의해야 합니다. 이 속성들은 `list` 화면에 명령어를 표시할 때 사용됩니다. 또한 `signature` 속성을 통해 [명령어의 입력값 기대치](#defining-input-expectations)도 정의할 수 있습니다. 명령어가 실행되면 `handle` 메서드가 호출되며, 이 메서드에 명령어의 로직을 작성하면 됩니다.

예시 명령어를 살펴보겠습니다. 아래 예시에서 볼 수 있듯이, 명령어의 `handle` 메서드를 통해 필요한 의존성을 자유롭게 주입받을 수 있습니다. 라라벨의 [서비스 컨테이너](/docs/{{version}}/container)는 이 메서드의 시그니처에 타입힌트된 모든 의존성을 자동으로 주입해줍니다.

```php
<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\DripEmailer;
use Illuminate\Console\Command;

class SendEmails extends Command
{
    /**
     * 콘솔 명령어의 이름과 시그니처
     *
     * @var string
     */
    protected $signature = 'mail:send {user}';

    /**
     * 콘솔 명령어 설명
     *
     * @var string
     */
    protected $description = '사용자에게 마케팅 이메일을 전송합니다';

    /**
     * 콘솔 명령어 실행
     */
    public function handle(DripEmailer $drip): void
    {
        $drip->send(User::find($this->argument('user')));
    }
}
```

> [!NOTE]
> 코드의 재사용성을 높이기 위해, 콘솔 명령어는 가볍게 유지하고 실제 작업은 애플리케이션 서비스에 위임하는 것이 좋은 습관입니다. 위 예시에서도 이메일 전송의 "실질적인 작업"을 서비스 클래스에 위임하고 있음을 알 수 있습니다.


#### 종료 코드 {#exit-codes}

`handle` 메서드에서 아무것도 반환하지 않고 명령이 정상적으로 실행되면, 명령은 성공을 나타내는 `0` 종료 코드로 종료됩니다. 그러나 `handle` 메서드는 선택적으로 정수를 반환하여 명령의 종료 코드를 직접 지정할 수 있습니다:

```php
$this->error('문제가 발생했습니다.');

return 1;
```

명령 내의 어떤 메서드에서든 명령을 "실패" 상태로 종료하고 싶다면, `fail` 메서드를 사용할 수 있습니다. `fail` 메서드는 즉시 명령 실행을 중단하고 종료 코드 `1`을 반환합니다:

```php
$this->fail('문제가 발생했습니다.');
```


### 클로저 명령어 {#closure-commands}

클로저 기반 명령어는 콘솔 명령어를 클래스로 정의하는 것에 대한 대안입니다. 라우트 클로저가 컨트롤러의 대안인 것처럼, 명령어 클로저도 명령어 클래스의 대안으로 생각할 수 있습니다.

`routes/console.php` 파일은 HTTP 라우트를 정의하지 않지만, 애플리케이션에 대한 콘솔 기반 진입점(라우트)을 정의합니다. 이 파일 내에서 `Artisan::command` 메서드를 사용하여 모든 클로저 기반 콘솔 명령어를 정의할 수 있습니다. `command` 메서드는 두 개의 인자를 받습니다: [명령어 시그니처](#defining-input-expectations)와 명령어의 인자 및 옵션을 받는 클로저입니다.

```php
Artisan::command('mail:send {user}', function (string $user) {
    $this->info("Sending email to: {$user}!");
});
```

이 클로저는 기본 명령어 인스턴스에 바인딩되므로, 전체 명령어 클래스에서 일반적으로 접근할 수 있는 모든 헬퍼 메서드에 완전히 접근할 수 있습니다.


#### 의존성 타입-힌트 {#type-hinting-dependencies}

명령어 클로저는 명령어의 인자와 옵션을 받을 뿐만 아니라, [서비스 컨테이너](/docs/{{version}}/container)에서 해결하고 싶은 추가적인 의존성도 타입-힌트로 지정할 수 있습니다:

```php
use App\Models\User;
use App\Support\DripEmailer;

Artisan::command('mail:send {user}', function (DripEmailer $drip, string $user) {
    $drip->send(User::find($user));
});
```


#### 클로저 명령어 설명 {#closure-command-descriptions}

클로저 기반 명령어를 정의할 때, `purpose` 메서드를 사용하여 명령어에 대한 설명을 추가할 수 있습니다. 이 설명은 `php artisan list` 또는 `php artisan help` 명령어를 실행할 때 표시됩니다:

```php
Artisan::command('mail:send {user}', function (string $user) {
    // ...
})->purpose('사용자에게 마케팅 이메일을 전송합니다');
```


### 격리 가능한 명령어 {#isolatable-commands}

> [!WARNING]
> 이 기능을 사용하려면, 애플리케이션의 기본 캐시 드라이버로 `memcached`, `redis`, `dynamodb`, `database`, `file`, 또는 `array` 캐시 드라이버 중 하나를 사용해야 합니다. 또한, 모든 서버가 동일한 중앙 캐시 서버와 통신해야 합니다.

때때로 한 번에 하나의 명령어 인스턴스만 실행되도록 보장하고 싶을 수 있습니다. 이를 위해 명령어 클래스에서 `Illuminate\Contracts\Console\Isolatable` 인터페이스를 구현하면 됩니다:

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

명령어를 `Isolatable`로 표시하면, 명령어 옵션에 명시적으로 정의하지 않아도 Laravel이 자동으로 해당 명령어에 `--isolated` 옵션을 사용할 수 있도록 해줍니다. 이 옵션과 함께 명령어를 실행하면, Laravel은 동일한 명령어의 다른 인스턴스가 이미 실행 중인지 확인합니다. 이는 애플리케이션의 기본 캐시 드라이버를 사용하여 원자적 락을 획득함으로써 이루어집니다. 만약 다른 인스턴스가 실행 중이라면, 명령어는 실행되지 않으며, 그래도 성공적인 종료 상태 코드로 종료됩니다:

```shell
php artisan mail:send 1 --isolated
```

명령어가 실행되지 못했을 때 반환할 종료 상태 코드를 지정하고 싶다면, `isolated` 옵션에 원하는 상태 코드를 지정할 수 있습니다:

```shell
php artisan mail:send 1 --isolated=12
```


#### Lock ID {#lock-id}

기본적으로 Laravel은 애플리케이션 캐시에서 원자적 락을 획득하기 위해 명령어의 이름을 문자열 키로 사용합니다. 하지만, Artisan 명령어 클래스에 `isolatableId` 메서드를 정의하여 이 키를 커스터마이즈할 수 있습니다. 이를 통해 명령어의 인자나 옵션을 키에 통합할 수 있습니다:

```php
/**
 * 명령어의 isolatable ID를 반환합니다.
 */
public function isolatableId(): string
{
    return $this->argument('user');
}
```


#### Lock Expiration Time {#lock-expiration-time}

기본적으로, 격리 락(isolation lock)은 명령어가 완료된 후 만료됩니다. 또는 명령어가 중단되어 완료되지 못한 경우, 락은 1시간 후에 만료됩니다. 하지만, 명령어 클래스에 `isolationLockExpiresAt` 메서드를 정의하여 락의 만료 시간을 조정할 수 있습니다:

```php
use DateTimeInterface;
use DateInterval;

/**
 * 명령어의 격리 락 만료 시점을 결정합니다.
 */
public function isolationLockExpiresAt(): DateTimeInterface|DateInterval
{
    return now()->addMinutes(5);
}
```


## 입력 기대치 정의하기 {#defining-input-expectations}

콘솔 명령어를 작성할 때, 사용자로부터 인자(argument)나 옵션(option)을 통해 입력을 받는 경우가 많습니다. Laravel은 명령어의 `signature` 속성을 사용하여 사용자가 입력해야 할 내용을 매우 편리하게 정의할 수 있도록 해줍니다. `signature` 속성은 명령어의 이름, 인자, 옵션을 한 번에 명확하고 라우트와 유사한 문법으로 정의할 수 있게 해줍니다.


### 인자 {#arguments}

모든 사용자 입력 인자와 옵션은 중괄호로 감싸서 작성합니다. 아래 예시에서, 해당 커맨드는 하나의 필수 인자 `user`를 정의합니다:

```php
/**
 * The name and signature of the console command.
 *
 * @var string
 */
protected $signature = 'mail:send {user}';
```

인자를 선택적으로 만들거나, 기본값을 지정할 수도 있습니다:

```php
// 선택적 인자...
'mail:send {user?}'

// 기본값이 있는 선택적 인자...
'mail:send {user=foo}'
```


### 옵션 {#options}

옵션은 인자(argument)와 마찬가지로 또 다른 형태의 사용자 입력입니다. 옵션은 커맨드 라인에서 입력할 때 두 개의 하이픈(`--`)으로 시작합니다. 옵션에는 값을 받는 옵션과 값을 받지 않는 옵션, 두 가지 유형이 있습니다. 값을 받지 않는 옵션은 불리언 "스위치" 역할을 합니다. 이러한 유형의 옵션 예제를 살펴보겠습니다:

```php
/**
 * 콘솔 명령어의 이름과 시그니처입니다.
 *
 * @var string
 */
protected $signature = 'mail:send {user} {--queue}';
```

이 예제에서 `--queue` 스위치는 Artisan 명령어를 호출할 때 지정할 수 있습니다. 만약 `--queue` 스위치가 전달되면, 해당 옵션의 값은 `true`가 됩니다. 그렇지 않으면 값은 `false`가 됩니다:

```shell
php artisan mail:send 1 --queue
```


#### 값이 필요한 옵션 {#options-with-values}

다음으로, 값을 기대하는 옵션에 대해 살펴보겠습니다. 사용자가 옵션에 값을 반드시 지정해야 한다면, 옵션 이름 뒤에 `=` 기호를 붙여야 합니다:

```php
/**
 * 콘솔 명령어의 이름과 시그니처입니다.
 *
 * @var string
 */
protected $signature = 'mail:send {user} {--queue=}';
```

이 예시에서 사용자는 아래와 같이 옵션에 값을 전달할 수 있습니다. 명령어를 실행할 때 옵션이 지정되지 않으면, 해당 옵션의 값은 `null`이 됩니다:

```shell
php artisan mail:send 1 --queue=default
```

옵션 이름 뒤에 기본값을 지정하여 옵션에 기본값을 할당할 수도 있습니다. 사용자가 옵션 값을 전달하지 않으면, 기본값이 사용됩니다:

```php
'mail:send {user} {--queue=default}'
```


#### 옵션 단축키 {#option-shortcuts}

옵션을 정의할 때 단축키를 지정하려면, 옵션 이름 앞에 단축키를 작성하고 `|` 문자를 사용해 단축키와 전체 옵션 이름을 구분할 수 있습니다:

```php
'mail:send {user} {--Q|queue}'
```

터미널에서 명령어를 실행할 때, 옵션 단축키는 한 개의 하이픈(-)으로 시작해야 하며, 옵션에 값을 지정할 때는 `=` 문자를 포함하지 않아야 합니다:

```shell
php artisan mail:send 1 -Qdefault
```


### 입력 배열 {#input-arrays}

여러 입력 값을 받을 인자나 옵션을 정의하고 싶다면, `*` 문자를 사용할 수 있습니다. 먼저, 이러한 인자를 지정하는 예제를 살펴보겠습니다:

```php
'mail:send {user*}'
```

이 명령어를 실행할 때, `user` 인자는 명령줄에 여러 개를 순서대로 전달할 수 있습니다. 예를 들어, 아래와 같이 명령어를 실행하면 `user`의 값은 `1`과 `2`를 값으로 가지는 배열이 됩니다:

```shell
php artisan mail:send 1 2
```

이 `*` 문자는 선택적 인자 정의와 결합하여, 인자가 0개 이상 전달될 수 있도록 할 수도 있습니다:

```php
'mail:send {user?*}'
```


#### 옵션 배열 {#option-arrays}

여러 입력 값을 기대하는 옵션을 정의할 때, 명령어에 전달되는 각 옵션 값은 옵션 이름을 접두사로 붙여야 합니다:

```php
'mail:send {--id=*}'
```

이러한 명령어는 여러 개의 `--id` 인자를 전달하여 실행할 수 있습니다:

```shell
php artisan mail:send --id=1 --id=2
```


### 입력 설명 {#input-descriptions}

입력 인수와 옵션에 설명을 추가하려면, 인수 이름과 설명을 콜론(:)으로 구분하여 작성할 수 있습니다. 명령어 정의에 더 많은 공간이 필요하다면, 여러 줄에 걸쳐 정의해도 괜찮습니다:

```php
/**
 * 콘솔 명령어의 이름과 시그니처입니다.
 *
 * @var string
 */
protected $signature = 'mail:send
                        {user : 사용자의 ID}
                        {--queue : 작업을 큐에 넣을지 여부}';
```


### 누락된 입력값 프롬프트 요청 {#prompting-for-missing-input}

명령어에 필수 인자가 포함되어 있을 경우, 사용자가 해당 인자를 제공하지 않으면 에러 메시지가 표시됩니다. 또는, `PromptsForMissingInput` 인터페이스를 구현하여 필수 인자가 누락되었을 때 자동으로 사용자에게 입력을 요청하도록 명령어를 설정할 수 있습니다:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;

class SendEmails extends Command implements PromptsForMissingInput
{
    /**
     * 콘솔 명령어의 이름과 시그니처입니다.
     *
     * @var string
     */
    protected $signature = 'mail:send {user}';

    // ...
}
```

Laravel이 필수 인자를 사용자로부터 받아야 할 경우, 인자 이름이나 설명을 활용해 자동으로 질문을 만들어 사용자에게 입력을 요청합니다. 만약 필수 인자를 요청할 때 사용할 질문을 직접 지정하고 싶다면, `promptForMissingArgumentsUsing` 메서드를 구현하여 인자 이름을 키로 하는 질문 배열을 반환하면 됩니다:

```php
/**
 * 반환된 질문을 사용해 누락된 입력 인자를 요청합니다.
 *
 * @return array<string, string>
 */
protected function promptForMissingArgumentsUsing(): array
{
    return [
        'user' => '어떤 사용자 ID로 메일을 보낼까요?',
    ];
}
```

질문과 함께 플레이스홀더(예시 텍스트)를 제공하고 싶다면, 질문과 플레이스홀더가 포함된 튜플을 사용할 수 있습니다:

```php
return [
    'user' => ['어떤 사용자 ID로 메일을 보낼까요?', '예: 123'],
];
```

프롬프트를 완전히 제어하고 싶다면, 사용자를 프롬프트하고 그 결과를 반환하는 클로저를 제공할 수도 있습니다:

```php
use App\Models\User;
use function Laravel\Prompts\search;

// ...

return [
    'user' => fn () => search(
        label: '사용자를 검색하세요:',
        placeholder: '예: Taylor Otwell',
        options: fn ($value) => strlen($value) > 0
            ? User::where('name', 'like', "%{$value}%")->pluck('name', 'id')->all()
            : []
    ),
];
```

> [!NOTE]
자세한 프롬프트 종류와 사용법은 [Laravel Prompts](/docs/{{version}}/prompts) 공식 문서를 참고하세요.

사용자에게 [옵션](#options)을 선택하거나 입력하도록 프롬프트를 띄우고 싶다면, 명령어의 `handle` 메서드에서 프롬프트를 사용할 수 있습니다. 하지만, 누락된 인자에 대해 자동으로 프롬프트가 실행된 경우에만 추가 프롬프트를 띄우고 싶다면, `afterPromptingForMissingArguments` 메서드를 구현할 수 있습니다:

```php
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use function Laravel\Prompts\confirm;

// ...

/**
 * 누락된 인자에 대해 프롬프트가 실행된 후 추가 작업을 수행합니다.
 */
protected function afterPromptingForMissingArguments(InputInterface $input, OutputInterface $output): void
{
    $input->setOption('queue', confirm(
        label: '메일을 큐에 등록하시겠습니까?',
        default: $this->option('queue')
    ));
}
```


## 명령어 입출력 {#command-io}


### 입력값 가져오기 {#retrieving-input}

명령어가 실행되는 동안, 명령어에서 허용한 인자(argument)와 옵션(option)의 값을 접근해야 할 때가 많습니다. 이를 위해 `argument`와 `option` 메서드를 사용할 수 있습니다. 만약 해당 인자나 옵션이 존재하지 않으면, `null`이 반환됩니다:

```php
/**
 * 콘솔 명령어를 실행합니다.
 */
public function handle(): void
{
    $userId = $this->argument('user');
}
```

모든 인자를 `array` 형태로 가져와야 한다면, `arguments` 메서드를 호출하면 됩니다:

```php
$arguments = $this->arguments();
```

옵션도 인자와 마찬가지로 `option` 메서드를 사용해 쉽게 가져올 수 있습니다. 모든 옵션을 배열로 가져오려면 `options` 메서드를 호출하세요:

```php
// 특정 옵션을 가져오기...
$queueName = $this->option('queue');

// 모든 옵션을 배열로 가져오기...
$options = $this->options();
```


### 입력 요청하기 {#prompting-for-input}

> [!NOTE]
> [Laravel Prompts](/docs/{{version}}/prompts)는 명령줄 애플리케이션에 아름답고 사용자 친화적인 폼을 추가할 수 있는 PHP 패키지로, 플레이스홀더 텍스트와 유효성 검사 등 브라우저와 유사한 기능을 제공합니다.

출력만 표시하는 것 외에도, 명령 실행 중에 사용자에게 입력을 요청할 수 있습니다. `ask` 메서드는 지정한 질문으로 사용자를 프롬프트하고, 입력을 받아, 그 값을 명령으로 반환합니다:

```php
/**
 * 콘솔 명령을 실행합니다.
 */
public function handle(): void
{
    $name = $this->ask('What is your name?');

    // ...
}
```

`ask` 메서드는 선택적으로 두 번째 인자를 받을 수 있는데, 이는 사용자가 아무 입력도 하지 않았을 때 반환할 기본값을 지정합니다:

```php
$name = $this->ask('What is your name?', 'Taylor');
```

`secret` 메서드는 `ask`와 비슷하지만, 사용자가 콘솔에 입력하는 내용이 보이지 않습니다. 이 메서드는 비밀번호와 같은 민감한 정보를 요청할 때 유용합니다:

```php
$password = $this->secret('What is the password?');
```


#### 확인 요청하기 {#asking-for-confirmation}

사용자에게 간단한 "예 또는 아니오" 확인을 요청해야 하는 경우, `confirm` 메서드를 사용할 수 있습니다. 기본적으로 이 메서드는 `false`를 반환합니다. 하지만 사용자가 프롬프트에 `y` 또는 `yes`를 입력하면, 이 메서드는 `true`를 반환합니다.

```php
if ($this->confirm('계속 진행하시겠습니까?')) {
    // ...
}
```

필요하다면, `confirm` 메서드의 두 번째 인자로 `true`를 전달하여 확인 프롬프트의 기본값을 `true`로 지정할 수 있습니다:

```php
if ($this->confirm('계속 진행하시겠습니까?', true)) {
    // ...
}
```


#### 자동 완성 {#auto-completion}

`anticipate` 메서드는 가능한 선택지에 대한 자동 완성 기능을 제공합니다. 사용자는 자동 완성 힌트와 상관없이 어떤 답변이든 입력할 수 있습니다:

```php
$name = $this->anticipate('당신의 이름은 무엇인가요?', ['Taylor', 'Dayle']);
```

또는, `anticipate` 메서드의 두 번째 인자로 클로저를 전달할 수도 있습니다. 이 클로저는 사용자가 입력할 때마다 호출됩니다. 클로저는 지금까지 사용자가 입력한 문자열을 매개변수로 받아, 자동 완성 옵션의 배열을 반환해야 합니다:

```php
use App\Models\Address;

$name = $this->anticipate('당신의 주소는 무엇인가요?', function (string $input) {
    return Address::whereLike('name', "{$input}%")
        ->limit(5)
        ->pluck('name')
        ->all();
});
```


#### 객관식 질문 {#multiple-choice-questions}

사용자에게 질문할 때 미리 정의된 선택지를 제공해야 한다면, `choice` 메서드를 사용할 수 있습니다. 선택하지 않았을 때 반환될 기본값의 배열 인덱스를 세 번째 인자로 전달하여 설정할 수 있습니다:

```php
$name = $this->choice(
    '당신의 이름은 무엇입니까?',
    ['Taylor', 'Dayle'],
    $defaultIndex
);
```

또한, `choice` 메서드는 네 번째와 다섯 번째 인자로 유효한 응답을 선택할 수 있는 최대 시도 횟수와 다중 선택 허용 여부를 설정할 수 있습니다:

```php
$name = $this->choice(
    '당신의 이름은 무엇입니까?',
    ['Taylor', 'Dayle'],
    $defaultIndex,
    $maxAttempts = null,
    $allowMultipleSelections = false
);
```


### 출력 작성하기 {#writing-output}

콘솔에 출력을 보내기 위해서는 `line`, `info`, `comment`, `question`, `warn`, `error` 메서드를 사용할 수 있습니다. 이 메서드들은 각각의 목적에 맞는 ANSI 색상을 사용합니다. 예를 들어, 사용자에게 일반적인 정보를 표시하려면 `info` 메서드를 사용할 수 있습니다. 일반적으로 `info` 메서드는 콘솔에서 초록색 텍스트로 표시됩니다:

```php
/**
 * 콘솔 명령을 실행합니다.
 */
public function handle(): void
{
    // ...

    $this->info('명령이 성공적으로 실행되었습니다!');
}
```

오류 메시지를 표시하려면 `error` 메서드를 사용하세요. 오류 메시지는 일반적으로 빨간색으로 표시됩니다:

```php
$this->error('문제가 발생했습니다!');
```

색상이 없는 일반 텍스트를 표시하려면 `line` 메서드를 사용할 수 있습니다:

```php
$this->line('이 내용을 화면에 표시합니다');
```

빈 줄을 표시하려면 `newLine` 메서드를 사용할 수 있습니다:

```php
// 한 줄을 비웁니다...
$this->newLine();

// 세 줄을 비웁니다...
$this->newLine(3);
```


#### 테이블 {#tables}

`table` 메서드는 여러 행과 열의 데이터를 올바르게 포맷할 수 있도록 도와줍니다. 열 이름과 테이블에 들어갈 데이터를 제공하기만 하면, Laravel이 자동으로 테이블의 적절한 너비와 높이를 계산해줍니다:

```php
use App\Models\User;

$this->table(
    ['Name', 'Email'],
    User::all(['name', 'email'])->toArray()
);
```


#### 진행률 표시줄 {#progress-bars}

오래 걸리는 작업의 경우, 작업이 얼마나 완료되었는지 사용자에게 알려주는 진행률 표시줄을 보여주는 것이 도움이 될 수 있습니다. Laravel의 withProgressBar 메서드를 사용하면, 주어진 반복 가능한 값에 대해 각 반복마다 진행률 표시줄이 표시되고 진행 상황이 업데이트됩니다:

```php
use App\Models\User;

$users = $this->withProgressBar(User::all(), function (User $user) {
    $this->performTask($user);
});
```

때로는 진행률 표시줄의 진행을 더 세밀하게 제어해야 할 수도 있습니다. 먼저, 프로세스가 반복할 총 단계 수를 정의합니다. 그런 다음 각 항목을 처리한 후 진행률 표시줄을 한 단계씩 진행시킵니다:

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
> 더 다양한 옵션이 필요하다면 [Symfony Progress Bar 컴포넌트 문서](https://symfony.com/doc/current/components/console/helpers/progressbar.html)를 참고하세요.


## 명령어 등록하기 {#registering-commands}

기본적으로 Laravel은 `app/Console/Commands` 디렉터리 내의 모든 명령어를 자동으로 등록합니다. 그러나 애플리케이션의 `bootstrap/app.php` 파일에서 `withCommands` 메서드를 사용하여 Artisan 명령어를 검색할 다른 디렉터리를 지정할 수도 있습니다:

```php
->withCommands([
    __DIR__.'/../app/Domain/Orders/Commands',
])
```

필요하다면, 명령어의 클래스 이름을 `withCommands` 메서드에 직접 전달하여 수동으로 명령어를 등록할 수도 있습니다:

```php
use App\Domain\Orders\Commands\SendEmails;

->withCommands([
    SendEmails::class,
])
```

Artisan이 부팅될 때, 애플리케이션의 모든 명령어는 [서비스 컨테이너](/docs/{{version}}/container)에 의해 해석되고 Artisan에 등록됩니다.


## 프로그램적으로 명령어 실행하기 {#programmatically-executing-commands}

때때로 CLI 외부에서 Artisan 명령어를 실행하고 싶을 때가 있습니다. 예를 들어, 라우트나 컨트롤러에서 Artisan 명령어를 실행하고 싶을 수 있습니다. 이를 위해 `Artisan` 파사드의 `call` 메서드를 사용할 수 있습니다. `call` 메서드는 첫 번째 인자로 명령어의 시그니처 이름 또는 클래스 이름을, 두 번째 인자로 명령어 파라미터 배열을 받습니다. 반환값으로는 종료 코드가 반환됩니다:

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

명령어에서 배열을 허용하는 옵션을 정의한 경우, 해당 옵션에 배열 형태의 값을 전달할 수 있습니다:

```php
use Illuminate\Support\Facades\Artisan;

Route::post('/mail', function () {
    $exitCode = Artisan::call('mail:send', [
        '--id' => [5, 13]
    ]);
});
```


#### 불리언 값 전달하기 {#passing-boolean-values}

문자열 값을 허용하지 않는 옵션의 값을 지정해야 할 때, 예를 들어 `migrate:refresh` 명령어의 `--force` 플래그와 같은 경우, 해당 옵션의 값으로 `true` 또는 `false`를 전달해야 합니다:

```php
$exitCode = Artisan::call('migrate:refresh', [
    '--force' => true,
]);
```


#### Artisan 명령어 큐잉 {#queueing-artisan-commands}

`Artisan` 파사드의 `queue` 메서드를 사용하면 Artisan 명령어를 큐에 넣어 [큐 워커](/docs/{{version}}/queues)가 백그라운드에서 처리하도록 할 수 있습니다. 이 메서드를 사용하기 전에 큐 설정이 완료되어 있고 큐 리스너가 실행 중인지 확인하세요.

```php
use Illuminate\Support\Facades\Artisan;

Route::post('/user/{user}/mail', function (string $user) {
    Artisan::queue('mail:send', [
        'user' => $user, '--queue' => 'default'
    ]);

    // ...
});
```

`onConnection`과 `onQueue` 메서드를 사용하면 Artisan 명령어가 실행될 연결(connection)이나 큐(queue)를 지정할 수 있습니다.

```php
Artisan::queue('mail:send', [
    'user' => 1, '--queue' => 'default'
])->onConnection('redis')->onQueue('commands');
```


### 다른 커맨드에서 커맨드 호출하기 {#calling-commands-from-other-commands}

때때로 기존의 Artisan 커맨드에서 다른 커맨드를 호출하고 싶을 때가 있습니다. 이럴 때는 `call` 메서드를 사용할 수 있습니다. `call` 메서드는 커맨드 이름과 커맨드 인수/옵션 배열을 인자로 받습니다:

```php
/**
 * 콘솔 커맨드를 실행합니다.
 */
public function handle(): void
{
    $this->call('mail:send', [
        'user' => 1, '--queue' => 'default'
    ]);

    // ...
}
```

다른 콘솔 커맨드를 호출하면서 모든 출력을 숨기고 싶다면, `callSilently` 메서드를 사용할 수 있습니다. `callSilently` 메서드는 `call` 메서드와 동일한 시그니처를 가집니다:

```php
$this->callSilently('mail:send', [
    'user' => 1, '--queue' => 'default'
]);
```


## 시그널 처리 {#signal-handling}

운영 체제는 실행 중인 프로세스에 시그널을 보낼 수 있습니다. 예를 들어, `SIGTERM` 시그널은 운영 체제가 프로그램에 종료를 요청할 때 사용됩니다. Artisan 콘솔 명령어에서 시그널을 감지하고 해당 시그널이 발생했을 때 코드를 실행하고 싶다면, `trap` 메서드를 사용할 수 있습니다:

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

여러 개의 시그널을 동시에 감지하고 싶다면, `trap` 메서드에 시그널 배열을 전달할 수 있습니다:

```php
$this->trap([SIGTERM, SIGQUIT], function (int $signal) {
    $this->shouldKeepRunning = false;

    dump($signal); // SIGTERM / SIGQUIT
});
```


## 스텁 커스터마이징 {#stub-customization}

Artisan 콘솔의 `make` 명령어는 컨트롤러, 잡, 마이그레이션, 테스트 등 다양한 클래스를 생성하는 데 사용됩니다. 이러한 클래스들은 "스텁(stub)" 파일을 기반으로 생성되며, 입력값에 따라 해당 값들이 채워집니다. 하지만, Artisan이 생성하는 파일에 약간의 수정을 하고 싶을 때가 있을 수 있습니다. 이를 위해 `stub:publish` 명령어를 사용하여 가장 일반적으로 사용되는 스텁 파일들을 애플리케이션에 퍼블리시(복사)할 수 있습니다. 이렇게 하면 스텁 파일을 자유롭게 커스터마이징할 수 있습니다.

```shell
php artisan stub:publish
```

퍼블리시된 스텁 파일들은 애플리케이션 루트의 `stubs` 디렉터리에 위치하게 됩니다. 이 스텁 파일들을 수정하면, Artisan의 `make` 명령어로 해당 클래스를 생성할 때 변경된 내용이 반영됩니다.


## 이벤트 {#events}

Artisan은 명령어를 실행할 때 세 가지 이벤트를 발생시킵니다: `Illuminate\Console\Events\ArtisanStarting`, `Illuminate\Console\Events\CommandStarting`, 그리고 `Illuminate\Console\Events\CommandFinished`입니다. `ArtisanStarting` 이벤트는 Artisan이 실행을 시작하자마자 즉시 발생합니다. 그 다음, `CommandStarting` 이벤트는 명령어가 실행되기 직전에 발생합니다. 마지막으로, `CommandFinished` 이벤트는 명령어 실행이 완료된 후에 발생합니다.
