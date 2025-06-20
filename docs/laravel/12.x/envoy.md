# Laravel Envoy



















## 소개 {#introduction}

[Laravel Envoy](https://github.com/laravel/envoy)는 원격 서버에서 자주 실행하는 작업을 수행하기 위한 도구입니다. [Blade](/laravel/12.x/blade) 스타일의 문법을 사용하여 배포, Artisan 명령어 등 다양한 작업을 손쉽게 설정할 수 있습니다. 현재 Envoy는 Mac과 Linux 운영체제만 지원합니다. 하지만 [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)를 사용하면 Windows에서도 사용할 수 있습니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 사용하여 프로젝트에 Envoy를 설치하세요:

```shell
composer require laravel/envoy --dev
```

Envoy가 설치되면, Envoy 바이너리는 애플리케이션의 `vendor/bin` 디렉터리에서 사용할 수 있습니다:

```shell
php vendor/bin/envoy
```


## 작업 작성하기 {#writing-tasks}


### 작업 정의하기 {#defining-tasks}

작업(Task)은 Envoy의 기본 구성 요소입니다. 작업은 해당 작업이 호출될 때 원격 서버에서 실행되어야 하는 셸 명령어를 정의합니다. 예를 들어, 모든 큐 워커 서버에서 `php artisan queue:restart` 명령어를 실행하는 작업을 정의할 수 있습니다.

모든 Envoy 작업은 애플리케이션 루트에 위치한 `Envoy.blade.php` 파일에 정의해야 합니다. 다음은 시작을 위한 예시입니다:

```blade
@servers(['web' => ['user@192.168.1.1'], 'workers' => ['user@192.168.1.2']])

@task('restart-queues', ['on' => 'workers'])
    cd /home/user/example.com
    php artisan queue:restart
@endtask
```

위에서 볼 수 있듯이, 파일 상단에 `@servers` 배열이 정의되어 있어 작업 선언의 `on` 옵션을 통해 이 서버들을 참조할 수 있습니다. `@servers` 선언은 항상 한 줄에 작성해야 합니다. `@task` 선언 내에는 작업이 호출될 때 서버에서 실행되어야 하는 셸 명령어를 작성합니다.


#### 로컬 작업 {#local-tasks}

서버의 IP 주소를 `127.0.0.1`로 지정하여 스크립트를 로컬 컴퓨터에서 실행하도록 강제할 수 있습니다:

```blade
@servers(['localhost' => '127.0.0.1'])
```


#### Envoy 작업 가져오기 {#importing-envoy-tasks}

`@import` 지시어를 사용하면 다른 Envoy 파일을 가져와 해당 스토리와 작업을 내 파일에 추가할 수 있습니다. 파일이 가져와진 후에는, 마치 내 Envoy 파일에 정의된 것처럼 해당 작업을 실행할 수 있습니다:

```blade
@import('vendor/package/Envoy.blade.php')
```


### 다중 서버 {#multiple-servers}

Envoy를 사용하면 여러 서버에서 작업을 쉽게 실행할 수 있습니다. 먼저, `@servers` 선언에 추가 서버를 등록하세요. 각 서버에는 고유한 이름을 지정해야 합니다. 추가 서버를 정의한 후, 작업의 `on` 배열에 각 서버를 나열할 수 있습니다:

```blade
@servers(['web-1' => '192.168.1.1', 'web-2' => '192.168.1.2'])

@task('deploy', ['on' => ['web-1', 'web-2']])
    cd /home/user/example.com
    git pull origin {{ $branch }}
    php artisan migrate --force
@endtask
```


#### 병렬 실행 {#parallel-execution}

기본적으로 작업은 각 서버에서 순차적으로 실행됩니다. 즉, 첫 번째 서버에서 작업이 완료된 후 두 번째 서버에서 실행이 시작됩니다. 여러 서버에서 작업을 병렬로 실행하려면, 작업 선언에 `parallel` 옵션을 추가하세요:

```blade
@servers(['web-1' => '192.168.1.1', 'web-2' => '192.168.1.2'])

@task('deploy', ['on' => ['web-1', 'web-2'], 'parallel' => true])
    cd /home/user/example.com
    git pull origin {{ $branch }}
    php artisan migrate --force
@endtask
```


### 설정 {#setup}

때때로 Envoy 작업을 실행하기 전에 임의의 PHP 코드를 실행해야 할 수 있습니다. `@setup` 지시어를 사용하여 작업 전에 실행할 PHP 코드 블록을 정의할 수 있습니다:

```php
@setup
    $now = new DateTime;
@endsetup
```

작업이 실행되기 전에 다른 PHP 파일을 불러와야 한다면, `Envoy.blade.php` 파일 상단에 `@include` 지시어를 사용할 수 있습니다:

```blade
@include('vendor/autoload.php')

@task('restart-queues')
    # ...
@endtask
```


### 변수 {#variables}

필요하다면, Envoy 작업을 호출할 때 명령줄에서 인자를 전달할 수 있습니다:

```shell
php vendor/bin/envoy run deploy --branch=master
```

작업 내에서는 Blade의 "echo" 문법을 사용하여 옵션에 접근할 수 있습니다. 또한, 작업 내에서 Blade의 `if` 문과 반복문을 사용할 수 있습니다. 예를 들어, `git pull` 명령어를 실행하기 전에 `$branch` 변수가 존재하는지 확인해보겠습니다:

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /home/user/example.com

    @if ($branch)
        git pull origin {{ $branch }}
    @endif

    php artisan migrate --force
@endtask
```


### 스토리 {#stories}

스토리는 여러 작업을 하나의 편리한 이름 아래에 그룹화합니다. 예를 들어, `deploy` 스토리는 정의 내에 작업 이름을 나열하여 `update-code`와 `install-dependencies` 작업을 실행할 수 있습니다:

```blade
@servers(['web' => ['user@192.168.1.1']])

@story('deploy')
    update-code
    install-dependencies
@endstory

@task('update-code')
    cd /home/user/example.com
    git pull origin master
@endtask

@task('install-dependencies')
    cd /home/user/example.com
    composer install
@endtask
```

스토리가 작성되면, 작업을 호출하는 것과 동일한 방식으로 호출할 수 있습니다:

```shell
php vendor/bin/envoy run deploy
```


### 후크 {#completion-hooks}

작업과 스토리가 실행될 때 여러 후크가 실행됩니다. Envoy가 지원하는 후크 타입은 `@before`, `@after`, `@error`, `@success`, `@finished`입니다. 이 후크 내의 모든 코드는 PHP로 해석되어 로컬에서 실행되며, 작업이 상호작용하는 원격 서버에서는 실행되지 않습니다.

각 후크는 원하는 만큼 정의할 수 있습니다. 후크는 Envoy 스크립트에 나타난 순서대로 실행됩니다.


#### `@before` {#hook-before}

각 작업 실행 전에, Envoy 스크립트에 등록된 모든 `@before` 후크가 실행됩니다. `@before` 후크는 실행될 작업의 이름을 전달받습니다:

```blade
@before
    if ($task === 'deploy') {
        // ...
    }
@endbefore
```


#### `@after` {#completion-after}

각 작업 실행 후에, Envoy 스크립트에 등록된 모든 `@after` 후크가 실행됩니다. `@after` 후크는 실행된 작업의 이름을 전달받습니다:

```blade
@after
    if ($task === 'deploy') {
        // ...
    }
@endafter
```


#### `@error` {#completion-error}

작업이 실패할 때마다(상태 코드가 `0`보다 클 때), Envoy 스크립트에 등록된 모든 `@error` 후크가 실행됩니다. `@error` 후크는 실행된 작업의 이름을 전달받습니다:

```blade
@error
    if ($task === 'deploy') {
        // ...
    }
@enderror
```


#### `@success` {#completion-success}

모든 작업이 오류 없이 실행되면, Envoy 스크립트에 등록된 모든 `@success` 후크가 실행됩니다:

```blade
@success
    // ...
@endsuccess
```


#### `@finished` {#completion-finished}

모든 작업이 실행된 후(종료 상태와 관계없이), 모든 `@finished` 후크가 실행됩니다. `@finished` 후크는 완료된 작업의 상태 코드를 전달받으며, 이는 `null`이거나 0 이상의 `integer`일 수 있습니다:

```blade
@finished
    if ($exitCode > 0) {
        // 작업 중 오류가 발생했습니다...
    }
@endfinished
```


## 작업 실행하기 {#running-tasks}

애플리케이션의 `Envoy.blade.php` 파일에 정의된 작업이나 스토리를 실행하려면, Envoy의 `run` 명령어를 실행하고 실행하고자 하는 작업 또는 스토리의 이름을 전달하세요. Envoy는 작업을 실행하고, 실행 중 원격 서버의 출력을 표시합니다:

```shell
php vendor/bin/envoy run deploy
```


### 작업 실행 확인 {#confirming-task-execution}

특정 작업을 서버에서 실행하기 전에 확인 메시지를 받고 싶다면, 작업 선언에 `confirm` 지시어를 추가하세요. 이 옵션은 파괴적인 작업에 특히 유용합니다:

```blade
@task('deploy', ['on' => 'web', 'confirm' => true])
    cd /home/user/example.com
    git pull origin {{ $branch }}
    php artisan migrate
@endtask
```


## 알림 {#notifications}


### Slack {#slack}

Envoy는 각 작업이 실행된 후 [Slack](https://slack.com)으로 알림을 보낼 수 있습니다. `@slack` 지시어는 Slack 훅 URL과 채널/사용자 이름을 인자로 받습니다. Slack 제어판에서 "Incoming WebHooks" 통합을 생성하여 웹훅 URL을 얻을 수 있습니다.

`@slack` 지시어의 첫 번째 인자로 전체 웹훅 URL을 전달해야 합니다. 두 번째 인자는 채널 이름(`#channel`) 또는 사용자 이름(`@user`)이어야 합니다:

```blade
@finished
    @slack('webhook-url', '#bots')
@endfinished
```

기본적으로 Envoy 알림은 실행된 작업을 설명하는 메시지를 알림 채널로 전송합니다. 하지만, 세 번째 인자로 직접 메시지를 전달하여 이 메시지를 덮어쓸 수 있습니다:

```blade
@finished
    @slack('webhook-url', '#bots', 'Hello, Slack.')
@endfinished
```


### Discord {#discord}

Envoy는 각 작업이 실행된 후 [Discord](https://discord.com)로 알림을 보낼 수도 있습니다. `@discord` 지시어는 Discord 훅 URL과 메시지를 인자로 받습니다. 서버 설정에서 "Webhook"을 생성하고, 웹훅이 게시될 채널을 선택하여 웹훅 URL을 얻을 수 있습니다. 전체 웹훅 URL을 `@discord` 지시어에 전달해야 합니다:

```blade
@finished
    @discord('discord-webhook-url')
@endfinished
```


### Telegram {#telegram}

Envoy는 각 작업이 실행된 후 [Telegram](https://telegram.org)으로 알림을 보낼 수도 있습니다. `@telegram` 지시어는 Telegram Bot ID와 Chat ID를 인자로 받습니다. [BotFather](https://t.me/botfather)를 사용해 새 봇을 생성하여 Bot ID를 얻을 수 있습니다. [@username_to_id_bot](https://t.me/username_to_id_bot)을 사용해 유효한 Chat ID를 얻을 수 있습니다. 전체 Bot ID와 Chat ID를 `@telegram` 지시어에 전달해야 합니다:

```blade
@finished
    @telegram('bot-id','chat-id')
@endfinished
```


### Microsoft Teams {#microsoft-teams}

Envoy는 각 작업이 실행된 후 [Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams)로 알림을 보낼 수도 있습니다. `@microsoftTeams` 지시어는 Teams Webhook(필수), 메시지, 테마 색상(success, info, warning, error), 옵션 배열을 인자로 받습니다. [incoming webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)을 새로 생성하여 Teams Webhook을 얻을 수 있습니다. Teams API는 제목, 요약, 섹션 등 메시지 박스를 커스터마이즈할 수 있는 다양한 속성을 제공합니다. 자세한 내용은 [Microsoft Teams 문서](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using?tabs=cURL#example-of-connector-message)에서 확인할 수 있습니다. 전체 Webhook URL을 `@microsoftTeams` 지시어에 전달해야 합니다:

```blade
@finished
    @microsoftTeams('webhook-url')
@endfinished
```
