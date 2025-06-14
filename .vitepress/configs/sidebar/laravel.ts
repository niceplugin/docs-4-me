export const sidebar_laravel = {
  '/laravel/': {
    items: [
      {
        text: '서문',
        collapsed: true,
        items: [
          { text: '릴리즈 노트', link: '/laravel/12.x/releases' },
          { text: '업그레이드 가이드', link: '/laravel/12.x/upgrade' },
          { text: '기여 가이드', link: '/laravel/12.x/contributions' },
        ]
      },
      {
        text: '시작하기',
        collapsed: true,
        items: [
          { text: '설치', link: '/laravel/12.x/installation' },
          { text: '환경설정', link: '/laravel/12.x/configuration' },
          { text: '디렉터리 구조', link: '/laravel/12.x/structure' },
          { text: '프론트엔드', link: '/laravel/12.x/frontend' },
          { text: '스타터 킷', link: '/laravel/12.x/starter-kits' },
          { text: '배포', link: '/laravel/12.x/deployment' },
        ]
      },
      {
        text: '아키텍처 개념',
        collapsed: true,
        items: [
          { text: '요청 생명주기', link: '/laravel/12.x/lifecycle' },
          { text: '서비스 컨테이너', link: '/laravel/12.x/container' },
          { text: '서비스 프로바이더', link: '/laravel/12.x/providers' },
          { text: '파사드 (Facades)', link: '/laravel/12.x/facades' },
        ]
      },
      {
        text: '기본',
        collapsed: true,
        items: [
          { text: '라우팅', link: '/laravel/12.x/routing' },
          { text: '미들웨어', link: '/laravel/12.x/middleware' },
          { text: 'CSRF 보호', link: '/laravel/12.x/csrf' },
          { text: '컨트롤러', link: '/laravel/12.x/controllers' },
          { text: '요청 (Requests)', link: '/laravel/12.x/requests' },
          { text: '응답 (Responses)', link: '/laravel/12.x/responses' },
          { text: '뷰(Views)', link: '/laravel/12.x/views' },
          { text: '블레이드 템플릿', link: '/laravel/12.x/blade' },
          { text: '에셋 번들링', link: '/laravel/12.x/vite' },
          { text: 'URL 생성', link: '/laravel/12.x/urls' },
          { text: '세션', link: '/laravel/12.x/session' },
          { text: '유효성 검사', link: '/laravel/12.x/validation' },
          { text: '에러 처리', link: '/laravel/12.x/errors' },
          { text: '로그 기록', link: '/laravel/12.x/logging' },
        ]
      },
      {
        text: '더 깊이 파보기',
        collapsed: true,
        items: [
          { text: 'Artisan 콘솔', link: '/laravel/12.x/artisan' },
          { text: '브로드캐스팅', link: '/laravel/12.x/broadcasting' },
          { text: '캐시', link: '/laravel/12.x/cache' },
          { text: '컬렉션', link: '/laravel/12.x/collections' },
          { text: '동시성 (Concurrency)', link: '/laravel/12.x/concurrency' },
          { text: '컨텍스트', link: '/laravel/12.x/context' },
          { text: '컨트랙트 (Contracts)', link: '/laravel/12.x/contracts' },
          { text: '이벤트', link: '/laravel/12.x/events' },
          { text: '파일 저장소 (Filesystem)', link: '/laravel/12.x/filesystem' },
          { text: '헬퍼', link: '/laravel/12.x/helpers' },
          { text: 'HTTP 클라이언트', link: '/laravel/12.x/http-client' },
          { text: '국제화 (Localization)', link: '/laravel/12.x/localization' },
          { text: '메일 (Mail)', link: '/laravel/12.x/mail' },
          { text: '알림', link: '/laravel/12.x/notifications' },
          { text: '패키지 개발', link: '/laravel/12.x/packages' },
          { text: '프로세스', link: '/laravel/12.x/processes' },
          { text: '큐 (Queues)', link: '/laravel/12.x/queues' },
          { text: '요청 제한 (Rate Limiting)', link: '/laravel/12.x/rate-limiting' },
          { text: '문자열', link: '/laravel/12.x/strings' },
          { text: '작업 스케줄링', link: '/laravel/12.x/scheduling' },
        ]
      },
      {
        text: '보안',
        collapsed: true,
        items: [
          { text: '인증 (Authentication)', link: '/laravel/12.x/authentication' },
          { text: '권한 관리 (Authorization)', link: '/laravel/12.x/authorization' },
          { text: '이메일 인증', link: '/laravel/12.x/verification' },
          { text: '암호화 (Encryption)', link: '/laravel/12.x/encryption' },
          { text: '해싱 (Hashing)', link: '/laravel/12.x/hashing' },
          { text: '비밀번호 재설정', link: '/laravel/12.x/passwords' },
        ]
      },
      {
        text: '데이터베이스',
        collapsed: true,
        items: [
          { text: '시작하기', link: '/laravel/12.x/database' },
          { text: '쿼리 빌더', link: '/laravel/12.x/queries' },
          { text: '페이지네이션', link: '/laravel/12.x/pagination' },
          { text: '마이그레이션', link: '/laravel/12.x/migrations' },
          { text: '시딩 (Seeding)', link: '/laravel/12.x/seeding' },
          { text: 'Redis', link: '/laravel/12.x/redis' },
          { text: 'MongoDB', link: '/laravel/12.x/mongodb' },
        ]
      },
      {
        text: 'Eloquent ORM (엘로퀀트)',
        collapsed: true,
        items: [
          { text: '시작하기', link: '/laravel/12.x/eloquent' },
          { text: '관계 (Relationships)', link: '/laravel/12.x/eloquent-relationships' },
          { text: '컬렉션', link: '/laravel/12.x/eloquent-collections' },
          { text: '뮤테이터/캐스트 (Mutators/Casts)', link: '/laravel/12.x/eloquent-mutators' },
          { text: 'API 리소스', link: '/laravel/12.x/eloquent-resources' },
          { text: '직렬화 (Serialization)', link: '/laravel/12.x/eloquent-serialization' },
          { text: '팩토리', link: '/laravel/12.x/eloquent-factories' },
        ]
      },
      {
        text: '테스트',
        collapsed: true,
        items: [
          { text: '시작하기', link: '/laravel/12.x/testing' },
          { text: 'HTTP 테스트', link: '/laravel/12.x/http-tests' },
          { text: '콘솔 테스트', link: '/laravel/12.x/console-tests' },
          { text: '브라우저 테스트', link: '/laravel/12.x/dusk' },
          { text: '데이터베이스', link: '/laravel/12.x/database-testing' },
          { text: '모킹 (Mocking)', link: '/laravel/12.x/mocking' },
        ]
      },
      {
        text: '패키지',
        collapsed: true,
        items: [
          { text: 'Cashier (Stripe)', link: '/laravel/12.x/billing' },
          { text: 'Cashier (Paddle)', link: '/laravel/12.x/cashier-paddle' },
          { text: 'Dusk', link: '/laravel/12.x/dusk' },
          { text: 'Envoy', link: '/laravel/12.x/envoy' },
          { text: 'Fortify', link: '/laravel/12.x/fortify' },
          { text: 'Folio', link: '/laravel/12.x/folio' },
          { text: 'Homestead', link: '/laravel/12.x/homestead' },
          { text: 'Horizon', link: '/laravel/12.x/horizon' },
          { text: 'Mix', link: '/laravel/12.x/mix' },
          { text: 'Octane', link: '/laravel/12.x/octane' },
          { text: 'Passport', link: '/laravel/12.x/passport' },
          { text: 'Pennant', link: '/laravel/12.x/pennant' },
          { text: 'Pint', link: '/laravel/12.x/pint' },
          { text: 'Precognition', link: '/laravel/12.x/precognition' },
          { text: 'Prompts', link: '/laravel/12.x/prompts' },
          { text: 'Pulse', link: '/laravel/12.x/pulse' },
          { text: 'Reverb', link: '/laravel/12.x/reverb' },
          { text: 'Sail', link: '/laravel/12.x/sail' },
          { text: 'Sanctum', link: '/laravel/12.x/sanctum' },
          { text: 'Scout', link: '/laravel/12.x/scout' },
          { text: 'Socialite', link: '/laravel/12.x/socialite' },
          { text: 'Telescope', link: '/laravel/12.x/telescope' },
          { text: 'Valet', link: '/laravel/12.x/valet' }
        ]
      },
      {
        text: 'API 문서',
        link: 'https://api.laravel.com/docs/12.x',
      }
    ]
  }
}