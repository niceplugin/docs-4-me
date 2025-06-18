export const sidebar_filament = {
  '/filament/': {
    items: [
      {
        text: '패널',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/panels/installation" },
          { text: "시작하기", link: "/filament/3.x/panels/getting-started" },
          {
            text: '리소스',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/panels/resources/getting-started" },
              { text: "레코드 목록", link: "/filament/3.x/panels/resources/listing-records" },
              { text: "레코드 생성", link: "/filament/3.x/panels/resources/creating-records" },
              { text: "레코드 편집", link: "/filament/3.x/panels/resources/editing-records" },
              { text: "레코드 보기", link: "/filament/3.x/panels/resources/viewing-records" },
              { text: "레코드 삭제", link: "/filament/3.x/panels/resources/deleting-records" },
              { text: "관계 관리", link: "/filament/3.x/panels/resources/relation-managers" },
              { text: "전역 검색", link: "/filament/3.x/panels/resources/global-search" },
              { text: "위젯", link: "/filament/3.x/panels/resources/widgets" },
              { text: "커스텀 페이지", link: "/filament/3.x/panels/resources/custom-pages" },
              { text: "보안", link: "/filament/3.x/panels/resources/security" },
            ]
          },
          { text: "페이지", link: "/filament/3.x/panels/pages" },
          { text: "대시보드", link: "/filament/3.x/panels/dashboard" },
          { text: "네비게이션", link: "/filament/3.x/panels/navigation" },
          { text: "알림", link: "/filament/3.x/panels/notifications" },
          { text: "사용자", link: "/filament/3.x/panels/users" },
          { text: "설정", link: "/filament/3.x/panels/configuration" },
          { text: "클러스터", link: "/filament/3.x/panels/clusters" },
          { text: "멀티 테넌시", link: "/filament/3.x/panels/tenancy" },
          { text: "테마", link: "/filament/3.x/panels/themes" },
          { text: "플러그인 개발", link: "/filament/3.x/panels/plugins" },
          { text: "테스트", link: "/filament/3.x/panels/testing" },
          { text: "v2.x에서 업그레이드", link: "https://filamentphp.com/docs/3.x/panels/upgrade-guide" },
        ]
      },
      {
        text: '테이블',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/tables/installation" },
          { text: "시작하기", link: "/filament/3.x/tables/getting-started" },
          {
            text: '컬럼',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/tables/columns/getting-started" },
              { text: "TextColumn", link: "/filament/3.x/tables/columns/text" },
              { text: "IconColumn", link: "/filament/3.x/tables/columns/icon" },
              { text: "ImageColumn", link: "/filament/3.x/tables/columns/image" },
              { text: "ColorColumn", link: "/filament/3.x/tables/columns/color" },
              { text: "SelectColumn", link: "/filament/3.x/tables/columns/select" },
              { text: "ToggleColumn", link: "/filament/3.x/tables/columns/toggle" },
              { text: "TextInputColumn", link: "/filament/3.x/tables/columns/text-input" },
              { text: "CheckboxColumn", link: "/filament/3.x/tables/columns/checkbox" },
              { text: "커스텀 컬럼", link: "/filament/3.x/tables/columns/custom" },
              { text: "컬럼 관계", link: "/filament/3.x/tables/columns/relationships" },
              { text: "고급 컬럼", link: "/filament/3.x/tables/columns/advanced" },
            ]
          },
          {
            text: '필터',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/tables/filters/getting-started" },
              { text: "SelectFilter", link: "/filament/3.x/tables/filters/select" },
              { text: "TernaryFilter", link: "/filament/3.x/tables/filters/ternary" },
              { text: "QueryBuilder", link: "/filament/3.x/tables/filters/query-builder" },
              { text: "커스텀 필터", link: "/filament/3.x/tables/filters/custom" },
              { text: "필터 레이아웃", link: "/filament/3.x/tables/filters/layout" },
            ]
          },
          { text: "액션", link: "/filament/3.x/tables/actions" },
          { text: "레이아웃", link: "/filament/3.x/tables/layout" },
          { text: "요약", link: "/filament/3.x/tables/summaries" },
          { text: "행 그룹화", link: "/filament/3.x/tables/grouping" },
          { text: "비어 있는 상태", link: "/filament/3.x/tables/empty-state" },
          { text: "고급 기능", link: "/filament/3.x/tables/advanced" },
          { text: "Livewire 컴포넌트에 테이블 추가", link: "/filament/3.x/tables/adding-a-table-to-a-livewire-component" },
          { text: "테스트", link: "/filament/3.x/tables/testing" },
          { text: "v2.x에서 업그레이드", link: "https://filamentphp.com/docs/3.x/tables/upgrade-guide" },
        ]
      },
      {
        text: '폼',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/forms/installation" },
          { text: "시작하기", link: "/filament/3.x/forms/getting-started" },
          {
            text: '필드',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/forms/fields/getting-started" },
              { text: "TextInput", link: "/filament/3.x/forms/fields/text-input" },
              { text: "Select", link: "/filament/3.x/forms/fields/select" },
              { text: "Checkbox", link: "/filament/3.x/forms/fields/checkbox" },
              { text: "Toggle", link: "/filament/3.x/forms/fields/toggle" },
              { text: "CheckboxList", link: "/filament/3.x/forms/fields/checkbox-list" },
              { text: "Radio", link: "/filament/3.x/forms/fields/radio" },
              { text: "DateTimePicker", link: "/filament/3.x/forms/fields/date-time-picker" },
              { text: "FileUpload", link: "/filament/3.x/forms/fields/file-upload" },
              { text: "RichEditor", link: "/filament/3.x/forms/fields/rich-editor" },
              { text: "MarkdownEditor", link: "/filament/3.x/forms/fields/markdown-editor" },
              { text: "Repeater", link: "/filament/3.x/forms/fields/repeater" },
              { text: "Builder", link: "/filament/3.x/forms/fields/builder" },
              { text: "TagsInput", link: "/filament/3.x/forms/fields/tags-input" },
              { text: "Textarea", link: "/filament/3.x/forms/fields/textarea" },
              { text: "KeyValue", link: "/filament/3.x/forms/fields/key-value" },
              { text: "ColorPicker", link: "/filament/3.x/forms/fields/color-picker" },
              { text: "ToggleButtons", link: "/filament/3.x/forms/fields/toggle-buttons" },
              { text: "Hidden", link: "/filament/3.x/forms/fields/hidden" },
              { text: "커스텀 필드", link: "/filament/3.x/forms/fields/custom" },
            ]
          },
          {
            text: '레이아웃',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/forms/layout/getting-started" },
              { text: "Grid", link: "/filament/3.x/forms/layout/grid" },
              { text: "Fieldset", link: "/filament/3.x/forms/layout/fieldset" },
              { text: "Tabs", link: "/filament/3.x/forms/layout/tabs" },
              { text: "Wizard", link: "/filament/3.x/forms/layout/wizard" },
              { text: "Section", link: "/filament/3.x/forms/layout/section" },
              { text: "Split", link: "/filament/3.x/forms/layout/split" },
              { text: "커스텀 레이아웃", link: "/filament/3.x/forms/layout/custom" },
            ]
          },
          { text: "Placeholder", link: "/filament/3.x/forms/layout/placeholder" },
          { text: "유효성 검사", link: "/filament/3.x/forms/validation" },
          { text: "Action", link: "/filament/3.x/forms/actions" },
          { text: "고급 폼", link: "/filament/3.x/forms/advanced" },
          { text: "Livewire 컴포넌트에 폼 추가", link: "/filament/3.x/forms/adding-a-form-to-a-livewire-component" },
          { text: "테스트", link: "/filament/3.x/forms/testing" },
          { text: "v2.x에서 업그레이드", link: "https://filamentphp.com/docs/3.x/forms/upgrade-guide" },
        ]
      },
      {
        text: '인포리스트',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/infolists/installation" },
          { text: "시작하기", link: "/filament/3.x/infolists/getting-started" },
          {
            text: '엔트리',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/infolists/entries/getting-started" },
              { text: "TextEntry", link: "/filament/3.x/infolists/entries/text" },
              { text: "IconEntry", link: "/filament/3.x/infolists/entries/icon" },
              { text: "ImageEntry", link: "/filament/3.x/infolists/entries/image" },
              { text: "ColorEntry", link: "/filament/3.x/infolists/entries/color" },
              { text: "KeyValueEntry", link: "/filament/3.x/infolists/entries/key-value" },
              { text: "RepeatableEntry", link: "/filament/3.x/infolists/entries/repeatable" },
              { text: "커스텀 엔트리", link: "/filament/3.x/infolists/entries/custom" },
            ]
          },
          {
            text: '레이아웃',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/infolists/layout/getting-started" },
              { text: "Grid", link: "/filament/3.x/infolists/layout/grid" },
              { text: "Fieldset", link: "/filament/3.x/infolists/layout/fieldset" },
              { text: "Tabs", link: "/filament/3.x/infolists/layout/tabs" },
              { text: "Section", link: "/filament/3.x/infolists/layout/section" },
              { text: "Split", link: "/filament/3.x/infolists/layout/split" },
              { text: "커스텀 레이아웃", link: "/filament/3.x/infolists/layout/custom" },
            ]
          },
          { text: "Action", link: "/filament/3.x/infolists/actions" },
          { text: "고급 인포리스트", link: "/filament/3.x/infolists/advanced" },
          { text: "Livewire 컴포넌트에 인포리스트 추가", link: "/filament/3.x/infolists/adding-an-infolist-to-a-livewire-component" },
          { text: "테스트", link: "/filament/3.x/infolists/testing" },
        ]
      },
      {
        text: '액션',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/actions/installation" },
          { text: "개요", link: "/filament/3.x/actions/overview" },
          { text: "트리거 버튼", link: "/filament/3.x/actions/trigger-button" },
          { text: "모달", link: "/filament/3.x/actions/modals" },
          { text: "액션 그룹화", link: "/filament/3.x/actions/grouping-actions" },
          { text: "Livewire 컴포넌트에 액션 추가", link: "/filament/3.x/actions/adding-an-action-to-a-livewire-component" },
          {
            text: '내장된 액션',
            collapsed: true,
            items: [
              { text: "CreateAction", link: "/filament/3.x/actions/prebuilt-actions/create" },
              { text: "EditAction", link: "/filament/3.x/actions/prebuilt-actions/edit" },
              { text: "ViewAction", link: "/filament/3.x/actions/prebuilt-actions/view" },
              { text: "DeleteAction", link: "/filament/3.x/actions/prebuilt-actions/delete" },
              { text: "ReplicateAction", link: "/filament/3.x/actions/prebuilt-actions/replicate" },
              { text: "ForceDeleteAction", link: "/filament/3.x/actions/prebuilt-actions/force-delete" },
              { text: "RestoreAction", link: "/filament/3.x/actions/prebuilt-actions/restore" },
              { text: "ImportAction", link: "/filament/3.x/actions/prebuilt-actions/import" },
              { text: "ExportAction", link: "/filament/3.x/actions/prebuilt-actions/export" },
            ]
          },
          { text: "고급 액션", link: "/filament/3.x/actions/advanced" },
          { text: "테스트", link: "/filament/3.x/actions/testing" },
          { text: "v2.x에서 업그레이드", link: "https://filamentphp.com/docs/3.x/actions/upgrade-guide" },
        ]
      },
      {
        text: '알림',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/notifications/installation" },
          { text: "알림 보내기", link: "/filament/3.x/notifications/sending-notifications" },
          { text: "데이터베이스 알림", link: "/filament/3.x/notifications/database-notifications" },
          { text: "브로드캐스트 알림", link: "/filament/3.x/notifications/broadcast-notifications" },
          { text: "알림 커스텀", link: "/filament/3.x/notifications/customizing-notifications" },
          { text: "테스트", link: "/filament/3.x/notifications/testing" },
          { text: "v2.x에서 업그레이드", link: "https://filamentphp.com/docs/3.x/notifications/upgrade-guide" },
        ]
      },
      {
        text: '위젯',
        collapsed: true,
        items: [
          { text: "설치", link: "/filament/3.x/widgets/installation" },
          { text: "StatsOverviewWidget", link: "/filament/3.x/widgets/stats-overview" },
          { text: "ChartWidget", link: "/filament/3.x/widgets/charts" },
          { text: "테이블 위젯", link: "/filament/3.x/widgets/tables" },
          { text: "Blade 뷰에 위젯 추가", link: "/filament/3.x/widgets/adding-a-widget-to-a-blade-view" },
        ]
      },
      {
        text: '핵심 개념',
        collapsed: true,
        items: [
          { text: "개요", link: "/filament/3.x/support/overview" },
          { text: "에셋", link: "/filament/3.x/support/assets" },
          { text: "아이콘", link: "/filament/3.x/support/icons" },
          { text: "색상", link: "/filament/3.x/support/colors" },
          { text: "스타일 커스터마이징", link: "/filament/3.x/support/style-customization" },
          { text: "렌더 훅", link: "/filament/3.x/support/render-hooks" },
          { text: "열거형(Enums)", link: "/filament/3.x/support/enums" },
          { text: "기여하기", link: "https://filamentphp.com/docs/3.x/support/contributing" },
          {
            text: '플러그인',
            collapsed: true,
            items: [
              { text: "시작하기", link: "/filament/3.x/support/plugins/getting-started" },
              { text: "패널 플러그인 만들기", link: "/filament/3.x/support/plugins/build-a-panel-plugin" },
              { text: "독립형 플러그인 만들기", link: "/filament/3.x/support/plugins/build-a-standalone-plugin" },
            ]
          },
          {
            text: 'Blade 컴포넌트',
            collapsed: true,
            items: [
              { text: "개요", link: "/filament/3.x/support/blade-components/overview" },
              { text: "Avatar", link: "/filament/3.x/support/blade-components/avatar" },
              { text: "Badge", link: "/filament/3.x/support/blade-components/badge" },
              { text: "Breadcrumbs", link: "/filament/3.x/support/blade-components/breadcrumbs" },
              { text: "Button", link: "/filament/3.x/support/blade-components/button" },
              { text: "Checkbox", link: "/filament/3.x/support/blade-components/checkbox" },
              { text: "Dropdown", link: "/filament/3.x/support/blade-components/dropdown" },
              { text: "Fieldset", link: "/filament/3.x/support/blade-components/fieldset" },
              { text: "Icon button", link: "/filament/3.x/support/blade-components/icon-button" },
              { text: "Input wrapper", link: "/filament/3.x/support/blade-components/input-wrapper" },
              { text: "Input", link: "/filament/3.x/support/blade-components/input" },
              { text: "Link", link: "/filament/3.x/support/blade-components/link" },
              { text: "Loading indicator", link: "/filament/3.x/support/blade-components/loading-indicator" },
              { text: "Modal", link: "/filament/3.x/support/blade-components/modal" },
              { text: "Pagination", link: "/filament/3.x/support/blade-components/pagination" },
              { text: "Section", link: "/filament/3.x/support/blade-components/section" },
              { text: "Select", link: "/filament/3.x/support/blade-components/select" },
              { text: "Tabs", link: "/filament/3.x/support/blade-components/tabs" },
            ]
          },
          { text: "스텁", link: "/filament/3.x/support/stubs" },
          { text: "지원 및 도움말", link: "https://filamentphp.com/docs/3.x/support/support" }
        ]
      }
    ]
  }
}
