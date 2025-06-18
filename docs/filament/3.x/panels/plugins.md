---
title: 플러그인 개발
---
# [패널] 플러그인 개발

<LaracastsBanner
    title="패널 빌더 플러그인"
    description="Laracasts에서 Filament용 고급 컴포넌트 빌드(Build Advanced Components for Filament) 시리즈를 시청하세요. 플러그인 시작 방법을 배울 수 있습니다. 이 페이지의 텍스트 기반 가이드도 좋은 개요를 제공합니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/16"
    series="building-advanced-components"
/>

## 개요 {#overview}

Filament 플러그인의 기본은 Laravel 패키지입니다. 이들은 Composer를 통해 Filament 프로젝트에 설치되며, 라우트, 뷰, 번역을 등록하기 위해 서비스 프로바이더를 사용하는 등 모든 표준 기법을 따릅니다. Laravel 패키지 개발이 처음이라면, 핵심 개념을 이해하는 데 도움이 될 수 있는 몇 가지 자료가 있습니다:

- [Laravel 공식 문서의 패키지 개발 섹션](https://laravel.com/docs/packages)은 훌륭한 참고 가이드입니다.
- [Spatie의 패키지 트레이닝 강좌](https://spatie.be/products/laravel-package-training)는 과정을 단계별로 가르쳐주는 좋은 영상 시리즈입니다.
- [Spatie의 Package Tools](https://github.com/spatie/laravel-package-tools)는 유창한 구성 객체를 사용하여 서비스 프로바이더 클래스를 간소화할 수 있게 해줍니다.

Filament 플러그인은 Laravel 패키지의 개념 위에 구축되어, 어떤 Filament 패널에도 재사용 가능한 기능을 제공하고 사용할 수 있게 해줍니다. 플러그인은 각 패널에 하나씩 추가할 수 있으며, 패널마다 다르게 설정할 수도 있습니다.

## 플러그인 클래스로 패널 구성하기 {#configuring-the-panel-with-a-plugin-class}

플러그인 클래스는 패키지가 패널 [구성](configuration) 파일과 상호작용할 수 있도록 사용됩니다. 이는 `Plugin` 인터페이스를 구현하는 간단한 PHP 클래스입니다. 3개의 메서드가 필요합니다:

- `getId()` 메서드는 다른 플러그인들 사이에서 플러그인의 고유 식별자를 반환합니다. 동일한 프로젝트에서 사용될 수 있는 다른 플러그인들과 충돌하지 않도록 충분히 구체적으로 지정해 주세요.
- `register()` 메서드는 패널에서 사용할 수 있는 모든 [구성](configuration) 옵션을 사용할 수 있게 해줍니다. 여기에는 [리소스](resources/getting-started), [커스텀 페이지](pages), [테마](themes), [렌더 후크](configuration#render-hooks) 등록 등이 포함됩니다.
- `boot()` 메서드는 플러그인이 등록된 패널이 실제로 사용될 때만 실행됩니다. 이 메서드는 미들웨어 클래스에 의해 실행됩니다.

```php
<?php

namespace DanHarrin\FilamentBlog;

use DanHarrin\FilamentBlog\Pages\Settings;
use DanHarrin\FilamentBlog\Resources\CategoryResource;
use DanHarrin\FilamentBlog\Resources\PostResource;
use Filament\Contracts\Plugin;
use Filament\Panel;

class BlogPlugin implements Plugin
{
    public function getId(): string
    {
        return 'blog';
    }

    public function register(Panel $panel): void
    {
        $panel
            ->resources([
                PostResource::class,
                CategoryResource::class,
            ])
            ->pages([
                Settings::class,
            ]);
    }

    public function boot(Panel $panel): void
    {
        //
    }
}
```

플러그인 사용자는 플러그인 클래스를 인스턴스화하여 [구성](configuration)의 `plugin()` 메서드에 전달함으로써 패널에 추가할 수 있습니다:

```php
use DanHarrin\FilamentBlog\BlogPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->plugin(new BlogPlugin());
}
```

### 플루언트하게 플러그인 클래스 인스턴스화하기 {#fluently-instantiating-the-plugin-class}

사용자들이 플러그인 클래스를 플루언트하게 인스턴스화할 수 있도록 `make()` 메서드를 플러그인 클래스에 추가할 수 있습니다. 또한, 컨테이너(`app()`)를 사용하여 플러그인 객체를 인스턴스화하면 런타임에 다른 구현체로 교체할 수 있습니다:

```php
use Filament\Contracts\Plugin;

class BlogPlugin implements Plugin
{
    public static function make(): static
    {
        return app(static::class);
    }
    
    // ...
}
```

이제 사용자들은 `make()` 메서드를 사용할 수 있습니다:

```php
use DanHarrin\FilamentBlog\BlogPlugin;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->plugin(BlogPlugin::make());
}
```

### 패널별 플러그인 구성 {#configuring-plugins-per-panel}

플러그인 클래스에 다른 메서드를 추가하여 사용자가 플러그인을 구성할 수 있도록 할 수 있습니다. 각 옵션에 대해 setter와 getter 메서드를 모두 추가하는 것을 권장합니다. setter에서는 속성에 사용자의 설정을 저장하고, getter에서는 다시 해당 값을 가져와야 합니다.

```php
use DanHarrin\FilamentBlog\Resources\AuthorResource;
use Filament\Contracts\Plugin;
use Filament\Panel;

class BlogPlugin implements Plugin
{
    protected bool $hasAuthorResource = false;
    
    public function authorResource(bool $condition = true): static
    {
        // 이 메서드는 setter로, 사용자의 설정을
        // 플러그인 객체의 속성에 저장합니다.
        $this->hasAuthorResource = $condition;
    
        // setter 메서드에서 플러그인 객체를 반환하여
        // 설정 옵션을 체이닝할 수 있도록 합니다.
        return $this;
    }
    
    public function hasAuthorResource(): bool
    {
        // 이 메서드는 getter로, 사용자의 설정을
        // 플러그인 속성에서 가져옵니다.
        return $this->hasAuthorResource;
    }
    
    public function register(Panel $panel): void
    {
        // `register()` 메서드는 사용자가 플러그인을
        // 구성한 후에 실행되므로, 사용자의 설정을
        // 이 안에서 접근할 수 있습니다.
        if ($this->hasAuthorResource()) {
            // 여기서는 사용자가 요청한 경우에만
            // author 리소스를 패널에 등록합니다.
            $panel->resources([
                AuthorResource::class,
            ]);
        }
    }
    
    // ...
}
```

또한, 플러그인의 고유 ID를 사용하여 플러그인 클래스 외부에서 해당 설정 옵션에 접근할 수 있습니다. 이를 위해 `filament()` 메서드에 ID를 전달하면 됩니다:

```php
filament('blog')->hasAuthorResource()
```

설정에 접근할 때 더 나은 타입 안전성과 IDE 자동완성을 원할 수 있습니다. 이를 달성하는 방법은 자유롭게 선택할 수 있지만, 한 가지 아이디어로는 플러그인 클래스에 정적 메서드를 추가하여 가져오는 방법이 있습니다:

```php
use Filament\Contracts\Plugin;

class BlogPlugin implements Plugin
{
    public static function get(): static
    {
        return filament(app(static::class)->getId());
    }
    
    // ...
}
```

이제 새로운 정적 메서드를 사용하여 플러그인 설정에 접근할 수 있습니다:

```php
BlogPlugin::get()->hasAuthorResource()
```

## 플러그인에서 패널 배포하기 {#distributing-a-panel-in-a-plugin}

Laravel 패키지에서 전체 패널을 배포하는 것은 매우 쉽습니다. 이렇게 하면 사용자는 플러그인을 설치하기만 해도 앱의 완전히 새로운 일부가 미리 구축되어 제공됩니다.

패널을 [설정](configuration)할 때, 설정 클래스는 `PanelProvider` 클래스를 확장하며, 이는 표준 Laravel 서비스 프로바이더입니다. 패키지에서 서비스 프로바이더로 사용할 수 있습니다:

```php
<?php

namespace DanHarrin\FilamentBlog;

use Filament\Panel;
use Filament\PanelProvider;

class BlogPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('blog')
            ->path('blog')
            ->resources([
                // ...
            ])
            ->pages([
                // ...
            ])
            ->widgets([
                // ...
            ])
            ->middleware([
                // ...
            ])
            ->authMiddleware([
                // ...
            ]);
    }
}
```

그런 다음 패키지의 `composer.json`에 서비스 프로바이더로 등록해야 합니다:

```json
"extra": {
    "laravel": {
        "providers": [
            "DanHarrin\\FilamentBlog\\BlogPanelProvider"
        ]
    }
}
```
