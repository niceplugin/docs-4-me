---
title: 이미지 항목
---
# [인포리스트.엔트리] ImageEntry

## 개요 {#overview}

이미지는 인포리스트 내에서 쉽게 표시할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
```

항목에는 스토리지 디스크의 루트 디렉터리를 기준으로 한 이미지 경로나, 이미지의 절대 URL이 포함되어야 합니다.

<AutoScreenshot name="infolists/entries/image/simple" alt="Image entry" version="3.x" />

## 이미지 디스크 관리 {#managing-the-image-disk}

기본적으로 이미지를 가져올 때 `public` 디스크가 사용됩니다. `disk()` 메서드에 사용자 지정 디스크 이름을 전달할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->disk('s3')
```

## 비공개 이미지 {#private-images}

Filament는 비공개 이미지를 렌더링하기 위해 임시 URL을 생성할 수 있습니다. `visibility()`를 `private`로 설정하면 됩니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->visibility('private')
```

## 크기 커스터마이징 {#customizing-the-size}

`width()`와 `height()`, 또는 `size()`를 사용하여 이미지 크기를 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('header_image')
    ->width(200)

ImageEntry::make('header_image')
    ->height(50)

ImageEntry::make('author.avatar')
    ->size(40)
```

## 정사각형 이미지 {#square-image}

1:1 비율로 이미지를 표시할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->height(40)
    ->square()
```

<AutoScreenshot name="infolists/entries/image/square" alt="Square image entry" version="3.x" />

## 원형 이미지 {#circular-image}

이미지를 완전히 둥글게 만들 수 있으며, 아바타 렌더링에 유용합니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('author.avatar')
    ->height(40)
    ->circular()
```

<AutoScreenshot name="infolists/entries/image/circular" alt="Circular image entry" version="3.x" />

## 기본 이미지 URL 추가 {#adding-a-default-image-url}

아직 이미지가 존재하지 않을 경우, `defaultImageUrl()` 메서드에 URL을 전달하여 플레이스홀더 이미지를 표시할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('avatar')
    ->defaultImageUrl(url('/images/placeholder.png'))
```

## 이미지 쌓기 {#stacking-images}

`stacked()`를 사용하여 여러 이미지를 겹쳐진 이미지 스택으로 표시할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
```

<AutoScreenshot name="infolists/entries/image/stacked" alt="Stacked image entry" version="3.x" />

### 쌓인 링 너비 커스터마이징 {#customizing-the-stacked-ring-width}

기본 링 너비는 `3`이지만, `0`에서 `8`까지 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
    ->ring(5)
```

### 쌓인 오버랩 커스터마이징 {#customizing-the-stacked-overlap}

기본 오버랩 값은 `4`이지만, `0`에서 `8`까지 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
    ->overlap(2)
```

## 제한 설정 {#setting-a-limit}

`limit()`을 사용하여 표시할 이미지의 최대 개수를 제한할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
    ->limit(3)
```

<AutoScreenshot name="infolists/entries/image/limited" alt="Limited image entry" version="3.x" />

### 남은 이미지 개수 표시 {#showing-the-remaining-images-count}

제한을 설정하면 `limitedRemainingText()`를 사용하여 남은 이미지 개수를 표시할 수 있습니다.

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText()
```

<AutoScreenshot name="infolists/entries/image/limited-remaining-text" alt="Limited image entry with remaining text" version="3.x" />

#### 남은 이미지 개수 텍스트를 별도로 표시하기 {#showing-the-limited-remaining-text-separately}

기본적으로 `limitedRemainingText()`는 남은 이미지 개수를 다른 이미지 위에 겹쳐진 숫자로 표시합니다. 이미지 뒤에 숫자를 별도로 표시하고 싶다면 `isSeparate: true` 파라미터를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(isSeparate: true)
```

<AutoScreenshot name="infolists/entries/image/limited-remaining-text-separately" alt="Limited image entry with remaining text separately" version="3.x" />

#### 남은 이미지 개수 텍스트 크기 커스터마이징 {#customizing-the-limited-remaining-text-size}

기본적으로 남은 텍스트의 크기는 `sm`입니다. `size` 파라미터를 사용하여 `xs`, `md`, `lg`로 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('colleagues.avatar')
    ->height(40)
    ->circular()
    ->stacked()
    ->limit(3)
    ->limitedRemainingText(size: 'lg')
```

## 커스텀 속성 {#custom-attributes}

`extraImgAttributes()`를 사용하여 이미지의 추가 HTML 속성을 커스터마이징할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('logo')
    ->extraImgAttributes([
        'alt' => 'Logo',
        'loading' => 'lazy',
    ]),
```

## 파일 존재 여부 확인 방지 {#prevent-file-existence-checks}

인포리스트가 로드될 때, 이미 존재하는지 자동으로 감지합니다. 이 모든 과정은 백엔드에서 처리됩니다. 원격 스토리지에 많은 이미지가 있을 경우, 시간이 오래 걸릴 수 있습니다. 이 기능을 비활성화하려면 `checkFileExistence(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('attachment')
    ->checkFileExistence(false)
```