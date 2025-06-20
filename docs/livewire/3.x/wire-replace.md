# wire:replace
Livewire의 DOM diffing은 페이지의 기존 요소를 업데이트하는 데 유용하지만, 때때로 내부 상태를 재설정하기 위해 일부 요소를 처음부터 다시 렌더링해야 할 필요가 있습니다.

이러한 경우, `wire:replace` 지시어를 사용하여 Livewire에게 해당 요소의 자식들에 대해 DOM diffing을 건너뛰고, 대신 서버에서 전달된 새로운 요소들로 내용을 완전히 교체하도록 지시할 수 있습니다.

이 기능은 서드파티 자바스크립트 라이브러리나 커스텀 웹 컴포넌트와 함께 작업할 때, 또는 요소 재사용이 상태 유지에 문제를 일으킬 수 있을 때 가장 유용합니다.

아래는 웹 컴포넌트를 shadow DOM `wire:replace`로 감싸서 Livewire가 해당 요소를 완전히 교체하게 하여 커스텀 요소가 자체 라이프사이클을 관리할 수 있도록 하는 예시입니다:

```blade
<form>
    <!-- ... -->

    <div wire:replace>
        <!-- 이 커스텀 요소는 자체 내부 상태를 가질 수 있습니다 -->
        <json-viewer>@json($someProperty)</json-viewer>
    </div>

    <!-- ... -->
</form>
```

또한, `wire:replace.self`를 사용하여 Livewire가 대상 요소 자체와 모든 자식 요소를 교체하도록 지시할 수도 있습니다.

```blade
<div x-data="{open: false}" wire:replace.self>
  <!-- 각 렌더링 시 "open" 상태가 false로 재설정되도록 보장합니다 -->
</div>
```
