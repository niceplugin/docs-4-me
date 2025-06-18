# [HTML지시문] wire:text
`wire:text`는 컴포넌트의 프로퍼티나 표현식을 기반으로 요소의 텍스트 내용을 동적으로 업데이트하는 디렉티브입니다. Blade의 `{{ }}` 문법을 사용하는 것과 달리, `wire:text`는 컴포넌트를 다시 렌더링하기 위한 네트워크 왕복 없이 내용을 업데이트합니다.

Alpine의 `x-text` 디렉티브에 익숙하다면, 두 디렉티브는 본질적으로 동일합니다.

## 기본 사용법 {#basic-usage}

다음은 `wire:text`를 사용하여 네트워크 왕복을 기다리지 않고 Livewire 속성의 업데이트를 낙관적으로 표시하는 예시입니다.

```php
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $likes;

    public function mount()
    {
        $this->likes = $this->post->like_count;
    }

    public function like()
    {
        $this->post->like();

        $this->likes = $this->post->fresh()->like_count;
    }
}
```

```blade
<div>
    <button x-on:click="$wire.likes++" wire:click="like">❤️ 좋아요</button>

    좋아요: <span wire:text="likes"></span>
</div>
```

버튼을 클릭하면 `$wire.likes++`가 `wire:text`를 통해 표시된 개수를 즉시 업데이트하고, `wire:click="like"`는 백그라운드에서 데이터베이스에 변경 사항을 반영합니다.

이 패턴 덕분에 `wire:text`는 Livewire에서 낙관적 UI를 구축하는 데 완벽하게 사용할 수 있습니다.
