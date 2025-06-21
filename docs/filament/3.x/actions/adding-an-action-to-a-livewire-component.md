---
title: Livewire 컴포넌트에 액션 추가하기
---
# [액션] Livewire 컴포넌트에 액션 추가하기
## Livewire 컴포넌트 설정하기 {#setting-up-the-livewire-component}

먼저, 새로운 Livewire 컴포넌트를 생성합니다:

```bash
php artisan make:livewire ManageProduct
```

그런 다음, 페이지에서 Livewire 컴포넌트를 렌더링합니다:

```blade
@livewire('manage-product')
```

또는, 전체 페이지 Livewire 컴포넌트를 사용할 수도 있습니다:

```php
use App\Livewire\ManageProduct;
use Illuminate\Support\Facades\Route;

Route::get('products/{product}/manage', ManageProduct::class);
```

Livewire 컴포넌트 클래스에서 `InteractsWithActions`와 `InteractsWithForms` 트레이트를 사용하고, `HasActions`와 `HasForms` 인터페이스를 구현해야 합니다:

```php
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Livewire\Component;

class ManagePost extends Component implements HasForms, HasActions
{
    use InteractsWithActions;
    use InteractsWithForms;

    // ...
}
```

## 액션 추가하기 {#adding-the-action}

액션을 반환하는 메서드를 추가합니다. 이 메서드는 액션과 정확히 같은 이름이거나, 이름 뒤에 `Action`이 붙은 이름이어야 합니다:

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Livewire\Component;

class ManagePost extends Component implements HasForms, HasActions
{
    use InteractsWithActions;
    use InteractsWithForms;

    public Post $post;

    public function deleteAction(): Action
    {
        return Action::make('delete')
            ->requiresConfirmation()
            ->action(fn () => $this->post->delete());
    }
    
    // 이 메서드 이름도 동작합니다. 액션 이름이 `delete`이기 때문입니다:
    // public function delete(): Action
    
    // 이 메서드 이름은 동작하지 않습니다. 액션 이름이 `delete`이지, `deletePost`가 아니기 때문입니다:
    // public function deletePost(): Action

    // ...
}
```

마지막으로, 뷰에서 액션을 렌더링해야 합니다. 이를 위해 <span v-pre>`{{ $this->deleteAction }}`</span>을 사용할 수 있으며, 여기서 `deleteAction`을 액션 메서드 이름으로 바꿔줍니다:

```blade
<div>
    {{ $this->deleteAction }}

    <x-filament-actions::modals />
</div>
```

액션 모달을 렌더링하는 데 필요한 HTML을 주입하는 `<x-filament-actions::modals />`도 필요합니다. 이 컴포넌트 내에서 몇 개의 액션이 있든 한 번만 포함하면 됩니다.

## 액션 인자 전달하기 {#passing-action-arguments}

때때로, 액션에 인자를 전달하고 싶을 수 있습니다. 예를 들어, 같은 액션을 같은 뷰에서 여러 번 렌더링하지만, 매번 다른 모델에 대해 렌더링할 경우, 모델 ID를 인자로 전달하고 나중에 이를 가져올 수 있습니다. 이를 위해 뷰에서 액션을 호출하고 인자를 배열로 전달할 수 있습니다:

```php
<div>
    @foreach ($posts as $post)
        <h2>{{ $post->title }}</h2>

        {{ ($this->deleteAction)(['post' => $post->id]) }}
    @endforeach

    <x-filament-actions::modals />
</div>
```

이제 액션 메서드에서 게시글 ID에 접근할 수 있습니다:

```php
use App\Models\Post;
use Filament\Actions\Action;

public function deleteAction(): Action
{
    return Action::make('delete')
        ->requiresConfirmation()
        ->action(function (array $arguments) {
            $post = Post::find($arguments['post']);

            $post?->delete();
        });
}
```

## Livewire 뷰에서 액션 숨기기 {#hiding-actions-in-a-livewire-view}

액션이 렌더링될지 여부를 제어하기 위해 `hidden()` 또는 `visible()`을 사용하는 경우, `isVisible()`에 대한 `@if` 체크로 액션을 감싸야 합니다:

```blade
<div>
    @if ($this->deleteAction->isVisible())
        {{ $this->deleteAction }}
    @endif
    
    {{-- 또는 --}}
    
    @if (($this->deleteAction)(['post' => $post->id])->isVisible())
        {{ ($this->deleteAction)(['post' => $post->id]) }}
    @endif
</div>
```

`hidden()`과 `visible()` 메서드는 액션이 `disabled()`인지도 제어하므로, 사용자가 권한이 없을 때 액션 실행을 방지하는 데에도 유용합니다. 이 로직을 액션 자체의 `hidden()` 또는 `visible()`에 캡슐화하는 것이 좋은 습관입니다. 그렇지 않으면 뷰와 `disabled()` 모두에 조건을 정의해야 합니다.

또한, 액션이 숨겨질 때 렌더링할 필요가 없는 래핑 요소도 함께 숨길 수 있습니다:

```blade
<div>
    @if ($this->deleteAction->isVisible())
        <div>
            {{ $this->deleteAction }}
        </div>
    @endif
</div>
```

## Livewire 뷰에서 액션 그룹화하기 {#grouping-actions-in-a-livewire-view}

<x-filament-actions::group> Blade 컴포넌트를 사용하여 [액션을 드롭다운 메뉴로 그룹화](grouping-actions)할 수 있으며, `actions` 배열을 속성으로 전달합니다:

```blade
<div>
    <x-filament-actions::group :actions="[
        $this->editAction,
        $this->viewAction,
        $this->deleteAction,
    ]" />

    <x-filament-actions::modals />
</div>
```

트리거 버튼과 드롭다운의 모양을 커스터마이즈하기 위해 속성을 추가로 전달할 수도 있습니다:

```blade
<div>
    <x-filament-actions::group
        :actions="[
            $this->editAction,
            $this->viewAction,
            $this->deleteAction,
        ]"
        label="Actions"
        icon="heroicon-m-ellipsis-vertical"
        color="primary"
        size="md"
        tooltip="More actions"
        dropdown-placement="bottom-start"
    />

    <x-filament-actions::modals />
</div>
```

## 액션 체이닝하기 {#chaining-actions}

여러 액션을 함께 체이닝할 수 있으며, 첫 번째 액션이 끝났을 때 `replaceMountedAction()` 메서드를 호출하여 현재 액션을 다른 액션으로 교체할 수 있습니다:

```php
use App\Models\Post;
use Filament\Actions\Action;

public function editAction(): Action
{
    return Action::make('edit')
        ->form([
            // ...
        ])
        // ...
        ->action(function (array $arguments) {
            $post = Post::find($arguments['post']);

            // ...

            $this->replaceMountedAction('publish', $arguments);
        });
}

public function publishAction(): Action
{
    return Action::make('publish')
        ->requiresConfirmation()
        // ...
        ->action(function (array $arguments) {
            $post = Post::find($arguments['post']);

            $post->publish();
        });
}
```

이제 첫 번째 액션이 제출되면 두 번째 액션이 그 자리에 열립니다. 처음 액션에 전달된 [인자](#passing-action-arguments)는 두 번째 액션에도 전달되므로, 요청 간에 데이터를 유지하는 데 사용할 수 있습니다.

첫 번째 액션이 취소되면 두 번째 액션은 열리지 않습니다. 두 번째 액션이 취소되면 첫 번째 액션은 이미 실행되었으므로 취소할 수 없습니다.

## 프로그래밍 방식으로 액션 트리거하기 {#programmatically-triggering-actions}

때로는 사용자가 내장 트리거 버튼을 클릭하지 않고, 특히 JavaScript에서 액션을 트리거해야 할 수도 있습니다. 다음은 Livewire 컴포넌트에 등록할 수 있는 예시 액션입니다:

```php
use Filament\Actions\Action;

public function testAction(): Action
{
    return Action::make('test')
        ->requiresConfirmation()
        ->action(function (array $arguments) {
            dd('Test action called', $arguments);
        });
}
```

HTML에서 `wire:click` 속성을 사용하여, `mountAction()` 메서드를 호출하고 원하는 인자를 전달하여 해당 액션을 트리거할 수 있습니다:

```blade
<button wire:click="mountAction('test', { id: 12345 })">
    Button
</button>
```

JavaScript에서 해당 액션을 트리거하려면, [`$wire` 유틸리티](/livewire/3.x/alpine#controlling-livewire-from-alpine-using-wire)를 사용하여 동일한 인자를 전달할 수 있습니다:

```js
$wire.mountAction('test', { id: 12345 })
```
