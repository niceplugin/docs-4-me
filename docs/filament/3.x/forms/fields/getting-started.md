---
title: 시작하기
---
# [폼.필드] 시작하기

## 개요 {#overview}

필드 클래스는 `Filament\Form\Components` 네임스페이스에서 찾을 수 있습니다.

필드는 폼의 스키마 내에 위치하며, [레이아웃 컴포넌트](/filament/3.x/forms/layout/getting-started)와 함께 사용됩니다.

필드는 정적 `make()` 메서드를 사용하여 생성할 수 있으며, 고유한 이름을 전달합니다. 필드의 이름은 Livewire 컴포넌트의 속성과 일치해야 합니다. 배열의 키에 필드를 바인딩하려면 "점 표기법"을 사용할 수 있습니다.

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
```

<AutoScreenshot name="forms/fields/simple" alt="Form field" version="3.x" />

## 사용 가능한 필드 {#available-fields}

Filament는 다양한 유형의 데이터를 편집할 수 있도록 여러 종류의 필드를 기본으로 제공합니다:

- [텍스트 입력](text-input)
- [셀렉트](select)
- [체크박스](checkbox)
- [토글](toggle)
- [체크박스 리스트](checkbox-list)
- [라디오](radio)
- [날짜-시간 선택기](date-time-picker)
- [파일 업로드](file-upload)
- [리치 에디터](rich-editor)
- [마크다운 에디터](markdown-editor)
- [리피터](repeater)
- [빌더](builder)
- [태그 입력](tags-input)
- [텍스트에어리어](textarea)
- [키-값](key-value)
- [컬러 피커](color-picker)
- [토글 버튼](toggle-buttons)
- [히든](hidden)

또한 [사용자 정의 필드 생성](custom)을 통해 원하는 방식으로 데이터를 편집할 수 있습니다.

## 라벨 설정하기 {#setting-a-label}

기본적으로 필드의 라벨은 이름을 기반으로 자동으로 결정됩니다. 필드의 라벨을 재정의하려면 `label()` 메서드를 사용할 수 있습니다. 이 방법으로 라벨을 커스터마이즈하면 [로컬라이제이션을 위한 번역 문자열](/laravel/12.x/localization#retrieving-translation-strings)을 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->label(__('fields.name'))
```

선택적으로, `translateLabel()` 메서드를 사용하여 [라라벨의 로컬라이제이션 기능](/laravel/12.x/localization)으로 라벨을 자동 번역할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->translateLabel() // `label(__('Name'))`과 동일
```

## ID 설정하기 {#setting-an-id}

라벨과 마찬가지로, 필드 ID도 이름을 기반으로 자동으로 결정됩니다. 필드 ID를 재정의하려면 `id()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->id('name-field')
```

## 기본값 설정하기 {#setting-a-default-value}

필드는 기본값을 가질 수 있습니다. 이는 [폼의 `fill()` 메서드](getting-started#default-data)가 인자 없이 호출될 때 채워집니다. 기본값을 정의하려면 `default()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->default('John')
```

이 기본값은 폼이 기존 데이터 없이 로드될 때만 사용된다는 점에 유의하세요. [패널 리소스](/filament/3.x/panels/resources/getting-started#resource-forms) 내에서는 생성 페이지에서만 동작하며, 수정 페이지에서는 항상 모델의 데이터로 채워집니다.

## 필드 아래에 헬퍼 텍스트 추가하기 {#adding-helper-text-below-the-field}

때때로 폼 사용자에게 추가 정보를 제공하고 싶을 수 있습니다. 이를 위해 필드 아래에 헬퍼 텍스트를 추가할 수 있습니다.

`helperText()` 메서드를 사용하여 헬퍼 텍스트를 추가합니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->helperText('여기에 전체 이름을 입력하세요. 중간 이름도 포함됩니다.')
```

이 메서드는 일반 텍스트 문자열, 또는 `Illuminate\Support\HtmlString` 또는 `Illuminate\Contracts\Support\Htmlable`의 인스턴스를 받을 수 있습니다. 이를 통해 헬퍼 텍스트에 HTML이나 마크다운도 렌더링할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Support\HtmlString;

TextInput::make('name')
    ->helperText(new HtmlString('여기에 <strong>전체 이름</strong>을 입력하세요. 중간 이름도 포함됩니다.'))

TextInput::make('name')
    ->helperText(str('여기에 **전체 이름**을 입력하세요. 중간 이름도 포함됩니다.')->inlineMarkdown()->toHtmlString())

TextInput::make('name')
    ->helperText(view('name-helper-text'))
```

<AutoScreenshot name="forms/fields/helper-text" alt="Form field with helper text" version="3.x" />

## 라벨 옆에 힌트 추가하기 {#adding-a-hint-next-to-the-label}

[필드 아래의 헬퍼 텍스트](#adding-helper-text-below-the-field) 외에도, 필드의 라벨 옆에 "힌트"를 추가할 수 있습니다. 이는 필드에 대한 추가 정보(예: 도움말 페이지 링크)를 표시하는 데 유용합니다.

`hint()` 메서드를 사용하여 힌트를 추가합니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->hint('비밀번호를 잊으셨나요? 운이 없네요.')
```

이 메서드는 일반 텍스트 문자열, 또는 `Illuminate\Support\HtmlString` 또는 `Illuminate\Contracts\Support\Htmlable`의 인스턴스를 받을 수 있습니다. 이를 통해 헬퍼 텍스트에 HTML이나 마크다운도 렌더링할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Support\HtmlString;

TextInput::make('password')
    ->hint(new HtmlString('<a href="/forgotten-password">비밀번호를 잊으셨나요?</a>'))

TextInput::make('password')
    ->hint(str('[비밀번호를 잊으셨나요?](/forgotten-password)')->inlineMarkdown()->toHtmlString())

TextInput::make('password')
    ->hint(view('forgotten-password-hint'))
```

<AutoScreenshot name="forms/fields/hint" alt="Form field with hint" version="3.x" />

### 힌트의 텍스트 색상 변경하기 {#changing-the-text-color-of-the-hint}

힌트의 텍스트 색상을 변경할 수 있습니다. 기본값은 회색이지만, `danger`, `info`, `primary`, `success`, `warning`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->hint('번역 가능')
    ->hintColor('primary')
```

<AutoScreenshot name="forms/fields/hint-color" alt="Form field with hint color" version="3.x" />

### 힌트 옆에 아이콘 추가하기 {#adding-an-icon-aside-the-hint}

힌트 옆에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 렌더링할 수도 있습니다:

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->hint('번역 가능')
    ->hintIcon('heroicon-m-language')
```

<AutoScreenshot name="forms/fields/hint-icon" alt="Form field with hint icon" version="3.x" />

#### 힌트 아이콘에 툴팁 추가하기 {#adding-a-tooltip-to-a-hint-icon}

추가로, `hintIcon()`의 `tooltip` 파라미터를 사용하여 힌트 아이콘에 마우스를 올렸을 때 표시되는 툴팁을 추가할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->hintIcon('heroicon-m-question-mark-circle', tooltip: '추가 정보가 필요하신가요?')
```

## 추가 HTML 속성 부여하기 {#adding-extra-html-attributes}

필드에 추가 HTML 속성을 전달할 수 있으며, 이는 외부 DOM 요소에 병합됩니다. `extraAttributes()` 메서드에 속성 이름을 키로, 속성 값을 값으로 하는 배열을 전달하세요:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->extraAttributes(['title' => '텍스트 입력'])
```

일부 필드는 내부적으로 `<input>` 또는 `<select>` DOM 요소를 사용하지만, 이는 종종 필드의 외부 요소가 아닙니다. 이 경우 `extraAttributes()` 메서드는 원하는 대로 동작하지 않을 수 있습니다. 이럴 때는 `extraInputAttributes()` 메서드를 사용하여 `<input>` 또는 `<select>` 요소에 속성을 병합할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('categories')
    ->extraInputAttributes(['width' => 200])
```

라벨, 입력란, 기타 텍스트를 감싸는 필드 래퍼에도 추가 HTML 속성을 전달할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('categories')
    ->extraFieldWrapperAttributes(['class' => 'components-locked'])
```

## 필드 비활성화하기 {#disabling-a-field}

필드를 비활성화하여 사용자가 편집하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->disabled()
```

<AutoScreenshot name="forms/fields/disabled" alt="Disabled form field" version="3.x" />

선택적으로, 필드를 비활성화할지 여부를 제어하는 불리언 값을 전달할 수 있습니다:

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->disabled(! auth()->user()->isAdmin())
```

필드를 비활성화하면 저장되지 않습니다. 저장은 하되 편집만 막고 싶다면 `dehydrated()` 메서드를 사용하세요:

```php
Toggle::make('is_admin')
    ->disabled()
    ->dehydrated()
```

> 필드를 탈수(dehydrate)하도록 선택하면, 숙련된 사용자가 Livewire의 JavaScript를 조작하여 필드 값을 여전히 수정할 수 있습니다.

### 필드 숨기기 {#hiding-a-field}

필드를 숨길 수 있습니다:

 ```php
 use Filament\Forms\Components\TextInput;

 TextInput::make('name')
    ->hidden()
 ```

선택적으로, 필드를 숨길지 여부를 제어하는 불리언 값을 전달할 수 있습니다:

 ```php
 use Filament\Forms\Components\TextInput;

 TextInput::make('name')
    ->hidden(! auth()->user()->isAdmin())
 ```

## 폼이 로드될 때 필드 자동 포커스하기 {#autofocusing-a-field-when-the-form-is-loaded}

대부분의 필드는 자동 포커스가 가능합니다. 일반적으로, 사용자 경험을 위해 폼에서 가장 중요한 첫 번째 필드에 자동 포커스를 지정하는 것이 좋습니다. `autofocus()` 메서드를 사용하여 필드를 자동 포커스하도록 지정할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->autofocus()
```

## 플레이스홀더 설정하기 {#setting-a-placeholder}

많은 필드는 값이 없을 때 표시되는 플레이스홀더 값을 포함합니다. 이는 UI에 표시되지만, 필드가 값 없이 제출되면 저장되지 않습니다. `placeholder()` 메서드를 사용하여 이 플레이스홀더를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->placeholder('John Doe')
```

<AutoScreenshot name="forms/fields/placeholder" alt="Form field with placeholder" version="3.x" />

## 필드를 필수로 표시하기 {#marking-a-field-as-required}

기본적으로, [필수 필드](/filament/3.x/forms/validation#required)는 라벨 옆에 별표 `*`가 표시됩니다. 모든 필드가 필수인 폼이거나, 선택적 필드에 [힌트](#adding-a-hint-next-to-the-label)를 추가하는 것이 더 적합한 경우 별표를 숨기고 싶을 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->required() // 필수 필드임을 검증
    ->markAsRequired(false) // 별표 제거
```

필드가 `required()`가 아니지만, 별표 `*`를 표시하고 싶다면 `markAsRequired()`를 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->markAsRequired()
```

## 전역 설정 {#global-settings}

필드의 기본 동작을 전역적으로 변경하고 싶다면, 서비스 프로바이더의 `boot()` 메서드나 미들웨어 내에서 정적 `configureUsing()` 메서드를 호출할 수 있습니다. 컴포넌트를 수정할 수 있는 클로저를 전달하세요. 예를 들어, 모든 [체크박스를 `inline(false)`로](checkbox#positioning-the-label-above) 만들고 싶다면 다음과 같이 할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::configureUsing(function (Checkbox $checkbox): void {
    $checkbox->inline(false);
});
```

물론, 각 필드에서 이 동작을 개별적으로 덮어쓸 수도 있습니다:

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')
    ->inline()
```
