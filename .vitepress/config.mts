import dotenv from 'dotenv'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { sidebar_laravel } from './configs/sidebar/laravel'
import { livewire } from './configs/sidebar/livewire'
import { sidebar_filament } from './configs/sidebar/filament'
import { search } from './configs/search'

dotenv.config()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'ko-KR',
  srcDir: 'docs',
  title: `Docs 4 Me . kr`,
  description: '나를 위한 문서 한글화 사이트',
  head: [
    [
      'link',
      { rel: 'icon', href: '/favicon.ico' }
    ],
    [
      'meta',
      { name: process.env['GOOGLE_META_NAME'], content: process.env['GOOGLE_META_CONTENT'] }
    ],
  ],
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/niceplugin/docs-4-me' }
    ],

    editLink: {
      pattern: 'https://github.com/niceplugin/docs-4-me/edit/issue/docs/:path',
      text: '이 페이지 편집 제안하기'
    },
    search,

    nav: [
      { text: '홈', link: '/' },
      { text: 'Laravel 12.x', link: '/laravel/12.x/installation', activeMatch: '/laravel/' },
      { text: 'Livewire 3.x', link: '/livewire/3.x/quickstart', activeMatch: '/livewire/' },
      { text: 'Filament 3.x', link: '/filament/3.x/panels/installation', activeMatch: '/filament/' },
    ],

    outline: {
      label: '이 페이지 목차',
      level: [ 2, 3 ]
    },

    docFooter: {
      prev: '이전',
      next: '다음'
    },

    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '메뉴',
    darkModeSwitchLabel: '다크 모드',
    lightModeSwitchTitle: '라이트 모드로 변경',
    darkModeSwitchTitle: '다크 모드로 변경',

    notFound: {
      title: '페이지를 찾을 수 없습니다',
      quote:
        '길을 잃는다는 건 때론 새로운 길을 찾는 시작일 수 있어요. 잠시 멈춰 숨을 고르고 다시 나아가 보세요.',
      linkLabel: '홈으로 이동',
      linkText: '홈으로 이동'
    },

    sidebar: {
      ...sidebar_laravel,
      ...livewire,
      ...sidebar_filament,
    },
  },

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin()
    ],
  }
})
