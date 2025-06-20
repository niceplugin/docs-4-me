# Laravel Cashier (Paddle)




















































## 소개 {#introduction}

> [!WARNING]
> 이 문서는 Cashier Paddle 2.x의 Paddle Billing 통합에 대한 문서입니다. 아직 Paddle Classic을 사용 중이라면 [Cashier Paddle 1.x](https://github.com/laravel/cashier-paddle/tree/1.x)를 사용해야 합니다.

[Laravel Cashier Paddle](https://github.com/laravel/cashier-paddle)은 [Paddle](https://paddle.com)의 구독 결제 서비스를 위한 표현력 있고 유연한 인터페이스를 제공합니다. 반복적이고 지루한 구독 결제 코드를 거의 모두 처리해줍니다. 기본적인 구독 관리 외에도, Cashier는 구독 변경, 구독 "수량", 구독 일시정지, 취소 유예 기간 등 다양한 기능을 지원합니다.

Cashier Paddle을 본격적으로 사용하기 전에, Paddle의 [개념 가이드](https://developer.paddle.com/concepts/overview)와 [API 문서](https://developer.paddle.com/api-reference/overview)도 함께 참고하시길 권장합니다.


## Cashier 업그레이드 {#upgrading-cashier}

Cashier의 새 버전으로 업그레이드할 때는 반드시 [업그레이드 가이드](https://github.com/laravel/cashier-paddle/blob/master/UPGRADE.md)를 꼼꼼히 검토해야 합니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 사용하여 Paddle용 Cashier 패키지를 설치하세요:

```shell
composer require laravel/cashier-paddle
```

다음으로, `vendor:publish` Artisan 명령어를 사용하여 Cashier 마이그레이션 파일을 게시해야 합니다:

```shell
php artisan vendor:publish --tag="cashier-migrations"
```

그런 다음, 애플리케이션의 데이터베이스 마이그레이션을 실행하세요. Cashier 마이그레이션은 새로운 `customers` 테이블을 생성합니다. 또한, 모든 고객의 구독을 저장할 새로운 `subscriptions` 및 `subscription_items` 테이블이 생성됩니다. 마지막으로, 고객과 연관된 모든 Paddle 거래를 저장할 새로운 `transactions` 테이블이 생성됩니다:

```shell
php artisan migrate
```

> [!WARNING]
> Cashier가 모든 Paddle 이벤트를 올바르게 처리할 수 있도록 반드시 [Cashier의 웹훅 처리](#handling-paddle-webhooks)를 설정하세요.


### Paddle 샌드박스 {#paddle-sandbox}

로컬 및 스테이징 개발 중에는 [Paddle 샌드박스 계정](https://sandbox-login.paddle.com/signup)을 등록해야 합니다. 이 계정은 실제 결제 없이 애플리케이션을 테스트하고 개발할 수 있는 샌드박스 환경을 제공합니다. 다양한 결제 시나리오를 시뮬레이션하려면 Paddle의 [테스트 카드 번호](https://developer.paddle.com/concepts/payment-methods/credit-debit-card)를 사용할 수 있습니다.

Paddle 샌드박스 환경을 사용할 때는 애플리케이션의 `.env` 파일에서 `PADDLE_SANDBOX` 환경 변수를 `true`로 설정해야 합니다:

```ini
PADDLE_SANDBOX=true
```

애플리케이션 개발이 완료되면 [Paddle 벤더 계정](https://paddle.com)을 신청할 수 있습니다. 애플리케이션이 프로덕션에 배포되기 전에 Paddle에서 애플리케이션의 도메인을 승인해야 합니다.


## 설정 {#configuration}


### 청구 가능 모델 {#billable-model}

Cashier를 사용하기 전에, 사용자 모델 정의에 `Billable` 트레이트를 추가해야 합니다. 이 트레이트는 구독 생성, 결제 수단 정보 업데이트 등 일반적인 청구 작업을 수행할 수 있는 다양한 메서드를 제공합니다:

```php
use Laravel\Paddle\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

사용자가 아닌 청구 가능한 엔티티가 있다면, 해당 클래스에도 트레이트를 추가할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;
use Laravel\Paddle\Billable;

class Team extends Model
{
    use Billable;
}
```


### API 키 {#api-keys}

다음으로, 애플리케이션의 `.env` 파일에 Paddle 키를 설정해야 합니다. Paddle API 키는 Paddle 관리 패널에서 확인할 수 있습니다:

```ini
PADDLE_CLIENT_SIDE_TOKEN=your-paddle-client-side-token
PADDLE_API_KEY=your-paddle-api-key
PADDLE_RETAIN_KEY=your-paddle-retain-key
PADDLE_WEBHOOK_SECRET="your-paddle-webhook-secret"
PADDLE_SANDBOX=true
```

`PADDLE_SANDBOX` 환경 변수는 [Paddle 샌드박스 환경](#paddle-sandbox)을 사용할 때 `true`로 설정해야 합니다. 프로덕션에 배포하고 Paddle의 라이브 벤더 환경을 사용할 때는 `PADDLE_SANDBOX` 변수를 `false`로 설정해야 합니다.

`PADDLE_RETAIN_KEY`는 선택 사항이며, [Retain](https://developer.paddle.com/paddlejs/retain)과 함께 Paddle을 사용할 때만 설정해야 합니다.


### Paddle JS {#paddle-js}

Paddle은 Paddle 체크아웃 위젯을 시작하기 위해 자체 JavaScript 라이브러리에 의존합니다. 이 JavaScript 라이브러리는 애플리케이션 레이아웃의 닫는 `</head>` 태그 바로 앞에 `@paddleJS` Blade 디렉티브를 배치하여 로드할 수 있습니다:

```blade
<head>
    ...

    @paddleJS
</head>
```


### 통화 설정 {#currency-configuration}

인보이스에 표시할 금액을 포맷할 때 사용할 로케일을 지정할 수 있습니다. 내부적으로 Cashier는 [PHP의 `NumberFormatter` 클래스](https://www.php.net/manual/en/class.numberformatter.php)를 사용하여 통화 로케일을 설정합니다:

```ini
CASHIER_CURRENCY_LOCALE=nl_BE
```

> [!WARNING]
> `en` 이외의 로케일을 사용하려면 서버에 `ext-intl` PHP 확장 모듈이 설치 및 설정되어 있어야 합니다.


### 기본 모델 오버라이드 {#overriding-default-models}

Cashier에서 내부적으로 사용하는 모델을 자유롭게 확장할 수 있습니다. 직접 모델을 정의하고 해당 Cashier 모델을 상속하세요:

```php
use Laravel\Paddle\Subscription as CashierSubscription;

class Subscription extends CashierSubscription
{
    // ...
}
```

모델을 정의한 후, `Laravel\Paddle\Cashier` 클래스를 통해 Cashier에 커스텀 모델을 사용하도록 지시할 수 있습니다. 일반적으로 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 Cashier에 커스텀 모델을 알립니다:

```php
use App\Models\Cashier\Subscription;
use App\Models\Cashier\Transaction;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Cashier::useSubscriptionModel(Subscription::class);
    Cashier::useTransactionModel(Transaction::class);
}
```


## 빠른 시작 {#quickstart}


### 상품 판매 {#quickstart-selling-products}

> [!NOTE]
> Paddle Checkout을 사용하기 전에, Paddle 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한, [Paddle의 웹훅 처리](#handling-paddle-webhooks)도 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 결제를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Paddle의 Checkout Overlay](https://www.paddle.com/billing/checkout) 덕분에 현대적이고 견고한 결제 통합을 쉽게 구축할 수 있습니다.

비정기적이고 단일 청구 상품에 대해 고객에게 청구하려면, Cashier를 사용하여 Paddle의 Checkout Overlay로 고객에게 결제 정보를 입력받고 구매를 확정하도록 할 수 있습니다. 결제가 완료되면, 고객은 애플리케이션 내에서 원하는 성공 URL로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $request->user()->checkout('pri_deluxe_album')
        ->returnTo(route('dashboard'));

    return view('buy', ['checkout' => $checkout]);
})->name('checkout');
```

위 예시에서 볼 수 있듯이, Cashier가 제공하는 `checkout` 메서드를 사용하여 고객에게 특정 "가격 식별자"에 대한 Paddle Checkout Overlay를 표시할 체크아웃 객체를 생성합니다. Paddle에서 "가격"은 [특정 상품에 대해 정의된 가격](https://developer.paddle.com/build/products/create-products-prices)을 의미합니다.

필요하다면, `checkout` 메서드는 Paddle에 고객을 자동으로 생성하고 해당 Paddle 고객 레코드를 애플리케이션 데이터베이스의 사용자와 연결합니다. 체크아웃 세션이 완료되면, 고객은 전용 성공 페이지로 리디렉션되어 안내 메시지를 볼 수 있습니다.

`buy` 뷰에서는 Checkout Overlay를 표시하는 버튼을 포함합니다. `paddle-button` Blade 컴포넌트는 Cashier Paddle에 포함되어 있지만, [오버레이 체크아웃을 수동으로 렌더링](#manually-rendering-an-overlay-checkout)할 수도 있습니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Buy Product
</x-paddle-button>
```


#### Paddle Checkout에 메타 데이터 제공 {#providing-meta-data-to-paddle-checkout}

상품을 판매할 때, 애플리케이션에서 정의한 `Cart` 및 `Order` 모델을 통해 완료된 주문과 구매한 상품을 추적하는 것이 일반적입니다. 고객이 Paddle의 Checkout Overlay로 리디렉션되어 구매를 완료할 때, 기존 주문 식별자를 제공하여 결제 완료 후 해당 주문과 연결할 수 있습니다.

이를 위해, `checkout` 메서드에 커스텀 데이터를 배열로 전달할 수 있습니다. 사용자가 체크아웃을 시작할 때 애플리케이션 내에서 보류 중인 `Order`가 생성된다고 가정해봅시다. 이 예시의 `Cart`와 `Order` 모델은 Cashier에서 제공하지 않으며, 애플리케이션의 필요에 따라 자유롭게 구현할 수 있습니다:

```php
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;

Route::get('/cart/{cart}/checkout', function (Request $request, Cart $cart) {
    $order = Order::create([
        'cart_id' => $cart->id,
        'price_ids' => $cart->price_ids,
        'status' => 'incomplete',
    ]);

    $checkout = $request->user()->checkout($order->price_ids)
        ->customData(['order_id' => $order->id]);

    return view('billing', ['checkout' => $checkout]);
})->name('checkout');
```

위 예시에서 볼 수 있듯이, 사용자가 체크아웃을 시작할 때 카트/주문에 연결된 모든 Paddle 가격 식별자를 `checkout` 메서드에 전달합니다. 물론, 고객이 상품을 추가할 때 이 항목들을 "장바구니" 또는 주문과 연결하는 것은 애플리케이션의 책임입니다. 또한, `customData` 메서드를 통해 주문 ID를 Paddle Checkout Overlay에 전달합니다.

고객이 체크아웃을 완료하면 주문을 "완료"로 표시하고 싶을 것입니다. 이를 위해, Paddle에서 전송하는 웹훅을 Cashier가 이벤트로 발생시킬 때 해당 이벤트를 수신하여 데이터베이스에 주문 정보를 저장할 수 있습니다.

먼저, Cashier가 발생시키는 `TransactionCompleted` 이벤트를 수신하세요. 일반적으로 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 이벤트 리스너를 등록합니다:

```php
use App\Listeners\CompleteOrder;
use Illuminate\Support\Facades\Event;
use Laravel\Paddle\Events\TransactionCompleted;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Event::listen(TransactionCompleted::class, CompleteOrder::class);
}
```

이 예시에서, `CompleteOrder` 리스너는 다음과 같이 구현할 수 있습니다:

```php
namespace App\Listeners;

use App\Models\Order;
use Laravel\Paddle\Cashier;
use Laravel\Paddle\Events\TransactionCompleted;

class CompleteOrder
{
    /**
     * Handle the incoming Cashier webhook event.
     */
    public function handle(TransactionCompleted $event): void
    {
        $orderId = $event->payload['data']['custom_data']['order_id'] ?? null;

        $order = Order::findOrFail($orderId);

        $order->update(['status' => 'completed']);
    }
}
```

`transaction.completed` 이벤트에 포함된 데이터에 대한 자세한 내용은 Paddle 문서를 참고하세요: [Paddle의 이벤트 데이터 문서](https://developer.paddle.com/webhooks/transactions/transaction-completed).


### 구독 판매 {#quickstart-selling-subscriptions}

> [!NOTE]
> Paddle Checkout을 사용하기 전에, Paddle 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한, [Paddle의 웹훅 처리](#handling-paddle-webhooks)도 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 결제를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Paddle의 Checkout Overlay](https://www.paddle.com/billing/checkout) 덕분에 현대적이고 견고한 결제 통합을 쉽게 구축할 수 있습니다.

Cashier와 Paddle의 Checkout Overlay를 사용하여 구독을 판매하는 방법을 알아보기 위해, 기본 월간(`price_basic_monthly`) 및 연간(`price_basic_yearly`) 플랜이 있는 구독 서비스를 예로 들어보겠습니다. 이 두 가격은 Paddle 대시보드의 "Basic" 상품(`pro_basic`) 아래에 그룹화할 수 있습니다. 또한, 구독 서비스에서 Expert 플랜을 `pro_expert`로 제공할 수도 있습니다.

먼저, 고객이 어떻게 서비스에 구독할 수 있는지 알아봅시다. 예를 들어, 고객이 애플리케이션의 가격 페이지에서 Basic 플랜의 "구독" 버튼을 클릭한다고 가정할 수 있습니다. 이 버튼은 선택한 플랜에 대한 Paddle Checkout Overlay를 호출합니다. 시작하려면, `checkout` 메서드를 통해 체크아웃 세션을 시작하세요:

```php
use Illuminate\Http\Request;

Route::get('/subscribe', function (Request $request) {
    $checkout = $request->user()->checkout('price_basic_monthly')
        ->returnTo(route('dashboard'));

    return view('subscribe', ['checkout' => $checkout]);
})->name('subscribe');
```

`subscribe` 뷰에서는 Checkout Overlay를 표시하는 버튼을 포함합니다. `paddle-button` Blade 컴포넌트는 Cashier Paddle에 포함되어 있지만, [오버레이 체크아웃을 수동으로 렌더링](#manually-rendering-an-overlay-checkout)할 수도 있습니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Subscribe
</x-paddle-button>
```

이제 Subscribe 버튼을 클릭하면, 고객은 결제 정보를 입력하고 구독을 시작할 수 있습니다. 일부 결제 수단은 처리에 몇 초가 걸릴 수 있으므로, 구독이 실제로 시작되었는지 확인하려면 [Cashier의 웹훅 처리](#handling-paddle-webhooks)도 설정해야 합니다.

고객이 구독을 시작할 수 있게 되었으니, 이제 구독한 사용자만 애플리케이션의 특정 부분에 접근할 수 있도록 제한해야 합니다. Cashier의 `Billable` 트레이트가 제공하는 `subscribed` 메서드를 사용하여 사용자의 현재 구독 상태를 쉽게 확인할 수 있습니다:

```blade
@if ($user->subscribed())
    <p>You are subscribed.</p>
@endif
```

특정 상품이나 가격에 구독되어 있는지도 쉽게 확인할 수 있습니다:

```blade
@if ($user->subscribedToProduct('pro_basic'))
    <p>You are subscribed to our Basic product.</p>
@endif

@if ($user->subscribedToPrice('price_basic_monthly'))
    <p>You are subscribed to our monthly Basic plan.</p>
@endif
```


#### 구독 미들웨어 만들기 {#quickstart-building-a-subscribed-middleware}

편의를 위해, 들어오는 요청이 구독한 사용자인지 확인하는 [미들웨어](/laravel/12.x/middleware)를 만들 수 있습니다. 이 미들웨어를 정의한 후, 구독하지 않은 사용자가 라우트에 접근하지 못하도록 라우트에 쉽게 할당할 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Subscribed
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->subscribed()) {
            // 결제 페이지로 리디렉션하여 구독을 유도...
            return redirect('/subscribe');
        }

        return $next($request);
    }
}
```

미들웨어를 정의한 후, 라우트에 할당할 수 있습니다:

```php
use App\Http\Middleware\Subscribed;

Route::get('/dashboard', function () {
    // ...
})->middleware([Subscribed::class]);
```


#### 고객이 결제 플랜을 관리할 수 있도록 허용하기 {#quickstart-allowing-customers-to-manage-their-billing-plan}

고객이 다른 상품이나 "티어"로 구독 플랜을 변경하고 싶어할 수 있습니다. 위 예시에서는 고객이 월간 구독에서 연간 구독으로 플랜을 변경할 수 있도록 해야 합니다. 이를 위해 아래 라우트로 연결되는 버튼을 구현하면 됩니다:

```php
use Illuminate\Http\Request;

Route::put('/subscription/{price}/swap', function (Request $request, $price) {
    $user->subscription()->swap($price); // 이 예시에서는 "$price"가 "price_basic_yearly"입니다.

    return redirect()->route('dashboard');
})->name('subscription.swap');
```

플랜 변경 외에도, 고객이 구독을 취소할 수 있도록 해야 합니다. 플랜 변경과 마찬가지로, 아래 라우트로 연결되는 버튼을 제공합니다:

```php
use Illuminate\Http\Request;

Route::put('/subscription/cancel', function (Request $request, $price) {
    $user->subscription()->cancel();

    return redirect()->route('dashboard');
})->name('subscription.cancel');
```

이제 구독은 결제 주기가 끝날 때 취소됩니다.

> [!NOTE]
> Cashier의 웹훅 처리를 설정했다면, Cashier는 Paddle에서 들어오는 웹훅을 검사하여 애플리케이션의 Cashier 관련 데이터베이스 테이블을 자동으로 동기화합니다. 예를 들어, Paddle 대시보드에서 고객의 구독을 취소하면, Cashier가 해당 웹훅을 받아 애플리케이션 데이터베이스에서 구독을 "취소됨"으로 표시합니다.


## 체크아웃 세션 {#checkout-sessions}

대부분의 고객 청구 작업은 Paddle의 [Checkout Overlay 위젯](https://developer.paddle.com/build/checkout/build-overlay-checkout) 또는 [인라인 체크아웃](https://developer.paddle.com/build/checkout/build-branded-inline-checkout)을 사용하여 "체크아웃"을 통해 수행됩니다.

Paddle을 사용하여 체크아웃 결제를 처리하기 전에, 애플리케이션의 [기본 결제 링크](https://developer.paddle.com/build/transactions/default-payment-link#set-default-link)를 Paddle 체크아웃 설정 대시보드에 정의해야 합니다.


### 오버레이 체크아웃 {#overlay-checkout}

Checkout Overlay 위젯을 표시하기 전에, Cashier를 사용하여 체크아웃 세션을 생성해야 합니다. 체크아웃 세션은 체크아웃 위젯에 어떤 청구 작업을 수행할지 알려줍니다:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

Cashier에는 `paddle-button` [Blade 컴포넌트](/laravel/12.x/blade#components)가 포함되어 있습니다. 이 컴포넌트에 체크아웃 세션을 "prop"으로 전달할 수 있습니다. 버튼을 클릭하면 Paddle의 체크아웃 위젯이 표시됩니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Subscribe
</x-paddle-button>
```

기본적으로 Paddle의 기본 스타일이 적용된 위젯이 표시됩니다. [Paddle에서 지원하는 속성](https://developer.paddle.com/paddlejs/html-data-attributes)인 `data-theme='light'`와 같은 속성을 컴포넌트에 추가하여 위젯을 커스터마이즈할 수 있습니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4" data-theme="light">
    Subscribe
</x-paddle-button>
```

Paddle 체크아웃 위젯은 비동기적으로 동작합니다. 사용자가 위젯 내에서 구독을 생성하면, Paddle이 애플리케이션에 웹훅을 전송하여 애플리케이션 데이터베이스의 구독 상태를 올바르게 업데이트할 수 있도록 합니다. 따라서 Paddle의 상태 변경을 반영하려면 [웹훅을 올바르게 설정](#handling-paddle-webhooks)하는 것이 중요합니다.

> [!WARNING]
> 구독 상태 변경 후, 해당 웹훅을 수신하는 데 걸리는 지연은 일반적으로 매우 짧지만, 체크아웃 완료 직후 사용자의 구독이 즉시 활성화되지 않을 수 있음을 애플리케이션에서 고려해야 합니다.


#### 오버레이 체크아웃 수동 렌더링 {#manually-rendering-an-overlay-checkout}

Laravel의 내장 Blade 컴포넌트를 사용하지 않고 오버레이 체크아웃을 수동으로 렌더링할 수도 있습니다. 먼저, [이전 예시와 같이](#overlay-checkout) 체크아웃 세션을 생성하세요:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

다음으로, Paddle.js를 사용하여 체크아웃을 초기화할 수 있습니다. 이 예시에서는 `paddle_button` 클래스를 할당한 링크를 생성합니다. Paddle.js는 이 클래스를 감지하여 링크 클릭 시 오버레이 체크아웃을 표시합니다:

```blade
<?php
$items = $checkout->getItems();
$customer = $checkout->getCustomer();
$custom = $checkout->getCustomData();
?>

<a
    href='#!'
    class='paddle_button'
    data-items='{!! json_encode($items) !!}'
    @if ($customer) data-customer-id='{{ $customer->paddle_id }}' @endif
    @if ($custom) data-custom-data='{{ json_encode($custom) }}' @endif
    @if ($returnUrl = $checkout->getReturnUrl()) data-success-url='{{ $returnUrl }}' @endif
>
    Buy Product
</a>
```


### 인라인 체크아웃 {#inline-checkout}

Paddle의 "오버레이" 스타일 체크아웃 위젯을 사용하고 싶지 않다면, Paddle은 위젯을 인라인으로 표시하는 옵션도 제공합니다. 이 방식은 체크아웃의 HTML 필드를 조정할 수는 없지만, 위젯을 애플리케이션 내에 임베드할 수 있습니다.

인라인 체크아웃을 쉽게 시작할 수 있도록 Cashier에는 `paddle-checkout` Blade 컴포넌트가 포함되어 있습니다. 먼저, [체크아웃 세션을 생성](#overlay-checkout)하세요:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

그런 다음, 체크아웃 세션을 컴포넌트의 `checkout` 속성에 전달할 수 있습니다:

```blade
<x-paddle-checkout :checkout="$checkout" class="w-full" />
```

인라인 체크아웃 컴포넌트의 높이를 조정하려면, `height` 속성을 Blade 컴포넌트에 전달하세요:

```blade
<x-paddle-checkout :checkout="$checkout" class="w-full" height="500" />
```

인라인 체크아웃의 커스터마이즈 옵션에 대한 자세한 내용은 Paddle의 [인라인 체크아웃 가이드](https://developer.paddle.com/build/checkout/build-branded-inline-checkout)와 [체크아웃 설정 문서](https://developer.paddle.com/build/checkout/set-up-checkout-default-settings)를 참고하세요.


#### 인라인 체크아웃 수동 렌더링 {#manually-rendering-an-inline-checkout}

Laravel의 내장 Blade 컴포넌트를 사용하지 않고 인라인 체크아웃을 수동으로 렌더링할 수도 있습니다. 먼저, [이전 예시와 같이](#inline-checkout) 체크아웃 세션을 생성하세요:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

다음으로, Paddle.js를 사용하여 체크아웃을 초기화할 수 있습니다. 이 예시에서는 [Alpine.js](https://github.com/alpinejs/alpine)를 사용하지만, 프론트엔드 스택에 맞게 자유롭게 수정할 수 있습니다:

```blade
<?php
$options = $checkout->options();

$options['settings']['frameTarget'] = 'paddle-checkout';
$options['settings']['frameInitialHeight'] = 366;
?>

<div class="paddle-checkout" x-data="{}" x-init="
    Paddle.Checkout.open(@json($options));
">
</div>
```


### 비회원 체크아웃 {#guest-checkouts}

때로는 애플리케이션 계정이 필요 없는 사용자에게 체크아웃 세션을 생성해야 할 수 있습니다. 이럴 때는 `guest` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;
use Laravel\Paddle\Checkout;

Route::get('/buy', function (Request $request) {
    $checkout = Checkout::guest(['pri_34567'])
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

그런 다음, [Paddle 버튼](#overlay-checkout) 또는 [인라인 체크아웃](#inline-checkout) Blade 컴포넌트에 체크아웃 세션을 전달할 수 있습니다.


## 가격 미리보기 {#price-previews}

Paddle은 통화별로 가격을 커스터마이즈할 수 있으므로, 국가별로 다른 가격을 설정할 수 있습니다. Cashier Paddle은 `previewPrices` 메서드를 사용하여 이러한 모든 가격을 조회할 수 있습니다. 이 메서드는 조회할 가격 ID를 인자로 받습니다:

```php
use Laravel\Paddle\Cashier;

$prices = Cashier::previewPrices(['pri_123', 'pri_456']);
```

통화는 요청의 IP 주소를 기반으로 결정되지만, 특정 국가를 지정하여 가격을 조회할 수도 있습니다:

```php
use Laravel\Paddle\Cashier;

$prices = Cashier::previewPrices(['pri_123', 'pri_456'], ['address' => [
    'country_code' => 'BE',
    'postal_code' => '1234',
]]);
```

가격을 조회한 후에는 원하는 방식으로 표시할 수 있습니다:

```blade
<ul>
    @foreach ($prices as $price)
        <li>{{ $price->product['name'] }} - {{ $price->total() }}</li>
    @endforeach
</ul>
```

소계와 세금 금액을 별도로 표시할 수도 있습니다:

```blade
<ul>
    @foreach ($prices as $price)
        <li>{{ $price->product['name'] }} - {{ $price->subtotal() }} (+ {{ $price->tax() }} tax)</li>
    @endforeach
</ul>
```

자세한 내용은 [Paddle의 가격 미리보기 API 문서](https://developer.paddle.com/api-reference/pricing-preview/preview-prices)를 참고하세요.


### 고객 가격 미리보기 {#customer-price-previews}

이미 고객인 사용자가 있고, 해당 고객에게 적용되는 가격을 표시하고 싶다면, 고객 인스턴스에서 직접 가격을 조회할 수 있습니다:

```php
use App\Models\User;

$prices = User::find(1)->previewPrices(['pri_123', 'pri_456']);
```

내부적으로 Cashier는 사용자의 고객 ID를 사용하여 해당 통화로 가격을 조회합니다. 예를 들어, 미국에 거주하는 사용자는 달러로, 벨기에에 거주하는 사용자는 유로로 가격을 확인할 수 있습니다. 일치하는 통화를 찾을 수 없는 경우, 상품의 기본 통화가 사용됩니다. Paddle 관리 패널에서 상품 또는 구독 플랜의 모든 가격을 커스터마이즈할 수 있습니다.


### 할인 {#price-discounts}

할인 적용 후의 가격을 표시할 수도 있습니다. `previewPrices` 메서드를 호출할 때, `discount_id` 옵션을 통해 할인 ID를 전달하세요:

```php
use Laravel\Paddle\Cashier;

$prices = Cashier::previewPrices(['pri_123', 'pri_456'], [
    'discount_id' => 'dsc_123'
]);
```

계산된 가격을 표시하세요:

```blade
<ul>
    @foreach ($prices as $price)
        <li>{{ $price->product['name'] }} - {{ $price->total() }}</li>
    @endforeach
</ul>
```


## 고객 {#customers}


### 고객 기본값 {#customer-defaults}

Cashier는 체크아웃 세션을 생성할 때 고객에 대한 유용한 기본값을 정의할 수 있습니다. 이 기본값을 설정하면 고객의 이메일 주소와 이름을 미리 입력하여 결제 위젯에서 바로 결제 단계로 넘어갈 수 있습니다. 청구 가능 모델에서 다음 메서드를 오버라이드하여 기본값을 설정할 수 있습니다:

```php
/**
 * Paddle에 연결할 고객 이름을 반환합니다.
 */
public function paddleName(): string|null
{
    return $this->name;
}

/**
 * Paddle에 연결할 고객 이메일 주소를 반환합니다.
 */
public function paddleEmail(): string|null
{
    return $this->email;
}
```

이 기본값은 [체크아웃 세션](#checkout-sessions)을 생성하는 Cashier의 모든 작업에 사용됩니다.


### 고객 조회 {#retrieving-customers}

`Cashier::findBillable` 메서드를 사용하여 Paddle 고객 ID로 고객을 조회할 수 있습니다. 이 메서드는 청구 가능 모델의 인스턴스를 반환합니다:

```php
use Laravel\Paddle\Cashier;

$user = Cashier::findBillable($customerId);
```


### 고객 생성 {#creating-customers}

가끔 구독을 시작하지 않고 Paddle 고객만 생성하고 싶을 수 있습니다. 이럴 때는 `createAsCustomer` 메서드를 사용할 수 있습니다:

```php
$customer = $user->createAsCustomer();
```

`Laravel\Paddle\Customer` 인스턴스가 반환됩니다. 고객이 Paddle에 생성된 후, 나중에 구독을 시작할 수 있습니다. [Paddle API에서 지원하는 고객 생성 파라미터](https://developer.paddle.com/api-reference/customers/create-customer)를 추가로 전달하려면, 선택적 `$options` 배열을 사용할 수 있습니다:

```php
$customer = $user->createAsCustomer($options);
```


## 구독 {#subscriptions}


### 구독 생성 {#creating-subscriptions}

구독을 생성하려면, 먼저 데이터베이스에서 청구 가능 모델 인스턴스를 조회해야 합니다. 일반적으로 `App\Models\User` 인스턴스가 됩니다. 모델 인스턴스를 조회한 후, `subscribe` 메서드를 사용하여 모델의 체크아웃 세션을 생성할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $checkout = $request->user()->subscribe($premium = 'pri_123', 'default')
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

`subscribe` 메서드의 첫 번째 인자는 사용자가 구독할 특정 가격입니다. 이 값은 Paddle의 가격 식별자와 일치해야 합니다. `returnTo` 메서드는 사용자가 체크아웃을 성공적으로 완료한 후 리디렉션될 URL을 받습니다. `subscribe` 메서드의 두 번째 인자는 구독의 내부 "타입"입니다. 애플리케이션에서 단일 구독만 제공한다면 `default` 또는 `primary`로 지정할 수 있습니다. 이 구독 타입은 내부 애플리케이션 용도로만 사용되며, 사용자에게 표시되지 않습니다. 또한, 공백이 없어야 하며 구독 생성 후에는 변경해서는 안 됩니다.

구독에 대한 커스텀 메타데이터를 배열로 전달하려면 `customData` 메서드를 사용할 수 있습니다:

```php
$checkout = $request->user()->subscribe($premium = 'pri_123', 'default')
    ->customData(['key' => 'value'])
    ->returnTo(route('home'));
```

구독 체크아웃 세션이 생성되면, Cashier Paddle에 포함된 `paddle-button` [Blade 컴포넌트](#overlay-checkout)에 체크아웃 세션을 전달할 수 있습니다:

```blade
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Subscribe
</x-paddle-button>
```

사용자가 체크아웃을 완료하면, Paddle에서 `subscription_created` 웹훅이 전송됩니다. Cashier는 이 웹훅을 수신하여 고객의 구독을 설정합니다. 모든 웹훅이 올바르게 수신 및 처리되도록 하려면, 반드시 [웹훅 처리를 올바르게 설정](#handling-paddle-webhooks)하세요.


### 구독 상태 확인 {#checking-subscription-status}

사용자가 애플리케이션에 구독한 후, 다양한 편리한 메서드를 사용하여 구독 상태를 확인할 수 있습니다. 먼저, `subscribed` 메서드는 사용자가 유효한 구독을 가지고 있으면(체험판 기간 중이어도) `true`를 반환합니다:

```php
if ($user->subscribed()) {
    // ...
}
```

애플리케이션에서 여러 구독을 제공한다면, `subscribed` 메서드 호출 시 구독을 지정할 수 있습니다:

```php
if ($user->subscribed('default')) {
    // ...
}
```

`subscribed` 메서드는 [라우트 미들웨어](/laravel/12.x/middleware)로도 훌륭하게 사용할 수 있어, 사용자의 구독 상태에 따라 라우트 및 컨트롤러 접근을 필터링할 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSubscribed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && ! $request->user()->subscribed()) {
            // 이 사용자는 유료 고객이 아닙니다...
            return redirect('/billing');
        }

        return $next($request);
    }
}
```

사용자가 아직 체험판 기간 중인지 확인하려면, `onTrial` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 체험판 기간 중임을 사용자에게 경고로 표시할지 결정할 때 유용합니다:

```php
if ($user->subscription()->onTrial()) {
    // ...
}
```

`subscribedToPrice` 메서드는 사용자가 주어진 Paddle 가격 ID에 기반한 플랜에 구독되어 있는지 확인할 때 사용할 수 있습니다. 이 예시에서는 사용자의 `default` 구독이 월간 가격에 활성 구독되어 있는지 확인합니다:

```php
if ($user->subscribedToPrice($monthly = 'pri_123', 'default')) {
    // ...
}
```

`recurring` 메서드는 사용자가 현재 활성 구독 중이며, 더 이상 체험판이나 유예 기간이 아닌지 확인할 때 사용할 수 있습니다:

```php
if ($user->subscription()->recurring()) {
    // ...
}
```


#### 구독 취소 상태 {#canceled-subscription-status}

사용자가 한때 활성 구독자였으나 구독을 취소했는지 확인하려면, `canceled` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription()->canceled()) {
    // ...
}
```

또한, 사용자가 구독을 취소했지만 구독이 완전히 만료되기 전 "유예 기간"에 있는지도 확인할 수 있습니다. 예를 들어, 사용자가 3월 5일에 구독을 취소했지만 원래 3월 10일에 만료될 예정이었다면, 3월 10일까지는 "유예 기간"에 있습니다. 이 기간 동안 `subscribed` 메서드는 여전히 `true`를 반환합니다:

```php
if ($user->subscription()->onGracePeriod()) {
    // ...
}
```


#### 연체 상태 {#past-due-status}

구독 결제에 실패하면, 구독은 `past_due` 상태로 표시됩니다. 이 상태에서는 고객이 결제 정보를 업데이트할 때까지 구독이 활성화되지 않습니다. 구독 인스턴스의 `pastDue` 메서드를 사용하여 연체 상태인지 확인할 수 있습니다:

```php
if ($user->subscription()->pastDue()) {
    // ...
}
```

구독이 연체 상태일 때는, [결제 정보 업데이트](#updating-payment-information)를 안내해야 합니다.

연체 상태에서도 구독을 유효한 것으로 간주하려면, Cashier가 제공하는 `keepPastDueSubscriptionsActive` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 `AppServiceProvider`의 `register` 메서드에서 호출해야 합니다:

```php
use Laravel\Paddle\Cashier;

/**
 * Register any application services.
 */
public function register(): void
{
    Cashier::keepPastDueSubscriptionsActive();
}
```

> [!WARNING]
> 구독이 `past_due` 상태일 때는 결제 정보가 업데이트되기 전까지 변경할 수 없습니다. 따라서, `swap` 및 `updateQuantity` 메서드는 `past_due` 상태에서 예외를 발생시킵니다.


#### 구독 쿼리 스코프 {#subscription-scopes}

대부분의 구독 상태는 쿼리 스코프로도 제공되어, 데이터베이스에서 특정 상태의 구독을 쉽게 조회할 수 있습니다:

```php
// 모든 유효한 구독 조회...
$subscriptions = Subscription::query()->valid()->get();

// 사용자의 모든 취소된 구독 조회...
$subscriptions = $user->subscriptions()->canceled()->get();
```

사용 가능한 모든 스코프는 아래와 같습니다:

```php
Subscription::query()->valid();
Subscription::query()->onTrial();
Subscription::query()->expiredTrial();
Subscription::query()->notOnTrial();
Subscription::query()->active();
Subscription::query()->recurring();
Subscription::query()->pastDue();
Subscription::query()->paused();
Subscription::query()->notPaused();
Subscription::query()->onPausedGracePeriod();
Subscription::query()->notOnPausedGracePeriod();
Subscription::query()->canceled();
Subscription::query()->notCanceled();
Subscription::query()->onGracePeriod();
Subscription::query()->notOnGracePeriod();
```


### 구독 단일 청구 {#subscription-single-charges}

구독 단일 청구를 사용하면, 구독자에게 구독 외에 일회성 청구를 할 수 있습니다. `charge` 메서드를 호출할 때 하나 이상의 가격 ID를 제공해야 합니다:

```php
// 단일 가격 청구...
$response = $user->subscription()->charge('pri_123');

// 여러 가격을 한 번에 청구...
$response = $user->subscription()->charge(['pri_123', 'pri_456']);
```

`charge` 메서드는 실제로 고객에게 다음 구독 결제 주기까지 청구하지 않습니다. 즉시 청구하려면, 대신 `chargeAndInvoice` 메서드를 사용할 수 있습니다:

```php
$response = $user->subscription()->chargeAndInvoice('pri_123');
```


### 결제 정보 업데이트 {#updating-payment-information}

Paddle은 항상 구독별로 결제 수단을 저장합니다. 구독의 기본 결제 수단을 업데이트하려면, 구독 모델의 `redirectToUpdatePaymentMethod` 메서드를 사용하여 고객을 Paddle의 결제 수단 업데이트 페이지로 리디렉션해야 합니다:

```php
use Illuminate\Http\Request;

Route::get('/update-payment-method', function (Request $request) {
    $user = $request->user();

    return $user->subscription()->redirectToUpdatePaymentMethod();
});
```

사용자가 정보를 업데이트하면, Paddle에서 `subscription_updated` 웹훅이 전송되고 구독 정보가 애플리케이션 데이터베이스에 업데이트됩니다.


### 플랜 변경 {#changing-plans}

사용자가 애플리케이션에 구독한 후, 가끔 새로운 구독 플랜으로 변경하고 싶어할 수 있습니다. 사용자의 구독 플랜을 업데이트하려면, Paddle 가격 식별자를 구독의 `swap` 메서드에 전달하세요:

```php
use App\Models\User;

$user = User::find(1);

$user->subscription()->swap($premium = 'pri_456');
```

플랜을 변경하고 다음 결제 주기를 기다리지 않고 즉시 청구서를 발행하려면, `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->subscription()->swapAndInvoice($premium = 'pri_456');
```


#### 비례 배분(Prorations) {#prorations}

기본적으로 Paddle은 플랜 변경 시 요금을 비례 배분(prorate)합니다. `noProrate` 메서드를 사용하면 요금을 비례 배분하지 않고 구독을 업데이트할 수 있습니다:

```php
$user->subscription('default')->noProrate()->swap($premium = 'pri_456');
```

비례 배분을 비활성화하고 즉시 청구서를 발행하려면, `swapAndInvoice`와 `noProrate`를 함께 사용할 수 있습니다:

```php
$user->subscription('default')->noProrate()->swapAndInvoice($premium = 'pri_456');
```

구독 변경에 대해 고객에게 청구하지 않으려면, `doNotBill` 메서드를 사용할 수 있습니다:

```php
$user->subscription('default')->doNotBill()->swap($premium = 'pri_456');
```

Paddle의 비례 배분 정책에 대한 자세한 내용은 [Paddle의 비례 배분 문서](https://developer.paddle.com/concepts/subscriptions/proration)를 참고하세요.


### 구독 수량 {#subscription-quantity}

때로는 구독이 "수량"에 따라 달라집니다. 예를 들어, 프로젝트 관리 애플리케이션이 프로젝트당 월 $10을 청구한다고 가정할 수 있습니다. 구독 수량을 쉽게 증가 또는 감소시키려면, `incrementQuantity` 및 `decrementQuantity` 메서드를 사용하세요:

```php
$user = User::find(1);

$user->subscription()->incrementQuantity();

// 구독의 현재 수량에 5를 추가...
$user->subscription()->incrementQuantity(5);

$user->subscription()->decrementQuantity();

// 구독의 현재 수량에서 5를 차감...
$user->subscription()->decrementQuantity(5);
```

또는, `updateQuantity` 메서드를 사용하여 특정 수량으로 설정할 수 있습니다:

```php
$user->subscription()->updateQuantity(10);
```

`noProrate` 메서드를 사용하면 요금을 비례 배분하지 않고 구독 수량을 업데이트할 수 있습니다:

```php
$user->subscription()->noProrate()->updateQuantity(10);
```


#### 여러 상품이 포함된 구독의 수량 {#quantities-for-subscription-with-multiple-products}

[여러 상품이 포함된 구독](#subscriptions-with-multiple-products)인 경우, 증가/감소 메서드의 두 번째 인자로 수량을 변경할 가격의 ID를 전달해야 합니다:

```php
$user->subscription()->incrementQuantity(1, 'price_chat');
```


### 여러 상품이 포함된 구독 {#subscriptions-with-multiple-products}

[여러 상품이 포함된 구독](https://developer.paddle.com/build/subscriptions/add-remove-products-prices-addons)을 사용하면, 하나의 구독에 여러 청구 상품을 할당할 수 있습니다. 예를 들어, 고객 지원 "헬프데스크" 애플리케이션을 구축한다고 가정해봅시다. 기본 구독 가격은 월 $10이지만, 라이브 채팅 추가 상품은 월 $15입니다.

구독 체크아웃 세션을 생성할 때, `subscribe` 메서드의 첫 번째 인자로 가격 배열을 전달하여 하나의 구독에 여러 상품을 지정할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $checkout = $request->user()->subscribe([
        'price_monthly',
        'price_chat',
    ]);

    return view('billing', ['checkout' => $checkout]);
});
```

위 예시에서는 고객의 `default` 구독에 두 개의 가격이 연결됩니다. 두 가격 모두 각자의 결제 주기에 따라 청구됩니다. 필요하다면, 각 가격에 대한 특정 수량을 지정하기 위해 키/값 쌍의 연관 배열을 전달할 수 있습니다:

```php
$user = User::find(1);

$checkout = $user->subscribe('default', ['price_monthly', 'price_chat' => 5]);
```

기존 구독에 다른 가격을 추가하려면, 구독의 `swap` 메서드를 사용해야 합니다. `swap` 메서드를 호출할 때는 구독의 현재 가격과 수량도 함께 포함해야 합니다:

```php
$user = User::find(1);

$user->subscription()->swap(['price_chat', 'price_original' => 2]);
```

위 예시는 새 가격을 추가하지만, 고객은 다음 결제 주기까지 청구되지 않습니다. 즉시 청구하려면, `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user->subscription()->swapAndInvoice(['price_chat', 'price_original' => 2]);
```

`swap` 메서드에서 제거하려는 가격을 생략하여 구독에서 가격을 제거할 수 있습니다:

```php
$user->subscription()->swap(['price_original' => 2]);
```

> [!WARNING]
> 구독에서 마지막 가격은 제거할 수 없습니다. 대신, 구독을 취소해야 합니다.


### 다중 구독 {#multiple-subscriptions}

Paddle은 고객이 동시에 여러 구독을 가질 수 있도록 지원합니다. 예를 들어, 헬스장이 수영 구독과 웨이트 트레이닝 구독을 각각 다른 가격으로 제공한다고 가정할 수 있습니다. 고객은 두 플랜 중 하나 또는 모두에 구독할 수 있어야 합니다.

애플리케이션에서 구독을 생성할 때, `subscribe` 메서드의 두 번째 인자로 구독의 타입을 지정할 수 있습니다. 타입은 사용자가 시작하는 구독을 나타내는 임의의 문자열입니다:

```php
use Illuminate\Http\Request;

Route::post('/swimming/subscribe', function (Request $request) {
    $checkout = $request->user()->subscribe($swimmingMonthly = 'pri_123', 'swimming');

    return view('billing', ['checkout' => $checkout]);
});
```

이 예시에서는 고객에게 월간 수영 구독을 시작했습니다. 하지만 나중에 연간 구독으로 변경하고 싶을 수 있습니다. 고객의 구독을 조정할 때는 `swimming` 구독의 가격만 변경하면 됩니다:

```php
$user->subscription('swimming')->swap($swimmingYearly = 'pri_456');
```

물론, 구독을 완전히 취소할 수도 있습니다:

```php
$user->subscription('swimming')->cancel();
```


### 구독 일시정지 {#pausing-subscriptions}

구독을 일시정지하려면, 사용자의 구독에서 `pause` 메서드를 호출하세요:

```php
$user->subscription()->pause();
```

구독이 일시정지되면, Cashier는 데이터베이스의 `paused_at` 컬럼을 자동으로 설정합니다. 이 컬럼은 `paused` 메서드가 언제부터 `true`를 반환해야 하는지 판단하는 데 사용됩니다. 예를 들어, 고객이 3월 1일에 구독을 일시정지했지만, 구독이 3월 5일에 갱신될 예정이었다면, 3월 5일까지는 `paused` 메서드가 `false`를 반환합니다. 이는 일반적으로 고객이 결제 주기가 끝날 때까지 애플리케이션을 계속 사용할 수 있도록 허용하기 때문입니다.

기본적으로 일시정지는 다음 결제 주기에 적용되어, 고객이 결제한 기간의 나머지를 사용할 수 있습니다. 즉시 구독을 일시정지하려면, `pauseNow` 메서드를 사용할 수 있습니다:

```php
$user->subscription()->pauseNow();
```

`pauseUntil` 메서드를 사용하면, 특정 시점까지 구독을 일시정지할 수 있습니다:

```php
$user->subscription()->pauseUntil(now()->addMonth());
```

또는, `pauseNowUntil` 메서드를 사용하여 즉시 구독을 일시정지하고 지정한 시점까지 유지할 수 있습니다:

```php
$user->subscription()->pauseNowUntil(now()->addMonth());
```

사용자가 구독을 일시정지했지만 아직 "유예 기간"에 있는지 확인하려면, `onPausedGracePeriod` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription()->onPausedGracePeriod()) {
    // ...
}
```

일시정지된 구독을 다시 활성화하려면, 구독에서 `resume` 메서드를 호출하세요:

```php
$user->subscription()->resume();
```

> [!WARNING]
> 구독이 일시정지된 동안에는 수정할 수 없습니다. 다른 플랜으로 변경하거나 수량을 업데이트하려면 먼저 구독을 재개해야 합니다.


### 구독 취소 {#canceling-subscriptions}

구독을 취소하려면, 사용자의 구독에서 `cancel` 메서드를 호출하세요:

```php
$user->subscription()->cancel();
```

구독이 취소되면, Cashier는 데이터베이스의 `ends_at` 컬럼을 자동으로 설정합니다. 이 컬럼은 `subscribed` 메서드가 언제부터 `false`를 반환해야 하는지 판단하는 데 사용됩니다. 예를 들어, 고객이 3월 1일에 구독을 취소했지만, 구독이 3월 5일에 종료될 예정이었다면, 3월 5일까지는 `subscribed` 메서드가 여전히 `true`를 반환합니다. 이는 일반적으로 고객이 결제 주기가 끝날 때까지 애플리케이션을 계속 사용할 수 있도록 허용하기 때문입니다.

사용자가 구독을 취소했지만 아직 "유예 기간"에 있는지 확인하려면, `onGracePeriod` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription()->onGracePeriod()) {
    // ...
}
```

즉시 구독을 취소하려면, 구독에서 `cancelNow` 메서드를 호출하세요:

```php
$user->subscription()->cancelNow();
```

유예 기간 중인 구독의 취소를 중단하려면, `stopCancelation` 메서드를 호출하세요:

```php
$user->subscription()->stopCancelation();
```

> [!WARNING]
> Paddle의 구독은 취소 후 재개할 수 없습니다. 고객이 구독을 재개하려면 새 구독을 생성해야 합니다.


## 구독 체험판 {#subscription-trials}


### 결제 수단 선입력과 함께 {#with-payment-method-up-front}

고객에게 체험판 기간을 제공하면서도 결제 수단 정보를 미리 수집하고 싶다면, Paddle 대시보드에서 고객이 구독할 가격에 체험 기간을 설정해야 합니다. 그런 다음, 평소처럼 체크아웃 세션을 시작하세요:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $checkout = $request->user()
        ->subscribe('pri_monthly')
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

애플리케이션이 `subscription_created` 이벤트를 수신하면, Cashier는 구독 레코드에 체험판 종료 날짜를 설정하고, Paddle에 해당 날짜 이후에 결제가 시작되도록 지시합니다.

> [!WARNING]
> 고객의 구독이 체험판 종료일 전에 취소되지 않으면, 체험판이 만료되는 즉시 결제가 이루어지므로, 반드시 사용자에게 체험판 종료일을 안내해야 합니다.

사용자가 체험판 기간 중인지 확인하려면, 사용자 인스턴스의 `onTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->onTrial()) {
    // ...
}
```

기존 체험판이 만료되었는지 확인하려면, `hasExpiredTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->hasExpiredTrial()) {
    // ...
}
```

특정 구독 타입에 대해 사용자가 체험판 중인지 확인하려면, `onTrial` 또는 `hasExpiredTrial` 메서드에 타입을 전달할 수 있습니다:

```php
if ($user->onTrial('default')) {
    // ...
}

if ($user->hasExpiredTrial('default')) {
    // ...
}
```


### 결제 수단 선입력 없이 {#without-payment-method-up-front}

결제 수단 정보를 미리 수집하지 않고 체험판 기간을 제공하려면, 사용자에 연결된 고객 레코드의 `trial_ends_at` 컬럼을 원하는 체험판 종료 날짜로 설정하면 됩니다. 일반적으로 회원가입 시에 설정합니다:

```php
use App\Models\User;

$user = User::create([
    // ...
]);

$user->createAsCustomer([
    'trial_ends_at' => now()->addDays(10)
]);
```

Cashier는 이 유형의 체험판을 "일반(generic) 체험판"이라고 부릅니다. 기존 구독에 연결되어 있지 않기 때문입니다. `User` 인스턴스의 `onTrial` 메서드는 현재 날짜가 `trial_ends_at` 값을 지나지 않았다면 `true`를 반환합니다:

```php
if ($user->onTrial()) {
    // 사용자가 체험판 기간 중입니다...
}
```

사용자에게 실제 구독을 생성할 준비가 되면, 평소처럼 `subscribe` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $checkout = $request->user()
        ->subscribe('pri_monthly')
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

사용자의 체험판 종료 날짜를 조회하려면, `trialEndsAt` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 체험판 중이면 Carbon 날짜 인스턴스를, 아니면 `null`을 반환합니다. 기본 구독이 아닌 특정 구독의 체험판 종료 날짜를 얻으려면, 선택적으로 구독 타입 파라미터를 전달할 수 있습니다:

```php
if ($user->onTrial('default')) {
    $trialEndsAt = $user->trialEndsAt();
}
```

아직 실제 구독을 생성하지 않은 "일반" 체험판 기간 중인지 확인하려면, `onGenericTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->onGenericTrial()) {
    // 사용자가 "일반" 체험판 기간 중입니다...
}
```


### 체험판 연장 또는 활성화 {#extend-or-activate-a-trial}

기존 구독의 체험판 기간을 연장하려면, `extendTrial` 메서드를 호출하고 체험판 종료 시점을 지정하세요:

```php
$user->subscription()->extendTrial(now()->addDays(5));
```

또는, 구독의 체험판을 즉시 종료하고 구독을 활성화하려면, 구독에서 `activate` 메서드를 호출하세요:

```php
$user->subscription()->activate();
```


## Paddle 웹훅 처리 {#handling-paddle-webhooks}

Paddle은 다양한 이벤트를 웹훅을 통해 애플리케이션에 알릴 수 있습니다. 기본적으로, Cashier 서비스 프로바이더는 Cashier의 웹훅 컨트롤러로 연결되는 라우트를 등록합니다. 이 컨트롤러는 모든 들어오는 웹훅 요청을 처리합니다.

기본적으로 이 컨트롤러는 결제 실패로 인한 구독 취소, 구독 업데이트, 결제 수단 변경 등 일반적인 Paddle 웹훅을 자동으로 처리합니다. 하지만, 필요하다면 이 컨트롤러를 확장하여 원하는 Paddle 웹훅 이벤트를 처리할 수 있습니다.

애플리케이션이 Paddle 웹훅을 처리할 수 있도록, 반드시 [Paddle 관리 패널에서 웹훅 URL을 설정](https://vendors.paddle.com/alerts-webhooks)해야 합니다. 기본적으로 Cashier의 웹훅 컨트롤러는 `/paddle/webhook` URL 경로에 응답합니다. Paddle 관리 패널에서 활성화해야 할 모든 웹훅 목록은 다음과 같습니다:

- Customer Updated
- Transaction Completed
- Transaction Updated
- Subscription Created
- Subscription Updated
- Subscription Paused
- Subscription Canceled

> [!WARNING]
> 들어오는 요청을 Cashier에 포함된 [웹훅 서명 검증](/laravel/12.x/cashier-paddle#verifying-webhook-signatures) 미들웨어로 보호해야 합니다.


#### 웹훅과 CSRF 보호 {#webhooks-csrf-protection}

Paddle 웹훅은 Laravel의 [CSRF 보호](/laravel/12.x/csrf)를 우회해야 하므로, Laravel이 Paddle 웹훅에 대해 CSRF 토큰을 검증하지 않도록 해야 합니다. 이를 위해, 애플리케이션의 `bootstrap/app.php` 파일에서 `paddle/*`을 CSRF 보호에서 제외하세요:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'paddle/*',
    ]);
})
```


#### 웹훅과 로컬 개발 {#webhooks-local-development}

로컬 개발 중에 Paddle이 애플리케이션에 웹훅을 전송할 수 있도록 하려면, [Ngrok](https://ngrok.com/)이나 [Expose](https://expose.dev/docs/introduction)와 같은 사이트 공유 서비스를 통해 애플리케이션을 외부에 노출해야 합니다. [Laravel Sail](/laravel/12.x/sail)로 로컬 개발 중이라면, Sail의 [사이트 공유 명령어](/laravel/12.x/sail#sharing-your-site)를 사용할 수 있습니다.


### 웹훅 이벤트 핸들러 정의 {#defining-webhook-event-handlers}

Cashier는 결제 실패 시 구독 취소 등 일반적인 Paddle 웹훅을 자동으로 처리합니다. 하지만 추가로 처리하고 싶은 웹훅 이벤트가 있다면, Cashier가 발생시키는 다음 이벤트를 수신하여 처리할 수 있습니다:

- `Laravel\Paddle\Events\WebhookReceived`
- `Laravel\Paddle\Events\WebhookHandled`

두 이벤트 모두 Paddle 웹훅의 전체 페이로드를 포함합니다. 예를 들어, `transaction.billed` 웹훅을 처리하고 싶다면, [리스너](/laravel/12.x/events#defining-listeners)를 등록하여 이벤트를 처리할 수 있습니다:

```php
<?php

namespace App\Listeners;

use Laravel\Paddle\Events\WebhookReceived;

class PaddleEventListener
{
    /**
     * Handle received Paddle webhooks.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['event_type'] === 'transaction.billed') {
            // 들어오는 이벤트 처리...
        }
    }
}
```

Cashier는 수신된 웹훅의 타입에 따라 전용 이벤트도 발생시킵니다. Paddle에서 받은 전체 페이로드 외에도, 청구 가능 모델, 구독, 영수증 등 웹훅 처리에 사용된 관련 모델도 포함합니다:

<div class="content-list" markdown="1">

- `Laravel\Paddle\Events\CustomerUpdated`
- `Laravel\Paddle\Events\TransactionCompleted`
- `Laravel\Paddle\Events\TransactionUpdated`
- `Laravel\Paddle\Events\SubscriptionCreated`
- `Laravel\Paddle\Events\SubscriptionUpdated`
- `Laravel\Paddle\Events\SubscriptionPaused`
- `Laravel\Paddle\Events\SubscriptionCanceled`

</div>

기본 내장 웹훅 라우트를 오버라이드하려면, 애플리케이션의 `.env` 파일에 `CASHIER_WEBHOOK` 환경 변수를 정의하세요. 이 값은 웹훅 라우트의 전체 URL이어야 하며, Paddle 관리 패널에 설정된 URL과 일치해야 합니다:

```ini
CASHIER_WEBHOOK=https://example.com/my-paddle-webhook-url
```


### 웹훅 서명 검증 {#verifying-webhook-signatures}

웹훅을 안전하게 보호하려면, [Paddle의 웹훅 서명](https://developer.paddle.com/webhook-reference/verifying-webhooks)을 사용할 수 있습니다. Cashier는 Paddle 웹훅 요청이 유효한지 검증하는 미들웨어를 자동으로 포함합니다.

웹훅 검증을 활성화하려면, 애플리케이션의 `.env` 파일에 `PADDLE_WEBHOOK_SECRET` 환경 변수가 정의되어 있는지 확인하세요. 웹훅 시크릿은 Paddle 계정 대시보드에서 확인할 수 있습니다.


## 단일 청구 {#single-charges}


### 상품 청구 {#charging-for-products}

고객에게 상품 구매를 시작하려면, 청구 가능 모델 인스턴스의 `checkout` 메서드를 사용하여 구매를 위한 체크아웃 세션을 생성할 수 있습니다. `checkout` 메서드는 하나 이상의 가격 ID를 받습니다. 필요하다면, 구매할 상품의 수량을 연관 배열로 제공할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $request->user()->checkout(['pri_tshirt', 'pri_socks' => 5]);

    return view('buy', ['checkout' => $checkout]);
});
```

체크아웃 세션을 생성한 후, Cashier가 제공하는 `paddle-button` [Blade 컴포넌트](#overlay-checkout)를 사용하여 사용자가 Paddle 체크아웃 위젯을 보고 구매를 완료할 수 있도록 할 수 있습니다:

```blade
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Buy
</x-paddle-button>
```

체크아웃 세션에는 `customData` 메서드가 있어, 원하는 커스텀 데이터를 거래 생성에 전달할 수 있습니다. 커스텀 데이터 전달 시 사용 가능한 옵션에 대한 자세한 내용은 [Paddle 문서](https://developer.paddle.com/build/transactions/custom-data)를 참고하세요:

```php
$checkout = $user->checkout('pri_tshirt')
    ->customData([
        'custom_option' => $value,
    ]);
```


### 거래 환불 {#refunding-transactions}

거래 환불은 구매 시 사용된 고객의 결제 수단으로 환불 금액을 반환합니다. Paddle 구매를 환불해야 한다면, `Cashier\Paddle\Transaction` 모델의 `refund` 메서드를 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 사유, 두 번째 인자로 환불할 하나 이상의 가격 ID(선택적으로 금액 포함)를 연관 배열로 받습니다. 청구 가능 모델의 거래는 `transactions` 메서드로 조회할 수 있습니다.

예를 들어, `pri_123`과 `pri_456` 가격이 포함된 특정 거래를 환불한다고 가정해봅시다. `pri_123`은 전액 환불, `pri_456`은 2달러만 환불합니다:

```php
use App\Models\User;

$user = User::find(1);

$transaction = $user->transactions()->first();

$response = $transaction->refund('Accidental charge', [
    'pri_123', // 이 가격은 전액 환불...
    'pri_456' => 200, // 이 가격은 일부(200)만 환불...
]);
```

위 예시는 거래의 특정 항목만 환불합니다. 전체 거래를 환불하려면, 사유만 전달하면 됩니다:

```php
$response = $transaction->refund('Accidental charge');
```

환불에 대한 자세한 내용은 [Paddle의 환불 문서](https://developer.paddle.com/build/transactions/create-transaction-adjustments)를 참고하세요.

> [!WARNING]
> 환불은 항상 Paddle의 승인을 받아야 최종적으로 처리됩니다.


### 거래 크레딧 지급 {#crediting-transactions}

환불과 마찬가지로, 거래에 크레딧을 지급할 수도 있습니다. 거래에 크레딧을 지급하면, 해당 금액이 고객의 잔액에 추가되어 향후 구매에 사용할 수 있습니다. 크레딧 지급은 수동으로 수금된 거래에만 가능하며, 자동으로 수금된 거래(구독 등)에는 적용되지 않습니다. Paddle은 구독 크레딧을 자동으로 처리합니다:

```php
$transaction = $user->transactions()->first();

// 특정 항목에 전액 크레딧 지급...
$response = $transaction->credit('Compensation', 'pri_123');
```

자세한 내용은 [Paddle의 크레딧 지급 문서](https://developer.paddle.com/build/transactions/create-transaction-adjustments)를 참고하세요.

> [!WARNING]
> 크레딧은 수동으로 수금된 거래에만 적용할 수 있습니다. 자동으로 수금된 거래는 Paddle이 직접 크레딧을 지급합니다.


## 거래 {#transactions}

청구 가능 모델의 거래 배열을 `transactions` 프로퍼티로 쉽게 조회할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$transactions = $user->transactions;
```

거래는 상품 및 구매에 대한 결제를 나타내며, 인보이스가 함께 제공됩니다. 완료된 거래만 애플리케이션 데이터베이스에 저장됩니다.

고객의 거래를 나열할 때, 거래 인스턴스의 메서드를 사용하여 관련 결제 정보를 표시할 수 있습니다. 예를 들어, 모든 거래를 테이블로 나열하여 사용자가 인보이스를 쉽게 다운로드할 수 있도록 할 수 있습니다:

```html
<table>
    @foreach ($transactions as $transaction)
        <tr>
            <td>{{ $transaction->billed_at->toFormattedDateString() }}</td>
            <td>{{ $transaction->total() }}</td>
            <td>{{ $transaction->tax() }}</td>
            <td><a href="{{ route('download-invoice', $transaction->id) }}" target="_blank">Download</a></td>
        </tr>
    @endforeach
</table>
```

`download-invoice` 라우트는 다음과 같이 구현할 수 있습니다:

```php
use Illuminate\Http\Request;
use Laravel\Paddle\Transaction;

Route::get('/download-invoice/{transaction}', function (Request $request, Transaction $transaction) {
    return $transaction->redirectToInvoicePdf();
})->name('download-invoice');
```


### 과거 및 예정된 결제 {#past-and-upcoming-payments}

`lastPayment` 및 `nextPayment` 메서드를 사용하여 반복 구독의 과거 또는 예정된 결제를 조회하고 표시할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$subscription = $user->subscription();

$lastPayment = $subscription->lastPayment();
$nextPayment = $subscription->nextPayment();
```

이 두 메서드는 모두 `Laravel\Paddle\Payment` 인스턴스를 반환합니다. 단, `lastPayment`는 거래가 아직 웹훅으로 동기화되지 않았다면 `null`을 반환하고, `nextPayment`는 결제 주기가 종료된 경우(예: 구독이 취소된 경우) `null`을 반환합니다:

```blade
Next payment: {{ $nextPayment->amount() }} due on {{ $nextPayment->date()->format('d/m/Y') }}
```


## 테스트 {#testing}

테스트 시에는 결제 플로우를 수동으로 테스트하여 통합이 예상대로 동작하는지 확인해야 합니다.

CI 환경 등에서 자동화된 테스트를 실행할 때는, [Laravel의 HTTP 클라이언트](/laravel/12.x/http-client#testing)를 사용하여 Paddle로의 HTTP 호출을 페이크할 수 있습니다. 실제 Paddle의 응답을 테스트하지는 않지만, Paddle API를 실제로 호출하지 않고도 애플리케이션을 테스트할 수 있습니다.
