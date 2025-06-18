---
title: Livewire 컴포넌트에 폼 추가하기
---
# [폼] Livewire 컴포넌트에 폼 추가하기
## Livewire 컴포넌트 설정하기 {#setting-up-the-livewire-component}

먼저, 새로운 Livewire 컴포넌트를 생성합니다:

```bash
php artisan make:livewire CreatePost
```

그런 다음, 페이지에서 Livewire 컴포넌트를 렌더링합니다:

```blade
@livewire('create-post')
```

또는, 전체 페이지 Livewire 컴포넌트를 사용할 수도 있습니다:

```php
use App\Livewire\CreatePost;
use Illuminate\Support\Facades\Route;

Route::get('posts/create', CreatePost::class);
```

## 폼 추가하기 {#adding-the-form}

Livewire 컴포넌트 클래스에 폼을 추가할 때는 5가지 주요 작업이 필요합니다. 각각은 필수적입니다:

1) `HasForms` 인터페이스를 구현하고, `InteractsWithForms` 트레이트를 사용합니다.
2) 폼의 데이터를 저장할 public Livewire 프로퍼티를 정의합니다. 예제에서는 `$data`라고 부르지만, 원하는 이름을 사용할 수 있습니다.
3) `form()` 메서드를 추가합니다. 이곳에서 폼을 구성합니다. [폼의 스키마를 추가](getting-started#form-schemas)하고, Filament에 폼 데이터를 `$data` 프로퍼티에 저장하도록 지정합니다(`statePath('data')` 사용).
4) `mount()`에서 `$this->form->fill()`로 폼을 초기화합니다. 초기 데이터가 없어도, 모든 폼에서 반드시 필요합니다.
5) 폼 제출을 처리할 메서드를 정의합니다. 예제에서는 `create()`라고 부르지만, 원하는 이름을 사용할 수 있습니다. 이 메서드 안에서 `$this->form->getState()`를 사용해 폼 데이터를 검증하고 가져올 수 있습니다. 폼의 데이터는 반드시 이 메서드를 통해 가져와야 하며, `$this->data` 프로퍼티에 직접 접근해서는 안 됩니다. 폼 데이터는 반환되기 전에 검증 및 변환이 필요하기 때문입니다.

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class CreatePost extends Component implements HasForms
{
    use InteractsWithForms;
    
    public ?array $data = [];
    
    public function mount(): void
    {
        $this->form->fill();
    }
    
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->required(),
                MarkdownEditor::make('content'),
                // ...
            ])
            ->statePath('data');
    }
    
    public function create(): void
    {
        dd($this->form->getState());
    }
    
    public function render(): View
    {
        return view('livewire.create-post');
    }
}
```

마지막으로, Livewire 컴포넌트의 뷰에서 폼을 렌더링합니다:

```blade
<div>
    <form wire:submit="create">
        {{ $this->form }}
        
        <button type="submit">
            Submit
        </button>
    </form>
    
    <x-filament-actions::modals />
</div>
```

> `<x-filament-actions::modals />`는 폼 컴포넌트의 [액션 모달](actions)을 렌더링하는 데 사용됩니다. 이 코드는 `<form>` 요소 바깥, Livewire 컴포넌트 내부라면 어디에나 둘 수 있습니다.

브라우저에서 Livewire 컴포넌트를 방문하면, `schema()`에서 정의한 폼 컴포넌트가 보일 것입니다.

폼에 데이터를 입력해 제출하면, 폼의 데이터가 화면에 덤프됩니다. 데이터를 덤프하는 대신 모델에 저장할 수도 있습니다:

```php
use App\Models\Post;

public function create(): void
{
    Post::create($this->form->getState());
}
```

## 데이터로 폼 초기화하기 {#initializing-the-form-with-data}

폼에 데이터를 채우려면, 해당 데이터를 `$this->form->fill()` 메서드에 전달하면 됩니다. 예를 들어, 기존 게시글을 수정할 때는 다음과 같이 할 수 있습니다:

```php
use App\Models\Post;

public function mount(Post $post): void
{
    $this->form->fill($post->attributesToArray());
}
```

데이터를 직접 `$this->data` 속성에 할당하는 대신 반드시 `$this->form->fill()` 메서드를 사용해야 합니다. 이는 게시글의 데이터가 저장되기 전에 내부적으로 유용한 형식으로 변환되어야 하기 때문입니다.

## 폼 모델 설정하기 {#setting-a-form-model}

`$form`에 모델을 연결하는 것은 여러 가지 이유로 유용합니다:

- 해당 폼 내의 필드들이 그 모델로부터 정보를 불러올 수 있습니다. 예를 들어, select 필드는 [데이터베이스에서 옵션을 자동으로 불러올 수 있습니다](fields/select#integrating-with-an-eloquent-relationship).
- 폼은 모델의 관계 데이터를 자동으로 불러오고 저장할 수 있습니다. 예를 들어, Edit Post 폼에 [Repeater](fields/repeater#integrating-with-an-eloquent-relationship)가 있고, 이 Repeater가 해당 게시글과 연결된 댓글을 관리한다고 가정해봅시다. Filament는 `$this->form->fill([...])`을 호출할 때 해당 게시글의 댓글을 자동으로 불러오고, `$this->form->getState()`를 호출할 때 다시 관계에 저장합니다.
- `exists()`와 `unique()`와 같은 유효성 검사 규칙이 모델로부터 데이터베이스 테이블 이름을 자동으로 가져올 수 있습니다.

모델이 있다면 항상 폼에 모델을 전달하는 것이 좋습니다. 앞서 설명한 것처럼, 이는 Filament Form Builder의 많은 새로운 기능을 사용할 수 있게 해줍니다.

모델을 폼에 전달하려면 `$form->model()` 메서드를 사용하세요:

```php
use App\Models\Post;
use Filament\Forms\Form;

public Post $post;

public function form(Form $form): Form
{
    return $form
        ->schema([
            // ...
        ])
        ->statePath('data')
        ->model($this->post);
}
```

### 폼이 제출된 후 폼 모델 전달하기 {#passing-the-form-model-after-the-form-has-been-submitted}

일부 경우에는 폼의 모델이 폼이 제출될 때까지 존재하지 않을 수 있습니다. 예를 들어, 게시글 생성(Create Post) 폼에서는 폼이 제출되기 전까지 게시글이 존재하지 않습니다. 따라서 `$form->model()`에 모델 인스턴스를 전달할 수 없습니다. 하지만, 대신 모델 클래스를 전달할 수 있습니다:

```php
use App\Models\Post;
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            // ...
        ])
        ->statePath('data')
        ->model(Post::class);
}
```

이 방법만으로는 모델 인스턴스를 전달하는 것만큼 강력하지는 않습니다. 예를 들어, 관계(relation)는 게시글이 생성된 후에 저장되지 않습니다. 이를 위해서는 게시글이 생성된 후에 폼에 게시글을 전달하고, `saveRelationships()`를 호출하여 관계를 저장해야 합니다:

```php
use App\Models\Post;

public function create(): void
{
    $post = Post::create($this->form->getState());
    
    // 게시글이 생성된 후 폼의 관계를 게시글에 저장합니다.
    $this->form->model($post)->saveRelationships();
}
```

## 개별 속성에 폼 데이터 저장하기 {#saving-form-data-to-individual-properties}

이전의 모든 예제에서는 폼의 데이터를 Livewire 컴포넌트의 public `$data` 속성에 저장했습니다. 하지만, 데이터를 개별 속성에 저장할 수도 있습니다. 예를 들어, `title` 필드가 있는 폼이 있다면 폼의 데이터를 `$title` 속성에 저장할 수 있습니다. 이를 위해서는 폼에 `statePath()`를 아예 전달하지 않으면 됩니다. 모든 필드가 클래스에 **public** 속성을 가지고 있는지 확인하세요.

```php
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Form;

public ?string $title = null;

public ?string $content = null;

public function form(Form $form): Form
{
    return $form
        ->schema([
            TextInput::make('title')
                ->required(),
            MarkdownEditor::make('content'),
            // ...
        ]);
}
```

## 여러 개의 폼 사용하기 {#using-multiple-forms}

기본적으로 `InteractsWithForms` 트레이트는 Livewire 컴포넌트당 하나의 폼(`form()`)만을 처리합니다. Livewire 컴포넌트에 여러 개의 폼을 추가하려면, `getForms()` 메서드에서 폼의 이름을 배열로 반환하여 정의할 수 있습니다:

```php
protected function getForms(): array
{
    return [
        'editPostForm',
        'createCommentForm',
    ];
}
```

이제 각각의 폼은 Livewire 컴포넌트 내에서 동일한 이름의 메서드로 정의할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Form;

public function editPostForm(Form $form): Form
{
    return $form
        ->schema([
            TextInput::make('title')
                ->required(),
            MarkdownEditor::make('content'),
            // ...
        ])
        ->statePath('postData')
        ->model($this->post);
}

public function createCommentForm(Form $form): Form
{
    return $form
        ->schema([
            TextInput::make('name')
                ->required(),
            TextInput::make('email')
                ->email()
                ->required(),
            MarkdownEditor::make('content')
                ->required(),
            // ...
        ])
        ->statePath('commentData')
        ->model(Comment::class);
}
```

이제 각 폼은 `form` 대신 자신의 이름으로 접근할 수 있습니다. 예를 들어, 게시글 폼을 채우려면 `$this->editPostForm->fill([...])`을 사용할 수 있고, 댓글 폼의 데이터를 가져오려면 `$this->createCommentForm->getState()`를 사용할 수 있습니다.

각 폼마다 고유한 `statePath()`가 있는 것을 알 수 있습니다. 각 폼은 Livewire 컴포넌트의 서로 다른 배열에 상태를 저장하므로, 이를 다음과 같이 정의하는 것이 중요합니다:

```php
public ?array $postData = [];
public ?array $commentData = [];
```

## 폼 데이터 초기화 {#resetting-a-forms-data}

언제든지 `$this->form->fill()`을 호출하여 폼을 기본 데이터로 초기화할 수 있습니다. 예를 들어, 폼이 제출될 때마다 내용을 지우고 싶을 수 있습니다:

```php
use App\Models\Comment;

public function createComment(): void
{
    Comment::create($this->form->getState());

    // 폼 데이터를 초기화하여 내용을 지웁니다.
    $this->form->fill();
}
```

## CLI로 폼 Livewire 컴포넌트 생성하기 {#generating-form-livewire-components-with-the-cli}

Form Builder와 함께 Livewire 컴포넌트를 수동으로 설정하는 방법을 먼저 배우는 것이 좋지만, 익숙해진 후에는 CLI를 사용하여 폼을 자동으로 생성할 수 있습니다.

```bash
php artisan make:livewire-form RegistrationForm
```

이 명령은 새로운 `app/Livewire/RegistrationForm.php` 컴포넌트를 생성하며, 이를 자유롭게 커스터마이즈할 수 있습니다.

### Eloquent 모델용 폼 생성하기 {#generating-a-form-for-an-eloquent-model}

Filament은 특정 Eloquent 모델을 위한 폼도 생성할 수 있습니다. 이러한 폼은 더 강력하며, 폼의 데이터를 자동으로 저장해주고, [폼 필드가 해당 모델에 올바르게 접근할 수 있도록](#setting-a-form-model) 자동으로 설정해줍니다.

`make:livewire-form` 명령어로 폼을 생성할 때, 모델의 이름을 입력하라는 메시지가 표시됩니다:

```bash
php artisan make:livewire-form Products/CreateProduct
```

#### Eloquent 레코드에 대한 수정 폼 생성하기 {#generating-an-edit-form-for-an-eloquent-record}

기본적으로 `make:livewire-form` 명령어에 모델을 전달하면 데이터베이스에 새 레코드를 생성하는 폼이 만들어집니다. 명령어에 `--edit` 플래그를 추가로 전달하면, 특정 레코드에 대한 수정 폼이 생성됩니다. 이 폼은 해당 레코드의 데이터로 자동으로 채워지며, 폼이 제출되면 데이터가 모델에 다시 저장됩니다.

```bash
php artisan make:livewire-form Products/EditProduct --edit
```

### 폼 스키마 자동 생성 {#automatically-generating-form-schemas}

Filament은 모델의 데이터베이스 컬럼을 기반으로, 스키마에 어떤 폼 필드가 필요한지 추측할 수 있습니다. 폼을 생성할 때 `--generate` 플래그를 사용할 수 있습니다:

```bash
php artisan make:livewire-form Products/CreateProduct --generate
```
