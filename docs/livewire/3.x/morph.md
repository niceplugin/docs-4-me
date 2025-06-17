# 모핑
Livewire 컴포넌트가 브라우저의 DOM을 업데이트할 때, 이를 "모핑(morphing)"이라고 부르는 지능적인 방식으로 처리합니다. _모프(morph)_라는 용어는 _교체(replace)_와는 대조적인 의미입니다.

컴포넌트가 업데이트될 때마다 기존 HTML을 새로 렌더링된 HTML로 _교체_하는 대신, Livewire는 현재 HTML과 새로운 HTML을 동적으로 비교하여 차이점을 식별하고, 변경이 필요한 부분에만 정밀하게 HTML을 수정합니다.

이 방식의 장점은 컴포넌트 내에서 기존의 변경되지 않은 요소들을 보존할 수 있다는 점입니다. 예를 들어, 이벤트 리스너, 포커스 상태, 폼 입력 값 등이 Livewire 업데이트 사이에도 그대로 유지됩니다. 물론, 모핑은 매번 DOM을 완전히 지우고 새로 렌더링하는 것에 비해 성능도 향상됩니다.

## 변형(morphing)이 작동하는 방식 {#how-morphing-works}

Livewire가 Livewire 요청 간에 어떤 요소를 업데이트할지 결정하는 방식을 이해하려면, 이 간단한 `Todos` 컴포넌트를 살펴보세요:

```php
class Todos extends Component
{
    public $todo = '';

    public $todos = [
        'first',
        'second',
    ];

    public function add()
    {
        $this->todos[] = $this->todo;
    }
}
```

```blade
<form wire:submit="add">
    <ul>
        @foreach ($todos as $item)
            <li>{{ $item }}</li>
        @endforeach
    </ul>

    <input wire:model="todo">
</form>
```

이 컴포넌트의 초기 렌더링 결과는 다음과 같은 HTML을 출력합니다:

```html
<form wire:submit="add">
    <ul>
        <li>first</li>

        <li>second</li>
    </ul>

    <input wire:model="todo">
</form>
```

이제 입력 필드에 "third"를 입력하고 `[Enter]` 키를 눌렀다고 가정해봅시다. 새로 렌더링된 HTML은 다음과 같습니다:

```html
<form wire:submit="add">
    <ul>
        <li>first</li>

        <li>second</li>

        <li>third</li> <!-- [tl! add] -->
    </ul>

    <input wire:model="todo">
</form>
```

Livewire가 컴포넌트 업데이트를 처리할 때, 원래의 DOM을 새로 렌더링된 HTML로 _변형(morph)_ 합니다. 다음 시각화는 이 과정이 어떻게 동작하는지 직관적으로 이해할 수 있도록 도와줍니다:

[//]: # (<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/844600772?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="morph_basic"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>)

보시다시피, Livewire는 두 HTML 트리를 동시에 순회합니다. 각 트리에서 요소를 만날 때마다 변경, 추가, 삭제 여부를 비교합니다. 변경 사항이 감지되면, 해당 부분만 외과적으로 적절하게 수정합니다.

## 변형의 한계점 {#morphing-shortcomings}

다음은 변형 알고리즘이 HTML 트리의 변경 사항을 올바르게 식별하지 못해 애플리케이션에 문제가 발생하는 시나리오입니다.

### 중간 요소 삽입하기 {#inserting-intermediate-elements}

다음은 가상의 `CreatePost` 컴포넌트에 대한 Livewire Blade 템플릿입니다:

```blade
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    @if ($errors->has('title'))
        <div>{{ $errors->first('title') }}</div>
    @endif

    <div>
        <button>Save</button>
    </div>
</form>
```

사용자가 폼을 제출하려고 시도했지만 유효성 검사 오류가 발생하면 다음과 같은 문제가 발생합니다:

[//]: # (<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/844600840?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="morph_problem"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>)

보시다시피, Livewire가 오류 메시지용 새로운 `<div>`를 만나면, 기존 `<div>`를 제자리에서 변경해야 할지, 아니면 중간에 새로운 `<div>`를 삽입해야 할지 알지 못합니다.

무슨 일이 일어나고 있는지 좀 더 명확하게 설명하면 다음과 같습니다:

* Livewire는 두 트리 모두에서 첫 번째 `<div>`를 만납니다. 동일하므로 계속 진행합니다.
* Livewire는 두 번째 `<div>`를 두 트리 모두에서 만나고, 동일한 `<div>`라고 생각합니다. 단지 내용만 바뀌었다고 판단합니다. 그래서 오류 메시지를 새로운 요소로 삽입하는 대신, `<button>`을 오류 메시지로 변경합니다.
* Livewire는 이전 요소를 잘못 수정한 후, 비교의 끝에서 추가 요소가 있음을 발견합니다. 그런 다음 해당 요소를 생성하여 이전 요소 뒤에 추가합니다.
* 따라서, 단순히 이동되어야 할 요소를 파괴했다가 다시 생성하게 됩니다.

이 시나리오는 거의 모든 morph 관련 버그의 근본 원인입니다.

이러한 버그로 인해 발생할 수 있는 몇 가지 구체적인 문제점은 다음과 같습니다:
* 업데이트 사이에 이벤트 리스너와 요소 상태가 손실됨
* 이벤트 리스너와 상태가 잘못된 요소에 배치됨
* 전체 Livewire 컴포넌트가 리셋되거나 중복될 수 있음 (Livewire 컴포넌트도 DOM 트리의 단순한 요소이기 때문)
* Alpine 컴포넌트와 상태가 손실되거나 잘못 배치될 수 있음

다행히도, Livewire는 다음과 같은 접근 방식을 통해 이러한 문제를 완화하기 위해 많은 노력을 기울였습니다:

### 내부 룩어헤드 {#internal-look-ahead}

Livewire는 변형 알고리즘에 추가 단계로, 요소를 변경하기 전에 이후 요소와 그 내용을 확인합니다.

이로 인해 위와 같은 상황이 많은 경우에서 방지됩니다.

다음은 "룩어헤드" 알고리즘이 동작하는 모습을 시각화한 예시입니다:

[//]: # (<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/844600800?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="morph_lookahead"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>)

### Morph 마커 주입하기 {#injecting-morph-markers}

백엔드에서 Livewire는 Blade 템플릿 내부의 조건문을 자동으로 감지하고, Livewire의 JavaScript가 morphing 시 가이드로 사용할 수 있도록 HTML 주석 마커로 감쌉니다.

다음은 Livewire가 마커를 주입한 이전 Blade 템플릿의 예시입니다:

```blade
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    <!--[if BLOCK]><![endif]--> <!-- [tl! highlight] -->
    @if ($errors->has('title'))
        <div>Error: {{ $errors->first('title') }}</div>
    @endif
    <!--[if ENDBLOCK]><![endif]--> <!-- [tl! highlight] -->

    <div>
        <button>Save</button>
    </div>
</form>
```

이러한 마커가 템플릿에 주입되면, Livewire는 변경과 추가의 차이를 더 쉽게 감지할 수 있습니다.

이 기능은 Livewire 애플리케이션에 매우 유용하지만, 정규식을 통해 템플릿을 파싱해야 하므로 때때로 조건문을 제대로 감지하지 못할 수 있습니다. 만약 이 기능이 애플리케이션에 도움이 되기보다는 방해가 된다면, 애플리케이션의 `config/livewire.php` 파일에서 다음 설정으로 비활성화할 수 있습니다:

```php
'inject_morph_markers' => false,
```

#### 조건문 래핑하기 {#wrapping-conditionals}

위의 두 가지 해결책이 상황에 맞지 않는다면, 변형(morphing) 문제를 가장 확실하게 피하는 방법은 조건문과 반복문을 항상 존재하는 자체 요소로 감싸는 것입니다.

예를 들어, 아래 Blade 템플릿을 래핑된 `<div>` 요소로 다시 작성하면 다음과 같습니다:

```blade
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    <div> <!-- [tl! highlight] -->
        @if ($errors->has('title'))
            <div>{{ $errors->first('title') }}</div>
        @endif
    </div> <!-- [tl! highlight] -->

    <div>
        <button>Save</button>
    </div>
</form>
```

이제 조건문이 항상 존재하는 요소로 감싸졌기 때문에, Livewire는 두 개의 서로 다른 HTML 트리를 올바르게 변형(morph)할 수 있습니다.

#### 모핑 우회하기 {#bypassing-morphing}

요소에 대해 모핑을 완전히 우회해야 하는 경우, [wire:replace](/livewire/3.x/wire-replace)를 사용하여 Livewire가 기존 요소를 모핑하려고 시도하는 대신 해당 요소의 모든 자식을 교체하도록 지시할 수 있습니다.