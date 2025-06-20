# 데이터베이스: 마이그레이션


























## 소개 {#introduction}

마이그레이션은 데이터베이스의 버전 관리를 가능하게 하여, 팀이 애플리케이션의 데이터베이스 스키마 정의를 명확하게 공유하고 정의할 수 있도록 해줍니다. 만약 소스 컨트롤에서 변경사항을 받아온 후 동료에게 직접 데이터베이스 스키마에 컬럼을 추가하라고 말한 적이 있다면, 바로 그 문제를 마이그레이션이 해결해줍니다.

Laravel의 `Schema` [파사드](/laravel/12.x/facades)는 Laravel이 지원하는 모든 데이터베이스 시스템에서 테이블을 생성하고 조작할 수 있도록 데이터베이스에 독립적인 지원을 제공합니다. 일반적으로 마이그레이션은 이 파사드를 사용하여 데이터베이스 테이블과 컬럼을 생성 및 수정합니다.


## 마이그레이션 생성 {#generating-migrations}

`make:migration` [Artisan 명령어](/laravel/12.x/artisan)를 사용하여 데이터베이스 마이그레이션을 생성할 수 있습니다. 새 마이그레이션은 `database/migrations` 디렉터리에 생성됩니다. 각 마이그레이션 파일명에는 타임스탬프가 포함되어 있어 Laravel이 마이그레이션의 실행 순서를 결정할 수 있습니다:

```shell
php artisan make:migration create_flights_table
```

Laravel은 마이그레이션의 이름을 사용하여 테이블 이름과 해당 마이그레이션이 새로운 테이블을 생성하는지 여부를 추측하려고 시도합니다. 만약 Laravel이 마이그레이션 이름에서 테이블 이름을 추론할 수 있다면, 지정된 테이블로 미리 채워진 마이그레이션 파일을 생성합니다. 그렇지 않은 경우, 마이그레이션 파일에서 직접 테이블을 지정하면 됩니다.

생성된 마이그레이션의 경로를 직접 지정하고 싶다면, `make:migration` 명령어 실행 시 `--path` 옵션을 사용할 수 있습니다. 지정한 경로는 애플리케이션의 기본 경로를 기준으로 상대 경로여야 합니다.

> [!NOTE]
> 마이그레이션 스텁은 [스텁 퍼블리싱](/laravel/12.x/artisan#stub-customization)을 통해 커스터마이즈할 수 있습니다.


### 마이그레이션 스쿼싱 {#squashing-migrations}

애플리케이션을 개발하다 보면 시간이 지남에 따라 점점 더 많은 마이그레이션이 쌓일 수 있습니다. 이로 인해 `database/migrations` 디렉터리가 수백 개의 마이그레이션으로 비대해질 수 있습니다. 원한다면, 여러 마이그레이션을 하나의 SQL 파일로 "스쿼시"할 수 있습니다. 시작하려면 `schema:dump` 명령어를 실행하세요:

```shell
php artisan schema:dump

# 현재 데이터베이스 스키마를 덤프하고 기존 마이그레이션을 모두 정리합니다...
php artisan schema:dump --prune
```

이 명령어를 실행하면, Laravel은 애플리케이션의 `database/schema` 디렉터리에 "스키마" 파일을 작성합니다. 스키마 파일의 이름은 데이터베이스 연결명과 일치합니다. 이제 데이터베이스를 마이그레이션하려고 할 때 아직 실행된 마이그레이션이 없다면, Laravel은 먼저 사용 중인 데이터베이스 연결의 스키마 파일에 있는 SQL 문을 실행합니다. 스키마 파일의 SQL 문을 실행한 후, 스키마 덤프에 포함되지 않은 나머지 마이그레이션을 실행합니다.

애플리케이션의 테스트가 로컬 개발 시 일반적으로 사용하는 데이터베이스 연결과 다른 연결을 사용한다면, 해당 데이터베이스 연결로도 스키마 파일을 덤프했는지 확인해야 합니다. 이렇게 하면 테스트가 데이터베이스를 정상적으로 구축할 수 있습니다. 로컬 개발에서 주로 사용하는 데이터베이스 연결을 덤프한 후에 이 작업을 수행할 수 있습니다:

```shell
php artisan schema:dump
php artisan schema:dump --database=testing --prune
```

데이터베이스 스키마 파일은 소스 컨트롤에 커밋하여 팀의 다른 신규 개발자들도 애플리케이션의 초기 데이터베이스 구조를 빠르게 생성할 수 있도록 해야 합니다.

> [!WARNING]
> 마이그레이션 스쿼싱은 MariaDB, MySQL, PostgreSQL, SQLite 데이터베이스에서만 사용할 수 있으며, 데이터베이스의 커맨드라인 클라이언트를 활용합니다.


## 마이그레이션 구조 {#migration-structure}

마이그레이션 클래스는 `up`과 `down` 두 가지 메서드를 포함합니다. `up` 메서드는 데이터베이스에 새로운 테이블, 컬럼, 인덱스를 추가할 때 사용하며, `down` 메서드는 `up` 메서드에서 수행한 작업을 되돌릴 때 사용합니다.

이 두 메서드 내에서는 Laravel 스키마 빌더를 사용하여 테이블을 직관적으로 생성 및 수정할 수 있습니다. `Schema` 빌더에서 사용할 수 있는 모든 메서드에 대해 더 알고 싶다면 [문서](#creating-tables)를 참고하세요. 예를 들어, 다음 마이그레이션은 `flights` 테이블을 생성합니다:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('airline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('flights');
    }
};
```


#### 마이그레이션 연결 설정 {#setting-the-migration-connection}

마이그레이션이 애플리케이션의 기본 데이터베이스 연결이 아닌 다른 데이터베이스 연결을 사용해야 한다면, 마이그레이션의 `$connection` 속성을 설정해야 합니다:

```php
/**
 * 마이그레이션에서 사용할 데이터베이스 연결.
 *
 * @var string
 */
protected $connection = 'pgsql';

/**
 * 마이그레이션 실행.
 */
public function up(): void
{
    // ...
}
```


#### 마이그레이션 건너뛰기 {#skipping-migrations}

때로는 아직 활성화되지 않은 기능을 지원하기 위해 마이그레이션을 작성하지만, 아직 실행하고 싶지 않을 수 있습니다. 이 경우 마이그레이션에 `shouldRun` 메서드를 정의할 수 있습니다. `shouldRun` 메서드가 `false`를 반환하면 해당 마이그레이션은 건너뜁니다:

```php
use App\Models\Flights;
use Laravel\Pennant\Feature;

/**
 * 이 마이그레이션을 실행할지 결정.
 */
public function shouldRun(): bool
{
    return Feature::active(Flights::class);
}
```


## 마이그레이션 실행 {#running-migrations}

모든 미실행 마이그레이션을 실행하려면 `migrate` Artisan 명령어를 실행하세요:

```shell
php artisan migrate
```

지금까지 어떤 마이그레이션이 실행되었는지 확인하려면 `migrate:status` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan migrate:status
```

마이그레이션을 실제로 실행하지 않고 어떤 SQL 문이 실행될지 미리 보려면, `migrate` 명령어에 `--pretend` 플래그를 추가하세요:

```shell
php artisan migrate --pretend
```

#### 마이그레이션 실행 격리

여러 서버에 애플리케이션을 배포하고 배포 과정에서 마이그레이션을 실행하는 경우, 두 서버가 동시에 데이터베이스를 마이그레이션하는 상황을 피하고 싶을 수 있습니다. 이를 방지하려면 `migrate` 명령어 실행 시 `isolated` 옵션을 사용할 수 있습니다.

`isolated` 옵션이 제공되면, Laravel은 마이그레이션을 실행하기 전에 애플리케이션의 캐시 드라이버를 사용하여 원자적 락을 획득합니다. 락이 유지되는 동안 다른 모든 `migrate` 명령어 실행 시도는 실행되지 않으며, 명령어는 성공 상태 코드로 종료됩니다:

```shell
php artisan migrate --isolated
```

> [!WARNING]
> 이 기능을 사용하려면, 애플리케이션의 기본 캐시 드라이버가 `memcached`, `redis`, `dynamodb`, `database`, `file`, `array` 중 하나여야 합니다. 또한 모든 서버가 동일한 중앙 캐시 서버와 통신해야 합니다.


#### 프로덕션에서 마이그레이션 강제 실행 {#forcing-migrations-to-run-in-production}

일부 마이그레이션 작업은 파괴적이어서 데이터 손실이 발생할 수 있습니다. 이러한 명령어를 프로덕션 데이터베이스에서 실행하는 것을 방지하기 위해, 명령어 실행 전 확인을 요청합니다. 프롬프트 없이 명령어를 강제로 실행하려면 `--force` 플래그를 사용하세요:

```shell
php artisan migrate --force
```


### 마이그레이션 롤백 {#rolling-back-migrations}

가장 최근의 마이그레이션 작업을 롤백하려면 `rollback` Artisan 명령어를 사용할 수 있습니다. 이 명령어는 마지막 "배치"의 마이그레이션을 롤백하며, 여러 마이그레이션 파일이 포함될 수 있습니다:

```shell
php artisan migrate:rollback
```

`rollback` 명령어에 `step` 옵션을 제공하여 롤백할 마이그레이션 수를 제한할 수 있습니다. 예를 들어, 다음 명령어는 최근 5개의 마이그레이션을 롤백합니다:

```shell
php artisan migrate:rollback --step=5
```

`rollback` 명령어에 `batch` 옵션을 제공하여 특정 "배치"의 마이그레이션을 롤백할 수 있습니다. `batch` 옵션은 애플리케이션의 `migrations` 데이터베이스 테이블 내의 배치 값과 일치해야 합니다. 예를 들어, 다음 명령어는 3번 배치의 모든 마이그레이션을 롤백합니다:

```shell
php artisan migrate:rollback --batch=3
```

마이그레이션을 실제로 실행하지 않고 어떤 SQL 문이 실행될지 미리 보려면, `migrate:rollback` 명령어에 `--pretend` 플래그를 추가하세요:

```shell
php artisan migrate:rollback --pretend
```

`migrate:reset` 명령어는 애플리케이션의 모든 마이그레이션을 롤백합니다:

```shell
php artisan migrate:reset
```


#### 한 번의 명령어로 롤백 및 마이그레이션 {#roll-back-migrate-using-a-single-command}

`migrate:refresh` 명령어는 모든 마이그레이션을 롤백한 후 `migrate` 명령어를 실행합니다. 이 명령어는 데이터베이스 전체를 효과적으로 재생성합니다:

```shell
php artisan migrate:refresh

# 데이터베이스를 새로고침하고 모든 시드를 실행합니다...
php artisan migrate:refresh --seed
```

`refresh` 명령어에 `step` 옵션을 제공하여 제한된 수의 마이그레이션만 롤백 및 재마이그레이션할 수 있습니다. 예를 들어, 다음 명령어는 최근 5개의 마이그레이션을 롤백 및 재마이그레이션합니다:

```shell
php artisan migrate:refresh --step=5
```


#### 모든 테이블 삭제 후 마이그레이션 {#drop-all-tables-migrate}

`migrate:fresh` 명령어는 데이터베이스의 모든 테이블을 삭제한 후 `migrate` 명령어를 실행합니다:

```shell
php artisan migrate:fresh

php artisan migrate:fresh --seed
```

기본적으로 `migrate:fresh` 명령어는 기본 데이터베이스 연결의 테이블만 삭제합니다. 그러나 `--database` 옵션을 사용하여 마이그레이션할 데이터베이스 연결을 지정할 수 있습니다. 데이터베이스 연결명은 애플리케이션의 `database` [설정 파일](/laravel/12.x/configuration)에 정의된 연결과 일치해야 합니다:

```shell
php artisan migrate:fresh --database=admin
```

> [!WARNING]
> `migrate:fresh` 명령어는 접두사와 상관없이 모든 데이터베이스 테이블을 삭제합니다. 이 명령어는 다른 애플리케이션과 데이터베이스를 공유하는 환경에서 사용할 때 주의해야 합니다.


## 테이블 {#tables}


### 테이블 생성 {#creating-tables}

새 데이터베이스 테이블을 생성하려면 `Schema` 파사드의 `create` 메서드를 사용하세요. `create` 메서드는 두 개의 인자를 받습니다: 첫 번째는 테이블 이름, 두 번째는 새 테이블을 정의할 수 있는 `Blueprint` 객체를 받는 클로저입니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->timestamps();
});
```

테이블을 생성할 때, 스키마 빌더의 [컬럼 메서드](#creating-columns)를 사용하여 테이블의 컬럼을 정의할 수 있습니다.


#### 테이블/컬럼 존재 여부 확인 {#determining-table-column-existence}

`hasTable`, `hasColumn`, `hasIndex` 메서드를 사용하여 테이블, 컬럼, 인덱스의 존재 여부를 확인할 수 있습니다:

```php
if (Schema::hasTable('users')) {
    // "users" 테이블이 존재합니다...
}

if (Schema::hasColumn('users', 'email')) {
    // "users" 테이블이 존재하고 "email" 컬럼이 있습니다...
}

if (Schema::hasIndex('users', ['email'], 'unique')) {
    // "users" 테이블이 존재하고 "email" 컬럼에 유니크 인덱스가 있습니다...
}
```


#### 데이터베이스 연결 및 테이블 옵션 {#database-connection-table-options}

애플리케이션의 기본 연결이 아닌 다른 데이터베이스 연결에서 스키마 작업을 수행하려면 `connection` 메서드를 사용하세요:

```php
Schema::connection('sqlite')->create('users', function (Blueprint $table) {
    $table->id();
});
```

또한, 테이블 생성의 다른 측면을 정의하기 위해 몇 가지 속성과 메서드를 사용할 수 있습니다. MariaDB 또는 MySQL을 사용할 때 `engine` 속성으로 테이블의 스토리지 엔진을 지정할 수 있습니다:

```php
Schema::create('users', function (Blueprint $table) {
    $table->engine('InnoDB');

    // ...
});
```

MariaDB 또는 MySQL을 사용할 때 `charset`과 `collation` 속성으로 생성된 테이블의 문자셋과 콜레이션을 지정할 수 있습니다:

```php
Schema::create('users', function (Blueprint $table) {
    $table->charset('utf8mb4');
    $table->collation('utf8mb4_unicode_ci');

    // ...
});
```

`temporary` 메서드를 사용하여 테이블이 "임시"임을 나타낼 수 있습니다. 임시 테이블은 현재 연결의 데이터베이스 세션에서만 보이며, 연결이 종료되면 자동으로 삭제됩니다:

```php
Schema::create('calculations', function (Blueprint $table) {
    $table->temporary();

    // ...
});
```

데이터베이스 테이블에 "주석"을 추가하고 싶다면, 테이블 인스턴스에서 `comment` 메서드를 호출할 수 있습니다. 테이블 주석은 현재 MariaDB, MySQL, PostgreSQL에서만 지원됩니다:

```php
Schema::create('calculations', function (Blueprint $table) {
    $table->comment('Business calculations');

    // ...
});
```


### 테이블 수정 {#updating-tables}

`Schema` 파사드의 `table` 메서드를 사용하여 기존 테이블을 수정할 수 있습니다. `create` 메서드와 마찬가지로, `table` 메서드는 테이블 이름과 컬럼 또는 인덱스를 추가할 수 있는 `Blueprint` 인스턴스를 받는 클로저를 인자로 받습니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->integer('votes');
});
```


### 테이블 이름 변경 / 삭제 {#renaming-and-dropping-tables}

기존 데이터베이스 테이블의 이름을 변경하려면 `rename` 메서드를 사용하세요:

```php
use Illuminate\Support\Facades\Schema;

Schema::rename($from, $to);
```

기존 테이블을 삭제하려면 `drop` 또는 `dropIfExists` 메서드를 사용할 수 있습니다:

```php
Schema::drop('users');

Schema::dropIfExists('users');
```


#### 외래 키가 있는 테이블 이름 변경 {#renaming-tables-with-foreign-keys}

테이블 이름을 변경하기 전에, 마이그레이션 파일에서 해당 테이블의 외래 키 제약조건에 명시적인 이름을 지정했는지 확인해야 합니다. 그렇지 않으면 외래 키 제약조건 이름이 이전 테이블 이름을 참조하게 됩니다.


## 컬럼 {#columns}


### 컬럼 생성 {#creating-columns}

`Schema` 파사드의 `table` 메서드를 사용하여 기존 테이블을 수정할 수 있습니다. `create` 메서드와 마찬가지로, `table` 메서드는 테이블 이름과 컬럼을 추가할 수 있는 `Illuminate\Database\Schema\Blueprint` 인스턴스를 받는 클로저를 인자로 받습니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->integer('votes');
});
```


### 사용 가능한 컬럼 타입 {#available-column-types}

스키마 빌더 블루프린트는 데이터베이스 테이블에 추가할 수 있는 다양한 컬럼 타입에 해당하는 여러 메서드를 제공합니다. 사용 가능한 각 메서드는 아래 표에 나와 있습니다:

<style>
    .collection-method-list > p {
        columns: 10.8em 3; -moz-columns: 10.8em 3; -webkit-columns: 10.8em 3;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .collection-method code {
        font-size: 14px;
    }

    .collection-method:not(.first-collection-method) {
        margin-top: 50px;
    }
</style>


#### 불리언 타입 {#booleans-method-list}

<div class="collection-method-list" markdown="1">

[boolean](#column-method-boolean)

</div>


#### 문자열 & 텍스트 타입 {#strings-and-texts-method-list}

<div class="collection-method-list" markdown="1">

[char](#column-method-char)
[longText](#column-method-longText)
[mediumText](#column-method-mediumText)
[string](#column-method-string)
[text](#column-method-text)
[tinyText](#column-method-tinyText)

</div>


#### 숫자 타입 {#numbers--method-list}

<div class="collection-method-list" markdown="1">

[bigIncrements](#column-method-bigIncrements)
[bigInteger](#column-method-bigInteger)
[decimal](#column-method-decimal)
[double](#column-method-double)
[float](#column-method-float)
[id](#column-method-id)
[increments](#column-method-increments)
[integer](#column-method-integer)
[mediumIncrements](#column-method-mediumIncrements)
[mediumInteger](#column-method-mediumInteger)
[smallIncrements](#column-method-smallIncrements)
[smallInteger](#column-method-smallInteger)
[tinyIncrements](#column-method-tinyIncrements)
[tinyInteger](#column-method-tinyInteger)
[unsignedBigInteger](#column-method-unsignedBigInteger)
[unsignedInteger](#column-method-unsignedInteger)
[unsignedMediumInteger](#column-method-unsignedMediumInteger)
[unsignedSmallInteger](#column-method-unsignedSmallInteger)
[unsignedTinyInteger](#column-method-unsignedTinyInteger)

</div>


#### 날짜 & 시간 타입 {#dates-and-times-method-list}

<div class="collection-method-list" markdown="1">

[dateTime](#column-method-dateTime)
[dateTimeTz](#column-method-dateTimeTz)
[date](#column-method-date)
[time](#column-method-time)
[timeTz](#column-method-timeTz)
[timestamp](#column-method-timestamp)
[timestamps](#column-method-timestamps)
[timestampsTz](#column-method-timestampsTz)
[softDeletes](#column-method-softDeletes)
[softDeletesTz](#column-method-softDeletesTz)
[year](#column-method-year)

</div>


#### 바이너리 타입 {#binaries-method-list}

<div class="collection-method-list" markdown="1">

[binary](#column-method-binary)

</div>


#### 객체 & JSON 타입 {#object-and-jsons-method-list}

<div class="collection-method-list" markdown="1">

[json](#column-method-json)
[jsonb](#column-method-jsonb)

</div>


#### UUID & ULID 타입 {#uuids-and-ulids-method-list}

<div class="collection-method-list" markdown="1">

[ulid](#column-method-ulid)
[ulidMorphs](#column-method-ulidMorphs)
[uuid](#column-method-uuid)
[uuidMorphs](#column-method-uuidMorphs)
[nullableUlidMorphs](#column-method-nullableUlidMorphs)
[nullableUuidMorphs](#column-method-nullableUuidMorphs)

</div>


#### 공간 타입 {#spatials-method-list}

<div class="collection-method-list" markdown="1">

[geography](#column-method-geography)
[geometry](#column-method-geometry)

</div>

#### 관계 타입

<div class="collection-method-list" markdown="1">

[foreignId](#column-method-foreignId)
[foreignIdFor](#column-method-foreignIdFor)
[foreignUlid](#column-method-foreignUlid)
[foreignUuid](#column-method-foreignUuid)
[morphs](#column-method-morphs)
[nullableMorphs](#column-method-nullableMorphs)

</div>


#### 특수 타입 {#spacifics-method-list}

<div class="collection-method-list" markdown="1">

[enum](#column-method-enum)
[set](#column-method-set)
[macAddress](#column-method-macAddress)
[ipAddress](#column-method-ipAddress)
[rememberToken](#column-method-rememberToken)
[vector](#column-method-vector)

</div>


#### `bigIncrements()` {#column-method-bigIncrements}

`bigIncrements` 메서드는 자동 증가하는 `UNSIGNED BIGINT`(기본키) 컬럼을 생성합니다:

```php
$table->bigIncrements('id');
```


#### `bigInteger()` {#column-method-bigInteger}

`bigInteger` 메서드는 `BIGINT` 컬럼을 생성합니다:

```php
$table->bigInteger('votes');
```


#### `binary()` {#column-method-binary}

`binary` 메서드는 `BLOB` 컬럼을 생성합니다:

```php
$table->binary('photo');
```

MySQL, MariaDB, SQL Server를 사용할 때, `length`와 `fixed` 인자를 전달하여 `VARBINARY` 또는 `BINARY` 컬럼을 생성할 수 있습니다:

```php
$table->binary('data', length: 16); // VARBINARY(16)

$table->binary('data', length: 16, fixed: true); // BINARY(16)
```


#### `boolean()` {#column-method-boolean}

`boolean` 메서드는 `BOOLEAN` 컬럼을 생성합니다:

```php
$table->boolean('confirmed');
```


#### `char()` {#column-method-char}

`char` 메서드는 지정한 길이의 `CHAR` 컬럼을 생성합니다:

```php
$table->char('name', length: 100);
```


#### `dateTimeTz()` {#column-method-dateTimeTz}

`dateTimeTz` 메서드는 선택적 소수 초 정밀도를 가진 `DATETIME`(타임존 포함) 컬럼을 생성합니다:

```php
$table->dateTimeTz('created_at', precision: 0);
```


#### `dateTime()` {#column-method-dateTime}

`dateTime` 메서드는 선택적 소수 초 정밀도를 가진 `DATETIME` 컬럼을 생성합니다:

```php
$table->dateTime('created_at', precision: 0);
```


#### `date()` {#column-method-date}

`date` 메서드는 `DATE` 컬럼을 생성합니다:

```php
$table->date('created_at');
```


#### `decimal()` {#column-method-decimal}

`decimal` 메서드는 지정한 정밀도(전체 자릿수)와 소수점 자릿수로 `DECIMAL` 컬럼을 생성합니다:

```php
$table->decimal('amount', total: 8, places: 2);
```


#### `double()` {#column-method-double}

`double` 메서드는 `DOUBLE` 컬럼을 생성합니다:

```php
$table->double('amount');
```


#### `enum()` {#column-method-enum}

`enum` 메서드는 지정한 유효 값 목록으로 `ENUM` 컬럼을 생성합니다:

```php
$table->enum('difficulty', ['easy', 'hard']);
```


#### `float()` {#column-method-float}

`float` 메서드는 지정한 정밀도로 `FLOAT` 컬럼을 생성합니다:

```php
$table->float('amount', precision: 53);
```


#### `foreignId()` {#column-method-foreignId}

`foreignId` 메서드는 `UNSIGNED BIGINT` 컬럼을 생성합니다:

```php
$table->foreignId('user_id');
```


#### `foreignIdFor()` {#column-method-foreignIdFor}

`foreignIdFor` 메서드는 지정한 모델 클래스에 대해 `{column}_id` 컬럼을 추가합니다. 컬럼 타입은 모델 키 타입에 따라 `UNSIGNED BIGINT`, `CHAR(36)`, `CHAR(26)` 중 하나입니다:

```php
$table->foreignIdFor(User::class);
```


#### `foreignUlid()` {#column-method-foreignUlid}

`foreignUlid` 메서드는 `ULID` 컬럼을 생성합니다:

```php
$table->foreignUlid('user_id');
```


#### `foreignUuid()` {#column-method-foreignUuid}

`foreignUuid` 메서드는 `UUID` 컬럼을 생성합니다:

```php
$table->foreignUuid('user_id');
```


#### `geography()` {#column-method-geography}

`geography` 메서드는 지정한 공간 타입과 SRID(공간 참조 시스템 식별자)로 `GEOGRAPHY` 컬럼을 생성합니다:

```php
$table->geography('coordinates', subtype: 'point', srid: 4326);
```

> [!NOTE]
> 공간 타입 지원 여부는 데이터베이스 드라이버에 따라 다릅니다. 데이터베이스 문서를 참고하세요. PostgreSQL을 사용하는 경우, `geography` 메서드를 사용하기 전에 [PostGIS](https://postgis.net) 확장 기능을 설치해야 합니다.


#### `geometry()` {#column-method-geometry}

`geometry` 메서드는 지정한 공간 타입과 SRID(공간 참조 시스템 식별자)로 `GEOMETRY` 컬럼을 생성합니다:

```php
$table->geometry('positions', subtype: 'point', srid: 0);
```

> [!NOTE]
> 공간 타입 지원 여부는 데이터베이스 드라이버에 따라 다릅니다. 데이터베이스 문서를 참고하세요. PostgreSQL을 사용하는 경우, `geometry` 메서드를 사용하기 전에 [PostGIS](https://postgis.net) 확장 기능을 설치해야 합니다.


#### `id()` {#column-method-id}

`id` 메서드는 `bigIncrements` 메서드의 별칭입니다. 기본적으로 `id` 컬럼을 생성하지만, 다른 이름을 지정하고 싶다면 컬럼명을 전달할 수 있습니다:

```php
$table->id();
```


#### `increments()` {#column-method-increments}

`increments` 메서드는 자동 증가하는 `UNSIGNED INTEGER` 컬럼을 기본키로 생성합니다:

```php
$table->increments('id');
```


#### `integer()` {#column-method-integer}

`integer` 메서드는 `INTEGER` 컬럼을 생성합니다:

```php
$table->integer('votes');
```


#### `ipAddress()` {#column-method-ipAddress}

`ipAddress` 메서드는 `VARCHAR` 컬럼을 생성합니다:

```php
$table->ipAddress('visitor');
```

PostgreSQL을 사용할 때는 `INET` 컬럼이 생성됩니다.


#### `json()` {#column-method-json}

`json` 메서드는 `JSON` 컬럼을 생성합니다:

```php
$table->json('options');
```

SQLite를 사용할 때는 `TEXT` 컬럼이 생성됩니다.


#### `jsonb()` {#column-method-jsonb}

`jsonb` 메서드는 `JSONB` 컬럼을 생성합니다:

```php
$table->jsonb('options');
```

SQLite를 사용할 때는 `TEXT` 컬럼이 생성됩니다.


#### `longText()` {#column-method-longText}

`longText` 메서드는 `LONGTEXT` 컬럼을 생성합니다:

```php
$table->longText('description');
```

MySQL 또는 MariaDB를 사용할 때, 컬럼에 `binary` 문자셋을 적용하여 `LONGBLOB` 컬럼을 생성할 수 있습니다:

```php
$table->longText('data')->charset('binary'); // LONGBLOB
```


#### `macAddress()` {#column-method-macAddress}

`macAddress` 메서드는 MAC 주소를 저장하기 위한 컬럼을 생성합니다. PostgreSQL과 같은 일부 데이터베이스 시스템은 이 데이터에 특화된 컬럼 타입을 제공합니다. 다른 데이터베이스 시스템은 문자열 컬럼을 사용합니다:

```php
$table->macAddress('device');
```


#### `mediumIncrements()` {#column-method-mediumIncrements}

`mediumIncrements` 메서드는 자동 증가하는 `UNSIGNED MEDIUMINT` 컬럼을 기본키로 생성합니다:

```php
$table->mediumIncrements('id');
```


#### `mediumInteger()` {#column-method-mediumInteger}

`mediumInteger` 메서드는 `MEDIUMINT` 컬럼을 생성합니다:

```php
$table->mediumInteger('votes');
```


#### `mediumText()` {#column-method-mediumText}

`mediumText` 메서드는 `MEDIUMTEXT` 컬럼을 생성합니다:

```php
$table->mediumText('description');
```

MySQL 또는 MariaDB를 사용할 때, 컬럼에 `binary` 문자셋을 적용하여 `MEDIUMBLOB` 컬럼을 생성할 수 있습니다:

```php
$table->mediumText('data')->charset('binary'); // MEDIUMBLOB
```


#### `morphs()` {#column-method-morphs}

`morphs` 메서드는 `{column}_id` 컬럼과 `{column}_type` `VARCHAR` 컬럼을 추가하는 편의 메서드입니다. `{column}_id`의 컬럼 타입은 모델 키 타입에 따라 `UNSIGNED BIGINT`, `CHAR(36)`, `CHAR(26)` 중 하나입니다.

이 메서드는 다형성 [Eloquent 관계](/laravel/12.x/eloquent-relationships)에 필요한 컬럼을 정의할 때 사용합니다. 아래 예시에서는 `taggable_id`와 `taggable_type` 컬럼이 생성됩니다:

```php
$table->morphs('taggable');
```


#### `nullableMorphs()` {#column-method-nullableMorphs}

이 메서드는 [morphs](#column-method-morphs) 메서드와 유사하지만, 생성되는 컬럼이 "nullable"입니다:

```php
$table->nullableMorphs('taggable');
```


#### `nullableUlidMorphs()` {#column-method-nullableUlidMorphs}

이 메서드는 [ulidMorphs](#column-method-ulidMorphs) 메서드와 유사하지만, 생성되는 컬럼이 "nullable"입니다:

```php
$table->nullableUlidMorphs('taggable');
```


#### `nullableUuidMorphs()` {#column-method-nullableUuidMorphs}

이 메서드는 [uuidMorphs](#column-method-uuidMorphs) 메서드와 유사하지만, 생성되는 컬럼이 "nullable"입니다:

```php
$table->nullableUuidMorphs('taggable');
```


#### `rememberToken()` {#column-method-rememberToken}

`rememberToken` 메서드는 현재 "remember me" [인증 토큰](/laravel/12.x/authentication#remembering-users)을 저장하기 위한 nullable `VARCHAR(100)` 컬럼을 생성합니다:

```php
$table->rememberToken();
```


#### `set()` {#column-method-set}

`set` 메서드는 지정한 유효 값 목록으로 `SET` 컬럼을 생성합니다:

```php
$table->set('flavors', ['strawberry', 'vanilla']);
```


#### `smallIncrements()` {#column-method-smallIncrements}

`smallIncrements` 메서드는 자동 증가하는 `UNSIGNED SMALLINT` 컬럼을 기본키로 생성합니다:

```php
$table->smallIncrements('id');
```


#### `smallInteger()` {#column-method-smallInteger}

`smallInteger` 메서드는 `SMALLINT` 컬럼을 생성합니다:

```php
$table->smallInteger('votes');
```


#### `softDeletesTz()` {#column-method-softDeletesTz}

`softDeletesTz` 메서드는 nullable `deleted_at` `TIMESTAMP`(타임존 포함) 컬럼을 선택적 소수 초 정밀도와 함께 추가합니다. 이 컬럼은 Eloquent의 "소프트 삭제" 기능에 필요한 `deleted_at` 타임스탬프를 저장하는 데 사용됩니다:

```php
$table->softDeletesTz('deleted_at', precision: 0);
```


#### `softDeletes()` {#column-method-softDeletes}

`softDeletes` 메서드는 nullable `deleted_at` `TIMESTAMP` 컬럼을 선택적 소수 초 정밀도와 함께 추가합니다. 이 컬럼은 Eloquent의 "소프트 삭제" 기능에 필요한 `deleted_at` 타임스탬프를 저장하는 데 사용됩니다:

```php
$table->softDeletes('deleted_at', precision: 0);
```


#### `string()` {#column-method-string}

`string` 메서드는 지정한 길이의 `VARCHAR` 컬럼을 생성합니다:

```php
$table->string('name', length: 100);
```


#### `text()` {#column-method-text}

`text` 메서드는 `TEXT` 컬럼을 생성합니다:

```php
$table->text('description');
```

MySQL 또는 MariaDB를 사용할 때, 컬럼에 `binary` 문자셋을 적용하여 `BLOB` 컬럼을 생성할 수 있습니다:

```php
$table->text('data')->charset('binary'); // BLOB
```


#### `timeTz()` {#column-method-timeTz}

`timeTz` 메서드는 선택적 소수 초 정밀도를 가진 `TIME`(타임존 포함) 컬럼을 생성합니다:

```php
$table->timeTz('sunrise', precision: 0);
```


#### `time()` {#column-method-time}

`time` 메서드는 선택적 소수 초 정밀도를 가진 `TIME` 컬럼을 생성합니다:

```php
$table->time('sunrise', precision: 0);
```


#### `timestampTz()` {#column-method-timestampTz}

`timestampTz` 메서드는 선택적 소수 초 정밀도를 가진 `TIMESTAMP`(타임존 포함) 컬럼을 생성합니다:

```php
$table->timestampTz('added_at', precision: 0);
```


#### `timestamp()` {#column-method-timestamp}

`timestamp` 메서드는 선택적 소수 초 정밀도를 가진 `TIMESTAMP` 컬럼을 생성합니다:

```php
$table->timestamp('added_at', precision: 0);
```


#### `timestampsTz()` {#column-method-timestampsTz}

`timestampsTz` 메서드는 선택적 소수 초 정밀도를 가진 `created_at` 및 `updated_at` `TIMESTAMP`(타임존 포함) 컬럼을 생성합니다:

```php
$table->timestampsTz(precision: 0);
```


#### `timestamps()` {#column-method-timestamps}

`timestamps` 메서드는 선택적 소수 초 정밀도를 가진 `created_at` 및 `updated_at` `TIMESTAMP` 컬럼을 생성합니다:

```php
$table->timestamps(precision: 0);
```


#### `tinyIncrements()` {#column-method-tinyIncrements}

`tinyIncrements` 메서드는 자동 증가하는 `UNSIGNED TINYINT` 컬럼을 기본키로 생성합니다:

```php
$table->tinyIncrements('id');
```


#### `tinyInteger()` {#column-method-tinyInteger}

`tinyInteger` 메서드는 `TINYINT` 컬럼을 생성합니다:

```php
$table->tinyInteger('votes');
```


#### `tinyText()` {#column-method-tinyText}

`tinyText` 메서드는 `TINYTEXT` 컬럼을 생성합니다:

```php
$table->tinyText('notes');
```

MySQL 또는 MariaDB를 사용할 때, 컬럼에 `binary` 문자셋을 적용하여 `TINYBLOB` 컬럼을 생성할 수 있습니다:

```php
$table->tinyText('data')->charset('binary'); // TINYBLOB
```


#### `unsignedBigInteger()` {#column-method-unsignedBigInteger}

`unsignedBigInteger` 메서드는 `UNSIGNED BIGINT` 컬럼을 생성합니다:

```php
$table->unsignedBigInteger('votes');
```


#### `unsignedInteger()` {#column-method-unsignedInteger}

`unsignedInteger` 메서드는 `UNSIGNED INTEGER` 컬럼을 생성합니다:

```php
$table->unsignedInteger('votes');
```


#### `unsignedMediumInteger()` {#column-method-unsignedMediumInteger}

`unsignedMediumInteger` 메서드는 `UNSIGNED MEDIUMINT` 컬럼을 생성합니다:

```php
$table->unsignedMediumInteger('votes');
```


#### `unsignedSmallInteger()` {#column-method-unsignedSmallInteger}

`unsignedSmallInteger` 메서드는 `UNSIGNED SMALLINT` 컬럼을 생성합니다:

```php
$table->unsignedSmallInteger('votes');
```


#### `unsignedTinyInteger()` {#column-method-unsignedTinyInteger}

`unsignedTinyInteger` 메서드는 `UNSIGNED TINYINT` 컬럼을 생성합니다:

```php
$table->unsignedTinyInteger('votes');
```


#### `ulidMorphs()` {#column-method-ulidMorphs}

`ulidMorphs` 메서드는 `{column}_id` `CHAR(26)` 컬럼과 `{column}_type` `VARCHAR` 컬럼을 추가하는 편의 메서드입니다.

이 메서드는 ULID 식별자를 사용하는 다형성 [Eloquent 관계](/laravel/12.x/eloquent-relationships)에 필요한 컬럼을 정의할 때 사용합니다. 아래 예시에서는 `taggable_id`와 `taggable_type` 컬럼이 생성됩니다:

```php
$table->ulidMorphs('taggable');
```


#### `uuidMorphs()` {#column-method-uuidMorphs}

`uuidMorphs` 메서드는 `{column}_id` `CHAR(36)` 컬럼과 `{column}_type` `VARCHAR` 컬럼을 추가하는 편의 메서드입니다.

이 메서드는 UUID 식별자를 사용하는 다형성 [Eloquent 관계](/laravel/12.x/eloquent-relationships)에 필요한 컬럼을 정의할 때 사용합니다. 아래 예시에서는 `taggable_id`와 `taggable_type` 컬럼이 생성됩니다:

```php
$table->uuidMorphs('taggable');
```


#### `ulid()` {#column-method-ulid}

`ulid` 메서드는 `ULID` 컬럼을 생성합니다:

```php
$table->ulid('id');
```


#### `uuid()` {#column-method-uuid}

`uuid` 메서드는 `UUID` 컬럼을 생성합니다:

```php
$table->uuid('id');
```


#### `vector()` {#column-method-vector}

`vector` 메서드는 `vector` 컬럼을 생성합니다:

```php
$table->vector('embedding', dimensions: 100);
```


#### `year()` {#column-method-year}

`year` 메서드는 `YEAR` 컬럼을 생성합니다:

```php
$table->year('birth_year');
```


### 컬럼 수정자 {#column-modifiers}

위에 나열된 컬럼 타입 외에도, 데이터베이스 테이블에 컬럼을 추가할 때 사용할 수 있는 여러 "수정자"가 있습니다. 예를 들어, 컬럼을 "nullable"로 만들려면 `nullable` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->string('email')->nullable();
});
```

다음 표는 사용 가능한 모든 컬럼 수정자를 포함합니다. 이 목록에는 [인덱스 수정자](#creating-indexes)는 포함되어 있지 않습니다:

<div class="overflow-auto">

| 수정자                              | 설명                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `->after('column')`                 | 다른 컬럼 "뒤에" 컬럼을 배치 (MariaDB / MySQL).                                           |
| `->autoIncrement()`                 | `INTEGER` 컬럼을 자동 증가(기본키)로 설정.                                                |
| `->charset('utf8mb4')`              | 컬럼의 문자셋 지정 (MariaDB / MySQL).                                                     |
| `->collation('utf8mb4_unicode_ci')` | 컬럼의 콜레이션 지정.                                                                     |
| `->comment('my comment')`           | 컬럼에 주석 추가 (MariaDB / MySQL / PostgreSQL).                                          |
| `->default($value)`                 | 컬럼의 "기본값" 지정.                                                                     |
| `->first()`                         | 컬럼을 테이블의 "첫 번째"로 배치 (MariaDB / MySQL).                                       |
| `->from($integer)`                  | 자동 증가 필드의 시작값 지정 (MariaDB / MySQL / PostgreSQL).                              |
| `->invisible()`                     | 컬럼을 `SELECT *` 쿼리에서 "보이지 않게" 설정 (MariaDB / MySQL).                          |
| `->nullable($value = true)`         | 컬럼에 `NULL` 값 삽입 허용.                                                               |
| `->storedAs($expression)`           | 저장된 생성 컬럼 생성 (MariaDB / MySQL / PostgreSQL / SQLite).                            |
| `->unsigned()`                      | `INTEGER` 컬럼을 `UNSIGNED`로 설정 (MariaDB / MySQL).                                     |
| `->useCurrent()`                    | `TIMESTAMP` 컬럼의 기본값을 `CURRENT_TIMESTAMP`로 설정.                                   |
| `->useCurrentOnUpdate()`            | 레코드가 업데이트될 때 `TIMESTAMP` 컬럼을 `CURRENT_TIMESTAMP`로 설정 (MariaDB / MySQL).   |
| `->virtualAs($expression)`          | 가상 생성 컬럼 생성 (MariaDB / MySQL / SQLite).                                           |
| `->generatedAs($expression)`        | 지정된 시퀀스 옵션으로 ID 컬럼 생성 (PostgreSQL).                                         |
| `->always()`                        | ID 컬럼에서 입력값보다 시퀀스 값을 우선시함 (PostgreSQL).                                 |

</div>


#### 기본값 표현식 {#default-expressions}

`default` 수정자는 값 또는 `Illuminate\Database\Query\Expression` 인스턴스를 받을 수 있습니다. `Expression` 인스턴스를 사용하면 Laravel이 값을 따옴표로 감싸지 않으므로 데이터베이스 전용 함수를 사용할 수 있습니다. 특히 JSON 컬럼에 기본값을 할당해야 할 때 유용합니다:

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->json('movies')->default(new Expression('(JSON_ARRAY())'));
            $table->timestamps();
        });
    }
};
```

> [!WARNING]
> 기본값 표현식 지원 여부는 데이터베이스 드라이버, 데이터베이스 버전, 필드 타입에 따라 다릅니다. 데이터베이스 문서를 참고하세요.


#### 컬럼 순서 {#column-order}

MariaDB 또는 MySQL 데이터베이스를 사용할 때, `after` 메서드를 사용하여 기존 컬럼 뒤에 컬럼을 추가할 수 있습니다:

```php
$table->after('password', function (Blueprint $table) {
    $table->string('address_line1');
    $table->string('address_line2');
    $table->string('city');
});
```


### 컬럼 수정 {#modifying-columns}

`change` 메서드를 사용하면 기존 컬럼의 타입과 속성을 수정할 수 있습니다. 예를 들어, `string` 컬럼의 크기를 늘리고 싶을 때 사용할 수 있습니다. `change` 메서드의 사용 예시는 다음과 같습니다. `name` 컬럼의 크기를 25에서 50으로 늘리려면, 컬럼의 새로운 상태를 정의한 후 `change` 메서드를 호출하면 됩니다:

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('name', 50)->change();
});
```

컬럼을 수정할 때는 유지하고 싶은 모든 수정자를 명시적으로 포함해야 하며, 누락된 속성은 삭제됩니다. 예를 들어, `unsigned`, `default`, `comment` 속성을 유지하려면 각 수정자를 명시적으로 호출해야 합니다:

```php
Schema::table('users', function (Blueprint $table) {
    $table->integer('votes')->unsigned()->default(1)->comment('my comment')->change();
});
```

`change` 메서드는 컬럼의 인덱스를 변경하지 않습니다. 따라서 컬럼을 수정할 때 인덱스 수정자를 명시적으로 추가하거나 삭제할 수 있습니다:

```php
// 인덱스 추가...
$table->bigIncrements('id')->primary()->change();

// 인덱스 삭제...
$table->char('postal_code', 10)->unique(false)->change();
```


### 컬럼 이름 변경 {#renaming-columns}

컬럼의 이름을 변경하려면, 스키마 빌더에서 제공하는 `renameColumn` 메서드를 사용할 수 있습니다:

```php
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('from', 'to');
});
```


### 컬럼 삭제 {#dropping-columns}

컬럼을 삭제하려면, 스키마 빌더의 `dropColumn` 메서드를 사용할 수 있습니다:

```php
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn('votes');
});
```

여러 컬럼을 한 번에 삭제하려면, 컬럼 이름 배열을 `dropColumn` 메서드에 전달하면 됩니다:

```php
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn(['votes', 'avatar', 'location']);
});
```


#### 사용 가능한 명령어 별칭 {#available-command-aliases}

Laravel은 일반적으로 사용되는 컬럼 타입 삭제와 관련된 여러 편리한 메서드를 제공합니다. 각 메서드는 아래 표에 설명되어 있습니다:

<div class="overflow-auto">

| 명령어                                 | 설명                                               |
| -------------------------------------- | -------------------------------------------------- |
| `$table->dropMorphs('morphable');`     | `morphable_id`와 `morphable_type` 컬럼 삭제.       |
| `$table->dropRememberToken();`         | `remember_token` 컬럼 삭제.                        |
| `$table->dropSoftDeletes();`           | `deleted_at` 컬럼 삭제.                            |
| `$table->dropSoftDeletesTz();`         | `dropSoftDeletes()` 메서드의 별칭.                 |
| `$table->dropTimestamps();`            | `created_at`과 `updated_at` 컬럼 삭제.             |
| `$table->dropTimestampsTz();`          | `dropTimestamps()` 메서드의 별칭.                  |

</div>


## 인덱스 {#indexes}


### 인덱스 생성 {#creating-indexes}

Laravel 스키마 빌더는 여러 종류의 인덱스를 지원합니다. 다음 예시는 새로운 `email` 컬럼을 생성하고, 해당 값이 유니크해야 함을 지정합니다. 인덱스를 생성하려면 컬럼 정의에 `unique` 메서드를 체이닝하면 됩니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('users', function (Blueprint $table) {
    $table->string('email')->unique();
});
```

또는, 컬럼을 정의한 후 인덱스를 생성할 수도 있습니다. 이 경우, 스키마 빌더 블루프린트에서 `unique` 메서드를 호출하면 됩니다. 이 메서드는 유니크 인덱스를 받을 컬럼 이름을 인자로 받습니다:

```php
$table->unique('email');
```

인덱스 메서드에 컬럼 배열을 전달하여 복합(또는 조합) 인덱스를 생성할 수도 있습니다:

```php
$table->index(['account_id', 'created_at']);
```

인덱스를 생성할 때, Laravel은 테이블, 컬럼 이름, 인덱스 타입을 기반으로 인덱스 이름을 자동으로 생성하지만, 두 번째 인자로 인덱스 이름을 직접 지정할 수도 있습니다:

```php
$table->unique('email', 'unique_email');
```


#### 사용 가능한 인덱스 타입 {#available-index-types}

Laravel의 스키마 빌더 블루프린트 클래스는 Laravel이 지원하는 각 인덱스 타입을 생성하는 메서드를 제공합니다. 각 인덱스 메서드는 인덱스 이름을 지정하는 선택적 두 번째 인자를 받을 수 있습니다. 생략하면, 인덱스에 사용된 테이블 및 컬럼 이름, 인덱스 타입을 기반으로 이름이 생성됩니다. 사용 가능한 각 인덱스 메서드는 아래 표에 설명되어 있습니다:

<div class="overflow-auto">

| 명령어                                            | 설명                                                        |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `$table->primary('id');`                         | 기본키 추가.                                                |
| `$table->primary(['id', 'parent_id']);`          | 복합키 추가.                                                |
| `$table->unique('email');`                       | 유니크 인덱스 추가.                                         |
| `$table->index('state');`                        | 인덱스 추가.                                                |
| `$table->fullText('body');`                      | 전문 인덱스 추가 (MariaDB / MySQL / PostgreSQL).            |
| `$table->fullText('body')->language('english');` | 지정 언어의 전문 인덱스 추가 (PostgreSQL).                  |
| `$table->spatialIndex('location');`              | 공간 인덱스 추가 (SQLite 제외).                             |

</div>


### 인덱스 이름 변경 {#renaming-indexes}

인덱스의 이름을 변경하려면, 스키마 빌더 블루프린트에서 제공하는 `renameIndex` 메서드를 사용할 수 있습니다. 이 메서드는 현재 인덱스 이름을 첫 번째 인자로, 원하는 이름을 두 번째 인자로 받습니다:

```php
$table->renameIndex('from', 'to')
```


### 인덱스 삭제 {#dropping-indexes}

인덱스를 삭제하려면, 인덱스의 이름을 지정해야 합니다. 기본적으로 Laravel은 테이블 이름, 인덱스된 컬럼 이름, 인덱스 타입을 기반으로 인덱스 이름을 자동으로 지정합니다. 예시는 다음과 같습니다:

<div class="overflow-auto">

| 명령어                                                | 설명                                                      |
| ----------------------------------------------------- | --------------------------------------------------------- |
| `$table->dropPrimary('users_id_primary');`            | "users" 테이블에서 기본키 삭제.                           |
| `$table->dropUnique('users_email_unique');`           | "users" 테이블에서 유니크 인덱스 삭제.                    |
| `$table->dropIndex('geo_state_index');`               | "geo" 테이블에서 기본 인덱스 삭제.                        |
| `$table->dropFullText('posts_body_fulltext');`        | "posts" 테이블에서 전문 인덱스 삭제.                      |
| `$table->dropSpatialIndex('geo_location_spatialindex');` | "geo" 테이블에서 공간 인덱스 삭제 (SQLite 제외).         |

</div>

인덱스를 삭제하는 메서드에 컬럼 배열을 전달하면, 테이블 이름, 컬럼, 인덱스 타입을 기반으로 관례적인 인덱스 이름이 생성됩니다:

```php
Schema::table('geo', function (Blueprint $table) {
    $table->dropIndex(['state']); // 'geo_state_index' 인덱스 삭제
});
```


### 외래 키 제약조건 {#foreign-key-constraints}

Laravel은 데이터베이스 수준에서 참조 무결성을 강제하는 외래 키 제약조건 생성도 지원합니다. 예를 들어, `posts` 테이블에 `users` 테이블의 `id` 컬럼을 참조하는 `user_id` 컬럼을 정의해보겠습니다:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::table('posts', function (Blueprint $table) {
    $table->unsignedBigInteger('user_id');

    $table->foreign('user_id')->references('id')->on('users');
});
```

이 문법은 다소 장황하므로, Laravel은 더 나은 개발자 경험을 위해 관례를 활용한 간결한 메서드를 추가로 제공합니다. `foreignId` 메서드를 사용하여 컬럼을 생성할 때, 위 예시는 다음과 같이 다시 쓸 수 있습니다:

```php
Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained();
});
```

`foreignId` 메서드는 `UNSIGNED BIGINT` 컬럼을 생성하며, `constrained` 메서드는 관례를 사용하여 참조되는 테이블과 컬럼을 결정합니다. 테이블 이름이 Laravel의 관례와 다르다면, `constrained` 메서드에 직접 지정할 수 있습니다. 또한, 생성되는 인덱스에 할당할 이름도 지정할 수 있습니다:

```php
Schema::table('posts', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained(
        table: 'users', indexName: 'posts_user_id'
    );
});
```

제약조건의 "on delete" 및 "on update" 속성에 원하는 동작을 지정할 수도 있습니다:

```php
$table->foreignId('user_id')
    ->constrained()
    ->onUpdate('cascade')
    ->onDelete('cascade');
```

이러한 동작을 위한 대안적이고 표현적인 문법도 제공됩니다:

<div class="overflow-auto">

| 메서드                          | 설명                                               |
| ------------------------------- | -------------------------------------------------- |
| `$table->cascadeOnUpdate();`     | 업데이트 시 연쇄적으로 변경.                       |
| `$table->restrictOnUpdate();`    | 업데이트 제한.                                     |
| `$table->nullOnUpdate();`        | 업데이트 시 외래 키 값을 null로 설정.              |
| `$table->noActionOnUpdate();`    | 업데이트 시 아무 동작 없음.                        |
| `$table->cascadeOnDelete();`     | 삭제 시 연쇄적으로 삭제.                           |
| `$table->restrictOnDelete();`    | 삭제 제한.                                         |
| `$table->nullOnDelete();`        | 삭제 시 외래 키 값을 null로 설정.                  |
| `$table->noActionOnDelete();`    | 자식 레코드가 있으면 삭제 방지.                    |

</div>

추가적인 [컬럼 수정자](#column-modifiers)는 반드시 `constrained` 메서드 호출 전에 사용해야 합니다:

```php
$table->foreignId('user_id')
    ->nullable()
    ->constrained();
```


#### 외래 키 삭제 {#dropping-foreign-keys}

외래 키를 삭제하려면, 삭제할 외래 키 제약조건의 이름을 인자로 전달하여 `dropForeign` 메서드를 사용할 수 있습니다. 외래 키 제약조건은 인덱스와 동일한 명명 규칙을 사용합니다. 즉, 제약조건 이름은 테이블 이름과 컬럼 이름, 그리고 "\_foreign" 접미사로 구성됩니다:

```php
$table->dropForeign('posts_user_id_foreign');
```

또는, 외래 키를 가진 컬럼 이름을 배열로 `dropForeign` 메서드에 전달할 수도 있습니다. 배열은 Laravel의 제약조건 명명 규칙을 사용하여 외래 키 제약조건 이름으로 변환됩니다:

```php
$table->dropForeign(['user_id']);
```


#### 외래 키 제약조건 토글 {#toggling-foreign-key-constraints}

마이그레이션 내에서 다음 메서드를 사용하여 외래 키 제약조건을 활성화 또는 비활성화할 수 있습니다:

```php
Schema::enableForeignKeyConstraints();

Schema::disableForeignKeyConstraints();

Schema::withoutForeignKeyConstraints(function () {
    // 이 클로저 내에서는 제약조건이 비활성화됩니다...
});
```

> [!WARNING]
> SQLite는 기본적으로 외래 키 제약조건을 비활성화합니다. SQLite를 사용할 때는 마이그레이션에서 외래 키를 생성하기 전에 [외래 키 지원을 활성화](/laravel/12.x/database#configuration)해야 합니다.


## 이벤트 {#events}

편의를 위해, 각 마이그레이션 작업은 [이벤트](/laravel/12.x/events)를 디스패치합니다. 아래의 모든 이벤트는 기본 `Illuminate\Database\Events\MigrationEvent` 클래스를 확장합니다:

<div class="overflow-auto">

| 클래스                                         | 설명                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| `Illuminate\Database\Events\MigrationsStarted` | 마이그레이션 배치가 실행되기 직전.                |
| `Illuminate\Database\Events\MigrationsEnded`   | 마이그레이션 배치 실행 완료.                      |
| `Illuminate\Database\Events\MigrationStarted`  | 단일 마이그레이션이 실행되기 직전.                |
| `Illuminate\Database\Events\MigrationEnded`    | 단일 마이그레이션 실행 완료.                      |
| `Illuminate\Database\Events\NoPendingMigrations` | 실행할 마이그레이션이 없음.                     |
| `Illuminate\Database\Events\SchemaDumped`      | 데이터베이스 스키마 덤프 완료.                    |
| `Illuminate\Database\Events\SchemaLoaded`      | 기존 데이터베이스 스키마 덤프 로드 완료.          |

</div>
