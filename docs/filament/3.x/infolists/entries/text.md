---
title: TextEntry
---
# [인포리스트.엔트리] TextEntry

## 개요 {#overview}

TextEntry는 간단한 텍스트를 표시합니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
```

<AutoScreenshot name="infolists/entries/text/simple" alt="TextEntry" version="3.x" />

## "배지"로 표시하기 {#displaying-as-a-badge}

기본적으로 텍스트는 매우 단순하며 배경색이 없습니다. `badge()` 메서드를 사용하면 텍스트를 "배지"처럼 표시할 수 있습니다. 이 기능은 상태(status)를 표시할 때 유용하며, 상태에 맞는 [색상](#customizing-the-color)으로 배지를 표시할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->badge()
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'gray',
        'reviewing' => 'warning',
        'published' => 'success',
        'rejected' => 'danger',
    })
```

<AutoScreenshot name="infolists/entries/text/badge" alt="Text entry as badge" version="3.x" />

배지에 [아이콘 추가](#adding-an-icon)와 같은 다른 요소도 추가할 수 있습니다.

## 날짜 형식 지정 {#date-formatting}

엔트리의 상태를 [PHP 날짜 형식 토큰](https://www.php.net/manual/en/datetime.format.php)을 사용하여 포맷하려면 `date()` 및 `dateTime()` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->dateTime()
```

엔트리의 상태를 [Carbon의 `diffForHumans()`](https://carbon.nesbot.com/docs/#api-humandiff)를 사용하여 포맷하려면 `since()` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->since()
```

또한, 추가 정보를 제공하기 위해 툴팁에 포맷된 날짜를 표시하려면 `dateTooltip()`, `dateTimeTooltip()`, 또는 `timeTooltip()` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->since()
    ->dateTimeTooltip()
```

## 숫자 형식 지정 {#number-formatting}

`numeric()` 메서드를 사용하면 엔트리을 숫자로 형식화할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('stock')
    ->numeric()
```

숫자를 형식화할 때 사용할 소수점 자릿수를 커스터마이즈하고 싶다면, `decimalPlaces` 인수를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('stock')
    ->numeric(decimalPlaces: 0)
```

기본적으로 앱의 로케일이 숫자를 적절하게 형식화하는 데 사용됩니다. 사용되는 로케일을 커스터마이즈하고 싶다면, `locale` 인수에 값을 전달할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('stock')
    ->numeric(locale: 'nl')
```

또는, 서비스 프로바이더의 `boot()` 메서드에서 `Infolist::$defaultNumberLocale` 메서드를 사용하여 앱 전체에서 사용할 기본 로케일을 설정할 수도 있습니다:

```php
use Filament\Infolists\Infolist;

Infolist::$defaultNumberLocale = 'nl';
```

## 통화 형식 지정 {#currency-formatting}

`money()` 메서드를 사용하면 어떤 통화든지 손쉽게 금액 값을 형식화할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR')
```

또한, `money()`에는 `divideBy` 인자가 있어, 형식화하기 전에 원래 값을 특정 숫자로 나눌 수 있습니다. 예를 들어, 데이터베이스에 가격이 센트 단위로 저장되어 있다면 유용하게 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR', divideBy: 100)
```

기본적으로 앱의 로케일이 금액을 적절하게 형식화하는 데 사용됩니다. 사용되는 로케일을 직접 지정하고 싶다면 `locale` 인자에 값을 전달할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR', locale: 'nl')
```

또는, 서비스 프로바이더의 `boot()` 메서드에서 `Infolist::$defaultNumberLocale` 메서드를 사용해 앱 전체에서 사용할 기본 로케일을 설정할 수도 있습니다:

```php
use Filament\Infolists\Infolist;

Infolist::$defaultNumberLocale = 'nl';
```

## 텍스트 길이 제한하기 {#limiting-text-length}

엔트리의 값 길이를 `limit()`으로 제한할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->limit(50)
```

`limit()`에 전달되는 값을 재사용할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->limit(50)
    ->tooltip(function (TextEntry $component): ?string {
        $state = $component->getState();

        if (strlen($state) <= $component->getCharacterLimit()) {
            return null;
        }

        // 엔트리 내용이 길이 제한을 초과할 때만 툴팁을 렌더링합니다.
        return $state;
    })
```

## 단어 수 제한하기 {#limiting-word-count}

엔트리에 표시되는 `words()`의 개수를 제한할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->words(10)
```

## 텍스트를 특정 줄 수로 제한하기 {#limiting-text-to-a-specific-number-of-lines}

텍스트를 고정된 길이로 제한하는 대신, 특정 줄 수로 제한하고 싶을 수 있습니다. 줄 수로 텍스트를 클램핑하는 것은 모든 화면 크기에서 일관된 경험을 보장하고자 할 때 반응형 인터페이스에서 유용합니다. 이는 `lineClamp()` 메서드를 사용하여 달성할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->lineClamp(2)
```

## 여러 값 나열하기 {#listing-multiple-values}

기본적으로 TextEntry에 여러 값이 있으면 쉼표로 구분되어 표시됩니다. 각 값을 새로운 줄에 표시하려면 `listWithLineBreaks()` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
```

<AutoScreenshot name="infolists/entries/text/list" alt="여러 값이 있는 TextEntry" version="3.x" />

### 목록에 글머리 기호 추가하기 {#adding-bullet-points-to-the-list}

각 목록 엔트리에 글머리 기호를 추가하려면 `bulleted()` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
    ->bulleted()
```

<AutoScreenshot name="infolists/entries/text/bullet-list" alt="여러 값과 글머리 기호가 있는 TextEntry" version="3.x" />

### 목록의 값 개수 제한하기 {#limiting-the-number-of-values-in-the-list}

`limitList()` 메서드를 사용하여 목록의 값 개수를 제한할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
```

#### 제한된 목록 확장하기 {#expanding-the-limited-list}

`expandableLimitedList()` 메서드를 사용하여 제한된 엔트리을 확장하거나 축소할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
    ->expandableLimitedList()
```

이 기능은 각 엔트리이 개별 줄에 표시되는 `listWithLineBreaks()` 또는 `bulleted()`에서만 사용할 수 있다는 점에 유의하세요.

### 리스트 구분자 사용하기 {#using-a-list-separator}

모델의 텍스트 문자열을 여러 리스트 엔트리으로 "분리"하고 싶다면, `separator()` 메서드를 사용할 수 있습니다. 예를 들어, 쉼표로 구분된 태그를 [배지로 표시](#displaying-as-a-badge)할 때 유용합니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('tags')
    ->badge()
    ->separator(',')
```

## HTML 렌더링 {#rendering-html}

입력 값이 HTML인 경우, `html()`을 사용하여 렌더링할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->html()
```

이 방법을 사용하면, 렌더링 전에 HTML이 잠재적으로 안전하지 않은 내용을 제거하도록 정제(sanitize)됩니다. 이러한 동작을 원하지 않는 경우, HTML을 `HtmlString` 객체로 감싸서 포맷할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Support\HtmlString;

TextEntry::make('description')
    ->formatStateUsing(fn (string $state): HtmlString => new HtmlString($state))
```

또는, `formatStateUsing()` 메서드에서 `view()` 객체를 반환할 수도 있으며, 이 경우에도 정제되지 않습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Contracts\View\View;

TextEntry::make('description')
    ->formatStateUsing(fn (string $state): View => view(
        'filament.infolists.components.description-entry-content',
        ['state' => $state],
    ))
```

### 마크다운을 HTML로 렌더링하기 {#rendering-markdown-as-html}

입력 값이 마크다운인 경우, `markdown()`을 사용하여 렌더링할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->markdown()
```

## 사용자 지정 포맷팅 {#custom-formatting}

대신 `formatStateUsing()`에 사용자 지정 포맷팅 콜백을 전달할 수 있습니다. 이 콜백은 엔트리의 `$state`와 선택적으로 `$record`를 인자로 받습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->formatStateUsing(fn (string $state): string => __("statuses.{$state}"))
```

## 색상 사용자 지정 {#customizing-the-color}

텍스트의 색상을 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나로 설정할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->color('primary')
```

<AutoScreenshot name="infolists/entries/text/color" alt="기본 색상의 TextEntry" version="3.x" />

## 아이콘 추가하기 {#adding-an-icon}

TextEntry에는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('email')
    ->icon('heroicon-m-envelope')
```

<AutoScreenshot name="infolists/entries/text/icon" alt="아이콘이 있는 TextEntry" version="3.x" />

`iconPosition()`을 사용하여 아이콘의 위치를 지정할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\IconPosition;

TextEntry::make('email')
    ->icon('heroicon-m-envelope')
    ->iconPosition(IconPosition::After) // `IconPosition::Before` 또는 `IconPosition::After`
```

<AutoScreenshot name="infolists/entries/text/icon-after" alt="아이콘이 뒤에 있는 TextEntry" version="3.x" />

아이콘 색상은 기본적으로 텍스트 색상과 동일하지만, `iconColor()`를 사용하여 아이콘 색상을 별도로 지정할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('email')
    ->icon('heroicon-m-envelope')
    ->iconColor('primary')
```

<AutoScreenshot name="infolists/entries/text/icon-color" alt="기본 색상(primary) 아이콘이 있는 TextEntry" version="3.x" />

## 텍스트 크기 커스터마이징 {#customizing-the-text-size}

텍스트 컬럼은 기본적으로 작은 글꼴 크기를 사용하지만, 이를 `TextEntrySize::ExtraSmall`, `TextEntrySize::Medium`, 또는 `TextEntrySize::Large`로 변경할 수 있습니다.

예를 들어, `size(TextEntrySize::Large)`를 사용하여 텍스트를 더 크게 만들 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->size(TextEntry\TextEntrySize::Large)
```

<AutoScreenshot name="infolists/entries/text/large" alt="큰 글꼴 크기의 TextEntry" version="3.x" />

## 글꼴 두께 커스터마이징 {#customizing-the-font-weight}

TextEntry는 기본적으로 일반 글꼴 두께를 사용하지만, 다음 옵션 중 하나로 변경할 수 있습니다: `FontWeight::Thin`, `FontWeight::ExtraLight`, `FontWeight::Light`, `FontWeight::Medium`, `FontWeight::SemiBold`, `FontWeight::Bold`, `FontWeight::ExtraBold`, 또는 `FontWeight::Black`입니다.

예를 들어, `weight(FontWeight::Bold)`를 사용하여 글꼴을 굵게 만들 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\FontWeight;

TextEntry::make('title')
    ->weight(FontWeight::Bold)
```

<AutoScreenshot name="infolists/entries/text/bold" alt="굵은 글꼴의 TextEntry" version="3.x" />

## 글꼴 패밀리 커스터마이징 {#customizing-the-font-family}

텍스트 글꼴 패밀리는 다음 옵션 중 하나로 변경할 수 있습니다: `FontFamily::Sans`, `FontFamily::Serif`, 또는 `FontFamily::Mono`.

예를 들어, `fontFamily(FontFamily::Mono)`를 사용하여 글꼴을 고정폭(monospaced)으로 만들 수 있습니다:

```php
use Filament\Support\Enums\FontFamily;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->fontFamily(FontFamily::Mono)
```

<AutoScreenshot name="infolists/entries/text/mono" alt="고정폭 글꼴의 TextEntry" version="3.x" />

## 텍스트를 클립보드에 복사할 수 있도록 허용하기 {#allowing-the-text-to-be-copied-to-the-clipboard}

텍스트를 복사 가능하게 만들어, 엔트리을 클릭하면 텍스트가 클립보드에 복사되도록 할 수 있습니다. 또한, 선택적으로 사용자 지정 확인 메시지와 밀리초 단위의 지속 시간을 지정할 수 있습니다. 이 기능은 앱에 SSL이 활성화되어 있을 때만 작동합니다.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->copyable()
    ->copyMessage('복사되었습니다!')
    ->copyMessageDuration(1500)
```

<AutoScreenshot name="infolists/entries/text/copyable" alt="복사 버튼이 있는 TextEntry" version="3.x" />