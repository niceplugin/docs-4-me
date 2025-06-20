# Eloquent: 시작하기









































## 소개 {#introduction}

Laravel에는 데이터베이스와의 상호작용을 즐겁게 만들어주는 객체-관계 매퍼(ORM)인 Eloquent가 포함되어 있습니다. Eloquent를 사용할 때, 각 데이터베이스 테이블에는 해당 테이블과 상호작용하는 "모델"이 대응됩니다. Eloquent 모델을 통해 데이터베이스 테이블에서 레코드를 조회할 뿐만 아니라, 테이블에 레코드를 삽입, 수정, 삭제할 수 있습니다.

> [!NOTE]
> 시작하기 전에, 애플리케이션의 `config/database.php` 설정 파일에서 데이터베이스 연결을 반드시 구성하세요. 데이터베이스 구성에 대한 자세한 내용은 [데이터베이스 구성 문서](/laravel/12.x/database#configuration)를 참고하세요.


## 모델 클래스 생성 {#generating-model-classes}

먼저, Eloquent 모델을 생성해봅시다. 모델은 일반적으로 `app\Models` 디렉터리에 위치하며, `Illuminate\Database\Eloquent\Model` 클래스를 확장합니다. 새로운 모델을 생성하려면 `make:model` [Artisan 명령어](/laravel/12.x/artisan)를 사용할 수 있습니다:

```shell
php artisan make:model Flight
```

모델을 생성할 때 [데이터베이스 마이그레이션](/laravel/12.x/migrations)도 함께 생성하고 싶다면, `--migration` 또는 `-m` 옵션을 사용할 수 있습니다:

```shell
php artisan make:model Flight --migration
```

모델을 생성할 때 팩토리, 시더, 정책, 컨트롤러, 폼 요청 등 다양한 종류의 클래스를 함께 생성할 수 있습니다. 또한, 이러한 옵션을 조합하여 여러 클래스를 한 번에 생성할 수도 있습니다:

```shell
# 모델과 FlightFactory 클래스 생성...
php artisan make:model Flight --factory
php artisan make:model Flight -f

# 모델과 FlightSeeder 클래스 생성...
php artisan make:model Flight --seed
php artisan make:model Flight -s

# 모델과 FlightController 클래스 생성...
php artisan make:model Flight --controller
php artisan make:model Flight -c

# 모델, FlightController 리소스 클래스, 폼 요청 클래스 생성...
php artisan make:model Flight --controller --resource --requests
php artisan make:model Flight -crR

# 모델과 FlightPolicy 클래스 생성...
php artisan make:model Flight --policy

# 모델, 마이그레이션, 팩토리, 시더, 컨트롤러 생성...
php artisan make:model Flight -mfsc

# 모델, 마이그레이션, 팩토리, 시더, 정책, 컨트롤러, 폼 요청을 한 번에 생성하는 단축키...
php artisan make:model Flight --all
php artisan make:model Flight -a

# 피벗 모델 생성...
php artisan make:model Member --pivot
php artisan make:model Member -p
```


#### 모델 검사 {#inspecting-models}

때로는 코드만 훑어봐서는 모델의 모든 속성과 관계를 파악하기 어려울 수 있습니다. 이럴 때는 `model:show` Artisan 명령어를 사용해 모델의 모든 속성과 관계를 한눈에 확인할 수 있습니다:

```shell
php artisan model:show Flight
```


## Eloquent 모델 규칙 {#eloquent-model-conventions}

`make:model` 명령어로 생성된 모델은 `app/Models` 디렉터리에 위치합니다. 기본적인 모델 클래스를 살펴보고, Eloquent의 주요 규칙 몇 가지를 알아봅시다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    // ...
}
```


### 테이블 이름 {#table-names}

위 예제를 보면, Eloquent에 `Flight` 모델이 어떤 데이터베이스 테이블과 연결되는지 명시하지 않았다는 것을 알 수 있습니다. 관례상, 클래스의 "스네이크 케이스" 복수형 이름이 테이블 이름으로 사용됩니다. 즉, `Flight` 모델은 `flights` 테이블에, `AirTrafficController` 모델은 `air_traffic_controllers` 테이블에 레코드를 저장한다고 Eloquent는 가정합니다.

모델에 대응되는 데이터베이스 테이블이 이 규칙을 따르지 않는 경우, 모델의 `table` 속성을 직접 지정할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 모델과 연결된 테이블
     *
     * @var string
     */
    protected $table = 'my_flights';
}
```


### 기본 키 {#primary-keys}

Eloquent는 각 모델에 대응되는 데이터베이스 테이블에 `id`라는 기본 키 컬럼이 있다고 가정합니다. 필요하다면, 모델의 보호된 `$primaryKey` 속성에 다른 컬럼명을 지정할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 테이블과 연결된 기본 키
     *
     * @var string
     */
    protected $primaryKey = 'flight_id';
}
```

또한, Eloquent는 기본 키가 자동 증가하는 정수 값이라고 가정하여, 기본 키를 자동으로 정수로 변환합니다. 자동 증가하지 않거나 숫자가 아닌 기본 키를 사용하려면, 모델의 공개 속성 `$incrementing`을 `false`로 설정해야 합니다:

```php
<?php

class Flight extends Model
{
    /**
     * 모델의 ID가 자동 증가하는지 여부
     *
     * @var bool
     */
    public $incrementing = false;
}
```

모델의 기본 키가 정수가 아니라면, 보호된 `$keyType` 속성을 `string` 값으로 지정해야 합니다:

```php
<?php

class Flight extends Model
{
    /**
     * 기본 키 ID의 데이터 타입
     *
     * @var string
     */
    protected $keyType = 'string';
}
```


#### "복합" 기본 키 {#composite-primary-keys}

Eloquent는 각 모델에 최소 하나의 고유하게 식별 가능한 "ID"가 있어야 하며, 이를 기본 키로 사용합니다. "복합" 기본 키는 Eloquent 모델에서 지원되지 않습니다. 하지만, 테이블의 고유한 기본 키 외에 다중 컬럼으로 구성된 고유 인덱스를 추가하는 것은 자유롭게 할 수 있습니다.


### UUID 및 ULID 키 {#uuid-and-ulid-keys}

Eloquent 모델의 기본 키로 자동 증가 정수 대신 UUID를 사용할 수도 있습니다. UUID는 36자 길이의 전역적으로 고유한 영숫자 식별자입니다.

모델이 자동 증가 정수 키 대신 UUID 키를 사용하도록 하려면, 모델에 `Illuminate\Database\Eloquent\Concerns\HasUuids` 트레이트를 사용하세요. 물론, 모델에 [UUID에 해당하는 기본 키 컬럼](/laravel/12.x/migrations#column-method-uuid)이 있어야 합니다:

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasUuids;

    // ...
}

$article = Article::create(['title' => 'Traveling to Europe']);

$article->id; // "8f8e8478-9035-4d23-b9a7-62f4d2612ce5"
```

기본적으로 `HasUuids` 트레이트는 모델에 ["정렬 가능한" UUID](/laravel/12.x/strings#method-str-ordered-uuid)를 생성합니다. 이러한 UUID는 사전순 정렬이 가능해 인덱스가 적용된 데이터베이스 저장에 더 효율적입니다.

특정 모델에 대해 UUID 생성 방식을 오버라이드하려면, 모델에 `newUniqueId` 메서드를 정의하면 됩니다. 또한, 어떤 컬럼에 UUID를 부여할지 지정하려면, 모델에 `uniqueIds` 메서드를 정의하세요:

```php
use Ramsey\Uuid\Uuid;

/**
 * 모델에 대한 새로운 UUID 생성
 */
public function newUniqueId(): string
{
    return (string) Uuid::uuid4();
}

/**
 * 고유 식별자를 받아야 하는 컬럼 반환
 *
 * @return array<int, string>
 */
public function uniqueIds(): array
{
    return ['id', 'discount_code'];
}
```

원한다면 UUID 대신 "ULID"를 사용할 수도 있습니다. ULID는 UUID와 유사하지만 26자 길이입니다. 정렬 가능한 UUID처럼, ULID도 효율적인 데이터베이스 인덱싱을 위해 사전순 정렬이 가능합니다. ULID를 사용하려면, 모델에 `Illuminate\Database\Eloquent\Concerns\HasUlids` 트레이트를 사용하세요. 또한, 모델에 [ULID에 해당하는 기본 키 컬럼](/laravel/12.x/migrations#column-method-ulid)이 있어야 합니다:

```php
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasUlids;

    // ...
}

$article = Article::create(['title' => 'Traveling to Asia']);

$article->id; // "01gd4d3tgrrfqeda94gdbtdk5c"
```


### 타임스탬프 {#timestamps}

기본적으로 Eloquent는 모델에 대응되는 데이터베이스 테이블에 `created_at`과 `updated_at` 컬럼이 존재한다고 가정합니다. Eloquent는 모델이 생성되거나 수정될 때 이 컬럼의 값을 자동으로 설정합니다. 이러한 컬럼을 Eloquent가 자동으로 관리하지 않도록 하려면, 모델의 `$timestamps` 속성을 `false`로 지정하세요:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 모델이 타임스탬프를 사용할지 여부
     *
     * @var bool
     */
    public $timestamps = false;
}
```

모델의 타임스탬프 포맷을 커스터마이즈하려면, 모델의 `$dateFormat` 속성을 설정하세요. 이 속성은 데이터베이스에 날짜 속성이 저장되는 방식과, 모델이 배열 또는 JSON으로 직렬화될 때의 포맷을 결정합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 모델 날짜 컬럼의 저장 포맷
     *
     * @var string
     */
    protected $dateFormat = 'U';
}
```

타임스탬프를 저장하는 컬럼의 이름을 커스터마이즈하려면, 모델에 `CREATED_AT` 및 `UPDATED_AT` 상수를 정의하세요:

```php
<?php

class Flight extends Model
{
    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'updated_date';
}
```

모델의 `updated_at` 타임스탬프가 수정되지 않도록 모델 작업을 수행하려면, `withoutTimestamps` 메서드에 클로저를 전달하여 해당 클로저 내에서 작업하세요:

```php
Model::withoutTimestamps(fn () => $post->increment('reads'));
```


### 데이터베이스 연결 {#database-connections}

기본적으로 모든 Eloquent 모델은 애플리케이션에 설정된 기본 데이터베이스 연결을 사용합니다. 특정 모델에서 사용할 데이터베이스 연결을 지정하려면, 모델의 `$connection` 속성을 정의하세요:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 모델이 사용할 데이터베이스 연결
     *
     * @var string
     */
    protected $connection = 'mysql';
}
```


### 기본 속성 값 {#default-attribute-values}

기본적으로 새로 인스턴스화된 모델 인스턴스에는 아무런 속성 값도 포함되어 있지 않습니다. 모델의 일부 속성에 대한 기본값을 정의하려면, 모델의 `$attributes` 속성을 정의하세요. `$attributes` 배열에 지정된 값은 데이터베이스에서 읽은 것과 동일한 "저장 가능한" 원시 포맷이어야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 속성의 모델 기본값
     *
     * @var array
     */
    protected $attributes = [
        'options' => '[]',
        'delayed' => false,
    ];
}
```


### Eloquent 엄격성 설정 {#configuring-eloquent-strictness}

Laravel은 다양한 상황에서 Eloquent의 동작과 "엄격성"을 설정할 수 있는 여러 메서드를 제공합니다.

먼저, `preventLazyLoading` 메서드는 지연 로딩을 방지할지 여부를 나타내는 선택적 불리언 인수를 받습니다. 예를 들어, 프로덕션 환경에서는 지연 로딩이 발생해도 정상 동작하도록 하고, 비프로덕션 환경에서만 지연 로딩을 비활성화할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider`의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

/**
 * 애플리케이션 서비스 부트스트랩
 */
public function boot(): void
{
    Model::preventLazyLoading(! $this->app->isProduction());
}
```

또한, `preventSilentlyDiscardingAttributes` 메서드를 호출하여 할당할 수 없는 속성을 채우려고 할 때 예외를 발생시키도록 Laravel에 지시할 수 있습니다. 이는 모델의 `fillable` 배열에 추가되지 않은 속성을 설정하려고 할 때, 로컬 개발 중에 예기치 않은 오류를 방지하는 데 도움이 됩니다:

```php
Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());
```


## 모델 조회 {#retrieving-models}

모델과 [연관된 데이터베이스 테이블](/laravel/12.x/migrations#generating-migrations)을 생성했다면, 이제 데이터베이스에서 데이터를 조회할 준비가 된 것입니다. 각 Eloquent 모델은 강력한 [쿼리 빌더](/laravel/12.x/queries)로 생각할 수 있으며, 모델과 연관된 데이터베이스 테이블을 유연하게 쿼리할 수 있습니다. 모델의 `all` 메서드는 모델과 연관된 데이터베이스 테이블의 모든 레코드를 조회합니다:

```php
use App\Models\Flight;

foreach (Flight::all() as $flight) {
    echo $flight->name;
}
```


#### 쿼리 빌드하기 {#building-queries}

Eloquent의 `all` 메서드는 모델 테이블의 모든 결과를 반환합니다. 하지만, 각 Eloquent 모델은 [쿼리 빌더](/laravel/12.x/queries)이므로, 쿼리에 추가 제약 조건을 더한 후 `get` 메서드를 호출하여 결과를 조회할 수 있습니다:

```php
$flights = Flight::where('active', 1)
    ->orderBy('name')
    ->take(10)
    ->get();
```

> [!NOTE]
> Eloquent 모델은 쿼리 빌더이므로, Laravel의 [쿼리 빌더](/laravel/12.x/queries)가 제공하는 모든 메서드를 검토해보세요. Eloquent 쿼리를 작성할 때 이 메서드들을 자유롭게 사용할 수 있습니다.


#### 모델 새로고침 {#refreshing-models}

이미 데이터베이스에서 조회한 Eloquent 모델 인스턴스가 있다면, `fresh` 및 `refresh` 메서드를 사용해 모델을 "새로고침"할 수 있습니다. `fresh` 메서드는 데이터베이스에서 모델을 다시 조회하며, 기존 모델 인스턴스에는 영향을 주지 않습니다:

```php
$flight = Flight::where('number', 'FR 900')->first();

$freshFlight = $flight->fresh();
```

`refresh` 메서드는 기존 모델을 데이터베이스의 최신 데이터로 다시 하이드레이트합니다. 또한, 로드된 모든 관계도 새로고침됩니다:

```php
$flight = Flight::where('number', 'FR 900')->first();

$flight->number = 'FR 456';

$flight->refresh();

$flight->number; // "FR 900"
```


### 컬렉션 {#collections}

앞서 살펴본 것처럼, Eloquent의 `all` 및 `get` 메서드는 데이터베이스에서 여러 레코드를 조회합니다. 하지만, 이 메서드들은 일반 PHP 배열이 아닌 `Illuminate\Database\Eloquent\Collection` 인스턴스를 반환합니다.

Eloquent의 `Collection` 클래스는 Laravel의 기본 `Illuminate\Support\Collection` 클래스를 확장하며, 데이터 컬렉션을 다루기 위한 [다양한 유용한 메서드](/laravel/12.x/collections#available-methods)를 제공합니다. 예를 들어, `reject` 메서드를 사용해 클로저의 결과에 따라 컬렉션에서 모델을 제거할 수 있습니다:

```php
$flights = Flight::where('destination', 'Paris')->get();

$flights = $flights->reject(function (Flight $flight) {
    return $flight->cancelled;
});
```

Laravel의 기본 컬렉션 클래스가 제공하는 메서드 외에도, Eloquent 컬렉션 클래스는 [Eloquent 모델 컬렉션을 위한 몇 가지 추가 메서드](/laravel/12.x/eloquent-collections#available-methods)를 제공합니다.

Laravel의 모든 컬렉션은 PHP의 반복자 인터페이스를 구현하므로, 배열처럼 컬렉션을 반복할 수 있습니다:

```php
foreach ($flights as $flight) {
    echo $flight->name;
}
```


### 결과 청크 처리 {#chunking-results}

`all` 또는 `get` 메서드를 통해 수만 개의 Eloquent 레코드를 한 번에 로드하려고 하면, 애플리케이션의 메모리가 부족해질 수 있습니다. 이런 경우에는 `chunk` 메서드를 사용해 많은 수의 모델을 더 효율적으로 처리할 수 있습니다.

`chunk` 메서드는 Eloquent 모델의 일부만을 조회하여, 이를 클로저에 전달해 처리합니다. 한 번에 현재 청크만 조회하므로, 많은 모델을 다룰 때 메모리 사용량이 크게 줄어듭니다:

```php
use App\Models\Flight;
use Illuminate\Database\Eloquent\Collection;

Flight::chunk(200, function (Collection $flights) {
    foreach ($flights as $flight) {
        // ...
    }
});
```

`chunk` 메서드의 첫 번째 인수는 "청크"당 조회할 레코드 수입니다. 두 번째 인수로 전달된 클로저는 데이터베이스에서 조회된 각 청크마다 호출됩니다. 각 청크마다 데이터베이스 쿼리가 실행되어 레코드가 클로저에 전달됩니다.

조회 결과를 반복하면서 해당 컬럼을 업데이트할 경우에는 `chunk` 메서드 대신 `chunkById` 메서드를 사용해야 합니다. 그렇지 않으면 예기치 않은 결과가 발생할 수 있습니다. 내부적으로 `chunkById` 메서드는 이전 청크의 마지막 모델보다 `id` 컬럼 값이 큰 모델만을 항상 조회합니다:

```php
Flight::where('departed', true)
    ->chunkById(200, function (Collection $flights) {
        $flights->each->update(['departed' => false]);
    }, column: 'id');
```

`chunkById` 및 `lazyById` 메서드는 쿼리에 자체적으로 "where" 조건을 추가하므로, 일반적으로 [논리적 그룹화](/laravel/12.x/queries#logical-grouping)를 위해 클로저 내에서 조건을 묶어야 합니다:

```php
Flight::where(function ($query) {
    $query->where('delayed', true)->orWhere('cancelled', true);
})->chunkById(200, function (Collection $flights) {
    $flights->each->update([
        'departed' => false,
        'cancelled' => true
    ]);
}, column: 'id');
```


### Lazy 컬렉션을 이용한 청크 처리 {#chunking-using-lazy-collections}

`lazy` 메서드는 [chunk 메서드](#chunking-results)와 유사하게, 내부적으로 쿼리를 청크 단위로 실행합니다. 하지만, 각 청크를 콜백에 바로 전달하는 대신, `lazy` 메서드는 Eloquent 모델의 평탄화된 [LazyCollection](/laravel/12.x/collections#lazy-collections)을 반환하여 결과를 하나의 스트림처럼 다룰 수 있습니다:

```php
use App\Models\Flight;

foreach (Flight::lazy() as $flight) {
    // ...
}
```

조회 결과를 반복하면서 해당 컬럼을 업데이트할 경우에는 `lazy` 메서드 대신 `lazyById` 메서드를 사용해야 합니다. 내부적으로 `lazyById` 메서드는 이전 청크의 마지막 모델보다 `id` 컬럼 값이 큰 모델만을 항상 조회합니다:

```php
Flight::where('departed', true)
    ->lazyById(200, column: 'id')
    ->each->update(['departed' => false]);
```

`lazyByIdDesc` 메서드를 사용하면 `id`의 내림차순 기준으로 결과를 필터링할 수 있습니다.


### 커서 {#cursors}

`lazy` 메서드와 유사하게, `cursor` 메서드를 사용하면 수만 개의 Eloquent 모델 레코드를 반복할 때 애플리케이션의 메모리 사용량을 크게 줄일 수 있습니다.

`cursor` 메서드는 단일 데이터베이스 쿼리만 실행하지만, 실제로 반복할 때까지 개별 Eloquent 모델이 하이드레이트되지 않습니다. 따라서 반복 중에는 한 번에 하나의 Eloquent 모델만 메모리에 유지됩니다.

> [!WARNING]
> `cursor` 메서드는 한 번에 하나의 Eloquent 모델만 메모리에 유지하므로, 관계를 eager load할 수 없습니다. 관계를 eager load해야 한다면 [lazy 메서드](#chunking-using-lazy-collections)를 사용하세요.

내부적으로 `cursor` 메서드는 PHP [제너레이터](https://www.php.net/manual/en/language.generators.overview.php)를 사용해 이 기능을 구현합니다:

```php
use App\Models\Flight;

foreach (Flight::where('destination', 'Zurich')->cursor() as $flight) {
    // ...
}
```

`cursor`는 `Illuminate\Support\LazyCollection` 인스턴스를 반환합니다. [Lazy 컬렉션](/laravel/12.x/collections#lazy-collections)을 사용하면, 일반 Laravel 컬렉션에서 제공하는 많은 메서드를 한 번에 하나의 모델만 메모리에 올려두고 사용할 수 있습니다:

```php
use App\Models\User;

$users = User::cursor()->filter(function (User $user) {
    return $user->id > 500;
});

foreach ($users as $user) {
    echo $user->id;
}
```

`cursor` 메서드는 한 번에 하나의 Eloquent 모델만 메모리에 유지하므로 일반 쿼리보다 훨씬 적은 메모리를 사용하지만, 결국에는 메모리가 부족해질 수 있습니다. 이는 [PHP의 PDO 드라이버가 내부적으로 모든 원시 쿼리 결과를 버퍼에 캐싱하기 때문](https://www.php.net/manual/en/mysqlinfo.concepts.buffering.php)입니다. 매우 많은 수의 Eloquent 레코드를 다룬다면, [lazy 메서드](#chunking-using-lazy-collections)를 사용하는 것이 좋습니다.


### 고급 서브쿼리 {#advanced-subqueries}


#### 서브쿼리 Select {#subquery-selects}

Eloquent는 고급 서브쿼리 지원도 제공하여, 단일 쿼리로 연관된 테이블에서 정보를 가져올 수 있습니다. 예를 들어, `destinations` 테이블과 목적지로 가는 `flights` 테이블이 있다고 가정해봅시다. `flights` 테이블에는 비행기가 목적지에 도착한 시간을 나타내는 `arrived_at` 컬럼이 있습니다.

쿼리 빌더의 `select` 및 `addSelect` 메서드에서 제공하는 서브쿼리 기능을 사용하면, 모든 `destinations`와 해당 목적지에 가장 최근에 도착한 비행기의 이름을 단일 쿼리로 조회할 수 있습니다:

```php
use App\Models\Destination;
use App\Models\Flight;

return Destination::addSelect(['last_flight' => Flight::select('name')
    ->whereColumn('destination_id', 'destinations.id')
    ->orderByDesc('arrived_at')
    ->limit(1)
])->get();
```


#### 서브쿼리 정렬 {#subquery-ordering}

또한, 쿼리 빌더의 `orderBy` 함수는 서브쿼리를 지원합니다. 앞선 예시를 계속 사용하면, 마지막 비행기가 도착한 시간을 기준으로 모든 목적지를 정렬할 수 있습니다. 이 역시 단일 데이터베이스 쿼리로 처리됩니다:

```php
return Destination::orderByDesc(
    Flight::select('arrived_at')
        ->whereColumn('destination_id', 'destinations.id')
        ->orderByDesc('arrived_at')
        ->limit(1)
)->get();
```


## 단일 모델/집계 조회 {#retrieving-single-models}

주어진 쿼리와 일치하는 모든 레코드를 조회하는 것 외에도, `find`, `first`, `firstWhere` 메서드를 사용해 단일 레코드를 조회할 수 있습니다. 이 메서드들은 모델 컬렉션이 아닌 단일 모델 인스턴스를 반환합니다:

```php
use App\Models\Flight;

// 기본 키로 모델 조회...
$flight = Flight::find(1);

// 쿼리 조건에 일치하는 첫 번째 모델 조회...
$flight = Flight::where('active', 1)->first();

// 쿼리 조건에 일치하는 첫 번째 모델을 조회하는 대안...
$flight = Flight::firstWhere('active', 1);
```

결과가 없을 때 다른 동작을 하고 싶을 때도 있습니다. `findOr` 및 `firstOr` 메서드는 단일 모델 인스턴스를 반환하거나, 결과가 없으면 주어진 클로저를 실행합니다. 클로저에서 반환된 값이 메서드의 결과로 간주됩니다:

```php
$flight = Flight::findOr(1, function () {
    // ...
});

$flight = Flight::where('legs', '>', 3)->firstOr(function () {
    // ...
});
```


#### Not Found 예외 {#not-found-exceptions}

모델을 찾지 못했을 때 예외를 발생시키고 싶을 때가 있습니다. 이는 라우트나 컨트롤러에서 특히 유용합니다. `findOrFail` 및 `firstOrFail` 메서드는 쿼리의 첫 번째 결과를 조회하지만, 결과가 없으면 `Illuminate\Database\Eloquent\ModelNotFoundException` 예외를 발생시킵니다:

```php
$flight = Flight::findOrFail(1);

$flight = Flight::where('legs', '>', 3)->firstOrFail();
```

`ModelNotFoundException`이 잡히지 않으면, 404 HTTP 응답이 클라이언트에 자동으로 반환됩니다:

```php
use App\Models\Flight;

Route::get('/api/flights/{id}', function (string $id) {
    return Flight::findOrFail($id);
});
```


### 모델 조회 또는 생성 {#retrieving-or-creating-models}

`firstOrCreate` 메서드는 주어진 컬럼/값 쌍을 사용해 데이터베이스 레코드를 찾으려고 시도합니다. 데이터베이스에서 모델을 찾을 수 없으면, 첫 번째 배열 인수와 선택적 두 번째 배열 인수를 병합한 속성으로 레코드를 삽입합니다:

`firstOrNew` 메서드는 `firstOrCreate`와 유사하게 주어진 속성과 일치하는 레코드를 데이터베이스에서 찾으려고 시도합니다. 하지만, 모델을 찾지 못하면 새 모델 인스턴스를 반환합니다. `firstOrNew`로 반환된 모델은 아직 데이터베이스에 저장되지 않았으므로, 직접 `save` 메서드를 호출해야 합니다:

```php
use App\Models\Flight;

// 이름으로 비행기 조회, 없으면 생성...
$flight = Flight::firstOrCreate([
    'name' => 'London to Paris'
]);

// 이름으로 비행기 조회, 없으면 이름, delayed, arrival_time 속성으로 생성...
$flight = Flight::firstOrCreate(
    ['name' => 'London to Paris'],
    ['delayed' => 1, 'arrival_time' => '11:30']
);

// 이름으로 비행기 조회, 없으면 새 Flight 인스턴스 생성...
$flight = Flight::firstOrNew([
    'name' => 'London to Paris'
]);

// 이름으로 비행기 조회, 없으면 이름, delayed, arrival_time 속성으로 인스턴스화...
$flight = Flight::firstOrNew(
    ['name' => 'Tokyo to Sydney'],
    ['delayed' => 1, 'arrival_time' => '11:30']
);
```


### 집계 조회 {#retrieving-aggregates}

Eloquent 모델을 사용할 때, Laravel [쿼리 빌더](/laravel/12.x/queries)가 제공하는 `count`, `sum`, `max` 등 [집계 메서드](/laravel/12.x/queries#aggregates)도 사용할 수 있습니다. 이 메서드들은 Eloquent 모델 인스턴스가 아닌 스칼라 값을 반환합니다:

```php
$count = Flight::where('active', 1)->count();

$max = Flight::where('active', 1)->max('price');
```


## 모델 삽입 및 수정 {#inserting-and-updating-models}


### 삽입 {#inserts}

물론, Eloquent를 사용할 때는 데이터베이스에서 모델을 조회하는 것뿐만 아니라, 새 레코드를 삽입해야 할 때도 있습니다. Eloquent는 이를 간단하게 처리할 수 있도록 해줍니다. 데이터베이스에 새 레코드를 삽입하려면, 새 모델 인스턴스를 생성하고 속성을 설정한 후, 모델 인스턴스의 `save` 메서드를 호출하세요:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    /**
     * 데이터베이스에 새 비행기 저장
     */
    public function store(Request $request): RedirectResponse
    {
        // 요청 유효성 검사...

        $flight = new Flight;

        $flight->name = $request->name;

        $flight->save();

        return redirect('/flights');
    }
}
```

이 예제에서는 들어오는 HTTP 요청의 `name` 필드를 `App\Models\Flight` 모델 인스턴스의 `name` 속성에 할당합니다. `save` 메서드를 호출하면 데이터베이스에 레코드가 삽입됩니다. `save` 메서드가 호출될 때 모델의 `created_at`과 `updated_at` 타임스탬프가 자동으로 설정되므로, 수동으로 설정할 필요가 없습니다.

또는, `create` 메서드를 사용해 한 줄의 PHP 코드로 새 모델을 "저장"할 수 있습니다. `create` 메서드는 삽입된 모델 인스턴스를 반환합니다:

```php
use App\Models\Flight;

$flight = Flight::create([
    'name' => 'London to Paris',
]);
```

하지만, `create` 메서드를 사용하기 전에 모델 클래스에 `fillable` 또는 `guarded` 속성을 지정해야 합니다. 모든 Eloquent 모델은 기본적으로 대량 할당 취약점으로부터 보호되기 때문입니다. 대량 할당에 대해 더 알고 싶다면 [대량 할당 문서](#mass-assignment)를 참고하세요.


### 수정 {#updates}

`save` 메서드는 이미 데이터베이스에 존재하는 모델을 수정할 때도 사용할 수 있습니다. 모델을 수정하려면, 먼저 모델을 조회한 후 수정할 속성을 설정하고, 모델의 `save` 메서드를 호출하면 됩니다. 역시 `updated_at` 타임스탬프는 자동으로 갱신되므로, 수동으로 값을 설정할 필요가 없습니다:

```php
use App\Models\Flight;

$flight = Flight::find(1);

$flight->name = 'Paris to London';

$flight->save();
```

기존 모델을 수정하거나, 일치하는 모델이 없으면 새 모델을 생성해야 할 때도 있습니다. `firstOrCreate` 메서드처럼, `updateOrCreate` 메서드는 모델을 저장하므로, 별도로 `save` 메서드를 호출할 필요가 없습니다.

아래 예제에서는, `departure`가 `Oakland`이고 `destination`이 `San Diego`인 비행기가 있으면 `price`와 `discounted` 컬럼이 수정됩니다. 해당 비행기가 없으면, 두 배열 인수를 병합한 속성으로 새 비행기가 생성됩니다:

```php
$flight = Flight::updateOrCreate(
    ['departure' => 'Oakland', 'destination' => 'San Diego'],
    ['price' => 99, 'discounted' => 1]
);
```


#### 대량 수정 {#mass-updates}

주어진 쿼리와 일치하는 모델에 대해 대량으로 수정 작업을 수행할 수도 있습니다. 이 예제에서는 `active`이고 `destination`이 `San Diego`인 모든 비행기를 지연 상태로 표시합니다:

```php
Flight::where('active', 1)
    ->where('destination', 'San Diego')
    ->update(['delayed' => 1]);
```

`update` 메서드는 수정할 컬럼과 값의 쌍으로 이루어진 배열을 인수로 받습니다. `update` 메서드는 영향을 받은 행의 수를 반환합니다.

> [!WARNING]
> Eloquent를 통한 대량 수정 시, 수정된 모델에 대해 `saving`, `saved`, `updating`, `updated` 모델 이벤트가 발생하지 않습니다. 이는 대량 수정 시 실제로 모델이 조회되지 않기 때문입니다.


#### 속성 변경 사항 확인 {#examining-attribute-changes}

Eloquent는 모델의 내부 상태를 확인하고, 모델이 처음 조회된 이후 속성이 어떻게 변경되었는지 확인할 수 있는 `isDirty`, `isClean`, `wasChanged` 메서드를 제공합니다.

`isDirty` 메서드는 모델의 속성 중 하나라도 변경되었는지 확인합니다. 특정 속성명이나 속성명 배열을 전달해 해당 속성이 "dirty" 상태인지 확인할 수 있습니다. `isClean` 메서드는 속성이 조회된 이후 변경되지 않았는지 확인합니다. 이 메서드 역시 선택적으로 속성 인수를 받을 수 있습니다:

```php
use App\Models\User;

$user = User::create([
    'first_name' => 'Taylor',
    'last_name' => 'Otwell',
    'title' => 'Developer',
]);

$user->title = 'Painter';

$user->isDirty(); // true
$user->isDirty('title'); // true
$user->isDirty('first_name'); // false
$user->isDirty(['first_name', 'title']); // true

$user->isClean(); // false
$user->isClean('title'); // false
$user->isClean('first_name'); // true
$user->isClean(['first_name', 'title']); // false

$user->save();

$user->isDirty(); // false
$user->isClean(); // true
```

`wasChanged` 메서드는 현재 요청 사이클 내에서 마지막으로 모델이 저장될 때 속성 중 하나라도 변경되었는지 확인합니다. 필요하다면 특정 속성명을 전달해 해당 속성이 변경되었는지 확인할 수 있습니다:

```php
$user = User::create([
    'first_name' => 'Taylor',
    'last_name' => 'Otwell',
    'title' => 'Developer',
]);

$user->title = 'Painter';

$user->save();

$user->wasChanged(); // true
$user->wasChanged('title'); // true
$user->wasChanged(['title', 'slug']); // true
$user->wasChanged('first_name'); // false
$user->wasChanged(['first_name', 'title']); // true
```

`getOriginal` 메서드는 모델이 조회된 이후 변경 사항과 상관없이, 모델의 원래 속성 값을 포함하는 배열을 반환합니다. 필요하다면 특정 속성명을 전달해 해당 속성의 원래 값을 얻을 수 있습니다:

```php
$user = User::find(1);

$user->name; // John
$user->email; // john@example.com

$user->name = 'Jack';
$user->name; // Jack

$user->getOriginal('name'); // John
$user->getOriginal(); // 원래 속성의 배열...
```

`getChanges` 메서드는 모델이 마지막으로 저장될 때 변경된 속성을 포함하는 배열을 반환하고, `getPrevious` 메서드는 마지막 저장 전의 원래 속성 값을 포함하는 배열을 반환합니다:

```php
$user = User::find(1);

$user->name; // John
$user->email; // john@example.com

$user->update([
    'name' => 'Jack',
    'email' => 'jack@example.com',
]);

$user->getChanges();

/*
    [
        'name' => 'Jack',
        'email' => 'jack@example.com',
    ]
*/

$user->getPrevious();

/*
    [
        'name' => 'John',
        'email' => 'john@example.com',
    ]
*/
```


### 대량 할당 {#mass-assignment}

`create` 메서드를 사용해 한 줄의 PHP 코드로 새 모델을 "저장"할 수 있습니다. 이 메서드는 삽입된 모델 인스턴스를 반환합니다:

```php
use App\Models\Flight;

$flight = Flight::create([
    'name' => 'London to Paris',
]);
```

하지만, `create` 메서드를 사용하기 전에 모델 클래스에 `fillable` 또는 `guarded` 속성을 지정해야 합니다. 모든 Eloquent 모델은 기본적으로 대량 할당 취약점으로부터 보호됩니다.

대량 할당 취약점은 사용자가 예기치 않은 HTTP 요청 필드를 전달하고, 그 필드가 데이터베이스의 컬럼을 변경할 때 발생합니다. 예를 들어, 악의적인 사용자가 HTTP 요청을 통해 `is_admin` 파라미터를 전달하고, 이 값이 모델의 `create` 메서드에 전달되어 사용자가 관리자 권한을 얻을 수 있습니다.

따라서, 대량 할당이 가능한 모델 속성을 `$fillable` 속성에 정의해야 합니다. 예를 들어, `Flight` 모델의 `name` 속성을 대량 할당 가능하게 하려면 다음과 같이 작성합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    /**
     * 대량 할당 가능한 속성
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];
}
```

대량 할당 가능한 속성을 지정했다면, `create` 메서드를 사용해 데이터베이스에 새 레코드를 삽입할 수 있습니다. `create` 메서드는 새로 생성된 모델 인스턴스를 반환합니다:

```php
$flight = Flight::create(['name' => 'London to Paris']);
```

이미 모델 인스턴스가 있다면, `fill` 메서드를 사용해 속성 배열로 값을 채울 수 있습니다:

```php
$flight->fill(['name' => 'Amsterdam to Frankfurt']);
```


#### 대량 할당과 JSON 컬럼 {#mass-assignment-json-columns}

JSON 컬럼을 할당할 때, 각 컬럼의 대량 할당 키를 모델의 `$fillable` 배열에 명시해야 합니다. 보안을 위해, Laravel은 `guarded` 속성을 사용할 때 중첩된 JSON 속성의 업데이트를 지원하지 않습니다:

```php
/**
 * 대량 할당 가능한 속성
 *
 * @var array<int, string>
 */
protected $fillable = [
    'options->enabled',
];
```


#### 대량 할당 허용 {#allowing-mass-assignment}

모든 속성을 대량 할당 가능하게 하려면, 모델의 `$guarded` 속성을 빈 배열로 지정하면 됩니다. 모델의 보호를 해제할 경우, Eloquent의 `fill`, `create`, `update` 메서드에 전달하는 배열을 항상 신중하게 작성해야 합니다:

```php
/**
 * 대량 할당이 불가능한 속성
 *
 * @var array<string>|bool
 */
protected $guarded = [];
```


#### 대량 할당 예외 {#mass-assignment-exceptions}

기본적으로 `$fillable` 배열에 포함되지 않은 속성은 대량 할당 작업 시 조용히 무시됩니다. 프로덕션 환경에서는 이 동작이 기대되는 것이지만, 로컬 개발 중에는 모델 변경이 적용되지 않는 이유를 혼동할 수 있습니다.

원한다면, 할당할 수 없는 속성을 채우려고 할 때 예외를 발생시키도록 Laravel에 지시할 수 있습니다. 일반적으로 이 메서드는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드에서 호출해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

/**
 * 애플리케이션 서비스 부트스트랩
 */
public function boot(): void
{
    Model::preventSilentlyDiscardingAttributes($this->app->isLocal());
}
```


### Upsert {#upserts}

Eloquent의 `upsert` 메서드는 단일 원자적 작업으로 레코드를 수정하거나 생성할 수 있습니다. 첫 번째 인수는 삽입 또는 수정할 값들이고, 두 번째 인수는 테이블 내에서 레코드를 고유하게 식별하는 컬럼(들)입니다. 세 번째 인수는 데이터베이스에 이미 일치하는 레코드가 있을 때 수정할 컬럼 배열입니다. `upsert` 메서드는 모델에 타임스탬프가 활성화되어 있다면 `created_at`과 `updated_at`을 자동으로 설정합니다:

```php
Flight::upsert([
    ['departure' => 'Oakland', 'destination' => 'San Diego', 'price' => 99],
    ['departure' => 'Chicago', 'destination' => 'New York', 'price' => 150]
], uniqueBy: ['departure', 'destination'], update: ['price']);
```

> [!WARNING]
> SQL Server를 제외한 모든 데이터베이스는 `upsert` 메서드의 두 번째 인수에 지정된 컬럼이 "primary" 또는 "unique" 인덱스를 가져야 합니다. 또한, MariaDB와 MySQL 데이터베이스 드라이버는 `upsert` 메서드의 두 번째 인수를 무시하고, 항상 테이블의 "primary" 및 "unique" 인덱스를 사용해 기존 레코드를 감지합니다.


## 모델 삭제 {#deleting-models}

모델을 삭제하려면, 모델 인스턴스의 `delete` 메서드를 호출하면 됩니다:

```php
use App\Models\Flight;

$flight = Flight::find(1);

$flight->delete();
```


#### 기본 키로 기존 모델 삭제 {#deleting-an-existing-model-by-its-primary-key}

위 예제에서는 모델을 데이터베이스에서 조회한 후 `delete` 메서드를 호출했습니다. 하지만, 모델의 기본 키를 알고 있다면, `destroy` 메서드를 호출해 모델을 명시적으로 조회하지 않고도 삭제할 수 있습니다. `destroy` 메서드는 단일 기본 키, 여러 기본 키, 기본 키 배열, [컬렉션](/laravel/12.x/collections)도 인수로 받을 수 있습니다:

```php
Flight::destroy(1);

Flight::destroy(1, 2, 3);

Flight::destroy([1, 2, 3]);

Flight::destroy(collect([1, 2, 3]));
```

[소프트 삭제 모델](#soft-deleting)을 사용하는 경우, `forceDestroy` 메서드를 통해 모델을 영구적으로 삭제할 수 있습니다:

```php
Flight::forceDestroy(1);
```

> [!WARNING]
> `destroy` 메서드는 각 모델을 개별적으로 로드하고 `delete` 메서드를 호출하므로, 각 모델에 대해 `deleting` 및 `deleted` 이벤트가 올바르게 디스패치됩니다.


#### 쿼리를 이용한 모델 삭제 {#deleting-models-using-queries}

물론, Eloquent 쿼리를 작성해 쿼리 조건에 일치하는 모든 모델을 삭제할 수도 있습니다. 이 예제에서는 비활성화된 모든 비행기를 삭제합니다. 대량 삭제와 마찬가지로, 삭제된 모델에 대해 모델 이벤트가 발생하지 않습니다:

```php
$deleted = Flight::where('active', 0)->delete();
```

테이블의 모든 모델을 삭제하려면, 조건 없이 쿼리를 실행하세요:

```php
$deleted = Flight::query()->delete();
```

> [!WARNING]
> Eloquent를 통한 대량 삭제 시, 삭제된 모델에 대해 `deleting` 및 `deleted` 모델 이벤트가 발생하지 않습니다. 이는 삭제 시 실제로 모델이 조회되지 않기 때문입니다.


### 소프트 삭제 {#soft-deleting}

데이터베이스에서 실제로 레코드를 제거하는 것 외에도, Eloquent는 모델을 "소프트 삭제"할 수도 있습니다. 소프트 삭제된 모델은 데이터베이스에서 실제로 제거되지 않고, 대신 `deleted_at` 속성이 모델에 설정되어 "삭제"된 날짜와 시간을 나타냅니다. 모델에 소프트 삭제를 활성화하려면, 모델에 `Illuminate\Database\Eloquent\SoftDeletes` 트레이트를 추가하세요:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flight extends Model
{
    use SoftDeletes;
}
```

> [!NOTE]
> `SoftDeletes` 트레이트는 `deleted_at` 속성을 자동으로 `DateTime`/`Carbon` 인스턴스로 캐스팅합니다.

또한, 데이터베이스 테이블에 `deleted_at` 컬럼을 추가해야 합니다. Laravel [스키마 빌더](/laravel/12.x/migrations)는 이 컬럼을 생성하는 헬퍼 메서드를 제공합니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('flights', function (Blueprint $table) {
    $table->softDeletes();
});

Schema::table('flights', function (Blueprint $table) {
    $table->dropSoftDeletes();
});
```

이제 모델의 `delete` 메서드를 호출하면, `deleted_at` 컬럼이 현재 날짜와 시간으로 설정됩니다. 하지만, 모델의 데이터베이스 레코드는 테이블에 남아 있습니다. 소프트 삭제를 사용하는 모델을 쿼리할 때, 소프트 삭제된 모델은 모든 쿼리 결과에서 자동으로 제외됩니다.

특정 모델 인스턴스가 소프트 삭제되었는지 확인하려면, `trashed` 메서드를 사용할 수 있습니다:

```php
if ($flight->trashed()) {
    // ...
}
```


#### 소프트 삭제된 모델 복원 {#restoring-soft-deleted-models}

때로는 소프트 삭제된 모델을 "복원"하고 싶을 수 있습니다. 소프트 삭제된 모델을 복원하려면, 모델 인스턴스의 `restore` 메서드를 호출하세요. `restore` 메서드는 모델의 `deleted_at` 컬럼을 `null`로 설정합니다:

```php
$flight->restore();
```

쿼리에서 `restore` 메서드를 사용해 여러 모델을 복원할 수도 있습니다. 역시 다른 "대량" 작업과 마찬가지로, 복원된 모델에 대해 모델 이벤트가 발생하지 않습니다:

```php
Flight::withTrashed()
    ->where('airline_id', 1)
    ->restore();
```

`restore` 메서드는 [관계](/laravel/12.x/eloquent-relationships) 쿼리를 작성할 때도 사용할 수 있습니다:

```php
$flight->history()->restore();
```


#### 모델 영구 삭제 {#permanently-deleting-models}

때로는 모델을 데이터베이스에서 완전히 제거해야 할 수도 있습니다. 소프트 삭제된 모델을 데이터베이스 테이블에서 영구적으로 제거하려면, `forceDelete` 메서드를 사용하세요:

```php
$flight->forceDelete();
```

Eloquent 관계 쿼리를 작성할 때도 `forceDelete` 메서드를 사용할 수 있습니다:

```php
$flight->history()->forceDelete();
```


### 소프트 삭제된 모델 쿼리 {#querying-soft-deleted-models}


#### 소프트 삭제된 모델 포함 {#including-soft-deleted-models}

앞서 언급했듯이, 소프트 삭제된 모델은 쿼리 결과에서 자동으로 제외됩니다. 하지만, 쿼리 결과에 소프트 삭제된 모델을 포함하려면, 쿼리에서 `withTrashed` 메서드를 호출하세요:

```php
use App\Models\Flight;

$flights = Flight::withTrashed()
    ->where('account_id', 1)
    ->get();
```

`withTrashed` 메서드는 [관계](/laravel/12.x/eloquent-relationships) 쿼리를 작성할 때도 사용할 수 있습니다:

```php
$flight->history()->withTrashed()->get();
```


#### 소프트 삭제된 모델만 조회 {#retrieving-only-soft-deleted-models}

`onlyTrashed` 메서드는 **소프트 삭제된 모델만** 조회합니다:

```php
$flights = Flight::onlyTrashed()
    ->where('airline_id', 1)
    ->get();
```


## 모델 가지치기 {#pruning-models}

때로는 더 이상 필요하지 않은 모델을 주기적으로 삭제하고 싶을 수 있습니다. 이를 위해, 주기적으로 가지치기할 모델에 `Illuminate\Database\Eloquent\Prunable` 또는 `Illuminate\Database\Eloquent\MassPrunable` 트레이트를 추가할 수 있습니다. 트레이트를 모델에 추가한 후, 더 이상 필요하지 않은 모델을 조회하는 Eloquent 쿼리 빌더를 반환하는 `prunable` 메서드를 구현하세요:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class Flight extends Model
{
    use Prunable;

    /**
     * 가지치기할 모델 쿼리 반환
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```

모델을 `Prunable`로 표시할 때, 모델에 `pruning` 메서드를 정의할 수도 있습니다. 이 메서드는 모델이 삭제되기 전에 호출됩니다. 이 메서드는 모델이 영구적으로 삭제되기 전에, 저장된 파일 등 모델과 연관된 추가 리소스를 삭제하는 데 유용합니다:

```php
/**
 * 가지치기 전 모델 준비
 */
protected function pruning(): void
{
    // ...
}
```

가지치기할 모델을 구성한 후, 애플리케이션의 `routes/console.php` 파일에서 `model:prune` Artisan 명령어를 스케줄링해야 합니다. 이 명령어가 실행될 적절한 주기는 자유롭게 선택할 수 있습니다:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('model:prune')->daily();
```

내부적으로 `model:prune` 명령어는 애플리케이션의 `app/Models` 디렉터리 내에서 "Prunable" 모델을 자동으로 감지합니다. 모델이 다른 위치에 있다면, `--model` 옵션을 사용해 모델 클래스 이름을 지정할 수 있습니다:

```php
Schedule::command('model:prune', [
    '--model' => [Address::class, Flight::class],
])->daily();
```

특정 모델을 가지치기에서 제외하고, 감지된 다른 모든 모델을 가지치기하려면, `--except` 옵션을 사용할 수 있습니다:

```php
Schedule::command('model:prune', [
    '--except' => [Address::class, Flight::class],
])->daily();
```

`model:prune` 명령어를 `--pretend` 옵션과 함께 실행해 `prunable` 쿼리를 테스트할 수 있습니다. 프리텐드 모드에서는 실제로 실행하지 않고, 몇 개의 레코드가 가지치기될지 보고만 합니다:

```shell
php artisan model:prune --pretend
```

> [!WARNING]
> 소프트 삭제 모델도 가지치기 쿼리에 일치하면 영구적으로 삭제(`forceDelete`)됩니다.


#### 대량 가지치기 {#mass-pruning}

`Illuminate\Database\Eloquent\MassPrunable` 트레이트가 적용된 모델은 대량 삭제 쿼리를 사용해 데이터베이스에서 삭제됩니다. 따라서, `pruning` 메서드가 호출되지 않으며, `deleting` 및 `deleted` 모델 이벤트도 디스패치되지 않습니다. 이는 삭제 전에 실제로 모델이 조회되지 않으므로, 가지치기 과정이 훨씬 효율적이기 때문입니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\MassPrunable;

class Flight extends Model
{
    use MassPrunable;

    /**
     * 가지치기할 모델 쿼리 반환
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```


## 모델 복제 {#replicating-models}

기존 모델 인스턴스의 저장되지 않은 복사본을 `replicate` 메서드를 사용해 생성할 수 있습니다. 이 메서드는 여러 속성이 동일한 모델 인스턴스를 다룰 때 특히 유용합니다:

```php
use App\Models\Address;

$shipping = Address::create([
    'type' => 'shipping',
    'line_1' => '123 Example Street',
    'city' => 'Victorville',
    'state' => 'CA',
    'postcode' => '90001',
]);

$billing = $shipping->replicate()->fill([
    'type' => 'billing'
]);

$billing->save();
```

새 모델에 복제하지 않을 속성이 있다면, `replicate` 메서드에 배열로 전달할 수 있습니다:

```php
$flight = Flight::create([
    'destination' => 'LAX',
    'origin' => 'LHR',
    'last_flown' => '2020-03-04 11:00:00',
    'last_pilot_id' => 747,
]);

$flight = $flight->replicate([
    'last_flown',
    'last_pilot_id'
]);
```


## 쿼리 스코프 {#query-scopes}


### 글로벌 스코프 {#global-scopes}

글로벌 스코프를 사용하면, 주어진 모델의 모든 쿼리에 제약 조건을 추가할 수 있습니다. Laravel의 [소프트 삭제](#soft-deleting) 기능도 글로벌 스코프를 활용해 데이터베이스에서 "삭제되지 않은" 모델만 조회합니다. 직접 글로벌 스코프를 작성하면, 주어진 모델의 모든 쿼리에 특정 제약 조건이 항상 적용되도록 할 수 있습니다.


#### 스코프 생성 {#generating-scopes}

새 글로벌 스코프를 생성하려면, `make:scope` Artisan 명령어를 실행하세요. 생성된 스코프는 애플리케이션의 `app/Models/Scopes` 디렉터리에 위치합니다:

```shell
php artisan make:scope AncientScope
```


#### 글로벌 스코프 작성 {#writing-global-scopes}

글로벌 스코프 작성은 간단합니다. 먼저, `make:scope` 명령어로 `Illuminate\Database\Eloquent\Scope` 인터페이스를 구현하는 클래스를 생성하세요. `Scope` 인터페이스는 `apply` 메서드 하나만 구현하면 됩니다. `apply` 메서드에서 필요에 따라 쿼리에 `where` 제약 조건이나 기타 절을 추가할 수 있습니다:

```php
<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class AncientScope implements Scope
{
    /**
     * 주어진 Eloquent 쿼리 빌더에 스코프 적용
     */
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('created_at', '<', now()->subYears(2000));
    }
}
```

> [!NOTE]
> 글로벌 스코프가 쿼리의 select 절에 컬럼을 추가한다면, `select` 대신 `addSelect` 메서드를 사용해야 합니다. 그래야 쿼리의 기존 select 절이 의도치 않게 대체되는 것을 방지할 수 있습니다.


#### 글로벌 스코프 적용 {#applying-global-scopes}

모델에 글로벌 스코프를 할당하려면, 모델에 `ScopedBy` 속성을 추가하면 됩니다:

```php
<?php

namespace App\Models;

use App\Models\Scopes\AncientScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([AncientScope::class])]
class User extends Model
{
    //
}
```

또는, 모델의 `booted` 메서드를 오버라이드하고, 모델의 `addGlobalScope` 메서드를 호출해 글로벌 스코프를 수동으로 등록할 수도 있습니다. `addGlobalScope` 메서드는 스코프 인스턴스를 유일한 인수로 받습니다:

```php
<?php

namespace App\Models;

use App\Models\Scopes\AncientScope;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 모델의 "booted" 메서드
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new AncientScope);
    }
}
```

위 예제에서 `App\Models\User` 모델에 스코프를 추가하면, `User::all()` 메서드는 다음 SQL 쿼리를 실행합니다:

```sql
select * from `users` where `created_at` < 0021-02-18 00:00:00
```


#### 익명 글로벌 스코프 {#anonymous-global-scopes}

Eloquent는 클로저를 사용해 글로벌 스코프를 정의할 수도 있습니다. 이는 별도의 클래스를 만들 필요가 없는 간단한 스코프에 특히 유용합니다. 클로저로 글로벌 스코프를 정의할 때는, `addGlobalScope` 메서드의 첫 번째 인수로 스코프 이름을 직접 지정해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 모델의 "booted" 메서드
     */
    protected static function booted(): void
    {
        static::addGlobalScope('ancient', function (Builder $builder) {
            $builder->where('created_at', '<', now()->subYears(2000));
        });
    }
}
```


#### 글로벌 스코프 제거 {#removing-global-scopes}

특정 쿼리에서 글로벌 스코프를 제거하려면, `withoutGlobalScope` 메서드를 사용하세요. 이 메서드는 글로벌 스코프의 클래스명을 유일한 인수로 받습니다:

```php
User::withoutGlobalScope(AncientScope::class)->get();
```

클로저로 글로벌 스코프를 정의했다면, 글로벌 스코프에 할당한 문자열 이름을 전달해야 합니다:

```php
User::withoutGlobalScope('ancient')->get();
```

여러 개 또는 모든 글로벌 스코프를 제거하려면, `withoutGlobalScopes` 메서드를 사용할 수 있습니다:

```php
// 모든 글로벌 스코프 제거...
User::withoutGlobalScopes()->get();

// 일부 글로벌 스코프만 제거...
User::withoutGlobalScopes([
    FirstScope::class, SecondScope::class
])->get();
```


### 로컬 스코프 {#local-scopes}

로컬 스코프를 사용하면, 애플리케이션 전반에서 쉽게 재사용할 수 있는 쿼리 제약 조건 집합을 정의할 수 있습니다. 예를 들어, "인기 있는" 모든 사용자를 자주 조회해야 할 수 있습니다. 스코프를 정의하려면, Eloquent 메서드에 `Scope` 속성을 추가하세요.

스코프는 항상 동일한 쿼리 빌더 인스턴스 또는 `void`를 반환해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 쿼리를 인기 있는 사용자로만 제한하는 스코프
     */
    #[Scope]
    protected function popular(Builder $query): void
    {
        $query->where('votes', '>', 100);
    }

    /**
     * 쿼리를 활성 사용자로만 제한하는 스코프
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('active', 1);
    }
}
```


#### 로컬 스코프 사용 {#utilizing-a-local-scope}

스코프를 정의했다면, 모델을 쿼리할 때 스코프 메서드를 호출할 수 있습니다. 여러 스코프를 체이닝해서 호출할 수도 있습니다:

```php
use App\Models\User;

$users = User::popular()->active()->orderBy('created_at')->get();
```

여러 Eloquent 모델 스코프를 `or` 쿼리 연산자로 결합하려면, 올바른 [논리적 그룹화](/laravel/12.x/queries#logical-grouping)를 위해 클로저를 사용해야 할 수 있습니다:

```php
$users = User::popular()->orWhere(function (Builder $query) {
    $query->active();
})->get();
```

하지만, 이는 번거로울 수 있으므로, Laravel은 클로저 없이 스코프를 유연하게 체이닝할 수 있는 "고차" `orWhere` 메서드를 제공합니다:

```php
$users = User::popular()->orWhere->active()->get();
```


#### 동적 스코프 {#dynamic-scopes}

때로는 매개변수를 받는 스코프를 정의하고 싶을 수 있습니다. 시작하려면, 스코프 메서드 시그니처에 추가 매개변수를 추가하세요. 스코프 매개변수는 `$query` 매개변수 뒤에 정의해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 쿼리를 주어진 타입의 사용자로만 제한하는 스코프
     */
    #[Scope]
    protected function ofType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }
}
```

스코프 메서드 시그니처에 기대하는 인수를 추가했다면, 스코프를 호출할 때 인수를 전달할 수 있습니다:

```php
$users = User::ofType('admin')->get();
```


### Pending 속성 {#pending-attributes}

스코프를 사용해, 스코프를 제한하는 데 사용된 속성과 동일한 속성을 가진 모델을 생성하고 싶다면, 스코프 쿼리를 작성할 때 `withAttributes` 메서드를 사용할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * 쿼리를 초안만 포함하도록 제한하는 스코프
     */
    #[Scope]
    protected function draft(Builder $query): void
    {
        $query->withAttributes([
            'hidden' => true,
        ]);
    }
}
```

`withAttributes` 메서드는 주어진 속성으로 쿼리에 `where` 조건을 추가하고, 스코프를 통해 생성된 모델에도 해당 속성을 추가합니다:

```php
$draft = Post::draft()->create(['title' => 'In Progress']);

$draft->hidden; // true
```

`withAttributes` 메서드가 쿼리에 `where` 조건을 추가하지 않도록 하려면, `asConditions` 인수를 `false`로 설정하세요:

```php
$query->withAttributes([
    'hidden' => true,
], asConditions: false);
```


## 모델 비교 {#comparing-models}

때로는 두 모델이 "동일한"지 여부를 확인해야 할 수 있습니다. `is` 및 `isNot` 메서드를 사용하면 두 모델이 동일한 기본 키, 테이블, 데이터베이스 연결을 가지는지 빠르게 확인할 수 있습니다:

```php
if ($post->is($anotherPost)) {
    // ...
}

if ($post->isNot($anotherPost)) {
    // ...
}
```

`is` 및 `isNot` 메서드는 `belongsTo`, `hasOne`, `morphTo`, `morphOne` [관계](/laravel/12.x/eloquent-relationships)에서도 사용할 수 있습니다. 이 메서드는 쿼리를 실행하지 않고도 연관된 모델을 비교할 때 특히 유용합니다:

```php
if ($post->author()->is($user)) {
    // ...
}
```


## 이벤트 {#events}

> [!NOTE]
> Eloquent 이벤트를 클라이언트 애플리케이션에 직접 브로드캐스트하고 싶으신가요? Laravel의 [모델 이벤트 브로드캐스팅](/laravel/12.x/broadcasting#model-broadcasting)을 확인해보세요.

Eloquent 모델은 여러 이벤트를 디스패치하여, 모델의 라이프사이클에서 다음과 같은 시점에 후킹할 수 있습니다: `retrieved`, `creating`, `created`, `updating`, `updated`, `saving`, `saved`, `deleting`, `deleted`, `trashed`, `forceDeleting`, `forceDeleted`, `restoring`, `restored`, `replicating`.

`retrieved` 이벤트는 기존 모델이 데이터베이스에서 조회될 때 디스패치됩니다. 새 모델이 처음 저장될 때는 `creating` 및 `created` 이벤트가 디스패치됩니다. 기존 모델이 수정되고 `save` 메서드가 호출되면 `updating`/`updated` 이벤트가 디스패치됩니다. 모델이 생성되거나 수정될 때(속성이 변경되지 않아도) `saving`/`saved` 이벤트가 디스패치됩니다. `-ing`로 끝나는 이벤트는 모델이 영구 저장되기 전에, `-ed`로 끝나는 이벤트는 저장된 후에 디스패치됩니다.

모델 이벤트를 리스닝하려면, Eloquent 모델에 `$dispatchesEvents` 속성을 정의하세요. 이 속성은 Eloquent 모델 라이프사이클의 다양한 시점을 [이벤트 클래스](/laravel/12.x/events)와 매핑합니다. 각 모델 이벤트 클래스는 생성자를 통해 영향을 받는 모델 인스턴스를 받아야 합니다:

```php
<?php

namespace App\Models;

use App\Events\UserDeleted;
use App\Events\UserSaved;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * 모델의 이벤트 맵
     *
     * @var array<string, string>
     */
    protected $dispatchesEvents = [
        'saved' => UserSaved::class,
        'deleted' => UserDeleted::class,
    ];
}
```

Eloquent 이벤트를 정의하고 매핑한 후에는 [이벤트 리스너](/laravel/12.x/events#defining-listeners)를 사용해 이벤트를 처리할 수 있습니다.

> [!WARNING]
> Eloquent를 통한 대량 수정 또는 삭제 쿼리를 실행할 때, 영향을 받은 모델에 대해 `saved`, `updated`, `deleting`, `deleted` 모델 이벤트가 디스패치되지 않습니다. 이는 대량 수정/삭제 시 실제로 모델이 조회되지 않기 때문입니다.


### 클로저 사용 {#events-using-closures}

커스텀 이벤트 클래스 대신, 다양한 모델 이벤트가 디스패치될 때 실행되는 클로저를 등록할 수 있습니다. 일반적으로 이러한 클로저는 모델의 `booted` 메서드에서 등록해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 모델의 "booted" 메서드
     */
    protected static function booted(): void
    {
        static::created(function (User $user) {
            // ...
        });
    }
}
```

필요하다면, 모델 이벤트를 등록할 때 [큐어블 익명 이벤트 리스너](/laravel/12.x/events#queuable-anonymous-event-listeners)를 사용할 수 있습니다. 이렇게 하면 Laravel이 애플리케이션의 [큐](/laravel/12.x/queues)를 사용해 모델 이벤트 리스너를 백그라운드에서 실행하도록 지시할 수 있습니다:

```php
use function Illuminate\Events\queueable;

static::created(queueable(function (User $user) {
    // ...
}));
```


### 옵저버 {#observers}


#### 옵저버 정의 {#defining-observers}

특정 모델에서 여러 이벤트를 리스닝해야 한다면, 옵저버를 사용해 모든 리스너를 하나의 클래스로 그룹화할 수 있습니다. 옵저버 클래스의 메서드 이름은 리스닝하려는 Eloquent 이벤트와 일치해야 하며, 각 메서드는 영향을 받는 모델을 유일한 인수로 받습니다. 새로운 옵저버 클래스를 생성하는 가장 쉬운 방법은 `make:observer` Artisan 명령어를 사용하는 것입니다:

```shell
php artisan make:observer UserObserver --model=User
```

이 명령어는 새 옵저버를 `app/Observers` 디렉터리에 생성합니다. 이 디렉터리가 없다면 Artisan이 자동으로 생성합니다. 새 옵저버는 다음과 같이 생겼을 것입니다:

```php
<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * User "created" 이벤트 처리
     */
    public function created(User $user): void
    {
        // ...
    }

    /**
     * User "updated" 이벤트 처리
     */
    public function updated(User $user): void
    {
        // ...
    }

    /**
     * User "deleted" 이벤트 처리
     */
    public function deleted(User $user): void
    {
        // ...
    }

    /**
     * User "restored" 이벤트 처리
     */
    public function restored(User $user): void
    {
        // ...
    }

    /**
     * User "forceDeleted" 이벤트 처리
     */
    public function forceDeleted(User $user): void
    {
        // ...
    }
}
```

옵저버를 등록하려면, 해당 모델에 `ObservedBy` 속성을 추가하면 됩니다:

```php
use App\Observers\UserObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([UserObserver::class])]
class User extends Authenticatable
{
    //
}
```

또는, 옵저버를 수동으로 등록하려면, 옵저버를 등록할 모델의 `observe` 메서드를 호출하세요. 옵저버는 애플리케이션의 `AppServiceProvider` 클래스의 `boot` 메서드에서 등록할 수 있습니다:

```php
use App\Models\User;
use App\Observers\UserObserver;

/**
 * 애플리케이션 서비스 부트스트랩
 */
public function boot(): void
{
    User::observe(UserObserver::class);
}
```

> [!NOTE]
> 옵저버가 리스닝할 수 있는 추가 이벤트(예: `saving`, `retrieved`)가 있습니다. 이러한 이벤트는 [이벤트](#events) 문서에서 설명되어 있습니다.


#### 옵저버와 데이터베이스 트랜잭션 {#observers-and-database-transactions}

모델이 데이터베이스 트랜잭션 내에서 생성될 때, 옵저버가 데이터베이스 트랜잭션이 커밋된 후에만 이벤트 핸들러를 실행하도록 지시하고 싶을 수 있습니다. 이를 위해 옵저버에 `ShouldHandleEventsAfterCommit` 인터페이스를 구현하면 됩니다. 데이터베이스 트랜잭션이 진행 중이 아니면, 이벤트 핸들러는 즉시 실행됩니다:

```php
<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class UserObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * User "created" 이벤트 처리
     */
    public function created(User $user): void
    {
        // ...
    }
}
```


### 이벤트 음소거 {#muting-events}

때로는 모델에서 발생하는 모든 이벤트를 일시적으로 "음소거"해야 할 수 있습니다. `withoutEvents` 메서드를 사용해 이를 달성할 수 있습니다. `withoutEvents` 메서드는 클로저를 유일한 인수로 받으며, 이 클로저 내에서 실행되는 코드는 모델 이벤트를 디스패치하지 않습니다. 클로저에서 반환된 값이 `withoutEvents` 메서드의 반환값이 됩니다:

```php
use App\Models\User;

$user = User::withoutEvents(function () {
    User::findOrFail(1)->delete();

    return User::find(2);
});
```


#### 단일 모델을 이벤트 없이 저장 {#saving-a-single-model-without-events}

특정 모델을 이벤트를 디스패치하지 않고 "저장"하고 싶을 때가 있습니다. 이럴 때는 `saveQuietly` 메서드를 사용하세요:

```php
$user = User::findOrFail(1);

$user->name = 'Victoria Faith';

$user->saveQuietly();
```

또한, "update", "delete", "soft delete", "restore", "replicate" 작업도 이벤트 없이 수행할 수 있습니다:

```php
$user->deleteQuietly();
$user->forceDeleteQuietly();
$user->restoreQuietly();
```
