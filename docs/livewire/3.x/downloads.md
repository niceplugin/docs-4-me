# [기능] 파일 다운로드
Livewire에서 파일 다운로드는 Laravel 자체에서와 거의 동일하게 작동합니다. 일반적으로 Livewire 컴포넌트 내에서 어떤 Laravel 다운로드 유틸리티도 사용할 수 있으며, 기대한 대로 동작해야 합니다.

하지만 내부적으로 파일 다운로드는 표준 Laravel 애플리케이션과는 다르게 처리됩니다. Livewire를 사용할 때 파일의 내용은 Base64로 인코딩되어 프론트엔드로 전송되고, 클라이언트에서 다시 바이너리로 디코딩되어 직접 다운로드됩니다.

## 기본 사용법 {#basic-usage}

Livewire에서 파일 다운로드를 트리거하는 것은 표준 Laravel 다운로드 응답을 반환하는 것만큼 간단합니다.

아래는 인보이스 PDF를 다운로드할 수 있는 "Download" 버튼이 포함된 `ShowInvoice` 컴포넌트의 예시입니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Invoice;

class ShowInvoice extends Component
{
    public Invoice $invoice;

    public function mount(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function download()
    {
        return response()->download( // [!code highlight:3]
            $this->invoice->file_path, 'invoice.pdf'
        );
    }

    public function render()
    {
        return view('livewire.show-invoice');
    }
}
```

```blade
<div>
    <h1>{{ $invoice->title }}</h1>

    <span>{{ $invoice->date }}</span>
    <span>{{ $invoice->amount }}</span>

    <button type="button" wire:click="download">Download</button> <!-- [!code highlight] -->
</div>
```

Laravel 컨트롤러에서와 마찬가지로, `Storage` 파사드를 사용하여 다운로드를 시작할 수도 있습니다:

```php
public function download()
{
    return Storage::disk('invoices')->download('invoice.csv');
}
```

## 스트리밍 다운로드 {#streaming-downloads}

Livewire는 다운로드를 스트리밍할 수도 있지만, 실제로 완전히 스트리밍되는 것은 아닙니다. 파일의 내용이 모두 수집되어 브라우저로 전달될 때까지 다운로드가 시작되지 않습니다:

```php
public function download()
{
    return response()->streamDownload(function () {
        echo '...'; // 다운로드 내용을 직접 echo로 출력...
    }, 'invoice.pdf');
}
```

## 파일 다운로드 테스트 {#testing-file-downloads}

Livewire는 또한 `->assertFileDownloaded()` 메서드를 제공하여 주어진 이름의 파일이 다운로드되었는지 쉽게 테스트할 수 있습니다:

```php
use App\Models\Invoice;

public function test_can_download_invoice()
{
    $invoice = Invoice::factory();

    Livewire::test(ShowInvoice::class)
        ->call('download')
        ->assertFileDownloaded('invoice.pdf');
}
```

또한 `->assertNoFileDownloaded()` 메서드를 사용하여 파일이 다운로드되지 않았는지도 테스트할 수 있습니다:

```php
use App\Models\Invoice;

public function test_does_not_download_invoice_if_unauthorised()
{
    $invoice = Invoice::factory();

    Livewire::test(ShowInvoice::class)
        ->call('download')
        ->assertNoFileDownloaded();
}
```
