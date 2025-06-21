---
title: 고급 인포리스트
---
# [인포리스트] 고급 인포리스트
## 인포리스트에 Livewire 컴포넌트 삽입하기 {#inserting-livewire-components-into-an-infolist}

인포리스트에 Livewire 컴포넌트를 직접 삽입할 수 있습니다:

```php
use Filament\Infolists\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class)
```

동일한 Livewire 컴포넌트를 여러 개 렌더링하는 경우, 각 컴포넌트에 고유한 `key()`를 전달해야 합니다:

```php
use Filament\Infolists\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class)
    ->key('foo-first')

Livewire::make(Foo::class)
    ->key('foo-second')

Livewire::make(Foo::class)
    ->key('foo-third')
```

### Livewire 컴포넌트에 파라미터 전달하기 {#passing-parameters-to-a-livewire-component}

Livewire 컴포넌트에 파라미터 배열을 전달할 수 있습니다:

```php
use Filament\Infolists\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class, ['bar' => 'baz'])
```

이제 해당 파라미터들은 Livewire 컴포넌트의 `mount()` 메서드에 전달됩니다:

```php
class Foo extends Component
{
    public function mount(string $bar): void
    {       
        // ...
    }
}
```

또는, public 속성으로 Livewire 컴포넌트에서 사용할 수 있습니다:

```php
class Foo extends Component
{
    public string $bar;
}
```

#### Livewire 컴포넌트에서 현재 레코드 접근하기 {#accessing-the-current-record-in-the-livewire-component}

Livewire 컴포넌트에서 `mount()` 메서드의 `$record` 파라미터나 `$record` 속성을 사용하여 현재 레코드에 접근할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;

class Foo extends Component
{
    public function mount(Model $record): void
    {       
        // ...
    }
    
    // 또는
    
    public Model $record;
}
```

### Livewire 컴포넌트 지연 로딩하기 {#lazy-loading-a-livewire-component}

`lazy()` 메서드를 사용하여 [지연 로딩](/livewire/3.x/lazy#rendering-placeholder-html)을 허용할 수 있습니다:

```php
use Filament\Infolists\Components\Livewire;
use App\Livewire\Foo;

Livewire::make(Foo::class)->lazy()       
```
