---
title: 행 그룹화
---
# [테이블] 행 그룹화

## 개요 {#overview}

사용자가 공통 속성을 사용하여 테이블 행을 그룹화할 수 있도록 허용할 수 있습니다. 이는 많은 데이터를 보다 체계적으로 표시하는 데 유용합니다.

그룹은 그룹화할 속성의 이름(예: `'status'`)이나, 그룹화 동작을 커스터마이즈할 수 있는 `Group` 객체(예: `Group::make('status')->collapsible()`)를 사용하여 설정할 수 있습니다.

## 기본적으로 행 그룹화하기 {#grouping-rows-by-default}

항상 특정 속성으로 게시물을 그룹화하고 싶을 수 있습니다. 이를 위해 `defaultGroup()` 메서드에 그룹을 전달하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->defaultGroup('status');
}
```

<AutoScreenshot name="tables/grouping" alt="그룹화된 테이블" version="3.x" />

## 사용자가 그룹화를 선택할 수 있도록 허용하기 {#allowing-users-to-choose-between-groupings}

`groups()` 메서드에 배열로 전달하여, 사용자가 다양한 그룹화 중에서 선택할 수 있도록 할 수도 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            'status',
            'category',
        ]);
}
```

`groups()`와 `defaultGroup()`을 함께 사용하여, 사용자가 다양한 그룹화 중에서 선택할 수 있도록 하면서 기본 그룹화를 설정할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            'status',
            'category',
        ])
        ->defaultGroup('status');
}
```

## 관계 속성으로 그룹화하기 {#grouping-by-a-relationship-attribute}

점 표기법(dot-syntax)을 사용하여 관계 속성으로도 그룹화할 수 있습니다. 예를 들어, `author` 관계에 `name` 속성이 있다면, 속성 이름으로 `author.name`을 사용할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            'author.name',
        ]);
}
```

## 그룹화 라벨 설정하기 {#setting-a-grouping-label}

기본적으로 그룹화의 라벨은 속성을 기반으로 생성됩니다. `Group` 객체의 `label()` 메서드를 사용하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('author.name')
                ->label('Author name'),
        ]);
}
```

## 그룹 타이틀 설정하기 {#setting-a-group-title}

기본적으로 그룹의 타이틀은 속성의 값이 됩니다. `Group` 객체의 `getTitleFromRecordUsing()` 메서드에서 새로운 타이틀을 반환하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->getTitleFromRecordUsing(fn (Post $record): string => ucfirst($record->status->getLabel())),
        ]);
}
```

### 타이틀 라벨 접두사 비활성화하기 {#disabling-the-title-label-prefix}

기본적으로 타이틀 앞에는 그룹의 라벨이 접두사로 붙습니다. 이 접두사를 비활성화하려면 `titlePrefixedWithLabel(false)` 메서드를 사용하세요:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->titlePrefixedWithLabel(false),
        ]);
}
```

## 그룹 설명 설정하기 {#setting-a-group-description}

그룹에 대한 설명을 설정할 수도 있으며, 이는 그룹 타이틀 아래에 표시됩니다. 이를 위해 `Group` 객체의 `getDescriptionFromRecordUsing()` 메서드를 사용하세요:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->getDescriptionFromRecordUsing(fn (Post $record): string => $record->status->getDescription()),
        ]);
}
```

<AutoScreenshot name="tables/grouping-descriptions" alt="그룹 설명이 있는 테이블" version="3.x" />

## 그룹 키 설정하기 {#setting-a-group-key}

기본적으로 그룹의 키는 속성의 값이 됩니다. 이는 [타이틀](#setting-a-group-title) 대신 해당 그룹의 원시 식별자로 내부적으로 사용됩니다. `Group` 객체의 `getKeyFromRecordUsing()` 메서드에서 새로운 키를 반환하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->getKeyFromRecordUsing(fn (Post $record): string => $record->status->value),
        ]);
}
```

## 날짜 그룹 {#date-groups}

날짜-시간 컬럼을 그룹으로 사용할 때, 시간은 무시하고 날짜만으로 그룹화하고 싶을 수 있습니다. 이를 위해 `Group` 객체의 `date()` 메서드를 사용하세요:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('created_at')
                ->date(),
        ]);
}
```

## 접을 수 있는 그룹 {#collapsible-groups}

그룹 내의 행을 그룹 타이틀 아래로 접을 수 있도록 허용할 수 있습니다. 이를 활성화하려면 `collapsible()` 메서드가 있는 `Group` 객체를 사용하세요:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('author.name')
                ->collapsible(),
        ]);
}
```

## 그룹 요약하기 {#summarising-groups}

[요약](summaries)을 그룹과 함께 사용하여 그룹 내 레코드의 요약을 표시할 수 있습니다. 그룹화된 테이블에서 컬럼에 요약자를 추가하면 자동으로 동작합니다.

### 그룹화된 행을 숨기고 요약만 표시하기 {#hiding-the-grouped-rows-and-showing-the-summary-only}

`groupsOnly()` 메서드를 사용하여 그룹 내의 행을 숨기고 각 그룹의 요약만 표시할 수 있습니다. 이는 다양한 리포팅 시나리오에서 매우 유용합니다.

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('views_count')
                ->summarize(Sum::make()),
            TextColumn::make('likes_count')
                ->summarize(Sum::make()),
        ])
        ->defaultGroup('category')
        ->groupsOnly();
}
```

## Eloquent 쿼리 정렬 동작 커스터마이즈하기 {#customizing-the-eloquent-query-ordering-behavior}

일부 기능은 테이블이 그룹에 따라 Eloquent 쿼리를 정렬할 수 있어야 합니다. `Group` 객체의 `orderQueryUsing()` 메서드를 사용하여 이 동작을 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->orderQueryUsing(fn (Builder $query, string $direction) => $query->orderBy('status', $direction)),
        ]);
}
```

## Eloquent 쿼리 스코프 동작 커스터마이즈하기 {#customizing-the-eloquent-query-scoping-behavior}

일부 기능은 테이블이 그룹에 따라 Eloquent 쿼리를 스코프할 수 있어야 합니다. `Group` 객체의 `scopeQueryByKeyUsing()` 메서드를 사용하여 이 동작을 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Grouping\Group;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->scopeQueryByKeyUsing(fn (Builder $query, string $key) => $query->where('status', $key)),
        ]);
}
```

## Eloquent 쿼리 그룹화 동작 커스터마이즈하기 {#customizing-the-eloquent-query-grouping-behavior}

일부 기능은 테이블이 그룹에 따라 Eloquent 쿼리를 그룹화할 수 있어야 합니다. `Group` 객체의 `groupQueryUsing()` 메서드를 사용하여 이 동작을 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Grouping\Group;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->groups([
            Group::make('status')
                ->groupQueryUsing(fn (Builder $query) => $query->groupBy('status')),
        ]);
}
```

## 그룹 드롭다운 트리거 액션 커스터마이즈하기 {#customizing-the-groups-dropdown-trigger-action}

그룹 드롭다운 트리거 버튼을 커스터마이즈하려면, 클로저를 전달하여 액션을 반환하는 `groupRecordsTriggerAction()` 메서드를 사용할 수 있습니다. [액션 트리거 버튼 커스터마이즈](../actions/trigger-button)에 사용할 수 있는 모든 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            // ...
        ])
        ->groupRecordsTriggerAction(
            fn (Action $action) => $action
                ->button()
                ->label('Group records'),
        );
}
```

## 데스크톱에서 그룹화 설정 드롭다운 사용하기 {#using-the-grouping-settings-dropdown-on-desktop}

기본적으로 그룹화 설정 드롭다운은 모바일 기기에서만 표시됩니다. 데스크톱 기기에서는 그룹화 설정이 테이블 헤더에 있습니다. `groupingSettingsInDropdownOnDesktop()` 메서드를 사용하여 데스크톱에서도 드롭다운을 활성화할 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groups([
            // ...
        ])
        ->groupingSettingsInDropdownOnDesktop();
}
```

## 그룹화 설정 숨기기 {#hiding-the-grouping-settings}

`groupingSettingsHidden()` 메서드를 사용하여 그룹화 설정 인터페이스를 숨길 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
		->defaultGroup('status')
        ->groupingSettingsHidden();
}
```

### 그룹화 방향 설정만 숨기기 {#hiding-the-grouping-direction-setting-only}

`groupingDirectionSettingHidden()` 메서드를 사용하여 그룹화 방향 선택 인터페이스만 숨길 수 있습니다:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
		->defaultGroup('status')
        ->groupingDirectionSettingHidden();
}
```
