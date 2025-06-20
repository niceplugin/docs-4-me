---
title: 레코드 생성
---
# [패널.리소스] 레코드 생성하기
## 저장 전에 데이터 커스터마이징하기 {#customizing-data-before-saving}

때때로, 폼 데이터가 데이터베이스에 최종적으로 저장되기 전에 수정하고 싶을 수 있습니다. 이를 위해 Create 페이지 클래스에 `mutateFormDataBeforeCreate()` 메서드를 정의할 수 있으며, 이 메서드는 배열 형태의 `$data`를 받아 수정된 버전을 반환합니다:

```php
protected function mutateFormDataBeforeCreate(array $data): array
{
    $data['user_id'] = auth()->id();

    return $data;
}
```

또는, 모달 액션에서 레코드를 생성하는 경우 [액션 문서](../../actions/prebuilt-actions/create#customizing-data-before-saving)를 참고하세요.

## 생성 프로세스 커스터마이징하기 {#customizing-the-creation-process}

Create 페이지 클래스에서 `handleRecordCreation()` 메서드를 사용하여 레코드가 생성되는 방식을 조정할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

protected function handleRecordCreation(array $data): Model
{
    return static::getModel()::create($data);
}
```

또는, 모달 액션에서 레코드를 생성하는 경우 [액션 문서](../../actions/prebuilt-actions/create#customizing-the-creation-process)를 참고하세요.

## 리다이렉트 커스터마이징하기 {#customizing-redirects}

기본적으로, 폼 저장 후 사용자는 리소스의 [수정 페이지](editing-records)나, 존재한다면 [보기 페이지](viewing-records)로 리다이렉트됩니다.

폼이 저장될 때 커스텀 리다이렉트를 설정하려면 Create 페이지 클래스에서 `getRedirectUrl()` 메서드를 오버라이드하면 됩니다.

예를 들어, 폼이 [목록 페이지](listing-records)로 리다이렉트되게 할 수 있습니다:

```php
protected function getRedirectUrl(): string
{
    return $this->getResource()::getUrl('index');
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

레코드가 성공적으로 생성되면, 사용자의 작업 성공을 알리는 알림이 전송됩니다.

이 알림의 제목을 커스터마이징하려면, create 페이지 클래스에 `getCreatedNotificationTitle()` 메서드를 정의하세요:

```php
protected function getCreatedNotificationTitle(): ?string
{
    return 'User registered';
}
```

또는, 모달 액션에서 레코드를 생성하는 경우 [액션 문서](../../actions/prebuilt-actions/create#customizing-the-save-notification)를 참고하세요.

알림 전체를 커스터마이징하려면 create 페이지 클래스에서 `getCreatedNotification()` 메서드를 오버라이드하세요:

```php
use Filament\Notifications\Notification;

protected function getCreatedNotification(): ?Notification
{
    return Notification::make()
        ->success()
        ->title('User registered')
        ->body('The user has been created successfully.');
}
```

알림을 완전히 비활성화하려면 create 페이지 클래스의 `getCreatedNotification()` 메서드에서 `null`을 반환하세요:

```php
use Filament\Notifications\Notification;

protected function getCreatedNotification(): ?Notification
{
    return null;
}
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하면 페이지의 라이프사이클 내 여러 지점에서 코드를 실행할 수 있습니다. 예를 들어, 폼이 저장되기 전에 코드를 실행할 수 있습니다. 훅을 설정하려면 Create 페이지 클래스에 훅 이름의 protected 메서드를 만드세요:

```php
protected function beforeCreate(): void
{
    // ...
}
```

이 예시에서, `beforeCreate()` 메서드의 코드는 폼 데이터가 데이터베이스에 저장되기 전에 호출됩니다.

Create 페이지에서 사용할 수 있는 여러 훅이 있습니다:

```php
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    // ...

    protected function beforeFill(): void
    {
        // 폼 필드가 기본값으로 채워지기 전에 실행됩니다.
    }

    protected function afterFill(): void
    {
        // 폼 필드가 기본값으로 채워진 후에 실행됩니다.
    }

    protected function beforeValidate(): void
    {
        // 폼이 제출될 때 폼 필드가 검증되기 전에 실행됩니다.
    }

    protected function afterValidate(): void
    {
        // 폼이 제출될 때 폼 필드가 검증된 후에 실행됩니다.
    }

    protected function beforeCreate(): void
    {
        // 폼 필드가 데이터베이스에 저장되기 전에 실행됩니다.
    }

    protected function afterCreate(): void
    {
        // 폼 필드가 데이터베이스에 저장된 후에 실행됩니다.
    }
}
```

또는, 모달 액션에서 레코드를 생성하는 경우 [액션 문서](../../actions/prebuilt-actions/create#lifecycle-hooks)를 참고하세요.

## 생성 프로세스 중단하기 {#halting-the-creation-process}

언제든지 라이프사이클 훅이나 변이 메서드 내에서 `$this->halt()`를 호출하여 전체 생성 프로세스를 중단할 수 있습니다:

```php
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;

protected function beforeCreate(): void
{
    if (! auth()->user()->team->subscribed()) {
        Notification::make()
            ->warning()
            ->title('You don\'t have an active subscription!')
            ->body('Choose a plan to continue.')
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

또는, 모달 액션에서 레코드를 생성하는 경우 [액션 문서](../../actions/prebuilt-actions/create#halting-the-creation-process)를 참고하세요.

## 권한 부여 {#authorization}

권한 부여를 위해, Filament는 앱에 등록된 모든 [모델 정책](https://laravel.com/docs/authorization#creating-policies)을 따릅니다.

모델 정책의 `create()` 메서드가 `true`를 반환하면 사용자는 Create 페이지에 접근할 수 있습니다.

## 위저드 사용하기 {#using-a-wizard}

생성 프로세스를 쉽게 다단계 위저드로 변환할 수 있습니다.

페이지 클래스에 해당 `HasWizard` 트레이트를 추가하세요:

```php
use App\Filament\Resources\CategoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    use CreateRecord\Concerns\HasWizard;
    
    protected static string $resource = CategoryResource::class;

    protected function getSteps(): array
    {
        return [
            // ...
        ];
    }
}
```

`getSteps()` 배열 안에서 [위저드 단계](../../forms/layout/wizard)를 반환하세요:

```php
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Wizard\Step;

protected function getSteps(): array
{
    return [
        Step::make('Name')
            ->description('카테고리에 명확하고 고유한 이름을 지정하세요')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->disabled()
                    ->required()
                    ->unique(Category::class, 'slug', fn ($record) => $record),
            ]),
        Step::make('Description')
            ->description('추가 세부 정보를 입력하세요')
            ->schema([
                MarkdownEditor::make('description')
                    ->columnSpan('full'),
            ]),
        Step::make('Visibility')
            ->description('누가 볼 수 있는지 제어하세요')
            ->schema([
                Toggle::make('is_visible')
                    ->label('고객에게 표시됩니다.')
                    ->default(true),
            ]),
    ];
}
```

또는, 모달 액션에서 레코드를 생성하는 경우 [액션 문서](../../actions/prebuilt-actions/create#using-a-wizard)를 참고하세요.

이제 새 레코드를 생성하여 위저드가 동작하는 것을 확인하세요! 수정은 여전히 리소스 클래스 내에 정의된 폼을 사용합니다.

모든 단계를 건너뛸 수 있도록 자유로운 이동을 허용하려면 `hasSkippableSteps()` 메서드를 오버라이드하세요:

```php
public function hasSkippableSteps(): bool
{
    return true;
}
```

### 리소스 폼과 위저드 간 필드 공유하기 {#sharing-fields-between-the-resource-form-and-wizards}

리소스 폼과 위저드 단계 간의 반복을 줄이고 싶다면, 필드를 위한 public static 리소스 함수를 추출하는 것이 좋습니다. 이를 통해 리소스나 위저드에서 필드 인스턴스를 쉽게 가져올 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;

class CategoryResource extends Resource
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                static::getNameFormField(),
                static::getSlugFormField(),
                // ...
            ]);
    }
    
    public static function getNameFormField(): Forms\Components\TextInput
    {
        return TextInput::make('name')
            ->required()
            ->live()
            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)));
    }
    
    public static function getSlugFormField(): Forms\Components\TextInput
    {
        return TextInput::make('slug')
            ->disabled()
            ->required()
            ->unique(Category::class, 'slug', fn ($record) => $record);
    }
}
```

```php
use App\Filament\Resources\CategoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    use CreateRecord\Concerns\HasWizard;
    
    protected static string $resource = CategoryResource::class;

    protected function getSteps(): array
    {
        return [
            Step::make('Name')
                ->description('카테고리에 명확하고 고유한 이름을 지정하세요')
                ->schema([
                    CategoryResource::getNameFormField(),
                    CategoryResource::getSlugFormField(),
                ]),
            // ...
        ];
    }
}
```

## 리소스 레코드 가져오기 {#importing-resource-records}

Filament에는 [목록 페이지](listing-records)의 `getHeaderActions()`에 추가할 수 있는 `ImportAction`이 포함되어 있습니다. 이를 통해 사용자는 CSV 데이터를 업로드하여 리소스에 가져올 수 있습니다:

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions;

protected function getHeaderActions(): array
{
    return [
        Actions\ImportAction::make()
            ->importer(ProductImporter::class),
        Actions\CreateAction::make(),
    ];
}
```

"importer" 클래스는 Filament에 각 CSV 행을 어떻게 가져올지 알려주기 위해 [생성되어야 합니다](../../actions/prebuilt-actions/import#creating-an-importer). `ImportAction`에 대한 모든 내용은 [액션 문서](../../actions/prebuilt-actions/import)에서 확인할 수 있습니다.

## 커스텀 액션 {#custom-actions}

"액션"은 페이지에 표시되는 버튼으로, 사용자가 페이지에서 Livewire 메서드를 실행하거나 URL을 방문할 수 있게 해줍니다.

리소스 페이지에서 액션은 보통 두 곳에 있습니다: 페이지 오른쪽 상단과 폼 아래입니다.

예를 들어, Create 페이지 헤더에 새 버튼 액션을 추가할 수 있습니다:

```php
use App\Filament\Imports\UserImporter;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    // ...

    protected function getHeaderActions(): array
    {
        return [
            Actions\ImportAction::make()
                ->importer(UserImporter::class),
        ];
    }
}
```

또는, 폼 아래 "생성" 버튼 옆에 새 버튼을 추가할 수 있습니다:

```php
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    // ...

    protected function getFormActions(): array
    {
        return [
            ...parent::getFormActions(),
            Action::make('close')->action('createAndClose'),
        ];
    }

    public function createAndClose(): void
    {
        // ...
    }
}
```

전체 액션 API를 보려면 [페이지 섹션](../pages#adding-actions-to-pages)을 방문하세요.

### 헤더에 생성 액션 버튼 추가하기 {#adding-a-create-action-button-to-the-header}

"생성" 버튼은 `getHeaderActions()` 메서드를 오버라이드하고 `getCreateFormAction()`을 사용하여 페이지 헤더로 이동할 수 있습니다. 이때, 액션이 `form` ID를 가진 폼을 제출하도록 `formId()`를 전달해야 합니다. 이는 페이지 뷰에서 사용되는 `<form>`의 ID입니다:

```php
protected function getHeaderActions(): array
{
    return [
        $this->getCreateFormAction()
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

## 커스텀 뷰 {#custom-view}

더 많은 커스터마이징을 위해, 페이지 클래스의 static `$view` 프로퍼티를 앱의 커스텀 뷰로 오버라이드할 수 있습니다:

```php
protected static string $view = 'filament.resources.users.pages.create-user';
```

이는 `resources/views/filament/resources/users/pages/create-user.blade.php`에 뷰를 생성했다고 가정합니다.

해당 뷰에 들어갈 수 있는 기본 예시는 다음과 같습니다:

```blade
<x-filament-panels::page>
    <x-filament-panels::form wire:submit="create">
        {{ $this->form }}

        <x-filament-panels::form.actions
            :actions="$this->getCachedFormActions()"
            :full-width="$this->hasFullWidthFormActions()"
        />
    </x-filament-panels::form>
</x-filament-panels::page>
```

기본 뷰에 포함된 모든 내용을 확인하려면, 프로젝트의 `vendor/filament/filament/resources/views/resources/pages/create-record.blade.php` 파일을 확인할 수 있습니다.
