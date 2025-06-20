# 데이터베이스: 쿼리 빌더






































## 소개 {#introduction}

Laravel의 데이터베이스 쿼리 빌더는 데이터베이스 쿼리를 생성하고 실행하기 위한 편리하고 유연한 인터페이스를 제공합니다. 애플리케이션에서 대부분의 데이터베이스 작업을 수행할 수 있으며, Laravel이 지원하는 모든 데이터베이스 시스템과 완벽하게 호환됩니다.

Laravel 쿼리 빌더는 PDO 파라미터 바인딩을 사용하여 SQL 인젝션 공격으로부터 애플리케이션을 보호합니다. 쿼리 빌더에 전달되는 문자열을 별도로 정리하거나 필터링할 필요가 없습니다.

> [!WARNING]
> PDO는 컬럼 이름 바인딩을 지원하지 않습니다. 따라서 사용자 입력이 쿼리에서 참조되는 컬럼 이름(예: "order by" 컬럼 등)을 결정하도록 해서는 안 됩니다.


## 데이터베이스 쿼리 실행 {#running-database-queries}


#### 테이블의 모든 행 조회 {#retrieving-all-rows-from-a-table}

`DB` 파사드에서 제공하는 `table` 메서드를 사용하여 쿼리를 시작할 수 있습니다. `table` 메서드는 지정한 테이블에 대한 유연한 쿼리 빌더 인스턴스를 반환하며, 쿼리에 더 많은 제약 조건을 체이닝한 후 `get` 메서드를 사용해 쿼리 결과를 조회할 수 있습니다:

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
        $users = DB::table('users')->get();

        return view('user.index', ['users' => $users]);
    }
}
```

`get` 메서드는 쿼리 결과를 담고 있는 `Illuminate\Support\Collection` 인스턴스를 반환하며, 각 결과는 PHP의 `stdClass` 객체입니다. 각 컬럼의 값은 객체의 프로퍼티로 접근할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')->get();

foreach ($users as $user) {
    echo $user->name;
}
```

> [!NOTE]
> Laravel 컬렉션은 데이터 매핑 및 축소를 위한 매우 강력한 다양한 메서드를 제공합니다. Laravel 컬렉션에 대한 자세한 내용은 [컬렉션 문서](/laravel/12.x/collections)를 참고하세요.


#### 테이블에서 단일 행/컬럼 조회 {#retrieving-a-single-row-column-from-a-table}

데이터베이스 테이블에서 단일 행만 조회해야 한다면, `DB` 파사드의 `first` 메서드를 사용할 수 있습니다. 이 메서드는 단일 `stdClass` 객체를 반환합니다:

```php
$user = DB::table('users')->where('name', 'John')->first();

return $user->email;
```

데이터베이스 테이블에서 단일 행을 조회하되, 일치하는 행이 없을 경우 `Illuminate\Database\RecordNotFoundException`을 발생시키고 싶다면 `firstOrFail` 메서드를 사용할 수 있습니다. `RecordNotFoundException`이 잡히지 않으면, 404 HTTP 응답이 자동으로 클라이언트에 전송됩니다:

```php
$user = DB::table('users')->where('name', 'John')->firstOrFail();
```

전체 행이 필요하지 않은 경우, `value` 메서드를 사용하여 레코드에서 단일 값을 추출할 수 있습니다. 이 메서드는 해당 컬럼의 값을 직접 반환합니다:

```php
$email = DB::table('users')->where('name', 'John')->value('email');
```

`id` 컬럼 값으로 단일 행을 조회하려면, `find` 메서드를 사용하세요:

```php
$user = DB::table('users')->find(3);
```


#### 컬럼 값 목록 조회 {#retrieving-a-list-of-column-values}

단일 컬럼의 값만 담긴 `Illuminate\Support\Collection` 인스턴스를 조회하고 싶다면, `pluck` 메서드를 사용할 수 있습니다. 이 예제에서는 사용자 타이틀 컬렉션을 조회합니다:

```php
use Illuminate\Support\Facades\DB;

$titles = DB::table('users')->pluck('title');

foreach ($titles as $title) {
    echo $title;
}
```

`pluck` 메서드에 두 번째 인자를 제공하여 결과 컬렉션의 키로 사용할 컬럼을 지정할 수 있습니다:

```php
$titles = DB::table('users')->pluck('title', 'name');

foreach ($titles as $name => $title) {
    echo $title;
}
```


### 결과 청크 처리 {#chunking-results}

수천 개의 데이터베이스 레코드를 다뤄야 할 경우, `DB` 파사드에서 제공하는 `chunk` 메서드 사용을 고려하세요. 이 메서드는 한 번에 작은 청크 단위로 결과를 조회하고, 각 청크를 클로저에 전달하여 처리합니다. 예를 들어, `users` 테이블 전체를 한 번에 100개씩 청크로 조회할 수 있습니다:

```php
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

DB::table('users')->orderBy('id')->chunk(100, function (Collection $users) {
    foreach ($users as $user) {
        // ...
    }
});
```

클로저에서 `false`를 반환하면 이후 청크 처리가 중단됩니다:

```php
DB::table('users')->orderBy('id')->chunk(100, function (Collection $users) {
    // 레코드 처리...

    return false;
});
```

청크 처리 중에 데이터베이스 레코드를 업데이트하는 경우, 청크 결과가 예기치 않게 변경될 수 있습니다. 조회한 레코드를 청크 처리 중에 업데이트할 계획이라면, 항상 `chunkById` 메서드를 사용하는 것이 좋습니다. 이 메서드는 레코드의 기본 키를 기준으로 자동으로 결과를 페이지네이션합니다:

```php
DB::table('users')->where('active', false)
    ->chunkById(100, function (Collection $users) {
        foreach ($users as $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['active' => true]);
        }
    });
```

`chunkById` 및 `lazyById` 메서드는 쿼리에 자체적으로 "where" 조건을 추가하므로, 일반적으로 [논리적 그룹화](#logical-grouping)를 위해 클로저 내에 직접 조건을 묶어야 합니다:

```php
DB::table('users')->where(function ($query) {
    $query->where('credits', 1)->orWhere('credits', 2);
})->chunkById(100, function (Collection $users) {
    foreach ($users as $user) {
        DB::table('users')
            ->where('id', $user->id)
            ->update(['credits' => 3]);
    }
});
```

> [!WARNING]
> 청크 콜백 내에서 레코드를 업데이트하거나 삭제할 때, 기본 키 또는 외래 키가 변경되면 청크 쿼리에 영향을 줄 수 있습니다. 이로 인해 일부 레코드가 청크 결과에 포함되지 않을 수 있습니다.


### 결과를 지연 스트리밍하기 {#streaming-results-lazily}

`lazy` 메서드는 [chunk 메서드](#chunking-results)와 유사하게 쿼리를 청크 단위로 실행합니다. 하지만 각 청크를 콜백에 전달하는 대신, `lazy()` 메서드는 [LazyCollection](/laravel/12.x/collections#lazy-collections)을 반환하여 결과를 하나의 스트림처럼 다룰 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

DB::table('users')->orderBy('id')->lazy()->each(function (object $user) {
    // ...
});
```

마찬가지로, 조회한 레코드를 순회하면서 업데이트할 계획이라면 `lazyById` 또는 `lazyByIdDesc` 메서드를 사용하는 것이 가장 좋습니다. 이 메서드들은 레코드의 기본 키를 기준으로 자동으로 결과를 페이지네이션합니다:

```php
DB::table('users')->where('active', false)
    ->lazyById()->each(function (object $user) {
        DB::table('users')
            ->where('id', $user->id)
            ->update(['active' => true]);
    });
```

> [!WARNING]
> 레코드를 순회하면서 업데이트하거나 삭제할 때, 기본 키 또는 외래 키가 변경되면 청크 쿼리에 영향을 줄 수 있습니다. 이로 인해 일부 레코드가 결과에 포함되지 않을 수 있습니다.


### 집계 {#aggregates}

쿼리 빌더는 `count`, `max`, `min`, `avg`, `sum`과 같은 집계 값을 조회하기 위한 다양한 메서드도 제공합니다. 쿼리를 작성한 후 이 메서드들을 호출할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')->count();

$price = DB::table('orders')->max('price');
```

물론, 다른 절과 결합하여 집계 값 계산 방식을 세밀하게 조정할 수 있습니다:

```php
$price = DB::table('orders')
    ->where('finalized', 1)
    ->avg('price');
```


#### 레코드 존재 여부 확인 {#determining-if-records-exist}

쿼리 조건에 일치하는 레코드가 존재하는지 확인할 때 `count` 메서드 대신 `exists` 및 `doesntExist` 메서드를 사용할 수 있습니다:

```php
if (DB::table('orders')->where('finalized', 1)->exists()) {
    // ...
}

if (DB::table('orders')->where('finalized', 1)->doesntExist()) {
    // ...
}
```


## Select 구문 {#select-statements}


#### Select 절 지정 {#specifying-a-select-clause}

항상 데이터베이스 테이블의 모든 컬럼을 선택할 필요는 없습니다. `select` 메서드를 사용하여 쿼리에 커스텀 "select" 절을 지정할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')
    ->select('name', 'email as user_email')
    ->get();
```

`distinct` 메서드를 사용하면 쿼리 결과를 중복 없이 반환하도록 강제할 수 있습니다:

```php
$users = DB::table('users')->distinct()->get();
```

이미 쿼리 빌더 인스턴스가 있고, 기존 select 절에 컬럼을 추가하고 싶다면 `addSelect` 메서드를 사용할 수 있습니다:

```php
$query = DB::table('users')->select('name');

$users = $query->addSelect('age')->get();
```


## Raw 표현식 {#raw-expressions}

때로는 쿼리에 임의의 문자열을 삽입해야 할 수도 있습니다. 이럴 때는 `DB` 파사드에서 제공하는 `raw` 메서드를 사용해 Raw 문자열 표현식을 생성할 수 있습니다:

```php
$users = DB::table('users')
    ->select(DB::raw('count(*) as user_count, status'))
    ->where('status', '<>', 1)
    ->groupBy('status')
    ->get();
```

> [!WARNING]
> Raw 구문은 쿼리에 문자열로 삽입되므로, SQL 인젝션 취약점이 발생하지 않도록 각별히 주의해야 합니다.


### Raw 메서드 {#raw-methods}

`DB::raw` 메서드 대신, 쿼리의 다양한 부분에 Raw 표현식을 삽입할 수 있는 다음 메서드들도 사용할 수 있습니다. **Raw 표현식을 사용하는 쿼리는 SQL 인젝션 취약점으로부터 보호된다는 보장을 Laravel이 할 수 없음을 기억하세요.**


#### `selectRaw` {#selectraw}

`selectRaw` 메서드는 `addSelect(DB::raw(/* ... */))` 대신 사용할 수 있습니다. 이 메서드는 두 번째 인자로 바인딩 배열을 선택적으로 받을 수 있습니다:

```php
$orders = DB::table('orders')
    ->selectRaw('price * ? as price_with_tax', [1.0825])
    ->get();
```


#### `whereRaw / orWhereRaw` {#whereraw-orwhereraw}

`whereRaw` 및 `orWhereRaw` 메서드는 쿼리에 Raw "where" 절을 삽입할 수 있습니다. 이 메서드들은 두 번째 인자로 바인딩 배열을 선택적으로 받을 수 있습니다:

```php
$orders = DB::table('orders')
    ->whereRaw('price > IF(state = "TX", ?, 100)', [200])
    ->get();
```


#### `havingRaw / orHavingRaw` {#havingraw-orhavingraw}

`havingRaw` 및 `orHavingRaw` 메서드는 "having" 절의 값으로 Raw 문자열을 제공할 수 있습니다. 이 메서드들은 두 번째 인자로 바인딩 배열을 선택적으로 받을 수 있습니다:

```php
$orders = DB::table('orders')
    ->select('department', DB::raw('SUM(price) as total_sales'))
    ->groupBy('department')
    ->havingRaw('SUM(price) > ?', [2500])
    ->get();
```


#### `orderByRaw` {#orderbyraw}

`orderByRaw` 메서드는 "order by" 절의 값으로 Raw 문자열을 제공할 수 있습니다:

```php
$orders = DB::table('orders')
    ->orderByRaw('updated_at - created_at DESC')
    ->get();
```


### `groupByRaw` {#groupbyraw}

`groupByRaw` 메서드는 `group by` 절의 값으로 Raw 문자열을 제공할 수 있습니다:

```php
$orders = DB::table('orders')
    ->select('city', 'state')
    ->groupByRaw('city, state')
    ->get();
```


## 조인 {#joins}


#### Inner Join 절 {#inner-join-clause}

쿼리 빌더를 사용해 쿼리에 조인 절을 추가할 수도 있습니다. 기본 "inner join"을 수행하려면 쿼리 빌더 인스턴스에서 `join` 메서드를 사용하세요. `join` 메서드의 첫 번째 인자는 조인할 테이블 이름이고, 나머지 인자들은 조인 조건을 지정합니다. 한 쿼리에서 여러 테이블을 조인할 수도 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', 'contacts.phone', 'orders.price')
    ->get();
```


#### Left Join / Right Join 절 {#left-join-right-join-clause}

"inner join" 대신 "left join" 또는 "right join"을 수행하려면 `leftJoin` 또는 `rightJoin` 메서드를 사용하세요. 이 메서드들은 `join` 메서드와 동일한 시그니처를 가집니다:

```php
$users = DB::table('users')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();

$users = DB::table('users')
    ->rightJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();
```


#### Cross Join 절 {#cross-join-clause}

"cross join"을 수행하려면 `crossJoin` 메서드를 사용할 수 있습니다. 크로스 조인은 첫 번째 테이블과 조인된 테이블 간의 데카르트 곱을 생성합니다:

```php
$sizes = DB::table('sizes')
    ->crossJoin('colors')
    ->get();
```


#### 고급 Join 절 {#advanced-join-clauses}

더 고급 조인 절을 지정할 수도 있습니다. 시작하려면 `join` 메서드의 두 번째 인자로 클로저를 전달하세요. 클로저는 `Illuminate\Database\Query\JoinClause` 인스턴스를 받아, "join" 절에 대한 제약 조건을 지정할 수 있습니다:

```php
DB::table('users')
    ->join('contacts', function (JoinClause $join) {
        $join->on('users.id', '=', 'contacts.user_id')->orOn(/* ... */);
    })
    ->get();
```

조인에서 "where" 절을 사용하려면, `JoinClause` 인스턴스에서 제공하는 `where` 및 `orWhere` 메서드를 사용할 수 있습니다. 이 메서드들은 두 컬럼을 비교하는 대신, 컬럼을 값과 비교합니다:

```php
DB::table('users')
    ->join('contacts', function (JoinClause $join) {
        $join->on('users.id', '=', 'contacts.user_id')
            ->where('contacts.user_id', '>', 5);
    })
    ->get();
```


#### 서브쿼리 조인 {#subquery-joins}

`joinSub`, `leftJoinSub`, `rightJoinSub` 메서드를 사용해 쿼리를 서브쿼리와 조인할 수 있습니다. 각 메서드는 세 개의 인자를 받습니다: 서브쿼리, 테이블 별칭, 그리고 관련 컬럼을 정의하는 클로저입니다. 이 예제에서는 각 사용자 레코드에 사용자의 가장 최근 게시글의 `created_at` 타임스탬프가 포함된 사용자 컬렉션을 조회합니다:

```php
$latestPosts = DB::table('posts')
    ->select('user_id', DB::raw('MAX(created_at) as last_post_created_at'))
    ->where('is_published', true)
    ->groupBy('user_id');

$users = DB::table('users')
    ->joinSub($latestPosts, 'latest_posts', function (JoinClause $join) {
        $join->on('users.id', '=', 'latest_posts.user_id');
    })->get();
```


#### Lateral 조인 {#lateral-joins}

> [!WARNING]
> Lateral 조인은 현재 PostgreSQL, MySQL >= 8.0.14, SQL Server에서 지원됩니다.

`joinLateral` 및 `leftJoinLateral` 메서드를 사용해 서브쿼리와 "lateral join"을 수행할 수 있습니다. 각 메서드는 두 개의 인자를 받습니다: 서브쿼리와 테이블 별칭입니다. 조인 조건은 주어진 서브쿼리의 `where` 절 내에서 지정해야 합니다. Lateral 조인은 각 행마다 평가되며, 서브쿼리 외부의 컬럼을 참조할 수 있습니다.

이 예제에서는 사용자와 해당 사용자의 최근 블로그 게시글 3개를 조회합니다. 각 사용자는 최대 3개의 결과 행을 가질 수 있습니다. 조인 조건은 서브쿼리 내의 `whereColumn` 절에서 현재 사용자 행을 참조합니다:

```php
$latestPosts = DB::table('posts')
    ->select('id as post_id', 'title as post_title', 'created_at as post_created_at')
    ->whereColumn('user_id', 'users.id')
    ->orderBy('created_at', 'desc')
    ->limit(3);

$users = DB::table('users')
    ->joinLateral($latestPosts, 'latest_posts')
    ->get();
```


## 유니온 {#unions}

쿼리 빌더는 두 개 이상의 쿼리를 "유니온"하는 편리한 메서드도 제공합니다. 예를 들어, 초기 쿼리를 생성한 후 `union` 메서드를 사용해 더 많은 쿼리와 유니온할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$first = DB::table('users')
    ->whereNull('first_name');

$users = DB::table('users')
    ->whereNull('last_name')
    ->union($first)
    ->get();
```

`union` 메서드 외에도, 쿼리 빌더는 `unionAll` 메서드를 제공합니다. `unionAll`로 결합된 쿼리는 중복 결과가 제거되지 않습니다. `unionAll` 메서드는 `union`과 동일한 시그니처를 가집니다.


## 기본 Where 절 {#basic-where-clauses}


### Where 절 {#where-clauses}

쿼리 빌더의 `where` 메서드를 사용해 쿼리에 "where" 절을 추가할 수 있습니다. `where` 메서드의 가장 기본적인 호출은 세 개의 인자를 필요로 합니다. 첫 번째 인자는 컬럼 이름, 두 번째 인자는 연산자(데이터베이스에서 지원하는 연산자라면 무엇이든 가능), 세 번째 인자는 컬럼 값과 비교할 값입니다.

예를 들어, 다음 쿼리는 `votes` 컬럼 값이 `100`이고, `age` 컬럼 값이 `35`보다 큰 사용자를 조회합니다:

```php
$users = DB::table('users')
    ->where('votes', '=', 100)
    ->where('age', '>', 35)
    ->get();
```

편의를 위해, 컬럼이 주어진 값과 `=` 인지 확인하고 싶다면 값을 두 번째 인자로 전달할 수 있습니다. Laravel은 `=` 연산자를 사용한다고 가정합니다:

```php
$users = DB::table('users')->where('votes', 100)->get();
```

앞서 언급했듯이, 데이터베이스 시스템이 지원하는 모든 연산자를 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->where('votes', '>=', 100)
    ->get();

$users = DB::table('users')
    ->where('votes', '<>', 100)
    ->get();

$users = DB::table('users')
    ->where('name', 'like', 'T%')
    ->get();
```

`where` 함수에 조건 배열을 전달할 수도 있습니다. 배열의 각 요소는 일반적으로 `where` 메서드에 전달하는 세 개의 인자를 담은 배열이어야 합니다:

```php
$users = DB::table('users')->where([
    ['status', '=', '1'],
    ['subscribed', '<>', '1'],
])->get();
```

> [!WARNING]
> PDO는 컬럼 이름 바인딩을 지원하지 않습니다. 따라서 사용자 입력이 쿼리에서 참조되는 컬럼 이름(예: "order by" 컬럼 등)을 결정하도록 해서는 안 됩니다.

> [!WARNING]
> MySQL과 MariaDB는 문자열-숫자 비교에서 문자열을 자동으로 정수로 형변환합니다. 이 과정에서 숫자가 아닌 문자열은 `0`으로 변환되어 예기치 않은 결과가 발생할 수 있습니다. 예를 들어, 테이블에 `secret` 컬럼 값이 `aaa`인 행이 있고 `User::where('secret', 0)`을 실행하면 해당 행이 반환됩니다. 이를 방지하려면 쿼리에서 사용할 모든 값을 적절한 타입으로 형변환하세요.


### Or Where 절 {#or-where-clauses}

쿼리 빌더의 `where` 메서드를 체이닝하면 "where" 절이 `and` 연산자로 결합됩니다. 하지만 `orWhere` 메서드를 사용하면 `or` 연산자로 절을 결합할 수 있습니다. `orWhere` 메서드는 `where` 메서드와 동일한 인자를 받습니다:

```php
$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhere('name', 'John')
    ->get();
```

"or" 조건을 괄호로 그룹화해야 할 경우, `orWhere` 메서드의 첫 번째 인자로 클로저를 전달할 수 있습니다:

```php
use Illuminate\Database\Query\Builder; 

$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhere(function (Builder $query) {
        $query->where('name', 'Abigail')
            ->where('votes', '>', 50);
        })
    ->get();
```

위 예제는 다음과 같은 SQL을 생성합니다:

```sql
select * from users where votes > 100 or (name = 'Abigail' and votes > 50)
```

> [!WARNING]
> 전역 스코프가 적용될 때 예기치 않은 동작을 방지하려면 항상 `orWhere` 호출을 그룹화해야 합니다.


### Where Not 절 {#where-not-clauses}

`whereNot` 및 `orWhereNot` 메서드는 쿼리 제약 조건 그룹을 부정(negate)하는 데 사용할 수 있습니다. 예를 들어, 다음 쿼리는 할인 중이거나 가격이 10 미만인 상품을 제외합니다:

```php
$products = DB::table('products')
    ->whereNot(function (Builder $query) {
        $query->where('clearance', true)
            ->orWhere('price', '<', 10);
        })
    ->get();
```


### Where Any / All / None 절 {#where-any-all-none-clauses}

여러 컬럼에 동일한 쿼리 제약 조건을 적용해야 할 때가 있습니다. 예를 들어, 주어진 컬럼 목록 중 하나라도 `LIKE` 조건에 일치하는 모든 레코드를 조회하고 싶을 수 있습니다. `whereAny` 메서드를 사용해 이를 구현할 수 있습니다:

```php
$users = DB::table('users')
    ->where('active', true)
    ->whereAny([
        'name',
        'email',
        'phone',
    ], 'like', 'Example%')
    ->get();
```

위 쿼리는 다음과 같은 SQL을 생성합니다:

```sql
SELECT *
FROM users
WHERE active = true AND (
    name LIKE 'Example%' OR
    email LIKE 'Example%' OR
    phone LIKE 'Example%'
)
```

마찬가지로, `whereAll` 메서드는 주어진 모든 컬럼이 조건에 일치하는 레코드를 조회할 때 사용할 수 있습니다:

```php
$posts = DB::table('posts')
    ->where('published', true)
    ->whereAll([
        'title',
        'content',
    ], 'like', '%Laravel%')
    ->get();
```

위 쿼리는 다음과 같은 SQL을 생성합니다:

```sql
SELECT *
FROM posts
WHERE published = true AND (
    title LIKE '%Laravel%' AND
    content LIKE '%Laravel%'
)
```

`whereNone` 메서드는 주어진 컬럼 중 어느 것도 조건에 일치하지 않는 레코드를 조회할 때 사용할 수 있습니다:

```php
$posts = DB::table('albums')
    ->where('published', true)
    ->whereNone([
        'title',
        'lyrics',
        'tags',
    ], 'like', '%explicit%')
    ->get();
```

위 쿼리는 다음과 같은 SQL을 생성합니다:

```sql
SELECT *
FROM albums
WHERE published = true AND NOT (
    title LIKE '%explicit%' OR
    lyrics LIKE '%explicit%' OR
    tags LIKE '%explicit%'
)
```


### JSON Where 절 {#json-where-clauses}

Laravel은 JSON 컬럼 타입을 지원하는 데이터베이스에서 JSON 컬럼 쿼리도 지원합니다. 현재 MariaDB 10.3+, MySQL 8.0+, PostgreSQL 12.0+, SQL Server 2017+, SQLite 3.39.0+에서 지원됩니다. JSON 컬럼을 쿼리하려면 `->` 연산자를 사용하세요:

```php
$users = DB::table('users')
    ->where('preferences->dining->meal', 'salad')
    ->get();
```

`whereJsonContains`를 사용해 JSON 배열을 쿼리할 수 있습니다:

```php
$users = DB::table('users')
    ->whereJsonContains('options->languages', 'en')
    ->get();
```

MariaDB, MySQL, PostgreSQL을 사용하는 경우, `whereJsonContains` 메서드에 값 배열을 전달할 수 있습니다:

```php
$users = DB::table('users')
    ->whereJsonContains('options->languages', ['en', 'de'])
    ->get();
```

`whereJsonLength` 메서드를 사용해 JSON 배열의 길이로 쿼리할 수 있습니다:

```php
$users = DB::table('users')
    ->whereJsonLength('options->languages', 0)
    ->get();

$users = DB::table('users')
    ->whereJsonLength('options->languages', '>', 1)
    ->get();
```


### 추가 Where 절 {#additional-where-clauses}

**whereLike / orWhereLike / whereNotLike / orWhereNotLike**

`whereLike` 메서드는 패턴 매칭을 위한 "LIKE" 절을 쿼리에 추가할 수 있습니다. 이 메서드들은 데이터베이스에 독립적인 문자열 매칭 쿼리를 제공하며, 대소문자 구분 여부를 토글할 수 있습니다. 기본적으로 문자열 매칭은 대소문자를 구분하지 않습니다:

```php
$users = DB::table('users')
    ->whereLike('name', '%John%')
    ->get();
```

`caseSensitive` 인자를 통해 대소문자 구분 검색을 활성화할 수 있습니다:

```php
$users = DB::table('users')
    ->whereLike('name', '%John%', caseSensitive: true)
    ->get();
```

`orWhereLike` 메서드는 LIKE 조건이 포함된 "or" 절을 추가할 수 있습니다:

```php
$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhereLike('name', '%John%')
    ->get();
```

`whereNotLike` 메서드는 "NOT LIKE" 절을 쿼리에 추가할 수 있습니다:

```php
$users = DB::table('users')
    ->whereNotLike('name', '%John%')
    ->get();
```

마찬가지로, `orWhereNotLike`를 사용해 NOT LIKE 조건이 포함된 "or" 절을 추가할 수 있습니다:

```php
$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhereNotLike('name', '%John%')
    ->get();
```

> [!WARNING]
> `whereLike`의 대소문자 구분 검색 옵션은 현재 SQL Server에서 지원되지 않습니다.

**whereIn / whereNotIn / orWhereIn / orWhereNotIn**

`whereIn` 메서드는 주어진 컬럼 값이 지정한 배열에 포함되어 있는지 확인합니다:

```php
$users = DB::table('users')
    ->whereIn('id', [1, 2, 3])
    ->get();
```

`whereNotIn` 메서드는 컬럼 값이 지정한 배열에 포함되어 있지 않은지 확인합니다:

```php
$users = DB::table('users')
    ->whereNotIn('id', [1, 2, 3])
    ->get();
```

`whereIn` 메서드의 두 번째 인자로 쿼리 객체를 제공할 수도 있습니다:

```php
$activeUsers = DB::table('users')->select('id')->where('is_active', 1);

$users = DB::table('comments')
    ->whereIn('user_id', $activeUsers)
    ->get();
```

위 예제는 다음과 같은 SQL을 생성합니다:

```sql
select * from comments where user_id in (
    select id
    from users
    where is_active = 1
)
```

> [!WARNING]
> 쿼리에 대량의 정수 바인딩 배열을 추가하는 경우, `whereIntegerInRaw` 또는 `whereIntegerNotInRaw` 메서드를 사용하면 메모리 사용량을 크게 줄일 수 있습니다.

**whereBetween / orWhereBetween**

`whereBetween` 메서드는 컬럼 값이 두 값 사이에 있는지 확인합니다:

```php
$users = DB::table('users')
    ->whereBetween('votes', [1, 100])
    ->get();
```

**whereNotBetween / orWhereNotBetween**

`whereNotBetween` 메서드는 컬럼 값이 두 값의 범위 밖에 있는지 확인합니다:

```php
$users = DB::table('users')
    ->whereNotBetween('votes', [1, 100])
    ->get();
```

**whereBetweenColumns / whereNotBetweenColumns / orWhereBetweenColumns / orWhereNotBetweenColumns**

`whereBetweenColumns` 메서드는 컬럼 값이 같은 행의 두 컬럼 값 사이에 있는지 확인합니다:

```php
$patients = DB::table('patients')
    ->whereBetweenColumns('weight', ['minimum_allowed_weight', 'maximum_allowed_weight'])
    ->get();
```

`whereNotBetweenColumns` 메서드는 컬럼 값이 같은 행의 두 컬럼 값 범위 밖에 있는지 확인합니다:

```php
$patients = DB::table('patients')
    ->whereNotBetweenColumns('weight', ['minimum_allowed_weight', 'maximum_allowed_weight'])
    ->get();
```

**whereNull / whereNotNull / orWhereNull / orWhereNotNull**

`whereNull` 메서드는 지정한 컬럼 값이 `NULL`인지 확인합니다:

```php
$users = DB::table('users')
    ->whereNull('updated_at')
    ->get();
```

`whereNotNull` 메서드는 컬럼 값이 `NULL`이 아닌지 확인합니다:

```php
$users = DB::table('users')
    ->whereNotNull('updated_at')
    ->get();
```

**whereDate / whereMonth / whereDay / whereYear / whereTime**

`whereDate` 메서드는 컬럼 값을 날짜와 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereDate('created_at', '2016-12-31')
    ->get();
```

`whereMonth` 메서드는 컬럼 값을 특정 월과 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereMonth('created_at', '12')
    ->get();
```

`whereDay` 메서드는 컬럼 값을 특정 일과 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereDay('created_at', '31')
    ->get();
```

`whereYear` 메서드는 컬럼 값을 특정 연도와 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereYear('created_at', '2016')
    ->get();
```

`whereTime` 메서드는 컬럼 값을 특정 시간과 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereTime('created_at', '=', '11:20:45')
    ->get();
```

**wherePast / whereFuture / whereToday / whereBeforeToday / whereAfterToday**

`wherePast` 및 `whereFuture` 메서드는 컬럼 값이 과거 또는 미래인지 확인할 때 사용할 수 있습니다:

```php
$invoices = DB::table('invoices')
    ->wherePast('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereFuture('due_at')
    ->get();
```

`whereNowOrPast` 및 `whereNowOrFuture` 메서드는 컬럼 값이 현재 시점까지(포함) 과거 또는 미래인지 확인할 때 사용할 수 있습니다:

```php
$invoices = DB::table('invoices')
    ->whereNowOrPast('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereNowOrFuture('due_at')
    ->get();
```

`whereToday`, `whereBeforeToday`, `whereAfterToday` 메서드는 컬럼 값이 오늘, 오늘 이전, 오늘 이후인지 각각 확인할 때 사용할 수 있습니다:

```php
$invoices = DB::table('invoices')
    ->whereToday('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereBeforeToday('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereAfterToday('due_at')
    ->get();
```

마찬가지로, `whereTodayOrBefore`, `whereTodayOrAfter` 메서드는 컬럼 값이 오늘 이전 또는 오늘 이후(오늘 포함)인지 확인할 때 사용할 수 있습니다:

```php
$invoices = DB::table('invoices')
    ->whereTodayOrBefore('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereTodayOrAfter('due_at')
    ->get();
```

**whereColumn / orWhereColumn**

`whereColumn` 메서드는 두 컬럼이 같은지 확인할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereColumn('first_name', 'last_name')
    ->get();
```

`whereColumn` 메서드에 비교 연산자를 전달할 수도 있습니다:

```php
$users = DB::table('users')
    ->whereColumn('updated_at', '>', 'created_at')
    ->get();
```

`whereColumn` 메서드에 컬럼 비교 배열을 전달할 수도 있습니다. 이 조건들은 `and` 연산자로 결합됩니다:

```php
$users = DB::table('users')
    ->whereColumn([
        ['first_name', '=', 'last_name'],
        ['updated_at', '>', 'created_at'],
    ])->get();
```


### 논리적 그룹화 {#logical-grouping}

때로는 여러 "where" 절을 괄호로 묶어 논리적 그룹화를 해야 할 때가 있습니다. 실제로, 예기치 않은 쿼리 동작을 방지하기 위해 `orWhere` 메서드 호출은 항상 괄호로 그룹화하는 것이 좋습니다. 이를 위해 `where` 메서드에 클로저를 전달할 수 있습니다:

```php
$users = DB::table('users')
    ->where('name', '=', 'John')
    ->where(function (Builder $query) {
        $query->where('votes', '>', 100)
            ->orWhere('title', '=', 'Admin');
    })
    ->get();
```

위와 같이, `where` 메서드에 클로저를 전달하면 쿼리 빌더는 제약 조건 그룹을 시작합니다. 클로저는 쿼리 빌더 인스턴스를 받아, 괄호 그룹 내에 포함될 제약 조건을 설정할 수 있습니다. 위 예제는 다음과 같은 SQL을 생성합니다:

```sql
select * from users where name = 'John' and (votes > 100 or title = 'Admin')
```

> [!WARNING]
> 전역 스코프가 적용될 때 예기치 않은 동작을 방지하려면 항상 `orWhere` 호출을 그룹화해야 합니다.


## 고급 Where 절 {#advanced-where-clauses}


### Where Exists 절 {#where-exists-clauses}

`whereExists` 메서드를 사용하면 "where exists" SQL 절을 작성할 수 있습니다. `whereExists` 메서드는 클로저를 인자로 받아, "exists" 절 내부에 들어갈 쿼리를 정의할 수 있습니다:

```php
$users = DB::table('users')
    ->whereExists(function (Builder $query) {
        $query->select(DB::raw(1))
            ->from('orders')
            ->whereColumn('orders.user_id', 'users.id');
    })
    ->get();
```

또는, 클로저 대신 쿼리 객체를 `whereExists` 메서드에 전달할 수도 있습니다:

```php
$orders = DB::table('orders')
    ->select(DB::raw(1))
    ->whereColumn('orders.user_id', 'users.id');

$users = DB::table('users')
    ->whereExists($orders)
    ->get();
```

위 두 예제 모두 다음과 같은 SQL을 생성합니다:

```sql
select * from users
where exists (
    select 1
    from orders
    where orders.user_id = users.id
)
```


### 서브쿼리 Where 절 {#subquery-where-clauses}

때로는 서브쿼리 결과를 주어진 값과 비교하는 "where" 절을 작성해야 할 때가 있습니다. 이를 위해 `where` 메서드에 클로저와 값을 전달할 수 있습니다. 예를 들어, 다음 쿼리는 주어진 타입의 최근 "membership"이 있는 모든 사용자를 조회합니다;

```php
use App\Models\User;
use Illuminate\Database\Query\Builder;

$users = User::where(function (Builder $query) {
    $query->select('type')
        ->from('membership')
        ->whereColumn('membership.user_id', 'users.id')
        ->orderByDesc('membership.start_date')
        ->limit(1);
}, 'Pro')->get();
```

또는, 컬럼을 서브쿼리 결과와 비교하는 "where" 절을 작성해야 할 수도 있습니다. 이 경우, 컬럼, 연산자, 클로저를 `where` 메서드에 전달하면 됩니다. 예를 들어, 다음 쿼리는 금액이 평균보다 작은 모든 수입 레코드를 조회합니다;

```php
use App\Models\Income;
use Illuminate\Database\Query\Builder;

$incomes = Income::where('amount', '<', function (Builder $query) {
    $query->selectRaw('avg(i.amount)')->from('incomes as i');
})->get();
```


### 전체 텍스트 Where 절 {#full-text-where-clauses}

> [!WARNING]
> 전체 텍스트 where 절은 현재 MariaDB, MySQL, PostgreSQL에서 지원됩니다.

`whereFullText` 및 `orWhereFullText` 메서드는 [전체 텍스트 인덱스](/laravel/12.x/migrations#available-index-types)가 있는 컬럼에 대해 전체 텍스트 "where" 절을 쿼리에 추가할 수 있습니다. 이 메서드들은 Laravel이 데이터베이스 시스템에 맞는 적절한 SQL로 변환합니다. 예를 들어, MariaDB나 MySQL을 사용하는 경우 `MATCH AGAINST` 절이 생성됩니다:

```php
$users = DB::table('users')
    ->whereFullText('bio', 'web developer')
    ->get();
```


## 정렬, 그룹화, 제한 및 오프셋 {#ordering-grouping-limit-and-offset}


### 정렬 {#ordering}


#### `orderBy` 메서드 {#orderby}

`orderBy` 메서드는 쿼리 결과를 지정한 컬럼으로 정렬할 수 있습니다. 첫 번째 인자는 정렬할 컬럼, 두 번째 인자는 정렬 방향(`asc` 또는 `desc`)입니다:

```php
$users = DB::table('users')
    ->orderBy('name', 'desc')
    ->get();
```

여러 컬럼으로 정렬하려면 `orderBy`를 여러 번 호출하면 됩니다:

```php
$users = DB::table('users')
    ->orderBy('name', 'desc')
    ->orderBy('email', 'asc')
    ->get();
```


#### `latest` 및 `oldest` 메서드 {#latest-oldest}

`latest` 및 `oldest` 메서드를 사용하면 날짜 기준으로 쉽게 결과를 정렬할 수 있습니다. 기본적으로 테이블의 `created_at` 컬럼을 기준으로 정렬됩니다. 또는 정렬할 컬럼 이름을 전달할 수도 있습니다:

```php
$user = DB::table('users')
    ->latest()
    ->first();
```


#### 무작위 정렬 {#random-ordering}

`inRandomOrder` 메서드를 사용하면 쿼리 결과를 무작위로 정렬할 수 있습니다. 예를 들어, 무작위 사용자를 조회할 때 사용할 수 있습니다:

```php
$randomUser = DB::table('users')
    ->inRandomOrder()
    ->first();
```


#### 기존 정렬 제거 {#removing-existing-orderings}

`reorder` 메서드는 쿼리에 이전에 적용된 모든 "order by" 절을 제거합니다:

```php
$query = DB::table('users')->orderBy('name');

$unorderedUsers = $query->reorder()->get();
```

`reorder` 메서드 호출 시 컬럼과 방향을 전달하면, 기존 "order by" 절을 모두 제거하고 새로운 정렬을 적용합니다:

```php
$query = DB::table('users')->orderBy('name');

$usersOrderedByEmail = $query->reorder('email', 'desc')->get();
```

편의를 위해, `reorderDesc` 메서드를 사용해 쿼리 결과를 내림차순으로 재정렬할 수 있습니다:

```php
$query = DB::table('users')->orderBy('name');

$usersOrderedByEmail = $query->reorderDesc('email')->get();
```


### 그룹화 {#grouping}


#### `groupBy` 및 `having` 메서드 {#groupby-having}

예상할 수 있듯이, `groupBy` 및 `having` 메서드를 사용해 쿼리 결과를 그룹화할 수 있습니다. `having` 메서드의 시그니처는 `where` 메서드와 유사합니다:

```php
$users = DB::table('users')
    ->groupBy('account_id')
    ->having('account_id', '>', 100)
    ->get();
```

`havingBetween` 메서드를 사용해 결과를 특정 범위 내로 필터링할 수 있습니다:

```php
$report = DB::table('orders')
    ->selectRaw('count(id) as number_of_orders, customer_id')
    ->groupBy('customer_id')
    ->havingBetween('number_of_orders', [5, 15])
    ->get();
```

`groupBy` 메서드에 여러 인자를 전달해 여러 컬럼으로 그룹화할 수 있습니다:

```php
$users = DB::table('users')
    ->groupBy('first_name', 'status')
    ->having('account_id', '>', 100)
    ->get();
```

더 고급 `having` 구문을 작성하려면 [havingRaw](#raw-methods) 메서드를 참고하세요.


### 제한 및 오프셋 {#limit-and-offset}


#### `skip` 및 `take` 메서드 {#skip-take}

`skip` 및 `take` 메서드를 사용해 쿼리 결과의 개수를 제한하거나, 결과의 일부를 건너뛸 수 있습니다:

```php
$users = DB::table('users')->skip(10)->take(5)->get();
```

또는, `limit` 및 `offset` 메서드를 사용할 수도 있습니다. 이 메서드들은 각각 `take` 및 `skip`과 기능적으로 동일합니다:

```php
$users = DB::table('users')
    ->offset(10)
    ->limit(5)
    ->get();
```


## 조건부 절 {#conditional-clauses}

특정 조건에 따라 쿼리 절을 쿼리에 적용하고 싶을 때가 있습니다. 예를 들어, HTTP 요청에 특정 입력 값이 있을 때만 `where` 구문을 적용하고 싶을 수 있습니다. 이를 위해 `when` 메서드를 사용할 수 있습니다:

```php
$role = $request->input('role');

$users = DB::table('users')
    ->when($role, function (Builder $query, string $role) {
        $query->where('role_id', $role);
    })
    ->get();
```

`when` 메서드는 첫 번째 인자가 `true`일 때만 주어진 클로저를 실행합니다. 첫 번째 인자가 `false`라면 클로저는 실행되지 않습니다. 위 예제에서는, 요청에 `role` 필드가 존재하고 `true`로 평가될 때만 `when` 메서드의 클로저가 실행됩니다.

`when` 메서드의 세 번째 인자로 또 다른 클로저를 전달할 수 있습니다. 이 클로저는 첫 번째 인자가 `false`로 평가될 때만 실행됩니다. 이 기능을 활용해 쿼리의 기본 정렬을 설정할 수 있습니다:

```php
$sortByVotes = $request->boolean('sort_by_votes');

$users = DB::table('users')
    ->when($sortByVotes, function (Builder $query, bool $sortByVotes) {
        $query->orderBy('votes');
    }, function (Builder $query) {
        $query->orderBy('name');
    })
    ->get();
```


## Insert 구문 {#insert-statements}

쿼리 빌더는 데이터베이스 테이블에 레코드를 삽입할 수 있는 `insert` 메서드도 제공합니다. `insert` 메서드는 컬럼 이름과 값의 배열을 인자로 받습니다:

```php
DB::table('users')->insert([
    'email' => 'kayla@example.com',
    'votes' => 0
]);
```

여러 레코드를 한 번에 삽입하려면 배열의 배열을 전달하면 됩니다. 각 배열은 테이블에 삽입할 레코드를 나타냅니다:

```php
DB::table('users')->insert([
    ['email' => 'picard@example.com', 'votes' => 0],
    ['email' => 'janeway@example.com', 'votes' => 0],
]);
```

`insertOrIgnore` 메서드는 레코드를 삽입할 때 오류를 무시합니다. 이 메서드를 사용할 때는 중복 레코드 오류가 무시되며, 데이터베이스 엔진에 따라 다른 유형의 오류도 무시될 수 있음을 알아야 합니다. 예를 들어, `insertOrIgnore`는 [MySQL의 strict 모드](https://dev.mysql.com/doc/refman/en/sql-mode.html#ignore-effect-on-execution)를 우회합니다:

```php
DB::table('users')->insertOrIgnore([
    ['id' => 1, 'email' => 'sisko@example.com'],
    ['id' => 2, 'email' => 'archer@example.com'],
]);
```

`insertUsing` 메서드는 서브쿼리를 사용해 삽입할 데이터를 결정하면서 테이블에 새 레코드를 삽입합니다:

```php
DB::table('pruned_users')->insertUsing([
    'id', 'name', 'email', 'email_verified_at'
], DB::table('users')->select(
    'id', 'name', 'email', 'email_verified_at'
)->where('updated_at', '<=', now()->subMonth()));
```


#### 자동 증가 ID {#auto-incrementing-ids}

테이블에 자동 증가 id가 있다면, `insertGetId` 메서드를 사용해 레코드를 삽입한 후 ID를 조회할 수 있습니다:

```php
$id = DB::table('users')->insertGetId(
    ['email' => 'john@example.com', 'votes' => 0]
);
```

> [!WARNING]
> PostgreSQL을 사용할 때 `insertGetId` 메서드는 자동 증가 컬럼이 `id`라는 이름일 것으로 기대합니다. 다른 "시퀀스"에서 ID를 조회하려면, 컬럼 이름을 두 번째 인자로 전달할 수 있습니다.


### Upsert {#upserts}

`upsert` 메서드는 존재하지 않는 레코드는 삽입하고, 이미 존재하는 레코드는 지정한 새 값으로 업데이트합니다. 첫 번째 인자는 삽입 또는 업데이트할 값, 두 번째 인자는 테이블 내에서 레코드를 고유하게 식별하는 컬럼(들), 세 번째 인자는 일치하는 레코드가 이미 존재할 경우 업데이트할 컬럼 배열입니다:

```php
DB::table('flights')->upsert(
    [
        ['departure' => 'Oakland', 'destination' => 'San Diego', 'price' => 99],
        ['departure' => 'Chicago', 'destination' => 'New York', 'price' => 150]
    ],
    ['departure', 'destination'],
    ['price']
);
```

위 예제에서, Laravel은 두 개의 레코드를 삽입하려고 시도합니다. 만약 동일한 `departure`와 `destination` 컬럼 값을 가진 레코드가 이미 존재한다면, 해당 레코드의 `price` 컬럼이 업데이트됩니다.

> [!WARNING]
> SQL Server를 제외한 모든 데이터베이스는 `upsert` 메서드의 두 번째 인자에 지정된 컬럼이 "primary" 또는 "unique" 인덱스를 가져야 합니다. 또한, MariaDB와 MySQL 데이터베이스 드라이버는 `upsert` 메서드의 두 번째 인자를 무시하고 항상 테이블의 "primary" 및 "unique" 인덱스를 사용해 기존 레코드를 감지합니다.


## Update 구문 {#update-statements}

쿼리 빌더는 레코드를 삽입하는 것 외에도, `update` 메서드를 사용해 기존 레코드를 업데이트할 수 있습니다. `update` 메서드는 `insert` 메서드와 마찬가지로, 업데이트할 컬럼과 값의 배열을 인자로 받습니다. `update` 메서드는 영향을 받은 행의 수를 반환합니다. `where` 절을 사용해 `update` 쿼리에 제약을 둘 수 있습니다:

```php
$affected = DB::table('users')
    ->where('id', 1)
    ->update(['votes' => 1]);
```


#### Update 또는 Insert {#update-or-insert}

때로는 데이터베이스에 기존 레코드가 있으면 업데이트하고, 없으면 새로 생성하고 싶을 수 있습니다. 이 경우 `updateOrInsert` 메서드를 사용할 수 있습니다. `updateOrInsert` 메서드는 두 개의 인자를 받습니다: 레코드를 찾을 조건 배열, 그리고 업데이트할 컬럼과 값의 배열입니다.

`updateOrInsert` 메서드는 첫 번째 인자의 컬럼과 값으로 일치하는 데이터베이스 레코드를 찾으려고 시도합니다. 레코드가 존재하면 두 번째 인자의 값으로 업데이트합니다. 레코드를 찾을 수 없으면 두 인자의 속성을 합쳐 새 레코드를 삽입합니다:

```php
DB::table('users')
    ->updateOrInsert(
        ['email' => 'john@example.com', 'name' => 'John'],
        ['votes' => '2']
    );
```

`updateOrInsert` 메서드에 클로저를 제공해, 일치하는 레코드의 존재 여부에 따라 업데이트 또는 삽입할 속성을 커스터마이즈할 수 있습니다:

```php
DB::table('users')->updateOrInsert(
    ['user_id' => $user_id],
    fn ($exists) => $exists ? [
        'name' => $data['name'],
        'email' => $data['email'],
    ] : [
        'name' => $data['name'],
        'email' => $data['email'],
        'marketable' => true,
    ],
);
```


### JSON 컬럼 업데이트 {#updating-json-columns}

JSON 컬럼을 업데이트할 때는 `->` 문법을 사용해 JSON 객체 내의 적절한 키를 업데이트해야 합니다. 이 작업은 MariaDB 10.3+, MySQL 5.7+, PostgreSQL 9.5+에서 지원됩니다:

```php
$affected = DB::table('users')
    ->where('id', 1)
    ->update(['options->enabled' => true]);
```


### 증가 및 감소 {#increment-and-decrement}

쿼리 빌더는 지정한 컬럼의 값을 증가시키거나 감소시키는 편리한 메서드도 제공합니다. 두 메서드 모두 최소 한 개의 인자(수정할 컬럼)를 받으며, 두 번째 인자로 증가/감소시킬 값을 지정할 수 있습니다:

```php
DB::table('users')->increment('votes');

DB::table('users')->increment('votes', 5);

DB::table('users')->decrement('votes');

DB::table('users')->decrement('votes', 5);
```

필요하다면, 증가/감소 작업 중에 추가로 업데이트할 컬럼을 지정할 수도 있습니다:

```php
DB::table('users')->increment('votes', 1, ['name' => 'John']);
```

또한, `incrementEach` 및 `decrementEach` 메서드를 사용해 여러 컬럼을 한 번에 증가/감소시킬 수도 있습니다:

```php
DB::table('users')->incrementEach([
    'votes' => 5,
    'balance' => 100,
]);
```


## Delete 구문 {#delete-statements}

쿼리 빌더의 `delete` 메서드를 사용해 테이블에서 레코드를 삭제할 수 있습니다. `delete` 메서드는 영향을 받은 행의 수를 반환합니다. "where" 절을 추가해 `delete` 구문에 제약을 둘 수 있습니다:

```php
$deleted = DB::table('users')->delete();

$deleted = DB::table('users')->where('votes', '>', 100)->delete();
```


## 비관적 잠금 {#pessimistic-locking}

쿼리 빌더는 `select` 구문을 실행할 때 "비관적 잠금"을 구현하는 데 도움이 되는 몇 가지 함수를 포함하고 있습니다. "공유 잠금(shared lock)"으로 구문을 실행하려면 `sharedLock` 메서드를 호출하세요. 공유 잠금은 트랜잭션이 커밋될 때까지 선택된 행이 수정되지 않도록 합니다:

```php
DB::table('users')
    ->where('votes', '>', 100)
    ->sharedLock()
    ->get();
```

또는, `lockForUpdate` 메서드를 사용할 수도 있습니다. "for update" 잠금은 선택된 레코드가 수정되거나 다른 공유 잠금으로 선택되는 것을 방지합니다:

```php
DB::table('users')
    ->where('votes', '>', 100)
    ->lockForUpdate()
    ->get();
```

필수는 아니지만, 비관적 잠금은 [트랜잭션](/laravel/12.x/database#database-transactions) 내에서 감싸는 것이 권장됩니다. 이렇게 하면 전체 작업이 완료될 때까지 데이터베이스의 데이터가 변경되지 않도록 보장할 수 있습니다. 실패 시 트랜잭션은 모든 변경 사항을 롤백하고 잠금을 자동으로 해제합니다:

```php
DB::transaction(function () {
    $sender = DB::table('users')
        ->lockForUpdate()
        ->find(1);

    $receiver = DB::table('users')
        ->lockForUpdate()
        ->find(2);

    if ($sender->balance < 100) {
        throw new RuntimeException('Balance too low.');
    }

    DB::table('users')
        ->where('id', $sender->id)
        ->update([
            'balance' => $sender->balance - 100
        ]);

    DB::table('users')
        ->where('id', $receiver->id)
        ->update([
            'balance' => $receiver->balance + 100
        ]);
});
```


## 재사용 가능한 쿼리 컴포넌트 {#reusable-query-components}

애플리케이션 전반에 반복되는 쿼리 로직이 있다면, 쿼리 빌더의 `tap` 및 `pipe` 메서드를 사용해 로직을 재사용 가능한 객체로 추출할 수 있습니다. 예를 들어, 애플리케이션에 다음과 같은 두 쿼리가 있다고 가정해봅시다:

```php
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

$destination = $request->query('destination');

DB::table('flights')
    ->when($destination, function (Builder $query, string $destination) {
        $query->where('destination', $destination);
    })
    ->orderByDesc('price')
    ->get();

// ...

$destination = $request->query('destination');

DB::table('flights')
    ->when($destination, function (Builder $query, string $destination) {
        $query->where('destination', $destination);
    })
    ->where('user', $request->user()->id)
    ->orderBy('destination')
    ->get();
```

두 쿼리에서 공통적으로 사용되는 목적지 필터링을 재사용 가능한 객체로 추출할 수 있습니다:

```php
<?php

namespace App\Scopes;

use Illuminate\Database\Query\Builder;

class DestinationFilter
{
    public function __construct(
        private ?string $destination,
    ) {
        //
    }

    public function __invoke(Builder $query): void
    {
        $query->when($this->destination, function (Builder $query) {
            $query->where('destination', $this->destination);
        });
    }
}
```

그런 다음, 쿼리 빌더의 `tap` 메서드를 사용해 객체의 로직을 쿼리에 적용할 수 있습니다:

```php
use App\Scopes\DestinationFilter;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

DB::table('flights')
    ->when($destination, function (Builder $query, string $destination) { // [!code --]
        $query->where('destination', $destination); // [!code --]
    }) // [!code --]
    ->tap(new DestinationFilter($destination)) // [!code ++]
    ->orderByDesc('price')
    ->get();

// ...

DB::table('flights')
    ->when($destination, function (Builder $query, string $destination) { // [!code --]
        $query->where('destination', $destination); // [!code --]
    }) // [!code --]
    ->tap(new DestinationFilter($destination)) // [!code ++]
    ->where('user', $request->user()->id)
    ->orderBy('destination')
    ->get();
```


#### 쿼리 파이프 {#query-pipes}

`tap` 메서드는 항상 쿼리 빌더를 반환합니다. 쿼리를 실행하고 다른 값을 반환하는 객체를 추출하고 싶다면, 대신 `pipe` 메서드를 사용할 수 있습니다.

애플리케이션 전반에서 공유되는 [페이지네이션](/laravel/12.x/pagination) 로직을 담고 있는 다음 쿼리 객체를 살펴봅시다. `DestinationFilter`와 달리, `Paginate` 객체는 쿼리 조건을 쿼리에 적용하는 것이 아니라 쿼리를 실행하고 페이지네이터 인스턴스를 반환합니다:

```php
<?php

namespace App\Scopes;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;

class Paginate
{
    public function __construct(
        private string $sortBy = 'timestamp',
        private string $sortDirection = 'desc',
        private string $perPage = 25,
    ) {
        //
    }

    public function __invoke(Builder $query): LengthAwarePaginator
    {
        return $query->orderBy($this->sortBy, $this->sortDirection)
            ->paginate($this->perPage, pageName: 'p');
    }
}
```

쿼리 빌더의 `pipe` 메서드를 사용해, 이 객체를 활용하여 공유 페이지네이션 로직을 적용할 수 있습니다:

```php
$flights = DB::table('flights')
    ->tap(new DestinationFilter($destination))
    ->pipe(new Paginate);
```


## 디버깅 {#debugging}

쿼리를 작성하는 동안 `dd` 및 `dump` 메서드를 사용해 현재 쿼리 바인딩과 SQL을 덤프할 수 있습니다. `dd` 메서드는 디버그 정보를 표시한 후 요청 실행을 중단합니다. `dump` 메서드는 디버그 정보를 표시하지만 요청 실행을 계속합니다:

```php
DB::table('users')->where('votes', '>', 100)->dd();

DB::table('users')->where('votes', '>', 100)->dump();
```

`dumpRawSql` 및 `ddRawSql` 메서드는 쿼리의 SQL을 모든 파라미터 바인딩이 올바르게 치환된 상태로 덤프할 수 있습니다:

```php
DB::table('users')->where('votes', '>', 100)->dumpRawSql();

DB::table('users')->where('votes', '>', 100)->ddRawSql();
```
