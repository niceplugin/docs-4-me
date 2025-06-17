# wire:model
Livewire는 `wire:model`을 사용하여 컴포넌트 속성과 폼 입력값을 쉽게 바인딩할 수 있게 해줍니다.

아래는 "게시글 작성" 컴포넌트에서 `$title`과 `$content` 속성을 폼 입력값과 바인딩하는 간단한 예시입니다:

```php
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title = '';

    public $content = '';

    public function save()
    {
		$post = Post::create([
			'title' => $this->title
			'content' => $this->content
		]);

        // ...
    }
}
```

```blade
<form wire:submit="save">
    <label>
        <span>Title</span>

        <input type="text" wire:model="title"> <!-- [tl! highlight] -->
    </label>

    <label>
        <span>Content</span>

        <textarea wire:model="content"></textarea> <!-- [tl! highlight] -->
    </label>

	<button type="submit">Save</button>
</form>
```

두 입력 필드 모두 `wire:model`을 사용하고 있기 때문에, "Save" 버튼을 누르면 입력값이 서버의 속성과 동기화됩니다.

> [!warning] "왜 입력할 때마다 컴포넌트가 실시간으로 업데이트되지 않나요?"
> 브라우저에서 이 예제를 실행해보고 제목이 자동으로 업데이트되지 않아 혼란스러웠다면, Livewire는 사용자가 필드에 입력할 때가 아니라 "액션"이 제출될 때(예: 제출 버튼을 누를 때)만 컴포넌트를 업데이트하기 때문입니다. 이는 네트워크 요청을 줄이고 성능을 향상시킵니다. 사용자가 입력할 때마다 "실시간"으로 업데이트되길 원한다면, 대신 `wire:model.live`를 사용할 수 있습니다. [데이터 바인딩에 대해 더 알아보기](/docs/properties#data-binding).

## 업데이트 타이밍 커스터마이징 {#customizing-update-timing}

기본적으로 Livewire는 액션이 수행될 때만(예: `wire:click` 또는 `wire:submit`) 네트워크 요청을 보냅니다. `wire:model` 입력이 업데이트될 때는 네트워크 요청을 보내지 않습니다.

이 방식은 네트워크 요청을 줄여 Livewire의 성능을 크게 향상시키고, 사용자에게 더 부드러운 경험을 제공합니다.

하지만 실시간 유효성 검사와 같은 기능을 위해 서버를 더 자주 업데이트해야 하는 경우도 있습니다.

### 실시간 업데이트 {#live-updating}

사용자가 입력 필드에 타이핑할 때마다 속성 업데이트를 서버로 전송하려면, `wire:model`에 `.live` 수식어를 추가하면 됩니다:

```html
<input type="text" wire:model.live="title">
```

#### 디바운스 커스터마이징 {#customizing-the-debounce}

기본적으로 `wire:model.live`를 사용할 때, Livewire는 서버 업데이트에 150밀리초의 디바운스를 추가합니다. 즉, 사용자가 계속해서 입력할 경우, Livewire는 사용자가 입력을 멈춘 후 150밀리초가 지나야 요청을 보냅니다.

이 타이밍은 입력값에 `.debounce.Xms`를 추가하여 커스터마이징할 수 있습니다. 디바운스를 250밀리초로 변경하는 예시는 다음과 같습니다:

```html
<input type="text" wire:model.live.debounce.250ms="title">
```

### "blur" 이벤트에서 업데이트하기 {#updating-on-blur-event}

`.blur` 수식어를 추가하면, 사용자가 입력란에서 벗어나거나(클릭하여 다른 곳을 선택하거나), 탭 키를 눌러 다음 입력란으로 이동할 때에만 Livewire가 네트워크 요청을 보내 속성 업데이트를 수행합니다.

`.blur`를 추가하는 것은 서버를 더 자주 업데이트하고 싶지만, 사용자가 입력할 때마다 업데이트하고 싶지 않은 상황에서 유용합니다. 예를 들어, 실시간 유효성 검사와 같은 경우에 `.blur`가 도움이 됩니다.

```html
<input type="text" wire:model.blur="title">
```

### "change" 이벤트에서 업데이트하기 {#updating-on-change-event}

`.blur`의 동작이 원하는 것과 다를 때, 대신 `.change`를 사용할 수 있습니다.

예를 들어, select 입력값이 변경될 때마다 검증을 실행하고 싶다면, `.change`를 추가하면 사용자가 새로운 옵션을 선택하는 즉시 Livewire가 네트워크 요청을 보내고 해당 속성을 검증합니다. 반면, `.blur`는 사용자가 select 입력에서 포커스를 벗어날 때만 서버를 업데이트합니다.

```html
<select wire:model.change="title">
    <!-- ... -->
</select>
```

텍스트 입력에 변경이 생기면 해당 값이 Livewire 컴포넌트의 `$title` 속성과 자동으로 동기화됩니다.

## 사용 가능한 모든 수정자 {#all-available-modifiers}

 수정자                | 설명
-----------------------|---------------------------------------------------------------------------
 `.live`               | 사용자가 입력할 때마다 업데이트를 전송합니다
 `.blur`               | `blur` 이벤트에서만 업데이트를 전송합니다
 `.change`             | `change` 이벤트에서만 업데이트를 전송합니다
 `.lazy`               | `.change`의 별칭입니다
 `.debounce.[?]ms`     | 지정한 밀리초(ms)만큼 업데이트 전송을 디바운스합니다
 `.throttle.[?]ms`     | 지정한 밀리초(ms) 간격으로 네트워크 요청 업데이트를 제한합니다
 `.number`             | 입력값의 텍스트를 서버에서 `int`로 변환합니다
 `.boolean`            | 입력값의 텍스트를 서버에서 `bool`로 변환합니다
 `.fill`               | 페이지 로드 시 "value" HTML 속성에 제공된 초기값을 사용합니다

## 입력 필드 {#input-fields}

Livewire는 대부분의 기본 입력 요소를 바로 지원합니다. 즉, 브라우저의 어떤 입력 요소에도 `wire:model`을 간단히 연결하여 속성을 쉽게 바인딩할 수 있습니다.

아래는 Livewire에서 사용할 수 있는 다양한 입력 타입과 그 사용 방법에 대한 종합적인 목록입니다.

### 텍스트 입력 {#text-inputs}

무엇보다도, 텍스트 입력은 대부분의 폼에서 기본이 됩니다. 다음은 "title"이라는 속성을 바인딩하는 방법입니다:

```blade
<input type="text" wire:model="title">
```

### 텍스트영역 입력 {#textarea-inputs}

Textarea 요소도 마찬가지로 간단합니다. `wire:model`을 textarea에 추가하면 값이 바인딩됩니다:

```blade
<textarea type="text" wire:model="content"></textarea>
```

"content" 값이 문자열로 초기화되어 있다면, Livewire가 해당 값을 textarea에 자동으로 채워줍니다. 아래와 같이 할 필요가 없습니다:

```blade
<!-- 경고: 이 예시는 하면 안 되는 방법을 보여줍니다... -->

<textarea type="text" wire:model="content">{{ $content }}</textarea>
```

### 체크박스 {#checkboxes}

체크박스는 불린 속성을 토글할 때와 같이 단일 값에 사용할 수 있습니다. 또는, 체크박스는 관련된 값 그룹에서 단일 값을 토글하는 데 사용할 수도 있습니다. 두 가지 시나리오 모두에 대해 설명하겠습니다:

#### 단일 체크박스 {#single-checkbox}

회원가입 폼의 마지막에 사용자가 이메일 업데이트를 수신하도록 선택할 수 있는 체크박스가 있을 수 있습니다. 이 속성의 이름을 `$receiveUpdates`라고 할 수 있습니다. 이 값을 `wire:model`을 사용하여 체크박스에 쉽게 바인딩할 수 있습니다:

```blade
<input type="checkbox" wire:model="receiveUpdates">
```

이제 `$receiveUpdates` 값이 `false`이면 체크박스가 선택 해제됩니다. 물론 값이 `true`이면 체크박스가 선택됩니다.

#### 다중 체크박스 {#multiple-checkboxes}

이제 사용자가 업데이트를 받을지 결정하는 것 외에도, 클래스에 `$updateTypes`라는 배열 속성이 있다고 가정해 봅시다. 이 속성을 통해 사용자는 다양한 업데이트 유형 중에서 선택할 수 있습니다:

```php
public $updateTypes = [];
```

여러 개의 체크박스를 `$updateTypes` 속성에 바인딩하면, 사용자가 여러 업데이트 유형을 선택할 수 있고, 선택된 값들이 `$updateTypes` 배열 속성에 추가됩니다:

```blade
<input type="checkbox" value="email" wire:model="updateTypes">
<input type="checkbox" value="sms" wire:model="updateTypes">
<input type="checkbox" value="notification" wire:model="updateTypes">
```

예를 들어, 사용자가 첫 번째와 두 번째 박스만 체크하고 세 번째는 체크하지 않았다면, `$updateTypes`의 값은 다음과 같습니다: `["email", "sms"]`

### 라디오 버튼 {#radio-buttons}

하나의 속성에 대해 두 가지 값 중에서 전환하려면 라디오 버튼을 사용할 수 있습니다:

```blade
<input type="radio" value="yes" wire:model="receiveUpdates">
<input type="radio" value="no" wire:model="receiveUpdates">
```

### 셀렉트 드롭다운 {#select-dropdowns}

Livewire를 사용하면 `<select>` 드롭다운을 간단하게 다룰 수 있습니다. 드롭다운에 `wire:model`을 추가하면, 현재 선택된 값이 지정한 프로퍼티 이름에 바인딩되고, 그 반대도 마찬가지입니다.

또한, 선택될 옵션에 `selected`를 수동으로 추가할 필요가 없습니다. Livewire가 이를 자동으로 처리해줍니다.

아래는 고정된 주(state) 목록으로 채워진 셀렉트 드롭다운의 예시입니다:

```blade
<select wire:model="state">
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

특정 주, 예를 들어 "Alaska"가 선택되면, 컴포넌트의 `$state` 프로퍼티는 `AK`로 설정됩니다. 만약 값이 "AK"가 아니라 "Alaska"로 설정되길 원한다면, `<option>` 요소에서 `value=""` 속성을 아예 생략하면 됩니다.

종종 Blade를 사용해 드롭다운 옵션을 동적으로 생성할 수도 있습니다:

```blade
<select wire:model="state">
    @foreach (\App\Models\State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>
```

기본적으로 특정 옵션이 선택되어 있지 않다면, "Select a state"와 같은 흐릿한(비활성화된) 플레이스홀더 옵션을 기본으로 보여주고 싶을 수 있습니다:

```blade
<select wire:model="state">
    <option disabled value="">Select a state...</option>

    @foreach (\App\Models\State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>
```

보시다시피, 텍스트 입력과 달리 셀렉트 메뉴에는 "placeholder" 속성이 없습니다. 대신, 목록의 첫 번째 옵션으로 `disabled` 옵션 요소를 추가해야 합니다.

### 종속 선택 드롭다운 {#dependent-select-dropdowns}

때때로 하나의 선택 메뉴가 다른 선택 메뉴에 따라 달라지길 원할 수 있습니다. 예를 들어, 선택한 주(state)에 따라 변경되는 도시(city) 목록이 그 예입니다.

대부분의 경우 예상대로 동작하지만, 한 가지 중요한 주의사항이 있습니다: 옵션이 변경될 때 Livewire가 해당 값을 제대로 새로고침할 수 있도록 변경되는 select 요소에 반드시 `wire:key`를 추가해야 합니다.

아래는 주(state)와 도시(city)를 위한 두 개의 select 예시입니다. 주 선택이 변경되면 도시 선택의 옵션도 올바르게 변경됩니다:

```blade
<!-- 주 선택 메뉴... -->
<select wire:model.live="selectedState">
    @foreach (State::all() as $state)
        <option value="{{ $state->id }}">{{ $state->label }}</option>
    @endforeach
</select>

<!-- 도시에 종속된 선택 메뉴... -->
<select wire:model.live="selectedCity" wire:key="{{ $selectedState }}"> <!-- [tl! highlight] -->
    @foreach (City::whereStateId($selectedState->id)->get() as $city)
        <option value="{{ $city->id }}">{{ $city->label }}</option>
    @endforeach
</select>
```

다시 한 번 강조하지만, 여기서 표준과 다른 유일한 점은 두 번째 select에 추가된 `wire:key`입니다. 이 속성 덕분에 주(state)가 변경될 때 "selectedCity" 값이 올바르게 초기화됩니다.

### 다중 선택 드롭다운 {#multi-select-dropdowns}

"multiple" 속성이 있는 select 메뉴를 사용하는 경우, Livewire는 예상대로 동작합니다. 이 예제에서는 선택된 주(state)가 `$states` 배열 속성에 추가되고, 선택 해제되면 배열에서 제거됩니다:

```blade
<select wire:model="states" multiple>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    ...
</select>
```

## 더 깊이 들어가기 {#going-deeper}

HTML 폼에서 `wire:model`을 사용하는 것에 대한 더 완전한 문서를 보려면 [Livewire 폼 문서 페이지](/docs/forms)를 방문하세요.
