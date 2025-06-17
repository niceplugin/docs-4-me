export const sidebar_filament = {
  '/filament/': {
    items: [
      {
        text: 'Panels',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/panels/installation" },
          { text: "Getting started", link: "/filament/3.x/panels/getting-started" },
          {
            text: 'Resources',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/panels/resources/getting-started" },
              { text: "Listing records", link: "/filament/3.x/panels/resources/listing-records" },
              { text: "Creating records", link: "/filament/3.x/panels/resources/creating-records" },
              { text: "Editing records", link: "/filament/3.x/panels/resources/editing-records" },
              { text: "Viewing records", link: "/filament/3.x/panels/resources/viewing-records" },
              { text: "Deleting records", link: "/filament/3.x/panels/resources/deleting-records" },
              { text: "Managing relationships", link: "/filament/3.x/panels/resources/relation-managers" },
              { text: "Global search", link: "/filament/3.x/panels/resources/global-search" },
              { text: "Widgets", link: "/filament/3.x/panels/resources/widgets" },
              { text: "Custom pages", link: "/filament/3.x/panels/resources/custom-pages" },
              { text: "Security", link: "/filament/3.x/panels/resources/security" },
            ]
          },
          { text: "Pages", link: "/filament/3.x/panels/pages" },
          { text: "Dashboard", link: "/filament/3.x/panels/dashboard" },
          { text: "Navigation", link: "/filament/3.x/panels/navigation" },
          { text: "Notifications", link: "/filament/3.x/panels/notifications" },
          { text: "Users", link: "/filament/3.x/panels/users" },
          { text: "Configuration", link: "/filament/3.x/panels/configuration" },
          { text: "Clusters", link: "/filament/3.x/panels/clusters" },
          { text: "Multi-tenancy", link: "/filament/3.x/panels/tenancy" },
          { text: "Themes", link: "/filament/3.x/panels/themes" },
          { text: "Plugin development", link: "/filament/3.x/panels/plugins" },
          { text: "Testing", link: "/filament/3.x/panels/testing" },
          { text: "Upgrading from v2.x", link: "https://filamentphp.com/docs/3.x/panels/upgrade-guide" },
        ]
      },
      {
        text: 'Tables',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/tables/installation" },
          { text: "Getting started", link: "/filament/3.x/tables/getting-started" },
          {
            text: 'Columns',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/tables/columns/getting-started" },
              { text: "Text column", link: "/filament/3.x/tables/columns/text" },
              { text: "Icon column", link: "/filament/3.x/tables/columns/icon" },
              { text: "Image column", link: "/filament/3.x/tables/columns/image" },
              { text: "Color column", link: "/filament/3.x/tables/columns/color" },
              { text: "Select column", link: "/filament/3.x/tables/columns/select" },
              { text: "Toggle column", link: "/filament/3.x/tables/columns/toggle" },
              { text: "Text input column", link: "/filament/3.x/tables/columns/text-input" },
              { text: "Checkbox column", link: "/filament/3.x/tables/columns/checkbox" },
              { text: "Custom columns", link: "/filament/3.x/tables/columns/custom" },
              { text: "Column relationships", link: "/filament/3.x/tables/columns/relationships" },
              { text: "Advanced columns", link: "/filament/3.x/tables/columns/advanced" },
            ]
          },
          {
            text: 'Filters',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/tables/filters/getting-started" },
              { text: "Select filters", link: "/filament/3.x/tables/filters/select" },
              { text: "Ternary filters", link: "/filament/3.x/tables/filters/ternary" },
              { text: "Query builder", link: "/filament/3.x/tables/filters/query-builder" },
              { text: "Custom filters", link: "/filament/3.x/tables/filters/custom" },
              { text: "Filter layout", link: "/filament/3.x/tables/filters/layout" },
            ]
          },
          { text: "Actions", link: "/filament/3.x/tables/actions" },
          { text: "Layout", link: "/filament/3.x/tables/layout" },
          { text: "Summaries", link: "/filament/3.x/tables/summaries" },
          { text: "Grouping rows", link: "/filament/3.x/tables/grouping" },
          { text: "Empty state", link: "/filament/3.x/tables/empty-state" },
          { text: "Advanced", link: "/filament/3.x/tables/advanced" },
          { text: "Adding a table to a Livewire component", link: "/filament/3.x/tables/adding-a-table-to-a-livewire-component" },
          { text: "Testing", link: "/filament/3.x/tables/testing" },
          { text: "Upgrading from v2.x", link: "https://filamentphp.com/docs/3.x/tables/upgrade-guide" },
        ]
      },
      {
        text: 'Forms',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/forms/installation" },
          { text: "Getting started", link: "/filament/3.x/forms/getting-started" },
          {
            text: 'Fields',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/forms/fields/getting-started" },
              { text: "Text input", link: "/filament/3.x/forms/fields/text-input" },
              { text: "Select", link: "/filament/3.x/forms/fields/select" },
              { text: "Checkbox", link: "/filament/3.x/forms/fields/checkbox" },
              { text: "Toggle", link: "/filament/3.x/forms/fields/toggle" },
              { text: "Checkbox list", link: "/filament/3.x/forms/fields/checkbox-list" },
              { text: "Radio", link: "/filament/3.x/forms/fields/radio" },
              { text: "Date-time picker", link: "/filament/3.x/forms/fields/date-time-picker" },
              { text: "File upload", link: "/filament/3.x/forms/fields/file-upload" },
              { text: "Rich editor", link: "/filament/3.x/forms/fields/rich-editor" },
              { text: "Markdown editor", link: "/filament/3.x/forms/fields/markdown-editor" },
              { text: "Repeater", link: "/filament/3.x/forms/fields/repeater" },
              { text: "Builder", link: "/filament/3.x/forms/fields/builder" },
              { text: "Tags input", link: "/filament/3.x/forms/fields/tags-input" },
              { text: "Textarea", link: "/filament/3.x/forms/fields/textarea" },
              { text: "Key-value", link: "/filament/3.x/forms/fields/key-value" },
              { text: "Color picker", link: "/filament/3.x/forms/fields/color-picker" },
              { text: "Toggle buttons", link: "/filament/3.x/forms/fields/toggle-buttons" },
              { text: "Hidden", link: "/filament/3.x/forms/fields/hidden" },
              { text: "Custom fields", link: "/filament/3.x/forms/fields/custom" },
            ]
          },
          {
            text: 'Layout',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/forms/layout/getting-started" },
              { text: "Grid", link: "/filament/3.x/forms/layout/grid" },
              { text: "Fieldset", link: "/filament/3.x/forms/layout/fieldset" },
              { text: "Tabs", link: "/filament/3.x/forms/layout/tabs" },
              { text: "Wizard", link: "/filament/3.x/forms/layout/wizard" },
              { text: "Section", link: "/filament/3.x/forms/layout/section" },
              { text: "Split", link: "/filament/3.x/forms/layout/split" },
              { text: "Custom layouts", link: "/filament/3.x/forms/layout/custom" },
            ]
          },
          { text: "Placeholder", link: "/filament/3.x/forms/layout/placeholder" },
          { text: "Validation", link: "/filament/3.x/forms/validation" },
          { text: "Actions", link: "/filament/3.x/forms/actions" },
          { text: "Advanced forms", link: "/filament/3.x/forms/advanced" },
          { text: "Adding a form to a Livewire component", link: "/filament/3.x/forms/adding-a-form-to-a-livewire-component" },
          { text: "Testing", link: "/filament/3.x/forms/testing" },
          { text: "Upgrading from v2.x", link: "https://filamentphp.com/docs/3.x/forms/upgrade-guide" },
        ]
      },
      {
        text: 'Infolists',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/infolists/installation" },
          { text: "Getting started", link: "/filament/3.x/infolists/getting-started" },
          {
            text: 'Entries',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/infolists/entries/getting-started" },
              { text: "Text entry", link: "/filament/3.x/infolists/entries/text" },
              { text: "Icon entry", link: "/filament/3.x/infolists/entries/icon" },
              { text: "Image entry", link: "/filament/3.x/infolists/entries/image" },
              { text: "Color entry", link: "/filament/3.x/infolists/entries/color" },
              { text: "Key-value entry", link: "/filament/3.x/infolists/entries/key-value" },
              { text: "Repeatable entry", link: "/filament/3.x/infolists/entries/repeatable" },
              { text: "Custom entries", link: "/filament/3.x/infolists/entries/custom" },
            ]
          },
          {
            text: 'Layout',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/infolists/layout/getting-started" },
              { text: "Grid", link: "/filament/3.x/infolists/layout/grid" },
              { text: "Fieldset", link: "/filament/3.x/infolists/layout/fieldset" },
              { text: "Tabs", link: "/filament/3.x/infolists/layout/tabs" },
              { text: "Section", link: "/filament/3.x/infolists/layout/section" },
              { text: "Split", link: "/filament/3.x/infolists/layout/split" },
              { text: "Custom layouts", link: "/filament/3.x/infolists/layout/custom" },
            ]
          },
          { text: "Actions", link: "/filament/3.x/infolists/actions" },
          { text: "Advanced infolists", link: "/filament/3.x/infolists/advanced" },
          { text: "Adding an infolist to a Livewire component", link: "/filament/3.x/infolists/adding-an-infolist-to-a-livewire-component" },
          { text: "Testing", link: "/filament/3.x/infolists/testing" },
        ]
      },
      {
        text: 'Actions',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/actions/installation" },
          { text: "Overview", link: "/filament/3.x/actions/overview" },
          { text: "Trigger button", link: "/filament/3.x/actions/trigger-button" },
          { text: "Modals", link: "/filament/3.x/actions/modals" },
          { text: "Grouping actions", link: "/filament/3.x/actions/grouping-actions" },
          { text: "Adding an action to a Livewire component", link: "/filament/3.x/actions/adding-an-action-to-a-livewire-component" },
          {
            text: 'Prebuilt Actions',
            collapsed: true,
            items: [
              { text: "Create action", link: "/filament/3.x/actions/prebuilt-actions/create" },
              { text: "Edit action", link: "/filament/3.x/actions/prebuilt-actions/edit" },
              { text: "View action", link: "/filament/3.x/actions/prebuilt-actions/view" },
              { text: "Delete action", link: "/filament/3.x/actions/prebuilt-actions/delete" },
              { text: "Replicate action", link: "/filament/3.x/actions/prebuilt-actions/replicate" },
              { text: "Force-delete action", link: "/filament/3.x/actions/prebuilt-actions/force-delete" },
              { text: "Restore action", link: "/filament/3.x/actions/prebuilt-actions/restore" },
              { text: "Import action", link: "/filament/3.x/actions/prebuilt-actions/import" },
              { text: "Export action", link: "/filament/3.x/actions/prebuilt-actions/export" },
            ]
          },
          { text: "Advanced actions", link: "/filament/3.x/actions/advanced" },
          { text: "Testing", link: "/filament/3.x/actions/testing" },
          { text: "Upgrading from v2.x", link: "https://filamentphp.com/docs/3.x/actions/upgrade-guide" },
        ]
      },
      {
        text: 'Notifications',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/notifications/installation" },
          { text: "Sending notifications", link: "/filament/3.x/notifications/sending-notifications" },
          { text: "Database notifications", link: "/filament/3.x/notifications/database-notifications" },
          { text: "Broadcast notifications", link: "/filament/3.x/notifications/broadcast-notifications" },
          { text: "Customizing notifications", link: "/filament/3.x/notifications/customizing-notifications" },
          { text: "Testing", link: "/filament/3.x/notifications/testing" },
          { text: "Upgrading from v2.x", link: "https://filamentphp.com/docs/3.x/notifications/upgrade-guide" },
        ]
      },
      {
        text: 'Widgets',
        collapsed: true,
        items: [
          { text: "Installation", link: "/filament/3.x/widgets/installation" },
          { text: "Stats overview widgets", link: "/filament/3.x/widgets/stats-overview" },
          { text: "Chart widgets", link: "/filament/3.x/widgets/charts" },
          { text: "Table widgets", link: "/filament/3.x/widgets/tables" },
          { text: "Adding a widget to a Blade view", link: "/filament/3.x/widgets/adding-a-widget-to-a-blade-view" },
        ]
      },
      {
        text: 'Core Concepts',
        collapsed: true,
        items: [
          { text: "Overview", link: "/filament/3.x/support/overview" },
          { text: "Assets", link: "/filament/3.x/support/assets" },
          { text: "Icons", link: "/filament/3.x/support/icons" },
          { text: "Colors", link: "/filament/3.x/support/colors" },
          { text: "Style customization", link: "/filament/3.x/support/style-customization" },
          { text: "Render hooks", link: "/filament/3.x/support/render-hooks" },
          { text: "Enums", link: "/filament/3.x/support/enums" },
          { text: "Contributing", link: "/filament/3.x/support/contributing" },
          {
            text: 'Plugins',
            collapsed: true,
            items: [
              { text: "Getting started", link: "/filament/3.x/support/plugins/getting-started" },
              { text: "Build a panel plugin", link: "/filament/3.x/support/plugins/build-a-panel-plugin" },
              { text: "Build a standalone plugin", link: "/filament/3.x/support/plugins/build-a-standalone-plugin" },
            ]
          },
          {
            text: 'Blade Components',
            collapsed: true,
            items: [
              { text: "Overview", link: "/filament/3.x/support/blade-components/overview" },
              { text: "Avatar Blade component", link: "/filament/3.x/support/blade-components/avatar" },
              { text: "Badge Blade component", link: "/filament/3.x/support/blade-components/badge" },
              { text: "Breadcrumbs Blade component", link: "/filament/3.x/support/blade-components/breadcrumbs" },
              { text: "Button Blade component", link: "/filament/3.x/support/blade-components/button" },
              { text: "Checkbox Blade component", link: "/filament/3.x/support/blade-components/checkbox" },
              { text: "Dropdown Blade component", link: "/filament/3.x/support/blade-components/dropdown" },
              { text: "Fieldset Blade component", link: "/filament/3.x/support/blade-components/fieldset" },
              { text: "Icon button Blade component", link: "/filament/3.x/support/blade-components/icon-button" },
              { text: "Input wrapper Blade component", link: "/filament/3.x/support/blade-components/input-wrapper" },
              { text: "Input Blade component", link: "/filament/3.x/support/blade-components/input" },
              { text: "Link Blade component", link: "/filament/3.x/support/blade-components/link" },
              { text: "Loading indicator Blade component", link: "/filament/3.x/support/blade-components/loading-indicator" },
              { text: "Modal Blade component", link: "/filament/3.x/support/blade-components/modal" },
              { text: "Pagination Blade component", link: "/filament/3.x/support/blade-components/pagination" },
              { text: "Section Blade component", link: "/filament/3.x/support/blade-components/section" },
              { text: "Select Blade component", link: "/filament/3.x/support/blade-components/select" },
              { text: "Tabs Blade component", link: "/filament/3.x/support/blade-components/tabs" },
            ]
          },
          { text: "Stubs", link: "/filament/3.x/support/stubs" },
          { text: "Support & Help", link: "https://filamentphp.com/docs/3.x/support/support" }
        ]
      },
    ]
  }
}
