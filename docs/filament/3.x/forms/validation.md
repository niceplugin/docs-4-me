---
title: 유효성 검사
---
# [폼] 유효성 검사
## 개요 {#overview}

검증 규칙은 [필드](fields/getting-started)마다 추가할 수 있습니다.

Laravel에서는 보통 검증 규칙을 `['required', 'max:255']`와 같은 배열이나 `required|max:255`와 같은 문자열로 정의합니다. 이런 방식은 단순한 폼 요청을 백엔드에서만 처리할 때는 충분합니다. 하지만 Filament는 사용자가 백엔드 요청 전에 실수를 바로잡을 수 있도록 프론트엔드 검증도 제공합니다.

Filament는 여러 [전용 검증 메서드](#available-rules)를 포함하고 있지만, [다른 Laravel 검증 규칙](#other-rules)이나 [커스텀 검증 규칙](#custom-rules)도 사용할 수 있습니다.

> 일부 검증은 필드 이름에 의존하므로 `->rule()`/`->rules()`로 전달할 경우 동작하지 않을 수 있습니다. 가능하다면 전용 검증 메서드를 사용하세요.

## 사용 가능한 규칙 {#available-rules}

### 활성 URL {#active-url}

해당 필드는 `dns_get_record()` PHP 함수에 따라 유효한 A 또는 AAAA 레코드를 가져야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-active-url)

```php
Field::make('name')->activeUrl()
```

### After (date) {#after-date}

필드 값은 지정된 날짜 이후여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-after)

```php
Field::make('start_date')->after('tomorrow')
```

또는 비교할 다른 필드의 이름을 전달할 수도 있습니다:

```php
Field::make('start_date')
Field::make('end_date')->after('start_date')
```

### 이후 또는 같은 날짜 (after or equal to) {#after-or-equal-to-date}

필드 값은 지정된 날짜 이후이거나 같아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-after-or-equal)

```php
Field::make('start_date')->afterOrEqual('tomorrow')
```

또는, 비교할 다른 필드의 이름을 전달할 수도 있습니다:

```php
Field::make('start_date')
Field::make('end_date')->afterOrEqual('start_date')
```

### Alpha {#alpha}

필드는 반드시 전부 알파벳 문자여야 합니다. [라라벨 문서 참고.](https://laravel.com/docs/validation#rule-alpha)

```php
Field::make('name')->alpha()
```

### 알파 대시 {#alpha-dash}

필드는 영숫자 문자뿐만 아니라 대시(-)와 밑줄(_)도 포함할 수 있습니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-alpha-dash)

```php
Field::make('name')->alphaDash()
```

### 알파뉴메릭 {#alpha-numeric}

필드는 완전히 영숫자 문자여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-alpha-num)

```php
Field::make('name')->alphaNum()
```

### ASCII {#ascii}

필드는 전체가 7비트 ASCII 문자여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-ascii)

```php
Field::make('name')->ascii()
```

### Before (date) {#before-date}

필드 값은 지정된 날짜 이전이어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-before)

```php
Field::make('start_date')->before('first day of next month')
```

또는, 비교할 다른 필드의 이름을 전달할 수도 있습니다:

```php
Field::make('start_date')->before('end_date')
Field::make('end_date')
```

### 이전 또는 같은 날짜 (date) {#before-or-equal-to-date}

필드 값은 지정된 날짜보다 이전이거나 같아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-before-or-equal)

```php
Field::make('start_date')->beforeOrEqual('end of this month')
```

또는, 비교할 다른 필드의 이름을 전달할 수도 있습니다:

```php
Field::make('start_date')->beforeOrEqual('end_date')
Field::make('end_date')
```

### Confirmed {#confirmed}

이 필드는 `{field}_confirmation`과(와) 일치하는 필드가 있어야 합니다. [라라벨 공식 문서를 참고하세요.](https://laravel.com/docs/validation#rule-confirmed)

```php
Field::make('password')->confirmed()
Field::make('password_confirmation')
```

### 다름 {#different}

필드 값이 다른 값과 달라야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-different)

```php
Field::make('backup_email')->different('email')
```

### {#doesnt-start-with}로 시작하지 않음

필드는 주어진 값 중 하나로 시작하지 않아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-doesnt-start-with)

```php
Field::make('name')->doesntStartWith(['admin'])
```

### ~로 끝나지 않음 {#doesnt-end-with}

해당 필드는 주어진 값들 중 하나로 끝나지 않아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-doesnt-end-with)

```php
Field::make('name')->doesntEndWith(['admin'])
```

### 다음으로 끝남 {#ends-with}

필드는 주어진 값 중 하나로 끝나야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-ends-with)

```php
Field::make('name')->endsWith(['bot'])
```

### Enum {#enum}

필드는 유효한 enum 값을 포함해야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-enum)

```php
Field::make('status')->enum(MyStatus::class)
```

### Exists {#exists}

필드 값이 데이터베이스에 존재해야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-exists)

```php
Field::make('invitation')->exists()
```

기본적으로, 폼의 모델이 [등록되어 있다면](adding-a-form-to-a-livewire-component#setting-a-form-model) 해당 모델에서 검색이 이루어집니다. 검색할 커스텀 테이블명이나 모델을 지정할 수도 있습니다:

```php
use App\Models\Invitation;

Field::make('invitation')->exists(table: Invitation::class)
```

기본적으로 필드명이 검색할 컬럼으로 사용됩니다. 검색할 커스텀 컬럼을 지정할 수도 있습니다:

```php
Field::make('invitation')->exists(column: 'id')
```

`modifyRuleUsing` 파라미터에 [클로저](/filament/3.x/forms/advanced#closure-customization)를 전달하여 규칙을 더욱 커스터마이즈할 수 있습니다:

```php
use Illuminate\Validation\Rules\Exists;

Field::make('invitation')
    ->exists(modifyRuleUsing: function (Exists $rule) {
        return $rule->where('is_active', 1);
    })
```

### Filled {#filled}

필드가 존재할 때 비어 있지 않아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-filled)

```php
Field::make('name')->filled()
```

### 크다 {#greater-than}

필드 값이 다른 값보다 커야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-gt)

```php
Field::make('newNumber')->gt('oldNumber')
```

### 크거나 같음 {#greater-than-or-equal-to}

필드 값이 다른 값보다 크거나 같아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-gte)

```php
Field::make('newNumber')->gte('oldNumber')
```

### 16진수 색상 {#hex-color}

필드 값은 16진수 형식의 유효한 색상이어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-hex-color)

```php
Field::make('color')->hexColor()
```

### In {#in}
필드는 주어진 값 목록에 포함되어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-in)

```php
Field::make('status')->in(['pending', 'completed'])
```

### IP 주소 {#ip-address}

필드는 IP 주소여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-ip)

```php
Field::make('ip_address')->ip()
Field::make('ip_address')->ipv4()
Field::make('ip_address')->ipv6()
```

### JSON {#json}

필드는 유효한 JSON 문자열이어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-json)

```php
Field::make('ip_address')->json()
```

### 미만 {#less-than}

필드 값이 다른 값보다 작아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-lt)

```php
Field::make('newNumber')->lt('oldNumber')
```

### 이하 {#less-than-or-equal-to}

필드 값이 다른 값보다 작거나 같아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-lte)

```php
Field::make('newNumber')->lte('oldNumber')
```

### Mac Address {#mac-address}

이 필드는 MAC 주소여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-mac)

```php
Field::make('mac_address')->macAddress()
```

### 배수 {#multiple-of}

필드는 지정된 값의 배수여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#multiple-of)

```php
Field::make('number')->multipleOf(2)
```

### Not In {#not-in}

필드는 주어진 값 목록에 포함되지 않아야 합니다. [라라벨 문서를 참조하세요.](https://laravel.com/docs/validation#rule-not-in)

```php
Field::make('status')->notIn(['cancelled', 'rejected'])
```

### Not Regex {#not-regex}

필드는 주어진 정규식과 일치하지 않아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-not-regex)

```php
Field::make('email')->notRegex('/^.+$/i')
```

### Nullable {#nullable}

필드 값이 비어 있을 수 있습니다. 이 규칙은 `required` 규칙이 없을 때 기본적으로 적용됩니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-nullable)

```php
Field::make('name')->nullable()
```

### 금지됨 {#prohibited}

필드 값이 비어 있어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-prohibited)

```php
Field::make('name')->prohibited()
```

### Prohibited If {#prohibited-if}

지정된 다른 필드가 주어진 값 중 하나를 가질 때에만 해당 필드는 비어 있어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-prohibited-if)

```php
Field::make('name')->prohibitedIf('field', 'value')
```

### Prohibited Unless {#prohibited-unless}

이 필드는 *다른* 지정된 필드가 주어진 값 중 하나를 가질 때를 *제외하고* 비어 있어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-prohibited-unless)

```php
Field::make('name')->prohibitedUnless('field', 'value')
```

### 금지 {#prohibits}

필드가 비어 있지 않은 경우, 지정된 다른 모든 필드는 비어 있어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-prohibits)

```php
Field::make('name')->prohibits('field')

Field::make('name')->prohibits(['field', 'another_field'])
```

### 필수 {#required}

필드 값은 비어 있으면 안 됩니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required)

```php
Field::make('name')->required()
```

### Required If {#required-if}

이 필드는 _오직_ 지정된 다른 필드가 주어진 값 중 하나를 가질 때만 비어 있으면 안 됩니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required-if)

```php
Field::make('name')->requiredIf('field', 'value')
```

### 필수(승인 시) {#required-if-accepted}

이 필드는 _오직_ 지정된 다른 필드의 값이 "yes", "on", 1, "1", true, 또는 "true"일 때만 비어 있으면 안 됩니다. [라라벨 공식 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required-if-accepted)

```php
Field::make('name')->requiredIfAccepted('field')
```

### 필수(Required) Unless {#required-unless}

해당 필드의 값은 _다른_ 지정된 필드가 주어진 값 중 하나를 가질 때를 _제외하고_ 비어 있으면 안 됩니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required-unless)

```php
Field::make('name')->requiredUnless('field', 'value')
```

### Required With {#required-with}

이 필드의 값은 _오직_ 지정된 다른 필드들 중 하나라도 비어 있지 않은 경우에만 비어 있으면 안 됩니다. [라라벨 공식 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required-with)

```php
Field::make('name')->requiredWith('field,another_field')
```

### 모든 필드와 함께 필수 {#required-with-all}

지정된 다른 모든 필드가 비어 있지 않은 경우에만 이 필드 값이 비어 있으면 안 됩니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required-with-all)

```php
Field::make('name')->requiredWithAll('field,another_field')
```

### 필수(다른 필드가 비어 있을 때) {#required-without}

이 필드는 _오직_ 지정된 다른 필드들 중 하나라도 비어 있을 때만 값이 비어 있으면 안 됩니다. [라라벨 문서 참고.](https://laravel.com/docs/validation#rule-required-without)

```php
Field::make('name')->requiredWithout('field,another_field')
```

### 모두 없을 때 필수 {#required-without-all}

지정된 다른 모든 필드가 비어 있을 때에만 이 필드 값이 비어 있으면 안 됩니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-required-without-all)

```php
Field::make('name')->requiredWithoutAll('field,another_field')
```

### 정규식 {#regex}

필드는 주어진 정규식과 일치해야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-regex)

```php
Field::make('email')->regex('/^.+@.+$/i')
```

### 동일 {#same}

필드 값이 다른 값과 동일해야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-same)

```php
Field::make('password')->same('passwordConfirmation')
```

### Starts With {#starts-with}

필드는 주어진 값 중 하나로 시작해야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-starts-with)

```php
Field::make('name')->startsWith(['a'])
```

### 문자열 {#string}

필드는 문자열이어야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-string)
```php
Field::make('name')->string()
```

### 고유성 {#unique}

필드 값이 데이터베이스에 존재하지 않아야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-unique)

```php
Field::make('email')->unique()
```

기본적으로, 폼의 모델이 [등록되어 있다면](adding-a-form-to-a-livewire-component#setting-a-form-model) 해당 모델에서 검색이 이루어집니다. 검색할 커스텀 테이블명이나 모델을 지정할 수도 있습니다:

```php
use App\Models\User;

Field::make('email')->unique(table: User::class)
```

기본적으로, 필드명이 검색할 컬럼으로 사용됩니다. 검색할 커스텀 컬럼을 지정할 수도 있습니다:

```php
Field::make('email')->unique(column: 'email_address')
```

때때로, 고유성 검증 중에 특정 모델을 무시하고 싶을 수 있습니다. 예를 들어, 사용자의 이름, 이메일 주소, 위치를 포함하는 "프로필 수정" 폼을 생각해보세요. 이메일 주소가 고유한지 확인하고 싶겠지만, 사용자가 이름만 변경하고 이메일은 변경하지 않았다면, 이미 해당 이메일의 소유자이므로 검증 오류가 발생하지 않아야 합니다.

```php
Field::make('email')->unique(ignorable: $ignoredUser)
```

[패널 빌더](/filament/3.x/panels/getting-started)를 사용 중이라면, `ignoreRecord`를 사용하여 현재 레코드를 쉽게 무시할 수 있습니다:

```php
Field::make('email')->unique(ignoreRecord: true)
```

[클로저](/filament/3.x/forms/advanced#closure-customization)를 `modifyRuleUsing` 파라미터에 전달하여 규칙을 더욱 커스터마이즈할 수 있습니다:

```php
use Illuminate\Validation\Rules\Unique;

Field::make('email')
    ->unique(modifyRuleUsing: function (Unique $rule) {
        return $rule->where('is_active', 1);
    })
```


### ULID {#ulid}

검증 중인 필드는 유효한 [범용 고유 정렬 가능 식별자](https://github.com/ulid/spec) (ULID)여야 합니다. [라라벨 문서를 참고하세요.](https://laravel.com/docs/validation#rule-ulid)

```php
Field::make('identifier')->ulid()
```

### UUID {#uuid}

이 필드는 RFC 4122(버전 1, 3, 4, 또는 5) 표준에 맞는 유효한 범용 고유 식별자(UUID)여야 합니다. [라라벨 공식 문서 참고.](https://laravel.com/docs/validation#rule-uuid)

```php
Field::make('identifier')->uuid()
```

## 기타 규칙 {#other-rules}

`rules()` 메서드를 사용하여 어떤 필드에도 다른 유효성 검사 규칙을 추가할 수 있습니다:

```php
TextInput::make('slug')->rules(['alpha_dash'])
```

유효성 검사 규칙의 전체 목록은 [Laravel 문서](https://laravel.com/docs/validation#available-validation-rules)에서 확인할 수 있습니다.

## 커스텀 규칙 {#custom-rules}

[Laravel](https://laravel.com/docs/validation#custom-validation-rules)에서와 마찬가지로, 원하는 커스텀 유효성 검사 규칙을 사용할 수 있습니다:

```php
TextInput::make('slug')->rules([new Uppercase()])
```

[클로저 규칙](https://laravel.com/docs/validation#using-closures)도 사용할 수 있습니다:

```php
use Closure;

TextInput::make('slug')->rules([
    fn (): Closure => function (string $attribute, $value, Closure $fail) {
        if ($value === 'foo') {
            $fail('The :attribute is invalid.');
        }
    },
])
```

폼에서 다른 필드 값을 참조해야 하는 경우, 커스텀 규칙에 [`$get`](/filament/3.x/forms/advanced#injecting-the-state-of-another-field)과 같은 [유틸리티를 주입](/filament/3.x/forms/advanced#form-component-utility-injection)할 수도 있습니다:

```php
use Closure;
use Filament\Forms\Get;

TextInput::make('slug')->rules([
    fn (Get $get): Closure => function (string $attribute, $value, Closure $fail) use ($get) {
        if ($get('other_field') === 'foo' && $value !== 'bar') {
            $fail("The {$attribute} is invalid.");
        }
    },
])
```

## 유효성 검사 속성 사용자 지정 {#customizing-validation-attributes}

필드가 유효성 검사에 실패하면 해당 레이블이 오류 메시지에 사용됩니다. 필드 오류 메시지에 사용되는 레이블을 사용자 지정하려면 `validationAttribute()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')->validationAttribute('full name')
```

## 유효성 검사 메시지 {#validation-messages}

기본적으로 Laravel의 유효성 검사 오류 메시지가 사용됩니다. 오류 메시지를 커스터마이즈하려면 `validationMessages()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('email')
    ->unique(// ...)
    ->validationMessages([
        'unique' => '이미 등록된 :attribute 입니다.',
    ])
```

## 유효성 검사 알림 보내기 {#sending-validation-notifications}

유효성 검사 오류가 발생했을 때 알림을 보내고 싶다면, Livewire 컴포넌트에서 `onValidationError()` 메서드를 사용하면 됩니다:

```php
use Filament\Notifications\Notification;
use Illuminate\Validation\ValidationException;

protected function onValidationError(ValidationException $exception): void
{
    Notification::make()
        ->title($exception->getMessage())
        ->danger()
        ->send();
}
```

또는, Panel Builder를 사용하고 있고 모든 페이지에서 이 동작을 원한다면, `AppServiceProvider`의 `boot()` 메서드 안에 다음 코드를 추가하세요:

```php
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Validation\ValidationException;

Page::$reportValidationErrorUsing = function (ValidationException $exception) {
    Notification::make()
        ->title($exception->getMessage())
        ->danger()
        ->send();
};
```
