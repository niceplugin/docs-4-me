---
title: 페이지네이션 Blade 컴포넌트
---
# [핵심개념.Blade컴포넌트] pagination
## 개요 {#overview}

페이지네이션 컴포넌트는 Livewire Blade 뷰에서만 사용할 수 있습니다. 페이지네이션된 링크 목록을 렌더링할 수 있습니다:

```php
use App\Models\User;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class ListUsers extends Component
{
    // ...
    
    public function render(): View
    {
        return view('livewire.list-users', [
            'users' => User::query()->paginate(10),
        ]);
    }
}
```

```blade
<x-filament::pagination :paginator="$users" />
```

또는, 단순 페이지네이션이나 커서 페이지네이션을 사용할 수도 있으며, 이 경우 "이전"과 "다음" 버튼만 렌더링됩니다:

```php
use App\Models\User;

User::query()->simplePaginate(10)
User::query()->cursorPaginate(10)
```

## 사용자가 페이지당 항목 수를 커스터마이즈할 수 있도록 허용하기 {#allowing-the-user-to-customize-the-number-of-items-per-page}

`page-options` 속성에 옵션 배열을 전달하여 사용자가 페이지당 항목 수를 커스터마이즈할 수 있도록 할 수 있습니다. 또한 사용자의 선택이 저장될 Livewire 속성을 정의해야 합니다:

```php
use App\Models\User;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class ListUsers extends Component
{
    public int | string $perPage = 10;
    
    // ...
    
    public function render(): View
    {
        return view('livewire.list-users', [
            'users' => User::query()->paginate($this->perPage),
        ]);
    }
}
```

```blade
<x-filament::pagination
    :paginator="$users"
    :page-options="[5, 10, 20, 50, 100, 'all']"
    :current-page-option-property="perPage"
/>
```

## 첫 페이지와 마지막 페이지로의 링크 표시하기 {#displaying-links-to-the-first-and-the-last-page}

Extreme 링크는 첫 페이지와 마지막 페이지 링크입니다. 컴포넌트에 `extreme-links` 속성을 전달하여 추가할 수 있습니다:

```blade
<x-filament::pagination
    :paginator="$users"
    extreme-links
/>
```
