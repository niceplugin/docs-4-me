# 컴포넌트 중첩
Livewire는 부모 컴포넌트 내부에 추가적인 Livewire 컴포넌트를 중첩하여 사용할 수 있도록 해줍니다. 이 기능은 매우 강력하며, 애플리케이션 전반에서 공유되는 동작을 Livewire 컴포넌트 내에 재사용하고 캡슐화할 수 있게 해줍니다.

> [!warning] Livewire 컴포넌트가 꼭 필요한지 확인하세요
> 템플릿의 일부를 중첩된 Livewire 컴포넌트로 분리하기 전에, 해당 컴포넌트의 내용이 "실시간"이어야 하는지 자문해보세요. 만약 그렇지 않다면, 간단한 [Blade 컴포넌트](https://laravel.com/docs/blade#components)를 만드는 것을 권장합니다. Livewire의 동적 특성이나 성능상의 이점이 있는 경우에만 Livewire 컴포넌트를 생성하세요.

중첩된 Livewire 컴포넌트의 성능, 사용상의 의미, 제약 사항에 대한 자세한 내용은 [Livewire 컴포넌트 중첩에 대한 심층 기술 분석](/livewire/3.x/understanding-nesting)을 참고하세요.

## 컴포넌트 중첩하기 {#nesting-a-component}

Livewire 컴포넌트를 부모 컴포넌트 내에 중첩하려면, 부모 컴포넌트의 Blade 뷰에 단순히 포함시키면 됩니다. 아래는 `TodoList` 컴포넌트가 중첩된 `Dashboard` 부모 컴포넌트의 예시입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
{
    public function render()
    {
        return view('livewire.dashboard');
    }
}
```

```blade
<div>
    <h1>Dashboard</h1>

    <livewire:todo-list /> <!-- [!code highlight] -->
</div>
```

이 페이지가 처음 렌더링될 때, `Dashboard` 컴포넌트는 `<livewire:todo-list />`를 만나 해당 위치에 렌더링합니다. 이후 `Dashboard`로의 네트워크 요청에서는, 중첩된 `todo-list` 컴포넌트가 이제 페이지에서 독립적인 컴포넌트가 되었기 때문에 렌더링을 건너뜁니다. 중첩 및 렌더링의 기술적 개념에 대한 자세한 내용은 [중첩 컴포넌트가 "아일랜드"인 이유](/livewire/3.x/understanding-nesting#every-component-is-an-island) 문서를 참고하세요.

컴포넌트 렌더링 구문에 대한 자세한 내용은 [컴포넌트 렌더링](/livewire/3.x/components#rendering-components) 문서를 참고하세요.

## 자식 컴포넌트에 props 전달하기 {#passing-props-to-children}

부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 것은 매우 간단합니다. 사실, 일반적인 [Blade 컴포넌트](https://laravel.com/docs/blade#components)에 props를 전달하는 것과 매우 유사합니다.

예를 들어, `$todos` 컬렉션을 `TodoCount`라는 자식 컴포넌트에 전달하는 `TodoList` 컴포넌트를 살펴보겠습니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class TodoList extends Component
{
    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

```blade
<div>
    <livewire:todo-count :todos="$todos" />

    <!-- ... -->
</div>
```

보시다시피, `:todos="$todos"` 구문을 사용하여 `$todos`를 `todo-count`에 전달하고 있습니다.

이제 `$todos`가 자식 컴포넌트로 전달되었으므로, 자식 컴포넌트의 `mount()` 메서드를 통해 해당 데이터를 받을 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoCount extends Component
{
    public $todos;

    public function mount($todos)
    {
        $this->todos = $todos;
    }

    public function render()
    {
        return view('livewire.todo-count', [
            'count' => $this->todos->count(),
        ]);
    }
}
```

> [!tip] 더 간단하게 `mount()` 생략하기
> 위 예시에서 `mount()` 메서드가 불필요한 보일러플레이트 코드처럼 느껴진다면, 프로퍼티와 파라미터 이름이 일치할 경우 생략할 수 있습니다:
> ```php
> public $todos; // [!code highlight]
> ```

### 정적 props 전달하기 {#passing-static-props}

이전 예제에서는 Livewire의 동적 prop 문법을 사용하여 자식 컴포넌트에 props를 전달했습니다. 이 문법은 다음과 같이 PHP 표현식을 지원합니다:

```blade
<livewire:todo-count :todos="$todos" />
```

하지만 때로는 컴포넌트에 문자열과 같은 단순한 정적 값을 전달하고 싶을 때가 있습니다. 이런 경우에는 문장 맨 앞의 콜론을 생략할 수 있습니다:

```blade
<livewire:todo-count :todos="$todos" label="Todo Count:" />
```

불리언 값은 키만 지정하여 컴포넌트에 전달할 수 있습니다. 예를 들어, 값이 `true`인 `$inline` 변수를 컴포넌트에 전달하려면, 컴포넌트 태그에 `inline`만 추가하면 됩니다:

```blade
<livewire:todo-count :todos="$todos" inline />
```

### 축약된 속성 문법 {#shortened-attribute-syntax}

PHP 변수를 컴포넌트에 전달할 때, 변수명과 prop 이름이 종종 동일합니다. 이름을 두 번 작성하는 것을 피하기 위해, Livewire에서는 변수 앞에 콜론을 붙이는 것만으로도 사용할 수 있습니다:

```blade
<livewire:todo-count :todos="$todos" /> <!-- [!code --] -->

<livewire:todo-count :$todos /> <!-- [!code ++] -->
```

## 반복문에서 자식 컴포넌트 렌더링하기 {#rendering-children-in-a-loop}

반복문 내에서 자식 컴포넌트를 렌더링할 때는 각 반복마다 고유한 `key` 값을 포함해야 합니다.

컴포넌트 키는 Livewire가 이후 렌더링 시 각 컴포넌트를 추적하는 방법입니다. 특히 컴포넌트가 이미 렌더링되었거나 여러 컴포넌트가 페이지에서 재배열된 경우에 중요합니다.

자식 컴포넌트에 `:key` prop을 지정하여 컴포넌트의 키를 설정할 수 있습니다:

```blade
<div>
    <h1>Todos</h1>

    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

보시다시피, 각 자식 컴포넌트는 각 `$todo`의 ID로 고유한 키가 설정됩니다. 이렇게 하면 todos가 재정렬될 때도 키가 고유하게 유지되고 추적됩니다.

> [!warning] 키는 선택사항이 아닙니다
> Vue나 Alpine과 같은 프론트엔드 프레임워크를 사용해본 적이 있다면, 반복문에서 중첩된 요소에 키를 추가하는 것에 익숙할 것입니다. 하지만 이러한 프레임워크에서는 키가 _필수_는 아니며, 키가 없어도 항목이 렌더링되지만 재정렬이 제대로 추적되지 않을 수 있습니다. 그러나 Livewire는 키에 훨씬 더 의존하므로, 키가 없으면 올바르게 동작하지 않습니다.

## 반응형 props {#reactive-props}

Livewire를 처음 접하는 개발자들은 props가 기본적으로 "반응형"이라고 기대합니다. 즉, 부모 컴포넌트에서 자식 컴포넌트로 전달되는 prop의 값이 변경되면, 자식 컴포넌트도 자동으로 업데이트될 것이라고 생각합니다. 하지만 기본적으로 Livewire의 props는 반응형이 아닙니다.

Livewire를 사용할 때, [모든 컴포넌트는 독립적인 섬입니다](/livewire/3.x/understanding-nesting#every-component-is-an-island). 이는 부모에서 업데이트가 발생하고 네트워크 요청이 전송될 때, 오직 부모 컴포넌트의 상태만 서버로 전송되어 다시 렌더링된다는 의미입니다. 자식 컴포넌트의 상태는 전송되지 않습니다. 이러한 동작의 의도는 서버와 클라이언트 간에 오가는 데이터의 양을 최소화하여, 업데이트를 최대한 성능적으로 처리하기 위함입니다.

하지만 prop이 반응형이길 원하거나 필요하다면, `#[Reactive]` 속성 파라미터를 사용하여 이 동작을 쉽게 활성화할 수 있습니다.

예를 들어, 아래는 부모 `TodoList` 컴포넌트의 템플릿입니다. 내부에서 `TodoCount` 컴포넌트를 렌더링하고, 현재 todos 목록을 전달하고 있습니다:

```blade
<div>
    <h1>Todos:</h1>

    <livewire:todo-count :$todos />

    <!-- ... -->
</div>
```

이제 `TodoCount` 컴포넌트의 `$todos` prop에 `#[Reactive]`를 추가해봅시다. 이렇게 하면, 부모 컴포넌트에서 todos가 추가되거나 삭제될 때마다 `TodoCount` 컴포넌트 내에서도 자동으로 업데이트가 트리거됩니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Reactive;
use Livewire\Component;
use App\Models\Todo;

class TodoCount extends Component
{
    #[Reactive] // [!code highlight]
    public $todos;

    public function render()
    {
        return view('livewire.todo-count', [
            'count' => $this->todos->count(),
        ]);
    }
}
```

반응형 속성은 매우 강력한 기능으로, Livewire를 Vue나 React와 같은 프론트엔드 컴포넌트 라이브러리와 더욱 유사하게 만들어줍니다. 하지만 이 기능의 성능적 영향을 이해하고, 특정 상황에서만 `#[Reactive]`를 추가하는 것이 중요합니다.

## `wire:model`을 사용하여 자식 데이터 바인딩하기 {#binding-to-child-data-using-wiremodel}

부모와 자식 컴포넌트 간에 상태를 공유하는 또 다른 강력한 패턴은 Livewire의 `Modelable` 기능을 통해 자식 컴포넌트에 직접 `wire:model`을 사용하는 것입니다.

이 동작은 입력 요소를 별도의 Livewire 컴포넌트로 분리하면서도 부모 컴포넌트에서 해당 상태에 접근해야 할 때 매우 자주 필요합니다.

아래는 사용자가 추가하려는 현재 할 일을 추적하는 `$todo` 속성을 포함하는 부모 `TodoList` 컴포넌트의 예시입니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;

class TodoList extends Component
{
    public $todo = '';

    public function add()
    {
        Todo::create([
            'content' => $this->pull('todo'),
        ]);
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

아래 `TodoList` 템플릿에서 볼 수 있듯이, `wire:model`을 사용하여 `$todo` 속성을 중첩된 `TodoInput` 컴포넌트에 직접 바인딩하고 있습니다:

```blade
<div>
    <h1>Todos</h1>

    <livewire:todo-input wire:model="todo" /> <!-- [!code highlight] -->

    <button wire:click="add">Add Todo</button>

    <div>
        @foreach ($todos as $todo)
            <livewire:todo-item :$todo :key="$todo->id" />
        @endforeach
    </div>
</div>
```

Livewire는 자식 컴포넌트의 어떤 속성이든 부모 컴포넌트에서 _모델 바인딩_ 할 수 있도록 `#[Modelable]` 속성을 제공합니다.

아래는 `TodoInput` 컴포넌트에 `#[Modelable]` 속성을 `$value` 속성 위에 추가하여, 부모에서 컴포넌트에 `wire:model`이 선언되면 이 속성과 바인딩하도록 Livewire에 알리는 예시입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Modelable;

class TodoInput extends Component
{
    #[Modelable] // [!code highlight]
    public $value = '';

    public function render()
    {
        return view('livewire.todo-input');
    }
}
```

```blade
<div>
    <input type="text" wire:model="value" >
</div>
```

이제 부모 `TodoList` 컴포넌트는 `TodoInput`을 다른 입력 요소처럼 취급하여 `wire:model`을 사용해 그 값을 직접 바인딩할 수 있습니다.

> [!warning]
> 현재 Livewire는 단일 `#[Modelable]` 속성만 지원하므로, 첫 번째 속성만 바인딩됩니다.


## 자식 컴포넌트로부터 이벤트 수신하기 {#listening-for-events-from-children}

또 다른 강력한 부모-자식 컴포넌트 간 통신 기법은 Livewire의 이벤트 시스템입니다. 이 시스템을 사용하면 서버나 클라이언트에서 이벤트를 디스패치하고, 다른 컴포넌트가 이를 가로챌 수 있습니다.

[Livewire 이벤트 시스템에 대한 전체 문서](/livewire/3.x/events)에서 이벤트에 대해 더 자세히 다루고 있지만, 아래에서는 이벤트를 사용해 부모 컴포넌트의 업데이트를 트리거하는 간단한 예제를 살펴보겠습니다.

`TodoList` 컴포넌트가 할 일 목록을 보여주고 삭제하는 기능을 가진다고 가정해봅시다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;

class TodoList extends Component
{
    public function remove($todoId)
    {
        $todo = Todo::find($todoId);

        $this->authorize('delete', $todo);

        $todo->delete();
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

```blade
<div>
    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

자식 `TodoItem` 컴포넌트 내부에서 `remove()`를 호출하려면, `#[On]` 속성을 사용해 `TodoList`에 이벤트 리스너를 추가할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;
use Livewire\Attributes\On;

class TodoList extends Component
{
    #[On('remove-todo')] // [!code highlight]
    public function remove($todoId)
    {
        $todo = Todo::find($todoId);

        $this->authorize('delete', $todo);

        $todo->delete();
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

액션에 속성을 추가한 후에는, 자식 컴포넌트인 `TodoList`에서 `remove-todo` 이벤트를 디스패치할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoItem extends Component
{
    public Todo $todo;

    public function remove()
    {
        $this->dispatch('remove-todo', todoId: $this->todo->id); // [!code highlight]
    }

    public function render()
    {
        return view('livewire.todo-item');
    }
}
```

```blade
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="remove">Remove</button>
</div>
```

이제 `TodoItem` 내부의 "Remove" 버튼을 클릭하면, 부모 `TodoList` 컴포넌트가 디스패치된 이벤트를 가로채서 할 일을 삭제하게 됩니다.

부모에서 할 일이 삭제된 후, 목록이 다시 렌더링되고 `remove-todo` 이벤트를 디스패치한 자식 컴포넌트는 페이지에서 사라집니다.

### 클라이언트 사이드에서 디스패치하여 성능 향상하기 {#improving-performance-by-dispatching-client-side}

위의 예제는 동작하지만, 하나의 작업을 수행하기 위해 두 번의 네트워크 요청이 발생합니다:

1. 첫 번째 네트워크 요청은 `TodoItem` 컴포넌트에서 `remove` 액션을 트리거하여 `remove-todo` 이벤트를 디스패치합니다.
2. 두 번째 네트워크 요청은 `remove-todo` 이벤트가 클라이언트 사이드에서 디스패치된 후, `TodoList`가 이를 가로채어 자신의 `remove` 액션을 호출할 때 발생합니다.

`remove-todo` 이벤트를 클라이언트 사이드에서 직접 디스패치하면 첫 번째 요청을 완전히 피할 수 있습니다. 아래는 `remove-todo` 이벤트를 디스패치할 때 네트워크 요청을 발생시키지 않는, 업데이트된 `TodoItem` 컴포넌트입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoItem extends Component
{
    public Todo $todo;

    public function render()
    {
        return view('livewire.todo-item');
    }
}
```

```blade
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$dispatch('remove-todo', { todoId: {{ $todo->id }} })">Remove</button>
</div>
```

일반적으로, 가능하다면 항상 클라이언트 사이드에서 디스패치하는 방식을 우선적으로 고려하세요.

## 자식에서 부모에 직접 접근하기 {#directly-accessing-the-parent-from-the-child}

이벤트 통신은 간접적인 계층을 추가합니다. 부모는 자식에서 절대 발생하지 않는 이벤트를 청취할 수 있고, 자식은 부모가 절대 가로채지 않는 이벤트를 발생시킬 수 있습니다.

이러한 간접성이 때로는 바람직할 수 있지만, 경우에 따라 자식 컴포넌트에서 부모 컴포넌트에 직접 접근하는 것이 더 나을 수 있습니다.

Livewire는 Blade 템플릿에서 매직 `$parent` 변수를 제공하여 자식에서 부모의 액션과 프로퍼티에 직접 접근할 수 있도록 해줍니다. 아래는 위의 `TodoItem` 템플릿을 매직 `$parent` 변수를 통해 부모의 `remove()` 액션을 직접 호출하도록 다시 작성한 예시입니다:

```blade
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$parent.remove({{ $todo->id }})">Remove</button>
</div>
```

이벤트와 직접적인 부모 통신은 부모와 자식 컴포넌트 간에 상호 소통할 수 있는 몇 가지 방법 중 일부입니다. 각각의 장단점을 이해하면 특정 상황에서 어떤 패턴을 사용할지 더 현명하게 결정할 수 있습니다.

## 동적 자식 컴포넌트 {#dynamic-child-components}

때로는 어떤 자식 컴포넌트를 페이지에 렌더링할지 런타임까지 알 수 없는 경우가 있습니다. 따라서 Livewire는 `<livewire:dynamic-component ...>`를 통해 런타임에 자식 컴포넌트를 선택할 수 있도록 `:is` prop을 제공합니다:

```blade
<livewire:dynamic-component :is="$current" />
```

동적 자식 컴포넌트는 다양한 상황에서 유용하게 사용될 수 있지만, 아래는 동적 컴포넌트를 사용하여 다단계 폼의 각 단계를 렌더링하는 예시입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Steps extends Component
{
    public $current = 'step-one';

    protected $steps = [
        'step-one',
        'step-two',
        'step-three',
    ];

    public function next()
    {
        $currentIndex = array_search($this->current, $this->steps);

        $this->current = $this->steps[$currentIndex + 1];
    }

    public function render()
    {
        return view('livewire.todo-list');
    }
}
```

```blade
<div>
    <livewire:dynamic-component :is="$current" :key="$current" />

    <button wire:click="next">Next</button>
</div>
```

이제 `Steps` 컴포넌트의 `$current` prop이 "step-one"으로 설정되어 있다면, Livewire는 아래와 같이 "step-one"이라는 이름의 컴포넌트를 렌더링합니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class StepOne extends Component
{
    public function render()
    {
        return view('livewire.step-one');
    }
}
```

원한다면, 다음과 같은 대체 문법을 사용할 수도 있습니다:

```blade
<livewire:is :component="$current" :key="$current" />
```

> [!warning]
> 각 자식 컴포넌트에 고유한 key를 할당하는 것을 잊지 마세요. Livewire는 `<livewire:dynamic-child />`와 `<livewire:is />`에 대해 자동으로 key를 생성하지만, 동일한 key가 _모든_ 자식 컴포넌트에 적용되므로 이후 렌더링이 건너뛰어질 수 있습니다.
> 
> key가 컴포넌트 렌더링에 어떤 영향을 미치는지 더 깊이 이해하려면 [자식 컴포넌트의 강제 재렌더링](#forcing-a-child-component-to-re-render)을 참고하세요.

## 재귀 컴포넌트 {#recursive-components}

대부분의 애플리케이션에서는 드물게 필요하지만, Livewire 컴포넌트는 재귀적으로 중첩될 수 있습니다. 즉, 부모 컴포넌트가 자식으로서 자신을 렌더링할 수 있습니다.

예를 들어, `SurveyQuestion` 컴포넌트가 있고, 이 컴포넌트에 하위 질문을 추가할 수 있는 설문조사를 상상해보세요:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Question;

class SurveyQuestion extends Component
{
    public Question $question;

    public function render()
    {
        return view('livewire.survey-question', [
            'subQuestions' => $this->question->subQuestions,
        ]);
    }
}
```

```blade
<div>
    Question: {{ $question->content }}

    @foreach ($subQuestions as $subQuestion)
        <livewire:survey-question :question="$subQuestion" :key="$subQuestion->id" />
    @endforeach
</div>
```

> [!warning]
> 물론, 재귀 컴포넌트에도 재귀의 일반적인 규칙이 적용됩니다. 가장 중요한 점은, 템플릿이 무한히 재귀되지 않도록 템플릿 내에 로직을 추가해야 한다는 것입니다. 위 예시에서 만약 `$subQuestion`이 원래의 질문을 자신의 `$subQuestion`으로 포함한다면, 무한 루프가 발생하게 됩니다.

## 자식 컴포넌트의 강제 리렌더링 {#forcing-a-child-component-to-re-render}

백그라운드에서 Livewire는 템플릿 내에 중첩된 각 Livewire 컴포넌트에 대해 키를 생성합니다.

예를 들어, 다음과 같은 중첩된 `todo-count` 컴포넌트를 살펴보겠습니다:

```blade
<div>
    <livewire:todo-count :$todos />
</div>
```

Livewire는 내부적으로 컴포넌트에 무작위 문자열 키를 다음과 같이 부여합니다:

```blade
<div>
    <livewire:todo-count :$todos key="lska" />
</div>
```

부모 컴포넌트가 렌더링되면서 위와 같은 자식 컴포넌트를 만나면, 해당 키를 부모에 연결된 자식 목록에 저장합니다:

```php
'children' => ['lska'],
```

Livewire는 이후 렌더링 시 이 목록을 참고하여, 자식 컴포넌트가 이전 요청에서 이미 렌더링되었는지 감지합니다. 이미 렌더링된 경우, 해당 컴포넌트는 건너뜁니다. 참고로, [중첩 컴포넌트는 각각 독립된 섬입니다](/livewire/3.x/understanding-nesting#every-component-is-an-island). 하지만 자식 키가 목록에 없다면, 즉 아직 렌더링되지 않았다면, Livewire는 컴포넌트의 새 인스턴스를 생성하여 그 자리에 렌더링합니다.

이러한 세부 동작은 대부분의 사용자에게는 알 필요 없는 백그라운드 동작입니다. 하지만 자식 컴포넌트에 키를 지정하는 개념은 자식 렌더링을 제어하는 강력한 도구입니다.

이 원리를 활용하면, 컴포넌트를 강제로 리렌더링하고 싶을 때 단순히 키를 변경하면 됩니다.

아래는 컴포넌트에 전달되는 `$todos`가 변경될 때 `todo-count` 컴포넌트를 파괴하고 다시 초기화하고 싶은 경우의 예시입니다:

```blade
<div>
    <livewire:todo-count :todos="$todos" :key="$todos->pluck('id')->join('-')" />
</div>
```

위에서 볼 수 있듯이, `$todos`의 내용을 기반으로 동적으로 `:key` 문자열을 생성하고 있습니다. 이렇게 하면, `todo-count` 컴포넌트는 `$todos`가 변경되지 않는 한 정상적으로 렌더링되고 존재합니다. 하지만 `$todos`가 변경되는 순간, 해당 컴포넌트는 완전히 새로 초기화되고, 이전 컴포넌트는 폐기됩니다.
