# 유효성 검사






































## 소개 {#introduction}

Laravel은 애플리케이션에 들어오는 데이터를 검증하기 위한 여러 가지 방법을 제공합니다. 가장 일반적으로는 모든 들어오는 HTTP 요청에서 사용할 수 있는 `validate` 메서드를 사용합니다. 하지만, 이 외에도 다양한 유효성 검사 방법에 대해 다룰 것입니다.

Laravel은 데이터에 적용할 수 있는 다양한 편리한 유효성 검사 규칙을 포함하고 있으며, 특정 데이터베이스 테이블에서 값이 고유한지까지 검증할 수 있습니다. 이 문서에서는 이러한 모든 유효성 검사 규칙을 자세히 다루어 Laravel의 유효성 검사 기능을 모두 익힐 수 있도록 안내합니다.


## 유효성 검사 빠른 시작 {#validation-quickstart}

Laravel의 강력한 유효성 검사 기능을 배우기 위해, 폼을 검증하고 오류 메시지를 사용자에게 표시하는 전체 예제를 살펴보겠습니다. 이 개요를 읽으면 Laravel을 사용하여 들어오는 요청 데이터를 어떻게 검증하는지에 대한 전반적인 이해를 얻을 수 있습니다:


### 라우트 정의하기 {#quick-defining-the-routes}

먼저, `routes/web.php` 파일에 다음과 같은 라우트가 정의되어 있다고 가정해봅시다:

```php
use App\Http\Controllers\PostController;

Route::get('/post/create', [PostController::class, 'create']);
Route::post('/post', [PostController::class, 'store']);
```

`GET` 라우트는 사용자가 새 블로그 포스트를 작성할 수 있는 폼을 표시하고, `POST` 라우트는 새 블로그 포스트를 데이터베이스에 저장합니다.


### 컨트롤러 생성하기 {#quick-creating-the-controller}

다음으로, 이 라우트로 들어오는 요청을 처리하는 간단한 컨트롤러를 살펴보겠습니다. `store` 메서드는 일단 비워두겠습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PostController extends Controller
{
    /**
     * 새 블로그 포스트를 작성하는 폼을 표시합니다.
     */
    public function create(): View
    {
        return view('post.create');
    }

    /**
     * 새 블로그 포스트를 저장합니다.
     */
    public function store(Request $request): RedirectResponse
    {
        // 블로그 포스트를 검증하고 저장합니다...

        $post = /** ... */

        return to_route('post.show', ['post' => $post->id]);
    }
}
```


### 유효성 검사 로직 작성하기 {#quick-writing-the-validation-logic}

이제 새 블로그 포스트를 검증하는 로직으로 `store` 메서드를 채울 준비가 되었습니다. 이를 위해 `Illuminate\Http\Request` 객체에서 제공하는 `validate` 메서드를 사용할 것입니다. 유효성 검사 규칙이 통과하면 코드는 정상적으로 계속 실행됩니다. 하지만 유효성 검사가 실패하면 `Illuminate\Validation\ValidationException` 예외가 발생하고, 적절한 오류 응답이 자동으로 사용자에게 반환됩니다.

전통적인 HTTP 요청에서 유효성 검사가 실패하면 이전 URL로 리디렉션 응답이 생성됩니다. 들어오는 요청이 XHR 요청인 경우, [유효성 검사 오류 메시지를 포함한 JSON 응답](#validation-error-response-format)이 반환됩니다.

`validate` 메서드를 더 잘 이해하기 위해, 다시 `store` 메서드로 돌아가 봅시다:

```php
/**
 * 새 블로그 포스트를 저장합니다.
 */
public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'title' => 'required|unique:posts|max:255',
        'body' => 'required',
    ]);

    // 블로그 포스트가 유효합니다...

    return redirect('/posts');
}
```

보시다시피, 유효성 검사 규칙은 `validate` 메서드에 전달됩니다. 걱정하지 마세요 - 사용 가능한 모든 유효성 검사 규칙은 [문서화되어 있습니다](#available-validation-rules). 다시 말하지만, 유효성 검사가 실패하면 적절한 응답이 자동으로 생성됩니다. 유효성 검사가 통과하면 컨트롤러는 정상적으로 계속 실행됩니다.

또한, 유효성 검사 규칙을 `|`로 구분된 문자열 대신 규칙의 배열로 지정할 수도 있습니다:

```php
$validatedData = $request->validate([
    'title' => ['required', 'unique:posts', 'max:255'],
    'body' => ['required'],
]);
```

또한, `validateWithBag` 메서드를 사용하여 요청을 검증하고 오류 메시지를 [이름이 지정된 오류 가방](#named-error-bags)에 저장할 수 있습니다:

```php
$validatedData = $request->validateWithBag('post', [
    'title' => ['required', 'unique:posts', 'max:255'],
    'body' => ['required'],
]);
```


#### 첫 번째 유효성 검사 실패 시 중단하기 {#stopping-on-first-validation-failure}

때때로 속성에 대해 첫 번째 유효성 검사 실패 후 추가 규칙 검증을 중단하고 싶을 수 있습니다. 이를 위해 해당 속성에 `bail` 규칙을 할당하세요:

```php
$request->validate([
    'title' => 'bail|required|unique:posts|max:255',
    'body' => 'required',
]);
```

이 예제에서 `title` 속성의 `unique` 규칙이 실패하면, `max` 규칙은 확인되지 않습니다. 규칙은 할당된 순서대로 검증됩니다.


#### 중첩 속성에 대한 참고 {#a-note-on-nested-attributes}

들어오는 HTTP 요청에 "중첩된" 필드 데이터가 포함된 경우, "점" 문법을 사용하여 유효성 검사 규칙에 이러한 필드를 지정할 수 있습니다:

```php
$request->validate([
    'title' => 'required|unique:posts|max:255',
    'author.name' => 'required',
    'author.description' => 'required',
]);
```

반면, 필드 이름에 실제 마침표가 포함되어 있다면, 백슬래시로 마침표를 이스케이프하여 "점" 문법으로 해석되는 것을 방지할 수 있습니다:

```php
$request->validate([
    'title' => 'required|unique:posts|max:255',
    'v1\.0' => 'required',
]);
```


### 유효성 검사 오류 표시하기 {#quick-displaying-the-validation-errors}

그렇다면, 들어오는 요청 필드가 주어진 유효성 검사 규칙을 통과하지 못하면 어떻게 될까요? 앞서 언급했듯이, Laravel은 사용자를 자동으로 이전 위치로 리디렉션합니다. 또한, 모든 유효성 검사 오류와 [요청 입력값](/laravel/12.x/requests#retrieving-old-input)이 자동으로 [세션에 플래시됩니다](/laravel/12.x/session#flash-data).

`Illuminate\View\Middleware\ShareErrorsFromSession` 미들웨어는 `$errors` 변수를 애플리케이션의 모든 뷰와 공유합니다. 이 미들웨어는 `web` 미들웨어 그룹에 포함되어 있습니다. 이 미들웨어가 적용되면, 뷰에서 항상 `$errors` 변수를 사용할 수 있으므로, `$errors` 변수가 항상 정의되어 있고 안전하게 사용할 수 있다고 가정할 수 있습니다. `$errors` 변수는 `Illuminate\Support\MessageBag`의 인스턴스입니다. 이 객체를 다루는 방법에 대한 자세한 내용은 [문서](#working-with-error-messages)를 참고하세요.

따라서, 이 예제에서는 유효성 검사가 실패하면 사용자가 컨트롤러의 `create` 메서드로 리디렉션되어 뷰에서 오류 메시지를 표시할 수 있습니다:

```blade
<!-- /resources/views/post/create.blade.php -->

<h1>포스트 작성</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<!-- 포스트 작성 폼 -->
```


#### 오류 메시지 커스터마이징 {#quick-customizing-the-error-messages}

Laravel의 내장 유효성 검사 규칙마다 애플리케이션의 `lang/en/validation.php` 파일에 오류 메시지가 위치해 있습니다. 애플리케이션에 `lang` 디렉터리가 없다면, `lang:publish` Artisan 명령어를 사용하여 Laravel이 이를 생성하도록 할 수 있습니다.

`lang/en/validation.php` 파일 내에는 각 유효성 검사 규칙에 대한 번역 항목이 있습니다. 애플리케이션의 필요에 따라 이 메시지들을 자유롭게 변경하거나 수정할 수 있습니다.

또한, 이 파일을 다른 언어 디렉터리로 복사하여 애플리케이션 언어에 맞게 메시지를 번역할 수 있습니다. Laravel 로컬라이제이션에 대해 더 알아보려면 [로컬라이제이션 문서](/laravel/12.x/localization)를 참고하세요.

> [!WARNING]
> 기본적으로, Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이징하려면 `lang:publish` Artisan 명령어를 통해 파일을 퍼블리시할 수 있습니다.


#### XHR 요청과 유효성 검사 {#quick-xhr-requests-and-validation}

이 예제에서는 전통적인 폼을 사용하여 애플리케이션에 데이터를 전송했습니다. 하지만, 많은 애플리케이션은 JavaScript 기반 프론트엔드에서 XHR 요청을 받습니다. XHR 요청 중에 `validate` 메서드를 사용하면, Laravel은 리디렉션 응답을 생성하지 않습니다. 대신, Laravel은 [모든 유효성 검사 오류를 포함한 JSON 응답](#validation-error-response-format)을 생성합니다. 이 JSON 응답은 422 HTTP 상태 코드와 함께 전송됩니다.


#### `@error` 디렉티브 {#the-at-error-directive}

주어진 속성에 대한 유효성 검사 오류 메시지가 존재하는지 빠르게 확인하려면 `@error` [Blade](/laravel/12.x/blade) 디렉티브를 사용할 수 있습니다. `@error` 디렉티브 내에서 `$message` 변수를 출력하여 오류 메시지를 표시할 수 있습니다:

```blade
<!-- /resources/views/post/create.blade.php -->

<label for="title">포스트 제목</label>

<input
    id="title"
    type="text"
    name="title"
    class="@error('title') is-invalid @enderror"
/>

@error('title')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

[이름이 지정된 오류 가방](#named-error-bags)을 사용하는 경우, `@error` 디렉티브의 두 번째 인수로 오류 가방의 이름을 전달할 수 있습니다:

```blade
<input ... class="@error('title', 'post') is-invalid @enderror">
```


### 폼 값 다시 채우기 {#repopulating-forms}

Laravel이 유효성 검사 오류로 인해 리디렉션 응답을 생성할 때, 프레임워크는 [요청의 모든 입력값을 세션에 자동으로 플래시](/laravel/12.x/session#flash-data)합니다. 이렇게 하면 다음 요청에서 입력값에 편리하게 접근하여 사용자가 제출하려던 폼을 다시 채울 수 있습니다.

이전 요청에서 플래시된 입력값을 가져오려면, `Illuminate\Http\Request` 인스턴스에서 `old` 메서드를 호출하세요. `old` 메서드는 [세션](/laravel/12.x/session)에서 이전에 플래시된 입력 데이터를 가져옵니다:

```php
$title = $request->old('title');
```

Laravel은 전역 `old` 헬퍼도 제공합니다. [Blade 템플릿](/laravel/12.x/blade) 내에서 이전 입력값을 표시할 때는 `old` 헬퍼를 사용하는 것이 더 편리합니다. 주어진 필드에 이전 입력값이 없으면 `null`이 반환됩니다:

```blade
<input type="text" name="title" value="{{ old('title') }}">
```


### 선택적 필드에 대한 참고 {#a-note-on-optional-fields}

기본적으로, Laravel은 애플리케이션의 전역 미들웨어 스택에 `TrimStrings`와 `ConvertEmptyStringsToNull` 미들웨어를 포함합니다. 이로 인해, "선택적" 요청 필드가 `null` 값을 가질 때 유효성 검사기가 이를 유효하지 않은 값으로 간주하지 않도록 하려면 해당 필드를 `nullable`로 표시해야 합니다. 예를 들어:

```php
$request->validate([
    'title' => 'required|unique:posts|max:255',
    'body' => 'required',
    'publish_at' => 'nullable|date',
]);
```

이 예제에서는 `publish_at` 필드가 `null`이거나 유효한 날짜 표현일 수 있음을 지정합니다. 규칙 정의에 `nullable` 수정자가 추가되지 않으면, 유효성 검사기는 `null`을 유효하지 않은 날짜로 간주합니다.


### 유효성 검사 오류 응답 형식 {#validation-error-response-format}

애플리케이션이 `Illuminate\Validation\ValidationException` 예외를 발생시키고 들어오는 HTTP 요청이 JSON 응답을 기대하는 경우, Laravel은 오류 메시지를 자동으로 포맷하여 `422 Unprocessable Entity` HTTP 응답을 반환합니다.

아래는 유효성 검사 오류에 대한 JSON 응답 형식의 예시입니다. 중첩된 오류 키는 "점" 표기법으로 평탄화됩니다:

```json
{
    "message": "팀 이름은 문자열이어야 합니다. (그리고 4개의 오류 더 있음)",
    "errors": {
        "team_name": [
            "팀 이름은 문자열이어야 합니다.",
            "팀 이름은 최소 1자 이상이어야 합니다."
        ],
        "authorization.role": [
            "선택한 authorization.role 값이 올바르지 않습니다."
        ],
        "users.0.email": [
            "users.0.email 필드는 필수입니다."
        ],
        "users.2.email": [
            "users.2.email은 유효한 이메일 주소여야 합니다."
        ]
    }
}
```


## 폼 요청 유효성 검사 {#form-request-validation}


### 폼 요청 생성하기 {#creating-form-requests}

더 복잡한 유효성 검사 시나리오에서는 "폼 요청"을 생성하고 싶을 수 있습니다. 폼 요청은 자체 유효성 검사 및 권한 부여 로직을 캡슐화하는 커스텀 요청 클래스입니다. 폼 요청 클래스를 생성하려면 `make:request` Artisan CLI 명령어를 사용할 수 있습니다:

```shell
php artisan make:request StorePostRequest
```

생성된 폼 요청 클래스는 `app/Http/Requests` 디렉터리에 위치합니다. 이 디렉터리가 없다면, `make:request` 명령어를 실행할 때 생성됩니다. Laravel이 생성하는 각 폼 요청에는 `authorize`와 `rules` 두 가지 메서드가 있습니다.

예상하셨겠지만, `authorize` 메서드는 현재 인증된 사용자가 요청이 나타내는 작업을 수행할 수 있는지 결정하며, `rules` 메서드는 요청 데이터에 적용할 유효성 검사 규칙을 반환합니다:

```php
/**
 * 요청에 적용할 유효성 검사 규칙을 가져옵니다.
 *
 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
 */
public function rules(): array
{
    return [
        'title' => 'required|unique:posts|max:255',
        'body' => 'required',
    ];
}
```

> [!NOTE]
> `rules` 메서드의 시그니처에서 필요한 의존성을 타입힌트할 수 있습니다. 이들은 Laravel [서비스 컨테이너](/laravel/12.x/container)를 통해 자동으로 해결됩니다.

그렇다면, 유효성 검사 규칙은 어떻게 평가될까요? 컨트롤러 메서드에서 요청을 타입힌트하기만 하면 됩니다. 들어오는 폼 요청은 컨트롤러 메서드가 호출되기 전에 검증되므로, 컨트롤러에 유효성 검사 로직을 추가할 필요가 없습니다:

```php
/**
 * 새 블로그 포스트를 저장합니다.
 */
public function store(StorePostRequest $request): RedirectResponse
{
    // 들어오는 요청이 유효합니다...

    // 유효성 검사된 입력값을 가져옵니다...
    $validated = $request->validated();

    // 유효성 검사된 입력값의 일부만 가져옵니다...
    $validated = $request->safe()->only(['name', 'email']);
    $validated = $request->safe()->except(['name', 'email']);

    // 블로그 포스트를 저장합니다...

    return redirect('/posts');
}
```

유효성 검사가 실패하면, 사용자를 이전 위치로 보내는 리디렉션 응답이 생성됩니다. 오류도 세션에 플래시되어 표시할 수 있습니다. 요청이 XHR 요청이었다면, 422 상태 코드와 함께 [유효성 검사 오류의 JSON 표현](#validation-error-response-format)이 사용자에게 반환됩니다.

> [!NOTE]
> Inertia 기반 Laravel 프론트엔드에 실시간 폼 요청 유효성 검사를 추가해야 하나요? [Laravel Precognition](/laravel/12.x/precognition)를 확인해보세요.


#### 추가 유효성 검사 수행하기 {#performing-additional-validation-on-form-requests}

초기 유효성 검사가 완료된 후 추가 유효성 검사를 수행해야 할 때가 있습니다. 폼 요청의 `after` 메서드를 사용하여 이를 수행할 수 있습니다.

`after` 메서드는 유효성 검사 완료 후 호출될 콜러블 또는 클로저의 배열을 반환해야 합니다. 전달된 콜러블은 `Illuminate\Validation\Validator` 인스턴스를 받아, 필요하다면 추가 오류 메시지를 발생시킬 수 있습니다:

```php
use Illuminate\Validation\Validator;

/**
 * 요청에 대한 "after" 유효성 검사 콜러블을 가져옵니다.
 */
public function after(): array
{
    return [
        function (Validator $validator) {
            if ($this->somethingElseIsInvalid()) {
                $validator->errors()->add(
                    'field',
                    '이 필드에 문제가 있습니다!'
                );
            }
        }
    ];
}
```

앞서 언급했듯이, `after` 메서드가 반환하는 배열에는 호출 가능한 클래스도 포함될 수 있습니다. 이 클래스의 `__invoke` 메서드는 `Illuminate\Validation\Validator` 인스턴스를 받게 됩니다:

```php
use App\Validation\ValidateShippingTime;
use App\Validation\ValidateUserStatus;
use Illuminate\Validation\Validator;

/**
 * 요청에 대한 "after" 유효성 검사 콜러블을 가져옵니다.
 */
public function after(): array
{
    return [
        new ValidateUserStatus,
        new ValidateShippingTime,
        function (Validator $validator) {
            //
        }
    ];
}
```


#### 첫 번째 유효성 검사 실패 시 중단하기 {#request-stopping-on-first-validation-rule-failure}

요청 클래스에 `stopOnFirstFailure` 속성을 추가하여, 단일 유효성 검사 실패가 발생하면 모든 속성에 대한 검증을 중단하도록 유효성 검사기에 알릴 수 있습니다:

```php
/**
 * 유효성 검사기가 첫 번째 규칙 실패 시 중단해야 하는지 여부를 나타냅니다.
 *
 * @var bool
 */
protected $stopOnFirstFailure = true;
```


#### 리디렉션 위치 커스터마이징 {#customizing-the-redirect-location}

폼 요청 유효성 검사가 실패하면, 사용자를 이전 위치로 보내는 리디렉션 응답이 생성됩니다. 하지만, 이 동작을 자유롭게 커스터마이징할 수 있습니다. 이를 위해 폼 요청에 `$redirect` 속성을 정의하세요:

```php
/**
 * 유효성 검사가 실패할 경우 사용자가 리디렉션될 URI입니다.
 *
 * @var string
 */
protected $redirect = '/dashboard';
```

또는, 사용자를 이름이 지정된 라우트로 리디렉션하고 싶다면, 대신 `$redirectRoute` 속성을 정의할 수 있습니다:

```php
/**
 * 유효성 검사가 실패할 경우 사용자가 리디렉션될 라우트입니다.
 *
 * @var string
 */
protected $redirectRoute = 'dashboard';
```


### 폼 요청 권한 부여 {#authorizing-form-requests}

폼 요청 클래스에는 `authorize` 메서드도 포함되어 있습니다. 이 메서드 내에서 인증된 사용자가 실제로 주어진 리소스를 업데이트할 권한이 있는지 결정할 수 있습니다. 예를 들어, 사용자가 실제로 업데이트하려는 블로그 댓글의 소유자인지 확인할 수 있습니다. 대부분의 경우, 이 메서드 내에서 [권한 게이트 및 정책](/laravel/12.x/authorization)과 상호작용하게 됩니다:

```php
use App\Models\Comment;

/**
 * 사용자가 이 요청을 수행할 권한이 있는지 결정합니다.
 */
public function authorize(): bool
{
    $comment = Comment::find($this->route('comment'));

    return $comment && $this->user()->can('update', $comment);
}
```

모든 폼 요청은 기본 Laravel 요청 클래스를 확장하므로, `user` 메서드를 사용하여 현재 인증된 사용자에 접근할 수 있습니다. 또한, 위 예제에서 `route` 메서드 호출에 주목하세요. 이 메서드는 호출되는 라우트에 정의된 URI 파라미터(예: 아래 예제의 `{comment}` 파라미터)에 접근할 수 있게 해줍니다:

```php
Route::post('/comment/{comment}');
```

따라서, 애플리케이션이 [라우트 모델 바인딩](/laravel/12.x/routing#route-model-binding)을 활용하고 있다면, 요청의 속성으로 해결된 모델에 접근하여 코드를 더욱 간결하게 만들 수 있습니다:

```php
return $this->user()->can('update', $this->comment);
```

`authorize` 메서드가 `false`를 반환하면, 403 상태 코드의 HTTP 응답이 자동으로 반환되고 컨트롤러 메서드는 실행되지 않습니다.

요청에 대한 권한 부여 로직을 애플리케이션의 다른 부분에서 처리할 계획이라면, `authorize` 메서드를 완전히 제거하거나 단순히 `true`를 반환할 수 있습니다:

```php
/**
 * 사용자가 이 요청을 수행할 권한이 있는지 결정합니다.
 */
public function authorize(): bool
{
    return true;
}
```

> [!NOTE]
> `authorize` 메서드의 시그니처에서 필요한 의존성을 타입힌트할 수 있습니다. 이들은 Laravel [서비스 컨테이너](/laravel/12.x/container)를 통해 자동으로 해결됩니다.


### 오류 메시지 커스터마이징 {#customizing-the-error-messages}

폼 요청에서 사용되는 오류 메시지는 `messages` 메서드를 오버라이드하여 커스터마이징할 수 있습니다. 이 메서드는 속성/규칙 쌍과 해당 오류 메시지의 배열을 반환해야 합니다:

```php
/**
 * 정의된 유효성 검사 규칙에 대한 오류 메시지를 가져옵니다.
 *
 * @return array<string, string>
 */
public function messages(): array
{
    return [
        'title.required' => '제목은 필수입니다',
        'body.required' => '메시지는 필수입니다',
    ];
}
```


#### 유효성 검사 속성 커스터마이징 {#customizing-the-validation-attributes}

Laravel의 내장 유효성 검사 규칙 오류 메시지 중 다수는 `:attribute` 플레이스홀더를 포함합니다. 유효성 검사 메시지의 `:attribute` 플레이스홀더를 커스텀 속성명으로 대체하고 싶다면, `attributes` 메서드를 오버라이드하여 커스텀 이름을 지정할 수 있습니다. 이 메서드는 속성/이름 쌍의 배열을 반환해야 합니다:

```php
/**
 * 유효성 검사 오류에 대한 커스텀 속성을 가져옵니다.
 *
 * @return array<string, string>
 */
public function attributes(): array
{
    return [
        'email' => '이메일 주소',
    ];
}
```


### 유효성 검사 전 입력값 준비하기 {#preparing-input-for-validation}

유효성 검사 규칙을 적용하기 전에 요청에서 데이터를 준비하거나 정제해야 한다면, `prepareForValidation` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Str;

/**
 * 유효성 검사를 위한 데이터를 준비합니다.
 */
protected function prepareForValidation(): void
{
    $this->merge([
        'slug' => Str::slug($this->slug),
    ]);
}
```

마찬가지로, 유효성 검사 완료 후 요청 데이터를 정규화해야 한다면, `passedValidation` 메서드를 사용할 수 있습니다:

```php
/**
 * 유효성 검사 통과 시 처리합니다.
 */
protected function passedValidation(): void
{
    $this->replace(['name' => 'Taylor']);
}
```


## 수동으로 유효성 검사기 생성하기 {#manually-creating-validators}

요청의 `validate` 메서드를 사용하고 싶지 않다면, `Validator` [파사드](/laravel/12.x/facades)를 사용하여 수동으로 유효성 검사기 인스턴스를 생성할 수 있습니다. 파사드의 `make` 메서드는 새로운 유효성 검사기 인스턴스를 생성합니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * 새 블로그 포스트를 저장합니다.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|unique:posts|max:255',
            'body' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect('/post/create')
                ->withErrors($validator)
                ->withInput();
        }

        // 유효성 검사된 입력값을 가져옵니다...
        $validated = $validator->validated();

        // 유효성 검사된 입력값의 일부만 가져옵니다...
        $validated = $validator->safe()->only(['name', 'email']);
        $validated = $validator->safe()->except(['name', 'email']);

        // 블로그 포스트를 저장합니다...

        return redirect('/posts');
    }
}
```

`make` 메서드에 전달되는 첫 번째 인수는 검증할 데이터입니다. 두 번째 인수는 데이터에 적용할 유효성 검사 규칙의 배열입니다.

요청 유효성 검사 실패 여부를 확인한 후, `withErrors` 메서드를 사용하여 오류 메시지를 세션에 플래시할 수 있습니다. 이 메서드를 사용하면, 리디렉션 후 `$errors` 변수가 뷰와 자동으로 공유되어 사용자에게 쉽게 표시할 수 있습니다. `withErrors` 메서드는 유효성 검사기, `MessageBag`, 또는 PHP 배열을 인수로 받을 수 있습니다.

#### 첫 번째 유효성 검사 실패 시 중단하기

`stopOnFirstFailure` 메서드는 단일 유효성 검사 실패가 발생하면 모든 속성에 대한 검증을 중단하도록 유효성 검사기에 알립니다:

```php
if ($validator->stopOnFirstFailure()->fails()) {
    // ...
}
```


### 자동 리디렉션 {#automatic-redirection}

수동으로 유효성 검사기 인스턴스를 생성하면서도 HTTP 요청의 `validate` 메서드가 제공하는 자동 리디렉션 기능을 활용하고 싶다면, 기존 유효성 검사기 인스턴스에서 `validate` 메서드를 호출할 수 있습니다. 유효성 검사가 실패하면 사용자가 자동으로 리디렉션되거나, XHR 요청의 경우 [JSON 응답이 반환됩니다](#validation-error-response-format):

```php
Validator::make($request->all(), [
    'title' => 'required|unique:posts|max:255',
    'body' => 'required',
])->validate();
```

유효성 검사 실패 시 오류 메시지를 [이름이 지정된 오류 가방](#named-error-bags)에 저장하려면 `validateWithBag` 메서드를 사용할 수 있습니다:

```php
Validator::make($request->all(), [
    'title' => 'required|unique:posts|max:255',
    'body' => 'required',
])->validateWithBag('post');
```


### 이름이 지정된 오류 가방 {#named-error-bags}

하나의 페이지에 여러 폼이 있는 경우, 유효성 검사 오류를 포함하는 `MessageBag`에 이름을 지정하여 특정 폼의 오류 메시지를 가져올 수 있습니다. 이를 위해 `withErrors`의 두 번째 인수로 이름을 전달하세요:

```php
return redirect('/register')->withErrors($validator, 'login');
```

그런 다음, `$errors` 변수에서 이름이 지정된 `MessageBag` 인스턴스에 접근할 수 있습니다:

```blade
{{ $errors->login->first('email') }}
```


### 오류 메시지 커스터마이징 {#manual-customizing-the-error-messages}

필요하다면, Laravel이 제공하는 기본 오류 메시지 대신 유효성 검사기 인스턴스가 사용할 커스텀 오류 메시지를 지정할 수 있습니다. 커스텀 메시지를 지정하는 방법은 여러 가지가 있습니다. 먼저, 커스텀 메시지를 `Validator::make` 메서드의 세 번째 인수로 전달할 수 있습니다:

```php
$validator = Validator::make($input, $rules, $messages = [
    'required' => ':attribute 필드는 필수입니다.',
]);
```

이 예제에서 `:attribute` 플레이스홀더는 검증 중인 실제 필드명으로 대체됩니다. 유효성 검사 메시지에서 다른 플레이스홀더도 사용할 수 있습니다. 예를 들어:

```php
$messages = [
    'same' => ':attribute와 :other는 일치해야 합니다.',
    'size' => ':attribute는 정확히 :size여야 합니다.',
    'between' => ':attribute 값 :input은 :min - :max 사이가 아닙니다.',
    'in' => ':attribute는 다음 타입 중 하나여야 합니다: :values',
];
```


#### 특정 속성에 대한 커스텀 메시지 지정하기 {#specifying-a-custom-message-for-a-given-attribute}

특정 속성에 대해서만 커스텀 오류 메시지를 지정하고 싶을 때가 있습니다. 이럴 때는 "점" 표기법을 사용하세요. 먼저 속성명을, 그 다음 규칙명을 지정합니다:

```php
$messages = [
    'email.required' => '이메일 주소가 필요합니다!',
];
```


#### 커스텀 속성 값 지정하기 {#specifying-custom-attribute-values}

Laravel의 내장 오류 메시지 중 다수는 검증 중인 필드 또는 속성명을 대체하는 `:attribute` 플레이스홀더를 포함합니다. 특정 필드에 대해 이 플레이스홀더를 대체할 값을 커스터마이징하려면, 커스텀 속성 배열을 `Validator::make` 메서드의 네 번째 인수로 전달할 수 있습니다:

```php
$validator = Validator::make($input, $rules, $messages, [
    'email' => '이메일 주소',
]);
```


### 추가 유효성 검사 수행하기 {#performing-additional-validation}

초기 유효성 검사가 완료된 후 추가 유효성 검사를 수행해야 할 때가 있습니다. 유효성 검사기의 `after` 메서드를 사용하여 이를 수행할 수 있습니다. `after` 메서드는 유효성 검사 완료 후 호출될 클로저 또는 콜러블의 배열을 받습니다. 전달된 콜러블은 `Illuminate\Validation\Validator` 인스턴스를 받아, 필요하다면 추가 오류 메시지를 발생시킬 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make(/* ... */);

$validator->after(function ($validator) {
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add(
            'field', '이 필드에 문제가 있습니다!'
        );
    }
});

if ($validator->fails()) {
    // ...
}
```

앞서 언급했듯이, `after` 메서드는 콜러블의 배열도 받을 수 있습니다. 이는 "after validation" 로직이 호출 가능한 클래스에 캡슐화되어 있을 때 특히 편리합니다. 이 클래스들은 `__invoke` 메서드를 통해 `Illuminate\Validation\Validator` 인스턴스를 받게 됩니다:

```php
use App\Validation\ValidateShippingTime;
use App\Validation\ValidateUserStatus;

$validator->after([
    new ValidateUserStatus,
    new ValidateShippingTime,
    function ($validator) {
        // ...
    },
]);
```


## 유효성 검사된 입력값 다루기 {#working-with-validated-input}

폼 요청이나 수동으로 생성한 유효성 검사기 인스턴스를 사용하여 들어오는 요청 데이터를 검증한 후, 실제로 검증된 요청 데이터를 가져오고 싶을 수 있습니다. 이를 수행하는 방법은 여러 가지가 있습니다. 먼저, 폼 요청 또는 유효성 검사기 인스턴스에서 `validated` 메서드를 호출할 수 있습니다. 이 메서드는 검증된 데이터의 배열을 반환합니다:

```php
$validated = $request->validated();

$validated = $validator->validated();
```

또는, 폼 요청 또는 유효성 검사기 인스턴스에서 `safe` 메서드를 호출할 수 있습니다. 이 메서드는 `Illuminate\Support\ValidatedInput` 인스턴스를 반환합니다. 이 객체는 검증된 데이터의 일부 또는 전체 배열을 가져오기 위한 `only`, `except`, `all` 메서드를 제공합니다:

```php
$validated = $request->safe()->only(['name', 'email']);

$validated = $request->safe()->except(['name', 'email']);

$validated = $request->safe()->all();
```

또한, `Illuminate\Support\ValidatedInput` 인스턴스는 반복(iterate)하거나 배열처럼 접근할 수 있습니다:

```php
// 검증된 데이터 반복...
foreach ($request->safe() as $key => $value) {
    // ...
}

// 검증된 데이터 배열 접근...
$validated = $request->safe();

$email = $validated['email'];
```

검증된 데이터에 추가 필드를 더하고 싶다면, `merge` 메서드를 호출할 수 있습니다:

```php
$validated = $request->safe()->merge(['name' => 'Taylor Otwell']);
```

검증된 데이터를 [컬렉션](/laravel/12.x/collections) 인스턴스로 가져오고 싶다면, `collect` 메서드를 호출할 수 있습니다:

```php
$collection = $request->safe()->collect();
```


## 오류 메시지 다루기 {#working-with-error-messages}

`Validator` 인스턴스에서 `errors` 메서드를 호출하면, 오류 메시지를 다루기 위한 다양한 편리한 메서드를 가진 `Illuminate\Support\MessageBag` 인스턴스를 받게 됩니다. 모든 뷰에서 자동으로 사용할 수 있는 `$errors` 변수도 `MessageBag` 클래스의 인스턴스입니다.


#### 필드의 첫 번째 오류 메시지 가져오기 {#retrieving-the-first-error-message-for-a-field}

주어진 필드의 첫 번째 오류 메시지를 가져오려면, `first` 메서드를 사용하세요:

```php
$errors = $validator->errors();

echo $errors->first('email');
```


#### 필드의 모든 오류 메시지 가져오기 {#retrieving-all-error-messages-for-a-field}

주어진 필드에 대한 모든 메시지의 배열을 가져와야 한다면, `get` 메서드를 사용하세요:

```php
foreach ($errors->get('email') as $message) {
    // ...
}
```

배열 폼 필드를 검증하는 경우, `*` 문자를 사용하여 각 배열 요소에 대한 모든 메시지를 가져올 수 있습니다:

```php
foreach ($errors->get('attachments.*') as $message) {
    // ...
}
```


#### 모든 필드의 모든 오류 메시지 가져오기 {#retrieving-all-error-messages-for-all-fields}

모든 필드의 모든 메시지 배열을 가져오려면, `all` 메서드를 사용하세요:

```php
foreach ($errors->all() as $message) {
    // ...
}
```


#### 필드에 메시지가 존재하는지 확인하기 {#determining-if-messages-exist-for-a-field}

`has` 메서드를 사용하여 주어진 필드에 오류 메시지가 존재하는지 확인할 수 있습니다:

```php
if ($errors->has('email')) {
    // ...
}
```


### 언어 파일에서 커스텀 메시지 지정하기 {#specifying-custom-messages-in-language-files}

Laravel의 내장 유효성 검사 규칙마다 애플리케이션의 `lang/en/validation.php` 파일에 오류 메시지가 위치해 있습니다. 애플리케이션에 `lang` 디렉터리가 없다면, `lang:publish` Artisan 명령어를 사용하여 Laravel이 이를 생성하도록 할 수 있습니다.

`lang/en/validation.php` 파일 내에는 각 유효성 검사 규칙에 대한 번역 항목이 있습니다. 애플리케이션의 필요에 따라 이 메시지들을 자유롭게 변경하거나 수정할 수 있습니다.

또한, 이 파일을 다른 언어 디렉터리로 복사하여 애플리케이션 언어에 맞게 메시지를 번역할 수 있습니다. Laravel 로컬라이제이션에 대해 더 알아보려면 [로컬라이제이션 문서](/laravel/12.x/localization)를 참고하세요.

> [!WARNING]
> 기본적으로, Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이징하려면 `lang:publish` Artisan 명령어를 통해 파일을 퍼블리시할 수 있습니다.


#### 특정 속성에 대한 커스텀 메시지 {#custom-messages-for-specific-attributes}

애플리케이션의 유효성 검사 언어 파일 내에서 지정된 속성과 규칙 조합에 대해 사용되는 오류 메시지를 커스터마이징할 수 있습니다. 이를 위해, 애플리케이션의 `lang/xx/validation.php` 언어 파일의 `custom` 배열에 메시지 커스터마이징을 추가하세요:

```php
'custom' => [
    'email' => [
        'required' => '이메일 주소가 필요합니다!',
        'max' => '이메일 주소가 너무 깁니다!'
    ],
],
```


### 언어 파일에서 속성 지정하기 {#specifying-attribute-in-language-files}

Laravel의 내장 오류 메시지 중 다수는 검증 중인 필드 또는 속성명을 대체하는 `:attribute` 플레이스홀더를 포함합니다. 유효성 검사 메시지의 `:attribute` 부분을 커스텀 값으로 대체하고 싶다면, `lang/xx/validation.php` 언어 파일의 `attributes` 배열에 커스텀 속성명을 지정할 수 있습니다:

```php
'attributes' => [
    'email' => '이메일 주소',
],
```

> [!WARNING]
> 기본적으로, Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이징하려면 `lang:publish` Artisan 명령어를 통해 파일을 퍼블리시할 수 있습니다.


### 언어 파일에서 값 지정하기 {#specifying-values-in-language-files}

Laravel의 일부 내장 유효성 검사 규칙 오류 메시지에는 요청 속성의 현재 값으로 대체되는 `:value` 플레이스홀더가 포함되어 있습니다. 그러나 때때로 유효성 검사 메시지의 `:value` 부분이 값의 사용자 지정 표현으로 대체되어야 할 필요가 있습니다. 예를 들어, 다음과 같이 `payment_type`이 `cc` 값일 때 신용카드 번호가 필수임을 지정하는 규칙을 생각해보세요:

```php
Validator::make($request->all(), [
    'credit_card_number' => 'required_if:payment_type,cc'
]);
```

이 유효성 검사 규칙이 실패하면 다음과 같은 오류 메시지가 생성됩니다:

```text
The credit card number field is required when payment type is cc.
```

`cc`를 결제 유형 값으로 표시하는 대신, `lang/xx/validation.php` 언어 파일에서 `values` 배열을 정의하여 더 사용자 친화적인 값 표현을 지정할 수 있습니다:

```php
'values' => [
    'payment_type' => [
        'cc' => 'credit card'
    ],
],
```

> [!WARNING]
> 기본적으로 Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하려면 `lang:publish` Artisan 명령어를 통해 게시할 수 있습니다.

이 값을 정의한 후에는 유효성 검사 규칙이 다음과 같은 오류 메시지를 생성합니다:

```text
The credit card number field is required when payment type is credit card.
```


## 사용 가능한 유효성 검사 규칙 {#available-validation-rules}

아래는 사용 가능한 모든 유효성 검사 규칙과 그 기능의 목록입니다:

<style>
    .collection-method-list > p {
        columns: 10.8em 3; -moz-columns: 10.8em 3; -webkit-columns: 10.8em 3;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

#### 불리언

<div class="collection-method-list" markdown="1">

[Accepted](#rule-accepted)
[Accepted If](#rule-accepted-if)
[Boolean](#rule-boolean)
[Declined](#rule-declined)
[Declined If](#rule-declined-if)

</div>

#### 문자열

<div class="collection-method-list" markdown="1">

[Active URL](#rule-active-url)
[Alpha](#rule-alpha)
[Alpha Dash](#rule-alpha-dash)
[Alpha Numeric](#rule-alpha-num)
[Ascii](#rule-ascii)
[Confirmed](#rule-confirmed)
[Current Password](#rule-current-password)
[Different](#rule-different)
[Doesnt Start With](#rule-doesnt-start-with)
[Doesnt End With](#rule-doesnt-end-with)
[Email](#rule-email)
[Ends With](#rule-ends-with)
[Enum](#rule-enum)
[Hex Color](#rule-hex-color)
[In](#rule-in)
[IP Address](#rule-ip)
[JSON](#rule-json)
[Lowercase](#rule-lowercase)
[MAC Address](#rule-mac)
[Max](#rule-max)
[Min](#rule-min)
[Not In](#rule-not-in)
[Regular Expression](#rule-regex)
[Not Regular Expression](#rule-not-regex)
[Same](#rule-same)
[Size](#rule-size)
[Starts With](#rule-starts-with)
[String](#rule-string)
[Uppercase](#rule-uppercase)
[URL](#rule-url)
[ULID](#rule-ulid)
[UUID](#rule-uuid)

</div>

#### 숫자

<div class="collection-method-list" markdown="1">

[Between](#rule-between)
[Decimal](#rule-decimal)
[Different](#rule-different)
[Digits](#rule-digits)
[Digits Between](#rule-digits-between)
[Greater Than](#rule-gt)
[Greater Than Or Equal](#rule-gte)
[Integer](#rule-integer)
[Less Than](#rule-lt)
[Less Than Or Equal](#rule-lte)
[Max](#rule-max)
[Max Digits](#rule-max-digits)
[Min](#rule-min)
[Min Digits](#rule-min-digits)
[Multiple Of](#rule-multiple-of)
[Numeric](#rule-numeric)
[Same](#rule-same)
[Size](#rule-size)

</div>

#### 배열

<div class="collection-method-list" markdown="1">

[Array](#rule-array)
[Between](#rule-between)
[Contains](#rule-contains)
[Distinct](#rule-distinct)
[In Array](#rule-in-array)
[In Array Keys](#rule-in-array-keys)
[List](#rule-list)
[Max](#rule-max)
[Min](#rule-min)
[Size](#rule-size)

</div>

#### 날짜

<div class="collection-method-list" markdown="1">

[After](#rule-after)
[After Or Equal](#rule-after-or-equal)
[Before](#rule-before)
[Before Or Equal](#rule-before-or-equal)
[Date](#rule-date)
[Date Equals](#rule-date-equals)
[Date Format](#rule-date-format)
[Different](#rule-different)
[Timezone](#rule-timezone)

</div>

#### 파일

<div class="collection-method-list" markdown="1">

[Between](#rule-between)
[Dimensions](#rule-dimensions)
[Extensions](#rule-extensions)
[File](#rule-file)
[Image](#rule-image)
[Max](#rule-max)
[MIME Types](#rule-mimetypes)
[MIME Type By File Extension](#rule-mimes)
[Size](#rule-size)

</div>

#### 데이터베이스

<div class="collection-method-list" markdown="1">

[Exists](#rule-exists)
[Unique](#rule-unique)

</div>

#### 유틸리티

<div class="collection-method-list" markdown="1">

[Any Of](#rule-anyof)
[Bail](#rule-bail)
[Exclude](#rule-exclude)
[Exclude If](#rule-exclude-if)
[Exclude Unless](#rule-exclude-unless)
[Exclude With](#rule-exclude-with)
[Exclude Without](#rule-exclude-without)
[Filled](#rule-filled)
[Missing](#rule-missing)
[Missing If](#rule-missing-if)
[Missing Unless](#rule-missing-unless)
[Missing With](#rule-missing-with)
[Missing With All](#rule-missing-with-all)
[Nullable](#rule-nullable)
[Present](#rule-present)
[Present If](#rule-present-if)
[Present Unless](#rule-present-unless)
[Present With](#rule-present-with)
[Present With All](#rule-present-with-all)
[Prohibited](#rule-prohibited)
[Prohibited If](#rule-prohibited-if)
[Prohibited If Accepted](#rule-prohibited-if-accepted)
[Prohibited If Declined](#rule-prohibited-if-declined)
[Prohibited Unless](#rule-prohibited-unless)
[Prohibits](#rule-prohibits)
[Required](#rule-required)
[Required If](#rule-required-if)
[Required If Accepted](#rule-required-if-accepted)
[Required If Declined](#rule-required-if-declined)
[Required Unless](#rule-required-unless)
[Required With](#rule-required-with)
[Required With All](#rule-required-with-all)
[Required Without](#rule-required-without)
[Required Without All](#rule-required-without-all)
[Required Array Keys](#rule-required-array-keys)
[Sometimes](#validating-when-present)

</div>


#### accepted {#rule-accepted}

검증 중인 필드는 `"yes"`, `"on"`, `1`, `"1"`, `true`, 또는 `"true"`여야 합니다. 이는 "서비스 약관" 동의 또는 유사한 필드를 검증할 때 유용합니다.


#### accepted_if:anotherfield,value,... {#rule-accepted-if}

검증 중인 필드는, 다른 검증 중인 필드가 지정된 값과 같을 때 `"yes"`, `"on"`, `1`, `"1"`, `true`, 또는 `"true"`여야 합니다. 이는 "서비스 약관" 동의 또는 유사한 필드를 검증할 때 유용합니다.


#### active_url {#rule-active-url}

검증 중인 필드는 `dns_get_record` PHP 함수에 따라 유효한 A 또는 AAAA 레코드를 가져야 합니다. 제공된 URL의 호스트명은 `parse_url` PHP 함수를 사용하여 추출된 후 `dns_get_record`에 전달됩니다.


#### after:_date_ {#rule-after}

검증 중인 필드는 주어진 날짜 이후의 값이어야 합니다. 날짜는 `strtotime` PHP 함수에 전달되어 유효한 `DateTime` 인스턴스로 변환됩니다:

```php
'start_date' => 'required|date|after:tomorrow'
```

`strtotime`으로 평가할 날짜 문자열을 전달하는 대신, 날짜와 비교할 다른 필드를 지정할 수 있습니다:

```php
'finish_date' => 'required|date|after:start_date'
```

편의를 위해, 날짜 기반 규칙은 유창한 `date` 규칙 빌더를 사용하여 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

'start_date' => [
    'required',
    Rule::date()->after(today()->addDays(7)),
],
```

`afterToday`와 `todayOrAfter` 메서드는 각각 오늘 이후 또는 오늘 또는 이후여야 함을 유창하게 표현할 수 있습니다:

```php
'start_date' => [
    'required',
    Rule::date()->afterToday(),
],
```


#### after\_or\_equal:_date_ {#rule-after-or-equal}

검증 중인 필드는 주어진 날짜 이후이거나 같아야 합니다. 자세한 내용은 [after](#rule-after) 규칙을 참조하세요.

편의를 위해, 날짜 기반 규칙은 유창한 `date` 규칙 빌더를 사용하여 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

'start_date' => [
    'required',
    Rule::date()->afterOrEqual(today()->addDays(7)),
],
```


#### anyOf {#rule-anyof}

`Rule::anyOf` 유효성 검사 규칙을 사용하면 검증 중인 필드가 주어진 유효성 검사 규칙 집합 중 하나라도 만족해야 함을 지정할 수 있습니다. 예를 들어, 다음 규칙은 `username` 필드가 이메일 주소이거나 대시를 포함한 6자 이상의 영숫자 문자열이어야 함을 검증합니다:

```php
use Illuminate\Validation\Rule;

'username' => [
    'required',
    Rule::anyOf([
        ['string', 'email'],
        ['string', 'alpha_dash', 'min:6'],
    ]),
],
```


#### alpha {#rule-alpha}

검증 중인 필드는 [\p{L}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AL%3A%5D&g=&i=) 및 [\p{M}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AM%3A%5D&g=&i=)에 포함된 완전한 유니코드 알파벳 문자여야 합니다.

이 유효성 검사 규칙을 ASCII 범위(`a-z` 및 `A-Z`)의 문자로 제한하려면, 규칙에 `ascii` 옵션을 제공할 수 있습니다:

```php
'username' => 'alpha:ascii',
```


#### alpha_dash {#rule-alpha-dash}

검증 중인 필드는 [\p{L}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AL%3A%5D&g=&i=), [\p{M}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AM%3A%5D&g=&i=), [\p{N}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AN%3A%5D&g=&i=)에 포함된 완전한 유니코드 영숫자 문자와 ASCII 대시(`-`), ASCII 언더스코어(`_`)여야 합니다.

이 유효성 검사 규칙을 ASCII 범위(`a-z`, `A-Z`, `0-9`)의 문자로 제한하려면, 규칙에 `ascii` 옵션을 제공할 수 있습니다:

```php
'username' => 'alpha_dash:ascii',
```


#### alpha_num {#rule-alpha-num}

검증 중인 필드는 [\p{L}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AL%3A%5D&g=&i=), [\p{M}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AM%3A%5D&g=&i=), [\p{N}](https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AN%3A%5D&g=&i=)에 포함된 완전한 유니코드 영숫자 문자여야 합니다.

이 유효성 검사 규칙을 ASCII 범위(`a-z`, `A-Z`, `0-9`)의 문자로 제한하려면, 규칙에 `ascii` 옵션을 제공할 수 있습니다:

```php
'username' => 'alpha_num:ascii',
```


#### array {#rule-array}

검증 중인 필드는 PHP `array`여야 합니다.

`array` 규칙에 추가 값을 제공하면, 입력 배열의 각 키는 규칙에 제공된 값 목록에 존재해야 합니다. 다음 예제에서 입력 배열의 `admin` 키는 규칙에 제공된 값 목록에 포함되어 있지 않으므로 유효하지 않습니다:

```php
use Illuminate\Support\Facades\Validator;

$input = [
    'user' => [
        'name' => 'Taylor Otwell',
        'username' => 'taylorotwell',
        'admin' => true,
    ],
];

Validator::make($input, [
    'user' => 'array:name,username',
]);
```

일반적으로, 배열 내에 존재할 수 있는 배열 키를 항상 지정해야 합니다.


#### ascii {#rule-ascii}

검증 중인 필드는 완전히 7비트 ASCII 문자여야 합니다.


#### bail {#rule-bail}

첫 번째 유효성 검사 실패 후 해당 필드에 대한 유효성 검사 규칙 실행을 중지합니다.

`bail` 규칙은 특정 필드에서 유효성 검사 실패가 발생하면 해당 필드의 유효성 검사만 중지하지만, `stopOnFirstFailure` 메서드는 단일 유효성 검사 실패가 발생하면 모든 속성의 유효성 검사를 중지하도록 검증자에게 알립니다:

```php
if ($validator->stopOnFirstFailure()->fails()) {
    // ...
}
```


#### before:_date_ {#rule-before}

검증 중인 필드는 주어진 날짜 이전의 값이어야 합니다. 날짜는 PHP `strtotime` 함수에 전달되어 유효한 `DateTime` 인스턴스로 변환됩니다. 또한, [after](#rule-after) 규칙과 마찬가지로, 검증 중인 다른 필드의 이름을 `date` 값으로 제공할 수 있습니다.

편의를 위해, 날짜 기반 규칙은 유창한 `date` 규칙 빌더를 사용하여 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

'start_date' => [
    'required',
    Rule::date()->before(today()->subDays(7)),
],
```

`beforeToday`와 `todayOrBefore` 메서드는 각각 오늘 이전 또는 오늘 또는 이전이어야 함을 유창하게 표현할 수 있습니다:

```php
'start_date' => [
    'required',
    Rule::date()->beforeToday(),
],
```


#### before\_or\_equal:_date_ {#rule-before-or-equal}

검증 중인 필드는 주어진 날짜 이전이거나 같아야 합니다. 날짜는 PHP `strtotime` 함수에 전달되어 유효한 `DateTime` 인스턴스로 변환됩니다. 또한, [after](#rule-after) 규칙과 마찬가지로, 검증 중인 다른 필드의 이름을 `date` 값으로 제공할 수 있습니다.

편의를 위해, 날짜 기반 규칙은 유창한 `date` 규칙 빌더를 사용하여 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

'start_date' => [
    'required',
    Rule::date()->beforeOrEqual(today()->subDays(7)),
],
```


#### between:_min_,_max_ {#rule-between}

검증 중인 필드는 주어진 _min_과 _max_(포함) 사이의 크기를 가져야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### boolean {#rule-boolean}

검증 중인 필드는 불리언으로 변환될 수 있어야 합니다. 허용되는 입력값은 `true`, `false`, `1`, `0`, `"1"`, `"0"`입니다.


#### confirmed {#rule-confirmed}

검증 중인 필드는 `{field}_confirmation`과 일치하는 필드가 있어야 합니다. 예를 들어, 검증 중인 필드가 `password`라면, 입력값에 일치하는 `password_confirmation` 필드가 있어야 합니다.

사용자 지정 확인 필드 이름을 전달할 수도 있습니다. 예를 들어, `confirmed:repeat_username`은 `repeat_username` 필드가 검증 중인 필드와 일치하기를 기대합니다.


#### contains:_foo_,_bar_,... {#rule-contains}

검증 중인 필드는 주어진 매개변수 값을 모두 포함하는 배열이어야 합니다. 이 규칙은 종종 배열을 `implode`해야 하므로, `Rule::contains` 메서드를 사용하여 규칙을 유창하게 생성할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($data, [
    'roles' => [
        'required',
        'array',
        Rule::contains(['admin', 'editor']),
    ],
]);
```


#### current_password {#rule-current-password}

검증 중인 필드는 인증된 사용자의 비밀번호와 일치해야 합니다. 규칙의 첫 번째 매개변수로 [인증 가드](/laravel/12.x/authentication)를 지정할 수 있습니다:

```php
'password' => 'current_password:api'
```


#### date {#rule-date}

검증 중인 필드는 `strtotime` PHP 함수에 따라 유효한, 상대적이지 않은 날짜여야 합니다.


#### date_equals:_date_ {#rule-date-equals}

검증 중인 필드는 주어진 날짜와 같아야 합니다. 날짜는 PHP `strtotime` 함수에 전달되어 유효한 `DateTime` 인스턴스로 변환됩니다.


#### date_format:_format_,... {#rule-date-format}

검증 중인 필드는 주어진 _formats_ 중 하나와 일치해야 합니다. 필드를 검증할 때는 `date` 또는 `date_format` 중 **하나만** 사용해야 합니다. 이 유효성 검사 규칙은 PHP의 [DateTime](https://www.php.net/manual/en/class.datetime.php) 클래스가 지원하는 모든 형식을 지원합니다.

편의를 위해, 날짜 기반 규칙은 유창한 `date` 규칙 빌더를 사용하여 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

'start_date' => [
    'required',
    Rule::date()->format('Y-m-d'),
],
```


#### decimal:_min_,_max_ {#rule-decimal}

검증 중인 필드는 숫자여야 하며, 지정된 소수 자릿수를 포함해야 합니다:

```php
// 소수점 이하 두 자리(9.99)여야 함...
'price' => 'decimal:2'

// 2~4자리 소수점 이하를 가져야 함...
'price' => 'decimal:2,4'
```


#### declined {#rule-declined}

검증 중인 필드는 `"no"`, `"off"`, `0`, `"0"`, `false`, 또는 `"false"`여야 합니다.


#### declined_if:anotherfield,value,... {#rule-declined-if}

검증 중인 필드는, 다른 검증 중인 필드가 지정된 값과 같을 때 `"no"`, `"off"`, `0`, `"0"`, `false`, 또는 `"false"`여야 합니다.


#### different:_field_ {#rule-different}

검증 중인 필드는 _field_와 다른 값을 가져야 합니다.


#### digits:_value_ {#rule-digits}

검증 중인 정수는 _value_의 정확한 길이를 가져야 합니다.


#### digits_between:_min_,_max_ {#rule-digits-between}

검증 중인 정수는 주어진 _min_과 _max_ 사이의 길이를 가져야 합니다.


#### dimensions {#rule-dimensions}

검증 중인 파일은 규칙의 매개변수로 지정된 차원 제약 조건을 충족하는 이미지여야 합니다:

```php
'avatar' => 'dimensions:min_width=100,min_height=200'
```

사용 가능한 제약 조건: _min\_width_, _max\_width_, _min\_height_, _max\_height_, _width_, _height_, _ratio_.

_ratio_ 제약 조건은 너비를 높이로 나눈 값으로 표현해야 합니다. 이는 `3/2`와 같은 분수나 `1.5`와 같은 실수로 지정할 수 있습니다:

```php
'avatar' => 'dimensions:ratio=3/2'
```

이 규칙은 여러 인자가 필요하므로, `Rule::dimensions` 메서드를 사용하여 규칙을 유창하게 생성하는 것이 더 편리할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($data, [
    'avatar' => [
        'required',
        Rule::dimensions()
            ->maxWidth(1000)
            ->maxHeight(500)
            ->ratio(3 / 2),
    ],
]);
```


#### distinct {#rule-distinct}

배열을 검증할 때, 검증 중인 필드는 중복 값을 가져서는 안 됩니다:

```php
'foo.*.id' => 'distinct'
```

Distinct는 기본적으로 느슨한 변수 비교를 사용합니다. 엄격한 비교를 사용하려면, 유효성 검사 규칙 정의에 `strict` 매개변수를 추가할 수 있습니다:

```php
'foo.*.id' => 'distinct:strict'
```

규칙의 인자에 `ignore_case`를 추가하여 대소문자 차이를 무시하도록 만들 수 있습니다:

```php
'foo.*.id' => 'distinct:ignore_case'
```


#### doesnt_start_with:_foo_,_bar_,... {#rule-doesnt-start-with}

검증 중인 필드는 주어진 값 중 하나로 시작해서는 안 됩니다.


#### doesnt_end_with:_foo_,_bar_,... {#rule-doesnt-end-with}

검증 중인 필드는 주어진 값 중 하나로 끝나서는 안 됩니다.


#### email {#rule-email}

검증 중인 필드는 이메일 주소 형식이어야 합니다. 이 유효성 검사 규칙은 이메일 주소를 검증하기 위해 [egulias/email-validator](https://github.com/egulias/EmailValidator) 패키지를 사용합니다. 기본적으로 `RFCValidation` 검증기가 적용되지만, 다른 검증 스타일도 적용할 수 있습니다:

```php
'email' => 'email:rfc,dns'
```

위 예제는 `RFCValidation`과 `DNSCheckValidation` 검증을 적용합니다. 적용할 수 있는 검증 스타일의 전체 목록은 다음과 같습니다:

<div class="content-list" markdown="1">

- `rfc`: `RFCValidation` - [지원되는 RFC](https://github.com/egulias/EmailValidator?tab=readme-ov-file#supported-rfcs)에 따라 이메일 주소를 검증합니다.
- `strict`: `NoRFCWarningsValidation` - [지원되는 RFC](https://github.com/egulias/EmailValidator?tab=readme-ov-file#supported-rfcs)에 따라 이메일을 검증하며, 경고(예: 끝에 마침표, 연속된 마침표 등)가 있으면 실패합니다.
- `dns`: `DNSCheckValidation` - 이메일 주소의 도메인에 유효한 MX 레코드가 있는지 확인합니다.
- `spoof`: `SpoofCheckValidation` - 이메일 주소에 동형 이의어나 기만적인 유니코드 문자가 포함되어 있지 않은지 확인합니다.
- `filter`: `FilterEmailValidation` - PHP의 `filter_var` 함수에 따라 이메일 주소가 유효한지 확인합니다.
- `filter_unicode`: `FilterEmailValidation::unicode()` - PHP의 `filter_var` 함수에 따라 이메일 주소가 유효한지 확인하며, 일부 유니코드 문자를 허용합니다.

</div>

편의를 위해, 이메일 유효성 검사 규칙은 유창한 규칙 빌더를 사용하여 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

$request->validate([
    'email' => [
        'required',
        Rule::email()
            ->rfcCompliant(strict: false)
            ->validateMxRecord()
            ->preventSpoofing()
    ],
]);
```

> [!WARNING]
> `dns` 및 `spoof` 검증기는 PHP `intl` 확장 모듈이 필요합니다.


#### ends_with:_foo_,_bar_,... {#rule-ends-with}

검증 중인 필드는 주어진 값 중 하나로 끝나야 합니다.


#### enum {#rule-enum}

`Enum` 규칙은 검증 중인 필드가 유효한 enum 값을 포함하는지 검증하는 클래스 기반 규칙입니다. `Enum` 규칙은 enum의 이름을 유일한 생성자 인수로 받습니다. 원시 값을 검증할 때는 백드 Enum을 `Enum` 규칙에 제공해야 합니다:

```php
use App\Enums\ServerStatus;
use Illuminate\Validation\Rule;

$request->validate([
    'status' => [Rule::enum(ServerStatus::class)],
]);
```

`Enum` 규칙의 `only` 및 `except` 메서드를 사용하여 유효한 enum 케이스를 제한할 수 있습니다:

```php
Rule::enum(ServerStatus::class)
    ->only([ServerStatus::Pending, ServerStatus::Active]);

Rule::enum(ServerStatus::class)
    ->except([ServerStatus::Pending, ServerStatus::Active]);
```

`when` 메서드는 `Enum` 규칙을 조건부로 수정하는 데 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

Rule::enum(ServerStatus::class)
    ->when(
        Auth::user()->isAdmin(),
        fn ($rule) => $rule->only(...),
        fn ($rule) => $rule->only(...),
    );
```


#### exclude {#rule-exclude}

검증 중인 필드는 `validate` 및 `validated` 메서드로 반환되는 요청 데이터에서 제외됩니다.


#### exclude_if:_anotherfield_,_value_ {#rule-exclude-if}

검증 중인 필드는 _anotherfield_ 필드가 _value_와 같을 때 `validate` 및 `validated` 메서드로 반환되는 요청 데이터에서 제외됩니다.

복잡한 조건부 제외 로직이 필요한 경우, `Rule::excludeIf` 메서드를 사용할 수 있습니다. 이 메서드는 불리언 또는 클로저를 인수로 받습니다. 클로저가 주어지면, 클로저는 검증 중인 필드를 제외해야 하는지 여부를 나타내는 `true` 또는 `false`를 반환해야 합니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($request->all(), [
    'role_id' => Rule::excludeIf($request->user()->is_admin),
]);

Validator::make($request->all(), [
    'role_id' => Rule::excludeIf(fn () => $request->user()->is_admin),
]);
```


#### exclude_unless:_anotherfield_,_value_ {#rule-exclude-unless}

검증 중인 필드는 _anotherfield_의 필드가 _value_와 같지 않으면 `validate` 및 `validated` 메서드로 반환되는 요청 데이터에서 제외됩니다. _value_가 `null`(`exclude_unless:name,null`)인 경우, 비교 필드가 `null`이거나 요청 데이터에 없으면 검증 중인 필드는 제외됩니다.


#### exclude_with:_anotherfield_ {#rule-exclude-with}

검증 중인 필드는 _anotherfield_ 필드가 존재하면 `validate` 및 `validated` 메서드로 반환되는 요청 데이터에서 제외됩니다.


#### exclude_without:_anotherfield_ {#rule-exclude-without}

검증 중인 필드는 _anotherfield_ 필드가 존재하지 않으면 `validate` 및 `validated` 메서드로 반환되는 요청 데이터에서 제외됩니다.


#### exists:_table_,_column_ {#rule-exists}

검증 중인 필드는 주어진 데이터베이스 테이블에 존재해야 합니다.


#### Exists 규칙의 기본 사용법 {#basic-usage-of-exists-rule}

```php
'state' => 'exists:states'
```

`column` 옵션이 지정되지 않으면, 필드 이름이 사용됩니다. 이 경우, 규칙은 `states` 데이터베이스 테이블에 요청의 `state` 속성 값과 일치하는 `state` 컬럼 값이 있는 레코드가 있는지 검증합니다.


#### 사용자 지정 컬럼 이름 지정하기 {#specifying-a-custom-column-name}

유효성 검사 규칙에서 사용할 데이터베이스 컬럼 이름을 데이터베이스 테이블 이름 뒤에 명시적으로 지정할 수 있습니다:

```php
'state' => 'exists:states,abbreviation'
```

때때로, `exists` 쿼리에 사용할 특정 데이터베이스 연결을 지정해야 할 수도 있습니다. 이 경우, 테이블 이름 앞에 연결 이름을 붙이면 됩니다:

```php
'email' => 'exists:connection.staff,email'
```

테이블 이름을 직접 지정하는 대신, Eloquent 모델을 지정하여 테이블 이름을 결정할 수 있습니다:

```php
'user_id' => 'exists:App\Models\User,id'
```

유효성 검사 규칙에서 실행되는 쿼리를 커스터마이즈하고 싶다면, `Rule` 클래스를 사용하여 규칙을 유창하게 정의할 수 있습니다. 이 예제에서는 유효성 검사 규칙도 `|` 문자가 아닌 배열로 지정합니다:

```php
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($data, [
    'email' => [
        'required',
        Rule::exists('staff')->where(function (Builder $query) {
            $query->where('account_id', 1);
        }),
    ],
]);
```

`Rule::exists` 메서드로 생성된 `exists` 규칙에 사용할 데이터베이스 컬럼 이름을 두 번째 인수로 명시적으로 지정할 수 있습니다:

```php
'state' => Rule::exists('states', 'abbreviation'),
```

때때로, 값 배열이 데이터베이스에 존재하는지 검증하고 싶을 수 있습니다. 이 경우, 검증할 필드에 `exists`와 [array](#rule-array) 규칙을 모두 추가하면 됩니다:

```php
'states' => ['array', Rule::exists('states', 'abbreviation')],
```

이 두 규칙이 필드에 모두 할당되면, Laravel은 지정된 테이블에 모든 값이 존재하는지 확인하기 위해 자동으로 단일 쿼리를 생성합니다.


#### extensions:_foo_,_bar_,... {#rule-extensions}

검증 중인 파일은 나열된 확장자 중 하나와 일치하는 사용자 지정 확장자를 가져야 합니다:

```php
'photo' => ['required', 'extensions:jpg,png'],
```

> [!WARNING]
> 파일의 사용자 지정 확장자만으로 파일을 검증하는 것에 의존해서는 안 됩니다. 이 규칙은 일반적으로 [mimes](#rule-mimes) 또는 [mimetypes](#rule-mimetypes) 규칙과 항상 함께 사용해야 합니다.


#### file {#rule-file}

검증 중인 필드는 성공적으로 업로드된 파일이어야 합니다.


#### filled {#rule-filled}

검증 중인 필드는 존재할 때 비어 있지 않아야 합니다.


#### gt:_field_ {#rule-gt}

검증 중인 필드는 주어진 _field_ 또는 _value_보다 커야 합니다. 두 필드는 동일한 타입이어야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### gte:_field_ {#rule-gte}

검증 중인 필드는 주어진 _field_ 또는 _value_보다 크거나 같아야 합니다. 두 필드는 동일한 타입이어야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### hex_color {#rule-hex-color}

검증 중인 필드는 [16진수](https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color) 형식의 유효한 색상 값을 포함해야 합니다.


#### image {#rule-image}

검증 중인 파일은 이미지(jpg, jpeg, png, bmp, gif, 또는 webp)여야 합니다.

> [!WARNING]
> 기본적으로 image 규칙은 XSS 취약점 가능성 때문에 SVG 파일을 허용하지 않습니다. SVG 파일을 허용해야 한다면, `image` 규칙에 `allow_svg` 지시어를 제공할 수 있습니다(`image:allow_svg`).


#### in:_foo_,_bar_,... {#rule-in}

검증 중인 필드는 주어진 값 목록에 포함되어야 합니다. 이 규칙은 종종 배열을 `implode`해야 하므로, `Rule::in` 메서드를 사용하여 규칙을 유창하게 생성할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($data, [
    'zones' => [
        'required',
        Rule::in(['first-zone', 'second-zone']),
    ],
]);
```

`in` 규칙이 `array` 규칙과 결합되면, 입력 배열의 각 값은 `in` 규칙에 제공된 값 목록에 존재해야 합니다. 다음 예제에서 입력 배열의 `LAS` 공항 코드는 `in` 규칙에 제공된 공항 목록에 포함되어 있지 않으므로 유효하지 않습니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

$input = [
    'airports' => ['NYC', 'LAS'],
];

Validator::make($input, [
    'airports' => [
        'required',
        'array',
    ],
    'airports.*' => Rule::in(['NYC', 'LIT']),
]);
```


#### in_array:_anotherfield_.* {#rule-in-array}

검증 중인 필드는 _anotherfield_의 값에 존재해야 합니다.


#### in_array_keys:_value_.* {#rule-in-array-keys}

검증 중인 필드는 배열이어야 하며, 배열 내에 주어진 _values_ 중 적어도 하나를 키로 가져야 합니다:

```php
'config' => 'array|in_array_keys:timezone'
```


#### integer {#rule-integer}

검증 중인 필드는 정수여야 합니다.

> [!WARNING]
> 이 유효성 검사 규칙은 입력값이 "정수" 변수 타입인지 확인하지 않고, PHP의 `FILTER_VALIDATE_INT` 규칙에서 허용하는 타입인지 확인합니다. 입력값이 숫자인지 검증하려면 [numeric 유효성 검사 규칙](#rule-numeric)과 함께 이 규칙을 사용하세요.


#### ip {#rule-ip}

검증 중인 필드는 IP 주소여야 합니다.


#### ipv4 {#ipv4}

검증 중인 필드는 IPv4 주소여야 합니다.


#### ipv6 {#ipv6}

검증 중인 필드는 IPv6 주소여야 합니다.


#### json {#rule-json}

검증 중인 필드는 유효한 JSON 문자열이어야 합니다.


#### lt:_field_ {#rule-lt}

검증 중인 필드는 주어진 _field_보다 작아야 합니다. 두 필드는 동일한 타입이어야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### lte:_field_ {#rule-lte}

검증 중인 필드는 주어진 _field_보다 작거나 같아야 합니다. 두 필드는 동일한 타입이어야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### lowercase {#rule-lowercase}

검증 중인 필드는 소문자여야 합니다.


#### list {#rule-list}

검증 중인 필드는 리스트인 배열이어야 합니다. 배열의 키가 0부터 `count($array) - 1`까지 연속된 숫자로 구성되어 있으면 리스트로 간주합니다.


#### mac_address {#rule-mac}

검증 중인 필드는 MAC 주소여야 합니다.


#### max:_value_ {#rule-max}

검증 중인 필드는 최대 _value_보다 작거나 같아야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### max_digits:_value_ {#rule-max-digits}

검증 중인 정수는 최대 _value_ 길이를 가져야 합니다.


#### mimetypes:_text/plain_,... {#rule-mimetypes}

검증 중인 파일은 주어진 MIME 타입 중 하나와 일치해야 합니다:

```php
'video' => 'mimetypes:video/avi,video/mpeg,video/quicktime'
```

업로드된 파일의 MIME 타입을 결정하기 위해, 파일의 내용을 읽고 프레임워크가 MIME 타입을 추측합니다. 이는 클라이언트가 제공한 MIME 타입과 다를 수 있습니다.


#### mimes:_foo_,_bar_,... {#rule-mimes}

검증 중인 파일은 나열된 확장자 중 하나에 해당하는 MIME 타입을 가져야 합니다:

```php
'photo' => 'mimes:jpg,bmp,png'
```

확장자만 지정하면 되지만, 이 규칙은 실제로 파일의 내용을 읽고 MIME 타입을 추측하여 파일의 MIME 타입을 검증합니다. MIME 타입과 해당 확장자의 전체 목록은 다음 위치에서 확인할 수 있습니다:

[https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types](https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types)


#### MIME 타입과 확장자 {#mime-types-and-extensions}

이 유효성 검사 규칙은 MIME 타입과 사용자가 파일에 지정한 확장자가 일치하는지 확인하지 않습니다. 예를 들어, `mimes:png` 유효성 검사 규칙은 파일 이름이 `photo.txt`여도 파일 내용이 유효한 PNG라면 유효한 PNG 이미지로 간주합니다. 파일의 사용자 지정 확장자를 검증하려면 [extensions](#rule-extensions) 규칙을 사용할 수 있습니다.


#### min:_value_ {#rule-min}

검증 중인 필드는 최소 _value_를 가져야 합니다. 문자열, 숫자, 배열, 파일은 [size](#rule-size) 규칙과 동일한 방식으로 평가됩니다.


#### min_digits:_value_ {#rule-min-digits}

검증 중인 정수는 최소 _value_ 길이를 가져야 합니다.


#### multiple_of:_value_ {#rule-multiple-of}

검증 중인 필드는 _value_의 배수여야 합니다.


#### missing {#rule-missing}

검증 중인 필드는 입력 데이터에 존재하지 않아야 합니다.


#### missing_if:_anotherfield_,_value_,... {#rule-missing-if}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같을 때 존재하지 않아야 합니다.


#### missing_unless:_anotherfield_,_value_ {#rule-missing-unless}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같지 않으면 존재하지 않아야 합니다.


#### missing_with:_foo_,_bar_,... {#rule-missing-with}

검증 중인 필드는 지정된 다른 필드 중 하나라도 존재할 때만 존재하지 않아야 합니다.


#### missing_with_all:_foo_,_bar_,... {#rule-missing-with-all}

검증 중인 필드는 지정된 다른 필드가 모두 존재할 때만 존재하지 않아야 합니다.


#### not_in:_foo_,_bar_,... {#rule-not-in}

검증 중인 필드는 주어진 값 목록에 포함되어서는 안 됩니다. `Rule::notIn` 메서드를 사용하여 규칙을 유창하게 생성할 수 있습니다:

```php
use Illuminate\Validation\Rule;

Validator::make($data, [
    'toppings' => [
        'required',
        Rule::notIn(['sprinkles', 'cherries']),
    ],
]);
```


#### not_regex:_pattern_ {#rule-not-regex}

검증 중인 필드는 주어진 정규식과 일치하지 않아야 합니다.

내부적으로 이 규칙은 PHP `preg_match` 함수를 사용합니다. 지정된 패턴은 `preg_match`에서 요구하는 형식과 동일해야 하며, 유효한 구분자를 포함해야 합니다. 예: `'email' => 'not_regex:/^.+$/i'`.

> [!WARNING]
> `regex` / `not_regex` 패턴을 사용할 때, 정규식에 `|` 문자가 포함되어 있다면 규칙을 `|` 구분자 대신 배열로 지정해야 할 수 있습니다.


#### nullable {#rule-nullable}

검증 중인 필드는 `null`일 수 있습니다.


#### numeric {#rule-numeric}

검증 중인 필드는 [숫자](https://www.php.net/manual/en/function.is-numeric.php)여야 합니다.


#### present {#rule-present}

검증 중인 필드는 입력 데이터에 존재해야 합니다.


#### present_if:_anotherfield_,_value_,... {#rule-present-if}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같을 때 존재해야 합니다.


#### present_unless:_anotherfield_,_value_ {#rule-present-unless}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같지 않으면 존재해야 합니다.


#### present_with:_foo_,_bar_,... {#rule-present-with}

검증 중인 필드는 지정된 다른 필드 중 하나라도 존재할 때만 존재해야 합니다.


#### present_with_all:_foo_,_bar_,... {#rule-present-with-all}

검증 중인 필드는 지정된 다른 필드가 모두 존재할 때만 존재해야 합니다.


#### prohibited {#rule-prohibited}

검증 중인 필드는 존재하지 않거나 비어 있어야 합니다. 필드가 "비어 있음"으로 간주되는 기준은 다음과 같습니다:

<div class="content-list" markdown="1">

- 값이 `null`인 경우
- 값이 빈 문자열인 경우
- 값이 빈 배열 또는 빈 `Countable` 객체인 경우
- 값이 경로가 비어 있는 업로드된 파일인 경우

</div>


#### prohibited_if:_anotherfield_,_value_,... {#rule-prohibited-if}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같을 때 존재하지 않거나 비어 있어야 합니다. 필드가 "비어 있음"으로 간주되는 기준은 다음과 같습니다:

<div class="content-list" markdown="1">

- 값이 `null`인 경우
- 값이 빈 문자열인 경우
- 값이 빈 배열 또는 빈 `Countable` 객체인 경우
- 값이 경로가 비어 있는 업로드된 파일인 경우

</div>

복잡한 조건부 금지 로직이 필요한 경우, `Rule::prohibitedIf` 메서드를 사용할 수 있습니다. 이 메서드는 불리언 또는 클로저를 인수로 받습니다. 클로저가 주어지면, 클로저는 검증 중인 필드를 금지해야 하는지 여부를 나타내는 `true` 또는 `false`를 반환해야 합니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($request->all(), [
    'role_id' => Rule::prohibitedIf($request->user()->is_admin),
]);

Validator::make($request->all(), [
    'role_id' => Rule::prohibitedIf(fn () => $request->user()->is_admin),
]);
```

#### prohibited_if_accepted:_anotherfield_,... {#rule-prohibited-if-accepted}

검증 중인 필드는 _anotherfield_ 필드가 `"yes"`, `"on"`, `1`, `"1"`, `true`, 또는 `"true"`와 같을 때 존재하지 않거나 비어 있어야 합니다.


#### prohibited_if_declined:_anotherfield_,... {#rule-prohibited-if-declined}

검증 중인 필드는 _anotherfield_ 필드가 `"no"`, `"off"`, `0`, `"0"`, `false`, 또는 `"false"`와 같을 때 존재하지 않거나 비어 있어야 합니다.


#### prohibited_unless:_anotherfield_,_value_,... {#rule-prohibited-unless}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같지 않으면 존재하지 않거나 비어 있어야 합니다. 필드가 "비어 있음"으로 간주되는 기준은 다음과 같습니다:

<div class="content-list" markdown="1">

- 값이 `null`인 경우
- 값이 빈 문자열인 경우
- 값이 빈 배열 또는 빈 `Countable` 객체인 경우
- 값이 경로가 비어 있는 업로드된 파일인 경우

</div>


#### prohibits:_anotherfield_,... {#rule-prohibits}

검증 중인 필드가 존재하지 않거나 비어 있지 않으면, _anotherfield_의 모든 필드는 존재하지 않거나 비어 있어야 합니다. 필드가 "비어 있음"으로 간주되는 기준은 다음과 같습니다:

<div class="content-list" markdown="1">

- 값이 `null`인 경우
- 값이 빈 문자열인 경우
- 값이 빈 배열 또는 빈 `Countable` 객체인 경우
- 값이 경로가 비어 있는 업로드된 파일인 경우

</div>


#### regex:_pattern_ {#rule-regex}

검증 중인 필드는 주어진 정규식과 일치해야 합니다.

내부적으로 이 규칙은 PHP `preg_match` 함수를 사용합니다. 지정된 패턴은 `preg_match`에서 요구하는 형식과 동일해야 하며, 유효한 구분자를 포함해야 합니다. 예: `'email' => 'regex:/^.+@.+$/i'`.

> [!WARNING]
> `regex` / `not_regex` 패턴을 사용할 때, 정규식에 `|` 문자가 포함되어 있다면 규칙을 `|` 구분자 대신 배열로 지정해야 할 수 있습니다.


#### required {#rule-required}

검증 중인 필드는 입력 데이터에 존재해야 하며 비어 있지 않아야 합니다. 필드가 "비어 있음"으로 간주되는 기준은 다음과 같습니다:

<div class="content-list" markdown="1">

- 값이 `null`인 경우
- 값이 빈 문자열인 경우
- 값이 빈 배열 또는 빈 `Countable` 객체인 경우
- 경로가 없는 업로드된 파일인 경우

</div>


#### required_if:_anotherfield_,_value_,... {#rule-required-if}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같을 때 존재해야 하며 비어 있지 않아야 합니다.

`required_if` 규칙에 대해 더 복잡한 조건을 만들고 싶다면, `Rule::requiredIf` 메서드를 사용할 수 있습니다. 이 메서드는 불리언 또는 클로저를 인수로 받습니다. 클로저가 전달되면, 클로저는 검증 중인 필드가 필수인지 여부를 나타내는 `true` 또는 `false`를 반환해야 합니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($request->all(), [
    'role_id' => Rule::requiredIf($request->user()->is_admin),
]);

Validator::make($request->all(), [
    'role_id' => Rule::requiredIf(fn () => $request->user()->is_admin),
]);
```


#### required_if_accepted:_anotherfield_,... {#rule-required-if-accepted}

검증 중인 필드는 _anotherfield_ 필드가 `"yes"`, `"on"`, `1`, `"1"`, `true`, 또는 `"true"`와 같을 때 존재해야 하며 비어 있지 않아야 합니다.


#### required_if_declined:_anotherfield_,... {#rule-required-if-declined}

검증 중인 필드는 _anotherfield_ 필드가 `"no"`, `"off"`, `0`, `"0"`, `false`, 또는 `"false"`와 같을 때 존재해야 하며 비어 있지 않아야 합니다.


#### required_unless:_anotherfield_,_value_,... {#rule-required-unless}

검증 중인 필드는 _anotherfield_ 필드가 _value_ 중 하나와 같지 않으면 존재해야 하며 비어 있지 않아야 합니다. 이는 _anotherfield_가 _value_가 `null`이 아닌 한 요청 데이터에 존재해야 함을 의미합니다. _value_가 `null`(`required_unless:name,null`)인 경우, 비교 필드가 `null`이거나 요청 데이터에 없으면 검증 중인 필드는 필수가 아닙니다.


#### required_with:_foo_,_bar_,... {#rule-required-with}

검증 중인 필드는 지정된 다른 필드 중 하나라도 존재하고 비어 있지 않을 때만 존재해야 하며 비어 있지 않아야 합니다.


#### required_with_all:_foo_,_bar_,... {#rule-required-with-all}

검증 중인 필드는 지정된 다른 필드가 모두 존재하고 비어 있지 않을 때만 존재해야 하며 비어 있지 않아야 합니다.


#### required_without:_foo_,_bar_,... {#rule-required-without}

검증 중인 필드는 지정된 다른 필드 중 하나라도 비어 있거나 존재하지 않을 때만 존재해야 하며 비어 있지 않아야 합니다.


#### required_without_all:_foo_,_bar_,... {#rule-required-without-all}

검증 중인 필드는 지정된 다른 필드가 모두 비어 있거나 존재하지 않을 때만 존재해야 하며 비어 있지 않아야 합니다.


#### required_array_keys:_foo_,_bar_,... {#rule-required-array-keys}

검증 중인 필드는 배열이어야 하며, 지정된 키를 적어도 포함해야 합니다.


#### same:_field_ {#rule-same}

주어진 _field_는 검증 중인 필드와 일치해야 합니다.


#### size:_value_ {#rule-size}

검증 중인 필드는 주어진 _value_와 일치하는 크기를 가져야 합니다. 문자열 데이터의 경우 _value_는 문자 수에 해당합니다. 숫자 데이터의 경우 _value_는 주어진 정수 값에 해당합니다(속성에 `numeric` 또는 `integer` 규칙도 있어야 함). 배열의 경우 _size_는 배열의 `count`에 해당합니다. 파일의 경우 _size_는 파일 크기(킬로바이트)에 해당합니다. 예제를 살펴보세요:

```php
// 문자열이 정확히 12자여야 함...
'title' => 'size:12';

// 제공된 정수가 10과 같아야 함...
'seats' => 'integer|size:10';

// 배열이 정확히 5개의 요소를 가져야 함...
'tags' => 'array|size:5';

// 업로드된 파일이 정확히 512킬로바이트여야 함...
'image' => 'file|size:512';
```


#### starts_with:_foo_,_bar_,... {#rule-starts-with}

검증 중인 필드는 주어진 값 중 하나로 시작해야 합니다.


#### string {#rule-string}

검증 중인 필드는 문자열이어야 합니다. 필드가 `null`도 허용하려면, 필드에 `nullable` 규칙을 할당해야 합니다.


#### timezone {#rule-timezone}

검증 중인 필드는 `DateTimeZone::listIdentifiers` 메서드에 따라 유효한 타임존 식별자여야 합니다.

[`DateTimeZone::listIdentifiers` 메서드에서 허용하는 인자](https://www.php.net/manual/en/datetimezone.listidentifiers.php)도 이 유효성 검사 규칙에 제공할 수 있습니다:

```php
'timezone' => 'required|timezone:all';

'timezone' => 'required|timezone:Africa';

'timezone' => 'required|timezone:per_country,US';
```


#### unique:_table_,_column_ {#rule-unique}

검증 중인 필드는 주어진 데이터베이스 테이블 내에 존재하지 않아야 합니다.

**사용자 지정 테이블/컬럼 이름 지정하기:**

테이블 이름을 직접 지정하는 대신, Eloquent 모델을 지정하여 테이블 이름을 결정할 수 있습니다:

```php
'email' => 'unique:App\Models\User,email_address'
```

`column` 옵션은 필드에 해당하는 데이터베이스 컬럼을 지정하는 데 사용할 수 있습니다. `column` 옵션이 지정되지 않으면, 검증 중인 필드의 이름이 사용됩니다.

```php
'email' => 'unique:users,email_address'
```

**사용자 지정 데이터베이스 연결 지정하기**

때때로, Validator가 수행하는 데이터베이스 쿼리에 사용자 지정 연결을 설정해야 할 수 있습니다. 이 경우, 테이블 이름 앞에 연결 이름을 붙이면 됩니다:

```php
'email' => 'unique:connection.users,email_address'
```

**특정 ID를 무시하도록 Unique 규칙 강제하기:**

때때로, 고유성 검증 중에 특정 ID를 무시하고 싶을 수 있습니다. 예를 들어, "프로필 수정" 화면에 사용자의 이름, 이메일 주소, 위치가 포함되어 있다고 가정해봅시다. 이메일 주소가 고유한지 확인하고 싶지만, 사용자가 이름만 변경하고 이메일은 변경하지 않았다면, 해당 이메일의 소유자가 이미 사용자 자신이므로 유효성 검사 오류가 발생하지 않아야 합니다.

검증자에게 사용자의 ID를 무시하도록 지시하려면, `Rule` 클래스를 사용하여 규칙을 유창하게 정의합니다. 이 예제에서는 규칙도 `|` 문자가 아닌 배열로 지정합니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

Validator::make($data, [
    'email' => [
        'required',
        Rule::unique('users')->ignore($user->id),
    ],
]);
```

> [!WARNING]
> 사용자 제어 요청 입력값을 `ignore` 메서드에 절대 전달하지 마세요. 대신, Eloquent 모델 인스턴스의 자동 증가 ID나 UUID와 같은 시스템에서 생성된 고유 ID만 전달해야 합니다. 그렇지 않으면 애플리케이션이 SQL 인젝션 공격에 취약해집니다.

모델 키 값을 `ignore` 메서드에 전달하는 대신, 전체 모델 인스턴스를 전달할 수도 있습니다. Laravel은 모델에서 키를 자동으로 추출합니다:

```php
Rule::unique('users')->ignore($user)
```

테이블이 `id`가 아닌 다른 기본 키 컬럼 이름을 사용하는 경우, `ignore` 메서드 호출 시 컬럼 이름을 지정할 수 있습니다:

```php
Rule::unique('users')->ignore($user->id, 'user_id')
```

기본적으로, `unique` 규칙은 검증 중인 속성과 일치하는 컬럼의 고유성을 확인합니다. 그러나 `unique` 메서드의 두 번째 인수로 다른 컬럼 이름을 전달할 수 있습니다:

```php
Rule::unique('users', 'email_address')->ignore($user->id)
```

**추가 Where 절 추가하기:**

`where` 메서드를 사용하여 쿼리를 커스터마이즈함으로써 추가 쿼리 조건을 지정할 수 있습니다. 예를 들어, 쿼리 범위를 `account_id` 컬럼 값이 `1`인 레코드로만 제한하는 쿼리 조건을 추가해보겠습니다:

```php
'email' => Rule::unique('users')->where(fn (Builder $query) => $query->where('account_id', 1))
```

**Unique 검사에서 소프트 삭제된 레코드 무시하기:**

기본적으로, unique 규칙은 고유성 확인 시 소프트 삭제된 레코드를 포함합니다. 고유성 검사에서 소프트 삭제된 레코드를 제외하려면, `withoutTrashed` 메서드를 호출할 수 있습니다:

```php
Rule::unique('users')->withoutTrashed();
```

모델이 소프트 삭제된 레코드에 대해 `deleted_at`이 아닌 다른 컬럼 이름을 사용하는 경우, `withoutTrashed` 메서드 호출 시 컬럼 이름을 제공할 수 있습니다:

```php
Rule::unique('users')->withoutTrashed('was_deleted_at');
```


#### uppercase {#rule-uppercase}

검증 중인 필드는 대문자여야 합니다.


#### url {#rule-url}

검증 중인 필드는 유효한 URL이어야 합니다.

유효한 URL 프로토콜을 지정하려면, 프로토콜을 유효성 검사 규칙 매개변수로 전달할 수 있습니다:

```php
'url' => 'url:http,https',

'game' => 'url:minecraft,steam',
```


#### ulid {#rule-ulid}

검증 중인 필드는 유효한 [범용 고유 정렬 가능 식별자(ULID)](https://github.com/ulid/spec)여야 합니다.


#### uuid {#rule-uuid}

검증 중인 필드는 유효한 RFC 9562(버전 1, 3, 4, 5, 6, 7, 8) 범용 고유 식별자(UUID)여야 합니다.

주어진 UUID가 버전에 따라 UUID 사양과 일치하는지도 검증할 수 있습니다:

```php
'uuid' => 'uuid:4'
```


## 조건부 규칙 추가하기 {#conditionally-adding-rules}


#### 특정 값이 있을 때 유효성 검사 건너뛰기 {#skipping-validation-when-fields-have-certain-values}

다른 필드가 특정 값을 가질 때, 주어진 필드의 유효성 검사를 수행하지 않으려는 경우가 있을 수 있습니다. `exclude_if` 유효성 검사 규칙을 사용하여 이를 달성할 수 있습니다. 이 예제에서는 `has_appointment` 필드가 `false`일 때 `appointment_date`와 `doctor_name` 필드는 유효성 검사되지 않습니다:

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($data, [
    'has_appointment' => 'required|boolean',
    'appointment_date' => 'exclude_if:has_appointment,false|required|date',
    'doctor_name' => 'exclude_if:has_appointment,false|required|string',
]);
```

또는, `exclude_unless` 규칙을 사용하여, 다른 필드가 특정 값을 가지지 않으면 주어진 필드를 유효성 검사하지 않을 수도 있습니다:

```php
$validator = Validator::make($data, [
    'has_appointment' => 'required|boolean',
    'appointment_date' => 'exclude_unless:has_appointment,true|required|date',
    'doctor_name' => 'exclude_unless:has_appointment,true|required|string',
]);
```


#### 존재할 때만 유효성 검사하기 {#validating-when-present}

특정 상황에서는, 검증 중인 데이터에 해당 필드가 존재할 때만 유효성 검사를 실행하고 싶을 수 있습니다. 이를 빠르게 달성하려면, 규칙 목록에 `sometimes` 규칙을 추가하세요:

```php
$validator = Validator::make($data, [
    'email' => 'sometimes|required|email',
]);
```

위 예제에서, `email` 필드는 `$data` 배열에 존재할 때만 유효성 검사를 받게 됩니다.

> [!NOTE]
> 항상 존재해야 하지만 비어 있을 수 있는 필드를 검증하려는 경우, [옵션 필드에 대한 이 노트](#a-note-on-optional-fields)를 확인하세요.


#### 복잡한 조건부 유효성 검사 {#complex-conditional-validation}

때때로 더 복잡한 조건부 로직에 따라 유효성 검사 규칙을 추가하고 싶을 수 있습니다. 예를 들어, 다른 필드가 100보다 큰 값일 때만 주어진 필드를 필수로 만들고 싶을 수 있습니다. 또는, 다른 필드가 존재할 때만 두 필드가 특정 값을 가져야 할 수도 있습니다. 이러한 유효성 검사 규칙을 추가하는 것은 어렵지 않습니다. 먼저, _변하지 않는 규칙_으로 `Validator` 인스턴스를 생성하세요:

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'email' => 'required|email',
    'games' => 'required|integer|min:0',
]);
```

웹 애플리케이션이 게임 수집가를 위한 것이라고 가정해봅시다. 게임 수집가가 100개 이상의 게임을 소유하고 있다면, 왜 그렇게 많은 게임을 소유하고 있는지 설명하도록 요구하고 싶을 수 있습니다. 예를 들어, 게임 재판매점을 운영하거나 단순히 게임 수집을 즐길 수도 있습니다. 이 요구 사항을 조건부로 추가하려면, `Validator` 인스턴스의 `sometimes` 메서드를 사용할 수 있습니다.

```php
use Illuminate\Support\Fluent;

$validator->sometimes('reason', 'required|max:500', function (Fluent $input) {
    return $input->games >= 100;
});
```

`sometimes` 메서드의 첫 번째 인수는 조건부로 검증할 필드의 이름입니다. 두 번째 인수는 추가할 규칙 목록입니다. 세 번째 인수로 전달된 클로저가 `true`를 반환하면, 규칙이 추가됩니다. 이 메서드는 복잡한 조건부 유효성 검사를 쉽게 만듭니다. 여러 필드에 대해 조건부 유효성 검사를 한 번에 추가할 수도 있습니다:

```php
$validator->sometimes(['reason', 'cost'], 'required', function (Fluent $input) {
    return $input->games >= 100;
});
```

> [!NOTE]
> 클로저에 전달되는 `$input` 매개변수는 `Illuminate\Support\Fluent`의 인스턴스이며, 검증 중인 입력값과 파일에 접근하는 데 사용할 수 있습니다.


#### 복잡한 조건부 배열 유효성 검사 {#complex-conditional-array-validation}

때때로, 인덱스를 알 수 없는 동일한 중첩 배열 내의 다른 필드를 기반으로 필드를 검증하고 싶을 수 있습니다. 이러한 상황에서는, 클로저가 배열 내 현재 개별 항목을 두 번째 인수로 받을 수 있도록 허용할 수 있습니다:

```php
$input = [
    'channels' => [
        [
            'type' => 'email',
            'address' => 'abigail@example.com',
        ],
        [
            'type' => 'url',
            'address' => 'https://example.com',
        ],
    ],
];

$validator->sometimes('channels.*.address', 'email', function (Fluent $input, Fluent $item) {
    return $item->type === 'email';
});

$validator->sometimes('channels.*.address', 'url', function (Fluent $input, Fluent $item) {
    return $item->type !== 'email';
});
```

클로저에 전달되는 `$input` 매개변수와 마찬가지로, `$item` 매개변수는 속성 데이터가 배열일 때 `Illuminate\Support\Fluent`의 인스턴스입니다. 그렇지 않으면 문자열입니다.


## 배열 유효성 검사하기 {#validating-arrays}

[배열 유효성 검사 규칙 문서](#rule-array)에서 논의한 것처럼, `array` 규칙은 허용된 배열 키 목록을 허용합니다. 배열에 추가 키가 있으면, 유효성 검사가 실패합니다:

```php
use Illuminate\Support\Facades\Validator;

$input = [
    'user' => [
        'name' => 'Taylor Otwell',
        'username' => 'taylorotwell',
        'admin' => true,
    ],
];

Validator::make($input, [
    'user' => 'array:name,username',
]);
```

일반적으로, 배열 내에 존재할 수 있는 배열 키를 항상 지정해야 합니다. 그렇지 않으면, 검증자의 `validate` 및 `validated` 메서드는 모든 검증된 데이터를 반환하며, 배열과 그 모든 키를 포함합니다. 이때, 해당 키가 다른 중첩 배열 유효성 검사 규칙에 의해 검증되지 않았더라도 반환됩니다.


### 중첩 배열 입력값 검증 {#validating-nested-array-input}

중첩 배열 기반의 폼 입력 필드를 검증하는 것은 어렵지 않습니다. 배열 내의 속성을 검증할 때 "점 표기법(dot notation)"을 사용할 수 있습니다. 예를 들어, 들어오는 HTTP 요청에 `photos[profile]` 필드가 있다면, 다음과 같이 검증할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'photos.profile' => 'required|image',
]);
```

배열의 각 요소를 검증할 수도 있습니다. 예를 들어, 주어진 배열 입력 필드의 각 이메일이 고유한지 검증하려면 다음과 같이 할 수 있습니다:

```php
$validator = Validator::make($request->all(), [
    'person.*.email' => 'email|unique:users',
    'person.*.first_name' => 'required_with:person.*.last_name',
]);
```

마찬가지로, [언어 파일에서 사용자 지정 검증 메시지](#custom-messages-for-specific-attributes)를 지정할 때 `*` 문자를 사용할 수 있으므로, 배열 기반 필드에 대해 하나의 검증 메시지를 쉽게 사용할 수 있습니다:

```php
'custom' => [
    'person.*.email' => [
        'unique' => '각 사람은 고유한 이메일 주소를 가져야 합니다.',
    ]
],
```


#### 중첩 배열 데이터 접근하기 {#accessing-nested-array-data}

때때로 속성에 검증 규칙을 할당할 때, 주어진 중첩 배열 요소의 값을 접근해야 할 수도 있습니다. 이 경우 `Rule::forEach` 메서드를 사용할 수 있습니다. `forEach` 메서드는 클로저를 인자로 받으며, 검증 중인 배열 속성의 각 반복마다 호출되어 해당 속성의 값과 명시적이고 완전히 확장된 속성 이름을 받습니다. 클로저는 배열 요소에 할당할 규칙 배열을 반환해야 합니다:

```php
use App\Rules\HasPermission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

$validator = Validator::make($request->all(), [
    'companies.*.id' => Rule::forEach(function (string|null $value, string $attribute) {
        return [
            Rule::exists(Company::class, 'id'),
            new HasPermission('manage-company', $value),
        ];
    }),
]);
```


### 에러 메시지 인덱스와 위치 {#error-message-indexes-and-positions}

배열을 검증할 때, 애플리케이션에서 표시되는 에러 메시지 내에서 검증에 실패한 특정 항목의 인덱스나 위치를 참조하고 싶을 수 있습니다. 이를 위해 [사용자 지정 검증 메시지](#manual-customizing-the-error-messages) 내에 `:index`(0부터 시작)와 `:position`(1부터 시작) 플레이스홀더를 포함할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;

$input = [
    'photos' => [
        [
            'name' => 'BeachVacation.jpg',
            'description' => 'A photo of my beach vacation!',
        ],
        [
            'name' => 'GrandCanyon.jpg',
            'description' => '',
        ],
    ],
];

Validator::validate($input, [
    'photos.*.description' => 'required',
], [
    'photos.*.description.required' => '사진 #:position의 설명을 입력해 주세요.',
]);
```

위 예시에서, 검증이 실패하면 사용자에게 _"사진 #2의 설명을 입력해 주세요."_라는 에러가 표시됩니다.

필요하다면, `second-index`, `second-position`, `third-index`, `third-position` 등으로 더 깊이 중첩된 인덱스와 위치도 참조할 수 있습니다.

```php
'photos.*.attributes.*.string' => '사진 #:second-position의 속성이 올바르지 않습니다.',
```


## 파일 검증 {#validating-files}

Laravel은 업로드된 파일을 검증할 때 사용할 수 있는 다양한 검증 규칙(`mimes`, `image`, `min`, `max` 등)을 제공합니다. 파일을 검증할 때 이러한 규칙을 개별적으로 지정할 수도 있지만, Laravel은 보다 편리하게 사용할 수 있는 유창한 파일 검증 규칙 빌더도 제공합니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\File;

Validator::validate($input, [
    'attachment' => [
        'required',
        File::types(['mp3', 'wav'])
            ->min(1024)
            ->max(12 * 1024),
    ],
]);
```


#### 파일 유형 검증 {#validating-files-file-types}

`types` 메서드를 호출할 때 확장자만 지정하면 되지만, 이 메서드는 실제로 파일의 내용을 읽어 MIME 타입을 추측하여 MIME 타입을 검증합니다. MIME 타입과 해당 확장자의 전체 목록은 다음 위치에서 확인할 수 있습니다:

[https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types](https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types)


#### 파일 크기 검증 {#validating-files-file-sizes}

편의를 위해, 최소 및 최대 파일 크기는 파일 크기 단위를 나타내는 접미사를 포함한 문자열로 지정할 수 있습니다. `kb`, `mb`, `gb`, `tb` 접미사가 지원됩니다:

```php
File::types(['mp3', 'wav'])
    ->min('1kb')
    ->max('10mb');
```


#### 이미지 파일 검증 {#validating-files-image-files}

애플리케이션에서 사용자가 이미지를 업로드할 수 있도록 허용하는 경우, `File` 규칙의 `image` 생성자 메서드를 사용하여 검증 중인 파일이 이미지(jpg, jpeg, png, bmp, gif, 또는 webp)인지 확인할 수 있습니다.

또한, `dimensions` 규칙을 사용하여 이미지의 크기를 제한할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

Validator::validate($input, [
    'photo' => [
        'required',
        File::image()
            ->min(1024)
            ->max(12 * 1024)
            ->dimensions(Rule::dimensions()->maxWidth(1000)->maxHeight(500)),
    ],
]);
```

> [!NOTE]
> 이미지 크기 검증에 대한 자세한 내용은 [dimension 규칙 문서](#rule-dimensions)에서 확인할 수 있습니다.

> [!WARNING]
> 기본적으로 `image` 규칙은 XSS 취약점 가능성 때문에 SVG 파일을 허용하지 않습니다. SVG 파일을 허용해야 하는 경우, `image` 규칙에 `allowSvg: true`를 전달할 수 있습니다: `File::image(allowSvg: true)`.


#### 이미지 크기 검증 {#validating-files-image-dimensions}

이미지의 크기도 검증할 수 있습니다. 예를 들어, 업로드된 이미지가 최소 1000픽셀 너비와 500픽셀 높이인지 검증하려면 `dimensions` 규칙을 사용할 수 있습니다:

```php
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

File::image()->dimensions(
    Rule::dimensions()
        ->maxWidth(1000)
        ->maxHeight(500)
)
```

> [!NOTE]
> 이미지 크기 검증에 대한 자세한 내용은 [dimension 규칙 문서](#rule-dimensions)에서 확인할 수 있습니다.


## 비밀번호 검증 {#validating-passwords}

비밀번호가 충분한 복잡성을 갖추도록 하려면, Laravel의 `Password` 규칙 객체를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

$validator = Validator::make($request->all(), [
    'password' => ['required', 'confirmed', Password::min(8)],
]);
```

`Password` 규칙 객체를 사용하면, 비밀번호에 최소 한 글자, 숫자, 기호, 대소문자 혼합 등과 같은 복잡성 요구사항을 쉽게 커스터마이즈할 수 있습니다:

```php
// 최소 8자 이상...
Password::min(8)

// 최소 한 글자 포함...
Password::min(8)->letters()

// 최소 한 대문자와 한 소문자 포함...
Password::min(8)->mixedCase()

// 최소 한 숫자 포함...
Password::min(8)->numbers()

// 최소 한 기호 포함...
Password::min(8)->symbols()
```

또한, `uncompromised` 메서드를 사용하여 비밀번호가 공개된 비밀번호 데이터 유출에 노출되지 않았는지 확인할 수 있습니다:

```php
Password::min(8)->uncompromised()
```

내부적으로, `Password` 규칙 객체는 [k-익명성](https://ko.wikipedia.org/wiki/K-%EC%9D%B5%EB%AA%85%EC%84%B1) 모델을 사용하여 [haveibeenpwned.com](https://haveibeenpwned.com) 서비스를 통해 비밀번호가 유출되었는지 확인하면서도 사용자의 개인정보나 보안을 희생하지 않습니다.

기본적으로, 비밀번호가 데이터 유출에 한 번이라도 나타나면 손상된 것으로 간주됩니다. `uncompromised` 메서드의 첫 번째 인자를 사용하여 이 임계값을 커스터마이즈할 수 있습니다:

```php
// 동일한 데이터 유출에서 비밀번호가 3번 미만으로 나타나도록 보장...
Password::min(8)->uncompromised(3);
```

물론, 위 예시의 모든 메서드를 체이닝할 수 있습니다:

```php
Password::min(8)
    ->letters()
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised()
```


#### 기본 비밀번호 규칙 정의하기 {#defining-default-password-rules}

비밀번호에 대한 기본 검증 규칙을 애플리케이션의 한 곳에서 지정하는 것이 편리할 수 있습니다. `Password::defaults` 메서드를 사용하면 쉽게 이를 달성할 수 있으며, 이 메서드는 클로저를 인자로 받습니다. `defaults` 메서드에 전달된 클로저는 Password 규칙의 기본 구성을 반환해야 합니다. 일반적으로, `defaults` 규칙은 애플리케이션 서비스 프로바이더의 `boot` 메서드 내에서 호출되어야 합니다:

```php
use Illuminate\Validation\Rules\Password;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Password::defaults(function () {
        $rule = Password::min(8);

        return $this->app->isProduction()
            ? $rule->mixedCase()->uncompromised()
            : $rule;
    });
}
```

그런 다음, 검증 중인 특정 비밀번호에 기본 규칙을 적용하려면 인자 없이 `defaults` 메서드를 호출하면 됩니다:

```php
'password' => ['required', Password::defaults()],
```

때때로, 기본 비밀번호 검증 규칙에 추가 검증 규칙을 붙이고 싶을 수 있습니다. 이럴 때는 `rules` 메서드를 사용할 수 있습니다:

```php
use App\Rules\ZxcvbnRule;

Password::defaults(function () {
    $rule = Password::min(8)->rules([new ZxcvbnRule]);

    // ...
});
```


## 사용자 지정 검증 규칙 {#custom-validation-rules}


### 규칙 객체 사용하기 {#using-rule-objects}

Laravel은 다양한 유용한 검증 규칙을 제공하지만, 직접 규칙을 지정하고 싶을 수도 있습니다. 사용자 지정 검증 규칙을 등록하는 한 가지 방법은 규칙 객체를 사용하는 것입니다. 새로운 규칙 객체를 생성하려면 `make:rule` Artisan 명령어를 사용할 수 있습니다. 이 명령어를 사용하여 문자열이 대문자인지 확인하는 규칙을 생성해 보겠습니다. Laravel은 새 규칙을 `app/Rules` 디렉터리에 생성합니다. 이 디렉터리가 없다면, Artisan 명령어 실행 시 자동으로 생성됩니다:

```shell
php artisan make:rule Uppercase
```

규칙이 생성되면, 동작을 정의할 준비가 된 것입니다. 규칙 객체에는 `validate`라는 단일 메서드가 있습니다. 이 메서드는 속성 이름, 값, 그리고 검증 실패 시 호출해야 하는 콜백(검증 에러 메시지 포함)을 받습니다:

```php
<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Uppercase implements ValidationRule
{
    /**
     * 검증 규칙을 실행합니다.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail('The :attribute must be uppercase.');
        }
    }
}
```

규칙이 정의되면, 다른 검증 규칙과 함께 규칙 객체의 인스턴스를 전달하여 검증기에 붙일 수 있습니다:

```php
use App\Rules\Uppercase;

$request->validate([
    'name' => ['required', 'string', new Uppercase],
]);
```

#### 검증 메시지 번역하기

리터럴 에러 메시지를 `$fail` 클로저에 제공하는 대신, [번역 문자열 키](/laravel/12.x/localization)를 제공하고 Laravel이 에러 메시지를 번역하도록 할 수도 있습니다:

```php
if (strtoupper($value) !== $value) {
    $fail('validation.uppercase')->translate();
}
```

필요하다면, 플레이스홀더 치환값과 선호하는 언어를 `translate` 메서드의 첫 번째와 두 번째 인자로 제공할 수 있습니다:

```php
$fail('validation.location')->translate([
    'value' => $this->value,
], 'fr');
```

#### 추가 데이터 접근하기

사용자 지정 검증 규칙 클래스에서 검증 중인 모든 다른 데이터에 접근해야 한다면, 규칙 클래스가 `Illuminate\Contracts\Validation\DataAwareRule` 인터페이스를 구현할 수 있습니다. 이 인터페이스는 클래스에 `setData` 메서드를 정의하도록 요구합니다. 이 메서드는 Laravel에 의해(검증이 진행되기 전에) 자동으로 호출되며, 검증 중인 모든 데이터를 전달받습니다:

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

class Uppercase implements DataAwareRule, ValidationRule
{
    /**
     * 검증 중인 모든 데이터.
     *
     * @var array<string, mixed>
     */
    protected $data = [];

    // ...

    /**
     * 검증 중인 데이터를 설정합니다.
     *
     * @param  array<string, mixed>  $data
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
}
```

또는, 검증 규칙이 검증을 수행하는 검증기 인스턴스에 접근해야 한다면, `ValidatorAwareRule` 인터페이스를 구현할 수 있습니다:

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Validation\Validator;

class Uppercase implements ValidationRule, ValidatorAwareRule
{
    /**
     * 검증기 인스턴스.
     *
     * @var \Illuminate\Validation\Validator
     */
    protected $validator;

    // ...

    /**
     * 현재 검증기를 설정합니다.
     */
    public function setValidator(Validator $validator): static
    {
        $this->validator = $validator;

        return $this;
    }
}
```


### 클로저 사용하기 {#using-closures}

애플리케이션 전체에서 사용자 지정 규칙의 기능이 한 번만 필요하다면, 규칙 객체 대신 클로저를 사용할 수 있습니다. 클로저는 속성 이름, 속성 값, 그리고 검증이 실패할 경우 호출해야 하는 `$fail` 콜백을 받습니다:

```php
use Illuminate\Support\Facades\Validator;
use Closure;

$validator = Validator::make($request->all(), [
    'title' => [
        'required',
        'max:255',
        function (string $attribute, mixed $value, Closure $fail) {
            if ($value === 'foo') {
                $fail("The {$attribute} is invalid.");
            }
        },
    ],
]);
```


### 암시적 규칙 {#implicit-rules}

기본적으로, 검증 중인 속성이 존재하지 않거나 빈 문자열을 포함하는 경우, 사용자 지정 규칙을 포함한 일반 검증 규칙은 실행되지 않습니다. 예를 들어, [unique](#rule-unique) 규칙은 빈 문자열에 대해 실행되지 않습니다:

```php
use Illuminate\Support\Facades\Validator;

$rules = ['name' => 'unique:users,name'];

$input = ['name' => ''];

Validator::make($input, $rules)->passes(); // true
```

속성이 비어 있어도 사용자 지정 규칙이 실행되도록 하려면, 해당 규칙이 속성이 필수임을 암시해야 합니다. 새로운 암시적 규칙 객체를 빠르게 생성하려면, `make:rule` Artisan 명령어에 `--implicit` 옵션을 사용할 수 있습니다:

```shell
php artisan make:rule Uppercase --implicit
```

> [!WARNING]
> "암시적" 규칙은 속성이 필수임을 _암시_할 뿐입니다. 실제로 누락되거나 비어 있는 속성을 무효화할지는 여러분에게 달려 있습니다.
