---
title: ColorEntry
---
# [인포리스트.엔트리] ColorEntry

## 개요 {#overview}

ColorEntry는 CSS 색상 정의에서 색상 미리보기를 표시할 수 있게 해주며, 일반적으로 컬러 피커 필드를 사용해 입력된 값을 지원되는 형식(HEX, HSL, RGB, RGBA) 중 하나로 보여줍니다.

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
```

<AutoScreenshot name="infolists/entries/color/simple" alt="ColorEntry" version="3.x" />

## 색상을 클립보드에 복사할 수 있도록 허용하기 {#allowing-the-color-to-be-copied-to-the-clipboard}

색상을 복사할 수 있도록 설정하면, 미리보기를 클릭할 때 CSS 값이 클립보드에 복사됩니다. 또한, 사용자 지정 확인 메시지와 밀리초 단위의 지속 시간을 선택적으로 지정할 수 있습니다. 이 기능은 앱에 SSL이 활성화되어 있을 때만 작동합니다.

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
    ->copyable()
    ->copyMessage('복사되었습니다!')
    ->copyMessageDuration(1500)
```

<AutoScreenshot name="infolists/entries/color/copyable" alt="복사 버튼이 있는 ColorEntry" version="3.x" />