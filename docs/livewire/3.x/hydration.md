# 하이드레이션
Livewire를 사용하면 서버 사이드 PHP 클래스를 웹 브라우저에 직접 연결하는 것처럼 느껴집니다. 버튼 클릭으로 서버 사이드 함수를 직접 호출하는 것과 같은 기능이 이러한 착각을 지원합니다. 하지만 실제로는, 이것은 그저 착각일 뿐입니다.

백그라운드에서 Livewire는 실제로 표준 웹 애플리케이션과 매우 유사하게 동작합니다. 브라우저에 정적 HTML을 렌더링하고, 브라우저 이벤트를 감지한 후, AJAX 요청을 통해 서버 사이드 코드를 실행합니다.

Livewire가 서버로 보내는 각 AJAX 요청은 "상태 비저장(stateless)"입니다(즉, 컴포넌트의 상태를 계속 유지하는 백엔드 프로세스가 오래 실행되는 것이 아님). 따라서 Livewire는 업데이트를 수행하기 전에 컴포넌트의 마지막으로 알려진 상태를 다시 생성해야 합니다.

이를 위해 Livewire는 각 서버 사이드 업데이트 후 PHP 컴포넌트의 "스냅샷"을 찍어, 다음 요청 시 컴포넌트를 다시 생성하거나 _재개_할 수 있도록 합니다.

이 문서 전반에 걸쳐, 스냅샷을 찍는 과정을 "탈수(dehydration)", 스냅샷에서 컴포넌트를 다시 생성하는 과정을 "수화(hydration)"라고 부르겠습니다.

## 탈수(Dehydrating) {#dehydrating}

Livewire가 서버 사이드 컴포넌트를 _탈수_할 때, 두 가지 작업을 수행합니다:

* 컴포넌트의 템플릿을 HTML로 렌더링
* 컴포넌트의 JSON 스냅샷 생성

### HTML 렌더링 {#rendering-html}

컴포넌트가 마운트되거나 업데이트가 이루어진 후, Livewire는 컴포넌트의 `render()` 메서드를 호출하여 Blade 템플릿을 순수 HTML로 변환합니다.

다음은 `Counter` 컴포넌트의 예시입니다:

```php
class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            Count: {{ $count }}

            <button wire:click="increment">+</button>
        </div>
        HTML;
    }
}
```

각 마운트 또는 업데이트 후, Livewire는 위의 `Counter` 컴포넌트를 다음과 같은 HTML로 렌더링합니다:

```html
<div>
    Count: 1

    <button wire:click="increment">+</button>
</div>
```

### 스냅샷 {#the-snapshot}

다음 요청 시 서버에서 `Counter` 컴포넌트를 다시 생성하기 위해, JSON 스냅샷이 생성되어 컴포넌트의 상태를 최대한 많이 캡처하려고 시도합니다:

```js
{
    state: {
        count: 1,
    },

    memo: {
        name: 'counter',

        id: '1526456',
    },
}
```

스냅샷에는 `memo`와 `state`라는 두 가지 다른 부분이 있습니다.

`memo` 부분은 컴포넌트를 식별하고 다시 생성하는 데 필요한 정보를 저장하며, `state` 부분은 컴포넌트의 모든 public 속성 값을 저장합니다.

> [!info]
> 위의 스냅샷은 Livewire의 실제 스냅샷을 간략화한 버전입니다. 실제 애플리케이션에서는 스냅샷에 검증 오류, 자식 컴포넌트 목록, 로케일 등 훨씬 더 많은 정보가 포함됩니다. 스냅샷 객체에 대해 더 자세히 알고 싶다면 [스냅샷 스키마 문서](/livewire/3.x/javascript#the-snapshot-object)를 참고하세요.

### HTML에 스냅샷 포함하기 {#embedding-the-snapshot-in-the-html}

컴포넌트가 처음 렌더링될 때, Livewire는 스냅샷을 JSON 형태로 `wire:snapshot`라는 HTML 속성에 저장합니다. 이렇게 하면 Livewire의 JavaScript 코어가 JSON을 추출하여 런타임 객체로 변환할 수 있습니다:

```html
<div wire:id="..." wire:snapshot="{ state: {...}, memo: {...} }">
    Count: 1

    <button wire:click="increment">+</button>
</div>
```

## 수화(Hydrating) {#hydrating}

컴포넌트 업데이트가 트리거될 때, 예를 들어 `Counter` 컴포넌트에서 "+" 버튼이 눌리면, 다음과 같은 페이로드가 서버로 전송됩니다:

```js
{
    calls: [
        { method: 'increment', params: [] },
    ],

    snapshot: {
        state: {
            count: 1,
        },

        memo: {
            name: 'counter',

            id: '1526456',
        },
    }
}
```

Livewire가 `increment` 메서드를 호출하기 전에, 먼저 새로운 `Counter` 인스턴스를 생성하고 스냅샷의 상태로 초기화해야 합니다.

다음은 이 결과를 달성하는 PHP 의사 코드입니다:

```php
$state = request('snapshot.state');
$memo = request('snapshot.memo');

$instance = Livewire::new($memo['name'], $memo['id']);

foreach ($state as $property => $value) {
    $instance[$property] = $value;
}
```

위 스크립트를 따라가면, `Counter` 객체를 생성한 후, public 속성들이 스냅샷에서 제공된 상태에 따라 설정되는 것을 볼 수 있습니다.

## 고급 수화(Advanced hydration) {#advanced-hydration}

위의 `Counter` 예시는 수화 개념을 설명하기에 적합하지만, Livewire가 정수(`1`)와 같은 단순 값의 수화만 처리하는 방법만 보여줍니다.

알다시피, Livewire는 정수 외에도 훨씬 더 복잡한 속성 타입을 지원합니다.

조금 더 복잡한 예시로 `Todos` 컴포넌트를 살펴보겠습니다:

```php
class Todos extends Component
{
    public $todos;

    public function mount() {
        $this->todos = collect([
            'first',
            'second',
            'third',
        ]);
    }
}
```

보시다시피, `$todos` 속성에 세 개의 문자열을 가진 [Laravel 컬렉션](/laravel/12.x/collections#main-content)을 할당하고 있습니다.

JSON만으로는 Laravel 컬렉션을 표현할 방법이 없으므로, Livewire는 스냅샷 내에서 순수 데이터와 메타데이터를 연관시키는 자체 패턴을 만들었습니다.

이 `Todos` 컴포넌트의 스냅샷 상태 객체는 다음과 같습니다:

```js
state: {
    todos: [
        [ 'first', 'second', 'third' ],
        { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
    ],
},
```

좀 더 직관적인 형태를 기대했다면, 이 부분이 혼란스러울 수 있습니다:

```js
state: {
    todos: [ 'first', 'second', 'third' ],
},
```

하지만 Livewire가 이 데이터를 기반으로 컴포넌트를 수화한다면, 이것이 컬렉션인지 단순 배열인지 알 방법이 없습니다.

따라서 Livewire는 튜플(두 개의 항목으로 이루어진 배열) 형태의 대체 상태 구문을 지원합니다:

```js
todos: [
    [ 'first', 'second', 'third' ],
    { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
],
```

Livewire가 컴포넌트의 상태를 수화할 때 튜플을 만나면, 튜플의 두 번째 요소에 저장된 정보를 사용하여 첫 번째에 저장된 상태를 더 지능적으로 수화합니다.

좀 더 명확하게 보여주기 위해, 위의 스냅샷을 기반으로 Livewire가 컬렉션 속성을 다시 생성하는 방법을 보여주는 간단한 코드입니다:

```php
[ $state, $metadata ] = request('snapshot.state.todos');

$collection = new $metadata['class']($state);
```

보시다시피, Livewire는 상태에 연관된 메타데이터를 사용하여 전체 컬렉션 클래스를 유추합니다.

### 깊게 중첩된 튜플 {#deeply-nested-tuples}

이 접근 방식의 뚜렷한 장점 중 하나는 깊게 중첩된 속성도 탈수 및 수화할 수 있다는 점입니다.

예를 들어, 위의 `Todos` 예시에서 세 번째 항목을 일반 문자열 대신 [Laravel Stringable](/laravel/12.x/helpers#method-str)로 바꾼 경우를 생각해봅시다:

```php
class Todos extends Component
{
    public $todos;

    public function mount() {
        $this->todos = collect([
            'first',
            'second',
            str('third'),
        ]);
    }
}
```

이 컴포넌트의 상태에 대한 탈수된 스냅샷은 이제 다음과 같이 보입니다:

```js
todos: [
    [
        'first',
        'second',
        [ 'third', { s: 'str' } ],
    ],
    { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
],
```

보시다시피, 컬렉션의 세 번째 항목이 메타데이터 튜플로 탈수되었습니다. 튜플의 첫 번째 요소는 순수 문자열 값이고, 두 번째는 이 문자열이 _stringable_임을 Livewire에 알리는 플래그입니다.

### 커스텀 속성 타입 지원 {#supporting-custom-property-types}

내부적으로 Livewire는 가장 일반적인 PHP 및 Laravel 타입에 대한 수화 지원을 제공합니다. 그러나 지원되지 않는 타입을 지원하고 싶다면, [Synthesizers](/livewire/3.x/synthesizers) — Livewire의 비원시 속성 타입의 탈수/수화를 위한 내부 메커니즘 — 를 사용하여 직접 구현할 수 있습니다.

