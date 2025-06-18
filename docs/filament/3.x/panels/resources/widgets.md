---
title: 위젯
---
# [패널.리소스] 위젯

## 개요 {#overview}

<LaracastsBanner
    title="위젯"
    description="Laracasts에서 Filament을 활용한 빠른 Laravel 개발 시리즈를 시청하세요. 이 시리즈는 Filament 리소스에 위젯을 추가하는 기본 방법을 알려줍니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/15"
    series="rapid-laravel-development"
/>

Filament를 사용하면 페이지 내에서 헤더 아래, 푸터 위에 위젯을 표시할 수 있습니다.

기존의 [대시보드 위젯](../dashboard)을 사용할 수도 있고, 리소스에 맞는 위젯을 직접 만들 수도 있습니다.

## 리소스 위젯 생성하기 {#creating-a-resource-widget}

리소스 위젯을 만들기 시작하려면 다음 명령어를 실행하세요:

```bash
php artisan make:filament-widget CustomerOverview --resource=CustomerResource
```

이 명령어는 `app/Filament/Resources/CustomerResource/Widgets` 디렉터리에 위젯 클래스 파일을, `resources/views/filament/resources/customer-resource/widgets` 디렉터리에 뷰 파일을 각각 생성합니다.

새로 만든 위젯을 리소스의 `getWidgets()` 메서드에 등록해야 합니다:

```php
public static function getWidgets(): array
{
    return [
        CustomerResource\Widgets\CustomerOverview::class,
    ];
}
```

위젯을 만드는 방법과 커스터마이즈하는 방법을 더 알고 싶다면 [대시보드](../dashboard) 문서 섹션을 참고하세요.

## 리소스 페이지에 위젯 표시하기 {#displaying-a-widget-on-a-resource-page}

리소스 페이지에 위젯을 표시하려면 해당 페이지의 `getHeaderWidgets()` 또는 `getFooterWidgets()` 메서드를 사용하세요:

```php
<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;

class ListCustomers extends ListRecords
{
    public static string $resource = CustomerResource::class;

    protected function getHeaderWidgets(): array
    {
        return [
            CustomerResource\Widgets\CustomerOverview::class,
        ];
    }
}
```

`getHeaderWidgets()`는 페이지 콘텐츠 위에 표시할 위젯 배열을 반환하며, `getFooterWidgets()`는 아래에 표시됩니다.

위젯을 배치하는 그리드 열의 개수를 커스터마이즈하고 싶다면 [페이지 문서](../pages#customizing-the-widgets-grid)를 참고하세요.

## 위젯에서 현재 레코드에 접근하기 {#accessing-the-current-record-in-the-widget}

[Edit](editing-records) 또는 [View](viewing-records) 페이지에서 위젯을 사용하는 경우, 위젯 클래스에 `$record` 프로퍼티를 정의하여 현재 레코드에 접근할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

public ?Model $record = null;
```

## 위젯에서 페이지 테이블 데이터에 접근하기 {#accessing-page-table-data-in-the-widget}

[List](listing-records) 페이지에서 위젯을 사용하는 경우, 먼저 페이지 클래스에 `ExposesTableToWidgets` 트레이트를 추가하여 테이블 데이터에 접근할 수 있습니다:

```php
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ListRecords;

class ListProducts extends ListRecords
{
    use ExposesTableToWidgets;

    // ...
}
```

이제 위젯 클래스에서 `InteractsWithPageTable` 트레이트를 추가하고, `getTablePage()` 메서드에서 페이지 클래스의 이름을 반환해야 합니다:

```php
use App\Filament\Resources\ProductResource\Pages\ListProducts;
use Filament\Widgets\Concerns\InteractsWithPageTable;
use Filament\Widgets\Widget;

class ProductStats extends Widget
{
    use InteractsWithPageTable;

    protected function getTablePage(): string
    {
        return ListProducts::class;
    }

    // ...
}
```

이제 위젯 클래스에서 `$this->getPageTableQuery()` 메서드를 사용하여 테이블 데이터의 Eloquent 쿼리 빌더 인스턴스에 접근할 수 있습니다:

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Total Products', $this->getPageTableQuery()->count()),
```

또는, `$this->getPageTableRecords()` 메서드를 사용하여 현재 페이지의 레코드 컬렉션에 접근할 수도 있습니다:

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Total Products', $this->getPageTableRecords()->count()),
```

## 리소스 페이지에서 위젯에 속성 전달하기 {#passing-properties-to-widgets-on-resource-pages}

리소스 페이지에 위젯을 등록할 때, `make()` 메서드를 사용하여 [Livewire 속성](https://livewire.laravel.com/docs/properties) 배열을 전달할 수 있습니다:

```php
protected function getHeaderWidgets(): array
{
    return [
        CustomerResource\Widgets\CustomerOverview::make([
            'status' => 'active',
        ]),
    ];
}
```

이 속성 배열은 위젯 클래스의 [public Livewire 속성](https://livewire.laravel.com/docs/properties)으로 매핑됩니다:

```php
use Filament\Widgets\Widget;

class CustomerOverview extends Widget
{
    public string $status;

    // ...
}
```

이제 위젯 클래스에서 `$this->status`를 사용하여 `status`에 접근할 수 있습니다.
