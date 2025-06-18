---
title: ImportAction
---
# [액션.내장된액션] ImportAction
## 개요 {#overview}

Filament v3.1에서는 CSV에서 행을 가져올 수 있는 내장된 액션이 도입되었습니다. 트리거 버튼을 클릭하면 모달이 나타나 사용자가 파일을 업로드하도록 요청합니다. 파일을 업로드하면, 사용자는 CSV의 각 열을 데이터베이스의 실제 열에 매핑할 수 있습니다. 만약 유효성 검사에 실패한 행이 있다면, 해당 행들은 나머지 행이 모두 가져와진 후 사용자가 검토할 수 있도록 다운로드 가능한 CSV로 컴파일됩니다. 사용자는 또한 가져올 수 있는 모든 열이 포함된 예시 CSV 파일을 다운로드할 수 있습니다.

이 기능은 [job batches](https://laravel.com/docs/queues#job-batching)와 [데이터베이스 알림](../../notifications/database-notifications#overview)을 사용하므로, Laravel에서 해당 마이그레이션을 퍼블리시해야 합니다. 또한, Filament가 가져오기 정보를 저장하는 데 사용하는 테이블의 마이그레이션도 퍼블리시해야 합니다:

```bash
# Laravel 11 이상
php artisan make:queue-batches-table
php artisan make:notifications-table

# Laravel 10
php artisan queue:batches-table
php artisan notifications:table
```

```bash
# 모든 앱에서
php artisan vendor:publish --tag=filament-actions-migrations
php artisan migrate
```

> PostgreSQL을 사용하는 경우, notifications 마이그레이션의 `data` 컬럼이 `json()`을 사용하고 있는지 확인하세요: `$table->json('data')`.

> `User` 모델에 UUID를 사용하는 경우, notifications 마이그레이션의 `notifiable` 컬럼이 `uuidMorphs()`를 사용하고 있는지 확인하세요: `$table->uuidMorphs('notifiable')`.

`ImportAction`은 다음과 같이 사용할 수 있습니다:

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

ImportAction::make()
    ->importer(ProductImporter::class)
```

이 액션을 테이블의 헤더에 추가하고 싶다면, `Filament\Tables\Actions\ImportAction`을 사용할 수 있습니다:

```php
use App\Filament\Imports\ProductImporter;
use Filament\Tables\Actions\ImportAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->headerActions([
            ImportAction::make()
                ->importer(ProductImporter::class)
        ]);
}
```

["importer" 클래스를 생성](#creating-an-importer)하여 Filament에 CSV의 각 행을 어떻게 가져올지 알려주어야 합니다.

동일한 위치에 둘 이상의 `ImportAction`이 있다면, 각 액션에 `make()` 메서드에서 고유한 이름을 부여해야 합니다:

```php
ImportAction::make('importProducts')
    ->importer(ProductImporter::class)

ImportAction::make('importBrands')
    ->importer(BrandImporter::class)
```

## 가져오기 도구 생성하기 {#creating-an-importer}

모델에 대한 가져오기 도구 클래스를 생성하려면, `make:filament-importer` 명령어를 사용하고 모델 이름을 전달하면 됩니다:

```bash
php artisan make:filament-importer Product
```

이 명령어는 `app/Filament/Imports` 디렉터리에 새로운 클래스를 생성합니다. 이제 [가져올 수 있는 컬럼](#defining-importer-columns)을 정의해야 합니다.

### 가져오기 열 자동 생성 {#automatically-generating-importer-columns}

시간을 절약하고 싶다면, Filament가 `--generate` 옵션을 사용하여 모델의 데이터베이스 열을 기반으로 [가져오기 열](#defining-importer-columns)을 자동으로 생성할 수 있습니다.

```bash
php artisan make:filament-importer Product --generate
```

## 가져오기 컬럼 정의하기 {#defining-importer-columns}

가져올 수 있는 컬럼을 정의하려면, 임포터 클래스에서 `getColumns()` 메서드를 오버라이드하여 `ImportColumn` 객체의 배열을 반환해야 합니다:

```php
use Filament\Actions\Imports\ImportColumn;

public static function getColumns(): array
{
    return [
        ImportColumn::make('name')
            ->requiredMapping()
            ->rules(['required', 'max:255']),
        ImportColumn::make('sku')
            ->label('SKU')
            ->requiredMapping()
            ->rules(['required', 'max:32']),
        ImportColumn::make('price')
            ->numeric()
            ->rules(['numeric', 'min:0']),
    ];
}
```

### 가져오기 열의 레이블 사용자 지정 {#customizing-the-label-of-an-import-column}

각 열의 레이블은 이름에서 자동으로 생성되지만, `label()` 메서드를 호출하여 이를 재정의할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->label('SKU')
```

### 가져오기 컬럼이 CSV 컬럼에 매핑되도록 필수로 지정하기 {#requiring-an-importer-column-to-be-mapped-to-a-csv-column}

`requiredMapping()` 메서드를 호출하여 컬럼이 반드시 CSV의 컬럼에 매핑되도록 만들 수 있습니다. 데이터베이스에서 필수로 지정된 컬럼은 매핑도 필수로 지정해야 합니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->requiredMapping()
```

데이터베이스에서 컬럼이 필수라면, [`rules(['required'])` 검증 규칙](#validating-csv-data)도 반드시 추가해야 합니다.

컬럼이 매핑되지 않은 경우, 검증할 데이터가 없으므로 검증이 수행되지 않습니다.

만약 가져오기를 통해 레코드를 새로 생성하는 것뿐만 아니라 [기존 레코드를 업데이트](#updating-existing-records-when-importing)하는 것도 허용하지만, 해당 컬럼이 필수 필드이기 때문에 레코드 생성 시에만 매핑이 필요하다면, `requiredMapping()` 대신 `requiredMappingForNewRecordsOnly()` 메서드를 사용할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->requiredMappingForNewRecordsOnly()
```

`resolveRecord()` 메서드가 아직 데이터베이스에 저장되지 않은 모델 인스턴스를 반환하면, 해당 행에 한해 컬럼 매핑이 필수로 지정됩니다. 사용자가 컬럼을 매핑하지 않고, 가져오기 행 중 하나가 아직 데이터베이스에 존재하지 않는 경우, 해당 행만 실패하게 되며, 모든 행이 분석된 후 실패한 행에 대한 메시지가 실패한 행 CSV에 추가됩니다.

### CSV 데이터 유효성 검사 {#validating-csv-data}

`rules()` 메서드를 호출하여 컬럼에 유효성 검사 규칙을 추가할 수 있습니다. 이 규칙들은 CSV의 각 행의 데이터를 데이터베이스에 저장하기 전에 검사합니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->rules(['required', 'max:32'])
```

유효성 검사를 통과하지 못한 행은 가져오기되지 않습니다. 대신, 이러한 행들은 "실패한 행"의 새로운 CSV로 정리되어, 가져오기가 끝난 후 사용자가 다운로드할 수 있습니다. 사용자는 실패한 각 행에 대한 유효성 검사 오류 목록을 확인할 수 있습니다.

### 상태 캐스팅 {#casting-state}

[검증](#validating-csv-data) 전에, CSV에서 가져온 데이터를 캐스팅할 수 있습니다. 이는 문자열을 올바른 데이터 타입으로 변환하는 데 유용하며, 그렇지 않으면 검증이 실패할 수 있습니다. 예를 들어, CSV에 `price` 컬럼이 있다면, 이를 float 타입으로 캐스팅하고 싶을 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('price')
    ->castStateUsing(function (string $state): ?float {
        if (blank($state)) {
            return null;
        }
        
        $state = preg_replace('/[^0-9.]/', '', $state);
        $state = floatval($state);
    
        return round($state, precision: 2);
    })
```

이 예시에서는 `$state`를 캐스팅하는 데 사용되는 함수를 전달합니다. 이 함수는 문자열에서 숫자가 아닌 모든 문자를 제거하고, float로 변환한 뒤 소수점 둘째 자리까지 반올림합니다.

> 참고: 만약 컬럼이 [검증에서 필수](#validating-csv-data)가 아니고 비어 있다면, 캐스팅되지 않습니다.

Filament는 몇 가지 내장 캐스팅 메서드도 제공합니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('price')
    ->numeric() // 상태를 float로 캐스팅합니다.

ImportColumn::make('price')
    ->numeric(decimalPlaces: 2) // 상태를 float로 캐스팅하고, 소수점 둘째 자리까지 반올림합니다.

ImportColumn::make('quantity')
    ->integer() // 상태를 정수로 캐스팅합니다.

ImportColumn::make('is_visible')
    ->boolean() // 상태를 불리언으로 캐스팅합니다.
```

#### 변환된 상태를 변형하기 {#mutating-the-state-after-it-has-been-cast}

[내장 캐스팅 메서드](#casting-state)나 [배열 캐스트](#handling-multiple-values-in-a-single-column-as-an-array)를 사용하는 경우, `castStateUsing()` 메서드에 함수를 전달하여 변환된 상태를 변형할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('price')
    ->numeric()
    ->castStateUsing(function (float $state): ?float {
        if (blank($state)) {
            return null;
        }
    
        return round($state * 100);
    })
```

함수에 `$originalState` 인자를 정의하면, 변환되기 전의 원래 상태에도 접근할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('price')
    ->numeric()
    ->castStateUsing(function (float $state, mixed $originalState): ?float {
        // ...
    })
```

### 관계 임포트하기 {#importing-relationships}

`relationship()` 메서드를 사용하여 관계를 임포트할 수 있습니다. 현재는 `BelongsTo` 관계만 지원됩니다. 예를 들어, CSV에 `category` 컬럼이 있다면, 해당 카테고리 관계를 임포트할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('author')
    ->relationship()
```

이 예시에서, CSV의 `author` 컬럼은 데이터베이스의 `author_id` 컬럼에 매핑됩니다. CSV에는 보통 `id`와 같은 author의 기본 키가 포함되어야 합니다.

컬럼에 값이 있지만 해당 author를 찾을 수 없는 경우, 임포트는 유효성 검사에서 실패하게 됩니다. Filament는 모든 관계 컬럼에 대해 자동으로 유효성 검사를 추가하여, 필수일 때 관계가 비어 있지 않도록 보장합니다.

#### 관계 가져오기(Import) 해석 커스터마이징 {#customizing-the-relationship-import-resolution}

다른 컬럼을 사용하여 관련 레코드를 찾고 싶다면, `resolveUsing`에 컬럼명을 전달할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('author')
    ->relationship(resolveUsing: 'email')
```

`resolveUsing`에 여러 컬럼을 배열로 전달할 수도 있으며, 이 경우 "or" 방식으로 저자(author)를 찾는 데 사용됩니다. 예를 들어, `['email', 'username']`을 전달하면 이메일이나 사용자명(username) 중 하나로 레코드를 찾을 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('author')
    ->relationship(resolveUsing: ['email', 'username'])
```

또한, `resolveUsing`에 함수를 전달하여 해석 과정을 커스터마이징할 수 있습니다. 이 함수는 관계에 연결할 레코드를 반환해야 합니다:

```php
use App\Models\Author;
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('author')
    ->relationship(resolveUsing: function (string $state): ?Author {
        return Author::query()
            ->where('email', $state)
            ->orWhere('username', $state)
            ->first();
    })
```

이 함수 내에서 동적으로 어떤 컬럼을 사용할지 결정하여 레코드를 해석할 수도 있습니다:

```php
use App\Models\Author;
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('author')
    ->relationship(resolveUsing: function (string $state): ?Author {
        if (filter_var($state, FILTER_VALIDATE_EMAIL)) {
            return 'email';
        }
    
        return 'username';
    })
```

### 하나의 컬럼에서 여러 값을 배열로 처리하기 {#handling-multiple-values-in-a-single-column-as-an-array}

컬럼의 값을 배열로 변환하려면 `array()` 메서드를 사용할 수 있습니다. 이 메서드는 첫 번째 인자로 구분자를 받아, 컬럼의 값을 해당 구분자로 분할하여 배열로 만듭니다. 예를 들어, CSV에 `documentation_urls` 컬럼이 있다면, 이를 URL 배열로 변환하고 싶을 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('documentation_urls')
    ->array(',')
```

이 예시에서는 구분자로 콤마(,)를 전달하였으므로, 컬럼의 값이 콤마로 분할되어 배열로 변환됩니다.

#### 배열의 각 항목 캐스팅하기 {#casting-each-item-in-an-array}

배열의 각 항목을 다른 데이터 타입으로 캐스팅하고 싶다면, [내장 캐스팅 메서드](#casting-state)를 체이닝할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('customer_ratings')
    ->array(',')
    ->integer() // 배열의 각 항목을 정수로 캐스팅합니다.
```

#### 배열의 각 항목 유효성 검사 {#validating-each-item-in-an-array}

배열의 각 항목을 유효성 검사하려면 `nestedRecursiveRules()` 메서드를 체이닝할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('customer_ratings')
    ->array(',')
    ->integer()
    ->rules(['array'])
    ->nestedRecursiveRules(['integer', 'min:1', 'max:5'])
```

### 열 데이터를 민감 정보로 표시하기 {#marking-column-data-as-sensitive}

가져오기 행이 유효성 검사에 실패하면, 해당 행들은 데이터베이스에 기록되어 가져오기가 완료될 때 내보내기를 위해 준비됩니다. 평문으로 민감한 데이터가 저장되는 것을 방지하기 위해, 특정 열을 이 기록에서 제외하고 싶을 수 있습니다. 이를 위해 `ImportColumn`에서 `sensitive()` 메서드를 사용하여 해당 열의 데이터가 기록되지 않도록 할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('ssn')
    ->label('주민등록번호')
    ->sensitive()
    ->rules(['required', 'digits:9'])
```

### 레코드에 컬럼이 채워지는 방식을 커스터마이징하기 {#customizing-how-a-column-is-filled-into-a-record}

컬럼 상태가 레코드에 채워지는 방식을 커스터마이징하고 싶다면, `fillRecordUsing()` 메서드에 함수를 전달할 수 있습니다:

```php
use App\Models\Product;

ImportColumn::make('sku')
    ->fillRecordUsing(function (Product $record, string $state): void {
        $record->sku = strtoupper($state);
    })
```

### 가져오기 열 아래에 도움말 텍스트 추가하기 {#adding-helper-text-below-the-import-column}

때때로, 검증 전에 사용자에게 추가 정보를 제공하고 싶을 수 있습니다. 이럴 때는 열에 `helperText()`를 추가하여 매핑 선택 아래에 표시할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

ImportColumn::make('skus')
    ->array(',')
    ->helperText('쉼표로 구분된 SKU 목록입니다.')
```

## 기존 레코드 업데이트하기 (가져오기 시) {#updating-existing-records-when-importing}

임포터 클래스를 생성할 때, 다음과 같은 `resolveRecord()` 메서드를 볼 수 있습니다:

```php
use App\Models\Product;

public function resolveRecord(): ?Product
{
    // return Product::firstOrNew([
    //     // `$this->data['column_name']`로 기존 레코드를 찾아 업데이트합니다.
    //     'email' => $this->data['email'],
    // ]);

    return new Product();
}
```

이 메서드는 CSV의 각 행마다 호출되며, CSV의 데이터로 채워져 데이터베이스에 저장될 모델 인스턴스를 반환하는 역할을 합니다. 기본적으로는 각 행마다 새로운 레코드를 생성합니다. 하지만 이 동작을 커스터마이즈하여 기존 레코드를 업데이트하도록 변경할 수 있습니다. 예를 들어, 이미 존재하는 상품이 있다면 업데이트하고, 없으면 새로 생성하고 싶을 수 있습니다. 이를 위해 `firstOrNew()` 라인을 주석 해제하고, 일치시킬 컬럼명을 전달하면 됩니다. 상품의 경우 `sku` 컬럼을 기준으로 일치시킬 수 있습니다:

```php
use App\Models\Product;

public function resolveRecord(): ?Product
{
    return Product::firstOrNew([
        'sku' => $this->data['sku'],
    ]);
}
```

### 기존 레코드만 업데이트하며 가져오기 {#updating-existing-records-when-importing-only}

기존 레코드만 업데이트하고, 새 레코드는 생성하지 않는 임포터를 작성하고 싶다면, 레코드를 찾지 못했을 때 `null`을 반환하면 됩니다:

```php
use App\Models\Product;

public function resolveRecord(): ?Product
{
    return Product::query()
        ->where('sku', $this->data['sku'])
        ->first();
}
```

레코드를 찾지 못했을 때 해당 행의 임포트를 실패 처리하고 싶다면, 메시지와 함께 `RowImportFailedException`을 throw할 수 있습니다:

```php
use App\Models\Product;
use Filament\Actions\Imports\Exceptions\RowImportFailedException;

public function resolveRecord(): ?Product
{
    $product = Product::query()
        ->where('sku', $this->data['sku'])
        ->first();

    if (! $product) {
        throw new RowImportFailedException("SKU [{$this->data['sku']}]에 해당하는 상품을 찾을 수 없습니다.");
    }

    return $product;
}
```

임포트가 완료되면, 사용자는 실패한 행이 담긴 CSV 파일을 다운로드할 수 있으며, 이 파일에는 에러 메시지가 포함됩니다.

### 가져오기 열에서 빈 상태 무시하기 {#ignoring-blank-state-for-an-import-column}

기본적으로, CSV의 열이 비어 있고 사용자가 매핑했으며, 유효성 검사에서 필수가 아니라면 해당 열은 데이터베이스에 `null`로 가져와집니다. 빈 상태를 무시하고 데이터베이스의 기존 값을 사용하려면 `ignoreBlankState()` 메서드를 호출할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('price')
    ->ignoreBlankState()
```

## 가져오기 옵션 사용하기 {#using-import-options}

가져오기 액션은 사용자가 CSV를 가져올 때 상호작용할 수 있는 추가 폼 컴포넌트를 렌더링할 수 있습니다. 이는 사용자가 가져오기 동작을 커스터마이즈할 수 있도록 할 때 유용합니다. 예를 들어, 사용자가 가져올 때 기존 레코드를 업데이트할지, 아니면 새로 생성만 할지 선택할 수 있도록 하고 싶을 수 있습니다. 이를 위해, 가져오기 클래스의 `getOptionsFormComponents()` 메서드에서 옵션 폼 컴포넌트를 반환할 수 있습니다:

```php
use Filament\Forms\Components\Checkbox;

public static function getOptionsFormComponents(): array
{
    return [
        Checkbox::make('updateExisting')
            ->label('기존 레코드 업데이트'),
    ];
}
```

또는, 액션의 `options()` 메서드를 통해 가져오기자에 정적인 옵션 세트를 전달할 수도 있습니다:

```php
use Filament\Actions\ImportAction;

ImportAction::make()
    ->importer(ProductImporter::class)
    ->options([
        'updateExisting' => true,
    ])
```

이제, 가져오기 클래스 내부에서 `$this->options`를 호출하여 이러한 옵션의 데이터를 접근할 수 있습니다. 예를 들어, `resolveRecord()` 내부에서 [기존 상품을 업데이트](#updating-existing-records-when-importing)할 때 사용할 수 있습니다:

```php
use App\Models\Product;

public function resolveRecord(): ?Product
{
    if ($this->options['updateExisting'] ?? false) {
        return Product::firstOrNew([
            'sku' => $this->data['sku'],
        ]);
    }

    return new Product();
}
```

## 가져오기 열 매핑 추측 개선하기 {#improving-import-column-mapping-guesses}

기본적으로 Filament는 사용자의 시간을 절약하기 위해 CSV의 어떤 열이 데이터베이스의 어떤 열과 일치하는지 "추측"하려고 시도합니다. Filament는 열 이름의 다양한 조합(공백, `-`, `_` 포함)을 대소문자 구분 없이 찾아서 이를 수행합니다. 하지만 추측을 더 개선하고 싶다면, CSV에 존재할 수 있는 열 이름의 예시를 더 추가하여 `guess()` 메서드를 호출할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->guess(['id', 'number', 'stock-keeping unit'])
```

## 예시 CSV 데이터 제공 {#providing-example-csv-data}

사용자가 CSV를 업로드하기 전에, 가져올 수 있는 모든 컬럼이 포함된 예시 CSV 파일을 다운로드할 수 있는 옵션이 제공됩니다. 이 기능은 사용자가 이 파일을 직접 스프레드시트 소프트웨어에 가져와서 내용을 채울 수 있기 때문에 유용합니다.

또한, 사용자에게 데이터가 어떻게 보여야 하는지 보여주기 위해 예시 행을 CSV에 추가할 수도 있습니다. 이 예시 행을 채우려면, `example()` 메서드에 예시 컬럼 값을 전달하면 됩니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->example('ABC123')
```

또는 예시 행을 두 개 이상 추가하고 싶다면, `examples()` 메서드에 배열을 전달할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->examples(['ABC123', 'DEF456'])
```

기본적으로 컬럼의 이름이 예시 CSV의 헤더로 사용됩니다. `exampleHeader()`를 사용하여 컬럼별로 헤더를 커스터마이즈할 수 있습니다:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('sku')
    ->exampleHeader('SKU')
```

## 커스텀 사용자 모델 사용하기 {#using-a-custom-user-model}

기본적으로, `imports` 테이블에는 `user_id` 컬럼이 있습니다. 이 컬럼은 `users` 테이블에 제약이 걸려 있습니다:

```php
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
```

`Import` 모델에서는, `user()` 관계가 `App\Models\User` 모델에 대한 `BelongsTo` 관계로 정의되어 있습니다. 만약 `App\Models\User` 모델이 존재하지 않거나, 다른 모델을 사용하고 싶다면, 서비스 프로바이더의 `register()` 메서드에서 새로운 `Authenticatable` 모델을 컨테이너에 바인딩할 수 있습니다:

```php
use App\Models\Admin;
use Illuminate\Contracts\Auth\Authenticatable;

$this->app->bind(Authenticatable::class, Admin::class);
```

만약 인증 가능한 모델이 `users`가 아닌 다른 테이블을 사용한다면, `constrained()`에 해당 테이블 이름을 전달해야 합니다:

```php
$table->foreignId('user_id')->constrained('admins')->cascadeOnDelete();
```

### 다형적 사용자 관계 사용하기 {#using-a-polymorphic-user-relationship}

여러 사용자 모델과 가져오기를 연결하고 싶다면, 대신 다형적 `MorphTo` 관계를 사용할 수 있습니다. 이를 위해서는 `imports` 테이블의 `user_id` 컬럼을 다음과 같이 교체해야 합니다:

```php
$table->morphs('user');
```

그런 다음, 서비스 프로바이더의 `boot()` 메서드에서 `Import::polymorphicUserRelationship()`을 호출하여 `Import` 모델의 `user()` 관계를 `MorphTo` 관계로 변경해야 합니다:

```php
use Filament\Actions\Imports\Models\Import;

Import::polymorphicUserRelationship();
```

## 가져올 수 있는 최대 행 수 제한하기 {#limiting-the-maximum-number-of-rows-that-can-be-imported}

서버 과부하를 방지하기 위해 하나의 CSV 파일에서 가져올 수 있는 최대 행 수를 제한할 수 있습니다. 이를 위해 액션에서 `maxRows()` 메서드를 호출하면 됩니다:

```php
ImportAction::make()
    ->importer(ProductImporter::class)
    ->maxRows(100000)
```

## 가져오기 청크 크기 변경 {#changing-the-import-chunk-size}

Filament는 CSV를 청크로 나누고, 각 청크를 별도의 큐 작업에서 처리합니다. 기본적으로 한 번에 100개의 행이 청크로 처리됩니다. 이 값을 변경하려면 액션에서 `chunkSize()` 메서드를 호출하면 됩니다:

```php
ImportAction::make()
    ->importer(ProductImporter::class)
    ->chunkSize(250)
```

대용량 CSV 파일을 가져올 때 메모리 부족이나 타임아웃 문제가 발생한다면, 청크 크기를 줄이는 것이 좋습니다.

## CSV 구분자 변경하기 {#changing-the-csv-delimiter}

CSV의 기본 구분자는 쉼표(`,`)입니다. 만약 가져오기에 다른 구분자를 사용해야 한다면, 액션에서 `csvDelimiter()` 메서드를 호출하여 새로운 구분자를 전달할 수 있습니다:

```php
ImportAction::make()
    ->importer(ProductImporter::class)
    ->csvDelimiter(';')
```

한 번에 한 글자만 지정할 수 있으며, 그렇지 않으면 예외가 발생합니다.

## 열 헤더 오프셋 변경하기 {#changing-the-column-header-offset}

CSV의 열 헤더가 첫 번째 행에 있지 않은 경우, 액션에서 `headerOffset()` 메서드를 호출하여 건너뛸 행의 수를 전달할 수 있습니다:

```php
ImportAction::make()
    ->importer(ProductImporter::class)
    ->headerOffset(5)
```

## 가져오기 작업 커스터마이징 {#customizing-the-import-job}

가져오기를 처리하는 기본 작업은 `Filament\Actions\Imports\Jobs\ImportCsv`입니다. 이 클래스를 확장하여 메서드를 오버라이드하고 싶다면, 서비스 프로바이더의 `register()` 메서드에서 원래 클래스를 교체할 수 있습니다:

```php
use App\Jobs\ImportCsv;
use Filament\Actions\Imports\Jobs\ImportCsv as BaseImportCsv;

$this->app->bind(BaseImportCsv::class, ImportCsv::class);
```

또는, 특정 가져오기에 대해 작업을 커스터마이징하려면 액션의 `job()` 메서드에 새로운 작업 클래스를 전달할 수 있습니다:

```php
use App\Jobs\ImportCsv;

ImportAction::make()
    ->importer(ProductImporter::class)
    ->job(ImportCsv::class)
```

### 가져오기 큐와 연결 커스터마이징하기 {#customizing-the-import-queue-and-connection}

기본적으로 가져오기 시스템은 기본 큐와 연결을 사용합니다. 특정 임포터의 작업에 사용되는 큐를 커스터마이즈하고 싶다면, 임포터 클래스에서 `getJobQueue()` 메서드를 오버라이드하면 됩니다:

```php
public function getJobQueue(): ?string
{
    return 'imports';
}
```

또한, 특정 임포터의 작업에 사용되는 연결을 커스터마이즈하고 싶다면, 임포터 클래스에서 `getJobConnection()` 메서드를 오버라이드하면 됩니다:

```php
public function getJobConnection(): ?string
{
    return 'sqs';
}
```

### 가져오기 작업 미들웨어 커스터마이징 {#customizing-the-import-job-middleware}

기본적으로 가져오기 시스템은 각 가져오기에서 한 번에 하나의 작업만 처리합니다. 이는 서버 과부하를 방지하고, 대용량 가져오기로 인해 다른 작업이 지연되는 것을 막기 위함입니다. 이 기능은 가져오기 클래스의 `WithoutOverlapping` 미들웨어에서 정의되어 있습니다:

```php
public function getJobMiddleware(): array
{
    return [
        (new WithoutOverlapping("import{$this->import->getKey()}"))->expireAfter(600),
    ];
}
```

특정 가져오기 작업에 적용되는 미들웨어를 커스터마이징하고 싶다면, 가져오기 클래스에서 이 메서드를 오버라이드하면 됩니다. 작업 미들웨어에 대한 자세한 내용은 [Laravel 문서](https://laravel.com/docs/queues#job-middleware)에서 확인할 수 있습니다.

### 가져오기 작업 재시도 커스터마이징하기 {#customizing-the-import-job-retries}

기본적으로 가져오기 시스템은 작업을 24시간 동안 재시도합니다. 이는 데이터베이스가 사용 불가능한 등 일시적인 문제가 해결될 수 있도록 하기 위함입니다. 이 기능은 임포터 클래스의 `getJobRetryUntil()` 메서드에서 정의되어 있습니다:

```php
use Carbon\CarbonInterface;

public function getJobRetryUntil(): ?CarbonInterface
{
    return now()->addDay();
}
```

특정 임포터의 작업에 대한 재시도 시간을 커스터마이징하고 싶다면, 임포터 클래스에서 이 메서드를 오버라이드하면 됩니다. 작업 재시도에 대한 더 자세한 내용은 [Laravel 문서](https://laravel.com/docs/queues#time-based-attempts)에서 확인할 수 있습니다.

### 가져오기 작업 태그 커스터마이징하기 {#customizing-the-import-job-tags}

기본적으로, 가져오기 시스템은 각 작업에 가져오기 ID로 태그를 지정합니다. 이를 통해 특정 가져오기와 관련된 모든 작업을 쉽게 찾을 수 있습니다. 이 기능은 가져오기 클래스의 `getJobTags()` 메서드에서 정의되어 있습니다:

```php
public function getJobTags(): array
{
    return ["import{$this->import->getKey()}"];
}
```

특정 가져오기 클래스의 작업에 적용되는 태그를 커스터마이즈하고 싶다면, 해당 가져오기 클래스에서 이 메서드를 오버라이드하면 됩니다.

### 가져오기 작업 배치 이름 사용자 지정 {#customizing-the-import-job-batch-name}

기본적으로 가져오기 시스템은 작업 배치에 이름을 지정하지 않습니다. 특정 가져오기 클래스의 작업 배치에 적용되는 이름을 사용자 지정하려면, 가져오기 클래스에서 `getJobBatchName()` 메서드를 오버라이드하면 됩니다:

```php
public function getJobBatchName(): ?string
{
    return 'product-import';
}
```

## 가져오기 유효성 검사 메시지 커스터마이징 {#customizing-import-validation-messages}

가져오기 시스템은 CSV 파일이 가져와지기 전에 자동으로 유효성 검사를 수행합니다. 오류가 있을 경우, 사용자에게 오류 목록이 표시되며 가져오기가 진행되지 않습니다. 기본 유효성 검사 메시지를 오버라이드하고 싶다면, 가져오기 클래스에서 `getValidationMessages()` 메서드를 오버라이드하면 됩니다:

```php
public function getValidationMessages(): array
{
    return [
        'name.required' => '이름 컬럼은 비워둘 수 없습니다.',
    ];
}
```

유효성 검사 메시지 커스터마이징에 대해 더 알아보려면 [Laravel 문서](https://laravel.com/docs/validation#customizing-the-error-messages)를 참고하세요.

### 가져오기 유효성 검사 속성 커스터마이징 {#customizing-import-validation-attributes}

컬럼이 유효성 검사에 실패하면 해당 라벨이 에러 메시지에 사용됩니다. 필드 에러 메시지에 사용되는 라벨을 커스터마이징하려면 `validationAttribute()` 메서드를 사용하세요:

```php
use Filament\Actions\Imports\ImportColumn;

ImportColumn::make('name')
    ->validationAttribute('full name')
```

## 가져오기 파일 유효성 검사 커스터마이징 {#customizing-import-file-validation}

`fileRules()` 메서드를 사용하여 가져오기 파일에 대한 새로운 [Laravel 유효성 검사 규칙](https://laravel.com/docs/validation#available-validation-rules)을 추가할 수 있습니다:

```php
use Illuminate\Validation\Rules\File;

ImportAction::make()
    ->importer(ProductImporter::class)
    ->fileRules([
        'max:1024',
        // 또는
        File::types(['csv', 'txt'])->max(1024),
    ]),
```

## 라이프사이클 훅 {#lifecycle-hooks}

훅을 사용하면 임포터의 라이프사이클 내 여러 지점(예: 레코드가 저장되기 전)에 코드를 실행할 수 있습니다. 훅을 설정하려면 임포터 클래스에 훅 이름과 동일한 보호 메서드를 생성하세요:

```php
protected function beforeSave(): void
{
    // ...
}
```

이 예시에서 `beforeSave()` 메서드의 코드는 CSV에서 검증된 데이터가 데이터베이스에 저장되기 전에 호출됩니다.

임포터에서 사용할 수 있는 여러 훅이 있습니다:

```php
use Filament\Actions\Imports\Importer;

class ProductImporter extends Importer
{
    // ...

    protected function beforeValidate(): void
    {
        // 한 행의 CSV 데이터가 검증되기 전에 실행됩니다.
    }

    protected function afterValidate(): void
    {
        // 한 행의 CSV 데이터가 검증된 후에 실행됩니다.
    }

    protected function beforeFill(): void
    {
        // 검증된 한 행의 CSV 데이터가 모델 인스턴스에 채워지기 전에 실행됩니다.
    }

    protected function afterFill(): void
    {
        // 검증된 한 행의 CSV 데이터가 모델 인스턴스에 채워진 후에 실행됩니다.
    }

    protected function beforeSave(): void
    {
        // 레코드가 데이터베이스에 저장되기 전에 실행됩니다.
    }

    protected function beforeCreate(): void
    {
        // `beforeSave()`와 유사하지만, 새 레코드를 생성할 때만 실행됩니다.
    }

    protected function beforeUpdate(): void
    {
        // `beforeSave()`와 유사하지만, 기존 레코드를 업데이트할 때만 실행됩니다.
    }

    protected function afterSave(): void
    {
        // 레코드가 데이터베이스에 저장된 후에 실행됩니다.
    }
    
    protected function afterCreate(): void
    {
        // `afterSave()`와 유사하지만, 새 레코드를 생성할 때만 실행됩니다.
    }
    
    protected function afterUpdate(): void
    {
        // `afterSave()`와 유사하지만, 기존 레코드를 업데이트할 때만 실행됩니다.
    }
}
```

이러한 훅 내부에서는 `$this->data`를 사용하여 현재 행의 데이터에 접근할 수 있습니다. 또한, [캐스팅](#casting-state) 또는 매핑되기 전의 원본 CSV 행 데이터는 `$this->originalData`로 접근할 수 있습니다.

현재 레코드(존재하는 경우)는 `$this->record`로, [임포트 폼 옵션](#using-import-options)은 `$this->options`로 접근할 수 있습니다.

## 권한 부여 {#authorization}

기본적으로, 가져오기가 실패할 경우 생성되는 실패 CSV 파일에는 가져오기를 시작한 사용자만 접근할 수 있습니다. 권한 부여 로직을 커스터마이즈하고 싶다면, `ImportPolicy` 클래스를 생성하고 [`AuthServiceProvider`에 등록](https://laravel.com/docs/authorization#registering-policies)할 수 있습니다:

```php
use App\Policies\ImportPolicy;
use Filament\Actions\Imports\Models\Import;

protected $policies = [
    Import::class => ImportPolicy::class,
];
```

정책의 `view()` 메서드는 실패 CSV 파일에 대한 접근 권한을 부여하는 데 사용됩니다.

정책을 정의하면, 가져오기를 시작한 사용자만 실패 CSV 파일에 접근할 수 있도록 하는 기존 로직이 제거된다는 점에 유의하세요. 해당 로직을 유지하고 싶다면 정책에 직접 추가해야 합니다:

```php
use App\Models\User;
use Filament\Actions\Imports\Models\Import;

public function view(User $user, Import $import): bool
{
    return $import->user()->is($user);
}
```
