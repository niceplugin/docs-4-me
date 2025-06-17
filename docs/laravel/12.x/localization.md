# 로컬라이제이션














## 소개 {#introduction}

> [!NOTE]
> 기본적으로 Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하고 싶다면, `lang:publish` Artisan 명령어를 통해 해당 파일들을 퍼블리시할 수 있습니다.

Laravel의 로컬라이제이션 기능은 다양한 언어로 문자열을 손쉽게 가져올 수 있는 편리한 방법을 제공하여, 애플리케이션에서 여러 언어를 쉽게 지원할 수 있도록 해줍니다.

Laravel에서는 번역 문자열을 관리하는 두 가지 방법을 제공합니다. 첫 번째로, 언어 문자열을 애플리케이션의 `lang` 디렉터리 내의 파일에 저장할 수 있습니다. 이 디렉터리 내에는 애플리케이션이 지원하는 각 언어별로 하위 디렉터리가 있을 수 있습니다. 이 방식은 Laravel이 내장된 기능(예: 유효성 검사 오류 메시지 등)의 번역 문자열을 관리할 때 사용하는 방법입니다:

```text
/lang
    /en
        messages.php
    /es
        messages.php
```

또는, 번역 문자열을 `lang` 디렉터리 내에 위치한 JSON 파일에 정의할 수도 있습니다. 이 방식을 사용할 경우, 애플리케이션이 지원하는 각 언어마다 해당 언어에 맞는 JSON 파일이 이 디렉터리에 존재하게 됩니다. 이 방법은 번역해야 할 문자열이 많은 애플리케이션에 권장됩니다:

```text
/lang
    en.json
    es.json
```

이 문서에서는 번역 문자열을 관리하는 각 방법에 대해 자세히 다루겠습니다.


### 언어 파일 퍼블리싱 {#publishing-the-language-files}

기본적으로 Laravel 애플리케이션 스켈레톤에는 `lang` 디렉터리가 포함되어 있지 않습니다. Laravel의 언어 파일을 커스터마이즈하거나 직접 생성하고 싶다면, `lang:publish` Artisan 명령어를 통해 `lang` 디렉터리를 생성해야 합니다. `lang:publish` 명령어는 애플리케이션에 `lang` 디렉터리를 만들고, Laravel에서 사용하는 기본 언어 파일 세트를 퍼블리싱합니다:

```shell
php artisan lang:publish
```


### 로케일 설정하기 {#configuring-the-locale}

애플리케이션의 기본 언어는 `config/app.php` 설정 파일의 `locale` 옵션에 저장되어 있으며, 일반적으로 `APP_LOCALE` 환경 변수를 통해 설정됩니다. 이 값은 애플리케이션의 필요에 따라 자유롭게 수정할 수 있습니다.

또한 "폴백 언어(fallback language)"를 설정할 수 있는데, 이는 기본 언어에 해당 번역 문자열이 없을 때 사용됩니다. 폴백 언어 역시 `config/app.php` 설정 파일에서 지정하며, 보통 `APP_FALLBACK_LOCALE` 환경 변수를 통해 값을 설정합니다.

HTTP 요청 단위로 기본 언어를 동적으로 변경하고 싶다면, `App` 파사드에서 제공하는 `setLocale` 메서드를 사용할 수 있습니다:

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


#### 현재 로케일 확인하기 {#determining-the-current-locale}

`App` 파사드의 `currentLocale` 및 `isLocale` 메서드를 사용하여 현재 로케일을 확인하거나, 로케일이 특정 값인지 검사할 수 있습니다:

```php
use Illuminate\Support\Facades\App;

$locale = App::currentLocale();

if (App::isLocale('en')) {
    // ...
}
```


### 복수화 언어 {#pluralization-language}

Laravel의 "복수화 도구(Pluralizer)"는 Eloquent 및 프레임워크의 다른 부분에서 단수 문자열을 복수 문자열로 변환할 때 사용됩니다. 이 도구가 영어가 아닌 다른 언어를 사용하도록 지정할 수 있습니다. 이를 위해 애플리케이션 서비스 프로바이더 중 하나의 `boot` 메서드 내에서 `useLanguage` 메서드를 호출하면 됩니다. 현재 복수화 도구가 지원하는 언어는 `french`, `norwegian-bokmal`, `portuguese`, `spanish`, `turkish`입니다:

```php
use Illuminate\Support\Pluralizer;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    Pluralizer::useLanguage('spanish');

    // ...
}
```

> [!WARNING]
> 복수화 도구의 언어를 커스터마이즈하는 경우, Eloquent 모델의 [테이블 이름](/laravel/12.x/eloquent#table-names)을 명시적으로 정의해야 합니다.


## 번역 문자열 정의하기 {#defining-translation-strings}


### 짧은 키 사용하기 {#using-short-keys}

일반적으로 번역 문자열은 `lang` 디렉터리 내의 파일에 저장됩니다. 이 디렉터리 안에는 애플리케이션이 지원하는 각 언어별로 하위 디렉터리가 있어야 합니다. 이 방식은 Laravel이 내장된 기능(예: 유효성 검사 오류 메시지)의 번역 문자열을 관리할 때 사용하는 방법입니다:

```text
/lang
    /en
        messages.php
    /es
        messages.php
```

모든 언어 파일은 키가 지정된 문자열 배열을 반환합니다. 예를 들면 다음과 같습니다:

```php
<?php

// lang/en/messages.php

return [
    'welcome' => 'Welcome to our application!',
];
```

> [!WARNING]
> 지역에 따라 구분되는 언어의 경우, 언어 디렉터리 이름은 ISO 15897 표준을 따라야 합니다. 예를 들어, 영국 영어는 "en-gb"가 아니라 "en_GB"로 지정해야 합니다.


### 번역 문자열을 키로 사용하기 {#using-translation-strings-as-keys}

번역해야 할 문자열이 많은 애플리케이션의 경우, 모든 문자열에 대해 "짧은 키"를 정의하는 것은 뷰에서 해당 키를 참조할 때 혼란스러울 수 있으며, 애플리케이션에서 지원하는 모든 번역 문자열에 대해 계속해서 키를 만들어내는 것도 번거로운 일입니다.

이러한 이유로, Laravel은 문자열의 "기본" 번역 자체를 키로 사용하여 번역 문자열을 정의하는 방법도 지원합니다. 번역 문자열을 키로 사용하는 언어 파일은 `lang` 디렉터리에 JSON 파일로 저장됩니다. 예를 들어, 애플리케이션에 스페인어 번역이 있다면 `lang/es.json` 파일을 생성해야 합니다:

```json
{
    "I love programming.": "Me encanta programar."
}
```

#### 키 / 파일 충돌

다른 번역 파일 이름과 충돌하는 번역 문자열 키를 정의해서는 안 됩니다. 예를 들어, "NL" 로케일에서 `__('Action')`을 번역하려고 할 때 `nl/action.php` 파일은 존재하지만 `nl.json` 파일이 없는 경우, 번역기는 `nl/action.php`의 전체 내용을 반환하게 됩니다.


## 번역 문자열 가져오기 {#retrieving-translation-strings}

언어 파일에서 번역 문자열을 가져올 때는 `__` 헬퍼 함수를 사용할 수 있습니다. "짧은 키(short keys)"를 사용하여 번역 문자열을 정의했다면, 해당 키가 포함된 파일명과 키를 "점(dot) 표기법"으로 `__` 함수에 전달해야 합니다. 예를 들어, `lang/en/messages.php` 언어 파일에서 `welcome` 번역 문자열을 가져오려면 다음과 같이 작성합니다:

```php
echo __('messages.welcome');
```

지정한 번역 문자열이 존재하지 않을 경우, `__` 함수는 전달받은 번역 문자열 키를 그대로 반환합니다. 위 예시에서 번역 문자열이 없으면 `__` 함수는 `messages.welcome`을 반환합니다.

[기본 번역 문자열을 번역 키로 사용하는 경우](#using-translation-strings-as-keys)에는, 번역 문자열의 기본값을 `__` 함수에 전달하면 됩니다.

```php
echo __('I love programming.');
```

이 경우에도 번역 문자열이 존재하지 않으면, `__` 함수는 전달받은 번역 문자열 키를 그대로 반환합니다.

[Blade 템플릿 엔진](/laravel/12.x/blade)을 사용하는 경우, `{{ }}` 출력 구문을 이용해 번역 문자열을 표시할 수 있습니다:

```blade
{{ __('messages.welcome') }}
```


### 번역 문자열에서 매개변수 대체하기 {#replacing-parameters-in-translation-strings}

원한다면, 번역 문자열에 플레이스홀더(placeholder)를 정의할 수 있습니다. 모든 플레이스홀더는 `:`로 시작합니다. 예를 들어, 이름을 위한 플레이스홀더가 포함된 환영 메시지를 다음과 같이 정의할 수 있습니다:

```php
'welcome' => 'Welcome, :name',
```

번역 문자열을 가져올 때 플레이스홀더를 대체하려면, `__` 함수의 두 번째 인자로 대체할 값을 배열로 전달하면 됩니다:

```php
echo __('messages.welcome', ['name' => 'dayle']);
```

만약 플레이스홀더가 모두 대문자이거나, 첫 글자만 대문자인 경우, 번역된 값도 그에 맞게 대문자로 변환됩니다:

```php
'welcome' => 'Welcome, :NAME', // Welcome, DAYLE
'goodbye' => 'Goodbye, :Name', // Goodbye, Dayle
```


#### 객체 대체 포매팅 {#object-replacement-formatting}

번역 플레이스홀더로 객체를 제공하려고 하면, 해당 객체의 `__toString` 메서드가 호출됩니다. [`__toString`](https://www.php.net/manual/en/language.oop5.magic.php#object.tostring) 메서드는 PHP에 내장된 "매직 메서드" 중 하나입니다. 하지만, 사용 중인 클래스가 서드파티 라이브러리에 속해 있을 경우처럼, 해당 클래스의 `__toString` 메서드를 직접 제어할 수 없는 상황도 있습니다.

이런 경우, Laravel은 특정 객체 타입에 대해 커스텀 포매팅 핸들러를 등록할 수 있도록 지원합니다. 이를 위해서는 트랜슬레이터의 `stringable` 메서드를 호출하면 됩니다. `stringable` 메서드는 클로저를 인자로 받으며, 이 클로저는 포매팅을 담당할 객체 타입을 타입힌트로 지정해야 합니다. 일반적으로 `stringable` 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드 내에서 호출하는 것이 좋습니다.

```php
use Illuminate\Support\Facades\Lang;
use Money\Money;

/**
 * 애플리케이션 서비스 부트스트랩.
 */
public function boot(): void
{
    Lang::stringable(function (Money $money) {
        return $money->formatTo('en_GB');
    });
}
```


### 복수형 처리 {#pluralization}

복수형 처리는 언어마다 다양한 복잡한 규칙이 있기 때문에 어려운 문제입니다. 하지만 Laravel은 여러분이 정의한 복수형 규칙에 따라 문자열을 다르게 번역할 수 있도록 도와줍니다. `|` 문자를 사용하여 문자열의 단수형과 복수형을 구분할 수 있습니다.

```php
'apples' => 'There is one apple|There are many apples',
```

물론, [번역 문자열을 키로 사용하는 경우](#using-translation-strings-as-keys)에도 복수형 처리가 지원됩니다.

```json
{
    "There is one apple|There are many apples": "Hay una manzana|Hay muchas manzanas"
}
```

여러 값의 범위에 따라 번역 문자열을 지정하는 더 복잡한 복수형 규칙도 만들 수 있습니다.

```php
'apples' => '{0} There are none|[1,19] There are some|[20,*] There are many',
```

복수형 옵션이 포함된 번역 문자열을 정의한 후에는 `trans_choice` 함수를 사용하여 주어진 "개수"에 맞는 번역을 가져올 수 있습니다. 이 예시에서는 개수가 1보다 크기 때문에 복수형 번역 문자열이 반환됩니다.

```php
echo trans_choice('messages.apples', 10);
```

복수형 문자열에 플레이스홀더 속성을 정의할 수도 있습니다. 이러한 플레이스홀더는 `trans_choice` 함수의 세 번째 인자로 배열을 전달하여 치환할 수 있습니다.

```php
'minutes_ago' => '{1} :value minute ago|[2,*] :value minutes ago',

echo trans_choice('time.minutes_ago', 5, ['value' => 5]);
```

`trans_choice` 함수에 전달된 정수 값을 표시하고 싶다면, 내장된 `:count` 플레이스홀더를 사용할 수 있습니다.

```php
'apples' => '{0} There are none|{1} There is one|[2,*] There are :count',
```


## 패키지 언어 파일 재정의 {#overriding-package-language-files}

일부 패키지는 자체 언어 파일을 함께 제공할 수 있습니다. 이러한 문자열을 수정하기 위해 패키지의 핵심 파일을 직접 변경하는 대신, `lang/vendor/{package}/{locale}` 디렉터리에 파일을 추가하여 재정의할 수 있습니다.

예를 들어, `skyrim/hearthfire`라는 패키지의 `messages.php` 파일에 있는 영어 번역 문자열을 재정의해야 한다면, `lang/vendor/hearthfire/en/messages.php` 경로에 언어 파일을 두어야 합니다. 이 파일에는 오직 재정의하고자 하는 번역 문자열만 정의하면 됩니다. 재정의하지 않은 번역 문자열은 여전히 패키지의 원본 언어 파일에서 불러와집니다.
