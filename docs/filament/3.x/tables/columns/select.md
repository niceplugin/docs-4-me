---
title: 선택 컬럼
---
# [테이블.컬럼] SelectColumn

## 개요 {#overview}

선택(select) 컬럼을 사용하면 테이블 안에 셀렉트 필드를 렌더링할 수 있으며, 이를 통해 새로운 페이지나 모달을 열지 않고도 해당 데이터베이스 레코드를 업데이트할 수 있습니다.

컬럼에 옵션을 전달해야 합니다:

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => '초안',
        'reviewing' => '검토 중',
        'published' => '게시됨',
    ])
```

<AutoScreenshot name="tables/columns/select/simple" alt="선택 컬럼" version="3.x" />

## 유효성 검사 {#validation}

입력값을 검증하려면 배열로 [Laravel 유효성 검사 규칙](/laravel/12.x/validation#available-validation-rules)을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => '초안',
        'reviewing' => '검토 중',
        'published' => '게시됨',
    ])
    ->rules(['required'])
```

## 플레이스홀더 선택 비활성화 {#disabling-placeholder-selection}

`selectablePlaceholder()` 메서드를 사용하여 플레이스홀더가 선택되는 것을 방지할 수 있습니다:

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => '초안',
        'reviewing' => '검토 중',
        'published' => '게시됨',
    ])
    ->selectablePlaceholder(false)
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하여 선택(select)의 라이프사이클 내 여러 시점에 코드를 실행할 수 있습니다:

```php
SelectColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->afterStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장된 후에 실행됩니다.
    })
```
