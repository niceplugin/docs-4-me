---
title: ForceDeleteAction
---
# [액션.내장된액션] ForceDeleteAction
## 개요 {#overview}

Filament에는 [소프트 삭제](https://laravel.com/docs/eloquent#soft-deleting)된 Eloquent 레코드를 강제로 삭제할 수 있는 내장된 액션이 포함되어 있습니다. 트리거 버튼을 클릭하면 모달이 나타나 사용자에게 확인을 요청합니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Actions\ForceDeleteAction;

ForceDeleteAction::make()
    ->record($this->post)
```

테이블 행을 강제로 삭제하려면 `Filament\Tables\Actions\ForceDeleteAction`을 대신 사용할 수 있으며, 여러 개를 한 번에 강제로 삭제하려면 `Filament\Tables\Actions\ForceDeleteBulkAction`을 사용할 수 있습니다:

```php
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\ForceDeleteBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            ForceDeleteAction::make(),
            // ...
        ])
        ->bulkActions([
            BulkActionGroup::make([
                ForceDeleteBulkAction::make(),
                // ...
            ]),
        ]);
}
```

## 강제 삭제 후 리디렉션 {#redirecting-after-force-deleting}

폼이 제출될 때 `successRedirectUrl()` 메서드를 사용하여 커스텀 리디렉션을 설정할 수 있습니다:

```php
ForceDeleteAction::make()
    ->successRedirectUrl(route('posts.list'))
```

## 강제 삭제 알림 커스터마이징하기 {#customizing-the-force-delete-notification}

레코드가 성공적으로 강제 삭제되면, 사용자의 작업이 성공했음을 알리는 알림이 사용자에게 전송됩니다.

이 알림의 제목을 커스터마이징하려면 `successNotificationTitle()` 메서드를 사용하세요:

```php
ForceDeleteAction::make()
    ->successNotificationTitle('사용자가 강제 삭제되었습니다')
```

알림 전체를 커스터마이징하려면 `successNotification()` 메서드를 사용하세요:

```php
use Filament\Notifications\Notification;

ForceDeleteAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('사용자가 강제 삭제되었습니다')
            ->body('해당 사용자가 성공적으로 강제 삭제되었습니다.'),
    )
```

알림을 완전히 비활성화하려면 `successNotification(null)` 메서드를 사용하세요:

```php
ForceDeleteAction::make()
    ->successNotification(null)
```

## 라이프사이클 훅 {#lifecycle-hooks}

레코드가 강제 삭제되기 전과 후에 코드를 실행하려면 `before()`와 `after()` 메서드를 사용할 수 있습니다:

```php
ForceDeleteAction::make()
    ->before(function () {
        // ...
    })
    ->after(function () {
        // ...
    })
```
