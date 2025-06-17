# 생명주기 훅
Livewire는 컴포넌트의 생명주기 동안 특정 시점에 코드를 실행할 수 있도록 다양한 생명주기 훅을 제공합니다. 이러한 훅을 사용하면 컴포넌트 초기화, 속성 업데이트, 템플릿 렌더링과 같은 특정 이벤트 전후에 동작을 수행할 수 있습니다.

다음은 사용 가능한 모든 컴포넌트 생명주기 훅의 목록입니다:

| 훅 메서드                | 설명                                                                 |
|--------------------------|----------------------------------------------------------------------|
| `mount()`                | 컴포넌트가 생성될 때 호출됨                                         |
| `hydrate()`              | 이후 요청의 시작 시 컴포넌트가 다시 하이드레이트될 때 호출됨         |
| `boot()`                 | 모든 요청의 시작 시 호출됨. 최초 및 이후 요청 모두 해당              |
| `updating()`             | 컴포넌트 속성이 업데이트되기 전에 호출됨                             |
| `updated()`              | 속성이 업데이트된 후에 호출됨                                       |
| `rendering()`            | `render()`가 호출되기 전에 호출됨                                    |
| `rendered()`             | `render()`가 호출된 후에 호출됨                                      |
| `dehydrate()`            | 모든 컴포넌트 요청의 끝에서 호출됨                                   |
| `exception($e, $stopPropagation)` | 예외가 발생했을 때 호출됨                         |
## Mount {#mount}

일반적인 PHP 클래스에서는 생성자(`__construct()`)가 외부 파라미터를 받아 객체의 상태를 초기화합니다. 하지만 Livewire에서는 컴포넌트의 상태를 초기화하고 파라미터를 받기 위해 `mount()` 메서드를 사용합니다.

Livewire 컴포넌트는 `__construct()`를 사용하지 않습니다. 그 이유는 Livewire 컴포넌트가 네트워크 요청이 있을 때마다 _재구성_ 되기 때문이며, 컴포넌트가 처음 생성될 때 한 번만 초기화되기를 원하기 때문입니다.

아래는 `UpdateProfile` 컴포넌트의 `name`과 `email` 속성을 `mount()` 메서드로 초기화하는 예시입니다:

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

앞서 언급했듯이, `mount()` 메서드는 컴포넌트에 전달된 데이터를 메서드의 파라미터로 받을 수 있습니다:

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
> Livewire는 라이프사이클 훅의 메서드 파라미터에 타입힌트를 지정함으로써 [Laravel의 서비스 컨테이너](https://laravel.com/docs/container#automatic-injection)에서 의존성을 해결할 수 있도록 지원합니다.

`mount()` 메서드는 Livewire를 사용할 때 매우 중요한 부분입니다. 아래 문서에서는 `mount()` 메서드를 활용하여 일반적으로 수행하는 작업에 대한 추가 예시를 제공합니다:

* [속성 초기화하기](/livewire/3.x/properties#initializing-properties)
* [부모 컴포넌트로부터 데이터 받기](/livewire/3.x/nesting#passing-props-to-children)
* [라우트 파라미터 접근하기](/livewire/3.x/components#accessing-route-parameters)

## Boot {#boot}

`mount()`가 유용하긴 하지만, 컴포넌트 라이프사이클에서 한 번만 실행되기 때문에, 특정 컴포넌트에 대해 서버로의 모든 요청마다 실행되는 로직이 필요할 수 있습니다.

이런 경우를 위해 Livewire는 `boot()` 메서드를 제공합니다. 이 메서드에 컴포넌트가 부팅될 때마다(초기화 시와 이후의 모든 요청 시) 실행하고자 하는 설정 코드를 작성할 수 있습니다.

`boot()` 메서드는 요청 간에 유지되지 않는 protected 속성 초기화와 같은 작업에 유용합니다. 아래는 protected 속성을 Eloquent 모델로 초기화하는 예시입니다:

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

> [!tip] 대부분의 경우, 계산된 속성을 대신 사용할 수 있습니다
> 위에서 사용한 기법은 강력하지만, 이 경우에는 [Livewire의 계산된 속성](/livewire/3.x/computed-properties)을 사용하는 것이 더 나은 경우가 많습니다.

> [!warning] 민감한 public 속성은 항상 잠그세요
> 위 예시에서 볼 수 있듯이, `$postId` 속성에 `#[Locked]` 어트리뷰트를 사용하고 있습니다. 위와 같이 사용자가 클라이언트 측에서 `$postId` 속성을 조작하지 못하도록 보장하고 싶을 때는, 속성 값을 사용하기 전에 권한을 확인하거나, 속성에 `#[Locked]`를 추가하여 값이 절대 변경되지 않도록 하는 것이 중요합니다.
>
> 자세한 내용은 [Locked 속성에 대한 문서](/livewire/3.x/locked)를 참고하세요.


## 업데이트 {#update}

클라이언트 측 사용자는 다양한 방법으로 public 프로퍼티를 업데이트할 수 있으며, 가장 일반적으로는 `wire:model`이 적용된 입력값을 수정하는 방식이 있습니다.

Livewire는 public 프로퍼티가 업데이트되기 전에 값을 검증하거나 권한을 확인하거나, 특정 형식으로 프로퍼티가 설정되도록 보장할 수 있도록 업데이트를 가로채는 편리한 훅을 제공합니다.

아래는 `$postId` 프로퍼티의 수정을 방지하기 위해 `updating`을 사용하는 예시입니다.

특히 이 예시의 경우 실제 애플리케이션에서는 위의 예시처럼 [`#[Locked]` 속성](/livewire/3.x/locked)을 대신 사용하는 것이 좋다는 점에 유의하세요.

```php
use Exception;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId = 1;

    public function updating($property, $value)
    {
        // $property: 현재 업데이트 중인 프로퍼티의 이름
        // $value: 프로퍼티에 설정될 예정인 값

        if ($property === 'postId') {
            throw new Exception;
        }
    }

    // ...
}
```

위의 `updating()` 메서드는 프로퍼티가 업데이트되기 전에 실행되어, 잘못된 입력을 감지하고 프로퍼티의 업데이트를 방지할 수 있습니다. 아래는 `updated()`를 사용하여 프로퍼티의 값이 일관되게 유지되도록 하는 예시입니다:

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updated($property)
    {
        // $property: 방금 업데이트된 프로퍼티의 이름

        if ($property === 'username') {
            $this->username = strtolower($this->username);
        }
    }

    // ...
}
```

이제 클라이언트 측에서 `$username` 프로퍼티가 업데이트될 때마다, 해당 값이 항상 소문자로 유지되도록 보장할 수 있습니다.

업데이트 훅을 사용할 때 특정 프로퍼티를 대상으로 하는 경우가 많기 때문에, Livewire에서는 메서드 이름에 프로퍼티명을 직접 지정할 수 있도록 지원합니다. 위의 예시를 이 기법을 활용해 다시 작성하면 다음과 같습니다:

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

배열 속성에는 변경되는 요소를 지정하기 위해 이러한 함수에 추가로 `$key` 인자가 전달됩니다.

배열 자체가 특정 키가 아닌 전체적으로 업데이트될 때는 `$key` 인자가 null이 된다는 점에 유의하세요.

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

Hydrate와 dehydrate는 잘 알려지지 않았고 자주 사용되지 않는 훅입니다. 하지만 특정 상황에서는 매우 강력하게 활용될 수 있습니다.

"dehydrate"와 "hydrate"라는 용어는 Livewire 컴포넌트가 클라이언트 측에서 JSON으로 직렬화되고, 이후 요청에서 다시 PHP 객체로 역직렬화되는 과정을 의미합니다.

Livewire의 코드베이스와 문서 전반에서 이 과정을 "hydrate"와 "dehydrate"라고 자주 부릅니다. 이 용어에 대해 더 명확히 알고 싶다면 [하이드레이션 문서](/livewire/3.x/hydration)를 참고하세요.

다음은 Eloquent 모델 대신 커스텀 [데이터 전송 객체(DTO)](https://en.wikipedia.org/wiki/Data_transfer_object)를 사용하여 컴포넌트에 게시글 데이터를 저장하는 예시로, `mount()`, `hydrate()`, `dehydrate()`를 모두 사용하는 방법을 보여줍니다:

```php
use Livewire\Component;

class ShowPost extends Component
{
    public $post;

    public function mount($title, $content)
    {
        // 최초 요청의 시작 시점에 실행됩니다...

        $this->post = new PostDto([
            'title' => $title,
            'content' => $content,
        ]);
    }

    public function hydrate()
    {
        // 모든 "이후" 요청의 시작 시점에 실행됩니다...
        // 최초 요청에서는 실행되지 않고("mount"가 실행됨)...

        $this->post = new PostDto($this->post);
    }

    public function dehydrate()
    {
        // 모든 요청의 마지막에 실행됩니다...

        $this->post = $this->post->toArray();
    }

    // ...
}
```

이제 컴포넌트 내부의 액션이나 다른 곳에서 원시 데이터 대신 `PostDto` 객체에 접근할 수 있습니다.

위 예시는 주로 `hydrate()`와 `dehydrate()` 훅의 기능과 특성을 보여주기 위한 것입니다. 하지만 실제로는 이 목적을 위해 [Wireables 또는 Synthesizers](/livewire/3.x/properties#supporting-custom-types)를 사용하는 것이 권장됩니다.

## 렌더 {#render}

컴포넌트의 Blade 뷰 렌더링 과정에 훅을 걸고 싶다면, `rendering()`과 `rendered()` 훅을 사용할 수 있습니다:

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
        // 지정된 뷰가 렌더링되기 전에 실행됩니다...
        //
        // $view: 렌더링될 뷰
        // $data: 뷰에 전달된 데이터
    }

    public function rendered($view, $html)
    {
        // 지정된 뷰가 렌더링된 후에 실행됩니다...
        //
        // $view: 렌더링된 뷰
        // $html: 최종 렌더링된 HTML
    }

    // ...
}
```

## 예외 {#exception}

때때로 오류를 가로채거나 잡는 것이 도움이 될 수 있습니다. 예를 들어, 오류 메시지를 사용자 정의하거나 특정 유형의 예외를 무시하고 싶을 때입니다. `exception()` 훅을 사용하면 바로 이런 작업이 가능합니다. `$error`를 검사하고, `$stopPropagation` 파라미터를 사용해 문제를 잡을 수 있습니다.
이 방법은 코드의 추가 실행을 중단하고(조기에 반환) 싶을 때 강력한 패턴을 제공합니다. 내부적으로 `validate()`와 같은 메서드가 이렇게 동작합니다.

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
            $this->notify('게시글을 찾을 수 없습니다');
            $stopPropagation();
        }
    }

    // ...
}
```

## 트레이트 내부에서 훅 사용하기 {#using-hooks-inside-a-trait}

트레이트는 여러 컴포넌트에서 코드를 재사용하거나, 단일 컴포넌트의 코드를 별도의 파일로 추출할 때 유용합니다.

여러 트레이트가 라이프사이클 훅 메서드를 선언할 때 서로 충돌하지 않도록, Livewire는 해당 트레이트의 _카멜케이스_ 이름을 접두사로 붙인 훅 메서드를 지원합니다.

이 방식을 사용하면 여러 트레이트가 동일한 라이프사이클 훅을 사용하더라도 메서드 정의 충돌을 피할 수 있습니다.

아래는 `HasPostForm`이라는 트레이트를 참조하는 컴포넌트의 예시입니다:

```php
use Livewire\Component;

class CreatePost extends Component
{
    use HasPostForm;

    // ...
}
```

다음은 모든 접두사가 붙은 훅을 포함하는 실제 `HasPostForm` 트레이트입니다:

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

Livewire의 폼 객체는 프로퍼티 업데이트 훅을 지원합니다. 이 훅들은 [컴포넌트 업데이트 훅](#update)과 유사하게 동작하며, 폼 객체의 프로퍼티가 변경될 때 동작을 수행할 수 있게 해줍니다.

아래는 `PostForm` 폼 객체를 사용하는 컴포넌트의 예시입니다:

```php
use Livewire\Component;

class CreatePost extends Component
{
    public PostForm $form;

    // ...
}
```

아래는 사용 가능한 모든 훅을 포함한 `PostForm` 폼 객체입니다:

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
