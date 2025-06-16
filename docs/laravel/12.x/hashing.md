# 해싱










## 소개 {#introduction}

Laravel의 `Hash` [파사드](/docs/{{version}}/facades)는 사용자 비밀번호 저장을 위한 안전한 Bcrypt 및 Argon2 해싱을 제공합니다. [Laravel 애플리케이션 스타터 키트](/docs/{{version}}/starter-kits) 중 하나를 사용하고 있다면, 기본적으로 회원가입 및 인증에 Bcrypt가 사용됩니다.

Bcrypt는 "작업 계수(work factor)"를 조정할 수 있기 때문에 비밀번호 해싱에 매우 적합한 선택입니다. 이는 하드웨어 성능이 향상됨에 따라 해시를 생성하는 데 걸리는 시간을 늘릴 수 있음을 의미합니다. 비밀번호를 해싱할 때는 느린 것이 좋습니다. 알고리즘이 비밀번호를 해싱하는 데 오래 걸릴수록, 악의적인 사용자가 모든 가능한 문자열 해시 값을 미리 계산해 두는 "레인보우 테이블"을 생성하는 데 더 많은 시간이 소요되어, 애플리케이션에 대한 무차별 대입 공격을 방지할 수 있습니다.


## 설정 {#configuration}

기본적으로 Laravel은 데이터를 해싱할 때 `bcrypt` 해싱 드라이버를 사용합니다. 그러나 [argon](https://en.wikipedia.org/wiki/Argon2) 및 [argon2id](https://en.wikipedia.org/wiki/Argon2)를 포함한 여러 다른 해싱 드라이버도 지원됩니다.

애플리케이션의 해싱 드라이버는 `HASH_DRIVER` 환경 변수를 사용하여 지정할 수 있습니다. 하지만 Laravel의 모든 해싱 드라이버 옵션을 커스터마이즈하고 싶다면, `config:publish` Artisan 명령어를 사용하여 전체 `hashing` 설정 파일을 퍼블리시해야 합니다:

```shell
php artisan config:publish hashing
```


## 기본 사용법 {#basic-usage}


### 비밀번호 해싱 {#hashing-passwords}

`Hash` 파사드의 `make` 메서드를 호출하여 비밀번호를 해싱할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * 사용자의 비밀번호를 업데이트합니다.
     */
    public function update(Request $request): RedirectResponse
    {
        // 새 비밀번호의 길이를 검증합니다...

        $request->user()->fill([
            'password' => Hash::make($request->newPassword)
        ])->save();

        return redirect('/profile');
    }
}
```


#### Bcrypt 작업 인자 조정하기 {#adjusting-the-bcrypt-work-factor}

Bcrypt 알고리즘을 사용하는 경우, `make` 메서드를 통해 `rounds` 옵션을 사용하여 알고리즘의 작업 인자를 조정할 수 있습니다. 하지만 Laravel에서 관리하는 기본 작업 인자는 대부분의 애플리케이션에 적합합니다:

```php
$hashed = Hash::make('password', [
    'rounds' => 12,
]);
```


#### Argon2 작업 계수 조정하기 {#adjusting-the-argon2-work-factor}

Argon2 알고리즘을 사용하는 경우, `make` 메서드를 통해 `memory`, `time`, `threads` 옵션을 사용하여 알고리즘의 작업 계수를 관리할 수 있습니다. 하지만, Laravel에서 관리하는 기본값은 대부분의 애플리케이션에 적합합니다:

```php
$hashed = Hash::make('password', [
    'memory' => 1024,
    'time' => 2,
    'threads' => 2,
]);
```

> [!NOTE]
> 이러한 옵션에 대한 자세한 내용은 [Argon 해싱에 관한 공식 PHP 문서](https://secure.php.net/manual/en/function.password-hash.php)를 참고하세요.


### 해시와 비밀번호가 일치하는지 확인하기 {#verifying-that-a-password-matches-a-hash}

`Hash` 파사드에서 제공하는 `check` 메서드를 사용하면 주어진 평문 문자열이 특정 해시와 일치하는지 확인할 수 있습니다:

```php
if (Hash::check('plain-text', $hashedPassword)) {
    // 비밀번호가 일치합니다...
}
```


### 비밀번호가 다시 해시되어야 하는지 확인하기 {#determining-if-a-password-needs-to-be-rehashed}

`Hash` 파사드에서 제공하는 `needsRehash` 메서드를 사용하면, 비밀번호가 해시된 이후 해셔에서 사용된 작업 계수가 변경되었는지 확인할 수 있습니다. 일부 애플리케이션에서는 이 확인을 인증 과정 중에 수행하기도 합니다:

```php
if (Hash::needsRehash($hashed)) {
    $hashed = Hash::make('plain-text');
}
```


## 해시 알고리즘 검증 {#hash-algorithm-verification}

해시 알고리즘 조작을 방지하기 위해, Laravel의 `Hash::check` 메서드는 먼저 주어진 해시가 애플리케이션에서 선택한 해시 알고리즘으로 생성되었는지 확인합니다. 만약 알고리즘이 다르다면, `RuntimeException` 예외가 발생합니다.

이는 대부분의 애플리케이션에서 기대되는 동작으로, 해시 알고리즘이 변경되지 않는 것이 일반적이며, 다른 알고리즘이 사용된 경우 악의적인 공격의 신호일 수 있습니다. 하지만, 한 알고리즘에서 다른 알고리즘으로 마이그레이션하는 등 애플리케이션에서 여러 해시 알고리즘을 지원해야 하는 경우, `HASH_VERIFY` 환경 변수를 `false`로 설정하여 해시 알고리즘 검증을 비활성화할 수 있습니다:

```ini
HASH_VERIFY=false
```
