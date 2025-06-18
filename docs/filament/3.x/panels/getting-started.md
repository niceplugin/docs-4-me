---
title: 시작하기
---
# [패널] 시작하기

## 개요 {#overview}

패널은 Filament에서 최상위 컨테이너로, 페이지, 리소스, 폼, 테이블, 알림, 액션, 인포리스트, 위젯 등 다양한 기능을 갖춘 관리자 패널을 구축할 수 있게 해줍니다. 모든 패널에는 통계, 차트, 테이블 등 다양한 위젯을 포함할 수 있는 기본 대시보드가 제공됩니다.

<LaracastsBanner
    title="Filament 소개"
    description="Laracasts에서 제공하는 'Filament로 빠른 Laravel 개발' 시리즈를 시청해 보세요. 패널 빌더를 시작하는 방법을 배울 수 있습니다. 또는 이 텍스트 기반 가이드를 계속 읽으셔도 됩니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/2"
    series="rapid-laravel-development"
/>

## 사전 준비 사항 {#prerequisites}

Filament을 사용하기 전에 Laravel에 익숙해야 합니다. Filament는 특히 [데이터베이스 마이그레이션](https://laravel.com/docs/migrations)과 [Eloquent ORM](https://laravel.com/docs/eloquent) 등 많은 Laravel의 핵심 개념 위에 구축되어 있습니다. Laravel이 처음이거나 복습이 필요하다면, Laravel 앱 개발의 기본을 다루는 [Laravel 부트캠프](https://bootcamp.laravel.com)를 완료하는 것을 강력히 추천합니다.

## 데모 프로젝트 {#the-demo-project}

이 가이드는 Filament를 사용하여 수의학 진료소를 위한 간단한 환자 관리 시스템을 구축하는 방법을 다룹니다. 이 시스템은 새로운 환자(고양이, 개, 또는 토끼)를 추가하고, 소유자에게 할당하며, 받은 치료 내역을 기록할 수 있습니다. 또한 환자 유형에 대한 통계가 포함된 대시보드와 지난 1년간 시행된 치료 횟수를 보여주는 차트를 제공합니다.

## 데이터베이스 및 모델 설정 {#setting-up-the-database-and-models}

이 프로젝트에는 `Owner`, `Patient`, `Treatment`의 세 가지 모델과 마이그레이션이 필요합니다. 다음 아티즌 명령어를 사용하여 생성하세요:

```bash
php artisan make:model Owner -m
php artisan make:model Patient -m
php artisan make:model Treatment -m
```

### 마이그레이션 정의하기 {#defining-migrations}

다음과 같은 기본 스키마를 데이터베이스 마이그레이션에 사용하세요:

```php

// create_owners_table
Schema::create('owners', function (Blueprint $table) {
    $table->id();
    $table->string('email');
    $table->string('name');
    $table->string('phone');
    $table->timestamps();
});

// create_patients_table
Schema::create('patients', function (Blueprint $table) {
    $table->id();
    $table->date('date_of_birth');
    $table->string('name');
    $table->foreignId('owner_id')->constrained('owners')->cascadeOnDelete();
    $table->string('type');
    $table->timestamps();
});

// create_treatments_table
Schema::create('treatments', function (Blueprint $table) {
    $table->id();
    $table->string('description');
    $table->text('notes')->nullable();
    $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
    $table->unsignedInteger('price')->nullable();
    $table->timestamps();
});
```

`php artisan migrate` 명령어를 사용하여 마이그레이션을 실행하세요.

### 모든 모델의 보호 해제 {#unguarding-all-models}

이 가이드에서는 간결함을 위해 Laravel의 [대량 할당 보호](https://laravel.com/docs/eloquent#mass-assignment)를 비활성화하겠습니다. Filament는 유효한 데이터만 모델에 저장하므로 모델의 보호를 안전하게 해제할 수 있습니다. 모든 Laravel 모델의 보호를 한 번에 해제하려면 `app/Providers/AppServiceProvider.php`의 `boot()` 메서드에 `Model::unguard()`를 추가하세요:

```php
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    Model::unguard();
}
```

### 모델 간 관계 설정하기 {#setting-up-relationships-between-models}

모델 간의 관계를 설정해봅시다. 우리 시스템에서는 반려동물 주인이 여러 마리의 반려동물(환자)을 소유할 수 있고, 환자는 여러 개의 치료를 받을 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Owner extends Model
{
    public function patients(): HasMany
    {
        return $this->hasMany(Patient::class);
    }
}

class Patient extends Model
{
    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }

    public function treatments(): HasMany
    {
        return $this->hasMany(Treatment::class);
    }
}

class Treatment extends Model
{
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
```

## 리소스 소개 {#introducing-resources}

Filament에서 리소스는 Eloquent 모델을 위한 CRUD 인터페이스를 구축하는 데 사용되는 정적 클래스입니다. 이들은 관리자가 테이블과 폼을 사용하여 패널에서 데이터를 어떻게 다룰 수 있는지 설명합니다.

이 시스템에서 환자(반려동물)가 핵심 엔터티이므로, 환자 생성, 조회, 수정, 삭제 페이지를 만들 수 있는 환자 리소스부터 시작해 보겠습니다.

다음 아티즌 명령어를 사용하여 `Patient` 모델에 대한 새로운 Filament 리소스를 생성하세요:

```bash
php artisan make:filament-resource Patient
```

이 명령어는 `app/Filament/Resources` 디렉터리에 여러 파일을 생성합니다:

```
.
+-- PatientResource.php
+-- PatientResource
|   +-- Pages
|   |   +-- CreatePatient.php
|   |   +-- EditPatient.php
|   |   +-- ListPatients.php
```

브라우저에서 `/admin/patients`에 접속하면 네비게이션에 "Patients"라는 새로운 링크가 생긴 것을 볼 수 있습니다. 이 링크를 클릭하면 비어 있는 테이블이 표시됩니다. 이제 새로운 환자를 생성할 수 있는 폼을 추가해 보겠습니다.

### 리소스 폼 설정하기 {#setting-up-the-resource-form}

`PatientResource.php` 파일을 열어보면, 비어 있는 `schema([...])` 배열이 있는 `form()` 메서드가 있습니다. 이 스키마에 폼 필드를 추가하면 새로운 환자를 생성하고 수정할 수 있는 폼이 만들어집니다.

#### "이름" 텍스트 입력 {#name-text-input}

Filament은 다양한 [폼 필드](../forms/fields/getting-started#available-fields)를 기본으로 제공합니다. 간단한 [텍스트 입력 필드](../forms/fields/text-input)부터 시작해봅시다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name'),
        ]);
}
```

`/admin/patients/create`에 방문하거나 "새 환자" 버튼을 클릭하면, 환자 이름을 위한 폼 필드가 추가된 것을 확인할 수 있습니다.

이 필드는 데이터베이스에서 필수이며 최대 길이가 255자이므로, 이름 필드에 두 가지 [유효성 검사 규칙](../forms/validation)을 추가해봅시다:

```php
use Filament\Forms;

Forms\Components\TextInput::make('name')
    ->required()
    ->maxLength(255)
```

이름 없이 새 환자를 생성하려고 폼을 제출하면, 이름 필드는 필수라는 메시지가 표시되는 것을 확인할 수 있습니다.

#### "Type" 선택 {#type-select}

환자의 종류를 선택할 수 있는 두 번째 필드를 추가해봅시다. 고양이, 개, 토끼 중에서 선택할 수 있습니다. 선택지가 정해져 있으므로 [select](../forms/fields/select) 필드가 적합합니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),
            Forms\Components\Select::make('type')
                ->options([
                    'cat' => 'Cat',
                    'dog' => 'Dog',
                    'rabbit' => 'Rabbit',
                ]),
        ]);
}
```

Select 필드의 `options()` 메서드는 사용자가 선택할 수 있는 옵션의 배열을 받습니다. 배열의 키는 데이터베이스 값과 일치해야 하며, 값은 폼에서 보여지는 라벨로 사용됩니다. 원하는 만큼 동물을 이 배열에 추가해도 됩니다.

이 필드도 데이터베이스에서 필수이므로, `required()` 검증 규칙을 추가해봅시다:

```php
use Filament\Forms;

Forms\Components\Select::make('type')
    ->options([
        'cat' => 'Cat',
        'dog' => 'Dog',
        'rabbit' => 'Rabbit',
    ])
    ->required()
```

#### "생년월일" 선택기 {#date-of-birth-picker}

`date_of_birth` 컬럼에 대해 [날짜 선택 필드](../forms/fields/date-time-picker)를 추가하고, (생년월일은 필수이며 오늘 날짜보다 이후일 수 없다는) 유효성 검사를 적용해봅시다.

```php
use Filament\Forms;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),
            Forms\Components\Select::make('type')
                ->options([
                    'cat' => 'Cat',
                    'dog' => 'Dog',
                    'rabbit' => 'Rabbit',
                ])
                ->required(),
            Forms\Components\DatePicker::make('date_of_birth')
                ->required()
                ->maxDate(now()),
        ]);
}
```

#### "소유자" 선택 {#owner-select}

새 환자를 생성할 때 소유자도 추가해야 합니다. Patient 모델에 `BelongsTo` 관계(관련된 `Owner` 모델과의 연관)를 추가했으므로, select 필드의 **[`relationship()` 메서드](../forms/fields/select#integrating-with-an-eloquent-relationship)**를 사용하여 선택할 수 있는 소유자 목록을 불러올 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),
            Forms\Components\Select::make('type')
                ->options([
                    'cat' => 'Cat',
                    'dog' => 'Dog',
                    'rabbit' => 'Rabbit',
                ])
                ->required(),
            Forms\Components\DatePicker::make('date_of_birth')
                ->required()
                ->maxDate(now()),
            Forms\Components\Select::make('owner_id')
                ->relationship('owner', 'name')
                ->required(),
        ]);
}
```

`relationship()` 메서드의 첫 번째 인자는 모델에서 관계를 정의하는 함수의 이름입니다(필라멘트가 select 옵션을 불러올 때 사용) — 이 경우에는 `owner`입니다. 두 번째 인자는 연관된 테이블에서 사용할 컬럼명입니다 — 이 경우에는 `name`입니다.

또한 `owner` 필드를 필수로 만들고, `searchable()`을 적용하며, 검색 가능한 목록에 처음 50명의 소유자를 `preload()` 하도록 해봅시다(목록이 길 경우를 대비):

```php
use Filament\Forms;

Forms\Components\Select::make('owner_id')
    ->relationship('owner', 'name')
    ->searchable()
    ->preload()
    ->required()
```

#### 페이지를 벗어나지 않고 새로운 소유자 생성하기 {#creating-new-owners-without-leaving-the-page}
현재 데이터베이스에 소유자가 없습니다. 별도의 Filament 소유자 리소스를 만드는 대신, 사용자에게 선택 옆에 있는 `+` 버튼을 통해 모달 폼으로 소유자를 쉽게 추가할 수 있는 방법을 제공해봅시다. [`createOptionForm()` 메서드](../forms/fields/select#creating-a-new-option-in-a-modal)를 사용하여 소유자의 이름, 이메일 주소, 전화번호를 위한 [`TextInput` 필드](../forms/fields/text-input)가 포함된 모달 폼을 삽입하세요:

```php
use Filament\Forms;

Forms\Components\Select::make('owner_id')
    ->relationship('owner', 'name')
    ->searchable()
    ->preload()
    ->createOptionForm([
        Forms\Components\TextInput::make('name')
            ->required()
            ->maxLength(255),
        Forms\Components\TextInput::make('email')
            ->label('Email address')
            ->email()
            ->required()
            ->maxLength(255),
        Forms\Components\TextInput::make('phone')
            ->label('Phone number')
            ->tel()
            ->required(),
    ])
    ->required()
```

이 예제에서는 TextInput에 몇 가지 새로운 메서드가 사용되었습니다:

- `label()`은 각 필드의 자동 생성 라벨을 덮어씁니다. 이 경우, `Email` 라벨을 `Email address`로, `Phone` 라벨을 `Phone number`로 지정하고 있습니다.
- `email()`은 해당 필드에 유효한 이메일 주소만 입력할 수 있도록 보장합니다. 또한 모바일 기기에서 키보드 레이아웃도 변경됩니다.
- `tel()`은 해당 필드에 유효한 전화번호만 입력할 수 있도록 보장합니다. 또한 모바일 기기에서 키보드 레이아웃도 변경됩니다.

이제 폼이 정상적으로 동작해야 합니다! 새로운 환자와 그 소유자를 생성해보세요. 생성이 완료되면, 상세 정보를 수정할 수 있는 편집 페이지로 리디렉션됩니다.

### 환자 테이블 설정하기 {#setting-up-the-patients-table}

다시 `/admin/patients` 페이지를 방문하세요. 환자를 생성했다면, 테이블에 편집 버튼이 있는 빈 행이 하나 있을 것입니다. 이제 테이블에 몇 개의 컬럼을 추가하여 실제 환자 데이터를 볼 수 있도록 해봅시다.

`PatientResource.php` 파일을 여세요. `columns([...])` 배열이 비어 있는 `table()` 메서드를 볼 수 있을 것입니다. 이 배열을 사용하여 `patients` 테이블에 컬럼을 추가할 수 있습니다.

#### 텍스트 컬럼 추가하기 {#adding-text-columns}

Filament는 [테이블 컬럼](../tables/columns/getting-started#available-columns)의 다양한 선택지를 제공합니다. `patients` 테이블의 모든 필드에 대해 간단한 [텍스트 컬럼](../tables/columns/text)을 사용해보겠습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name'),
            Tables\Columns\TextColumn::make('type'),
            Tables\Columns\TextColumn::make('date_of_birth'),
            Tables\Columns\TextColumn::make('owner.name'),
        ]);
}
```

> Filament는 관련 데이터를 eager-load하기 위해 dot notation을 사용합니다. 테이블에서 `owner.name`을 사용하여 정보가 적은 ID 번호 대신 소유자의 이름 목록을 표시했습니다. 소유자의 이메일 주소나 전화번호 컬럼도 추가할 수 있습니다.

##### 컬럼을 검색 가능하게 만들기 {#making-columns-searchable}

수의과 병원이 성장함에 따라 테이블에서 환자를 [검색](../tables/columns/getting-started#searching)할 수 있는 기능이 유용할 것입니다. 컬럼에 `searchable()` 메서드를 체이닝하여 컬럼을 검색 가능하게 만들 수 있습니다. 환자 이름과 보호자 이름을 검색 가능하게 만들어봅시다.

```php
use Filament\Tables;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')
                ->searchable(),
            Tables\Columns\TextColumn::make('type'),
            Tables\Columns\TextColumn::make('date_of_birth'),
            Tables\Columns\TextColumn::make('owner.name')
                ->searchable(),
        ]);
}
```

페이지를 새로고침하면 테이블에 새로운 검색 입력 필드가 나타나며, 검색 기준에 따라 테이블 항목을 필터링하는 것을 확인할 수 있습니다.

##### 열을 정렬 가능하게 만들기 {#making-the-columns-sortable}

`patients` 테이블을 나이로 [정렬 가능하게](../tables/columns/getting-started#sorting) 만들려면, `date_of_birth` 열에 `sortable()` 메서드를 추가하세요:

```php
use Filament\Tables;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')
                ->searchable(),
            Tables\Columns\TextColumn::make('type'),
            Tables\Columns\TextColumn::make('date_of_birth')
                ->sortable(),
            Tables\Columns\TextColumn::make('owner.name')
                ->searchable(),
        ]);
}
```

이렇게 하면 열 헤더에 정렬 아이콘 버튼이 추가됩니다. 클릭하면 생년월일 기준으로 테이블이 정렬됩니다.

#### 환자 유형별로 테이블 필터링하기 {#filtering-the-table-by-patient-type}

`type` 필드를 검색 가능하게 만들 수도 있지만, 필터링 가능하게 만드는 것이 훨씬 더 나은 사용자 경험을 제공합니다.

Filament 테이블은 [필터](../tables/filters/getting-started#available-filters)를 가질 수 있습니다. 필터는 Eloquent 쿼리에 스코프를 추가하여 테이블의 레코드 수를 줄여주는 컴포넌트입니다. 필터는 커스텀 폼 컴포넌트도 포함할 수 있어, 인터페이스를 구축하는 데 강력한 도구가 됩니다.

Filament에는 내장된 [`SelectFilter`](../tables/filters/select)가 포함되어 있으며, 이를 테이블의 `filters()`에 추가할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('type')
                ->options([
                    'cat' => 'Cat',
                    'dog' => 'Dog',
                    'rabbit' => 'Rabbit',
                ]),
        ]);
}
```

페이지를 새로고침하면 오른쪽 상단(검색 폼 옆)에 새로운 필터 아이콘이 표시됩니다. 필터를 열면 환자 유형 목록이 있는 선택 메뉴가 나타납니다. 환자 유형별로 필터링을 시도해 보세요.

## 관계 매니저 소개 {#introducing-relation-managers}

현재, 환자는 시스템에서 소유자와 연관될 수 있습니다. 하지만 만약 세 번째 단계가 필요하다면 어떻게 될까요? 환자는 치료를 받기 위해 동물병원에 오고, 시스템은 이러한 치료 내역을 기록하고 환자와 연관시킬 수 있어야 합니다.

한 가지 방법은 새로운 `TreatmentResource`를 생성하고, 치료를 환자와 연관시키기 위한 select 필드를 추가하는 것입니다. 하지만 치료 내역을 환자 정보와 별도로 관리하는 것은 사용자에게 번거로울 수 있습니다. Filament는 이 문제를 "관계 매니저(relation managers)"로 해결합니다.

관계 매니저는 부모 리소스의 수정 화면에서 기존 리소스와 연관된 레코드를 표시하는 테이블입니다. 예를 들어, 우리 프로젝트에서는 환자 수정 폼 바로 아래에서 해당 환자의 치료 내역을 보고 관리할 수 있습니다.

> Filament의 ["액션"](../actions/modals#modal-forms)을 사용하여 환자 테이블에서 직접 치료 내역을 생성, 수정, 삭제할 수 있는 모달 폼을 열 수도 있습니다.

`make:filament-relation-manager` 아티즌 명령어를 사용하여 환자 리소스와 관련 치료 내역을 빠르게 연결하는 관계 매니저를 생성할 수 있습니다:

```bash
php artisan make:filament-relation-manager PatientResource treatments description
```

- `PatientResource`는 소유자 모델의 리소스 클래스 이름입니다. 치료 내역은 환자에 속하므로, 치료 내역은 환자 수정 페이지에 표시되어야 합니다.
- `treatments`는 우리가 앞서 생성한 Patient 모델의 관계 이름입니다.
- `description`은 치료 내역 테이블에서 표시할 컬럼입니다.

이 명령어는 `PatientResource/RelationManagers/TreatmentsRelationManager.php` 파일을 생성합니다. 새로 생성된 관계 매니저를 `PatientResource`의 `getRelations()` 메서드에 등록해야 합니다:

```php
use App\Filament\Resources\PatientResource\RelationManagers;

public static function getRelations(): array
{
    return [
        RelationManagers\TreatmentsRelationManager::class,
    ];
}
```

`TreatmentsRelationManager.php` 파일에는 `make:filament-relation-manager` 아티즌 명령어의 파라미터를 사용하여 미리 작성된 폼과 테이블이 포함된 클래스가 들어 있습니다. 리소스에서 필드와 컬럼을 커스터마이즈하듯이 관계 매니저에서도 필드와 컬럼을 자유롭게 수정할 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Table;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('description')
                ->required()
                ->maxLength(255),
        ]);
}

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('description'),
        ]);
}
```

환자 중 한 명의 수정 페이지로 이동해 보세요. 이제 해당 환자에 대한 치료 내역을 생성, 수정, 삭제, 목록 조회할 수 있습니다.

### 치료 폼 설정하기 {#setting-up-the-treatment-form}

기본적으로 텍스트 필드는 폼의 절반 너비만 차지합니다. `description` 필드는 많은 정보를 담을 수 있으므로, `columnSpan('full')` 메서드를 추가하여 해당 필드가 모달 폼의 전체 너비를 차지하도록 만드세요:

```php
use Filament\Forms;

Forms\Components\TextInput::make('description')
    ->required()
    ->maxLength(255)
    ->columnSpan('full')
```

치료에 대한 추가 정보를 입력할 수 있는 `notes` 필드를 추가해봅시다. [textarea](../forms/fields/textarea) 필드를 사용하고, `columnSpan('full')`을 적용할 수 있습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('description')
                ->required()
                ->maxLength(255)
                ->columnSpan('full'),
            Forms\Components\Textarea::make('notes')
                ->maxLength(65535)
                ->columnSpan('full'),
        ]);
}
```

#### `price` 필드 구성하기 {#configuring-the-price-field}

치료 항목에 대한 `price` 필드를 추가해봅시다. 통화 입력에 적합하도록 몇 가지 커스터마이징이 적용된 텍스트 입력을 사용할 수 있습니다. `numeric()`을 사용하면 유효성 검사가 추가되고 모바일 기기에서 키보드 레이아웃이 변경됩니다. `prefix()` 메서드를 사용하여 원하는 통화 기호를 입력란 앞에 추가할 수 있습니다. 예를 들어, `prefix('€')`를 사용하면 입력란 앞에 `€`가 표시되지만 저장되는 값에는 영향을 주지 않습니다:

```php
use Filament\Forms;
use Filament\Forms\Form;

public function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('description')
                ->required()
                ->maxLength(255)
                ->columnSpan('full'),
            Forms\Components\Textarea::make('notes')
                ->maxLength(65535)
                ->columnSpan('full'),
            Forms\Components\TextInput::make('price')
                ->numeric()
                ->prefix('€')
                ->maxValue(42949672.95),
        ]);
}
```

##### 가격을 정수로 캐스팅하기 {#casting-the-price-to-an-integer}

Filament는 통화 값을 정수(실수가 아님)로 저장하여 반올림 및 정밀도 문제를 방지합니다. 이는 Laravel 커뮤니티에서 널리 받아들여진 방식입니다. 하지만, 이를 위해서는 데이터베이스에서 값을 가져올 때 정수를 실수로 변환하고, 저장할 때 다시 정수로 변환하는 Laravel의 캐스트를 생성해야 합니다. 다음 artisan 명령어를 사용하여 캐스트를 생성하세요:

```bash
php artisan make:cast MoneyCast
```

새로 생성된 `app/Casts/MoneyCast.php` 파일에서 `get()` 및 `set()` 메서드를 다음과 같이 수정하세요:

```php
public function get($model, string $key, $value, array $attributes): float
{
    // 데이터베이스에 저장된 정수를 실수로 변환합니다.
    return round(floatval($value) / 100, precision: 2);
}

public function set($model, string $key, $value, array $attributes): float
{
    // 저장을 위해 실수를 정수로 변환합니다.
    return round(floatval($value) * 100);
}
```

이제 `Treatment` 모델의 `price` 속성에 `MoneyCast`를 추가하세요:

```php
use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    protected $casts = [
        'price' => MoneyCast::class,
    ];

    // ...
}
```

### 치료(treatments) 테이블 설정하기 {#setting-up-the-treatments-table}

이전에 관계 매니저를 생성할 때, `description` 텍스트 컬럼이 자동으로 추가되었습니다. 이제 `price`에 대해 통화 접두사가 있는 `sortable()` 컬럼도 추가해봅시다. Filament의 `money()` 메서드를 사용하여 `price` 컬럼을 통화 형식(이 경우 `EUR`(`€`))으로 표시할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('description'),
            Tables\Columns\TextColumn::make('price')
                ->money('EUR')
                ->sortable(),
        ]);
}
```

또한 치료가 언제 시행되었는지 표시하기 위해 기본 `created_at` 타임스탬프를 사용하는 컬럼도 추가해봅시다. `dateTime()` 메서드를 사용하여 날짜와 시간을 사람이 읽기 쉬운 형식으로 표시할 수 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('description'),
            Tables\Columns\TextColumn::make('price')
                ->money('EUR')
                ->sortable(),
            Tables\Columns\TextColumn::make('created_at')
                ->dateTime(),
        ]);
}
```

> `dateTime()` 메서드에는 [PHP 날짜 포맷 문자열](https://www.php.net/manual/en/datetime.format.php)을 전달할 수 있습니다(예: `dateTime('m-d-Y h:i A')`).

## 위젯 소개 {#introducing-widgets}

Filament 위젯은 대시보드에 정보를 표시하는 컴포넌트로, 특히 통계 정보를 보여줍니다. 위젯은 일반적으로 패널의 기본 [대시보드](../panels/dashboard)에 추가되지만, 리소스 페이지를 포함한 모든 페이지에 추가할 수 있습니다. Filament에는 중요한 통계를 간단하게 보여주는 [통계 위젯](../widgets/stats-overview), 대화형 차트를 렌더링할 수 있는 [차트 위젯](../widgets/charts), Table Builder를 쉽게 삽입할 수 있는 [테이블 위젯](../panels/dashboard#table-widgets)과 같은 내장 위젯이 포함되어 있습니다.

이제 각 환자 유형별 통계와 시간에 따른 치료 시각화를 위한 차트를 포함하는 통계 위젯을 기본 대시보드 페이지에 추가해 보겠습니다.

### 통계 위젯 생성하기 {#creating-a-stats-widget}

다음 artisan 명령어를 사용하여 [통계 위젯](../widgets/stats-overview)을 생성해 환자 유형을 렌더링합니다:

```bash
php artisan make:filament-widget PatientTypeOverview --stats-overview
```

프롬프트가 나타나면 리소스를 지정하지 말고, 위치는 "admin"을 선택하세요.

이 명령어는 새로운 `app/Filament/Widgets/PatientTypeOverview.php` 파일을 생성합니다. 이 파일을 열고, `getStats()` 메서드에서 `Stat` 인스턴스를 반환하도록 합니다:

```php
<?php

namespace App\Filament\Widgets;

use App\Models\Patient;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PatientTypeOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Cats', Patient::query()->where('type', 'cat')->count()),
            Stat::make('Dogs', Patient::query()->where('type', 'dog')->count()),
            Stat::make('Rabbits', Patient::query()->where('type', 'rabbit')->count()),
        ];
    }
}
```

대시보드를 열면 새로 만든 위젯이 표시되는 것을 볼 수 있습니다. 각 통계는 지정된 유형의 환자 총 수를 보여줍니다.

### 차트 위젯 생성하기 {#creating-a-chart-widget}

대시보드에 차트를 추가하여 시간에 따른 시술 횟수를 시각화해봅시다. 다음 아티즌 명령어를 사용해 새로운 차트 위젯을 생성하세요:

```bash
php artisan make:filament-widget TreatmentsChart --chart
```

프롬프트가 나타나면 리소스는 지정하지 말고, 위치는 "admin"을 선택하고, 차트 유형은 "line chart"를 선택하세요.

`app/Filament/Widgets/TreatmentsChart.php` 파일을 열고, 차트의 `$heading`을 "Treatments"로 설정하세요.

`getData()` 메서드는 데이터셋과 라벨의 배열을 반환합니다. 각 데이터셋은 차트에 표시할 점들의 라벨이 지정된 배열이고, 각 라벨은 문자열입니다. 이 구조는 Filament가 차트를 렌더링할 때 사용하는 [Chart.js](https://www.chartjs.org/docs) 라이브러리와 동일합니다.

Eloquent 모델에서 차트 데이터를 가져오려면, Filament에서는 [flowframe/laravel-trend](https://github.com/Flowframe/laravel-trend) 패키지 설치를 권장합니다:

```bash
composer require flowframe/laravel-trend
```

`getData()`를 업데이트하여 지난 1년간 월별 시술 횟수를 표시하세요:

```php
use App\Models\Treatment;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

protected function getData(): array
{
    $data = Trend::model(Treatment::class)
        ->between(
            start: now()->subYear(),
            end: now(),
        )
        ->perMonth()
        ->count();

    return [
        'datasets' => [
            [
                'label' => 'Treatments',
                'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
            ],
        ],
        'labels' => $data->map(fn (TrendValue $value) => $value->date),
    ];
}
```

이제 대시보드에서 새 차트 위젯을 확인해보세요!

> [대시보드 페이지를 커스터마이즈](../panels/dashboard#customizing-the-dashboard-page)하여 그리드와 표시되는 위젯 개수를 변경할 수 있습니다.

## 패널 빌더로 다음 단계 진행하기 {#next-steps-with-the-panel-builder}

축하합니다! 이제 기본적인 Filament 애플리케이션을 만드는 방법을 알게 되었으니, 추가 학습을 위한 몇 가지 제안을 드립니다:

- [리소스에 속하지 않는 패널 내의 커스텀 페이지를 만들어보세요.](pages)
- [모달을 통해 사용자 입력을 받거나 확인을 위한 액션 버튼을 페이지와 리소스에 추가하는 방법을 더 알아보세요.](../actions/overview)
- [사용자로부터 입력을 받을 수 있는 다양한 필드를 살펴보세요.](../forms/fields/getting-started#available-fields)
- [폼 레이아웃 컴포넌트 목록을 확인해보세요.](../forms/layout/getting-started)
- [CSS를 직접 다루지 않고도 복잡하고 반응형인 테이블 레이아웃을 만드는 방법을 알아보세요.](../tables/layout)
- [테이블에 요약 정보를 추가해보세요.](../tables/summaries)
- [도우미 메서드 모음을 활용해 패널에 대한 자동화 테스트를 작성해보세요.](testing)
