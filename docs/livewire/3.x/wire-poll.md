# wire:poll
폴링(Polling)은 웹 애플리케이션에서 서버에 업데이트가 있는지 정기적으로 요청을 보내는(폴링하는) 기술입니다. 이는 [WebSockets](/livewire/3.x/events#real-time-events-using-laravel-echo)와 같은 더 정교한 기술 없이도 페이지를 최신 상태로 유지할 수 있는 간단한 방법입니다.
## 기본 사용법 {#basic-usage}

Livewire에서 폴링을 사용하는 것은 요소에 `wire:poll`을 추가하는 것만큼 간단합니다.

아래는 사용자의 구독자 수를 보여주는 `SubscriberCount` 컴포넌트의 예시입니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class SubscriberCount extends Component
{
    public function render()
    {
        return view('livewire.subscriber-count', [
            'count' => Auth::user()->subscribers->count(),
        ]);
    }
}
```

```blade
<div wire:poll> <!-- [!code highlight] -->
    Subscribers: {{ $count }}
</div>
```

일반적으로 이 컴포넌트는 사용자의 구독자 수를 보여주고, 페이지를 새로고침하기 전까지는 절대 업데이트되지 않습니다. 하지만 컴포넌트의 템플릿에 `wire:poll`이 있기 때문에, 이 컴포넌트는 이제 `2.5`초마다 자동으로 새로고침되어 구독자 수를 최신 상태로 유지합니다.

또한, `wire:poll`에 값을 전달하여 폴링 간격마다 실행할 액션을 지정할 수도 있습니다:

```blade
<div wire:poll="refreshSubscribers">
    Subscribers: {{ $count }}
</div>
```

이제 컴포넌트의 `refreshSubscribers()` 메서드가 `2.5`초마다 호출됩니다.

## 타이밍 제어 {#timing-control}

폴링의 주요 단점은 리소스를 많이 소모할 수 있다는 점입니다. 폴링을 사용하는 페이지에 천 명의 방문자가 있다면, 매 `2.5`초마다 천 개의 네트워크 요청이 발생하게 됩니다.

이러한 상황에서 요청 수를 줄이는 가장 좋은 방법은 폴링 간격을 더 길게 설정하는 것입니다.

`wire:poll`에 원하는 지속 시간을 다음과 같이 추가하여 컴포넌트가 폴링하는 주기를 수동으로 제어할 수 있습니다:

```blade
<div wire:poll.15s> <!-- 초 단위... -->

<div wire:poll.15000ms> <!-- 밀리초 단위... -->
```

## 백그라운드 쓰로틀링 {#background-throttling}

서버 요청을 더욱 줄이기 위해, Livewire는 페이지가 백그라운드에 있을 때 폴링을 자동으로 쓰로틀링합니다. 예를 들어, 사용자가 다른 브라우저 탭에서 페이지를 열어둔 경우, 사용자가 해당 탭으로 돌아올 때까지 Livewire는 폴링 요청 수를 95%까지 줄입니다.

이 동작을 비활성화하고 탭이 백그라운드에 있을 때도 계속 폴링을 유지하고 싶다면, `wire:poll`에 `.keep-alive` 수식어를 추가하면 됩니다:

```blade
<div wire:poll.keep-alive>
```

## 뷰포트 제한 {#viewport-throttling}

필요할 때만 폴링하도록 하는 또 다른 방법은 `wire:poll`에 `.visible` 수식어를 추가하는 것입니다. `.visible` 수식어는 Livewire에게 해당 컴포넌트가 페이지에 보일 때만 폴링하도록 지시합니다:

```blade
<div wire:poll.visible>
```

`wire:visible`을 사용하는 컴포넌트가 긴 페이지의 맨 아래에 있다면, 사용자가 해당 컴포넌트를 뷰포트로 스크롤할 때까지 폴링이 시작되지 않습니다. 사용자가 다시 스크롤하여 벗어나면 폴링이 중지됩니다.
