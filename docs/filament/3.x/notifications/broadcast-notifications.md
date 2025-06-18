---
title: 브로드캐스트 알림
---
# [알림] 브로드캐스트 알림
## 개요 {#overview}

> 시작하려면, 패키지가 [설치](installation)되어 있는지 확인하세요. `@livewire('notifications')`가 Blade 레이아웃 어딘가에 포함되어 있어야 합니다.

기본적으로 Filament는 Laravel 세션을 통해 플래시 알림을 전송합니다. 하지만 알림이 실시간으로 사용자에게 "브로드캐스트"되길 원할 수도 있습니다. 예를 들어, 큐에 등록된 작업이 처리 완료된 후 임시 성공 알림을 전송하는 데 사용할 수 있습니다.

우리는 [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation)와의 네이티브 통합을 제공합니다. Echo가 설치되어 있는지, 그리고 [서버 사이드 웹소켓 통합](https://laravel.com/docs/broadcasting#server-side-installation) 예를 들어 Pusher와 같은 것이 설치되어 있는지 확인하세요.

## 브로드캐스트 알림 보내기 {#sending-broadcast-notifications}

상황에 따라 여러 가지 방법으로 브로드캐스트 알림을 보낼 수 있습니다.

다음과 같이 플루언트 API를 사용할 수 있습니다:

```php
use Filament\Notifications\Notification;

$recipient = auth()->user();

Notification::make()
    ->title('저장에 성공했습니다')
    ->broadcast($recipient);
```

또는, `notify()` 메서드를 사용할 수도 있습니다:

```php
use Filament\Notifications\Notification;

$recipient = auth()->user();

$recipient->notify(
    Notification::make()
        ->title('저장에 성공했습니다')
        ->toBroadcast(),
)
```

또는, 전통적인 [Laravel 알림 클래스](https://laravel.com/docs/notifications#generating-notifications)를 사용하여 `toBroadcast()` 메서드에서 알림을 반환할 수도 있습니다:

```php
use App\Models\User;
use Filament\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

public function toBroadcast(User $notifiable): BroadcastMessage
{
    return Notification::make()
        ->title('저장에 성공했습니다')
        ->getBroadcastMessage();
}
```
