---
title: Radio
---
# [폼.필드] Radio

## 개요 {#overview}

라디오 입력은 미리 정의된 옵션 목록에서 하나의 값을 선택할 수 있는 라디오 버튼 그룹을 제공합니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
```

<AutoScreenshot name="forms/fields/radio/simple" alt="Radio" version="3.x" />

## 옵션 설명 설정하기 {#setting-option-descriptions}

각 옵션에 대해 `descriptions()` 메서드를 사용하여 선택적으로 설명을 제공할 수 있습니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->descriptions([
        'draft' => 'Is not visible.',
        'scheduled' => 'Will be visible.',
        'published' => 'Is visible.'
    ])
```

<AutoScreenshot name="forms/fields/radio/option-descriptions" alt="옵션 설명이 있는 라디오" version="3.x" />

설명 배열의 `key`가 옵션 배열의 `key`와 동일해야 올바른 설명이 올바른 옵션에 매칭됩니다.

## 불리언 옵션 {#boolean-options}

"예"와 "아니오" 옵션이 있는 간단한 불리언 라디오 버튼 그룹을 원한다면, `boolean()` 메서드를 사용할 수 있습니다:

```php
Radio::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
```

<AutoScreenshot name="forms/fields/radio/boolean" alt="불리언 라디오" version="3.x" />

## 옵션을 라벨과 한 줄로 정렬하기 {#positioning-the-options-inline-with-the-label}

옵션을 라벨 아래가 아니라 `inline()`으로 한 줄에 표시하고 싶을 수 있습니다:

```php
Radio::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
    ->inline()
```

<AutoScreenshot name="forms/fields/radio/inline" alt="인라인 라디오" version="3.x" />

## 옵션을 라벨 아래에 나란히 배치하기 {#positioning-the-options-inline-with-each-other-but-below-the-label}

옵션들을 서로 `inline()`으로 표시하되 라벨 아래에 배치하고 싶을 수 있습니다:

```php
Radio::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
    ->inline()
    ->inlineLabel(false)
```

<AutoScreenshot name="forms/fields/radio/inline-under-label" alt="라벨 아래에 나란히 배치된 라디오" version="3.x" />

## 특정 옵션 비활성화하기 {#disabling-specific-options}

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 인자로 받으며, 해당 클로저에서 특정 `$value` 값을 가진 옵션을 비활성화할지 여부를 확인할 수 있습니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => '초안',
        'scheduled' => '예약됨',
        'published' => '게시됨',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

<AutoScreenshot name="forms/fields/radio/disabled-option" alt="비활성화된 옵션이 있는 라디오" version="3.x" />

비활성화되지 않은 옵션만 가져오고 싶다면(예: 유효성 검사 목적 등), `getEnabledOptions()`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => '초안',
        'scheduled' => '예약됨',
        'published' => '게시됨',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
    ->in(fn (Radio $component): array => array_keys($component->getEnabledOptions()))
```
