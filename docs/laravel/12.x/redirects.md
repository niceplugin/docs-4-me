# HTTP 리디렉션







## 리디렉션 생성하기 {#creating-redirects}

리디렉션 응답은 `Illuminate\Http\RedirectResponse` 클래스의 인스턴스이며, 사용자를 다른 URL로 리디렉션하는 데 필요한 적절한 헤더를 포함하고 있습니다. `RedirectResponse` 인스턴스를 생성하는 방법에는 여러 가지가 있습니다. 가장 간단한 방법은 전역 `redirect` 헬퍼를 사용하는 것입니다:

```php
Route::get('/dashboard', function () {
    return redirect('/home/dashboard');
});
```

때때로 제출된 폼이 유효하지 않을 때와 같이 사용자를 이전 위치로 리디렉션하고 싶을 수 있습니다. 이럴 때는 전역 `back` 헬퍼 함수를 사용할 수 있습니다. 이 기능은 [세션](/docs/{{version}}/session)을 활용하므로, `back` 함수를 호출하는 라우트가 반드시 `web` 미들웨어 그룹을 사용하거나 모든 세션 미들웨어가 적용되어 있어야 합니다:

```php
Route::post('/user/profile', function () {
    // 요청을 검증합니다...

    return back()->withInput();
});
```


## 네임드 라우트로 리다이렉트하기 {#redirecting-named-routes}

파라미터 없이 `redirect` 헬퍼를 호출하면, `Illuminate\Routing\Redirector` 인스턴스가 반환되어 `Redirector` 인스턴스의 모든 메서드를 호출할 수 있습니다. 예를 들어, 네임드 라우트로 `RedirectResponse`를 생성하려면 `route` 메서드를 사용할 수 있습니다:

```php
return redirect()->route('login');
```

라우트에 파라미터가 있다면, 두 번째 인자로 `route` 메서드에 전달할 수 있습니다:

```php
// 다음과 같은 URI를 가진 라우트: profile/{id}

return redirect()->route('profile', ['id' => 1]);
```

편의를 위해, Laravel은 전역 함수 `to_route`도 제공합니다:

```php
return to_route('profile', ['id' => 1]);
```


#### Eloquent 모델을 통한 파라미터 채우기 {#populating-parameters-via-eloquent-models}

Eloquent 모델에서 가져온 "ID" 파라미터로 라우트로 리디렉션할 때, 모델 자체를 전달할 수 있습니다. 그러면 ID가 자동으로 추출됩니다:

```php
// 다음과 같은 URI를 가진 라우트: profile/{id}

return redirect()->route('profile', [$user]);
```

라우트 파라미터에 들어가는 값을 커스터마이즈하고 싶다면, Eloquent 모델에서 `getRouteKey` 메서드를 오버라이드하면 됩니다:

```php
/**
 * 모델의 라우트 키 값을 가져옵니다.
 */
public function getRouteKey(): mixed
{
    return $this->slug;
}
```


## 컨트롤러 액션으로 리다이렉트하기 {#redirecting-controller-actions}

[컨트롤러 액션](/docs/{{version}}/controllers)으로 리다이렉트도 생성할 수 있습니다. 이를 위해 `action` 메서드에 컨트롤러와 액션 이름을 전달하면 됩니다:

```php
use App\Http\Controllers\HomeController;

return redirect()->action([HomeController::class, 'index']);
```

컨트롤러 라우트에 파라미터가 필요한 경우, `action` 메서드의 두 번째 인수로 파라미터를 전달할 수 있습니다:

```php
return redirect()->action(
    [UserController::class, 'profile'], ['id' => 1]
);
```


## 플래시된 세션 데이터와 함께 리다이렉트하기 {#redirecting-with-flashed-session-data}

새 URL로 리다이렉트하면서 [데이터를 세션에 플래시](/docs/{{version}}/session#flash-data)하는 작업은 보통 동시에 이루어집니다. 일반적으로, 어떤 작업을 성공적으로 수행한 후 성공 메시지를 세션에 플래시할 때 사용됩니다. 편의를 위해, `RedirectResponse` 인스턴스를 생성하고 하나의 유창한 메서드 체인으로 세션에 데이터를 플래시할 수 있습니다:

```php
Route::post('/user/profile', function () {
    // 사용자의 프로필을 업데이트...

    return redirect('/dashboard')->with('status', '프로필이 업데이트되었습니다!');
});
```

`RedirectResponse` 인스턴스에서 제공하는 `withInput` 메서드를 사용하면, 사용자를 새로운 위치로 리다이렉트하기 전에 현재 요청의 입력 데이터를 세션에 플래시할 수 있습니다. 입력 데이터가 세션에 플래시된 후에는, 다음 요청에서 [쉽게 이를 조회](/docs/{{version}}/requests#retrieving-old-input)할 수 있습니다:

```php
return back()->withInput();
```

사용자가 리다이렉트된 후, [세션](/docs/{{version}}/session)에서 플래시된 메시지를 표시할 수 있습니다. 예를 들어, [Blade 문법](/docs/{{version}}/blade)을 사용하면 다음과 같습니다:

```blade
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```
