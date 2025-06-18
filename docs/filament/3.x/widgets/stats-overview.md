---
title: StatsOverviewWidget
---
# [위젯] StatsOverviewWidget
## 개요 {#overview}

Filament에는 "통계 개요" 위젯 템플릿이 내장되어 있어, 커스텀 뷰를 작성하지 않고도 하나의 위젯에서 여러 통계를 표시할 수 있습니다.

다음 명령어로 위젯을 생성하세요:

```bash
php artisan make:filament-widget StatsOverview --stats-overview
```

이 명령어는 새로운 `StatsOverview.php` 파일을 생성합니다. 파일을 열고, `getStats()` 메서드에서 `Stat` 인스턴스를 반환하세요:

```php
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Unique views', '192.1k'),
            Stat::make('Bounce rate', '21%'),
            Stat::make('Average time on page', '3:12'),
        ];
    }
}
```

이제 대시보드에서 위젯을 확인해보세요.

## 통계에 설명과 아이콘 추가하기 {#adding-a-description-and-icon-to-a-stat}

추가 정보를 제공하기 위해 `description()`을 추가할 수 있으며, `descriptionIcon()`도 함께 사용할 수 있습니다:

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Unique views', '192.1k')
            ->description('32k 증가')
            ->descriptionIcon('heroicon-m-arrow-trending-up'),
        Stat::make('Bounce rate', '21%')
            ->description('7% 감소')
            ->descriptionIcon('heroicon-m-arrow-trending-down'),
        Stat::make('Average time on page', '3:12')
            ->description('3% 증가')
            ->descriptionIcon('heroicon-m-arrow-trending-up'),
    ];
}
```

`descriptionIcon()` 메서드는 두 번째 매개변수를 받아 아이콘을 설명 뒤가 아니라 앞에 배치할 수도 있습니다:

```php
use Filament\Support\Enums\IconPosition;
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Unique views', '192.1k')
    ->description('32k 증가')
    ->descriptionIcon('heroicon-m-arrow-trending-up', IconPosition::Before)
```

## 통계의 색상 변경하기 {#changing-the-color-of-the-stat}

통계에 `color()`를 지정할 수도 있습니다 (`danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나):

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Unique views', '192.1k')
            ->description('32k 증가')
            ->descriptionIcon('heroicon-m-arrow-trending-up')
            ->color('success'),
        Stat::make('Bounce rate', '21%')
            ->description('7% 증가')
            ->descriptionIcon('heroicon-m-arrow-trending-down')
            ->color('danger'),
        Stat::make('Average time on page', '3:12')
            ->description('3% 증가')
            ->descriptionIcon('heroicon-m-arrow-trending-up')
            ->color('success'),
    ];
}
```

## 통계에 추가 HTML 속성 추가하기 {#adding-extra-html-attributes-to-a-stat}

`extraAttributes()`를 사용하여 통계에 추가 HTML 속성을 전달할 수도 있습니다:

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Processed', '192.1k')
            ->color('success')
            ->extraAttributes([
                'class' => 'cursor-pointer',
                'wire:click' => "\$dispatch('setStatusFilter', { filter: 'processed' })",
            ]),
        // ...
    ];
}
```

이 예시에서는 `$dispatch()`의 `$`를 의도적으로 이스케이프 처리하고 있습니다. 이는 PHP 변수로 인식되는 것이 아니라 HTML에 직접 전달되어야 하기 때문입니다.

## 통계에 차트 추가하기 {#adding-a-chart-to-a-stat}

각 통계에 `chart()`를 추가하거나 체이닝하여 과거 데이터를 제공할 수도 있습니다. `chart()` 메서드는 플롯할 데이터 포인트의 배열을 인수로 받습니다:

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Unique views', '192.1k')
            ->description('32k 증가')
            ->descriptionIcon('heroicon-m-arrow-trending-up')
            ->chart([7, 2, 10, 3, 15, 4, 17])
            ->color('success'),
        // ...
    ];
}
```

## 실시간 통계 업데이트(폴링) {#live-updating-stats-polling}

기본적으로, StatsOverviewWidget은 5초마다 데이터를 새로고침합니다.

이 값을 변경하려면 클래스에서 `$pollingInterval` 속성을 새로운 간격으로 오버라이드하면 됩니다:

```php
protected static ?string $pollingInterval = '10s';
```

또는, 폴링을 완전히 비활성화할 수도 있습니다:

```php
protected static ?string $pollingInterval = null;
```

## 지연 로딩 비활성화 {#disabling-lazy-loading}

기본적으로 위젯은 지연 로딩(lazy-loaded)됩니다. 이는 위젯이 페이지에 표시될 때만 로드된다는 의미입니다.

이 동작을 비활성화하려면, 위젯 클래스에서 `$isLazy` 속성을 오버라이드하면 됩니다:

```php
protected static bool $isLazy = false;
```

## 제목과 설명 추가하기 {#adding-a-heading-and-description}

위젯 위에 제목과 설명 텍스트를 추가하려면 `$heading`과 `$description` 속성을 오버라이드하면 됩니다:

```php
protected ?string $heading = 'Analytics';

protected ?string $description = 'An overview of some analytics.';
```

제목이나 설명 텍스트를 동적으로 생성해야 하는 경우, `getHeading()`과 `getDescription()` 메서드를 오버라이드할 수도 있습니다:

```php
protected function getHeading(): ?string
{
    return 'Analytics';
}

protected function getDescription(): ?string
{
    return 'An overview of some analytics.';
}
```
