# 프롬프트

























## 소개 {#introduction}

[Laravel Prompts](https://github.com/laravel/prompts)는 명령줄 애플리케이션에 아름답고 사용자 친화적인 폼을 추가할 수 있는 PHP 패키지로, 플레이스홀더 텍스트와 유효성 검사 등 브라우저와 유사한 기능을 제공합니다.

<img src="https://laravel.com/img/docs/prompts-example.png">

Laravel Prompts는 [Artisan 콘솔 명령어](/laravel/12.x/artisan#writing-commands)에서 사용자 입력을 받을 때 완벽하게 사용할 수 있으며, 모든 명령줄 PHP 프로젝트에서도 사용할 수 있습니다.

> [!NOTE]
> Laravel Prompts는 macOS, Linux, 그리고 WSL이 지원되는 Windows를 지원합니다. 더 자세한 내용은 [지원되지 않는 환경 및 대체 기능](#fallbacks) 문서를 참고하세요.


## 설치 {#installation}

Laravel Prompts는 최신 버전의 Laravel에 이미 포함되어 있습니다.

Laravel Prompts는 Composer 패키지 관리자를 사용하여 다른 PHP 프로젝트에도 설치할 수 있습니다:

```shell
composer require laravel/prompts
```


## 사용 가능한 프롬프트 {#available-prompts}


### 텍스트 {#text}

`text` 함수는 주어진 질문으로 사용자에게 입력을 요청하고, 입력값을 받아 반환합니다:

```php
use function Laravel\Prompts\text;

$name = text('당신의 이름은 무엇인가요?');
```

플레이스홀더 텍스트, 기본값, 안내 힌트도 포함할 수 있습니다:

```php
$name = text(
    label: '당신의 이름은 무엇인가요?',
    placeholder: '예: Taylor Otwell',
    default: $user?->name,
    hint: '이 정보는 프로필에 표시됩니다.'
);
```


#### 필수 값 {#text-required}

값 입력이 필수인 경우, `required` 인자를 전달할 수 있습니다:

```php
$name = text(
    label: 'What is your name?',
    required: true
);
```

유효성 검사 메시지를 커스터마이즈하고 싶다면, 문자열을 전달할 수도 있습니다:

```php
$name = text(
    label: 'What is your name?',
    required: 'Your name is required.'
);
```


#### 추가 검증 {#text-validation}

마지막으로, 추가적인 검증 로직을 수행하고 싶다면 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$name = text(
    label: 'What is your name?',
    validate: fn (string $value) => match (true) {
        strlen($value) < 3 => '이름은 최소 3자 이상이어야 합니다.',
        strlen($value) > 255 => '이름은 255자를 초과할 수 없습니다.',
        default => null
    }
);
```

클로저는 입력된 값을 전달받으며, 에러 메시지를 반환하거나 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해, 속성명과 원하는 검증 규칙이 담긴 배열을 `validate` 인자에 전달하면 됩니다:

```php
$name = text(
    label: 'What is your name?',
    validate: ['name' => 'required|max:255|unique:users']
);
```


### Textarea {#textarea}

`textarea` 함수는 주어진 질문으로 사용자에게 프롬프트를 표시하고, 사용자의 입력을 여러 줄의 textarea로 받아 반환합니다:

```php
use function Laravel\Prompts\textarea;

$story = textarea('이야기를 들려주세요.');
```

플레이스홀더 텍스트, 기본값, 정보성 힌트도 포함할 수 있습니다:

```php
$story = textarea(
    label: '이야기를 들려주세요.',
    placeholder: '이것은 ...에 대한 이야기입니다.',
    hint: '이 내용은 프로필에 표시됩니다.'
);
```


#### 필수 값 {#textarea-required}

값 입력이 필수인 경우, `required` 인자를 전달할 수 있습니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    required: true
);
```

유효성 검사 메시지를 커스터마이즈하고 싶다면, 문자열을 전달할 수도 있습니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    required: 'A story is required.'
);
```


#### 추가 검증 {#textarea-validation}

마지막으로, 추가적인 검증 로직을 수행하고 싶다면 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    validate: fn (string $value) => match (true) {
        strlen($value) < 250 => 'The story must be at least 250 characters.',
        strlen($value) > 10000 => 'The story must not exceed 10,000 characters.',
        default => null
    }
);
```

클로저는 입력된 값을 전달받으며, 에러 메시지를 반환하거나 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해, 속성 이름과 원하는 검증 규칙이 담긴 배열을 `validate` 인자에 전달하면 됩니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    validate: ['story' => 'required|max:10000']
);
```


### 비밀번호 {#password}

`password` 함수는 `text` 함수와 비슷하지만, 사용자가 콘솔에 입력할 때 입력값이 마스킹됩니다. 이는 비밀번호와 같은 민감한 정보를 요청할 때 유용합니다:

```php
use function Laravel\Prompts\password;

$password = password('What is your password?');
```

플레이스홀더 텍스트와 안내 힌트도 포함할 수 있습니다:

```php
$password = password(
    label: 'What is your password?',
    placeholder: 'password',
    hint: '최소 8자 이상 입력하세요.'
);
```


#### 필수 값 {#password-required}

값 입력이 필수인 경우, `required` 인자를 전달할 수 있습니다:

```php
$password = password(
    label: '비밀번호를 입력하세요.',
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면, 문자열을 전달할 수도 있습니다:

```php
$password = password(
    label: '비밀번호를 입력하세요.',
    required: '비밀번호는 필수 항목입니다.'
);
```


#### 추가 검증 {#password-validation}

마지막으로, 추가적인 검증 로직을 수행하고 싶다면 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$password = password(
    label: 'What is your password?',
    validate: fn (string $value) => match (true) {
        strlen($value) < 8 => '비밀번호는 최소 8자 이상이어야 합니다.',
        default => null
    }
);
```

클로저는 입력된 값을 전달받으며, 에러 메시지를 반환하거나 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해 `validate` 인자에 속성명과 원하는 검증 규칙이 담긴 배열을 전달하면 됩니다:

```php
$password = password(
    label: 'What is your password?',
    validate: ['password' => 'min:8']
);
```


### 확인 {#confirm}

사용자에게 "예 또는 아니오" 확인을 요청해야 하는 경우, `confirm` 함수를 사용할 수 있습니다. 사용자는 방향키를 사용하거나 `y` 또는 `n` 키를 눌러 응답을 선택할 수 있습니다. 이 함수는 `true` 또는 `false` 중 하나를 반환합니다.

```php
use function Laravel\Prompts\confirm;

$confirmed = confirm('약관에 동의하십니까?');
```

기본값, "예"와 "아니오" 라벨의 맞춤 문구, 그리고 안내 힌트도 포함할 수 있습니다:

```php
$confirmed = confirm(
    label: '약관에 동의하십니까?',
    default: false,
    yes: '동의합니다',
    no: '동의하지 않습니다',
    hint: '계속하려면 약관에 동의해야 합니다.'
);
```


#### "예" 선택 필수로 만들기 {#confirm-required}

필요하다면, `required` 인자를 전달하여 사용자가 반드시 "예"를 선택하도록 요구할 수 있습니다:

```php
$confirmed = confirm(
    label: '이용 약관에 동의하십니까?',
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면, 문자열을 전달할 수도 있습니다:

```php
$confirmed = confirm(
    label: '이용 약관에 동의하십니까?',
    required: '계속하려면 약관에 동의해야 합니다.'
);
```


### Select {#select}

미리 정의된 선택지 중에서 사용자가 선택하도록 해야 할 경우, `select` 함수를 사용할 수 있습니다:

```php
use function Laravel\Prompts\select;

$role = select(
    label: '사용자에게 어떤 역할을 부여하시겠습니까?',
    options: ['Member', 'Contributor', 'Owner']
);
```

기본 선택값과 안내 힌트도 지정할 수 있습니다:

```php
$role = select(
    label: '사용자에게 어떤 역할을 부여하시겠습니까?',
    options: ['Member', 'Contributor', 'Owner'],
    default: 'Owner',
    hint: '역할은 언제든지 변경할 수 있습니다.'
);
```

선택된 값 대신 키가 반환되도록 `options` 인자에 연관 배열을 전달할 수도 있습니다:

```php
$role = select(
    label: '사용자에게 어떤 역할을 부여하시겠습니까?',
    options: [
        'member' => 'Member',
        'contributor' => 'Contributor',
        'owner' => 'Owner',
    ],
    default: 'owner'
);
```

최대 다섯 개의 옵션이 표시되며, 그 이후에는 목록이 스크롤됩니다. `scroll` 인자를 전달하여 이 값을 조정할 수 있습니다:

```php
$role = select(
    label: '어떤 카테고리를 할당하시겠습니까?',
    options: Category::pluck('name', 'id'),
    scroll: 10
);
```


#### 추가 검증 {#select-validation}

다른 프롬프트 함수들과 달리, `select` 함수는 아무것도 선택하지 않는 것이 불가능하기 때문에 `required` 인자를 허용하지 않습니다. 하지만, 옵션을 표시하되 선택을 막고 싶을 경우 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$role = select(
    label: '사용자에게 어떤 역할을 부여하시겠습니까?',
    options: [
        'member' => '멤버',
        'contributor' => '기여자',
        'owner' => '소유자',
    ],
    validate: fn (string $value) =>
        $value === 'owner' && User::where('role', 'owner')->exists()
            ? '이미 소유자가 존재합니다.'
            : null
);
```

`options` 인자가 연관 배열인 경우, 클로저는 선택된 키를 받게 되며, 그렇지 않으면 선택된 값을 받게 됩니다. 클로저는 에러 메시지를 반환하거나, 검증이 통과하면 `null`을 반환할 수 있습니다.


### 다중 선택 {#multiselect}

사용자가 여러 옵션을 선택할 수 있도록 하려면 `multiselect` 함수를 사용할 수 있습니다:

```php
use function Laravel\Prompts\multiselect;

$permissions = multiselect(
    label: '어떤 권한을 할당하시겠습니까?',
    options: ['Read', 'Create', 'Update', 'Delete']
);
```

기본 선택값과 안내 힌트를 지정할 수도 있습니다:

```php
use function Laravel\Prompts\multiselect;

$permissions = multiselect(
    label: '어떤 권한을 할당하시겠습니까?',
    options: ['Read', 'Create', 'Update', 'Delete'],
    default: ['Read', 'Create'],
    hint: '권한은 언제든지 수정할 수 있습니다.'
);
```

`options` 인수에 연관 배열을 전달하여 선택된 옵션의 값을 반환하는 대신 키를 반환하도록 할 수도 있습니다:

```php
$permissions = multiselect(
    label: '어떤 권한을 할당하시겠습니까?',
    options: [
        'read' => 'Read',
        'create' => 'Create',
        'update' => 'Update',
        'delete' => 'Delete',
    ],
    default: ['read', 'create']
);
```

최대 다섯 개의 옵션이 표시되며, 그 이후에는 목록이 스크롤됩니다. `scroll` 인수를 전달하여 이 값을 조정할 수 있습니다:

```php
$categories = multiselect(
    label: '어떤 카테고리를 할당하시겠습니까?',
    options: Category::pluck('name', 'id'),
    scroll: 10
);
```


#### 값 필수 지정 {#multiselect-required}

기본적으로 사용자는 0개 이상의 옵션을 선택할 수 있습니다. 하나 이상의 옵션 선택을 강제하려면 `required` 인자를 전달하면 됩니다:

```php
$categories = multiselect(
    label: '어떤 카테고리를 할당하시겠습니까?',
    options: Category::pluck('name', 'id'),
    required: true
);
```

유효성 검사 메시지를 커스터마이즈하고 싶다면, `required` 인자에 문자열을 전달할 수 있습니다:

```php
$categories = multiselect(
    label: '어떤 카테고리를 할당하시겠습니까?',
    options: Category::pluck('name', 'id'),
    required: '최소 한 개의 카테고리를 선택해야 합니다'
);
```


#### 추가 검증 {#multiselect-validation}

옵션을 표시하되 선택을 방지해야 하는 경우, `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$permissions = multiselect(
    label: '사용자에게 어떤 권한을 부여하시겠습니까?',
    options: [
        'read' => '읽기',
        'create' => '생성',
        'update' => '수정',
        'delete' => '삭제',
    ],
    validate: fn (array $values) => ! in_array('read', $values)
        ? '모든 사용자는 읽기 권한이 필요합니다.'
        : null
);
```

`options` 인자가 연관 배열인 경우 클로저는 선택된 키들을 받으며, 그렇지 않으면 선택된 값들을 받게 됩니다. 클로저는 에러 메시지를 반환하거나, 검증이 통과되면 `null`을 반환할 수 있습니다.


### Suggest {#suggest}

`suggest` 함수는 가능한 선택지에 대한 자동 완성 기능을 제공하는 데 사용할 수 있습니다. 사용자는 자동 완성 힌트와 상관없이 어떤 답변이든 입력할 수 있습니다:

```php
use function Laravel\Prompts\suggest;

$name = suggest('당신의 이름은 무엇입니까?', ['Taylor', 'Dayle']);
```

또는, `suggest` 함수의 두 번째 인자로 클로저를 전달할 수도 있습니다. 이 클로저는 사용자가 입력 문자를 입력할 때마다 호출됩니다. 클로저는 지금까지 사용자가 입력한 문자열을 매개변수로 받아 자동 완성 옵션의 배열을 반환해야 합니다:

```php
$name = suggest(
    label: '당신의 이름은 무엇입니까?',
    options: fn ($value) => collect(['Taylor', 'Dayle'])
        ->filter(fn ($name) => Str::contains($name, $value, ignoreCase: true))
)
```

또한, 플레이스홀더 텍스트, 기본값, 안내 힌트도 포함할 수 있습니다:

```php
$name = suggest(
    label: '당신의 이름은 무엇입니까?',
    options: ['Taylor', 'Dayle'],
    placeholder: '예: Taylor',
    default: $user?->name,
    hint: '이 정보는 프로필에 표시됩니다.'
);
```


#### 필수 값 {#suggest-required}

값 입력이 필수인 경우, `required` 인자를 전달할 수 있습니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면, 문자열을 전달할 수도 있습니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    required: 'Your name is required.'
);
```


#### 추가 검증 {#suggest-validation}

마지막으로, 추가적인 검증 로직을 수행하고 싶다면 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    validate: fn (string $value) => match (true) {
        strlen($value) < 3 => 'The name must be at least 3 characters.',
        strlen($value) > 255 => 'The name must not exceed 255 characters.',
        default => null
    }
);
```

클로저는 입력된 값을 전달받으며, 에러 메시지를 반환하거나 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해, 속성 이름과 원하는 검증 규칙이 담긴 배열을 `validate` 인자에 전달하면 됩니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    validate: ['name' => 'required|min:3|max:255']
);
```


### 검색 {#search}

사용자가 선택할 수 있는 옵션이 많을 경우, `search` 함수를 사용하면 사용자가 검색어를 입력하여 결과를 필터링한 후, 방향키로 옵션을 선택할 수 있습니다:

```php
use function Laravel\Prompts\search;

$id = search(
    label: '메일을 받을 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : []
);
```

클로저는 지금까지 사용자가 입력한 텍스트를 전달받으며, 옵션 배열을 반환해야 합니다. 연관 배열을 반환하면 선택된 옵션의 키가 반환되고, 그렇지 않으면 값이 반환됩니다.

값을 반환하려는 배열을 필터링할 때는, 배열이 연관 배열이 되지 않도록 `array_values` 함수나 `values` 컬렉션 메서드를 사용해야 합니다:

```php
$names = collect(['Taylor', 'Abigail']);

$selected = search(
    label: '메일을 받을 사용자를 검색하세요',
    options: fn (string $value) => $names
        ->filter(fn ($name) => Str::contains($name, $value, ignoreCase: true))
        ->values()
        ->all(),
);
```

플레이스홀더 텍스트와 안내 힌트도 포함할 수 있습니다:

```php
$id = search(
    label: '메일을 받을 사용자를 검색하세요',
    placeholder: '예: Taylor Otwell',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    hint: '해당 사용자는 즉시 이메일을 받게 됩니다.'
);
```

최대 다섯 개의 옵션이 표시되며, 그 이상일 경우 목록이 스크롤됩니다. `scroll` 인자를 전달하여 이 값을 조정할 수 있습니다:

```php
$id = search(
    label: '메일을 받을 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    scroll: 10
);
```


#### 추가 검증 {#search-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$id = search(
    label: '메일을 받을 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    validate: function (int|string $value) {
        $user = User::findOrFail($value);

        if ($user->opted_out) {
            return '이 사용자는 메일 수신을 거부했습니다.';
        }
    }
);
```

`options` 클로저가 연관 배열을 반환하는 경우, 클로저는 선택된 키를 받게 되며, 그렇지 않으면 선택된 값을 받게 됩니다. 클로저는 에러 메시지를 반환하거나, 검증이 통과하면 `null`을 반환할 수 있습니다.


### 다중 검색 {#multisearch}

검색 가능한 옵션이 많고 사용자가 여러 항목을 선택할 수 있어야 하는 경우, `multisearch` 함수는 사용자가 검색어를 입력하여 결과를 필터링한 후, 방향키와 스페이스바를 사용해 옵션을 선택할 수 있도록 해줍니다:

```php
use function Laravel\Prompts\multisearch;

$ids = multisearch(
    '메일을 받을 사용자를 검색하세요',
    fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : []
);
```

클로저는 지금까지 사용자가 입력한 텍스트를 전달받으며, 옵션의 배열을 반환해야 합니다. 연관 배열을 반환하면 선택된 옵션의 키가 반환되고, 그렇지 않으면 값이 반환됩니다.

값을 반환하려는 배열을 필터링할 때는, 배열이 연관 배열이 되지 않도록 `array_values` 함수나 `values` 컬렉션 메서드를 사용해야 합니다:

```php
$names = collect(['Taylor', 'Abigail']);

$selected = multisearch(
    label: '메일을 받을 사용자를 검색하세요',
    options: fn (string $value) => $names
        ->filter(fn ($name) => Str::contains($name, $value, ignoreCase: true))
        ->values()
        ->all(),
);
```

플레이스홀더 텍스트와 안내 힌트도 포함할 수 있습니다:

```php
$ids = multisearch(
    label: '메일을 받을 사용자를 검색하세요',
    placeholder: '예: Taylor Otwell',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    hint: '해당 사용자는 즉시 이메일을 받게 됩니다.'
);
```

최대 다섯 개의 옵션이 표시되며, 그 이후에는 목록이 스크롤됩니다. `scroll` 인자를 제공하여 이 값을 커스터마이즈할 수 있습니다:

```php
$ids = multisearch(
    label: '메일을 받을 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    scroll: 10
);
```


#### 값 필수 지정 {#multisearch-required}

기본적으로 사용자는 0개 이상의 옵션을 선택할 수 있습니다. 하나 이상의 옵션 선택을 강제하려면 `required` 인자를 전달하면 됩니다:

```php
$ids = multisearch(
    label: '메일을 받아야 할 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면, `required` 인자에 문자열을 전달할 수도 있습니다:

```php
$ids = multisearch(
    label: '메일을 받아야 할 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    required: '최소 한 명의 사용자를 선택해야 합니다.'
);
```


#### 추가 검증 {#multisearch-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$ids = multisearch(
    label: '메일을 받아야 할 사용자를 검색하세요',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    validate: function (array $values) {
        $optedOut = User::whereLike('name', '%a%')->findMany($values);

        if ($optedOut->isNotEmpty()) {
            return $optedOut->pluck('name')->join(', ', ', 그리고 ').'님이 수신 거부하셨습니다.';
        }
    }
);
```

`options` 클로저가 연관 배열을 반환하는 경우, 클로저는 선택된 키들을 받게 됩니다. 그렇지 않으면 선택된 값들을 받게 됩니다. 클로저는 에러 메시지를 반환하거나, 검증이 통과하면 `null`을 반환할 수 있습니다.


### 일시정지 {#pause}

`pause` 함수는 사용자에게 정보를 표시하고, 사용자가 Enter / Return 키를 눌러 계속 진행하겠다는 의사를 확인할 때까지 대기하는 데 사용할 수 있습니다:

```php
use function Laravel\Prompts\pause;

pause('계속하려면 ENTER 키를 누르세요.');
```


## 유효성 검사 전에 입력값 변환하기 {#transforming-input-before-validation}

때때로 유효성 검사가 이루어지기 전에 프롬프트 입력값을 변환하고 싶을 수 있습니다. 예를 들어, 입력된 문자열에서 공백을 제거하고 싶을 때가 있습니다. 이를 위해 많은 프롬프트 함수들은 클로저를 인자로 받는 `transform` 인자를 제공합니다:

```php
$name = text(
    label: '당신의 이름은 무엇인가요?',
    transform: fn (string $value) => trim($value),
    validate: fn (string $value) => match (true) {
        strlen($value) < 3 => '이름은 최소 3자 이상이어야 합니다.',
        strlen($value) > 255 => '이름은 255자를 초과할 수 없습니다.',
        default => null
    }
);
```


## 폼 {#forms}

여러 번의 프롬프트를 순차적으로 표시하여 추가 작업을 수행하기 전에 정보를 수집해야 하는 경우가 많습니다. 이럴 때는 `form` 함수를 사용하여 사용자가 작성할 수 있는 프롬프트 그룹을 생성할 수 있습니다:

```php
use function Laravel\Prompts\form;

$responses = form()
    ->text('당신의 이름은 무엇인가요?', required: true)
    ->password('비밀번호를 입력하세요.', validate: ['password' => 'min:8'])
    ->confirm('약관에 동의하십니까?')
    ->submit();
```

`submit` 메서드는 폼의 모든 프롬프트에 대한 응답을 숫자 인덱스 배열로 반환합니다. 하지만 각 프롬프트에 `name` 인자를 통해 이름을 지정할 수도 있습니다. 이름이 지정된 경우, 해당 이름을 통해 프롬프트의 응답에 접근할 수 있습니다:

```php
use App\Models\User;
use function Laravel\Prompts\form;

$responses = form()
    ->text('당신의 이름은 무엇인가요?', required: true, name: 'name')
    ->password(
        label: '비밀번호를 입력하세요.',
        validate: ['password' => 'min:8'],
        name: 'password'
    )
    ->confirm('약관에 동의하십니까?')
    ->submit();

User::create([
    'name' => $responses['name'],
    'password' => $responses['password'],
]);
```

`form` 함수를 사용할 때의 주요 이점은 사용자가 `CTRL + U`를 사용하여 폼 내의 이전 프롬프트로 돌아갈 수 있다는 점입니다. 이를 통해 사용자는 전체 폼을 취소하고 다시 시작하지 않고도 실수를 수정하거나 선택을 변경할 수 있습니다.

폼 내의 프롬프트를 더 세밀하게 제어해야 하는 경우, 프롬프트 함수를 직접 호출하는 대신 `add` 메서드를 사용할 수 있습니다. `add` 메서드에는 사용자가 이전에 입력한 모든 응답이 전달됩니다:

```php
use function Laravel\Prompts\form;
use function Laravel\Prompts\outro;
use function Laravel\Prompts\text;

$responses = form()
    ->text('당신의 이름은 무엇인가요?', required: true, name: 'name')
    ->add(function ($responses) {
        return text("{$responses['name']}님, 나이가 어떻게 되시나요?");
    }, name: 'age')
    ->submit();

outro("당신의 이름은 {$responses['name']}이고, 나이는 {$responses['age']}세입니다.");
```


## 정보 메시지 {#informational-messages}

`note`, `info`, `warning`, `error`, `alert` 함수는 정보 메시지를 표시하는 데 사용할 수 있습니다:

```php
use function Laravel\Prompts\info;

info('패키지가 성공적으로 설치되었습니다.');
```


## 테이블 {#tables}

`table` 함수는 여러 행과 열의 데이터를 쉽게 표시할 수 있도록 해줍니다. 열 이름과 테이블에 들어갈 데이터만 제공하면 됩니다:

```php
use function Laravel\Prompts\table;

table(
    headers: ['Name', 'Email'],
    rows: User::all(['name', 'email'])->toArray()
);
```


## Spin {#spin}

`spin` 함수는 지정된 콜백을 실행하는 동안 스피너와 선택적인 메시지를 함께 표시합니다. 이 함수는 진행 중인 프로세스를 나타내며, 완료되면 콜백의 결과를 반환합니다:

```php
use function Laravel\Prompts\spin;

$response = spin(
    message: 'Fetching response...',
    callback: fn () => Http::get('http://example.com')
);
```

> [!WARNING]
> `spin` 함수는 스피너 애니메이션을 위해 `pcntl` PHP 확장 모듈이 필요합니다. 이 확장 모듈이 없을 경우, 스피너의 정적 버전이 대신 표시됩니다.


## 진행률 표시줄 {#progress}

오래 걸리는 작업의 경우, 작업이 얼마나 완료되었는지 사용자에게 알려주는 진행률 표시줄을 보여주는 것이 도움이 될 수 있습니다. `progress` 함수를 사용하면, Laravel은 주어진 반복 가능한 값에 대해 각 반복마다 진행률 표시줄을 표시하고 진행 상황을 업데이트합니다:

```php
use function Laravel\Prompts\progress;

$users = progress(
    label: '사용자 업데이트 중',
    steps: User::all(),
    callback: fn ($user) => $this->performTask($user)
);
```

`progress` 함수는 map 함수처럼 동작하며, 콜백의 각 반복에서 반환된 값을 포함하는 배열을 반환합니다.

콜백은 또한 `Laravel\Prompts\Progress` 인스턴스를 받아서, 각 반복마다 라벨과 힌트를 수정할 수 있습니다:

```php
$users = progress(
    label: '사용자 업데이트 중',
    steps: User::all(),
    callback: function ($user, $progress) {
        $progress
            ->label("{$user->name} 업데이트 중")
            ->hint("생성일: {$user->created_at}");

        return $this->performTask($user);
    },
    hint: '시간이 다소 걸릴 수 있습니다.'
);
```

때로는 진행률 표시줄의 진행을 더 수동적으로 제어해야 할 수도 있습니다. 먼저, 프로세스가 반복할 총 단계 수를 정의합니다. 그런 다음, 각 항목을 처리한 후 `advance` 메서드를 통해 진행률 표시줄을 진행시킵니다:

```php
$progress = progress(label: '사용자 업데이트 중', steps: 10);

$users = User::all();

$progress->start();

foreach ($users as $user) {
    $this->performTask($user);

    $progress->advance();
}

$progress->finish();
```


## 터미널 지우기 {#clear}

`clear` 함수를 사용하여 사용자의 터미널을 지울 수 있습니다:

```php
use function Laravel\Prompts\clear;

clear();
```


## 터미널 고려사항 {#terminal-considerations}


#### 터미널 너비 {#terminal-width}

라벨, 옵션, 또는 검증 메시지의 길이가 사용자의 터미널 "열" 수를 초과하면, 자동으로 잘려서 표시됩니다. 사용자가 더 좁은 터미널을 사용할 수 있다면 이러한 문자열의 길이를 최소화하는 것이 좋습니다. 일반적으로 80자 너비의 터미널을 지원하기 위해 안전한 최대 길이는 74자입니다.


#### 터미널 높이 {#terminal-height}

`scroll` 인자를 허용하는 모든 프롬프트에 대해, 설정된 값은 검증 메시지를 위한 공간을 포함하여 사용자의 터미널 높이에 맞게 자동으로 조정됩니다.


## 지원되지 않는 환경 및 대체 기능 {#fallbacks}

Laravel Prompts는 macOS, Linux, 그리고 WSL이 설치된 Windows를 지원합니다. Windows용 PHP의 한계로 인해, 현재 WSL 외부의 Windows에서는 Laravel Prompts를 사용할 수 없습니다.

이러한 이유로, Laravel Prompts는 [Symfony Console Question Helper](https://symfony.com/doc/current/components/console/helpers/questionhelper.html)와 같은 대체 구현으로의 폴백(fallback)을 지원합니다.

> [!NOTE]
> Laravel 프레임워크와 함께 Laravel Prompts를 사용할 때, 각 프롬프트에 대한 폴백이 이미 구성되어 있으며, 지원되지 않는 환경에서는 자동으로 활성화됩니다.


#### 폴백 조건 {#fallback-conditions}

Laravel을 사용하지 않거나 폴백 동작이 사용되는 시점을 커스터마이즈해야 하는 경우, `Prompt` 클래스의 `fallbackWhen` 정적 메서드에 불리언 값을 전달할 수 있습니다:

```php
use Laravel\Prompts\Prompt;

Prompt::fallbackWhen(
    ! $input->isInteractive() || windows_os() || app()->runningUnitTests()
);
```


#### 폴백 동작 {#fallback-behavior}

Laravel을 사용하지 않거나 폴백 동작을 커스터마이즈해야 하는 경우, 각 프롬프트 클래스의 `fallbackUsing` 정적 메서드에 클로저를 전달할 수 있습니다:

```php
use Laravel\Prompts\TextPrompt;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;

TextPrompt::fallbackUsing(function (TextPrompt $prompt) use ($input, $output) {
    $question = (new Question($prompt->label, $prompt->default ?: null))
        ->setValidator(function ($answer) use ($prompt) {
            if ($prompt->required && $answer === null) {
                throw new \RuntimeException(
                    is_string($prompt->required) ? $prompt->required : 'Required.'
                );
            }

            if ($prompt->validate) {
                $error = ($prompt->validate)($answer ?? '');

                if ($error) {
                    throw new \RuntimeException($error);
                }
            }

            return $answer;
        });

    return (new SymfonyStyle($input, $output))
        ->askQuestion($question);
});
```

폴백은 각 프롬프트 클래스별로 개별적으로 설정해야 합니다. 클로저는 프롬프트 클래스의 인스턴스를 전달받으며, 프롬프트에 적합한 타입을 반환해야 합니다.
