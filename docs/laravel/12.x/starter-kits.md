# 스타터 키트

















## 소개 {#introduction}

새로운 Laravel 애플리케이션을 빠르게 시작할 수 있도록 [애플리케이션 스타터 키트](https://laravel.com/starter-kits)를 제공합니다. 이 스타터 키트는 다음 Laravel 애플리케이션을 구축하는 데 필요한 라우트, 컨트롤러, 뷰를 포함하여 사용자 등록 및 인증 기능을 빠르게 구현할 수 있도록 도와줍니다.

이 스타터 키트를 사용하는 것은 선택 사항이며, 반드시 사용해야 하는 것은 아닙니다. 원한다면 Laravel의 새 복사본을 설치하여 처음부터 직접 애플리케이션을 구축할 수도 있습니다. 어떤 방법을 선택하든 멋진 결과를 만들어낼 수 있을 것입니다!


## 스타터 키트를 사용한 애플리케이션 생성 {#creating-an-application}

스타터 키트 중 하나를 사용하여 새로운 Laravel 애플리케이션을 생성하려면 먼저 [PHP와 Laravel CLI 도구를 설치](/laravel/12.x/installation#installing-php)해야 합니다. 이미 PHP와 Composer가 설치되어 있다면, Composer를 통해 Laravel 설치기 CLI 도구를 설치할 수 있습니다:

```shell
composer global require laravel/installer
```

그런 다음, Laravel 설치기 CLI를 사용하여 새로운 Laravel 애플리케이션을 생성하세요. 설치기는 선호하는 스타터 키트를 선택하라는 안내를 제공합니다:

```shell
laravel new my-app
```

Laravel 애플리케이션을 생성한 후에는 NPM을 통해 프론트엔드 의존성을 설치하고 Laravel 개발 서버를 시작하면 됩니다:

```shell
cd my-app
npm install && npm run build
composer run dev
```

Laravel 개발 서버를 시작하면, 웹 브라우저에서 `http://localhost:8000` 주소로 애플리케이션에 접속할 수 있습니다.


## 사용 가능한 스타터 키트 {#available-starter-kits}


### React {#react}

React 스타터 키트는 [Inertia](https://inertiajs.com)를 사용하여 React 프론트엔드와 함께 Laravel 애플리케이션을 구축할 수 있는 견고하고 현대적인 출발점을 제공합니다.

Inertia를 통해 고전적인 서버 사이드 라우팅과 컨트롤러를 사용하면서도 현대적인 싱글 페이지 React 애플리케이션을 만들 수 있습니다. 이를 통해 React의 강력한 프론트엔드 기능과 Laravel의 뛰어난 백엔드 생산성, 그리고 번개처럼 빠른 Vite 컴파일을 동시에 누릴 수 있습니다.

React 스타터 키트는 React 19, TypeScript, Tailwind, 그리고 [shadcn/ui](https://ui.shadcn.com) 컴포넌트 라이브러리를 사용합니다.


### Vue {#vue}

Vue 스타터 키트는 [Inertia](https://inertiajs.com)를 사용하여 Vue 프론트엔드와 함께 Laravel 애플리케이션을 구축할 수 있는 훌륭한 출발점을 제공합니다.

Inertia를 통해 고전적인 서버 사이드 라우팅과 컨트롤러를 사용하면서도 현대적인 싱글 페이지 Vue 애플리케이션을 만들 수 있습니다. 이를 통해 Vue의 강력한 프론트엔드 기능과 Laravel의 뛰어난 백엔드 생산성, 그리고 번개처럼 빠른 Vite 컴파일을 동시에 누릴 수 있습니다.

Vue 스타터 키트는 Vue Composition API, TypeScript, Tailwind, 그리고 [shadcn-vue](https://www.shadcn-vue.com/) 컴포넌트 라이브러리를 사용합니다.


### Livewire {#livewire}

Livewire 스타터 키트는 [Laravel Livewire](https://livewire.laravel.com) 프론트엔드를 사용하여 Laravel 애플리케이션을 구축할 수 있는 완벽한 출발점을 제공합니다.

Livewire는 PHP만으로 동적이고 반응형인 프론트엔드 UI를 구축할 수 있는 강력한 방법입니다. Blade 템플릿을 주로 사용하는 팀이나 React, Vue와 같은 자바스크립트 기반 SPA 프레임워크보다 더 간단한 대안을 찾는 팀에 적합합니다.

Livewire 스타터 키트는 Livewire, Tailwind, 그리고 [Flux UI](https://fluxui.dev) 컴포넌트 라이브러리를 사용합니다.


## 스타터 키트 커스터마이징 {#starter-kit-customization}


### React {#react-customization}

React 스타터 키트는 Inertia 2, React 19, Tailwind 4, 그리고 [shadcn/ui](https://ui.shadcn.com)로 구축되었습니다. 모든 스타터 키트와 마찬가지로, 백엔드와 프론트엔드 코드가 모두 애플리케이션 내에 존재하므로 완전한 커스터마이징이 가능합니다.

프론트엔드 코드의 대부분은 `resources/js` 디렉터리에 위치합니다. 애플리케이션의 외관과 동작을 커스터마이징하기 위해 코드를 자유롭게 수정할 수 있습니다:

```text
resources/js/
├── components/    # 재사용 가능한 React 컴포넌트
├── hooks/         # React 훅
├── layouts/       # 애플리케이션 레이아웃
├── lib/           # 유틸리티 함수 및 설정
├── pages/         # 페이지 컴포넌트
└── types/         # TypeScript 정의
```

추가적인 shadcn 컴포넌트를 퍼블리시하려면, 먼저 [퍼블리시할 컴포넌트를 찾고](https://ui.shadcn.com) `npx`를 사용해 컴포넌트를 퍼블리시하세요:

```shell
npx shadcn@latest add switch
```

이 예시에서 명령어는 Switch 컴포넌트를 `resources/js/components/ui/switch.tsx`에 퍼블리시합니다. 컴포넌트가 퍼블리시된 후에는 원하는 페이지에서 사용할 수 있습니다:

```jsx
import { Switch } from "@/components/ui/switch"

const MyPage = () => {
  return (
    <div>
      <Switch />
    </div>
  );
};

export default MyPage;
```


#### 사용 가능한 레이아웃 {#react-available-layouts}

React 스타터 키트에는 "sidebar" 레이아웃과 "header" 레이아웃, 두 가지 주요 레이아웃이 포함되어 있습니다. 기본값은 sidebar 레이아웃이지만, 애플리케이션의 `resources/js/layouts/app-layout.tsx` 파일 상단에서 임포트하는 레이아웃을 수정하여 header 레이아웃으로 변경할 수 있습니다:

```js
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'; // [!code --]
import AppLayoutTemplate from '@/layouts/app/app-header-layout'; // [!code ++]
```


#### 사이드바 변형 {#react-sidebar-variants}

사이드바 레이아웃에는 기본 사이드바, "inset" 변형, "floating" 변형 등 세 가지 변형이 포함되어 있습니다. `resources/js/components/app-sidebar.tsx` 컴포넌트를 수정하여 원하는 변형을 선택할 수 있습니다:

```text
<Sidebar collapsible="icon" variant="sidebar"> [!code --]
<Sidebar collapsible="icon" variant="inset"> [!code ++]
```


#### 인증 페이지 레이아웃 변형 {#react-authentication-page-layout-variants}

React 스타터 키트에 포함된 로그인, 회원가입 등 인증 페이지는 "simple", "card", "split" 세 가지 레이아웃 변형을 제공합니다.

인증 레이아웃을 변경하려면, 애플리케이션의 `resources/js/layouts/auth-layout.tsx` 파일 상단에서 임포트하는 레이아웃을 수정하세요:

```js
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout'; // [!code --]
import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout'; // [!code ++]
```


### Vue {#vue-customization}

Vue 스타터 키트는 Inertia 2, Vue 3 Composition API, Tailwind, 그리고 [shadcn-vue](https://www.shadcn-vue.com/)로 구축되었습니다. 모든 스타터 키트와 마찬가지로, 백엔드와 프론트엔드 코드가 모두 애플리케이션 내에 존재하므로 완전한 커스터마이징이 가능합니다.

프론트엔드 코드의 대부분은 `resources/js` 디렉터리에 위치합니다. 애플리케이션의 외관과 동작을 커스터마이징하기 위해 코드를 자유롭게 수정할 수 있습니다:

```text
resources/js/
├── components/    # 재사용 가능한 Vue 컴포넌트
├── composables/   # Vue 컴포저블/훅
├── layouts/       # 애플리케이션 레이아웃
├── lib/           # 유틸리티 함수 및 설정
├── pages/         # 페이지 컴포넌트
└── types/         # TypeScript 정의
```

추가적인 shadcn-vue 컴포넌트를 퍼블리시하려면, 먼저 [퍼블리시할 컴포넌트를 찾고](https://www.shadcn-vue.com) `npx`를 사용해 컴포넌트를 퍼블리시하세요:

```shell
npx shadcn-vue@latest add switch
```

이 예시에서 명령어는 Switch 컴포넌트를 `resources/js/components/ui/Switch.vue`에 퍼블리시합니다. 컴포넌트가 퍼블리시된 후에는 원하는 페이지에서 사용할 수 있습니다:

```vue
<script setup lang="ts">
import { Switch } from '@/Components/ui/switch'
</script>

<template>
    <div>
        <Switch />
    </div>
</template>
```


#### 사용 가능한 레이아웃 {#vue-available-layouts}

Vue 스타터 키트에는 "sidebar" 레이아웃과 "header" 레이아웃, 두 가지 주요 레이아웃이 포함되어 있습니다. 기본값은 sidebar 레이아웃이지만, 애플리케이션의 `resources/js/layouts/AppLayout.vue` 파일 상단에서 임포트하는 레이아웃을 수정하여 header 레이아웃으로 변경할 수 있습니다:

```js
import AppLayout from '@/layouts/app/AppSidebarLayout.vue'; // [!code --]
import AppLayout from '@/layouts/app/AppHeaderLayout.vue'; // [!code ++]
```


#### 사이드바 변형 {#vue-sidebar-variants}

사이드바 레이아웃에는 기본 사이드바, "inset" 변형, "floating" 변형 등 세 가지 변형이 포함되어 있습니다. `resources/js/components/AppSidebar.vue` 컴포넌트를 수정하여 원하는 변형을 선택할 수 있습니다:

```text
<Sidebar collapsible="icon" variant="sidebar"> [!code --]
<Sidebar collapsible="icon" variant="inset"> [!code ++]
```


#### 인증 페이지 레이아웃 변형 {#vue-authentication-page-layout-variants}

Vue 스타터 키트에 포함된 로그인, 회원가입 등 인증 페이지는 "simple", "card", "split" 세 가지 레이아웃 변형을 제공합니다.

인증 레이아웃을 변경하려면, 애플리케이션의 `resources/js/layouts/AuthLayout.vue` 파일 상단에서 임포트하는 레이아웃을 수정하세요:

```js
import AuthLayout from '@/layouts/auth/AuthSimpleLayout.vue'; // [!code --]
import AuthLayout from '@/layouts/auth/AuthSplitLayout.vue'; // [!code ++]
```


### Livewire {#livewire-customization}

Livewire 스타터 키트는 Livewire 3, Tailwind, 그리고 [Flux UI](https://fluxui.dev/)로 구축되었습니다. 모든 스타터 키트와 마찬가지로, 백엔드와 프론트엔드 코드가 모두 애플리케이션 내에 존재하므로 완전한 커스터마이징이 가능합니다.

#### Livewire와 Volt

프론트엔드 코드의 대부분은 `resources/views` 디렉터리에 위치합니다. 애플리케이션의 외관과 동작을 커스터마이징하기 위해 코드를 자유롭게 수정할 수 있습니다:

```text
resources/views
├── components            # 재사용 가능한 Livewire 컴포넌트
├── flux                  # 커스터마이징된 Flux 컴포넌트
├── livewire              # Livewire 페이지
├── partials              # 재사용 가능한 Blade 파셜
├── dashboard.blade.php   # 인증된 사용자 대시보드
├── welcome.blade.php     # 게스트 사용자 환영 페이지
```

#### 전통적인 Livewire 컴포넌트

프론트엔드 코드는 `resouces/views` 디렉터리에 위치하며, `app/Livewire` 디렉터리에는 Livewire 컴포넌트의 백엔드 로직이 포함되어 있습니다.


#### 사용 가능한 레이아웃 {#livewire-available-layouts}

Livewire 스타터 키트에는 "sidebar" 레이아웃과 "header" 레이아웃, 두 가지 주요 레이아웃이 포함되어 있습니다. 기본값은 sidebar 레이아웃이지만, 애플리케이션의 `resources/views/components/layouts/app.blade.php` 파일에서 사용하는 레이아웃을 수정하여 header 레이아웃으로 변경할 수 있습니다. 또한, 메인 Flux 컴포넌트에 `container` 속성을 추가해야 합니다:

```blade
<x-layouts.app.header>
    <flux:main container>
        {{ $slot }}
    </flux:main>
</x-layouts.app.header>
```


#### 인증 페이지 레이아웃 변형 {#livewire-authentication-page-layout-variants}

Livewire 스타터 키트에 포함된 로그인, 회원가입 등 인증 페이지는 "simple", "card", "split" 세 가지 레이아웃 변형을 제공합니다.

인증 레이아웃을 변경하려면, 애플리케이션의 `resources/views/components/layouts/auth.blade.php` 파일에서 사용하는 레이아웃을 수정하세요:

```blade
<x-layouts.auth.split>
    {{ $slot }}
</x-layouts.auth.split>
```


## WorkOS AuthKit 인증 {#workos}

기본적으로 React, Vue, Livewire 스타터 키트는 모두 Laravel의 내장 인증 시스템을 사용하여 로그인, 회원가입, 비밀번호 재설정, 이메일 인증 등 다양한 기능을 제공합니다. 추가로, 각 스타터 키트에는 [WorkOS AuthKit](https://authkit.com) 기반 변형도 제공되며, 다음과 같은 기능을 지원합니다:

<div class="content-list" markdown="1">

- 소셜 인증 (Google, Microsoft, GitHub, Apple)
- 패스키 인증
- 이메일 기반 "매직 인증"
- SSO

</div>

WorkOS를 인증 제공자로 사용하려면 [WorkOS 계정이 필요](https://workos.com)합니다. WorkOS는 월간 활성 사용자 100만 명까지 무료 인증을 제공합니다.

WorkOS AuthKit을 애플리케이션의 인증 제공자로 사용하려면, `laravel new`로 새로운 스타터 키트 기반 애플리케이션을 생성할 때 WorkOS 옵션을 선택하세요.

### WorkOS 스타터 키트 설정

WorkOS 기반 스타터 키트로 새 애플리케이션을 생성한 후, 애플리케이션의 `.env` 파일에 `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URL` 환경 변수를 설정해야 합니다. 이 값들은 WorkOS 대시보드에서 제공받은 값과 일치해야 합니다:

```ini
WORKOS_CLIENT_ID=your-client-id
WORKOS_API_KEY=your-api-key
WORKOS_REDIRECT_URL="${APP_URL}/authenticate"
```

또한, WorkOS 대시보드에서 애플리케이션 홈페이지 URL을 설정해야 합니다. 이 URL은 사용자가 로그아웃한 후 리디렉션되는 위치입니다.


#### AuthKit 인증 방식 설정 {#configuring-authkit-authentication-methods}

WorkOS 기반 스타터 키트를 사용할 때, 애플리케이션의 WorkOS AuthKit 설정에서 "이메일 + 비밀번호" 인증을 비활성화하고, 소셜 인증 제공자, 패스키, "매직 인증", SSO만 허용하는 것을 권장합니다. 이를 통해 애플리케이션이 사용자 비밀번호를 직접 다루지 않아도 됩니다.


#### AuthKit 세션 타임아웃 설정 {#configuring-authkit-session-timeouts}

또한, WorkOS AuthKit의 세션 비활성화 타임아웃을 Laravel 애플리케이션의 세션 타임아웃 임계값(일반적으로 2시간)과 일치하도록 설정하는 것을 권장합니다.


### Inertia SSR {#inertia-ssr}

React와 Vue 스타터 키트는 Inertia의 [서버 사이드 렌더링](https://inertiajs.com/server-side-rendering) 기능과 호환됩니다. 애플리케이션용 Inertia SSR 호환 번들을 빌드하려면 `build:ssr` 명령어를 실행하세요:

```shell
npm run build:ssr
```

편의를 위해 `composer dev:ssr` 명령어도 제공됩니다. 이 명령어는 SSR 호환 번들을 빌드한 후 Laravel 개발 서버와 Inertia SSR 서버를 시작하여, Inertia의 서버 사이드 렌더링 엔진을 사용해 로컬에서 애플리케이션을 테스트할 수 있습니다:

```shell
composer dev:ssr
```


### 커뮤니티 유지 스타터 키트 {#community-maintained-starter-kits}

Laravel 설치기를 사용해 새로운 Laravel 애플리케이션을 생성할 때, Packagist에 등록된 커뮤니티 유지 스타터 키트를 `--using` 플래그로 지정할 수 있습니다:

```shell
laravel new my-app --using=example/starter-kit
```


#### 스타터 키트 생성 {#creating-starter-kits}

다른 사람들이 사용할 수 있도록 스타터 키트를 제공하려면, [Packagist](https://packagist.org)에 퍼블리시해야 합니다. 스타터 키트는 필요한 환경 변수를 `.env.example` 파일에 정의하고, 필요한 post-installation 명령어는 `composer.json` 파일의 `post-create-project-cmd` 배열에 나열해야 합니다.


### 자주 묻는 질문 {#faqs}


#### 어떻게 업그레이드하나요? {#faq-upgrade}

모든 스타터 키트는 다음 애플리케이션을 위한 견고한 출발점을 제공합니다. 코드에 대한 완전한 소유권이 있으므로, 원하는 대로 수정, 커스터마이징, 확장할 수 있습니다. 하지만 스타터 키트 자체를 업데이트할 필요는 없습니다.


#### 이메일 인증을 활성화하려면 어떻게 하나요? {#faq-enable-email-verification}

이메일 인증은 `App/Models/User.php` 모델에서 `MustVerifyEmail` 임포트를 주석 해제하고, 해당 모델이 `MustVerifyEmail` 인터페이스를 구현하도록 하면 추가할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
// ...

class User extends Authenticatable implements MustVerifyEmail
{
    // ...
}
```

회원가입 후, 사용자는 인증 이메일을 받게 됩니다. 사용자의 이메일이 인증될 때까지 특정 라우트 접근을 제한하려면, 해당 라우트에 `verified` 미들웨어를 추가하세요:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
```

> [!NOTE]
> [WorkOS](#workos) 변형 스타터 키트를 사용하는 경우 이메일 인증이 필수는 아닙니다.


#### 기본 이메일 템플릿을 수정하려면 어떻게 하나요? {#faq-modify-email-template}

애플리케이션의 브랜딩에 맞게 기본 이메일 템플릿을 커스터마이징하고 싶을 수 있습니다. 이 템플릿을 수정하려면 다음 명령어로 이메일 뷰를 애플리케이션에 퍼블리시하세요:

```
php artisan vendor:publish --tag=laravel-mail
```

이 명령어는 `resources/views/vendor/mail`에 여러 파일을 생성합니다. 이 파일들과 `resources/views/vendor/mail/themes/default.css` 파일을 수정하여 기본 이메일 템플릿의 모양과 스타일을 변경할 수 있습니다.
