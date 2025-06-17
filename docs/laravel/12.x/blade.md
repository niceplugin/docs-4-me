# 블레이드 템플릿
















































## 소개 {#introduction}

Blade는 Laravel에 기본 포함된 간단하면서도 강력한 템플릿 엔진입니다. 일부 PHP 템플릿 엔진과 달리, Blade는 템플릿 내에서 순수 PHP 코드를 사용하는 것을 제한하지 않습니다. 실제로 모든 Blade 템플릿은 순수 PHP 코드로 컴파일되어 수정될 때까지 캐시되므로, Blade는 애플리케이션에 사실상 추가적인 오버헤드를 발생시키지 않습니다. Blade 템플릿 파일은 `.blade.php` 확장자를 사용하며, 일반적으로 `resources/views` 디렉터리에 저장됩니다.

Blade 뷰는 라우트나 컨트롤러에서 전역 `view` 헬퍼를 사용해 반환할 수 있습니다. 물론, [뷰](/laravel/12.x/views) 문서에서 언급한 것처럼, `view` 헬퍼의 두 번째 인자를 통해 Blade 뷰로 데이터를 전달할 수 있습니다.

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'Finn']);
});
```


### Livewire로 Blade 강화하기 {#supercharging-blade-with-livewire}

Blade 템플릿을 한 단계 업그레이드하고 손쉽게 동적인 인터페이스를 구축하고 싶으신가요? [Laravel Livewire](https://livewire.laravel.com)를 확인해보세요. Livewire를 사용하면 일반적으로 React나 Vue와 같은 프론트엔드 프레임워크에서만 가능했던 동적 기능을 갖춘 Blade 컴포넌트를 작성할 수 있습니다. 이를 통해 복잡한 자바스크립트 프레임워크의 클라이언트 사이드 렌더링이나 빌드 과정 없이도 현대적이고 반응형인 프론트엔드를 손쉽게 구축할 수 있습니다.


## 데이터 표시하기 {#displaying-data}

Blade 뷰에 전달된 데이터를 중괄호로 감싸서 표시할 수 있습니다. 예를 들어, 다음과 같은 라우트가 있다고 가정해봅시다:

```php
Route::get('/', function () {
    return view('welcome', ['name' => 'Samantha']);
});
```

`name` 변수를 다음과 같이 표시할 수 있습니다:

```blade
Hello, {{ $name }}.
```

> [!NOTE]
> Blade의 `{{ }}` 출력문은 XSS 공격을 방지하기 위해 자동으로 PHP의 `htmlspecialchars` 함수를 거칩니다.

뷰에 전달된 변수의 내용만 표시할 수 있는 것은 아닙니다. 어떤 PHP 함수의 결과도 출력할 수 있습니다. 실제로, Blade 출력문 안에는 원하는 어떤 PHP 코드도 넣을 수 있습니다:

```blade
The current UNIX timestamp is {{ time() }}.
```


### HTML 엔티티 인코딩 {#html-entity-encoding}

기본적으로 Blade(그리고 Laravel의 `e` 함수)는 HTML 엔티티를 이중 인코딩합니다. 만약 이중 인코딩을 비활성화하고 싶다면, `AppServiceProvider`의 `boot` 메서드에서 `Blade::withoutDoubleEncoding` 메서드를 호출하면 됩니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Blade::withoutDoubleEncoding();
    }
}
```


#### 이스케이프되지 않은 데이터 표시 {#displaying-unescaped-data}

기본적으로 Blade의 `{{ }}` 구문은 XSS 공격을 방지하기 위해 PHP의 `htmlspecialchars` 함수로 자동 이스케이프 처리됩니다. 만약 데이터를 이스케이프하지 않고 출력하고 싶다면, 아래와 같은 문법을 사용할 수 있습니다:

```blade
Hello, {!! $name !!}.
```

> [!WARNING]
> 애플리케이션 사용자가 제공한 콘텐츠를 출력할 때는 매우 주의해야 합니다. 일반적으로 사용자로부터 입력받은 데이터를 표시할 때는 XSS 공격을 방지하기 위해 이스케이프된 중괄호 두 개(`{{ }}`) 구문을 사용하는 것이 좋습니다.


### Blade와 JavaScript 프레임워크 {#blade-and-javascript-frameworks}

많은 JavaScript 프레임워크에서도 중괄호({})를 사용해 표현식을 브라우저에 표시하도록 지정하기 때문에, Blade 렌더링 엔진에 해당 표현식을 건드리지 말라고 알리기 위해 `@` 기호를 사용할 수 있습니다. 예를 들어:

```blade
<h1>Laravel</h1>

Hello, @{{ name }}.
```

이 예시에서 `@` 기호는 Blade에 의해 제거되지만, <span v-pre>`{{ name }}`</span> 표현식은 Blade 엔진에 의해 건드려지지 않고 그대로 남아 JavaScript 프레임워크에 의해 렌더링될 수 있습니다.

`@` 기호는 Blade 지시문(디렉티브)을 이스케이프(escape)하는 데에도 사용할 수 있습니다:

```blade
{{-- Blade 템플릿 --}}
@@if()

<!-- HTML 출력 -->
@if()
```


#### JSON 렌더링 {#rendering-json}

때때로 JavaScript 변수를 초기화하기 위해 배열을 JSON으로 렌더링하려고 뷰에 전달할 수 있습니다. 예를 들어:

```php
<script>
    var app = <?php echo json_encode($array); ?>;
</script>
```

하지만 `json_encode`를 직접 호출하는 대신, `Illuminate\Support\Js::from` 메서드 디렉티브를 사용할 수 있습니다. `from` 메서드는 PHP의 `json_encode` 함수와 동일한 인자를 받으며, 결과 JSON이 HTML 따옴표 내에 안전하게 포함될 수 있도록 적절히 이스케이프 처리해줍니다. `from` 메서드는 주어진 객체나 배열을 유효한 JavaScript 객체로 변환하는 문자열 형태의 `JSON.parse` JavaScript 구문을 반환합니다:

```blade
<script>
    var app = {{ Illuminate\Support\Js::from($array) }};
</script>
```

최신 버전의 Laravel 애플리케이션 스켈레톤에는 이 기능을 Blade 템플릿에서 편리하게 사용할 수 있도록 `Js` 파사드가 포함되어 있습니다:

```blade
<script>
    var app = {{ Js::from($array) }};
</script>
```

> [!WARNING]
> `Js::from` 메서드는 기존 변수를 JSON으로 렌더링할 때만 사용해야 합니다. Blade 템플릿 엔진은 정규식을 기반으로 동작하므로, 복잡한 표현식을 디렉티브에 전달하면 예기치 않은 오류가 발생할 수 있습니다.


#### `@verbatim` 디렉티브 {#the-at-verbatim-directive}

템플릿의 많은 부분에서 JavaScript 변수를 출력해야 할 때, 각 Blade 출력문 앞에 `@` 기호를 붙이지 않으려면 HTML을 `@verbatim` 디렉티브로 감쌀 수 있습니다:

```blade
@verbatim
    <div class="container">
        Hello, {{ name }}.
    </div>
@endverbatim
```


## Blade 지시문 {#blade-directives}

템플릿 상속과 데이터 표시 외에도, Blade는 조건문이나 반복문과 같은 일반적인 PHP 제어 구조에 대한 편리한 단축 구문을 제공합니다. 이러한 단축 구문은 PHP의 제어 구조와 유사하면서도 매우 깔끔하고 간결하게 사용할 수 있도록 해줍니다.


### If 문 {#if-statements}

`@if`, `@elseif`, `@else`, `@endif` 지시어를 사용하여 `if` 문을 작성할 수 있습니다. 이 지시어들은 PHP의 if문과 동일하게 동작합니다:

```blade
@if (count($records) === 1)
    하나의 레코드가 있습니다!
@elseif (count($records) > 1)
    여러 개의 레코드가 있습니다!
@else
    레코드가 없습니다!
@endif
```

편의를 위해 Blade에서는 `@unless` 지시어도 제공합니다:

```blade
@unless (Auth::check())
    로그인되어 있지 않습니다.
@endunless
```

앞서 설명한 조건부 지시어 외에도, `@isset`과 `@empty` 지시어를 각각의 PHP 함수에 대한 간편한 단축키로 사용할 수 있습니다:

```blade
@isset($records)
    // $records가 정의되어 있고 null이 아닙니다...
@endisset

@empty($records)
    // $records가 "비어있습니다"...
@endempty
```


#### 인증 디렉티브 {#authentication-directives}

`@auth`와 `@guest` 디렉티브를 사용하면 현재 사용자가 [인증](/laravel/12.x/authentication)되었는지 또는 게스트인지 빠르게 확인할 수 있습니다:

```blade
@auth
    // 사용자가 인증되었습니다...
@endauth

@guest
    // 사용자가 인증되지 않았습니다...
@endguest
```

필요하다면, `@auth`와 `@guest` 디렉티브를 사용할 때 확인할 인증 가드를 지정할 수도 있습니다:

```blade
@auth('admin')
    // 사용자가 인증되었습니다...
@endauth

@guest('admin')
    // 사용자가 인증되지 않았습니다...
@endguest
```


#### 환경 지시문 {#environment-directives}

애플리케이션이 프로덕션 환경에서 실행 중인지 확인하려면 `@production` 지시문을 사용할 수 있습니다:

```blade
@production
    // 프로덕션 환경에서만 보여질 내용...
@endproduction
```

또는, `@env` 지시문을 사용하여 애플리케이션이 특정 환경에서 실행 중인지 확인할 수 있습니다:

```blade
@env('staging')
    // 애플리케이션이 "staging" 환경에서 실행 중입니다...
@endenv

@env(['staging', 'production'])
    // 애플리케이션이 "staging" 또는 "production" 환경에서 실행 중입니다...
@endenv
```


#### 섹션 디렉티브 {#section-directives}

템플릿 상속 섹션에 내용이 있는지 확인하려면 `@hasSection` 디렉티브를 사용할 수 있습니다:

```blade
@hasSection('navigation')
    <div class="pull-right">
        @yield('navigation')
    </div>

    <div class="clearfix"></div>
@endif
```

섹션에 내용이 없는지 확인하려면 `sectionMissing` 디렉티브를 사용할 수 있습니다:

```blade
@sectionMissing('navigation')
    <div class="pull-right">
        @include('default-navigation')
    </div>
@endif
```


#### 세션 디렉티브 {#session-directives}

`@session` 디렉티브는 [세션](/laravel/12.x/session) 값이 존재하는지 확인할 때 사용할 수 있습니다. 세션 값이 존재하면, `@session`과 `@endsession` 디렉티브 사이의 템플릿 내용이 실행됩니다. `@session` 디렉티브 내부에서는 `$value` 변수를 사용해 세션 값을 출력할 수 있습니다:

```blade
@session('status')
    <div class="p-4 bg-green-100">
        {{ $value }}
    </div>
@endsession
```


### Switch 문 {#switch-statements}

Switch 문은 `@switch`, `@case`, `@break`, `@default`, `@endswitch` 지시어를 사용하여 작성할 수 있습니다:

```blade
@switch($i)
    @case(1)
        첫 번째 경우...
        @break

    @case(2)
        두 번째 경우...
        @break

    @default
        기본 경우...
@endswitch
```


### 반복문 {#loops}

조건문 외에도, Blade는 PHP의 반복문 구조를 다루기 위한 간단한 지시문을 제공합니다. 이 지시문들은 모두 PHP의 기본 반복문과 동일하게 동작합니다:

```blade
@for ($i = 0; $i < 10; $i++)
    현재 값은 {{ $i }} 입니다
@endfor

@foreach ($users as $user)
    <p>이 사용자의 ID는 {{ $user->id }} 입니다</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>사용자가 없습니다</p>
@endforelse

@while (true)
    <p>무한 반복 중입니다.</p>
@endwhile
```

> [!NOTE]
> `foreach` 반복문을 순회할 때, [loop 변수](#the-loop-variable)를 사용하여 반복문의 첫 번째 또는 마지막 순회인지 등 유용한 정보를 얻을 수 있습니다.

반복문을 사용할 때 `@continue`와 `@break` 지시문을 사용하여 현재 반복을 건너뛰거나 반복문을 종료할 수 있습니다:

```blade
@foreach ($users as $user)
    @if ($user->type == 1)
        @continue
    @endif

    <li>{{ $user->name }}</li>

    @if ($user->number == 5)
        @break
    @endif
@endforeach
```

또한, 지시문 선언부에 조건을 직접 포함할 수도 있습니다:

```blade
@foreach ($users as $user)
    @continue($user->type == 1)

    <li>{{ $user->name }}</li>

    @break($user->number == 5)
@endforeach
```


### 루프 변수 {#the-loop-variable}

`foreach` 루프를 반복할 때, 루프 내부에서 `$loop` 변수를 사용할 수 있습니다. 이 변수는 현재 루프 인덱스, 첫 번째 또는 마지막 반복인지 등 유용한 정보를 제공합니다:

```blade
@foreach ($users as $user)
    @if ($loop->first)
        이것은 첫 번째 반복입니다.
    @endif

    @if ($loop->last)
        이것은 마지막 반복입니다.
    @endif

    <p>이 사용자의 ID는 {{ $user->id }}입니다.</p>
@endforeach
```

중첩 루프 안에 있다면, `parent` 속성을 통해 부모 루프의 `$loop` 변수에 접근할 수 있습니다:

```blade
@foreach ($users as $user)
    @foreach ($user->posts as $post)
        @if ($loop->parent->first)
            이것은 부모 루프의 첫 번째 반복입니다.
        @endif
    @endforeach
@endforeach
```

`$loop` 변수에는 이 외에도 다양한 유용한 속성이 포함되어 있습니다:

<div class="overflow-auto">

| 속성                | 설명                                                         |
| ------------------- | ------------------------------------------------------------ |
| `$loop->index`      | 현재 루프 반복의 인덱스(0부터 시작).                         |
| `$loop->iteration`  | 현재 루프 반복 횟수(1부터 시작).                             |
| `$loop->remaining`  | 루프에서 남은 반복 횟수.                                     |
| `$loop->count`      | 반복 중인 배열의 전체 아이템 수.                             |
| `$loop->first`      | 루프의 첫 번째 반복인지 여부.                                |
| `$loop->last`       | 루프의 마지막 반복인지 여부.                                 |
| `$loop->even`       | 현재 반복이 짝수 번째인지 여부.                              |
| `$loop->odd`        | 현재 반복이 홀수 번째인지 여부.                              |
| `$loop->depth`      | 현재 루프의 중첩 레벨.                                       |
| `$loop->parent`     | 중첩 루프일 때, 부모의 루프 변수.                           |

</div>


### 조건부 클래스 & 스타일 {#conditional-classes}

`@class` 디렉티브는 조건에 따라 CSS 클래스 문자열을 컴파일합니다. 이 디렉티브는 클래스를 배열로 받아들이며, 배열의 키에는 추가하고자 하는 클래스(들)를, 값에는 불리언 표현식을 넣습니다. 배열 요소의 키가 숫자일 경우, 해당 클래스는 항상 렌더링된 클래스 목록에 포함됩니다:

```blade
@php
    $isActive = false;
    $hasError = true;
@endphp

<span @class([
    'p-4',
    'font-bold' => $isActive,
    'text-gray-500' => ! $isActive,
    'bg-red' => $hasError,
])></span>

<span class="p-4 text-gray-500 bg-red"></span>
```

마찬가지로, `@style` 디렉티브를 사용하면 HTML 요소에 인라인 CSS 스타일을 조건부로 추가할 수 있습니다:

```blade
@php
    $isActive = true;
@endphp

<span @style([
    'background-color: red',
    'font-weight: bold' => $isActive,
])></span>

<span style="background-color: red; font-weight: bold;"></span>
```


### 추가 속성 {#additional-attributes}

편의를 위해, `@checked` 디렉티브를 사용하여 주어진 HTML 체크박스 입력이 "checked" 상태인지 쉽게 표시할 수 있습니다. 이 디렉티브는 제공된 조건이 `true`로 평가되면 `checked`를 출력합니다:

```blade
<input
    type="checkbox"
    name="active"
    value="active"
    @checked(old('active', $user->active))
/>
```

마찬가지로, `@selected` 디렉티브를 사용하여 주어진 select 옵션이 "selected" 상태인지 표시할 수 있습니다:

```blade
<select name="version">
    @foreach ($product->versions as $version)
        <option value="{{ $version }}" @selected(old('version') == $version)>
            {{ $version }}
        </option>
    @endforeach
</select>
```

또한, `@disabled` 디렉티브를 사용하여 주어진 요소가 "disabled" 상태인지 표시할 수 있습니다:

```blade
<button type="submit" @disabled($errors->isNotEmpty())>Submit</button>
```

더불어, `@readonly` 디렉티브를 사용하여 주어진 요소가 "readonly" 상태인지 표시할 수 있습니다:

```blade
<input
    type="email"
    name="email"
    value="email@laravel.com"
    @readonly($user->isNotAdmin())
/>
```

추가로, `@required` 디렉티브를 사용하여 주어진 요소가 "required" 상태인지 표시할 수 있습니다:

```blade
<input
    type="text"
    name="title"
    value="title"
    @required($user->isAdmin())
/>
```


### 서브뷰 포함하기 {#including-subviews}

> [!NOTE]
> `@include` 디렉티브를 자유롭게 사용할 수 있지만, Blade [컴포넌트](#components)는 유사한 기능을 제공하며 데이터 및 속성 바인딩과 같은 여러 이점을 제공합니다.

Blade의 `@include` 디렉티브를 사용하면 한 Blade 뷰 내에서 다른 Blade 뷰를 포함할 수 있습니다. 부모 뷰에서 사용 가능한 모든 변수는 포함된 뷰에서도 사용할 수 있습니다:

```blade
<div>
    @include('shared.errors')

    <form>
        <!-- 폼 내용 -->
    </form>
</div>
```

포함된 뷰는 부모 뷰에서 사용 가능한 모든 데이터를 상속받지만, 추가로 포함된 뷰에서 사용할 수 있는 데이터를 배열로 전달할 수도 있습니다:

```blade
@include('view.name', ['status' => 'complete'])
```

존재하지 않는 뷰를 `@include` 하려고 하면 Laravel은 에러를 발생시킵니다. 뷰가 존재할 수도 있고 존재하지 않을 수도 있는 경우에는 `@includeIf` 디렉티브를 사용해야 합니다:

```blade
@includeIf('view.name', ['status' => 'complete'])
```

특정 불리언 표현식이 `true` 또는 `false`로 평가될 때만 뷰를 `@include` 하고 싶다면, `@includeWhen`과 `@includeUnless` 디렉티브를 사용할 수 있습니다:

```blade
@includeWhen($boolean, 'view.name', ['status' => 'complete'])

@includeUnless($boolean, 'view.name', ['status' => 'complete'])
```

주어진 뷰 배열 중에서 가장 먼저 존재하는 뷰를 포함하고 싶다면, `includeFirst` 디렉티브를 사용할 수 있습니다:

```blade
@includeFirst(['custom.admin', 'admin'], ['status' => 'complete'])
```

> [!WARNING]
> Blade 뷰에서 `__DIR__`와 `__FILE__` 상수 사용은 피해야 합니다. 이 상수들은 캐시된 컴파일 뷰의 위치를 참조하게 됩니다.


#### 컬렉션을 위한 뷰 렌더링 {#rendering-views-for-collections}

Blade의 `@each` 디렉티브를 사용하면 반복문과 include를 한 줄로 결합할 수 있습니다.

```blade
@each('view.name', $jobs, 'job')
```

`@each` 디렉티브의 첫 번째 인자는 배열이나 컬렉션의 각 요소에 대해 렌더링할 뷰입니다. 두 번째 인자는 반복할 배열 또는 컬렉션이고, 세 번째 인자는 뷰 내에서 현재 반복 항목에 할당될 변수명입니다. 예를 들어, `jobs` 배열을 반복한다면, 각 job을 뷰에서 `job` 변수로 접근할 수 있습니다. 현재 반복의 배열 키는 뷰 내에서 `key` 변수로 사용할 수 있습니다.

또한, `@each` 디렉티브에 네 번째 인자를 전달할 수 있습니다. 이 인자는 주어진 배열이 비어 있을 때 렌더링할 뷰를 지정합니다.

```blade
@each('view.name', $jobs, 'job', 'view.empty')
```

> [!WARNING]
> `@each`로 렌더링된 뷰는 부모 뷰의 변수를 상속받지 않습니다. 자식 뷰에서 이러한 변수가 필요하다면, `@foreach`와 `@include` 디렉티브를 대신 사용해야 합니다.


### `@once` 디렉티브 {#the-once-directive}

`@once` 디렉티브를 사용하면 템플릿의 특정 부분이 렌더링 사이클마다 한 번만 평가되도록 할 수 있습니다. 이는 [스택](#stacks)을 사용해 특정 JavaScript 코드를 페이지의 헤더에 추가할 때 유용할 수 있습니다. 예를 들어, [컴포넌트](#components)를 반복문 내에서 렌더링할 때, 해당 컴포넌트가 처음 렌더링될 때만 JavaScript를 헤더에 추가하고 싶을 수 있습니다.

```blade
@once
    @push('scripts')
        <script>
            // 사용자 정의 JavaScript...
        </script>
    @endpush
@endonce
```

`@once` 디렉티브는 주로 `@push` 또는 `@prepend` 디렉티브와 함께 사용되기 때문에, 더 편리하게 사용할 수 있도록 `@pushOnce`와 `@prependOnce` 디렉티브도 제공됩니다.

```blade
@pushOnce('scripts')
    <script>
        // 사용자 정의 JavaScript...
    </script>
@endPushOnce
```


### Raw PHP {#raw-php}

특정 상황에서는 뷰에 PHP 코드를 직접 삽입하는 것이 유용할 수 있습니다. Blade의 `@php` 지시어를 사용하면 템플릿 내에서 순수 PHP 블록을 실행할 수 있습니다.

```blade
@php
    $counter = 1;
@endphp
```

또한, PHP를 사용해 클래스를 임포트해야 할 경우에는 `@use` 지시어를 사용할 수 있습니다.

```blade
@use('App\Models\Flight')
```

`@use` 지시어에 두 번째 인자를 전달하여 임포트한 클래스에 별칭을 지정할 수도 있습니다.

```blade
@use('App\Models\Flight', 'FlightModel')
```

같은 네임스페이스 내에 여러 클래스가 있다면, 해당 클래스들을 그룹으로 묶어 임포트할 수 있습니다.

```blade
@use('App\Models\{Flight, Airport}')
```

`@use` 지시어는 `function` 또는 `const` 수식어를 경로 앞에 붙여 PHP 함수와 상수도 임포트할 수 있습니다.

```blade
@use(function App\Helpers\format_currency)
@use(const App\Constants\MAX_ATTEMPTS)
```

클래스 임포트와 마찬가지로, 함수와 상수에도 별칭을 지정할 수 있습니다.

```blade
@use(function App\Helpers\format_currency, 'formatMoney')
@use(const App\Constants\MAX_ATTEMPTS, 'MAX_TRIES')
```

함수와 상수 모두 그룹 임포트가 가능하므로, 같은 네임스페이스 내 여러 심볼을 한 번에 임포트할 수 있습니다.

```blade
@use(function App\Helpers\{format_currency, format_date})
@use(const App\Constants\{MAX_ATTEMPTS, DEFAULT_TIMEOUT})
```


### 주석 {#comments}

Blade에서는 뷰 파일 내에 주석을 작성할 수 있습니다. 하지만 HTML 주석과 달리, Blade 주석은 애플리케이션에서 반환되는 HTML에 포함되지 않습니다:

```blade
{{-- 이 주석은 렌더링된 HTML에 포함되지 않습니다 --}}
```


## 컴포넌트 {#components}

컴포넌트와 슬롯은 섹션, 레이아웃, 인클루드와 유사한 이점을 제공합니다. 하지만 컴포넌트와 슬롯의 개념이 더 이해하기 쉬울 수 있습니다. 컴포넌트를 작성하는 방법에는 클래스 기반 컴포넌트와 익명 컴포넌트 두 가지가 있습니다.

클래스 기반 컴포넌트를 생성하려면 `make:component` Artisan 명령어를 사용할 수 있습니다. 컴포넌트 사용 방법을 설명하기 위해 간단한 `Alert` 컴포넌트를 만들어보겠습니다. `make:component` 명령어는 컴포넌트를 `app/View/Components` 디렉터리에 생성합니다:

```shell
php artisan make:component Alert
```

`make:component` 명령어는 컴포넌트의 뷰 템플릿도 함께 생성합니다. 이 뷰는 `resources/views/components` 디렉터리에 위치하게 됩니다. 애플리케이션에서 컴포넌트를 작성할 때, 컴포넌트는 `app/View/Components` 디렉터리와 `resources/views/components` 디렉터리 내에서 자동으로 인식되므로 별도의 컴포넌트 등록이 필요하지 않습니다.

또한, 하위 디렉터리 내에 컴포넌트를 생성할 수도 있습니다:

```shell
php artisan make:component Forms/Input
```

위 명령어는 `app/View/Components/Forms` 디렉터리에 `Input` 컴포넌트를 생성하고, 뷰는 `resources/views/components/forms` 디렉터리에 생성됩니다.

클래스 없이 Blade 템플릿만으로 구성된 익명 컴포넌트를 만들고 싶다면, `make:component` 명령어에 `--view` 플래그를 사용할 수 있습니다:

```shell
php artisan make:component forms.input --view
```

위 명령어는 `resources/views/components/forms/input.blade.php`에 Blade 파일을 생성하며, `<x-forms.input />` 형태로 컴포넌트로 렌더링할 수 있습니다.


#### 패키지 컴포넌트 수동 등록 {#manually-registering-package-components}

자신의 애플리케이션을 위해 컴포넌트를 작성할 때는, 컴포넌트가 `app/View/Components` 디렉터리와 `resources/views/components` 디렉터리 내에서 자동으로 감지됩니다.

하지만, Blade 컴포넌트를 활용하는 패키지를 개발하는 경우에는 컴포넌트 클래스와 해당 HTML 태그 별칭을 수동으로 등록해야 합니다. 일반적으로 패키지의 서비스 프로바이더의 `boot` 메서드에서 컴포넌트를 등록합니다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지의 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::component('package-alert', Alert::class);
}
```

컴포넌트가 등록되면, 태그 별칭을 사용하여 렌더링할 수 있습니다:

```blade
<x-package-alert/>
```

또는, `componentNamespace` 메서드를 사용하여 컨벤션에 따라 컴포넌트 클래스를 자동 로드할 수도 있습니다. 예를 들어, `Nightshade` 패키지에 `Package\Views\Components` 네임스페이스 내에 위치한 `Calendar`와 `ColorPicker` 컴포넌트가 있다고 가정해봅시다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지의 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
}
```

이렇게 하면, `package-name::` 구문을 사용하여 벤더 네임스페이스로 패키지 컴포넌트를 사용할 수 있습니다:

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

Blade는 컴포넌트 이름을 파스칼 케이스로 변환하여 해당 컴포넌트와 연결된 클래스를 자동으로 감지합니다. 또한, "dot" 표기법을 사용하여 하위 디렉터리도 지원합니다.


### 컴포넌트 렌더링 {#rendering-components}

컴포넌트를 화면에 표시하려면, Blade 템플릿 내에서 Blade 컴포넌트 태그를 사용할 수 있습니다. Blade 컴포넌트 태그는 `x-`로 시작하며, 그 뒤에 컴포넌트 클래스 이름을 케밥 케이스(kebab case)로 작성합니다.

```blade
<x-alert/>

<x-user-profile/>
```

만약 컴포넌트 클래스가 `app/View/Components` 디렉터리 내에 더 깊이 중첩되어 있다면, 디렉터리 중첩을 나타내기 위해 `.` 문자를 사용할 수 있습니다. 예를 들어, 컴포넌트가 `app/View/Components/Inputs/Button.php`에 위치해 있다면 다음과 같이 렌더링할 수 있습니다.

```blade
<x-inputs.button/>
```

컴포넌트를 조건부로 렌더링하고 싶다면, 컴포넌트 클래스에 `shouldRender` 메서드를 정의할 수 있습니다. `shouldRender` 메서드가 `false`를 반환하면 해당 컴포넌트는 렌더링되지 않습니다.

```php
use Illuminate\Support\Str;

/**
 * 컴포넌트를 렌더링할지 여부
 */
public function shouldRender(): bool
{
    return Str::length($this->message) > 0;
}
```


### 인덱스 컴포넌트 {#index-components}

때때로 컴포넌트가 컴포넌트 그룹의 일부로 사용되며, 관련된 컴포넌트들을 하나의 디렉터리 내에 그룹화하고 싶을 수 있습니다. 예를 들어, 다음과 같은 클래스 구조를 가진 "카드(card)" 컴포넌트를 생각해봅시다:

```text
App\Views\Components\Card\Card
App\Views\Components\Card\Header
App\Views\Components\Card\Body
```

루트 `Card` 컴포넌트가 `Card` 디렉터리 내에 위치해 있기 때문에, `<x-card.card>`와 같이 컴포넌트를 렌더링해야 할 것 같지만, 컴포넌트 파일명이 디렉터리명과 일치할 경우 Laravel은 해당 컴포넌트를 "루트" 컴포넌트로 자동 인식하여 디렉터리명을 반복하지 않고도 컴포넌트를 렌더링할 수 있습니다:

```blade
<x-card>
    <x-card.header>...</x-card.header>
    <x-card.body>...</x-card.body>
</x-card>
```


### 컴포넌트에 데이터 전달하기 {#passing-data-to-components}

Blade 컴포넌트에 데이터를 전달할 때는 HTML 속성을 사용할 수 있습니다. 하드코딩된 원시 값은 단순한 HTML 속성 문자열로 컴포넌트에 전달할 수 있습니다. PHP 표현식이나 변수를 전달할 때는 속성 앞에 `:` 문자를 붙여서 전달해야 합니다:

```blade
<x-alert type="error" :message="$message"/>
```

컴포넌트의 모든 데이터 속성은 클래스 생성자에서 정의해야 합니다. 컴포넌트의 모든 public 속성은 자동으로 컴포넌트의 뷰에서 사용할 수 있게 됩니다. 데이터를 컴포넌트의 `render` 메서드에서 뷰로 따로 전달할 필요는 없습니다:

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Alert extends Component
{
    /**
     * 컴포넌트 인스턴스 생성자.
     */
    public function __construct(
        public string $type,
        public string $message,
    ) {}

    /**
     * 컴포넌트를 나타내는 뷰/콘텐츠 반환.
     */
    public function render(): View
    {
        return view('components.alert');
    }
}
```

컴포넌트가 렌더링될 때, 컴포넌트의 public 변수의 값을 변수명을 사용해 출력할 수 있습니다:

```blade
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```


#### 대소문자 표기법 {#casing}

컴포넌트 생성자 인수는 `camelCase`를 사용하여 지정해야 하며, HTML 속성에서 인수 이름을 참조할 때는 `kebab-case`를 사용해야 합니다. 예를 들어, 다음과 같은 컴포넌트 생성자가 있다고 가정해봅시다:

```php
/**
 * 컴포넌트 인스턴스 생성.
 */
public function __construct(
    public string $alertType,
) {}
```

이 경우, `$alertType` 인수는 다음과 같이 컴포넌트에 전달할 수 있습니다:

```blade
<x-alert alert-type="danger" />
```


#### 짧은 속성 문법 {#short-attribute-syntax}

컴포넌트에 속성을 전달할 때 "짧은 속성" 문법을 사용할 수도 있습니다. 속성 이름이 해당 변수 이름과 자주 일치하기 때문에 이 방법이 편리할 때가 많습니다:

```blade
{{-- 짧은 속성 문법... --}}
<x-profile :$userId :$name />

{{-- 아래와 동일합니다... --}}
<x-profile :user-id="$userId" :name="$name" />
```


#### 속성 렌더링 이스케이프 {#escaping-attribute-rendering}

Alpine.js와 같은 일부 JavaScript 프레임워크도 콜론(:)으로 시작하는 속성을 사용하기 때문에, Blade에게 해당 속성이 PHP 표현식이 아님을 알리기 위해 더블 콜론(::) 접두사를 사용할 수 있습니다. 예를 들어, 다음과 같은 컴포넌트가 있다고 가정해봅시다:

```blade
<x-button ::class="{ danger: isDeleting }">
    Submit
</x-button>
```

이 경우 Blade는 다음과 같은 HTML을 렌더링합니다:

```blade
<button :class="{ danger: isDeleting }">
    Submit
</button>
```


#### 컴포넌트 메서드 {#component-methods}

컴포넌트 템플릿에서 public 변수뿐만 아니라, 컴포넌트에 정의된 public 메서드도 호출할 수 있습니다. 예를 들어, `isSelected`라는 메서드를 가진 컴포넌트를 생각해봅시다:

```php
/**
 * 주어진 옵션이 현재 선택된 옵션인지 확인합니다.
 */
public function isSelected(string $option): bool
{
    return $option === $this->selected;
}
```

컴포넌트 템플릿에서는 메서드 이름과 동일한 변수를 호출하여 이 메서드를 실행할 수 있습니다:

```blade
<option {{ $isSelected($value) ? 'selected' : '' }} value="{{ $value }}">
    {{ $label }}
</option>
```


#### 컴포넌트 클래스 내에서 속성과 슬롯 접근하기 {#using-attributes-slots-within-component-class}

Blade 컴포넌트는 컴포넌트 클래스의 render 메서드 안에서 컴포넌트 이름, 속성(attributes), 슬롯(slot)에 접근할 수 있도록 지원합니다. 이 데이터를 사용하려면, 컴포넌트의 `render` 메서드에서 클로저(Closure)를 반환해야 합니다:

```php
use Closure;

/**
 * 컴포넌트를 나타내는 뷰 또는 내용을 반환합니다.
 */
public function render(): Closure
{
    return function () {
        return '<div {{ $attributes }}>Components content</div>';
    };
}
```

컴포넌트의 `render` 메서드에서 반환된 클로저는 `$data` 배열을 유일한 인자로 받을 수도 있습니다. 이 배열에는 컴포넌트에 대한 여러 정보가 담겨 있습니다:

```php
return function (array $data) {
    // $data['componentName'];
    // $data['attributes'];
    // $data['slot'];

    return '<div {{ $attributes }}>Components content</div>';
}
```

> [!WARNING]
> `$data` 배열의 요소를 `render` 메서드에서 반환하는 Blade 문자열에 직접 삽입해서는 안 됩니다. 그렇게 할 경우, 악의적인 속성 내용(attribute content)을 통해 원격 코드 실행이 발생할 수 있습니다.

`componentName`은 `x-` 접두사 뒤에 오는 HTML 태그에서 사용된 이름과 동일합니다. 예를 들어 `<x-alert />`의 `componentName`은 `alert`가 됩니다. `attributes` 요소에는 HTML 태그에 존재했던 모든 속성이 담깁니다. `slot` 요소는 컴포넌트 슬롯의 내용을 담고 있는 `Illuminate\Support\HtmlString` 인스턴스입니다.

클로저는 문자열을 반환해야 합니다. 반환된 문자열이 실제로 존재하는 뷰의 이름이라면 해당 뷰가 렌더링되고, 그렇지 않으면 반환된 문자열이 인라인 Blade 뷰로 평가됩니다.


#### 추가 의존성 {#additional-dependencies}

만약 컴포넌트가 Laravel의 [서비스 컨테이너](/laravel/12.x/container)에서 의존성을 필요로 한다면, 해당 의존성을 컴포넌트의 데이터 속성들보다 먼저 나열하면 컨테이너가 자동으로 주입해줍니다:

```php
use App\Services\AlertCreator;

/**
 * 컴포넌트 인스턴스 생성.
 */
public function __construct(
    public AlertCreator $creator,
    public string $type,
    public string $message,
) {}
```


#### 속성 / 메서드 숨기기 {#hiding-attributes-and-methods}

일부 public 메서드나 프로퍼티가 컴포넌트 템플릿에서 변수로 노출되는 것을 방지하고 싶다면, 해당 항목들을 컴포넌트의 `$except` 배열 프로퍼티에 추가할 수 있습니다:

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    /**
     * 컴포넌트 템플릿에 노출되지 않아야 하는 프로퍼티 / 메서드 목록입니다.
     *
     * @var array
     */
    protected $except = ['type'];

    /**
     * 컴포넌트 인스턴스를 생성합니다.
     */
    public function __construct(
        public string $type,
    ) {}
}
```


### 컴포넌트 속성 {#component-attributes}

이미 컴포넌트에 데이터 속성을 전달하는 방법을 살펴보았습니다. 하지만 때로는 컴포넌트의 동작에 꼭 필요한 데이터가 아니더라도, `class`와 같은 추가적인 HTML 속성을 지정해야 할 때가 있습니다. 일반적으로 이러한 추가 속성들은 컴포넌트 템플릿의 루트 엘리먼트에 전달되길 원할 것입니다. 예를 들어, 아래와 같이 `alert` 컴포넌트를 렌더링한다고 가정해봅시다:

```blade
<x-alert type="error" :message="$message" class="mt-4"/>
```

컴포넌트 생성자에 포함되지 않은 모든 속성들은 자동으로 컴포넌트의 "속성 백(attribute bag)"에 추가됩니다. 이 속성 백은 `$attributes` 변수로 컴포넌트에서 자동으로 사용할 수 있습니다. 이 변수만 출력하면 모든 속성이 컴포넌트 내에서 렌더링됩니다:

```blade
<div {{ $attributes }}>
    <!-- 컴포넌트 내용 -->
</div>
```

> [!WARNING]
> 현재로서는 `@env`와 같은 디렉티브를 컴포넌트 태그 내에서 사용하는 것은 지원되지 않습니다. 예를 들어, `<x-alert :live="@env('production')"/>`와 같은 코드는 컴파일되지 않습니다.


#### 기본 / 병합된 속성 {#default-merged-attributes}

때때로 컴포넌트의 속성에 기본값을 지정하거나, 추가 값을 병합해야 할 때가 있습니다. 이를 위해 속성 백(attribute bag)의 merge 메서드를 사용할 수 있습니다. 이 메서드는 컴포넌트에 항상 적용되어야 하는 기본 CSS 클래스를 정의할 때 특히 유용합니다:

```blade
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

이 컴포넌트가 다음과 같이 사용된다고 가정해봅시다:

```blade
<x-alert type="error" :message="$message" class="mb-4"/>
```

최종적으로 렌더링되는 HTML은 다음과 같습니다:

```blade
<div class="alert alert-error mb-4">
    <!-- $message 변수의 내용 -->
</div>
```


#### 조건부로 클래스 병합하기 {#conditionally-merge-classes}

때때로 특정 조건이 `true`일 때만 클래스를 병합하고 싶을 수 있습니다. 이럴 때는 `class` 메서드를 사용할 수 있습니다. 이 메서드는 클래스를 배열로 받아들이며, 배열의 키에는 추가하고자 하는 클래스(들)를, 값에는 불리언 표현식을 넣습니다. 배열 요소의 키가 숫자일 경우, 해당 클래스는 항상 렌더링된 클래스 목록에 포함됩니다:

```blade
<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
    {{ $message }}
</div>
```

컴포넌트에 다른 속성도 병합해야 한다면, `class` 메서드 뒤에 `merge` 메서드를 체이닝하여 사용할 수 있습니다:

```blade
<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

> [!NOTE]
> 병합된 속성을 받지 않는 다른 HTML 요소에 조건부로 클래스를 컴파일해야 한다면, [@class 디렉티브](#conditional-classes)를 사용할 수 있습니다.


#### 클래스가 아닌 속성 병합 {#non-class-attribute-merging}

`class` 속성이 아닌 다른 속성을 병합할 때, `merge` 메서드에 전달된 값은 해당 속성의 "기본값"으로 간주됩니다. 하지만 `class` 속성과 달리, 이러한 속성들은 주입된 속성 값과 병합되지 않고, 주입된 값으로 덮어써집니다. 예를 들어, `button` 컴포넌트의 구현은 다음과 같을 수 있습니다:

```blade
<button {{ $attributes->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

컴포넌트를 사용할 때 커스텀 `type`을 지정할 수 있습니다. 만약 `type`을 지정하지 않으면 기본적으로 `button` 타입이 사용됩니다:

```blade
<x-button type="submit">
    Submit
</x-button>
```

이 예시에서 `button` 컴포넌트가 렌더링되면 다음과 같은 HTML이 생성됩니다:

```blade
<button type="submit">
    Submit
</button>
```

`class`가 아닌 다른 속성도 기본값과 주입된 값을 함께 연결하고 싶다면, `prepends` 메서드를 사용할 수 있습니다. 아래 예시에서 `data-controller` 속성은 항상 `profile-controller`로 시작하며, 추가로 주입된 `data-controller` 값이 이 기본값 뒤에 붙게 됩니다:

```blade
<div {{ $attributes->merge(['data-controller' => $attributes->prepends('profile-controller')]) }}>
    {{ $slot }}
</div>
```


#### 속성 조회 및 필터링 {#filtering-attributes}

`filter` 메서드를 사용하여 속성을 필터링할 수 있습니다. 이 메서드는 클로저를 인자로 받으며, 클로저가 `true`를 반환하면 해당 속성이 속성 집합에 남게 됩니다:

```blade
{{ $attributes->filter(fn (string $value, string $key) => $key == 'foo') }}
```

편의를 위해, `whereStartsWith` 메서드를 사용하면 키가 지정한 문자열로 시작하는 모든 속성을 가져올 수 있습니다:

```blade
{{ $attributes->whereStartsWith('wire:model') }}
```

반대로, `whereDoesntStartWith` 메서드를 사용하면 키가 지정한 문자열로 시작하는 모든 속성을 제외할 수 있습니다:

```blade
{{ $attributes->whereDoesntStartWith('wire:model') }}
```

`first` 메서드를 사용하면 주어진 속성 집합에서 첫 번째 속성을 렌더링할 수 있습니다:

```blade
{{ $attributes->whereStartsWith('wire:model')->first() }}
```

컴포넌트에 특정 속성이 존재하는지 확인하려면 `has` 메서드를 사용할 수 있습니다. 이 메서드는 속성 이름을 유일한 인자로 받아, 해당 속성이 존재하는지 여부를 불리언 값으로 반환합니다:

```blade
@if ($attributes->has('class'))
    <div>Class 속성이 존재합니다</div>
@endif
```

`has` 메서드에 배열을 전달하면, 전달된 모든 속성이 컴포넌트에 존재하는지 확인합니다:

```blade
@if ($attributes->has(['name', 'class']))
    <div>모든 속성이 존재합니다</div>
@endif
```

`hasAny` 메서드는 전달된 속성 중 하나라도 컴포넌트에 존재하는지 확인할 때 사용할 수 있습니다:

```blade
@if ($attributes->hasAny(['href', ':href', 'v-bind:href']))
    <div>하나 이상의 속성이 존재합니다</div>
@endif
```

특정 속성의 값을 가져오려면 `get` 메서드를 사용할 수 있습니다:

```blade
{{ $attributes->get('class') }}
```

`only` 메서드는 지정한 키를 가진 속성만을 가져올 때 사용할 수 있습니다:

```blade
{{ $attributes->only(['class']) }}
```

`except` 메서드는 지정한 키를 가진 속성을 제외한 모든 속성을 가져올 때 사용할 수 있습니다:

```blade
{{ $attributes->except(['class']) }}
```


### 예약어 {#reserved-keywords}

기본적으로, 일부 키워드는 Blade의 내부 컴포넌트 렌더링에 사용되기 때문에 예약되어 있습니다. 아래의 키워드들은 컴포넌트 내에서 public 속성이나 메서드 이름으로 정의할 수 없습니다:

<div class="content-list" markdown="1">

- `data`
- `render`
- `resolveView`
- `shouldRender`
- `view`
- `withAttributes`
- `withName`

</div>


### 슬롯 {#slots}

컴포넌트에 "슬롯"을 통해 추가적인 콘텐츠를 전달해야 할 때가 자주 있습니다. 컴포넌트 슬롯은 `$slot` 변수를 출력하여 렌더링됩니다. 이 개념을 살펴보기 위해, `alert` 컴포넌트가 다음과 같은 마크업을 가지고 있다고 가정해봅시다:

```blade
<!-- /resources/views/components/alert.blade.php -->

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

컴포넌트에 콘텐츠를 삽입하여 슬롯에 값을 전달할 수 있습니다:

```blade
<x-alert>
    <strong>Whoops!</strong> 문제가 발생했습니다!
</x-alert>
```

때로는 컴포넌트가 여러 위치에 서로 다른 슬롯을 렌더링해야 할 수도 있습니다. 예를 들어, "title" 슬롯을 주입할 수 있도록 alert 컴포넌트를 수정해보겠습니다:

```blade
<!-- /resources/views/components/alert.blade.php -->

<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

명명된 슬롯의 내용을 정의하려면 `x-slot` 태그를 사용할 수 있습니다. 명시적으로 `x-slot` 태그 안에 있지 않은 모든 콘텐츠는 `$slot` 변수로 컴포넌트에 전달됩니다:

```xml
<x-alert>
    <x-slot:title>
        서버 오류
    </x-slot>

    <strong>Whoops!</strong> 문제가 발생했습니다!
</x-alert>
```

슬롯에 콘텐츠가 있는지 확인하려면 슬롯의 `isEmpty` 메서드를 사용할 수 있습니다:

```blade
<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    @if ($slot->isEmpty())
        슬롯이 비어 있을 때 표시되는 기본 콘텐츠입니다.
    @else
        {{ $slot }}
    @endif
</div>
```

또한, 슬롯에 HTML 주석이 아닌 "실제" 콘텐츠가 있는지 확인하려면 `hasActualContent` 메서드를 사용할 수 있습니다:

```blade
@if ($slot->hasActualContent())
    이 슬롯에는 주석이 아닌 실제 콘텐츠가 있습니다.
@endif
```


#### Scoped Slots {#scoped-slots}

Vue와 같은 JavaScript 프레임워크를 사용해본 적이 있다면, "scoped slots"라는 개념에 익숙할 수 있습니다. scoped slots는 슬롯 내부에서 컴포넌트의 데이터나 메서드에 접근할 수 있도록 해줍니다. Laravel에서도 컴포넌트 클래스에 public 메서드나 프로퍼티를 정의하고, 슬롯 내부에서 `$component` 변수를 통해 해당 컴포넌트에 접근함으로써 유사한 동작을 구현할 수 있습니다. 아래 예시에서는 `x-alert` 컴포넌트 클래스에 public `formatAlert` 메서드가 정의되어 있다고 가정합니다:

```blade
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```


#### 슬롯 속성 {#slot-attributes}

Blade 컴포넌트와 마찬가지로, 슬롯에도 CSS 클래스 이름과 같은 [속성](#component-attributes)을 추가로 지정할 수 있습니다.

```xml
<x-card class="shadow-sm">
    <x-slot:heading class="font-bold">
        Heading
    </x-slot>

    Content

    <x-slot:footer class="text-sm">
        Footer
    </x-slot>
</x-card>
```

슬롯 속성과 상호작용하려면, 슬롯 변수의 `attributes` 프로퍼티에 접근할 수 있습니다. 속성과 상호작용하는 방법에 대한 자세한 내용은 [컴포넌트 속성](#component-attributes) 문서를 참고하세요.

```blade
@props([
    'heading',
    'footer',
])

<div {{ $attributes->class(['border']) }}>
    <h1 {{ $heading->attributes->class(['text-lg']) }}>
        {{ $heading }}
    </h1>

    {{ $slot }}

    <footer {{ $footer->attributes->class(['text-gray-700']) }}>
        {{ $footer }}
    </footer>
</div>
```


### 인라인 컴포넌트 뷰 {#inline-component-views}

아주 작은 컴포넌트의 경우, 컴포넌트 클래스와 뷰 템플릿을 각각 관리하는 것이 번거롭게 느껴질 수 있습니다. 이런 이유로, `render` 메서드에서 컴포넌트의 마크업을 직접 반환할 수 있습니다:

```php
/**
 * 컴포넌트를 나타내는 뷰 또는 내용을 반환합니다.
 */
public function render(): string
{
    return <<<'blade'
        <div class="alert alert-danger">
            {{ $slot }}
        </div>
    blade;
}
```


#### 인라인 뷰 컴포넌트 생성하기 {#generating-inline-view-components}

인라인 뷰를 렌더링하는 컴포넌트를 생성하려면, `make:component` 명령어를 실행할 때 `inline` 옵션을 사용할 수 있습니다:

```shell
php artisan make:component Alert --inline
```


### 동적 컴포넌트 {#dynamic-components}

때때로 어떤 컴포넌트를 렌더링해야 할지 런타임까지 알 수 없는 경우가 있습니다. 이런 상황에서는 Laravel에 내장된 `dynamic-component` 컴포넌트를 사용하여 런타임 값이나 변수에 따라 컴포넌트를 렌더링할 수 있습니다:

```blade
// $componentName = "secondary-button";

<x-dynamic-component :component="$componentName" class="mt-4" />
```


### 컴포넌트 수동 등록 {#manually-registering-components}

> [!WARNING]
> 아래의 컴포넌트 수동 등록에 관한 문서는 주로 뷰 컴포넌트를 포함하는 Laravel 패키지를 작성하는 경우에 해당합니다. 패키지를 작성하지 않는다면, 이 부분의 컴포넌트 문서는 해당되지 않을 수 있습니다.

자신의 애플리케이션에서 컴포넌트를 작성할 때는 `app/View/Components` 디렉터리와 `resources/views/components` 디렉터리 내의 컴포넌트가 자동으로 인식됩니다.

하지만 Blade 컴포넌트를 사용하는 패키지를 개발하거나, 컴포넌트를 일반적이지 않은 디렉터리에 배치하는 경우에는 컴포넌트 클래스와 해당 HTML 태그 별칭을 수동으로 등록해야 Laravel이 컴포넌트의 위치를 알 수 있습니다. 일반적으로 패키지의 서비스 프로바이더의 `boot` 메소드에서 컴포넌트를 등록합니다:

```php
use Illuminate\Support\Facades\Blade;
use VendorPackage\View\Components\AlertComponent;

/**
 * 패키지의 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::component('package-alert', AlertComponent::class);
}
```

컴포넌트가 등록되면, 태그 별칭을 사용하여 다음과 같이 렌더링할 수 있습니다:

```blade
<x-package-alert/>
```

#### 패키지 컴포넌트 자동 로딩

또 다른 방법으로, `componentNamespace` 메서드를 사용하여 규칙에 따라 컴포넌트 클래스를 자동으로 로드할 수 있습니다. 예를 들어, `Nightshade` 패키지에 `Calendar`와 `ColorPicker` 컴포넌트가 있고, 이들이 `Package\Views\Components` 네임스페이스에 위치한다고 가정해봅시다.

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지의 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
}
```

이렇게 설정하면, `package-name::` 문법을 사용하여 벤더 네임스페이스로 패키지 컴포넌트를 사용할 수 있습니다.

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

Blade는 컴포넌트 이름을 파스칼 케이스로 변환하여 해당 컴포넌트와 연결된 클래스를 자동으로 감지합니다. 또한, "dot" 표기법을 사용하여 하위 디렉터리도 지원합니다.


## 익명 컴포넌트 {#anonymous-components}

인라인 컴포넌트와 유사하게, 익명 컴포넌트는 단일 파일을 통해 컴포넌트를 관리할 수 있는 방법을 제공합니다. 하지만 익명 컴포넌트는 하나의 뷰 파일만을 사용하며, 별도의 클래스가 필요하지 않습니다. 익명 컴포넌트를 정의하려면 `resources/views/components` 디렉터리 내에 Blade 템플릿 파일을 두기만 하면 됩니다. 예를 들어, `resources/views/components/alert.blade.php`에 컴포넌트를 정의했다면 다음과 같이 간단히 렌더링할 수 있습니다:

```blade
<x-alert/>
```

컴포넌트가 `components` 디렉터리 내에 더 깊이 중첩되어 있다면 `.` 문자를 사용해 경로를 나타낼 수 있습니다. 예를 들어, 컴포넌트가 `resources/views/components/inputs/button.blade.php`에 정의되어 있다면 다음과 같이 렌더링할 수 있습니다:

```blade
<x-inputs.button/>
```


### 익명 인덱스 컴포넌트 {#anonymous-index-components}

때때로 하나의 컴포넌트가 여러 개의 Blade 템플릿으로 구성될 때, 해당 컴포넌트의 템플릿들을 하나의 디렉터리로 그룹화하고 싶을 수 있습니다. 예를 들어, 다음과 같은 디렉터리 구조를 가진 "아코디언" 컴포넌트를 생각해봅시다:

```text
/resources/views/components/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```

이러한 디렉터리 구조를 사용하면 아래와 같이 아코디언 컴포넌트와 그 아이템을 렌더링할 수 있습니다:

```blade
<x-accordion>
    <x-accordion.item>
        ...
    </x-accordion.item>
</x-accordion>
```

하지만 `x-accordion`을 통해 아코디언 컴포넌트를 렌더링하려면, "인덱스" 역할을 하는 아코디언 컴포넌트 템플릿을 `resources/views/components` 디렉터리에 두어야 했고, 다른 아코디언 관련 템플릿들과 함께 `accordion` 디렉터리 안에 중첩시킬 수 없었습니다.

다행히도, Blade에서는 컴포넌트의 디렉터리 이름과 동일한 파일을 해당 디렉터리 내부에 둘 수 있습니다. 이 템플릿이 존재하면, 디렉터리 안에 중첩되어 있더라도 컴포넌트의 "루트" 요소로 렌더링할 수 있습니다. 따라서 위 예시에서 사용한 Blade 문법을 그대로 사용할 수 있으며, 디렉터리 구조는 다음과 같이 변경할 수 있습니다:

```text
/resources/views/components/accordion/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```


### 데이터 속성 / 어트리뷰트 {#data-properties-attributes}

익명 컴포넌트에는 연결된 클래스가 없기 때문에, 어떤 데이터를 컴포넌트에 변수로 전달해야 하고, 어떤 속성을 컴포넌트의 [어트리뷰트 백](#component-attributes)에 넣어야 하는지 궁금할 수 있습니다.

컴포넌트의 Blade 템플릿 상단에서 `@props` 디렉티브를 사용하여 어떤 속성을 데이터 변수로 사용할지 지정할 수 있습니다. 컴포넌트의 나머지 모든 속성은 컴포넌트의 어트리뷰트 백을 통해 사용할 수 있습니다. 데이터 변수에 기본값을 지정하고 싶다면, 변수명을 배열의 키로, 기본값을 배열의 값으로 지정하면 됩니다:

```blade
<!-- /resources/views/components/alert.blade.php -->

@props(['type' => 'info', 'message'])

<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

위와 같이 컴포넌트를 정의했다면, 다음과 같이 컴포넌트를 렌더링할 수 있습니다:

```blade
<x-alert type="error" :message="$message" class="mb-4"/>
```


### 부모 데이터 접근하기 {#accessing-parent-data}

때때로 자식 컴포넌트 내부에서 부모 컴포넌트의 데이터를 접근하고 싶을 때가 있습니다. 이런 경우에는 `@aware` 디렉티브를 사용할 수 있습니다. 예를 들어, 부모 `<x-menu>`와 자식 `<x-menu.item>`으로 구성된 복잡한 메뉴 컴포넌트를 만든다고 가정해봅시다.

```blade
<x-menu color="purple">
    <x-menu.item>...</x-menu.item>
    <x-menu.item>...</x-menu.item>
</x-menu>
```

`<x-menu>` 컴포넌트는 다음과 같이 구현할 수 있습니다.

```blade
<!-- /resources/views/components/menu/index.blade.php -->

@props(['color' => 'gray'])

<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>
    {{ $slot }}
</ul>
```

`color` prop은 부모(`<x-menu>`)에만 전달되었기 때문에, 자식인 `<x-menu.item>` 내부에서는 기본적으로 사용할 수 없습니다. 하지만 `@aware` 디렉티브를 사용하면, 이 값을 `<x-menu.item>` 내부에서도 사용할 수 있습니다.

```blade
<!-- /resources/views/components/menu/item.blade.php -->

@aware(['color' => 'gray'])

<li {{ $attributes->merge(['class' => 'text-'.$color.'-800']) }}>
    {{ $slot }}
</li>
```

> [!WARNING]
> `@aware` 디렉티브는 부모 컴포넌트에 HTML 속성으로 명시적으로 전달된 데이터만 접근할 수 있습니다. 부모 컴포넌트의 `@props`에서 기본값으로만 설정된 값은 `@aware` 디렉티브로 접근할 수 없습니다.


### 익명 컴포넌트 경로 {#anonymous-component-paths}

앞서 설명한 것처럼, 익명 컴포넌트는 일반적으로 `resources/views/components` 디렉터리에 Blade 템플릿을 추가하여 정의합니다. 하지만 기본 경로 외에 다른 익명 컴포넌트 경로를 Laravel에 등록하고 싶을 때도 있습니다.

`anonymousComponentPath` 메서드는 익명 컴포넌트가 위치한 "경로"를 첫 번째 인자로 받고, 컴포넌트가 속할 선택적 "네임스페이스"를 두 번째 인자로 받습니다. 일반적으로 이 메서드는 애플리케이션의 [서비스 프로바이더](/laravel/12.x/providers) 중 하나의 `boot` 메서드에서 호출해야 합니다.

```php
/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::anonymousComponentPath(__DIR__.'/../components');
}
```

위 예시처럼 프리픽스 없이 컴포넌트 경로를 등록하면, Blade 컴포넌트에서 해당 프리픽스 없이도 컴포넌트를 렌더링할 수 있습니다. 예를 들어, 위에서 등록한 경로에 `panel.blade.php` 컴포넌트가 있다면 다음과 같이 렌더링할 수 있습니다.

```blade
<x-panel />
```

`anonymousComponentPath` 메서드의 두 번째 인자로 프리픽스 "네임스페이스"를 지정할 수도 있습니다.

```php
Blade::anonymousComponentPath(__DIR__.'/../components', 'dashboard');
```

프리픽스를 지정하면, 해당 "네임스페이스" 내의 컴포넌트는 컴포넌트 이름 앞에 네임스페이스를 붙여서 렌더링할 수 있습니다.

```blade
<x-dashboard::panel />
```


## 레이아웃 만들기 {#building-layouts}


### 컴포넌트를 사용한 레이아웃 {#layouts-using-components}

대부분의 웹 애플리케이션은 여러 페이지에 걸쳐 동일한 일반 레이아웃을 유지합니다. 만약 우리가 생성하는 모든 뷰마다 전체 레이아웃 HTML을 반복해야 한다면, 애플리케이션을 관리하기가 매우 번거롭고 어려울 것입니다. 다행히도, 이 레이아웃을 하나의 [Blade 컴포넌트](#components)로 정의한 다음, 애플리케이션 전반에 걸쳐 재사용할 수 있습니다.


#### 레이아웃 컴포넌트 정의하기 {#defining-the-layout-component}

예를 들어, "todo" 리스트 애플리케이션을 만든다고 가정해봅시다. 다음과 같이 `layout` 컴포넌트를 정의할 수 있습니다:

```blade
<!-- resources/views/components/layout.blade.php -->

<html>
    <head>
        <title>{{ $title ?? 'Todo Manager' }}</title>
    </head>
    <body>
        <h1>Todos</h1>
        <hr/>
        {{ $slot }}
    </body>
</html>
```


#### 레이아웃 컴포넌트 적용하기 {#applying-the-layout-component}

`layout` 컴포넌트를 정의했다면, 이제 이 컴포넌트를 사용하는 Blade 뷰를 생성할 수 있습니다. 아래 예시에서는 작업 목록을 보여주는 간단한 뷰를 정의합니다:

```blade
<!-- resources/views/tasks.blade.php -->

<x-layout>
    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

컴포넌트에 주입된 콘텐츠는 `layout` 컴포넌트 내의 기본 `$slot` 변수로 전달된다는 점을 기억하세요. 또한, `layout` 컴포넌트는 `$title` 슬롯이 제공되면 이를 사용하고, 그렇지 않으면 기본 제목을 표시합니다. 작업 목록 뷰에서 [컴포넌트 문서](#components)에서 설명한 표준 슬롯 문법을 사용해 커스텀 제목을 주입할 수 있습니다:

```blade
<!-- resources/views/tasks.blade.php -->

<x-layout>
    <x-slot:title>
        커스텀 제목
    </x-slot>

    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

이제 레이아웃과 작업 목록 뷰를 정의했으니, 라우트에서 `tasks` 뷰를 반환하면 됩니다:

```php
use App\Models\Task;

Route::get('/tasks', function () {
    return view('tasks', ['tasks' => Task::all()]);
});
```


### 템플릿 상속을 이용한 레이아웃 {#layouts-using-template-inheritance}


#### 레이아웃 정의하기 {#defining-a-layout}

레이아웃은 "템플릿 상속"을 통해서도 생성할 수 있습니다. 이는 [컴포넌트](#components)가 도입되기 이전에 애플리케이션을 구축하는 주요 방법이었습니다.

먼저, 간단한 예제를 살펴보겠습니다. 우선, 페이지 레이아웃을 확인해보겠습니다. 대부분의 웹 애플리케이션은 여러 페이지에서 동일한 일반 레이아웃을 유지하므로, 이 레이아웃을 하나의 Blade 뷰로 정의하는 것이 편리합니다.

```blade
<!-- resources/views/layouts/app.blade.php -->

<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>
```

위 파일은 일반적인 HTML 마크업을 포함하고 있습니다. 하지만 `@section`과 `@yield` 디렉티브에 주목하세요. `@section` 디렉티브는 이름에서 알 수 있듯이 콘텐츠의 구역을 정의하며, `@yield` 디렉티브는 해당 구역의 내용을 표시하는 데 사용됩니다.

이제 애플리케이션의 레이아웃을 정의했으니, 이 레이아웃을 상속받는 자식 페이지를 정의해보겠습니다.


#### 레이아웃 확장하기 {#extending-a-layout}

자식 뷰를 정의할 때는 `@extends` Blade 지시어를 사용하여 해당 자식 뷰가 "상속"할 레이아웃을 지정합니다. Blade 레이아웃을 확장하는 뷰는 `@section` 지시어를 사용하여 레이아웃의 섹션에 콘텐츠를 주입할 수 있습니다. 위의 예시에서 볼 수 있듯이, 이러한 섹션의 내용은 레이아웃에서 `@yield`를 통해 표시됩니다.

```blade
<!-- resources/views/child.blade.php -->

@extends('layouts.app')

@section('title', 'Page Title')

@section('sidebar')
    @@parent

    <p>This is appended to the master sidebar.</p>
@endsection

@section('content')
    <p>This is my body content.</p>
@endsection
```

이 예시에서 `sidebar` 섹션은 `@@parent` 지시어를 사용하여 레이아웃의 사이드바에 내용을 덮어쓰지 않고 추가(append)하고 있습니다. 뷰가 렌더링될 때 `@@parent` 지시어는 레이아웃의 해당 콘텐츠로 대체됩니다.

> [!NOTE]
> 이전 예시와 달리, 이 `sidebar` 섹션은 `@show` 대신 `@endsection`으로 끝납니다. `@endsection` 지시어는 섹션을 정의만 하고, `@show`는 섹션을 정의함과 동시에 **즉시 출력(yield)** 합니다.

`@yield` 지시어는 두 번째 인자로 기본값도 받을 수 있습니다. 만약 출력하려는 섹션이 정의되어 있지 않다면, 이 기본값이 렌더링됩니다.

```blade
@yield('content', 'Default content')
```


## 폼 {#forms}


### CSRF 필드 {#csrf-field}

애플리케이션에서 HTML 폼을 정의할 때마다, 폼 안에 숨겨진 CSRF 토큰 필드를 포함해야 합니다. 이렇게 하면 [CSRF 보호](/laravel/12.x/csrf) 미들웨어가 요청을 검증할 수 있습니다. 토큰 필드는 `@csrf` Blade 디렉티브를 사용해 생성할 수 있습니다:

```blade
<form method="POST" action="/profile">
    @csrf

    ...
</form>
```


### 메서드 필드 {#method-field}

HTML 폼은 `PUT`, `PATCH`, 또는 `DELETE` 요청을 직접 보낼 수 없기 때문에, 이러한 HTTP 메서드를 흉내내기 위해 숨겨진 `_method` 필드를 추가해야 합니다. `@method` Blade 디렉티브를 사용하면 이 필드를 쉽게 생성할 수 있습니다:

```blade
<form action="/foo/bar" method="POST">
    @method('PUT')

    ...
</form>
```


### 유효성 검사 에러 {#validation-errors}

`@error` 디렉티브는 주어진 속성에 대해 [유효성 검사 에러 메시지](/laravel/12.x/validation#quick-displaying-the-validation-errors)가 존재하는지 빠르게 확인할 수 있도록 해줍니다. `@error` 디렉티브 내부에서는 `$message` 변수를 출력하여 에러 메시지를 표시할 수 있습니다:

```blade
<!-- /resources/views/post/create.blade.php -->

<label for="title">Post Title</label>

<input
    id="title"
    type="text"
    class="@error('title') is-invalid @enderror"
/>

@error('title')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

`@error` 디렉티브는 "if" 문으로 컴파일되기 때문에, `@else` 디렉티브를 사용하여 해당 속성에 에러가 없을 때의 내용을 렌더링할 수도 있습니다:

```blade
<!-- /resources/views/auth.blade.php -->

<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email') is-invalid @else is-valid @enderror"
/>
```

여러 개의 폼이 있는 페이지에서 [특정 에러 백의 이름](/laravel/12.x/validation#named-error-bags)을 두 번째 인자로 `@error` 디렉티브에 전달하여 해당 에러 백의 유효성 검사 에러 메시지를 가져올 수 있습니다:

```blade
<!-- /resources/views/auth.blade.php -->

<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email', 'login') is-invalid @enderror"
/>

@error('email', 'login')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```


## 스택 {#stacks}

Blade에서는 이름이 지정된 스택에 내용을 추가(push)할 수 있으며, 이 스택은 다른 뷰나 레이아웃에서 렌더링할 수 있습니다. 이 기능은 자식 뷰에서 필요한 JavaScript 라이브러리를 지정할 때 특히 유용합니다.

```blade
@push('scripts')
    <script src="/example.js"></script>
@endpush
```

특정 불리언 조건이 true일 때만 `@push`를 사용하고 싶다면, `@pushIf` 디렉티브를 사용할 수 있습니다.

```blade
@pushIf($shouldPush, 'scripts')
    <script src="/example.js"></script>
@endPushIf
```

스택에는 원하는 만큼 여러 번 내용을 추가할 수 있습니다. 스택의 전체 내용을 렌더링하려면, `@stack` 디렉티브에 스택의 이름을 전달하면 됩니다.

```blade
<head>
    <!-- Head Contents -->

    @stack('scripts')
</head>
```

스택의 맨 앞에 내용을 추가하고 싶다면, `@prepend` 디렉티브를 사용하면 됩니다.

```blade
@push('scripts')
    이 내용이 두 번째로 추가됩니다...
@endpush

// 이후에...

@prepend('scripts')
    이 내용이 첫 번째로 추가됩니다...
@endprepend
```


## 서비스 주입 {#service-injection}

`@inject` 디렉티브는 Laravel [서비스 컨테이너](/laravel/12.x/container)에서 서비스를 가져올 때 사용할 수 있습니다. `@inject`에 전달되는 첫 번째 인자는 서비스가 할당될 변수의 이름이고, 두 번째 인자는 주입하고자 하는 서비스의 클래스 또는 인터페이스 이름입니다.

```blade
@inject('metrics', 'App\Services\MetricsService')

<div>
    월간 수익: {{ $metrics->monthlyRevenue() }}.
</div>
```


## 인라인 Blade 템플릿 렌더링 {#rendering-inline-blade-templates}

가끔 원시 Blade 템플릿 문자열을 유효한 HTML로 변환해야 할 때가 있습니다. 이럴 때는 `Blade` 파사드에서 제공하는 `render` 메서드를 사용할 수 있습니다. `render` 메서드는 Blade 템플릿 문자열과 템플릿에 전달할 데이터 배열(선택 사항)을 인자로 받습니다:

```php
use Illuminate\Support\Facades\Blade;

return Blade::render('Hello, {{ $name }}', ['name' => 'Julian Bashir']);
```

Laravel은 인라인 Blade 템플릿을 렌더링할 때 해당 템플릿을 `storage/framework/views` 디렉터리에 임시 파일로 저장합니다. 만약 Blade 템플릿 렌더링 후 이러한 임시 파일을 삭제하고 싶다면, `deleteCachedView` 인자를 메서드에 전달하면 됩니다:

```php
return Blade::render(
    'Hello, {{ $name }}',
    ['name' => 'Julian Bashir'],
    deleteCachedView: true
);
```


## Blade 프래그먼트 렌더링 {#rendering-blade-fragments}

[Tubro](https://turbo.hotwired.dev/)나 [htmx](https://htmx.org/)와 같은 프론트엔드 프레임워크를 사용할 때, HTTP 응답에서 Blade 템플릿의 일부만 반환해야 하는 경우가 있습니다. Blade "프래그먼트"를 사용하면 이를 손쉽게 처리할 수 있습니다. 먼저, Blade 템플릿의 일부를 `@fragment`와 `@endfragment` 지시문으로 감싸주세요:

```blade
@fragment('user-list')
    <ul>
        @foreach ($users as $user)
            <li>{{ $user->name }}</li>
        @endforeach
    </ul>
@endfragment
```

이제 이 템플릿을 사용하는 뷰를 렌더링할 때, `fragment` 메서드를 호출하여 지정한 프래그먼트만 HTTP 응답에 포함되도록 할 수 있습니다:

```php
return view('dashboard', ['users' => $users])->fragment('user-list');
```

`fragmentIf` 메서드를 사용하면 주어진 조건에 따라 뷰의 프래그먼트만 반환할 수 있습니다. 조건이 충족되지 않으면 전체 뷰가 반환됩니다:

```php
return view('dashboard', ['users' => $users])
    ->fragmentIf($request->hasHeader('HX-Request'), 'user-list');
```

`fragments` 및 `fragmentsIf` 메서드를 사용하면 여러 개의 뷰 프래그먼트를 응답에 함께 반환할 수 있습니다. 반환된 프래그먼트들은 하나로 이어집니다:

```php
view('dashboard', ['users' => $users])
    ->fragments(['user-list', 'comment-list']);

view('dashboard', ['users' => $users])
    ->fragmentsIf(
        $request->hasHeader('HX-Request'),
        ['user-list', 'comment-list']
    );
```


## Blade 확장하기 {#extending-blade}

Blade는 `directive` 메서드를 사용하여 사용자 정의 디렉티브를 직접 정의할 수 있습니다. Blade 컴파일러가 사용자 정의 디렉티브를 만나면, 해당 디렉티브에 포함된 표현식을 콜백에 전달하여 실행합니다.

다음 예시는 `@datetime($var)` 디렉티브를 생성하는데, 이 디렉티브는 `DateTime` 인스턴스여야 하는 `$var`를 지정된 형식으로 출력합니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 등록합니다.
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Blade::directive('datetime', function (string $expression) {
            return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
        });
    }
}
```

위 예시에서 볼 수 있듯이, 디렉티브에 전달된 표현식에 `format` 메서드를 체이닝하여 사용합니다. 따라서 이 디렉티브가 생성하는 최종 PHP 코드는 다음과 같습니다:

```php
<?php echo ($var)->format('m/d/Y H:i'); ?>
```

> [!WARNING]
> Blade 디렉티브의 로직을 수정한 후에는 모든 캐시된 Blade 뷰를 삭제해야 합니다. 캐시된 Blade 뷰는 `view:clear` Artisan 명령어를 사용하여 제거할 수 있습니다.


### 커스텀 Echo 핸들러 {#custom-echo-handlers}

Blade에서 객체를 "echo"하려고 하면, 해당 객체의 `__toString` 메서드가 호출됩니다. [__toString](https://www.php.net/manual/en/language.oop5.magic.php#object.tostring) 메서드는 PHP에 내장된 "매직 메서드" 중 하나입니다. 하지만, 사용 중인 클래스가 서드파티 라이브러리에 속해 있거나, 해당 클래스의 `__toString` 메서드를 직접 제어할 수 없는 경우도 있습니다.

이런 상황에서는 Blade에서 해당 객체 타입에 대한 커스텀 echo 핸들러를 등록할 수 있습니다. 이를 위해 Blade의 `stringable` 메서드를 사용하면 됩니다. `stringable` 메서드는 클로저를 인자로 받으며, 이 클로저는 렌더링할 객체의 타입을 타입힌트로 지정해야 합니다. 일반적으로 `stringable` 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 호출합니다:

```php
use Illuminate\Support\Facades\Blade;
use Money\Money;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::stringable(function (Money $money) {
        return $money->formatTo('en_GB');
    });
}
```

커스텀 echo 핸들러를 정의한 후에는, Blade 템플릿에서 해당 객체를 단순히 echo 하면 됩니다:

```blade
Cost: {{ $money }}
```


### 커스텀 If 문 {#custom-if-statements}

간단한 커스텀 조건문을 정의할 때는 커스텀 디렉티브를 프로그래밍하는 것이 때로는 너무 복잡할 수 있습니다. 이런 이유로 Blade는 클로저를 사용해 빠르게 커스텀 조건 디렉티브를 정의할 수 있는 `Blade::if` 메서드를 제공합니다. 예를 들어, 애플리케이션에서 설정된 기본 "디스크"를 확인하는 커스텀 조건문을 정의해보겠습니다. 이는 `AppServiceProvider`의 `boot` 메서드에서 다음과 같이 할 수 있습니다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Blade::if('disk', function (string $value) {
        return config('filesystems.default') === $value;
    });
}
```

커스텀 조건문을 정의한 후에는 템플릿 내에서 다음과 같이 사용할 수 있습니다:

```blade
@disk('local')
    <!-- 애플리케이션이 local 디스크를 사용 중입니다... -->
@elsedisk('s3')
    <!-- 애플리케이션이 s3 디스크를 사용 중입니다... -->
@else
    <!-- 애플리케이션이 다른 디스크를 사용 중입니다... -->
@enddisk

@unlessdisk('local')
    <!-- 애플리케이션이 local 디스크를 사용하지 않습니다... -->
@enddisk
```
