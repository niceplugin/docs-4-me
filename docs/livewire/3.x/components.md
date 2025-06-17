# 컴포넌트
컴포넌트는 Livewire 애플리케이션의 기본 구성 요소입니다. 컴포넌트는 상태와 동작을 결합하여 프론트엔드에서 재사용 가능한 UI 조각을 만듭니다. 여기에서는 컴포넌트를 생성하고 렌더링하는 기본 사항을 다룹니다.

## 컴포넌트 생성하기 {#creating-components}

Livewire 컴포넌트는 단순히 `Livewire\Component`를 확장한 PHP 클래스입니다. 컴포넌트 파일을 직접 만들 수도 있고, 아래의 Artisan 명령어를 사용할 수도 있습니다:
```shell
php artisan make:livewire CreatePost
```

케밥 케이스(kebab-case) 이름을 선호한다면, 다음과 같이 사용할 수도 있습니다:

```shell
php artisan make:livewire create-post
```

이 명령어를 실행하면, Livewire는 애플리케이션에 두 개의 새로운 파일을 생성합니다. 첫 번째는 컴포넌트 클래스 파일입니다: `app/Livewire/CreatePost.php`

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return view('livewire.create-post');
	}
}
```

두 번째는 컴포넌트의 Blade 뷰 파일입니다: `resources/views/livewire/create-post.blade.php`

```blade
<div>
	{{-- ... --}}
</div>
```

네임스페이스 문법이나 점 표기법(dot-notation)을 사용하여 하위 디렉터리에 컴포넌트를 생성할 수도 있습니다. 예를 들어, 아래 명령어들은 `Posts` 하위 디렉터리에 `CreatePost` 컴포넌트를 생성합니다:

```shell
php artisan make:livewire Posts\\CreatePost
php artisan make:livewire posts.create-post
```

### 인라인 컴포넌트 {#inline-components}

컴포넌트가 비교적 작다면 _인라인_ 컴포넌트를 생성할 수 있습니다. 인라인 컴포넌트는 뷰 템플릿이 별도의 파일이 아닌 `render()` 메서드 안에 직접 포함된 단일 파일 Livewire 컴포넌트입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return <<<'HTML' // [tl! highlight:4]
		<div>
		    {{-- 여기에 Blade 템플릿을 작성하세요... --}}
		</div>
		HTML;
	}
}
```

`make:livewire` 명령어에 `--inline` 플래그를 추가하여 인라인 컴포넌트를 생성할 수 있습니다:

```shell
php artisan make:livewire CreatePost --inline
```

### render 메서드 생략하기 {#omitting-the-render-method}

컴포넌트의 보일러플레이트 코드를 줄이기 위해, `render()` 메서드를 완전히 생략할 수 있습니다. 그러면 Livewire는 자체 내장 `render()` 메서드를 사용하여, 컴포넌트 이름에 맞는 관례적인 뷰를 반환합니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    //
}
```

위의 컴포넌트가 페이지에서 렌더링될 경우, Livewire는 자동으로 `livewire.create-post` 템플릿을 사용해야 한다고 판단합니다.

### 컴포넌트 스텁 커스터마이징 {#customizing-component-stubs}

다음 명령어를 실행하여 Livewire가 새로운 컴포넌트를 생성할 때 사용하는 파일(또는 _스텁_)을 커스터마이징할 수 있습니다:

```shell
php artisan livewire:stubs
```

이 명령어를 실행하면 애플리케이션에 일곱 개의 새로운 파일이 생성됩니다:

* `stubs/livewire.stub` — 새로운 컴포넌트 생성에 사용
* `stubs/livewire.attribute.stub` — 어트리뷰트 클래스 생성에 사용
* `stubs/livewire.form.stub` — 폼 클래스 생성에 사용
* `stubs/livewire.inline.stub` — _인라인_ 컴포넌트 생성에 사용
* `stubs/livewire.pest-test.stub` — Pest 테스트 파일 생성에 사용
* `stubs/livewire.test.stub` — PHPUnit 테스트 파일 생성에 사용
* `stubs/livewire.view.stub` — 컴포넌트 뷰 생성에 사용

이 파일들이 애플리케이션 내에 존재하더라도, 여전히 `make:livewire` Artisan 명령어를 사용할 수 있으며, Livewire는 파일을 생성할 때 자동으로 커스텀 스텁을 사용합니다.

## 속성 설정하기 {#setting-properties}

Livewire 컴포넌트는 데이터를 저장하는 속성을 가지고 있으며, 이 속성들은 컴포넌트의 클래스와 Blade 뷰 내에서 쉽게 접근할 수 있습니다. 이 섹션에서는 컴포넌트에 속성을 추가하고 애플리케이션에서 사용하는 기본 방법을 다룹니다.

Livewire 컴포넌트에 속성을 추가하려면, 컴포넌트 클래스에 public 속성을 선언하면 됩니다. 예를 들어, `CreatePost` 컴포넌트에 `$title` 속성을 만들어 보겠습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = 'Post title...';

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

### 뷰에서 프로퍼티에 접근하기 {#accessing-properties-in-the-view}

컴포넌트의 프로퍼티는 자동으로 해당 컴포넌트의 Blade 뷰에서 사용할 수 있습니다. 표준 Blade 문법을 사용하여 참조할 수 있습니다. 여기서는 `$title` 프로퍼티의 값을 표시합니다:

```blade
<div>
    <h1>Title: "{{ $title }}"</h1>
</div>
```

이 컴포넌트가 렌더링되면 다음과 같은 출력이 생성됩니다:

```blade
<div>
    <h1>Title: "Post title..."</h1>
</div>
```

### 뷰에 추가 데이터 공유하기 {#sharing-additional-data-with-the-view}

뷰에서 프로퍼티에 접근하는 것 외에도, 컨트롤러에서 하듯이 `render()` 메서드에서 뷰로 데이터를 명시적으로 전달할 수 있습니다. 이는 추가 데이터를 먼저 프로퍼티로 저장하지 않고 전달하고 싶을 때 유용합니다. 프로퍼티는 [특정 성능 및 보안상의 영향](/docs/properties#security-concerns)이 있기 때문입니다.

`render()` 메서드에서 뷰로 데이터를 전달하려면, 뷰 인스턴스의 `with()` 메서드를 사용할 수 있습니다. 예를 들어, 게시글 작성자의 이름을 뷰로 전달하고 싶다고 가정해봅시다. 이 경우, 게시글 작성자는 현재 인증된 사용자입니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public function render()
    {
        return view('livewire.create-post')->with([
	        'author' => Auth::user()->name,
	    ]);
    }
}
```

이제 컴포넌트의 Blade 뷰에서 `$author` 프로퍼티에 접근할 수 있습니다:

```blade
<div>
	<h1>Title: {{ $title }}</h1>

	<span>Author: {{ $author }}</span>
</div>
```

### `@foreach` 루프에 `wire:key` 추가하기 {#adding-wirekey-to-foreach-loops}

Livewire 템플릿에서 `@foreach`를 사용해 데이터를 반복할 때, 반복문에서 렌더링되는 루트 엘리먼트에 고유한 `wire:key` 속성을 반드시 추가해야 합니다.

Blade 반복문 내에 `wire:key` 속성이 없으면, 반복문이 변경될 때 Livewire가 이전 엘리먼트와 새로운 위치를 제대로 매칭할 수 없습니다. 이로 인해 애플리케이션에서 진단하기 어려운 다양한 문제가 발생할 수 있습니다.

예를 들어, 게시글 배열을 반복하는 경우, `wire:key` 속성을 게시글의 ID로 설정할 수 있습니다:

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}"> <!-- [tl! highlight] -->
            <!-- ... -->
        </div>
    @endforeach
</div>
```

Livewire 컴포넌트를 렌더링하는 배열을 반복하는 경우, 컴포넌트 속성 `:key`로 키를 설정하거나, `@livewire` 디렉티브를 사용할 때 세 번째 인자로 키를 전달할 수 있습니다.

```blade
<div>
    @foreach ($posts as $post)
        <livewire:post-item :$post :key="$post->id">

        @livewire(PostItem::class, ['post' => $post], key($post->id))
    @endforeach
</div>
```

### 속성에 입력값 바인딩하기 {#binding-inputs-to-properties}

Livewire의 가장 강력한 기능 중 하나는 "데이터 바인딩"입니다. 이는 페이지의 폼 입력값과 컴포넌트 속성을 자동으로 동기화하는 기능입니다.

`CreatePost` 컴포넌트의 `$title` 속성을 `wire:model` 디렉티브를 사용해 텍스트 입력창에 바인딩해봅시다:

```blade
<form>
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title"> <!-- [tl! highlight] -->
</form>
```

텍스트 입력값이 변경되면, 해당 값은 Livewire 컴포넌트의 `$title` 속성과 자동으로 동기화됩니다.

> [!warning] "입력할 때마다 컴포넌트가 실시간으로 업데이트되지 않는 이유는 무엇인가요?"
> 브라우저에서 이 코드를 시도해보고 제목이 자동으로 업데이트되지 않아 혼란스러웠다면, Livewire는 "액션"이 제출될 때(예: 제출 버튼을 누를 때)만 컴포넌트를 업데이트하기 때문입니다. 사용자가 입력 필드에 타이핑할 때마다 업데이트하지 않으므로 네트워크 요청이 줄고 성능이 향상됩니다. 사용자가 입력할 때마다 "실시간"으로 업데이트되길 원한다면 `wire:model.live`를 사용할 수 있습니다. [데이터 바인딩에 대해 더 알아보기](/docs/properties#data-binding).


Livewire 속성은 매우 강력하며 꼭 이해해야 할 중요한 개념입니다. 더 자세한 내용은 [Livewire 속성 문서](/docs/properties)를 참고하세요.

## 액션 호출하기 {#calling-actions}

액션은 Livewire 컴포넌트 내에서 사용자 상호작용을 처리하거나 특정 작업을 수행하는 메서드입니다. 주로 버튼 클릭이나 폼 제출과 같은 페이지 내 이벤트에 응답할 때 유용하게 사용됩니다.

액션에 대해 더 알아보기 위해, `CreatePost` 컴포넌트에 `save` 액션을 추가해보겠습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title;

    public function save() // [tl! highlight:8]
    {
		Post::create([
			'title' => $this->title
		]);

		return redirect()->to('/posts')
			 ->with('status', 'Post created!');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

다음으로, 컴포넌트의 Blade 뷰에서 `<form>` 요소에 `wire:submit` 디렉티브를 추가하여 `save` 액션을 호출해봅시다:

```blade
<form wire:submit="save"> <!-- [tl! highlight] -->
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title">

	<button type="submit">Save</button>
</form>
```

"Save" 버튼을 클릭하면, Livewire 컴포넌트의 `save()` 메서드가 실행되고 컴포넌트가 다시 렌더링됩니다.

Livewire 액션에 대해 더 배우고 싶다면 [액션 문서](/docs/actions)를 참고하세요.

## 컴포넌트 렌더링 {#rendering-components}

Livewire 컴포넌트를 페이지에 렌더링하는 방법은 두 가지가 있습니다:

1. 기존 Blade 뷰 내에 포함하기
2. 라우트에 직접 할당하여 전체 페이지 컴포넌트로 사용하기

두 번째 방법보다 더 간단한 첫 번째 방법부터 살펴보겠습니다.

Blade 템플릿에서 `<livewire:component-name />` 문법을 사용하여 Livewire 컴포넌트를 포함할 수 있습니다:

```blade
<livewire:create-post />
```

컴포넌트 클래스가 `app/Livewire/` 디렉터리 내에 더 깊이 중첩되어 있다면, 디렉터리 중첩을 나타내기 위해 `.` 문자를 사용할 수 있습니다. 예를 들어, 컴포넌트가 `app/Livewire/EditorPosts/CreatePost.php`에 위치해 있다면 다음과 같이 렌더링할 수 있습니다:

```blade
<livewire:editor-posts.create-post />
```

> [!warning] 반드시 케밥 케이스를 사용해야 합니다
> 위의 예시에서 볼 수 있듯이, 컴포넌트 이름은 반드시 _케밥 케이스(kebab-case)_ 형태로 작성해야 합니다. _StudlyCase_ 형태(`<livewire:CreatePost />`)로 작성하면 Livewire에서 인식하지 못하므로 올바르지 않습니다.


### 컴포넌트에 데이터 전달하기 {#passing-data-into-components}

Livewire 컴포넌트에 외부 데이터를 전달하려면, 컴포넌트 태그에 속성을 사용할 수 있습니다. 이는 특정 데이터로 컴포넌트를 초기화하고 싶을 때 유용합니다.

`CreatePost` 컴포넌트의 `$title` 속성에 초기 값을 전달하려면, 다음과 같은 문법을 사용할 수 있습니다:

```blade
<livewire:create-post title="Initial Title" />
```

동적 값이나 변수를 컴포넌트에 전달해야 할 경우, 속성 앞에 콜론을 붙여 PHP 표현식을 쓸 수 있습니다:

```blade
<livewire:create-post :title="$initialTitle" />
```

컴포넌트로 전달된 데이터는 `mount()` 라이프사이클 훅의 메서드 파라미터로 받아집니다. 이 경우, `$title` 파라미터를 속성에 할당하려면 다음과 같이 `mount()` 메서드를 작성할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public function mount($title = null)
    {
        $this->title = $title;
    }

    // ...
}
```

이 예시에서 `$title` 속성은 "Initial Title" 값으로 초기화됩니다.

`mount()` 메서드는 클래스 생성자와 비슷하다고 생각할 수 있습니다. 이 메서드는 컴포넌트가 처음 로드될 때 실행되며, 페이지 내에서 이후 요청에는 실행되지 않습니다. `mount()` 및 기타 유용한 라이프사이클 훅에 대해 더 알고 싶다면 [라이프사이클 문서](/docs/lifecycle-hooks)를 참고하세요.

컴포넌트의 반복적인 코드를 줄이기 위해, `mount()` 메서드를 생략할 수도 있습니다. 이 경우 Livewire는 전달된 값과 이름이 일치하는 속성을 자동으로 컴포넌트에 설정해줍니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title; // [tl! highlight]

    // ...
}
```

이는 사실상 `mount()` 메서드 안에서 `$title`을 할당하는 것과 동일합니다.

> [!warning] 이 속성들은 기본적으로 반응형이 아닙니다
> `$title` 속성은 페이지가 처음 로드된 이후에 외부의 `:title="$initialValue"` 값이 변경되어도 자동으로 업데이트되지 않습니다. 이는 Livewire를 사용할 때, 특히 Vue나 React와 같은 자바스크립트 프레임워크를 사용해본 개발자들이 이러한 "파라미터"가 해당 프레임워크의 "반응형 props"처럼 동작할 것이라고 가정할 때 흔히 혼동하는 부분입니다. 하지만 걱정하지 마세요, Livewire에서는 [props를 반응형으로 만들기](/docs/nesting#reactive-props)를 선택적으로 적용할 수 있습니다.


## 전체 페이지 컴포넌트 {#full-page-components}

Livewire는 라라벨 애플리케이션에서 컴포넌트를 라우트에 직접 할당할 수 있도록 지원합니다. 이러한 컴포넌트를 "전체 페이지 컴포넌트"라고 부릅니다. 이를 사용하면 로직과 뷰가 완전히 캡슐화된 독립적인 페이지를 Livewire 컴포넌트로 만들 수 있습니다.

전체 페이지 컴포넌트를 생성하려면, `routes/web.php` 파일에서 라우트를 정의하고 `Route::get()` 메서드를 사용해 컴포넌트를 특정 URL에 직접 매핑하면 됩니다. 예를 들어, `/posts/create` 경로에서 `CreatePost` 컴포넌트를 렌더링하고 싶다고 가정해봅시다.

아래와 같이 `routes/web.php` 파일에 코드를 추가하면 됩니다:

```php
use App\Livewire\CreatePost;

Route::get('/posts/create', CreatePost::class);
```

이제 브라우저에서 `/posts/create` 경로에 접속하면, `CreatePost` 컴포넌트가 전체 페이지 컴포넌트로 렌더링됩니다.

### 레이아웃 파일 {#layout-files}

전체 페이지 컴포넌트는 일반적으로 `resources/views/components/layouts/app.blade.php` 파일에 정의된 애플리케이션의 레이아웃을 사용합니다.

아직 이 파일이 없다면, 다음 명령어를 실행하여 생성할 수 있습니다:

```shell
php artisan livewire:layout
```

이 명령어는 `resources/views/components/layouts/app.blade.php`라는 파일을 생성합니다.

이 위치에 Blade 파일을 만들고, <span v-pre>`{{ $slot }}`</span> 플레이스홀더를 포함했는지 확인하세요:

```blade
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

#### 전역 레이아웃 설정 {#global-layout-configuration}

모든 컴포넌트에서 커스텀 레이아웃을 사용하려면, `config/livewire.php` 파일의 `layout` 키에 커스텀 레이아웃의 경로를 `resources/views` 기준으로 설정하면 됩니다. 예를 들어:

```php
'layout' => 'layouts.app',
```

위와 같이 설정하면, Livewire는 전체 페이지 컴포넌트를 `resources/views/layouts/app.blade.php` 레이아웃 파일 안에 렌더링합니다.

#### 컴포넌트별 레이아웃 설정 {#per-component-layout-configuration}

특정 컴포넌트에 대해 다른 레이아웃을 사용하려면, Livewire의 `#[Layout]` 속성을 컴포넌트의 `render()` 메서드 위에 배치하고, 커스텀 레이아웃의 상대 뷰 경로를 전달하면 됩니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Layout('layouts.app')] // [tl! highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

또는, 원한다면 이 속성을 클래스 선언 위에 사용할 수도 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')] // [tl! highlight]
class CreatePost extends Component
{
	// ...
}
```

PHP 속성은 리터럴 값만 지원합니다. 동적 값을 전달해야 하거나, 이 대체 문법을 선호한다면, 컴포넌트의 `render()` 메서드에서 유창한 `->layout()` 메서드를 사용할 수 있습니다:

```php
public function render()
{
    return view('livewire.create-post')
	     ->layout('layouts.app'); // [tl! highlight]
}
```

또는, Livewire는 전통적인 Blade 레이아웃 파일을 `@extends`와 함께 사용하는 것도 지원합니다.

다음과 같은 레이아웃 파일이 있다고 가정해봅시다:

```blade
<body>
    @yield('content')
</body>
```

Livewire가 이를 참조하도록 `->layout()` 대신 `->extends()`를 사용할 수 있습니다:

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app'); // [tl! highlight]
}
```

컴포넌트에서 사용할 `@section`을 설정해야 한다면, `->section()` 메서드로 설정할 수도 있습니다:

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app')
        ->section('body'); // [tl! highlight]
}
```

### 페이지 제목 설정하기 {#setting-the-page-title}

애플리케이션의 각 페이지에 고유한 페이지 제목을 지정하는 것은 사용자와 검색 엔진 모두에게 유용합니다.

전체 페이지 컴포넌트에 사용자 지정 페이지 제목을 설정하려면 먼저 레이아웃 파일에 동적 제목이 포함되어 있는지 확인하세요:

```blade
<head>
    <title>{{ $title ?? 'Page Title' }}</title>
</head>
```

다음으로, Livewire 컴포넌트의 `render()` 메서드 위에 `#[Title]` 속성을 추가하고 원하는 페이지 제목을 전달하세요:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Title('Create Post')] // [tl! highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

이렇게 하면 `CreatePost` Livewire 컴포넌트의 페이지 제목이 설정됩니다. 이 예시에서는 컴포넌트가 렌더링될 때 페이지 제목이 "Create Post"가 됩니다.

원한다면 이 속성을 클래스 선언 위에 사용할 수도 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Create Post')] // [tl! highlight]
class CreatePost extends Component
{
	// ...
}
```

컴포넌트 속성을 사용하는 등 동적인 제목을 전달해야 한다면, 컴포넌트의 `render()` 메서드에서 `->title()` 플루언트 메서드를 사용할 수 있습니다:

```php
public function render()
{
    return view('livewire.create-post')
	     ->title('Create Post'); // [tl! highlight]
}
```

### 추가 레이아웃 파일 슬롯 설정 {#setting-additional-layout-file-slots}

[레이아웃 파일](#layout-files)에 `$slot` 외에 이름이 지정된 슬롯이 있다면, Blade 뷰에서 루트 엘리먼트 바깥에 `<x-slot>`을 정의하여 해당 슬롯의 내용을 설정할 수 있습니다. 예를 들어, 각 컴포넌트별로 페이지 언어를 개별적으로 설정하고 싶다면, 레이아웃 파일의 HTML 태그에 동적 `$lang` 슬롯을 추가할 수 있습니다:

```blade
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $lang ?? app()->getLocale()) }}"> <!-- [tl! highlight] -->
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

그런 다음, 컴포넌트 뷰에서 루트 엘리먼트 바깥에 `<x-slot>` 요소를 정의합니다:

```blade
<x-slot:lang>fr</x-slot> // 이 컴포넌트는 프랑스어로 표시됩니다 <!-- [tl! highlight] -->

<div>
    // 프랑스어 콘텐츠가 여기에 들어갑니다...
</div>
```


### 라우트 파라미터 접근하기 {#accessing-route-parameters}

전체 페이지 컴포넌트에서 작업할 때, Livewire 컴포넌트 내에서 라우트 파라미터에 접근해야 할 수 있습니다.

예시를 들어, 먼저 `routes/web.php` 파일에 파라미터가 있는 라우트를 정의합니다:

```php
use App\Livewire\ShowPost;

Route::get('/posts/{id}', ShowPost::class);
```

여기서, `id` 파라미터는 게시글의 ID를 나타냅니다.

다음으로, Livewire 컴포넌트의 `mount()` 메서드에서 라우트 파라미터를 받을 수 있도록 업데이트합니다:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount($id) // [tl! highlight]
    {
        $this->post = Post::findOrFail($id);
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

이 예시에서, 파라미터 이름 `$id`가 라우트 파라미터 `{id}`와 일치하기 때문에, `/posts/1` URL에 접속하면 Livewire가 "1" 값을 `$id`로 전달합니다.

### 라우트 모델 바인딩 사용하기 {#using-route-model-binding}

Laravel의 라우트 모델 바인딩을 사용하면 라우트 파라미터에서 Eloquent 모델을 자동으로 주입받을 수 있습니다.

`routes/web.php` 파일에서 모델 파라미터가 포함된 라우트를 정의한 후:

```php
use App\Livewire\ShowPost;

Route::get('/posts/{post}', ShowPost::class);
```

이제 컴포넌트의 `mount()` 메서드를 통해 라우트 모델 파라미터를 받을 수 있습니다:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post) // [tl! highlight]
    {
        $this->post = $post;
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

Livewire는 `mount()`의 `$post` 파라미터에 `Post` 타입힌트가 지정되어 있기 때문에 "라우트 모델 바인딩"을 사용해야 함을 인식합니다.

이전과 마찬가지로, `mount()` 메서드를 생략하여 보일러플레이트 코드를 줄일 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post; // [tl! highlight]

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

`$post` 프로퍼티는 라우트의 `{post}` 파라미터를 통해 바인딩된 모델로 자동 할당됩니다.

### 응답 수정하기 {#modifying-the-response}

특정 상황에서는 응답을 수정하거나 커스텀 응답 헤더를 설정하고 싶을 수 있습니다. 뷰에서 `response()` 메서드를 호출하고 클로저를 사용하여 응답 객체를 수정할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Http\Response;

class ShowPost extends Component
{
    public function render()
    {
        return view('livewire.show-post')
            ->response(function(Response $response) {
                $response->header('X-Custom-Header', true);
            });
    }
}
```

## 자바스크립트 사용하기 {#using-javascript}

Livewire와 Alpine의 내장 유틸리티만으로는 Livewire 컴포넌트 내에서 원하는 목표를 달성하기에 충분하지 않은 경우가 많습니다.

다행히도, Livewire는 맞춤형 자바스크립트와 상호작용할 수 있는 다양한 확장 지점과 유틸리티를 제공합니다. 자세한 내용은 [자바스크립트 문서 페이지](/docs/javascript)에서 확인할 수 있습니다. 하지만 지금은 Livewire 컴포넌트 내에서 직접 자바스크립트를 사용하는 몇 가지 유용한 방법을 소개하겠습니다.

### 스크립트 실행 {#executing-scripts}

Livewire는 유용한 `@script` 디렉티브를 제공합니다. 이 디렉티브로 `<script>` 요소를 감싸면, 해당 JavaScript가 컴포넌트가 페이지에 초기화될 때 실행됩니다.

아래는 JavaScript의 `setInterval()`을 사용하여 컴포넌트를 2초마다 새로고침하는 간단한 `@script` 예시입니다:

```blade
@script
<script>
    setInterval(() => {
        $wire.$refresh()
    }, 2000)
</script>
@endscript
```

위 예시에서 `<script>` 내부에서 컴포넌트를 제어하기 위해 `$wire`라는 객체를 사용하고 있는 것을 볼 수 있습니다. Livewire는 모든 `@script` 내부에서 이 객체를 자동으로 사용할 수 있게 해줍니다. 만약 `$wire`에 익숙하지 않다면, 아래 문서에서 `$wire`에 대해 더 자세히 알아볼 수 있습니다:
* [JavaScript에서 속성 접근하기](/docs/properties#accessing-properties-from-javascript)
* [JS/Alpine에서 Livewire 액션 호출하기](/docs/actions#calling-actions-from-alpine)
* [`$wire` 객체 레퍼런스](/docs/javascript#the-wire-object)

### 에셋 로딩 {#loading-assets}

일회성 `@script` 외에도, Livewire는 페이지에서 스크립트/스타일 의존성을 쉽게 로드할 수 있도록 유용한 `@assets` 유틸리티를 제공합니다.

또한, `@script`와 달리 Livewire 컴포넌트의 새 인스턴스가 초기화될 때마다 실행되는 것이 아니라, 제공된 에셋이 브라우저 페이지당 한 번만 로드되도록 보장합니다.

다음은 `@assets`를 사용하여 [Pikaday](https://github.com/Pikaday/Pikaday)라는 날짜 선택기 라이브러리를 로드하고, `@script`를 사용해 컴포넌트 내부에서 초기화하는 예시입니다:

```blade
<div>
    <input type="text" data-picker>
</div>

@assets
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js" defer></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endassets

@script
<script>
    new Pikaday({ field: $wire.$el.querySelector('[data-picker]') });
</script>
@endscript
```

> [!info] Blade 컴포넌트 내부에서 `@verbatim@script@endverbatim` 및 `@verbatim@assets@endverbatim` 사용하기
> [Blade 컴포넌트](https://laravel.com/docs/blade#components)로 마크업의 일부를 추출하는 경우, 해당 컴포넌트 내부에서도 `@verbatim@script@endverbatim` 및 `@verbatim@assets@endverbatim`를 사용할 수 있습니다. 동일한 Livewire 컴포넌트 내에 여러 Blade 컴포넌트가 있더라도 마찬가지입니다. 단, `@verbatim@script@endverbatim` 및 `@verbatim@assets@endverbatim`는 현재 Livewire 컴포넌트의 컨텍스트에서만 지원되므로, 해당 Blade 컴포넌트를 Livewire 외부에서 완전히 사용할 경우에는 해당 스크립트와 에셋이 페이지에 로드되지 않습니다.
