# 생명주기 훅
Livewire는 컴포넌트의 생명주기 동안 특정 시점에 코드를 실행할 수 있도록 다양한 생명주기 훅을 제공합니다. 이러한 훅을 통해 컴포넌트 초기화, 속성 업데이트, 템플릿 렌더링 등 특정 이벤트 전후에 동작을 수행할 수 있습니다.

다음은 사용 가능한 모든 컴포넌트 생명주기 훅의 목록입니다:

| 훅 메서드                             | 설명                                |
|-----------------------------------|-----------------------------------|
| `mount()`                         | 컴포넌트가 생성될 때 호출됨                   |
| `hydrate()`                       | 이후 요청의 시작 시 컴포넌트가 재-하이드레이트될 때 호출됨 |
| `boot()`                          | 모든 요청의 시작 시 호출됨. 최초 및 이후 요청 모두 해당 |
| `updating()`                      | 컴포넌트 속성이 업데이트되기 전에 호출됨            |
| `updated()`                       | 속성이 업데이트된 후 호출됨                   |
| `rendering()`                     | `render()`가 호출되기 전에 호출됨           |
| `rendered()`                      | `render()`가 호출된 후 호출됨             |
| `dehydrate()`                     | 모든 컴포넌트 요청의 마지막에 호출됨              |
| `exception($e, $stopPropagation)` | 예외가 발생했을 때 호출됨                    |                    |
## Mount {#mount}

일반적인 PHP 클래스에서는 생성자(`__construct()`)가 외부 매개변수를 받아 객체의 상태를 초기화합니다. 그러나 Livewire에서는 컴포넌트의 상태를 초기화하고 매개변수를 받기 위해 `mount()` 메서드를 사용합니다.

Livewire 컴포넌트는 `__construct()`를 사용하지 않습니다. 그 이유는 Livewire 컴포넌트가 이후 네트워크 요청에서 _재-생성_ 되기 때문이며, 컴포넌트가 처음 생성될 때만 한 번 초기화되기를 원하기 때문입니다.

아래는 `UpdateProfile` 컴포넌트의 `name`과 `email` 속성을 초기화하기 위해 `mount()` 메서드를 사용하는 예시입니다:

```php
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class UpdateProfile extends Component
{
    public $name;

    public $email;

    public function mount()
    {
        $this->name = Auth::user()->name;

        $this->email = Auth::user()->email;
    }

    // ...
}
```

앞서 언급했듯이, `mount()` 메서드는 컴포넌트에 전달된 데이터를 메서드 매개변수로 받을 수 있습니다:

```php
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $title;

    public $content;

    public function mount(Post $post)
    {
        $this->title = $post->title;

        $this->content = $post->content;
    }

    // ...
}
```

> [!tip] 모든 훅 메서드에서 의존성 주입을 사용할 수 있습니다
> Livewire는 생명주기 훅의 메서드 매개변수에 타입힌트를 지정하여 [Laravel의 서비스 컨테이너](/laravel/12.x/container#automatic-injection)에서 의존성을 해결할 수 있도록 지원합니다.

`mount()` 메서드는 Livewire 사용에 있어 매우 중요한 부분입니다. 다음 문서에서 `mount()` 메서드를 사용하여 일반적인 작업을 수행하는 추가 예시를 확인할 수 있습니다:

* [속성 초기화하기](/livewire/3.x/properties#initializing-properties)
* [부모 컴포넌트로부터 데이터 받기](/livewire/3.x/nesting#passing-props-to-children)
* [라우트 파라미터 접근하기](/livewire/3.x/components#accessing-route-parameters)

## Boot {#boot}

`mount()`가 유용하긴 하지만, 컴포넌트 생명주기마다 한 번만 실행됩니다. 특정 컴포넌트에 대해 서버로의 모든 요청이 시작될 때마다 로직을 실행하고 싶을 수 있습니다.

이러한 경우를 위해 Livewire는 `boot()` 메서드를 제공합니다. 이 메서드에 컴포넌트가 부팅될 때마다(초기화 및 이후 요청 모두) 실행할 설정 코드를 작성할 수 있습니다.

`boot()` 메서드는 요청 간에 유지되지 않는 보호된 속성(protected property) 등을 초기화하는 데 유용할 수 있습니다. 아래는 Eloquent 모델을 보호된 속성으로 초기화하는 예시입니다:

```php
use Livewire\Attributes\Locked;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    #[Locked]
    public $postId = 1;

    protected Post $post;

    public function boot() // [!code highlight:4]
    {
        $this->post = Post::find($this->postId);
    }

    // ...
}
```

이 기법을 사용하면 Livewire 컴포넌트에서 속성 초기화를 완전히 제어할 수 있습니다.

> [!tip] 대부분의 경우, 대신 계산 속성을 사용할 수 있습니다
> 위에서 사용한 기법은 강력하지만, 이 경우에는 [Livewire의 계산 속성](/livewire/3.x/computed-properties)을 사용하는 것이 더 좋습니다.

> [!warning] 민감한 공개 속성은 항상 잠그세요
> 위 예시에서처럼 `$postId` 속성에 `#[Locked]` 속성을 사용하고 있습니다. 위와 같이 사용자가 클라이언트 측에서 `$postId` 속성을 조작하지 못하도록 보장하고 싶을 때, 속성 값을 사용하기 전에 권한을 확인하거나 속성에 `#[Locked]`를 추가하여 절대 변경되지 않도록 하는 것이 중요합니다.
>
> 자세한 내용은 [Locked 속성에 대한 문서](/livewire/3.x/locked)를 참고하세요.


## Update {#update}

클라이언트 측 사용자는 여러 가지 방법으로 공개 속성을 업데이트할 수 있으며, 가장 일반적으로는 `wire:model`이 적용된 입력값을 수정하는 방식이 있습니다.

Livewire는 공개 속성이 업데이트될 때 이를 가로채어 값이 설정되기 전에 유효성 검사나 권한 확인을 하거나, 속성이 특정 형식으로 설정되도록 할 수 있는 편리한 훅을 제공합니다.

아래는 `updating`을 사용하여 `$postId` 속성의 수정을 방지하는 예시입니다.

특히 이 예시의 경우, 실제 애플리케이션에서는 위에서처럼 [`#[Locked]` 속성](/livewire/3.x/locked)을 사용하는 것이 더 적합합니다.

```php
use Exception;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId = 1;

    public function updating($property, $value)
    {
        // $property: 현재 업데이트 중인 속성의 이름
        // $value: 속성에 설정될 값

        if ($property === 'postId') {
            throw new Exception;
        }
    }

    // ...
}
```

위의 `updating()` 메서드는 속성이 업데이트되기 전에 실행되어, 잘못된 입력을 감지하고 속성 업데이트를 방지할 수 있습니다. 아래는 `updated()`를 사용하여 속성 값의 일관성을 유지하는 예시입니다:

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updated($property)
    {
        // $property: 방금 업데이트된 속성의 이름

        if ($property === 'username') {
            $this->username = strtolower($this->username);
        }
    }

    // ...
}
```

이제 클라이언트 측에서 `$username` 속성이 업데이트될 때마다 값이 항상 소문자로 유지됩니다.

업데이트 훅을 사용할 때 특정 속성을 대상으로 하는 경우가 많기 때문에, Livewire는 메서드 이름에 속성명을 직접 지정할 수 있도록 지원합니다. 아래는 위 예시를 이 기법을 활용하여 다시 작성한 것입니다:

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updatedUsername()
    {
        $this->username = strtolower($this->username);
    }

    // ...
}
```

물론, 이 기법은 `updating` 훅에도 적용할 수 있습니다.

### 배열 {#arrays}

배열 속성의 경우, 변경되는 요소를 지정하기 위해 추가로 `$key` 인자가 이 함수들에 전달됩니다.

배열 자체가 업데이트될 때(특정 키가 아닌 경우)에는 `$key` 인자가 null입니다.

```php
use Livewire\Component;

class UpdatePreferences extends Component
{
    public $preferences = [];

    public function updatedPreferences($value, $key)
    {
        // $value = 'dark'
        // $key   = 'theme'
    }

    // ...
}
```

## Hydrate & Dehydrate {#hydrate-dehydrate}

Hydrate와 dehydrate는 덜 알려져 있고 덜 자주 사용되는 훅입니다. 하지만 특정 상황에서는 매우 강력할 수 있습니다.

"dehydrate"와 "hydrate"라는 용어는 Livewire 컴포넌트가 클라이언트 측으로 직렬화되어 JSON으로 전송되고, 이후 요청에서 다시 PHP 객체로 역직렬화되는 과정을 의미합니다.

Livewire의 코드베이스와 문서 전반에서 이 과정을 "hydrate"와 "dehydrate"라고 부릅니다. 이 용어에 대해 더 명확히 알고 싶다면 [하이드레이션 문서](/livewire/3.x/hydration)를 참고하세요.

아래는 Eloquent 모델 대신 커스텀 [데이터 전송 객체(DTO)](https://en.wikipedia.org/wiki/Data_transfer_object)를 사용하여 컴포넌트 내에 게시글 데이터를 저장하기 위해 `mount()`, `hydrate()`, `dehydrate()`를 모두 사용하는 예시입니다:

```php
use Livewire\Component;

class ShowPost extends Component
{
    public $post;

    public function mount($title, $content)
    {
        // 최초 초기 요청의 시작 시 실행됨...

        $this->post = new PostDto([
            'title' => $title,
            'content' => $content,
        ]);
    }

    public function hydrate()
    {
        // 모든 "이후" 요청의 시작 시 실행됨...
        // 최초 요청에서는 실행되지 않음("mount"가 실행됨)...

        $this->post = new PostDto($this->post);
    }

    public function dehydrate()
    {
        // 모든 요청의 마지막에 실행됨...

        $this->post = $this->post->toArray();
    }

    // ...
}
```

이제 컴포넌트 내부의 액션이나 다른 곳에서 원시 데이터 대신 `PostDto` 객체에 접근할 수 있습니다.

위 예시는 주로 `hydrate()`와 `dehydrate()` 훅의 기능과 성격을 보여줍니다. 하지만 실제로는 [Wireable 또는 Synthesizer](/livewire/3.x/properties#supporting-custom-types)를 사용하는 것이 더 권장됩니다.

## Render {#render}

컴포넌트의 Blade 뷰 렌더링 과정에 개입하고 싶다면, `rendering()`과 `rendered()` 훅을 사용할 수 있습니다:

```php
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function render()
    {
        return view('livewire.show-posts', [
            'post' => Post::all(),
        ])
    }

    public function rendering($view, $data)
    {
        // 제공된 뷰가 렌더링되기 전에 실행됨...
        //
        // $view: 렌더링될 뷰
        // $data: 뷰에 제공된 데이터
    }

    public function rendered($view, $html)
    {
        // 제공된 뷰가 렌더링된 후 실행됨...
        //
        // $view: 렌더링된 뷰
        // $html: 최종 렌더링된 HTML
    }

    // ...
}
```

## Exception {#exception}

때로는 오류를 가로채고 처리하는 것이 유용할 수 있습니다. 예를 들어, 에러 메시지를 커스터마이즈하거나 특정 유형의 예외를 무시하고 싶을 때입니다. `exception()` 훅을 사용하면 바로 이러한 작업이 가능합니다: `$error`를 검사하고, `$stopPropagation` 파라미터를 사용해 문제를 포착할 수 있습니다.
이 훅을 사용하면 코드의 추가 실행을 중단(조기 반환)하는 강력한 패턴도 구현할 수 있습니다. 내부적으로 `validate()`와 같은 메서드가 이렇게 동작합니다.

```php
use Livewire\Component;

class ShowPost extends Component
{
    public function mount() // [!code highlight:4]
    {
        $this->post = Post::find($this->postId);
    }

    public function exception($e, $stopPropagation) {
        if ($e instanceof NotFoundException) {
            $this->notify('Post is not found');
            $stopPropagation();
        }
    }

    // ...
}
```

## 트레이트 내부에서 훅 사용하기 {#using-hooks-inside-a-trait}

트레이트는 여러 컴포넌트에서 코드를 재사용하거나, 단일 컴포넌트의 코드를 별도의 파일로 분리할 때 유용합니다.

여러 트레이트가 생명주기 훅 메서드를 선언할 때 충돌을 방지하기 위해, Livewire는 해당 트레이트의 _카멜케이스_ 이름을 접두사로 붙인 훅 메서드를 지원합니다.

이렇게 하면 여러 트레이트가 동일한 생명주기 훅을 사용하더라도 메서드 정의 충돌을 피할 수 있습니다.

아래는 `HasPostForm`이라는 트레이트를 참조하는 컴포넌트의 예시입니다:

```php
use Livewire\Component;

class CreatePost extends Component
{
    use HasPostForm;

    // ...
}
```

아래는 모든 사용 가능한 접두사 훅을 포함한 실제 `HasPostForm` 트레이트입니다:

```php
trait HasPostForm
{
    public $title = '';

    public $content = '';

    public function mountHasPostForm()
    {
        // ...
    }

    public function hydrateHasPostForm()
    {
        // ...
    }

    public function bootHasPostForm()
    {
        // ...
    }

    public function updatingHasPostForm()
    {
        // ...
    }

    public function updatedHasPostForm()
    {
        // ...
    }

    public function renderingHasPostForm()
    {
        // ...
    }

    public function renderedHasPostForm()
    {
        // ...
    }

    public function dehydrateHasPostForm()
    {
        // ...
    }

    // ...
}
```

## 폼 객체 내부에서 훅 사용하기 {#using-hooks-inside-a-form-object}

Livewire의 폼 객체는 속성 업데이트 훅을 지원합니다. 이 훅들은 [컴포넌트 업데이트 훅](#update)과 유사하게 동작하며, 폼 객체의 속성이 변경될 때 동작을 수행할 수 있습니다.

아래는 `PostForm` 폼 객체를 사용하는 컴포넌트의 예시입니다:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public PostForm $form;

    // ...
}
```

아래는 모든 사용 가능한 훅을 포함한 `PostForm` 폼 객체입니다:

```php
namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    public $title = '';

    public $tags = [];

    public function updating($property, $value)
    {
        // ...
    }

    public function updated($property, $value)
    {
        // ...
    }

    public function updatingTitle($value)
    {
        // ...
    }

    public function updatedTitle($value)
    {
        // ...
    }

    public function updatingTags($value, $key)
    {
        // ...
    }

    public function updatedTags($value, $key)
    {
        // ...
    }

    // ...
}
```
