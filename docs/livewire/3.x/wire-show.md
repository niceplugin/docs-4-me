# wire:show
Livewire의 `wire:show` 지시문은 표현식의 결과에 따라 요소를 쉽게 표시하거나 숨길 수 있게 해줍니다.

`wire:show` 지시문은 Blade에서 `@if`를 사용하는 것과 다르게, 요소를 DOM에서 완전히 제거하는 대신 CSS(`display: none`)를 사용하여 요소의 가시성을 전환합니다. 즉, 요소가 페이지에 남아 있지만 숨겨지므로 서버 왕복 없이 더 부드러운 전환이 가능합니다.

## 기본 사용법 {#basic-usage}

다음은 `wire:show`를 사용하여 "게시글 작성" 모달을 토글하는 실용적인 예시입니다:

```php
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $showModal = false;

    public $content = '';

    public function save()
    {
        Post::create(['content' => $this->content]);

        $this->reset('content');

        $this->showModal = false;
    }
}
```

```blade
<div>
    <button x-on:click="$wire.showModal = true">새 게시글</button>

    <div wire:show="showModal">
        <form wire:submit="save">
            <textarea wire:model="content"></textarea>

            <button type="submit">게시글 저장</button>
        </form>
    </div>
</div>
```

"새 게시글 작성" 버튼을 클릭하면 서버로의 왕복 없이 모달이 나타납니다. 게시글 저장에 성공하면 모달이 숨겨지고 폼이 초기화됩니다.

## 트랜지션 사용하기 {#using-transitions}

`wire:show`를 Alpine.js 트랜지션과 결합하여 부드러운 표시/숨김 애니메이션을 만들 수 있습니다. `wire:show`는 CSS의 `display` 속성만 토글하기 때문에, Alpine의 `x-transition` 지시어와 완벽하게 호환됩니다:

```blade
<div>
    <button x-on:click="$wire.showModal = true">새 글 작성</button>

    <div wire:show="showModal" x-transition.duration.500ms>
        <form wire:submit="save">
            <textarea wire:model="content"></textarea>
            <button type="submit">글 저장</button>
        </form>
    </div>
</div>
```

위의 Alpine.js 트랜지션 클래스는 모달이 표시되고 숨겨질 때 페이드 및 스케일 효과를 만듭니다.

[전체 x-transition 문서 보기 →](https://alpinejs.dev/directives/transition)
