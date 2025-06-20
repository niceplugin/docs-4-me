# 에러 처리














## 소개 {#introduction}

새로운 Laravel 프로젝트를 시작하면 에러 및 예외 처리가 이미 구성되어 있습니다. 하지만 언제든지 애플리케이션의 `bootstrap/app.php`에서 `withExceptions` 메서드를 사용하여 예외가 보고되고 렌더링되는 방식을 관리할 수 있습니다.

`withExceptions` 클로저에 제공되는 `$exceptions` 객체는 `Illuminate\Foundation\Configuration\Exceptions`의 인스턴스이며, 애플리케이션의 예외 처리를 관리하는 역할을 합니다. 이 문서에서는 이 객체에 대해 더 자세히 다룰 것입니다.


## 설정 {#configuration}

`config/app.php` 설정 파일의 `debug` 옵션은 에러에 대한 정보가 사용자에게 얼마나 표시될지 결정합니다. 기본적으로 이 옵션은 `.env` 파일에 저장된 `APP_DEBUG` 환경 변수의 값을 따릅니다.

로컬 개발 중에는 `APP_DEBUG` 환경 변수를 `true`로 설정해야 합니다. **프로덕션 환경에서는 이 값을 항상 `false`로 설정해야 합니다. 프로덕션에서 이 값이 `true`로 설정되어 있으면, 애플리케이션의 최종 사용자에게 민감한 설정 값이 노출될 위험이 있습니다.**


## 예외 처리 {#handling-exceptions}


### 예외 보고 {#reporting-exceptions}

Laravel에서 예외 보고는 예외를 로그로 남기거나 [Sentry](https://github.com/getsentry/sentry-laravel) 또는 [Flare](https://flareapp.io)와 같은 외부 서비스로 전송하는 데 사용됩니다. 기본적으로 예외는 [로깅](/laravel/12.x/logging) 설정에 따라 기록됩니다. 하지만 원하는 방식으로 예외를 로그로 남길 수 있습니다.

다양한 타입의 예외를 각각 다르게 보고해야 한다면, 애플리케이션의 `bootstrap/app.php`에서 `report` 예외 메서드를 사용하여 특정 타입의 예외가 보고될 때 실행할 클로저를 등록할 수 있습니다. Laravel은 클로저의 타입힌트를 확인하여 어떤 타입의 예외를 보고하는지 결정합니다:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (InvalidOrderException $e) {
        // ...
    });
})
```

`report` 메서드를 사용해 커스텀 예외 보고 콜백을 등록하면, Laravel은 여전히 애플리케이션의 기본 로깅 설정을 사용해 예외를 기록합니다. 예외가 기본 로깅 스택으로 전파되는 것을 막고 싶다면, 보고 콜백을 정의할 때 `stop` 메서드를 사용하거나 콜백에서 `false`를 반환하면 됩니다:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (InvalidOrderException $e) {
        // ...
    })->stop();

    $exceptions->report(function (InvalidOrderException $e) {
        return false;
    });
})
```

> [!NOTE]
> 특정 예외에 대한 예외 보고를 커스터마이즈하려면 [보고 및 렌더링 가능한 예외](/laravel/12.x/errors#renderable-exceptions)를 사용할 수도 있습니다.


#### 전역 로그 컨텍스트 {#global-log-context}

가능하다면, Laravel은 현재 사용자의 ID를 모든 예외 로그 메시지의 컨텍스트 데이터로 자동 추가합니다. 애플리케이션의 `bootstrap/app.php` 파일에서 `context` 예외 메서드를 사용해 전역 컨텍스트 데이터를 직접 정의할 수 있습니다. 이 정보는 애플리케이션이 기록하는 모든 예외 로그 메시지에 포함됩니다:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->context(fn () => [
        'foo' => 'bar',
    ]);
})
```


#### 예외별 로그 컨텍스트 {#exception-log-context}

모든 로그 메시지에 컨텍스트를 추가하는 것이 유용할 수 있지만, 특정 예외에만 로그에 포함하고 싶은 고유한 컨텍스트가 있을 수 있습니다. 애플리케이션의 예외 중 하나에 `context` 메서드를 정의하면, 해당 예외의 로그 항목에 추가할 관련 데이터를 지정할 수 있습니다:

```php
<?php

namespace App\Exceptions;

use Exception;

class InvalidOrderException extends Exception
{
    // ...

    /**
     * 예외의 컨텍스트 정보를 가져옵니다.
     *
     * @return array<string, mixed>
     */
    public function context(): array
    {
        return ['order_id' => $this->orderId];
    }
}
```


#### `report` 헬퍼 {#the-report-helper}

때로는 예외를 보고해야 하지만 현재 요청 처리를 계속해야 할 때가 있습니다. `report` 헬퍼 함수는 사용자에게 에러 페이지를 렌더링하지 않고도 예외를 빠르게 보고할 수 있게 해줍니다:

```php
public function isValid(string $value): bool
{
    try {
        // 값을 검증...
    } catch (Throwable $e) {
        report($e);

        return false;
    }
}
```


#### 보고된 예외 중복 제거 {#deduplicating-reported-exceptions}

애플리케이션 전반에서 `report` 함수를 사용하다 보면, 동일한 예외를 여러 번 보고하여 로그에 중복 항목이 생길 수 있습니다.

하나의 예외 인스턴스가 한 번만 보고되도록 하려면, 애플리케이션의 `bootstrap/app.php` 파일에서 `dontReportDuplicates` 예외 메서드를 호출하면 됩니다:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReportDuplicates();
})
```

이제 동일한 예외 인스턴스로 `report` 헬퍼가 호출되면, 첫 번째 호출만 보고됩니다:

```php
$original = new RuntimeException('Whoops!');

report($original); // 보고됨

try {
    throw $original;
} catch (Throwable $caught) {
    report($caught); // 무시됨
}

report($original); // 무시됨
report($caught); // 무시됨
```


### 예외 로그 레벨 {#exception-log-levels}

애플리케이션의 [로그](/laravel/12.x/logging)에 메시지가 기록될 때, 메시지는 [로그 레벨](/laravel/12.x/logging#log-levels)에 따라 기록되며, 이는 메시지의 심각도나 중요도를 나타냅니다.

앞서 언급했듯이, `report` 메서드를 사용해 커스텀 예외 보고 콜백을 등록해도 Laravel은 여전히 애플리케이션의 기본 로깅 설정을 사용해 예외를 기록합니다. 하지만 로그 레벨이 메시지가 기록되는 채널에 영향을 줄 수 있으므로, 특정 예외가 기록되는 로그 레벨을 설정하고 싶을 수 있습니다.

이를 위해 애플리케이션의 `bootstrap/app.php` 파일에서 `level` 예외 메서드를 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 예외 타입, 두 번째 인자로 로그 레벨을 받습니다:

```php
use PDOException;
use Psr\Log\LogLevel;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->level(PDOException::class, LogLevel::CRITICAL);
})
```


### 타입별 예외 무시 {#ignoring-exceptions-by-type}

애플리케이션을 개발하다 보면, 절대 보고하고 싶지 않은 예외 타입이 있을 수 있습니다. 이러한 예외를 무시하려면, 애플리케이션의 `bootstrap/app.php` 파일에서 `dontReport` 예외 메서드를 사용할 수 있습니다. 이 메서드에 제공된 클래스는 절대 보고되지 않지만, 커스텀 렌더링 로직은 가질 수 있습니다:

```php
use App\Exceptions\InvalidOrderException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport([
        InvalidOrderException::class,
    ]);
})
```

또는, 예외 클래스에 `Illuminate\Contracts\Debug\ShouldntReport` 인터페이스를 구현(마크)하는 방법도 있습니다. 이 인터페이스가 마크된 예외는 Laravel의 예외 핸들러에서 절대 보고되지 않습니다:

```php
<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Debug\ShouldntReport;

class PodcastProcessingException extends Exception implements ShouldntReport
{
    //
}
```

내부적으로 Laravel은 이미 404 HTTP 에러나 잘못된 CSRF 토큰으로 인한 419 HTTP 응답 등 일부 에러 타입을 자동으로 무시합니다. Laravel이 특정 예외 타입을 무시하지 않도록 하려면, 애플리케이션의 `bootstrap/app.php` 파일에서 `stopIgnoring` 예외 메서드를 사용할 수 있습니다:

```php
use Symfony\Component\HttpKernel\Exception\HttpException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->stopIgnoring(HttpException::class);
})
```


### 예외 렌더링 {#rendering-exceptions}

기본적으로 Laravel 예외 핸들러는 예외를 HTTP 응답으로 변환합니다. 하지만 특정 타입의 예외에 대해 커스텀 렌더링 클로저를 등록할 수 있습니다. 이를 위해 애플리케이션의 `bootstrap/app.php` 파일에서 `render` 예외 메서드를 사용할 수 있습니다.

`render` 메서드에 전달된 클로저는 `Illuminate\Http\Response` 인스턴스를 반환해야 하며, 이는 `response` 헬퍼를 통해 생성할 수 있습니다. Laravel은 클로저의 타입힌트를 확인하여 어떤 타입의 예외를 렌더링하는지 결정합니다:

```php
use App\Exceptions\InvalidOrderException;
use Illuminate\Http\Request;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (InvalidOrderException $e, Request $request) {
        return response()->view('errors.invalid-order', status: 500);
    });
})
```

`render` 메서드를 사용해 `NotFoundHttpException`과 같은 Laravel 또는 Symfony의 내장 예외의 렌더링 동작을 오버라이드할 수도 있습니다. 클로저가 값을 반환하지 않으면, Laravel의 기본 예외 렌더링이 사용됩니다:

```php
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Record not found.'
            ], 404);
        }
    });
})
```


#### 예외를 JSON으로 렌더링 {#rendering-exceptions-as-json}

예외를 렌더링할 때, Laravel은 요청의 `Accept` 헤더를 기반으로 예외를 HTML 또는 JSON 응답으로 렌더링할지 자동으로 결정합니다. Laravel이 HTML 또는 JSON 예외 응답을 렌더링할지 결정하는 방식을 커스터마이즈하려면, `shouldRenderJsonWhen` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Http\Request;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
        if ($request->is('admin/*')) {
            return true;
        }

        return $request->expectsJson();
    });
})
```


#### 예외 응답 커스터마이즈 {#customizing-the-exception-response}

드물게, Laravel의 예외 핸들러가 렌더링하는 전체 HTTP 응답을 커스터마이즈해야 할 수도 있습니다. 이를 위해 `respond` 메서드를 사용해 응답 커스터마이즈 클로저를 등록할 수 있습니다:

```php
use Symfony\Component\HttpFoundation\Response;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->respond(function (Response $response) {
        if ($response->getStatusCode() === 419) {
            return back()->with([
                'message' => 'The page expired, please try again.',
            ]);
        }

        return $response;
    });
})
```


### 보고 및 렌더링 가능한 예외 {#renderable-exceptions}

애플리케이션의 `bootstrap/app.php` 파일에서 커스텀 보고 및 렌더링 동작을 정의하는 대신, 예외 클래스 자체에 `report` 및 `render` 메서드를 직접 정의할 수 있습니다. 이 메서드가 존재하면 프레임워크가 자동으로 호출합니다:

```php
<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvalidOrderException extends Exception
{
    /**
     * 예외를 보고합니다.
     */
    public function report(): void
    {
        // ...
    }

    /**
     * 예외를 HTTP 응답으로 렌더링합니다.
     */
    public function render(Request $request): Response
    {
        return response(/* ... */);
    }
}
```

예외가 이미 렌더링 가능한 예외(예: Laravel 또는 Symfony의 내장 예외)를 상속받는 경우, 예외의 `render` 메서드에서 `false`를 반환하여 예외의 기본 HTTP 응답을 렌더링할 수 있습니다:

```php
/**
 * 예외를 HTTP 응답으로 렌더링합니다.
 */
public function render(Request $request): Response|bool
{
    if (/** 예외에 커스텀 렌더링이 필요한지 판단 */) {

        return response(/* ... */);
    }

    return false;
}
```

예외에 특정 조건에서만 필요한 커스텀 보고 로직이 있다면, 예외의 `report` 메서드에서 `false`를 반환하여 Laravel이 기본 예외 처리 설정을 사용해 예외를 보고하도록 할 수 있습니다:

```php
/**
 * 예외를 보고합니다.
 */
public function report(): bool
{
    if (/** 예외에 커스텀 보고가 필요한지 판단 */) {

        // ...

        return true;
    }

    return false;
}
```

> [!NOTE]
> `report` 메서드에 필요한 의존성을 타입힌트하면, Laravel의 [서비스 컨테이너](/laravel/12.x/container)가 자동으로 주입해줍니다.


### 보고된 예외 제한 {#throttling-reported-exceptions}

애플리케이션에서 매우 많은 예외가 보고된다면, 실제로 로그로 남기거나 외부 에러 추적 서비스로 전송되는 예외의 수를 제한하고 싶을 수 있습니다.

예외의 무작위 샘플링 비율을 적용하려면, 애플리케이션의 `bootstrap/app.php` 파일에서 `throttle` 예외 메서드를 사용할 수 있습니다. `throttle` 메서드는 `Lottery` 인스턴스를 반환하는 클로저를 받습니다:

```php
use Illuminate\Support\Lottery;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        return Lottery::odds(1, 1000);
    });
})
```

예외 타입에 따라 조건부로 샘플링할 수도 있습니다. 특정 예외 클래스의 인스턴스만 샘플링하려면, 해당 클래스에 대해서만 `Lottery` 인스턴스를 반환하면 됩니다:

```php
use App\Exceptions\ApiMonitoringException;
use Illuminate\Support\Lottery;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        if ($e instanceof ApiMonitoringException) {
            return Lottery::odds(1, 1000);
        }
    });
})
```

또한, `Lottery` 대신 `Limit` 인스턴스를 반환하여 외부 에러 추적 서비스로 전송되거나 로그로 남겨지는 예외를 속도 제한할 수도 있습니다. 예를 들어, 애플리케이션에서 사용하는 서드파티 서비스가 다운되어 예외가 폭주하는 상황을 방지할 때 유용합니다:

```php
use Illuminate\Broadcasting\BroadcastException;
use Illuminate\Cache\RateLimiting\Limit;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        if ($e instanceof BroadcastException) {
            return Limit::perMinute(300);
        }
    });
})
```

기본적으로 제한은 예외의 클래스를 속도 제한 키로 사용합니다. `Limit`의 `by` 메서드를 사용해 직접 키를 지정할 수도 있습니다:

```php
use Illuminate\Broadcasting\BroadcastException;
use Illuminate\Cache\RateLimiting\Limit;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        if ($e instanceof BroadcastException) {
            return Limit::perMinute(300)->by($e->getMessage());
        }
    });
})
```

물론, 예외별로 `Lottery`와 `Limit` 인스턴스를 혼합하여 반환할 수도 있습니다:

```php
use App\Exceptions\ApiMonitoringException;
use Illuminate\Broadcasting\BroadcastException;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Lottery;
use Throwable;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->throttle(function (Throwable $e) {
        return match (true) {
            $e instanceof BroadcastException => Limit::perMinute(300),
            $e instanceof ApiMonitoringException => Lottery::odds(1, 1000),
            default => Limit::none(),
        };
    });
})
```


## HTTP 예외 {#http-exceptions}

일부 예외는 서버의 HTTP 에러 코드를 설명합니다. 예를 들어, "페이지를 찾을 수 없음"(404), "인증되지 않음"(401), 또는 개발자가 생성한 500 에러 등이 있습니다. 애플리케이션 어디에서든 이러한 응답을 생성하려면 `abort` 헬퍼를 사용할 수 있습니다:

```php
abort(404);
```


### 커스텀 HTTP 에러 페이지 {#custom-http-error-pages}

Laravel은 다양한 HTTP 상태 코드에 대한 커스텀 에러 페이지를 쉽게 표시할 수 있도록 해줍니다. 예를 들어, 404 HTTP 상태 코드에 대한 에러 페이지를 커스터마이즈하려면, `resources/views/errors/404.blade.php` 뷰 템플릿을 생성하세요. 이 뷰는 애플리케이션에서 발생하는 모든 404 에러에 대해 렌더링됩니다. 이 디렉터리 내의 뷰는 해당 HTTP 상태 코드와 일치하는 이름으로 지정해야 합니다. `abort` 함수에 의해 발생한 `Symfony\Component\HttpKernel\Exception.HttpException` 인스턴스는 `$exception` 변수로 뷰에 전달됩니다:

```blade
<h2>{{ $exception->getMessage() }}</h2>
```

Laravel의 기본 에러 페이지 템플릿은 `vendor:publish` Artisan 명령어를 사용해 퍼블리시할 수 있습니다. 템플릿을 퍼블리시한 후에는 원하는 대로 커스터마이즈할 수 있습니다:

```shell
php artisan vendor:publish --tag=laravel-errors
```


#### 폴백 HTTP 에러 페이지 {#fallback-http-error-pages}

특정 HTTP 상태 코드에 해당하는 페이지가 없을 경우를 대비해, 해당 계열의 "폴백" 에러 페이지를 정의할 수도 있습니다. 이를 위해 애플리케이션의 `resources/views/errors` 디렉터리에 `4xx.blade.php`와 `5xx.blade.php` 템플릿을 정의하세요.

폴백 에러 페이지를 정의할 때, `404`, `500`, `503` 에러 응답에는 영향을 주지 않습니다. Laravel은 이 상태 코드에 대해 내부적으로 전용 페이지를 가지고 있기 때문입니다. 이 상태 코드에 대한 페이지를 커스터마이즈하려면 각각에 대해 커스텀 에러 페이지를 별도로 정의해야 합니다.
