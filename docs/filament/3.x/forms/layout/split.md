---
title: Split
---
# [폼.레이아웃] Split

## 개요 {#overview}

`Split` 컴포넌트는 flexbox를 사용하여 유연한 너비의 레이아웃을 정의할 수 있게 해줍니다.

```php
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Split;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

Split::make([
    Section::make([
        TextInput::make('title'),
        Textarea::make('content'),
    ]),
    Section::make([
        Toggle::make('is_published'),
        Toggle::make('is_featured'),
    ])->grow(false),
])->from('md')
```

이 예시에서 첫 번째 섹션은 사용 가능한 가로 공간을 `grow()`로 차지하게 되며, 두 번째 섹션을 렌더링하는 데 필요한 공간에는 영향을 주지 않습니다. 이를 통해 사이드바 효과를 만들 수 있습니다.

`from()` 메서드는 split 레이아웃이 사용될 [Tailwind 브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview) (`sm`, `md`, `lg`, `xl`, `2xl`)를 제어하는 데 사용됩니다. 이 예시에서는 중간 크기 이상의 기기에서 split 레이아웃이 적용됩니다. 더 작은 기기에서는 섹션들이 위아래로 쌓이게 됩니다.

<AutoScreenshot name="forms/layout/split/simple" alt="Split" version="3.x" />
