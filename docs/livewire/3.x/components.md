# 컴포넌트
컴포넌트는 Livewire 애플리케이션의 빌딩 블록입니다. 컴포넌트는 상태와 동작을 결합하여 프론트엔드에서 재사용 가능한 UI 조각을 만듭니다. 여기서는 컴포넌트를 생성하고 렌더링하는 기본 사항을 다룹니다.

## 컴포넌트 생성하기 {#creating-components}

Livewire 컴포넌트는 단순히 `Livewire\Component`를 확장하는 PHP 클래스입니다. 컴포넌트 파일은 직접 생성할 수도 있고, 다음 Artisan 명령어를 사용할 수도 있습니다:
```shell
php artisan make:livewire CreatePost
```

케밥 케이스(kebab-case) 이름을 선호한다면, 다음과 같이 사용할 수 있습니다:

```shell
php artisan make:livewire create-post
```

이 명령어를 실행하면 Livewire는 애플리케이션에 두 개의 새 파일을 생성합니다. 첫 번째는 컴포넌트 클래스 파일입니다: `app/Livewire/CreatePost.php`

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

네임스페이스 문법이나 점 표기법(dot-notation)을 사용하여 하위 디렉터리에 컴포넌트를 생성할 수 있습니다. 예를 들어, 다음 명령어는 `Posts` 하위 디렉터리에 `CreatePost` 컴포넌트를 생성합니다:

```shell
php artisan make:livewire Posts\\CreatePost
php artisan make:livewire posts.create-post
```

### 인라인 컴포넌트 {#inline-components}

컴포넌트가 비교적 작다면, _인라인_ 컴포넌트를 생성할 수 있습니다. 인라인 컴포넌트는 뷰 템플릿이 별도의 파일이 아니라 `render()` 메서드에 직접 포함된 단일 파일 Livewire 컴포넌트입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return <<<'HTML' // [!code highlight:5]
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

컴포넌트의 보일러플레이트를 줄이기 위해, `render()` 메서드를 완전히 생략할 수 있습니다. 그러면 Livewire는 자체 내장 `render()` 메서드를 사용하여 컴포넌트에 해당하는 관례적인 이름의 뷰를 반환합니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    //
}
```

위 컴포넌트가 페이지에 렌더링되면, Livewire는 자동으로 `livewire.create-post` 템플릿을 사용해야 함을 판단합니다.

### 컴포넌트 스텁 커스터마이징 {#customizing-component-stubs}

다음 명령어를 실행하여 Livewire가 새 컴포넌트를 생성할 때 사용하는 파일(또는 _스텁_)을 커스터마이징할 수 있습니다:

```shell
php artisan livewire:stubs
```

이 명령어는 애플리케이션에 일곱 개의 새 파일을 생성합니다:

* `stubs/livewire.stub` — 새 컴포넌트 생성에 사용
* `stubs/livewire.attribute.stub` — 어트리뷰트 클래스 생성에 사용
* `stubs/livewire.form.stub` — 폼 클래스 생성에 사용
* `stubs/livewire.inline.stub` — _인라인_ 컴포넌트 생성에 사용
* `stubs/livewire.pest-test.stub` — Pest 테스트 파일 생성에 사용
* `stubs/livewire.test.stub` — PHPUnit 테스트 파일 생성에 사용
* `stubs/livewire.view.stub` — 컴포넌트 뷰 생성에 사용

이 파일들이 애플리케이션에 존재하더라도, `make:livewire` Artisan 명령어를 계속 사용할 수 있으며, Livewire는 파일을 생성할 때 자동으로 커스텀 스텁을 사용합니다.

## 프로퍼티 설정하기 {#setting-properties}

Livewire 컴포넌트는 데이터를 저장하는 프로퍼티를 가지고 있으며, 컴포넌트 클래스와 Blade 뷰에서 쉽게 접근할 수 있습니다. 이 섹션에서는 컴포넌트에 프로퍼티를 추가하고 애플리케이션에서 사용하는 기본 사항을 다룹니다.

Livewire 컴포넌트에 프로퍼티를 추가하려면, 컴포넌트 클래스에 public 프로퍼티를 선언하면 됩니다. 예를 들어, `CreatePost` 컴포넌트에 `$title` 프로퍼티를 생성해봅시다:

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

### 뷰에서 프로퍼티 접근하기 {#accessing-properties-in-the-view}

컴포넌트 프로퍼티는 자동으로 컴포넌트의 Blade 뷰에서 사용할 수 있게 됩니다. 표준 Blade 문법을 사용하여 참조할 수 있습니다. 여기서는 `$title` 프로퍼티의 값을 표시해봅니다:

```blade
<div>
    <h1>Title: "{{ $title }}"</h1>
</div>
```

이 컴포넌트의 렌더링 결과는 다음과 같습니다:

```blade
<div>
    <h1>Title: "Post title..."</h1>
</div>
```

### 뷰에 추가 데이터 공유하기 {#sharing-additional-data-with-the-view}

뷰에서 프로퍼티에 접근하는 것 외에도, 컨트롤러에서처럼 `render()` 메서드에서 뷰로 데이터를 명시적으로 전달할 수 있습니다. 이는 프로퍼티로 먼저 저장하지 않고 추가 데이터를 전달하고 싶을 때 유용합니다. (프로퍼티는 [특정 성능 및 보안상의 고려사항](/livewire/3.x/properties#security-concerns)이 있기 때문입니다.)

`render()` 메서드에서 뷰 인스턴스의 `with()` 메서드를 사용하여 데이터를 전달할 수 있습니다. 예를 들어, 게시글 작성자의 이름을 뷰에 전달하고 싶다고 가정해봅시다. 이 경우, 게시글 작성자는 현재 인증된 사용자입니다:

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

Livewire 템플릿에서 `@foreach`를 사용해 데이터를 반복할 때, 루프에서 렌더링되는 루트 엘리먼트에 고유한 `wire:key` 속성을 반드시 추가해야 합니다.

Blade 루프 내에 `wire:key` 속성이 없으면, Livewire는 루프가 변경될 때 이전 엘리먼트를 새 위치에 제대로 매칭할 수 없습니다. 이로 인해 애플리케이션에서 진단하기 어려운 많은 문제가 발생할 수 있습니다.

예를 들어, 게시글 배열을 반복하는 경우, 게시글의 ID를 `wire:key` 속성에 설정할 수 있습니다:

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}"> <!-- [!code highlight] -->
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

### 입력값을 프로퍼티에 바인딩하기 {#binding-inputs-to-properties}

Livewire의 가장 강력한 기능 중 하나는 "데이터 바인딩"입니다. 즉, 페이지의 폼 입력값과 프로퍼티를 자동으로 동기화하는 기능입니다.

`CreatePost` 컴포넌트의 `$title` 프로퍼티를 `wire:model` 디렉티브를 사용하여 텍스트 입력에 바인딩해봅시다:

```blade
<form>
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title"> <!-- [!code highlight] -->
</form>
```

텍스트 입력에 변경이 생기면, 해당 값이 Livewire 컴포넌트의 `$title` 프로퍼티와 자동으로 동기화됩니다.

> [!warning] "입력할 때마다 컴포넌트가 실시간으로 업데이트되지 않는 이유는?"
> 브라우저에서 이 예제를 시도했을 때, 입력할 때마다 제목이 자동으로 업데이트되지 않는 이유가 궁금하다면, Livewire는 "액션"이 제출될 때만 컴포넌트를 업데이트하기 때문입니다. (예: 제출 버튼을 누를 때) 사용자가 필드에 입력할 때마다 업데이트하지 않으므로 네트워크 요청이 줄고 성능이 향상됩니다. 사용자가 입력할 때마다 "실시간"으로 업데이트되길 원한다면, 대신 `wire:model.live`를 사용할 수 있습니다. [데이터 바인딩에 대해 더 알아보기](/livewire/3.x/properties#data-binding).


Livewire 프로퍼티는 매우 강력하며 반드시 이해해야 할 중요한 개념입니다. 더 자세한 내용은 [Livewire 프로퍼티 문서](/livewire/3.x/properties)를 참고하세요.

## 액션 호출하기 {#calling-actions}

액션은 Livewire 컴포넌트 내에서 사용자 상호작용을 처리하거나 특정 작업을 수행하는 메서드입니다. 주로 페이지에서 버튼 클릭이나 폼 제출에 응답할 때 유용하게 사용됩니다.

액션에 대해 더 알아보기 위해, `CreatePost` 컴포넌트에 `save` 액션을 추가해봅시다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title;

    public function save() // [!code highlight:9]
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
<form wire:submit="save"> <!-- [!code highlight] -->
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title">

	<button type="submit">Save</button>
</form>
```

"Save" 버튼을 클릭하면, Livewire 컴포넌트의 `save()` 메서드가 실행되고 컴포넌트가 다시 렌더링됩니다.

Livewire 액션에 대해 더 배우려면 [액션 문서](/livewire/3.x/actions)를 참고하세요.

## 컴포넌트 렌더링하기 {#rendering-components}

Livewire 컴포넌트를 페이지에 렌더링하는 방법은 두 가지가 있습니다:

1. 기존 Blade 뷰 내에 포함하기
2. 라우트에 직접 할당하여 전체 페이지 컴포넌트로 사용하기

먼저, 더 간단한 첫 번째 방법을 살펴보겠습니다.

Blade 템플릿에서 `<livewire:component-name />` 문법을 사용하여 Livewire 컴포넌트를 포함할 수 있습니다:

```blade
<livewire:create-post />
```

컴포넌트 클래스가 `app/Livewire/` 디렉터리 내에 더 깊이 중첩되어 있다면, 디렉터리 중첩을 나타내기 위해 `.` 문자를 사용할 수 있습니다. 예를 들어, 컴포넌트가 `app/Livewire/EditorPosts/CreatePost.php`에 있다면 다음과 같이 렌더링할 수 있습니다:

```blade
<livewire:editor-posts.create-post />
```

> [!warning] 반드시 케밥 케이스를 사용해야 합니다
> 위 코드 예시에서 볼 수 있듯이, 컴포넌트 이름의 _케밥 케이스_ 버전을 반드시 사용해야 합니다. _StudlyCase_ 버전(`<livewire:CreatePost />`)을 사용하면 Livewire가 인식하지 못하므로 올바르지 않습니다.


### 컴포넌트에 데이터 전달하기 {#passing-data-into-components}

Livewire 컴포넌트에 외부 데이터를 전달하려면, 컴포넌트 태그에 속성을 사용할 수 있습니다. 이는 컴포넌트를 특정 데이터로 초기화하고 싶을 때 유용합니다.

`CreatePost` 컴포넌트의 `$title` 프로퍼티에 초기 값을 전달하려면, 다음과 같이 작성할 수 있습니다:

```blade
<livewire:create-post title="Initial Title" />
```

동적 값이나 변수를 컴포넌트에 전달해야 한다면, 속성 앞에 콜론을 붙여 PHP 표현식을 사용할 수 있습니다:

```blade
<livewire:create-post :title="$initialTitle" />
```

컴포넌트에 전달된 데이터는 `mount()` 라이프사이클 훅의 메서드 파라미터로 전달됩니다. 이 경우, `$title` 파라미터를 프로퍼티에 할당하려면 다음과 같이 `mount()` 메서드를 작성하면 됩니다:

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

이 예시에서 `$title` 프로퍼티는 "Initial Title" 값으로 초기화됩니다.

`mount()` 메서드는 클래스 생성자와 비슷하게 생각할 수 있습니다. 컴포넌트가 처음 로드될 때 실행되며, 페이지 내에서 이후 요청에는 실행되지 않습니다. `mount()` 및 기타 유용한 라이프사이클 훅에 대해 더 알아보려면 [라이프사이클 문서](/livewire/3.x/lifecycle-hooks)를 참고하세요.

컴포넌트의 보일러플레이트 코드를 줄이기 위해, `mount()` 메서드를 생략할 수도 있습니다. 이 경우 Livewire는 전달된 값과 이름이 일치하는 프로퍼티를 자동으로 설정합니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title; // [!code highlight]

    // ...
}
```

이는 `mount()` 메서드 내에서 `$title`을 할당하는 것과 사실상 동일합니다.

> [!warning] 이 프로퍼티들은 기본적으로 반응형이 아닙니다
> 외부의 `:title="$initialValue"`가 초기 페이지 로드 이후에 변경되더라도, `$title` 프로퍼티는 자동으로 업데이트되지 않습니다. 이는 Livewire를 사용할 때, 특히 Vue나 React와 같은 JavaScript 프레임워크에서 "파라미터"가 "반응형 props"처럼 동작한다고 가정하는 개발자들에게 흔한 혼동 포인트입니다. 하지만 걱정하지 마세요, Livewire는 [props를 반응형으로 만드는 기능](/livewire/3.x/nesting#reactive-props)을 제공합니다.


## 전체 페이지 컴포넌트 {#full-page-components}

Livewire는 컴포넌트를 Laravel 애플리케이션의 라우트에 직접 할당할 수 있습니다. 이를 "전체 페이지 컴포넌트"라고 부릅니다. 전체 페이지 컴포넌트를 사용하면, 로직과 뷰가 완전히 캡슐화된 독립적인 페이지를 Livewire 컴포넌트로 만들 수 있습니다.

전체 페이지 컴포넌트를 생성하려면, `routes/web.php` 파일에 라우트를 정의하고 `Route::get()` 메서드를 사용하여 컴포넌트를 특정 URL에 직접 매핑하면 됩니다. 예를 들어, `/posts/create` 전용 라우트에서 `CreatePost` 컴포넌트를 렌더링하고 싶다고 가정해봅시다.

`routes/web.php` 파일에 다음 라인을 추가하면 됩니다:

```php
use App\Livewire\CreatePost;

Route::get('/posts/create', CreatePost::class);
```

이제 브라우저에서 `/posts/create` 경로에 접속하면, `CreatePost` 컴포넌트가 전체 페이지 컴포넌트로 렌더링됩니다.

### 레이아웃 파일 {#layout-files}

전체 페이지 컴포넌트는 애플리케이션의 레이아웃을 사용합니다. 일반적으로 `resources/views/components/layouts/app.blade.php` 파일에 정의되어 있습니다.

이 파일이 아직 없다면, 다음 명령어를 실행하여 생성할 수 있습니다:

```shell
php artisan livewire:layout
```

이 명령어는 `resources/views/components/layouts/app.blade.php` 파일을 생성합니다.

이 위치에 Blade 파일을 생성하고, <span v-pre>`{{ $slot }}`</span> 플레이스홀더를 포함했는지 확인하세요:

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

모든 컴포넌트에서 커스텀 레이아웃을 사용하려면, `config/livewire.php`의 `layout` 키를 커스텀 레이아웃의 경로( `resources/views` 기준)로 설정하면 됩니다. 예를 들어:

```php
'layout' => 'layouts.app',
```

위 설정을 적용하면, Livewire는 전체 페이지 컴포넌트를 `resources/views/layouts/app.blade.php` 레이아웃 파일 안에 렌더링합니다.

#### 컴포넌트별 레이아웃 설정 {#per-component-layout-configuration}

특정 컴포넌트에 다른 레이아웃을 사용하려면, 컴포넌트의 `render()` 메서드 위에 Livewire의 `#[Layout]` 어트리뷰트를 추가하고, 커스텀 레이아웃의 상대 뷰 경로를 전달하면 됩니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Layout('layouts.app')] // [!code highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

또는, 클래스 선언 위에 이 어트리뷰트를 사용할 수도 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')] // [!code highlight]
class CreatePost extends Component
{
	// ...
}
```

PHP 어트리뷰트는 리터럴 값만 지원합니다. 동적 값을 전달해야 하거나, 이 대체 문법을 선호한다면, 컴포넌트의 `render()` 메서드에서 유창한 `->layout()` 메서드를 사용할 수 있습니다:

```php
public function render()
{
    return view('livewire.create-post')
	     ->layout('layouts.app'); // [!code highlight]
}
```

또는, Livewire는 `@extends`를 사용한 전통적인 Blade 레이아웃 파일도 지원합니다.

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
        ->extends('layouts.app'); // [!code highlight]
}
```

컴포넌트가 사용할 `@section`을 설정해야 한다면, `->section()` 메서드로 설정할 수 있습니다:

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app')
        ->section('body'); // [!code highlight]
}
```

### 페이지 타이틀 설정하기 {#setting-the-page-title}

애플리케이션의 각 페이지에 고유한 페이지 타이틀을 지정하는 것은 사용자와 검색 엔진 모두에게 도움이 됩니다.

전체 페이지 컴포넌트에 커스텀 페이지 타이틀을 설정하려면, 먼저 레이아웃 파일에 동적 타이틀이 포함되어 있는지 확인하세요:

```blade
<head>
    <title>{{ $title ?? 'Page Title' }}</title>
</head>
```

다음으로, Livewire 컴포넌트의 `render()` 메서드 위에 `#[Title]` 어트리뷰트를 추가하고, 페이지 타이틀을 전달하세요:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Title('Create Post')] // [!code highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

이렇게 하면 `CreatePost` Livewire 컴포넌트의 페이지 타이틀이 설정됩니다. 이 예시에서는 컴포넌트가 렌더링될 때 페이지 타이틀이 "Create Post"가 됩니다.

원한다면, 클래스 선언 위에 이 어트리뷰트를 사용할 수도 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Create Post')] // [!code highlight]
class CreatePost extends Component
{
	// ...
}
```

동적 타이틀(예: 컴포넌트 프로퍼티를 사용하는 타이틀)을 전달해야 한다면, 컴포넌트의 `render()` 메서드에서 `->title()` 유창한 메서드를 사용할 수 있습니다:

```php
public function render()
{
    return view('livewire.create-post')
	     ->title('Create Post'); // [!code highlight]
}
```

### 추가 레이아웃 파일 슬롯 설정하기 {#setting-additional-layout-file-slots}

[레이아웃 파일](#layout-files)에 `$slot` 외에 명명된 슬롯이 있다면, Blade 뷰에서 루트 엘리먼트 바깥에 `<x-slot>`을 정의하여 해당 내용을 설정할 수 있습니다. 예를 들어, 각 컴포넌트별로 페이지 언어를 개별적으로 설정하고 싶다면, 레이아웃 파일의 HTML 태그에 동적 `$lang` 슬롯을 추가할 수 있습니다:

```blade
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $lang ?? app()->getLocale()) }}"> <!-- [!code highlight] -->
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

그런 다음, 컴포넌트 뷰에서 루트 엘리먼트 바깥에 `<x-slot>` 요소를 정의하세요:

```blade
<x-slot:lang>fr</x-slot> // 이 컴포넌트는 프랑스어입니다 <!-- [!code highlight] -->

<div>
    // 프랑스어 콘텐츠가 여기에 들어갑니다...
</div>
```


### 라우트 파라미터 접근하기 {#accessing-route-parameters}

전체 페이지 컴포넌트에서 작업할 때, Livewire 컴포넌트 내에서 라우트 파라미터에 접근해야 할 수 있습니다.

예시를 위해, 먼저 `routes/web.php` 파일에 파라미터가 있는 라우트를 정의해봅시다:

```php
use App\Livewire\ShowPost;

Route::get('/posts/{id}', ShowPost::class);
```

여기서는 게시글의 ID를 나타내는 `id` 파라미터가 있는 라우트를 정의했습니다.

다음으로, Livewire 컴포넌트에서 `mount()` 메서드에서 라우트 파라미터를 받도록 업데이트합니다:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount($id) // [!code highlight]
    {
        $this->post = Post::findOrFail($id);
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

이 예시에서, 파라미터 이름 `$id`가 라우트 파라미터 `{id}`와 일치하므로, `/posts/1` URL에 접속하면 Livewire가 "1" 값을 `$id`로 전달합니다.

### 라우트 모델 바인딩 사용하기 {#using-route-model-binding}

Laravel의 라우트 모델 바인딩을 사용하면, 라우트 파라미터에서 Eloquent 모델을 자동으로 해결할 수 있습니다.

`routes/web.php` 파일에 모델 파라미터가 있는 라우트를 정의한 후:

```php
use App\Livewire\ShowPost;

Route::get('/posts/{post}', ShowPost::class);
```

이제 컴포넌트의 `mount()` 메서드에서 라우트 모델 파라미터를 받을 수 있습니다:

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post) // [!code highlight]
    {
        $this->post = $post;
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

Livewire는 `mount()`의 `$post` 파라미터에 `Post` 타입힌트가 붙어 있으므로 "라우트 모델 바인딩"을 사용해야 함을 인식합니다.

앞서와 마찬가지로, 보일러플레이트를 줄이기 위해 `mount()` 메서드를 생략할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post; // [!code highlight]

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

`$post` 프로퍼티는 라우트의 `{post}` 파라미터로 바인딩된 모델에 자동으로 할당됩니다.

### 응답 수정하기 {#modifying-the-response}

특정 상황에서는 응답을 수정하거나 커스텀 응답 헤더를 설정하고 싶을 수 있습니다. 뷰에서 `response()` 메서드를 호출하고, 클로저를 사용하여 응답 객체를 수정할 수 있습니다:

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

다행히도, Livewire는 맞춤형 자바스크립트와 상호작용할 수 있는 다양한 확장 포인트와 유틸리티를 제공합니다. [자바스크립트 문서 페이지](/livewire/3.x/javascript)에서 자세한 참조를 확인할 수 있습니다. 여기서는 Livewire 컴포넌트 내에서 직접 자바스크립트를 사용하는 몇 가지 유용한 방법을 소개합니다.

### 스크립트 실행하기 {#executing-scripts}

Livewire는 `<script>` 요소를 감싸서, 컴포넌트가 페이지에 초기화될 때 지정한 자바스크립트를 실행하는 유용한 `@script` 디렉티브를 제공합니다.

다음은 자바스크립트의 `setInterval()`을 사용하여 2초마다 컴포넌트를 새로고침하는 간단한 `@script` 예시입니다:

```blade
@script
<script>
    setInterval(() => {
        $wire.$refresh()
    }, 2000)
</script>
@endscript
```

여기서 `<script>` 내부에서 컴포넌트를 제어하기 위해 `$wire`라는 객체를 사용하고 있습니다. Livewire는 모든 `@script` 내에서 이 객체를 자동으로 사용할 수 있게 해줍니다. `$wire`에 익숙하지 않다면, 다음 문서에서 `$wire`에 대해 더 알아볼 수 있습니다:
* [자바스크립트에서 프로퍼티 접근하기](/livewire/3.x/properties#accessing-properties-from-javascript)
* [JS/Alpine에서 Livewire 액션 호출하기](/livewire/3.x/actions#calling-actions-from-alpine)
* [ `$wire` 객체 참조](/livewire/3.x/javascript#the-wire-object)

### 에셋 로딩하기 {#loading-assets}

일회성 `@script` 외에도, Livewire는 페이지에서 스크립트/스타일 의존성을 쉽게 로드할 수 있는 유용한 `@assets` 유틸리티를 제공합니다.

`@assets`는 제공된 에셋이 브라우저 페이지당 한 번만 로드되도록 보장합니다. 반면, `@script`는 Livewire 컴포넌트의 새 인스턴스가 초기화될 때마다 실행됩니다.

다음은 [Pikaday](https://github.com/Pikaday/Pikaday)라는 날짜 선택기 라이브러리를 `@assets`로 로드하고, `@script`로 컴포넌트 내에서 초기화하는 예시입니다:

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

> [!info] Blade 컴포넌트 내에서 `@verbatim@script@endverbatim` 및 `@verbatim@assets@endverbatim` 사용하기
> [Blade 컴포넌트](/laravel/12.x/blade#components)로 마크업 일부를 추출하는 경우, 해당 컴포넌트 내에서도 `@verbatim@script@endverbatim` 및 `@verbatim@assets@endverbatim`을 사용할 수 있습니다. 동일한 Livewire 컴포넌트 내에 여러 Blade 컴포넌트가 있더라도 마찬가지입니다. 단, `@verbatim@script@endverbatim` 및 `@verbatim@assets@endverbatim`은 현재 Livewire 컴포넌트 컨텍스트에서만 지원되므로, 해당 Blade 컴포넌트를 Livewire 외부에서만 사용할 경우에는 해당 스크립트와 에셋이 페이지에 로드되지 않습니다.
