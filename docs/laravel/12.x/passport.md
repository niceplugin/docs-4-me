# 라라벨 패스포트

















































## 소개 {#introduction}

[Laravel Passport](https://github.com/laravel/passport)는 여러분의 Laravel 애플리케이션에 몇 분 만에 완전한 OAuth2 서버 구현을 제공해줍니다. Passport는 Andy Millington과 Simon Hamp가 관리하는 [League OAuth2 server](https://github.com/thephpleague/oauth2-server) 위에 구축되었습니다.

> [!NOTE]
> 이 문서는 여러분이 이미 OAuth2에 익숙하다고 가정합니다. 만약 OAuth2에 대해 아무것도 모른다면, 계속 진행하기 전에 [용어](https://oauth2.thephpleague.com/terminology/)와 OAuth2의 일반적인 기능에 대해 먼저 익혀보시기 바랍니다.


### Passport 또는 Sanctum? {#passport-or-sanctum}

시작하기 전에, 여러분의 애플리케이션에 Laravel Passport가 더 적합한지 아니면 [Laravel Sanctum](/laravel/12.x/sanctum)이 더 적합한지 결정하는 것이 좋습니다. 만약 애플리케이션이 반드시 OAuth2를 지원해야 한다면 Laravel Passport를 사용해야 합니다.

하지만 싱글 페이지 애플리케이션, 모바일 애플리케이션을 인증하거나 API 토큰을 발급하려는 경우에는 [Laravel Sanctum](/laravel/12.x/sanctum)을 사용하는 것이 좋습니다. Laravel Sanctum은 OAuth2를 지원하지 않지만, 훨씬 더 간단한 API 인증 개발 환경을 제공합니다.


## 설치 {#installation}

`install:api` Artisan 명령어를 통해 Laravel Passport를 설치할 수 있습니다:

```shell
php artisan install:api --passport
```

이 명령어는 OAuth2 클라이언트와 액세스 토큰을 저장하기 위해 애플리케이션에 필요한 테이블을 생성하는 데이터베이스 마이그레이션을 게시하고 실행합니다. 또한, 보안 액세스 토큰 생성을 위한 암호화 키도 생성합니다.

`install:api` 명령어를 실행한 후, `App\Models\User` 모델에 `Laravel\Passport\HasApiTokens` 트레이트와 `Laravel\Passport\Contracts\OAuthenticatable` 인터페이스를 추가하세요. 이 트레이트는 인증된 사용자의 토큰과 스코프를 확인할 수 있는 몇 가지 헬퍼 메서드를 모델에 제공합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements OAuthenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

마지막으로, 애플리케이션의 `config/auth.php` 설정 파일에서 `api` 인증 가드를 정의하고 `driver` 옵션을 `passport`로 설정해야 합니다. 이렇게 하면 API 요청 인증 시 Passport의 `TokenGuard`를 사용하도록 애플리케이션에 지시하게 됩니다:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```


### Passport 배포하기 {#deploying-passport}

애플리케이션 서버에 Passport를 처음 배포할 때는 `passport:keys` 명령어를 실행해야 할 수 있습니다. 이 명령어는 Passport가 액세스 토큰을 생성하는 데 필요한 암호화 키를 생성합니다. 생성된 키는 일반적으로 소스 컨트롤에 보관하지 않습니다:

```shell
php artisan passport:keys
```

필요하다면, Passport의 키를 로드할 경로를 지정할 수 있습니다. 이를 위해 `Passport::loadKeysFrom` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Passport::loadKeysFrom(__DIR__.'/../secrets/oauth');
}
```


#### 환경 변수에서 키 로드하기 {#loading-keys-from-the-environment}

또는 `vendor:publish` Artisan 명령어를 사용하여 Passport의 설정 파일을 게시할 수 있습니다:

```shell
php artisan vendor:publish --tag=passport-config
```

설정 파일이 게시된 후, 애플리케이션의 암호화 키를 환경 변수로 정의하여 로드할 수 있습니다:

```ini
PASSPORT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
<private key here>
-----END RSA PRIVATE KEY-----"

PASSPORT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
<public key here>
-----END PUBLIC KEY-----"
```


### Passport 업그레이드 {#upgrading-passport}

Passport의 새로운 주요 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/passport/blob/master/UPGRADE.md)를 꼼꼼히 확인하는 것이 중요합니다.


## 설정 {#configuration}


### 토큰 수명 {#token-lifetimes}

기본적으로 Passport는 1년 후에 만료되는 장기 액세스 토큰을 발급합니다. 더 길거나 짧은 토큰 수명을 설정하고 싶다면 `tokensExpireIn`, `refreshTokensExpireIn`, `personalAccessTokensExpireIn` 메서드를 사용할 수 있습니다. 이 메서드들은 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Carbon\CarbonInterval;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Passport::tokensExpireIn(CarbonInterval::days(15));
    Passport::refreshTokensExpireIn(CarbonInterval::days(30));
    Passport::personalAccessTokensExpireIn(CarbonInterval::months(6));
}
```

> [!WARNING]
> Passport의 데이터베이스 테이블에 있는 `expires_at` 컬럼은 읽기 전용이며, 표시 용도로만 사용됩니다. 토큰을 발급할 때 Passport는 만료 정보를 서명되고 암호화된 토큰 내부에 저장합니다. 토큰을 무효화해야 한다면 [토큰을 폐기](#revoking-tokens)해야 합니다.


### 기본 모델 오버라이드 {#overriding-default-models}

Passport에서 내부적으로 사용하는 모델을 자유롭게 확장할 수 있습니다. 직접 모델을 정의하고 해당 Passport 모델을 상속하면 됩니다:

```php
use Laravel\Passport\Client as PassportClient;

class Client extends PassportClient
{
    // ...
}
```

모델을 정의한 후에는 `Laravel\Passport\Passport` 클래스를 통해 Passport가 커스텀 모델을 사용하도록 지정할 수 있습니다. 일반적으로, 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 Passport에 커스텀 모델을 알려주어야 합니다:

```php
use App\Models\Passport\AuthCode;
use App\Models\Passport\Client;
use App\Models\Passport\DeviceCode;
use App\Models\Passport\RefreshToken;
use App\Models\Passport\Token;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Passport::useTokenModel(Token::class);
    Passport::useRefreshTokenModel(RefreshToken::class);
    Passport::useAuthCodeModel(AuthCode::class);
    Passport::useClientModel(Client::class);
    Passport::useDeviceCodeModel(DeviceCode::class)
}
```


### 라우트 재정의 {#overriding-routes}

때때로 Passport에서 정의한 라우트를 커스터마이즈하고 싶을 수 있습니다. 이를 위해서는 먼저 애플리케이션의 `AppServiceProvider`의 `register` 메서드에 `Passport::ignoreRoutes`를 추가하여 Passport가 등록하는 라우트를 무시해야 합니다:

```php
use Laravel\Passport\Passport;

/**
 * Register any application services.
 */
public function register(): void
{
    Passport::ignoreRoutes();
}
```

그런 다음, [Passport의 라우트 파일](https://github.com/laravel/passport/blob/master/routes/web.php)에 정의된 라우트를 복사하여 애플리케이션의 `routes/web.php` 파일에 붙여넣고 원하는 대로 수정할 수 있습니다:

```php
Route::group([
    'as' => 'passport.',
    'prefix' => config('passport.path', 'oauth'),
    'namespace' => '\Laravel\Passport\Http\Controllers',
], function () {
    // Passport 라우트...
});
```


## Authorization Code Grant {#authorization-code-grant}

OAuth2를 인증 코드 방식으로 사용하는 것은 대부분의 개발자들이 OAuth2에 익숙한 방식입니다. 인증 코드를 사용할 때, 클라이언트 애플리케이션은 사용자를 서버로 리디렉션하여, 사용자가 클라이언트에 액세스 토큰 발급 요청을 승인하거나 거부할 수 있도록 합니다.

시작하려면, Passport에 "authorization" 뷰를 반환하는 방법을 알려주어야 합니다.

모든 인증 뷰의 렌더링 로직은 `Laravel\Passport\Passport` 클래스에서 제공하는 적절한 메서드를 사용하여 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Inertia\Inertia;
use Laravel\Passport\Passport;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    // 뷰 이름을 제공하는 방법...
    Passport::authorizationView('auth.oauth.authorize');

    // 클로저를 제공하는 방법...
    Passport::authorizationView(
        fn ($parameters) => Inertia::render('Auth/OAuth/Authorize', [
            'request' => $parameters['request'],
            'authToken' => $parameters['authToken'],
            'client' => $parameters['client'],
            'user' => $parameters['user'],
            'scopes' => $parameters['scopes'],
        ])
    );
}
```

Passport는 이 뷰를 반환하는 `/oauth/authorize` 라우트를 자동으로 정의합니다. `auth.oauth.authorize` 템플릿에는 인증을 승인하기 위해 `passport.authorizations.approve` 라우트로 POST 요청을 보내는 폼과, 인증을 거부하기 위해 `passport.authorizations.deny` 라우트로 DELETE 요청을 보내는 폼이 포함되어야 합니다. `passport.authorizations.approve` 및 `passport.authorizations.deny` 라우트는 `state`, `client_id`, `auth_token` 필드를 기대합니다.


### 클라이언트 관리 {#managing-clients}

여러분의 애플리케이션 API와 상호작용해야 하는 애플리케이션을 개발하는 개발자는 "클라이언트"를 생성하여 자신의 애플리케이션을 여러분의 애플리케이션에 등록해야 합니다. 일반적으로 이는 애플리케이션의 이름과, 사용자가 권한 요청을 승인한 후 여러분의 애플리케이션이 리디렉션할 수 있는 URI를 제공하는 것으로 구성됩니다.


#### 퍼스트 파티 클라이언트 {#managing-first-party-clients}

클라이언트를 생성하는 가장 간단한 방법은 `passport:client` Artisan 명령어를 사용하는 것입니다. 이 명령어는 퍼스트 파티 클라이언트를 생성하거나 OAuth2 기능을 테스트할 때 사용할 수 있습니다. `passport:client` 명령어를 실행하면 Passport가 클라이언트에 대한 추가 정보를 입력하도록 안내하며, 클라이언트 ID와 시크릿을 제공합니다:

```shell
php artisan passport:client
```

클라이언트에 여러 개의 리디렉션 URI를 허용하고 싶다면, `passport:client` 명령어에서 URI를 입력하라는 메시지가 표시될 때 쉼표로 구분된 목록을 사용하여 지정할 수 있습니다. 쉼표가 포함된 URI는 URI 인코딩되어야 합니다:

```shell
https://third-party-app.com/callback,https://example.com/oauth/redirect
```


#### 서드파티 클라이언트 {#managing-third-party-clients}

애플리케이션의 사용자는 `passport:client` 명령어를 사용할 수 없으므로, `Laravel\Passport\ClientRepository` 클래스의 `createAuthorizationCodeGrantClient` 메서드를 사용하여 특정 사용자에 대한 클라이언트를 등록할 수 있습니다:

```php
use App\Models\User;
use Laravel\Passport\ClientRepository;

$user = User::find($userId);

// 주어진 사용자에게 속하는 OAuth 앱 클라이언트 생성...
$client = app(ClientRepository::class)->createAuthorizationCodeGrantClient(
    user: $user,
    name: 'Example App',
    redirectUris: ['https://third-party-app.com/callback'],
    confidential: false,
    enableDeviceFlow: true
);

// 해당 사용자에게 속한 모든 OAuth 앱 클라이언트 조회...
$clients = $user->oauthApps()->get();
```

`createAuthorizationCodeGrantClient` 메서드는 `Laravel\Passport\Client` 인스턴스를 반환합니다. `$client->id`를 클라이언트 ID로, `$client->plainSecret`을 클라이언트 시크릿으로 사용자에게 표시할 수 있습니다.


### 토큰 요청하기 {#requesting-tokens}


#### 인가를 위한 리디렉션 {#requesting-tokens-redirecting-for-authorization}

클라이언트가 생성되면, 개발자는 클라이언트 ID와 시크릿을 사용하여 애플리케이션에서 인가 코드와 액세스 토큰을 요청할 수 있습니다. 먼저, 외부 애플리케이션은 아래와 같이 애플리케이션의 `/oauth/authorize` 경로로 리디렉션 요청을 보내야 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Str;

Route::get('/redirect', function (Request $request) {
    $request->session()->put('state', $state = Str::random(40));

    $query = http_build_query([
        'client_id' => 'your-client-id',
        'redirect_uri' => 'https://third-party-app.com/callback',
        'response_type' => 'code',
        'scope' => 'user:read orders:create',
        'state' => $state,
        // 'prompt' => '', // "none", "consent", 또는 "login"
    ]);

    return redirect('https://passport-app.test/oauth/authorize?'.$query);
});
```

`prompt` 파라미터는 Passport 애플리케이션의 인증 동작을 지정하는 데 사용할 수 있습니다.

`prompt` 값이 `none`이면, 사용자가 이미 Passport 애플리케이션에 인증되어 있지 않은 경우 Passport는 항상 인증 오류를 발생시킵니다. 값이 `consent`이면, 이전에 모든 scope에 대해 권한이 부여되었더라도 Passport는 항상 인가 승인 화면을 표시합니다. 값이 `login`이면, 이미 세션이 있더라도 Passport 애플리케이션은 항상 사용자가 다시 로그인하도록 요청합니다.

`prompt` 값이 제공되지 않은 경우, 사용자가 요청된 scope에 대해 외부 애플리케이션에 대한 접근을 이전에 승인하지 않았다면 인가를 요청하는 화면이 표시됩니다.

> [!NOTE]
> `/oauth/authorize` 경로는 이미 Passport에 의해 정의되어 있습니다. 이 경로를 직접 정의할 필요는 없습니다.


#### 요청 승인하기 {#approving-the-request}

인증 요청을 받을 때, Passport는 `prompt` 파라미터의 값(존재하는 경우)에 따라 자동으로 응답하며, 사용자가 인증 요청을 승인하거나 거부할 수 있는 템플릿을 표시할 수 있습니다. 사용자가 요청을 승인하면, 소비 애플리케이션에서 지정한 `redirect_uri`로 다시 리디렉션됩니다. 이때 `redirect_uri`는 클라이언트가 생성될 때 지정한 `redirect` URL과 일치해야 합니다.

때때로, 예를 들어 1st-party 클라이언트를 인증할 때처럼 인증 프롬프트를 건너뛰고 싶을 수 있습니다. 이 경우 [기본 `Client` 모델을 확장](#overriding-default-models)하고 `skipsAuthorization` 메서드를 정의하여 이를 구현할 수 있습니다. 만약 `skipsAuthorization`이 `true`를 반환하면, 클라이언트는 승인된 것으로 간주되어 사용자는 즉시 `redirect_uri`로 리디렉션됩니다. 단, 소비 애플리케이션이 인증을 위해 리디렉션할 때 명시적으로 `prompt` 파라미터를 설정한 경우는 예외입니다.

```php
<?php

namespace App\Models\Passport;

use Illuminate\Contracts\Auth\Authenticatable;
use Laravel\Passport\Client as BaseClient;

class Client extends BaseClient
{
    /**
     * 클라이언트가 인증 프롬프트를 건너뛰어야 하는지 여부를 결정합니다.
     *
     * @param  \Laravel\Passport\Scope[]  $scopes
     */
    public function skipsAuthorization(Authenticatable $user, array $scopes): bool
    {
        return $this->firstParty();
    }
}
```


#### 인가 코드를 액세스 토큰으로 변환하기 {#requesting-tokens-converting-authorization-codes-to-access-tokens}

사용자가 인가 요청을 승인하면, 사용자는 다시 소비 애플리케이션으로 리디렉션됩니다. 소비자는 먼저 리디렉션 전에 저장했던 `state` 파라미터 값을 검증해야 합니다. state 파라미터가 일치하면, 소비자는 액세스 토큰을 요청하기 위해 애플리케이션에 `POST` 요청을 보내야 합니다. 이 요청에는 사용자가 인가 요청을 승인할 때 애플리케이션에서 발급한 인가 코드가 포함되어야 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

Route::get('/callback', function (Request $request) {
    $state = $request->session()->pull('state');

    throw_unless(
        strlen($state) > 0 && $state === $request->state,
        InvalidArgumentException::class,
        'Invalid state value.'
    );

    $response = Http::asForm()->post('https://passport-app.test/oauth/token', [
        'grant_type' => 'authorization_code',
        'client_id' => 'your-client-id',
        'client_secret' => 'your-client-secret',
        'redirect_uri' => 'https://third-party-app.com/callback',
        'code' => $request->code,
    ]);

    return $response->json();
});
```

이 `/oauth/token` 라우트는 `access_token`, `refresh_token`, `expires_in` 속성을 포함하는 JSON 응답을 반환합니다. `expires_in` 속성은 액세스 토큰이 만료되기까지 남은 초(second) 단위를 나타냅니다.

> [!NOTE]
> `/oauth/authorize` 라우트와 마찬가지로, `/oauth/token` 라우트도 Passport에서 자동으로 정의해줍니다. 이 라우트를 직접 정의할 필요는 없습니다.


### 토큰 관리 {#managing-tokens}

`Laravel\Passport\HasApiTokens` 트레이트의 `tokens` 메서드를 사용하여 사용자의 인증된 토큰을 조회할 수 있습니다. 예를 들어, 이를 활용해 사용자가 서드파티 애플리케이션과의 연결을 추적할 수 있는 대시보드를 제공할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Date;
use Laravel\Passport\Token;

$user = User::find($userId);

// 사용자의 모든 유효한 토큰 조회...
$tokens = $user->tokens()
    ->where('revoked', false)
    ->where('expires_at', '>', Date::now())
    ->get();

// 사용자의 서드파티 OAuth 앱 클라이언트 연결 모두 조회...
$connections = $tokens->load('client')
    ->reject(fn (Token $token) => $token->client->firstParty())
    ->groupBy('client_id')
    ->map(fn (Collection $tokens) => [
        'client' => $tokens->first()->client,
        'scopes' => $tokens->pluck('scopes')->flatten()->unique()->values()->all(),
        'tokens_count' => $tokens->count(),
    ])
    ->values();
```


### 토큰 갱신 {#refreshing-tokens}

애플리케이션이 단명 액세스 토큰을 발급하는 경우, 사용자는 액세스 토큰이 발급될 때 함께 제공된 리프레시 토큰을 통해 액세스 토큰을 갱신해야 합니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::asForm()->post('https://passport-app.test/oauth/token', [
    'grant_type' => 'refresh_token',
    'refresh_token' => 'the-refresh-token',
    'client_id' => 'your-client-id',
    'client_secret' => 'your-client-secret', // 기밀 클라이언트에만 필요...
    'scope' => 'user:read orders:create',
]);

return $response->json();
```

이 `/oauth/token` 라우트는 `access_token`, `refresh_token`, 그리고 `expires_in` 속성을 포함한 JSON 응답을 반환합니다. `expires_in` 속성은 액세스 토큰이 만료되기까지 남은 초(second) 단위의 시간을 나타냅니다.


### 토큰 취소하기 {#revoking-tokens}

`Laravel\Passport\Token` 모델의 `revoke` 메서드를 사용하여 토큰을 취소할 수 있습니다. 토큰의 리프레시 토큰은 `Laravel\Passport\RefreshToken` 모델의 `revoke` 메서드를 사용하여 취소할 수 있습니다:

```php
use Laravel\Passport\Passport;
use Laravel\Passport\Token;

$token = Passport::token()->find($tokenId);

// 액세스 토큰 취소...
$token->revoke();

// 토큰의 리프레시 토큰 취소...
$token->refreshToken?->revoke();

// 사용자의 모든 토큰 취소...
User::find($userId)->tokens()->each(function (Token $token) {
    $token->revoke();
    $token->refreshToken?->revoke();
});
```


### 토큰 정리 {#purging-tokens}

토큰이 폐기되었거나 만료된 경우, 데이터베이스에서 해당 토큰을 정리하고 싶을 수 있습니다. Passport에 포함된 `passport:purge` Artisan 명령어를 사용하면 이를 손쉽게 처리할 수 있습니다:

```shell
# 폐기되거나 만료된 토큰, 인증 코드, 디바이스 코드를 정리합니다...
php artisan passport:purge

# 6시간 이상 만료된 토큰만 정리합니다...
php artisan passport:purge --hours=6

# 폐기된 토큰, 인증 코드, 디바이스 코드만 정리합니다...
php artisan passport:purge --revoked

# 만료된 토큰, 인증 코드, 디바이스 코드만 정리합니다...
php artisan passport:purge --expired
```

또한, 애플리케이션의 `routes/console.php` 파일에서 [스케줄링된 작업](/laravel/12.x/scheduling)을 설정하여 토큰을 자동으로 정리할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('passport:purge')->hourly();
```


## PKCE가 적용된 인가 코드 그랜트 {#code-grant-pkce}

"코드 교환을 위한 증명 키(Proof Key for Code Exchange, PKCE)"가 적용된 인가 코드 그랜트는 싱글 페이지 애플리케이션이나 모바일 애플리케이션이 API에 접근할 때 안전하게 인증할 수 있는 방법입니다. 클라이언트 시크릿을 안전하게 보관할 수 없거나, 인가 코드가 공격자에게 가로채질 위험을 줄이고자 할 때 이 그랜트를 사용해야 합니다. 인가 코드를 액세스 토큰으로 교환할 때, "코드 검증자(code verifier)"와 "코드 챌린지(code challenge)"의 조합이 클라이언트 시크릿을 대신하게 됩니다.


### 클라이언트 생성하기 {#creating-a-auth-pkce-grant-client}

애플리케이션이 PKCE가 적용된 인증 코드 그랜트를 통해 토큰을 발급하기 전에, PKCE를 지원하는 클라이언트를 생성해야 합니다. 이를 위해 `--public` 옵션과 함께 `passport:client` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan passport:client --public
```


### 토큰 요청하기 {#requesting-auth-pkce-grant-tokens}


#### 코드 검증기와 코드 챌린지 {#code-verifier-code-challenge}

이 인증 그랜트는 클라이언트 시크릿을 제공하지 않으므로, 개발자는 토큰을 요청하기 위해 코드 검증기와 코드 챌린지의 조합을 생성해야 합니다.

코드 검증기는 [RFC 7636 명세](https://tools.ietf.org/html/rfc7636)에 정의된 대로, 문자, 숫자, 그리고 `"-"`, `"."`, `"_"`, `"~"` 문자를 포함한 43자에서 128자 사이의 임의의 문자열이어야 합니다.

코드 챌린지는 URL 및 파일 이름에 안전한 문자로 이루어진 Base64 인코딩 문자열이어야 합니다. 마지막에 오는 `'='` 문자는 제거되어야 하며, 줄바꿈, 공백 또는 기타 추가 문자가 포함되어서는 안 됩니다.

```php
$encoded = base64_encode(hash('sha256', $codeVerifier, true));

$codeChallenge = strtr(rtrim($encoded, '='), '+/', '-_');
```


#### 인가를 위한 리디렉션 {#code-grant-pkce-redirecting-for-authorization}

클라이언트가 생성되면, 클라이언트 ID와 생성된 코드 검증자(code verifier), 코드 챌린지(code challenge)를 사용하여 애플리케이션에서 인가 코드와 액세스 토큰을 요청할 수 있습니다. 먼저, 사용하는 애플리케이션은 여러분의 애플리케이션의 `/oauth/authorize` 경로로 리디렉션 요청을 보내야 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Str;

Route::get('/redirect', function (Request $request) {
    $request->session()->put('state', $state = Str::random(40));

    $request->session()->put(
        'code_verifier', $codeVerifier = Str::random(128)
    );

    $codeChallenge = strtr(rtrim(
        base64_encode(hash('sha256', $codeVerifier, true))
    , '='), '+/', '-_');

    $query = http_build_query([
        'client_id' => 'your-client-id',
        'redirect_uri' => 'https://third-party-app.com/callback',
        'response_type' => 'code',
        'scope' => 'user:read orders:create',
        'state' => $state,
        'code_challenge' => $codeChallenge,
        'code_challenge_method' => 'S256',
        // 'prompt' => '', // "none", "consent", 또는 "login"
    ]);

    return redirect('https://passport-app.test/oauth/authorize?'.$query);
});
```


#### 인가 코드를 액세스 토큰으로 변환하기 {#code-grant-pkce-converting-authorization-codes-to-access-tokens}

사용자가 인가 요청을 승인하면, 사용자는 다시 소비 애플리케이션으로 리디렉션됩니다. 소비자는 표준 Authorization Code Grant에서와 마찬가지로, 리디렉션 이전에 저장한 값과 `state` 파라미터가 일치하는지 확인해야 합니다.

state 파라미터가 일치하면, 소비자는 액세스 토큰을 요청하기 위해 애플리케이션에 `POST` 요청을 보내야 합니다. 이 요청에는 사용자가 인가 요청을 승인할 때 애플리케이션에서 발급한 인가 코드와, 처음 생성한 code verifier가 포함되어야 합니다:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

Route::get('/callback', function (Request $request) {
    $state = $request->session()->pull('state');

    $codeVerifier = $request->session()->pull('code_verifier');

    throw_unless(
        strlen($state) > 0 && $state === $request->state,
        InvalidArgumentException::class
    );

    $response = Http::asForm()->post('https://passport-app.test/oauth/token', [
        'grant_type' => 'authorization_code',
        'client_id' => 'your-client-id',
        'redirect_uri' => 'https://third-party-app.com/callback',
        'code_verifier' => $codeVerifier,
        'code' => $request->code,
    ]);

    return $response->json();
});
```


## 디바이스 인가 그랜트 {#device-authorization-grant}

OAuth2 디바이스 인가 그랜트는 TV나 게임 콘솔과 같이 브라우저가 없거나 입력이 제한된 디바이스가 "디바이스 코드"를 교환하여 액세스 토큰을 얻을 수 있도록 해줍니다. 디바이스 플로우를 사용할 때, 디바이스 클라이언트는 사용자가 컴퓨터나 스마트폰과 같은 보조 디바이스를 사용하여 서버에 접속하고 제공된 "유저 코드"를 입력한 뒤, 액세스 요청을 승인하거나 거부하도록 안내합니다.

시작하려면, Passport에 "유저 코드"와 "인가" 뷰를 어떻게 반환할지 지시해야 합니다.

모든 인가 뷰의 렌더링 로직은 `Laravel\Passport\Passport` 클래스에서 제공하는 적절한 메서드를 사용하여 커스터마이즈할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다.

```php
use Inertia\Inertia;
use Laravel\Passport\Passport;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    // 뷰 이름을 제공하는 방법...
    Passport::deviceUserCodeView('auth.oauth.device.user-code');
    Passport::deviceAuthorizationView('auth.oauth.device.authorize');

    // 클로저를 제공하는 방법...
    Passport::deviceUserCodeView(
        fn ($parameters) => Inertia::render('Auth/OAuth/Device/UserCode')
    );

    Passport::deviceAuthorizationView(
        fn ($parameters) => Inertia::render('Auth/OAuth/Device/Authorize', [
            'request' => $parameters['request'],
            'authToken' => $parameters['authToken'],
            'client' => $parameters['client'],
            'user' => $parameters['user'],
            'scopes' => $parameters['scopes'],
        ])
    );

    // ...
}
```

Passport는 이러한 뷰를 반환하는 라우트를 자동으로 정의합니다. `auth.oauth.device.user-code` 템플릿에는 `passport.device.authorizations.authorize` 라우트로 GET 요청을 보내는 폼이 포함되어야 합니다. `passport.device.authorizations.authorize` 라우트는 `user_code` 쿼리 파라미터를 기대합니다.

`auth.oauth.device.authorize` 템플릿에는 인가를 승인하기 위해 `passport.device.authorizations.approve` 라우트로 POST 요청을 보내는 폼과, 인가를 거부하기 위해 `passport.device.authorizations.deny` 라우트로 DELETE 요청을 보내는 폼이 포함되어야 합니다. `passport.device.authorizations.approve` 및 `passport.device.authorizations.deny` 라우트는 `state`, `client_id`, `auth_token` 필드를 기대합니다.


### 디바이스 인가 그랜트 클라이언트 생성하기 {#creating-a-device-authorization-grant-client}

애플리케이션이 디바이스 인가 그랜트를 통해 토큰을 발급할 수 있으려면, 디바이스 플로우가 활성화된 클라이언트를 먼저 생성해야 합니다. `--device` 옵션과 함께 `passport:client` 아티즌 명령어를 사용하여 이를 수행할 수 있습니다. 이 명령어는 1차 디바이스 플로우가 활성화된 클라이언트를 생성하고, 클라이언트 ID와 시크릿을 제공합니다:

```shell
php artisan passport:client --device
```

또한, `ClientRepository` 클래스의 `createDeviceAuthorizationGrantClient` 메서드를 사용하여 주어진 사용자에 속한 서드파티 클라이언트를 등록할 수도 있습니다:

```php
use App\Models\User;
use Laravel\Passport\ClientRepository;

$user = User::find($userId);

$client = app(ClientRepository::class)->createDeviceAuthorizationGrantClient(
    user: $user,
    name: 'Example Device',
    confidential: false,
);
```


### 토큰 요청하기 {#requesting-device-authorization-grant-tokens}


#### 디바이스 코드 요청하기 {#device-code}

클라이언트가 생성되면, 개발자는 클라이언트 ID를 사용하여 애플리케이션에서 디바이스 코드를 요청할 수 있습니다. 먼저, 디바이스는 디바이스 코드를 요청하기 위해 애플리케이션의 `/oauth/device/code` 경로로 `POST` 요청을 보내야 합니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::asForm()->post('https://passport-app.test/oauth/device/code', [
    'client_id' => 'your-client-id',
    'scope' => 'user:read orders:create',
]);

return $response->json();
```

이 코드는 `device_code`, `user_code`, `verification_uri`, `interval`, `expires_in` 속성을 포함하는 JSON 응답을 반환합니다. `expires_in` 속성은 디바이스 코드가 만료되기까지의 초 단위를 나타냅니다. `interval` 속성은 디바이스가 `/oauth/token` 경로를 폴링할 때, 속도 제한 오류를 피하기 위해 요청 간 대기해야 하는 초 단위를 나타냅니다.

> [!NOTE]
> `/oauth/device/code` 경로는 이미 Passport에 의해 정의되어 있습니다. 이 경로를 직접 정의할 필요가 없습니다.


#### 인증 URI 및 사용자 코드 표시 {#user-code}

디바이스 코드 요청을 받은 후, 해당 디바이스는 사용자가 다른 디바이스를 사용하여 제공된 `verification_uri`에 접속하고 `user_code`를 입력하여 인증 요청을 승인하도록 안내해야 합니다.


#### 폴링 토큰 요청 {#polling-token-request}

사용자가 별도의 기기를 사용하여 접근을 허용(또는 거부)하게 되므로, 토큰을 요청하는 기기는 사용자가 요청에 응답했는지 확인하기 위해 애플리케이션의 `/oauth/token` 라우트를 폴링해야 합니다. 디바이스 코드를 요청할 때 JSON 응답에서 제공된 최소 폴링 `interval` 값을 사용하여 레이트 리밋 오류를 방지해야 합니다:

```php
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;

$interval = 5;

do {
    Sleep::for($interval)->seconds();

    $response = Http::asForm()->post('https://passport-app.test/oauth/token', [
        'grant_type' => 'urn:ietf:params:oauth:grant-type:device_code',
        'client_id' => 'your-client-id',
        'client_secret' => 'your-client-secret', // 기밀 클라이언트에만 필요...
        'device_code' => 'the-device-code',
    ]);

    if ($response->json('error') === 'slow_down') {
        $interval += 5;
    }
} while (in_array($response->json('error'), ['authorization_pending', 'slow_down']));

return $response->json();
```

사용자가 인증 요청을 승인했다면, `access_token`, `refresh_token`, `expires_in` 속성이 포함된 JSON 응답이 반환됩니다. `expires_in` 속성은 액세스 토큰이 만료되기까지 남은 초(second) 단위를 나타냅니다.


## 패스워드 그랜트 {#password-grant}

> [!WARNING]
> 더 이상 패스워드 그랜트 토큰 사용을 권장하지 않습니다. 대신 [OAuth2 서버에서 현재 권장하는 그랜트 타입](https://oauth2.thephpleague.com/authorization-server/which-grant/)을 선택하세요.

OAuth2 패스워드 그랜트는 모바일 애플리케이션과 같은 다른 1차 클라이언트가 이메일 주소/사용자명과 비밀번호를 사용하여 액세스 토큰을 얻을 수 있도록 해줍니다. 이를 통해 사용자가 전체 OAuth2 인가 코드 리디렉션 플로우를 거치지 않고도 1차 클라이언트에 안전하게 액세스 토큰을 발급할 수 있습니다.

패스워드 그랜트를 활성화하려면, 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 `enablePasswordGrant` 메서드를 호출하세요:

```php
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Passport::enablePasswordGrant();
}
```


### 패스워드 그랜트 클라이언트 생성하기 {#creating-a-password-grant-client}

애플리케이션이 패스워드 그랜트를 통해 토큰을 발급할 수 있으려면, 먼저 패스워드 그랜트 클라이언트를 생성해야 합니다. `--password` 옵션과 함께 `passport:client` Artisan 명령어를 사용하여 클라이언트를 생성할 수 있습니다.

```shell
php artisan passport:client --password
```


### 토큰 요청하기 {#requesting-password-grant-tokens}

grant를 활성화하고 password grant 클라이언트를 생성했다면, 사용자의 이메일 주소와 비밀번호를 포함하여 `/oauth/token` 경로로 `POST` 요청을 보내 액세스 토큰을 요청할 수 있습니다. 이 경로는 이미 Passport에 의해 등록되어 있으므로 별도로 정의할 필요가 없습니다. 요청이 성공하면 서버로부터 JSON 응답에 `access_token`과 `refresh_token`이 포함되어 반환됩니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::asForm()->post('https://passport-app.test/oauth/token', [
    'grant_type' => 'password',
    'client_id' => 'your-client-id',
    'client_secret' => 'your-client-secret', // 기밀 클라이언트에만 필요합니다...
    'username' => 'taylor@laravel.com',
    'password' => 'my-password',
    'scope' => 'user:read orders:create',
]);

return $response->json();
```

> [!NOTE]
> 기본적으로 액세스 토큰은 장시간 유효합니다. 하지만 필요하다면 [최대 액세스 토큰 유효 기간을 설정](#configuration)할 수 있습니다.


### 모든 스코프 요청하기 {#requesting-all-scopes}

패스워드 그랜트 또는 클라이언트 자격 증명 그랜트를 사용할 때, 애플리케이션에서 지원하는 모든 스코프에 대해 토큰을 인증하고 싶을 수 있습니다. 이 경우 `*` 스코프를 요청하면 됩니다. `*` 스코프를 요청하면, 토큰 인스턴스의 `can` 메서드는 항상 `true`를 반환합니다. 이 스코프는 `password` 또는 `client_credentials` 그랜트를 사용하여 발급된 토큰에만 할당할 수 있습니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::asForm()->post('https://passport-app.test/oauth/token', [
    'grant_type' => 'password',
    'client_id' => 'your-client-id',
    'client_secret' => 'your-client-secret', // 기밀 클라이언트에만 필요...
    'username' => 'taylor@laravel.com',
    'password' => 'my-password',
    'scope' => '*',
]);
```


### 사용자 제공자 커스터마이징 {#customizing-the-user-provider}

애플리케이션에서 하나 이상의 [인증 사용자 제공자](/laravel/12.x/authentication#introduction)를 사용하는 경우, `artisan passport:client --password` 명령어로 클라이언트를 생성할 때 `--provider` 옵션을 제공하여 패스워드 그랜트 클라이언트가 사용할 사용자 제공자를 지정할 수 있습니다. 지정한 제공자 이름은 애플리케이션의 `config/auth.php` 설정 파일에 정의된 유효한 제공자와 일치해야 합니다. 그런 다음 [미들웨어를 사용하여 라우트를 보호](#multiple-authentication-guards)하여, 가드에 지정된 제공자의 사용자만이 인가되도록 할 수 있습니다.


### 사용자명 필드 커스터마이징 {#customizing-the-username-field}

패스워드 그랜트 방식을 사용하여 인증할 때, Passport는 인증 가능한 모델의 `email` 속성을 "사용자명"으로 사용합니다. 하지만, 모델에 `findForPassport` 메서드를 정의하여 이 동작을 커스터마이즈할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements OAuthenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * 주어진 사용자명에 해당하는 사용자 인스턴스를 찾습니다.
     */
    public function findForPassport(string $username): User
    {
        return $this->where('username', $username)->first();
    }
}
```


### 비밀번호 검증 커스터마이징 {#customizing-the-password-validation}

패스포트의 패스워드 그랜트 방식을 사용하여 인증할 때, Passport는 모델의 `password` 속성을 사용해 입력된 비밀번호를 검증합니다. 만약 모델에 `password` 속성이 없거나 비밀번호 검증 로직을 커스터마이징하고 싶다면, 모델에 `validateForPassportPasswordGrant` 메서드를 정의할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements OAuthenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * Passport 패스워드 그랜트용 사용자 비밀번호 검증.
     */
    public function validateForPassportPasswordGrant(string $password): bool
    {
        return Hash::check($password, $this->password);
    }
}
```


## 암시적 그랜트 {#implicit-grant}

> [!WARNING]
> 더 이상 암시적 그랜트 토큰 사용을 권장하지 않습니다. 대신 [OAuth2 서버에서 현재 권장하는 그랜트 타입](https://oauth2.thephpleague.com/authorization-server/which-grant/)을 선택하세요.

암시적 그랜트는 인증 코드 그랜트와 유사하지만, 토큰이 인증 코드를 교환하지 않고 클라이언트에 반환됩니다. 이 그랜트는 클라이언트 자격 증명을 안전하게 저장할 수 없는 JavaScript 또는 모바일 애플리케이션에서 가장 일반적으로 사용됩니다. 이 그랜트를 활성화하려면, 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메소드에서 `enableImplicitGrant` 메소드를 호출하세요:

```php
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Passport::enableImplicitGrant();
}
```

애플리케이션이 암시적 그랜트를 통해 토큰을 발급할 수 있으려면, 암시적 그랜트 클라이언트를 생성해야 합니다. `--implicit` 옵션과 함께 `passport:client` 아티즌 명령어를 사용하여 생성할 수 있습니다.

```shell
php artisan passport:client --implicit
```

그랜트가 활성화되고 암시적 클라이언트가 생성되면, 개발자는 클라이언트 ID를 사용하여 애플리케이션에서 액세스 토큰을 요청할 수 있습니다. 사용하는 애플리케이션은 아래와 같이 애플리케이션의 `/oauth/authorize` 경로로 리디렉션 요청을 보내야 합니다:

```php
use Illuminate\Http\Request;

Route::get('/redirect', function (Request $request) {
    $request->session()->put('state', $state = Str::random(40));

    $query = http_build_query([
        'client_id' => 'your-client-id',
        'redirect_uri' => 'https://third-party-app.com/callback',
        'response_type' => 'token',
        'scope' => 'user:read orders:create',
        'state' => $state,
        // 'prompt' => '', // "none", "consent", 또는 "login"
    ]);

    return redirect('https://passport-app.test/oauth/authorize?'.$query);
});
```

> [!NOTE]
> `/oauth/authorize` 경로는 이미 Passport에 의해 정의되어 있습니다. 이 경로를 수동으로 정의할 필요가 없습니다.


## 클라이언트 자격 증명 그랜트 {#client-credentials-grant}

클라이언트 자격 증명 그랜트는 머신 간 인증에 적합합니다. 예를 들어, 이 그랜트를 예약된 작업에서 API를 통해 유지 관리 작업을 수행할 때 사용할 수 있습니다.

애플리케이션이 클라이언트 자격 증명 그랜트를 통해 토큰을 발급하려면, 먼저 클라이언트 자격 증명 그랜트 클라이언트를 생성해야 합니다. `passport:client` Artisan 명령어의 `--client` 옵션을 사용하여 생성할 수 있습니다:

```shell
php artisan passport:client --client
```

다음으로, `Laravel\Passport\Http\Middleware\EnsureClientIsResourceOwner` 미들웨어를 라우트에 할당하세요:

```php
use Laravel\Passport\Http\Middleware\EnsureClientIsResourceOwner;

Route::get('/orders', function (Request $request) {
    // 액세스 토큰이 유효하고 클라이언트가 리소스 소유자입니다...
})->middleware(EnsureClientIsResourceOwner::class);
```

특정 스코프로 라우트 접근을 제한하려면, `using` 메서드에 필요한 스코프 목록을 전달할 수 있습니다:

```php
Route::get('/orders', function (Request $request) {
    // 액세스 토큰이 유효하고, 클라이언트가 리소스 소유자이며, "servers:read"와 "servers:create" 스코프를 모두 가지고 있습니다...
})->middleware(EnsureClientIsResourceOwner::using('servers:read', 'servers:create');
```


### 토큰 가져오기 {#retrieving-tokens}

이 그랜트 타입을 사용하여 토큰을 가져오려면 `oauth/token` 엔드포인트에 요청을 보내면 됩니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::asForm()->post('https://passport-app.test/oauth/token', [
    'grant_type' => 'client_credentials',
    'client_id' => 'your-client-id',
    'client_secret' => 'your-client-secret',
    'scope' => 'servers:read servers:create',
]);

return $response->json()['access_token'];
```


## 개인 액세스 토큰 {#personal-access-tokens}

때때로 사용자는 일반적인 인가 코드 리디렉션 플로우를 거치지 않고 스스로 액세스 토큰을 발급받고 싶어할 수 있습니다. 애플리케이션의 UI를 통해 사용자가 직접 토큰을 발급받을 수 있도록 허용하면, 사용자가 API를 실험해볼 수 있도록 하거나, 전반적으로 액세스 토큰을 발급하는 더 간단한 방법을 제공할 수 있습니다.

> [!NOTE]
> 애플리케이션이 주로 개인 액세스 토큰을 발급하기 위해 Passport를 사용하고 있다면, API 액세스 토큰 발급을 위한 라라벨의 경량 1st-party 라이브러리인 [Laravel Sanctum](/laravel/12.x/sanctum) 사용을 고려해보세요.


### 개인 액세스 클라이언트 생성하기 {#creating-a-personal-access-client}

애플리케이션이 개인 액세스 토큰을 발급할 수 있으려면, 먼저 개인 액세스 클라이언트를 생성해야 합니다. 이를 위해 `--personal` 옵션과 함께 `passport:client` Artisan 명령어를 실행하면 됩니다. 이미 `passport:install` 명령어를 실행했다면, 이 명령어를 다시 실행할 필요는 없습니다:

```shell
php artisan passport:client --personal
```


### 사용자 제공자 커스터마이징 {#customizing-the-user-provider-for-pat}

애플리케이션에서 둘 이상의 [인증 사용자 제공자](/laravel/12.x/authentication#introduction)를 사용하는 경우, `artisan passport:client --personal` 명령어로 클라이언트를 생성할 때 `--provider` 옵션을 제공하여 개인 액세스 권한 부여 클라이언트가 사용할 사용자 제공자를 지정할 수 있습니다. 지정한 제공자 이름은 애플리케이션의 `config/auth.php` 설정 파일에 정의된 유효한 제공자와 일치해야 합니다. 그런 다음 [미들웨어를 사용하여 라우트를 보호](#multiple-authentication-guards)하여 가드에 지정된 제공자의 사용자만 인가되도록 할 수 있습니다.


### 개인 액세스 토큰 관리 {#managing-personal-access-tokens}

개인 액세스 클라이언트를 생성한 후에는 `App\Models\User` 모델 인스턴스의 `createToken` 메서드를 사용하여 특정 사용자에 대한 토큰을 발급할 수 있습니다. `createToken` 메서드는 토큰의 이름을 첫 번째 인수로 받고, [스코프](#token-scopes)의 배열을 두 번째 인수로 선택적으로 받을 수 있습니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Date;
use Laravel\Passport\Token;

$user = User::find($userId);

// 스코프 없이 토큰 생성...
$token = $user->createToken('My Token')->accessToken;

// 스코프와 함께 토큰 생성...
$token = $user->createToken('My Token', ['user:read', 'orders:create'])->accessToken;

// 모든 스코프를 가진 토큰 생성...
$token = $user->createToken('My Token', ['*'])->accessToken;

// 해당 사용자에게 속한 모든 유효한 개인 액세스 토큰 조회...
$tokens = $user->tokens()
    ->with('client')
    ->where('revoked', false)
    ->where('expires_at', '>', Date::now())
    ->get()
    ->filter(fn (Token $token) => $token->client->hasGrantType('personal_access'));
```


## 라우트 보호하기 {#protecting-routes}


### 미들웨어를 통한 인증 {#via-middleware}

Passport는 들어오는 요청의 액세스 토큰을 검증하는 [인증 가드](/laravel/12.x/authentication#adding-custom-guards)를 포함하고 있습니다. `api` 가드가 `passport` 드라이버를 사용하도록 설정한 후에는, 유효한 액세스 토큰이 필요한 모든 라우트에 `auth:api` 미들웨어만 지정하면 됩니다:

```php
Route::get('/user', function () {
    // API 인증된 사용자만 이 라우트에 접근할 수 있습니다...
})->middleware('auth:api');
```

> [!WARNING]
> [클라이언트 자격 증명 그랜트](#client-credentials-grant)를 사용하는 경우, 라우트를 보호하기 위해 `auth:api` 미들웨어 대신 [the `Laravel\Passport\Http\Middleware\EnsureClientIsResourceOwner` 미들웨어](#client-credentials-grant)를 사용해야 합니다.


#### 다중 인증 가드 {#multiple-authentication-guards}

애플리케이션에서 서로 다른 유형의 사용자를 인증해야 하고, 이들이 완전히 다른 Eloquent 모델을 사용할 경우, 애플리케이션의 각 사용자 제공자 유형에 대해 가드 구성을 정의해야 할 수 있습니다. 이렇게 하면 특정 사용자 제공자를 위한 요청을 보호할 수 있습니다. 예를 들어, 다음과 같은 `config/auth.php` 구성 파일의 가드 구성이 있다고 가정해봅시다:

```php
'guards' => [
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],

    'api-customers' => [
        'driver' => 'passport',
        'provider' => 'customers',
    ],
],
```

다음 라우트는 `customers` 사용자 제공자를 사용하는 `api-customers` 가드를 활용하여 들어오는 요청을 인증합니다:

```php
Route::get('/customer', function () {
    // ...
})->middleware('auth:api-customers');
```

> [!NOTE]
> Passport에서 여러 사용자 제공자를 사용하는 방법에 대한 자세한 내용은 [개인 액세스 토큰 문서](#customizing-the-user-provider-for-pat)와 [비밀번호 그랜트 문서](#customizing-the-user-provider)를 참고하세요.


### 액세스 토큰 전달하기 {#passing-the-access-token}

Passport로 보호된 라우트를 호출할 때, 애플리케이션의 API 소비자는 요청의 `Authorization` 헤더에 액세스 토큰을 `Bearer` 토큰으로 지정해야 합니다. 예를 들어, `Http` 파사드를 사용할 때는 다음과 같이 작성할 수 있습니다:

```php
use Illuminate\Support\Facades\Http;

$response = Http::withHeaders([
    'Accept' => 'application/json',
    'Authorization' => "Bearer $accessToken",
])->get('https://passport-app.test/api/user');

return $response->json();
```


## 토큰 범위 {#token-scopes}

범위를 사용하면 API 클라이언트가 계정에 대한 액세스 권한을 요청할 때 특정 권한 집합을 요청할 수 있습니다. 예를 들어, 전자상거래 애플리케이션을 구축하는 경우 모든 API 소비자가 주문을 할 수 있는 권한이 필요하지 않을 수 있습니다. 대신, 소비자가 주문 배송 상태에 대한 액세스 권한만 요청하도록 허용할 수 있습니다. 다시 말해, 범위를 사용하면 애플리케이션 사용자가 타사 애플리케이션이 자신을 대신하여 수행할 수 있는 작업을 제한할 수 있습니다.


### 스코프 정의하기 {#defining-scopes}

애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 `Passport::tokensCan` 메서드를 사용하여 API의 스코프를 정의할 수 있습니다. `tokensCan` 메서드는 스코프 이름과 스코프 설명으로 이루어진 배열을 인수로 받습니다. 스코프 설명은 원하는 어떤 내용이든 입력할 수 있으며, 인가 승인 화면에서 사용자에게 표시됩니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Passport::tokensCan([
        'user:read' => '사용자 정보 조회',
        'orders:create' => '주문 생성',
        'orders:read:status' => '주문 상태 확인',
    ]);
}
```


### 기본 스코프 {#default-scope}

클라이언트가 특정 스코프를 요청하지 않은 경우, `defaultScopes` 메서드를 사용하여 Passport 서버가 토큰에 기본 스코프를 자동으로 부여하도록 설정할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Laravel\Passport\Passport;

Passport::tokensCan([
    'user:read' => '사용자 정보 조회',
    'orders:create' => '주문 생성',
    'orders:read:status' => '주문 상태 확인',
]);

Passport::defaultScopes([
    'user:read',
    'orders:create',
]);
```


### 토큰에 스코프 할당하기 {#assigning-scopes-to-tokens}


#### 권한 코드 요청 시 {#when-requesting-authorization-codes}

권한 코드 그랜트를 사용하여 액세스 토큰을 요청할 때, 컨슈머는 원하는 스코프를 `scope` 쿼리 문자열 파라미터로 지정해야 합니다. `scope` 파라미터는 스페이스(공백)로 구분된 스코프 목록이어야 합니다:

```php
Route::get('/redirect', function () {
    $query = http_build_query([
        'client_id' => 'your-client-id',
        'redirect_uri' => 'https://third-party-app.com/callback',
        'response_type' => 'code',
        'scope' => 'user:read orders:create',
    ]);

    return redirect('https://passport-app.test/oauth/authorize?'.$query);
});
```


#### 개인 액세스 토큰 발급 시 {#when-issuing-personal-access-tokens}

`App\Models\User` 모델의 `createToken` 메서드를 사용하여 개인 액세스 토큰을 발급하는 경우, 원하는 스코프의 배열을 두 번째 인수로 메서드에 전달할 수 있습니다:

```php
$token = $user->createToken('My Token', ['orders:create'])->accessToken;
```


### 스코프 확인하기 {#checking-scopes}

Passport는 주어진 스코프가 부여된 토큰으로 인증된 요청인지 확인할 수 있는 두 가지 미들웨어를 제공합니다.


#### 모든 스코프 확인 {#check-for-all-scopes}

`Laravel\Passport\Http\Middleware\CheckToken` 미들웨어는 라우트에 할당되어 들어오는 요청의 액세스 토큰이 나열된 모든 스코프를 가지고 있는지 확인할 수 있습니다:

```php
use Laravel\Passport\Http\Middleware\CheckToken;

Route::get('/orders', function () {
    // 액세스 토큰에 "orders:read"와 "orders:create" 스코프가 모두 포함되어 있습니다...
})->middleware(['auth:api', CheckToken::using('orders:read', 'orders:create');
```


#### 임의의 스코프 확인 {#check-for-any-scopes}

`Laravel\Passport\Http\Middleware\CheckTokenForAnyScope` 미들웨어는 들어오는 요청의 액세스 토큰이 *나열된 스코프 중 하나 이상*을 가지고 있는지 확인하기 위해 라우트에 할당할 수 있습니다:

```php
use Laravel\Passport\Http\Middleware\CheckTokenForAnyScope;

Route::get('/orders', function () {
    // 액세스 토큰에 "orders:read" 또는 "orders:create" 스코프가 하나라도 있으면 통과...
})->middleware(['auth:api', CheckTokenForAnyScope::using('orders:read', 'orders:create');
```


#### 토큰 인스턴스에서 스코프 확인하기 {#checking-scopes-on-a-token-instance}

액세스 토큰으로 인증된 요청이 애플리케이션에 들어온 후에도, 인증된 `App\Models\User` 인스턴스의 `tokenCan` 메서드를 사용하여 해당 토큰이 특정 스코프를 가지고 있는지 확인할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/orders', function (Request $request) {
    if ($request->user()->tokenCan('orders:create')) {
        // ...
    }
});
```


#### 추가 Scope 메서드 {#additional-scope-methods}

`scopeIds` 메서드는 정의된 모든 ID / 이름의 배열을 반환합니다:

```php
use Laravel\Passport\Passport;

Passport::scopeIds();
```

`scopes` 메서드는 `Laravel\Passport\Scope` 인스턴스로 정의된 모든 scope의 배열을 반환합니다:

```php
Passport::scopes();
```

`scopesFor` 메서드는 주어진 ID / 이름에 해당하는 `Laravel\Passport\Scope` 인스턴스의 배열을 반환합니다:

```php
Passport::scopesFor(['user:read', 'orders:create']);
```

`hasScope` 메서드를 사용하여 특정 scope가 정의되어 있는지 확인할 수 있습니다:

```php
Passport::hasScope('orders:create');
```


## SPA 인증 {#spa-authentication}

API를 구축할 때, JavaScript 애플리케이션에서 직접 자신의 API를 소비할 수 있다는 점은 매우 유용할 수 있습니다. 이러한 API 개발 방식은 여러분의 애플리케이션이 외부에 공개하는 것과 동일한 API를 직접 사용할 수 있게 해줍니다. 동일한 API는 웹 애플리케이션, 모바일 애플리케이션, 서드파티 애플리케이션, 그리고 다양한 패키지 매니저에 배포할 수 있는 SDK 등에서 모두 사용할 수 있습니다.

일반적으로 JavaScript 애플리케이션에서 API를 사용하려면, 액세스 토큰을 애플리케이션에 수동으로 전달하고 각 요청마다 함께 전송해야 합니다. 하지만 Passport에는 이를 자동으로 처리해주는 미들웨어가 포함되어 있습니다. 여러분이 해야 할 일은 애플리케이션의 `bootstrap/app.php` 파일에서 `web` 미들웨어 그룹에 `CreateFreshApiToken` 미들웨어를 추가하는 것뿐입니다:

```php
use Laravel\Passport\Http\Middleware\CreateFreshApiToken;

->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        CreateFreshApiToken::class,
    ]);
})
```

> [!WARNING]
> `CreateFreshApiToken` 미들웨어가 미들웨어 스택의 마지막에 위치하도록 반드시 확인해야 합니다.

이 미들웨어는 응답에 `laravel_token` 쿠키를 추가합니다. 이 쿠키에는 Passport가 JavaScript 애플리케이션의 API 요청을 인증하는 데 사용할 암호화된 JWT가 포함되어 있습니다. JWT의 수명은 `session.lifetime` 설정 값과 동일합니다. 이제 브라우저가 이후의 모든 요청에 이 쿠키를 자동으로 전송하므로, 액세스 토큰을 명시적으로 전달하지 않고도 애플리케이션의 API에 요청을 보낼 수 있습니다:

```js
axios.get('/api/user')
    .then(response => {
        console.log(response.data);
    });
```


#### 쿠키 이름 사용자 지정 {#customizing-the-cookie-name}

필요하다면, `Passport::cookie` 메서드를 사용하여 `laravel_token` 쿠키의 이름을 사용자 지정할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Passport::cookie('custom_name');
}
```


#### CSRF 보호 {#csrf-protection}

이 인증 방식을 사용할 때는 요청에 유효한 CSRF 토큰 헤더가 포함되어 있는지 확인해야 합니다. 스켈레톤 애플리케이션과 모든 스타터 키트에 포함된 기본 Laravel JavaScript 스캐폴딩에는 [Axios](https://github.com/axios/axios) 인스턴스가 포함되어 있으며, 이는 암호화된 `XSRF-TOKEN` 쿠키 값을 사용하여 동일 출처 요청에 자동으로 `X-XSRF-TOKEN` 헤더를 전송합니다.

> [!NOTE]
> 만약 `X-XSRF-TOKEN` 대신 `X-CSRF-TOKEN` 헤더를 전송하기로 선택했다면, `csrf_token()`에서 제공하는 암호화되지 않은 토큰을 사용해야 합니다.


## 이벤트 {#events}

Passport는 액세스 토큰과 리프레시 토큰을 발급할 때 이벤트를 발생시킵니다. 데이터베이스에서 다른 액세스 토큰을 정리하거나 폐기하기 위해 [이 이벤트들을 리스닝](/laravel/12.x/events)할 수 있습니다:

<div class="overflow-auto">

| 이벤트 이름                                      |
| --------------------------------------------- |
| `Laravel\Passport\Events\AccessTokenCreated`  |
| `Laravel\Passport\Events\AccessTokenRevoked`  |
| `Laravel\Passport\Events\RefreshTokenCreated` |

</div>


## 테스트 {#testing}

Passport의 `actingAs` 메서드는 현재 인증된 사용자와 해당 사용자의 스코프를 지정하는 데 사용할 수 있습니다. `actingAs` 메서드의 첫 번째 인자는 사용자 인스턴스이고, 두 번째 인자는 사용자 토큰에 부여할 스코프의 배열입니다:

```php tab=Pest
use App\Models\User;
use Laravel\Passport\Passport;

test('orders can be created', function () {
    Passport::actingAs(
        User::factory()->create(),
        ['orders:create']
    );

    $response = $this->post('/api/orders');

    $response->assertStatus(201);
});
```

```php tab=PHPUnit
use App\Models\User;
use Laravel\Passport\Passport;

public function test_orders_can_be_created(): void
{
    Passport::actingAs(
        User::factory()->create(),
        ['orders:create']
    );

    $response = $this->post('/api/orders');

    $response->assertStatus(201);
}
```

Passport의 `actingAsClient` 메서드는 현재 인증된 클라이언트와 해당 클라이언트의 스코프를 지정하는 데 사용할 수 있습니다. `actingAsClient` 메서드의 첫 번째 인자는 클라이언트 인스턴스이고, 두 번째 인자는 클라이언트 토큰에 부여할 스코프의 배열입니다:

```php tab=Pest
use Laravel\Passport\Client;
use Laravel\Passport\Passport;

test('servers can be retrieved', function () {
    Passport::actingAsClient(
        Client::factory()->create(),
        ['servers:read']
    );

    $response = $this->get('/api/servers');

    $response->assertStatus(200);
});
```

```php tab=PHPUnit
use Laravel\Passport\Client;
use Laravel\Passport\Passport;

public function test_servers_can_be_retrieved(): void
{
    Passport::actingAsClient(
        Client::factory()->create(),
        ['servers:read']
    );

    $response = $this->get('/api/servers');

    $response->assertStatus(200);
}
```
