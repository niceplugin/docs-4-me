---
title: 테스트
---
# [폼] 테스트
## 개요 {#overview}

이 가이드의 모든 예제는 [Pest](https://pestphp.com)를 사용하여 작성됩니다. Pest의 Livewire 플러그인을 테스트에 사용하려면, Pest 문서의 플러그인 설치 안내를 따라주세요: [Pest용 Livewire 플러그인](https://pestphp.com/docs/plugins#livewire). 하지만, 이를 PHPUnit에 쉽게 적용할 수도 있습니다.

Form Builder는 Livewire 컴포넌트에서 동작하므로, [Livewire 테스트 헬퍼](https://livewire.laravel.com/docs/testing)를 사용할 수 있습니다. 하지만, 폼과 함께 사용할 수 있는 커스텀 테스트 헬퍼도 제공합니다.

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

폼에 데이터가 채워졌는지 확인하려면 `assertFormSet()`을 사용하세요:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title', function () {
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

`assertFormSet()` 메서드에 함수를 전달하여 폼의 `$state`에 접근하고 추가적인 검증을 수행할 수도 있습니다:

```php
use Illuminate\Support\Str;
use function Pest\Livewire\livewire;

it('can automatically generate a slug from the title without any spaces', function () {
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

함수 실행 후 Filament가 폼 상태를 계속 검증하도록 하려면, 함수에서 배열을 반환할 수 있습니다.

## 유효성 검사 {#validation}

폼에서 데이터가 올바르게 유효성 검사되는지 확인하려면 `assertHasFormErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can validate input', function () {
    livewire(CreatePost::class)
        ->fillForm([
            'title' => null,
        ])
        ->call('create')
        ->assertHasFormErrors(['title' => 'required']);
});
```

그리고 유효성 검사 오류가 없는지 확인하려면 `assertHasNoFormErrors()`를 사용하세요:

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

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, 두 번째 매개변수로 특정 폼의 이름을 전달할 수 있습니다. 예를 들어 `assertHasFormErrors(['title' => 'required'], 'createPostForm')` 또는 `assertHasNoFormErrors([], 'createPostForm')`와 같이 사용할 수 있습니다.

## 폼 존재 여부 확인 {#form-existence}

Livewire 컴포넌트에 폼이 있는지 확인하려면 `assertFormExists()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('has a form', function () {
    livewire(CreatePost::class)
        ->assertFormExists();
});
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `assertFormExists('createPostForm')`처럼 특정 폼의 이름을 전달할 수 있습니다.

## 필드 {#fields}

폼에 특정 필드가 있는지 확인하려면, 필드 이름을 `assertFormFieldExists()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('has a title field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title');
});
```

필드가 특정 "진리 테스트"를 통과하는지 확인하려면, 추가 인수로 함수를 전달할 수 있습니다. 이는 필드가 특정 설정을 가지고 있는지 검증할 때 유용합니다:

```php
use function Pest\Livewire\livewire;

it('has a title field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldExists('title', function (TextInput $field): bool {
            return $field->isDisabled();
        });
});
```

폼에 특정 필드가 없는지 확인하려면, 필드 이름을 `assertFormFieldDoesNotExist()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

it('does not have a conditional field', function () {
    livewire(CreatePost::class)
        ->assertFormFieldDoesNotExist('no-such-field');
});
```

> Livewire 컴포넌트에 여러 개의 폼이 있는 경우, `assertFormFieldExists('title', 'createPostForm')`처럼 필드의 존재 여부를 확인할 폼을 지정할 수 있습니다.

### 숨겨진 필드 {#hidden-fields}

필드가 보이는지 확인하려면, `assertFormFieldIsVisible()`에 이름을 전달하세요:

```php
use function Pest\Livewire\livewire;

test('title이 보이는지 확인', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsVisible('title');
});
```

또는 필드가 숨겨져 있는지 확인하려면, 이름을 `assertFormFieldIsHidden()`에 전달할 수 있습니다:

```php
use function Pest\Livewire\livewire;

test('title이 숨겨져 있는지 확인', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsHidden('title');
});
```

> `assertFormFieldIsHidden()`과 `assertFormFieldIsVisible()` 모두에서 필드가 속한 특정 폼의 이름을 두 번째 인자로 전달할 수 있습니다. 예: `assertFormFieldIsHidden('title', 'createPostForm')`

### 비활성화된 필드 {#disabled-fields}

필드가 활성화되어 있는지 확인하려면, 필드 이름을 `assertFormFieldIsEnabled()`에 전달하세요:

```php
use function Pest\Livewire\livewire;

test('title이 활성화되어 있음', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsEnabled('title');
});
```

또는 필드가 비활성화되어 있는지 확인하려면, 필드 이름을 `assertFormFieldIsDisabled()`에 전달할 수 있습니다:

```php
use function Pest\Livewire\livewire;

test('title이 비활성화되어 있음', function () {
    livewire(CreatePost::class)
        ->assertFormFieldIsDisabled('title');
});
```

> `assertFormFieldIsEnabled()`와 `assertFormFieldIsDisabled()` 모두에서 필드가 속한 특정 폼의 이름을 두 번째 인자로 전달할 수 있습니다. 예: `assertFormFieldIsEnabled('title', 'createPostForm')`

## 레이아웃 컴포넌트 {#layout-components}

특정 필드가 아닌 레이아웃 컴포넌트가 존재하는지 확인해야 할 경우, `assertFormComponentExists()`를 사용할 수 있습니다. 레이아웃 컴포넌트는 이름이 없으므로, 이 메서드는 개발자가 제공한 `key()`를 사용합니다:

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

test('comments section exists', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists('comments-section');
});
```

폼에 특정 컴포넌트가 없는지 확인하려면, 컴포넌트 키를 `assertFormComponentDoesNotExist()`에 전달하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('does not have a conditional component', function () {
    livewire(CreatePost::class)
        ->assertFormComponentDoesNotExist('no-such-section');
});
```

컴포넌트가 존재하는지와 함께 특정 조건을 만족하는지 확인하려면, `assertFormComponentExists()`의 두 번째 인자로 함수를 전달할 수 있습니다. 이 함수는 컴포넌트가 조건을 통과하면 true, 아니면 false를 반환합니다:

```php
use Filament\Forms\Components\Component;

use function Pest\Livewire\livewire;

test('comments section has heading', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists(
            'comments-section',
            function (Component $component): bool {
                return $component->getHeading() === 'Comments';
            },
        );
});
```

더 자세한 테스트 결과를 원한다면, 진위 테스트 콜백 내에 어설션을 포함할 수 있습니다:

```php
use Filament\Forms\Components\Component;
use Illuminate\Testing\Assert;

use function Pest\Livewire\livewire;

test('comments section is enabled', function () {
    livewire(EditPost::class)
        ->assertFormComponentExists(
            'comments-section',
            function (Component $component): bool {
                Assert::assertTrue(
                    $component->isEnabled(),
                    'Failed asserting that comments-section is enabled.',
                );
                
                return true;
            },
        );
});
```

### 위자드 {#wizard}

위자드의 다음 단계로 이동하려면 `goToNextWizardStep()`을 사용하세요:

```php
use function Pest\Livewire\livewire;

it('다음 위자드 단계로 이동합니다', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep()
        ->assertHasFormErrors(['title']);
});
```

이전 단계로 이동하려면 `goToPreviousWizardStep()`을 호출하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('이전 위자드 단계로 이동합니다', function () {
    livewire(CreatePost::class)
        ->goToPreviousWizardStep()
        ->assertHasFormErrors(['title']);
});
```

특정 단계로 이동하고 싶다면 `goToWizardStep()`을 사용한 후, `assertWizardCurrentStep` 메서드로 원하는 단계에 있고 이전 단계의 유효성 검사 오류가 없는지 확인할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('위자드의 두 번째 단계로 이동합니다', function () {
    livewire(CreatePost::class)
        ->goToWizardStep(2)
        ->assertWizardCurrentStep(2);
});
```

하나의 Livewire 컴포넌트에 여러 개의 폼이 있다면, 모든 위자드 테스트 헬퍼에 `formName` 파라미터를 전달할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('fooForm에 대해서만 다음 위자드 단계로 이동합니다', function () {
    livewire(CreatePost::class)
        ->goToNextWizardStep(formName: 'fooForm')
        ->assertHasFormErrors(['title'], formName: 'fooForm');
});
```

## 액션 {#actions}

액션을 호출하려면 폼 컴포넌트 이름과 액션 이름을 `callFormComponentAction()`에 전달하면 됩니다:

```php
use function Pest\Livewire\livewire;

it('can send invoices', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callFormComponentAction('customer_id', 'send');

    expect($invoice->refresh())
        ->isSent()->toBeTrue();
});
```

액션에 데이터를 배열로 전달하려면 `data` 파라미터를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can send invoices', function () {
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

액션을 즉시 호출하지 않고 데이터만 설정해야 할 경우, `setFormComponentActionData()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can send invoices', function () {
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

액션이 중단되었는지 확인하려면 `assertFormComponentActionHalted()`를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('송장이 이메일 주소가 없으면 전송을 중단한다', function () {
    $invoice = Invoice::factory(['email' => null])->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->callFormComponentAction('customer_id', 'send')
        ->assertFormComponentActionHalted('customer_id', 'send');
});
```

### 오류 {#errors}

`assertHasNoFormComponentActionErrors()`는 액션 폼을 제출할 때 검증 오류가 발생하지 않았는지 확인하는 데 사용됩니다.

데이터에 검증 오류가 발생했는지 확인하려면, Livewire의 `assertHasErrors()`와 유사하게 `assertHasFormComponentActionErrors()`를 사용하세요:

```php
use function Pest\Livewire\livewire;

it('can validate invoice recipient email', function () {
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

액션이 데이터로 미리 채워져 있는지 확인하려면 `assertFormComponentActionDataSet()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('can send invoices to the primary contact by default', function () {
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

폼에서 액션이 존재하는지 또는 존재하지 않는지 확인하려면 `assertFormComponentActionExists()` 또는 `assertFormComponentActionDoesNotExist()` 메서드를 사용할 수 있습니다:

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

사용자에게 액션이 숨겨져 있는지 또는 보이는지 확인하려면 `assertFormComponentActionHidden()` 또는 `assertFormComponentActionVisible()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('고객만 출력할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionHidden('customer_id', 'send')
        ->assertFormComponentActionVisible('customer_id', 'print');
});
```

사용자에게 액션이 활성화되어 있는지 또는 비활성화되어 있는지 확인하려면 `assertFormComponentActionEnabled()` 또는 `assertFormComponentActionDisabled()` 메서드를 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('보낸 송장에 대해서만 고객을 출력할 수 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionDisabled('customer_id', 'send')
        ->assertFormComponentActionEnabled('customer_id', 'print');
});
```

사용자에게 액션이 숨겨져 있는지 확인하려면 `assertFormComponentActionHidden()` 메서드를 사용할 수 있습니다:

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

### 버튼 모양 {#button-appearance}

액션에 올바른 라벨이 있는지 확인하려면 `assertFormComponentActionHasLabel()`과 `assertFormComponentActionDoesNotHaveLabel()`을 사용할 수 있습니다:

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

액션 버튼에 올바른 아이콘이 표시되는지 확인하려면 `assertFormComponentActionHasIcon()` 또는 `assertFormComponentActionDoesNotHaveIcon()`을 사용할 수 있습니다:

```php
use function Pest\Livewire\livewire;

it('활성화 시 send 버튼에 올바른 아이콘이 있다', function () {
    $invoice = Invoice::factory()->create();

    livewire(EditInvoice::class, [
        'invoice' => $invoice,
    ])
        ->assertFormComponentActionEnabled('customer_id', 'send')
        ->assertFormComponentActionHasIcon('customer_id', 'send', 'envelope-open')
        ->assertFormComponentActionDoesNotHaveIcon('customer_id', 'send', 'envelope');
});
```

액션 버튼이 올바른 색상을 표시하는지 확인하려면 `assertFormComponentActionHasColor()` 또는 `assertFormComponentActionDoesNotHaveColor()`를 사용할 수 있습니다:

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

액션이 올바른 URL을 가지는지 확인하려면 `assertFormComponentActionHasUrl()`, `assertFormComponentActionDoesNotHaveUrl()`, `assertFormComponentActionShouldOpenUrlInNewTab()`, `assertFormComponentActionShouldNotOpenUrlInNewTab()`를 사용할 수 있습니다.

```php
use function Pest\Livewire\livewire;

it('links to the correct Filament sites', function () {
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
