---
title: CreateAction
---
# [액션.내장된액션] CreateAction
## 개요 {#overview}

Filament에는 Eloquent 레코드를 생성할 수 있는 내장된 액션이 포함되어 있습니다. 트리거 버튼을 클릭하면 모달이 열리고 그 안에 폼이 표시됩니다. 사용자가 폼을 작성하면 해당 데이터가 검증되어 데이터베이스에 저장됩니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Actions\CreateAction;
use Filament\Forms\Components\TextInput;

CreateAction::make()
    ->model(Post::class)
    ->form([
        TextInput::make('title')
            ->required()
            ->maxLength(255),
        // ...
    ])
```

이 액션을 테이블의 헤더에 추가하고 싶다면, `Filament\Tables\Actions\CreateAction`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Tables\Actions\CreateAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->headerActions([
            CreateAction::make()
                ->form([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    // ...
                ]),
        ]);
}
```

## 저장 전에 데이터 커스터마이징하기 {#customizing-data-before-saving}

때때로, 폼 데이터를 데이터베이스에 최종적으로 저장하기 전에 수정하고 싶을 수 있습니다. 이를 위해 `mutateFormDataUsing()` 메서드를 사용할 수 있으며, 이 메서드는 배열 형태의 `$data`에 접근할 수 있고, 수정된 버전을 반환합니다:

```php
CreateAction::make()
    ->mutateFormDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

## 생성 프로세스 커스터마이징하기 {#customizing-the-creation-process}

`using()` 메서드를 사용하여 레코드가 생성되는 방식을 조정할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

CreateAction::make()
    ->using(function (array $data, string $model): Model {
        return $model::create($data);
    })
```

`$model`은 모델의 클래스 이름이지만, 원한다면 직접 하드코딩한 클래스로 대체할 수도 있습니다.

## 생성 후 리디렉션 {#redirecting-after-creation}

폼이 제출될 때 `successRedirectUrl()` 메서드를 사용하여 커스텀 리디렉션을 설정할 수 있습니다:

```php
CreateAction::make()
    ->successRedirectUrl(route('posts.list'))
```

생성된 레코드를 사용하여 리디렉션하고 싶다면, `$record` 파라미터를 사용하세요:

```php
use Illuminate\Database\Eloquent\Model;

CreateAction::make()
    ->successRedirectUrl(fn (Model $record): string => route('posts.edit', [
        'post' => $record,
    ]))
```

## 저장 알림 커스터마이징 {#customizing-the-save-notification}

레코드가 성공적으로 생성되면, 사용자의 작업이 성공했음을 알리는 알림이 사용자에게 전송됩니다.

이 알림의 제목을 커스터마이징하려면, `successNotificationTitle()` 메서드를 사용하세요:

```php
CreateAction::make()
    ->successNotificationTitle('사용자 등록 완료')
```

알림 전체를 커스터마이징하려면 `successNotification()` 메서드를 사용하세요:

```php
use Filament\Notifications\Notification;

CreateAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('사용자 등록 완료')
            ->body('사용자가 성공적으로 생성되었습니다.'),
    )
```

알림을 완전히 비활성화하려면, `successNotification(null)` 메서드를 사용하세요:

```php
CreateAction::make()
    ->successNotification(null)
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅은 액션의 라이프사이클 내 여러 지점에서 코드를 실행하는 데 사용할 수 있으며, 예를 들어 폼이 저장되기 전에 실행할 수 있습니다.

여러 가지 사용 가능한 훅이 있습니다:

```php
CreateAction::make()
    ->beforeFormFilled(function () {
        // 폼 필드가 기본값으로 채워지기 전에 실행됩니다.
    })
    ->afterFormFilled(function () {
        // 폼 필드가 기본값으로 채워진 후에 실행됩니다.
    })
    ->beforeFormValidated(function () {
        // 폼이 제출될 때 폼 필드가 검증되기 전에 실행됩니다.
    })
    ->afterFormValidated(function () {
        // 폼이 제출될 때 폼 필드가 검증된 후에 실행됩니다.
    })
    ->before(function () {
        // 폼 필드가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->after(function () {
        // 폼 필드가 데이터베이스에 저장된 후에 실행됩니다.
    })
```

## 생성 프로세스 중단하기 {#halting-the-creation-process}

언제든지 라이프사이클 훅이나 변이 메서드 내부에서 `$action->halt()`를 호출하여 전체 생성 프로세스를 중단할 수 있습니다:

```php
use App\Models\Post;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;

CreateAction::make()
    ->before(function (CreateAction $action, Post $record) {
        if (! $record->team->subscribed()) {
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
        
            $action->halt();
        }
    })
```

액션 모달도 함께 닫고 싶다면, 중단하는 대신 액션을 완전히 `cancel()`할 수 있습니다:

```php
$action->cancel();
```

## 위자드 사용하기 {#using-a-wizard}

생성 프로세스를 손쉽게 다단계 위자드로 변환할 수 있습니다. `form()` 대신, `steps()` 배열을 정의하고 `Step` 객체들을 전달하세요:

```php
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Wizard\Step;

CreateAction::make()
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

이제 새 레코드를 생성하여 위자드가 동작하는 모습을 확인해보세요! 편집(Edit) 기능은 여전히 리소스 클래스 내에 정의된 폼을 사용합니다.

모든 단계를 건너뛸 수 있도록 자유로운 이동을 허용하고 싶다면, `skippableSteps()` 메서드를 사용하세요:

```php
CreateAction::make()
    ->steps([
        // ...
    ])
    ->skippableSteps()
```

## "다른 항목 생성" 비활성화 {#disabling-create-another}

모달에서 "다른 항목 생성" 버튼을 제거하고 싶다면, `createAnother(false)` 메서드를 사용할 수 있습니다:

```php
CreateAction::make()
    ->createAnother(false)
```
