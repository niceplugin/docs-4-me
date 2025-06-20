---
title: 레코드 삭제하기
---
# [패널.리소스] 레코드 삭제하기
## 소프트 삭제 처리하기 {#handling-soft-deletes}

## 소프트 삭제가 적용된 리소스 생성하기 {#creating-a-resource-with-soft-delete}

기본적으로, 앱에서 삭제된 레코드와 상호작용할 수 없습니다. 리소스에서 복원, 강제 삭제 및 휴지통 레코드 필터링 기능을 추가하고 싶다면, 리소스를 생성할 때 `--soft-deletes` 플래그를 사용하세요:

```bash
php artisan make:filament-resource Customer --soft-deletes
```

## 기존 리소스에 소프트 삭제 추가하기 {#adding-soft-deletes-to-an-existing-resource}

또는, 기존 리소스에 소프트 삭제 기능을 추가할 수 있습니다.

먼저, 리소스를 업데이트해야 합니다:

```php
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->filters([
            Tables\Filters\TrashedFilter::make(),
            // ...
        ])
        ->actions([
            // 단순 리소스를 사용하거나, 테이블을 벗어나지 않고 레코드를 삭제할 수 있도록
            // 이 액션들을 테이블에 추가할 수 있습니다.
            Tables\Actions\DeleteAction::make(),
            Tables\Actions\ForceDeleteAction::make(),
            Tables\Actions\RestoreAction::make(),
            // ...
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
                Tables\Actions\ForceDeleteBulkAction::make(),
                Tables\Actions\RestoreBulkAction::make(),
                // ...
            ]),
        ]);
}

public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()
        ->withoutGlobalScopes([
            SoftDeletingScope::class,
        ]);
}
```

이제, Edit 페이지 클래스가 있다면 업데이트하세요:

```php
use Filament\Actions;

protected function getHeaderActions(): array
{
    return [
        Actions\DeleteAction::make(),
        Actions\ForceDeleteAction::make(),
        Actions\RestoreAction::make(),
        // ...
    ];
}
```

## 목록 페이지에서 레코드 삭제하기 {#deleting-records-on-the-list-page}

기본적으로, 테이블에서 레코드를 일괄 삭제할 수 있습니다. 또한, `DeleteAction`을 사용하여 단일 레코드를 삭제할 수도 있습니다:

```php
use Filament\Tables;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->actions([
            // ...
            Tables\Actions\DeleteAction::make(),
        ]);
}
```

## 권한 부여 {#authorization}

권한 부여를 위해, Filament는 앱에 등록된 모든 [모델 정책](https://laravel.com/docs/authorization#creating-policies)을 따릅니다.

모델 정책의 `delete()` 메서드가 `true`를 반환하면 사용자는 레코드를 삭제할 수 있습니다.

정책의 `deleteAny()` 메서드가 `true`를 반환하면 레코드를 일괄 삭제할 수도 있습니다. Filament는 여러 레코드를 반복하며 `delete()` 정책을 확인하는 것은 성능상 비효율적이기 때문에 `deleteAny()` 메서드를 사용합니다.

### 소프트 삭제 권한 부여 {#authorizing-soft-deletes}

`forceDelete()` 정책 메서드는 단일 소프트 삭제된 레코드가 강제 삭제되는 것을 방지하는 데 사용됩니다. `forceDeleteAny()`는 레코드가 일괄 강제 삭제되는 것을 방지하는 데 사용됩니다. Filament는 여러 레코드를 반복하며 `forceDelete()` 정책을 확인하는 것은 성능상 비효율적이기 때문에 `forceDeleteAny()` 메서드를 사용합니다.

`restore()` 정책 메서드는 단일 소프트 삭제된 레코드가 복원되는 것을 방지하는 데 사용됩니다. `restoreAny()`는 레코드가 일괄 복원되는 것을 방지하는 데 사용됩니다. Filament는 여러 레코드를 반복하며 `restore()` 정책을 확인하는 것은 성능상 비효율적이기 때문에 `restoreAny()` 메서드를 사용합니다.
