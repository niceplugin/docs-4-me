---
title: Split
---
# [인포리스트.레이아웃] Split

## 개요 {#overview}

`Split` 컴포넌트는 flexbox를 사용하여 유연한 너비의 레이아웃을 정의할 수 있게 해줍니다.

```php
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\Split;
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\FontWeight;

Split::make([
    Section::make([
        TextEntry::make('title')
            ->weight(FontWeight::Bold),
        TextEntry::make('content')
            ->markdown()
            ->prose(),
    ]),
    Section::make([
        TextEntry::make('created_at')
            ->dateTime(),
        TextEntry::make('published_at')
            ->dateTime(),
    ])->grow(false),
])->from('md')
```

이 예시에서 첫 번째 섹션은 사용 가능한 가로 공간을 차지하기 위해 `grow()` 하며, 두 번째 섹션을 렌더링하는 데 필요한 공간에는 영향을 주지 않습니다. 이는 사이드바 효과를 만듭니다.

`from()` 메서드는 split 레이아웃이 사용되어야 하는 [Tailwind 브레이크포인트](https://tailwindcss.com/docs/responsive-design#overview) (`sm`, `md`, `lg`, `xl`, `2xl`)를 제어하는 데 사용됩니다. 이 예시에서는 split 레이아웃이 중간 크기 이상의 기기에서 사용됩니다. 더 작은 기기에서는 섹션들이 위아래로 쌓이게 됩니다.

<AutoScreenshot name="infolists/layout/split/simple" alt="Split" version="3.x" />
