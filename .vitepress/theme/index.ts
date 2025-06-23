// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import 'virtual:group-icons.css'
import AutoScreenshot from './components/AutoScreenshot.vue'
import LaracastsBanner from './components/LaracastsBanner.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('AutoScreenshot', AutoScreenshot)
    app.component('LaracastsBanner', LaracastsBanner)
  }
} satisfies Theme
