# Laravel Socialite














## 소개 {#introduction}

일반적인 폼 기반 인증 외에도, Laravel은 [Laravel Socialite](https://github.com/laravel/socialite)를 사용하여 OAuth 제공자와 간편하게 인증할 수 있는 방법을 제공합니다. Socialite는 현재 Facebook, X, LinkedIn, Google, GitHub, GitLab, Bitbucket, Slack을 통한 인증을 지원합니다.

> [!NOTE]
> 다른 플랫폼용 어댑터는 커뮤니티가 주도하는 [Socialite Providers](https://socialiteproviders.com/) 웹사이트에서 제공됩니다.


## 설치 {#installation}

Socialite를 시작하려면 Composer 패키지 관리자를 사용하여 프로젝트의 의존성에 패키지를 추가하세요:

```shell
composer require laravel/socialite
```


## Socialite 업그레이드 {#upgrading-socialite}

Socialite의 새로운 주요 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/socialite/blob/master/UPGRADE.md)를 꼼꼼히 검토하는 것이 중요합니다.


## 설정 {#configuration}

Socialite를 사용하기 전에, 애플리케이션에서 사용할 OAuth 제공자에 대한 자격 증명을 추가해야 합니다. 일반적으로 이러한 자격 증명은 인증할 서비스의 대시보드에서 "개발자 애플리케이션"을 생성하여 얻을 수 있습니다.

이 자격 증명은 애플리케이션의 `config/services.php` 설정 파일에 추가해야 하며, 애플리케이션에서 필요한 제공자에 따라 `facebook`, `x`, `linkedin-openid`, `google`, `github`, `gitlab`, `bitbucket`, `slack`, 또는 `slack-openid` 키를 사용해야 합니다:

```php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => 'http://example.com/callback-url',
],
```

> [!NOTE]
> `redirect` 옵션에 상대 경로가 포함되어 있으면, 자동으로 완전한 URL로 변환됩니다.


## 인증 {#authentication}


### 라우팅 {#routing}

OAuth 제공자를 사용하여 사용자를 인증하려면, 사용자를 OAuth 제공자로 리디렉션하는 라우트와 인증 후 제공자로부터 콜백을 받는 라우트, 두 개의 라우트가 필요합니다. 아래 예시 라우트는 두 라우트의 구현 방법을 보여줍니다:

```php
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/redirect', function () {
    return Socialite::driver('github')->redirect();
});

Route::get('/auth/callback', function () {
    $user = Socialite::driver('github')->user();

    // $user->token
});
```

`Socialite` 파사드에서 제공하는 `redirect` 메서드는 사용자를 OAuth 제공자로 리디렉션하는 역할을 하며, `user` 메서드는 인증 요청이 승인된 후 들어오는 요청을 검사하고 제공자로부터 사용자 정보를 가져옵니다.


### 인증 및 저장 {#authentication-and-storage}

OAuth 제공자로부터 사용자를 가져온 후, 해당 사용자가 애플리케이션 데이터베이스에 존재하는지 확인하고 [사용자를 인증](/laravel/12.x/authentication#authenticate-a-user-instance)할 수 있습니다. 사용자가 데이터베이스에 없다면, 일반적으로 사용자를 나타내는 새 레코드를 생성합니다:

```php
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/callback', function () {
    $githubUser = Socialite::driver('github')->user();

    $user = User::updateOrCreate([
        'github_id' => $githubUser->id,
    ], [
        'name' => $githubUser->name,
        'email' => $githubUser->email,
        'github_token' => $githubUser->token,
        'github_refresh_token' => $githubUser->refreshToken,
    ]);

    Auth::login($user);

    return redirect('/dashboard');
});
```

> [!NOTE]
> 특정 OAuth 제공자로부터 어떤 사용자 정보를 얻을 수 있는지에 대한 자세한 내용은 [사용자 정보 가져오기](#retrieving-user-details) 문서를 참고하세요.


### 액세스 범위(Scopes) {#access-scopes}

사용자를 리디렉션하기 전에, `scopes` 메서드를 사용하여 인증 요청에 포함할 "범위(scope)"를 지정할 수 있습니다. 이 메서드는 이전에 지정된 모든 범위와 새로 지정한 범위를 병합합니다:

```php
use Laravel\Socialite\Facades\Socialite;

return Socialite::driver('github')
    ->scopes(['read:user', 'public_repo'])
    ->redirect();
```

`setScopes` 메서드를 사용하면 인증 요청의 기존 모든 범위를 덮어쓸 수 있습니다:

```php
return Socialite::driver('github')
    ->setScopes(['read:user', 'public_repo'])
    ->redirect();
```


### Slack 봇 범위 {#slack-bot-scopes}

Slack의 API는 [여러 종류의 액세스 토큰](https://api.slack.com/authentication/token-types)을 제공하며, 각각 [고유한 권한 범위](https://api.slack.com/scopes)를 가집니다. Socialite는 다음 두 가지 Slack 액세스 토큰 유형 모두와 호환됩니다:

<div class="content-list" markdown="1">

- 봇(Bot, `xoxb-`로 시작)
- 사용자(User, `xoxp-`로 시작)

</div>

기본적으로, `slack` 드라이버는 `user` 토큰을 생성하며, 드라이버의 `user` 메서드를 호출하면 사용자 정보를 반환합니다.

봇 토큰은 애플리케이션이 사용자의 Slack 워크스페이스에 알림을 전송해야 할 때 주로 유용합니다. 봇 토큰을 생성하려면, 사용자를 Slack으로 인증하러 리디렉션하기 전에 `asBotUser` 메서드를 호출하세요:

```php
return Socialite::driver('slack')
    ->asBotUser()
    ->setScopes(['chat:write', 'chat:write.public', 'chat:write.customize'])
    ->redirect();
```

또한, Slack이 인증 후 사용자를 애플리케이션으로 리디렉션한 뒤에도 `user` 메서드를 호출하기 전에 반드시 `asBotUser` 메서드를 호출해야 합니다:

```php
$user = Socialite::driver('slack')->asBotUser()->user();
```

봇 토큰을 생성할 때, `user` 메서드는 여전히 `Laravel\Socialite\Two\User` 인스턴스를 반환하지만, `token` 속성만 채워집니다. 이 토큰은 [인증된 사용자의 Slack 워크스페이스에 알림을 전송](/laravel/12.x/notifications#notifying-external-slack-workspaces)하는 데 저장할 수 있습니다.


### 옵션 파라미터 {#optional-parameters}

일부 OAuth 제공자는 리디렉션 요청에 추가적인 옵션 파라미터를 지원합니다. 요청에 옵션 파라미터를 포함하려면, 연관 배열을 `with` 메서드에 전달하세요:

```php
use Laravel\Socialite\Facades\Socialite;

return Socialite::driver('google')
    ->with(['hd' => 'example.com'])
    ->redirect();
```

> [!WARNING]
> `with` 메서드를 사용할 때는 `state`나 `response_type`과 같은 예약어를 전달하지 않도록 주의하세요.


## 사용자 정보 가져오기 {#retrieving-user-details}

사용자가 애플리케이션의 인증 콜백 라우트로 리디렉션된 후, Socialite의 `user` 메서드를 사용하여 사용자 정보를 가져올 수 있습니다. `user` 메서드가 반환하는 사용자 객체는 데이터베이스에 사용자 정보를 저장할 때 사용할 수 있는 다양한 속성과 메서드를 제공합니다.

인증하는 OAuth 제공자가 OAuth 1.0 또는 OAuth 2.0을 지원하는지에 따라 이 객체에서 사용할 수 있는 속성과 메서드가 다를 수 있습니다:

```php
use Laravel\Socialite\Facades\Socialite;

Route::get('/auth/callback', function () {
    $user = Socialite::driver('github')->user();

    // OAuth 2.0 제공자...
    $token = $user->token;
    $refreshToken = $user->refreshToken;
    $expiresIn = $user->expiresIn;

    // OAuth 1.0 제공자...
    $token = $user->token;
    $tokenSecret = $user->tokenSecret;

    // 모든 제공자...
    $user->getId();
    $user->getNickname();
    $user->getName();
    $user->getEmail();
    $user->getAvatar();
});
```


#### 토큰으로 사용자 정보 가져오기 {#retrieving-user-details-from-a-token-oauth2}

이미 사용자의 유효한 액세스 토큰이 있다면, Socialite의 `userFromToken` 메서드를 사용하여 사용자 정보를 가져올 수 있습니다:

```php
use Laravel\Socialite\Facades\Socialite;

$user = Socialite::driver('github')->userFromToken($token);
```

iOS 애플리케이션을 통해 Facebook Limited Login을 사용하는 경우, Facebook은 액세스 토큰 대신 OIDC 토큰을 반환합니다. 액세스 토큰과 마찬가지로, OIDC 토큰도 `userFromToken` 메서드에 전달하여 사용자 정보를 가져올 수 있습니다.


#### 무상태 인증 {#stateless-authentication}

`stateless` 메서드는 세션 상태 검증을 비활성화하는 데 사용할 수 있습니다. 이 방법은 쿠키 기반 세션을 사용하지 않는 무상태 API에 소셜 인증을 추가할 때 유용합니다:

```php
use Laravel\Socialite\Facades\Socialite;

return Socialite::driver('google')->stateless()->user();
```
