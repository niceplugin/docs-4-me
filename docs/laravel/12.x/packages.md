# 패키지 개발



















## 소개 {#introduction}

패키지는 Laravel에 기능을 추가하는 주요 방법입니다. 패키지는 [Carbon](https://github.com/briannesbitt/Carbon)처럼 날짜를 다루는 훌륭한 방법이 될 수도 있고, Spatie의 [Laravel Media Library](https://github.com/spatie/laravel-medialibrary)처럼 Eloquent 모델에 파일을 연결할 수 있게 해주는 패키지일 수도 있습니다.

패키지에는 여러 종류가 있습니다. 일부 패키지는 독립형으로, 어떤 PHP 프레임워크와도 함께 동작합니다. Carbon과 Pest가 독립형 패키지의 예입니다. 이러한 패키지들은 `composer.json` 파일에 추가하여 Laravel에서 사용할 수 있습니다.

반면, 다른 패키지들은 Laravel에서 사용하도록 특별히 설계되었습니다. 이러한 패키지들은 라우트, 컨트롤러, 뷰, 설정 등을 포함하여 Laravel 애플리케이션을 확장하도록 만들어졌습니다. 이 가이드는 주로 Laravel에 특화된 패키지 개발에 대해 다룹니다.


### 파사드에 대한 참고 {#a-note-on-facades}

Laravel 애플리케이션을 작성할 때는 계약(contracts)이나 파사드(facades) 중 무엇을 사용해도 테스트 가능성 측면에서 큰 차이가 없습니다. 하지만 패키지를 작성할 때는 Laravel의 모든 테스트 헬퍼에 접근할 수 없는 경우가 많습니다. 패키지 테스트를 일반적인 Laravel 애플리케이션에 설치된 것처럼 작성하고 싶다면 [Orchestral Testbench](https://github.com/orchestral/testbench) 패키지를 사용할 수 있습니다.


## 패키지 자동 등록 {#package-discovery}

Laravel 애플리케이션의 `bootstrap/providers.php` 파일에는 Laravel이 로드해야 할 서비스 프로바이더 목록이 들어 있습니다. 하지만 사용자가 직접 서비스 프로바이더를 목록에 추가하지 않도록, 패키지의 `composer.json` 파일의 `extra` 섹션에 프로바이더를 정의하면 Laravel이 자동으로 로드합니다. 서비스 프로바이더 외에도 등록하고 싶은 [파사드](/laravel/12.x/facades)도 함께 지정할 수 있습니다:

```json
"extra": {
    "laravel": {
        "providers": [
            "Barryvdh\\Debugbar\\ServiceProvider"
        ],
        "aliases": {
            "Debugbar": "Barryvdh\\Debugbar\\Facade"
        }
    }
},
```

패키지가 자동 등록에 맞게 설정되면, Laravel은 패키지가 설치될 때 서비스 프로바이더와 파사드를 자동으로 등록하여 사용자에게 편리한 설치 경험을 제공합니다.


#### 패키지 자동 등록 비활성화 {#opting-out-of-package-discovery}

패키지 사용자가 패키지 자동 등록을 비활성화하고 싶다면, 애플리케이션의 `composer.json` 파일의 `extra` 섹션에 패키지 이름을 나열하면 됩니다:

```json
"extra": {
    "laravel": {
        "dont-discover": [
            "barryvdh/laravel-debugbar"
        ]
    }
},
```

애플리케이션의 `dont-discover` 지시문에 `*` 문자를 사용하면 모든 패키지의 자동 등록을 비활성화할 수 있습니다:

```json
"extra": {
    "laravel": {
        "dont-discover": [
            "*"
        ]
    }
},
```


## 서비스 프로바이더 {#service-providers}

[서비스 프로바이더](/laravel/12.x/providers)는 패키지와 Laravel을 연결하는 지점입니다. 서비스 프로바이더는 Laravel의 [서비스 컨테이너](/laravel/12.x/container)에 바인딩을 추가하고, 뷰, 설정, 언어 파일 등 패키지 리소스의 위치를 Laravel에 알리는 역할을 합니다.

서비스 프로바이더는 `Illuminate\Support\ServiceProvider` 클래스를 확장하며, `register`와 `boot` 두 가지 메서드를 가집니다. 기본 `ServiceProvider` 클래스는 `illuminate/support` Composer 패키지에 포함되어 있으므로, 패키지의 의존성에 추가해야 합니다. 서비스 프로바이더의 구조와 목적에 대해 더 알고 싶다면 [관련 문서](/laravel/12.x/providers)를 참고하세요.


## 리소스 {#resources}


### 설정 {#configuration}

일반적으로 패키지의 설정 파일을 애플리케이션의 `config` 디렉터리에 퍼블리시해야 합니다. 이를 통해 패키지 사용자가 기본 설정 옵션을 쉽게 오버라이드할 수 있습니다. 설정 파일을 퍼블리시할 수 있도록 하려면, 서비스 프로바이더의 `boot` 메서드에서 `publishes` 메서드를 호출하세요:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->publishes([
        __DIR__.'/../config/courier.php' => config_path('courier.php'),
    ]);
}
```

이제 패키지 사용자가 Laravel의 `vendor:publish` 명령어를 실행하면, 파일이 지정된 위치로 복사됩니다. 설정이 퍼블리시된 후에는 다른 설정 파일과 마찬가지로 값을 접근할 수 있습니다:

```php
$value = config('courier.option');
```

> [!WARNING]
> 설정 파일에 클로저를 정의하지 마세요. 사용자가 `config:cache` 아티즌 명령어를 실행할 때 올바르게 직렬화되지 않습니다.


#### 기본 패키지 설정 {#default-package-configuration}

패키지의 설정 파일을 애플리케이션에 퍼블리시된 복사본과 병합할 수도 있습니다. 이를 통해 사용자는 오버라이드하고 싶은 옵션만 설정 파일에 정의할 수 있습니다. 설정 파일 값을 병합하려면, 서비스 프로바이더의 `register` 메서드에서 `mergeConfigFrom` 메서드를 사용하세요.

`mergeConfigFrom` 메서드는 첫 번째 인자로 패키지의 설정 파일 경로, 두 번째 인자로 애플리케이션 설정 파일 이름을 받습니다:

```php
/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    $this->mergeConfigFrom(
        __DIR__.'/../config/courier.php', 'courier'
    );
}
```

> [!WARNING]
> 이 메서드는 설정 배열의 1단계만 병합합니다. 사용자가 다차원 배열의 일부만 정의하면, 누락된 옵션은 병합되지 않습니다.


### 라우트 {#routes}

패키지에 라우트가 포함되어 있다면, `loadRoutesFrom` 메서드를 사용해 로드할 수 있습니다. 이 메서드는 애플리케이션의 라우트가 캐시되어 있는지 자동으로 확인하며, 이미 캐시된 경우 라우트 파일을 로드하지 않습니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
}
```


### 마이그레이션 {#migrations}

패키지에 [데이터베이스 마이그레이션](/laravel/12.x/migrations)이 포함되어 있다면, `publishesMigrations` 메서드를 사용해 해당 디렉터리나 파일에 마이그레이션이 있음을 Laravel에 알릴 수 있습니다. Laravel이 마이그레이션을 퍼블리시할 때, 파일명에 있는 타임스탬프를 현재 날짜와 시간으로 자동으로 업데이트합니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->publishesMigrations([
        __DIR__.'/../database/migrations' => database_path('migrations'),
    ]);
}
```


### 언어 파일 {#language-files}

패키지에 [언어 파일](/laravel/12.x/localization)이 포함되어 있다면, `loadTranslationsFrom` 메서드를 사용해 Laravel에 로드 방법을 알릴 수 있습니다. 예를 들어, 패키지 이름이 `courier`라면 서비스 프로바이더의 `boot` 메서드에 다음을 추가하세요:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->loadTranslationsFrom(__DIR__.'/../lang', 'courier');
}
```

패키지 번역 라인은 `package::file.line` 문법을 사용해 참조합니다. 예를 들어, `courier` 패키지의 `messages` 파일에서 `welcome` 라인을 로드하려면 다음과 같이 할 수 있습니다:

```php
echo trans('courier::messages.welcome');
```

패키지의 JSON 번역 파일을 등록하려면 `loadJsonTranslationsFrom` 메서드를 사용하세요. 이 메서드는 패키지의 JSON 번역 파일이 들어 있는 디렉터리 경로를 받습니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->loadJsonTranslationsFrom(__DIR__.'/../lang');
}
```


#### 언어 파일 퍼블리싱 {#publishing-language-files}

패키지의 언어 파일을 애플리케이션의 `lang/vendor` 디렉터리에 퍼블리시하고 싶다면, 서비스 프로바이더의 `publishes` 메서드를 사용할 수 있습니다. `publishes` 메서드는 패키지 경로와 퍼블리시 위치의 배열을 받습니다. 예를 들어, `courier` 패키지의 언어 파일을 퍼블리시하려면 다음과 같이 할 수 있습니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->loadTranslationsFrom(__DIR__.'/../lang', 'courier');

    $this->publishes([
        __DIR__.'/../lang' => $this->app->langPath('vendor/courier'),
    ]);
}
```

이제 패키지 사용자가 Laravel의 `vendor:publish` 아티즌 명령어를 실행하면, 패키지의 언어 파일이 지정된 위치로 퍼블리시됩니다.


### 뷰 {#views}

패키지의 [뷰](/laravel/12.x/views)를 Laravel에 등록하려면, 뷰가 어디에 있는지 Laravel에 알려야 합니다. 서비스 프로바이더의 `loadViewsFrom` 메서드를 사용하면 됩니다. 이 메서드는 뷰 템플릿 경로와 패키지 이름, 두 가지 인자를 받습니다. 예를 들어, 패키지 이름이 `courier`라면 서비스 프로바이더의 `boot` 메서드에 다음을 추가하세요:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->loadViewsFrom(__DIR__.'/../resources/views', 'courier');
}
```

패키지 뷰는 `package::view` 문법으로 참조합니다. 뷰 경로가 서비스 프로바이더에 등록되면, `courier` 패키지의 `dashboard` 뷰를 다음과 같이 로드할 수 있습니다:

```php
Route::get('/dashboard', function () {
    return view('courier::dashboard');
});
```


#### 패키지 뷰 오버라이드 {#overriding-package-views}

`loadViewsFrom` 메서드를 사용하면, Laravel은 실제로 두 위치에서 뷰를 찾습니다: 애플리케이션의 `resources/views/vendor` 디렉터리와 지정한 디렉터리입니다. 예를 들어, `courier` 패키지의 경우, Laravel은 먼저 개발자가 `resources/views/vendor/courier` 디렉터리에 커스텀 뷰를 넣었는지 확인합니다. 커스텀 뷰가 없다면, `loadViewsFrom`에 지정한 패키지 뷰 디렉터리에서 뷰를 찾습니다. 이를 통해 패키지 사용자는 패키지의 뷰를 쉽게 커스터마이즈/오버라이드할 수 있습니다.


#### 뷰 퍼블리싱 {#publishing-views}

패키지의 뷰를 애플리케이션의 `resources/views/vendor` 디렉터리에 퍼블리시하고 싶다면, 서비스 프로바이더의 `publishes` 메서드를 사용할 수 있습니다. `publishes` 메서드는 패키지 뷰 경로와 퍼블리시 위치의 배열을 받습니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->loadViewsFrom(__DIR__.'/../resources/views', 'courier');

    $this->publishes([
        __DIR__.'/../resources/views' => resource_path('views/vendor/courier'),
    ]);
}
```

이제 패키지 사용자가 Laravel의 `vendor:publish` 아티즌 명령어를 실행하면, 패키지의 뷰가 지정된 위치로 복사됩니다.


### 뷰 컴포넌트 {#view-components}

Blade 컴포넌트를 사용하는 패키지를 만들거나, 비표준 디렉터리에 컴포넌트를 배치하는 경우, 컴포넌트 클래스와 HTML 태그 별칭을 수동으로 등록해야 Laravel이 컴포넌트 위치를 알 수 있습니다. 일반적으로 패키지 서비스 프로바이더의 `boot` 메서드에서 컴포넌트를 등록합니다:

```php
use Illuminate\Support\Facades\Blade;
use VendorPackage\View\Components\AlertComponent;

/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::component('package-alert', AlertComponent::class);
}
```

컴포넌트가 등록되면, 태그 별칭을 사용해 렌더링할 수 있습니다:

```blade
<x-package-alert/>
```


#### 패키지 컴포넌트 자동 로딩 {#autoloading-package-components}

또는, `componentNamespace` 메서드를 사용해 컴포넌트 클래스를 관례적으로 자동 로딩할 수 있습니다. 예를 들어, `Nightshade` 패키지에 `Nightshade\Views\Components` 네임스페이스 아래 `Calendar`와 `ColorPicker` 컴포넌트가 있다고 가정해봅시다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
}
```

이렇게 하면, `package-name::` 문법을 사용해 벤더 네임스페이스로 패키지 컴포넌트를 사용할 수 있습니다:

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

Blade는 컴포넌트 이름을 파스칼 케이스로 변환해 자동으로 연결된 클래스를 감지합니다. "dot" 표기법을 사용해 하위 디렉터리도 지원합니다.


#### 익명 컴포넌트 {#anonymous-components}

패키지에 익명 컴포넌트가 포함되어 있다면, 반드시 패키지의 "views" 디렉터리(즉, [loadViewsFrom 메서드](#views)로 지정한 디렉터리)의 `components` 하위 디렉터리에 위치해야 합니다. 그런 다음, 컴포넌트 이름 앞에 패키지 뷰 네임스페이스를 붙여 렌더링할 수 있습니다:

```blade
<x-courier::alert />
```


### "About" 아티즌 명령어 {#about-artisan-command}

Laravel의 내장 `about` 아티즌 명령어는 애플리케이션 환경과 설정에 대한 요약 정보를 제공합니다. 패키지는 `AboutCommand` 클래스를 통해 이 명령어의 출력에 추가 정보를 표시할 수 있습니다. 일반적으로 이 정보는 패키지 서비스 프로바이더의 `boot` 메서드에서 추가합니다:

```php
use Illuminate\Foundation\Console\AboutCommand;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    AboutCommand::add('My Package', fn () => ['Version' => '1.0.0']);
}
```


## 명령어 {#commands}

패키지의 아티즌 명령어를 Laravel에 등록하려면, `commands` 메서드를 사용할 수 있습니다. 이 메서드는 명령어 클래스 이름의 배열을 받습니다. 명령어가 등록되면, [Artisan CLI](/laravel/12.x/artisan)를 통해 실행할 수 있습니다:

```php
use Courier\Console\Commands\InstallCommand;
use Courier\Console\Commands\NetworkCommand;

/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    if ($this->app->runningInConsole()) {
        $this->commands([
            InstallCommand::class,
            NetworkCommand::class,
        ]);
    }
}
```


### 최적화 명령어 {#optimize-commands}

Laravel의 [optimize 명령어](/laravel/12.x/deployment#optimization)는 애플리케이션의 설정, 이벤트, 라우트, 뷰를 캐시합니다. `optimizes` 메서드를 사용해, `optimize` 및 `optimize:clear` 명령어가 실행될 때 호출되어야 하는 패키지의 아티즌 명령어를 등록할 수 있습니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    if ($this->app->runningInConsole()) {
        $this->optimizes(
            optimize: 'package:optimize',
            clear: 'package:clear-optimizations',
        );
    }
}
```


## 퍼블릭 에셋 {#public-assets}

패키지에 JavaScript, CSS, 이미지와 같은 에셋이 있을 수 있습니다. 이러한 에셋을 애플리케이션의 `public` 디렉터리에 퍼블리시하려면, 서비스 프로바이더의 `publishes` 메서드를 사용하세요. 이 예제에서는 관련 에셋을 쉽게 퍼블리시할 수 있도록 `public` 에셋 그룹 태그도 추가합니다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->publishes([
        __DIR__.'/../public' => public_path('vendor/courier'),
    ], 'public');
}
```

이제 패키지 사용자가 `vendor:publish` 명령어를 실행하면, 에셋이 지정된 위치로 복사됩니다. 패키지 업데이트 시마다 에셋을 덮어써야 할 경우가 많으므로, `--force` 플래그를 사용할 수 있습니다:

```shell
php artisan vendor:publish --tag=public --force
```


## 파일 그룹 퍼블리싱 {#publishing-file-groups}

패키지의 에셋과 리소스를 그룹별로 따로 퍼블리시하고 싶을 수 있습니다. 예를 들어, 사용자가 패키지의 설정 파일만 퍼블리시하고 에셋은 퍼블리시하지 않도록 하고 싶을 수 있습니다. 이를 위해 패키지 서비스 프로바이더의 `publishes` 메서드 호출 시 "태그"를 지정해 그룹을 만들 수 있습니다. 예를 들어, `courier` 패키지에 대해 `courier-config`와 `courier-migrations` 두 개의 퍼블리시 그룹을 `boot` 메서드에서 정의해봅시다:

```php
/**
 * 패키지 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    $this->publishes([
        __DIR__.'/../config/package.php' => config_path('package.php')
    ], 'courier-config');

    $this->publishesMigrations([
        __DIR__.'/../database/migrations/' => database_path('migrations')
    ], 'courier-migrations');
}
```

이제 사용자는 `vendor:publish` 명령어 실행 시 태그를 지정해 각 그룹을 따로 퍼블리시할 수 있습니다:

```shell
php artisan vendor:publish --tag=courier-config
```

또한, `--provider` 플래그를 사용해 패키지 서비스 프로바이더에서 정의한 모든 퍼블리시 가능한 파일을 한 번에 퍼블리시할 수도 있습니다:

```shell
php artisan vendor:publish --provider="Your\Package\ServiceProvider"
```
