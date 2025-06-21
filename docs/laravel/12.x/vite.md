# 에셋 번들링 (Vite)

































## 소개 {#introduction}

[Vite](https://vitejs.dev)는 매우 빠른 개발 환경을 제공하고, 프로덕션을 위한 코드 번들링을 지원하는 최신 프론트엔드 빌드 도구입니다. Laravel로 애플리케이션을 개발할 때, 일반적으로 Vite를 사용하여 애플리케이션의 CSS와 자바스크립트 파일을 프로덕션에 적합한 에셋으로 번들링합니다.

Laravel은 공식 플러그인과 Blade 디렉티브를 제공하여 개발 및 프로덕션 환경에서 에셋을 손쉽게 불러올 수 있도록 Vite와 완벽하게 통합되어 있습니다.

> [!NOTE]
> Laravel Mix를 사용 중이신가요? Vite는 새로운 Laravel 설치에서 Laravel Mix를 대체하였습니다. Mix 문서는 [Laravel Mix](https://laravel-mix.com/) 웹사이트를 참고하세요. Vite로 전환하고 싶으시다면 [마이그레이션 가이드](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-laravel-mix-to-vite)를 참고하세요.


#### Vite와 Laravel Mix 중 선택하기 {#vite-or-mix}

Vite로 전환하기 전, 새로운 Laravel 애플리케이션은 에셋 번들링에 [webpack](https://webpack.js.org/) 기반의 [Mix](https://laravel-mix.com/)를 사용했습니다. Vite는 풍부한 자바스크립트 애플리케이션을 개발할 때 더 빠르고 생산적인 경험을 제공하는 데 중점을 둡니다. [Inertia](https://inertiajs.com)와 같은 도구로 개발된 SPA(싱글 페이지 애플리케이션)를 개발한다면 Vite가 완벽하게 어울립니다.

Vite는 [Livewire](https://livewire.laravel.com)와 같이 자바스크립트 "스프링클"이 포함된 전통적인 서버 사이드 렌더링 애플리케이션과도 잘 작동합니다. 하지만, Laravel Mix가 지원하는 임의의 에셋을 빌드에 복사하는 기능 등 일부 기능은 제공하지 않습니다.


#### Mix로 다시 마이그레이션하기 {#migrating-back-to-mix}

Vite 스캐폴딩을 사용하여 새로운 Laravel 애플리케이션을 시작했지만, 다시 Laravel Mix와 webpack으로 돌아가야 하나요? 문제 없습니다. [Vite에서 Mix로 마이그레이션하는 공식 가이드](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-vite-to-laravel-mix)를 참고하세요.


## 설치 및 설정 {#installation}

> [!NOTE]
> 아래 문서는 Laravel Vite 플러그인을 수동으로 설치하고 설정하는 방법을 다룹니다. 하지만, Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 모든 스캐폴딩이 포함되어 있어 Laravel과 Vite를 가장 빠르게 시작할 수 있습니다.


### Node 설치 {#installing-node}

Vite와 Laravel 플러그인을 실행하기 전에 Node.js(16+)와 NPM이 설치되어 있는지 확인해야 합니다:

```shell
node -v
npm -v
```

[공식 Node 웹사이트](https://nodejs.org/en/download/)에서 제공하는 간단한 그래픽 설치 프로그램을 통해 Node와 NPM의 최신 버전을 쉽게 설치할 수 있습니다. 또는 [Laravel Sail](/laravel/12.x/sail)을 사용하는 경우, Sail을 통해 Node와 NPM을 실행할 수 있습니다:

```shell
./vendor/bin/sail node -v
./vendor/bin/sail npm -v
```


### Vite 및 Laravel 플러그인 설치 {#installing-vite-and-laravel-plugin}

새로운 Laravel 설치에서는 애플리케이션 디렉터리의 루트에 `package.json` 파일이 있습니다. 기본 `package.json` 파일에는 Vite와 Laravel 플러그인을 사용하기 위한 모든 것이 이미 포함되어 있습니다. NPM을 통해 프론트엔드 의존성을 설치할 수 있습니다:

```shell
npm install
```


### Vite 설정 {#configuring-vite}

Vite는 프로젝트 루트의 `vite.config.js` 파일을 통해 설정됩니다. 필요에 따라 이 파일을 자유롭게 커스터마이즈할 수 있으며, `@vitejs/plugin-vue`나 `@vitejs/plugin-react`와 같은 추가 플러그인도 설치할 수 있습니다.

Laravel Vite 플러그인은 애플리케이션의 엔트리 포인트를 지정해야 합니다. 이 엔트리 포인트는 자바스크립트 또는 CSS 파일일 수 있으며, TypeScript, JSX, TSX, Sass와 같은 전처리 언어도 포함됩니다.

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

SPA를 빌드하는 경우, Inertia를 사용하는 애플리케이션을 포함하여, CSS 엔트리 포인트 없이 Vite를 사용하는 것이 가장 좋습니다:

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

대신, 자바스크립트를 통해 CSS를 import해야 합니다. 일반적으로 애플리케이션의 `resources/js/app.js` 파일에서 다음과 같이 import합니다:

```js
import './bootstrap';
import '../css/app.css'; // [!code ++]
```

Laravel 플러그인은 여러 엔트리 포인트와 [SSR 엔트리 포인트](#ssr)와 같은 고급 설정 옵션도 지원합니다.


#### 보안 개발 서버 사용하기 {#working-with-a-secure-development-server}

로컬 개발 웹 서버가 HTTPS를 통해 애플리케이션을 제공하는 경우, Vite 개발 서버에 연결하는 데 문제가 발생할 수 있습니다.

[Laravel Herd](https://herd.laravel.com)에서 사이트를 보안 처리했거나, [Laravel Valet](/laravel/12.x/valet)에서 [secure 명령어](/laravel/12.x/valet#securing-sites)를 실행한 경우, Laravel Vite 플러그인은 자동으로 생성된 TLS 인증서를 감지하여 사용합니다.

사이트를 애플리케이션 디렉터리 이름과 일치하지 않는 호스트로 보안 처리한 경우, 애플리케이션의 `vite.config.js` 파일에서 호스트를 수동으로 지정할 수 있습니다:

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

다른 웹 서버를 사용하는 경우, 신뢰할 수 있는 인증서를 생성하고 Vite가 해당 인증서를 사용하도록 수동으로 설정해야 합니다:

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

시스템에서 신뢰할 수 있는 인증서를 생성할 수 없는 경우, [@vitejs/plugin-basic-ssl 플러그인](https://github.com/vitejs/vite-plugin-basic-ssl)을 설치하고 설정할 수 있습니다. 신뢰할 수 없는 인증서를 사용할 때는, 브라우저에서 `npm run dev` 명령어 실행 시 콘솔에 표시되는 "Local" 링크를 따라 Vite 개발 서버의 인증서 경고를 수락해야 합니다.


#### WSL2에서 Sail로 개발 서버 실행하기 {#configuring-hmr-in-sail-on-wsl2}

[Windows Subsystem for Linux 2 (WSL2)]에서 [Laravel Sail](/laravel/12.x/sail) 내에서 Vite 개발 서버를 실행할 때, 브라우저가 개발 서버와 통신할 수 있도록 `vite.config.js` 파일에 다음 설정을 추가해야 합니다:

```js
// ...

export default defineConfig({
    // ...
    server: { // [!code ++:5]
        hmr: {
            host: 'localhost',
        },
    },
});
```

개발 서버가 실행 중일 때 파일 변경 사항이 브라우저에 반영되지 않는 경우, Vite의 [server.watch.usePolling 옵션](https://vitejs.dev/config/server-options.html#server-watch)을 추가로 설정해야 할 수도 있습니다.


### 스크립트 및 스타일 불러오기 {#loading-your-scripts-and-styles}

Vite 엔트리 포인트를 설정했다면, 이제 애플리케이션의 루트 템플릿 `<head>`에 `@vite()` Blade 디렉티브를 추가하여 참조할 수 있습니다:

```blade
<!DOCTYPE html>
<head>
    {{-- ... --}}

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

자바스크립트에서 CSS를 import하는 경우, 자바스크립트 엔트리 포인트만 포함하면 됩니다:

```blade
<!DOCTYPE html>
<head>
    {{-- ... --}}

    @vite('resources/js/app.js')
</head>
```

`@vite` 디렉티브는 Vite 개발 서버를 자동으로 감지하고, 핫 모듈 교체(Hot Module Replacement)를 위해 Vite 클라이언트를 주입합니다. 빌드 모드에서는 컴파일되고 버전이 지정된 에셋(임포트된 CSS 포함)을 불러옵니다.

필요하다면, `@vite` 디렉티브를 호출할 때 컴파일된 에셋의 빌드 경로를 지정할 수도 있습니다:

```blade
<!doctype html>
<head>
    {{-- 빌드 경로는 public 경로를 기준으로 상대적입니다. --}}

    @vite('resources/js/app.js', 'vendor/courier/build')
</head>
```


#### 인라인 에셋 {#inline-assets}

때로는 에셋의 버전 URL을 링크하는 대신, 에셋의 원본 내용을 직접 포함해야 할 때가 있습니다. 예를 들어, PDF 생성기에 HTML 콘텐츠를 전달할 때 에셋 내용을 직접 페이지에 포함해야 할 수 있습니다. `Vite` 파사드에서 제공하는 `content` 메서드를 사용하여 Vite 에셋의 내용을 출력할 수 있습니다:

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

Vite를 실행하는 방법은 두 가지가 있습니다. 개발 중에는 `dev` 명령어로 개발 서버를 실행할 수 있습니다. 개발 서버는 파일 변경 사항을 자동으로 감지하여 열려 있는 브라우저 창에 즉시 반영합니다.

또는, `build` 명령어를 실행하면 애플리케이션의 에셋을 버전 관리하고 번들링하여 프로덕션 배포를 준비할 수 있습니다:

```shell
# Vite 개발 서버 실행...
npm run dev

# 프로덕션용 에셋 빌드 및 버전 관리...
npm run build
```

[WSL2에서 Sail](/laravel/12.x/sail)로 개발 서버를 실행하는 경우, [추가 설정](#configuring-hmr-in-sail-on-wsl2)이 필요할 수 있습니다.


## 자바스크립트와 함께 작업하기 {#working-with-scripts}


### 별칭(Aliases) {#aliases}

기본적으로, Laravel 플러그인은 애플리케이션의 에셋을 빠르게 import할 수 있도록 공통 별칭을 제공합니다:

```js
{
    '@' => '/resources/js'
}
```

`'@'` 별칭을 덮어쓰려면, `vite.config.js` 설정 파일에 직접 추가할 수 있습니다:

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

[Vue](https://vuejs.org/) 프레임워크로 프론트엔드를 개발하려면, `@vitejs/plugin-vue` 플러그인을 추가로 설치해야 합니다:

```shell
npm install --save-dev @vitejs/plugin-vue
```

그런 다음, `vite.config.js` 설정 파일에 플러그인을 포함할 수 있습니다. Laravel에서 Vue 플러그인을 사용할 때는 몇 가지 추가 옵션이 필요합니다:

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
                    // Vue 플러그인은 싱글 파일 컴포넌트에서 참조된 에셋 URL을
                    // Laravel 웹 서버를 가리키도록 재작성합니다.
                    // 이 값을 `null`로 설정하면, Laravel 플러그인이
                    // 대신 Vite 서버를 가리키도록 에셋 URL을 재작성합니다.
                    base: null,

                    // Vue 플러그인은 절대 URL을 파싱하여
                    // 디스크의 파일에 대한 절대 경로로 처리합니다.
                    // 이 값을 `false`로 설정하면 절대 URL을 그대로 두어
                    // public 디렉터리의 에셋을 정상적으로 참조할 수 있습니다.
                    includeAbsolute: false,
                },
            },
        }),
    ],
});
```

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 올바른 Laravel, Vue, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, Vue, Vite를 가장 빠르게 시작할 수 있는 방법입니다.



### React {#react}

[React](https://reactjs.org/) 프레임워크로 프론트엔드를 개발하려면, `@vitejs/plugin-react` 플러그인을 추가로 설치해야 합니다:

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

JSX가 포함된 파일은 `.jsx` 또는 `.tsx` 확장자를 사용해야 하며, 필요하다면 엔트리 포인트도 [위에서 설명한 대로](#configuring-vite) 업데이트해야 합니다.

또한, 기존 `@vite` 디렉티브와 함께 추가로 `@viteReactRefresh` Blade 디렉티브를 포함해야 합니다.

```blade
@viteReactRefresh
@vite('resources/js/app.jsx')
```

`@viteReactRefresh` 디렉티브는 반드시 `@vite` 디렉티브보다 먼저 호출되어야 합니다.

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 올바른 Laravel, React, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, React, Vite를 가장 빠르게 시작할 수 있는 방법입니다.


### Inertia {#inertia}

Laravel Vite 플러그인은 Inertia 페이지 컴포넌트를 쉽게 resolve할 수 있도록 `resolvePageComponent` 함수를 제공합니다. 아래는 Vue 3에서 사용하는 예시이며, React 등 다른 프레임워크에서도 이 함수를 사용할 수 있습니다:

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

Vite의 코드 스플리팅 기능을 Inertia와 함께 사용하는 경우, [에셋 프리페칭](#asset-prefetching) 설정을 권장합니다.

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 올바른 Laravel, Inertia, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, Inertia, Vite를 가장 빠르게 시작할 수 있는 방법입니다.


### URL 처리 {#url-processing}

Vite를 사용하여 애플리케이션의 HTML, CSS, JS에서 에셋을 참조할 때 몇 가지 주의할 점이 있습니다. 먼저, 절대 경로로 에셋을 참조하면 Vite가 해당 에셋을 빌드에 포함하지 않으므로, 해당 에셋이 public 디렉터리에 존재해야 합니다. [전용 CSS 엔트리포인트](#configuring-vite)를 사용할 때는 절대 경로 사용을 피해야 합니다. 개발 중에는 브라우저가 CSS가 호스팅되는 Vite 개발 서버에서 해당 경로를 불러오려고 시도하기 때문입니다.

상대 경로로 에셋을 참조할 때는, 참조된 파일을 기준으로 경로가 상대적임을 기억해야 합니다. 상대 경로로 참조된 모든 에셋은 Vite에 의해 재작성되고, 버전이 지정되며, 번들링됩니다.

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

아래 예시는 Vite가 상대 및 절대 URL을 어떻게 처리하는지 보여줍니다:

```html
<!-- 이 에셋은 Vite가 처리하지 않으며 빌드에 포함되지 않습니다 -->
<img src="/taylor.png">

<!-- 이 에셋은 Vite가 재작성, 버전 관리, 번들링합니다 -->
<img src="../../images/abigail.png">
```


## 스타일시트와 함께 작업하기 {#working-with-stylesheets}

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 올바른 Tailwind 및 Vite 설정이 포함되어 있습니다. 또는, 스타터 키트를 사용하지 않고 Tailwind와 Laravel을 함께 사용하려면 [Tailwind의 Laravel 설치 가이드](https://tailwindcss.com/docs/guides/laravel)를 참고하세요.

모든 Laravel 애플리케이션에는 이미 Tailwind와 올바르게 설정된 `vite.config.js` 파일이 포함되어 있습니다. 따라서 Vite 개발 서버를 시작하거나, `dev` Composer 명령어를 실행하여 Laravel과 Vite 개발 서버를 모두 시작하면 됩니다:

```shell
composer run dev
```

애플리케이션의 CSS는 `resources/css/app.css` 파일에 위치할 수 있습니다.


## Blade 및 라우트와 함께 작업하기 {#working-with-blade-and-routes}


### 정적 에셋을 Vite로 처리하기 {#blade-processing-static-assets}

자바스크립트나 CSS에서 에셋을 참조할 때, Vite는 자동으로 에셋을 처리하고 버전 관리합니다. 또한, Blade 기반 애플리케이션을 빌드할 때, Blade 템플릿에서만 참조되는 정적 에셋도 Vite가 처리하고 버전 관리할 수 있습니다.

이를 위해서는 애플리케이션의 엔트리 포인트에서 정적 에셋을 import하여 Vite가 해당 에셋을 인식하도록 해야 합니다. 예를 들어, `resources/images`에 저장된 모든 이미지와 `resources/fonts`에 저장된 모든 폰트를 처리하고 버전 관리하려면, 애플리케이션의 `resources/js/app.js` 엔트리 포인트에 다음을 추가해야 합니다:

```js
import.meta.glob([
  '../images/**',
  '../fonts/**',
]);
```

이제 이 에셋들은 `npm run build` 실행 시 Vite에 의해 처리됩니다. 그런 다음 Blade 템플릿에서 `Vite::asset` 메서드를 사용하여 해당 에셋의 버전 URL을 참조할 수 있습니다:

```blade
<img src="{{ Vite::asset('resources/images/logo.png') }}">
```


### 저장 시 새로고침 {#blade-refreshing-on-save}

애플리케이션이 Blade를 사용한 전통적인 서버 사이드 렌더링 방식으로 빌드된 경우, Vite는 뷰 파일을 변경할 때 브라우저를 자동으로 새로고침하여 개발 워크플로우를 개선할 수 있습니다. 시작하려면, `refresh` 옵션을 `true`로 지정하면 됩니다.

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

`refresh` 옵션이 `true`일 때, 다음 디렉터리의 파일을 저장하면 `npm run dev` 실행 중에 브라우저가 전체 페이지를 새로고침합니다:

- `app/Livewire/**`
- `app/View/Components/**`
- `lang/**`
- `resources/lang/**`
- `resources/views/**`
- `routes/**`

`routes/**` 디렉터리를 감시하는 것은 [Ziggy](https://github.com/tighten/ziggy)를 사용하여 프론트엔드에서 라우트 링크를 생성하는 경우 유용합니다.

기본 경로가 필요에 맞지 않는 경우, 감시할 경로 목록을 직접 지정할 수 있습니다:

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


### 별칭(Aliases) {#blade-aliases}

자바스크립트 애플리케이션에서는 [자주 참조하는 디렉터리에 별칭을 생성](#aliases)하는 것이 일반적입니다. Blade에서도 `Illuminate\Support\Facades\Vite` 클래스의 `macro` 메서드를 사용하여 별칭을 만들 수 있습니다. 일반적으로 "매크로"는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드 내에서 정의해야 합니다:

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

Vite의 코드 스플리팅 기능을 사용하여 SPA를 빌드할 때, 필요한 에셋은 각 페이지 이동 시마다 가져옵니다. 이 동작은 UI 렌더링이 지연되는 원인이 될 수 있습니다. 만약 사용하는 프론트엔드 프레임워크에서 이 문제가 발생한다면, Laravel은 애플리케이션의 자바스크립트 및 CSS 에셋을 초기 페이지 로드 시 미리 프리페칭할 수 있는 기능을 제공합니다.

[서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 `Vite::prefetch` 메서드를 호출하여 에셋을 미리 프리페칭하도록 Laravel에 지시할 수 있습니다:

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

위 예시에서는 각 페이지 로드 시 최대 `3`개의 동시 다운로드로 에셋을 프리페칭합니다. 애플리케이션에 맞게 동시성(concurrency)을 조정하거나, 모든 에셋을 한 번에 다운로드하도록 제한을 두지 않을 수도 있습니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Vite::prefetch();
}
```

기본적으로 프리페칭은 [page _load_ 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event)가 발생할 때 시작됩니다. 프리페칭 시작 시점을 커스터마이즈하려면, Vite가 감지할 이벤트를 지정할 수 있습니다:

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Vite::prefetch(event: 'vite:prefetch');
}
```

위 코드에서는, `window` 객체에서 `vite:prefetch` 이벤트를 수동으로 디스패치할 때 프리페칭이 시작됩니다. 예를 들어, 페이지 로드 후 3초 뒤에 프리페칭을 시작할 수 있습니다:

```html
<script>
    addEventListener('load', () => setTimeout(() => {
        dispatchEvent(new Event('vite:prefetch'))
    }, 3000))
</script>
```


## 커스텀 Base URL {#custom-base-urls}

Vite로 컴파일된 에셋이 CDN 등 애플리케이션과 별도의 도메인에 배포되는 경우, 애플리케이션의 `.env` 파일에 `ASSET_URL` 환경 변수를 지정해야 합니다:

```env
ASSET_URL=https://cdn.example.com
```

에셋 URL을 설정하면, 모든 재작성된 에셋 URL 앞에 해당 값이 접두사로 붙습니다:

```text
https://cdn.example.com/build/assets/app.9dce8d17.js
```

[절대 URL은 Vite에 의해 재작성되지 않으므로](#url-processing), 접두사가 붙지 않습니다.


## 환경 변수 {#environment-variables}

애플리케이션의 `.env` 파일에서 `VITE_` 접두사를 붙여 자바스크립트에 환경 변수를 주입할 수 있습니다:

```env
VITE_SENTRY_DSN_PUBLIC=http://example.com
```

주입된 환경 변수는 `import.meta.env` 객체를 통해 접근할 수 있습니다:

```js
import.meta.env.VITE_SENTRY_DSN_PUBLIC
```


## 테스트에서 Vite 비활성화 {#disabling-vite-in-tests}

Laravel의 Vite 통합은 테스트 실행 중에도 에셋을 resolve하려고 시도하므로, Vite 개발 서버를 실행하거나 에셋을 빌드해야 합니다.

테스트 중에 Vite를 모킹하고 싶다면, Laravel의 `TestCase` 클래스를 확장한 모든 테스트에서 사용할 수 있는 `withoutVite` 메서드를 호출할 수 있습니다:
::: code-group
```php [Pest]
test('without vite example', function () {
    $this->withoutVite();

    // ...
});
```

```php [PHPUnit]
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
:::
모든 테스트에서 Vite를 비활성화하려면, 기본 `TestCase` 클래스의 `setUp` 메서드에서 `withoutVite` 메서드를 호출하면 됩니다:

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void // [!code ++:6]
    {
        parent::setUp();

        $this->withoutVite();
    }
}
```


## 서버 사이드 렌더링(SSR) {#ssr}

Laravel Vite 플러그인은 Vite로 서버 사이드 렌더링을 손쉽게 설정할 수 있도록 지원합니다. 먼저, `resources/js/ssr.js`에 SSR 엔트리 포인트를 생성하고, Laravel 플러그인에 설정 옵션으로 엔트리 포인트를 지정합니다:

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

SSR 엔트리 포인트 빌드를 잊지 않도록, 애플리케이션의 `package.json`의 "build" 스크립트를 다음과 같이 수정하는 것을 권장합니다:

```json
"scripts": {
     "dev": "vite",
     "build": "vite build" // [!code --]
     "build": "vite build && vite build --ssr" // [!code ++]
}
```

그런 다음, SSR 서버를 빌드하고 시작하려면 다음 명령어를 실행합니다:

```shell
npm run build
node bootstrap/ssr/ssr.js
```

[SSR with Inertia](https://inertiajs.com/server-side-rendering)를 사용하는 경우, 대신 `inertia:start-ssr` Artisan 명령어로 SSR 서버를 시작할 수 있습니다:

```shell
php artisan inertia:start-ssr
```

> [!NOTE]
> Laravel의 [스타터 키트](/laravel/12.x/starter-kits)에는 이미 올바른 Laravel, Inertia SSR, Vite 설정이 포함되어 있습니다. 이 스타터 키트는 Laravel, Inertia SSR, Vite를 가장 빠르게 시작할 수 있는 방법입니다.


## 스크립트 및 스타일 태그 속성 {#script-and-style-attributes}


### 콘텐츠 보안 정책(CSP) Nonce {#content-security-policy-csp-nonce}

[콘텐츠 보안 정책](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)의 일환으로 스크립트 및 스타일 태그에 [nonce 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)을 포함하려면, 커스텀 [미들웨어](/laravel/12.x/middleware) 내에서 `useCspNonce` 메서드를 사용하여 nonce를 생성하거나 지정할 수 있습니다:

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

`useCspNonce` 메서드를 호출하면, Laravel은 생성된 모든 스크립트 및 스타일 태그에 자동으로 `nonce` 속성을 포함합니다.

다른 곳에서 nonce가 필요하다면, [Ziggy의 `@route` 디렉티브](https://github.com/tighten/ziggy#using-routes-with-a-content-security-policy) 등에서도 `cspNonce` 메서드를 사용하여 가져올 수 있습니다:

```blade
@routes(nonce: Vite::cspNonce())
```

이미 가지고 있는 nonce를 Laravel에 사용하도록 지시하려면, `useCspNonce` 메서드에 nonce를 전달하면 됩니다:

```php
Vite::useCspNonce($nonce);
```


### 서브리소스 무결성(SRI) {#subresource-integrity-sri}

Vite 매니페스트에 에셋의 `integrity` 해시가 포함되어 있다면, Laravel은 자동으로 생성된 모든 스크립트 및 스타일 태그에 `integrity` 속성을 추가하여 [서브리소스 무결성](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)을 적용합니다. 기본적으로 Vite는 매니페스트에 `integrity` 해시를 포함하지 않지만, [vite-plugin-manifest-sri](https://www.npmjs.com/package/vite-plugin-manifest-sri) NPM 플러그인을 설치하여 활성화할 수 있습니다:

```shell
npm install --save-dev vite-plugin-manifest-sri
```

그런 다음, `vite.config.js` 파일에서 이 플러그인을 활성화할 수 있습니다:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import manifestSRI from 'vite-plugin-manifest-sri';// [!code ++]

export default defineConfig({
    plugins: [
        laravel({
            // ...
        }),
        manifestSRI(),// [!code ++]
    ],
});
```

필요하다면, 무결성 해시가 저장된 매니페스트 키를 커스터마이즈할 수도 있습니다:

```php
use Illuminate\Support\Facades\Vite;

Vite::useIntegrityKey('custom-integrity-key');
```

이 자동 감지를 완전히 비활성화하려면, `useIntegrityKey` 메서드에 `false`를 전달하면 됩니다:

```php
Vite::useIntegrityKey(false);
```


### 임의 속성 {#arbitrary-attributes}

스크립트 및 스타일 태그에 [data-turbo-track](https://turbo.hotwired.dev/handbook/drive#reloading-when-assets-change) 속성과 같은 추가 속성을 포함해야 하는 경우, `useScriptTagAttributes` 및 `useStyleTagAttributes` 메서드를 통해 지정할 수 있습니다. 일반적으로 이 메서드는 [서비스 프로바이더](/laravel/12.x/providers)에서 호출해야 합니다:

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

조건부로 속성을 추가해야 한다면, 에셋 소스 경로, URL, 매니페스트 청크, 전체 매니페스트를 인자로 받는 콜백을 전달할 수 있습니다:

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
> Vite 개발 서버가 실행 중일 때는 `$chunk`와 `$manifest` 인자가 `null`입니다.


## 고급 커스터마이징 {#advanced-customization}

기본적으로, Laravel의 Vite 플러그인은 대부분의 애플리케이션에 적합한 합리적인 규칙을 사용합니다. 하지만, 때로는 Vite의 동작을 커스터마이즈해야 할 수도 있습니다. 추가 커스터마이징 옵션을 활성화하려면, `@vite` Blade 디렉티브 대신 다음과 같은 메서드와 옵션을 사용할 수 있습니다:

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


### 개발 서버 CORS {#cors}

브라우저에서 Vite 개발 서버의 에셋을 가져올 때 CORS(교차 출처 리소스 공유) 문제가 발생한다면, 커스텀 오리진에 대한 접근 권한을 개발 서버에 부여해야 할 수 있습니다. Laravel 플러그인과 결합된 Vite는 다음 오리진을 추가 설정 없이 허용합니다:

- `::1`
- `127.0.0.1`
- `localhost`
- `*.test`
- `*.localhost`
- 프로젝트 `.env`의 `APP_URL`

프로젝트에 커스텀 오리진을 허용하는 가장 쉬운 방법은, 애플리케이션의 `APP_URL` 환경 변수가 브라우저에서 접속하는 오리진과 일치하도록 하는 것입니다. 예를 들어, `https://my-app.laravel`에 접속한다면, `.env`를 다음과 같이 수정해야 합니다:

```env
APP_URL=https://my-app.laravel
```

여러 오리진을 지원하는 등 더 세밀한 제어가 필요하다면, [Vite의 유연한 내장 CORS 서버 설정](https://vite.dev/config/server-options.html#server-cors)을 활용해야 합니다. 예를 들어, 프로젝트의 `vite.config.js` 파일에서 `server.cors.origin` 설정 옵션에 여러 오리진을 지정할 수 있습니다:

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

정규식 패턴도 포함할 수 있어, 예를 들어 `*.laravel`과 같은 최상위 도메인에 대해 모든 오리진을 허용할 수 있습니다:

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
                // 지원: SCHEME://DOMAIN.laravel[:PORT] [!code ++]
                /^https?:\/\/.*\.laravel(:\d+)?$/, //[!code ++]
            ], // [!code ++]
        }, // [!code ++]
    }, // [!code ++]
});
```


### 개발 서버 URL 수정 {#correcting-dev-server-urls}

Vite 생태계 내 일부 플러그인은 슬래시(`/`)로 시작하는 URL이 항상 Vite 개발 서버를 가리킨다고 가정합니다. 하지만, Laravel 통합의 특성상 항상 그런 것은 아닙니다.

예를 들어, `vite-imagetools` 플러그인은 에셋을 제공할 때 다음과 같은 URL을 출력합니다:

```html
<img src="/@imagetools/f0b2f404b13f052c604e632f2fb60381bf61a520">
```

`vite-imagetools` 플러그인은 출력된 URL이 Vite에 의해 가로채어지고, `/@imagetools`로 시작하는 모든 URL을 플러그인이 처리할 수 있기를 기대합니다. 이러한 동작을 기대하는 플러그인을 사용하는 경우, URL을 수동으로 수정해야 합니다. `vite.config.js` 파일에서 `transformOnServe` 옵션을 사용하여 이를 처리할 수 있습니다.

이 예시에서는, 생성된 코드 내 모든 `/@imagetools` 앞에 개발 서버 URL을 붙입니다:

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

이제 Vite가 에셋을 제공하는 동안, 개발 서버를 가리키는 URL이 출력됩니다:

```html
- <img src="/@imagetools/f0b2f404b13f052c604e632f2fb60381bf61a520"><!-- [!code --] -->
+ <img src="http://[::1]:5173/@imagetools/f0b2f404b13f052c604e632f2fb60381bf61a520"><!-- [!code ++] -->
```
