---
title: 태그 입력
---
# [폼.필드] TagsInput

## 개요 {#overview}

태그 입력 컴포넌트는 태그 목록과 상호작용할 수 있도록 해줍니다.

기본적으로 태그는 JSON으로 저장됩니다:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
```

<AutoScreenshot name="forms/fields/tags-input/simple" alt="태그 입력" version="3.x" />

Eloquent를 사용하여 JSON 태그를 저장하는 경우, 모델 속성에 `array` [캐스트](/laravel/12.x/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $casts = [
        'tags' => 'array',
    ];

    // ...
}
```

> Filament는 [`spatie/laravel-tags`](https://github.com/spatie/laravel-tags)도 지원합니다. 자세한 내용은 [플러그인 문서](https://filamentphp.com/plugins/filament-spatie-tags)를 참고하세요.

## 쉼표로 구분된 태그 {#comma-separated-tags}

태그를 JSON 대신 구분된 문자열로 저장할 수 있습니다. 이를 설정하려면, `separator()` 메서드에 구분 문자를 전달하세요:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->separator(',')
```

## 자동완성 태그 제안 {#autocompleting-tag-suggestions}

태그 입력에 자동완성 제안을 추가할 수 있습니다. 이를 활성화하려면, `suggestions()` 메서드에 제안 배열을 전달하세요:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->suggestions([
        'tailwindcss',
        'alpinejs',
        'laravel',
        'livewire',
    ])
```

## 분할 키 정의하기 {#defining-split-keys}

분할 키를 사용하면 사용자의 키보드에서 특정 버튼을 눌러 새 태그를 만들 수 있습니다. 기본적으로 사용자가 "Enter"를 누르면 입력란에 새 태그가 생성됩니다. "Tab"이나 " "와 같은 다른 키도 새 태그를 생성하도록 정의할 수 있습니다. 이를 위해 `splitKeys()` 메서드에 키 배열을 전달하세요:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->splitKeys(['Tab', ' '])
```

[키에 대한 가능한 옵션에 대해 더 알아보기](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).

## 개별 태그에 접두사와 접미사 추가하기 {#adding-a-prefix-and-suffix-to-individual-tags}

필드의 실제 상태를 변경하지 않고 태그에 접두사와 접미사를 추가할 수 있습니다. 이는 저장하지 않고 사용자에게 표시 형식을 보여주고 싶을 때 유용합니다. `tagPrefix()` 또는 `tagSuffix()` 메서드를 사용하여 할 수 있습니다:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('percentages')
    ->tagSuffix('%')
```

## 태그 순서 변경하기 {#reordering-tags}

`reorderable()` 메서드를 사용하여 사용자가 필드 내에서 태그의 순서를 변경할 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->reorderable()
```

## 태그 색상 변경하기 {#changing-the-color-of-tags}

`color()` 메서드에 색상을 전달하여 태그의 색상을 변경할 수 있습니다. `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나일 수 있습니다:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->color('danger')
```

## 태그 유효성 검사 {#tags-validation}

`nestedRecursiveRules()` 메서드에 규칙 배열을 전달하여 각 태그에 대한 유효성 검사 규칙을 추가할 수 있습니다:

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->nestedRecursiveRules([
        'min:3',
        'max:255',
    ])
```
