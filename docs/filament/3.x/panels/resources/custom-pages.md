---
title: 커스텀 페이지
---
# [패널.리소스] 커스텀 페이지
## 개요 {#overview}

Filament를 사용하면 리소스에 대해 완전히 커스텀한 페이지를 생성할 수 있습니다. 새 페이지를 생성하려면 다음 명령어를 사용할 수 있습니다:

```bash
php artisan make:filament-page SortUsers --resource=UserResource --type=custom
```

이 명령어는 리소스 디렉터리의 `/Pages` 디렉터리에 페이지 클래스 파일을, 리소스 뷰 디렉터리의 `/pages` 디렉터리에 뷰 파일을 각각 생성합니다.

커스텀 페이지는 리소스의 정적 `getPages()` 메서드에서 라우트에 등록해야 합니다:

```php
public static function getPages(): array
{
    return [
        // ...
        'sort' => Pages\SortUsers::route('/sort'),
    ];
}
```

> 이 메서드에 등록된 페이지의 순서는 중요합니다. 와일드카드 라우트 세그먼트가 하드코딩된 세그먼트보다 먼저 정의되어 있으면, Laravel의 라우터가 이를 먼저 매칭합니다.

라우트 경로에 정의된 [파라미터](https://laravel.com/docs/routing#route-parameters)는 [Livewire](https://livewire.laravel.com/docs/components#accessing-route-parameters)와 동일한 방식으로 페이지 클래스에서 사용할 수 있습니다.

## 리소스 레코드 사용하기 {#using-a-resource-record}

[Edit](editing-records)나 [View](viewing-records) 페이지처럼 레코드를 사용하는 페이지를 만들고 싶다면, `InteractsWithRecord` 트레이트를 사용할 수 있습니다:

```php
use Filament\Resources\Pages\Page;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;

class ManageUser extends Page
{
    use InteractsWithRecord;
    
    public function mount(int | string $record): void
    {
        $this->record = $this->resolveRecord($record);
    }

    // ...
}
```

`mount()` 메서드는 URL에서 레코드를 받아와 `$this->record`에 저장해야 합니다. 클래스나 뷰에서 언제든지 `$this->getRecord()`를 사용해 레코드에 접근할 수 있습니다.

라우트에 레코드를 파라미터로 추가하려면, `getPages()`에서 `{record}`를 정의해야 합니다:

```php
public static function getPages(): array
{
    return [
        // ...
        'manage' => Pages\ManageUser::route('/{record}/manage'),
    ];
}
```
