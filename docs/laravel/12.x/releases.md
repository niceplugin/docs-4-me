# 릴리즈 노트






## 버전 관리 방식 {#versioning-scheme}

Laravel과 그 외 1차 제공 패키지들은 [Semantic Versioning](https://semver.org)을 따릅니다. 주요 프레임워크 릴리즈는 매년(~1분기) 출시되며, 마이너 및 패치 릴리즈는 매주 출시될 수 있습니다. 마이너 및 패치 릴리즈에는 **절대** 하위 호환성 문제가 포함되어서는 안 됩니다.

애플리케이션이나 패키지에서 Laravel 프레임워크 또는 그 구성요소를 참조할 때는 항상 `^12.0`과 같은 버전 제약 조건을 사용해야 합니다. 왜냐하면 Laravel의 주요 릴리즈에는 하위 호환성 문제가 포함될 수 있기 때문입니다. 하지만, 새로운 주요 릴리즈로 하루 이내에 업데이트할 수 있도록 항상 노력하고 있습니다.


#### 명명된 인자 {#named-arguments}

[명명된 인자](https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments)는 Laravel의 하위 호환성 가이드라인에 포함되지 않습니다. Laravel 코드베이스를 개선하기 위해 필요하다면 함수 인자명을 변경할 수 있습니다. 따라서, Laravel 메서드를 호출할 때 명명된 인자를 사용할 경우, 향후 파라미터 이름이 변경될 수 있음을 인지하고 신중히 사용해야 합니다.


## 지원 정책 {#support-policy}

모든 Laravel 릴리즈에 대해 버그 수정은 18개월, 보안 수정은 2년간 제공됩니다. 추가 라이브러리의 경우, 최신 주요 릴리즈만 버그 수정을 받습니다. 또한, Laravel이 [지원하는 데이터베이스 버전](/laravel/12.x/database#introduction)도 확인해 주세요.

<div class="overflow-auto">

| 버전   | PHP (*)   | 출시일          | 버그 수정 종료일    | 보안 수정 종료일    |
|------|-----------|--------------|--------------|--------------|
| 10 ❌ | 8.1 - 8.3 | 2023년 2월 14일 | 2024년 8월 6일  | 2025년 2월 4일  |
| 11   | 8.2 - 8.4 | 2024년 3월 12일 | 2025년 9월 3일  | 2026년 3월 12일 |
| 12   | 8.2 - 8.4 | 2025년 2월 24일 | 2026년 8월 13일 | 2027년 2월 24일 |
| 13   | 8.3 - 8.4 | 2026년 1분기    | 2027년 3분기    | 2028년 1분기    |

</div>

<div class="version-colors">
    <div class="end-of-life">
        <div class="color-box"></div>
        <div>❌ 지원 종료</div>
    </div>
    <div class="security-fixes">
        <div class="color-box"></div>
        <div>⚠️ 보안 수정만 제공</div>
    </div>
</div>

(*) 지원되는 PHP 버전


## Laravel 12 {#laravel-12}

Laravel 12는 상위 종속성 업데이트와 함께 React, Vue, Livewire용 새로운 스타터 킷을 도입하며, 사용자 인증을 위해 [WorkOS AuthKit](https://authkit.com) 사용 옵션을 포함합니다. WorkOS 버전의 스타터 킷은 소셜 인증, 패스키, SSO 지원을 제공합니다.


### 최소한의 하위 호환성 문제 {#minimal-breaking-changes}

이번 릴리즈 주기 동안 저희는 하위 호환성 문제를 최소화하는 데 집중했습니다. 대신, 기존 애플리케이션을 깨뜨리지 않는 연속적인 품질 개선에 전념했습니다.

따라서, Laravel 12 릴리즈는 기존 종속성 업그레이드를 위한 비교적 소규모의 "유지보수 릴리즈"입니다. 이로 인해 대부분의 Laravel 애플리케이션은 애플리케이션 코드를 변경하지 않고도 Laravel 12로 업그레이드할 수 있습니다.


### 새로운 애플리케이션 스타터 킷 {#new-application-starter-kits}

Laravel 12는 React, Vue, Livewire용 새로운 [애플리케이션 스타터 킷](/laravel/12.x/starter-kits)을 도입합니다. React와 Vue 스타터 킷은 Inertia 2, TypeScript, [shadcn/ui](https://ui.shadcn.com), Tailwind를 사용하며, Livewire 스타터 킷은 Tailwind 기반의 [Flux UI](https://fluxui.dev) 컴포넌트 라이브러리와 Laravel Volt를 사용합니다.

React, Vue, Livewire 스타터 킷 모두 Laravel의 내장 인증 시스템을 활용하여 로그인, 회원가입, 비밀번호 재설정, 이메일 인증 등을 제공합니다. 또한, 각 스타터 킷의 [WorkOS AuthKit 기반](https://authkit.com) 버전을 도입하여 소셜 인증, 패스키, SSO 지원을 제공합니다. WorkOS는 월간 활성 사용자 100만 명까지 무료 인증을 제공합니다.

새로운 애플리케이션 스타터 킷 도입에 따라, Laravel Breeze와 Laravel Jetstream은 더 이상 추가 업데이트를 받지 않습니다.

새로운 스타터 킷을 시작하려면 [스타터 킷 문서](/laravel/12.x/starter-kits)를 참고하세요.