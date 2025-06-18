---
title: 테마
---
# [패널] 테마
## 색상 변경하기 {#changing-the-colors}

[설정](configuration)에서 사용되는 색상을 쉽게 변경할 수 있습니다. Filament는 프레임워크 전반에 사용되는 6가지 미리 정의된 색상을 제공합니다. 이 색상들은 다음과 같이 커스터마이즈할 수 있습니다:

```php
use Filament\Panel;
use Filament\Support\Colors\Color;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->colors([
            'danger' => Color::Rose,
            'gray' => Color::Gray,
            'info' => Color::Blue,
            'primary' => Color::Indigo,
            'success' => Color::Emerald,
            'warning' => Color::Orange,
        ]);
}
```

`Filament\Support\Colors\Color` 클래스에는 모든 [Tailwind CSS 색상 팔레트](https://tailwindcss.com/docs/customizing-colors)에 대한 색상 옵션이 포함되어 있습니다.

또한, `register()`에 함수를 전달할 수도 있는데, 이 함수는 앱이 렌더링될 때만 호출됩니다. 이는 서비스 프로바이더에서 `register()`를 호출하고, 미들웨어에서 나중에 초기화되는 현재 인증된 사용자와 같은 객체에 접근하고 싶을 때 유용합니다.

또는, 직접 RGB 값 배열로 팔레트를 전달할 수도 있습니다:

```php
$panel
    ->colors([
        'primary' => [
            50 => '238, 242, 255',
            100 => '224, 231, 255',
            200 => '199, 210, 254',
            300 => '165, 180, 252',
            400 => '129, 140, 248',
            500 => '99, 102, 241',
            600 => '79, 70, 229',
            700 => '67, 56, 202',
            800 => '55, 48, 163',
            900 => '49, 46, 129',
            950 => '30, 27, 75',
        ],
    ])
```

### 색상 팔레트 생성하기 {#generating-a-color-palette}

단일 hex 또는 RGB 값을 기반으로 팔레트를 자동 생성하도록 하려면, 해당 값을 전달하면 됩니다:

```php
$panel
    ->colors([
        'primary' => '#6366f1',
    ])

$panel
    ->colors([
        'primary' => 'rgb(99, 102, 241)',
    ])
```

## 폰트 변경하기 {#changing-the-font}

기본적으로 [Inter](https://fonts.google.com/specimen/Inter) 폰트를 사용합니다. [설정](configuration) 파일에서 `font()` 메서드를 사용하여 이를 변경할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->font('Poppins');
}
```

모든 [Google Fonts](https://fonts.google.com) 폰트를 사용할 수 있습니다.

### 폰트 제공자 변경하기 {#changing-the-font-provider}

[Bunny Fonts CDN](https://fonts.bunny.net)는 폰트 제공에 사용되며, GDPR을 준수합니다. 만약 [Google Fonts CDN](https://fonts.google.com)을 대신 사용하고 싶다면, `font()` 메서드의 `provider` 인자를 사용하면 됩니다:

```php
use Filament\FontProviders\GoogleFontProvider;

$panel->font('Inter', provider: GoogleFontProvider::class)
```

또는 폰트를 로컬 스타일시트에서 제공하고 싶다면, `LocalFontProvider`를 사용할 수 있습니다:

```php
use Filament\FontProviders\LocalFontProvider;

$panel->font(
    'Inter',
    url: asset('css/fonts.css'),
    provider: LocalFontProvider::class,
)
```

## 커스텀 테마 만들기 {#creating-a-custom-theme}

Filament은 기본 스타일시트를 대체할 커스텀 스타일시트를 컴파일하여 UI에 사용되는 CSS를 변경할 수 있도록 지원합니다. 이 커스텀 스타일시트를 "테마"라고 부릅니다.

테마는 [Tailwind CSS](https://tailwindcss.com), Tailwind Forms 플러그인, Tailwind Typography 플러그인, [PostCSS Nesting 플러그인](https://www.npmjs.com/package/postcss-nesting), 그리고 [Autoprefixer](https://github.com/postcss/autoprefixer)를 사용합니다.

> Filament v3는 스타일링에 Tailwind CSS v3를 사용합니다. 따라서 테마를 만들 때 Tailwind CSS v3를 사용해야 합니다. `php artisan make:filament-theme` 명령어는 Tailwind CSS v3가 설치되어 있지 않다면 자동으로 설치해줍니다. 만약 Tailwind CSS v4가 설치되어 있다면, 테마를 컴파일하는 데 필요한 Vite 설정이 완전히 설치되지 않습니다. 테마를 컴파일할 때는 Tailwind CLI를 사용하거나, 프로젝트를 Tailwind CSS v3로 다운그레이드할 것을 권장합니다. `make:filament-theme` 명령어를 실행하면 Tailwind CLI로 테마를 컴파일하는 명령어가 출력됩니다. 이 명령어를 `package.json`의 스크립트에 저장해두면 편리하게 사용할 수 있습니다.
>
> Filament v4에서는 Tailwind CSS v4를 지원할 예정입니다.

패널에 대한 커스텀 테마를 만들려면 `php artisan make:filament-theme` 명령어를 사용할 수 있습니다:

```bash
php artisan make:filament-theme
```

여러 개의 패널이 있다면, 테마를 만들고자 하는 패널을 지정할 수 있습니다:

```bash
php artisan make:filament-theme admin
```

기본적으로 이 명령어는 NPM을 사용하여 의존성을 설치합니다. 다른 패키지 매니저를 사용하고 싶다면 `--pm` 옵션을 사용할 수 있습니다:

```bash
php artisan make:filament-theme --pm=bun
```

이 명령어는 `/resources/css/filament` 디렉터리에 CSS 파일과 Tailwind 설정 파일을 생성합니다. 이후 이 파일들을 수정하여 테마를 커스터마이즈할 수 있습니다. 또한 테마를 컴파일하고 Filament에 등록하는 방법에 대한 안내도 함께 제공됩니다. **설정 과정을 완료하려면 명령어에서 안내하는 지침을 반드시 따라주세요:**

```
⇂ 먼저, `vite.config.js`의 `input` 배열에 `resources/css/filament/admin/theme.css`를 추가하세요.
⇂ 다음으로, admin 패널 프로바이더에서 `->viteTheme('resources/css/filament/admin/theme.css')`를 사용해 테마를 등록하세요.
⇂ 마지막으로, 테마를 컴파일하려면 `npm run build`를 실행하세요.
```

등록해야 할 정확한 파일명은 명령어에서 안내하는 내용을 참고하세요. 파일명이 `admin/theme.css`가 아닐 수도 있습니다.

Tailwind v4가 설치되어 있다면, 출력 내용은 다음과 비슷할 수 있습니다:

```
⇂ Tailwind v4가 설치된 것으로 보입니다. Filament는 Tailwind v3를 사용합니다. 프로젝트를 다운그레이드한 후 이 명령어를 `--force` 옵션과 함께 다시 실행하거나, 아래 명령어로 Tailwind v3 CLI를 사용해 테마를 컴파일하세요:
⇂ npx tailwindcss@3 --input ./resources/css/filament/admin/theme.css --output ./public/css/filament/admin/theme.css --config ./resources/css/filament/admin/tailwind.config.js --minify
⇂ admin 패널 프로바이더에서 `->theme(asset('css/filament/admin/theme.css'))`를 사용해 테마를 등록하는 것을 잊지 마세요.
```

## 다크 모드 비활성화 {#disabling-dark-mode}

다크 모드 전환을 비활성화하려면 [설정](configuration) 파일을 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->darkMode(false);
}
```

## 기본 테마 모드 변경하기 {#changing-the-default-theme-mode}

기본적으로 Filament는 사용자의 시스템 테마를 기본 모드로 사용합니다. 예를 들어, 사용자의 컴퓨터가 다크 모드일 경우 Filament도 기본적으로 다크 모드를 사용합니다. Filament의 시스템 모드는 사용자가 컴퓨터의 모드를 변경하면 반응적으로 적용됩니다. 만약 기본 모드를 강제로 라이트 또는 다크 모드로 변경하고 싶다면, `defaultThemeMode()` 메서드를 사용하여 `ThemeMode::Light` 또는 `ThemeMode::Dark`를 전달하면 됩니다:

```php
use Filament\Enums\ThemeMode;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->defaultThemeMode(ThemeMode::Light);
}
```

## 로고 추가하기 {#adding-a-logo}

기본적으로 Filament는 앱의 이름을 사용하여 간단한 텍스트 기반 로고를 렌더링합니다. 하지만, 이를 쉽게 커스터마이즈할 수 있습니다.

로고에 사용되는 텍스트만 변경하고 싶다면, `brandName()` 메서드를 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandName('Filament Demo');
}
```

이미지를 대신 렌더링하려면, `brandLogo()` 메서드에 URL을 전달하면 됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(asset('images/logo.svg'));
}
```

또는, 예를 들어 인라인 SVG 요소를 렌더링하기 위해 HTML을 직접 `brandLogo()` 메서드에 전달할 수도 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(fn () => view('filament.admin.logo'));
}
```

```blade
<svg
    viewBox="0 0 128 26"
    xmlns="http://www.w3.org/2000/svg"
    class="h-full fill-gray-500 dark:fill-gray-400"
>
    <!-- ... -->
</svg>
```

애플리케이션이 다크 모드일 때 다른 로고를 사용해야 한다면, 동일한 방식으로 `darkModeBrandLogo()`에 전달할 수 있습니다.

로고의 높이는 기본적으로 적절한 값으로 설정되어 있지만, 모든 비율을 고려하는 것은 불가능합니다. 따라서, `brandLogoHeight()` 메서드를 사용하여 렌더링되는 로고의 높이를 커스터마이즈할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->brandLogo(fn () => view('filament.admin.logo'))
        ->brandLogoHeight('2rem');
}
```


## 파비콘 추가하기 {#adding-a-favicon}

파비콘을 추가하려면 [설정](configuration) 파일을 사용하여 파비콘의 public URL을 전달하면 됩니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->favicon(asset('images/favicon.png'));
}
```
