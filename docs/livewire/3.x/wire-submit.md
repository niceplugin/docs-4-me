# wire:submit
Livewire는 `wire:submit` 지시어를 통해 폼 제출을 쉽게 처리할 수 있게 해줍니다. `<form>` 요소에 `wire:submit`을 추가하면, Livewire가 폼 제출을 가로채고 브라우저의 기본 동작을 방지한 뒤, Livewire 컴포넌트의 메서드를 호출합니다.

아래는 "게시글 생성" 폼 제출을 처리하기 위해 `wire:submit`을 사용하는 기본 예시입니다:

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

        $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save"> <!-- [tl! highlight] -->
    <input type="text" wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

위 예시에서 사용자가 "Save" 버튼을 클릭해 폼을 제출하면, `wire:submit`이 `submit` 이벤트를 가로채고 서버에서 `save()` 액션을 호출합니다.

> [!info] Livewire는 자동으로 `preventDefault()`를 호출합니다
> `wire:submit`은 내부적으로 `event.preventDefault()`를 호출하기 때문에, `.prevent` 수식어가 필요 없습니다. 이는 `submit` 이벤트를 감지할 때 기본 브라우저 동작(엔드포인트로의 전체 폼 제출)을 막지 않으려는 경우가 거의 없기 때문입니다.

> [!info] Livewire는 제출 중인 폼을 자동으로 비활성화합니다
> 기본적으로 Livewire가 폼 제출을 서버로 전송하는 동안, 폼의 제출 버튼을 비활성화하고 모든 폼 입력을 `readonly`로 표시합니다. 이렇게 하면 사용자가 최초 제출이 완료될 때까지 동일한 폼을 다시 제출할 수 없습니다.

## 더 깊이 들어가기 {#going-deeper}

`wire:submit`은 Livewire가 제공하는 많은 이벤트 리스너 중 하나일 뿐입니다. 다음 두 페이지에서 애플리케이션에서 `wire:submit`을 사용하는 방법에 대한 더 완전한 문서를 확인할 수 있습니다:

* [Livewire로 브라우저 이벤트에 응답하기](/livewire/3.x/actions)
* [Livewire에서 폼 생성하기](/livewire/3.x/forms)
