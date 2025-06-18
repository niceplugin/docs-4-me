---
title: 시작하기
---
# [폼] 시작하기

## 개요 {#overview}

Filament의 폼 패키지는 앱에서 동적인 폼을 쉽게 구축할 수 있도록 해줍니다. 이를 사용하여 [어떤 Livewire 컴포넌트에도 폼을 추가](adding-a-form-to-a-livewire-component)할 수 있습니다. 또한, 이 패키지는 다른 Filament 패키지 내에서도 [앱 리소스](../panels/resources/getting-started), [액션 모달](../actions/modals), [테이블 필터](../tables/filters/getting-started) 등에서 폼을 렌더링하는 데 사용됩니다. 폼을 만드는 방법을 배우는 것은 이러한 Filament 패키지들을 사용하는 데 필수적입니다.

이 가이드는 Filament의 폼 패키지로 폼을 만드는 기본적인 방법을 안내합니다. 만약 자신의 Livewire 컴포넌트에 새 폼을 추가하려는 경우, [먼저 이 작업을 진행](adding-a-form-to-a-livewire-component)한 후 다시 돌아오는 것이 좋습니다. [앱 리소스](../panels/resources/getting-started)나 다른 Filament 패키지에 폼을 추가하려는 경우라면, 바로 시작하셔도 됩니다!

## 폼 스키마 {#form-schemas}

모든 Filament 폼에는 "스키마"가 있습니다. 이것은 [필드](fields/getting-started#available-fields)와 [레이아웃 컴포넌트](/filament/3.x/forms/layout/getting-started#available-layout-components)를 포함하는 배열입니다.

필드는 사용자가 데이터를 입력하는 입력 요소입니다. 예를 들어, HTML의 `<input>` 또는 `<select>` 요소와 같습니다. 각 필드는 고유한 PHP 클래스를 가지고 있습니다. 예를 들어, [`TextInput`](fields/text-input) 클래스는 텍스트 입력 필드를 렌더링하는 데 사용되고, [`Select`](fields/select) 클래스는 셀렉트 필드를 렌더링하는 데 사용됩니다. 사용 가능한 [필드 전체 목록은 여기](fields/getting-started#available-fields)에서 확인할 수 있습니다.

레이아웃 컴포넌트는 필드를 그룹화하고, 표시 방식을 제어하는 데 사용됩니다. 예를 들어, [`Grid`](layout/grid#grid-component) 컴포넌트를 사용하면 여러 필드를 나란히 표시할 수 있고, [`Wizard`](layout/wizard)를 사용하면 필드를 여러 단계로 나누어 멀티스텝 폼을 만들 수 있습니다. 레이아웃 컴포넌트는 서로 깊게 중첩할 수 있어 매우 복잡한 반응형 UI를 만들 수 있습니다. 사용 가능한 [레이아웃 컴포넌트 전체 목록은 여기](/filament/3.x/forms/layout/getting-started#available-layout-components)에서 확인할 수 있습니다.

### 폼 스키마에 필드 추가하기 {#adding-fields-to-a-form-schema}

`make()` 메서드로 필드나 레이아웃 컴포넌트를 초기화하고, 여러 필드로 스키마 배열을 구성할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            TextInput::make('title'),
            TextInput::make('slug'),
            RichEditor::make('content'),
        ]);
}
```

<AutoScreenshot name="forms/getting-started/fields" alt="Form fields" version="3.x" />

패널이나 다른 패키지 내의 폼은 기본적으로 2개의 컬럼을 가집니다. 커스텀 폼에서는 `columns()` 메서드를 사용해 동일한 효과를 낼 수 있습니다:

```php
$form
    ->schema([
        // ...
    ])
    ->columns(2);
```

<AutoScreenshot name="forms/getting-started/columns" alt="Form fields in 2 columns" version="3.x" />

이제 `RichEditor`는 사용 가능한 너비의 절반만 차지하게 됩니다. `columnSpan()` 메서드를 사용해 전체 너비로 확장할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;

[
    TextInput::make('title'),
    TextInput::make('slug'),
    RichEditor::make('content')
        ->columnSpan(2), // 또는 `columnSpan('full')`
]
```

<AutoScreenshot name="forms/getting-started/column-span" alt="Form fields in 2 columns, but with the rich editor spanning the full width of the form" version="3.x" />

컬럼과 스팬에 대해 더 알고 싶다면 [레이아웃 문서](layout/grid)를 참고하세요. 반응형으로도 만들 수 있습니다!

### 폼 스키마에 레이아웃 컴포넌트 추가하기 {#adding-layout-components-to-a-form-schema}

이제 폼에 새로운 [`Section`](layout/section) 컴포넌트를 추가해보겠습니다. `Section`은 레이아웃 컴포넌트로, 여러 필드에 제목과 설명을 추가할 수 있습니다. 또한, 내부의 필드들을 접을 수 있게 하여 긴 폼에서 공간을 절약할 수 있습니다.

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;

[
    TextInput::make('title'),
    TextInput::make('slug'),
    RichEditor::make('content')
        ->columnSpan(2),
    Section::make('Publishing')
        ->description('이 게시글의 발행 설정입니다.')
        ->schema([
            // ...
        ]),
]
```

이 예시에서 볼 수 있듯이, `Section` 컴포넌트는 자체적으로 `schema()` 메서드를 가지고 있습니다. 이를 통해 다른 필드나 레이아웃 컴포넌트를 내부에 중첩시킬 수 있습니다:

```php
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;

Section::make('Publishing')
    ->description('이 게시글의 발행 설정입니다.')
    ->schema([
        Select::make('status')
            ->options([
                'draft' => '임시 저장',
                'reviewing' => '검토 중',
                'published' => '발행됨',
            ]),
        DateTimePicker::make('published_at'),
    ])
```

<AutoScreenshot name="forms/getting-started/section" alt="섹션 컴포넌트가 포함된 폼" version="3.x" />

이 섹션에는 [`Select` 필드](fields/select)와 [`DateTimePicker` 필드](fields/date-time-picker)가 포함되어 있습니다. 해당 필드와 기능에 대한 더 자세한 내용은 각 문서 페이지에서 확인할 수 있습니다.

## 필드 유효성 검사 {#validating-fields}

Laravel에서는 유효성 검사 규칙을 보통 `['required', 'max:255']`와 같은 배열이나 `required|max:255`와 같은 결합된 문자열로 정의합니다. 이런 방식은 단순한 폼 요청을 백엔드에서만 처리할 때는 괜찮습니다. 하지만 Filament는 사용자가 백엔드 요청 전에 실수를 바로잡을 수 있도록 프론트엔드 유효성 검사도 제공합니다.

Filament에서는 `required()`나 `maxLength()`와 같은 메서드를 사용하여 필드에 유효성 검사 규칙을 추가할 수 있습니다. 이 방식은 Laravel의 유효성 검사 문법보다도 유리한데, IDE에서 이러한 메서드를 자동완성해주기 때문입니다.

```php
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

[
    TextInput::make('title')
        ->required()
        ->maxLength(255),
    TextInput::make('slug')
        ->required()
        ->maxLength(255),
    RichEditor::make('content')
        ->columnSpan(2)
        ->maxLength(65535),
    Section::make('Publishing')
        ->description('이 게시글의 발행 설정입니다.')
        ->schema([
            Select::make('status')
                ->options([
                    'draft' => '임시 저장',
                    'reviewing' => '검토 중',
                    'published' => '발행됨',
                ])
                ->required(),
            DateTimePicker::make('published_at'),
        ]),
]
```

이 예시에서 일부 필드는 `required()`가 적용되어 있고, 일부는 `maxLength()`가 적용되어 있습니다. Filament는 [Laravel의 대부분의 유효성 검사 규칙에 해당하는 메서드](/filament/3.x/forms/validation#available-rules)를 제공하며, [사용자 정의 규칙](/filament/3.x/forms/validation#custom-rules)도 추가할 수 있습니다.

## 종속 필드 {#dependant-fields}

모든 Filament 폼은 Livewire 위에 구축되어 있기 때문에, 폼 스키마는 완전히 동적입니다. 다양한 가능성이 있지만, 이를 활용할 수 있는 몇 가지 예시를 소개합니다.

필드는 다른 필드의 값에 따라 숨기거나 표시할 수 있습니다. 예를 들어, 폼에서 `status` 필드가 `published`로 설정되기 전까지는 `published_at` 타임스탬프 필드를 숨길 수 있습니다. 이는 `hidden()` 메서드에 클로저를 전달하여 구현할 수 있으며, 폼이 사용되는 동안 동적으로 필드를 숨기거나 표시할 수 있습니다. 클로저는 `$get`과 같은 유용한 인자에 접근할 수 있으며, [전체 목록은 여기](/filament/3.x/forms/advanced#form-component-utility-injection)에서 확인할 수 있습니다. 의존하는 필드(`status`의 경우)는 `live()`로 설정해야 하며, 이는 해당 값이 변경될 때마다 폼 스키마를 다시 불러오도록 합니다.

```php
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Get;

[
    Select::make('status')
        ->options([
            'draft' => 'Draft',
            'reviewing' => 'Reviewing',
            'published' => 'Published',
        ])
        ->required()
        ->live(),
    DateTimePicker::make('published_at')
        ->hidden(fn (Get $get) => $get('status') !== 'published'),
]
```

`hidden()`뿐만 아니라, 모든 Filament 폼 메서드는 이와 같은 클로저를 지원합니다. 이를 활용해 다른 필드에 따라 라벨, 플레이스홀더, 옵션 등을 동적으로 변경할 수 있습니다. 심지어 폼에 새로운 필드를 추가하거나 제거하는 것도 가능합니다. 이 기능은 최소한의 노력으로 복잡한 폼을 만들 수 있게 해주는 강력한 도구입니다.

필드는 다른 필드에 데이터를 쓸 수도 있습니다. 예를 들어, 제목이 변경될 때마다 자동으로 슬러그를 생성하도록 할 수 있습니다. 이는 `afterStateUpdated()` 메서드에 클로저를 전달하여 구현할 수 있으며, 제목이 변경될 때마다 실행됩니다. 이 클로저는 제목(`$state`)과 슬러그 필드의 상태를 설정하는 함수(`$set`)에 접근할 수 있습니다. [클로저 인자의 전체 목록은 여기](/filament/3.x/forms/advanced#form-component-utility-injection)에서 확인할 수 있습니다. 의존하는 필드(`title`의 경우)는 `live()`로 설정해야 하며, 값이 변경될 때마다 폼이 다시 로드되고 슬러그가 설정됩니다.

```php
use Filament\Forms\Components\TextInput;
use Filament\Forms\Set;
use Illuminate\Support\Str;

[
    TextInput::make('title')
        ->required()
        ->maxLength(255)
        ->live()
        ->afterStateUpdated(function (Set $set, $state) {
            $set('slug', Str::slug($state));
        }),
    TextInput::make('slug')
        ->required()
        ->maxLength(255),
]
```

## 폼 패키지로 다음 단계 진행하기 {#next-steps-with-the-forms-package}

이제 이 가이드를 모두 읽으셨다면, 다음에는 무엇을 해야 할까요? 다음과 같은 제안을 드립니다:

- [사용자로부터 입력을 수집할 수 있는 다양한 필드를 살펴보세요.](fields/getting-started#available-fields)
- [직관적인 폼 구조를 만들 수 있는 레이아웃 컴포넌트 목록을 확인해보세요.](fields/getting-started#available-fields)
- [폼을 필요에 맞게 커스터마이즈할 수 있는 모든 고급 기법에 대해 알아보세요.](advanced)
- [도우미 메서드 모음을 활용해 폼에 대한 자동화된 테스트를 작성해보세요.](testing)
