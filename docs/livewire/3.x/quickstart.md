# 빠른 시작
Livewire 여정을 시작하기 위해, 간단한 "카운터" 컴포넌트를 만들고 브라우저에 렌더링해보겠습니다. 이 예제는 Livewire의 _실시간성_을 가장 단순한 방식으로 보여주기 때문에 처음 Livewire를 경험하기에 좋은 방법입니다.

## 필수 조건 {#prerequisites}

시작하기 전에 다음이 설치되어 있는지 확인하세요:

- Laravel 10 버전 이상
- PHP 8.1 버전 이상

## Livewire 설치 {#install-livewire}

라라벨 앱의 루트 디렉터리에서 다음 [Composer](https://getcomposer.org/) 명령어를 실행하세요:

```shell
composer require livewire/livewire
```

> [!warning] Alpine이 이미 설치되어 있지 않은지 확인하세요
> 사용 중인 애플리케이션에 이미 AlpineJS가 설치되어 있다면, Livewire가 제대로 동작하려면 Alpine을 제거해야 합니다. 그렇지 않으면 Alpine이 두 번 로드되어 Livewire가 작동하지 않습니다. 예를 들어, Laravel Breeze의 "Blade with Alpine" 스타터 킷을 설치했다면, `resources/js/app.js`에서 Alpine을 제거해야 합니다.

## Livewire 컴포넌트 생성하기 {#create-a-livewire-component}

Livewire는 새로운 컴포넌트를 빠르게 생성할 수 있는 편리한 Artisan 명령어를 제공합니다. 다음 명령어를 실행하여 새로운 `Counter` 컴포넌트를 만드세요:

```shell
php artisan make:livewire counter
```

이 명령어는 프로젝트에 두 개의 새로운 파일을 생성합니다:
* `app/Livewire/Counter.php`
* `resources/views/livewire/counter.blade.php`

## 클래스 작성하기 {#writing-the-class}

`app/Livewire/Counter.php` 파일을 열고, 아래의 내용으로 교체하세요:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function decrement()
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

위 코드에 대한 간단한 설명입니다:
- `public $count = 1;` — `$count`라는 이름의 public 속성을 선언하며, 초기값은 `1`입니다.
- `public function increment()` — `increment()`라는 public 메서드를 선언하며, 호출될 때마다 `$count` 속성의 값을 1씩 증가시킵니다. 이러한 public 메서드는 사용자가 버튼을 클릭하는 등 다양한 방식으로 브라우저에서 트리거할 수 있습니다.
- `public function render()` — Blade 뷰를 반환하는 `render()` 메서드를 선언합니다. 이 Blade 뷰는 컴포넌트의 HTML 템플릿을 포함하게 됩니다.

## 뷰 작성하기 {#writing-the-view}

`resources/views/livewire/counter.blade.php` 파일을 열고, 아래의 내용으로 교체하세요:

```blade
<div>
    <h1>{{ $count }}</h1>

    <button wire:click="increment">+</button>

    <button wire:click="decrement">-</button>
</div>
```

이 코드는 `$count` 속성의 값을 표시하고, 각각 `$count` 속성을 증가 및 감소시키는 두 개의 버튼을 보여줍니다.

> [!warning] Livewire 컴포넌트는 반드시 하나의 루트 엘리먼트가 있어야 합니다
> Livewire가 제대로 동작하려면, 컴포넌트는 반드시 **하나**의 루트 엘리먼트만 가져야 합니다. 여러 개의 루트 엘리먼트가 감지되면 예외가 발생합니다. 예제처럼 `<div>` 엘리먼트를 사용하는 것이 권장됩니다. HTML 주석도 별도의 엘리먼트로 간주되므로 루트 엘리먼트 내부에 작성해야 합니다.
> [전체 페이지 컴포넌트](/livewire/3.x/components#full-page-components)를 렌더링할 때, 레이아웃 파일의 네임드 슬롯은 루트 엘리먼트 바깥에 둘 수 있습니다. 이들은 컴포넌트가 렌더링되기 전에 제거됩니다.

## 컴포넌트에 대한 라우트 등록하기 {#register-a-route-for-the-component}

Laravel 애플리케이션의 `routes/web.php` 파일을 열고 다음 코드를 추가하세요:

```php
use App\Livewire\Counter;

Route::get('/counter', Counter::class);
```

이제 _counter_ 컴포넌트가 `/counter` 라우트에 할당되어, 사용자가 애플리케이션의 `/counter` 엔드포인트를 방문하면 이 컴포넌트가 브라우저에 렌더링됩니다.

## 템플릿 레이아웃 생성하기 {#create-a-template-layout}

브라우저에서 `/counter`를 방문하기 전에, 컴포넌트가 렌더링될 HTML 레이아웃이 필요합니다. 기본적으로 Livewire는 `resources/views/components/layouts/app.blade.php`라는 이름의 레이아웃 파일을 자동으로 찾습니다.

아직 이 파일이 없다면, 다음 명령어를 실행하여 생성할 수 있습니다:

```shell
php artisan livewire:layout
```

이 명령어는 다음과 같은 내용을 가진 `resources/views/components/layouts/app.blade.php` 파일을 생성합니다:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

위 템플릿에서 `$slot` 변수 자리에 _counter_ 컴포넌트가 렌더링됩니다.

Livewire에서 제공하는 JavaScript나 CSS 에셋이 없는 것을 눈치챘을 수도 있습니다. 이는 Livewire 3 이상 버전에서는 필요한 프론트엔드 에셋을 자동으로 주입하기 때문입니다.

## 테스트해보기 {#test-it-out}

컴포넌트 클래스와 템플릿이 준비되었으니, 이제 컴포넌트를 테스트할 준비가 되었습니다!

브라우저에서 `/counter` 경로로 이동하면, 화면에 숫자가 표시되고 숫자를 증가시키거나 감소시키는 두 개의 버튼이 보일 것입니다.

버튼 중 하나를 클릭하면 페이지가 새로고침되지 않고 실시간으로 숫자가 업데이트되는 것을 확인할 수 있습니다. 이것이 바로 Livewire의 마법입니다. 프론트엔드 동적 애플리케이션을 오직 PHP로 작성할 수 있습니다.

지금까지는 Livewire의 기능 중 극히 일부분만 살펴보았습니다. Livewire가 제공하는 모든 기능을 확인하려면 문서를 계속 읽어보세요.
