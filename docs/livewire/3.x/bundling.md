# 요청 번들링
Livewire에서 모든 컴포넌트 업데이트는 네트워크 요청을 발생시킵니다. 기본적으로 여러 컴포넌트가 동시에 업데이트를 트리거하면, 이들은 하나의 요청으로 번들링됩니다.

이로 인해 서버로의 네트워크 연결 수가 줄어들고, 서버 부하가 크게 감소할 수 있습니다.

성능 향상 외에도, 이 방식은 여러 컴포넌트 간의 협업이 필요한 내부 기능([Reactive Properties](/livewire/3.x/nesting#reactive-props), [Modelable Properties](/livewire/3.x/nesting#binding-to-child-data-using-wiremodel) 등)을 사용할 수 있게 해줍니다.

하지만 성능상의 이유로 이 번들링을 비활성화하고 싶을 때도 있습니다. 다음 페이지에서는 Livewire에서 이 동작을 커스터마이즈하는 다양한 방법을 설명합니다.

## 컴포넌트 요청 격리하기 {#isolating-component-requests}

Livewire의 `#[Isolate]` 클래스 속성을 사용하면 컴포넌트를 "격리"된 상태로 표시할 수 있습니다. 이렇게 하면 해당 컴포넌트가 서버 라운드트립을 수행할 때마다, 다른 컴포넌트 요청과 분리되어 동작하려고 시도합니다.

이 기능은 업데이트 비용이 많이 드는 경우에 유용하며, 이 컴포넌트의 업데이트를 다른 컴포넌트와 병렬로 실행하고 싶을 때 사용할 수 있습니다. 예를 들어, 여러 컴포넌트가 `wire:poll`을 사용하거나 페이지에서 이벤트를 수신하고 있다면, 업데이트 비용이 많이 드는 특정 컴포넌트를 격리하여 전체 요청이 지연되는 것을 방지할 수 있습니다.
```php
use Livewire\Attributes\Isolate;
use Livewire\Component;

#[Isolate] // [tl! highlight]
class ShowPost extends Component
{
    // ...
}
```

`#[Isolate]` 속성을 추가하면, 이 컴포넌트의 요청은 더 이상 다른 컴포넌트 업데이트와 함께 번들링되지 않습니다.

## 지연 컴포넌트는 기본적으로 격리됩니다 {#lazy-components-are-isolated-by-default}

한 페이지에 여러 컴포넌트가 "지연" 로드(`#[Lazy]` 속성 사용)되는 경우, 각 요청이 격리되어 병렬로 전송되는 것이 일반적으로 바람직합니다. 따라서 Livewire는 기본적으로 지연 업데이트를 격리합니다.

이 동작을 비활성화하려면, `#[Lazy]` 속성에 `isolate: false` 파라미터를 다음과 같이 전달할 수 있습니다:

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy(isolate: false)] // [tl! highlight]
class Revenue extends Component
{
    // ...
}
```

이제 동일한 페이지에 여러 개의 `Revenue` 컴포넌트가 있을 경우, 모든 10개의 업데이트가 하나로 묶여 단일 지연 로드 네트워크 요청으로 서버에 전송됩니다.
