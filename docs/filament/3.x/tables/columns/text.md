---
title: TextColumn
---
# [테이블.컬럼] TextColumn

## 개요 {#overview}

TextColumn은 데이터베이스에서 간단한 텍스트를 표시합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
```

<AutoScreenshot name="tables/columns/text/simple" alt="TextColumn" version="3.x" />

## "배지"로 표시하기 {#displaying-as-a-badge}

기본적으로 텍스트는 매우 평범하며 배경색이 없습니다. `badge()` 메서드를 사용하면 이를 "배지"로 표시할 수 있습니다. 이 방법은 상태(status)와 같이 상태에 맞는 [색상](#customizing-the-color)으로 배지를 표시하고 싶을 때 유용합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->badge()
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'gray',
        'reviewing' => 'warning',
        'published' => 'success',
        'rejected' => 'danger',
    })
```

<AutoScreenshot name="tables/columns/text/badge" alt="Text column as badge" version="3.x" />

배지에 [아이콘](#adding-an-icon)과 같은 다른 요소를 추가할 수도 있습니다.

## 설명 표시하기 {#displaying-a-description}

설명은 컬럼 내용 위나 아래에 추가 텍스트를 쉽게 렌더링하는 데 사용할 수 있습니다.

`description()` 메서드를 사용하여 TextColumn 내용 아래에 설명을 표시할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->description(fn (Post $record): string => $record->description)
```

<AutoScreenshot name="tables/columns/text/description" alt="설명이 있는 TextColumn" version="3.x" />

기본적으로 설명은 본문 텍스트 아래에 표시되지만, 두 번째 매개변수를 사용하여 위로 옮길 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->description(fn (Post $record): string => $record->description, position: 'above')
```

<AutoScreenshot name="tables/columns/text/description-above" alt="내용 위에 설명이 있는 TextColumn" version="3.x" />

## 날짜 형식 지정 {#date-formatting}

컬럼의 상태를 [PHP 날짜 형식 토큰](https://www.php.net/manual/en/datetime.format.php)을 사용하여 포맷하려면 `date()` 및 `dateTime()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->dateTime()
```

컬럼의 상태를 [Carbon의 `diffForHumans()`](https://carbon.nesbot.com/docs/#api-humandiff)를 사용하여 포맷하려면 `since()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->since()
```

또한, 추가 정보를 제공하기 위해 툴팁에 포맷된 날짜를 표시하려면 `dateTooltip()`, `dateTimeTooltip()`, 또는 `timeTooltip()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->since()
    ->dateTimeTooltip()
```

## 숫자 형식 지정 {#number-formatting}

`numeric()` 메서드를 사용하면 항목을 숫자로 형식화할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('stock')
    ->numeric()
```

숫자를 형식화할 때 사용할 소수점 자릿수를 커스터마이즈하고 싶다면, `decimalPlaces` 인수를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('stock')
    ->numeric(decimalPlaces: 0)
```

기본적으로 앱의 로케일이 숫자를 적절하게 형식화하는 데 사용됩니다. 사용되는 로케일을 커스터마이즈하고 싶다면, `locale` 인수에 값을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('stock')
    ->numeric(locale: 'nl')
```

또는, 서비스 프로바이더의 `boot()` 메서드에서 `Table::$defaultNumberLocale` 메서드를 사용하여 앱 전체에서 사용할 기본 로케일을 설정할 수도 있습니다:

```php
use Filament\Tables\Table;

Table::$defaultNumberLocale = 'nl';
```

## 통화 형식 지정 {#currency-formatting}

`money()` 메서드를 사용하면 어떤 통화든 손쉽게 금액 값을 형식화할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR')
```

또한, `money()`에는 `divideBy` 인자가 있어, 형식화 전에 원래 값을 특정 숫자로 나눌 수 있습니다. 예를 들어 데이터베이스에 가격이 센트 단위로 저장되어 있다면 유용하게 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR', divideBy: 100)
```

기본적으로 앱의 로케일이 금액을 적절하게 형식화하는 데 사용됩니다. 사용되는 로케일을 직접 지정하고 싶다면 `locale` 인자에 값을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR', locale: 'nl')
```

또는, 서비스 프로바이더의 `boot()` 메서드에서 `Table::$defaultNumberLocale` 메서드를 사용해 앱 전체에서 사용할 기본 로케일을 설정할 수도 있습니다:

```php
use Filament\Tables\Table;

Table::$defaultNumberLocale = 'nl';
```

## 텍스트 길이 제한하기 {#limiting-text-length}

셀의 값의 길이를 `limit()`으로 제한할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->limit(50)
```

`limit()`에 전달되는 값을 재사용할 수도 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->limit(50)
    ->tooltip(function (TextColumn $column): ?string {
        $state = $column->getState();

        if (strlen($state) <= $column->getCharacterLimit()) {
            return null;
        }

        // 컬럼 내용이 길이 제한을 초과할 때만 툴팁을 렌더링합니다.
        return $state;
    })
```

## 단어 수 제한하기 {#limiting-word-count}

셀에 표시되는 `words()`의 개수를 제한할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->words(10)
```

## 텍스트를 특정 줄 수로 제한하기 {#limiting-text-to-a-specific-number-of-lines}

텍스트를 고정된 길이로 제한하는 대신, 특정 줄 수로 제한하고 싶을 수 있습니다. 줄 수로 텍스트를 클램핑하는 것은 모든 화면 크기에서 일관된 경험을 보장하고자 할 때 반응형 인터페이스에서 유용합니다. 이는 `lineClamp()` 메서드를 사용하여 달성할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->lineClamp(2)
```

## 접두사 또는 접미사 추가하기 {#adding-a-prefix-or-suffix}

셀 값에 접두사 또는 접미사를 추가할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

## 내용 감싸기 {#wrapping-content}

열의 내용이 너무 길 경우 자동으로 줄바꿈되도록 하려면 `wrap()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->wrap()
```

## 여러 값 나열하기 {#listing-multiple-values}

기본적으로 TextColumn에 여러 값이 있으면 쉼표로 구분되어 표시됩니다. `listWithLineBreaks()` 메서드를 사용하면 각 값을 새로운 줄에 표시할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
```

### 목록에 글머리 기호 추가하기 {#adding-bullet-points-to-the-list}

각 목록 항목에 글머리 기호를 추가하려면 `bulleted()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
    ->bulleted()
```

### 목록의 값 개수 제한하기 {#limiting-the-number-of-values-in-the-list}

`limitList()` 메서드를 사용하여 목록의 값 개수를 제한할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
```

#### 제한된 목록 확장하기 {#expanding-the-limited-list}

`expandableLimitedList()` 메서드를 사용하여 제한된 항목을 확장하거나 축소할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
    ->expandableLimitedList()
```

이 기능은 각 항목이 개별 줄에 표시되는 `listWithLineBreaks()` 또는 `bulleted()`에서만 사용할 수 있다는 점에 유의하세요.

### 리스트 구분자 사용하기 {#using-a-list-separator}

모델의 텍스트 문자열을 여러 리스트 항목으로 "분리"하고 싶다면, `separator()` 메서드를 사용할 수 있습니다. 예를 들어, 쉼표로 구분된 태그를 [배지로 표시](#displaying-as-a-badge)할 때 유용합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('tags')
    ->badge()
    ->separator(',')
```

## HTML 렌더링 {#rendering-html}

컬럼 값이 HTML인 경우, `html()`을 사용하여 렌더링할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->html()
```

이 메서드를 사용하면, 렌더링 전에 HTML이 잠재적으로 안전하지 않은 내용을 제거하도록 정제(sanitize)됩니다. 이 동작을 원하지 않는 경우, HTML을 `HtmlString` 객체로 감싸서 포맷할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\HtmlString;

TextColumn::make('description')
    ->formatStateUsing(fn (string $state): HtmlString => new HtmlString($state))
```

또는, `formatStateUsing()` 메서드에서 `view()` 객체를 반환할 수도 있으며, 이 경우에도 정제되지 않습니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Contracts\View\View;

TextColumn::make('description')
    ->formatStateUsing(fn (string $state): View => view(
        'filament.tables.columns.description-entry-content',
        ['state' => $state],
    ))
```

### 마크다운을 HTML로 렌더링하기 {#rendering-markdown-as-html}

컬럼에 마크다운이 포함되어 있다면, `markdown()`을 사용하여 렌더링할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->markdown()
```

## 사용자 지정 포맷팅 {#custom-formatting}

대신 `formatStateUsing()`에 사용자 지정 포맷팅 콜백을 전달할 수 있습니다. 이 콜백은 셀의 `$state`와 선택적으로 `$record`를 인자로 받습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->formatStateUsing(fn (string $state): string => __("statuses.{$state}"))
```

## 색상 사용자 지정 {#customizing-the-color}

텍스트의 색상을 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나로 설정할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->color('primary')
```

<AutoScreenshot name="tables/columns/text/color" alt="기본 색상의 TextColumn" version="3.x" />

## 아이콘 추가하기 {#adding-an-icon}

TextColumn에는 아이콘도 추가할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->icon('heroicon-m-envelope')
```

<AutoScreenshot name="tables/columns/text/icon" alt="아이콘이 있는 TextColumn" version="3.x" />

`iconPosition()`을 사용하여 아이콘의 위치를 지정할 수 있습니다:

```php
use Filament\Support\Enums\IconPosition;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->icon('heroicon-m-envelope')
    ->iconPosition(IconPosition::After) // `IconPosition::Before` 또는 `IconPosition::After`
```

<AutoScreenshot name="tables/columns/text/icon-after" alt="아이콘이 뒤에 있는 TextColumn" version="3.x" />

아이콘 색상은 기본적으로 텍스트 색상과 동일하지만, `iconColor()`를 사용하여 아이콘 색상을 별도로 지정할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->icon('heroicon-m-envelope')
    ->iconColor('primary')
```

<AutoScreenshot name="tables/columns/text/icon-color" alt="기본 색상으로 아이콘이 있는 TextColumn" version="3.x" />

## 텍스트 크기 커스터마이징 {#customizing-the-text-size}

TextColumn은 기본적으로 작은 글꼴 크기를 사용하지만, `TextColumnSize::ExtraSmall`, `TextColumnSize::Medium`, 또는 `TextColumnSize::Large`로 변경할 수 있습니다.

예를 들어, `size(TextColumnSize::Large)`를 사용하여 텍스트를 더 크게 만들 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->size(TextColumn\TextColumnSize::Large)
```

<AutoScreenshot name="tables/columns/text/large" alt="큰 글꼴 크기의 TextColumn" version="3.x" />

## 글꼴 두께 커스터마이징 {#customizing-the-font-weight}

TextColumn은 기본적으로 일반 글꼴 두께를 사용하지만, 다음 옵션 중 하나로 변경할 수 있습니다: `FontWeight::Thin`, `FontWeight::ExtraLight`, `FontWeight::Light`, `FontWeight::Medium`, `FontWeight::SemiBold`, `FontWeight::Bold`, `FontWeight::ExtraBold`, 또는 `FontWeight::Black`입니다.

예를 들어, `weight(FontWeight::Bold)`를 사용하여 글꼴을 굵게 만들 수 있습니다:

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->weight(FontWeight::Bold)
```

<AutoScreenshot name="tables/columns/text/bold" alt="굵은 글꼴의 TextColumn" version="3.x" />

## 글꼴 패밀리 커스터마이징 {#customizing-the-font-family}

텍스트 글꼴 패밀리는 다음 옵션 중 하나로 변경할 수 있습니다: `FontFamily::Sans`, `FontFamily::Serif`, 또는 `FontFamily::Mono`입니다.

예를 들어, 글꼴을 모노스페이스로 변경하려면 `fontFamily(FontFamily::Mono)`를 사용할 수 있습니다:

```php
use Filament\Support\Enums\FontFamily;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->fontFamily(FontFamily::Mono)
```

<AutoScreenshot name="tables/columns/text/mono" alt="모노스페이스 글꼴의 TextColumn" version="3.x" />

## 텍스트를 클립보드에 복사할 수 있도록 허용하기 {#allowing-the-text-to-be-copied-to-the-clipboard}

셀을 클릭하면 텍스트가 클립보드에 복사되도록 텍스트를 복사 가능하게 만들 수 있으며, 선택적으로 사용자 지정 확인 메시지와 밀리초 단위의 지속 시간을 지정할 수 있습니다. 이 기능은 앱에 SSL이 활성화되어 있을 때만 작동합니다.

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->copyable()
    ->copyMessage('이메일 주소가 복사되었습니다')
    ->copyMessageDuration(1500)
```

<AutoScreenshot name="tables/columns/text/copyable" alt="복사 버튼이 있는 TextColumn" version="3.x" />

### 클립보드에 복사되는 텍스트 커스터마이징하기 {#customizing-the-text-that-is-copied-to-the-clipboard}

`copyableState()` 메서드를 사용하여 클립보드에 복사되는 텍스트를 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('url')
    ->copyable()
    ->copyableState(fn (string $state): string => "URL: {$state}")
```

이 함수에서는 `$record`를 통해 전체 테이블 행에 접근할 수 있습니다:

```php
use App\Models\Post;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('url')
    ->copyable()
    ->copyableState(fn (Post $record): string => "URL: {$record->url}")
```

## 행 인덱스 표시하기 {#displaying-the-row-index}

테이블에서 현재 행의 번호를 표시하는 컬럼이 필요할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Contracts\HasTable;

TextColumn::make('index')->state(
    static function (HasTable $livewire, stdClass $rowLoop): string {
        return (string) (
            $rowLoop->iteration +
            ($livewire->getTableRecordsPerPage() * (
                $livewire->getTablePage() - 1
            ))
        );
    }
),
```

`$rowLoop`는 [Laravel Blade의 `$loop` 객체](https://laravel.com/docs/blade#the-loop-variable)이므로, 다른 모든 `$loop` 속성도 참조할 수 있습니다.

더 간단하게, `rowIndex()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('index')
    ->rowIndex()
```

0부터 카운트를 시작하려면 `isFromZero: true`를 사용하세요:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('index')
    ->rowIndex(isFromZero: true)
```
