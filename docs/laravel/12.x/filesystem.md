# 파일 스토리지



























## 소개 {#introduction}

Laravel은 Frank de Jonge가 만든 훌륭한 [Flysystem](https://github.com/thephpleague/flysystem) PHP 패키지를 통해 강력한 파일 시스템 추상화를 제공합니다. Laravel의 Flysystem 통합은 로컬 파일 시스템, SFTP, Amazon S3와 작업할 수 있는 간단한 드라이버를 제공합니다. 더 좋은 점은, 각 시스템의 API가 동일하게 유지되기 때문에 로컬 개발 환경과 운영 서버 간에 이러한 저장소 옵션을 매우 쉽게 전환할 수 있다는 것입니다.


## 설정 {#configuration}

Laravel의 파일 시스템 설정 파일은 `config/filesystems.php`에 위치해 있습니다. 이 파일에서 모든 파일 시스템 "디스크"를 설정할 수 있습니다. 각 디스크는 특정 저장소 드라이버와 저장 위치를 나타냅니다. 각 지원되는 드라이버에 대한 예시 설정이 설정 파일에 포함되어 있으므로, 이를 참고하여 자신의 저장소 환경과 자격 증명에 맞게 설정을 수정할 수 있습니다.

`local` 드라이버는 Laravel 애플리케이션이 실행 중인 서버에 로컬로 저장된 파일과 상호작용하며, `s3` 드라이버는 Amazon의 S3 클라우드 저장소 서비스에 파일을 저장하는 데 사용됩니다.

> [!NOTE]
> 원하는 만큼 많은 디스크를 설정할 수 있으며, 동일한 드라이버를 사용하는 여러 디스크도 생성할 수 있습니다.


### 로컬 드라이버 {#the-local-driver}

`local` 드라이버를 사용할 때, 모든 파일 작업은 `filesystems` 설정 파일에 정의된 `root` 디렉터리를 기준으로 이루어집니다. 기본적으로 이 값은 `storage/app/private` 디렉터리로 설정되어 있습니다. 따라서 아래의 메서드는 `storage/app/private/example.txt` 파일에 데이터를 기록하게 됩니다:

```php
use Illuminate\Support\Facades\Storage;

Storage::disk('local')->put('example.txt', 'Contents');
```


### Public 디스크 {#the-public-disk}

애플리케이션의 `filesystems` 설정 파일에 포함된 `public` 디스크는 공개적으로 접근 가능한 파일을 저장하기 위해 사용됩니다. 기본적으로 `public` 디스크는 `local` 드라이버를 사용하며, 파일을 `storage/app/public` 디렉터리에 저장합니다.

만약 `public` 디스크가 `local` 드라이버를 사용하고 있고, 이 파일들을 웹에서 접근 가능하게 만들고 싶다면, 소스 디렉터리 `storage/app/public`에서 대상 디렉터리 `public/storage`로 심볼릭 링크를 생성해야 합니다.

심볼릭 링크를 생성하려면, `storage:link` Artisan 명령어를 사용할 수 있습니다:

```shell
php artisan storage:link
```

파일이 저장되고 심볼릭 링크가 생성되면, `asset` 헬퍼를 사용해 파일의 URL을 만들 수 있습니다:

```php
echo asset('storage/file.txt');
```

`filesystems` 설정 파일에서 추가적인 심볼릭 링크를 구성할 수도 있습니다. 설정된 각 링크는 `storage:link` 명령어를 실행할 때 생성됩니다:

```php
'links' => [
    public_path('storage') => storage_path('app/public'),
    public_path('images') => storage_path('app/images'),
],
```

`storage:unlink` 명령어를 사용하면 설정된 심볼릭 링크를 제거할 수 있습니다:

```shell
php artisan storage:unlink
```


### 드라이버 필수 조건 {#driver-prerequisites}


#### S3 드라이버 설정 {#s3-driver-configuration}

S3 드라이버를 사용하기 전에 Composer 패키지 매니저를 통해 Flysystem S3 패키지를 설치해야 합니다:

```shell
composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies
```

S3 디스크 설정 배열은 `config/filesystems.php` 설정 파일에 위치해 있습니다. 일반적으로, 아래와 같은 환경 변수를 사용하여 S3 정보와 자격 증명을 설정해야 하며, 이 변수들은 `config/filesystems.php` 설정 파일에서 참조됩니다:

```ini
AWS_ACCESS_KEY_ID=<your-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=<your-bucket-name>
AWS_USE_PATH_STYLE_ENDPOINT=false
```

편의를 위해, 이러한 환경 변수들은 AWS CLI에서 사용하는 명명 규칙과 동일합니다.


#### FTP 드라이버 설정 {#ftp-driver-configuration}

FTP 드라이버를 사용하기 전에 Composer 패키지 관리자를 통해 Flysystem FTP 패키지를 설치해야 합니다:

```shell
composer require league/flysystem-ftp "^3.0"
```

Laravel의 Flysystem 통합은 FTP와 잘 작동하지만, 프레임워크의 기본 `config/filesystems.php` 설정 파일에는 샘플 설정이 포함되어 있지 않습니다. FTP 파일 시스템을 설정해야 하는 경우, 아래의 설정 예시를 참고할 수 있습니다:

```php
'ftp' => [
    'driver' => 'ftp',
    'host' => env('FTP_HOST'),
    'username' => env('FTP_USERNAME'),
    'password' => env('FTP_PASSWORD'),

    // 선택적 FTP 설정...
    // 'port' => env('FTP_PORT', 21),
    // 'root' => env('FTP_ROOT'),
    // 'passive' => true,
    // 'ssl' => true,
    // 'timeout' => 30,
],
```


#### SFTP 드라이버 설정 {#sftp-driver-configuration}

SFTP 드라이버를 사용하기 전에 Composer 패키지 관리자를 통해 Flysystem SFTP 패키지를 설치해야 합니다:

```shell
composer require league/flysystem-sftp-v3 "^3.0"
```

Laravel의 Flysystem 통합은 SFTP와 잘 작동합니다. 하지만, 프레임워크의 기본 `config/filesystems.php` 설정 파일에는 SFTP에 대한 샘플 설정이 포함되어 있지 않습니다. SFTP 파일 시스템을 설정해야 한다면, 아래의 설정 예시를 참고할 수 있습니다:

```php
'sftp' => [
    'driver' => 'sftp',
    'host' => env('SFTP_HOST'),

    // 기본 인증 설정...
    'username' => env('SFTP_USERNAME'),
    'password' => env('SFTP_PASSWORD'),

    // 암호화 비밀번호가 있는 SSH 키 기반 인증 설정...
    'privateKey' => env('SFTP_PRIVATE_KEY'),
    'passphrase' => env('SFTP_PASSPHRASE'),

    // 파일 / 디렉터리 권한 설정...
    'visibility' => 'private', // `private` = 0600, `public` = 0644
    'directory_visibility' => 'private', // `private` = 0700, `public` = 0755

    // 선택적 SFTP 설정...
    // 'hostFingerprint' => env('SFTP_HOST_FINGERPRINT'),
    // 'maxTries' => 4,
    // 'passphrase' => env('SFTP_PASSPHRASE'),
    // 'port' => env('SFTP_PORT', 22),
    // 'root' => env('SFTP_ROOT', ''),
    // 'timeout' => 30,
    // 'useAgent' => true,
],
```


### 범위 지정 및 읽기 전용 파일 시스템 {#scoped-and-read-only-filesystems}

범위 지정(Scoped) 디스크를 사용하면 모든 경로가 자동으로 지정된 경로 접두사로 시작되는 파일 시스템을 정의할 수 있습니다. 범위 지정 파일 시스템 디스크를 생성하기 전에 Composer 패키지 관리자를 통해 추가 Flysystem 패키지를 설치해야 합니다:

```shell
composer require league/flysystem-path-prefixing "^3.0"
```

기존 파일 시스템 디스크의 경로 범위 인스턴스를 생성하려면 `scoped` 드라이버를 사용하는 디스크를 정의하면 됩니다. 예를 들어, 기존 `s3` 디스크를 특정 경로 접두사로 범위 지정하는 디스크를 생성할 수 있으며, 범위 지정 디스크를 사용하는 모든 파일 작업은 지정된 접두사를 사용하게 됩니다:

```php
's3-videos' => [
    'driver' => 'scoped',
    'disk' => 's3',
    'prefix' => 'path/to/videos',
],
```

"읽기 전용" 디스크를 사용하면 쓰기 작업이 허용되지 않는 파일 시스템 디스크를 생성할 수 있습니다. `read-only` 구성 옵션을 사용하기 전에 Composer 패키지 관리자를 통해 추가 Flysystem 패키지를 설치해야 합니다:

```shell
composer require league/flysystem-read-only "^3.0"
```

그 다음, 디스크의 구성 배열 중 하나 이상에 `read-only` 구성 옵션을 포함할 수 있습니다:

```php
's3-videos' => [
    'driver' => 's3',
    // ...
    'read-only' => true,
],
```


### Amazon S3 호환 파일 시스템 {#amazon-s3-compatible-filesystems}

기본적으로, 애플리케이션의 `filesystems` 설정 파일에는 `s3` 디스크에 대한 설정이 포함되어 있습니다. 이 디스크를 사용하여 [Amazon S3](https://aws.amazon.com/s3/)와 상호작용할 수 있을 뿐만 아니라, [MinIO](https://github.com/minio/minio), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/), [Vultr Object Storage](https://www.vultr.com/products/object-storage/), [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/), [Hetzner Cloud Storage](https://www.hetzner.com/storage/object-storage/)와 같은 S3 호환 파일 저장 서비스와도 상호작용할 수 있습니다.

일반적으로, 사용하려는 서비스의 자격 증명에 맞게 디스크의 자격 증명을 업데이트한 후에는 `endpoint` 설정 옵션의 값만 변경하면 됩니다. 이 옵션의 값은 보통 `AWS_ENDPOINT` 환경 변수를 통해 정의됩니다:

```php
'endpoint' => env('AWS_ENDPOINT', 'https://minio:9000'),
```


#### MinIO {#minio}

Laravel의 Flysystem 통합 기능이 MinIO를 사용할 때 올바른 URL을 생성하려면, `AWS_URL` 환경 변수를 애플리케이션의 로컬 URL과 일치하도록 설정하고, URL 경로에 버킷 이름을 포함해야 합니다:

```ini
AWS_URL=http://localhost:9000/local
```

> [!WARNING]
> MinIO를 사용할 때 `endpoint`에 클라이언트가 접근할 수 없는 경우, `temporaryUrl` 메서드를 통한 임시 저장소 URL 생성이 동작하지 않을 수 있습니다.


## 디스크 인스턴스 얻기 {#obtaining-disk-instances}

`Storage` 파사드는 설정된 모든 디스크와 상호작용할 때 사용할 수 있습니다. 예를 들어, 파사드의 `put` 메서드를 사용하여 기본 디스크에 아바타를 저장할 수 있습니다. 만약 `disk` 메서드를 먼저 호출하지 않고 `Storage` 파사드에서 메서드를 호출하면, 해당 메서드는 자동으로 기본 디스크에 전달됩니다:

```php
use Illuminate\Support\Facades\Storage;

Storage::put('avatars/1', $content);
```

애플리케이션이 여러 디스크와 상호작용해야 하는 경우, `Storage` 파사드의 `disk` 메서드를 사용하여 특정 디스크의 파일을 다룰 수 있습니다:

```php
Storage::disk('s3')->put('avatars/1', $content);
```


### 온디맨드 디스크 {#on-demand-disks}

때때로 애플리케이션의 `filesystems` 설정 파일에 실제로 존재하지 않는 설정을 사용하여 런타임에 디스크를 생성하고 싶을 수 있습니다. 이를 위해 `Storage` 파사드의 `build` 메서드에 설정 배열을 전달하면 됩니다:

```php
use Illuminate\Support\Facades\Storage;

$disk = Storage::build([
    'driver' => 'local',
    'root' => '/path/to/root',
]);

$disk->put('image.jpg', $content);
```


## 파일 가져오기 {#retrieving-files}

`get` 메서드는 파일의 내용을 가져오는 데 사용할 수 있습니다. 이 메서드는 파일의 원시 문자열 내용을 반환합니다. 모든 파일 경로는 디스크의 "루트" 위치를 기준으로 지정해야 한다는 점을 기억하세요:

```php
$contents = Storage::get('file.jpg');
```

가져오려는 파일이 JSON을 포함하고 있다면, `json` 메서드를 사용하여 파일을 가져오고 그 내용을 디코딩할 수 있습니다:

```php
$orders = Storage::json('orders.json');
```

`exists` 메서드는 디스크에 파일이 존재하는지 확인하는 데 사용할 수 있습니다:

```php
if (Storage::disk('s3')->exists('file.jpg')) {
    // ...
}
```

`missing` 메서드는 디스크에 파일이 없는지 확인하는 데 사용할 수 있습니다:

```php
if (Storage::disk('s3')->missing('file.jpg')) {
    // ...
}
```


### 파일 다운로드 {#downloading-files}

`download` 메서드는 지정된 경로의 파일을 사용자의 브라우저에서 강제로 다운로드하도록 하는 응답을 생성할 때 사용됩니다. `download` 메서드는 두 번째 인자로 파일명을 받을 수 있으며, 이 값은 사용자가 파일을 다운로드할 때 보게 되는 파일명을 결정합니다. 마지막으로, 세 번째 인자로 HTTP 헤더의 배열을 전달할 수도 있습니다:

```php
return Storage::download('file.jpg');

return Storage::download('file.jpg', $name, $headers);
```


### 파일 URL {#file-urls}

`url` 메서드를 사용하여 특정 파일의 URL을 가져올 수 있습니다. `local` 드라이버를 사용하는 경우, 일반적으로 지정한 경로 앞에 `/storage`가 붙어 파일에 대한 상대 URL이 반환됩니다. `s3` 드라이버를 사용하는 경우에는 완전히 자격이 갖춰진 원격 URL이 반환됩니다.

```php
use Illuminate\Support\Facades\Storage;

$url = Storage::url('file.jpg');
```

`local` 드라이버를 사용할 때, 공개적으로 접근 가능한 모든 파일은 `storage/app/public` 디렉터리에 위치해야 합니다. 또한, `public/storage`에 [심볼릭 링크를 생성](#the-public-disk)하여 `storage/app/public` 디렉터리를 가리키도록 해야 합니다.

> [!WARNING]
> `local` 드라이버를 사용할 때, `url`의 반환값은 URL 인코딩이 적용되지 않습니다. 따라서, 항상 유효한 URL을 생성할 수 있는 파일 이름을 사용하는 것을 권장합니다.


#### URL 호스트 커스터마이징 {#url-host-customization}

`Storage` 파사드를 사용하여 생성되는 URL의 호스트를 수정하고 싶다면, 디스크의 설정 배열에서 `url` 옵션을 추가하거나 변경하면 됩니다:

```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
    'throw' => false,
],
```


### 임시 URL {#temporary-urls}

`temporaryUrl` 메서드를 사용하면 `local` 및 `s3` 드라이버를 이용해 저장된 파일에 대한 임시 URL을 생성할 수 있습니다. 이 메서드는 파일 경로와 URL이 만료될 시점을 지정하는 `DateTime` 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Facades\Storage;

$url = Storage::temporaryUrl(
    'file.jpg', now()->addMinutes(5)
);
```


#### 로컬 임시 URL 활성화 {#enabling-local-temporary-urls}

임시 URL에 대한 지원이 `local` 드라이버에 도입되기 전에 애플리케이션 개발을 시작했다면, 로컬 임시 URL을 직접 활성화해야 할 수 있습니다. 이를 위해 `config/filesystems.php` 설정 파일에서 `local` 디스크의 설정 배열에 `serve` 옵션을 추가하세요:

```php
'local' => [
    'driver' => 'local',
    'root' => storage_path('app/private'),
    'serve' => true, // [tl! add]
    'throw' => false,
],
```


#### S3 요청 파라미터 {#s3-request-parameters}

추가적인 [S3 요청 파라미터](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectGET.html#RESTObjectGET-requests)를 지정해야 하는 경우, `temporaryUrl` 메서드의 세 번째 인자로 요청 파라미터 배열을 전달할 수 있습니다:

```php
$url = Storage::temporaryUrl(
    'file.jpg',
    now()->addMinutes(5),
    [
        'ResponseContentType' => 'application/octet-stream',
        'ResponseContentDisposition' => 'attachment; filename=file2.jpg',
    ]
);
```


#### 임시 URL 커스터마이징 {#customizing-temporary-urls}

특정 스토리지 디스크에 대해 임시 URL이 생성되는 방식을 커스터마이징해야 하는 경우, `buildTemporaryUrlsUsing` 메서드를 사용할 수 있습니다. 예를 들어, 일반적으로 임시 URL을 지원하지 않는 디스크를 통해 저장된 파일을 다운로드할 수 있도록 컨트롤러를 만들 때 유용합니다. 보통 이 메서드는 서비스 프로바이더의 `boot` 메서드에서 호출해야 합니다:

```php
<?php

namespace App\Providers;

use DateTime;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Storage::disk('local')->buildTemporaryUrlsUsing(
            function (string $path, DateTime $expiration, array $options) {
                return URL::temporarySignedRoute(
                    'files.download',
                    $expiration,
                    array_merge($options, ['path' => $path])
                );
            }
        );
    }
}
```


#### 임시 업로드 URL {#temporary-upload-urls}

> [!WARNING]
> 임시 업로드 URL을 생성하는 기능은 `s3` 드라이버에서만 지원됩니다.

클라이언트 사이드 애플리케이션에서 파일을 직접 업로드할 수 있는 임시 URL이 필요하다면, `temporaryUploadUrl` 메서드를 사용할 수 있습니다. 이 메서드는 경로와 URL이 만료될 시점을 지정하는 `DateTime` 인스턴스를 인자로 받습니다. `temporaryUploadUrl` 메서드는 업로드 URL과 업로드 요청에 포함해야 할 헤더를 포함하는 연관 배열을 반환하며, 이를 구조 분해 할당할 수 있습니다:

```php
use Illuminate\Support\Facades\Storage;

['url' => $url, 'headers' => $headers] = Storage::temporaryUploadUrl(
    'file.jpg', now()->addMinutes(5)
);
```

이 메서드는 주로 Amazon S3와 같은 클라우드 스토리지 시스템에 클라이언트 사이드 애플리케이션이 직접 파일을 업로드해야 하는 서버리스 환경에서 유용하게 사용됩니다.


### 파일 메타데이터 {#file-metadata}

Laravel은 파일을 읽고 쓰는 것 외에도 파일 자체에 대한 정보도 제공할 수 있습니다. 예를 들어, `size` 메서드를 사용하면 파일의 크기를 바이트 단위로 가져올 수 있습니다:

```php
use Illuminate\Support\Facades\Storage;

$size = Storage::size('file.jpg');
```

`lastModified` 메서드는 파일이 마지막으로 수정된 시간을 UNIX 타임스탬프로 반환합니다:

```php
$time = Storage::lastModified('file.jpg');
```

지정한 파일의 MIME 타입은 `mimeType` 메서드를 통해 얻을 수 있습니다:

```php
$mime = Storage::mimeType('file.jpg');
```


#### 파일 경로 {#file-paths}

`path` 메서드를 사용하여 특정 파일의 경로를 가져올 수 있습니다. `local` 드라이버를 사용하는 경우, 이 메서드는 파일의 절대 경로를 반환합니다. `s3` 드라이버를 사용하는 경우, 이 메서드는 S3 버킷 내에서 파일의 상대 경로를 반환합니다:

```php
use Illuminate\Support\Facades\Storage;

$path = Storage::path('file.jpg');
```


## 파일 저장하기 {#storing-files}

`put` 메서드는 디스크에 파일 내용을 저장할 때 사용할 수 있습니다. 또한 PHP의 `resource`를 `put` 메서드에 전달할 수도 있으며, 이 경우 Flysystem의 기본 스트림 지원을 사용합니다. 모든 파일 경로는 디스크에 설정된 "루트" 위치를 기준으로 상대 경로로 지정해야 한다는 점을 기억하세요.

```php
use Illuminate\Support\Facades\Storage;

Storage::put('file.jpg', $contents);

Storage::put('file.jpg', $resource);
```


#### 쓰기 실패 {#failed-writes}

`put` 메서드(또는 기타 "쓰기" 작업)가 파일을 디스크에 쓸 수 없는 경우, `false`가 반환됩니다:

```php
if (! Storage::put('file.jpg', $contents)) {
    // 파일을 디스크에 쓸 수 없습니다...
}
```

원한다면 파일 시스템 디스크의 설정 배열에 `throw` 옵션을 정의할 수 있습니다. 이 옵션이 `true`로 설정되면, `put`과 같은 "쓰기" 메서드에서 쓰기 작업이 실패할 때 `League\Flysystem\UnableToWriteFile` 예외가 발생합니다:

```php
'public' => [
    'driver' => 'local',
    // ...
    'throw' => true,
],
```


### 파일에 내용 앞뒤로 추가하기 {#prepending-appending-to-files}

`prepend`와 `append` 메서드를 사용하면 파일의 시작 부분이나 끝 부분에 내용을 쓸 수 있습니다:

```php
Storage::prepend('file.log', '앞에 추가된 텍스트');

Storage::append('file.log', '뒤에 추가된 텍스트');
```


### 파일 복사 및 이동 {#copying-moving-files}

`copy` 메서드는 기존 파일을 디스크의 새로운 위치로 복사할 때 사용할 수 있습니다. 반면, `move` 메서드는 기존 파일의 이름을 변경하거나 새로운 위치로 이동할 때 사용할 수 있습니다.

```php
Storage::copy('old/file.jpg', 'new/file.jpg');

Storage::move('old/file.jpg', 'new/file.jpg');
```


### 자동 스트리밍 {#automatic-streaming}

파일을 스토리지에 스트리밍하면 메모리 사용량을 크게 줄일 수 있습니다. Laravel이 파일을 지정한 스토리지 위치로 자동으로 스트리밍하도록 하려면 `putFile` 또는 `putFileAs` 메서드를 사용할 수 있습니다. 이 메서드는 `Illuminate\Http\File` 또는 `Illuminate\Http\UploadedFile` 인스턴스를 받아 파일을 원하는 위치로 자동으로 스트리밍합니다.

```php
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;

// 파일 이름에 고유 ID를 자동으로 생성...
$path = Storage::putFile('photos', new File('/path/to/photo'));

// 파일 이름을 직접 지정...
$path = Storage::putFileAs('photos', new File('/path/to/photo'), 'photo.jpg');
```

`putFile` 메서드에 대해 몇 가지 중요한 점을 알아두어야 합니다. 디렉터리 이름만 지정하고 파일 이름은 지정하지 않았다는 점에 주의하세요. 기본적으로 `putFile` 메서드는 파일 이름으로 사용할 고유 ID를 생성합니다. 파일의 확장자는 파일의 MIME 타입을 검사하여 결정됩니다. `putFile` 메서드는 파일의 경로(생성된 파일 이름 포함)를 반환하므로, 이 경로를 데이터베이스에 저장할 수 있습니다.

또한 `putFile` 및 `putFileAs` 메서드는 저장된 파일의 "가시성(visibility)"을 지정하는 인자를 추가로 받을 수 있습니다. 이 기능은 Amazon S3와 같은 클라우드 디스크에 파일을 저장하고, 생성된 URL을 통해 파일을 공개적으로 접근할 수 있도록 하고 싶을 때 유용합니다.

```php
Storage::putFile('photos', new File('/path/to/photo'), 'public');
```


### 파일 업로드 {#file-uploads}

웹 애플리케이션에서 파일을 저장하는 가장 일반적인 사용 사례 중 하나는 사용자가 업로드한 사진이나 문서와 같은 파일을 저장하는 것입니다. Laravel은 업로드된 파일 인스턴스의 `store` 메서드를 사용하여 파일을 매우 쉽게 저장할 수 있도록 해줍니다. 업로드된 파일을 저장하고자 하는 경로를 `store` 메서드에 전달하면 됩니다:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserAvatarController extends Controller
{
    /**
     * 사용자의 아바타를 업데이트합니다.
     */
    public function update(Request $request): string
    {
        $path = $request->file('avatar')->store('avatars');

        return $path;
    }
}
```

이 예제에서 주의해야 할 몇 가지 중요한 점이 있습니다. 디렉터리 이름만 지정하고 파일 이름은 지정하지 않았다는 점에 주목하세요. 기본적으로 `store` 메서드는 파일 이름으로 사용할 고유한 ID를 생성합니다. 파일의 확장자는 파일의 MIME 타입을 검사하여 결정됩니다. `store` 메서드는 파일의 경로(생성된 파일 이름을 포함)를 반환하므로, 이 경로를 데이터베이스에 저장할 수 있습니다.

또한, 위의 예제와 동일한 파일 저장 작업을 `Storage` 파사드의 `putFile` 메서드를 호출하여 수행할 수도 있습니다:

```php
$path = Storage::putFile('avatars', $request->file('avatar'));
```


#### 파일 이름 지정하기 {#specifying-a-file-name}

저장되는 파일에 자동으로 파일명이 할당되는 것을 원하지 않는 경우, `storeAs` 메서드를 사용할 수 있습니다. 이 메서드는 경로, 파일명, (선택적으로) 디스크를 인자로 받습니다:

```php
$path = $request->file('avatar')->storeAs(
    'avatars', $request->user()->id
);
```

또한, `Storage` 파사드의 `putFileAs` 메서드를 사용할 수도 있으며, 위 예제와 동일한 파일 저장 작업을 수행합니다:

```php
$path = Storage::putFileAs(
    'avatars', $request->file('avatar'), $request->user()->id
);
```

> [!WARNING]
> 인쇄할 수 없거나 유효하지 않은 유니코드 문자는 파일 경로에서 자동으로 제거됩니다. 따라서, 파일 경로를 Laravel의 파일 저장 메서드에 전달하기 전에 미리 정제(sanitize)하는 것이 좋습니다. 파일 경로는 `League\Flysystem\WhitespacePathNormalizer::normalizePath` 메서드를 사용해 정규화됩니다.


#### 디스크 지정하기 {#specifying-a-disk}

기본적으로 업로드된 파일의 `store` 메서드는 기본 디스크를 사용합니다. 만약 다른 디스크를 지정하고 싶다면, `store` 메서드의 두 번째 인자로 디스크 이름을 전달하면 됩니다:

```php
$path = $request->file('avatar')->store(
    'avatars/'.$request->user()->id, 's3'
);
```

`storeAs` 메서드를 사용할 경우, 디스크 이름을 세 번째 인자로 전달할 수 있습니다:

```php
$path = $request->file('avatar')->storeAs(
    'avatars',
    $request->user()->id,
    's3'
);
```


#### 업로드된 파일의 기타 정보 {#other-uploaded-file-information}

업로드된 파일의 원래 이름과 확장자를 얻고 싶다면, `getClientOriginalName`과 `getClientOriginalExtension` 메서드를 사용할 수 있습니다:

```php
$file = $request->file('avatar');

$name = $file->getClientOriginalName();
$extension = $file->getClientOriginalExtension();
```

하지만, `getClientOriginalName`과 `getClientOriginalExtension` 메서드는 안전하지 않다는 점을 유의해야 합니다. 악의적인 사용자가 파일 이름과 확장자를 조작할 수 있기 때문입니다. 이러한 이유로, 파일 업로드 시 이름과 확장자를 얻으려면 일반적으로 `hashName`과 `extension` 메서드를 사용하는 것이 더 안전합니다:

```php
$file = $request->file('avatar');

$name = $file->hashName(); // 고유하고 랜덤한 이름을 생성합니다...
$extension = $file->extension(); // 파일의 MIME 타입을 기반으로 확장자를 결정합니다...
```


### 파일 가시성 {#file-visibility}

Laravel의 Flysystem 통합에서 "가시성(visibility)"은 여러 플랫폼에서 파일 권한을 추상화한 개념입니다. 파일은 `public`(공개) 또는 `private`(비공개)로 선언할 수 있습니다. 파일이 `public`으로 선언되면, 해당 파일이 일반적으로 다른 사람들에게 접근 가능해야 함을 의미합니다. 예를 들어, S3 드라이버를 사용할 때 `public` 파일의 URL을 가져올 수 있습니다.

파일을 저장할 때 `put` 메서드를 통해 가시성을 설정할 수 있습니다:

```php
use Illuminate\Support\Facades\Storage;

Storage::put('file.jpg', $contents, 'public');
```

이미 저장된 파일의 가시성은 `getVisibility`와 `setVisibility` 메서드를 통해 조회 및 설정할 수 있습니다:

```php
$visibility = Storage::getVisibility('file.jpg');

Storage::setVisibility('file.jpg', 'public');
```

업로드된 파일을 다룰 때는, `storePublicly`와 `storePubliclyAs` 메서드를 사용하여 업로드 파일을 `public` 가시성으로 저장할 수 있습니다:

```php
$path = $request->file('avatar')->storePublicly('avatars', 's3');

$path = $request->file('avatar')->storePubliclyAs(
    'avatars',
    $request->user()->id,
    's3'
);
```


#### 로컬 파일과 가시성 {#local-files-and-visibility}

`local` 드라이버를 사용할 때, `public` [가시성](#file-visibility)은 디렉터리에 대해 `0755` 권한, 파일에 대해 `0644` 권한으로 변환됩니다. 이러한 권한 매핑은 애플리케이션의 `filesystems` 설정 파일에서 수정할 수 있습니다:

```php
'local' => [
    'driver' => 'local',
    'root' => storage_path('app'),
    'permissions' => [
        'file' => [
            'public' => 0644,
            'private' => 0600,
        ],
        'dir' => [
            'public' => 0755,
            'private' => 0700,
        ],
    ],
    'throw' => false,
],
```


## 파일 삭제 {#deleting-files}

`delete` 메서드는 삭제할 파일 이름 하나 또는 파일 이름 배열을 인자로 받을 수 있습니다:

```php
use Illuminate\Support\Facades\Storage;

Storage::delete('file.jpg');

Storage::delete(['file.jpg', 'file2.jpg']);
```

필요하다면, 파일을 삭제할 디스크를 지정할 수도 있습니다:

```php
use Illuminate\Support\Facades\Storage;

Storage::disk('s3')->delete('path/file.jpg');
```


## 디렉터리 {#directories}


#### 디렉터리 내 모든 파일 가져오기 {#get-all-files-within-a-directory}

`files` 메서드는 지정한 디렉터리 내의 모든 파일을 배열로 반환합니다. 만약 하위 디렉터리를 포함한 모든 파일 목록을 가져오고 싶다면, `allFiles` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Facades\Storage;

$files = Storage::files($directory);

$files = Storage::allFiles($directory);
```


#### 디렉터리 내의 모든 디렉터리 가져오기 {#get-all-directories-within-a-directory}

`directories` 메서드는 지정한 디렉터리 내에 있는 모든 디렉터리의 배열을 반환합니다. 또한, `allDirectories` 메서드를 사용하면 지정한 디렉터리와 그 하위 모든 디렉터리의 목록을 가져올 수 있습니다:

```php
$directories = Storage::directories($directory);

$directories = Storage::allDirectories($directory);
```


#### 디렉터리 생성 {#create-a-directory}

`makeDirectory` 메서드는 지정한 디렉터리를 생성하며, 필요한 하위 디렉터리도 함께 생성합니다:

```php
Storage::makeDirectory($directory);
```


#### 디렉터리 삭제 {#delete-a-directory}

마지막으로, `deleteDirectory` 메서드를 사용하여 디렉터리와 그 안의 모든 파일을 삭제할 수 있습니다:

```php
Storage::deleteDirectory($directory);
```


## 테스트 {#testing}

`Storage` 파사드의 `fake` 메서드를 사용하면 가짜 디스크를 손쉽게 생성할 수 있습니다. 이 기능은 `Illuminate\Http\UploadedFile` 클래스의 파일 생성 유틸리티와 결합하여 파일 업로드 테스트를 매우 간단하게 만들어줍니다. 예를 들어:

```php tab=Pest
<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('앨범을 업로드할 수 있다', function () {
    Storage::fake('photos');

    $response = $this->json('POST', '/photos', [
        UploadedFile::fake()->image('photo1.jpg'),
        UploadedFile::fake()->image('photo2.jpg')
    ]);

    // 하나 이상의 파일이 저장되었는지 확인...
    Storage::disk('photos')->assertExists('photo1.jpg');
    Storage::disk('photos')->assertExists(['photo1.jpg', 'photo2.jpg']);

    // 하나 이상의 파일이 저장되지 않았는지 확인...
    Storage::disk('photos')->assertMissing('missing.jpg');
    Storage::disk('photos')->assertMissing(['missing.jpg', 'non-existing.jpg']);

    // 특정 디렉터리 내 파일 개수가 예상과 일치하는지 확인...
    Storage::disk('photos')->assertCount('/wallpapers', 2);

    // 특정 디렉터리가 비어있는지 확인...
    Storage::disk('photos')->assertDirectoryEmpty('/wallpapers');
});
```

```php tab=PHPUnit
<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_albums_can_be_uploaded(): void
    {
        Storage::fake('photos');

        $response = $this->json('POST', '/photos', [
            UploadedFile::fake()->image('photo1.jpg'),
            UploadedFile::fake()->image('photo2.jpg')
        ]);

        // 하나 이상의 파일이 저장되었는지 확인...
        Storage::disk('photos')->assertExists('photo1.jpg');
        Storage::disk('photos')->assertExists(['photo1.jpg', 'photo2.jpg']);

        // 하나 이상의 파일이 저장되지 않았는지 확인...
        Storage::disk('photos')->assertMissing('missing.jpg');
        Storage::disk('photos')->assertMissing(['missing.jpg', 'non-existing.jpg']);

        // 특정 디렉터리 내 파일 개수가 예상과 일치하는지 확인...
        Storage::disk('photos')->assertCount('/wallpapers', 2);

        // 특정 디렉터리가 비어있는지 확인...
        Storage::disk('photos')->assertDirectoryEmpty('/wallpapers');
    }
}
```

기본적으로 `fake` 메서드는 임시 디렉터리 내의 모든 파일을 삭제합니다. 만약 이 파일들을 유지하고 싶다면, "persistentFake" 메서드를 대신 사용할 수 있습니다. 파일 업로드 테스트에 대한 더 자세한 내용은 [HTTP 테스트 문서의 파일 업로드 관련 정보](/docs/{{version}}/http-tests#testing-file-uploads)를 참고하세요.

> [!WARNING]
> `image` 메서드는 [GD 확장](https://www.php.net/manual/en/book.image.php)이 필요합니다.


## 커스텀 파일 시스템 {#custom-filesystems}

Laravel의 Flysystem 통합은 여러 "드라이버"를 기본적으로 지원하지만, Flysystem은 여기에 국한되지 않고 다양한 스토리지 시스템을 위한 어댑터를 제공합니다. 이러한 추가 어댑터 중 하나를 Laravel 애플리케이션에서 사용하고 싶다면 커스텀 드라이버를 생성할 수 있습니다.

커스텀 파일 시스템을 정의하려면 Flysystem 어댑터가 필요합니다. 예를 들어, 커뮤니티에서 관리하는 Dropbox 어댑터를 프로젝트에 추가해보겠습니다.

```shell
composer require spatie/flysystem-dropbox
```

다음으로, 애플리케이션의 [서비스 프로바이더](/docs/{{version}}/providers) 중 하나의 `boot` 메서드에서 드라이버를 등록할 수 있습니다. 이를 위해 `Storage` 파사드의 `extend` 메서드를 사용합니다.

```php
<?php

namespace App\Providers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use Spatie\Dropbox\Client as DropboxClient;
use Spatie\FlysystemDropbox\DropboxAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 등록합니다.
     */
    public function register(): void
    {
        // ...
    }

    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Storage::extend('dropbox', function (Application $app, array $config) {
            $adapter = new DropboxAdapter(new DropboxClient(
                $config['authorization_token']
            ));

            return new FilesystemAdapter(
                new Filesystem($adapter, $config),
                $adapter,
                $config
            );
        });
    }
}
```

`extend` 메서드의 첫 번째 인자는 드라이버의 이름이고, 두 번째 인자는 `$app`과 `$config` 변수를 받는 클로저입니다. 이 클로저는 반드시 `Illuminate\Filesystem\FilesystemAdapter` 인스턴스를 반환해야 합니다. `$config` 변수에는 지정한 디스크에 대해 `config/filesystems.php`에 정의된 값이 담겨 있습니다.

확장 서비스 프로바이더를 생성하고 등록한 후에는, `config/filesystems.php` 설정 파일에서 `dropbox` 드라이버를 사용할 수 있습니다.
