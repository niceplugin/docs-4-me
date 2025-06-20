# 데이터베이스: 시작하기














## 소개 {#introduction}

거의 모든 현대 웹 애플리케이션은 데이터베이스와 상호작용합니다. Laravel은 지원되는 다양한 데이터베이스에서 원시 SQL, [유연한 쿼리 빌더](/laravel/12.x/queries), [Eloquent ORM](/laravel/12.x/eloquent)를 사용하여 데이터베이스와의 상호작용을 매우 간단하게 만들어줍니다. 현재 Laravel은 다음 다섯 가지 데이터베이스에 대한 1차 지원을 제공합니다:

<div class="content-list" markdown="1">

- MariaDB 10.3+ ([버전 정책](https://mariadb.org/about/#maintenance-policy))
- MySQL 5.7+ ([버전 정책](https://en.wikipedia.org/wiki/MySQL#Release_history))
- PostgreSQL 10.0+ ([버전 정책](https://www.postgresql.org/support/versioning/))
- SQLite 3.26.0+
- SQL Server 2017+ ([버전 정책](https://docs.microsoft.com/en-us/lifecycle/products/?products=sql-server))

</div>

추가로, MongoDB는 공식적으로 MongoDB에서 관리하는 `mongodb/laravel-mongodb` 패키지를 통해 지원됩니다. 자세한 내용은 [Laravel MongoDB](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/) 문서를 참고하세요.


### 설정 {#configuration}

Laravel의 데이터베이스 서비스 설정은 애플리케이션의 `config/database.php` 설정 파일에 위치합니다. 이 파일에서 모든 데이터베이스 연결을 정의할 수 있으며, 기본적으로 사용할 연결도 지정할 수 있습니다. 이 파일 내 대부분의 설정 옵션은 애플리케이션의 환경 변수 값에 의해 결정됩니다. Laravel이 지원하는 대부분의 데이터베이스 시스템에 대한 예제가 이 파일에 제공되어 있습니다.

기본적으로, Laravel의 샘플 [환경 설정](/laravel/12.x/configuration#environment-configuration)은 [Laravel Sail](/laravel/12.x/sail)과 함께 사용할 준비가 되어 있습니다. Sail은 로컬 머신에서 Laravel 애플리케이션을 개발하기 위한 Docker 설정입니다. 하지만, 필요에 따라 로컬 데이터베이스에 맞게 데이터베이스 설정을 자유롭게 수정할 수 있습니다.


#### SQLite 설정 {#sqlite-configuration}

SQLite 데이터베이스는 파일 시스템 내의 단일 파일에 저장됩니다. 터미널에서 `touch` 명령어를 사용하여 새로운 SQLite 데이터베이스를 생성할 수 있습니다: `touch database/database.sqlite`. 데이터베이스가 생성된 후, 환경 변수의 `DB_DATABASE`에 데이터베이스의 절대 경로를 지정하여 쉽게 환경 변수를 설정할 수 있습니다:

```ini
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

기본적으로, SQLite 연결에 대해 외래 키 제약 조건이 활성화되어 있습니다. 이를 비활성화하려면 `DB_FOREIGN_KEYS` 환경 변수를 `false`로 설정하면 됩니다:

```ini
DB_FOREIGN_KEYS=false
```

> [!NOTE]
> [Laravel 설치 프로그램](/laravel/12.x/installation#creating-a-laravel-project)으로 Laravel 애플리케이션을 생성하고 데이터베이스로 SQLite를 선택하면, Laravel이 자동으로 `database/database.sqlite` 파일을 생성하고 기본 [데이터베이스 마이그레이션](/laravel/12.x/migrations)을 실행합니다.


#### Microsoft SQL Server 설정 {#mssql-configuration}

Microsoft SQL Server 데이터베이스를 사용하려면, `sqlsrv` 및 `pdo_sqlsrv` PHP 확장과 Microsoft SQL ODBC 드라이버와 같은 필요한 의존성이 설치되어 있는지 확인해야 합니다.


#### URL을 사용한 설정 {#configuration-using-urls}

일반적으로 데이터베이스 연결은 `host`, `database`, `username`, `password` 등 여러 설정 값을 사용하여 구성합니다. 각 설정 값은 해당하는 환경 변수를 가지고 있습니다. 즉, 프로덕션 서버에서 데이터베이스 연결 정보를 구성할 때 여러 환경 변수를 관리해야 합니다.

AWS, Heroku와 같은 일부 관리형 데이터베이스 제공업체는 데이터베이스의 모든 연결 정보를 하나의 문자열로 포함하는 단일 데이터베이스 "URL"을 제공합니다. 예시 데이터베이스 URL은 다음과 같습니다:

```html
mysql://root:password@127.0.0.1/forge?charset=UTF-8
```

이러한 URL은 일반적으로 표준 스키마 규칙을 따릅니다:

```html
driver://username:password@host:port/database?options
```

편의를 위해, Laravel은 여러 설정 옵션 대신 이러한 URL을 지원합니다. `url`(또는 해당하는 `DB_URL` 환경 변수) 설정 옵션이 존재하면, 이를 사용하여 데이터베이스 연결 및 인증 정보를 추출합니다.


### 읽기 및 쓰기 연결 {#read-and-write-connections}

때때로 SELECT 문에는 하나의 데이터베이스 연결을, INSERT, UPDATE, DELETE 문에는 다른 연결을 사용하고 싶을 수 있습니다. Laravel은 이를 매우 쉽게 처리할 수 있으며, 원시 쿼리, 쿼리 빌더, Eloquent ORM을 사용할 때 항상 올바른 연결이 사용됩니다.

읽기/쓰기 연결을 어떻게 설정하는지 예제를 통해 살펴보겠습니다:

```php
'mysql' => [
    'read' => [
        'host' => [
            '192.168.1.1',
            '196.168.1.2',
        ],
    ],
    'write' => [
        'host' => [
            '196.168.1.3',
        ],
    ],
    'sticky' => true,

    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'unix_socket' => env('DB_SOCKET', ''),
    'charset' => env('DB_CHARSET', 'utf8mb4'),
    'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
    'prefix' => '',
    'prefix_indexes' => true,
    'strict' => true,
    'engine' => null,
    'options' => extension_loaded('pdo_mysql') ? array_filter([
        PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
    ]) : [],
],
```

설정 배열에 `read`, `write`, `sticky`라는 세 가지 키가 추가된 것을 알 수 있습니다. `read`와 `write` 키는 각각 `host`라는 단일 키를 포함하는 배열 값을 가집니다. `read`와 `write` 연결의 나머지 데이터베이스 옵션은 기본 `mysql` 설정 배열에서 병합됩니다.

기본 `mysql` 배열의 값을 재정의하고 싶을 때만 `read`와 `write` 배열에 항목을 추가하면 됩니다. 이 예제에서는 "read" 연결의 호스트로 `192.168.1.1`이, "write" 연결의 호스트로 `192.168.1.3`이 사용됩니다. 데이터베이스 인증 정보, 접두사, 문자셋 등 기본 `mysql` 배열의 모든 옵션은 두 연결에서 공유됩니다. `host` 설정 배열에 여러 값이 있을 경우, 각 요청마다 데이터베이스 호스트가 무작위로 선택됩니다.


#### `sticky` 옵션 {#the-sticky-option}

`sticky` 옵션은 *선택적* 값으로, 현재 요청 사이클 동안 데이터베이스에 기록된 레코드를 즉시 읽을 수 있도록 해줍니다. `sticky` 옵션이 활성화되어 있고, 현재 요청 사이클에서 "write" 작업이 수행된 경우, 이후의 모든 "read" 작업은 "write" 연결을 사용합니다. 이를 통해 요청 사이클 내에서 기록된 데이터를 즉시 데이터베이스에서 읽어올 수 있습니다. 이 동작이 애플리케이션에 필요한지 여부는 직접 결정해야 합니다.


## SQL 쿼리 실행 {#running-queries}

데이터베이스 연결을 설정한 후에는 `DB` 파사드를 사용하여 쿼리를 실행할 수 있습니다. `DB` 파사드는 각 쿼리 유형에 대한 메서드를 제공합니다: `select`, `update`, `insert`, `delete`, `statement`.


#### Select 쿼리 실행 {#running-a-select-query}

기본 SELECT 쿼리를 실행하려면, `DB` 파사드의 `select` 메서드를 사용할 수 있습니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 애플리케이션의 모든 사용자 목록을 보여줍니다.
     */
    public function index(): View
    {
        $users = DB::select('select * from users where active = ?', [1]);

        return view('user.index', ['users' => $users]);
    }
}
```

`select` 메서드의 첫 번째 인자는 SQL 쿼리이며, 두 번째 인자는 쿼리에 바인딩할 파라미터입니다. 일반적으로 이는 `where` 절의 값입니다. 파라미터 바인딩은 SQL 인젝션으로부터 보호해줍니다.

`select` 메서드는 항상 결과의 `array`를 반환합니다. 배열 내 각 결과는 데이터베이스의 레코드를 나타내는 PHP `stdClass` 객체입니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::select('select * from users');

foreach ($users as $user) {
    echo $user->name;
}
```


#### 스칼라 값 선택 {#selecting-scalar-values}

때로는 데이터베이스 쿼리 결과가 단일 스칼라 값일 수 있습니다. 쿼리의 스칼라 결과를 레코드 객체에서 추출할 필요 없이, Laravel의 `scalar` 메서드를 사용하여 이 값을 직접 가져올 수 있습니다:

```php
$burgers = DB::scalar(
    "select count(case when food = 'burger' then 1 end) as burgers from menu"
);
```


#### 여러 결과 집합 선택 {#selecting-multiple-result-sets}

애플리케이션에서 여러 결과 집합을 반환하는 저장 프로시저를 호출하는 경우, `selectResultSets` 메서드를 사용하여 저장 프로시저가 반환한 모든 결과 집합을 가져올 수 있습니다:

```php
[$options, $notifications] = DB::selectResultSets(
    "CALL get_user_options_and_notifications(?)", $request->user()->id
);
```


#### 명명된 바인딩 사용 {#using-named-bindings}

파라미터 바인딩에 `?` 대신 명명된 바인딩을 사용할 수도 있습니다:

```php
$results = DB::select('select * from users where id = :id', ['id' => 1]);
```


#### Insert 문 실행 {#running-an-insert-statement}

`insert` 문을 실행하려면, `DB` 파사드의 `insert` 메서드를 사용할 수 있습니다. `select`와 마찬가지로, 첫 번째 인자는 SQL 쿼리, 두 번째 인자는 바인딩입니다:

```php
use Illuminate\Support\Facades\DB;

DB::insert('insert into users (id, name) values (?, ?)', [1, 'Marc']);
```


#### Update 문 실행 {#running-an-update-statement}

`update` 메서드는 데이터베이스의 기존 레코드를 업데이트할 때 사용합니다. 이 메서드는 영향을 받은 행의 수를 반환합니다:

```php
use Illuminate\Support\Facades\DB;

$affected = DB::update(
    'update users set votes = 100 where name = ?',
    ['Anita']
);
```


#### Delete 문 실행 {#running-a-delete-statement}

`delete` 메서드는 데이터베이스에서 레코드를 삭제할 때 사용합니다. `update`와 마찬가지로, 영향을 받은 행의 수를 반환합니다:

```php
use Illuminate\Support\Facades\DB;

$deleted = DB::delete('delete from users');
```


#### 일반 Statement 실행 {#running-a-general-statement}

일부 데이터베이스 명령문은 값을 반환하지 않습니다. 이러한 작업에는 `DB` 파사드의 `statement` 메서드를 사용할 수 있습니다:

```php
DB::statement('drop table users');
```


#### 준비되지 않은 Statement 실행 {#running-an-unprepared-statement}

때로는 값을 바인딩하지 않고 SQL 문을 실행하고 싶을 수 있습니다. 이럴 때는 `DB` 파사드의 `unprepared` 메서드를 사용할 수 있습니다:

```php
DB::unprepared('update users set votes = 100 where name = "Dries"');
```

> [!WARNING]
> 준비되지 않은 문은 파라미터를 바인딩하지 않으므로 SQL 인젝션에 취약할 수 있습니다. 사용자 제어 값이 준비되지 않은 문에 포함되지 않도록 해야 합니다.


#### 암시적 커밋 {#implicit-commits-in-transactions}

트랜잭션 내에서 `DB` 파사드의 `statement` 및 `unprepared` 메서드를 사용할 때는 [암시적 커밋](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)을 유발하는 명령문을 피해야 합니다. 이러한 명령문은 데이터베이스 엔진이 전체 트랜잭션을 간접적으로 커밋하게 하여, Laravel이 데이터베이스의 트랜잭션 레벨을 인식하지 못하게 만듭니다. 예를 들어, 데이터베이스 테이블을 생성하는 명령문이 이에 해당합니다:

```php
DB::unprepared('create table a (col varchar(1) null)');
```

암시적 커밋을 유발하는 모든 명령문 목록은 MySQL 매뉴얼의 [해당 문서](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)를 참고하세요.


### 여러 데이터베이스 연결 사용 {#using-multiple-database-connections}

애플리케이션의 `config/database.php` 설정 파일에 여러 연결이 정의되어 있다면, `DB` 파사드의 `connection` 메서드를 통해 각 연결에 접근할 수 있습니다. `connection` 메서드에 전달하는 연결 이름은 `config/database.php` 파일에 나열된 연결 중 하나이거나, 런타임에 `config` 헬퍼로 설정된 연결이어야 합니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::connection('sqlite')->select(/* ... */);
```

연결 인스턴스의 `getPdo` 메서드를 사용하여 원시 PDO 인스턴스에 접근할 수 있습니다:

```php
$pdo = DB::connection()->getPdo();
```


### 쿼리 이벤트 리스닝 {#listening-for-query-events}

애플리케이션에서 실행되는 각 SQL 쿼리에 대해 호출되는 클로저를 지정하고 싶다면, `DB` 파사드의 `listen` 메서드를 사용할 수 있습니다. 이 메서드는 쿼리 로깅이나 디버깅에 유용합니다. 쿼리 리스너 클로저는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 등록할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 등록
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스 부트스트랩
     */
    public function boot(): void
    {
        DB::listen(function (QueryExecuted $query) {
            // $query->sql;
            // $query->bindings;
            // $query->time;
            // $query->toRawSql();
        });
    }
}
```


### 누적 쿼리 시간 모니터링 {#monitoring-cumulative-query-time}

현대 웹 애플리케이션의 일반적인 성능 병목은 데이터베이스 쿼리에 소요되는 시간입니다. 다행히도, Laravel은 단일 요청 중 데이터베이스 쿼리에 너무 많은 시간이 소요될 때 원하는 클로저나 콜백을 호출할 수 있습니다. 시작하려면, `whenQueryingForLongerThan` 메서드에 쿼리 시간 임계값(밀리초 단위)과 클로저를 전달하세요. 이 메서드는 [서비스 프로바이더](/laravel/12.x/providers)의 `boot` 메서드에서 호출할 수 있습니다:

```php
<?php

namespace App\Providers;

use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Events\QueryExecuted;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스 등록
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스 부트스트랩
     */
    public function boot(): void
    {
        DB::whenQueryingForLongerThan(500, function (Connection $connection, QueryExecuted $event) {
            // 개발팀에 알림 전송...
        });
    }
}
```


## 데이터베이스 트랜잭션 {#database-transactions}

`DB` 파사드가 제공하는 `transaction` 메서드를 사용하여 데이터베이스 트랜잭션 내에서 일련의 작업을 실행할 수 있습니다. 트랜잭션 클로저 내에서 예외가 발생하면, 트랜잭션은 자동으로 롤백되고 예외가 다시 발생합니다. 클로저가 성공적으로 실행되면, 트랜잭션은 자동으로 커밋됩니다. `transaction` 메서드를 사용할 때는 수동으로 롤백하거나 커밋할 필요가 없습니다:

```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    DB::update('update users set votes = 1');

    DB::delete('delete from posts');
});
```


#### 교착 상태 처리 {#handling-deadlocks}

`transaction` 메서드는 선택적으로 두 번째 인자를 받을 수 있으며, 이는 교착 상태가 발생했을 때 트랜잭션을 재시도할 횟수를 정의합니다. 이 시도가 모두 소진되면 예외가 발생합니다:

```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    DB::update('update users set votes = 1');

    DB::delete('delete from posts');
}, 5);
```


#### 트랜잭션 수동 사용 {#manually-using-transactions}

트랜잭션을 수동으로 시작하고 롤백 및 커밋을 완전히 제어하고 싶다면, `DB` 파사드의 `beginTransaction` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

DB::beginTransaction();
```

`rollBack` 메서드를 통해 트랜잭션을 롤백할 수 있습니다:

```php
DB::rollBack();
```

마지막으로, `commit` 메서드를 통해 트랜잭션을 커밋할 수 있습니다:

```php
DB::commit();
```

> [!NOTE]
> `DB` 파사드의 트랜잭션 메서드는 [쿼리 빌더](/laravel/12.x/queries)와 [Eloquent ORM](/laravel/12.x/eloquent) 모두의 트랜잭션을 제어합니다.


## 데이터베이스 CLI 연결 {#connecting-to-the-database-cli}

데이터베이스의 CLI에 연결하고 싶다면, `db` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan db
```

필요하다면, 기본 연결이 아닌 다른 데이터베이스 연결에 접속하기 위해 연결 이름을 지정할 수 있습니다:

```shell
php artisan db mysql
```


## 데이터베이스 검사 {#inspecting-your-databases}

`db:show` 및 `db:table` Artisan 명령어를 사용하여 데이터베이스와 관련 테이블에 대한 유용한 정보를 얻을 수 있습니다. 데이터베이스의 개요(크기, 유형, 열린 연결 수, 테이블 요약 등)를 확인하려면 `db:show` 명령어를 사용할 수 있습니다:

```shell
php artisan db:show
```

`--database` 옵션을 통해 검사할 데이터베이스 연결 이름을 명령어에 전달할 수 있습니다:

```shell
php artisan db:show --database=pgsql
```

명령어 출력에 테이블 행 수와 데이터베이스 뷰 세부 정보를 포함하려면 각각 `--counts` 및 `--views` 옵션을 사용할 수 있습니다. 대용량 데이터베이스에서는 행 수 및 뷰 세부 정보를 가져오는 데 시간이 오래 걸릴 수 있습니다:

```shell
php artisan db:show --counts --views
```

또한, 다음과 같은 `Schema` 메서드를 사용하여 데이터베이스를 검사할 수 있습니다:

```php
use Illuminate\Support\Facades\Schema;

$tables = Schema::getTables();
$views = Schema::getViews();
$columns = Schema::getColumns('users');
$indexes = Schema::getIndexes('users');
$foreignKeys = Schema::getForeignKeys('users');
```

애플리케이션의 기본 연결이 아닌 데이터베이스 연결을 검사하고 싶다면, `connection` 메서드를 사용할 수 있습니다:

```php
$columns = Schema::connection('sqlite')->getColumns('users');
```


#### 테이블 개요 {#table-overview}

데이터베이스 내 개별 테이블의 개요를 확인하고 싶다면, `db:table` Artisan 명령어를 실행할 수 있습니다. 이 명령어는 테이블의 컬럼, 타입, 속성, 키, 인덱스 등 테이블에 대한 일반적인 개요를 제공합니다:

```shell
php artisan db:table users
```


## 데이터베이스 모니터링 {#monitoring-your-databases}

`db:monitor` Artisan 명령어를 사용하면, 데이터베이스가 지정된 개수 이상의 열린 연결을 관리할 경우 `Illuminate\Database\Events\DatabaseBusy` 이벤트를 Laravel이 디스패치하도록 할 수 있습니다.

먼저, `db:monitor` 명령어를 [매 분마다 실행](/laravel/12.x/scheduling)되도록 스케줄링해야 합니다. 이 명령어는 모니터링할 데이터베이스 연결 구성 이름과 이벤트를 디스패치하기 전에 허용할 최대 열린 연결 수를 인자로 받습니다:

```shell
php artisan db:monitor --databases=mysql,pgsql --max=100
```

이 명령어를 스케줄링하는 것만으로는 열린 연결 수에 대한 알림이 트리거되지 않습니다. 명령어가 임계값을 초과하는 열린 연결 수를 가진 데이터베이스를 발견하면, `DatabaseBusy` 이벤트가 디스패치됩니다. 이 이벤트를 애플리케이션의 `AppServiceProvider`에서 리스닝하여, 개발팀이나 본인에게 알림을 전송할 수 있습니다:

```php
use App\Notifications\DatabaseApproachingMaxConnections;
use Illuminate\Database\Events\DatabaseBusy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

/**
 * 애플리케이션 서비스 부트스트랩
 */
public function boot(): void
{
    Event::listen(function (DatabaseBusy $event) {
        Notification::route('mail', 'dev@example.com')
            ->notify(new DatabaseApproachingMaxConnections(
                $event->connectionName,
                $event->connections
            ));
    });
}
```
