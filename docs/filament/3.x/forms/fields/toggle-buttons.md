---
title: ToggleButtons
---
# [폼.필드] ToggleButtons

## 개요 {#overview}

ToggleButtons 입력은 미리 정의된 옵션 목록에서 하나 또는 여러 값을 선택할 수 있는 버튼 그룹을 제공합니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
```

<AutoScreenshot name="forms/fields/toggle-buttons/simple" alt="ToggleButtons" version="3.x" />

## 옵션 버튼의 색상 변경하기 {#changing-the-color-of-option-buttons}

`colors()` 메서드를 사용하여 옵션 버튼의 색상을 변경할 수 있습니다. 배열의 각 키는 옵션 값에 해당해야 하며, 값은 `danger`, `gray`, `info`, `primary`, `success`, `warning` 중 하나가 될 수 있습니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->colors([
        'draft' => 'info',
        'scheduled' => 'warning',
        'published' => 'success',
    ])
```

옵션에 enum을 사용하는 경우, 색상을 정의하기 위해 [`HasColor` 인터페이스](../../support/enums#enum-colors)를 대신 사용할 수 있습니다.

<AutoScreenshot name="forms/fields/toggle-buttons/colors" alt="다양한 색상의 ToggleButtons" version="3.x" />

## 옵션 버튼에 아이콘 추가하기 {#adding-icons-to-option-buttons}

`icons()` 메서드를 사용하여 옵션 버튼에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수 있습니다. 배열의 각 키는 옵션 값에 해당해야 하며, 값은 유효한 [Blade 아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)이어야 합니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->icons([
        'draft' => 'heroicon-o-pencil',
        'scheduled' => 'heroicon-o-clock',
        'published' => 'heroicon-o-check-circle',
    ])
```

옵션에 enum을 사용하는 경우, 아이콘을 정의하기 위해 [`HasIcon` 인터페이스](../../support/enums#enum-icons)를 대신 사용할 수 있습니다.

<AutoScreenshot name="forms/fields/toggle-buttons/icons" alt="아이콘이 있는 ToggleButtons" version="3.x" />

아이콘만 표시하고 싶다면, `hiddenButtonLabels()`를 사용하여 옵션 라벨을 숨길 수 있습니다.

## 불리언 옵션 {#boolean-options}

"예"와 "아니오" 옵션이 있는 간단한 불리언 ToggleButtons 그룹을 원한다면, `boolean()` 메서드를 사용할 수 있습니다:

```php
ToggleButtons::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
```

옵션에는 [색상](#changing-the-color-of-option-buttons)과 [아이콘](#adding-icons-to-option-buttons)이 자동으로 설정되지만, `colors()` 또는 `icons()`로 이를 직접 지정할 수도 있습니다.

<AutoScreenshot name="forms/fields/toggle-buttons/boolean" alt="불리언 ToggleButtons" version="3.x" />

## 옵션을 서로 인라인으로 배치하기 {#positioning-the-options-inline-with-each-other}

옵션들을 서로 `inline()`으로 표시하고 싶을 수 있습니다:

```php
ToggleButtons::make('feedback')
    ->label('이 게시물을 좋아하시나요?')
    ->boolean()
    ->inline()
```

<AutoScreenshot name="forms/fields/toggle-buttons/inline" alt="인라인 ToggleButtons" version="3.x" />

## 옵션 버튼 그룹화 {#grouping-option-buttons}

옵션 버튼을 더 컴팩트하게 그룹화하려면 `grouped()` 메서드를 사용할 수 있습니다. 이렇게 하면 버튼들이 서로 수평으로 인라인으로 표시됩니다:

```php
ToggleButtons::make('feedback')
    ->label('이 게시글이 마음에 드시나요?')
    ->boolean()
    ->grouped()
```

<AutoScreenshot name="forms/fields/toggle-buttons/grouped" alt="그룹화된 ToggleButtons" version="3.x" />

## 여러 버튼 선택하기 {#selecting-multiple-buttons}

`ToggleButtons` 컴포넌트의 `multiple()` 메서드를 사용하면 옵션 목록에서 여러 값을 선택할 수 있습니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('technologies')
    ->multiple()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

<AutoScreenshot name="forms/fields/toggle-buttons/multiple" alt="여러 ToggleButtons이 선택된 모습" version="3.x" />

이 옵션들은 JSON 형식으로 반환됩니다. Eloquent를 사용하여 저장하는 경우, 모델 속성에 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    protected $casts = [
        'technologies' => 'array',
    ];

    // ...
}
```

## 옵션을 열로 분할하기 {#splitting-options-into-columns}

`columns()` 메서드를 사용하여 옵션을 여러 열로 분할할 수 있습니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
```

<AutoScreenshot name="forms/fields/toggle-buttons/columns" alt="2열로 구성된 ToggleButtons" version="3.x" />

이 메서드는 [grid](/filament/3.x/forms/layout/grid)의 `columns()` 메서드와 동일한 옵션을 허용합니다. 이를 통해 다양한 반응형 구간에서 열의 개수를 유연하게 조정할 수 있습니다.

### 그리드 방향 설정하기 {#setting-the-grid-direction}

기본적으로 버튼을 열로 정렬하면 세로로 나열됩니다. 버튼을 가로로 나열하고 싶다면 `gridDirection('row')` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
    ->gridDirection('row')
```

<AutoScreenshot name="forms/fields/toggle-buttons/rows" alt="2줄로 표시된 ToggleButtons" version="3.x" />

## 특정 옵션 비활성화하기 {#disabling-specific-options}

`disableOptionWhen()` 메서드를 사용하여 특정 옵션을 비활성화할 수 있습니다. 이 메서드는 클로저를 인자로 받으며, 해당 클로저에서 특정 `$value` 값을 가진 옵션을 비활성화할지 여부를 확인할 수 있습니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

<AutoScreenshot name="forms/fields/toggle-buttons/disabled-option" alt="비활성화된 옵션이 있는 ToggleButtons" version="3.x" />

비활성화되지 않은 옵션만 가져오고 싶다면(예: 유효성 검사 목적 등), `getEnabledOptions()`를 사용할 수 있습니다:

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
    ->in(fn (ToggleButtons $component): array => array_keys($component->getEnabledOptions()))
```
