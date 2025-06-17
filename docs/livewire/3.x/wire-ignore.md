# wire:ignore
Livewire가 페이지를 업데이트할 수 있는 기능이 바로 Livewire를 "라이브"하게 만드는 이유입니다. 하지만 때로는 Livewire가 페이지의 일부를 업데이트하지 않도록 하고 싶을 때가 있습니다.

이런 경우, `wire:ignore` 디렉티브를 사용하여 Livewire에게 특정 요소의 내용을 무시하도록 지시할 수 있습니다. 요청 사이에 내용이 변경되더라도 Livewire는 해당 요소를 무시합니다.

이 기능은 주로 커스텀 폼 입력 등 서드파티 자바스크립트 라이브러리와 함께 작업할 때 가장 유용합니다.

아래는 서드파티 라이브러리가 사용하는 요소를 `wire:ignore`로 감싸서, Livewire가 라이브러리가 생성한 HTML을 건드리지 않도록 하는 예시입니다:

```blade
<form>
    <!-- ... -->

    <div wire:ignore>
        <!-- 이 요소는 서드파티 라이브러리에서 -->
        <!-- 초기화 시 참조될 수 있습니다... -->
        <input id="id-for-date-picker-library">
    </div>

    <!-- ... -->
</form>
```

또한, `wire:ignore.self`를 사용하면 Livewire가 해당 루트 요소의 속성 변경만 무시하고, 그 내용의 변경은 계속 관찰하도록 지시할 수 있습니다.

```blade
<div wire:ignore.self>
    <!-- ... -->
</div>
```
