---
title: 요약
---
# [테이블] 요약

## 개요 {#overview}

테이블 내용 아래에 "요약" 섹션을 렌더링할 수 있습니다. 이는 테이블 데이터의 평균, 합계, 개수, 범위와 같은 계산 결과를 표시하는 데 유용합니다.

기본적으로, 현재 페이지의 데이터에 대한 단일 요약 행이 표시되며, 여러 페이지가 있는 경우 모든 데이터의 합계를 위한 추가 요약 행이 표시됩니다. 또한 [레코드 그룹](grouping)에 대한 요약도 추가할 수 있습니다. 자세한 내용은 ["행 그룹 요약하기"](#summarising-groups-of-rows)를 참고하세요.

"요약자(Summarizer)" 객체는 `summarize()` 메서드를 사용하여 [테이블 컬럼](columns)에 추가할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make())
```

여러 개의 "요약자"를 동일한 컬럼에 추가할 수도 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->numeric()
    ->summarize([
        Average::make(),
        Range::make(),
    ])
```

> 테이블의 첫 번째 컬럼에는 요약자를 사용할 수 없습니다. 해당 컬럼은 요약 섹션의 제목 및 부제목을 렌더링하는 데 사용됩니다.

<AutoScreenshot name="tables/summaries" alt="요약이 포함된 테이블" version="3.x" />

## 사용 가능한 요약 도구 {#available-summarizers}

Filament에는 네 가지 유형의 요약 도구가 기본 제공됩니다:

- [평균](#average)
- [개수](#count)
- [범위](#range)
- [합계](#sum)

또한 [사용자 지정 요약 도구를 직접 생성](#custom-summaries)하여 원하는 방식으로 데이터를 표시할 수도 있습니다.

## 평균 {#average}

평균은 데이터셋의 모든 값의 평균을 계산하는 데 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make())
```

이 예시에서는 테이블의 모든 평점이 합산된 후 평점의 개수로 나누어집니다.

## Count {#count}

Count는 데이터셋의 값의 총 개수를 찾는 데 사용할 수 있습니다. 단순히 행의 개수만 계산하려는 것이 아니라면, [데이터셋에 범위를 지정](#scoping-the-dataset)하는 것이 좋습니다.

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(
        Count::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

이 예시에서는 테이블이 게시된 게시물의 개수를 계산합니다.

### 아이콘의 발생 횟수 세기 {#counting-the-occurrence-of-icons}

[아이콘 컬럼](columns/icon)에서 count를 사용할 때 `icons()` 메서드를 사용할 수 있습니다. 이 메서드는 테이블에 각 아이콘이 몇 개나 있는지 시각적으로 보여줍니다:

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(Count::make()->icons()),
```

## 범위 {#range}

범위는 데이터셋에서 최소값과 최대값을 계산하는 데 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Range::make())
```

이 예시에서는 테이블에서 최소 가격과 최대 가격이 계산됩니다.

### 날짜 범위 {#date-range}

`minimalDateTimeDifference()` 메서드를 사용하여 범위를 날짜로 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->dateTime()
    ->summarize(Range::make()->minimalDateTimeDifference())
```

이 메서드는 최소값과 최대값 날짜 간의 최소 차이를 표시합니다. 예를 들어:

- 최소값과 최대값 날짜가 서로 다른 날이라면, 날짜만 표시됩니다.
- 최소값과 최대값 날짜가 같은 날이지만 시간이 다르다면, 날짜와 시간이 모두 표시됩니다.
- 최소값과 최대값 날짜와 시간이 동일하다면, 한 번만 표시됩니다.

### 텍스트 범위 {#text-range}

`minimalTextualDifference()` 메서드를 사용하여 범위를 텍스트로 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->minimalTextualDifference())
```

이 메서드는 최소값과 최대값 사이의 최소한의 차이만을 표시합니다. 예를 들어:

- 최소값과 최대값이 다른 문자로 시작하면, 첫 글자만 표시됩니다.
- 최소값과 최대값이 같은 문자로 시작하면, 차이가 발생할 때까지 더 많은 텍스트가 표시됩니다.
- 최소값과 최대값이 동일하다면, 한 번만 표시됩니다.

### 범위에 null 값 포함하기 {#including-null-values-in-the-range}

기본적으로 null 값은 범위에서 제외됩니다. null 값을 포함하려면 `excludeNull(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->excludeNull(false))
```

## 합계 {#sum}

합계는 데이터셋의 모든 값의 총합을 계산하는 데 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make())
```

이 예시에서는 테이블의 모든 가격이 합산됩니다.

## 레이블 설정하기 {#setting-a-label}

`summarizer`의 레이블은 `label()` 메서드를 사용하여 설정할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->label('Total'))
```

## 데이터셋 범위 지정하기 {#scoping-the-dataset}

`summarizer`의 데이터셋에 데이터베이스 쿼리 스코프를 적용하려면 `query()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Query\Builder;

TextColumn::make('rating')
    ->summarize(
        Average::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

이 예시에서는 이제 `is_published`가 `true`로 설정된 행만 평균을 계산하는 데 사용됩니다.

이 기능은 [count](#count) summarizer와 함께 사용할 때 특히 유용합니다. 데이터셋에서 테스트를 통과한 레코드가 몇 개인지 셀 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(
        Count::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

이 예시에서는 테이블이 게시된 게시글의 개수를 계산합니다.

## 포매팅 {#formatting}

### 숫자 형식 지정 {#number-formatting}

`numeric()` 메서드를 사용하면 항목을 숫자로 형식화할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric())
```

숫자를 형식화할 때 사용할 소수점 자릿수를 커스터마이즈하고 싶다면, `decimalPlaces` 인자를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric(
        decimalPlaces: 0,
    ))
```

기본적으로, 앱의 로케일이 숫자를 적절하게 형식화하는 데 사용됩니다. 사용되는 로케일을 커스터마이즈하고 싶다면, `locale` 인자에 값을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric(
        locale: 'nl',
    ))
```

또는, 서비스 프로바이더의 `boot()` 메서드에서 `Table::$defaultNumberLocale` 메서드를 사용하여 앱 전체에서 사용할 기본 로케일을 설정할 수도 있습니다:

```php
use Filament\Tables\Table;

Table::$defaultNumberLocale = 'nl';
```

### 통화 형식 지정 {#currency-formatting}

`money()` 메서드를 사용하면 어떤 통화든지 손쉽게 금액 값을 형식화할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR'))
```

또한, `money()`에는 `divideBy` 인자가 있어, 형식화 전에 원래 값을 특정 숫자로 나눌 수 있습니다. 예를 들어, 데이터베이스에 가격이 센트 단위로 저장되어 있다면 유용하게 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', divideBy: 100))
```

기본적으로 앱의 로케일이 금액을 적절하게 형식화하는 데 사용됩니다. 사용되는 로케일을 직접 지정하고 싶다면 `locale` 인자에 값을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', locale: 'nl'))
```

또는, 서비스 프로바이더의 `boot()` 메서드에서 `Table::$defaultNumberLocale` 메서드를 사용하여 앱 전체에서 사용할 기본 로케일을 설정할 수도 있습니다:

```php
use Filament\Tables\Table;

Table::$defaultNumberLocale = 'nl';
```

### 텍스트 길이 제한하기 {#limiting-text-length}

요약 값의 길이를 `limit()` 메서드로 제한할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->limit(5))
```

### 접두사 또는 접미사 추가하기 {#adding-a-prefix-or-suffix}

요약 값에 접두사 또는 접미사를 추가할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\HtmlString;

TextColumn::make('volume')
    ->summarize(Sum::make()
        ->prefix('총 부피: ')
        ->suffix(new HtmlString(' m&sup3;'))
    )
```

## 사용자 지정 요약 {#custom-summaries}

`using()` 메서드에서 값을 반환하여 사용자 지정 요약을 생성할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Query\Builder;

TextColumn::make('name')
    ->summarize(Summarizer::make()
        ->label('First last name')
        ->using(fn (Builder $query): string => $query->min('last_name')))
```

콜백은 데이터베이스 `$query` 빌더 인스턴스에 접근하여 계산을 수행할 수 있습니다. 테이블에 표시할 값을 반환해야 합니다.

## 요약 조건부 숨기기 {#conditionally-hiding-the-summary}

요약을 숨기려면 `hidden()` 메서드에 불리언 값이나 불리언을 반환하는 함수를 전달하면 됩니다. 필요하다면, 해당 요약자의 Eloquent 쿼리 빌더 인스턴스에 함수의 `$query` 인자를 통해 접근할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('sku')
    ->summarize(Summarizer::make()
        ->hidden(fn (Builder $query): bool => ! $query->exists()))
```

또는, 반대 효과를 얻기 위해 `visible()` 메서드를 사용할 수도 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('sku')
    ->summarize(Summarizer::make()
        ->visible(fn (Builder $query): bool => $query->exists()))
```

## 행 그룹 요약하기 {#summarising-groups-of-rows}

[그룹화](grouping)와 함께 요약 기능을 사용하여 그룹 내 레코드의 요약 정보를 표시할 수 있습니다. 그룹화된 테이블에서 열에 요약자를 추가하면 이 기능이 자동으로 작동합니다.

### 그룹화된 행을 숨기고 요약만 표시하기 {#hiding-the-grouped-rows-and-showing-the-summary-only}

`groupsOnly()` 메서드를 사용하면 그룹 내의 행을 숨기고 각 그룹의 요약만 표시할 수 있습니다. 이는 다양한 리포트 시나리오에서 유용합니다.

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('views_count')
                ->summarize(Sum::make()),
            TextColumn::make('likes_count')
                ->summarize(Sum::make()),
        ])
        ->defaultGroup('category')
        ->groupsOnly();
}
```
