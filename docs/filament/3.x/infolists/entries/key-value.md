---
title: 키-값 항목
---
# [인포리스트.엔트리] KeyValueEntry

## 개요 {#overview}

키-값 항목은 1차원 JSON 객체 또는 PHP 배열에서 데이터의 키-값 쌍을 렌더링할 수 있게 해줍니다.

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
```

<AutoScreenshot name="infolists/entries/key-value/simple" alt="Key-value entry" version="3.x" />

Eloquent에 데이터를 저장하는 경우, 모델 속성에 `array` [캐스트](/laravel/12.x/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

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

## 키 열의 라벨 커스터마이징 {#customizing-the-key-columns-label}

`keyLabel()` 메서드를 사용하여 키 열의 라벨을 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
    ->keyLabel('속성 이름')
```

## 값 열의 라벨 커스터마이징 {#customizing-the-value-columns-label}

`valueLabel()` 메서드를 사용하여 값 열의 라벨을 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('meta')
    ->valueLabel('속성 값')
```