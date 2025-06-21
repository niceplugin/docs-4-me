# 페이지네이션
Laravel의 페이지네이션 기능을 사용하면 데이터의 일부만 쿼리하고, 사용자가 해당 결과의 *페이지*를 오갈 수 있도록 해줍니다.

Laravel의 페이지네이터는 정적 애플리케이션을 위해 설계되었기 때문에, Livewire가 아닌 일반 앱에서는 각 페이지 이동 시 원하는 페이지가 포함된 새로운 URL(`?page=2`)로 전체 브라우저 방문이 발생합니다.

하지만 Livewire 컴포넌트 내에서 페이지네이션을 사용할 경우, 사용자는 같은 페이지 내에서 페이지를 오갈 수 있습니다. Livewire가 모든 과정을 백그라운드에서 처리하며, 현재 페이지가 URL 쿼리 문자열에 반영되도록 해줍니다.

## 기본 사용법 {#basic-usage}

아래는 `ShowPosts` 컴포넌트 내에서 한 번에 10개의 게시글만 보여주는 가장 기본적인 페이지네이션 예시입니다:

> [!warning] 반드시 `WithPagination` 트레이트를 사용해야 합니다
> Livewire의 페이지네이션 기능을 사용하려면, 페이지네이션이 포함된 각 컴포넌트에서 반드시 `Livewire\WithPagination` 트레이트를 사용해야 합니다.
```php
<?php

namespace App\Livewire;

use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::paginate(10),
        ]);
    }
}
```

```blade
<div>
    <div>
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    </div>

    {{ $posts->links() }}
</div>
```

보시다시피, `Post::paginate()` 메서드를 통해 보여줄 게시글 수를 제한하는 것 외에도, `$posts->links()`를 사용해 페이지 이동 링크를 렌더링합니다.

Laravel에서 페이지네이션에 대한 더 자세한 정보는 [Laravel의 포괄적인 페이지네이션 문서](/laravel/12.x/pagination)를 참고하세요.

## URL 쿼리 문자열 추적 비활성화 {#disabling-url-query-string-tracking}

기본적으로 Livewire의 페이지네이터는 현재 페이지를 브라우저 URL의 쿼리 문자열에 다음과 같이 추적합니다: `?page=2`

Livewire의 페이지네이션 기능은 그대로 사용하되, 쿼리 문자열 추적만 비활성화하고 싶다면 `WithoutUrlPagination` 트레이트를 사용하면 됩니다:

```php
use Livewire\WithoutUrlPagination;
use Livewire\WithPagination;
use Livewire\Component;

class ShowPosts extends Component
{
    use WithPagination, WithoutUrlPagination; // [!code highlight]

    // ...
}
```

이제 페이지네이션은 정상적으로 동작하지만, 현재 페이지가 쿼리 문자열에 표시되지 않습니다. 이는 페이지 변경 시 현재 페이지가 유지되지 않는다는 의미이기도 합니다.

## 스크롤 동작 커스터마이징 {#customizing-scroll-behavior}

기본적으로 Livewire의 페이지네이터는 페이지가 변경될 때마다 페이지 상단으로 스크롤합니다.

이 동작을 비활성화하려면, `links()` 메서드의 `scrollTo` 파라미터에 `false`를 전달하면 됩니다:

```blade
{{ $posts->links(data: ['scrollTo' => false]) }}
```

또는, `scrollTo` 파라미터에 원하는 CSS 선택자를 지정하면, Livewire가 해당 선택자와 일치하는 가장 가까운 요소를 찾아 페이지 이동 후 그 위치로 스크롤합니다:

```blade
{{ $posts->links(data: ['scrollTo' => '#paginated-posts']) }}
```

## 페이지 리셋하기 {#resetting-the-page}

결과를 정렬하거나 필터링할 때, 페이지 번호를 `1`로 리셋하고 싶은 경우가 많습니다.

이를 위해 Livewire는 `$this->resetPage()` 메서드를 제공하여, 컴포넌트 어디서든 페이지 번호를 리셋할 수 있습니다.

아래 컴포넌트는 검색 폼 제출 후 페이지를 리셋하는 방법을 보여줍니다:

```php
<?php

namespace App\Livewire;

use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Post;

class SearchPosts extends Component
{
    use WithPagination;

    public $query = '';

    public function search()
    {
        $this->resetPage();
    }

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::where('title', 'like', '%'.$this->query.'%')->paginate(10),
        ]);
    }
}
```

```blade
<div>
    <form wire:submit="search">
        <input type="text" wire:model="query">

        <button type="submit">Search posts</button>
    </form>

    <div>
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    </div>

    {{ $posts->links() }}
</div>
```

이제 사용자가 결과의 `5`페이지에 있다가 "Search posts" 버튼을 눌러 결과를 더 필터링하면, 페이지가 다시 `1`로 리셋됩니다.

### 사용 가능한 페이지 이동 메서드 {#available-page-navigation-methods}

`$this->resetPage()` 외에도, Livewire는 컴포넌트에서 프로그래밍적으로 페이지를 이동할 수 있는 유용한 메서드들을 제공합니다:

| 메서드        | 설명                               |
|-----------------|-------------------------------------------|
| `$this->setPage($page)`    | 페이지네이터를 특정 페이지 번호로 설정 |
| `$this->resetPage()`    | 페이지를 1로 리셋 |
| `$this->nextPage()`    | 다음 페이지로 이동 |
| `$this->previousPage()`    | 이전 페이지로 이동 |

## 다중 페이지네이터 {#multiple-paginators}

Laravel과 Livewire 모두 현재 페이지 번호를 저장하고 추적하기 위해 URL 쿼리 문자열 파라미터를 사용하기 때문에, 한 페이지에 여러 페이지네이터가 있을 경우 각각에 다른 이름을 지정하는 것이 중요합니다.

문제를 더 명확히 보여주기 위해, 아래의 `ShowClients` 컴포넌트를 살펴보세요:

```php
use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Client;

class ShowClients extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-clients', [
            'clients' => Client::paginate(10),
        ]);
    }
}
```

위 컴포넌트는 *clients*의 페이지네이션 결과를 포함하고 있습니다. 사용자가 이 결과의 `2`페이지로 이동하면, URL은 다음과 같이 보일 수 있습니다:

```
http://application.test/?page=2
```

이 페이지에 페이지네이션을 사용하는 `ShowInvoices` 컴포넌트도 있다고 가정해봅시다. 각 페이지네이터의 현재 페이지를 독립적으로 추적하려면, 두 번째 페이지네이터에 이름을 지정해야 합니다:

```php
use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Invoices;

class ShowInvoices extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-invoices', [
            'invoices' => Invoice::paginate(10, pageName: 'invoices-page'),
        ]);
    }
}
```

이제 `paginate` 메서드에 추가된 `pageName` 파라미터 덕분에, 사용자가 *invoices*의 `2`페이지로 이동하면 URL은 다음과 같이 표시됩니다:

```
https://application.test/customers?page=2&invoices-page=2
```

이름이 지정된 페이지네이터에서 Livewire의 페이지 이동 메서드를 사용할 때는, 페이지 이름을 추가 파라미터로 전달해야 합니다:

```php
$this->setPage(2, pageName: 'invoices-page');

$this->resetPage(pageName: 'invoices-page');

$this->nextPage(pageName: 'invoices-page');

$this->previousPage(pageName: 'invoices-page');
```

## 페이지 업데이트에 후킹하기 {#hooking-into-page-updates}

Livewire는 컴포넌트 내에 다음 메서드 중 하나를 정의하여, 페이지가 업데이트되기 전과 후에 코드를 실행할 수 있도록 해줍니다:

```php
use Livewire\WithPagination;

class ShowPosts extends Component
{
    use WithPagination;

    public function updatingPage($page)
    {
        // 이 컴포넌트의 페이지가 업데이트되기 전에 실행됩니다...
    }

    public function updatedPage($page)
    {
        // 이 컴포넌트의 페이지가 업데이트된 후에 실행됩니다...
    }

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::paginate(10),
        ]);
    }
}
```

### 이름이 지정된 페이지네이터 후킹 {#named-paginator-hooks}

이전 후킹 메서드는 기본 페이지네이터에만 적용됩니다. 이름이 지정된 페이지네이터를 사용하는 경우, 페이지네이터 이름을 사용하여 메서드를 정의해야 합니다.

예를 들어, 아래는 `invoices-page`라는 이름의 페이지네이터 후킹 예시입니다:

```php
public function updatingInvoicesPage($page)
{
    //
}
```

### 일반 페이지네이터 후킹 {#general-paginator-hooks}

후킹 메서드 이름에 페이지네이터 이름을 사용하고 싶지 않다면, 더 일반적인 대안을 사용할 수 있으며, 후킹 메서드의 두 번째 인자로 `$pageName`을 받을 수 있습니다:

```php
public function updatingPaginators($page, $pageName)
{
    // 이 컴포넌트의 페이지가 업데이트되기 전에 실행됩니다...
}

public function updatedPaginators($page, $pageName)
{
    // 이 컴포넌트의 페이지가 업데이트된 후에 실행됩니다...
}
```

## 심플 테마 사용하기 {#using-the-simple-theme}

더 빠르고 간단하게 사용하려면, Laravel의 `simplePaginate()` 메서드를 `paginate()` 대신 사용할 수 있습니다.

이 방법으로 결과를 페이지네이션하면, 각 페이지 번호별 링크 대신 *이전*과 *다음* 이동 링크만 사용자에게 표시됩니다:

```php
public function render()
{
    return view('show-posts', [
        'posts' => Post::simplePaginate(10),
    ]);
}
```

심플 페이지네이션에 대한 더 자세한 정보는 [Laravel의 "simplePaginator" 문서](/laravel/12.x/pagination#simple-pagination)를 참고하세요.

## 커서 페이지네이션 사용하기 {#using-cursor-pagination}

Livewire는 Laravel의 커서 페이지네이션도 지원합니다. 이는 대용량 데이터셋에서 유용한 더 빠른 페이지네이션 방식입니다:

```php
public function render()
{
    return view('show-posts', [
        'posts' => Post::cursorPaginate(10),
    ]);
}
```

`paginate()`나 `simplePaginate()` 대신 `cursorPaginate()`를 사용하면, 애플리케이션의 URL 쿼리 문자열에 표준 페이지 번호 대신 인코딩된 *커서*가 저장됩니다. 예시:

```
https://example.com/posts?cursor=eyJpZCI6MTUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0
```

커서 페이지네이션에 대한 더 자세한 정보는 [Laravel의 커서 페이지네이션 문서](/laravel/12.x/pagination#cursor-pagination)를 참고하세요.

## Tailwind 대신 Bootstrap 사용하기 {#using-bootstrap-instead-of-tailwind}

애플리케이션의 CSS 프레임워크로 [Tailwind](https://tailwindcss.com/) 대신 [Bootstrap](https://getbootstrap.com/)을 사용한다면, Livewire가 기본 Tailwind 뷰 대신 Bootstrap 스타일의 페이지네이션 뷰를 사용하도록 설정할 수 있습니다.

이를 위해 애플리케이션의 `config/livewire.php` 파일에서 `pagination_theme` 설정 값을 지정하세요:

```php
'pagination_theme' => 'bootstrap',
```

> [!info] Livewire 설정 파일 퍼블리싱
> 페이지네이션 테마를 커스터마이징하기 전에, 아래 명령어를 실행하여 Livewire의 설정 파일을 애플리케이션의 `/config` 디렉터리에 먼저 퍼블리싱해야 합니다:
> ```shell
> php artisan livewire:publish --config
> ```

## 기본 페이지네이션 뷰 수정하기 {#modifying-the-default-pagination-views}

애플리케이션 스타일에 맞게 Livewire의 페이지네이션 뷰를 수정하고 싶다면, 아래 명령어로 *퍼블리싱*하여 직접 수정할 수 있습니다:

```shell
php artisan livewire:publish --pagination
```

이 명령어를 실행하면, 다음 네 개의 파일이 `resources/views/vendor/livewire` 디렉터리에 생성됩니다:

| 뷰 파일명        | 설명                               |
|-----------------|-------------------------------------------|
| `tailwind.blade.php`    | 표준 Tailwind 페이지네이션 테마 |
| `tailwind-simple.blade.php`    | *심플* Tailwind 페이지네이션 테마 |
| `bootstrap.blade.php`    | 표준 Bootstrap 페이지네이션 테마 |
| `bootstrap-simple.blade.php`    | *심플* Bootstrap 페이지네이션 테마 |

파일이 퍼블리싱되면, 완전히 자유롭게 수정할 수 있습니다. 템플릿 내에서 페이지네이션 결과의 `->links()` 메서드를 사용해 페이지네이션 링크를 렌더링할 때, Livewire는 자체 뷰 대신 이 파일들을 사용합니다.

## 커스텀 페이지네이션 뷰 사용하기 {#using-custom-pagination-views}

Livewire의 페이지네이션 뷰를 완전히 우회하고 싶다면, 다음 두 가지 방법 중 하나로 직접 렌더링할 수 있습니다:

1. Blade 뷰에서 `->links()` 메서드 사용
2. 컴포넌트에서 `paginationView()` 또는 `paginationSimpleView()` 메서드 사용

### `->links()`를 통한 방법 {#via--links}

첫 번째 방법은, 커스텀 페이지네이션 Blade 뷰 이름을 `->links()` 메서드에 직접 전달하는 것입니다:

```blade
{{ $posts->links('custom-pagination-links') }}
```

페이지네이션 링크를 렌더링할 때, Livewire는 이제 `resources/views/custom-pagination-links.blade.php` 뷰를 찾게 됩니다.

### `paginationView()` 또는 `paginationSimpleView()`를 통한 방법 {#via-paginationview-or-paginationsimpleview}

두 번째 방법은, 컴포넌트 내에 `paginationView` 또는 `paginationSimpleView` 메서드를 선언하여 사용할 뷰의 이름을 반환하는 것입니다:

```php
public function paginationView()
{
    return 'custom-pagination-links-view';
}

public function paginationSimpleView()
{
    return 'custom-simple-pagination-links-view';
}
```

### 샘플 페이지네이션 뷰 {#sample-pagination-view}

아래는 참고용으로 제공되는, 스타일이 적용되지 않은 간단한 Livewire 페이지네이션 뷰 샘플입니다.

보시다시피, 버튼에 `wire:click="nextPage"`를 추가하여 Livewire의 페이지 이동 헬퍼인 `$this->nextPage()` 등을 템플릿 내에서 직접 사용할 수 있습니다:

```blade
<div>
    @if ($paginator->hasPages())
        <nav role="navigation" aria-label="Pagination Navigation">
            <span>
                @if ($paginator->onFirstPage())
                    <span>Previous</span>
                @else
                    <button wire:click="previousPage" wire:loading.attr="disabled" rel="prev">Previous</button>
                @endif
            </span>

            <span>
                @if ($paginator->onLastPage())
                    <span>Next</span>
                @else
                    <button wire:click="nextPage" wire:loading.attr="disabled" rel="next">Next</button>
                @endif
            </span>
        </nav>
    @endif
</div>
```

