---
title: Breadcrumbs 블레이드 컴포넌트
---
# [핵심개념.Blade컴포넌트] breadcrumbs
## 개요 {#overview}

breadcrumbs 컴포넌트는 사용자가 애플리케이션 내에서 현재 위치를 알 수 있도록 간단하고 선형적인 내비게이션을 렌더링하는 데 사용됩니다:

```blade
<x-filament::breadcrumbs :breadcrumbs="[
    '/' => '홈',
    '/dashboard' => '대시보드',
    '/dashboard/users' => '사용자',
    '/dashboard/users/create' => '사용자 생성',
]" />
```

배열의 키는 사용자가 클릭하여 이동할 수 있는 URL이고, 값은 각 링크에 표시될 텍스트입니다.
