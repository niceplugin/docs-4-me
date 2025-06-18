---
title: 시작하기
---
# [인포리스트.엔트리] 시작하기

## 개요 {#overview}

Entry 클래스는 `Filament\Infolists\Components` 네임스페이스에서 찾을 수 있습니다. 이 클래스들은 `$infolist->schema()` 메서드 안에 넣을 수 있습니다:

```php
use Filament\Infolists\Infolist;

public function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            // ...
        ]);
}
```

[패널 빌더 리소스](../../panels/resources) 내부에 있다면, `infolist()` 메서드는 static이어야 합니다:

```php
use Filament\Infolists\Infolist;

public static function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            // ...
        ]);
}
```

Entry는 고유한 이름을 전달하여 static `make()` 메서드를 사용해 생성할 수 있습니다. 관계 내의 entry에 접근할 때는 "dot notation"을 사용할 수 있습니다.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')

TextEntry::make('author.name')
```

<AutoScreenshot name="infolists/entries/simple" alt="인포리스트의 엔트리" version="3.x" />

## 사용 가능한 엔트리 {#available-entries}

- [텍스트 엔트리](text)
- [아이콘 엔트리](icon)
- [이미지 엔트리](image)
- [색상 엔트리](color)
- [키-값 엔트리](key-value)
- [반복 가능한 엔트리](repeatable)

또한 데이터를 원하는 방식으로 표시할 수 있도록 [사용자 지정 엔트리을 직접 생성](custom)할 수도 있습니다.

## 레이블 설정하기 {#setting-a-label}

기본적으로 인포리스트 헤더에 표시되는 엔트리의 레이블은 엔트리의 이름에서 자동으로 생성됩니다. `label()` 메서드를 사용하여 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->label('Post title')
```

선택적으로, `translateLabel()` 메서드를 사용하여 [라라벨의 로컬라이제이션 기능](https://laravel.com/docs/localization)으로 레이블을 자동 번역할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->translateLabel() // `label(__('Title'))`과 동일합니다
```

## 엔트리 URL {#entry-urls}

엔트리를 클릭하면 URL을 열 수 있습니다.

### URL 열기 {#opening-urls}

URL을 열기 위해서는 `url()` 메서드를 사용하여 콜백이나 정적 URL을 전달할 수 있습니다. 콜백은 `$record` 파라미터를 받아 URL을 커스터마이즈할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
```

또한, URL을 새 탭에서 열도록 선택할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
    ->openUrlInNewTab()
```

## 기본값 설정하기 {#setting-a-default-value}

비어 있는 상태의 엔트리에 기본값을 설정하려면 `default()` 메서드를 사용할 수 있습니다. 이 메서드는 기본 상태를 실제 값처럼 처리하므로, [image](image)나 [color](color)와 같은 엔트리도 기본 이미지나 색상을 표시합니다.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->default('Untitled')
```

## 엔트리이 비어 있을 때 플레이스홀더 텍스트 추가하기 {#adding-placeholder-text-if-an-entry-is-empty}

때때로 엔트리이 비어 있는 상태일 때 연한 회색 텍스트로 플레이스홀더를 표시하고 싶을 수 있습니다. 이는 [기본값 설정](#setting-a-default-value)과는 다르며, 플레이스홀더는 항상 텍스트로만 표시되고 실제 상태로 간주되지 않습니다.

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->placeholder('제목 없음')
```

<AutoScreenshot name="infolists/entries/placeholder" alt="비어 있는 상태에 대한 플레이스홀더가 있는 엔트리" version="3.x" />

## 입력 아래에 도움말 텍스트 추가하기 {#adding-helper-text-below-the-entry}

때때로, 인포리스트의 사용자에게 추가 정보를 제공하고 싶을 수 있습니다. 이를 위해 입력 아래에 도움말 텍스트를 추가할 수 있습니다.

`helperText()` 메서드는 도움말 텍스트를 추가하는 데 사용됩니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->helperText('여기에 전체 이름을 입력하세요. 중간 이름도 포함됩니다.')
```

이 메서드는 일반 텍스트 문자열, 또는 `Illuminate\Support\HtmlString` 혹은 `Illuminate\Contracts\Support\Htmlable`의 인스턴스를 받을 수 있습니다. 이를 통해 도움말 텍스트에 HTML이나 마크다운을 렌더링할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Support\HtmlString;

TextEntry::make('name')
    ->helperText(new HtmlString('여기에 <strong>전체 이름</strong>을 입력하세요. 중간 이름도 포함됩니다.'))

TextEntry::make('name')
    ->helperText(str('여기에 **전체 이름**을 입력하세요. 중간 이름도 포함됩니다.')->inlineMarkdown()->toHtmlString())

TextEntry::make('name')
    ->helperText(view('name-helper-text'))
```

<AutoScreenshot name="infolists/entries/helper-text" alt="도움말 텍스트가 있는 엔트리" version="3.x" />

## 레이블 옆에 힌트 추가하기 {#adding-a-hint-next-to-the-label}

입력란 아래에 [도움말 텍스트](#adding-helper-text-below-the-entry)를 추가할 수 있을 뿐만 아니라, 입력란의 레이블 옆에 "힌트"를 추가할 수도 있습니다. 이는 입력란에 대한 추가 정보를 표시할 때 유용하며, 예를 들어 도움말 페이지로 연결되는 링크를 제공할 수 있습니다.

`hint()` 메서드를 사용하여 힌트를 추가할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API 키')
    ->hint('문서? 무슨 문서?!')
```

이 메서드는 일반 텍스트 문자열, 또는 `Illuminate\Support\HtmlString` 혹은 `Illuminate\Contracts\Support\Htmlable`의 인스턴스를 받을 수 있습니다. 이를 통해 도움말 텍스트에 HTML이나 마크다운을 렌더링할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API 키')
    ->hint(new HtmlString('<a href="/documentation">문서</a>'))

TextEntry::make('apiKey')
    ->label('API 키')
    ->hint(str('[문서](/documentation)')->inlineMarkdown()->toHtmlString())

TextEntry::make('apiKey')
    ->label('API 키')
    ->hint(view('api-key-hint'))
```

<AutoScreenshot name="infolists/entries/hint" alt="힌트가 있는 입력란" version="3.x" />

### 힌트의 텍스트 색상 변경하기 {#changing-the-text-color-of-the-hint}

힌트의 텍스트 색상을 변경할 수 있습니다. 기본적으로는 회색이지만, `danger`, `info`, `primary`, `success`, `warning` 색상을 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->hint(str('[Documentation](/documentation)')->inlineMarkdown()->toHtmlString())
    ->hintColor('primary')
```

<AutoScreenshot name="infolists/entries/hint-color" alt="힌트 색상이 적용된 엔트리" version="3.x" />

### 힌트 옆에 아이콘 추가하기 {#adding-an-icon-aside-the-hint}

힌트에는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 함께 표시할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->hint(str('[Documentation](/documentation)')->inlineMarkdown()->toHtmlString())
    ->hintIcon('heroicon-m-question-mark-circle')
```

<AutoScreenshot name="infolists/entries/hint-icon" alt="힌트 아이콘이 있는 엔트리" version="3.x" />

#### 힌트 아이콘에 툴팁 추가하기 {#adding-a-tooltip-to-a-hint-icon}

또한, `hintIcon()`의 `tooltip` 파라미터를 사용하여 힌트 아이콘에 마우스를 올렸을 때 표시되는 툴팁을 추가할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->hint(str('[Documentation](/documentation)')->inlineMarkdown()->toHtmlString())
    ->hintIcon('heroicon-m-question-mark-circle', tooltip: '읽어보세요!')
```

## 엔트리 숨기기 {#hiding-entries}

엔트리을 조건부로 숨기려면, `hidden()` 또는 `visible()` 메서드 중 원하는 것을 사용할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->hidden(! auth()->user()->isAdmin())
// 또는
TextEntry::make('role')
    ->visible(auth()->user()->isAdmin())
```

## 계산된 상태 {#calculated-state}

때때로 데이터베이스 엔트리에서 직접 값을 읽는 대신, 엔트리의 상태를 계산해야 할 때가 있습니다.

`state()` 메서드에 콜백 함수를 전달하면 해당 엔트리에 대해 반환되는 상태를 커스터마이즈할 수 있습니다:

```php
Infolists\Components\TextEntry::make('amount_including_vat')
    ->state(function (Model $record): float {
        return $record->amount * (1 + $record->vat_rate);
    })
```

## 툴팁 {#tooltips}

엔트리 위에 마우스를 올렸을 때 표시할 툴팁을 지정할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->tooltip('페이지 상단에 표시됨')
```

<AutoScreenshot name="infolists/entries/tooltips" alt="툴팁이 있는 엔트리" version="3.x" />

이 메서드는 현재 인포리스트 레코드에 접근할 수 있는 클로저도 허용합니다:

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Database\Eloquent\Model;

TextEntry::make('title')
    ->tooltip(fn (Model $record): string => "작성자: {$record->author->name}")
```

## 사용자 지정 속성 {#custom-attributes}

엔트리의 HTML은 `extraAttributes()`에 배열을 전달하여 사용자 지정할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraAttributes(['class' => 'bg-gray-200'])
```

이 속성들은 해당 엔트리의 바깥쪽 `<div>` 요소에 병합됩니다.

또한, 라벨, 엔트리, 기타 텍스트를 감싸는 엔트리 래퍼에 추가 HTML 속성을 전달할 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraEntryWrapperAttributes(['class' => 'entry-locked'])
```

## 전역 설정 {#global-settings}

모든 엔트리의 기본 동작을 전역적으로 변경하고 싶다면, 서비스 프로바이더의 `boot()` 메서드 안에서 정적 `configureUsing()` 메서드를 호출할 수 있습니다. 이때, 엔트리을 수정할 수 있는 클로저를 전달합니다. 예를 들어, 모든 `TextEntry` 컴포넌트를 [`words(10)`](text#limiting-word-count)로 만들고 싶다면 다음과 같이 할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::configureUsing(function (TextEntry $entry): void {
    $entry
        ->words(10);
});
```

물론, 각 엔트리별로 개별적으로 이 설정을 덮어쓸 수도 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->words(null)
```
