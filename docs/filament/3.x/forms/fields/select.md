---
title: Select
---
# [폼.필드] Select


## 개요 {#overview}

<LaracastsBanner
    title="Select Input"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈를 시청하세요. 이 시리즈는 Filament 폼에 select 필드를 추가하는 기본 방법을 알려줍니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/4"
    series="rapid-laravel-development"
/>

select 컴포넌트는 미리 정의된 옵션 목록 중에서 선택할 수 있도록 해줍니다:

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

## JavaScript 셀렉트 활성화 {#enabling-the-javascript-select}

기본적으로 Filament는 네이티브 HTML5 셀렉트를 사용합니다. `native(false)` 메서드를 사용하여 더 커스터마이즈 가능한 JavaScript 셀렉트를 활성화할 수 있습니다:

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

## 검색 옵션 {#searching-options}

`searchable()` 메서드를 사용하여 많은 옵션에 더 쉽게 접근할 수 있도록 검색 입력을 활성화할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->label('Author')
    ->options(User::all()->pluck('name', 'id'))
    ->searchable()
```

<AutoScreenshot name="forms/fields/select/searchable" alt="검색 가능한 셀렉트" version="3.x" />

### 사용자 지정 검색 결과 반환 {#returning-custom-search-results}

옵션이 많고 데이터베이스 검색이나 기타 외부 데이터 소스를 기반으로 옵션을 채우고 싶다면, `options()` 대신 `getSearchResultsUsing()` 및 `getOptionLabelUsing()` 메서드를 사용할 수 있습니다.

`getSearchResultsUsing()` 메서드는 `$key => $value` 형식의 검색 결과를 반환하는 콜백을 받습니다. 현재 사용자의 검색어는 `$search`로 제공되며, 이를 사용해 결과를 필터링해야 합니다.

`getOptionLabelUsing()` 메서드는 선택된 옵션 `$value`를 라벨로 변환하는 콜백을 받습니다. 이 메서드는 폼이 처음 로드될 때, 사용자가 아직 검색을 하지 않은 경우에 사용됩니다. 그렇지 않으면, 현재 선택된 옵션을 표시할 라벨을 사용할 수 없게 됩니다.

사용자 지정 검색 결과를 제공하려면 `getSearchResultsUsing()`과 `getOptionLabelUsing()`을 모두 select에 사용해야 합니다:

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

[커스텀 검색 결과를 반환](#returning-custom-search-results)하는 경우, `getOptionLabelUsing()` 대신 `getOptionLabelsUsing()`을 정의해야 합니다. 이때 콜백에는 `$value` 대신 `$values`가 전달되며, 라벨과 해당 값의 `$key => $value` 배열을 반환해야 합니다:

```php
Select::make('technologies')
    ->multiple()
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => Technology::where('name', 'like', "%{$search}%")->limit(50)->pluck('name', 'id')->toArray())
    ->getOptionLabelsUsing(fn (array $values): array => Technology::whereIn('id', $values)->pluck('name', 'id')->toArray()),
```

## 옵션 그룹화 {#grouping-options}

옵션을 더 잘 정리하기 위해 라벨 아래에 옵션을 그룹화할 수 있습니다. 이를 위해, `options()` 또는 일반적으로 옵션 배열을 전달하는 곳에 그룹 배열을 전달하면 됩니다. 배열의 키는 그룹 라벨로 사용되고, 값은 해당 그룹의 옵션 배열입니다:

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

> Livewire 컴포넌트 내에서 폼을 구축하는 경우, 반드시 [폼의 모델](../adding-a-form-to-a-livewire-component#setting-a-form-model)을 설정했는지 확인하세요. 그렇지 않으면 Filament는 어떤 모델에서 관계를 가져와야 하는지 알 수 없습니다.

`Select`의 `relationship()` 메서드를 사용하여 `BelongsTo` 관계를 설정하고, 옵션을 자동으로 가져올 수 있습니다. `titleAttribute`는 각 옵션의 라벨을 생성할 때 사용할 컬럼의 이름입니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
```

`multiple()` 메서드는 `relationship()`과 함께 사용하여 `BelongsToMany` 관계를 사용할 수 있습니다. Filament는 관계에서 옵션을 불러오고, 폼이 제출될 때 해당 값을 관계의 pivot 테이블에 저장합니다. `name`을 지정하지 않으면, Filament는 필드 이름을 관계 이름으로 사용합니다:

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->relationship(titleAttribute: 'name')
```

`multiple()`과 `relationship()`을 사용할 때 `disabled()`를 함께 사용하려면, 반드시 `disabled()`를 `relationship()`보다 먼저 호출해야 합니다. 이렇게 하면 `relationship()` 내부의 `dehydrated()` 호출이 `disabled()`의 호출에 의해 덮어써지지 않습니다:

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->disabled()
    ->relationship(titleAttribute: 'name')
```

### 여러 컬럼에서 관계 옵션 검색하기 {#searching-relationship-options-across-multiple-columns}

기본적으로, select가 검색 가능하도록 설정되어 있다면, Filament는 관계의 title 컬럼을 기준으로 검색 결과를 반환합니다. 여러 컬럼에서 검색하고 싶다면, `searchable()` 메서드에 컬럼 배열을 전달할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable(['name', 'email'])
```

### 관계 옵션 미리 불러오기 {#preloading-relationship-options}

페이지가 로드될 때 데이터베이스에서 검색 가능한 옵션을 미리 불러오고 싶다면, 사용자가 검색할 때가 아니라 `preload()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->preload()
```

### 현재 레코드 제외하기 {#excluding-the-current-record}

재귀 관계를 다룰 때, 결과 집합에서 현재 레코드를 제거하고 싶을 때가 많습니다.

이는 `ignoreRecord` 인자를 사용하여 쉽게 처리할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('parent_id')
    ->relationship(name: 'parent', titleAttribute: 'name', ignoreRecord: true)
```

### 관계 쿼리 커스터마이징하기 {#customizing-the-relationship-query}

옵션을 가져오는 데이터베이스 쿼리를 `relationship()` 메서드의 세 번째 매개변수를 사용하여 커스터마이징할 수 있습니다:

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

### 관계 옵션 라벨 커스터마이징하기 {#customizing-the-relationship-option-labels}

각 옵션의 라벨을 더 설명적으로 만들거나, 예를 들어 이름과 성을 합치고 싶다면, 데이터베이스 마이그레이션에서 가상 컬럼을 사용할 수 있습니다:

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'full_name')
```

또는, `getOptionLabelFromRecordUsing()` 메서드를 사용하여 옵션의 Eloquent 모델을 라벨로 변환할 수도 있습니다:

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

`multiple()` 관계를 사용하고 있고 피벗 테이블에 추가 컬럼이 있는 경우, `pivotData()` 메서드를 사용하여 해당 컬럼에 저장할 데이터를 지정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('primaryTechnologies')
    ->relationship(name: 'technologies', titleAttribute: 'name')
    ->multiple()
    ->pivotData([
        'is_primary' => true,
    ])
```

### 모달에서 새로운 옵션 생성하기 {#creating-a-new-option-in-a-modal}

사용자는 새로운 레코드를 생성하고 이를 `BelongsTo` 관계에 연결할 수 있도록 커스텀 폼을 정의할 수 있습니다:

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

<AutoScreenshot name="forms/fields/select/create-option" alt="옵션 생성 버튼이 있는 셀렉트" version="3.x" />

폼은 모달에서 열리며, 사용자는 데이터를 입력할 수 있습니다. 폼을 제출하면 새 레코드가 해당 필드에서 선택됩니다.

<AutoScreenshot name="forms/fields/select/create-option-modal" alt="옵션 생성 모달이 있는 셀렉트" version="3.x" />

#### 새 옵션 생성 커스터마이징 {#customizing-new-option-creation}

폼에서 정의된 새 옵션의 생성 과정을 `createOptionUsing()` 메서드를 사용하여 커스터마이즈할 수 있습니다. 이 메서드는 새로 생성된 레코드의 기본 키를 반환해야 합니다:

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

선택된 레코드를 편집하고 이를 `BelongsTo` 관계에 다시 저장할 수 있는 커스텀 폼을 정의할 수 있습니다:

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

<AutoScreenshot name="forms/fields/select/edit-option" alt="옵션 편집 버튼이 있는 셀렉트" version="3.x" />

폼은 모달에서 열리며, 사용자가 데이터를 입력할 수 있습니다. 폼을 제출하면 폼의 데이터가 레코드에 다시 저장됩니다.

<AutoScreenshot name="forms/fields/select/edit-option-modal" alt="옵션 편집 모달이 있는 셀렉트" version="3.x" />

### `MorphTo` 관계 처리하기 {#handling-morphto-relationships}

`MorphTo` 관계는 사용자가 다양한 모델 중에서 레코드를 선택할 수 있도록 해주기 때문에 특별합니다. 이러한 이유로, Filament에서는 전용 `MorphToSelect` 컴포넌트를 제공합니다. 이 컴포넌트는 실제로 하나의 select 필드가 아니라, 필드셋 안에 두 개의 select 필드로 구성되어 있습니다. 첫 번째 select 필드는 타입을 선택할 수 있게 해주고, 두 번째 select 필드는 해당 타입의 레코드를 선택할 수 있게 해줍니다.

`MorphToSelect`를 사용하려면, 컴포넌트에 `types()`를 전달해야 하며, 이를 통해 다양한 타입에 대한 옵션을 어떻게 렌더링할지 지정할 수 있습니다:

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

#### 각 변환된 타입의 옵션 라벨 커스터마이징하기 {#customizing-the-option-labels-for-each-morphed-type}

`titleAttribute()`는 각 상품이나 게시글에서 제목을 추출하는 데 사용됩니다. 각 옵션의 라벨을 커스터마이즈하고 싶다면, `getOptionLabelFromRecordUsing()` 메서드를 사용하여 Eloquent 모델을 라벨로 변환할 수 있습니다:

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

#### 각 변형 타입별 관계 쿼리 커스터마이징 {#customizing-the-relationship-query-for-each-morphed-type}

옵션을 조회하는 데이터베이스 쿼리는 `modifyOptionsQueryUsing()` 메서드를 사용하여 커스터마이즈할 수 있습니다:

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

> `searchable()`, `preload()`, `native()`, `allowHtml()`, `optionsLimit()` 등 select 필드에서 사용할 수 있는 많은 옵션들이 `MorphToSelect`에서도 사용 가능합니다.

## 옵션 라벨에서 HTML 허용하기 {#allowing-html-in-the-option-labels}

기본적으로 Filament는 옵션 라벨에 있는 모든 HTML을 이스케이프 처리합니다. HTML을 허용하고 싶다면 `allowHtml()` 메서드를 사용할 수 있습니다:

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

렌더링할 HTML이 안전한지 반드시 확인해야 합니다. 그렇지 않으면 애플리케이션이 XSS 공격에 취약해질 수 있습니다.

## 플레이스홀더 선택 비활성화 {#disable-placeholder-selection}

`selectablePlaceholder()` 메서드를 사용하여 플레이스홀더(null 옵션)가 선택되지 않도록 막을 수 있습니다:

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

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 인자로 받으며, 해당 클로저에서 특정 `$value` 값을 가진 옵션을 비활성화할지 여부를 확인할 수 있습니다:

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

비활성화되지 않은 옵션만 가져오고 싶다면(예: 유효성 검사 목적 등), `getEnabledOptions()` 메서드를 사용할 수 있습니다:

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

## 필드 옆에 접두사/접미사 텍스트 추가하기 {#adding-affix-text-aside-the-field}

`prefix()`와 `suffix()` 메서드를 사용하여 입력란 앞과 뒤에 텍스트를 추가할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

<AutoScreenshot name="forms/fields/select/affix" alt="접두사와 접미사가 있는 Select" version="3.x" />

### 접두사 및 접미사로 아이콘 사용하기 {#using-icons-as-affixes}

`prefixIcon()` 및 `suffixIcon()` 메서드를 사용하여 입력란 앞이나 뒤에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 배치할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->suffixIcon('heroicon-m-globe-alt')
```

<AutoScreenshot name="forms/fields/select/suffix-icon" alt="접미사 아이콘이 있는 Select" version="3.x" />

#### 접두사/접미사 아이콘 색상 설정하기 {#setting-the-affix-icons-color}

접두사/접미사 아이콘은 기본적으로 회색이지만, `prefixIconColor()`와 `suffixIconColor()` 메서드를 사용하여 다른 색상으로 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->suffixIcon('heroicon-m-check-circle')
    ->suffixIconColor('success')
```

## 사용자 지정 로딩 메시지 설정하기 {#setting-a-custom-loading-message}

검색 가능한 셀렉트나 멀티 셀렉트를 사용할 때, 옵션이 로딩되는 동안 사용자 지정 메시지를 표시하고 싶을 수 있습니다. `loadingMessage()` 메서드를 사용하여 이를 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->loadingMessage('저자 정보를 불러오는 중...')
```

## 사용자 지정 검색 결과 없음 메시지 설정하기 {#setting-a-custom-no-search-results-message}

검색 가능한 셀렉트나 멀티 셀렉트를 사용할 때, 검색 결과가 없을 경우 사용자 지정 메시지를 표시하고 싶을 수 있습니다. `noSearchResultsMessage()` 메서드를 사용하여 이를 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->noSearchResultsMessage('저자를 찾을 수 없습니다.')
```

## 사용자 지정 검색 프롬프트 설정 {#setting-a-custom-search-prompt}

검색 가능한 셀렉트 또는 멀티 셀렉트를 사용할 때, 사용자가 아직 검색어를 입력하지 않았을 때 사용자 지정 메시지를 표시하고 싶을 수 있습니다. 이를 위해 `searchPrompt()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable(['name', 'email'])
    ->searchPrompt('이름이나 이메일 주소로 저자를 검색하세요')
```

## 사용자 지정 검색 메시지 설정하기 {#setting-a-custom-searching-message}

검색 가능한 셀렉트나 멀티 셀렉트를 사용할 때, 검색 결과가 로드되는 동안 사용자 지정 메시지를 표시하고 싶을 수 있습니다. `searchingMessage()` 메서드를 사용하여 이를 설정할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->searchingMessage('저자 검색 중...')
```

## 검색 디바운스 조정하기 {#tweaking-the-search-debounce}

기본적으로 Filament는 사용자가 검색 가능한 셀렉트나 멀티 셀렉트에서 입력할 때 옵션을 검색하기 전에 1000밀리초(1초)를 대기합니다. 또한 사용자가 검색 입력란에 계속 입력할 경우, 검색 사이에도 1000밀리초를 대기합니다. 이 값은 `searchDebounce()` 메서드를 사용하여 변경할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->searchDebounce(500)
```

디바운스 값을 너무 낮게 설정하면, 서버에서 옵션을 가져오기 위한 네트워크 요청이 많아져 셀렉트가 느려지거나 응답하지 않을 수 있으니 주의하세요.

## 옵션 수 제한하기 {#limiting-the-number-of-options}

`optionsLimit()` 메서드를 사용하여 검색 가능한 셀렉트 또는 멀티 셀렉트에 표시되는 옵션의 수를 제한할 수 있습니다. 기본값은 50입니다:

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->optionsLimit(20)
```

옵션 수를 너무 높게 설정하면 브라우저 내 메모리 사용량이 많아져 셀렉트가 느려지거나 응답하지 않을 수 있으니 주의하세요.

## 셀렉트 유효성 검사 {#select-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙뿐만 아니라, 셀렉트에만 적용되는 추가 규칙도 있습니다.

### 선택된 항목 유효성 검사 {#selected-items-validation}

[multi-select](#multi-select)에서 선택할 수 있는 항목의 최소 및 최대 개수를 `minItems()`와 `maxItems()` 메서드를 설정하여 검증할 수 있습니다:

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

## 선택 액션 객체 커스터마이징 {#customizing-the-select-action-objects}

이 필드는 내부 버튼을 쉽게 커스터마이징할 수 있도록 액션 객체를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이징할 수 있습니다. 이 함수는 `$action` 객체에 접근할 수 있으며, 이를 통해 [액션을 커스터마이징](../../actions/trigger-button)하거나 [모달을 커스터마이징](../../actions/modals)할 수 있습니다. 액션을 커스터마이징할 때 사용할 수 있는 메서드는 다음과 같습니다:

- `createOptionAction()`
- `editOptionAction()`
- `manageOptionActions()` (생성 및 편집 옵션 액션을 한 번에 커스터마이징할 때 사용)

다음은 액션을 커스터마이징하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionAction(
        fn (Action $action) => $action->modalWidth('3xl'),
    )
```
