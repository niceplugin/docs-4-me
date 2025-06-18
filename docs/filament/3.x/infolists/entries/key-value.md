---
title: KeyValueEntry
---
# [인포리스트.엔트리] KeyValueEntry

## 개요 {#overview}

KeyValueEntry는 1차원 JSON 객체나 PHP 배열에서 데이터의 키-값 쌍을 렌더링할 수 있게 해줍니다.

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
```

<AutoScreenshot name="infolists/entries/key-value/simple" alt="KeyValueEntry" version="3.x" />

만약 데이터를 Eloquent에 저장하고 있다면, 모델 속성에 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $casts = [
        'meta' => 'array',
    ];

    // ...
}
```

## 키 열 레이블 커스터마이징하기 {#customizing-the-key-columns-label}

`keyLabel()` 메서드를 사용하여 키 열의 레이블을 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
    ->keyLabel('Property name')
```

## 값 열의 라벨 커스터마이징하기 {#customizing-the-value-columns-label}

`valueLabel()` 메서드를 사용하여 값 열의 라벨을 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
    ->valueLabel('Property value')
```