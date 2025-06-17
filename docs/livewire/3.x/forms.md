# 폼(Form)
폼은 대부분의 웹 애플리케이션에서 핵심적인 역할을 하기 때문에, Livewire는 폼을 만들기 위한 다양한 유용한 도구들을 제공합니다. 간단한 입력 요소 처리부터 실시간 유효성 검사나 파일 업로드와 같은 복잡한 작업까지, Livewire는 여러분의 삶을 더 쉽게 하고 사용자에게 즐거움을 주는 간단하고 잘 문서화된 도구들을 제공합니다.

함께 살펴보겠습니다.

## 폼 제출하기 {#submitting-a-form}

`CreatePost` 컴포넌트에서 아주 간단한 폼을 살펴보겠습니다. 이 폼에는 두 개의 텍스트 입력창과 제출 버튼이 있으며, 폼의 상태와 제출을 관리하는 백엔드 코드도 포함되어 있습니다:
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
        Post::create(
            $this->only(['title', 'content'])
        );

        session()->flash('status', 'Post successfully updated.');

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
    <input type="text" wire:model="title">

    <input type="text" wire:model="content">

    <button type="submit">Save</button>
</form>
```

위에서 볼 수 있듯이, 우리는 `wire:model`을 사용하여 폼의 공개 속성인 `$title`과 `$content`를 "바인딩"하고 있습니다. 이것은 Livewire에서 가장 자주 사용되고 강력한 기능 중 하나입니다.

`$title`과 `$content`를 바인딩하는 것 외에도, `wire:submit`을 사용하여 "Save" 버튼이 클릭될 때 `submit` 이벤트를 감지하고 `save()` 액션을 호출합니다. 이 액션은 폼 입력값을 데이터베이스에 저장합니다.

새 게시물이 데이터베이스에 생성된 후, 사용자는 `ShowPosts` 컴포넌트 페이지로 리디렉션되고, 새 게시물이 생성되었다는 "플래시" 메시지가 표시됩니다.

### 유효성 검사 추가하기 {#adding-validation}

불완전하거나 위험한 사용자 입력이 저장되는 것을 방지하기 위해 대부분의 폼에는 입력값 유효성 검사가 필요합니다.

Livewire에서는 검증이 필요한 프로퍼티 위에 `#[Validate]` 속성을 추가하는 것만으로 폼 유효성 검사가 매우 간단해집니다.

프로퍼티에 `#[Validate]` 속성이 부착되면, 해당 프로퍼티의 값이 서버에서 업데이트될 때마다 유효성 검사 규칙이 적용됩니다.

`CreatePost` 컴포넌트의 `$title`과 `$content` 프로퍼티에 기본적인 유효성 검사 규칙을 추가해봅시다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Validate; // [tl! highlight]
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required')] // [tl! highlight]
    public $title = '';

    #[Validate('required')] // [tl! highlight]
    public $content = '';

    public function save()
    {
        $this->validate(); // [tl! highlight]

        Post::create(
            $this->only(['title', 'content'])
        );

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

Blade 템플릿도 수정하여 페이지에 유효성 검사 오류가 표시되도록 하겠습니다.

```blade
<form wire:submit="save">
    <input type="text" wire:model="title">
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror <!-- [tl! highlight] -->
    </div>

    <input type="text" wire:model="content">
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror <!-- [tl! highlight] -->
    </div>

    <button type="submit">Save</button>
</form>
```

이제 사용자가 아무 필드도 입력하지 않고 폼을 제출하려고 하면, 어떤 필드를 입력해야 하는지 알려주는 유효성 검사 메시지가 표시됩니다.

Livewire는 이 외에도 다양한 유효성 검사 기능을 제공합니다. 더 자세한 내용은 [유효성 검사 전용 문서 페이지](/livewire/3.x/validation)를 참고하세요.

### 폼 객체 추출하기 {#extracting-a-form-object}

큰 폼을 다루고 있고, 모든 속성, 검증 로직 등을 별도의 클래스로 분리하고 싶다면, Livewire는 폼 객체를 제공합니다.

폼 객체를 사용하면 폼 로직을 여러 컴포넌트에서 재사용할 수 있고, 모든 폼 관련 코드를 별도의 클래스로 묶어 컴포넌트 클래스를 더 깔끔하게 유지할 수 있습니다.

직접 폼 클래스를 만들 수도 있고, 편리한 artisan 명령어를 사용할 수도 있습니다:

```shell
php artisan livewire:form PostForm
```

위 명령어는 `app/Livewire/Forms/PostForm.php` 파일을 생성합니다.

이제 `CreatePost` 컴포넌트를 `PostForm` 클래스를 사용하도록 다시 작성해봅시다:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';
}
```

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public PostForm $form; // [tl! highlight]

    public function save()
    {
        $this->validate();

        Post::create(
            $this->form->only(['title', 'content']) // [tl! highlight]
        );

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
    <input type="text" wire:model="form.title">
    <div>
        @error('form.title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model="form.content">
    <div>
        @error('form.content') <span class="error">{{ $message }}</span> @enderror
    </div>

    <button type="submit">Save</button>
</form>
```

원한다면, 게시글 생성 로직도 폼 객체로 추출할 수 있습니다:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    public function store() // [tl! highlight:5]
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));
    }
}
```

이제 컴포넌트에서 `$this->form->store()`를 호출할 수 있습니다:

```php
class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
        $this->form->store(); // [tl! highlight]

        return $this->redirect('/posts');
    }

    // ...
}
```

이 폼 객체를 생성 및 수정 폼 모두에 사용하고 싶다면, 두 경우 모두 처리할 수 있도록 쉽게 확장할 수 있습니다.

아래는 같은 폼 객체를 `UpdatePost` 컴포넌트에서 사용하고, 초기 데이터를 채우는 예시입니다:

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public PostForm $form;

    public function mount(Post $post)
    {
        $this->form->setPost($post);
    }

    public function save()
    {
        $this->form->update();

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;
use App\Models\Post;

class PostForm extends Form
{
    public ?Post $post;

    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    public function setPost(Post $post)
    {
        $this->post = $post;

        $this->title = $post->title;

        $this->content = $post->content;
    }

    public function store()
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));
    }

    public function update()
    {
        $this->validate();

        $this->post->update(
            $this->only(['title', 'content'])
        );
    }
}
```

보시다시피, `PostForm` 객체에 `setPost()` 메서드를 추가하여 기존 데이터를 폼에 채우거나, 폼 객체에 게시글을 저장해두고 나중에 사용할 수 있도록 했습니다. 또한 기존 게시글을 수정하는 `update()` 메서드도 추가했습니다.

폼 객체는 Livewire에서 필수는 아니지만, 반복적인 보일러플레이트 코드를 줄이고 컴포넌트를 더 깔끔하게 유지할 수 있는 좋은 추상화 방법을 제공합니다.

### 폼 필드 리셋하기 {#resetting-form-fields}

폼 객체를 사용할 때, 폼이 제출된 후에 폼을 리셋하고 싶을 수 있습니다. 이는 `reset()` 메서드를 호출하여 할 수 있습니다:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    // ...

    public function store()
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));

        $this->reset(); // [tl! highlight]
    }
}
```

`reset()` 메서드에 프로퍼티 이름을 전달하여 특정 프로퍼티만 리셋할 수도 있습니다:

```php
$this->reset('title');

// 또는 여러 개를 한 번에...

$this->reset(['title', 'content']);
```

### 폼 필드 가져오기 {#pulling-form-fields}

또한, `pull()` 메서드를 사용하여 폼의 속성을 한 번에 가져오고 초기화할 수 있습니다.

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    // ...

    public function store()
    {
        $this->validate();

        Post::create(
            $this->pull() // [tl! highlight]
        );
    }
}
```

`pull()` 메서드에 속성 이름을 전달하여 특정 속성만 가져올 수도 있습니다:

```php
// 값을 반환한 후 초기화합니다...
$this->pull('title');

 // 키-값 배열로 속성들을 반환한 후 초기화합니다...
$this->pull(['title', 'content']);
```

### Rule 객체 사용하기 {#using-rule-objects}

더 복잡한 검증 시나리오에서 Laravel의 `Rule` 객체가 필요하다면, `rules()` 메서드를 정의하여 다음과 같이 검증 규칙을 선언할 수 있습니다:

```php
<?php

namespace App\Livewire\Forms;

use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    public ?Post $post;

    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post), // [tl! highlight]
            ],
            'content' => 'required|min:5',
        ];
    }

    // ...

    public function update()
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));

        $this->reset();
    }
}
```

`#[Validate]` 대신 `rules()` 메서드를 사용할 경우, Livewire는 속성이 업데이트될 때마다가 아니라 `$this->validate()`를 호출할 때만 검증 규칙을 실행합니다.

실시간 검증이나, 매 요청마다 특정 필드를 검증하고 싶은 경우에는 다음과 같이 규칙 없이 `#[Validate]`를 사용할 수 있습니다:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    public ?Post $post;

    #[Validate] // [tl! highlight]
    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post),
            ],
            'content' => 'required|min:5',
        ];
    }

    // ...

    public function update()
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));

        $this->reset();
    }
}
```

이제 [`wire:model.blur`](/livewire/3.x/wire-model#updating-on-blur-event)과 같이 폼이 제출되기 전에 `$title` 속성이 업데이트되면, `$title`에 대한 검증이 실행됩니다.

### 로딩 인디케이터 표시하기 {#showing-a-loading-indicator}

기본적으로 Livewire는 폼이 제출되는 동안 자동으로 제출 버튼을 비활성화하고 입력값을 `readonly`로 표시하여, 첫 번째 제출이 처리되는 동안 사용자가 폼을 다시 제출하지 못하도록 방지합니다.

하지만 애플리케이션 UI에 추가적인 표시가 없다면 사용자가 이러한 "로딩" 상태를 인지하기 어려울 수 있습니다.

아래는 `wire:loading`을 사용하여 "저장" 버튼에 작은 로딩 스피너를 추가하는 예시입니다. 이를 통해 사용자는 폼이 제출 중임을 쉽게 알 수 있습니다:

```blade
<button type="submit">
    저장

    <div wire:loading>
        <svg>...</svg> <!-- SVG 로딩 스피너 -->
    </div>
</button>
```

이제 사용자가 "저장"을 누르면, 작은 인라인 스피너가 표시됩니다.

Livewire의 `wire:loading` 기능은 이 외에도 다양한 기능을 제공합니다. 더 자세한 내용은 [로딩 문서](/livewire/3.x/wire-loading)를 참고하세요.

## 실시간 업데이트 필드 {#live-updating-fields}

기본적으로 Livewire는 폼이 제출될 때(또는 다른 [액션](/livewire/3.x/actions)이 호출될 때)만 네트워크 요청을 보냅니다. 폼을 작성하는 도중에는 네트워크 요청이 발생하지 않습니다.

예를 들어, `CreatePost` 컴포넌트를 살펴봅시다. 사용자가 입력하는 동안 "title" 입력 필드가 백엔드의 `$title` 속성과 동기화되도록 하려면, `wire:model`에 `.live` 수식어를 다음과 같이 추가할 수 있습니다:

```blade
<input type="text" wire:model.live="title">
```

이제 사용자가 이 필드에 입력할 때마다 네트워크 요청이 서버로 전송되어 `$title`이 업데이트됩니다. 이는 사용자가 검색창에 입력할 때 데이터셋이 실시간으로 필터링되는 실시간 검색과 같은 기능에 유용합니다.

## _blur_에서만 필드 업데이트하기 {#only-updating-fields-on-blur}

대부분의 경우, `wire:model.live`는 실시간 폼 필드 업데이트에 적합하지만, 텍스트 입력란에서는 네트워크 리소스를 과도하게 사용할 수 있습니다.

사용자가 입력할 때마다 네트워크 요청을 보내는 대신, 사용자가 텍스트 입력란에서 "탭"을 하거나(즉, 입력란이 "블러"될 때)만 요청을 보내고 싶다면, `.blur` 수식어를 사용할 수 있습니다:

```blade
<input type="text" wire:model.blur="title" >
```

이제 서버의 컴포넌트 클래스는 사용자가 탭을 누르거나 텍스트 입력란 밖을 클릭할 때까지 업데이트되지 않습니다.

## 실시간 유효성 검사 {#real-time-validation}

때때로 사용자가 폼을 작성하는 동안 유효성 검사 오류를 바로 보여주고 싶을 때가 있습니다. 이렇게 하면 사용자는 전체 폼을 다 작성할 때까지 기다리지 않고도 잘못된 부분을 미리 알 수 있습니다.

Livewire는 이러한 기능을 자동으로 처리합니다. `wire:model`에 `.live` 또는 `.blur`를 사용하면, 사용자가 폼을 작성하는 동안 Livewire가 네트워크 요청을 보냅니다. 각 네트워크 요청마다 해당 속성을 업데이트하기 전에 적절한 유효성 검사 규칙이 실행됩니다. 유효성 검사에 실패하면, 해당 속성은 서버에 업데이트되지 않고 사용자에게 유효성 검사 메시지가 표시됩니다:

```blade
<input type="text" wire:model.blur="title">

<div>
    @error('title') <span class="error">{{ $message }}</span> @enderror
</div>
```

```php
#[Validate('required|min:5')]
public $title = '';
```

이제 사용자가 "title" 입력란에 세 글자만 입력하고 폼의 다음 입력란을 클릭하면, 해당 필드는 최소 다섯 글자를 입력해야 한다는 유효성 검사 메시지가 표시됩니다.

더 자세한 내용은 [유효성 검사 문서 페이지](/livewire/3.x/validation)를 참고하세요.

## 실시간 폼 저장 {#real-time-form-saving}

사용자가 "제출" 버튼을 클릭할 때까지 기다리지 않고, 입력하는 즉시 폼을 자동으로 저장하고 싶다면 Livewire의 `updated()` 훅을 사용할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public Post $post;

    #[Validate('required')]
    public $title = '';

    #[Validate('required')]
    public $content = '';

    public function mount(Post $post)
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function updated($name, $value) // [tl! highlight:5]
    {
        $this->post->update([
            $name => $value,
        ]);
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit>
    <input type="text" wire:model.blur="title">
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model.blur="content">
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror
    </div>
</form>
```

위 예제에서 사용자가 필드를 완료(클릭하거나 탭하여 다음 필드로 이동)하면, 해당 속성을 컴포넌트에 업데이트하기 위한 네트워크 요청이 전송됩니다. 클래스의 속성이 즉시 업데이트된 후, 해당 속성 이름과 새로운 값으로 `updated()` 훅이 호출됩니다.

이 훅을 사용하여 데이터베이스에서 해당 필드만 업데이트할 수 있습니다.

또한, 해당 속성에 `#[Validate]` 속성이 지정되어 있기 때문에, 속성이 업데이트되고 `updated()` 훅이 호출되기 전에 유효성 검사 규칙이 실행됩니다.

"updated" 라이프사이클 훅과 다른 훅에 대해 더 알아보려면 [라이프사이클 훅 문서](/livewire/3.x/lifecycle-hooks)를 참고하세요.

## 변경 사항 표시 인디케이터 표시하기 {#showing-dirty-indicators}

위에서 다룬 실시간 저장 시나리오에서는 사용자가 필드가 아직 데이터베이스에 저장되지 않았음을 알 수 있도록 표시해 주는 것이 도움이 될 수 있습니다.

예를 들어, 사용자가 `UpdatePost` 페이지를 방문하여 텍스트 입력란에서 게시물의 제목을 수정하기 시작할 때, 폼 하단에 "저장" 버튼이 없다면 제목이 실제로 언제 데이터베이스에 업데이트되는지 명확하지 않을 수 있습니다.

Livewire는 입력값이 서버 측 컴포넌트와 달라질 때 요소를 토글하거나 클래스를 변경할 수 있도록 `wire:dirty` 디렉티브를 제공합니다:

```blade
<input type="text" wire:model.blur="title" wire:dirty.class="border-yellow">
```

위 예시에서 사용자가 입력 필드에 타이핑하면 해당 필드에 노란색 테두리가 나타납니다. 사용자가 탭으로 이동하면 네트워크 요청이 전송되고 테두리가 사라집니다. 이는 입력값이 저장되어 더 이상 "변경됨(dirty)" 상태가 아님을 사용자에게 알리는 신호입니다.

전체 요소의 표시 여부를 토글하고 싶다면, `wire:dirty`를 `wire:target`과 함께 사용할 수 있습니다. `wire:target`은 "변경됨" 상태를 감지할 데이터를 지정하는 데 사용됩니다. 이 경우에는 "title" 필드입니다:

```blade
<input type="text" wire:model="title">

<div wire:dirty wire:target="title">저장되지 않음...</div>
```

## 입력 디바운싱 {#debouncing-input}

텍스트 입력란에서 `.live`를 사용할 때, 네트워크 요청이 얼마나 자주 전송되는지 더 세밀하게 제어하고 싶을 수 있습니다. 기본적으로 입력에는 "250ms"의 디바운스가 적용되지만, `.debounce` 수식어를 사용하여 이를 커스터마이즈할 수 있습니다:

```blade
<input type="text" wire:model.live.debounce.150ms="title" >
```

이제 필드에 `.debounce.150ms`가 추가되어, 이 필드의 입력 업데이트를 처리할 때 더 짧은 "150ms" 디바운스가 사용됩니다. 즉, 사용자가 입력할 때 최소 150밀리초 동안 입력을 멈춰야 네트워크 요청이 전송됩니다.

## 입력 제한(Throttling input) {#throttling-input}

앞서 언급했듯이, 입력 디바운스가 필드에 적용되면 사용자가 일정 시간 동안 입력을 멈출 때까지 네트워크 요청이 전송되지 않습니다. 즉, 사용자가 긴 메시지를 계속 입력하는 동안에는 사용이 끝날 때까지 네트워크 요청이 전송되지 않습니다.

하지만 때로는 이러한 동작이 원하는 방식이 아닐 수 있으며, 사용자가 입력을 마치거나 잠시 멈췄을 때가 아니라 입력하는 도중에도 네트워크 요청을 보내고 싶을 수 있습니다.

이런 경우에는 `.throttle`을 사용하여 네트워크 요청을 보낼 시간 간격을 지정할 수 있습니다:

```blade
<input type="text" wire:model.live.throttle.150ms="title" >
```

위 예시에서 사용자가 "title" 필드에 계속 입력하는 동안, 사용이 끝날 때까지 150밀리초마다 네트워크 요청이 전송됩니다.

## 입력 필드를 Blade 컴포넌트로 추출하기 {#extracting-input-fields-to-blade-components}

우리가 지금까지 살펴본 `CreatePost` 예제와 같은 작은 컴포넌트에서도, 검증 메시지나 라벨 등과 같은 폼 필드의 반복적인 보일러플레이트 코드가 많이 중복되는 경우가 있습니다.

이러한 반복적인 UI 요소들을 전용 [Blade 컴포넌트](https://laravel.com/docs/blade#components)로 추출하여 애플리케이션 전반에서 공유하는 것이 도움이 될 수 있습니다.

예를 들어, 아래는 `CreatePost` 컴포넌트의 원래 Blade 템플릿입니다. 우리는 아래 두 개의 텍스트 입력 필드를 전용 Blade 컴포넌트로 추출할 것입니다:

```blade
<form wire:submit="save">
    <input type="text" wire:model="title"> <!-- [tl! highlight:3] -->
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model="content"> <!-- [tl! highlight:3] -->
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror
    </div>

    <button type="submit">Save</button>
</form>
```

아래는 재사용 가능한 Blade 컴포넌트 `<x-input-text>`로 추출한 후의 템플릿입니다:

```blade
<form wire:submit="save">
    <x-input-text name="title" wire:model="title" /> <!-- [tl! highlight] -->

    <x-input-text name="content" wire:model="content" /> <!-- [tl! highlight] -->

    <button type="submit">Save</button>
</form>
```

다음은 `x-input-text` 컴포넌트의 소스입니다:

```blade
<!-- resources/views/components/input-text.blade.php -->

@props(['name'])

<input type="text" name="{{ $name }}" {{ $attributes }}>

<div>
    @error($name) <span class="error">{{ $message }}</span> @enderror
</div>
```

보시다시피, 반복되는 HTML을 전용 Blade 컴포넌트 안에 넣었습니다.

대부분의 경우, Blade 컴포넌트는 원래 컴포넌트에서 추출한 HTML만을 포함합니다. 하지만 두 가지가 추가되었습니다:

* `@props` 디렉티브
* input에 있는 <span v-pre>`{{ $attributes }}`</span> 구문

이 추가 사항들에 대해 살펴보겠습니다:

`@props(['name'])`를 사용하여 `name`을 "prop"으로 지정하면, Blade는 이 컴포넌트에 "name"이라는 속성이 설정되어 있으면 그 값을 `$name`으로 사용할 수 있도록 해줍니다.

명시적으로 목적이 없는 다른 속성들은 <span v-pre>`{{ $attributes }}`</span> 구문을 사용했습니다. 이것은 "속성 전달(attribute forwarding)"을 위한 것으로, Blade 컴포넌트에 작성된 모든 HTML 속성을 컴포넌트 내부의 요소로 전달해줍니다.

이렇게 하면 `wire:model="title"`과 같은 속성이나, `disabled`, `class="..."`, `required` 등 추가 속성들도 실제 `<input>` 요소에 그대로 전달됩니다.

### 커스텀 폼 컨트롤 {#custom-form-controls}

이전 예제에서는 입력 요소(input element)를 재사용 가능한 Blade 컴포넌트로 "래핑"하여, 마치 네이티브 HTML 입력 요소처럼 사용할 수 있도록 했습니다.

이 패턴은 매우 유용하지만, 경우에 따라 네이티브 입력 요소 없이 완전히 새로운 입력 컴포넌트를 직접 만들고 싶을 수도 있습니다. 그럼에도 불구하고 `wire:model`을 사용해 Livewire 속성과 값을 바인딩할 수 있어야 합니다.

예를 들어, Alpine으로 작성된 간단한 "카운터" 입력 컴포넌트인 `<x-input-counter />`를 만들고 싶다고 가정해봅시다.

Blade 컴포넌트를 만들기 전에, 참고용으로 순수 Alpine만으로 만든 간단한 "카운터" 컴포넌트를 먼저 살펴보겠습니다:

```blade
<div x-data="{ count: 0 }">
    <button x-on:click="count--">-</button>

    <span x-text="count"></span>

    <button x-on:click="count++">+</button>
</div>
```

위 컴포넌트는 숫자와 그 숫자를 증가/감소시키는 두 개의 버튼을 보여줍니다.

이제 이 컴포넌트를 `<x-input-counter />`라는 Blade 컴포넌트로 추출해서, 다음과 같이 컴포넌트 내에서 사용하고 싶다고 가정해봅시다:

```blade
<x-input-counter wire:model="quantity" />
```

이 컴포넌트를 만드는 것은 대부분 간단합니다. 카운터의 HTML을 `resources/views/components/input-counter.blade.php`와 같은 Blade 컴포넌트 템플릿에 넣으면 됩니다.

하지만, `wire:model="quantity"`와 함께 작동하여 Livewire 컴포넌트의 데이터를 Alpine 컴포넌트 내부의 "count"와 쉽게 바인딩하려면 한 가지 추가 단계가 필요합니다.

컴포넌트의 소스는 다음과 같습니다:

```blade
<!-- resources/view/components/input-counter.blade.php -->

<div x-data="{ count: 0 }" x-modelable="count" {{ $attributes}}>
    <button x-on:click="count--">-</button>

    <span x-text="count"></span>

    <button x-on:click="count++">+</button>
</div>
```

보시다시피, 이 HTML에서 달라진 점은 `x-modelable="count"`와 <span v-pre>`{{ $attributes }}`</span>뿐입니다.

`x-modelable`은 Alpine에서 특정 데이터를 외부에서 바인딩할 수 있도록 해주는 유틸리티입니다. [Alpine 공식 문서에서 이 디렉티브에 대해 더 자세히 확인할 수 있습니다.](https://alpinejs.dev/directives/modelable)

<span v-pre>`{{ $attributes }}`</span>는 앞서 살펴본 것처럼, Blade 컴포넌트에 외부에서 전달된 모든 속성을 전달해줍니다. 이 경우, `wire:model` 디렉티브가 전달됩니다.

<span v-pre>`{{ $attributes }}`</span> 덕분에, 브라우저에서 HTML이 렌더링될 때 `wire:model="quantity"`가 Alpine 컴포넌트의 루트 `<div>`에 `x-modelable="count"`와 함께 렌더링됩니다:

```blade
<div x-data="{ count: 0 }" x-modelable="count" wire:model="quantity">
```

`x-modelable="count"`는 Alpine에게 `x-model`이나 `wire:model` 구문을 찾아서 "count" 데이터에 바인딩하라고 지시합니다.

`x-modelable`은 `wire:model`과 `x-model` 모두에서 동작하기 때문에, 이 Blade 컴포넌트를 Livewire와 Alpine 모두에서 자유롭게 사용할 수 있습니다. 다음은 이 Blade 컴포넌트를 순수 Alpine 환경에서 사용하는 예시입니다:

```blade
<x-input-counter x-model="quantity" />
```

애플리케이션에서 커스텀 입력 요소를 만드는 것은 매우 강력하지만, Livewire와 Alpine이 제공하는 유틸리티와 이들이 서로 어떻게 상호작용하는지에 대한 더 깊은 이해가 필요합니다.
