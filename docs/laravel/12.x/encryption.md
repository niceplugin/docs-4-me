# 암호화







## 소개 {#introduction}

Laravel의 암호화 서비스는 AES-256 및 AES-128 암호화를 사용하여 OpenSSL을 통해 텍스트를 암호화하고 복호화할 수 있는 간단하고 편리한 인터페이스를 제공합니다. Laravel에서 암호화된 모든 값은 메시지 인증 코드(MAC)를 사용하여 서명되므로, 암호화된 이후에는 해당 값이 수정되거나 변조될 수 없습니다.


## 설정 {#configuration}

Laravel의 암호화기를 사용하기 전에, `config/app.php` 설정 파일에서 `key` 설정 옵션을 지정해야 합니다. 이 설정 값은 `APP_KEY` 환경 변수에 의해 결정됩니다. 이 변수의 값을 생성하려면 `php artisan key:generate` 명령어를 사용해야 합니다. `key:generate` 명령어는 PHP의 보안 랜덤 바이트 생성기를 사용하여 애플리케이션을 위한 암호학적으로 안전한 키를 생성합니다. 일반적으로, `APP_KEY` 환경 변수의 값은 [Laravel 설치](/docs/{{version}}/installation) 과정에서 자동으로 생성됩니다.


### 암호화 키를 원활하게 교체하기 {#gracefully-rotating-encryption-keys}

애플리케이션의 암호화 키를 변경하면, 모든 인증된 사용자 세션이 애플리케이션에서 로그아웃됩니다. 이는 세션 쿠키를 포함한 모든 쿠키가 Laravel에 의해 암호화되기 때문입니다. 또한, 이전 암호화 키로 암호화된 데이터를 더 이상 복호화할 수 없게 됩니다.

이 문제를 완화하기 위해, Laravel은 애플리케이션의 `APP_PREVIOUS_KEYS` 환경 변수에 이전 암호화 키들을 나열할 수 있도록 허용합니다. 이 변수에는 이전에 사용한 모든 암호화 키를 쉼표로 구분하여 나열할 수 있습니다:

```ini
APP_KEY="base64:J63qRTDLub5NuZvP+kb8YIorGS6qFYHKVo6u7179stY="
APP_PREVIOUS_KEYS="base64:2nLsGFGzyoae2ax3EF2Lyq/hH6QghBGLIq5uL+Gp8/w="
```

이 환경 변수를 설정하면, Laravel은 값을 암호화할 때 항상 "현재" 암호화 키를 사용합니다. 하지만 값을 복호화할 때는 먼저 현재 키로 시도하고, 복호화에 실패하면 이전 키들을 차례로 시도하여 값의 복호화에 성공할 때까지 진행합니다.

이러한 원활한 복호화 방식 덕분에, 암호화 키가 교체되더라도 사용자는 애플리케이션을 중단 없이 계속 사용할 수 있습니다.


## 암호화기 사용하기 {#using-the-encrypter}


#### 값 암호화하기 {#encrypting-a-value}

`Crypt` 파사드에서 제공하는 `encryptString` 메서드를 사용하여 값을 암호화할 수 있습니다. 모든 암호화된 값은 OpenSSL과 AES-256-CBC 암호화 방식을 사용하여 암호화됩니다. 또한, 모든 암호화된 값에는 메시지 인증 코드(MAC)가 함께 서명됩니다. 이 통합 메시지 인증 코드는 악의적인 사용자가 변조한 값을 복호화하는 것을 방지합니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class DigitalOceanTokenController extends Controller
{
    /**
     * 사용자를 위한 DigitalOcean API 토큰 저장.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->user()->fill([
            'token' => Crypt::encryptString($request->token),
        ])->save();

        return redirect('/secrets');
    }
}
```


#### 값 복호화하기 {#decrypting-a-value}

`Crypt` 파사드에서 제공하는 `decryptString` 메서드를 사용하여 값을 복호화할 수 있습니다. 메시지 인증 코드가 유효하지 않은 등 값이 올바르게 복호화되지 않으면 `Illuminate\Contracts\Encryption\DecryptException` 예외가 발생합니다:

```php
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

try {
    $decrypted = Crypt::decryptString($encryptedValue);
} catch (DecryptException $e) {
    // ...
}
```
