# Laravel Folio

















## 소개 {#introduction}

[Laravel Folio](https://github.com/laravel/folio)는 Laravel 애플리케이션에서 라우팅을 간소화하기 위해 설계된 강력한 페이지 기반 라우터입니다. Laravel Folio를 사용하면, 라우트를 생성하는 것이 애플리케이션의 `resources/views/pages` 디렉터리 내에 Blade 템플릿을 만드는 것만큼 간단해집니다.

예를 들어, `/greeting` URL에서 접근 가능한 페이지를 만들고 싶다면, 애플리케이션의 `resources/views/pages` 디렉터리에 `greeting.blade.php` 파일을 생성하기만 하면 됩니다:

```php
<div>
    Hello World
</div>
```


## 설치 {#installation}

시작하려면 Composer 패키지 관리자를 사용하여 프로젝트에 Folio를 설치하세요:

```shell
composer require laravel/folio
```

Folio를 설치한 후, `folio:install` Artisan 명령어를 실행할 수 있습니다. 이 명령어는 Folio의 서비스 프로바이더를 애플리케이션에 설치합니다. 이 서비스 프로바이더는 Folio가 라우트/페이지를 검색할 디렉터리를 등록합니다:

```shell
php artisan folio:install
```


### 페이지 경로 / URI {#page-paths-uris}

기본적으로 Folio는 애플리케이션의 `resources/views/pages` 디렉터리에서 페이지를 제공합니다. 하지만 Folio 서비스 프로바이더의 `boot` 메서드에서 이 디렉터리를 커스터마이즈할 수 있습니다.

예를 들어, 동일한 Laravel 애플리케이션에서 여러 Folio 경로를 지정하는 것이 편리할 때가 있습니다. 애플리케이션의 "admin" 영역을 위한 Folio 페이지 디렉터리를 별도로 두고, 나머지 애플리케이션 페이지는 또 다른 디렉터리를 사용할 수 있습니다.

이 작업은 `Folio::path` 및 `Folio::uri` 메서드를 사용하여 수행할 수 있습니다. `path` 메서드는 Folio가 들어오는 HTTP 요청을 라우팅할 때 페이지를 검색할 디렉터리를 등록하며, `uri` 메서드는 해당 페이지 디렉터리의 "기본 URI"를 지정합니다:

```php
use Laravel\Folio\Folio;

Folio::path(resource_path('views/pages/guest'))->uri('/');

Folio::path(resource_path('views/pages/admin'))
    ->uri('/admin')
    ->middleware([
        '*' => [
            'auth',
            'verified',

            // ...
        ],
    ]);
```


### 서브도메인 라우팅 {#subdomain-routing}

들어오는 요청의 서브도메인에 따라 페이지를 라우팅할 수도 있습니다. 예를 들어, `admin.example.com`에서 오는 요청을 Folio의 다른 페이지 디렉터리와는 다른 디렉터리로 라우팅하고 싶을 수 있습니다. 이를 위해 `Folio::path` 메서드 호출 후에 `domain` 메서드를 호출하면 됩니다:

```php
use Laravel\Folio\Folio;

Folio::domain('admin.example.com')
    ->path(resource_path('views/pages/admin'));
```

`domain` 메서드는 도메인이나 서브도메인의 일부를 파라미터로 캡처할 수도 있습니다. 이 파라미터들은 페이지 템플릿에 주입됩니다:

```php
use Laravel\Folio\Folio;

Folio::domain('{account}.example.com')
    ->path(resource_path('views/pages/admin'));
```


## 라우트 생성하기 {#creating-routes}

Folio 라우트는 Folio가 마운트된 디렉터리 중 하나에 Blade 템플릿을 추가함으로써 생성할 수 있습니다. 기본적으로 Folio는 `resources/views/pages` 디렉터리를 마운트하지만, Folio 서비스 프로바이더의 `boot` 메서드에서 이 디렉터리들을 커스터마이즈할 수 있습니다.

Blade 템플릿을 Folio가 마운트된 디렉터리에 추가하면, 즉시 브라우저를 통해 접근할 수 있습니다. 예를 들어, `pages/schedule.blade.php`에 페이지를 추가하면 브라우저에서 `http://example.com/schedule`로 접근할 수 있습니다.

Folio 페이지/라우트 전체 목록을 빠르게 확인하려면, `folio:list` Artisan 명령어를 실행하면 됩니다:

```shell
php artisan folio:list
```


### 중첩 라우트 {#nested-routes}

Folio의 디렉터리 중 하나에 하나 이상의 하위 디렉터리를 생성하여 중첩 라우트를 만들 수 있습니다. 예를 들어, `/user/profile` 경로로 접근할 수 있는 페이지를 만들고 싶다면, `pages/user` 디렉터리 내에 `profile.blade.php` 템플릿을 생성하면 됩니다:

```shell
php artisan folio:page user/profile

# pages/user/profile.blade.php → /user/profile
```


### 인덱스 라우트 {#index-routes}

때때로 특정 페이지를 디렉터리의 "인덱스"로 만들고 싶을 수 있습니다. Folio 디렉터리 내에 `index.blade.php` 템플릿을 배치하면, 해당 디렉터리의 루트로의 모든 요청이 그 페이지로 라우팅됩니다:

```shell
php artisan folio:page index
# pages/index.blade.php → /

php artisan folio:page users/index
# pages/users/index.blade.php → /users
```


## 라우트 파라미터 {#route-parameters}

종종 들어오는 요청의 URL 일부를 페이지에 주입하여 해당 값과 상호작용해야 할 때가 있습니다. 예를 들어, 프로필이 표시되는 사용자의 "ID"에 접근해야 할 수도 있습니다. 이를 위해 페이지 파일 이름의 일부를 대괄호로 감쌀 수 있습니다:

```shell
php artisan folio:page "users/[id]"

# pages/users/[id].blade.php → /users/1
```

캡처된 세그먼트는 Blade 템플릿 내에서 변수로 접근할 수 있습니다:

```html
<div>
    User {{ $id }}
</div>
```

여러 세그먼트를 캡처하려면, 세그먼트 앞에 점 세 개(`...`)를 붙이면 됩니다:

```shell
php artisan folio:page "users/[...ids]"

# pages/users/[...ids].blade.php → /users/1/2/3
```

여러 세그먼트를 캡처할 때, 캡처된 세그먼트들은 배열로 페이지에 주입됩니다:

```html
<ul>
    @foreach ($ids as $id)
        <li>User {{ $id }}</li>
    @endforeach
</ul>
```


## 라우트 모델 바인딩 {#route-model-binding}

페이지 템플릿 파일 이름의 와일드카드 세그먼트가 애플리케이션의 Eloquent 모델 중 하나와 일치하는 경우, Folio는 Laravel의 라우트 모델 바인딩 기능을 자동으로 활용하여, 해당 모델 인스턴스를 페이지에 주입하려고 시도합니다:

```shell
php artisan folio:page "users/[User]"

# pages/users/[User].blade.php → /users/1
```

캡처된 모델은 Blade 템플릿 내에서 변수로 접근할 수 있습니다. 모델의 변수명은 "카멜 케이스(camel case)"로 변환됩니다:

```html
<div>
    User {{ $user->id }}
</div>
```

#### 키 커스터마이징

때때로 `id`가 아닌 다른 컬럼을 사용하여 바인딩된 Eloquent 모델을 해석하고 싶을 수 있습니다. 이럴 때는 페이지의 파일명에 해당 컬럼을 지정할 수 있습니다. 예를 들어, `[Post:slug].blade.php`라는 파일명을 가진 페이지는 `id` 컬럼 대신 `slug` 컬럼을 통해 바인딩된 모델을 해석하려고 시도합니다.

Windows에서는 모델 이름과 키를 구분할 때 `-`를 사용해야 합니다: `[Post-slug].blade.php`.

#### 모델 위치

기본적으로 Folio는 애플리케이션의 `app/Models` 디렉터리 내에서 모델을 검색합니다. 그러나 필요하다면, 템플릿 파일 이름에 전체 네임스페이스를 포함한 모델 클래스 이름을 지정할 수 있습니다:

```shell
php artisan folio:page "users/[.App.Models.User]"

# pages/users/[.App.Models.User].blade.php → /users/1
```


### 소프트 삭제된 모델 {#soft-deleted-models}

기본적으로, 소프트 삭제된 모델은 암시적 모델 바인딩을 해결할 때 조회되지 않습니다. 그러나 원한다면, 페이지의 템플릿 내에서 `withTrashed` 함수를 호출하여 Folio가 소프트 삭제된 모델도 조회하도록 지시할 수 있습니다:

```php
<?php

use function Laravel\Folio\{withTrashed};

withTrashed();

?>

<div>
    User {{ $user->id }}
</div>
```


## 렌더 후크 {#render-hooks}

기본적으로 Folio는 페이지의 Blade 템플릿 내용을 들어오는 요청에 대한 응답으로 반환합니다. 그러나 페이지 템플릿 내에서 `render` 함수를 호출하여 응답을 커스터마이즈할 수 있습니다.

`render` 함수는 클로저를 인자로 받으며, 이 클로저는 Folio가 렌더링하는 `View` 인스턴스를 전달받아 뷰에 추가 데이터를 전달하거나 전체 응답을 커스터마이즈할 수 있습니다. `View` 인스턴스 외에도, 추가적인 라우트 파라미터나 모델 바인딩도 `render` 클로저에 함께 제공됩니다:

```php
<?php

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

use function Laravel\Folio\render;

render(function (View $view, Post $post) {
    if (! Auth::user()->can('view', $post)) {
        return response('Unauthorized', 403);
    }

    return $view->with('photos', $post->author->photos);
}); ?>

<div>
    {{ $post->content }}
</div>

<div>
    이 저자는 또한 {{ count($photos) }}장의 사진을 촬영했습니다.
</div>
```


## 네임드 라우트 {#named-routes}

`name` 함수를 사용하여 특정 페이지의 라우트에 이름을 지정할 수 있습니다:

```php
<?php

use function Laravel\Folio\name;

name('users.index');
```

라라벨의 네임드 라우트와 마찬가지로, 이름이 지정된 Folio 페이지의 URL을 생성할 때 `route` 함수를 사용할 수 있습니다:

```php
<a href="{{ route('users.index') }}">
    All Users
</a>
```

페이지에 파라미터가 있다면, 해당 값들을 `route` 함수에 간단히 전달할 수 있습니다:

```php
route('users.show', ['user' => $user]);
```


## 미들웨어 {#middleware}

특정 페이지에 미들웨어를 적용하려면, 페이지의 템플릿 내에서 `middleware` 함수를 호출하면 됩니다:

```php
<?php

use function Laravel\Folio\{middleware};

middleware(['auth', 'verified']);

?>

<div>
    Dashboard
</div>

```

또는, 여러 페이지 그룹에 미들웨어를 할당하려면 `Folio::path` 메서드 호출 후 `middleware` 메서드를 체이닝할 수 있습니다.

어떤 페이지에 미들웨어를 적용할지 지정하려면, 미들웨어 배열의 키로 해당 페이지의 URL 패턴을 사용할 수 있습니다. `*` 문자는 와일드카드 문자로 사용할 수 있습니다:

```php
use Laravel\Folio\Folio;

Folio::path(resource_path('views/pages'))->middleware([
    'admin/*' => [
        'auth',
        'verified',

        // ...
    ],
]);
```

미들웨어 배열에 클로저를 포함하여 인라인 익명 미들웨어를 정의할 수도 있습니다:

```php
use Closure;
use Illuminate\Http\Request;
use Laravel\Folio\Folio;

Folio::path(resource_path('views/pages'))->middleware([
    'admin/*' => [
        'auth',
        'verified',

        function (Request $request, Closure $next) {
            // ...

            return $next($request);
        },
    ],
]);
```


## 라우트 캐싱 {#route-caching}

Folio를 사용할 때는 항상 [Laravel의 라우트 캐싱 기능](/laravel/12.x/routing#route-caching)을 활용해야 합니다. Folio는 `route:cache` Artisan 명령을 감지하여, Folio 페이지 정의와 라우트 이름이 최대 성능을 위해 올바르게 캐시되도록 보장합니다.
