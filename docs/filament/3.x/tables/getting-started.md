---
title: 시작하기
---
# [테이블] 시작하기

## 개요 {#overview}

Filament의 Table Builder 패키지는 [어떤 Livewire 컴포넌트에도 인터랙티브 데이터테이블을 추가](adding-a-table-to-a-livewire-component)할 수 있게 해줍니다. 이 패키지는 [Panel Builder](../panels/getting-started)에서 [리소스](../panels/resources/getting-started)와 [관계 매니저](../panels/resources/relation-managers)를 표시하거나, [테이블 위젯](../panels/dashboard#table-widgets) 등 다른 Filament 패키지 내에서도 사용됩니다. Table Builder의 기능을 익히면 직접 커스텀 Livewire 테이블을 만들 때나 Filament의 다른 패키지를 사용할 때 엄청난 시간을 절약할 수 있습니다.

이 가이드는 Filament의 테이블 패키지로 테이블을 만드는 기본적인 방법을 안내합니다. 만약 자신의 Livewire 컴포넌트에 새 테이블을 추가하려는 경우, [먼저 이 작업을 진행](adding-a-table-to-a-livewire-component)한 후 다시 돌아오세요. [앱 리소스](../panels/resources/getting-started)나 다른 Filament 패키지에 테이블을 추가하려는 경우라면 바로 시작하셔도 됩니다!

## 테이블 열 정의하기 {#defining-table-columns}

테이블의 기본은 행과 열입니다. Filament는 Eloquent를 사용하여 테이블의 행에 대한 데이터를 가져오며, 해당 행에 사용될 열을 정의하는 것은 여러분의 책임입니다.

Filament는 내장된 다양한 열 타입을 제공합니다. [전체 열 목록은 여기에서 확인할 수 있습니다.](columns/getting-started#available-columns) 또한, [직접 커스텀 열 타입을 생성](columns/custom)하여 원하는 방식으로 데이터를 표시할 수도 있습니다.

열은 `$table->columns()` 메서드 내의 객체 배열로 저장됩니다:

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            IconColumn::make('is_featured')
                ->boolean(),
        ]);
}
```

<AutoScreenshot name="tables/getting-started/columns" alt="Table with columns" version="3.x" />

이 예시에서는 테이블에 3개의 열이 있습니다. 처음 두 개의 열은 [텍스트](columns/text)를 표시하며, 각각 테이블의 행마다 제목과 슬러그를 보여줍니다. 세 번째 열은 [아이콘](columns/icon)을 표시하며, 해당 행이 추천인지 여부에 따라 초록색 체크 또는 빨간색 X 아이콘이 나타납니다.

### 컬럼을 정렬 및 검색 가능하게 만들기 {#making-columns-sortable-and-searchable}

컬럼에 메서드를 체이닝하여 쉽게 수정할 수 있습니다. 예를 들어, `searchable()` 메서드를 사용하여 컬럼을 [검색 가능하게](columns/getting-started#searching) 만들 수 있습니다. 이제 테이블에 검색 필드가 생기고, 해당 컬럼의 값으로 행을 필터링할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->searchable()
```

<AutoScreenshot name="tables/getting-started/searchable-columns" alt="검색 가능한 컬럼이 있는 테이블" version="3.x" />

여러 컬럼을 검색 가능하게 만들 수 있으며, Filament는 이들 중 어느 컬럼이든 한 번에 검색할 수 있습니다.

또한, `sortable()` 메서드를 사용하여 컬럼을 [정렬 가능하게](columns/getting-started#sorting) 만들 수 있습니다. 이 메서드를 사용하면 컬럼 헤더에 정렬 버튼이 추가되고, 클릭 시 해당 컬럼을 기준으로 테이블이 정렬됩니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->sortable()
```

<AutoScreenshot name="tables/getting-started/sortable-columns" alt="정렬 가능한 컬럼이 있는 테이블" version="3.x" />

### 컬럼에서 연관 데이터 접근하기 {#accessing-related-data-from-columns}

관계에 속한 데이터를 컬럼에 표시할 수도 있습니다. 예를 들어, `Post` 모델이 `User` 모델(게시글의 작성자)에 속해 있다면, 테이블에서 사용자의 이름을 표시할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('author.name')
```

<AutoScreenshot name="tables/getting-started/relationship-columns" alt="관계 컬럼이 있는 테이블" version="3.x" />

이 경우, Filament는 `Post` 모델에서 `author` 관계를 찾은 다음, 해당 관계의 `name` 속성을 표시합니다. 이를 "닷 표기법(dot notation)"이라고 부르며, 이를 사용해 어떤 관계의 속성이든, 심지어 중첩된 먼 관계의 속성도 표시할 수 있습니다. Filament는 이 닷 표기법을 사용해 해당 관계의 결과를 eager-load(즉시 로드)해줍니다.

## 테이블 필터 정의하기 {#defining-table-filters}

컬럼을 `searchable()`로 설정하는 것 외에도, 사용자가 테이블의 행을 다양한 방식으로 필터링할 수 있도록 할 수 있습니다. 이러한 컴포넌트를 "필터"라고 하며, `$table->filters()` 메서드에서 정의합니다:

```php
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->filters([
            Filter::make('is_featured')
                ->query(fn (Builder $query) => $query->where('is_featured', true)),
            SelectFilter::make('status')
                ->options([
                    'draft' => 'Draft',
                    'reviewing' => 'Reviewing',
                    'published' => 'Published',
                ]),
        ]);
}
```

<AutoScreenshot name="tables/getting-started/filters" alt="Table with filters" version="3.x" />

이 예시에서는 2개의 테이블 필터를 정의했습니다. 테이블 상단 모서리에 "필터" 아이콘 버튼이 생기며, 클릭하면 우리가 정의한 2개의 필터가 포함된 드롭다운이 열립니다.

첫 번째 필터는 체크박스로 렌더링됩니다. 체크하면 테이블에서 추천된(Featured) 행만 표시되고, 체크를 해제하면 모든 행이 표시됩니다.

두 번째 필터는 셀렉트 드롭다운으로 렌더링됩니다. 사용자가 옵션을 선택하면 해당 상태의 행만 표시되고, 아무 옵션도 선택하지 않으면 모든 행이 표시됩니다.

필요한 만큼 많은 필터를 정의할 수 있으며, [Form Builder 패키지](../forms/getting-started)의 어떤 컴포넌트도 UI 생성에 사용할 수 있습니다. 예를 들어, [커스텀 날짜 범위 필터](../filters/custom)를 만들 수도 있습니다.

## 테이블 액션 정의하기 {#defining-table-actions}

Filament의 테이블은 [액션](../actions/overview)을 사용할 수 있습니다. 액션은 [테이블의 각 행 끝](actions#row-actions)이나, 심지어 테이블의 [헤더](actions#header-actions)에도 추가할 수 있는 버튼입니다. 예를 들어, 헤더에는 "새 레코드 생성" 액션을, 각 행에는 "수정" 및 "삭제" 액션을 추가할 수 있습니다. [일괄 액션](actions#bulk-actions)은 테이블에서 레코드를 선택했을 때 코드를 실행하는 데 사용할 수 있습니다.

```php
use App\Models\Post;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteBulkAction;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->actions([
            Action::make('feature')
                ->action(function (Post $record) {
                    $record->is_featured = true;
                    $record->save();
                })
                ->hidden(fn (Post $record): bool => $record->is_featured),
            Action::make('unfeature')
                ->action(function (Post $record) {
                    $record->is_featured = false;
                    $record->save();
                })
                ->visible(fn (Post $record): bool => $record->is_featured),
        ])
        ->bulkActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ]);
}
```

<AutoScreenshot name="tables/getting-started/actions" alt="액션이 있는 테이블" version="3.x" />

이 예시에서는 테이블 행에 대해 2개의 액션을 정의합니다. 첫 번째 액션은 "feature" 액션입니다. 클릭 시 해당 레코드의 `is_featured` 속성을 `true`로 설정합니다. 이 동작은 `action()` 메서드 안에 작성되어 있습니다. `hidden()` 메서드를 사용하여, 이미 featured된 레코드라면 이 액션은 숨겨집니다. 두 번째 액션은 "unfeature" 액션입니다. 클릭 시 해당 레코드의 `is_featured` 속성을 `false`로 설정합니다. `visible()` 메서드를 사용하여, featured되지 않은 레코드라면 이 액션은 숨겨집니다.

또한 일괄 액션도 정의합니다. 일괄 액션이 정의되면, 테이블의 각 행에 체크박스가 표시됩니다. 이 일괄 액션은 [Filament에 내장된 기능](../actions/prebuilt-actions/delete#bulk-delete)으로, 선택된 모든 레코드를 삭제합니다. 물론 [사용자 정의 일괄 액션](actions#bulk-actions)도 쉽게 작성할 수 있습니다.

<AutoScreenshot name="tables/getting-started/actions-modal" alt="액션 모달이 열린 테이블" version="3.x" />

액션은 사용자에게 확인을 요청하는 모달을 열 수도 있고, 추가 데이터를 수집하기 위해 폼을 렌더링할 수도 있습니다. Filament 전반에 걸쳐 액션이 제공하는 다양한 기능을 더 잘 이해하려면 [액션 문서](../actions/overview)를 읽어보는 것이 좋습니다.

## Table Builder 패키지로 다음 단계 진행하기 {#next-steps-with-the-table-builder-package}

이제 이 가이드를 모두 읽으셨으니, 다음에는 무엇을 해볼 수 있을까요? 다음과 같은 제안을 드립니다:

- [테이블에 데이터를 표시할 수 있는 다양한 컬럼을 살펴보세요.](columns/getting-started#available-columns)
- [테이블 액션을 깊이 있게 알아보고 모달을 사용해보세요.](actions)
- [CSS를 직접 다루지 않고도 복잡하고 반응형인 테이블 레이아웃을 만드는 방법을 알아보세요.](layout)
- [테이블에 데이터를 요약해서 보여주는 요약 정보를 추가해보세요.](summaries)
- [테이블을 필요에 맞게 커스터마이즈할 수 있는 모든 고급 기술을 알아보세요.](advanced)
- [도우미 메서드 모음을 활용해 테이블에 대한 자동화된 테스트를 작성해보세요.](testing)
