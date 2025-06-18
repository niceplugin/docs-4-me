---
title: CheckboxColumn
---
# [테이블.컬럼] CheckboxColumn

## 개요 {#overview}

CheckboxColumn은 테이블 안에 체크박스를 렌더링할 수 있게 해주며, 새로운 페이지나 모달을 열 필요 없이 해당 데이터베이스 레코드를 업데이트하는 데 사용할 수 있습니다:

```php
use Filament\Tables\Columns\CheckboxColumn;

CheckboxColumn::make('is_admin')
```

<AutoScreenshot name="tables/columns/checkbox/simple" alt="CheckboxColumn" version="3.x" />

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하여 체크박스의 라이프사이클 내 여러 지점에서 코드를 실행할 수 있습니다:

```php
CheckboxColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->afterStateUpdated(function ($record, $state) {
        // 상태가 데이터베이스에 저장된 후에 실행됩니다.
    })
```
