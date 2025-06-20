---
title: Textarea
---
# [폼.필드] Textarea

## 개요 {#overview}

textarea는 여러 줄의 문자열과 상호작용할 수 있게 해줍니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
```

<AutoScreenshot name="forms/fields/textarea/simple" alt="Textarea" version="3.x" />

## textarea 크기 조정하기 {#resizing-the-textarea}

`rows()`와 `cols()` 메서드를 정의하여 textarea의 크기를 변경할 수 있습니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->rows(10)
    ->cols(20)
```

### textarea 자동 크기 조정 {#autosizing-the-textarea}

`autosize()` 메서드를 설정하여 textarea가 내용에 맞게 자동으로 크기가 조정되도록 할 수 있습니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->autosize()
```

## 필드를 읽기 전용으로 만들기 {#making-the-field-read-only}

[필드 비활성화](getting-started#disabling-a-field)와 혼동하지 마세요. `readOnly()` 메서드를 사용하여 필드를 "읽기 전용"으로 만들 수 있습니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->readOnly()
```

[`disabled()`](getting-started#disabling-a-field)와 비교했을 때 몇 가지 차이점이 있습니다:

- `readOnly()`를 사용할 때, 폼이 제출되면 필드가 여전히 서버로 전송됩니다. 브라우저 콘솔이나 JavaScript를 통해 변경될 수 있습니다. 이를 방지하려면 [`dehydrated(false)`](../advanced#preventing-a-field-from-being-dehydrated)를 사용할 수 있습니다.
- `readOnly()`를 사용할 때는 불투명도 감소와 같은 스타일 변경이 없습니다.
- `readOnly()`를 사용할 때 필드는 여전히 포커스가 가능합니다.

## Grammarly 검사 비활성화하기 {#disabling-grammarly-checks}

사용자가 Grammarly를 설치한 경우 textarea의 내용을 분석하지 못하도록 하려면 `disableGrammarly()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->disableGrammarly()
```

## textarea 유효성 검사 {#textarea-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙 외에도, textarea에만 적용되는 추가 규칙이 있습니다.

### 길이 유효성 검사 {#length-validation}

`minLength()`와 `maxLength()` 메서드를 설정하여 textarea의 길이를 제한할 수 있습니다. 이 메서드들은 프론트엔드와 백엔드 모두에 유효성 검사를 추가합니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->minLength(2)
    ->maxLength(1024)
```

`length()`를 설정하여 textarea의 정확한 길이를 지정할 수도 있습니다. 이 메서드는 프론트엔드와 백엔드 모두에 유효성 검사를 추가합니다:

```php
use Filament\Forms\Components\Textarea;

Textarea::make('question')
    ->length(100)
```
