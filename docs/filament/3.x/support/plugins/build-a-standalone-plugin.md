---
title: 독립형 플러그인 빌드하기
---
# [핵심개념.플러그인] 독립형 플러그인 만들기
## 서문 {#preface}

계속 진행하기 전에 [패널 플러그인 개발](/filament/3.x/panels/plugins) 및 [시작 가이드](/filament/3.x/support/plugins/getting-started) 문서를 읽어보시기 바랍니다.

## 개요 {#overview}

이 안내서에서는 폼에서 사용할 수 있는 새로운 폼 컴포넌트를 추가하는 간단한 플러그인을 만들어 보겠습니다. 이는 사용자가 자신의 패널에서 해당 컴포넌트를 사용할 수 있음을 의미합니다.

이 플러그인의 최종 코드는 [https://github.com/awcodes/headings](https://github.com/awcodes/headings)에서 확인할 수 있습니다.

## 1단계: 플러그인 생성 {#step-1-create-the-plugin}

먼저, [시작 가이드](/filament/3.x/support/plugins/getting-started#creating-a-plugin)에 나와 있는 단계에 따라 플러그인을 생성합니다.

## 2단계: 정리하기 {#step-2-clean-up}

다음으로, 필요하지 않은 보일러플레이트 코드를 제거하여 플러그인을 정리합니다. 많은 부분을 제거하는 것처럼 보일 수 있지만, 이 플러그인은 간단하므로 많은 보일러플레이트 코드를 삭제할 수 있습니다.

다음 디렉터리와 파일을 삭제하세요:
1. `bin`
1. `config`
1. `database`
1. `src/Commands`
1. `src/Facades`
1. `stubs`
1. `tailwind.config.js`

이제 `composer.json` 파일을 정리하여 불필요한 옵션을 제거할 수 있습니다.

```json
"autoload": {
    "psr-4": {
        // 데이터베이스 팩토리를 제거할 수 있습니다.
        "Awcodes\\Headings\\Database\\Factories\\": "database/factories/"
    }
},
"extra": {
    "laravel": {
        // 파사드를 제거할 수 있습니다.
        "aliases": {
            "Headings": "Awcodes\\Headings\\Facades\\ClockWidget"
        }
    }
},
```

일반적으로 Filament v3에서는 사용자가 커스텀 필라멘트 테마로 플러그인 스타일을 지정하는 것을 권장하지만, 예시를 위해 Filament v3의 새로운 `x-load` 기능을 사용하여 비동기적으로 로드할 수 있는 자체 스타일시트를 제공하겠습니다. 따라서 `package.json` 파일을 업데이트하여 cssnano, postcss, postcss-cli, postcss-nesting을 추가해 스타일시트를 빌드합니다.

```json
{
    "private": true,
    "scripts": {
        "build": "postcss resources/css/index.css -o resources/dist/headings.css"
    },
    "devDependencies": {
        "cssnano": "^6.0.1",
        "postcss": "^8.4.27",
        "postcss-cli": "^10.1.0",
        "postcss-nesting": "^13.0.0"
    }
}
```

그런 다음 의존성을 설치해야 합니다.

```bash
npm install
```

또한 `postcss.config.js` 파일을 업데이트하여 postcss를 구성해야 합니다.

```js
module.exports = {
    plugins: [
        require('postcss-nesting')(),
        require('cssnano')({
            preset: 'default',
        }),
    ],
};
```

테스트 디렉터리와 파일도 제거할 수 있지만, 이번 예시에서는 사용하지 않으므로 남겨두겠습니다. 하지만 플러그인에 대한 테스트를 작성하는 것을 강력히 권장합니다.

## 3단계: 프로바이더 설정 {#step-3-setting-up-the-provider}

이제 플러그인을 정리했으니 코드를 추가할 수 있습니다. `src/HeadingsServiceProvider.php` 파일의 보일러플레이트에는 많은 내용이 있으므로, 모든 내용을 삭제하고 처음부터 시작하겠습니다.

스타일시트를 Filament Asset Manager에 등록하여 blade 뷰에서 필요할 때 로드할 수 있어야 합니다. 이를 위해 서비스 프로바이더의 `packageBooted` 메서드에 다음 코드를 추가해야 합니다.

***`loadedOnRequest()` 메서드에 주의하세요. 이 메서드는 Filament에 스타일시트가 필요할 때만 로드하도록 지시하므로 중요합니다.***

```php
namespace Awcodes\Headings;

use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class HeadingsServiceProvider extends PackageServiceProvider
{
    public static string $name = 'headings';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasViews();
    }

    public function packageBooted(): void
    {
        FilamentAsset::register([
            Css::make('headings', __DIR__ . '/../resources/dist/headings.css')->loadedOnRequest(),
        ], 'awcodes/headings');
    }
}
```

## 4단계: 컴포넌트 생성 {#step-4-creating-our-component}

다음으로, 컴포넌트를 생성해야 합니다. `src/Heading.php`에 새 파일을 만들고 다음 코드를 추가하세요.

```php
namespace Awcodes\Headings;

use Closure;
use Filament\Forms\Components\Component;
use Filament\Support\Colors\Color;
use Filament\Support\Concerns\HasColor;

class Heading extends Component
{
    use HasColor;

    protected string | int $level = 2;

    protected string | Closure $content = '';

    protected string $view = 'headings::heading';

    final public function __construct(string | int $level)
    {
        $this->level($level);
    }

    public static function make(string | int $level): static
    {
        return app(static::class, ['level' => $level]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->dehydrated(false);
    }

    public function content(string | Closure $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function level(string | int $level): static
    {
        $this->level = $level;

        return $this;
    }

    public function getColor(): array
    {
        return $this->evaluate($this->color) ?? Color::Amber;
    }

    public function getContent(): string
    {
        return $this->evaluate($this->content);
    }

    public function getLevel(): string
    {
        return is_int($this->level) ? 'h' . $this->level : $this->level;
    }
}
```

## 5단계: 컴포넌트 렌더링 {#step-5-rendering-our-component}

다음으로, 컴포넌트의 뷰를 생성해야 합니다. `resources/views/heading.blade.php`에 새 파일을 만들고 다음 코드를 추가하세요.

우리는 x-load를 사용하여 스타일시트를 비동기적으로 로드하므로, 필요할 때만 로드됩니다. 이에 대한 자세한 내용은 문서의 [핵심 개념](/filament/3.x/support/assets#lazy-loading-css) 섹션에서 확인할 수 있습니다.

```blade
@php
    $level = $getLevel();
    $color = $getColor();
@endphp

<{{ $level }}
    x-data
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('headings', package: 'awcodes/headings'))]"
    {{
        $attributes
            ->class([
                'headings-component',
                match ($color) {
                    'gray' => 'text-gray-600 dark:text-gray-400',
                    default => 'text-custom-500',
                },
            ])
            ->style([
                \Filament\Support\get_color_css_variables($color, [500]) => $color !== 'gray',
            ])
    }}
>
    {{ $getContent() }}
</{{ $level }}>
```

## 6단계: 스타일 추가 {#step-6-adding-some-styles}

다음으로, 필드에 대한 커스텀 스타일을 추가하겠습니다. `resources/css/index.css`에 다음을 추가하고, `npm run build`를 실행하여 css를 컴파일하세요.

```css
.headings-component {
    &:is(h1, h2, h3, h4, h5, h6) {
         font-weight: 700;
         letter-spacing: -.025em;
         line-height: 1.1;
     }

    &h1 {
         font-size: 2rem;
     }

    &h2 {
         font-size: 1.75rem;
     }

    &h3 {
         font-size: 1.5rem;
     }

    &h4 {
         font-size: 1.25rem;
     }

    &h5,
    &h6 {
         font-size: 1rem;
     }
}
```

그런 다음 스타일시트를 빌드해야 합니다.

```bash
npm run build
```

## 7단계: README 업데이트 {#step-7-update-your-readme}

`README.md` 파일을 업데이트하여 플러그인 설치 방법 및 사용자가 프로젝트에서 사용하는 방법 등 공유하고 싶은 정보를 포함하세요. 예를 들면 다음과 같습니다.

```php
use Awcodes\Headings\Heading;

Heading::make(2)
    ->content('Product Information')
    ->color(Color::Lime),
```

이제 사용자는 플러그인을 설치하고 자신의 프로젝트에서 사용할 수 있습니다.
