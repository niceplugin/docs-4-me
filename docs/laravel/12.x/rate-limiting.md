# Rate Limiting








## 소개 {#introduction}

Laravel은 간단하게 사용할 수 있는 속도 제한 추상화를 제공하며, 애플리케이션의 [캐시](cache)와 함께 사용하여 지정된 시간 동안 어떤 동작이든 쉽게 제한할 수 있습니다.

> [!NOTE]
> 들어오는 HTTP 요청에 대한 속도 제한에 관심이 있다면, [속도 제한 미들웨어 문서](/laravel/12.x/routing#rate-limiting)를 참고하세요.


### 캐시 설정 {#cache-configuration}

일반적으로 속도 제한기는 애플리케이션의 `cache` 설정 파일 내 `default` 키에 정의된 기본 애플리케이션 캐시를 사용합니다. 그러나, 애플리케이션의 `cache` 설정 파일에 `limiter` 키를 정의하여 속도 제한기가 사용할 캐시 드라이버를 지정할 수 있습니다:

```php
'default' => env('CACHE_STORE', 'database'),

'limiter' => 'redis',
```


## 기본 사용법 {#basic-usage}

`Illuminate\Support\Facades\RateLimiter` 파사드를 사용하여 속도 제한기에 접근할 수 있습니다. 속도 제한기가 제공하는 가장 간단한 메서드는 `attempt` 메서드로, 지정된 초 동안 주어진 콜백을 속도 제한합니다.

`attempt` 메서드는 콜백의 남은 시도 횟수가 없을 때 `false`를 반환하며, 그렇지 않으면 콜백의 결과 또는 `true`를 반환합니다. `attempt` 메서드의 첫 번째 인자는 속도 제한 "키"로, 제한할 동작을 나타내는 임의의 문자열을 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\RateLimiter;

$executed = RateLimiter::attempt(
    'send-message:'.$user->id,
    $perMinute = 5,
    function() {
        // 메시지 전송...
    }
);

if (! $executed) {
  return '메시지를 너무 많이 보냈습니다!';
}
```

필요하다면, `attempt` 메서드에 네 번째 인자를 전달할 수 있습니다. 이 인자는 "감쇠율"로, 사용 가능한 시도 횟수가 초기화될 때까지의 초 단위 시간입니다. 예를 들어, 위 예제를 수정하여 2분마다 5번의 시도를 허용할 수 있습니다:

```php
$executed = RateLimiter::attempt(
    'send-message:'.$user->id,
    $perTwoMinutes = 5,
    function() {
        // 메시지 전송...
    },
    $decayRate = 120,
);
```


### 시도 횟수 수동 증가 {#manually-incrementing-attempts}

속도 제한기를 수동으로 조작하고 싶다면 다양한 다른 메서드를 사용할 수 있습니다. 예를 들어, `tooManyAttempts` 메서드를 호출하여 주어진 속도 제한 키가 분당 허용된 최대 시도 횟수를 초과했는지 확인할 수 있습니다:

```php
use Illuminate\Support\Facades\RateLimiter;

if (RateLimiter::tooManyAttempts('send-message:'.$user->id, $perMinute = 5)) {
    return '시도 횟수가 너무 많습니다!';
}

RateLimiter::increment('send-message:'.$user->id);

// 메시지 전송...
```

또는, `remaining` 메서드를 사용하여 주어진 키에 남은 시도 횟수를 가져올 수 있습니다. 만약 남은 시도 횟수가 있다면, `increment` 메서드를 호출하여 전체 시도 횟수를 증가시킬 수 있습니다:

```php
use Illuminate\Support\Facades\RateLimiter;

if (RateLimiter::remaining('send-message:'.$user->id, $perMinute = 5)) {
    RateLimiter::increment('send-message:'.$user->id);

    // 메시지 전송...
}
```

주어진 속도 제한 키의 값을 한 번 이상 증가시키고 싶다면, `increment` 메서드에 원하는 수치를 전달할 수 있습니다:

```php
RateLimiter::increment('send-message:'.$user->id, amount: 5);
```


#### 제한 가능 여부 확인 {#determining-limiter-availability}

키에 더 이상 시도 횟수가 남아 있지 않을 때, `availableIn` 메서드는 추가 시도가 가능해질 때까지 남은 초를 반환합니다:

```php
use Illuminate\Support\Facades\RateLimiter;

if (RateLimiter::tooManyAttempts('send-message:'.$user->id, $perMinute = 5)) {
    $seconds = RateLimiter::availableIn('send-message:'.$user->id);

    return '다시 시도하려면 '.$seconds.'초 후에 가능합니다.';
}

RateLimiter::increment('send-message:'.$user->id);

// 메시지 전송...
```


### 시도 횟수 초기화 {#clearing-attempts}

`clear` 메서드를 사용하여 주어진 속도 제한 키의 시도 횟수를 초기화할 수 있습니다. 예를 들어, 특정 메시지가 수신자에 의해 읽혔을 때 시도 횟수를 초기화할 수 있습니다:

```php
use App\Models\Message;
use Illuminate\Support\Facades\RateLimiter;

/**
 * 메시지를 읽음으로 표시합니다.
 */
public function read(Message $message): Message
{
    $message->markAsRead();

    RateLimiter::clear('send-message:'.$message->user_id);

    return $message;
}
```
