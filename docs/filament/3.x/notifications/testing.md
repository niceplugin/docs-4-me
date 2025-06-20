---
title: 테스트
---
# [알림] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면, Pest 문서의 플러그인 설치 안내를 따라주세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만, 이를 PHPUnit에 쉽게 적용할 수도 있습니다.

## 세션 알림 테스트하기 {#testing-session-notifications}

세션을 사용하여 알림이 전송되었는지 확인하려면, `assertNotified()` 헬퍼를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('알림을 전송한다', function () {
    livewire(CreatePost::class)
        ->assertNotified();
});
```

```php
use Filament\Notifications\Notification;

it('알림을 전송한다', function () {
    Notification::assertNotified();
});
```

```php
use function Filament\Notifications\Testing\assertNotified;

it('알림을 전송한다', function () {
    assertNotified();
});
```

옵션으로 알림 제목을 전달하여 테스트할 수 있습니다:

```php
use Filament\Notifications\Notification;
use function Pest\Livewire\livewire;

it('알림을 전송한다', function () {
    livewire(CreatePost::class)
        ->assertNotified('Unable to create post');
});
```

또는 정확히 해당 알림이 전송되었는지 테스트할 수 있습니다:

```php
use Filament\Notifications\Notification;
use function Pest\Livewire\livewire;

it('알림을 전송한다', function () {
    livewire(CreatePost::class)
        ->assertNotified(
            Notification::make()
                ->danger()
                ->title('Unable to create post')
                ->body('Something went wrong.'),
        );
});
```

반대로, 알림이 전송되지 않았음을 단언할 수도 있습니다:

```php
use Filament\Notifications\Notification;
use function Pest\Livewire\livewire;

it('알림을 전송하지 않는다', function () {
    livewire(CreatePost::class)
        ->assertNotNotified()
        // 또는
        ->assertNotNotified('Unable to create post')
        // 또는
        ->assertNotNotified(
            Notification::make()
                ->danger()
                ->title('Unable to create post')
                ->body('Something went wrong.'),
        );
```
