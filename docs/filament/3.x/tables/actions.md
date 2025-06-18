---
title: 액션
---
# [테이블] 액션


## 개요 {#overview}

<LaracastsBanner
    title="테이블 액션"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈를 시청하세요. Filament 리소스 테이블에 액션을 추가하는 기본 방법을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/11"
    series="rapid-laravel-development"
/>

Filament의 테이블은 [액션](../actions)을 사용할 수 있습니다. 액션은 [테이블의 각 행 끝](#row-actions)이나, 심지어 테이블의 [헤더](#header-actions)에 추가할 수 있는 버튼입니다. 예를 들어, 헤더에는 "새 레코드 생성" 액션을, 각 행에는 "수정" 및 "삭제" 액션을 추가할 수 있습니다. [일괄 액션](#bulk-actions)은 테이블에서 레코드를 선택했을 때 코드를 실행하는 데 사용할 수 있습니다. 또한, 액션은 [테이블 컬럼](#column-actions)에도 추가할 수 있어, 해당 컬럼의 각 셀이 액션을 트리거하는 역할을 하게 할 수 있습니다.

액션의 모든 기능을 제대로 활용하려면 [액션 트리거 버튼 커스터마이징](../actions/trigger-button)과 [액션 모달](../actions/modals)에 관한 문서를 꼭 읽어보시길 권장합니다.

## 행 액션 {#row-actions}

액션 버튼은 각 테이블 행의 끝에 렌더링할 수 있습니다. `$table->actions()` 메서드에 넣을 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            // ...
        ]);
}
```

액션은 고유한 이름을 전달하여 정적 `make()` 메서드를 사용해 생성할 수 있습니다.

그런 다음, 작업을 실행하는 함수는 `action()`에, 링크를 생성하는 함수는 `url()`에 전달할 수 있습니다:

```php
use App\Models\Post;
use Filament\Tables\Actions\Action;

Action::make('edit')
    ->url(fn (Post $record): string => route('posts.edit', $record))
    ->openUrlInNewTab()

Action::make('delete')
    ->requiresConfirmation()
    ->action(fn (Post $record) => $record->delete())
```

액션의 모든 메서드는 콜백 함수를 받을 수 있으며, 클릭된 현재 테이블의 `$record`에 접근할 수 있습니다.

<AutoScreenshot name="tables/actions/simple" alt="Table with actions" version="3.x" />

### 행 액션을 컬럼 앞에 위치시키기 {#positioning-row-actions-before-columns}

기본적으로, 테이블의 행 액션은 각 행의 마지막 셀에 렌더링됩니다. `position` 인수를 사용하여 이들을 컬럼 앞에 위치시킬 수 있습니다:

```php
use Filament\Tables\Enums\ActionsPosition;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            // ...
        ], position: ActionsPosition::BeforeColumns);
}
```

<AutoScreenshot name="tables/actions/before-columns" alt="컬럼 앞에 액션이 위치한 테이블" version="3.x" />

### 체크박스 열 앞에 행 액션 위치시키기 {#positioning-row-actions-before-the-checkbox-column}

기본적으로, 테이블의 행 액션은 각 행의 마지막 셀에 렌더링됩니다. `position` 인수를 사용하여 이들을 체크박스 열 앞에 위치시킬 수 있습니다:

```php
use Filament\Tables\Enums\ActionsPosition;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            // ...
        ], position: ActionsPosition::BeforeCells);
}
```

<AutoScreenshot name="tables/actions/before-cells" alt="셀 앞에 액션이 있는 테이블" version="3.x" />

### 선택된 테이블 행에 접근하기 {#accessing-the-selected-table-rows}

액션이 테이블에서 선택된 모든 행에 접근할 수 있도록 하고 싶을 수 있습니다. 일반적으로 이는 테이블 헤더의 [일괄 액션](#bulk-actions)을 통해 이루어집니다. 하지만, 선택된 행들이 액션에 대한 컨텍스트를 제공하는 행 액션(row action)에서 이 기능을 사용하고 싶을 수도 있습니다.

예를 들어, 행 데이터를 모든 선택된 레코드에 복사하는 행 액션을 만들고 싶을 수 있습니다. 일괄 액션이 정의되어 있지 않더라도 테이블이 선택 가능하도록 강제하려면 `selectable()` 메서드를 사용해야 합니다. 액션이 선택된 레코드에 접근할 수 있도록 하려면 `accessSelectedRecords()` 메서드를 사용해야 합니다. 그런 다음, 액션 내에서 `$selectedRecords` 파라미터를 사용해 선택된 레코드에 접근할 수 있습니다:

```php
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->selectable()
        ->actions([
            Action::make('copyToSelected')
                ->accessSelectedRecords()
                ->action(function (Model $record, Collection $selectedRecords) {
                    $selectedRecords->each(
                        fn (Model $selectedRecord) => $selectedRecord->update([
                            'is_active' => $record->is_active,
                        ]),
                    );
                }),
        ]);
}
```

## 일괄 작업 {#bulk-actions}

테이블은 "일괄 작업"도 지원합니다. 사용자가 테이블에서 행을 선택할 때 사용할 수 있습니다. 일반적으로 행이 선택되면, 테이블의 왼쪽 상단에 "일괄 작업" 버튼이 나타납니다. 사용자가 이 버튼을 클릭하면, 선택할 수 있는 작업의 드롭다운 메뉴가 표시됩니다. 이 작업들은 `$table->bulkActions()` 메서드에 넣을 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->bulkActions([
            // ...
        ]);
}
```

일괄 작업은 고유한 이름을 전달하여 정적 `make()` 메서드를 사용해 생성할 수 있습니다. 그런 다음, 작업을 실행하는 콜백을 `action()`에 전달해야 합니다:

```php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->requiresConfirmation()
    ->action(fn (Collection $records) => $records->each->delete())
```

이 함수는 현재 테이블에서 선택된 `$records`에 접근할 수 있게 해줍니다. 이는 모델의 Eloquent 컬렉션입니다.

<AutoScreenshot name="tables/actions/bulk" alt="일괄 작업이 있는 테이블" version="3.x" />

### 일괄 작업 그룹화 {#grouping-bulk-actions}

여러 개의 일괄 작업을 [드롭다운에서 함께 그룹화](../actions/grouping-actions)하려면 `BulkActionGroup` 객체를 사용할 수 있습니다. `BulkActionGroup` 외부에 남아 있는 일괄 작업은 드롭다운 트리거 버튼 옆에 렌더링됩니다:

```php
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->bulkActions([
            BulkActionGroup::make([
                BulkAction::make('delete')
                    ->requiresConfirmation()
                    ->action(fn (Collection $records) => $records->each->delete()),
                BulkAction::make('forceDelete')
                    ->requiresConfirmation()
                    ->action(fn (Collection $records) => $records->each->forceDelete()),
            ]),
            BulkAction::make('export')->button()->action(fn (Collection $records) => ...),
        ]);
}
```

또는, 모든 일괄 작업이 그룹화되어 있다면, 간단하게 `groupedBulkActions()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groupedBulkActions([
            BulkAction::make('delete')
                ->requiresConfirmation()
                ->action(fn (Collection $records) => $records->each->delete()),
            BulkAction::make('forceDelete')
                ->requiresConfirmation()
                ->action(fn (Collection $records) => $records->each->forceDelete()),
        ]);
}
```

### 일괄 작업이 완료된 후 레코드 선택 해제하기 {#deselecting-records-once-a-bulk-action-has-finished}

`deselectRecordsAfterCompletion()` 메서드를 사용하여 일괄 작업이 실행된 후 레코드의 선택을 해제할 수 있습니다:

```php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->action(fn (Collection $records) => $records->each->delete())
    ->deselectRecordsAfterCompletion()
```

### 일부 행에 대해 일괄 작업 비활성화하기 {#disabling-bulk-actions-for-some-rows}

특정 레코드에 대해 조건부로 일괄 작업을 비활성화할 수 있습니다:

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->bulkActions([
            // ...
        ])
        ->checkIfRecordIsSelectableUsing(
            fn (Model $record): bool => $record->status === Status::Enabled,
        );
}
```

### 모든 페이지의 일괄 선택 방지 {#preventing-bulk-selection-of-all-pages}

`selectCurrentPageOnly()` 메서드는 사용자가 테이블의 모든 레코드를 한 번에 쉽게 일괄 선택하지 못하도록 방지하며, 대신 한 번에 한 페이지만 선택할 수 있도록 합니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->bulkActions([
            // ...
        ])
        ->selectCurrentPageOnly();
}
```

## 헤더 액션 {#header-actions}

[행 액션](#row-actions)과 [일괄 액션](#bulk-actions) 모두 테이블의 헤더에 렌더링할 수 있습니다. 이들은 `$table->headerActions()` 메서드에 넣을 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->headerActions([
            // ...
        ]);
}
```

이 기능은 특정 테이블 행과 관련이 없는 "생성" 액션이나, 더 눈에 띄게 보여야 하는 일괄 액션 등에 유용합니다.

<AutoScreenshot name="tables/actions/header" alt="헤더 액션이 있는 테이블" version="3.x" />

## 컬럼 액션 {#column-actions}

컬럼에 액션을 추가할 수 있으며, 해당 컬럼의 셀을 클릭하면 액션의 트리거로 작동합니다. 문서에서 [컬럼 액션](columns/getting-started#running-actions)에 대해 더 자세히 알아볼 수 있습니다.

## 기본 제공 테이블 액션 {#prebuilt-table-actions}

Filament에는 테이블에 추가할 수 있는 여러 가지 기본 제공 액션과 일괄 액션이 포함되어 있습니다. 이들의 목적은 가장 일반적인 Eloquent 관련 작업을 간소화하는 데 있습니다:

- [생성](../actions/prebuilt-actions/create)
- [수정](../actions/prebuilt-actions/edit)
- [보기](../actions/prebuilt-actions/view)
- [삭제](../actions/prebuilt-actions/delete)
- [복제](../actions/prebuilt-actions/replicate)
- [강제 삭제](../actions/prebuilt-actions/force-delete)
- [복원](../actions/prebuilt-actions/restore)
- [가져오기](../actions/prebuilt-actions/import)
- [내보내기](../actions/prebuilt-actions/export)

## 액션 그룹화 {#grouping-actions}

여러 테이블 액션을 드롭다운으로 그룹화하려면 `ActionGroup` 객체를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            ActionGroup::make([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ]),
            // ...
        ]);
}
```

<AutoScreenshot name="tables/actions/group" alt="액션 그룹이 있는 테이블" version="3.x" />

### 액션 그룹 버튼 스타일 선택하기 {#choosing-an-action-group-button-style}

기본적으로, 액션 그룹 트리거는 3가지 스타일이 있습니다 - "버튼", "링크", 그리고 "아이콘 버튼"입니다.

"아이콘 버튼" 트리거는 [아이콘](#setting-the-action-group-button-icon)만 있고 라벨이 없는 원형 버튼입니다. 보통 이 스타일이 기본 버튼 스타일이지만, `iconButton()` 메서드를 사용해 수동으로 적용할 수도 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])->iconButton()
```

<AutoScreenshot name="tables/actions/group-icon-button" alt="아이콘 버튼 액션 그룹이 있는 테이블" version="3.x" />

"버튼" 트리거는 배경색, 라벨, 그리고 선택적으로 [아이콘](#setting-the-action-group-button-icon)을 가질 수 있습니다. `button()` 메서드를 사용해 이 스타일로 변경할 수 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])
    ->button()
    ->label('Actions')
```

<AutoScreenshot name="tables/actions/group-button" alt="버튼 액션 그룹이 있는 테이블" version="3.x" />

"링크" 트리거는 배경색이 없습니다. 반드시 라벨이 있어야 하며, 선택적으로 [아이콘](#setting-the-action-group-button-icon)을 가질 수 있습니다. 일반적으로 텍스트 내에 삽입된 링크처럼 보입니다. `link()` 메서드를 사용해 이 스타일로 변경할 수 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])
    ->link()
    ->label('Actions')
```

<AutoScreenshot name="tables/actions/group-link" alt="링크 액션 그룹이 있는 테이블" version="3.x" />

### 액션 그룹 버튼 아이콘 설정하기 {#setting-the-action-group-button-icon}

`icon()` 메서드를 사용하여 액션 그룹 버튼의 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 설정할 수 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])->icon('heroicon-m-ellipsis-horizontal');
```

<AutoScreenshot name="tables/actions/group-icon" alt="사용자 지정 액션 그룹 아이콘이 있는 테이블" version="3.x" />

### 액션 그룹 버튼 색상 설정하기 {#setting-the-action-group-button-color}

`color()` 메서드를 사용하여 액션 그룹 버튼의 색상을 설정할 수 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])->color('info');
```

<AutoScreenshot name="tables/actions/group-color" alt="사용자 지정 액션 그룹 색상이 적용된 테이블" version="3.x" />

### 액션 그룹 버튼 크기 설정하기 {#setting-the-action-group-button-size}

버튼은 `sm`, `md`, `lg`의 3가지 크기가 있습니다. `size()` 메서드를 사용하여 액션 그룹 버튼의 크기를 설정할 수 있습니다:

```php
use Filament\Support\Enums\ActionSize;
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])->size(ActionSize::Small);
```

<AutoScreenshot name="tables/actions/group-small" alt="작은 액션 그룹이 있는 테이블" version="3.x" />

### 액션 그룹 툴팁 설정하기 {#setting-the-action-group-tooltip}

`tooltip()` 메서드를 사용하여 액션 그룹의 툴팁을 설정할 수 있습니다:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    // ...
])->tooltip('Actions');
```

<AutoScreenshot name="tables/actions/group-tooltip" alt="액션 그룹 툴팁이 있는 테이블" version="3.x" />

## 테이블 액션 유틸리티 주입 {#table-action-utility-injection}

모든 액션은 테이블 액션뿐만 아니라 [많은 유틸리티](../actions/advanced#action-utility-injection)에 대부분의 설정 메서드 내에서 접근할 수 있습니다. 그러나 이 외에도, 테이블 액션은 몇 가지 추가 유틸리티에 접근할 수 있습니다:

### 현재 Eloquent 레코드 주입하기 {#injecting-the-current-eloquent-record}

액션의 현재 Eloquent 레코드에 접근하고 싶다면, `$record` 파라미터를 정의하세요:

```php
use Illuminate\Database\Eloquent\Model;

function (Model $record) {
    // ...
}
```

일괄 액션, 헤더 액션, 빈 상태 액션은 어떤 테이블 행과도 관련이 없으므로 `$record`에 접근할 수 없다는 점에 유의하세요.

### 현재 Eloquent 모델 클래스 주입하기 {#injecting-the-current-eloquent-model-class}

테이블의 현재 Eloquent 모델 클래스에 접근하고 싶다면, `$model` 파라미터를 정의하세요:

```php
function (string $model) {
    // ...
}
```

### 현재 테이블 인스턴스 주입하기 {#injecting-the-current-table-instance}

액션이 속한 현재 테이블 구성 인스턴스에 접근하고 싶다면, `$table` 파라미터를 정의하세요:

```php
use Filament\Tables\Table;

function (Table $table) {
    // ...
}
```
