---
title: ChartWidget
---
# [위젯] ChartWidget
## 개요 {#overview}

Filament에는 실시간, 인터랙티브 차트를 표시할 수 있는 다양한 "차트" 위젯 템플릿이 기본 제공됩니다.

다음 명령어로 위젯을 생성하는 것부터 시작하세요:

```bash
php artisan make:filament-widget BlogPostsChart --chart
```

모든 차트에 사용되는 단일 `ChartWidget` 클래스가 있습니다. 차트의 유형은 `getType()` 메서드로 설정합니다. 이 예시에서는 해당 메서드가 문자열 `'line'`을 반환합니다.

`protected static ?string $heading` 변수는 차트를 설명하는 제목을 설정하는 데 사용됩니다. 제목을 동적으로 설정해야 한다면, `getHeading()` 메서드를 오버라이드할 수 있습니다.

`getData()` 메서드는 데이터셋과 라벨의 배열을 반환하는 데 사용됩니다. 각 데이터셋은 차트에 표시할 점들의 라벨이 붙은 배열이고, 각 라벨은 문자열입니다. 이 구조는 Filament가 차트를 렌더링할 때 사용하는 [Chart.js](https://www.chartjs.org/docs) 라이브러리와 동일합니다. 차트 유형에 따라 `getData()`에서 반환할 수 있는 다양한 가능성을 완전히 이해하려면 [Chart.js 문서](https://www.chartjs.org/docs)를 참고하세요.

```php
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class BlogPostsChart extends ChartWidget
{
    protected static ?string $heading = 'Blog Posts';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Blog posts created',
                    'data' => [0, 10, 5, 2, 21, 32, 45, 74, 65, 45, 77, 89],
                ],
            ],
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
```

이제 대시보드에서 위젯을 확인해보세요.

## 사용 가능한 차트 유형 {#available-chart-types}

아래는 확장할 수 있는 사용 가능한 ChartWidget 클래스와, `getData()`에서 반환할 내용을 참고할 수 있는 [Chart.js](https://www.chartjs.org/docs) 문서 페이지 목록입니다:

- 막대 차트(Bar chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/bar)
- 버블 차트(Bubble chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/bubble)
- 도넛 차트(Doughnut chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/doughnut)
- 선형 차트(Line chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/line)
- 파이 차트(Pie chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/doughnut.html#pie)
- 폴라 영역 차트(Polar area chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/polar)
- 레이더 차트(Radar chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/radar)
- 산점도 차트(Scatter chart) - [Chart.js 문서](https://www.chartjs.org/docs/latest/charts/scatter)

## 차트 색상 커스터마이징 {#customizing-the-chart-color}

차트 데이터의 색상은 `$color` 속성에 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나를 설정하여 커스터마이징할 수 있습니다:

```php
protected static string $color = 'info';
```

더 세밀하게 색상을 커스터마이징하거나, 여러 데이터셋에 여러 색상을 사용하고 싶다면, Chart.js의 [색상 옵션](https://www.chartjs.org/docs/latest/general/colors.html)을 데이터에 직접 사용할 수 있습니다:

```php
protected function getData(): array
{
    return [
        'datasets' => [
            [
                'label' => '블로그 게시글 생성 수',
                'data' => [0, 10, 5, 2, 21, 32, 45, 74, 65, 45, 77, 89],
                'backgroundColor' => '#36A2EB',
                'borderColor' => '#9BD0F5',
            ],
        ],
        'labels' => ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    ];
}
```

## Eloquent 모델에서 차트 데이터 생성하기 {#generating-chart-data-from-an-eloquent-model}

Eloquent 모델에서 차트 데이터를 생성하려면, Filament에서는 `flowframe/laravel-trend` 패키지 설치를 권장합니다. [문서](https://github.com/Flowframe/laravel-trend)를 참고하세요.

다음은 `laravel-trend` 패키지를 사용하여 모델에서 차트 데이터를 생성하는 예시입니다:

```php
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

protected function getData(): array
{
    $data = Trend::model(BlogPost::class)
        ->between(
            start: now()->startOfYear(),
            end: now()->endOfYear(),
        )
        ->perMonth()
        ->count();

    return [
        'datasets' => [
            [
                'label' => 'Blog posts',
                'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
            ],
        ],
        'labels' => $data->map(fn (TrendValue $value) => $value->date),
    ];
}
```

## 차트 데이터 필터링 {#filtering-chart-data}

차트에 표시되는 데이터를 변경하기 위해 차트 필터를 설정할 수 있습니다. 일반적으로, 이는 차트 데이터가 렌더링되는 기간을 변경하는 데 사용됩니다.

기본 필터 값을 설정하려면 `$filter` 속성을 지정하세요:

```php
public ?string $filter = 'today';
```

그런 다음, `getFilters()` 메서드를 정의하여 필터의 값과 라벨 배열을 반환하세요:

```php
protected function getFilters(): ?array
{
    return [
        'today' => '오늘',
        'week' => '지난주',
        'month' => '지난달',
        'year' => '올해',
    ];
}
```

`getData()` 메서드 내에서 활성 필터 값을 사용할 수 있습니다:

```php
protected function getData(): array
{
    $activeFilter = $this->filter;

    // ...
}
```

## 실시간 차트 데이터 업데이트(폴링) {#live-updating-chart-data-polling}

기본적으로 ChartWidget은 5초마다 데이터를 새로고침합니다.

이 값을 변경하려면 클래스에서 `$pollingInterval` 속성을 새로운 간격으로 오버라이드하면 됩니다:

```php
protected static ?string $pollingInterval = '10s';
```

또는 폴링을 완전히 비활성화할 수도 있습니다:

```php
protected static ?string $pollingInterval = null;
```

## 최대 차트 높이 설정하기 {#setting-a-maximum-chart-height}

차트가 너무 커지지 않도록 최대 높이를 설정할 수 있습니다. 이를 위해 `$maxHeight` 속성을 사용하세요:

```php
protected static ?string $maxHeight = '300px';
```

## 차트 설정 옵션 지정하기 {#setting-chart-configuration-options}

Chart.js 라이브러리에서 제공하는 다양한 설정 옵션을 제어하기 위해 차트 클래스에 `$options` 변수를 지정할 수 있습니다. 예를 들어, [범례(legend)](https://www.chartjs.org/docs/latest/configuration/legend.html)를 꺼서 라인 차트에서 표시하지 않도록 할 수 있습니다:

```php
protected static ?array $options = [
    'plugins' => [
        'legend' => [
            'display' => false,
        ],
    ],
];
```

또는, `getOptions()` 메서드를 오버라이드하여 동적으로 옵션 배열을 반환할 수도 있습니다:

```php
protected function getOptions(): array
{
    return [
        'plugins' => [
            'legend' => [
                'display' => false,
            ],
        ],
    ];
}
```

이러한 PHP 배열은 차트가 렌더링될 때 JSON 객체로 변환됩니다. 만약 이 메서드에서 원시 JavaScript를 반환하고 싶다면, `RawJs` 객체를 반환할 수 있습니다. 예를 들어, JavaScript 콜백 함수를 사용하고 싶을 때 유용합니다:

```php
use Filament\Support\RawJs;

protected function getOptions(): RawJs
{
    return RawJs::make(<<<JS
        {
            scales: {
                y: {
                    ticks: {
                        callback: (value) => '€' + value,
                    },
                },
            },
        }
    JS);
}
```

## 설명 추가하기 {#adding-a-description}

차트의 제목 아래에 설명을 추가하려면 `getDescription()` 메서드를 사용하면 됩니다:

```php
public function getDescription(): ?string
{
    return '월별로 게시된 블로그 게시물의 수입니다.';
}
```

## 지연 로딩 비활성화 {#disabling-lazy-loading}

기본적으로 위젯은 지연 로딩(lazy-loaded)됩니다. 이는 위젯이 페이지에 표시될 때만 로드된다는 의미입니다.

이 동작을 비활성화하려면, 위젯 클래스에서 `$isLazy` 속성을 오버라이드하면 됩니다:

```php
protected static bool $isLazy = true;
```

## 커스텀 Chart.js 플러그인 사용하기 {#using-custom-chartjs-plugins}

Chart.js는 강력한 플러그인 시스템을 제공하여 기능을 확장하고 커스텀 차트 동작을 만들 수 있습니다. 이 가이드는 ChartWidget에서 이를 사용하는 방법을 자세히 설명합니다.

### 1단계: NPM으로 플러그인 설치하기 {#step-1-install-the-plugin-with-npm}

먼저, 프로젝트에 NPM을 사용하여 플러그인을 설치합니다. 이 가이드에서는 [`chartjs-plugin-datalabels`](https://chartjs-plugin-datalabels.netlify.app/guide/getting-started.html#installation)를 설치합니다:

```bash
npm install chartjs-plugin-datalabels --save-dev
```

### 2단계: 플러그인을 가져오는 JavaScript 파일 생성하기 {#step-2-create-a-javascript-file-importing-the-plugin}

사용자 정의 플러그인을 정의할 새로운 JavaScript 파일을 생성하세요. 이 가이드에서는 해당 파일을 `filament-chart-js-plugins.js`라고 부르겠습니다. 플러그인을 가져와서 `window.filamentChartJsPlugins` 배열에 추가하세요:

```javascript
import ChartDataLabels from 'chartjs-plugin-datalabels'

window.filamentChartJsPlugins ??= []
window.filamentChartJsPlugins.push(ChartDataLabels)
```

배열에 값을 추가하기 전에, 이미 초기화되어 있지 않다면 배열을 초기화하는 것이 중요합니다. 이렇게 하면 Chart.js 플러그인을 등록하는 여러 JavaScript 파일(특히 Filament 플러그인에서 제공되는 파일)들이 부트 순서와 상관없이 서로를 덮어쓰지 않게 됩니다.

설치하고 싶은 만큼 많은 플러그인을 `filamentChartJsPlugins` 배열에 추가할 수 있으며, 각 플러그인을 가져오기 위해 별도의 파일이 필요하지 않습니다.

### 3단계: Vite로 JavaScript 파일 컴파일하기 {#step-3-compile-the-javascript-file-with-vite}

이제 Vite 또는 원하는 번들러로 JavaScript 파일을 빌드해야 합니다. Vite 설정 파일(보통 `vite.config.js`)에 해당 파일을 포함하세요. 예를 들면 다음과 같습니다:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/filament/admin/theme.css',
                'resources/js/filament-chart-js-plugins.js', // 새 파일을 `input` 배열에 포함시켜 빌드되도록 합니다
            ],
        }),
    ],
});
```

`npm run build` 명령어로 파일을 빌드하세요.

### 4단계: Filament에 JavaScript 파일 등록하기 {#step-4-register-the-javascript-file-in-filament}

Filament가 ChartWidget을 렌더링할 때 이 JavaScript 파일을 포함하도록 알려야 합니다. `AppServiceProvider`와 같은 서비스 프로바이더의 `boot()` 메서드에서 이를 설정할 수 있습니다:

```php
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Facades\Vite;

FilamentAsset::register([
    Js::make('chart-js-plugins', Vite::asset('resources/js/filament-chart-js-plugins.js'))->module(),
]);
```

[에셋 등록](../support/assets)에 대해 더 알아볼 수 있으며, [특정 패널에 에셋을 등록](../panels/configuration#registering-assets-for-a-panel)하는 방법도 확인할 수 있습니다.
