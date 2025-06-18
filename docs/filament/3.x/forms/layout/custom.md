---
title: 커스텀 레이아웃
---
# [폼.레이아웃] 커스텀 레이아웃

<LaracastsBanner
    title="커스텀 폼 레이아웃 만들기"
    description="Laracasts의 Filament 고급 컴포넌트 빌드(Build Advanced Components for Filament) 시리즈를 시청하세요. 컴포넌트 제작 방법과 내부 도구 활용법을 모두 배울 수 있습니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/7"
    series="building-advanced-components"
/>

## 뷰 컴포넌트 {#view-components}

[커스텀 레이아웃 컴포넌트 만들기](#custom-layout-classes) 외에도, 추가적인 PHP 클래스 없이 커스텀 레이아웃을 만들 수 있는 "뷰" 컴포넌트를 생성할 수 있습니다.

```php
use Filament\Forms\Components\View;

View::make('filament.forms.components.wizard')
```

이는 `resources/views/filament/forms/components/wizard.blade.php` 파일이 존재한다고 가정합니다.

## 커스텀 레이아웃 클래스 {#custom-layout-classes}

프로젝트 전반에 걸쳐 재사용할 수 있고, 심지어 커뮤니티에 플러그인으로 배포할 수도 있는 커스텀 컴포넌트 클래스와 뷰를 직접 만들 수 있습니다.

> 한 번만 사용할 간단한 커스텀 컴포넌트를 만들고 싶다면, [뷰 컴포넌트](#view-components)를 사용하여 원하는 Blade 파일을 렌더링할 수 있습니다.

커스텀 컴포넌트 클래스와 뷰를 생성하려면 다음 명령어를 사용할 수 있습니다:

```bash
php artisan make:form-layout Wizard
```

이 명령어는 다음과 같은 레이아웃 컴포넌트 클래스를 생성합니다:

```php
use Filament\Forms\Components\Component;

class Wizard extends Component
{
    protected string $view = 'filament.forms.components.wizard';

    public static function make(): static
    {
        return app(static::class);
    }
}
```

또한 `resources/views/filament/forms/components/wizard.blade.php` 경로에 뷰 파일도 생성됩니다.

## 컴포넌트의 스키마 렌더링하기 {#rendering-the-components-schema}

뷰 내부에서 `$getChildComponentContainer()` 함수를 사용하여 컴포넌트의 `schema()`를 렌더링할 수 있습니다:

```blade
<div>
    {{ $getChildComponentContainer() }}
</div>
```

## Eloquent 레코드에 접근하기 {#accessing-the-eloquent-record}

뷰 내부에서 `$getRecord()` 함수를 사용하여 Eloquent 레코드에 접근할 수 있습니다:

```blade
<div>
    {{ $getRecord()->name }}
</div>
```
