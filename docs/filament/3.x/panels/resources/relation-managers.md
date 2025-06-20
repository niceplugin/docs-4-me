---
title: 관계 관리
---
# [패널.리소스] 관계 관리

## 작업에 적합한 도구 선택하기 {#choosing-the-right-tool-for-the-job}

Filament는 앱에서 관계를 관리할 수 있는 다양한 방법을 제공합니다. 어떤 기능을 사용해야 하는지는 관리하려는 관계의 유형과 원하는 UI에 따라 다릅니다.

### 관계 매니저 - 리소스 폼 아래에 있는 인터랙티브 테이블 {#relation-managers---interactive-tables-underneath-your-resource-forms}

> 이 기능은 `HasMany`, `HasManyThrough`, `BelongsToMany`, `MorphMany`, `MorphToMany` 관계와 호환됩니다.

[관계 매니저](#creating-a-relation-manager)는 관리자가 리소스의 편집 또는 보기 페이지를 벗어나지 않고도 관련 레코드를 나열, 생성, 첨부, 연관, 수정, 분리, 비연관 및 삭제할 수 있는 인터랙티브 테이블입니다.

### 셀렉트 & 체크박스 리스트 - 기존 레코드에서 선택하거나 새로 생성하기 {#select-checkbox-list---choose-from-existing-records-or-create-a-new-one}

> 이 기능은 `BelongsTo`, `MorphTo`, `BelongsToMany` 관계와 호환됩니다.

[셀렉트](../../forms/fields/select#integrating-with-an-eloquent-relationship)를 사용하면 사용자가 기존 레코드 목록에서 선택할 수 있습니다. 또한 [모달 내에서 새 레코드를 생성할 수 있는 버튼을 추가](../../forms/fields/select#creating-new-records)할 수도 있습니다. 이때 페이지를 벗어나지 않아도 됩니다.

`BelongsToMany` 관계에서 셀렉트를 사용할 때는 하나가 아닌 여러 옵션을 선택할 수 있습니다. 폼을 제출하면 레코드가 자동으로 피벗 테이블에 추가됩니다. 원한다면 멀티 셀렉트 드롭다운을 간단한 [체크박스 리스트](../../forms/fields/checkbox-list#integrating-with-an-eloquent-relationship)로 교체할 수 있습니다. 두 컴포넌트 모두 동일하게 동작합니다.

### 리피터 - 소유자 폼 내에서 여러 관련 레코드 CRUD {#repeaters---crud-multiple-related-records-inside-the-owners-form}

> 이 기능은 `HasMany`, `MorphMany` 관계와 호환됩니다.

[리피터](../../forms/fields/repeater#integrating-with-an-eloquent-relationship)는 무한히 반복 가능한 필드 집합을 렌더링할 수 있는 표준 폼 컴포넌트입니다. 관계에 연결할 수 있어, 관련 테이블에서 레코드를 자동으로 읽고, 생성하고, 수정하고, 삭제할 수 있습니다. 이들은 메인 폼 스키마 내에 존재하며, 리소스 페이지나 액션 모달 내에 중첩하여 사용할 수 있습니다.

UX 관점에서, 이 솔루션은 관련 모델에 필드가 몇 개만 있을 때만 적합합니다. 그렇지 않으면 폼이 매우 길어질 수 있습니다.

### 레이아웃 폼 컴포넌트 - 폼 필드를 단일 관계에 저장하기 {#layout-form-components---saving-form-fields-to-a-single-relationship}

> 이 기능은 `BelongsTo`, `HasOne`, `MorphOne` 관계와 호환됩니다.

모든 레이아웃 폼 컴포넌트([Grid](../../forms/layout/grid#grid-component), [Section](../../forms/layout/section), [Fieldset](../../forms/layout/fieldset) 등)는 [`relationship()` 메서드](../../forms/advanced#saving-data-to-relationships)를 가지고 있습니다. 이를 사용하면 해당 레이아웃 내의 모든 필드가 소유자 모델이 아닌 관련 모델에 저장됩니다:

```php
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

Fieldset::make('Metadata')
    ->relationship('metadata')
    ->schema([
        TextInput::make('title'),
        Textarea::make('description'),
        FileUpload::make('image'),
    ])
```

이 예시에서 `title`, `description`, `image`는 `metadata` 관계에서 자동으로 로드되고, 폼이 제출될 때 다시 저장됩니다. 만약 `metadata` 레코드가 존재하지 않으면 자동으로 생성됩니다.

이 기능에 대한 자세한 설명은 [폼 문서](../../forms/advanced#saving-data-to-relationships)에 있습니다. 사용 방법에 대한 더 많은 정보는 해당 페이지를 참고하세요.

## 관계 매니저 생성하기 {#creating-a-relation-manager}

<LaracastsBanner
    title="관계 매니저"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈를 시청하세요 - Filament 리소스에 관계 매니저를 추가하는 기본을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/13"
    series="rapid-laravel-development"
/>

관계 매니저를 생성하려면 `make:filament-relation-manager` 명령어를 사용할 수 있습니다:

```bash
php artisan make:filament-relation-manager CategoryResource posts title
```

- `CategoryResource`는 소유자(부모) 모델의 리소스 클래스 이름입니다.
- `posts`는 관리하려는 관계의 이름입니다.
- `title`은 게시글을 식별하는 데 사용할 속성의 이름입니다.

이 명령어는 `CategoryResource/RelationManagers/PostsRelationManager.php` 파일을 생성합니다. 이 파일에는 관계 매니저를 위한 [폼](getting-started#resource-forms)과 [테이블](getting-started#resource-tables)을 정의할 수 있는 클래스가 들어 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Table;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('title')->required(),
            // ...
        ]);
}

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('title'),
            // ...
        ]);
}
```

새로운 관계 매니저를 리소스의 `getRelations()` 메서드에 등록해야 합니다:

```php
public static function getRelations(): array
{
    return [
        RelationManagers\PostsRelationManager::class,
    ];
}
```

관계 매니저에 대한 테이블과 폼을 정의한 후, 리소스의 [편집](editing-records) 또는 [보기](viewing-records) 페이지에서 이를 확인할 수 있습니다.

### 읽기 전용 모드 {#read-only-mode}

관계 매니저는 일반적으로 리소스의 편집 또는 보기 페이지에 표시됩니다. 보기 페이지에서는 Filament가 생성, 수정, 삭제와 같이 관계를 변경하는 모든 액션을 자동으로 숨깁니다. 이를 "읽기 전용 모드"라고 하며, 보기 페이지의 읽기 전용 동작을 보존하기 위해 기본적으로 활성화되어 있습니다. 그러나 이 동작을 비활성화하려면 관계 매니저 클래스에서 `isReadOnly()` 메서드를 오버라이드하여 항상 `false`를 반환하도록 할 수 있습니다:

```php
public function isReadOnly(): bool
{
    return false;
}
```

또는, 이 기능이 마음에 들지 않는다면 패널 [설정](../configuration)에서 모든 관계 매니저에 대해 한 번에 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->readOnlyRelationManagersOnResourceViewPagesByDefault(false);
}
```

### 비표준 역관계 이름 {#unconventional-inverse-relationship-names}

라라벨의 명명 규칙을 따르지 않는 역관계의 경우, 테이블에서 `inverseRelationship()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('title'),
            // ...
        ])
        ->inverseRelationship('section'); // 역관계 모델이 `Category`이므로, 일반적으로는 `category`이지만 여기서는 `section`입니다.
}
```

### 소프트 삭제 처리하기 {#handling-soft-deletes}

기본적으로, 관계 매니저에서 삭제된 레코드와 상호작용할 수 없습니다. 관계 매니저에서 복원, 강제 삭제, 휴지통 레코드 필터링 기능을 추가하려면 관계 매니저를 생성할 때 `--soft-deletes` 플래그를 사용하세요:

```bash
php artisan make:filament-relation-manager CategoryResource posts title --soft-deletes
```

소프트 삭제에 대한 자세한 내용은 [여기](#deleting-records)에서 확인할 수 있습니다.

## 관련 레코드 나열하기 {#listing-related-records}

관련 레코드는 테이블에 나열됩니다. 전체 관계 매니저는 이 테이블을 중심으로 동작하며, [생성](#creating-related-records), [수정](#editing-related-records), [첨부/분리](#attaching-and-detaching-records), [연관/비연관](#associating-and-dissociating-records), 삭제 액션을 포함합니다.

[테이블 빌더](../../tables/getting-started)의 모든 기능을 사용하여 관계 매니저를 커스터마이즈할 수 있습니다.

### 피벗 속성과 함께 나열하기 {#listing-with-pivot-attributes}

`BelongsToMany`, `MorphToMany` 관계의 경우, 피벗 테이블 속성도 추가할 수 있습니다. 예를 들어, `UserResource`에 대한 `TeamsRelationManager`가 있고, 테이블에 `role` 피벗 속성을 추가하고 싶다면 다음과 같이 할 수 있습니다:

```php
use Filament\Tables;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name'),
            Tables\Columns\TextColumn::make('role'),
        ]);
}
```

모든 피벗 속성이 관계 *및* 역관계의 `withPivot()` 메서드에 나열되어 있는지 확인하세요.

## 관련 레코드 생성하기 {#creating-related-records}

### 피벗 속성과 함께 생성하기 {#creating-with-pivot-attributes}

`BelongsToMany`, `MorphToMany` 관계의 경우, 피벗 테이블 속성도 추가할 수 있습니다. 예를 들어, `UserResource`에 대한 `TeamsRelationManager`가 있고, 생성 폼에 `role` 피벗 속성을 추가하고 싶다면 다음과 같이 할 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('role')->required(),
            // ...
        ]);
}
```

모든 피벗 속성이 관계 *및* 역관계의 `withPivot()` 메서드에 나열되어 있는지 확인하세요.

### `CreateAction` 커스터마이즈하기 {#customizing-the-createaction}

폼 데이터 변형, 알림 변경, 라이프사이클 훅 추가 등 `CreateAction`을 커스터마이즈하는 방법은 [액션 문서](../../actions/prebuilt-actions/create)를 참고하세요.

## 관련 레코드 수정하기 {#editing-related-records}

### 피벗 속성과 함께 수정하기 {#editing-with-pivot-attributes}

`BelongsToMany`, `MorphToMany` 관계의 경우, 피벗 테이블 속성도 수정할 수 있습니다. 예를 들어, `UserResource`에 대한 `TeamsRelationManager`가 있고, 수정 폼에 `role` 피벗 속성을 추가하고 싶다면 다음과 같이 할 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('role')->required(),
            // ...
        ]);
}
```

모든 피벗 속성이 관계 *및* 역관계의 `withPivot()` 메서드에 나열되어 있는지 확인하세요.

### `EditAction` 커스터마이즈하기 {#customizing-the-editaction}

폼 데이터 변형, 알림 변경, 라이프사이클 훅 추가 등 `EditAction`을 커스터마이즈하는 방법은 [액션 문서](../../actions/prebuilt-actions/edit)를 참고하세요.

## 레코드 첨부 및 분리하기 {#attaching-and-detaching-records}

Filament는 `BelongsToMany`, `MorphToMany` 관계에 대해 레코드 첨부 및 분리를 지원합니다.

관계 매니저를 생성할 때 `--attach` 플래그를 전달하면 테이블에 `AttachAction`, `DetachAction`, `DetachBulkAction`도 추가됩니다:

```bash
php artisan make:filament-relation-manager CategoryResource posts title --attach
```

또는 이미 리소스를 생성했다면, `$table` 배열에 액션을 직접 추가할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->headerActions([
            // ...
            Tables\Actions\AttachAction::make(),
        ])
        ->actions([
            // ...
            Tables\Actions\DetachAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                // ...
                Tables\Actions\DetachBulkAction::make(),
            ]),
        ]);
}
```

### 첨부 모달 셀렉트 옵션 미리 불러오기 {#preloading-the-attachment-modal-select-options}

기본적으로 첨부할 레코드를 검색할 때 옵션이 AJAX를 통해 데이터베이스에서 로드됩니다. 폼이 처음 로드될 때 옵션을 미리 불러오고 싶다면 `AttachAction`의 `preloadRecordSelect()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\AttachAction;

AttachAction::make()
    ->preloadRecordSelect()
```

### 피벗 속성과 함께 첨부하기 {#attaching-with-pivot-attributes}

`Attach` 버튼으로 레코드를 첨부할 때, 관계에 피벗 속성을 추가할 수 있도록 커스텀 폼을 정의할 수 있습니다:

```php
use Filament\Forms;
use Filament\Tables\Actions\AttachAction;

AttachAction::make()
    ->form(fn (AttachAction $action): array => [
        $action->getRecordSelect(),
        Forms\Components\TextInput::make('role')->required(),
    ])
```

이 예시에서 `$action->getRecordSelect()`는 첨부할 레코드를 선택하는 셀렉트 필드를 반환합니다. `role` 텍스트 입력은 피벗 테이블의 `role` 컬럼에 저장됩니다.

모든 피벗 속성이 관계 *및* 역관계의 `withPivot()` 메서드에 나열되어 있는지 확인하세요.

### 첨부 옵션 범위 지정하기 {#scoping-the-options-to-attach}

`AttachAction`에서 사용할 수 있는 옵션의 범위를 지정할 수 있습니다:

```php
use Filament\Tables\Actions\AttachAction;
use Illuminate\Database\Eloquent\Builder;

AttachAction::make()
    ->recordSelectOptionsQuery(fn (Builder $query) => $query->whereBelongsTo(auth()->user()))
```

### 여러 컬럼에서 첨부 옵션 검색하기 {#searching-the-options-to-attach-across-multiple-columns}

기본적으로 `AttachAction`에서 사용할 수 있는 옵션은 테이블의 `recordTitleAttribute()`에서 검색됩니다. 여러 컬럼에서 검색하고 싶다면 `recordSelectSearchColumns()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\AttachAction;

AttachAction::make()
    ->recordSelectSearchColumns(['title', 'description'])
```

### 여러 레코드 첨부하기 {#attaching-multiple-records}

`AttachAction` 컴포넌트의 `multiple()` 메서드를 사용하면 여러 값을 선택할 수 있습니다:

```php
use Filament\Tables\Actions\AttachAction;

AttachAction::make()
    ->multiple()
```

### 첨부 모달의 셀렉트 필드 커스터마이즈하기 {#customizing-the-select-field-in-the-attached-modal}

첨부 시 사용되는 셀렉트 필드 객체를 `recordSelect()` 메서드에 함수를 전달하여 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\Select;
use Filament\Tables\Actions\AttachAction;

AttachAction::make()
    ->recordSelect(
        fn (Select $select) => $select->placeholder('게시글을 선택하세요'),
    )
```

### 중복 처리하기 {#handling-duplicates}

기본적으로 동일한 레코드를 한 번 이상 첨부할 수 없습니다. 이 기능이 동작하려면 피벗 테이블에 기본 `id` 컬럼을 설정해야 합니다.

`id` 속성이 관계 *및* 역관계의 `withPivot()` 메서드에 나열되어 있는지 확인하세요.

마지막으로, 테이블에 `allowDuplicates()` 메서드를 추가하세요:

```php
public function table(Table $table): Table
{
    return $table
        ->allowDuplicates();
}
```

## 레코드 연관 및 비연관하기 {#associating-and-dissociating-records}

Filament는 `HasMany`, `MorphMany` 관계에 대해 레코드 연관 및 비연관을 지원합니다.

관계 매니저를 생성할 때 `--associate` 플래그를 전달하면 테이블에 `AssociateAction`, `DissociateAction`, `DissociateBulkAction`도 추가됩니다:

```bash
php artisan make:filament-relation-manager CategoryResource posts title --associate
```

또는 이미 리소스를 생성했다면, `$table` 배열에 액션을 직접 추가할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->headerActions([
            // ...
            Tables\Actions\AssociateAction::make(),
        ])
        ->actions([
            // ...
            Tables\Actions\DissociateAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                // ...
                Tables\Actions\DissociateBulkAction::make(),
            ]),
        ]);
}
```

### 연관 모달 셀렉트 옵션 미리 불러오기 {#preloading-the-associate-modal-select-options}

기본적으로 연관할 레코드를 검색할 때 옵션이 AJAX를 통해 데이터베이스에서 로드됩니다. 폼이 처음 로드될 때 옵션을 미리 불러오고 싶다면 `AssociateAction`의 `preloadRecordSelect()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\AssociateAction;

AssociateAction::make()
    ->preloadRecordSelect()
```

### 연관 옵션 범위 지정하기 {#scoping-the-options-to-associate}

`AssociateAction`에서 사용할 수 있는 옵션의 범위를 지정할 수 있습니다:

```php
use Filament\Tables\Actions\AssociateAction;
use Illuminate\Database\Eloquent\Builder;

AssociateAction::make()
    ->recordSelectOptionsQuery(fn (Builder $query) => $query->whereBelongsTo(auth()->user()))
```

### 여러 컬럼에서 연관 옵션 검색하기 {#searching-the-options-to-associate-across-multiple-columns}

기본적으로 `AssociateAction`에서 사용할 수 있는 옵션은 테이블의 `recordTitleAttribute()`에서 검색됩니다. 여러 컬럼에서 검색하고 싶다면 `recordSelectSearchColumns()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\AssociateAction;

AssociateAction::make()
    ->recordSelectSearchColumns(['title', 'description'])
```

### 여러 레코드 연관하기 {#associating-multiple-records}

`AssociateAction` 컴포넌트의 `multiple()` 메서드를 사용하면 여러 값을 선택할 수 있습니다:

```php
use Filament\Tables\Actions\AssociateAction;

AssociateAction::make()
    ->multiple()
```

### 연관 모달의 셀렉트 필드 커스터마이즈하기 {#customizing-the-select-field-in-the-associate-modal}

연관 시 사용되는 셀렉트 필드 객체를 `recordSelect()` 메서드에 함수를 전달하여 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\Select;
use Filament\Tables\Actions\AssociateAction;

AssociateAction::make()
    ->recordSelect(
        fn (Select $select) => $select->placeholder('게시글을 선택하세요'),
    )
```

## 관련 레코드 보기 {#viewing-related-records}

관계 매니저를 생성할 때 `--view` 플래그를 전달하면 테이블에 `ViewAction`도 추가됩니다:

```bash
php artisan make:filament-relation-manager CategoryResource posts title --view
```

또는 이미 관계 매니저를 생성했다면, `$table->actions()` 배열에 `ViewAction`을 추가할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->actions([
            Tables\Actions\ViewAction::make(),
            // ...
        ]);
}
```

## 관련 레코드 삭제하기 {#deleting-related-records}

기본적으로, 관계 매니저에서 삭제된 레코드와 상호작용할 수 없습니다. 관계 매니저에서 복원, 강제 삭제, 휴지통 레코드 필터링 기능을 추가하려면 관계 매니저를 생성할 때 `--soft-deletes` 플래그를 사용하세요:

```bash
php artisan make:filament-relation-manager CategoryResource posts title --soft-deletes
```

또는 기존 관계 매니저에 소프트 삭제 기능을 추가할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

public function table(Table $table): Table
{
    return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->withoutGlobalScopes([
            SoftDeletingScope::class,
        ]))
        ->columns([
            // ...
        ])
        ->filters([
            Tables\Filters\TrashedFilter::make(),
            // ...
        ])
        ->actions([
            Tables\Actions\DeleteAction::make(),
            Tables\Actions\ForceDeleteAction::make(),
            Tables\Actions\RestoreAction::make(),
            // ...
        ])
        ->bulkActions([
            BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
                Tables\Actions\ForceDeleteBulkAction::make(),
                Tables\Actions\RestoreBulkAction::make(),
                // ...
            ]),
        ]);
}
```

### `DeleteAction` 커스터마이즈하기 {#customizing-the-deleteaction}

알림 변경, 라이프사이클 훅 추가 등 `DeleteAction`을 커스터마이즈하는 방법은 [액션 문서](../../actions/prebuilt-actions/delete)를 참고하세요.

## 관련 레코드 가져오기(Import) {#importing-related-records}

[`ImportAction`](../../actions/prebuilt-actions/import)은 관계 매니저의 헤더에 추가하여 레코드를 가져올 수 있습니다. 이 경우, 가져온 새 레코드가 어떤 소유자에 속하는지 임포터에 알려주고 싶을 것입니다. [import 옵션](../../actions/prebuilt-actions/import#using-import-options)을 사용하여 소유자 레코드의 ID를 전달할 수 있습니다:

```php
ImportAction::make()
    ->importer(ProductImporter::class)
    ->options(['categoryId' => $this->getOwnerRecord()->getKey()])
```

이제 임포터 클래스에서, 가져온 레코드를 일대다 관계로 소유자에 연관시킬 수 있습니다:

```php
public function resolveRecord(): ?Product
{
    $product = Product::firstOrNew([
        'sku' => $this->data['sku'],
    ]);
    
    $product->category()->associate($this->options['categoryId']);
    
    return $product;
}
```

또는, 임포터의 `afterSave()` 훅을 사용하여 다대다 관계로 레코드를 첨부할 수도 있습니다:

```php
protected function afterSave(): void
{
    $this->record->categories()->syncWithoutDetaching([$this->options['categoryId']]);
}
```

## 관계의 소유자 레코드 접근하기 {#accessing-the-relationships-owner-record}

관계 매니저는 Livewire 컴포넌트입니다. 처음 로드될 때 소유자 레코드(부모 역할을 하는 Eloquent 레코드, 즉 메인 리소스 모델)가 속성에 저장됩니다. 이 속성은 다음과 같이 읽을 수 있습니다:

```php
$this->getOwnerRecord()
```

하지만 `form()`이나 `table()`과 같은 `static` 메서드 내부에서는 `$this`를 사용할 수 없습니다. 이럴 때는 [$livewire 인스턴스에 접근하는 콜백](../../forms/advanced#form-component-utility-injection)을 사용할 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\Select::make('store_id')
                ->options(function (RelationManager $livewire): array {
                    return $livewire->getOwnerRecord()->stores()
                        ->pluck('name', 'id')
                        ->toArray();
                }),
            // ...
        ]);
}
```

Filament의 모든 메서드는 콜백을 받아 `$livewire->ownerRecord`에 접근할 수 있습니다.

## 관계 매니저 그룹화하기 {#grouping-relation-managers}

여러 관계 매니저를 하나의 탭으로 그룹화할 수 있습니다. 이를 위해 여러 매니저를 `RelationGroup` 객체로 감싸고 라벨을 지정하세요:

```php
use Filament\Resources\RelationManagers\RelationGroup;

public static function getRelations(): array
{
    return [
        // ...
        RelationGroup::make('연락처', [
            RelationManagers\IndividualsRelationManager::class,
            RelationManagers\OrganizationsRelationManager::class,
        ]),
        // ...
    ];
}
```

## 조건부로 관계 매니저 표시하기 {#conditionally-showing-relation-managers}

기본적으로, 관련 모델 정책의 `viewAny()` 메서드가 `true`를 반환하면 관계 매니저가 표시됩니다.

특정 소유자 레코드와 페이지에 대해 관계 매니저를 표시할지 결정하려면 `canViewForRecord()` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

public static function canViewForRecord(Model $ownerRecord, string $pageClass): bool
{
    return $ownerRecord->status === Status::Draft;
}
```

## 관계 매니저 탭과 폼 결합하기 {#combining-the-relation-manager-tabs-with-the-form}

편집 또는 보기 페이지 클래스에서 `hasCombinedRelationManagerTabsWithContent()` 메서드를 오버라이드하세요:

```php
public function hasCombinedRelationManagerTabsWithContent(): bool
{
    return true;
}
```

### 폼 탭에 아이콘 설정하기 {#setting-an-icon-for-the-form-tab}

편집 또는 보기 페이지 클래스에서 `getContentTabIcon()` 메서드를 오버라이드하세요:

```php
public function getContentTabIcon(): ?string
{
    return 'heroicon-m-cog';
}
```

### 폼 탭 위치 설정하기 {#setting-the-position-of-the-form-tab}

기본적으로 폼 탭은 관계 탭보다 먼저 렌더링됩니다. 이후에 렌더링하려면 편집 또는 보기 페이지 클래스에서 `getContentTabPosition()` 메서드를 오버라이드하세요:

```php
use Filament\Resources\Pages\ContentTabPosition;

public function getContentTabPosition(): ?ContentTabPosition
{
    return ContentTabPosition::After;
}
```

## 관계 매니저 탭에 배지 추가하기 {#adding-badges-to-relation-manager-tabs}

`$badge` 속성을 설정하여 관계 매니저 탭에 배지를 추가할 수 있습니다:

```php
protected static ?string $badge = 'new';
```

또는 `getBadge()` 메서드를 오버라이드할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

public static function getBadge(Model $ownerRecord, string $pageClass): ?string
{
    return static::$badge;
}
```

[관계 그룹](#grouping-relation-managers)을 사용하는 경우, `badge()` 메서드를 사용할 수 있습니다:

```php
use Filament\Resources\RelationManagers\RelationGroup;

RelationGroup::make('연락처', [
    // ...
])->badge('new');
```

### 관계 매니저 탭 배지 색상 변경하기 {#changing-the-color-of-relation-manager-tab-badges}

배지 값이 정의되어 있으면 기본적으로 primary 색상으로 표시됩니다. 배지를 상황에 맞게 스타일링하려면 `$badgeColor`를 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나로 설정하세요:

```php
protected static ?string $badgeColor = 'danger';
```

또는 `getBadgeColor()` 메서드를 오버라이드할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

public static function getBadgeColor(Model $ownerRecord, string $pageClass): ?string
{
    return 'danger';
}
```

[관계 그룹](#grouping-relation-managers)을 사용하는 경우, `badgeColor()` 메서드를 사용할 수 있습니다:

```php
use Filament\Resources\RelationManagers\RelationGroup;

RelationGroup::make('연락처', [
    // ...
])->badgeColor('danger');
```

### 관계 매니저 탭 배지에 툴팁 추가하기 {#adding-a-tooltip-to-relation-manager-tab-badges}

배지 값이 정의되어 있으면 `$badgeTooltip` 속성을 설정하여 툴팁을 추가할 수 있습니다:

```php
protected static ?string $badgeTooltip = '새 게시글이 있습니다';
```

또는 `getBadgeTooltip()` 메서드를 오버라이드할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

public static function getBadgeTooltip(Model $ownerRecord, string $pageClass): ?string
{
    return '새 게시글이 있습니다';
}
```

[관계 그룹](#grouping-relation-managers)을 사용하는 경우, `badgeTooltip()` 메서드를 사용할 수 있습니다:

```php
use Filament\Resources\RelationManagers\RelationGroup;

RelationGroup::make('연락처', [
    // ...
])->badgeTooltip('새 게시글이 있습니다');
```

## 리소스의 폼과 테이블을 관계 매니저와 공유하기 {#sharing-a-resources-form-and-table-with-a-relation-manager}

리소스의 폼과 테이블을 관계 매니저와 동일하게 만들고, 이전에 작성한 코드를 재사용하고 싶을 수 있습니다. 이 경우, 관계 매니저에서 리소스의 `form()`과 `table()` 메서드를 호출하면 됩니다:

```php
use App\Filament\Resources\Blog\PostResource;
use Filament\Forms\Form;
use Filament\Tables\Table;

public function form(Form $form): Form
{
    return PostResource::form($form);
}

public function table(Table $table): Table
{
    return PostResource::table($table);
}
```

### 관계 매니저에서 공유 폼 컴포넌트 숨기기 {#hiding-a-shared-form-component-on-the-relation-manager}

리소스의 폼 컴포넌트를 관계 매니저와 공유하는 경우, 관계 매니저에서 해당 컴포넌트를 숨기고 싶을 수 있습니다. 특히 관계 매니저에서 소유자 레코드에 대한 `Select` 필드를 숨기고 싶을 때 유용합니다. Filament가 이를 자동으로 처리하므로, `hiddenOn()` 메서드에 관계 매니저의 이름을 전달하여 사용할 수 있습니다:

```php
use App\Filament\Resources\Blog\PostResource\RelationManagers\CommentsRelationManager;
use Filament\Forms\Components\Select;

Select::make('post_id')
    ->relationship('post', 'title')
    ->hiddenOn(CommentsRelationManager::class)
```

### 관계 매니저에서 공유 테이블 컬럼 숨기기 {#hiding-a-shared-table-column-on-the-relation-manager}

리소스의 테이블 컬럼을 관계 매니저와 공유하는 경우, 관계 매니저에서 해당 컬럼을 숨기고 싶을 수 있습니다. 특히 관계 매니저에서 소유자 레코드에 대한 컬럼을 숨기고 싶을 때 유용합니다. `hiddenOn()` 메서드에 관계 매니저의 이름을 전달하여 사용할 수 있습니다:

```php
use App\Filament\Resources\Blog\PostResource\RelationManagers\CommentsRelationManager;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('post.title')
    ->hiddenOn(CommentsRelationManager::class)
```

### 관계 매니저에서 공유 테이블 필터 숨기기 {#hiding-a-shared-table-filter-on-the-relation-manager}

리소스의 테이블 필터를 관계 매니저와 공유하는 경우, 관계 매니저에서 해당 필터를 숨기고 싶을 수 있습니다. 특히 관계 매니저에서 소유자 레코드에 대한 필터를 숨기고 싶을 때 유용합니다. `hiddenOn()` 메서드에 관계 매니저의 이름을 전달하여 사용할 수 있습니다:

```php
use App\Filament\Resources\Blog\PostResource\RelationManagers\CommentsRelationManager;
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('post')
    ->relationship('post', 'title')
    ->hiddenOn(CommentsRelationManager::class)
```

### 관계 매니저에서 공유 설정 오버라이드하기 {#overriding-shared-configuration-on-the-relation-manager}

리소스 내부에서 한 설정은 관계 매니저에서 덮어쓸 수 있습니다. 예를 들어, 관계 매니저에서 상속받은 테이블의 페이지네이션만 비활성화하고 리소스 자체는 그대로 두고 싶다면:

```php
use App\Filament\Resources\Blog\PostResource;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return PostResource::table($table)
        ->paginated(false);
}
```

또한, 관계 매니저에서 [생성](#creating-related-records), [첨부](#attaching-and-detaching-records), [연관](#associating-and-dissociating-records) 액션을 헤더에 추가하고 싶을 때도 추가 설정이 유용합니다:

```php
use App\Filament\Resources\Blog\PostResource;
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return PostResource::table($table)
        ->headerActions([
            Tables\Actions\CreateAction::make(),
            Tables\Actions\AttachAction::make(),
        ]);
}
```

## 관계 매니저 Eloquent 쿼리 커스터마이즈하기 {#customizing-the-relation-manager-eloquent-query}

전체 관계 매니저에 영향을 주는 쿼리 제약이나 [모델 스코프](https://laravel.com/docs/eloquent#query-scopes)를 적용할 수 있습니다. 이를 위해 테이블의 `modifyQueryUsing()` 메서드에 함수를 전달하여 쿼리를 커스터마이즈하세요:

```php
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', true))
        ->columns([
            // ...
        ]);
}
```

## 관계 매니저 제목 커스터마이즈하기 {#customizing-the-relation-manager-title}

관계 매니저의 제목을 설정하려면 관계 매니저 클래스의 `$title` 속성을 사용할 수 있습니다:

```php
protected static ?string $title = '게시글';
```

관계 매니저의 제목을 동적으로 설정하려면 관계 매니저 클래스에서 `getTitle()` 메서드를 오버라이드할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

public static function getTitle(Model $ownerRecord, string $pageClass): string
{
    return __('relation-managers.posts.title');
}
```

제목은 [테이블 헤더](../../tables/advanced#customizing-the-table-header)와, 관계 매니저 탭이 여러 개일 경우 탭에도 반영됩니다. 테이블 헤더만 따로 커스터마이즈하고 싶다면 `$table->heading()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables;

public function table(Table $table): Table
{
    return $table
        ->heading('게시글')
        ->columns([
            // ...
        ]);
}
```

## 관계 매니저 레코드 제목 커스터마이즈하기 {#customizing-the-relation-manager-record-title}

관계 매니저는 관련 모델의 어떤 속성을 식별자로 사용할지 결정하기 위해 "레코드 제목 속성" 개념을 사용합니다. 관계 매니저를 생성할 때 이 속성은 `make:filament-relation-manager` 명령어의 세 번째 인자로 전달됩니다:

```bash
php artisan make:filament-relation-manager CategoryResource posts title
```

이 예시에서는 `Post` 모델의 `title` 속성이 관계 매니저에서 게시글을 식별하는 데 사용됩니다.

이 속성은 주로 액션 클래스에서 사용됩니다. 예를 들어, 레코드를 [첨부](#attaching-and-detaching-records)하거나 [연관](#associating-and-dissociating-records)할 때, 셀렉트 필드에 제목이 나열됩니다. 레코드를 [수정](#editing-related-records), [보기](#viewing-related-records), [삭제](#deleting-related-records)할 때도 모달 헤더에 제목이 사용됩니다.

경우에 따라 여러 속성을 결합하여 제목을 만들고 싶을 수 있습니다. 이럴 때는 `recordTitleAttribute()` 설정 메서드를 `recordTitle()`로 교체하고, 모델을 제목으로 변환하는 함수를 전달하세요:

```php
use App\Models\Post;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->recordTitle(fn (Post $record): string => "{$record->title} ({$record->id})")
        ->columns([
            // ...
        ]);
}
```

`recordTitle()`을 사용하고 있고, [연관 액션](#associating-and-dissociating-records)이나 [첨부 액션](#attaching-and-detaching-records)이 있다면, 해당 액션에 검색 컬럼도 지정해야 합니다:

```php
use Filament\Tables\Actions\AssociateAction;
use Filament\Tables\Actions\AttachAction;

AssociateAction::make()
    ->recordSelectSearchColumns(['title', 'id']);

AttachAction::make()
    ->recordSelectSearchColumns(['title', 'id'])
```

## 관계 페이지 {#relation-pages}

`ManageRelatedRecords` 페이지를 사용하면, 관계 매니저 대신 관계 관리를 소유자 레코드의 편집 또는 보기와 분리하여 별도의 기능으로 유지할 수 있습니다.

이 기능은 [리소스 서브 내비게이션](getting-started#resource-sub-navigation)을 사용할 때 이상적입니다. 보기 또는 편집 페이지와 관계 페이지를 쉽게 전환할 수 있기 때문입니다.

관계 페이지를 생성하려면 `make:filament-page` 명령어를 사용하세요:

```bash
php artisan make:filament-page ManageCustomerAddresses --resource=CustomerResource --type=ManageRelatedRecords
```

이 명령어를 실행하면, 관계 이름과 제목 속성 등 페이지를 커스터마이즈할 수 있는 일련의 질문이 표시됩니다.

이 새 페이지를 리소스의 `getPages()` 메서드에 등록해야 합니다:

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListCustomers::route('/'),
        'create' => Pages\CreateCustomer::route('/create'),
        'view' => Pages\ViewCustomer::route('/{record}'),
        'edit' => Pages\EditCustomer::route('/{record}/edit'),
        'addresses' => Pages\ManageCustomerAddresses::route('/{record}/addresses'),
    ];
}
```

> 관계 페이지를 사용할 때는 `make:filament-relation-manager`로 관계 매니저를 생성할 필요가 없으며, 리소스의 `getRelations()` 메서드에 등록할 필요도 없습니다.

이제 관계 매니저와 동일하게 `table()`, `form()`으로 페이지를 커스터마이즈할 수 있습니다.

### 리소스 서브 내비게이션에 관계 페이지 추가하기 {#adding-relation-pages-to-resource-sub-navigation}

[리소스 서브 내비게이션](getting-started#resource-sub-navigation)을 사용하는 경우, 리소스의 `getRecordSubNavigation()`에 이 페이지를 일반적으로 등록할 수 있습니다:

```php
use App\Filament\Resources\CustomerResource\Pages;
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        // ...
        Pages\ManageCustomerAddresses::class,
    ]);
}
```

## 관계 매니저에 속성 전달하기 {#passing-properties-to-relation-managers}

리소스에 관계 매니저를 등록할 때, `make()` 메서드를 사용하여 [Livewire 속성](https://livewire.laravel.com/docs/properties) 배열을 전달할 수 있습니다:

```php
use App\Filament\Resources\Blog\PostResource\RelationManagers\CommentsRelationManager;

public static function getRelations(): array
{
    return [
        CommentsRelationManager::make([
            'status' => 'approved',
        ]),
    ];
}
```

이 속성 배열은 관계 매니저 클래스의 [public Livewire 속성](https://livewire.laravel.com/docs/properties)으로 매핑됩니다:

```php
use Filament\Resources\RelationManagers\RelationManager;

class CommentsRelationManager extends RelationManager
{
    public string $status;

    // ...
}
```

이제 관계 매니저 클래스에서 `$this->status`로 `status`에 접근할 수 있습니다.

## 지연 로딩 비활성화하기 {#disabling-lazy-loading}

기본적으로 관계 매니저는 지연 로딩(lazy-loaded)됩니다. 즉, 페이지에서 보일 때만 로드됩니다.

이 동작을 비활성화하려면 관계 매니저 클래스에서 `$isLazy` 속성을 오버라이드하세요:

```php
protected static bool $isLazy = false;
```
