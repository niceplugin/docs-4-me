---
title: 레코드 나열하기
---
# [패널.리소스] 레코드 목록 표시
## 탭을 사용하여 레코드 필터링하기 {#using-tabs-to-filter-the-records}

테이블 위에 탭을 추가하여, 미리 정의된 조건에 따라 레코드를 필터링할 수 있습니다. 각 탭은 테이블의 Eloquent 쿼리를 서로 다르게 범위 지정할 수 있습니다. 탭을 등록하려면, List 페이지 클래스에 `getTabs()` 메서드를 추가하고 `Tab` 객체의 배열을 반환하세요:

```php
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

public function getTabs(): array
{
    return [
        'all' => Tab::make(),
        'active' => Tab::make()
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', true)),
        'inactive' => Tab::make()
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', false)),
    ];
}
```

### 필터 탭 라벨 커스터마이징하기 {#customizing-the-filter-tab-labels}

배열의 키는 탭의 식별자로 사용되며, URL의 쿼리 문자열에 저장될 수 있습니다. 각 탭의 라벨도 키에서 생성되지만, 탭의 `make()` 메서드에 라벨을 전달하여 이를 오버라이드할 수 있습니다:

```php
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

public function getTabs(): array
{
    return [
        'all' => Tab::make('All customers'),
        'active' => Tab::make('Active customers')
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', true)),
        'inactive' => Tab::make('Inactive customers')
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', false)),
    ];
}
```

### 필터 탭에 아이콘 추가하기 {#adding-icons-to-filter-tabs}

[아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 탭의 `icon()` 메서드에 전달하여 탭에 아이콘을 추가할 수 있습니다:

```php
use use Filament\Resources\Components\Tab;

Tab::make()
    ->icon('heroicon-m-user-group')
```

또한, `iconPosition()` 메서드를 사용하여 아이콘의 위치를 라벨 앞이 아닌 뒤로 변경할 수 있습니다:

```php
use Filament\Support\Enums\IconPosition;

Tab::make()
    ->icon('heroicon-m-user-group')
    ->iconPosition(IconPosition::After)
```

### 필터 탭에 배지 추가하기 {#adding-badges-to-filter-tabs}

탭의 `badge()` 메서드에 문자열을 전달하여 탭에 배지를 추가할 수 있습니다:

```php
use Filament\Resources\Components\Tab;

Tab::make()
    ->badge(Customer::query()->where('active', true)->count())
```

#### 필터 탭 배지 색상 변경하기 {#changing-the-color-of-filter-tab-badges}

`badgeColor()` 메서드를 사용하여 배지의 색상을 변경할 수 있습니다:

```php
use Filament\Resources\Components\Tab;

Tab::make()
    ->badge(Customer::query()->where('active', true)->count())
    ->badgeColor('success')
```

### 필터 탭에 추가 속성 부여하기 {#adding-extra-attributes-to-filter-tabs}

`extraAttributes()`를 사용하여 필터 탭에 추가 HTML 속성을 전달할 수도 있습니다:

```php
use Filament\Resources\Components\Tab;

Tab::make()
    ->extraAttributes(['data-cy' => 'statement-confirmed-tab'])
```

### 기본 탭 커스터마이징하기 {#customizing-the-default-tab}

페이지가 로드될 때 선택되는 기본 탭을 커스터마이징하려면, `getDefaultActiveTab()` 메서드에서 탭의 배열 키를 반환하면 됩니다:

```php
use Filament\Resources\Components\Tab;

public function getTabs(): array
{
    return [
        'all' => Tab::make(),
        'active' => Tab::make(),
        'inactive' => Tab::make(),
    ];
}

public function getDefaultActiveTab(): string | int | null
{
    return 'active';
}
```

## 권한 부여 {#authorization}

권한 부여를 위해, Filament는 앱에 등록된 [모델 정책](/laravel/12.x/authorization#creating-policies)을 따릅니다.

모델 정책의 `viewAny()` 메서드가 `true`를 반환하면 사용자는 List 페이지에 접근할 수 있습니다.

`reorder()` 메서드는 [레코드 재정렬](#reordering-records)을 제어하는 데 사용됩니다.

## 테이블 Eloquent 쿼리 커스터마이징하기 {#customizing-the-table-eloquent-query}

[전체 리소스의 Eloquent 쿼리를 커스터마이징](getting-started#customizing-the-resource-eloquent-query)할 수 있지만, List 페이지 테이블에 대해 특정 수정을 할 수도 있습니다. 이를 위해 리소스의 `table()` 메서드에서 `modifyQueryUsing()` 메서드를 사용하세요:

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public static function table(Table $table): Table
{
    return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->withoutGlobalScopes());
}
```

## 커스텀 리스트 페이지 뷰 {#custom-list-page-view}

더 많은 커스터마이징을 위해, 페이지 클래스의 정적 `$view` 속성을 앱의 커스텀 뷰로 오버라이드할 수 있습니다:

```php
protected static string $view = 'filament.resources.users.pages.list-users';
```

이는 `resources/views/filament/resources/users/pages/list-users.blade.php`에 뷰를 생성했다고 가정합니다.

해당 뷰에 들어갈 수 있는 기본 예시는 다음과 같습니다:

```blade
<x-filament-panels::page>
    {{ $this->table }}
</x-filament-panels::page>
```

기본 뷰에 포함된 모든 내용을 확인하려면, 프로젝트의 `vendor/filament/filament/resources/views/resources/pages/list-records.blade.php` 파일을 확인할 수 있습니다.
