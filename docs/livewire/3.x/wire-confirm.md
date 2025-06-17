# wire:confirm
Livewire에서 위험한 작업을 수행하기 전에 사용자에게 시각적인 확인을 제공하고 싶을 수 있습니다.

Livewire는 `wire:click`, `wire:submit` 등과 함께 `wire:confirm`을 추가하는 것만으로 이를 쉽게 구현할 수 있습니다.

아래는 "게시글 삭제" 버튼에 확인 대화상자를 추가하는 예시입니다:

```blade {4}
<button
    type="button"
    wire:click="delete"
    wire:confirm="이 게시글을 정말 삭제하시겠습니까?"
>
    게시글 삭제
</button>
```

사용자가 "게시글 삭제"를 클릭하면 Livewire는 확인 대화상자(기본 브라우저 확인 알림)를 띄웁니다. 사용자가 esc를 누르거나 취소를 선택하면 작업이 수행되지 않습니다. "확인"을 누르면 작업이 완료됩니다.

## 사용자 입력 요청하기 {#prompting-users-for-input}

사용자 계정을 완전히 삭제하는 것과 같이 더욱 위험한 작업의 경우, 사용자가 특정 문자열을 입력해야만 작업이 확인되도록 확인 프롬프트를 표시하고 싶을 수 있습니다.

Livewire는 `.prompt`라는 유용한 수식어를 제공합니다. 이 수식어를 `wire:confirm`에 적용하면, 사용자에게 입력을 요청하고 입력값이 제공된 문자열(대소문자 구분)과 일치할 때만 작업이 확인됩니다(`wire:confirm` 값 끝에 "|"(파이프) 문자로 지정).

```blade {4}
<button
    type="button"
    wire:click="delete"
    wire:confirm.prompt="Are you sure?\n\nType DELETE to confirm|DELETE"
>
    Delete account
</button>
```

사용자가 "Delete account"를 누르면, 프롬프트에 "DELETE"를 입력한 경우에만 작업이 수행되며, 그렇지 않으면 작업이 취소됩니다.

