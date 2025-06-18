# [기능] 텔레포트
Livewire는 템플릿의 일부를 페이지의 DOM 내 완전히 다른 위치로 _텔레포트_ 할 수 있게 해줍니다.

이 기능은 중첩된 다이얼로그와 같은 상황에서 유용합니다. 하나의 다이얼로그 안에 또 다른 다이얼로그를 중첩할 때, 부모 모달의 z-index가 중첩된 모달에도 적용됩니다. 이로 인해 배경 및 오버레이 스타일링에 문제가 발생할 수 있습니다. 이러한 문제를 피하기 위해 Livewire의 `@teleport` 지시어를 사용하여 각 중첩 모달을 렌더링된 DOM에서 형제 요소로 렌더링할 수 있습니다.

이 기능은 [Alpine의 `x-teleport` 지시어](https://alpinejs.dev/directives/teleport)로 구현됩니다.

## 기본 사용법 {#basic-usage}

템플릿의 일부를 DOM의 다른 위치로 _텔레포트_ 하려면, Livewire의 `@teleport` 지시문으로 감싸면 됩니다.

아래는 `@teleport`를 사용하여 모달 다이얼로그의 내용을 페이지의 `<body>` 요소 끝에 렌더링하는 예시입니다:
```blade
<div>
    <!-- Modal -->
    <div x-data="{ open: false }">
        <button @click="open = ! open">모달 토글</button>

        @teleport('body')
            <div x-show="open">
                모달 내용...
            </div>
        @endteleport
    </div>
</div>
```

> [!info]
> `@teleport` 선택자는 일반적으로 `document.querySelector()`에 전달할 수 있는 아무 문자열이나 사용할 수 있습니다.
>
> `document.querySelector()`에 대해 더 알고 싶다면 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)를 참고하세요.

이제 위의 Livewire 템플릿이 페이지에 렌더링되면, 모달의 _내용_ 부분이 `<body>`의 끝에 렌더링됩니다:

```html
<body>
    <!-- ... -->

    <div x-show="open">
        모달 내용...
    </div>
</body>
```

> [!warning] 반드시 컴포넌트 외부로 텔레포트해야 합니다
> Livewire는 HTML을 컴포넌트 외부로만 텔레포트하는 것을 지원합니다. 예를 들어, 모달을 `<body>` 태그로 텔레포트하는 것은 괜찮지만, 컴포넌트 내부의 다른 요소로 텔레포트하는 것은 동작하지 않습니다.

> [!warning] 텔레포트는 단일 루트 요소만 지원합니다
> `@teleport` 구문 안에는 반드시 하나의 루트 요소만 포함해야 합니다.
