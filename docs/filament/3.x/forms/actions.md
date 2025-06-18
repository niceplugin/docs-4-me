---
title: Action
---
# [폼] Action

## 개요 {#overview}

Filament의 폼은 [액션](/filament/3.x/actions/overview)을 사용할 수 있습니다. 액션은 어떤 폼 컴포넌트에도 추가할 수 있는 버튼입니다. 예를 들어, AI로 콘텐츠를 생성하기 위해 API 엔드포인트를 호출하거나, 셀렉트 드롭다운에 새로운 옵션을 추가하는 액션이 필요할 수 있습니다. 또한, [특정 폼 컴포넌트에 연결하지 않고 익명 액션 집합을 렌더링](#adding-anonymous-actions-to-a-form-without-attaching-them-to-a-component)할 수도 있습니다.

## 폼 컴포넌트 액션 정의하기 {#defining-a-form-component-action}

폼 컴포넌트 내의 액션 객체는 `Filament/Forms/Components/Actions/Action`의 인스턴스입니다. 액션의 `make()` 메서드에 고유한 이름을 전달해야 하며, 이 이름은 Filament 내부에서 다른 액션들과 구분하는 데 사용됩니다. 액션의 [트리거 버튼을 커스터마이즈](../actions/trigger-button)할 수 있고, 간단하게 [모달을 열](../actions/modals) 수도 있습니다:

```php
use App\Actions\ResetStars;
use Filament\Forms\Components\Actions\Action;

Action::make('resetStars')
    ->icon('heroicon-m-x-mark')
    ->color('danger')
    ->requiresConfirmation()
    ->action(function (ResetStars $resetStars) {
        $resetStars();
    })
```

### 필드에 접두/접미 액션 추가하기 {#adding-an-affix-action-to-a-field}

특정 필드는 입력 영역의 앞이나 뒤에 배치할 수 있는 버튼인 "접두/접미 액션(affix actions)"을 지원합니다. 다음 필드들이 접두/접미 액션을 지원합니다:

- [텍스트 입력](fields/text-input)
- [셀렉트](fields/select)
- [날짜-시간 선택기](fields/date-time-picker)
- [컬러 선택기](fields/color-picker)

접두/접미 액션을 정의하려면 `prefixAction()` 또는 `suffixAction()`에 전달하면 됩니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Set;

TextInput::make('cost')
    ->prefix('€')
    ->suffixAction(
        Action::make('copyCostToPrice')
            ->icon('heroicon-m-clipboard')
            ->requiresConfirmation()
            ->action(function (Set $set, $state) {
                $set('price', $state);
            })
    )
```

<AutoScreenshot name="forms/fields/actions/suffix" alt="접미 액션이 있는 텍스트 입력" version="3.x" />

이 예시에서 `action()` 함수에 `$set`과 `$state`가 주입되는 것을 확인할 수 있습니다. 이는 [폼 컴포넌트 액션 유틸리티 주입](#form-component-action-utility-injection)입니다.

#### 필드에 여러 개의 affix 액션 전달하기 {#passing-multiple-affix-actions-to-a-field}

`prefixActions()` 또는 `suffixActions()`에 배열로 여러 개의 affix 액션을 전달할 수 있습니다. 두 메서드 중 하나 또는 둘 다 동시에 사용할 수 있으며, Filament는 등록된 모든 액션을 순서대로 렌더링합니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\TextInput;

TextInput::make('cost')
    ->prefix('€')
    ->prefixActions([
        Action::make('...'),
        Action::make('...'),
        Action::make('...'),
    ])
    ->suffixActions([
        Action::make('...'),
        Action::make('...'),
    ])
```

### 필드에 힌트 액션 추가하기 {#adding-a-hint-action-to-a-field}

모든 필드는 "힌트 액션"을 지원하며, 이는 필드의 [힌트](fields/getting-started#adding-a-hint-next-to-the-label) 옆에 렌더링됩니다. 필드에 힌트 액션을 추가하려면 `hintAction()`에 전달하면 됩니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Set;

TextInput::make('cost')
    ->prefix('€')
    ->hintAction(
        Action::make('copyCostToPrice')
            ->icon('heroicon-m-clipboard')
            ->requiresConfirmation()
            ->action(function (Set $set, $state) {
                $set('price', $state);
            })
    )
```

이 예제에서 `action()` 함수에 `$set`과 `$state`가 주입되는 것에 주목하세요. 이것은 [폼 컴포넌트 액션 유틸리티 주입](#form-component-action-utility-injection)입니다.

<AutoScreenshot name="forms/fields/actions/hint" alt="힌트 액션이 있는 텍스트 입력" version="3.x" />

#### 필드에 여러 개의 힌트 액션 전달하기 {#passing-multiple-hint-actions-to-a-field}

여러 개의 힌트 액션을 필드에 전달하려면, `hintActions()`에 배열로 전달하면 됩니다. Filament는 등록된 모든 액션을 순서대로 렌더링합니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\TextInput;

TextInput::make('cost')
    ->prefix('€')
    ->hintActions([
        Action::make('...'),
        Action::make('...'),
        Action::make('...'),
    ])
```

### 커스텀 폼 컴포넌트에 액션 추가하기 {#adding-an-action-to-a-custom-form-component}

커스텀 폼 컴포넌트, `ViewField` 객체, 또는 `View` 컴포넌트 객체 내에서 액션을 렌더링하고 싶다면, `registerActions()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\ViewField;
use Filament\Forms\Set;

ViewField::make('rating')
    ->view('filament.forms.components.range-slider')
    ->registerActions([
        Action::make('setMaximum')
            ->icon('heroicon-m-star')
            ->action(function (Set $set) {
                $set('rating', 5);
            }),
    ])
```

이 예시에서 `action()` 함수에 주입된 `$set`에 주목하세요. 이것은 [폼 컴포넌트 액션 유틸리티 주입](#form-component-action-utility-injection)입니다.

이제, 커스텀 컴포넌트의 뷰에서 액션을 렌더링하려면, 등록한 액션의 이름을 전달하여 `$getAction()`을 호출해야 합니다:

```blade
<div x-data="{ state: $wire.$entangle('{{ $getStatePath() }}') }">
    <input x-model="state" type="range" />
    
    {{ $getAction('setMaximum') }}
</div>
```

### 폼에 "익명" 액션 추가하기 (컴포넌트에 연결하지 않고) {#adding-anonymous-actions-to-a-form-without-attaching-them-to-a-component}

`Actions` 컴포넌트를 사용하여 폼의 어느 위치에서나 액션 집합을 렌더링할 수 있습니다. 이를 통해 특정 컴포넌트에 액션을 등록할 필요가 없습니다:

```php
use App\Actions\Star;
use App\Actions\ResetStars;
use Filament\Forms\Components\Actions;
use Filament\Forms\Components\Actions\Action;

Actions::make([
    Action::make('star')
        ->icon('heroicon-m-star')
        ->requiresConfirmation()
        ->action(function (Star $star) {
            $star();
        }),
    Action::make('resetStars')
        ->icon('heroicon-m-x-mark')
        ->color('danger')
        ->requiresConfirmation()
        ->action(function (ResetStars $resetStars) {
            $resetStars();
        }),
]),
```

<AutoScreenshot name="forms/layout/actions/anonymous/simple" alt="익명 액션" version="3.x" />

#### 독립 폼 액션이 폼의 전체 너비를 차지하도록 만들기 {#making-the-independent-form-actions-consume-the-full-width-of-the-form}

`fullWidth()`를 사용하여 독립 폼 액션이 폼의 전체 너비를 차지하도록 확장할 수 있습니다:

```php
use Filament\Forms\Components\Actions;

Actions::make([
    // ...
])->fullWidth(),
```

<AutoScreenshot name="forms/layout/actions/anonymous/full-width" alt="전체 너비를 차지하는 익명 액션" version="3.x" />

#### 독립 폼 액션의 수평 정렬 제어하기 {#controlling-the-horizontal-alignment-of-independent-form-actions}

독립 폼 액션은 기본적으로 컴포넌트의 시작 부분에 정렬됩니다. `alignment()`에 `Alignment::Center` 또는 `Alignment::End`를 전달하여 이를 변경할 수 있습니다:

```php
use Filament\Forms\Components\Actions;
use Filament\Support\Enums\Alignment;

Actions::make([
    // ...
])->alignment(Alignment::Center),
```

<AutoScreenshot name="forms/layout/actions/anonymous/horizontally-aligned-center" alt="익명 액션이 중앙에 수평 정렬된 모습" version="3.x" />

#### 독립 폼 액션의 수직 정렬 제어하기 {#controlling-the-vertical-alignment-of-independent-form-actions}

독립 폼 액션은 기본적으로 컴포넌트의 시작 부분에 수직 정렬됩니다. `verticalAlignment()`에 `Alignment::Center` 또는 `Alignment::End`를 전달하여 이를 변경할 수 있습니다:

```php
use Filament\Forms\Components\Actions;
use Filament\Support\Enums\VerticalAlignment;

Actions::make([
    // ...
])->verticalAlignment(VerticalAlignment::End),
```

<AutoScreenshot name="forms/layout/actions/anonymous/vertically-aligned-end" alt="익명 액션이 끝에 수직 정렬된 모습" version="3.x" />

## 폼 컴포넌트 액션 유틸리티 주입 {#form-component-action-utility-injection}

폼 컴포넌트에 액션이 연결되어 있다면, `action()` 함수는 해당 폼 컴포넌트에서 [유틸리티를 직접 주입](/filament/3.x/forms/advanced#form-component-utility-injection)할 수 있습니다. 예를 들어, [`$set`](/filament/3.x/forms/advanced#injecting-a-function-to-set-the-state-of-another-field)과 [`$state`](/filament/3.x/forms/advanced#injecting-the-current-state-of-a-field)를 주입할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Set;

Action::make('copyCostToPrice')
    ->icon('heroicon-m-clipboard')
    ->requiresConfirmation()
    ->action(function (Set $set, $state) {
        $set('price', $state);
    })
```

폼 컴포넌트 액션은 또한 [액션에 적용되는 모든 유틸리티](../actions/advanced#action-utility-injection)에 접근할 수 있습니다.
