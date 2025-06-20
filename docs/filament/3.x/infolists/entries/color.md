---
title: 색상 항목
---
# [인포리스트.엔트리] ColorEntry

## 개요 {#overview}

색상 항목은 CSS 색상 정의에서 색상 미리보기를 표시할 수 있게 해주며, 일반적으로 색상 선택기 필드를 사용하여 입력하며 지원되는 형식(HEX, HSL, RGB, RGBA) 중 하나로 표시됩니다.

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
```

<AutoScreenshot name="infolists/entries/color/simple" alt="색상 항목" version="3.x" />

## 색상을 클립보드에 복사할 수 있도록 허용하기 {#allowing-the-color-to-be-copied-to-the-clipboard}

색상을 복사할 수 있도록 만들어, 미리보기를 클릭하면 CSS 값을 클립보드에 복사할 수 있으며, 선택적으로 사용자 지정 확인 메시지와 밀리초 단위의 지속 시간을 지정할 수 있습니다. 이 기능은 앱에 SSL이 활성화된 경우에만 작동합니다.

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
    ->copyable()
    ->copyMessage('복사됨!')
    ->copyMessageDuration(1500)
```

<AutoScreenshot name="infolists/entries/color/copyable" alt="복사 버튼이 있는 색상 항목" version="3.x" />