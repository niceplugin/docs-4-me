---
title: 글로벌 검색
---
# [패널.리소스] 전역 검색
## 개요 {#overview}

글로벌 검색을 사용하면 앱 어디에서나 모든 리소스 레코드를 검색할 수 있습니다.

## 글로벌 검색 결과 제목 설정하기 {#setting-global-search-result-titles}

모델에서 글로벌 검색을 활성화하려면, 리소스에 [제목 속성](getting-started#record-titles)을 설정해야 합니다:

```php
protected static ?string $recordTitleAttribute = 'title';
```

이 속성은 해당 레코드의 검색 결과 제목을 가져오는 데 사용됩니다.

> 리소스에 Edit 또는 View 페이지가 있어야 글로벌 검색 결과가 URL로 연결될 수 있습니다. 그렇지 않으면 이 리소스에 대한 결과가 반환되지 않습니다.

제목을 더 커스터마이즈하려면 `getGlobalSearchResultTitle()` 메서드를 오버라이드할 수 있습니다. 이 메서드는 일반 텍스트 문자열, 또는 `Illuminate\Support\HtmlString` 혹은 `Illuminate\Contracts\Support\Htmlable`의 인스턴스를 반환할 수 있습니다. 이를 통해 검색 결과 제목에 HTML이나 Markdown을 렌더링할 수 있습니다:

```php
use Illuminate\Contracts\Support\Htmlable;

public static function getGlobalSearchResultTitle(Model $record): string | Htmlable
{
    return $record->name;
}
```

## 여러 컬럼에서 글로벌 검색하기 {#globally-searching-across-multiple-columns}

리소스의 여러 컬럼에서 검색하고 싶다면, `getGloballySearchableAttributes()` 메서드를 오버라이드할 수 있습니다. "Dot notation"을 사용하면 관계 내부도 검색할 수 있습니다:

```php
public static function getGloballySearchableAttributes(): array
{
    return ['title', 'slug', 'author.name', 'category.name'];
}
```

## 글로벌 검색 결과에 추가 정보 표시하기 {#adding-extra-details-to-global-search-results}

검색 결과는 제목 아래에 "상세 정보"를 표시할 수 있어, 사용자에게 레코드에 대한 더 많은 정보를 제공합니다. 이 기능을 활성화하려면 `getGlobalSearchResultDetails()` 메서드를 오버라이드해야 합니다:

```php
public static function getGlobalSearchResultDetails(Model $record): array
{
    return [
        'Author' => $record->author->name,
        'Category' => $record->category->name,
    ];
}
```

이 예시에서는 레코드의 카테고리와 저자가 검색 결과의 제목 아래에 표시됩니다. 하지만 `category`와 `author` 관계는 지연 로딩(lazy-loading)되므로 성능이 저하될 수 있습니다. 이러한 관계를 [즉시 로딩](https://laravel.com/docs/eloquent-relationships#eager-loading)하려면, `getGlobalSearchEloquentQuery()` 메서드를 오버라이드해야 합니다:

```php
public static function getGlobalSearchEloquentQuery(): Builder
{
    return parent::getGlobalSearchEloquentQuery()->with(['author', 'category']);
}
```

## 글로벌 검색 결과 URL 커스터마이즈하기 {#customizing-global-search-result-urls}

글로벌 검색 결과는 리소스의 [Edit 페이지](editing-records)나, 사용자가 [수정 권한](editing-records#authorization)이 없을 경우 [View 페이지](viewing-records)로 연결됩니다. 이를 커스터마이즈하려면, `getGlobalSearchResultUrl()` 메서드를 오버라이드하여 원하는 라우트를 반환할 수 있습니다:

```php
public static function getGlobalSearchResultUrl(Model $record): string
{
    return UserResource::getUrl('edit', ['record' => $record]);
}
```

## 글로벌 검색 결과에 액션 추가하기 {#adding-actions-to-global-search-results}

글로벌 검색은 각 검색 결과 아래에 렌더링되는 버튼인 액션을 지원합니다. 이 버튼들은 URL을 열거나 Livewire 이벤트를 디스패치할 수 있습니다.

액션은 다음과 같이 정의할 수 있습니다:

```php
use Filament\GlobalSearch\Actions\Action;

public static function getGlobalSearchResultActions(Model $record): array
{
    return [
        Action::make('edit')
            ->url(static::getUrl('edit', ['record' => $record])),
    ];
}
```

액션 버튼 스타일링 방법에 대해 더 알고 싶다면 [여기](../../actions/trigger-button)를 참고하세요.

### 글로벌 검색 액션에서 URL 열기 {#opening-urls-from-global-search-actions}

액션을 클릭할 때 URL을 열 수 있으며, 선택적으로 새 탭에서 열 수도 있습니다:

```php
use Filament\GlobalSearch\Actions\Action;

Action::make('view')
    ->url(static::getUrl('view', ['record' => $record]), shouldOpenInNewTab: true)
```

### 글로벌 검색 액션에서 Livewire 이벤트 디스패치하기 {#dispatching-livewire-events-from-global-search-actions}

때때로 글로벌 검색 결과 액션이 클릭될 때 추가 코드를 실행하고 싶을 수 있습니다. 이는 액션 클릭 시 디스패치할 Livewire 이벤트를 설정함으로써 달성할 수 있습니다. 데이터 배열을 선택적으로 전달할 수 있으며, 이는 Livewire 컴포넌트의 이벤트 리스너에서 파라미터로 사용할 수 있습니다:

```php
use Filament\GlobalSearch\Actions\Action;

Action::make('quickView')
    ->dispatch('quickView', [$record->id])
```

## 글로벌 검색 결과 개수 제한하기 {#limiting-the-number-of-global-search-results}

기본적으로 글로벌 검색은 리소스당 최대 50개의 결과를 반환합니다. 리소스 라벨에서 `$globalSearchResultsLimit` 속성을 오버라이드하여 이를 커스터마이즈할 수 있습니다:

```php
protected static int $globalSearchResultsLimit = 20;
```

## 글로벌 검색 비활성화하기 {#disabling-global-search}

[위에서 설명한 것처럼](#title), 리소스에 제목 속성을 설정하면 글로벌 검색이 자동으로 활성화됩니다. 때로는 제목 속성은 지정하되 글로벌 검색은 활성화하지 않으려 할 수 있습니다.

이럴 때는 [설정](/filament/3.x/panels/configuration)에서 글로벌 검색을 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearch(false);
}
```

## 글로벌 검색 단축키 등록하기 {#registering-global-search-key-bindings}

글로벌 검색 필드는 키보드 단축키로 열 수 있습니다. 이를 설정하려면, [설정](/filament/3.x/panels/configuration)에서 `globalSearchKeyBindings()` 메서드를 사용하세요:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchKeyBindings(['command+k', 'ctrl+k']);
}
```

## 글로벌 검색 디바운스 설정하기 {#configuring-the-global-search-debounce}

글로벌 검색은 사용자가 입력하는 동안 요청 수를 제한하기 위해 기본적으로 500ms의 디바운스 시간이 설정되어 있습니다. [설정](/filament/3.x/panels/configuration)에서 `globalSearchDebounce()` 메서드를 사용하여 이를 변경할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchDebounce('750ms');
}
```

## 글로벌 검색 필드 접미사 설정하기 {#configuring-the-global-search-field-suffix}

글로벌 검색 필드는 기본적으로 접미사가 포함되어 있지 않습니다. [설정](/filament/3.x/panels/configuration)에서 `globalSearchFieldSuffix()` 메서드를 사용해 커스터마이즈할 수 있습니다.

현재 설정된 [글로벌 검색 단축키](#registering-global-search-key-bindings)를 접미사에 표시하고 싶다면, `globalSearchFieldKeyBindingSuffix()` 메서드를 사용할 수 있습니다. 이 메서드는 글로벌 검색 필드의 접미사로 첫 번째로 등록된 단축키를 표시합니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchFieldKeyBindingSuffix();
}
```

접미사를 직접 커스터마이즈하려면, `globalSearchFieldSuffix()` 메서드에 문자열이나 함수를 전달할 수 있습니다. 예를 들어, 각 플랫폼에 맞는 커스텀 단축키 접미사를 수동으로 제공하려면 다음과 같이 할 수 있습니다:

```php
use Filament\Panel;
use Filament\Support\Enums\Platform;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchFieldSuffix(fn (): ?string => match (Platform::detect()) {
            Platform::Windows, Platform::Linux => 'CTRL+K',
            Platform::Mac => '⌘K',
            default => null,
        });
}
```
