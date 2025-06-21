---
title: 복제 액션
---
# [액션.내장된액션] ReplicateAction
## 개요 {#overview}

Filament에는 Eloquent 레코드를 [복제](/laravel/12.x/eloquent#replicating-models)할 수 있는 미리 만들어진 액션이 포함되어 있습니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
    ->record($this->post)
```

테이블 행을 복제하고 싶다면, 대신 `Filament\Tables\Actions\ReplicateAction`을 사용할 수 있습니다:

```php
use Filament\Tables\Actions\ReplicateAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            ReplicateAction::make(),
            // ...
        ]);
}
```

## 속성 제외하기 {#excluding-attributes}

`excludeAttributes()` 메서드는 복제에서 제외할 컬럼을 지정하는 데 사용됩니다:

```php
ReplicateAction::make()
    ->excludeAttributes(['slug'])
```

## 폼에 채우기 전 데이터 커스터마이징 {#customizing-data-before-filling-the-form}

레코드의 데이터를 폼에 채우기 전에 수정하고 싶을 수 있습니다. 이를 위해 `mutateRecordDataUsing()` 메서드를 사용하여 `$data` 배열을 수정하고, 수정된 버전을 폼에 채우기 전에 반환할 수 있습니다:

```php
ReplicateAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

## 복제 후 리디렉션 설정하기 {#redirecting-after-replication}

폼이 제출될 때 커스텀 리디렉션을 설정하려면 `successRedirectUrl()` 메서드를 사용할 수 있습니다:

```php
ReplicateAction::make()
    ->successRedirectUrl(route('posts.list'))
```

복제된 레코드를 사용하여 리디렉션하고 싶다면, `$replica` 파라미터를 사용하세요:

```php
use Illuminate\Database\Eloquent\Model;

ReplicateAction::make()
    ->successRedirectUrl(fn (Model $replica): string => route('posts.edit', [
        'post' => $replica,
    ]))
```

## 복제 알림 커스터마이징 {#customizing-the-replicate-notification}

레코드가 성공적으로 복제되면, 사용자의 액션 성공을 알리는 알림이 전송됩니다.

이 알림의 제목을 커스터마이징하려면 `successNotificationTitle()` 메서드를 사용하세요:

```php
ReplicateAction::make()
    ->successNotificationTitle('카테고리 복제됨')
```

`successNotification()` 메서드를 사용하여 전체 알림을 커스터마이징할 수도 있습니다:

```php
use Filament\Notifications\Notification;

ReplicateAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('카테고리 복제됨')
            ->body('카테고리가 성공적으로 복제되었습니다.'),
    )
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하여 액션의 라이프사이클 내 여러 지점에서 코드를 실행할 수 있습니다. 예를 들어, 복제본이 저장되기 전 등입니다.

```php
use Illuminate\Database\Eloquent\Model;

ReplicateAction::make()
    ->before(function () {
        // 레코드가 복제되기 전에 실행됩니다.
    })
    ->beforeReplicaSaved(function (Model $replica): void {
        // 레코드가 복제된 후, 데이터베이스에 저장되기 전에 실행됩니다.
    })
    ->after(function (Model $replica): void {
        // 복제본이 데이터베이스에 저장된 후 실행됩니다.
    })
```

## 복제 프로세스 중단하기 {#halting-the-replication-process}

언제든지 라이프사이클 훅 내부에서 `$action->halt()`를 호출하여 전체 복제 프로세스를 중단할 수 있습니다:

```php
use App\Models\Post;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;

ReplicateAction::make()
    ->before(function (ReplicateAction $action, Post $record) {
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
