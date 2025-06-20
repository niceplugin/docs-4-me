---
title: 시작하기
---
# [패널.리소스] 시작하기

## 개요 {#overview}

<LaracastsBanner
    title="Filament 소개"
    description="Laracasts에서 Filament를 활용한 Rapid Laravel Development 시리즈를 시청하세요 - 리소스 시작 방법을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/2"
    series="rapid-laravel-development"
/>

리소스는 Eloquent 모델을 위한 CRUD 인터페이스를 구축하는 데 사용되는 정적 클래스입니다. 이들은 관리자가 앱의 데이터를 어떻게 테이블과 폼을 통해 상호작용할 수 있는지 설명합니다.

## 리소스 생성하기 {#creating-a-resource}

`App\Models\Customer` 모델에 대한 리소스를 생성하려면:

```bash
php artisan make:filament-resource Customer
```

이 명령은 `app/Filament/Resources` 디렉터리에 여러 파일을 생성합니다:

```
.
+-- CustomerResource.php
+-- CustomerResource
|   +-- Pages
|   |   +-- CreateCustomer.php
|   |   +-- EditCustomer.php
|   |   +-- ListCustomers.php
```

새 리소스 클래스는 `CustomerResource.php`에 위치합니다.

`Pages` 디렉터리의 클래스들은 리소스와 상호작용하는 앱 내 페이지를 커스터마이즈하는 데 사용됩니다. 이들은 모두 원하는 대로 커스터마이즈할 수 있는 전체 페이지 [Livewire](https://livewire.laravel.com) 컴포넌트입니다.

> 리소스를 생성했지만 내비게이션 메뉴에 나타나지 않나요? [모델 정책](#authorization)이 있다면, `viewAny()` 메서드에서 반드시 `true`를 반환해야 합니다.

### 단순(모달) 리소스 {#simple-modal-resources}

때로는 모델이 충분히 단순해서 한 페이지만으로 레코드를 관리하고, 모달을 사용해 레코드를 생성, 수정, 삭제하고 싶을 수 있습니다. 모달이 포함된 단순 리소스를 생성하려면:

```bash
php artisan make:filament-resource Customer --simple
```

이렇게 하면 "Manage" 페이지가 생성되며, 이는 모달이 추가된 List 페이지입니다.

또한, 단순 리소스에는 `getRelations()` 메서드가 없으며, [관계 매니저](relation-managers)는 Edit 및 View 페이지에만 표시되는데, 단순 리소스에는 해당 페이지가 없습니다. 그 외의 모든 것은 동일합니다.

### 폼과 테이블 자동 생성 {#automatically-generating-forms-and-tables}

시간을 절약하고 싶다면, Filament가 모델의 데이터베이스 컬럼을 기반으로 [폼](#resource-forms)과 [테이블](#resource-tables)을 자동으로 생성할 수 있습니다. `--generate`를 사용하세요:

```bash
php artisan make:filament-resource Customer --generate
```

### 소프트 삭제 처리 {#handling-soft-deletes}

기본적으로 앱에서 삭제된 레코드와 상호작용할 수 없습니다. 리소스에서 복원, 강제 삭제, 휴지통 레코드 필터링 기능을 추가하려면, 리소스 생성 시 `--soft-deletes` 플래그를 사용하세요:

```bash
php artisan make:filament-resource Customer --soft-deletes
```

소프트 삭제에 대한 자세한 내용은 [여기](deleting-records#handling-soft-deletes)에서 확인할 수 있습니다.

### View 페이지 생성 {#generating-a-view-page}

기본적으로 리소스에는 List, Create, Edit 페이지만 생성됩니다. [View 페이지](viewing-records)도 원한다면, `--view` 플래그를 사용하세요:

```bash
php artisan make:filament-resource Customer --view
```

### 커스텀 모델 네임스페이스 지정 {#specifiying-a-custom-model-namespace}

기본적으로 Filament는 모델이 `App\Models` 디렉터리에 있다고 가정합니다. `--model-namespace` 플래그를 사용해 모델의 다른 네임스페이스를 지정할 수 있습니다:

```bash
php artisan make:filament-resource Customer --model-namespace=Custom\\Path\\Models
```

이 예시에서 모델은 `Custom\Path\Models\Customer`에 있어야 합니다. 명령어에서 반드시 `\\`(이중 백슬래시)를 사용해야 합니다.

이제 [리소스 생성](#automatically-generating-forms-and-tables) 시 Filament가 모델을 찾고 데이터베이스 스키마를 읽을 수 있습니다.

### 모델, 마이그레이션, 팩토리 동시 생성 {#generating-the-model-migration-and-factory-at-the-same-name}

리소스 스캐폴딩 시 시간을 절약하고 싶다면, Filament가 `--model`, `--migration`, `--factory` 플래그를 조합해 새 리소스에 대한 모델, 마이그레이션, 팩토리를 동시에 생성할 수 있습니다:

```bash
php artisan make:filament-resource Customer --model --migration --factory
```

## 레코드 타이틀 {#record-titles}

리소스에 `$recordTitleAttribute`를 설정할 수 있습니다. 이는 모델에서 해당 레코드를 식별하는 데 사용할 수 있는 컬럼의 이름입니다.

예를 들어, 블로그 포스트의 `title`이나 고객의 `name`이 될 수 있습니다:

```php
protected static ?string $recordTitleAttribute = 'name';
```

이 설정은 [글로벌 검색](global-search)과 같은 기능에 필요합니다.

> 한 컬럼만으로 레코드를 식별하기에 부족하다면, [Eloquent 접근자](https://laravel.com/docs/eloquent-mutators#defining-an-accessor)의 이름을 지정할 수 있습니다.

## 리소스 폼 {#resource-forms}

<LaracastsBanner
    title="기본 폼 입력"
    description="Laracasts에서 Filament를 활용한 Rapid Laravel Development 시리즈를 시청하세요 - 리소스에 폼을 추가하는 기본을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/3"
    series="rapid-laravel-development"
/>

리소스 클래스에는 [Create](creating-records) 및 [Edit](editing-records) 페이지의 폼을 구축하는 데 사용되는 `form()` 메서드가 포함되어 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('email')->email()->required(),
            // ...
        ]);
}
```

`schema()` 메서드는 폼의 구조를 정의하는 데 사용됩니다. 이는 [필드](../../forms/fields/getting-started#available-fields)와 [레이아웃 컴포넌트](../../forms/layout/getting-started#available-layout-components)의 배열이며, 폼에 나타날 순서대로 나열합니다.

Filament로 폼을 만드는 방법에 대한 [가이드](../../forms/getting-started)는 Forms 문서를 참고하세요.

### 현재 작업에 따라 컴포넌트 숨기기 {#hiding-components-based-on-the-current-operation}

폼 컴포넌트의 `hiddenOn()` 메서드를 사용하면 현재 페이지나 액션에 따라 필드를 동적으로 숨길 수 있습니다.

이 예시에서는 `edit` 페이지에서 `password` 필드를 숨깁니다:

```php
use Livewire\Component;

Forms\Components\TextInput::make('password')
    ->password()
    ->required()
    ->hiddenOn('edit'),
```

또는, 한 페이지만 필드를 표시하려면 `visibleOn()` 단축 메서드를 사용할 수 있습니다:

```php
use Livewire\Component;

Forms\Components\TextInput::make('password')
    ->password()
    ->required()
    ->visibleOn('create'),
```

## 리소스 테이블 {#resource-tables}

<LaracastsBanner
    title="테이블 컬럼"
    description="Laracasts에서 Filament를 활용한 Rapid Laravel Development 시리즈를 시청하세요 - 리소스에 테이블을 추가하는 기본을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/9"
    series="rapid-laravel-development"
/>

리소스 클래스에는 [List 페이지](listing-records)의 테이블을 구축하는 데 사용되는 `table()` 메서드가 포함되어 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name'),
            Tables\Columns\TextColumn::make('email'),
            // ...
        ])
        ->filters([
            Tables\Filters\Filter::make('verified')
                ->query(fn (Builder $query): Builder => $query->whereNotNull('email_verified_at')),
            // ...
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
}
```

테이블 컬럼, 필터, 액션 등을 추가하는 방법은 [테이블](../../tables/getting-started) 문서를 참고하세요.

## 권한 부여 {#authorization}

권한 부여를 위해 Filament는 앱에 등록된 모든 [모델 정책](https://laravel.com/docs/authorization#creating-policies)을 따릅니다. 다음 메서드들이 사용됩니다:

- `viewAny()`는 리소스를 내비게이션 메뉴에서 완전히 숨기고, 사용자가 어떤 페이지에도 접근하지 못하게 합니다.
- `create()`는 [새 레코드 생성](creating-records)을 제어합니다.
- `update()`는 [레코드 수정](editing-records)을 제어합니다.
- `view()`는 [레코드 보기](viewing-records)를 제어합니다.
- `delete()`는 단일 레코드 삭제를 방지합니다. `deleteAny()`는 레코드의 일괄 삭제를 방지합니다. Filament는 여러 레코드를 반복하며 `delete()` 정책을 확인하는 것은 성능상 비효율적이기 때문에 `deleteAny()` 메서드를 사용합니다.
- `forceDelete()`는 단일 소프트 삭제된 레코드의 강제 삭제를 방지합니다. `forceDeleteAny()`는 레코드의 일괄 강제 삭제를 방지합니다. Filament는 여러 레코드를 반복하며 `forceDelete()` 정책을 확인하는 것은 성능상 비효율적이기 때문에 `forceDeleteAny()` 메서드를 사용합니다.
- `restore()`는 단일 소프트 삭제된 레코드의 복원을 방지합니다. `restoreAny()`는 레코드의 일괄 복원을 방지합니다. Filament는 여러 레코드를 반복하며 `restore()` 정책을 확인하는 것은 성능상 비효율적이기 때문에 `restoreAny()` 메서드를 사용합니다.
- `reorder()`는 [레코드 순서 변경](listing-records#reordering-records)을 제어합니다.

### 권한 부여 건너뛰기 {#skipping-authorization}

리소스에 대해 권한 부여를 건너뛰고 싶다면, `$shouldSkipAuthorization` 속성을 `true`로 설정할 수 있습니다:

```php
protected static bool $shouldSkipAuthorization = true;
```

## 모델 라벨 커스터마이즈 {#customizing-the-model-label}

각 리소스에는 모델 이름에서 자동으로 생성된 "모델 라벨"이 있습니다. 예를 들어, `App\Models\Customer` 모델은 `customer` 라벨을 가집니다.

이 라벨은 UI의 여러 부분에서 사용되며, `$modelLabel` 속성을 사용해 커스터마이즈할 수 있습니다:

```php
protected static ?string $modelLabel = 'cliente';
```

또는, `getModelLabel()`을 사용해 동적 라벨을 정의할 수 있습니다:

```php
public static function getModelLabel(): string
{
    return __('filament/resources/customer.label');
}
```

### 복수형 모델 라벨 커스터마이즈 {#customizing-the-plural-model-label}

리소스에는 "복수형 모델 라벨"도 있으며, 이는 모델 라벨에서 자동으로 생성됩니다. 예를 들어, `customer` 라벨은 `customers`로 복수화됩니다.

복수형 라벨은 `$pluralModelLabel` 속성을 사용해 커스터마이즈할 수 있습니다:

```php
protected static ?string $pluralModelLabel = 'clientes';
```

또는, `getPluralModelLabel()` 메서드에서 동적 복수형 라벨을 설정할 수 있습니다:

```php
public static function getPluralModelLabel(): string
{
    return __('filament/resources/customer.plural_label');
}
```

### 모델 라벨 자동 대문자화 {#automatic-model-label-capitalization}

기본적으로 Filament는 UI의 일부에서 모델 라벨의 각 단어를 자동으로 대문자로 변환합니다. 예를 들어, 페이지 타이틀, 내비게이션 메뉴, 브레드크럼 등에서 사용됩니다.

이 동작을 리소스에서 비활성화하려면, `$hasTitleCaseModelLabel`을 설정하세요:

```php
protected static bool $hasTitleCaseModelLabel = false;
```

## 리소스 내비게이션 아이템 {#resource-navigation-items}

Filament는 [복수형 라벨](#plural-label)을 사용해 리소스에 대한 내비게이션 메뉴 아이템을 자동으로 생성합니다.

내비게이션 아이템 라벨을 커스터마이즈하려면, `$navigationLabel` 속성을 사용할 수 있습니다:

```php
protected static ?string $navigationLabel = 'Mis Clientes';
```

또는, `getNavigationLabel()` 메서드에서 동적 내비게이션 라벨을 설정할 수 있습니다:

```php
public static function getNavigationLabel(): string
{
    return __('filament/resources/customer.navigation_label');
}
```

### 리소스 내비게이션 아이콘 설정 {#setting-a-resource-navigation-icon}

`$navigationIcon` 속성은 어떤 Blade 컴포넌트의 이름도 지원합니다. 기본적으로 [Heroicons](https://heroicons.com)가 설치되어 있습니다. 원한다면 커스텀 아이콘 컴포넌트를 만들거나 다른 라이브러리를 설치할 수 있습니다.

```php
protected static ?string $navigationIcon = 'heroicon-o-user-group';
```

또는, `getNavigationIcon()` 메서드에서 동적 내비게이션 아이콘을 설정할 수 있습니다:

```php
use Illuminate\Contracts\Support\Htmlable;

public static function getNavigationIcon(): string | Htmlable | null
{
    return 'heroicon-o-user-group';
}
```

### 리소스 내비게이션 아이템 정렬 {#sorting-resource-navigation-items}

`$navigationSort` 속성을 사용하면 내비게이션 아이템의 나열 순서를 지정할 수 있습니다:

```php
protected static ?int $navigationSort = 2;
```

또는, `getNavigationSort()` 메서드에서 동적 내비게이션 아이템 순서를 설정할 수 있습니다:

```php
public static function getNavigationSort(): ?int
{
    return 2;
}
```

### 리소스 내비게이션 아이템 그룹화 {#grouping-resource-navigation-items}

`$navigationGroup` 속성을 지정하여 내비게이션 아이템을 그룹화할 수 있습니다:

```php
protected static ?string $navigationGroup = 'Shop';
```

또는, `getNavigationGroup()` 메서드를 사용해 동적 그룹 라벨을 설정할 수 있습니다:

```php
public static function getNavigationGroup(): ?string
{
    return __('filament/navigation.groups.shop');
}
```

#### 다른 아이템 아래에 리소스 내비게이션 아이템 그룹화 {#grouping-resource-navigation-items-under-other-items}

부모 아이템의 라벨을 `$navigationParentItem`으로 지정하여 내비게이션 아이템을 다른 아이템의 하위로 그룹화할 수 있습니다:

```php
protected static ?string $navigationParentItem = 'Products';

protected static ?string $navigationGroup = 'Shop';
```

위에서 볼 수 있듯, 부모 아이템에 내비게이션 그룹이 있다면 해당 그룹도 정의해야 올바른 부모 아이템이 식별됩니다.

`getNavigationParentItem()` 메서드를 사용해 동적 부모 아이템 라벨을 설정할 수도 있습니다:

```php
public static function getNavigationParentItem(): ?string
{
    return __('filament/navigation.groups.shop.items.products');
}
```

> 이처럼 3단계 내비게이션이 필요하다면, [클러스터](../clusters) 사용을 고려하세요. 클러스터는 리소스와 [커스텀 페이지](../pages)를 논리적으로 그룹화하며, 별도의 내비게이션을 공유할 수 있습니다.

## 리소스 페이지로의 URL 생성 {#generating-urls-to-resource-pages}

Filament는 리소스 클래스에 `getUrl()` 정적 메서드를 제공하여 리소스 및 그 안의 특정 페이지로의 URL을 생성할 수 있습니다. 전통적으로는 URL을 직접 작성하거나 Laravel의 `route()` 헬퍼를 사용해야 했지만, 이 방법들은 리소스의 슬러그나 라우트 네이밍 규칙을 알아야 합니다.

`getUrl()` 메서드는 인자 없이 호출하면 리소스의 [List 페이지](listing-records)로의 URL을 생성합니다:

```php
use App\Filament\Resources\CustomerResource;

CustomerResource::getUrl(); // /admin/customers
```

리소스 내 특정 페이지로의 URL도 생성할 수 있습니다. 각 페이지의 이름은 리소스의 `getPages()` 배열의 키입니다. 예를 들어, [Create 페이지](creating-records)로의 URL을 생성하려면:

```php
use App\Filament\Resources\CustomerResource;

CustomerResource::getUrl('create'); // /admin/customers/create
```

`getPages()` 메서드의 일부 페이지는 `record`와 같은 URL 파라미터를 사용합니다. 이런 페이지로의 URL을 생성하고 레코드를 전달하려면 두 번째 인자를 사용하세요:

```php
use App\Filament\Resources\CustomerResource;

CustomerResource::getUrl('edit', ['record' => $customer]); // /admin/customers/edit/1
```

이 예시에서 `$customer`는 Eloquent 모델 객체이거나 ID일 수 있습니다.

### 리소스 모달로의 URL 생성 {#generating-urls-to-resource-modals}

[단순 리소스](#simple-modal-resources)처럼 한 페이지만 있는 경우 특히 유용합니다.

리소스의 테이블에서 액션에 대한 URL을 생성하려면, `tableAction`과 `tableActionRecord`를 URL 파라미터로 전달하세요:

```php
use App\Filament\Resources\CustomerResource;
use Filament\Tables\Actions\EditAction;

CustomerResource::getUrl(parameters: [
    'tableAction' => EditAction::getDefaultName(),
    'tableActionRecord' => $customer,
]); // /admin/customers?tableAction=edit&tableActionRecord=1
```

또는, 페이지의 헤더에 있는 `CreateAction`과 같은 액션에 대한 URL을 생성하려면 `action` 파라미터를 전달하세요:

```php
use App\Filament\Resources\CustomerResource;
use Filament\Actions\CreateAction;

CustomerResource::getUrl(parameters: [
    'action' => CreateAction::getDefaultName(),
]); // /admin/customers?action=create
```

### 다른 패널의 리소스 URL 생성 {#generating-urls-to-resources-in-other-panels}

앱에 여러 패널이 있다면, `getUrl()`은 현재 패널 내에서 URL을 생성합니다. 리소스가 속한 패널을 지정하려면 `panel` 인자에 패널 ID를 전달하세요:

```php
use App\Filament\Resources\CustomerResource;

CustomerResource::getUrl(panel: 'marketing');
```

## 리소스 Eloquent 쿼리 커스터마이즈 {#customizing-the-resource-eloquent-query}

Filament 내에서 리소스 모델에 대한 모든 쿼리는 `getEloquentQuery()` 메서드로 시작합니다.

이로 인해, 전체 리소스에 영향을 주는 쿼리 제약이나 [모델 스코프](https://laravel.com/docs/eloquent#query-scopes)를 쉽게 적용할 수 있습니다:

```php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()->where('is_active', true);
}
```

### 글로벌 스코프 비활성화 {#disabling-global-scopes}

기본적으로 Filament는 모델에 등록된 모든 글로벌 스코프를 따릅니다. 하지만, 예를 들어 소프트 삭제된 레코드에 접근하고 싶을 때는 적합하지 않을 수 있습니다.

이럴 때는 Filament가 사용하는 `getEloquentQuery()` 메서드를 오버라이드할 수 있습니다:

```php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()->withoutGlobalScopes();
}
```

또는, 특정 글로벌 스코프만 제거할 수 있습니다:

```php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()->withoutGlobalScopes([ActiveScope::class]);
}
```

글로벌 스코프 제거에 대한 자세한 내용은 [Laravel 문서](https://laravel.com/docs/eloquent#removing-global-scopes)를 참고하세요.

## 리소스 URL 커스터마이즈 {#customizing-the-resource-url}

기본적으로 Filament는 리소스 이름을 기반으로 URL을 생성합니다. `$slug` 속성을 설정하여 이를 커스터마이즈할 수 있습니다:

```php
protected static ?string $slug = 'pending-orders';
```

## 리소스 서브 내비게이션 {#resource-sub-navigation}

서브 내비게이션을 사용하면 사용자가 리소스 내의 다양한 페이지를 오갈 수 있습니다. 일반적으로 서브 내비게이션의 모든 페이지는 리소스의 동일한 레코드와 관련이 있습니다. 예를 들어, Customer 리소스에서는 다음과 같은 서브 내비게이션 페이지가 있을 수 있습니다:

- 고객 보기: 고객의 상세 정보를 읽기 전용으로 제공하는 [`ViewRecord` 페이지](viewing-records)
- 고객 수정: 고객의 상세 정보를 수정할 수 있는 [`EditRecord` 페이지](editing-records)
- 고객 연락처 수정: 고객의 연락처 정보를 수정할 수 있는 [`EditRecord` 페이지](editing-records). [Edit 페이지를 여러 개 만드는 방법](editing-records#creating-another-edit-page)을 참고하세요.
- 주소 관리: 고객의 주소를 관리할 수 있는 [`ManageRelatedRecords` 페이지](relation-managers#relation-pages)
- 결제 관리: 고객의 결제를 관리할 수 있는 [`ManageRelatedRecords` 페이지](relation-managers#relation-pages)

리소스의 각 "단일 레코드" 페이지에 서브 내비게이션을 추가하려면, 리소스 클래스에 `getRecordSubNavigation()` 메서드를 추가하세요:

```php
use App\Filament\Resources\CustomerResource\Pages;
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        Pages\ViewCustomer::class,
        Pages\EditCustomer::class,
        Pages\EditCustomerContact::class,
        Pages\ManageCustomerAddresses::class,
        Pages\ManageCustomerPayments::class,
    ]);
}
```

서브 내비게이션의 각 아이템은 [일반 페이지와 동일한 내비게이션 메서드](../navigation)를 사용해 커스터마이즈할 수 있습니다.

> 리소스와 [커스텀 페이지](../pages) 전체를 *전환*하는 서브 내비게이션을 추가하려면, [클러스터](../clusters)를 참고하세요. 클러스터는 이들을 함께 그룹화하는 데 사용됩니다. `getRecordSubNavigation()` 메서드는 리소스 *내부*의 특정 레코드와 관련된 페이지 간 내비게이션을 구성하는 데 사용됩니다.

### 서브 내비게이션 위치 {#sub-navigation-position}

서브 내비게이션은 기본적으로 페이지의 시작 부분에 렌더링됩니다. 리소스의 `$subNavigationPosition` 속성을 설정하여 위치를 변경할 수 있습니다. 값은 `SubNavigationPosition::Start`, `SubNavigationPosition::End`, `SubNavigationPosition::Top`(탭 형태로 렌더링) 중 하나입니다:

```php
use Filament\Pages\SubNavigationPosition;

protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;
```

## 리소스 페이지 삭제 {#deleting-resource-pages}

리소스에서 페이지를 삭제하고 싶다면, 리소스의 `Pages` 디렉터리에서 해당 페이지 파일과 `getPages()` 메서드의 항목을 삭제하면 됩니다.

예를 들어, 아무도 레코드를 생성할 수 없는 리소스가 있다면, `Create` 페이지 파일을 삭제하고, `getPages()`에서도 제거하세요:

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListCustomers::route('/'),
        'edit' => Pages\EditCustomer::route('/{record}/edit'),
    ];
}
```

페이지를 삭제해도 해당 페이지로 연결되는 액션이 삭제되지는 않습니다. 이런 액션은 사용자를 존재하지 않는 페이지로 보내는 대신 모달을 엽니다. 예를 들어, List 페이지의 `CreateAction`, 테이블이나 View 페이지의 `EditAction`, 테이블이나 Edit 페이지의 `ViewAction` 등이 있습니다. 해당 버튼을 제거하려면 액션도 함께 삭제해야 합니다.
