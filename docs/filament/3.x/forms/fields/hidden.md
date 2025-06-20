---
title: Hidden
---
# [폼.필드] Hidden
## 개요 {#overview}

hidden 컴포넌트는 폼에 값을 저장하는 숨겨진 필드를 생성할 수 있게 해줍니다.

```php
use Filament\Forms\Components\Hidden;

Hidden::make('token')
```

이 필드의 값은 사용자가 브라우저의 개발자 도구를 사용할 경우 여전히 수정할 수 있다는 점에 유의하세요. 이 컴포넌트를 민감하거나 읽기 전용 정보 저장 용도로 사용해서는 안 됩니다.
