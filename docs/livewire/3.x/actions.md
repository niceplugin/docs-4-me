# 액션
Livewire 액션은 버튼 클릭이나 폼 제출과 같은 프론트엔드 상호작용에 의해 트리거될 수 있는 컴포넌트의 메서드입니다. 이 기능을 통해 개발자는 브라우저에서 직접 PHP 메서드를 호출할 수 있는 경험을 제공하며, 프론트엔드와 백엔드를 연결하는 반복적인 코드를 작성하지 않고도 애플리케이션의 로직에 집중할 수 있습니다.

`CreatePost` 컴포넌트에서 `save` 액션을 호출하는 기본 예제를 살펴보겠습니다:
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

        return redirect()->to('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save"> <!-- [!code highlight] -->
    <input type="text" wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

위 예제에서 사용자가 "Save" 버튼을 클릭하여 폼을 제출하면, `wire:submit`이 `submit` 이벤트를 가로채고 서버의 `save()` 액션을 호출합니다.

즉, 액션은 사용자의 상호작용을 서버 사이드 기능에 쉽게 매핑할 수 있는 방법을 제공하며, 수동으로 AJAX 요청을 제출하고 처리하는 번거로움 없이 사용할 수 있습니다.

## 컴포넌트 새로고침 {#refreshing-a-component}

때때로 컴포넌트를 간단히 "새로고침"하고 싶을 때가 있습니다. 예를 들어, 데이터베이스의 어떤 상태를 확인하는 컴포넌트가 있다면, 사용자가 표시된 결과를 새로고침할 수 있도록 버튼을 보여주고 싶을 수 있습니다.

이럴 때는 Livewire의 간단한 `$refresh` 액션을 사용하여, 평소에 컴포넌트 메서드를 참조하는 곳 어디에서든 사용할 수 있습니다:

```blade
<button type="button" wire:click="$refresh">...</button>
```

`$refresh` 액션이 트리거되면, Livewire는 서버로 라운드트립을 수행하고 어떤 메서드도 호출하지 않은 채로 컴포넌트를 다시 렌더링합니다.

중요한 점은, 컴포넌트 내의 모든 대기 중인 데이터 업데이트(예: `wire:model` 바인딩)는 컴포넌트가 새로고침될 때 서버에서 적용된다는 것입니다.

내부적으로 Livewire는 컴포넌트가 서버에서 업데이트될 때마다 "commit"이라는 이름을 사용합니다. 이 용어가 더 익숙하다면, `$refresh` 대신 `$commit` 헬퍼를 사용할 수 있습니다. 두 기능은 동일합니다.

```blade
<button type="button" wire:click="$commit">...</button>
```

Livewire 컴포넌트에서 AlpineJS를 사용하여 컴포넌트 새로고침을 트리거할 수도 있습니다:

```blade
<button type="button" x-on:click="$wire.$refresh()">...</button>
```

[Livewire에서 Alpine 사용하기 문서](/livewire/3.x/alpine)를 읽어 더 자세히 알아보세요.

## 액션 확인 {#confirming-an-action}

사용자가 데이터베이스에서 게시물을 삭제하는 것과 같이 위험한 작업을 수행할 수 있도록 허용할 때, 해당 작업을 수행할 의사가 있는지 확인하는 경고창을 보여주고 싶을 수 있습니다.

Livewire는 `wire:confirm`이라는 간단한 지시어를 제공하여 이를 쉽게 처리할 수 있습니다:

```blade {4}
<button
    type="button"
    wire:click="delete"
    wire:confirm="Are you sure you want to delete this post?"
>
    Delete post
</button>
```

`wire:confirm`이 Livewire 액션이 포함된 요소에 추가되면, 사용자가 해당 액션을 트리거하려고 할 때 제공된 메시지가 포함된 확인 대화상자가 표시됩니다. 사용자는 "OK"를 눌러 액션을 확인하거나, "Cancel"을 누르거나 ESC 키를 눌러 취소할 수 있습니다.

자세한 내용은 [`wire:confirm` 문서 페이지](/livewire/3.x/wire-confirm)를 참고하세요.

## 이벤트 리스너 {#event-listeners}

Livewire는 다양한 이벤트 리스너를 지원하여 여러 종류의 사용자 상호작용에 응답할 수 있습니다:

| 리스너            | 설명                                         |
|-------------------|----------------------------------------------|
| `wire:click`      | 요소가 클릭될 때 트리거됨                    |
| `wire:submit`     | 폼이 제출될 때 트리거됨                      |
| `wire:keydown`    | 키가 눌릴 때 트리거됨                        |
| `wire:keyup`      | 키가 떼어질 때 트리거됨                       |
| `wire:mouseenter` | 마우스가 요소에 진입할 때 트리거됨            |
| `wire:*`          | `wire:` 뒤에 오는 텍스트가 리스너의 이벤트 이름으로 사용됨 |

`wire:` 뒤의 이벤트 이름은 무엇이든 될 수 있으므로, Livewire는 브라우저에서 필요로 하는 모든 이벤트를 지원합니다. 예를 들어, `transitionend` 이벤트를 듣고 싶다면 `wire:transitionend`를 사용할 수 있습니다.

### 특정 키 리스닝 {#listening-for-specific-keys}

Livewire의 편리한 별칭을 사용하여 키 입력 이벤트 리스너를 특정 키 또는 키 조합으로 좁힐 수 있습니다.

예를 들어, 사용자가 검색 상자에 입력한 후 `Enter`를 눌렀을 때 검색을 수행하려면 `wire:keydown.enter`를 사용할 수 있습니다:

```blade
<input wire:model="query" wire:keydown.enter="searchPosts">
```

더 많은 키 별칭을 첫 번째 뒤에 체이닝하여 키 조합을 들을 수 있습니다. 예를 들어, `Shift` 키가 눌린 상태에서만 `Enter` 키를 듣고 싶다면 다음과 같이 작성할 수 있습니다:

```blade
<input wire:keydown.shift.enter="...">
```

아래는 사용 가능한 모든 키 수정자 목록입니다:

| 수정자         | 키                                   |
|----------------|--------------------------------------|
| `.shift`       | Shift                                |
| `.enter`       | Enter                                |
| `.space`       | Space                                |
| `.ctrl`        | Ctrl                                 |
| `.cmd`         | Cmd                                  |
| `.meta`        | Mac에서는 Cmd, Windows에서는 Windows 키 |
| `.alt`         | Alt                                  |
| `.up`          | 위쪽 화살표                          |
| `.down`        | 아래쪽 화살표                        |
| `.left`        | 왼쪽 화살표                          |
| `.right`       | 오른쪽 화살표                        |
| `.escape`      | Escape                               |
| `.tab`         | Tab                                  |
| `.caps-lock`   | Caps Lock                            |
| `.equal`       | 등호, `=`                            |
| `.period`      | 마침표, `.`                          |
| `.slash`       | 슬래시, `/`                          |

### 이벤트 핸들러 수정자 {#event-handler-modifiers}

Livewire는 일반적인 이벤트 처리 작업을 쉽게 할 수 있도록 유용한 수정자도 포함하고 있습니다.

예를 들어, 이벤트 리스너 내부에서 `event.preventDefault()`를 호출해야 한다면, 이벤트 이름 뒤에 `.prevent`를 붙이면 됩니다:

```blade
<input wire:keydown.prevent="...">
```

아래는 사용 가능한 모든 이벤트 리스너 수정자와 그 기능의 전체 목록입니다:

| 수정자              | 설명                                                                 |
|---------------------|----------------------------------------------------------------------|
| `.prevent`          | `.preventDefault()` 호출과 동일                                      |
| `.stop`             | `.stopPropagation()` 호출과 동일                                     |
| `.window`           | `window` 객체에서 이벤트를 리스닝                                    |
| `.outside`          | 요소 "외부"에서의 클릭만 리스닝                                      |
| `.document`         | `document` 객체에서 이벤트를 리스닝                                  |
| `.once`             | 리스너가 한 번만 호출되도록 보장                                     |
| `.debounce`         | 기본값 250ms로 핸들러 디바운스                                       |
| `.debounce.100ms`   | 지정한 시간만큼 핸들러 디바운스                                      |
| `.throttle`         | 최소 250ms마다 한 번씩 핸들러 호출                                   |
| `.throttle.100ms`   | 지정한 시간만큼 핸들러 스로틀링                                      |
| `.self`             | 이벤트가 이 요소에서 발생한 경우에만 리스너 호출(자식에서는 X)        |
| `.camel`            | 이벤트 이름을 카멜케이스로 변환(`wire:custom-event` → "customEvent") |
| `.dot`              | 이벤트 이름을 점 표기법으로 변환(`wire:custom-event` → "custom.event")|
| `.passive`          | `wire:touchstart.passive`는 스크롤 성능을 방해하지 않음              |
| `.capture`          | "캡처링" 단계에서 이벤트를 리스닝                                    |

`wire:`는 내부적으로 [Alpine](https://alpinejs.dev)의 `x-on` 지시어를 사용하므로, 이러한 수정자는 Alpine에서 제공됩니다. 언제 이러한 수정자를 사용해야 하는지 더 알고 싶다면 [Alpine 이벤트 문서](https://alpinejs.dev/essentials/events)를 참고하세요.

### 서드파티 이벤트 처리 {#handling-third-party-events}

Livewire는 서드파티 라이브러리에서 발생하는 커스텀 이벤트도 리스닝할 수 있습니다.

예를 들어, 프로젝트에서 [Trix](https://trix-editor.org/) 리치 텍스트 에디터를 사용하고 있고, `trix-change` 이벤트를 리스닝하여 에디터의 내용을 캡처하고 싶다고 가정해봅시다. `wire:trix-change` 지시어를 사용하여 이를 처리할 수 있습니다:

```blade
<form wire:submit="save">
    <!-- ... -->

    <trix-editor
        wire:trix-change="setPostContent($event.target.value)"
    ></trix-editor>

    <!-- ... -->
</form>
```

이 예제에서, `trix-change` 이벤트가 트리거될 때마다 `setPostContent` 액션이 호출되어, Trix 에디터의 현재 값을 Livewire 컴포넌트의 `content` 속성에 업데이트합니다.

> [!info] 이벤트 객체는 `$event`로 접근할 수 있습니다
> Livewire 이벤트 핸들러 내에서는 `$event`를 통해 이벤트 객체에 접근할 수 있습니다. 이벤트에 대한 정보를 참조할 때 유용합니다. 예를 들어, 이벤트를 트리거한 요소는 `$event.target`으로 접근할 수 있습니다.

> [!warning]
> 위 Trix 데모 코드는 불완전하며 이벤트 리스너의 데모로만 유용합니다. 그대로 사용하면 모든 키 입력마다 네트워크 요청이 발생합니다. 더 성능이 좋은 구현은 다음과 같습니다:
>
> ```blade
> <trix-editor
>    x-on:trix-change="$wire.content = $event.target.value"
> ></trix-editor>
> ```

### 디스패치된 커스텀 이벤트 리스닝 {#listening-for-dispatched-custom-events}

애플리케이션에서 Alpine에서 커스텀 이벤트를 디스패치하는 경우, Livewire에서도 이를 리스닝할 수 있습니다:

```blade
<div wire:custom-event="...">

    <!-- 이 컴포넌트 내 깊숙한 곳: -->
    <button x-on:click="$dispatch('custom-event')">...</button>

</div>
```

위 예제에서 버튼이 클릭되면, `custom-event` 이벤트가 디스패치되고 Livewire 컴포넌트의 루트까지 버블링되어 `wire:custom-event`가 이를 캐치하고 지정된 액션을 호출합니다.

애플리케이션의 다른 곳에서 디스패치된 이벤트를 리스닝하고 싶다면, 이벤트가 `window` 객체까지 버블링될 때까지 기다려야 하며, 그곳에서 이벤트를 리스닝해야 합니다. Livewire는 `.window` 수정자를 이벤트 리스너에 간단히 추가하여 이를 쉽게 처리할 수 있도록 합니다:

```blade
<div wire:custom-event.window="...">
    <!-- ... -->
</div>

<!-- 컴포넌트 외부의 페이지 어딘가에서 디스패치됨: -->
<button x-on:click="$dispatch('custom-event')">...</button>
```

### 폼 제출 중 입력 비활성화 {#disabling-inputs-while-a-form-is-being-submitted}

앞서 살펴본 `CreatePost` 예제를 생각해봅시다:

```blade
<form wire:submit="save">
    <input wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

사용자가 "Save"를 클릭하면, Livewire 컴포넌트의 `save()` 액션을 호출하기 위해 서버로 네트워크 요청이 전송됩니다.

하지만 사용자가 느린 인터넷 환경에서 이 폼을 작성하고 있다고 가정해봅시다. 사용자가 "Save"를 클릭했지만 네트워크 요청이 평소보다 오래 걸려 아무 일도 일어나지 않는 것처럼 보일 수 있습니다. 이 경우 사용자는 제출이 실패했다고 생각하고 첫 번째 요청이 처리되는 동안 "Save" 버튼을 다시 클릭할 수 있습니다.

이 경우 동일한 액션에 대해 두 개의 요청이 동시에 처리될 수 있습니다.

이러한 상황을 방지하기 위해, Livewire는 `wire:submit` 액션이 처리되는 동안 `<form>` 요소 내부의 제출 버튼과 모든 폼 입력을 자동으로 비활성화합니다. 이를 통해 폼이 실수로 두 번 제출되는 것을 방지할 수 있습니다.

느린 연결 환경의 사용자가 혼란을 덜 느끼도록, 미묘한 배경색 변화나 SVG 애니메이션과 같은 로딩 인디케이터를 보여주는 것이 도움이 될 수 있습니다.

Livewire는 페이지 어디에서든 로딩 인디케이터를 쉽게 표시하고 숨길 수 있는 `wire:loading` 지시어를 제공합니다. 아래는 "Save" 버튼 아래에 로딩 메시지를 표시하는 간단한 예제입니다:

```blade
<form wire:submit="save">
    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>

    <span wire:loading>Saving...</span> <!-- [!code highlight] -->
</form>
```

`wire:loading`은 다양한 강력한 기능을 가진 기능입니다. [로딩 관련 전체 문서](/livewire/3.x/wire-loading)를 참고하세요.

## 파라미터 전달 {#passing-parameters}

Livewire는 Blade 템플릿에서 컴포넌트의 액션으로 파라미터를 전달할 수 있어, 액션이 호출될 때 프론트엔드에서 추가 데이터나 상태를 제공할 수 있습니다.

예를 들어, 사용자가 게시물을 삭제할 수 있는 `ShowPosts` 컴포넌트가 있다고 가정해봅시다. 게시물의 ID를 Livewire 컴포넌트의 `delete()` 액션에 파라미터로 전달할 수 있습니다. 그런 다음 액션에서 해당 게시물을 찾아 데이터베이스에서 삭제할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">Delete</button> <!-- [!code highlight] -->
        </div>
    @endforeach
</div>
```

ID가 2인 게시물의 경우, 위 Blade 템플릿의 "Delete" 버튼은 브라우저에서 다음과 같이 렌더링됩니다:

```blade
<button wire:click="delete(2)">Delete</button>
```

이 버튼이 클릭되면, `delete()` 메서드가 호출되고 `$id`에는 "2"가 전달됩니다.

> [!warning] 액션 파라미터를 신뢰하지 마세요
> 액션 파라미터는 HTTP 요청 입력과 동일하게 취급해야 하며, 액션 파라미터 값은 신뢰할 수 없습니다. 데이터베이스에서 엔티티를 업데이트하기 전에 항상 소유권을 인증해야 합니다.
>
> 자세한 내용은 [보안 문제 및 모범 사례](/livewire/3.x/actions#security-concerns) 문서를 참고하세요.


추가로, 액션에 파라미터로 전달된 모델 ID에 따라 Eloquent 모델을 자동으로 resolve할 수 있습니다. 이는 [라우트 모델 바인딩](/livewire/3.x/components#using-route-model-binding)과 매우 유사합니다. 시작하려면, 액션 파라미터에 모델 클래스를 타입힌트하면, 해당 모델이 데이터베이스에서 자동으로 조회되어 ID 대신 액션에 전달됩니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete(Post $post) // [!code highlight]
    {
        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

## 의존성 주입 {#dependency-injection}

액션 시그니처에 타입힌트된 파라미터를 사용하여 [Laravel의 의존성 주입](https://laravel.com/docs/controllers#dependency-injection-and-controllers) 시스템을 활용할 수 있습니다. Livewire와 Laravel은 액션의 의존성을 컨테이너에서 자동으로 resolve합니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Repositories\PostRepository;

class ShowPosts extends Component
{
    public function delete(PostRepository $posts, $postId) // [!code highlight]
    {
        $posts->deletePost($postId);
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">Delete</button> <!-- [!code highlight] -->
        </div>
    @endforeach
</div>
```

이 예제에서, `delete()` 메서드는 [Laravel의 서비스 컨테이너](https://laravel.com/docs/container#main-content)를 통해 resolve된 `PostRepository` 인스턴스를 먼저 받고, 그 다음에 제공된 `$postId` 파라미터를 받습니다.

## Alpine에서 액션 호출 {#calling-actions-from-alpine}

Livewire는 [Alpine](https://alpinejs.dev/)과 완벽하게 통합됩니다. 실제로, 모든 Livewire 컴포넌트는 내부적으로 Alpine 컴포넌트이기도 합니다. 즉, 컴포넌트 내에서 Alpine을 최대한 활용하여 JavaScript 기반의 클라이언트 사이드 상호작용을 추가할 수 있습니다.

이 조합을 더욱 강력하게 만들기 위해, Livewire는 Alpine에 `$wire` 매직 객체를 노출합니다. 이 객체는 PHP 컴포넌트의 JavaScript 표현으로 취급할 수 있습니다. [공개 속성에 접근하고 변경하는 것](/livewire/3.x/properties#accessing-properties-from-javascript) 외에도, 액션을 호출할 수 있습니다. `$wire` 객체에서 액션을 호출하면, 해당하는 PHP 메서드가 백엔드 Livewire 컴포넌트에서 실행됩니다:

```blade
<button x-on:click="$wire.save()">Save Post</button>
```

좀 더 복잡한 예시로, Alpine의 [`x-intersect`](https://alpinejs.dev/plugins/intersect) 유틸리티를 사용하여 특정 요소가 페이지에 보일 때 `incrementViewCount()` Livewire 액션을 트리거할 수도 있습니다:

```blade
<div x-intersect="$wire.incrementViewCount()">...</div>
```

### 파라미터 전달 {#passing-parameters-1}

`$wire` 메서드에 전달하는 모든 파라미터는 PHP 클래스 메서드에도 전달됩니다. 예를 들어, 다음과 같은 Livewire 액션을 생각해봅시다:

```php
public function addTodo($todo)
{
    $this->todos[] = $todo;
}
```

컴포넌트의 Blade 템플릿 내에서, Alpine을 통해 이 액션을 호출하고 액션에 전달할 파라미터를 제공할 수 있습니다:

```blade
<div x-data="{ todo: '' }">
    <input type="text" x-model="todo">

    <button x-on:click="$wire.addTodo(todo)">Add Todo</button>
</div>
```

사용자가 텍스트 입력란에 "Take out the trash"를 입력하고 "Add Todo" 버튼을 누르면, `addTodo()` 메서드가 `$todo` 파라미터 값으로 "Take out the trash"를 받아 트리거됩니다.

### 반환값 받기 {#receiving-return-values}

더 강력하게, 호출된 `$wire` 액션은 네트워크 요청이 처리되는 동안 프로미스를 반환합니다. 서버 응답이 도착하면, 프로미스는 백엔드 액션에서 반환된 값으로 resolve됩니다.

예를 들어, 다음과 같은 액션이 있는 Livewire 컴포넌트를 생각해봅시다:

```php
use App\Models\Post;

public function getPostCount()
{
    return Post::count();
}
```

`$wire`를 사용하여 액션을 호출하고 반환된 값을 resolve할 수 있습니다:

```blade
<span x-init="$el.innerHTML = await $wire.getPostCount()"></span>
```

이 예제에서, `getPostCount()` 메서드가 "10"을 반환하면, `<span>` 태그에도 "10"이 표시됩니다.

Livewire를 사용할 때 Alpine 지식이 필수는 아니지만, Alpine을 알면 Livewire 경험과 생산성이 크게 향상됩니다.

## 자바스크립트 액션 {#javascript-actions}

Livewire는 서버 요청 없이 클라이언트 사이드에서만 실행되는 자바스크립트 액션을 정의할 수 있습니다. 이는 다음 두 가지 시나리오에서 유용합니다:

1. 서버와 통신할 필요가 없는 간단한 UI 업데이트를 수행하고 싶을 때
2. 서버 요청 전에 자바스크립트로 UI를 낙관적으로(optimistically) 업데이트하고 싶을 때

자바스크립트 액션을 정의하려면, 컴포넌트의 `<script>` 태그 내에서 `$js()` 함수를 사용할 수 있습니다.

아래는 자바스크립트 액션을 사용하여 UI를 낙관적으로 업데이트한 후 서버 요청을 보내는 북마크 예제입니다. 자바스크립트 액션은 즉시 채워진 북마크 아이콘을 보여주고, 그 다음 데이터베이스에 북마크를 저장하는 요청을 보냅니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $bookmarked = false;

    public function mount()
    {
        $this->bookmarked = $this->post->bookmarkedBy(auth()->user());
    }

    public function bookmarkPost()
    {
        $this->post->bookmark(auth()->user());

        $this->bookmarked = $this->post->bookmarkedBy(auth()->user());
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```blade
<div>
    <button wire:click="$js.bookmark" class="flex items-center gap-1">
        {{-- 외곽선 북마크 아이콘... --}}
        <svg wire:show="!bookmarked" wire:cloak xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>

        {{-- 채워진 북마크 아이콘... --}}
        <svg wire:show="bookmarked" wire:cloak xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
    </button>
</div>

@script
<script>
    $js('bookmark', () => {
        $wire.bookmarked = !$wire.bookmarked

        $wire.bookmarkPost()
    })
</script>
@endscript
```

사용자가 하트 버튼을 클릭하면 다음 순서로 동작합니다:

1. "bookmark" 자바스크립트 액션이 트리거됨
2. 하트 아이콘이 즉시 `$wire.bookmarked`를 토글하여 클라이언트 사이드에서 업데이트됨
3. `bookmarkPost()` 메서드가 호출되어 데이터베이스에 변경사항을 저장함

이렇게 하면 즉각적인 시각적 피드백을 제공하면서 북마크 상태가 올바르게 저장됩니다.

### Alpine에서 호출 {#calling-from-alpine}

Alpine에서 `$wire` 객체를 사용하여 자바스크립트 액션을 직접 호출할 수 있습니다. 예를 들어, `$wire` 객체를 사용해 `bookmark` 자바스크립트 액션을 호출할 수 있습니다:

```blade
<button x-on:click="$wire.$js.bookmark()">Bookmark</button>
```

### PHP에서 호출 {#calling-from-php}

자바스크립트 액션은 PHP에서 `js()` 메서드를 사용하여 호출할 수도 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = '';

    public function save()
    {
        // ...

        $this->js('onPostSaved'); // [!code highlight]
    }
}
```

```blade
<div>
    <!-- ... -->

    <button wire:click="save">Save</button>
</div>

@script
<script>
    $js('onPostSaved', () => {
        alert('Your post has been saved successfully!')
    })
</script>
@endscript
```

이 예제에서, `save()` 액션이 끝나면 `postSaved` 자바스크립트 액션이 실행되어 알림 대화상자가 표시됩니다.

## 매직 액션 {#magic-actions}

Livewire는 커스텀 메서드를 정의하지 않고도 컴포넌트에서 일반적인 작업을 수행할 수 있는 "매직" 액션을 제공합니다. 이 매직 액션은 Blade 템플릿에서 정의된 이벤트 리스너 내에서 사용할 수 있습니다.

### `$parent` {#parent}

`$parent` 매직 변수는 자식 컴포넌트에서 부모 컴포넌트의 속성에 접근하거나 액션을 호출할 수 있게 해줍니다:

```blade
<button wire:click="$parent.removePost({{ $post->id }})">Remove</button>
```

위 예제에서, 부모 컴포넌트에 `removePost()` 액션이 있다면, 자식은 Blade 템플릿에서 `$parent.removePost()`로 직접 호출할 수 있습니다.

### `$set` {#set}

`$set` 매직 액션은 Blade 템플릿에서 Livewire 컴포넌트의 속성을 직접 업데이트할 수 있게 해줍니다. `$set`을 사용하려면, 업데이트할 속성과 새 값을 인자로 전달하면 됩니다:

```blade
<button wire:click="$set('query', '')">Reset Search</button>
```

이 예제에서 버튼을 클릭하면, 컴포넌트의 `$query` 속성이 `''`로 설정되는 네트워크 요청이 전송됩니다.

### `$refresh` {#refresh}

`$refresh` 액션은 Livewire 컴포넌트를 다시 렌더링합니다. 속성 값을 변경하지 않고 컴포넌트의 뷰를 업데이트할 때 유용합니다:

```blade
<button wire:click="$refresh">Refresh</button>
```

버튼을 클릭하면 컴포넌트가 다시 렌더링되어, 뷰의 최신 변경사항을 볼 수 있습니다.

### `$toggle` {#toggle}

`$toggle` 액션은 Livewire 컴포넌트의 불리언 속성 값을 토글하는 데 사용됩니다:

```blade
<button wire:click="$toggle('sortAsc')">
    Sort {{ $sortAsc ? 'Descending' : 'Ascending' }}
</button>
```

이 예제에서 버튼을 클릭하면, 컴포넌트의 `$sortAsc` 속성이 `true`와 `false` 사이에서 토글됩니다.

### `$dispatch` {#dispatch}

`$dispatch` 액션을 사용하면 브라우저에서 Livewire 이벤트를 직접 디스패치할 수 있습니다. 아래는 클릭 시 `post-deleted` 이벤트를 디스패치하는 버튼 예제입니다:

```blade
<button type="submit" wire:click="$dispatch('post-deleted')">Delete Post</button>
```

### `$event` {#event}

`$event` 액션은 `wire:click`과 같은 이벤트 리스너 내에서 사용할 수 있습니다. 이 액션을 통해 실제로 트리거된 자바스크립트 이벤트에 접근할 수 있어, 트리거한 요소나 기타 관련 정보를 참조할 수 있습니다:

```blade
<input type="text" wire:keydown.enter="search($event.target.value)">
```

위 입력란에서 사용자가 입력 중 Enter 키를 누르면, 입력란의 내용이 `search()` 액션에 파라미터로 전달됩니다.

### Alpine에서 매직 액션 사용하기 {#using-magic-actions-from-alpine}

Alpine에서도 `$wire` 객체를 사용하여 매직 액션을 호출할 수 있습니다. 예를 들어, `$wire` 객체를 사용해 `$refresh` 매직 액션을 호출할 수 있습니다:

```blade
<button x-on:click="$wire.$refresh()">Refresh</button>
```

## 리렌더링 건너뛰기 {#skipping-re-renders}

때로는 액션이 호출되어도 렌더링된 Blade 템플릿에 영향을 주지 않는 부작용이 없는 경우가 있습니다. 이럴 때는 액션 메서드 위에 `#[Renderless]` 속성을 추가하여 Livewire의 라이프사이클에서 `render` 부분을 건너뛸 수 있습니다.

아래 `ShowPost` 컴포넌트에서, 사용자가 게시물의 맨 아래로 스크롤하면 "view count"가 기록됩니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Renderless;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post)
    {
        $this->post = $post;
    }

    #[Renderless] // [!code highlight]
    public function incrementViewCount()
    {
        $this->post->incrementViewCount();
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```blade
<div>
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->content }}</p>

    <div x-intersect="$wire.incrementViewCount()"></div>
</div>
```

위 예제는 [`x-intersect`](https://alpinejs.dev/plugins/intersect)를 사용합니다. 이 Alpine 유틸리티는 요소가 뷰포트에 들어올 때(주로 사용자가 아래로 스크롤할 때) 표현식을 호출합니다.

보시다시피, 사용자가 게시물의 맨 아래로 스크롤하면 `incrementViewCount()`가 호출됩니다. `#[Renderless]`가 액션에 추가되어 있으므로, 조회수는 기록되지만 템플릿은 리렌더링되지 않고 페이지의 어떤 부분도 영향을 받지 않습니다.

메서드 속성을 사용하지 않거나 렌더링을 조건부로 건너뛰고 싶다면, 컴포넌트 액션에서 `skipRender()` 메서드를 호출할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post)
    {
        $this->post = $post;
    }

    public function incrementViewCount()
    {
        $this->post->incrementViewCount();

        $this->skipRender(); // [!code highlight]
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

## 보안 문제 {#security-concerns}

Livewire 컴포넌트의 모든 public 메서드는, 해당 메서드를 호출하는 `wire:click` 핸들러가 없어도 클라이언트 사이드에서 호출될 수 있다는 점을 기억하세요. 이런 경우에도 사용자는 브라우저의 DevTools에서 액션을 트리거할 수 있습니다.

아래는 Livewire 컴포넌트에서 놓치기 쉬운 취약점의 세 가지 예시입니다. 각 예시는 먼저 취약한 컴포넌트를 보여주고, 그 다음 안전한 컴포넌트를 보여줍니다. 먼저 첫 번째 예시에서 취약점을 직접 찾아보는 연습을 해보세요.

취약점을 찾기 어렵고, 그로 인해 자신의 애플리케이션을 안전하게 유지할 수 있을지 걱정된다면, 이러한 취약점은 요청과 컨트롤러를 사용하는 표준 웹 애플리케이션에도 모두 적용된다는 점을 기억하세요. 컴포넌트 메서드를 컨트롤러 메서드의 프록시로, 파라미터를 요청 입력의 프록시로 사용한다면, 기존의 애플리케이션 보안 지식을 Livewire 코드에도 적용할 수 있습니다.

### 액션 파라미터는 항상 인증하세요 {#always-authorize-action-parameters}

컨트롤러 요청 입력과 마찬가지로, 액션 파라미터는 임의의 사용자 입력이므로 반드시 인증해야 합니다.

아래는 사용자가 한 페이지에서 자신의 모든 게시물을 볼 수 있는 `ShowPosts` 컴포넌트입니다. 사용자는 게시물의 "Delete" 버튼 중 하나를 사용해 원하는 게시물을 삭제할 수 있습니다.

취약한 컴포넌트의 예시는 다음과 같습니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">Delete</button>
        </div>
    @endforeach
</div>
```

악의적인 사용자는 자바스크립트 콘솔에서 `delete()`를 직접 호출하고 원하는 파라미터를 액션에 전달할 수 있다는 점을 기억하세요. 즉, 자신의 게시물을 보고 있는 사용자가 소유하지 않은 게시물의 ID를 `delete()`에 전달하여 다른 사용자의 게시물을 삭제할 수 있습니다.

이를 방지하려면, 삭제할 게시물의 소유권을 인증해야 합니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::find($id);

        $this->authorize('delete', $post); // [!code highlight]

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

### 서버 사이드에서 항상 인증하세요 {#always-authorize-server-side}

표준 Laravel 컨트롤러와 마찬가지로, Livewire 액션은 UI에서 액션을 호출할 수 있는 수단이 없어도 모든 사용자가 호출할 수 있습니다.

아래는 모든 사용자가 애플리케이션의 모든 게시물을 볼 수 있지만, 관리자만 게시물을 삭제할 수 있는 `BrowsePosts` 컴포넌트입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            @if (Auth::user()->isAdmin())
                <button wire:click="deletePost({{ $post->id }})">Delete</button>
            @endif
        </div>
    @endforeach
</div>
```

보시다시피, 관리자만 "Delete" 버튼을 볼 수 있지만, 모든 사용자가 브라우저의 DevTools에서 컴포넌트의 `deletePost()`를 호출할 수 있습니다.

이 취약점을 해결하려면, 다음과 같이 서버에서 액션을 인증해야 합니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) { // [!code highlight:3]
            abort(403);
        }

        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

이 변경으로, 이제 관리자만 이 컴포넌트에서 게시물을 삭제할 수 있습니다.

### 위험한 메서드는 protected 또는 private로 유지하세요 {#keep-dangerous-methods-protected-or-private}

Livewire 컴포넌트 내의 모든 public 메서드는 클라이언트에서 호출할 수 있습니다. `wire:click` 핸들러에서 참조하지 않은 메서드도 마찬가지입니다. 클라이언트에서 호출할 의도가 없는 메서드는 `protected` 또는 `private`로 지정해야 합니다. 이렇게 하면 해당 민감한 메서드의 가시성이 컴포넌트 클래스와 그 하위 클래스에만 제한되어, 클라이언트에서 호출할 수 없게 됩니다.

앞서 논의한 `BrowsePosts` 예제를 생각해봅시다. 사용자는 애플리케이션의 모든 게시물을 볼 수 있지만, 관리자만 게시물을 삭제할 수 있습니다. [서버 사이드에서 항상 인증하세요](/livewire/3.x/actions#always-authorize-server-side) 섹션에서 서버 사이드 인증을 추가하여 액션을 안전하게 만들었습니다. 이제 실제 게시물 삭제를 코드 단순화를 위해 별도의 메서드로 리팩터링했다고 가정해봅시다:

```php
// 경고: 이 코드는 이렇게 하면 안 된다는 예시입니다...
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        $this->delete($id); // [!code highlight]
    }

    public function delete($postId)  // [!code highlight:6]
    {
        $post = Post::find($postId);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="deletePost({{ $post->id }})">Delete</button>
        </div>
    @endforeach
</div>
```

보시다시피, 게시물 삭제 로직을 `delete()`라는 별도의 메서드로 리팩터링했습니다. 이 메서드는 템플릿 어디에서도 참조되지 않지만, 사용자가 그 존재를 알게 되면 public이기 때문에 브라우저의 DevTools에서 호출할 수 있습니다.

이를 해결하려면, 메서드를 `protected` 또는 `private`로 지정하면 됩니다. 이렇게 하면 사용자가 호출하려고 할 때 오류가 발생합니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        $this->delete($id);
    }

    protected function delete($postId) // [!code highlight]
    {
        $post = Post::find($postId);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

<!--
## 미들웨어 적용하기 {#applying-middleware}

기본적으로, Livewire는 최초 페이지 로드 요청에 미들웨어가 적용된 경우, 이후 요청에도 인증 및 권한 관련 미들웨어를 다시 적용합니다.

예를 들어, 컴포넌트가 `auth` 미들웨어가 할당된 라우트 내에 로드되고 사용자의 세션이 종료된 상황을 상상해보세요. 사용자가 다른 액션을 트리거하면, `auth` 미들웨어가 다시 적용되어 사용자는 에러를 받게 됩니다.

특정 액션에만 적용하고 싶은 미들웨어가 있다면, `#[Middleware]` 속성을 사용할 수 있습니다. 예를 들어, 게시물을 생성하는 액션에 `LogPostCreation` 미들웨어를 적용할 수 있습니다:

```php
<?php

namespace App\Livewire;

use App\Http\Middleware\LogPostCreation;
use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public $content;

    #[Middleware(LogPostCreation::class)] // [!code highlight]
    public function save()
    {
        // 게시물 생성...
    }

    // ...
}
```

이제 `LogPostCreation` 미들웨어는 `createPost` 액션에만 적용되어, 사용자가 새 게시물을 생성할 때만 활동이 기록됩니다.

-->
