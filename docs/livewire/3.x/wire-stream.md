# wire:stream
Livewire는 `wire:stream` API를 통해 요청이 완료되기 전에 웹 페이지로 콘텐츠를 스트리밍할 수 있도록 해줍니다. 이 기능은 생성되는 대로 응답을 스트리밍하는 AI 챗봇과 같은 것에 매우 유용합니다.

> [!warning] Laravel Octane과 호환되지 않음
> Livewire는 현재 Laravel Octane과 함께 `wire:stream` 사용을 지원하지 않습니다.

`wire:stream`의 가장 기본적인 기능을 보여주기 위해, 아래는 버튼을 누르면 사용자에게 "3"에서 "0"까지 카운트다운을 표시하는 간단한 CountDown 컴포넌트입니다:

```php
use Livewire\Component;

class CountDown extends Component
{
    public $start = 3;

    public function begin()
    {
        while ($this->start >= 0) {
            // 현재 카운트를 브라우저로 스트리밍합니다...
            $this->stream(  // [!code highlight:5]
                to: 'count',
                content: $this->start,
                replace: true,
            );

            // 숫자 사이에 1초씩 멈춥니다...
            sleep(1);

            // 카운터를 감소시킵니다...
            $this->start = $this->start - 1;
        };
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <button wire:click="begin">카운트다운 시작</button>

            <h1>카운트: <span wire:stream="count">{{ $start }}</span></h1> <!-- [!code highlight] -->
        </div>
        HTML;
    }
}
```

사용자가 "카운트다운 시작" 버튼을 누르면 다음과 같은 일이 일어납니다:
* 페이지에 "카운트: 3"이 표시됩니다
* 사용자가 "카운트다운 시작" 버튼을 누릅니다
* 1초가 지나고 "카운트: 2"가 표시됩니다
* 이 과정이 "카운트: 0"이 표시될 때까지 계속됩니다

위의 모든 과정은 하나의 네트워크 요청이 서버로 전송되는 동안에 일어납니다.

버튼이 눌렸을 때 시스템 관점에서 일어나는 일은 다음과 같습니다:
* Livewire로 `begin()` 메서드를 호출하는 요청이 전송됩니다
* `begin()` 메서드가 호출되고 `while` 루프가 시작됩니다
* `$this->stream()`이 호출되어 즉시 브라우저로 "스트리밍된 응답"을 시작합니다
* 브라우저는 스트리밍된 응답을 받아 컴포넌트 내에서 `wire:stream="count"`가 지정된 요소를 찾아, 받은 페이로드(첫 번째 스트리밍 숫자의 경우 "3")로 내용을 교체합니다
* `sleep(1)` 메서드로 인해 서버가 1초 동안 대기합니다
* `while` 루프가 반복되며, 매초마다 새로운 숫자를 스트리밍하는 과정이 `while` 조건이 거짓이 될 때까지 계속됩니다
* `begin()`이 실행을 마치고 모든 카운트가 브라우저로 스트리밍되면, Livewire는 요청 라이프사이클을 마치고 컴포넌트를 렌더링하여 최종 응답을 브라우저로 전송합니다

## 챗봇 응답 스트리밍 {#streaming-chat-bot-responses}

`wire:stream`의 일반적인 사용 사례는 스트리밍 응답을 지원하는 API(예: [OpenAI의 ChatGPT](https://chat.openai.com/))로부터 받은 챗봇 응답을 스트리밍하는 것입니다.

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
            $this->stream(to: 'answer', content: $partial); // [!code highlight]
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
                            <h3>사용자</h3>
                            <p>{{ $question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3>ChatBot</h3>
                            <p wire:stream="answer">{{ $answer }}</p> <!-- [!code highlight] -->
                        </hgroup>
                    </article>
                @endif
            </section>

            <form wire:submit="submitPrompt">
                <input wire:model="prompt" type="text" placeholder="메시지 보내기" autofocus>
            </form>
        </div>
        HTML;
    }
}
```

위 예시에서 일어나는 일은 다음과 같습니다:
* 사용자가 "메시지 보내기"로 표시된 텍스트 필드에 챗봇에게 질문을 입력합니다.
* 사용자가 [Enter] 키를 누릅니다.
* 네트워크 요청이 서버로 전송되어 메시지를 `$question` 속성에 설정하고 `$prompt` 속성을 비웁니다.
* 응답이 브라우저로 전송되어 입력란이 비워집니다. `$this->js('...')`가 호출되었기 때문에, 서버로 `ask()` 메서드를 호출하는 새로운 요청이 발생합니다.
* `ask()` 메서드는 ChatBot API를 호출하고 콜백의 `$partial` 매개변수를 통해 스트리밍된 응답 일부를 받습니다.
* 각 `$partial`이 페이지의 `wire:stream="answer"` 요소로 스트리밍되어, 답변이 점진적으로 사용자에게 표시됩니다.
* 전체 응답을 모두 받으면 Livewire 요청이 종료되고 사용자는 전체 응답을 받게 됩니다.

## 교체 vs. 추가 {#replace-vs-append}

`$this->stream()`을 사용하여 요소에 콘텐츠를 스트리밍할 때, Livewire에 스트리밍된 콘텐츠로 대상 요소의 내용을 교체할지, 기존 내용에 추가할지 지정할 수 있습니다.

교체 또는 추가는 상황에 따라 모두 바람직할 수 있습니다. 예를 들어, 챗봇의 응답을 스트리밍할 때는 일반적으로 추가가 바람직하며(기본값임), 카운트다운과 같은 것을 표시할 때는 교체가 더 적합합니다.

`replace:` 매개변수에 불리언 값을 전달하여 둘 중 하나를 설정할 수 있습니다:

```php
// 내용을 추가합니다...
$this->stream(to: 'target', content: '...');

// 내용을 교체합니다...
$this->stream(to: 'target', content: '...', replace: true);
```

추가/교체는 대상 요소 수준에서도 `.replace` 수식어를 추가하거나 제거하여 지정할 수 있습니다:

```blade
// 내용을 추가합니다...
<div wire:stream="target">

// 내용을 교체합니다...
<div wire:stream.replace="target">
```
