# [시작하기] 프론트엔드












## 소개 {#introduction}

Laravel은 [라우팅](/laravel/12.x/routing), [유효성 검사](/laravel/12.x/validation), [캐싱](/laravel/12.x/cache), [큐](/laravel/12.x/queues), [파일 저장소](/laravel/12.x/filesystem) 등 현대적인 웹 애플리케이션을 구축하는 데 필요한 모든 기능을 제공하는 백엔드 프레임워크입니다. 하지만 저희는 개발자에게 강력한 프론트엔드 구축 방식을 포함한 아름다운 풀스택 경험을 제공하는 것이 중요하다고 생각합니다.

Laravel로 애플리케이션을 개발할 때 프론트엔드 개발을 진행하는 주요 방법은 두 가지가 있으며, 어떤 방식을 선택할지는 PHP를 활용할지, 아니면 Vue나 React와 같은 JavaScript 프레임워크를 사용할지에 따라 달라집니다. 아래에서 이 두 가지 옵션에 대해 자세히 설명하니, 여러분의 애플리케이션에 가장 적합한 프론트엔드 개발 방식을 선택하는 데 도움이 될 것입니다.


## PHP 사용 {#using-php}


### PHP와 Blade {#php-and-blade}

과거에는 대부분의 PHP 애플리케이션이 데이터베이스에서 요청 시 가져온 데이터를 PHP의 `echo` 문과 함께 간단한 HTML 템플릿에 삽입하여 브라우저에 HTML을 렌더링했습니다:

```blade
<div>
    <?php foreach ($users as $user): ?>
        Hello, <?php echo $user->name; ?> <br />
    <?php endforeach; ?>
</div>
```

Laravel에서는 이러한 방식의 HTML 렌더링을 [뷰(views)](/laravel/12.x/views)와 [Blade](/laravel/12.x/blade)를 사용하여 여전히 구현할 수 있습니다. Blade는 데이터를 출력하거나, 데이터를 반복 처리하는 등 다양한 작업을 간결하고 편리한 문법으로 제공하는 매우 가벼운 템플릿 언어입니다:

```blade
<div>
    @foreach ($users as $user)
        Hello, {{ $user->name }} <br />
    @endforeach
</div>
```

이와 같은 방식으로 애플리케이션을 구축할 때, 폼 제출이나 기타 페이지 상호작용이 발생하면 서버로부터 완전히 새로운 HTML 문서를 받아오고, 브라우저는 전체 페이지를 다시 렌더링합니다. 오늘날에도 많은 애플리케이션이 단순한 Blade 템플릿을 사용하여 프론트엔드를 구성하는 방식에 완벽하게 적합할 수 있습니다.


#### 높아지는 기대치 {#growing-expectations}

하지만 웹 애플리케이션에 대한 사용자들의 기대가 높아지면서, 많은 개발자들은 더욱 세련되고 동적인 프론트엔드를 구축할 필요성을 느끼게 되었습니다. 이러한 흐름에 따라 일부 개발자들은 Vue나 React와 같은 JavaScript 프레임워크를 사용해 애플리케이션의 프론트엔드를 구축하기 시작했습니다.

반면, 자신이 익숙한 백엔드 언어를 계속 사용하고자 하는 개발자들은 주로 백엔드 언어를 활용하면서도 현대적인 웹 애플리케이션 UI를 만들 수 있는 다양한 솔루션을 개발해왔습니다. 예를 들어, [Rails](https://rubyonrails.org/) 생태계에서는 [Turbo](https://turbo.hotwired.dev/), [Hotwire](https://hotwired.dev/), [Stimulus](https://stimulus.hotwired.dev/)와 같은 라이브러리가 등장하게 되었습니다.

Laravel 생태계에서도 PHP를 주로 사용하여 현대적이고 동적인 프론트엔드를 만들고자 하는 요구가 [Laravel Livewire](https://livewire.laravel.com)와 [Alpine.js](https://alpinejs.dev/)의 탄생으로 이어졌습니다.


### Livewire {#livewire}

[Laravel Livewire](https://livewire.laravel.com)는 Vue나 React와 같은 최신 JavaScript 프레임워크로 구축된 프론트엔드처럼 동적이고 현대적이며 생동감 있는 Laravel 기반 프론트엔드를 만들 수 있도록 해주는 프레임워크입니다.

Livewire를 사용할 때는 UI의 특정 부분을 렌더링하고, 프론트엔드에서 호출하거나 상호작용할 수 있는 메서드와 데이터를 노출하는 Livewire "컴포넌트"를 생성하게 됩니다. 예를 들어, 간단한 "카운터" 컴포넌트는 다음과 같이 작성할 수 있습니다:

```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 0;

    public function increment()
    {
        $this->count++;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

그리고 카운터에 해당하는 템플릿은 다음과 같이 작성할 수 있습니다:

```blade
<div>
    <button wire:click="increment">+</button>
    <h1>{{ $count }}</h1>
</div>
```

보시다시피, Livewire를 사용하면 `wire:click`과 같은 새로운 HTML 속성을 작성하여 Laravel 애플리케이션의 프론트엔드와 백엔드를 연결할 수 있습니다. 또한, 간단한 Blade 표현식을 사용해 컴포넌트의 현재 상태를 렌더링할 수 있습니다.

많은 개발자들에게 Livewire는 Laravel 기반 프론트엔드 개발에 혁신을 가져다주었으며, Laravel의 익숙한 환경 안에서 현대적이고 동적인 웹 애플리케이션을 구축할 수 있게 해주었습니다. 일반적으로 Livewire를 사용하는 개발자들은 [Alpine.js](https://alpinejs.dev/)도 함께 활용하여, 예를 들어 다이얼로그 창을 렌더링하는 등 필요한 부분에만 JavaScript를 "살짝" 추가합니다.

Laravel을 처음 접하는 경우, 먼저 [뷰(views)](/laravel/12.x/views)와 [Blade](/laravel/12.x/blade)의 기본 사용법을 익히는 것을 추천합니다. 그 후, 공식 [Laravel Livewire 문서](https://livewire.laravel.com/docs)를 참고하여 인터랙티브한 Livewire 컴포넌트로 애플리케이션을 한 단계 더 발전시켜 보세요.


### 스타터 키트 {#php-starter-kits}

PHP와 Livewire를 사용하여 프론트엔드를 구축하고 싶다면, [Livewire 스타터 키트](/laravel/12.x/starter-kits)를 활용하여 애플리케이션 개발을 빠르게 시작할 수 있습니다.


## React 또는 Vue 사용하기 {#using-react-or-vue}

Laravel과 Livewire를 사용해 현대적인 프론트엔드를 구축할 수 있지만, 여전히 많은 개발자들은 React나 Vue와 같은 JavaScript 프레임워크의 강력함을 활용하는 것을 선호합니다. 이를 통해 NPM을 통해 제공되는 풍부한 JavaScript 패키지와 도구 생태계를 활용할 수 있습니다.

하지만 추가적인 도구 없이 Laravel을 React나 Vue와 결합하면, 클라이언트 사이드 라우팅, 데이터 하이드레이션, 인증 등 다양한 복잡한 문제를 직접 해결해야 합니다. 클라이언트 사이드 라우팅은 [Next](https://nextjs.org/)나 [Nuxt](https://nuxt.com/)와 같은 방향성이 뚜렷한 React/Vue 프레임워크를 사용하면 간소화할 수 있지만, 데이터 하이드레이션과 인증 문제는 Laravel과 같은 백엔드 프레임워크를 이러한 프론트엔드 프레임워크와 결합할 때 여전히 복잡하고 번거로운 과제로 남아 있습니다.

또한, 개발자들은 두 개의 별도 코드 저장소를 관리해야 하며, 두 저장소의 유지보수, 릴리스, 배포를 조율해야 하는 부담도 생깁니다. 이러한 문제들이 극복 불가능한 것은 아니지만, 저희는 이것이 생산적이거나 즐거운 애플리케이션 개발 방식이라고 생각하지 않습니다.


### Inertia {#inertia}

다행히도, Laravel은 두 가지 방식의 장점을 모두 누릴 수 있는 방법을 제공합니다. [Inertia](https://inertiajs.com)는 Laravel 애플리케이션과 현대적인 React 또는 Vue 프론트엔드 사이의 간극을 메워주어, 라우팅, 데이터 하이드레이션, 인증 등은 Laravel의 라우트와 컨트롤러를 활용하면서도 React나 Vue로 완성도 높은 현대적 프론트엔드를 구축할 수 있게 해줍니다. 이 모든 것이 하나의 코드 저장소 내에서 이루어집니다. 이 접근 방식으로, Laravel과 React/Vue의 모든 강점을 온전히 활용할 수 있으며, 어느 한 쪽의 기능도 제한받지 않습니다.

Laravel 애플리케이션에 Inertia를 설치한 후에는 기존과 동일하게 라우트와 컨트롤러를 작성하면 됩니다. 다만, 컨트롤러에서 Blade 템플릿을 반환하는 대신 Inertia 페이지를 반환하게 됩니다:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * 주어진 사용자의 프로필을 보여줍니다.
     */
    public function show(string $id): Response
    {
        return Inertia::render('users/show', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```

Inertia 페이지는 React 또는 Vue 컴포넌트에 해당하며, 일반적으로 애플리케이션의 `resources/js/pages` 디렉터리에 저장됩니다. `Inertia::render` 메서드를 통해 페이지에 전달된 데이터는 해당 페이지 컴포넌트의 "props"로 하이드레이션됩니다:

```jsx
import Layout from '@/layouts/authenticated';
import { Head } from '@inertiajs/react';

export default function Show({ user }) {
    return (
        <Layout>
            <Head title="Welcome" />
            <h1>Welcome</h1>
            <p>Hello {user.name}, welcome to Inertia.</p>
        </Layout>
    )
}
```

보시다시피, Inertia를 사용하면 프론트엔드 개발 시 React나 Vue의 모든 기능을 온전히 활용할 수 있으며, Laravel 기반 백엔드와 JavaScript 기반 프론트엔드 사이를 가볍게 연결해주는 역할을 합니다.

#### 서버 사이드 렌더링

애플리케이션에 서버 사이드 렌더링이 필요해서 Inertia 도입을 망설이고 있다면 걱정하지 않으셔도 됩니다. Inertia는 [서버 사이드 렌더링 지원](https://inertiajs.com/server-side-rendering)을 제공합니다. 또한, [Laravel Cloud](https://cloud.laravel.com)나 [Laravel Forge](https://forge.laravel.com)를 통해 애플리케이션을 배포할 때도 Inertia의 서버 사이드 렌더링 프로세스가 항상 실행되도록 손쉽게 설정할 수 있습니다.


### 스타터 키트 {#inertia-starter-kits}

Inertia와 Vue 또는 React를 사용해 프론트엔드를 구축하고 싶다면, [React 또는 Vue 애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 활용하여 애플리케이션 개발을 빠르게 시작할 수 있습니다. 이 스타터 키트들은 Inertia, Vue/React, [Tailwind](https://tailwindcss.com), [Vite](https://vitejs.dev)를 사용해 애플리케이션의 백엔드와 프론트엔드 인증 플로우를 자동으로 구성해주므로, 여러분은 곧바로 다음 멋진 아이디어를 개발하는 데 집중할 수 있습니다.


## 에셋 번들링 {#bundling-assets}

Blade와 Livewire를 사용하든, Vue/React와 Inertia를 사용하든, 애플리케이션의 CSS를 프로덕션 환경에 적합한 에셋으로 번들링해야 할 필요가 있습니다. 물론, Vue나 React로 프론트엔드를 구축하는 경우에는 컴포넌트도 브라우저에서 사용할 수 있는 JavaScript 에셋으로 번들링해야 합니다.

Laravel은 기본적으로 [Vite](https://vitejs.dev)를 사용하여 에셋을 번들링합니다. Vite는 매우 빠른 빌드 속도와, 로컬 개발 시 거의 즉각적인 Hot Module Replacement(HMR)를 제공합니다. 모든 새로운 Laravel 애플리케이션(스타터 키트 포함)에는 `vite.config.js` 파일이 포함되어 있으며, 이 파일은 Laravel 애플리케이션에서 Vite를 더욱 편리하게 사용할 수 있도록 가벼운 Laravel Vite 플러그인을 로드합니다.

Laravel과 Vite를 가장 빠르게 시작하는 방법은 [애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 사용해 개발을 시작하는 것입니다. 이 스타터 키트는 프론트엔드와 백엔드 인증 스캐폴딩을 제공하여 애플리케이션 개발을 빠르게 시작할 수 있게 해줍니다.

> [!NOTE]
> Laravel에서 Vite를 활용하는 방법에 대한 더 자세한 문서는 [에셋 번들링 및 컴파일 전용 문서](/laravel/12.x/vite)를 참고하세요.
