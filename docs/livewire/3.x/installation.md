# 설치
Livewire는 Laravel 패키지이므로, Livewire를 설치하고 사용하려면 먼저 Laravel 애플리케이션이 실행 중이어야 합니다. 새로운 Laravel 애플리케이션을 설정하는 데 도움이 필요하다면 [공식 Laravel 문서](https://laravel.com/docs/installation)를 참고하세요.

Livewire를 설치하려면, 터미널을 열고 Laravel 애플리케이션 디렉터리로 이동한 다음, 아래 명령어를 실행하세요:
```shell
composer require livewire/livewire
```

정말 이게 전부입니다. 더 많은 커스터마이징 옵션이 필요하다면 계속 읽으세요. 그렇지 않으면 바로 Livewire 사용을 시작할 수 있습니다.

> [!warning] `/livewire/livewire.js`가 404 상태 코드를 반환하는 경우
> 기본적으로 Livewire는 애플리케이션에 JavaScript 에셋을 제공하기 위해 `/livewire/livewire.js` 경로에 라우트를 노출합니다. 대부분의 애플리케이션에서는 문제가 없지만, Nginx를 커스텀 설정으로 사용하는 경우 이 엔드포인트에서 404 오류가 발생할 수 있습니다. 이 문제를 해결하려면 [Livewire의 JavaScript 에셋을 직접 번들링](#manually-bundling-livewire-and-alpine)하거나, [Nginx를 이 경로를 허용하도록 설정](https://benjamincrozat.com/livewire-js-404-not-found)하면 됩니다.

## 설정 파일 퍼블리싱하기 {#publishing-the-configuration-file}

Livewire는 "제로-설정(zero-config)" 방식이므로, 별도의 추가 설정 없이 관례를 따르면 바로 사용할 수 있습니다. 그러나 필요하다면 아래의 Artisan 명령어를 실행하여 Livewire의 설정 파일을 퍼블리시하고 커스터마이즈할 수 있습니다:

```shell
php artisan livewire:publish --config
```

이 명령어를 실행하면 Laravel 애플리케이션의 `config` 디렉터리에 새로운 `livewire.php` 파일이 생성됩니다.

## Livewire 프론트엔드 에셋 수동 포함하기 {#manually-including-livewires-frontend-assets}

기본적으로 Livewire는 Livewire 컴포넌트가 포함된 각 페이지에 필요한 JavaScript 및 CSS 에셋을 자동으로 삽입합니다.

이 동작을 더 세밀하게 제어하고 싶다면, 아래 Blade 디렉티브를 사용하여 페이지에 에셋을 수동으로 포함할 수 있습니다:

```blade
<html>
<head>
	...
	@livewireStyles
</head>
<body>
	...
	@livewireScripts
</body>
</html>
```

이렇게 에셋을 페이지에 수동으로 포함하면, Livewire는 에셋을 자동으로 삽입하지 않습니다.

> [!warning] AlpineJS는 Livewire에 번들되어 있습니다
> Alpine은 Livewire의 JavaScript 에셋에 번들되어 있으므로, Alpine을 사용하려는 모든 페이지에 @verbatim`@livewireScripts`@endverbatim를 반드시 포함해야 합니다. 해당 페이지에서 Livewire를 사용하지 않더라도 마찬가지입니다.

거의 필요하지는 않지만, 애플리케이션의 `config/livewire.php` 파일에서 `inject_assets` [설정 옵션](#publishing-the-configuration-file)을 업데이트하여 Livewire의 자동 에셋 삽입 동작을 비활성화할 수 있습니다:

```php
'inject_assets' => false,
```

특정 페이지 또는 여러 페이지에서 Livewire가 에셋을 강제로 삽입하도록 하려면, 현재 라우트나 서비스 프로바이더에서 아래의 글로벌 메서드를 호출할 수 있습니다.

```php
\Livewire\Livewire::forceAssetInjection();
```

## Livewire의 업데이트 엔드포인트 설정하기 {#configuring-livewires-update-endpoint}

Livewire 컴포넌트의 모든 업데이트는 다음 엔드포인트로 서버에 네트워크 요청을 보냅니다: `https://example.com/livewire/update`

이것은 로컬라이제이션이나 멀티 테넌시를 사용하는 일부 애플리케이션에서는 문제가 될 수 있습니다.

이런 경우, 원하는 방식으로 직접 엔드포인트를 등록할 수 있으며, `Livewire::setUpdateRoute()` 내부에서만 등록하면 Livewire는 모든 컴포넌트 업데이트에 이 엔드포인트를 사용하게 됩니다:

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/custom/livewire/update', $handle);
});
```

이제 `/livewire/update` 대신, Livewire는 컴포넌트 업데이트를 `/custom/livewire/update`로 전송합니다.

Livewire는 자체 업데이트 라우트를 등록할 수 있도록 허용하므로, `setUpdateRoute()` 내부에서 Livewire가 사용할 추가 미들웨어를 직접 선언할 수 있습니다:

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/custom/livewire/update', $handle)
        ->middleware([...]); // [!code highlight]
});
```

## 에셋 URL 커스터마이징하기 {#customizing-the-asset-url}

기본적으로 Livewire는 다음 URL에서 JavaScript 에셋을 제공합니다: `https://example.com/livewire/livewire.js`. 또한, Livewire는 아래와 같이 script 태그에서 이 에셋을 참조합니다:

```blade
<script src="/livewire/livewire.js" ...
```

애플리케이션이 로컬라이제이션이나 멀티 테넌시로 인해 전역 라우트 프리픽스를 사용하는 경우, Livewire가 내부적으로 JavaScript를 가져올 때 사용할 엔드포인트를 직접 등록할 수 있습니다.

커스텀 JavaScript 에셋 엔드포인트를 사용하려면, `Livewire::setScriptRoute()` 내부에 직접 라우트를 등록할 수 있습니다:

```php
Livewire::setScriptRoute(function ($handle) {
    return Route::get('/custom/livewire/livewire.js', $handle);
});
```

이제 Livewire는 아래와 같이 JavaScript를 로드합니다:

```blade
<script src="/custom/livewire/livewire.js" ...
```

## Livewire와 Alpine 수동 번들링하기 {#manually-bundling-livewire-and-alpine}

기본적으로 Alpine과 Livewire는 `<script src="livewire.js">` 태그를 사용해 로드되므로, 이 라이브러리들이 로드되는 순서를 제어할 수 없습니다. 그 결과, 아래 예시처럼 Alpine 플러그인을 임포트하고 등록하는 것이 더 이상 동작하지 않습니다:

```js
// 경고: 이 코드는 "하지 말아야 할" 예시입니다...

import Alpine from 'alpinejs'
import Clipboard from '@ryangjchandler/alpine-clipboard'

Alpine.plugin(Clipboard)
Alpine.start()
```

이 문제를 해결하려면, Livewire에 ESM(ECMAScript 모듈) 버전을 직접 사용하겠다고 알리고, `livewire.js` 스크립트 태그의 삽입을 방지해야 합니다. 이를 위해 레이아웃 파일(`resources/views/components/layouts/app.blade.php`)에 `@livewireScriptConfig` 디렉티브를 추가해야 합니다:

```blade
<html>
<head>
    <!-- ... -->
    @livewireStyles
    @vite(['resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    @livewireScriptConfig <!-- [!code highlight] -->
</body>
</html>
```

Livewire가 `@livewireScriptConfig` 디렉티브를 감지하면, Livewire와 Alpine 스크립트의 삽입을 중단합니다. `@livewireScripts` 디렉티브를 사용해 Livewire를 수동으로 로드하고 있다면 반드시 제거하세요. `@livewireStyles` 디렉티브가 없다면 꼭 추가하세요.

마지막 단계는 `app.js` 파일에서 Alpine과 Livewire를 임포트하고, 커스텀 리소스를 등록한 뒤, Livewire와 Alpine을 시작하는 것입니다:

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import Clipboard from '@ryangjchandler/alpine-clipboard'

Alpine.plugin(Clipboard)

Livewire.start()
```

> [!tip] composer update 후 에셋을 다시 빌드하세요
> Livewire와 Alpine을 수동으로 번들링하는 경우, `composer update`를 실행할 때마다 반드시 에셋을 다시 빌드해야 합니다.

> [!warning] Laravel Mix와 호환되지 않음
> Livewire와 AlpineJS를 수동으로 번들링하는 경우 Laravel Mix는 동작하지 않습니다. 대신 [Vite로 전환](https://laravel.com/docs/vite)하는 것을 권장합니다.

## Livewire 프론트엔드 에셋 퍼블리싱하기 {#publishing-livewires-frontend-assets}

> [!warning] 에셋 퍼블리싱은 필수가 아닙니다
> Livewire가 동작하는 데 에셋 퍼블리싱은 필요하지 않습니다. 특별한 필요가 있을 때만 이 작업을 하세요.

JavaScript 에셋을 Laravel이 아닌 웹 서버에서 직접 제공하고 싶다면, `livewire:publish` 명령어를 사용하세요:

```bash
php artisan livewire:publish --assets
```

에셋을 최신 상태로 유지하고, 향후 업데이트 시 문제를 방지하려면 composer.json 파일에 아래 명령어를 추가하는 것을 강력히 권장합니다:

```json
{
    "scripts": {
        "post-update-cmd": [
            // 다른 스크립트
            "@php artisan vendor:publish --tag=livewire:assets --ansi --force"
        ]
    }
}
```

