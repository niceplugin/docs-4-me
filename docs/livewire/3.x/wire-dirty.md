# [HTML지시문] wire:dirty
전통적인 HTML 페이지에서 폼은 사용자가 "제출" 버튼을 눌렀을 때만 제출됩니다.

하지만 Livewire는 전통적인 폼 제출 방식보다 훨씬 더 많은 기능을 제공합니다. 폼 입력값을 실시간으로 검증하거나, 사용자가 입력할 때마다 폼을 저장할 수도 있습니다.

이러한 "실시간" 업데이트 시나리오에서는, 폼 또는 폼의 일부가 변경되었지만 아직 데이터베이스에 저장되지 않았음을 사용자에게 알리는 것이 도움이 될 수 있습니다.

폼에 저장되지 않은 입력값이 있을 때, 해당 폼은 "더럽다(dirty)"고 간주됩니다. 네트워크 요청이 발생하여 서버 상태와 클라이언트 측 상태가 동기화될 때에만 "깨끗하다(clean)"고 간주됩니다.

## 기본 사용법 {#basic-usage}

Livewire를 사용하면 `wire:dirty` 지시어를 통해 페이지의 시각적 요소를 쉽게 토글할 수 있습니다.

요소에 `wire:dirty`를 추가하면, 클라이언트 측 상태가 서버 측 상태와 달라질 때만 해당 요소를 표시하도록 Livewire에 지시하는 것입니다.

예를 들어, 아래는 입력값이 저장되지 않았음을 사용자에게 알리는 "저장되지 않은 변경 사항..." 표시가 포함된 `UpdatePost` 폼의 예시입니다:

```blade
<form wire:submit="update">
    <input type="text" wire:model="title">

    <!-- ... -->

    <button type="submit">Update</button>

    <div wire:dirty>저장되지 않은 변경 사항...</div> <!-- [!code highlight] -->
</form>
```

"저장되지 않은 변경 사항..." 메시지에 `wire:dirty`가 추가되어 있기 때문에, 이 메시지는 기본적으로 숨겨집니다. 사용자가 폼 입력을 수정하기 시작하면 Livewire가 자동으로 메시지를 표시합니다.

사용자가 폼을 제출하면 서버와 클라이언트의 데이터가 다시 동기화되므로 메시지는 다시 사라집니다.

### 요소 제거하기 {#removing-elements}

`wire:dirty`에 `.remove` 수식어를 추가하면, 기본적으로 요소를 표시하고 컴포넌트가 "dirty" 상태일 때만 해당 요소를 숨길 수 있습니다:

```blade
<div wire:dirty.remove>데이터가 동기화되었습니다...</div>
```

## 속성 업데이트 타겟팅 {#targeting-property-updates}

사용자가 입력 필드를 벗어날 때 즉시 서버의 속성을 업데이트하기 위해 `wire:model.blur`을 사용하는 상황을 상상해보세요. 이 경우, `wire:dirty` 지시어가 포함된 요소에 `wire:target`을 추가하여 해당 속성에만 "변경됨" 표시를 제공할 수 있습니다.

다음은 title 속성이 변경되었을 때만 변경됨 표시를 보여주는 예시입니다:

```blade
<form wire:submit="update">
    <input wire:model.blur="title">

    <div wire:dirty wire:target="title">저장되지 않은 제목...</div> <!-- [!code highlight] -->

    <button type="submit">업데이트</button>
</form>
```

## 클래스 토글하기 {#toggling-classes}

전체 요소를 토글하는 대신, 입력값의 상태가 "dirty"일 때 개별 CSS 클래스를 토글하고 싶을 때가 많습니다.

아래는 사용자가 입력 필드에 타이핑하면 테두리가 노란색으로 바뀌어 "저장되지 않음" 상태를 나타내고, 사용자가 필드에서 탭으로 벗어나면 테두리가 사라져 서버에 상태가 저장되었음을 나타내는 예시입니다:

```blade
<input wire:model.blur="title" wire:dirty.class="border-yellow-500">
```

