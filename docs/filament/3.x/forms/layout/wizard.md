---
title: Wizard
---
# [폼.레이아웃] Wizard

## 개요 {#overview}

[tabs](tabs)와 유사하게, 한 번에 보이는 컴포넌트의 수를 줄이기 위해 다단계 폼 마법사를 사용할 수 있습니다. 이러한 마법사는 폼에 명확한 시간 순서가 있고, 사용자가 진행함에 따라 각 단계를 검증하고자 할 때 특히 유용합니다.

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    Wizard\Step::make('Order')
        ->schema([
            // ...
        ]),
    Wizard\Step::make('Delivery')
        ->schema([
            // ...
        ]),
    Wizard\Step::make('Billing')
        ->schema([
            // ...
        ]),
])
```

<AutoScreenshot name="forms/layout/wizard/simple" alt="Wizard" version="3.x" />

> [패널 리소스](../../panels/resources/creating-records#using-a-wizard) 내부의 생성 프로세스나 [액션 모달](../../actions/modals#using-a-wizard-as-a-modal-form)에 마법사를 추가하려는 경우에는 별도의 설정 지침이 있습니다. 해당 문서를 따르면 마법사의 마지막 단계에서만 폼 제출이 가능하도록 할 수 있습니다.

## 마지막 단계에 제출 버튼 렌더링하기 {#rendering-a-submit-button-on-the-last-step}

`submitAction()` 메서드를 사용하여 마법사의 마지막 단계에서 제출 버튼 HTML 또는 뷰를 렌더링할 수 있습니다. 이는 항상 마법사 아래에 제출 버튼을 표시하는 것보다 더 명확한 UX를 제공합니다:

```php
use Filament\Forms\Components\Wizard;
use Illuminate\Support\HtmlString;

Wizard::make([
    // ...
])->submitAction(view('order-form.submit-button'))

Wizard::make([
    // ...
])->submitAction(new HtmlString('<button type="submit">Submit</button>'))
```

또는, 내장된 Filament 버튼 Blade 컴포넌트를 사용할 수도 있습니다:

```php
use Filament\Forms\Components\Wizard;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;

Wizard::make([
    // ...
])->submitAction(new HtmlString(Blade::render(<<<BLADE
    <x-filament::button
        type="submit"
        size="sm"
    >
        Submit
    </x-filament::button>
BLADE)))
```

원한다면 이 컴포넌트를 별도의 Blade 뷰에서 사용할 수도 있습니다.

## 단계 아이콘 설정하기 {#setting-up-step-icons}

단계에는 `icon()` 메서드를 사용하여 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 설정할 수도 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard\Step::make('Order')
    ->icon('heroicon-m-shopping-bag')
    ->schema([
        // ...
    ]),
```

<AutoScreenshot name="forms/layout/wizard/icons" alt="Wizard with step icons" version="3.x" />

## 완료된 단계의 아이콘 커스터마이징하기 {#customizing-the-icon-for-completed-steps}

`completedIcon()` 메서드를 사용하여 완료된 단계의 [아이콘](#setting-up-step-icons)을 커스터마이징할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard\Step::make('Order')
    ->completedIcon('heroicon-m-hand-thumb-up')
    ->schema([
        // ...
    ]),
```

<AutoScreenshot name="forms/layout/wizard/completed-icons" alt="Wizard with completed step icons" version="3.x" />

## 단계에 설명 추가하기 {#adding-descriptions-to-steps}

`description()` 메서드를 사용하여 각 단계의 제목 뒤에 짧은 설명을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard\Step::make('Order')
    ->description('Review your basket')
    ->schema([
        // ...
    ]),
```

<AutoScreenshot name="forms/layout/wizard/descriptions" alt="Wizard with step descriptions" version="3.x" />

## 기본 활성 단계 설정하기 {#setting-the-default-active-step}

`startOnStep()` 메서드를 사용하여 마법사에서 특정 단계를 로드할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    // ...
])->startOnStep(2)
```

## 단계를 건너뛸 수 있도록 허용하기 {#allowing-steps-to-be-skipped}

모든 단계를 자유롭게 이동할 수 있도록 하려면 `skippable()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    // ...
])->skippable()
```

## 현재 단계를 URL 쿼리 문자열에 저장하기 {#persisting-the-current-step-in-the-urls-query-string}

기본적으로 현재 단계는 URL의 쿼리 문자열에 저장되지 않습니다. `persistStepInQueryString()` 메서드를 사용하여 이 동작을 변경할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    // ...
])->persistStepInQueryString()
```

기본적으로 현재 단계는 `step` 키를 사용하여 URL의 쿼리 문자열에 저장됩니다. 이 키는 `persistStepInQueryString()` 메서드에 전달하여 변경할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    // ...
])->persistStepInQueryString('wizard-step')
```

## 단계 라이프사이클 훅 {#step-lifecycle-hooks}

`afterValidation()` 및 `beforeValidation()` 메서드를 사용하여 단계의 검증 전후에 코드를 실행할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard\Step::make('Order')
    ->afterValidation(function () {
        // ...
    })
    ->beforeValidation(function () {
        // ...
    })
    ->schema([
        // ...
    ]),
```

### 다음 단계 로딩 방지하기 {#preventing-the-next-step-from-being-loaded}

`afterValidation()` 또는 `beforeValidation()` 내부에서 `Filament\Support\Exceptions\Halt`를 throw하면, 마법사가 다음 단계를 로드하지 않도록 할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;
use Filament\Support\Exceptions\Halt;

Wizard\Step::make('Order')
    ->afterValidation(function () {
        // ...

        if (true) {
            throw new Halt();
        }
    })
    ->schema([
        // ...
    ]),
```

## 단계 내에서 그리드 컬럼 사용하기 {#using-grid-columns-within-a-step}

`columns()` 메서드를 사용하여 단계 내의 [그리드](grid)를 커스터마이징할 수 있습니다:

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    Wizard\Step::make('Order')
        ->columns(2)
        ->schema([
            // ...
        ]),
    // ...
])
```

## 마법사 액션 오브젝트 커스터마이징하기 {#customizing-the-wizard-action-objects}

이 컴포넌트는 내부 버튼을 쉽게 커스터마이징할 수 있도록 액션 오브젝트를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이징할 수 있습니다. 함수는 `$action` 오브젝트에 접근할 수 있으며, 이를 사용해 [커스터마이징](../../actions/trigger-button)할 수 있습니다. 다음 메서드들을 사용해 액션을 커스터마이징할 수 있습니다:

- `nextAction()`
- `previousAction()`

다음은 액션을 커스터마이징하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Wizard;

Wizard::make([
    // ...
])
    ->nextAction(
        fn (Action $action) => $action->label('Next step'),
    )
```
