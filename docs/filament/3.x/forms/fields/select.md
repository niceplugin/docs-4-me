---
title: Select
---
# [폼.필드] Select


## 개요 {#overview}

<LaracastsBanner
    title="Select Input"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈에서 Filament 폼에 select 필드를 추가하는 기본 방법을 배워보세요."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/4"
    series="rapid-laravel-development"
/>

select 컴포넌트는 미리 정의된 옵션 목록에서 선택할 수 있도록 해줍니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

<AutoScreenshot name="forms/fields/select/simple" alt="Select" version="3.x" />

## JavaScript select 활성화하기 {#enabling-the-javascript-select}

기본적으로 Filament는 네이티브 HTML5 select를 사용합니다. `native(false)` 메서드를 사용하여 더 커스터마이즈 가능한 JavaScript select를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->native(false)
```

<AutoScreenshot name="forms/fields/select/javascript" alt="JavaScript select" version="3.x" />

## 옵션 검색 활성화하기 {#searching-options}

`searchable()` 메서드를 사용하여 많은 옵션에 더 쉽게 접근할 수 있도록 검색 입력을 활성화할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->label('Author')
    ->options(User::all()->pluck('name', 'id'))
    ->searchable()
```

<AutoScreenshot name="forms/fields/select/searchable" alt="Searchable select" version="3.x" />

### 커스텀 검색 결과 반환하기 {#returning-custom-search-results}

옵션이 많고 데이터베이스 검색이나 외부 데이터 소스를 기반으로 옵션을 채우고 싶다면, `options()` 대신 `getSearchResultsUsing()` 및 `getOptionLabelUsing()` 메서드를 사용할 수 있습니다.

`getSearchResultsUsing()` 메서드는 `$key => $value` 형식의 검색 결과를 반환하는 콜백을 받습니다. 현재 사용자의 검색어는 `$search`로 제공되며, 이를 사용해 결과를 필터링해야 합니다.

`getOptionLabelUsing()` 메서드는 선택된 옵션 `$value`를 라벨로 변환하는 콜백을 받습니다. 이 메서드는 폼이 처음 로드될 때, 사용자가 아직 검색을 하지 않은 경우에 사용됩니다. 그렇지 않으면 현재 선택된 옵션을 표시할 라벨이 제공되지 않습니다.

커스텀 검색 결과를 제공하려면 `getSearchResultsUsing()`과 `getOptionLabelUsing()`을 모두 select에 사용해야 합니다:

```php
Select::make('author_id')
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => User::where('name', 'like', "%{$search}%")->limit(50)->pluck('name', 'id')->toArray())
    ->getOptionLabelUsing(fn ($value): ?string => User::find($value)?->name),
```

## 다중 선택 {#multi-select}

`Select` 컴포넌트의 `multiple()` 메서드를 사용하면 옵션 목록에서 여러 값을 선택할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

<AutoScreenshot name="forms/fields/select/multiple" alt="Multi-select" version="3.x" />

이 옵션들은 JSON 형식으로 반환됩니다. Eloquent를 사용해 저장할 경우, 모델 속성에 `array` [캐스팅](/laravel/12.x/eloquent-mutators#array-and-json-casting)을 추가해야 합니다:

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

[커스텀 검색 결과를 반환](#returning-custom-search-results)하는 경우, `getOptionLabelUsing()` 대신 `getOptionLabelsUsing()`을 정의해야 합니다. 콜백에는 `$value` 대신 `$values`가 전달되며, 라벨과 해당 값의 `$key => $value` 배열을 반환해야 합니다:

```php
Select::make('technologies')
    ->multiple()
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => Technology::where('name', 'like', "%{$search}%")->limit(50)->pluck('name', 'id')->toArray())
    ->getOptionLabelsUsing(fn (array $values): array => Technology::whereIn('id', $values)->pluck('name', 'id')->toArray()),
```

## 옵션 그룹화하기 {#grouping-options}

옵션을 라벨 아래에 그룹화하여 더 잘 정리할 수 있습니다. 이를 위해 `options()` 또는 일반적으로 옵션 배열을 전달하는 곳에 그룹 배열을 전달할 수 있습니다. 배열의 키는 그룹 라벨로 사용되고, 값은 해당 그룹의 옵션 배열입니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->searchable()
    ->options([
        'In Process' => [
            'draft' => 'Draft',
            'reviewing' => 'Reviewing',
        ],
        'Reviewed' => [
            'published' => 'Published',
            'rejected' => 'Rejected',
        ],
    ])
```

<AutoScreenshot name="forms/fields/select/grouped" alt="Grouped select" version="3.x" />

## Eloquent 관계와 통합하기 {#integrating-with-an-eloquent-relationship}

> Livewire 컴포넌트 내에서 폼을 빌드하는 경우, 반드시 [폼의 모델](../adding-a-form-to-a-livewire-component#setting-a-form-model)을 설정해야 합니다. 그렇지 않으면 Filament는 관계를 가져올 모델을 알 수 없습니다.

`Select`의 `relationship()` 메서드를 사용하여 `BelongsTo` 관계를 자동으로 옵션으로 가져오도록 설정할 수 있습니다. `titleAttribute`는 각 옵션의 라벨을 생성하는 데 사용되는 컬럼명입니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
```

`multiple()` 메서드는 `relationship()`과 함께 사용하여 `BelongsToMany` 관계를 사용할 수 있습니다. Filament는 관계에서 옵션을 불러오고, 폼 제출 시 관계의 pivot 테이블에 다시 저장합니다. `name`이 제공되지 않으면, Filament는 필드명을 관계명으로 사용합니다:

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->relationship(titleAttribute: 'name')
```

`multiple()`과 `relationship()`을 사용할 때 `disabled()`를 함께 사용한다면, 반드시 `disabled()`를 `relationship()`보다 먼저 호출해야 합니다. 이렇게 하면 `relationship()` 내부의 `dehydrated()` 호출이 `disabled()`의 호출에 의해 덮어써지지 않습니다:

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->disabled()
    ->relationship(titleAttribute: 'name')
```

### 여러 컬럼에서 관계 옵션 검색하기 {#searching-relationship-options-across-multiple-columns}

기본적으로 select가 검색 가능할 때, Filament는 관계의 title 컬럼을 기준으로 검색 결과를 반환합니다. 여러 컬럼에서 검색하고 싶다면, `searchable()` 메서드에 컬럼 배열을 전달할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable(['name', 'email'])
```

### 관계 옵션 미리 불러오기 {#preloading-relationship-options}

페이지가 로드될 때 데이터베이스에서 검색 가능한 옵션을 미리 불러오고 싶다면, `preload()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->preload()
```

### 현재 레코드 제외하기 {#excluding-the-current-record}

재귀 관계를 다룰 때는 현재 레코드를 결과 집합에서 제거하고 싶을 수 있습니다.

이것은 `ignoreRecord` 인자를 사용하여 쉽게 할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('parent_id')
    ->relationship(name: 'parent', titleAttribute: 'name', ignoreRecord: true)
```

### 관계 쿼리 커스터마이즈하기 {#customizing-the-relationship-query}

옵션을 가져오는 데이터베이스 쿼리를 `relationship()` 메서드의 세 번째 파라미터로 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;

Select::make('author_id')
    ->relationship(
        name: 'author',
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->withTrashed(),
    )
```

`modifyQueryUsing` 함수에서 현재 검색 쿼리에 접근하고 싶다면, `$search`를 주입할 수 있습니다.

### 관계 옵션 라벨 커스터마이즈하기 {#customizing-the-relationship-option-labels}

각 옵션의 라벨을 더 설명적으로 만들거나, 이름과 성을 합치고 싶다면, 데이터베이스 마이그레이션에서 가상 컬럼을 사용할 수 있습니다:

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'full_name')
```

또는, `getOptionLabelFromRecordUsing()` 메서드를 사용하여 옵션의 Eloquent 모델을 라벨로 변환할 수 있습니다:

```php
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

Select::make('author_id')
    ->relationship(
        name: 'author',
        modifyQueryUsing: fn (Builder $query) => $query->orderBy('first_name')->orderBy('last_name'),
    )
    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->first_name} {$record->last_name}")
    ->searchable(['first_name', 'last_name'])
```

### 관계에 피벗 데이터 저장하기 {#saving-pivot-data-to-the-relationship}

`multiple()` 관계를 사용하고 피벗 테이블에 추가 컬럼이 있다면, `pivotData()` 메서드를 사용하여 저장할 데이터를 지정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('primaryTechnologies')
    ->relationship(name: 'technologies', titleAttribute: 'name')
    ->multiple()
    ->pivotData([
        'is_primary' => true,
    ])
```

### 모달에서 새 옵션 생성하기 {#creating-a-new-option-in-a-modal}

커스텀 폼을 정의하여 새 레코드를 생성하고 `BelongsTo` 관계에 연결할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionForm([
        Forms\Components\TextInput::make('name')
            ->required(),
        Forms\Components\TextInput::make('email')
            ->required()
            ->email(),
    ]),
```

<AutoScreenshot name="forms/fields/select/create-option" alt="Select with create option button" version="3.x" />

폼은 모달에서 열리며, 사용자가 데이터를 입력할 수 있습니다. 폼 제출 시 새 레코드가 필드에 선택됩니다.

<AutoScreenshot name="forms/fields/select/create-option-modal" alt="Select with create option modal" version="3.x" />

#### 새 옵션 생성 커스터마이즈하기 {#customizing-new-option-creation}

폼에서 정의한 새 옵션의 생성 과정을 `createOptionUsing()` 메서드를 사용해 커스터마이즈할 수 있습니다. 이 메서드는 새로 생성된 레코드의 기본 키를 반환해야 합니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionForm([
       // ...
    ])
    ->createOptionUsing(function (array $data): int {
        return auth()->user()->team->members()->create($data)->getKey();
    }),
```

### 모달에서 선택된 옵션 편집하기 {#editing-the-selected-option-in-a-modal}

커스텀 폼을 정의하여 선택된 레코드를 편집하고 `BelongsTo` 관계에 다시 저장할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->editOptionForm([
        Forms\Components\TextInput::make('name')
            ->required(),
        Forms\Components\TextInput::make('email')
            ->required()
            ->email(),
    ]),
```

<AutoScreenshot name="forms/fields/select/edit-option" alt="Select with edit option button" version="3.x" />

폼은 모달에서 열리며, 사용자가 데이터를 입력할 수 있습니다. 폼 제출 시 폼의 데이터가 레코드에 다시 저장됩니다.

<AutoScreenshot name="forms/fields/select/edit-option-modal" alt="Select with edit option modal" version="3.x" />

### `MorphTo` 관계 다루기 {#handling-morphto-relationships}

`MorphTo` 관계는 특별합니다. 다양한 모델에서 레코드를 선택할 수 있기 때문입니다. 그래서 실제로 select 필드가 아니라 필드셋 안에 2개의 select 필드가 있는 전용 `MorphToSelect` 컴포넌트가 있습니다. 첫 번째 select 필드는 타입을 선택하고, 두 번째는 해당 타입의 레코드를 선택합니다.

`MorphToSelect`를 사용하려면, 각 타입에 대한 옵션 렌더링 방법을 알려주는 `types()`를 컴포넌트에 전달해야 합니다:

```php
use Filament\Forms\Components\MorphToSelect;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name'),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
```

#### 각 morph 타입의 옵션 라벨 커스터마이즈하기 {#customizing-the-option-labels-for-each-morphed-type}

`titleAttribute()`는 각 product나 post에서 타이틀을 추출하는 데 사용됩니다. 각 옵션의 라벨을 커스터마이즈하고 싶다면, `getOptionLabelFromRecordUsing()` 메서드를 사용해 Eloquent 모델을 라벨로 변환할 수 있습니다:

```php
use Filament\Forms\Components\MorphToSelect;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->getOptionLabelFromRecordUsing(fn (Product $record): string => "{$record->name} - {$record->slug}"),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
```

#### 각 morph 타입의 관계 쿼리 커스터마이즈하기 {#customizing-the-relationship-query-for-each-morphed-type}

옵션을 가져오는 데이터베이스 쿼리를 `modifyOptionsQueryUsing()` 메서드로 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\MorphToSelect;
use Illuminate\Database\Eloquent\Builder;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name')
            ->modifyOptionsQueryUsing(fn (Builder $query) => $query->whereBelongsTo($this->team)),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title')
            ->modifyOptionsQueryUsing(fn (Builder $query) => $query->whereBelongsTo($this->team)),
    ])
```

> select 필드의 많은 옵션들이 `MorphToSelect`에서도 사용 가능합니다. 예: `searchable()`, `preload()`, `native()`, `allowHtml()`, `optionsLimit()` 등.

## 옵션 라벨에 HTML 허용하기 {#allowing-html-in-the-option-labels}

기본적으로 Filament는 옵션 라벨의 모든 HTML을 이스케이프합니다. HTML을 허용하고 싶다면, `allowHtml()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchable()
    ->allowHtml()
```

HTML이 안전하게 렌더링될 수 있도록 반드시 확인해야 합니다. 그렇지 않으면 애플리케이션이 XSS 공격에 취약해질 수 있습니다.

## 플레이스홀더 선택 비활성화하기 {#disable-placeholder-selection}

`selectablePlaceholder()` 메서드를 사용하여 플레이스홀더(null 옵션)가 선택되는 것을 방지할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->selectablePlaceholder(false)
```

## 특정 옵션 비활성화하기 {#disabling-specific-options}

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 받으며, 특정 `$value`의 옵션을 비활성화할지 확인할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

비활성화되지 않은 옵션을 가져오고 싶다면(예: 유효성 검사 목적), `getEnabledOptions()`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
    ->in(fn (Select $component): array => array_keys($component->getEnabledOptions()))
```

## 필드 옆에 접두/접미 텍스트 추가하기 {#adding-affix-text-aside-the-field}

`prefix()`와 `suffix()` 메서드를 사용하여 입력 앞뒤에 텍스트를 배치할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

<AutoScreenshot name="forms/fields/select/affix" alt="Select with affixes" version="3.x" />

### 아이콘을 접두/접미로 사용하기 {#using-icons-as-affixes}

`prefixIcon()`과 `suffixIcon()` 메서드를 사용하여 입력 앞뒤에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 배치할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->suffixIcon('heroicon-m-globe-alt')
```

<AutoScreenshot name="forms/fields/select/suffix-icon" alt="Select with suffix icon" version="3.x" />

#### 접두/접미 아이콘 색상 설정하기 {#setting-the-affix-icons-color}

접두/접미 아이콘은 기본적으로 회색이지만, `prefixIconColor()`와 `suffixIconColor()` 메서드를 사용해 다른 색상으로 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->suffixIcon('heroicon-m-check-circle')
    ->suffixIconColor('success')
```

## 커스텀 로딩 메시지 설정하기 {#setting-a-custom-loading-message}

검색 가능한 select 또는 multi-select를 사용할 때, 옵션이 로딩되는 동안 커스텀 메시지를 표시하고 싶을 수 있습니다. `loadingMessage()` 메서드를 사용해 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->loadingMessage('Loading authors...')
```

## 커스텀 검색 결과 없음 메시지 설정하기 {#setting-a-custom-no-search-results-message}

검색 가능한 select 또는 multi-select를 사용할 때, 검색 결과가 없을 때 커스텀 메시지를 표시하고 싶을 수 있습니다. `noSearchResultsMessage()` 메서드를 사용해 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->noSearchResultsMessage('No authors found.')
```

## 커스텀 검색 프롬프트 설정하기 {#setting-a-custom-search-prompt}

검색 가능한 select 또는 multi-select를 사용할 때, 사용자가 아직 검색어를 입력하지 않았을 때 커스텀 메시지를 표시하고 싶을 수 있습니다. `searchPrompt()` 메서드를 사용해 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable(['name', 'email'])
    ->searchPrompt('Search authors by their name or email address')
```

## 커스텀 검색 중 메시지 설정하기 {#setting-a-custom-searching-message}

검색 가능한 select 또는 multi-select를 사용할 때, 검색 결과가 로딩되는 동안 커스텀 메시지를 표시하고 싶을 수 있습니다. `searchingMessage()` 메서드를 사용해 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->searchingMessage('Searching authors...')
```

## 검색 디바운스 조정하기 {#tweaking-the-search-debounce}

기본적으로 Filament는 사용자가 검색 가능한 select 또는 multi-select에 입력할 때 옵션을 검색하기 전 1000밀리초(1초) 동안 대기합니다. 사용자가 계속 입력할 경우, 검색 사이에도 1000밀리초를 대기합니다. `searchDebounce()` 메서드를 사용해 이 값을 변경할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->searchDebounce(500)
```

디바운스 값을 너무 낮게 설정하면, 서버에서 옵션을 가져오기 위한 네트워크 요청이 많아져 select가 느려지고 반응이 없을 수 있으니 주의하세요.

## 옵션 개수 제한하기 {#limiting-the-number-of-options}

검색 가능한 select 또는 multi-select에서 표시되는 옵션의 개수를 `optionsLimit()` 메서드로 제한할 수 있습니다. 기본값은 50입니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->optionsLimit(20)
```

옵션 개수 제한을 너무 높게 설정하면, 브라우저 메모리 사용량이 많아져 select가 느려지고 반응이 없을 수 있으니 주의하세요.

## Select 유효성 검사 {#select-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙 외에도, select에만 해당하는 추가 규칙이 있습니다.

### 선택된 항목 유효성 검사 {#selected-items-validation}

[multi-select](#multi-select)에서 선택할 수 있는 항목의 최소 및 최대 개수를 `minItems()`와 `maxItems()` 메서드로 유효성 검사할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
    ->minItems(1)
    ->maxItems(3)
```

## select 액션 오브젝트 커스터마이즈하기 {#customizing-the-select-action-objects}

이 필드는 내부 버튼을 쉽게 커스터마이즈할 수 있도록 액션 오브젝트를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이즈할 수 있습니다. 함수는 `$action` 오브젝트에 접근할 수 있으며, 이를 사용해 [커스터마이즈](../../actions/trigger-button)하거나 [모달을 커스터마이즈](../../actions/modals)할 수 있습니다. 다음 메서드로 액션을 커스터마이즈할 수 있습니다:

- `createOptionAction()`
- `editOptionAction()`
- `manageOptionActions()` (생성 및 편집 옵션 액션을 한 번에 커스터마이즈)

다음은 액션을 커스터마이즈하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionAction(
        fn (Action $action) => $action->modalWidth('3xl'),
    )
```
