---
title: Builder
---
# [폼.필드] Builder

## 개요 {#overview}

[리피터](repeater)와 유사하게, 빌더 컴포넌트는 반복되는 폼 컴포넌트의 JSON 배열을 출력할 수 있도록 해줍니다. 리피터는 하나의 폼 스키마만 반복하도록 정의하는 반면, 빌더는 서로 다른 스키마 "블록"을 정의하고, 이를 원하는 순서로 반복할 수 있습니다. 이로 인해 더 고급 배열 구조를 구축하는 데 유용합니다.

빌더 컴포넌트의 주요 용도는 미리 정의된 블록을 사용하여 웹 페이지 콘텐츠를 구축하는 것입니다. 이는 마케팅 웹사이트의 콘텐츠일 수도 있고, 온라인 폼의 필드일 수도 있습니다. 아래 예제는 페이지 콘텐츠의 다양한 요소를 위한 여러 블록을 정의합니다. 웹사이트의 프론트엔드에서는 JSON의 각 블록을 반복하여 원하는 방식으로 포맷할 수 있습니다.

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

Builder::make('content')
    ->blocks([
        Builder\Block::make('heading')
            ->schema([
                TextInput::make('content')
                    ->label('Heading')
                    ->required(),
                Select::make('level')
                    ->options([
                        'h1' => 'Heading 1',
                        'h2' => 'Heading 2',
                        'h3' => 'Heading 3',
                        'h4' => 'Heading 4',
                        'h5' => 'Heading 5',
                        'h6' => 'Heading 6',
                    ])
                    ->required(),
            ])
            ->columns(2),
        Builder\Block::make('paragraph')
            ->schema([
                Textarea::make('content')
                    ->label('Paragraph')
                    ->required(),
            ]),
        Builder\Block::make('image')
            ->schema([
                FileUpload::make('url')
                    ->label('Image')
                    ->image()
                    ->required(),
                TextInput::make('alt')
                    ->label('Alt text')
                    ->required(),
            ]),
    ])
```

<AutoScreenshot name="forms/fields/builder/simple" alt="Builder" version="3.x" />

빌더 데이터를 데이터베이스의 `JSON` 컬럼에 저장하는 것을 권장합니다. 또한, Eloquent를 사용하는 경우 해당 컬럼에 `array` 캐스트가 적용되어 있는지 확인하세요.

위 예제에서 볼 수 있듯이, 블록은 컴포넌트의 `blocks()` 메서드 내에서 정의할 수 있습니다. 블록은 `Builder\Block` 객체이며, 고유한 이름과 컴포넌트 스키마가 필요합니다:

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\TextInput;

Builder::make('content')
    ->blocks([
        Builder\Block::make('heading')
            ->schema([
                TextInput::make('content')->required(),
                // ...
            ]),
        // ...
    ])
```

## 블록의 라벨 설정하기 {#setting-a-blocks-label}

기본적으로, 블록의 라벨은 이름을 기반으로 자동으로 결정됩니다. 블록의 라벨을 오버라이드하려면 `label()` 메서드를 사용할 수 있습니다. 이 방법으로 라벨을 커스터마이징하면 [로컬라이제이션을 위한 번역 문자열](/laravel/12.x/localization#retrieving-translation-strings)을 사용할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder\Block::make('heading')
    ->label(__('blocks.heading'))
```

### 콘텐츠를 기반으로 빌더 아이템 라벨 지정하기 {#labelling-builder-items-based-on-their-content}

동일한 `label()` 메서드를 사용하여 빌더 아이템에 라벨을 추가할 수 있습니다. 이 메서드는 아이템의 데이터를 `$state` 변수로 받는 클로저를 인자로 받습니다. `$state`가 null인 경우, 블록 선택기에서 표시할 블록 라벨을 반환해야 합니다. 그렇지 않으면 아이템 라벨로 사용할 문자열을 반환해야 합니다:

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\TextInput;

Builder\Block::make('heading')
    ->schema([
        TextInput::make('content')
            ->live(onBlur: true)
            ->required(),
        // ...
    ])
    ->label(function (?array $state): string {
        if ($state === null) {
            return 'Heading';
        }

        return $state['content'] ?? 'Untitled heading';
    })
```

폼을 사용하는 동안 아이템 라벨이 실시간으로 업데이트되는 것을 보고 싶다면, `$state`에서 사용하는 모든 필드는 `live()`여야 합니다.

<AutoScreenshot name="forms/fields/builder/labelled" alt="Builder with labelled blocks based on the content" version="3.x" />

### 빌더 아이템 번호 매기기 {#numbering-builder-items}

기본적으로, 빌더의 아이템에는 라벨 옆에 번호가 표시됩니다. `blockNumbers(false)` 메서드를 사용하여 이를 비활성화할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->blockNumbers(false)
```

## 블록의 아이콘 설정하기 {#setting-a-blocks-icon}

블록에는 라벨 옆에 표시되는 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수 있습니다. `icon()` 메서드에 아이콘 이름을 전달하여 아이콘을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder\Block::make('paragraph')
    ->icon('heroicon-m-bars-3-bottom-left')
```

<AutoScreenshot name="forms/fields/builder/icons" alt="Builder with block icons in the dropdown" version="3.x" />

### 블록 헤더에 아이콘 추가하기 {#adding-icons-to-the-header-of-blocks}

기본적으로, 빌더의 블록에는 헤더 라벨 옆에 아이콘이 없고, 새 블록을 추가하는 드롭다운에만 아이콘이 표시됩니다. `blockIcons()` 메서드를 사용하여 이를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->blockIcons()
```

## 아이템 추가하기 {#adding-items}

사용자가 새 아이템을 추가할 수 있도록 빌더 아래에 액션 버튼이 표시됩니다.

## 추가 액션 버튼의 라벨 설정하기 {#setting-the-add-action-buttons-label}

`addActionLabel()` 메서드를 사용하여 빌더 아이템을 추가하는 버튼에 표시할 텍스트를 커스터마이징할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->addActionLabel('Add a new block')
```

### 추가 액션 버튼 정렬하기 {#aligning-the-add-action-button}

기본적으로, 추가 액션은 중앙에 정렬되어 있습니다. `addActionAlignment()` 메서드에 `Alignment::Start` 또는 `Alignment::End` 옵션을 전달하여 이를 조정할 수 있습니다:

```php
use Filament\Forms\Components\Builder;
use Filament\Support\Enums\Alignment;

Builder::make('content')
    ->schema([
        // ...
    ])
    ->addActionAlignment(Alignment::Start)
```

### 사용자가 아이템을 추가하지 못하도록 방지하기 {#preventing-the-user-from-adding-items}

`addable(false)` 메서드를 사용하여 사용자가 빌더에 아이템을 추가하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->addable(false)
```

## 아이템 삭제하기 {#deleting-items}

각 아이템에 사용자가 삭제할 수 있도록 액션 버튼이 표시됩니다.

### 사용자가 아이템을 삭제하지 못하도록 방지하기 {#preventing-the-user-from-deleting-items}

`deletable(false)` 메서드를 사용하여 사용자가 빌더에서 아이템을 삭제하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->deletable(false)
```

## 아이템 순서 변경하기 {#reordering-items}

각 아이템에 사용자가 드래그 앤 드롭으로 목록에서 순서를 변경할 수 있도록 버튼이 표시됩니다.

### 사용자가 아이템 순서를 변경하지 못하도록 방지하기 {#preventing-the-user-from-reordering-items}

`reorderable(false)` 메서드를 사용하여 사용자가 빌더에서 아이템의 순서를 변경하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderable(false)
```

### 버튼으로 아이템 순서 변경하기 {#reordering-items-with-buttons}

`reorderableWithButtons()` 메서드를 사용하여 아이템을 위아래로 이동시키는 버튼으로 순서를 변경할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderableWithButtons()
```

<AutoScreenshot name="forms/fields/builder/reorderable-with-buttons" alt="Builder that is reorderable with buttons" version="3.x" />

### 드래그 앤 드롭으로 순서 변경 방지하기 {#preventing-reordering-with-drag-and-drop}

`reorderableWithDragAndDrop(false)` 메서드를 사용하여 드래그 앤 드롭으로 아이템의 순서를 변경하지 못하도록 할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderableWithDragAndDrop(false)
```

## 아이템 접기 {#collapsing-items}

빌더는 `collapsible()`로 길어진 폼에서 콘텐츠를 선택적으로 숨길 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapsible()
```

모든 아이템을 기본적으로 접을 수도 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapsed()
```

<AutoScreenshot name="forms/fields/builder/collapsed" alt="Collapsed builder" version="3.x" />

## 아이템 복제하기 {#cloning-items}

`cloneable()` 메서드를 사용하여 빌더 아이템을 복제할 수 있도록 허용할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->cloneable()
```

<AutoScreenshot name="forms/fields/builder/cloneable" alt="Builder repeater" version="3.x" />

## 블록 선택기 커스터마이징하기 {#customizing-the-block-picker}

### 블록 선택기의 열 수 변경하기 {#changing-the-number-of-columns-in-the-block-picker}

블록 선택기는 기본적으로 1개의 열만 있습니다. `blockPickerColumns()`에 열의 개수를 전달하여 커스터마이징할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make()
    ->blockPickerColumns(2)
    ->blocks([
        // ...
    ])
```

이 메서드는 여러 가지 방법으로 사용할 수 있습니다:

- `blockPickerColumns(2)`와 같이 정수를 전달할 수 있습니다. 이 정수는 `lg` 브레이크포인트 이상에서 사용되는 열의 개수입니다. 더 작은 기기에서는 1개의 열만 사용됩니다.
- 배열을 전달할 수 있으며, 키는 브레이크포인트, 값은 열의 개수입니다. 예를 들어, `blockPickerColumns(['md' => 2, 'xl' => 4])`는 중간 크기 기기에서 2열, 매우 큰 기기에서 4열 레이아웃을 만듭니다. 더 작은 기기의 기본 브레이크포인트는 1열을 사용하며, `default` 배열 키를 사용하지 않는 한 그렇습니다.

브레이크포인트(`sm`, `md`, `lg`, `xl`, `2xl`)는 Tailwind에서 정의되며, [Tailwind 문서](https://tailwindcss.com/docs/responsive-design#overview)에서 확인할 수 있습니다.

### 블록 선택기의 너비 늘리기 {#increasing-the-width-of-the-block-picker}

[열의 개수를 늘릴 때](#changing-the-number-of-columns-in-the-block-picker), 드롭다운의 너비도 추가 열을 처리할 수 있도록 점진적으로 늘어나야 합니다. 더 많은 제어가 필요하다면, `blockPickerWidth()` 메서드를 사용하여 드롭다운의 최대 너비를 수동으로 설정할 수 있습니다. 옵션은 [Tailwind의 max-width scale](https://tailwindcss.com/docs/max-width)에 해당합니다. 옵션은 `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`입니다:

```php
use Filament\Forms\Components\Builder;

Builder::make()
    ->blockPickerColumns(3)
    ->blockPickerWidth('2xl')
    ->blocks([
        // ...
    ])
```

## 블록 사용 횟수 제한하기 {#limiting-the-number-of-times-a-block-can-be-used}

기본적으로, 각 블록은 빌더에서 무제한으로 사용할 수 있습니다. 블록의 `maxItems()` 메서드를 사용하여 이를 제한할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder\Block::make('heading')
    ->schema([
        // ...
    ])
    ->maxItems(1)
```

## 빌더 유효성 검사 {#builder-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙 외에도, 빌더에만 적용되는 추가 규칙이 있습니다.

### 아이템 개수 유효성 검사 {#number-of-items-validation}

`minItems()` 및 `maxItems()` 메서드를 설정하여 빌더에서 가질 수 있는 아이템의 최소 및 최대 개수를 유효성 검사할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->minItems(1)
    ->maxItems(5)
```

## `$get()`을 사용하여 상위 필드 값 접근하기 {#using-get-to-access-parent-field-values}

모든 폼 컴포넌트는 [다른 필드의 값을 `$get()` 및 `$set()`](../advanced)으로 접근할 수 있습니다. 하지만, 빌더의 스키마 내부에서 이를 사용할 때 예상치 못한 동작이 발생할 수 있습니다.

이는 `$get()` 및 `$set()`이 기본적으로 현재 빌더 아이템에 범위가 한정되기 때문입니다. 즉, 현재 폼 컴포넌트가 속한 빌더 아이템 내의 다른 필드와 쉽게 상호작용할 수 있습니다.

이로 인해 빌더 외부의 필드와 상호작용할 수 없을 때 혼란스러울 수 있습니다. 이 문제를 해결하기 위해 `../` 문법을 사용합니다 - `$get('../../parent_field_name')`.

폼에 다음과 같은 데이터 구조가 있다고 가정해봅시다:

```php
[
    'client_id' => 1,

    'builder' => [
        'item1' => [
            'service_id' => 2,
        ],
    ],
]
```

빌더 아이템 내부에서 `client_id` 값을 가져오려고 합니다.

`$get()`은 현재 빌더 아이템을 기준으로 상대적이므로, `$get('client_id')`는 `$get('builder.item1.client_id')`를 찾습니다.

`../`를 사용하여 데이터 구조에서 한 단계 위로 올라갈 수 있으므로, `$get('../client_id')`는 `$get('builder.client_id')`이고, `$get('../../client_id')`는 `$get('client_id')`입니다.

특별한 경우로, 인자가 없는 `$get()`, 또는 `$get('')` 또는 `$get('./')`는 항상 현재 빌더 아이템의 전체 데이터 배열을 반환합니다.

## 빌더 아이템 액션 커스터마이징하기 {#customizing-the-builder-item-actions}

이 필드는 내부 버튼을 쉽게 커스터마이징할 수 있도록 액션 객체를 사용합니다. 액션 등록 메서드에 함수를 전달하여 이 버튼들을 커스터마이징할 수 있습니다. 함수는 `$action` 객체에 접근할 수 있으며, 이를 사용해 [커스터마이징](../../actions/trigger-button)할 수 있습니다. 액션을 커스터마이징할 수 있는 메서드는 다음과 같습니다:

- `addAction()`
- `addBetweenAction()`
- `cloneAction()`
- `collapseAction()`
- `collapseAllAction()`
- `deleteAction()`
- `expandAction()`
- `expandAllAction()`
- `moveDownAction()`
- `moveUpAction()`
- `reorderAction()`

다음은 액션을 커스터마이징하는 예시입니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapseAllAction(
        fn (Action $action) => $action->label('Collapse all content'),
    )
```

### 모달로 빌더 액션 확인하기 {#confirming-builder-actions-with-a-modal}

액션 객체의 `requiresConfirmation()` 메서드를 사용하여 액션을 모달로 확인할 수 있습니다. [모달 커스터마이징 메서드](../../actions/modals)를 사용하여 내용과 동작을 변경할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->deleteAction(
        fn (Action $action) => $action->requiresConfirmation(),
    )
```

> `addAction()`, `addBetweenAction()`, `collapseAction()`, `collapseAllAction()`, `expandAction()`, `expandAllAction()`, `reorderAction()` 메서드는 버튼 클릭 시 모달을 표시하는 데 필요한 네트워크 요청을 하지 않으므로, 확인 모달을 지원하지 않습니다.

### 빌더에 추가 아이템 액션 추가하기 {#adding-extra-item-actions-to-a-builder}

`extraItemActions()`에 `Action` 객체를 전달하여 각 빌더 아이템의 헤더에 새로운 [액션 버튼](../actions)을 추가할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Mail;

Builder::make('content')
    ->blocks([
        Builder\Block::make('contactDetails')
            ->schema([
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                // ...
            ]),
        // ...
    ])
    ->extraItemActions([
        Action::make('sendEmail')
            ->icon('heroicon-m-square-2-stack')
            ->action(function (array $arguments, Builder $component): void {
                $itemData = $component->getItemState($arguments['item']);
                
                Mail::to($itemData['email'])
                    ->send(
                        // ...
                    );
            }),
    ])
```

이 예제에서 `$arguments['item']`은 현재 빌더 아이템의 ID를 제공합니다. `getItemState()` 메서드를 사용하여 해당 빌더 아이템의 데이터를 유효성 검사할 수 있습니다. 이 메서드는 아이템의 유효성 검사된 데이터를 반환합니다. 아이템이 유효하지 않으면, 액션이 취소되고 해당 아이템에 대한 오류 메시지가 폼에 표시됩니다.

현재 아이템의 원시 데이터를 유효성 검사 없이 가져오고 싶다면, `$component->getRawItemState($arguments['item'])`를 사용할 수 있습니다.

빌더 전체의 원시 데이터를 조작하고 싶다면, 예를 들어 아이템을 추가, 삭제 또는 수정하려면, `$component->getState()`로 데이터를 가져오고, `$component->state($state)`로 다시 설정할 수 있습니다:

```php
use Illuminate\Support\Str;

// 빌더 전체의 원시 데이터 가져오기
$state = $component->getState();

// 무작위 UUID를 키로 하여 아이템 추가
$state[Str::uuid()] = [
    'type' => 'contactDetails',
    'data' => [
        'email' => auth()->user()->email,
    ],
];

// 빌더에 새 데이터 설정
$component->state($state);
```

## 블록 미리보기 {#previewing-blocks}

블록의 폼 대신 빌더에서 읽기 전용 미리보기를 렌더링하고 싶다면, `blockPreviews()` 메서드를 사용할 수 있습니다. 이 메서드는 각 블록의 `preview()`를 폼 대신 렌더링합니다. 블록 데이터는 동일한 이름의 변수로 미리보기 Blade 뷰에 전달됩니다:

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;

Builder::make('content')
    ->blockPreviews()
    ->blocks([
        Block::make('heading')
            ->schema([
                TextInput::make('text')
                    ->placeholder('Default heading'),
            ])
            ->preview('filament.content.block-previews.heading'),
    ])
```

`/resources/views/filament/content/block-previews/heading.blade.php`에서 블록 데이터를 다음과 같이 접근할 수 있습니다:

```blade
<h1>
    {{ $text ?? 'Default heading' }}
</h1>
```

### 인터랙티브 블록 미리보기 {#interactive-block-previews}

기본적으로, 미리보기 콘텐츠는 인터랙티브하지 않으며, 클릭하면 해당 블록의 설정을 관리할 수 있는 편집 모달이 열립니다. 블록 미리보기에서 링크와 버튼이 계속 인터랙티브하게 동작하길 원한다면, `blockPreviews()` 메서드의 `areInteractive: true` 인자를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blockPreviews(areInteractive: true)
    ->blocks([
        //
    ])
```

## 빌더 테스트하기 {#testing-builders}

내부적으로, 빌더는 Livewire HTML에서 아이템을 더 쉽게 추적할 수 있도록 아이템에 UUID를 생성합니다. 따라서 빌더가 있는 폼을 테스트할 때, 폼과 테스트 간에 UUID가 일치하는지 확인해야 합니다. 이는 까다로울 수 있으며, 올바르게 처리하지 않으면 테스트가 UUID가 아닌 숫자 키를 기대하기 때문에 실패할 수 있습니다.

하지만, Livewire는 테스트에서 UUID를 추적할 필요가 없으므로, 테스트 시작 시 `Builder::fake()` 메서드를 사용하여 UUID 생성을 비활성화하고 숫자 키로 대체할 수 있습니다:

```php
use Filament\Forms\Components\Builder;
use function Pest\Livewire\livewire;

$undoBuilderFake = Builder::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertFormSet([
        'content' => [
            [
                'type' => 'heading',
                'data' => [
                    'content' => 'Hello, world!',
                    'level' => 'h1',
                ],
            ],
            [
                'type' => 'paragraph',
                'data' => [
                    'content' => 'This is a test post.',
                ],
            ],
        ],
        // ...
    ]);

$undoBuilderFake();
```

또한, `assertFormSet()` 메서드에 함수를 전달하여 리피터의 아이템 개수를 테스트하는 것도 유용할 수 있습니다:

```php
use Filament\Forms\Components\Builder;
use function Pest\Livewire\livewire;

$undoBuilderFake = Builder::fake();

livewire(EditPost::class, ['record' => $post])
    ->assertFormSet(function (array $state) {
        expect($state['content'])
            ->toHaveCount(2);
    });

$undoBuilderFake();
```
