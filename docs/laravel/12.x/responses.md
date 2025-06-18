# [기본] HTTP 응답























## 응답 생성하기 {#creating-responses}


#### 문자열과 배열 {#strings-arrays}

모든 라우트와 컨트롤러는 사용자의 브라우저로 전송될 응답을 반환해야 합니다. Laravel은 여러 가지 방법으로 응답을 반환할 수 있도록 지원합니다. 가장 기본적인 방법은 라우트나 컨트롤러에서 문자열을 반환하는 것입니다. 프레임워크는 문자열을 자동으로 전체 HTTP 응답으로 변환합니다:

```php
Route::get('/', function () {
    return 'Hello World';
});
```

라우트나 컨트롤러에서 문자열뿐만 아니라 배열도 반환할 수 있습니다. 프레임워크는 배열을 자동으로 JSON 응답으로 변환합니다:

```php
Route::get('/', function () {
    return [1, 2, 3];
});
```

> [!NOTE]
> 라우트나 컨트롤러에서 [Eloquent 컬렉션](/laravel/12.x/eloquent-collections)도 반환할 수 있다는 사실을 알고 계셨나요? 이 또한 자동으로 JSON으로 변환됩니다. 한 번 시도해보세요!


#### 응답 객체 {#response-objects}

일반적으로 라우트 액션에서 단순한 문자열이나 배열만 반환하지 않습니다. 대신, 전체 `Illuminate\Http\Response` 인스턴스나 [뷰](/laravel/12.x/views)를 반환하게 됩니다.

전체 `Response` 인스턴스를 반환하면 응답의 HTTP 상태 코드와 헤더를 자유롭게 커스터마이즈할 수 있습니다. `Response` 인스턴스는 `Symfony\Component\HttpFoundation\Response` 클래스를 상속받으며, 다양한 HTTP 응답을 생성할 수 있는 여러 메서드를 제공합니다:

```php
Route::get('/home', function () {
    return response('Hello World', 200)
        ->header('Content-Type', 'text/plain');
});
```


#### Eloquent 모델과 컬렉션 {#eloquent-models-and-collections}

[엘로퀀트 ORM](/laravel/12.x/eloquent) 모델과 컬렉션을 라우트나 컨트롤러에서 직접 반환할 수도 있습니다. 이렇게 하면 라라벨이 모델의 [숨김 속성](/laravel/12.x/eloquent-serialization#hiding-attributes-from-json)을 존중하면서, 해당 모델과 컬렉션을 자동으로 JSON 응답으로 변환해줍니다:

```php
use App\Models\User;

Route::get('/user/{user}', function (User $user) {
    return $user;
});
```


### 응답에 헤더 추가하기 {#attaching-headers-to-responses}

대부분의 응답 메서드는 체이닝이 가능하므로, 응답 인스턴스를 유연하게 생성할 수 있습니다. 예를 들어, `header` 메서드를 사용하여 응답에 여러 개의 헤더를 추가한 뒤 사용자에게 반환할 수 있습니다:

```php
return response($content)
    ->header('Content-Type', $type)
    ->header('X-Header-One', 'Header Value')
    ->header('X-Header-Two', 'Header Value');
```

또는, `withHeaders` 메서드를 사용하여 추가할 헤더들을 배열로 한 번에 지정할 수도 있습니다:

```php
return response($content)
    ->withHeaders([
        'Content-Type' => $type,
        'X-Header-One' => 'Header Value',
        'X-Header-Two' => 'Header Value',
    ]);
```


#### 캐시 제어 미들웨어 {#cache-control-middleware}

Laravel에는 `cache.headers` 미들웨어가 포함되어 있어, 여러 라우트에 대해 `Cache-Control` 헤더를 빠르게 설정할 수 있습니다. 지시어는 해당 cache-control 지시어의 "스네이크 케이스(snake case)" 형태로 제공해야 하며, 세미콜론(;)으로 구분합니다. 만약 지시어 목록에 `etag`가 포함되어 있다면, 응답 내용의 MD5 해시가 자동으로 ETag 식별자로 설정됩니다:

```php
Route::middleware('cache.headers:public;max_age=2628000;etag')->group(function () {
    Route::get('/privacy', function () {
        // ...
    });

    Route::get('/terms', function () {
        // ...
    });
});
```


### 응답에 쿠키 첨부하기 {#attaching-cookies-to-responses}

`Illuminate\Http\Response` 인스턴스에 `cookie` 메서드를 사용하여 쿠키를 첨부할 수 있습니다. 이 메서드에는 쿠키의 이름, 값, 그리고 쿠키가 유효한 시간(분 단위)을 전달해야 합니다:

```php
return response('Hello World')->cookie(
    'name', 'value', $minutes
);
```

`cookie` 메서드는 추가적으로 몇 가지 인자를 더 받을 수 있습니다. 일반적으로 이 인자들은 PHP의 기본 [setcookie](https://secure.php.net/manual/en/function.setcookie.php) 함수에 전달하는 인자들과 동일한 목적과 의미를 가집니다:

```php
return response('Hello World')->cookie(
    'name', 'value', $minutes, $path, $domain, $secure, $httpOnly
);
```

아직 응답 인스턴스가 없지만, 쿠키가 응답과 함께 전송되도록 하고 싶다면, `Cookie` 파사드를 사용하여 쿠키를 "큐"에 등록할 수 있습니다. `queue` 메서드는 쿠키 인스턴스를 생성하는 데 필요한 인자들을 받으며, 이렇게 큐에 등록된 쿠키는 브라우저로 응답이 전송되기 전에 응답에 첨부됩니다:

```php
use Illuminate\Support\Facades\Cookie;

Cookie::queue('name', 'value', $minutes);
```


#### 쿠키 인스턴스 생성하기 {#generating-cookie-instances}

나중에 응답 인스턴스에 첨부할 수 있는 `Symfony\Component\HttpFoundation\Cookie` 인스턴스를 생성하고 싶다면, 전역 `cookie` 헬퍼를 사용할 수 있습니다. 이 쿠키는 응답 인스턴스에 첨부되지 않는 한 클라이언트로 전송되지 않습니다:

```php
$cookie = cookie('name', 'value', $minutes);

return response('Hello World')->cookie($cookie);
```


#### 쿠키 조기 만료시키기 {#expiring-cookies-early}

아웃고잉(Outgoing) 응답의 `withoutCookie` 메서드를 사용하여 쿠키를 만료시켜 제거할 수 있습니다:

```php
return response('Hello World')->withoutCookie('name');
```

아직 아웃고잉 응답 인스턴스가 없다면, `Cookie` 파사드의 `expire` 메서드를 사용하여 쿠키를 만료시킬 수 있습니다:

```php
Cookie::expire('name');
```


### 쿠키와 암호화 {#cookies-and-encryption}

기본적으로, `Illuminate\Cookie\Middleware\EncryptCookies` 미들웨어 덕분에 Laravel에서 생성된 모든 쿠키는 암호화되고 서명되어 클라이언트가 쿠키를 수정하거나 읽을 수 없습니다. 만약 애플리케이션에서 생성되는 일부 쿠키에 대해 암호화를 비활성화하고 싶다면, 애플리케이션의 `bootstrap/app.php` 파일에서 `encryptCookies` 메서드를 사용할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->encryptCookies(except: [
        'cookie_name',
    ]);
})
```


## 리다이렉트 {#redirects}

리다이렉트 응답은 `Illuminate\Http\RedirectResponse` 클래스의 인스턴스이며, 사용자를 다른 URL로 리다이렉트하는 데 필요한 적절한 헤더를 포함하고 있습니다. `RedirectResponse` 인스턴스를 생성하는 방법에는 여러 가지가 있습니다. 가장 간단한 방법은 전역 `redirect` 헬퍼를 사용하는 것입니다:

```php
Route::get('/dashboard', function () {
    return redirect('/home/dashboard');
});
```

때때로 제출된 폼이 유효하지 않은 경우처럼, 사용자를 이전 위치로 리다이렉트하고 싶을 때가 있습니다. 이럴 때는 전역 `back` 헬퍼 함수를 사용할 수 있습니다. 이 기능은 [세션](/laravel/12.x/session)을 활용하므로, `back` 함수를 호출하는 라우트가 반드시 `web` 미들웨어 그룹을 사용하고 있는지 확인해야 합니다:

```php
Route::post('/user/profile', function () {
    // 요청을 검증합니다...

    return back()->withInput();
});
```


### 네임드 라우트로 리다이렉트하기 {#redirecting-named-routes}

`redirect` 헬퍼를 파라미터 없이 호출하면, `Illuminate\Routing\Redirector` 인스턴스가 반환되어 해당 인스턴스의 모든 메서드를 호출할 수 있습니다. 예를 들어, 네임드 라우트로 `RedirectResponse`를 생성하려면 `route` 메서드를 사용할 수 있습니다:

```php
return redirect()->route('login');
```

라우트에 파라미터가 필요한 경우, 두 번째 인자로 파라미터를 배열 형태로 전달할 수 있습니다:

```php
// 다음과 같은 URI를 가진 라우트: /profile/{id}

return redirect()->route('profile', ['id' => 1]);
```


#### Eloquent 모델을 통한 파라미터 자동 채우기 {#populating-parameters-via-eloquent-models}

"ID" 파라미터가 포함된 라우트로 리다이렉트할 때, 해당 파라미터가 Eloquent 모델에서 채워지는 경우 모델 인스턴스 자체를 전달할 수 있습니다. 이 경우 ID 값이 자동으로 추출됩니다.

```php
// 다음과 같은 URI를 가진 라우트: /profile/{id}

return redirect()->route('profile', [$user]);
```

라우트 파라미터에 들어갈 값을 커스터마이즈하고 싶다면, 라우트 파라미터 정의에서 컬럼명을 지정할 수 있습니다(`/profile/{id:slug}`와 같이). 또는 Eloquent 모델에서 `getRouteKey` 메서드를 오버라이드하여 원하는 값을 반환하도록 할 수도 있습니다.

```php
/**
 * 모델의 라우트 키 값을 반환합니다.
 */
public function getRouteKey(): mixed
{
    return $this->slug;
}
```


### 컨트롤러 액션으로 리다이렉트하기 {#redirecting-controller-actions}

[컨트롤러 액션](/laravel/12.x/controllers)으로 리다이렉트도 생성할 수 있습니다. 이를 위해 `action` 메서드에 컨트롤러와 액션 이름을 전달하면 됩니다:

```php
use App\Http\Controllers\UserController;

return redirect()->action([UserController::class, 'index']);
```

컨트롤러 라우트에 파라미터가 필요한 경우, `action` 메서드의 두 번째 인자로 파라미터를 배열 형태로 전달할 수 있습니다:

```php
return redirect()->action(
    [UserController::class, 'profile'], ['id' => 1]
);
```


### 외부 도메인으로 리디렉션하기 {#redirecting-external-domains}

때때로 애플리케이션 외부의 도메인으로 리디렉션해야 할 때가 있습니다. 이럴 때는 `away` 메서드를 사용하면 됩니다. 이 메서드는 추가적인 URL 인코딩, 검증, 확인 없이 `RedirectResponse`를 생성합니다:

```php
return redirect()->away('https://www.google.com');
```


### 플래시 세션 데이터와 함께 리다이렉트하기 {#redirecting-with-flashed-session-data}

새로운 URL로 리다이렉트하면서 [데이터를 세션에 플래시](/laravel/12.x/session#flash-data)하는 작업은 보통 동시에 이루어집니다. 일반적으로 어떤 작업을 성공적으로 수행한 후, 성공 메시지를 세션에 플래시할 때 사용됩니다. 편의를 위해, `RedirectResponse` 인스턴스를 생성하고 플루언트 메서드 체이닝을 통해 세션에 데이터를 플래시할 수 있습니다:

```php
Route::post('/user/profile', function () {
    // ...

    return redirect('/dashboard')->with('status', '프로필이 업데이트되었습니다!');
});
```

사용자가 리다이렉트된 후, [세션](/laravel/12.x/session)에서 플래시된 메시지를 표시할 수 있습니다. 예를 들어, [Blade 문법](/laravel/12.x/blade)을 사용하면 다음과 같이 작성할 수 있습니다:

```blade
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```


#### 입력값과 함께 리디렉션하기 {#redirecting-with-input}

`RedirectResponse` 인스턴스에서 제공하는 `withInput` 메서드를 사용하면, 사용자를 새로운 위치로 리디렉션하기 전에 현재 요청의 입력 데이터를 세션에 플래시할 수 있습니다. 이는 주로 사용자가 유효성 검사 오류를 만났을 때 사용됩니다. 입력값이 세션에 플래시된 후에는, 다음 요청에서 [이전 입력값을 쉽게 가져와](/laravel/12.x/requests#retrieving-old-input) 폼을 다시 채울 수 있습니다:

```php
return back()->withInput();
```


## 기타 응답 타입 {#other-response-types}

`response` 헬퍼는 다양한 타입의 응답 인스턴스를 생성하는 데 사용할 수 있습니다. `response` 헬퍼를 인자 없이 호출하면, `Illuminate\Contracts\Routing\ResponseFactory` [컨트랙트](/laravel/12.x/contracts)의 구현체가 반환됩니다. 이 컨트랙트는 응답을 생성할 때 유용한 여러 메서드를 제공합니다.


### 뷰 응답 {#view-responses}

응답의 상태 코드와 헤더를 제어해야 하면서, 동시에 [뷰](/laravel/12.x/views)를 응답의 내용으로 반환해야 한다면 `view` 메서드를 사용하면 됩니다:

```php
return response()
    ->view('hello', $data, 200)
    ->header('Content-Type', $type);
```

물론, 커스텀 HTTP 상태 코드나 헤더를 전달할 필요가 없다면 전역 `view` 헬퍼 함수를 사용할 수 있습니다.


### JSON 응답 {#json-responses}

`json` 메서드는 자동으로 `Content-Type` 헤더를 `application/json`으로 설정하며, 전달된 배열을 PHP의 `json_encode` 함수를 사용해 JSON으로 변환합니다:

```php
return response()->json([
    'name' => 'Abigail',
    'state' => 'CA',
]);
```

JSONP 응답을 생성하고 싶다면, `json` 메서드와 `withCallback` 메서드를 함께 사용할 수 있습니다:

```php
return response()
    ->json(['name' => 'Abigail', 'state' => 'CA'])
    ->withCallback($request->input('callback'));
```


### 파일 다운로드 {#file-downloads}

`download` 메서드는 지정된 경로의 파일을 사용자의 브라우저에서 강제로 다운로드하도록 하는 응답을 생성할 때 사용됩니다. `download` 메서드는 두 번째 인자로 파일명을 받을 수 있으며, 이 파일명은 사용자가 파일을 다운로드할 때 보게 되는 이름을 결정합니다. 마지막으로, 세 번째 인자로 HTTP 헤더의 배열을 전달할 수도 있습니다:

```php
return response()->download($pathToFile);

return response()->download($pathToFile, $name, $headers);
```

> [!WARNING]
> 파일 다운로드를 관리하는 Symfony HttpFoundation은 다운로드되는 파일의 파일명이 반드시 ASCII 문자로만 이루어져 있어야 합니다.


### 파일 응답 {#file-responses}

`file` 메서드는 이미지나 PDF와 같은 파일을 다운로드하지 않고 사용자의 브라우저에서 바로 표시할 때 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 파일의 절대 경로를, 두 번째 인자로 헤더의 배열을 받습니다:

```php
return response()->file($pathToFile);

return response()->file($pathToFile, $headers);
```


## 스트리밍 응답 {#streamed-responses}

데이터가 생성되는 즉시 클라이언트로 스트리밍하면, 특히 매우 큰 응답의 경우 메모리 사용량을 크게 줄이고 성능을 향상시킬 수 있습니다. 스트리밍 응답을 사용하면 서버가 모든 데이터를 전송하기 전에 클라이언트가 데이터를 처리하기 시작할 수 있습니다:

```php
Route::get('/stream', function () {
    return response()->stream(function (): void {
        foreach (['developer', 'admin'] as $string) {
            echo $string;
            ob_flush();
            flush();
            sleep(2); // 청크 간 지연을 시뮬레이션...
        }
    }, 200, ['X-Accel-Buffering' => 'no']);
});
```

편의를 위해, `stream` 메서드에 전달한 클로저가 [Generator](https://www.php.net/manual/en/language.generators.overview.php)를 반환하면, Laravel은 생성기가 반환하는 문자열 사이마다 자동으로 출력 버퍼를 플러시하고, Nginx의 출력 버퍼링도 비활성화합니다:

```php
Route::post('/chat', function () {
    return response()->stream(function (): void {
        $stream = OpenAI::client()->chat()->createStreamed(...);

        foreach ($stream as $response) {
            yield $response->choices[0];
        }
    });
});
```


### 스트림 응답 사용하기 {#consuming-streamed-responses}

스트림 응답은 Laravel의 `stream` npm 패키지를 사용하여 소비할 수 있습니다. 이 패키지는 Laravel의 응답 및 이벤트 스트림과 상호작용할 수 있는 편리한 API를 제공합니다. 시작하려면 `@laravel/stream-react` 또는 `@laravel/stream-vue` 패키지를 설치하세요:
::: code-group
```shell [React]
npm install @laravel/stream-react
```

```shell [Vue]
npm install @laravel/stream-vue
```
:::
이후, `useStream`을 사용하여 이벤트 스트림을 소비할 수 있습니다. 스트림 URL을 전달하면, 이 훅은 Laravel 애플리케이션에서 콘텐츠가 반환될 때마다 `data`를 자동으로 이어붙여 업데이트합니다:
::: code-group
```tsx [React]
import { useStream } from "@laravel/stream-react";

function App() {
    const { data, isFetching, isStreaming, send } = useStream("chat");

    const sendMessage = () => {
        send({
            message: `Current timestamp: ${Date.now()}`,
        });
    };

    return (
        <div>
            <div>{data}</div>
            {isFetching && <div>Connecting...</div>}
            {isStreaming && <div>Generating...</div>}
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
}
```

```vue [Vue]
<script setup lang="ts">
import { useStream } from "@laravel/stream-vue";

const { data, isFetching, isStreaming, send } = useStream("chat");

const sendMessage = () => {
    send({
        message: `Current timestamp: ${Date.now()}`,
    });
};
</script>

<template>
    <div>
        <div>{{ data }}</div>
        <div v-if="isFetching">Connecting...</div>
        <div v-if="isStreaming">Generating...</div>
        <button @click="sendMessage">Send Message</button>
    </div>
</template>
```
:::
`send`를 통해 데이터를 스트림으로 다시 보낼 때, 새로운 데이터를 보내기 전에 스트림에 대한 활성 연결이 취소됩니다. 모든 요청은 JSON `POST` 요청으로 전송됩니다.

> [!WARNING]
> `useStream` 훅이 애플리케이션에 `POST` 요청을 보내므로, 유효한 CSRF 토큰이 필요합니다. CSRF 토큰을 제공하는 가장 쉬운 방법은 [애플리케이션 레이아웃의 `head`에 `meta` 태그로 포함하는 것](/laravel/12.x/csrf#csrf-x-csrf-token)입니다.

`useStream`에 전달하는 두 번째 인자는 스트림 소비 동작을 커스터마이즈할 수 있는 옵션 객체입니다. 이 객체의 기본값은 아래와 같습니다:
::: code-group
```tsx [React]
import { useStream } from "@laravel/stream-react";

function App() {
    const { data } = useStream("chat", {
        id: undefined,
        initialInput: undefined,
        headers: undefined,
        csrfToken: undefined,
        onResponse: (response: Response) => void,
        onData: (data: string) => void,
        onCancel: () => void,
        onFinish: () => void,
        onError: (error: Error) => void,
    });

    return <div>{data}</div>;
}
```

```vue [Vue]
<script setup lang="ts">
import { useStream } from "@laravel/stream-vue";

const { data } = useStream("chat", {
    id: undefined,
    initialInput: undefined,
    headers: undefined,
    csrfToken: undefined,
    onResponse: (response: Response) => void,
    onData: (data: string) => void,
    onCancel: () => void,
    onFinish: () => void,
    onError: (error: Error) => void,
});
</script>

<template>
    <div>{{ data }}</div>
</template>
```
:::
`onResponse`는 스트림에서 초기 응답이 성공적으로 반환된 후 호출되며, 원시 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 객체가 콜백에 전달됩니다. `onData`는 각 청크가 수신될 때마다 호출되며, 현재 청크가 콜백에 전달됩니다. `onFinish`는 스트림이 종료되거나 fetch/read 과정에서 에러가 발생할 때 호출됩니다.

기본적으로, 초기화 시 스트림에 요청이 전송되지 않습니다. `initialInput` 옵션을 사용하여 스트림에 초기 페이로드를 전달할 수 있습니다:
::: code-group
```tsx [React]
import { useStream } from "@laravel/stream-react";

function App() {
    const { data } = useStream("chat", {
        initialInput: {
            message: "Introduce yourself.",
        },
    });

    return <div>{data}</div>;
}
```

```vue [Vue]
<script setup lang="ts">
import { useStream } from "@laravel/stream-vue";

const { data } = useStream("chat", {
    initialInput: {
        message: "Introduce yourself.",
    },
});
</script>

<template>
    <div>{{ data }}</div>
</template>
```
:::
스트림을 수동으로 취소하려면, 훅에서 반환된 `cancel` 메서드를 사용할 수 있습니다:
::: code-group
```tsx [React]
import { useStream } from "@laravel/stream-react";

function App() {
    const { data, cancel } = useStream("chat");

    return (
        <div>
            <div>{data}</div>
            <button onClick={cancel}>Cancel</button>
        </div>
    );
}
```

```vue [Vue]
<script setup lang="ts">
import { useStream } from "@laravel/stream-vue";

const { data, cancel } = useStream("chat");
</script>

<template>
    <div>
        <div>{{ data }}</div>
        <button @click="cancel">Cancel</button>
    </div>
</template>
```
:::
`useStream` 훅이 사용될 때마다 스트림을 식별하기 위한 랜덤 `id`가 생성됩니다. 이 값은 각 요청의 `X-STREAM-ID` 헤더로 서버에 전송됩니다. 여러 컴포넌트에서 동일한 스트림을 사용할 때, 직접 `id`를 지정하여 스트림을 읽고 쓸 수 있습니다:
::: code-group
```tsx [React]
// App.tsx
import { useStream } from "@laravel/stream-react";

function App() {
    const { data, id } = useStream("chat");

    return (
        <div>
            <div>{data}</div>
            <StreamStatus id={id} />
        </div>
    );
}

// StreamStatus.tsx
import { useStream } from "@laravel/stream-react";

function StreamStatus({ id }) {
    const { isFetching, isStreaming } = useStream("chat", { id });

    return (
        <div>
            {isFetching && <div>Connecting...</div>}
            {isStreaming && <div>Generating...</div>}
        </div>
    );
}
```

```vue [Vue]
<!-- App.vue -->
<script setup lang="ts">
import { useStream } from "@laravel/stream-vue";
import StreamStatus from "./StreamStatus.vue";

const { data, id } = useStream("chat");
</script>

<template>
    <div>
        <div>{{ data }}</div>
        <StreamStatus :id="id" />
    </div>
</template>

<!-- StreamStatus.vue -->
<script setup lang="ts">
import { useStream } from "@laravel/stream-vue";

const props = defineProps<{
    id: string;
}>();

const { isFetching, isStreaming } = useStream("chat", { id: props.id });
</script>

<template>
    <div>
        <div v-if="isFetching">Connecting...</div>
        <div v-if="isStreaming">Generating...</div>
    </div>
</template>
```
:::

### 스트리밍 JSON 응답 {#streamed-json-responses}

JSON 데이터를 점진적으로 스트리밍해야 할 경우, `streamJson` 메서드를 사용할 수 있습니다. 이 메서드는 대용량 데이터셋을 브라우저로 점진적으로 전송해야 하며, JavaScript에서 쉽게 파싱할 수 있는 형식이 필요할 때 특히 유용합니다:

```php
use App\Models\User;

Route::get('/users.json', function () {
    return response()->streamJson([
        'users' => User::cursor(),
    ]);
});
```

`useJsonStream` 훅은 [`useStream` 훅](#consuming-streamed-responses)과 동일하지만, 스트리밍이 끝난 후 데이터를 JSON으로 파싱하려고 시도한다는 점이 다릅니다:
::: code-group
```tsx [React]
import { useJsonStream } from "@laravel/stream-react";

type User = {
    id: number;
    name: string;
    email: string;
};

function App() {
    const { data, send } = useJsonStream<{ users: User[] }>("users");

    const loadUsers = () => {
        send({
            query: "taylor",
        });
    };

    return (
        <div>
            <ul>
                {data?.users.map((user) => (
                    <li>
                        {user.id}: {user.name}
                    </li>
                ))}
            </ul>
            <button onClick={loadUsers}>Load Users</button>
        </div>
    );
}
```

```vue [Vue]
<script setup lang="ts">
import { useJsonStream } from "@laravel/stream-vue";

type User = {
    id: number;
    name: string;
    email: string;
};

const { data, send } = useJsonStream<{ users: User[] }>("users");

const loadUsers = () => {
    send({
        query: "taylor",
    });
};
</script>

<template>
    <div>
        <ul>
            <li v-for="user in data?.users" :key="user.id">
                {{ user.id }}: {{ user.name }}
            </li>
        </ul>
        <button @click="loadUsers">Load Users</button>
    </div>
</template>
```
:::

### 이벤트 스트림 (SSE) {#event-streams}

`eventStream` 메서드는 `text/event-stream` 콘텐츠 타입을 사용하여 서버 전송 이벤트(SSE) 스트림 응답을 반환할 때 사용할 수 있습니다. `eventStream` 메서드는 클로저를 인자로 받으며, 이 클로저는 응답이 준비될 때마다 [yield](https://www.php.net/manual/en/language.generators.overview.php)를 통해 스트림에 응답을 전달해야 합니다:

```php
Route::get('/chat', function () {
    return response()->eventStream(function () {
        $stream = OpenAI::client()->chat()->createStreamed(...);

        foreach ($stream as $response) {
            yield $response->choices[0];
        }
    });
});
```

이벤트의 이름을 커스터마이즈하고 싶다면, `StreamedEvent` 클래스의 인스턴스를 yield할 수 있습니다:

```php
use Illuminate\Http\StreamedEvent;

yield new StreamedEvent(
    event: 'update',
    data: $response->choices[0],
);
```


#### 이벤트 스트림 소비하기 {#consuming-event-streams}

이벤트 스트림은 Laravel의 `stream` npm 패키지를 사용하여 소비할 수 있습니다. 이 패키지는 Laravel 이벤트 스트림과 상호작용할 수 있는 편리한 API를 제공합니다. 먼저, `@laravel/stream-react` 또는 `@laravel/stream-vue` 패키지를 설치하세요:
::: code-group
```shell [React]
npm install @laravel/stream-react
```

```shell [Vue]
npm install @laravel/stream-vue
```
:::
그 다음, `useEventStream`을 사용하여 이벤트 스트림을 소비할 수 있습니다. 스트림 URL을 전달하면, 이 훅은 Laravel 애플리케이션에서 메시지가 반환될 때마다 `message`를 자동으로 이어붙여 업데이트합니다:
::: code-group
```jsx [React]
import { useEventStream } from "@laravel/stream-react";

function App() {
  const { message } = useEventStream("/chat");

  return <div>{message}</div>;
}
```

```vue [Vue]
<script setup lang="ts">
import { useEventStream } from "@laravel/stream-vue";

const { message } = useEventStream("/chat");
</script>

<template>
  <div>{{ message }}</div>
</template>
```
:::
`useEventStream`의 두 번째 인자는 옵션 객체로, 스트림 소비 동작을 커스터마이즈할 수 있습니다. 이 객체의 기본값은 아래와 같습니다:
::: code-group
```jsx [React]
import { useEventStream } from "@laravel/stream-react";

function App() {
  const { message } = useEventStream("/stream", {
    event: "update",
    onMessage: (message) => {
      //
    },
    onError: (error) => {
      //
    },
    onComplete: () => {
      //
    },
    endSignal: "</stream>",
    glue: " ",
  });

  return <div>{message}</div>;
}
```

```vue [Vue]
<script setup lang="ts">
import { useEventStream } from "@laravel/stream-vue";

const { message } = useEventStream("/chat", {
  event: "update",
  onMessage: (message) => {
    // ...
  },
  onError: (error) => {
    // ...
  },
  onComplete: () => {
    // ...
  },
  endSignal: "</stream>",
  glue: " ",
});
</script>
```
:::
이벤트 스트림은 또한 애플리케이션의 프론트엔드에서 [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) 객체를 통해 수동으로 소비할 수도 있습니다. `eventStream` 메서드는 스트림이 완료되면 자동으로 `</stream>` 업데이트를 이벤트 스트림에 전송합니다:

```js
const source = new EventSource('/chat');

source.addEventListener('update', (event) => {
    if (event.data === '</stream>') {
        source.close();

        return;
    }

    console.log(event.data);
});
```

이벤트 스트림에 전송되는 마지막 이벤트를 커스터마이즈하려면, `eventStream` 메서드의 `endStreamWith` 인자에 `StreamedEvent` 인스턴스를 전달할 수 있습니다:

```php
return response()->eventStream(function () {
    // ...
}, endStreamWith: new StreamedEvent(event: 'update', data: '</stream>'));
```


### 스트리밍 다운로드 {#streamed-downloads}

때때로 어떤 작업의 문자열 응답을 디스크에 저장하지 않고 바로 다운로드 가능한 응답으로 전환하고 싶을 때가 있습니다. 이런 경우에는 `streamDownload` 메서드를 사용할 수 있습니다. 이 메서드는 콜백, 파일명, 그리고 선택적으로 헤더 배열을 인자로 받습니다:

```php
use App\Services\GitHub;

return response()->streamDownload(function () {
    echo GitHub::api('repo')
        ->contents()
        ->readme('laravel', 'laravel')['contents'];
}, 'laravel-readme.md');
```


## 응답 매크로 {#response-macros}

여러 라우트와 컨트롤러에서 재사용할 수 있는 커스텀 응답을 정의하고 싶다면, `Response` 파사드의 `macro` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 [서비스 프로바이더](/laravel/12.x/providers) 중 하나의 `boot` 메서드에서 호출하는 것이 좋습니다. 예를 들어, `App\Providers\AppServiceProvider` 서비스 프로바이더에서 사용할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Response::macro('caps', function (string $value) {
            return Response::make(strtoupper($value));
        });
    }
}
```

`macro` 함수는 첫 번째 인자로 매크로의 이름을, 두 번째 인자로 클로저를 받습니다. 매크로의 클로저는 `ResponseFactory` 구현체나 `response` 헬퍼에서 해당 매크로 이름을 호출할 때 실행됩니다:

```php
return response()->caps('foo');
```
