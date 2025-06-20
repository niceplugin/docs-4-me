# Laravel Cashier (Stripe)









































































## 소개 {#introduction}

[Laravel Cashier Stripe](https://github.com/laravel/cashier-stripe)는 [Stripe](https://stripe.com)의 구독 청구 서비스를 위한 표현력 있고 유연한 인터페이스를 제공합니다. Cashier는 여러분이 작성하기 꺼려하는 거의 모든 반복적인 구독 청구 코드를 처리합니다. 기본적인 구독 관리 외에도, Cashier는 쿠폰, 구독 변경, 구독 "수량", 취소 유예 기간, 인보이스 PDF 생성까지 지원합니다.


## Cashier 업그레이드 {#upgrading-cashier}

Cashier의 새 버전으로 업그레이드할 때는 [업그레이드 가이드](https://github.com/laravel/cashier-stripe/blob/master/UPGRADE.md)를 꼼꼼히 검토하는 것이 중요합니다.

> [!WARNING]
> 변경으로 인한 문제를 방지하기 위해 Cashier는 고정된 Stripe API 버전을 사용합니다. Cashier 15는 Stripe API 버전 `2023-10-16`을 사용합니다. Stripe API 버전은 Stripe의 새로운 기능과 개선사항을 활용하기 위해 마이너 릴리즈에서 업데이트됩니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 사용하여 Stripe용 Cashier 패키지를 설치합니다:

```shell
composer require laravel/cashier
```

패키지 설치 후, `vendor:publish` Artisan 명령어를 사용하여 Cashier의 마이그레이션을 게시합니다:

```shell
php artisan vendor:publish --tag="cashier-migrations"
```

그런 다음, 데이터베이스를 마이그레이트합니다:

```shell
php artisan migrate
```

Cashier의 마이그레이션은 `users` 테이블에 여러 컬럼을 추가합니다. 또한 모든 고객의 구독을 저장할 새로운 `subscriptions` 테이블과, 여러 가격이 포함된 구독을 위한 `subscription_items` 테이블을 생성합니다.

원한다면, `vendor:publish` Artisan 명령어를 사용하여 Cashier의 설정 파일도 게시할 수 있습니다:

```shell
php artisan vendor:publish --tag="cashier-config"
```

마지막으로, Cashier가 모든 Stripe 이벤트를 올바르게 처리할 수 있도록 [Cashier의 webhook 처리 설정](#handling-stripe-webhooks)을 반드시 구성하세요.

> [!WARNING]
> Stripe는 Stripe 식별자를 저장하는 데 사용되는 모든 컬럼이 대소문자를 구분해야 한다고 권장합니다. 따라서 MySQL을 사용할 경우 `stripe_id` 컬럼의 정렬 방식이 `utf8_bin`으로 설정되어 있는지 확인해야 합니다. 이에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/upgrades#what-changes-does-stripe-consider-to-be-backwards-compatible)에서 확인할 수 있습니다.


## 설정 {#configuration}


### 청구 가능 모델 {#billable-model}

Cashier를 사용하기 전에, 청구 가능 모델 정의에 `Billable` 트레이트를 추가하세요. 일반적으로 이는 `App\Models\User` 모델이 됩니다. 이 트레이트는 구독 생성, 쿠폰 적용, 결제 수단 정보 업데이트 등 일반적인 청구 작업을 수행할 수 있는 다양한 메서드를 제공합니다:

```php
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

Cashier는 기본적으로 청구 가능 모델이 Laravel에서 제공하는 `App\Models\User` 클래스라고 가정합니다. 이를 변경하고 싶다면 `useCustomerModel` 메서드를 통해 다른 모델을 지정할 수 있습니다. 이 메서드는 일반적으로 `AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

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
> Laravel에서 제공하는 `App\Models\User` 모델이 아닌 다른 모델을 사용하는 경우, [Cashier 마이그레이션](#installation)을 게시하고 해당 모델의 테이블 이름에 맞게 수정해야 합니다.


### API 키 {#api-keys}

다음으로, 애플리케이션의 `.env` 파일에 Stripe API 키를 설정해야 합니다. Stripe API 키는 Stripe 관리 패널에서 확인할 수 있습니다:

```ini
STRIPE_KEY=your-stripe-key
STRIPE_SECRET=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

> [!WARNING]
> `STRIPE_WEBHOOK_SECRET` 환경 변수가 애플리케이션의 `.env` 파일에 정의되어 있는지 반드시 확인하세요. 이 변수는 들어오는 webhook이 실제로 Stripe에서 온 것인지 확인하는 데 사용됩니다.


### 통화 설정 {#currency-configuration}

Cashier의 기본 통화는 미국 달러(USD)입니다. 기본 통화를 변경하려면 애플리케이션의 `.env` 파일에서 `CASHIER_CURRENCY` 환경 변수를 설정하세요:

```ini
CASHIER_CURRENCY=eur
```

Cashier의 통화 설정 외에도, 인보이스에 표시할 금액 값을 포맷할 때 사용할 로케일을 지정할 수 있습니다. 내부적으로 Cashier는 [PHP의 `NumberFormatter` 클래스](https://www.php.net/manual/en/class.numberformatter.php)를 사용하여 통화 로케일을 설정합니다:

```ini
CASHIER_CURRENCY_LOCALE=nl_BE
```

> [!WARNING]
> `en` 이외의 로케일을 사용하려면 서버에 `ext-intl` PHP 확장 모듈이 설치 및 설정되어 있어야 합니다.


### 세금 설정 {#tax-configuration}

[Stripe Tax](https://stripe.com/tax) 덕분에 Stripe에서 생성된 모든 인보이스에 대해 세금을 자동으로 계산할 수 있습니다. 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 `calculateTaxes` 메서드를 호출하여 자동 세금 계산을 활성화할 수 있습니다:

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

세금 계산이 활성화되면, 새로 생성되는 모든 구독 및 단일 인보이스에 대해 자동 세금 계산이 적용됩니다.

이 기능이 제대로 작동하려면 고객의 이름, 주소, 세금 ID 등 청구 정보가 Stripe와 동기화되어야 합니다. 이를 위해 Cashier에서 제공하는 [고객 데이터 동기화](#syncing-customer-data-with-stripe) 및 [세금 ID](#tax-ids) 메서드를 사용할 수 있습니다.


### 로깅 {#logging}

Cashier는 Stripe의 치명적인 오류를 로깅할 때 사용할 로그 채널을 지정할 수 있습니다. 애플리케이션의 `.env` 파일에서 `CASHIER_LOGGER` 환경 변수를 정의하여 로그 채널을 지정하세요:

```ini
CASHIER_LOGGER=stack
```

Stripe API 호출로 인해 발생한 예외는 애플리케이션의 기본 로그 채널을 통해 기록됩니다.


### 커스텀 모델 사용 {#using-custom-models}

Cashier에서 내부적으로 사용하는 모델을 확장하여 직접 정의한 모델을 사용할 수 있습니다. Cashier 모델을 상속하여 자신의 모델을 정의하세요:

```php
use Laravel\Cashier\Subscription as CashierSubscription;

class Subscription extends CashierSubscription
{
    // ...
}
```

모델을 정의한 후, `Laravel\Cashier\Cashier` 클래스를 통해 Cashier가 커스텀 모델을 사용하도록 지시할 수 있습니다. 일반적으로 애플리케이션의 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드에서 Cashier에 커스텀 모델을 알립니다:

```php
use App\Models\Cashier\Subscription;
use App\Models\Cashier\SubscriptionItem;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
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
> Stripe Checkout을 사용하기 전에 Stripe 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한 [Cashier의 webhook 처리](#handling-stripe-webhooks)도 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 청구를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Stripe Checkout](https://stripe.com/payments/checkout) 덕분에 현대적이고 견고한 결제 통합을 쉽게 구축할 수 있습니다.

비정기적이고 단일 결제 상품에 대해 고객에게 청구하려면, Cashier를 사용하여 고객을 Stripe Checkout으로 안내하고, 고객이 결제 정보를 입력하고 구매를 확인하도록 할 수 있습니다. Checkout을 통해 결제가 완료되면, 고객은 애플리케이션 내에서 원하는 성공 URL로 리디렉션됩니다:

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

위 예시에서 볼 수 있듯이, Cashier에서 제공하는 `checkout` 메서드를 사용하여 고객을 특정 "가격 식별자"에 대해 Stripe Checkout으로 리디렉션합니다. Stripe에서 "가격"이란 [특정 상품에 대해 정의된 가격](https://stripe.com/docs/products-prices/how-products-and-prices-work)을 의미합니다.

필요하다면, `checkout` 메서드는 Stripe에서 고객을 자동으로 생성하고 해당 Stripe 고객 레코드를 애플리케이션 데이터베이스의 사용자와 연결합니다. Checkout 세션이 완료되면, 고객은 성공 또는 취소 전용 페이지로 리디렉션되어 안내 메시지를 볼 수 있습니다.


#### Stripe Checkout에 메타 데이터 제공 {#providing-meta-data-to-stripe-checkout}

상품을 판매할 때, 애플리케이션에서 정의한 `Cart` 및 `Order` 모델을 통해 완료된 주문과 구매한 상품을 추적하는 것이 일반적입니다. Stripe Checkout으로 고객을 리디렉션하여 구매를 완료할 때, 기존 주문 식별자를 제공하여 결제 완료 후 해당 주문과 연결할 수 있습니다.

이를 위해 `checkout` 메서드에 `metadata` 배열을 제공할 수 있습니다. 사용자가 결제 과정을 시작할 때 애플리케이션 내에서 보류 중인 `Order`가 생성된다고 가정해봅시다. 참고로, 이 예시의 `Cart`와 `Order` 모델은 Cashier에서 제공하지 않으며, 애플리케이션의 필요에 따라 자유롭게 구현할 수 있습니다:

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

위 예시에서 볼 수 있듯이, 사용자가 결제 과정을 시작할 때 카트/주문에 연결된 모든 Stripe 가격 식별자를 `checkout` 메서드에 제공합니다. 물론, 애플리케이션은 고객이 상품을 추가할 때 이 항목들을 "장바구니" 또는 주문과 연결해야 합니다. 또한, 주문 ID를 `metadata` 배열을 통해 Stripe Checkout 세션에 전달합니다. 마지막으로, Checkout 성공 경로에 `CHECKOUT_SESSION_ID` 템플릿 변수를 추가했습니다. Stripe가 고객을 애플리케이션으로 리디렉션할 때 이 템플릿 변수는 Checkout 세션 ID로 자동 채워집니다.

다음으로, Checkout 성공 경로를 만들어봅시다. 이 경로는 Stripe Checkout을 통해 결제가 완료된 후 사용자가 리디렉션되는 경로입니다. 이 경로 내에서 Stripe Checkout 세션 ID와 관련된 Stripe Checkout 인스턴스를 조회하여 제공한 메타 데이터를 확인하고 고객의 주문을 업데이트할 수 있습니다:

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

Checkout 세션 객체에 포함된 데이터에 대한 자세한 내용은 Stripe의 [문서](https://stripe.com/docs/api/checkout/sessions/object)를 참고하세요.


### 구독 판매 {#quickstart-selling-subscriptions}

> [!NOTE]
> Stripe Checkout을 사용하기 전에 Stripe 대시보드에서 고정 가격의 상품을 정의해야 합니다. 또한 [Cashier의 webhook 처리](#handling-stripe-webhooks)도 설정해야 합니다.

애플리케이션을 통해 상품 및 구독 청구를 제공하는 것은 부담스러울 수 있습니다. 하지만 Cashier와 [Stripe Checkout](https://stripe.com/payments/checkout) 덕분에 현대적이고 견고한 결제 통합을 쉽게 구축할 수 있습니다.

Cashier와 Stripe Checkout을 사용하여 구독을 판매하는 방법을 알아보기 위해, 기본 월간(`price_basic_monthly`) 및 연간(`price_basic_yearly`) 플랜이 있는 구독 서비스를 예로 들어보겠습니다. 이 두 가격은 Stripe 대시보드의 "Basic" 상품(`pro_basic`) 아래에 그룹화할 수 있습니다. 또한, 구독 서비스는 `pro_expert`라는 Expert 플랜을 제공할 수도 있습니다.

먼저, 고객이 어떻게 서비스에 구독할 수 있는지 알아봅시다. 예를 들어, 고객이 애플리케이션의 가격 페이지에서 Basic 플랜의 "구독" 버튼을 클릭한다고 상상해보세요. 이 버튼이나 링크는 사용자가 선택한 플랜에 대한 Stripe Checkout 세션을 생성하는 Laravel 라우트로 연결되어야 합니다:

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

위 예시에서 볼 수 있듯이, 고객을 Basic 플랜에 구독할 수 있는 Stripe Checkout 세션으로 리디렉션합니다. 결제 성공 또는 취소 후, 고객은 `checkout` 메서드에 제공한 URL로 다시 리디렉션됩니다. 구독이 실제로 시작된 시점을 알기 위해(일부 결제 수단은 처리에 몇 초가 걸릴 수 있음) [Cashier의 webhook 처리](#handling-stripe-webhooks)도 설정해야 합니다.

이제 고객이 구독을 시작할 수 있게 되었으니, 애플리케이션의 특정 부분을 구독한 사용자만 접근할 수 있도록 제한해야 합니다. 물론, Cashier의 `Billable` 트레이트에서 제공하는 `subscribed` 메서드를 통해 사용자의 현재 구독 상태를 항상 확인할 수 있습니다:

```blade
@if ($user->subscribed())
    <p>구독 중입니다.</p>
@endif
```

특정 상품이나 가격에 구독 중인지도 쉽게 확인할 수 있습니다:

```blade
@if ($user->subscribedToProduct('pro_basic'))
    <p>Basic 상품에 구독 중입니다.</p>
@endif

@if ($user->subscribedToPrice('price_basic_monthly'))
    <p>월간 Basic 플랜에 구독 중입니다.</p>
@endif
```


#### 구독 미들웨어 만들기 {#quickstart-building-a-subscribed-middleware}

편의를 위해, 들어오는 요청이 구독한 사용자인지 확인하는 [미들웨어](/laravel/12.x/middleware)를 만들 수 있습니다. 이 미들웨어를 정의한 후, 구독하지 않은 사용자가 해당 라우트에 접근하지 못하도록 라우트에 쉽게 할당할 수 있습니다:

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
            // 사용자를 청구 페이지로 리디렉션하고 구독을 요청합니다...
            return redirect('/billing');
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


#### 고객이 청구 플랜을 관리할 수 있도록 허용하기 {#quickstart-allowing-customers-to-manage-their-billing-plan}

물론, 고객은 구독 플랜을 다른 상품이나 "등급"으로 변경하고 싶어할 수 있습니다. 이를 가장 쉽게 허용하는 방법은 Stripe의 [고객 청구 포털](https://stripe.com/docs/no-code/customer-portal)로 고객을 안내하는 것입니다. 이 포털은 고객이 인보이스를 다운로드하고, 결제 수단을 업데이트하며, 구독 플랜을 변경할 수 있는 호스팅된 사용자 인터페이스를 제공합니다.

먼저, 애플리케이션 내에 사용자를 Laravel 라우트로 안내하는 링크나 버튼을 정의하세요. 이 라우트는 청구 포털 세션을 시작하는 데 사용됩니다:

```blade
<a href="{{ route('billing') }}">
    Billing
</a>
```

다음으로, Stripe 고객 청구 포털 세션을 시작하고 사용자를 포털로 리디렉션하는 라우트를 정의합니다. `redirectToBillingPortal` 메서드는 사용자가 포털을 종료할 때 돌아올 URL을 인수로 받습니다:

```php
use Illuminate\Http\Request;

Route::get('/billing', function (Request $request) {
    return $request->user()->redirectToBillingPortal(route('dashboard'));
})->middleware(['auth'])->name('billing');
```

> [!NOTE]
> Cashier의 webhook 처리가 설정되어 있는 한, Cashier는 Stripe에서 들어오는 webhook을 검사하여 애플리케이션의 Cashier 관련 데이터베이스 테이블을 자동으로 동기화합니다. 예를 들어, 사용자가 Stripe의 고객 청구 포털에서 구독을 취소하면, Cashier는 해당 webhook을 받아 애플리케이션 데이터베이스에서 구독을 "취소됨"으로 표시합니다.


## 고객 {#customers}


### 고객 조회 {#retrieving-customers}

`Cashier::findBillable` 메서드를 사용하여 Stripe ID로 고객을 조회할 수 있습니다. 이 메서드는 청구 가능 모델의 인스턴스를 반환합니다:

```php
use Laravel\Cashier\Cashier;

$user = Cashier::findBillable($stripeId);
```


### 고객 생성 {#creating-customers}

가끔 구독을 시작하지 않고 Stripe 고객을 생성하고 싶을 수 있습니다. `createAsStripeCustomer` 메서드를 사용하여 이를 수행할 수 있습니다:

```php
$stripeCustomer = $user->createAsStripeCustomer();
```

고객이 Stripe에 생성된 후, 나중에 구독을 시작할 수 있습니다. Stripe API에서 지원하는 [고객 생성 파라미터](https://stripe.com/docs/api/customers/create)를 추가로 전달하려면 선택적 `$options` 배열을 제공할 수 있습니다:

```php
$stripeCustomer = $user->createAsStripeCustomer($options);
```

청구 가능 모델에 대한 Stripe 고객 객체를 반환하려면 `asStripeCustomer` 메서드를 사용할 수 있습니다:

```php
$stripeCustomer = $user->asStripeCustomer();
```

주어진 청구 가능 모델이 이미 Stripe 고객인지 확실하지 않은 경우, `createOrGetStripeCustomer` 메서드를 사용하여 Stripe 고객 객체를 조회할 수 있습니다. 이 메서드는 Stripe에 고객이 없으면 새로 생성합니다:

```php
$stripeCustomer = $user->createOrGetStripeCustomer();
```


### 고객 정보 업데이트 {#updating-customers}

가끔 Stripe 고객을 추가 정보로 직접 업데이트하고 싶을 수 있습니다. `updateStripeCustomer` 메서드를 사용하여 이를 수행할 수 있습니다. 이 메서드는 Stripe API에서 지원하는 [고객 업데이트 옵션](https://stripe.com/docs/api/customers/update) 배열을 인수로 받습니다:

```php
$stripeCustomer = $user->updateStripeCustomer($options);
```


### 잔액 {#balances}

Stripe는 고객의 "잔액"을 적립하거나 차감할 수 있습니다. 이후 이 잔액은 새 인보이스에 적립 또는 차감됩니다. 고객의 총 잔액을 확인하려면 청구 가능 모델에서 제공하는 `balance` 메서드를 사용할 수 있습니다. `balance` 메서드는 고객 통화로 포맷된 문자열을 반환합니다:

```php
$balance = $user->balance();
```

고객의 잔액을 적립하려면 `creditBalance` 메서드에 값을 제공하세요. 원한다면 설명도 추가할 수 있습니다:

```php
$user->creditBalance(500, '프리미엄 고객 충전.');
```

`debitBalance` 메서드에 값을 제공하면 고객의 잔액이 차감됩니다:

```php
$user->debitBalance(300, '잘못된 사용 패널티.');
```

`applyBalance` 메서드는 고객을 위한 새로운 잔액 거래를 생성합니다. `balanceTransactions` 메서드를 사용하여 이러한 거래 기록을 조회할 수 있으며, 고객이 적립 및 차감 내역을 확인할 수 있도록 로그를 제공하는 데 유용합니다:

```php
// 모든 거래 조회...
$transactions = $user->balanceTransactions();

foreach ($transactions as $transaction) {
    // 거래 금액...
    $amount = $transaction->amount(); // $2.31

    // 관련 인보이스가 있을 때 조회...
    $invoice = $transaction->invoice();
}
```


### 세금 ID {#tax-ids}

Cashier는 고객의 세금 ID를 쉽게 관리할 수 있는 방법을 제공합니다. 예를 들어, `taxIds` 메서드를 사용하여 고객에게 할당된 모든 [세금 ID](https://stripe.com/docs/api/customer_tax_ids/object)를 컬렉션으로 조회할 수 있습니다:

```php
$taxIds = $user->taxIds();
```

고객의 특정 세금 ID를 식별자로 조회할 수도 있습니다:

```php
$taxId = $user->findTaxId('txi_belgium');
```

유효한 [타입](https://stripe.com/docs/api/customer_tax_ids/object#tax_id_object-type)과 값을 `createTaxId` 메서드에 제공하여 새 세금 ID를 생성할 수 있습니다:

```php
$taxId = $user->createTaxId('eu_vat', 'BE0123456789');
```

`createTaxId` 메서드는 VAT ID를 고객 계정에 즉시 추가합니다. [VAT ID 검증도 Stripe에서 수행](https://stripe.com/docs/invoicing/customer/tax-ids#validation)되지만, 이는 비동기 프로세스입니다. `customer.tax_id.updated` webhook 이벤트를 구독하고 [VAT ID의 `verification` 파라미터](https://stripe.com/docs/api/customer_tax_ids/object#tax_id_object-verification)를 검사하여 검증 업데이트를 알림받을 수 있습니다. webhook 처리에 대한 자세한 내용은 [webhook 핸들러 정의 문서](#handling-stripe-webhooks)를 참고하세요.

`deleteTaxId` 메서드를 사용하여 세금 ID를 삭제할 수 있습니다:

```php
$user->deleteTaxId('txi_belgium');
```


### Stripe와 고객 데이터 동기화 {#syncing-customer-data-with-stripe}

일반적으로 애플리케이션 사용자가 이름, 이메일 주소 또는 Stripe에도 저장되는 기타 정보를 업데이트할 때, Stripe에도 해당 업데이트를 알려야 합니다. 이렇게 하면 Stripe의 정보 사본이 애플리케이션과 동기화됩니다.

이를 자동화하려면, 청구 가능 모델의 `updated` 이벤트에 반응하는 이벤트 리스너를 정의할 수 있습니다. 이벤트 리스너 내에서 모델의 `syncStripeCustomerDetails` 메서드를 호출하면 됩니다:

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

이제 고객 모델이 업데이트될 때마다 Stripe와 정보가 동기화됩니다. 편의를 위해, Cashier는 고객이 처음 생성될 때도 Stripe와 정보를 자동으로 동기화합니다.

Stripe로 동기화할 고객 정보 컬럼을 커스터마이즈하려면 Cashier에서 제공하는 다양한 메서드를 오버라이드할 수 있습니다. 예를 들어, Cashier가 Stripe로 고객 정보를 동기화할 때 "이름"으로 간주할 속성을 커스터마이즈하려면 `stripeName` 메서드를 오버라이드할 수 있습니다:

```php
/**
 * Stripe로 동기화할 고객 이름을 반환합니다.
 */
public function stripeName(): string|null
{
    return $this->company_name;
}
```

마찬가지로, `stripeEmail`, `stripePhone`, `stripeAddress`, `stripePreferredLocales` 메서드도 오버라이드할 수 있습니다. 이 메서드들은 [Stripe 고객 객체 업데이트](https://stripe.com/docs/api/customers/update) 시 해당 고객 파라미터로 정보를 동기화합니다. 고객 정보 동기화 프로세스를 완전히 제어하고 싶다면 `syncStripeCustomerDetails` 메서드를 오버라이드할 수 있습니다.


### 청구 포털 {#billing-portal}

Stripe는 [청구 포털을 쉽게 설정할 수 있는 방법](https://stripe.com/docs/billing/subscriptions/customer-portal)을 제공합니다. 이를 통해 고객은 구독, 결제 수단을 관리하고 청구 내역을 확인할 수 있습니다. 컨트롤러나 라우트에서 청구 가능 모델의 `redirectToBillingPortal` 메서드를 호출하여 사용자를 청구 포털로 리디렉션할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/billing-portal', function (Request $request) {
    return $request->user()->redirectToBillingPortal();
});
```

기본적으로 사용자가 구독 관리를 마치면 Stripe 청구 포털 내의 링크를 통해 애플리케이션의 `home` 라우트로 돌아올 수 있습니다. 사용자가 돌아올 커스텀 URL을 지정하려면 `redirectToBillingPortal` 메서드에 URL을 인수로 전달하세요:

```php
use Illuminate\Http\Request;

Route::get('/billing-portal', function (Request $request) {
    return $request->user()->redirectToBillingPortal(route('billing'));
});
```

HTTP 리디렉션 응답을 생성하지 않고 청구 포털의 URL만 생성하려면 `billingPortalUrl` 메서드를 사용할 수 있습니다:

```php
$url = $request->user()->billingPortalUrl(route('billing'));
```


## 결제 수단 {#payment-methods}


### 결제 수단 저장 {#storing-payment-methods}

Stripe로 구독을 생성하거나 "단일 결제"를 수행하려면 결제 수단을 저장하고 Stripe에서 해당 식별자를 조회해야 합니다. 결제 수단을 구독에 사용할지, 단일 결제에 사용할지에 따라 접근 방식이 다르므로 아래에서 각각 살펴보겠습니다.


#### 구독용 결제 수단 {#payment-methods-for-subscriptions}

구독에서 고객의 신용카드 정보를 향후 사용을 위해 저장할 때는 Stripe의 "Setup Intents" API를 사용하여 고객의 결제 수단 정보를 안전하게 수집해야 합니다. "Setup Intent"는 Stripe에 고객의 결제 수단을 청구할 의도를 알립니다. Cashier의 `Billable` 트레이트에는 새 Setup Intent를 쉽게 생성할 수 있는 `createSetupIntent` 메서드가 포함되어 있습니다. 이 메서드는 고객의 결제 수단 정보를 수집하는 폼을 렌더링하는 라우트나 컨트롤러에서 호출해야 합니다:

```php
return view('update-payment-method', [
    'intent' => $user->createSetupIntent()
]);
```

Setup Intent를 생성하여 뷰에 전달한 후, 해당 시크릿을 결제 수단을 수집할 요소에 첨부해야 합니다. 예를 들어, 다음과 같은 "결제 수단 업데이트" 폼을 생각해볼 수 있습니다:

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

다음으로, 카드를 검증하고 Stripe의 [`confirmCardSetup` 메서드](https://stripe.com/docs/js/setup_intents/confirm_card_setup)를 사용하여 안전한 "결제 수단 식별자"를 조회할 수 있습니다:

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
        // 카드가 성공적으로 검증됨...
    }
});
```

Stripe에서 카드가 검증된 후, 결과로 나온 `setupIntent.payment_method` 식별자를 Laravel 애플리케이션에 전달하여 고객에게 연결할 수 있습니다. 결제 수단은 [새 결제 수단으로 추가](#adding-payment-methods)하거나 [기본 결제 수단을 업데이트](#updating-the-default-payment-method)하는 데 사용할 수 있습니다. 또한 결제 수단 식별자를 즉시 사용하여 [새 구독을 생성](#creating-subscriptions)할 수도 있습니다.

> [!NOTE]
> Setup Intent 및 고객 결제 정보 수집에 대한 자세한 내용은 [Stripe에서 제공하는 개요](https://stripe.com/docs/payments/save-and-reuse#php)를 참고하세요.


#### 단일 결제용 결제 수단 {#payment-methods-for-single-charges}

물론, 고객의 결제 수단에 대해 단일 결제를 수행할 때는 결제 수단 식별자를 한 번만 사용하면 됩니다. Stripe의 제한으로 인해, 단일 결제에는 고객의 저장된 기본 결제 수단을 사용할 수 없습니다. Stripe.js 라이브러리를 사용하여 고객이 결제 수단 정보를 입력하도록 해야 합니다. 예를 들어, 다음과 같은 폼을 생각해볼 수 있습니다:

```html
<input id="card-holder-name" type="text">

<!-- Stripe Elements Placeholder -->
<div id="card-element"></div>

<button id="card-button">
    결제 처리
</button>
```

이런 폼을 정의한 후, Stripe.js 라이브러리를 사용하여 [Stripe Element](https://stripe.com/docs/stripe-js)를 폼에 연결하고 고객의 결제 정보를 안전하게 수집할 수 있습니다:

```html
<script src="https://js.stripe.com/v3/"></script>

<script>
    const stripe = Stripe('stripe-public-key');

    const elements = stripe.elements();
    const cardElement = elements.create('card');

    cardElement.mount('#card-element');
</script>
```

다음으로, 카드를 검증하고 Stripe의 [`createPaymentMethod` 메서드](https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method)를 사용하여 안전한 "결제 수단 식별자"를 조회할 수 있습니다:

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
        // 카드가 성공적으로 검증됨...
    }
});
```

카드가 성공적으로 검증되면, `paymentMethod.id`를 Laravel 애플리케이션에 전달하여 [단일 결제](#simple-charge)를 처리할 수 있습니다.


### 결제 수단 조회 {#retrieving-payment-methods}

청구 가능 모델 인스턴스의 `paymentMethods` 메서드는 `Laravel\Cashier\PaymentMethod` 인스턴스의 컬렉션을 반환합니다:

```php
$paymentMethods = $user->paymentMethods();
```

기본적으로 이 메서드는 모든 타입의 결제 수단을 반환합니다. 특정 타입의 결제 수단만 조회하려면 `type`을 인수로 전달할 수 있습니다:

```php
$paymentMethods = $user->paymentMethods('sepa_debit');
```

고객의 기본 결제 수단을 조회하려면 `defaultPaymentMethod` 메서드를 사용할 수 있습니다:

```php
$paymentMethod = $user->defaultPaymentMethod();
```

청구 가능 모델에 연결된 특정 결제 수단을 조회하려면 `findPaymentMethod` 메서드를 사용할 수 있습니다:

```php
$paymentMethod = $user->findPaymentMethod($paymentMethodId);
```


### 결제 수단 존재 여부 {#payment-method-presence}

청구 가능 모델에 기본 결제 수단이 연결되어 있는지 확인하려면 `hasDefaultPaymentMethod` 메서드를 호출하세요:

```php
if ($user->hasDefaultPaymentMethod()) {
    // ...
}
```

청구 가능 모델에 하나 이상의 결제 수단이 연결되어 있는지 확인하려면 `hasPaymentMethod` 메서드를 사용할 수 있습니다:

```php
if ($user->hasPaymentMethod()) {
    // ...
}
```

이 메서드는 청구 가능 모델에 결제 수단이 하나라도 있는지 확인합니다. 특정 타입의 결제 수단이 존재하는지 확인하려면 `type`을 인수로 전달할 수 있습니다:

```php
if ($user->hasPaymentMethod('sepa_debit')) {
    // ...
}
```


### 기본 결제 수단 업데이트 {#updating-the-default-payment-method}

`updateDefaultPaymentMethod` 메서드를 사용하여 고객의 기본 결제 수단 정보를 업데이트할 수 있습니다. 이 메서드는 Stripe 결제 수단 식별자를 인수로 받아 새 결제 수단을 기본 청구 결제 수단으로 지정합니다:

```php
$user->updateDefaultPaymentMethod($paymentMethod);
```

기본 결제 수단 정보를 Stripe의 고객 기본 결제 수단 정보와 동기화하려면 `updateDefaultPaymentMethodFromStripe` 메서드를 사용할 수 있습니다:

```php
$user->updateDefaultPaymentMethodFromStripe();
```

> [!WARNING]
> 고객의 기본 결제 수단은 인보이스 발행 및 새 구독 생성에만 사용할 수 있습니다. Stripe의 제한으로 인해 단일 결제에는 사용할 수 없습니다.


### 결제 수단 추가 {#adding-payment-methods}

새 결제 수단을 추가하려면, 결제 수단 식별자를 전달하여 청구 가능 모델의 `addPaymentMethod` 메서드를 호출하세요:

```php
$user->addPaymentMethod($paymentMethod);
```

> [!NOTE]
> 결제 수단 식별자 조회 방법은 [결제 수단 저장 문서](#storing-payment-methods)를 참고하세요.


### 결제 수단 삭제 {#deleting-payment-methods}

결제 수단을 삭제하려면, 삭제하려는 `Laravel\Cashier\PaymentMethod` 인스턴스에서 `delete` 메서드를 호출하세요:

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

기본적으로 이 메서드는 모든 타입의 결제 수단을 삭제합니다. 특정 타입의 결제 수단만 삭제하려면 `type`을 인수로 전달할 수 있습니다:

```php
$user->deletePaymentMethods('sepa_debit');
```

> [!WARNING]
> 사용자가 활성 구독을 가지고 있다면, 애플리케이션에서 기본 결제 수단을 삭제할 수 없도록 해야 합니다.


## 구독 {#subscriptions}

구독은 고객을 위한 반복 결제를 설정하는 방법을 제공합니다. Cashier에서 관리하는 Stripe 구독은 여러 구독 가격, 구독 수량, 체험판 등 다양한 기능을 지원합니다.


### 구독 생성 {#creating-subscriptions}

구독을 생성하려면, 먼저 청구 가능 모델 인스턴스를 조회해야 합니다. 일반적으로 이는 `App\Models\User`의 인스턴스입니다. 모델 인스턴스를 조회한 후, `newSubscription` 메서드를 사용하여 모델의 구독을 생성할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription(
        'default', 'price_monthly'
    )->create($request->paymentMethodId);

    // ...
});
```

`newSubscription` 메서드에 전달하는 첫 번째 인수는 구독의 내부 타입입니다. 애플리케이션에서 단일 구독만 제공한다면 `default` 또는 `primary`로 지정할 수 있습니다. 이 구독 타입은 내부 애플리케이션 용도로만 사용되며, 사용자에게 표시되지 않습니다. 또한, 공백이 없어야 하며 구독 생성 후에는 절대 변경해서는 안 됩니다. 두 번째 인수는 사용자가 구독할 특정 가격입니다. 이 값은 Stripe의 가격 식별자와 일치해야 합니다.

[Stripe 결제 수단 식별자](#storing-payment-methods) 또는 Stripe `PaymentMethod` 객체를 받는 `create` 메서드는 구독을 시작하고, 청구 가능 모델의 Stripe 고객 ID 및 기타 관련 청구 정보를 데이터베이스에 업데이트합니다.

> [!WARNING]
> 결제 수단 식별자를 `create` 구독 메서드에 직접 전달하면 해당 결제 수단이 사용자의 저장된 결제 수단에도 자동으로 추가됩니다.


#### 인보이스 이메일을 통한 반복 결제 수금 {#collecting-recurring-payments-via-invoice-emails}

고객의 반복 결제를 자동으로 수금하는 대신, 결제 기한마다 Stripe가 고객에게 인보이스를 이메일로 전송하도록 할 수 있습니다. 그러면 고객은 인보이스를 받은 후 직접 결제할 수 있습니다. 인보이스를 통한 반복 결제 수금 시, 고객은 미리 결제 수단을 제공할 필요가 없습니다:

```php
$user->newSubscription('default', 'price_monthly')->createAndSendInvoice();
```

고객이 인보이스를 결제하지 않으면 구독이 취소되기까지의 기간은 `days_until_due` 옵션에 의해 결정됩니다. 기본값은 30일이지만, 원하는 값을 지정할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')->createAndSendInvoice([], [
    'days_until_due' => 30
]);
```


#### 수량 {#subscription-quantities}

구독 생성 시 가격에 대해 특정 [수량](https://stripe.com/docs/billing/subscriptions/quantities)을 설정하려면, 구독 빌더에서 `quantity` 메서드를 호출하세요:

```php
$user->newSubscription('default', 'price_monthly')
    ->quantity(5)
    ->create($paymentMethod);
```


#### 추가 정보 {#additional-details}

Stripe에서 지원하는 추가 [고객](https://stripe.com/docs/api/customers/create) 또는 [구독](https://stripe.com/docs/api/subscriptions/create) 옵션을 지정하려면, `create` 메서드의 두 번째 및 세 번째 인수로 전달할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')->create($paymentMethod, [
    'email' => $email,
], [
    'metadata' => ['note' => '추가 정보.'],
]);
```


#### 쿠폰 {#coupons}

구독 생성 시 쿠폰을 적용하려면 `withCoupon` 메서드를 사용할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')
    ->withCoupon('code')
    ->create($paymentMethod);
```

또는, [Stripe 프로모션 코드](https://stripe.com/docs/billing/subscriptions/discounts/codes)를 적용하려면 `withPromotionCode` 메서드를 사용할 수 있습니다:

```php
$user->newSubscription('default', 'price_monthly')
    ->withPromotionCode('promo_code_id')
    ->create($paymentMethod);
```

전달하는 프로모션 코드 ID는 고객에게 표시되는 코드가 아니라 Stripe API에서 할당된 프로모션 코드 ID여야 합니다. 고객에게 표시되는 프로모션 코드로부터 프로모션 코드 ID를 찾으려면 `findPromotionCode` 메서드를 사용할 수 있습니다:

```php
// 고객에게 표시되는 코드로 프로모션 코드 ID 찾기...
$promotionCode = $user->findPromotionCode('SUMMERSALE');

// 활성 프로모션 코드 ID 찾기...
$promotionCode = $user->findActivePromotionCode('SUMMERSALE');
```

위 예시에서 반환된 `$promotionCode` 객체는 `Laravel\Cashier\PromotionCode` 인스턴스입니다. 이 클래스는 내부적으로 `Stripe\PromotionCode` 객체를 감쌉니다. `coupon` 메서드를 호출하여 프로모션 코드와 관련된 쿠폰을 조회할 수 있습니다:

```php
$coupon = $user->findPromotionCode('SUMMERSALE')->coupon();
```

쿠폰 인스턴스를 통해 할인 금액과 쿠폰이 고정 할인인지, 퍼센트 할인인지 확인할 수 있습니다:

```php
if ($coupon->isPercentage()) {
    return $coupon->percentOff().'%'; // 21.5%
} else {
    return $coupon->amountOff(); // $5.99
}
```

현재 고객 또는 구독에 적용된 할인도 조회할 수 있습니다:

```php
$discount = $billable->discount();

$discount = $subscription->discount();
```

반환된 `Laravel\Cashier\Discount` 인스턴스는 내부적으로 `Stripe\Discount` 객체를 감쌉니다. 이 할인과 관련된 쿠폰을 조회하려면 `coupon` 메서드를 호출하세요:

```php
$coupon = $subscription->discount()->coupon();
```

고객 또는 구독에 새 쿠폰이나 프로모션 코드를 적용하려면 `applyCoupon` 또는 `applyPromotionCode` 메서드를 사용할 수 있습니다:

```php
$billable->applyCoupon('coupon_id');
$billable->applyPromotionCode('promotion_code_id');

$subscription->applyCoupon('coupon_id');
$subscription->applyPromotionCode('promotion_code_id');
```

Stripe API에서 할당된 프로모션 코드 ID를 사용해야 하며, 고객에게 표시되는 코드는 사용하지 마세요. 한 번에 하나의 쿠폰 또는 프로모션 코드만 고객 또는 구독에 적용할 수 있습니다.

자세한 내용은 Stripe의 [쿠폰](https://stripe.com/docs/billing/subscriptions/coupons) 및 [프로모션 코드](https://stripe.com/docs/billing/subscriptions/coupons/codes) 문서를 참고하세요.


#### 구독 추가 {#adding-subscriptions}

기본 결제 수단이 이미 있는 고객에게 구독을 추가하려면 구독 빌더에서 `add` 메서드를 호출할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->newSubscription('default', 'price_monthly')->add();
```


#### Stripe 대시보드에서 구독 생성 {#creating-subscriptions-from-the-stripe-dashboard}

Stripe 대시보드 자체에서 구독을 생성할 수도 있습니다. 이 경우, Cashier는 새로 추가된 구독을 동기화하고 타입을 `default`로 지정합니다. 대시보드에서 생성된 구독에 할당되는 구독 타입을 커스터마이즈하려면 [webhook 이벤트 핸들러를 정의](#defining-webhook-event-handlers)하세요.

또한, Stripe 대시보드를 통해서는 한 가지 타입의 구독만 생성할 수 있습니다. 애플리케이션에서 여러 타입의 구독을 제공하는 경우, 대시보드를 통해서는 한 타입의 구독만 추가할 수 있습니다.

마지막으로, 애플리케이션에서 제공하는 각 구독 타입마다 하나의 활성 구독만 추가해야 합니다. 고객이 두 개의 `default` 구독을 가지고 있다면, Cashier는 가장 최근에 추가된 구독만 사용하며, 두 구독 모두 애플리케이션 데이터베이스에 동기화됩니다.


### 구독 상태 확인 {#checking-subscription-status}

고객이 애플리케이션에 구독한 후에는 다양한 편리한 메서드를 사용하여 구독 상태를 쉽게 확인할 수 있습니다. 먼저, `subscribed` 메서드는 고객이 활성 구독을 가지고 있으면(구독이 체험판 기간 중이어도) `true`를 반환합니다. `subscribed` 메서드는 첫 번째 인수로 구독 타입을 받습니다:

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
     * 들어오는 요청을 처리합니다.
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

사용자가 아직 체험판 기간 내에 있는지 확인하려면 `onTrial` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 체험판 기간임을 사용자에게 경고로 표시할지 결정하는 데 유용합니다:

```php
if ($user->subscription('default')->onTrial()) {
    // ...
}
```

`subscribedToProduct` 메서드는 주어진 Stripe 상품 식별자를 기반으로 사용자가 해당 상품에 구독 중인지 확인할 수 있습니다. Stripe에서 상품은 가격의 모음입니다. 이 예시에서는 사용자의 `default` 구독이 애플리케이션의 "premium" 상품에 활성 구독 중인지 확인합니다. 전달하는 Stripe 상품 식별자는 Stripe 대시보드의 상품 식별자와 일치해야 합니다:

```php
if ($user->subscribedToProduct('prod_premium', 'default')) {
    // ...
}
```

배열을 `subscribedToProduct` 메서드에 전달하면 사용자의 `default` 구독이 애플리케이션의 "basic" 또는 "premium" 상품에 활성 구독 중인지 확인할 수 있습니다:

```php
if ($user->subscribedToProduct(['prod_basic', 'prod_premium'], 'default')) {
    // ...
}
```

`subscribedToPrice` 메서드는 고객의 구독이 주어진 가격 ID에 해당하는지 확인할 수 있습니다:

```php
if ($user->subscribedToPrice('price_basic_monthly', 'default')) {
    // ...
}
```

`recurring` 메서드는 사용자가 현재 구독 중이며 더 이상 체험판 기간이 아닌지 확인할 수 있습니다:

```php
if ($user->subscription('default')->recurring()) {
    // ...
}
```

> [!WARNING]
> 사용자가 동일한 타입의 구독을 두 개 가지고 있다면, `subscription` 메서드는 항상 가장 최근의 구독을 반환합니다. 예를 들어, 사용자가 `default` 타입의 구독 레코드를 두 개 가지고 있을 수 있지만, 하나는 오래된 만료 구독이고 다른 하나는 현재 활성 구독일 수 있습니다. 가장 최근의 구독만 반환되며, 이전 구독은 이력 확인을 위해 데이터베이스에 남아 있습니다.


#### 취소된 구독 상태 {#cancelled-subscription-status}

사용자가 한때 활성 구독자였지만 구독을 취소했는지 확인하려면 `canceled` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription('default')->canceled()) {
    // ...
}
```

또한, 사용자가 구독을 취소했지만 구독이 완전히 만료되기 전 "유예 기간"에 있는지도 확인할 수 있습니다. 예를 들어, 사용자가 3월 5일에 구독을 취소했지만 원래 3월 10일에 만료될 예정이었다면, 3월 10일까지 "유예 기간"에 있게 됩니다. 이 기간 동안 `subscribed` 메서드는 여전히 `true`를 반환합니다:

```php
if ($user->subscription('default')->onGracePeriod()) {
    // ...
}
```

사용자가 구독을 취소했고 더 이상 "유예 기간"이 아닌지 확인하려면 `ended` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription('default')->ended()) {
    // ...
}
```


#### 미완료 및 연체 상태 {#incomplete-and-past-due-status}

구독 생성 후 추가 결제 작업이 필요한 경우 구독은 `incomplete` 상태로 표시됩니다. 구독 상태는 Cashier의 `subscriptions` 데이터베이스 테이블의 `stripe_status` 컬럼에 저장됩니다.

마찬가지로, 가격 변경 시 추가 결제 작업이 필요한 경우 구독은 `past_due` 상태로 표시됩니다. 구독이 이 두 상태 중 하나에 있을 때는 고객이 결제를 확인할 때까지 활성화되지 않습니다. 구독에 미완료 결제가 있는지 확인하려면 청구 가능 모델 또는 구독 인스턴스에서 `hasIncompletePayment` 메서드를 사용할 수 있습니다:

```php
if ($user->hasIncompletePayment('default')) {
    // ...
}

if ($user->subscription('default')->hasIncompletePayment()) {
    // ...
}
```

구독에 미완료 결제가 있는 경우, 사용자를 Cashier의 결제 확인 페이지로 안내하고 `latestPayment` 식별자를 전달해야 합니다. 구독 인스턴스에서 제공하는 `latestPayment` 메서드를 사용하여 이 식별자를 조회할 수 있습니다:

```html
<a href="{{ route('cashier.payment', $subscription->latestPayment()->id) }}">
    결제를 확인해 주세요.
</a>
```

구독이 `past_due` 또는 `incomplete` 상태일 때도 여전히 활성 상태로 간주하려면, Cashier에서 제공하는 `keepPastDueSubscriptionsActive` 및 `keepIncompleteSubscriptionsActive` 메서드를 사용할 수 있습니다. 일반적으로 이 메서드는 `App\Providers\AppServiceProvider`의 `register` 메서드에서 호출해야 합니다:

```php
use Laravel\Cashier\Cashier;

/**
 * 애플리케이션 서비스를 등록합니다.
 */
public function register(): void
{
    Cashier::keepPastDueSubscriptionsActive();
    Cashier::keepIncompleteSubscriptionsActive();
}
```

> [!WARNING]
> 구독이 `incomplete` 상태일 때는 결제가 확인될 때까지 변경할 수 없습니다. 따라서 구독이 `incomplete` 상태일 때는 `swap` 및 `updateQuantity` 메서드가 예외를 발생시킵니다.


#### 구독 스코프 {#subscription-scopes}

대부분의 구독 상태는 쿼리 스코프로도 제공되어, 특정 상태의 구독을 데이터베이스에서 쉽게 조회할 수 있습니다:

```php
// 모든 활성 구독 조회...
$subscriptions = Subscription::query()->active()->get();

// 사용자의 모든 취소된 구독 조회...
$subscriptions = $user->subscriptions()->canceled()->get();
```

사용 가능한 스코프 전체 목록은 아래와 같습니다:

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


### 가격 변경 {#changing-prices}

고객이 애플리케이션에 구독한 후, 가끔 새로운 구독 가격으로 변경하고 싶어할 수 있습니다. 고객을 새 가격으로 변경하려면 Stripe 가격 식별자를 `swap` 메서드에 전달하세요. 가격을 변경할 때, 이전에 구독이 취소된 경우에도 구독을 다시 활성화하려는 것으로 간주합니다. 전달하는 가격 식별자는 Stripe 대시보드의 가격 식별자와 일치해야 합니다:

```php
use App\Models\User;

$user = App\Models\User::find(1);

$user->subscription('default')->swap('price_yearly');
```

고객이 체험판 중이라면, 체험판 기간이 유지됩니다. 또한, 구독에 "수량"이 있다면 해당 수량도 유지됩니다.

가격을 변경하면서 고객이 현재 체험판 중이라면 체험판을 취소하려면 `skipTrial` 메서드를 호출할 수 있습니다:

```php
$user->subscription('default')
    ->skipTrial()
    ->swap('price_yearly');
```

가격을 변경하면서 다음 청구 주기를 기다리지 않고 즉시 고객에게 인보이스를 발행하려면 `swapAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->swapAndInvoice('price_yearly');
```


#### 비례 배분(Prorations) {#prorations}

기본적으로 Stripe는 가격 변경 시 요금을 비례 배분합니다. `noProrate` 메서드를 사용하면 요금을 비례 배분하지 않고 구독 가격을 업데이트할 수 있습니다:

```php
$user->subscription('default')->noProrate()->swap('price_yearly');
```

구독 비례 배분에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/billing/subscriptions/prorations)를 참고하세요.

> [!WARNING]
> `swapAndInvoice` 메서드 전에 `noProrate` 메서드를 실행해도 비례 배분에는 영향을 주지 않습니다. 인보이스는 항상 발행됩니다.


### 구독 수량 {#subscription-quantity}

때로는 구독이 "수량"에 따라 달라집니다. 예를 들어, 프로젝트 관리 애플리케이션은 프로젝트당 월 $10을 청구할 수 있습니다. `incrementQuantity` 및 `decrementQuantity` 메서드를 사용하여 구독 수량을 쉽게 증가 또는 감소시킬 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$user->subscription('default')->incrementQuantity();

// 구독의 현재 수량에 5 추가...
$user->subscription('default')->incrementQuantity(5);

$user->subscription('default')->decrementQuantity();

// 구독의 현재 수량에서 5 차감...
$user->subscription('default')->decrementQuantity(5);
```

또는, `updateQuantity` 메서드를 사용하여 특정 수량으로 설정할 수 있습니다:

```php
$user->subscription('default')->updateQuantity(10);
```

`noProrate` 메서드를 사용하면 요금을 비례 배분하지 않고 구독 수량을 업데이트할 수 있습니다:

```php
$user->subscription('default')->noProrate()->updateQuantity(10);
```

구독 수량에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/subscriptions/quantities)를 참고하세요.


#### 여러 상품이 포함된 구독의 수량 {#quantities-for-subscription-with-multiple-products}

구독이 [여러 상품이 포함된 구독](#subscriptions-with-multiple-products)인 경우, 증가/감소 메서드의 두 번째 인수로 수량을 변경할 가격의 ID를 전달해야 합니다:

```php
$user->subscription('default')->incrementQuantity(1, 'price_chat');
```


### 여러 상품이 포함된 구독 {#subscriptions-with-multiple-products}

[여러 상품이 포함된 구독](https://stripe.com/docs/billing/subscriptions/multiple-products)을 사용하면 하나의 구독에 여러 청구 상품을 할당할 수 있습니다. 예를 들어, 고객 지원 "헬프데스크" 애플리케이션을 구축한다고 가정해봅시다. 기본 구독 가격은 월 $10이고, 라이브 채팅 추가 상품은 월 $15입니다. 여러 상품이 포함된 구독 정보는 Cashier의 `subscription_items` 데이터베이스 테이블에 저장됩니다.

주어진 구독에 여러 상품을 지정하려면 `newSubscription` 메서드의 두 번째 인수로 가격 배열을 전달하세요:

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

위 예시에서 고객은 `default` 구독에 두 개의 가격이 연결됩니다. 두 가격 모두 각자의 청구 주기에 따라 청구됩니다. 필요하다면, `quantity` 메서드를 사용하여 각 가격에 대해 특정 수량을 지정할 수 있습니다:

```php
$user = User::find(1);

$user->newSubscription('default', ['price_monthly', 'price_chat'])
    ->quantity(5, 'price_chat')
    ->create($paymentMethod);
```

기존 구독에 다른 가격을 추가하려면 구독의 `addPrice` 메서드를 호출할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->addPrice('price_chat');
```

위 예시는 새 가격을 추가하며, 고객은 다음 청구 주기에 해당 가격에 대해 청구됩니다. 즉시 청구하려면 `addPriceAndInvoice` 메서드를 사용할 수 있습니다:

```php
$user->subscription('default')->addPriceAndInvoice('price_chat');
```

특정 수량으로 가격을 추가하려면 `addPrice` 또는 `addPriceAndInvoice` 메서드의 두 번째 인수로 수량을 전달할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->addPrice('price_chat', 5);
```

`removePrice` 메서드를 사용하여 구독에서 가격을 제거할 수 있습니다:

```php
$user->subscription('default')->removePrice('price_chat');
```

> [!WARNING]
> 구독에서 마지막 가격은 제거할 수 없습니다. 대신 구독을 취소해야 합니다.


#### 가격 변경 {#swapping-prices}

여러 상품이 포함된 구독에 연결된 가격도 변경할 수 있습니다. 예를 들어, 고객이 `price_basic` 구독과 `price_chat` 추가 상품을 가지고 있고, `price_basic`에서 `price_pro`로 업그레이드하려는 경우:

```php
use App\Models\User;

$user = User::find(1);

$user->subscription('default')->swap(['price_pro', 'price_chat']);
```

위 예시를 실행하면, `price_basic`이 있는 구독 항목은 삭제되고, `price_chat`이 있는 항목은 유지됩니다. 또한, `price_pro`에 대한 새 구독 항목이 생성됩니다.

구독 항목 옵션을 지정해야 한다면, `swap` 메서드에 키/값 쌍의 배열을 전달할 수 있습니다. 예를 들어, 구독 가격 수량을 지정해야 할 수 있습니다:

```php
$user = User::find(1);

$user->subscription('default')->swap([
    'price_pro' => ['quantity' => 5],
    'price_chat'
]);
```

구독의 단일 가격만 변경하려면 구독 항목 자체의 `swap` 메서드를 사용할 수 있습니다. 이 방법은 구독의 다른 가격에 있는 모든 기존 메타데이터를 유지하고 싶을 때 특히 유용합니다:

```php
$user = User::find(1);

$user->subscription('default')
    ->findItemOrFail('price_basic')
    ->swap('price_pro');
```


#### 비례 배분(Proration) {#proration}

기본적으로 Stripe는 여러 상품이 포함된 구독에서 가격을 추가하거나 제거할 때 요금을 비례 배분합니다. 비례 배분 없이 가격을 조정하려면 가격 작업에 `noProrate` 메서드를 체이닝하세요:

```php
$user->subscription('default')->noProrate()->removePrice('price_chat');
```


#### 수량 {#swapping-quantities}

개별 구독 가격의 수량을 업데이트하려면, [기존 수량 메서드](#subscription-quantity)에 가격의 ID를 추가 인수로 전달하면 됩니다:

```php
$user = User::find(1);

$user->subscription('default')->incrementQuantity(5, 'price_chat');

$user->subscription('default')->decrementQuantity(3, 'price_chat');

$user->subscription('default')->updateQuantity(10, 'price_chat');
```

> [!WARNING]
> 구독에 여러 가격이 있을 때는 `Subscription` 모델의 `stripe_price` 및 `quantity` 속성이 `null`이 됩니다. 개별 가격 속성에 접근하려면 `Subscription` 모델의 `items` 관계를 사용해야 합니다.


#### 구독 항목 {#subscription-items}

구독에 여러 가격이 있을 때는 데이터베이스의 `subscription_items` 테이블에 여러 구독 "항목"이 저장됩니다. 구독의 `items` 관계를 통해 이 항목들에 접근할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

$subscriptionItem = $user->subscription('default')->items->first();

// 특정 항목의 Stripe 가격 및 수량 조회...
$stripePrice = $subscriptionItem->stripe_price;
$quantity = $subscriptionItem->quantity;
```

`findItemOrFail` 메서드를 사용하여 특정 가격을 조회할 수도 있습니다:

```php
$user = User::find(1);

$subscriptionItem = $user->subscription('default')->findItemOrFail('price_chat');
```


### 다중 구독 {#multiple-subscriptions}

Stripe는 고객이 동시에 여러 구독을 가질 수 있도록 허용합니다. 예를 들어, 헬스장이 수영 구독과 웨이트 트레이닝 구독을 제공하고, 각 구독에 다른 가격이 있을 수 있습니다. 물론, 고객은 두 플랜 중 하나 또는 모두에 구독할 수 있어야 합니다.

애플리케이션에서 구독을 생성할 때, `newSubscription` 메서드에 구독 타입을 지정할 수 있습니다. 타입은 사용자가 시작하는 구독의 타입을 나타내는 임의의 문자열일 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/swimming/subscribe', function (Request $request) {
    $request->user()->newSubscription('swimming')
        ->price('price_swimming_monthly')
        ->create($request->paymentMethodId);

    // ...
});
```

이 예시에서는 고객에게 월간 수영 구독을 시작했습니다. 하지만 나중에 연간 구독으로 변경하고 싶을 수 있습니다. 고객의 구독을 조정할 때는 `swimming` 구독의 가격만 변경하면 됩니다:

```php
$user->subscription('swimming')->swap('price_swimming_yearly');
```

물론, 구독을 완전히 취소할 수도 있습니다:

```php
$user->subscription('swimming')->cancel();
```


### 사용량 기반 청구 {#usage-based-billing}

[사용량 기반 청구](https://stripe.com/docs/billing/subscriptions/metered-billing)를 사용하면 고객의 상품 사용량에 따라 청구할 수 있습니다. 예를 들어, 고객이 한 달에 보낸 문자 메시지나 이메일 수에 따라 요금을 청구할 수 있습니다.

사용량 청구를 시작하려면, Stripe 대시보드에서 [사용량 기반 청구 모델](https://docs.stripe.com/billing/subscriptions/usage-based/implementation-guide)과 [미터](https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage#configure-meter)가 있는 새 상품을 먼저 생성해야 합니다. 미터를 생성한 후, 관련 이벤트 이름과 미터 ID를 저장하세요. 그런 다음, `meteredPrice` 메서드를 사용하여 고객 구독에 미터 가격 ID를 추가할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription('default')
        ->meteredPrice('price_metered')
        ->create($request->paymentMethodId);

    // ...
});
```

[Stripe Checkout](#checkout)을 통해서도 미터 구독을 시작할 수 있습니다:

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

고객이 애플리케이션을 사용할 때마다 Stripe에 사용량을 보고하여 정확하게 청구할 수 있습니다. 미터 이벤트의 사용량을 보고하려면 `Billable` 모델의 `reportMeterEvent` 메서드를 사용하세요:

```php
$user = User::find(1);

$user->reportMeterEvent('emails-sent');
```

기본적으로 "사용량 수량" 1이 청구 기간에 추가됩니다. 또는, 고객의 청구 기간 사용량에 추가할 "사용량"을 명시적으로 전달할 수 있습니다:

```php
$user = User::find(1);

$user->reportMeterEvent('emails-sent', quantity: 15);
```

미터에 대한 고객의 이벤트 요약을 조회하려면 `Billable` 인스턴스의 `meterEventSummaries` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$meterUsage = $user->meterEventSummaries($meterId);

$meterUsage->first()->aggregated_value // 10
```

미터 이벤트 요약에 대한 자세한 내용은 Stripe의 [Meter Event Summary 객체 문서](https://docs.stripe.com/api/billing/meter-event_summary/object)를 참고하세요.

[모든 미터 목록 조회](https://docs.stripe.com/api/billing/meter/list)는 `Billable` 인스턴스의 `meters` 메서드를 사용하세요:

```php
$user = User::find(1);

$user->meters();
```


### 구독 세금 {#subscription-taxes}

> [!WARNING]
> 세율을 수동으로 계산하는 대신 [Stripe Tax를 사용하여 세금을 자동 계산](#tax-configuration)할 수 있습니다.

사용자가 구독에 대해 지불해야 하는 세율을 지정하려면, 청구 가능 모델에 `taxRates` 메서드를 구현하고 Stripe 세율 ID가 포함된 배열을 반환해야 합니다. 이 세율은 [Stripe 대시보드](https://dashboard.stripe.com/test/tax-rates)에서 정의할 수 있습니다:

```php
/**
 * 고객의 구독에 적용할 세율.
 *
 * @return array<int, string>
 */
public function taxRates(): array
{
    return ['txr_id'];
}
```

`taxRates` 메서드를 사용하면 여러 국가와 세율에 걸친 사용자 기반에 대해 고객별로 세율을 적용할 수 있습니다.

여러 상품이 포함된 구독을 제공하는 경우, 청구 가능 모델에 `priceTaxRates` 메서드를 구현하여 각 가격별로 다른 세율을 정의할 수 있습니다:

```php
/**
 * 고객의 구독에 적용할 세율.
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
> `taxRates` 메서드는 구독 청구에만 적용됩니다. Cashier를 사용하여 "단일 결제"를 할 경우, 해당 시점에 세율을 수동으로 지정해야 합니다.


#### 세율 동기화 {#syncing-tax-rates}

`taxRates` 메서드에서 반환하는 하드코딩된 세율 ID를 변경하면, 기존 사용자의 구독에 대한 세금 설정은 그대로 유지됩니다. 기존 구독의 세금 값을 새 `taxRates` 값으로 업데이트하려면, 사용자의 구독 인스턴스에서 `syncTaxRates` 메서드를 호출해야 합니다:

```php
$user->subscription('default')->syncTaxRates();
```

이 메서드는 여러 상품이 포함된 구독의 항목 세율도 동기화합니다. 여러 상품이 포함된 구독을 제공하는 경우, 청구 가능 모델이 위에서 설명한 `priceTaxRates` 메서드를 구현하고 있는지 확인하세요.


#### 세금 면제 {#tax-exemption}

Cashier는 고객이 세금 면제 대상인지 확인할 수 있는 `isNotTaxExempt`, `isTaxExempt`, `reverseChargeApplies` 메서드도 제공합니다. 이 메서드들은 Stripe API를 호출하여 고객의 세금 면제 상태를 확인합니다:

```php
use App\Models\User;

$user = User::find(1);

$user->isTaxExempt();
$user->isNotTaxExempt();
$user->reverseChargeApplies();
```

> [!WARNING]
> 이 메서드들은 모든 `Laravel\Cashier\Invoice` 객체에서도 사용할 수 있습니다. 하지만 `Invoice` 객체에서 호출할 경우, 인보이스가 생성된 시점의 면제 상태를 확인합니다.


### 구독 기준일 {#subscription-anchor-date}

기본적으로 청구 주기 기준일은 구독이 생성된 날짜이거나, 체험판이 사용되는 경우 체험판이 끝나는 날짜입니다. 청구 기준일을 수정하려면 `anchorBillingCycleOn` 메서드를 사용할 수 있습니다:

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

구독 청구 주기 관리에 대한 자세한 내용은 [Stripe 청구 주기 문서](https://stripe.com/docs/billing/subscriptions/billing-cycle)를 참고하세요.


### 구독 취소 {#cancelling-subscriptions}

구독을 취소하려면 사용자의 구독에서 `cancel` 메서드를 호출하세요:

```php
$user->subscription('default')->cancel();
```

구독이 취소되면, Cashier는 자동으로 `subscriptions` 데이터베이스 테이블의 `ends_at` 컬럼을 설정합니다. 이 컬럼은 `subscribed` 메서드가 언제부터 `false`를 반환해야 하는지 판단하는 데 사용됩니다.

예를 들어, 고객이 3월 1일에 구독을 취소했지만 구독이 3월 5일까지 만료되지 않는 경우, `subscribed` 메서드는 3월 5일까지 계속 `true`를 반환합니다. 이는 사용자가 일반적으로 청구 주기 종료일까지 애플리케이션을 계속 사용할 수 있도록 허용하기 때문입니다.

사용자가 구독을 취소했지만 아직 "유예 기간"에 있는지 확인하려면 `onGracePeriod` 메서드를 사용할 수 있습니다:

```php
if ($user->subscription('default')->onGracePeriod()) {
    // ...
}
```

구독을 즉시 취소하려면 사용자의 구독에서 `cancelNow` 메서드를 호출하세요:

```php
$user->subscription('default')->cancelNow();
```

구독을 즉시 취소하고, 남은 미청구 사용량 또는 새/보류 중인 비례 배분 인보이스 항목에 대해 인보이스를 발행하려면 `cancelNowAndInvoice` 메서드를 호출하세요:

```php
$user->subscription('default')->cancelNowAndInvoice();
```

특정 시점에 구독을 취소하도록 선택할 수도 있습니다:

```php
$user->subscription('default')->cancelAt(
    now()->addDays(10)
);
```

마지막으로, 관련 사용자 모델을 삭제하기 전에 항상 사용자 구독을 취소해야 합니다:

```php
$user->subscription('default')->cancelNow();

$user->delete();
```


### 구독 재개 {#resuming-subscriptions}

고객이 구독을 취소했지만 다시 재개하고 싶다면, 구독에서 `resume` 메서드를 호출할 수 있습니다. 고객은 여전히 "유예 기간" 내에 있어야 구독을 재개할 수 있습니다:

```php
$user->subscription('default')->resume();
```

고객이 구독을 취소한 후, 구독이 완전히 만료되기 전에 다시 재개하면 즉시 청구되지 않습니다. 대신, 구독이 다시 활성화되고 원래 청구 주기에 따라 청구됩니다.


## 구독 체험판 {#subscription-trials}


### 결제 수단을 미리 받는 경우 {#with-payment-method-up-front}

고객에게 체험판 기간을 제공하면서도 미리 결제 수단 정보를 수집하려면, 구독 생성 시 `trialDays` 메서드를 사용하세요:

```php
use Illuminate\Http\Request;

Route::post('/user/subscribe', function (Request $request) {
    $request->user()->newSubscription('default', 'price_monthly')
        ->trialDays(10)
        ->create($request->paymentMethodId);

    // ...
});
```

이 메서드는 데이터베이스의 구독 레코드에 체험판 종료 날짜를 설정하고, Stripe에 이 날짜 이후에 고객에게 청구를 시작하도록 지시합니다. `trialDays` 메서드를 사용할 때는 Stripe에서 가격에 기본 체험판 기간이 설정되어 있어도 Cashier가 이를 덮어씁니다.

> [!WARNING]
> 고객의 구독이 체험판 종료일 전에 취소되지 않으면, 체험판이 만료되는 즉시 청구되므로 사용자에게 체험판 종료일을 반드시 알리세요.

`trialUntil` 메서드를 사용하면 체험판 종료 시점을 지정하는 `DateTime` 인스턴스를 제공할 수 있습니다:

```php
use Carbon\Carbon;

$user->newSubscription('default', 'price_monthly')
    ->trialUntil(Carbon::now()->addDays(10))
    ->create($paymentMethod);
```

사용자가 체험판 기간 내에 있는지 확인하려면 사용자 인스턴스의 `onTrial` 메서드나 구독 인스턴스의 `onTrial` 메서드를 사용할 수 있습니다. 아래 두 예시는 동일합니다:

```php
if ($user->onTrial('default')) {
    // ...
}

if ($user->subscription('default')->onTrial()) {
    // ...
}
```

`endTrial` 메서드를 사용하여 구독 체험판을 즉시 종료할 수 있습니다:

```php
$user->subscription('default')->endTrial();
```

기존 체험판이 만료되었는지 확인하려면 `hasExpiredTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->hasExpiredTrial('default')) {
    // ...
}

if ($user->subscription('default')->hasExpiredTrial()) {
    // ...
}
```


#### Stripe / Cashier에서 체험판 일수 정의 {#defining-trial-days-in-stripe-cashier}

가격의 체험판 일수를 Stripe 대시보드에서 정의하거나, 항상 Cashier를 통해 명시적으로 전달할 수 있습니다. Stripe에서 가격의 체험판 일수를 정의하면, 새 구독(과거에 구독한 적이 있는 고객의 새 구독 포함)은 항상 체험판 기간을 받게 되며, `skipTrial()` 메서드를 명시적으로 호출하지 않는 한 체험판이 적용됩니다.


### 결제 수단을 미리 받지 않는 경우 {#without-payment-method-up-front}

결제 수단 정보를 미리 받지 않고 체험판 기간을 제공하려면, 사용자 레코드의 `trial_ends_at` 컬럼을 원하는 체험판 종료 날짜로 설정하면 됩니다. 일반적으로 회원가입 시에 설정합니다:

```php
use App\Models\User;

$user = User::create([
    // ...
    'trial_ends_at' => now()->addDays(10),
]);
```

> [!WARNING]
> 청구 가능 모델 클래스 정의에서 `trial_ends_at` 속성에 대해 [date cast](/laravel/12.x/eloquent-mutators#date-casting)를 추가해야 합니다.

Cashier는 이 유형의 체험판을 "일반 체험판"이라고 부릅니다. 이는 기존 구독에 연결되지 않은 체험판입니다. 청구 가능 모델 인스턴스의 `onTrial` 메서드는 현재 날짜가 `trial_ends_at` 값보다 이전이면 `true`를 반환합니다:

```php
if ($user->onTrial()) {
    // 사용자가 체험판 기간 내에 있습니다...
}
```

사용자에게 실제 구독을 생성할 준비가 되면, 평소처럼 `newSubscription` 메서드를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->newSubscription('default', 'price_monthly')->create($paymentMethod);
```

사용자의 체험판 종료 날짜를 조회하려면 `trialEndsAt` 메서드를 사용할 수 있습니다. 이 메서드는 사용자가 체험판 중이면 Carbon 날짜 인스턴스를, 아니면 `null`을 반환합니다. 기본 구독이 아닌 특정 구독의 체험판 종료 날짜를 조회하려면 선택적으로 구독 타입 파라미터를 전달할 수 있습니다:

```php
if ($user->onTrial()) {
    $trialEndsAt = $user->trialEndsAt('main');
}
```

"일반" 체험판 기간 내에 있고 아직 실제 구독을 생성하지 않았는지 확인하려면 `onGenericTrial` 메서드를 사용할 수 있습니다:

```php
if ($user->onGenericTrial()) {
    // 사용자가 "일반" 체험판 기간 내에 있습니다...
}
```


### 체험판 연장 {#extending-trials}

`extendTrial` 메서드를 사용하면 구독이 생성된 후에도 체험판 기간을 연장할 수 있습니다. 체험판이 이미 만료되어 고객이 구독에 대해 청구되고 있더라도, 추가 체험판을 제공할 수 있습니다. 체험판 기간 동안의 시간은 고객의 다음 인보이스에서 차감됩니다:

```php
use App\Models\User;

$subscription = User::find(1)->subscription('default');

// 7일 후에 체험판 종료...
$subscription->extendTrial(
    now()->addDays(7)
);

// 체험판에 5일 추가...
$subscription->extendTrial(
    $subscription->trial_ends_at->addDays(5)
);
```


## Stripe Webhook 처리 {#handling-stripe-webhooks}

> [!NOTE]
> [Stripe CLI](https://stripe.com/docs/stripe-cli)를 사용하여 로컬 개발 중에 webhook을 테스트할 수 있습니다.

Stripe는 webhook을 통해 다양한 이벤트를 애플리케이션에 알릴 수 있습니다. 기본적으로, Cashier 서비스 프로바이더는 Cashier의 webhook 컨트롤러로 연결되는 라우트를 자동으로 등록합니다. 이 컨트롤러는 모든 들어오는 webhook 요청을 처리합니다.

기본적으로 Cashier webhook 컨트롤러는 너무 많은 결제 실패(Stripe 설정에 따라 정의됨)로 인한 구독 취소, 고객 업데이트, 고객 삭제, 구독 업데이트, 결제 수단 변경 등 모든 들어오는 webhook 요청을 자동으로 처리합니다. 하지만, 곧 살펴보겠지만, 이 컨트롤러를 확장하여 원하는 Stripe webhook 이벤트를 처리할 수 있습니다.

애플리케이션이 Stripe webhook을 처리할 수 있도록, Stripe 관리 패널에서 webhook URL을 반드시 설정하세요. 기본적으로 Cashier의 webhook 컨트롤러는 `/stripe/webhook` URL 경로에 응답합니다. Stripe 관리 패널에서 활성화해야 할 모든 webhook 목록은 다음과 같습니다:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.updated`
- `customer.deleted`
- `payment_method.automatically_updated`
- `invoice.payment_action_required`
- `invoice.payment_succeeded`

편의를 위해 Cashier에는 `cashier:webhook` Artisan 명령어가 포함되어 있습니다. 이 명령어는 Cashier에 필요한 모든 이벤트를 수신하는 webhook을 Stripe에 생성합니다:

```shell
php artisan cashier:webhook
```

기본적으로 생성된 webhook은 `APP_URL` 환경 변수와 Cashier에 포함된 `cashier.webhook` 라우트에 지정된 URL을 사용합니다. 다른 URL을 사용하려면 명령어 실행 시 `--url` 옵션을 제공할 수 있습니다:

```shell
php artisan cashier:webhook --url "https://example.com/stripe/webhook"
```

생성된 webhook은 Cashier 버전과 호환되는 Stripe API 버전을 사용합니다. 다른 Stripe 버전을 사용하려면 `--api-version` 옵션을 제공할 수 있습니다:

```shell
php artisan cashier:webhook --api-version="2019-12-03"
```

생성 후 webhook은 즉시 활성화됩니다. 준비가 될 때까지 webhook을 비활성화 상태로 생성하려면 `--disabled` 옵션을 제공할 수 있습니다:

```shell
php artisan cashier:webhook --disabled
```

> [!WARNING]
> Cashier에 포함된 [webhook 서명 검증](#verifying-webhook-signatures) 미들웨어로 들어오는 Stripe webhook 요청을 반드시 보호하세요.


#### Webhook과 CSRF 보호 {#webhooks-csrf-protection}

Stripe webhook은 Laravel의 [CSRF 보호](/laravel/12.x/csrf)를 우회해야 하므로, Stripe webhook에 대해 Laravel이 CSRF 토큰을 검증하지 않도록 해야 합니다. 이를 위해 애플리케이션의 `bootstrap/app.php` 파일에서 `stripe/*`을 CSRF 보호에서 제외하세요:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
    ]);
})
```


### Webhook 이벤트 핸들러 정의 {#defining-webhook-event-handlers}

Cashier는 결제 실패로 인한 구독 취소 및 기타 일반적인 Stripe webhook 이벤트를 자동으로 처리합니다. 하지만 추가로 처리하고 싶은 webhook 이벤트가 있다면, Cashier에서 디스패치하는 다음 이벤트를 리스닝하여 처리할 수 있습니다:

- `Laravel\Cashier\Events\WebhookReceived`
- `Laravel\Cashier\Events\WebhookHandled`

두 이벤트 모두 Stripe webhook의 전체 페이로드를 포함합니다. 예를 들어, `invoice.payment_succeeded` webhook을 처리하려면 [리스너](/laravel/12.x/events#defining-listeners)를 등록할 수 있습니다:

```php
<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Stripe webhook 수신 처리.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['type'] === 'invoice.payment_succeeded') {
            // 들어오는 이벤트 처리...
        }
    }
}
```


### Webhook 서명 검증 {#verifying-webhook-signatures}

webhook을 안전하게 보호하려면 [Stripe의 webhook 서명](https://stripe.com/docs/webhooks/signatures)을 사용할 수 있습니다. 편의를 위해 Cashier는 들어오는 Stripe webhook 요청이 유효한지 검증하는 미들웨어를 자동으로 포함합니다.

webhook 검증을 활성화하려면, 애플리케이션의 `.env` 파일에 `STRIPE_WEBHOOK_SECRET` 환경 변수가 설정되어 있는지 확인하세요. webhook `secret`은 Stripe 계정 대시보드에서 확인할 수 있습니다.


## 단일 결제 {#single-charges}


### 간단 결제 {#simple-charge}

고객에게 일회성 결제를 하려면, 청구 가능 모델 인스턴스의 `charge` 메서드를 사용할 수 있습니다. [결제 수단 식별자](#payment-methods-for-single-charges)를 두 번째 인수로 제공해야 합니다:

```php
use Illuminate\Http\Request;

Route::post('/purchase', function (Request $request) {
    $stripeCharge = $request->user()->charge(
        100, $request->paymentMethodId
    );

    // ...
});
```

`charge` 메서드는 세 번째 인수로 배열을 받아, Stripe 결제 생성에 원하는 옵션을 전달할 수 있습니다. 결제 생성 시 사용할 수 있는 옵션에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/api/charges/create)를 참고하세요:

```php
$user->charge(100, $paymentMethod, [
    'custom_option' => $value,
]);
```

기본적으로 고객이나 사용자가 없어도 `charge` 메서드를 사용할 수 있습니다. 이를 위해 애플리케이션의 청구 가능 모델의 새 인스턴스에서 `charge` 메서드를 호출하세요:

```php
use App\Models\User;

$stripeCharge = (new User)->charge(100, $paymentMethod);
```

`charge` 메서드는 결제에 실패하면 예외를 발생시킵니다. 결제가 성공하면 `Laravel\Cashier\Payment` 인스턴스가 반환됩니다:

```php
try {
    $payment = $user->charge(100, $paymentMethod);
} catch (Exception $e) {
    // ...
}
```

> [!WARNING]
> `charge` 메서드는 애플리케이션에서 사용하는 통화의 최소 단위(예: 미국 달러의 경우 센트)로 결제 금액을 받습니다.


### 인보이스 결제 {#charge-with-invoice}

가끔 일회성 결제를 하면서 고객에게 PDF 인보이스를 제공해야 할 수 있습니다. `invoicePrice` 메서드를 사용하면 이를 쉽게 할 수 있습니다. 예를 들어, 고객에게 새 셔츠 5벌에 대해 인보이스를 발행해봅시다:

```php
$user->invoicePrice('price_tshirt', 5);
```

인보이스는 사용자의 기본 결제 수단으로 즉시 청구됩니다. `invoicePrice` 메서드는 세 번째 인수로 배열을 받을 수 있습니다. 이 배열은 인보이스 항목의 청구 옵션을 포함합니다. 네 번째 인수로도 배열을 받을 수 있으며, 이 배열은 인보이스 자체의 청구 옵션을 포함해야 합니다:

```php
$user->invoicePrice('price_tshirt', 5, [
    'discounts' => [
        ['coupon' => 'SUMMER21SALE']
    ],
], [
    'default_tax_rates' => ['txr_id'],
]);
```

`invoicePrice`와 유사하게, `tabPrice` 메서드를 사용하여 한 번에 여러 항목(인보이스당 최대 250개)에 대해 일회성 결제를 생성할 수 있습니다. 예를 들어, 고객에게 셔츠 5벌과 머그컵 2개에 대해 인보이스를 발행할 수 있습니다:

```php
$user->tabPrice('price_tshirt', 5);
$user->tabPrice('price_mug', 2);
$user->invoice();
```

또는, `invoiceFor` 메서드를 사용하여 고객의 기본 결제 수단에 대해 "일회성" 결제를 할 수 있습니다:

```php
$user->invoiceFor('One Time Fee', 500);
```

`invoiceFor` 메서드도 사용할 수 있지만, 미리 정의된 가격과 함께 `invoicePrice` 및 `tabPrice` 메서드를 사용하는 것이 권장됩니다. 이렇게 하면 Stripe 대시보드에서 상품별 판매에 대한 더 나은 분석 및 데이터를 확인할 수 있습니다.

> [!WARNING]
> `invoice`, `invoicePrice`, `invoiceFor` 메서드는 결제 실패 시 재시도하는 Stripe 인보이스를 생성합니다. 결제 실패 시 인보이스가 재시도되지 않도록 하려면, 첫 번째 결제 실패 후 Stripe API를 사용하여 인보이스를 닫아야 합니다.


### 결제 인텐트 생성 {#creating-payment-intents}

청구 가능 모델 인스턴스의 `pay` 메서드를 호출하여 새 Stripe 결제 인텐트를 생성할 수 있습니다. 이 메서드를 호출하면 `Laravel\Cashier\Payment` 인스턴스로 감싸진 결제 인텐트가 생성됩니다:

```php
use Illuminate\Http\Request;

Route::post('/pay', function (Request $request) {
    $payment = $request->user()->pay(
        $request->get('amount')
    );

    return $payment->client_secret;
});
```

결제 인텐트를 생성한 후, 클라이언트 시크릿을 애플리케이션 프론트엔드로 반환하여 사용자가 브라우저에서 결제를 완료할 수 있습니다. Stripe 결제 인텐트를 사용하여 전체 결제 플로우를 구축하는 방법에 대한 자세한 내용은 [Stripe 문서](https://stripe.com/docs/payments/accept-a-payment?platform=web)를 참고하세요.

`pay` 메서드를 사용할 때는 Stripe 대시보드에서 활성화된 기본 결제 수단이 고객에게 제공됩니다. 특정 결제 수단만 허용하려면 `payWith` 메서드를 사용할 수 있습니다:

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
> `pay` 및 `payWith` 메서드는 애플리케이션에서 사용하는 통화의 최소 단위(예: 미국 달러의 경우 센트)로 결제 금액을 받습니다.


### 결제 환불 {#refunding-charges}

Stripe 결제를 환불해야 하는 경우, `refund` 메서드를 사용할 수 있습니다. 이 메서드는 Stripe [결제 인텐트 ID](#payment-methods-for-single-charges)를 첫 번째 인수로 받습니다:

```php
$payment = $user->charge(100, $paymentMethodId);

$user->refund($payment->id);
```


## 인보이스 {#invoices}


### 인보이스 조회 {#retrieving-invoices}

청구 가능 모델의 `invoices` 메서드를 사용하여 인보이스 배열을 쉽게 조회할 수 있습니다. `invoices` 메서드는 `Laravel\Cashier\Invoice` 인스턴스의 컬렉션을 반환합니다:

```php
$invoices = $user->invoices();
```

결과에 보류 중인 인보이스도 포함하려면 `invoicesIncludingPending` 메서드를 사용할 수 있습니다:

```php
$invoices = $user->invoicesIncludingPending();
```

`findInvoice` 메서드를 사용하여 ID로 특정 인보이스를 조회할 수 있습니다:

```php
$invoice = $user->findInvoice($invoiceId);
```


#### 인보이스 정보 표시 {#displaying-invoice-information}

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


### 예정된 인보이스 {#upcoming-invoices}

고객의 예정된 인보이스를 조회하려면 `upcomingInvoice` 메서드를 사용할 수 있습니다:

```php
$invoice = $user->upcomingInvoice();
```

고객이 여러 구독을 가지고 있다면, 특정 구독의 예정된 인보이스도 조회할 수 있습니다:

```php
$invoice = $user->subscription('default')->upcomingInvoice();
```


### 구독 인보이스 미리보기 {#previewing-subscription-invoices}

`previewInvoice` 메서드를 사용하여 가격 변경 전에 인보이스를 미리 볼 수 있습니다. 이를 통해 특정 가격 변경 시 고객의 인보이스가 어떻게 보일지 확인할 수 있습니다:

```php
$invoice = $user->subscription('default')->previewInvoice('price_yearly');
```

여러 새 가격으로 인보이스를 미리 보려면 가격 배열을 `previewInvoice` 메서드에 전달할 수 있습니다:

```php
$invoice = $user->subscription('default')->previewInvoice(['price_yearly', 'price_metered']);
```


### 인보이스 PDF 생성 {#generating-invoice-pdfs}

인보이스 PDF를 생성하기 전에, Cashier의 기본 인보이스 렌더러인 Dompdf 라이브러리를 Composer로 설치해야 합니다:

```shell
composer require dompdf/dompdf
```

라우트나 컨트롤러 내에서 `downloadInvoice` 메서드를 사용하여 주어진 인보이스의 PDF 다운로드를 생성할 수 있습니다. 이 메서드는 인보이스 다운로드에 필요한 올바른 HTTP 응답을 자동으로 생성합니다:

```php
use Illuminate\Http\Request;

Route::get('/user/invoice/{invoice}', function (Request $request, string $invoiceId) {
    return $request->user()->downloadInvoice($invoiceId);
});
```

기본적으로 인보이스의 모든 데이터는 Stripe에 저장된 고객 및 인보이스 데이터에서 파생됩니다. 파일명은 `app.name` 설정 값을 기반으로 합니다. 하지만, `downloadInvoice` 메서드의 두 번째 인수로 배열을 제공하여 회사 및 상품 정보 등 일부 데이터를 커스터마이즈할 수 있습니다:

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

`downloadInvoice` 메서드는 세 번째 인수로 커스텀 파일명도 허용합니다. 이 파일명은 자동으로 `.pdf`가 붙습니다:

```php
return $request->user()->downloadInvoice($invoiceId, [], 'my-invoice');
```


#### 커스텀 인보이스 렌더러 {#custom-invoice-render}

Cashier는 커스텀 인보이스 렌더러도 사용할 수 있습니다. 기본적으로 Cashier는 [dompdf](https://github.com/dompdf/dompdf) PHP 라이브러리를 사용하는 `DompdfInvoiceRenderer` 구현을 사용합니다. 하지만, 원하는 렌더러를 직접 구현하여 사용할 수 있습니다. 이를 위해 `Laravel\Cashier\Contracts\InvoiceRenderer` 인터페이스를 구현하면 됩니다. 예를 들어, API 호출을 통해 서드파티 PDF 렌더링 서비스로 인보이스 PDF를 렌더링할 수 있습니다:

```php
use Illuminate\Support\Facades\Http;
use Laravel\Cashier\Contracts\InvoiceRenderer;
use Laravel\Cashier\Invoice;

class ApiInvoiceRenderer implements InvoiceRenderer
{
    /**
     * 주어진 인보이스를 렌더링하고 원시 PDF 바이트를 반환합니다.
     */
    public function render(Invoice $invoice, array $data = [], array $options = []): string
    {
        $html = $invoice->view($data)->render();

        return Http::get('https://example.com/html-to-pdf', ['html' => $html])->get()->body();
    }
}
```

인보이스 렌더러 계약을 구현한 후, 애플리케이션의 `config/cashier.php` 설정 파일에서 `cashier.invoices.renderer` 설정 값을 커스텀 렌더러 구현 클래스명으로 변경해야 합니다.


## Checkout {#checkout}

Cashier Stripe는 [Stripe Checkout](https://stripe.com/payments/checkout)도 지원합니다. Stripe Checkout은 사전 구축된 호스팅 결제 페이지를 제공하여, 결제 페이지를 직접 구현하는 번거로움을 덜어줍니다.

아래 문서는 Cashier와 Stripe Checkout을 함께 사용하는 방법에 대한 정보를 담고 있습니다. Stripe Checkout에 대해 더 자세히 알고 싶다면 [Stripe의 Checkout 문서](https://stripe.com/docs/payments/checkout)도 참고하세요.


### 상품 Checkout {#product-checkouts}

Stripe 대시보드에서 생성된 기존 상품에 대해 `checkout` 메서드를 사용하여 Checkout을 수행할 수 있습니다. `checkout` 메서드는 새 Stripe Checkout 세션을 시작합니다. 기본적으로 Stripe 가격 ID를 전달해야 합니다:

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

고객이 이 라우트를 방문하면 Stripe의 Checkout 페이지로 리디렉션됩니다. 기본적으로 사용자가 구매를 성공적으로 완료하거나 취소하면 `home` 라우트로 리디렉션되지만, `success_url` 및 `cancel_url` 옵션을 사용하여 콜백 URL을 지정할 수 있습니다:

```php
use Illuminate\Http\Request;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()->checkout(['price_tshirt' => 1], [
        'success_url' => route('your-success-route'),
        'cancel_url' => route('your-cancel-route'),
    ]);
});
```

`success_url` Checkout 옵션을 정의할 때, URL의 쿼리 문자열에 Checkout 세션 ID를 추가하도록 Stripe에 지시할 수 있습니다. 이를 위해 `success_url` 쿼리 문자열에 `{CHECKOUT_SESSION_ID}`라는 리터럴 문자열을 추가하세요. Stripe는 이 플레이스홀더를 실제 Checkout 세션 ID로 대체합니다:

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

기본적으로 Stripe Checkout은 [사용자 교환 가능 프로모션 코드](https://stripe.com/docs/billing/subscriptions/discounts/codes)를 허용하지 않습니다. 다행히 Checkout 페이지에서 이를 활성화하는 쉬운 방법이 있습니다. `allowPromotionCodes` 메서드를 호출하면 됩니다:

```php
use Illuminate\Http\Request;

Route::get('/product-checkout', function (Request $request) {
    return $request->user()
        ->allowPromotionCodes()
        ->checkout('price_tshirt');
});
```


### 단일 결제 Checkout {#single-charge-checkouts}

Stripe 대시보드에 생성되지 않은 임시 상품에 대해 간단한 결제를 수행할 수도 있습니다. 이를 위해 청구 가능 모델의 `checkoutCharge` 메서드를 사용하고, 결제 금액, 상품명, 선택적 수량을 전달하세요. 고객이 이 라우트를 방문하면 Stripe의 Checkout 페이지로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/charge-checkout', function (Request $request) {
    return $request->user()->checkoutCharge(1200, 'T-Shirt', 5);
});
```

> [!WARNING]
> `checkoutCharge` 메서드를 사용할 때는 Stripe 대시보드에 항상 새 상품과 가격이 생성됩니다. 따라서, 미리 상품을 Stripe 대시보드에 생성하고 `checkout` 메서드를 사용하는 것이 좋습니다.


### 구독 Checkout {#subscription-checkouts}

> [!WARNING]
> 구독을 위한 Stripe Checkout을 사용하려면 Stripe 대시보드에서 `customer.subscription.created` webhook을 활성화해야 합니다. 이 webhook은 데이터베이스에 구독 레코드를 생성하고 모든 관련 구독 항목을 저장합니다.

Stripe Checkout을 사용하여 구독을 시작할 수도 있습니다. Cashier의 구독 빌더 메서드로 구독을 정의한 후, `checkout` 메서드를 호출할 수 있습니다. 고객이 이 라우트를 방문하면 Stripe의 Checkout 페이지로 리디렉션됩니다:

```php
use Illuminate\Http\Request;

Route::get('/subscription-checkout', function (Request $request) {
    return $request->user()
        ->newSubscription('default', 'price_monthly')
        ->checkout();
});
```

상품 Checkout과 마찬가지로, 성공 및 취소 URL을 커스터마이즈할 수 있습니다:

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

물론, 구독 Checkout에서도 프로모션 코드를 활성화할 수 있습니다:

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
> Stripe Checkout을 사용하여 구독을 시작할 때는 모든 구독 청구 옵션이 지원되지 않습니다. 구독 빌더에서 `anchorBillingCycleOn` 메서드를 사용하거나, 비례 배분 동작 또는 결제 동작을 설정해도 Stripe Checkout 세션에서는 효과가 없습니다. 사용 가능한 파라미터는 [Stripe Checkout Session API 문서](https://stripe.com/docs/api/checkout/sessions/create)를 참고하세요.


#### Stripe Checkout과 체험판 기간 {#stripe-checkout-trial-periods}

물론, Stripe Checkout을 통해 완료될 구독을 빌드할 때 체험판 기간을 정의할 수 있습니다:

```php
$checkout = Auth::user()->newSubscription('default', 'price_monthly')
    ->trialDays(3)
    ->checkout();
```

단, 체험판 기간은 Stripe Checkout에서 지원하는 최소 체험 기간인 48시간 이상이어야 합니다.


#### 구독과 Webhook {#stripe-checkout-subscriptions-and-webhooks}

Stripe와 Cashier는 webhook을 통해 구독 상태를 업데이트하므로, 고객이 결제 정보를 입력한 후 애플리케이션으로 돌아왔을 때 구독이 아직 활성화되지 않았을 수 있습니다. 이 경우, 결제 또는 구독이 보류 중임을 사용자에게 알리는 메시지를 표시하는 것이 좋습니다.


### 세금 ID 수집 {#collecting-tax-ids}

Checkout은 고객의 세금 ID 수집도 지원합니다. Checkout 세션에서 이를 활성화하려면 세션 생성 시 `collectTaxIds` 메서드를 호출하세요:

```php
$checkout = $user->collectTaxIds()->checkout('price_tshirt');
```

이 메서드를 호출하면, 고객이 회사로 구매하는지 여부를 표시할 수 있는 새로운 체크박스가 제공됩니다. 회사로 구매하는 경우, 세금 ID 번호를 입력할 수 있습니다.

> [!WARNING]
> 애플리케이션 서비스 프로바이더에서 [자동 세금 징수](#tax-configuration)를 이미 설정했다면, 이 기능은 자동으로 활성화되므로 `collectTaxIds` 메서드를 호출할 필요가 없습니다.


### 비회원 Checkout {#guest-checkouts}

`Checkout::guest` 메서드를 사용하여 "계정"이 없는 애플리케이션의 비회원에 대해 Checkout 세션을 시작할 수 있습니다:

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

기존 사용자에 대한 Checkout 세션을 생성할 때와 마찬가지로, `Laravel\Cashier\CheckoutBuilder` 인스턴스에서 제공하는 추가 메서드를 활용하여 비회원 Checkout 세션을 커스터마이즈할 수 있습니다:

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

비회원 Checkout이 완료되면, Stripe는 `checkout.session.completed` webhook 이벤트를 전송할 수 있으므로, [Stripe webhook을 구성](https://dashboard.stripe.com/webhooks)하여 이 이벤트가 애플리케이션에 전송되도록 해야 합니다. Stripe 대시보드에서 webhook을 활성화한 후, [Cashier로 webhook을 처리](#handling-stripe-webhooks)할 수 있습니다. webhook 페이로드에 포함된 객체는 [checkout 객체](https://stripe.com/docs/api/checkout/sessions/object)이며, 이를 검사하여 고객의 주문을 이행할 수 있습니다.


## 결제 실패 처리 {#handling-failed-payments}

가끔 구독 또는 단일 결제에 대한 결제가 실패할 수 있습니다. 이 경우, Cashier는 결제 실패를 알리는 `Laravel\Cashier\Exceptions\IncompletePayment` 예외를 발생시킵니다. 이 예외를 잡은 후에는 두 가지 방법 중 하나로 처리할 수 있습니다.

첫째, Cashier에 포함된 전용 결제 확인 페이지로 고객을 리디렉션할 수 있습니다. 이 페이지는 Cashier 서비스 프로바이더에서 이미 등록된 이름 있는 라우트가 있습니다. 따라서, `IncompletePayment` 예외를 잡고 결제 확인 페이지로 사용자를 리디렉션할 수 있습니다:

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

결제 확인 페이지에서는 고객이 신용카드 정보를 다시 입력하고, Stripe에서 요구하는 추가 작업(예: "3D Secure" 확인)을 수행해야 합니다. 결제 확인 후, 사용자는 위에서 지정한 `redirect` 파라미터의 URL로 리디렉션됩니다. 리디렉션 시 `message`(문자열) 및 `success`(정수) 쿼리 문자열 변수가 URL에 추가됩니다. 결제 페이지는 현재 다음 결제 수단 타입을 지원합니다:

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

또는, Stripe가 결제 확인을 처리하도록 할 수도 있습니다. 이 경우, 결제 확인 페이지로 리디렉션하는 대신 Stripe 대시보드에서 [Stripe의 자동 청구 이메일](https://dashboard.stripe.com/account/billing/automatic)을 설정할 수 있습니다. 하지만, `IncompletePayment` 예외가 발생하면 사용자가 추가 결제 확인 안내 이메일을 받게 될 것임을 반드시 알려야 합니다.

결제 예외는 `Billable` 트레이트를 사용하는 모델의 `charge`, `invoiceFor`, `invoice` 메서드에서 발생할 수 있습니다. 구독과 상호작용할 때는 `SubscriptionBuilder`의 `create` 메서드, `Subscription` 및 `SubscriptionItem` 모델의 `incrementAndInvoice`, `swapAndInvoice` 메서드에서 미완료 결제 예외가 발생할 수 있습니다.

기존 구독에 미완료 결제가 있는지 확인하려면 청구 가능 모델 또는 구독 인스턴스에서 `hasIncompletePayment` 메서드를 사용할 수 있습니다:

```php
if ($user->hasIncompletePayment('default')) {
    // ...
}

if ($user->subscription('default')->hasIncompletePayment()) {
    // ...
}
```

예외 인스턴스의 `payment` 속성을 검사하여 미완료 결제의 구체적인 상태를 파악할 수 있습니다:

```php
use Laravel\Cashier\Exceptions\IncompletePayment;

try {
    $user->charge(1000, 'pm_card_threeDSecure2Required');
} catch (IncompletePayment $exception) {
    // 결제 인텐트 상태 확인...
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

일부 결제 수단은 결제 확인 시 추가 데이터가 필요합니다. 예를 들어, SEPA 결제 수단은 결제 과정에서 추가 "mandate" 데이터가 필요합니다. `withPaymentConfirmationOptions` 메서드를 사용하여 이 데이터를 Cashier에 제공할 수 있습니다:

```php
$subscription->withPaymentConfirmationOptions([
    'mandate_data' => '...',
])->swap('price_xxx');
```

결제 확인 시 허용되는 모든 옵션은 [Stripe API 문서](https://stripe.com/docs/api/payment_intents/confirm)를 참고하세요.


## 강력한 고객 인증(SCA) {#strong-customer-authentication}

비즈니스 또는 고객이 유럽에 기반을 두고 있다면, EU의 강력한 고객 인증(SCA) 규정을 준수해야 합니다. 이 규정은 2019년 9월 유럽연합에서 결제 사기를 방지하기 위해 도입되었습니다. Stripe와 Cashier는 SCA 준수 애플리케이션 구축을 지원합니다.

> [!WARNING]
> 시작하기 전에 [Stripe의 PSD2 및 SCA 가이드](https://stripe.com/guides/strong-customer-authentication)와 [새 SCA API 문서](https://stripe.com/docs/strong-customer-authentication)를 반드시 검토하세요.


### 추가 확인이 필요한 결제 {#payments-requiring-additional-confirmation}

SCA 규정은 결제 확인 및 처리를 위해 추가 인증을 요구하는 경우가 많습니다. 이 경우, Cashier는 추가 인증이 필요함을 알리는 `Laravel\Cashier\Exceptions\IncompletePayment` 예외를 발생시킵니다. 이 예외를 처리하는 방법에 대한 자세한 내용은 [결제 실패 처리 문서](#handling-failed-payments)를 참고하세요.

Stripe 또는 Cashier에서 제공하는 결제 확인 화면은 특정 은행 또는 카드 발급사의 결제 플로우에 맞게 맞춤화될 수 있으며, 추가 카드 확인, 임시 소액 결제, 별도 기기 인증 또는 기타 인증 방식이 포함될 수 있습니다.


#### 미완료 및 연체 상태 {#incomplete-and-past-due-state}

결제에 추가 확인이 필요한 경우, 구독은 `stripe_status` 데이터베이스 컬럼에 표시된 대로 `incomplete` 또는 `past_due` 상태로 유지됩니다. 결제 확인이 완료되고 Stripe에서 webhook을 통해 애플리케이션에 완료 사실을 알리면, Cashier는 고객의 구독을 자동으로 활성화합니다.

`incomplete` 및 `past_due` 상태에 대한 자세한 내용은 [추가 문서](#incomplete-and-past-due-status)를 참고하세요.


### 오프 세션 결제 알림 {#off-session-payment-notifications}

SCA 규정으로 인해, 구독이 활성 상태일 때도 고객이 결제 정보를 가끔 확인해야 할 수 있습니다. Cashier는 오프 세션 결제 확인이 필요할 때 고객에게 알림을 보낼 수 있습니다. 예를 들어, 구독이 갱신될 때 이런 일이 발생할 수 있습니다. Cashier의 결제 알림은 `CASHIER_PAYMENT_NOTIFICATION` 환경 변수를 알림 클래스명으로 설정하여 활성화할 수 있습니다. 기본적으로 이 알림은 비활성화되어 있습니다. 물론, Cashier에는 이 목적을 위한 알림 클래스가 포함되어 있지만, 원하는 경우 직접 알림 클래스를 제공할 수도 있습니다:

```ini
CASHIER_PAYMENT_NOTIFICATION=Laravel\Cashier\Notifications\ConfirmPayment
```

오프 세션 결제 확인 알림이 전달되도록 하려면, 애플리케이션에 [Stripe webhook이 구성](#handling-stripe-webhooks)되어 있고 Stripe 대시보드에서 `invoice.payment_action_required` webhook이 활성화되어 있는지 확인하세요. 또한, `Billable` 모델은 Laravel의 `Illuminate\Notifications\Notifiable` 트레이트도 사용해야 합니다.

> [!WARNING]
> 고객이 수동으로 결제 확인이 필요한 결제를 할 때도 알림이 전송됩니다. Stripe는 결제가 수동으로 이루어졌는지, "오프 세션"인지 알 수 없기 때문입니다. 하지만, 고객이 결제 페이지를 방문하면 이미 결제를 확인한 경우 "결제 성공" 메시지만 표시됩니다. 고객이 동일한 결제를 두 번 확인하여 실수로 이중 결제가 발생하는 일은 없습니다.


## Stripe SDK {#stripe-sdk}

Cashier의 많은 객체는 Stripe SDK 객체를 감싸는 래퍼입니다. Stripe 객체와 직접 상호작용하고 싶다면, `asStripe` 메서드를 사용하여 쉽게 조회할 수 있습니다:

```php
$stripeSubscription = $subscription->asStripeSubscription();

$stripeSubscription->application_fee_percent = 5;

$stripeSubscription->save();
```

Stripe 구독을 직접 업데이트하려면 `updateStripeSubscription` 메서드를 사용할 수 있습니다:

```php
$subscription->updateStripeSubscription(['application_fee_percent' => 5]);
```

`Cashier` 클래스의 `stripe` 메서드를 호출하면 `Stripe\StripeClient` 클라이언트를 직접 사용할 수 있습니다. 예를 들어, 이 메서드를 사용하여 Stripe 계정에서 가격 목록을 조회할 수 있습니다:

```php
use Laravel\Cashier\Cashier;

$prices = Cashier::stripe()->prices->all();
```


## 테스트 {#testing}

Cashier를 사용하는 애플리케이션을 테스트할 때, 실제 Stripe API에 대한 HTTP 요청을 모킹할 수 있습니다. 하지만, 이 경우 Cashier의 동작을 부분적으로 재구현해야 합니다. 따라서, 테스트가 실제 Stripe API를 호출하도록 하는 것이 좋습니다. 이는 느릴 수 있지만, 애플리케이션이 예상대로 동작하는지 더 높은 신뢰를 제공합니다. 느린 테스트는 별도의 Pest / PHPUnit 테스트 그룹에 배치할 수 있습니다.

테스트할 때는 Cashier 자체에 이미 훌륭한 테스트 스위트가 있으므로, 애플리케이션의 구독 및 결제 플로우만 테스트하고 Cashier의 모든 내부 동작을 테스트할 필요는 없습니다.

시작하려면, `phpunit.xml` 파일에 Stripe 테스트 시크릿을 추가하세요:

```xml
<env name="STRIPE_SECRET" value="sk_test_<your-key>"/>
```

이제 테스트 중에 Cashier와 상호작용하면 실제 Stripe 테스트 환경에 API 요청이 전송됩니다. 편의를 위해, Stripe 테스트 계정에 테스트 중 사용할 구독/가격을 미리 채워두는 것이 좋습니다.

> [!NOTE]
> 신용카드 거절 및 실패 등 다양한 청구 시나리오를 테스트하려면 Stripe에서 제공하는 [테스트 카드 번호 및 토큰](https://stripe.com/docs/testing)을 사용할 수 있습니다.
