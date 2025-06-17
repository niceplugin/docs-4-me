import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { sidebar_laravel } from './configs/sidebar/laravel'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'ko-KR',
  srcDir: 'docs',
  title: 'Docs 4 Me . kr',
  description: '나를 위한 문서 한글화 사이트',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/niceplugin/docs-4-me' }
    // ],

    // editLink: {
    //   pattern: 'https://github.com/niceplugin/docs-4-me/edit/main/docs/:path',
    //   text: '이 페이지 편집 제안하기'
    // },

    nav: [
      { text: '홈', link: '/' },
      { text: '라라벨 12.x', link: '/laravel/12.x/installation', activeMatch: '/laravel/' }
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
