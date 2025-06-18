---
title: CheckboxList
---
# [폼.필드] CheckboxList


## 개요 {#overview}

<LaracastsBanner
    title="체크박스 리스트"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈를 시청하세요. 이 시리즈는 Filament 폼에 체크박스 리스트 필드를 추가하는 기본 방법을 알려줍니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/5"
    series="rapid-laravel-development"
/>


체크박스 리스트 컴포넌트를 사용하면 미리 정의된 옵션 목록에서 여러 값을 선택할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

<AutoScreenshot name="forms/fields/checkbox-list/simple" alt="체크박스 리스트" version="3.x" />

이 옵션들은 JSON 형식으로 반환됩니다. Eloquent를 사용하여 저장하는 경우, 모델 속성에 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    protected $casts = [
        'technologies' => 'array',
    ];

    // ...
}
```

## 옵션 라벨에서 HTML 허용하기 {#allowing-html-in-the-option-labels}

기본적으로 Filament는 옵션 라벨에 있는 모든 HTML을 이스케이프 처리합니다. HTML을 허용하고 싶다면 `allowHtml()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchable()
    ->allowHtml()
```

HTML을 렌더링해도 안전한지 반드시 확인해야 합니다. 그렇지 않으면 애플리케이션이 XSS 공격에 취약해질 수 있습니다.

## 옵션 설명 설정하기 {#setting-option-descriptions}

각 옵션에 대해 `descriptions()` 메서드를 사용하여 선택적으로 설명을 제공할 수 있습니다. 이 메서드는 일반 텍스트 문자열의 배열이나, `Illuminate\Support\HtmlString` 또는 `Illuminate\Contracts\Support\Htmlable`의 인스턴스를 받을 수 있습니다. 이를 통해 설명에 HTML이나 마크다운을 렌더링할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Support\HtmlString;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
    ->descriptions([
        'tailwind' => 'HTML을 벗어나지 않고도 현대적인 웹사이트를 빠르게 구축할 수 있는 유틸리티 퍼스트 CSS 프레임워크입니다.',
        'alpine' => new HtmlString('마크업 <strong>내부에서 직접</strong> 동작을 구성할 수 있는 견고하고 최소한의 도구입니다.'),
        'laravel' => str('표현력 있고 우아한 문법을 가진 **웹 애플리케이션** 프레임워크입니다.')->inlineMarkdown()->toHtmlString(),
        'livewire' => 'Laravel에서 동적 인터페이스를 간편하게 구축할 수 있는 풀스택 프레임워크입니다.',
    ])
```

<AutoScreenshot name="forms/fields/checkbox-list/option-descriptions" alt="옵션 설명이 있는 체크박스 리스트" version="3.x" />

설명 배열의 `key`가 옵션 배열의 `key`와 동일해야 올바른 설명이 올바른 옵션에 매칭됩니다.

## 옵션을 열로 분할하기 {#splitting-options-into-columns}

옵션을 `columns()` 메서드를 사용하여 여러 열로 분할할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
```

<AutoScreenshot name="forms/fields/checkbox-list/columns" alt="2열로 구성된 체크박스 리스트" version="3.x" />

이 메서드는 [grid](/filament/3.x/forms/layout/grid)의 `columns()` 메서드와 동일한 옵션을 허용합니다. 이를 통해 다양한 브레이크포인트에서 열의 개수를 반응형으로 커스터마이즈할 수 있습니다.

### 그리드 방향 설정하기 {#setting-the-grid-direction}

기본적으로 체크박스를 여러 열로 배치하면, 체크박스들은 세로로 정렬됩니다. 만약 가로로 나열하고 싶다면, `gridDirection('row')` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
    ->gridDirection('row')
```

<AutoScreenshot name="forms/fields/checkbox-list/rows" alt="2줄로 구성된 체크박스 리스트" version="3.x" />

## 특정 옵션 비활성화하기 {#disabling-specific-options}

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 인자로 받으며, 해당 클로저에서 특정 `$value` 값을 가진 옵션을 비활성화할지 여부를 확인할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'livewire')
```

비활성화되지 않은 옵션만 가져오고 싶다면(예: 유효성 검사 목적 등), `getEnabledOptions()`를 사용할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
        'heroicons' => 'SVG icons',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'heroicons')
    ->in(fn (CheckboxList $component): array => array_keys($component->getEnabledOptions()))
```

## 검색 옵션 {#searching-options}

`searchable()` 메서드를 사용하여 많은 옵션에 더 쉽게 접근할 수 있도록 검색 입력을 활성화할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
```

<AutoScreenshot name="forms/fields/checkbox-list/searchable" alt="검색 가능한 체크박스 리스트" version="3.x" />

## 체크박스 일괄 전환 {#bulk-toggling-checkboxes}

`bulkToggleable()` 메서드를 사용하여 사용자가 모든 체크박스를 한 번에 전환할 수 있도록 허용할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->bulkToggleable()
```

<AutoScreenshot name="forms/fields/checkbox-list/bulk-toggleable" alt="일괄 전환 가능한 체크박스 리스트" version="3.x" />

## Eloquent 관계와 통합하기 {#integrating-with-an-eloquent-relationship}

> Livewire 컴포넌트 내에서 폼을 구축하는 경우, 반드시 [폼의 모델](../adding-a-form-to-a-livewire-component#setting-a-form-model)을 설정해야 합니다. 그렇지 않으면 Filament는 어떤 모델에서 관계를 가져와야 하는지 알 수 없습니다.

`CheckboxList`의 `relationship()` 메서드를 사용하여 `BelongsToMany` 관계를 지정할 수 있습니다. Filament는 관계에서 옵션을 불러오고, 폼이 제출될 때 해당 값을 관계의 pivot 테이블에 저장합니다. `titleAttribute`는 각 옵션의 라벨을 생성할 때 사용할 컬럼의 이름입니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->relationship(titleAttribute: 'name')
```

`relationship()`과 함께 `disabled()`를 사용할 때는, 반드시 `disabled()`를 `relationship()`보다 먼저 호출해야 합니다. 이렇게 하면 `relationship()` 내부의 `dehydrated()` 호출이 `disabled()`의 호출에 의해 덮어써지지 않게 됩니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->disabled()
    ->relationship(titleAttribute: 'name')
```

### 관계 쿼리 커스터마이징하기 {#customizing-the-relationship-query}

옵션을 가져오는 데이터베이스 쿼리는 `relationship()` 메서드의 `modifyOptionsQueryUsing` 파라미터를 사용하여 커스터마이징할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Database\Eloquent\Builder;

CheckboxList::make('technologies')
    ->relationship(
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->withTrashed(),
    )
```

### 관계 옵션 라벨 커스터마이징하기 {#customizing-the-relationship-option-labels}

각 옵션의 라벨을 더 설명적으로 만들거나, 예를 들어 이름과 성을 합치고 싶다면, 데이터베이스 마이그레이션에서 가상 컬럼을 사용할 수 있습니다:

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('authors')
    ->relationship(titleAttribute: 'full_name')
```

또는, `getOptionLabelFromRecordUsing()` 메서드를 사용하여 옵션의 Eloquent 모델을 라벨로 변환할 수도 있습니다:

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

CheckboxList::make('authors')
    ->relationship(
        modifyQueryUsing: fn (Builder $query) => $query->orderBy('first_name')->orderBy('last_name'),
    )
    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->first_name} {$record->last_name}")
```

### 관계에 피벗 데이터 저장하기 {#saving-pivot-data-to-the-relationship}

피벗 테이블에 추가 컬럼이 있는 경우, `pivotData()` 메서드를 사용하여 해당 컬럼에 저장할 데이터를 지정할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('primaryTechnologies')
    ->relationship(name: 'technologies', titleAttribute: 'name')
    ->pivotData([
        'is_primary' => true,
    ])
```

## 사용자 지정 검색 결과 없음 메시지 설정하기 {#setting-a-custom-no-search-results-message}

검색 가능한 체크박스 리스트를 사용할 때, 검색 결과가 없을 경우 사용자 지정 메시지를 표시하고 싶을 수 있습니다. `noSearchResultsMessage()` 메서드를 사용하여 이를 설정할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->noSearchResultsMessage('기술을 찾을 수 없습니다.')
```

## 사용자 지정 검색 프롬프트 설정 {#setting-a-custom-search-prompt}

검색 가능한 체크박스 리스트를 사용할 때, 사용자가 아직 검색어를 입력하지 않았을 때의 검색 입력란 플레이스홀더를 변경하고 싶을 수 있습니다. 이럴 때는 `searchPrompt()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->searchPrompt('기술을 검색하세요')
```

## 검색 디바운스 조정하기 {#tweaking-the-search-debounce}

기본적으로 Filament는 사용자가 검색 가능한 체크박스 리스트에 입력할 때 옵션을 검색하기 전에 1000밀리초(1초)를 대기합니다. 또한 사용자가 검색 입력란에 계속 입력할 경우, 검색 사이에도 1000밀리초를 대기합니다. 이 값은 `searchDebounce()` 메서드를 사용하여 변경할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->searchDebounce(500)
```

## 체크박스 리스트 액션 객체 커스터마이징 {#customizing-the-checkbox-list-action-objects}

이 필드는 내부 버튼을 쉽게 커스터마이징할 수 있도록 액션 객체를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이즈할 수 있습니다. 이 함수는 `$action` 객체에 접근할 수 있으며, 이를 사용해 [커스터마이즈](../../actions/trigger-button)할 수 있습니다. 액션을 커스터마이즈할 수 있는 다음 메서드들이 제공됩니다:

- `selectAllAction()`
- `deselectAllAction()`

다음은 액션을 커스터마이즈하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->selectAllAction(
        fn (Action $action) => $action->label('모든 기술 선택'),
    )
```
