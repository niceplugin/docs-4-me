---
title: 개요
---
# [액션] 개요
## 액션이란 무엇인가요? {#what-is-an-action}

"액션(Action)"이라는 단어는 Laravel 커뮤니티에서 자주 사용됩니다. 전통적으로, 액션 PHP 클래스는 애플리케이션의 비즈니스 로직에서 무언가를 "실행"하는 역할을 합니다. 예를 들어, 사용자를 로그인시키거나, 이메일을 보내거나, 데이터베이스에 새로운 사용자 레코드를 생성하는 작업 등이 있습니다.

Filament에서 액션 역시 애플리케이션에서 무언가를 "실행"하는 역할을 합니다. 하지만 전통적인 액션과는 약간 다릅니다. Filament의 액션은 사용자 인터페이스(UI) 맥락에서 사용되도록 설계되었습니다. 예를 들어, 클라이언트 레코드를 삭제하는 버튼이 있고, 이 버튼을 누르면 결정을 확인하는 모달이 열릴 수 있습니다. 사용자가 모달에서 "삭제" 버튼을 클릭하면 클라이언트가 삭제됩니다. 이 전체 워크플로우가 하나의 "액션"입니다.

```php
Action::make('delete')
    ->requiresConfirmation()
    ->action(fn () => $this->client->delete())
```

액션은 사용자로부터 추가 정보를 수집할 수도 있습니다. 예를 들어, 클라이언트에게 이메일을 보내는 버튼이 있을 수 있습니다. 사용자가 버튼을 클릭하면 이메일 제목과 본문을 입력받는 모달이 열립니다. 모달에서 "보내기" 버튼을 클릭하면 이메일이 전송됩니다:

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Mail;

Action::make('sendEmail')
    ->form([
        TextInput::make('subject')->required(),
        RichEditor::make('body')->required(),
    ])
    ->action(function (array $data) {
        Mail::to($this->client)
            ->send(new GenericEmail(
                subject: $data['subject'],
                body: $data['body'],
            ));
    })
```

일반적으로 액션은 사용자를 다른 페이지로 리디렉션하지 않고 실행됩니다. 이는 Livewire를 광범위하게 사용하기 때문입니다. 하지만 액션은 훨씬 더 단순할 수도 있으며, 모달조차 필요하지 않을 수 있습니다. 액션에 URL을 전달하면, 사용자가 버튼을 클릭할 때 해당 페이지로 리디렉션됩니다:

```php
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

액션의 트리거 버튼과 모달의 전체 외관은 유창한(Fluent) PHP 메서드를 사용해 커스터마이즈할 수 있습니다. Filament는 UI에 대해 합리적이고 일관된 스타일을 제공하지만, 이 모든 것은 CSS로 자유롭게 커스터마이즈할 수 있습니다.

## 액션의 종류 {#types-of-action}

"액션"이라는 개념은 Filament 전반에 걸쳐 다양한 맥락에서 사용됩니다. 일부 맥락에서는 액션에서 모달을 여는 것이 지원되지 않으며, URL을 열거나, 공개 Livewire 메서드를 호출하거나, Livewire 이벤트를 디스패치하는 것만 가능합니다. 또한, 각기 다른 맥락에서는 해당 사용 사례에 적합한 컨텍스트 인식 데이터를 개발자에게 제공하기 위해 서로 다른 액션 PHP 클래스를 사용합니다.

### 커스텀 Livewire 컴포넌트 액션 {#custom-livewire-component-actions}

앱의 어떤 Livewire 컴포넌트나 [패널](../panels/pages)의 페이지에도 액션을 추가할 수 있습니다.

이러한 액션은 `Filament\Actions\Action` 클래스를 사용합니다. 원한다면 모달을 열 수도 있고, 단순히 URL을 열 수도 있습니다.

Livewire 컴포넌트에 액션을 추가하고 싶다면, 문서의 [이 페이지](adding-an-action-to-a-livewire-component)를 방문하세요. 패널의 페이지 헤더에 액션을 추가하고 싶다면, [이 페이지](../panels/pages#header-actions)를 참고하세요.

### 테이블 액션 {#table-actions}

Filament의 테이블은 액션도 사용할 수 있습니다. 액션은 테이블의 각 행 끝에 추가할 수 있으며, 테이블 헤더에도 추가할 수 있습니다. 예를 들어, 헤더에는 새로운 레코드를 "생성"하는 액션을, 각 행에는 "수정" 및 "삭제" 액션을 추가할 수 있습니다. 또한, 액션은 테이블의 특정 컬럼에도 추가할 수 있어, 해당 컬럼의 각 셀이 액션을 트리거하는 역할을 하게 할 수 있습니다.

이러한 액션은 `Filament\Tables\Actions\Action` 클래스를 사용합니다. 원한다면 모달을 열 수도 있고, 단순히 URL로 이동하게 할 수도 있습니다.

앱의 테이블에 액션을 추가하고 싶다면, [이 문서의 해당 페이지](../tables/actions)를 방문하세요.

#### 테이블 일괄 작업 {#table-bulk-actions}

테이블은 "일괄 작업"도 지원합니다. 사용자가 테이블에서 행을 선택할 때 사용할 수 있습니다. 일반적으로 행이 선택되면, 테이블의 왼쪽 상단에 "일괄 작업" 버튼이 나타납니다. 사용자가 이 버튼을 클릭하면, 선택할 수 있는 작업의 드롭다운 메뉴가 표시됩니다. 일괄 작업은 다른 헤더 작업 옆에 테이블 헤더에도 추가할 수 있습니다. 이 경우, 사용자가 테이블 행을 선택할 때까지 일괄 작업 트리거 버튼이 비활성화됩니다.

이 작업들은 `Filament\Tables\Actions\BulkAction` 클래스를 사용합니다. 원한다면 모달을 열 수도 있습니다.

앱의 테이블에 일괄 작업을 추가하려면, [이 페이지](../tables/actions#bulk-actions)를 참고하세요.

### 폼 컴포넌트 액션 {#form-component-actions}

폼 컴포넌트에는 액션을 포함할 수 있습니다. 폼 컴포넌트 내에서 액션을 사용하는 좋은 예시는 셀렉트 필드와 "새로 만들기" 버튼이 있는 경우입니다. 버튼을 클릭하면 모달이 열려 새 레코드의 데이터를 입력받습니다. 모달 폼이 제출되면 새 레코드가 데이터베이스에 생성되고, 셀렉트 필드에 새로 생성된 레코드가 채워집니다. 다행히도, [이 경우는 기본적으로 처리됩니다](../forms/fields/select#creating-new-records). 하지만 폼 컴포넌트 액션이 얼마나 강력한지 보여주는 좋은 예시입니다.

이러한 액션은 `Filament\Forms\Components\Actions\Action` 클래스를 사용합니다. 원한다면 모달을 열 수도 있고, 단순히 URL을 열 수도 있습니다.

앱에서 폼 컴포넌트에 액션을 추가하고 싶다면, [이 페이지](../forms/actions)를 참고하세요.

### 인포리스트 컴포넌트 액션 {#infolist-component-actions}

인포리스트 컴포넌트에는 액션을 포함할 수 있습니다. 이때 `Filament\Infolists\Components\Actions\Action` 클래스를 사용합니다. 액션은 선택에 따라 모달을 열 수도 있고, 단순히 URL을 열 수도 있습니다.

앱의 인포리스트 컴포넌트에 액션을 추가하고 싶다면, 문서의 [이 페이지](../infolists/actions)를 방문하세요.

### 알림 액션 {#notification-actions}

[알림을 보낼 때](../notifications/sending-notifications), 액션을 추가할 수 있습니다. 이 버튼들은 알림 내용 아래에 렌더링됩니다. 예를 들어, 사용자가 새 메시지를 받았다는 것을 알리는 알림에는 대화 스레드를 여는 액션 버튼이 포함되어야 합니다.

이러한 액션은 `Filament\Notifications\Actions\Action` 클래스를 사용합니다. 모달을 열 수는 없지만, URL을 열거나 Livewire 이벤트를 디스패치할 수 있습니다.

앱에서 알림에 액션을 추가하고 싶다면, [이 페이지](../notifications/sending-notifications#adding-actions-to-notifications)를 참고하세요.

### 글로벌 검색 결과 액션 {#global-search-result-actions}

패널 빌더에는 앱의 모든 리소스를 한 곳에서 검색할 수 있는 [글로벌 검색](../panels/resources/global-search) 필드가 있습니다. 검색 결과를 클릭하면 해당 레코드의 리소스 페이지로 이동합니다. 하지만 각 글로벌 검색 결과 아래에 추가적인 액션을 추가할 수도 있습니다. 예를 들어, 클라이언트 검색 결과에 "수정"과 "보기" 옵션을 모두 제공하여 사용자가 프로필을 빠르게 수정하거나 읽기 전용 모드로 볼 수 있도록 할 수 있습니다.

이러한 액션은 `Filament\GlobalSearch\Actions\Action` 클래스를 사용합니다. 모달을 열 수는 없지만, URL을 열거나 Livewire 이벤트를 디스패치할 수 있습니다.

패널에서 글로벌 검색 결과에 액션을 추가하고 싶다면, 문서의 [이 페이지](../panels/resources/global-search#adding-actions-to-global-search-results)를 방문하세요.

## 기본 제공 액션 {#prebuilt-actions}

Filament에는 앱에 추가할 수 있는 여러 가지 기본 제공 액션이 포함되어 있습니다. 이 액션들은 가장 일반적인 Eloquent 관련 작업을 간소화하는 데 목적이 있습니다:

- [생성](prebuilt-actions/create)
- [수정](prebuilt-actions/edit)
- [보기](prebuilt-actions/view)
- [삭제](prebuilt-actions/delete)
- [복제](prebuilt-actions/replicate)
- [강제 삭제](prebuilt-actions/force-delete)
- [복원](prebuilt-actions/restore)
- [가져오기](prebuilt-actions/import)
- [내보내기](prebuilt-actions/export)

## 액션 그룹화 {#grouping-actions}

`ActionGroup` 객체를 사용하여 여러 액션을 드롭다운 메뉴로 그룹화할 수 있습니다. 그룹에는 여러 액션이나 다른 그룹을 포함할 수 있습니다:

```php
ActionGroup::make([
    Action::make('view'),
    Action::make('edit'),
    Action::make('delete'),
])
```

액션을 그룹화하는 방법에 대해 더 알아보려면 [액션 그룹화](grouping-actions) 페이지를 참고하세요.
