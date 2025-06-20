# Laravel Sanctum
























## 소개 {#introduction}

[Laravel Sanctum](https://github.com/laravel/sanctum)은 SPA(싱글 페이지 애플리케이션), 모바일 애플리케이션, 그리고 간단한 토큰 기반 API를 위한 가벼운 인증 시스템을 제공합니다. Sanctum을 사용하면 애플리케이션의 각 사용자가 자신의 계정에 대해 여러 개의 API 토큰을 생성할 수 있습니다. 이 토큰들은 토큰이 수행할 수 있는 작업을 지정하는 권한/스코프를 부여받을 수 있습니다.


### 작동 방식 {#how-it-works}

Laravel Sanctum은 두 가지 별개의 문제를 해결하기 위해 존재합니다. 라이브러리를 더 깊이 살펴보기 전에 각각에 대해 논의해보겠습니다.


#### API 토큰 {#how-it-works-api-tokens}

첫째, Sanctum은 OAuth의 복잡성 없이 사용자에게 API 토큰을 발급할 수 있는 간단한 패키지입니다. 이 기능은 GitHub 및 "개인 액세스 토큰"을 발급하는 기타 애플리케이션에서 영감을 받았습니다. 예를 들어, 애플리케이션의 "계정 설정" 화면에서 사용자가 자신의 계정에 대한 API 토큰을 생성할 수 있다고 상상해보세요. Sanctum을 사용하여 이러한 토큰을 생성하고 관리할 수 있습니다. 이 토큰들은 일반적으로 매우 긴 만료 기간(수년)을 가지지만, 사용자가 언제든지 직접 폐기할 수 있습니다.

Laravel Sanctum은 사용자 API 토큰을 하나의 데이터베이스 테이블에 저장하고, 유효한 API 토큰이 포함된 `Authorization` 헤더를 통해 들어오는 HTTP 요청을 인증함으로써 이 기능을 제공합니다.


#### SPA 인증 {#how-it-works-spa-authentication}

둘째, Sanctum은 Laravel 기반 API와 통신해야 하는 싱글 페이지 애플리케이션(SPA)을 간단하게 인증할 수 있는 방법을 제공합니다. 이러한 SPA는 Laravel 애플리케이션과 동일한 저장소에 있을 수도 있고, Next.js나 Nuxt로 생성된 완전히 별도의 저장소에 있을 수도 있습니다.

이 기능을 위해 Sanctum은 어떤 종류의 토큰도 사용하지 않습니다. 대신, Laravel의 내장 쿠키 기반 세션 인증 서비스를 사용합니다. 일반적으로 Sanctum은 이를 위해 Laravel의 `web` 인증 가드를 활용합니다. 이 방식은 CSRF 보호, 세션 인증, 그리고 XSS를 통한 인증 정보 유출 방지의 이점을 제공합니다.

Sanctum은 들어오는 요청이 자신의 SPA 프론트엔드에서 발생한 경우에만 쿠키를 사용하여 인증을 시도합니다. Sanctum이 들어오는 HTTP 요청을 검사할 때, 먼저 인증 쿠키가 있는지 확인하고, 없으면 `Authorization` 헤더에 유효한 API 토큰이 있는지 검사합니다.

> [!NOTE]
> Sanctum을 API 토큰 인증에만 사용하거나 SPA 인증에만 사용하는 것도 전혀 문제 없습니다. Sanctum을 사용한다고 해서 제공하는 두 가지 기능을 모두 사용해야 하는 것은 아닙니다.


## 설치 {#installation}

`install:api` Artisan 명령어를 통해 Laravel Sanctum을 설치할 수 있습니다:

```shell
php artisan install:api
```

다음으로, Sanctum을 사용하여 SPA를 인증할 계획이라면 이 문서의 [SPA 인증](#spa-authentication) 섹션을 참고하세요.


## 구성 {#configuration}


### 기본 모델 재정의 {#overriding-default-models}

일반적으로 필요하지는 않지만, Sanctum이 내부적으로 사용하는 `PersonalAccessToken` 모델을 확장할 수 있습니다:

```php
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    // ...
}
```

그런 다음, Sanctum이 제공하는 `usePersonalAccessTokenModel` 메서드를 통해 커스텀 모델을 사용하도록 지정할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider` 파일의 `boot` 메서드에서 호출해야 합니다:

```php
use App\Models\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
}
```


## API 토큰 인증 {#api-token-authentication}

> [!NOTE]
> 자체 1차 SPA를 인증할 때는 API 토큰을 사용하지 마세요. 대신, Sanctum의 내장 [SPA 인증 기능](#spa-authentication)을 사용하세요.


### API 토큰 발급 {#issuing-api-tokens}

Sanctum을 사용하면 API 요청을 인증하는 데 사용할 수 있는 API 토큰/개인 액세스 토큰을 발급할 수 있습니다. API 토큰을 사용하여 요청할 때는 토큰을 `Bearer` 토큰으로 `Authorization` 헤더에 포함해야 합니다.

사용자에게 토큰을 발급하려면 User 모델에 `Laravel\Sanctum\HasApiTokens` 트레이트를 사용해야 합니다:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

토큰을 발급하려면 `createToken` 메서드를 사용할 수 있습니다. `createToken` 메서드는 `Laravel\Sanctum\NewAccessToken` 인스턴스를 반환합니다. API 토큰은 데이터베이스에 저장되기 전에 SHA-256 해싱으로 해시되지만, `NewAccessToken` 인스턴스의 `plainTextToken` 속성을 통해 토큰의 평문 값을 확인할 수 있습니다. 이 값은 토큰이 생성된 직후 사용자에게 바로 표시해야 합니다:

```php
use Illuminate\Http\Request;

Route::post('/tokens/create', function (Request $request) {
    $token = $request->user()->createToken($request->token_name);

    return ['token' => $token->plainTextToken];
});
```

`HasApiTokens` 트레이트가 제공하는 `tokens` Eloquent 관계를 통해 사용자의 모든 토큰에 접근할 수 있습니다:

```php
foreach ($user->tokens as $token) {
    // ...
}
```


### 토큰 권한 {#token-abilities}

Sanctum을 사용하면 토큰에 "권한"을 부여할 수 있습니다. 권한은 OAuth의 "스코프"와 유사한 역할을 합니다. `createToken` 메서드의 두 번째 인수로 문자열 권한 배열을 전달할 수 있습니다:

```php
return $user->createToken('token-name', ['server:update'])->plainTextToken;
```

Sanctum으로 인증된 들어오는 요청을 처리할 때, `tokenCan` 또는 `tokenCant` 메서드를 사용하여 토큰이 특정 권한을 가지고 있는지 확인할 수 있습니다:

```php
if ($user->tokenCan('server:update')) {
    // ...
}

if ($user->tokenCant('server:update')) {
    // ...
}
```


#### 토큰 권한 미들웨어 {#token-ability-middleware}

Sanctum에는 들어오는 요청이 특정 권한이 부여된 토큰으로 인증되었는지 확인할 수 있는 두 가지 미들웨어도 포함되어 있습니다. 먼저, 애플리케이션의 `bootstrap/app.php` 파일에 다음 미들웨어 별칭을 정의하세요:

```php
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'abilities' => CheckAbilities::class,
        'ability' => CheckForAnyAbility::class,
    ]);
})
```

`abilities` 미들웨어는 들어오는 요청의 토큰이 나열된 모든 권한을 가지고 있는지 확인하기 위해 라우트에 할당할 수 있습니다:

```php
Route::get('/orders', function () {
    // 토큰이 "check-status"와 "place-orders" 권한을 모두 가지고 있음...
})->middleware(['auth:sanctum', 'abilities:check-status,place-orders']);
```

`ability` 미들웨어는 들어오는 요청의 토큰이 나열된 권한 중 *하나 이상*을 가지고 있는지 확인하기 위해 라우트에 할당할 수 있습니다:

```php
Route::get('/orders', function () {
    // 토큰이 "check-status" 또는 "place-orders" 권한을 가지고 있음...
})->middleware(['auth:sanctum', 'ability:check-status,place-orders']);
```


#### 1차 UI에서 시작된 요청 {#first-party-ui-initiated-requests}

편의를 위해, 들어오는 인증된 요청이 1차 SPA에서 발생했고 Sanctum의 내장 [SPA 인증](#spa-authentication)을 사용하는 경우 `tokenCan` 메서드는 항상 `true`를 반환합니다.

하지만, 이것이 반드시 애플리케이션이 사용자가 해당 작업을 수행하도록 허용해야 한다는 의미는 아닙니다. 일반적으로 애플리케이션의 [권한 정책](/laravel/12.x/authorization#creating-policies)이 토큰이 해당 권한을 수행할 수 있는지, 그리고 사용자 인스턴스 자체가 해당 작업을 수행할 수 있는지도 함께 확인합니다.

예를 들어, 서버를 관리하는 애플리케이션을 상상해보면, 토큰이 서버를 업데이트할 권한이 있는지 **그리고** 서버가 해당 사용자 소유인지 확인해야 할 수 있습니다:

```php
return $request->user()->id === $server->user_id &&
       $request->user()->tokenCan('server:update')
```

처음에는 1차 UI에서 시작된 요청에 대해 `tokenCan` 메서드를 호출할 수 있고 항상 `true`를 반환하는 것이 이상하게 느껴질 수 있습니다. 하지만, API 토큰이 항상 사용 가능하며 `tokenCan` 메서드를 통해 검사할 수 있다고 가정할 수 있다는 점에서 편리합니다. 이 접근 방식을 사용하면, 요청이 애플리케이션의 UI에서 발생했는지, API의 서드파티 소비자에 의해 시작되었는지 걱정하지 않고도 애플리케이션의 권한 정책 내에서 항상 `tokenCan` 메서드를 호출할 수 있습니다.


### 라우트 보호 {#protecting-routes}

모든 들어오는 요청이 인증되어야 하도록 라우트를 보호하려면, `routes/web.php` 및 `routes/api.php` 라우트 파일 내에서 보호할 라우트에 `sanctum` 인증 가드를 연결해야 합니다. 이 가드는 들어오는 요청이 상태를 유지하는 쿠키 인증 요청이거나, 서드파티 요청인 경우 유효한 API 토큰 헤더를 포함하는지 확인합니다.

왜 `routes/web.php` 파일 내의 라우트도 `sanctum` 가드로 인증할 것을 권장하는지 궁금할 수 있습니다. Sanctum은 먼저 Laravel의 일반적인 세션 인증 쿠키를 사용하여 들어오는 요청을 인증하려고 시도합니다. 해당 쿠키가 없으면, 요청의 `Authorization` 헤더에 있는 토큰을 사용하여 인증을 시도합니다. 또한, 모든 요청을 Sanctum으로 인증하면 현재 인증된 사용자 인스턴스에서 항상 `tokenCan` 메서드를 호출할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```


### 토큰 폐기 {#revoking-tokens}

`Laravel\Sanctum\HasApiTokens` 트레이트가 제공하는 `tokens` 관계를 사용하여 데이터베이스에서 토큰을 삭제함으로써 토큰을 "폐기"할 수 있습니다:

```php
// 모든 토큰 폐기...
$user->tokens()->delete();

// 현재 요청을 인증하는 데 사용된 토큰 폐기...
$request->user()->currentAccessToken()->delete();

// 특정 토큰 폐기...
$user->tokens()->where('id', $tokenId)->delete();
```


### 토큰 만료 {#token-expiration}

기본적으로 Sanctum 토큰은 만료되지 않으며, [토큰을 폐기](#revoking-tokens)해야만 무효화됩니다. 하지만, 애플리케이션의 API 토큰에 만료 시간을 설정하고 싶다면, 애플리케이션의 `sanctum` 구성 파일에 정의된 `expiration` 구성 옵션을 통해 설정할 수 있습니다. 이 옵션은 발급된 토큰이 만료로 간주되기까지의 분(minute) 수를 정의합니다:

```php
'expiration' => 525600,
```

각 토큰의 만료 시간을 개별적으로 지정하고 싶다면, `createToken` 메서드의 세 번째 인수로 만료 시간을 전달하면 됩니다:

```php
return $user->createToken(
    'token-name', ['*'], now()->addWeek()
)->plainTextToken;
```

애플리케이션에 토큰 만료 시간을 설정했다면, 만료된 토큰을 정리하는 [스케줄 작업](/laravel/12.x/scheduling)을 추가하는 것이 좋습니다. 다행히도 Sanctum에는 이를 위한 `sanctum:prune-expired` Artisan 명령어가 포함되어 있습니다. 예를 들어, 만료된 지 최소 24시간이 지난 모든 토큰 데이터베이스 레코드를 삭제하는 스케줄 작업을 설정할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('sanctum:prune-expired --hours=24')->daily();
```


## SPA 인증 {#spa-authentication}

Sanctum은 또한 Laravel 기반 API와 통신해야 하는 싱글 페이지 애플리케이션(SPA)을 간단하게 인증할 수 있는 방법을 제공합니다. 이러한 SPA는 Laravel 애플리케이션과 동일한 저장소에 있을 수도 있고, 완전히 별도의 저장소에 있을 수도 있습니다.

이 기능을 위해 Sanctum은 어떤 종류의 토큰도 사용하지 않습니다. 대신, Sanctum은 Laravel의 내장 쿠키 기반 세션 인증 서비스를 사용합니다. 이 인증 방식은 CSRF 보호, 세션 인증, 그리고 XSS를 통한 인증 정보 유출 방지의 이점을 제공합니다.

> [!WARNING]
> 인증을 위해서는 SPA와 API가 동일한 최상위 도메인을 공유해야 합니다. 단, 서로 다른 서브도메인에 위치할 수 있습니다. 또한, 요청 시 `Accept: application/json` 헤더와 `Referer` 또는 `Origin` 헤더를 반드시 전송해야 합니다.


### 구성 {#spa-configuration}


#### 1차 도메인 구성 {#configuring-your-first-party-domains}

먼저, SPA가 요청을 보낼 도메인을 구성해야 합니다. 이 도메인은 `sanctum` 구성 파일의 `stateful` 옵션을 통해 설정할 수 있습니다. 이 설정은 API에 요청할 때 Laravel 세션 쿠키를 사용하여 "상태를 유지하는" 인증을 할 도메인을 결정합니다.

1차 상태 유지 도메인 설정을 돕기 위해 Sanctum은 구성에 포함할 수 있는 두 가지 헬퍼 함수를 제공합니다. 먼저, `Sanctum::currentApplicationUrlWithPort()`는 `APP_URL` 환경 변수에서 현재 애플리케이션 URL을 반환하고, `Sanctum::currentRequestHost()`는 상태 유지 도메인 목록에 플레이스홀더를 삽입하여 런타임에 현재 요청의 호스트로 대체되어 동일한 도메인의 모든 요청이 상태 유지로 간주되도록 합니다.

> [!WARNING]
> 포트가 포함된 URL(`127.0.0.1:8000`)로 애플리케이션에 접근하는 경우, 도메인에 포트 번호도 포함해야 합니다.


#### Sanctum 미들웨어 {#sanctum-middleware}

다음으로, SPA에서 들어오는 요청은 Laravel의 세션 쿠키를 사용하여 인증할 수 있도록, 서드파티나 모바일 애플리케이션의 요청은 API 토큰을 사용하여 인증할 수 있도록 Laravel에 지시해야 합니다. 이는 애플리케이션의 `bootstrap/app.php` 파일에서 `statefulApi` 미들웨어 메서드를 호출하여 쉽게 설정할 수 있습니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();
})
```


#### CORS와 쿠키 {#cors-and-cookies}

별도의 서브도메인에서 실행되는 SPA에서 애플리케이션 인증에 문제가 있다면, CORS(교차 출처 리소스 공유) 또는 세션 쿠키 설정이 잘못되었을 가능성이 높습니다.

`config/cors.php` 구성 파일은 기본적으로 배포되지 않습니다. Laravel의 CORS 옵션을 커스터마이즈해야 한다면, `config:publish` Artisan 명령어를 사용하여 전체 `cors` 구성 파일을 배포해야 합니다:

```shell
php artisan config:publish cors
```

다음으로, 애플리케이션의 CORS 구성이 `Access-Control-Allow-Credentials` 헤더를 값이 `True`로 반환하는지 확인해야 합니다. 이는 애플리케이션의 `config/cors.php` 구성 파일에서 `supports_credentials` 옵션을 `true`로 설정하면 됩니다.

또한, 애플리케이션의 전역 `axios` 인스턴스에서 `withCredentials`와 `withXSRFToken` 옵션을 활성화해야 합니다. 일반적으로 이는 `resources/js/bootstrap.js` 파일에서 수행해야 합니다. 프론트엔드에서 Axios를 사용하지 않는 경우, 사용하는 HTTP 클라이언트에서 동등한 설정을 해야 합니다:

```js
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
```

마지막으로, 애플리케이션의 세션 쿠키 도메인 구성이 루트 도메인의 모든 서브도메인을 지원하는지 확인해야 합니다. 이는 애플리케이션의 `config/session.php` 구성 파일에서 도메인 앞에 `.`을 붙여 설정하면 됩니다:

```php
'domain' => '.domain.com',
```


### 인증 {#spa-authenticating}


#### CSRF 보호 {#csrf-protection}

SPA를 인증하려면, SPA의 "로그인" 페이지에서 먼저 `/sanctum/csrf-cookie` 엔드포인트에 요청을 보내 애플리케이션의 CSRF 보호를 초기화해야 합니다:

```js
axios.get('/sanctum/csrf-cookie').then(response => {
    // 로그인...
});
```

이 요청 중에 Laravel은 현재 CSRF 토큰이 포함된 `XSRF-TOKEN` 쿠키를 설정합니다. 이 토큰은 URL 디코딩되어 이후 요청의 `X-XSRF-TOKEN` 헤더에 전달되어야 하며, Axios나 Angular HttpClient와 같은 일부 HTTP 클라이언트 라이브러리는 이를 자동으로 처리해줍니다. JavaScript HTTP 라이브러리가 값을 자동으로 설정하지 않는 경우, 이 라우트에서 설정된 `XSRF-TOKEN` 쿠키의 URL 디코딩 값을 `X-XSRF-TOKEN` 헤더에 수동으로 설정해야 합니다.


#### 로그인 {#logging-in}

CSRF 보호가 초기화되면, Laravel 애플리케이션의 `/login` 라우트에 `POST` 요청을 보내야 합니다. 이 `/login` 라우트는 [직접 구현](/laravel/12.x/authentication#authenticating-users)하거나 [Laravel Fortify](/laravel/12.x/fortify)와 같은 헤드리스 인증 패키지를 사용할 수 있습니다.

로그인 요청이 성공하면 인증이 완료되고, 이후 애플리케이션의 라우트에 대한 요청은 Laravel 애플리케이션이 클라이언트에 발급한 세션 쿠키를 통해 자동으로 인증됩니다. 또한, 이미 `/sanctum/csrf-cookie` 라우트에 요청을 보냈으므로, JavaScript HTTP 클라이언트가 `XSRF-TOKEN` 쿠키 값을 `X-XSRF-TOKEN` 헤더에 전송하는 한 이후 요청도 자동으로 CSRF 보호를 받게 됩니다.

물론, 사용자의 세션이 비활동으로 인해 만료되면 이후 Laravel 애플리케이션에 대한 요청에서 401 또는 419 HTTP 오류 응답을 받을 수 있습니다. 이 경우 사용자를 SPA의 로그인 페이지로 리디렉션해야 합니다.

> [!WARNING]
> 직접 `/login` 엔드포인트를 작성해도 되지만, 반드시 Laravel이 제공하는 표준 [세션 기반 인증 서비스](/laravel/12.x/authentication#authenticating-users)를 사용하여 사용자를 인증해야 합니다. 일반적으로 이는 `web` 인증 가드를 사용하는 것을 의미합니다.


### 라우트 보호 {#protecting-spa-routes}

모든 들어오는 요청이 인증되어야 하도록 라우트를 보호하려면, `routes/api.php` 파일 내의 API 라우트에 `sanctum` 인증 가드를 연결해야 합니다. 이 가드는 들어오는 요청이 SPA에서 온 상태 유지 인증 요청이거나, 서드파티 요청인 경우 유효한 API 토큰 헤더를 포함하는지 확인합니다:

```php
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```


### 프라이빗 브로드캐스트 채널 권한 부여 {#authorizing-private-broadcast-channels}

SPA가 [프라이빗/프레즌스 브로드캐스트 채널](/laravel/12.x/broadcasting#authorizing-channels)과 인증해야 하는 경우, 애플리케이션의 `bootstrap/app.php` 파일에 있는 `withRouting` 메서드에서 `channels` 항목을 제거해야 합니다. 대신, `withBroadcasting` 메서드를 호출하여 브로드캐스팅 라우트에 올바른 미들웨어를 지정할 수 있습니다:

```php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        // ...
    )
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['prefix' => 'api', 'middleware' => ['api', 'auth:sanctum']],
    )
```

다음으로, Pusher의 인증 요청이 성공하려면 [Laravel Echo](/laravel/12.x/broadcasting#client-side-installation)를 초기화할 때 커스텀 Pusher `authorizer`를 제공해야 합니다. 이를 통해 애플리케이션이 [크로스 도메인 요청에 적절히 구성된 axios 인스턴스](#cors-and-cookies)를 사용하도록 Pusher를 설정할 수 있습니다:

```js
window.Echo = new Echo({
    broadcaster: "pusher",
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/api/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    },
})
```


## 모바일 애플리케이션 인증 {#mobile-application-authentication}

Sanctum 토큰을 사용하여 모바일 애플리케이션의 API 요청을 인증할 수도 있습니다. 모바일 애플리케이션 요청을 인증하는 과정은 서드파티 API 요청을 인증하는 것과 유사하지만, API 토큰을 발급하는 방법에 약간의 차이가 있습니다.


### API 토큰 발급 {#issuing-mobile-api-tokens}

먼저, 사용자의 이메일/사용자명, 비밀번호, 디바이스 이름을 받아 새로운 Sanctum 토큰으로 교환하는 라우트를 생성하세요. 이 엔드포인트에 전달되는 "디바이스 이름"은 정보 제공용이며 원하는 값을 사용할 수 있습니다. 일반적으로 디바이스 이름 값은 사용자가 인식할 수 있는 이름이어야 하며, 예를 들어 "Nuno의 iPhone 12"와 같이 지정할 수 있습니다.

일반적으로 모바일 애플리케이션의 "로그인" 화면에서 토큰 엔드포인트에 요청을 보냅니다. 엔드포인트는 평문 API 토큰을 반환하며, 이 토큰을 모바일 기기에 저장한 후 추가 API 요청에 사용할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::post('/sanctum/token', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['제공된 자격 증명이 올바르지 않습니다.'],
        ]);
    }

    return $user->createToken($request->device_name)->plainTextToken;
});
```

모바일 애플리케이션이 토큰을 사용하여 애플리케이션에 API 요청을 보낼 때는, 토큰을 `Bearer` 토큰으로 `Authorization` 헤더에 전달해야 합니다.

> [!NOTE]
> 모바일 애플리케이션에 토큰을 발급할 때도 [토큰 권한](#token-abilities)을 지정할 수 있습니다.


### 라우트 보호 {#protecting-mobile-api-routes}

앞서 설명한 대로, 모든 들어오는 요청이 인증되어야 하도록 라우트를 보호하려면 해당 라우트에 `sanctum` 인증 가드를 연결하면 됩니다:

```php
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```


### 토큰 폐기 {#revoking-mobile-api-tokens}

모바일 기기에 발급된 API 토큰을 사용자가 폐기할 수 있도록, 웹 애플리케이션 UI의 "계정 설정" 부분에 토큰 이름과 함께 "폐기" 버튼을 표시할 수 있습니다. 사용자가 "폐기" 버튼을 클릭하면 데이터베이스에서 해당 토큰을 삭제할 수 있습니다. 사용자의 API 토큰은 `Laravel\Sanctum\HasApiTokens` 트레이트가 제공하는 `tokens` 관계를 통해 접근할 수 있다는 점을 기억하세요:

```php
// 모든 토큰 폐기...
$user->tokens()->delete();

// 특정 토큰 폐기...
$user->tokens()->where('id', $tokenId)->delete();
```


## 테스트 {#testing}

테스트 시, `Sanctum::actingAs` 메서드를 사용하여 사용자를 인증하고 토큰에 부여할 권한을 지정할 수 있습니다:
::: code-group
```php [Pest]
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('task list can be retrieved', function () {
    Sanctum::actingAs(
        User::factory()->create(),
        ['view-tasks']
    );

    $response = $this->get('/api/task');

    $response->assertOk();
});
```

```php [PHPUnit]
use App\Models\User;
use Laravel\Sanctum\Sanctum;

public function test_task_list_can_be_retrieved(): void
{
    Sanctum::actingAs(
        User::factory()->create(),
        ['view-tasks']
    );

    $response = $this->get('/api/task');

    $response->assertOk();
}
```
:::
토큰에 모든 권한을 부여하고 싶다면, `actingAs` 메서드에 전달하는 권한 목록에 `*`를 포함하면 됩니다:

```php
Sanctum::actingAs(
    User::factory()->create(),
    ['*']
);
```
