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
  provider: 'algolia',
  options: {
    appId: 'Q6IEW6DP0D',
    apiKey: '5ffaed1a7e6d923c24dfcd0b80fe9065',
    indexName: '4me',
    placeholder: '문서 검색',
    translations: {
      button: {
        buttonText: '검색',
        buttonAriaLabel: '검색',
      },
      modal: {
        searchBox: {
          resetButtonTitle: '검색 지우기',
          resetButtonAriaLabel: '검색 지우기',
          cancelButtonText: '취소',
          cancelButtonAriaLabel: '취소',
        },
        startScreen: {
          recentSearchesTitle: '검색 기록',
          noRecentSearchesText: '최근 검색 없음',
          saveRecentSearchButtonTitle: '검색 기록에 저장',
          removeRecentSearchButtonTitle: '검색 기록에서 삭제',
          favoriteSearchesTitle: '즐겨찾기',
          removeFavoriteSearchButtonTitle: '즐겨찾기에서 삭제',
        },
        errorScreen: {
          titleText: '결과를 가져올 수 없습니다',
          helpText: '네트워크 연결을 확인하세요',
        },
        footer: {
          selectText: '선택',
          navigateText: '탐색',
          closeText: '닫기',
          searchByText: '검색 기준',
        },
        noResultsScreen: {
          noResultsText: '결과를 찾을 수 없습니다',
          suggestedQueryText: '새로운 검색을 시도할 수 있습니다',
          reportMissingResultsText: '해당 검색어에 대한 결과가 있어야 합니까?',
          reportMissingResultsLinkText: '피드백 보내기 클릭',
        },
      },
    },
  }
}
