# CSRF 보호








## 소개 {#csrf-introduction}

크로스 사이트 요청 위조(CSRF)는 인증된 사용자를 대신하여 무단 명령이 수행되는 악의적인 공격 유형입니다. 다행히도, Laravel은 [크로스 사이트 요청 위조](https://en.wikipedia.org/wiki/Cross-site_request_forgery) (CSRF) 공격으로부터 애플리케이션을 쉽게 보호할 수 있도록 해줍니다.


#### 취약점 설명 {#csrf-explanation}

크로스 사이트 요청 위조에 익숙하지 않으시다면, 이 취약점이 어떻게 악용될 수 있는지 예시를 통해 알아보겠습니다. 예를 들어, 여러분의 애플리케이션에 인증된 사용자의 이메일 주소를 변경하는 `POST` 요청을 받는 `/user/email` 라우트가 있다고 가정해봅시다. 이 라우트는 아마도 사용자가 사용하고자 하는 이메일 주소를 담은 `email` 입력 필드를 기대할 것입니다.

CSRF 보호가 없다면, 악의적인 웹사이트는 여러분의 애플리케이션의 `/user/email` 라우트를 가리키는 HTML 폼을 만들고, 악의적인 사용자의 이메일 주소를 제출할 수 있습니다:

```blade
<form action="https://your-application.com/user/email" method="POST">
    <input type="email" value="malicious-email@example.com">
</form>

<script>
    document.forms[0].submit();
</script>
```

만약 악의적인 웹사이트가 페이지가 로드될 때 자동으로 폼을 제출한다면, 악의적인 사용자는 여러분의 애플리케이션을 사용하는 아무런 의심 없는 사용자를 자신의 웹사이트로 유인하기만 하면 되고, 그 사용자의 이메일 주소는 여러분의 애플리케이션에서 변경됩니다.

이 취약점을 방지하기 위해서는, 들어오는 모든 `POST`, `PUT`, `PATCH`, 또는 `DELETE` 요청에 대해 악의적인 애플리케이션이 접근할 수 없는 비밀 세션 값을 검사해야 합니다.


## CSRF 요청 방지 {#preventing-csrf-requests}

Laravel은 애플리케이션에서 관리하는 각 활성 [사용자 세션](/laravel/12.x/session)마다 자동으로 CSRF "토큰"을 생성합니다. 이 토큰은 인증된 사용자가 실제로 애플리케이션에 요청을 보내는 사람임을 확인하는 데 사용됩니다. 이 토큰은 사용자의 세션에 저장되며, 세션이 재생성될 때마다 변경되기 때문에 악의적인 애플리케이션이 접근할 수 없습니다.

현재 세션의 CSRF 토큰은 요청의 세션이나 `csrf_token` 헬퍼 함수를 통해 접근할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/token', function (Request $request) {
    $token = $request->session()->token();

    $token = csrf_token();

    // ...
});
```

애플리케이션에서 "POST", "PUT", "PATCH", 또는 "DELETE" HTML 폼을 정의할 때마다, 폼에 숨겨진 CSRF `_token` 필드를 포함시켜야 CSRF 보호 미들웨어가 요청을 검증할 수 있습니다. 편의를 위해, `@csrf` Blade 지시어를 사용하여 숨겨진 토큰 입력 필드를 생성할 수 있습니다:

```blade
<form method="POST" action="/profile">
    @csrf

    <!-- 아래와 동일합니다... -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
</form>
```

기본적으로 `web` 미들웨어 그룹에 포함된 `Illuminate\Foundation\Http\Middleware\ValidateCsrfToken` [미들웨어](/laravel/12.x/middleware)는 요청 입력의 토큰이 세션에 저장된 토큰과 일치하는지 자동으로 확인합니다. 이 두 토큰이 일치하면, 인증된 사용자가 실제로 요청을 보낸 것임을 알 수 있습니다.


### CSRF 토큰 & SPA {#csrf-tokens-and-spas}

Laravel을 API 백엔드로 사용하는 SPA를 구축하고 있다면, API 인증 및 CSRF 취약점 보호에 대한 정보는 [Laravel Sanctum 문서](/laravel/12.x/sanctum)를 참고하시기 바랍니다.


### CSRF 보호에서 URI 제외하기 {#csrf-excluding-uris}

때로는 특정 URI 집합을 CSRF 보호에서 제외하고 싶을 수 있습니다. 예를 들어, [Stripe](https://stripe.com)를 사용하여 결제를 처리하고 웹훅 시스템을 활용하는 경우, Stripe가 여러분의 라우트에 어떤 CSRF 토큰을 보내야 하는지 알 수 없으므로 Stripe 웹훅 핸들러 라우트를 CSRF 보호에서 제외해야 합니다.

일반적으로 이러한 라우트는 Laravel이 `routes/web.php` 파일의 모든 라우트에 적용하는 `web` 미들웨어 그룹 밖에 두는 것이 좋습니다. 그러나, 애플리케이션의 `bootstrap/app.php` 파일에서 `validateCsrfTokens` 메서드에 URI를 제공하여 특정 라우트만 제외할 수도 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
        'http://example.com/foo/bar',
        'http://example.com/foo/*',
    ]);
})
```

> [!NOTE]
> 편의를 위해, [테스트 실행 시](/laravel/12.x/testing)에는 모든 라우트에 대해 CSRF 미들웨어가 자동으로 비활성화됩니다.


## X-CSRF-TOKEN {#csrf-x-csrf-token}

POST 파라미터로 CSRF 토큰을 확인하는 것 외에도, 기본적으로 `web` 미들웨어 그룹에 포함된 `Illuminate\Foundation\Http\Middleware\ValidateCsrfToken` 미들웨어는 `X-CSRF-TOKEN` 요청 헤더도 확인합니다. 예를 들어, HTML `meta` 태그에 토큰을 저장할 수 있습니다:

```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

그런 다음, jQuery와 같은 라이브러리에 모든 요청 헤더에 토큰을 자동으로 추가하도록 지시할 수 있습니다. 이를 통해 레거시 JavaScript 기술을 사용하는 AJAX 기반 애플리케이션에 간편하고 편리한 CSRF 보호를 제공합니다:

```js
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
```


## X-XSRF-TOKEN {#csrf-x-xsrf-token}

Laravel은 현재 CSRF 토큰을 암호화된 `XSRF-TOKEN` 쿠키에 저장하여 프레임워크가 생성하는 각 응답에 포함시킵니다. 이 쿠키 값을 사용하여 `X-XSRF-TOKEN` 요청 헤더를 설정할 수 있습니다.

이 쿠키는 주로 개발자 편의를 위해 전송되며, Angular나 Axios와 같은 일부 JavaScript 프레임워크 및 라이브러리는 동일 출처 요청에서 이 값을 자동으로 `X-XSRF-TOKEN` 헤더에 넣어줍니다.

> [!NOTE]
> 기본적으로, `resources/js/bootstrap.js` 파일에는 Axios HTTP 라이브러리가 포함되어 있어 `X-XSRF-TOKEN` 헤더를 자동으로 전송합니다.
