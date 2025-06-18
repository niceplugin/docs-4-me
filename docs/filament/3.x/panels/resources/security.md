---
title: 보안
---
# [패널.리소스] 보안
## 모델 속성 보호하기 {#protecting-model-attributes}

Filament은 모델의 `$hidden` 속성에 포함되지 않은 모든 모델 속성을 JavaScript에 노출합니다. 이는 Livewire의 모델 바인딩 동작과 동일합니다. 이 기능을 유지하는 이유는 폼 필드가 처음 로드된 후에도 동적으로 추가 및 제거할 수 있도록 하면서, 필요한 데이터를 보존하기 위함입니다.

> 속성이 JavaScript에서 보일 수는 있지만, 실제로 사용자가 수정할 수 있는 것은 폼 필드가 있는 속성뿐입니다. 이는 대량 할당(mass assignment)과는 관련이 없습니다.

Edit 및 View 페이지에서 특정 속성을 JavaScript에서 제거하려면, [ `mutateFormDataBeforeFill()` 메서드](editing-records#customizing-data-before-filling-the-form)를 오버라이드할 수 있습니다:

```php
protected function mutateFormDataBeforeFill(array $data): array
{
    unset($data['is_admin']);

    return $data;
}
```

이 예시에서는 폼에서 사용되지 않는 `is_admin` 속성을 JavaScript에서 제거하고 있습니다.
