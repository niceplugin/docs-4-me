---
title: 삼항 필터
---
# [테이블.필터] TernaryFilter
## 개요 {#overview}

삼항 필터는 세 가지 상태(보통 true, false, 그리고 공백)를 가진 select 필터를 쉽게 생성할 수 있게 해줍니다. `is_admin`이라는 컬럼을 `true` 또는 `false`로 필터링하려면, 삼항 필터를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('is_admin')
```

## nullable 컬럼과 함께 삼항 필터 사용하기 {#using-a-ternary-filter-with-a-nullable-column}

또 다른 일반적인 패턴은 nullable 컬럼을 사용하는 것입니다. 예를 들어, `email_verified_at` 컬럼을 사용하여 인증된 사용자와 인증되지 않은 사용자를 필터링할 때, 인증되지 않은 사용자는 이 컬럼에 null 타임스탬프가 있습니다. 이러한 로직을 적용하려면, `nullable()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('email_verified_at')
    ->nullable()
```

## 삼항 필터가 사용하는 컬럼 커스터마이징하기 {#customizing-the-column-used-by-a-ternary-filter}

쿼리 범위를 지정하는 데 사용되는 컬럼명은 필터의 이름입니다. 이를 커스터마이징하려면, `attribute()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('verified')
    ->nullable()
    ->attribute('status_id')
```

## 삼항 필터 옵션 라벨 커스터마이징하기 {#customizing-the-ternary-filter-option-labels}

삼항 필터의 각 상태에 사용되는 라벨을 커스터마이징할 수 있습니다. true 옵션 라벨은 `trueLabel()` 메서드로, false 옵션 라벨은 `falseLabel()` 메서드로, 공백(기본) 옵션 라벨은 `placeholder()` 메서드로 커스터마이징할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('email_verified_at')
    ->label('이메일 인증')
    ->nullable()
    ->placeholder('모든 사용자')
    ->trueLabel('인증된 사용자')
    ->falseLabel('인증되지 않은 사용자')
```

## 삼항 필터가 쿼리를 수정하는 방식 커스터마이징하기 {#customizing-how-a-ternary-filter-modifies-the-query}

삼항 필터의 각 상태에 따라 쿼리가 어떻게 변경되는지 커스터마이징하려면, `queries()` 메서드를 사용하세요:

```php
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('email_verified_at')
    ->label('이메일 인증')
    ->placeholder('모든 사용자')
    ->trueLabel('인증된 사용자')
    ->falseLabel('인증되지 않은 사용자')
    ->queries(
        true: fn (Builder $query) => $query->whereNotNull('email_verified_at'),
        false: fn (Builder $query) => $query->whereNull('email_verified_at'),
        blank: fn (Builder $query) => $query, // 이 예시에서는 공백일 때 쿼리를 필터링하지 않습니다.
    )
```

## 소프트 삭제된 레코드 필터링하기 {#filtering-soft-deletable-records}

`TrashedFilter`는 소프트 삭제된 레코드를 필터링하는 데 사용할 수 있습니다. 이는 Filament에 내장된 삼항 필터의 한 종류입니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Tables\Filters\TrashedFilter;

TrashedFilter::make()
```
