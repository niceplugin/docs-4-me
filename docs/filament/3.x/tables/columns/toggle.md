---
title: 토글 컬럼
---
# [테이블.컬럼] ToggleColumn

## 개요 {#overview}

토글 컬럼을 사용하면 테이블 안에 토글 버튼을 렌더링할 수 있으며, 이를 통해 새 페이지나 모달을 열지 않고도 해당 데이터베이스 레코드를 업데이트할 수 있습니다:

```php
use Filament\Tables\Columns\ToggleColumn;

ToggleColumn::make('is_admin')
```

<AutoScreenshot name="tables/columns/toggle/simple" alt="토글 컬럼" version="3.x" />

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하여 토글의 라이프사이클 내 여러 지점에서 코드를 실행할 수 있습니다:

```php
ToggleColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->afterStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장된 후에 실행됩니다.
    })
```
