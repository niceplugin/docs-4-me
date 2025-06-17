# 뷰(Views)














## 소개 {#introduction}

물론, 라우트나 컨트롤러에서 전체 HTML 문서 문자열을 직접 반환하는 것은 실용적이지 않습니다. 다행히도, 뷰(View)는 모든 HTML을 별도의 파일에 저장할 수 있는 편리한 방법을 제공합니다.

뷰는 컨트롤러/애플리케이션 로직과 프레젠테이션 로직을 분리하며, `resources/views` 디렉터리에 저장됩니다. Laravel을 사용할 때, 뷰 템플릿은 주로 [Blade 템플릿 언어](/laravel/12.x/blade)를 사용하여 작성합니다. 간단한 뷰는 다음과 같이 생겼을 수 있습니다:

```blade
<!-- resources/views/greeting.blade.php에 저장된 뷰 -->

<html>
    <body>
        <h1>Hello, {{ $name }}</h1>
    </body>
</html>
```

이 뷰가 `resources/views/greeting.blade.php`에 저장되어 있으므로, 전역 `view` 헬퍼를 사용해 다음과 같이 반환할 수 있습니다:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});
```

> [!NOTE]
> Blade 템플릿 작성 방법에 대해 더 알고 싶으신가요? 시작하려면 [Blade 문서](/laravel/12.x/blade)를 참고하세요.


### React / Vue에서 뷰 작성하기 {#writing-views-in-react-or-vue}

많은 개발자들이 PHP의 Blade를 사용해 프론트엔드 템플릿을 작성하는 대신, React나 Vue를 사용해 템플릿을 작성하는 것을 선호하기 시작했습니다. Laravel은 [Inertia](https://inertiajs.com/)라는 라이브러리를 통해 이러한 작업을 매우 쉽게 만들어줍니다. Inertia를 사용하면 복잡한 SPA를 직접 구축하지 않고도 React 또는 Vue 프론트엔드를 Laravel 백엔드와 간편하게 연결할 수 있습니다.

[React 및 Vue 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)는 Inertia를 활용한 새로운 Laravel 애플리케이션을 시작할 때 훌륭한 출발점을 제공합니다.


## 뷰 생성 및 렌더링 {#creating-and-rendering-views}

`.blade.php` 확장자를 가진 파일을 애플리케이션의 `resources/views` 디렉터리에 생성하거나, `make:view` Artisan 명령어를 사용하여 뷰를 만들 수 있습니다:

```shell
php artisan make:view greeting
```

`.blade.php` 확장자는 해당 파일이 [Blade 템플릿](/laravel/12.x/blade)임을 프레임워크에 알립니다. Blade 템플릿은 HTML과 함께 값을 쉽게 출력하고, "if" 문을 만들거나, 데이터를 반복하는 등 다양한 Blade 지시문을 포함할 수 있습니다.

뷰를 생성한 후에는, 애플리케이션의 라우트나 컨트롤러에서 전역 `view` 헬퍼를 사용하여 뷰를 반환할 수 있습니다:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});
```

또는 `View` 파사드를 사용하여 뷰를 반환할 수도 있습니다:

```php
use Illuminate\Support\Facades\View;

return View::make('greeting', ['name' => 'James']);
```

위 예시에서 볼 수 있듯이, `view` 헬퍼의 첫 번째 인자는 `resources/views` 디렉터리 내 뷰 파일의 이름과 일치합니다. 두 번째 인자는 뷰에서 사용할 수 있도록 전달되는 데이터 배열입니다. 이 예시에서는 `name` 변수를 전달하고 있으며, 이는 [Blade 문법](/laravel/12.x/blade)을 사용해 뷰에서 표시됩니다.


### 중첩된 뷰 디렉터리 {#nested-view-directories}

뷰는 `resources/views` 디렉터리의 하위 디렉터리에도 중첩하여 저장할 수 있습니다. 중첩된 뷰를 참조할 때는 "점(.) 표기법"을 사용할 수 있습니다. 예를 들어, 뷰 파일이 `resources/views/admin/profile.blade.php`에 저장되어 있다면, 애플리케이션의 라우트나 컨트롤러에서 다음과 같이 반환할 수 있습니다:

```php
return view('admin.profile', $data);
```

> [!WARNING]
> 뷰 디렉터리 이름에는 `.` 문자를 사용하지 않아야 합니다.


### 첫 번째 사용 가능한 뷰 생성 {#creating-the-first-available-view}

`View` 파사드의 `first` 메서드를 사용하면, 주어진 뷰 배열 중에서 가장 먼저 존재하는 뷰를 생성할 수 있습니다. 이 기능은 애플리케이션이나 패키지에서 뷰를 커스터마이즈하거나 덮어쓸 수 있도록 허용할 때 유용합니다:

```php
use Illuminate\Support\Facades\View;

return View::first(['custom.admin', 'admin'], $data);
```


### 뷰가 존재하는지 확인하기 {#determining-if-a-view-exists}

뷰가 존재하는지 확인해야 할 경우, `View` 파사드를 사용할 수 있습니다. `exists` 메서드는 해당 뷰가 존재하면 `true`를 반환합니다:

```php
use Illuminate\Support\Facades\View;

if (View::exists('admin.profile')) {
    // ...
}
```


## 뷰에 데이터 전달하기 {#passing-data-to-views}

앞선 예제에서 보았듯이, 뷰에 데이터를 전달하여 해당 데이터를 뷰에서 사용할 수 있습니다:

```php
return view('greetings', ['name' => 'Victoria']);
```

이와 같이 정보를 전달할 때, 데이터는 키/값 쌍으로 이루어진 배열이어야 합니다. 뷰에 데이터를 제공한 후에는, 뷰 내에서 해당 데이터의 키를 사용하여 각 값을 접근할 수 있습니다. 예를 들어 `<?php echo $name; ?>`와 같이 사용할 수 있습니다.

`view` 헬퍼 함수에 전체 데이터 배열을 전달하는 대신, `with` 메서드를 사용하여 개별 데이터를 뷰에 추가할 수도 있습니다. `with` 메서드는 뷰 객체의 인스턴스를 반환하므로, 뷰를 반환하기 전에 메서드 체이닝을 계속할 수 있습니다:

```php
return view('greeting')
    ->with('name', 'Victoria')
    ->with('occupation', 'Astronaut');
```


### 모든 뷰에 데이터 공유하기 {#sharing-data-with-all-views}

가끔 애플리케이션에서 렌더링되는 모든 뷰에 데이터를 공유해야 할 때가 있습니다. 이럴 때는 `View` 파사드의 `share` 메서드를 사용할 수 있습니다. 일반적으로 `share` 메서드 호출은 서비스 프로바이더의 `boot` 메서드 안에 두는 것이 좋습니다. `App\Providers\AppServiceProvider` 클래스에 추가해도 되고, 별도의 서비스 프로바이더를 생성해서 관리해도 됩니다.

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 등록합니다.
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        View::share('key', 'value');
    }
}
```


## 뷰 컴포저 {#view-composers}

뷰 컴포저(View Composer)는 뷰가 렌더링될 때 호출되는 콜백 또는 클래스 메서드입니다. 만약 특정 뷰가 렌더링될 때마다 항상 바인딩되어야 하는 데이터가 있다면, 뷰 컴포저를 사용해 해당 로직을 한 곳에 정리할 수 있습니다. 뷰 컴포저는 동일한 뷰가 여러 라우트나 컨트롤러에서 반환되며, 항상 특정 데이터를 필요로 할 때 특히 유용합니다.

일반적으로 뷰 컴포저는 애플리케이션의 [서비스 프로바이더](/laravel/12.x/providers) 중 하나에 등록합니다. 이 예제에서는 `App\Providers\AppServiceProvider`에 해당 로직이 포함된다고 가정하겠습니다.

뷰 컴포저를 등록하기 위해 `View` 파사드의 `composer` 메서드를 사용합니다. Laravel은 클래스 기반 뷰 컴포저를 위한 기본 디렉터리를 제공하지 않으므로, 원하는 방식으로 자유롭게 구성할 수 있습니다. 예를 들어, 모든 뷰 컴포저를 보관할 `app/View/Composers` 디렉터리를 생성할 수 있습니다.

```php
<?php

namespace App\Providers;

use App\View\Composers\ProfileComposer;
use Illuminate\Support\Facades;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 등록
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스 부트스트랩
     */
    public function boot(): void
    {
        // 클래스 기반 컴포저 사용 예시...
        Facades\View::composer('profile', ProfileComposer::class);

        // 클로저 기반 컴포저 사용 예시...
        Facades\View::composer('welcome', function (View $view) {
            // ...
        });

        Facades\View::composer('dashboard', function (View $view) {
            // ...
        });
    }
}
```

이제 컴포저가 등록되었으므로, `profile` 뷰가 렌더링될 때마다 `App\View\Composers\ProfileComposer` 클래스의 `compose` 메서드가 실행됩니다. 아래는 컴포저 클래스의 예시입니다.

```php
<?php

namespace App\View\Composers;

use App\Repositories\UserRepository;
use Illuminate\View\View;

class ProfileComposer
{
    /**
     * 새로운 프로필 컴포저 인스턴스 생성자
     */
    public function __construct(
        protected UserRepository $users,
    ) {}

    /**
     * 뷰에 데이터 바인딩
     */
    public function compose(View $view): void
    {
        $view->with('count', $this->users->count());
    }
}
```

보시다시피, 모든 뷰 컴포저는 [서비스 컨테이너](/laravel/12.x/container)를 통해 해석되므로, 컴포저의 생성자에서 필요한 의존성을 타입힌트로 지정할 수 있습니다.


#### 여러 뷰에 Composer 연결하기 {#attaching-a-composer-to-multiple-views}

`composer` 메서드의 첫 번째 인자로 뷰 이름의 배열을 전달하면, 여러 뷰에 동시에 뷰 컴포저를 연결할 수 있습니다:

```php
use App\Views\Composers\MultiComposer;
use Illuminate\Support\Facades\View;

View::composer(
    ['profile', 'dashboard'],
    MultiComposer::class
);
```

또한, `composer` 메서드는 `*` 문자를 와일드카드로 허용하므로, 모든 뷰에 컴포저를 연결할 수도 있습니다:

```php
use Illuminate\Support\Facades;
use Illuminate\View\View;

Facades\View::composer('*', function (View $view) {
    // ...
});
```


### 뷰 크리에이터 {#view-creators}

뷰 "크리에이터"는 뷰 컴포저와 매우 유사하지만, 뷰가 렌더링되기 직전이 아니라 뷰가 인스턴스화된 직후에 바로 실행된다는 점이 다릅니다. 뷰 크리에이터를 등록하려면 `creator` 메서드를 사용하세요:

```php
use App\View\Creators\ProfileCreator;
use Illuminate\Support\Facades\View;

View::creator('profile', ProfileCreator::class);
```


## 뷰 최적화 {#optimizing-views}

기본적으로 Blade 템플릿 뷰는 필요할 때마다 컴파일됩니다. 뷰를 렌더링하는 요청이 실행되면, Laravel은 해당 뷰의 컴파일된 버전이 존재하는지 확인합니다. 파일이 존재하면, Laravel은 컴파일되지 않은 뷰가 컴파일된 뷰보다 더 최근에 수정되었는지도 확인합니다. 만약 컴파일된 뷰가 존재하지 않거나, 컴파일되지 않은 뷰가 수정된 경우 Laravel은 뷰를 다시 컴파일합니다.

요청 중에 뷰를 컴파일하면 성능에 약간의 부정적인 영향이 있을 수 있으므로, Laravel은 애플리케이션에서 사용하는 모든 뷰를 미리 컴파일할 수 있는 `view:cache` Artisan 명령어를 제공합니다. 성능 향상을 위해 이 명령어를 배포 과정의 일부로 실행하는 것이 좋습니다:

```shell
php artisan view:cache
```

뷰 캐시를 비우려면 `view:clear` 명령어를 사용할 수 있습니다:

```shell
php artisan view:clear
```
