---
title: 유효성 검사
---
# [폼] 유효성 검사
## 개요 {#overview}

유효성 검사 규칙은 [필드](fields/getting-started)에 추가할 수 있습니다.

Laravel에서는 유효성 검사 규칙을 보통 `['required', 'max:255']`와 같은 배열이나 `required|max:255`와 같은 결합된 문자열로 정의합니다. 이는 단순한 폼 요청을 백엔드에서만 작업할 때는 괜찮습니다. 하지만 Filament는 사용자가 백엔드 요청이 발생하기 전에 실수를 수정할 수 있도록 프론트엔드 유효성 검사도 제공합니다.

Filament에는 여러 [전용 유효성 검사 메서드](#available-rules)가 포함되어 있지만, [다른 Laravel 유효성 검사 규칙](#other-rules)이나 [사용자 정의 유효성 검사 규칙](#custom-rules)도 사용할 수 있습니다.

> 일부 유효성 검사는 필드 이름에 의존하므로 `->rule()`/`->rules()`를 통해 전달할 경우 동작하지 않을 수 있습니다. 가능하면 전용 유효성 검사 메서드를 사용하세요.

## 사용 가능한 규칙 {#available-rules}

### 활성 URL {#active-url}

필드는 `dns_get_record()` PHP 함수에 따라 유효한 A 또는 AAAA 레코드를 가져야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-active-url)

```php
Field::make('name')->activeUrl()
```

### 이후 (날짜) {#after-date}

필드 값은 지정된 날짜 이후여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-after)

```php
Field::make('start_date')->after('tomorrow')
```

또는, 비교할 다른 필드의 이름을 전달할 수 있습니다:

```php
Field::make('start_date')
Field::make('end_date')->after('start_date')
```

### 이후 또는 동일 (날짜) {#after-or-equal-to-date}

필드 값은 지정된 날짜 이후이거나 같아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-after-or-equal)

```php
Field::make('start_date')->afterOrEqual('tomorrow')
```

또는, 비교할 다른 필드의 이름을 전달할 수 있습니다:

```php
Field::make('start_date')
Field::make('end_date')->afterOrEqual('start_date')
```

### 알파벳 {#alpha}

필드는 전적으로 알파벳 문자여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-alpha)

```php
Field::make('name')->alpha()
```

### 알파 대시 {#alpha-dash}

필드는 영숫자, 대시, 밑줄을 가질 수 있습니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-alpha-dash)

```php
Field::make('name')->alphaDash()
```

### 알파 숫자 {#alpha-numeric}

필드는 전적으로 영숫자여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-alpha-num)

```php
Field::make('name')->alphaNum()
```

### ASCII {#ascii}

필드는 전적으로 7비트 ASCII 문자여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-ascii)

```php
Field::make('name')->ascii()
```

### 이전 (날짜) {#before-date}

필드 값은 지정된 날짜 이전이어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-before)

```php
Field::make('start_date')->before('first day of next month')
```

또는, 비교할 다른 필드의 이름을 전달할 수 있습니다:

```php
Field::make('start_date')->before('end_date')
Field::make('end_date')
```

### 이전 또는 동일 (날짜) {#before-or-equal-to-date}

필드 값은 지정된 날짜 이전이거나 같아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-before-or-equal)

```php
Field::make('start_date')->beforeOrEqual('end of this month')
```

또는, 비교할 다른 필드의 이름을 전달할 수 있습니다:

```php
Field::make('start_date')->beforeOrEqual('end_date')
Field::make('end_date')
```

### 확인됨 {#confirmed}

필드는 `{field}_confirmation`과 일치하는 필드가 있어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-confirmed)

```php
Field::make('password')->confirmed()
Field::make('password_confirmation')
```

### 다름 {#different}

필드 값은 다른 값과 달라야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-different)

```php
Field::make('backup_email')->different('email')
```

### ~로 시작하지 않음 {#doesnt-start-with}

필드는 주어진 값 중 하나로 시작하지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-doesnt-start-with)

```php
Field::make('name')->doesntStartWith(['admin'])
```

### ~로 끝나지 않음 {#doesnt-end-with}

필드는 주어진 값 중 하나로 끝나지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-doesnt-end-with)

```php
Field::make('name')->doesntEndWith(['admin'])
```

### ~로 끝남 {#ends-with}

필드는 주어진 값 중 하나로 끝나야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-ends-with)

```php
Field::make('name')->endsWith(['bot'])
```

### Enum {#enum}

필드는 유효한 enum 값을 포함해야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-enum)

```php
Field::make('status')->enum(MyStatus::class)
```

### 존재함 {#exists}

필드 값은 데이터베이스에 존재해야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-exists)

```php
Field::make('invitation')->exists()
```

기본적으로, 폼의 모델이 [등록되어 있다면](adding-a-form-to-a-livewire-component#setting-a-form-model) 검색됩니다. 검색할 사용자 지정 테이블 이름이나 모델을 지정할 수 있습니다:

```php
use App\Models\Invitation;

Field::make('invitation')->exists(table: Invitation::class)
```

기본적으로, 필드 이름이 검색할 컬럼으로 사용됩니다. 검색할 사용자 지정 컬럼을 지정할 수 있습니다:

```php
Field::make('invitation')->exists(column: 'id')
```

`modifyRuleUsing` 매개변수에 [클로저](advanced#closure-customization)를 전달하여 규칙을 더 커스터마이즈할 수 있습니다:

```php
use Illuminate\Validation\Rules\Exists;

Field::make('invitation')
    ->exists(modifyRuleUsing: function (Exists $rule) {
        return $rule->where('is_active', 1);
    })
```

### 채워짐 {#filled}

필드가 존재할 때 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-filled)

```php
Field::make('name')->filled()
```

### ~보다 큼 {#greater-than}

필드 값은 다른 값보다 커야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-gt)

```php
Field::make('newNumber')->gt('oldNumber')
```

### ~보다 크거나 같음 {#greater-than-or-equal-to}

필드 값은 다른 값보다 크거나 같아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-gte)

```php
Field::make('newNumber')->gte('oldNumber')
```

### 16진수 색상 {#hex-color}

필드 값은 16진수 형식의 유효한 색상이어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-hex-color)

```php
Field::make('color')->hexColor()
```

### 포함됨 {#in}
필드는 주어진 값 목록에 포함되어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-in)

```php
Field::make('status')->in(['pending', 'completed'])
```

### IP 주소 {#ip-address}

필드는 IP 주소여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-ip)

```php
Field::make('ip_address')->ip()
Field::make('ip_address')->ipv4()
Field::make('ip_address')->ipv6()
```

### JSON {#json}

필드는 유효한 JSON 문자열이어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-json)

```php
Field::make('ip_address')->json()
```

### ~보다 작음 {#less-than}

필드 값은 다른 값보다 작아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-lt)

```php
Field::make('newNumber')->lt('oldNumber')
```

### ~보다 작거나 같음 {#less-than-or-equal-to}

필드 값은 다른 값보다 작거나 같아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-lte)

```php
Field::make('newNumber')->lte('oldNumber')
```

### MAC 주소 {#mac-address}

필드는 MAC 주소여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-mac)

```php
Field::make('mac_address')->macAddress()
```

### ~의 배수 {#multiple-of}

필드는 값의 배수여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#multiple-of)

```php
Field::make('number')->multipleOf(2)
```

### 포함되지 않음 {#not-in}

필드는 주어진 값 목록에 포함되지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-not-in)

```php
Field::make('status')->notIn(['cancelled', 'rejected'])
```

### 정규식 불일치 {#not-regex}

필드는 주어진 정규식과 일치하지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-not-regex)

```php
Field::make('email')->notRegex('/^.+$/i')
```

### 널 허용 {#nullable}

필드 값은 비어 있을 수 있습니다. 이 규칙은 `required` 규칙이 없으면 기본적으로 적용됩니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-nullable)

```php
Field::make('name')->nullable()
```

### 금지됨 {#prohibited}

필드 값은 비어 있어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-prohibited)

```php
Field::make('name')->prohibited()
```

### ~일 때 금지됨 {#prohibited-if}

다른 지정된 필드가 주어진 값 중 하나일 때만 필드는 비어 있어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-prohibited-if)

```php
Field::make('name')->prohibitedIf('field', 'value')
```

### ~이 아니면 금지됨 {#prohibited-unless}

다른 지정된 필드가 주어진 값 중 하나가 아니면 필드는 비어 있어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-prohibited-unless)

```php
Field::make('name')->prohibitedUnless('field', 'value')
```

### ~를 금지함 {#prohibits}

필드가 비어 있지 않으면, 지정된 다른 모든 필드는 비어 있어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-prohibits)

```php
Field::make('name')->prohibits('field')

Field::make('name')->prohibits(['field', 'another_field'])
```

### 필수 {#required}

필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required)

```php
Field::make('name')->required()
```

### ~일 때 필수 {#required-if}

다른 지정된 필드가 주어진 값 중 하나일 때만 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-if)

```php
Field::make('name')->requiredIf('field', 'value')
```

### 허용 시 필수 {#required-if-accepted}

다른 지정된 필드가 "yes", "on", 1, "1", true, "true" 중 하나와 같을 때만 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-if-accepted)

```php
Field::make('name')->requiredIfAccepted('field')
```

### ~이 아니면 필수 {#required-unless}

다른 지정된 필드가 주어진 값 중 하나가 아니면 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-unless)

```php
Field::make('name')->requiredUnless('field', 'value')
```

### ~가 있으면 필수 {#required-with}

다른 지정된 필드 중 하나라도 비어 있지 않으면 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-with)

```php
Field::make('name')->requiredWith('field,another_field')
```

### 모두 있으면 필수 {#required-with-all}

다른 지정된 필드가 모두 비어 있지 않으면 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-with-all)

```php
Field::make('name')->requiredWithAll('field,another_field')
```

### ~가 없으면 필수 {#required-without}

다른 지정된 필드 중 하나라도 비어 있으면 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-without)

```php
Field::make('name')->requiredWithout('field,another_field')
```

### 모두 없으면 필수 {#required-without-all}

다른 지정된 필드가 모두 비어 있으면 필드 값은 비어 있지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-required-without-all)

```php
Field::make('name')->requiredWithoutAll('field,another_field')
```

### 정규식 {#regex}

필드는 주어진 정규식과 일치해야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-regex)

```php
Field::make('email')->regex('/^.+@.+$/i')
```

### 동일함 {#same}

필드 값은 다른 값과 같아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-same)

```php
Field::make('password')->same('passwordConfirmation')
```

### ~로 시작함 {#starts-with}

필드는 주어진 값 중 하나로 시작해야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-starts-with)

```php
Field::make('name')->startsWith(['a'])
```

### 문자열 {#string}

필드는 문자열이어야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-string)
```php
Field::make('name')->string()
```

### 고유함 {#unique}

필드 값은 데이터베이스에 존재하지 않아야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-unique)

```php
Field::make('email')->unique()
```

기본적으로, 폼의 모델이 [등록되어 있다면](adding-a-form-to-a-livewire-component#setting-a-form-model) 검색됩니다. 검색할 사용자 지정 테이블 이름이나 모델을 지정할 수 있습니다:

```php
use App\Models\User;

Field::make('email')->unique(table: User::class)
```

기본적으로, 필드 이름이 검색할 컬럼으로 사용됩니다. 검색할 사용자 지정 컬럼을 지정할 수 있습니다:

```php
Field::make('email')->unique(column: 'email_address')
```

때때로, 고유성 검사 중에 특정 모델을 무시하고 싶을 수 있습니다. 예를 들어, 사용자의 이름, 이메일 주소, 위치를 포함하는 "프로필 수정" 폼이 있다고 가정해봅시다. 이메일 주소가 고유한지 확인하고 싶겠지만, 사용자가 이름만 변경하고 이메일은 변경하지 않았다면 이미 해당 이메일의 소유자이므로 유효성 검사 오류가 발생하지 않아야 합니다.

```php
Field::make('email')->unique(ignorable: $ignoredUser)
```

[Panel Builder](../panels/getting-started)를 사용하는 경우, `ignoreRecord`를 사용하여 현재 레코드를 쉽게 무시할 수 있습니다:

```php
Field::make('email')->unique(ignoreRecord: true)
```

`modifyRuleUsing` 매개변수에 [클로저](advanced#closure-customization)를 전달하여 규칙을 더 커스터마이즈할 수 있습니다:

```php
use Illuminate\Validation\Rules\Unique;

Field::make('email')
    ->unique(modifyRuleUsing: function (Unique $rule) {
        return $rule->where('is_active', 1);
    })
```


### ULID {#ulid}

검증 중인 필드는 유효한 [범용 고유 정렬 가능 식별자](https://github.com/ulid/spec) (ULID)여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-ulid)

```php
Field::make('identifier')->ulid()
```

### UUID {#uuid}

필드는 유효한 RFC 4122(버전 1, 3, 4, 5) 범용 고유 식별자(UUID)여야 합니다. [Laravel 문서 보기.](/laravel/12.x/validation#rule-uuid)

```php
Field::make('identifier')->uuid()
```

## 기타 규칙 {#other-rules}

`rules()` 메서드를 사용하여 필드에 다른 유효성 검사 규칙을 추가할 수 있습니다:

```php
TextInput::make('slug')->rules(['alpha_dash'])
```

유효성 검사 규칙의 전체 목록은 [Laravel 문서](/laravel/12.x/validation#available-validation-rules)에서 확인할 수 있습니다.

## 사용자 정의 규칙 {#custom-rules}

[Laravel](/laravel/12.x/validation#custom-validation-rules)에서 하듯이, 사용자 정의 유효성 검사 규칙을 사용할 수 있습니다:

```php
TextInput::make('slug')->rules([new Uppercase()])
```

[클로저 규칙](/laravel/12.x/validation#using-closures)도 사용할 수 있습니다:

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

폼의 다른 필드 값을 참조해야 할 경우 [`$get`](advanced#injecting-the-state-of-another-field)과 같은 [유틸리티를 주입](advanced#form-component-utility-injection)할 수도 있습니다:

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

## 유효성 검사 속성 커스터마이징 {#customizing-validation-attributes}

필드가 유효성 검사에 실패하면, 해당 라벨이 오류 메시지에 사용됩니다. 필드 오류 메시지에 사용되는 라벨을 커스터마이즈하려면 `validationAttribute()` 메서드를 사용하세요:

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
        'unique' => 'The :attribute has already been registered.',
    ])
```

## 유효성 검사 알림 전송 {#sending-validation-notifications}

유효성 검사 오류가 발생할 때 알림을 보내고 싶다면, Livewire 컴포넌트에서 `onValidationError()` 메서드를 사용하면 됩니다:

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

또는, Panel Builder를 사용하고 있고 모든 페이지에서 이 동작을 원한다면, `AppServiceProvider`의 `boot()` 메서드 안에 다음을 추가하세요:

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
