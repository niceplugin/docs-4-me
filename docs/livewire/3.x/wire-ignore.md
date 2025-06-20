# wire:ignore
Livewire가 페이지를 업데이트할 수 있는 능력이 바로 Livewire를 "라이브"하게 만드는 이유입니다. 하지만 때로는 페이지의 일부가 Livewire에 의해 업데이트되는 것을 방지하고 싶을 때가 있습니다.

이런 경우, `wire:ignore` 지시어를 사용하여 Livewire에게 특정 요소의 내용을 무시하도록 지시할 수 있습니다. 이는 요청 사이에 내용이 변경되더라도 마찬가지입니다.

이 기능은 주로 커스텀 폼 입력 등과 같은 서드파티 자바스크립트 라이브러리와 함께 작업할 때 가장 유용합니다.

아래는 서드파티 라이브러리가 사용하는 요소를 `wire:ignore`로 감싸서 Livewire가 해당 라이브러리가 생성한 HTML을 건드리지 않도록 하는 예시입니다:

```blade
<form>
    <!-- ... -->

    <div wire:ignore>
        <!-- 이 요소는 서드파티 라이브러리에서 -->
        <!-- 초기화를 위해 참조될 수 있습니다... -->
        <input id="id-for-date-picker-library">
    </div>

    <!-- ... -->
</form>
```

또한, `wire:ignore.self`를 사용하여 Livewire가 해당 요소의 내용 변경은 관찰하되, 루트 요소의 속성 변경만 무시하도록 지시할 수도 있습니다.

```blade
<div wire:ignore.self>
    <!-- ... -->
</div>
```
