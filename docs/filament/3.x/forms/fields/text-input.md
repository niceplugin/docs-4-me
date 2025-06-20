---
title: 텍스트 입력
---
# [폼.필드] TextInput

## 개요 {#overview}

텍스트 입력을 사용하면 문자열과 상호작용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
```

<AutoScreenshot name="forms/fields/text-input/simple" alt="텍스트 입력" version="3.x" />

## HTML 입력 타입 설정하기 {#setting-the-html-input-type}

여러 메서드를 사용하여 문자열의 타입을 설정할 수 있습니다. `email()`과 같은 일부 메서드는 유효성 검사도 제공합니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('text')
    ->email() // 또는
    ->numeric() // 또는
    ->integer() // 또는
    ->password() // 또는
    ->tel() // 또는
    ->url()
```

또는 `type()` 메서드를 사용하여 다른 [HTML 입력 타입](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)을 전달할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('backgroundColor')
    ->type('color')
```

## HTML 입력 모드 설정하기 {#setting-the-html-input-mode}

`inputMode()` 메서드를 사용하여 입력의 [`inputmode` 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#inputmode)을 설정할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('text')
    ->numeric()
    ->inputMode('decimal')
```

## 숫자 스텝 설정하기 {#setting-the-numeric-step}

`step()` 메서드를 사용하여 입력의 [`step` 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step)을 설정할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('number')
    ->numeric()
    ->step(100)
```

## 텍스트 자동완성 {#autocompleting-text}

`autocomplete()` 메서드를 사용하여 텍스트가 [브라우저에 의해 자동완성](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete)되도록 허용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->autocomplete('new-password')
```

`autocomplete="off"`의 단축키로, `autocomplete(false)`를 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->autocomplete(false)
```

더 복잡한 자동완성 옵션의 경우, 텍스트 입력은 [데이터리스트](#autocompleting-text-with-a-datalist)도 지원합니다.

### 데이터리스트로 텍스트 자동완성 {#autocompleting-text-with-a-datalist}

`datalist()` 메서드를 사용하여 텍스트 입력에 대한 [데이터리스트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) 옵션을 지정할 수 있습니다:

```php
TextInput::make('manufacturer')
    ->datalist([
        'BMW',
        'Ford',
        'Mercedes-Benz',
        'Porsche',
        'Toyota',
        'Tesla',
        'Volkswagen',
    ])
```

데이터리스트는 사용자가 텍스트 입력을 사용할 때 자동완성 옵션을 제공합니다. 하지만 이는 단순히 추천일 뿐이며, 사용자는 여전히 입력란에 어떤 값이든 입력할 수 있습니다. 사용자를 미리 정의된 옵션 집합으로 엄격하게 제한하려면 [select 필드](select)를 확인하세요.

## 텍스트 자동 대문자화 {#autocapitalizing-text}

`autocapitalize()` 메서드를 사용하여 텍스트가 [브라우저에 의해 자동으로 대문자화](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocapitalize)되도록 허용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->autocapitalize('words')
```

## 필드 옆에 접두/접미 텍스트 추가하기 {#adding-affix-text-aside-the-field}

`prefix()`와 `suffix()` 메서드를 사용하여 입력란 앞뒤에 텍스트를 배치할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

<AutoScreenshot name="forms/fields/text-input/affix" alt="접두/접미가 있는 텍스트 입력" version="3.x" />

### 아이콘을 접두/접미로 사용하기 {#using-icons-as-affixes}

`prefixIcon()`과 `suffixIcon()` 메서드를 사용하여 입력란 앞뒤에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 배치할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('domain')
    ->url()
    ->suffixIcon('heroicon-m-globe-alt')
```

<AutoScreenshot name="forms/fields/text-input/suffix-icon" alt="접미 아이콘이 있는 텍스트 입력" version="3.x" />

#### 접두/접미 아이콘 색상 설정하기 {#setting-the-affix-icons-color}

접두/접미 아이콘은 기본적으로 회색이지만, `prefixIconColor()`와 `suffixIconColor()` 메서드를 사용하여 다른 색상으로 설정할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('domain')
    ->url()
    ->suffixIcon('heroicon-m-check-circle')
    ->suffixIconColor('success')
```

## 비밀번호 입력 표시/숨김 기능 {#revealable-password-inputs}

`password()`를 사용할 때, 입력란을 `revealable()`로 만들어 사용자가 버튼을 클릭하여 입력 중인 비밀번호의 일반 텍스트 버전을 볼 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->revealable()
```

<AutoScreenshot name="forms/fields/text-input/revealable-password" alt="비밀번호 표시/숨김이 가능한 텍스트 입력" version="3.x" />

## 입력 마스킹 {#input-masking}

입력 마스킹은 입력 값이 반드시 따라야 하는 형식을 정의하는 관행입니다.

Filament에서는 `mask()` 메서드를 사용하여 [Alpine.js 마스크](https://alpinejs.dev/plugins/mask#x-mask)를 설정할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('birthday')
    ->mask('99/99/9999')
    ->placeholder('MM/DD/YYYY')
```

[동적 마스크](https://alpinejs.dev/plugins/mask#mask-functions)를 사용하려면, JavaScript를 `RawJs` 객체로 감싸세요:

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\RawJs;

TextInput::make('cardNumber')
    ->mask(RawJs::make(<<<'JS'
        $input.startsWith('34') || $input.startsWith('37') ? '9999 999999 99999' : '9999 9999 9999 9999'
    JS))
```

Alpine.js는 전체 마스킹된 값을 서버로 전송하므로, 필드를 검증하고 저장하기 전에 상태에서 특정 문자를 제거해야 할 수 있습니다. `stripCharacters()` 메서드를 사용하여 마스킹된 값에서 제거할 문자 또는 문자 배열을 전달할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\RawJs;

TextInput::make('amount')
    ->mask(RawJs::make('$money($input)'))
    ->stripCharacters(',')
    ->numeric()
```

## 필드를 읽기 전용으로 만들기 {#making-the-field-read-only}

[필드 비활성화](getting-started#disabling-a-field)와 혼동하지 마세요. `readOnly()` 메서드를 사용하여 필드를 "읽기 전용"으로 만들 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->readOnly()
```

[`disabled()`](getting-started#disabling-a-field)와 비교했을 때 몇 가지 차이점이 있습니다:

- `readOnly()`를 사용할 때, 폼이 제출되면 필드가 여전히 서버로 전송됩니다. 브라우저 콘솔이나 JavaScript로 변경될 수 있습니다. 이를 방지하려면 [`dehydrated(false)`](/filament/3.x/forms/advanced#preventing-a-field-from-being-dehydrated)를 사용할 수 있습니다.
- `readOnly()`를 사용할 때는 불투명도 감소와 같은 스타일 변경이 없습니다.
- `readOnly()`를 사용할 때 필드는 여전히 포커스가 가능합니다.

## 텍스트 입력 유효성 검사 {#text-input-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙 외에도, 텍스트 입력에만 해당하는 추가 규칙이 있습니다.

### 길이 유효성 검사 {#length-validation}

`minLength()`와 `maxLength()` 메서드를 설정하여 입력의 길이를 제한할 수 있습니다. 이 메서드들은 프론트엔드와 백엔드 모두에 유효성 검사를 추가합니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->minLength(2)
    ->maxLength(255)
```

`length()`를 설정하여 입력의 정확한 길이를 지정할 수도 있습니다. 이 메서드는 프론트엔드와 백엔드 모두에 유효성 검사를 추가합니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('code')
    ->length(8)
```

### 값 크기 유효성 검사 {#size-validation}

`minValue()`와 `maxValue()` 메서드를 설정하여 숫자 입력의 최소 및 최대 값을 검증할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('number')
    ->numeric()
    ->minValue(1)
    ->maxValue(100)
```

### 전화번호 유효성 검사 {#phone-number-validation}

`tel()` 필드를 사용할 때, 값은 다음 정규식으로 검증됩니다: `/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/`.

이를 변경하려면 `telRegex()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('phone')
    ->tel()
    ->telRegex('/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/')
```

또는, 모든 필드에서 `telRegex()`를 커스터마이즈하려면 서비스 프로바이더를 사용하세요:

```php
use Filament\Forms\Components\TextInput;

TextInput::configureUsing(function (TextInput $component): void {
    $component->telRegex('/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/');
});
```
