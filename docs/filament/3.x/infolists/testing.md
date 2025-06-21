---
title: 테스트
---
# [인포리스트] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면 Pest 문서의 플러그인 설치 안내를 따라 하세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만, PHPUnit에 맞게 쉽게 변환할 수 있습니다.

Infolist Builder는 Livewire 컴포넌트에서 동작하므로, [Livewire 테스트 헬퍼](/livewire/3.x/testing)를 사용할 수 있습니다. 하지만, 인포리스트에서 사용할 수 있는 커스텀 테스트 헬퍼도 제공합니다:

## 액션 {#actions}

액션을 호출하려면 인포리스트 컴포넌트 키와 액션 이름을 `callInfolistAction()`에 전달하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('송장 전송이 가능하다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callInfolistAction('customer', 'send', infolistName: 'infolist');

    expect($invoice->refresh())
        ->isSent()->toBeTrue();
});
```

액션에 데이터를 배열로 전달하려면 `data` 파라미터를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('송장 전송이 가능하다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callInfolistAction('customer', 'send', data: [
            'email' => $email = fake()->email(),
        ])
        ->assertHasNoInfolistActionErrors();

    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($email);
});
```

액션의 데이터를 즉시 호출하지 않고 설정만 하고 싶다면, `setInfolistActionData()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장 전송이 가능하다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountInfolistAction('customer', 'send')
        ->setInfolistActionData([
            'email' => $email = fake()->email(),
        ])
});
```

### 실행 {#execution}

액션이 중단되었는지 확인하려면 `assertInfolistActionHalted()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장에 이메일 주소가 없으면 전송을 중단한다', function () {
    $invoice = Invoice::factory(['email' => null])->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callInfolistAction('customer', 'send')
        ->assertInfolistActionHalted('customer', 'send');
});
```

### 에러 {#errors}

`assertHasNoInfolistActionErrors()`는 액션 폼 제출 시 검증 오류가 발생하지 않았는지 확인하는 데 사용됩니다.

데이터에 검증 오류가 발생했는지 확인하려면, Livewire의 `assertHasErrors()`와 유사하게 `assertHasInfolistActionErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('송장 수신자 이메일을 검증할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callInfolistAction('customer', 'send', data: [
            'email' => Str::random(),
        ])
        ->assertHasInfolistActionErrors(['email' => ['email']]);
});
```

액션이 데이터로 미리 채워져 있는지 확인하려면, `assertInfolistActionDataSet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('기본적으로 주요 연락처로 송장을 전송할 수 있다', function () {
    $invoice = Invoice::factory()->create();
    $recipientEmail = $invoice->company->primaryContact->email;

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountInfolistAction('customer', 'send')
        ->assertInfolistActionDataSet([
            'email' => $recipientEmail,
        ])
        ->callMountedInfolistAction()
        ->assertHasNoInfolistActionErrors();
        
    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($recipientEmail);
});
```

### 액션 상태 {#action-state}

인포리스트에 액션이 존재하는지 또는 존재하지 않는지 확인하려면, `assertInfolistActionExists()` 또는 `assertInfolistActionDoesNotExist()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장은 전송할 수 있지만, 전송 취소는 할 수 없다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionExists('customer', 'send')
        ->assertInfolistActionDoesNotExist('customer', 'unsend');
});
```

사용자에게 액션이 숨겨져 있거나 보이는지 확인하려면, `assertInfolistActionHidden()` 또는 `assertInfolistActionVisible()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('고객만 출력할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionHidden('customer', 'send')
        ->assertInfolistActionVisible('customer', 'print');
});
```

사용자에게 액션이 활성화되어 있거나 비활성화되어 있는지 확인하려면, `assertInfolistActionEnabled()` 또는 `assertInfolistActionDisabled()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('전송된 송장에 대해서만 고객을 출력할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionDisabled('customer', 'send')
        ->assertInfolistActionEnabled('customer', 'print');
});
```

액션이 사용자에게 숨겨져 있는지 확인하려면, `assertInfolistActionHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장을 전송할 수 없다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionHidden('customer', 'send');
});
```

### 버튼 모양 {#button-appearance}

액션에 올바른 라벨이 있는지 확인하려면, `assertInfolistActionHasLabel()`과 `assertInfolistActionDoesNotHaveLabel()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('send 액션에 올바른 라벨이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionHasLabel('customer', 'send', 'Email Invoice')
        ->assertInfolistActionDoesNotHaveLabel('customer', 'send', 'Send');
});
```

액션 버튼이 올바른 아이콘을 표시하는지 확인하려면, `assertInfolistActionHasIcon()` 또는 `assertInfolistActionDoesNotHaveIcon()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('활성화 시 send 버튼에 올바른 아이콘이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionEnabled('customer', 'send')
        ->assertInfolistActionHasIcon('customer', 'send', 'envelope-open')
        ->assertInfolistActionDoesNotHaveIcon('customer', 'send', 'envelope');
});
```

액션 버튼이 올바른 색상을 표시하는지 확인하려면, `assertInfolistActionHasColor()` 또는 `assertInfolistActionDoesNotHaveColor()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('액션이 올바른 색상을 표시한다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionHasColor('customer', 'delete', 'danger')
        ->assertInfolistActionDoesNotHaveColor('customer', 'print', 'danger');
});
```

### URL {#url}

액션에 올바른 URL이 있는지 확인하려면, `assertInfolistActionHasUrl()`, `assertInfolistActionDoesNotHaveUrl()`, `assertInfolistActionShouldOpenUrlInNewTab()`, `assertInfolistActionShouldNotOpenUrlInNewTab()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('올바른 Filament 사이트로 연결된다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertInfolistActionHasUrl('customer', 'filament', 'https://filamentphp.com/')
        ->assertInfolistActionDoesNotHaveUrl('customer', 'filament', 'https://github.com/filamentphp/filament')
        ->assertInfolistActionShouldOpenUrlInNewTab('customer', 'filament')
        ->assertInfolistActionShouldNotOpenUrlInNewTab('customer', 'github');
});
```
