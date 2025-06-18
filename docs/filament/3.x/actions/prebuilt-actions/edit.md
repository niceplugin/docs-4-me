---
title: EditAction
---
# [액션.내장된액션] EditAction
## 개요 {#overview}

Filament에는 Eloquent 레코드를 수정할 수 있는 내장된 액션이 포함되어 있습니다. 트리거 버튼을 클릭하면 모달이 열리고 그 안에 폼이 표시됩니다. 사용자가 폼을 작성하면 해당 데이터가 검증되어 데이터베이스에 저장됩니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;

EditAction::make()
    ->record($this->post)
    ->form([
        TextInput::make('title')
            ->required()
            ->maxLength(255),
        // ...
    ])
```

테이블 행을 수정하고 싶다면, 대신 `Filament\Tables\Actions\EditAction`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            EditAction::make()
                ->form([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    // ...
                ]),
        ]);
}
```

## 폼에 데이터를 채우기 전에 데이터 커스터마이징하기 {#customizing-data-before-filling-the-form}

레코드의 데이터를 폼에 채우기 전에 수정하고 싶을 수 있습니다. 이를 위해 `mutateRecordDataUsing()` 메서드를 사용하여 `$data` 배열을 수정하고, 수정된 버전을 폼에 채우기 전에 반환할 수 있습니다:

```php
EditAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

## 저장 전에 데이터 커스터마이징하기 {#customizing-data-before-saving}

때때로, 폼 데이터를 데이터베이스에 최종적으로 저장하기 전에 수정하고 싶을 수 있습니다. 이를 위해 `mutateFormDataUsing()` 메서드를 사용할 수 있으며, 이 메서드는 배열 형태의 `$data`에 접근하여 수정된 버전을 반환합니다:

```php
EditAction::make()
    ->mutateFormDataUsing(function (array $data): array {
        $data['last_edited_by_id'] = auth()->id();

        return $data;
    })
```

## 저장 프로세스 커스터마이징하기 {#customizing-the-saving-process}

`using()` 메서드를 사용하여 레코드가 업데이트되는 방식을 조정할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

EditAction::make()
    ->using(function (Model $record, array $data): Model {
        $record->update($data);

        return $record;
    })
```

## 저장 후 리디렉션 {#redirecting-after-saving}

폼이 제출될 때 `successRedirectUrl()` 메서드를 사용하여 커스텀 리디렉션을 설정할 수 있습니다:

```php
EditAction::make()
    ->successRedirectUrl(route('posts.list'))
```

생성된 레코드를 사용하여 리디렉션하고 싶다면, `$record` 파라미터를 사용할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

EditAction::make()
    ->successRedirectUrl(fn (Model $record): string => route('posts.view', [
        'post' => $record,
    ]))
```

## 저장 알림 커스터마이징 {#customizing-the-save-notification}

레코드가 성공적으로 업데이트되면, 사용자의 작업이 성공적으로 처리되었음을 알리는 알림이 사용자에게 전송됩니다.

이 알림의 제목을 커스터마이징하려면 `successNotificationTitle()` 메서드를 사용하세요:

```php
EditAction::make()
    ->successNotificationTitle('사용자가 업데이트되었습니다')
```

알림 전체를 커스터마이징하려면 `successNotification()` 메서드를 사용하세요:

```php
use Filament\Notifications\Notification;

EditAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('사용자가 업데이트되었습니다')
            ->body('사용자가 성공적으로 저장되었습니다.'),
    )
```

알림을 완전히 비활성화하려면 `successNotification(null)` 메서드를 사용하세요:

```php
EditAction::make()
    ->successNotification(null)
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅은 액션의 라이프사이클 내 여러 지점에서 코드를 실행하는 데 사용할 수 있으며, 예를 들어 폼이 저장되기 전에 실행할 수 있습니다.

여러 가지 사용 가능한 훅이 있습니다:

```php
EditAction::make()
    ->beforeFormFilled(function () {
        // 폼 필드가 데이터베이스에서 채워지기 전에 실행됩니다.
    })
    ->afterFormFilled(function () {
        // 폼 필드가 데이터베이스에서 채워진 후에 실행됩니다.
    })
    ->beforeFormValidated(function () {
        // 폼이 저장될 때 폼 필드가 검증되기 전에 실행됩니다.
    })
    ->afterFormValidated(function () {
        // 폼이 저장될 때 폼 필드가 검증된 후에 실행됩니다.
    })
    ->before(function () {
        // 폼 필드가 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->after(function () {
        // 폼 필드가 데이터베이스에 저장된 후에 실행됩니다.
    })
```

## 저장 프로세스 중단하기 {#halting-the-saving-process}

언제든지 라이프사이클 훅이나 변이 메서드 내부에서 `$action->halt()`를 호출하여 전체 저장 프로세스를 중단할 수 있습니다:

```php
use App\Models\Post;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Tables\Actions\EditAction;

EditAction::make()
    ->before(function (EditAction $action, Post $record) {
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
