# [패키지] Laravel Cashier (Paddle)




















































## 소개 {#introduction}

> [!WARNING]
> 이 문서는 Paddle Billing과 통합된 Cashier Paddle 2.x에 대한 문서입니다. 아직 Paddle Classic을 사용 중이라면 [Cashier Paddle 1.x](https://github.com/laravel/cashier-paddle/tree/1.x)를 사용해야 합니다.

[Laravel Cashier Paddle](https://github.com/laravel/cashier-paddle)은 [Paddle](https://paddle.com)의 구독 결제 서비스를 위한 표현력 있고 유연한 인터페이스를 제공합니다. 이 패키지는 여러분이 번거롭게 느끼는 거의 모든 구독 결제 관련 보일러플레이트 코드를 처리해줍니다. 기본적인 구독 관리 외에도, Cashier는 구독 변경, 구독 "수량", 구독 일시정지, 취소 유예 기간 등 다양한 기능을 지원합니다.

Cashier Paddle을 본격적으로 사용하기 전에, Paddle의 [개념 가이드](https://developer.paddle.com/concepts/overview)와 [API 문서](https://developer.paddle.com/api-reference/overview)도 함께 참고하시길 권장합니다.


## Cashier 업그레이드 {#upgrading-cashier}

Cashier의 새 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/cashier-paddle/blob/master/UPGRADE.md)를 꼼꼼히 확인하는 것이 중요합니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 사용하여 Paddle용 Cashier 패키지를 설치하세요:

```shell
composer require laravel/cashier-paddle
```

다음으로, `vendor:publish` Artisan 명령어를 사용하여 Cashier 마이그레이션 파일을 퍼블리시해야 합니다:

```shell
php artisan vendor:publish --tag="cashier-migrations"
```

그런 다음, 애플리케이션의 데이터베이스 마이그레이션을 실행해야 합니다. Cashier 마이그레이션은 새로운 `customers` 테이블을 생성합니다. 또한, 모든 고객의 구독 정보를 저장하기 위해 새로운 `subscriptions` 및 `subscription_items` 테이블이 생성됩니다. 마지막으로, 고객과 연관된 모든 Paddle 거래를 저장하기 위한 새로운 `transactions` 테이블이 생성됩니다:

```shell
php artisan migrate
```

> [!WARNING]
> Cashier가 모든 Paddle 이벤트를 올바르게 처리할 수 있도록, 반드시 [Cashier의 웹훅 처리 설정](#handling-paddle-webhooks)을 잊지 마세요.


### Paddle 샌드박스 {#paddle-sandbox}

로컬 및 스테이징 개발 중에는 [Paddle 샌드박스 계정](https://sandbox-login.paddle.com/signup)을 등록해야 합니다. 이 계정은 실제 결제 없이 애플리케이션을 테스트하고 개발할 수 있는 샌드박스 환경을 제공합니다. Paddle의 [테스트 카드 번호](https://developer.paddle.com/concepts/payment-methods/credit-debit-card)를 사용하여 다양한 결제 시나리오를 시뮬레이션할 수 있습니다.

Paddle 샌드박스 환경을 사용할 때는 애플리케이션의 `.env` 파일에서 `PADDLE_SANDBOX` 환경 변수를 `true`로 설정해야 합니다:

```ini
PADDLE_SANDBOX=true
```

애플리케이션 개발을 마친 후에는 [Paddle 벤더 계정](https://paddle.com)을 신청할 수 있습니다. 애플리케이션이 프로덕션에 배포되기 전에 Paddle에서 애플리케이션의 도메인을 승인해야 합니다.


## 설정 {#configuration}


### 과금 가능한 모델 {#billable-model}

Cashier를 사용하기 전에, 사용자 모델 정의에 `Billable` 트레이트를 추가해야 합니다. 이 트레이트는 구독 생성, 결제 수단 정보 업데이트 등 일반적인 과금 작업을 수행할 수 있는 다양한 메서드를 제공합니다:

```php
use Laravel\Paddle\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

사용자가 아닌 과금 가능한 엔티티가 있다면, 해당 클래스에도 이 트레이트를 추가할 수 있습니다:

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

`PADDLE_SANDBOX` 환경 변수는 [Paddle의 Sandbox 환경](#paddle-sandbox)을 사용할 때 `true`로 설정해야 합니다. 애플리케이션을 프로덕션에 배포하고 Paddle의 라이브 벤더 환경을 사용할 경우에는 `PADDLE_SANDBOX` 변수를 `false`로 설정해야 합니다.

`PADDLE_RETAIN_KEY`는 선택 사항이며, Paddle을 [Retain](https://developer.paddle.com/paddlejs/retain)과 함께 사용할 때만 설정해야 합니다.


### Paddle JS {#paddle-js}

Paddle은 Paddle 결제 위젯을 실행하기 위해 자체 JavaScript 라이브러리에 의존합니다. JavaScript 라이브러리는 애플리케이션 레이아웃의 닫는 `</head>` 태그 바로 앞에 `@paddleJS` Blade 디렉티브를 추가하여 불러올 수 있습니다:

```blade
<head>
    ...

    @paddleJS
</head>
```


### 통화 설정 {#currency-configuration}

인보이스에 표시할 금액 값을 포맷할 때 사용할 로케일을 지정할 수 있습니다. 내부적으로 Cashier는 [PHP의 `NumberFormatter` 클래스](https://www.php.net/manual/en/class.numberformatter.php)를 사용하여 통화 로케일을 설정합니다:

```ini
CASHIER_CURRENCY_LOCALE=nl_BE
```

> [!WARNING]
> `en` 이외의 로케일을 사용하려면, 서버에 `ext-intl` PHP 확장 프로그램이 설치되고 설정되어 있는지 확인해야 합니다.


### 기본 모델 오버라이드 {#overriding-default-models}

Cashier에서 내부적으로 사용하는 모델을 확장하여 직접 정의한 모델을 사용할 수 있습니다. 이를 위해 해당 Cashier 모델을 상속받아 자신만의 모델을 정의하면 됩니다:

```php
use Laravel\Paddle\Subscription as CashierSubscription;

class Subscription extends CashierSubscription
{
    // ...
}
```

모델을 정의한 후에는 `Laravel\Paddle\Cashier` 클래스를 통해 Cashier가 커스텀 모델을 사용하도록 지정할 수 있습니다. 일반적으로, 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메소드에서 Cashier에 커스텀 모델을 알려주면 됩니다:

```php
use App\Models\Cashier\Subscription;
use App\Models\Cashier\Transaction;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
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
> Paddle Checkout을 사용하기 전에, Paddle 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한, [Paddle의 웹훅 처리](#handling-paddle-webhooks)를 구성해야 합니다.

애플리케이션을 통해 상품 및 구독 결제를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Paddle의 Checkout Overlay](https://www.paddle.com/billing/checkout) 덕분에, 쉽고 견고한 결제 통합을 구축할 수 있습니다.

비정기적이고 단일 결제 상품에 대해 고객에게 요금을 청구하려면, Cashier를 사용하여 Paddle의 Checkout Overlay로 고객에게 결제를 진행하게 할 수 있습니다. 이 오버레이에서 고객은 결제 정보를 입력하고 구매를 확정합니다. 결제가 완료되면, 고객은 애플리케이션 내에서 원하는 성공 URL로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $request->user()->checkout('pri_deluxe_album')
        ->returnTo(route('dashboard'));

    return view('buy', ['checkout' => $checkout]);
})->name('checkout');
```

위 예시에서 볼 수 있듯이, Cashier에서 제공하는 `checkout` 메서드를 사용하여 고객에게 특정 "가격 식별자"에 대한 Paddle Checkout Overlay를 보여줄 checkout 객체를 생성합니다. Paddle을 사용할 때 "가격"은 [특정 상품에 대해 정의된 가격](https://developer.paddle.com/build/products/create-products-prices)을 의미합니다.

필요하다면, `checkout` 메서드는 Paddle에 고객을 자동으로 생성하고, 해당 Paddle 고객 레코드를 애플리케이션 데이터베이스의 사용자와 연결합니다. 결제 세션이 완료되면, 고객은 전용 성공 페이지로 리디렉션되어 안내 메시지를 볼 수 있습니다.

`buy` 뷰에서는 Checkout Overlay를 표시하는 버튼을 포함합니다. `paddle-button` Blade 컴포넌트는 Cashier Paddle에 포함되어 있지만, [오버레이 체크아웃을 수동으로 렌더링](#manually-rendering-an-overlay-checkout)할 수도 있습니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    상품 구매
</x-paddle-button>
```


#### Paddle Checkout에 메타데이터 제공하기 {#providing-meta-data-to-paddle-checkout}

제품을 판매할 때, 일반적으로 애플리케이션에서 정의한 `Cart`와 `Order` 모델을 통해 완료된 주문과 구매된 상품을 추적합니다. 고객이 결제를 완료하기 위해 Paddle의 Checkout Overlay로 리디렉션될 때, 기존 주문 식별자를 제공하여 결제 완료 후 고객이 애플리케이션으로 돌아올 때 해당 주문과 결제 내역을 연결해야 할 수 있습니다.

이를 위해, `checkout` 메서드에 커스텀 데이터 배열을 전달할 수 있습니다. 사용자가 결제 과정을 시작할 때 애플리케이션 내에서 보류 중인 `Order`가 생성된다고 가정해봅시다. 참고로, 이 예제의 `Cart`와 `Order` 모델은 설명을 위한 것이며 Cashier에서 제공하지 않습니다. 애플리케이션의 필요에 따라 자유롭게 이러한 개념을 구현할 수 있습니다:

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

위 예제에서 볼 수 있듯이, 사용자가 결제 과정을 시작하면 장바구니/주문에 연결된 모든 Paddle 가격 식별자를 `checkout` 메서드에 전달합니다. 물론, 고객이 상품을 추가할 때 이러한 항목을 "장바구니" 또는 주문과 연결하는 것은 애플리케이션의 책임입니다. 또한, `customData` 메서드를 통해 주문의 ID를 Paddle Checkout Overlay에 전달합니다.

물론, 고객이 결제 과정을 마치면 해당 주문을 "완료"로 표시하고 싶을 것입니다. 이를 위해, Paddle에서 전송하는 웹훅을 Cashier가 이벤트로 발생시킬 때 이를 수신하여 주문 정보를 데이터베이스에 저장할 수 있습니다.

먼저, Cashier에서 발생시키는 `TransactionCompleted` 이벤트를 수신하세요. 일반적으로 이 이벤트 리스너는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 등록해야 합니다:

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

이 예제에서, `CompleteOrder` 리스너는 다음과 같이 구현할 수 있습니다:

```php
namespace App\Listeners;

use App\Models\Order;
use Laravel\Paddle\Cashier;
use Laravel\Paddle\Events\TransactionCompleted;

class CompleteOrder
{
    /**
     * 들어오는 Cashier 웹훅 이벤트를 처리합니다.
     */
    public function handle(TransactionCompleted $event): void
    {
        $orderId = $event->payload['data']['custom_data']['order_id'] ?? null;

        $order = Order::findOrFail($orderId);

        $order->update(['status' => 'completed']);
    }
}
```

`transaction.completed` 이벤트에 포함된 데이터에 대한 자세한 내용은 Paddle의 [공식 문서](https://developer.paddle.com/webhooks/transactions/transaction-completed)를 참고하세요.


### 구독 판매하기 {#quickstart-selling-subscriptions}

> [!NOTE]
> Paddle Checkout을 사용하기 전에, Paddle 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한, [Paddle의 웹훅 처리](#handling-paddle-webhooks)를 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 결제를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Paddle의 Checkout Overlay](https://www.paddle.com/billing/checkout) 덕분에, 현대적이고 견고한 결제 통합을 쉽게 구축할 수 있습니다.

Cashier와 Paddle의 Checkout Overlay를 사용하여 구독을 판매하는 방법을 알아보기 위해, 기본 월간(`price_basic_monthly`) 및 연간(`price_basic_yearly`) 요금제가 있는 구독 서비스의 간단한 시나리오를 살펴보겠습니다. 이 두 가격은 Paddle 대시보드의 "Basic" 상품(`pro_basic`) 아래에 그룹화할 수 있습니다. 또한, 구독 서비스는 `pro_expert`라는 Expert 요금제를 제공할 수도 있습니다.

먼저, 고객이 어떻게 우리 서비스에 구독할 수 있는지 알아보겠습니다. 물론, 고객이 애플리케이션의 요금제 페이지에서 Basic 요금제의 "구독" 버튼을 클릭한다고 상상할 수 있습니다. 이 버튼은 선택한 요금제에 대한 Paddle Checkout Overlay를 호출합니다. 시작하려면, `checkout` 메서드를 통해 체크아웃 세션을 시작해봅시다:

```php
use Illuminate\Http\Request;

Route::get('/subscribe', function (Request $request) {
    $checkout = $request->user()->checkout('price_basic_monthly')
        ->returnTo(route('dashboard'));

    return view('subscribe', ['checkout' => $checkout]);
})->name('subscribe');
```

`subscribe` 뷰에서는 Checkout Overlay를 표시하는 버튼을 포함할 것입니다. `paddle-button` Blade 컴포넌트는 Cashier Paddle에 포함되어 있지만, [오버레이 체크아웃을 수동으로 렌더링](#manually-rendering-an-overlay-checkout)할 수도 있습니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Subscribe
</x-paddle-button>
```

이제 구독 버튼을 클릭하면, 고객은 결제 정보를 입력하고 구독을 시작할 수 있습니다. 실제로 구독이 시작된 시점을 알기 위해(일부 결제 수단은 처리에 몇 초가 걸릴 수 있으므로), [Cashier의 웹훅 처리](#handling-paddle-webhooks)도 설정해야 합니다.

이제 고객이 구독을 시작할 수 있게 되었으니, 애플리케이션의 특정 부분을 구독한 사용자만 접근할 수 있도록 제한해야 합니다. 물론, Cashier의 `Billable` 트레이트에서 제공하는 `subscribed` 메서드를 통해 사용자의 현재 구독 상태를 항상 확인할 수 있습니다:

```blade
@if ($user->subscribed())
    <p>구독 중입니다.</p>
@endif
```

특정 상품이나 가격에 사용자가 구독 중인지도 쉽게 확인할 수 있습니다:

```blade
@if ($user->subscribedToProduct('pro_basic'))
    <p>Basic 상품에 구독 중입니다.</p>
@endif

@if ($user->subscribedToPrice('price_basic_monthly'))
    <p>월간 Basic 요금제에 구독 중입니다.</p>
@endif
```


#### 구독자 미들웨어 만들기 {#quickstart-building-a-subscribed-middleware}

편의를 위해, 들어오는 요청이 구독한 사용자에게서 온 것인지 확인하는 [미들웨어](/laravel/12.x/middleware)를 생성할 수 있습니다. 이 미들웨어가 정의되면, 구독하지 않은 사용자가 해당 라우트에 접근하지 못하도록 라우트에 쉽게 할당할 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Subscribed
{
    /**
     * 들어오는 요청을 처리합니다.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->subscribed()) {
            // 사용자를 결제 페이지로 리디렉션하고 구독을 요청합니다...
            return redirect('/subscribe');
        }

        return $next($request);
    }
}
```

미들웨어가 정의되면, 이를 라우트에 할당할 수 있습니다:

```php
use App\Http\Middleware\Subscribed;

Route::get('/dashboard', function () {
    // ...
})->middleware([Subscribed::class]);
```


#### 고객이 결제 플랜을 관리할 수 있도록 허용하기 {#quickstart-allowing-customers-to-manage-their-billing-plan}

물론, 고객은 자신의 구독 플랜을 다른 상품이나 "티어"로 변경하고 싶어할 수 있습니다. 위의 예시에서처럼, 고객이 월간 구독에서 연간 구독으로 플랜을 변경할 수 있도록 허용하고자 합니다. 이를 위해서는 아래의 라우트로 연결되는 버튼과 같은 기능을 구현해야 합니다:

```php
use Illuminate\Http\Request;

Route::put('/subscription/{price}/swap', function (Request $request, $price) {
    $user->subscription()->swap($price); // 이 예시에서는 "$price"가 "price_basic_yearly"가 됩니다.

    return redirect()->route('dashboard');
})->name('subscription.swap');
```

플랜 변경 외에도 고객이 구독을 취소할 수 있도록 해야 합니다. 플랜 변경과 마찬가지로, 아래의 라우트로 연결되는 버튼을 제공하세요:

```php
use Illuminate\Http\Request;

Route::put('/subscription/cancel', function (Request $request, $price) {
    $user->subscription()->cancel();

    return redirect()->route('dashboard');
})->name('subscription.cancel');
```

이제 구독은 결제 기간이 끝날 때 자동으로 취소됩니다.

> [!NOTE]
> Cashier의 웹훅 처리가 정상적으로 구성되어 있다면, Cashier는 Paddle에서 들어오는 웹훅을 검사하여 애플리케이션의 Cashier 관련 데이터베이스 테이블을 자동으로 동기화합니다. 예를 들어, Paddle의 대시보드에서 고객의 구독을 취소하면, Cashier는 해당 웹훅을 받아 애플리케이션 데이터베이스에서 해당 구독을 "취소됨"으로 표시합니다.


## 체크아웃 세션 {#checkout-sessions}

대부분의 고객 청구 작업은 Paddle의 [Checkout Overlay 위젯](https://developer.paddle.com/build/checkout/build-overlay-checkout)을 사용하거나 [인라인 체크아웃](https://developer.paddle.com/build/checkout/build-branded-inline-checkout)을 활용하여 "체크아웃"을 통해 수행됩니다.

Paddle을 사용하여 체크아웃 결제를 처리하기 전에, Paddle 체크아웃 설정 대시보드에서 애플리케이션의 [기본 결제 링크](https://developer.paddle.com/build/transactions/default-payment-link#set-default-link)를 정의해야 합니다.


### 오버레이 체크아웃 {#overlay-checkout}

체크아웃 오버레이 위젯을 표시하기 전에 Cashier를 사용하여 체크아웃 세션을 생성해야 합니다. 체크아웃 세션은 체크아웃 위젯에 어떤 결제 작업이 수행되어야 하는지 알려줍니다:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

Cashier에는 `paddle-button` [Blade 컴포넌트](/laravel/12.x/blade#components)가 포함되어 있습니다. 이 컴포넌트에 체크아웃 세션을 "prop"으로 전달할 수 있습니다. 그런 다음 이 버튼을 클릭하면 Paddle의 체크아웃 위젯이 표시됩니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Subscribe
</x-paddle-button>
```

기본적으로 Paddle의 기본 스타일을 사용하여 위젯이 표시됩니다. [Paddle에서 지원하는 속성](https://developer.paddle.com/paddlejs/html-data-attributes)인 `data-theme='light'` 속성처럼, 컴포넌트에 속성을 추가하여 위젯을 커스터마이즈할 수 있습니다:

```html
<x-paddle-button :checkout="$checkout" class="px-8 py-4" data-theme="light">
    Subscribe
</x-paddle-button>
```

Paddle 체크아웃 위젯은 비동기적으로 동작합니다. 사용자가 위젯 내에서 구독을 생성하면, Paddle은 웹훅을 통해 애플리케이션에 알림을 보내어 데이터베이스의 구독 상태를 올바르게 업데이트할 수 있도록 합니다. 따라서 Paddle에서 상태 변경이 발생할 때를 대비해 [웹훅을 올바르게 설정](#handling-paddle-webhooks)하는 것이 중요합니다.

> [!WARNING]
> 구독 상태가 변경된 후, 해당 웹훅을 수신하는 데 걸리는 지연 시간은 일반적으로 매우 짧지만, 사용자가 체크아웃을 완료한 직후 구독이 즉시 활성화되지 않을 수 있음을 애플리케이션에서 고려해야 합니다.


#### 오버레이 체크아웃 수동 렌더링 {#manually-rendering-an-overlay-checkout}

Laravel의 내장 Blade 컴포넌트를 사용하지 않고도 오버레이 체크아웃을 수동으로 렌더링할 수 있습니다. 시작하려면, [이전 예제에서 설명한 것처럼](#overlay-checkout) 체크아웃 세션을 생성하세요:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

다음으로, Paddle.js를 사용하여 체크아웃을 초기화할 수 있습니다. 이 예제에서는 `paddle_button` 클래스를 할당한 링크를 생성합니다. Paddle.js는 이 클래스를 감지하여 링크를 클릭할 때 오버레이 체크아웃을 표시합니다:

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
    상품 구매
</a>
```


### 인라인 체크아웃 {#inline-checkout}

Paddle의 "오버레이" 스타일 체크아웃 위젯을 사용하고 싶지 않다면, Paddle은 위젯을 인라인으로 표시할 수 있는 옵션도 제공합니다. 이 방식은 체크아웃의 HTML 필드를 조정할 수는 없지만, 위젯을 애플리케이션 내에 직접 임베드할 수 있습니다.

인라인 체크아웃을 쉽게 시작할 수 있도록 Cashier는 `paddle-checkout` Blade 컴포넌트를 제공합니다. 시작하려면 [체크아웃 세션을 생성](#overlay-checkout)해야 합니다:

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

인라인 체크아웃 컴포넌트의 높이를 조정하려면, Blade 컴포넌트에 `height` 속성을 전달할 수 있습니다:

```blade
<x-paddle-checkout :checkout="$checkout" class="w-full" height="500" />
```

인라인 체크아웃의 커스터마이징 옵션에 대한 자세한 내용은 Paddle의 [인라인 체크아웃 가이드](https://developer.paddle.com/build/checkout/build-branded-inline-checkout)와 [사용 가능한 체크아웃 설정](https://developer.paddle.com/build/checkout/set-up-checkout-default-settings)을 참고하세요.


#### 인라인 체크아웃을 수동으로 렌더링하기 {#manually-rendering-an-inline-checkout}

Laravel의 내장 Blade 컴포넌트를 사용하지 않고도 인라인 체크아웃을 수동으로 렌더링할 수 있습니다. 시작하려면, [이전 예제에서 설명한 것처럼](#inline-checkout) 체크아웃 세션을 생성하세요:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $user->checkout('pri_34567')
        ->returnTo(route('dashboard'));

    return view('billing', ['checkout' => $checkout]);
});
```

다음으로, Paddle.js를 사용하여 체크아웃을 초기화할 수 있습니다. 이 예제에서는 [Alpine.js](https://github.com/alpinejs/alpine)를 사용하여 이를 시연하지만, 여러분의 프론트엔드 스택에 맞게 자유롭게 수정할 수 있습니다:

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


### 비회원 결제 {#guest-checkouts}

때때로, 애플리케이션에 계정이 필요하지 않은 사용자들을 위해 결제 세션을 생성해야 할 수도 있습니다. 이럴 때는 `guest` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;
use Laravel\Paddle\Checkout;

Route::get('/buy', function (Request $request) {
    $checkout = Checkout::guest(['pri_34567'])
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

그런 다음, 생성된 결제 세션을 [Paddle 버튼](#overlay-checkout) 또는 [인라인 결제](#inline-checkout) Blade 컴포넌트에 제공할 수 있습니다.


## 가격 미리보기 {#price-previews}

Paddle은 통화별로 가격을 맞춤 설정할 수 있도록 하여, 국가마다 다른 가격을 설정할 수 있습니다. Cashier Paddle을 사용하면 `previewPrices` 메서드를 통해 이러한 모든 가격을 조회할 수 있습니다. 이 메서드는 가격을 조회하고자 하는 가격 ID 배열을 인자로 받습니다:

```php
use Laravel\Paddle\Cashier;

$prices = Cashier::previewPrices(['pri_123', 'pri_456']);
```

통화는 요청의 IP 주소를 기반으로 결정되지만, 선택적으로 특정 국가를 지정하여 해당 국가의 가격을 조회할 수도 있습니다:

```php
use Laravel\Paddle\Cashier;

$prices = Cashier::previewPrices(['pri_123', 'pri_456'], ['address' => [
    'country_code' => 'BE',
    'postal_code' => '1234',
]]);
```

가격을 조회한 후에는 원하는 방식으로 가격을 표시할 수 있습니다:

```blade
<ul>
    @foreach ($prices as $price)
        <li>{{ $price->product['name'] }} - {{ $price->total() }}</li>
    @endforeach
</ul>
```

또한, 소계 가격과 세금 금액을 별도로 표시할 수도 있습니다:

```blade
<ul>
    @foreach ($prices as $price)
        <li>{{ $price->product['name'] }} - {{ $price->subtotal() }} (+ {{ $price->tax() }} 세금)</li>
    @endforeach
</ul>
```

자세한 내용은 [Paddle의 가격 미리보기 API 문서](https://developer.paddle.com/api-reference/pricing-preview/preview-prices)를 참고하세요.


### 고객 가격 미리보기 {#customer-price-previews}

사용자가 이미 고객인 경우, 해당 고객에게 적용되는 가격을 표시하고 싶다면 고객 인스턴스에서 직접 가격을 조회할 수 있습니다:

```php
use App\Models\User;

$prices = User::find(1)->previewPrices(['pri_123', 'pri_456']);
```

내부적으로 Cashier는 사용자의 고객 ID를 사용하여 해당 통화로 가격을 조회합니다. 예를 들어, 미국에 거주하는 사용자는 미국 달러로 가격을 보게 되고, 벨기에에 거주하는 사용자는 유로로 가격을 보게 됩니다. 일치하는 통화를 찾을 수 없는 경우, 상품의 기본 통화가 사용됩니다. Paddle 관리 패널에서 상품 또는 구독 플랜의 모든 가격을 커스터마이즈할 수 있습니다.


### 할인 {#price-discounts}

할인 적용 후의 가격을 표시하도록 선택할 수도 있습니다. `previewPrices` 메서드를 호출할 때, `discount_id` 옵션을 통해 할인 ID를 전달합니다:

```php
use Laravel\Paddle\Cashier;

$prices = Cashier::previewPrices(['pri_123', 'pri_456'], [
    'discount_id' => 'dsc_123'
]);
```

그런 다음, 계산된 가격을 표시합니다:

```blade
<ul>
    @foreach ($prices as $price)
        <li>{{ $price->product['name'] }} - {{ $price->total() }}</li>
    @endforeach
</ul>
```


## 고객 {#customers}


### 고객 기본값 {#customer-defaults}

Cashier는 체크아웃 세션을 생성할 때 고객에 대한 유용한 기본값을 정의할 수 있도록 해줍니다. 이러한 기본값을 설정하면 고객의 이메일 주소와 이름을 미리 입력하여, 고객이 즉시 결제 위젯의 결제 단계로 넘어갈 수 있습니다. 이러한 기본값은 청구 가능 모델에서 다음 메서드를 오버라이드하여 설정할 수 있습니다:

```php
/**
 * Paddle과 연동할 고객의 이름을 가져옵니다.
 */
public function paddleName(): string|null
{
    return $this->name;
}

/**
 * Paddle과 연동할 고객의 이메일 주소를 가져옵니다.
 */
public function paddleEmail(): string|null
{
    return $this->email;
}
```

이러한 기본값은 [체크아웃 세션](#checkout-sessions)을 생성하는 Cashier의 모든 동작에 사용됩니다.


### 고객 조회하기 {#retrieving-customers}

`Cashier::findBillable` 메서드를 사용하여 Paddle 고객 ID로 고객을 조회할 수 있습니다. 이 메서드는 청구 가능한 모델의 인스턴스를 반환합니다:

```php
use Laravel\Paddle\Cashier;

$user = Cashier::findBillable($customerId);
```


### 고객 생성하기 {#creating-customers}

가끔은 구독을 시작하지 않고 Paddle 고객을 생성하고 싶을 때가 있습니다. 이럴 때는 `createAsCustomer` 메서드를 사용하면 됩니다:

```php
$customer = $user->createAsCustomer();
```

`Laravel\Paddle\Customer` 인스턴스가 반환됩니다. 고객이 Paddle에 생성된 후, 나중에 구독을 시작할 수 있습니다. 추가로 [Paddle API에서 지원하는 고객 생성 파라미터](https://developer.paddle.com/api-reference/customers/create-customer)를 전달하고 싶다면, 선택적으로 `$options` 배열을 제공할 수 있습니다:

```php
$customer = $user->createAsCustomer($options);
```


## 구독 {#subscriptions}


### 구독 생성하기 {#creating-subscriptions}

구독을 생성하려면, 먼저 데이터베이스에서 과금 가능한 모델 인스턴스를 가져와야 합니다. 일반적으로 이는 `App\Models\User`의 인스턴스가 됩니다. 모델 인스턴스를 가져온 후에는 `subscribe` 메서드를 사용하여 모델의 체크아웃 세션을 생성할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $checkout = $request->user()->subscribe($premium = 'pri_123', 'default')
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

`subscribe` 메서드에 전달되는 첫 번째 인수는 사용자가 구독할 특정 가격입니다. 이 값은 Paddle에서 가격의 식별자와 일치해야 합니다. `returnTo` 메서드는 사용자가 체크아웃을 성공적으로 완료한 후 리디렉션될 URL을 받습니다. `subscribe` 메서드에 전달되는 두 번째 인수는 구독의 내부 "타입"이어야 합니다. 애플리케이션에서 단일 구독만 제공한다면, 이를 `default` 또는 `primary`라고 부를 수 있습니다. 이 구독 타입은 내부 애플리케이션 용도로만 사용되며, 사용자에게 표시되지 않습니다. 또한, 공백이 포함되어서는 안 되며, 구독을 생성한 후에는 절대 변경해서는 안 됩니다.

또한, `customData` 메서드를 사용하여 구독에 대한 커스텀 메타데이터 배열을 제공할 수도 있습니다:

```php
$checkout = $request->user()->subscribe($premium = 'pri_123', 'default')
    ->customData(['key' => 'value'])
    ->returnTo(route('home'));
```

구독 체크아웃 세션이 생성되면, 이 체크아웃 세션을 Cashier Paddle에 포함된 `paddle-button` [Blade 컴포넌트](#overlay-checkout)에 전달할 수 있습니다:

```blade
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Subscribe
</x-paddle-button>
```

사용자가 체크아웃을 완료하면, Paddle에서 `subscription_created` 웹훅이 전송됩니다. Cashier는 이 웹훅을 받아 고객의 구독을 설정합니다. 모든 웹훅이 애플리케이션에서 올바르게 수신되고 처리되도록 하려면, 반드시 [웹훅 처리 설정](#handling-paddle-webhooks)을 올바르게 완료했는지 확인하세요.


### 구독 상태 확인하기 {#checking-subscription-status}

사용자가 애플리케이션에 구독한 후에는 다양한 편리한 메서드를 사용하여 구독 상태를 확인할 수 있습니다. 먼저, `subscribed` 메서드는 사용자가 유효한 구독을 가지고 있다면(심지어 현재 체험 기간 중이더라도) `true`를 반환합니다:

```php
if ($user->subscribed()) {
    // ...
}
```

애플리케이션에서 여러 개의 구독을 제공하는 경우, `subscribed` 메서드를 호출할 때 구독을 지정할 수 있습니다:

```php
if ($user->subscribed('default')) {
    // ...
}
```

`subscribed` 메서드는 [라우트 미들웨어](/laravel/12.x/middleware)로도 훌륭하게 사용할 수 있어, 사용자의 구독 상태에 따라 라우트와 컨트롤러에 대한 접근을 필터링할 수 있습니다:

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

사용자가 아직 체험 기간 내에 있는지 확인하고 싶다면, `onTrial` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 아직 체험 기간 중임을 알리는 경고를 표시해야 하는지 판단할 때 유용합니다:

```php
if ($user->subscription()->onTrial()) {
    // ...
}
```

`subscribedToPrice` 메서드는 주어진 Paddle 가격 ID를 기반으로 사용자가 특정 요금제에 구독되어 있는지 확인할 때 사용할 수 있습니다. 이 예제에서는 사용자의 `default` 구독이 월간 요금제에 활성 구독되어 있는지 확인합니다:

```php
if ($user->subscribedToPrice($monthly = 'pri_123', 'default')) {
    // ...
}
```

`recurring` 메서드는 사용자가 현재 활성 구독 중이며 더 이상 체험 기간이나 유예 기간이 아닌지 확인할 때 사용할 수 있습니다:

```php
if ($user->subscription()->recurring()) {
    // ...
}
```


#### 취소된 구독 상태 {#canceled-subscription-status}

사용자가 한때 활성 구독자였으나 구독을 취소했는지 확인하려면 `canceled` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription()->canceled()) {
    // ...
}
```

또한 사용자가 구독을 취소했지만 구독이 완전히 만료되기 전까지 "유예 기간"에 있는지도 확인할 수 있습니다. 예를 들어, 사용자가 3월 5일에 구독을 취소했지만 원래 만료일이 3월 10일이라면, 사용자는 3월 10일까지 "유예 기간"에 있게 됩니다. 이 기간 동안에도 `subscribed` 메서드는 여전히 `true`를 반환합니다:

```php
if ($user->subscription()->onGracePeriod()) {
    // ...
}
```


#### 연체 상태 {#past-due-status}

구독 결제에 실패하면 해당 구독은 `past_due`(연체)로 표시됩니다. 구독이 이 상태에 있으면 고객이 결제 정보를 업데이트할 때까지 활성화되지 않습니다. 구독 인스턴스의 `pastDue` 메서드를 사용하여 구독이 연체 상태인지 확인할 수 있습니다:

```php
if ($user->subscription()->pastDue()) {
    // ...
}
```

구독이 연체 상태일 때는 사용자가 [결제 정보를 업데이트](#updating-payment-information)하도록 안내해야 합니다.

`past_due` 상태일 때도 구독을 유효한 것으로 간주하고 싶다면, Cashier에서 제공하는 `keepPastDueSubscriptionsActive` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 `AppServiceProvider`의 `register` 메서드에서 호출해야 합니다:

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
> 구독이 `past_due` 상태일 때는 결제 정보가 업데이트되기 전까지 변경할 수 없습니다. 따라서 구독이 `past_due` 상태일 때 `swap` 및 `updateQuantity` 메서드는 예외를 발생시킵니다.


#### 구독 스코프 {#subscription-scopes}

대부분의 구독 상태는 쿼리 스코프로도 제공되므로, 특정 상태에 있는 구독을 데이터베이스에서 쉽게 조회할 수 있습니다:

```php
// 모든 유효한 구독 가져오기...
$subscriptions = Subscription::query()->valid()->get();

// 사용자의 모든 취소된 구독 가져오기...
$subscriptions = $user->subscriptions()->canceled()->get();
```

사용 가능한 모든 스코프의 전체 목록은 아래와 같습니다:

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

구독 단일 청구를 사용하면 구독자에게 구독 요금 외에 한 번만 청구할 수 있습니다. `charge` 메서드를 호출할 때 하나 이상의 가격 ID를 제공해야 합니다:

```php
// 단일 가격 청구...
$response = $user->subscription()->charge('pri_123');

// 여러 가격을 한 번에 청구...
$response = $user->subscription()->charge(['pri_123', 'pri_456']);
```

`charge` 메서드는 실제로 고객에게 요금을 청구하지 않으며, 구독의 다음 결제 주기까지 대기합니다. 만약 고객에게 즉시 청구하고 싶다면, 대신 `chargeAndInvoice` 메서드를 사용할 수 있습니다:

```php
$response = $user->subscription()->chargeAndInvoice('pri_123');
```


### 결제 정보 업데이트 {#updating-payment-information}

Paddle은 항상 구독마다 결제 수단을 저장합니다. 구독의 기본 결제 수단을 업데이트하려면, 구독 모델의 `redirectToUpdatePaymentMethod` 메서드를 사용하여 고객을 Paddle이 호스팅하는 결제 수단 업데이트 페이지로 리디렉션해야 합니다:

```php
use Illuminate\Http\Request;

Route::get('/update-payment-method', function (Request $request) {
    $user = $request->user();

    return $user->subscription()->redirectToUpdatePaymentMethod();
});
```

사용자가 정보를 업데이트하면, Paddle에서 `subscription_updated` 웹훅이 전송되고 구독 정보가 애플리케이션의 데이터베이스에 업데이트됩니다.


### 요금제 변경 {#changing-plans}

사용자가 애플리케이션에 구독한 후, 가끔 새로운 구독 요금제로 변경하고 싶어할 수 있습니다. 사용자의 구독 요금제를 업데이트하려면, Paddle 가격의 식별자를 구독의 `swap` 메서드에 전달하면 됩니다:

```php
use App\Models\User;

$user = User::find(1);

$user->subscription()->swap($premium = 'pri_456');
```

요금제를 변경하면서 다음 결제 주기를 기다리지 않고 즉시 사용자에게 청구하고 싶다면, `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->subscription()->swapAndInvoice($premium = 'pri_456');
```


#### 비례 배분 {#prorations}

기본적으로 Paddle은 요금제 변경 시 요금을 비례 배분(prorate)합니다. `noProrate` 메서드를 사용하면 요금을 비례 배분하지 않고 구독을 업데이트할 수 있습니다:

```php
$user->subscription('default')->noProrate()->swap($premium = 'pri_456');
```

비례 배분을 비활성화하고 즉시 고객에게 청구하고 싶다면, `noProrate`와 함께 `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user->subscription('default')->noProrate()->swapAndInvoice($premium = 'pri_456');
```

또는, 구독 변경에 대해 고객에게 청구하지 않으려면 `doNotBill` 메서드를 사용할 수 있습니다:

```php
$user->subscription('default')->doNotBill()->swap($premium = 'pri_456');
```

Paddle의 비례 배분 정책에 대한 자세한 내용은 Paddle의 [비례 배분 문서](https://developer.paddle.com/concepts/subscriptions/proration)를 참고하세요.


### 구독 수량 {#subscription-quantity}

때때로 구독은 "수량"에 따라 영향을 받을 수 있습니다. 예를 들어, 프로젝트 관리 애플리케이션이 프로젝트당 월 $10을 청구한다고 가정해봅시다. 구독의 수량을 쉽게 증가시키거나 감소시키려면 `incrementQuantity` 및 `decrementQuantity` 메서드를 사용하세요:

```php
$user = User::find(1);

$user->subscription()->incrementQuantity();

// 구독의 현재 수량에 5를 더합니다...
$user->subscription()->incrementQuantity(5);

$user->subscription()->decrementQuantity();

// 구독의 현재 수량에서 5를 뺍니다...
$user->subscription()->decrementQuantity(5);
```

또는, `updateQuantity` 메서드를 사용하여 특정 수량으로 설정할 수도 있습니다:

```php
$user->subscription()->updateQuantity(10);
```

`noProrate` 메서드를 사용하면 요금을 일할 계산하지 않고 구독의 수량을 업데이트할 수 있습니다:

```php
$user->subscription()->noProrate()->updateQuantity(10);
```


#### 여러 상품이 포함된 구독의 수량 {#quantities-for-subscription-with-multiple-products}

구독이 [여러 상품이 포함된 구독](#subscriptions-with-multiple-products)인 경우, 수량을 증가시키거나 감소시키려는 가격의 ID를 increment / decrement 메서드의 두 번째 인수로 전달해야 합니다:

```php
$user->subscription()->incrementQuantity(1, 'price_chat');
```


### 여러 상품이 포함된 구독 {#subscriptions-with-multiple-products}

[여러 상품이 포함된 구독](https://developer.paddle.com/build/subscriptions/add-remove-products-prices-addons)을 사용하면 하나의 구독에 여러 결제 상품을 할당할 수 있습니다. 예를 들어, 기본 구독 가격이 월 $10인 고객 서비스 "헬프데스크" 애플리케이션을 구축한다고 가정해 보겠습니다. 이때 월 $15의 추가 요금으로 라이브 채팅 애드온 상품을 제공할 수 있습니다.

구독 결제 세션을 생성할 때, `subscribe` 메서드의 첫 번째 인자로 가격 배열을 전달하여 하나의 구독에 여러 상품을 지정할 수 있습니다:

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

위 예시에서 고객은 `default` 구독에 두 개의 가격이 연결됩니다. 두 가격 모두 각자의 결제 주기에 따라 청구됩니다. 필요하다면, 각 가격에 대한 특정 수량을 나타내기 위해 키/값 쌍의 연관 배열을 전달할 수도 있습니다:

```php
$user = User::find(1);

$checkout = $user->subscribe('default', ['price_monthly', 'price_chat' => 5]);
```

기존 구독에 다른 가격을 추가하고 싶다면, 구독의 `swap` 메서드를 사용해야 합니다. `swap` 메서드를 호출할 때는 구독의 현재 가격과 수량도 함께 포함해야 합니다:

```php
$user = User::find(1);

$user->subscription()->swap(['price_chat', 'price_original' => 2]);
```

위 예시에서는 새로운 가격이 추가되지만, 고객은 다음 결제 주기까지 해당 가격에 대해 청구되지 않습니다. 고객에게 즉시 청구하고 싶다면 `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user->subscription()->swapAndInvoice(['price_chat', 'price_original' => 2]);
```

`swap` 메서드를 사용하고 제거하려는 가격을 생략하여 구독에서 가격을 제거할 수 있습니다:

```php
$user->subscription()->swap(['price_original' => 2]);
```

> [!WARNING]
> 구독에서 마지막 가격을 제거할 수는 없습니다. 대신, 구독을 취소해야 합니다.


### 다중 구독 {#multiple-subscriptions}

Paddle은 고객이 동시에 여러 개의 구독을 가질 수 있도록 지원합니다. 예를 들어, 헬스장을 운영하면서 수영 구독과 웨이트 트레이닝 구독을 제공할 수 있으며, 각 구독은 서로 다른 가격을 가질 수 있습니다. 물론, 고객은 두 플랜 중 하나 또는 모두를 구독할 수 있어야 합니다.

애플리케이션에서 구독을 생성할 때, `subscribe` 메서드의 두 번째 인자로 구독의 유형을 지정할 수 있습니다. 이 유형은 사용자가 시작하는 구독의 종류를 나타내는 임의의 문자열이 될 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/swimming/subscribe', function (Request $request) {
    $checkout = $request->user()->subscribe($swimmingMonthly = 'pri_123', 'swimming');

    return view('billing', ['checkout' => $checkout]);
});
```

이 예제에서는 고객에게 월간 수영 구독을 시작했습니다. 하지만, 나중에 연간 구독으로 변경하고 싶을 수도 있습니다. 고객의 구독을 조정할 때는 `swimming` 구독의 가격만 간단히 변경하면 됩니다:

```php
$user->subscription('swimming')->swap($swimmingYearly = 'pri_456');
```

물론, 구독을 완전히 취소할 수도 있습니다:

```php
$user->subscription('swimming')->cancel();
```


### 구독 일시 중지 {#pausing-subscriptions}

구독을 일시 중지하려면, 사용자 구독에서 `pause` 메서드를 호출하면 됩니다:

```php
$user->subscription()->pause();
```

구독이 일시 중지되면, Cashier는 데이터베이스의 `paused_at` 컬럼을 자동으로 설정합니다. 이 컬럼은 `paused` 메서드가 언제 `true`를 반환해야 하는지 판단하는 데 사용됩니다. 예를 들어, 고객이 3월 1일에 구독을 일시 중지했지만 구독이 3월 5일까지 갱신되지 않는 경우, `paused` 메서드는 3월 5일까지 계속해서 `false`를 반환합니다. 이는 사용자가 일반적으로 결제 주기가 끝날 때까지 애플리케이션을 계속 사용할 수 있도록 허용되기 때문입니다.

기본적으로, 일시 중지는 다음 결제 주기에 적용되어 고객이 결제한 기간의 나머지를 계속 사용할 수 있습니다. 구독을 즉시 일시 중지하고 싶다면, `pauseNow` 메서드를 사용할 수 있습니다:

```php
$user->subscription()->pauseNow();
```

`pauseUntil` 메서드를 사용하면, 특정 시점까지 구독을 일시 중지할 수 있습니다:

```php
$user->subscription()->pauseUntil(now()->addMonth());
```

또는, `pauseNowUntil` 메서드를 사용하여 즉시 구독을 일시 중지하고 지정한 시점까지 유지할 수 있습니다:

```php
$user->subscription()->pauseNowUntil(now()->addMonth());
```

사용자가 구독을 일시 중지했지만 아직 "유예 기간"에 있는지 확인하려면 `onPausedGracePeriod` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription()->onPausedGracePeriod()) {
    // ...
}
```

일시 중지된 구독을 다시 활성화하려면, 구독에서 `resume` 메서드를 호출하면 됩니다:

```php
$user->subscription()->resume();
```

> [!WARNING]
> 구독이 일시 중지된 상태에서는 수정할 수 없습니다. 다른 요금제로 변경하거나 수량을 업데이트하려면 먼저 구독을 재개해야 합니다.


### 구독 취소하기 {#canceling-subscriptions}

구독을 취소하려면, 사용자 구독에서 `cancel` 메서드를 호출하면 됩니다:

```php
$user->subscription()->cancel();
```

구독이 취소되면, Cashier는 데이터베이스의 `ends_at` 컬럼을 자동으로 설정합니다. 이 컬럼은 `subscribed` 메서드가 언제부터 `false`를 반환해야 하는지 판단하는 데 사용됩니다. 예를 들어, 고객이 3월 1일에 구독을 취소했지만 구독이 3월 5일까지 종료되지 않도록 예약되어 있다면, `subscribed` 메서드는 3월 5일까지 계속해서 `true`를 반환합니다. 이는 사용자가 일반적으로 결제 주기가 끝날 때까지 애플리케이션을 계속 사용할 수 있도록 허용되기 때문입니다.

사용자가 구독을 취소했지만 아직 "유예 기간"에 있는지 확인하려면 `onGracePeriod` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription()->onGracePeriod()) {
    // ...
}
```

구독을 즉시 취소하고 싶다면, 구독에서 `cancelNow` 메서드를 호출하면 됩니다:

```php
$user->subscription()->cancelNow();
```

유예 기간 중인 구독의 취소를 중단하려면, `stopCancelation` 메서드를 호출할 수 있습니다:

```php
$user->subscription()->stopCancelation();
```

> [!WARNING]
> Paddle의 구독은 취소 후 재개할 수 없습니다. 고객이 구독을 다시 시작하려면 새 구독을 생성해야 합니다.


## 구독 체험판 {#subscription-trials}


### 결제 수단을 미리 받는 체험 기간 제공 {#with-payment-method-up-front}

고객에게 체험 기간을 제공하면서도 결제 수단 정보를 미리 받고 싶다면, 고객이 구독할 가격에 대해 Paddle 대시보드에서 체험 기간을 설정해야 합니다. 그런 다음, 평소와 같이 체크아웃 세션을 시작하면 됩니다:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $checkout = $request->user()
        ->subscribe('pri_monthly')
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

애플리케이션이 `subscription_created` 이벤트를 수신하면, Cashier는 애플리케이션 데이터베이스의 구독 레코드에 체험 기간 종료 날짜를 설정하고, Paddle에게도 이 날짜 이후에 고객에게 청구를 시작하도록 지시합니다.

> [!WARNING]
> 고객의 구독이 체험 기간 종료 전에 취소되지 않으면, 체험 기간이 끝나는 즉시 요금이 청구됩니다. 따라서 사용자에게 체험 기간 종료일을 반드시 안내해야 합니다.

사용자 인스턴스의 `onTrial` 메서드를 사용하여 사용자가 체험 기간 중인지 확인할 수 있습니다:

```php
if ($user->onTrial()) {
    // ...
}
```

기존 체험 기간이 만료되었는지 확인하려면 `hasExpiredTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->hasExpiredTrial()) {
    // ...
}
```

특정 구독 유형에 대해 사용자가 체험 기간 중인지 확인하려면, `onTrial` 또는 `hasExpiredTrial` 메서드에 유형을 전달할 수 있습니다:

```php
if ($user->onTrial('default')) {
    // ...
}

if ($user->hasExpiredTrial('default')) {
    // ...
}
```


### 결제 수단 없이 체험 기간 제공 {#without-payment-method-up-front}

사용자의 결제 수단 정보를 미리 수집하지 않고 체험 기간을 제공하고 싶다면, 사용자에 연결된 고객 레코드의 `trial_ends_at` 컬럼을 원하는 체험 종료 날짜로 설정하면 됩니다. 이는 일반적으로 사용자 등록 시에 수행됩니다:

```php
use App\Models\User;

$user = User::create([
    // ...
]);

$user->createAsCustomer([
    'trial_ends_at' => now()->addDays(10)
]);
```

Cashier는 이러한 유형의 체험을 "일반(generic) 체험"이라고 부르며, 이는 기존 구독에 연결되어 있지 않기 때문입니다. `User` 인스턴스의 `onTrial` 메서드는 현재 날짜가 `trial_ends_at` 값보다 이전이면 `true`를 반환합니다:

```php
if ($user->onTrial()) {
    // 사용자가 체험 기간 내에 있습니다...
}
```

실제 구독을 생성할 준비가 되면, 평소와 같이 `subscribe` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/user/subscribe', function (Request $request) {
    $checkout = $request->user()
        ->subscribe('pri_monthly')
        ->returnTo(route('home'));

    return view('billing', ['checkout' => $checkout]);
});
```

사용자의 체험 종료 날짜를 가져오려면 `trialEndsAt` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 체험 중이면 Carbon 날짜 인스턴스를 반환하고, 그렇지 않으면 `null`을 반환합니다. 기본 구독이 아닌 특정 구독의 체험 종료 날짜를 얻고 싶다면 선택적으로 구독 유형 파라미터를 전달할 수도 있습니다:

```php
if ($user->onTrial('default')) {
    $trialEndsAt = $user->trialEndsAt();
}
```

사용자가 "일반(generic)" 체험 기간 내에 있으며 아직 실제 구독을 생성하지 않았는지 확인하고 싶다면 `onGenericTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->onGenericTrial()) {
    // 사용자가 "일반" 체험 기간 내에 있습니다...
}
```


### 체험 기간 연장 또는 활성화 {#extend-or-activate-a-trial}

구독의 기존 체험 기간을 연장하려면 `extendTrial` 메서드를 호출하고 체험이 종료될 시점을 지정하면 됩니다:

```php
$user->subscription()->extendTrial(now()->addDays(5));
```

또는, 구독의 체험 기간을 즉시 종료하여 바로 활성화하려면 구독에서 `activate` 메서드를 호출하면 됩니다:

```php
$user->subscription()->activate();
```


## Paddle 웹훅 처리하기 {#handling-paddle-webhooks}

Paddle은 웹훅을 통해 다양한 이벤트를 애플리케이션에 알릴 수 있습니다. 기본적으로, Cashier 서비스 프로바이더에 의해 Cashier의 웹훅 컨트롤러를 가리키는 라우트가 등록됩니다. 이 컨트롤러는 모든 수신 웹훅 요청을 처리합니다.

기본적으로 이 컨트롤러는 결제 실패가 너무 많은 구독의 자동 취소, 구독 업데이트, 결제 수단 변경을 자동으로 처리합니다. 하지만 곧 알게 되겠지만, 이 컨트롤러를 확장하여 원하는 모든 Paddle 웹훅 이벤트를 처리할 수 있습니다.

애플리케이션이 Paddle 웹훅을 처리할 수 있도록 하려면 [Paddle 관리 패널에서 웹훅 URL을 설정](https://vendors.paddle.com/alerts-webhooks)해야 합니다. 기본적으로 Cashier의 웹훅 컨트롤러는 `/paddle/webhook` URL 경로에 응답합니다. Paddle 관리 패널에서 활성화해야 할 모든 웹훅의 전체 목록은 다음과 같습니다:

- Customer Updated
- Transaction Completed
- Transaction Updated
- Subscription Created
- Subscription Updated
- Subscription Paused
- Subscription Canceled

> [!WARNING]
> Cashier에 포함된 [웹훅 서명 검증](/laravel/12.x/cashier-paddle#verifying-webhook-signatures) 미들웨어로 수신 요청을 반드시 보호하세요.


#### 웹훅과 CSRF 보호 {#webhooks-csrf-protection}

Paddle 웹훅은 Laravel의 [CSRF 보호](/laravel/12.x/csrf)를 우회해야 하므로, Paddle 웹훅이 들어올 때 Laravel이 CSRF 토큰을 검증하지 않도록 해야 합니다. 이를 위해 애플리케이션의 `bootstrap/app.php` 파일에서 `paddle/*` 경로를 CSRF 보호에서 제외해야 합니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'paddle/*',
    ]);
})
```


#### 웹훅과 로컬 개발 {#webhooks-local-development}

Paddle이 로컬 개발 중인 애플리케이션에 웹훅을 전송할 수 있도록 하려면, [Ngrok](https://ngrok.com/)이나 [Expose](https://expose.dev/docs/introduction)와 같은 사이트 공유 서비스를 통해 애플리케이션을 외부에 노출해야 합니다. 만약 [Laravel Sail](/laravel/12.x/sail)를 사용하여 로컬에서 애플리케이션을 개발 중이라면, Sail의 [사이트 공유 명령어](/laravel/12.x/sail#sharing-your-site)를 사용할 수 있습니다.


### 웹훅 이벤트 핸들러 정의하기 {#defining-webhook-event-handlers}

Cashier는 결제 실패 시 구독 취소 및 기타 일반적인 Paddle 웹훅을 자동으로 처리합니다. 그러나 추가로 처리하고 싶은 웹훅 이벤트가 있다면, Cashier가 디스패치하는 다음 이벤트를 리스닝하여 처리할 수 있습니다:

- `Laravel\Paddle\Events\WebhookReceived`
- `Laravel\Paddle\Events\WebhookHandled`

두 이벤트 모두 Paddle 웹훅의 전체 페이로드를 포함합니다. 예를 들어, `transaction.billed` 웹훅을 처리하고 싶다면, 해당 이벤트를 처리하는 [리스너](/laravel/12.x/events#defining-listeners)를 등록할 수 있습니다:

```php
<?php

namespace App\Listeners;

use Laravel\Paddle\Events\WebhookReceived;

class PaddleEventListener
{
    /**
     * 수신된 Paddle 웹훅을 처리합니다.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['event_type'] === 'transaction.billed') {
            // 들어오는 이벤트를 처리합니다...
        }
    }
}
```

Cashier는 수신된 웹훅의 타입에 따라 전용 이벤트도 발생시킵니다. Paddle에서 전달된 전체 페이로드 외에도, 웹훅을 처리하는 데 사용된 관련 모델(청구 가능 모델, 구독, 영수증 등)도 함께 포함되어 있습니다:

<div class="content-list" markdown="1">

- `Laravel\Paddle\Events\CustomerUpdated`
- `Laravel\Paddle\Events\TransactionCompleted`
- `Laravel\Paddle\Events\TransactionUpdated`
- `Laravel\Paddle\Events\SubscriptionCreated`
- `Laravel\Paddle\Events\SubscriptionUpdated`
- `Laravel\Paddle\Events\SubscriptionPaused`
- `Laravel\Paddle\Events\SubscriptionCanceled`

</div>

기본적으로 내장된 웹훅 라우트를 오버라이드하고 싶다면, 애플리케이션의 `.env` 파일에 `CASHIER_WEBHOOK` 환경 변수를 정의하면 됩니다. 이 값은 웹훅 라우트의 전체 URL이어야 하며, Paddle 관리 패널에 설정된 URL과 일치해야 합니다:

```ini
CASHIER_WEBHOOK=https://example.com/my-paddle-webhook-url
```


### 웹훅 서명 검증 {#verifying-webhook-signatures}

웹훅을 안전하게 보호하기 위해 [Paddle의 웹훅 서명](https://developer.paddle.com/webhook-reference/verifying-webhooks)을 사용할 수 있습니다. 편의를 위해 Cashier는 들어오는 Paddle 웹훅 요청이 유효한지 검증하는 미들웨어를 자동으로 포함하고 있습니다.

웹훅 검증을 활성화하려면, 애플리케이션의 `.env` 파일에 `PADDLE_WEBHOOK_SECRET` 환경 변수가 정의되어 있는지 확인하세요. 웹훅 시크릿은 Paddle 계정 대시보드에서 확인할 수 있습니다.


## 단일 결제 {#single-charges}


### 상품 결제하기 {#charging-for-products}

고객을 위한 상품 구매를 시작하려면, 청구 가능한 모델 인스턴스에서 `checkout` 메서드를 사용하여 구매를 위한 체크아웃 세션을 생성할 수 있습니다. `checkout` 메서드는 하나 또는 여러 개의 가격 ID를 받을 수 있습니다. 필요하다면, 연관 배열을 사용하여 구매할 상품의 수량을 지정할 수도 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/buy', function (Request $request) {
    $checkout = $request->user()->checkout(['pri_tshirt', 'pri_socks' => 5]);

    return view('buy', ['checkout' => $checkout]);
});
```

체크아웃 세션을 생성한 후에는, Cashier에서 제공하는 `paddle-button` [Blade 컴포넌트](#overlay-checkout)를 사용하여 사용자가 Paddle 체크아웃 위젯을 보고 결제를 완료할 수 있도록 할 수 있습니다:

```blade
<x-paddle-button :checkout="$checkout" class="px-8 py-4">
    Buy
</x-paddle-button>
```

체크아웃 세션에는 `customData` 메서드가 있어, 원하는 모든 커스텀 데이터를 실제 거래 생성에 전달할 수 있습니다. 커스텀 데이터를 전달할 때 사용할 수 있는 옵션에 대해 더 자세히 알아보려면 [Paddle 문서](https://developer.paddle.com/build/transactions/custom-data)를 참고하세요:

```php
$checkout = $user->checkout('pri_tshirt')
    ->customData([
        'custom_option' => $value,
    ]);
```


### 거래 환불 {#refunding-transactions}

거래를 환불하면 구매 시 사용된 고객의 결제 수단으로 환불 금액이 반환됩니다. Paddle 구매를 환불해야 하는 경우, `Cashier\Paddle\Transaction` 모델의 `refund` 메서드를 사용할 수 있습니다. 이 메서드는 첫 번째 인수로 사유를 받고, 하나 이상의 가격 ID와 선택적으로 환불할 금액을 연관 배열로 전달할 수 있습니다. 주어진 청구 가능 모델의 거래 내역은 `transactions` 메서드를 사용해 조회할 수 있습니다.

예를 들어, `pri_123`과 `pri_456` 가격에 대한 특정 거래를 환불하고 싶다고 가정해봅시다. `pri_123`은 전액 환불하고, `pri_456`은 2달러만 부분 환불하고자 할 때는 다음과 같이 작성할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$transaction = $user->transactions()->first();

$response = $transaction->refund('실수로 결제됨', [
    'pri_123', // 이 가격은 전액 환불...
    'pri_456' => 200, // 이 가격은 일부만 환불(200 단위)...
]);
```

위 예시는 거래 내 특정 항목만 환불하는 방법입니다. 전체 거래를 환불하고 싶다면 사유만 전달하면 됩니다:

```php
$response = $transaction->refund('실수로 결제됨');
```

환불에 대한 자세한 내용은 [Paddle의 환불 문서](https://developer.paddle.com/build/transactions/create-transaction-adjustments)를 참고하세요.

> [!WARNING]
> 환불은 완전히 처리되기 전에 항상 Paddle의 승인이 필요합니다.


### 거래에 크레딧 추가하기 {#crediting-transactions}

환불과 마찬가지로, 거래에 크레딧을 추가할 수도 있습니다. 거래에 크레딧을 추가하면 해당 금액이 고객의 잔액에 더해져 향후 구매에 사용할 수 있습니다. 거래에 크레딧을 추가하는 작업은 수동으로 수집된 거래에만 가능하며, 자동으로 수집된 거래(예: 구독)에는 적용할 수 없습니다. 구독 크레딧은 Paddle이 자동으로 처리하기 때문입니다:

```php
$transaction = $user->transactions()->first();

// 특정 라인 아이템 전체에 크레딧 추가...
$response = $transaction->credit('Compensation', 'pri_123');
```

자세한 내용은 [Paddle의 크레딧 관련 문서](https://developer.paddle.com/build/transactions/create-transaction-adjustments)를 참고하세요.

> [!WARNING]
> 크레딧은 수동으로 수집된 거래에만 적용할 수 있습니다. 자동으로 수집된 거래는 Paddle에서 직접 크레딧을 처리합니다.


## 트랜잭션 {#transactions}

청구 가능한 모델의 트랜잭션 배열은 `transactions` 프로퍼티를 통해 쉽게 가져올 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$transactions = $user->transactions;
```

트랜잭션은 제품 및 구매에 대한 결제를 나타내며, 인보이스와 함께 제공됩니다. 완료된 트랜잭션만 애플리케이션의 데이터베이스에 저장됩니다.

고객의 트랜잭션을 나열할 때, 트랜잭션 인스턴스의 메서드를 사용하여 관련 결제 정보를 표시할 수 있습니다. 예를 들어, 모든 트랜잭션을 테이블로 나열하여 사용자가 인보이스를 쉽게 다운로드할 수 있도록 할 수 있습니다:

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

`download-invoice` 라우트는 다음과 같이 작성할 수 있습니다:

```php
use Illuminate\Http\Request;
use Laravel\Paddle\Transaction;

Route::get('/download-invoice/{transaction}', function (Request $request, Transaction $transaction) {
    return $transaction->redirectToInvoicePdf();
})->name('download-invoice');
```


### 과거 및 예정된 결제 {#past-and-upcoming-payments}

`lastPayment` 및 `nextPayment` 메서드를 사용하여 반복 구독에 대한 고객의 과거 또는 예정된 결제를 조회하고 표시할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$subscription = $user->subscription();

$lastPayment = $subscription->lastPayment();
$nextPayment = $subscription->nextPayment();
```

이 두 메서드는 모두 `Laravel\Paddle\Payment` 인스턴스를 반환합니다. 하지만, 트랜잭션이 아직 웹훅을 통해 동기화되지 않은 경우 `lastPayment`는 `null`을 반환하며, 결제 주기가 종료된 경우(예: 구독이 취소된 경우) `nextPayment`는 `null`을 반환합니다:

```blade
다음 결제: {{ $nextPayment->amount() }} 결제 예정일: {{ $nextPayment->date()->format('d/m/Y') }}
```


## 테스트 {#testing}

테스트를 진행할 때, 결제 흐름이 예상대로 작동하는지 수동으로 테스트해야 합니다.

자동화된 테스트, 특히 CI 환경에서 실행되는 테스트의 경우, [Laravel의 HTTP 클라이언트](/laravel/12.x/http-client#testing)를 사용하여 Paddle로 전송되는 HTTP 호출을 모방할 수 있습니다. 이는 실제로 Paddle의 응답을 테스트하는 것은 아니지만, Paddle의 API를 실제로 호출하지 않고도 애플리케이션을 테스트할 수 있는 방법을 제공합니다.
