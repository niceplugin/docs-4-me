---
title: 아이콘
---
# [핵심개념] 아이콘
## 개요 {#overview}

아이콘은 Filament UI 전체에서 사용자 경험의 핵심 부분을 시각적으로 전달하기 위해 사용됩니다. 아이콘을 렌더링하기 위해 우리는 Blade UI Kit의 [Blade Icons](https://github.com/blade-ui-kit/blade-icons) 패키지를 사용합니다.

이들은 다양한 Blade Icons 패키지에서 [사용 가능한 모든 아이콘을 검색할 수 있는 웹사이트](https://blade-ui-kit.com/blade-icons?set=1#search)를 제공합니다. 각 패키지는 선택할 수 있는 서로 다른 아이콘 세트를 포함하고 있습니다.

## 커스텀 SVG를 아이콘으로 사용하기 {#using-custom-svgs-as-icons}

[Blade Icons](https://github.com/blade-ui-kit/blade-icons) 패키지는 커스텀 SVG를 아이콘으로 등록할 수 있도록 해줍니다. 이는 Filament에서 자신만의 커스텀 아이콘을 사용하고 싶을 때 유용합니다.

먼저, Blade Icons 설정 파일을 퍼블리시하세요:

```bash
php artisan vendor:publish --tag=blade-icons
```

이제 `config/blade-icons.php` 파일을 열고, `sets` 배열에서 `default` 세트의 주석을 해제하세요.

이제 설정 파일에 기본 세트가 존재하므로, 원하는 아이콘을 애플리케이션의 `resources/svg` 디렉터리에 넣기만 하면 됩니다. 예를 들어, `resources/svg` 디렉터리에 `star.svg`라는 SVG 파일을 넣으면 Filament 어디에서나 `icon-star`로 참조할 수 있습니다. `icon-` 접두사는 `config/blade-icons.php` 파일에서 설정할 수 있습니다. 또한, Blade 뷰에서 [`@svg('icon-star')` 디렉티브](https://github.com/blade-ui-kit/blade-icons#directive)를 사용하여 커스텀 아이콘을 렌더링할 수도 있습니다.

## 기본 아이콘 교체하기 {#replacing-the-default-icons}

Filament에는 UI에서 기본적으로 사용되는 모든 아이콘을 자신의 아이콘으로 교체할 수 있는 아이콘 관리 시스템이 포함되어 있습니다. 이는 `AppServiceProvider`와 같은 서비스 프로바이더의 `boot()` 메서드나, 아이콘 전용 서비스 프로바이더에서 이루어집니다. Heroicons을 다른 세트로 교체하는 플러그인을 만들고 싶다면, 유사한 서비스 프로바이더가 포함된 Laravel 패키지를 만들어서 충분히 할 수 있습니다.

아이콘을 교체하려면 `FilamentIcon` 파사드를 사용할 수 있습니다. 이 파사드에는 교체할 아이콘 배열을 받는 `register()` 메서드가 있습니다. 배열의 키는 Filament UI에서 아이콘을 식별하는 고유한 [아이콘 별칭](#available-icon-aliases)이고, 값은 대신 교체할 Blade 아이콘의 이름입니다. 또는, Blade 뷰에서 아이콘을 렌더링하기 위해 아이콘 이름 대신 HTML을 사용할 수도 있습니다:

```php
use Filament\Support\Facades\FilamentIcon;

FilamentIcon::register([
    'panels::topbar.global-search.field' => 'fas-magnifying-glass',
    'panels::sidebar.group.collapse-button' => view('icons.chevron-up'),
]);
```

### 플러그인에서 사용자가 아이콘을 커스터마이즈할 수 있도록 허용하기 {#allowing-users-to-customize-icons-from-your-plugin}

Filament 플러그인을 만들었다면, 사용자가 모든 핵심 Filament 패키지와 마찬가지로 아이콘을 커스터마이즈할 수 있기를 원할 수 있습니다. 이는 수동 `@svg()` 사용을 `<x-filament::icon>` Blade 컴포넌트로 교체하면 가능합니다. 이 컴포넌트는 아이콘 별칭, 기본적으로 사용될 SVG 아이콘 이름, 그리고 클래스나 HTML 속성을 전달할 수 있습니다:

```blade
<x-filament::icon
    alias="panels::topbar.global-search.field"
    icon="heroicon-m-magnifying-glass"
    wire:target="search"
    class="h-5 w-5 text-gray-500 dark:text-gray-400"
/>
```

또는, 기본 아이콘 이름을 정의하는 대신 컴포넌트의 슬롯에 SVG 요소를 전달할 수도 있습니다:

```blade
<x-filament::icon
    alias="panels::topbar.global-search.field"
    wire:target="search"
    class="h-5 w-5 text-gray-500 dark:text-gray-400"
>
    <svg>
        <!-- ... -->
    </svg>
</x-filament::icon>
```

## 사용 가능한 아이콘 별칭 {#available-icon-aliases}

### 패널 빌더 아이콘 별칭 {#panel-builder-icon-aliases}

- `panels::global-search.field` - 글로벌 검색 필드
- `panels::pages.dashboard.actions.filter` - 대시보드 필터 액션의 트리거 버튼
- `panels::pages.dashboard.navigation-item` - 대시보드 페이지 네비게이션 아이템
- `panels::pages.password-reset.request-password-reset.actions.login` - 비밀번호 재설정 요청 페이지의 로그인 액션 트리거 버튼
- `panels::pages.password-reset.request-password-reset.actions.login.rtl` - 비밀번호 재설정 요청 페이지의 로그인 액션 트리거 버튼 (오른쪽-왼쪽 방향)
- `panels::resources.pages.edit-record.navigation-item` - 리소스 레코드 편집 페이지 네비게이션 아이템
- `panels::resources.pages.manage-related-records.navigation-item` - 리소스 관련 레코드 관리 페이지 네비게이션 아이템
- `panels::resources.pages.view-record.navigation-item` - 리소스 레코드 보기 페이지 네비게이션 아이템
- `panels::sidebar.collapse-button` - 사이드바를 접는 버튼
- `panels::sidebar.collapse-button.rtl` - 사이드바를 접는 버튼 (오른쪽-왼쪽 방향)
- `panels::sidebar.expand-button` - 사이드바를 펼치는 버튼
- `panels::sidebar.expand-button.rtl` - 사이드바를 펼치는 버튼 (오른쪽-왼쪽 방향)
- `panels::sidebar.group.collapse-button` - 사이드바 그룹 접기 버튼
- `panels::tenant-menu.billing-button` - 테넌트 메뉴의 결제 버튼
- `panels::tenant-menu.profile-button` - 테넌트 메뉴의 프로필 버튼
- `panels::tenant-menu.registration-button` - 테넌트 메뉴의 등록 버튼
- `panels::tenant-menu.toggle-button` - 테넌트 메뉴 토글 버튼
- `panels::theme-switcher.light-button` - 테마 스위처에서 라이트 테마로 전환하는 버튼
- `panels::theme-switcher.dark-button` - 테마 스위처에서 다크 테마로 전환하는 버튼
- `panels::theme-switcher.system-button` - 테마 스위처에서 시스템 테마로 전환하는 버튼
- `panels::topbar.close-sidebar-button` - 사이드바를 닫는 버튼
- `panels::topbar.open-sidebar-button` - 사이드바를 여는 버튼
- `panels::topbar.group.toggle-button` - 상단바 그룹 토글 버튼
- `panels::topbar.open-database-notifications-button` - 데이터베이스 알림 모달을 여는 버튼
- `panels::user-menu.profile-item` - 사용자 메뉴의 프로필 아이템
- `panels::user-menu.logout-button` - 사용자 메뉴의 로그아웃 버튼
- `panels::widgets.account.logout-button` - 계정 위젯의 로그아웃 버튼
- `panels::widgets.filament-info.open-documentation-button` - Filament 정보 위젯에서 문서 열기 버튼
- `panels::widgets.filament-info.open-github-button` - Filament 정보 위젯에서 GitHub 열기 버튼

### 폼 빌더 아이콘 별칭 {#form-builder-icon-aliases}

- `forms::components.builder.actions.clone` - 빌더 아이템의 복제 액션 트리거 버튼
- `forms::components.builder.actions.collapse` - 빌더 아이템의 접기 액션 트리거 버튼
- `forms::components.builder.actions.delete` - 빌더 아이템의 삭제 액션 트리거 버튼
- `forms::components.builder.actions.expand` - 빌더 아이템의 펼치기 액션 트리거 버튼
- `forms::components.builder.actions.move-down` - 빌더 아이템의 아래로 이동 액션 트리거 버튼
- `forms::components.builder.actions.move-up` - 빌더 아이템의 위로 이동 액션 트리거 버튼
- `forms::components.builder.actions.reorder` - 빌더 아이템의 순서 변경 액션 트리거 버튼
- `forms::components.checkbox-list.search-field` - 체크박스 리스트의 검색 입력
- `forms::components.file-upload.editor.actions.drag-crop` - 파일 업로드 에디터의 드래그 크롭 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.drag-move` - 파일 업로드 에디터의 드래그 이동 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.flip-horizontal` - 파일 업로드 에디터의 수평 뒤집기 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.flip-vertical` - 파일 업로드 에디터의 수직 뒤집기 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.move-down` - 파일 업로드 에디터의 아래로 이동 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.move-left` - 파일 업로드 에디터의 왼쪽으로 이동 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.move-right` - 파일 업로드 에디터의 오른쪽으로 이동 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.move-up` - 파일 업로드 에디터의 위로 이동 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.rotate-left` - 파일 업로드 에디터의 왼쪽으로 회전 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.rotate-right` - 파일 업로드 에디터의 오른쪽으로 회전 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.zoom-100` - 파일 업로드 에디터의 100% 확대 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.zoom-in` - 파일 업로드 에디터의 확대 액션 트리거 버튼
- `forms::components.file-upload.editor.actions.zoom-out` - 파일 업로드 에디터의 축소 액션 트리거 버튼
- `forms::components.key-value.actions.delete` - 키-값 필드 아이템의 삭제 액션 트리거 버튼
- `forms::components.key-value.actions.reorder` - 키-값 필드 아이템의 순서 변경 액션 트리거 버튼
- `forms::components.repeater.actions.clone` - 리피터 아이템의 복제 액션 트리거 버튼
- `forms::components.repeater.actions.collapse` - 리피터 아이템의 접기 액션 트리거 버튼
- `forms::components.repeater.actions.delete` - 리피터 아이템의 삭제 액션 트리거 버튼
- `forms::components.repeater.actions.expand` - 리피터 아이템의 펼치기 액션 트리거 버튼
- `forms::components.repeater.actions.move-down` - 리피터 아이템의 아래로 이동 액션 트리거 버튼
- `forms::components.repeater.actions.move-up` - 리피터 아이템의 위로 이동 액션 트리거 버튼
- `forms::components.repeater.actions.reorder` - 리피터 아이템의 순서 변경 액션 트리거 버튼
- `forms::components.select.actions.create-option` - 셀렉트 필드의 옵션 생성 액션 트리거 버튼
- `forms::components.select.actions.edit-option` - 셀렉트 필드의 옵션 편집 액션 트리거 버튼
- `forms::components.text-input.actions.hide-password` - 텍스트 입력 필드의 비밀번호 숨기기 액션 트리거 버튼
- `forms::components.text-input.actions.show-password` - 텍스트 입력 필드의 비밀번호 표시 액션 트리거 버튼
- `forms::components.toggle-buttons.boolean.false` - `boolean()` 토글 버튼 필드의 "거짓" 옵션
- `forms::components.toggle-buttons.boolean.true` - `boolean()` 토글 버튼 필드의 "참" 옵션
- `forms::components.wizard.completed-step` - 위저드의 완료된 단계

### 테이블 빌더 아이콘 별칭 {#table-builder-icon-aliases}

- `tables::actions.disable-reordering` - 순서 변경 비활성화 액션 트리거 버튼
- `tables::actions.enable-reordering` - 순서 변경 활성화 액션 트리거 버튼
- `tables::actions.filter` - 필터 액션 트리거 버튼
- `tables::actions.group` - 레코드 그룹화 액션 트리거 버튼
- `tables::actions.open-bulk-actions` - 일괄 액션 열기 액션 트리거 버튼
- `tables::actions.toggle-columns` - 컬럼 토글 액션 트리거 버튼
- `tables::columns.collapse-button` - 컬럼 접기 버튼
- `tables::columns.icon-column.false` - 아이콘 컬럼의 거짓 상태
- `tables::columns.icon-column.true` - 아이콘 컬럼의 참 상태
- `tables::empty-state` - 빈 상태 아이콘
- `tables::filters.query-builder.constraints.boolean` - 쿼리 빌더의 불리언 제약조건 기본 아이콘
- `tables::filters.query-builder.constraints.date` - 쿼리 빌더의 날짜 제약조건 기본 아이콘
- `tables::filters.query-builder.constraints.number` - 쿼리 빌더의 숫자 제약조건 기본 아이콘
- `tables::filters.query-builder.constraints.relationship` - 쿼리 빌더의 관계 제약조건 기본 아이콘
- `tables::filters.query-builder.constraints.select` - 쿼리 빌더의 셀렉트 제약조건 기본 아이콘
- `tables::filters.query-builder.constraints.text` - 쿼리 빌더의 텍스트 제약조건 기본 아이콘
- `tables::filters.remove-all-button` - 모든 필터 제거 버튼
- `tables::grouping.collapse-button` - 레코드 그룹 접기 버튼
- `tables::header-cell.sort-asc-button` - 오름차순 정렬된 컬럼의 정렬 버튼
- `tables::header-cell.sort-button` - 현재 정렬되지 않은 컬럼의 정렬 버튼
- `tables::header-cell.sort-desc-button` - 내림차순 정렬된 컬럼의 정렬 버튼
- `tables::reorder.handle` - 드래그 앤 드롭으로 레코드 순서를 변경할 때 잡는 핸들
- `tables::search-field` - 검색 입력

### 알림 아이콘 별칭 {#notifications-icon-aliases}

- `notifications::database.modal.empty-state` - 데이터베이스 알림 모달의 빈 상태
- `notifications::notification.close-button` - 알림 닫기 버튼
- `notifications::notification.danger` - 위험 알림
- `notifications::notification.info` - 정보 알림
- `notifications::notification.success` - 성공 알림
- `notifications::notification.warning` - 경고 알림

### 액션 아이콘 별칭 {#actions-icon-aliases}

- `actions::action-group` - 액션 그룹 트리거 버튼
- `actions::create-action.grouped` - 그룹화된 생성 액션 트리거 버튼
- `actions::delete-action` - 삭제 액션 트리거 버튼
- `actions::delete-action.grouped` - 그룹화된 삭제 액션 트리거 버튼
- `actions::delete-action.modal` - 삭제 액션 모달
- `actions::detach-action` - 분리 액션 트리거 버튼
- `actions::detach-action.modal` - 분리 액션 모달
- `actions::dissociate-action` - 연결 해제 액션 트리거 버튼
- `actions::dissociate-action.modal` - 연결 해제 액션 모달
- `actions::edit-action` - 편집 액션 트리거 버튼
- `actions::edit-action.grouped` - 그룹화된 편집 액션 트리거 버튼
- `actions::export-action.grouped` - 그룹화된 내보내기 액션 트리거 버튼
- `actions::force-delete-action` - 강제 삭제 액션 트리거 버튼
- `actions::force-delete-action.grouped` - 그룹화된 강제 삭제 액션 트리거 버튼
- `actions::force-delete-action.modal` - 강제 삭제 액션 모달
- `actions::import-action.grouped` - 그룹화된 가져오기 액션 트리거 버튼
- `actions::modal.confirmation` - 확인이 필요한 액션의 모달
- `actions::replicate-action` - 복제 액션 트리거 버튼
- `actions::replicate-action.grouped` - 그룹화된 복제 액션 트리거 버튼
- `actions::restore-action` - 복원 액션 트리거 버튼
- `actions::restore-action.grouped` - 그룹화된 복원 액션 트리거 버튼
- `actions::restore-action.modal` - 복원 액션 모달
- `actions::view-action` - 보기 액션 트리거 버튼
- `actions::view-action.grouped` - 그룹화된 보기 액션 트리거 버튼

### 인포리스트 빌더 아이콘 별칭 {#infolist-builder-icon-aliases}

- `infolists::components.icon-entry.false` - 아이콘 엔트리의 거짓 상태
- `infolists::components.icon-entry.true` - 아이콘 엔트리의 참 상태

### UI 컴포넌트 아이콘 별칭 {#ui-components-icon-aliases}

- `badge.delete-button` - 배지 삭제 버튼
- `breadcrumbs.separator` - 브레드크럼 사이 구분자
- `breadcrumbs.separator.rtl` - 브레드크럼 사이 구분자 (오른쪽-왼쪽 방향)
- `modal.close-button` - 모달 닫기 버튼
- `pagination.first-button` - 첫 페이지로 이동 버튼
- `pagination.first-button.rtl` - 첫 페이지로 이동 버튼 (오른쪽-왼쪽 방향)
- `pagination.last-button` - 마지막 페이지로 이동 버튼
- `pagination.last-button.rtl` - 마지막 페이지로 이동 버튼 (오른쪽-왼쪽 방향)
- `pagination.next-button` - 다음 페이지로 이동 버튼
- `pagination.next-button.rtl` - 다음 페이지로 이동 버튼 (오른쪽-왼쪽 방향)
- `pagination.previous-button` - 이전 페이지로 이동 버튼
- `pagination.previous-button.rtl` - 이전 페이지로 이동 버튼 (오른쪽-왼쪽 방향)
- `section.collapse-button` - 섹션 접기 버튼
