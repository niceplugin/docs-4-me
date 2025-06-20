---
title: 색상
---
# [핵심개념] 색상
## 개요 {#overview}

Filament는 CSS 변수를 사용하여 색상 팔레트를 정의합니다. 이러한 CSS 변수들은 Filament를 설치할 때 로드하는 프리셋 파일에서 Tailwind 클래스에 매핑됩니다.

## 기본 색상 사용자 정의하기 {#customizing-the-default-colors}

서비스 프로바이더의 `boot()` 메서드나 미들웨어에서 `FilamentColor::register()` 메서드를 호출하여 Filament가 UI 요소에 사용할 색상을 사용자 정의할 수 있습니다.

Filament 전반에서 사용되는 6가지 기본 색상을 사용자 정의할 수 있습니다:

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => Color::Red,
    'gray' => Color::Zinc,
    'info' => Color::Blue,
    'primary' => Color::Amber,
    'success' => Color::Green,
    'warning' => Color::Amber,
]);
```

`Color` 클래스에는 선택할 수 있는 모든 [Tailwind CSS 색상](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)이 포함되어 있습니다.

또한 `register()`에 함수를 전달할 수도 있는데, 이 함수는 앱이 렌더링될 때만 호출됩니다. 이는 서비스 프로바이더에서 `register()`를 호출하고, 미들웨어에서 나중에 초기화되는 현재 인증된 사용자와 같은 객체에 접근하고 싶을 때 유용합니다.

## Tailwind가 아닌 색상 사용하기 {#using-a-non-tailwind-color}

[Tailwind CSS 색상](https://tailwindcss.com/docs/customizing-colors#color-palette-reference) 팔레트에 포함되지 않은 사용자 정의 색상을 사용할 수 있습니다. 이때는 `50`부터 `950`까지의 색상 음영을 RGB 형식의 배열로 전달하면 됩니다:

```php
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => [
        50 => '254, 242, 242',
        100 => '254, 226, 226',
        200 => '254, 202, 202',
        300 => '252, 165, 165',
        400 => '248, 113, 113',
        500 => '239, 68, 68',
        600 => '220, 38, 38',
        700 => '185, 28, 28',
        800 => '153, 27, 27',
        900 => '127, 29, 29',
        950 => '69, 10, 10',
    ],
]);
```

### 헥스 코드로 사용자 정의 색상 생성하기 {#generating-a-custom-color-from-a-hex-code}

`Color::hex()` 메서드를 사용하여 헥스 코드로부터 사용자 정의 색상 팔레트를 생성할 수 있습니다:

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => Color::hex('#ff0000'),
]);
```

### RGB 값으로 사용자 정의 색상 생성하기 {#generating-a-custom-color-from-an-rgb-value}

`Color::rgb()` 메서드를 사용하여 RGB 값으로부터 사용자 정의 색상 팔레트를 생성할 수 있습니다:

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'danger' => Color::rgb('rgb(255, 0, 0)'),
]);
```

## 추가 색상 등록하기 {#registering-extra-colors}

Filament 전반에서 사용할 수 있는 추가 색상을 등록할 수 있습니다:

```php
use Filament\Support\Colors\Color;
use Filament\Support\Facades\FilamentColor;

FilamentColor::register([
    'indigo' => Color::Indigo,
]);
```

이제, 이 색상은 일반적으로 `primary`, `danger` 등을 추가하는 곳 어디에서나 사용할 수 있습니다.
