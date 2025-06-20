---
title: 스타일 커스터마이제이션
---
# [핵심개념] 스타일 커스터마이즈
## 개요 {#overview}

Filament는 다양한 HTML 요소를 CSS로 커스터마이즈할 수 있도록 CSS "hook" 클래스를 사용합니다.

## 훅 클래스 찾기 {#discovering-hook-classes}

Filament UI 전체에 걸쳐 모든 훅 클래스를 문서화할 수도 있지만, 이는 많은 작업이 필요하고 아마도 여러분에게 크게 유용하지 않을 수 있습니다. 대신, 브라우저의 개발자 도구를 사용하여 커스터마이즈하고 싶은 요소를 검사한 다음, 해당 요소를 타겟팅할 수 있도록 훅 클래스를 사용하는 것을 권장합니다.

모든 훅 클래스는 `fi-`로 시작하므로 쉽게 식별할 수 있습니다. 보통 클래스 목록의 맨 앞에 위치해 있어 찾기 쉽지만, JavaScript나 Blade로 조건부로 적용해야 할 경우에는 목록의 더 아래쪽에 있을 수도 있습니다.

원하는 훅 클래스를 찾지 못했다면, 이를 우회하여 해킹하지 마세요. 이는 향후 릴리즈에서 스타일 커스터마이징이 깨질 수 있는 변경에 노출될 수 있습니다. 대신, 필요한 훅 클래스를 추가하는 pull request를 열어주세요. 저희가 네이밍 일관성을 유지하는 데 도움을 드릴 수 있습니다. 이러한 pull request를 위해 Filament 저장소를 로컬에 내려받을 필요도 없으며, GitHub에서 Blade 파일을 직접 수정하실 수 있습니다.

## 훅 클래스에 스타일 적용하기 {#applying-styles-to-hook-classes}

예를 들어, 사이드바의 색상을 커스터마이즈하고 싶다면, 브라우저의 개발자 도구에서 사이드바 요소를 검사하여 `fi-sidebar`가 사용되는 것을 확인한 후, 다음과 같이 앱에 CSS를 추가할 수 있습니다:

```css
.fi-sidebar {
    background-color: #fafafa;
}
```

또한, Filament는 Tailwind CSS를 기반으로 구축되어 있으므로, Tailwind의 `@apply` 지시어를 사용하여 Filament 요소에 Tailwind 클래스를 적용할 수 있습니다:

```css
.fi-sidebar {
    @apply bg-gray-50 dark:bg-gray-950;
}
```

기존 스타일을 덮어써야 할 때는 가끔 `!important` 수식어를 사용해야 할 수도 있지만, 이는 스타일 유지보수를 어렵게 만들 수 있으므로 가급적 적게 사용하세요:

```css
.fi-sidebar {
    @apply bg-gray-50 dark:bg-gray-950 !important;
}
```

특정 Tailwind 클래스에만 `!important`를 적용하고 싶다면, 클래스 이름 앞에 `!`를 붙여서 조금 더 덜 침습적으로 적용할 수 있습니다:

```css
.fi-sidebar {
    @apply !bg-gray-50 dark:!bg-gray-950;
}
```

## 자주 사용하는 훅 클래스 약어 {#common-hook-class-abbreviations}

저희는 훅 클래스를 짧고 읽기 쉽게 유지하기 위해 몇 가지 일반적인 약어를 사용합니다:

- `fi`는 "Filament"의 약자입니다
- `fi-ac`는 Actions 패키지에서 사용되는 클래스를 나타냅니다
- `fi-fo`는 Form Builder 패키지에서 사용되는 클래스를 나타냅니다
- `fi-in`는 Infolist Builder 패키지에서 사용되는 클래스를 나타냅니다
- `fi-no`는 Notifications 패키지에서 사용되는 클래스를 나타냅니다
- `fi-ta`는 Table Builder 패키지에서 사용되는 클래스를 나타냅니다
- `fi-wi`는 Widgets 패키지에서 사용되는 클래스를 나타냅니다
- `btn`은 "button"의 약자입니다
- `col`은 "column"의 약자입니다
- `ctn`은 "container"의 약자입니다
- `wrp`는 "wrapper"의 약자입니다

## Blade 뷰 퍼블리싱 {#publishing-blade-views}

내부 Blade 뷰를 애플리케이션에 퍼블리시하여 커스터마이즈하고 싶은 유혹을 느낄 수 있습니다. 하지만 이는 향후 업데이트에서 애플리케이션에 깨지는 변경을 도입할 수 있으므로 권장하지 않습니다. 가능한 한 [CSS 훅 클래스](#applying-styles-to-hook-classes)를 사용하세요.

그래도 Blade 뷰를 퍼블리시하기로 결정했다면, 모든 Filament 패키지를 `composer.json` 파일에서 특정 버전으로 고정하고, Filament를 수동으로 업데이트할 때마다 이 숫자를 올리고 전체 애플리케이션을 테스트하세요. 이렇게 하면 깨지는 변경을 안전하게 식별할 수 있습니다.
