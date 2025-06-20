---
title: 텍스트 입력 칼럼
---
# [테이블.컬럼] TextInputColumn

## 개요 {#overview}

텍스트 입력 칼럼을 사용하면 테이블 내에 텍스트 입력란을 렌더링할 수 있으며, 이를 통해 새 페이지나 모달을 열지 않고도 해당 데이터베이스 레코드를 업데이트할 수 있습니다:

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('email')
```

<AutoScreenshot name="tables/columns/text-input/simple" alt="텍스트 입력 칼럼" version="3.x" />

## 유효성 검사 {#validation}

입력값을 검증하려면 배열로 [라라벨 유효성 검사 규칙](https://laravel.com/docs/validation#available-validation-rules)을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('name')
    ->rules(['required', 'max:255'])
```

## HTML 입력 타입 커스터마이징 {#customizing-the-html-input-type}

`type()` 메서드를 사용하여 커스텀 [HTML 입력 타입](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('background_color')->type('color')
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하여 입력의 라이프사이클 내 다양한 시점에 코드를 실행할 수 있습니다:

```php
TextInputColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->afterStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장된 후에 실행됩니다.
    })
```
