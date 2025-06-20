# Volt (볼트)
> > [!warning] Livewire에 먼저 익숙해지세요
> Volt를 사용하기 전에, 표준 클래스 기반 Livewire 사용법에 익숙해지는 것을 권장합니다. 이렇게 하면 Livewire에 대한 지식을 Volt의 함수형 API를 사용하여 컴포넌트를 작성하는 데 빠르게 전환할 수 있습니다.

Volt는 Livewire를 위한 우아하게 설계된 함수형 API로, 단일 파일 컴포넌트를 지원하여 컴포넌트의 PHP 로직과 Blade 템플릿이 동일한 파일에 공존할 수 있도록 합니다. 내부적으로 함수형 API는 Livewire 클래스 컴포넌트로 컴파일되고, 동일한 파일에 존재하는 템플릿과 연결됩니다.

간단한 Volt 컴포넌트는 다음과 같습니다:
```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

## 설치 {#installation}

시작하려면 Composer 패키지 관리자를 사용하여 Volt를 프로젝트에 설치하세요:

```bash
composer require livewire/volt
```

Volt를 설치한 후, `volt:install` Artisan 명령어를 실행하여 Volt의 서비스 프로바이더 파일을 애플리케이션에 설치할 수 있습니다. 이 서비스 프로바이더는 Volt가 단일 파일 컴포넌트를 검색할 마운트된 디렉터리를 지정합니다:

```bash
php artisan volt:install
```

## 컴포넌트 생성 {#creating-components}

Volt 컴포넌트는 `.blade.php` 확장자를 가진 파일을 Volt가 마운트한 디렉터리 중 하나에 배치하여 생성할 수 있습니다. 기본적으로 `VoltServiceProvider`는 `resources/views/livewire`와 `resources/views/pages` 디렉터리를 마운트하지만, Volt 서비스 프로바이더의 `boot` 메서드에서 이 디렉터리들을 커스터마이즈할 수 있습니다.

편의를 위해, `make:volt` Artisan 명령어를 사용하여 새 Volt 컴포넌트를 생성할 수 있습니다:

```bash
php artisan make:volt counter
```

컴포넌트를 생성할 때 `--test` 지시어를 추가하면, 해당 테스트 파일도 함께 생성됩니다. 관련 테스트가 [Pest](https://pestphp.com/)를 사용하도록 하려면 `--pest` 플래그를 사용하세요:

```bash
php artisan make:volt counter --test --pest
```


`--class` 지시어를 추가하면 클래스 기반 volt 컴포넌트가 생성됩니다.

```bash
php artisan make:volt counter --class
```

## API 스타일 {#api-style}

Volt의 함수형 API를 활용하면, 가져온 `Livewire\Volt` 함수들을 통해 Livewire 컴포넌트의 로직을 정의할 수 있습니다. Volt는 함수형 코드를 전통적인 Livewire 클래스로 변환 및 컴파일하여, 더 적은 보일러플레이트로 Livewire의 광범위한 기능을 활용할 수 있게 해줍니다.

Volt의 API는 사용하는 모든 클로저를 자동으로 기본 컴포넌트에 바인딩합니다. 따라서 언제든지 액션, 계산 속성, 리스너 등에서 `$this` 변수를 사용하여 컴포넌트를 참조할 수 있습니다:

```php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

// ...
```

### 클래스 기반 Volt 컴포넌트 {#class-based-volt-components}

Volt의 단일 파일 컴포넌트 기능을 누리면서도 클래스 기반 컴포넌트를 작성하고 싶다면, 걱정하지 마세요. 시작하려면 `Livewire\Volt\Component`를 확장하는 익명 클래스를 정의하세요. 클래스 내에서는 전통적인 Livewire 문법을 사용하여 Livewire의 모든 기능을 활용할 수 있습니다:

```blade
<?php

use Livewire\Volt\Component;

new class extends Component {
    public $count = 0;

    public function increment()
    {
        $this->count++;
    }
} ?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

#### 클래스 속성 {#class-attributes}

일반적인 Livewire 컴포넌트와 마찬가지로, Volt 컴포넌트도 클래스 속성을 지원합니다. 익명 PHP 클래스를 사용할 때는 클래스 속성을 `new` 키워드 뒤에 정의해야 합니다:

```blade
<?php

use Livewire\Attributes\{Layout, Title};
use Livewire\Volt\Component;

new
#[Layout('layouts.guest')]
#[Title('Login')]
class extends Component
{
    public string $name = '';

    // ...
```

#### 추가 뷰 데이터 제공 {#providing-additional-view-data}

클래스 기반 Volt 컴포넌트를 사용할 때, 렌더링되는 뷰는 동일한 파일에 존재하는 템플릿입니다. 뷰가 렌더링될 때마다 추가 데이터를 전달해야 한다면, `with` 메서드를 사용할 수 있습니다. 이 데이터는 컴포넌트의 public 속성 외에 뷰로 전달됩니다:

```blade
<?php

use Livewire\WithPagination;
use Livewire\Volt\Component;
use App\Models\Post;

new class extends Component {
    use WithPagination;

    public function with(): array
    {
        return [
            'posts' => Post::paginate(10),
        ];
    }
} ?>

<div>
    <!-- ... -->
</div>
```

#### 뷰 인스턴스 수정 {#modifying-the-view-instance}

때때로 뷰 인스턴스에 직접 접근하여, 예를 들어 번역된 문자열로 뷰의 타이틀을 설정하고 싶을 수 있습니다. 이를 위해 컴포넌트에 `rendering` 메서드를 정의할 수 있습니다:

```blade
<?php

use Illuminate\View\View;
use Livewire\Volt\Component;

new class extends Component {
    public function rendering(View $view): void
    {
        $view->title('Create Post');

        // ...
    }

    // ...
```

## 컴포넌트 렌더링 및 마운트 {#rendering-and-mounting-components}

일반적인 Livewire 컴포넌트와 마찬가지로, Volt 컴포넌트는 Livewire의 태그 문법이나 `@livewire` Blade 지시어를 사용하여 렌더링할 수 있습니다:

```blade
<livewire:user-index :users="$users" />
```

컴포넌트가 허용하는 속성을 선언하려면, `state` 함수를 사용할 수 있습니다:

```php
use function Livewire\Volt\{state};

state('users');

// ...
```

필요하다면, `state` 함수에 클로저를 제공하여 컴포넌트에 전달된 속성을 가로채고, 해당 값을 조작할 수 있습니다:

```php
use function Livewire\Volt\{state};

state(['count' => fn ($users) => count($users)]);
```

`mount` 함수는 Livewire 컴포넌트의 "마운트" [라이프사이클 훅](/livewire/3.x/lifecycle-hooks)을 정의하는 데 사용할 수 있습니다. 컴포넌트에 제공된 파라미터는 이 메서드에 주입됩니다. 마운트 훅에 필요한 다른 파라미터는 Laravel의 서비스 컨테이너에 의해 해결됩니다:

```php
use App\Services\UserCounter;
use function Livewire\Volt\{mount};

mount(function (UserCounter $counter, $users) {
    $counter->store('userCount', count($users));

    // ...
});
```

### 전체 페이지 컴포넌트 {#full-page-components}

선택적으로, 애플리케이션의 `routes/web.php` 파일에 Volt 라우트를 정의하여 Volt 컴포넌트를 전체 페이지 컴포넌트로 렌더링할 수 있습니다:

```php
use Livewire\Volt\Volt;

Volt::route('/users', 'user-index');
```

기본적으로, 컴포넌트는 `components.layouts.app` 레이아웃을 사용하여 렌더링됩니다. `layout` 함수를 사용하여 이 레이아웃 파일을 커스터마이즈할 수 있습니다:

```php
use function Livewire\Volt\{layout, state};

state('users');

layout('components.layouts.admin');

// ...
```

또한, `title` 함수를 사용하여 페이지의 타이틀을 커스터마이즈할 수 있습니다:

```php
use function Livewire\Volt\{layout, state, title};

state('users');

layout('components.layouts.admin');

title('Users');

// ...
```

타이틀이 컴포넌트 상태나 외부 의존성에 따라 달라진다면, `title` 함수에 클로저를 전달할 수도 있습니다:

```php
use function Livewire\Volt\{layout, state, title};

state('users');

layout('components.layouts.admin');

title(fn () => 'Users: ' . $this->users->count());
```

## 속성 {#properties}

Volt 속성은 Livewire 속성과 마찬가지로 뷰에서 편리하게 접근할 수 있으며, Livewire 업데이트 간에 지속됩니다. `state` 함수를 사용하여 속성을 정의할 수 있습니다:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

?>

<div>
    {{ $count }}
</div>
```

상태 속성의 초기값이 데이터베이스 쿼리, 모델, 컨테이너 서비스 등 외부 의존성에 의존하는 경우, 해당 값을 클로저로 감싸야 합니다. 이렇게 하면 값이 정말로 필요할 때까지 해결되지 않습니다:

```php
use App\Models\User;
use function Livewire\Volt\{state};

state(['count' => fn () => User::count()]);
```

상태 속성의 초기값이 [Laravel Folio의](https://github.com/laravel/folio) 라우트 모델 바인딩을 통해 주입되는 경우에도, 클로저로 감싸야 합니다:

```php
use App\Models\User;
use function Livewire\Volt\{state};

state(['user' => fn () => $user]);
```

물론, 속성의 초기값을 명시적으로 지정하지 않고 선언할 수도 있습니다. 이 경우, 초기값은 `null`이거나 컴포넌트가 렌더링될 때 전달된 속성에 따라 설정됩니다:

```php
use function Livewire\Volt\{mount, state};

state(['count']);

mount(function ($users) {
    $this->count = count($users);

    //
});
```

### 잠긴 속성 {#locked-properties}

Livewire는 속성을 "잠금" 처리하여 클라이언트 측에서 수정이 발생하지 않도록 보호할 수 있는 기능을 제공합니다. Volt에서 이를 달성하려면, 보호하려는 state에 `locked` 메서드를 체이닝하면 됩니다:

```php
state(['id'])->locked();
```

### 반응형 속성 {#reactive-properties}

중첩 컴포넌트 작업 시, 부모 컴포넌트에서 자식 컴포넌트로 속성을 전달하고, 부모 컴포넌트가 속성을 업데이트할 때 자식 컴포넌트가 [자동으로 업데이트](/livewire/3.x/nesting#reactive-props)되기를 원할 수 있습니다.

Volt에서 이를 달성하려면, 반응형으로 만들고자 하는 state에 `reactive` 메서드를 체이닝하면 됩니다:

```php
state(['todos'])->reactive();
```

### 모델링 가능한 속성 {#modelable-properties}

반응형 속성을 사용하고 싶지 않은 경우, Livewire는 [modelable 기능](/livewire/3.x/nesting#binding-to-child-data-using-wiremodel)을 제공하여 부모 컴포넌트와 자식 컴포넌트 간에 `wire:model`을 직접 사용하여 상태를 공유할 수 있습니다.

Volt에서 이를 달성하려면, 모델링 가능한 state에 `modelable` 메서드를 체이닝하면 됩니다:

```php
state(['form'])->modelable();
```

### 계산 속성 {#computed-properties}

Livewire는 [계산 속성](/livewire/3.x/computed-properties)도 정의할 수 있게 해주며, 이는 컴포넌트에서 필요로 하는 정보를 지연 로딩하는 데 유용할 수 있습니다. 계산 속성의 결과는 "메모이즈"되어, Livewire 요청 라이프사이클 동안 메모리에 캐시됩니다.

계산 속성을 정의하려면, `computed` 함수를 사용할 수 있습니다. 변수의 이름이 계산 속성의 이름을 결정합니다:

```php
<?php

use App\Models\User;
use function Livewire\Volt\{computed};

$count = computed(function () {
    return User::count();
});

?>

<div>
    {{ $this->count }}
</div>
```

계산 속성의 값을 애플리케이션의 캐시에 영구적으로 저장하려면, 계산 속성 정의에 `persist` 메서드를 체이닝하면 됩니다:

```php
$count = computed(function () {
    return User::count();
})->persist();
```

기본적으로 Livewire는 계산 속성의 값을 3600초 동안 캐시합니다. `persist` 메서드에 원하는 초 단위를 전달하여 이 값을 커스터마이즈할 수 있습니다:

```php
$count = computed(function () {
    return User::count();
})->persist(seconds: 10);
```

## 액션 {#actions}

Livewire [액션](/livewire/3.x/actions)은 페이지 상호작용을 감지하고 컴포넌트의 해당 메서드를 호출하여 컴포넌트를 다시 렌더링하는 편리한 방법을 제공합니다. 종종 액션은 사용자가 버튼을 클릭할 때 호출됩니다.

Volt를 사용하여 Livewire 액션을 정의하려면, 클로저를 정의하기만 하면 됩니다. 클로저를 담고 있는 변수의 이름이 액션의 이름을 결정합니다:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

클로저 내에서 `$this` 변수는 기본 Livewire 컴포넌트에 바인딩되어, 일반 Livewire 컴포넌트에서처럼 컴포넌트의 다른 메서드에 접근할 수 있습니다:

```php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = function () {
    $this->dispatch('count-updated');

    //
};
```

액션은 Laravel의 서비스 컨테이너에서 인자나 의존성을 받을 수도 있습니다:

```php
use App\Repositories\PostRepository;
use function Livewire\Volt\{state};

state(['postId']);

$delete = function (PostRepository $posts) {
    $posts->delete($this->postId);

    // ...
};
```

### 렌더링 없는 액션 {#renderless-actions}

경우에 따라, 컴포넌트가 렌더링된 Blade 템플릿에 변화를 일으키지 않는 액션을 선언할 수 있습니다. 이 경우, 액션을 `action` 함수로 감싸고 정의에 `renderless` 메서드를 체이닝하여 Livewire의 라이프사이클에서 [렌더링 단계를 건너뛸 수 있습니다](/livewire/3.x/actions#skipping-re-renders):

```php
use function Livewire\Volt\{action};

$incrementViewCount = action(fn () => $this->viewCount++)->renderless();
```

### 보호된 헬퍼 {#protected-helpers}

기본적으로 모든 Volt 액션은 "public"이며 클라이언트에서 호출할 수 있습니다. [액션 내에서만 접근 가능한 함수](/livewire/3.x/actions#keep-dangerous-methods-protected-or-private)를 만들고 싶다면, `protect` 함수를 사용할 수 있습니다:

```php
use App\Repositories\PostRepository;
use function Livewire\Volt\{protect, state};

state(['postId']);

$delete = function (PostRepository $posts) {
    $this->ensurePostCanBeDeleted();

    $posts->delete($this->postId);

    // ...
};

$ensurePostCanBeDeleted = protect(function () {
    // ...
});
```

## 폼 {#forms}

Livewire의 [폼](/livewire/3.x/forms)은 단일 클래스 내에서 폼 검증 및 제출을 다루는 편리한 방법을 제공합니다. Volt 컴포넌트 내에서 Livewire 폼을 사용하려면, `form` 함수를 사용할 수 있습니다:

```php
<?php

use App\Livewire\Forms\PostForm;
use function Livewire\Volt\{form};

form(PostForm::class);

$save = function () {
    $this->form->store();

    // ...
};

?>

<form wire:submit="save">
    <input type="text" wire:model="form.title">
    @error('form.title') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save</button>
</form>
```

보시다시피, `form` 함수는 Livewire 폼 클래스의 이름을 받습니다. 정의되면, 폼은 컴포넌트 내에서 `$this->form` 속성을 통해 접근할 수 있습니다.

폼에 대해 다른 속성 이름을 사용하고 싶다면, `form` 함수의 두 번째 인자로 이름을 전달할 수 있습니다:

```php
form(PostForm::class, 'postForm');

$save = function () {
    $this->postForm->store();

    // ...
};
```

## 리스너 {#listeners}

Livewire의 전역 [이벤트 시스템](/livewire/3.x/events)은 컴포넌트 간 통신을 가능하게 합니다. 한 페이지에 두 개의 Livewire 컴포넌트가 존재할 때, 이벤트와 리스너를 활용하여 통신할 수 있습니다. Volt를 사용할 때는 `on` 함수를 사용하여 리스너를 정의할 수 있습니다:

```php
use function Livewire\Volt\{on};

on(['eventName' => function () {
    //
}]);
```

인증된 사용자나 컴포넌트에 전달된 데이터에 따라 동적으로 이벤트 리스너 이름을 지정해야 한다면, `on` 함수에 클로저를 전달할 수 있습니다. 이 클로저는 컴포넌트 파라미터와, Laravel의 서비스 컨테이너를 통해 해결되는 추가 의존성을 받을 수 있습니다:

```php
on(fn ($post) => [
    'event-'.$post->id => function () {
        //
    }),
]);
```

편의를 위해, 컴포넌트 데이터를 "dot" 표기법으로 참조하여 리스너를 정의할 수도 있습니다:

```php
on(['event-{post.id}' => function () {
    //
}]);
```

## 라이프사이클 훅 {#lifecycle-hooks}

Livewire에는 컴포넌트의 라이프사이클 여러 지점에서 코드를 실행할 수 있는 다양한 [라이프사이클 훅](/livewire/3.x/lifecycle-hooks)이 있습니다. Volt의 편리한 API를 사용하면, 해당 함수들을 사용하여 이러한 라이프사이클 훅을 정의할 수 있습니다:

```php
use function Livewire\Volt\{boot, booted, ...};

boot(fn () => /* ... */);
booted(fn () => /* ... */);
mount(fn () => /* ... */);
hydrate(fn () => /* ... */);
hydrate(['count' => fn () => /* ... */]);
dehydrate(fn () => /* ... */);
dehydrate(['count' => fn () => /* ... */]);
updating(['count' => fn () => /* ... */]);
updated(['count' => fn () => /* ... */]);
```

## 지연 로딩 플레이스홀더 {#lazy-loading-placeholders}

Livewire 컴포넌트를 렌더링할 때, Livewire 컴포넌트에 `lazy` 파라미터를 전달하여 [로딩을 지연](/livewire/3.x/lazy)시킬 수 있습니다. 기본적으로 Livewire는 컴포넌트가 로드될 위치에 `<div></div>` 태그를 DOM에 삽입합니다.

초기 페이지가 로드되는 동안 컴포넌트의 플레이스홀더에 표시되는 HTML을 커스터마이즈하고 싶다면, `placeholder` 함수를 사용할 수 있습니다:

```php
use function Livewire\Volt\{placeholder};

placeholder('<div>Loading...</div>');
```

## 검증 {#validation}

Livewire는 Laravel의 강력한 [검증 기능](/livewire/3.x/validation)에 쉽게 접근할 수 있도록 해줍니다. Volt의 API를 사용하여, `rules` 함수를 통해 컴포넌트의 검증 규칙을 정의할 수 있습니다. 전통적인 Livewire 컴포넌트와 마찬가지로, 이 규칙들은 `validate` 메서드를 호출할 때 컴포넌트 데이터에 적용됩니다:

```php
<?php

use function Livewire\Volt\{rules};

rules(['name' => 'required|min:6', 'email' => 'required|email']);

$submit = function () {
    $this->validate();

    // ...
};

?>

<form wire:submit.prevent="submit">
    //
</form>
```

인증된 사용자나 데이터베이스의 정보 등, 동적으로 규칙을 정의해야 한다면, `rules` 함수에 클로저를 제공할 수 있습니다:

```php
rules(fn () => [
    'name' => ['required', 'min:6'],
    'email' => ['required', 'email', 'not_in:'.Auth::user()->email]
]);
```

### 에러 메시지 및 속성 {#error-messages-and-attributes}

검증 중에 사용되는 메시지나 속성을 수정하려면, `rules` 정의에 `messages` 및 `attributes` 메서드를 체이닝할 수 있습니다:

```php
use function Livewire\Volt\{rules};

rules(['name' => 'required|min:6', 'email' => 'required|email'])
    ->messages([
        'email.required' => '해당 :attribute는 비워둘 수 없습니다.',
        'email.email' => ':attribute 형식이 올바르지 않습니다.',
    ])->attributes([
        'email' => '이메일 주소',
    ]);
```

## 파일 업로드 {#file-uploads}

Volt를 사용할 때, [파일 업로드 및 저장](/livewire/3.x/uploads)이 Livewire 덕분에 훨씬 쉬워집니다. 함수형 Volt 컴포넌트에 `Livewire\WithFileUploads` 트레이트를 포함하려면, `usesFileUploads` 함수를 사용할 수 있습니다:

```php
use function Livewire\Volt\{state, usesFileUploads};

usesFileUploads();

state(['photo']);

$save = function () {
    $this->validate([
        'photo' => 'image|max:1024',
    ]);

    $this->photo->store('photos');
};
```

## URL 쿼리 파라미터 {#url-query-parameters}

컴포넌트 상태가 변경될 때 [브라우저의 URL 쿼리 파라미터를 업데이트](/livewire/3.x/url)하는 것이 유용할 때가 있습니다. 이런 경우, `url` 메서드를 사용하여 Livewire가 컴포넌트 상태와 URL 쿼리 파라미터를 동기화하도록 지시할 수 있습니다:

```php
<?php

use App\Models\Post;
use function Livewire\Volt\{computed, state};

state(['search'])->url();

$posts = computed(function () {
    return Post::where('title', 'like', '%'.$this->search.'%')->get();
});

?>

<div>
    <input wire:model.live="search" type="search" placeholder="제목으로 게시글 검색...">

    <h1>검색 결과:</h1>

    <ul>
        @foreach($this->posts as $post)
            <li wire:key="{{ $post->id }}">{{ $post->title }}</li>
        @endforeach
    </ul>
</div>
```

Livewire가 지원하는 추가 URL 쿼리 파라미터 옵션(예: 쿼리 파라미터 별칭 등)도 `url` 메서드에 제공할 수 있습니다:

```php
use App\Models\Post;
use function Livewire\Volt\{state};

state(['page' => 1])->url(as: 'p', history: true, keep: true);

// ...
```

## 페이지네이션 {#pagination}

Livewire와 Volt는 [페이지네이션](/livewire/3.x/pagination)도 완벽하게 지원합니다. 함수형 Volt 컴포넌트에 Livewire의 `Livewire\WithPagination` 트레이트를 포함하려면, `usesPagination` 함수를 사용할 수 있습니다:

```php
<?php

use function Livewire\Volt\{with, usesPagination};

usesPagination();

with(fn () => ['posts' => Post::paginate(10)]);

?>

<div>
    @foreach ($posts as $post)
        //
    @endforeach

    {{ $posts->links() }}
</div>
```

Laravel과 마찬가지로, Livewire의 기본 페이지네이션 뷰는 Tailwind 클래스를 사용하여 스타일링됩니다. 애플리케이션에서 Bootstrap을 사용한다면, `usesPagination` 함수 호출 시 원하는 테마를 지정하여 Bootstrap 페이지네이션 테마를 활성화할 수 있습니다:

```php
usesPagination(theme: 'bootstrap');
```

## 커스텀 트레이트 및 인터페이스 {#custom-traits-and-interfaces}

함수형 Volt 컴포넌트에 임의의 트레이트나 인터페이스를 포함하려면, `uses` 함수를 사용할 수 있습니다:

```php
use function Livewire\Volt\{uses};

use App\Contracts\Sorting;
use App\Concerns\WithSorting;

uses([Sorting::class, WithSorting::class]);
```

## 익명 컴포넌트 {#anonymous-components}

때때로, 페이지의 일부만 Volt 컴포넌트로 변환하고 싶지만 별도의 파일로 추출하고 싶지 않을 수 있습니다. 예를 들어, 다음과 같은 뷰를 반환하는 Laravel 라우트를 상상해보세요:

```php
Route::get('/counter', fn () => view('pages/counter.blade.php'));
```

뷰의 내용은 레이아웃 정의와 슬롯을 포함한 일반적인 Blade 템플릿입니다. 하지만 뷰의 일부를 `@volt` Blade 지시어로 감싸면, 해당 뷰의 일부분을 완전한 기능의 Volt 컴포넌트로 변환할 수 있습니다:

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<x-app-layout>
    <x-slot name="header">
        Counter
    </x-slot>

    @volt('counter')
        <div>
            <h1>{{ $count }}</h1>
            <button wire:click="increment">+</button>
        </div>
    @endvolt
</x-app-layout>
```

#### 익명 컴포넌트에 데이터 전달 {#passing-data-to-anonymous-components}

익명 컴포넌트를 포함하는 뷰를 렌더링할 때, 뷰에 전달된 모든 데이터는 익명 Volt 컴포넌트에서도 사용할 수 있습니다:

```php
use App\Models\User;

Route::get('/counter', fn () => view('users.counter', [
    'count' => User::count(),
]));
```

물론, 이 데이터를 Volt 컴포넌트의 "state"로 선언할 수도 있습니다. 뷰에서 컴포넌트로 프록시된 데이터로 상태를 초기화할 때는, 상태 변수의 이름만 선언하면 됩니다. Volt는 프록시된 뷰 데이터를 사용하여 상태의 기본값을 자동으로 하이드레이트합니다:

```php
<?php

use function Livewire\Volt\{state};

state('count');

$increment = function () {
    // 새로운 count 값을 데이터베이스에 저장...

    $this->count++;
};

?>

<x-app-layout>
    <x-slot name="header">
        초기값: {{ $count }}
    </x-slot>

    @volt('counter')
        <div>
            <h1>{{ $count }}</h1>
            <button wire:click="increment">+</button>
        </div>
    @endvolt
</x-app-layout>
```

## 컴포넌트 테스트 {#testing-components}

Volt 컴포넌트 테스트를 시작하려면, 컴포넌트의 이름을 제공하여 `Volt::test` 메서드를 호출할 수 있습니다:

```php
use Livewire\Volt\Volt;

it('increments the counter', function () {
    Volt::test('counter')
        ->assertSee('0')
        ->call('increment')
        ->assertSee('1');
});
```

Volt 컴포넌트를 테스트할 때, 표준 [Livewire 테스트 API](/livewire/3.x/testing)에서 제공하는 모든 메서드를 활용할 수 있습니다.

Volt 컴포넌트가 중첩되어 있다면, 테스트하고자 하는 컴포넌트를 "dot" 표기법으로 지정할 수 있습니다:

```php
Volt::test('users.stats')
```

익명 Volt 컴포넌트가 포함된 페이지를 테스트할 때, `assertSeeVolt` 메서드를 사용하여 컴포넌트가 렌더링되었는지 확인할 수 있습니다:

```php
$this->get('/users')
    ->assertSeeVolt('stats');
```
