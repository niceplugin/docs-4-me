# wire:loading
로딩 인디케이터는 좋은 사용자 인터페이스를 만드는 데 중요한 요소입니다. 로딩 인디케이터는 서버에 요청이 진행 중일 때 사용자에게 시각적인 피드백을 제공하여, 사용자가 어떤 프로세스가 완료되기를 기다리고 있음을 알 수 있게 해줍니다.

## 기본 사용법 {#basic-usage}

Livewire는 로딩 인디케이터를 제어하기 위한 간단하면서도 매우 강력한 문법인 `wire:loading`을 제공합니다. 어떤 요소에든 `wire:loading`을 추가하면 해당 요소는 기본적으로 숨겨지며(CSS의 `display: none` 사용), 서버로 요청이 전송될 때 표시됩니다.

아래는 `wire:loading`을 사용하여 로딩 메시지를 토글하는 `CreatePost` 컴포넌트의 폼 기본 예시입니다:

```blade
<form wire:submit="save">
    <!-- ... -->

    <button type="submit">저장</button>

    <div wire:loading> <!-- [!code highlight:2] -->
        게시글 저장 중...
    </div>
</form>
```

사용자가 "저장" 버튼을 누르면, "게시글 저장 중..." 메시지가 버튼 아래에 표시되며 "save" 액션이 실행되는 동안 나타납니다. 서버로부터 응답을 받고 Livewire가 처리하면 메시지는 사라집니다.

### 요소 제거하기 {#removing-elements}

반대로, `.remove`를 추가하여 기본적으로 요소를 표시하고 서버에 요청하는 동안 숨길 수 있습니다:

```blade
<div wire:loading.remove>...</div>
```

## 클래스 토글하기 {#toggling-classes}

전체 요소의 표시 여부를 토글하는 것 외에도, 서버에 요청하는 동안 기존 요소의 CSS 클래스를 토글하여 스타일을 변경하는 것이 종종 유용합니다. 이 기법은 배경색 변경, 불투명도 낮추기, 회전 애니메이션 트리거 등 다양한 용도로 사용할 수 있습니다.

아래는 [Tailwind](https://tailwindcss.com/)의 `opacity-50` 클래스를 사용하여 폼이 제출되는 동안 "Save" 버튼을 더 흐리게 만드는 간단한 예시입니다:

```blade
<button wire:loading.class="opacity-50">Save</button>
```

요소를 토글하는 것과 마찬가지로, `wire:loading` 디렉티브에 `.remove`를 추가하여 반대로 클래스를 제거할 수도 있습니다. 아래 예시에서는 "Save" 버튼을 누르면 버튼의 `bg-blue-500` 클래스가 제거됩니다:

```blade
<button class="bg-blue-500" wire:loading.class.remove="bg-blue-500">
    Save
</button>
```

## 속성 토글하기 {#toggling-attributes}

기본적으로 폼이 제출되면, Livewire는 폼이 처리되는 동안 자동으로 제출 버튼을 비활성화하고 각 입력 요소에 `readonly` 속성을 추가합니다.

하지만 이러한 기본 동작 외에도, Livewire는 `.attr` 수식어를 제공하여 요소의 다른 속성을 토글하거나 폼 외부의 요소에 속성을 토글할 수 있도록 합니다:

```blade
<button
    type="button"
    wire:click="remove"
    wire:loading.attr="disabled"
>
    Remove
</button>
```

위 버튼은 제출 버튼이 아니기 때문에, 눌렀을 때 Livewire의 기본 폼 처리 동작에 의해 비활성화되지 않습니다. 대신, 우리가 직접 `wire:loading.attr="disabled"`를 추가하여 이 동작을 구현했습니다.

## 특정 액션 지정하기 {#targeting-specific-actions}

기본적으로 `wire:loading`은 컴포넌트가 서버에 요청을 보낼 때마다 트리거됩니다.

하지만 여러 요소가 서버 요청을 트리거할 수 있는 컴포넌트에서는 로딩 인디케이터를 개별 액션에 한정하는 것이 좋습니다.

예를 들어, 아래의 "게시글 저장" 폼을 살펴보세요. 폼을 제출하는 "저장" 버튼 외에도, 컴포넌트에서 "remove" 액션을 실행하는 "삭제" 버튼이 있을 수 있습니다.

아래의 `wire:loading` 요소에 `wire:target`을 추가하면, Livewire가 "삭제" 버튼이 클릭될 때만 로딩 메시지를 표시하도록 할 수 있습니다:

```blade
<form wire:submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" wire:click="remove">Remove</button>

    <div wire:loading wire:target="remove">  <!-- [!code highlight:2] -->
        Removing post...
    </div>
</form>
```

위의 "Remove" 버튼을 누르면 "Removing post..." 메시지가 사용자에게 표시됩니다. 하지만 "Save" 버튼을 눌렀을 때는 이 메시지가 표시되지 않습니다.

### 여러 액션 타겟팅하기 {#targeting-multiple-actions}

페이지에서 모든 액션이 아닌 일부 액션에만 `wire:loading`이 반응하도록 하고 싶을 때가 있을 수 있습니다. 이런 경우에는 `wire:target`에 여러 액션을 쉼표로 구분하여 전달할 수 있습니다. 예를 들어:

```blade
<form wire:submit="save">
    <input type="text" wire:model.blur="title">

    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" wire:click="remove">Remove</button>

    <div wire:loading wire:target="save, remove">  <!-- [!code highlight:2] -->
        Updating post...
    </div>
</form>
```

이제 로딩 인디케이터("Updating post...")는 "Remove" 또는 "Save" 버튼이 눌렸을 때만 표시되고, `$title` 필드가 서버로 전송될 때는 표시되지 않습니다.

### 액션 파라미터 타겟팅 {#targeting-action-parameters}

페이지의 여러 위치에서 동일한 액션이 서로 다른 파라미터로 트리거되는 상황에서는, 추가 파라미터를 전달하여 `wire:target`의 범위를 특정 액션으로 더 좁힐 수 있습니다. 예를 들어, 페이지의 각 게시글마다 "Remove" 버튼이 있는 다음과 같은 상황을 생각해봅시다:

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h2>{{ $post->title }}</h2>

            <button wire:click="remove({{ $post->id }})">Remove</button>

            <div wire:loading wire:target="remove({{ $post->id }})">  <!-- [!code highlight:2] -->
                Removing post...
            </div>
        </div>
    @endforeach
</div>
```

`wire:target="remove"`에 <span v-pre>`{{ $post->id }}`</span>를 전달하지 않으면, 페이지의 어떤 버튼이 클릭되더라도 "Removing post..." 메시지가 표시됩니다.

하지만 각 `wire:target` 인스턴스에 고유한 파라미터를 전달하면, Livewire는 해당 파라미터가 "remove" 액션에 전달될 때만 로딩 메시지를 표시합니다.

### 속성 업데이트 타겟팅 {#targeting-property-updates}

Livewire는 또한 `wire:target` 지시어에 속성 이름을 전달하여 특정 컴포넌트 속성 업데이트만 타겟팅할 수 있습니다.

아래 예시에서는 `username`이라는 폼 입력이 `wire:model.live`를 사용하여 사용자가 입력할 때 실시간으로 유효성 검사를 수행합니다:

```blade
<form wire:submit="save">
    <input type="text" wire:model.live="username">
    @error('username') <span>{{ $message }}</span> @enderror

    <div wire:loading wire:target="username"> <!-- [!code highlight:2] -->
        사용자 이름 사용 가능 여부 확인 중...
    </div>

    <!-- ... -->
</form>
```

"사용자 이름 사용 가능 여부 확인 중..." 메시지는 사용자가 입력 필드에 값을 입력할 때 서버에 새로운 사용자 이름이 업데이트되는 동안 표시됩니다.

### 특정 로딩 타겟 제외하기 {#excluding-specific-loading-targets}

때때로 모든 Livewire 요청에 대해 로딩 인디케이터를 표시하고 싶지만, 특정 프로퍼티나 액션만은 _제외_ 하고 싶을 수 있습니다. 이런 경우에는 `wire:target.except` 수식어를 다음과 같이 사용할 수 있습니다:

```blade
<div wire:loading wire:target.except="download">...</div>
```

위의 로딩 인디케이터는 컴포넌트에서 "download" 액션을 제외한 모든 Livewire 업데이트 요청에 대해 표시됩니다.

## CSS display 속성 커스터마이징 {#customizing-css-display-property}

`wire:loading`이 요소에 추가되면, Livewire는 해당 요소의 CSS `display` 속성을 업데이트하여 요소를 표시하거나 숨깁니다. 기본적으로 Livewire는 숨길 때 `none`, 표시할 때는 `inline-block`을 사용합니다.

만약 아래 예시처럼 `inline-block`이 아닌 다른 display 값을 사용하는 요소(예: `flex`)를 토글하려면, `wire:loading`에 `.flex`를 추가할 수 있습니다:

```blade
<div class="flex" wire:loading.flex>...</div>
```

아래는 사용 가능한 display 값의 전체 목록입니다:

```blade
<div wire:loading.inline-flex>...</div>
<div wire:loading.inline>...</div>
<div wire:loading.block>...</div>
<div wire:loading.table>...</div>
<div wire:loading.flex>...</div>
<div wire:loading.grid>...</div>
```

## 로딩 인디케이터 지연시키기 {#delaying-a-loading-indicator}

빠른 인터넷 연결에서는 업데이트가 너무 빨리 일어나기 때문에 로딩 인디케이터가 화면에 잠깐 깜빡였다가 바로 사라지는 경우가 많습니다. 이런 경우 인디케이터는 도움이 되기보다는 오히려 산만하게 느껴질 수 있습니다.

이런 이유로, Livewire는 인디케이터 표시를 지연시키는 `.delay` 수식어를 제공합니다. 예를 들어, 아래와 같이 요소에 `wire:loading.delay`를 추가하면:

```blade
<div wire:loading.delay>...</div>
```

위 요소는 요청이 200밀리초를 초과할 때만 나타납니다. 요청이 그 전에 완료되면 사용자는 인디케이터를 볼 수 없습니다.

로딩 인디케이터의 지연 시간을 커스터마이즈하려면, Livewire에서 제공하는 다양한 간격 별칭을 사용할 수 있습니다:

```blade
<div wire:loading.delay.shortest>...</div> <!-- 50ms -->
<div wire:loading.delay.shorter>...</div>  <!-- 100ms -->
<div wire:loading.delay.short>...</div>    <!-- 150ms -->
<div wire:loading.delay>...</div>          <!-- 200ms -->
<div wire:loading.delay.long>...</div>     <!-- 300ms -->
<div wire:loading.delay.longer>...</div>   <!-- 500ms -->
<div wire:loading.delay.longest>...</div>  <!-- 1000ms -->
```
