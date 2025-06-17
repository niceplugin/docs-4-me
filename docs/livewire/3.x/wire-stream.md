# wire:stream
Livewire는 `wire:stream` API를 통해 요청이 완료되기 전에 웹 페이지로 콘텐츠를 스트리밍할 수 있도록 해줍니다. 이 기능은 AI 챗봇처럼 응답이 생성되는 대로 스트리밍해야 하는 경우에 매우 유용합니다.

> [!warning] Laravel Octane과 호환되지 않음
> Livewire는 현재 `wire:stream`을 Laravel Octane과 함께 사용하는 것을 지원하지 않습니다.

`wire:stream`의 가장 기본적인 기능을 보여주기 위해, 아래에는 버튼을 누르면 "3"부터 "0"까지 카운트다운을 사용자에게 보여주는 간단한 CountDown 컴포넌트가 있습니다:

```php
use Livewire\Component;

class CountDown extends Component
{
    public $start = 3;

    public function begin()
    {
        while ($this->start >= 0) {
            // 현재 카운트를 브라우저로 스트리밍합니다...
            $this->stream(  // [tl! highlight:4]
                to: 'count',
                content: $this->start,
                replace: true,
            );

            // 숫자 사이에 1초 대기합니다...
            sleep(1);

            // 카운터를 감소시킵니다...
            $this->start = $this->start - 1;
        };
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <button wire:click="begin">Start count-down</button>

            <h1>Count: <span wire:stream="count">{{ $start }}</span></h1> <!-- [tl! highlight] -->
        </div>
        HTML;
    }
}
```

사용자가 "Start count-down" 버튼을 눌렀을 때 일어나는 일은 다음과 같습니다:
* 페이지에 "Count: 3"이 표시됩니다
* 사용자가 "Start count-down" 버튼을 누릅니다
* 1초가 지나고 "Count: 2"가 표시됩니다
* 이 과정이 "Count: 0"이 표시될 때까지 계속됩니다

위의 모든 과정은 하나의 네트워크 요청이 서버로 전송된 상태에서 일어납니다.

버튼이 눌렸을 때 시스템 관점에서 일어나는 일은 다음과 같습니다:
* Livewire로 `begin()` 메서드를 호출하는 요청이 전송됩니다
* `begin()` 메서드가 호출되고 `while` 루프가 시작됩니다
* `$this->stream()`이 호출되어 즉시 브라우저로 "스트리밍 응답"을 시작합니다
* 브라우저는 스트리밍 응답을 받아 컴포넌트 내에서 `wire:stream="count"`가 지정된 요소를 찾아, 받은 페이로드(첫 번째 스트리밍 숫자의 경우 "3")로 내용을 교체합니다
* `sleep(1)` 메서드로 인해 서버가 1초 동안 대기합니다
* `while` 루프가 반복되며, 매초마다 새로운 숫자를 스트리밍하는 과정이 `while` 조건이 거짓이 될 때까지 계속됩니다
* `begin()` 실행이 끝나고 모든 카운트가 브라우저로 스트리밍되면, Livewire는 요청 라이프사이클을 마치고 컴포넌트를 렌더링하여 최종 응답을 브라우저로 전송합니다

## 스트리밍 챗봇 응답 {#streaming-chat-bot-responses}

`wire:stream`의 일반적인 사용 사례 중 하나는 스트리밍 응답을 지원하는 API(예: [OpenAI의 ChatGPT](https://chat.openai.com/))로부터 받은 챗봇 응답을 실시간으로 스트리밍하는 것입니다.

아래는 `wire:stream`을 사용하여 ChatGPT와 유사한 인터페이스를 구현하는 예시입니다:

```php
use Livewire\Component;

class ChatBot extends Component
{
    public $prompt = '';

    public $question = '';

    public $answer = '';

    function submitPrompt()
    {
        $this->question = $this->prompt;

        $this->prompt = '';

        $this->js('$wire.ask()');
    }

    function ask()
    {
        $this->answer = OpenAI::ask($this->question, function ($partial) {
            $this->stream(to: 'answer', content: $partial); // [tl! highlight]
        });
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <section>
                <div>ChatBot</div>

                @if ($question)
                    <article>
                        <hgroup>
                            <h3>User</h3>
                            <p>{{ $question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3>ChatBot</h3>
                            <p wire:stream="answer">{{ $answer }}</p> <!-- [tl! highlight] -->
                        </hgroup>
                    </article>
                @endif
            </section>

            <form wire:submit="submitPrompt">
                <input wire:model="prompt" type="text" placeholder="Send a message" autofocus>
            </form>
        </div>
        HTML;
    }
}
```

위 예시에서 일어나는 일은 다음과 같습니다:
* 사용자가 "Send a message"로 표시된 텍스트 필드에 챗봇에게 질문을 입력합니다.
* [Enter] 키를 누릅니다.
* 서버로 네트워크 요청이 전송되어 메시지가 `$question` 속성에 설정되고, `$prompt` 속성은 비워집니다.
* 응답이 브라우저로 전송되고 입력란이 비워집니다. `$this->js('...')`가 호출되었기 때문에, 서버에 `ask()` 메서드를 호출하는 새로운 요청이 트리거됩니다.
* `ask()` 메서드는 ChatBot API를 호출하고, 콜백의 `$partial` 매개변수를 통해 스트리밍 응답 일부를 받습니다.
* 각 `$partial`은 페이지의 `wire:stream="answer"` 요소로 브라우저에 스트리밍되어, 답변이 점진적으로 사용자에게 표시됩니다.
* 전체 응답이 수신되면 Livewire 요청이 완료되고 사용자는 전체 답변을 받게 됩니다.

## 교체 vs. 추가 {#replace-vs-append}

`$this->stream()`을 사용하여 요소에 콘텐츠를 스트리밍할 때, Livewire에 스트리밍된 콘텐츠로 대상 요소의 내용을 교체할지, 기존 내용에 추가할지 지정할 수 있습니다.

상황에 따라 교체와 추가 모두 바람직할 수 있습니다. 예를 들어, 챗봇의 응답을 스트리밍할 때는 일반적으로 추가가 더 적합하며(기본값도 추가입니다), 카운트다운과 같이 무언가를 표시할 때는 교체가 더 적합합니다.

`$this->stream`에 `replace:` 파라미터를 불리언 값으로 전달하여 둘 중 하나를 설정할 수 있습니다:

```php
// 내용 추가...
$this->stream(to: 'target', content: '...');

// 내용 교체...
$this->stream(to: 'target', content: '...', replace: true);
```

추가/교체는 대상 요소 레벨에서도 `.replace` 수식자를 추가하거나 제거하여 지정할 수 있습니다:

```blade
// 내용 추가...
<div wire:stream="target">

// 내용 교체...
<div wire:stream.replace="target">
```
