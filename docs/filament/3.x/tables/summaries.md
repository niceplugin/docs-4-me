---
title: 요약
---
# [테이블] 요약

## 개요 {#overview}

테이블 내용 아래에 "요약" 섹션을 렌더링할 수 있습니다. 이는 테이블의 데이터에 대한 평균, 합계, 개수, 범위와 같은 계산 결과를 표시하는 데 유용합니다.

기본적으로, 현재 페이지의 데이터에 대한 단일 요약 행이 표시되며, 여러 페이지가 있는 경우 모든 데이터의 합계에 대한 추가 요약 행이 표시됩니다. 또한 [레코드 그룹](grouping)에 대한 요약을 추가할 수도 있습니다. 자세한 내용은 ["행 그룹 요약하기"](#summarising-groups-of-rows)를 참고하세요.

"요약자" 객체는 `summarize()` 메서드를 사용하여 [테이블 컬럼](columns/getting-started)에 추가할 수 있습니다:

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

> 테이블의 첫 번째 컬럼은 요약자를 사용할 수 없습니다. 해당 컬럼은 요약 섹션의 제목 및 부제목을 렌더링하는 데 사용됩니다.

<AutoScreenshot name="tables/summaries" alt="요약이 있는 테이블" version="3.x" />

## 사용 가능한 요약자 {#available-summarizers}

Filament는 네 가지 유형의 요약자를 기본으로 제공합니다:

- [평균](#average)
- [개수](#count)
- [범위](#range)
- [합계](#sum)

또한 [사용자 정의 요약자](#custom-summaries)를 만들어 원하는 방식으로 데이터를 표시할 수도 있습니다.

## 평균 {#average}

평균은 데이터셋의 모든 값의 평균을 계산하는 데 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make())
```

이 예시에서는 테이블의 모든 평점이 합산되어 평점의 개수로 나누어집니다.

## 개수 {#count}

개수는 데이터셋의 값의 총 개수를 찾는 데 사용할 수 있습니다. 단순히 행의 개수만 계산하려는 것이 아니라면, [데이터셋 범위 지정](#scoping-the-dataset)도 함께 사용하는 것이 좋습니다:

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

이 예시에서는 게시된 게시물의 개수를 테이블에서 계산합니다.

### 아이콘 발생 횟수 세기 {#counting-the-occurrence-of-icons}

[아이콘 컬럼](columns/icon)에서 개수를 사용할 때는 `icons()` 메서드를 사용할 수 있습니다. 이를 통해 테이블에 각 아이콘이 몇 개 있는지 시각적으로 표시할 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(Count::make()->icons()),
```

## 범위 {#range}

범위는 데이터셋의 최소값과 최대값을 계산하는 데 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Range::make())
```

이 예시에서는 테이블에서 최소 및 최대 가격을 찾습니다.

### 날짜 범위 {#date-range}

`minimalDateTimeDifference()` 메서드를 사용하여 범위를 날짜로 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->dateTime()
    ->summarize(Range::make()->minimalDateTimeDifference())
```

이 메서드는 최소 및 최대 날짜 간의 최소 차이를 표시합니다. 예를 들어:

- 최소 및 최대 날짜가 다른 날이면, 날짜만 표시됩니다.
- 최소 및 최대 날짜가 같은 날이지만 시간이 다르면, 날짜와 시간이 모두 표시됩니다.
- 최소 및 최대 날짜와 시간이 동일하면, 한 번만 표시됩니다.

### 텍스트 범위 {#text-range}

`minimalTextualDifference()` 메서드를 사용하여 범위를 텍스트로 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->minimalTextualDifference())
```

이 메서드는 최소값과 최대값 간의 최소 차이를 표시합니다. 예를 들어:

- 최소값과 최대값이 다른 문자로 시작하면, 첫 글자만 표시됩니다.
- 최소값과 최대값이 같은 문자로 시작하면, 차이가 발견될 때까지 더 많은 텍스트가 렌더링됩니다.
- 최소값과 최대값이 동일하면, 한 번만 표시됩니다.

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

## 라벨 설정하기 {#setting-a-label}

`summarizer`의 라벨은 `label()` 메서드를 사용하여 설정할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->label('Total'))
```

## 데이터셋 범위 지정하기 {#scoping-the-dataset}

`summarizer`의 데이터셋에 데이터베이스 쿼리 범위를 `query()` 메서드를 사용하여 적용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Query\Builder;

TextColumn::make('rating')
    ->summarize(
        Average::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

이 예시에서는 이제 `is_published`가 `true`로 설정된 행만 평균 계산에 사용됩니다.

이 기능은 [개수](#count) 요약자와 함께 사용할 때 특히 유용하며, 데이터셋에서 조건을 통과한 레코드의 개수를 셀 수 있습니다:

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

이 예시에서는 게시된 게시물의 개수를 테이블에서 계산합니다.

## 포맷팅 {#formatting}

### 숫자 포맷팅 {#number-formatting}

`numeric()` 메서드를 사용하면 항목을 숫자로 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric())
```

숫자를 포맷할 때 소수점 자릿수를 지정하려면 `decimalPlaces` 인자를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric(
        decimalPlaces: 0,
    ))
```

기본적으로 앱의 로케일이 숫자 포맷에 사용됩니다. 사용되는 로케일을 변경하려면 `locale` 인자를 전달할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric(
        locale: 'nl',
    ))
```

또는 서비스 프로바이더의 `boot()` 메서드에서 `Table::$defaultNumberLocale` 메서드를 사용하여 앱 전체에 사용할 기본 로케일을 설정할 수 있습니다:

```php
use Filament\Tables\Table;

Table::$defaultNumberLocale = 'nl';
```

### 통화 포맷팅 {#currency-formatting}

`money()` 메서드를 사용하면 어떤 통화로든 금액 값을 쉽게 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR'))
```

또한 `money()`에는 원래 값을 포맷 전에 숫자로 나눌 수 있는 `divideBy` 인자가 있습니다. 예를 들어 데이터베이스에 가격이 센트 단위로 저장되어 있다면 유용합니다:

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', divideBy: 100))
```

기본적으로 앱의 로케일이 금액 포맷에 사용됩니다. 사용되는 로케일을 변경하려면 `locale` 인자를 전달할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', locale: 'nl'))
```

또는 서비스 프로바이더의 `boot()` 메서드에서 `Table::$defaultNumberLocale` 메서드를 사용하여 앱 전체에 사용할 기본 로케일을 설정할 수 있습니다:

```php
use Filament\Tables\Table;

Table::$defaultNumberLocale = 'nl';
```

### 텍스트 길이 제한하기 {#limiting-text-length}

요약 값의 길이를 `limit()`으로 제한할 수 있습니다:

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
        ->prefix('Total volume: ')
        ->suffix(new HtmlString(' m&sup3;'))
    )
```

## 사용자 정의 요약 {#custom-summaries}

`using()` 메서드에서 값을 반환하여 사용자 정의 요약을 만들 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Query\Builder;

TextColumn::make('name')
    ->summarize(Summarizer::make()
        ->label('First last name')
        ->using(fn (Builder $query): string => $query->min('last_name')))
```

콜백은 계산을 수행할 수 있도록 데이터베이스 `$query` 빌더 인스턴스에 접근할 수 있습니다. 테이블에 표시할 값을 반환해야 합니다.

## 조건부로 요약 숨기기 {#conditionally-hiding-the-summary}

요약을 숨기려면 `hidden()` 메서드에 불리언 값이나 불리언을 반환하는 함수를 전달할 수 있습니다. 필요하다면 해당 요약자의 Eloquent 쿼리 빌더 인스턴스에 함수의 `$query` 인자를 통해 접근할 수 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('sku')
    ->summarize(Summarizer::make()
        ->hidden(fn (Builder $query): bool => ! $query->exists()))
```

또는 `visible()` 메서드를 사용하여 반대 효과를 얻을 수도 있습니다:

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('sku')
    ->summarize(Summarizer::make()
        ->visible(fn (Builder $query): bool => $query->exists()))
```

## 행 그룹 요약하기 {#summarising-groups-of-rows}

[그룹](grouping)과 함께 요약을 사용하여 그룹 내 레코드의 요약을 표시할 수 있습니다. 그룹화된 테이블의 컬럼에 요약자를 추가하면 자동으로 작동합니다.

### 그룹 내 행 숨기고 요약만 표시하기 {#hiding-the-grouped-rows-and-showing-the-summary-only}

`groupsOnly()` 메서드를 사용하여 그룹 내 행을 숨기고 각 그룹의 요약만 표시할 수 있습니다. 이는 다양한 리포팅 시나리오에서 유용합니다.

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
