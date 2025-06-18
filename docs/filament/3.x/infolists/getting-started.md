---
title: 시작하기
---
# [인포리스트] 시작하기
## 개요 {#overview}

Filament의 infolist 패키지는 [특정 엔터티에 대한 읽기 전용 데이터 목록을 렌더링](adding-an-infolist-to-a-livewire-component)할 수 있게 해줍니다. 이 패키지는 [Panel Builder](/filament/3.x/panels/getting-started)에서 [앱 리소스](../panels/resources/getting-started)와 [관계 매니저](../panels/resources/relation-managers)를 표시하거나, [액션 모달](/filament/3.x/actions/overview) 등 다른 Filament 패키지 내에서도 사용됩니다. Infolist Builder의 기능을 익히면 직접 커스텀 Livewire 애플리케이션을 개발할 때나 Filament의 다른 패키지를 사용할 때 큰 시간을 절약할 수 있습니다.

이 가이드는 Filament의 infolist 패키지로 인포리스트를 만드는 기본적인 방법을 안내합니다. 만약 직접 만든 Livewire 컴포넌트에 새로운 인포리스트를 추가하려는 경우, [먼저 이 작업을 진행](adding-an-infolist-to-a-livewire-component)한 후 다시 돌아오세요. [앱 리소스](../panels/resources/getting-started)나 다른 Filament 패키지에 인포리스트를 추가하려는 경우라면 바로 시작하셔도 됩니다!

## 엔트리 정의하기 {#defining-entries}

인포리스트를 만들기 위한 첫 번째 단계는 리스트에 표시될 엔트리들을 정의하는 것입니다. 이는 `Infolist` 객체에서 `schema()` 메서드를 호출하여 할 수 있습니다. 이 메서드는 엔트리 객체들의 배열을 인자로 받습니다.

```php
use Filament\Infolists\Components\TextEntry;

$infolist
    ->schema([
        TextEntry::make('title'),
        TextEntry::make('slug'),
        TextEntry::make('content'),
    ]);
```

각 엔트리은 인포리스트에 표시되어야 하는 정보의 한 조각입니다. `TextEntry`는 텍스트를 표시하는 데 사용되지만, [다른 엔트리 타입들도 사용할 수 있습니다](entries/getting-started#available-entries).

패널 빌더 및 기타 패키지 내의 인포리스트는 기본적으로 2개의 컬럼을 가집니다. 커스텀 인포리스트의 경우, `columns()` 메서드를 사용하여 동일한 효과를 낼 수 있습니다:

```php
$infolist
    ->schema([
        // ...
    ])
    ->columns(2);
```

이제 `content` 엔트리은 사용 가능한 너비의 절반만 차지하게 됩니다. `columnSpan()` 메서드를 사용하여 전체 너비를 차지하도록 만들 수 있습니다:

```php
use Filament\Infolists\Components\TextEntry;

[
    TextEntry::make('title'),
    TextEntry::make('slug')
    TextEntry::make('content')
        ->columnSpan(2), // 또는 `columnSpan('full')`,
]
```

컬럼과 span에 대해 더 자세히 알고 싶다면 [레이아웃 문서](layout/grid)를 참고하세요. 반응형으로 만드는 것도 가능합니다!

## 레이아웃 컴포넌트 사용하기 {#using-layout-components}

Infolist Builder는 [레이아웃 컴포넌트](/filament/3.x/forms/layout/getting-started#available-layout-components)를 스키마 배열 안에서 사용할 수 있도록 하여 엔트리이 표시되는 방식을 제어할 수 있습니다. `Section`은 레이아웃 컴포넌트로, 여러 엔트리에 제목과 설명을 추가할 수 있습니다. 또한 내부의 엔트리들을 접을 수 있게 하여, 긴 인포리스트에서 공간을 절약할 수 있습니다.

```php
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;

[
    TextEntry::make('title'),
    TextEntry::make('slug'),
    TextEntry::make('content')
        ->columnSpan(2)
        ->markdown(),
    Section::make('Media')
        ->description('페이지 레이아웃에 사용된 이미지입니다.')
        ->schema([
            // ...
        ]),
]
```

이 예시에서 볼 수 있듯이, `Section` 컴포넌트는 자체적으로 `schema()` 메서드를 가지고 있습니다. 이를 사용하여 다른 엔트리이나 레이아웃 컴포넌트를 내부에 중첩할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;

Section::make('Media')
    ->description('페이지 레이아웃에 사용된 이미지입니다.')
    ->schema([
        ImageEntry::make('hero_image'),
        TextEntry::make('alt_text'),
    ])
```

이 섹션에는 이제 [`ImageEntry`](entries/image)와 [`TextEntry`](entries/text)가 포함되어 있습니다. 해당 엔트리들과 그 기능에 대해 더 자세히 알고 싶다면 각 문서 페이지를 참고하세요.

## 인포리스트 패키지로 다음 단계 진행하기 {#next-steps-with-the-infolists-package}

이제 이 가이드를 모두 읽으셨다면, 다음에는 무엇을 해야 할까요? 다음과 같은 제안을 드립니다:

- [인포리스트에 데이터를 표시할 수 있는 다양한 엔트리를 살펴보세요.](entries/getting-started#available-entries)
- [CSS를 직접 다루지 않고도 복잡하고 반응형 레이아웃을 만드는 방법을 알아보세요.](/filament/3.x/forms/layout/getting-started)
