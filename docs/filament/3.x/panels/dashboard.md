---
title: 대시보드
---
# [패널] 대시보드
## 개요 {#overview}

Filament을 사용하면 "위젯"으로 구성된 동적 대시보드를 매우 쉽게 만들 수 있습니다.

다음 문서에서는 이러한 위젯을 사용하여 패널에서 대시보드를 조립하는 방법을 설명합니다.

## 사용 가능한 위젯 {#available-widgets}

Filament에는 다음과 같은 위젯이 기본 제공됩니다:

- [통계 개요](../widgets/stats-overview) 위젯은 주로 숫자 데이터를 한 줄의 통계로 표시합니다.
- [차트](../widgets/charts) 위젯은 숫자 데이터를 시각적인 차트로 보여줍니다.
- [테이블](#table-widgets) 위젯은 대시보드에 [테이블](../tables/getting-started)을 표시합니다.

또한 [사용자 정의 위젯을 직접 생성](#custom-widgets)하여 Filament의 기본 제공 위젯과 일관된 디자인을 적용할 수도 있습니다.

## 위젯 정렬 {#sorting-widgets}

각 위젯 클래스에는 페이지에서 다른 위젯과의 상대적인 순서를 변경하는 데 사용할 수 있는 `$sort` 속성이 있습니다:

```php
protected static ?int $sort = 2;
```

## 위젯 너비 커스터마이징 {#customizing-widget-width}

`$columnSpan` 속성을 사용하여 위젯의 너비를 커스터마이징할 수 있습니다. 1에서 12 사이의 숫자를 사용하여 위젯이 차지할 열의 개수를 지정하거나, `full`을 사용하여 페이지의 전체 너비를 차지하도록 할 수 있습니다:

```php
protected int | string | array $columnSpan = 'full';
```

### 반응형 위젯 너비 {#responsive-widget-widths}

브라우저의 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에 따라 위젯의 너비를 변경하고 싶을 수 있습니다. 이를 위해 각 브레이크포인트에서 위젯이 차지해야 하는 열의 수를 포함하는 배열을 사용할 수 있습니다:

```php
protected int | string | array $columnSpan = [
    'md' => 2,
    'xl' => 3,
];
```

이는 [반응형 위젯 그리드](#responsive-widgets-grid)를 사용할 때 특히 유용합니다.

## 위젯 그리드 커스터마이징하기 {#customizing-the-widgets-grid}

위젯을 표시할 때 사용되는 그리드 열의 수를 변경할 수 있습니다.

먼저, [기존 대시보드 페이지를 교체](#customizing-the-dashboard-page)해야 합니다.

이제 새로 생성된 `app/Filament/Pages/Dashboard.php` 파일에서, `getColumns()` 메서드를 오버라이드하여 사용할 그리드 열의 수를 반환할 수 있습니다:

```php
public function getColumns(): int | string | array
{
    return 2;
}
```

### 반응형 위젯 그리드 {#responsive-widgets-grid}

브라우저의 반응형 [브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview)에 따라 위젯 그리드 열의 개수를 변경하고 싶을 수 있습니다. 각 브레이크포인트에서 사용해야 하는 열의 개수를 포함하는 배열을 사용하여 이를 설정할 수 있습니다:

```php
public function getColumns(): int | string | array
{
    return [
        'md' => 4,
        'xl' => 5,
    ];
}
```

이는 [반응형 위젯 너비](#responsive-widget-widths)와 잘 어울립니다.

## 위젯을 조건부로 숨기기 {#conditionally-hiding-widgets}

위젯에서 static `canView()` 메서드를 오버라이드하여 조건부로 숨길 수 있습니다:

```php
public static function canView(): bool
{
    return auth()->user()->isAdmin();
}
```

## 테이블 위젯 {#table-widgets}

대시보드에 테이블을 쉽게 추가할 수 있습니다. 다음 명령어로 위젯을 생성하세요:

```bash
php artisan make:filament-widget LatestOrders --table
```

이제 위젯 파일을 수정하여 [테이블을 커스터마이즈](../tables/getting-started)할 수 있습니다.

## 커스텀 위젯 {#custom-widgets}

`BlogPostsOverview` 위젯을 만들기 시작하려면 다음 명령어를 실행하세요:

```bash
php artisan make:filament-widget BlogPostsOverview
```

이 명령어는 Filament 디렉터리의 `/Widgets` 디렉터리에 위젯 클래스 파일 하나와, Filament 뷰 디렉터리의 `/widgets` 디렉터리에 뷰 파일 하나를 생성합니다.

## 위젯 데이터 필터링 {#filtering-widget-data}

사용자가 모든 위젯에 표시되는 데이터를 필터링할 수 있도록 대시보드에 폼을 추가할 수 있습니다. 필터가 업데이트되면, 위젯들은 새로운 데이터로 다시 로드됩니다.

먼저, [기존 대시보드 페이지를 교체](#customizing-the-dashboard-page)해야 합니다.

이제, 새로 만든 `app/Filament/Pages/Dashboard.php` 파일에서 `HasFiltersForm` 트레이트를 추가하고, `filtersForm()` 메서드를 만들어 폼 컴포넌트를 반환할 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    public function filtersForm(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->schema([
                        DatePicker::make('startDate'),
                        DatePicker::make('endDate'),
                        // ...
                    ])
                    ->columns(3),
            ]);
    }
}
```

필터에서 데이터를 받아야 하는 위젯 클래스에서는 `InteractsWithPageFilters` 트레이트를 추가해야 하며, 이를 통해 `$this->filters` 속성을 사용해 필터 폼의 원시 데이터에 접근할 수 있습니다:

```php
use App\Models\BlogPost;
use Carbon\CarbonImmutable;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Illuminate\Database\Eloquent\Builder;

class BlogPostsOverview extends StatsOverviewWidget
{
    use InteractsWithPageFilters;

    public function getStats(): array
    {
        $startDate = $this->filters['startDate'] ?? null;
        $endDate = $this->filters['endDate'] ?? null;

        return [
            StatsOverviewWidget\Stat::make(
                label: 'Total posts',
                value: BlogPost::query()
                    ->when($startDate, fn (Builder $query) => $query->whereDate('created_at', '>=', $startDate))
                    ->when($endDate, fn (Builder $query) => $query->whereDate('created_at', '<=', $endDate))
                    ->count(),
            ),
            // ...
        ];
    }
}
```

`$this->filters` 배열은 항상 현재 폼 데이터를 반영합니다. 이 데이터는 실시간으로 제공되며 데이터베이스 쿼리 이외의 용도로 사용되지 않으므로, 검증되지 않는다는 점에 유의하세요. 데이터를 사용하기 전에 반드시 유효한지 확인해야 합니다. 이 예시에서는 쿼리에서 시작 날짜가 설정되어 있는지 확인한 후 사용합니다.

### 액션 모달을 사용한 위젯 데이터 필터링 {#filtering-widget-data-using-an-action-modal}

또 다른 방법으로, 필터 폼 대신 액션 모달을 사용할 수 있습니다. 이 모달은 페이지 헤더의 버튼을 클릭하여 열 수 있습니다. 이 방법을 사용하면 여러 가지 이점이 있습니다:

- 필터 폼이 항상 보이지 않으므로, 위젯을 위해 페이지의 전체 높이를 사용할 수 있습니다.
- 사용자가 "적용" 버튼을 클릭할 때까지 필터가 위젯을 업데이트하지 않으므로, 사용자가 준비될 때까지 위젯이 다시 로드되지 않습니다. 위젯을 불러오는 데 비용이 많이 드는 경우 성능이 향상될 수 있습니다.
- 필터 폼에서 유효성 검사를 수행할 수 있으므로, 위젯은 데이터가 유효하다는 사실에 의존할 수 있습니다. 사용자는 유효하지 않으면 폼을 제출할 수 없습니다. 모달을 취소하면 사용자의 변경 사항이 폐기됩니다.

필터 폼 대신 액션 모달을 사용하려면, `HasFiltersForm` 대신 `HasFiltersAction` 트레이트를 사용하면 됩니다. 그런 다음, `getHeaderActions()`에서 `FilterAction` 클래스를 액션으로 등록합니다:

```php
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Form;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Actions\FilterAction;
use Filament\Pages\Dashboard\Concerns\HasFiltersAction;

class Dashboard extends BaseDashboard
{
    use HasFiltersAction;
    
    protected function getHeaderActions(): array
    {
        return [
            FilterAction::make()
                ->form([
                    DatePicker::make('startDate'),
                    DatePicker::make('endDate'),
                    // ...
                ]),
        ];
    }
}
```

필터 액션에서 데이터를 처리하는 방법은 필터 헤더 폼에서 데이터를 처리하는 방법과 동일하지만, 데이터가 위젯에 전달되기 전에 유효성 검사가 수행된다는 점이 다릅니다. `InteractsWithPageFilters` 트레이트는 여전히 적용됩니다.

### 위젯 필터를 사용자의 세션에 유지하기 {#persisting-widget-filters-in-the-users-session}

기본적으로, 대시보드에 적용된 필터는 페이지를 새로고침해도 사용자의 세션에 유지됩니다. 이를 비활성화하려면, 대시보드 페이지 클래스에서 `$persistsFiltersInSession` 속성을 오버라이드하세요:

```php
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    protected bool $persistsFiltersInSession = false;
}
```

또는, 대시보드 페이지 클래스에서 `persistsFiltersInSession()` 메서드를 오버라이드할 수도 있습니다:

```php
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    public function persistsFiltersInSession(): bool
    {
        return false;
    }
}
```

## 기본 위젯 비활성화 {#disabling-the-default-widgets}

기본적으로 두 개의 위젯이 대시보드에 표시됩니다. 이러한 위젯들은 [설정](configuration)의 `widgets()` 배열을 업데이트하여 비활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->widgets([]);
}
```

## 대시보드 페이지 커스터마이징 {#customizing-the-dashboard-page}

예를 들어 [위젯 열의 수를 변경](#customizing-widget-width)하는 등 대시보드 클래스를 커스터마이즈하고 싶다면, `app/Filament/Pages/Dashboard.php`에 새 파일을 생성하세요:

```php
<?php

namespace App\Filament\Pages;

class Dashboard extends \Filament\Pages\Dashboard
{
    // ...
}
```

마지막으로, [설정 파일](configuration)에서 기존 `Dashboard` 클래스를 제거하세요:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->pages([]);
}
```

### 여러 대시보드 생성하기 {#creating-multiple-dashboards}

여러 개의 대시보드를 만들고 싶다면, [위에서 설명한 과정](#customizing-the-dashboard-page)을 반복하면 됩니다. `Dashboard` 클래스를 확장하는 새로운 페이지를 생성하면 원하는 만큼 대시보드를 만들 수 있습니다.

추가 대시보드의 URL 경로도 정의해야 하며, 그렇지 않으면 기본적으로 `/`에 위치하게 됩니다:

```php
protected static string $routePath = 'finance';
```

또한 `$title` 속성을 오버라이드하여 대시보드의 제목을 커스터마이즈할 수도 있습니다:

```php
protected static ?string $title = 'Finance dashboard';
```

사용자에게 표시되는 기본 대시보드는 정의된 네비게이션 정렬 순서에 따라 [`canAccess()` 메서드](pages#authorization)로 접근 권한이 있는 첫 번째 대시보드입니다.

대시보드의 기본 정렬 순서는 `-2`입니다. 커스텀 대시보드의 정렬 순서는 `$navigationSort`로 제어할 수 있습니다:

```php
protected static ?int $navigationSort = 15;
```
