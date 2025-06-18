---
title: 비어 있는 상태
---
# [테이블] 비어 있는 상태

## 개요 {#overview}

테이블에 행이 없을 때 "빈 상태(empty state)"가 렌더링됩니다.

<AutoScreenshot name="tables/empty-state" alt="빈 상태의 테이블" version="3.x" />

## 비어 있는 상태의 헤딩 설정하기 {#setting-the-empty-state-heading}

비어 있는 상태의 헤딩을 커스터마이즈하려면 `emptyStateHeading()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateHeading('아직 게시물이 없습니다');
}
```

<AutoScreenshot name="tables/empty-state-heading" alt="커스터마이즈된 비어 있는 상태 헤딩이 있는 테이블" version="3.x" />

## 비어 있는 상태 설명 설정하기 {#setting-the-empty-state-description}

비어 있는 상태의 설명을 사용자 정의하려면 `emptyStateDescription()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateDescription('첫 번째 게시글을 작성하면 여기에 표시됩니다.');
}
```

<AutoScreenshot name="tables/empty-state-description" alt="비어 있는 상태 설명이 있는 테이블" version="3.x" />

## 비어 있는 상태 아이콘 설정하기 {#setting-the-empty-state-icon}

비어 있는 상태의 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 커스터마이즈하려면 `emptyStateIcon()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateIcon('heroicon-o-bookmark');
}
```

<AutoScreenshot name="tables/empty-state-icon" alt="커스텀된 비어 있는 상태 아이콘이 있는 테이블" version="3.x" />

## 비어 있는 상태에 액션 추가하기 {#adding-empty-state-actions}

사용자에게 조치를 취하도록 유도하기 위해 비어 있는 상태에 [액션](actions)을 추가할 수 있습니다. 이 액션들은 `emptyStateActions()` 메서드에 전달합니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyStateActions([
            Action::make('create')
                ->label('게시글 생성')
                ->url(route('posts.create'))
                ->icon('heroicon-m-plus')
                ->button(),
        ]);
}
```

<AutoScreenshot name="tables/empty-state-actions" alt="비어 있는 상태 액션이 있는 테이블" version="3.x" />

## 커스텀 빈 상태 뷰 사용하기 {#using-a-custom-empty-state-view}

`emptyState()` 메서드에 완전히 커스텀한 빈 상태 뷰를 전달하여 사용할 수 있습니다:

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->emptyState(view('tables.posts.empty-state'));
}
```
