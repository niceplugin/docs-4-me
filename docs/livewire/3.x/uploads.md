# [기능] 파일 업로드
Livewire는 컴포넌트 내에서 파일 업로드를 강력하게 지원합니다.

먼저, 컴포넌트에 `WithFileUploads` 트레이트를 추가하세요. 이 트레이트를 추가하면, 파일 입력 필드에도 다른 입력 타입과 마찬가지로 `wire:model`을 사용할 수 있으며, 나머지는 Livewire가 알아서 처리해줍니다.

아래는 사진 업로드를 처리하는 간단한 컴포넌트 예시입니다:
```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhoto extends Component
{
    use WithFileUploads;

    #[Validate('image|max:1024')] // 최대 1MB
    public $photo;

    public function save()
    {
        $this->photo->store(path: 'photos');
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photo">

    @error('photo') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

> [!warning] "upload" 메서드는 예약어입니다
> 위 예시에서 "upload" 대신 "save" 메서드를 사용한 것을 주목하세요. 이는 흔히 발생하는 실수입니다. "upload"라는 용어는 Livewire에서 예약어이므로, 컴포넌트의 메서드나 프로퍼티 이름으로 사용할 수 없습니다.

개발자 입장에서는 파일 입력을 다루는 것이 다른 입력 타입을 다루는 것과 다르지 않습니다. `<input>` 태그에 `wire:model`을 추가하면 나머지는 Livewire가 처리해줍니다.

하지만, Livewire에서 파일 업로드가 동작하기 위해 내부적으로 더 많은 일이 일어납니다. 사용자가 업로드할 파일을 선택할 때 어떤 일이 일어나는지 살펴보면 다음과 같습니다:

1. 새 파일이 선택되면, Livewire의 JavaScript가 서버의 컴포넌트에 임시 "서명된" 업로드 URL을 요청합니다.
2. URL을 받으면, JavaScript가 해당 서명된 URL로 실제 "업로드"를 수행하여, Livewire가 지정한 임시 디렉터리에 파일을 저장하고, 새 임시 파일의 고유 해시 ID를 반환합니다.
3. 파일이 업로드되고 고유 해시 ID가 생성되면, Livewire의 JavaScript가 서버의 컴포넌트에 마지막 요청을 보내, 원하는 public 프로퍼티를 새 임시 파일로 "설정"하도록 알립니다.
4. 이제 public 프로퍼티(이 경우 `$photo`)가 임시 파일 업로드로 설정되어, 언제든 저장하거나 검증할 준비가 완료됩니다.

## 업로드된 파일 저장하기 {#storing-uploaded-files}

이전 예제는 가장 기본적인 저장 시나리오를 보여줍니다: 임시로 업로드된 파일을 애플리케이션의 기본 파일 시스템 디스크의 "photos" 디렉터리로 이동하는 것입니다.

하지만 저장된 파일의 파일명을 커스터마이즈하거나, 파일을 저장할 특정 스토리지 "디스크"(예: S3)를 지정하고 싶을 수도 있습니다.

> [!tip] 원본 파일명
> 임시 업로드의 원본 파일명은 `->getClientOriginalName()` 메서드를 호출하여 접근할 수 있습니다.

Livewire는 업로드된 파일을 저장할 때 Laravel이 사용하는 동일한 API를 따르므로, [Laravel의 파일 업로드 문서](https://laravel.com/docs/filesystem#file-uploads)를 참고하셔도 좋습니다. 하지만 아래에는 몇 가지 일반적인 저장 시나리오와 예시를 소개합니다:

```php
public function save()
{
    // 기본 파일 시스템 디스크의 "photos" 디렉터리에 파일 저장
    $this->photo->store(path: 'photos');

    // 설정된 "s3" 디스크의 "photos" 디렉터리에 파일 저장
    $this->photo->store(path: 'photos', options: 's3');

    // "photos" 디렉터리에 "avatar.png"라는 파일명으로 저장
    $this->photo->storeAs(path: 'photos', name: 'avatar');

    // 설정된 "s3" 디스크의 "photos" 디렉터리에 "avatar.png"라는 파일명으로 저장
    $this->photo->storeAs(path: 'photos', name: 'avatar', options: 's3');

    // 설정된 "s3" 디스크의 "photos" 디렉터리에 "public" 가시성으로 파일 저장
    $this->photo->storePublicly(path: 'photos', options: 's3');

    // 설정된 "s3" 디스크의 "photos" 디렉터리에 "avatar.png"라는 이름과 "public" 가시성으로 파일 저장
    $this->photo->storePubliclyAs(path: 'photos', name: 'avatar', options: 's3');
}
```

## 여러 파일 처리하기 {#handling-multiple-files}

Livewire는 `<input>` 태그에 `multiple` 속성이 있는지 자동으로 감지하여 여러 파일 업로드를 처리합니다.

예를 들어, 아래는 `$photos`라는 배열 속성을 가진 컴포넌트입니다. 폼의 파일 입력에 `multiple`을 추가하면, Livewire는 새 파일들을 이 배열에 자동으로 추가합니다:

```php
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhotos extends Component
{
    use WithFileUploads;

    #[Validate(['photos.*' => 'image|max:1024'])]
    public $photos = [];

    public function save()
    {
        foreach ($this->photos as $photo) {
            $photo->store(path: 'photos');
        }
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photos" multiple>

    @error('photos.*') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

## 파일 검증 {#file-validation}

앞서 논의한 것처럼, Livewire에서 파일 업로드를 검증하는 방법은 일반적인 Laravel 컨트롤러에서 파일 업로드를 처리하는 방법과 동일합니다.

> [!warning] S3가 올바르게 구성되어 있는지 확인하세요
> 파일과 관련된 많은 검증 규칙들은 파일에 접근할 수 있어야 합니다. [S3에 직접 업로드](#uploading-directly-to-amazon-s3)할 때, S3 파일 객체가 공개적으로 접근 가능하지 않으면 이러한 검증 규칙들은 실패하게 됩니다.

파일 검증에 대한 더 자세한 내용은 [Laravel의 파일 검증 문서](https://laravel.com/docs/validation#available-validation-rules)를 참고하세요.

## 임시 미리보기 URL {#temporary-preview-urls}

사용자가 파일을 선택한 후에는, 일반적으로 폼을 제출하고 파일을 저장하기 전에 해당 파일의 미리보기를 보여주는 것이 좋습니다.

Livewire는 업로드된 파일에서 `->temporaryUrl()` 메서드를 사용하여 이 작업을 매우 쉽게 처리할 수 있습니다.

> [!info] 임시 URL은 이미지에만 제한됩니다
> 보안상의 이유로, 임시 미리보기 URL은 이미지 MIME 타입의 파일에만 지원됩니다.

이미지 미리보기가 포함된 파일 업로드 예제를 살펴보겠습니다:

```php
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhoto extends Component
{
    use WithFileUploads;

    #[Validate('image|max:1024')]
    public $photo;

    // ...
}
```

```blade
<form wire:submit="save">
    @if ($photo) <!-- [!code highlight:3] -->
        <img src="{{ $photo->temporaryUrl() }}">
    @endif

    <input type="file" wire:model="photo">

    @error('photo') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

앞서 설명한 것처럼, Livewire는 임시 파일을 공개되지 않은 디렉터리에 저장합니다. 따라서 일반적으로 사용자가 이미지를 미리보기 할 수 있도록 임시 공개 URL을 노출하는 간단한 방법이 없습니다.

하지만 Livewire는 임시로 서명된 URL을 제공하여, 업로드된 이미지인 척 하면서 사용자의 페이지에 이미지 미리보기를 보여줄 수 있도록 이 문제를 해결합니다.

이 URL은 임시 디렉터리 상위의 파일을 보여주지 않도록 보호되어 있습니다. 또한, 서명되어 있기 때문에 사용자가 이 URL을 악용하여 시스템의 다른 파일을 미리보기 할 수 없습니다.

> [!tip] S3 임시 서명 URL
> Livewire에서 임시 파일 저장소로 S3를 사용하도록 설정한 경우, `->temporaryUrl()`을 호출하면 이미지 미리보기가 Laravel 애플리케이션 서버가 아닌 S3에서 직접 로드되도록 임시 서명 URL이 생성됩니다.

## 파일 업로드 테스트 {#testing-file-uploads}

Laravel의 기존 파일 업로드 테스트 헬퍼를 사용하여 파일 업로드를 테스트할 수 있습니다.

아래는 Livewire의 `UploadPhoto` 컴포넌트를 테스트하는 전체 예제입니다:

```php
<?php

namespace Tests\Feature\Livewire;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Livewire\UploadPhoto;
use Livewire\Livewire;
use Tests\TestCase;

class UploadPhotoTest extends TestCase
{
    public function test_can_upload_photo()
    {
        Storage::fake('avatars');

        $file = UploadedFile::fake()->image('avatar.png');

        Livewire::test(UploadPhoto::class)
            ->set('photo', $file)
            ->call('upload', 'uploaded-avatar.png');

        Storage::disk('avatars')->assertExists('uploaded-avatar.png');
    }
}
```

아래는 이전 테스트를 통과시키기 위해 필요한 `UploadPhoto` 컴포넌트의 예제입니다:

```php
use Livewire\Component;
use Livewire\WithFileUploads;

class UploadPhoto extends Component
{
    use WithFileUploads;

    public $photo;

    public function upload($name)
    {
        $this->photo->storeAs('/', $name, disk: 'avatars');
    }

    // ...
}
```

파일 업로드 테스트에 대한 더 자세한 내용은 [Laravel의 파일 업로드 테스트 문서](https://laravel.com/docs/http-tests#testing-file-uploads)를 참고하세요.

## Amazon S3에 직접 업로드하기 {#uploading-directly-to-amazon-s3}

앞서 설명한 것처럼, Livewire는 모든 파일 업로드를 개발자가 파일을 영구적으로 저장할 때까지 임시 디렉터리에 저장합니다.

기본적으로 Livewire는 기본 파일 시스템 디스크 설정(보통 `local`)을 사용하며, 파일을 `livewire-tmp/` 디렉터리 내에 저장합니다.

따라서, 업로드된 파일을 나중에 S3 버킷에 저장하더라도 파일 업로드는 항상 애플리케이션 서버를 거치게 됩니다.

만약 애플리케이션 서버를 우회하고 Livewire의 임시 업로드 파일을 S3 버킷에 직접 저장하고 싶다면, 애플리케이션의 `config/livewire.php` 설정 파일에서 해당 동작을 구성할 수 있습니다. 먼저, `livewire.temporary_file_upload.disk`를 `s3`(또는 `s3` 드라이버를 사용하는 다른 커스텀 디스크)로 설정하세요:

```php
return [
    // ...
    'temporary_file_upload' => [
        'disk' => 's3',
        // ...
    ],
];
```

이제 사용자가 파일을 업로드하면, 파일은 실제로 서버에 저장되지 않고, 대신 S3 버킷의 `livewire-tmp/` 하위 디렉터리에 직접 업로드됩니다.

> [!info] Livewire 설정 파일 퍼블리싱하기
> 파일 업로드 디스크를 커스터마이징하기 전에, 다음 명령어를 실행하여 Livewire의 설정 파일을 애플리케이션의 `/config` 디렉터리에 먼저 퍼블리싱해야 합니다:
> ```shell
> php artisan livewire:publish --config
> ```

### 자동 파일 정리 구성하기 {#configuring-automatic-file-cleanup}

Livewire의 임시 업로드 디렉터리는 빠르게 파일로 가득 찰 수 있으므로, 24시간이 지난 파일을 정리하도록 S3를 설정하는 것이 중요합니다.

이 동작을 설정하려면, S3 버킷을 파일 업로드에 사용하는 환경에서 다음 Artisan 명령어를 실행하세요:

```shell
php artisan livewire:configure-s3-upload-cleanup
```

이제 24시간이 지난 모든 임시 파일은 S3에서 자동으로 정리됩니다.

> [!info]
> S3를 파일 저장소로 사용하지 않는 경우, Livewire가 파일 정리를 자동으로 처리하므로 위 명령어를 실행할 필요가 없습니다.

## 로딩 인디케이터 {#loading-indicators}

파일 업로드를 위한 `wire:model`은 내부적으로 다른 `wire:model` 입력 타입들과 다르게 동작하지만, 로딩 인디케이터를 표시하는 인터페이스는 동일하게 유지됩니다.

다음과 같이 파일 업로드에 범위가 지정된 로딩 인디케이터를 표시할 수 있습니다:

```blade
<input type="file" wire:model="photo">

<div wire:loading wire:target="photo">업로드 중...</div>
```

이제 파일이 업로드되는 동안 "업로드 중..." 메시지가 표시되고, 업로드가 완료되면 숨겨집니다.

로딩 상태에 대한 더 자세한 내용은 [로딩 상태 문서](/livewire/3.x/wire-loading)를 참고하세요.

## 진행 표시기 {#progress-indicators}

모든 Livewire 파일 업로드 작업은 해당 `<input>` 요소에서 JavaScript 이벤트를 디스패치하여, 커스텀 JavaScript가 이벤트를 가로챌 수 있도록 합니다:

이벤트 | 설명
--- | ---
`livewire-upload-start` | 업로드가 시작될 때 디스패치됨
`livewire-upload-finish` | 업로드가 성공적으로 완료되면 디스패치됨
`livewire-upload-cancel` | 업로드가 조기에 취소되면 디스패치됨
`livewire-upload-error` | 업로드가 실패하면 디스패치됨
`livewire-upload-progress` | 업로드가 진행됨에 따라 업로드 진행률(%)을 포함하는 이벤트

아래는 Livewire 파일 업로드를 Alpine 컴포넌트로 감싸서 업로드 진행률 바를 표시하는 예시입니다:

```blade
<form wire:submit="save">
    <div
        x-data="{ uploading: false, progress: 0 }"
        x-on:livewire-upload-start="uploading = true"
        x-on:livewire-upload-finish="uploading = false"
        x-on:livewire-upload-cancel="uploading = false"
        x-on:livewire-upload-error="uploading = false"
        x-on:livewire-upload-progress="progress = $event.detail.progress"
    >
        <!-- 파일 입력 -->
        <input type="file" wire:model="photo">

        <!-- 진행률 바 -->
        <div x-show="uploading">
            <progress max="100" x-bind:value="progress"></progress>
        </div>
    </div>

    <!-- ... -->
</form>
```

## 업로드 취소하기 {#cancelling-an-upload}

업로드에 시간이 오래 걸릴 경우, 사용자가 업로드를 취소하고 싶을 수 있습니다. 이 기능은 Livewire의 JavaScript `$cancelUpload()` 함수를 사용하여 제공할 수 있습니다.

아래는 Livewire 컴포넌트에서 `wire:click`을 사용해 클릭 이벤트를 처리하는 "업로드 취소" 버튼을 만드는 예시입니다:

```blade
<form wire:submit="save">
    <!-- 파일 입력 -->
    <input type="file" wire:model="photo">

    <!-- 업로드 취소 버튼 -->
    <button type="button" wire:click="$cancelUpload('photo')">업로드 취소</button>

    <!-- ... -->
</form>
```

"업로드 취소" 버튼을 누르면 파일 업로드 요청이 중단되고 파일 입력란이 초기화됩니다. 사용자는 이제 다른 파일로 다시 업로드를 시도할 수 있습니다.

또는 Alpine에서 `cancelUpload(...)`를 다음과 같이 호출할 수도 있습니다:

```blade
<button type="button" x-on:click="$wire.cancelUpload('photo')">업로드 취소</button>
```

## JavaScript 업로드 API {#javascript-upload-api}

서드파티 파일 업로드 라이브러리와 통합하려면 단순한 `<input type="file" wire:model="...">` 요소보다 더 많은 제어가 필요한 경우가 많습니다.

이러한 상황을 위해 Livewire는 전용 JavaScript 함수를 제공합니다.

이 함수들은 JavaScript 컴포넌트 객체에 존재하며, Livewire 컴포넌트의 템플릿 내에서 Livewire의 편리한 `$wire` 객체를 통해 접근할 수 있습니다:

```blade
@script
<script>
    let file = $wire.el.querySelector('input[type="file"]').files[0]

    // 파일 업로드...
    $wire.upload('photo', file, (uploadedFilename) => {
        // 성공 콜백...
    }, () => {
        // 에러 콜백...
    }, (event) => {
        // 진행 상황 콜백...
        // event.detail.progress는 업로드 진행에 따라 1에서 100 사이의 숫자를 포함합니다
    }, () => {
        // 취소 콜백...
    })

    // 여러 파일 업로드...
    $wire.uploadMultiple('photos', [file], successCallback, errorCallback, progressCallback, cancelledCallback)

    // 여러 개 업로드된 파일 중 하나 제거...
    $wire.removeUpload('photos', uploadedFilename, successCallback)

    // 업로드 취소...
    $wire.cancelUpload('photos')
</script>
@endscript
```

## 구성 {#configuration}

Livewire는 모든 파일 업로드를 개발자가 검증하거나 저장하기 전에 임시로 저장하기 때문에, 모든 파일 업로드에 대해 기본 처리 동작을 가정합니다.

### 전역 검증 {#global-validation}

기본적으로 Livewire는 모든 임시 파일 업로드에 대해 다음과 같은 규칙으로 검증을 수행합니다: `file|max:12288` (12MB 미만의 파일이어야 함).

이 규칙을 커스터마이즈하고 싶다면, 애플리케이션의 `config/livewire.php` 파일에서 설정할 수 있습니다:

```php
'temporary_file_upload' => [
    // ...
    'rules' => 'file|mimes:png,jpg,pdf|max:102400', // (최대 100MB, PNG, JPEG, PDF만 허용)
],
```

### 전역 미들웨어 {#global-middleware}

임시 파일 업로드 엔드포인트에는 기본적으로 트래픽 제한(throttling) 미들웨어가 할당되어 있습니다. 아래의 설정 옵션을 통해 이 엔드포인트에 사용할 미들웨어를 직접 지정할 수 있습니다:

```php
'temporary_file_upload' => [
    // ...
    'middleware' => 'throttle:5,1', // 사용자당 분당 5번만 업로드 허용
],
```

### 임시 업로드 디렉터리 {#temporary-upload-directory}

임시 파일은 지정된 디스크의 `livewire-tmp/` 디렉터리에 업로드됩니다. 아래의 설정 옵션을 통해 이 디렉터리를 커스터마이즈할 수 있습니다:

```php
'temporary_file_upload' => [
    // ...
    'directory' => 'tmp',
],
```
