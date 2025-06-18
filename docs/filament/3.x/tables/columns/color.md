---
title: ColorColumn
---
# [테이블.컬럼] ColorColumn

## 개요 {#overview}

컬러 컬럼은 CSS 색상 정의(일반적으로 컬러 피커 필드를 사용하여 입력됨)에서 색상 미리보기를 지원되는 형식(HEX, HSL, RGB, RGBA) 중 하나로 표시할 수 있습니다.

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
```

<AutoScreenshot name="tables/columns/color/simple" alt="컬러 컬럼" version="3.x" />

## 색상을 클립보드에 복사할 수 있도록 허용하기 {#allowing-the-color-to-be-copied-to-the-clipboard}

색상을 복사할 수 있도록 설정하면, 미리보기를 클릭할 때 CSS 값이 클립보드에 복사됩니다. 또한, 사용자 지정 확인 메시지와 밀리초 단위의 지속 시간을 선택적으로 지정할 수 있습니다. 이 기능은 앱에 SSL이 활성화되어 있을 때만 작동합니다.

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyMessage('색상 코드가 복사되었습니다')
    ->copyMessageDuration(1500)
```

<AutoScreenshot name="tables/columns/color/copyable" alt="복사 버튼이 있는 ColorColumn" version="3.x" />

### 클립보드에 복사되는 텍스트 커스터마이징하기 {#customizing-the-text-that-is-copied-to-the-clipboard}

`copyableState()` 메서드를 사용하여 클립보드에 복사되는 텍스트를 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyableState(fn (string $state): string => "Color: {$state}")
```

이 함수에서는 `$record`를 통해 전체 테이블 행에 접근할 수 있습니다:

```php
use App\Models\Post;
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyableState(fn (Post $record): string => "Color: {$record->color}")
```

## 여러 색상 블록 감싸기 {#wrapping-multiple-color-blocks}

여러 색상 블록이 한 줄에 모두 들어가지 않을 경우, `wrap()`을 설정하여 자동으로 감싸지게 할 수 있습니다:

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->wrap()
```

참고: 감싸기의 "너비"는 컬럼 라벨에 의해 영향을 받으므로, 더 촘촘하게 감싸고 싶다면 더 짧거나 숨겨진 라벨을 사용하는 것이 좋습니다.

