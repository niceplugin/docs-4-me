---
title: 시작하기
---
# [테이블.컬럼] 시작하기


## 개요 {#overview}

<LaracastsBanner
    title="테이블 컬럼"
    description="Laracasts에서 Filament로 빠르게 Laravel 개발하기 시리즈를 시청하세요 - Filament 리소스 테이블에 컬럼을 추가하는 기본을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/9"
    series="rapid-laravel-development"
/>

컬럼 클래스는 `Filament\Tables\Columns` 네임스페이스에서 찾을 수 있습니다. 이 클래스들은 `$table->columns()` 메서드 안에 넣을 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ]);
}
```

컬럼은 정적 `make()` 메서드를 사용하여 생성할 수 있으며, 고유한 이름을 전달합니다. 컬럼의 이름은 모델의 컬럼 또는 접근자와 일치해야 합니다. 관계 내의 컬럼에 접근하려면 "점 표기법"을 사용할 수 있습니다.

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')

TextColumn::make('author.name')
```

## 사용 가능한 컬럼 {#available-columns}

Filament는 두 가지 주요 유형의 컬럼을 제공합니다 - 정적 컬럼과 수정 가능한 컬럼입니다.

정적 컬럼은 사용자에게 데이터를 표시합니다:

- [텍스트 컬럼](text)
- [아이콘 컬럼](icon)
- [이미지 컬럼](image)
- [컬러 컬럼](color)

수정 가능한 컬럼은 사용자가 테이블을 벗어나지 않고 데이터베이스의 데이터를 업데이트할 수 있게 해줍니다:

- [셀렉트 컬럼](select)
- [토글 컬럼](toggle)
- [텍스트 입력 컬럼](text-input)
- [체크박스 컬럼](checkbox)

또한 [사용자 정의 컬럼을 직접 생성](custom)하여 원하는 방식으로 데이터를 표시할 수도 있습니다.

## 라벨 설정하기 {#setting-a-label}

기본적으로 테이블 헤더에 표시되는 컬럼의 라벨은 컬럼의 이름에서 생성됩니다. `label()` 메서드를 사용하여 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->label('게시글 제목')
```

선택적으로, `translateLabel()` 메서드를 사용하여 [Laravel의 로컬라이제이션 기능](https://laravel.com/docs/localization)으로 라벨을 자동 번역할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->translateLabel() // `label(__('Title'))`과 동일
```

## 정렬 {#sorting}

컬럼은 컬럼 라벨을 클릭하여 정렬할 수 있습니다. 컬럼을 정렬 가능하게 하려면 `sortable()` 메서드를 사용해야 합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->sortable()
```

<AutoScreenshot name="tables/columns/sortable" alt="정렬 가능한 컬럼이 있는 테이블" version="3.x" />

접근자 컬럼을 사용하는 경우, 정렬할 데이터베이스 컬럼의 배열을 `sortable()`에 전달할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('full_name')
    ->sortable(['first_name', 'last_name'])
```

정렬이 Eloquent 쿼리에 어떻게 적용되는지 콜백을 사용하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('full_name')
    ->sortable(query: function (Builder $query, string $direction): Builder {
        return $query
            ->orderBy('last_name', $direction)
            ->orderBy('first_name', $direction);
    })
```

## 기본 정렬 설정 {#sorting-by-default}

다른 정렬이 적용되지 않은 경우 테이블을 기본적으로 정렬하도록 선택할 수 있습니다. 이를 위해 `defaultSort()` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->defaultSort('stock', 'desc');
}
```

### 세션에 정렬 유지 {#persist-sort-in-session}

사용자의 세션에 정렬을 유지하려면 `persistSortInSession()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->persistSortInSession();
}
```

### 기본 정렬 옵션 라벨 설정 {#setting-a-default-sort-option-label}

기본 정렬 옵션 라벨을 설정하려면 `defaultSortOptionLabel()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->defaultSortOptionLabel('날짜');
}
```

## 검색 {#searching}

컬럼은 테이블 오른쪽 상단의 텍스트 입력 필드를 사용하여 검색할 수 있습니다. 컬럼을 검색 가능하게 하려면 `searchable()` 메서드를 사용해야 합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->searchable()
```

<AutoScreenshot name="tables/columns/searchable" alt="검색 가능한 컬럼이 있는 테이블" version="3.x" />

접근자 컬럼을 사용하는 경우, 검색할 데이터베이스 컬럼의 배열을 `searchable()`에 전달할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('full_name')
    ->searchable(['first_name', 'last_name'])
```

검색이 Eloquent 쿼리에 어떻게 적용되는지 콜백을 사용하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('full_name')
    ->searchable(query: function (Builder $query, string $search): Builder {
        return $query
            ->where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%");
    })
```

#### 테이블 검색 필드 플레이스홀더 커스터마이즈 {#customizing-the-table-search-field-placeholder}

`$table`에서 `searchPlaceholder()` 메서드를 사용하여 검색 필드의 플레이스홀더를 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchPlaceholder('검색 (ID, 이름)');
}
```

### 개별 검색 {#searching-individually}

`isIndividual` 파라미터를 사용하여 컬럼별 검색 입력 필드를 활성화할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->searchable(isIndividual: true)
```

<AutoScreenshot name="tables/columns/individually-searchable" alt="개별적으로 검색 가능한 컬럼이 있는 테이블" version="3.x" />

`isIndividual` 파라미터를 사용하면, 해당 컬럼을 전체 테이블의 "글로벌" 검색 입력 필드로도 검색할 수 있습니다.

이 기능을 비활성화하고 개별 검색 기능만 유지하려면 `isGlobal` 파라미터가 필요합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->searchable(isIndividual: true, isGlobal: false)
```

검색을 쿼리 문자열에 유지할 수도 있습니다:

```php
use Livewire\Attributes\Url;

/**
 * @var array<string, string | array<string, string | null> | null>
 */
#[Url]
public array $tableColumnSearches = [];
```

### 테이블 검색 디바운스 커스터마이즈 {#customizing-the-table-search-debounce}

`$table`에서 `searchDebounce()` 메서드를 사용하여 모든 테이블 검색 필드의 디바운스 시간을 커스터마이즈할 수 있습니다. 기본값은 `500ms`입니다:

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchDebounce('750ms');
}
```

### 입력이 블러될 때 검색 {#searching-when-the-input-is-blurred}

사용자가 검색어를 입력하는 동안 자동으로 테이블 내용을 새로고침하는 대신, [검색 필드의 디바운스](#customizing-the-table-search-debounce)에 영향을 받지 않고, 사용자가 입력을 블러(탭 또는 클릭하여 벗어남)할 때만 테이블을 검색하도록 동작을 변경할 수 있습니다. 이를 위해 `searchOnBlur()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchOnBlur();
}
```

### 세션에 검색 유지 {#persist-search-in-session}

테이블 또는 개별 컬럼 검색을 사용자의 세션에 유지하려면 `persistSearchInSession()` 또는 `persistColumnSearchInSession()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->persistSearchInSession()
        ->persistColumnSearchesInSession();
}
```

## 컬럼 액션 및 URL {#column-actions-and-urls}

셀을 클릭하면 "액션"을 실행하거나 URL을 열 수 있습니다.

### 액션 실행하기 {#running-actions}

액션을 실행하려면, 실행할 콜백 또는 Livewire 메서드의 이름을 `action()` 메서드에 전달하면 됩니다. 각 메서드는 `$record` 파라미터를 받아 액션의 동작을 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->action(function (Post $record): void {
        $this->dispatch('open-post-edit-modal', post: $record->getKey());
    })
```

#### 액션 모달 {#action-modals}

`action()` 메서드에 `Action` 객체를 전달하여 [액션 모달](../actions#modals)을 열 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->action(
        Action::make('select')
            ->requiresConfirmation()
            ->action(function (Post $record): void {
                $this->dispatch('select-post', post: $record->getKey());
            }),
    )
```

`action()` 메서드에 전달된 액션 객체는 테이블 내의 다른 액션과 구분할 수 있도록 고유한 이름이 있어야 합니다.

### URL 열기 {#opening-urls}

URL을 열려면, 열고자 하는 콜백 또는 정적 URL을 `url()` 메서드에 전달하면 됩니다. 콜백은 URL을 커스터마이즈할 수 있도록 `$record` 파라미터를 받습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
```

URL을 새 탭에서 열도록 선택할 수도 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
    ->openUrlInNewTab()
```

## 기본값 설정하기 {#setting-a-default-value}

비어 있는 상태의 컬럼에 기본값을 설정하려면 `default()` 메서드를 사용할 수 있습니다. 이 메서드는 기본 상태를 실제 값처럼 처리하므로, [이미지](image)나 [컬러](color)와 같은 컬럼은 기본 이미지나 컬러를 표시합니다.

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->default('설명이 없습니다.')
```

## 컬럼이 비어 있을 때 플레이스홀더 텍스트 추가하기 {#adding-placeholder-text-if-a-column-is-empty}

때때로 비어 있는 상태의 컬럼에 플레이스홀더 텍스트를 표시하고 싶을 수 있습니다. 이 텍스트는 더 연한 회색으로 스타일링됩니다. 이는 [기본값](#setting-a-default-value)과 다르게, 플레이스홀더는 항상 텍스트이며 실제 상태로 간주되지 않습니다.

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->placeholder('설명이 없습니다.')
```

<AutoScreenshot name="tables/columns/placeholder" alt="비어 있는 상태에 플레이스홀더가 있는 컬럼" version="3.x" />

## 컬럼 숨기기 {#hiding-columns}

컬럼을 조건부로 숨기려면, `hidden()` 또는 `visible()` 메서드 중 원하는 것을 사용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('role')
    ->hidden(! auth()->user()->isAdmin())
// 또는
TextColumn::make('role')
    ->visible(auth()->user()->isAdmin())
```

### 컬럼 표시/숨김 토글 {#toggling-column-visibility}

사용자는 테이블에서 직접 컬럼을 숨기거나 표시할 수 있습니다. 컬럼을 토글 가능하게 하려면 `toggleable()` 메서드를 사용하세요:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->toggleable()
```

<AutoScreenshot name="tables/columns/toggleable" alt="토글 가능한 컬럼이 있는 테이블" version="3.x" />

#### 기본적으로 숨겨진 토글 컬럼 만들기 {#making-toggleable-columns-hidden-by-default}

기본적으로 토글 가능한 컬럼은 표시됩니다. 이를 숨기려면:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('id')
    ->toggleable(isToggledHiddenByDefault: true)
```

#### 토글 컬럼 드롭다운 트리거 액션 커스터마이즈 {#customizing-the-toggle-columns-dropdown-trigger-action}

토글 드롭다운 트리거 버튼을 커스터마이즈하려면, 클로저를 전달하여 액션을 반환하는 `toggleColumnsTriggerAction()` 메서드를 사용할 수 있습니다. [액션 트리거 버튼 커스터마이즈](/filament/3.x/actions/trigger-button)에 사용할 수 있는 모든 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->toggleColumnsTriggerAction(
            fn (Action $action) => $action
                ->button()
                ->label('컬럼 토글'),
        );
}
```

## 계산된 상태 {#calculated-state}

때로는 데이터베이스 컬럼에서 직접 읽는 대신 컬럼의 상태를 계산해야 할 수 있습니다.

`state()` 메서드에 콜백 함수를 전달하여, `$record`를 기반으로 해당 컬럼의 반환 상태를 커스터마이즈할 수 있습니다:

```php
use App\Models\Order;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('amount_including_vat')
    ->state(function (Order $record): float {
        return $record->amount * (1 + $record->vat_rate);
    })
```

## 툴팁 {#tooltips}

셀에 마우스를 올렸을 때 표시할 툴팁을 지정할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->tooltip('제목')
```

<AutoScreenshot name="tables/columns/tooltips" alt="툴팁이 표시되는 컬럼이 있는 테이블" version="3.x" />

이 메서드는 현재 테이블 레코드에 접근할 수 있는 클로저도 허용합니다:

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Model;

TextColumn::make('title')
    ->tooltip(fn (Model $record): string => "작성자: {$record->author->name}")
```

## 컬럼 내용의 수평 정렬 {#horizontally-aligning-column-content}

테이블 컬럼은 기본적으로 시작(좌측에서 우측 인터페이스에서는 왼쪽, 우측에서 좌측 인터페이스에서는 오른쪽)에 정렬됩니다. `alignment()` 메서드를 사용하여 정렬을 변경할 수 있으며, `Alignment::Start`, `Alignment::Center`, `Alignment::End`, `Alignment::Justify` 옵션을 전달할 수 있습니다:

```php
use Filament\Support\Enums\Alignment;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->alignment(Alignment::End)
```

<AutoScreenshot name="tables/columns/alignment" alt="끝에 정렬된 컬럼이 있는 테이블" version="3.x" />

또는 `alignEnd()`와 같은 축약 메서드를 사용할 수도 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->alignEnd()
```

## 컬럼 내용의 수직 정렬 {#vertically-aligning-column-content}

테이블 컬럼 내용은 기본적으로 수직 중앙에 정렬됩니다. `verticalAlignment()` 메서드를 사용하여 수직 정렬을 변경할 수 있으며, `VerticalAlignment::Start`, `VerticalAlignment::Center`, `VerticalAlignment::End` 옵션을 전달할 수 있습니다:

```php
use Filament\Support\Enums\VerticalAlignment;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->verticalAlignment(VerticalAlignment::Start)
```

<AutoScreenshot name="tables/columns/vertical-alignment" alt="시작에 수직 정렬된 컬럼이 있는 테이블" version="3.x" />

또는 `verticallyAlignStart()`와 같은 축약 메서드를 사용할 수도 있습니다:

```php
use Filament\Support\Enums\VerticalAlignment;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->verticallyAlignStart()
```

## 컬럼 헤더 줄바꿈 허용 {#allowing-column-headers-to-wrap}

기본적으로 컬럼 헤더는 더 많은 공간이 필요해도 여러 줄로 줄바꿈되지 않습니다. `wrapHeader()` 메서드를 사용하여 줄바꿈을 허용할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->wrapHeader()
```

## 컬럼 너비 제어 {#controlling-the-width-of-columns}

기본적으로 컬럼은 필요한 만큼의 공간을 차지합니다. `grow()` 메서드를 사용하여 일부 컬럼이 다른 컬럼보다 더 많은 공간을 차지하도록 할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->grow()
```

또는 컬럼의 너비를 정의할 수 있으며, 이는 `style` 속성을 통해 헤더 셀에 전달되므로 유효한 CSS 값을 사용할 수 있습니다:

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_paid')
    ->label('결제 여부')
    ->boolean()
    ->width('1%')
```

## 컬럼 그룹화 {#grouping-columns}

여러 컬럼을 하나의 헤딩 아래에 그룹화하려면 `ColumnGroup` 객체를 사용하세요:

```php
use Filament\Tables\Columns\ColumnGroup;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            ColumnGroup::make('공개 범위', [
                TextColumn::make('status'),
                IconColumn::make('is_featured'),
            ]),
            TextColumn::make('author.name'),
        ]);
}
```

첫 번째 인자는 그룹의 라벨이고, 두 번째는 해당 그룹에 속하는 컬럼 객체의 배열입니다.

<AutoScreenshot name="tables/columns/grouping" alt="그룹화된 컬럼이 있는 테이블" version="3.x" />

`ColumnGroup` 객체에서 그룹 헤더의 [정렬](#horizontally-aligning-column-content)과 [줄바꿈](#allowing-column-headers-to-wrap)도 제어할 수 있습니다. API의 다중 라인 유창성을 높이기 위해, 두 번째 인자로 전달하는 대신 `columns()`를 체이닝할 수 있습니다:

```php
use Filament\Support\Enums\Alignment;
use Filament\Tables\Columns\ColumnGroup;

ColumnGroup::make('웹사이트 공개 범위')
    ->columns([
        // ...
    ])
    ->alignment(Alignment::Center)
    ->wrapHeader()
```

## 커스텀 속성 {#custom-attributes}

컬럼의 HTML은 `extraAttributes()`에 배열을 전달하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('slug')
    ->extraAttributes(['class' => 'bg-gray-200'])
```

이 속성들은 해당 컬럼의 각 셀의 바깥 `<div>` 요소에 병합됩니다.

## 전역 설정 {#global-settings}

모든 컬럼의 기본 동작을 전역적으로 변경하고 싶다면, 서비스 프로바이더의 `boot()` 메서드 안에서 정적 `configureUsing()` 메서드를 호출할 수 있습니다. 이 메서드에 컬럼을 수정하는 클로저를 전달합니다. 예를 들어, 모든 컬럼을 [`searchable()`](#searching) 및 [`toggleable()`](#toggling-column-visibility)로 만들고 싶다면 다음과 같이 할 수 있습니다:

```php
use Filament\Tables\Columns\Column;

Column::configureUsing(function (Column $column): void {
    $column
        ->toggleable()
        ->searchable();
});
```

또한, 특정 컬럼 타입에만 이 코드를 적용할 수도 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::configureUsing(function (TextColumn $column): void {
    $column
        ->toggleable()
        ->searchable();
});
```

물론, 각 컬럼에서 개별적으로 이를 덮어쓸 수도 있습니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->toggleable(false)
```
