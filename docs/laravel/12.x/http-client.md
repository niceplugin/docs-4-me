# HTTP 클라이언트




















## 소개 {#introduction}

Laravel은 [Guzzle HTTP 클라이언트](http://docs.guzzlephp.org/en/stable/)를 감싸는 표현적이고 최소한의 API를 제공하여, 다른 웹 애플리케이션과 통신하기 위한 외부 HTTP 요청을 빠르게 만들 수 있습니다. Laravel의 Guzzle 래퍼는 가장 일반적인 사용 사례와 개발자 경험에 중점을 두고 있습니다.


## 요청 보내기 {#making-requests}

요청을 보내기 위해서는 `Http` 파사드에서 제공하는 `head`, `get`, `post`, `put`, `patch`, `delete` 메서드를 사용할 수 있습니다. 먼저, 다른 URL로 기본적인 `GET` 요청을 보내는 방법을 살펴보겠습니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::get('http://example.com');
```

`get` 메서드는 `Illuminate\Http\Client\Response` 인스턴스를 반환하며, 응답을 검사할 수 있는 다양한 메서드를 제공합니다:

```php
$response->body() : string;
$response->json($key = null, $default = null) : mixed;
$response->object() : object;
$response->collect($key = null) : Illuminate\Support\Collection;
$response->resource() : resource;
$response->status() : int;
$response->successful() : bool;
$response->redirect(): bool;
$response->failed() : bool;
$response->clientError() : bool;
$response->header($header) : string;
$response->headers() : array;
```

`Illuminate\Http\Client\Response` 객체는 PHP의 `ArrayAccess` 인터페이스도 구현하고 있어, 응답의 JSON 데이터를 배열처럼 바로 접근할 수 있습니다:

```php
return Http::get('http://example.com/users/1')['name'];
```

위에 나열된 응답 메서드 외에도, 응답이 특정 상태 코드를 가졌는지 확인할 수 있는 다음 메서드들을 사용할 수 있습니다:

```php
$response->ok() : bool;                  // 200 OK
$response->created() : bool;             // 201 Created
$response->accepted() : bool;            // 202 Accepted
$response->noContent() : bool;           // 204 No Content
$response->movedPermanently() : bool;    // 301 Moved Permanently
$response->found() : bool;               // 302 Found
$response->badRequest() : bool;          // 400 Bad Request
$response->unauthorized() : bool;        // 401 Unauthorized
$response->paymentRequired() : bool;     // 402 Payment Required
$response->forbidden() : bool;           // 403 Forbidden
$response->notFound() : bool;            // 404 Not Found
$response->requestTimeout() : bool;      // 408 Request Timeout
$response->conflict() : bool;            // 409 Conflict
$response->unprocessableEntity() : bool; // 422 Unprocessable Entity
$response->tooManyRequests() : bool;     // 429 Too Many Requests
$response->serverError() : bool;         // 500 Internal Server Error
```


#### URI 템플릿 {#uri-templates}

HTTP 클라이언트는 [URI 템플릿 명세](https://www.rfc-editor.org/rfc/rfc6570)를 사용하여 요청 URL을 구성할 수 있습니다. URI 템플릿에서 확장할 수 있는 URL 파라미터를 정의하려면 `withUrlParameters` 메서드를 사용할 수 있습니다:

```php
Http::withUrlParameters([
    'endpoint' => 'https://laravel.com',
    'page' => 'docs',
    'version' => '11.x',
    'topic' => 'validation',
])->get('{+endpoint}/{page}/{version}/{topic}');
```


#### 요청 덤프 {#dumping-requests}

요청이 전송되기 전에 요청 인스턴스를 덤프하고 스크립트 실행을 종료하고 싶다면, 요청 정의의 시작 부분에 `dd` 메서드를 추가할 수 있습니다:

```php
return Http::dd()->get('http://example.com');
```


### 요청 데이터 {#request-data}

물론, `POST`, `PUT`, `PATCH` 요청을 보낼 때는 추가 데이터를 함께 보내는 것이 일반적이므로, 이 메서드들은 두 번째 인자로 데이터 배열을 받을 수 있습니다. 기본적으로 데이터는 `application/json` 콘텐츠 타입으로 전송됩니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::post('http://example.com/users', [
    'name' => 'Steve',
    'role' => 'Network Administrator',
]);
```


#### GET 요청 쿼리 파라미터 {#get-request-query-parameters}

`GET` 요청을 보낼 때는 URL에 쿼리 문자열을 직접 추가하거나, `get` 메서드의 두 번째 인자로 키/값 쌍의 배열을 전달할 수 있습니다:

```php
$response = Http::get('http://example.com/users', [
    'name' => 'Taylor',
    'page' => 1,
]);
```

또는, `withQueryParameters` 메서드를 사용할 수도 있습니다:

```php
Http::retry(3, 100)->withQueryParameters([
    'name' => 'Taylor',
    'page' => 1,
])->get('http://example.com/users')
```


#### 폼 URL 인코딩 요청 보내기 {#sending-form-url-encoded-requests}

`application/x-www-form-urlencoded` 콘텐츠 타입으로 데이터를 보내고 싶다면, 요청 전에 `asForm` 메서드를 호출해야 합니다:

```php
$response = Http::asForm()->post('http://example.com/users', [
    'name' => 'Sara',
    'role' => 'Privacy Consultant',
]);
```


#### Raw 요청 바디 보내기 {#sending-a-raw-request-body}

요청을 보낼 때 raw 요청 바디를 직접 제공하고 싶다면 `withBody` 메서드를 사용할 수 있습니다. 콘텐츠 타입은 두 번째 인자로 지정할 수 있습니다:

```php
$response = Http::withBody(
    base64_encode($photo), 'image/jpeg'
)->post('http://example.com/photo');
```


#### 멀티파트 요청 {#multi-part-requests}

파일을 멀티파트 요청으로 보내고 싶다면, 요청 전에 `attach` 메서드를 호출해야 합니다. 이 메서드는 파일의 이름과 내용을 받으며, 필요하다면 세 번째 인자로 파일명을, 네 번째 인자로 파일에 관련된 헤더를 지정할 수 있습니다:

```php
$response = Http::attach(
    'attachment', file_get_contents('photo.jpg'), 'photo.jpg', ['Content-Type' => 'image/jpeg']
)->post('http://example.com/attachments');
```

파일의 raw 내용을 전달하는 대신, 스트림 리소스를 전달할 수도 있습니다:

```php
$photo = fopen('photo.jpg', 'r');

$response = Http::attach(
    'attachment', $photo, 'photo.jpg'
)->post('http://example.com/attachments');
```


### 헤더 {#headers}

헤더는 `withHeaders` 메서드를 사용하여 요청에 추가할 수 있습니다. 이 메서드는 키/값 쌍의 배열을 받습니다:

```php
$response = Http::withHeaders([
    'X-First' => 'foo',
    'X-Second' => 'bar'
])->post('http://example.com/users', [
    'name' => 'Taylor',
]);
```

`accept` 메서드를 사용하여 요청에 대한 응답으로 기대하는 콘텐츠 타입을 지정할 수 있습니다:

```php
$response = Http::accept('application/json')->get('http://example.com/users');
```

편의를 위해, `acceptJson` 메서드를 사용하여 응답으로 `application/json` 콘텐츠 타입을 기대한다고 빠르게 지정할 수 있습니다:

```php
$response = Http::acceptJson()->get('http://example.com/users');
```

`withHeaders` 메서드는 새로운 헤더를 기존 요청 헤더에 병합합니다. 필요하다면, `replaceHeaders` 메서드를 사용하여 모든 헤더를 완전히 교체할 수 있습니다:

```php
$response = Http::withHeaders([
    'X-Original' => 'foo',
])->replaceHeaders([
    'X-Replacement' => 'bar',
])->post('http://example.com/users', [
    'name' => 'Taylor',
]);
```


### 인증 {#authentication}

기본 인증과 다이제스트 인증 자격 증명은 각각 `withBasicAuth`와 `withDigestAuth` 메서드를 사용하여 지정할 수 있습니다:

```php
// 기본 인증...
$response = Http::withBasicAuth('taylor@laravel.com', 'secret')->post(/* ... */);

// 다이제스트 인증...
$response = Http::withDigestAuth('taylor@laravel.com', 'secret')->post(/* ... */);
```


#### 베어러 토큰 {#bearer-tokens}

요청의 `Authorization` 헤더에 베어러 토큰을 빠르게 추가하고 싶다면, `withToken` 메서드를 사용할 수 있습니다:

```php
$response = Http::withToken('token')->post(/* ... */);
```


### 타임아웃 {#timeout}

`timeout` 메서드를 사용하여 응답을 기다릴 최대 초를 지정할 수 있습니다. 기본적으로 HTTP 클라이언트는 30초 후에 타임아웃됩니다:

```php
$response = Http::timeout(3)->get(/* ... */);
```

지정한 타임아웃을 초과하면, `Illuminate\Http\Client\ConnectionException` 인스턴스가 발생합니다.

서버에 연결을 시도할 때 기다릴 최대 초를 `connectTimeout` 메서드로 지정할 수 있습니다. 기본값은 10초입니다:

```php
$response = Http::connectTimeout(3)->get(/* ... */);
```


### 재시도 {#retries}

클라이언트 또는 서버 오류가 발생할 경우 HTTP 클라이언트가 자동으로 요청을 재시도하게 하려면, `retry` 메서드를 사용할 수 있습니다. `retry` 메서드는 요청을 시도할 최대 횟수와 각 시도 사이에 Laravel이 대기할 밀리초를 인자로 받습니다:

```php
$response = Http::retry(3, 100)->post(/* ... */);
```

시도 사이에 대기할 밀리초를 직접 계산하고 싶다면, 두 번째 인자로 클로저를 전달할 수 있습니다:

```php
use Exception;

$response = Http::retry(3, function (int $attempt, Exception $exception) {
    return $attempt * 100;
})->post(/* ... */);
```

편의를 위해, 첫 번째 인자로 배열을 전달할 수도 있습니다. 이 배열은 각 시도 사이에 대기할 밀리초를 결정하는 데 사용됩니다:

```php
$response = Http::retry([100, 200])->post(/* ... */);
```

필요하다면, 세 번째 인자를 `retry` 메서드에 전달할 수 있습니다. 세 번째 인자는 실제로 재시도를 시도할지 결정하는 콜러블이어야 합니다. 예를 들어, 최초 요청이 `ConnectionException`을 만났을 때만 재시도하고 싶을 수 있습니다:

```php
use Exception;
use Illuminate\Http\Client\PendingRequest;

$response = Http::retry(3, 100, function (Exception $exception, PendingRequest $request) {
    return $exception instanceof ConnectionException;
})->post(/* ... */);
```

요청 시도가 실패하면, 새로운 시도가 이루어지기 전에 요청을 변경하고 싶을 수 있습니다. 이는 `retry` 메서드에 제공한 콜러블의 요청 인자를 수정하여 달성할 수 있습니다. 예를 들어, 첫 번째 시도에서 인증 오류가 반환되면 새로운 인증 토큰으로 요청을 재시도하고 싶을 수 있습니다:

```php
use Exception;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;

$response = Http::withToken($this->getToken())->retry(2, 0, function (Exception $exception, PendingRequest $request) {
    if (! $exception instanceof RequestException || $exception->response->status() !== 401) {
        return false;
    }

    $request->withToken($this->getNewToken());

    return true;
})->post(/* ... */);
```

모든 요청이 실패하면, `Illuminate\Http\Client\RequestException` 인스턴스가 발생합니다. 이 동작을 비활성화하고 싶다면, `throw` 인자를 `false`로 지정할 수 있습니다. 비활성화하면, 모든 재시도 후 클라이언트가 받은 마지막 응답이 반환됩니다:

```php
$response = Http::retry(3, 100, throw: false)->post(/* ... */);
```

> [!WARNING]
> 모든 요청이 연결 문제로 실패한 경우, `throw` 인자가 `false`로 설정되어 있어도 `Illuminate\Http\Client\ConnectionException`이 여전히 발생합니다.


### 에러 처리 {#error-handling}

Guzzle의 기본 동작과 달리, Laravel의 HTTP 클라이언트 래퍼는 클라이언트 또는 서버 오류(`400` 및 `500` 레벨 응답)에서 예외를 발생시키지 않습니다. 이러한 오류가 반환되었는지 확인하려면 `successful`, `clientError`, `serverError` 메서드를 사용할 수 있습니다:

```php
// 상태 코드가 >= 200 이고 < 300 인지 확인...
$response->successful();

// 상태 코드가 >= 400 인지 확인...
$response->failed();

// 응답이 400 레벨 상태 코드를 가졌는지 확인...
$response->clientError();

// 응답이 500 레벨 상태 코드를 가졌는지 확인...
$response->serverError();

// 클라이언트 또는 서버 오류가 발생하면 즉시 콜백 실행...
$response->onError(callable $callback);
```


#### 예외 발생시키기 {#throwing-exceptions}

응답 인스턴스가 있고, 응답 상태 코드가 클라이언트 또는 서버 오류를 나타내면 `Illuminate\Http\Client\RequestException` 인스턴스를 발생시키고 싶다면, `throw` 또는 `throwIf` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Client\Response;

$response = Http::post(/* ... */);

// 클라이언트 또는 서버 오류가 발생하면 예외 발생...
$response->throw();

// 오류가 발생했고 주어진 조건이 true이면 예외 발생...
$response->throwIf($condition);

// 오류가 발생했고 주어진 클로저가 true를 반환하면 예외 발생...
$response->throwIf(fn (Response $response) => true);

// 오류가 발생했고 주어진 조건이 false이면 예외 발생...
$response->throwUnless($condition);

// 오류가 발생했고 주어진 클로저가 false를 반환하면 예외 발생...
$response->throwUnless(fn (Response $response) => false);

// 응답이 특정 상태 코드를 가지면 예외 발생...
$response->throwIfStatus(403);

// 응답이 특정 상태 코드를 가지지 않으면 예외 발생...
$response->throwUnlessStatus(200);

return $response['user']['id'];
```

`Illuminate\Http\Client\RequestException` 인스턴스는 반환된 응답을 검사할 수 있는 public `$response` 프로퍼티를 가지고 있습니다.

`throw` 메서드는 오류가 없으면 응답 인스턴스를 반환하므로, `throw` 메서드에 다른 연산을 체이닝할 수 있습니다:

```php
return Http::post(/* ... */)->throw()->json();
```

예외가 발생하기 전에 추가 로직을 수행하고 싶다면, `throw` 메서드에 클로저를 전달할 수 있습니다. 클로저가 실행된 후 예외는 자동으로 발생하므로, 클로저 내에서 예외를 다시 발생시킬 필요는 없습니다:

```php
use Illuminate\Http\Client\Response;
use Illuminate\Http\Client\RequestException;

return Http::post(/* ... */)->throw(function (Response $response, RequestException $e) {
    // ...
})->json();
```

기본적으로, `RequestException` 메시지는 로그 또는 리포트 시 120자로 잘립니다. 이 동작을 커스터마이즈하거나 비활성화하려면, 애플리케이션의 `bootstrap/app.php` 파일에서 `truncateRequestExceptionsAt` 및 `dontTruncateRequestExceptions` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Foundation\Configuration\Exceptions;

->withExceptions(function (Exceptions $exceptions) {
    // 요청 예외 메시지를 240자로 잘라내기...
    $exceptions->truncateRequestExceptionsAt(240);

    // 요청 예외 메시지 잘라내기 비활성화...
    $exceptions->dontTruncateRequestExceptions();
})
```

또는, 요청별로 예외 잘라내기 동작을 커스터마이즈하려면 `truncateExceptionsAt` 메서드를 사용할 수 있습니다:

```php
return Http::truncateExceptionsAt(240)->post(/* ... */);
```


### Guzzle 미들웨어 {#guzzle-middleware}

Laravel의 HTTP 클라이언트는 Guzzle을 기반으로 하므로, [Guzzle 미들웨어](https://docs.guzzlephp.org/en/stable/handlers-and-middleware.html)를 활용하여 나가는 요청을 조작하거나 들어오는 응답을 검사할 수 있습니다. 나가는 요청을 조작하려면, `withRequestMiddleware` 메서드를 통해 Guzzle 미들웨어를 등록하세요:

```php
use Illuminate\Support\Facades\Http;
use Psr\Http\Message\RequestInterface;

$response = Http::withRequestMiddleware(
    function (RequestInterface $request) {
        return $request->withHeader('X-Example', 'Value');
    }
)->get('http://example.com');
```

마찬가지로, `withResponseMiddleware` 메서드를 통해 들어오는 HTTP 응답을 검사할 수 있습니다:

```php
use Illuminate\Support\Facades\Http;
use Psr\Http\Message\ResponseInterface;

$response = Http::withResponseMiddleware(
    function (ResponseInterface $response) {
        $header = $response->getHeader('X-Example');

        // ...

        return $response;
    }
)->get('http://example.com');
```


#### 전역 미들웨어 {#global-middleware}

때로는 모든 나가는 요청과 들어오는 응답에 적용되는 미들웨어를 등록하고 싶을 수 있습니다. 이를 위해 `globalRequestMiddleware`와 `globalResponseMiddleware` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드들은 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Http;

Http::globalRequestMiddleware(fn ($request) => $request->withHeader(
    'User-Agent', 'Example Application/1.0'
));

Http::globalResponseMiddleware(fn ($response) => $response->withHeader(
    'X-Finished-At', now()->toDateTimeString()
));
```


### Guzzle 옵션 {#guzzle-options}

나가는 요청에 대해 추가적인 [Guzzle 요청 옵션](http://docs.guzzlephp.org/en/stable/request-options.html)을 지정하려면, `withOptions` 메서드를 사용할 수 있습니다. 이 메서드는 키/값 쌍의 배열을 받습니다:

```php
$response = Http::withOptions([
    'debug' => true,
])->get('http://example.com/users');
```


#### 전역 옵션 {#global-options}

모든 나가는 요청에 대한 기본 옵션을 설정하려면, `globalOptions` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Http;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Http::globalOptions([
        'allow_redirects' => false,
    ]);
}
```


## 동시 요청 {#concurrent-requests}

때로는 여러 HTTP 요청을 동시에 보내고 싶을 수 있습니다. 즉, 요청을 순차적으로 보내는 대신 여러 요청을 한 번에 발송하고자 할 때입니다. 이는 느린 HTTP API와 상호작용할 때 상당한 성능 향상을 가져올 수 있습니다.

다행히도, `pool` 메서드를 사용하여 이를 달성할 수 있습니다. `pool` 메서드는 `Illuminate\Http\Client\Pool` 인스턴스를 받는 클로저를 인자로 받아, 요청 풀에 요청을 쉽게 추가할 수 있게 해줍니다:

```php
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

$responses = Http::pool(fn (Pool $pool) => [
    $pool->get('http://localhost/first'),
    $pool->get('http://localhost/second'),
    $pool->get('http://localhost/third'),
]);

return $responses[0]->ok() &&
       $responses[1]->ok() &&
       $responses[2]->ok();
```

보시다시피, 각 응답 인스턴스는 풀에 추가된 순서대로 접근할 수 있습니다. 원한다면, `as` 메서드를 사용하여 요청에 이름을 붙이고, 해당 이름으로 응답에 접근할 수 있습니다:

```php
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

$responses = Http::pool(fn (Pool $pool) => [
    $pool->as('first')->get('http://localhost/first'),
    $pool->as('second')->get('http://localhost/second'),
    $pool->as('third')->get('http://localhost/third'),
]);

return $responses['first']->ok();
```


#### 동시 요청 커스터마이징 {#customizing-concurrent-requests}

`pool` 메서드는 `withHeaders`나 `middleware`와 같은 다른 HTTP 클라이언트 메서드와 체이닝할 수 없습니다. 풀에 추가된 각 요청에 커스텀 헤더나 미들웨어를 적용하려면, 각 요청에서 해당 옵션을 설정해야 합니다:

```php
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

$headers = [
    'X-Example' => 'example',
];

$responses = Http::pool(fn (Pool $pool) => [
    $pool->withHeaders($headers)->get('http://laravel.test/test'),
    $pool->withHeaders($headers)->get('http://laravel.test/test'),
    $pool->withHeaders($headers)->get('http://laravel.test/test'),
]);
```


## 매크로 {#macros}

Laravel HTTP 클라이언트는 "매크로"를 정의할 수 있게 하여, 애플리케이션 전반에서 서비스와 상호작용할 때 공통 요청 경로와 헤더를 유창하고 표현적으로 구성할 수 있습니다. 시작하려면, 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드 내에서 매크로를 정의하세요:

```php
use Illuminate\Support\Facades\Http;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Http::macro('github', function () {
        return Http::withHeaders([
            'X-Example' => 'example',
        ])->baseUrl('https://github.com');
    });
}
```

매크로가 설정되면, 애플리케이션 어디에서나 해당 매크로를 호출하여 지정된 설정의 대기 중인 요청을 만들 수 있습니다:

```php
$response = Http::github()->get('/');
```


## 테스트 {#testing}

많은 Laravel 서비스는 테스트를 쉽고 표현적으로 작성할 수 있도록 기능을 제공합니다. Laravel의 HTTP 클라이언트도 예외는 아닙니다. `Http` 파사드의 `fake` 메서드를 사용하면, 요청이 발생할 때 스텁/더미 응답을 반환하도록 HTTP 클라이언트에 지시할 수 있습니다.


### 응답 가짜 처리 {#faking-responses}

예를 들어, 모든 요청에 대해 빈 `200` 상태 코드 응답을 반환하도록 HTTP 클라이언트에 지시하려면, 인자 없이 `fake` 메서드를 호출하면 됩니다:

```php
use Illuminate\Support\Facades\Http;

Http::fake();

$response = Http::post(/* ... */);
```


#### 특정 URL 가짜 처리 {#faking-specific-urls}

또는, `fake` 메서드에 배열을 전달할 수 있습니다. 배열의 키는 가짜로 만들고자 하는 URL 패턴이며, 값은 해당 응답입니다. `*` 문자를 와일드카드로 사용할 수 있습니다. 가짜로 처리되지 않은 URL로의 요청은 실제로 실행됩니다. 이러한 엔드포인트에 대한 스텁/가짜 응답을 만들려면 `Http` 파사드의 `response` 메서드를 사용할 수 있습니다:

```php
Http::fake([
    // GitHub 엔드포인트에 대한 JSON 응답 스텁...
    'github.com/*' => Http::response(['foo' => 'bar'], 200, $headers),

    // Google 엔드포인트에 대한 문자열 응답 스텁...
    'google.com/*' => Http::response('Hello World', 200, $headers),
]);
```

모든 일치하지 않는 URL을 스텁할 기본 URL 패턴을 지정하고 싶다면, 단일 `*` 문자를 사용할 수 있습니다:

```php
Http::fake([
    // GitHub 엔드포인트에 대한 JSON 응답 스텁...
    'github.com/*' => Http::response(['foo' => 'bar'], 200, ['Headers']),

    // 그 외 모든 엔드포인트에 대한 문자열 응답 스텁...
    '*' => Http::response('Hello World', 200, ['Headers']),
]);
```

편의를 위해, 문자열, JSON, 빈 응답을 각각 문자열, 배열, 정수로 지정하여 간단하게 생성할 수 있습니다:

```php
Http::fake([
    'google.com/*' => 'Hello World',
    'github.com/*' => ['foo' => 'bar'],
    'chatgpt.com/*' => 200,
]);
```


#### 예외 가짜 처리 {#faking-connection-exceptions}

HTTP 클라이언트가 요청을 시도할 때 `Illuminate\Http\Client\ConnectionException`을 만나는 경우 애플리케이션의 동작을 테스트해야 할 때가 있습니다. `failedConnection` 메서드를 사용하여 HTTP 클라이언트가 연결 예외를 발생시키도록 할 수 있습니다:

```php
Http::fake([
    'github.com/*' => Http::failedConnection(),
]);
```

`Illuminate\Http\Client\RequestException`이 발생하는 경우를 테스트하려면, `failedRequest` 메서드를 사용할 수 있습니다:

```php
Http::fake([
    'github.com/*' => Http::failedRequest(['code' => 'not_found'], 404),
]);
```


#### 응답 시퀀스 가짜 처리 {#faking-response-sequences}

하나의 URL이 특정 순서로 일련의 가짜 응답을 반환하도록 지정해야 할 때가 있습니다. `Http::sequence` 메서드를 사용하여 응답을 구성할 수 있습니다:

```php
Http::fake([
    // GitHub 엔드포인트에 대한 일련의 응답 스텁...
    'github.com/*' => Http::sequence()
        ->push('Hello World', 200)
        ->push(['foo' => 'bar'], 200)
        ->pushStatus(404),
]);
```

응답 시퀀스의 모든 응답이 소진되면, 추가 요청은 예외를 발생시킵니다. 시퀀스가 비었을 때 반환할 기본 응답을 지정하고 싶다면, `whenEmpty` 메서드를 사용할 수 있습니다:

```php
Http::fake([
    // GitHub 엔드포인트에 대한 일련의 응답 스텁...
    'github.com/*' => Http::sequence()
        ->push('Hello World', 200)
        ->push(['foo' => 'bar'], 200)
        ->whenEmpty(Http::response()),
]);
```

특정 URL 패턴을 지정할 필요 없이 응답 시퀀스를 가짜로 만들고 싶다면, `Http::fakeSequence` 메서드를 사용할 수 있습니다:

```php
Http::fakeSequence()
    ->push('Hello World', 200)
    ->whenEmpty(Http::response());
```


#### 가짜 콜백 {#fake-callback}

특정 엔드포인트에 대해 반환할 응답을 결정하는 더 복잡한 로직이 필요하다면, `fake` 메서드에 클로저를 전달할 수 있습니다. 이 클로저는 `Illuminate\Http\Client\Request` 인스턴스를 받으며, 응답 인스턴스를 반환해야 합니다. 클로저 내에서 필요한 모든 로직을 수행하여 어떤 응답을 반환할지 결정할 수 있습니다:

```php
use Illuminate\Http\Client\Request;

Http::fake(function (Request $request) {
    return Http::response('Hello World', 200);
});
```


### 불필요한 요청 방지 {#preventing-stray-requests}

HTTP 클라이언트를 통해 전송된 모든 요청이 개별 테스트 또는 전체 테스트 스위트에서 가짜로 처리되었는지 보장하고 싶다면, `preventStrayRequests` 메서드를 호출할 수 있습니다. 이 메서드 호출 후, 해당하는 가짜 응답이 없는 요청은 실제 HTTP 요청을 보내는 대신 예외를 발생시킵니다:

```php
use Illuminate\Support\Facades\Http;

Http::preventStrayRequests();

Http::fake([
    'github.com/*' => Http::response('ok'),
]);

// "ok" 응답이 반환됨...
Http::get('https://github.com/laravel/framework');

// 예외가 발생함...
Http::get('https://laravel.com');
```


### 요청 검사 {#inspecting-requests}

응답을 가짜로 처리할 때, 클라이언트가 받은 요청을 검사하여 애플리케이션이 올바른 데이터나 헤더를 보내는지 확인하고 싶을 때가 있습니다. `Http::fake` 호출 후 `Http::assertSent` 메서드를 호출하여 이를 달성할 수 있습니다.

`assertSent` 메서드는 `Illuminate\Http\Client\Request` 인스턴스를 받는 클로저를 인자로 받으며, 요청이 기대에 부합하면 true를 반환해야 합니다. 테스트가 통과하려면, 주어진 기대에 부합하는 요청이 최소 한 번은 발행되어야 합니다:

```php
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

Http::fake();

Http::withHeaders([
    'X-First' => 'foo',
])->post('http://example.com/users', [
    'name' => 'Taylor',
    'role' => 'Developer',
]);

Http::assertSent(function (Request $request) {
    return $request->hasHeader('X-First', 'foo') &&
           $request->url() == 'http://example.com/users' &&
           $request['name'] == 'Taylor' &&
           $request['role'] == 'Developer';
});
```

필요하다면, `assertNotSent` 메서드를 사용하여 특정 요청이 전송되지 않았는지 확인할 수 있습니다:

```php
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

Http::fake();

Http::post('http://example.com/users', [
    'name' => 'Taylor',
    'role' => 'Developer',
]);

Http::assertNotSent(function (Request $request) {
    return $request->url() === 'http://example.com/posts';
});
```

`assertSentCount` 메서드를 사용하여 테스트 중 "전송된" 요청의 개수를 검증할 수 있습니다:

```php
Http::fake();

Http::assertSentCount(5);
```

또는, `assertNothingSent` 메서드를 사용하여 테스트 중 아무 요청도 전송되지 않았는지 검증할 수 있습니다:

```php
Http::fake();

Http::assertNothingSent();
```


#### 요청/응답 기록 {#recording-requests-and-responses}

`recorded` 메서드를 사용하여 모든 요청과 해당 응답을 수집할 수 있습니다. `recorded` 메서드는 `Illuminate\Http\Client\Request`와 `Illuminate\Http\Client\Response` 인스턴스를 담은 배열의 컬렉션을 반환합니다:

```php
Http::fake([
    'https://laravel.com' => Http::response(status: 500),
    'https://nova.laravel.com/' => Http::response(),
]);

Http::get('https://laravel.com');
Http::get('https://nova.laravel.com/');

$recorded = Http::recorded();

[$request, $response] = $recorded[0];
```

또한, `recorded` 메서드는 `Illuminate\Http\Client\Request`와 `Illuminate\Http\Client\Response` 인스턴스를 받는 클로저를 인자로 받아, 기대에 따라 요청/응답 쌍을 필터링하는 데 사용할 수 있습니다:

```php
use Illuminate\Http\Client\Request;
use Illuminate\Http\Client\Response;

Http::fake([
    'https://laravel.com' => Http::response(status: 500),
    'https://nova.laravel.com/' => Http::response(),
]);

Http::get('https://laravel.com');
Http::get('https://nova.laravel.com/');

$recorded = Http::recorded(function (Request $request, Response $response) {
    return $request->url() !== 'https://laravel.com' &&
           $response->successful();
});
```


## 이벤트 {#events}

Laravel은 HTTP 요청을 보내는 과정에서 세 가지 이벤트를 발생시킵니다. `RequestSending` 이벤트는 요청이 전송되기 전에 발생하며, `ResponseReceived` 이벤트는 특정 요청에 대한 응답을 받은 후 발생합니다. `ConnectionFailed` 이벤트는 특정 요청에 대한 응답을 받지 못한 경우 발생합니다.

`RequestSending`과 `ConnectionFailed` 이벤트는 모두 `Illuminate\Http\Client\Request` 인스턴스를 검사할 수 있는 public `$request` 프로퍼티를 포함합니다. 마찬가지로, `ResponseReceived` 이벤트는 `$request` 프로퍼티와 함께 `Illuminate\Http\Client\Response` 인스턴스를 검사할 수 있는 `$response` 프로퍼티도 포함합니다. 애플리케이션 내에서 이러한 이벤트에 대한 [이벤트 리스너](/laravel/12.x/events)를 생성할 수 있습니다:

```php
use Illuminate\Http\Client\Events\RequestSending;

class LogRequest
{
    /**
     * 이벤트를 처리합니다.
     */
    public function handle(RequestSending $event): void
    {
        // $event->request ...
    }
}
```
