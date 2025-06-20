---
title: 에셋
---
# [핵심개념] 에셋

<LaracastsBanner
    title="플러그인 에셋 등록하기"
    description="Laracasts의 Build Advanced Components for Filament 시리즈를 시청하세요 - 플러그인에 에셋을 등록하는 방법을 배울 수 있습니다. 또는 이 텍스트 기반 가이드를 계속 읽으세요."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/14"
    series="building-advanced-components"
/>

## 개요 {#overview}

Filament 생태계의 모든 패키지는 에셋 관리 시스템을 공유합니다. 이를 통해 공식 플러그인과 서드파티 플러그인 모두 CSS 및 JavaScript 파일을 등록할 수 있으며, 이후 Blade 뷰에서 사용할 수 있습니다.

## `FilamentAsset` 파사드 {#the-filamentasset-facade}

`FilamentAsset` 파사드는 파일을 에셋 시스템에 등록하는 데 사용됩니다. 이 파일들은 파일 시스템 어디에서나 가져올 수 있지만, `php artisan filament:assets` 명령어를 실행하면 애플리케이션의 `/public` 디렉터리로 복사됩니다. 파일을 `/public` 디렉터리로 복사함으로써, Blade 뷰에서 예측 가능하게 로드할 수 있고, 서드파티 패키지들도 파일 위치에 신경 쓰지 않고 에셋을 로드할 수 있습니다.

에셋은 항상 여러분이 선택한 고유한 ID를 가지며, 이 ID는 에셋이 `/public` 디렉터리로 복사될 때 파일 이름으로 사용됩니다. 이 ID는 Blade 뷰에서 에셋을 참조할 때도 사용됩니다. ID는 고유해야 하지만, 플러그인에 대한 에셋을 등록하는 경우에는 에셋이 플러그인 이름의 디렉터리에 복사되므로 다른 플러그인과 ID가 충돌할 걱정은 하지 않아도 됩니다.

`FilamentAsset` 파사드는 서비스 프로바이더의 `boot()` 메소드에서 사용해야 합니다. `AppServiceProvider`와 같은 애플리케이션 서비스 프로바이더나 플러그인 서비스 프로바이더 내에서 사용할 수 있습니다.

`FilamentAsset` 파사드에는 하나의 주요 메소드인 `register()`가 있으며, 등록할 에셋 배열을 인자로 받습니다:

```php
use Filament\Support\Facades\FilamentAsset;

public function boot(): void
{
    // ...
    
    FilamentAsset::register([
        // ...
    ]);
    
    // ...
}
```

### 플러그인에 대한 에셋 등록하기 {#registering-assets-for-a-plugin}

플러그인에 대한 에셋을 등록할 때는 `register()` 메소드의 두 번째 인자로 Composer 패키지 이름을 전달해야 합니다:

```php
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    // ...
], package: 'danharrin/filament-blog');
```

이제 이 플러그인의 모든 에셋은 `/public` 내의 자체 디렉터리에 복사되어, 동일한 이름의 다른 플러그인 파일과 충돌할 가능성을 방지합니다.

## CSS 파일 등록하기 {#registering-css-files}

에셋 시스템에 CSS 파일을 등록하려면, 서비스 프로바이더의 `boot()` 메소드에서 `FilamentAsset::register()` 메소드를 사용하세요. 등록할 각 CSS 파일을 나타내는 `Css` 객체의 배열을 전달해야 합니다.

각 `Css` 객체는 고유한 ID와 CSS 파일의 경로를 가집니다:

```php
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Css::make('custom-stylesheet', __DIR__ . '/../../resources/css/custom.css'),
]);
```

이 예제에서는 `__DIR__`를 사용하여 현재 파일로부터 에셋의 상대 경로를 생성합니다. 예를 들어, 이 코드를 `/app/Providers/AppServiceProvider.php`에 추가한다면, CSS 파일은 `/resources/css/custom.css`에 존재해야 합니다.

이제 `php artisan filament:assets` 명령어를 실행하면 이 CSS 파일이 `/public` 디렉터리로 복사됩니다. 또한 Filament를 사용하는 모든 Blade 뷰에 이 파일이 로드됩니다. 페이지의 특정 요소에서만 CSS가 필요할 때만 로드하고 싶다면, [CSS 지연 로딩](#lazy-loading-css) 섹션을 참고하세요.

### 플러그인에서 Tailwind CSS 사용하기 {#using-tailwind-css-in-plugins}

일반적으로 CSS 파일 등록은 애플리케이션의 커스텀 스타일시트를 등록하는 데 사용됩니다. 이 파일들을 Tailwind CSS로 처리하고 싶다면, 특히 플러그인 개발자라면 그에 따른 사항을 고려해야 합니다.

Tailwind 빌드는 각 애플리케이션마다 고유합니다 - 실제로 사용하는 최소한의 유틸리티 클래스만 포함합니다. 즉, 플러그인 개발자라면 Tailwind CSS 파일을 플러그인에 빌드해서 포함시키지 않는 것이 좋습니다. 대신, 원본 CSS 파일을 제공하고 사용자가 직접 Tailwind CSS 파일을 빌드하도록 안내해야 합니다. 이를 위해서는 사용자가 자신의 `tailwind.config.js` 파일의 `content` 배열에 플러그인 벤더 디렉터리를 추가하면 됩니다:

```js
export default {
    content: [
        './resources/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
        './vendor/danharrin/filament-blog/resources/views/**/*.blade.php', // 플러그인 벤더 디렉터리
    ],
    // ...
}
```

이렇게 하면 사용자가 Tailwind CSS 파일을 빌드할 때, 플러그인 뷰에서 사용하는 모든 유틸리티 클래스와 애플리케이션 및 Filament 코어에서 사용하는 유틸리티 클래스가 모두 포함됩니다.

하지만 이 방법을 사용할 때 [패널 빌더](../panels/getting-started)와 함께 플러그인을 사용하는 사용자에게는 추가적인 문제가 발생할 수 있습니다. [커스텀 테마](../panels/themes)를 사용하는 경우에는 어차피 Tailwind CSS로 직접 CSS 파일을 빌드하므로 문제가 없습니다. 하지만 패널 빌더에 기본 제공되는 스타일시트를 사용하는 경우, 플러그인 뷰에서 사용하는 유틸리티 클래스가 기본 스타일시트에 포함되어 있지 않으면, 사용자가 직접 컴파일하지 않으므로 최종 CSS 파일에 포함되지 않습니다. 이 경우 플러그인 뷰가 예상과 다르게 보일 수 있습니다. 이런 상황에서는 Tailwind CSS로 컴파일된 스타일시트를 플러그인에 [등록](#registering-css-files)하는 것을 권장합니다.

### CSS 지연 로딩 {#lazy-loading-css}

기본적으로 에셋 시스템에 등록된 모든 CSS 파일은 모든 Filament 페이지의 `<head>`에 로드됩니다. 이는 CSS 파일을 로드하는 가장 간단한 방법이지만, 때로는 파일이 무겁거나 모든 페이지에서 필요하지 않을 수 있습니다. 이럴 때는 Filament에 번들로 포함된 [Alpine.js Lazy Load Assets](https://github.com/tanthammar/alpine-lazy-load-assets) 패키지를 활용할 수 있습니다. Alpine.js를 사용하여 CSS 파일을 필요할 때만 쉽게 로드할 수 있습니다. 방법은 매우 간단합니다. 요소에 `x-load-css` 디렉티브를 사용하면, 해당 요소가 페이지에 로드될 때 지정한 CSS 파일이 페이지의 `<head>`에 로드됩니다. 이는 CSS 파일이 필요한 작은 UI 요소나 전체 페이지 모두에 적합합니다:

```blade
<div
    x-data="{}"
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('custom-stylesheet'))]"
>
    <!-- ... -->
</div>
```

CSS 파일이 자동으로 로드되지 않도록 하려면, `loadedOnRequest()` 메소드를 사용할 수 있습니다:

```php
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Css::make('custom-stylesheet', __DIR__ . '/../../resources/css/custom.css')->loadedOnRequest(),
]);
```

CSS 파일이 [플러그인에 등록](#registering-assets-for-a-plugin)된 경우, `FilamentAsset::getStyleHref()` 메소드의 두 번째 인자로 해당 패키지를 전달해야 합니다:

```blade
<div
    x-data="{}"
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('custom-stylesheet', package: 'danharrin/filament-blog'))]"
>
    <!-- ... -->
</div>
```

### URL에서 CSS 파일 등록하기 {#registering-css-files-from-a-url}

URL에서 CSS 파일을 등록하고 싶다면, 가능합니다. 이러한 에셋은 모든 페이지에서 정상적으로 로드되지만, `php artisan filament:assets` 명령어를 실행해도 `/public` 디렉터리로 복사되지는 않습니다. CDN에서 외부 스타일시트나 이미 `/public` 디렉터리에 직접 컴파일하고 있는 스타일시트를 등록할 때 유용합니다:

```php
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Css::make('example-external-stylesheet', 'https://example.com/external.css'),
    Css::make('example-local-stylesheet', asset('css/local.css')),
]);
```

### CSS 변수 등록하기 {#registering-css-variables}

때로는 백엔드의 동적 데이터를 CSS 파일에서 사용하고 싶을 수 있습니다. 이럴 때는 서비스 프로바이더의 `boot()` 메소드에서 `FilamentAsset::registerCssVariables()` 메소드를 사용할 수 있습니다:

```php
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::registerCssVariables([
    'background-image' => asset('images/background.jpg'),
]);
```

이제 모든 CSS 파일에서 이 변수를 사용할 수 있습니다:

```css
background-image: var(--background-image);
```

## JavaScript 파일 등록하기 {#registering-javascript-files}

에셋 시스템에 JavaScript 파일을 등록하려면, 서비스 프로바이더의 `boot()` 메소드에서 `FilamentAsset::register()` 메소드를 사용하세요. 등록할 각 JavaScript 파일을 나타내는 `Js` 객체의 배열을 전달해야 합니다.

각 `Js` 객체는 고유한 ID와 JavaScript 파일의 경로를 가집니다:

```php
use Filament\Support\Assets\Js;

FilamentAsset::register([
    Js::make('custom-script', __DIR__ . '/../../resources/js/custom.js'),
]);
```

이 예제에서는 `__DIR__`를 사용하여 현재 파일로부터 에셋의 상대 경로를 생성합니다. 예를 들어, 이 코드를 `/app/Providers/AppServiceProvider.php`에 추가한다면, JavaScript 파일은 `/resources/js/custom.js`에 존재해야 합니다.

이제 `php artisan filament:assets` 명령어를 실행하면 이 JavaScript 파일이 `/public` 디렉터리로 복사됩니다. 또한 Filament를 사용하는 모든 Blade 뷰에 이 파일이 로드됩니다. 페이지의 특정 요소에서만 JavaScript가 필요할 때만 로드하고 싶다면, [JavaScript 지연 로딩](#lazy-loading-javascript) 섹션을 참고하세요.

### JavaScript 지연 로딩 {#lazy-loading-javascript}

기본적으로 에셋 시스템에 등록된 모든 JavaScript 파일은 모든 Filament 페이지의 하단에 로드됩니다. 이는 JavaScript 파일을 로드하는 가장 간단한 방법이지만, 때로는 파일이 무겁거나 모든 페이지에서 필요하지 않을 수 있습니다. 이럴 때는 Filament에 번들로 포함된 [Alpine.js Lazy Load Assets](https://github.com/tanthammar/alpine-lazy-load-assets) 패키지를 활용할 수 있습니다. Alpine.js를 사용하여 JavaScript 파일을 필요할 때만 쉽게 로드할 수 있습니다. 방법은 매우 간단합니다. 요소에 `x-load-js` 디렉티브를 사용하면, 해당 요소가 페이지에 로드될 때 지정한 JavaScript 파일이 페이지 하단에 로드됩니다. 이는 JavaScript 파일이 필요한 작은 UI 요소나 전체 페이지 모두에 적합합니다:

```blade
<div
    x-data="{}"
    x-load-js="[@js(\Filament\Support\Facades\FilamentAsset::getScriptSrc('custom-script'))]"
>
    <!-- ... -->
</div>
```

JavaScript 파일이 자동으로 로드되지 않도록 하려면, `loadedOnRequest()` 메소드를 사용할 수 있습니다:

```php
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Js::make('custom-script', __DIR__ . '/../../resources/js/custom.js')->loadedOnRequest(),
]);
```

JavaScript 파일이 [플러그인에 등록](#registering-assets-for-a-plugin)된 경우, `FilamentAsset::getScriptSrc()` 메소드의 두 번째 인자로 해당 패키지를 전달해야 합니다:

```blade
<div
    x-data="{}"
    x-load-js="[@js(\Filament\Support\Facades\FilamentAsset::getScriptSrc('custom-script', package: 'danharrin/filament-blog'))]"
>
    <!-- ... -->
</div>
```

#### 비동기 Alpine.js 컴포넌트 {#asynchronous-alpinejs-components}

<LaracastsBanner
    title="비동기 Alpine 컴포넌트 사용하기"
    description="Laracasts의 Build Advanced Components for Filament 시리즈를 시청하세요 - 플러그인에 비동기 Alpine 컴포넌트를 적용하는 방법을 배울 수 있습니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/15"
    series="building-advanced-components"
/>

때로는 Alpine.js 기반 컴포넌트에 외부 JavaScript 라이브러리를 로드하고 싶을 수 있습니다. 가장 좋은 방법은 컴파일된 JavaScript와 Alpine 컴포넌트를 별도의 파일에 저장하고, 컴포넌트가 렌더링될 때마다 해당 파일을 로드하는 것입니다.

먼저, [esbuild](https://esbuild.github.io)를 NPM을 통해 설치해야 합니다. esbuild를 사용하여 외부 라이브러리와 Alpine 컴포넌트가 포함된 단일 JavaScript 파일을 생성할 것입니다:

```bash
npm install esbuild --save-dev
```

그런 다음, JavaScript와 Alpine 컴포넌트를 컴파일하는 스크립트를 만들어야 합니다. 예를 들어 `bin/build.js`에 만들 수 있습니다:

```js
import * as esbuild from 'esbuild'

const isDev = process.argv.includes('--dev')

async function compile(options) {
    const context = await esbuild.context(options)

    if (isDev) {
        await context.watch()
    } else {
        await context.rebuild()
        await context.dispose()
    }
}

const defaultOptions = {
    define: {
        'process.env.NODE_ENV': isDev ? `'development'` : `'production'`,
    },
    bundle: true,
    mainFields: ['module', 'main'],
    platform: 'neutral',
    sourcemap: isDev ? 'inline' : false,
    sourcesContent: isDev,
    treeShaking: true,
    target: ['es2020'],
    minify: !isDev,
    plugins: [{
        name: 'watchPlugin',
        setup: function (build) {
            build.onStart(() => {
                console.log(`Build started at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`)
            })

            build.onEnd((result) => {
                if (result.errors.length > 0) {
                    console.log(`Build failed at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`, result.errors)
                } else {
                    console.log(`Build finished at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`)
                }
            })
        }
    }],
}

compile({
    ...defaultOptions,
    entryPoints: ['./resources/js/components/test-component.js'],
    outfile: './resources/js/dist/components/test-component.js',
})
```

스크립트 하단에서 볼 수 있듯이, `resources/js/components/test-component.js` 파일을 `resources/js/dist/components/test-component.js`로 컴파일하고 있습니다. 필요에 따라 이 경로들을 변경할 수 있습니다. 원하는 만큼 많은 컴포넌트를 컴파일할 수 있습니다.

이제 `resources/js/components/test-component.js`라는 새 파일을 만드세요:

```js
// 여기에서 NPM에서 가져온 외부 JavaScript 라이브러리를 import 하세요.

export default function testComponent({
    state,
}) {
    return {
        state,
        
        // 여기에서 다른 Alpine.js 속성을 정의할 수 있습니다.

        init: function () {
            // 필요하다면 여기에서 Alpine 컴포넌트를 초기화하세요.
        },
        
        // 여기에서 다른 Alpine.js 함수를 정의할 수 있습니다.
    }
}
```

이제 다음 명령어를 실행하여 이 파일을 `resources/js/dist/components/test-component.js`로 컴파일할 수 있습니다:

```bash
node bin/build.js
```

한 번만 컴파일하는 대신 파일 변경을 감시하려면 다음 명령어를 사용하세요:

```bash
node bin/build.js --dev
```

이제 Filament에 이 컴파일된 JavaScript 파일을 Laravel 애플리케이션의 `/public` 디렉터리에 퍼블리시하도록 알려야 합니다. 이를 위해 서비스 프로바이더의 `boot()` 메소드에서 `FilamentAsset::register()` 메소드에 `AlpineComponent` 객체를 전달하세요:

```php
use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    AlpineComponent::make('test-component', __DIR__ . '/../../resources/js/dist/components/test-component.js'),
]);
```

`php artisan filament:assets`를 실행하면 컴파일된 파일이 `/public` 디렉터리로 복사됩니다.

마지막으로, 뷰에서 `x-load` 속성과 `FilamentAsset::getAlpineComponentSrc()` 메소드를 사용하여 이 비동기 Alpine 컴포넌트를 로드할 수 있습니다:

```blade
<div
    x-load
    x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('test-component') }}"
    x-data="testComponent({
        state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
    })"
>
    <input x-model="state" />
</div>
```

이 예제는 [커스텀 폼 필드](../forms/fields/custom)에 대한 것입니다. `state`를 `testComponent()` 함수의 파라미터로 전달하며, 이는 Livewire 컴포넌트 속성과 연결되어 있습니다. 원하는 파라미터를 전달할 수 있으며, `testComponent()` 함수에서 접근할 수 있습니다. 커스텀 폼 필드를 사용하지 않는 경우, 이 예제의 `state` 파라미터는 무시해도 됩니다.

`x-load` 속성은 [Async Alpine](https://async-alpine.dev/docs/strategies) 패키지에서 제공되며, 해당 패키지의 모든 기능을 여기서 사용할 수 있습니다.

### 스크립트 데이터 등록하기 {#registering-script-data}

때로는 백엔드의 데이터를 JavaScript 파일에서 사용할 수 있도록 하고 싶을 수 있습니다. 이럴 때는 서비스 프로바이더의 `boot()` 메소드에서 `FilamentAsset::registerScriptData()` 메소드를 사용할 수 있습니다:

```php
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::registerScriptData([
    'user' => [
        'name' => auth()->user()?->name,
    ],
]);
```

이제 런타임에 모든 JavaScript 파일에서 `window.filamentData` 객체를 통해 해당 데이터에 접근할 수 있습니다:

```js
window.filamentData.user.name // 'Dan Harrin'
```

### URL에서 JavaScript 파일 등록하기 {#registering-javascript-files-from-a-url}

URL에서 JavaScript 파일을 등록하고 싶다면, 가능합니다. 이러한 에셋은 모든 페이지에서 정상적으로 로드되지만, `php artisan filament:assets` 명령어를 실행해도 `/public` 디렉터리로 복사되지는 않습니다. CDN에서 외부 스크립트나 이미 `/public` 디렉터리에 직접 컴파일하고 있는 스크립트를 등록할 때 유용합니다:

```php
use Filament\Support\Assets\Js;

FilamentAsset::register([
    Js::make('example-external-script', 'https://example.com/external.js'),
    Js::make('example-local-script', asset('js/local.js')),
]);
```
