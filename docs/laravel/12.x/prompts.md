# 프롬프트

























## 소개 {#introduction}

[Laravel Prompts](https://github.com/laravel/prompts)는 명령줄 애플리케이션에 아름답고 사용자 친화적인 폼을 추가할 수 있는 PHP 패키지로, 플레이스홀더 텍스트와 검증 등 브라우저와 유사한 기능을 제공합니다.

<img src="https://laravel.com/img/docs/prompts-example.png">

Laravel Prompts는 [Artisan 콘솔 명령어](/laravel/12.x/artisan#writing-commands)에서 사용자 입력을 받을 때 완벽하게 사용할 수 있으며, 모든 명령줄 PHP 프로젝트에서도 사용할 수 있습니다.

> [!NOTE]
> Laravel Prompts는 macOS, Linux, 그리고 WSL이 설치된 Windows를 지원합니다. 자세한 내용은 [지원되지 않는 환경 및 폴백](#fallbacks) 문서를 참고하세요.


## 설치 {#installation}

Laravel Prompts는 최신 Laravel 릴리즈에 이미 포함되어 있습니다.

Laravel Prompts는 Composer 패키지 매니저를 사용하여 다른 PHP 프로젝트에도 설치할 수 있습니다:

```shell
composer require laravel/prompts
```


## 사용 가능한 프롬프트 {#available-prompts}


### 텍스트 {#text}

`text` 함수는 주어진 질문으로 사용자의 입력을 받고, 그 값을 반환합니다:

```php
use function Laravel\Prompts\text;

$name = text('What is your name?');
```

플레이스홀더 텍스트, 기본값, 정보 힌트도 포함할 수 있습니다:

```php
$name = text(
    label: 'What is your name?',
    placeholder: 'E.g. Taylor Otwell',
    default: $user?->name,
    hint: 'This will be displayed on your profile.'
);
```


#### 필수 값 {#text-required}

입력이 필수라면 `required` 인자를 전달할 수 있습니다:

```php
$name = text(
    label: 'What is your name?',
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 문자열을 전달할 수도 있습니다:

```php
$name = text(
    label: 'What is your name?',
    required: 'Your name is required.'
);
```


#### 추가 검증 {#text-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$name = text(
    label: 'What is your name?',
    validate: fn (string $value) => match (true) {
        strlen($value) < 3 => 'The name must be at least 3 characters.',
        strlen($value) > 255 => 'The name must not exceed 255 characters.',
        default => null
    }
);
```

클로저는 입력된 값을 받아서 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해 `validate` 인자에 속성명과 원하는 검증 규칙이 담긴 배열을 전달하세요:

```php
$name = text(
    label: 'What is your name?',
    validate: ['name' => 'required|max:255|unique:users']
);
```


### 텍스트에어리어 {#textarea}

`textarea` 함수는 주어진 질문으로 사용자의 입력을 여러 줄로 받아 반환합니다:

```php
use function Laravel\Prompts\textarea;

$story = textarea('Tell me a story.');
```

플레이스홀더 텍스트, 기본값, 정보 힌트도 포함할 수 있습니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    placeholder: 'This is a story about...',
    hint: 'This will be displayed on your profile.'
);
```


#### 필수 값 {#textarea-required}

입력이 필수라면 `required` 인자를 전달할 수 있습니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 문자열을 전달할 수도 있습니다:

```php
$story = textarea(
    label: 'Tell me a story.',
    required: 'A story is required.'
);
```


#### 추가 검증 {#textarea-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

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

클로저는 입력된 값을 받아서 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해 `validate` 인자에 속성명과 원하는 검증 규칙이 담긴 배열을 전달하세요:

```php
$story = textarea(
    label: 'Tell me a story.',
    validate: ['story' => 'required|max:10000']
);
```


### 비밀번호 {#password}

`password` 함수는 `text` 함수와 유사하지만, 사용자가 콘솔에 입력할 때 입력값이 마스킹됩니다. 비밀번호와 같은 민감한 정보를 요청할 때 유용합니다:

```php
use function Laravel\Prompts\password;

$password = password('What is your password?');
```

플레이스홀더 텍스트와 정보 힌트도 포함할 수 있습니다:

```php
$password = password(
    label: 'What is your password?',
    placeholder: 'password',
    hint: 'Minimum 8 characters.'
);
```


#### 필수 값 {#password-required}

입력이 필수라면 `required` 인자를 전달할 수 있습니다:

```php
$password = password(
    label: 'What is your password?',
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 문자열을 전달할 수도 있습니다:

```php
$password = password(
    label: 'What is your password?',
    required: 'The password is required.'
);
```


#### 추가 검증 {#password-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$password = password(
    label: 'What is your password?',
    validate: fn (string $value) => match (true) {
        strlen($value) < 8 => 'The password must be at least 8 characters.',
        default => null
    }
);
```

클로저는 입력된 값을 받아서 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해 `validate` 인자에 속성명과 원하는 검증 규칙이 담긴 배열을 전달하세요:

```php
$password = password(
    label: 'What is your password?',
    validate: ['password' => 'min:8']
);
```


### 확인 {#confirm}

사용자에게 "예/아니오" 확인을 요청해야 할 때는 `confirm` 함수를 사용할 수 있습니다. 사용자는 방향키 또는 `y`, `n` 키로 응답을 선택할 수 있습니다. 이 함수는 `true` 또는 `false`를 반환합니다.

```php
use function Laravel\Prompts\confirm;

$confirmed = confirm('Do you accept the terms?');
```

기본값, "예"와 "아니오" 라벨의 커스텀 문구, 정보 힌트도 포함할 수 있습니다:

```php
$confirmed = confirm(
    label: 'Do you accept the terms?',
    default: false,
    yes: 'I accept',
    no: 'I decline',
    hint: 'The terms must be accepted to continue.'
);
```


#### "예" 필수 선택 {#confirm-required}

필요하다면, `required` 인자를 전달하여 사용자가 반드시 "예"를 선택하도록 할 수 있습니다:

```php
$confirmed = confirm(
    label: 'Do you accept the terms?',
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 문자열을 전달할 수도 있습니다:

```php
$confirmed = confirm(
    label: 'Do you accept the terms?',
    required: 'You must accept the terms to continue.'
);
```


### 선택 {#select}

사용자가 미리 정의된 선택지 중에서 하나를 선택해야 할 때는 `select` 함수를 사용할 수 있습니다:

```php
use function Laravel\Prompts\select;

$role = select(
    label: 'What role should the user have?',
    options: ['Member', 'Contributor', 'Owner']
);
```

기본 선택값과 정보 힌트도 지정할 수 있습니다:

```php
$role = select(
    label: 'What role should the user have?',
    options: ['Member', 'Contributor', 'Owner'],
    default: 'Owner',
    hint: 'The role may be changed at any time.'
);
```

`options` 인자에 연관 배열을 전달하면 선택된 키가 반환됩니다:

```php
$role = select(
    label: 'What role should the user have?',
    options: [
        'member' => 'Member',
        'contributor' => 'Contributor',
        'owner' => 'Owner',
    ],
    default: 'owner'
);
```

최대 5개의 옵션이 표시되며, 그 이상은 스크롤이 생깁니다. `scroll` 인자로 표시 개수를 조정할 수 있습니다:

```php
$role = select(
    label: 'Which category would you like to assign?',
    options: Category::pluck('name', 'id'),
    scroll: 10
);
```


#### 추가 검증 {#select-validation}

다른 프롬프트 함수와 달리, `select` 함수는 `required` 인자를 받지 않습니다. 아무것도 선택하지 않는 것이 불가능하기 때문입니다. 하지만, 특정 옵션을 표시하되 선택을 막고 싶다면 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$role = select(
    label: 'What role should the user have?',
    options: [
        'member' => 'Member',
        'contributor' => 'Contributor',
        'owner' => 'Owner',
    ],
    validate: fn (string $value) =>
        $value === 'owner' && User::where('role', 'owner')->exists()
            ? 'An owner already exists.'
            : null
);
```

`options` 인자가 연관 배열이면 클로저는 선택된 키를, 아니면 값을 받습니다. 클로저는 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.


### 다중 선택 {#multiselect}

사용자가 여러 옵션을 선택할 수 있도록 하려면 `multiselect` 함수를 사용할 수 있습니다:

```php
use function Laravel\Prompts\multiselect;

$permissions = multiselect(
    label: 'What permissions should be assigned?',
    options: ['Read', 'Create', 'Update', 'Delete']
);
```

기본 선택값과 정보 힌트도 지정할 수 있습니다:

```php
use function Laravel\Prompts\multiselect;

$permissions = multiselect(
    label: 'What permissions should be assigned?',
    options: ['Read', 'Create', 'Update', 'Delete'],
    default: ['Read', 'Create'],
    hint: 'Permissions may be updated at any time.'
);
```

`options` 인자에 연관 배열을 전달하면 선택된 옵션의 키가 반환됩니다:

```php
$permissions = multiselect(
    label: 'What permissions should be assigned?',
    options: [
        'read' => 'Read',
        'create' => 'Create',
        'update' => 'Update',
        'delete' => 'Delete',
    ],
    default: ['read', 'create']
);
```

최대 5개의 옵션이 표시되며, 그 이상은 스크롤이 생깁니다. `scroll` 인자로 표시 개수를 조정할 수 있습니다:

```php
$categories = multiselect(
    label: 'What categories should be assigned?',
    options: Category::pluck('name', 'id'),
    scroll: 10
);
```


#### 값 필수 선택 {#multiselect-required}

기본적으로 사용자는 0개 이상의 옵션을 선택할 수 있습니다. 하나 이상의 옵션 선택을 강제하려면 `required` 인자를 전달하세요:

```php
$categories = multiselect(
    label: 'What categories should be assigned?',
    options: Category::pluck('name', 'id'),
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 `required` 인자에 문자열을 전달할 수 있습니다:

```php
$categories = multiselect(
    label: 'What categories should be assigned?',
    options: Category::pluck('name', 'id'),
    required: 'You must select at least one category'
);
```


#### 추가 검증 {#multiselect-validation}

특정 옵션을 표시하되 선택을 막고 싶다면 `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$permissions = multiselect(
    label: 'What permissions should the user have?',
    options: [
        'read' => 'Read',
        'create' => 'Create',
        'update' => 'Update',
        'delete' => 'Delete',
    ],
    validate: fn (array $values) => ! in_array('read', $values)
        ? 'All users require the read permission.'
        : null
);
```

`options` 인자가 연관 배열이면 클로저는 선택된 키들을, 아니면 값을 받습니다. 클로저는 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.


### 추천 {#suggest}

`suggest` 함수는 자동완성 기능을 제공하여 가능한 선택지를 제안할 수 있습니다. 사용자는 자동완성 힌트와 상관없이 어떤 답변이든 입력할 수 있습니다:

```php
use function Laravel\Prompts\suggest;

$name = suggest('What is your name?', ['Taylor', 'Dayle']);
```

또는, `suggest` 함수의 두 번째 인자로 클로저를 전달할 수 있습니다. 사용자가 입력할 때마다 클로저가 호출되며, 현재까지 입력된 문자열을 받아 자동완성 옵션 배열을 반환해야 합니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: fn ($value) => collect(['Taylor', 'Dayle'])
        ->filter(fn ($name) => Str::contains($name, $value, ignoreCase: true))
)
```

플레이스홀더 텍스트, 기본값, 정보 힌트도 포함할 수 있습니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    placeholder: 'E.g. Taylor',
    default: $user?->name,
    hint: 'This will be displayed on your profile.'
);
```


#### 필수 값 {#suggest-required}

입력이 필수라면 `required` 인자를 전달할 수 있습니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 문자열을 전달할 수도 있습니다:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    required: 'Your name is required.'
);
```


#### 추가 검증 {#suggest-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

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

클로저는 입력된 값을 받아서 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.

또는, Laravel의 [validator](/laravel/12.x/validation) 기능을 활용할 수도 있습니다. 이를 위해 `validate` 인자에 속성명과 원하는 검증 규칙이 담긴 배열을 전달하세요:

```php
$name = suggest(
    label: 'What is your name?',
    options: ['Taylor', 'Dayle'],
    validate: ['name' => 'required|min:3|max:255']
);
```


### 검색 {#search}

선택지가 많을 때, `search` 함수는 사용자가 검색어를 입력해 결과를 필터링한 후 방향키로 옵션을 선택할 수 있게 해줍니다:

```php
use function Laravel\Prompts\search;

$id = search(
    label: 'Search for the user that should receive the mail',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : []
);
```

클로저는 사용자가 입력한 텍스트를 받아 옵션 배열을 반환해야 합니다. 연관 배열을 반환하면 선택된 옵션의 키가, 아니면 값이 반환됩니다.

값을 반환할 배열을 필터링할 때는 `array_values` 함수나 `values` 컬렉션 메서드를 사용해 배열이 연관 배열이 되지 않도록 해야 합니다:

```php
$names = collect(['Taylor', 'Abigail']);

$selected = search(
    label: 'Search for the user that should receive the mail',
    options: fn (string $value) => $names
        ->filter(fn ($name) => Str::contains($name, $value, ignoreCase: true))
        ->values()
        ->all(),
);
```

플레이스홀더 텍스트와 정보 힌트도 포함할 수 있습니다:

```php
$id = search(
    label: 'Search for the user that should receive the mail',
    placeholder: 'E.g. Taylor Otwell',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    hint: 'The user will receive an email immediately.'
);
```

최대 5개의 옵션이 표시되며, 그 이상은 스크롤이 생깁니다. `scroll` 인자로 표시 개수를 조정할 수 있습니다:

```php
$id = search(
    label: 'Search for the user that should receive the mail',
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
    label: 'Search for the user that should receive the mail',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    validate: function (int|string $value) {
        $user = User::findOrFail($value);

        if ($user->opted_out) {
            return 'This user has opted-out of receiving mail.';
        }
    }
);
```

`options` 클로저가 연관 배열을 반환하면 클로저는 선택된 키를, 아니면 값을 받습니다. 클로저는 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.


### 다중 검색 {#multisearch}

검색 가능한 옵션이 많고, 사용자가 여러 항목을 선택해야 한다면 `multisearch` 함수를 사용할 수 있습니다. 사용자는 검색어를 입력해 결과를 필터링한 후 방향키와 스페이스바로 옵션을 선택할 수 있습니다:

```php
use function Laravel\Prompts\multisearch;

$ids = multisearch(
    'Search for the users that should receive the mail',
    fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : []
);
```

클로저는 사용자가 입력한 텍스트를 받아 옵션 배열을 반환해야 합니다. 연관 배열을 반환하면 선택된 옵션의 키들이, 아니면 값들이 반환됩니다.

값을 반환할 배열을 필터링할 때는 `array_values` 함수나 `values` 컬렉션 메서드를 사용해 배열이 연관 배열이 되지 않도록 해야 합니다:

```php
$names = collect(['Taylor', 'Abigail']);

$selected = multisearch(
    label: 'Search for the users that should receive the mail',
    options: fn (string $value) => $names
        ->filter(fn ($name) => Str::contains($name, $value, ignoreCase: true))
        ->values()
        ->all(),
);
```

플레이스홀더 텍스트와 정보 힌트도 포함할 수 있습니다:

```php
$ids = multisearch(
    label: 'Search for the users that should receive the mail',
    placeholder: 'E.g. Taylor Otwell',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    hint: 'The user will receive an email immediately.'
);
```

최대 5개의 옵션이 표시되며, 그 이상은 스크롤이 생깁니다. `scroll` 인자로 표시 개수를 조정할 수 있습니다:

```php
$ids = multisearch(
    label: 'Search for the users that should receive the mail',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    scroll: 10
);
```


#### 값 필수 선택 {#multisearch-required}

기본적으로 사용자는 0개 이상의 옵션을 선택할 수 있습니다. 하나 이상의 옵션 선택을 강제하려면 `required` 인자를 전달하세요:

```php
$ids = multisearch(
    label: 'Search for the users that should receive the mail',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    required: true
);
```

검증 메시지를 커스터마이즈하고 싶다면 `required` 인자에 문자열을 전달할 수 있습니다:

```php
$ids = multisearch(
    label: 'Search for the users that should receive the mail',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    required: 'You must select at least one user.'
);
```


#### 추가 검증 {#multisearch-validation}

추가적인 검증 로직을 수행하고 싶다면, `validate` 인자에 클로저를 전달할 수 있습니다:

```php
$ids = multisearch(
    label: 'Search for the users that should receive the mail',
    options: fn (string $value) => strlen($value) > 0
        ? User::whereLike('name', "%{$value}%")->pluck('name', 'id')->all()
        : [],
    validate: function (array $values) {
        $optedOut = User::whereLike('name', '%a%')->findMany($values);

        if ($optedOut->isNotEmpty()) {
            return $optedOut->pluck('name')->join(', ', ', and ').' have opted out.';
        }
    }
);
```

`options` 클로저가 연관 배열을 반환하면 클로저는 선택된 키들을, 아니면 값을 받습니다. 클로저는 에러 메시지(문자열) 또는 검증이 통과하면 `null`을 반환할 수 있습니다.


### 일시정지 {#pause}

`pause` 함수는 사용자에게 정보를 표시하고, Enter/Return 키를 눌러 계속 진행할지 확인할 때 사용할 수 있습니다:

```php
use function Laravel\Prompts\pause;

pause('Press ENTER to continue.');
```


## 검증 전 입력값 변환 {#transforming-input-before-validation}

때로는 검증 전에 프롬프트 입력값을 변환하고 싶을 수 있습니다. 예를 들어, 입력된 문자열의 공백을 제거하고 싶을 때가 있습니다. 이를 위해 많은 프롬프트 함수에서 `transform` 인자를 제공하며, 클로저를 받을 수 있습니다:

```php
$name = text(
    label: 'What is your name?',
    transform: fn (string $value) => trim($value),
    validate: fn (string $value) => match (true) {
        strlen($value) < 3 => 'The name must be at least 3 characters.',
        strlen($value) > 255 => 'The name must not exceed 255 characters.',
        default => null
    }
);
```


## 폼 {#forms}

여러 개의 프롬프트를 순차적으로 표시하여 정보를 수집한 후 추가 작업을 수행해야 할 때가 많습니다. `form` 함수를 사용하면 사용자가 작성할 수 있는 프롬프트 그룹을 만들 수 있습니다:

```php
use function Laravel\Prompts\form;

$responses = form()
    ->text('What is your name?', required: true)
    ->password('What is your password?', validate: ['password' => 'min:8'])
    ->confirm('Do you accept the terms?')
    ->submit();
```

`submit` 메서드는 폼의 모든 프롬프트 응답을 숫자 인덱스 배열로 반환합니다. 하지만, 각 프롬프트에 `name` 인자를 제공하면, 해당 이름으로 응답에 접근할 수 있습니다:

```php
use App\Models\User;
use function Laravel\Prompts\form;

$responses = form()
    ->text('What is your name?', required: true, name: 'name')
    ->password(
        label: 'What is your password?',
        validate: ['password' => 'min:8'],
        name: 'password'
    )
    ->confirm('Do you accept the terms?')
    ->submit();

User::create([
    'name' => $responses['name'],
    'password' => $responses['password'],
]);
```

`form` 함수를 사용할 때의 주요 이점은 사용자가 `CTRL + U`를 사용해 이전 프롬프트로 돌아갈 수 있다는 점입니다. 이를 통해 사용자는 실수를 수정하거나 선택을 변경할 수 있으며, 전체 폼을 취소하고 다시 시작할 필요가 없습니다.

폼 내에서 프롬프트를 더 세밀하게 제어해야 한다면, 프롬프트 함수를 직접 호출하는 대신 `add` 메서드를 사용할 수 있습니다. `add` 메서드는 사용자가 이전에 입력한 모든 응답을 전달받습니다:

```php
use function Laravel\Prompts\form;
use function Laravel\Prompts\outro;
use function Laravel\Prompts\text;

$responses = form()
    ->text('What is your name?', required: true, name: 'name')
    ->add(function ($responses) {
        return text("How old are you, {$responses['name']}?");
    }, name: 'age')
    ->submit();

outro("Your name is {$responses['name']} and you are {$responses['age']} years old.");
```


## 정보 메시지 {#informational-messages}

`note`, `info`, `warning`, `error`, `alert` 함수는 정보 메시지를 표시할 때 사용할 수 있습니다:

```php
use function Laravel\Prompts\info;

info('Package installed successfully.');
```


## 테이블 {#tables}

`table` 함수는 여러 행과 열의 데이터를 쉽게 표시할 수 있게 해줍니다. 열 이름과 테이블 데이터를 제공하기만 하면 됩니다:

```php
use function Laravel\Prompts\table;

table(
    headers: ['Name', 'Email'],
    rows: User::all(['name', 'email'])->toArray()
);
```


## 스핀 {#spin}

`spin` 함수는 지정된 콜백을 실행하는 동안 스피너와 선택적 메시지를 표시합니다. 이는 진행 중인 프로세스를 나타내며, 완료 시 콜백의 결과를 반환합니다:

```php
use function Laravel\Prompts\spin;

$response = spin(
    message: 'Fetching response...',
    callback: fn () => Http::get('http://example.com')
);
```

> [!WARNING]
> `spin` 함수는 스피너 애니메이션을 위해 `pcntl` PHP 확장 모듈이 필요합니다. 이 확장 모듈이 없으면 정적인 스피너가 대신 표시됩니다.


## 진행 바 {#progress}

오래 걸리는 작업의 경우, 진행 바를 표시해 사용자가 작업의 완료 정도를 알 수 있도록 하면 좋습니다. `progress` 함수를 사용하면 Laravel이 진행 바를 표시하고, 주어진 반복 가능한 값의 각 반복마다 진행도를 갱신합니다:

```php
use function Laravel\Prompts\progress;

$users = progress(
    label: 'Updating users',
    steps: User::all(),
    callback: fn ($user) => $this->performTask($user)
);
```

`progress` 함수는 map 함수처럼 동작하며, 콜백의 각 반복 반환값을 담은 배열을 반환합니다.

콜백은 `Laravel\Prompts\Progress` 인스턴스를 받아 각 반복마다 라벨과 힌트를 수정할 수도 있습니다:

```php
$users = progress(
    label: 'Updating users',
    steps: User::all(),
    callback: function ($user, $progress) {
        $progress
            ->label("Updating {$user->name}")
            ->hint("Created on {$user->created_at}");

        return $this->performTask($user);
    },
    hint: 'This may take some time.'
);
```

진행 바를 수동으로 제어해야 할 때도 있습니다. 먼저, 프로세스가 반복할 총 단계 수를 정의하세요. 그런 다음 각 항목을 처리한 후 `advance` 메서드로 진행 바를 갱신하세요:

```php
$progress = progress(label: 'Updating users', steps: 10);

$users = User::all();

$progress->start();

foreach ($users as $user) {
    $this->performTask($user);

    $progress->advance();
}

$progress->finish();
```


## 터미널 초기화 {#clear}

`clear` 함수는 사용자의 터미널을 초기화할 때 사용할 수 있습니다:

```php
use function Laravel\Prompts\clear;

clear();
```


## 터미널 고려사항 {#terminal-considerations}


#### 터미널 너비 {#terminal-width}

라벨, 옵션, 검증 메시지의 길이가 사용자의 터미널 "열" 수를 초과하면 자동으로 잘려서 표시됩니다. 사용자가 좁은 터미널을 사용할 수 있으므로, 이러한 문자열의 길이를 최소화하는 것이 좋습니다. 일반적으로 80자 터미널을 지원하려면 최대 74자가 안전합니다.


#### 터미널 높이 {#terminal-height}

`scroll` 인자를 받는 프롬프트의 경우, 설정된 값은 검증 메시지 공간을 포함해 사용자의 터미널 높이에 맞게 자동으로 줄어듭니다.


## 지원되지 않는 환경 및 폴백 {#fallbacks}

Laravel Prompts는 macOS, Linux, 그리고 WSL이 설치된 Windows를 지원합니다. Windows 버전의 PHP의 한계로 인해, 현재 WSL 외의 Windows에서는 Laravel Prompts를 사용할 수 없습니다.

이러한 이유로, Laravel Prompts는 [Symfony Console Question Helper](https://symfony.com/doc/current/components/console/helpers/questionhelper.html)와 같은 대체 구현으로 폴백을 지원합니다.

> [!NOTE]
> Laravel 프레임워크에서 Laravel Prompts를 사용할 때는 각 프롬프트에 대한 폴백이 이미 구성되어 있으며, 지원되지 않는 환경에서 자동으로 활성화됩니다.


#### 폴백 조건 {#fallback-conditions}

Laravel을 사용하지 않거나 폴백 동작이 사용되는 시점을 커스터마이즈해야 한다면, `Prompt` 클래스의 `fallbackWhen` 정적 메서드에 불리언 값을 전달할 수 있습니다:

```php
use Laravel\Prompts\Prompt;

Prompt::fallbackWhen(
    ! $input->isInteractive() || windows_os() || app()->runningUnitTests()
);
```


#### 폴백 동작 {#fallback-behavior}

Laravel을 사용하지 않거나 폴백 동작을 커스터마이즈해야 한다면, 각 프롬프트 클래스의 `fallbackUsing` 정적 메서드에 클로저를 전달할 수 있습니다:

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

폴백은 각 프롬프트 클래스별로 개별적으로 구성해야 합니다. 클로저는 프롬프트 클래스의 인스턴스를 받아 해당 프롬프트에 적합한 타입을 반환해야 합니다.
