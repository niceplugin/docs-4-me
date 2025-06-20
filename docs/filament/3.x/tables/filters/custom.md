---
title: 커스텀 필터
---
# [테이블.필터] 커스텀 필터


## 커스텀 필터 폼 {#custom-filter-forms}

<LaracastsBanner
    title="커스텀 테이블 필터 만들기"
    description="Laracasts의 Build Advanced Components for Filament 시리즈를 시청하세요. 이 시리즈는 컴포넌트 제작 방법을 알려주며, 내부 도구들을 모두 익힐 수 있습니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/11"
    series="building-advanced-components"
/>

[폼 빌더](../../forms/fields/getting-started)의 컴포넌트를 사용하여 커스텀 필터 폼을 만들 수 있습니다. 커스텀 필터 폼의 데이터는 `query()` 콜백의 `$data` 배열에서 사용할 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

Filter::make('created_at')
    ->form([
        DatePicker::make('created_from'),
        DatePicker::make('created_until'),
    ])
    ->query(function (Builder $query, array $data): Builder {
        return $query
            ->when(
                $data['created_from'],
                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
            )
            ->when(
                $data['created_until'],
                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
            );
    })
```

<AutoScreenshot name="tables/filters/custom-form" alt="커스텀 필터 폼이 있는 테이블" version="3.x" />

### 커스텀 필터 필드의 기본값 설정 {#setting-default-values-for-custom-filter-fields}

커스텀 필터 폼의 필드 기본값을 커스터마이즈하려면 `default()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;

Filter::make('created_at')
    ->form([
        DatePicker::make('created_from'),
        DatePicker::make('created_until')
            ->default(now()),
    ])
```

## 활성 인디케이터 {#active-indicators}

필터가 활성화되면, 테이블 쿼리가 범위 지정되었음을 알리기 위해 테이블 콘텐츠 위에 인디케이터가 표시됩니다.

<AutoScreenshot name="tables/filters/indicators" alt="필터 인디케이터가 있는 테이블" version="3.x" />

기본적으로 필터의 라벨이 인디케이터로 사용됩니다. `indicator()` 메서드를 사용하여 이를 오버라이드할 수 있습니다:

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_admin')
    ->label('관리자만?')
    ->indicator('관리자')
```

[커스텀 필터 폼](#custom-filter-forms)을 사용하는 경우, 활성 인디케이터를 표시하려면 [`indicateUsing()`](#custom-active-indicators)를 사용해야 합니다.

참고: 필터에 인디케이터가 없으면, 테이블에서 활성화된 필터의 개수를 나타내는 배지 카운트에 해당 필터가 포함되지 않습니다.

### 커스텀 활성 인디케이터 {#custom-active-indicators}

모든 인디케이터가 단순하지는 않으므로, 언제든지 표시할 인디케이터를 커스터마이즈하려면 `indicateUsing()`을 사용할 수 있습니다.

예를 들어, 커스텀 날짜 필터가 있다면, 선택한 날짜를 포맷팅하는 커스텀 인디케이터를 만들 수 있습니다:

```php
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;

Filter::make('created_at')
    ->form([DatePicker::make('date')])
    // ...
    ->indicateUsing(function (array $data): ?string {
        if (! $data['date']) {
            return null;
        }

        return '생성일: ' . Carbon::parse($data['date'])->toFormattedDateString();
    })
```

### 다중 활성 인디케이터 {#multiple-active-indicators}

여러 개의 인디케이터를 한 번에 렌더링할 수도 있습니다. `Indicator` 객체의 배열을 반환하면 됩니다. 서로 다른 필드가 서로 다른 인디케이터와 연관되어 있다면, 필터가 제거될 때 올바른 필드가 리셋되도록 `Indicator` 객체의 `removeField()` 메서드를 사용해야 합니다:

```php
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\Indicator;

Filter::make('created_at')
    ->form([
        DatePicker::make('from'),
        DatePicker::make('until'),
    ])
    // ...
    ->indicateUsing(function (array $data): array {
        $indicators = [];

        if ($data['from'] ?? null) {
            $indicators[] = Indicator::make('생성일(이후): ' . Carbon::parse($data['from'])->toFormattedDateString())
                ->removeField('from');
        }

        if ($data['until'] ?? null) {
            $indicators[] = Indicator::make('생성일(이전): ' . Carbon::parse($data['until'])->toFormattedDateString())
                ->removeField('until');
        }

        return $indicators;
    })
```

### 인디케이터 제거 방지 {#preventing-indicators-from-being-removed}

`Indicator` 객체에서 `removable(false)`를 사용하여 사용자가 인디케이터를 제거하지 못하도록 할 수 있습니다:

```php
use Carbon\Carbon;
use Filament\Tables\Filters\Indicator;

Indicator::make('생성일(이후): ' . Carbon::parse($data['from'])->toFormattedDateString())
    ->removable(false)
```
