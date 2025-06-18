---
title: ExportAction
---
# [액션.내장된액션] ExportAction
## 개요 {#overview}

Filament v3.2에서는 행을 CSV 또는 XLSX 파일로 내보낼 수 있는 내장된 액션이 도입되었습니다. 트리거 버튼을 클릭하면, 내보낼 열과 해당 열의 라벨을 지정할 수 있는 모달이 표시됩니다. 이 기능은 [작업 배치(job batches)](https://laravel.com/docs/queues#job-batching)와 [데이터베이스 알림](../../notifications/database-notifications#overview)을 사용하므로, Laravel에서 해당 마이그레이션을 발행해야 합니다. 또한, Filament가 내보내기 정보를 저장하는 데 사용하는 테이블의 마이그레이션도 발행해야 합니다:

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

`ExportAction`을 다음과 같이 사용할 수 있습니다:

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
```

이 액션을 테이블 헤더에 추가하고 싶다면, `Filament\Tables\Actions\ExportAction`을 사용할 수 있습니다:

```php
use App\Filament\Exports\ProductExporter;
use Filament\Tables\Actions\ExportAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->headerActions([
            ExportAction::make()
                ->exporter(ProductExporter::class)
        ]);
}
```

또는 테이블의 일괄 액션으로 추가하여 사용자가 내보낼 행을 선택할 수 있도록 하려면, `Filament\Tables\Actions\ExportBulkAction`을 사용할 수 있습니다:

```php
use App\Filament\Exports\ProductExporter;
use Filament\Tables\Actions\ExportBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->bulkActions([
            ExportBulkAction::make()
                ->exporter(ProductExporter::class)
        ]);
}
```

Filament에 각 행을 어떻게 내보낼지 알려주기 위해 ["exporter" 클래스를 생성](#creating-an-exporter)해야 합니다.

## 내보내기 도구 생성하기 {#creating-an-exporter}

모델에 대한 내보내기 도구 클래스를 생성하려면, `make:filament-exporter` 명령어를 사용하고 모델의 이름을 전달하면 됩니다:

```bash
php artisan make:filament-exporter Product
```

이 명령어는 `app/Filament/Exports` 디렉터리에 새로운 클래스를 생성합니다. 이제 [내보내기 도구 컬럼 정의하기](#defining-exporter-columns)에서 내보낼 수 있는 컬럼을 정의해야 합니다.

### 내보내기 열 자동 생성 {#automatically-generating-exporter-columns}

시간을 절약하고 싶다면, Filament가 `--generate` 옵션을 사용하여 모델의 데이터베이스 컬럼을 기반으로 [열](#defining-exporter-columns)을 자동으로 생성해줄 수 있습니다:

```bash
php artisan make:filament-exporter Product --generate
```

## 내보내기 열 정의하기 {#defining-exporter-columns}

내보낼 수 있는 열을 정의하려면, 내보내기 클래스에서 `getColumns()` 메서드를 오버라이드하여 `ExportColumn` 객체의 배열을 반환해야 합니다:

```php
use Filament\Actions\Exports\ExportColumn;

public static function getColumns(): array
{
    return [
        ExportColumn::make('name'),
        ExportColumn::make('sku')
            ->label('SKU'),
        ExportColumn::make('price'),
    ];
}
```

### 내보내기 열의 레이블 사용자 지정하기 {#customizing-the-label-of-an-export-column}

각 열의 레이블은 이름에서 자동으로 생성되지만, `label()` 메서드를 호출하여 이를 재정의할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('sku')
    ->label('SKU')
```

### 기본 열 선택 구성 {#configuring-the-default-column-selection}

기본적으로, 사용자가 내보낼 열을 선택할 때 모든 열이 선택됩니다. `enabledByDefault()` 메서드를 사용하여 열의 기본 선택 상태를 커스터마이즈할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->enabledByDefault(false)
```

### 열 선택 비활성화 {#disabling-column-selection}

기본적으로 사용자는 내보낼 열을 선택하라는 요청을 받습니다. 이 기능은 `columnMapping(false)`를 사용하여 비활성화할 수 있습니다:

```php
use App\Filament\Exports\ProductExporter;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->columnMapping(false)
```

### 계산된 내보내기 컬럼 상태 {#calculated-export-column-state}

때때로 컬럼의 상태를 데이터베이스 컬럼에서 직접 읽는 대신 계산해야 할 때가 있습니다.

`state()` 메서드에 콜백 함수를 전달하면, 해당 컬럼에 대해 `$record`를 기반으로 반환되는 상태를 커스터마이즈할 수 있습니다:

```php
use App\Models\Order;
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('amount_including_vat')
    ->state(function (Order $record): float {
        return $record->amount * (1 + $record->vat_rate);
    })
```

### 내보내기 열의 값 포맷팅하기 {#formatting-the-value-of-an-export-column}

`formatStateUsing()`에 커스텀 포맷팅 콜백을 전달할 수도 있습니다. 이 콜백은 셀의 `$state`와 선택적으로 Eloquent `$record`를 인자로 받습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('status')
    ->formatStateUsing(fn (string $state): string => __("statuses.{$state}"))
```

열에 [여러 값](#exporting-multiple-values-in-a-cell)이 있는 경우, 이 함수는 각 값마다 호출됩니다.

#### 텍스트 길이 제한하기 {#limiting-text-length}

셀 값의 길이를 `limit()` 메서드로 제한할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->limit(50)
```

#### 단어 수 제한하기 {#limiting-word-count}

셀에 표시되는 `words()`의 개수를 제한할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->words(10)
```

#### 접두사 또는 접미사 추가하기 {#adding-a-prefix-or-suffix}

셀의 값에 `prefix()` 또는 `suffix()`를 추가할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

### 셀에서 여러 값을 내보내기 {#exporting-multiple-values-in-a-cell}

기본적으로, 컬럼에 여러 값이 있을 경우 쉼표로 구분되어 표시됩니다. 값을 JSON 배열로 나열하려면 `listAsJson()` 메서드를 사용할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('tags')
    ->listAsJson()
```

### 관계에서 데이터 표시하기 {#displaying-data-from-relationships}

관계 내의 컬럼에 접근하려면 "닷 표기법(dot notation)"을 사용할 수 있습니다. 관계의 이름이 먼저 오고, 그 뒤에 마침표, 그리고 표시할 컬럼의 이름이 옵니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('author.name')
```

### 관계 수 세기 {#counting-relationships}

컬럼에서 관련 레코드의 개수를 세고 싶다면, `counts()` 메서드를 사용할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('users_count')->counts('users')
```

이 예시에서 `users`는 개수를 셀 관계의 이름입니다. 컬럼의 이름은 반드시 `users_count`여야 하며, 이는 [Laravel에서 사용하는](https://laravel.com/docs/eloquent-relationships#counting-related-models) 결과 저장 규칙입니다.

개수를 세기 전에 관계에 스코프를 적용하고 싶다면, 메서드에 배열을 전달할 수 있습니다. 이때 키는 관계 이름이고 값은 Eloquent 쿼리에 스코프를 적용할 함수입니다:

```php
use Filament\Actions\Exports\ExportColumn;
use Illuminate\Database\Eloquent\Builder;

ExportColumn::make('users_count')->counts([
    'users' => fn (Builder $query) => $query->where('is_active', true),
])
```

### 관계 존재 여부 확인 {#determining-relationship-existence}

단순히 컬럼에서 관련 레코드의 존재 여부만 표시하고 싶다면, `exists()` 메서드를 사용할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('users_exists')->exists('users')
```

이 예시에서 `users`는 존재 여부를 확인할 관계의 이름입니다. 컬럼의 이름은 반드시 `users_exists`이어야 하며, 이는 [Laravel에서 사용하는 규칙](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)입니다.

계산 전에 관계에 스코프를 적용하고 싶다면, 메서드에 배열을 전달할 수 있습니다. 이때 키는 관계의 이름이고 값은 Eloquent 쿼리에 스코프를 적용할 함수입니다:

```php
use Filament\Actions\Exports\ExportColumn;
use Illuminate\Database\Eloquent\Builder;

ExportColumn::make('users_exists')->exists([
    'users' => fn (Builder $query) => $query->where('is_active', true),
])
```

### 관계 집계 {#aggregating-relationships}

Filament는 관계 필드를 집계하기 위한 여러 메서드(`avg()`, `max()`, `min()`, `sum()`)를 제공합니다. 예를 들어, 모든 관련 레코드의 필드 평균을 컬럼에 표시하고 싶다면 `avg()` 메서드를 사용할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('users_avg_age')->avg('users', 'age')
```

이 예시에서 `users`는 관계의 이름이고, `age`는 평균을 구할 필드입니다. 컬럼의 이름은 반드시 `users_avg_age`여야 하며, 이는 [Laravel에서 사용하는 규칙](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)입니다.

집계 전에 관계에 스코프를 적용하고 싶다면, 메서드에 배열을 전달할 수 있습니다. 이때 키는 관계 이름이고 값은 Eloquent 쿼리에 스코프를 적용할 함수입니다:

```php
use Filament\Actions\Exports\ExportColumn;
use Illuminate\Database\Eloquent\Builder;

ExportColumn::make('users_avg_age')->avg([
    'users' => fn (Builder $query) => $query->where('is_active', true),
], 'age')
```

## 내보내기 형식 구성하기 {#configuring-the-export-formats}

기본적으로 내보내기 액션은 사용자가 CSV와 XLSX 형식 중에서 선택할 수 있도록 허용합니다. `ExportFormat` enum을 사용하여 이를 커스터마이즈할 수 있으며, 액션의 `formats()` 메서드에 형식 배열을 전달하면 됩니다:

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\Exports\Enums\ExportFormat;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->formats([
        ExportFormat::Csv,
    ])
    // 또는
    ->formats([
        ExportFormat::Xlsx,
    ])
    // 또는
    ->formats([
        ExportFormat::Xlsx,
        ExportFormat::Csv,
    ])
```

또는, 내보내기 클래스에서 `getFormats()` 메서드를 오버라이드하여 해당 내보내기를 사용하는 모든 액션의 기본 형식을 설정할 수도 있습니다:

```php
use Filament\Actions\Exports\Enums\ExportFormat;

public function getFormats(): array
{
    return [
        ExportFormat::Csv,
    ];
}
```

## 내보내기 쿼리 수정하기 {#modifying-the-export-query}

기본적으로, 테이블에서 `ExportAction`을 사용할 경우, 이 액션은 테이블에서 현재 필터링되고 정렬된 쿼리를 사용하여 데이터를 내보냅니다. 테이블이 없는 경우에는 모델의 기본 쿼리를 사용합니다. 내보내기 전에 쿼리 빌더를 수정하려면, 액션에서 `modifyQueryUsing()` 메서드를 사용할 수 있습니다:

```php
use App\Filament\Exports\ProductExporter;
use Illuminate\Database\Eloquent\Builder;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', true))
```

함수에 `$options` 인자를 주입할 수 있으며, 이는 해당 내보내기를 위한 [옵션](#using-export-options) 배열입니다:

```php
use App\Filament\Exports\ProductExporter;
use Illuminate\Database\Eloquent\Builder;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->modifyQueryUsing(fn (Builder $query, array $options) => $query->where('is_active', $options['isActive'] ?? true))
```

또는, 익스포터 클래스에서 `modifyQuery()` 메서드를 오버라이드하여, 해당 익스포터를 사용하는 모든 액션의 쿼리를 수정할 수도 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;

public static function modifyQuery(Builder $query): Builder
{
    return $query->with([
        'purchasable' => fn (MorphTo $morphTo) => $morphTo->morphWith([
            ProductPurchase::class => ['product'],
            ServicePurchase::class => ['service'],
            Subscription::class => ['plan'],
        ]),
    ]);
}
```

## 내보내기 파일 시스템 구성하기 {#configuring-the-export-filesystem}

### 저장소 디스크 커스터마이징 {#customizing-the-storage-disk}

기본적으로, 내보낸 파일은 [설정 파일](../installation#publishing-configuration)에 정의된 저장소 디스크에 업로드됩니다. 기본값은 `public`입니다. 이 값을 변경하려면 `FILAMENT_FILESYSTEM_DISK` 환경 변수를 설정할 수 있습니다.

`public` 디스크는 Filament의 여러 부분에서 좋은 기본값이지만, 내보내기에 사용할 경우 내보낸 파일이 공개 위치에 저장됩니다. 따라서, 기본 파일 시스템 디스크가 `public`이고 `config/filesystems.php`에 `local` 디스크가 존재한다면, Filament는 내보내기 시 `local` 디스크를 대신 사용합니다. 만약 `ExportAction`이나 익스포터 클래스 내에서 디스크를 `public`으로 오버라이드하면, Filament는 해당 디스크를 사용합니다.

운영 환경에서는 내보낸 파일에 대한 무단 접근을 방지하기 위해, `s3`와 같이 비공개 접근 정책을 가진 디스크를 사용하는 것이 좋습니다.

특정 내보내기에 대해 다른 디스크를 사용하고 싶다면, 액션의 `disk()` 메서드에 디스크 이름을 전달할 수 있습니다:

```php
ExportAction::make()
    ->exporter(ProductExporter::class)
    ->fileDisk('s3')
```

모든 내보내기 액션에 대해 한 번에 디스크를 설정하려면, `AppServiceProvider`와 같은 서비스 프로바이더의 `boot()` 메서드에서 설정할 수 있습니다:

```php
use Filament\Actions\ExportAction;

ExportAction::configureUsing(fn (ExportAction $action) => $action->fileDisk('s3'));
```

또는, 익스포터 클래스에서 `getFileDisk()` 메서드를 오버라이드하여 디스크 이름을 반환할 수도 있습니다:

```php
public function getFileDisk(): string
{
    return 's3';
}
```

생성된 내보내기 파일은 개발자가 필요에 따라 직접 삭제해야 합니다. Filament는 내보낸 파일을 나중에 다시 다운로드할 수 있도록 삭제하지 않습니다.

### 내보내기 파일 이름 구성하기 {#configuring-the-export-file-names}

기본적으로 내보내진 파일은 내보내기의 ID와 유형을 기반으로 생성된 이름을 갖게 됩니다. 또한, 액션에서 `fileName()` 메서드를 사용하여 파일 이름을 직접 지정할 수 있습니다:

```php
use Filament\Actions\Exports\Models\Export;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->fileName(fn (Export $export): string => "products-{$export->getKey()}.csv")
```

또는, 내보내기 클래스에서 `getFileName()` 메서드를 오버라이드하여 문자열을 반환할 수도 있습니다:

```php

use Filament\Actions\Exports\Models\Export;

public function getFileName(Export $export): string
{
    return "products-{$export->getKey()}.csv";
}
```

## 내보내기 옵션 사용하기 {#using-export-options}

내보내기 액션은 사용자가 CSV를 내보낼 때 상호작용할 수 있는 추가 폼 컴포넌트를 렌더링할 수 있습니다. 이는 사용자가 내보내기 동작을 사용자 정의할 수 있도록 할 때 유용합니다. 예를 들어, 사용자가 내보낼 때 특정 컬럼의 포맷을 선택할 수 있도록 하고 싶을 수 있습니다. 이를 위해, 내보내기 클래스의 `getOptionsFormComponents()` 메서드에서 옵션 폼 컴포넌트를 반환할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;

public static function getOptionsFormComponents(): array
{
    return [
        TextInput::make('descriptionLimit')
            ->label('설명 컬럼 내용의 길이 제한')
            ->integer(),
    ];
}
```

또는, 액션의 `options()` 메서드를 통해 내보내기자에 정적인 옵션 세트를 전달할 수도 있습니다:

```php
ExportAction::make()
    ->exporter(ProductExporter::class)
    ->options([
        'descriptionLimit' => 250,
    ])
```

이제, 이러한 옵션의 데이터를 내보내기자 클래스 내에서 사용할 수 있으며, 어떤 클로저 함수에도 `$options` 인자를 주입하여 접근할 수 있습니다. 예를 들어, `formatStateUsing()` 내에서 [컬럼의 값을 포맷](#formatting-the-value-of-an-export-column)할 때 사용할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->formatStateUsing(function (string $state, array $options): string {
        return (string) str($state)->limit($options['descriptionLimit'] ?? 100);
    })
```

또는, `$options` 인자는 모든 클로저 함수에 전달되므로, `limit()` 내에서도 접근할 수 있습니다:

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->limit(fn (array $options): int => $options['descriptionLimit'] ?? 100)
```

## 커스텀 사용자 모델 사용하기 {#using-a-custom-user-model}

기본적으로, `exports` 테이블에는 `user_id` 컬럼이 있습니다. 이 컬럼은 `users` 테이블에 제약이 걸려 있습니다:

```php
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
```

`Export` 모델에서는, `user()` 관계가 `App\Models\User` 모델에 대한 `BelongsTo` 관계로 정의되어 있습니다. 만약 `App\Models\User` 모델이 존재하지 않거나, 다른 모델을 사용하고 싶다면, 서비스 프로바이더의 `register()` 메서드에서 새로운 `Authenticatable` 모델을 컨테이너에 바인딩할 수 있습니다:

```php
use App\Models\Admin;
use Illuminate\Contracts\Auth\Authenticatable;

$this->app->bind(Authenticatable::class, Admin::class);
```

만약 인증 가능한 모델이 `users`가 아닌 다른 테이블을 사용한다면, 해당 테이블 이름을 `constrained()`에 전달해야 합니다:

```php
$table->foreignId('user_id')->constrained('admins')->cascadeOnDelete();
```

### 다형적 사용자 관계 사용하기 {#using-a-polymorphic-user-relationship}

여러 사용자 모델과 내보내기를 연결하고 싶다면, 대신 다형적 `MorphTo` 관계를 사용할 수 있습니다. 이를 위해서는 `exports` 테이블의 `user_id` 컬럼을 다음과 같이 교체해야 합니다:

```php
$table->morphs('user');
```

그런 다음, 서비스 프로바이더의 `boot()` 메서드에서 `Export::polymorphicUserRelationship()`을 호출하여 `Export` 모델의 `user()` 관계를 `MorphTo` 관계로 변경해야 합니다:

```php
use Filament\Actions\Exports\Models\Export;

Export::polymorphicUserRelationship();
```

## 내보낼 수 있는 최대 행 수 제한하기 {#limiting-the-maximum-number-of-rows-that-can-be-exported}

서버 과부하를 방지하기 위해 하나의 CSV 파일에서 내보낼 수 있는 최대 행 수를 제한할 수 있습니다. 이는 액션에서 `maxRows()` 메서드를 호출하여 설정할 수 있습니다:

```php
ExportAction::make()
    ->exporter(ProductExporter::class)
    ->maxRows(100000)
```

## 내보내기 청크 크기 변경하기 {#changing-the-export-chunk-size}

Filament는 CSV를 청크 단위로 나누어 각 청크를 별도의 큐 작업에서 처리합니다. 기본적으로 한 번에 100개의 행이 청크로 처리됩니다. 이 값은 액션에서 `chunkSize()` 메서드를 호출하여 변경할 수 있습니다:

```php
ExportAction::make()
    ->exporter(ProductExporter::class)
    ->chunkSize(250)
```

대용량 CSV 파일을 내보낼 때 메모리 부족이나 타임아웃 문제가 발생한다면, 청크 크기를 줄이는 것이 좋습니다.

## CSV 구분자 변경하기 {#changing-the-csv-delimiter}

CSV의 기본 구분자는 쉼표(`,`)입니다. 다른 구분자를 사용하여 내보내고 싶다면, 내보내기 클래스에서 `getCsvDelimiter()` 메서드를 오버라이드하여 새로운 구분자를 반환하면 됩니다:

```php
public static function getCsvDelimiter(): string
{
    return ';';
}
```

한 글자만 지정할 수 있으며, 그렇지 않으면 예외가 발생합니다.

## XLSX 셀 스타일링 {#styling-xlsx-cells}

XLSX 파일의 셀을 스타일링하고 싶다면, 내보내기 클래스에서 `getXlsxCellStyle()` 메서드를 오버라이드하여 [OpenSpout `Style` 객체](https://github.com/openspout/openspout/blob/4.x/docs/documentation.md#styling)를 반환하면 됩니다:

```php
use OpenSpout\Common\Entity\Style\Style;

public function getXlsxCellStyle(): ?Style
{
    return (new Style())
        ->setFontSize(12)
        ->setFontName('Consolas');
}
```

XLSX 파일의 헤더 셀에만 다른 스타일을 적용하고 싶다면, 내보내기 클래스에서 `getXlsxHeaderCellStyle()` 메서드를 오버라이드하여 [OpenSpout `Style` 객체](https://github.com/openspout/openspout/blob/4.x/docs/documentation.md#styling)를 반환하면 됩니다:

```php
use OpenSpout\Common\Entity\Style\CellAlignment;
use OpenSpout\Common\Entity\Style\CellVerticalAlignment;
use OpenSpout\Common\Entity\Style\Color;
use OpenSpout\Common\Entity\Style\Style;

public function getXlsxHeaderCellStyle(): ?Style
{
    return (new Style())
        ->setFontBold()
        ->setFontItalic()
        ->setFontSize(14)
        ->setFontName('Consolas')
        ->setFontColor(Color::rgb(255, 255, 77))
        ->setBackgroundColor(Color::rgb(0, 0, 0))
        ->setCellAlignment(CellAlignment::CENTER)
        ->setCellVerticalAlignment(CellVerticalAlignment::CENTER);
}
```

## 내보내기 작업 커스터마이징 {#customizing-the-export-job}

내보내기 처리를 위한 기본 작업은 `Filament\Actions\Exports\Jobs\PrepareCsvExport`입니다. 이 클래스를 확장하여 메서드를 오버라이드하고 싶다면, 서비스 프로바이더의 `register()` 메서드에서 원래 클래스를 교체할 수 있습니다:

```php
use App\Jobs\PrepareCsvExport;
use Filament\Actions\Exports\Jobs\PrepareCsvExport as BasePrepareCsvExport;

$this->app->bind(BasePrepareCsvExport::class, PrepareCsvExport::class);
```

또는, 액션의 `job()` 메서드에 새로운 작업 클래스를 전달하여 특정 내보내기에 대해 작업을 커스터마이즈할 수도 있습니다:

```php
use App\Jobs\PrepareCsvExport;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->job(PrepareCsvExport::class)
```

### 내보내기 큐와 연결 커스터마이징하기 {#customizing-the-export-queue-and-connection}

기본적으로 내보내기 시스템은 기본 큐와 연결을 사용합니다. 특정 내보내기 작업에 사용할 큐를 커스터마이즈하고 싶다면, 내보내기 클래스에서 `getJobQueue()` 메서드를 오버라이드하면 됩니다:

```php
public function getJobQueue(): ?string
{
    return 'exports';
}
```

특정 내보내기 작업에 사용할 연결을 커스터마이즈하고 싶다면, 내보내기 클래스에서 `getJobConnection()` 메서드를 오버라이드하면 됩니다:

```php
public function getJobConnection(): ?string
{
    return 'sqs';
}
```

### 내보내기 작업 미들웨어 커스터마이징 {#customizing-the-export-job-middleware}

기본적으로 내보내기 시스템은 각 내보내기에서 한 번에 하나의 작업만 처리합니다. 이는 서버 과부하를 방지하고, 대용량 내보내기로 인해 다른 작업이 지연되는 것을 막기 위함입니다. 이 기능은 내보내기 클래스의 `WithoutOverlapping` 미들웨어에서 정의되어 있습니다:

```php
public function getJobMiddleware(): array
{
    return [
        (new WithoutOverlapping("export{$this->export->getKey()}"))->expireAfter(600),
    ];
}
```

특정 내보내기 작업에 적용되는 미들웨어를 커스터마이즈하고 싶다면, 내보내기 클래스에서 이 메서드를 오버라이드하면 됩니다. 작업 미들웨어에 대한 자세한 내용은 [Laravel 문서](https://laravel.com/docs/queues#job-middleware)에서 확인할 수 있습니다.

### 내보내기 작업 재시도 커스터마이징 {#customizing-the-export-job-retries}

기본적으로 내보내기 시스템은 작업을 24시간 동안 재시도합니다. 이는 데이터베이스 사용 불가와 같은 일시적인 문제가 해결될 수 있도록 하기 위함입니다. 이 기능은 내보내기 클래스의 `getJobRetryUntil()` 메서드에서 정의됩니다:

```php
use Carbon\CarbonInterface;

public function getJobRetryUntil(): ?CarbonInterface
{
    return now()->addDay();
}
```

특정 내보내기(exporter) 작업의 재시도 시간을 커스터마이징하고 싶다면, 해당 내보내기 클래스에서 이 메서드를 오버라이드하면 됩니다. 작업 재시도에 대한 더 자세한 내용은 [Laravel 문서](https://laravel.com/docs/queues#time-based-attempts)에서 확인할 수 있습니다.

### 내보내기 작업 태그 커스터마이징 {#customizing-the-export-job-tags}

기본적으로 내보내기 시스템은 각 작업에 내보내기의 ID로 태그를 지정합니다. 이를 통해 특정 내보내기와 관련된 모든 작업을 쉽게 찾을 수 있습니다. 이 기능은 exporter 클래스의 `getJobTags()` 메서드에 정의되어 있습니다:

```php
public function getJobTags(): array
{
    return ["export{$this->export->getKey()}"];
}
```

특정 exporter의 작업에 적용되는 태그를 커스터마이징하고 싶다면, exporter 클래스에서 이 메서드를 오버라이드하면 됩니다.

### 내보내기 작업 배치 이름 커스터마이징하기 {#customizing-the-export-job-batch-name}

기본적으로 내보내기 시스템은 작업 배치에 이름을 지정하지 않습니다. 특정 내보내기(exporter)의 작업 배치에 적용되는 이름을 커스터마이징하고 싶다면, 내보내기 클래스에서 `getJobBatchName()` 메서드를 오버라이드하면 됩니다:

```php
public function getJobBatchName(): ?string
{
    return 'product-export';
}
```

## 권한 부여 {#authorization}

기본적으로, 내보내기를 시작한 사용자만 생성된 파일을 다운로드할 수 있습니다. 권한 부여 로직을 커스터마이즈하고 싶다면, `ExportPolicy` 클래스를 생성하고 [`AuthServiceProvider`에 등록](https://laravel.com/docs/authorization#registering-policies)할 수 있습니다:

```php
use App\Policies\ExportPolicy;
use Filament\Actions\Exports\Models\Export;

protected $policies = [
    Export::class => ExportPolicy::class,
];
```

정책의 `view()` 메서드는 다운로드 접근 권한을 부여하는 데 사용됩니다.

정책을 정의하면, 내보내기를 시작한 사용자만 접근할 수 있도록 하는 기존 로직이 제거된다는 점에 유의하세요. 이 로직을 유지하고 싶다면 정책에 직접 추가해야 합니다:

```php
use App\Models\User;
use Filament\Actions\Exports\Models\Export;

public function view(User $user, Export $export): bool
{
    return $export->user()->is($user);
}
```
