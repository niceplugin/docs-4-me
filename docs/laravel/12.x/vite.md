# 에셋 번들링 (Vite)

































## 소개 {#introduction}

[Vite](https://vitejs.dev)는 매우 빠른 개발 환경을 제공하고, 프로덕션용으로 코드를 번들링해주는 최신 프론트엔드 빌드 도구입니다. Laravel로 애플리케이션을 개발할 때, 일반적으로 Vite를 사용하여 애플리케이션의 CSS와 JavaScript 파일을 프로덕션에 적합한 에셋으로 번들링합니다.

Laravel은 공식 플러그인과 Blade 지시어를 제공하여 개발 및 프로덕션 환경에서 에셋을 로드할 수 있도록 Vite와 완벽하게 통합됩니다.

> [!NOTE]
> Laravel Mix를 사용하고 계신가요? Vite는 새로운 Laravel 설치에서 Laravel Mix를 대체하였습니다. Mix 문서는 [Laravel Mix](https://laravel-mix.com/) 웹사이트를 참고하세요. Vite로 전환하고 싶으시다면, [마이그레이션 가이드](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-laravel-mix-to-vite)를 참고하세요.


#### Vite와 Laravel Mix 중 선택하기 {#vite-or-mix}

Vite로 전환하기 전까지, 새로운 Laravel 애플리케이션은 에셋 번들링 시 [webpack](https://webpack.js.org/) 기반의 [Mix](https://laravel-mix.com/)를 사용했습니다. Vite는 풍부한 JavaScript 애플리케이션을 구축할 때 더 빠르고 생산적인 경험을 제공하는 데 중점을 둡니다. [Inertia](https://inertiajs.com)와 같은 도구로 개발된 SPA(싱글 페이지 애플리케이션)를 개발한다면, Vite가 완벽한 선택이 될 것입니다.

Vite는 [Livewire](https://livewire.laravel.com)와 같이 JavaScript "스프링클"이 포함된 전통적인 서버 사이드 렌더링 애플리케이션과도 잘 작동합니다. 하지만, Vite는 Laravel Mix가 지원하는 일부 기능, 예를 들어 JavaScript 애플리케이션에서 직접 참조하지 않는 임의의 에셋을 빌드에 복사하는 기능 등은 제공하지 않습니다.


#### Mix로 다시 마이그레이션하기 {#migrating-back-to-mix}

Vite 스캐폴딩을 사용하여 새로운 Laravel 애플리케이션을 시작했지만 Laravel Mix와 webpack으로 다시 이동해야 하나요? 문제 없습니다. [Vite에서 Mix로 마이그레이션하는 공식 가이드](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-vite-to-laravel-mix)를 참고하세요.


## 설치 및 설정 {#installation}

> [!NOTE]
> 다음 문서는 Laravel Vite 플러그인을 수동으로 설치하고 구성하는 방법에 대해 설명합니다. 하지만, Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 이 모든 기본 구조가 포함되어 있으며, Laravel과 Vite를 시작하는 가장 빠른 방법입니다.


### Node 설치 {#installing-node}

Vite와 Laravel 플러그인을 실행하기 전에 Node.js(16+)와 NPM이 설치되어 있어야 합니다:

```shell
node -v
npm -v
```

최신 버전의 Node와 NPM은 [공식 Node 웹사이트](https://nodejs.org/en/download/)에서 제공하는 간단한 그래픽 설치 프로그램을 통해 쉽게 설치할 수 있습니다. 또는, [Laravel Sail](https://laravel.com/docs/{{version}}/sail)을 사용 중이라면 Sail을 통해 Node와 NPM을 실행할 수도 있습니다:

```shell
./vendor/bin/sail node -v
./vendor/bin/sail npm -v
```


### Vite 및 Laravel 플러그인 설치 {#installing-vite-and-laravel-plugin}

Laravel을 새로 설치하면 애플리케이션 디렉터리 구조의 루트에 `package.json` 파일이 있습니다. 기본 `package.json` 파일에는 Vite와 Laravel 플러그인을 사용하기 위해 필요한 모든 것이 이미 포함되어 있습니다. NPM을 통해 애플리케이션의 프론트엔드 의존성을 설치할 수 있습니다:

```shell
npm install
```


### Vite 설정하기 {#configuring-vite}

Vite는 프로젝트 루트에 위치한 `vite.config.js` 파일을 통해 설정됩니다. 이 파일은 필요에 따라 자유롭게 커스터마이즈할 수 있으며, `@vitejs/plugin-vue`나 `@vitejs/plugin-react`와 같이 애플리케이션에 필요한 다른 플러그인도 설치할 수 있습니다.

Laravel Vite 플러그인은 애플리케이션의 엔트리 포인트를 지정해주어야 합니다. 이 엔트리 포인트는 JavaScript 또는 CSS 파일일 수 있으며, TypeScript, JSX, TSX, Sass와 같은 전처리 언어도 포함할 수 있습니다.

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel([
            'resources/css/app.css',
            'resources/js/app.js',
        ]),
    ],
});
```

SPA를 빌드하는 경우, Inertia를 사용하는 애플리케이션을 포함하여, Vite는 CSS 엔트리 포인트 없이 동작할 때 가장 잘 작동합니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel([
            'resources/css/app.css', // [!code --]
            'resources/js/app.js',
        ]),
    ],
});
```

대신, CSS는 JavaScript를 통해 임포트해야 합니다. 일반적으로, 이는 애플리케이션의 `resources/js/app.js` 파일에서 수행됩니다:

```js
import './bootstrap';
import '../css/app.css'; // [!code ++]
```

Laravel 플러그인은 또한 여러 개의 엔트리 포인트와 [SSR 엔트리 포인트](#ssr)와 같은 고급 설정 옵션도 지원합니다.


#### 보안 개발 서버와 함께 작업하기 {#working-with-a-secure-development-server}

로컬 개발 웹 서버가 애플리케이션을 HTTPS로 제공하는 경우, Vite 개발 서버에 연결할 때 문제가 발생할 수 있습니다.

[Laravel Herd](https://herd.laravel.com)를 사용하여 사이트를 보안 처리했거나, [Laravel Valet](/laravel/12.x/valet)를 사용하고 애플리케이션에 대해 [secure 명령어](/laravel/12.x/valet#securing-sites)를 실행한 경우, Laravel Vite 플러그인은 자동으로 생성된 TLS 인증서를 감지하여 사용합니다.

사이트를 애플리케이션의 디렉터리 이름과 일치하지 않는 호스트로 보안 처리한 경우, 애플리케이션의 `vite.config.js` 파일에서 호스트를 수동으로 지정할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            // ...
            detectTls: 'my-app.test', // [!code ++]
        }),
    ],
});
```

다른 웹 서버를 사용하는 경우, 신뢰할 수 있는 인증서를 생성하고 Vite가 생성된 인증서를 사용하도록 수동으로 설정해야 합니다:

```js
// ...
import fs from 'fs'; // [!code ++]

const host = 'my-app.test'; // [!code ++]

export default defineConfig({
    // ...
    server: { // [!code ++]
        host, // [!code ++]
        hmr: { host }, // [!code ++]
        https: { // [!code ++]
            key: fs.readFileSync(`/path/to/${host}.key`), // [!code ++]
            cert: fs.readFileSync(`/path/to/${host}.crt`), // [!code ++]
        }, // [!code ++]
    }, // [!code ++]
});
```

시스템에서 신뢰할 수 있는 인증서를 생성할 수 없는 경우, [@vitejs/plugin-basic-ssl 플러그인](https://github.com/vitejs/vite-plugin-basic-ssl)을 설치하고 설정할 수 있습니다. 신뢰되지 않는 인증서를 사용할 때는, `npm run dev` 명령어를 실행할 때 콘솔에 표시되는 "Local" 링크를 따라 브라우저에서 Vite 개발 서버의 인증서 경고를 수락해야 합니다.


#### WSL2에서 Sail로 개발 서버 실행하기 {#configuring-hmr-in-sail-on-wsl2}

Windows Subsystem for Linux 2 (WSL2)에서 [Laravel Sail](/laravel/12.x/sail)를 사용하여 Vite 개발 서버를 실행할 때, 브라우저가 개발 서버와 통신할 수 있도록 `vite.config.js` 파일에 다음 설정을 추가해야 합니다:

```js
// ...

export default defineConfig({
    // ...
    server: { // [tl! add:start]
        hmr: {
            host: 'localhost',
        },
    }, // [tl! add:end]
});
```

개발 서버가 실행 중임에도 파일 변경 사항이 브라우저에 반영되지 않는 경우, Vite의 [server.watch.usePolling 옵션](https://vitejs.dev/config/server-options.html#server-watch)도 추가로 설정해야 할 수 있습니다.


### 스크립트와 스타일 불러오기 {#loading-your-scripts-and-styles}

Vite 진입점을 설정했다면, 이제 애플리케이션의 루트 템플릿 `<head>`에 추가하는 `@vite()` Blade 지시문에서 이를 참조할 수 있습니다:

```blade
<!DOCTYPE html>
<head>
    {{-- ... --}}

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

CSS를 JavaScript를 통해 임포트하고 있다면, JavaScript 진입점만 포함하면 됩니다:

```blade
<!DOCTYPE html>
<head>
    {{-- ... --}}

    @vite('resources/js/app.js')
</head>
```

`@vite` 지시문은 Vite 개발 서버를 자동으로 감지하고, 핫 모듈 교체(HMR)를 활성화하기 위해 Vite 클라이언트를 주입합니다. 빌드 모드에서는, 지시문이 컴파일되고 버전이 지정된 에셋(임포트된 CSS 포함)을 불러옵니다.

필요하다면, `@vite` 지시문을 호출할 때 컴파일된 에셋의 빌드 경로를 지정할 수도 있습니다:

```blade
<!doctype html>
<head>
    {{-- 지정한 빌드 경로는 public 경로를 기준으로 합니다. --}}

    @vite('resources/js/app.js', 'vendor/courier/build')
</head>
```


#### 인라인 에셋 {#inline-assets}

때때로 에셋의 버전이 지정된 URL을 링크하는 대신, 에셋의 원본 내용을 직접 포함해야 할 필요가 있습니다. 예를 들어, PDF 생성기에 HTML 콘텐츠를 전달할 때 에셋 내용을 페이지에 직접 포함해야 할 수 있습니다. `Vite` 파사드에서 제공하는 `content` 메서드를 사용하여 Vite 에셋의 내용을 출력할 수 있습니다:

```blade
@use('Illuminate\Support\Facades\Vite')

<!doctype html>
<head>
    {{-- ... --}}

    <style>
        {!! Vite::content('resources/css/app.css') !!}
    </style>
    <script>
        {!! Vite::content('resources/js/app.js') !!}
    </script>
</head>
```


## Vite 실행하기 {#running-vite}

Vite를 실행하는 방법에는 두 가지가 있습니다. 로컬에서 개발할 때 유용한 `dev` 명령어를 통해 개발 서버를 실행할 수 있습니다. 개발 서버는 파일의 변경 사항을 자동으로 감지하여, 열려 있는 모든 브라우저 창에 즉시 반영합니다.

또는, `build` 명령어를 실행하면 애플리케이션의 에셋을 버전 관리하고 번들링하여 프로덕션 배포를 위해 준비할 수 있습니다:

```shell
# Vite 개발 서버 실행...
npm run dev

# 프로덕션용 에셋 빌드 및 버전 관리...
npm run build
```

[WSL2](https://docs.microsoft.com/ko-kr/windows/wsl/)에서 [Sail](/laravel/12.x/sail)로 개발 서버를 실행하는 경우, [추가 설정](#configuring-hmr-in-sail-on-wsl2)이 필요할 수 있습니다.


## 자바스크립트와 함께 작업하기 {#working-with-scripts}


### 별칭 {#aliases}

기본적으로 Laravel 플러그인은 여러분이 빠르게 시작하고 애플리케이션의 에셋을 편리하게 임포트할 수 있도록 공통 별칭을 제공합니다:

```js
{
    '@' => '/resources/js'
}
```

`vite.config.js` 설정 파일에 직접 별칭을 추가하여 `'@'` 별칭을 덮어쓸 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel(['resources/ts/app.tsx']),
    ],
    resolve: {
        alias: {
            '@': '/resources/ts',
        },
    },
});
```


### Vue {#vue}

프론트엔드를 [Vue](https://vuejs.org/) 프레임워크로 구축하고 싶다면, `@vitejs/plugin-vue` 플러그인도 설치해야 합니다:

```shell
npm install --save-dev @vitejs/plugin-vue
```

그런 다음 `vite.config.js` 설정 파일에 플러그인을 포함할 수 있습니다. Laravel에서 Vue 플러그인을 사용할 때는 몇 가지 추가 옵션이 필요합니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel(['resources/js/app.js']),
        vue({
            template: {
                transformAssetUrls: {
                    // Vue 플러그인은 싱글 파일 컴포넌트에서 참조된
                    // 에셋 URL을 Laravel 웹 서버를 가리키도록 재작성합니다.
                    // 이를 `null`로 설정하면 Laravel 플러그인이 대신
                    // 에셋 URL을 Vite 서버를 가리키도록 재작성할 수 있습니다.
                    base: null,

                    // Vue 플러그인은 절대 URL을 파싱하여
                    // 디스크의 파일에 대한 절대 경로로 처리합니다.
                    // 이를 `false`로 설정하면 절대 URL을 그대로 두어
                    // public 디렉터리의 에셋을 정상적으로 참조할 수 있습니다.
                    includeAbsolute: false,
                },
            },
        }),
    ],
});
```

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 적절한 Laravel, Vue, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, Vue, Vite로 빠르게 시작할 수 있는 가장 빠른 방법을 제공합니다.



### React {#react}

프론트엔드를 [React](https://reactjs.org/) 프레임워크로 구축하고 싶다면, `@vitejs/plugin-react` 플러그인도 설치해야 합니다:

```shell
npm install --save-dev @vitejs/plugin-react
```

그런 다음, `vite.config.js` 설정 파일에 플러그인을 포함할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel(['resources/js/app.jsx']),
        react(),
    ],
});
```

JSX가 포함된 파일은 `.jsx` 또는 `.tsx` 확장자를 사용해야 하며, 필요하다면 [위에서 설명한 대로](#configuring-vite) 진입점도 업데이트해야 합니다.

또한 기존의 `@vite` 디렉티브와 함께 추가로 `@viteReactRefresh` Blade 디렉티브를 포함해야 합니다.

```blade
@viteReactRefresh
@vite('resources/js/app.jsx')
```

`@viteReactRefresh` 디렉티브는 반드시 `@vite` 디렉티브보다 먼저 호출되어야 합니다.

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 적절한 Laravel, React, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, React, Vite로 빠르게 시작할 수 있는 가장 빠른 방법을 제공합니다.


### Inertia {#inertia}

Laravel Vite 플러그인은 Inertia 페이지 컴포넌트를 쉽게 해결할 수 있도록 `resolvePageComponent` 함수를 제공합니다. 아래는 Vue 3에서 이 헬퍼를 사용하는 예시이지만, React와 같은 다른 프레임워크에서도 이 함수를 사용할 수 있습니다:

```js
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
  resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
});
```

Inertia와 함께 Vite의 코드 분할 기능을 사용하는 경우, [에셋 프리페칭](#asset-prefetching) 구성을 권장합니다.

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 적절한 Laravel, Inertia, Vite 구성이 포함되어 있습니다. 이 스타터 키트는 Laravel, Inertia, Vite로 빠르게 시작할 수 있는 가장 빠른 방법을 제공합니다.


### URL 처리 {#url-processing}

Vite를 사용하여 애플리케이션의 HTML, CSS, 또는 JS에서 에셋을 참조할 때 몇 가지 주의해야 할 점이 있습니다. 먼저, 에셋을 절대 경로로 참조하면 Vite는 해당 에셋을 빌드에 포함하지 않습니다. 따라서 해당 에셋이 public 디렉터리에 존재하는지 반드시 확인해야 합니다. [별도의 CSS 엔트리포인트](#configuring-vite)를 사용할 때는 절대 경로 사용을 피해야 합니다. 개발 중에는 브라우저가 CSS가 호스팅되는 Vite 개발 서버에서 이러한 경로를 로드하려고 시도하기 때문이며, 이는 public 디렉터리에서 로드하는 것이 아닙니다.

상대 경로로 에셋을 참조할 때는 해당 경로가 참조되는 파일을 기준으로 상대적임을 기억해야 합니다. 상대 경로로 참조된 모든 에셋은 Vite에 의해 경로가 재작성되고, 버전이 부여되며, 번들링됩니다.

다음은 프로젝트 구조 예시입니다:

```text
public/
  taylor.png
resources/
  js/
    Pages/
      Welcome.vue
  images/
    abigail.png
```

다음 예시는 Vite가 상대 URL과 절대 URL을 어떻게 처리하는지 보여줍니다:

```html
<!-- 이 에셋은 Vite에 의해 처리되지 않으며 빌드에 포함되지 않습니다 -->
<img src="/taylor.png">

<!-- 이 에셋은 Vite에 의해 경로가 재작성되고, 버전이 부여되며, 번들링됩니다 -->
<img src="../../images/abigail.png">
```


## 스타일시트 작업하기 {#working-with-stylesheets}

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 적절한 Tailwind와 Vite 설정이 포함되어 있습니다. 또는, 스타터 키트를 사용하지 않고 Tailwind와 Laravel을 함께 사용하고 싶다면 [Tailwind의 Laravel 설치 가이드](https://tailwindcss.com/docs/guides/laravel)를 참고하세요.

모든 Laravel 애플리케이션에는 이미 Tailwind와 적절하게 구성된 `vite.config.js` 파일이 포함되어 있습니다. 따라서 Vite 개발 서버를 시작하거나, `dev` Composer 명령어를 실행하면 Laravel과 Vite 개발 서버가 모두 시작됩니다:

```shell
composer run dev
```

애플리케이션의 CSS는 `resources/css/app.css` 파일에 위치할 수 있습니다.


## Blade 및 라우트 작업하기 {#working-with-blade-and-routes}


### Vite로 정적 에셋 처리하기 {#blade-processing-static-assets}

JavaScript나 CSS에서 에셋을 참조할 때, Vite는 자동으로 해당 에셋을 처리하고 버전 관리를 해줍니다. 또한, Blade 기반 애플리케이션을 빌드할 때, Vite는 Blade 템플릿에서만 참조되는 정적 에셋도 처리하고 버전 관리를 할 수 있습니다.

하지만 이를 위해서는, 애플리케이션의 엔트리 포인트에 정적 에셋을 import하여 Vite가 해당 에셋을 인식할 수 있도록 해야 합니다. 예를 들어, `resources/images`에 저장된 모든 이미지와 `resources/fonts`에 저장된 모든 폰트를 처리하고 버전 관리하고 싶다면, 애플리케이션의 `resources/js/app.js` 엔트리 포인트에 다음과 같이 추가해야 합니다:

```js
import.meta.glob([
  '../images/**',
  '../fonts/**',
]);
```

이제 이러한 에셋들은 `npm run build`를 실행할 때 Vite에 의해 처리됩니다. 이후 Blade 템플릿에서 `Vite::asset` 메서드를 사용하여 해당 에셋을 참조할 수 있으며, 이 메서드는 주어진 에셋의 버전이 적용된 URL을 반환합니다:

```blade
<img src="{{ Vite::asset('resources/images/logo.png') }}">
```


### 저장 시 새로고침 {#blade-refreshing-on-save}

애플리케이션이 Blade를 사용한 전통적인 서버 사이드 렌더링으로 구축된 경우, Vite는 애플리케이션의 뷰 파일을 변경할 때 브라우저를 자동으로 새로고침하여 개발 워크플로우를 개선할 수 있습니다. 시작하려면, `refresh` 옵션을 `true`로 지정하면 됩니다.

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            // ...
            refresh: true,
        }),
    ],
});
```

`refresh` 옵션이 `true`로 설정되어 있으면, 다음 디렉터리 내의 파일을 저장할 때 `npm run dev`를 실행 중인 브라우저에서 전체 페이지 새로고침이 트리거됩니다:

- `app/Livewire/**`
- `app/View/Components/**`
- `lang/**`
- `resources/lang/**`
- `resources/views/**`
- `routes/**`

`routes/**` 디렉터리를 감시하는 것은 애플리케이션의 프론트엔드에서 [Ziggy](https://github.com/tighten/ziggy)를 사용해 라우트 링크를 생성하는 경우에 유용합니다.

이 기본 경로들이 필요에 맞지 않는 경우, 감시할 경로 목록을 직접 지정할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            // ...
            refresh: ['resources/views/**'],
        }),
    ],
});
```

내부적으로, Laravel Vite 플러그인은 [vite-plugin-full-reload](https://github.com/ElMassimo/vite-plugin-full-reload) 패키지를 사용하며, 이 패키지는 이 기능의 동작을 세밀하게 조정할 수 있는 고급 설정 옵션을 제공합니다. 이러한 수준의 커스터마이징이 필요하다면, `config` 정의를 제공할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            // ...
            refresh: [{
                paths: ['path/to/watch/**'],
                config: { delay: 300 }
            }],
        }),
    ],
});
```


### 별칭 {#blade-aliases}

JavaScript 애플리케이션에서는 자주 참조하는 디렉터리에 [별칭을 생성](#aliases)하는 것이 일반적입니다. 하지만, Blade에서도 `Illuminate\Support\Facades\Vite` 클래스의 `macro` 메서드를 사용하여 별칭을 생성할 수 있습니다. 일반적으로 "매크로"는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드 내에서 정의해야 합니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Vite::macro('image', fn (string $asset) => $this->asset("resources/images/{$asset}"));
}
```

매크로가 정의되면, 템플릿 내에서 호출할 수 있습니다. 예를 들어, 위에서 정의한 `image` 매크로를 사용하여 `resources/images/logo.png`에 위치한 에셋을 참조할 수 있습니다:

```blade
<img src="{{ Vite::image('logo.png') }}" alt="Laravel Logo">
```


## 에셋 프리페칭 {#asset-prefetching}

Vite의 코드 분할 기능을 사용하여 SPA를 구축할 때, 필요한 에셋들은 각 페이지 이동 시마다 가져오게 됩니다. 이 동작은 UI 렌더링이 지연되는 원인이 될 수 있습니다. 만약 이 문제가 사용하는 프론트엔드 프레임워크에서 문제가 된다면, Laravel은 초기 페이지 로드 시 애플리케이션의 JavaScript와 CSS 에셋을 미리 프리페칭할 수 있는 기능을 제공합니다.

에셋을 미리 프리페칭하도록 Laravel에 지시하려면, [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메소드에서 `Vite::prefetch` 메소드를 호출하면 됩니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
        Vite::prefetch(concurrency: 3);
    }
}
```

위 예시에서, 에셋들은 각 페이지 로드마다 최대 `3`개의 동시 다운로드로 프리페칭됩니다. 애플리케이션의 필요에 따라 동시성(concurrency)을 조정하거나, 모든 에셋을 한 번에 다운로드하도록 동시성 제한을 지정하지 않을 수도 있습니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Vite::prefetch();
}
```

기본적으로 프리페칭은 [page _load_ 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)가 발생할 때 시작됩니다. 프리페칭이 시작되는 시점을 커스터마이즈하고 싶다면, Vite가 리스닝할 이벤트를 지정할 수 있습니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Vite::prefetch(event: 'vite:prefetch');
}
```

위 코드에 따라, 이제 프리페칭은 `window` 객체에서 `vite:prefetch` 이벤트를 수동으로 디스패치할 때 시작됩니다. 예를 들어, 페이지가 로드된 후 3초 뒤에 프리페칭을 시작할 수도 있습니다:

```html
<script>
    addEventListener('load', () => setTimeout(() => {
        dispatchEvent(new Event('vite:prefetch'))
    }, 3000))
</script>
```


## 커스텀 기본 URL {#custom-base-urls}

Vite로 컴파일된 에셋이 CDN과 같이 애플리케이션과 다른 도메인에 배포되는 경우, 애플리케이션의 `.env` 파일에 `ASSET_URL` 환경 변수를 지정해야 합니다:

```env
ASSET_URL=https://cdn.example.com
```

에셋 URL을 설정하면, 에셋에 대한 모든 재작성된 URL 앞에 설정한 값이 접두사로 붙게 됩니다:

```text
https://cdn.example.com/build/assets/app.9dce8d17.js
```

[절대 URL은 Vite에 의해 재작성되지 않으므로](#url-processing), 접두사가 붙지 않는다는 점을 기억하세요.


## 환경 변수 {#environment-variables}

애플리케이션의 `.env` 파일에서 환경 변수 앞에 `VITE_`를 붙여 JavaScript에 환경 변수를 주입할 수 있습니다:

```env
VITE_SENTRY_DSN_PUBLIC=http://example.com
```

주입된 환경 변수는 `import.meta.env` 객체를 통해 접근할 수 있습니다:

```js
import.meta.env.VITE_SENTRY_DSN_PUBLIC
```


## 테스트에서 Vite 비활성화하기 {#disabling-vite-in-tests}

Laravel의 Vite 통합은 테스트를 실행하는 동안 에셋을 해석하려고 시도하므로, Vite 개발 서버를 실행하거나 에셋을 빌드해야 합니다.

테스트 중에 Vite를 모킹하고 싶다면, Laravel의 `TestCase` 클래스를 확장한 모든 테스트에서 사용할 수 있는 `withoutVite` 메서드를 호출할 수 있습니다:

```php tab=Pest
test('without vite example', function () {
    $this->withoutVite();

    // ...
});
```

```php tab=PHPUnit
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_without_vite_example(): void
    {
        $this->withoutVite();

        // ...
    }
}
```

모든 테스트에서 Vite를 비활성화하고 싶다면, 기본 `TestCase` 클래스의 `setUp` 메서드에서 `withoutVite` 메서드를 호출하면 됩니다:

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void// [tl! add:start]
    {
        parent::setUp();

        $this->withoutVite();
    }// [tl! add:end]
}
```


## 서버 사이드 렌더링(SSR) {#ssr}

Laravel Vite 플러그인은 Vite로 서버 사이드 렌더링을 손쉽게 설정할 수 있도록 도와줍니다. 시작하려면 `resources/js/ssr.js`에 SSR 엔트리 포인트를 생성하고, Laravel 플러그인에 설정 옵션을 전달하여 엔트리 포인트를 지정하세요:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            ssr: 'resources/js/ssr.js',
        }),
    ],
});
```

SSR 엔트리 포인트를 재빌드하는 것을 잊지 않도록, 애플리케이션의 `package.json`에 있는 "build" 스크립트를 수정하여 SSR 빌드를 생성하는 것을 권장합니다:

```json
"scripts": {
     "dev": "vite",
     "build": "vite build" // [!code --]
     "build": "vite build && vite build --ssr" // [!code ++]
}
```

그런 다음, SSR 서버를 빌드하고 시작하려면 다음 명령어를 실행하세요:

```shell
npm run build
node bootstrap/ssr/ssr.js
```

[Inertia와 SSR](https://inertiajs.com/server-side-rendering)을 사용하는 경우, SSR 서버를 시작하기 위해 `inertia:start-ssr` Artisan 명령어를 대신 사용할 수 있습니다:

```shell
php artisan inertia:start-ssr
```

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 적절한 Laravel, Inertia SSR, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, Inertia SSR, Vite로 빠르게 시작할 수 있는 가장 빠른 방법을 제공합니다.


## 스크립트 및 스타일 태그 속성 {#script-and-style-attributes}


### 콘텐츠 보안 정책(CSP) Nonce {#content-security-policy-csp-nonce}

스크립트 및 스타일 태그에 [nonce 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)을 [콘텐츠 보안 정책](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)의 일부로 포함하고 싶다면, 커스텀 [미들웨어](/laravel/12.x/middleware) 내에서 `useCspNonce` 메서드를 사용하여 nonce를 생성하거나 지정할 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class AddContentSecurityPolicyHeaders
{
    /**
     * 들어오는 요청을 처리합니다.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Vite::useCspNonce();

        return $next($request)->withHeaders([
            'Content-Security-Policy' => "script-src 'nonce-".Vite::cspNonce()."'",
        ]);
    }
}
```

`useCspNonce` 메서드를 호출한 후에는, Laravel이 생성하는 모든 스크립트 및 스타일 태그에 자동으로 `nonce` 속성이 포함됩니다.

다른 곳에서 nonce가 필요하다면, 예를 들어 Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에 포함된 [Ziggy `@route` 디렉티브](https://github.com/tighten/ziggy#using-routes-with-a-content-security-policy)에서도 `cspNonce` 메서드를 사용해 가져올 수 있습니다:

```blade
@routes(nonce: Vite::cspNonce())
```

이미 사용하고자 하는 nonce가 있다면, 해당 nonce를 `useCspNonce` 메서드에 전달할 수 있습니다:

```php
Vite::useCspNonce($nonce);
```


### 하위 리소스 무결성(SRI) {#subresource-integrity-sri}

만약 Vite 매니페스트에 에셋의 `integrity` 해시가 포함되어 있다면, Laravel은 생성하는 모든 스크립트 및 스타일 태그에 자동으로 `integrity` 속성을 추가하여 [하위 리소스 무결성(Subresource Integrity)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)을 적용합니다. 기본적으로 Vite는 매니페스트에 `integrity` 해시를 포함하지 않지만, [vite-plugin-manifest-sri](https://www.npmjs.com/package/vite-plugin-manifest-sri) NPM 플러그인을 설치하여 활성화할 수 있습니다:

```shell
npm install --save-dev vite-plugin-manifest-sri
```

그런 다음, `vite.config.js` 파일에서 이 플러그인을 활성화할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import manifestSRI from 'vite-plugin-manifest-sri';// [tl! add]

export default defineConfig({
    plugins: [
        laravel({
            // ...
        }),
        manifestSRI(),// [tl! add]
    ],
});
```

필요하다면, 무결성 해시가 저장될 매니페스트 키를 커스터마이즈할 수도 있습니다:

```php
use Illuminate\Support\Facades\Vite;

Vite::useIntegrityKey('custom-integrity-key');
```

이 자동 감지를 완전히 비활성화하고 싶다면, `useIntegrityKey` 메서드에 `false`를 전달하면 됩니다:

```php
Vite::useIntegrityKey(false);
```


### 임의 속성 {#arbitrary-attributes}

스크립트 및 스타일 태그에 [data-turbo-track](https://turbo.hotwired.dev/handbook/drive#reloading-when-assets-change) 속성과 같은 추가 속성을 포함해야 하는 경우, `useScriptTagAttributes` 및 `useStyleTagAttributes` 메서드를 통해 지정할 수 있습니다. 일반적으로 이 메서드들은 [서비스 프로바이더](/laravel/12.x/providers)에서 호출해야 합니다:

```php
use Illuminate\Support\Facades\Vite;

Vite::useScriptTagAttributes([
    'data-turbo-track' => 'reload', // 속성에 값을 지정...
    'async' => true, // 값 없이 속성만 지정...
    'integrity' => false, // 기본적으로 포함될 속성을 제외...
]);

Vite::useStyleTagAttributes([
    'data-turbo-track' => 'reload',
]);
```

조건부로 속성을 추가해야 하는 경우, 에셋 소스 경로, URL, 매니페스트 청크, 전체 매니페스트를 인자로 받는 콜백을 전달할 수 있습니다:

```php
use Illuminate\Support\Facades\Vite;

Vite::useScriptTagAttributes(fn (string $src, string $url, array|null $chunk, array|null $manifest) => [
    'data-turbo-track' => $src === 'resources/js/app.js' ? 'reload' : false,
]);

Vite::useStyleTagAttributes(fn (string $src, string $url, array|null $chunk, array|null $manifest) => [
    'data-turbo-track' => $chunk && $chunk['isEntry'] ? 'reload' : false,
]);
```

> [!WARNING]
> Vite 개발 서버가 실행 중일 때는 `$chunk` 및 `$manifest` 인자가 `null`이 됩니다.


## 고급 커스터마이징 {#advanced-customization}

기본적으로 Laravel의 Vite 플러그인은 대부분의 애플리케이션에 적합한 합리적인 규칙을 사용합니다. 하지만 때로는 Vite의 동작을 커스터마이징해야 할 수도 있습니다. 추가 커스터마이징 옵션을 활성화하기 위해, `@vite` Blade 디렉티브 대신 사용할 수 있는 다음과 같은 메서드와 옵션을 제공합니다:

```blade
<!doctype html>
<head>
    {{-- ... --}}

    {{
        Vite::useHotFile(storage_path('vite.hot')) // "hot" 파일 커스터마이즈...
            ->useBuildDirectory('bundle') // 빌드 디렉터리 커스터마이즈...
            ->useManifestFilename('assets.json') // 매니페스트 파일명 커스터마이즈...
            ->withEntryPoints(['resources/js/app.js']) // 엔트리 포인트 지정...
            ->createAssetPathsUsing(function (string $path, ?bool $secure) { // 빌드된 에셋의 백엔드 경로 생성 커스터마이즈...
                return "https://cdn.example.com/{$path}";
            })
    }}
</head>
```

`vite.config.js` 파일 내에서도 동일한 설정을 지정해야 합니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            hotFile: 'storage/vite.hot', // "hot" 파일 커스터마이즈...
            buildDirectory: 'bundle', // 빌드 디렉터리 커스터마이즈...
            input: ['resources/js/app.js'], // 엔트리 포인트 지정...
        }),
    ],
    build: {
      manifest: 'assets.json', // 매니페스트 파일명 커스터마이즈...
    },
});
```


### 개발 서버 교차 출처 리소스 공유(CORS) {#cors}

브라우저에서 Vite 개발 서버로부터 에셋을 가져올 때 교차 출처 리소스 공유(CORS) 문제가 발생한다면, 커스텀 오리진에 개발 서버 접근 권한을 부여해야 할 수 있습니다. Vite와 Laravel 플러그인을 함께 사용할 경우, 추가 설정 없이 다음 오리진들이 허용됩니다:

- `::1`
- `127.0.0.1`
- `localhost`
- `*.test`
- `*.localhost`
- 프로젝트의 `.env` 파일에 있는 `APP_URL`

프로젝트에 커스텀 오리진을 허용하는 가장 쉬운 방법은 애플리케이션의 `APP_URL` 환경 변수가 브라우저에서 방문하는 오리진과 일치하도록 설정하는 것입니다. 예를 들어, `https://my-app.laravel`에 접속하고 있다면, `.env` 파일을 다음과 같이 수정해야 합니다:

```env
APP_URL=https://my-app.laravel
```

여러 오리진을 지원하는 등 더 세밀한 오리진 제어가 필요하다면, [Vite의 포괄적이고 유연한 내장 CORS 서버 설정](https://vite.dev/config/server-options.html#server-cors)을 활용해야 합니다. 예를 들어, 프로젝트의 `vite.config.js` 파일에서 `server.cors.origin` 설정 옵션에 여러 오리진을 지정할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
    ],
    server: {  // [!code ++]
        cors: {  // [!code ++]
            origin: [  // [!code ++]
                'https://backend.laravel',  // [!code ++]
                'http://admin.laravel:8566',  // [!code ++]
            ],  // [!code ++]
        },  // [!code ++]
    },  // [!code ++]
});
```

정규식 패턴도 포함할 수 있으며, 이는 예를 들어 `*.laravel`과 같은 특정 최상위 도메인에 대해 모든 오리진을 허용하고 싶을 때 유용합니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
    ],
    server: {  // [!code ++]
        cors: {  // [!code ++]
            origin: [ // [!code ++]
                // 지원: SCHEME://DOMAIN.laravel[:PORT] [tl! add]
                /^https?:\/\/.*\.laravel(:\d+)?$/, //[tl! add]
            ], // [!code ++]
        }, // [!code ++]
    }, // [!code ++]
});
```


### 개발 서버 URL 수정하기 {#correcting-dev-server-urls}

Vite 생태계 내의 일부 플러그인들은 슬래시(`/`)로 시작하는 URL이 항상 Vite 개발 서버를 가리킨다고 가정합니다. 하지만, Laravel 통합의 특성상 이는 사실이 아닙니다.

예를 들어, `vite-imagetools` 플러그인은 Vite가 에셋을 제공할 때 다음과 같은 URL을 출력합니다:

```html
<img src="/@imagetools/f0b2f404b13f052c604e632f2fb60381bf61a520">
```

`vite-imagetools` 플러그인은 출력된 URL이 Vite에 의해 가로채지고, 플러그인이 `/@imagetools`로 시작하는 모든 URL을 처리할 수 있기를 기대합니다. 만약 이러한 동작을 기대하는 플러그인을 사용한다면, URL을 수동으로 수정해주어야 합니다. 이는 `vite.config.js` 파일에서 `transformOnServe` 옵션을 사용하여 할 수 있습니다.

이 예시에서는, 생성된 코드 내의 모든 `/@imagetools` 앞에 개발 서버 URL을 추가합니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
    plugins: [
        laravel({
            // ...
            transformOnServe: (code, devServerUrl) => code.replaceAll('/@imagetools', devServerUrl+'/@imagetools'),
        }),
        imagetools(),
    ],
});
```

이제 Vite가 에셋을 제공하는 동안, Vite 개발 서버를 가리키는 URL이 출력됩니다:

```html
- <img src="/@imagetools/f0b2f404b13f052c604e632f2fb60381bf61a520"><!-- [tl! remove] -->
+ <img src="http://[::1]:5173/@imagetools/f0b2f404b13f052c604e632f2fb60381bf61a520"><!-- [tl! add] -->
```
