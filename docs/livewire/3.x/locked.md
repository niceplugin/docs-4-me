# 잠긴 속성
Livewire 속성은 `wire:model`과 같은 유틸리티를 사용하여 프론트엔드와 백엔드 모두에서 자유롭게 수정할 수 있습니다. 만약 모델 ID와 같은 속성이 프론트엔드에서 수정되는 것을 방지하고 싶다면, Livewire의 `#[Locked]` 속성을 사용할 수 있습니다.

## 기본 사용법 {#basic-usage}

아래는 `ShowPost` 컴포넌트로, `Post` 모델의 ID를 `$id`라는 public 프로퍼티에 저장합니다. 이 프로퍼티가 호기심 많거나 악의적인 사용자에 의해 수정되는 것을 방지하려면, 해당 프로퍼티에 `#[Locked]` 속성을 추가할 수 있습니다:

> [!warning] 속성 클래스 임포트 필수
> 모든 속성 클래스를 반드시 임포트해야 합니다. 예를 들어, 아래의 `#[Locked]` 속성을 사용하려면 `use Livewire\Attributes\Locked;`를 추가해야 합니다.
```php
use Livewire\Attributes\Locked;
use Livewire\Component;

class ShowPost extends Component
{
	#[Locked] // [!code highlight]
    public $id;

    public function mount($postId)
    {
        $this->id = $postId;
    }

	// ...
}
```

`#[Locked]` 속성을 추가하면, `$id` 프로퍼티가 절대 변조되지 않도록 보장할 수 있습니다.

> [!tip] 모델 프로퍼티는 기본적으로 안전합니다
> 모델의 ID만 public 프로퍼티에 저장하는 대신, Eloquent 모델 자체를 public 프로퍼티에 저장하면 Livewire가 해당 ID가 변조되지 않도록 자동으로 보장해줍니다. 이 경우, 별도로 `#[Locked]` 속성을 추가할 필요가 없습니다. 대부분의 경우, 이 방법이 `#[Locked]`를 사용하는 것보다 더 좋은 접근 방식입니다:
> ```php
> class ShowPost extends Component
> {
>    public Post $post; // [!code highlight]
>
>    public function mount($postId)
>    {
>        $this->post = Post::find($postId);
>    }
>
>	// ...
>}
> ```

### 왜 protected 속성을 사용하지 않을까요? {#why-not-use-protected-properties}

혹시 이런 의문이 들 수 있습니다: 민감한 데이터를 위해 protected 속성만 사용하면 안 될까요?

기억하세요, Livewire는 네트워크 요청 간에 public 속성만을 유지합니다. 정적이고 하드코딩된 데이터의 경우 protected 속성이 적합합니다. 하지만 런타임에 저장되는 데이터의 경우, 데이터가 제대로 유지되도록 public 속성을 반드시 사용해야 합니다.

### Livewire가 이 작업을 자동으로 할 수는 없나요? {#cant-livewire-do-this-automatically}

완벽한 세상이라면, Livewire는 기본적으로 속성을 잠그고, 해당 속성이 `wire:model`로 사용될 때만 수정할 수 있도록 허용할 것입니다.

안타깝게도, 이를 위해서는 Livewire가 모든 Blade 템플릿을 파싱하여 해당 속성이 `wire:model`이나 유사한 API에 의해 수정되는지 이해해야 합니다.

이렇게 하면 기술적, 성능적 오버헤드가 추가될 뿐만 아니라, Alpine이나 기타 커스텀 JavaScript와 같이 속성이 변경되는 경우를 감지하는 것은 불가능합니다.

따라서 Livewire는 기본적으로 public 속성을 자유롭게 수정할 수 있도록 유지하며, 개발자에게 필요에 따라 이를 잠글 수 있는 도구를 제공합니다.
