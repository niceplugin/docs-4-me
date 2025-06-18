---
title: FileUpload
---
# [폼.필드] FileUpload


## 개요 {#overview}

<LaracastsBanner
    title="파일 업로드"
    description="Laracasts의 Rapid Laravel Development with Filament 시리즈를 시청하세요. Filament 폼에 파일 업로드 필드를 추가하는 기본 방법을 배울 수 있습니다."
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

## 저장소 디스크 및 디렉터리 설정 {#configuring-the-storage-disk-and-directory}

기본적으로 파일은 [설정 파일](../installation#publishing-configuration)에 정의된 저장소 디스크에 공개적으로 업로드됩니다. `FILAMENT_FILESYSTEM_DISK` 환경 변수를 설정하여 이를 변경할 수도 있습니다.

> 이미지 및 기타 파일을 올바르게 미리보기하려면 FilePond가 앱과 동일한 도메인에서 파일이 제공되거나, 적절한 CORS 헤더가 있어야 합니다. `APP_URL` 환경 변수가 올바른지 확인하거나, [filesystem](https://laravel.com/docs/filesystem) 드라이버를 수정하여 올바른 URL을 설정하세요. S3와 같은 별도의 도메인에 파일을 호스팅하는 경우 CORS 헤더가 설정되어 있는지 확인하세요.

특정 필드에 대해 디스크와 디렉터리, 파일의 공개 범위를 변경하려면 `disk()`, `directory()`, `visibility()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->disk('s3')
    ->directory('form-attachments')
    ->visibility('private')
```

> 파일이 삭제될 경우, Filament는 해당 파일이 다른 곳에서 사용되는지 알 수 없으므로, 개발자가 직접 디스크에서 파일을 삭제해야 합니다. 이를 자동으로 처리하는 한 가지 방법은 [모델 이벤트](https://laravel.com/docs/eloquent#events)를 관찰하는 것입니다.

## 여러 파일 업로드하기 {#uploading-multiple-files}

여러 파일을 업로드할 수도 있습니다. 이 경우 URL이 JSON으로 저장됩니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
```

파일 URL을 Eloquent를 사용해 저장하는 경우, 모델 속성에 `array` [캐스트](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)를 추가해야 합니다:

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

### 최대 동시 업로드 수 제어하기 {#controlling-the-maximum-parallel-uploads}

`maxParallelUploads()` 메서드를 사용하여 최대 동시 업로드 수를 제어할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->maxParallelUploads(1)
```

이렇게 하면 동시 업로드 수가 `1`로 제한됩니다. 설정하지 않으면 [기본 FilePond 값](https://pqina.nl/filepond/docs/api/instance/properties/#core-properties)인 `2`가 사용됩니다.

## 파일 이름 제어하기 {#controlling-file-names}

기본적으로, 새로 업로드된 파일에는 무작위 파일 이름이 생성됩니다. 이는 기존 파일과의 충돌이 발생하지 않도록 하기 위함입니다.

### 파일 이름 제어의 보안상 영향 {#security-implications-of-controlling-file-names}

`preserveFilenames()` 또는 `getUploadedFileNameForStorageUsing()` 메서드를 사용하기 전에, 보안상 영향을 반드시 인지해야 합니다. 사용자가 직접 파일 이름을 지정하여 파일을 업로드할 수 있도록 허용하면, 이를 악용해 악성 파일을 업로드할 수 있는 방법이 존재합니다. **이것은 [`acceptedFileTypes()`](#file-type-validation) 메서드를 사용하여 업로드 가능한 파일 유형을 제한하더라도 마찬가지입니다.** 이 메서드는 Laravel의 `mimetypes` 규칙을 사용하기 때문에 파일의 확장자가 아닌 mime type만을 검증하며, mime type은 조작될 수 있습니다.

이 문제는 특히 `TemporaryUploadedFile` 객체의 `getClientOriginalName()` 메서드와 관련이 있으며, `preserveFilenames()` 메서드는 이를 사용합니다. 기본적으로 Livewire는 업로드된 각 파일에 대해 무작위 파일 이름을 생성하고, 파일의 mime type을 사용하여 파일 확장자를 결정합니다.

이러한 메서드를 **`local` 또는 `public` 파일 시스템 디스크와 함께 사용할 경우**, 공격자가 속임수 mime type을 가진 PHP 파일을 업로드하면 원격 코드 실행에 취약해질 수 있습니다. **S3 디스크를 사용할 경우에는 이 특정 공격 벡터로부터 보호받을 수 있습니다.** S3는 로컬 스토리지에서 파일을 제공할 때처럼 PHP 파일을 실행하지 않기 때문입니다.

`local` 또는 `public` 디스크를 사용하는 경우, [`storeFileNamesIn()` 메서드](#storing-original-file-names-independently)를 사용하여 원본 파일 이름을 데이터베이스의 별도 컬럼에 저장하고, 파일 시스템에는 무작위로 생성된 파일 이름을 유지하는 방식을 고려해야 합니다. 이렇게 하면 파일 시스템의 보안을 유지하면서도 사용자에게 원본 파일 이름을 표시할 수 있습니다.

이 보안 문제 외에도, 사용자가 직접 파일 이름을 지정하여 업로드할 수 있도록 허용하면 기존 파일과의 충돌이 발생할 수 있으며, 스토리지 관리가 어려워질 수 있습니다. 특정 디렉터리로 범위를 지정하지 않으면 사용자가 동일한 이름의 파일을 업로드하여 다른 사용자의 파일을 덮어쓸 수 있으므로, 이러한 기능은 반드시 신뢰할 수 있는 사용자에게만 제공해야 합니다.

### 원본 파일 이름 유지 {#preserving-original-file-names}

> 중요: 이 기능을 사용하기 전에 [파일 이름 제어의 보안 영향](#security-implications-of-controlling-file-names)을 반드시 읽어보시기 바랍니다.

업로드된 파일의 원본 파일 이름을 유지하려면 `preserveFilenames()` 메서드를 사용하세요:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->preserveFilenames()
```

### 사용자 지정 파일 이름 생성 {#generating-custom-file-names}

> 중요: 이 기능을 사용하기 전에 [파일 이름 제어의 보안 영향](#security-implications-of-controlling-file-names)을 반드시 읽어보시기 바랍니다.

`getUploadedFileNameForStorageUsing()` 메서드를 사용하여 파일 이름이 생성되는 방식을 완전히 사용자 지정할 수 있습니다. 업로드된 `$file`을 기반으로 클로저에서 문자열을 반환하면 됩니다:

```php
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

FileUpload::make('attachment')
    ->getUploadedFileNameForStorageUsing(
        fn (TemporaryUploadedFile $file): string => (string) str($file->getClientOriginalName())
            ->prepend('custom-prefix-'),
    )
```

### 원본 파일 이름을 별도로 저장하기 {#storing-original-file-names-independently}

`storeFileNamesIn()` 메서드를 사용하면 무작위로 생성된 파일 이름을 유지하면서도 원본 파일 이름을 저장할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->storeFileNamesIn('attachment_file_names')
```

이제 `attachment_file_names`에는 업로드한 파일의 원본 파일 이름이 저장되므로, 폼이 제출될 때 이를 데이터베이스에 저장할 수 있습니다. `multiple()` 파일 업로드를 사용하는 경우, 해당 Eloquent 모델 속성에 [array 캐스팅](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)도 추가해야 합니다.

## 아바타 모드 {#avatar-mode}

`avatar()` 메서드를 사용하여 파일 업로드 필드에 아바타 모드를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('avatar')
    ->avatar()
```

이렇게 하면 이미지 파일만 업로드할 수 있으며, 업로드된 이미지는 아바타에 적합한 컴팩트한 원형 레이아웃으로 표시됩니다.

이 기능은 [원형 크로퍼](#allowing-users-to-crop-images-as-a-circle)와 함께 사용하면 더욱 좋습니다.

## 이미지 편집기 {#image-editor}

`imageEditor()` 메서드를 사용하여 파일 업로드 필드에 이미지 편집기를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
```

이미지를 업로드한 후 연필 아이콘을 클릭하면 편집기를 열 수 있습니다. 기존 이미지의 연필 아이콘을 클릭해도 편집기를 열 수 있으며, 저장 시 이미지를 제거하고 다시 업로드합니다.

### 사용자가 이미지의 종횡비를 맞춰 자르도록 허용하기 {#allowing-users-to-crop-images-to-aspect-ratios}

`imageEditorAspectRatios()` 메서드를 사용하여 사용자가 특정 종횡비로 이미지를 자를 수 있도록 허용할 수 있습니다:

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

옵션으로 `null`을 전달하면 사용자가 종횡비를 지정하지 않고 "자유 자르기"를 선택할 수 있도록 할 수도 있습니다:

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

### 이미지 편집기 모드 설정하기 {#setting-the-image-editors-mode}

`imageEditorMode()` 메서드를 사용하여 이미지 편집기의 모드를 변경할 수 있습니다. 이 메서드는 `1`, `2`, `3` 중 하나를 인자로 받습니다. 각 옵션에 대한 설명은 [Cropper.js 문서](https://github.com/fengyuanchen/cropperjs#viewmode)에서 확인할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorMode(2)
```

### 이미지 에디터의 빈 공간 채우기 색상 커스터마이즈하기 {#customizing-the-image-editors-empty-fill-color}

기본적으로 이미지 에디터는 이미지 주변의 빈 공간을 투명하게 만듭니다. `imageEditorEmptyFillColor()` 메서드를 사용하여 이를 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorEmptyFillColor('#000000')
```

### 이미지 편집기 뷰포트 크기 설정하기 {#setting-the-image-editors-viewport-size}

`imageEditorViewportWidth()`와 `imageEditorViewportHeight()` 메서드를 사용하여 이미지 편집기의 뷰포트 크기를 변경할 수 있습니다. 이 메서드들은 다양한 기기 크기에서 사용할 종횡비를 생성합니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorViewportWidth('1920')
    ->imageEditorViewportHeight('1080')
```

### 사용자가 이미지를 원형으로 자르도록 허용하기 {#allowing-users-to-crop-images-as-a-circle}

`circleCropper()` 메서드를 사용하여 사용자가 이미지를 원형으로 자를 수 있도록 허용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->avatar()
    ->imageEditor()
    ->circleCropper()
```

이 기능은 이미지를 컴팩트한 원형 레이아웃으로 렌더링하는 [`avatar()` 메서드](#avatar-mode)와 완벽하게 어울립니다.

### 에디터 없이 이미지 자르기 및 크기 조정 {#cropping-and-resizing-images-without-the-editor}

Filepond를 사용하면 별도의 에디터 없이 이미지를 업로드하기 전에 자르거나 크기를 조정할 수 있습니다. 이 동작은 `imageCropAspectRatio()`, `imageResizeTargetHeight()`, `imageResizeTargetWidth()` 메서드를 사용하여 커스터마이즈할 수 있습니다. 이러한 메서드가 효과를 발휘하려면 `imageResizeMode()`를 반드시 설정해야 하며, 값은 [`force`, `cover`, `contain`](https://pqina.nl/filepond/docs/api/plugins/image-resize) 중 하나여야 합니다.

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

Filepond 컴포넌트의 전반적인 외관도 변경할 수 있습니다. 이러한 메서드에서 사용할 수 있는 옵션은 [Filepond 웹사이트](https://pqina.nl/filepond/docs/api/instance/properties/#styles)에서 확인할 수 있습니다.

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

### 그리드에서 파일 표시하기 {#displaying-files-in-a-grid}

`panelLayout()`을 설정하여 [Filepond `grid` 레이아웃](https://pqina.nl/filepond/docs/api/style/#grid-layout)을 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->panelLayout('grid')
```

## 파일 순서 변경 {#reordering-files}

`reorderable()` 메서드를 사용하여 사용자가 업로드된 파일의 순서를 변경할 수 있도록 할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->reorderable()
```

이 메서드를 사용할 때, FilePond는 새로 업로드된 파일을 목록의 끝이 아닌 시작 부분에 추가할 수 있습니다. 이를 해결하려면 `appendFiles()` 메서드를 사용하세요:

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

각 파일에 다운로드 버튼을 추가하고 싶다면, `downloadable()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->downloadable()
```

## 파일 미리보기 {#previewing-files}

기본적으로 일부 파일 유형은 FilePond에서 미리볼 수 있습니다. 모든 파일에 대해 미리보기를 비활성화하려면 `previewable(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->previewable(false)
```

## 폼 제출 시 파일을 복사하는 대신 이동하기 {#moving-files-instead-of-copying-when-the-form-is-submitted}

기본적으로 파일은 처음에 Livewire의 임시 저장소 디렉터리에 업로드된 후, 폼이 제출될 때 대상 디렉터리로 복사됩니다. 만약 파일을 복사하는 대신 이동하고 싶다면, 임시 업로드와 영구 파일이 동일한 디스크에 저장되어 있어야 하며, 이 경우 `moveFiles()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->moveFiles()
```

## 파일이 영구적으로 저장되는 것을 방지하기 {#preventing-files-from-being-stored-permanently}

폼이 제출될 때 파일이 영구적으로 저장되는 것을 방지하고 싶다면, `storeFiles(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->storeFiles(false)
```

폼이 제출되면, 영구적으로 저장된 파일 경로 대신 임시 파일 업로드 객체가 반환됩니다. 이는 임시 파일(예: 가져온 CSV 파일) 등에 적합합니다.

이미지, 비디오, 오디오 파일의 경우 [`previewable(false)`](#previewing-files) 옵션을 사용하지 않으면 폼의 미리보기에서 저장된 파일 이름이 표시되지 않습니다. 이는 FilePond 미리보기 플러그인의 한계 때문입니다.

## EXIF 데이터로부터 이미지 방향 맞추기 {#orienting-images-from-their-exif-data}

기본적으로 FilePond는 이미지의 EXIF 데이터를 기반으로 이미지를 자동으로 방향에 맞게 조정합니다. 이 동작을 비활성화하려면 `orientImagesFromExif(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->orientImagesFromExif(false)
```

## 업로드된 파일 삭제 버튼 숨기기 {#hiding-the-remove-file-button}

`deletable(false)`을 사용하여 업로드된 파일 삭제 버튼을 숨길 수도 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->deletable(false)
```

## 파일 붙여넣기 방지 {#preventing-pasting-files}

클립보드를 통해 파일을 붙여넣는 기능을 `pasteable(false)` 메서드를 사용하여 비활성화할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->pasteable(false)
```

## 파일 정보 가져오기 방지 {#prevent-file-information-fetching}

폼이 로드되는 동안, 파일이 존재하는지, 크기가 얼마인지, 파일 유형이 무엇인지가 자동으로 감지됩니다. 이 모든 과정은 백엔드에서 처리됩니다. 파일이 많은 원격 스토리지를 사용할 때는 이 과정이 시간이 오래 걸릴 수 있습니다. 이 기능을 비활성화하려면 `fetchFileInformation(false)` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->fetchFileInformation(false)
```

## 업로드 메시지 커스터마이징 {#customizing-the-uploading-message}

폼의 제출 버튼에 표시되는 업로드 메시지는 `uploadingMessage()` 메서드를 사용하여 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->uploadingMessage('첨부 파일을 업로드하는 중...')
```

## 파일 업로드 검증 {#file-upload-validation}

[검증](../validation) 페이지에 나열된 모든 규칙뿐만 아니라, 파일 업로드에만 적용되는 추가 규칙들이 있습니다.

Filament는 Livewire를 기반으로 하며 Livewire의 파일 업로드 시스템을 사용하므로, `config/livewire.php` 파일에 있는 기본 Livewire 파일 업로드 검증 규칙도 참고해야 합니다. 이 설정은 12MB 파일 크기 제한도 제어합니다.

### 파일 유형 검증 {#file-type-validation}

`acceptedFileTypes()` 메서드를 사용하여 업로드할 수 있는 파일 유형을 제한할 수 있으며, MIME 타입의 배열을 전달합니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('document')
    ->acceptedFileTypes(['application/pdf'])
```

모든 이미지 MIME 타입을 허용하려면 `image()` 메서드를 간단하게 사용할 수도 있습니다.

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
```

#### 사용자 지정 MIME 타입 매핑 {#custom-mime-type-mapping}

일부 파일 형식은 파일 업로드 시 브라우저에서 올바르게 인식되지 않을 수 있습니다. Filament에서는 `mimeTypeMap()` 메서드를 사용하여 특정 파일 확장자에 대한 MIME 타입을 수동으로 정의할 수 있습니다:

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

업로드된 파일의 크기를 킬로바이트 단위로 제한할 수도 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->minSize(512)
    ->maxSize(1024)
```

#### 대용량 파일 업로드 {#uploading-large-files}

대용량 파일을 업로드할 때, 브라우저 콘솔에서 HTTP 요청이 422 상태 코드로 실패하는 등의 문제가 발생한다면, 설정을 조정해야 할 수 있습니다.

서버의 `php.ini` 파일에서 최대 파일 크기를 늘리면 문제가 해결될 수 있습니다:

```ini
post_max_size = 120M
upload_max_filesize = 120M
```

Livewire는 업로드 전에 파일 크기도 검증합니다. Livewire 설정 파일을 발행하려면 다음 명령어를 실행하세요:

```bash
php artisan livewire:publish --config
```

[최대 업로드 크기는 `temporary_file_upload`의 `rules` 키에서 조정할 수 있습니다](https://livewire.laravel.com/docs/uploads#global-validation). 이때 규칙에서는 KB 단위를 사용하며, 120MB는 122880KB입니다:

```php
'temporary_file_upload' => [
    // ...
    'rules' => ['required', 'file', 'max:122880'],
    // ...
],
```

### 파일 개수 유효성 검사 {#number-of-files-validation}

업로드할 수 있는 파일의 개수는 `minFiles()`와 `maxFiles()` 메서드를 사용하여 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->minFiles(2)
    ->maxFiles(5)
```
