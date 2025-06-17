# 컨트롤러


















## 소개 {#introduction}

모든 요청 처리 로직을 라우트 파일의 클로저로 정의하는 대신, "컨트롤러" 클래스를 사용하여 이러한 동작을 체계적으로 구성할 수 있습니다. 컨트롤러는 관련된 요청 처리 로직을 하나의 클래스로 묶을 수 있습니다. 예를 들어, `UserController` 클래스는 사용자와 관련된 모든 요청(조회, 생성, 수정, 삭제 등)을 처리할 수 있습니다. 기본적으로 컨트롤러는 `app/Http/Controllers` 디렉터리에 저장됩니다.


## 컨트롤러 작성하기 {#writing-controllers}


### 기본 컨트롤러 {#basic-controllers}

새로운 컨트롤러를 빠르게 생성하려면 `make:controller` Artisan 명령어를 실행하면 됩니다. 기본적으로 애플리케이션의 모든 컨트롤러는 `app/Http/Controllers` 디렉터리에 저장됩니다:

```shell
php artisan make:controller UserController
```

기본 컨트롤러의 예제를 살펴보겠습니다. 컨트롤러는 들어오는 HTTP 요청에 응답할 수 있는 여러 개의 public 메서드를 가질 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 주어진 사용자의 프로필을 보여줍니다.
     */
    public function show(string $id): View
    {
        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```

컨트롤러 클래스와 메서드를 작성한 후, 다음과 같이 해당 컨트롤러 메서드로 라우트를 정의할 수 있습니다:

```php
use App\Http\Controllers\UserController;

Route::get('/user/{id}', [UserController::class, 'show']);
```

들어오는 요청이 지정된 라우트 URI와 일치하면, `App\Http\Controllers\UserController` 클래스의 `show` 메서드가 호출되고 라우트 파라미터가 해당 메서드로 전달됩니다.

> [!NOTE]
> 컨트롤러가 **반드시** 기본 클래스를 상속해야 하는 것은 아닙니다. 하지만, 모든 컨트롤러에서 공유되어야 하는 메서드를 포함하는 기본 컨트롤러 클래스를 상속하는 것이 편리할 때가 있습니다.


### 단일 액션 컨트롤러 {#single-action-controllers}

컨트롤러 액션이 특히 복잡한 경우, 해당 액션만을 위해 전체 컨트롤러 클래스를 할당하는 것이 편리할 수 있습니다. 이를 위해 컨트롤러 내에 단일 `__invoke` 메서드를 정의할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

class ProvisionServer extends Controller
{
    /**
     * 새로운 웹 서버를 프로비저닝합니다.
     */
    public function __invoke()
    {
        // ...
    }
}
```

단일 액션 컨트롤러에 대한 라우트를 등록할 때는 컨트롤러 메서드를 지정할 필요가 없습니다. 대신, 컨트롤러의 이름만 라우터에 전달하면 됩니다:

```php
use App\Http\Controllers\ProvisionServer;

Route::post('/server', ProvisionServer::class);
```

`make:controller` Artisan 명령어의 `--invokable` 옵션을 사용하여 호출 가능한(invokable) 컨트롤러를 생성할 수 있습니다:

```shell
php artisan make:controller ProvisionServer --invokable
```

> [!NOTE]
> 컨트롤러 스텁은 [스텁 퍼블리싱](/laravel/12.x/artisan#stub-customization)을 사용하여 커스터마이즈할 수 있습니다.


## 컨트롤러 미들웨어 {#controller-middleware}

[미들웨어](/laravel/12.x/middleware)는 라우트 파일에서 컨트롤러의 라우트에 할당할 수 있습니다:

```php
Route::get('/profile', [UserController::class, 'show'])->middleware('auth');
```

또는, 컨트롤러 클래스 내에서 미들웨어를 지정하는 것이 더 편리할 수 있습니다. 이를 위해 컨트롤러는 `HasMiddleware` 인터페이스를 구현해야 하며, 이 인터페이스는 컨트롤러에 static `middleware` 메서드가 있어야 함을 명시합니다. 이 메서드에서 컨트롤러의 액션에 적용할 미들웨어 배열을 반환할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    /**
     * 컨트롤러에 할당할 미들웨어를 반환합니다.
     */
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('log', only: ['index']),
            new Middleware('subscribed', except: ['store']),
        ];
    }

    // ...
}
```

또한, 클로저로 컨트롤러 미들웨어를 정의할 수도 있습니다. 이를 통해 전체 미들웨어 클래스를 작성하지 않고도 인라인 미들웨어를 간편하게 정의할 수 있습니다:

```php
use Closure;
use Illuminate\Http\Request;

/**
 * 컨트롤러에 할당할 미들웨어를 반환합니다.
 */
public static function middleware(): array
{
    return [
        function (Request $request, Closure $next) {
            return $next($request);
        },
    ];
}
```


## 리소스 컨트롤러 {#resource-controllers}

애플리케이션의 각 Eloquent 모델을 "리소스"로 생각한다면, 일반적으로 각 리소스에 대해 동일한 작업 집합을 수행하게 됩니다. 예를 들어, 애플리케이션에 `Photo` 모델과 `Movie` 모델이 있다고 가정해봅시다. 사용자는 이러한 리소스를 생성, 조회, 수정 또는 삭제할 수 있을 것입니다.

이러한 일반적인 사용 사례 때문에, Laravel의 리소스 라우팅은 일반적인 생성, 조회, 수정, 삭제("CRUD") 라우트를 한 줄의 코드로 컨트롤러에 할당할 수 있습니다. 먼저, `make:controller` Artisan 명령어의 `--resource` 옵션을 사용하여 이러한 작업을 처리할 컨트롤러를 빠르게 생성할 수 있습니다:

```shell
php artisan make:controller PhotoController --resource
```

이 명령어는 `app/Http/Controllers/PhotoController.php`에 컨트롤러를 생성합니다. 이 컨트롤러에는 각 리소스 작업에 해당하는 메서드가 포함되어 있습니다. 다음으로, 해당 컨트롤러를 가리키는 리소스 라우트를 등록할 수 있습니다:

```php
use App\Http\Controllers\PhotoController;

Route::resource('photos', PhotoController::class);
```

이 한 줄의 라우트 선언으로 리소스에 대한 다양한 작업을 처리하는 여러 라우트가 생성됩니다. 생성된 컨트롤러에는 이미 각 작업에 대한 스텁 메서드가 포함되어 있습니다. 애플리케이션의 라우트를 빠르게 확인하고 싶다면 `route:list` Artisan 명령어를 실행하면 됩니다.

여러 개의 리소스 컨트롤러를 한 번에 등록하려면 `resources` 메서드에 배열을 전달하면 됩니다:

```php
Route::resources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);
```


#### 리소스 컨트롤러가 처리하는 액션 {#actions-handled-by-resource-controllers}

<div class="overflow-auto">

| HTTP 메서드  | URI                    | 액션      | 라우트 이름         |
|-----------|------------------------|---------|----------------|
| GET       | `/photos`              | index   | photos.index   |
| GET       | `/photos/create`       | create  | photos.create  |
| POST      | `/photos`              | store   | photos.store   |
| GET       | `/photos/{photo}`      | show    | photos.show    |
| GET       | `/photos/{photo}/edit` | edit    | photos.edit    |
| PUT/PATCH | `/photos/{photo}`      | update  | photos.update  |
| DELETE    | `/photos/{photo}`      | destroy | photos.destroy |

</div>


#### 모델이 없을 때의 동작 커스터마이징 {#customizing-missing-model-behavior}

일반적으로, 암시적으로 바인딩된 리소스 모델을 찾을 수 없는 경우 404 HTTP 응답이 생성됩니다. 하지만, 리소스 라우트를 정의할 때 `missing` 메서드를 호출하여 이 동작을 커스터마이즈할 수 있습니다. `missing` 메서드는 암시적으로 바인딩된 모델을 리소스의 어떤 라우트에서도 찾을 수 없을 때 호출되는 클로저를 인자로 받습니다:

```php
use App\Http\Controllers\PhotoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

Route::resource('photos', PhotoController::class)
    ->missing(function (Request $request) {
        return Redirect::route('photos.index');
    });
```


#### 소프트 삭제된 모델 {#soft-deleted-models}

일반적으로, 암시적 모델 바인딩은 [소프트 삭제](/laravel/12.x/eloquent#soft-deleting)된 모델을 조회하지 않으며, 대신 404 HTTP 응답을 반환합니다. 하지만, 리소스 라우트를 정의할 때 `withTrashed` 메서드를 호출하여 소프트 삭제된 모델도 허용하도록 프레임워크에 지시할 수 있습니다:

```php
use App\Http\Controllers\PhotoController;

Route::resource('photos', PhotoController::class)->withTrashed();
```

인자를 전달하지 않고 `withTrashed`를 호출하면 `show`, `edit`, `update` 리소스 라우트에서 소프트 삭제된 모델도 허용됩니다. 배열을 `withTrashed` 메서드에 전달하여 이 중 일부 라우트만 지정할 수도 있습니다:

```php
Route::resource('photos', PhotoController::class)->withTrashed(['show']);
```


#### 리소스 모델 지정하기 {#specifying-the-resource-model}

[라우트 모델 바인딩](/laravel/12.x/routing#route-model-binding)을 사용하고 있으며, 리소스 컨트롤러의 메서드에서 모델 인스턴스를 타입힌트하고 싶다면, 컨트롤러를 생성할 때 `--model` 옵션을 사용할 수 있습니다:

```shell
php artisan make:controller PhotoController --model=Photo --resource
```


#### 폼 리퀘스트 생성하기 {#generating-form-requests}

리소스 컨트롤러를 생성할 때 `--requests` 옵션을 제공하면, Artisan이 컨트롤러의 저장 및 수정 메서드에 사용할 [폼 리퀘스트 클래스](/laravel/12.x/validation#form-request-validation)를 자동으로 생성하도록 할 수 있습니다:

```shell
php artisan make:controller PhotoController --model=Photo --resource --requests
```


### 부분 리소스 라우트 {#restful-partial-resource-routes}

리소스 라우트를 선언할 때, 컨트롤러가 처리해야 할 액션의 일부만 지정할 수 있습니다. 전체 기본 액션 세트를 모두 사용할 필요는 없습니다:

```php
use App\Http\Controllers\PhotoController;

Route::resource('photos', PhotoController::class)->only([
    'index', 'show'
]);

Route::resource('photos', PhotoController::class)->except([
    'create', 'store', 'update', 'destroy'
]);
```


#### API 리소스 라우트 {#api-resource-routes}

API에서 사용할 리소스 라우트를 선언할 때는 일반적으로 `create`와 `edit`처럼 HTML 템플릿을 제공하는 라우트는 제외하고 싶을 것입니다. 편의를 위해, `apiResource` 메서드를 사용하면 이 두 라우트를 자동으로 제외할 수 있습니다:

```php
use App\Http\Controllers\PhotoController;

Route::apiResource('photos', PhotoController::class);
```

여러 개의 API 리소스 컨트롤러를 한 번에 등록하려면 `apiResources` 메서드에 배열을 전달하면 됩니다:

```php
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\PostController;

Route::apiResources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);
```

`create`나 `edit` 메서드가 포함되지 않은 API 리소스 컨트롤러를 빠르게 생성하려면, `make:controller` 명령어 실행 시 `--api` 옵션을 사용하세요:

```shell
php artisan make:controller PhotoController --api
```


### 중첩 리소스 {#restful-nested-resources}

때때로 중첩된 리소스에 대한 라우트를 정의해야 할 수도 있습니다. 예를 들어, 하나의 사진(photo) 리소스에는 여러 개의 댓글(comment)이 연결될 수 있습니다. 리소스 컨트롤러를 중첩하려면, 라우트 선언에서 "점(dot) 표기법"을 사용할 수 있습니다:

```php
use App\Http\Controllers\PhotoCommentController;

Route::resource('photos.comments', PhotoCommentController::class);
```

이 라우트는 다음과 같은 URI로 접근할 수 있는 중첩 리소스를 등록합니다:

```text
/photos/{photo}/comments/{comment}
```


#### 중첩 리소스의 스코프 지정 {#scoping-nested-resources}

Laravel의 [암시적 모델 바인딩](/laravel/12.x/routing#implicit-model-binding-scoping) 기능은 중첩된 바인딩을 자동으로 스코프 처리하여, 조회된 자식 모델이 해당 부모 모델에 속하는지 확인할 수 있습니다. 중첩 리소스를 정의할 때 `scoped` 메서드를 사용하면 자동 스코프 처리를 활성화할 수 있으며, 자식 리소스를 어떤 필드로 조회할지 Laravel에 지시할 수도 있습니다. 이를 구현하는 방법에 대한 자세한 내용은 [리소스 라우트 스코프 지정](#restful-scoping-resource-routes) 문서를 참고하세요.


#### 얕은 중첩(Shallow Nesting) {#shallow-nesting}

대부분의 경우, 자식 ID가 이미 고유 식별자이기 때문에 URI에 부모와 자식 ID를 모두 포함할 필요가 없습니다. URI 세그먼트에서 모델을 식별할 때 자동 증가 기본 키와 같은 고유 식별자를 사용하는 경우, "얕은 중첩(shallow nesting)"을 사용할 수 있습니다:

```php
use App\Http\Controllers\CommentController;

Route::resource('photos.comments', CommentController::class)->shallow();
```

이 라우트 정의는 다음과 같은 라우트를 생성합니다:

<div class="overflow-auto">

| HTTP 메서드  | URI                               | 액션      | 라우트 이름                 |
|-----------|-----------------------------------|---------|------------------------|
| GET       | `/photos/{photo}/comments`        | index   | photos.comments.index  |
| GET       | `/photos/{photo}/comments/create` | create  | photos.comments.create |
| POST      | `/photos/{photo}/comments`        | store   | photos.comments.store  |
| GET       | `/comments/{comment}`             | show    | comments.show          |
| GET       | `/comments/{comment}/edit`        | edit    | comments.edit          |
| PUT/PATCH | `/comments/{comment}`             | update  | comments.update        |
| DELETE    | `/comments/{comment}`             | destroy | comments.destroy       |

</div>


### 리소스 라우트 이름 지정하기 {#restful-naming-resource-routes}

기본적으로 모든 리소스 컨트롤러 액션에는 라우트 이름이 지정되어 있습니다. 하지만, `names` 배열에 원하는 라우트 이름을 전달하여 이 이름들을 오버라이드할 수 있습니다:

```php
use App\Http\Controllers\PhotoController;

Route::resource('photos', PhotoController::class)->names([
    'create' => 'photos.build'
]);
```


### 리소스 라우트 파라미터 이름 지정하기 {#restful-naming-resource-route-parameters}

기본적으로 `Route::resource`는 리소스 이름의 "단수형"을 기준으로 라우트 파라미터를 생성합니다. 하지만, `parameters` 메서드를 사용하여 리소스별로 쉽게 오버라이드할 수 있습니다. `parameters` 메서드에 전달하는 배열은 리소스 이름과 파라미터 이름의 연관 배열이어야 합니다:

```php
use App\Http\Controllers\AdminUserController;

Route::resource('users', AdminUserController::class)->parameters([
    'users' => 'admin_user'
]);
```

위 예제는 해당 리소스의 `show` 라우트에 대해 다음과 같은 URI를 생성합니다:

```text
/users/{admin_user}
```


### 리소스 라우트 스코프 지정하기 {#restful-scoping-resource-routes}

Laravel의 [스코프된 암시적 모델 바인딩](/laravel/12.x/routing#implicit-model-binding-scoping) 기능은 중첩된 바인딩을 자동으로 스코프 처리하여, 조회된 자식 모델이 해당 부모 모델에 속하는지 확인할 수 있습니다. 중첩 리소스를 정의할 때 `scoped` 메서드를 사용하면 자동 스코프 처리를 활성화할 수 있으며, 자식 리소스를 어떤 필드로 조회할지 Laravel에 지시할 수도 있습니다:

```php
use App\Http\Controllers\PhotoCommentController;

Route::resource('photos.comments', PhotoCommentController::class)->scoped([
    'comment' => 'slug',
]);
```

이 라우트는 다음과 같은 URI로 접근할 수 있는 스코프된 중첩 리소스를 등록합니다:

```text
/photos/{photo}/comments/{comment:slug}
```

커스텀 키를 사용하는 암시적 바인딩을 중첩 라우트 파라미터로 사용할 때, Laravel은 부모 모델의 관계 이름을 관례적으로 추측하여 쿼리를 자동으로 스코프 처리합니다. 이 경우, `Photo` 모델에 `comments`(라우트 파라미터 이름의 복수형)라는 관계가 있다고 가정하며, 이를 통해 `Comment` 모델을 조회하게 됩니다.


### 리소스 URI 현지화(Localization) {#restful-localizing-resource-uris}

기본적으로 `Route::resource`는 영어 동사와 복수 규칙을 사용하여 리소스 URI를 생성합니다. 만약 `create`와 `edit` 액션 동사를 현지화해야 한다면, `Route::resourceVerbs` 메서드를 사용할 수 있습니다. 이는 애플리케이션의 `App\Providers\AppServiceProvider`의 `boot` 메서드 초반에 설정할 수 있습니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Route::resourceVerbs([
        'create' => 'crear',
        'edit' => 'editar',
    ]);
}
```

Laravel의 복수화(pluralizer)는 [여러 언어를 지원하며, 필요에 따라 설정할 수 있습니다](/laravel/12.x/localization#pluralization-language). 동사와 복수화 언어를 커스터마이즈한 후, `Route::resource('publicacion', PublicacionController::class)`와 같은 리소스 라우트 등록은 다음과 같은 URI를 생성합니다:

```text
/publicacion/crear

/publicacion/{publicaciones}/editar
```


### 리소스 컨트롤러 보완하기 {#restful-supplementing-resource-controllers}

기본 리소스 라우트 집합 외에 추가적인 라우트를 리소스 컨트롤러에 추가해야 한다면, 반드시 `Route::resource` 메서드를 호출하기 전에 해당 라우트들을 정의해야 합니다. 그렇지 않으면, `resource` 메서드로 정의된 라우트가 의도치 않게 보완 라우트보다 우선 적용될 수 있습니다:

```php
use App\Http\Controller\PhotoController;

Route::get('/photos/popular', [PhotoController::class, 'popular']);
Route::resource('photos', PhotoController::class);
```

> [!NOTE]
> 컨트롤러의 역할을 명확히 유지하는 것이 중요합니다. 일반적인 리소스 액션 외에 자주 추가적인 메서드가 필요하다면, 컨트롤러를 두 개의 더 작은 컨트롤러로 분리하는 것을 고려해보세요.


### 싱글턴 리소스 컨트롤러 {#singleton-resource-controllers}

애플리케이션에서 단 하나의 인스턴스만 존재할 수 있는 리소스가 있을 수 있습니다. 예를 들어, 사용자의 "프로필"은 수정하거나 업데이트할 수 있지만, 한 사용자가 둘 이상의 "프로필"을 가질 수는 없습니다. 마찬가지로, 이미지에는 하나의 "썸네일"만 있을 수 있습니다. 이러한 리소스를 "싱글턴 리소스"라고 하며, 오직 하나의 인스턴스만 존재할 수 있습니다. 이런 경우에는 "싱글턴" 리소스 컨트롤러를 등록할 수 있습니다:

```php
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::singleton('profile', ProfileController::class);
```

위의 싱글턴 리소스 정의는 다음과 같은 라우트를 등록합니다. 보시다시피, 싱글턴 리소스에는 "생성" 라우트가 등록되지 않으며, 오직 하나의 인스턴스만 존재할 수 있으므로 식별자를 받지 않습니다:

<div class="overflow-auto">

| HTTP 메서드  | URI             | 액션     | 라우트 이름         |
|-----------|-----------------|--------|----------------|
| GET       | `/profile`      | show   | profile.show   |
| GET       | `/profile/edit` | edit   | profile.edit   |
| PUT/PATCH | `/profile`      | update | profile.update |

</div>

싱글턴 리소스는 표준 리소스 내에 중첩시킬 수도 있습니다:

```php
Route::singleton('photos.thumbnail', ThumbnailController::class);
```

이 예시에서 `photos` 리소스는 [표준 리소스 라우트](#actions-handled-by-resource-controllers)를 모두 가지게 되며, `thumbnail` 리소스는 다음과 같은 싱글턴 리소스 라우트만 가지게 됩니다:

<div class="overflow-auto">

| HTTP 메서드   | URI                              | 액션     | 라우트 이름                  |
|------------|----------------------------------|--------|-------------------------|
| GET        | `/photos/{photo}/thumbnail`      | show   | photos.thumbnail.show   |
| GET        | `/photos/{photo}/thumbnail/edit` | edit   | photos.thumbnail.edit   |
| PUT/PATCH  | `/photos/{photo}/thumbnail`      | update | photos.thumbnail.update |

</div>


#### 생성 가능한 싱글턴 리소스 {#creatable-singleton-resources}

가끔은 싱글턴 리소스에 대해 생성 및 저장 라우트를 정의하고 싶을 때가 있습니다. 이를 위해 싱글턴 리소스 라우트를 등록할 때 `creatable` 메서드를 호출할 수 있습니다:

```php
Route::singleton('photos.thumbnail', ThumbnailController::class)->creatable();
```

이 예시에서는 다음과 같은 라우트가 등록됩니다. 보시다시피, 생성 가능한 싱글턴 리소스에는 `DELETE` 라우트도 함께 등록됩니다:

<div class="overflow-auto">

| HTTP 메서드  | URI                                | 액션      | 라우트 이름                   |
|-----------|------------------------------------|---------|--------------------------|
| GET       | `/photos/{photo}/thumbnail/create` | create  | photos.thumbnail.create  |
| POST      | `/photos/{photo}/thumbnail`        | store   | photos.thumbnail.store   |
| GET       | `/photos/{photo}/thumbnail`        | show    | photos.thumbnail.show    |
| GET       | `/photos/{photo}/thumbnail/edit`   | edit    | photos.thumbnail.edit    |
| PUT/PATCH | `/photos/{photo}/thumbnail`        | update  | photos.thumbnail.update  |
| DELETE    | `/photos/{photo}/thumbnail`        | destroy | photos.thumbnail.destroy |

</div>

만약 싱글턴 리소스에 대해 `DELETE` 라우트만 등록하고, 생성 또는 저장 라우트는 등록하지 않으려면 `destroyable` 메서드를 사용할 수 있습니다:

```php
Route::singleton(...)->destroyable();
```


#### API 싱글턴 리소스 {#api-singleton-resources}

`apiSingleton` 메서드는 API를 통해 조작되는 싱글턴 리소스를 등록할 때 사용할 수 있으며, 이 경우 `create`와 `edit` 라우트는 필요하지 않습니다:

```php
Route::apiSingleton('profile', ProfileController::class);
```

물론, API 싱글턴 리소스도 `creatable`로 지정할 수 있으며, 이 경우 해당 리소스에 대해 `store`와 `destroy` 라우트가 등록됩니다:

```php
Route::apiSingleton('photos.thumbnail', ProfileController::class)->creatable();
```


## 의존성 주입과 컨트롤러 {#dependency-injection-and-controllers}


#### 생성자 주입 {#constructor-injection}

Laravel의 [서비스 컨테이너](/laravel/12.x/container)는 모든 Laravel 컨트롤러를 해석하는 데 사용됩니다. 따라서 컨트롤러의 생성자에서 필요한 의존성을 타입힌트로 선언할 수 있습니다. 선언된 의존성은 자동으로 해석되어 컨트롤러 인스턴스에 주입됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;

class UserController extends Controller
{
    /**
     * 새로운 컨트롤러 인스턴스를 생성합니다.
     */
    public function __construct(
        protected UserRepository $users,
    ) {}
}
```


#### 메서드 주입 {#method-injection}

생성자 주입 외에도, 컨트롤러의 메서드에서 의존성을 타입힌트로 선언할 수 있습니다. 메서드 주입의 일반적인 사용 예는 `Illuminate\Http\Request` 인스턴스를 컨트롤러 메서드에 주입하는 것입니다:

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
        $name = $request->name;

        // 사용자를 저장...

        return redirect('/users');
    }
}
```

컨트롤러 메서드가 라우트 파라미터의 입력도 기대한다면, 다른 의존성 뒤에 라우트 인자를 나열하면 됩니다. 예를 들어, 라우트가 다음과 같이 정의되어 있다면:

```php
use App\Http\Controllers\UserController;

Route::put('/user/{id}', [UserController::class, 'update']);
```

컨트롤러 메서드에서 여전히 `Illuminate\Http\Request`를 타입힌트로 선언하고, `id` 파라미터도 다음과 같이 접근할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * 주어진 사용자를 업데이트합니다.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // 사용자를 업데이트...

        return redirect('/users');
    }
}
```
