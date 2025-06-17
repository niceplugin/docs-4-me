# Eloquent: 직렬화










## 소개 {#introduction}

Laravel로 API를 구축할 때, 모델과 관계를 배열이나 JSON으로 변환해야 할 일이 자주 있습니다. Eloquent는 이러한 변환을 간편하게 처리할 수 있는 메서드와, 모델의 직렬화된 표현에 어떤 속성이 포함될지 제어할 수 있는 방법을 제공합니다.

> [!NOTE]
> Eloquent 모델과 컬렉션의 JSON 직렬화를 더욱 강력하게 처리하고 싶다면, [Eloquent API 리소스](/laravel/12.x/eloquent-resources) 문서를 참고하세요.


## 모델 및 컬렉션 직렬화 {#serializing-models-and-collections}


### 배열로 직렬화하기 {#serializing-to-arrays}

모델과 로드된 [관계](/laravel/12.x/eloquent-relationships)를 배열로 변환하려면 `toArray` 메서드를 사용하면 됩니다. 이 메서드는 재귀적으로 동작하므로, 모든 속성과 모든 관계(관계의 관계까지 포함)가 배열로 변환됩니다:

```php
use App\Models\User;

$user = User::with('roles')->first();

return $user->toArray();
```

`attributesToArray` 메서드는 모델의 속성만 배열로 변환하고, 관계는 변환하지 않습니다:

```php
$user = User::first();

return $user->attributesToArray();
```

또한, [컬렉션](/laravel/12.x/eloquent-collections) 전체를 컬렉션 인스턴스에서 `toArray` 메서드를 호출하여 배열로 변환할 수도 있습니다:

```php
$users = User::all();

return $users->toArray();
```


### JSON으로 직렬화하기 {#serializing-to-json}

모델을 JSON으로 변환하려면 `toJson` 메서드를 사용해야 합니다. `toArray`와 마찬가지로, `toJson` 메서드는 재귀적으로 동작하므로 모든 속성과 관계가 JSON으로 변환됩니다. 또한 [PHP에서 지원하는](https://secure.php.net/manual/en/function.json-encode.php) 모든 JSON 인코딩 옵션을 지정할 수 있습니다:

```php
use App\Models\User;

$user = User::find(1);

return $user->toJson();

return $user->toJson(JSON_PRETTY_PRINT);
```

또는, 모델이나 컬렉션을 문자열로 캐스팅할 수도 있는데, 이 경우 모델이나 컬렉션의 `toJson` 메서드가 자동으로 호출됩니다:

```php
return (string) User::find(1);
```

모델과 컬렉션은 문자열로 캐스팅될 때 JSON으로 변환되므로, 애플리케이션의 라우트나 컨트롤러에서 Eloquent 객체를 직접 반환할 수 있습니다. 라라벨은 라우트나 컨트롤러에서 반환된 Eloquent 모델과 컬렉션을 자동으로 JSON으로 직렬화합니다:

```php
Route::get('/users', function () {
    return User::all();
});
```


#### 관계 {#relationships}

Eloquent 모델이 JSON으로 변환될 때, 로드된 관계들은 자동으로 JSON 객체의 속성으로 포함됩니다. 또한, Eloquent 관계 메서드는 "카멜 케이스" 메서드 이름으로 정의되지만, 관계의 JSON 속성은 "스네이크 케이스"로 변환됩니다.


## JSON에서 속성 숨기기 {#hiding-attributes-from-json}

때때로 비밀번호와 같이 모델의 배열 또는 JSON 표현에 포함되는 속성을 제한하고 싶을 수 있습니다. 이를 위해 모델에 `$hidden` 프로퍼티를 추가하면 됩니다. `$hidden` 프로퍼티의 배열에 나열된 속성들은 모델이 직렬화될 때 포함되지 않습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 직렬화 시 숨겨야 할 속성들입니다.
     *
     * @var array<string>
     */
    protected $hidden = ['password'];
}
```

> [!NOTE]
> 관계를 숨기려면, Eloquent 모델의 `$hidden` 프로퍼티에 관계 메서드의 이름을 추가하세요.

또는, `visible` 프로퍼티를 사용하여 모델의 배열 및 JSON 표현에 포함되어야 할 속성의 "허용 목록"을 정의할 수도 있습니다. `$visible` 배열에 없는 모든 속성은 모델이 배열이나 JSON으로 변환될 때 숨겨집니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 배열에서 표시되어야 할 속성들입니다.
     *
     * @var array
     */
    protected $visible = ['first_name', 'last_name'];
}
```


#### 속성 가시성 임시 변경 {#temporarily-modifying-attribute-visibility}

일반적으로 숨겨진 속성을 특정 모델 인스턴스에서 보이도록 하고 싶다면, `makeVisible` 메서드를 사용할 수 있습니다. `makeVisible` 메서드는 모델 인스턴스를 반환합니다:

```php
return $user->makeVisible('attribute')->toArray();
```

반대로, 일반적으로 보이는 속성을 숨기고 싶다면 `makeHidden` 메서드를 사용할 수 있습니다.

```php
return $user->makeHidden('attribute')->toArray();
```

모든 보이는 속성 또는 숨겨진 속성을 임시로 재정의하고 싶다면, 각각 `setVisible` 및 `setHidden` 메서드를 사용할 수 있습니다:

```php
return $user->setVisible(['id', 'name'])->toArray();

return $user->setHidden(['email', 'password', 'remember_token'])->toArray();
```


## JSON에 값 추가하기 {#appending-values-to-json}

때때로, 모델을 배열이나 JSON으로 변환할 때 데이터베이스에 해당 컬럼이 없는 속성을 추가하고 싶을 수 있습니다. 이를 위해 먼저 해당 값에 대한 [접근자](/laravel/12.x/eloquent-mutators)를 정의해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 사용자가 관리자인지 여부를 결정합니다.
     */
    protected function isAdmin(): Attribute
    {
        return new Attribute(
            get: fn () => 'yes',
        );
    }
}
```

접근자가 항상 모델의 배열 및 JSON 표현에 추가되도록 하려면, 모델의 `appends` 속성에 해당 속성 이름을 추가하면 됩니다. 접근자 PHP 메서드는 "camel case"로 정의되어 있지만, 속성 이름은 일반적으로 "snake case" 직렬화 표현을 사용하여 참조된다는 점에 유의하세요:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 모델의 배열 형태에 추가할 접근자 목록입니다.
     *
     * @var array
     */
    protected $appends = ['is_admin'];
}
```

속성이 `appends` 목록에 추가되면, 해당 속성은 모델의 배열 및 JSON 표현 모두에 포함됩니다. `appends` 배열에 있는 속성은 모델에 설정된 `visible` 및 `hidden` 설정도 따릅니다.


#### 런타임에 속성 추가하기 {#appending-at-run-time}

런타임 시, 모델 인스턴스에 `append` 메서드를 사용하여 추가 속성을 동적으로 붙일 수 있습니다. 또는 `setAppends` 메서드를 사용하여 해당 모델 인스턴스에 대해 전체 추가 속성 배열을 덮어쓸 수도 있습니다:

```php
return $user->append('is_admin')->toArray();

return $user->setAppends(['is_admin'])->toArray();
```


## 날짜 직렬화 {#date-serialization}


#### 기본 날짜 형식 커스터마이징 {#customizing-the-default-date-format}

기본 직렬화 형식은 `serializeDate` 메서드를 오버라이드하여 커스터마이징할 수 있습니다. 이 메서드는 데이터베이스에 저장될 때의 날짜 형식에는 영향을 주지 않습니다:

```php
/**
 * 배열 / JSON 직렬화를 위한 날짜 준비.
 */
protected function serializeDate(DateTimeInterface $date): string
{
    return $date->format('Y-m-d');
}
```


#### 속성별 날짜 형식 커스터마이징 {#customizing-the-date-format-per-attribute}

모델의 [캐스트 선언](/laravel/12.x/eloquent-mutators#attribute-casting)에서 날짜 형식을 지정하여 개별 Eloquent 날짜 속성의 직렬화 형식을 커스터마이징할 수 있습니다:

```php
protected function casts(): array
{
    return [
        'birthday' => 'date:Y-m-d',
        'joined_at' => 'datetime:Y-m-d H:00',
    ];
}
```
