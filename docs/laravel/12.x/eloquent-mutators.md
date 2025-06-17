# Eloquent: 변경자 & 캐스팅




















## 소개 {#introduction}

접근자, 변환자, 그리고 속성 캐스팅을 사용하면 Eloquent 모델 인스턴스에서 속성 값을 가져오거나 설정할 때 해당 값을 변환할 수 있습니다. 예를 들어, [Laravel 암호화기](/laravel/12.x/encryption)를 사용하여 값을 데이터베이스에 저장할 때 암호화하고, Eloquent 모델에서 해당 속성에 접근할 때 자동으로 복호화할 수 있습니다. 또는, 데이터베이스에 저장된 JSON 문자열을 Eloquent 모델을 통해 접근할 때 배열로 변환하고 싶을 수도 있습니다.


## 접근자와 변환자 {#accessors-and-mutators}


### 접근자 정의하기 {#defining-an-accessor}

접근자는 Eloquent 속성 값을 접근할 때 변환합니다. 접근자를 정의하려면, 모델에 보호된 메서드를 생성하여 접근 가능한 속성을 나타내세요. 이 메서드의 이름은 해당 모델 속성 또는 데이터베이스 컬럼의 "카멜 케이스" 표현과 일치해야 합니다.

이 예제에서는 `first_name` 속성에 대한 접근자를 정의합니다. 접근자는 `first_name` 속성의 값을 가져오려고 할 때 Eloquent에 의해 자동으로 호출됩니다. 모든 속성 접근자/변경자 메서드는 `Illuminate\Database\Eloquent\Casts\Attribute`의 반환 타입 힌트를 선언해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 사용자의 이름을 가져옵니다.
     */
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
        );
    }
}
```

모든 접근자 메서드는 속성을 어떻게 접근하고, 선택적으로 변경할지 정의하는 `Attribute` 인스턴스를 반환합니다. 이 예제에서는 속성을 어떻게 접근할지만 정의하고 있습니다. 이를 위해 `Attribute` 클래스 생성자에 `get` 인자를 전달합니다.

보시다시피, 컬럼의 원래 값이 접근자에 전달되어 값을 조작하고 반환할 수 있습니다. 접근자의 값을 사용하려면, 모델 인스턴스에서 `first_name` 속성에 단순히 접근하면 됩니다:

```php
use App\Models\User;

$user = User::find(1);

$firstName = $user->first_name;
```

> [!NOTE]
> 이러한 계산된 값을 모델의 배열/JSON 표현에 추가하고 싶다면, [값을 JSON에 추가](/laravel/12.x/eloquent-serialization#appending-values-to-json)해야 합니다.


#### 여러 속성으로부터 값 객체(Value Object) 생성하기 {#building-value-objects-from-multiple-attributes}

때때로 접근자(accessor)는 여러 모델 속성을 하나의 "값 객체"로 변환해야 할 수도 있습니다. 이를 위해 `get` 클로저는 두 번째 인자로 `$attributes`를 받을 수 있으며, 이 인자는 클로저에 자동으로 전달되어 모델의 현재 모든 속성을 포함하는 배열을 제공합니다:

```php
use App\Support\Address;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * 사용자의 주소와 상호작용합니다.
 */
protected function address(): Attribute
{
    return Attribute::make(
        get: fn (mixed $value, array $attributes) => new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two'],
        ),
    );
}
```


#### 접근자 캐싱 {#accessor-caching}

접근자에서 값 객체를 반환할 때, 값 객체에 가해진 모든 변경 사항은 모델이 저장되기 전에 자동으로 모델에 동기화됩니다. 이는 Eloquent가 접근자에서 반환된 인스턴스를 보관하여 접근자가 호출될 때마다 동일한 인스턴스를 반환할 수 있기 때문에 가능합니다:

```php
use App\Models\User;

$user = User::find(1);

$user->address->lineOne = '업데이트된 주소 1번 라인 값';
$user->address->lineTwo = '업데이트된 주소 2번 라인 값';

$user->save();
```

하지만, 문자열이나 불리언과 같은 원시 값에 대해, 특히 계산 비용이 많이 드는 경우에는 캐싱을 활성화하고 싶을 수 있습니다. 이를 위해 접근자를 정의할 때 `shouldCache` 메서드를 호출하면 됩니다:

```php
protected function hash(): Attribute
{
    return Attribute::make(
        get: fn (string $value) => bcrypt(gzuncompress($value)),
    )->shouldCache();
}
```

속성의 객체 캐싱 동작을 비활성화하고 싶다면, 속성을 정의할 때 `withoutObjectCaching` 메서드를 호출하면 됩니다:

```php
/**
 * 사용자의 주소와 상호작용합니다.
 */
protected function address(): Attribute
{
    return Attribute::make(
        get: fn (mixed $value, array $attributes) => new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two'],
        ),
    )->withoutObjectCaching();
}
```


### 변이자 정의하기 {#defining-a-mutator}

변이자(Mutator)는 Eloquent 속성 값이 설정될 때 해당 값을 변환합니다. 변이자를 정의하려면, 속성을 정의할 때 `set` 인자를 제공하면 됩니다. `first_name` 속성에 대한 변이자를 정의해보겠습니다. 이 변이자는 모델의 `first_name` 속성 값을 설정하려고 할 때 자동으로 호출됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 사용자의 이름과 상호작용합니다.
     */
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }
}
```

변이자 클로저는 속성에 설정되는 값을 전달받으며, 이 값을 조작한 후 조작된 값을 반환할 수 있습니다. 변이자를 사용하려면 Eloquent 모델의 `first_name` 속성만 설정하면 됩니다:

```php
use App\Models\User;

$user = User::find(1);

$user->first_name = 'Sally';
```

이 예시에서 `set` 콜백은 `Sally` 값을 인자로 호출됩니다. 변이자는 이름에 `strtolower` 함수를 적용한 후, 그 결과 값을 모델의 내부 `$attributes` 배열에 설정합니다.


#### 여러 속성 변형하기 {#mutating-multiple-attributes}

때때로 변형자(mutator)가 기본 모델의 여러 속성을 설정해야 할 수도 있습니다. 이럴 때는 `set` 클로저에서 배열을 반환하면 됩니다. 배열의 각 키는 모델과 연결된 기본 속성/데이터베이스 컬럼에 해당해야 합니다:

```php
use App\Support\Address;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * 사용자의 주소와 상호작용합니다.
 */
protected function address(): Attribute
{
    return Attribute::make(
        get: fn (mixed $value, array $attributes) => new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two'],
        ),
        set: fn (Address $value) => [
            'address_line_one' => $value->lineOne,
            'address_line_two' => $value->lineTwo,
        ],
    );
}
```


## 속성 캐스팅 {#attribute-casting}

속성 캐스팅은 모델에 추가 메서드를 정의하지 않고도 접근자와 변형자와 유사한 기능을 제공합니다. 대신, 모델의 `casts` 메서드는 속성을 일반적인 데이터 타입으로 변환하는 편리한 방법을 제공합니다.

`casts` 메서드는 캐스팅할 속성의 이름을 키로, 해당 컬럼을 변환하고자 하는 타입을 값으로 하는 배열을 반환해야 합니다. 지원되는 캐스팅 타입은 다음과 같습니다:

<div class="content-list" markdown="1">

- `array`
- `AsStringable::class`
- `AsUri::class`
- `boolean`
- `collection`
- `date`
- `datetime`
- `immutable_date`
- `immutable_datetime`
- <code>decimal:&lt;precision&gt;</code>
- `double`
- `encrypted`
- `encrypted:array`
- `encrypted:collection`
- `encrypted:object`
- `float`
- `hashed`
- `integer`
- `object`
- `real`
- `string`
- `timestamp`

</div>

속성 캐스팅을 예시로 보여주기 위해, 데이터베이스에 정수(`0` 또는 `1`)로 저장된 `is_admin` 속성을 불리언 값으로 캐스팅해보겠습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 캐스팅되어야 할 속성들을 가져옵니다.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
        ];
    }
}
```

캐스팅을 정의한 후에는, 데이터베이스에 정수로 저장되어 있더라도 `is_admin` 속성에 접근할 때 항상 불리언으로 캐스팅됩니다:

```php
$user = App\Models\User::find(1);

if ($user->is_admin) {
    // ...
}
```

런타임에 새로운 임시 캐스트를 추가해야 하는 경우, `mergeCasts` 메서드를 사용할 수 있습니다. 이 캐스트 정의들은 이미 모델에 정의된 캐스트에 추가됩니다:

```php
$user->mergeCasts([
    'is_admin' => 'integer',
    'options' => 'object',
]);
```

> [!WARNING]
> `null`인 속성은 캐스팅되지 않습니다. 또한, 관계와 동일한 이름을 가진 캐스트(또는 속성)를 정의하거나 모델의 기본 키에 캐스트를 할당해서는 안 됩니다.


#### Stringable 캐스팅 {#stringable-casting}

`Illuminate\Database\Eloquent\Casts\AsStringable` 캐스트 클래스를 사용하여 모델 속성을 [유연한 Illuminate\Support\Stringable 객체](/laravel/12.x/strings#fluent-strings-method-list)로 캐스팅할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsStringable;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 캐스팅되어야 하는 속성들을 가져옵니다.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'directory' => AsStringable::class,
        ];
    }
}
```


### 배열 및 JSON 캐스팅 {#array-and-json-casting}

`array` 캐스트는 직렬화된 JSON으로 저장된 컬럼을 다룰 때 특히 유용합니다. 예를 들어, 데이터베이스에 직렬화된 JSON이 포함된 `JSON` 또는 `TEXT` 필드 타입이 있다면, 해당 속성에 `array` 캐스트를 추가하면 Eloquent 모델에서 해당 속성에 접근할 때 자동으로 PHP 배열로 역직렬화됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 캐스팅되어야 하는 속성을 가져옵니다.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => 'array',
        ];
    }
}
```

캐스트가 정의되면, `options` 속성에 접근할 때 자동으로 JSON에서 PHP 배열로 역직렬화됩니다. 또한 `options` 속성의 값을 설정하면, 주어진 배열이 자동으로 JSON으로 직렬화되어 저장됩니다:

```php
use App\Models\User;

$user = User::find(1);

$options = $user->options;

$options['key'] = 'value';

$user->options = $options;

$user->save();
```

더 간결한 문법으로 JSON 속성의 단일 필드를 업데이트하려면, [속성을 대량 할당 가능하도록 만들고](/laravel/12.x/eloquent#mass-assignment-json-columns) `update` 메서드를 호출할 때 `->` 연산자를 사용할 수 있습니다:

```php
$user = User::find(1);

$user->update(['options->key' => 'value']);
```


#### JSON 및 유니코드 {#json-and-unicode}

배열 속성을 이스케이프되지 않은 유니코드 문자로 JSON으로 저장하고 싶다면, `json:unicode` 캐스트를 사용할 수 있습니다:

```php
/**
 * 캐스팅되어야 하는 속성들을 가져옵니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => 'json:unicode',
    ];
}
```


#### 배열 객체 및 컬렉션 캐스팅 {#array-object-and-collection-casting}

기본 `array` 캐스트는 많은 애플리케이션에서 충분하지만, 몇 가지 단점이 있습니다. `array` 캐스트는 원시 타입을 반환하기 때문에 배열의 오프셋을 직접 변경할 수 없습니다. 예를 들어, 아래 코드는 PHP 오류를 발생시킵니다:

```php
$user = User::find(1);

$user->options['key'] = $value;
```

이를 해결하기 위해, Laravel은 JSON 속성을 [ArrayObject](https://www.php.net/manual/en/class.arrayobject.php) 클래스로 캐스팅하는 `AsArrayObject` 캐스트를 제공합니다. 이 기능은 Laravel의 [커스텀 캐스트](#custom-casts) 구현을 사용하여, 변경된 객체를 지능적으로 캐시하고 변환하여 개별 오프셋을 PHP 오류 없이 수정할 수 있도록 합니다. `AsArrayObject` 캐스트를 사용하려면, 단순히 속성에 할당하면 됩니다:

```php
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

/**
 * 캐스팅할 속성들을 반환합니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => AsArrayObject::class,
    ];
}
```

마찬가지로, Laravel은 JSON 속성을 Laravel [Collection](/laravel/12.x/collections) 인스턴스로 캐스팅하는 `AsCollection` 캐스트도 제공합니다:

```php
use Illuminate\Database\Eloquent\Casts\AsCollection;

/**
 * 캐스팅할 속성들을 반환합니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => AsCollection::class,
    ];
}
```

`AsCollection` 캐스트가 Laravel의 기본 컬렉션 클래스 대신 커스텀 컬렉션 클래스를 인스턴스화하도록 하려면, 캐스트 인자로 컬렉션 클래스명을 전달할 수 있습니다:

```php
use App\Collections\OptionCollection;
use Illuminate\Database\Eloquent\Casts\AsCollection;

/**
 * 캐스팅할 속성들을 반환합니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => AsCollection::using(OptionCollection::class),
    ];
}
```

`of` 메서드를 사용하면 컬렉션의 [mapInto 메서드](/laravel/12.x/collections#method-mapinto)를 통해 컬렉션 아이템을 지정한 클래스로 매핑할 수 있습니다:

```php
use App\ValueObjects\Option;
use Illuminate\Database\Eloquent\Casts\AsCollection;

/**
 * 캐스팅할 속성들을 반환합니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'options' => AsCollection::of(Option::class)
    ];
}
```

컬렉션을 객체로 매핑할 때, 해당 객체는 인스턴스가 데이터베이스에 JSON으로 직렬화되는 방식을 정의하기 위해 `Illuminate\Contracts\Support\Arrayable` 및 `JsonSerializable` 인터페이스를 구현해야 합니다:

```php
<?php

namespace App\ValueObjects;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

class Option implements Arrayable, JsonSerializable
{
    public string $name;
    public mixed $value;
    public bool $isLocked;

    /**
     * 새로운 Option 인스턴스를 생성합니다.
     */
    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->value = $data['value'];
        $this->isLocked = $data['is_locked'];
    }

    /**
     * 인스턴스를 배열로 반환합니다.
     *
     * @return array{name: string, data: string, is_locked: bool}
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
            'is_locked' => $this->isLocked,
        ];
    }

    /**
     * JSON으로 직렬화할 데이터를 지정합니다.
     *
     * @return array{name: string, data: string, is_locked: bool}
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
```


### 날짜 캐스팅 {#date-casting}

기본적으로 Eloquent는 `created_at`과 `updated_at` 컬럼을 [Carbon](https://github.com/briannesbitt/Carbon) 인스턴스로 캐스팅합니다. Carbon은 PHP의 `DateTime` 클래스를 확장하며 다양한 유용한 메서드를 제공합니다. 모델의 `casts` 메서드 내에 추가적인 날짜 캐스트를 정의하여 더 많은 날짜 속성을 캐스팅할 수 있습니다. 일반적으로 날짜는 `datetime` 또는 `immutable_datetime` 캐스트 타입을 사용하여 캐스팅해야 합니다.

`date` 또는 `datetime` 캐스트를 정의할 때 날짜의 포맷도 지정할 수 있습니다. 이 포맷은 [모델이 배열이나 JSON으로 직렬화될 때](/laravel/12.x/eloquent-serialization) 사용됩니다:

```php
/**
 * 캐스팅되어야 하는 속성을 가져옵니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'created_at' => 'datetime:Y-m-d',
    ];
}
```

컬럼이 날짜로 캐스팅되면, 해당 모델 속성 값을 UNIX 타임스탬프, 날짜 문자열(`Y-m-d`), 날짜-시간 문자열, 또는 `DateTime` / `Carbon` 인스턴스로 설정할 수 있습니다. 날짜 값은 올바르게 변환되어 데이터베이스에 저장됩니다.

모델의 모든 날짜에 대한 기본 직렬화 포맷을 커스터마이즈하려면, 모델에 `serializeDate` 메서드를 정의하면 됩니다. 이 메서드는 날짜가 데이터베이스에 저장되는 방식에는 영향을 주지 않습니다:

```php
/**
 * 배열 / JSON 직렬화를 위한 날짜 준비.
 */
protected function serializeDate(DateTimeInterface $date): string
{
    return $date->format('Y-m-d');
}
```

모델의 날짜가 실제로 데이터베이스에 저장될 때 사용할 포맷을 지정하려면, 모델에 `$dateFormat` 프로퍼티를 정의해야 합니다:

```php
/**
 * 모델의 날짜 컬럼 저장 포맷.
 *
 * @var string
 */
protected $dateFormat = 'U';
```


#### 날짜 캐스팅, 직렬화, 그리고 타임존 {#date-casting-and-timezones}

기본적으로, `date`와 `datetime` 캐스트는 애플리케이션의 `timezone` 설정 옵션에 지정된 타임존과 상관없이 날짜를 UTC ISO-8601 날짜 문자열(`YYYY-MM-DDTHH:MM:SS.uuuuuuZ`)로 직렬화합니다. 이 직렬화 형식을 항상 사용하고, 애플리케이션의 `timezone` 설정 옵션을 기본값인 `UTC`에서 변경하지 않아 날짜를 UTC 타임존에 저장하는 것을 강력히 권장합니다. 애플리케이션 전반에서 UTC 타임존을 일관되게 사용하면 PHP와 JavaScript로 작성된 다른 날짜 조작 라이브러리와의 상호 운용성이 극대화됩니다.

`datetime:Y-m-d H:i:s`와 같이 `date` 또는 `datetime` 캐스트에 커스텀 포맷이 적용된 경우, 날짜 직렬화 시 Carbon 인스턴스의 내부 타임존이 사용됩니다. 일반적으로 이는 애플리케이션의 `timezone` 설정 옵션에 지정된 타임존이 됩니다. 하지만, `created_at` 및 `updated_at`과 같은 `timestamp` 컬럼은 이 동작에서 예외이며, 애플리케이션의 타임존 설정과 상관없이 항상 UTC로 포맷된다는 점에 유의해야 합니다.


### Enum Casting {#enum-casting}

Eloquent는 또한 속성 값을 PHP [Enums](https://www.php.net/manual/en/language.enumerations.backed.php)로 캐스팅할 수 있도록 지원합니다. 이를 위해 모델의 `casts` 메서드에서 캐스팅할 속성과 enum을 지정하면 됩니다:

```php
use App\Enums\ServerStatus;

/**
 * 캐스팅되어야 하는 속성들을 가져옵니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'status' => ServerStatus::class,
    ];
}
```

모델에 캐스팅을 정의하면, 해당 속성은 접근하거나 저장할 때 자동으로 enum으로 변환됩니다:

```php
if ($server->status == ServerStatus::Provisioned) {
    $server->status = ServerStatus::Ready;

    $server->save();
}
```


#### 열거형 배열 캐스팅 {#casting-arrays-of-enums}

때때로 모델이 하나의 컬럼에 열거형 값의 배열을 저장해야 할 필요가 있습니다. 이를 위해 Laravel에서 제공하는 `AsEnumArrayObject` 또는 `AsEnumCollection` 캐스트를 사용할 수 있습니다:

```php
use App\Enums\ServerStatus;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;

/**
 * 캐스팅되어야 할 속성들을 가져옵니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'statuses' => AsEnumCollection::of(ServerStatus::class),
    ];
}
```


### 암호화 캐스팅 {#encrypted-casting}

`encrypted` 캐스팅은 Laravel의 내장 [암호화](/laravel/12.x/encryption) 기능을 사용하여 모델의 속성 값을 암호화합니다. 또한, `encrypted:array`, `encrypted:collection`, `encrypted:object`, `AsEncryptedArrayObject`, `AsEncryptedCollection` 캐스팅은 암호화되지 않은 버전과 동일하게 동작하지만, 예상할 수 있듯이 데이터베이스에 저장될 때 해당 값이 암호화됩니다.

암호화된 텍스트의 최종 길이는 예측할 수 없으며 일반 텍스트보다 더 길기 때문에, 관련 데이터베이스 컬럼이 반드시 `TEXT` 타입 이상이어야 합니다. 또한, 값이 데이터베이스에서 암호화되어 저장되므로 암호화된 속성 값을 쿼리하거나 검색할 수 없습니다.


#### 키 교체 {#key-rotation}

알고 계시듯이, Laravel은 애플리케이션의 `app` 설정 파일에 지정된 `key` 설정 값을 사용하여 문자열을 암호화합니다. 일반적으로 이 값은 `APP_KEY` 환경 변수의 값과 일치합니다. 애플리케이션의 암호화 키를 교체해야 하는 경우, 새 키를 사용하여 암호화된 속성들을 수동으로 다시 암호화해야 합니다.


### 쿼리 시점 캐스팅 {#query-time-casting}

때때로 테이블에서 원시 값을 선택할 때와 같이 쿼리를 실행하는 동안 캐스팅을 적용해야 할 수 있습니다. 예를 들어, 다음 쿼리를 살펴보세요:

```php
use App\Models\Post;
use App\Models\User;

$users = User::select([
    'users.*',
    'last_posted_at' => Post::selectRaw('MAX(created_at)')
        ->whereColumn('user_id', 'users.id')
])->get();
```

이 쿼리의 결과로 반환되는 `last_posted_at` 속성은 단순한 문자열이 됩니다. 쿼리를 실행할 때 이 속성에 `datetime` 캐스팅을 적용할 수 있다면 정말 좋을 것입니다. 다행히도, `withCasts` 메서드를 사용하여 이를 달성할 수 있습니다:

```php
$users = User::select([
    'users.*',
    'last_posted_at' => Post::selectRaw('MAX(created_at)')
        ->whereColumn('user_id', 'users.id')
])->withCasts([
    'last_posted_at' => 'datetime'
])->get();
```


## 커스텀 캐스트 {#custom-casts}

Laravel에는 다양한 내장 캐스트 타입이 있지만, 때로는 직접 캐스트 타입을 정의해야 할 때가 있습니다. 캐스트를 생성하려면 `make:cast` Artisan 명령어를 실행하세요. 새로 생성된 캐스트 클래스는 `app/Casts` 디렉터리에 위치하게 됩니다:

```shell
php artisan make:cast AsJson
```

모든 커스텀 캐스트 클래스는 `CastsAttributes` 인터페이스를 구현합니다. 이 인터페이스를 구현하는 클래스는 반드시 `get`과 `set` 메서드를 정의해야 합니다. `get` 메서드는 데이터베이스의 원시 값을 캐스트 값으로 변환하는 역할을 하며, `set` 메서드는 캐스트 값을 데이터베이스에 저장할 수 있는 원시 값으로 변환해야 합니다. 예시로, 내장된 `json` 캐스트 타입을 커스텀 캐스트 타입으로 다시 구현해보겠습니다:

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class AsJson implements CastsAttributes
{
    /**
     * 주어진 값을 캐스팅합니다.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    public function get(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): array {
        return json_decode($value, true);
    }

    /**
     * 주어진 값을 저장을 위해 준비합니다.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): string {
        return json_encode($value);
    }
}
```

커스텀 캐스트 타입을 정의한 후에는, 해당 클래스 이름을 사용하여 모델 속성에 연결할 수 있습니다:

```php
<?php

namespace App\Models;

use App\Casts\AsJson;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 캐스팅되어야 할 속성들을 반환합니다.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => AsJson::class,
        ];
    }
}
```


### 값 객체 캐스팅 {#value-object-casting}

값을 원시 타입으로만 캐스팅할 필요는 없습니다. 값들을 객체로도 캐스팅할 수 있습니다. 값을 객체로 캐스팅하는 커스텀 캐스트를 정의하는 방법은 원시 타입으로 캐스팅하는 것과 매우 유사합니다. 하지만, 값 객체가 둘 이상의 데이터베이스 컬럼을 포함한다면, `set` 메서드는 모델에 저장될 원시 값들을 설정하기 위해 키/값 쌍의 배열을 반환해야 합니다. 값 객체가 단일 컬럼에만 영향을 준다면, 저장 가능한 값을 단순히 반환하면 됩니다.

예를 들어, 여러 모델 값을 하나의 `Address` 값 객체로 캐스팅하는 커스텀 캐스트 클래스를 정의해보겠습니다. `Address` 값 객체는 두 개의 public 프로퍼티, `lineOne`과 `lineTwo`를 가진다고 가정합니다:

```php
<?php

namespace App\Casts;

use App\ValueObjects\Address;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class AsAddress implements CastsAttributes
{
    /**
     * 주어진 값을 캐스팅합니다.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): Address {
        return new Address(
            $attributes['address_line_one'],
            $attributes['address_line_two']
        );
    }

    /**
     * 주어진 값을 저장을 위해 준비합니다.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): array {
        if (! $value instanceof Address) {
            throw new InvalidArgumentException('The given value is not an Address instance.');
        }

        return [
            'address_line_one' => $value->lineOne,
            'address_line_two' => $value->lineTwo,
        ];
    }
}
```

값 객체로 캐스팅할 때, 값 객체에 가해진 모든 변경 사항은 모델이 저장되기 전에 자동으로 모델에 동기화됩니다:

```php
use App\Models\User;

$user = User::find(1);

$user->address->lineOne = 'Updated Address Value';

$user->save();
```

> [!NOTE]
> 값 객체를 포함하는 Eloquent 모델을 JSON이나 배열로 직렬화할 계획이라면, 값 객체에 `Illuminate\Contracts\Support\Arrayable` 및 `JsonSerializable` 인터페이스를 구현해야 합니다.


#### 값 객체 캐싱 {#value-object-caching}

값 객체로 캐스팅된 속성이 해석될 때, Eloquent는 이를 캐싱합니다. 따라서 해당 속성에 다시 접근하면 동일한 객체 인스턴스가 반환됩니다.

커스텀 캐스트 클래스의 객체 캐싱 동작을 비활성화하고 싶다면, 커스텀 캐스트 클래스에 public `withoutObjectCaching` 속성을 선언하면 됩니다:

```php
class AsAddress implements CastsAttributes
{
    public bool $withoutObjectCaching = true;

    // ...
}
```


### 배열 / JSON 직렬화 {#array-json-serialization}

Eloquent 모델이 `toArray` 및 `toJson` 메서드를 사용하여 배열이나 JSON으로 변환될 때, 커스텀 캐스트 값 객체는 일반적으로 `Illuminate\Contracts\Support\Arrayable` 및 `JsonSerializable` 인터페이스를 구현하고 있다면 함께 직렬화됩니다. 하지만, 서드파티 라이브러리에서 제공하는 값 객체를 사용할 경우에는 이러한 인터페이스를 객체에 추가할 수 없는 경우가 있습니다.

따라서, 커스텀 캐스트 클래스가 값 객체의 직렬화를 직접 담당하도록 지정할 수 있습니다. 이를 위해 커스텀 캐스트 클래스는 `Illuminate\Contracts\Database\Eloquent\SerializesCastableAttributes` 인터페이스를 구현해야 합니다. 이 인터페이스는 클래스에 값 객체의 직렬화된 형태를 반환하는 `serialize` 메서드가 포함되어야 함을 명시합니다:

```php
/**
 * 값의 직렬화된 표현을 가져옵니다.
 *
 * @param  array<string, mixed>  $attributes
 */
public function serialize(
    Model $model,
    string $key,
    mixed $value,
    array $attributes,
): string {
    return (string) $value;
}
```


### 인바운드 캐스팅 {#inbound-casting}

가끔 모델에 값을 설정할 때만 변환을 수행하고, 모델에서 속성을 조회할 때는 아무 작업도 하지 않는 커스텀 캐스트 클래스를 작성해야 할 때가 있습니다.

인바운드 전용 커스텀 캐스트는 `CastsInboundAttributes` 인터페이스를 구현해야 하며, 이 인터페이스는 `set` 메서드만 정의하면 됩니다. 인바운드 전용 캐스트 클래스를 생성하려면 `make:cast` 아티즌 명령어에 `--inbound` 옵션을 추가하여 실행할 수 있습니다:

```shell
php artisan make:cast AsHash --inbound
```

인바운드 전용 캐스트의 대표적인 예는 "해싱" 캐스트입니다. 예를 들어, 주어진 알고리즘을 통해 인바운드 값을 해싱하는 캐스트를 정의할 수 있습니다:

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsInboundAttributes;
use Illuminate\Database\Eloquent\Model;

class AsHash implements CastsInboundAttributes
{
    /**
     * 새로운 캐스트 클래스 인스턴스를 생성합니다.
     */
    public function __construct(
        protected string|null $algorithm = null,
    ) {}

    /**
     * 저장을 위해 주어진 값을 준비합니다.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): string {
        return is_null($this->algorithm)
            ? bcrypt($value)
            : hash($this->algorithm, $value);
    }
}
```


### 캐스트 매개변수 {#cast-parameters}

모델에 커스텀 캐스트를 연결할 때, 클래스 이름 뒤에 `:` 문자를 사용하여 캐스트 매개변수를 지정할 수 있으며, 여러 매개변수는 쉼표로 구분합니다. 이 매개변수들은 캐스트 클래스의 생성자에 전달됩니다:

```php
/**
 * 캐스트되어야 하는 속성들을 가져옵니다.
 *
 * @return array<string, string>
 */
protected function casts(): array
{
    return [
        'secret' => AsHash::class.':sha256',
    ];
}
```


### Cast 값 비교하기 {#comparing-cast-values}

두 개의 cast 값이 변경되었는지 비교하는 방법을 정의하고 싶다면, 커스텀 cast 클래스에서 `Illuminate\Contracts\Database\Eloquent\ComparesCastableAttributes` 인터페이스를 구현할 수 있습니다. 이를 통해 Eloquent가 어떤 값을 변경된 것으로 간주하여 모델이 업데이트될 때 데이터베이스에 저장할지 세밀하게 제어할 수 있습니다.

이 인터페이스는 클래스에 `compare` 메서드를 포함해야 한다고 명시하며, 주어진 값들이 동일하다고 간주되면 `true`를 반환해야 합니다:

```php
/**
 * 주어진 값들이 동일한지 판단합니다.
 *
 * @param  \Illuminate\Database\Eloquent\Model  $model
 * @param  string  $key
 * @param  mixed  $firstValue
 * @param  mixed  $secondValue
 * @return bool
 */
public function compare(
    Model $model,
    string $key,
    mixed $firstValue,
    mixed $secondValue
): bool {
    return $firstValue === $secondValue;
}
```


### Castables {#castables}

애플리케이션의 값 객체가 자체 커스텀 캐스트 클래스를 정의할 수 있도록 하고 싶을 수 있습니다. 커스텀 캐스트 클래스를 모델에 직접 연결하는 대신, `Illuminate\Contracts\Database\Eloquent\Castable` 인터페이스를 구현하는 값 객체 클래스를 연결할 수도 있습니다:

```php
use App\ValueObjects\Address;

protected function casts(): array
{
    return [
        'address' => Address::class,
    ];
}
```

`Castable` 인터페이스를 구현하는 객체는 `Castable` 클래스에서 변환할 때 사용할 커스텀 캐스터 클래스의 클래스명을 반환하는 `castUsing` 메서드를 정의해야 합니다:

```php
<?php

namespace App\ValueObjects;

use Illuminate\Contracts\Database\Eloquent\Castable;
use App\Casts\AsAddress;

class Address implements Castable
{
    /**
     * 이 캐스트 대상에서 변환할 때 사용할 캐스터 클래스의 이름을 반환합니다.
     *
     * @param  array<string, mixed>  $arguments
     */
    public static function castUsing(array $arguments): string
    {
        return AsAddress::class;
    }
}
```

`Castable` 클래스를 사용할 때도 `casts` 메서드 정의에서 인자를 전달할 수 있습니다. 이 인자들은 `castUsing` 메서드로 전달됩니다:

```php
use App\ValueObjects\Address;

protected function casts(): array
{
    return [
        'address' => Address::class.':argument',
    ];
}
```


#### Castables & Anonymous Cast Classes {#anonymous-cast-classes}

"캐스터블(castable)"과 PHP의 [익명 클래스](https://www.php.net/manual/en/language.oop5.anonymous.php)를 결합하면, 값 객체와 그 캐스팅 로직을 하나의 캐스터블 객체로 정의할 수 있습니다. 이를 위해 값 객체의 `castUsing` 메서드에서 익명 클래스를 반환하면 됩니다. 익명 클래스는 `CastsAttributes` 인터페이스를 구현해야 합니다:

```php
<?php

namespace App\ValueObjects;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class Address implements Castable
{
    // ...

    /**
     * 이 캐스트 대상에서 /로 캐스팅할 때 사용할 캐스터 클래스를 반환합니다.
     *
     * @param  array<string, mixed>  $arguments
     */
    public static function castUsing(array $arguments): CastsAttributes
    {
        return new class implements CastsAttributes
        {
            public function get(
                Model $model,
                string $key,
                mixed $value,
                array $attributes,
            ): Address {
                return new Address(
                    $attributes['address_line_one'],
                    $attributes['address_line_two']
                );
            }

            public function set(
                Model $model,
                string $key,
                mixed $value,
                array $attributes,
            ): array {
                return [
                    'address_line_one' => $value->lineOne,
                    'address_line_two' => $value->lineTwo,
                ];
            }
        };
    }
}
```
