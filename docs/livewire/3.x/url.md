# URL 쿼리 파라미터
Livewire는 컴포넌트 속성을 URL의 쿼리 문자열에 저장할 수 있도록 해줍니다. 예를 들어, 컴포넌트에 `$search` 속성을 포함시켜 URL에 다음과 같이 표시할 수 있습니다: `https://example.com/users?search=bob`. 이는 필터링, 정렬, 페이지네이션과 같은 기능에 특히 유용하며, 사용자가 페이지의 특정 상태를 공유하거나 북마크할 수 있게 해줍니다.

## 기본 사용법 {#basic-usage}

아래는 사용자의 이름으로 검색할 수 있는 간단한 텍스트 입력을 제공하는 `ShowUsers` 컴포넌트입니다:
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

보시다시피, 텍스트 입력이 `wire:model.live="search"`를 사용하고 있기 때문에, 사용자가 필드에 입력할 때마다 네트워크 요청이 전송되어 `$search` 속성이 업데이트되고 페이지에 필터링된 사용자 목록이 표시됩니다.

하지만 방문자가 페이지를 새로고침하면 검색 값과 결과가 사라집니다.

방문자가 페이지를 새로고침하거나 URL을 공유할 수 있도록 검색 값을 페이지 로드 간에 유지하려면, 아래와 같이 `$search` 속성 위에 `#[Url]` 속성을 추가하여 검색 값을 URL의 쿼리 문자열에 저장할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    #[Url] // [!code highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'posts' => User::search($this->search)->get(),
        ]);
    }
}
```

이제 사용자가 검색 필드에 "bob"을 입력하면, 브라우저의 URL 표시줄에 다음과 같이 표시됩니다:

```
https://example.com/users?search=bob
```

이제 이 URL을 새 브라우저 창에서 로드하면, 검색 필드에 "bob"이 채워지고 사용자 결과도 이에 맞게 필터링됩니다.

## URL에서 속성 초기화하기 {#initializing-properties-from-the-url}

이전 예제에서 보았듯이, 속성이 `#[Url]`을 사용할 때, 해당 속성의 값이 변경될 때마다 쿼리 문자열에 저장될 뿐만 아니라, 페이지 로드 시 기존 쿼리 문자열 값도 참조합니다.

예를 들어, 사용자가 `https://example.com/users?search=bob` URL을 방문하면, Livewire는 `$search`의 초기 값을 "bob"으로 설정합니다.

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

### 널 허용 속성 {#nullable-properties}

기본적으로, `?search=`와 같이 비어 있는 쿼리 문자열 항목으로 페이지가 로드되면, Livewire는 해당 값을 빈 문자열로 처리합니다. 대부분의 경우 이는 예상된 동작이지만, 때로는 `?search=`를 `null`로 처리하고 싶을 때가 있습니다.

이런 경우에는 다음과 같이 널 허용 타입힌트를 사용할 수 있습니다:

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public ?string $search; // [!code highlight]

    // ...
}
```

위 타입힌트에 `?`가 있기 때문에, Livewire는 `?search=`를 보고 `$search`를 빈 문자열 대신 `null`로 설정합니다.

반대로, 애플리케이션에서 `$this->search = null`로 설정하면, 쿼리 문자열에는 `?search=`로 표시됩니다.

## 별칭 사용하기 {#using-an-alias}

Livewire는 URL의 쿼리 문자열에 표시되는 이름을 완전히 제어할 수 있도록 해줍니다. 예를 들어, `$search` 속성이 있지만 실제 속성 이름을 숨기거나 `q`로 짧게 표시하고 싶을 수 있습니다.

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

이제 사용자가 검색 필드에 "bob"을 입력하면, URL에는 `?search=bob` 대신 `https://example.com/users?q=bob`가 표시됩니다.

## 특정 값 제외하기 {#excluding-certain-values}

기본적으로 Livewire는 값이 초기화 시점과 달라졌을 때만 쿼리 문자열에 항목을 추가합니다. 대부분의 경우 이는 원하는 동작이지만, Livewire가 쿼리 문자열에서 어떤 값을 제외할지 더 세밀하게 제어하고 싶을 때가 있습니다. 이런 경우에는 `except` 파라미터를 사용할 수 있습니다.

예를 들어, 아래 컴포넌트에서는 `mount()`에서 `$search`의 초기값이 변경됩니다. 브라우저가 쿼리 문자열에서 `search`를 제외하는 경우가 오직 `search` 값이 빈 문자열일 때만 되도록 하려면, `#[Url]`에 `except` 파라미터를 추가합니다:

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

위 예제에서 `except`가 없으면, Livewire는 `search` 값이 `auth()->user()->username`의 초기값과 같을 때마다 쿼리 문자열에서 `search` 항목을 제거합니다. 대신, `except: ''`가 사용되었기 때문에, Livewire는 `search`가 빈 문자열일 때만 쿼리 문자열 값을 제외하고, 그 외에는 모두 보존합니다.

## 페이지 로드시 표시 {#display-on-page-load}

기본적으로 Livewire는 값이 페이지에서 변경된 후에만 쿼리 문자열에 값을 표시합니다. 예를 들어, `$search`의 기본값이 빈 문자열(`""`)이라면, 실제 검색 입력이 비어 있을 때 URL에는 아무 값도 나타나지 않습니다.

값이 비어 있어도 항상 `?search` 항목이 쿼리 문자열에 포함되길 원한다면, `#[Url]` 속성에 `keep` 파라미터를 제공할 수 있습니다:

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

이제 페이지가 로드되면, URL이 다음과 같이 변경됩니다: `https://example.com/users?search=`

## 히스토리에 저장하기 {#storing-in-history}

기본적으로 Livewire는 URL을 수정할 때 [`history.replaceState()`](https://developer.mozilla.org/ko/docs/Web/API/History/replaceState)를 사용하며, [`history.pushState()`](https://developer.mozilla.org/ko/docs/Web/API/History/pushState)는 사용하지 않습니다. 즉, Livewire가 쿼리 문자열을 업데이트할 때 브라우저의 히스토리 상태에서 현재 항목을 수정하며, 새 항목을 추가하지 않습니다.

Livewire가 현재 히스토리를 "대체"하기 때문에, 브라우저의 "뒤로 가기" 버튼을 누르면 이전 `?search=` 값이 아니라 이전 페이지로 이동합니다.

Livewire가 URL을 업데이트할 때 `history.pushState`를 사용하도록 강제하려면, `#[Url]` 속성에 `history` 파라미터를 제공할 수 있습니다:

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

위 예제에서 사용자가 검색 값을 "bob"에서 "frank"로 변경한 후 브라우저의 뒤로 가기 버튼을 클릭하면, 검색 값(및 URL)이 이전 페이지로 이동하는 대신 "bob"으로 다시 설정됩니다.

## queryString 메서드 사용하기 {#using-the-querystring-method}

쿼리 문자열은 컴포넌트의 메서드로도 정의할 수 있습니다. 일부 속성에 동적 옵션이 필요한 경우 유용할 수 있습니다.

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
