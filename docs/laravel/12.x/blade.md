# 블레이드 템플릿
















































## 소개 {#introduction}

블레이드는 Laravel에 기본 포함된 간단하면서도 강력한 템플릿 엔진입니다. 일부 PHP 템플릿 엔진과 달리, 블레이드는 템플릿 내에서 순수 PHP 코드를 사용하는 것을 제한하지 않습니다. 실제로 모든 블레이드 템플릿은 순수 PHP 코드로 컴파일되어 수정될 때까지 캐시되므로, 블레이드는 애플리케이션에 사실상 오버헤드를 추가하지 않습니다. 블레이드 템플릿 파일은 `.blade.php` 확장자를 사용하며, 일반적으로 `resources/views` 디렉터리에 저장됩니다.

블레이드 뷰는 전역 `view` 헬퍼를 사용하여 라우트나 컨트롤러에서 반환할 수 있습니다. 물론, [뷰](/laravel/12.x/views) 문서에서 언급한 것처럼, `view` 헬퍼의 두 번째 인자를 사용하여 데이터를 블레이드 뷰에 전달할 수 있습니다:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'Finn']);
});
```


### Livewire로 블레이드 강화하기 {#supercharging-blade-with-livewire}

블레이드 템플릿을 한 단계 더 발전시키고, 동적인 인터페이스를 손쉽게 만들고 싶으신가요? [Laravel Livewire](https://livewire.laravel.com)를 확인해보세요. Livewire를 사용하면, 일반적으로 React나 Vue 같은 프론트엔드 프레임워크에서만 가능했던 동적 기능이 추가된 블레이드 컴포넌트를 작성할 수 있습니다. 복잡한 빌드 과정이나 클라이언트 사이드 렌더링 없이, 현대적이고 반응형인 프론트엔드를 구축할 수 있는 훌륭한 방법을 제공합니다.


## 데이터 표시 {#displaying-data}

블레이드 뷰에 전달된 데이터를 중괄호로 감싸서 표시할 수 있습니다. 예를 들어, 다음과 같은 라우트가 있다고 가정해봅시다:

```php
Route::get('/', function () {
    return view('welcome', ['name' => 'Samantha']);
});
```

`name` 변수의 내용을 다음과 같이 표시할 수 있습니다:

```blade
Hello, {{ $name }}.
```

> [!NOTE]
> 블레이드의 `{{ }}` 에코 문은 XSS 공격을 방지하기 위해 PHP의 `htmlspecialchars` 함수로 자동 처리됩니다.

뷰에 전달된 변수의 내용만 표시하는 데 제한되지 않습니다. 어떤 PHP 함수의 결과도 에코할 수 있습니다. 실제로, 블레이드 에코 문 내에 원하는 모든 PHP 코드를 넣을 수 있습니다:

```blade
The current UNIX timestamp is {{ time() }}.
```


### HTML 엔티티 인코딩 {#html-entity-encoding}

기본적으로 블레이드(및 Laravel의 `e` 함수)는 HTML 엔티티를 이중 인코딩합니다. 이중 인코딩을 비활성화하려면, `AppServiceProvider`의 `boot` 메서드에서 `Blade::withoutDoubleEncoding` 메서드를 호출하세요:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 부트스트랩.
     */
    public function boot(): void
    {
        Blade::withoutDoubleEncoding();
    }
}
```


#### 이스케이프되지 않은 데이터 표시 {#displaying-unescaped-data}

기본적으로 블레이드의 `{{ }}` 문은 XSS 공격을 방지하기 위해 PHP의 `htmlspecialchars` 함수로 자동 처리됩니다. 데이터를 이스케이프하지 않고 표시하려면, 다음과 같은 문법을 사용할 수 있습니다:

```blade
Hello, {!! $name !!}.
```

> [!WARNING]
> 애플리케이션 사용자가 제공한 콘텐츠를 에코할 때는 매우 주의해야 합니다. 사용자 제공 데이터를 표시할 때는 XSS 공격을 방지하기 위해 이스케이프된 이중 중괄호 문법을 사용하는 것이 일반적입니다.


### 블레이드와 자바스크립트 프레임워크 {#blade-and-javascript-frameworks}

많은 자바스크립트 프레임워크도 중괄호를 사용해 브라우저에 표현식을 표시하므로, `@` 기호를 사용해 블레이드 렌더링 엔진에 해당 표현식을 건드리지 말라고 알릴 수 있습니다. 예를 들어:

```blade
<h1>Laravel</h1>

Hello, @{{ name }}.
```

이 예시에서 `@` 기호는 블레이드에 의해 제거되지만, <span v-pre>`{{ name }}`</span> 표현식은 블레이드 엔진에 의해 건드려지지 않아 자바스크립트 프레임워크에서 렌더링할 수 있습니다.

`@` 기호는 블레이드 지시문을 이스케이프하는 데도 사용할 수 있습니다:

```blade
{{-- 블레이드 템플릿 --}}
@@if()

<!-- HTML 출력 -->
@if()
```


#### JSON 렌더링 {#rendering-json}

때때로 자바스크립트 변수를 초기화하기 위해 배열을 JSON으로 렌더링하려고 뷰에 전달할 수 있습니다. 예를 들어:

```php
<script>
    var app = <?php echo json_encode($array); ?>;
</script>
```

하지만, 직접 `json_encode`를 호출하는 대신 `Illuminate\Support\Js::from` 메서드 지시문을 사용할 수 있습니다. `from` 메서드는 PHP의 `json_encode` 함수와 동일한 인자를 받으며, 결과 JSON이 HTML 따옴표 내에 올바르게 이스케이프되도록 보장합니다. `from` 메서드는 주어진 객체나 배열을 유효한 자바스크립트 객체로 변환하는 `JSON.parse` 자바스크립트 문을 반환합니다:

```blade
<script>
    var app = {{ Illuminate\Support\Js::from($array) }};
</script>
```

최신 버전의 Laravel 애플리케이션 스켈레톤에는 이 기능을 블레이드 템플릿 내에서 편리하게 사용할 수 있는 `Js` 파사드가 포함되어 있습니다:

```blade
<script>
    var app = {{ Js::from($array) }};
</script>
```

> [!WARNING]
> `Js::from` 메서드는 기존 변수를 JSON으로 렌더링할 때만 사용해야 합니다. 블레이드 템플릿은 정규식 기반이므로, 복잡한 표현식을 지시문에 전달하면 예기치 않은 오류가 발생할 수 있습니다.


#### `@verbatim` 지시문 {#the-at-verbatim-directive}

템플릿의 많은 부분에서 자바스크립트 변수를 표시해야 한다면, HTML을 `@verbatim` 지시문으로 감싸 각 블레이드 에코 문마다 `@` 기호를 붙이지 않아도 됩니다:

```blade
@verbatim
    <div class="container">
        Hello, {{ name }}.
    </div>
@endverbatim
```


## 블레이드 지시문 {#blade-directives}

템플릿 상속과 데이터 표시 외에도, 블레이드는 조건문과 반복문 등 일반적인 PHP 제어 구조에 대한 편리한 단축 지시문을 제공합니다. 이 단축 지시문들은 PHP의 제어 구조와 친숙하면서도 매우 간결하게 사용할 수 있습니다.


### If 문 {#if-statements}

`@if`, `@elseif`, `@else`, `@endif` 지시문을 사용해 `if` 문을 작성할 수 있습니다. 이 지시문들은 PHP의 동등한 문법과 동일하게 동작합니다:

```blade
@if (count($records) === 1)
    I have one record!
@elseif (count($records) > 1)
    I have multiple records!
@else
    I don't have any records!
@endif
```

편의를 위해, 블레이드는 `@unless` 지시문도 제공합니다:

```blade
@unless (Auth::check())
    You are not signed in.
@endunless
```

앞서 설명한 조건부 지시문 외에도, `@isset` 및 `@empty` 지시문을 각각의 PHP 함수에 대한 편리한 단축키로 사용할 수 있습니다:

```blade
@isset($records)
    // $records가 정의되어 있고 null이 아님...
@endisset

@empty($records)
    // $records가 "비어 있음"...
@endempty
```


#### 인증 지시문 {#authentication-directives}

`@auth` 및 `@guest` 지시문을 사용해 현재 사용자가 [인증](/laravel/12.x/authentication)되었는지 또는 게스트인지 빠르게 확인할 수 있습니다:

```blade
@auth
    // 사용자가 인증됨...
@endauth

@guest
    // 사용자가 인증되지 않음...
@endguest
```

필요하다면, `@auth` 및 `@guest` 지시문을 사용할 때 확인할 인증 가드를 지정할 수 있습니다:

```blade
@auth('admin')
    // 사용자가 인증됨...
@endauth

@guest('admin')
    // 사용자가 인증되지 않음...
@endguest
```


#### 환경 지시문 {#environment-directives}

`@production` 지시문을 사용해 애플리케이션이 프로덕션 환경에서 실행 중인지 확인할 수 있습니다:

```blade
@production
    // 프로덕션 전용 콘텐츠...
@endproduction
```

또는, `@env` 지시문을 사용해 애플리케이션이 특정 환경에서 실행 중인지 확인할 수 있습니다:

```blade
@env('staging')
    // 애플리케이션이 "staging" 환경에서 실행 중...
@endenv

@env(['staging', 'production'])
    // 애플리케이션이 "staging" 또는 "production" 환경에서 실행 중...
@endenv
```


#### 섹션 지시문 {#section-directives}

템플릿 상속 섹션에 콘텐츠가 있는지 `@hasSection` 지시문으로 확인할 수 있습니다:

```blade
@hasSection('navigation')
    <div class="pull-right">
        @yield('navigation')
    </div>

    <div class="clearfix"></div>
@endif
```

`sectionMissing` 지시문을 사용해 섹션에 콘텐츠가 없는지 확인할 수 있습니다:

```blade
@sectionMissing('navigation')
    <div class="pull-right">
        @include('default-navigation')
    </div>
@endif
```


#### 세션 지시문 {#session-directives}

`@session` 지시문을 사용해 [세션](/laravel/12.x/session) 값이 존재하는지 확인할 수 있습니다. 세션 값이 존재하면, `@session`과 `@endsession` 지시문 사이의 템플릿 내용이 평가됩니다. `@session` 지시문 내에서는 `$value` 변수를 에코해 세션 값을 표시할 수 있습니다:

```blade
@session('status')
    <div class="p-4 bg-green-100">
        {{ $value }}
    </div>
@endsession
```


### Switch 문 {#switch-statements}

`@switch`, `@case`, `@break`, `@default`, `@endswitch` 지시문을 사용해 switch 문을 작성할 수 있습니다:

```blade
@switch($i)
    @case(1)
        First case...
        @break

    @case(2)
        Second case...
        @break

    @default
        Default case...
@endswitch
```


### 반복문 {#loops}

조건문 외에도, 블레이드는 PHP의 반복문 구조를 다루기 위한 간단한 지시문을 제공합니다. 이 지시문들 역시 PHP의 동등한 문법과 동일하게 동작합니다:

```blade
@for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor

@foreach ($users as $user)
    <p>This is user {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>No users</p>
@endforelse

@while (true)
    <p>I'm looping forever.</p>
@endwhile
```

> [!NOTE]
> `foreach` 반복문을 순회할 때, [loop 변수](#the-loop-variable)를 사용해 반복문의 첫 번째 또는 마지막 순회인지 등 유용한 정보를 얻을 수 있습니다.

반복문을 사용할 때, `@continue` 및 `@break` 지시문을 사용해 현재 순회를 건너뛰거나 반복문을 종료할 수 있습니다:

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

지시문 선언 내에 조건을 포함할 수도 있습니다:

```blade
@foreach ($users as $user)
    @continue($user->type == 1)

    <li>{{ $user->name }}</li>

    @break($user->number == 5)
@endforeach
```


### Loop 변수 {#the-loop-variable}

`foreach` 반복문을 순회할 때, 반복문 내부에서 `$loop` 변수를 사용할 수 있습니다. 이 변수는 현재 반복 인덱스, 첫 번째/마지막 순회 여부 등 유용한 정보를 제공합니다:

```blade
@foreach ($users as $user)
    @if ($loop->first)
        This is the first iteration.
    @endif

    @if ($loop->last)
        This is the last iteration.
    @endif

    <p>This is user {{ $user->id }}</p>
@endforeach
```

중첩 반복문에 있다면, `parent` 프로퍼티를 통해 부모 반복문의 `$loop` 변수에 접근할 수 있습니다:

```blade
@foreach ($users as $user)
    @foreach ($user->posts as $post)
        @if ($loop->parent->first)
            This is the first iteration of the parent loop.
        @endif
    @endforeach
@endforeach
```

`$loop` 변수에는 다음과 같은 다양한 유용한 프로퍼티가 포함되어 있습니다:

<div class="overflow-auto">

| 프로퍼티           | 설명                                                    |
| ------------------ | ------------------------------------------------------ |
| `$loop->index`     | 현재 반복문의 인덱스(0부터 시작).                       |
| `$loop->iteration` | 현재 반복 횟수(1부터 시작).                             |
| `$loop->remaining` | 반복문에서 남은 반복 횟수.                              |
| `$loop->count`     | 반복 중인 배열의 전체 아이템 수.                        |
| `$loop->first`     | 반복문의 첫 번째 순회인지 여부.                         |
| `$loop->last`      | 반복문의 마지막 순회인지 여부.                          |
| `$loop->even`      | 반복 횟수가 짝수인지 여부.                             |
| `$loop->odd`       | 반복 횟수가 홀수인지 여부.                             |
| `$loop->depth`     | 현재 반복문의 중첩 레벨.                                |
| `$loop->parent`    | 중첩 반복문일 때, 부모 반복문의 loop 변수.              |

</div>


### 조건부 클래스 & 스타일 {#conditional-classes}

`@class` 지시문은 CSS 클래스 문자열을 조건부로 컴파일합니다. 이 지시문은 클래스 또는 클래스 배열을 키로, 불리언 표현식을 값으로 갖는 배열을 받습니다. 배열 요소의 키가 숫자라면, 항상 렌더링된 클래스 목록에 포함됩니다:

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

마찬가지로, `@style` 지시문을 사용해 HTML 요소에 인라인 CSS 스타일을 조건부로 추가할 수 있습니다:

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

편의를 위해, `@checked` 지시문을 사용해 주어진 HTML 체크박스 입력이 "checked" 상태인지 쉽게 표시할 수 있습니다. 이 지시문은 조건이 `true`로 평가되면 `checked`를 에코합니다:

```blade
<input
    type="checkbox"
    name="active"
    value="active"
    @checked(old('active', $user->active))
/>
```

마찬가지로, `@selected` 지시문을 사용해 주어진 select 옵션이 "selected" 상태인지 표시할 수 있습니다:

```blade
<select name="version">
    @foreach ($product->versions as $version)
        <option value="{{ $version }}" @selected(old('version') == $version)>
            {{ $version }}
        </option>
    @endforeach
</select>
```

또한, `@disabled` 지시문을 사용해 주어진 요소가 "disabled" 상태인지 표시할 수 있습니다:

```blade
<button type="submit" @disabled($errors->isNotEmpty())>Submit</button>
```

더불어, `@readonly` 지시문을 사용해 주어진 요소가 "readonly" 상태인지 표시할 수 있습니다:

```blade
<input
    type="email"
    name="email"
    value="email@laravel.com"
    @readonly($user->isNotAdmin())
/>
```

또한, `@required` 지시문을 사용해 주어진 요소가 "required" 상태인지 표시할 수 있습니다:

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
> `@include` 지시문을 자유롭게 사용할 수 있지만, 블레이드 [컴포넌트](#components)는 유사한 기능을 제공하며, 데이터 및 속성 바인딩 등 여러 이점을 제공합니다.

블레이드의 `@include` 지시문을 사용해 다른 뷰에서 블레이드 뷰를 포함할 수 있습니다. 부모 뷰에서 사용 가능한 모든 변수는 포함된 뷰에서도 사용할 수 있습니다:

```blade
<div>
    @include('shared.errors')

    <form>
        <!-- 폼 내용 -->
    </form>
</div>
```

포함된 뷰는 부모 뷰의 모든 데이터를 상속받지만, 추가로 포함된 뷰에서 사용할 수 있는 데이터를 배열로 전달할 수도 있습니다:

```blade
@include('view.name', ['status' => 'complete'])
```

존재하지 않는 뷰를 `@include`하려고 하면 Laravel은 에러를 발생시킵니다. 뷰가 존재할 수도, 존재하지 않을 수도 있는 경우 `@includeIf` 지시문을 사용하세요:

```blade
@includeIf('view.name', ['status' => 'complete'])
```

주어진 불리언 표현식이 `true` 또는 `false`로 평가될 때만 뷰를 `@include`하고 싶다면, `@includeWhen` 및 `@includeUnless` 지시문을 사용할 수 있습니다:

```blade
@includeWhen($boolean, 'view.name', ['status' => 'complete'])

@includeUnless($boolean, 'view.name', ['status' => 'complete'])
```

주어진 뷰 배열 중 첫 번째로 존재하는 뷰를 포함하려면, `includeFirst` 지시문을 사용할 수 있습니다:

```blade
@includeFirst(['custom.admin', 'admin'], ['status' => 'complete'])
```

> [!WARNING]
> 블레이드 뷰에서 `__DIR__` 및 `__FILE__` 상수 사용은 피해야 합니다. 이들은 캐시된 컴파일 뷰의 위치를 참조하게 됩니다.


#### 컬렉션을 위한 뷰 렌더링 {#rendering-views-for-collections}

반복문과 include를 한 줄로 결합하려면, 블레이드의 `@each` 지시문을 사용할 수 있습니다:

```blade
@each('view.name', $jobs, 'job')
```

`@each` 지시문의 첫 번째 인자는 배열 또는 컬렉션의 각 요소에 대해 렌더링할 뷰입니다. 두 번째 인자는 반복할 배열 또는 컬렉션, 세 번째 인자는 뷰 내에서 현재 순회에 할당될 변수명입니다. 예를 들어, `jobs` 배열을 반복한다면, 각 job을 뷰 내에서 `job` 변수로 접근할 수 있습니다. 현재 순회의 배열 키는 뷰 내에서 `key` 변수로 사용할 수 있습니다.

네 번째 인자를 `@each` 지시문에 전달할 수도 있습니다. 이 인자는 주어진 배열이 비어 있을 때 렌더링할 뷰를 결정합니다.

```blade
@each('view.name', $jobs, 'job', 'view.empty')
```

> [!WARNING]
> `@each`로 렌더링된 뷰는 부모 뷰의 변수를 상속받지 않습니다. 자식 뷰에서 이러한 변수가 필요하다면, `@foreach`와 `@include` 지시문을 대신 사용하세요.


### `@once` 지시문 {#the-once-directive}

`@once` 지시문을 사용하면, 템플릿의 일부를 렌더링 사이클당 한 번만 평가하도록 정의할 수 있습니다. 이는 [스택](#stacks)을 사용해 특정 자바스크립트 코드를 페이지 헤더에 한 번만 푸시할 때 유용합니다. 예를 들어, [컴포넌트](#components)를 반복문 내에서 렌더링할 때, 자바스크립트를 처음 한 번만 헤더에 푸시하고 싶을 수 있습니다:

```blade
@once
    @push('scripts')
        <script>
            // 커스텀 자바스크립트...
        </script>
    @endpush
@endonce
```

`@once` 지시문은 종종 `@push` 또는 `@prepend` 지시문과 함께 사용되므로, 편의를 위해 `@pushOnce` 및 `@prependOnce` 지시문도 사용할 수 있습니다:

```blade
@pushOnce('scripts')
    <script>
        // 커스텀 자바스크립트...
    </script>
@endPushOnce
```


### Raw PHP {#raw-php}

상황에 따라 뷰에 PHP 코드를 삽입하는 것이 유용할 수 있습니다. 블레이드의 `@php` 지시문을 사용해 템플릿 내에서 순수 PHP 블록을 실행할 수 있습니다:

```blade
@php
    $counter = 1;
@endphp
```

또는, PHP 클래스를 임포트하는 데만 PHP가 필요하다면, `@use` 지시문을 사용할 수 있습니다:

```blade
@use('App\Models\Flight')
```

`@use` 지시문에 두 번째 인자를 제공해 임포트한 클래스에 별칭을 지정할 수 있습니다:

```blade
@use('App\Models\Flight', 'FlightModel')
```

같은 네임스페이스 내에 여러 클래스가 있다면, 해당 클래스들의 임포트를 그룹화할 수 있습니다:

```blade
@use('App\Models\{Flight, Airport}')
```

`@use` 지시문은 `function` 또는 `const` 수식어를 임포트 경로 앞에 붙여 PHP 함수와 상수 임포트도 지원합니다:

```blade
@use(function App\Helpers\format_currency)
@use(const App\Constants\MAX_ATTEMPTS)
```

클래스 임포트와 마찬가지로, 함수와 상수에도 별칭을 지정할 수 있습니다:

```blade
@use(function App\Helpers\format_currency, 'formatMoney')
@use(const App\Constants\MAX_ATTEMPTS, 'MAX_TRIES')
```

함수와 const 수식어 모두 그룹 임포트도 지원하므로, 한 번의 지시문으로 같은 네임스페이스에서 여러 심볼을 임포트할 수 있습니다:

```blade
@use(function App\Helpers\{format_currency, format_date})
@use(const App\Constants\{MAX_ATTEMPTS, DEFAULT_TIMEOUT})
```


### 주석 {#comments}

블레이드는 뷰에 주석을 정의할 수 있습니다. 하지만 HTML 주석과 달리, 블레이드 주석은 애플리케이션이 반환하는 HTML에 포함되지 않습니다:

```blade
{{-- 이 주석은 렌더링된 HTML에 포함되지 않습니다 --}}
```


## 컴포넌트 {#components}

컴포넌트와 슬롯은 섹션, 레이아웃, include와 유사한 이점을 제공하지만, 컴포넌트와 슬롯의 개념이 더 이해하기 쉬울 수 있습니다. 컴포넌트를 작성하는 방법에는 클래스 기반 컴포넌트와 익명 컴포넌트 두 가지가 있습니다.

클래스 기반 컴포넌트를 만들려면, `make:component` Artisan 명령어를 사용할 수 있습니다. 컴포넌트 사용법을 설명하기 위해, 간단한 `Alert` 컴포넌트를 만들어보겠습니다. `make:component` 명령어는 컴포넌트를 `app/View/Components` 디렉터리에 생성합니다:

```shell
php artisan make:component Alert
```

`make:component` 명령어는 컴포넌트의 뷰 템플릿도 생성합니다. 뷰는 `resources/views/components` 디렉터리에 위치합니다. 애플리케이션에서 컴포넌트를 작성할 때는, `app/View/Components` 및 `resources/views/components` 디렉터리 내의 컴포넌트가 자동으로 인식되므로 별도의 등록이 필요하지 않습니다.

서브디렉터리 내에 컴포넌트를 생성할 수도 있습니다:

```shell
php artisan make:component Forms/Input
```

위 명령어는 `app/View/Components/Forms` 디렉터리에 `Input` 컴포넌트를 생성하고, 뷰는 `resources/views/components/forms` 디렉터리에 위치합니다.

익명 컴포넌트(클래스 없이 블레이드 템플릿만 있는 컴포넌트)를 만들고 싶다면, `make:component` 명령어에 `--view` 플래그를 사용할 수 있습니다:

```shell
php artisan make:component forms.input --view
```

위 명령어는 `resources/views/components/forms/input.blade.php`에 블레이드 파일을 생성하며, `<x-forms.input />`로 컴포넌트처럼 렌더링할 수 있습니다.


#### 패키지 컴포넌트 수동 등록 {#manually-registering-package-components}

애플리케이션에서 컴포넌트를 작성할 때는, `app/View/Components` 및 `resources/views/components` 디렉터리 내의 컴포넌트가 자동으로 인식됩니다.

하지만, 블레이드 컴포넌트를 사용하는 패키지를 작성하는 경우, 컴포넌트 클래스와 HTML 태그 별칭을 수동으로 등록해야 합니다. 일반적으로 패키지의 서비스 프로바이더의 `boot` 메서드에서 컴포넌트를 등록해야 합니다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::component('package-alert', Alert::class);
}
```

컴포넌트가 등록되면, 태그 별칭을 사용해 렌더링할 수 있습니다:

```blade
<x-package-alert/>
```

또는, `componentNamespace` 메서드를 사용해 컴포넌트 클래스를 관례적으로 오토로드할 수 있습니다. 예를 들어, `Nightshade` 패키지에 `Package\Views\Components` 네임스페이스 내에 `Calendar`와 `ColorPicker` 컴포넌트가 있다고 가정해봅시다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
}
```

이렇게 하면, `package-name::` 문법을 사용해 벤더 네임스페이스로 패키지 컴포넌트를 사용할 수 있습니다:

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

블레이드는 컴포넌트 이름을 파스칼 케이스로 변환해 해당 컴포넌트와 연결된 클래스를 자동으로 감지합니다. 서브디렉터리도 "dot" 표기법으로 지원됩니다.


### 컴포넌트 렌더링 {#rendering-components}

컴포넌트를 표시하려면, 블레이드 템플릿 내에서 블레이드 컴포넌트 태그를 사용할 수 있습니다. 블레이드 컴포넌트 태그는 `x-`로 시작하고, 컴포넌트 클래스 이름을 케밥 케이스로 변환해 사용합니다:

```blade
<x-alert/>

<x-user-profile/>
```

컴포넌트 클래스가 `app/View/Components` 디렉터리 내에 더 깊이 중첩되어 있다면, `.` 문자를 사용해 디렉터리 중첩을 나타낼 수 있습니다. 예를 들어, `app/View/Components/Inputs/Button.php`에 컴포넌트가 있다면 다음과 같이 렌더링할 수 있습니다:

```blade
<x-inputs.button/>
```

컴포넌트를 조건부로 렌더링하고 싶다면, 컴포넌트 클래스에 `shouldRender` 메서드를 정의할 수 있습니다. `shouldRender` 메서드가 `false`를 반환하면 컴포넌트는 렌더링되지 않습니다:

```php
use Illuminate\Support\Str;

/**
 * 컴포넌트 렌더링 여부
 */
public function shouldRender(): bool
{
    return Str::length($this->message) > 0;
}
```


### 인덱스 컴포넌트 {#index-components}

때때로 컴포넌트가 컴포넌트 그룹의 일부일 수 있으며, 관련 컴포넌트를 하나의 디렉터리로 그룹화하고 싶을 수 있습니다. 예를 들어, 다음과 같은 클래스 구조를 가진 "card" 컴포넌트를 상상해봅시다:

```text
App\Views\Components\Card\Card
App\Views\Components\Card\Header
App\Views\Components\Card\Body
```

루트 `Card` 컴포넌트가 `Card` 디렉터리 내에 중첩되어 있으므로, `<x-card.card>`로 렌더링해야 할 것 같지만, 컴포넌트 파일 이름이 디렉터리 이름과 일치하면, Laravel은 해당 컴포넌트를 "루트" 컴포넌트로 간주해 디렉터리 이름을 반복하지 않고 렌더링할 수 있게 해줍니다:

```blade
<x-card>
    <x-card.header>...</x-card.header>
    <x-card.body>...</x-card.body>
</x-card>
```


### 컴포넌트에 데이터 전달 {#passing-data-to-components}

HTML 속성을 사용해 블레이드 컴포넌트에 데이터를 전달할 수 있습니다. 하드코딩된 원시 값은 단순 HTML 속성 문자열로 컴포넌트에 전달할 수 있습니다. PHP 표현식과 변수는 `:` 문자를 접두사로 사용하는 속성을 통해 컴포넌트에 전달해야 합니다:

```blade
<x-alert type="error" :message="$message"/>
```

컴포넌트의 모든 데이터 속성은 클래스 생성자에서 정의해야 합니다. 컴포넌트의 모든 public 프로퍼티는 자동으로 컴포넌트 뷰에서 사용할 수 있습니다. 데이터를 컴포넌트의 `render` 메서드에서 뷰로 전달할 필요는 없습니다:

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Alert extends Component
{
    /**
     * 컴포넌트 인스턴스 생성.
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

컴포넌트가 렌더링되면, 컴포넌트의 public 변수 내용을 변수명으로 에코해 표시할 수 있습니다:

```blade
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```


#### 케이싱 {#casing}

컴포넌트 생성자 인자는 `camelCase`로 지정해야 하며, HTML 속성에서 인자명을 참조할 때는 `kebab-case`를 사용해야 합니다. 예를 들어, 다음과 같은 컴포넌트 생성자가 있다고 가정해봅시다:

```php
/**
 * 컴포넌트 인스턴스 생성.
 */
public function __construct(
    public string $alertType,
) {}
```

`$alertType` 인자는 다음과 같이 컴포넌트에 전달할 수 있습니다:

```blade
<x-alert alert-type="danger" />
```


#### 짧은 속성 문법 {#short-attribute-syntax}

컴포넌트에 속성을 전달할 때, "짧은 속성" 문법도 사용할 수 있습니다. 이는 속성명이 해당 변수명과 자주 일치하므로 편리합니다:

```blade
{{-- 짧은 속성 문법... --}}
<x-profile :$userId :$name />

{{-- 아래와 동일합니다... --}}
<x-profile :user-id="$userId" :name="$name" />
```


#### 속성 렌더링 이스케이프 {#escaping-attribute-rendering}

Alpine.js와 같은 일부 자바스크립트 프레임워크도 콜론 접두사 속성을 사용하므로, 속성이 PHP 표현식이 아님을 블레이드에 알리려면 더블 콜론(`::`) 접두사를 사용할 수 있습니다. 예를 들어, 다음과 같은 컴포넌트가 있다고 가정해봅시다:

```blade
<x-button ::class="{ danger: isDeleting }">
    Submit
</x-button>
```

블레이드가 렌더링하는 HTML은 다음과 같습니다:

```blade
<button :class="{ danger: isDeleting }">
    Submit
</button>
```


#### 컴포넌트 메서드 {#component-methods}

컴포넌트 템플릿에서 public 변수뿐만 아니라, 컴포넌트의 public 메서드도 호출할 수 있습니다. 예를 들어, `isSelected` 메서드가 있는 컴포넌트를 상상해봅시다:

```php
/**
 * 주어진 옵션이 현재 선택된 옵션인지 확인.
 */
public function isSelected(string $option): bool
{
    return $option === $this->selected;
}
```

컴포넌트 템플릿에서 메서드명과 동일한 변수로 이 메서드를 호출할 수 있습니다:

```blade
<option {{ $isSelected($value) ? 'selected' : '' }} value="{{ $value }}">
    {{ $label }}
</option>
```


#### 컴포넌트 클래스 내에서 속성 및 슬롯 접근 {#using-attributes-slots-within-component-class}

블레이드 컴포넌트는 컴포넌트 이름, 속성, 슬롯에 클래스의 render 메서드 내에서 접근할 수 있습니다. 이 데이터를 접근하려면, 컴포넌트의 `render` 메서드에서 클로저를 반환해야 합니다:

```php
use Closure;

/**
 * 컴포넌트를 나타내는 뷰/콘텐츠 반환.
 */
public function render(): Closure
{
    return function () {
        return '<div {{ $attributes }}>Components content</div>';
    };
}
```

컴포넌트의 `render` 메서드가 반환하는 클로저는 `$data` 배열을 유일한 인자로 받을 수도 있습니다. 이 배열에는 컴포넌트에 대한 여러 정보가 포함됩니다:

```php
return function (array $data) {
    // $data['componentName'];
    // $data['attributes'];
    // $data['slot'];

    return '<div {{ $attributes }}>Components content</div>';
}
```

> [!WARNING]
> `$data` 배열의 요소를 블레이드 문자열에 직접 삽입해서는 안 됩니다. 그렇게 하면 악의적인 속성 콘텐츠를 통한 원격 코드 실행이 발생할 수 있습니다.

`componentName`은 `x-` 접두사 이후 HTML 태그에 사용된 이름과 동일합니다. 즉, `<x-alert />`의 `componentName`은 `alert`입니다. `attributes` 요소에는 HTML 태그에 있던 모든 속성이 포함됩니다. `slot` 요소는 컴포넌트 슬롯의 내용을 가진 `Illuminate\Support\HtmlString` 인스턴스입니다.

클로저는 문자열을 반환해야 합니다. 반환된 문자열이 기존 뷰와 일치하면 해당 뷰가 렌더링되고, 그렇지 않으면 인라인 블레이드 뷰로 평가됩니다.


#### 추가 의존성 {#additional-dependencies}

컴포넌트가 Laravel의 [서비스 컨테이너](/laravel/12.x/container)에서 의존성을 필요로 한다면, 컴포넌트의 데이터 속성 앞에 나열하면 컨테이너가 자동으로 주입해줍니다:

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


#### 속성/메서드 숨기기 {#hiding-attributes-and-methods}

일부 public 메서드나 프로퍼티를 컴포넌트 템플릿에서 변수로 노출하지 않으려면, 컴포넌트의 `$except` 배열 프로퍼티에 추가할 수 있습니다:

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    /**
     * 컴포넌트 템플릿에 노출하지 않을 프로퍼티/메서드.
     *
     * @var array
     */
    protected $except = ['type'];

    /**
     * 컴포넌트 인스턴스 생성.
     */
    public function __construct(
        public string $type,
    ) {}
}
```


### 컴포넌트 속성 {#component-attributes}

이미 컴포넌트에 데이터 속성을 전달하는 방법을 살펴보았지만, 때로는 `class`와 같이 컴포넌트의 동작에 필요하지 않은 추가 HTML 속성을 지정해야 할 수도 있습니다. 일반적으로 이러한 추가 속성은 컴포넌트 템플릿의 루트 요소에 전달하고 싶을 것입니다. 예를 들어, 다음과 같이 `alert` 컴포넌트를 렌더링한다고 가정해봅시다:

```blade
<x-alert type="error" :message="$message" class="mt-4"/>
```

컴포넌트 생성자에 포함되지 않은 모든 속성은 자동으로 컴포넌트의 "속성 백"에 추가됩니다. 이 속성 백은 `$attributes` 변수로 컴포넌트에서 자동으로 사용할 수 있습니다. 모든 속성은 이 변수를 에코해 컴포넌트 내에서 렌더링할 수 있습니다:

```blade
<div {{ $attributes }}>
    <!-- 컴포넌트 내용 -->
</div>
```

> [!WARNING]
> 현재로서는 컴포넌트 태그 내에서 `@env`와 같은 지시문 사용이 지원되지 않습니다. 예를 들어, `<x-alert :live="@env('production')"/>`는 컴파일되지 않습니다.


#### 기본/병합 속성 {#default-merged-attributes}

때로는 속성의 기본값을 지정하거나, 일부 속성에 추가 값을 병합해야 할 수 있습니다. 이를 위해 속성 백의 `merge` 메서드를 사용할 수 있습니다. 이 메서드는 컴포넌트에 항상 적용되어야 하는 기본 CSS 클래스를 정의할 때 특히 유용합니다:

```blade
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

이 컴포넌트를 다음과 같이 사용한다고 가정해봅시다:

```blade
<x-alert type="error" :message="$message" class="mb-4"/>
```

컴포넌트의 최종 렌더링 HTML은 다음과 같습니다:

```blade
<div class="alert alert-error mb-4">
    <!-- $message 변수의 내용 -->
</div>
```


#### 조건부 클래스 병합 {#conditionally-merge-classes}

특정 조건이 `true`일 때만 클래스를 병합하고 싶을 때가 있습니다. `class` 메서드를 사용해 이를 구현할 수 있습니다. 이 메서드는 클래스 또는 클래스 배열을 키로, 불리언 표현식을 값으로 갖는 배열을 받습니다. 배열 요소의 키가 숫자라면, 항상 렌더링된 클래스 목록에 포함됩니다:

```blade
<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
    {{ $message }}
</div>
```

컴포넌트에 다른 속성을 병합해야 한다면, `class` 메서드에 `merge` 메서드를 체이닝할 수 있습니다:

```blade
<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

> [!NOTE]
> 병합된 속성을 받지 않는 다른 HTML 요소에 조건부 클래스를 컴파일해야 한다면, [@class 지시문](#conditional-classes)을 사용할 수 있습니다.


#### 클래스가 아닌 속성 병합 {#non-class-attribute-merging}

`class` 속성이 아닌 속성을 병합할 때, `merge` 메서드에 제공된 값은 해당 속성의 "기본값"으로 간주됩니다. 하지만 `class` 속성과 달리, 이러한 속성은 주입된 속성 값과 병합되지 않고, 덮어써집니다. 예를 들어, `button` 컴포넌트의 구현이 다음과 같다고 가정해봅시다:

```blade
<button {{ $attributes->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

커스텀 `type`으로 버튼 컴포넌트를 렌더링하려면, 컴포넌트를 사용할 때 지정할 수 있습니다. 지정하지 않으면 `button` 타입이 사용됩니다:

```blade
<x-button type="submit">
    Submit
</x-button>
```

이 예시에서 `button` 컴포넌트의 렌더링 HTML은 다음과 같습니다:

```blade
<button type="submit">
    Submit
</button>
```

`class` 외의 속성도 기본값과 주입된 값을 함께 연결하고 싶다면, `prepends` 메서드를 사용할 수 있습니다. 이 예시에서 `data-controller` 속성은 항상 `profile-controller`로 시작하며, 추가로 주입된 `data-controller` 값이 뒤에 붙습니다:

```blade
<div {{ $attributes->merge(['data-controller' => $attributes->prepends('profile-controller')]) }}>
    {{ $slot }}
</div>
```


#### 속성 조회 및 필터링 {#filtering-attributes}

`filter` 메서드를 사용해 속성을 필터링할 수 있습니다. 이 메서드는 클로저를 받아, 속성 백에 남기고 싶은 경우 `true`를 반환해야 합니다:

```blade
{{ $attributes->filter(fn (string $value, string $key) => $key == 'foo') }}
```

편의를 위해, `whereStartsWith` 메서드를 사용해 주어진 문자열로 시작하는 키를 가진 모든 속성을 조회할 수 있습니다:

```blade
{{ $attributes->whereStartsWith('wire:model') }}
```

반대로, `whereDoesntStartWith` 메서드를 사용해 주어진 문자열로 시작하는 키를 가진 모든 속성을 제외할 수 있습니다:

```blade
{{ $attributes->whereDoesntStartWith('wire:model') }}
```

`first` 메서드를 사용해 주어진 속성 백에서 첫 번째 속성을 렌더링할 수 있습니다:

```blade
{{ $attributes->whereStartsWith('wire:model')->first() }}
```

컴포넌트에 특정 속성이 있는지 확인하려면, `has` 메서드를 사용할 수 있습니다. 이 메서드는 속성명을 유일한 인자로 받아, 해당 속성이 존재하는지 여부를 불리언으로 반환합니다:

```blade
@if ($attributes->has('class'))
    <div>Class 속성이 존재합니다</div>
@endif
```

배열을 `has` 메서드에 전달하면, 주어진 모든 속성이 컴포넌트에 존재하는지 확인합니다:

```blade
@if ($attributes->has(['name', 'class']))
    <div>모든 속성이 존재합니다</div>
@endif
```

`hasAny` 메서드는 주어진 속성 중 하나라도 존재하는지 확인할 수 있습니다:

```blade
@if ($attributes->hasAny(['href', ':href', 'v-bind:href']))
    <div>속성 중 하나가 존재합니다</div>
@endif
```

`get` 메서드를 사용해 특정 속성의 값을 조회할 수 있습니다:

```blade
{{ $attributes->get('class') }}
```

`only` 메서드는 주어진 키를 가진 속성만 조회할 수 있습니다:

```blade
{{ $attributes->only(['class']) }}
```

`except` 메서드는 주어진 키를 가진 속성을 제외한 모든 속성을 조회할 수 있습니다:

```blade
{{ $attributes->except(['class']) }}
```


### 예약어 {#reserved-keywords}

기본적으로 일부 키워드는 블레이드 내부적으로 컴포넌트 렌더링에 사용되므로, 컴포넌트 내 public 프로퍼티나 메서드명으로 정의할 수 없습니다:

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

컴포넌트에 "슬롯"을 통해 추가 콘텐츠를 전달해야 할 때가 많습니다. 컴포넌트 슬롯은 `$slot` 변수를 에코해 렌더링합니다. 이 개념을 살펴보기 위해, `alert` 컴포넌트에 다음과 같은 마크업이 있다고 가정해봅시다:

```blade
<!-- /resources/views/components/alert.blade.php -->

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

컴포넌트에 콘텐츠를 주입해 슬롯에 전달할 수 있습니다:

```blade
<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

때로는 컴포넌트가 여러 위치에 서로 다른 슬롯을 렌더링해야 할 수 있습니다. alert 컴포넌트를 수정해 "title" 슬롯을 주입할 수 있도록 해봅시다:

```blade
<!-- /resources/views/components/alert.blade.php -->

<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

`x-slot` 태그를 사용해 명명된 슬롯의 콘텐츠를 정의할 수 있습니다. 명시적 `x-slot` 태그 내에 있지 않은 모든 콘텐츠는 `$slot` 변수로 컴포넌트에 전달됩니다:

```xml
<x-alert>
    <x-slot:title>
        Server Error
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

슬롯에 콘텐츠가 있는지 확인하려면, 슬롯의 `isEmpty` 메서드를 호출할 수 있습니다:

```blade
<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    @if ($slot->isEmpty())
        This is default content if the slot is empty.
    @else
        {{ $slot }}
    @endif
</div>
```

또한, `hasActualContent` 메서드를 사용해 슬롯에 HTML 주석이 아닌 "실제" 콘텐츠가 있는지 확인할 수 있습니다:

```blade
@if ($slot->hasActualContent())
    The scope has non-comment content.
@endif
```


#### 스코프 슬롯 {#scoped-slots}

Vue와 같은 자바스크립트 프레임워크를 사용해본 적이 있다면, "스코프 슬롯"에 익숙할 수 있습니다. 스코프 슬롯을 사용하면 슬롯 내에서 컴포넌트의 데이터나 메서드에 접근할 수 있습니다. Laravel에서는 컴포넌트에 public 메서드나 프로퍼티를 정의하고, 슬롯 내에서 `$component` 변수로 컴포넌트에 접근해 유사한 동작을 구현할 수 있습니다. 이 예시에서는 `x-alert` 컴포넌트 클래스에 public `formatAlert` 메서드가 있다고 가정합니다:

```blade
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```


#### 슬롯 속성 {#slot-attributes}

블레이드 컴포넌트와 마찬가지로, 슬롯에도 CSS 클래스명 등 [속성](#component-attributes)을 추가할 수 있습니다:

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

슬롯 속성과 상호작용하려면, 슬롯 변수의 `attributes` 프로퍼티에 접근할 수 있습니다. 속성과 상호작용하는 방법에 대한 자세한 내용은 [컴포넌트 속성](#component-attributes) 문서를 참고하세요:

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

아주 작은 컴포넌트의 경우, 컴포넌트 클래스와 뷰 템플릿을 모두 관리하는 것이 번거로울 수 있습니다. 이런 경우, `render` 메서드에서 컴포넌트의 마크업을 직접 반환할 수 있습니다:

```php
/**
 * 컴포넌트를 나타내는 뷰/콘텐츠 반환.
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


#### 인라인 뷰 컴포넌트 생성 {#generating-inline-view-components}

인라인 뷰를 렌더링하는 컴포넌트를 만들려면, `make:component` 명령어 실행 시 `inline` 옵션을 사용할 수 있습니다:

```shell
php artisan make:component Alert --inline
```


### 동적 컴포넌트 {#dynamic-components}

때로는 어떤 컴포넌트를 렌더링할지 런타임까지 알 수 없는 경우가 있습니다. 이럴 때는 Laravel의 내장 `dynamic-component` 컴포넌트를 사용해 런타임 값이나 변수에 따라 컴포넌트를 렌더링할 수 있습니다:

```blade
// $componentName = "secondary-button";

<x-dynamic-component :component="$componentName" class="mt-4" />
```


### 컴포넌트 수동 등록 {#manually-registering-components}

> [!WARNING]
> 컴포넌트 수동 등록에 관한 다음 문서는 주로 뷰 컴포넌트를 포함하는 Laravel 패키지를 작성하는 경우에 해당합니다. 패키지를 작성하지 않는다면, 이 부분은 해당되지 않을 수 있습니다.

애플리케이션에서 컴포넌트를 작성할 때는, `app/View/Components` 및 `resources/views/components` 디렉터리 내의 컴포넌트가 자동으로 인식됩니다.

하지만, 블레이드 컴포넌트를 사용하는 패키지를 작성하거나, 비표준 디렉터리에 컴포넌트를 배치하는 경우, 컴포넌트 클래스와 HTML 태그 별칭을 수동으로 등록해 Laravel이 컴포넌트 위치를 알 수 있도록 해야 합니다. 일반적으로 패키지의 서비스 프로바이더의 `boot` 메서드에서 컴포넌트를 등록해야 합니다:

```php
use Illuminate\Support\Facades\Blade;
use VendorPackage\View\Components\AlertComponent;

/**
 * 패키지 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::component('package-alert', AlertComponent::class);
}
```

컴포넌트가 등록되면, 태그 별칭을 사용해 렌더링할 수 있습니다:

```blade
<x-package-alert/>
```

#### 패키지 컴포넌트 오토로딩

또는, `componentNamespace` 메서드를 사용해 컴포넌트 클래스를 관례적으로 오토로드할 수 있습니다. 예를 들어, `Nightshade` 패키지에 `Package\Views\Components` 네임스페이스 내에 `Calendar`와 `ColorPicker` 컴포넌트가 있다고 가정해봅시다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 패키지 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
}
```

이렇게 하면, `package-name::` 문법을 사용해 벤더 네임스페이스로 패키지 컴포넌트를 사용할 수 있습니다:

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

블레이드는 컴포넌트 이름을 파스칼 케이스로 변환해 해당 컴포넌트와 연결된 클래스를 자동으로 감지합니다. 서브디렉터리도 "dot" 표기법으로 지원됩니다.


## 익명 컴포넌트 {#anonymous-components}

인라인 컴포넌트와 유사하게, 익명 컴포넌트는 단일 파일로 컴포넌트를 관리할 수 있는 메커니즘을 제공합니다. 하지만 익명 컴포넌트는 단일 뷰 파일만 사용하며, 관련 클래스가 없습니다. 익명 컴포넌트를 정의하려면, `resources/views/components` 디렉터리에 블레이드 템플릿을 배치하기만 하면 됩니다. 예를 들어, `resources/views/components/alert.blade.php`에 컴포넌트를 정의했다면, 다음과 같이 간단히 렌더링할 수 있습니다:

```blade
<x-alert/>
```

컴포넌트가 `components` 디렉터리 내에 더 깊이 중첩되어 있다면, `.` 문자를 사용해 렌더링할 수 있습니다. 예를 들어, `resources/views/components/inputs/button.blade.php`에 컴포넌트가 있다면 다음과 같이 렌더링할 수 있습니다:

```blade
<x-inputs.button/>
```


### 익명 인덱스 컴포넌트 {#anonymous-index-components}

컴포넌트가 여러 블레이드 템플릿으로 구성된 경우, 해당 컴포넌트의 템플릿을 하나의 디렉터리로 그룹화하고 싶을 수 있습니다. 예를 들어, 다음과 같은 디렉터리 구조를 가진 "accordion" 컴포넌트를 상상해봅시다:

```text
/resources/views/components/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```

이 디렉터리 구조를 사용하면, 아코디언 컴포넌트와 아이템을 다음과 같이 렌더링할 수 있습니다:

```blade
<x-accordion>
    <x-accordion.item>
        ...
    </x-accordion.item>
</x-accordion>
```

하지만, `x-accordion`으로 아코디언 컴포넌트를 렌더링하려면, "index" 아코디언 컴포넌트 템플릿을 `resources/views/components` 디렉터리에 배치해야 했습니다.

다행히도, 블레이드는 컴포넌트 디렉터리 내에 디렉터리명과 일치하는 파일이 있으면, 해당 템플릿을 컴포넌트의 "루트" 요소로 렌더링할 수 있습니다. 따라서 위와 동일한 블레이드 문법을 계속 사용할 수 있으며, 디렉터리 구조를 다음과 같이 조정할 수 있습니다:

```text
/resources/views/components/accordion/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```


### 데이터 프로퍼티 / 속성 {#data-properties-attributes}

익명 컴포넌트에는 관련 클래스가 없으므로, 어떤 데이터가 변수로 전달되어야 하고, 어떤 속성이 [속성 백](#component-attributes)에 포함되어야 하는지 구분하는 방법이 궁금할 수 있습니다.

컴포넌트 블레이드 템플릿 상단에 `@props` 지시문을 사용해 데이터 변수로 간주할 속성을 지정할 수 있습니다. 컴포넌트의 다른 모든 속성은 속성 백을 통해 사용할 수 있습니다. 데이터 변수에 기본값을 주고 싶다면, 변수명을 배열 키로, 기본값을 배열 값으로 지정할 수 있습니다:

```blade
<!-- /resources/views/components/alert.blade.php -->

@props(['type' => 'info', 'message'])

<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

위 컴포넌트 정의를 기준으로, 다음과 같이 컴포넌트를 렌더링할 수 있습니다:

```blade
<x-alert type="error" :message="$message" class="mb-4"/>
```


### 부모 데이터 접근 {#accessing-parent-data}

때로는 자식 컴포넌트에서 부모 컴포넌트의 데이터에 접근하고 싶을 수 있습니다. 이럴 때는 `@aware` 지시문을 사용할 수 있습니다. 예를 들어, `<x-menu>`와 자식 `<x-menu.item>`으로 구성된 복잡한 메뉴 컴포넌트를 만든다고 가정해봅시다:

```blade
<x-menu color="purple">
    <x-menu.item>...</x-menu.item>
    <x-menu.item>...</x-menu.item>
</x-menu>
```

`<x-menu>` 컴포넌트는 다음과 같이 구현할 수 있습니다:

```blade
<!-- /resources/views/components/menu/index.blade.php -->

@props(['color' => 'gray'])

<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>
    {{ $slot }}
</ul>
```

`color` prop이 부모(`<x-menu>`)에만 전달되었으므로, `<x-menu.item>` 내부에서는 사용할 수 없습니다. 하지만, `@aware` 지시문을 사용하면 `<x-menu.item>` 내부에서도 사용할 수 있습니다:

```blade
<!-- /resources/views/components/menu/item.blade.php -->

@aware(['color' => 'gray'])

<li {{ $attributes->merge(['class' => 'text-'.$color.'-800']) }}>
    {{ $slot }}
</li>
```

> [!WARNING]
> `@aware` 지시문은 부모 컴포넌트에 HTML 속성으로 명시적으로 전달된 데이터만 접근할 수 있습니다. 부모 컴포넌트에 명시적으로 전달되지 않은 기본 `@props` 값은 `@aware` 지시문으로 접근할 수 없습니다.


### 익명 컴포넌트 경로 {#anonymous-component-paths}

앞서 설명한 것처럼, 익명 컴포넌트는 일반적으로 `resources/views/components` 디렉터리에 블레이드 템플릿을 배치해 정의합니다. 하지만, 기본 경로 외에 다른 익명 컴포넌트 경로를 Laravel에 등록하고 싶을 때가 있습니다.

`anonymousComponentPath` 메서드는 익명 컴포넌트 위치의 "경로"를 첫 번째 인자로, 컴포넌트가 배치될 "네임스페이스"를 선택적으로 두 번째 인자로 받습니다. 일반적으로 이 메서드는 애플리케이션의 [서비스 프로바이더](/laravel/12.x/providers) 중 하나의 `boot` 메서드에서 호출해야 합니다:

```php
/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::anonymousComponentPath(__DIR__.'/../components');
}
```

위 예시처럼 접두사 없이 컴포넌트 경로를 등록하면, 블레이드 컴포넌트에서 접두사 없이 렌더링할 수 있습니다. 예를 들어, 위에서 등록한 경로에 `panel.blade.php` 컴포넌트가 있다면, 다음과 같이 렌더링할 수 있습니다:

```blade
<x-panel />
```

접두사 "네임스페이스"는 `anonymousComponentPath` 메서드의 두 번째 인자로 제공할 수 있습니다:

```php
Blade::anonymousComponentPath(__DIR__.'/../components', 'dashboard');
```

접두사가 제공되면, 해당 "네임스페이스" 내의 컴포넌트는 렌더링 시 컴포넌트 이름 앞에 네임스페이스를 붙여 사용할 수 있습니다:

```blade
<x-dashboard::panel />
```


## 레이아웃 구축 {#building-layouts}


### 컴포넌트를 이용한 레이아웃 {#layouts-using-components}

대부분의 웹 애플리케이션은 여러 페이지에 걸쳐 동일한 일반 레이아웃을 유지합니다. 모든 뷰를 만들 때마다 전체 레이아웃 HTML을 반복해야 한다면, 애플리케이션을 유지보수하기 매우 번거로울 것입니다. 다행히도, 이 레이아웃을 하나의 [블레이드 컴포넌트](#components)로 정의한 뒤, 애플리케이션 전체에서 사용할 수 있습니다.


#### 레이아웃 컴포넌트 정의 {#defining-the-layout-component}

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


#### 레이아웃 컴포넌트 적용 {#applying-the-layout-component}

`layout` 컴포넌트를 정의한 후, 해당 컴포넌트를 사용하는 블레이드 뷰를 만들 수 있습니다. 이 예시에서는 작업 목록을 표시하는 간단한 뷰를 정의합니다:

```blade
<!-- resources/views/tasks.blade.php -->

<x-layout>
    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

컴포넌트에 주입된 콘텐츠는 `layout` 컴포넌트 내의 기본 `$slot` 변수로 전달됩니다. 또한, `layout`은 `$title` 슬롯이 제공되면 이를 사용하고, 그렇지 않으면 기본 제목을 표시합니다. 작업 목록 뷰에서 표준 슬롯 문법을 사용해 커스텀 제목을 주입할 수 있습니다([컴포넌트 문서](#components) 참고):

```blade
<!-- resources/views/tasks.blade.php -->

<x-layout>
    <x-slot:title>
        Custom Title
    </x-slot>

    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

이제 레이아웃과 작업 목록 뷰를 정의했으니, 라우트에서 `task` 뷰를 반환하면 됩니다:

```php
use App\Models\Task;

Route::get('/tasks', function () {
    return view('tasks', ['tasks' => Task::all()]);
});
```


### 템플릿 상속을 이용한 레이아웃 {#layouts-using-template-inheritance}


#### 레이아웃 정의 {#defining-a-layout}

레이아웃은 "템플릿 상속"을 통해서도 만들 수 있습니다. 이는 [컴포넌트](#components)가 도입되기 전 애플리케이션을 구축하는 주요 방법이었습니다.

간단한 예시를 살펴보겠습니다. 먼저, 페이지 레이아웃을 살펴봅시다. 대부분의 웹 애플리케이션은 여러 페이지에 걸쳐 동일한 일반 레이아웃을 유지하므로, 이 레이아웃을 하나의 블레이드 뷰로 정의하는 것이 편리합니다:

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

이 파일에는 일반적인 HTML 마크업이 포함되어 있습니다. 하지만, `@section`과 `@yield` 지시문에 주목하세요. `@section` 지시문은 콘텐츠의 섹션을 정의하고, `@yield` 지시문은 해당 섹션의 콘텐츠를 표시하는 데 사용됩니다.

이제 애플리케이션의 레이아웃을 정의했으니, 이 레이아웃을 상속하는 자식 페이지를 정의해봅시다.


#### 레이아웃 확장 {#extending-a-layout}

자식 뷰를 정의할 때, `@extends` 블레이드 지시문을 사용해 어떤 레이아웃을 "상속"할지 지정합니다. 블레이드 레이아웃을 확장하는 뷰는 `@section` 지시문을 사용해 레이아웃의 섹션에 콘텐츠를 주입할 수 있습니다. 위 예시에서 볼 수 있듯, 이 섹션의 내용은 레이아웃에서 `@yield`로 표시됩니다:

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

이 예시에서, `sidebar` 섹션은 `@@parent` 지시문을 사용해 레이아웃의 사이드바에 콘텐츠를 덮어쓰지 않고 추가합니다. `@@parent` 지시문은 뷰가 렌더링될 때 레이아웃의 콘텐츠로 대체됩니다.

> [!NOTE]
> 앞선 예시와 달리, 이 `sidebar` 섹션은 `@show` 대신 `@endsection`으로 끝납니다. `@endsection` 지시문은 섹션만 정의하고, `@show`는 섹션을 정의하고 **즉시 표시**합니다.

`@yield` 지시문은 두 번째 인자로 기본값도 받을 수 있습니다. 해당 섹션이 정의되지 않은 경우, 이 값이 렌더링됩니다:

```blade
@yield('content', 'Default content')
```


## 폼 {#forms}


### CSRF 필드 {#csrf-field}

애플리케이션에서 HTML 폼을 정의할 때마다, [CSRF 보호](/laravel/12.x/csrf) 미들웨어가 요청을 검증할 수 있도록 폼에 숨겨진 CSRF 토큰 필드를 포함해야 합니다. `@csrf` 블레이드 지시문을 사용해 토큰 필드를 생성할 수 있습니다:

```blade
<form method="POST" action="/profile">
    @csrf

    ...
</form>
```


### 메서드 필드 {#method-field}

HTML 폼은 `PUT`, `PATCH`, `DELETE` 요청을 만들 수 없으므로, 이러한 HTTP 메서드를 흉내내기 위해 숨겨진 `_method` 필드를 추가해야 합니다. `@method` 블레이드 지시문이 이 필드를 생성해줍니다:

```blade
<form action="/foo/bar" method="POST">
    @method('PUT')

    ...
</form>
```


### 유효성 검사 에러 {#validation-errors}

`@error` 지시문을 사용해 주어진 속성에 대한 [유효성 검사 에러 메시지](/laravel/12.x/validation#quick-displaying-the-validation-errors)가 존재하는지 빠르게 확인할 수 있습니다. `@error` 지시문 내에서는 `$message` 변수를 에코해 에러 메시지를 표시할 수 있습니다:

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

`@error` 지시문은 "if" 문으로 컴파일되므로, `@else` 지시문을 사용해 해당 속성에 에러가 없을 때 콘텐츠를 렌더링할 수 있습니다:

```blade
<!-- /resources/views/auth.blade.php -->

<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email') is-invalid @else is-valid @enderror"
/>
```

[특정 에러 백의 이름](/laravel/12.x/validation#named-error-bags)을 `@error` 지시문의 두 번째 인자로 전달해, 여러 폼이 있는 페이지에서 유효성 검사 에러 메시지를 조회할 수 있습니다:

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

블레이드는 명명된 스택에 콘텐츠를 푸시하고, 다른 뷰나 레이아웃에서 해당 스택을 렌더링할 수 있습니다. 이는 자식 뷰에서 필요한 자바스크립트 라이브러리를 지정할 때 특히 유용합니다:

```blade
@push('scripts')
    <script src="/example.js"></script>
@endpush
```

주어진 불리언 표현식이 `true`로 평가될 때만 `@push`하고 싶다면, `@pushIf` 지시문을 사용할 수 있습니다:

```blade
@pushIf($shouldPush, 'scripts')
    <script src="/example.js"></script>
@endPushIf
```

필요한 만큼 여러 번 스택에 푸시할 수 있습니다. 전체 스택 내용을 렌더링하려면, `@stack` 지시문에 스택 이름을 전달하세요:

```blade
<head>
    <!-- Head Contents -->

    @stack('scripts')
</head>
```

스택의 맨 앞에 콘텐츠를 추가하려면, `@prepend` 지시문을 사용하세요:

```blade
@push('scripts')
    This will be second...
@endpush

// 나중에...

@prepend('scripts')
    This will be first...
@endprepend
```


## 서비스 주입 {#service-injection}

`@inject` 지시문을 사용해 Laravel [서비스 컨테이너](/laravel/12.x/container)에서 서비스를 가져올 수 있습니다. `@inject`에 전달되는 첫 번째 인자는 서비스가 할당될 변수명이고, 두 번째 인자는 가져올 서비스의 클래스 또는 인터페이스명입니다:

```blade
@inject('metrics', 'App\Services\MetricsService')

<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}.
</div>
```


## 인라인 블레이드 템플릿 렌더링 {#rendering-inline-blade-templates}

때로는 원시 블레이드 템플릿 문자열을 유효한 HTML로 변환해야 할 수 있습니다. `Blade` 파사드의 `render` 메서드를 사용해 이를 구현할 수 있습니다. `render` 메서드는 블레이드 템플릿 문자열과, 템플릿에 제공할 데이터 배열(선택사항)을 받습니다:

```php
use Illuminate\Support\Facades\Blade;

return Blade::render('Hello, {{ $name }}', ['name' => 'Julian Bashir']);
```

Laravel은 인라인 블레이드 템플릿을 `storage/framework/views` 디렉터리에 임시로 저장해 렌더링합니다. 블레이드 템플릿 렌더링 후 이 임시 파일을 삭제하고 싶다면, `deleteCachedView` 인자를 메서드에 전달할 수 있습니다:

```php
return Blade::render(
    'Hello, {{ $name }}',
    ['name' => 'Julian Bashir'],
    deleteCachedView: true
);
```


## 블레이드 프래그먼트 렌더링 {#rendering-blade-fragments}

[Tubro](https://turbo.hotwired.dev/)나 [htmx](https://htmx.org/)와 같은 프론트엔드 프레임워크를 사용할 때, HTTP 응답에서 블레이드 템플릿의 일부만 반환해야 할 때가 있습니다. 블레이드 "프래그먼트"를 사용하면 이를 쉽게 구현할 수 있습니다. 먼저, 블레이드 템플릿의 일부를 `@fragment`와 `@endfragment` 지시문으로 감쌉니다:

```blade
@fragment('user-list')
    <ul>
        @foreach ($users as $user)
            <li>{{ $user->name }}</li>
        @endforeach
    </ul>
@endfragment
```

이 템플릿을 사용하는 뷰를 렌더링할 때, `fragment` 메서드를 호출해 지정한 프래그먼트만 HTTP 응답에 포함되도록 할 수 있습니다:

```php
return view('dashboard', ['users' => $users])->fragment('user-list');
```

`fragmentIf` 메서드를 사용하면, 주어진 조건에 따라 뷰의 프래그먼트만 반환하거나, 그렇지 않으면 전체 뷰를 반환할 수 있습니다:

```php
return view('dashboard', ['users' => $users])
    ->fragmentIf($request->hasHeader('HX-Request'), 'user-list');
```

`fragments` 및 `fragmentsIf` 메서드를 사용하면, 여러 뷰 프래그먼트를 응답에 반환할 수 있습니다. 프래그먼트는 서로 연결되어 반환됩니다:

```php
view('dashboard', ['users' => $users])
    ->fragments(['user-list', 'comment-list']);

view('dashboard', ['users' => $users])
    ->fragmentsIf(
        $request->hasHeader('HX-Request'),
        ['user-list', 'comment-list']
    );
```


## 블레이드 확장 {#extending-blade}

블레이드는 `directive` 메서드를 사용해 커스텀 지시문을 정의할 수 있습니다. 블레이드 컴파일러가 커스텀 지시문을 만나면, 해당 지시문이 포함한 표현식을 콜백에 전달합니다.

다음 예시는 주어진 `$var`(DateTime 인스턴스여야 함)를 포맷하는 `@datetime($var)` 지시문을 생성합니다:

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 등록.
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스 부트스트랩.
     */
    public function boot(): void
    {
        Blade::directive('datetime', function (string $expression) {
            return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
        });
    }
}
```

보시다시피, 지시문에 전달된 표현식에 `format` 메서드를 체이닝합니다. 이 예시에서, 이 지시문이 생성하는 최종 PHP 코드는 다음과 같습니다:

```php
<?php echo ($var)->format('m/d/Y H:i'); ?>
```

> [!WARNING]
> 블레이드 지시문의 로직을 수정한 후에는, 모든 캐시된 블레이드 뷰를 삭제해야 합니다. 캐시된 블레이드 뷰는 `view:clear` Artisan 명령어로 삭제할 수 있습니다.


### 커스텀 에코 핸들러 {#custom-echo-handlers}

블레이드에서 객체를 "에코"하려고 하면, 해당 객체의 `__toString` 메서드가 호출됩니다. [__toString](https://www.php.net/manual/en/language.oop5.magic.php#object.tostring) 메서드는 PHP의 내장 "매직 메서드" 중 하나입니다. 하지만, 사용하는 클래스가 서드파티 라이브러리에 속해 있어 `__toString` 메서드를 제어할 수 없는 경우도 있습니다.

이런 경우, 블레이드는 해당 객체 타입에 대한 커스텀 에코 핸들러를 등록할 수 있습니다. 이를 위해, 블레이드의 `stringable` 메서드를 호출하면 됩니다. `stringable` 메서드는 클로저를 받으며, 이 클로저는 렌더링할 객체 타입을 타입힌트해야 합니다. 일반적으로, `stringable` 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 호출해야 합니다:

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

커스텀 에코 핸들러를 정의한 후에는, 블레이드 템플릿에서 객체를 단순히 에코할 수 있습니다:

```blade
Cost: {{ $money }}
```


### 커스텀 If 문 {#custom-if-statements}

간단한 커스텀 조건문을 정의할 때는, 커스텀 지시문을 프로그래밍하는 것보다 더 간단한 방법이 있습니다. 블레이드는 클로저를 사용해 커스텀 조건부 지시문을 빠르게 정의할 수 있는 `Blade::if` 메서드를 제공합니다. 예를 들어, 애플리케이션의 기본 "디스크"를 확인하는 커스텀 조건문을 정의해봅시다. `AppServiceProvider`의 `boot` 메서드에서 다음과 같이 할 수 있습니다:

```php
use Illuminate\Support\Facades\Blade;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Blade::if('disk', function (string $value) {
        return config('filesystems.default') === $value;
    });
}
```

커스텀 조건문을 정의한 후에는, 템플릿 내에서 사용할 수 있습니다:

```blade
@disk('local')
    <!-- 애플리케이션이 local 디스크를 사용 중... -->
@elsedisk('s3')
    <!-- 애플리케이션이 s3 디스크를 사용 중... -->
@else
    <!-- 애플리케이션이 다른 디스크를 사용 중... -->
@enddisk

@unlessdisk('local')
    <!-- 애플리케이션이 local 디스크를 사용하지 않음... -->
@enddisk
```
