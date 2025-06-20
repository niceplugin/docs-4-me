---
title: 삭제 액션
---
# [액션.내장된액션] DeleteAction
## 개요 {#overview}

Filament에는 Eloquent 레코드를 삭제할 수 있는 미리 만들어진 액션이 포함되어 있습니다. 트리거 버튼을 클릭하면 모달이 사용자에게 확인을 요청합니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Actions\DeleteAction;

DeleteAction::make()
    ->record($this->post)
```

테이블 행을 삭제하려면 `Filament\Tables\Actions\DeleteAction`을 대신 사용할 수 있으며, 여러 개를 한 번에 삭제하려면 `Filament\Tables\Actions\DeleteBulkAction`을 사용할 수 있습니다:

```php
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            DeleteAction::make(),
            // ...
        ])
        ->bulkActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
                // ...
            ]),
        ]);
}
```

## 삭제 후 리디렉션 {#redirecting-after-deleting}

레코드가 삭제될 때 `successRedirectUrl()` 메서드를 사용하여 커스텀 리디렉션을 설정할 수 있습니다:

```php
DeleteAction::make()
    ->successRedirectUrl(route('posts.list'))
```

## 삭제 알림 커스터마이징 {#customizing-the-delete-notification}

레코드가 성공적으로 삭제되면, 사용자의 작업 성공을 알리는 알림이 전송됩니다.

이 알림의 제목을 커스터마이징하려면 `successNotificationTitle()` 메서드를 사용하세요:

```php
DeleteAction::make()
    ->successNotificationTitle('사용자가 삭제되었습니다')
```

전체 알림을 커스터마이징하려면 `successNotification()` 메서드를 사용하세요:

```php
use Filament\Notifications\Notification;

DeleteAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('사용자가 삭제되었습니다')
            ->body('사용자가 성공적으로 삭제되었습니다.'),
    )
```

알림을 완전히 비활성화하려면 `successNotification(null)` 메서드를 사용하세요:

```php
DeleteAction::make()
    ->successNotification(null)
```

## 라이프사이클 훅 {#lifecycle-hooks}

레코드가 삭제되기 전과 후에 코드를 실행하려면 `before()` 및 `after()` 메서드를 사용할 수 있습니다:

```php
DeleteAction::make()
    ->before(function () {
        // ...
    })
    ->after(function () {
        // ...
    })
```
