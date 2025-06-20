# 지연 로딩
Livewire는 초기 페이지 로드를 느리게 만드는 컴포넌트를 지연 로드(lazy load)할 수 있도록 해줍니다.

예를 들어, `mount()`에서 느린 데이터베이스 쿼리를 포함하는 `Revenue` 컴포넌트가 있다고 가정해봅시다:
```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount()
    {
        // 느린 데이터베이스 쿼리...
        $this->amount = Transaction::monthToDate()->sum('amount');
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

```blade
<div>
    이번 달 수익: {{ $amount }}
</div>
```

지연 로딩 없이 이 컴포넌트는 전체 페이지의 로딩을 지연시키고, 애플리케이션 전체가 느리게 느껴지게 만듭니다.

지연 로딩을 활성화하려면, 컴포넌트에 `lazy` 파라미터를 전달하면 됩니다:

```blade
<livewire:revenue lazy />
```

이제 Livewire는 컴포넌트를 즉시 로드하는 대신, 이 컴포넌트를 건너뛰고 컴포넌트 없이 페이지를 로드합니다. 그리고 컴포넌트가 뷰포트에 보이게 되면, Livewire가 네트워크 요청을 보내 이 컴포넌트를 완전히 페이지에 로드합니다.

> [!info] 지연 요청은 기본적으로 격리되어 있습니다
> Livewire의 다른 네트워크 요청과 달리, 지연 로딩 업데이트는 서버로 전송될 때 서로 격리되어 처리됩니다. 이로 인해 지연 로딩이 빠르게 유지되며, 페이지가 로드될 때 각 컴포넌트가 병렬로 로드됩니다. [이 동작을 비활성화하는 방법은 여기에서 더 읽어보세요 →](#disabling-request-isolation)

## 플레이스홀더 HTML 렌더링 {#rendering-placeholder-html}

기본적으로 Livewire는 컴포넌트가 완전히 로드되기 전에 빈 `<div></div>`를 삽입합니다. 컴포넌트가 처음에는 사용자에게 보이지 않기 때문에, 컴포넌트가 갑자기 페이지에 나타나면 어색할 수 있습니다.

컴포넌트가 로드 중임을 사용자에게 알리기 위해, `placeholder()` 메서드를 정의하여 로딩 스피너나 스켈레톤 플레이스홀더 등 원하는 형태의 플레이스홀더 HTML을 렌더링할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount()
    {
        // 느린 데이터베이스 쿼리...
        $this->amount = Transaction::monthToDate()->sum('amount');
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div>
            <!-- 로딩 스피너... -->
            <svg>...</svg>
        </div>
        HTML;
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

위 컴포넌트는 `placeholder()` 메서드에서 HTML을 반환하여 "플레이스홀더"를 지정했기 때문에, 컴포넌트가 완전히 로드될 때까지 사용자는 페이지에서 SVG 로딩 스피너를 보게 됩니다.

> [!warning] 플레이스홀더와 컴포넌트는 동일한 요소 타입을 사용해야 합니다
> 예를 들어, 플레이스홀더의 루트 요소 타입이 'div'라면, 컴포넌트 역시 'div' 요소를 사용해야 합니다.

### 뷰를 통한 플레이스홀더 렌더링 {#rendering-a-placeholder-via-a-view}

더 복잡한 로더(예: 스켈레톤 등)를 위해서는, `placeholder()`에서 `render()`와 유사하게 `view`를 반환할 수 있습니다.

```php
public function placeholder(array $params = [])
{
    return view('livewire.placeholders.skeleton', $params);
}
```

지연 로딩되는 컴포넌트에서 전달된 모든 파라미터는 `$params` 인자로 `placeholder()` 메서드에 전달됩니다.

## 뷰포트 외부의 지연 로딩 {#lazy-loading-outside-of-the-viewport}

기본적으로, 지연 로딩된 컴포넌트는 브라우저의 뷰포트에 들어올 때(예: 사용자가 스크롤할 때)까지 완전히 로드되지 않습니다.

페이지가 로드되자마자 모든 컴포넌트를 뷰포트에 들어오기를 기다리지 않고 지연 로딩하고 싶다면, `lazy` 파라미터에 "on-load"를 전달하면 됩니다:

```blade
<livewire:revenue lazy="on-load" />
```

이제 이 컴포넌트는 뷰포트에 들어오기를 기다리지 않고, 페이지가 준비된 후 로드됩니다.

## Props 전달하기 {#passing-in-props}

일반적으로, `lazy` 컴포넌트도 일반 컴포넌트와 동일하게 외부에서 데이터를 전달할 수 있습니다.

예를 들어, 부모 컴포넌트에서 `Revenue` 컴포넌트로 시간 구간을 전달하는 경우를 살펴봅시다:

```blade
<input type="date" wire:model="start">
<input type="date" wire:model="end">

<livewire:revenue lazy :$start :$end />
```

이 데이터는 다른 컴포넌트와 마찬가지로 `mount()`에서 받을 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount($start, $end)
    {
        // 비용이 많이 드는 데이터베이스 쿼리...
        $this->amount = Transactions::between($start, $end)->sum('amount');
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div>
            <!-- 로딩 스피너... -->
            <svg>...</svg>
        </div>
        HTML;
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

하지만 일반 컴포넌트 로드와 달리, `lazy` 컴포넌트는 전달된 프로퍼티를 직렬화(또는 "탈수화")하여 컴포넌트가 완전히 로드될 때까지 클라이언트 측에 임시로 저장해야 합니다.

예를 들어, Eloquent 모델을 `Revenue` 컴포넌트에 전달하고 싶을 수 있습니다:

```blade
<livewire:revenue lazy :$user />
```

일반 컴포넌트에서는 실제 PHP 메모리 내 `$user` 모델이 `Revenue`의 `mount()` 메서드로 전달됩니다. 하지만, `mount()`는 다음 네트워크 요청까지 실행되지 않으므로, Livewire는 내부적으로 `$user`를 JSON으로 직렬화한 뒤, 다음 요청이 처리되기 전에 데이터베이스에서 다시 쿼리합니다.

일반적으로, 이 직렬화는 애플리케이션의 동작에 차이를 일으키지 않습니다.

## 기본적으로 지연 로딩하기 {#lazy-load-by-default}

컴포넌트의 모든 사용이 기본적으로 지연 로딩되도록 강제하고 싶다면, 컴포넌트 클래스 위에 `#[Lazy]` 속성을 추가하면 됩니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy]
class Revenue extends Component
{
    // ...
}
```

지연 로딩을 오버라이드하고 싶다면, `lazy` 파라미터를 `false`로 설정할 수 있습니다:

```blade
<livewire:revenue :lazy="false" />
```

### 요청 격리 비활성화 {#disabling-request-isolation}

페이지에 여러 개의 지연 로딩 컴포넌트가 있을 경우, 각 컴포넌트는 독립적인 네트워크 요청을 보냅니다. 각 지연 업데이트가 하나의 요청으로 묶이지 않습니다.

이 격리 동작을 비활성화하고, 모든 업데이트를 하나의 네트워크 요청으로 묶고 싶다면, `isolate: false` 파라미터를 사용할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy(isolate: false)] // [!code highlight]
class Revenue extends Component
{
    // ...
}
```

이제 동일한 페이지에 `Revenue` 컴포넌트가 10개 있다면, 페이지가 로드될 때 10개의 업데이트가 모두 하나의 네트워크 요청으로 묶여 서버로 전송됩니다.

## 전체 페이지 지연 로딩 {#full-page-lazy-loading}

전체 페이지 Livewire 컴포넌트를 지연 로딩하고 싶을 수 있습니다. 다음과 같이 라우트에서 `->lazy()`를 호출하면 됩니다:

```php
Route::get('/dashboard', \App\Livewire\Dashboard::class)->lazy();
```

또는, 기본적으로 지연 로딩되는 컴포넌트에서 지연 로딩을 비활성화하고 싶다면, 다음과 같이 `enabled: false` 파라미터를 사용할 수 있습니다:

```php
Route::get('/dashboard', \App\Livewire\Dashboard::class)->lazy(enabled: false);
```

## 기본 플레이스홀더 뷰 {#default-placeholder-view}

모든 컴포넌트에 대해 기본 플레이스홀더 뷰를 설정하고 싶다면, `/config/livewire.php` 설정 파일에서 뷰를 참조하면 됩니다:

```php
'lazy_placeholder' => 'livewire.placeholder',
```

이제 컴포넌트가 지연 로딩되고 `placeholder()`가 정의되지 않은 경우, Livewire는 설정된 Blade 뷰(`livewire.placeholder`가 이 경우 사용됨)를 사용합니다.

## 테스트에서 지연 로딩 비활성화 {#disabling-lazy-loading-for-tests}

지연 컴포넌트 또는 중첩된 지연 컴포넌트가 있는 페이지를 단위 테스트할 때, "지연" 동작을 비활성화하여 최종 렌더링 동작을 검증하고 싶을 수 있습니다. 그렇지 않으면, 테스트 중에 해당 컴포넌트들은 플레이스홀더로 렌더링됩니다.

`Livewire::withoutLazyLoading()` 테스트 헬퍼를 사용하여 지연 로딩을 쉽게 비활성화할 수 있습니다:

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\Dashboard;
use Livewire\Livewire;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function test_renders_successfully()
    {
        Livewire::withoutLazyLoading() // [!code highlight]
            ->test(Dashboard::class)
            ->assertSee(...);
    }
}
```

이제 이 테스트에서 대시보드 컴포넌트가 렌더링될 때, `placeholder()` 렌더링을 건너뛰고 지연 로딩이 전혀 적용되지 않은 것처럼 전체 컴포넌트를 렌더링합니다.

