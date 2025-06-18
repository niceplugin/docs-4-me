---
title: 커스텀 엔트리
---
# [인포리스트.엔트리] 커스텀 엔트리

<LaracastsBanner
    title="사용자 정의 Infolist 엔트리 만들기"
    description="Laracasts의 Build Advanced Components for Filament 시리즈를 시청하세요. 이 시리즈는 컴포넌트 제작 방법과 내부 도구 활용법을 모두 알려줍니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/8"
    series="building-advanced-components"
/>

## 뷰 엔트리 {#view-entries}

`view()` 메서드를 사용하여 엔트리에 대한 커스텀 뷰를 렌더링할 수 있습니다:

```php
use Filament\Infolists\Components\ViewEntry;

ViewEntry::make('status')
    ->view('filament.infolists.entries.status-switcher')
```

이는 `resources/views/filament/infolists/entries/status-switcher.blade.php` 파일이 존재한다고 가정합니다.

## 커스텀 클래스 {#custom-classes}

프로젝트 전반에서 재사용하거나, 커뮤니티에 플러그인으로 배포할 수 있도록 나만의 커스텀 엔트리 클래스와 엔트리 뷰를 생성할 수 있습니다.

> 단 한 번만 사용할 간단한 커스텀 엔트리를 만들고 싶다면, [뷰 엔트리](#view-entries)를 사용하여 원하는 Blade 파일을 렌더링할 수 있습니다.

커스텀 엔트리 클래스와 뷰를 생성하려면 다음 명령어를 사용할 수 있습니다:

```bash
php artisan make:infolist-entry StatusSwitcher
```

이 명령어는 다음과 같은 엔트리 클래스를 생성합니다:

```php
use Filament\Infolists\Components\Entry;

class StatusSwitcher extends Entry
{
    protected string $view = 'filament.infolists.entries.status-switcher';
}
```

또한 `resources/views/filament/infolists/entries/status-switcher.blade.php` 경로에 뷰 파일도 생성됩니다.

## 상태 접근하기 {#accessing-the-state}

뷰 내부에서 `$getState()` 함수를 사용하여 엔트리의 상태를 가져올 수 있습니다:

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