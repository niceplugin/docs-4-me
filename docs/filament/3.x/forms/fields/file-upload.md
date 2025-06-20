---
title: 파일 업로드
---
# [폼.필드] FileUpload


## 개요 {#overview}

<LaracastsBanner
    title="파일 업로드"
    description="Laracasts에서 Filament로 빠르게 Laravel 개발하기 시리즈를 시청하세요 - Filament 폼에 파일 업로드 필드를 추가하는 기본 방법을 배울 수 있습니다."
    url="https://laracasts.com/series/rapid-laravel-development-with-filament/episodes/8"
    series="rapid-laravel-development"
/>

파일 업로드 필드는 [Filepond](https://pqina.nl/filepond)를 기반으로 합니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
```

<AutoScreenshot name="forms/fields/file-upload/simple" alt="파일 업로드" version="3.x" />

> Filament는 [`spatie/laravel-medialibrary`](https://github.com/spatie/laravel-medialibrary)도 지원합니다. 자세한 내용은 [플러그인 문서](https://filamentphp.com/plugins/filament-spatie-media-library)를 참고하세요.

## 저장 디스크와 디렉터리 설정 {#configuring-the-storage-disk-and-directory}

기본적으로 파일은 [설정 파일](../installation#publishing-configuration)에 정의된 저장 디스크에 공개적으로 업로드됩니다. `FILAMENT_FILESYSTEM_DISK` 환경 변수를 설정하여 이를 변경할 수도 있습니다.

> 이미지 및 기타 파일을 올바르게 미리보기하려면 FilePond가 앱과 동일한 도메인에서 파일이 제공되거나, 적절한 CORS 헤더가 있어야 합니다. `APP_URL` 환경 변수가 올바른지 확인하거나, [filesystem](https://laravel.com/docs/filesystem) 드라이버를 수정하여 올바른 URL을 설정하세요. S3와 같은 별도의 도메인에 파일을 호스팅하는 경우 CORS 헤더가 설정되어 있는지 확인하세요.

특정 필드에 대해 디스크와 디렉터리, 파일의 공개 여부를 변경하려면 `disk()`, `directory()`, `visibility()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->disk('s3')
    ->directory('form-attachments')
    ->visibility('private')
```

> 개발자가 파일이 삭제될 때 디스크에서 해당 파일을 삭제하는 책임이 있습니다. Filament는 해당 파일이 다른 곳에서 사용되는지 알지 못합니다. 이를 자동으로 처리하는 한 가지 방법은 [모델 이벤트](https://laravel.com/docs/eloquent#events)를 관찰하는 것입니다.

## 여러 파일 업로드 {#uploading-multiple-files}

여러 파일을 업로드할 수도 있습니다. 이 경우 URL이 JSON으로 저장됩니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
```

Eloquent를 사용하여 파일 URL을 저장하는 경우, 모델 속성에 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

```php
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $casts = [
        'attachments' => 'array',
    ];

    // ...
}
```

### 최대 동시 업로드 개수 제어 {#controlling-the-maximum-parallel-uploads}

`maxParallelUploads()` 메서드를 사용하여 최대 동시 업로드 개수를 제어할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->maxParallelUploads(1)
```

이렇게 하면 동시 업로드 개수가 `1`로 제한됩니다. 설정하지 않으면 [FilePond 기본값](https://pqina.nl/filepond/docs/api/instance/properties/#core-properties)인 `2`가 사용됩니다.

## 파일 이름 제어 {#controlling-file-names}

기본적으로 새로 업로드된 파일에는 무작위 파일 이름이 생성됩니다. 이는 기존 파일과의 충돌을 방지하기 위함입니다.

### 파일 이름 제어의 보안상 주의사항 {#security-implications-of-controlling-file-names}

`preserveFilenames()` 또는 `getUploadedFileNameForStorageUsing()` 메서드를 사용하기 전에 보안상 주의사항을 반드시 숙지하세요. 사용자가 자신의 파일 이름으로 파일을 업로드할 수 있도록 허용하면, 악의적인 파일 업로드로 악용될 수 있습니다. **이것은 [`acceptedFileTypes()`](#file-type-validation) 메서드를 사용하여 업로드 가능한 파일 유형을 제한하더라도 해당됩니다.** 이 메서드는 Laravel의 `mimetypes` 규칙을 사용하며, 파일의 확장자가 아닌 mime type만 검증하므로 조작될 수 있습니다.

이 문제는 `TemporaryUploadedFile` 객체의 `getClientOriginalName()` 메서드와 관련이 있으며, `preserveFilenames()` 메서드가 이를 사용합니다. 기본적으로 Livewire는 업로드된 각 파일에 무작위 파일 이름을 생성하고, 파일의 mime type을 사용하여 확장자를 결정합니다.

이 메서드들을 **`local` 또는 `public` 파일 시스템 디스크와 함께 사용할 경우**, 공격자가 속인 mime type의 PHP 파일을 업로드하면 원격 코드 실행에 취약해질 수 있습니다. **S3 디스크를 사용할 경우 이 공격 벡터로부터 보호됩니다.** S3는 로컬 저장소에서 파일을 제공할 때처럼 PHP 파일을 실행하지 않습니다.

`local` 또는 `public` 디스크를 사용하는 경우, [`storeFileNamesIn()` 메서드](#storing-original-file-names-independently)를 사용하여 원본 파일 이름을 데이터베이스의 별도 컬럼에 저장하고, 파일 시스템에는 무작위로 생성된 파일 이름을 유지하는 것을 고려해야 합니다. 이렇게 하면 파일 시스템의 보안을 유지하면서도 사용자에게 원본 파일 이름을 표시할 수 있습니다.

이 보안 문제 외에도, 사용자가 자신의 파일 이름으로 파일을 업로드할 수 있도록 허용하면 기존 파일과의 충돌이 발생할 수 있고, 저장소 관리가 어려워질 수 있습니다. 특정 디렉터리로 범위를 지정하지 않으면 사용자가 동일한 이름의 파일을 업로드하여 다른 사용자의 파일을 덮어쓸 수 있으므로, 이러한 기능은 반드시 신뢰할 수 있는 사용자에게만 허용해야 합니다.

### 원본 파일 이름 유지 {#preserving-original-file-names}

> 중요: 이 기능을 사용하기 전에 [보안상 주의사항](#security-implications-of-controlling-file-names)을 반드시 읽어보세요.

업로드된 파일의 원본 파일 이름을 유지하려면 `preserveFilenames()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->preserveFilenames()
```

### 커스텀 파일 이름 생성 {#generating-custom-file-names}

> 중요: 이 기능을 사용하기 전에 [보안상 주의사항](#security-implications-of-controlling-file-names)을 반드시 읽어보세요.

`getUploadedFileNameForStorageUsing()` 메서드를 사용하여 파일 이름 생성 방식을 완전히 커스터마이즈할 수 있습니다. 업로드된 `$file`을 기반으로 클로저에서 문자열을 반환하세요:

```php
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

FileUpload::make('attachment')
    ->getUploadedFileNameForStorageUsing(
        fn (TemporaryUploadedFile $file): string => (string) str($file->getClientOriginalName())
            ->prepend('custom-prefix-'),
    )
```

### 원본 파일 이름을 별도로 저장 {#storing-original-file-names-independently}

`storeFileNamesIn()` 메서드를 사용하여 무작위로 생성된 파일 이름을 유지하면서도 원본 파일 이름을 저장할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->storeFileNamesIn('attachment_file_names')
```

이제 `attachment_file_names`에 업로드된 파일의 원본 파일 이름이 저장되므로, 폼 제출 시 데이터베이스에 저장할 수 있습니다. `multiple()` 파일을 업로드하는 경우, 이 Eloquent 모델 속성에도 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다.

## 아바타 모드 {#avatar-mode}

`avatar()` 메서드를 사용하여 파일 업로드 필드에 아바타 모드를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('avatar')
    ->avatar()
```

이렇게 하면 이미지 파일만 업로드할 수 있으며, 업로드된 이미지는 아바타에 적합한 컴팩트한 원형 레이아웃으로 표시됩니다.

이 기능은 [원형 크로퍼](#allowing-users-to-crop-images-as-a-circle)와 함께 사용하면 좋습니다.

## 이미지 에디터 {#image-editor}

`imageEditor()` 메서드를 사용하여 파일 업로드 필드에 이미지 에디터를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
```

이미지를 업로드한 후 연필 아이콘을 클릭하여 에디터를 열 수 있습니다. 기존 이미지의 연필 아이콘을 클릭해도 에디터가 열리며, 저장 시 이미지를 제거하고 다시 업로드합니다.

### 사용자가 이미지 비율로 자르기 허용 {#allowing-users-to-crop-images-to-aspect-ratios}

`imageEditorAspectRatios()` 메서드를 사용하여 사용자가 특정 비율로 이미지를 자를 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorAspectRatios([
        '16:9',
        '4:3',
        '1:1',
    ])
```

옵션으로 `null`을 전달하면 사용자가 비율 없이 "자유 자르기"를 선택할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorAspectRatios([
        null,
        '16:9',
        '4:3',
        '1:1',
    ])
```

### 이미지 에디터 모드 설정 {#setting-the-image-editors-mode}

`imageEditorMode()` 메서드를 사용하여 이미지 에디터의 모드를 변경할 수 있습니다. 이 메서드는 `1`, `2`, `3` 중 하나를 받으며, 각 옵션은 [Cropper.js 문서](https://github.com/fengyuanchen/cropperjs#viewmode)에 설명되어 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorMode(2)
```

### 이미지 에디터의 빈 공간 색상 커스터마이즈 {#customizing-the-image-editors-empty-fill-color}

기본적으로 이미지 에디터는 이미지 주변의 빈 공간을 투명하게 만듭니다. `imageEditorEmptyFillColor()` 메서드를 사용하여 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorEmptyFillColor('#000000')
```

### 이미지 에디터 뷰포트 크기 설정 {#setting-the-image-editors-viewport-size}

`imageEditorViewportWidth()`와 `imageEditorViewportHeight()` 메서드를 사용하여 이미지 에디터의 뷰포트 크기를 변경할 수 있습니다. 이 메서드는 기기 크기에 맞는 비율을 생성합니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorViewportWidth('1920')
    ->imageEditorViewportHeight('1080')
```

### 사용자가 이미지를 원형으로 자르기 허용 {#allowing-users-to-crop-images-as-a-circle}

`circleCropper()` 메서드를 사용하여 사용자가 이미지를 원형으로 자를 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->avatar()
    ->imageEditor()
    ->circleCropper()
```

이 기능은 [`avatar()` 메서드](#avatar-mode)와 함께 사용하면 이미지를 컴팩트한 원형 레이아웃으로 렌더링합니다.

### 에디터 없이 이미지 자르기 및 리사이즈 {#cropping-and-resizing-images-without-the-editor}

Filepond를 사용하면 별도의 에디터 없이 업로드 전에 이미지를 자르고 리사이즈할 수 있습니다. `imageCropAspectRatio()`, `imageResizeTargetHeight()`, `imageResizeTargetWidth()` 메서드를 사용하여 이 동작을 커스터마이즈할 수 있습니다. 이 메서드들이 효과를 발휘하려면 `imageResizeMode()`를 [`force`, `cover`, `contain`](https://pqina.nl/filepond/docs/api/plugins/image-resize) 중 하나로 설정해야 합니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageResizeMode('cover')
    ->imageCropAspectRatio('16:9')
    ->imageResizeTargetWidth('1920')
    ->imageResizeTargetHeight('1080')
```

## 파일 업로드 영역의 외관 변경 {#altering-the-appearance-of-the-file-upload-area}

Filepond 컴포넌트의 전반적인 외관을 변경할 수도 있습니다. 이 메서드들의 사용 가능한 옵션은 [Filepond 웹사이트](https://pqina.nl/filepond/docs/api/instance/properties/#styles)에서 확인할 수 있습니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->imagePreviewHeight('250')
    ->loadingIndicatorPosition('left')
    ->panelAspectRatio('2:1')
    ->panelLayout('integrated')
    ->removeUploadedFileButtonPosition('right')
    ->uploadButtonPosition('left')
    ->uploadProgressIndicatorPosition('left')
```

### 파일을 그리드로 표시 {#displaying-files-in-a-grid}

[Filepond `grid` 레이아웃](https://pqina.nl/filepond/docs/api/style/#grid-layout)을 사용하려면 `panelLayout()`을 설정하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->panelLayout('grid')
```

## 파일 순서 변경 {#reordering-files}

`reorderable()` 메서드를 사용하여 사용자가 업로드된 파일의 순서를 변경할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->reorderable()
```

이 메서드를 사용할 때, FilePond는 새로 업로드된 파일을 목록의 끝이 아닌 처음에 추가할 수 있습니다. 이를 수정하려면 `appendFiles()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->reorderable()
    ->appendFiles()
```

## 새 탭에서 파일 열기 {#opening-files-in-a-new-tab}

`openable()` 메서드를 사용하여 각 파일을 새 탭에서 열 수 있는 버튼을 추가할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->openable()
```

## 파일 다운로드 {#downloading-files}

각 파일에 다운로드 버튼을 추가하려면 `downloadable()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->downloadable()
```

## 파일 미리보기 {#previewing-files}

기본적으로 일부 파일 유형은 FilePond에서 미리보기할 수 있습니다. 모든 파일에 대해 미리보기를 비활성화하려면 `previewable(false)` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->previewable(false)
```

## 폼 제출 시 파일을 복사하지 않고 이동 {#moving-files-instead-of-copying-when-the-form-is-submitted}

기본적으로 파일은 처음에 Livewire의 임시 저장 디렉터리에 업로드된 후, 폼이 제출되면 대상 디렉터리로 복사됩니다. 파일을 복사하지 않고 이동하려면, 임시 업로드가 영구 파일과 동일한 디스크에 저장되어 있어야 하며, `moveFiles()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->moveFiles()
```

## 파일을 영구적으로 저장하지 않기 {#preventing-files-from-being-stored-permanently}

폼이 제출될 때 파일이 영구적으로 저장되지 않도록 하려면 `storeFiles(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->storeFiles(false)
```

폼이 제출되면, 영구적으로 저장된 파일 경로 대신 임시 파일 업로드 객체가 반환됩니다. 이는 임시 파일(예: 임포트된 CSV 등)에 적합합니다.

이미지, 비디오, 오디오 파일의 경우 [`previewable(false)`](#previewing-files)를 사용하지 않으면 폼의 미리보기에서 저장된 파일 이름이 표시되지 않습니다. 이는 FilePond 미리보기 플러그인의 한계 때문입니다.

## EXIF 데이터로 이미지 방향 맞추기 {#orienting-images-from-their-exif-data}

기본적으로 FilePond는 EXIF 데이터를 기반으로 이미지를 자동으로 방향을 맞춥니다. 이 동작을 비활성화하려면 `orientImagesFromExif(false)` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->orientImagesFromExif(false)
```

## 파일 제거 버튼 숨기기 {#hiding-the-remove-file-button}

`deletable(false)`를 사용하여 업로드된 파일 제거 버튼을 숨길 수도 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->deletable(false)
```

## 파일 붙여넣기 방지 {#preventing-pasting-files}

`pasteable(false)` 메서드를 사용하여 클립보드를 통한 파일 붙여넣기 기능을 비활성화할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->pasteable(false)
```

## 파일 정보 가져오기 방지 {#prevent-file-information-fetching}

폼이 로드될 때, 파일이 존재하는지, 크기, 파일 유형 등을 자동으로 감지합니다. 이는 모두 백엔드에서 처리됩니다. 원격 저장소에 많은 파일이 있을 경우 시간이 오래 걸릴 수 있습니다. 이 기능을 비활성화하려면 `fetchFileInformation(false)` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->fetchFileInformation(false)
```

## 업로드 중 메시지 커스터마이즈 {#customizing-the-uploading-message}

`uploadingMessage()` 메서드를 사용하여 폼의 제출 버튼에 표시되는 업로드 중 메시지를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->uploadingMessage('첨부 파일 업로드 중...')
```

## 파일 업로드 검증 {#file-upload-validation}

[검증](../validation) 페이지에 나열된 모든 규칙 외에도, 파일 업로드에 특화된 추가 규칙이 있습니다.

Filament는 Livewire를 기반으로 하며 Livewire의 파일 업로드 시스템을 사용하므로, `config/livewire.php` 파일의 기본 Livewire 파일 업로드 검증 규칙도 참고해야 합니다. 이 파일에서 12MB 파일 크기 제한도 제어합니다.

### 파일 유형 검증 {#file-type-validation}

`acceptedFileTypes()` 메서드에 MIME 타입 배열을 전달하여 업로드할 수 있는 파일 유형을 제한할 수 있습니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('document')
    ->acceptedFileTypes(['application/pdf'])
```

모든 이미지 MIME 타입을 허용하려면 `image()` 메서드를 단축키로 사용할 수도 있습니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
```

#### 커스텀 MIME 타입 매핑 {#custom-mime-type-mapping}

일부 파일 형식은 업로드 시 브라우저에서 올바르게 인식되지 않을 수 있습니다. Filament는 `mimeTypeMap()` 메서드를 사용하여 특정 파일 확장자에 대한 MIME 타입을 수동으로 정의할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('designs')
    ->acceptedFileTypes([
        'x-world/x-3dmf',
        'application/vnd.sketchup.skp',
    ])
    ->mimeTypeMap([
        '3dm' => 'x-world/x-3dmf',
        'skp' => 'application/vnd.sketchup.skp',
    ]);
```

### 파일 크기 검증 {#file-size-validation}

업로드할 파일의 크기를 KB 단위로 제한할 수도 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->minSize(512)
    ->maxSize(1024)
```

#### 대용량 파일 업로드 {#uploading-large-files}

대용량 파일 업로드 시, 브라우저 콘솔에서 422 상태로 HTTP 요청이 실패하는 등의 문제가 발생한다면 설정을 조정해야 할 수 있습니다.

서버의 `php.ini` 파일에서 최대 파일 크기를 늘리면 문제가 해결될 수 있습니다:

```ini
post_max_size = 120M
upload_max_filesize = 120M
```

Livewire도 업로드 전에 파일 크기를 검증합니다. Livewire 설정 파일을 발행하려면 다음을 실행하세요:

```bash
php artisan livewire:publish --config
```

[최대 업로드 크기는 `temporary_file_upload`의 `rules` 키](https://livewire.laravel.com/docs/uploads#global-validation)에서 조정할 수 있습니다. 이때 KB 단위로 입력하며, 120MB는 122880KB입니다:

```php
'temporary_file_upload' => [
    // ...
    'rules' => ['required', 'file', 'max:122880'],
    // ...
],
```

### 파일 개수 검증 {#number-of-files-validation}

`minFiles()`와 `maxFiles()` 메서드를 사용하여 업로드할 수 있는 파일 개수를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->minFiles(2)
    ->maxFiles(5)
```
