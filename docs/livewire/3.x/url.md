# URL 쿼리 파라미터
Livewire는 컴포넌트 속성을 URL의 쿼리 문자열에 저장할 수 있도록 해줍니다. 예를 들어, 컴포넌트의 `$search` 속성을 URL에 포함시키고 싶을 수 있습니다: `https://example.com/users?search=bob`. 이는 필터링, 정렬, 페이지네이션과 같은 기능에 특히 유용하며, 사용자가 페이지의 특정 상태를 공유하거나 북마크할 수 있게 해줍니다.

## 기본 사용법 {#basic-usage}

아래는 사용자의 이름으로 검색할 수 있는 간단한 텍스트 입력 필드를 제공하는 `ShowUsers` 컴포넌트입니다:
```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'users' => User::search($this->search)->get(),
        ]);
    }
}
```

```blade
<div>
    <input type="text" wire:model.live="search">

    <ul>
        @foreach ($users as $user)
            <li wire:key="{{ $user->id }}">{{ $user->name }}</li>
        @endforeach
    </ul>
</div>
```

보시다시피, 텍스트 입력 필드에 `wire:model.live="search"`를 사용했기 때문에 사용자가 입력할 때마다 네트워크 요청이 전송되어 `$search` 속성이 업데이트되고, 페이지에 필터링된 사용자 목록이 표시됩니다.

하지만 방문자가 페이지를 새로고침하면 검색 값과 결과가 사라집니다.

방문자가 페이지를 새로고침하거나 URL을 공유해도 검색 값을 유지하려면, `$search` 속성 위에 `#[Url]` 속성을 추가하여 검색 값을 URL의 쿼리 문자열에 저장할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    #[Url] // [tl! highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'posts' => User::search($this->search)->get(),
        ]);
    }
}
```

이제 사용자가 검색 필드에 "bob"을 입력하면, 브라우저의 URL 표시줄에 다음과 같이 나타납니다:

```
https://example.com/users?search=bob
```

이제 이 URL을 새로운 브라우저 창에서 불러오면, 검색 필드에 "bob"이 자동으로 입력되고, 사용자 결과도 이에 맞게 필터링됩니다.

## URL에서 속성 초기화하기 {#initializing-properties-from-the-url}

이전 예제에서 본 것처럼, 속성에 `#[Url]`을 사용하면 해당 속성의 값이 변경될 때마다 URL의 쿼리 문자열에 저장될 뿐만 아니라, 페이지가 로드될 때 기존 쿼리 문자열 값도 참조합니다.

예를 들어, 사용자가 `https://example.com/users?search=bob` URL에 방문하면 Livewire는 `$search`의 초기 값을 "bob"으로 설정합니다.

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public $search = ''; // "bob"으로 설정됩니다...

    // ...
}
```

### Nullable properties {#nullable-properties}

기본적으로, 페이지가 `?search=`와 같이 비어 있는 쿼리 문자열 항목으로 로드되면 Livewire는 해당 값을 빈 문자열로 처리합니다. 대부분의 경우 이는 예상된 동작이지만, 때로는 `?search=`가 `null`로 처리되길 원할 때도 있습니다.

이런 경우에는 다음과 같이 nullable 타입힌트를 사용할 수 있습니다:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public ?string $search; // [tl! highlight]

    // ...
}
```

위 타입힌트에 `?`가 있기 때문에, Livewire는 `?search=`를 보고 `$search`를 빈 문자열이 아닌 `null`로 설정합니다.

반대로, 애플리케이션에서 `$this->search = null`로 설정하면 쿼리 문자열에서 `?search=`로 표현됩니다.

## 별칭 사용하기 {#using-an-alias}

Livewire는 URL의 쿼리 문자열에 표시되는 이름을 완전히 제어할 수 있도록 해줍니다. 예를 들어, `$search` 속성이 있지만 실제 속성 이름을 숨기거나 `q`로 짧게 만들고 싶을 수 있습니다.

`#[Url]` 속성에 `as` 파라미터를 제공하여 쿼리 문자열 별칭을 지정할 수 있습니다:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(as: 'q')]
    public $search = '';

    // ...
}
```

이제 사용자가 검색 필드에 "bob"을 입력하면, URL은 `?search=bob` 대신 `https://example.com/users?q=bob`로 표시됩니다.

## 특정 값 제외하기 {#excluding-certain-values}

기본적으로 Livewire는 값이 초기화 시점에서 변경된 경우에만 쿼리 문자열에 항목을 추가합니다. 대부분의 경우 이러한 동작이 원하는 방식이지만, 어떤 상황에서는 Livewire가 쿼리 문자열에서 제외할 값을 더 세밀하게 제어하고 싶을 수 있습니다. 이런 경우에는 `except` 파라미터를 사용할 수 있습니다.

예를 들어, 아래 컴포넌트에서는 `$search`의 초기값이 `mount()`에서 변경됩니다. 브라우저가 오직 `search` 값이 빈 문자열일 때만 쿼리 문자열에서 `search`를 제외하도록 하려면, `#[Url]`에 `except` 파라미터를 추가하면 됩니다:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(except: '')]
    public $search = '';

    public function mount() {
        $this->search = auth()->user()->username;
    }

    // ...
}
```

위 예시에서 `except`를 사용하지 않으면, Livewire는 `search` 값이 초기값인 `auth()->user()->username`과 같을 때마다 쿼리 문자열에서 `search` 항목을 제거합니다. 반면, `except: ''`를 사용하면, Livewire는 `search`가 빈 문자열일 때만 쿼리 문자열에서 값을 제외하고, 그 외의 모든 쿼리 문자열 값은 유지합니다.

## 페이지 로드 시 표시 {#display-on-page-load}

기본적으로 Livewire는 값이 페이지에서 변경된 후에만 쿼리 문자열에 값을 표시합니다. 예를 들어, `$search`의 기본값이 빈 문자열 `""`인 경우, 실제 검색 입력이 비어 있으면 URL에 아무 값도 나타나지 않습니다.

값이 비어 있어도 항상 `?search` 항목이 쿼리 문자열에 포함되도록 하려면, `#[Url]` 속성에 `keep` 파라미터를 추가할 수 있습니다:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(keep: true)]
    public $search = '';

    // ...
}
```

이제 페이지가 로드될 때, URL은 다음과 같이 변경됩니다: `https://example.com/users?search=`

## 히스토리에 저장하기 {#storing-in-history}

기본적으로 Livewire는 URL을 수정할 때 [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) 대신 [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)를 사용합니다. 즉, Livewire가 쿼리 문자열을 업데이트할 때 브라우저의 히스토리 상태에서 현재 항목을 수정하며, 새로운 항목을 추가하지 않습니다.

Livewire가 현재 히스토리를 "대체"하기 때문에, 브라우저의 "뒤로 가기" 버튼을 누르면 이전 `?search=` 값이 아니라 이전 페이지로 이동하게 됩니다.

URL을 업데이트할 때 Livewire가 `history.pushState`를 사용하도록 강제하려면, `#[Url]` 속성에 `history` 파라미터를 제공하면 됩니다:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(history: true)]
    public $search = '';

    // ...
}
```

위 예시에서 사용자가 검색 값을 "bob"에서 "frank"로 변경한 후 브라우저의 뒤로 가기 버튼을 클릭하면, 검색 값(및 URL)이 이전에 방문한 페이지로 이동하는 대신 "bob"으로 다시 설정됩니다.

## queryString 메서드 사용하기 {#using-the-querystring-method}

쿼리 문자열은 컴포넌트의 메서드로도 정의할 수 있습니다. 일부 속성에 동적 옵션이 필요한 경우에 유용할 수 있습니다.

```php
use Livewire\Component;

class ShowUsers extends Component
{
    // ...

    protected function queryString()
    {
        return [
            'search' => [
                'as' => 'q',
            ],
        ];
    }
}
```

## 트레이트 훅 {#trait-hooks}

Livewire는 쿼리 문자열에 대해서도 [훅](/livewire/3.x/lifecycle-hooks)을 제공합니다.

```php
trait WithSorting
{
    // ...

    protected function queryStringWithSorting()
    {
        return [
            'sortBy' => ['as' => 'sort'],
            'sortDirection' => ['as' => 'direction'],
        ];
    }
}
```
