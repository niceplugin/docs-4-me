---
title: 테스트
---
# [액션] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성되었습니다. Pest의 Livewire 플러그인을 테스트에 사용하려면 Pest 문서의 플러그인 설치 안내를 따라주세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만 PHPUnit에 맞게 쉽게 변환할 수 있습니다.

모든 액션은 Livewire 컴포넌트에 마운트되므로, 우리는 어디서나 Livewire 테스트 헬퍼를 사용합니다. Livewire 컴포넌트를 테스트해본 적이 없다면, [이 가이드](/livewire/3.x/testing)를 먼저 읽어보세요.

## 시작하기 {#getting-started}

액션을 호출하려면 `callAction()`에 이름이나 클래스를 전달하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('송장 전송이 가능하다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send');

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
        ->callAction('send', data: [
            'email' => $email = fake()->email(),
        ])
        ->assertHasNoActionErrors();

    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($email);
});
```

액션의 데이터를 즉시 호출하지 않고 설정만 하고 싶다면 `setActionData()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장 전송이 가능하다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountAction('send')
        ->setActionData([
            'email' => $email = fake()->email(),
        ])
});
```

## 실행 {#execution}

액션이 중단되었는지 확인하려면 `assertActionHalted()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장에 이메일 주소가 없으면 전송을 중단한다', function () {
    $invoice = Invoice::factory(['email' => null])->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send')
        ->assertActionHalted('send');
});
```

## 모달 내용 {#modal-content}

모달의 내용을 검증하려면, 액션을 호출하는 대신 먼저 마운트해야 합니다(호출하면 모달이 닫힙니다). 그런 다음 [Livewire assertion](/livewire/3.x/testing#assertions)인 `assertSee()` 등을 사용하여 모달에 원하는 내용이 포함되어 있는지 검증할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('전송 전에 대상 주소를 확인한다', function () {
    $invoice = Invoice::factory()->create();
    $recipientEmail = $invoice->company->primaryContact->email;

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountAction('send')
        ->assertSee($recipientEmail);
});
```

## 에러 {#errors}

`assertHasNoActionErrors()`는 액션 폼 제출 시 검증 에러가 발생하지 않았는지 확인하는 데 사용됩니다.

데이터에 검증 에러가 발생했는지 확인하려면, Livewire의 `assertHasErrors()`와 유사하게 `assertHasActionErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('송장 수신자 이메일을 검증할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callAction('send', data: [
            'email' => Str::random(),
        ])
        ->assertHasActionErrors(['email' => ['email']]);
});
```

액션이 데이터로 미리 채워져 있는지 확인하려면 `assertActionDataSet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('기본적으로 주요 연락처로 송장을 전송할 수 있다', function () {
    $invoice = Invoice::factory()->create();
    $recipientEmail = $invoice->company->primaryContact->email;

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountAction('send')
        ->assertActionDataSet([
            'email' => $recipientEmail,
        ])
        ->callMountedAction()
        ->assertHasNoActionErrors();

    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($recipientEmail);
});
```

## 액션 상태 {#action-state}

액션이 존재하는지 또는 존재하지 않는지 확인하려면 `assertActionExists()` 또는 `assertActionDoesNotExist()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장은 전송할 수 있지만, 전송 취소는 불가능하다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionExists('send')
        ->assertActionDoesNotExist('unsend');
});
```

액션이 사용자에게 숨겨져 있는지 또는 보이는지 확인하려면 `assertActionHidden()` 또는 `assertActionVisible()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장만 인쇄할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHidden('send')
        ->assertActionVisible('print');
});
```

액션이 사용자에게 활성화되어 있는지 또는 비활성화되어 있는지 확인하려면 `assertActionEnabled()` 또는 `assertActionDisabled()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('전송된 송장만 인쇄할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionDisabled('send')
        ->assertActionEnabled('print');
});
```

액션 집합이 올바른 순서로 존재하는지 확인하려면 `assertActionsExistInOrder()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('액션이 순서대로 존재할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionsExistInOrder(['send', 'export']);
});
```

액션이 사용자에게 숨겨져 있는지 확인하려면 `assertActionHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장을 전송할 수 없다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHidden('send');
});
```

## 버튼 모양 {#button-appearance}

액션에 올바른 라벨이 있는지 확인하려면 `assertActionHasLabel()`과 `assertActionDoesNotHaveLabel()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('send 액션에 올바른 라벨이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHasLabel('send', 'Email Invoice')
        ->assertActionDoesNotHaveLabel('send', 'Send');
});
```

액션 버튼이 올바른 아이콘을 표시하는지 확인하려면 `assertActionHasIcon()` 또는 `assertActionDoesNotHaveIcon()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('활성화 시 send 버튼에 올바른 아이콘이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionEnabled('send')
        ->assertActionHasIcon('send', 'envelope-open')
        ->assertActionDoesNotHaveIcon('send', 'envelope');
});
```

액션 버튼이 올바른 색상을 표시하는지 확인하려면 `assertActionHasColor()` 또는 `assertActionDoesNotHaveColor()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('액션이 적절한 색상을 표시한다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHasColor('delete', 'danger')
        ->assertActionDoesNotHaveColor('print', 'danger');
});
```

## URL {#url}

액션에 올바른 URL이 있는지 확인하려면 `assertActionHasUrl()`, `assertActionDoesNotHaveUrl()`, `assertActionShouldOpenUrlInNewTab()`, `assertActionShouldNotOpenUrlInNewTab()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('올바른 Filament 사이트로 연결된다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertActionHasUrl('filament', 'https://filamentphp.com/')
        ->assertActionDoesNotHaveUrl('filament', 'https://github.com/filamentphp/filament')
        ->assertActionShouldOpenUrlInNewTab('filament')
        ->assertActionShouldNotOpenUrlInNewTab('github');
});
```
