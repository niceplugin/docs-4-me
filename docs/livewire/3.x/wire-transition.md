# wire:transition
## 기본 사용법 {#basic-usage}

Livewire에서 콘텐츠를 표시하거나 숨기는 것은 `@if`와 같은 Blade의 조건부 지시문을 사용하는 것만큼 간단합니다. 사용자 경험을 향상시키기 위해, Livewire는 조건부 요소를 페이지 안팎으로 부드럽게 전환할 수 있도록 해주는 `wire:transition` 지시문을 제공합니다.

예를 들어, 아래는 댓글 보기 토글 기능이 있는 `ShowPost` 컴포넌트입니다:

```php
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $showComments = false;
}
```

```blade
<div>
    <!-- ... -->

    <button wire:click="$set('showComments', true)">댓글 보기</button>

    @if ($showComments)
        <div wire:transition> <!-- [!code highlight] -->
            @foreach ($post->comments as $comment)
                <!-- ... -->
            @endforeach
        </div>
    @endif
</div>
```
`wire:transition`이 게시글의 댓글을 감싸는 `<div>`에 추가되어 있기 때문에, "댓글 보기" 버튼을 누르면 `$showComments`가 `true`로 설정되고, 댓글이 갑자기 나타나는 대신 페이지에 "페이드 인"되어 표시됩니다.

## 제한 사항 {#limitations}

현재 `wire:transition`은 `@if`와 같은 Blade 조건문 내부의 단일 요소에서만 지원됩니다. 형제 요소 목록에 사용하면 예상대로 동작하지 않습니다. 예를 들어, 아래와 같은 코드는 제대로 동작하지 않습니다:

```blade
<!-- 경고: 아래 코드는 제대로 동작하지 않습니다 -->
<ul>
    @foreach ($post->comments as $comment)
        <li wire:transition wire:key="{{ $comment->id }}">{{ $comment->content }}</li>
    @endforeach
</ul>
```

위의 댓글 `<li>` 요소 중 하나가 제거된다면, Livewire가 해당 요소를 전환하여 사라지게 할 것이라 기대할 수 있습니다. 하지만 Livewire의 내부 "morph" 메커니즘의 한계로 인해, 실제로는 그렇지 않습니다. 현재 Livewire에서는 `wire:transition`을 사용하여 동적 리스트를 전환하는 방법이 없습니다.

## 기본 전환 스타일 {#default-transition-style}

기본적으로 Livewire는 `wire:transition`이 적용된 요소에 불투명도(opacity)와 크기(scale) CSS 전환을 모두 적용합니다. 아래는 시각적 미리보기입니다:

<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        전환 미리보기 <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            &nbsp;
        </div>
    </div>
</div>

위 전환은 기본적으로 다음과 같은 값을 사용합니다:

전환 In | 전환 Out
--- | ---
`duration: 150ms` | `duration: 75ms`
`opacity: [0 - 100]` | `opacity: [100 - 0]`
`transform: scale([0.95 - 1])` | `transform: scale([1 - 0.95])`

## 전환 커스터마이징 {#customizing-transitions}

전환 시 Livewire가 내부적으로 사용하는 CSS를 커스터마이징하려면, 사용 가능한 다양한 수식어(modifier)를 조합하여 사용할 수 있습니다:

수식어 | 설명
--- | ---
`.in` | 요소가 "나타날 때"만 전환
`.out` | 요소가 "사라질 때"만 전환
`.duration.[?]ms` | 전환 지속 시간을 밀리초 단위로 지정
`.duration.[?]s` | 전환 지속 시간을 초 단위로 지정
`.delay.[?]ms` | 전환 지연 시간을 밀리초 단위로 지정
`.delay.[?]s` | 전환 지연 시간을 초 단위로 지정
`.opacity` | 불투명도 전환만 적용
`.scale` | 크기 전환만 적용
`.origin.[top\|bottom\|left\|right]` | 사용할 크기 "기준점"을 지정

아래는 이러한 커스터마이징을 더 잘 시각화할 수 있도록 다양한 전환 조합 예시입니다:

**페이드 전용 전환**

기본적으로 Livewire는 전환 시 요소를 페이드와 스케일 모두 적용합니다. `.opacity` 수식어를 추가하면 스케일을 비활성화하고 페이드만 적용할 수 있습니다. 이는 전체 페이지 오버레이와 같이 스케일 효과가 어울리지 않는 경우에 유용합니다.

```html
<div wire:transition.opacity>
```

<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        전환 미리보기 <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.opacity
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>

**페이드 아웃 전환**

일반적인 전환 기법 중 하나는 요소가 나타날 때는 즉시 표시하고, 사라질 때는 불투명도를 페이드 아웃시키는 것입니다. 이 효과는 대부분의 MacOS 기본 드롭다운 및 메뉴에서 볼 수 있습니다. 따라서 웹에서도 드롭다운, 팝오버, 메뉴 등에 자주 적용됩니다.

```html
<div wire:transition.out.opacity.duration.200ms>
```

<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        전환 미리보기 <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.out.opacity.duration.200ms
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>

**origin-top 전환**

Livewire로 드롭다운 메뉴와 같은 요소를 전환할 때, 기본값(가운데) 대신 메뉴의 상단을 기준점(origin)으로 스케일 인하는 것이 자연스럽습니다. 이렇게 하면 메뉴가 트리거한 요소에 시각적으로 고정된 느낌을 줍니다.

```html
<div wire:transition.scale.origin.top>
```

<div x-data="{ show: false }" x-cloak class="border border-gray-700 rounded-xl p-6 w-full flex justify-between">
    <a href="#" x-on:click.prevent="show = ! show" class="py-2.5 outline-none">
        전환 미리보기 <span x-text="show ? 'out' : 'in →'">in</span>
    </a>
    <div class="hey">
        <div
            x-show="show"
            x-transition.origin.top
            class="inline-flex px-16 py-2.5 rounded-[10px] bg-pink-400 text-white uppercase font-medium transition focus-visible:outline-none focus-visible:!ring-1 focus-visible:!ring-white"
            style="
                background: linear-gradient(109.48deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%), #EE5D99;
                box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.5), inset 0px 1px 0px rgba(255, 255, 255, 0.1);
            "
        >
            ...
        </div>
    </div>
</div>

> [!tip] Livewire는 내부적으로 Alpine 전환을 사용합니다
> 요소에 `wire:transition`을 사용할 때, Livewire는 내부적으로 Alpine의 `x-transition` 지시문을 적용합니다. 따라서 일반적으로 `x-transition`에서 사용할 수 있는 대부분의 문법을 사용할 수 있습니다. 모든 기능은 [Alpine의 전환 문서](https://alpinejs.dev/directives/transition)를 참고하세요.

