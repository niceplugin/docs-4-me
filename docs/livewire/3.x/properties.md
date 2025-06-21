# 프로퍼티
Livewire 컴포넌트 내부에서 프로퍼티는 데이터를 저장하고 관리합니다. 이들은 컴포넌트 클래스에 public 프로퍼티로 정의되며, 서버와 클라이언트 양쪽에서 접근 및 수정이 가능합니다.

## 프로퍼티 초기화 {#initializing-properties}

컴포넌트의 `mount()` 메서드 내에서 프로퍼티의 초기 값을 설정할 수 있습니다.

다음 예시를 살펴보세요:
```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class TodoList extends Component
{
    public $todos = [];

    public $todo = '';

    public function mount()
    {
        $this->todos = Auth::user()->todos; // [!code highlight]
    }

    // ...
}
```

이 예시에서는 빈 `todos` 배열을 정의하고, 인증된 사용자의 기존 todo로 초기화했습니다. 이제 컴포넌트가 처음 렌더링될 때 데이터베이스에 있는 모든 기존 todo가 사용자에게 표시됩니다.

## 대량 할당 {#bulk-assignment}

때때로 `mount()` 메서드에서 많은 프로퍼티를 초기화하는 것이 장황하게 느껴질 수 있습니다. 이를 돕기 위해 Livewire는 `fill()` 메서드를 통해 여러 프로퍼티를 한 번에 할당할 수 있는 편리한 방법을 제공합니다. 프로퍼티 이름과 해당 값을 연관 배열로 전달하면 여러 프로퍼티를 동시에 설정할 수 있어 `mount()`에서 반복되는 코드를 줄일 수 있습니다.

예를 들어:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $post;

    public $title;

    public $description;

    public function mount(Post $post)
    {
        $this->post = $post;

        $this->fill( // [!code highlight]
            $post->only('title', 'description'), // [!code highlight]
        ); // [!code highlight]
    }

    // ...
}
```

`$post->only(...)`는 전달한 이름에 따라 모델 속성과 값의 연관 배열을 반환하므로, 각각을 개별적으로 설정하지 않아도 데이터베이스의 `$post` 모델의 `title`과 `description` 값이 `$title`과 `$description` 프로퍼티에 초기 설정됩니다.

## 데이터 바인딩 {#data-binding}

Livewire는 `wire:model` HTML 속성을 통해 양방향 데이터 바인딩을 지원합니다. 이를 통해 컴포넌트 프로퍼티와 HTML 입력값 간의 데이터를 쉽게 동기화할 수 있어 사용자 인터페이스와 컴포넌트 상태를 일치시킬 수 있습니다.

`wire:model` 디렉티브를 사용하여 `TodoList` 컴포넌트의 `$todo` 프로퍼티를 기본 입력 요소에 바인딩해봅시다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class TodoList extends Component
{
    public $todos = [];

    public $todo = '';

    public function add()
    {
        $this->todos[] = $this->todo;

        $this->todo = '';
    }

    // ...
}
```

```blade
<div>
    <input type="text" wire:model="todo" placeholder="Todo..."> <!-- [!code highlight] -->

    <button wire:click="add">Add Todo</button>

    <ul>
        @foreach ($todos as $todo)
            <li>{{ $todo }}</li>
        @endforeach
    </ul>
</div>
```

위 예시에서 텍스트 입력값은 "Add Todo" 버튼이 클릭될 때 서버의 `$todo` 프로퍼티와 동기화됩니다.

이것은 `wire:model`의 기본적인 사용 예시일 뿐입니다. 데이터 바인딩에 대해 더 깊이 알고 싶다면 [폼 관련 문서](/livewire/3.x/forms)를 참고하세요.

## 프로퍼티 리셋 {#resetting-properties}

때로는 사용자가 어떤 동작을 수행한 후 프로퍼티를 초기 상태로 되돌려야 할 필요가 있습니다. 이런 경우 Livewire는 하나 이상의 프로퍼티 이름을 받아 해당 값을 초기 상태로 리셋하는 `reset()` 메서드를 제공합니다.

아래 예시에서는 "Add Todo" 버튼 클릭 후 `todo` 필드를 `$this->reset()`으로 리셋하여 코드 중복을 방지할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ManageTodos extends Component
{
    public $todos = [];

    public $todo = '';

    public function addTodo()
    {
        $this->todos[] = $this->todo;

        $this->reset('todo'); // [!code highlight]
    }

    // ...
}
```

위 예시에서 사용자가 "Add Todo"를 클릭하면 방금 추가된 todo를 담고 있던 입력 필드가 비워져, 사용자가 새로운 todo를 작성할 수 있게 됩니다.

> [!warning] `reset()`은 `mount()`에서 설정한 값에는 동작하지 않습니다
> `reset()`은 프로퍼티를 `mount()` 메서드가 호출되기 전 상태로 리셋합니다. 만약 `mount()`에서 프로퍼티를 다른 값으로 초기화했다면, 해당 프로퍼티를 수동으로 리셋해야 합니다.

## 프로퍼티 pull {#pulling-properties}

또는 `pull()` 메서드를 사용하여 값을 리셋하고 동시에 반환할 수 있습니다.

아래는 위와 동일한 예시를 `pull()`로 단순화한 것입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ManageTodos extends Component
{
    public $todos = [];

    public $todo = '';

    public function addTodo()
    {
        $this->todos[] = $this->pull('todo'); // [!code highlight]
    }

    // ...
}
```

위 예시는 단일 값을 pull하고 있지만, `pull()`은 모든 프로퍼티 또는 일부 프로퍼티를 리셋하고 (키-값 쌍으로) 반환하는 데도 사용할 수 있습니다:

```php
// $this->all()과 $this->reset()을 동시에 수행
$this->pull();

// $this->only(...)와 $this->reset(...)을 동시에 수행
$this->pull(['title', 'content']);
```

## 지원되는 프로퍼티 타입 {#supported-property-types}

Livewire는 서버 요청 간 컴포넌트 데이터 관리를 위한 고유한 접근 방식 때문에 제한된 프로퍼티 타입만 지원합니다.

Livewire 컴포넌트의 각 프로퍼티는 요청 간에 JSON으로 직렬화(또는 "탈수")되고, 다음 요청 시 JSON에서 PHP로 다시 역직렬화("수화")됩니다.

이 양방향 변환 과정에는 몇 가지 제한이 있어 Livewire가 사용할 수 있는 프로퍼티 타입이 제한됩니다.

### 원시 타입 {#primitive-types}

Livewire는 문자열, 정수 등과 같은 원시 타입을 지원합니다. 이러한 타입은 JSON으로 쉽게 변환할 수 있어 Livewire 컴포넌트의 프로퍼티로 사용하기에 이상적입니다.

Livewire가 지원하는 원시 프로퍼티 타입은 다음과 같습니다: `Array`, `String`, `Integer`, `Float`, `Boolean`, `Null`.

```php
class TodoList extends Component
{
    public $todos = []; // 배열

    public $todo = ''; // 문자열

    public $maxTodos = 10; // 정수

    public $showTodos = false; // 불리언

    public $todoFilter; // Null
}
```

### 일반적인 PHP 타입 {#common-php-types}

원시 타입 외에도, Livewire는 Laravel 애플리케이션에서 사용되는 일반적인 PHP 객체 타입을 지원합니다. 단, 이러한 타입은 각 요청마다 _탈수_되어 JSON으로, 그리고 다시 _수화_되어 PHP로 변환된다는 점을 유의해야 합니다. 즉, 프로퍼티가 클로저와 같은 런타임 값을 보존하지 못할 수 있습니다. 또한 객체의 클래스명 등 정보가 JavaScript에 노출될 수 있습니다.

지원되는 PHP 타입:
| 타입 | 전체 클래스명 |
|------|-----------------|
| BackedEnum | `BackedEnum` |
| Collection | `Illuminate\Support\Collection` |
| Eloquent Collection | `Illuminate\Database\Eloquent\Collection` |
| Model | `Illuminate\Database\Eloquent\Model` |
| DateTime | `DateTime` |
| Carbon | `Carbon\Carbon` |
| Stringable | `Illuminate\Support\Stringable` |

> [!warning] Eloquent 컬렉션 및 모델
> Livewire 프로퍼티에 Eloquent 컬렉션 및 모델을 저장할 때, select(...)와 같은 추가 쿼리 제약 조건은 이후 요청에서 다시 적용되지 않습니다.
>
> 자세한 내용은 [Eloquent 제약 조건이 요청 간에 보존되지 않음](#eloquent-constraints-arent-preserved-between-requests) 문서를 참고하세요

다음은 이러한 다양한 타입으로 프로퍼티를 설정하는 간단한 예시입니다:

```php
public function mount()
{
    $this->todos = collect([]); // Collection

    $this->todos = Todos::all(); // Eloquent Collection

    $this->todo = Todos::first(); // Model

    $this->date = new DateTime('now'); // DateTime

    $this->date = new Carbon('now'); // Carbon

    $this->todo = str(''); // Stringable
}
```

### 커스텀 타입 지원 {#supporting-custom-types}

Livewire는 두 가지 강력한 메커니즘을 통해 애플리케이션에서 커스텀 타입을 지원할 수 있습니다:

* Wireables
* Synthesizers

Wireable은 대부분의 애플리케이션에서 간단하고 쉽게 사용할 수 있으므로 아래에서 살펴보겠습니다. 더 많은 유연성이 필요한 고급 사용자나 패키지 저자라면 [Synthesizer가 적합합니다](/livewire/3.x/synthesizers).

#### Wireable {#wireables}

Wireable은 애플리케이션에서 `Wireable` 인터페이스를 구현한 모든 클래스입니다.

예를 들어, 애플리케이션에 고객의 주요 데이터를 담고 있는 `Customer` 객체가 있다고 가정해봅시다:

```php
class Customer
{
    protected $name;
    protected $age;

    public function __construct($name, $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}
```

이 클래스의 인스턴스를 Livewire 컴포넌트 프로퍼티에 할당하려고 하면 `Customer` 프로퍼티 타입이 지원되지 않는다는 오류가 발생합니다:

```php
class ShowCustomer extends Component
{
    public Customer $customer;

    public function mount()
    {
        $this->customer = new Customer('Caleb', 29);
    }
}
```

하지만, `Wireable` 인터페이스를 구현하고 클래스에 `toLivewire()`와 `fromLivewire()` 메서드를 추가하면 이 문제를 해결할 수 있습니다. 이 메서드들은 Livewire가 해당 타입의 프로퍼티를 JSON으로 변환하고 다시 PHP로 변환하는 방법을 알려줍니다:

```php
use Livewire\Wireable;

class Customer implements Wireable
{
    protected $name;
    protected $age;

    public function __construct($name, $age)
    {
        $this->name = $name;
        $this->age = $age;
    }

    public function toLivewire()
    {
        return [
            'name' => $this->name,
            'age' => $this->age,
        ];
    }

    public static function fromLivewire($value)
    {
        $name = $value['name'];
        $age = $value['age'];

        return new static($name, $age);
    }
}
```

이제 Livewire 컴포넌트에서 `Customer` 객체를 자유롭게 설정할 수 있으며, Livewire는 이 객체를 JSON으로, 그리고 다시 PHP로 변환하는 방법을 알게 됩니다.

앞서 언급했듯이, 더 전역적이고 강력한 타입 지원이 필요하다면 Livewire의 고급 내부 메커니즘인 Synthesizer를 사용할 수 있습니다. [Synthesizer에 대해 더 알아보기](/livewire/3.x/synthesizers).

## JavaScript에서 프로퍼티 접근 {#accessing-properties-from-javascript}

Livewire 프로퍼티는 브라우저에서도 JavaScript를 통해 사용할 수 있으므로, [AlpineJS](https://alpinejs.dev/)에서 이들의 JavaScript 표현을 접근하고 조작할 수 있습니다.

Alpine은 Livewire에 포함된 경량 JavaScript 라이브러리입니다. Alpine을 사용하면 전체 서버 라운드트립 없이 Livewire 컴포넌트에 경량 상호작용을 구축할 수 있습니다.

내부적으로 Livewire의 프론트엔드는 Alpine 위에 구축되어 있습니다. 실제로 모든 Livewire 컴포넌트는 내부적으로 Alpine 컴포넌트입니다. 즉, Livewire 컴포넌트 내에서 Alpine을 자유롭게 활용할 수 있습니다.

이 페이지의 나머지 부분은 Alpine에 대한 기본적인 이해를 전제로 합니다. Alpine이 익숙하지 않다면 [Alpine 문서](https://alpinejs.dev/docs)를 참고하세요.

### 프로퍼티 접근 {#accessing-properties}

Livewire는 Alpine에 매직 `$wire` 객체를 노출합니다. Livewire 컴포넌트 내의 모든 Alpine 표현식에서 `$wire` 객체에 접근할 수 있습니다.

`$wire` 객체는 JavaScript 버전의 Livewire 컴포넌트처럼 사용할 수 있습니다. PHP 버전의 컴포넌트와 동일한 프로퍼티와 메서드를 가지며, 템플릿에서 특정 기능을 수행하는 전용 메서드도 포함되어 있습니다.

예를 들어, `$wire`를 사용해 `todo` 입력 필드의 실시간 글자 수를 표시할 수 있습니다:

```blade
<div>
    <input type="text" wire:model="todo">

    Todo 글자 수: <h2 x-text="$wire.todo.length"></h2>
</div>
```

사용자가 필드에 입력할 때마다 현재 작성 중인 todo의 글자 수가 페이지에 실시간으로 표시되고 업데이트됩니다. 이 모든 과정이 서버로 네트워크 요청을 보내지 않고 이루어집니다.

원한다면, 더 명시적인 `.get()` 메서드를 사용해 동일한 작업을 할 수도 있습니다:

```blade
<div>
    <input type="text" wire:model="todo">

    Todo 글자 수: <h2 x-text="$wire.get('todo').length"></h2>
</div>
```

### 프로퍼티 조작 {#manipulating-properties}

마찬가지로, JavaScript에서 `$wire`를 사용해 Livewire 컴포넌트 프로퍼티를 조작할 수 있습니다.

예를 들어, `TodoList` 컴포넌트에 "Clear" 버튼을 추가해 사용자가 입력 필드를 JavaScript만으로 리셋할 수 있게 해봅시다:

```blade
<div>
    <input type="text" wire:model="todo">

    <button x-on:click="$wire.todo = ''">Clear</button>
</div>
```

사용자가 "Clear"를 클릭하면 입력값이 빈 문자열로 리셋되며, 서버로 네트워크 요청을 보내지 않습니다.

이후 요청에서 서버 측 `$todo` 값이 업데이트되어 동기화됩니다.

원한다면, 클라이언트 측에서 프로퍼티를 설정할 때 더 명시적인 `.set()` 메서드를 사용할 수도 있습니다. 단, `.set()`을 사용하면 기본적으로 즉시 네트워크 요청이 발생하고 서버와 상태가 동기화됩니다. 이것이 원하는 동작이라면 매우 좋은 API입니다:

```blade
<button x-on:click="$wire.set('todo', '')">Clear</button>
```

서버로 네트워크 요청을 보내지 않고 프로퍼티만 업데이트하려면 세 번째 불리언 파라미터를 전달할 수 있습니다. 이렇게 하면 네트워크 요청이 지연되고, 이후 요청에서 서버 측 상태가 동기화됩니다:
```blade
<button x-on:click="$wire.set('todo', '', false)">Clear</button>
```

## 보안 이슈 {#security-concerns}

Livewire 프로퍼티는 강력한 기능이지만, 사용 전에 알아야 할 몇 가지 보안 고려사항이 있습니다.

요약하자면, public 프로퍼티는 항상 사용자 입력으로 간주해야 합니다 — 마치 전통적인 엔드포인트의 요청 입력처럼요. 따라서, 프로퍼티를 데이터베이스에 저장하기 전에 반드시 검증 및 권한 확인을 해야 합니다 — 컨트롤러에서 요청 입력을 다룰 때처럼 말이죠.

### 프로퍼티 값을 신뢰하지 마세요 {#dont-trust-property-values}

프로퍼티의 검증 및 권한 확인을 소홀히 하면 애플리케이션에 보안 취약점이 생길 수 있음을 보여주기 위해, 다음 `UpdatePost` 컴포넌트는 공격에 취약합니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $id;
    public $title;
    public $content;

    public function mount(Post $post)
    {
        $this->id = $post->id;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function update()
    {
        $post = Post::findOrFail($this->id);

        $post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        session()->flash('message', 'Post updated successfully!');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

```blade
<form wire:submit="update">
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">Update</button>
</form>
```

처음 보면 이 컴포넌트는 아무 문제 없어 보입니다. 하지만 공격자가 어떻게 이 컴포넌트를 이용해 애플리케이션에서 권한 없는 작업을 할 수 있는지 살펴봅시다.

우리는 게시글의 `id`를 컴포넌트의 public 프로퍼티로 저장하고 있기 때문에, 클라이언트에서 `title`과 `content` 프로퍼티처럼 쉽게 조작할 수 있습니다.

`wire:model="id"` 입력을 작성하지 않았더라도 상관없습니다. 악의적인 사용자는 브라우저의 개발자 도구를 사용해 뷰를 다음과 같이 쉽게 변경할 수 있습니다:

```blade
<form wire:submit="update">
    <input type="text" wire:model="id"> <!-- [!code highlight] -->
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">Update</button>
</form>
```

이제 악의적인 사용자는 `id` 입력값을 다른 게시글 모델의 ID로 변경할 수 있습니다. 폼이 제출되고 `update()`가 호출되면, `Post::findOrFail()`은 사용자가 소유하지 않은 게시글을 반환하고 업데이트하게 됩니다.

이런 공격을 방지하려면 다음 전략 중 하나 또는 둘 다 사용할 수 있습니다:

* 입력값 권한 확인
* 프로퍼티 업데이트 잠금

#### 입력값 권한 확인 {#authorizing-the-input}

`$id`는 `wire:model` 등으로 클라이언트에서 조작될 수 있으므로, 컨트롤러에서처럼 [Laravel의 권한 확인](/laravel/12.x/authorization)을 사용해 현재 사용자가 게시글을 업데이트할 수 있는지 확인할 수 있습니다:

```php
public function update()
{
    $post = Post::findOrFail($this->id);

    $this->authorize('update', $post); // [!code highlight]

    $post->update(...);
}
```

악의적인 사용자가 `$id` 프로퍼티를 변조하더라도, 추가된 권한 확인이 이를 감지해 오류를 발생시킵니다.

#### 프로퍼티 잠금 {#locking-the-property}

Livewire는 또한 프로퍼티가 클라이언트에서 수정되지 않도록 "잠금"할 수 있습니다. `#[Locked]` 속성을 사용해 프로퍼티를 클라이언트 측 조작으로부터 "잠글" 수 있습니다:

```php
use Livewire\Attributes\Locked;
use Livewire\Component;

class UpdatePost extends Component
{
    #[Locked] // [!code highlight]
    public $id;

    // ...
}
```

이제 사용자가 프론트엔드에서 `$id`를 수정하려고 하면 오류가 발생합니다.

`#[Locked]`를 사용하면 이 프로퍼티가 컴포넌트 클래스 외부에서 조작되지 않았음을 신뢰할 수 있습니다.

프로퍼티 잠금에 대한 자세한 내용은 [Locked 프로퍼티 문서](/livewire/3.x/locked)를 참고하세요.

#### Eloquent 모델과 잠금 {#eloquent-models-and-locking}

Eloquent 모델이 Livewire 컴포넌트 프로퍼티에 할당되면, Livewire는 해당 프로퍼티를 자동으로 잠그고 ID가 변경되지 않도록 하여 이러한 공격으로부터 안전하게 보호합니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public Post $post; // [!code highlight]
    public $title;
    public $content;

    public function mount(Post $post)
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function update()
    {
        $this->post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        session()->flash('message', 'Post updated successfully!');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

### 프로퍼티는 시스템 정보를 브라우저에 노출합니다 {#properties-expose-system-information-to-the-browser}

또 한 가지 중요한 점은, Livewire 프로퍼티는 브라우저로 전송되기 전에 직렬화(또는 "탈수")된다는 것입니다. 즉, 값이 전송 가능한 형식으로 변환되어 JavaScript가 이해할 수 있게 됩니다. 이 형식은 프로퍼티의 이름, 클래스명 등 애플리케이션 정보를 브라우저에 노출할 수 있습니다.

예를 들어, public 프로퍼티 `$post`를 정의한 Livewire 컴포넌트가 있다고 가정해봅시다. 이 프로퍼티는 데이터베이스의 `Post` 모델 인스턴스를 담고 있습니다. 이 경우, 브라우저로 전송되는 탈수된 값은 다음과 비슷할 수 있습니다:

```json
{
    "type": "model",
    "class": "App\Models\Post",
    "key": 1,
    "relationships": []
}
```

보시다시피, `$post` 프로퍼티의 탈수된 값에는 모델의 클래스명(`App\Models\Post`), ID, eager-loaded된 관계 정보가 포함되어 있습니다.

모델의 클래스명을 노출하고 싶지 않다면, 서비스 프로바이더에서 Laravel의 "morphMap" 기능을 사용해 모델 클래스명에 별칭을 지정할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Relation::morphMap([
            'post' => 'App\Models\Post',
        ]);
    }
}
```

이제 Eloquent 모델이 "탈수"(직렬화)될 때, 원래 클래스명 대신 "post" 별칭만 노출됩니다:

```json
{
    "type": "model",
    "class": "App\Models\Post", // [!code --]
    "class": "post", // [!code ++]
    "key": 1,
    "relationships": []
}
```

### Eloquent 제약 조건이 요청 간에 보존되지 않음 {#eloquent-constraints-arent-preserved-between-requests}

일반적으로 Livewire는 요청 간에 서버 측 프로퍼티를 보존하고 재생성할 수 있습니다. 하지만, 특정 상황에서는 값을 요청 간에 보존하는 것이 불가능할 수 있습니다.

예를 들어, Eloquent 컬렉션을 Livewire 프로퍼티로 저장할 때, `select(...)`와 같은 추가 쿼리 제약 조건은 이후 요청에서 다시 적용되지 않습니다.

이를 보여주기 위해, `Todos` Eloquent 컬렉션에 `select()` 제약 조건이 적용된 `ShowTodos` 컴포넌트를 살펴봅시다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ShowTodos extends Component
{
    public $todos;

    public function mount()
    {
        $this->todos = Auth::user()
            ->todos()
            ->select(['title', 'content']) // [!code highlight]
            ->get();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

이 컴포넌트가 처음 로드될 때, `$todos` 프로퍼티는 사용자의 todo Eloquent 컬렉션으로 설정됩니다. 단, 데이터베이스의 각 행에서 `title`과 `content` 필드만 쿼리되어 각 모델에 로드됩니다.

Livewire가 이후 요청에서 이 프로퍼티의 JSON을 PHP로 _수화_할 때, select 제약 조건은 사라지게 됩니다.

Eloquent 쿼리의 무결성을 보장하려면, 프로퍼티 대신 [계산 프로퍼티](/livewire/3.x/computed-properties)를 사용하는 것이 좋습니다.

계산 프로퍼티는 컴포넌트 내에서 `#[Computed]` 속성으로 표시된 메서드입니다. 이들은 컴포넌트의 상태로 저장되지 않고, 필요할 때마다 동적으로 평가되는 동적 프로퍼티로 접근할 수 있습니다.

위 예시를 계산 프로퍼티로 다시 작성하면 다음과 같습니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowTodos extends Component
{
    #[Computed] // [!code highlight]
    public function todos()
    {
        return Auth::user()
            ->todos()
            ->select(['title', 'content'])
            ->get();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

Blade 뷰에서 이 _todos_에 접근하는 방법은 다음과 같습니다:

```blade
<ul>
    @foreach ($this->todos as $todo)
        <li>{{ $todo }}</li>
    @endforeach
</ul>
```

뷰 내부에서는 `$this->todos`처럼 `$this` 객체에서만 계산 프로퍼티에 접근할 수 있다는 점에 유의하세요.

클래스 내부에서도 `$todos`에 접근할 수 있습니다. 예를 들어, `markAllAsComplete()` 액션이 있다면:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowTodos extends Component
{
    #[Computed]
    public function todos()
    {
        return Auth::user()
            ->todos()
            ->select(['title', 'content'])
            ->get();
    }

    public function markAllComplete() // [!code highlight:4]
    {
        $this->todos->each->complete();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

왜 필요한 곳에서 그냥 `$this->todos()` 메서드를 직접 호출하지 않고 `#[Computed]`를 사용하는지 궁금할 수 있습니다.

그 이유는 계산 프로퍼티가 성능상 이점이 있기 때문입니다. 한 요청 내에서 처음 사용된 후 자동으로 캐시되므로, 컴포넌트 내에서 `$this->todos`를 여러 번 접근해도 실제 메서드는 한 번만 호출되어, 동일한 요청에서 비싼 쿼리가 여러 번 실행되는 것을 방지할 수 있습니다.

자세한 내용은 [계산 프로퍼티 문서](/livewire/3.x/computed-properties)를 참고하세요.
