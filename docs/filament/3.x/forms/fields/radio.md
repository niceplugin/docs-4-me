---
title: Radio
---
# [폼.필드] Radio

## 개요 {#overview}

라디오 입력은 미리 정의된 옵션 목록에서 단일 값을 선택할 수 있는 라디오 버튼 그룹을 제공합니다:

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

`descriptions()` 메서드를 사용하여 각 옵션에 설명을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->descriptions([
        'draft' => '보이지 않습니다.',
        'scheduled' => '곧 보이게 됩니다.',
        'published' => '보입니다.'
    ])
```

<AutoScreenshot name="forms/fields/radio/option-descriptions" alt="Radio with option descriptions" version="3.x" />

설명 배열에서 옵션 배열의 `key`와 동일한 `key`를 사용해야 올바른 설명이 올바른 옵션에 매칭됩니다.

## 불리언 옵션 {#boolean-options}

"예"와 "아니오" 옵션이 있는 간단한 불리언 라디오 버튼 그룹을 원한다면, `boolean()` 메서드를 사용할 수 있습니다:

```php
Radio::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
```

<AutoScreenshot name="forms/fields/radio/boolean" alt="Boolean radio" version="3.x" />

## 라벨과 옵션을 한 줄에 배치하기 {#positioning-the-options-inline-with-the-label}

옵션을 라벨 아래가 아니라 `inline()`으로 라벨과 한 줄에 표시하고 싶을 수 있습니다:

```php
Radio::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
    ->inline()
```

<AutoScreenshot name="forms/fields/radio/inline" alt="Inline radio" version="3.x" />

## 라벨 아래에서 옵션끼리 한 줄에 배치하기 {#positioning-the-options-inline-with-each-other-but-below-the-label}

옵션을 라벨 아래에서 옵션끼리 `inline()`으로 한 줄에 표시하고 싶을 수 있습니다:

```php
Radio::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
    ->inline()
    ->inlineLabel(false)
```

<AutoScreenshot name="forms/fields/radio/inline-under-label" alt="Inline radio under label" version="3.x" />

## 특정 옵션 비활성화하기 {#disabling-specific-options}

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 인자로 받아, 특정 `$value`를 가진 옵션을 비활성화할지 여부를 확인할 수 있습니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

<AutoScreenshot name="forms/fields/radio/disabled-option" alt="Radio with disabled option" version="3.x" />

비활성화되지 않은 옵션만 가져오고 싶다면(예: 유효성 검사 목적 등), `getEnabledOptions()`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
    ->in(fn (Radio $component): array => array_keys($component->getEnabledOptions()))
```
