# Context














## 소개 {#introduction}

Laravel의 "컨텍스트" 기능을 사용하면 애플리케이션 내에서 실행되는 요청, 작업, 명령 전체에 걸쳐 정보를 캡처, 조회, 공유할 수 있습니다. 이렇게 캡처된 정보는 애플리케이션에서 작성된 로그에도 포함되어, 로그 항목이 작성되기 전에 발생한 코드 실행 이력을 더 깊이 파악할 수 있으며, 분산 시스템 전반에 걸친 실행 흐름을 추적할 수 있게 해줍니다.


### 작동 방식 {#how-it-works}

Laravel의 컨텍스트 기능을 가장 잘 이해하는 방법은 내장된 로깅 기능과 함께 실제로 사용하는 모습을 보는 것입니다. 시작하려면 `Context` 파사드를 사용하여 [컨텍스트에 정보를 추가](#capturing-context)할 수 있습니다. 이 예제에서는 [미들웨어](/laravel/12.x/middleware)를 사용하여 모든 들어오는 요청마다 요청 URL과 고유한 추적 ID를 컨텍스트에 추가해보겠습니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AddContext
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        Context::add('url', $request->url());
        Context::add('trace_id', Str::uuid()->toString());

        return $next($request);
    }
}
```

컨텍스트에 추가된 정보는 요청 전체에서 작성되는 [로그 항목](/laravel/12.x/logging)에 자동으로 메타데이터로 첨부됩니다. 컨텍스트를 메타데이터로 첨부하면 개별 로그 항목에 전달된 정보와 `Context`를 통해 공유된 정보를 구분할 수 있습니다. 예를 들어, 다음과 같이 로그 항목을 작성한다고 가정해봅시다:

```php
Log::info('User authenticated.', ['auth_id' => Auth::id()]);
```

작성된 로그에는 로그 항목에 전달된 `auth_id`뿐만 아니라, 컨텍스트의 `url`과 `trace_id`도 메타데이터로 포함됩니다:

```text
User authenticated. {"auth_id":27} {"url":"https://example.com/login","trace_id":"e04e1a11-e75c-4db3-b5b5-cfef4ef56697"}
```

컨텍스트에 추가된 정보는 큐에 디스패치된 작업에도 전달됩니다. 예를 들어, 컨텍스트에 정보를 추가한 후 `ProcessPodcast` 작업을 큐에 디스패치한다고 가정해봅시다:

```php
// 미들웨어에서...
Context::add('url', $request->url());
Context::add('trace_id', Str::uuid()->toString());

// 컨트롤러에서...
ProcessPodcast::dispatch($podcast);
```

작업이 디스패치될 때, 현재 컨텍스트에 저장된 모든 정보가 캡처되어 작업과 함께 공유됩니다. 캡처된 정보는 작업이 실행되는 동안 현재 컨텍스트에 다시 수화(hydrate)됩니다. 따라서 작업의 handle 메서드에서 로그를 작성하면:

```php
class ProcessPodcast implements ShouldQueue
{
    use Queueable;

    // ...

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Processing podcast.', [
            'podcast_id' => $this->podcast->id,
        ]);

        // ...
    }
}
```

결과적으로 작성된 로그 항목에는 작업을 디스패치한 요청 중에 컨텍스트에 추가된 정보가 포함됩니다:

```text
Processing podcast. {"podcast_id":95} {"url":"https://example.com/login","trace_id":"e04e1a11-e75c-4db3-b5b5-cfef4ef56697"}
```

지금까지는 Laravel 컨텍스트의 내장 로깅 관련 기능에 초점을 맞췄지만, 아래 문서에서는 컨텍스트를 통해 HTTP 요청/큐 작업 경계를 넘어 정보를 공유하는 방법과, 로그 항목에 기록되지 않는 [숨겨진 컨텍스트 데이터](#hidden-context)를 추가하는 방법까지 설명합니다.


## 컨텍스트 캡처하기 {#capturing-context}

`Context` 파사드의 `add` 메서드를 사용하여 현재 컨텍스트에 정보를 저장할 수 있습니다:

```php
use Illuminate\Support\Facades\Context;

Context::add('key', 'value');
```

여러 항목을 한 번에 추가하려면, 연관 배열을 `add` 메서드에 전달할 수 있습니다:

```php
Context::add([
    'first_key' => 'value',
    'second_key' => 'value',
]);
```

`add` 메서드는 동일한 키를 가진 기존 값을 덮어씁니다. 만약 키가 이미 존재하지 않을 때만 컨텍스트에 정보를 추가하고 싶다면, `addIf` 메서드를 사용할 수 있습니다:

```php
Context::add('key', 'first');

Context::get('key');
// "first"

Context::addIf('key', 'second');

Context::get('key');
// "first"
```

컨텍스트는 또한 주어진 키의 값을 증가시키거나 감소시키는 편리한 메서드를 제공합니다. 이 두 메서드는 추적할 키를 첫 번째 인자로 받고, 두 번째 인자로 증가 또는 감소시킬 값을 지정할 수 있습니다:

```php
Context::increment('records_added');
Context::increment('records_added', 5);

Context::decrement('records_added');
Context::decrement('records_added', 5);
```


#### 조건부 컨텍스트 {#conditional-context}

`when` 메서드는 주어진 조건에 따라 컨텍스트에 데이터를 추가할 수 있습니다. `when` 메서드에 전달된 첫 번째 클로저는 조건이 `true`일 때, 두 번째 클로저는 조건이 `false`일 때 호출됩니다:

```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;

Context::when(
    Auth::user()->isAdmin(),
    fn ($context) => $context->add('permissions', Auth::user()->permissions),
    fn ($context) => $context->add('permissions', []),
);
```


#### 스코프 컨텍스트 {#scoped-context}

`scope` 메서드는 주어진 콜백이 실행되는 동안 컨텍스트를 임시로 수정하고, 콜백 실행이 끝나면 컨텍스트를 원래 상태로 복원할 수 있는 방법을 제공합니다. 또한, 클로저가 실행되는 동안 컨텍스트에 병합할 추가 데이터(두 번째, 세 번째 인자)를 전달할 수 있습니다.

```php
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

Context::add('trace_id', 'abc-999');
Context::addHidden('user_id', 123);

Context::scope(
    function () {
        Context::add('action', 'adding_friend');

        $userId = Context::getHidden('user_id');

        Log::debug("Adding user [{$userId}] to friends list.");
        // Adding user [987] to friends list.  {"trace_id":"abc-999","user_name":"taylor_otwell","action":"adding_friend"}
    },
    data: ['user_name' => 'taylor_otwell'],
    hidden: ['user_id' => 987],
);

Context::all();
// [
//     'trace_id' => 'abc-999',
// ]

Context::allHidden();
// [
//     'user_id' => 123,
// ]
```

> [!WARNING]
> 스코프 클로저 내부에서 컨텍스트 내의 객체가 수정되면, 그 변경 사항은 스코프 외부에도 반영됩니다.


### 스택 {#stacks}

컨텍스트는 "스택"을 생성할 수 있는 기능을 제공합니다. 스택은 추가된 순서대로 데이터를 저장하는 리스트입니다. `push` 메서드를 호출하여 스택에 정보를 추가할 수 있습니다:

```php
use Illuminate\Support\Facades\Context;

Context::push('breadcrumbs', 'first_value');

Context::push('breadcrumbs', 'second_value', 'third_value');

Context::get('breadcrumbs');
// [
//     'first_value',
//     'second_value',
//     'third_value',
// ]
```

스택은 요청에 대한 이력 정보(예: 애플리케이션 전반에서 발생하는 이벤트 등)를 캡처하는 데 유용합니다. 예를 들어, 쿼리가 실행될 때마다 스택에 쿼리 SQL과 실행 시간을 튜플로 저장하는 이벤트 리스너를 만들 수 있습니다:

```php
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\DB;

// AppServiceProvider.php에서...
DB::listen(function ($event) {
    Context::push('queries', [$event->time, $event->sql]);
});
```

`stackContains` 및 `hiddenStackContains` 메서드를 사용하여 스택에 값이 포함되어 있는지 확인할 수 있습니다:

```php
if (Context::stackContains('breadcrumbs', 'first_value')) {
    //
}

if (Context::hiddenStackContains('secrets', 'first_value')) {
    //
}
```

`stackContains`와 `hiddenStackContains` 메서드는 두 번째 인자로 클로저도 받을 수 있어, 값 비교 작업을 더 세밀하게 제어할 수 있습니다:

```php
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;

return Context::stackContains('breadcrumbs', function ($value) {
    return Str::startsWith($value, 'query_');
});
```


## 컨텍스트 조회하기 {#retrieving-context}

`Context` 파사드의 `get` 메서드를 사용하여 컨텍스트에서 정보를 조회할 수 있습니다:

```php
use Illuminate\Support\Facades\Context;

$value = Context::get('key');
```

`only`와 `except` 메서드를 사용하여 컨텍스트에서 일부 정보만 조회할 수 있습니다:

```php
$data = Context::only(['first_key', 'second_key']);

$data = Context::except(['first_key']);
```

`pull` 메서드는 컨텍스트에서 정보를 조회한 후 즉시 해당 정보를 컨텍스트에서 제거합니다:

```php
$value = Context::pull('key');
```

컨텍스트 데이터가 [스택](#stacks)에 저장되어 있다면, `pop` 메서드를 사용하여 스택에서 항목을 꺼낼 수 있습니다:

```php
Context::push('breadcrumbs', 'first_value', 'second_value');

Context::pop('breadcrumbs');
// second_value

Context::get('breadcrumbs');
// ['first_value']
```

컨텍스트에 저장된 모든 정보를 조회하려면 `all` 메서드를 호출하면 됩니다:

```php
$data = Context::all();
```


### 항목 존재 여부 확인 {#determining-item-existence}

`has`와 `missing` 메서드를 사용하여 주어진 키에 대해 컨텍스트에 값이 저장되어 있는지 확인할 수 있습니다:

```php
use Illuminate\Support\Facades\Context;

if (Context::has('key')) {
    // ...
}

if (Context::missing('key')) {
    // ...
}
```

`has` 메서드는 저장된 값이 무엇이든(예: `null`이어도) `true`를 반환합니다. 예를 들어, 값이 `null`인 키도 존재하는 것으로 간주됩니다:

```php
Context::add('key', null);

Context::has('key');
// true
```


## 컨텍스트 제거하기 {#removing-context}

`forget` 메서드를 사용하여 현재 컨텍스트에서 키와 그 값을 제거할 수 있습니다:

```php
use Illuminate\Support\Facades\Context;

Context::add(['first_key' => 1, 'second_key' => 2]);

Context::forget('first_key');

Context::all();

// ['second_key' => 2]
```

여러 키를 한 번에 제거하려면 배열을 `forget` 메서드에 전달하면 됩니다:

```php
Context::forget(['first_key', 'second_key']);
```


## 숨겨진 컨텍스트 {#hidden-context}

컨텍스트는 "숨겨진" 데이터를 저장할 수 있는 기능을 제공합니다. 이 숨겨진 정보는 로그에 첨부되지 않으며, 위에서 설명한 데이터 조회 메서드로 접근할 수 없습니다. 컨텍스트는 숨겨진 컨텍스트 정보와 상호작용할 수 있는 별도의 메서드 집합을 제공합니다:

```php
use Illuminate\Support\Facades\Context;

Context::addHidden('key', 'value');

Context::getHidden('key');
// 'value'

Context::get('key');
// null
```

"숨겨진" 메서드는 위에서 설명한 일반 메서드와 동일한 기능을 제공합니다:

```php
Context::addHidden(/* ... */);
Context::addHiddenIf(/* ... */);
Context::pushHidden(/* ... */);
Context::getHidden(/* ... */);
Context::pullHidden(/* ... */);
Context::popHidden(/* ... */);
Context::onlyHidden(/* ... */);
Context::exceptHidden(/* ... */);
Context::allHidden(/* ... */);
Context::hasHidden(/* ... */);
Context::missingHidden(/* ... */);
Context::forgetHidden(/* ... */);
```


## 이벤트 {#events}

컨텍스트는 컨텍스트의 수화(hydration) 및 탈수(dehydration) 과정에 후킹할 수 있는 두 가지 이벤트를 디스패치합니다.

이 이벤트들이 어떻게 사용될 수 있는지 설명하기 위해, 애플리케이션의 미들웨어에서 들어오는 HTTP 요청의 `Accept-Language` 헤더를 기반으로 `app.locale` 설정 값을 지정한다고 가정해봅시다. 컨텍스트의 이벤트를 사용하면 이 값을 요청 중에 캡처하고 큐에서 복원하여, 큐에서 전송되는 알림이 올바른 `app.locale` 값을 갖도록 할 수 있습니다. 아래 문서에서는 컨텍스트의 이벤트와 [숨겨진](#hidden-context) 데이터를 사용하여 이를 구현하는 방법을 설명합니다.


### 탈수(Dehydrating) {#dehydrating}

작업이 큐에 디스패치될 때마다 컨텍스트의 데이터가 "탈수(dehydrated)"되어 작업의 페이로드와 함께 캡처됩니다. `Context::dehydrating` 메서드를 사용하면 탈수 과정 중에 호출될 클로저를 등록할 수 있습니다. 이 클로저 내에서 큐 작업과 공유할 데이터에 변경을 가할 수 있습니다.

일반적으로 `dehydrating` 콜백은 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 등록해야 합니다:

```php
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Context;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Context::dehydrating(function (Repository $context) {
        $context->addHidden('locale', Config::get('app.locale'));
    });
}
```

> [!NOTE]
> `dehydrating` 콜백 내에서는 `Context` 파사드를 사용하지 마십시오. 이는 현재 프로세스의 컨텍스트를 변경하게 됩니다. 콜백에 전달된 저장소(repository)만 변경해야 합니다.


### 수화(Hydrated) {#hydrated}

큐에 디스패치된 작업이 실행을 시작할 때, 작업과 함께 공유된 컨텍스트가 현재 컨텍스트에 "수화(hydrated)"됩니다. `Context::hydrated` 메서드를 사용하면 수화 과정 중에 호출될 클로저를 등록할 수 있습니다.

일반적으로 `hydrated` 콜백은 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 등록해야 합니다:

```php
use Illuminate\Log\Context\Repository;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Context;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Context::hydrated(function (Repository $context) {
        if ($context->hasHidden('locale')) {
            Config::set('app.locale', $context->getHidden('locale'));
        }
    });
}
```

> [!NOTE]
> `hydrated` 콜백 내에서는 `Context` 파사드를 사용하지 말고, 콜백에 전달된 저장소(repository)만 변경해야 합니다.
