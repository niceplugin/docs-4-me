---
title: 고급 폼
---
# [폼] 고급 폼
## 개요 {#overview}

Filament Form Builder는 유연하고 커스터마이즈가 가능하도록 설계되었습니다. 기존의 많은 폼 빌더들은 사용자가 폼 스키마를 정의할 수 있도록 해주지만, 필드 간 상호작용이나 커스텀 로직을 정의할 수 있는 훌륭한 인터페이스를 제공하지는 않습니다. 모든 Filament 폼은 [Livewire](https://livewire.laravel.com) 위에 구축되어 있기 때문에, 폼은 초기 렌더링 이후에도 사용자 입력에 따라 동적으로 적응할 수 있습니다. 개발자는 [파라미터 주입](#form-component-utility-injection)을 사용하여 실시간으로 다양한 유틸리티에 접근하고, 사용자 입력에 따라 동적인 폼을 만들 수 있습니다. 필드의 [라이프사이클](#field-lifecycle)은 각 필드에 대한 커스텀 기능을 정의할 수 있도록 훅 함수를 사용해 확장할 수 있습니다. 이를 통해 개발자는 복잡한 폼도 손쉽게 구축할 수 있습니다.

## 반응성의 기본 {#the-basics-of-reactivity}

[Livewire](https://livewire.laravel.com)는 Blade로 렌더링된 HTML이 전체 페이지를 새로고침하지 않고도 동적으로 다시 렌더링될 수 있도록 해주는 도구입니다. Filament 폼은 Livewire 위에 구축되어 있으므로, 동적으로 다시 렌더링되어 초기 렌더링 이후에도 레이아웃이 적응할 수 있습니다.

기본적으로 사용자가 필드를 사용할 때 폼은 다시 렌더링되지 않습니다. 렌더링은 서버로의 왕복이 필요하기 때문에, 이는 성능 최적화입니다. 하지만 사용자가 필드와 상호작용한 후 폼을 다시 렌더링하고 싶다면, `live()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->live()
```

이 예시에서 사용자가 `status` 필드의 값을 변경하면 폼이 다시 렌더링됩니다. 이를 통해 `status` 필드의 새로운 값에 따라 폼 내의 다른 필드들을 변경할 수 있습니다. 또한, [필드의 라이프사이클에 훅을 걸어](#field-updates) 필드가 업데이트될 때 커스텀 로직을 수행할 수 있습니다.

### 블러 시 반응형 필드 {#reactive-fields-on-blur}

기본적으로 필드에 `live()`가 설정되면, 사용자가 필드와 상호작용할 때마다 폼이 다시 렌더링됩니다. 하지만 텍스트 입력과 같은 일부 필드에는 적합하지 않을 수 있습니다. 사용자가 입력 중일 때 네트워크 요청이 발생하면 성능이 저하될 수 있기 때문입니다. 사용자가 필드 사용을 마치고 포커스가 해제된 후에만 폼을 다시 렌더링하고 싶다면, `live(onBlur: true)` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('username')
    ->live(onBlur: true)
```

### 반응형 필드 디바운싱 {#debouncing-reactive-fields}

`live()`와 `live(onBlur: true)`의 중간 지점을 원한다면, "디바운싱"을 사용할 수 있습니다. 디바운싱은 사용자가 일정 시간 동안 입력을 멈출 때까지 네트워크 요청이 전송되지 않도록 합니다. `live(debounce: 500)` 메서드를 사용하면 됩니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('username')
    ->live(debounce: 500) // 폼을 다시 렌더링하기 전 500ms 대기합니다.
```

이 예시에서 `500`은 네트워크 요청을 보내기 전 대기할 밀리초(ms)입니다. 이 숫자는 원하는 대로 커스터마이즈할 수 있으며, `'1s'`와 같은 문자열도 사용할 수 있습니다.

## 폼 컴포넌트 유틸리티 주입 {#form-component-utility-injection}

[필드](fields/getting-started)와 [레이아웃 컴포넌트](layout/getting-started)를 구성하는 데 사용되는 대부분의 메서드는 하드코딩된 값 대신 함수를 파라미터로 받습니다:

```php
use App\Models\User;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

DatePicker::make('date_of_birth')
    ->displayFormat(function (): string {
        if (auth()->user()->country_id === 'us') {
            return 'm/d/Y';
        }

        return 'd/m/Y';
    })

Select::make('user_id')
    ->options(function (): array {
        return User::all()->pluck('name', 'id')->all();
    })

TextInput::make('middle_name')
    ->required(fn (): bool => auth()->user()->hasMiddleName())
```

이것만으로도 다양한 커스터마이즈가 가능합니다.

이 패키지는 또한 이러한 함수 내부에서 사용할 수 있도록 다양한 유틸리티를 파라미터로 주입할 수 있습니다. 함수형 인자를 받는 모든 커스터마이즈 메서드는 유틸리티를 주입할 수 있습니다.

이 주입된 유틸리티들은 특정 파라미터 이름을 사용해야 합니다. 그렇지 않으면 Filament가 무엇을 주입해야 할지 알 수 없습니다.

### 현재 필드의 상태 주입 {#injecting-the-current-state-of-a-field}

필드의 현재 상태(값)에 접근하고 싶다면, `$state` 파라미터를 정의하세요:

```php
function ($state) {
    // ...
}
```

### 현재 폼 컴포넌트 인스턴스 주입 {#injecting-the-current-form-component-instance}

현재 컴포넌트 인스턴스에 접근하고 싶다면, `$component` 파라미터를 정의하세요:

```php
use Filament\Forms\Components\Component;

function (Component $component) {
    // ...
}
```

### 현재 Livewire 컴포넌트 인스턴스 주입 {#injecting-the-current-livewire-component-instance}

현재 Livewire 컴포넌트 인스턴스에 접근하고 싶다면, `$livewire` 파라미터를 정의하세요:

```php
use Livewire\Component as Livewire;

function (Livewire $livewire) {
    // ...
}
```

### 현재 폼 레코드 주입 {#injecting-the-current-form-record}

폼이 Eloquent 모델 인스턴스와 연관되어 있다면, `$record` 파라미터를 정의하세요:

```php
use Illuminate\Database\Eloquent\Model;

function (?Model $record) {
    // ...
}
```

### 다른 필드의 상태 주입 {#injecting-the-state-of-another-field}

콜백 내에서 `$get` 파라미터를 사용하여 다른 필드의 상태(값)를 가져올 수도 있습니다:

```php
use Filament\Forms\Get;

function (Get $get) {
    $email = $get('email'); // `email` 필드의 값을 `$email` 변수에 저장합니다.
    //...
}
```

### 다른 필드의 상태를 설정하는 함수 주입 {#injecting-a-function-to-set-the-state-of-another-field}

`$get`과 유사하게, 콜백 내에서 `$set` 파라미터를 사용하여 다른 필드의 값을 설정할 수도 있습니다:

```php
use Filament\Forms\Set;

function (Set $set) {
    $set('title', 'Blog Post'); // `title` 필드를 `Blog Post`로 설정합니다.
    //...
}
```

이 함수가 실행되면 `title` 필드의 상태가 업데이트되고, 폼이 새로운 제목으로 다시 렌더링됩니다. 이는 [`afterStateUpdated`](#field-updates) 메서드 내에서 유용하게 사용할 수 있습니다.

### 현재 폼 오퍼레이션 주입 {#injecting-the-current-form-operation}

패널 리소스나 관계 매니저를 위한 폼을 작성 중이고, 폼이 `create`, `edit`, `view` 중 어떤 상태인지 확인하고 싶다면 `$operation` 파라미터를 사용하세요:

```php
function (string $operation) {
    // ...
}
```

> 패널 외부에서는 폼 정의에서 `operation()` 메서드를 사용하여 폼의 오퍼레이션을 설정할 수 있습니다.

### 여러 유틸리티 동시 주입 {#injecting-multiple-utilities}

파라미터는 리플렉션을 사용해 동적으로 주입되므로, 원하는 순서로 여러 파라미터를 조합할 수 있습니다:

```php
use Filament\Forms\Get;
use Filament\Forms\Set;
use Livewire\Component as Livewire;

function (Livewire $livewire, Get $get, Set $set) {
    // ...
}
```

### Laravel 컨테이너에서 의존성 주입 {#injecting-dependencies-from-laravels-container}

유틸리티와 함께 Laravel 컨테이너에서 평소처럼 어떤 것이든 주입할 수 있습니다:

```php
use Filament\Forms\Set;
use Illuminate\Http\Request;

function (Request $request, Set $set) {
    // ...
}
```

## 필드 라이프사이클 {#field-lifecycle}

폼의 각 필드는 라이프사이클을 가지며, 이는 폼이 로드될 때, 사용자가 상호작용할 때, 제출될 때 거치는 과정을 의미합니다. 각 단계에서 실행되는 함수를 사용해 이 라이프사이클에서 일어나는 일을 커스터마이즈할 수 있습니다.

### 필드 하이드레이션 {#field-hydration}

하이드레이션은 필드에 데이터를 채우는 과정입니다. 폼의 `fill()` 메서드를 호출할 때 실행됩니다. 필드가 하이드레이션된 후에 일어나는 일을 `afterStateHydrated()` 메서드를 사용해 커스터마이즈할 수 있습니다.

이 예시에서 `name` 필드는 항상 올바르게 대문자로 변환된 이름으로 하이드레이션됩니다:

```php
use Closure;
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->required()
    ->afterStateHydrated(function (TextInput $component, string $state) {
        $component->state(ucwords($state));
    })
```

이렇게 하이드레이션 시 필드의 상태를 포맷팅하는 단축 방법으로 `formatStateUsing()` 메서드를 사용할 수 있습니다:

```php
use Closure;
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->formatStateUsing(fn (string $state): string => ucwords($state))
```

### 필드 업데이트 {#field-updates}

사용자가 필드를 업데이트한 후에 일어나는 일을 커스터마이즈하려면 `afterStateUpdated()` 메서드를 사용할 수 있습니다. 프론트엔드에서 사용자의 변경만 이 함수를 트리거하며, `$set()`이나 다른 PHP 함수로 상태를 수동으로 변경할 때는 트리거되지 않습니다.

이 함수 내에서는 필드가 업데이트되기 전의 `$old` 값을 `$old` 파라미터로 주입받아 사용할 수도 있습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->afterStateUpdated(function (?string $state, ?string $old) {
        // ...
    })
```

이 메서드의 사용 예시는 [제목에서 슬러그 자동 생성](#generating-a-slug-from-a-title)에서 확인할 수 있습니다.

### 필드 디하이드레이션 {#field-dehydration}

디하이드레이션은 폼의 필드에서 데이터를 가져와 변환하는 과정입니다. 폼의 `getState()` 메서드를 호출할 때 실행됩니다.

디하이드레이션 시 상태가 어떻게 변환되는지 `dehydrateStateUsing()` 함수를 사용해 커스터마이즈할 수 있습니다. 이 예시에서 `name` 필드는 항상 올바르게 대문자로 변환된 이름으로 디하이드레이션됩니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->required()
    ->dehydrateStateUsing(fn (string $state): string => ucwords($state))
```

#### 필드가 디하이드레이션되지 않도록 방지 {#preventing-a-field-from-being-dehydrated}

`dehydrated(false)`를 사용해 필드가 아예 디하이드레이션되지 않도록 할 수도 있습니다. 이 예시에서 해당 필드는 `getState()`에서 반환되는 배열에 포함되지 않습니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password_confirmation')
    ->password()
    ->dehydrated(false)
```

폼이 [리소스](../panels/resources/getting-started)나 [테이블 액션](../tables/actions)처럼 데이터를 자동 저장하는 경우, 단순히 표시용으로만 사용되는 필드가 데이터베이스에 저장되지 않도록 할 때 유용합니다.

## 반응형 폼 레시피 모음 {#reactive-forms-cookbook}

이 섹션에는 고급 폼을 만들 때 자주 필요한 작업에 대한 레시피 모음이 포함되어 있습니다.

### 조건부로 필드 숨기기 {#conditionally-hiding-a-field}

필드를 조건부로 숨기거나 표시하려면, `hidden()` 메서드에 함수를 전달하고, 필드를 숨기고 싶을 때 `true`, 아니면 `false`를 반환하면 됩니다. 함수는 [유틸리티를 주입](#form-component-utility-injection)받을 수 있으므로, 다른 필드의 값을 확인하는 등의 작업을 할 수 있습니다:

```php
use Filament\Forms\Get;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;

Checkbox::make('is_company')
    ->live()

TextInput::make('company_name')
    ->hidden(fn (Get $get): bool => ! $get('is_company'))
```

이 예시에서 `is_company` 체크박스는 [`live()`](#the-basics-of-reactivity)입니다. 이는 `is_company` 필드의 값이 변경될 때 폼이 다시 렌더링되도록 합니다. `hidden()` 함수 내에서 [`$get()` 유틸리티](#injecting-the-current-state-of-a-field)를 사용해 해당 필드의 값을 가져올 수 있습니다. 필드의 값은 `!`로 반전되어, `is_company` 필드가 `false`일 때 `company_name` 필드가 숨겨집니다.

또는, `visible()` 메서드를 사용해 조건부로 필드를 표시할 수도 있습니다. 이는 `hidden()`의 정확한 반대이며, 코드의 가독성을 위해 이렇게 작성할 수도 있습니다:

```php
use Filament\Forms\Get;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;

Checkbox::make('is_company')
    ->live()
    
TextInput::make('company_name')
    ->visible(fn (Get $get): bool => $get('is_company'))
```

### 조건부로 필드 필수화 {#conditionally-making-a-field-required}

필드를 조건부로 필수로 만들려면, `required()` 메서드에 함수를 전달하고, 필드를 필수로 만들고 싶을 때 `true`, 아니면 `false`를 반환하면 됩니다. 함수는 [유틸리티를 주입](#form-component-utility-injection)받을 수 있으므로, 다른 필드의 값을 확인하는 등의 작업을 할 수 있습니다:

```php
use Filament\Forms\Get;
use Filament\Forms\Components\TextInput;

TextInput::make('company_name')
    ->live(onBlur: true)
    
TextInput::make('vat_number')
    ->required(fn (Get $get): bool => filled($get('company_name')))
```

이 예시에서 `company_name` 필드는 [`live(onBlur: true)`](#reactive-fields-on-blur)입니다. 이는 `company_name` 필드의 값이 변경되고 사용자가 포커스를 벗어나면 폼이 다시 렌더링되도록 합니다. `required()` 함수 내에서 [`$get()` 유틸리티](#injecting-the-current-state-of-a-field)를 사용해 해당 필드의 값을 가져올 수 있습니다. 필드의 값은 `filled()`로 확인되어, `company_name` 필드가 `null`이거나 빈 문자열이 아닐 때 `vat_number` 필드가 필수로 지정됩니다. 결과적으로 `company_name` 필드가 입력된 경우에만 `vat_number` 필드가 필수입니다.

함수를 사용하면 이와 유사하게 다른 [검증 규칙](validation)도 동적으로 만들 수 있습니다.

### 제목에서 슬러그 생성하기 {#generating-a-slug-from-a-title}

사용자가 입력하는 동안 제목에서 슬러그를 생성하려면, 제목 필드의 [`afterStateUpdated()` 메서드](#field-updates)에서 슬러그 필드의 값을 [`$set()`](#injecting-a-function-to-set-the-state-of-another-field)으로 설정할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Forms\Set;
use Illuminate\Support\Str;

TextInput::make('title')
    ->live(onBlur: true)
    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state)))
    
TextInput::make('slug')
```

이 예시에서 `title` 필드는 [`live(onBlur: true)`](#reactive-fields-on-blur)입니다. 이는 `title` 필드의 값이 변경되고 사용자가 포커스를 벗어나면 폼이 다시 렌더링되도록 합니다. `afterStateUpdated()` 메서드는 `title` 필드의 상태가 업데이트된 후 함수를 실행합니다. 함수는 [`$set()` 유틸리티](#injecting-a-function-to-set-the-state-of-another-field)와 `title` 필드의 새로운 상태를 주입받습니다. `Str::slug()` 유틸리티 메서드는 Laravel의 일부로, 문자열에서 슬러그를 생성하는 데 사용됩니다. 이후 `slug` 필드는 `$set()` 함수를 사용해 업데이트됩니다.

한 가지 주의할 점은 사용자가 슬러그를 수동으로 수정할 수 있으며, 제목이 변경될 때마다 이를 덮어쓰고 싶지 않다는 것입니다. 이를 방지하려면, 이전 제목 버전을 사용해 사용자가 직접 수정했는지 확인할 수 있습니다. 이전 제목 버전에 접근하려면 `$old`를 주입하고, 변경되기 전 슬러그의 현재 값을 얻으려면 [`$get()` 유틸리티](#injecting-the-state-of-another-field)를 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Illuminate\Support\Str;

TextInput::make('title')
    ->live(onBlur: true)
    ->afterStateUpdated(function (Get $get, Set $set, ?string $old, ?string $state) {
        if (($get('slug') ?? '') !== Str::slug($old)) {
            return;
        }
    
        $set('slug', Str::slug($state));
    })
    
TextInput::make('slug')
```

### 종속적인 셀렉트 옵션 {#dependant-select-options}

[셀렉트 필드](fields/select)의 옵션을 다른 필드의 값에 따라 동적으로 업데이트하려면, 셀렉트 필드의 `options()` 메서드에 함수를 전달할 수 있습니다. 함수는 [유틸리티를 주입](#form-component-utility-injection)받을 수 있으므로, [`$get()` 유틸리티](#injecting-the-current-state-of-a-field)를 사용해 다른 필드의 값을 확인할 수 있습니다:

```php
use Filament\Forms\Get;
use Filament\Forms\Components\Select;

Select::make('category')
    ->options([
        'web' => 'Web development',
        'mobile' => 'Mobile development',
        'design' => 'Design',
    ])
    ->live()

Select::make('sub_category')
    ->options(fn (Get $get): array => match ($get('category')) {
        'web' => [
            'frontend_web' => 'Frontend development',
            'backend_web' => 'Backend development',
        ],
        'mobile' => [
            'ios_mobile' => 'iOS development',
            'android_mobile' => 'Android development',
        ],
        'design' => [
            'app_design' => 'Panel design',
            'marketing_website_design' => 'Marketing website design',
        ],
        default => [],
    })
```

이 예시에서 `category` 필드는 [`live()`](#the-basics-of-reactivity)입니다. 이는 `category` 필드의 값이 변경될 때 폼이 다시 렌더링되도록 합니다. `options()` 함수 내에서 [`$get()` 유틸리티](#injecting-the-current-state-of-a-field)를 사용해 해당 필드의 값을 가져올 수 있습니다. 필드의 값은 `sub_category` 필드에서 어떤 옵션이 표시될지 결정하는 데 사용됩니다. PHP의 `match ()` 문을 사용해 `category` 필드의 값에 따라 옵션 배열을 반환합니다. 결과적으로 `sub_category` 필드는 선택된 `category` 필드에 관련된 옵션만 표시합니다.

이 예시를 Eloquent 모델이나 다른 데이터 소스에서 옵션을 로드하도록 변경할 수도 있습니다. 함수 내에서 쿼리하면 됩니다:

```php
use Filament\Forms\Get;
use Filament\Forms\Components\Select;
use Illuminate\Support\Collection;

Select::make('category')
    ->options(Category::query()->pluck('name', 'id'))
    ->live()
    
Select::make('sub_category')
    ->options(fn (Get $get): Collection => SubCategory::query()
        ->where('category', $get('category'))
        ->pluck('name', 'id'))
```

### 셀렉트 옵션에 따라 동적 필드 렌더링 {#dynamic-fields-based-on-a-select-option}

셀렉트와 같은 필드의 값에 따라 다른 필드 집합을 렌더링하고 싶을 수 있습니다. 이를 위해, [레이아웃 컴포넌트](layout/getting-started)의 `schema()` 메서드에 함수를 전달하고, 해당 필드의 값을 확인해 그 값에 따라 다른 스키마를 반환할 수 있습니다. 또한, 동적 스키마의 새 필드를 처음 로드할 때 초기화하는 방법이 필요합니다.

```php
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;

Select::make('type')
    ->options([
        'employee' => 'Employee',
        'freelancer' => 'Freelancer',
    ])
    ->live()
    ->afterStateUpdated(fn (Select $component) => $component
        ->getContainer()
        ->getComponent('dynamicTypeFields')
        ->getChildComponentContainer()
        ->fill())
    
Grid::make(2)
    ->schema(fn (Get $get): array => match ($get('type')) {
        'employee' => [
            TextInput::make('employee_number')
                ->required(),
            FileUpload::make('badge')
                ->image()
                ->required(),
        ],
        'freelancer' => [
            TextInput::make('hourly_rate')
                ->numeric()
                ->required()
                ->prefix('€'),
            FileUpload::make('contract')
                ->required(),
        ],
        default => [],
    })
    ->key('dynamicTypeFields')
```

이 예시에서 `type` 필드는 [`live()`](#the-basics-of-reactivity)입니다. 이는 `type` 필드의 값이 변경될 때 폼이 다시 렌더링되도록 합니다. `afterStateUpdated()` 메서드는 `type` 필드의 상태가 업데이트된 후 함수를 실행합니다. 이 경우, [현재 셀렉트 필드 인스턴스 주입](#injecting-the-current-form-component-instance)을 통해, 셀렉트와 그리드 컴포넌트를 모두 포함하는 폼 "컨테이너" 인스턴스를 가져올 수 있습니다. 이 컨테이너로, 고유 키(`dynamicTypeFields`)를 사용해 그리드 컴포넌트를 타겟팅할 수 있습니다. 그리드 컴포넌트 인스턴스에서 일반 폼에서처럼 `fill()`을 호출해 초기화할 수 있습니다. 그리드 컴포넌트의 `schema()` 메서드는 `type` 필드의 값에 따라 다른 스키마를 반환합니다. 이는 [`$get()` 유틸리티](#injecting-the-current-state-of-a-field)를 사용해 동적으로 다른 스키마 배열을 반환하는 방식입니다.

### 비밀번호 필드 자동 해싱 {#auto-hashing-password-field}

비밀번호 필드가 있다고 가정합니다:

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
```

그리고 [디하이드레이션 함수](#field-dehydration)를 사용해 폼이 제출될 때 비밀번호를 해싱할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Hash;

TextInput::make('password')
    ->password()
    ->dehydrateStateUsing(fn (string $state): string => Hash::make($state))
```

하지만 폼이 기존 비밀번호를 변경하는 데 사용된다면, 필드가 비어 있을 때 기존 비밀번호를 덮어쓰고 싶지 않을 것입니다. 필드가 `null`이거나 빈 문자열일 때 [필드가 디하이드레이션되지 않도록](#preventing-a-field-from-being-dehydrated) 할 수 있습니다(`filled()` 헬퍼 사용):

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Hash;

TextInput::make('password')
    ->password()
    ->dehydrateStateUsing(fn (string $state): string => Hash::make($state))
    ->dehydrated(fn (?string $state): bool => filled($state))
```

하지만 사용자가 생성될 때는 비밀번호가 반드시 입력되도록 하고 싶다면, [`$operation` 유틸리티를 주입](#injecting-the-current-form-operation)하고, [필드를 조건부로 필수화](#conditionally-making-a-field-required)할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Hash;

TextInput::make('password')
    ->password()
    ->dehydrateStateUsing(fn (string $state): string => Hash::make($state))
    ->dehydrated(fn (?string $state): bool => filled($state))
    ->required(fn (string $operation): bool => $operation === 'create')
```

## 관계에 데이터 저장하기 {#saving-data-to-relationships}

> Livewire 컴포넌트 내에서 폼을 구축 중이라면, 반드시 [폼의 모델](adding-a-form-to-a-livewire-component#setting-a-form-model)을 설정해야 합니다. 그렇지 않으면 Filament가 어떤 모델에서 관계를 가져와야 할지 알 수 없습니다.

필드는 구조를 제공할 수 있을 뿐만 아니라, [레이아웃 컴포넌트](layout/getting-started)는 중첩된 필드를 관계로 "텔레포트"할 수도 있습니다. Filament는 `HasOne`, `BelongsTo`, `MorphOne` Eloquent 관계에서 데이터를 로드하고, 다시 해당 관계에 데이터를 저장합니다. 이 동작을 설정하려면, 어떤 레이아웃 컴포넌트에서든 `relationship()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

Fieldset::make('Metadata')
    ->relationship('metadata')
    ->schema([
        TextInput::make('title'),
        Textarea::make('description'),
        FileUpload::make('image'),
    ])
```

이 예시에서 `title`, `description`, `image`는 자동으로 `metadata` 관계에서 로드되고, 폼이 제출될 때 다시 저장됩니다. 만약 `metadata` 레코드가 존재하지 않으면, 자동으로 생성됩니다.

이 기능은 필드셋에만 국한되지 않으며, 어떤 레이아웃 컴포넌트에도 사용할 수 있습니다. 예를 들어, 스타일이 없는 `Group` 컴포넌트를 사용할 수도 있습니다:

```php
use Filament\Forms\Components\Group;
use Filament\Forms\Components\TextInput;

Group::make()
    ->relationship('customer')
    ->schema([
        TextInput::make('name')
            ->label('Customer')
            ->required(),
        TextInput::make('email')
            ->label('Email address')
            ->email()
            ->required(),
    ])
```

### `BelongsTo` 관계에 데이터 저장하기 {#saving-data-to-a-belongsto-relationship}

데이터를 `BelongsTo` 관계에 저장하는 경우, 데이터베이스의 외래 키 컬럼이 반드시 `nullable()`이어야 합니다. 이는 Filament가 폼을 먼저 저장한 후, 관계를 저장하기 때문입니다. 폼이 먼저 저장되면 외래 ID가 아직 존재하지 않으므로, nullable이어야 합니다. 폼이 저장된 직후 Filament가 관계를 저장하며, 이때 외래 ID가 채워지고 다시 저장됩니다.

폼 모델에 옵저버가 있다면, 생성 시점에 관계가 존재하지 않을 수 있으므로 옵저버를 적절히 수정해야 할 수도 있습니다. 예를 들어, 폼이 생성될 때 관련 레코드에 이메일을 보내는 옵저버가 있다면, 관계가 연결된 후 실행되는 `updated()`와 같은 다른 훅을 사용해야 할 수 있습니다.

### 조건부로 관계에 데이터 저장하기 {#conditionally-saving-data-to-a-relationship}

때로는 관련 레코드 저장이 선택적일 수 있습니다. 사용자가 고객 필드를 입력하면 고객이 생성/업데이트되고, 그렇지 않으면 고객이 생성되지 않거나 이미 존재한다면 삭제됩니다. 이를 위해, `relationship()`에 `condition` 함수를 인자로 전달할 수 있으며, 관련 폼의 `$state`를 사용해 관계를 저장할지 여부를 결정할 수 있습니다:

```php
use Filament\Forms\Components\Group;
use Filament\Forms\Components\TextInput;

Group::make()
    ->relationship(
        'customer',
        condition: fn (?array $state): bool => filled($state['name']),
    )
    ->schema([
        TextInput::make('name')
            ->label('Customer'),
        TextInput::make('email')
            ->label('Email address')
            ->email()
            ->requiredWith('name'),
    ])
```

이 예시에서 고객의 이름은 `required()`가 아니며, 이메일 주소는 `name`이 입력된 경우에만 필수입니다. `condition` 함수는 `name` 필드가 입력되었는지 확인하며, 입력된 경우에만 고객이 생성/업데이트됩니다. 그렇지 않으면 고객이 생성되지 않거나 이미 존재한다면 삭제됩니다.

## 폼에 Livewire 컴포넌트 삽입하기 {#inserting-livewire-components-into-a-form}

Livewire 컴포넌트를 폼에 직접 삽입할 수 있습니다:

```php
use Filament\Forms\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class)
```

동일한 Livewire 컴포넌트를 여러 개 렌더링하는 경우, 각 컴포넌트에 고유한 `key()`를 반드시 전달해야 합니다:

```php
use Filament\Forms\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class)
    ->key('foo-first')

Livewire::make(Foo::class)
    ->key('foo-second')

Livewire::make(Foo::class)
    ->key('foo-third')
```

### Livewire 컴포넌트에 파라미터 전달하기 {#passing-parameters-to-a-livewire-component}

Livewire 컴포넌트에 파라미터 배열을 전달할 수 있습니다:

```php
use Filament\Forms\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class, ['bar' => 'baz'])
```

이제 해당 파라미터는 Livewire 컴포넌트의 `mount()` 메서드에 전달됩니다:

```php
class Foo extends Component
{
    public function mount(string $bar): void
    {       
        // ...
    }
}
```

또는, public 프로퍼티로도 사용할 수 있습니다:

```php
class Foo extends Component
{
    public string $bar;
}
```

#### Livewire 컴포넌트에서 현재 레코드 접근하기 {#accessing-the-current-record-in-the-livewire-component}

Livewire 컴포넌트에서 `mount()` 메서드의 `$record` 파라미터나 `$record` 프로퍼티를 사용해 현재 레코드에 접근할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

class Foo extends Component
{
    public function mount(?Model $record = null): void
    {       
        // ...
    }
    
    // 또는
    
    public ?Model $record = null;
}
```

레코드가 아직 생성되지 않은 경우 `null`임을 유의하세요. 레코드가 `null`일 때 Livewire 컴포넌트를 숨기고 싶다면, `hidden()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\Livewire;
use Illuminate\Database\Eloquent\Model;

Livewire::make(Foo::class)
    ->hidden(fn (?Model $record): bool => $record === null)
```

### Livewire 컴포넌트 지연 로딩 {#lazy-loading-a-livewire-component}

`lazy()` 메서드를 사용해 컴포넌트를 [지연 로딩](/livewire/3.x/lazy#rendering-placeholder-html)할 수 있습니다:

```php
use Filament\Forms\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class)->lazy()       
```
