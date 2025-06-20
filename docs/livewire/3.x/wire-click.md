# wire:click
Livewire는 사용자가 페이지의 특정 요소를 클릭할 때 컴포넌트 메서드(즉, 액션)를 호출할 수 있도록 간단한 `wire:click` 디렉티브를 제공합니다.

예를 들어, 아래의 `ShowInvoice` 컴포넌트가 있다고 가정해봅시다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Invoice;

class ShowInvoice extends Component
{
    public Invoice $invoice;

    public function download()
    {
        return response()->download(
            $this->invoice->file_path, 'invoice.pdf'
        );
    }
}
```

위 클래스의 `download()` 메서드는 사용자가 "Download Invoice" 버튼을 클릭할 때 `wire:click="download"`를 추가하여 트리거할 수 있습니다:

```html
<button type="button" wire:click="download"> <!-- [!code highlight] -->
    Download Invoice
</button>
```

## 링크에서 `wire:click` 사용하기 {#using-wireclick-on-links}

`<a>` 태그에서 `wire:click`을 사용할 때는, 브라우저의 기본 링크 동작을 방지하기 위해 반드시 `.prevent`를 추가해야 합니다. 그렇지 않으면 브라우저가 해당 링크로 이동하여 페이지의 URL이 변경됩니다.

```html
<a href="#" wire:click.prevent="...">
```

## 더 깊이 알아보기 {#going-deeper}

`wire:click` 디렉티브는 Livewire에서 사용할 수 있는 다양한 이벤트 리스너 중 하나일 뿐입니다. 이 디렉티브(및 다른 이벤트 리스너)의 모든 기능에 대한 전체 문서는 [Livewire 액션 문서 페이지](/livewire/3.x/actions)에서 확인할 수 있습니다.
