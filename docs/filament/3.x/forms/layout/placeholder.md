---
title: Placeholder
---
# [폼] Placeholder

## 개요 {#overview}

플레이스홀더는 폼 내에서 텍스트만 표시되는 "필드"를 렌더링하는 데 사용할 수 있습니다. 각 플레이스홀더는 `content()`를 가지며, 사용자가 변경할 수 없습니다.

```php
use App\Models\Post;
use Filament\Forms\Components\Placeholder;

Placeholder::make('created')
    ->content(fn (Post $record): string => $record->created_at->toFormattedDateString())
```

<AutoScreenshot name="forms/layout/placeholder/simple" alt="Placeholder" version="3.x" />

> **중요:** 모든 폼 필드는 고유한 이름이 필요합니다. 플레이스홀더도 마찬가지입니다!

## 플레이스홀더 내부에 HTML 렌더링하기 {#rendering-html-inside-the-placeholder}

플레이스홀더 콘텐츠 내에 커스텀 HTML을 렌더링할 수도 있습니다:

```php
use Filament\Forms\Components\Placeholder;
use Illuminate\Support\HtmlString;

Placeholder::make('documentation')
    ->content(new HtmlString('<a href="https://filamentphp.com/docs">filamentphp.com</a>'))
```

## 플레이스홀더 콘텐츠 동적 생성하기 {#dynamically-generating-placeholder-content}

`content()` 메서드에 클로저를 전달하여 플레이스홀더 콘텐츠를 동적으로 생성할 수 있습니다. [고급 클로저 커스터마이징](../advanced#closure-customization) 문서에서 설명한 모든 클로저 파라미터에 접근할 수 있습니다:

```php
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Get;

Placeholder::make('total')
    ->content(function (Get $get): string {
        return '€' . number_format($get('cost') * $get('quantity'), 2);
    })
```
