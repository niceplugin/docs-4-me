---
title: 레코드 보기
---
# [패널.리소스] 레코드 보기

## View 페이지가 포함된 리소스 생성하기 {#creating-a-resource-with-a-view-page}

View 페이지가 포함된 새로운 리소스를 생성하려면 `--view` 플래그를 사용할 수 있습니다:

```bash
php artisan make:filament-resource User --view
```

## 비활성화된 폼 대신 인포리스트 사용하기 {#using-an-infolist-instead-of-a-disabled-form}

<LaracastsBanner
    title="Infolists"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈를 시청하세요 - Filament 리소스에 인포리스트를 추가하는 기본 방법을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/12"
    series="rapid-laravel-development"
/>

기본적으로 View 페이지는 레코드의 데이터를 비활성화된 폼으로 표시합니다. 레코드의 데이터를 "인포리스트"로 표시하고 싶다면, 리소스 클래스에 `infolist()` 메서드를 정의할 수 있습니다:

```php
use Filament\Infolists;
use Filament\Infolists\Infolist;

public static function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            Infolists\Components\TextEntry::make('name'),
            Infolists\Components\TextEntry::make('email'),
            Infolists\Components\TextEntry::make('notes')
                ->columnSpanFull(),
        ]);
}
```

`schema()` 메서드는 인포리스트의 구조를 정의하는 데 사용됩니다. 이는 [엔트리](../../infolists/entries/getting-started#available-entries)와 [레이아웃 컴포넌트](../../infolists/layout/getting-started#available-layout-components)로 이루어진 배열이며, 인포리스트에 나타날 순서대로 나열합니다.

Filament로 인포리스트를 만드는 방법에 대한 [가이드](../../infolists/getting-started)는 Infolists 문서를 참고하세요.

## 기존 리소스에 View 페이지 추가하기 {#adding-a-view-page-to-an-existing-resource}

기존 리소스에 View 페이지를 추가하려면, 리소스의 `Pages` 디렉터리에 새 페이지를 생성하세요:

```bash
php artisan make:filament-page ViewUser --resource=UserResource --type=ViewRecord
```

이 새 페이지를 리소스의 `getPages()` 메서드에 등록해야 합니다:

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListUsers::route('/'),
        'create' => Pages\CreateUser::route('/create'),
        'view' => Pages\ViewUser::route('/{record}'),
        'edit' => Pages\EditUser::route('/{record}/edit'),
    ];
}
```

## 모달에서 레코드 보기 {#viewing-records-in-modals}

리소스가 단순하다면, [View 페이지](viewing-records) 대신 모달에서 레코드를 보고 싶을 수 있습니다. 이 경우, [view 페이지를 삭제](getting-started#deleting-resource-pages)하면 됩니다.

리소스에 `ViewAction`이 포함되어 있지 않다면, `$table->actions()` 배열에 추가할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public static function table(Table $table): Table
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

## 폼에 데이터를 채우기 전에 데이터 커스터마이징하기 {#customizing-data-before-filling-the-form}

레코드의 데이터를 폼에 채우기 전에 수정하고 싶을 수 있습니다. 이를 위해 View 페이지 클래스에 `mutateFormDataBeforeFill()` 메서드를 정의하여 `$data` 배열을 수정하고, 수정된 버전을 폼에 채우기 전에 반환할 수 있습니다:

```php
protected function mutateFormDataBeforeFill(array $data): array
{
    $data['user_id'] = auth()->id();

    return $data;
}
```

또는, 모달 액션에서 레코드를 보는 경우 [액션 문서](../../actions/prebuilt-actions/view#customizing-data-before-filling-the-form)를 참고하세요.

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하면 페이지의 라이프사이클 내 여러 시점에 코드를 실행할 수 있습니다. 예를 들어 폼이 채워지기 전 등입니다. 훅을 설정하려면 View 페이지 클래스에 훅 이름의 protected 메서드를 생성하세요:

```php
use Filament\Resources\Pages\ViewRecord;

class ViewUser extends ViewRecord
{
    // ...

    protected function beforeFill(): void
    {
        // 비활성화된 폼 필드가 데이터베이스에서 채워지기 전에 실행됩니다. 인포리스트를 사용하는 페이지에서는 실행되지 않습니다.
    }

    protected function afterFill(): void
    {
        // 비활성화된 폼 필드가 데이터베이스에서 채워진 후에 실행됩니다. 인포리스트를 사용하는 페이지에서는 실행되지 않습니다.
    }
}
```

## 권한 부여 {#authorization}

권한 부여를 위해 Filament는 앱에 등록된 [모델 정책](/laravel/12.x/authorization#creating-policies)을 따릅니다.

모델 정책의 `view()` 메서드가 `true`를 반환하면 사용자는 View 페이지에 접근할 수 있습니다.

## 또 다른 View 페이지 생성하기 {#creating-another-view-page}

하나의 View 페이지로는 많은 정보를 탐색하기에 충분하지 않을 수 있습니다. 원하는 만큼 리소스에 여러 View 페이지를 생성할 수 있습니다. 이는 [리소스 서브 내비게이션](getting-started#resource-sub-navigation)을 사용할 때 특히 유용하며, 서로 다른 View 페이지 간에 쉽게 전환할 수 있습니다.

View 페이지를 생성하려면 `make:filament-page` 명령어를 사용하세요:

```bash
php artisan make:filament-page ViewCustomerContact --resource=CustomerResource --type=ViewRecord
```

이 새 페이지를 리소스의 `getPages()` 메서드에 등록해야 합니다:

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListCustomers::route('/'),
        'create' => Pages\CreateCustomer::route('/create'),
        'view' => Pages\ViewCustomer::route('/{record}'),
        'view-contact' => Pages\ViewCustomerContact::route('/{record}/contact'),
        'edit' => Pages\EditCustomer::route('/{record}/edit'),
    ];
}
```

이제 이 페이지에 대해 `infolist()` 또는 `form()`을 정의할 수 있으며, 이는 메인 View 페이지에 없는 다른 컴포넌트를 포함할 수 있습니다:

```php
use Filament\Infolists\Infolist;

public function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            // ...
        ]);
}
```

## 특정 View 페이지에 대한 관계 매니저 커스터마이징하기 {#customizing-relation-managers-for-a-specific-view-page}

`getAllRelationManagers()` 메서드를 정의하여 어떤 관계 매니저가 View 페이지에 나타날지 지정할 수 있습니다:

```php
protected function getAllRelationManagers(): array
{
    return [
        CustomerAddressesRelationManager::class,
        CustomerContactsRelationManager::class,
    ];
}
```

이는 [여러 View 페이지](#creating-another-view-page)가 있고 각 페이지마다 다른 관계 매니저가 필요할 때 유용합니다:
```php

// ViewCustomer.php
protected function getAllRelationManagers(): array
{
    return [
        RelationManagers\OrdersRelationManager::class,
        RelationManagers\SubscriptionsRelationManager::class,
    ];
}
// ViewCustomerContact.php 

protected function getAllRelationManagers(): array
{
    return [
        RelationManagers\ContactsRelationManager::class,
        RelationManagers\AddressesRelationManager::class,
    ];
}
```
`getAllRelationManagers()`가 정의되어 있지 않으면, 리소스에 정의된 관계 매니저가 사용됩니다.



## 리소스 서브 내비게이션에 View 페이지 추가하기 {#adding-view-pages-to-resource-sub-navigation}

[리소스 서브 내비게이션](getting-started#resource-sub-navigation)을 사용 중이라면, 리소스의 `getRecordSubNavigation()`에서 이 페이지를 일반적으로 등록할 수 있습니다:

```php
use App\Filament\Resources\CustomerResource\Pages;
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        // ...
        Pages\ViewCustomerContact::class,
    ]);
}
```

## 커스텀 뷰 {#custom-view}

더 많은 커스터마이징이 필요하다면, 페이지 클래스의 static `$view` 프로퍼티를 앱의 커스텀 뷰로 오버라이드할 수 있습니다:

```php
protected static string $view = 'filament.resources.users.pages.view-user';
```

이는 `resources/views/filament/resources/users/pages/view-user.blade.php`에 뷰를 생성했다고 가정합니다.

해당 뷰에 들어갈 수 있는 기본 예시는 다음과 같습니다:

```blade
<x-filament-panels::page>
    @if ($this->hasInfolist())
        {{ $this->infolist }}
    @else
        {{ $this->form }}
    @endif

    @if (count($relationManagers = $this->getRelationManagers()))
        <x-filament-panels::resources.relation-managers
            :active-manager="$this->activeRelationManager"
            :managers="$relationManagers"
            :owner-record="$record"
            :page-class="static::class"
        />
    @endif
</x-filament-panels::page>
```

기본 뷰에 포함된 모든 내용을 확인하려면, 프로젝트의 `vendor/filament/filament/resources/views/resources/pages/view-record.blade.php` 파일을 확인할 수 있습니다.
