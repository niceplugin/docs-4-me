---
title: 컬럼 관계
---
# [테이블.컬럼] 컬럼 관계
## 관계에서 데이터 표시하기 {#displaying-data-from-relationships}

"닷 표기법(dot notation)"을 사용하여 관계 내의 컬럼에 접근할 수 있습니다. 관계의 이름이 먼저 오고, 그 뒤에 마침표, 그리고 표시할 컬럼의 이름이 옵니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('author.name')
```

## 관계 개수 세기 {#counting-relationships}

컬럼에서 관련 레코드의 개수를 세고 싶다면, `counts()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('users_count')->counts('users')
```

이 예시에서 `users`는 개수를 셀 관계의 이름입니다. 컬럼의 이름은 반드시 `users_count`여야 하며, 이는 [Laravel에서 사용하는](https://laravel.com/docs/eloquent-relationships#counting-related-models) 결과 저장 규칙입니다.

계산 전에 관계에 스코프를 적용하고 싶다면, 메서드에 배열을 전달할 수 있습니다. 이때 키는 관계의 이름이고 값은 Eloquent 쿼리에 스코프를 적용할 함수입니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('users_count')->counts([
    'users' => fn (Builder $query) => $query->where('is_active', true),
])
```

## 관계 존재 여부 확인하기 {#determining-relationship-existence}

컬럼에서 관련 레코드가 존재하는지만 표시하고 싶다면, `exists()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('users_exists')->exists('users')
```

이 예시에서 `users`는 존재 여부를 확인할 관계의 이름입니다. 컬럼의 이름은 반드시 `users_exists`여야 하며, 이는 [Laravel에서 사용하는](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions) 결과 저장 규칙입니다.

계산 전에 관계에 스코프를 적용하고 싶다면, 메서드에 배열을 전달할 수 있습니다. 이때 키는 관계의 이름이고 값은 Eloquent 쿼리에 스코프를 적용할 함수입니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('users_exists')->exists([
    'users' => fn (Builder $query) => $query->where('is_active', true),
])
```

## 관계 집계하기 {#aggregating-relationships}

Filament는 관계 필드를 집계할 수 있는 여러 메서드를 제공합니다. `avg()`, `max()`, `min()`, `sum()` 등이 있습니다. 예를 들어, 컬럼에서 모든 관련 레코드의 필드 평균을 표시하고 싶다면, `avg()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('users_avg_age')->avg('users', 'age')
```

이 예시에서 `users`는 관계의 이름이고, `age`는 평균을 낼 필드입니다. 컬럼의 이름은 반드시 `users_avg_age`여야 하며, 이는 [Laravel에서 사용하는](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions) 결과 저장 규칙입니다.

계산 전에 관계에 스코프를 적용하고 싶다면, 메서드에 배열을 전달할 수 있습니다. 이때 키는 관계의 이름이고 값은 Eloquent 쿼리에 스코프를 적용할 함수입니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('users_avg_age')->avg([
    'users' => fn (Builder $query) => $query->where('is_active', true),
], 'age')
```
