# [기본] HTTP 요청(Requests)























## 소개 {#introduction}

Laravel의 `Illuminate\Http\Request` 클래스는 현재 애플리케이션에서 처리 중인 HTTP 요청과 상호작용할 수 있는 객체 지향적인 방법을 제공합니다. 또한 요청과 함께 전송된 입력값, 쿠키, 파일을 가져올 수 있습니다.


## 요청과 상호작용하기 {#interacting-with-the-request}


### 요청 접근하기 {#accessing-the-request}

현재 HTTP 요청 인스턴스를 의존성 주입을 통해 얻으려면, 라우트 클로저나 컨트롤러 메서드에서 `Illuminate\Http\Request` 클래스를 타입힌트하면 됩니다. 들어오는 요청 인스턴스는 Laravel [서비스 컨테이너](/laravel/12.x/container)에 의해 자동으로 주입됩니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * 새로운 사용자를 저장합니다.
     */
    public function store(Request $request): RedirectResponse
    {
        $name = $request->input('name');

        // 사용자를 저장합니다...

        return redirect('/users');
    }
}
```

앞서 언급했듯이, 라우트 클로저에서도 `Illuminate\Http\Request` 클래스를 타입힌트할 수 있습니다. 서비스 컨테이너는 클로저가 실행될 때 들어오는 요청을 자동으로 주입해줍니다:

```php
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {
    // ...
});
```


#### 의존성 주입과 라우트 파라미터 {#dependency-injection-route-parameters}

컨트롤러 메서드에서 라우트 파라미터의 입력도 기대하는 경우, 다른 의존성들 뒤에 라우트 파라미터를 나열해야 합니다. 예를 들어, 라우트가 다음과 같이 정의되어 있다면:

```php
use App\Http\Controllers\UserController;

Route::put('/user/{id}', [UserController::class, 'update']);
```

여전히 `Illuminate\Http\Request`를 타입힌트할 수 있으며, 컨트롤러 메서드를 아래와 같이 정의하여 `id` 라우트 파라미터에도 접근할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * 지정된 사용자를 업데이트합니다.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // 사용자를 업데이트합니다...

        return redirect('/users');
    }
}
```


### 요청 경로, 호스트, 그리고 메서드 {#request-path-and-method}

`Illuminate\Http\Request` 인스턴스는 들어오는 HTTP 요청을 확인할 수 있는 다양한 메서드를 제공하며, `Symfony\Component\HttpFoundation\Request` 클래스를 확장합니다. 아래에서 가장 중요한 몇 가지 메서드에 대해 살펴보겠습니다.


#### 요청 경로 가져오기 {#retrieving-the-request-path}

`path` 메서드는 요청의 경로 정보를 반환합니다. 예를 들어, 들어오는 요청이 `http://example.com/foo/bar`를 대상으로 한다면, `path` 메서드는 `foo/bar`를 반환합니다:

```php
$uri = $request->path();
```


#### 요청 경로 / 라우트 검사하기 {#inspecting-the-request-path}

`is` 메서드를 사용하면 들어오는 요청 경로가 주어진 패턴과 일치하는지 확인할 수 있습니다. 이 메서드를 사용할 때 `*` 문자를 와일드카드로 사용할 수 있습니다:

```php
if ($request->is('admin/*')) {
    // ...
}
```

`routeIs` 메서드를 사용하면 들어오는 요청이 [이름이 지정된 라우트](/laravel/12.x/routing#named-routes)와 일치하는지 확인할 수 있습니다:

```php
if ($request->routeIs('admin.*')) {
    // ...
}
```


#### 요청 URL 가져오기 {#retrieving-the-request-url}

들어오는 요청의 전체 URL을 가져오려면 `url` 또는 `fullUrl` 메서드를 사용할 수 있습니다. `url` 메서드는 쿼리 문자열을 제외한 URL을 반환하고, `fullUrl` 메서드는 쿼리 문자열을 포함한 전체 URL을 반환합니다:

```php
$url = $request->url();

$urlWithQueryString = $request->fullUrl();
```

현재 URL에 쿼리 문자열 데이터를 추가하고 싶다면 `fullUrlWithQuery` 메서드를 사용할 수 있습니다. 이 메서드는 전달된 쿼리 문자열 변수 배열을 현재 쿼리 문자열과 병합합니다:

```php
$request->fullUrlWithQuery(['type' => 'phone']);
```

특정 쿼리 문자열 파라미터를 제외한 현재 URL을 얻고 싶다면 `fullUrlWithoutQuery` 메서드를 사용할 수 있습니다:

```php
$request->fullUrlWithoutQuery(['type']);
```


#### 요청 호스트 가져오기 {#retrieving-the-request-host}

들어오는 요청의 "호스트"를 가져오려면 `host`, `httpHost`, `schemeAndHttpHost` 메서드를 사용할 수 있습니다:

```php
$request->host();
$request->httpHost();
$request->schemeAndHttpHost();
```


#### 요청 메서드 가져오기 {#retrieving-the-request-method}

`method` 메서드는 요청의 HTTP 메서드(HTTP verb)를 반환합니다. 또한, `isMethod` 메서드를 사용하여 HTTP 메서드가 특정 문자열과 일치하는지 확인할 수 있습니다:

```php
$method = $request->method();

if ($request->isMethod('post')) {
    // ...
}
```


### 요청 헤더 {#request-headers}

`Illuminate\Http\Request` 인스턴스에서 `header` 메서드를 사용하여 요청 헤더를 가져올 수 있습니다. 해당 헤더가 요청에 없으면 `null`이 반환됩니다. 하지만, `header` 메서드는 두 번째 인자로 기본값을 받을 수 있으며, 헤더가 없을 경우 이 값이 반환됩니다:

```php
$value = $request->header('X-Header-Name');

$value = $request->header('X-Header-Name', 'default');
```

`hasHeader` 메서드를 사용하면 요청에 특정 헤더가 포함되어 있는지 확인할 수 있습니다:

```php
if ($request->hasHeader('X-Header-Name')) {
    // ...
}
```

편의를 위해, `bearerToken` 메서드를 사용하면 `Authorization` 헤더에서 bearer 토큰을 가져올 수 있습니다. 해당 헤더가 없으면 빈 문자열이 반환됩니다:

```php
$token = $request->bearerToken();
```


### 요청 IP 주소 {#request-ip-address}

`ip` 메서드를 사용하면 요청을 보낸 클라이언트의 IP 주소를 가져올 수 있습니다:

```php
$ipAddress = $request->ip();
```

프록시를 통해 전달된 모든 클라이언트 IP 주소를 포함한 IP 주소 배열을 가져오고 싶다면 `ips` 메서드를 사용할 수 있습니다. "원래" 클라이언트 IP 주소는 배열의 마지막에 위치합니다:

```php
$ipAddresses = $request->ips();
```

일반적으로 IP 주소는 신뢰할 수 없는 사용자 제어 입력으로 간주되어야 하며, 정보 제공 용도로만 사용해야 합니다.


### 콘텐츠 협상 {#content-negotiation}

Laravel은 `Accept` 헤더를 통해 들어오는 요청이 원하는 콘텐츠 타입을 확인할 수 있는 여러 메서드를 제공합니다. 먼저, `getAcceptableContentTypes` 메서드는 요청에서 허용하는 모든 콘텐츠 타입이 담긴 배열을 반환합니다:

```php
$contentTypes = $request->getAcceptableContentTypes();
```

`accepts` 메서드는 콘텐츠 타입 배열을 인자로 받아, 요청이 이 중 하나라도 허용하면 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다:

```php
if ($request->accepts(['text/html', 'application/json'])) {
    // ...
}
```

`prefers` 메서드를 사용하면 주어진 콘텐츠 타입 배열 중에서 요청이 가장 선호하는 타입을 확인할 수 있습니다. 만약 제공된 콘텐츠 타입 중 요청이 허용하는 것이 없다면 `null`이 반환됩니다:

```php
$preferred = $request->prefers(['text/html', 'application/json']);
```

많은 애플리케이션이 HTML 또는 JSON만 제공하므로, 들어오는 요청이 JSON 응답을 기대하는지 빠르게 확인하려면 `expectsJson` 메서드를 사용할 수 있습니다:

```php
if ($request->expectsJson()) {
    // ...
}
```


### PSR-7 요청 {#psr7-requests}

[PSR-7 표준](https://www.php-fig.org/psr/psr-7/)은 요청과 응답을 포함한 HTTP 메시지에 대한 인터페이스를 명시합니다. Laravel의 요청 대신 PSR-7 요청 인스턴스를 얻고 싶다면, 몇 가지 라이브러리를 먼저 설치해야 합니다. Laravel은 _Symfony HTTP Message Bridge_ 컴포넌트를 사용하여 일반적인 Laravel 요청과 응답을 PSR-7 호환 구현체로 변환합니다:

```shell
composer require symfony/psr-http-message-bridge
composer require nyholm/psr7
```

이 라이브러리들을 설치한 후, 라우트 클로저나 컨트롤러 메서드에서 요청 인터페이스를 타입힌트하여 PSR-7 요청을 받을 수 있습니다:

```php
use Psr\Http\Message\ServerRequestInterface;

Route::get('/', function (ServerRequestInterface $request) {
    // ...
});
```

> [!NOTE]
> 라우트나 컨트롤러에서 PSR-7 응답 인스턴스를 반환하면, 프레임워크가 이를 자동으로 Laravel 응답 인스턴스로 변환하여 출력합니다.


## 입력값 {#input}


### 입력값 가져오기 {#retrieving-input}


#### 모든 입력 데이터 가져오기 {#retrieving-all-input-data}

`all` 메서드를 사용하면 들어오는 요청의 모든 입력 데이터를 `array` 형태로 가져올 수 있습니다. 이 메서드는 요청이 HTML 폼이든 XHR 요청이든 상관없이 사용할 수 있습니다:

```php
$input = $request->all();
```

`collect` 메서드를 사용하면 들어오는 요청의 모든 입력 데이터를 [컬렉션](/laravel/12.x/collections)으로 가져올 수 있습니다:

```php
$input = $request->collect();
```

또한, `collect` 메서드를 사용하여 들어오는 요청 입력값의 일부만 컬렉션으로 가져올 수도 있습니다:

```php
$request->collect('users')->each(function (string $user) {
    // ...
});
```


#### 입력값 하나 가져오기 {#retrieving-an-input-value}

몇 가지 간단한 메서드를 사용하여, 요청이 어떤 HTTP 메서드로 왔는지 신경 쓰지 않고도 `Illuminate\Http\Request` 인스턴스에서 모든 사용자 입력값에 접근할 수 있습니다. HTTP 메서드와 상관없이 `input` 메서드를 사용해 사용자 입력값을 가져올 수 있습니다:

```php
$name = $request->input('name');
```

`input` 메서드의 두 번째 인자로 기본값을 전달할 수 있습니다. 요청에 해당 입력값이 없을 경우 이 값이 반환됩니다:

```php
$name = $request->input('name', 'Sally');
```

배열 형태의 입력값이 포함된 폼을 다룰 때는 "dot" 표기법을 사용해 배열에 접근할 수 있습니다:

```php
$name = $request->input('products.0.name');

$names = $request->input('products.*.name');
```

`input` 메서드를 인자 없이 호출하면 모든 입력값을 연관 배열로 가져올 수 있습니다:

```php
$input = $request->input();
```


#### 쿼리 문자열에서 입력값 가져오기 {#retrieving-input-from-the-query-string}

`input` 메서드는 전체 요청 페이로드(쿼리 문자열을 포함)에서 값을 가져오지만, `query` 메서드는 오직 쿼리 문자열에서만 값을 가져옵니다:

```php
$name = $request->query('name');
```

요청한 쿼리 문자열 값이 없을 경우, 이 메서드의 두 번째 인자로 전달한 값이 반환됩니다:

```php
$name = $request->query('name', 'Helen');
```

`query` 메서드를 인자 없이 호출하면 모든 쿼리 문자열 값을 연관 배열로 가져올 수 있습니다:

```php
$query = $request->query();
```


#### JSON 입력값 가져오기 {#retrieving-json-input-values}

애플리케이션에 JSON 요청을 보낼 때, 요청의 `Content-Type` 헤더가 `application/json`으로 올바르게 설정되어 있다면 `input` 메서드를 통해 JSON 데이터를 가져올 수 있습니다. 또한, "dot" 표기법을 사용하여 JSON 배열이나 객체 내부에 중첩된 값도 가져올 수 있습니다:

```php
$name = $request->input('user.name');
```


#### Stringable 입력값 가져오기 {#retrieving-stringable-input-values}

요청 입력값을 기본 `string` 타입으로 가져오는 대신, `string` 메서드를 사용하여 [Illuminate\Support\Stringable](/laravel/12.x/strings) 인스턴스로 데이터를 가져올 수 있습니다:

```php
$name = $request->string('name')->trim();
```


#### 정수형 입력값 가져오기 {#retrieving-integer-input-values}

입력값을 정수형으로 가져오려면 `integer` 메서드를 사용할 수 있습니다. 이 메서드는 입력값을 정수로 변환하려 시도합니다. 입력값이 없거나 변환에 실패할 경우, 지정한 기본값을 반환합니다. 이 방법은 페이지네이션이나 기타 숫자 입력값을 처리할 때 특히 유용합니다:

```php
$perPage = $request->integer('per_page');
```


#### 불리언 입력값 가져오기 {#retrieving-boolean-input-values}

체크박스와 같은 HTML 요소를 다룰 때, 애플리케이션은 실제로는 문자열인 "truthy" 값을 받을 수 있습니다. 예를 들어, "true"나 "on"과 같은 값입니다. 편의를 위해, 이러한 값을 불리언으로 변환하려면 `boolean` 메서드를 사용할 수 있습니다. `boolean` 메서드는 1, "1", true, "true", "on", "yes"에 대해 `true`를 반환하며, 그 외의 값은 모두 `false`를 반환합니다:

```php
$archived = $request->boolean('archived');
```


#### 배열 입력값 가져오기 {#retrieving-array-input-values}

배열을 포함하는 입력값은 `array` 메서드를 사용하여 가져올 수 있습니다. 이 메서드는 입력값을 항상 배열로 변환합니다. 요청에 해당 이름의 입력값이 없으면 빈 배열이 반환됩니다:

```php
$versions = $request->array('versions');
```


#### 날짜 입력값 가져오기 {#retrieving-date-input-values}

편의를 위해, 날짜/시간이 포함된 입력값은 `date` 메서드를 사용하여 Carbon 인스턴스로 가져올 수 있습니다. 요청에 해당 이름의 입력값이 없으면 `null`이 반환됩니다:

```php
$birthday = $request->date('birthday');
```

`date` 메서드의 두 번째와 세 번째 인자는 각각 날짜의 포맷과 타임존을 지정하는 데 사용할 수 있습니다:

```php
$elapsed = $request->date('elapsed', '!H:i', 'Europe/Madrid');
```

입력값이 존재하지만 포맷이 올바르지 않은 경우, `InvalidArgumentException`이 발생합니다. 따라서 `date` 메서드를 호출하기 전에 입력값을 검증하는 것이 권장됩니다.


#### Enum 입력값 가져오기 {#retrieving-enum-input-values}

[PHP enum](https://www.php.net/manual/en/language.types.enumerations.php)에 해당하는 입력값도 요청에서 가져올 수 있습니다. 요청에 해당 이름의 입력값이 없거나, enum에 입력값과 일치하는 백킹 값이 없으면 `null`이 반환됩니다. `enum` 메서드는 입력값의 이름과 enum 클래스를 각각 첫 번째와 두 번째 인자로 받습니다:

```php
use App\Enums\Status;

$status = $request->enum('status', Status::class);
```

값이 없거나 유효하지 않을 때 반환할 기본값을 지정할 수도 있습니다:

```php
$status = $request->enum('status', Status::class, Status::Pending);
```

입력값이 PHP enum에 해당하는 값들의 배열이라면, `enums` 메서드를 사용하여 enum 인스턴스 배열로 가져올 수 있습니다:

```php
use App\Enums\Product;

$products = $request->enums('products', Product::class);
```


#### 동적 프로퍼티를 통한 입력값 가져오기 {#retrieving-input-via-dynamic-properties}

`Illuminate\Http\Request` 인스턴스에서 동적 프로퍼티를 사용하여 사용자 입력값에 접근할 수도 있습니다. 예를 들어, 애플리케이션의 폼 중 하나에 `name` 필드가 있다면, 아래와 같이 해당 필드의 값을 가져올 수 있습니다:

```php
$name = $request->name;
```

동적 프로퍼티를 사용할 때, Laravel은 먼저 요청 페이로드에서 해당 파라미터의 값을 찾습니다. 만약 값이 없다면, 매칭된 라우트의 파라미터에서 해당 필드를 검색합니다.


#### 입력 데이터의 일부만 가져오기 {#retrieving-a-portion-of-the-input-data}

입력 데이터의 일부만 가져와야 할 경우, `only`와 `except` 메서드를 사용할 수 있습니다. 이 두 메서드는 모두 하나의 `array` 또는 동적으로 여러 인자를 받을 수 있습니다:

```php
$input = $request->only(['username', 'password']);

$input = $request->only('username', 'password');

$input = $request->except(['credit_card']);

$input = $request->except('credit_card');
```

> [!WARNING]
> `only` 메서드는 요청한 모든 키/값 쌍을 반환하지만, 요청에 존재하지 않는 키/값 쌍은 반환하지 않습니다.


### 입력값 존재 여부 확인 {#input-presence}

요청에 값이 존재하는지 확인하려면 `has` 메서드를 사용할 수 있습니다. `has` 메서드는 요청에 값이 존재하면 `true`를 반환합니다:

```php
if ($request->has('name')) {
    // ...
}
```

배열을 전달하면, `has` 메서드는 지정한 모든 값이 존재하는지 확인합니다:

```php
if ($request->has(['name', 'email'])) {
    // ...
}
```

`hasAny` 메서드는 지정한 값 중 하나라도 존재하면 `true`를 반환합니다:

```php
if ($request->hasAny(['name', 'email'])) {
    // ...
}
```

`whenHas` 메서드는 요청에 값이 존재할 때 주어진 클로저를 실행합니다:

```php
$request->whenHas('name', function (string $input) {
    // ...
});
```

`whenHas` 메서드에 두 번째 클로저를 전달하면, 지정한 값이 존재하지 않을 때 해당 클로저가 실행됩니다:

```php
$request->whenHas('name', function (string $input) {
    // "name" 값이 존재할 때...
}, function () {
    // "name" 값이 존재하지 않을 때...
});
```

요청에 값이 존재하고 빈 문자열이 아닌지 확인하려면 `filled` 메서드를 사용할 수 있습니다:

```php
if ($request->filled('name')) {
    // ...
}
```

요청에 값이 없거나 빈 문자열인지 확인하려면 `isNotFilled` 메서드를 사용할 수 있습니다:

```php
if ($request->isNotFilled('name')) {
    // ...
}
```

배열을 전달하면, `isNotFilled` 메서드는 지정한 모든 값이 없거나 비어있는지 확인합니다:

```php
if ($request->isNotFilled(['name', 'email'])) {
    // ...
}
```

`anyFilled` 메서드는 지정한 값 중 하나라도 빈 문자열이 아니면 `true`를 반환합니다:

```php
if ($request->anyFilled(['name', 'email'])) {
    // ...
}
```

`whenFilled` 메서드는 요청에 값이 존재하고 빈 문자열이 아닐 때 주어진 클로저를 실행합니다:

```php
$request->whenFilled('name', function (string $input) {
    // ...
});
```

`whenFilled` 메서드에 두 번째 클로저를 전달하면, 지정한 값이 "filled" 상태가 아닐 때 해당 클로저가 실행됩니다:

```php
$request->whenFilled('name', function (string $input) {
    // "name" 값이 채워져 있을 때...
}, function () {
    // "name" 값이 비어있거나 없을 때...
});
```

요청에 특정 키가 없는지 확인하려면 `missing` 및 `whenMissing` 메서드를 사용할 수 있습니다:

```php
if ($request->missing('name')) {
    // ...
}

$request->whenMissing('name', function () {
    // "name" 값이 없을 때...
}, function () {
    // "name" 값이 존재할 때...
});
```


### 추가 입력값 병합하기 {#merging-additional-input}

때때로 요청의 기존 입력 데이터에 추가 입력값을 수동으로 병합해야 할 때가 있습니다. 이를 위해 `merge` 메서드를 사용할 수 있습니다. 만약 주어진 입력 키가 이미 요청에 존재한다면, `merge` 메서드에 전달된 데이터로 덮어쓰게 됩니다:

```php
$request->merge(['votes' => 0]);
```

`mergeIfMissing` 메서드는 해당 키가 요청의 입력 데이터에 존재하지 않을 때만 입력값을 병합합니다:

```php
$request->mergeIfMissing(['votes' => 0]);
```


### 이전 입력값 {#old-input}

Laravel은 한 요청에서 받은 입력값을 다음 요청까지 유지할 수 있도록 해줍니다. 이 기능은 주로 유효성 검사 오류 발생 후 폼을 다시 채워줄 때 유용합니다. 하지만 Laravel의 [유효성 검사 기능](/laravel/12.x/validation)을 사용한다면, 이러한 세션 입력값 플래시(flash) 메서드를 직접 사용할 필요가 없을 수도 있습니다. Laravel의 일부 내장 유효성 검사 기능이 자동으로 이 메서드들을 호출하기 때문입니다.


#### 입력값을 세션에 플래시하기 {#flashing-input-to-the-session}

`Illuminate\Http\Request` 클래스의 `flash` 메서드는 현재 입력값을 [세션](/laravel/12.x/session)에 플래시하여, 사용자가 애플리케이션에 다음 요청을 보낼 때 해당 입력값을 사용할 수 있도록 해줍니다:

```php
$request->flash();
```

또한, `flashOnly`와 `flashExcept` 메서드를 사용하여 요청 데이터의 일부만 세션에 플래시할 수 있습니다. 이 메서드들은 비밀번호와 같은 민감한 정보를 세션에 저장하지 않도록 할 때 유용합니다:

```php
$request->flashOnly(['username', 'email']);

$request->flashExcept('password');
```


#### 입력값을 플래시한 후 리다이렉트하기 {#flashing-input-then-redirecting}

입력값을 세션에 플래시한 뒤 이전 페이지로 리다이렉트하는 경우가 많기 때문에, `withInput` 메서드를 사용해 입력값 플래시를 리다이렉트와 쉽게 체이닝할 수 있습니다:

```php
return redirect('/form')->withInput();

return redirect()->route('user.create')->withInput();

return redirect('/form')->withInput(
    $request->except('password')
);
```


#### 이전 입력값 가져오기 {#retrieving-old-input}

이전 요청에서 플래시된 입력값을 가져오려면, `Illuminate\Http\Request` 인스턴스의 `old` 메서드를 호출하면 됩니다. `old` 메서드는 [세션](/laravel/12.x/session)에서 이전에 플래시된 입력 데이터를 가져옵니다:

```php
$username = $request->old('username');
```

Laravel은 전역 `old` 헬퍼도 제공합니다. [Blade 템플릿](/laravel/12.x/blade)에서 이전 입력값을 표시할 때는 `old` 헬퍼를 사용해 폼을 다시 채우는 것이 더 편리합니다. 해당 필드에 이전 입력값이 없으면 `null`이 반환됩니다:

```blade
<input type="text" name="username" value="{{ old('username') }}">
```


### 쿠키 {#cookies}


#### 요청에서 쿠키 가져오기 {#retrieving-cookies-from-requests}

Laravel 프레임워크에서 생성된 모든 쿠키는 암호화되고 인증 코드로 서명되므로, 클라이언트가 쿠키를 변경하면 무효로 간주됩니다. 요청에서 쿠키 값을 가져오려면 `Illuminate\Http\Request` 인스턴스의 `cookie` 메서드를 사용하세요:

```php
$value = $request->cookie('name');
```


## 입력값 트리밍 및 정규화 {#input-trimming-and-normalization}

기본적으로 Laravel은 애플리케이션의 글로벌 미들웨어 스택에 `Illuminate\Foundation\Http\Middleware\TrimStrings`와 `Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull` 미들웨어를 포함하고 있습니다. 이 미들웨어들은 요청에 들어오는 모든 문자열 필드를 자동으로 트리밍(trim)하고, 빈 문자열 필드는 `null`로 변환합니다. 이를 통해 라우트나 컨트롤러에서 이러한 정규화 작업을 신경 쓰지 않아도 됩니다.

#### 입력값 정규화 비활성화하기

이 동작을 모든 요청에 대해 비활성화하고 싶다면, 애플리케이션의 `bootstrap/app.php` 파일에서 `$middleware->remove` 메서드를 호출하여 두 미들웨어를 미들웨어 스택에서 제거하면 됩니다:

```php
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;

->withMiddleware(function (Middleware $middleware) {
    $middleware->remove([
        ConvertEmptyStringsToNull::class,
        TrimStrings::class,
    ]);
})
```

애플리케이션의 일부 요청에 대해서만 문자열 트리밍과 빈 문자열 변환을 비활성화하고 싶다면, `bootstrap/app.php` 파일에서 `trimStrings`와 `convertEmptyStringsToNull` 미들웨어 메서드를 사용할 수 있습니다. 두 메서드 모두 클로저 배열을 인자로 받으며, 각 클로저는 입력값 정규화를 건너뛸지 여부를 `true` 또는 `false`로 반환해야 합니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->convertEmptyStringsToNull(except: [
        fn (Request $request) => $request->is('admin/*'),
    ]);

    $middleware->trimStrings(except: [
        fn (Request $request) => $request->is('admin/*'),
    ]);
})
```


## 파일 {#files}


### 업로드된 파일 가져오기 {#retrieving-uploaded-files}

`Illuminate\Http\Request` 인스턴스에서 `file` 메서드나 동적 프로퍼티를 사용하여 업로드된 파일을 가져올 수 있습니다. `file` 메서드는 `Illuminate\Http\UploadedFile` 클래스의 인스턴스를 반환하며, 이 클래스는 PHP의 `SplFileInfo` 클래스를 확장하여 파일과 상호작용할 수 있는 다양한 메서드를 제공합니다:

```php
$file = $request->file('photo');

$file = $request->photo;
```

`hasFile` 메서드를 사용하면 요청에 파일이 존재하는지 확인할 수 있습니다:

```php
if ($request->hasFile('photo')) {
    // ...
}
```


#### 업로드 성공 여부 검증하기 {#validating-successful-uploads}

파일이 존재하는지 확인하는 것 외에도, `isValid` 메서드를 사용하여 파일 업로드에 문제가 없었는지 검증할 수 있습니다:

```php
if ($request->file('photo')->isValid()) {
    // ...
}
```


#### 파일 경로와 확장자 {#file-paths-extensions}

`UploadedFile` 클래스는 파일의 전체 경로와 확장자에 접근할 수 있는 메서드도 제공합니다. `extension` 메서드는 파일의 내용을 기반으로 확장자를 추측합니다. 이 확장자는 클라이언트가 제공한 확장자와 다를 수 있습니다:

```php
$path = $request->photo->path();

$extension = $request->photo->extension();
```


#### 기타 파일 메서드 {#other-file-methods}

`UploadedFile` 인스턴스에는 다양한 다른 메서드들도 제공됩니다. 이러한 메서드에 대한 더 자세한 정보는 [클래스의 API 문서](https://github.com/symfony/symfony/blob/6.0/src/Symfony/Component/HttpFoundation/File/UploadedFile.php)를 참고하세요.


### 업로드된 파일 저장하기 {#storing-uploaded-files}

업로드된 파일을 저장하려면, 보통 설정된 [파일 시스템](/laravel/12.x/filesystem) 중 하나를 사용하게 됩니다. `UploadedFile` 클래스의 `store` 메서드는 업로드된 파일을 로컬 파일 시스템이나 Amazon S3와 같은 클라우드 저장소 등, 설정된 디스크 중 하나로 이동시켜 저장합니다.

`store` 메서드는 파일이 저장될 경로(파일 시스템의 루트 디렉터리 기준 상대 경로)를 인자로 받습니다. 이 경로에는 파일명을 포함하지 않아야 하며, 고유한 ID가 자동으로 생성되어 파일명으로 사용됩니다.

또한, `store` 메서드는 파일을 저장할 디스크의 이름을 두 번째 인자로 받을 수 있습니다. 이 메서드는 디스크의 루트 기준으로 파일의 경로를 반환합니다:

```php
$path = $request->photo->store('images');

$path = $request->photo->store('images', 's3');
```

파일명이 자동으로 생성되는 것을 원하지 않는 경우, `storeAs` 메서드를 사용할 수 있습니다. 이 메서드는 경로, 파일명, 디스크명을 인자로 받습니다:

```php
$path = $request->photo->storeAs('images', 'filename.jpg');

$path = $request->photo->storeAs('images', 'filename.jpg', 's3');
```

> [!NOTE]
> Laravel의 파일 저장에 대한 더 자세한 내용은 [파일 저장소 문서](/laravel/12.x/filesystem)를 참고하세요.


## 신뢰할 수 있는 프록시 설정하기 {#configuring-trusted-proxies}

TLS/SSL 인증서를 종료하는 로드 밸런서 뒤에서 애플리케이션을 실행할 때, `url` 헬퍼를 사용할 때 애플리케이션이 HTTPS 링크를 생성하지 않는 경우가 있을 수 있습니다. 이는 일반적으로 애플리케이션이 로드 밸런서로부터 80번 포트로 트래픽을 전달받고 있어, 보안 링크를 생성해야 한다는 사실을 알지 못하기 때문입니다.

이 문제를 해결하려면, Laravel 애플리케이션에 포함된 `Illuminate\Http\Middleware\TrustProxies` 미들웨어를 활성화할 수 있습니다. 이 미들웨어를 통해 애플리케이션에서 신뢰할 수 있는 로드 밸런서나 프록시를 빠르게 지정할 수 있습니다. 신뢰할 프록시는 애플리케이션의 `bootstrap/app.php` 파일에서 `trustProxies` 미들웨어 메서드를 사용해 지정합니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: [
        '192.168.1.1',
        '10.0.0.0/8',
    ]);
})
```

신뢰할 프록시를 설정하는 것 외에도, 신뢰할 프록시 헤더도 설정할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(headers: Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB
    );
})
```

> [!NOTE]
> AWS Elastic Load Balancing을 사용하는 경우, `headers` 값은 `Request::HEADER_X_FORWARDED_AWS_ELB`여야 합니다. 로드 밸런서가 [RFC 7239](https://www.rfc-editor.org/rfc/rfc7239#section-4)의 표준 `Forwarded` 헤더를 사용하는 경우, `headers` 값은 `Request::HEADER_FORWARDED`여야 합니다. `headers` 값에 사용할 수 있는 상수에 대한 자세한 내용은 Symfony의 [프록시 신뢰 문서](https://symfony.com/doc/current/deployment/proxies.html)를 참고하세요.


#### 모든 프록시 신뢰하기 {#trusting-all-proxies}

Amazon AWS나 기타 "클라우드" 로드 밸런서 제공업체를 사용하는 경우, 실제 로드 밸런서의 IP 주소를 알지 못할 수 있습니다. 이럴 때는 `*`를 사용하여 모든 프록시를 신뢰할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```


## 신뢰할 수 있는 호스트 설정하기 {#configuring-trusted-hosts}

기본적으로 Laravel은 HTTP 요청의 `Host` 헤더 내용과 상관없이 수신하는 모든 요청에 응답합니다. 또한, 웹 요청 중 애플리케이션의 절대 URL을 생성할 때 `Host` 헤더의 값이 사용됩니다.

일반적으로는 Nginx나 Apache와 같은 웹 서버에서 특정 호스트명과 일치하는 요청만 애플리케이션으로 전달하도록 설정해야 합니다. 하지만 웹 서버를 직접 커스터마이징할 수 없는 경우, Laravel이 특정 호스트명에만 응답하도록 하려면 `Illuminate\Http\Middleware\TrustHosts` 미들웨어를 활성화하면 됩니다.

`TrustHosts` 미들웨어를 활성화하려면, 애플리케이션의 `bootstrap/app.php` 파일에서 `trustHosts` 미들웨어 메서드를 호출해야 합니다. 이 메서드의 `at` 인자를 사용해 애플리케이션이 응답해야 할 호스트명을 지정할 수 있습니다. 다른 `Host` 헤더로 들어오는 요청은 거부됩니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustHosts(at: ['laravel.test']);
})
```

기본적으로, 애플리케이션 URL의 서브도메인에서 오는 요청도 자동으로 신뢰됩니다. 이 동작을 비활성화하려면 `subdomains` 인자를 사용할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustHosts(at: ['laravel.test'], subdomains: false);
})
```

신뢰할 호스트를 결정하기 위해 애플리케이션의 설정 파일이나 데이터베이스에 접근해야 한다면, `at` 인자에 클로저를 전달할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustHosts(at: fn () => config('app.trusted_hosts'));
})
```
