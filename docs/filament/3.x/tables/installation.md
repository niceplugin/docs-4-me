---
title: 설치
---
# [테이블] 설치
**Table Builder 패키지는 [Panel Builder](/filament/3.x/panels/getting-started)와 함께 사전 설치되어 있습니다.** 이 가이드는 Table Builder를 커스텀 TALL Stack 애플리케이션(Tailwind, Alpine, Livewire, Laravel)에서 사용하는 방법에 대한 안내입니다.

## 요구 사항 {#requirements}

Filament를 실행하려면 다음이 필요합니다:

- PHP 8.1+
- Laravel v10.0+
- Livewire v3.0+
- Tailwind v3.0+ [(Tailwind v4를 사용 중이신가요?)](#installing-tailwind-css)

## 설치 {#installation}

Composer를 사용하여 Table Builder 패키지를 설치하세요:

```bash
composer require filament/tables:"^3.3" -W
```

## 새로운 Laravel 프로젝트 {#new-laravel-projects}

새로운 Laravel 프로젝트에서 Filament를 빠르게 시작하려면, 다음 명령어를 실행하여 [Livewire](https://livewire.laravel.com), [Alpine.js](https://alpinejs.dev), [Tailwind CSS](https://tailwindcss.com)를 설치하세요:

> 이 명령어들은 애플리케이션의 기존 파일을 덮어쓸 수 있으므로, 새로운 Laravel 프로젝트에서만 실행하세요!

```bash
php artisan filament:install --scaffold --tables

npm install

npm run dev
```

## 기존 Laravel 프로젝트 {#existing-laravel-projects}

다음 명령어를 실행하여 Table Builder 에셋을 설치하세요:

```bash
php artisan filament:install --tables
```

### Tailwind CSS 설치 {#installing-tailwind-css}

> Filament는 스타일링을 위해 Tailwind CSS v3를 사용합니다. 프로젝트에서 Tailwind CSS v4를 사용 중이라면, Filament를 사용하기 위해 v3로 다운그레이드해야 합니다. Tailwind CSS v4는 호환성에 문제가 있으므로 Filament v3에서는 지원하지 않습니다. Filament v4에서 Tailwind CSS v4를 지원할 예정입니다.

다음 명령어를 실행하여 Tailwind CSS와 Tailwind Forms, Typography 플러그인을 설치하세요:

```bash
npm install tailwindcss@3 @tailwindcss/forms @tailwindcss/typography postcss postcss-nesting autoprefixer --save-dev
```

새로운 `tailwind.config.js` 파일을 생성하고 Filament `preset`을 추가하세요 *(Filament 색상 스킴과 필수 Tailwind 플러그인을 포함합니다)*:

```js
import preset from './vendor/filament/support/tailwind.config.preset'

export default {
    presets: [preset],
    content: [
        './app/Filament/**/*.php',
        './resources/views/filament/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
    ],
}
```

### 스타일 구성 {#configuring-styles}

Tailwind의 CSS 레이어를 `resources/css/app.css`에 추가하세요:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind variants;
```

프로젝트 루트에 `postcss.config.js` 파일을 생성하고 Tailwind CSS, PostCSS Nesting, Autoprefixer를 플러그인으로 등록하세요:

```js
export default {
    plugins: {
        'tailwindcss/nesting': 'postcss-nesting',
        tailwindcss: {},
        autoprefixer: {},
    },
}
```

### 브라우저 자동 새로고침 설정 {#automatically-refreshing-the-browser}
Livewire 컴포넌트가 업데이트될 때 페이지가 자동으로 새로고침되도록 `vite.config.js` 파일을 다음과 같이 수정할 수 있습니다:

```js
import { defineConfig } from 'vite'
import laravel, { refreshPaths } from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: [
                ...refreshPaths,
                'app/Livewire/**',
            ],
        }),
    ],
})
```

### 에셋 컴파일 {#compiling-assets}

`npm run dev`를 사용하여 새로운 CSS 및 Javascript 에셋을 컴파일하세요.

### 레이아웃 구성 {#configuring-your-layout}

Livewire 컴포넌트를 위한 새로운 `resources/views/components/layouts/app.blade.php` 레이아웃 파일을 생성하세요:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">

        <meta name="application-name" content="{{ config('app.name') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

        <style>
            [x-cloak] {
                display: none !important;
            }
        </style>

        @filamentStyles
        @vite('resources/css/app.css')
    </head>

    <body class="antialiased">
        {{ $slot }}

        @filamentScripts
        @vite('resources/js/app.js')
    </body>
</html>
```

## 설정 파일 퍼블리싱 {#publishing-configuration}

다음 명령어를 사용하여 패키지 설정 파일을 퍼블리시할 수 있습니다(선택 사항):

```bash
php artisan vendor:publish --tag=filament-config
```

## 업그레이드 {#upgrading}

> Filament v2에서 업그레이드하시나요? [업그레이드 가이드](https://filamentphp.com/docs/3.x/tables/upgrade-guide)를 참고하세요.

Filament는 `composer update`를 실행할 때 자동으로 최신의 비파괴(non-breaking) 버전으로 업그레이드됩니다. 업데이트 후에는 모든 Laravel 캐시를 비우고, 프론트엔드 에셋을 다시 퍼블리시해야 합니다. 이 모든 작업은 `filament:upgrade` 명령어로 한 번에 처리할 수 있으며, 이 명령어는 처음 `filament:install`을 실행할 때 `composer.json` 파일에 추가됩니다:

```json
"post-autoload-dump": [
    // ...
    "@php artisan filament:upgrade"
],
```

`filament:upgrade`는 실제로 업데이트 과정을 처리하지 않으며, Composer가 이미 처리합니다. `post-autoload-dump` 후크 없이 수동으로 업그레이드하는 경우, 직접 명령어를 실행할 수 있습니다:

```bash
composer update

php artisan filament:upgrade
```
