# [기능] 리디렉션
사용자가 폼 제출과 같은 어떤 동작을 수행한 후, 애플리케이션의 다른 페이지로 리디렉션하고 싶을 수 있습니다.

Livewire 요청은 표준 전체 페이지 브라우저 요청이 아니기 때문에, 일반적인 HTTP 리디렉션은 동작하지 않습니다. 대신, JavaScript를 통해 리디렉션을 트리거해야 합니다. 다행히도, Livewire는 컴포넌트 내에서 사용할 수 있는 간단한 `$this->redirect()` 헬퍼 메서드를 제공합니다. 내부적으로 Livewire가 프론트엔드에서 리디렉션 과정을 처리합니다.

원한다면, 컴포넌트 내에서 [Laravel의 내장 리디렉션 유틸리티](https://laravel.com/docs/responses#redirects)도 사용할 수 있습니다.

## 기본 사용법 {#basic-usage}

아래는 사용자가 게시글을 작성하는 폼을 제출한 후 다른 페이지로 리디렉션하는 `CreatePost` Livewire 컴포넌트의 예시입니다:
```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
		Post::create([
			'title' => $this->title,
			'content' => $this->content,
		]);

		$this->redirect('/posts'); // [!code highlight]
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

보시다시피, `save` 액션이 트리거되면 `/posts`로 리디렉션도 함께 실행됩니다. Livewire가 이 응답을 받으면, 프론트엔드에서 사용자를 새로운 URL로 리디렉션합니다.

## 라우트로 리디렉션 {#redirect-to-route}

라우트 이름을 사용하여 페이지로 리디렉션하고 싶을 때는 `redirectRoute`를 사용할 수 있습니다.

예를 들어, `'profile'`이라는 이름의 라우트가 있는 페이지가 다음과 같이 있다고 가정해봅시다:

```php
    Route::get('/user/profile', function () {
        // ...
    })->name('profile');
```

라우트의 이름을 사용하여 해당 페이지로 리디렉션하려면 `redirectRoute`를 다음과 같이 사용할 수 있습니다:

```php
    $this->redirectRoute('profile');
```

라우트에 파라미터를 전달해야 하는 경우, `redirectRoute` 메서드의 두 번째 인자를 사용하면 됩니다:

```php
    $this->redirectRoute('profile', ['id' => 1]);
```

## 의도한 위치로 리디렉션 {#redirect-to-intended}

사용자를 이전에 있던 페이지로 다시 리디렉션하고 싶을 때는 `redirectIntended`를 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 선택적인 기본 URL을 받을 수 있으며, 이전 페이지를 확인할 수 없을 때 대체 경로로 사용됩니다:

```php
    $this->redirectIntended('/default/url');
```

## 전체 페이지 컴포넌트로 리디렉션하기 {#redirecting-to-full-page-components}

Livewire는 Laravel의 내장 리디렉션 기능을 사용하므로, 일반적인 Laravel 애플리케이션에서 사용할 수 있는 모든 리디렉션 메서드를 사용할 수 있습니다.

예를 들어, 다음과 같이 라우트에 Livewire 컴포넌트를 전체 페이지 컴포넌트로 사용하는 경우:

```php
use App\Livewire\ShowPosts;

Route::get('/posts', ShowPosts::class);
```

`redirect()` 메서드에 컴포넌트 이름을 전달하여 해당 컴포넌트로 리디렉션할 수 있습니다:

```php
public function save()
{
    // ...

    $this->redirect(ShowPosts::class);
}
```

## 플래시 메시지 {#flash-messages}

Laravel의 기본 리디렉션 메서드를 사용할 수 있을 뿐만 아니라, Livewire는 Laravel의 [세션 플래시 데이터 유틸리티](https://laravel.com/docs/session#flash-data)도 지원합니다.

리디렉션과 함께 플래시 데이터를 전달하려면, 다음과 같이 Laravel의 `session()->flash()` 메서드를 사용할 수 있습니다:

```php
use Livewire\Component;

class UpdatePost extends Component
{
    // ...

    public function update()
    {
        // ...

        session()->flash('status', '게시물이 성공적으로 수정되었습니다.');

        $this->redirect('/posts');
    }
}
```

리디렉션되는 페이지에 다음과 같은 Blade 코드가 포함되어 있다고 가정하면, 사용자는 게시물을 수정한 후 "게시물이 성공적으로 수정되었습니다."라는 메시지를 보게 됩니다:

```blade
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```
