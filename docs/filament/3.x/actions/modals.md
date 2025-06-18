---
title: 모달
---
# [액션] 모달

## 개요 {#overview}

액션은 실행되기 전에 사용자로부터 추가 확인이나 입력이 필요할 수 있습니다. 이를 위해 액션이 실행되기 전에 모달을 열 수 있습니다.

## 확인 모달 {#confirmation-modals}

`requiresConfirmation()` 메서드를 사용하여 액션이 실행되기 전에 확인을 요구할 수 있습니다. 이는 레코드를 삭제하는 것과 같이 특히 파괴적인 액션에 유용합니다.

```php
use App\Models\Post;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
```

<AutoScreenshot name="actions/modal/confirmation" alt="확인 모달" version="3.x" />

> `action()` 대신 `url()`이 설정된 경우에는 확인 모달을 사용할 수 없습니다. 대신, `action()` 클로저 내에서 해당 URL로 리디렉션해야 합니다.

## 모달 폼 {#modal-forms}

액션이 실행되기 전에 사용자로부터 추가 정보를 수집하기 위해 모달에서 폼을 렌더링할 수도 있습니다.

[폼 빌더](/filament/3.x/forms/getting-started)의 컴포넌트를 사용하여 커스텀 액션 모달 폼을 생성할 수 있습니다. 폼에서 입력된 데이터는 `action()` 클로저의 `$data` 배열에서 사용할 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;
use Filament\Forms\Components\Select;

Action::make('updateAuthor')
    ->form([
        Select::make('authorId')
            ->label('Author')
            ->options(User::query()->pluck('name', 'id'))
            ->required(),
    ])
    ->action(function (array $data, Post $record): void {
        $record->author()->associate($data['authorId']);
        $record->save();
    })
```

<AutoScreenshot name="actions/modal/form" alt="폼이 있는 모달" version="3.x" />

### 기존 데이터로 폼 채우기 {#filling-the-form-with-existing-data}

기존 데이터를 사용하여 `fillForm()` 메서드로 폼을 채울 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;

Action::make('updateAuthor')
    ->fillForm(fn (Post $record): array => [
        'authorId' => $record->author->id,
    ])
    ->form([
        Select::make('authorId')
            ->label('Author')
            ->options(User::query()->pluck('name', 'id'))
            ->required(),
    ])
    ->action(function (array $data, Post $record): void {
        $record->author()->associate($data['authorId']);
        $record->save();
    })
```

### 위자드를 모달 폼으로 사용하기 {#using-a-wizard-as-a-modal-form}

[다단계 폼 위자드](../forms/layout/wizard)를 모달 안에 생성할 수 있습니다. `form()`을 사용하는 대신, `steps()` 배열을 정의하고 `Step` 객체들을 전달하세요:

```php
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Wizard\Step;

Action::make('create')
    ->steps([
        Step::make('Name')
            ->description('카테고리에 고유한 이름을 지정하세요')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->disabled()
                    ->required()
                    ->unique(Category::class, 'slug'),
            ])
            ->columns(2),
        Step::make('Description')
            ->description('추가 정보를 입력하세요')
            ->schema([
                MarkdownEditor::make('description'),
            ]),
        Step::make('Visibility')
            ->description('누가 볼 수 있는지 제어하세요')
            ->schema([
                Toggle::make('is_visible')
                    ->label('고객에게 표시됩니다.')
                    ->default(true),
            ]),
    ])
```

<AutoScreenshot name="actions/modal/wizard" alt="위자드가 포함된 모달" version="3.x" />

### 모든 폼 필드 비활성화하기 {#disabling-all-form-fields}

모달에서 모든 폼 필드를 비활성화하여 사용자가 수정하지 못하도록 하고 싶을 수 있습니다. `disabledForm()` 메서드를 사용하여 이를 할 수 있습니다:

```php
use App\Models\Post;
use App\Models\User;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

Action::make('approvePost')
    ->form([
        TextInput::make('title'),
        Textarea::make('content'),
    ])
    ->fillForm(fn (Post $record): array => [
        'title' => $record->title,
        'content' => $record->content,
    ])
    ->disabledForm()
    ->action(function (Post $record): void {
        $record->approve();
    })
```

## 모달의 제목, 설명, 제출 버튼 라벨 커스터마이징하기 {#customizing-the-modals-heading-description-and-submit-action-label}

모달에서 제목, 설명, 제출 버튼의 라벨을 커스터마이즈할 수 있습니다:

```php
use App\Models\Post;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
    ->modalHeading('게시글 삭제')
    ->modalDescription('이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    ->modalSubmitActionLabel('네, 삭제합니다')
```

<AutoScreenshot name="actions/modal/confirmation-custom-text" alt="커스텀 텍스트가 적용된 확인 모달" version="3.x" />

## 모달 안에 아이콘 추가하기 {#adding-an-icon-inside-the-modal}

`modalIcon()` 메서드를 사용하여 모달 안에 [아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 추가할 수 있습니다:

```php
use App\Models\Post;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
    ->modalIcon('heroicon-o-trash')
```

<AutoScreenshot name="actions/modal/icon" alt="아이콘이 있는 확인 모달" version="3.x" />

기본적으로 아이콘은 액션 버튼의 색상을 상속받습니다. `modalIconColor()` 메서드를 사용하여 아이콘의 색상을 커스터마이즈할 수 있습니다:

```php
use App\Models\Post;

Action::make('delete')
    ->action(fn (Post $record) => $record->delete())
    ->requiresConfirmation()
    ->color('danger')
    ->modalIcon('heroicon-o-trash')
    ->modalIconColor('warning')
```

## 모달 콘텐츠 정렬 사용자 지정 {#customizing-the-alignment-of-modal-content}

기본적으로 모달 콘텐츠는 시작 부분에 정렬되며, 모달의 [너비](#changing-the-modal-width)가 `xs` 또는 `sm`인 경우에는 중앙에 정렬됩니다. 모달에서 콘텐츠의 정렬을 변경하고 싶다면, `modalAlignment()` 메서드를 사용하고 `Alignment::Start` 또는 `Alignment::Center`를 전달할 수 있습니다:

```php
use Filament\Support\Enums\Alignment;

Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalAlignment(Alignment::Center)
```

## 사용자 지정 모달 내용 {#custom-modal-content}

모달 내부에 렌더링될 사용자 지정 내용을 정의할 수 있으며, `modalContent()` 메서드에 Blade 뷰를 전달하여 지정할 수 있습니다:

```php
use App\Models\Post;

Action::make('advance')
    ->action(fn (Post $record) => $record->advance())
    ->modalContent


### 커스텀 모달 콘텐츠에 데이터 전달하기 {#passing-data-to-the-custom-modal-content}

함수를 통해 데이터를 반환하여 뷰에 전달할 수 있습니다. 예를 들어, 액션의 `$record`가 설정되어 있다면, 이를 뷰로 전달할 수 있습니다:

```php
use Illuminate\Contracts\View\View;

Action::make('advance')
    ->action(fn (Contract $record) => $record->advance())
    ->modalContent(fn (Contract $record): View => view(
        'filament.pages.actions.advance',
        ['record' => $record],
    ))
```

### 폼 아래에 커스텀 모달 콘텐츠 추가하기 {#adding-custom-modal-content-below-the-form}

기본적으로 커스텀 콘텐츠는 모달 폼 위에 표시되지만, 원한다면 `modalContentFooter()`를 사용하여 아래에 콘텐츠를 추가할 수 있습니다:

```php
use App\Models\Post;

Action::make('advance')
    ->action(fn (Post $record) => $record->advance())
    ->modalContentFooter(view('filament.pages.actions.advance'))
```

### 사용자 지정 모달 콘텐츠에 액션 추가하기 {#adding-an-action-to-custom-modal-content}

사용자 지정 모달 콘텐츠에 액션 버튼을 추가할 수 있습니다. 이는 메인 액션 이외의 동작을 수행하는 버튼을 추가하고 싶을 때 유용합니다. `registerModalActions()` 메서드로 액션을 등록한 후, 이를 뷰에 전달하여 사용할 수 있습니다:

```php
use App\Models\Post;
use Illuminate\Contracts\View\View;

Action::make('advance')
    ->registerModalActions([
        Action::make('report')
            ->requiresConfirmation()
            ->action(fn (Post $record) => $record->report()),
    ])
    ->action(fn (Post $record) => $record->advance())
    ->modalContent(fn (Action $action): View => view(
        'filament.pages.actions.advance',
        ['action' => $action],
    ))
```

이제 뷰 파일에서 `getModalAction()`을 호출하여 액션 버튼을 렌더링할 수 있습니다:

```blade
<div>
    {{ $action->getModalAction('report') }}
</div>
```

## 모달 대신 슬라이드 오버 사용하기 {#using-a-slide-over-instead-of-a-modal}

`slideOver()` 메서드를 사용하면 모달 대신 "슬라이드 오버" 대화 상자를 열 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->slideOver()
```

<AutoScreenshot name="actions/modal/slide-over" alt="폼이 있는 슬라이드 오버" version="3.x" />

이제 모달 내용이 화면 중앙에 열리는 대신, 오른쪽에서 슬라이드되어 브라우저의 전체 높이를 차지하게 됩니다.

## 모달 헤더를 스티키로 만들기 {#making-the-modal-header-sticky}

모달의 헤더는 모달의 크기를 초과하여 내용이 스크롤될 때, 내용과 함께 화면 밖으로 스크롤됩니다. 하지만 슬라이드오버는 항상 보이는 스티키 헤더를 가지고 있습니다. 이 동작은 `stickyModalHeader()`를 사용하여 제어할 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->stickyModalHeader()
```

## 모달 푸터를 스티키로 만들기 {#making-the-modal-footer-sticky}

모달의 푸터는 기본적으로 콘텐츠 뒤에 인라인으로 렌더링됩니다. 하지만 슬라이드오버는 콘텐츠를 스크롤할 때 항상 표시되는 스티키 푸터를 가지고 있습니다. 모달에서도 `stickyModalFooter()`를 사용하여 이 기능을 활성화할 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->stickyModalFooter()
```

## 모달 너비 변경하기 {#changing-the-modal-width}

`modalWidth()` 메서드를 사용하여 모달의 너비를 변경할 수 있습니다. 옵션은 [Tailwind의 max-width 스케일](https://tailwindcss.com/docs/max-width)과 일치합니다. 사용 가능한 옵션은 `ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`, `TwoExtraLarge`, `ThreeExtraLarge`, `FourExtraLarge`, `FiveExtraLarge`, `SixExtraLarge`, `SevenExtraLarge`, 그리고 `Screen`입니다:

```php
use Filament\Support\Enums\MaxWidth;

Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalWidth(MaxWidth::FiveExtraLarge)
```

## 모달이 열릴 때 코드 실행하기 {#executing-code-when-the-modal-opens}

모달이 열릴 때 클로저 내에서 코드를 실행하려면, `mountUsing()` 메서드에 전달하면 됩니다:

```php
use Filament\Forms\Form;

Action::make('create')
    ->mountUsing(function (Form $form) {
        $form->fill();

        // ...
    })
```

> `mountUsing()` 메서드는 기본적으로 Filament가 [폼](#modal-forms)을 초기화할 때 사용합니다. 이 메서드를 오버라이드할 경우, 폼이 올바르게 초기화되도록 반드시 `$form->fill()`을 호출해야 합니다. 폼에 데이터를 채우고 싶다면, [액션 자체에서 `fillForm()`을 사용하는 것](#filling-the-form-with-existing-data) 대신 `fill()` 메서드에 배열을 전달하여 데이터를 채울 수 있습니다.

## 모달 하단의 액션 버튼 사용자 지정 {#customizing-the-action-buttons-in-the-footer-of-the-modal}

기본적으로 모달의 하단에는 두 개의 액션이 있습니다. 첫 번째는 `action()`을 실행하는 제출 버튼입니다. 두 번째 버튼은 모달을 닫고 액션을 취소합니다.

### 기본 모달 푸터 액션 버튼 수정하기 {#modifying-a-default-modal-footer-action-button}

기본 액션 버튼 중 하나를 렌더링하는 액션 인스턴스를 수정하려면, `modalSubmitAction()` 및 `modalCancelAction()` 메서드에 클로저를 전달할 수 있습니다:

```php
use Filament\Actions\StaticAction;

Action::make('help')
    ->modalContent(view('actions.help'))
    ->modalCancelAction(fn (StaticAction $action) => $action->label('닫기'))
```

[트리거 버튼을 커스터마이즈할 수 있는 메서드들](trigger-button)은 클로저 내부의 `$action` 인스턴스를 수정하는 데 사용할 수 있습니다.

### 기본 모달 푸터 액션 버튼 제거하기 {#removing-a-default-modal-footer-action-button}

기본 액션을 제거하려면 `modalSubmitAction()` 또는 `modalCancelAction()`에 `false`를 전달하면 됩니다:

```php
Action::make('help')
    ->modalContent(view('actions.help'))
    ->modalSubmitAction(false)
```

### 모달 하단에 추가 액션 버튼 추가하기 {#adding-an-extra-modal-action-button-to-the-footer}

`extraModalFooterActions()` 메서드를 사용하여, 모달의 하단에 기본 액션들 사이에 렌더링될 추가 액션들의 배열을 전달할 수 있습니다:

```php
Action::make('create')
    ->form([
        // ...
    ])
    // ...
    ->extraModalFooterActions(fn (Action $action): array => [
        $action->makeModalSubmitAction('createAnother', arguments: ['another' => true]),
    ])
```

`$action->makeModalSubmitAction()`은 [트리거 버튼을 커스터마이즈할 수 있는 메서드들](trigger-button)을 사용하여 커스터마이즈할 수 있는 액션 인스턴스를 반환합니다.

`makeModalSubmitAction()`의 두 번째 파라미터로는, 액션의 `action()` 클로저 내에서 `$arguments`로 접근할 수 있는 인자 배열을 전달할 수 있습니다. 이 인자들은 사용자의 결정에 따라 액션이 다르게 동작해야 함을 나타내는 플래그로 유용하게 사용할 수 있습니다:

```php
Action::make('create')
    ->form([
        // ...
    ])
    // ...
    ->extraModalFooterActions(fn (Action $action): array => [
        $action->makeModalSubmitAction('createAnother', arguments: ['another' => true]),
    ])
    ->action(function (array $data, array $arguments): void {
        // 생성

        if ($arguments['another'] ?? false) {
            // 폼을 리셋하고 모달을 닫지 않음
        }
    })
```

#### 추가 푸터 액션에서 다른 모달 열기 {#opening-another-modal-from-an-extra-footer-action}

액션을 서로 중첩할 수 있으므로, 추가 푸터 액션에서 새로운 모달을 열 수 있습니다:

```php
Action::make('edit')
    // ...
    ->extraModalFooterActions([
        Action::make('delete')
            ->requiresConfirmation()
            ->action(function () {
                // ...
            }),
    ])
```

이제 edit 모달의 푸터에 "Delete" 버튼이 생기며, 클릭 시 확인 모달이 열립니다. 이 액션은 `edit` 액션과 완전히 독립적이며, 클릭해도 `edit` 액션이 실행되지 않습니다.

하지만 이 예시에서는 `delete` 액션이 실행될 경우 `edit` 액션을 취소하고 싶을 수 있습니다. 이럴 때는 `cancelParentActions()` 메서드를 사용할 수 있습니다:

```php
Action::make('delete')
    ->requiresConfirmation()
    ->action(function () {
        // ...
    })
    ->cancelParentActions()
```

여러 부모 액션이 깊게 중첩되어 있지만, 모두 취소하고 싶지 않은 경우에는, 취소하고 싶은 부모 액션의 이름(및 그 자식들)을 `cancelParentActions()`에 전달할 수 있습니다:

```php
Action::make('first')
    ->requiresConfirmation()
    ->action(function () {
        // ...
    })
    ->extraModalFooterActions([
        Action::make('second')
            ->requiresConfirmation()
            ->action(function () {
                // ...
            })
            ->extraModalFooterActions([
                Action::make('third')
                    ->requiresConfirmation()
                    ->action(function () {
                        // ...
                    })
                    ->extraModalFooterActions([
                        Action::make('fourth')
                            ->requiresConfirmation()
                            ->action(function () {
                                // ...
                            })
                            ->cancelParentActions('second'),
                    ]),
            ]),
    ])
```

이 예시에서 `fourth` 액션이 실행되면, `second` 액션이 취소되고, `second`의 자식인 `third` 액션도 함께 취소됩니다. 하지만 `second`의 부모인 `first` 액션은 취소되지 않으므로, `first` 액션의 모달은 계속 열려 있습니다.

## 모달 바깥을 클릭하여 닫기 {#closing-the-modal-by-clicking-away}

기본적으로 모달 바깥을 클릭하면 모달이 닫힙니다. 특정 액션에 대해 이 동작을 비활성화하고 싶다면, `closeModalByClickingAway(false)` 메서드를 사용할 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->closeModalByClickingAway(false)
```

애플리케이션의 모든 모달에 대해 이 동작을 변경하고 싶다면, 서비스 프로바이더나 미들웨어 내부에서 `Modal::closedByClickingAway()`를 호출하면 됩니다:

```php
use Filament\Support\View\Components\Modal;

Modal::closedByClickingAway(false);
```

## Esc 키로 모달 닫기 {#closing-the-modal-by-escaping}

기본적으로 모달에서 Esc 키를 누르면 모달이 닫힙니다. 특정 액션에 대해 이 동작을 비활성화하고 싶다면, `closeModalByEscaping(false)` 메서드를 사용할 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->closeModalByEscaping(false)
```

애플리케이션의 모든 모달에 대해 이 동작을 변경하고 싶다면, 서비스 프로바이더나 미들웨어 내부에서 `Modal::closedByEscaping()`을 호출하면 됩니다:

```php
use Filament\Support\View\Components\Modal;

Modal::closedByEscaping(false);
```

## 모달 닫기 버튼 숨기기 {#hiding-the-modal-close-button}

기본적으로 모달에는 오른쪽 상단에 닫기 버튼이 있습니다. 닫기 버튼을 숨기고 싶다면 `modalCloseButton(false)` 메서드를 사용할 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalCloseButton(false)
```

애플리케이션의 모든 모달에서 닫기 버튼을 숨기고 싶다면, 서비스 프로바이더나 미들웨어 내부에서 `Modal::closeButton(false)`를 호출하면 됩니다:

```php
use Filament\Support\View\Components\Modal;

Modal::closeButton(false);
```

## 모달의 자동 포커스 방지 {#preventing-the-modal-from-autofocusing}

기본적으로 모달은 열릴 때 첫 번째로 포커스 가능한 요소에 자동으로 포커스를 맞춥니다. 이 동작을 비활성화하려면 `modalAutofocus(false)` 메서드를 사용할 수 있습니다:

```php
Action::make('updateAuthor')
    ->form([
        // ...
    ])
    ->action(function (array $data): void {
        // ...
    })
    ->modalAutofocus(false)
```

애플리케이션의 모든 모달에 대해 자동 포커스를 비활성화하고 싶다면, 서비스 프로바이더나 미들웨어 내부에서 `Modal::autofocus(false)`를 호출하면 됩니다:

```php
use Filament\Support\View\Components\Modal;

Modal::autofocus(false);
```

## 모달 구성 메서드 최적화 {#optimizing-modal-configuration-methods}

`modalHeading()`과 같은 모달 구성 메서드 내에서 데이터베이스 쿼리나 기타 무거운 작업을 사용할 경우, 해당 메서드가 한 번 이상 실행될 수 있습니다. 이는 Filament가 모달을 렌더링할지 여부를 결정할 때와 모달의 내용을 렌더링할 때 이 메서드들을 사용하기 때문입니다.

Filament가 모달을 렌더링할지 확인하는 과정을 건너뛰고 싶다면, `modal()` 메서드를 사용할 수 있습니다. 이 메서드는 해당 액션에 대해 모달이 존재함을 Filament에 알려주어, 추가적인 확인이 필요 없도록 합니다:

```php
Action::make('updateAuthor')
    ->modal()
```

## 모달을 조건부로 숨기기 {#conditionally-hiding-the-modal}

확인 등의 이유로 모달을 조건부로 표시해야 하며, 기본 동작으로 돌아가야 할 때가 있을 수 있습니다. 이는 `modalHidden()`을 사용하여 구현할 수 있습니다:

```php
Action::make('create')
    ->action(function (array $data): void {
        // ...
    })
    ->modalHidden(fn (): bool => $this->role !== 'admin')
    ->modalContent(view('filament.pages.actions.create'))
```

## 모달 창에 추가 속성 지정하기 {#adding-extra-attributes-to-the-modal-window}

`extraModalWindowAttributes()`를 사용하여 모달 창에 추가 HTML 속성을 전달할 수도 있습니다:

```php
Action::make('updateAuthor')
    ->extraModalWindowAttributes(['class' => 'update-author-modal'])
```
