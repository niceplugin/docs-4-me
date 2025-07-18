---
title: 색상 선택기
---
# [폼.필드] ColorPicker

## 개요 {#overview}

색상 선택기 컴포넌트는 다양한 형식으로 색상을 선택할 수 있게 해줍니다.

기본적으로, 이 컴포넌트는 HEX 형식을 사용합니다:

```php
use Filament\Forms\Components\ColorPicker;

ColorPicker::make('color')
```

<AutoScreenshot name="forms/fields/color-picker/simple" alt="색상 선택기" version="3.x" />

## 색상 형식 설정하기 {#setting-the-color-format}

기본적으로 HEX 형식이 사용되지만, 사용할 색상 형식을 선택할 수 있습니다:

```php
use Filament\Forms\Components\ColorPicker;

ColorPicker::make('hsl_color')
    ->hsl()

ColorPicker::make('rgb_color')
    ->rgb()

ColorPicker::make('rgba_color')
    ->rgba()
```

## 색상 선택기 검증 {#color-picker-validation}

라라벨의 검증 규칙을 사용하여 색상 선택기의 값을 검증할 수 있습니다:

```php
use Filament\Forms\Components\ColorPicker;

ColorPicker::make('hex_color')
    ->regex('/^#([a-f0-9]{6}|[a-f0-9]{3})\b$/')

ColorPicker::make('hsl_color')
    ->hsl()
    ->regex('/^hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)$/')

ColorPicker::make('rgb_color')
    ->rgb()
    ->regex('/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/')

ColorPicker::make('rgba_color')
    ->rgba()
    ->regex('/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/')
```
