# [필수사항] 속성
속성(Properties)은 Livewire 컴포넌트 내부에서 데이터를 저장하고 관리합니다. 속성은 컴포넌트 클래스에서 public 속성으로 정의되며, 서버와 클라이언트 양쪽에서 접근하고 수정할 수 있습니다.

## 속성 초기화 {#initializing-properties}

컴포넌트의 `mount()` 메서드 내에서 속성의 초기값을 설정할 수 있습니다.

다음 예시를 참고하세요:
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

이 예시에서는 빈 `todos` 배열을 정의하고, 인증된 사용자의 기존 할 일 목록으로 초기화했습니다. 이제 컴포넌트가 처음 렌더링될 때 데이터베이스에 있는 모든 기존 할 일 목록이 사용자에게 표시됩니다.

## 일괄 할당 {#bulk-assignment}

때때로 `mount()` 메서드에서 많은 프로퍼티를 초기화하는 것이 장황하게 느껴질 수 있습니다. 이를 돕기 위해 Livewire는 `fill()` 메서드를 통해 여러 프로퍼티를 한 번에 할당할 수 있는 편리한 방법을 제공합니다. 프로퍼티 이름과 해당 값을 연관 배열로 전달하면, 여러 프로퍼티를 동시에 설정할 수 있어 `mount()`에서 반복되는 코드를 줄일 수 있습니다.

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

`$post->only(...)`는 전달한 이름을 기준으로 모델의 속성과 값을 연관 배열로 반환하기 때문에, `$title`과 `$description` 프로퍼티는 각각 데이터베이스에서 가져온 `$post` 모델의 `title`과 `description` 값으로 개별적으로 할당하지 않아도 초기화됩니다.

## 데이터 바인딩 {#data-binding}

Livewire는 `wire:model` HTML 속성을 통해 양방향 데이터 바인딩을 지원합니다. 이를 통해 컴포넌트 속성과 HTML 입력값 간의 데이터를 쉽게 동기화할 수 있어, 사용자 인터페이스와 컴포넌트 상태를 일치시킬 수 있습니다.

`wire:model` 디렉티브를 사용하여 `TodoList` 컴포넌트의 `$todo` 속성을 기본 입력 요소에 바인딩해보겠습니다:

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

위 예시에서, 텍스트 입력값은 "Add Todo" 버튼이 클릭될 때 서버의 `$todo` 속성과 동기화됩니다.

이것은 `wire:model`의 기본적인 사용법에 불과합니다. 데이터 바인딩에 대해 더 깊이 알고 싶다면 [폼 관련 문서](/livewire/3.x/forms)를 참고하세요.

## 속성 재설정 {#resetting-properties}

때때로 사용자가 어떤 동작을 수행한 후에 속성을 초기 상태로 되돌려야 할 필요가 있습니다. 이러한 경우, Livewire는 하나 이상의 속성 이름을 받아 해당 값을 초기 상태로 재설정하는 `reset()` 메서드를 제공합니다.

아래 예시에서는 "Add Todo" 버튼이 클릭된 후 `$this->reset()`을 사용하여 `todo` 필드를 재설정함으로써 코드 중복을 피할 수 있습니다:

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

위 예시에서 사용자가 "Add Todo"를 클릭하면, 방금 추가된 todo를 담고 있던 입력 필드가 비워져 사용자가 새로운 todo를 작성할 수 있게 됩니다.

> [!warning] `reset()`은 `mount()`에서 설정한 값에는 동작하지 않습니다
> `reset()`은 속성을 `mount()` 메서드가 호출되기 전의 상태로 재설정합니다. 만약 `mount()`에서 속성에 다른 값을 할당했다면, 해당 속성은 수동으로 재설정해야 합니다.

## 속성 가져오기 {#pulling-properties}

또한, `pull()` 메서드를 사용하여 값을 한 번에 초기화하고 가져올 수 있습니다.

아래는 위의 예제를 `pull()`로 간소화한 예시입니다:

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

위 예제는 단일 값을 가져오고 있지만, `pull()`은 모든 속성 또는 일부 속성을 (키-값 쌍으로) 초기화하고 가져오는 데에도 사용할 수 있습니다:

```php
// $this->all()과 $this->reset()을 함께 사용하는 것과 동일합니다.
$this->pull();

// $this->only(...)와 $this->reset(...)을 함께 사용하는 것과 동일합니다.
$this->pull(['title', 'content']);
```

## 지원되는 프로퍼티 타입 {#supported-property-types}

Livewire는 서버 요청 간에 컴포넌트 데이터를 관리하는 고유한 방식 때문에 제한된 프로퍼티 타입만을 지원합니다.

Livewire 컴포넌트의 각 프로퍼티는 요청 사이에 JSON으로 직렬화(또는 "탈수")되고, 다음 요청 시 JSON에서 PHP로 다시 "수화"됩니다.

이러한 양방향 변환 과정에는 몇 가지 제한이 있어, Livewire가 사용할 수 있는 프로퍼티 타입이 제한됩니다.

### 원시 타입 {#primitive-types}

Livewire는 문자열, 정수 등과 같은 원시 타입을 지원합니다. 이러한 타입들은 JSON으로 쉽게 변환할 수 있어 Livewire 컴포넌트의 프로퍼티로 사용하기에 이상적입니다.

Livewire가 지원하는 원시 프로퍼티 타입은 다음과 같습니다: `Array`, `String`, `Integer`, `Float`, `Boolean`, 그리고 `Null`입니다.

```php
class TodoList extends Component
{
    public $todos = []; // Array

    public $todo = ''; // String

    public $maxTodos = 10; // Integer

    public $showTodos = false; // Boolean

    public $todoFilter; // Null
}
```

### 일반적인 PHP 타입 {#common-php-types}

원시 타입 외에도, Livewire는 Laravel 애플리케이션에서 사용되는 일반적인 PHP 객체 타입을 지원합니다. 하지만 이러한 타입들은 각 요청마다 _JSON으로 탈수(dehydrate)_ 되고 다시 _PHP로 수화(hydrate)_ 된다는 점에 유의해야 합니다. 즉, 프로퍼티는 클로저와 같은 런타임 값을 보존하지 않을 수 있습니다. 또한, 클래스 이름과 같은 객체 정보가 JavaScript에 노출될 수 있습니다.

지원되는 PHP 타입:
| 타입 | 전체 클래스 이름 |
|------|-----------------|
| BackedEnum | `BackedEnum` |
| Collection | `Illuminate\Support\Collection` |
| Eloquent Collection | `Illuminate\Database\Eloquent\Collection` |
| Model | `Illuminate\Database\Eloquent\Model` |
| DateTime | `DateTime` |
| Carbon | `Carbon\Carbon` |
| Stringable | `Illuminate\Support\Stringable` |

> [!warning] Eloquent 컬렉션 및 모델
> Livewire 프로퍼티에 Eloquent 컬렉션과 모델을 저장할 때, select(...)와 같은 추가 쿼리 제약 조건은 이후 요청에서 다시 적용되지 않습니다.
>
> 자세한 내용은 [요청 간 Eloquent 제약 조건이 유지되지 않음](#eloquent-constraints-arent-preserved-between-requests)을 참고하세요.

아래는 이러한 다양한 타입으로 프로퍼티를 설정하는 간단한 예시입니다:

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

### 사용자 정의 타입 지원 {#supporting-custom-types}

Livewire는 두 가지 강력한 메커니즘을 통해 애플리케이션에서 사용자 정의 타입을 지원할 수 있도록 합니다:

* Wireables
* Synthesizers

Wireables는 대부분의 애플리케이션에서 간단하고 사용하기 쉬우므로, 아래에서 Wireables에 대해 살펴보겠습니다. 더 많은 유연성이 필요한 고급 사용자나 패키지 작성자라면 [Synthesizers를 사용하는 것이 좋습니다](/livewire/3.x/synthesizers).

#### Wireables {#wireables}

Wireable은 애플리케이션에서 `Wireable` 인터페이스를 구현한 모든 클래스를 의미합니다.

예를 들어, 고객에 대한 주요 데이터를 담고 있는 `Customer` 객체가 애플리케이션에 있다고 가정해봅시다:

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

이 클래스의 인스턴스를 Livewire 컴포넌트 속성에 할당하려고 하면, `Customer` 속성 타입이 지원되지 않는다는 오류가 발생합니다:

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

하지만, `Wireable` 인터페이스를 구현하고 클래스에 `toLivewire()`와 `fromLivewire()` 메서드를 추가하면 이 문제를 해결할 수 있습니다. 이 메서드들은 Livewire가 해당 타입의 속성을 JSON으로 변환하고 다시 PHP 객체로 복원하는 방법을 알려줍니다:

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

이제 Livewire 컴포넌트에서 `Customer` 객체를 자유롭게 사용할 수 있으며, Livewire는 이 객체들을 JSON으로 변환하고 다시 PHP로 복원하는 방법을 알게 됩니다.

앞서 언급했듯이, 더 전역적이고 강력하게 타입을 지원하고 싶다면, Livewire는 다양한 속성 타입을 처리하기 위한 고급 내부 메커니즘인 Synthesizer를 제공합니다. [Synthesizer에 대해 더 알아보기](/livewire/3.x/synthesizers).

## JavaScript에서 속성에 접근하기 {#accessing-properties-from-javascript}

Livewire 속성은 JavaScript를 통해 브라우저에서도 사용할 수 있으므로, [AlpineJS](https://alpinejs.dev/)에서 해당 속성의 JavaScript 표현에 접근하고 조작할 수 있습니다.

Alpine은 Livewire와 함께 제공되는 경량 JavaScript 라이브러리입니다. Alpine을 사용하면 전체 서버 왕복 없이도 Livewire 컴포넌트에 가벼운 상호작용을 추가할 수 있습니다.

내부적으로 Livewire의 프론트엔드는 Alpine 위에 구축되어 있습니다. 실제로 모든 Livewire 컴포넌트는 내부적으로 Alpine 컴포넌트이기도 합니다. 즉, Livewire 컴포넌트 내에서 Alpine을 자유롭게 활용할 수 있습니다.

이 페이지의 나머지 내용은 Alpine에 대한 기본적인 이해를 전제로 합니다. Alpine이 익숙하지 않다면, [Alpine 문서](https://alpinejs.dev/docs)를 참고하세요.

### 속성 접근하기 {#accessing-properties}

Livewire는 Alpine에 매직 `$wire` 객체를 제공합니다. Livewire 컴포넌트 내부의 어떤 Alpine 표현식에서도 `$wire` 객체에 접근할 수 있습니다.

`$wire` 객체는 JavaScript 버전의 Livewire 컴포넌트처럼 다룰 수 있습니다. 이 객체는 PHP 버전 컴포넌트와 동일한 속성과 메서드를 모두 가지고 있으며, 템플릿에서 특정 기능을 수행하기 위한 몇 가지 전용 메서드도 포함하고 있습니다.

예를 들어, `$wire`를 사용하여 `todo` 입력 필드의 실시간 글자 수를 표시할 수 있습니다:

```blade
<div>
    <input type="text" wire:model="todo">

    Todo 글자 수: <h2 x-text="$wire.todo.length"></h2>
</div>
```

사용자가 필드에 입력할 때마다, 현재 작성 중인 todo의 글자 수가 페이지에 실시간으로 표시되고 업데이트됩니다. 이 모든 과정은 서버로 네트워크 요청을 보내지 않고 이루어집니다.

원한다면, 더 명시적인 `.get()` 메서드를 사용해서 같은 결과를 얻을 수도 있습니다:

```blade
<div>
    <input type="text" wire:model="todo">

    Todo 글자 수: <h2 x-text="$wire.get('todo').length"></h2>
</div>
```

### 속성 조작하기 {#manipulating-properties}

마찬가지로, JavaScript에서 `$wire`를 사용하여 Livewire 컴포넌트 속성을 조작할 수 있습니다.

예를 들어, `TodoList` 컴포넌트에 "Clear" 버튼을 추가하여 사용자가 JavaScript만으로 입력 필드를 초기화할 수 있도록 해봅시다:

```blade
<div>
    <input type="text" wire:model="todo">

    <button x-on:click="$wire.todo = ''">Clear</button>
</div>
```

사용자가 "Clear"를 클릭하면 입력값이 빈 문자열로 초기화되며, 서버로 네트워크 요청이 전송되지 않습니다.

이후의 요청에서 서버 측 `$todo` 값이 업데이트되어 동기화됩니다.

원한다면, 클라이언트 측에서 속성을 설정할 때 더 명시적인 `.set()` 메서드를 사용할 수도 있습니다. 하지만 `.set()`을 사용하면 기본적으로 즉시 네트워크 요청이 발생하고 서버와 상태가 동기화된다는 점에 유의해야 합니다. 만약 이것이 원하는 동작이라면, 이 API를 사용하면 됩니다:

```blade
<button x-on:click="$wire.set('todo', '')">Clear</button>
```

서버로 네트워크 요청을 보내지 않고 속성만 업데이트하려면 세 번째 불리언 파라미터를 전달할 수 있습니다. 이렇게 하면 네트워크 요청이 지연되고, 이후의 요청에서 서버 측 상태가 동기화됩니다:
```blade
<button x-on:click="$wire.set('todo', '', false)">Clear</button>
```

## 보안 문제 {#security-concerns}

Livewire 속성은 강력한 기능이지만, 사용하기 전에 알아두어야 할 몇 가지 보안 사항이 있습니다.

간단히 말해, public 속성은 항상 사용자 입력으로 간주해야 합니다. 즉, 전통적인 엔드포인트의 요청 입력처럼 다루어야 합니다. 따라서 속성을 데이터베이스에 저장하기 전에 반드시 유효성 검사와 권한 부여를 수행해야 합니다. 이는 컨트롤러에서 요청 입력을 처리할 때와 마찬가지입니다.

### 속성 값을 신뢰하지 마세요 {#dont-trust-property-values}

속성에 대한 인가와 유효성 검사를 소홀히 하면 애플리케이션에 보안 취약점이 생길 수 있음을 보여주기 위해, 아래의 `UpdatePost` 컴포넌트는 공격에 취약한 예시입니다:

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

처음 보면 이 컴포넌트는 아무런 문제가 없어 보일 수 있습니다. 하지만, 공격자가 이 컴포넌트를 이용해 애플리케이션에서 인가되지 않은 작업을 어떻게 할 수 있는지 살펴보겠습니다.

게시글의 `id`를 컴포넌트의 public 속성으로 저장하고 있기 때문에, `title`과 `content` 속성과 마찬가지로 클라이언트에서 조작이 가능합니다.

`wire:model="id"`로 입력 필드를 작성하지 않았더라도 상관없습니다. 악의적인 사용자는 브라우저의 개발자 도구를 이용해 뷰를 다음과 같이 쉽게 변경할 수 있습니다:

```blade
<form wire:submit="update">
    <input type="text" wire:model="id"> <!-- [!code highlight] -->
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">Update</button>
</form>
```

이제 악의적인 사용자는 `id` 입력값을 다른 게시글 모델의 ID로 변경할 수 있습니다. 폼이 제출되고 `update()`가 호출되면, `Post::findOrFail()`은 사용자가 소유하지 않은 게시글을 반환하고 업데이트하게 됩니다.

이러한 공격을 방지하기 위해 다음 전략 중 하나 또는 둘 다를 사용할 수 있습니다:

* 입력값에 대한 인가 처리
* 속성의 업데이트를 잠금

#### 입력 권한 부여 {#authorizing-the-input}

`$id`는 `wire:model`과 같은 클라이언트 측에서 조작될 수 있으므로, 컨트롤러에서와 마찬가지로 [Laravel의 권한 부여](https://laravel.com/docs/authorization)를 사용하여 현재 사용자가 해당 게시글을 수정할 수 있는지 확인할 수 있습니다:

```php
public function update()
{
    $post = Post::findOrFail($this->id);

    $this->authorize('update', $post); // [!code highlight]

    $post->update(...);
}
```

악의적인 사용자가 `$id` 속성을 변조하더라도, 추가된 권한 부여 로직이 이를 감지하여 에러를 발생시킵니다.

#### 속성 잠그기 {#locking-the-property}

Livewire는 속성을 "잠가서" 클라이언트 측에서 속성이 수정되는 것을 방지할 수도 있습니다. `#[Locked]` 속성을 사용하여 클라이언트 측 조작으로부터 속성을 "잠글" 수 있습니다:

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

`#[Locked]`를 사용하면 이 속성이 컴포넌트 클래스 외부에서 조작되지 않았다고 가정할 수 있습니다.

속성 잠금에 대한 자세한 내용은 [Locked 속성 문서](/livewire/3.x/locked)를 참고하세요.

#### Eloquent 모델과 잠금 {#eloquent-models-and-locking}

Eloquent 모델이 Livewire 컴포넌트 속성에 할당되면, Livewire는 해당 속성을 자동으로 잠그고 ID가 변경되지 않도록 보장하여 이러한 종류의 공격으로부터 안전하게 보호합니다:

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

        session()->flash('message', '게시글이 성공적으로 수정되었습니다!');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

### 속성은 시스템 정보를 브라우저에 노출합니다 {#properties-expose-system-information-to-the-browser}

또 한 가지 중요한 점은 Livewire 속성이 브라우저로 전송되기 전에 직렬화 또는 "탈수(dehydrated)"된다는 것입니다. 즉, 속성 값이 전송 가능한 형식으로 변환되어 JavaScript가 이해할 수 있게 됩니다. 이 형식은 속성의 이름과 클래스 이름을 포함하여 애플리케이션에 대한 정보를 브라우저에 노출할 수 있습니다.

예를 들어, 데이터베이스의 `Post` 모델 인스턴스를 담고 있는 공개 속성 `$post`를 정의한 Livewire 컴포넌트가 있다고 가정해봅시다. 이 경우, 이 속성의 탈수된 값은 다음과 같이 전송될 수 있습니다:

```json
{
    "type": "model",
    "class": "App\Models\Post",
    "key": 1,
    "relationships": []
}
```

보시다시피, `$post` 속성의 탈수된 값에는 모델의 클래스 이름(`App\Models\Post`)과 ID, 그리고 eager-loading된 관계 정보가 포함되어 있습니다.

모델의 클래스 이름을 노출하고 싶지 않다면, 서비스 프로바이더에서 Laravel의 "morphMap" 기능을 사용하여 모델 클래스 이름에 별칭을 지정할 수 있습니다:

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

이제 Eloquent 모델이 "탈수"될 때(직렬화될 때) 원래 클래스 이름 대신 "post" 별칭만 노출됩니다:

```json
{
    "type": "model",
    "class": "App\Models\Post", // [!code --]
    "class": "post", // [!code ++]
    "key": 1,
    "relationships": []
}
```

### Eloquent 제약 조건은 요청 간에 유지되지 않습니다 {#eloquent-constraints-arent-preserved-between-requests}

일반적으로 Livewire는 서버 측 속성을 요청 간에 보존하고 재생성할 수 있지만, 특정 상황에서는 값을 요청 간에 보존하는 것이 불가능할 수 있습니다.

예를 들어, Eloquent 컬렉션을 Livewire 속성으로 저장할 때 `select(...)`와 같은 추가 쿼리 제약 조건은 이후 요청에서 다시 적용되지 않습니다.

다음은 `Todos` Eloquent 컬렉션에 `select()` 제약 조건이 적용된 `ShowTodos` 컴포넌트의 예시입니다:

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

이 컴포넌트가 처음 로드될 때, `$todos` 속성은 사용자의 todos Eloquent 컬렉션으로 설정됩니다. 하지만 데이터베이스의 각 행에서 `title`과 `content` 필드만 쿼리되어 각 모델에 로드됩니다.

Livewire가 이후 요청에서 이 속성의 JSON을 PHP로 _hydrate_ 할 때, select 제약 조건은 사라지게 됩니다.

Eloquent 쿼리의 무결성을 보장하기 위해, 속성 대신 [계산된 속성](/livewire/3.x/computed-properties)을 사용하는 것을 권장합니다.

계산된 속성은 컴포넌트 내에서 `#[Computed]` 어트리뷰트로 표시된 메서드입니다. 이들은 컴포넌트의 상태로 저장되지 않고, 필요할 때마다 동적으로 평가되는 동적 속성처럼 접근할 수 있습니다.

위 예시를 계산된 속성으로 다시 작성하면 다음과 같습니다:

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

뷰 내부에서는 `$this` 객체를 통해서만 계산된 속성에 접근할 수 있습니다: `$this->todos`와 같이 사용합니다.

클래스 내부에서도 `$todos`에 접근할 수 있습니다. 예를 들어, `markAllAsComplete()` 액션이 있다면 다음과 같이 사용할 수 있습니다:

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

왜 필요한 곳에서 그냥 `$this->todos()` 메서드를 직접 호출하지 않고, 굳이 `#[Computed]`를 사용하는지 궁금할 수 있습니다.

그 이유는 계산된 속성이 성능상 이점이 있기 때문입니다. 한 요청 내에서 처음 사용된 이후 자동으로 캐시되므로, 컴포넌트 내에서 `$this->todos`를 여러 번 접근해도 실제 메서드는 한 번만 호출되어, 동일한 요청에서 비싼 쿼리가 여러 번 실행되는 것을 방지할 수 있습니다.

자세한 내용은 [계산된 속성 문서](/livewire/3.x/computed-properties)를 참고하세요.
