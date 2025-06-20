---
title: Fieldset
---
# [인포리스트.레이아웃] Fieldset

## 개요 {#overview}

입력 항목을 Fieldset으로 그룹화하고 싶을 수 있습니다. 각 fieldset은 기본적으로 라벨, 테두리, 그리고 2열 그리드를 가집니다:

```php
use Filament\Infolists\Components\Fieldset;

Fieldset::make('Label')
    ->schema([
        // ...
    ])
```

<AutoScreenshot name="infolists/layout/fieldset/simple" alt="Fieldset" version="3.x" />

## 필드셋 내에서 그리드 열 사용하기 {#using-grid-columns-within-a-fieldset}

fieldset 내의 [그리드](grid)를 커스터마이즈하려면 `columns()` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\Fieldset;

Fieldset::make('Label')
    ->schema([
        // ...
    ])
    ->columns(3)
```
