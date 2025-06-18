# [패키지] Laravel Cashier (Stripe)









































































## 소개 {#introduction}

[Laravel Cashier Stripe](https://github.com/laravel/cashier-stripe)는 [Stripe](https://stripe.com)의 구독 결제 서비스를 위한 표현력 있고 유연한 인터페이스를 제공합니다. 이 패키지는 여러분이 작성하기 꺼려하는 대부분의 반복적인 구독 결제 코드를 처리해줍니다. 기본적인 구독 관리 외에도, Cashier는 쿠폰, 구독 변경, 구독 "수량", 취소 유예 기간, 그리고 인보이스 PDF 생성까지 지원합니다.


## Cashier 업그레이드 {#upgrading-cashier}

Cashier의 새 버전으로 업그레이드할 때는 반드시 [업그레이드 가이드](https://github.com/laravel/cashier-stripe/blob/master/UPGRADE.md)를 꼼꼼히 확인해야 합니다.

> [!WARNING]
> 변경으로 인한 문제를 방지하기 위해 Cashier는 고정된 Stripe API 버전을 사용합니다. Cashier 15는 Stripe API 버전 `2023-10-16`을 사용합니다. Stripe API 버전은 새로운 Stripe 기능과 개선 사항을 활용하기 위해 마이너 릴리스에서 업데이트됩니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 사용하여 Stripe용 Cashier 패키지를 설치하세요:

```shell
composer require laravel/cashier
```

패키지 설치 후, `vendor:publish` Artisan 명령어를 사용하여 Cashier의 마이그레이션을 게시하세요:

```shell
php artisan vendor:publish --tag="cashier-migrations"
```

그런 다음, 데이터베이스를 마이그레이션하세요:

```shell
php artisan migrate
```

Cashier의 마이그레이션은 `users` 테이블에 여러 컬럼을 추가합니다. 또한 모든 고객의 구독 정보를 저장할 새로운 `subscriptions` 테이블과, 여러 가격이 포함된 구독을 위한 `subscription_items` 테이블도 생성합니다.

원한다면, `vendor:publish` Artisan 명령어를 사용하여 Cashier의 설정 파일도 게시할 수 있습니다:

```shell
php artisan vendor:publish --tag="cashier-config"
```

마지막으로, Cashier가 모든 Stripe 이벤트를 올바르게 처리할 수 있도록 [Cashier의 웹훅 처리 설정](#handling-stripe-webhooks)을 반드시 진행하세요.

> [!WARNING]
> Stripe는 Stripe 식별자를 저장하는 데 사용되는 모든 컬럼이 대소문자를 구분해야 한다고 권장합니다. 따라서 MySQL을 사용할 경우 `stripe_id` 컬럼의 정렬 방식이 `utf8_bin`으로 설정되어 있는지 확인해야 합니다. 이에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/upgrades#what-changes-does-stripe-consider-to-be-backwards-compatible)에서 확인할 수 있습니다.


## 구성 {#configuration}


### 청구 가능 모델 {#billable-model}

Cashier를 사용하기 전에, 청구가 가능한 모델 정의에 `Billable` 트레이트를 추가해야 합니다. 일반적으로 이는 `App\Models\User` 모델이 될 것입니다. 이 트레이트는 구독 생성, 쿠폰 적용, 결제 수단 정보 업데이트 등 일반적인 청구 작업을 수행할 수 있는 다양한 메서드를 제공합니다:

```php
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

Cashier는 기본적으로 청구 가능 모델이 Laravel에서 제공하는 `App\Models\User` 클래스일 것이라고 가정합니다. 만약 이를 변경하고 싶다면, `useCustomerModel` 메서드를 통해 다른 모델을 지정할 수 있습니다. 이 메서드는 일반적으로 `AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use App\Models\Cashier\User;
use Laravel\Cashier\Cashier;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Cashier::useCustomerModel(User::class);
}
```

> [!WARNING]
> Laravel에서 제공하는 `App\Models\User` 모델이 아닌 다른 모델을 사용하는 경우, 제공된 [Cashier 마이그레이션](#installation)을 게시하고 수정하여 대체 모델의 테이블 이름에 맞게 변경해야 합니다.


### API 키 {#api-keys}

다음으로, 애플리케이션의 `.env` 파일에 Stripe API 키를 설정해야 합니다. Stripe API 키는 Stripe 관리 패널에서 확인할 수 있습니다:

```ini
STRIPE_KEY=your-stripe-key
STRIPE_SECRET=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

> [!WARNING]
> `STRIPE_WEBHOOK_SECRET` 환경 변수가 애플리케이션의 `.env` 파일에 정의되어 있는지 반드시 확인해야 합니다. 이 변수는 들어오는 웹훅이 실제로 Stripe에서 온 것인지 확인하는 데 사용됩니다.


### 통화 설정 {#currency-configuration}

기본 Cashier 통화는 미국 달러(USD)입니다. 애플리케이션의 `.env` 파일에서 `CASHIER_CURRENCY` 환경 변수를 설정하여 기본 통화를 변경할 수 있습니다:

```ini
CASHIER_CURRENCY=eur
```

Cashier의 통화 설정 외에도, 인보이스에 표시되는 금액 값을 포맷할 때 사용할 로케일을 지정할 수 있습니다. 내부적으로 Cashier는 [PHP의 `NumberFormatter` 클래스](https://www.php.net/manual/en/class.numberformatter.php)를 사용하여 통화 로케일을 설정합니다:

```ini
CASHIER_CURRENCY_LOCALE=nl_BE
```

> [!WARNING]
> `en` 이외의 로케일을 사용하려면, 서버에 `ext-intl` PHP 확장 모듈이 설치되고 설정되어 있어야 합니다.


### 세금 설정 {#tax-configuration}

[Stripe Tax](https://stripe.com/tax) 덕분에 Stripe에서 생성된 모든 인보이스에 대해 세금을 자동으로 계산할 수 있습니다. 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메소드에서 `calculateTaxes` 메소드를 호출하여 자동 세금 계산을 활성화할 수 있습니다:

```php
use Laravel\Cashier\Cashier;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Cashier::calculateTaxes();
}
```

세금 계산이 활성화되면, 새로 생성되는 모든 구독과 단일 인보이스에 대해 자동으로 세금이 계산됩니다.

이 기능이 제대로 작동하려면, 고객의 이름, 주소, 세금 ID와 같은 청구 정보가 Stripe와 동기화되어야 합니다. 이를 위해 Cashier에서 제공하는 [고객 데이터 동기화](#syncing-customer-data-with-stripe) 및 [세금 ID](#tax-ids) 메소드를 사용할 수 있습니다.


### 로깅 {#logging}

Cashier는 Stripe의 치명적인 오류를 로깅할 때 사용할 로그 채널을 지정할 수 있습니다. 애플리케이션의 `.env` 파일에서 `CASHIER_LOGGER` 환경 변수를 정의하여 로그 채널을 지정할 수 있습니다:

```ini
CASHIER_LOGGER=stack
```

Stripe로의 API 호출에서 발생한 예외는 애플리케이션의 기본 로그 채널을 통해 기록됩니다.


### 커스텀 모델 사용하기 {#using-custom-models}

Cashier에서 내부적으로 사용하는 모델을 확장하여, 자신만의 모델을 정의하고 해당 Cashier 모델을 상속받아 자유롭게 사용할 수 있습니다:

```php
use Laravel\Cashier\Subscription as CashierSubscription;

class Subscription extends CashierSubscription
{
    // ...
}
```

모델을 정의한 후에는 `Laravel\Cashier\Cashier` 클래스를 통해 Cashier가 커스텀 모델을 사용하도록 지정할 수 있습니다. 일반적으로, 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 Cashier에 커스텀 모델을 알려주어야 합니다:

```php
use App\Models\Cashier\Subscription;
use App\Models\Cashier\SubscriptionItem;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Cashier::useSubscriptionModel(Subscription::class);
    Cashier::useSubscriptionItemModel(SubscriptionItem::class);
}
```


## 빠른 시작 {#quickstart}


### 상품 판매 {#quickstart-selling-products}

> [!NOTE]
> Stripe Checkout을 사용하기 전에, Stripe 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한, [Cashier의 웹훅 처리](#handling-stripe-webhooks)를 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 결제를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Stripe Checkout](https://stripe.com/payments/checkout) 덕분에, 현대적이고 견고한 결제 통합을 손쉽게 구축할 수 있습니다.

반복되지 않는 단일 결제 상품에 대해 고객에게 요금을 청구하려면, Cashier를 사용하여 고객을 Stripe Checkout으로 안내하고, 고객이 결제 정보를 입력하고 구매를 확정하도록 할 수 있습니다. 결제가 Checkout을 통해 완료되면, 고객은 애플리케이션 내에서 원하는 성공 URL로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/checkout', function (Request $request) {
    $stripePriceId = 'price_deluxe_album';

    $quantity = 1;

    return $request->user()->checkout([$stripePriceId => $quantity], [
        'success_url' => route('checkout-success'),
        'cancel_url' => route('checkout-cancel'),
    ]);
})->name('checkout');

Route::view('/checkout/success', 'checkout.success')->name('checkout-success');
Route::view('/checkout/cancel', 'checkout.cancel')->name('checkout-cancel');
```

위 예시에서 볼 수 있듯이, Cashier에서 제공하는 `checkout` 메서드를 사용하여 고객을 특정 "가격 식별자"에 대해 Stripe Checkout으로 리디렉션합니다. Stripe를 사용할 때 "가격"은 [특정 상품에 대해 정의된 가격](https://stripe.com/docs/products-prices/how-products-and-prices-work)을 의미합니다.

필요하다면, `checkout` 메서드는 Stripe에서 고객을 자동으로 생성하고, 해당 Stripe 고객 레코드를 애플리케이션 데이터베이스의 사용자와 연결합니다. 결제 세션이 완료되면, 고객은 성공 또는 취소 전용 페이지로 리디렉션되며, 이곳에서 고객에게 안내 메시지를 표시할 수 있습니다.


#### Stripe Checkout에 메타데이터 제공하기 {#providing-meta-data-to-stripe-checkout}

상품을 판매할 때, 일반적으로 애플리케이션에서 정의한 `Cart`와 `Order` 모델을 통해 완료된 주문과 구매한 상품을 추적합니다. Stripe Checkout으로 고객을 리디렉션하여 결제를 완료하도록 할 때, 기존 주문 식별자를 제공해야 할 수 있습니다. 이렇게 하면 고객이 결제 후 애플리케이션으로 돌아올 때 해당 주문과 결제 내역을 연결할 수 있습니다.

이를 위해 `checkout` 메서드에 `metadata` 배열을 제공할 수 있습니다. 사용자가 결제 과정을 시작할 때 애플리케이션 내에서 보류 중인 `Order`가 생성된다고 가정해봅시다. 참고로, 이 예시의 `Cart`와 `Order` 모델은 설명을 위한 것이며 Cashier에서 제공하지 않습니다. 여러분의 애플리케이션 요구에 맞게 자유롭게 구현하실 수 있습니다:

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

    return $request->user()->checkout($order->price_ids, [
        'success_url' => route('checkout-success').'?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => route('checkout-cancel'),
        'metadata' => ['order_id' => $order->id],
    ]);
})->name('checkout');
```

위 예시에서 볼 수 있듯이, 사용자가 결제 과정을 시작하면 카트/주문에 연결된 모든 Stripe 가격 식별자를 `checkout` 메서드에 전달합니다. 물론, 고객이 상품을 추가할 때 이 항목들을 "장바구니" 또는 주문과 연결하는 것은 애플리케이션의 책임입니다. 또한, `metadata` 배열을 통해 주문의 ID를 Stripe Checkout 세션에 전달합니다. 마지막으로, Checkout 성공 라우트에 `CHECKOUT_SESSION_ID` 템플릿 변수를 추가했습니다. Stripe가 고객을 애플리케이션으로 리디렉션할 때 이 템플릿 변수는 Checkout 세션 ID로 자동 채워집니다.

다음으로, Checkout 성공 라우트를 만들어보겠습니다. 이 라우트는 Stripe Checkout을 통해 결제가 완료된 후 사용자가 리디렉션되는 경로입니다. 이 라우트 내에서 Stripe Checkout 세션 ID와 관련된 Stripe Checkout 인스턴스를 조회하여, 제공한 메타데이터에 접근하고 고객의 주문을 적절히 업데이트할 수 있습니다:

```php
use App\Models\Order;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;

Route::get('/checkout/success', function (Request $request) {
    $sessionId = $request->get('session_id');

    if ($sessionId === null) {
        return;
    }

    $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

    if ($session->payment_status !== 'paid') {
        return;
    }

    $orderId = $session['metadata']['order_id'] ?? null;

    $order = Order::findOrFail($orderId);

    $order->update(['status' => 'completed']);

    return view('checkout-success', ['order' => $order]);
})->name('checkout-success');
```

Checkout 세션 객체에 포함된 [데이터에 대한 자세한 내용은 Stripe 문서](https://stripe.com/docs/api/checkout/sessions/object)를 참고하세요.


### 구독 판매하기 {#quickstart-selling-subscriptions}

> [!NOTE]
> Stripe Checkout을 사용하기 전에, Stripe 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한, [Cashier의 웹훅 처리](#handling-stripe-webhooks)를 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 결제를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Stripe Checkout](https://stripe.com/payments/checkout) 덕분에, 현대적이고 견고한 결제 통합을 쉽게 구축할 수 있습니다.

Cashier와 Stripe Checkout을 사용하여 구독을 판매하는 방법을 알아보기 위해, 기본 월간(`price_basic_monthly`) 및 연간(`price_basic_yearly`) 요금제가 있는 구독 서비스의 간단한 시나리오를 살펴보겠습니다. 이 두 가격은 Stripe 대시보드의 "Basic" 상품(`pro_basic`) 아래에 그룹화할 수 있습니다. 또한, 구독 서비스는 `pro_expert`라는 Expert 요금제를 제공할 수도 있습니다.

먼저, 고객이 어떻게 우리 서비스에 구독할 수 있는지 알아보겠습니다. 물론, 고객이 애플리케이션의 요금제 페이지에서 Basic 요금제의 "구독" 버튼을 클릭한다고 상상할 수 있습니다. 이 버튼이나 링크는 사용자가 선택한 요금제에 대한 Stripe Checkout 세션을 생성하는 Laravel 라우트로 이동해야 합니다:

```php
use Illuminate\Http\Request;

Route::get('/subscription-checkout', function (Request $request) {
    return $request->user()
        ->newSubscription('default', 'price_basic_monthly')
        ->trialDays(5)
        ->allowPromotionCodes()
        ->checkout([
            'success_url' => route('your-success-route'),
            'cancel_url' => route('your-cancel-route'),
        ]);
});
```

위 예시에서 볼 수 있듯이, 고객은 Stripe Checkout 세션으로 리디렉션되어 Basic 요금제에 구독할 수 있습니다. 결제가 성공적으로 완료되거나 취소되면, 고객은 `checkout` 메서드에 제공한 URL로 다시 리디렉션됩니다. 실제로 구독이 시작된 시점을 알기 위해(일부 결제 수단은 처리에 몇 초가 걸릴 수 있으므로), [Cashier의 웹훅 처리](#handling-stripe-webhooks)도 설정해야 합니다.

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

편의를 위해, 들어오는 요청이 구독한 사용자에게서 온 것인지 확인하는 [미들웨어](/laravel/12.x/middleware)를 생성할 수 있습니다. 이 미들웨어를 정의한 후에는, 구독하지 않은 사용자가 해당 라우트에 접근하지 못하도록 라우트에 쉽게 할당할 수 있습니다:

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
            return redirect('/billing');
        }

        return $next($request);
    }
}
```

미들웨어를 정의한 후에는, 라우트에 할당할 수 있습니다:

```php
use App\Http\Middleware\Subscribed;

Route::get('/dashboard', function () {
    // ...
})->middleware([Subscribed::class]);
```


#### 고객이 결제 플랜을 관리할 수 있도록 허용하기 {#quickstart-allowing-customers-to-manage-their-billing-plan}

물론, 고객은 자신의 구독 플랜을 다른 상품이나 "티어"로 변경하고 싶어할 수 있습니다. 이를 가장 쉽게 허용하는 방법은 Stripe의 [고객 결제 포털](https://stripe.com/docs/no-code/customer-portal)로 고객을 안내하는 것입니다. 이 포털은 고객이 인보이스를 다운로드하고, 결제 수단을 업데이트하며, 구독 플랜을 변경할 수 있는 호스팅된 사용자 인터페이스를 제공합니다.

먼저, 애플리케이션 내에 사용자를 Laravel 라우트로 안내하는 링크나 버튼을 정의합니다. 이 라우트는 결제 포털 세션을 시작하는 데 사용됩니다:

```blade
<a href="{{ route('billing') }}">
    결제
</a>
```

다음으로, Stripe 고객 결제 포털 세션을 시작하고 사용자를 포털로 리디렉션하는 라우트를 정의해봅시다. `redirectToBillingPortal` 메서드는 사용자가 포털을 종료할 때 돌아올 URL을 인자로 받습니다:

```php
use Illuminate\Http\Request;

Route::get('/billing', function (Request $request) {
    return $request->user()->redirectToBillingPortal(route('dashboard'));
})->middleware(['auth'])->name('billing');
```

> [!NOTE]
> Cashier의 웹훅 처리가 구성되어 있다면, Cashier는 Stripe에서 들어오는 웹훅을 검사하여 애플리케이션의 Cashier 관련 데이터베이스 테이블을 자동으로 동기화합니다. 예를 들어, 사용자가 Stripe의 고객 결제 포털을 통해 구독을 취소하면, Cashier는 해당 웹훅을 받아 애플리케이션 데이터베이스에서 해당 구독을 "취소됨"으로 표시합니다.


## 고객 {#customers}


### 고객 조회하기 {#retrieving-customers}

`Cashier::findBillable` 메서드를 사용하여 Stripe ID로 고객을 조회할 수 있습니다. 이 메서드는 청구 가능한 모델의 인스턴스를 반환합니다:

```php
use Laravel\Cashier\Cashier;

$user = Cashier::findBillable($stripeId);
```


### 고객 생성하기 {#creating-customers}

가끔은 구독을 시작하지 않고 Stripe 고객을 생성하고 싶을 때가 있습니다. 이럴 때는 `createAsStripeCustomer` 메서드를 사용할 수 있습니다:

```php
$stripeCustomer = $user->createAsStripeCustomer();
```

고객이 Stripe에 생성된 후, 나중에 구독을 시작할 수 있습니다. Stripe API에서 지원하는 [고객 생성 파라미터](https://stripe.com/docs/api/customers/create)를 추가로 전달하고 싶다면, 선택적으로 `$options` 배열을 제공할 수 있습니다:

```php
$stripeCustomer = $user->createAsStripeCustomer($options);
```

청구 가능한 모델에 대해 Stripe 고객 객체를 반환하고 싶다면 `asStripeCustomer` 메서드를 사용할 수 있습니다:

```php
$stripeCustomer = $user->asStripeCustomer();
```

청구 가능한 모델이 이미 Stripe에 고객으로 등록되어 있는지 확실하지 않은 경우, 해당 모델의 Stripe 고객 객체를 가져오고 싶다면 `createOrGetStripeCustomer` 메서드를 사용할 수 있습니다. 이 메서드는 Stripe에 고객이 존재하지 않으면 새로 생성합니다:

```php
$stripeCustomer = $user->createOrGetStripeCustomer();
```


### 고객 정보 업데이트 {#updating-customers}

가끔 Stripe 고객에게 추가 정보를 직접 업데이트하고 싶을 때가 있습니다. 이때는 `updateStripeCustomer` 메서드를 사용하면 됩니다. 이 메서드는 [Stripe API에서 지원하는 고객 업데이트 옵션](https://stripe.com/docs/api/customers/update) 배열을 인수로 받습니다:

```php
$stripeCustomer = $user->updateStripeCustomer($options);
```


### 잔액 {#balances}

Stripe는 고객의 "잔액"을 입금(credit)하거나 출금(debit)할 수 있도록 지원합니다. 이후 이 잔액은 새 인보이스에 입금 또는 출금됩니다. 고객의 총 잔액을 확인하려면, 청구 가능 모델에서 제공되는 `balance` 메서드를 사용할 수 있습니다. `balance` 메서드는 고객의 통화로 포맷된 문자열 형태의 잔액을 반환합니다:

```php
$balance = $user->balance();
```

고객의 잔액을 입금하려면, `creditBalance` 메서드에 값을 전달하면 됩니다. 원한다면 설명도 함께 제공할 수 있습니다:

```php
$user->creditBalance(500, '프리미엄 고객 충전.');
```

`debitBalance` 메서드에 값을 전달하면 고객의 잔액이 출금됩니다:

```php
$user->debitBalance(300, '잘못된 사용에 대한 패널티.');
```

`applyBalance` 메서드는 고객을 위한 새로운 잔액 거래를 생성합니다. 이러한 거래 기록은 `balanceTransactions` 메서드를 사용해 조회할 수 있으며, 고객이 입금 및 출금 내역을 확인할 수 있도록 로그를 제공하는 데 유용합니다:

```php
// 모든 거래 내역 조회...
$transactions = $user->balanceTransactions();

foreach ($transactions as $transaction) {
    // 거래 금액...
    $amount = $transaction->amount(); // $2.31

    // 관련 인보이스가 있을 경우 조회...
    $invoice = $transaction->invoice();
}
```


### 세금 ID {#tax-ids}

Cashier는 고객의 세금 ID를 쉽게 관리할 수 있는 방법을 제공합니다. 예를 들어, `taxIds` 메서드를 사용하면 고객에게 할당된 모든 [세금 ID](https://stripe.com/docs/api/customer_tax_ids/object)를 컬렉션으로 가져올 수 있습니다:

```php
$taxIds = $user->taxIds();
```

또한, 식별자를 통해 고객의 특정 세금 ID를 조회할 수도 있습니다:

```php
$taxId = $user->findTaxId('txi_belgium');
```

유효한 [타입](https://stripe.com/docs/api/customer_tax_ids/object#tax_id_object-type)과 값을 `createTaxId` 메서드에 전달하여 새로운 세금 ID를 생성할 수 있습니다:

```php
$taxId = $user->createTaxId('eu_vat', 'BE0123456789');
```

`createTaxId` 메서드는 즉시 고객 계정에 VAT ID를 추가합니다. [VAT ID의 검증은 Stripe에서 처리](https://stripe.com/docs/invoicing/customer/tax-ids#validation)되지만, 이 과정은 비동기적으로 진행됩니다. `customer.tax_id.updated` 웹훅 이벤트를 구독하고 [VAT ID의 `verification` 파라미터](https://stripe.com/docs/api/customer_tax_ids/object#tax_id_object-verification)를 확인하여 검증 업데이트를 알림받을 수 있습니다. 웹훅 처리에 대한 자세한 내용은 [웹훅 핸들러 정의 문서](#handling-stripe-webhooks)를 참고하세요.

`deleteTaxId` 메서드를 사용하여 세금 ID를 삭제할 수 있습니다:

```php
$user->deleteTaxId('txi_belgium');
```


### Stripe와 고객 데이터 동기화 {#syncing-customer-data-with-stripe}

일반적으로, 애플리케이션의 사용자가 이름, 이메일 주소 또는 Stripe에도 저장되는 기타 정보를 업데이트할 때, Stripe에 해당 변경 사항을 알려야 합니다. 이렇게 하면 Stripe에 저장된 정보가 애플리케이션의 정보와 동기화됩니다.

이를 자동화하기 위해, 청구 모델의 `updated` 이벤트에 반응하는 이벤트 리스너를 정의할 수 있습니다. 그런 다음, 이벤트 리스너 내에서 모델의 `syncStripeCustomerDetails` 메서드를 호출할 수 있습니다:

```php
use App\Models\User;
use function Illuminate\Events\queueable;

/**
 * 모델의 "booted" 메서드.
 */
protected static function booted(): void
{
    static::updated(queueable(function (User $customer) {
        if ($customer->hasStripeId()) {
            $customer->syncStripeCustomerDetails();
        }
    }));
}
```

이제 고객 모델이 업데이트될 때마다 해당 정보가 Stripe와 동기화됩니다. 편의를 위해, Cashier는 고객이 처음 생성될 때 자동으로 Stripe와 고객 정보를 동기화합니다.

Stripe로 동기화할 고객 정보의 컬럼을 커스터마이즈하려면 Cashier에서 제공하는 다양한 메서드를 오버라이드할 수 있습니다. 예를 들어, Cashier가 Stripe로 고객 정보를 동기화할 때 "이름"으로 간주할 속성을 커스터마이즈하려면 `stripeName` 메서드를 오버라이드할 수 있습니다:

```php
/**
 * Stripe로 동기화할 고객 이름을 가져옵니다.
 */
public function stripeName(): string|null
{
    return $this->company_name;
}
```

마찬가지로, `stripeEmail`, `stripePhone`, `stripeAddress`, `stripePreferredLocales` 메서드도 오버라이드할 수 있습니다. 이 메서드들은 [Stripe 고객 객체를 업데이트할 때](https://stripe.com/docs/api/customers/update) 해당 고객 파라미터로 정보를 동기화합니다. 고객 정보 동기화 과정을 완전히 제어하고 싶다면, `syncStripeCustomerDetails` 메서드를 오버라이드할 수 있습니다.


### 결제 포털 {#billing-portal}

Stripe는 고객이 자신의 구독, 결제 수단을 관리하고 결제 내역을 확인할 수 있도록 [간편하게 결제 포털을 설정하는 방법](https://stripe.com/docs/billing/subscriptions/customer-portal)을 제공합니다. 컨트롤러나 라우트에서 청구 가능한 모델의 `redirectToBillingPortal` 메서드를 호출하여 사용자를 결제 포털로 리디렉션할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/billing-portal', function (Request $request) {
    return $request->user()->redirectToBillingPortal();
});
```

기본적으로 사용자가 구독 관리를 마치면 Stripe 결제 포털 내의 링크를 통해 애플리케이션의 `home` 라우트로 돌아올 수 있습니다. 사용자가 돌아와야 할 커스텀 URL을 지정하려면, 해당 URL을 `redirectToBillingPortal` 메서드의 인자로 전달하면 됩니다:

```php
use Illuminate\Http\Request;

Route::get('/billing-portal', function (Request $request) {
    return $request->user()->redirectToBillingPortal(route('billing'));
});
```

HTTP 리디렉션 응답을 생성하지 않고 결제 포털의 URL만 생성하고 싶다면, `billingPortalUrl` 메서드를 호출하면 됩니다:

```php
$url = $request->user()->billingPortalUrl(route('billing'));
```


## 결제 수단 {#payment-methods}


### 결제 수단 저장하기 {#storing-payment-methods}

Stripe로 구독을 생성하거나 "일회성" 결제를 수행하려면 결제 수단을 저장하고 Stripe에서 해당 식별자를 가져와야 합니다. 결제 수단을 구독에 사용할지, 단일 결제에 사용할지에 따라 접근 방식이 다르므로, 아래에서 두 가지 경우를 모두 살펴보겠습니다.


#### 구독을 위한 결제 수단 {#payment-methods-for-subscriptions}

구독을 위해 고객의 신용카드 정보를 저장할 때는 Stripe의 "Setup Intents" API를 사용하여 고객의 결제 수단 정보를 안전하게 수집해야 합니다. "Setup Intent"는 Stripe에 고객의 결제 수단으로 결제할 의도가 있음을 알립니다. Cashier의 `Billable` 트레이트에는 새로운 Setup Intent를 쉽게 생성할 수 있는 `createSetupIntent` 메서드가 포함되어 있습니다. 이 메서드는 고객의 결제 수단 정보를 수집하는 폼을 렌더링하는 라우트나 컨트롤러에서 호출해야 합니다:

```php
return view('update-payment-method', [
    'intent' => $user->createSetupIntent()
]);
```

Setup Intent를 생성하여 뷰에 전달한 후에는, 해당 secret을 결제 수단을 수집할 요소에 첨부해야 합니다. 예를 들어, 다음은 "결제 수단 업데이트" 폼입니다:

```html
<input id="card-holder-name" type="text">

<!-- Stripe Elements Placeholder -->
<div id="card-element"></div>

<button id="card-button" data-secret="{{ $intent->client_secret }}">
    결제 수단 업데이트
</button>
```

다음으로, Stripe.js 라이브러리를 사용하여 [Stripe Element](https://stripe.com/docs/stripe-js)를 폼에 연결하고 고객의 결제 정보를 안전하게 수집할 수 있습니다:

```html
<script src="https://js.stripe.com/v3/"></script>

<script>
    const stripe = Stripe('stripe-public-key');

    const elements = stripe.elements();
    const cardElement = elements.create('card');

    cardElement.mount('#card-element');
</script>
```

그 다음, 카드를 인증하고 Stripe의 [Stripe의 `confirmCardSetup` 메서드](https://stripe.com/docs/js/setup_intents/confirm_card_setup)를 사용하여 안전한 "결제 수단 식별자"를 가져올 수 있습니다:

```js
const cardHolderName = document.getElementById('card-holder-name');
const cardButton = document.getElementById('card-button');
const clientSecret = cardButton.dataset.secret;

cardButton.addEventListener('click', async (e) => {
    const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: { name: cardHolderName.value }
            }
        }
    );

    if (error) {
        // "error.message"를 사용자에게 표시...
    } else {
        // 카드가 성공적으로 인증되었습니다...
    }
});
```

카드가 Stripe에 의해 인증된 후에는, 결과로 나온 `setupIntent.payment_method` 식별자를 Laravel 애플리케이션에 전달하여 고객에게 연결할 수 있습니다. 결제 수단은 [새 결제 수단으로 추가](#adding-payment-methods)하거나 [기본 결제 수단을 업데이트](#updating-the-default-payment-method)하는 데 사용할 수 있습니다. 또한 결제 수단 식별자를 즉시 사용하여 [새 구독을 생성](#creating-subscriptions)할 수도 있습니다.

> [!NOTE]
> Setup Intents와 고객 결제 정보 수집에 대해 더 자세한 정보를 원하신다면 [Stripe에서 제공하는 이 개요](https://stripe.com/docs/payments/save-and-reuse#php)를 참고하세요.


#### 단일 결제에 대한 결제 수단 {#payment-methods-for-single-charges}

물론, 고객의 결제 수단에 대해 단일 결제를 진행할 때는 결제 수단 식별자를 한 번만 사용하면 됩니다. Stripe의 제한으로 인해, 단일 결제에서는 고객의 저장된 기본 결제 수단을 사용할 수 없습니다. Stripe.js 라이브러리를 사용하여 고객이 직접 결제 수단 정보를 입력하도록 해야 합니다. 예를 들어, 다음과 같은 폼을 생각해볼 수 있습니다:

```html
<input id="card-holder-name" type="text">

<!-- Stripe Elements Placeholder -->
<div id="card-element"></div>

<button id="card-button">
    결제 진행
</button>
```

이와 같은 폼을 정의한 후, Stripe.js 라이브러리를 사용하여 [Stripe Element](https://stripe.com/docs/stripe-js)를 폼에 연결하고 고객의 결제 정보를 안전하게 수집할 수 있습니다:

```html
<script src="https://js.stripe.com/v3/"></script>

<script>
    const stripe = Stripe('stripe-public-key');

    const elements = stripe.elements();
    const cardElement = elements.create('card');

    cardElement.mount('#card-element');
</script>
```

다음으로, 카드를 인증하고 Stripe의 [Stripe의 `createPaymentMethod` 메서드](https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method)를 사용하여 안전한 "결제 수단 식별자"를 받아올 수 있습니다:

```js
const cardHolderName = document.getElementById('card-holder-name');
const cardButton = document.getElementById('card-button');

cardButton.addEventListener('click', async (e) => {
    const { paymentMethod, error } = await stripe.createPaymentMethod(
        'card', cardElement, {
            billing_details: { name: cardHolderName.value }
        }
    );

    if (error) {
        // "error.message"를 사용자에게 표시...
    } else {
        // 카드가 성공적으로 인증됨...
    }
});
```

카드가 성공적으로 인증되면, `paymentMethod.id`를 Laravel 애플리케이션에 전달하여 [단일 결제](#simple-charge)를 처리할 수 있습니다.


### 결제 수단 조회하기 {#retrieving-payment-methods}

청구 가능 모델 인스턴스에서 `paymentMethods` 메서드는 `Laravel\Cashier\PaymentMethod` 인스턴스들의 컬렉션을 반환합니다:

```php
$paymentMethods = $user->paymentMethods();
```

기본적으로 이 메서드는 모든 유형의 결제 수단을 반환합니다. 특정 유형의 결제 수단만 조회하려면, 메서드에 `type`을 인수로 전달할 수 있습니다:

```php
$paymentMethods = $user->paymentMethods('sepa_debit');
```

고객의 기본 결제 수단을 조회하려면, `defaultPaymentMethod` 메서드를 사용할 수 있습니다:

```php
$paymentMethod = $user->defaultPaymentMethod();
```

청구 가능 모델에 연결된 특정 결제 수단을 조회하려면, `findPaymentMethod` 메서드를 사용할 수 있습니다:

```php
$paymentMethod = $user->findPaymentMethod($paymentMethodId);
```


### 결제 수단 존재 여부 {#payment-method-presence}

청구 가능한 모델에 기본 결제 수단이 계정에 연결되어 있는지 확인하려면 `hasDefaultPaymentMethod` 메서드를 호출하세요:

```php
if ($user->hasDefaultPaymentMethod()) {
    // ...
}
```

청구 가능한 모델에 하나 이상의 결제 수단이 계정에 연결되어 있는지 확인하려면 `hasPaymentMethod` 메서드를 사용할 수 있습니다:

```php
if ($user->hasPaymentMethod()) {
    // ...
}
```

이 메서드는 청구 가능한 모델에 결제 수단이 하나라도 있는지 확인합니다. 특정 유형의 결제 수단이 모델에 존재하는지 확인하려면, 메서드에 `type`을 인수로 전달할 수 있습니다:

```php
if ($user->hasPaymentMethod('sepa_debit')) {
    // ...
}
```


### 기본 결제 수단 업데이트 {#updating-the-default-payment-method}

`updateDefaultPaymentMethod` 메서드는 고객의 기본 결제 수단 정보를 업데이트하는 데 사용할 수 있습니다. 이 메서드는 Stripe 결제 수단 식별자를 인수로 받아 새로운 결제 수단을 기본 청구 결제 수단으로 지정합니다:

```php
$user->updateDefaultPaymentMethod($paymentMethod);
```

기본 결제 수단 정보를 Stripe의 고객 기본 결제 수단 정보와 동기화하려면 `updateDefaultPaymentMethodFromStripe` 메서드를 사용할 수 있습니다:

```php
$user->updateDefaultPaymentMethodFromStripe();
```

> [!WARNING]
> 고객의 기본 결제 수단은 인보이스 발행 및 신규 구독 생성에만 사용할 수 있습니다. Stripe의 제한으로 인해 단일 결제에는 사용할 수 없습니다.


### 결제 수단 추가하기 {#adding-payment-methods}

새로운 결제 수단을 추가하려면, 결제 가능(Billable) 모델에서 `addPaymentMethod` 메서드를 호출하고 결제 수단 식별자를 전달하면 됩니다:

```php
$user->addPaymentMethod($paymentMethod);
```

> [!NOTE]
> 결제 수단 식별자를 가져오는 방법에 대해서는 [결제 수단 저장 문서](#storing-payment-methods)를 참고하세요.


### 결제 수단 삭제하기 {#deleting-payment-methods}

결제 수단을 삭제하려면, 삭제하려는 `Laravel\Cashier\PaymentMethod` 인스턴스에서 `delete` 메서드를 호출하면 됩니다:

```php
$paymentMethod->delete();
```

`deletePaymentMethod` 메서드는 청구 가능 모델에서 특정 결제 수단을 삭제합니다:

```php
$user->deletePaymentMethod('pm_visa');
```

`deletePaymentMethods` 메서드는 청구 가능 모델의 모든 결제 수단 정보를 삭제합니다:

```php
$user->deletePaymentMethods();
```

기본적으로 이 메서드는 모든 유형의 결제 수단을 삭제합니다. 특정 유형의 결제 수단만 삭제하려면 `type`을 인수로 전달할 수 있습니다:

```php
$user->deletePaymentMethods('sepa_debit');
```

> [!WARNING]
> 사용자가 활성 구독을 가지고 있다면, 애플리케이션에서 기본 결제 수단을 삭제하지 못하도록 해야 합니다.


## 구독 {#subscriptions}

구독은 고객을 위한 반복 결제 방식을 제공합니다. Cashier에서 관리하는 Stripe 구독은 여러 구독 가격, 구독 수량, 체험 기간 등 다양한 기능을 지원합니다.


### 구독 생성하기 {#creating-subscriptions}

구독을 생성하려면, 먼저 과금 가능한 모델의 인스턴스를 가져와야 합니다. 일반적으로 이는 `App\Models\User`의 인스턴스가 됩니다. 모델 인스턴스를 가져온 후에는 `newSubscription` 메서드를 사용하여 해당 모델의 구독을 생성할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription(
        'default', 'price_monthly'
    )->create($request->paymentMethodId);

    // ...
});
```

`newSubscription` 메서드에 전달되는 첫 번째 인수는 구독의 내부 타입이어야 합니다. 애플리케이션에서 단일 구독만 제공한다면, 이를 `default` 또는 `primary`로 지정할 수 있습니다. 이 구독 타입은 내부 애플리케이션 용도로만 사용되며, 사용자에게 표시되지 않습니다. 또한, 공백이 포함되어서는 안 되며, 구독을 생성한 후에는 절대 변경해서는 안 됩니다. 두 번째 인수는 사용자가 구독할 특정 가격입니다. 이 값은 Stripe의 가격 식별자와 일치해야 합니다.

[a Stripe 결제 수단 식별자](#storing-payment-methods) 또는 Stripe `PaymentMethod` 객체를 인수로 받는 `create` 메서드는 구독을 시작하고, 과금 가능한 모델의 Stripe 고객 ID 및 기타 관련 결제 정보를 데이터베이스에 업데이트합니다.

> [!WARNING]
> 결제 수단 식별자를 `create` 구독 메서드에 직접 전달하면 해당 결제 수단이 자동으로 사용자의 저장된 결제 수단에도 추가됩니다.


#### 인보이스 이메일을 통한 반복 결제 수금 {#collecting-recurring-payments-via-invoice-emails}

고객의 반복 결제를 자동으로 수금하는 대신, Stripe에 반복 결제일마다 고객에게 인보이스를 이메일로 전송하도록 지시할 수 있습니다. 그러면 고객은 인보이스를 받은 후 직접 결제를 진행할 수 있습니다. 인보이스를 통한 반복 결제 수금 시, 고객은 미리 결제 수단을 제공할 필요가 없습니다:

```php
$user->newSubscription('default', 'price_monthly')->createAndSendInvoice();
```

고객이 인보이스를 결제하지 않을 경우 구독이 취소되기까지의 기간은 `days_until_due` 옵션에 의해 결정됩니다. 기본값은 30일이지만, 원한다면 이 옵션에 특정 값을 지정할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')->createAndSendInvoice([], [
    'days_until_due' => 30
]);
```


#### 수량 {#subscription-quantities}

구독을 생성할 때 가격에 대해 특정 [수량](https://stripe.com/docs/billing/subscriptions/quantities)을 설정하고 싶다면, 구독을 생성하기 전에 구독 빌더에서 `quantity` 메서드를 호출해야 합니다:

```php
$user->newSubscription('default', 'price_monthly')
    ->quantity(5)
    ->create($paymentMethod);
```


#### 추가 세부 정보 {#additional-details}

Stripe에서 지원하는 추가 [고객](https://stripe.com/docs/api/customers/create) 또는 [구독](https://stripe.com/docs/api/subscriptions/create) 옵션을 지정하고 싶다면, `create` 메서드의 두 번째와 세 번째 인수로 전달하면 됩니다:

```php
$user->newSubscription('default', 'price_monthly')->create($paymentMethod, [
    'email' => $email,
], [
    'metadata' => ['note' => 'Some extra information.'],
]);
```


#### 쿠폰 {#coupons}

구독을 생성할 때 쿠폰을 적용하고 싶다면, `withCoupon` 메서드를 사용할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')
    ->withCoupon('code')
    ->create($paymentMethod);
```

또는, [Stripe 프로모션 코드](https://stripe.com/docs/billing/subscriptions/discounts/codes)를 적용하고 싶다면, `withPromotionCode` 메서드를 사용할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')
    ->withPromotionCode('promo_code_id')
    ->create($paymentMethod);
```

여기서 입력하는 프로모션 코드 ID는 고객이 보는 코드가 아니라 Stripe API에서 할당된 프로모션 코드의 ID여야 합니다. 고객이 보는 프로모션 코드로부터 프로모션 코드 ID를 찾으려면, `findPromotionCode` 메서드를 사용할 수 있습니다:

```php
// 고객이 보는 코드로 프로모션 코드 ID 찾기...
$promotionCode = $user->findPromotionCode('SUMMERSALE');

// 활성화된 프로모션 코드 ID를 고객이 보는 코드로 찾기...
$promotionCode = $user->findActivePromotionCode('SUMMERSALE');
```

위 예시에서 반환된 `$promotionCode` 객체는 `Laravel\Cashier\PromotionCode`의 인스턴스입니다. 이 클래스는 내부적으로 `Stripe\PromotionCode` 객체를 감쌉니다. 프로모션 코드와 관련된 쿠폰을 가져오려면 `coupon` 메서드를 호출하면 됩니다:

```php
$coupon = $user->findPromotionCode('SUMMERSALE')->coupon();
```

쿠폰 인스턴스를 통해 할인 금액과 쿠폰이 고정 금액 할인인지, 퍼센트 할인인지를 확인할 수 있습니다:

```php
if ($coupon->isPercentage()) {
    return $coupon->percentOff().'%'; // 21.5%
} else {
    return $coupon->amountOff(); // $5.99
}
```

또한, 현재 고객이나 구독에 적용된 할인 정보를 조회할 수도 있습니다:

```php
$discount = $billable->discount();

$discount = $subscription->discount();
```

반환된 `Laravel\Cashier\Discount` 인스턴스는 내부적으로 `Stripe\Discount` 객체를 감쌉니다. 이 할인과 관련된 쿠폰을 가져오려면 `coupon` 메서드를 호출하면 됩니다:

```php
$coupon = $subscription->discount()->coupon();
```

고객이나 구독에 새로운 쿠폰 또는 프로모션 코드를 적용하고 싶다면, `applyCoupon` 또는 `applyPromotionCode` 메서드를 사용할 수 있습니다:

```php
$billable->applyCoupon('coupon_id');
$billable->applyPromotionCode('promotion_code_id');

$subscription->applyCoupon('coupon_id');
$subscription->applyPromotionCode('promotion_code_id');
```

Stripe API에서 할당된 프로모션 코드 ID를 사용해야 하며, 고객이 보는 프로모션 코드를 사용하면 안 됩니다. 한 번에 한 개의 쿠폰 또는 프로모션 코드만 고객이나 구독에 적용할 수 있습니다.

이 주제에 대한 더 자세한 내용은 Stripe의 [쿠폰](https://stripe.com/docs/billing/subscriptions/coupons) 및 [프로모션 코드](https://stripe.com/docs/billing/subscriptions/coupons/codes) 문서를 참고하세요.


#### 구독 추가하기 {#adding-subscriptions}

이미 기본 결제 수단이 있는 고객에게 구독을 추가하고 싶다면, 구독 빌더에서 `add` 메서드를 호출하면 됩니다:

```php
use App\Models\User;

$user = User::find(1);

$user->newSubscription('default', 'price_monthly')->add();
```


#### Stripe 대시보드에서 구독 생성하기 {#creating-subscriptions-from-the-stripe-dashboard}

Stripe 대시보드 자체에서 구독을 생성할 수도 있습니다. 이 경우, Cashier는 새로 추가된 구독을 동기화하고 `default` 유형을 할당합니다. 대시보드에서 생성된 구독에 할당되는 구독 유형을 커스터마이즈하려면, [웹훅 이벤트 핸들러를 정의](#defining-webhook-event-handlers)하세요.

또한 Stripe 대시보드를 통해서는 한 가지 유형의 구독만 생성할 수 있습니다. 애플리케이션에서 여러 유형의 구독을 제공하는 경우, Stripe 대시보드를 통해서는 한 가지 유형의 구독만 추가할 수 있습니다.

마지막으로, 애플리케이션에서 제공하는 각 구독 유형마다 하나의 활성 구독만 추가해야 합니다. 만약 한 고객이 두 개의 `default` 구독을 가지고 있다면, 두 구독 모두 애플리케이션의 데이터베이스와 동기화되더라도 Cashier는 가장 최근에 추가된 구독만 사용합니다.


### 구독 상태 확인하기 {#checking-subscription-status}

고객이 애플리케이션에 구독한 후에는 다양한 편리한 메서드를 사용하여 쉽게 구독 상태를 확인할 수 있습니다. 먼저, `subscribed` 메서드는 고객이 활성 구독 중이라면(심지어 현재 체험 기간 중이더라도) `true`를 반환합니다. `subscribed` 메서드는 구독 유형을 첫 번째 인수로 받습니다:

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
        if ($request->user() && ! $request->user()->subscribed('default')) {
            // 이 사용자는 유료 고객이 아닙니다...
            return redirect('/billing');
        }

        return $next($request);
    }
}
```

사용자가 아직 체험 기간 내에 있는지 확인하고 싶다면 `onTrial` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 아직 체험 기간 중임을 알리는 경고를 표시할지 결정할 때 유용합니다:

```php
if ($user->subscription('default')->onTrial()) {
    // ...
}
```

`subscribedToProduct` 메서드는 주어진 Stripe 상품 식별자를 기반으로 사용자가 특정 상품에 구독되어 있는지 확인할 때 사용할 수 있습니다. Stripe에서 상품은 가격의 모음입니다. 이 예제에서는 사용자의 `default` 구독이 애플리케이션의 "premium" 상품에 활성 구독되어 있는지 확인합니다. 전달된 Stripe 상품 식별자는 Stripe 대시보드에 있는 상품 식별자 중 하나와 일치해야 합니다:

```php
if ($user->subscribedToProduct('prod_premium', 'default')) {
    // ...
}
```

배열을 `subscribedToProduct` 메서드에 전달하면 사용자의 `default` 구독이 애플리케이션의 "basic" 또는 "premium" 상품에 활성 구독되어 있는지 확인할 수 있습니다:

```php
if ($user->subscribedToProduct(['prod_basic', 'prod_premium'], 'default')) {
    // ...
}
```

`subscribedToPrice` 메서드는 고객의 구독이 특정 가격 ID에 해당하는지 확인할 때 사용할 수 있습니다:

```php
if ($user->subscribedToPrice('price_basic_monthly', 'default')) {
    // ...
}
```

`recurring` 메서드는 사용자가 현재 구독 중이며 더 이상 체험 기간이 아닌지 확인할 때 사용할 수 있습니다:

```php
if ($user->subscription('default')->recurring()) {
    // ...
}
```

> [!WARNING]
> 사용자가 동일한 유형의 구독을 두 개 가지고 있다면, `subscription` 메서드는 항상 가장 최근의 구독을 반환합니다. 예를 들어, 사용자가 `default` 유형의 구독 레코드를 두 개 가지고 있을 수 있습니다. 이 중 하나는 오래된 만료된 구독이고, 다른 하나는 현재 활성 구독일 수 있습니다. 가장 최근의 구독이 항상 반환되며, 이전 구독은 이력 확인을 위해 데이터베이스에 보관됩니다.


#### 취소된 구독 상태 {#cancelled-subscription-status}

사용자가 한때 활성 구독자였으나 구독을 취소했는지 확인하려면 `canceled` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription('default')->canceled()) {
    // ...
}
```

또한 사용자가 구독을 취소했지만 구독이 완전히 만료되기 전까지 "유예 기간"에 있는지도 확인할 수 있습니다. 예를 들어, 사용자가 3월 5일에 구독을 취소했지만 원래 만료일이 3월 10일이라면, 사용자는 3월 10일까지 "유예 기간"에 있게 됩니다. 이 기간 동안에도 `subscribed` 메서드는 여전히 `true`를 반환한다는 점에 유의하세요:

```php
if ($user->subscription('default')->onGracePeriod()) {
    // ...
}
```

사용자가 구독을 취소했고 더 이상 "유예 기간"에 있지 않은지 확인하려면 `ended` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription('default')->ended()) {
    // ...
}
```


#### 미완료 및 연체 상태 {#incomplete-and-past-due-status}

구독 생성 후 추가 결제 작업이 필요한 경우, 해당 구독은 `incomplete`(미완료) 상태로 표시됩니다. 구독 상태는 Cashier의 `subscriptions` 데이터베이스 테이블의 `stripe_status` 컬럼에 저장됩니다.

마찬가지로, 가격 변경 시 추가 결제 작업이 필요하면 구독은 `past_due`(연체) 상태로 표시됩니다. 구독이 이 두 상태 중 하나에 있을 때는 고객이 결제를 확인하기 전까지 활성화되지 않습니다. 구독에 미완료 결제가 있는지 확인하려면 청구 가능 모델 또는 구독 인스턴스에서 `hasIncompletePayment` 메서드를 사용할 수 있습니다:

```php
if ($user->hasIncompletePayment('default')) {
    // ...
}

if ($user->subscription('default')->hasIncompletePayment()) {
    // ...
}
```

구독에 미완료 결제가 있는 경우, 사용자를 Cashier의 결제 확인 페이지로 안내하고 `latestPayment` 식별자를 전달해야 합니다. 구독 인스턴스에서 제공하는 `latestPayment` 메서드를 사용하여 이 식별자를 가져올 수 있습니다:

```html
<a href="{{ route('cashier.payment', $subscription->latestPayment()->id) }}">
    결제를 확인해 주세요.
</a>
```

`past_due` 또는 `incomplete` 상태일 때도 구독을 활성 상태로 간주하고 싶다면, Cashier에서 제공하는 `keepPastDueSubscriptionsActive` 및 `keepIncompleteSubscriptionsActive` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드들은 `App\Providers\AppServiceProvider`의 `register` 메서드에서 호출해야 합니다:

```php
use Laravel\Cashier\Cashier;

/**
 * Register any application services.
 */
public function register(): void
{
    Cashier::keepPastDueSubscriptionsActive();
    Cashier::keepIncompleteSubscriptionsActive();
}
```

> [!WARNING]
> 구독이 `incomplete`(미완료) 상태일 때는 결제가 확인되기 전까지 변경할 수 없습니다. 따라서, 구독이 `incomplete` 상태일 때 `swap` 및 `updateQuantity` 메서드는 예외를 발생시킵니다.


#### 구독 스코프 {#subscription-scopes}

대부분의 구독 상태는 쿼리 스코프로도 제공되므로, 특정 상태에 있는 구독을 데이터베이스에서 쉽게 조회할 수 있습니다:

```php
// 모든 활성 구독을 가져옵니다...
$subscriptions = Subscription::query()->active()->get();

// 사용자의 모든 취소된 구독을 가져옵니다...
$subscriptions = $user->subscriptions()->canceled()->get();
```

사용 가능한 스코프의 전체 목록은 아래와 같습니다:

```php
Subscription::query()->active();
Subscription::query()->canceled();
Subscription::query()->ended();
Subscription::query()->incomplete();
Subscription::query()->notCanceled();
Subscription::query()->notOnGracePeriod();
Subscription::query()->notOnTrial();
Subscription::query()->onGracePeriod();
Subscription::query()->onTrial();
Subscription::query()->pastDue();
Subscription::query()->recurring();
```


### 가격 변경하기 {#changing-prices}

고객이 애플리케이션에 구독한 후, 때때로 새로운 구독 가격으로 변경하고 싶어할 수 있습니다. 고객을 새로운 가격으로 변경하려면 Stripe 가격의 식별자를 `swap` 메서드에 전달하면 됩니다. 가격을 변경할 때, 사용자가 이전에 구독을 취소했다면 구독을 다시 활성화하기를 원하는 것으로 간주합니다. 전달하는 가격 식별자는 Stripe 대시보드에 등록된 Stripe 가격 식별자여야 합니다:

```php
use App\Models\User;

$user = App\Models\User::find(1);

$user->subscription('default')->swap('price_yearly');
```

고객이 체험 기간(trial) 중이라면, 체험 기간이 유지됩니다. 또한, 구독에 "수량(quantity)"이 존재한다면 그 수량도 유지됩니다.

가격을 변경하면서 고객이 현재 진행 중인 체험 기간을 취소하고 싶다면, `skipTrial` 메서드를 호출할 수 있습니다:

```php
$user->subscription('default')
    ->skipTrial()
    ->swap('price_yearly');
```

가격을 변경하면서 다음 결제 주기를 기다리지 않고 즉시 고객에게 청구서를 발행하고 싶다면, `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->swapAndInvoice('price_yearly');
```


#### 비례 배분 {#prorations}

기본적으로 Stripe는 가격을 변경할 때 요금을 비례 배분합니다. `noProrate` 메서드를 사용하면 요금을 비례 배분하지 않고 구독의 가격을 업데이트할 수 있습니다:

```php
$user->subscription('default')->noProrate()->swap('price_yearly');
```

구독 비례 배분에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/billing/subscriptions/prorations)를 참고하세요.

> [!WARNING]
> `swapAndInvoice` 메서드 전에 `noProrate` 메서드를 실행해도 비례 배분에는 아무런 영향이 없습니다. 인보이스는 항상 발행됩니다.


### 구독 수량 {#subscription-quantity}

때때로 구독은 "수량"에 따라 영향을 받을 수 있습니다. 예를 들어, 프로젝트 관리 애플리케이션이 프로젝트당 월 $10을 청구할 수 있습니다. `incrementQuantity`와 `decrementQuantity` 메서드를 사용하여 구독 수량을 쉽게 증가시키거나 감소시킬 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->subscription('default')->incrementQuantity();

// 구독의 현재 수량에 5를 더합니다...
$user->subscription('default')->incrementQuantity(5);

$user->subscription('default')->decrementQuantity();

// 구독의 현재 수량에서 5를 뺍니다...
$user->subscription('default')->decrementQuantity(5);
```

또는, `updateQuantity` 메서드를 사용하여 특정 수량으로 설정할 수도 있습니다:

```php
$user->subscription('default')->updateQuantity(10);
```

`noProrate` 메서드는 요금을 일할 계산하지 않고 구독 수량을 업데이트할 때 사용할 수 있습니다:

```php
$user->subscription('default')->noProrate()->updateQuantity(10);
```

구독 수량에 대한 더 자세한 내용은 [Stripe 문서](https://stripe.com/docs/subscriptions/quantities)를 참고하세요.


#### 여러 상품이 포함된 구독의 수량 {#quantities-for-subscription-with-multiple-products}

구독이 [여러 상품이 포함된 구독](#subscriptions-with-multiple-products)인 경우, 수량을 증가시키거나 감소시키려는 가격의 ID를 increment / decrement 메서드의 두 번째 인수로 전달해야 합니다:

```php
$user->subscription('default')->incrementQuantity(1, 'price_chat');
```


### 여러 상품이 포함된 구독 {#subscriptions-with-multiple-products}

[여러 상품이 포함된 구독](https://stripe.com/docs/billing/subscriptions/multiple-products)을 사용하면 하나의 구독에 여러 결제 상품을 할당할 수 있습니다. 예를 들어, 기본 구독 가격이 월 $10인 고객 서비스 "헬프데스크" 애플리케이션을 만들고, 여기에 월 $15의 라이브 채팅 추가 상품을 제공한다고 가정해봅시다. 여러 상품이 포함된 구독에 대한 정보는 Cashier의 `subscription_items` 데이터베이스 테이블에 저장됩니다.

`newSubscription` 메서드의 두 번째 인수로 가격 배열을 전달하여 특정 구독에 여러 상품을 지정할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription('default', [
        'price_monthly',
        'price_chat',
    ])->create($request->paymentMethodId);

    // ...
});
```

위 예제에서 고객은 `default` 구독에 두 개의 가격이 연결됩니다. 두 가격 모두 각자의 결제 주기에 따라 청구됩니다. 필요하다면, `quantity` 메서드를 사용하여 각 가격에 대한 수량을 지정할 수 있습니다:

```php
$user = User::find(1);

$user->newSubscription('default', ['price_monthly', 'price_chat'])
    ->quantity(5, 'price_chat')
    ->create($paymentMethod);
```

기존 구독에 다른 가격을 추가하고 싶다면, 구독의 `addPrice` 메서드를 호출할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->addPrice('price_chat');
```

위 예제는 새로운 가격을 추가하며, 고객은 다음 결제 주기에 해당 금액이 청구됩니다. 고객에게 즉시 청구하고 싶다면 `addPriceAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user->subscription('default')->addPriceAndInvoice('price_chat');
```

특정 수량으로 가격을 추가하고 싶다면, `addPrice` 또는 `addPriceAndInvoice` 메서드의 두 번째 인수로 수량을 전달할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->addPrice('price_chat', 5);
```

`removePrice` 메서드를 사용하여 구독에서 가격을 제거할 수 있습니다:

```php
$user->subscription('default')->removePrice('price_chat');
```

> [!WARNING]
> 구독에서 마지막 가격은 제거할 수 없습니다. 대신, 구독을 취소해야 합니다.


#### 가격 교체 {#swapping-prices}

여러 상품이 포함된 구독의 가격을 변경할 수도 있습니다. 예를 들어, 고객이 `price_basic` 구독과 `price_chat` 추가 상품을 가지고 있고, 이 고객을 `price_basic`에서 `price_pro`로 업그레이드하고 싶다고 가정해봅시다:

```php
use App\Models\User;

$user = User::find(1);

$user->subscription('default')->swap(['price_pro', 'price_chat']);
```

위 예제를 실행하면, `price_basic`이 포함된 기존 구독 항목은 삭제되고, `price_chat`이 포함된 항목은 유지됩니다. 또한, `price_pro`에 대한 새로운 구독 항목이 생성됩니다.

또한, `swap` 메서드에 키/값 쌍의 배열을 전달하여 구독 항목 옵션을 지정할 수도 있습니다. 예를 들어, 구독 가격의 수량을 지정해야 할 수도 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->swap([
    'price_pro' => ['quantity' => 5],
    'price_chat'
]);
```

구독에서 단일 가격만 교체하고 싶다면, 구독 항목 자체에서 `swap` 메서드를 사용하면 됩니다. 이 방법은 구독의 다른 가격에 대한 모든 기존 메타데이터를 그대로 유지하고 싶을 때 특히 유용합니다:

```php
$user = User::find(1);

$user->subscription('default')
    ->findItemOrFail('price_basic')
    ->swap('price_pro');
```


#### 비례 배분 {#proration}

기본적으로 Stripe는 여러 상품이 포함된 구독에서 가격을 추가하거나 제거할 때 요금을 비례 배분합니다. 비례 배분 없이 가격을 조정하고 싶다면, 가격 작업에 `noProrate` 메서드를 체이닝하면 됩니다:

```php
$user->subscription('default')->noProrate()->removePrice('price_chat');
```


#### 수량 {#swapping-quantities}

개별 구독 가격의 수량을 업데이트하고 싶다면, [기존 수량 메서드](#subscription-quantity)에 가격의 ID를 추가 인수로 전달하여 사용할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->incrementQuantity(5, 'price_chat');

$user->subscription('default')->decrementQuantity(3, 'price_chat');

$user->subscription('default')->updateQuantity(10, 'price_chat');
```

> [!WARNING]
> 하나의 구독에 여러 가격이 있을 경우, `Subscription` 모델의 `stripe_price`와 `quantity` 속성은 `null`이 됩니다. 개별 가격 속성에 접근하려면, `Subscription` 모델에서 제공하는 `items` 관계를 사용해야 합니다.


#### 구독 항목 {#subscription-items}

구독에 여러 가격이 있는 경우, 데이터베이스의 `subscription_items` 테이블에 여러 개의 구독 "항목"이 저장됩니다. 이 항목들은 구독의 `items` 관계를 통해 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$subscriptionItem = $user->subscription('default')->items->first();

// 특정 항목의 Stripe 가격과 수량을 가져옵니다...
$stripePrice = $subscriptionItem->stripe_price;
$quantity = $subscriptionItem->quantity;
```

`findItemOrFail` 메서드를 사용하여 특정 가격을 조회할 수도 있습니다:

```php
$user = User::find(1);

$subscriptionItem = $user->subscription('default')->findItemOrFail('price_chat');
```


### 다중 구독 {#multiple-subscriptions}

Stripe는 고객이 동시에 여러 개의 구독을 가질 수 있도록 허용합니다. 예를 들어, 헬스장을 운영하면서 수영 구독과 웨이트 트레이닝 구독을 제공할 수 있으며, 각 구독은 서로 다른 가격을 가질 수 있습니다. 물론, 고객은 두 플랜 중 하나 또는 모두를 구독할 수 있어야 합니다.

애플리케이션에서 구독을 생성할 때, `newSubscription` 메서드에 구독의 유형을 지정할 수 있습니다. 이 유형은 사용자가 시작하는 구독의 종류를 나타내는 임의의 문자열이 될 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/swimming/subscribe', function (Request $request) {
    $request->user()->newSubscription('swimming')
        ->price('price_swimming_monthly')
        ->create($request->paymentMethodId);

    // ...
});
```

이 예제에서는 고객에게 월간 수영 구독을 시작했습니다. 하지만, 나중에 연간 구독으로 변경하고 싶을 수도 있습니다. 고객의 구독을 조정할 때는 `swimming` 구독의 가격만 간단히 변경하면 됩니다:

```php
$user->subscription('swimming')->swap('price_swimming_yearly');
```

물론, 구독을 완전히 취소할 수도 있습니다:

```php
$user->subscription('swimming')->cancel();
```


### 사용량 기반 결제 {#usage-based-billing}

[사용량 기반 결제](https://stripe.com/docs/billing/subscriptions/metered-billing)는 고객이 결제 주기 동안 제품을 얼마나 사용했는지에 따라 요금을 청구할 수 있도록 해줍니다. 예를 들어, 고객이 한 달에 보낸 문자 메시지나 이메일의 수에 따라 요금을 청구할 수 있습니다.

사용량 기반 결제를 사용하려면 먼저 Stripe 대시보드에서 [사용량 기반 결제 모델](https://docs.stripe.com/billing/subscriptions/usage-based/implementation-guide)과 [미터기](https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage#configure-meter)가 적용된 새 제품을 생성해야 합니다. 미터기를 생성한 후에는 사용량을 보고하고 조회할 때 필요한 이벤트 이름과 미터기 ID를 저장하세요. 그런 다음, `meteredPrice` 메서드를 사용하여 고객 구독에 미터 가격 ID를 추가할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription('default')
        ->meteredPrice('price_metered')
        ->create($request->paymentMethodId);

    // ...
});
```

또한 [Stripe Checkout](#checkout)을 통해 미터 구독을 시작할 수도 있습니다:

```php
$checkout = Auth::user()
    ->newSubscription('default', [])
    ->meteredPrice('price_metered')
    ->checkout();

return view('your-checkout-view', [
    'checkout' => $checkout,
]);
```


#### 사용량 보고 {#reporting-usage}

고객이 애플리케이션을 사용할 때, Stripe에 사용량을 보고하여 정확하게 청구할 수 있도록 해야 합니다. 계량 이벤트의 사용량을 보고하려면, `Billable` 모델에서 `reportMeterEvent` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->reportMeterEvent('emails-sent');
```

기본적으로 "사용량" 1이 청구 기간에 추가됩니다. 또는, 청구 기간 동안 고객의 사용량에 추가할 특정 "사용량"을 전달할 수도 있습니다:

```php
$user = User::find(1);

$user->reportMeterEvent('emails-sent', quantity: 15);
```

계량기에 대한 고객의 이벤트 요약을 조회하려면, `Billable` 인스턴스의 `meterEventSummaries` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$meterUsage = $user->meterEventSummaries($meterId);

$meterUsage->first()->aggregated_value // 10
```

계량 이벤트 요약에 대한 자세한 내용은 Stripe의 [Meter Event Summary 객체 문서](https://docs.stripe.com/api/billing/meter-event_summary/object)를 참고하세요.

[모든 계량기 목록을 조회](https://docs.stripe.com/api/billing/meter/list)하려면, `Billable` 인스턴스의 `meters` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->meters();
```


### 구독 세금 {#subscription-taxes}

> [!WARNING]
> 세율을 수동으로 계산하는 대신, [Stripe Tax를 사용하여 세금을 자동으로 계산](#tax-configuration)할 수 있습니다.

사용자가 구독에 대해 지불해야 하는 세율을 지정하려면, 청구 가능한 모델에 `taxRates` 메서드를 구현하고 Stripe 세율 ID가 포함된 배열을 반환해야 합니다. 이러한 세율은 [Stripe 대시보드](https://dashboard.stripe.com/test/tax-rates)에서 정의할 수 있습니다:

```php
/**
 * 고객의 구독에 적용되어야 하는 세율입니다.
 *
 * @return array<int, string>
 */
public function taxRates(): array
{
    return ['txr_id'];
}
```

`taxRates` 메서드를 사용하면 고객별로 세율을 적용할 수 있으므로, 여러 국가와 다양한 세율이 적용되는 사용자 기반에 유용할 수 있습니다.

여러 상품이 포함된 구독을 제공하는 경우, 청구 가능한 모델에 `priceTaxRates` 메서드를 구현하여 각 가격마다 다른 세율을 정의할 수 있습니다:

```php
/**
 * 고객의 구독에 적용되어야 하는 세율입니다.
 *
 * @return array<string, array<int, string>>
 */
public function priceTaxRates(): array
{
    return [
        'price_monthly' => ['txr_id'],
    ];
}
```

> [!WARNING]
> `taxRates` 메서드는 구독 결제에만 적용됩니다. Cashier를 사용하여 "일회성" 결제를 하는 경우, 해당 시점에 세율을 직접 지정해야 합니다.


#### 세금 비율 동기화 {#syncing-tax-rates}

`taxRates` 메서드에서 반환되는 하드코딩된 세금 비율 ID를 변경해도, 기존 사용자의 구독에 설정된 세금은 그대로 유지됩니다. 기존 구독의 세금 값을 새로운 `taxRates` 값으로 업데이트하려면, 사용자의 구독 인스턴스에서 `syncTaxRates` 메서드를 호출해야 합니다:

```php
$user->subscription('default')->syncTaxRates();
```

이 메서드는 여러 상품이 포함된 구독의 각 항목 세금 비율도 함께 동기화합니다. 애플리케이션에서 여러 상품이 포함된 구독을 제공하는 경우, 청구 가능한 모델이 위에서 [설명한](#subscription-taxes) `priceTaxRates` 메서드를 구현하고 있는지 확인해야 합니다.


#### 세금 면제 {#tax-exemption}

Cashier는 고객이 세금 면제 대상인지 확인하기 위해 `isNotTaxExempt`, `isTaxExempt`, `reverseChargeApplies` 메서드도 제공합니다. 이 메서드들은 Stripe API를 호출하여 고객의 세금 면제 상태를 확인합니다:

```php
use App\Models\User;

$user = User::find(1);

$user->isTaxExempt();
$user->isNotTaxExempt();
$user->reverseChargeApplies();
```

> [!WARNING]
> 이 메서드들은 모든 `Laravel\Cashier\Invoice` 객체에서도 사용할 수 있습니다. 하지만 `Invoice` 객체에서 호출할 경우, 해당 인보이스가 생성된 시점의 면제 상태를 확인합니다.


### 구독 기준일(Anchor Date) {#subscription-anchor-date}

기본적으로 결제 주기의 기준일(앵커)은 구독이 생성된 날짜이거나, 체험 기간이 사용된 경우에는 체험이 끝나는 날짜입니다. 결제 기준일을 수정하고 싶다면 `anchorBillingCycleOn` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $anchor = Carbon::parse('first day of next month');

    $request->user()->newSubscription('default', 'price_monthly')
        ->anchorBillingCycleOn($anchor->startOfDay())
        ->create($request->paymentMethodId);

    // ...
});
```

구독 결제 주기 관리에 대한 더 자세한 내용은 [Stripe 결제 주기 문서](https://stripe.com/docs/billing/subscriptions/billing-cycle)를 참고하세요.


### 구독 취소하기 {#cancelling-subscriptions}

구독을 취소하려면, 사용자 구독에서 `cancel` 메서드를 호출하면 됩니다:

```php
$user->subscription('default')->cancel();
```

구독이 취소되면, Cashier는 자동으로 `subscriptions` 데이터베이스 테이블의 `ends_at` 컬럼을 설정합니다. 이 컬럼은 `subscribed` 메서드가 언제부터 `false`를 반환해야 하는지 판단하는 데 사용됩니다.

예를 들어, 고객이 3월 1일에 구독을 취소했지만 구독이 3월 5일까지 종료되지 않는 경우, `subscribed` 메서드는 3월 5일까지 계속해서 `true`를 반환합니다. 이는 사용자가 일반적으로 결제 주기가 끝날 때까지 애플리케이션을 계속 사용할 수 있도록 허용하기 때문입니다.

사용자가 구독을 취소했지만 아직 "유예 기간"에 있는지 확인하려면 `onGracePeriod` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription('default')->onGracePeriod()) {
    // ...
}
```

구독을 즉시 취소하고 싶다면, 사용자 구독에서 `cancelNow` 메서드를 호출하세요:

```php
$user->subscription('default')->cancelNow();
```

구독을 즉시 취소하고, 남아 있는 미청구 측정 사용량이나 새로 생성되었거나 보류 중인 비례 배분 청구 항목을 청구서로 발행하려면, `cancelNowAndInvoice` 메서드를 호출하세요:

```php
$user->subscription('default')->cancelNowAndInvoice();
```

특정 시점에 구독을 취소하도록 선택할 수도 있습니다:

```php
$user->subscription('default')->cancelAt(
    now()->addDays(10)
);
```

마지막으로, 관련된 사용자 모델을 삭제하기 전에 항상 사용자 구독을 취소해야 합니다:

```php
$user->subscription('default')->cancelNow();

$user->delete();
```


### 구독 재개 {#resuming-subscriptions}

고객이 구독을 취소한 후 이를 다시 재개하고 싶다면, 해당 구독에서 `resume` 메서드를 호출하면 됩니다. 단, 고객이 여전히 "유예 기간" 내에 있어야 구독을 재개할 수 있습니다:

```php
$user->subscription('default')->resume();
```

고객이 구독을 취소한 후, 구독이 완전히 만료되기 전에 다시 구독을 재개하면 고객에게 즉시 결제가 청구되지 않습니다. 대신, 구독이 다시 활성화되고 원래의 결제 주기에 따라 결제가 이루어집니다.


## 구독 체험판 {#subscription-trials}


### 결제 수단을 미리 받는 체험 기간 제공 {#with-payment-method-up-front}

고객에게 체험 기간을 제공하면서도 결제 수단 정보를 미리 받고 싶다면, 구독을 생성할 때 `trialDays` 메서드를 사용해야 합니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription('default', 'price_monthly')
        ->trialDays(10)
        ->create($request->paymentMethodId);

    // ...
});
```

이 메서드는 데이터베이스 내 구독 레코드에 체험 기간 종료 날짜를 설정하고, Stripe에 이 날짜 이후에 결제가 시작되도록 지시합니다. `trialDays` 메서드를 사용할 경우, Cashier는 Stripe에서 가격에 대해 설정된 기본 체험 기간을 덮어씁니다.

> [!WARNING]
> 고객의 구독이 체험 기간 종료 전에 취소되지 않으면, 체험 기간이 끝나는 즉시 결제가 이루어지므로 반드시 사용자에게 체험 종료일을 안내해야 합니다.

`trialUntil` 메서드를 사용하면 체험 기간이 언제 끝나야 하는지 지정하는 `DateTime` 인스턴스를 전달할 수 있습니다:

```php
use Carbon\Carbon;

$user->newSubscription('default', 'price_monthly')
    ->trialUntil(Carbon::now()->addDays(10))
    ->create($paymentMethod);
```

사용자가 체험 기간 내에 있는지 확인하려면, 사용자 인스턴스의 `onTrial` 메서드나 구독 인스턴스의 `onTrial` 메서드를 사용할 수 있습니다. 아래 두 예시는 동일하게 동작합니다:

```php
if ($user->onTrial('default')) {
    // ...
}

if ($user->subscription('default')->onTrial()) {
    // ...
}
```

`endTrial` 메서드를 사용하여 구독 체험을 즉시 종료할 수 있습니다:

```php
$user->subscription('default')->endTrial();
```

기존 체험 기간이 만료되었는지 확인하려면, `hasExpiredTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->hasExpiredTrial('default')) {
    // ...
}

if ($user->subscription('default')->hasExpiredTrial()) {
    // ...
}
```


#### Stripe / Cashier에서 체험 기간(Trial Days) 정의하기 {#defining-trial-days-in-stripe-cashier}

Stripe 대시보드에서 가격(Price)의 체험 기간을 정의하거나, Cashier를 사용하여 항상 명시적으로 체험 기간을 전달할 수 있습니다. Stripe에서 가격의 체험 기간을 정의하는 경우, 과거에 구독을 했던 고객의 새로운 구독을 포함하여 모든 새로운 구독은 항상 체험 기간을 받게 됩니다. 이를 원하지 않는 경우에는 반드시 `skipTrial()` 메서드를 명시적으로 호출해야 합니다.


### 결제 수단 없이 체험 기간 제공 {#without-payment-method-up-front}

사용자의 결제 수단 정보를 미리 수집하지 않고 체험 기간을 제공하고 싶다면, 사용자 레코드의 `trial_ends_at` 컬럼을 원하는 체험 종료 날짜로 설정하면 됩니다. 이는 일반적으로 사용자 등록 시에 수행됩니다:

```php
use App\Models\User;

$user = User::create([
    // ...
    'trial_ends_at' => now()->addDays(10),
]);
```

> [!WARNING]
> 반드시 청구 모델 클래스 정의 내에서 `trial_ends_at` 속성에 대해 [날짜 캐스팅](/laravel/12.x/eloquent-mutators#date-casting)을 추가해야 합니다.

Cashier는 이러한 유형의 체험을 "일반 체험(generic trial)"이라고 부르며, 이는 기존 구독과 연결되어 있지 않기 때문입니다. 청구 모델 인스턴스의 `onTrial` 메서드는 현재 날짜가 `trial_ends_at` 값보다 이전이면 `true`를 반환합니다:

```php
if ($user->onTrial()) {
    // 사용자가 체험 기간 내에 있습니다...
}
```

실제 구독을 생성할 준비가 되면, 평소와 같이 `newSubscription` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->newSubscription('default', 'price_monthly')->create($paymentMethod);
```

사용자의 체험 종료 날짜를 가져오려면 `trialEndsAt` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 체험 중이면 Carbon 날짜 인스턴스를, 그렇지 않으면 `null`을 반환합니다. 기본 구독이 아닌 특정 구독의 체험 종료 날짜를 얻고 싶다면 선택적으로 구독 유형 파라미터를 전달할 수도 있습니다:

```php
if ($user->onTrial()) {
    $trialEndsAt = $user->trialEndsAt('main');
}
```

또한 사용자가 "일반" 체험 기간 내에 있으며 아직 실제 구독을 생성하지 않았는지 확인하려면 `onGenericTrial` 메서드를 사용할 수도 있습니다:

```php
if ($user->onGenericTrial()) {
    // 사용자가 "일반" 체험 기간 내에 있습니다...
}
```


### 체험 기간 연장 {#extending-trials}

`extendTrial` 메서드를 사용하면 구독이 생성된 후에도 구독의 체험 기간을 연장할 수 있습니다. 만약 체험 기간이 이미 만료되어 고객이 구독에 대해 결제를 시작한 경우에도, 추가 체험 기간을 제공할 수 있습니다. 체험 기간 동안 사용한 시간은 고객의 다음 청구서에서 차감됩니다:

```php
use App\Models\User;

$subscription = User::find(1)->subscription('default');

// 지금부터 7일 후에 체험을 종료하도록 설정...
$subscription->extendTrial(
    now()->addDays(7)
);

// 체험 기간에 5일을 추가로 연장...
$subscription->extendTrial(
    $subscription->trial_ends_at->addDays(5)
);
```


## Stripe Webhook 처리하기 {#handling-stripe-webhooks}

> [!NOTE]
> 로컬 개발 중 웹훅을 테스트하려면 [Stripe CLI](https://stripe.com/docs/stripe-cli)를 사용할 수 있습니다.

Stripe는 웹훅을 통해 다양한 이벤트를 애플리케이션에 알릴 수 있습니다. 기본적으로, Cashier 서비스 프로바이더에 의해 Cashier의 웹훅 컨트롤러로 연결되는 라우트가 자동으로 등록됩니다. 이 컨트롤러는 모든 수신 웹훅 요청을 처리합니다.

기본적으로 Cashier 웹훅 컨트롤러는 너무 많은 결제 실패(Stripe 설정에 따라 정의됨)로 인한 구독 취소, 고객 정보 업데이트, 고객 삭제, 구독 업데이트, 결제 수단 변경을 자동으로 처리합니다. 하지만 곧 알게 되겠지만, 이 컨트롤러를 확장하여 원하는 Stripe 웹훅 이벤트를 처리할 수도 있습니다.

애플리케이션이 Stripe 웹훅을 처리할 수 있도록 Stripe 관리 패널에서 웹훅 URL을 반드시 설정해야 합니다. 기본적으로 Cashier의 웹훅 컨트롤러는 `/stripe/webhook` URL 경로에 응답합니다. Stripe 관리 패널에서 활성화해야 할 모든 웹훅 목록은 다음과 같습니다:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.updated`
- `customer.deleted`
- `payment_method.automatically_updated`
- `invoice.payment_action_required`
- `invoice.payment_succeeded`

편의를 위해 Cashier에는 `cashier:webhook` Artisan 명령어가 포함되어 있습니다. 이 명령어는 Cashier에 필요한 모든 이벤트를 수신하는 웹훅을 Stripe에 생성합니다:

```shell
php artisan cashier:webhook
```

기본적으로 생성된 웹훅은 `APP_URL` 환경 변수와 Cashier에 포함된 `cashier.webhook` 라우트로 정의된 URL을 가리킵니다. 다른 URL을 사용하려면 명령어 실행 시 `--url` 옵션을 제공할 수 있습니다:

```shell
php artisan cashier:webhook --url "https://example.com/stripe/webhook"
```

생성된 웹훅은 Cashier 버전과 호환되는 Stripe API 버전을 사용합니다. 다른 Stripe 버전을 사용하려면 `--api-version` 옵션을 제공할 수 있습니다:

```shell
php artisan cashier:webhook --api-version="2019-12-03"
```

생성 후 웹훅은 즉시 활성화됩니다. 웹훅을 생성하되 준비될 때까지 비활성화 상태로 두고 싶다면 명령어 실행 시 `--disabled` 옵션을 제공할 수 있습니다:

```shell
php artisan cashier:webhook --disabled
```

> [!WARNING]
> Cashier에 포함된 [웹훅 서명 검증](#verifying-webhook-signatures) 미들웨어로 Stripe 웹훅 요청이 안전하게 보호되고 있는지 반드시 확인하세요.


#### 웹훅과 CSRF 보호 {#webhooks-csrf-protection}

Stripe 웹훅은 Laravel의 [CSRF 보호](/laravel/12.x/csrf)를 우회해야 하므로, Stripe 웹훅이 들어올 때 Laravel이 CSRF 토큰을 검증하지 않도록 설정해야 합니다. 이를 위해 애플리케이션의 `bootstrap/app.php` 파일에서 `stripe/*` 경로를 CSRF 보호에서 제외해야 합니다:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
    ]);
})
```


### 웹훅 이벤트 핸들러 정의하기 {#defining-webhook-event-handlers}

Cashier는 결제 실패로 인한 구독 취소 및 기타 일반적인 Stripe 웹훅 이벤트를 자동으로 처리합니다. 그러나 추가로 처리하고 싶은 웹훅 이벤트가 있다면, Cashier에서 디스패치하는 다음 이벤트를 리스닝하여 처리할 수 있습니다:

- `Laravel\Cashier\Events\WebhookReceived`
- `Laravel\Cashier\Events\WebhookHandled`

두 이벤트 모두 Stripe 웹훅의 전체 페이로드를 포함합니다. 예를 들어, `invoice.payment_succeeded` 웹훅을 처리하고 싶다면, 해당 이벤트를 처리할 [리스너](/laravel/12.x/events#defining-listeners)를 등록할 수 있습니다:

```php
<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Stripe 웹훅 수신 처리.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'invoice.payment_succeeded') {
            // 들어오는 이벤트를 처리합니다...
        }
    }
}
```


### 웹훅 서명 검증 {#verifying-webhook-signatures}

웹훅을 안전하게 보호하기 위해 [Stripe의 웹훅 서명](https://stripe.com/docs/webhooks/signatures)을 사용할 수 있습니다. 편의를 위해 Cashier는 Stripe에서 들어오는 웹훅 요청이 유효한지 검증하는 미들웨어를 자동으로 포함하고 있습니다.

웹훅 검증을 활성화하려면, 애플리케이션의 `.env` 파일에 `STRIPE_WEBHOOK_SECRET` 환경 변수가 설정되어 있는지 확인하세요. 웹훅 `secret`은 Stripe 계정 대시보드에서 확인할 수 있습니다.


## 단일 결제 {#single-charges}


### 단순 결제 {#simple-charge}

고객에게 일회성 결제를 진행하려면, 청구 가능한 모델 인스턴스에서 `charge` 메서드를 사용할 수 있습니다. `charge` 메서드의 두 번째 인수로 [결제 수단 식별자](#payment-methods-for-single-charges)를 제공해야 합니다:

```php
use Illuminate\Http\Request;

Route::post('/purchase', function (Request $request) {
    $stripeCharge = $request->user()->charge(
        100, $request->paymentMethodId
    );

    // ...
});
```

`charge` 메서드는 세 번째 인수로 배열을 받아, Stripe의 결제 생성에 원하는 옵션을 전달할 수 있습니다. 결제 생성 시 사용할 수 있는 옵션에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/api/charges/create)에서 확인할 수 있습니다:

```php
$user->charge(100, $paymentMethod, [
    'custom_option' => $value,
]);
```

기본 고객 또는 사용자가 없어도 `charge` 메서드를 사용할 수 있습니다. 이를 위해 애플리케이션의 청구 가능한 모델의 새 인스턴스에서 `charge` 메서드를 호출하면 됩니다:

```php
use App\Models\User;

$stripeCharge = (new User)->charge(100, $paymentMethod);
```

`charge` 메서드는 결제에 실패하면 예외를 발생시킵니다. 결제가 성공하면, `Laravel\Cashier\Payment` 인스턴스가 반환됩니다:

```php
try {
    $payment = $user->charge(100, $paymentMethod);
} catch (Exception $e) {
    // ...
}
```

> [!WARNING]
> `charge` 메서드는 애플리케이션에서 사용하는 통화의 최소 단위로 결제 금액을 받습니다. 예를 들어, 고객이 미국 달러로 결제하는 경우 금액은 센트 단위로 지정해야 합니다.


### 인보이스로 결제하기 {#charge-with-invoice}

가끔 일회성 결제가 필요하고, 고객에게 PDF 인보이스를 제공해야 할 때가 있습니다. `invoicePrice` 메서드를 사용하면 이를 손쉽게 처리할 수 있습니다. 예를 들어, 고객에게 새 셔츠 5벌에 대한 인보이스를 발행해보겠습니다:

```php
$user->invoicePrice('price_tshirt', 5);
```

이 인보이스는 사용자의 기본 결제 수단으로 즉시 결제됩니다. `invoicePrice` 메서드는 세 번째 인수로 배열을 받을 수 있습니다. 이 배열에는 인보이스 항목에 대한 청구 옵션이 포함됩니다. 네 번째 인수 역시 배열로, 인보이스 자체에 대한 청구 옵션을 담아야 합니다:

```php
$user->invoicePrice('price_tshirt', 5, [
    'discounts' => [
        ['coupon' => 'SUMMER21SALE']
    ],
], [
    'default_tax_rates' => ['txr_id'],
]);
```

`invoicePrice`와 유사하게, `tabPrice` 메서드를 사용하면 여러 항목(인보이스당 최대 250개)을 고객의 "탭"에 추가한 뒤 인보이스를 발행하여 일회성 결제를 만들 수 있습니다. 예를 들어, 셔츠 5벌과 머그컵 2개에 대해 고객에게 인보이스를 발행할 수 있습니다:

```php
$user->tabPrice('price_tshirt', 5);
$user->tabPrice('price_mug', 2);
$user->invoice();
```

또는, `invoiceFor` 메서드를 사용하여 고객의 기본 결제 수단으로 "일회성" 결제를 할 수도 있습니다:

```php
$user->invoiceFor('One Time Fee', 500);
```

`invoiceFor` 메서드도 사용할 수 있지만, 미리 정의된 가격과 함께 `invoicePrice` 및 `tabPrice` 메서드를 사용하는 것이 권장됩니다. 이렇게 하면 Stripe 대시보드에서 제품별 판매에 대한 더 나은 분석 및 데이터를 확인할 수 있습니다.

> [!WARNING]
> `invoice`, `invoicePrice`, `invoiceFor` 메서드는 실패한 결제 시 재시도를 수행하는 Stripe 인보이스를 생성합니다. 실패한 결제에 대해 인보이스가 재시도되지 않도록 하려면, 첫 번째 결제 실패 후 Stripe API를 사용해 인보이스를 닫아야 합니다.


### 결제 인텐트 생성하기 {#creating-payment-intents}

Stripe 결제 인텐트를 새로 생성하려면, 청구 가능한 모델 인스턴스에서 `pay` 메서드를 호출하면 됩니다. 이 메서드를 호출하면 `Laravel\Cashier\Payment` 인스턴스에 래핑된 결제 인텐트가 생성됩니다:

```php
use Illuminate\Http\Request;

Route::post('/pay', function (Request $request) {
    $payment = $request->user()->pay(
        $request->get('amount')
    );

    return $payment->client_secret;
});
```

결제 인텐트를 생성한 후, 클라이언트 시크릿을 애플리케이션의 프론트엔드로 반환하여 사용자가 브라우저에서 결제를 완료할 수 있도록 할 수 있습니다. Stripe 결제 인텐트를 사용하여 전체 결제 플로우를 구축하는 방법에 대해 더 알고 싶다면 [Stripe 문서](https://stripe.com/docs/payments/accept-a-payment?platform=web)를 참고하세요.

`pay` 메서드를 사용할 때는 Stripe 대시보드에서 활성화된 기본 결제 수단이 고객에게 제공됩니다. 또는, 특정 결제 수단만 허용하고 싶다면 `payWith` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/pay', function (Request $request) {
    $payment = $request->user()->payWith(
        $request->get('amount'), ['card', 'bancontact']
    );

    return $payment->client_secret;
});
```

> [!WARNING]
> `pay` 및 `payWith` 메서드는 애플리케이션에서 사용하는 통화의 최소 단위로 결제 금액을 받습니다. 예를 들어, 고객이 미국 달러로 결제하는 경우 금액은 센트 단위로 지정해야 합니다.


### 결제 환불 {#refunding-charges}

Stripe 결제를 환불해야 하는 경우, `refund` 메서드를 사용할 수 있습니다. 이 메서드는 Stripe [결제 인텐트 ID](#payment-methods-for-single-charges)를 첫 번째 인수로 받습니다:

```php
$payment = $user->charge(100, $paymentMethodId);

$user->refund($payment->id);
```


## 인보이스 {#invoices}


### 인보이스 조회 {#retrieving-invoices}

`invoices` 메서드를 사용하여 청구 가능한 모델의 인보이스 배열을 쉽게 조회할 수 있습니다. `invoices` 메서드는 `Laravel\Cashier\Invoice` 인스턴스의 컬렉션을 반환합니다:

```php
$invoices = $user->invoices();
```

결과에 보류 중인 인보이스도 포함하고 싶다면, `invoicesIncludingPending` 메서드를 사용할 수 있습니다:

```php
$invoices = $user->invoicesIncludingPending();
```

특정 인보이스를 ID로 조회하려면 `findInvoice` 메서드를 사용할 수 있습니다:

```php
$invoice = $user->findInvoice($invoiceId);
```


#### 인보이스 정보 표시하기 {#displaying-invoice-information}

고객의 인보이스를 나열할 때, 인보이스의 메서드를 사용하여 관련 인보이스 정보를 표시할 수 있습니다. 예를 들어, 모든 인보이스를 테이블에 나열하여 사용자가 쉽게 다운로드할 수 있도록 할 수 있습니다:

```blade
<table>
    @foreach ($invoices as $invoice)
        <tr>
            <td>{{ $invoice->date()->toFormattedDateString() }}</td>
            <td>{{ $invoice->total() }}</td>
            <td><a href="/user/invoice/{{ $invoice->id }}">Download</a></td>
        </tr>
    @endforeach
</table>
```


### 다가오는 인보이스 {#upcoming-invoices}

고객의 다가오는 인보이스를 조회하려면 `upcomingInvoice` 메서드를 사용할 수 있습니다:

```php
$invoice = $user->upcomingInvoice();
```

마찬가지로, 고객이 여러 구독을 가지고 있다면 특정 구독에 대한 다가오는 인보이스도 조회할 수 있습니다:

```php
$invoice = $user->subscription('default')->upcomingInvoice();
```


### 구독 인보이스 미리보기 {#previewing-subscription-invoices}

`previewInvoice` 메서드를 사용하면 가격 변경 전에 인보이스를 미리 볼 수 있습니다. 이를 통해 특정 가격 변경이 이루어졌을 때 고객의 인보이스가 어떻게 보일지 확인할 수 있습니다:

```php
$invoice = $user->subscription('default')->previewInvoice('price_yearly');
```

여러 개의 새로운 가격으로 인보이스를 미리 보고 싶다면, 가격 배열을 `previewInvoice` 메서드에 전달할 수 있습니다:

```php
$invoice = $user->subscription('default')->previewInvoice(['price_yearly', 'price_metered']);
```


### 인보이스 PDF 생성 {#generating-invoice-pdfs}

인보이스 PDF를 생성하기 전에, Cashier의 기본 인보이스 렌더러인 Dompdf 라이브러리를 Composer를 사용하여 설치해야 합니다:

```shell
composer require dompdf/dompdf
```

라우트나 컨트롤러 내에서 `downloadInvoice` 메서드를 사용하여 특정 인보이스의 PDF 다운로드를 생성할 수 있습니다. 이 메서드는 인보이스를 다운로드하는 데 필요한 적절한 HTTP 응답을 자동으로 생성합니다:

```php
use Illuminate\Http\Request;

Route::get('/user/invoice/{invoice}', function (Request $request, string $invoiceId) {
    return $request->user()->downloadInvoice($invoiceId);
});
```

기본적으로 인보이스의 모든 데이터는 Stripe에 저장된 고객 및 인보이스 데이터에서 파생됩니다. 파일 이름은 `app.name` 설정 값에 기반합니다. 그러나 `downloadInvoice` 메서드의 두 번째 인수로 배열을 제공하여 일부 데이터를 커스터마이즈할 수 있습니다. 이 배열을 통해 회사 및 제품 정보와 같은 정보를 사용자 정의할 수 있습니다:

```php
return $request->user()->downloadInvoice($invoiceId, [
    'vendor' => 'Your Company',
    'product' => 'Your Product',
    'street' => 'Main Str. 1',
    'location' => '2000 Antwerp, Belgium',
    'phone' => '+32 499 00 00 00',
    'email' => 'info@example.com',
    'url' => 'https://example.com',
    'vendorVat' => 'BE123456789',
]);
```

`downloadInvoice` 메서드는 세 번째 인수를 통해 커스텀 파일 이름도 허용합니다. 이 파일 이름에는 자동으로 `.pdf`가 접미사로 붙습니다:

```php
return $request->user()->downloadInvoice($invoiceId, [], 'my-invoice');
```


#### 커스텀 인보이스 렌더러 {#custom-invoice-render}

Cashier는 커스텀 인보이스 렌더러를 사용하는 것도 가능합니다. 기본적으로 Cashier는 [dompdf](https://github.com/dompdf/dompdf) PHP 라이브러리를 활용하는 `DompdfInvoiceRenderer` 구현체를 사용하여 인보이스를 생성합니다. 하지만, `Laravel\Cashier\Contracts\InvoiceRenderer` 인터페이스를 구현함으로써 원하는 렌더러를 사용할 수 있습니다. 예를 들어, 서드파티 PDF 렌더링 서비스의 API를 호출하여 인보이스 PDF를 렌더링하고 싶을 수도 있습니다:

```php
use Illuminate\Support\Facades\Http;
use Laravel\Cashier\Contracts\InvoiceRenderer;
use Laravel\Cashier\Invoice;

class ApiInvoiceRenderer implements InvoiceRenderer
{
    /**
     * 주어진 인보이스를 렌더링하여 원시 PDF 바이트를 반환합니다.
     */
    public function render(Invoice $invoice, array $data = [], array $options = []): string
    {
        $html = $invoice->view($data)->render();

        return Http::get('https://example.com/html-to-pdf', ['html' => $html])->get()->body();
    }
}
```

인보이스 렌더러 계약을 구현한 후에는, 애플리케이션의 `config/cashier.php` 설정 파일에서 `cashier.invoices.renderer` 설정 값을 업데이트해야 합니다. 이 설정 값은 커스텀 렌더러 구현체의 클래스 이름으로 지정해야 합니다.


## 체크아웃 {#checkout}

Cashier Stripe는 [Stripe Checkout](https://stripe.com/payments/checkout)에 대한 지원도 제공합니다. Stripe Checkout은 사전 구축된 호스팅 결제 페이지를 제공하여 결제 수락을 위한 커스텀 페이지 구현의 번거로움을 덜어줍니다.

다음 문서에서는 Cashier와 함께 Stripe Checkout을 사용하는 방법에 대한 정보를 제공합니다. Stripe Checkout에 대해 더 자세히 알아보고 싶다면 [Stripe의 공식 Checkout 문서](https://stripe.com/docs/payments/checkout)도 참고하시기 바랍니다.


### 상품 결제 {#product-checkouts}

Stripe 대시보드에서 생성된 기존 상품에 대해, 청구 가능한 모델의 `checkout` 메서드를 사용하여 결제를 진행할 수 있습니다. `checkout` 메서드는 새로운 Stripe Checkout 세션을 시작합니다. 기본적으로 Stripe 가격 ID를 전달해야 합니다:

```php
use Illuminate\Http\Request;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()->checkout('price_tshirt');
});
```

필요하다면 상품 수량도 지정할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()->checkout(['price_tshirt' => 15]);
});
```

고객이 이 라우트를 방문하면 Stripe의 Checkout 페이지로 리디렉션됩니다. 기본적으로 사용자가 결제를 성공적으로 완료하거나 취소하면 `home` 라우트 위치로 리디렉션되지만, `success_url`과 `cancel_url` 옵션을 사용하여 커스텀 콜백 URL을 지정할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()->checkout(['price_tshirt' => 1], [
        'success_url' => route('your-success-route'),
        'cancel_url' => route('your-cancel-route'),
    ]);
});
```

`success_url` 결제 옵션을 정의할 때, Stripe가 결제 세션 ID를 쿼리 문자열 파라미터로 추가하도록 지시할 수 있습니다. 이를 위해 `success_url` 쿼리 문자열에 `{CHECKOUT_SESSION_ID}`라는 리터럴 문자열을 추가하세요. Stripe는 이 플레이스홀더를 실제 결제 세션 ID로 대체합니다:

```php
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Customer;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()->checkout(['price_tshirt' => 1], [
        'success_url' => route('checkout-success').'?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => route('checkout-cancel'),
    ]);
});

Route::get('/checkout-success', function (Request $request) {
    $checkoutSession = $request->user()->stripe()->checkout->sessions->retrieve($request->get('session_id'));

    return view('checkout.success', ['checkoutSession' => $checkoutSession]);
})->name('checkout-success');
```


#### 프로모션 코드 {#checkout-promotion-codes}

기본적으로 Stripe Checkout은 [사용자가 직접 사용할 수 있는 프로모션 코드](https://stripe.com/docs/billing/subscriptions/discounts/codes)를 허용하지 않습니다. 다행히도, Checkout 페이지에서 이를 활성화하는 쉬운 방법이 있습니다. 이를 위해 `allowPromotionCodes` 메서드를 호출하면 됩니다:

```php
use Illuminate\Http\Request;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()
        ->allowPromotionCodes()
        ->checkout('price_tshirt');
});
```


### 단일 결제 체크아웃 {#single-charge-checkouts}

Stripe 대시보드에 생성되지 않은 임시 상품에 대해 간단한 결제를 수행할 수도 있습니다. 이를 위해서는 청구 가능한 모델에서 `checkoutCharge` 메서드를 사용하고, 결제 금액, 상품명, 그리고 선택적으로 수량을 전달하면 됩니다. 고객이 이 경로를 방문하면 Stripe의 Checkout 페이지로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/charge-checkout', function (Request $request) {
    return $request->user()->checkoutCharge(1200, 'T-Shirt', 5);
});
```

> [!WARNING]
> `checkoutCharge` 메서드를 사용할 경우, Stripe는 항상 Stripe 대시보드에 새로운 상품과 가격을 생성합니다. 따라서, 미리 Stripe 대시보드에서 상품을 생성하고 `checkout` 메서드를 사용하는 것을 권장합니다.


### 구독 체크아웃 {#subscription-checkouts}

> [!WARNING]
> Stripe Checkout을 사용하여 구독을 처리하려면 Stripe 대시보드에서 `customer.subscription.created` 웹훅을 활성화해야 합니다. 이 웹훅은 데이터베이스에 구독 레코드를 생성하고 관련된 모든 구독 항목을 저장합니다.

Stripe Checkout을 사용하여 구독을 시작할 수도 있습니다. Cashier의 구독 빌더 메서드로 구독을 정의한 후, `checkout` 메서드를 호출할 수 있습니다. 고객이 이 라우트를 방문하면 Stripe의 Checkout 페이지로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/subscription-checkout', function (Request $request) {
    return $request->user()
        ->newSubscription('default', 'price_monthly')
        ->checkout();
});
```

상품 결제와 마찬가지로, 성공 및 취소 URL을 커스터마이즈할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/subscription-checkout', function (Request $request) {
    return $request->user()
        ->newSubscription('default', 'price_monthly')
        ->checkout([
            'success_url' => route('your-success-route'),
            'cancel_url' => route('your-cancel-route'),
        ]);
});
```

물론, 구독 체크아웃에서도 프로모션 코드를 활성화할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/subscription-checkout', function (Request $request) {
    return $request->user()
        ->newSubscription('default', 'price_monthly')
        ->allowPromotionCodes()
        ->checkout();
});
```

> [!WARNING]
> Stripe Checkout은 구독을 시작할 때 모든 구독 결제 옵션을 지원하지 않습니다. 구독 빌더에서 `anchorBillingCycleOn` 메서드를 사용하거나, 비례 배분(proration) 동작을 설정하거나, 결제 동작을 설정해도 Stripe Checkout 세션에서는 아무런 효과가 없습니다. 사용 가능한 파라미터를 확인하려면 [Stripe Checkout Session API 문서](https://stripe.com/docs/api/checkout/sessions/create)를 참고하세요.


#### Stripe Checkout 및 체험 기간 {#stripe-checkout-trial-periods}

물론, Stripe Checkout을 사용하여 완료될 구독을 생성할 때 체험 기간을 정의할 수 있습니다:

```php
$checkout = Auth::user()->newSubscription('default', 'price_monthly')
    ->trialDays(3)
    ->checkout();
```

하지만 체험 기간은 최소 48시간이어야 하며, 이는 Stripe Checkout에서 지원하는 최소 체험 시간입니다.


#### 구독 및 웹훅 {#stripe-checkout-subscriptions-and-webhooks}

Stripe와 Cashier는 웹훅을 통해 구독 상태를 업데이트하므로, 고객이 결제 정보를 입력한 후 애플리케이션으로 돌아왔을 때 구독이 아직 활성화되지 않았을 가능성이 있습니다. 이러한 상황을 처리하기 위해 결제 또는 구독이 보류 중임을 사용자에게 알리는 메시지를 표시할 수 있습니다.


### 세금 ID 수집 {#collecting-tax-ids}

Checkout은 고객의 세금 ID 수집도 지원합니다. 결제 세션에서 이를 활성화하려면, 세션을 생성할 때 `collectTaxIds` 메서드를 호출하세요:

```php
$checkout = $user->collectTaxIds()->checkout('price_tshirt');
```

이 메서드가 호출되면, 고객이 회사로 구매하는지 여부를 표시할 수 있는 새로운 체크박스가 제공됩니다. 회사로 구매하는 경우, 세금 ID 번호를 입력할 수 있는 기회가 주어집니다.

> [!WARNING]
> 이미 애플리케이션의 서비스 프로바이더에서 [자동 세금 징수](#tax-configuration)를 구성했다면, 이 기능은 자동으로 활성화되므로 `collectTaxIds` 메서드를 별도로 호출할 필요가 없습니다.


### 비회원 결제 {#guest-checkouts}

`Checkout::guest` 메서드를 사용하면 "계정"이 없는 애플리케이션의 비회원 사용자를 위한 결제 세션을 시작할 수 있습니다:

```php
use Illuminate\Http\Request;
use Laravel\Cashier\Checkout;

Route::get('/product-checkout', function (Request $request) {
    return Checkout::guest()->create('price_tshirt', [
        'success_url' => route('your-success-route'),
        'cancel_url' => route('your-cancel-route'),
    ]);
});
```

기존 사용자에 대한 결제 세션을 생성할 때와 마찬가지로, `Laravel\Cashier\CheckoutBuilder` 인스턴스에서 제공하는 추가 메서드를 활용하여 비회원 결제 세션을 커스터마이즈할 수 있습니다:

```php
use Illuminate\Http\Request;
use Laravel\Cashier\Checkout;

Route::get('/product-checkout', function (Request $request) {
    return Checkout::guest()
        ->withPromotionCode('promo-code')
        ->create('price_tshirt', [
            'success_url' => route('your-success-route'),
            'cancel_url' => route('your-cancel-route'),
        ]);
});
```

비회원 결제가 완료된 후, Stripe는 `checkout.session.completed` 웹훅 이벤트를 전송할 수 있으므로, 반드시 [Stripe 웹훅을 구성](https://dashboard.stripe.com/webhooks)하여 이 이벤트가 실제로 애플리케이션에 전송되도록 해야 합니다. Stripe 대시보드에서 웹훅을 활성화한 후에는 [Cashier로 웹훅을 처리](#handling-stripe-webhooks)할 수 있습니다. 웹훅 페이로드에 포함된 객체는 [checkout 객체](https://stripe.com/docs/api/checkout/sessions/object)이며, 이를 확인하여 고객의 주문을 처리할 수 있습니다.


## 결제 실패 처리 {#handling-failed-payments}

때때로 구독이나 단일 결제에 대한 결제가 실패할 수 있습니다. 이 경우, Cashier는 이러한 상황을 알리는 `Laravel\Cashier\Exceptions\IncompletePayment` 예외를 발생시킵니다. 이 예외를 포착한 후에는 두 가지 방법 중 하나로 진행할 수 있습니다.

첫 번째로, 고객을 Cashier에 포함된 전용 결제 확인 페이지로 리디렉션할 수 있습니다. 이 페이지는 Cashier의 서비스 프로바이더를 통해 이미 등록된 이름이 지정된 라우트를 가지고 있습니다. 따라서 `IncompletePayment` 예외를 포착한 후 사용자를 결제 확인 페이지로 리디렉션할 수 있습니다:

```php
use Laravel\Cashier\Exceptions\IncompletePayment;

try {
    $subscription = $user->newSubscription('default', 'price_monthly')
        ->create($paymentMethod);
} catch (IncompletePayment $exception) {
    return redirect()->route(
        'cashier.payment',
        [$exception->payment->id, 'redirect' => route('home')]
    );
}
```

결제 확인 페이지에서 고객은 신용카드 정보를 다시 입력하고, Stripe에서 요구하는 추가 작업(예: "3D Secure" 확인 등)을 수행해야 합니다. 결제가 확인되면 사용자는 위의 `redirect` 파라미터로 지정된 URL로 리디렉션됩니다. 리디렉션 시, `message`(문자열)와 `success`(정수) 쿼리 문자열 변수가 URL에 추가됩니다. 결제 페이지는 현재 다음 결제 수단 유형을 지원합니다:

<div class="content-list" markdown="1">

- 신용카드
- Alipay
- Bancontact
- BECS Direct Debit
- EPS
- Giropay
- iDEAL
- SEPA Direct Debit

</div>

또는 Stripe가 결제 확인을 대신 처리하도록 할 수도 있습니다. 이 경우 결제 확인 페이지로 리디렉션하는 대신, Stripe 대시보드에서 [Stripe의 자동 청구 이메일](https://dashboard.stripe.com/account/billing/automatic)을 설정할 수 있습니다. 하지만 `IncompletePayment` 예외가 포착된 경우, 사용자가 추가 결제 확인 안내가 포함된 이메일을 받게 될 것임을 반드시 알려야 합니다.

결제 예외는 `Billable` 트레이트를 사용하는 모델의 `charge`, `invoiceFor`, `invoice` 메서드에서 발생할 수 있습니다. 구독과 상호작용할 때는 `SubscriptionBuilder`의 `create` 메서드, 그리고 `Subscription` 및 `SubscriptionItem` 모델의 `incrementAndInvoice`, `swapAndInvoice` 메서드에서 결제 미완료 예외가 발생할 수 있습니다.

기존 구독에 미완료 결제가 있는지 확인하려면, billable 모델 또는 구독 인스턴스에서 `hasIncompletePayment` 메서드를 사용할 수 있습니다:

```php
if ($user->hasIncompletePayment('default')) {
    // ...
}

if ($user->subscription('default')->hasIncompletePayment()) {
    // ...
}
```

예외 인스턴스의 `payment` 속성을 확인하여 미완료 결제의 구체적인 상태를 파악할 수 있습니다:

```php
use Laravel\Cashier\Exceptions\IncompletePayment;

try {
    $user->charge(1000, 'pm_card_threeDSecure2Required');
} catch (IncompletePayment $exception) {
    // 결제 인텐트 상태 가져오기...
    $exception->payment->status;

    // 특정 조건 확인...
    if ($exception->payment->requiresPaymentMethod()) {
        // ...
    } elseif ($exception->payment->requiresConfirmation()) {
        // ...
    }
}
```


### 결제 확인 {#confirming-payments}

일부 결제 수단은 결제를 확인하기 위해 추가 데이터가 필요합니다. 예를 들어, SEPA 결제 수단은 결제 과정에서 추가적인 "mandate" 데이터가 필요합니다. 이러한 데이터를 Cashier에 제공하려면 `withPaymentConfirmationOptions` 메서드를 사용하면 됩니다:

```php
$subscription->withPaymentConfirmationOptions([
    'mandate_data' => '...',
])->swap('price_xxx');
```

결제 확인 시 허용되는 모든 옵션을 확인하려면 [Stripe API 문서](https://stripe.com/docs/api/payment_intents/confirm)를 참고하세요.


## 강력한 고객 인증 {#strong-customer-authentication}

귀하의 비즈니스나 고객 중 한 명이 유럽에 기반을 두고 있다면, EU의 강력한 고객 인증(SCA) 규정을 준수해야 합니다. 이 규정은 결제 사기를 방지하기 위해 2019년 9월에 유럽 연합에 의해 도입되었습니다. 다행히도 Stripe와 Cashier는 SCA 준수 애플리케이션을 구축할 준비가 되어 있습니다.

> [!WARNING]
> 시작하기 전에 [Stripe의 PSD2 및 SCA 가이드](https://stripe.com/guides/strong-customer-authentication)와 [새로운 SCA API에 대한 Stripe 문서](https://stripe.com/docs/strong-customer-authentication)를 반드시 검토하세요.


### 추가 확인이 필요한 결제 {#payments-requiring-additional-confirmation}

SCA 규정에 따라 결제를 확인하고 처리하기 위해 추가 인증이 필요한 경우가 많습니다. 이런 상황이 발생하면, Cashier는 추가 인증이 필요하다는 것을 알리는 `Laravel\Cashier\Exceptions\IncompletePayment` 예외를 발생시킵니다. 이러한 예외를 처리하는 방법에 대한 자세한 내용은 [실패한 결제 처리](#handling-failed-payments) 문서에서 확인할 수 있습니다.

Stripe 또는 Cashier에서 제공하는 결제 확인 화면은 특정 은행이나 카드 발급사의 결제 흐름에 맞게 맞춤화될 수 있으며, 추가 카드 인증, 임시 소액 결제, 별도의 기기 인증 또는 기타 형태의 인증을 포함할 수 있습니다.


#### 미완료 및 연체 상태 {#incomplete-and-past-due-state}

결제에 추가 확인이 필요한 경우, 구독은 데이터베이스의 `stripe_status` 컬럼에 의해 표시되는 대로 `incomplete`(미완료) 또는 `past_due`(연체) 상태로 유지됩니다. 결제 확인이 완료되고 Stripe가 웹훅을 통해 애플리케이션에 완료 사실을 알리면, Cashier는 자동으로 고객의 구독을 활성화합니다.

`incomplete`(미완료) 및 `past_due`(연체) 상태에 대한 자세한 내용은 [이 상태에 대한 추가 문서](#incomplete-and-past-due-status)를 참고하세요.


### 오프 세션 결제 알림 {#off-session-payment-notifications}

SCA 규정에 따라 고객이 구독이 활성화된 상태에서도 가끔 결제 정보를 확인해야 할 수 있으므로, Cashier는 오프 세션 결제 확인이 필요할 때 고객에게 알림을 보낼 수 있습니다. 예를 들어, 구독이 갱신될 때 이러한 상황이 발생할 수 있습니다. Cashier의 결제 알림은 `CASHIER_PAYMENT_NOTIFICATION` 환경 변수를 알림 클래스에 설정하여 활성화할 수 있습니다. 기본적으로 이 알림은 비활성화되어 있습니다. 물론, Cashier에는 이 용도로 사용할 수 있는 알림 클래스가 포함되어 있지만, 원한다면 직접 알림 클래스를 제공할 수도 있습니다:

```ini
CASHIER_PAYMENT_NOTIFICATION=Laravel\Cashier\Notifications\ConfirmPayment
```

오프 세션 결제 확인 알림이 제대로 전달되도록 하려면, 애플리케이션에 [Stripe 웹훅이 구성되어 있는지](#handling-stripe-webhooks) 확인하고 Stripe 대시보드에서 `invoice.payment_action_required` 웹훅이 활성화되어 있어야 합니다. 또한, `Billable` 모델이 Laravel의 `Illuminate\Notifications\Notifiable` 트레이트를 사용하고 있어야 합니다.

> [!WARNING]
> 고객이 추가 확인이 필요한 결제를 수동으로 진행할 때도 알림이 전송됩니다. Stripe에서는 결제가 수동으로 이루어졌는지, "오프 세션"으로 이루어졌는지 알 수 있는 방법이 없기 때문입니다. 하지만 고객이 결제 후 결제 페이지를 방문하면 "결제 성공" 메시지만 표시됩니다. 고객이 동일한 결제를 실수로 두 번 확인하여 이중으로 결제되는 일은 발생하지 않습니다.


## Stripe SDK {#stripe-sdk}

Cashier의 많은 객체들은 Stripe SDK 객체의 래퍼입니다. Stripe 객체와 직접 상호작용하고 싶다면, `asStripe` 메서드를 사용하여 편리하게 해당 객체를 가져올 수 있습니다:

```php
$stripeSubscription = $subscription->asStripeSubscription();

$stripeSubscription->application_fee_percent = 5;

$stripeSubscription->save();
```

또한, `updateStripeSubscription` 메서드를 사용하여 Stripe 구독을 직접 업데이트할 수도 있습니다:

```php
$subscription->updateStripeSubscription(['application_fee_percent' => 5]);
```

`Stripe\StripeClient` 클라이언트를 직접 사용하고 싶다면, `Cashier` 클래스의 `stripe` 메서드를 호출할 수 있습니다. 예를 들어, 이 메서드를 사용하여 `StripeClient` 인스턴스에 접근하고 Stripe 계정의 가격 목록을 가져올 수 있습니다:

```php
use Laravel\Cashier\Cashier;

$prices = Cashier::stripe()->prices->all();
```


## 테스트 {#testing}

Cashier를 사용하는 애플리케이션을 테스트할 때 Stripe API에 대한 실제 HTTP 요청을 모킹할 수 있습니다. 하지만 이렇게 하면 Cashier의 동작 일부를 직접 다시 구현해야 합니다. 따라서 테스트 시 실제 Stripe API를 사용하도록 하는 것이 좋습니다. 비록 속도는 느릴 수 있지만, 애플리케이션이 예상대로 동작하는지 더 확실하게 확인할 수 있으며, 느린 테스트는 별도의 Pest / PHPUnit 테스트 그룹에 배치할 수 있습니다.

테스트를 진행할 때, Cashier 자체에 이미 훌륭한 테스트 스위트가 포함되어 있으므로, 모든 Cashier의 내부 동작을 테스트하기보다는 애플리케이션의 구독 및 결제 흐름에만 집중해서 테스트하면 됩니다.

시작하려면, Stripe 시크릿의 **테스트** 버전을 `phpunit.xml` 파일에 추가하세요:

```xml
<env name="STRIPE_SECRET" value="sk_test_<your-key>"/>
```

이제 테스트 중에 Cashier와 상호작용할 때 실제 API 요청이 Stripe 테스트 환경으로 전송됩니다. 편의를 위해, 테스트에 사용할 구독/가격 정보를 Stripe 테스트 계정에 미리 등록해 두는 것이 좋습니다.

> [!NOTE]
> 신용카드 거절 및 실패와 같은 다양한 결제 시나리오를 테스트하려면 Stripe에서 제공하는 다양한 [테스트 카드 번호 및 토큰](https://stripe.com/docs/testing)을 사용할 수 있습니다.
