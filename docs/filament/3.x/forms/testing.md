---
title: 테스트
---
# [폼] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면, Pest 문서의 플러그인 설치 안내를 따라주세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만, PHPUnit에도 쉽게 적용할 수 있습니다.

Form Builder는 Livewire 컴포넌트에서 동작하므로, [Livewire 테스트 헬퍼](https://livewire.laravel.com/docs/testing)를 사용할 수 있습니다. 하지만, 폼과 함께 사용할 수 있는 커스텀 테스트 헬퍼도 제공합니다:

## 폼 채우기 {#filling-a-form}

폼에 데이터를 채우려면, `fillForm()`에 데이터를 전달하세요:

```php
use function Pest\Livewire\livewire;

livewire(CreatePost::class)
    ->fillForm([
        'title' => fake()->sentence(),
        // ...
    ]);
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `fillForm([...], 'createPostForm')`을 사용하여 채우고자 하는 폼을 지정할 수 있습니다.

폼에 데이터가 있는지 확인하려면 `assertFormSet()`을 사용하세요:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('제목에서 자동으로 슬러그를 생성할 수 있다', function () {
    $title = fake()->sentence();

    livewire(CreatePost::class)
        ->fillForm([
            'title' => $title,
        ])
        ->assertFormSet([
            'slug' => Str::slug($title),
        ]);
});
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `assertFormSet([...], 'createPostForm')`을 사용하여 확인하고자 하는 폼을 지정할 수 있습니다.

`assertFormSet()` 메서드에 함수를 전달하여 폼 `$state`에 접근하고 추가적인 검증을 수행할 수도 있습니다:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('공백 없이 제목에서 자동으로 슬러그를 생성할 수 있다', function () {
    $title = fake()->sentence();

    livewire(CreatePost::class)
        ->fillForm([
            'title' => $title,
        ])
        ->assertFormSet(function (array $state): array {
            expect($state['slug'])
                ->not->toContain(' ');
                
            return [
                'slug' => Str::slug($title),
            ];
        });
});
```

함수에서 배열을 반환하면, Filament가 함수 실행 후에도 폼 상태를 계속 검증할 수 있습니다.

## 검증 {#validation}

폼에서 데이터가 올바르게 검증되는지 확인하려면 `assertHasFormErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('입력을 검증할 수 있다', function () {
    livewire(CreatePost::class)
        ->fillForm([
            'title' => null,
        ])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required']);
});
```

그리고 검증 오류가 없는지 확인하려면 `assertHasNoFormErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

livewire(CreatePost::class)
    ->fillForm([
        'title' => fake()->sentence(),
        // ...
    ])
    ->call('create')
    ->assertHasNoFormErrors();
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `assertHasFormErrors(['title' => 'required'], 'createPostForm')` 또는 `assertHasNoFormErrors([], 'createPostForm')`처럼 두 번째 매개변수로 특정 폼 이름을 전달할 수 있습니다.

## 폼 존재 여부 {#form-existence}

Livewire 컴포넌트에 폼이 있는지 확인하려면 `assertFormExists()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('폼이 존재한다', function () {
    livewire(CreatePost::class)
        ->assertFormExists();
});
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `assertFormExists('createPostForm')`처럼 특정 폼 이름을 전달할 수 있습니다.

## 필드 {#fields}

폼에 특정 필드가 있는지 확인하려면, 필드 이름을 `assertFormFieldExists()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('title 필드가 존재한다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title');
});
```

필드가 특정 "진리 테스트"를 통과하는지 검증하려면, 추가 인수로 함수를 전달할 수 있습니다. 이는 필드가 특정 설정을 가지고 있는지 검증할 때 유용합니다:

```php
use function Pest\Livewire\livewire;

it('title 필드가 존재한다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title', function (TextInput $field): bool {
            return $field->isDisabled();
        });
});
```

폼에 특정 필드가 없는지 검증하려면, 필드 이름을 `assertFormFieldDoesNotExist()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('조건부 필드가 존재하지 않는다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldDoesNotExist('no-such-field');
});
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `assertFormFieldExists('title', 'createPostForm')`처럼 필드가 존재하는 폼을 지정할 수 있습니다.

### 숨겨진 필드 {#hidden-fields}

필드가 보이는지 확인하려면, 이름을 `assertFormFieldIsVisible()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

test('title이 보인다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsVisible('title');
});
```

또는 필드가 숨겨져 있는지 확인하려면, 이름을 `assertFormFieldIsHidden()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

test('title이 숨겨져 있다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsHidden('title');
});
```

> `assertFormFieldIsHidden()`과 `assertFormFieldIsVisible()` 모두에서 필드가 속한 특정 폼의 이름을 두 번째 인수로 전달할 수 있습니다. 예: `assertFormFieldIsHidden('title', 'createPostForm')`

### 비활성화된 필드 {#disabled-fields}

필드가 활성화되어 있는지 확인하려면, 이름을 `assertFormFieldIsEnabled()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

test('title이 활성화되어 있다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsEnabled('title');
});
```

또는 필드가 비활성화되어 있는지 확인하려면, 이름을 `assertFormFieldIsDisabled()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

test('title이 비활성화되어 있다', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsDisabled('title');
});
```

> `assertFormFieldIsEnabled()`과 `assertFormFieldIsDisabled()` 모두에서 필드가 속한 특정 폼의 이름을 두 번째 인수로 전달할 수 있습니다. 예: `assertFormFieldIsEnabled('title', 'createPostForm')`

## 레이아웃 컴포넌트 {#layout-components}

필드가 아닌 특정 레이아웃 컴포넌트가 존재하는지 확인해야 한다면, `assertFormComponentExists()`를 사용할 수 있습니다. 레이아웃 컴포넌트는 이름이 없으므로, 이 메서드는 개발자가 제공한 `key()`를 사용합니다:

```php
use Filament\Forms\Components\Section;

Section::make('Comments')
    ->key('comments-section')
    ->schema([
        //
    ])
```

```php
use function Pest\Livewire\livewire;

test('comments 섹션이 존재한다', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists('comments-section');
});
```

폼에 특정 컴포넌트가 없는지 검증하려면, 컴포넌트 키를 `assertFormComponentDoesNotExist()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('조건부 컴포넌트가 존재하지 않는다', function () {
    livewire(CreatePost::class)
        ->assertFormComponentDoesNotExist('no-such-section');
});
```

컴포넌트가 존재하고 특정 진리 테스트를 통과하는지 확인하려면, `assertFormComponentExists()`의 두 번째 인수로 함수를 전달할 수 있습니다. 컴포넌트가 테스트를 통과하면 true, 아니면 false를 반환하세요:

```php
use Filament\Forms\Components\Component;

use function Pest\Livewire\livewire;

test('comments 섹션에 heading이 있다', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists(
            'comments-section',
            function (Component $component): bool {
                return $component->getHeading() === 'Comments';
            },
        );
});
```

더 자세한 테스트 결과를 원한다면, 진리 테스트 콜백 내에 assertion을 포함할 수 있습니다:

```php
use Filament\Forms\Components\Component;
use Illuminate\Testing\Assert;

use function Pest\Livewire\livewire;

test('comments 섹션이 활성화되어 있다', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists(
            'comments-section',
            function (Component $component): bool {
                Assert::assertTrue(
                    $component->isEnabled(),
                    'comments-section이 활성화되어 있다고 단언하는 데 실패했습니다.',
                );
                
                return true;
            },
        );
});
```

### 위저드 {#wizard}

위저드의 다음 단계로 이동하려면, `goToNextWizardStep()`을 사용하세요:

```php
use function Pest\Livewire\livewire;

it('다음 위저드 단계로 이동한다', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep()
        ->assertHasFormErrors(['title']);
});
```

`goToPreviousWizardStep()`을 호출하여 이전 단계로 이동할 수도 있습니다:

```php
use function Pest\Livewire\livewire;

it('다음 위저드 단계로 이동한다', function () {
    livewire(CreatePost::class)
        ->goToPreviousWizardStep()
        ->assertHasFormErrors(['title']);
});
```

특정 단계로 이동하려면, `goToWizardStep()`을 사용한 후, 원하는 단계에 있고 이전 단계의 검증 오류가 없는지 확인하려면 `assertWizardCurrentStep` 메서드를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('위저드의 두 번째 단계로 이동한다', function () {
    livewire(CreatePost::class)
        ->goToWizardStep(2)
        ->assertWizardCurrentStep(2);
});
```

하나의 Livewire 컴포넌트에 여러 개의 폼이 있는 경우, 모든 위저드 테스트 헬퍼에 `formName` 매개변수를 전달할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('fooForm에 대해서만 다음 위저드 단계로 이동한다', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep(formName: 'fooForm')
        ->assertHasFormErrors(['title'], formName: 'fooForm');
});
```

## 액션 {#actions}

폼 컴포넌트 이름과 액션 이름을 `callFormComponentAction()`에 전달하여 액션을 호출할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장(invoices)을 보낼 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callFormComponentAction('customer_id', 'send');

    expect($invoice->refresh())
        ->isSent()->toBeTrue();
});
```

액션에 데이터 배열을 전달하려면, `data` 매개변수를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('송장(invoices)을 보낼 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callFormComponentAction('customer_id', 'send', data: [
            'email' => $email = fake()->email(),
        ])
        ->assertHasNoFormComponentActionErrors();

    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($email);
});
```

액션을 즉시 호출하지 않고 데이터만 설정해야 하는 경우, `setFormComponentActionData()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장(invoices)을 보낼 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountFormComponentAction('customer_id', 'send')
        ->setFormComponentActionData([
            'email' => $email = fake()->email(),
        ])
});
```

### 실행 {#execution}

액션이 중단(halt)되었는지 확인하려면, `assertFormComponentActionHalted()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장에 이메일 주소가 없으면 전송을 중단한다', function () {
    $invoice = Invoice::factory(['email' => null])->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callFormComponentAction('customer_id', 'send')
        ->assertFormComponentActionHalted('customer_id', 'send');
});
```

### 오류 {#errors}

`assertHasNoFormComponentActionErrors()`는 액션 폼 제출 시 검증 오류가 발생하지 않았음을 검증하는 데 사용됩니다.

데이터에 검증 오류가 발생했는지 확인하려면, Livewire의 `assertHasErrors()`와 유사하게 `assertHasFormComponentActionErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('송장 수신자 이메일을 검증할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callFormComponentAction('customer_id', 'send', data: [
            'email' => Str::random(),
        ])
        ->assertHasFormComponentActionErrors(['email' => ['email']]);
});
```

액션이 데이터로 미리 채워져 있는지 확인하려면, `assertFormComponentActionDataSet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('기본적으로 주요 연락처로 송장을 보낼 수 있다', function () {
    $invoice = Invoice::factory()->create();
    $recipientEmail = $invoice->company->primaryContact->email;

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->mountFormComponentAction('customer_id', 'send')
        ->assertFormComponentActionDataSet([
            'email' => $recipientEmail,
        ])
        ->callMountedFormComponentAction()
        ->assertHasNoFormComponentActionErrors();
        
    expect($invoice->refresh())
        ->isSent()->toBeTrue()
        ->recipient_email->toBe($recipientEmail);
});
```

### 액션 상태 {#action-state}

폼에 액션이 존재하는지 또는 존재하지 않는지 확인하려면, `assertFormComponentActionExists()` 또는 `assertFormComponentActionDoesNotExist()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장은 보낼 수 있지만, 다시 보내지는 못한다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionExists('customer_id', 'send')
        ->assertFormComponentActionDoesNotExist('customer_id', 'unsend');
});
```

사용자에게 액션이 숨겨져 있거나 보이는지 확인하려면, `assertFormComponentActionHidden()` 또는 `assertFormComponentActionVisible()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('고객만 인쇄할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionHidden('customer_id', 'send')
        ->assertFormComponentActionVisible('customer_id', 'print');
});
```

사용자에게 액션이 활성화되어 있거나 비활성화되어 있는지 확인하려면, `assertFormComponentActionEnabled()` 또는 `assertFormComponentActionDisabled()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장이 전송된 경우에만 고객을 인쇄할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionDisabled('customer_id', 'send')
        ->assertFormComponentActionEnabled('customer_id', 'print');
});
```

액션이 사용자에게 숨겨져 있는지 확인하려면, `assertFormComponentActionHidden()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장을 보낼 수 없다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionHidden('customer_id', 'send');
});
```

### 버튼 표시 {#button-appearance}

액션에 올바른 라벨이 있는지 확인하려면, `assertFormComponentActionHasLabel()`과 `assertFormComponentActionDoesNotHaveLabel()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('send 액션에 올바른 라벨이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionHasLabel('customer_id', 'send', 'Email Invoice')
        ->assertFormComponentActionDoesNotHaveLabel('customer_id', 'send', 'Send');
});
```

액션 버튼이 올바른 아이콘을 표시하는지 확인하려면, `assertFormComponentActionHasIcon()` 또는 `assertFormComponentActionDoesNotHaveIcon()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('활성화된 경우 send 버튼에 올바른 아이콘이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionEnabled('customer_id', 'send')
        ->assertFormComponentActionHasIcon('customer_id', 'send', 'envelope-open')
        ->assertFormComponentActionDoesNotHaveIcon('customer_id', 'send', 'envelope');
});
```

액션 버튼이 올바른 색상을 표시하는지 확인하려면, `assertFormComponentActionHasColor()` 또는 `assertFormComponentActionDoesNotHaveColor()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('액션이 올바른 색상을 표시한다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionHasColor('customer_id', 'delete', 'danger')
        ->assertFormComponentActionDoesNotHaveColor('customer_id', 'print', 'danger');
});
```

### URL {#url}

액션에 올바른 URL이 있는지 확인하려면, `assertFormComponentActionHasUrl()`, `assertFormComponentActionDoesNotHaveUrl()`, `assertFormComponentActionShouldOpenUrlInNewTab()`, `assertFormComponentActionShouldNotOpenUrlInNewTab()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('올바른 Filament 사이트로 연결된다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionHasUrl('customer_id', 'filament', 'https://filamentphp.com/')
        ->assertFormComponentActionDoesNotHaveUrl('customer_id', 'filament', 'https://github.com/filamentphp/filament')
        ->assertFormComponentActionShouldOpenUrlInNewTab('customer_id', 'filament')
        ->assertFormComponentActionShouldNotOpenUrlInNewTab('customer_id', 'github');
});
```
