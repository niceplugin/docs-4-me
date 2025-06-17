# 데이터베이스: 쿼리 빌더






































## 소개 {#introduction}

Laravel의 데이터베이스 쿼리 빌더는 데이터베이스 쿼리를 생성하고 실행할 수 있는 편리하고 유연한 인터페이스를 제공합니다. 애플리케이션에서 대부분의 데이터베이스 작업을 수행할 때 사용할 수 있으며, Laravel이 지원하는 모든 데이터베이스 시스템과 완벽하게 호환됩니다.

Laravel 쿼리 빌더는 PDO 파라미터 바인딩을 사용하여 SQL 인젝션 공격으로부터 애플리케이션을 보호합니다. 쿼리 바인딩에 전달되는 문자열을 별도로 정리하거나 필터링할 필요가 없습니다.

> [!WARNING]
> PDO는 컬럼 이름 바인딩을 지원하지 않습니다. 따라서 쿼리에서 참조하는 컬럼 이름(예: "order by" 컬럼 등)을 사용자 입력에 따라 결정하도록 해서는 안 됩니다.


## 데이터베이스 쿼리 실행하기 {#running-database-queries}


#### 테이블에서 모든 행 조회하기 {#retrieving-all-rows-from-a-table}

`DB` 파사드에서 제공하는 `table` 메서드를 사용하여 쿼리를 시작할 수 있습니다. `table` 메서드는 지정한 테이블에 대한 유연한 쿼리 빌더 인스턴스를 반환하며, 쿼리에 더 많은 제약 조건을 체이닝한 후 마지막으로 `get` 메서드를 사용하여 쿼리 결과를 조회할 수 있습니다:

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

`get` 메서드는 쿼리 결과를 담고 있는 `Illuminate\Support\Collection` 인스턴스를 반환하며, 각 결과는 PHP의 `stdClass` 객체 인스턴스입니다. 각 컬럼의 값은 객체의 프로퍼티로 접근할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')->get();

foreach ($users as $user) {
    echo $user->name;
}
```

> [!NOTE]
> Laravel 컬렉션은 데이터를 매핑하고 축소하는 데 매우 강력한 다양한 메서드를 제공합니다. Laravel 컬렉션에 대한 자세한 내용은 [컬렉션 문서](/docs/{{version}}/collections)를 참고하세요.


#### 테이블에서 단일 행 / 컬럼 조회하기 {#retrieving-a-single-row-column-from-a-table}

데이터베이스 테이블에서 단일 행만 조회해야 한다면, `DB` 파사드의 `first` 메서드를 사용할 수 있습니다. 이 메서드는 하나의 `stdClass` 객체를 반환합니다:

```php
$user = DB::table('users')->where('name', 'John')->first();

return $user->email;
```

데이터베이스 테이블에서 단일 행을 조회하되, 일치하는 행이 없을 경우 `Illuminate\Database\RecordNotFoundException` 예외를 발생시키고 싶다면 `firstOrFail` 메서드를 사용할 수 있습니다. 만약 `RecordNotFoundException`이 잡히지 않으면, 404 HTTP 응답이 자동으로 클라이언트에 전송됩니다:

```php
$user = DB::table('users')->where('name', 'John')->firstOrFail();
```

전체 행이 필요하지 않고, 레코드에서 단일 값만 추출하고 싶다면 `value` 메서드를 사용할 수 있습니다. 이 메서드는 해당 컬럼의 값을 직접 반환합니다:

```php
$email = DB::table('users')->where('name', 'John')->value('email');
```

`id` 컬럼 값을 이용해 단일 행을 조회하려면, `find` 메서드를 사용하세요:

```php
$user = DB::table('users')->find(3);
```


#### 컬럼 값 목록 조회하기 {#retrieving-a-list-of-column-values}

단일 컬럼의 값들을 포함하는 `Illuminate\Support\Collection` 인스턴스를 조회하고 싶다면, `pluck` 메서드를 사용할 수 있습니다. 이 예제에서는 사용자들의 타이틀 컬렉션을 조회합니다:

```php
use Illuminate\Support\Facades\DB;

$titles = DB::table('users')->pluck('title');

foreach ($titles as $title) {
    echo $title;
}
```

`pluck` 메서드에 두 번째 인자를 전달하여, 결과 컬렉션에서 사용할 키 컬럼을 지정할 수도 있습니다:

```php
$titles = DB::table('users')->pluck('title', 'name');

foreach ($titles as $name => $title) {
    echo $title;
}
```


### 결과를 청크로 나누기 {#chunking-results}

수천 개의 데이터베이스 레코드를 다루어야 할 경우, `DB` 파사드에서 제공하는 `chunk` 메서드 사용을 고려해보세요. 이 메서드는 한 번에 소량의 결과만을 가져와 각 청크를 클로저에 전달하여 처리할 수 있게 해줍니다. 예를 들어, `users` 테이블 전체를 한 번에 100개씩 청크로 가져오려면 다음과 같이 할 수 있습니다:

```php
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

DB::table('users')->orderBy('id')->chunk(100, function (Collection $users) {
    foreach ($users as $user) {
        // ...
    }
});
```

클로저에서 `false`를 반환하면 이후 청크 처리를 중단할 수 있습니다:

```php
DB::table('users')->orderBy('id')->chunk(100, function (Collection $users) {
    // 레코드 처리...

    return false;
});
```

청크로 결과를 가져오는 동안 데이터베이스 레코드를 업데이트하면, 청크 결과가 예기치 않게 변경될 수 있습니다. 청크로 가져온 레코드를 업데이트할 계획이라면, 항상 `chunkById` 메서드를 사용하는 것이 가장 좋습니다. 이 메서드는 레코드의 기본 키를 기준으로 결과를 자동으로 페이지네이션합니다:

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

`chunkById`와 `lazyById` 메서드는 실행되는 쿼리에 자체적으로 "where" 조건을 추가하므로, 일반적으로 [논리적 그룹화](#logical-grouping)를 클로저 내에서 직접 해주는 것이 좋습니다:

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
> 청크 콜백 내에서 레코드를 업데이트하거나 삭제할 때, 기본 키나 외래 키가 변경되면 청크 쿼리에 영향을 줄 수 있습니다. 이로 인해 일부 레코드가 청크 결과에 포함되지 않을 수 있습니다.


### 결과를 느리게 스트리밍하기 {#streaming-results-lazily}

`lazy` 메서드는 [청크 메서드](#chunking-results)와 유사하게 쿼리를 청크 단위로 실행합니다. 하지만 각 청크를 콜백에 전달하는 대신, `lazy()` 메서드는 [LazyCollection](/docs/{{version}}/collections#lazy-collections)을 반환하여 결과를 하나의 스트림처럼 다룰 수 있게 해줍니다:

```php
use Illuminate\Support\Facades\DB;

DB::table('users')->orderBy('id')->lazy()->each(function (object $user) {
    // ...
});
```

다시 한 번, 반복하면서 조회한 레코드를 업데이트할 계획이라면 `lazyById` 또는 `lazyByIdDesc` 메서드를 사용하는 것이 가장 좋습니다. 이 메서드들은 레코드의 기본 키를 기준으로 결과를 자동으로 페이지네이션합니다:

```php
DB::table('users')->where('active', false)
    ->lazyById()->each(function (object $user) {
        DB::table('users')
            ->where('id', $user->id)
            ->update(['active' => true]);
    });
```

> [!WARNING]
> 반복하면서 레코드를 업데이트하거나 삭제할 때, 기본 키나 외래 키가 변경되면 청크 쿼리에 영향을 줄 수 있습니다. 이로 인해 일부 레코드가 결과에 포함되지 않을 수 있습니다.


### 집계 {#aggregates}

쿼리 빌더는 `count`, `max`, `min`, `avg`, `sum`과 같은 집계 값을 조회할 수 있는 다양한 메서드도 제공합니다. 쿼리를 작성한 후 이 메서드들 중 하나를 호출할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')->count();

$price = DB::table('orders')->max('price');
```

물론, 이러한 메서드들을 다른 절과 결합하여 집계 값이 계산되는 방식을 세밀하게 조정할 수도 있습니다:

```php
$price = DB::table('orders')
    ->where('finalized', 1)
    ->avg('price');
```


#### 레코드 존재 여부 확인하기 {#determining-if-records-exist}

쿼리의 조건에 맞는 레코드가 존재하는지 확인할 때 `count` 메서드 대신 `exists`와 `doesntExist` 메서드를 사용할 수 있습니다:

```php
if (DB::table('orders')->where('finalized', 1)->exists()) {
    // ...
}

if (DB::table('orders')->where('finalized', 1)->doesntExist()) {
    // ...
}
```


## Select 구문 {#select-statements}


#### Select 절 지정하기 {#specifying-a-select-clause}

항상 데이터베이스 테이블의 모든 컬럼을 선택하고 싶지는 않을 수 있습니다. `select` 메서드를 사용하면 쿼리에 대해 커스텀 "select" 절을 지정할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')
    ->select('name', 'email as user_email')
    ->get();
```

`distinct` 메서드를 사용하면 쿼리가 중복되지 않은 결과만 반환하도록 강제할 수 있습니다:

```php
$users = DB::table('users')->distinct()->get();
```

이미 쿼리 빌더 인스턴스가 있고 기존 select 절에 컬럼을 추가하고 싶다면, `addSelect` 메서드를 사용할 수 있습니다:

```php
$query = DB::table('users')->select('name');

$users = $query->addSelect('age')->get();
```


## Raw Expressions {#raw-expressions}

때때로 쿼리에 임의의 문자열을 삽입해야 할 때가 있습니다. 원시 문자열 표현식을 생성하려면 `DB` 파사드에서 제공하는 `raw` 메서드를 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->select(DB::raw('count(*) as user_count, status'))
    ->where('status', '<>', 1)
    ->groupBy('status')
    ->get();
```

> [!WARNING]
> 원시 구문은 쿼리에 문자열로 삽입되므로, SQL 인젝션 취약점이 발생하지 않도록 각별히 주의해야 합니다.


### Raw Methods {#raw-methods}

`DB::raw` 메서드를 사용하는 대신, 쿼리의 다양한 부분에 원시 표현식을 삽입하기 위해 다음 메서드들을 사용할 수도 있습니다. **라라벨은 원시 표현식을 사용하는 쿼리가 SQL 인젝션 취약점으로부터 안전하다는 것을 보장할 수 없다는 점을 반드시 기억하세요.**


#### `selectRaw` {#selectraw}

`selectRaw` 메서드는 `addSelect(DB::raw(/* ... */))` 대신 사용할 수 있습니다. 이 메서드는 두 번째 인수로 바인딩의 배열을 선택적으로 받을 수 있습니다:

```php
$orders = DB::table('orders')
    ->selectRaw('price * ? as price_with_tax', [1.0825])
    ->get();
```


#### `whereRaw / orWhereRaw` {#whereraw-orwhereraw}

`whereRaw` 및 `orWhereRaw` 메서드는 쿼리에 원시 "where" 절을 삽입할 때 사용할 수 있습니다. 이 메서드들은 두 번째 인수로 바인딩 배열을 선택적으로 받을 수 있습니다:

```php
$orders = DB::table('orders')
    ->whereRaw('price > IF(state = "TX", ?, 100)', [200])
    ->get();
```


#### `havingRaw / orHavingRaw` {#havingraw-orhavingraw}

`havingRaw` 및 `orHavingRaw` 메서드는 "having" 절의 값으로 원시 문자열을 제공할 때 사용할 수 있습니다. 이 메서드들은 두 번째 인수로 바인딩 배열을 선택적으로 받을 수 있습니다:

```php
$orders = DB::table('orders')
    ->select('department', DB::raw('SUM(price) as total_sales'))
    ->groupBy('department')
    ->havingRaw('SUM(price) > ?', [2500])
    ->get();
```


#### `orderByRaw` {#orderbyraw}

`orderByRaw` 메서드는 "order by" 절의 값으로 원시 문자열을 제공할 때 사용할 수 있습니다:

```php
$orders = DB::table('orders')
    ->orderByRaw('updated_at - created_at DESC')
    ->get();
```


### `groupByRaw` {#groupbyraw}

`groupByRaw` 메서드는 `group by` 절의 값으로 원시 문자열을 제공할 때 사용할 수 있습니다:

```php
$orders = DB::table('orders')
    ->select('city', 'state')
    ->groupByRaw('city, state')
    ->get();
```


## 조인 {#joins}


#### 내부 조인 절 {#inner-join-clause}

쿼리 빌더는 쿼리에 조인 절을 추가하는 데에도 사용할 수 있습니다. 기본적인 "내부 조인"을 수행하려면 쿼리 빌더 인스턴스에서 `join` 메서드를 사용할 수 있습니다. `join` 메서드에 전달되는 첫 번째 인수는 조인할 테이블의 이름이며, 나머지 인수들은 조인의 컬럼 제약 조건을 지정합니다. 하나의 쿼리에서 여러 테이블을 조인할 수도 있습니다:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', 'contacts.phone', 'orders.price')
    ->get();
```


#### Left Join / Right Join 절 {#left-join-right-join-clause}

"inner join" 대신 "left join" 또는 "right join"을 수행하고 싶다면, `leftJoin` 또는 `rightJoin` 메서드를 사용하세요. 이 메서드들은 `join` 메서드와 동일한 시그니처를 가집니다:

```php
$users = DB::table('users')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();

$users = DB::table('users')
    ->rightJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();
```


#### 크로스 조인 절 {#cross-join-clause}

`crossJoin` 메서드를 사용하여 "크로스 조인"을 수행할 수 있습니다. 크로스 조인은 첫 번째 테이블과 조인된 테이블 간의 데카르트 곱을 생성합니다:

```php
$sizes = DB::table('sizes')
    ->crossJoin('colors')
    ->get();
```


#### 고급 조인 절 {#advanced-join-clauses}

더 고급 조인 절을 지정할 수도 있습니다. 시작하려면 `join` 메서드의 두 번째 인수로 클로저를 전달하세요. 이 클로저는 `Illuminate\Database\Query\JoinClause` 인스턴스를 받아 "조인" 절에 제약 조건을 지정할 수 있게 해줍니다:

```php
DB::table('users')
    ->join('contacts', function (JoinClause $join) {
        $join->on('users.id', '=', 'contacts.user_id')->orOn(/* ... */);
    })
    ->get();
```

조인에 "where" 절을 사용하고 싶다면, `JoinClause` 인스턴스에서 제공하는 `where` 및 `orWhere` 메서드를 사용할 수 있습니다. 이 메서드들은 두 컬럼을 비교하는 대신, 컬럼을 값과 비교합니다:

```php
DB::table('users')
    ->join('contacts', function (JoinClause $join) {
        $join->on('users.id', '=', 'contacts.user_id')
            ->where('contacts.user_id', '>', 5);
    })
    ->get();
```


#### 서브쿼리 조인 {#subquery-joins}

`joinSub`, `leftJoinSub`, `rightJoinSub` 메서드를 사용하여 쿼리를 서브쿼리와 조인할 수 있습니다. 이 메서드들은 각각 세 개의 인자를 받습니다: 서브쿼리, 테이블 별칭, 그리고 관련 컬럼을 정의하는 클로저입니다. 아래 예시에서는 각 사용자 레코드에 해당 사용자가 가장 최근에 발행한 블로그 글의 `created_at` 타임스탬프가 포함된 사용자 컬렉션을 조회합니다:

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


#### Lateral Joins {#lateral-joins}

> [!WARNING]
> Lateral 조인은 현재 PostgreSQL, MySQL >= 8.0.14, 그리고 SQL Server에서 지원됩니다.

`joinLateral` 및 `leftJoinLateral` 메서드를 사용하여 서브쿼리와 함께 "lateral join"을 수행할 수 있습니다. 이 메서드들은 각각 두 개의 인자를 받으며, 첫 번째는 서브쿼리, 두 번째는 해당 테이블의 별칭입니다. 조인 조건은 주어진 서브쿼리의 `where` 절 내에서 지정해야 합니다. Lateral 조인은 각 행마다 평가되며, 서브쿼리 외부의 컬럼을 참조할 수 있습니다.

이 예제에서는 사용자 컬렉션과 각 사용자의 최근 블로그 게시글 3개를 조회합니다. 각 사용자는 결과 집합에서 최대 3개의 행을 가질 수 있으며, 각각은 가장 최근의 블로그 게시글에 해당합니다. 조인 조건은 서브쿼리 내의 `whereColumn` 절을 사용하여 현재 사용자 행을 참조합니다:

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

쿼리 빌더는 두 개 이상의 쿼리를 "유니온"하는 편리한 메서드도 제공합니다. 예를 들어, 초기 쿼리를 생성한 후 `union` 메서드를 사용하여 더 많은 쿼리와 유니온할 수 있습니다:

```php
use Illuminate\Support\Facades\DB;

$first = DB::table('users')
    ->whereNull('first_name');

$users = DB::table('users')
    ->whereNull('last_name')
    ->union($first)
    ->get();
```

`union` 메서드 외에도, 쿼리 빌더는 `unionAll` 메서드를 제공합니다. `unionAll` 메서드로 결합된 쿼리는 중복 결과가 제거되지 않습니다. `unionAll` 메서드는 `union` 메서드와 동일한 메서드 시그니처를 가집니다.


## 기본 Where 절 {#basic-where-clauses}


### Where 절 {#where-clauses}

쿼리 빌더의 `where` 메서드를 사용하여 쿼리에 "where" 절을 추가할 수 있습니다. `where` 메서드의 가장 기본적인 호출은 세 개의 인자가 필요합니다. 첫 번째 인자는 컬럼의 이름이고, 두 번째 인자는 데이터베이스에서 지원하는 연산자 중 하나입니다. 세 번째 인자는 컬럼의 값과 비교할 값입니다.

예를 들어, 아래 쿼리는 `votes` 컬럼의 값이 `100`이고 `age` 컬럼의 값이 `35`보다 큰 사용자들을 조회합니다:

```php
$users = DB::table('users')
    ->where('votes', '=', 100)
    ->where('age', '>', 35)
    ->get();
```

편의를 위해, 컬럼이 주어진 값과 `=` 인지 확인하고 싶다면, 값을 두 번째 인자로 `where` 메서드에 전달할 수 있습니다. Laravel은 자동으로 `=` 연산자를 사용한다고 가정합니다:

```php
$users = DB::table('users')->where('votes', 100)->get();
```

앞서 언급했듯이, 데이터베이스 시스템에서 지원하는 모든 연산자를 사용할 수 있습니다:

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

또한, 조건의 배열을 `where` 함수에 전달할 수도 있습니다. 배열의 각 요소는 일반적으로 `where` 메서드에 전달하는 세 개의 인자를 포함하는 배열이어야 합니다:

```php
$users = DB::table('users')->where([
    ['status', '=', '1'],
    ['subscribed', '<>', '1'],
])->get();
```

> [!WARNING]
> PDO는 컬럼 이름 바인딩을 지원하지 않습니다. 따라서 쿼리에서 참조하는 컬럼 이름(예: "order by" 컬럼 등)에 사용자 입력이 직접적으로 사용되도록 해서는 안 됩니다.

> [!WARNING]
> MySQL과 MariaDB는 문자열-숫자 비교에서 문자열을 자동으로 정수로 형변환합니다. 이 과정에서 숫자가 아닌 문자열은 `0`으로 변환되어 예기치 않은 결과가 발생할 수 있습니다. 예를 들어, 테이블에 `secret` 컬럼 값이 `aaa`인 행이 있고 `User::where('secret', 0)`을 실행하면 해당 행이 반환됩니다. 이를 방지하려면 쿼리에서 사용하기 전에 모든 값을 적절한 타입으로 변환해야 합니다.


### Or Where 절 {#or-where-clauses}

쿼리 빌더의 `where` 메서드를 연속으로 호출하면, 각 "where" 절은 `and` 연산자로 결합됩니다. 하지만, `orWhere` 메서드를 사용하면 해당 절을 `or` 연산자로 쿼리에 결합할 수 있습니다. `orWhere` 메서드는 `where` 메서드와 동일한 인자를 받습니다:

```php
$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhere('name', 'John')
    ->get();
```

괄호로 묶인 "or" 조건이 필요하다면, `orWhere` 메서드의 첫 번째 인자로 클로저를 전달할 수 있습니다:

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
> 전역 스코프가 적용될 때 예기치 않은 동작을 방지하기 위해 항상 `orWhere` 호출을 그룹화해야 합니다.


### Where Not 절 {#where-not-clauses}

`whereNot` 및 `orWhereNot` 메서드는 주어진 쿼리 제약 조건 그룹을 부정하는 데 사용할 수 있습니다. 예를 들어, 아래 쿼리는 할인 중이거나 가격이 10 미만인 상품을 제외합니다:

```php
$products = DB::table('products')
    ->whereNot(function (Builder $query) {
        $query->where('clearance', true)
            ->orWhere('price', '<', 10);
        })
    ->get();
```


### Where Any / All / None 절 {#where-any-all-none-clauses}

때때로 동일한 쿼리 제약 조건을 여러 컬럼에 적용해야 할 때가 있습니다. 예를 들어, 주어진 컬럼 목록 중 어느 하나라도 지정한 값과 `LIKE`인 모든 레코드를 조회하고 싶을 수 있습니다. 이럴 때는 `whereAny` 메서드를 사용할 수 있습니다:

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

마찬가지로, `whereAll` 메서드를 사용하면 주어진 모든 컬럼이 지정한 제약 조건과 일치하는 레코드를 조회할 수 있습니다:

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

`whereNone` 메서드는 주어진 컬럼 중 어느 것도 지정한 제약 조건과 일치하지 않는 레코드를 조회할 때 사용할 수 있습니다:

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


### JSON Where Clauses {#json-where-clauses}

Laravel은 JSON 컬럼 타입을 지원하는 데이터베이스에서 JSON 컬럼 타입 쿼리도 지원합니다. 현재 MariaDB 10.3+, MySQL 8.0+, PostgreSQL 12.0+, SQL Server 2017+, SQLite 3.39.0+가 이에 해당합니다. JSON 컬럼을 쿼리하려면 `->` 연산자를 사용하세요:

```php
$users = DB::table('users')
    ->where('preferences->dining->meal', 'salad')
    ->get();
```

`whereJsonContains`를 사용하여 JSON 배열을 쿼리할 수 있습니다:

```php
$users = DB::table('users')
    ->whereJsonContains('options->languages', 'en')
    ->get();
```

애플리케이션이 MariaDB, MySQL, PostgreSQL 데이터베이스를 사용하는 경우, `whereJsonContains` 메서드에 값의 배열을 전달할 수 있습니다:

```php
$users = DB::table('users')
    ->whereJsonContains('options->languages', ['en', 'de'])
    ->get();
```

`whereJsonLength` 메서드를 사용하여 JSON 배열의 길이로 쿼리할 수 있습니다:

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

`whereLike` 메서드는 패턴 매칭을 위한 "LIKE" 절을 쿼리에 추가할 수 있게 해줍니다. 이 메서드들은 데이터베이스에 종속적이지 않은 방식으로 문자열 매칭 쿼리를 수행할 수 있으며, 대소문자 구분 여부를 설정할 수 있습니다. 기본적으로 문자열 매칭은 대소문자를 구분하지 않습니다:

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

`orWhereLike` 메서드는 LIKE 조건과 함께 "or" 절을 추가할 수 있습니다:

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

마찬가지로, `orWhereNotLike`를 사용하여 NOT LIKE 조건과 함께 "or" 절을 추가할 수 있습니다:

```php
$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhereNotLike('name', '%John%')
    ->get();
```

> [!WARNING]
> `whereLike`의 대소문자 구분 검색 옵션은 현재 SQL Server에서는 지원되지 않습니다.

**whereIn / whereNotIn / orWhereIn / orWhereNotIn**

`whereIn` 메서드는 주어진 컬럼의 값이 주어진 배열에 포함되어 있는지 확인합니다:

```php
$users = DB::table('users')
    ->whereIn('id', [1, 2, 3])
    ->get();
```

`whereNotIn` 메서드는 주어진 컬럼의 값이 주어진 배열에 포함되어 있지 않은지 확인합니다:

```php
$users = DB::table('users')
    ->whereNotIn('id', [1, 2, 3])
    ->get();
```

또한, `whereIn` 메서드의 두 번째 인자로 쿼리 객체를 제공할 수도 있습니다:

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
> 쿼리에 많은 정수 바인딩 배열을 추가하는 경우, `whereIntegerInRaw` 또는 `whereIntegerNotInRaw` 메서드를 사용하면 메모리 사용량을 크게 줄일 수 있습니다.

**whereBetween / orWhereBetween**

`whereBetween` 메서드는 컬럼의 값이 두 값 사이에 있는지 확인합니다:

```php
$users = DB::table('users')
    ->whereBetween('votes', [1, 100])
    ->get();
```

**whereNotBetween / orWhereNotBetween**

`whereNotBetween` 메서드는 컬럼의 값이 두 값의 범위 밖에 있는지 확인합니다:

```php
$users = DB::table('users')
    ->whereNotBetween('votes', [1, 100])
    ->get();
```

**whereBetweenColumns / whereNotBetweenColumns / orWhereBetweenColumns / orWhereNotBetweenColumns**

`whereBetweenColumns` 메서드는 컬럼의 값이 같은 테이블 행의 두 컬럼 값 사이에 있는지 확인합니다:

```php
$patients = DB::table('patients')
    ->whereBetweenColumns('weight', ['minimum_allowed_weight', 'maximum_allowed_weight'])
    ->get();
```

`whereNotBetweenColumns` 메서드는 컬럼의 값이 같은 테이블 행의 두 컬럼 값 범위 밖에 있는지 확인합니다:

```php
$patients = DB::table('patients')
    ->whereNotBetweenColumns('weight', ['minimum_allowed_weight', 'maximum_allowed_weight'])
    ->get();
```

**whereNull / whereNotNull / orWhereNull / orWhereNotNull**

`whereNull` 메서드는 주어진 컬럼의 값이 `NULL`인지 확인합니다:

```php
$users = DB::table('users')
    ->whereNull('updated_at')
    ->get();
```

`whereNotNull` 메서드는 컬럼의 값이 `NULL`이 아닌지 확인합니다:

```php
$users = DB::table('users')
    ->whereNotNull('updated_at')
    ->get();
```

**whereDate / whereMonth / whereDay / whereYear / whereTime**

`whereDate` 메서드는 컬럼의 값을 날짜와 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereDate('created_at', '2016-12-31')
    ->get();
```

`whereMonth` 메서드는 컬럼의 값을 특정 월과 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereMonth('created_at', '12')
    ->get();
```

`whereDay` 메서드는 컬럼의 값을 특정 일과 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereDay('created_at', '31')
    ->get();
```

`whereYear` 메서드는 컬럼의 값을 특정 연도와 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereYear('created_at', '2016')
    ->get();
```

`whereTime` 메서드는 컬럼의 값을 특정 시간과 비교할 때 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->whereTime('created_at', '=', '11:20:45')
    ->get();
```

**wherePast / whereFuture / whereToday / whereBeforeToday / whereAfterToday**

`wherePast`와 `whereFuture` 메서드는 컬럼의 값이 과거인지 미래인지 확인할 때 사용할 수 있습니다:

```php
$invoices = DB::table('invoices')
    ->wherePast('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereFuture('due_at')
    ->get();
```

`whereNowOrPast`와 `whereNowOrFuture` 메서드는 컬럼의 값이 현재 날짜 및 시간을 포함하여 과거 또는 미래인지 확인할 때 사용할 수 있습니다:

```php
$invoices = DB::table('invoices')
    ->whereNowOrPast('due_at')
    ->get();

$invoices = DB::table('invoices')
    ->whereNowOrFuture('due_at')
    ->get();
```

`whereToday`, `whereBeforeToday`, `whereAfterToday` 메서드는 각각 컬럼의 값이 오늘, 오늘 이전, 오늘 이후인지 확인할 때 사용할 수 있습니다:

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

마찬가지로, `whereTodayOrBefore`와 `whereTodayOrAfter` 메서드는 컬럼의 값이 오늘을 포함하여 오늘 이전 또는 오늘 이후인지 확인할 때 사용할 수 있습니다:

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

또한, `whereColumn` 메서드에 컬럼 비교 배열을 전달할 수도 있습니다. 이 조건들은 `and` 연산자로 결합됩니다:

```php
$users = DB::table('users')
    ->whereColumn([
        ['first_name', '=', 'last_name'],
        ['updated_at', '>', 'created_at'],
    ])->get();
```


### 논리적 그룹화 {#logical-grouping}

때때로 원하는 쿼리의 논리적 그룹화를 달성하기 위해 여러 개의 "where" 절을 괄호로 묶어야 할 수도 있습니다. 실제로, 예기치 않은 쿼리 동작을 방지하기 위해 `orWhere` 메서드 호출은 항상 괄호로 묶는 것이 좋습니다. 이를 위해서는 `where` 메서드에 클로저를 전달하면 됩니다:

```php
$users = DB::table('users')
    ->where('name', '=', 'John')
    ->where(function (Builder $query) {
        $query->where('votes', '>', 100)
            ->orWhere('title', '=', 'Admin');
    })
    ->get();
```

위에서 볼 수 있듯이, `where` 메서드에 클로저를 전달하면 쿼리 빌더에게 제약 조건 그룹을 시작하라는 지시를 하게 됩니다. 클로저는 쿼리 빌더 인스턴스를 전달받으며, 이 인스턴스를 사용해 괄호 그룹 내에 포함되어야 할 제약 조건을 설정할 수 있습니다. 위 예제는 다음과 같은 SQL을 생성합니다:

```sql
select * from users where name = 'John' and (votes > 100 or title = 'Admin')
```

> [!WARNING]
> 전역 스코프가 적용될 때 예기치 않은 동작을 방지하기 위해 항상 `orWhere` 호출을 그룹화해야 합니다.


## 고급 Where 절 {#advanced-where-clauses}


### Where Exists 절 {#where-exists-clauses}

`whereExists` 메서드는 "where exists" SQL 절을 작성할 수 있게 해줍니다. `whereExists` 메서드는 클로저를 인자로 받아, 해당 클로저에 쿼리 빌더 인스턴스를 전달합니다. 이를 통해 "exists" 절 내부에 들어갈 쿼리를 정의할 수 있습니다:

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

위의 두 예제 모두 다음과 같은 SQL을 생성합니다:

```sql
select * from users
where exists (
    select 1
    from orders
    where orders.user_id = users.id
)
```


### 서브쿼리 Where 절 {#subquery-where-clauses}

때때로 서브쿼리의 결과를 주어진 값과 비교하는 "where" 절을 작성해야 할 때가 있습니다. 이 경우, `where` 메서드에 클로저와 값을 전달하여 이를 구현할 수 있습니다. 예를 들어, 다음 쿼리는 주어진 타입의 최근 "membership"을 가진 모든 사용자를 조회합니다;

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

또는, 컬럼을 서브쿼리의 결과와 비교하는 "where" 절을 작성해야 할 수도 있습니다. 이 경우, `where` 메서드에 컬럼, 연산자, 클로저를 전달하여 구현할 수 있습니다. 예를 들어, 다음 쿼리는 금액이 평균보다 작은 모든 수입 레코드를 조회합니다;

```php
use App\Models\Income;
use Illuminate\Database\Query\Builder;

$incomes = Income::where('amount', '<', function (Builder $query) {
    $query->selectRaw('avg(i.amount)')->from('incomes as i');
})->get();
```


### 전체 텍스트 Where 절 {#full-text-where-clauses}

> [!WARNING]
> 전체 텍스트 where 절은 현재 MariaDB, MySQL, 그리고 PostgreSQL에서만 지원됩니다.

`whereFullText`와 `orWhereFullText` 메서드는 [전체 텍스트 인덱스](/docs/{{version}}/migrations#available-index-types)가 적용된 컬럼에 대해 쿼리에 전체 텍스트 "where" 절을 추가할 때 사용할 수 있습니다. 이 메서드들은 라라벨에 의해 해당 데이터베이스 시스템에 맞는 적절한 SQL로 변환됩니다. 예를 들어, MariaDB나 MySQL을 사용하는 애플리케이션에서는 `MATCH AGAINST` 절이 생성됩니다:

```php
$users = DB::table('users')
    ->whereFullText('bio', 'web developer')
    ->get();
```


## 정렬, 그룹화, 제한 및 오프셋 {#ordering-grouping-limit-and-offset}


### 정렬 {#ordering}


#### `orderBy` 메서드 {#orderby}

`orderBy` 메서드는 쿼리 결과를 지정한 컬럼을 기준으로 정렬할 수 있게 해줍니다. `orderBy` 메서드의 첫 번째 인자는 정렬하고자 하는 컬럼명을, 두 번째 인자는 정렬 방향을 지정하며 `asc` 또는 `desc` 중 하나를 사용할 수 있습니다:

```php
$users = DB::table('users')
    ->orderBy('name', 'desc')
    ->get();
```

여러 컬럼을 기준으로 정렬하고 싶다면, 필요한 만큼 `orderBy`를 연속해서 호출하면 됩니다:

```php
$users = DB::table('users')
    ->orderBy('name', 'desc')
    ->orderBy('email', 'asc')
    ->get();
```


#### `latest` 및 `oldest` 메서드 {#latest-oldest}

`latest` 및 `oldest` 메서드를 사용하면 결과를 날짜 기준으로 쉽게 정렬할 수 있습니다. 기본적으로 결과는 테이블의 `created_at` 컬럼을 기준으로 정렬됩니다. 또는 정렬하고자 하는 컬럼명을 전달할 수도 있습니다:

```php
$user = DB::table('users')
    ->latest()
    ->first();
```


#### 무작위 정렬 {#random-ordering}

`inRandomOrder` 메서드는 쿼리 결과를 무작위로 정렬하는 데 사용할 수 있습니다. 예를 들어, 이 메서드를 사용하여 무작위 사용자를 가져올 수 있습니다:

```php
$randomUser = DB::table('users')
    ->inRandomOrder()
    ->first();
```


#### 기존 정렬 제거하기 {#removing-existing-orderings}

`reorder` 메서드는 쿼리에 이전에 적용된 모든 "order by" 절을 제거합니다:

```php
$query = DB::table('users')->orderBy('name');

$unorderedUsers = $query->reorder()->get();
```

`reorder` 메서드를 호출할 때 컬럼과 정렬 방향을 전달하면, 기존의 모든 "order by" 절을 제거하고 쿼리에 완전히 새로운 정렬을 적용할 수 있습니다:

```php
$query = DB::table('users')->orderBy('name');

$usersOrderedByEmail = $query->reorder('email', 'desc')->get();
```

편의를 위해, `reorderDesc` 메서드를 사용하여 쿼리 결과를 내림차순으로 다시 정렬할 수도 있습니다:

```php
$query = DB::table('users')->orderBy('name');

$usersOrderedByEmail = $query->reorderDesc('email')->get();
```


### 그룹화 {#grouping}


#### `groupBy` 및 `having` 메서드 {#groupby-having}

예상할 수 있듯이, `groupBy`와 `having` 메서드는 쿼리 결과를 그룹화하는 데 사용할 수 있습니다. `having` 메서드의 시그니처는 `where` 메서드와 유사합니다:

```php
$users = DB::table('users')
    ->groupBy('account_id')
    ->having('account_id', '>', 100)
    ->get();
```

`havingBetween` 메서드를 사용하여 지정된 범위 내의 결과를 필터링할 수 있습니다:

```php
$report = DB::table('orders')
    ->selectRaw('count(id) as number_of_orders, customer_id')
    ->groupBy('customer_id')
    ->havingBetween('number_of_orders', [5, 15])
    ->get();
```

여러 인자를 `groupBy` 메서드에 전달하여 여러 컬럼으로 그룹화할 수 있습니다:

```php
$users = DB::table('users')
    ->groupBy('first_name', 'status')
    ->having('account_id', '>', 100)
    ->get();
```

더 고급 `having` 구문을 작성하려면 [havingRaw](#raw-methods) 메서드를 참고하세요.


### 제한 및 오프셋 {#limit-and-offset}


#### `skip` 및 `take` 메서드 {#skip-take}

`skip` 및 `take` 메서드를 사용하여 쿼리에서 반환되는 결과의 수를 제한하거나, 쿼리에서 지정한 수만큼 결과를 건너뛸 수 있습니다:

```php
$users = DB::table('users')->skip(10)->take(5)->get();
```

또는, `limit` 및 `offset` 메서드를 사용할 수도 있습니다. 이 메서드들은 각각 `take` 및 `skip` 메서드와 기능적으로 동일합니다:

```php
$users = DB::table('users')
    ->offset(10)
    ->limit(5)
    ->get();
```


## 조건부 절 {#conditional-clauses}

때때로 특정 쿼리 절을 다른 조건에 따라 쿼리에 적용하고 싶을 수 있습니다. 예를 들어, 들어오는 HTTP 요청에 특정 입력 값이 있을 때만 `where` 구문을 적용하고 싶을 수 있습니다. 이럴 때는 `when` 메서드를 사용할 수 있습니다.

```php
$role = $request->input('role');

$users = DB::table('users')
    ->when($role, function (Builder $query, string $role) {
        $query->where('role_id', $role);
    })
    ->get();
```

`when` 메서드는 첫 번째 인자가 `true`일 때만 주어진 클로저를 실행합니다. 첫 번째 인자가 `false`이면 클로저는 실행되지 않습니다. 따라서 위의 예시에서, `when` 메서드에 전달된 클로저는 들어오는 요청에 `role` 필드가 존재하고 그 값이 `true`로 평가될 때만 호출됩니다.

`when` 메서드의 세 번째 인자로 또 다른 클로저를 전달할 수 있습니다. 이 클로저는 첫 번째 인자가 `false`로 평가될 때만 실행됩니다. 이 기능이 어떻게 사용될 수 있는지 보여주기 위해, 쿼리의 기본 정렬을 설정하는 예시를 들어보겠습니다.

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


## Insert Statements {#insert-statements}

쿼리 빌더는 데이터베이스 테이블에 레코드를 삽입할 수 있는 `insert` 메서드도 제공합니다. `insert` 메서드는 컬럼 이름과 값의 배열을 인수로 받습니다:

```php
DB::table('users')->insert([
    'email' => 'kayla@example.com',
    'votes' => 0
]);
```

여러 레코드를 한 번에 삽입하려면 배열의 배열을 전달하면 됩니다. 각 배열은 테이블에 삽입될 하나의 레코드를 나타냅니다:

```php
DB::table('users')->insert([
    ['email' => 'picard@example.com', 'votes' => 0],
    ['email' => 'janeway@example.com', 'votes' => 0],
]);
```

`insertOrIgnore` 메서드는 레코드를 데이터베이스에 삽입할 때 발생하는 오류를 무시합니다. 이 메서드를 사용할 때는 중복 레코드 오류가 무시되며, 데이터베이스 엔진에 따라 다른 유형의 오류도 무시될 수 있다는 점을 유의해야 합니다. 예를 들어, `insertOrIgnore`는 [MySQL의 strict mode를 우회](https://dev.mysql.com/doc/refman/en/sql-mode.html#ignore-effect-on-execution)합니다:

```php
DB::table('users')->insertOrIgnore([
    ['id' => 1, 'email' => 'sisko@example.com'],
    ['id' => 2, 'email' => 'archer@example.com'],
]);
```

`insertUsing` 메서드는 서브쿼리를 사용하여 삽입할 데이터를 결정하면서 새로운 레코드를 테이블에 삽입합니다:

```php
DB::table('pruned_users')->insertUsing([
    'id', 'name', 'email', 'email_verified_at'
], DB::table('users')->select(
    'id', 'name', 'email', 'email_verified_at'
)->where('updated_at', '<=', now()->subMonth()));
```


#### 자동 증가 ID {#auto-incrementing-ids}

테이블에 자동 증가 id가 있는 경우, `insertGetId` 메서드를 사용하여 레코드를 삽입한 후 ID를 조회할 수 있습니다:

```php
$id = DB::table('users')->insertGetId(
    ['email' => 'john@example.com', 'votes' => 0]
);
```

> [!WARNING]
> PostgreSQL을 사용할 때 `insertGetId` 메서드는 자동 증가 컬럼의 이름이 `id`일 것으로 예상합니다. 만약 다른 "시퀀스"에서 ID를 조회하고 싶다면, `insertGetId` 메서드의 두 번째 인자로 컬럼명을 전달할 수 있습니다.


### Upserts {#upserts}

`upsert` 메서드는 존재하지 않는 레코드는 삽입하고, 이미 존재하는 레코드는 지정한 새로운 값으로 업데이트합니다. 이 메서드의 첫 번째 인자는 삽입 또는 업데이트할 값들이며, 두 번째 인자는 관련 테이블 내에서 레코드를 고유하게 식별하는 컬럼(들)을 나열합니다. 마지막 세 번째 인자는 데이터베이스에 이미 일치하는 레코드가 존재할 경우 업데이트되어야 하는 컬럼들의 배열입니다:

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

위 예제에서, Laravel은 두 개의 레코드를 삽입하려고 시도합니다. 만약 동일한 `departure`와 `destination` 컬럼 값을 가진 레코드가 이미 존재한다면, Laravel은 해당 레코드의 `price` 컬럼을 업데이트합니다.

> [!WARNING]
> SQL Server를 제외한 모든 데이터베이스는 `upsert` 메서드의 두 번째 인자에 지정된 컬럼들이 "primary" 또는 "unique" 인덱스를 가져야 합니다. 또한, MariaDB와 MySQL 데이터베이스 드라이버는 `upsert` 메서드의 두 번째 인자를 무시하고 항상 테이블의 "primary" 및 "unique" 인덱스를 사용하여 기존 레코드를 감지합니다.


## 업데이트 구문 {#update-statements}

쿼리 빌더는 데이터베이스에 레코드를 삽입하는 것 외에도 `update` 메서드를 사용하여 기존 레코드를 업데이트할 수 있습니다. `update` 메서드는 `insert` 메서드와 마찬가지로, 업데이트할 컬럼과 값의 쌍으로 이루어진 배열을 인수로 받습니다. `update` 메서드는 영향을 받은 행(row)의 수를 반환합니다. `where` 절을 사용하여 `update` 쿼리를 제한할 수 있습니다:

```php
$affected = DB::table('users')
    ->where('id', 1)
    ->update(['votes' => 1]);
```


#### 업데이트 또는 삽입 {#update-or-insert}

때때로 데이터베이스에 기존 레코드가 있으면 업데이트하고, 일치하는 레코드가 없으면 새로 생성하고 싶을 때가 있습니다. 이러한 경우에는 `updateOrInsert` 메서드를 사용할 수 있습니다. `updateOrInsert` 메서드는 두 개의 인자를 받습니다: 레코드를 찾기 위한 조건 배열과, 업데이트할 컬럼과 값의 쌍을 담은 배열입니다.

`updateOrInsert` 메서드는 첫 번째 인자의 컬럼과 값 쌍을 사용하여 일치하는 데이터베이스 레코드를 찾으려고 시도합니다. 레코드가 존재하면 두 번째 인자의 값으로 업데이트됩니다. 레코드를 찾을 수 없으면 두 인자의 속성을 합쳐서 새 레코드가 삽입됩니다:

```php
DB::table('users')
    ->updateOrInsert(
        ['email' => 'john@example.com', 'name' => 'John'],
        ['votes' => '2']
    );
```

`updateOrInsert` 메서드에 클로저를 전달하여, 일치하는 레코드의 존재 여부에 따라 데이터베이스에 업데이트되거나 삽입되는 속성을 커스터마이즈할 수 있습니다:

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

JSON 컬럼을 업데이트할 때는 `->` 문법을 사용하여 JSON 객체 내의 적절한 키를 업데이트해야 합니다. 이 작업은 MariaDB 10.3+, MySQL 5.7+, PostgreSQL 9.5+에서 지원됩니다:

```php
$affected = DB::table('users')
    ->where('id', 1)
    ->update(['options->enabled' => true]);
```


### 증가 및 감소 {#increment-and-decrement}

쿼리 빌더는 주어진 컬럼의 값을 증가시키거나 감소시키는 편리한 메서드도 제공합니다. 이 두 메서드는 최소한 하나의 인수, 즉 수정할 컬럼을 받습니다. 두 번째 인수로 컬럼을 얼마나 증가 또는 감소시킬지 지정할 수도 있습니다:

```php
DB::table('users')->increment('votes');

DB::table('users')->increment('votes', 5);

DB::table('users')->decrement('votes');

DB::table('users')->decrement('votes', 5);
```

필요하다면, 증가 또는 감소 작업 중에 추가로 업데이트할 컬럼을 지정할 수도 있습니다:

```php
DB::table('users')->increment('votes', 1, ['name' => 'John']);
```

또한, `incrementEach` 및 `decrementEach` 메서드를 사용하여 여러 컬럼을 한 번에 증가 또는 감소시킬 수도 있습니다:

```php
DB::table('users')->incrementEach([
    'votes' => 5,
    'balance' => 100,
]);
```


## Delete Statements {#delete-statements}

쿼리 빌더의 `delete` 메서드는 테이블에서 레코드를 삭제하는 데 사용할 수 있습니다. `delete` 메서드는 영향을 받은 행의 수를 반환합니다. `delete` 메서드를 호출하기 전에 "where" 절을 추가하여 `delete` 문을 제한할 수 있습니다:

```php
$deleted = DB::table('users')->delete();

$deleted = DB::table('users')->where('votes', '>', 100)->delete();
```


## 비관적 잠금 {#pessimistic-locking}

쿼리 빌더는 `select` 문을 실행할 때 "비관적 잠금"을 달성하는 데 도움이 되는 몇 가지 함수를 제공합니다. "공유 잠금(shared lock)"으로 문을 실행하려면 `sharedLock` 메서드를 호출하면 됩니다. 공유 잠금은 선택된 행이 트랜잭션이 커밋될 때까지 수정되지 않도록 방지합니다:

```php
DB::table('users')
    ->where('votes', '>', 100)
    ->sharedLock()
    ->get();
```

또는 `lockForUpdate` 메서드를 사용할 수도 있습니다. "for update" 잠금은 선택된 레코드가 수정되거나 다른 공유 잠금으로 선택되는 것을 방지합니다:

```php
DB::table('users')
    ->where('votes', '>', 100)
    ->lockForUpdate()
    ->get();
```

필수는 아니지만, 비관적 잠금은 [트랜잭션](/docs/{{version}}/database#database-transactions) 내에서 감싸는 것이 권장됩니다. 이렇게 하면 전체 작업이 완료될 때까지 데이터베이스의 조회된 데이터가 변경되지 않도록 보장할 수 있습니다. 실패가 발생할 경우, 트랜잭션은 모든 변경 사항을 롤백하고 잠금을 자동으로 해제합니다:

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

애플리케이션 전반에 걸쳐 반복되는 쿼리 로직이 있다면, 쿼리 빌더의 `tap` 및 `pipe` 메서드를 사용하여 해당 로직을 재사용 가능한 객체로 추출할 수 있습니다. 예를 들어, 애플리케이션에 다음과 같은 두 개의 쿼리가 있다고 가정해봅시다:

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

이 쿼리들 사이에서 공통적으로 사용되는 destination 필터링을 재사용 가능한 객체로 추출할 수 있습니다:

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

그런 다음, 쿼리 빌더의 `tap` 메서드를 사용하여 객체의 로직을 쿼리에 적용할 수 있습니다:

```php
use App\Scopes\DestinationFilter;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

DB::table('flights')
    ->when($destination, function (Builder $query, string $destination) { // [tl! remove]
        $query->where('destination', $destination); // [tl! remove]
    }) // [tl! remove]
    ->tap(new DestinationFilter($destination)) // [tl! add]
    ->orderByDesc('price')
    ->get();

// ...

DB::table('flights')
    ->when($destination, function (Builder $query, string $destination) { // [tl! remove]
        $query->where('destination', $destination); // [tl! remove]
    }) // [tl! remove]
    ->tap(new DestinationFilter($destination)) // [tl! add]
    ->where('user', $request->user()->id)
    ->orderBy('destination')
    ->get();
```


#### 쿼리 파이프 {#query-pipes}

`tap` 메서드는 항상 쿼리 빌더를 반환합니다. 쿼리를 실행하고 다른 값을 반환하는 객체를 추출하고 싶다면, 대신 `pipe` 메서드를 사용할 수 있습니다.

애플리케이션 전반에서 사용되는 공통 [페이지네이션](/docs/{{version}}/pagination) 로직을 포함하는 다음 쿼리 객체를 살펴보세요. 쿼리 조건을 쿼리에 적용하는 `DestinationFilter`와 달리, `Paginate` 객체는 쿼리를 실행하고 페이지네이터 인스턴스를 반환합니다:

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

쿼리 빌더의 `pipe` 메서드를 사용하면, 이 객체를 활용하여 공통 페이지네이션 로직을 적용할 수 있습니다:

```php
$flights = DB::table('flights')
    ->tap(new DestinationFilter($destination))
    ->pipe(new Paginate);
```


## 디버깅 {#debugging}

쿼리를 작성하는 동안 `dd`와 `dump` 메서드를 사용하여 현재 쿼리 바인딩과 SQL을 출력할 수 있습니다. `dd` 메서드는 디버그 정보를 표시한 후 요청 실행을 중단합니다. `dump` 메서드는 디버그 정보를 표시하지만 요청 실행을 계속 진행합니다:

```php
DB::table('users')->where('votes', '>', 100)->dd();

DB::table('users')->where('votes', '>', 100)->dump();
```

`dumpRawSql`과 `ddRawSql` 메서드는 쿼리의 SQL을 모든 파라미터 바인딩이 올바르게 치환된 상태로 출력할 때 사용할 수 있습니다:

```php
DB::table('users')->where('votes', '>', 100)->dumpRawSql();

DB::table('users')->where('votes', '>', 100)->ddRawSql();
```
