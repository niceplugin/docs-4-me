---
title: 패널 플러그인 빌드하기
---
# [핵심개념.플러그인] 패널 플러그인 빌드하기

<LaracastsBanner
    title="패널 빌더 플러그인"
    description="Laracasts에서 Filament를 위한 고급 컴포넌트 빌드 시리즈를 시청하세요. 이 시리즈는 플러그인 시작 방법을 알려줍니다. 이 페이지의 텍스트 기반 가이드도 좋은 개요를 제공합니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/16"
    series="building-advanced-components"
/>

## 서문 {#preface}

계속 진행하기 전에 [패널 플러그인 개발](/filament/3.x/panels/plugins)과 [시작 가이드](/filament/3.x/support/plugins/getting-started) 문서를 읽어보시기 바랍니다.

## 개요 {#overview}

이 안내서에서는 폼에서 사용할 수 있는 새로운 폼 필드를 추가하는 간단한 플러그인을 만들어보겠습니다. 이는 사용자들이 자신의 패널에서 해당 필드를 사용할 수 있게 됨을 의미합니다.

이 플러그인의 최종 코드는 [https://github.com/awcodes/clock-widget](https://github.com/awcodes/clock-widget)에서 확인할 수 있습니다.

## 1단계: 플러그인 생성하기 {#step-1-create-the-plugin}

먼저, [시작 가이드](/filament/3.x/support/plugins/getting-started#creating-a-plugin)에 설명된 단계에 따라 플러그인을 생성하겠습니다.

## 2단계: 정리하기 {#step-2-clean-up}

다음으로, 필요하지 않은 보일러플레이트 코드를 제거하여 플러그인을 정리하겠습니다. 양이 많아 보일 수 있지만, 이 플러그인은 단순하기 때문에 많은 보일러플레이트 코드를 제거할 수 있습니다.

다음 디렉터리와 파일을 삭제하세요:
1. `config`
1. `database`
1. `src/Commands`
1. `src/Facades`
1. `stubs`

우리 플러그인은 기능을 위한 설정이나 추가 메서드가 필요하지 않으므로, `ClockWidgetPlugin.php` 파일도 삭제할 수 있습니다.

1. `ClockWidgetPlugin.php`

Filament v3에서는 플러그인 스타일링을 커스텀 필라멘트 테마로 할 것을 권장하므로, 플러그인에서 css를 사용하기 위한 파일들도 삭제하겠습니다. 이는 선택 사항이며, 원한다면 css를 계속 사용할 수 있지만 권장되지는 않습니다.

1. `resources/css`
1. `postcss.config.js`
1. `tailwind.config.js`

이제 `composer.json` 파일을 정리하여 불필요한 옵션을 제거할 수 있습니다.

```json
"autoload": {
    "psr-4": {
        // 데이터베이스 팩토리는 제거할 수 있습니다.
        "Awcodes\\ClockWidget\\Database\\Factories\\": "database/factories/"
    }
},
"extra": {
    "laravel": {
        // 파사드는 제거할 수 있습니다.
        "aliases": {
            "ClockWidget": "Awcodes\\ClockWidget\\Facades\\ClockWidget"
        }
    }
},
```

마지막 단계로, `package.json` 파일을 업데이트하여 불필요한 옵션을 제거합니다. `package.json`의 내용을 아래와 같이 교체하세요.

```json
{
    "private": true,
    "type": "module",
    "scripts": {
        "dev": "node bin/build.js --dev",
        "build": "node bin/build.js"
    },
    "devDependencies": {
        "esbuild": "^0.17.19"
    }
}
```

그런 다음, 의존성을 설치해야 합니다.

```bash
npm install
```

테스트 디렉터리와 파일도 삭제할 수 있지만, 이번 예제에서는 사용하지 않으므로 남겨두겠습니다. 하지만 플러그인에 대한 테스트를 작성하는 것을 강력히 권장합니다.

## 3단계: 프로바이더 설정하기 {#step-3-setting-up-the-provider}

이제 플러그인을 정리했으니, 코드를 추가할 수 있습니다. `src/ClockWidgetServiceProvider.php` 파일의 보일러플레이트에는 많은 내용이 들어 있으므로, 모든 내용을 삭제하고 처음부터 시작하겠습니다.

> 이 예제에서는 [비동기 Alpine 컴포넌트](../assets#asynchronous-alpinejs-components)를 등록할 것입니다. 이러한 에셋은 요청 시에만 로드되므로, `packageBooted()` 메서드에서 일반적으로 등록할 수 있습니다. CSS나 JS 파일처럼 사용 여부와 상관없이 모든 페이지에서 항상 로드되는 에셋을 등록하려면, `Plugin` 설정 객체의 `register()` 메서드에서 [`$panel->assets()`](../../panels/configuration#registering-assets-for-a-panel)를 사용해 등록해야 합니다. 그렇지 않고 `packageBooted()` 메서드에서 등록하면, 플러그인이 해당 패널에 등록되지 않았더라도 모든 패널에서 로드됩니다.

위젯을 패널에 등록하고, 위젯이 사용될 때 Alpine 컴포넌트를 로드할 수 있어야 합니다. 이를 위해 서비스 프로바이더의 `packageBooted` 메서드에 다음 코드를 추가해야 합니다. 이 코드는 Livewire에 위젯 컴포넌트를 등록하고, Filament Asset Manager에 Alpine 컴포넌트를 등록합니다.

```php
use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Facades\FilamentAsset;
use Livewire\Livewire;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class ClockWidgetServiceProvider extends PackageServiceProvider
{
    public static string $name = 'clock-widget';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasViews()
            ->hasTranslations();
    }

    public function packageBooted(): void
    {
        Livewire::component('clock-widget', ClockWidget::class);

        // 에셋 등록
        FilamentAsset::register(
            assets:[
                 AlpineComponent::make('clock-widget', __DIR__ . '/../resources/dist/clock-widget.js'),
            ],
            package: 'awcodes/clock-widget'
        );
    }
}
```

## 4단계: 위젯 생성하기 {#step-4-create-the-widget}

이제 위젯을 생성할 차례입니다. 먼저 `ClockWidget.php` 파일에서 Filament의 `Widget` 클래스를 확장하고, 위젯의 뷰가 어디에 있는지 지정해야 합니다. 패키지 서비스 프로바이더를 사용해 뷰를 등록하고 있으므로, `::` 구문을 사용해 Filament에 뷰의 위치를 알려줄 수 있습니다.

```php
use Filament\Widgets\Widget;

class ClockWidget extends Widget
{
    protected static string $view = 'clock-widget::widget';
}
```

다음으로, 위젯의 뷰를 만들어야 합니다. `resources/views/widget.blade.php` 파일을 새로 만들고 아래 코드를 추가하세요. Filament의 블레이드 컴포넌트를 활용해 위젯의 html을 빠르게 작성할 수 있습니다.

Alpine 컴포넌트를 비동기로 로드하기 위해 async Alpine을 사용하므로, Alpine이 컴포넌트를 로드하도록 div에 `x-load` 속성을 추가해야 합니다. 이에 대한 자세한 내용은 문서의 [핵심 개념](/filament/3.x/support/assets#asynchronous-alpinejs-components) 섹션에서 확인할 수 있습니다.

```blade
<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ __('clock-widget::clock-widget.title') }}
        </x-slot>

        <div
            x-load
            x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('clock-widget', 'awcodes/clock-widget') }}"
            x-data="clockWidget()"
            class="text-center"
        >
            <p>{{ __('clock-widget::clock-widget.description') }}</p>
            <p class="text-xl" x-text="time"></p>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
```

다음으로, Alpine 컴포넌트를 `src/js/index.js`에 작성해야 합니다. 그리고 `npm run build` 명령어로 에셋을 빌드하세요.

```js
export default function clockWidget() {
    return {
        time: new Date().toLocaleTimeString(),
        init() {
            setInterval(() => {
                this.time = new Date().toLocaleTimeString();
            }, 1000);
        }
    }
}
```

또한, 위젯의 텍스트에 대한 번역도 추가해 사용자가 자신의 언어로 위젯을 번역할 수 있도록 해야 합니다. 번역 파일은 `resources/lang/en/widget.php`에 추가합니다.

```php
return [
    'title' => 'Clock Widget',
    'description' => 'Your current time is:',
];
```

## 5단계: README 업데이트 {#step-5-update-your-readme}

`README.md` 파일을 업데이트하여 플러그인 설치 방법과 사용자에게 공유하고 싶은 기타 정보(예: 프로젝트에서 사용하는 방법 등)를 포함해야 합니다. 예를 들어:

```php
// 패널 프로바이더에서 플러그인 및/또는 위젯을 등록하세요:

use Awcodes\ClockWidget\ClockWidgetWidget;

public function panel(Panel $panel): Panel
{
    return $panel
        ->widgets([
            ClockWidgetWidget::class,
        ]);
}
```

이제 사용자들은 플러그인을 설치하고 자신의 프로젝트에서 사용할 수 있습니다.
