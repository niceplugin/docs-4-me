---
title: 레코드 편집
---
# [패널.리소스] 레코드 편집
## 폼에 데이터를 채우기 전에 데이터 커스터마이징하기 {#customizing-data-before-filling-the-form}

레코드에서 폼에 데이터를 채우기 전에 데이터를 수정하고 싶을 수 있습니다. 이를 위해 Edit 페이지 클래스에 `mutateFormDataBeforeFill()` 메서드를 정의하여 `$data` 배열을 수정하고, 수정된 버전을 폼에 채우기 전에 반환할 수 있습니다:

```php
protected function mutateFormDataBeforeFill(array $data): array
{
    $data['user_id'] = auth()->id();

    return $data;
}
```

또는, 모달 액션에서 레코드를 편집하는 경우 [액션 문서](../../actions/prebuilt-actions/edit#customizing-data-before-filling-the-form)를 참고하세요.

## 저장 전에 데이터 커스터마이징하기 {#customizing-data-before-saving}

때때로, 폼 데이터를 데이터베이스에 최종적으로 저장하기 전에 수정하고 싶을 수 있습니다. 이를 위해 Edit 페이지 클래스에 `mutateFormDataBeforeSave()` 메서드를 정의할 수 있으며, 이 메서드는 배열 형태의 `$data`를 받아 수정된 값을 반환합니다:

```php
protected function mutateFormDataBeforeSave(array $data): array
{
    $data['last_edited_by_id'] = auth()->id();

    return $data;
}
```

또는, 모달 액션에서 레코드를 편집하는 경우 [액션 문서](../../actions/prebuilt-actions/edit#customizing-data-before-saving)를 참고하세요.

## 저장 프로세스 커스터마이징하기 {#customizing-the-saving-process}

Edit 페이지 클래스의 `handleRecordUpdate()` 메서드를 사용하여 레코드가 업데이트되는 방식을 조정할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

protected function handleRecordUpdate(Model $record, array $data): Model
{
    $record->update($data);

    return $record;
}
```

또는, 모달 액션에서 레코드를 편집하는 경우 [액션 문서](../../actions/prebuilt-actions/edit#customizing-the-saving-process)를 참고하세요.

## 리다이렉트 커스터마이징하기 {#customizing-redirects}

기본적으로 폼을 저장해도 사용자가 다른 페이지로 리다이렉트되지 않습니다.

폼이 저장될 때 커스텀 리다이렉트를 설정하려면 Edit 페이지 클래스에서 `getRedirectUrl()` 메서드를 오버라이드하면 됩니다.

예를 들어, 폼 저장 후 리소스의 [목록 페이지](listing-records)로 리다이렉트할 수 있습니다:

```php
protected function getRedirectUrl(): string
{
    return $this->getResource()::getUrl('index');
}
```

또는 [상세 보기 페이지](viewing-records)로 리다이렉트할 수도 있습니다:

```php
protected function getRedirectUrl(): string
{
    return $this->getResource()::getUrl('view', ['record' => $this->getRecord()]);
}
```

이전 페이지로 리다이렉트하고, 없으면 인덱스 페이지로 이동하고 싶다면:

```php
protected function getRedirectUrl(): string
{
    return $this->previousUrl ?? $this->getResource()::getUrl('index');
}
```

## 저장 알림 커스터마이징하기 {#customizing-the-save-notification}

레코드가 성공적으로 업데이트되면, 사용자의 작업 성공을 알리는 알림이 전송됩니다.

이 알림의 제목을 커스터마이징하려면, edit 페이지 클래스에 `getSavedNotificationTitle()` 메서드를 정의하세요:

```php
protected function getSavedNotificationTitle(): ?string
{
    return '사용자가 업데이트되었습니다';
}
```

또는, 모달 액션에서 레코드를 편집하는 경우 [액션 문서](../../actions/prebuilt-actions/edit#customizing-the-save-notification)를 참고하세요.

알림 전체를 커스터마이징하려면 edit 페이지 클래스에서 `getSavedNotification()` 메서드를 오버라이드하세요:

```php
use Filament\Notifications\Notification;

protected function getSavedNotification(): ?Notification
{
    return Notification::make()
        ->success()
        ->title('사용자가 업데이트되었습니다')
        ->body('사용자가 성공적으로 저장되었습니다.');
}
```

알림을 완전히 비활성화하려면 edit 페이지 클래스의 `getSavedNotification()` 메서드에서 `null`을 반환하세요:

```php
use Filament\Notifications\Notification;

protected function getSavedNotification(): ?Notification
{
    return null;
}
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하면 페이지의 라이프사이클 내 여러 시점(예: 폼 저장 전)에 코드를 실행할 수 있습니다. 훅을 설정하려면 Edit 페이지 클래스에 훅 이름의 protected 메서드를 생성하세요:

```php
protected function beforeSave(): void
{
    // ...
}
```

이 예시에서, `beforeSave()` 메서드의 코드는 폼의 데이터가 데이터베이스에 저장되기 전에 호출됩니다.

Edit 페이지에서 사용할 수 있는 여러 훅이 있습니다:

```php
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    // ...

    protected function beforeFill(): void
    {
        // 폼 필드가 데이터베이스에서 채워지기 전에 실행됩니다.
    }

    protected function afterFill(): void
    {
        // 폼 필드가 데이터베이스에서 채워진 후에 실행됩니다.
    }

    protected function beforeValidate(): void
    {
        // 폼이 저장될 때 폼 필드가 검증되기 전에 실행됩니다.
    }

    protected function afterValidate(): void
    {
        // 폼이 저장될 때 폼 필드가 검증된 후에 실행됩니다.
    }

    protected function beforeSave(): void
    {
        // 폼 필드가 데이터베이스에 저장되기 전에 실행됩니다.
    }

    protected function afterSave(): void
    {
        // 폼 필드가 데이터베이스에 저장된 후에 실행됩니다.
    }
}
```

또는, 모달 액션에서 레코드를 편집하는 경우 [액션 문서](../../actions/prebuilt-actions/edit#lifecycle-hooks)를 참고하세요.

## 폼의 일부만 독립적으로 저장하기 {#saving-a-part-of-the-form-independently}

사용자가 폼의 일부만 나머지와 독립적으로 저장할 수 있도록 하고 싶을 수 있습니다. 이를 위한 한 가지 방법은 [섹션의 헤더 또는 푸터에 섹션 액션 추가](../../forms/layout/section#adding-actions-to-the-sections-header-or-footer)입니다. `action()` 메서드에서 저장하고자 하는 `Section` 컴포넌트를 `saveFormComponentOnly()`에 전달할 수 있습니다:

```php
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

Section::make('Rate limiting')
    ->schema([
        // ...
    ])
    ->footerActions([
        fn (string $operation): Action => Action::make('save')
            ->action(function (Section $component, EditRecord $livewire) {
                $livewire->saveFormComponentOnly($component);
                
                Notification::make()
                    ->title('속도 제한이 저장되었습니다')
                    ->body('속도 제한 설정이 성공적으로 저장되었습니다.')
                    ->success()
                    ->send();
            })
            ->visible($operation === 'edit'),
    ])
```

액션이 폼이 편집 중일 때만 보이도록 `$operation` 헬퍼를 사용할 수 있습니다.

## 저장 프로세스 중단하기 {#halting-the-saving-process}

언제든지 라이프사이클 훅이나 변환 메서드 내에서 `$this->halt()`를 호출하여 전체 저장 프로세스를 중단할 수 있습니다:

```php
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;

protected function beforeSave(): void
{
    if (! $this->getRecord()->team->subscribed()) {
        Notification::make()
            ->warning()
            ->title('활성화된 구독이 없습니다!')
            ->body('계속하려면 요금제를 선택하세요.')
            ->persistent()
            ->actions([
                Action::make('subscribe')
                    ->button()
                    ->url(route('subscribe'), shouldOpenInNewTab: true),
            ])
            ->send();

        $this->halt();
    }
}
```

또는, 모달 액션에서 레코드를 편집하는 경우 [액션 문서](../../actions/prebuilt-actions/edit#halting-the-saving-process)를 참고하세요.

## 권한 부여 {#authorization}

권한 부여를 위해 Filament는 앱에 등록된 모든 [모델 정책](/laravel/12.x/authorization#creating-policies)을 따릅니다.

모델 정책의 `update()` 메서드가 `true`를 반환하면 사용자는 Edit 페이지에 접근할 수 있습니다.

또한, 정책의 `delete()` 메서드가 `true`를 반환하면 레코드를 삭제할 수도 있습니다.

## 커스텀 액션 {#custom-actions}

"액션"은 페이지에 표시되는 버튼으로, 사용자가 페이지에서 Livewire 메서드를 실행하거나 URL을 방문할 수 있게 해줍니다.

리소스 페이지에서 액션은 보통 두 곳에 있습니다: 페이지 오른쪽 상단과 폼 아래입니다.

예를 들어, Edit 페이지에서 "삭제" 옆에 새 버튼 액션을 추가할 수 있습니다:

```php
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    // ...

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('impersonate')
                ->action(function (): void {
                    // ...
                }),
            Actions\DeleteAction::make(),
        ];
    }
}
```

또는, 폼 아래 "저장" 옆에 새 버튼을 추가할 수도 있습니다:

```php
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    // ...

    protected function getFormActions(): array
    {
        return [
            ...parent::getFormActions(),
            Action::make('close')->action('saveAndClose'),
        ];
    }

    public function saveAndClose(): void
    {
        // ...
    }
}
```

전체 액션 API를 보려면 [페이지 섹션](../pages#adding-actions-to-pages)을 방문하세요.

### 헤더에 저장 액션 버튼 추가하기 {#adding-a-save-action-button-to-the-header}

"저장" 버튼은 `getHeaderActions()` 메서드를 오버라이드하고 `getSaveFormAction()`을 사용하여 페이지 헤더에 추가할 수 있습니다. 이때, 액션이 `form` ID를 가진 폼을 제출하도록 `formId()`를 전달해야 합니다. 이 ID는 페이지 뷰에서 사용되는 `<form>`의 ID입니다:

```php
protected function getHeaderActions(): array
{
    return [
        $this->getSaveFormAction()
            ->formId('form'),
    ];
}
```

`getFormActions()` 메서드를 오버라이드하여 빈 배열을 반환하면 폼에서 모든 액션을 제거할 수 있습니다:

```php
protected function getFormActions(): array
{
    return [];
}
```

## 또 다른 Edit 페이지 생성하기 {#creating-another-edit-page}

하나의 Edit 페이지로는 많은 폼 필드를 관리하기에 공간이 부족할 수 있습니다. 리소스마다 원하는 만큼 Edit 페이지를 생성할 수 있습니다. 이는 [리소스 서브 내비게이션](getting-started#resource-sub-navigation)을 사용할 때 특히 유용하며, 서로 다른 Edit 페이지 간에 쉽게 전환할 수 있습니다.

Edit 페이지를 생성하려면 `make:filament-page` 명령어를 사용하세요:

```bash
php artisan make:filament-page EditCustomerContact --resource=CustomerResource --type=EditRecord
```

이 새 페이지를 리소스의 `getPages()` 메서드에 등록해야 합니다:

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListCustomers::route('/'),
        'create' => Pages\CreateCustomer::route('/create'),
        'view' => Pages\ViewCustomer::route('/{record}'),
        'edit' => Pages\EditCustomer::route('/{record}/edit'),
        'edit-contact' => Pages\EditCustomerContact::route('/{record}/edit/contact'),
    ];
}
```

이제 이 페이지에 대한 `form()`을 정의할 수 있으며, 여기에는 메인 Edit 페이지에 없는 다른 필드를 포함할 수 있습니다:

```php
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            // ...
        ]);
}
```

## 리소스 서브 내비게이션에 Edit 페이지 추가하기 {#adding-edit-pages-to-resource-sub-navigation}

[리소스 서브 내비게이션](getting-started#resource-sub-navigation)을 사용하는 경우, 이 페이지를 리소스의 `getRecordSubNavigation()`에 일반적으로 등록할 수 있습니다:

```php
use App\Filament\Resources\CustomerResource\Pages;
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        // ...
        Pages\EditCustomerContact::class,
    ]);
}
```

## 커스텀 뷰 {#custom-views}

더 많은 커스터마이징을 위해, 페이지 클래스의 static `$view` 프로퍼티를 앱의 커스텀 뷰로 오버라이드할 수 있습니다:

```php
protected static string $view = 'filament.resources.users.pages.edit-user';
```

이는 `resources/views/filament/resources/users/pages/edit-user.blade.php`에 뷰를 생성했다고 가정합니다.

해당 뷰에 들어갈 수 있는 기본 예시는 다음과 같습니다:

```blade
<x-filament-panels::page>
    <x-filament-panels::form wire:submit="save">
        {{ $this->form }}

        <x-filament-panels::form.actions
            :actions="$this->getCachedFormActions()"
            :full-width="$this->hasFullWidthFormActions()"
        />
    </x-filament-panels::form>

    @if (count($relationManagers = $this->getRelationManagers()))
        <x-filament-panels::resources.relation-managers
            :active-manager="$this->activeRelationManager"
            :managers="$relationManagers"
            :owner-record="$record"
            :page-class="static::class"
        />
    @endif
</x-filament-panels::page>
```

기본 뷰에 포함된 모든 내용을 확인하려면, 프로젝트의 `vendor/filament/filament/resources/views/resources/pages/edit-record.blade.php` 파일을 확인할 수 있습니다.
