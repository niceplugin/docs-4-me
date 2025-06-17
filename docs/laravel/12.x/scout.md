# Laravel Scout
































## 소개 {#introduction}

[Laravel Scout](https://github.com/laravel/scout)는 [Eloquent 모델](/laravel/12.x/eloquent)에 전체 텍스트 검색 기능을 추가할 수 있는 간단하고 드라이버 기반의 솔루션을 제공합니다. 모델 옵저버를 사용하여, Scout는 Eloquent 레코드와 검색 인덱스를 자동으로 동기화해줍니다.

현재 Scout는 [Algolia](https://www.algolia.com/), [Meilisearch](https://www.meilisearch.com), [Typesense](https://typesense.org), 그리고 MySQL / PostgreSQL(`database`) 드라이버를 기본으로 제공합니다. 또한, Scout에는 외부 의존성이나 서드파티 서비스가 필요 없는 로컬 개발용 "collection" 드라이버도 포함되어 있습니다. 더불어, 커스텀 드라이버를 작성하는 것도 간단하므로, Scout를 자유롭게 확장하여 자신만의 검색 구현을 추가할 수 있습니다.


## 설치 {#installation}

먼저, Composer 패키지 관리자를 통해 Scout를 설치하세요:

```shell
composer require laravel/scout
```

Scout를 설치한 후, `vendor:publish` Artisan 명령어를 사용하여 Scout 설정 파일을 게시해야 합니다. 이 명령어는 `scout.php` 설정 파일을 애플리케이션의 `config` 디렉터리에 게시합니다:

```shell
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

마지막으로, 검색이 가능하게 만들고 싶은 모델에 `Laravel\Scout\Searchable` 트레이트를 추가하세요. 이 트레이트는 모델 옵저버를 등록하여, 모델이 검색 드라이버와 자동으로 동기화되도록 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;
}
```


### 큐잉 {#queueing}

Scout를 사용하기 위해 반드시 필요한 것은 아니지만, 라이브러리를 사용하기 전에 [큐 드라이버](/laravel/12.x/queues)를 설정하는 것을 강력히 권장합니다. 큐 워커를 실행하면 Scout가 모델 정보를 검색 인덱스에 동기화하는 모든 작업을 큐에 넣을 수 있어, 애플리케이션의 웹 인터페이스에서 훨씬 더 빠른 응답 시간을 제공할 수 있습니다.

큐 드라이버를 설정한 후에는 `config/scout.php` 설정 파일의 `queue` 옵션 값을 `true`로 지정하세요:

```php
'queue' => true,
```

`queue` 옵션이 `false`로 설정되어 있더라도, Algolia나 Meilisearch와 같은 일부 Scout 드라이버는 항상 레코드를 비동기적으로 인덱싱한다는 점을 기억해야 합니다. 즉, 인덱스 작업이 Laravel 애플리케이션 내에서 완료되었더라도, 검색 엔진 자체에는 새로운 레코드나 업데이트된 레코드가 즉시 반영되지 않을 수 있습니다.

Scout 작업에서 사용할 연결과 큐를 지정하려면, `queue` 설정 옵션을 배열로 정의할 수 있습니다:

```php
'queue' => [
    'connection' => 'redis',
    'queue' => 'scout'
],
```

물론, Scout 작업에서 사용할 연결과 큐를 커스터마이즈했다면, 해당 연결과 큐에서 작업을 처리할 큐 워커를 실행해야 합니다:

```shell
php artisan queue:work redis --queue=scout
```


## 드라이버 필수 조건 {#driver-prerequisites}


### Algolia {#algolia}

Algolia 드라이버를 사용할 때는 `config/scout.php` 설정 파일에 Algolia `id`와 `secret` 자격 증명을 설정해야 합니다. 자격 증명을 설정한 후에는 Composer 패키지 관리자를 통해 Algolia PHP SDK도 설치해야 합니다:

```shell
composer require algolia/algoliasearch-client-php
```


### Meilisearch {#meilisearch}

[Meilisearch](https://www.meilisearch.com)는 매우 빠르고 오픈 소스인 검색 엔진입니다. 로컬 컴퓨터에 Meilisearch를 설치하는 방법을 잘 모를 경우, Laravel의 공식적으로 지원하는 Docker 개발 환경인 [Laravel Sail](/laravel/12.x/sail#meilisearch)을 사용할 수 있습니다.

Meilisearch 드라이버를 사용할 때는 Composer 패키지 관리자를 통해 Meilisearch PHP SDK를 설치해야 합니다:

```shell
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
```

그런 다음, 애플리케이션의 `.env` 파일에서 `SCOUT_DRIVER` 환경 변수와 Meilisearch의 `host`, `key` 자격 증명을 설정하세요:

```ini
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

Meilisearch에 대한 자세한 내용은 [Meilisearch 공식 문서](https://docs.meilisearch.com/learn/getting_started/quick_start.html)를 참고하세요.

또한, [Meilisearch의 바이너리 호환성 문서](https://github.com/meilisearch/meilisearch-php#-compatibility-with-meilisearch)를 참고하여, 사용 중인 Meilisearch 바이너리 버전과 호환되는 `meilisearch/meilisearch-php` 버전을 설치해야 합니다.

> [!WARNING]
> Meilisearch를 사용하는 애플리케이션에서 Scout를 업그레이드할 때는, 반드시 Meilisearch 서비스 자체의 [추가적인 변경 사항이나 호환성 문제](https://github.com/meilisearch/Meilisearch/releases)를 확인해야 합니다.


### Typesense {#typesense}

[Typesense](https://typesense.org)는 매우 빠른 오픈 소스 검색 엔진으로, 키워드 검색, 시맨틱 검색, 지오 검색, 벡터 검색을 지원합니다.

Typesense는 [직접 호스팅](https://typesense.org/docs/guide/install-typesense.html#option-2-local-machine-self-hosting)하거나 [Typesense Cloud](https://cloud.typesense.org)를 사용할 수 있습니다.

Scout와 함께 Typesense를 사용하려면, Composer 패키지 매니저를 통해 Typesense PHP SDK를 설치하세요:

```shell
composer require typesense/typesense-php
```

그런 다음, 애플리케이션의 .env 파일에 `SCOUT_DRIVER` 환경 변수와 Typesense 호스트 및 API 키 자격 증명을 설정하세요:

```ini
SCOUT_DRIVER=typesense
TYPESENSE_API_KEY=masterKey
TYPESENSE_HOST=localhost
```

[Laravel Sail](/laravel/12.x/sail)을 사용하는 경우, Docker 컨테이너 이름에 맞게 `TYPESENSE_HOST` 환경 변수를 조정해야 할 수 있습니다. 또한 설치된 포트, 경로, 프로토콜을 선택적으로 지정할 수 있습니다:

```ini
TYPESENSE_PORT=8108
TYPESENSE_PATH=
TYPESENSE_PROTOCOL=http
```

Typesense 컬렉션에 대한 추가 설정 및 스키마 정의는 애플리케이션의 `config/scout.php` 설정 파일에서 찾을 수 있습니다. Typesense에 대한 자세한 내용은 [Typesense 문서](https://typesense.org/docs/guide/#quick-start)를 참고하세요.


#### Typesense에 데이터를 저장하기 위한 준비 {#preparing-data-for-storage-in-typesense}

Typesense를 사용할 때, 검색 가능한 모델은 모델의 기본 키를 문자열로, 생성일을 UNIX 타임스탬프로 변환하는 `toSearchableArray` 메서드를 정의해야 합니다:

```php
/**
 * 모델의 인덱싱 가능한 데이터 배열을 반환합니다.
 *
 * @return array<string, mixed>
 */
public function toSearchableArray(): array
{
    return array_merge($this->toArray(),[
        'id' => (string) $this->id,
        'created_at' => $this->created_at->timestamp,
    ]);
}
```

또한, 애플리케이션의 `config/scout.php` 파일에서 Typesense 컬렉션 스키마를 정의해야 합니다. 컬렉션 스키마는 Typesense를 통해 검색 가능한 각 필드의 데이터 타입을 설명합니다. 사용 가능한 모든 스키마 옵션에 대한 자세한 내용은 [Typesense 문서](https://typesense.org/docs/latest/api/collections.html#schema-parameters)를 참고하세요.

Typesense 컬렉션의 스키마를 정의한 후 변경해야 할 경우, `scout:flush`와 `scout:import`를 실행하여 기존에 인덱싱된 모든 데이터를 삭제하고 스키마를 재생성할 수 있습니다. 또는, Typesense의 API를 사용하여 인덱싱된 데이터를 삭제하지 않고 컬렉션의 스키마를 수정할 수도 있습니다.

검색 가능한 모델이 소프트 삭제(soft delete)를 지원하는 경우, 애플리케이션의 `config/scout.php` 설정 파일 내 해당 모델의 Typesense 스키마에 `__soft_deleted` 필드를 정의해야 합니다:

```php
User::class => [
    'collection-schema' => [
        'fields' => [
            // ...
            [
                'name' => '__soft_deleted',
                'type' => 'int32',
                'optional' => true,
            ],
        ],
    ],
],
```


#### 동적 검색 매개변수 {#typesense-dynamic-search-parameters}

Typesense를 사용하면 `options` 메서드를 통해 검색 작업을 수행할 때 [검색 매개변수](https://typesense.org/docs/latest/api/search.html#search-parameters)를 동적으로 수정할 수 있습니다:

```php
use App\Models\Todo;

Todo::search('Groceries')->options([
    'query_by' => 'title, description'
])->get();
```


## 구성 {#configuration}


### 모델 인덱스 구성 {#configuring-model-indexes}

각 Eloquent 모델은 주어진 검색 "인덱스"와 동기화되며, 이 인덱스에는 해당 모델의 모든 검색 가능한 레코드가 포함됩니다. 다시 말해, 각 인덱스는 MySQL 테이블과 비슷하다고 생각할 수 있습니다. 기본적으로 각 모델은 모델의 일반적인 "테이블" 이름과 일치하는 인덱스에 저장됩니다. 일반적으로 이는 모델 이름의 복수형이지만, 모델의 `searchableAs` 메서드를 오버라이드하여 인덱스를 자유롭게 커스터마이즈할 수 있습니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    /**
     * 모델과 연관된 인덱스의 이름을 반환합니다.
     */
    public function searchableAs(): string
    {
        return 'posts_index';
    }
}
```


### 검색 가능한 데이터 구성 {#configuring-searchable-data}

기본적으로, 주어진 모델의 전체 `toArray` 형태가 검색 인덱스에 저장됩니다. 검색 인덱스에 동기화되는 데이터를 커스터마이즈하고 싶다면, 모델에서 `toSearchableArray` 메서드를 오버라이드하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    /**
     * 모델의 인덱싱 가능한 데이터 배열을 가져옵니다.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        $array = $this->toArray();

        // 데이터 배열을 커스터마이즈하세요...

        return $array;
    }
}
```

Meilisearch와 같은 일부 검색 엔진은 올바른 타입의 데이터에 대해서만 필터 연산(`>`, `<` 등)을 수행합니다. 따라서 이러한 검색 엔진을 사용하고 검색 가능한 데이터를 커스터마이즈할 때는, 숫자 값을 올바른 타입으로 캐스팅해야 합니다:

```php
public function toSearchableArray()
{
    return [
        'id' => (int) $this->id,
        'name' => $this->name,
        'price' => (float) $this->price,
    ];
}
```


#### 인덱스 설정 구성하기 (Algolia) {#configuring-indexes-for-algolia}

때때로 Algolia 인덱스에 추가 설정을 구성하고 싶을 수 있습니다. 이러한 설정은 Algolia UI를 통해 관리할 수도 있지만, 애플리케이션의 `config/scout.php` 설정 파일에서 직접 인덱스 설정의 원하는 상태를 관리하는 것이 더 효율적일 때도 있습니다.

이 방법을 사용하면 수동 설정을 피하고 여러 환경에서 일관성을 보장하면서, 애플리케이션의 자동 배포 파이프라인을 통해 이러한 설정을 배포할 수 있습니다. 필터링 가능한 속성, 랭킹, 패싯팅 또는 [기타 지원되는 모든 설정](https://www.algolia.com/doc/rest-api/search/#tag/Indices/operation/setSettings)을 구성할 수 있습니다.

시작하려면, 애플리케이션의 `config/scout.php` 설정 파일에 각 인덱스에 대한 설정을 추가하세요:

```php
use App\Models\User;
use App\Models\Flight;

'algolia' => [
    'id' => env('ALGOLIA_APP_ID', ''),
    'secret' => env('ALGOLIA_SECRET', ''),
    'index-settings' => [
        User::class => [
            'searchableAttributes' => ['id', 'name', 'email'],
            'attributesForFaceting'=> ['filterOnly(email)'],
            // 기타 설정 필드...
        ],
        Flight::class => [
            'searchableAttributes'=> ['id', 'destination'],
        ],
    ],
],
```

특정 인덱스의 기반이 되는 모델이 소프트 삭제(soft deletable)를 지원하고, 해당 모델이 `index-settings` 배열에 포함되어 있다면, Scout는 해당 인덱스에서 소프트 삭제된 모델에 대한 패싯팅 지원을 자동으로 포함합니다. 소프트 삭제 가능한 모델 인덱스에 대해 정의할 다른 패싯팅 속성이 없다면, 해당 모델에 대해 `index-settings` 배열에 빈 항목을 추가하면 됩니다:

```php
'index-settings' => [
    Flight::class => []
],
```

애플리케이션의 인덱스 설정을 구성한 후에는 `scout:sync-index-settings` Artisan 명령어를 실행해야 합니다. 이 명령어는 현재 구성된 인덱스 설정을 Algolia에 알립니다. 편의를 위해 이 명령어를 배포 프로세스의 일부로 포함시키는 것이 좋습니다:

```shell
php artisan scout:sync-index-settings
```


#### 필터링 가능한 데이터 및 인덱스 설정 구성하기 (Meilisearch) {#configuring-filterable-data-for-meilisearch}

Scout의 다른 드라이버와 달리, Meilisearch는 필터링 가능한 속성, 정렬 가능한 속성, 그리고 [기타 지원되는 설정 필드](https://docs.meilisearch.com/reference/api/settings.html)와 같은 인덱스 검색 설정을 미리 정의해야 합니다.

필터링 가능한 속성은 Scout의 `where` 메서드를 사용할 때 필터링할 계획이 있는 모든 속성을 의미하며, 정렬 가능한 속성은 Scout의 `orderBy` 메서드를 사용할 때 정렬할 계획이 있는 모든 속성을 의미합니다. 인덱스 설정을 정의하려면, 애플리케이션의 `scout` 설정 파일 내 `meilisearch` 설정 항목의 `index-settings` 부분을 조정하면 됩니다:

```php
use App\Models\User;
use App\Models\Flight;

'meilisearch' => [
    'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
    'key' => env('MEILISEARCH_KEY', null),
    'index-settings' => [
        User::class => [
            'filterableAttributes'=> ['id', 'name', 'email'],
            'sortableAttributes' => ['created_at'],
            // 기타 설정 필드...
        ],
        Flight::class => [
            'filterableAttributes'=> ['id', 'destination'],
            'sortableAttributes' => ['updated_at'],
        ],
    ],
],
```

특정 인덱스의 기반이 되는 모델이 소프트 삭제(soft deletable)를 지원하고, 해당 모델이 `index-settings` 배열에 포함되어 있다면, Scout는 해당 인덱스에서 소프트 삭제된 모델을 필터링할 수 있도록 자동으로 지원합니다. 소프트 삭제 가능한 모델 인덱스에 대해 추가로 정의할 필터링 또는 정렬 속성이 없다면, 해당 모델에 대해 `index-settings` 배열에 빈 항목을 추가하기만 하면 됩니다:

```php
'index-settings' => [
    Flight::class => []
],
```

애플리케이션의 인덱스 설정을 구성한 후에는 `scout:sync-index-settings` Artisan 명령어를 실행해야 합니다. 이 명령어는 현재 구성된 인덱스 설정을 Meilisearch에 알립니다. 편의를 위해 이 명령어를 배포 프로세스의 일부로 포함시키는 것이 좋습니다:

```shell
php artisan scout:sync-index-settings
```


### 모델 ID 구성하기 {#configuring-the-model-id}

기본적으로 Scout는 모델의 기본 키를 검색 인덱스에 저장되는 모델의 고유 ID / 키로 사용합니다. 이 동작을 커스터마이즈해야 하는 경우, 모델에서 `getScoutKey`와 `getScoutKeyName` 메서드를 오버라이드하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class User extends Model
{
    use Searchable;

    /**
     * 모델을 인덱싱할 때 사용할 값을 반환합니다.
     */
    public function getScoutKey(): mixed
    {
        return $this->email;
    }

    /**
     * 모델을 인덱싱할 때 사용할 키 이름을 반환합니다.
     */
    public function getScoutKeyName(): mixed
    {
        return 'email';
    }
}
```


### 모델별 검색 엔진 설정 {#configuring-search-engines-per-model}

검색을 수행할 때, Scout는 일반적으로 애플리케이션의 `scout` 설정 파일에 지정된 기본 검색 엔진을 사용합니다. 그러나 특정 모델에 대해 검색 엔진을 변경하려면, 모델에서 `searchableUsing` 메서드를 오버라이드하면 됩니다:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Engines\Engine;
use Laravel\Scout\EngineManager;
use Laravel\Scout\Searchable;

class User extends Model
{
    use Searchable;

    /**
     * 모델을 인덱싱하는 데 사용되는 엔진을 가져옵니다.
     */
    public function searchableUsing(): Engine
    {
        return app(EngineManager::class)->engine('meilisearch');
    }
}
```


### 사용자 식별 {#identifying-users}

Scout는 [Algolia](https://algolia.com)를 사용할 때 사용자를 자동으로 식별할 수 있도록 지원합니다. 인증된 사용자를 검색 작업과 연관시키면 Algolia 대시보드에서 검색 분석을 볼 때 유용할 수 있습니다. 이 기능을 활성화하려면 애플리케이션의 `.env` 파일에 `SCOUT_IDENTIFY` 환경 변수를 `true`로 정의하면 됩니다:

```ini
SCOUT_IDENTIFY=true
```

이 기능을 활성화하면 요청의 IP 주소와 인증된 사용자의 기본 식별자가 Algolia로 전달되어, 사용자가 수행한 모든 검색 요청에 이 데이터가 연관됩니다.


## 데이터베이스 / 컬렉션 엔진 {#database-and-collection-engines}


### 데이터베이스 엔진 {#database-engine}

> [!WARNING]
> 데이터베이스 엔진은 현재 MySQL과 PostgreSQL만 지원합니다.

애플리케이션이 소규모 또는 중간 규모의 데이터베이스와 상호작용하거나, 작업량이 적은 경우에는 Scout의 "database" 엔진을 사용하는 것이 더 편리할 수 있습니다. 데이터베이스 엔진은 기존 데이터베이스에서 결과를 필터링할 때 "where like" 절과 전체 텍스트 인덱스를 사용하여 쿼리에 해당하는 검색 결과를 결정합니다.

데이터베이스 엔진을 사용하려면, `SCOUT_DRIVER` 환경 변수의 값을 `database`로 설정하거나, 애플리케이션의 `scout` 설정 파일에서 `database` 드라이버를 직접 지정하면 됩니다:

```ini
SCOUT_DRIVER=database
```

데이터베이스 엔진을 기본 드라이버로 지정한 후에는 [검색 가능한 데이터 구성](#configuring-searchable-data)을 해야 합니다. 그런 다음, 모델에 대해 [검색 쿼리 실행](#searching)을 시작할 수 있습니다. Algolia, Meilisearch, Typesense 인덱스를 초기화할 때 필요한 인덱싱과 같은 검색 엔진 인덱싱 작업은 데이터베이스 엔진을 사용할 때는 필요하지 않습니다.

#### 데이터베이스 검색 전략 커스터마이징

기본적으로 데이터베이스 엔진은 [검색 가능하도록 설정된](#configuring-searchable-data) 모든 모델 속성에 대해 "where like" 쿼리를 실행합니다. 하지만 일부 상황에서는 이로 인해 성능이 저하될 수 있습니다. 따라서 데이터베이스 엔진의 검색 전략을 구성하여 특정 컬럼이 전체 문자열(`%example%`)이 아닌 접두사만을 검색하는 "where like" 제약 조건(`example%`)을 사용하거나, 전체 텍스트 검색 쿼리를 사용하도록 지정할 수 있습니다.

이 동작을 정의하려면, 모델의 `toSearchableArray` 메서드에 PHP 속성을 할당하면 됩니다. 추가 검색 전략이 지정되지 않은 컬럼은 기본 "where like" 전략을 계속 사용합니다:

```php
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;

/**
 * 모델의 인덱싱 가능한 데이터 배열을 가져옵니다.
 *
 * @return array<string, mixed>
 */
#[SearchUsingPrefix(['id', 'email'])]
#[SearchUsingFullText(['bio'])]
public function toSearchableArray(): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'bio' => $this->bio,
    ];
}
```

> [!WARNING]
> 컬럼이 전체 텍스트 쿼리 제약 조건을 사용하도록 지정하기 전에, 해당 컬럼에 [전체 텍스트 인덱스](/laravel/12.x/migrations#available-index-types)가 할당되어 있는지 확인하세요.


### Collection 엔진 {#collection-engine}

로컬 개발 중에 Algolia, Meilisearch, 또는 Typesense 검색 엔진을 자유롭게 사용할 수 있지만, "collection" 엔진으로 시작하는 것이 더 편리할 수 있습니다. collection 엔진은 기존 데이터베이스에서 결과를 가져와 "where" 절과 컬렉션 필터링을 사용하여 쿼리에 해당하는 검색 결과를 결정합니다. 이 엔진을 사용할 때는 검색 가능한 모델을 "인덱싱"할 필요가 없으며, 단순히 로컬 데이터베이스에서 조회됩니다.

collection 엔진을 사용하려면, `SCOUT_DRIVER` 환경 변수의 값을 `collection`으로 설정하거나, 애플리케이션의 `scout` 설정 파일에서 직접 `collection` 드라이버를 지정하면 됩니다:

```ini
SCOUT_DRIVER=collection
```

collection 드라이버를 기본 드라이버로 지정한 후에는, [검색 쿼리 실행](#searching)을 통해 모델에 대해 검색을 시작할 수 있습니다. collection 엔진을 사용할 때는 Algolia, Meilisearch, Typesense 인덱스를 시드하는 데 필요한 인덱싱과 같은 검색 엔진 인덱싱이 필요하지 않습니다.

#### 데이터베이스 엔진과의 차이점

처음 보면 "database" 엔진과 "collections" 엔진은 상당히 비슷해 보입니다. 두 엔진 모두 데이터베이스와 직접 상호작용하여 검색 결과를 가져옵니다. 하지만 collection 엔진은 일치하는 레코드를 찾기 위해 전체 텍스트 인덱스나 `LIKE` 절을 사용하지 않습니다. 대신, 가능한 모든 레코드를 가져온 후 Laravel의 `Str::is` 헬퍼를 사용하여 검색 문자열이 모델 속성 값에 존재하는지 확인합니다.

collection 엔진은 Laravel이 지원하는 모든 관계형 데이터베이스(예: SQLite, SQL Server)에서 동작하므로 가장 이식성이 뛰어난 검색 엔진입니다. 하지만 Scout의 database 엔진에 비해 효율성은 떨어집니다.


## 인덱싱 {#indexing}


### 일괄 가져오기 {#batch-import}

기존 프로젝트에 Scout를 설치하는 경우, 이미 데이터베이스에 존재하는 레코드를 인덱스에 가져와야 할 수 있습니다. Scout는 모든 기존 레코드를 검색 인덱스에 가져올 수 있는 `scout:import` Artisan 명령어를 제공합니다:

```shell
php artisan scout:import "App\Models\Post"
```

`flush` 명령어는 모델의 모든 레코드를 검색 인덱스에서 제거할 때 사용할 수 있습니다:

```shell
php artisan scout:flush "App\Models\Post"
```


#### 가져오기 쿼리 수정하기 {#modifying-the-import-query}

배치 가져오기를 위해 모든 모델을 조회하는 데 사용되는 쿼리를 수정하고 싶다면, 모델에 `makeAllSearchableUsing` 메서드를 정의할 수 있습니다. 이 메서드는 모델을 가져오기 전에 필요한 eager 관계 로딩을 추가하기에 좋은 위치입니다:

```php
use Illuminate\Database\Eloquent\Builder;

/**
 * 모든 모델을 검색 가능하게 만들 때 사용되는 쿼리를 수정합니다.
 */
protected function makeAllSearchableUsing(Builder $query): Builder
{
    return $query->with('author');
}
```

> [!WARNING]
> `makeAllSearchableUsing` 메서드는 큐를 사용하여 모델을 배치 가져올 때는 적용되지 않을 수 있습니다. 모델 컬렉션이 작업에 의해 처리될 때 관계는 [복원되지 않습니다](/laravel/12.x/queues#handling-relationships).


### 레코드 추가하기 {#adding-records}

`Laravel\Scout\Searchable` 트레이트를 모델에 추가했다면, 이제 모델 인스턴스를 `save` 또는 `create`만 하면 자동으로 검색 인덱스에 추가됩니다. Scout를 [큐 사용](#queueing)으로 설정했다면, 이 작업은 큐 워커에 의해 백그라운드에서 처리됩니다:

```php
use App\Models\Order;

$order = new Order;

// ...

$order->save();
```


#### 쿼리를 통한 레코드 추가 {#adding-records-via-query}

Eloquent 쿼리를 통해 모델 컬렉션을 검색 인덱스에 추가하고 싶다면, `searchable` 메서드를 Eloquent 쿼리에 체이닝하면 됩니다. `searchable` 메서드는 쿼리 결과를 [청크로 분할](/laravel/12.x/eloquent#chunking-results)하여 각 레코드를 검색 인덱스에 추가합니다. Scout에서 큐를 사용하도록 설정했다면, 모든 청크는 큐 워커에 의해 백그라운드에서 임포트됩니다:

```php
use App\Models\Order;

Order::where('price', '>', 100)->searchable();
```

Eloquent 관계 인스턴스에서도 `searchable` 메서드를 호출할 수 있습니다:

```php
$user->orders()->searchable();
```

또는, 이미 메모리에 Eloquent 모델 컬렉션이 있다면, 해당 컬렉션 인스턴스에서 `searchable` 메서드를 호출하여 모델 인스턴스를 해당 인덱스에 추가할 수 있습니다:

```php
$orders->searchable();
```

> [!NOTE]
> `searchable` 메서드는 "upsert" 작업으로 간주할 수 있습니다. 즉, 모델 레코드가 이미 인덱스에 있다면 업데이트되고, 인덱스에 없다면 새로 추가됩니다.


### 레코드 업데이트 {#updating-records}

검색 가능한 모델을 업데이트하려면, 모델 인스턴스의 속성을 수정한 후 `save` 메서드로 데이터베이스에 저장하면 됩니다. Scout는 변경 사항을 자동으로 검색 인덱스에 반영합니다:

```php
use App\Models\Order;

$order = Order::find(1);

// 주문을 업데이트...

$order->save();
```

또한, Eloquent 쿼리 인스턴스에서 `searchable` 메서드를 호출하여 여러 모델을 한 번에 업데이트할 수도 있습니다. 만약 해당 모델이 검색 인덱스에 존재하지 않는다면, 새로 생성됩니다:

```php
Order::where('price', '>', 100)->searchable();
```

관계에 있는 모든 모델의 검색 인덱스 레코드를 업데이트하고 싶다면, 관계 인스턴스에서 `searchable`을 호출할 수 있습니다:

```php
$user->orders()->searchable();
```

또는, 이미 메모리에 Eloquent 모델 컬렉션이 있다면, 컬렉션 인스턴스에서 `searchable` 메서드를 호출하여 해당 인덱스의 모델 인스턴스를 업데이트할 수 있습니다:

```php
$orders->searchable();
```


#### 가져오기 전에 레코드 수정하기 {#modifying-records-before-importing}

때때로 모델 컬렉션을 검색 가능하게 만들기 전에 준비해야 할 필요가 있습니다. 예를 들어, 관계 데이터를 효율적으로 검색 인덱스에 추가할 수 있도록 관계를 eager load 하고 싶을 수 있습니다. 이를 위해 해당 모델에 `makeSearchableUsing` 메서드를 정의하면 됩니다:

```php
use Illuminate\Database\Eloquent\Collection;

/**
 * 검색 가능하게 만들 모델 컬렉션을 수정합니다.
 */
public function makeSearchableUsing(Collection $models): Collection
{
    return $models->load('author');
}
```


### 레코드 삭제하기 {#removing-records}

인덱스에서 레코드를 제거하려면 데이터베이스에서 해당 모델을 `delete` 하면 됩니다. 이는 [소프트 삭제](/laravel/12.x/eloquent#soft-deleting) 모델을 사용하는 경우에도 가능합니다:

```php
use App\Models\Order;

$order = Order::find(1);

$order->delete();
```

레코드를 삭제하기 전에 모델을 조회하고 싶지 않다면, Eloquent 쿼리 인스턴스에서 `unsearchable` 메서드를 사용할 수 있습니다:

```php
Order::where('price', '>', 100)->unsearchable();
```

관계에 있는 모든 모델의 검색 인덱스 레코드를 제거하고 싶다면, 관계 인스턴스에서 `unsearchable`을 호출할 수 있습니다:

```php
$user->orders()->unsearchable();
```

또는 이미 메모리에 Eloquent 모델 컬렉션이 있다면, 컬렉션 인스턴스에서 `unsearchable` 메서드를 호출하여 해당 모델 인스턴스를 인덱스에서 제거할 수 있습니다:

```php
$orders->unsearchable();
```

모든 모델 레코드를 해당 인덱스에서 제거하려면, `removeAllFromSearch` 메서드를 호출하면 됩니다:

```php
Order::removeAllFromSearch();
```


### 인덱싱 일시 중지 {#pausing-indexing}

때때로 모델 데이터를 검색 인덱스와 동기화하지 않고 Eloquent 작업을 일괄적으로 수행해야 할 때가 있습니다. 이럴 때는 `withoutSyncingToSearch` 메서드를 사용할 수 있습니다. 이 메서드는 즉시 실행되는 단일 클로저를 인수로 받습니다. 클로저 내에서 발생하는 모든 모델 작업은 모델의 인덱스와 동기화되지 않습니다:

```php
use App\Models\Order;

Order::withoutSyncingToSearch(function () {
    // 모델 작업 수행...
});
```


### 조건부로 검색 가능한 모델 인스턴스 {#conditionally-searchable-model-instances}

때때로 특정 조건에서만 모델을 검색 가능하게 만들어야 할 때가 있습니다. 예를 들어, `App\Models\Post` 모델이 "draft"(초안)와 "published"(게시됨) 두 가지 상태 중 하나일 수 있다고 가정해 봅시다. "published" 상태의 게시글만 검색 가능하게 하고 싶을 수 있습니다. 이를 위해 모델에 `shouldBeSearchable` 메서드를 정의할 수 있습니다:

```php
/**
 * 모델이 검색 가능해야 하는지 여부를 결정합니다.
 */
public function shouldBeSearchable(): bool
{
    return $this->isPublished();
}
```

`shouldBeSearchable` 메서드는 `save` 및 `create` 메서드, 쿼리, 또는 관계를 통해 모델을 조작할 때만 적용됩니다. `searchable` 메서드를 사용하여 모델이나 컬렉션을 직접 검색 가능하게 만들면 `shouldBeSearchable` 메서드의 결과를 무시하게 됩니다.

> [!WARNING]
> `shouldBeSearchable` 메서드는 Scout의 "database" 엔진을 사용할 때는 적용되지 않습니다. 모든 검색 가능한 데이터가 항상 데이터베이스에 저장되기 때문입니다. 데이터베이스 엔진을 사용할 때 유사한 동작을 원한다면 [where 절](#where-clauses)을 대신 사용해야 합니다.


## 검색하기 {#searching}

모델을 검색하려면 `search` 메서드를 사용하면 됩니다. `search` 메서드는 모델을 검색하는 데 사용할 단일 문자열을 인수로 받습니다. 그런 다음 검색 쿼리에 `get` 메서드를 체이닝하여 주어진 검색 쿼리와 일치하는 Eloquent 모델을 가져올 수 있습니다:

```php
use App\Models\Order;

$orders = Order::search('Star Trek')->get();
```

Scout 검색은 Eloquent 모델의 컬렉션을 반환하므로, 라우트나 컨트롤러에서 결과를 직접 반환하면 자동으로 JSON으로 변환됩니다:

```php
use App\Models\Order;
use Illuminate\Http\Request;

Route::get('/search', function (Request $request) {
    return Order::search($request->search)->get();
});
```

Eloquent 모델로 변환되기 전의 원시 검색 결과를 얻고 싶다면, `raw` 메서드를 사용할 수 있습니다:

```php
$orders = Order::search('Star Trek')->raw();
```


#### 커스텀 인덱스 {#custom-indexes}

검색 쿼리는 일반적으로 모델의 [searchableAs](#configuring-model-indexes) 메서드에서 지정한 인덱스에서 수행됩니다. 그러나 `within` 메서드를 사용하여 대신 검색할 커스텀 인덱스를 지정할 수 있습니다:

```php
$orders = Order::search('Star Trek')
    ->within('tv_shows_popularity_desc')
    ->get();
```


### Where 절 {#where-clauses}

Scout는 검색 쿼리에 간단한 "where" 절을 추가할 수 있도록 지원합니다. 현재 이 절은 기본적인 숫자 동등성 검사만 지원하며, 주로 소유자 ID로 검색 쿼리의 범위를 지정하는 데 유용합니다:

```php
use App\Models\Order;

$orders = Order::search('Star Trek')->where('user_id', 1)->get();
```

또한, `whereIn` 메서드를 사용하여 주어진 컬럼의 값이 지정된 배열에 포함되어 있는지 확인할 수 있습니다:

```php
$orders = Order::search('Star Trek')->whereIn(
    'status', ['open', 'paid']
)->get();
```

`whereNotIn` 메서드는 주어진 컬럼의 값이 지정된 배열에 포함되어 있지 않은지 확인합니다:

```php
$orders = Order::search('Star Trek')->whereNotIn(
    'status', ['closed']
)->get();
```

검색 인덱스는 관계형 데이터베이스가 아니기 때문에, 더 복잡한 "where" 절은 현재 지원되지 않습니다.

> [!WARNING]
> 애플리케이션에서 Meilisearch를 사용하는 경우, Scout의 "where" 절을 사용하기 전에 반드시 애플리케이션의 [filterable attributes](#configuring-filterable-data-for-meilisearch)를 구성해야 합니다.


### 페이지네이션 {#pagination}

모델 컬렉션을 조회하는 것 외에도, `paginate` 메서드를 사용하여 검색 결과를 페이지네이션할 수 있습니다. 이 메서드는 [기존 Eloquent 쿼리를 페이지네이션](/laravel/12.x/pagination)한 것과 마찬가지로 `Illuminate\Pagination\LengthAwarePaginator` 인스턴스를 반환합니다:

```php
use App\Models\Order;

$orders = Order::search('Star Trek')->paginate();
```

`paginate` 메서드의 첫 번째 인수로 페이지당 조회할 모델의 개수를 지정할 수 있습니다:

```php
$orders = Order::search('Star Trek')->paginate(15);
```

결과를 조회한 후에는, [Blade](/laravel/12.x/blade)를 사용하여 기존 Eloquent 쿼리를 페이지네이션한 것과 마찬가지로 결과를 표시하고 페이지 링크를 렌더링할 수 있습니다:

```html
<div class="container">
    @foreach ($orders as $order)
        {{ $order->price }}
    @endforeach
</div>

{{ $orders->links() }}
```

물론, 페이지네이션 결과를 JSON으로 받고 싶다면, 라우트나 컨트롤러에서 페이지네이터 인스턴스를 직접 반환할 수 있습니다:

```php
use App\Models\Order;
use Illuminate\Http\Request;

Route::get('/orders', function (Request $request) {
    return Order::search($request->input('query'))->paginate(15);
});
```

> [!WARNING]
> 검색 엔진은 Eloquent 모델의 글로벌 스코프 정의를 인식하지 못하므로, Scout 페이지네이션을 사용하는 애플리케이션에서는 글로벌 스코프를 사용하지 않아야 합니다. 또는, Scout를 통해 검색할 때 글로벌 스코프의 제약 조건을 재구성해야 합니다.


### 소프트 삭제 {#soft-deleting}

인덱싱된 모델이 [소프트 삭제](/laravel/12.x/eloquent#soft-deleting)를 사용하고 있고, 소프트 삭제된 모델도 검색해야 한다면 `config/scout.php` 설정 파일의 `soft_delete` 옵션을 `true`로 설정하세요:

```php
'soft_delete' => true,
```

이 설정 옵션이 `true`로 되어 있으면, Scout는 소프트 삭제된 모델을 검색 인덱스에서 제거하지 않습니다. 대신, 인덱싱된 레코드에 숨겨진 `__soft_deleted` 속성을 설정합니다. 이후, 검색 시 `withTrashed` 또는 `onlyTrashed` 메서드를 사용하여 소프트 삭제된 레코드를 조회할 수 있습니다:

```php
use App\Models\Order;

// 결과를 조회할 때 삭제된(trashed) 레코드도 포함...
$orders = Order::search('Star Trek')->withTrashed()->get();

// 결과를 조회할 때 삭제된(trashed) 레코드만 포함...
$orders = Order::search('Star Trek')->onlyTrashed()->get();
```

> [!NOTE]
> 소프트 삭제된 모델이 `forceDelete`를 사용해 영구적으로 삭제될 경우, Scout는 해당 모델을 검색 인덱스에서 자동으로 제거합니다.


### 엔진 검색 사용자 정의 {#customizing-engine-searches}

엔진의 검색 동작을 고급으로 사용자 정의해야 하는 경우, `search` 메서드의 두 번째 인수로 클로저를 전달할 수 있습니다. 예를 들어, 이 콜백을 사용하여 검색 쿼리가 Algolia로 전달되기 전에 검색 옵션에 지리 위치 데이터를 추가할 수 있습니다:

```php
use Algolia\AlgoliaSearch\SearchIndex;
use App\Models\Order;

Order::search(
    'Star Trek',
    function (SearchIndex $algolia, string $query, array $options) {
        $options['body']['query']['bool']['filter']['geo_distance'] = [
            'distance' => '1000km',
            'location' => ['lat' => 36, 'lon' => 111],
        ];

        return $algolia->search($query, $options);
    }
)->get();
```


#### Eloquent 결과 쿼리 커스터마이징 {#customizing-the-eloquent-results-query}

Scout가 애플리케이션의 검색 엔진에서 일치하는 Eloquent 모델 목록을 가져온 후, Eloquent는 기본 키를 사용하여 모든 일치하는 모델을 조회합니다. 이 쿼리는 `query` 메서드를 호출하여 커스터마이징할 수 있습니다. `query` 메서드는 Eloquent 쿼리 빌더 인스턴스를 인수로 받는 클로저를 인자로 전달받습니다:

```php
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;

$orders = Order::search('Star Trek')
    ->query(fn (Builder $query) => $query->with('invoices'))
    ->get();
```

이 콜백은 관련 모델이 이미 애플리케이션의 검색 엔진에서 조회된 후에 호출되므로, `query` 메서드는 결과를 "필터링"하는 용도로 사용해서는 안 됩니다. 대신, [Scout where 절](#where-clauses)을 사용해야 합니다.


## 커스텀 엔진 {#custom-engines}


#### 엔진 작성하기 {#writing-the-engine}

기본 제공되는 Scout 검색 엔진이 여러분의 요구에 맞지 않는 경우, 직접 커스텀 엔진을 작성하여 Scout에 등록할 수 있습니다. 여러분이 작성하는 엔진은 `Laravel\Scout\Engines\Engine` 추상 클래스를 확장해야 합니다. 이 추상 클래스에는 여러분의 커스텀 엔진이 반드시 구현해야 하는 여덟 개의 메서드가 포함되어 있습니다:

```php
use Laravel\Scout\Builder;

abstract public function update($models);
abstract public function delete($models);
abstract public function search(Builder $builder);
abstract public function paginate(Builder $builder, $perPage, $page);
abstract public function mapIds($results);
abstract public function map(Builder $builder, $results, $model);
abstract public function getTotalCount($results);
abstract public function flush($model);
```

이 메서드들의 구현 예시로 `Laravel\Scout\Engines\AlgoliaEngine` 클래스의 구현을 참고하면 도움이 될 수 있습니다. 이 클래스는 각 메서드를 여러분의 엔진에서 어떻게 구현할 수 있는지 학습하는 데 좋은 출발점을 제공합니다.


#### 엔진 등록하기 {#registering-the-engine}

커스텀 엔진을 작성한 후에는 Scout 엔진 매니저의 `extend` 메서드를 사용하여 Scout에 등록할 수 있습니다. Scout의 엔진 매니저는 Laravel 서비스 컨테이너에서 해결할 수 있습니다. `extend` 메서드는 `App\Providers\AppServiceProvider` 클래스의 `boot` 메서드나 애플리케이션에서 사용하는 다른 서비스 프로바이더에서 호출해야 합니다:

```php
use App\ScoutExtensions\MySqlSearchEngine;
use Laravel\Scout\EngineManager;

/**
 * 애플리케이션 서비스를 부트스트랩합니다.
 */
public function boot(): void
{
    resolve(EngineManager::class)->extend('mysql', function () {
        return new MySqlSearchEngine;
    });
}
```

엔진이 등록되면, 애플리케이션의 `config/scout.php` 설정 파일에서 기본 Scout `driver`로 지정할 수 있습니다:

```php
'driver' => 'mysql',
```
