---
title: 체크박스 리스트
---
# [폼.필드] CheckboxList


## 개요 {#overview}

<LaracastsBanner
    title="Checkbox List"
    description="Laracasts에서 Filament로 빠르게 Laravel 개발하기 시리즈를 시청하세요 - Filament 폼에 체크박스 리스트 필드를 추가하는 기본을 배울 수 있습니다."
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

<AutoScreenshot name="forms/fields/checkbox-list/simple" alt="Checkbox list" version="3.x" />

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

## 옵션 라벨에 HTML 허용하기 {#allowing-html-in-the-option-labels}

기본적으로 Filament는 옵션 라벨의 모든 HTML을 이스케이프합니다. HTML을 허용하려면 `allowHtml()` 메서드를 사용할 수 있습니다:

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

렌더링할 HTML이 안전한지 반드시 확인해야 합니다. 그렇지 않으면 애플리케이션이 XSS 공격에 취약해질 수 있습니다.

## 옵션 설명 설정하기 {#setting-option-descriptions}

`descriptions()` 메서드를 사용하여 각 옵션에 설명을 추가할 수 있습니다. 이 메서드는 일반 텍스트 문자열의 배열, 또는 `Illuminate\Support\HtmlString` 혹은 `Illuminate\Contracts\Support\Htmlable` 인스턴스를 받을 수 있습니다. 이를 통해 설명에 HTML이나 마크다운을 렌더링할 수 있습니다:

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
        'tailwind' => 'HTML을 벗어나지 않고도 현대적인 웹사이트를 빠르게 구축할 수 있는 유틸리티 우선 CSS 프레임워크입니다.',
        'alpine' => new HtmlString('견고하고 최소한의 도구로 <strong>마크업 내에서 직접</strong> 동작을 구성할 수 있습니다.'),
        'laravel' => str('표현력 있고 우아한 문법의 **웹 애플리케이션** 프레임워크입니다.')->inlineMarkdown()->toHtmlString(),
        'livewire' => 'Laravel에서 동적 인터페이스를 간단하게 구축할 수 있는 풀스택 프레임워크입니다.',
    ])
```

<AutoScreenshot name="forms/fields/checkbox-list/option-descriptions" alt="Checkbox list with option descriptions" version="3.x" />

설명 배열의 `key`가 옵션 배열의 `key`와 동일해야 올바른 설명이 올바른 옵션에 매칭됩니다.

## 옵션을 여러 컬럼으로 나누기 {#splitting-options-into-columns}

`columns()` 메서드를 사용하여 옵션을 여러 컬럼으로 나눌 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
```

<AutoScreenshot name="forms/fields/checkbox-list/columns" alt="Checkbox list with 2 columns" version="3.x" />

이 메서드는 [grid](/filament/3.x/forms/layout/grid)의 `columns()` 메서드와 동일한 옵션을 받습니다. 이를 통해 다양한 브레이크포인트에서 컬럼 수를 반응형으로 커스터마이즈할 수 있습니다.

### 그리드 방향 설정하기 {#setting-the-grid-direction}

기본적으로 체크박스를 컬럼으로 정렬하면 세로로 나열됩니다. 가로로 나열하고 싶다면 `gridDirection('row')` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
    ->gridDirection('row')
```

<AutoScreenshot name="forms/fields/checkbox-list/rows" alt="Checkbox list with 2 rows" version="3.x" />

## 특정 옵션 비활성화하기 {#disabling-specific-options}

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 받으며, 특정 `$value`의 옵션을 비활성화할지 확인할 수 있습니다:

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

비활성화되지 않은 옵션을 가져오고 싶다면(예: 유효성 검사 목적), `getEnabledOptions()`를 사용할 수 있습니다:

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

## 옵션 검색하기 {#searching-options}

`searchable()` 메서드를 사용하여 많은 옵션에 쉽게 접근할 수 있도록 검색 입력을 활성화할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
```

<AutoScreenshot name="forms/fields/checkbox-list/searchable" alt="Searchable checkbox list" version="3.x" />

## 체크박스 일괄 토글하기 {#bulk-toggling-checkboxes}

`bulkToggleable()` 메서드를 사용하여 사용자가 모든 체크박스를 한 번에 토글할 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->bulkToggleable()
```

<AutoScreenshot name="forms/fields/checkbox-list/bulk-toggleable" alt="Bulk toggleable checkbox list" version="3.x" />

## Eloquent 관계와 통합하기 {#integrating-with-an-eloquent-relationship}

> Livewire 컴포넌트 내에서 폼을 빌드하는 경우, 반드시 [폼의 모델](../adding-a-form-to-a-livewire-component#setting-a-form-model)을 설정해야 합니다. 그렇지 않으면 Filament는 어떤 모델에서 관계를 가져와야 할지 알 수 없습니다.

`CheckboxList`의 `relationship()` 메서드를 사용하여 `BelongsToMany` 관계를 지정할 수 있습니다. Filament는 관계에서 옵션을 불러오고, 폼이 제출되면 해당 관계의 피벗 테이블에 다시 저장합니다. `titleAttribute`는 각 옵션의 라벨을 생성하는 데 사용되는 컬럼명입니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->relationship(titleAttribute: 'name')
```

`relationship()`과 함께 `disabled()`를 사용할 때는, 반드시 `disabled()`를 `relationship()`보다 먼저 호출해야 합니다. 이렇게 해야 `relationship()` 내부의 `dehydrated()` 호출이 `disabled()`의 호출에 의해 덮어써지지 않습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->disabled()
    ->relationship(titleAttribute: 'name')
```

### 관계 쿼리 커스터마이즈하기 {#customizing-the-relationship-query}

`relationship()` 메서드의 `modifyOptionsQueryUsing` 파라미터를 사용하여 옵션을 가져오는 데이터베이스 쿼리를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Database\Eloquent\Builder;

CheckboxList::make('technologies')
    ->relationship(
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->withTrashed(),
    )
```

### 관계 옵션 라벨 커스터마이즈하기 {#customizing-the-relationship-option-labels}

각 옵션의 라벨을 더 설명적으로 만들거나, 예를 들어 이름과 성을 합치고 싶다면 데이터베이스 마이그레이션에서 가상 컬럼을 사용할 수 있습니다:

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('authors')
    ->relationship(titleAttribute: 'full_name')
```

또는, `getOptionLabelFromRecordUsing()` 메서드를 사용하여 옵션의 Eloquent 모델을 라벨로 변환할 수 있습니다:

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

### 피벗 데이터 관계에 저장하기 {#saving-pivot-data-to-the-relationship}

피벗 테이블에 추가 컬럼이 있다면, `pivotData()` 메서드를 사용하여 저장할 데이터를 지정할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('primaryTechnologies')
    ->relationship(name: 'technologies', titleAttribute: 'name')
    ->pivotData([
        'is_primary' => true,
    ])
```

## 사용자 지정 검색 결과 없음 메시지 설정하기 {#setting-a-custom-no-search-results-message}

검색 가능한 체크박스 리스트를 사용할 때, 검색 결과가 없을 때 사용자 지정 메시지를 표시하고 싶을 수 있습니다. `noSearchResultsMessage()` 메서드를 사용하여 설정할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->noSearchResultsMessage('기술을 찾을 수 없습니다.')
```

## 사용자 지정 검색 프롬프트 설정하기 {#setting-a-custom-search-prompt}

검색 가능한 체크박스 리스트를 사용할 때, 사용자가 아직 검색어를 입력하지 않았을 때 검색 입력의 플레이스홀더를 조정하고 싶을 수 있습니다. `searchPrompt()` 메서드를 사용하여 설정할 수 있습니다:

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

기본적으로 Filament는 사용자가 검색 가능한 체크박스 리스트에 입력할 때 옵션을 검색하기 전에 1000밀리초(1초) 동안 대기합니다. 사용자가 계속 입력할 경우에도 검색 사이에 1000밀리초를 대기합니다. `searchDebounce()` 메서드를 사용하여 이를 변경할 수 있습니다:

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->searchDebounce(500)
```

## 체크박스 리스트 액션 오브젝트 커스터마이즈하기 {#customizing-the-checkbox-list-action-objects}

이 필드는 내부 버튼을 쉽게 커스터마이즈할 수 있도록 액션 오브젝트를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이즈할 수 있습니다. 함수는 `$action` 오브젝트에 접근할 수 있으며, 이를 사용해 [커스터마이즈](../../actions/trigger-button)할 수 있습니다. 다음 메서드들을 사용해 액션을 커스터마이즈할 수 있습니다:

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
