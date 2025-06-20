---
title: Livewire 컴포넌트에 인포리스트 추가하기
---
# [인포리스트] Livewire 컴포넌트에 인포리스트 추가하기
## Livewire 컴포넌트 설정하기 {#setting-up-the-livewire-component}

먼저, 새로운 Livewire 컴포넌트를 생성합니다:

```bash
php artisan make:livewire ViewProduct
```

그런 다음, 페이지에 Livewire 컴포넌트를 렌더링합니다:

```blade
@livewire('view-product')
```

또는, 전체 페이지 Livewire 컴포넌트를 사용할 수도 있습니다:

```php
use App\Livewire\ViewProduct;
use Illuminate\Support\Facades\Route;

Route::get('products/{product}', ViewProduct::class);
```

Livewire 컴포넌트 클래스에서 `InteractsWithInfolists`와 `InteractsWithForms` 트레이트를 사용하고, `HasInfolists`와 `HasForms` 인터페이스를 구현해야 합니다:

```php
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Infolists\Concerns\InteractsWithInfolists;
use Filament\Infolists\Contracts\HasInfolists;
use Livewire\Component;

class ViewProduct extends Component implements HasForms, HasInfolists
{
    use InteractsWithInfolists;
    use InteractsWithForms;

    // ...
}
```

## 인포리스트 추가하기 {#adding-the-infolist}

다음으로, `$infolist` 객체를 받아서 수정한 후 반환하는 메서드를 Livewire 컴포넌트에 추가합니다:

```php
use Filament\Infolists\Infolist;

public function productInfolist(Infolist $infolist): Infolist
{
    return $infolist
        ->record($this->product)
        ->schema([
            // ...
        ]);
}
```

마지막으로, Livewire 컴포넌트의 뷰에서 인포리스트를 렌더링합니다:

```blade
{{ $this->productInfolist }}
```

## 인포리스트에 데이터 전달하기 {#passing-data-to-the-infolist}

인포리스트에 데이터를 전달하는 방법은 두 가지가 있습니다:

첫 번째로, 인포리스트의 `record()` 메서드에 Eloquent 모델 인스턴스를 전달하여, 모델의 모든 속성과 관계를 인포리스트 스키마의 항목에 자동으로 매핑할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;

public function productInfolist(Infolist $infolist): Infolist
{
    return $infolist
        ->record($this->product)
        ->schema([
            TextEntry::make('name'),
            TextEntry::make('category.name'),
            // ...
        ]);
}
```

또는, 인포리스트의 `state()` 메서드에 데이터 배열을 전달하여, 데이터를 인포리스트 스키마의 항목에 수동으로 매핑할 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;

public function productInfolist(Infolist $infolist): Infolist
{
    return $infolist
        ->state([
            'name' => 'MacBook Pro',
            'category' => [
                'name' => 'Laptops',
            ],
            // ...
        ])
        ->schema([
            TextEntry::make('name'),
            TextEntry::make('category.name'),
            // ...
        ]);
}
```
