# 세션 속성
Livewire는 `#[Session]` 속성을 사용하여 페이지 새로고침/변경 시 속성 값을 쉽게 유지할 수 있도록 해줍니다.

컴포넌트의 속성에 `#[Session]`을 추가하면, 해당 속성의 값이 변경될 때마다 Livewire가 그 값을 세션에 저장합니다. 이렇게 하면 페이지를 새로고침해도 Livewire가 세션에서 최신 값을 가져와 컴포넌트에 사용할 수 있습니다.

`#[Session]` 속성은 [`#[Url]`](/livewire/3.x/url) 속성과 유사합니다. 두 속성 모두 비슷한 상황에서 유용하게 사용할 수 있습니다. 주요 차이점은 `#[Session]`은 URL의 쿼리 문자열을 수정하지 않고 값을 유지한다는 점입니다. 이는 상황에 따라 바람직할 수도, 아닐 수도 있습니다.

## 기본 사용법 {#basic-usage}

아래는 사용자가 `$search` 속성에 저장된 문자열로 표시되는 게시글을 필터링할 수 있는 `ShowPosts` 컴포넌트입니다:

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Session] // [!code highlight]
    public $search;

    protected function posts()
    {
        return $this->search === ''
            ? Post::all()
            : Post::where('title', 'like', '%'.$this->search.'%');
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => $this->posts(),
        ]);
    }
}
```

`#[Session]` 속성이 `$search` 속성에 추가되어 있기 때문에, 사용자가 검색 값을 입력한 후 페이지를 새로고침해도 검색 값이 유지됩니다. `$search`가 업데이트될 때마다 새로운 값이 사용자의 세션에 저장되고, 페이지가 로드될 때마다 사용됩니다.

> [!warning] 성능에 미치는 영향
> Laravel 세션은 모든 요청마다 메모리에 로드되므로, 사용자의 세션에 너무 많은 데이터를 저장하면 해당 사용자의 전체 애플리케이션 성능이 저하될 수 있습니다.

## 커스텀 키 설정하기 {#setting-a-custom-key}

`[#Session]`을 사용할 때, Livewire는 컴포넌트 이름과 속성 이름을 조합하여 동적으로 생성된 키를 사용해 속성 값을 세션에 저장합니다.

이렇게 하면 컴포넌트 인스턴스 간에 속성이 동일한 세션 값을 사용하게 됩니다. 또한, 서로 다른 컴포넌트의 동일한 이름의 속성 간 충돌도 방지할 수 있습니다.

특정 속성에 대해 Livewire가 사용할 세션 키를 완전히 제어하고 싶다면, `key:` 파라미터를 전달할 수 있습니다:

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;

class ShowPosts extends Component
{
    #[Session(key: 'search')] // [!code highlight]
    public $search;

    // ...
}
```

Livewire가 `$search` 속성의 값을 저장하고 가져올 때, 지정한 키 "search"를 사용하게 됩니다.

또한, 컴포넌트 내의 다른 속성에서 동적으로 키를 생성하고 싶다면, 아래와 같이 중괄호 표기법을 사용할 수 있습니다:

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use App\Models\Author;

class ShowPosts extends Component
{
    public Author $author;

    #[Session(key: 'search-{author.id}')] // [!code highlight]
    public $search;

    // ...
}
```

위 예시에서 `$author` 모델의 id가 "4"라면, 세션 키는 `search-4`가 됩니다.
