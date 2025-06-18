---
title: 커스텀 컬럼
---
# [테이블.컬럼] 커스텀 컬럼

<LaracastsBanner
    title="커스텀 테이블 컬럼 만들기"
    description="Laracasts의 Filament 고급 컴포넌트 빌드(Build Advanced Components for Filament) 시리즈를 시청하세요. 컴포넌트 제작 방법과 내부 도구 활용법을 모두 배울 수 있습니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/10"
    series="building-advanced-components"
/>

## 뷰 컬럼 {#view-columns}

`view()` 메서드를 사용하여 셀에 대한 커스텀 뷰를 렌더링할 수 있습니다:

```php
use Filament\Tables\Columns\ViewColumn;

ViewColumn::make('status')->view('filament.tables.columns.status-switcher')
```

이는 `resources/views/filament/tables/columns/status-switcher.blade.php` 파일이 존재한다고 가정합니다.

## 커스텀 클래스 {#custom-classes}

프로젝트 전반에 재사용하거나, 커뮤니티에 플러그인으로 배포할 수 있도록 직접 커스텀 컬럼 클래스와 셀 뷰를 만들 수 있습니다.

> 단순히 한 번만 사용할 간단한 커스텀 컬럼을 만들고 싶다면, [뷰 컬럼](#view-columns)을 사용해 원하는 Blade 파일을 렌더링할 수 있습니다.

커스텀 컬럼 클래스와 뷰를 생성하려면 다음 명령어를 사용할 수 있습니다:

```bash
php artisan make:table-column StatusSwitcher
```

이 명령어는 다음과 같은 컬럼 클래스를 생성합니다:

```php
use Filament\Tables\Columns\Column;

class StatusSwitcher extends Column
{
    protected string $view = 'filament.tables.columns.status-switcher';
}
```

또한 `resources/views/filament/tables/columns/status-switcher.blade.php` 경로에 뷰 파일도 생성됩니다.

## 상태 접근하기 {#accessing-the-state}

뷰 내부에서 `$getState()` 함수를 사용하여 셀의 상태를 가져올 수 있습니다:

```blade
<div>
    {{ $getState() }}
</div>
```

## Eloquent 레코드에 접근하기 {#accessing-the-eloquent-record}

뷰 내부에서 `$getRecord()` 함수를 사용하여 Eloquent 레코드에 접근할 수 있습니다:

```blade
<div>
    {{ $getRecord()->name }}
</div>
```
