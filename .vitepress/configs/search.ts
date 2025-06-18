const locales = {
  root: {
    translations: {
      button: {
        buttonText: '검색',
        buttonAriaLabel: '검색'
      },
      modal: {
        displayDetails: '상세 목록 표시',
        resetButtonTitle: '검색 지우기',
        backButtonTitle: '검색 닫기',
        noResultsText: '결과를 찾을 수 없습니다',
        footer: {
          selectText: '선택',
          selectKeyAriaLabel: '선택하기',
          navigateText: '탐색',
          navigateUpKeyAriaLabel: '위로',
          navigateDownKeyAriaLabel: '아래로',
          closeText: '닫기',
          closeKeyAriaLabel: '검색창 닫기'
        }
      }
    }
  }
}

const miniSearch = {
  searchOptions: {
    filter: result => {
      const currentPath = window.location.pathname
      const category = (function () {
        const path = result.id
        if (path.startsWith('/laravel/')) return '[라라벨]'
        if (path.startsWith('/livewire/')) return '[라이브와이어]'
        if (path.startsWith('/filament/')) return '[필라멘트]'
        return '[ - ]'
      })()
      // 카테고리가 아직 추가되지 않은 경우, 카테고리 추가
      if (!/^\[.+]$/.test(result.titles[0])) result.titles.unshift(category)

      if (currentPath.startsWith('/laravel/')) return result.id.startsWith('/laravel/')
      if (currentPath.startsWith('/livewire/')) return result.id.startsWith('/livewire/')
      if (currentPath.startsWith('/filament/')) return result.id.startsWith('/filament/')
      return true
    }
  }
}

export const search = {
  provider: 'local',
  options: {
    locales,
    miniSearch,
  }
}
