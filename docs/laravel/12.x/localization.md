# 로컬라이제이션














## 소개 {#introduction}

> [!NOTE]
> 기본적으로, Laravel 애플리케이션 스캐폴딩에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하고 싶다면 `lang:publish` Artisan 명령어를 통해 퍼블리시할 수 있습니다.

Laravel의 로컬라이제이션 기능은 다양한 언어로 문자열을 쉽게 가져올 수 있는 편리한 방법을 제공하여, 애플리케이션에서 여러 언어를 손쉽게 지원할 수 있도록 해줍니다.

Laravel은 번역 문자열을 관리하는 두 가지 방법을 제공합니다. 첫 번째로, 언어 문자열은 애플리케이션의 `lang` 디렉터리 내의 파일에 저장될 수 있습니다. 이 디렉터리 내에는 애플리케이션이 지원하는 각 언어별로 하위 디렉터리가 있을 수 있습니다. 이 방식은 Laravel이 내장 기능(예: 유효성 검사 에러 메시지)의 번역 문자열을 관리하는 데 사용하는 방법입니다:

```text
/lang
    /en
        messages.php
    /es
        messages.php
```

또는, 번역 문자열을 `lang` 디렉터리 내에 위치한 JSON 파일에 정의할 수도 있습니다. 이 방법을 사용할 경우, 애플리케이션이 지원하는 각 언어마다 해당 언어의 JSON 파일이 이 디렉터리에 존재해야 합니다. 이 방식은 번역해야 할 문자열이 많은 애플리케이션에 권장됩니다:

```text
/lang
    en.json
    es.json
```

이 문서에서는 번역 문자열을 관리하는 각 방법에 대해 다룹니다.


### 언어 파일 퍼블리싱 {#publishing-the-language-files}

기본적으로, Laravel 애플리케이션 스캐폴딩에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하거나 직접 만들고 싶다면, `lang:publish` Artisan 명령어를 통해 `lang` 디렉터리를 생성해야 합니다. `lang:publish` 명령어는 애플리케이션에 `lang` 디렉터리를 만들고, Laravel에서 사용하는 기본 언어 파일 세트를 퍼블리시합니다:

```shell
php artisan lang:publish
```


### 로케일 설정 {#configuring-the-locale}

애플리케이션의 기본 언어는 `config/app.php` 설정 파일의 `locale` 옵션에 저장되어 있으며, 일반적으로 `APP_LOCALE` 환경 변수로 설정됩니다. 이 값을 자유롭게 변경하여 애플리케이션의 요구에 맞출 수 있습니다.

또한, "폴백 언어"를 설정할 수도 있는데, 이는 기본 언어에 해당 번역 문자열이 없을 때 사용됩니다. 폴백 언어 역시 `config/app.php` 설정 파일에서 설정하며, 일반적으로 `APP_FALLBACK_LOCALE` 환경 변수로 지정됩니다.

실행 중에 단일 HTTP 요청에 대해 기본 언어를 변경하려면, `App` 파사드에서 제공하는 `setLocale` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\App;

Route::get('/greeting/{locale}', function (string $locale) {
    if (! in_array($locale, ['en', 'es', 'fr'])) {
        abort(400);
    }

    App::setLocale($locale);

    // ...
});
```


#### 현재 로케일 확인 {#determining-the-current-locale}

현재 로케일을 확인하거나, 로케일이 특정 값인지 확인하려면 `App` 파사드의 `currentLocale` 및 `isLocale` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\App;

$locale = App::currentLocale();

if (App::isLocale('en')) {
    // ...
}
```


### 복수형 언어 {#pluralization-language}

Eloquent 및 프레임워크의 다른 부분에서 단수 문자열을 복수형으로 변환할 때 사용되는 Laravel의 "pluralizer"가 영어가 아닌 다른 언어를 사용하도록 지정할 수 있습니다. 이는 애플리케이션 서비스 프로바이더의 `boot` 메서드 내에서 `useLanguage` 메서드를 호출하여 설정할 수 있습니다. Pluralizer가 현재 지원하는 언어는: `french`, `norwegian-bokmal`, `portuguese`, `spanish`, `turkish` 입니다:

```php
use Illuminate\Support\Pluralizer;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Pluralizer::useLanguage('spanish');

    // ...
}
```

> [!WARNING]
> Pluralizer의 언어를 커스터마이즈하는 경우, Eloquent 모델의 [테이블 이름](/laravel/12.x/eloquent#table-names)을 명시적으로 정의해야 합니다.


## 번역 문자열 정의 {#defining-translation-strings}


### 짧은 키 사용 {#using-short-keys}

일반적으로, 번역 문자열은 `lang` 디렉터리 내의 파일에 저장됩니다. 이 디렉터리 내에는 애플리케이션이 지원하는 각 언어별로 하위 디렉터리가 있어야 합니다. 이 방식은 Laravel이 내장 기능(예: 유효성 검사 에러 메시지)의 번역 문자열을 관리하는 데 사용하는 방법입니다:

```text
/lang
    /en
        messages.php
    /es
        messages.php
```

모든 언어 파일은 키-값 쌍의 배열을 반환합니다. 예를 들면:

```php
<?php

// lang/en/messages.php

return [
    'welcome' => 'Welcome to our application!',
];
```

> [!WARNING]
> 지역에 따라 다른 언어의 경우, 언어 디렉터리 이름을 ISO 15897에 따라 지정해야 합니다. 예를 들어, 영국 영어는 "en-gb"가 아니라 "en_GB"를 사용해야 합니다.


### 번역 문자열을 키로 사용 {#using-translation-strings-as-keys}

번역해야 할 문자열이 많은 애플리케이션의 경우, 모든 문자열에 "짧은 키"를 지정하면 뷰에서 키를 참조할 때 혼란스러울 수 있고, 매번 새로운 키를 만드는 것도 번거로울 수 있습니다.

이런 이유로, Laravel은 번역 문자열의 "기본" 번역을 키로 사용하는 방법도 지원합니다. 번역 문자열을 키로 사용하는 언어 파일은 `lang` 디렉터리 내의 JSON 파일로 저장됩니다. 예를 들어, 애플리케이션에 스페인어 번역이 있다면 `lang/es.json` 파일을 생성해야 합니다:

```json
{
    "I love programming.": "Me encanta programar."
}
```

#### 키 / 파일 충돌

다른 번역 파일명과 충돌하는 번역 문자열 키를 정의해서는 안 됩니다. 예를 들어, "NL" 로케일에서 `__('Action')`을 번역하려고 할 때 `nl/action.php` 파일이 존재하지만 `nl.json` 파일이 없다면, 번역기는 `nl/action.php`의 전체 내용을 반환하게 됩니다.


## 번역 문자열 가져오기 {#retrieving-translation-strings}

`__` 헬퍼 함수를 사용하여 언어 파일에서 번역 문자열을 가져올 수 있습니다. "짧은 키"를 사용하여 번역 문자열을 정의한 경우, 해당 키가 포함된 파일명과 키를 "점" 표기법으로 `__` 함수에 전달해야 합니다. 예를 들어, `lang/en/messages.php` 언어 파일에서 `welcome` 번역 문자열을 가져오려면:

```php
echo __('messages.welcome');
```

지정한 번역 문자열이 존재하지 않으면, `__` 함수는 번역 문자열 키를 그대로 반환합니다. 위 예시에서 번역 문자열이 없으면 `__` 함수는 `messages.welcome`을 반환합니다.

[기본 번역 문자열을 번역 키로 사용하는 경우](#using-translation-strings-as-keys), 문자열의 기본 번역을 `__` 함수에 전달해야 합니다;

```php
echo __('I love programming.');
```

마찬가지로, 번역 문자열이 존재하지 않으면 `__` 함수는 전달받은 번역 문자열 키를 그대로 반환합니다.

[Blade 템플릿 엔진](/laravel/12.x/blade)을 사용하는 경우, `{{ }}` 이코 문법을 사용하여 번역 문자열을 출력할 수 있습니다:

```blade
{{ __('messages.welcome') }}
```


### 번역 문자열의 파라미터 치환 {#replacing-parameters-in-translation-strings}

원한다면, 번역 문자열에 플레이스홀더를 정의할 수 있습니다. 모든 플레이스홀더는 `:`로 시작합니다. 예를 들어, 이름을 포함하는 환영 메시지를 정의할 수 있습니다:

```php
'welcome' => 'Welcome, :name',
```

번역 문자열을 가져올 때 플레이스홀더를 치환하려면, 두 번째 인자로 치환할 값을 배열로 전달하면 됩니다:

```php
echo __('messages.welcome', ['name' => 'dayle']);
```

플레이스홀더가 모두 대문자이거나, 첫 글자만 대문자인 경우, 번역된 값도 그에 맞게 대소문자가 적용됩니다:

```php
'welcome' => 'Welcome, :NAME', // Welcome, DAYLE
'goodbye' => 'Goodbye, :Name', // Goodbye, Dayle
```


#### 객체 치환 포맷팅 {#object-replacement-formatting}

번역 플레이스홀더로 객체를 전달하면, 해당 객체의 `__toString` 메서드가 호출됩니다. [`__toString`](https://www.php.net/manual/en/language.oop5.magic.php#object.tostring) 메서드는 PHP의 내장 "매직 메서드" 중 하나입니다. 하지만, 사용하는 클래스가 서드파티 라이브러리에 속해 있어 `__toString` 메서드를 직접 제어할 수 없는 경우도 있습니다.

이런 경우, 해당 객체 타입에 대한 커스텀 포맷 핸들러를 등록할 수 있습니다. 이를 위해 번역기의 `stringable` 메서드를 호출하면 됩니다. `stringable` 메서드는 클로저를 인자로 받으며, 포맷팅할 객체 타입을 타입힌트로 지정해야 합니다. 일반적으로, `stringable` 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 호출합니다:

```php
use Illuminate\Support\Facades\Lang;
use Money\Money;

/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Lang::stringable(function (Money $money) {
        return $money->formatTo('en_GB');
    });
}
```


### 복수형 처리 {#pluralization}

복수형 처리는 언어마다 다양한 복잡한 규칙이 있기 때문에 어려운 문제입니다. 하지만, Laravel은 여러분이 정의한 복수형 규칙에 따라 문자열을 다르게 번역할 수 있도록 도와줍니다. `|` 문자를 사용하여 단수형과 복수형을 구분할 수 있습니다:

```php
'apples' => 'There is one apple|There are many apples',
```

물론, [번역 문자열을 키로 사용하는 경우](#using-translation-strings-as-keys)에도 복수형 처리가 지원됩니다:

```json
{
    "There is one apple|There are many apples": "Hay una manzana|Hay muchas manzanas"
}
```

여러 값의 범위에 따라 번역 문자열을 지정하는 더 복잡한 복수형 규칙도 만들 수 있습니다:

```php
'apples' => '{0} There are none|[1,19] There are some|[20,*] There are many',
```

복수형 옵션이 있는 번역 문자열을 정의한 후에는, `trans_choice` 함수를 사용하여 주어진 "count"에 맞는 문자열을 가져올 수 있습니다. 이 예시에서 count가 1보다 크므로 복수형 번역 문자열이 반환됩니다:

```php
echo trans_choice('messages.apples', 10);
```

복수형 문자열에 플레이스홀더 속성을 정의할 수도 있습니다. 이 플레이스홀더는 `trans_choice` 함수의 세 번째 인자로 배열을 전달하여 치환할 수 있습니다:

```php
'minutes_ago' => '{1} :value minute ago|[2,*] :value minutes ago',

echo trans_choice('time.minutes_ago', 5, ['value' => 5]);
```

`trans_choice` 함수에 전달된 정수 값을 표시하고 싶다면, 내장된 `:count` 플레이스홀더를 사용할 수 있습니다:

```php
'apples' => '{0} There are none|{1} There is one|[2,*] There are :count',
```


## 패키지 언어 파일 오버라이드 {#overriding-package-language-files}

일부 패키지는 자체 언어 파일을 포함하고 있을 수 있습니다. 이러한 문자열을 수정하려고 패키지의 코어 파일을 직접 변경하는 대신, `lang/vendor/{package}/{locale}` 디렉터리에 파일을 두어 오버라이드할 수 있습니다.

예를 들어, `skyrim/hearthfire`라는 패키지의 `messages.php`에서 영어 번역 문자열을 오버라이드해야 한다면, `lang/vendor/hearthfire/en/messages.php`에 언어 파일을 두면 됩니다. 이 파일에는 오버라이드하고자 하는 번역 문자열만 정의하면 됩니다. 오버라이드하지 않은 번역 문자열은 여전히 패키지의 원본 언어 파일에서 로드됩니다.
