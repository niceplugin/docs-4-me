---
title: ImageColumn
---
# [테이블.컬럼] ImageColumn

## 개요 {#overview}

이미지는 테이블 내에서 쉽게 표시할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
```

데이터베이스의 해당 컬럼에는 스토리지 디스크의 루트 디렉터리를 기준으로 한 이미지 경로가 포함되어 있어야 합니다.

<AutoScreenshot name="tables/columns/image/simple" alt="ImageColumn" version="3.x" />

## 이미지 디스크 관리 {#managing-the-image-disk}

기본적으로 이미지를 가져올 때 `public` 디스크가 사용됩니다. `disk()` 메서드에 커스텀 디스크 이름을 전달할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->disk('s3')
```

## 비공개 이미지 {#private-images}

Filament은 비공개 이미지를 렌더링하기 위해 임시 URL을 생성할 수 있으며, `visibility()`를 `private`으로 설정할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->visibility('private')
```

## 크기 커스터마이징 {#customizing-the-size}

`width()`와 `height()`를 전달하거나, 둘 다 `size()`로 전달하여 이미지 크기를 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('header_image')
    ->width(200)

ImageColumn::make('header_image')
    ->height(50)

ImageColumn::make('author.avatar')
    ->size(40)
```

## 정사각형 이미지 {#square-image}

이미지를 1:1 비율로 표시할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->square()
```

<AutoScreenshot name="tables/columns/image/square" alt="정사각형 ImageColumn" version="3.x" />

## 원형 이미지 {#circular-image}

이미지를 완전히 둥글게 만들 수 있으며, 이는 아바타를 렌더링할 때 유용합니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->circular()
```

<AutoScreenshot name="tables/columns/image/circular" alt="원형 ImageColumn" version="3.x" />

## 기본 이미지 URL 추가하기 {#adding-a-default-image-url}

아직 이미지가 존재하지 않을 경우, `defaultImageUrl()` 메서드에 URL을 전달하여 플레이스홀더 이미지를 표시할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('avatar')
    ->defaultImageUrl(url('/images/placeholder.png'))
```

## 이미지 쌓기 {#stacking-images}

`stacked()`를 사용하여 여러 이미지를 겹쳐진 이미지 스택으로 표시할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
```

<AutoScreenshot name="tables/columns/image/stacked" alt="겹쳐진 ImageColumn" version="3.x" />

### 스택된 링 너비 사용자 지정 {#customizing-the-stacked-ring-width}

기본 링 너비는 `3`이지만, `0`에서 `8`까지 원하는 값으로 설정할 수 있습니다:

```php
ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->ring(5)
```

### 중첩 오버랩 커스터마이징하기 {#customizing-the-stacked-overlap}

기본 오버랩 값은 `4`이지만, `0`에서 `8`까지 원하는 값으로 커스터마이즈할 수 있습니다:

```php
ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->overlap(2)
```

## 여러 이미지 감싸기 {#wrapping-multiple-images}

여러 이미지를 한 줄에 모두 표시할 수 없을 때, `wrap()`을 설정하여 이미지를 감쌀 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->wrap()
```

참고: 감싸기의 "너비"는 컬럼 라벨에 의해 영향을 받으므로, 더 촘촘하게 감싸고 싶다면 더 짧거나 숨겨진 라벨을 사용하는 것이 좋습니다.

## 제한 설정 {#setting-a-limit}

표시할 이미지의 최대 개수를 제한하려면 `limit()`을 전달하면 됩니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->limit(3)
```

<AutoScreenshot name="tables/columns/image/limited" alt="제한된 ImageColumn" version="3.x" />

### 남은 이미지 개수 표시하기 {#showing-the-remaining-images-count}

제한을 설정할 때 `limitedRemainingText()`를 전달하여 남은 이미지 개수를 표시할 수도 있습니다.

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText()
```

<AutoScreenshot name="tables/columns/image/limited-remaining-text" alt="남은 개수가 표시된 제한된 ImageColumn" version="3.x" />

#### 제한된 남은 텍스트를 별도로 표시하기 {#showing-the-limited-remaining-text-separately}

기본적으로, `limitedRemainingText()`는 남은 이미지의 개수를 다른 이미지 위에 숫자로 표시합니다. 만약 이미지 뒤에 숫자를 별도로 표시하고 싶다면, `isSeparate: true` 파라미터를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(isSeparate: true)
```

<AutoScreenshot name="tables/columns/image/limited-remaining-text-separately" alt="Limited image column with remaining text separately" version="3.x" />

#### 제한된 남은 텍스트 크기 커스터마이징 {#customizing-the-limited-remaining-text-size}

기본적으로 남은 텍스트의 크기는 `sm`입니다. `size` 파라미터를 사용하여 `xs`, `md`, `lg`로 커스터마이징할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('colleagues.avatar')
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(size: 'lg')
```

## 사용자 지정 속성 {#custom-attributes}

이미지의 추가 HTML 속성은 `extraImgAttributes()`를 사용하여 커스터마이즈할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('logo')
    ->extraImgAttributes(['loading' => 'lazy']),
```

현재 레코드는 `$record` 파라미터를 통해 접근할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('logo')
    ->extraImgAttributes(fn (Company $record): array => [
        'alt' => "{$record->name} 로고",
    ]),
```

## 파일 존재 여부 확인 방지 {#prevent-file-existence-checks}

테이블이 로드될 때, 이미지가 존재하는지 자동으로 감지합니다. 이 모든 과정은 백엔드에서 처리됩니다. 많은 이미지를 가진 원격 스토리지를 사용할 때는 이 과정이 시간이 오래 걸릴 수 있습니다. 이 기능을 비활성화하려면 `checkFileExistence(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Tables\Columns\ImageColumn;

ImageColumn::make('attachment')
    ->checkFileExistence(false)
```
