---
title: 알림
---
# [패널] 알림
## 개요 {#overview}

패널 빌더는 [Notifications](../notifications/sending-notifications) 패키지를 사용하여 사용자에게 메시지를 보냅니다. 알림을 쉽게 보내는 방법을 알아보려면 [문서](../notifications/sending-notifications)를 읽어보세요.

[데이터베이스 알림](../notifications/database-notifications)을 받고 싶다면, [설정](configuration)에서 이를 활성화할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->databaseNotifications();
}
```

데이터베이스 알림의 [폴링](../notifications/database-notifications#polling-for-new-database-notifications)도 제어할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->databaseNotifications()
        ->databaseNotificationsPolling('30s');
}
```

## 패널에서 웹소켓 설정하기 {#setting-up-websockets-in-a-panel}

패널 빌더는 실시간 브로드캐스트 및 데이터베이스 알림에 대한 내장 지원을 제공합니다. 하지만 모든 기능을 연결하고 작동시키기 위해 설치 및 설정해야 할 몇 가지 영역이 있습니다.

1. 아직 읽지 않았다면, Laravel 문서의 [브로드캐스팅](/laravel/12.x/broadcasting)을 참고하세요.
2. 브로드캐스팅을 [서버 사이드 웹소켓 통합](/laravel/12.x/broadcasting#server-side-installation) (예: Pusher)으로 사용하도록 설치 및 설정하세요.
3. 아직 하지 않았다면, Filament 패키지 설정을 퍼블리시해야 합니다:

```bash
php artisan vendor:publish --tag=filament-config
```

4. `config/filament.php`에서 설정을 수정하고, `broadcasting.echo` 섹션의 주석을 해제한 뒤 브로드캐스팅 설치에 맞게 올바르게 설정되어 있는지 확인하세요.
5. [관련 `VITE_*` 항목](/laravel/12.x/broadcasting#client-pusher-channels)이 `.env` 파일에 존재하는지 확인하세요.
6. `php artisan route:clear` 및 `php artisan config:clear`로 관련 캐시를 지워 새로운 설정이 적용되도록 하세요.

이제 패널이 브로드캐스팅 서비스에 연결되어야 합니다. 예를 들어, Pusher 디버그 콘솔에 로그인하면 페이지를 로드할 때마다 들어오는 연결을 볼 수 있습니다.

실시간 알림을 보내려면 [브로드캐스트 알림 문서](../notifications/broadcast-notifications)를 참고하세요.
