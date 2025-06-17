# 유효성 검사
Livewire는 사용자의 입력을 검증하고 피드백을 제공하는 과정을 최대한 쾌적하게 만들고자 합니다. Laravel의 검증 기능 위에 구축되어 있기 때문에, 기존의 지식을 활용할 수 있을 뿐만 아니라 실시간 검증과 같은 강력한 추가 기능도 제공합니다.

다음은 Livewire에서 가장 기본적인 검증 워크플로우를 보여주는 `CreatePost` 컴포넌트 예시입니다:
```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
        $validated = $this->validate([ // [tl! highlight:3]
			'title' => 'required|min:3',
			'content' => 'required|min:3',
        ]);

		Post::create($validated);

		return redirect()->to('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
	<input type="text" wire:model="title">
    <div>@error('title') {{ $message }} @enderror</div>

	<textarea wire:model="content"></textarea>
    <div>@error('content') {{ $message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

보시다시피, Livewire는 컴포넌트의 프로퍼티를 검증할 수 있는 `validate()` 메서드를 제공합니다. 이 메서드는 검증된 데이터 집합을 반환하며, 이를 안전하게 데이터베이스에 삽입할 수 있습니다.

프론트엔드에서는 Laravel의 기존 Blade 디렉티브를 사용하여 사용자에게 검증 메시지를 보여줄 수 있습니다.

자세한 내용은 [Blade에서 검증 에러를 렌더링하는 Laravel 공식 문서](https://laravel.com/docs/blade#validation-errors)를 참고하세요.

## 속성 검증 {#validate-attributes}

컴포넌트의 검증 규칙을 속성에 직접 연결하고 싶다면, Livewire의 `#[Validate]` 속성을 사용할 수 있습니다.

`#[Validate]`를 사용해 속성에 검증 규칙을 연결하면, Livewire는 각 업데이트 전에 해당 속성의 검증 규칙을 자동으로 실행합니다. 하지만, 데이터베이스에 데이터를 저장하기 전에 `$this->validate()`를 실행하여 업데이트되지 않은 속성들도 함께 검증하는 것이 좋습니다.

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3')] // [tl! highlight]
	public $title = '';

    #[Validate('required|min:3')] // [tl! highlight]
    public $content = '';

    public function save()
    {
        $this->validate();

		Post::create([
            'title' => $this->title,
            'content' => $this->content,
		]);

		return redirect()->to('/posts');
    }

    // ...
}
```

> [!info] 검증 속성은 Rule 객체를 지원하지 않습니다
> PHP 속성(Attribute)은 일반 문자열이나 배열과 같은 특정 문법만 허용합니다. 만약 Laravel의 Rule 객체(`Rule::exists(...)`)와 같은 런타임 문법을 사용하고 싶다면, 대신 컴포넌트에 [rules() 메서드 정의](#defining-a-rules-method)를 사용해야 합니다.
>
> Livewire에서 [Laravel Rule 객체 사용하기](#using-laravel-rule-objects) 문서를 참고하세요.

속성 검증 시점을 더 세밀하게 제어하고 싶다면, `#[Validate]` 속성에 `onUpdate: false` 파라미터를 전달할 수 있습니다. 이렇게 하면 자동 검증이 비활성화되고, `$this->validate()` 메서드를 사용해 수동으로 검증을 실행할 수 있습니다:

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3', onUpdate: false)]
	public $title = '';

    #[Validate('required|min:3', onUpdate: false)]
    public $content = '';

    public function save()
    {
        $validated = $this->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }

    // ...
}
```

### 사용자 지정 속성 이름 {#custom-attribute-name}

검증 메시지에 삽입되는 속성 이름을 사용자 지정하고 싶다면, `as: ` 파라미터를 사용할 수 있습니다:

```php
use Livewire\Attributes\Validate;

#[Validate('required', as: 'date of birth')]
public $dob;
```

위 코드에서 검증이 실패하면, Laravel은 검증 메시지에서 필드 이름으로 "dob" 대신 "date of birth"를 사용합니다. 생성되는 메시지는 "The dob field is required" 대신 "The date of birth field is required"가 됩니다.

### 사용자 지정 검증 메시지 {#custom-validation-message}

Laravel의 기본 검증 메시지를 우회하고 직접 메시지를 지정하려면, `#[Validate]` 속성에서 `message:` 파라미터를 사용할 수 있습니다:

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: '게시글 제목을 입력해주세요')]
public $title;
```

이제 이 속성에 대한 검증이 실패하면 "The title field is required" 대신 "게시글 제목을 입력해주세요"라는 메시지가 표시됩니다.

다른 규칙마다 다른 메시지를 추가하고 싶다면, 여러 개의 `#[Validate]` 속성을 간단히 추가하면 됩니다:

```php
#[Validate('required', message: '게시글 제목을 입력해주세요')]
#[Validate('min:3', message: '제목이 너무 짧습니다')]
public $title;
```

### 지역화 사용 안 함 {#opting-out-of-localization}

기본적으로 Livewire의 규칙 메시지와 속성은 Laravel의 번역 헬퍼인 `trans()`를 사용하여 지역화됩니다.

`#[Validate]` 속성에 `translate: false` 파라미터를 전달하여 지역화를 사용하지 않도록 설정할 수 있습니다:

```php
#[Validate('required', message: 'Please provide a post title', translate: false)]
public $title;
```

### 사용자 지정 키 {#custom-key}

`#[Validate]` 속성을 사용하여 속성에 직접 유효성 검사 규칙을 적용할 때, Livewire는 기본적으로 유효성 검사 키를 해당 속성의 이름으로 간주합니다. 그러나 때로는 유효성 검사 키를 사용자 지정하고 싶을 때가 있습니다.

예를 들어, 배열 속성과 그 하위 항목에 대해 별도의 유효성 검사 규칙을 제공하고 싶을 수 있습니다. 이 경우, `#[Validate]` 속성의 첫 번째 인자로 유효성 검사 규칙을 전달하는 대신, 키-값 쌍의 배열을 전달할 수 있습니다:

```php
#[Validate([
    'todos' => 'required',
    'todos.*' => [
        'required',
        'min:3',
        new Uppercase,
    ],
])]
public $todos = [];
```

이제 사용자가 `$todos`를 업데이트하거나 `validate()` 메서드가 호출될 때, 이 두 가지 유효성 검사 규칙이 모두 적용됩니다.

## 폼 객체 {#form-objects}

Livewire 컴포넌트에 속성과 유효성 검사 규칙이 많아질수록 코드가 복잡해질 수 있습니다. 이러한 문제를 완화하고 코드 재사용을 위한 유용한 추상화를 제공하기 위해, Livewire의 *폼 객체*를 사용하여 속성과 유효성 검사 규칙을 저장할 수 있습니다.

아래는 동일한 `CreatePost` 예제이지만, 이제 속성과 규칙이 `PostForm`이라는 전용 폼 객체로 분리되었습니다:

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:3')]
	public $title = '';

    #[Validate('required|min:3')]
    public $content = '';
}
```

위의 `PostForm`은 이제 `CreatePost` 컴포넌트의 속성으로 정의할 수 있습니다:

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
		Post::create(
    		$this->form->all()
    	);

		return redirect()->to('/posts');
    }

    // ...
}
```

보시다시피, 각 속성을 개별적으로 나열하는 대신, 폼 객체의 `->all()` 메서드를 사용하여 모든 속성 값을 가져올 수 있습니다.

또한, 템플릿에서 속성 이름을 참조할 때는 각 인스턴스 앞에 `form.`을 붙여야 합니다:

```blade
<form wire:submit="save">
	<input type="text" wire:model="form.title">
    <div>@error('form.title') {{ $message }} @enderror</div>

	<textarea wire:model="form.content"></textarea>
    <div>@error('form.content') {{ $message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

폼 객체를 사용할 때, `#[Validate]` 속성의 유효성 검사는 속성이 업데이트될 때마다 실행됩니다. 그러나 이 동작을 `onUpdate: false`로 비활성화하면, `$this->form->validate()`를 사용하여 폼 객체의 유효성 검사를 수동으로 실행할 수 있습니다:

```php
public function save()
{
    Post::create(
        $this->form->validate()
    );

    return redirect()->to('/posts');
}
```

폼 객체는 대부분의 대용량 데이터셋에 유용한 추상화이며, 이를 더욱 강력하게 만들어주는 다양한 추가 기능을 제공합니다. 더 자세한 내용은 [폼 객체 문서](/livewire/3.x/forms#extracting-a-form-object)를 참고하세요.

## 실시간 검증 {#real-time-validation}

실시간 검증이란 사용자가 폼을 작성하는 도중에 입력값을 검증하는 것을 의미하며, 폼 제출을 기다리지 않습니다.

Livewire 속성에 `#[Validate]` 속성을 직접 사용하면, 서버에서 속성 값이 업데이트될 때마다 네트워크 요청이 전송되고, 지정된 검증 규칙이 적용됩니다.

즉, 특정 입력값에 대해 사용자에게 실시간 검증 경험을 제공하려면 추가적인 백엔드 작업이 필요하지 않습니다. 필요한 것은 필드가 작성될 때마다 Livewire가 네트워크 요청을 트리거하도록 `wire:model.live` 또는 `wire:model.blur`을 사용하는 것뿐입니다.

아래 예시에서는 텍스트 입력에 `wire:model.blur`이 추가되어 있습니다. 이제 사용자가 필드에 입력한 후 탭을 누르거나 필드 밖을 클릭하면, 업데이트된 값과 함께 네트워크 요청이 트리거되고 검증 규칙이 실행됩니다:

```blade
<form wire:submit="save">
    <input type="text" wire:model.blur="title">

    <!-- -->
</form>
```

만약 속성에 대한 검증 규칙을 선언할 때 `#[Validate]` 속성 대신 `rules()` 메서드를 사용하고 있다면, 실시간 검증 동작을 유지하기 위해 매개변수 없이 #[Validate] 속성을 추가할 수 있습니다:

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate] // [tl! highlight]
	public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => 'required|min:5',
            'content' => 'required|min:5',
        ];
    }

    public function save()
    {
        $validated = $this->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }
```

위 예시에서 비록 `#[Validate]`가 비어 있지만, 속성이 업데이트될 때마다 Livewire가 `rules()`에서 제공한 필드 검증을 실행하도록 지시합니다.

## 오류 메시지 사용자 지정 {#customizing-error-messages}

기본적으로 Laravel은 `$title` 속성에 `required` 규칙이 적용되어 있다면 "The title field is required."와 같은 합리적인 유효성 검사 메시지를 제공합니다.

하지만 애플리케이션과 사용자에게 더 적합하도록 이러한 오류 메시지의 언어를 사용자 지정해야 할 수도 있습니다.

### 사용자 지정 속성 이름 {#custom-attribute-names}

때때로 검증하려는 속성의 이름이 사용자에게 표시하기에 적합하지 않을 수 있습니다. 예를 들어, 앱의 데이터베이스 필드 이름이 `dob`이고 이것이 "생년월일"을 의미한다면, 사용자에게 "The dob field is required" 대신 "The date of birth field is required"와 같이 보여주고 싶을 것입니다.

Livewire에서는 `as: ` 파라미터를 사용하여 속성에 대한 대체 이름을 지정할 수 있습니다:

```php
use Livewire\Attributes\Validate;

#[Validate('required', as: 'date of birth')]
public $dob = '';
```

이제 `required` 검증 규칙이 실패하면, 오류 메시지는 "The dob field is required." 대신 "The date of birth field is required."라고 표시됩니다.

### 사용자 지정 메시지 {#custom-messages}

속성 이름을 커스터마이즈하는 것만으로는 충분하지 않다면, `message:` 파라미터를 사용하여 전체 유효성 검사 메시지를 커스터마이즈할 수 있습니다:

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: '생년월일을 입력해 주세요.')]
public $dob = '';
```

여러 규칙에 대해 각각 다른 메시지를 커스터마이즈해야 한다면, 아래와 같이 각 규칙마다 별도의 `#[Validate]` 속성을 사용하는 것이 좋습니다:

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: '제목을 입력해 주세요.')]
#[Validate('min:5', message: '제목이 너무 짧습니다.')]
public $title = '';
```

`#[Validate]` 속성의 배열 문법을 사용하고 싶다면, 아래와 같이 커스텀 속성과 메시지를 지정할 수 있습니다:

```php
use Livewire\Attributes\Validate;

#[Validate([
    'titles' => 'required',
    'titles.*' => 'required|min:5',
], message: [
    'required' => ':attribute 값이 누락되었습니다.',
    'titles.required' => ':attribute 값들이 누락되었습니다.',
    'min' => ':attribute 값이 너무 짧습니다.',
], attribute: [
    'titles.*' => '제목',
])]
public $titles = [];
```

## `rules()` 메서드 정의하기 {#defining-a-rules-method}

Livewire의 `#[Validate]` 속성 대신, 컴포넌트에 `rules()`라는 메서드를 정의하고 필드와 해당 검증 규칙 목록을 반환할 수 있습니다. 이는 PHP 속성에서 지원하지 않는 런타임 문법(예: `Rule::password()`와 같은 Laravel 규칙 객체)을 사용하려는 경우에 유용합니다.

이렇게 정의한 규칙들은 컴포넌트 내부에서 `$this->validate()`를 실행할 때 적용됩니다. 또한 `messages()`와 `validationAttributes()` 함수도 정의할 수 있습니다.

예시는 다음과 같습니다:

```php
use Livewire\Component;
use App\Models\Post;
use Illuminate\Validation\Rule;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    protected function rules() // [tl! highlight:6]
    {
        return [
            'title' => Rule::exists('posts', 'title'),
            'content' => 'required|min:3',
        ];
    }

    protected function messages() // [tl! highlight:6]
    {
        return [
            'content.required' => 'The :attribute are missing.',
            'content.min' => 'The :attribute is too short.',
        ];
    }

    protected function validationAttributes() // [tl! highlight:6]
    {
        return [
            'content' => 'description',
        ];
    }

    public function save()
    {
        $this->validate();

		Post::create([
            'title' => $this->title,
            'content' => $this->content,
		]);

		return redirect()->to('/posts');
    }

    // ...
}
```

> [!warning] `rules()` 메서드는 데이터 업데이트 시 자동 검증하지 않습니다
> `rules()` 메서드를 통해 규칙을 정의하면, Livewire는 `$this->validate()`를 실행할 때만 해당 검증 규칙을 적용합니다. 이는 `wire:model`과 같이 필드가 업데이트될 때마다 적용되는 표준 `#[Validate]` 속성과는 다릅니다. 필드가 업데이트될 때마다 검증 규칙을 적용하려면, 추가 파라미터 없이 `#[Validate]`를 계속 사용할 수 있습니다.

> [!warning] Livewire의 메커니즘과 충돌하지 않게 하세요
> Livewire의 검증 유틸리티를 사용할 때, 컴포넌트에 `rules`, `messages`, `validationAttributes`, `validationCustomValues`와 같은 이름의 프로퍼티나 메서드를 **정의하지 마세요**. 검증 프로세스를 커스터마이징하는 경우가 아니라면, 이러한 이름은 Livewire의 메커니즘과 충돌할 수 있습니다.

## Laravel Rule 객체 사용하기 {#using-laravel-rule-objects}

Laravel의 `Rule` 객체는 폼에 고급 검증 동작을 추가할 수 있는 매우 강력한 방법입니다.

아래는 Livewire의 `rules()` 메서드와 Rule 객체를 함께 사용하여 더 정교한 검증을 구현하는 예시입니다:

```php
<?php

namespace App\Livewire;

use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class UpdatePost extends Form
{
    public ?Post $post;

    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post), // [tl! highlight]
            ],
            'content' => 'required|min:5',
        ];
    }

    public function mount()
    {
        $this->title = $this->post->title;
        $this->content = $this->post->content;
    }

    public function update()
    {
        $this->validate(); // [tl! highlight]

        $this->post->update($this->all());

        $this->reset();
    }

    // ...
}
```

## 수동으로 유효성 검사 오류 제어하기 {#manually-controlling-validation-errors}

Livewire의 유효성 검사 유틸리티는 대부분의 일반적인 유효성 검사 시나리오를 처리할 수 있지만, 컴포넌트에서 유효성 검사 메시지를 완전히 제어하고 싶을 때가 있습니다.

아래는 Livewire 컴포넌트에서 유효성 검사 오류를 조작할 수 있는 모든 메서드입니다:

메서드 | 설명
--- | ---
`$this->addError([key], [message])` | 오류 백에 유효성 검사 메시지를 수동으로 추가합니다
`$this->resetValidation([?key])` | 제공된 키에 대한 유효성 검사 오류를 초기화하거나, 키가 없으면 모든 오류를 초기화합니다
`$this->getErrorBag()` | Livewire 컴포넌트에서 사용하는 기본 Laravel 오류 백을 가져옵니다

> [!info] Form 객체에서 `$this->addError()` 사용하기
> Form 객체 내부에서 `$this->addError`를 사용해 오류를 수동으로 추가할 때, 키는 부모 컴포넌트에서 해당 폼이 할당된 속성 이름으로 자동으로 접두사가 붙습니다. 예를 들어, 컴포넌트에서 폼을 `$data`라는 속성에 할당했다면, 키는 `data.key`가 됩니다.

## Validator 인스턴스에 접근하기 {#accessing-the-validator-instance}

때때로 `validate()` 메서드에서 Livewire가 내부적으로 사용하는 Validator 인스턴스에 접근하고 싶을 수 있습니다. 이는 `withValidator` 메서드를 사용하여 가능합니다. 제공하는 클로저는 완전히 생성된 validator를 인자로 받아, 실제로 검증 규칙이 평가되기 전에 해당 인스턴스의 어떤 메서드든 호출할 수 있습니다.

아래는 Livewire의 내부 validator를 가로채어 조건을 수동으로 확인하고 추가적인 검증 메시지를 추가하는 예시입니다:

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3')]
	public $title = '';

    #[Validate('required|min:3')]
    public $content = '';

    public function boot()
    {
        $this->withValidator(function ($validator) {
            $validator->after(function ($validator) {
                if (str($this->title)->startsWith('"')) {
                    $validator->errors()->add('title', '제목은 따옴표로 시작할 수 없습니다');
                }
            });
        });
    }

    public function save()
    {
		Post::create($this->all());

		return redirect()->to('/posts');
    }

    // ...
}
```

## 커스텀 유효성 검사기 사용하기 {#using-custom-validators}

Livewire에서 자체 유효성 검사 시스템을 사용하고 싶다면 문제 없습니다. Livewire는 컴포넌트 내부에서 발생하는 모든 `ValidationException` 예외를 포착하여, 마치 Livewire의 `validate()` 메서드를 사용하는 것처럼 뷰에 에러를 제공합니다.

아래는 `CreatePost` 컴포넌트의 예시입니다. Livewire의 유효성 검사 기능을 사용하는 대신, 완전히 커스텀한 유효성 검사기를 생성하여 컴포넌트 속성에 적용하고 있습니다:

```php
use Illuminate\Support\Facades\Validator;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
        $validated = Validator::make(
            // 검증할 데이터...
            ['title' => $this->title, 'content' => $this->content],

            // 적용할 유효성 검사 규칙...
            ['title' => 'required|min:3', 'content' => 'required|min:3'],

            // 커스텀 유효성 검사 메시지...
            ['required' => 'The :attribute field is required'],
         )->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }

    // ...
}
```

## 유효성 검사 테스트 {#testing-validation}

Livewire는 `assertHasErrors()` 메서드와 같이 유효성 검사 시나리오에 유용한 테스트 유틸리티를 제공합니다.

아래는 `title` 속성에 입력이 없을 경우 유효성 검사 오류가 발생하는지 확인하는 기본 테스트 케이스입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_cant_create_post_without_title()
    {
        Livewire::test(CreatePost::class)
            ->set('content', 'Sample content...')
            ->call('save')
            ->assertHasErrors('title');
    }
}
```

오류의 존재 여부를 테스트하는 것 외에도, `assertHasErrors`는 두 번째 인자로 검증할 규칙을 전달하여 특정 규칙에 대한 단언을 좁힐 수 있습니다:

```php
public function test_cant_create_post_with_title_shorter_than_3_characters()
{
    Livewire::test(CreatePost::class)
        ->set('title', 'Sa')
        ->set('content', 'Sample content...')
        ->call('save')
        ->assertHasErrors(['title' => ['min:3']]);
}
```

여러 속성에 대한 유효성 검사 오류의 존재도 동시에 단언할 수 있습니다:

```php
public function test_cant_create_post_without_title_and_content()
{
    Livewire::test(CreatePost::class)
        ->call('save')
        ->assertHasErrors(['title', 'content']);
}
```

Livewire에서 제공하는 다른 테스트 유틸리티에 대한 자세한 내용은 [테스트 문서](/livewire/3.x/testing)를 참고하세요.

## 더 이상 사용되지 않는 `[#Rule]` 속성 {#deprecated-rule-attribute}

Livewire v3가 처음 출시되었을 때, 검증 속성(`#[Rule]`)에 "Validate" 대신 "Rule"이라는 용어를 사용했습니다.

그러나 Laravel의 rule 객체와의 네이밍 충돌로 인해, 이후 `#[Validate]`로 변경되었습니다. Livewire v3에서는 두 가지 모두 지원되지만, 최신 상태를 유지하기 위해 모든 `#[Rule]`을 `#[Validate]`로 변경하는 것이 권장됩니다.
