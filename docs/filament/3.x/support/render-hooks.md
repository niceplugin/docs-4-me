---
title: 렌더 훅
---
# [핵심개념] 렌더 훅
## 개요 {#overview}

Filament은 프레임워크의 뷰 여러 지점에서 Blade 콘텐츠를 렌더링할 수 있도록 해줍니다. 이는 플러그인이 프레임워크에 HTML을 주입할 수 있게 해주어 유용합니다. 또한, Filament는 뷰를 퍼블리시하는 것을 권장하지 않으므로(변경 사항으로 인해 깨질 위험이 높아지기 때문), 사용자에게도 유용합니다.

## 렌더 후크 등록하기 {#registering-render-hooks}

렌더 후크를 등록하려면 서비스 프로바이더나 미들웨어에서 `FilamentView::registerRenderHook()`를 호출하면 됩니다. 첫 번째 인자는 렌더 후크의 이름이고, 두 번째 인자는 렌더될 콘텐츠를 반환하는 콜백입니다:

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

FilamentView::registerRenderHook(
    PanelsRenderHook::BODY_START,
    fn (): string => Blade::render('@livewire(\'livewire-ui-modal\')'),
);
```

파일에서 뷰 콘텐츠를 렌더할 수도 있습니다:

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Contracts\View\View;

FilamentView::registerRenderHook(
    PanelsRenderHook::BODY_START,
    fn (): View => view('impersonation-banner'),
);
```

## 사용 가능한 렌더 후크 {#available-render-hooks}

### 패널 빌더 렌더 훅 {#panel-builder-render-hooks}

```php
    use Filament\View\PanelsRenderHook;
```

- `PanelsRenderHook::AUTH_LOGIN_FORM_AFTER` - 로그인 폼 이후
- `PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE` - 로그인 폼 이전
- `PanelsRenderHook::AUTH_PASSWORD_RESET_REQUEST_FORM_AFTER` - 비밀번호 재설정 요청 폼 이후
- `PanelsRenderHook::AUTH_PASSWORD_RESET_REQUEST_FORM_BEFORE` - 비밀번호 재설정 요청 폼 이전
- `PanelsRenderHook::AUTH_PASSWORD_RESET_RESET_FORM_AFTER` - 비밀번호 재설정 폼 이후
- `PanelsRenderHook::AUTH_PASSWORD_RESET_RESET_FORM_BEFORE` - 비밀번호 재설정 폼 이전
- `PanelsRenderHook::AUTH_REGISTER_FORM_AFTER` - 회원가입 폼 이후
- `PanelsRenderHook::AUTH_REGISTER_FORM_BEFORE` - 회원가입 폼 이전
- `PanelsRenderHook::BODY_END` - `</body>` 바로 이전
- `PanelsRenderHook::BODY_START` - `<body>` 바로 이후
- `PanelsRenderHook::CONTENT_END` - 페이지 콘텐츠 이후, `<main>` 내부
- `PanelsRenderHook::CONTENT_START` - 페이지 콘텐츠 이전, `<main>` 내부
- `PanelsRenderHook::FOOTER` - 페이지의 푸터
- `PanelsRenderHook::GLOBAL_SEARCH_AFTER` - [글로벌 검색](../panels/resources/global-search) 컨테이너 이후, 상단바 내부
- `PanelsRenderHook::GLOBAL_SEARCH_BEFORE` - [글로벌 검색](../panels/resources/global-search) 컨테이너 이전, 상단바 내부
- `PanelsRenderHook::GLOBAL_SEARCH_END` - [글로벌 검색](../panels/resources/global-search) 컨테이너의 끝
- `PanelsRenderHook::GLOBAL_SEARCH_START` - [글로벌 검색](../panels/resources/global-search) 컨테이너의 시작
- `PanelsRenderHook::HEAD_END` - `</head>` 바로 이전
- `PanelsRenderHook::HEAD_START` - `<head>` 바로 이후
- `PanelsRenderHook::PAGE_END` - 페이지 콘텐츠 컨테이너의 끝, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_FOOTER_WIDGETS_AFTER` - 페이지 푸터 위젯 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_FOOTER_WIDGETS_BEFORE` - 페이지 푸터 위젯 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_HEADER_ACTIONS_AFTER` - 페이지 헤더 액션 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_HEADER_ACTIONS_BEFORE` - 페이지 헤더 액션 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_HEADER_WIDGETS_AFTER` - 페이지 헤더 위젯 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_HEADER_WIDGETS_BEFORE` - 페이지 헤더 위젯 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_START` - 페이지 콘텐츠 컨테이너의 시작, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_END_AFTER` - 페이지 서브 내비게이션 "end" 사이드바 위치 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_END_BEFORE` - 페이지 서브 내비게이션 "end" 사이드바 위치 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SELECT_AFTER` - 페이지 서브 내비게이션 선택(모바일용) 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SELECT_BEFORE` - 페이지 서브 내비게이션 선택(모바일용) 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SIDEBAR_AFTER` - 페이지 서브 내비게이션 사이드바 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SIDEBAR_BEFORE` - 페이지 서브 내비게이션 사이드바 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_START_AFTER` - 페이지 서브 내비게이션 "start" 사이드바 위치 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_START_BEFORE` - 페이지 서브 내비게이션 "start" 사이드바 위치 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_TOP_AFTER` - 페이지 서브 내비게이션 "top" 탭 위치 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_TOP_BEFORE` - 페이지 서브 내비게이션 "top" 탭 위치 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_AFTER` - 리소스 테이블 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_BEFORE` - 리소스 테이블 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABS_END` - 필터 탭의 끝(마지막 탭 이후), [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABS_START` - 필터 탭의 시작(첫 번째 탭 이전), [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_PAGES_MANAGE_RELATED_RECORDS_TABLE_AFTER` - 관계 매니저 테이블 이후, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_PAGES_MANAGE_RELATED_RECORDS_TABLE_BEFORE` - 관계 매니저 테이블 이전, [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_RELATION_MANAGER_AFTER` - 관계 매니저 테이블 이후, [페이지 또는 관계 매니저 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_RELATION_MANAGER_BEFORE` - 관계 매니저 테이블 이전, [페이지 또는 관계 매니저 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_TABS_END` - 리소스 탭의 끝(마지막 탭 이후), [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::RESOURCE_TABS_START` - 리소스 탭의 시작(첫 번째 탭 이전), [페이지 또는 리소스 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::SCRIPTS_AFTER` - 스크립트 정의 이후
- `PanelsRenderHook::SCRIPTS_BEFORE` - 스크립트 정의 이전
- `PanelsRenderHook::SIDEBAR_NAV_END` - [사이드바](../panels/navigation)에서 `</nav>` 바로 이전
- `PanelsRenderHook::SIDEBAR_NAV_START` - [사이드바](../panels/navigation)에서 `<nav>` 바로 이후
- `PanelsRenderHook::SIMPLE_PAGE_END` - 단순 페이지 콘텐츠 컨테이너의 끝, [페이지 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::SIMPLE_PAGE_START` - 단순 페이지 콘텐츠 컨테이너의 시작, [페이지 클래스에 범위 지정](#scoping-render-hooks) 가능
- `PanelsRenderHook::SIDEBAR_FOOTER` - 사이드바 하단에 고정, 콘텐츠 아래
- `PanelsRenderHook::STYLES_AFTER` - 스타일 정의 이후
- `PanelsRenderHook::STYLES_BEFORE` - 스타일 정의 이전
- `PanelsRenderHook::TENANT_MENU_AFTER` - [테넌트 메뉴](../panels/tenancy#customizing-the-tenant-menu) 이후
- `PanelsRenderHook::TENANT_MENU_BEFORE` - [테넌트 메뉴](../panels/tenancy#customizing-the-tenant-menu) 이전
- `PanelsRenderHook::TOPBAR_AFTER` - 상단바 아래
- `PanelsRenderHook::TOPBAR_BEFORE` - 상단바 위
- `PanelsRenderHook::TOPBAR_END` - 상단바 컨테이너의 끝
- `PanelsRenderHook::TOPBAR_START` - 상단바 컨테이너의 시작
- `PanelsRenderHook::USER_MENU_AFTER` - [사용자 메뉴](../panels/navigation#customizing-the-user-menu) 이후
- `PanelsRenderHook::USER_MENU_BEFORE` - [사용자 메뉴](../panels/navigation#customizing-the-user-menu) 이전
- `PanelsRenderHook::USER_MENU_PROFILE_AFTER` - [사용자 메뉴](../panels/navigation#customizing-the-user-menu)에서 프로필 항목 이후
- `PanelsRenderHook::USER_MENU_PROFILE_BEFORE` - [사용자 메뉴](../panels/navigation#customizing-the-user-menu)에서 프로필 항목 이전


### 테이블 빌더 렌더 후크 {#table-builder-render-hooks}

이 모든 렌더 후크는 [특정 범위로 지정](#scoping-render-hooks)하여 테이블 Livewire 컴포넌트 클래스에 적용할 수 있습니다. 패널 빌더를 사용할 때, 이러한 클래스는 리소스의 리스트 또는 관리 페이지, 혹은 관계 매니저일 수 있습니다. 테이블 위젯 또한 Livewire 컴포넌트 클래스입니다.

```php
    use Filament\Tables\View\TablesRenderHook;
```

- `TablesRenderHook::SELECTION_INDICATOR_ACTIONS_AFTER` - 선택 표시줄에서 "전체 선택" 및 "전체 선택 해제" 액션 버튼 뒤
- `TablesRenderHook::SELECTION_INDICATOR_ACTIONS_BEFORE` - 선택 표시줄에서 "전체 선택" 및 "전체 선택 해제" 액션 버튼 앞
- `TablesRenderHook::HEADER_AFTER` - 헤더 컨테이너 뒤
- `TablesRenderHook::HEADER_BEFORE` - 헤더 컨테이너 앞
- `TablesRenderHook::TOOLBAR_AFTER` - 툴바 컨테이너 뒤
- `TablesRenderHook::TOOLBAR_BEFORE` - 툴바 컨테이너 앞
- `TablesRenderHook::TOOLBAR_END` - 툴바의 끝
- `TablesRenderHook::TOOLBAR_GROUPING_SELECTOR_AFTER` - [그룹화](../tables/grouping) 선택자 뒤
- `TablesRenderHook::TOOLBAR_GROUPING_SELECTOR_BEFORE` - [그룹화](../tables/grouping) 선택자 앞
- `TablesRenderHook::TOOLBAR_REORDER_TRIGGER_AFTER` - [정렬](../tables/advanced#reordering-records) 트리거 뒤
- `TablesRenderHook::TOOLBAR_REORDER_TRIGGER_BEFORE` - [정렬](../tables/advanced#reordering-records) 트리거 앞
- `TablesRenderHook::TOOLBAR_SEARCH_AFTER` - [검색](../tables/getting-started#making-columns-sortable-and-searchable) 컨테이너 뒤
- `TablesRenderHook::TOOLBAR_SEARCH_BEFORE` - [검색](../tables/getting-started#making-columns-sortable-and-searchable) 컨테이너 앞
- `TablesRenderHook::TOOLBAR_START` - 툴바의 시작
- `TablesRenderHook::TOOLBAR_TOGGLE_COLUMN_TRIGGER_AFTER` - [컬럼 토글](../tables/columns/getting-started#toggling-column-visibility) 트리거 뒤
- `TablesRenderHook::TOOLBAR_TOGGLE_COLUMN_TRIGGER_BEFORE` - [컬럼 토글](../tables/columns/getting-started#toggling-column-visibility) 트리거 앞


### 위젯 렌더 훅 {#widgets-render-hooks}

```php
    use Filament\Widgets\View\WidgetsRenderHook;
```

- `WidgetsRenderHook::TABLE_WIDGET_END` - [테이블 위젯](../panels/dashboard#table-widgets)의 끝, 테이블 자체 이후에 실행되며, [테이블 위젯 클래스에 범위 지정](#scoping-render-hooks)도 가능
- `WidgetsRenderHook::TABLE_WIDGET_START` - [테이블 위젯](../panels/dashboard#table-widgets)의 시작, 테이블 자체 이전에 실행되며, [테이블 위젯 클래스에 범위 지정](#scoping-render-hooks)도 가능


## 렌더 후크 범위 지정 {#scoping-render-hooks}

일부 렌더 후크는 "범위(scope)"를 지정할 수 있어, 특정 페이지나 Livewire 컴포넌트에서만 출력되도록 할 수 있습니다. 예를 들어, 한 페이지만을 위한 렌더 후크를 등록하고 싶을 수 있습니다. 이를 위해 `registerRenderHook()`의 두 번째 인자로 페이지나 컴포넌트의 클래스를 전달하면 됩니다:

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (): View => view('warning-banner'),
    scopes: \App\Filament\Resources\UserResource\Pages\EditUser::class,
);
```

렌더 후크를 여러 범위에 등록하고 싶다면, 범위 배열을 전달할 수도 있습니다:

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (): View => view('warning-banner'),
    scopes: [
        \App\Filament\Resources\UserResource\Pages\CreateUser::class,
        \App\Filament\Resources\UserResource\Pages\EditUser::class,
    ],
);
```

[패널 빌더](#panel-builder-render-hooks)를 위한 일부 렌더 후크는 리소스의 모든 페이지에 후크를 범위 지정할 수 있습니다:

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (): View => view('warning-banner'),
    scopes: \App\Filament\Resources\UserResource::class,
);
```

### 렌더 훅 내부에서 현재 활성화된 스코프 가져오기 {#retrieving-the-currently-active-scopes-inside-the-render-hook}

`$scopes`는 렌더 훅 함수에 전달되며, 이를 사용하여 렌더 훅이 어떤 페이지나 컴포넌트에서 렌더링되고 있는지 확인할 수 있습니다:

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (array $scopes): View => view('warning-banner', ['scopes' => $scopes]),
    scopes: \App\Filament\Resources\UserResource::class,
);
```

## 렌더링 훅 {#rendering-hooks}

플러그인 개발자는 사용자에게 렌더링 훅을 노출하는 것이 유용할 수 있습니다. 어디에도 별도로 등록할 필요 없이, Blade에서 다음과 같이 출력하면 됩니다:

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START) }}
```

렌더링 훅에 범위를 제공하려면, `renderHook()`의 두 번째 인수로 전달할 수 있습니다. 예를 들어, 훅이 Livewire 컴포넌트 내부에 있다면, `static::class`를 사용하여 컴포넌트의 클래스를 전달할 수 있습니다:

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START, scopes: $this->getRenderHookScopes()) }}
```

여러 개의 범위를 배열로 전달할 수도 있으며, 범위 중 하나라도 일치하는 모든 렌더링 훅이 렌더링됩니다:

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START, scopes: [static::class, \App\Filament\Resources\UserResource::class]) }}
```
