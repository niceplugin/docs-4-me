---
title: Livewire 컴포넌트에 테이블 추가하기
---
# [테이블] Livewire 컴포넌트에 테이블 추가하기
## Livewire 컴포넌트 설정하기 {#setting-up-the-livewire-component}

먼저, 새로운 Livewire 컴포넌트를 생성합니다:

```bash
php artisan make:livewire ListProducts
```

그런 다음, 페이지에서 Livewire 컴포넌트를 렌더링합니다:

```blade
@livewire('list-products')
```

또는, 전체 페이지 Livewire 컴포넌트를 사용할 수도 있습니다:

```php
use App\Livewire\ListProducts;
use Illuminate\Support\Facades\Route;

Route::get('products', ListProducts::class);
```

## 테이블 추가하기 {#adding-the-table}

Livewire 컴포넌트 클래스에 테이블을 추가할 때는 3가지 작업이 필요합니다:

1) `HasTable` 및 `HasForms` 인터페이스를 구현하고, `InteractsWithTable`과 `InteractsWithForms` 트레이트를 사용합니다.
2) 테이블을 설정하는 `table()` 메서드를 추가합니다. [테이블의 컬럼, 필터, 액션을 추가](getting-started#columns)하세요.
3) 테이블에서 행을 가져올 때 사용할 기본 쿼리를 반드시 정의해야 합니다. 예를 들어, `Product` 모델의 상품 목록을 보여주려면 `Product::query()`를 반환하면 됩니다.

```php
<?php

namespace App\Livewire;

use App\Models\Shop\Product;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class ListProducts extends Component implements HasForms, HasTable
{
    use InteractsWithTable;
    use InteractsWithForms;
    
    public function table(Table $table): Table
    {
        return $table
            ->query(Product::query())
            ->columns([
                TextColumn::make('name'),
            ])
            ->filters([
                // ...
            ])
            ->actions([
                // ...
            ])
            ->bulkActions([
                // ...
            ]);
    }
    
    public function render(): View
    {
        return view('livewire.list-products');
    }
}
```

마지막으로, Livewire 컴포넌트의 뷰에서 테이블을 렌더링하세요:

```blade
<div>
    {{ $this->table }}
</div>
```

브라우저에서 Livewire 컴포넌트에 접속하면 테이블이 표시됩니다.

## Eloquent 관계를 위한 테이블 빌드하기 {#building-a-table-for-an-eloquent-relationship}

Eloquent 관계를 위한 테이블을 만들고 싶다면, `query()`를 전달하는 대신 `$table`에서 `relationship()` 및 `inverseRelationship()` 메서드를 사용할 수 있습니다. `HasMany`, `HasManyThrough`, `BelongsToMany`, `MorphMany`, `MorphToMany` 관계가 호환됩니다:

```php
use App\Models\Category;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

public Category $category;

public function table(Table $table): Table
{
    return $table
        ->relationship(fn (): BelongsToMany => $this->category->products())
        ->inverseRelationship('categories')
        ->columns([
            TextColumn::make('name'),
        ]);
}
```

이 예시에서는 `Category` 모델 인스턴스를 담고 있는 `$category` 속성이 있습니다. 이 카테고리는 `products`라는 관계를 가지고 있습니다. 함수로 관계 인스턴스를 반환합니다. 이 관계는 다대다(many-to-many)이므로, 역관계는 `categories`이고, 이는 `Product` 모델에 정의되어 있습니다. `inverseRelationship()` 메서드에는 이 관계의 이름만 전달하면 되며, 전체 인스턴스를 전달할 필요는 없습니다.

이제 테이블이 일반 Eloquent 쿼리 대신 관계를 사용하므로, 모든 액션이 쿼리가 아닌 관계에 대해 수행됩니다. 예를 들어, [`CreateAction`](../actions/prebuilt-actions/create)을 사용하면, 새 제품이 자동으로 해당 카테고리에 연결됩니다.

관계가 피벗 테이블을 사용하는 경우, 관계 *및* 역관계 정의의 `withPivot()` 메서드에 나열되어 있다면 모든 피벗 컬럼을 일반 컬럼처럼 테이블에서 사용할 수 있습니다.

관계 테이블은 패널 빌더에서 ["relation managers"](../panels/resources/relation-managers#creating-a-relation-manager)로 사용됩니다. relation manager에 문서화된 대부분의 기능은 관계 테이블에서도 사용할 수 있습니다. 예를 들어, [연결 및 연결 해제](../panels/resources/relation-managers#attaching-and-detaching-records), [연관 및 연관 해제](../panels/resources/relation-managers#associating-and-dissociating-records) 액션 등이 있습니다.

## CLI로 테이블 Livewire 컴포넌트 생성하기 {#generating-table-livewire-components-with-the-cli}

Table Builder와 함께 Livewire 컴포넌트를 수동으로 설정하는 방법을 먼저 배우는 것이 좋지만, 익숙해지면 CLI를 사용하여 테이블을 자동으로 생성할 수 있습니다.

```bash
php artisan make:livewire-table Products/ListProducts
```

이 명령은 내장된 모델의 이름을 묻습니다. 예를 들어 `Product`를 입력할 수 있습니다. 마지막으로, 새로운 `app/Livewire/Products/ListProducts.php` 컴포넌트가 생성되며, 이를 자유롭게 커스터마이즈할 수 있습니다.

### 테이블 열 자동 생성 {#automatically-generating-table-columns}

Filament은 모델의 데이터베이스 열을 기반으로 테이블에 필요한 열을 추측할 수 있습니다. 테이블을 생성할 때 `--generate` 플래그를 사용할 수 있습니다:

```bash
php artisan make:livewire-table Products/ListProducts --generate
```
