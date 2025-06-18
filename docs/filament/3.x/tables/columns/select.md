---
title: SelectColumn
---
# [테이블.컬럼] SelectColumn

## 개요 {#overview}

SelectColumn은 테이블 안에 셀렉트 필드를 렌더링할 수 있게 해주며, 이를 통해 새로운 페이지나 모달을 열지 않고도 데이터베이스 레코드를 업데이트할 수 있습니다.

컬럼에 옵션을 전달해야 합니다:

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

<AutoScreenshot name="tables/columns/select/simple" alt="SelectColumn" version="3.x" />

## 유효성 검사 {#validation}

입력값을 검증하려면 배열에 [Laravel 유효성 검사 규칙](https://laravel.com/docs/validation#available-validation-rules)을 전달하면 됩니다:

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->rules(['required'])
```

## 플레이스홀더 선택 비활성화 {#disabling-placeholder-selection}

`selectablePlaceholder()` 메서드를 사용하여 플레이스홀더가 선택되지 않도록 막을 수 있습니다:

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->selectablePlaceholder(false)
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하여 셀렉트의 라이프사이클 내 여러 지점에서 코드를 실행할 수 있습니다:

```php
SelectColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->afterStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장된 후에 실행됩니다.
    })
```
