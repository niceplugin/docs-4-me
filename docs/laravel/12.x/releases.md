# 릴리즈 노트






## 버전 관리 체계 {#versioning-scheme}

Laravel과 그 외의 공식 패키지들은 [Semantic Versioning](https://semver.org) 방식을 따릅니다. 주요 프레임워크 릴리스는 매년(대략 1분기)에 한 번씩 출시되며, 마이너 및 패치 릴리스는 매주 출시될 수 있습니다. 마이너 및 패치 릴리스에는 **절대** 호환성에 영향을 주는 변경 사항이 포함되어서는 안 됩니다.

애플리케이션이나 패키지에서 Laravel 프레임워크 또는 그 구성 요소를 참조할 때는 항상 `^12.0`과 같은 버전 제약 조건을 사용해야 합니다. 이는 Laravel의 주요 릴리스에는 호환성에 영향을 주는 변경사항이 포함될 수 있기 때문입니다. 그러나 새로운 주요 릴리스로의 업그레이드를 하루 이내에 완료할 수 있도록 항상 노력하고 있습니다.


#### 명명된 인자 {#named-arguments}

[명명된 인자](https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments)는 Laravel의 하위 호환성 가이드라인에 포함되지 않습니다. Laravel 코드베이스를 개선하기 위해 필요할 경우 함수 인자의 이름을 변경할 수 있습니다. 따라서 Laravel 메서드를 호출할 때 명명된 인자를 사용할 경우, 인자 이름이 향후 변경될 수 있음을 인지하고 신중하게 사용해야 합니다.


## 지원 정책 {#support-policy}

모든 Laravel 릴리스에 대해 버그 수정은 18개월 동안, 보안 수정은 2년 동안 제공됩니다. 추가 라이브러리의 경우, 최신 주요 릴리스만 버그 수정을 받습니다. 또한, Laravel에서 [지원하는 데이터베이스 버전](/laravel/12.x/database#introduction)도 반드시 확인하시기 바랍니다.

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

Laravel 12는 상위 의존성 업데이트와 함께 React, Vue, Livewire용 새로운 스타터 키트를 도입하여 Laravel 11.x에서 이루어진 개선 사항을 이어갑니다. 또한, 사용자 인증을 위해 [WorkOS AuthKit](https://authkit.com)을 사용할 수 있는 옵션도 제공합니다. WorkOS 버전의 스타터 키트는 소셜 인증, 패스키, SSO(싱글 사인온) 지원 기능을 포함하고 있습니다.


### 최소한의 호환성 깨짐 {#minimal-breaking-changes}

이번 릴리스 주기에서 저희는 호환성에 영향을 주는 변경 사항을 최소화하는 데 많은 노력을 기울였습니다. 기존 애플리케이션에 영향을 주지 않으면서, 연중 지속적으로 다양한 품질 개선 사항을 제공하는 데 집중했습니다.

따라서 Laravel 12 릴리스는 기존 의존성 업그레이드를 위한 비교적 소규모의 "유지보수 릴리스"입니다. 이러한 점을 고려할 때, 대부분의 Laravel 애플리케이션은 별도의 코드 변경 없이 Laravel 12로 업그레이드할 수 있습니다.


### 새로운 애플리케이션 스타터 키트 {#new-application-starter-kits}

Laravel 12에서는 React, Vue, Livewire용 새로운 [애플리케이션 스타터 키트](/laravel/12.x/starter-kits)를 도입했습니다. React와 Vue 스타터 키트는 Inertia 2, TypeScript, [shadcn/ui](https://ui.shadcn.com), Tailwind를 활용하며, Livewire 스타터 키트는 Tailwind 기반의 [Flux UI](https://fluxui.dev) 컴포넌트 라이브러리와 Laravel Volt를 사용합니다.

React, Vue, Livewire 스타터 키트 모두 Laravel의 내장 인증 시스템을 활용하여 로그인, 회원가입, 비밀번호 재설정, 이메일 인증 등 다양한 기능을 제공합니다. 또한, 각 스타터 키트에는 [WorkOS AuthKit 기반](https://authkit.com) 버전도 제공되어 소셜 인증, 패스키, SSO(싱글 사인온) 지원 기능을 사용할 수 있습니다. WorkOS는 월간 활성 사용자 100만 명까지 무료 인증 서비스를 제공합니다.

새로운 애플리케이션 스타터 키트가 도입됨에 따라, Laravel Breeze와 Laravel Jetstream은 더 이상 추가 업데이트를 받지 않습니다.

새로운 스타터 키트로 시작하려면 [스타터 키트 문서](/laravel/12.x/starter-kits)를 참고하세요.
