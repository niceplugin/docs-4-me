---
title: Action
---
# [인포리스트] Action

## 개요 {#overview}

Filament의 인포리스트는 [액션](../actions)을 사용할 수 있습니다. 액션은 모든 인포리스트 컴포넌트에 추가할 수 있는 버튼입니다. 또한, 특정 인포리스트 컴포넌트에 연결하지 않고 [익명 액션 집합을 렌더링](#adding-anonymous-actions-to-an-infolist-without-attaching-them-to-a-component)할 수도 있습니다.

## 인포리스트 컴포넌트 액션 정의하기 {#defining-a-infolist-component-action}

인포리스트 컴포넌트 내부의 액션 객체는 `Filament/Infolists/Components/Actions/Action`의 인스턴스입니다. 액션의 `make()` 메서드에 고유한 이름을 전달해야 하며, 이 이름은 Filament 내부에서 다른 액션들과 구분하는 데 사용됩니다. 액션의 [트리거 버튼을 커스터마이즈](../actions/trigger-button)할 수 있고, 간단하게 [모달을 열](../actions/modals) 수도 있습니다:

```php
use App\Actions\ResetStars;
use Filament\Infolists\Components\Actions\Action;

Action::make('resetStars')
    ->icon('heroicon-m-x-mark')
    ->color('danger')
    ->requiresConfirmation()
    ->action(function (ResetStars $resetStars) {
        $resetStars();
    })
```

### 엔트리에 접두/접미 액션 추가하기 {#adding-an-affix-action-to-a-entry}

특정 엔트리들은 "접두/접미 액션(affix actions)"을 지원합니다. 이는 엔트리의 내용 앞이나 뒤에 배치할 수 있는 버튼입니다. 다음 엔트리들이 접두/접미 액션을 지원합니다:

- [텍스트 엔트리](entries/text-entry)

접두/접미 액션을 정의하려면, `prefixAction()` 또는 `suffixAction()`에 전달하면 됩니다:

```php
use App\Models\Product;
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('cost')
    ->prefix('€')
    ->suffixAction(
        Action::make('copyCostToPrice')
            ->icon('heroicon-m-clipboard')
            ->requiresConfirmation()
            ->action(function (Product $record) {
                $record->price = $record->cost;
                $record->save();
            })
    )
```

<AutoScreenshot name="infolists/entries/actions/suffix" alt="접미 액션이 있는 텍스트 엔트리" version="3.x" />

#### 엔트리에 여러 개의 affix 액션 전달하기 {#passing-multiple-affix-actions-to-a-entry}

여러 개의 affix 액션을 배열로 `prefixActions()` 또는 `suffixActions()`에 전달하여 엔트리에 추가할 수 있습니다. 두 메서드 중 하나만 사용해도 되고, 둘 다 동시에 사용할 수도 있습니다. Filament는 등록된 모든 액션을 순서대로 렌더링합니다:

```php
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('cost')
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

### 엔트리에 힌트 액션 추가하기 {#adding-a-hint-action-to-an-entry}

모든 엔트리은 "힌트 액션"을 지원하며, 이는 엔트리의 [힌트](entries/getting-started#adding-a-hint-next-to-the-label) 옆에 렌더링됩니다. 엔트리에 힌트 액션을 추가하려면 `hintAction()`에 전달하면 됩니다:

```php
use App\Models\Product;
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('cost')
    ->prefix('€')
    ->hintAction(
        Action::make('copyCostToPrice')
            ->icon('heroicon-m-clipboard')
            ->requiresConfirmation()
            ->action(function (Product $record) {
                $record->price = $record->cost;
                $record->save();
            })
    )
```

<AutoScreenshot name="infolists/entries/actions/hint" alt="힌트 액션이 있는 텍스트 엔트리" version="3.x" />

#### 엔트리에 여러 힌트 액션 전달하기 {#passing-multiple-hint-actions-to-a-entry}

여러 개의 힌트 액션을 배열로 `hintActions()`에 전달하여 엔트리에 추가할 수 있습니다. Filament는 등록된 모든 액션을 순서대로 렌더링합니다:

```php
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('cost')
    ->prefix('€')
    ->hintActions([
        Action::make('...'),
        Action::make('...'),
        Action::make('...'),
    ])
```

### 커스텀 인포리스트 컴포넌트에 액션 추가하기 {#adding-an-action-to-a-custom-infolist-component}

커스텀 인포리스트 컴포넌트, `ViewEntry` 객체, 또는 `View` 컴포넌트 객체 내에서 액션을 렌더링하고 싶다면, `registerActions()` 메서드를 사용하면 됩니다:

```php
use App\Models\Post;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\ViewEntry;
use Filament\Infolists\Set;

ViewEntry::make('status')
    ->view('filament.infolists.entries.status-switcher')
    ->registerActions([
        Action::make('createStatus')
            ->form([
                TextInput::make('name')
                    ->required(),
            ])
            ->icon('heroicon-m-plus')
            ->action(function (array $data, Post $record) {
                $record->status()->create($data);
            }),
    ])
```

이제 커스텀 컴포넌트의 뷰에서 액션을 렌더링하려면, 등록한 액션의 이름을 전달하여 `$getAction()`을 호출하면 됩니다:

```blade
<div>
    <select></select>
    
    {{ $getAction('createStatus') }}
</div>
```

### 인포리스트에 "익명" 액션 추가하기 (컴포넌트에 연결하지 않고) {#adding-anonymous-actions-to-an-infolist-without-attaching-them-to-a-component}

`Actions` 컴포넌트를 사용하면 인포리스트 어디에서나 여러 액션을 렌더링할 수 있으며, 특정 컴포넌트에 등록할 필요가 없습니다:

```php
use App\Actions\Star;
use App\Actions\ResetStars;
use Filament\Infolists\Components\Actions;
use Filament\Infolists\Components\Actions\Action;

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

<AutoScreenshot name="infolists/layout/actions/anonymous/simple" alt="익명 액션" version="3.x" />

#### 독립 인포리스트 액션이 인포리스트의 전체 너비를 차지하도록 만들기 {#making-the-independent-infolist-actions-consume-the-full-width-of-the-infolist}

`fullWidth()`를 사용하여 독립 인포리스트 액션이 인포리스트의 전체 너비를 차지하도록 확장할 수 있습니다:

```php
use Filament\Infolists\Components\Actions;

Actions::make([
    // ...
])->fullWidth(),
```

<AutoScreenshot name="infolists/layout/actions/anonymous/full-width" alt="전체 너비를 차지하는 익명 액션" version="3.x" />

#### 독립적인 인포리스트 액션의 수평 정렬 제어하기 {#controlling-the-horizontal-alignment-of-independent-infolist-actions}

독립적인 인포리스트 액션은 기본적으로 컴포넌트의 시작 부분에 정렬됩니다. `alignment()`에 `Alignment::Center` 또는 `Alignment::End`를 전달하여 이를 변경할 수 있습니다:

```php
use Filament\Infolists\Components\Actions;
use Filament\Support\Enums\Alignment;

Actions::make([
    // ...
])->alignment(Alignment::Center),
```

<AutoScreenshot name="infolists/layout/actions/anonymous/horizontally-aligned-center" alt="익명 액션이 중앙에 수평 정렬된 모습" version="3.x" />

#### 독립적인 인포리스트 액션의 수직 정렬 제어하기 {#controlling-the-vertical-alignment-of-independent-infolist-actions}

독립적인 인포리스트 액션은 기본적으로 컴포넌트의 시작 부분에 수직 정렬됩니다. `verticalAlignment()`에 `Alignment::Center` 또는 `Alignment::End`를 전달하여 이를 변경할 수 있습니다:

```php
use Filament\Infolists\Components\Actions;
use Filament\Support\Enums\VerticalAlignment;

Actions::make([
    // ...
])->verticalAlignment(VerticalAlignment::End),
```

<AutoScreenshot name="infolists/layout/actions/anonymous/vertically-aligned-end" alt="익명 액션이 끝에 수직 정렬된 모습" version="3.x" />
