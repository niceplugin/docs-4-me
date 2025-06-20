---
title: 색상 컬럼
---
# [테이블.컬럼] ColorColumn

## 개요 {#overview}

색상 컬럼은 CSS 색상 정의(일반적으로 색상 선택기 필드를 사용하여 입력됨)에서 색상 미리보기를 지원되는 형식(HEX, HSL, RGB, RGBA) 중 하나로 표시할 수 있습니다.

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
```

<AutoScreenshot name="tables/columns/color/simple" alt="색상 컬럼" version="3.x" />

## 색상을 클립보드에 복사할 수 있도록 허용하기 {#allowing-the-color-to-be-copied-to-the-clipboard}

색상을 복사 가능하게 만들어, 미리보기를 클릭하면 CSS 값을 클립보드에 복사할 수 있도록 할 수 있으며, 선택적으로 사용자 지정 확인 메시지와 밀리초 단위의 지속 시간을 지정할 수 있습니다. 이 기능은 앱에 SSL이 활성화된 경우에만 작동합니다.

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyMessage('색상 코드가 복사되었습니다')
    ->copyMessageDuration(1500)
```

<AutoScreenshot name="tables/columns/color/copyable" alt="복사 버튼이 있는 색상 컬럼" version="3.x" />

### 클립보드에 복사되는 텍스트 사용자 지정하기 {#customizing-the-text-that-is-copied-to-the-clipboard}

`copyableState()` 메서드를 사용하여 클립보드에 복사되는 텍스트를 사용자 지정할 수 있습니다:

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyableState(fn (string $state): string => "색상: {$state}")
```

이 함수 내에서 `$record`를 통해 전체 테이블 행에 접근할 수 있습니다:

```php
use App\Models\Post;
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyableState(fn (Post $record): string => "색상: {$record->color}")
```

## 여러 색상 블록 감싸기 {#wrapping-multiple-color-blocks}

`wrap()`을 설정하면 한 줄에 모두 들어가지 않는 경우 색상 블록이 감싸지도록 할 수 있습니다:

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->wrap()
```

참고: 감싸기의 "너비"는 컬럼 라벨에 의해 영향을 받으므로, 더 촘촘하게 감싸려면 더 짧거나 숨겨진 라벨을 사용해야 할 수 있습니다.

