---
title: 알림 커스터마이징
---
# [알림] 알림 커스터마이징
## 개요 {#overview}

알림은 기본적으로 완전히 스타일링되어 제공됩니다. 그러나 직접 스타일을 적용하거나 사용자 지정 뷰를 사용하여 알림을 렌더링하고 싶다면 여러 가지 옵션이 있습니다.

## 알림 스타일링 {#styling-notifications}

알림에는 스타일을 적용할 수 있는 전용 CSS 클래스가 있습니다. 브라우저의 검사 도구를 열어 어떤 클래스를 타겟팅해야 하는지 확인하세요.

## 알림 위치 지정 {#positioning-notifications}

서비스 프로바이더나 미들웨어에서 `Notifications::alignment()`와 `Notifications::verticalAlignment()`를 호출하여 알림의 정렬을 설정할 수 있습니다. `Alignment::Start`, `Alignment::Center`, `Alignment::End`, `VerticalAlignment::Start`, `VerticalAlignment::Center`, `VerticalAlignment::End` 중 하나를 전달할 수 있습니다:

```php
use Filament\Notifications\Livewire\Notifications;
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\VerticalAlignment;

Notifications::alignment(Alignment::Start);
Notifications::verticalAlignment(VerticalAlignment::End);
```

## 사용자 지정 알림 뷰 사용하기 {#using-a-custom-notification-view}

위의 CSS 클래스를 사용해서 원하는 커스터마이징이 불가능하다면, 알림을 렌더링할 사용자 지정 뷰를 만들 수 있습니다. 알림 뷰를 설정하려면 서비스 프로바이더의 `boot()` 메서드 안에서 정적 `configureUsing()` 메서드를 호출하고 사용할 뷰를 지정하세요:

```php
use Filament\Notifications\Notification;

Notification::configureUsing(function (Notification $notification): void {
    $notification->view('filament.notifications.notification');
});
```

다음으로, 이 예시에서는 `resources/views/filament/notifications/notification.blade.php`에 뷰를 생성하세요. 뷰는 패키지의 기본 알림 컴포넌트를 사용하여 알림 기능을 제공하고, 사용 가능한 `$notification` 변수를 `notification` 속성으로 전달해야 합니다. 아래는 사용자 지정 알림 뷰를 만들기 위해 필요한 최소한의 예시입니다:

```blade
<x-filament-notifications::notification :notification="$notification">
    {{-- 알림 내용 --}}
</x-filament-notifications::notification>
```

모든 알림 속성에 대한 getter가 뷰에서 사용 가능합니다. 따라서 사용자 지정 알림 뷰는 다음과 같이 보일 수 있습니다:

```blade
<x-filament-notifications::notification
    :notification="$notification"
    class="flex w-80 rounded-lg transition duration-200"
    x-transition:enter-start="opacity-0"
    x-transition:leave-end="opacity-0"
>
    <h4>
        {{ $getTitle() }}
    </h4>

    <p>
        {{ $getDate() }}
    </p>

    <p>
        {{ $getBody() }}
    </p>

    <span x-on:click="close">
        닫기
    </span>
</x-filament-notifications::notification>
```

## 사용자 지정 알림 객체 사용하기 {#using-a-custom-notification-object}

패키지의 `Notification` 클래스에 정의되지 않은 추가 기능이 알림에 필요할 수 있습니다. 이럴 때는 패키지의 `Notification` 클래스를 확장하여 직접 `Notification` 클래스를 만들 수 있습니다. 예를 들어, 알림 디자인에 크기 속성이 필요할 수 있습니다.

`app/Notifications/Notification.php`에 있는 사용자 지정 `Notification` 클래스는 다음과 같을 수 있습니다:

```php
<?php

namespace App\Notifications;

use Filament\Notifications\Notification as BaseNotification;

class Notification extends BaseNotification
{
    protected string $size = 'md';

    public function toArray(): array
    {
        return [
            ...parent::toArray(),
            'size' => $this->getSize(),
        ];
    }

    public static function fromArray(array $data): static
    {
        return parent::fromArray($data)->size($data['size']);
    }

    public function size(string $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getSize(): string
    {
        return $this->size;
    }
}
```

다음으로, 서비스 프로바이더의 `register()` 메서드 안에서 사용자 지정 `Notification` 클래스를 컨테이너에 바인딩해야 합니다:

```php
use App\Notifications\Notification;
use Filament\Notifications\Notification as BaseNotification;

$this->app->bind(BaseNotification::class, Notification::class);
```

이제 기본 `Notification` 객체를 사용할 때와 동일하게 사용자 지정 `Notification` 클래스를 사용할 수 있습니다.
