---
title: 고급 컬럼
---
# [테이블.컬럼] 고급 컬럼
## 테이블 컬럼 유틸리티 주입 {#table-column-utility-injection}

대부분의 컬럼 설정 메서드는 하드코딩된 값 대신 함수형 파라미터를 허용합니다:

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'gray',
        'reviewing' => 'warning',
        'published' => 'success',
        'rejected' => 'danger',
    })
```

이것만으로도 다양한 커스터마이징이 가능합니다.

이 패키지는 또한 이러한 함수 내부에서 사용할 수 있는 다양한 유틸리티를 파라미터로 주입할 수 있습니다. 함수형 인자를 받는 모든 커스터마이징 메서드는 유틸리티 주입이 가능합니다.

이렇게 주입되는 유틸리티는 특정 파라미터 이름을 사용해야 합니다. 그렇지 않으면 Filament가 무엇을 주입해야 하는지 알 수 없습니다.

### 컬럼의 현재 상태 주입하기 {#injecting-the-current-state-of-a-column}

컬럼의 현재 상태(값)에 접근하고 싶다면 `$state` 파라미터를 정의하세요:

```php
function ($state) {
    // ...
}
```

### 컬럼의 현재 Eloquent 레코드 주입하기 {#injecting-the-current-eloquent-record}

컬럼의 현재 Eloquent 레코드에 접근하고 싶다면 `$record` 파라미터를 정의하세요:

```php
use Illuminate\Database\Eloquent\Model;

function (Model $record) {
    // ...
}
```

이 파라미터는 컬럼이 Eloquent 레코드에 바인딩되어 있지 않으면 `null`이 됩니다. 예를 들어, 컬럼의 `label()` 메서드는 레코드에 접근할 수 없습니다. 라벨은 테이블 행과 관련이 없기 때문입니다.

### 컬럼 인스턴스 주입하기 {#injecting-the-current-column-instance}

현재 컬럼 인스턴스에 접근하고 싶다면 `$column` 파라미터를 정의하세요:

```php
use Filament\Tables\Columns\Column;

function (Column $column) {
    // ...
}
```

### 현재 Livewire 컴포넌트 인스턴스 주입하기 {#injecting-the-current-livewire-component-instance}

테이블이 속한 현재 Livewire 컴포넌트 인스턴스에 접근하고 싶다면 `$livewire` 파라미터를 정의하세요:

```php
use Filament\Tables\Contracts\HasTable;

function (HasTable $livewire) {
    // ...
}
```

### 현재 테이블 인스턴스 주입하기 {#injecting-the-current-table-instance}

컬럼이 속한 현재 테이블 설정 인스턴스에 접근하고 싶다면 `$table` 파라미터를 정의하세요:

```php
use Filament\Tables\Table;

function (Table $table) {
    // ...
}
```

### 현재 테이블 행 루프 주입하기 {#injecting-the-current-table-row-loop}

컬럼이 렌더링되는 [Laravel Blade 루프 객체](https://laravel.com/docs/blade#the-loop-variable)에 접근하고 싶다면 `$rowLoop` 파라미터를 정의하세요:

```php
function (stdClass $rowLoop) {
    // ...
}
```

`$rowLoop`는 [Laravel Blade의 `$loop` 객체](https://laravel.com/docs/blade#the-loop-variable)이므로, `$rowLoop->index`를 사용해 현재 행의 인덱스에 접근할 수 있습니다. `$record`와 마찬가지로, 컬럼이 현재 테이블 행 외부에서 렌더링될 때는 이 파라미터가 `null`이 됩니다.

### 여러 유틸리티 동시 주입하기 {#injecting-multiple-utilities}

파라미터는 리플렉션을 통해 동적으로 주입되므로, 원하는 순서로 여러 파라미터를 조합할 수 있습니다:

```php
use Filament\Tables\Contracts\HasTable;
use Illuminate\Database\Eloquent\Model;

function (HasTable $livewire, Model $record) {
    // ...
}
```

### Laravel 컨테이너에서 의존성 주입하기 {#injecting-dependencies-from-laravels-container}

유틸리티와 함께 Laravel 컨테이너에서 가져온 어떤 의존성도 평소처럼 주입할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

function (Request $request, Model $record) {
    // ...
}
```
