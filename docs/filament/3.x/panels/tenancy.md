---
title: 멀티 테넌시
---
# [패널] 멀티 테넌시
## 개요 {#overview}

멀티 테넌시는 하나의 애플리케이션 인스턴스가 여러 고객을 서비스하는 개념입니다. 각 고객은 자신만의 데이터와 접근 규칙을 가지며, 서로의 데이터를 볼 수 없고 수정할 수 없습니다. 이는 SaaS 애플리케이션에서 흔히 볼 수 있는 패턴입니다. 사용자들은 종종 사용자 그룹(팀 또는 조직 등)에 속합니다. 레코드는 그룹이 소유하며, 사용자는 여러 그룹의 멤버가 될 수 있습니다. 이는 사용자가 데이터를 협업해야 하는 애플리케이션에 적합합니다.

멀티 테넌시는 매우 민감한 주제입니다. 멀티 테넌시의 보안적 의미와 올바른 구현 방법을 이해하는 것이 중요합니다. 부분적으로 또는 잘못 구현할 경우, 한 테넌트의 데이터가 다른 테넌트에게 노출될 수 있습니다. Filament는 애플리케이션에서 멀티 테넌시를 구현하는 데 도움이 되는 도구를 제공하지만, 이를 어떻게 사용하는지는 여러분에게 달려 있습니다. Filament는 애플리케이션의 보안에 대해 어떠한 보장도 제공하지 않습니다. 애플리케이션의 보안을 보장하는 것은 여러분의 책임입니다. 자세한 내용은 [보안](#tenancy-security) 섹션을 참고하세요.

## 단순 일대다 테넌시 {#simple-one-to-many-tenancy}

"멀티 테넌시"라는 용어는 광범위하며, 상황에 따라 다른 의미를 가질 수 있습니다. Filament의 테넌시 시스템은 사용자가 **여러** 테넌트(조직, 팀, 회사 등)에 속하며, 이들 사이를 전환할 수 있음을 의미합니다.

만약 여러분의 경우가 더 단순하고 다대다 관계가 필요 없다면, Filament에서 테넌시를 설정할 필요가 없습니다. 대신 [옵저버](/laravel/12.x/eloquent#observers)와 [글로벌 스코프](/laravel/12.x/eloquent#global-scopes)를 사용할 수 있습니다.

예를 들어, 데이터베이스 컬럼 `users.team_id`가 있다고 가정해봅시다. [글로벌 스코프](/laravel/12.x/eloquent#global-scopes)를 사용하여 모든 레코드를 사용자의 `team_id`와 동일하게 범위 지정할 수 있습니다:

```php
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('team', function (Builder $query) {
            if (auth()->hasUser()) {
                $query->where('team_id', auth()->user()->team_id);
                // 또는 `team` 관계가 정의되어 있다면:
                $query->whereBelongsTo(auth()->user()->team);
            }
        });
    }
}
```

레코드가 생성될 때 자동으로 `team_id`를 설정하려면, [옵저버](/laravel/12.x/eloquent#observers)를 만들 수 있습니다:

```php
class PostObserver
{
    public function creating(Post $post): void
    {
        if (auth()->hasUser()) {
            $post->team_id = auth()->user()->team_id;
            // 또는 `team` 관계가 정의되어 있다면:
            $post->team()->associate(auth()->user()->team);
        }
    }
}
```

## 테넌시 설정하기 {#setting-up-tenancy}

테넌시를 설정하려면, [설정](configuration)에서 "테넌트"(팀 또는 조직 등) 모델을 지정해야 합니다:

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class);
}
```

또한 사용자가 어떤 테넌트에 속하는지 Filament에 알려주어야 합니다. 이를 위해 `App\Models\User` 모델에서 `HasTenants` 인터페이스를 구현하면 됩니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;

class User extends Authenticatable implements FilamentUser, HasTenants
{
    // ...

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    public function getTenants(Panel $panel): Collection
    {
        return $this->teams;
    }

    public function canAccessTenant(Model $tenant): bool
    {
        return $this->teams()->whereKey($tenant)->exists();
    }
}
```

이 예시에서 사용자는 여러 팀에 속하므로 `teams()` 관계가 있습니다. `getTenants()` 메서드는 사용자가 속한 팀을 반환합니다. Filament는 이를 사용하여 사용자가 접근할 수 있는 테넌트 목록을 표시합니다.

보안을 위해, 사용자가 테넌트 ID를 추측하여 URL에 입력함으로써 다른 테넌트의 데이터에 접근하지 못하도록 `HasTenants` 인터페이스의 `canAccessTenant()` 메서드도 구현해야 합니다.

또한 사용자가 [새 팀을 등록](#adding-a-tenant-registration-page)할 수 있도록 하는 것이 좋습니다.

## 테넌트 등록 페이지 추가하기 {#adding-a-tenant-registration-page}

등록 페이지를 통해 사용자가 새로운 테넌트를 생성할 수 있습니다.

로그인 후 앱을 방문할 때, 사용자가 이미 테넌트가 없다면 이 페이지로 리디렉션됩니다.

등록 페이지를 설정하려면, `Filament\Pages\Tenancy\RegisterTenant`를 확장하는 새 페이지 클래스를 생성해야 합니다. 이는 전체 페이지 Livewire 컴포넌트입니다. 원하는 위치(예: `app/Filament/Pages/Tenancy/RegisterTeam.php`)에 생성할 수 있습니다:

```php
namespace App\Filament\Pages\Tenancy;

use App\Models\Team;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Tenancy\RegisterTenant;

class RegisterTeam extends RegisterTenant
{
    public static function getLabel(): string
    {
        return 'Register team';
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name'),
                // ...
            ]);
    }

    protected function handleRegistration(array $data): Team
    {
        $team = Team::create($data);

        $team->members()->attach(auth()->user());

        return $team;
    }
}
```

`form()` 메서드에 원하는 [폼 컴포넌트](../forms/getting-started)를 추가할 수 있으며, `handleRegistration()` 메서드 내에서 팀을 생성하면 됩니다.

이제 Filament에 이 페이지를 사용하도록 알려야 합니다. [설정](configuration)에서 다음과 같이 할 수 있습니다:

```php
use App\Filament\Pages\Tenancy\RegisterTeam;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantRegistration(RegisterTeam::class);
}
```

### 테넌트 등록 페이지 커스터마이징 {#customizing-the-tenant-registration-page}

기본 등록 페이지 클래스에서 원하는 메서드를 오버라이드하여 원하는 동작을 하도록 만들 수 있습니다. `$view` 속성도 오버라이드하여 원하는 커스텀 뷰를 사용할 수 있습니다.

## 테넌트 프로필 페이지 추가하기 {#adding-a-tenant-profile-page}

프로필 페이지를 통해 사용자가 테넌트 정보를 수정할 수 있습니다.

프로필 페이지를 설정하려면, `Filament\Pages\Tenancy\EditTenantProfile`을 확장하는 새 페이지 클래스를 생성해야 합니다. 이는 전체 페이지 Livewire 컴포넌트입니다. 원하는 위치(예: `app/Filament/Pages/Tenancy/EditTeamProfile.php`)에 생성할 수 있습니다:

```php
namespace App\Filament\Pages\Tenancy;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Tenancy\EditTenantProfile;

class EditTeamProfile extends EditTenantProfile
{
    public static function getLabel(): string
    {
        return 'Team profile';
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name'),
                // ...
            ]);
    }
}
```

`form()` 메서드에 원하는 [폼 컴포넌트](../forms/getting-started)를 추가할 수 있습니다. 이들은 테넌트 모델에 직접 저장됩니다.

이제 Filament에 이 페이지를 사용하도록 알려야 합니다. [설정](configuration)에서 다음과 같이 할 수 있습니다:

```php
use App\Filament\Pages\Tenancy\EditTeamProfile;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantProfile(EditTeamProfile::class);
}
```

### 테넌트 프로필 페이지 커스터마이징 {#customizing-the-tenant-profile-page}

기본 프로필 페이지 클래스에서 원하는 메서드를 오버라이드하여 원하는 동작을 하도록 만들 수 있습니다. `$view` 속성도 오버라이드하여 원하는 커스텀 뷰를 사용할 수 있습니다.

## 현재 테넌트 접근하기 {#accessing-the-current-tenant}

앱 어디에서나, 현재 요청의 테넌트 모델에 `Filament::getTenant()`를 사용하여 접근할 수 있습니다:

```php
use Filament\Facades\Filament;

$tenant = Filament::getTenant();
```

## 결제 {#billing}

### Laravel Spark 사용하기 {#using-laravel-spark}

Filament는 [Laravel Spark](https://spark.laravel.com)와의 결제 통합을 제공합니다. 사용자는 구독을 시작하고 결제 정보를 관리할 수 있습니다.

통합을 설치하려면, 먼저 [Spark를 설치](https://spark.laravel.com/docs/installation.html)하고 테넌트 모델에 맞게 설정하세요.

이제 Composer를 사용하여 Spark용 Filament 결제 프로바이더를 설치할 수 있습니다:

```bash
composer require filament/spark-billing-provider
```

[설정](configuration)에서 Spark를 `tenantBillingProvider()`로 지정하세요:

```php
use Filament\Billing\Providers\SparkBillingProvider;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantBillingProvider(new SparkBillingProvider());
}
```

이제 준비가 완료되었습니다! 사용자는 테넌트 메뉴의 링크를 클릭하여 결제를 관리할 수 있습니다.

### 구독 필수화 {#requiring-a-subscription}

앱의 모든 부분을 사용하려면 구독이 필요하도록 하려면, `requiresTenantSubscription()` 설정 메서드를 사용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->requiresTenantSubscription();
}
```

이제 사용자가 활성 구독이 없으면 결제 페이지로 리디렉션됩니다.

#### 특정 리소스 및 페이지에만 구독 필수화 {#requiring-a-subscription-for-specific-resources-and-pages}

때로는 앱의 특정 [리소스](resources/getting-started) 및 [커스텀 페이지](pages)에만 구독이 필요하도록 하고 싶을 수 있습니다. 리소스 또는 페이지 클래스에서 `isTenantSubscriptionRequired()` 메서드에서 `true`를 반환하면 됩니다:

```php
public static function isTenantSubscriptionRequired(Panel $panel): bool
{
    return true;
}
```

`requiresTenantSubscription()` 설정 메서드를 사용하는 경우, 이 메서드에서 `false`를 반환하여 예외적으로 리소스나 페이지에 접근을 허용할 수 있습니다.

### 커스텀 결제 통합 작성하기 {#writing-a-custom-billing-integration}

결제 통합은 매우 간단하게 작성할 수 있습니다. `Filament\Billing\Providers\Contracts\Provider` 인터페이스를 구현하는 클래스를 하나 만들면 됩니다. 이 인터페이스에는 두 개의 메서드가 있습니다.

`getRouteAction()`은 사용자가 결제 페이지를 방문할 때 실행되어야 하는 라우트 액션을 가져오는 데 사용됩니다. 이는 콜백 함수, 컨트롤러 이름, Livewire 컴포넌트 등 Laravel에서 `Route::get()`을 사용할 때 동작하는 모든 것이 될 수 있습니다. 예를 들어, 콜백 함수를 사용하여 자체 결제 페이지로 간단히 리디렉션할 수 있습니다.

`getSubscribedMiddleware()`는 테넌트가 활성 구독을 가지고 있는지 확인하는 데 사용되는 미들웨어의 이름을 반환합니다. 이 미들웨어는 사용자가 활성 구독이 없으면 결제 페이지로 리디렉션해야 합니다.

다음은 라우트 액션에 콜백 함수를, 구독 미들웨어에 미들웨어를 사용하는 예시 결제 프로바이더입니다:

```php
use App\Http\Middleware\RedirectIfUserNotSubscribed;
use Filament\Billing\Providers\Contracts\Provider;
use Illuminate\Http\RedirectResponse;

class ExampleBillingProvider implements Provider
{
    public function getRouteAction(): string
    {
        return function (): RedirectResponse {
            return redirect('https://billing.example.com');
        };
    }

    public function getSubscribedMiddleware(): string
    {
        return RedirectIfUserNotSubscribed::class;
    }
}
```

### 결제 라우트 슬러그 커스터마이징 {#customizing-the-billing-route-slug}

[설정](configuration)에서 `tenantBillingRouteSlug()` 메서드를 사용하여 결제 라우트에 사용되는 URL 슬러그를 커스터마이징할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantBillingRouteSlug('billing');
}
```

## 테넌트 메뉴 커스터마이징 {#customizing-the-tenant-menu}

테넌트 전환 메뉴는 관리자 레이아웃에 포함되어 있습니다. 완전히 커스터마이징할 수 있습니다.

테넌트 메뉴에 새 항목을 등록하려면, [설정](configuration)에서 다음과 같이 할 수 있습니다:

```php
use App\Filament\Pages\Settings;
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            MenuItem::make()
                ->label('Settings')
                ->url(fn (): string => Settings::getUrl())
                ->icon('heroicon-m-cog-8-tooth'),
            // ...
        ]);
}
```

### 등록 링크 커스터마이징 {#customizing-the-registration-link}

테넌트 메뉴의 등록 링크를 커스터마이징하려면, `register` 배열 키로 새 항목을 등록하세요:

```php
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            'register' => MenuItem::make()->label('Register new team'),
            // ...
        ]);
}
```

### 프로필 링크 커스터마이징 {#customizing-the-profile-link}

테넌트 메뉴의 프로필 링크를 커스터마이징하려면, `profile` 배열 키로 새 항목을 등록하세요:

```php
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            'profile' => MenuItem::make()->label('Edit team profile'),
            // ...
        ]);
}
```

### 결제 링크 커스터마이징 {#customizing-the-billing-link}

테넌트 메뉴의 결제 링크를 커스터마이징하려면, `billing` 배열 키로 새 항목을 등록하세요:

```php
use Filament\Navigation\MenuItem;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenuItems([
            'billing' => MenuItem::make()->label('Manage subscription'),
            // ...
        ]);
}
```

### 테넌트 메뉴 항목 조건부 숨기기 {#conditionally-hiding-tenant-menu-items}

`visible()` 또는 `hidden()` 메서드를 사용하여 조건에 따라 테넌트 메뉴 항목을 숨길 수 있습니다. 함수를 전달하면 메뉴가 실제로 렌더링될 때 조건 평가가 지연됩니다:

```php
use Filament\Navigation\MenuItem;

MenuItem::make()
    ->label('Settings')
    ->visible(fn (): bool => auth()->user()->can('manage-team'))
    // 또는
    ->hidden(fn (): bool => ! auth()->user()->can('manage-team'))
```

### 테넌트 메뉴 항목에서 `POST` HTTP 요청 보내기 {#sending-a-post-http-request-from-a-tenant-menu-item}

`postAction()` 메서드에 URL을 전달하여 테넌트 메뉴 항목에서 `POST` HTTP 요청을 보낼 수 있습니다:

```php
use Filament\Navigation\MenuItem;

MenuItem::make()
    ->label('Lock session')
    ->postAction(fn (): string => route('lock-session'))
```

### 테넌트 메뉴 숨기기 {#hiding-the-tenant-menu}

`tenantMenu(false)`를 사용하여 테넌트 메뉴를 숨길 수 있습니다

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMenu(false);
}
```

하지만, 이는 Filament의 테넌시 기능이 여러분의 프로젝트에 적합하지 않다는 신호입니다. 각 사용자가 하나의 테넌트에만 속한다면, [단순 일대다 테넌시](#simple-one-to-many-tenancy)를 사용하는 것이 좋습니다.

## 아바타 설정하기 {#setting-up-avatars}

기본적으로 Filament는 [ui-avatars.com](https://ui-avatars.com)을 사용하여 사용자의 이름을 기반으로 아바타를 생성합니다. 하지만 사용자 모델에 `avatar_url` 속성이 있으면, 해당 값이 대신 사용됩니다. Filament가 사용자의 아바타 URL을 가져오는 방식을 커스터마이징하려면, `HasAvatar` 계약을 구현하면 됩니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Illuminate\Database\Eloquent\Model;

class Team extends Model implements HasAvatar
{
    // ...

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }
}
```

`getFilamentAvatarUrl()` 메서드는 현재 사용자의 아바타를 가져오는 데 사용됩니다. 이 메서드에서 `null`을 반환하면, Filament는 [ui-avatars.com](https://ui-avatars.com)을 기본값으로 사용합니다.

[ui-avatars.com](https://ui-avatars.com) 대신 다른 서비스를 사용하려면, 새로운 아바타 프로바이더를 만들면 됩니다. [여기에서 방법을 확인할 수 있습니다.](users#using-a-different-avatar-provider)

## 테넌트 관계 설정하기 {#configuring-the-tenant-relationships}

테넌트와 연관된 레코드를 생성하거나 나열할 때, Filament는 각 리소스에 대해 두 개의 Eloquent 관계에 접근해야 합니다 - 리소스 모델 클래스에 정의된 "소유" 관계와, 테넌트 모델 클래스에 정의된 관계입니다. 기본적으로 Filament는 표준 Laravel 규칙에 따라 이 관계의 이름을 추측합니다. 예를 들어, 테넌트 모델이 `App\Models\Team`이면, 리소스 모델 클래스에 `team()` 관계가 있는지 찾습니다. 리소스 모델 클래스가 `App\Models\Post`라면, 테넌트 모델 클래스에 `posts()` 관계가 있는지 찾습니다.

### 소유 관계 이름 커스터마이징 {#customizing-the-ownership-relationship-name}

모든 리소스에서 사용되는 소유 관계의 이름을 한 번에 커스터마이징하려면, `tenant()` 설정 메서드의 `ownershipRelationship` 인자를 사용하세요. 이 예시에서는 리소스 모델 클래스에 `owner` 관계가 정의되어 있습니다:

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, ownershipRelationship: 'owner');
}
```

또는, 리소스 클래스에서 `$tenantOwnershipRelationshipName` 정적 속성을 설정하여 해당 리소스에만 소유 관계 이름을 커스터마이징할 수 있습니다. 이 예시에서는 `Post` 모델 클래스에 `owner` 관계가 정의되어 있습니다:

```php
use Filament\Resources\Resource;

class PostResource extends Resource
{
    protected static ?string $tenantOwnershipRelationshipName = 'owner';

    // ...
}
```

### 리소스 관계 이름 커스터마이징 {#customizing-the-resource-relationship-name}

리소스 클래스에서 `$tenantRelationshipName` 정적 속성을 설정하여 해당 리소스를 가져오는 데 사용되는 관계 이름을 커스터마이징할 수 있습니다. 이 예시에서는 테넌트 모델 클래스에 `blogPosts` 관계가 정의되어 있습니다:

```php
use Filament\Resources\Resource;

class PostResource extends Resource
{
    protected static ?string $tenantRelationshipName = 'blogPosts';

    // ...
}
```

## 슬러그 속성 설정하기 {#configuring-the-slug-attribute}

팀과 같은 테넌트를 사용할 때, 팀의 ID 대신 URL에 슬러그 필드를 추가하고 싶을 수 있습니다. `tenant()` 설정 메서드의 `slugAttribute` 인자를 사용하여 이를 할 수 있습니다:

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, slugAttribute: 'slug');
}
```

## 이름 속성 설정하기 {#configuring-the-name-attribute}

기본적으로 Filament는 테넌트의 `name` 속성을 사용하여 앱에서 이름을 표시합니다. 이를 변경하려면, `HasName` 계약을 구현하면 됩니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\HasName;
use Illuminate\Database\Eloquent\Model;

class Team extends Model implements HasName
{
    // ...

    public function getFilamentName(): string
    {
        return "{$this->name} {$this->subscription_plan}";
    }
}
```

`getFilamentName()` 메서드는 현재 사용자의 이름을 가져오는 데 사용됩니다.

## 현재 테넌트 라벨 설정하기 {#setting-the-current-tenant-label}

테넌트 전환기 내에서, 현재 팀 이름 위에 "활성 팀"과 같은 작은 라벨을 추가하고 싶을 수 있습니다. 테넌트 모델에서 `HasCurrentTenantLabel` 메서드를 구현하면 됩니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\HasCurrentTenantLabel;
use Illuminate\Database\Eloquent\Model;

class Team extends Model implements HasCurrentTenantLabel
{
    // ...

    public function getCurrentTenantLabel(): string
    {
        return 'Active team';
    }
}
```

## 기본 테넌트 설정하기 {#setting-the-default-tenant}

로그인 시, Filament는 `getTenants()` 메서드에서 반환된 첫 번째 테넌트로 사용자를 리디렉션합니다.

때로는 이를 변경하고 싶을 수 있습니다. 예를 들어, 마지막으로 활성화된 팀을 저장해두고, 해당 팀으로 사용자를 리디렉션할 수 있습니다.

이를 커스터마이징하려면, 사용자에서 `HasDefaultTenant` 계약을 구현하면 됩니다:

```php
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasDefaultTenant;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Model implements FilamentUser, HasDefaultTenant, HasTenants
{
    // ...

    public function getDefaultTenant(Panel $panel): ?Model
    {
        return $this->latestTeam;
    }

    public function latestTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'latest_team_id');
    }
}
```

## 테넌트 인식 라우트에 미들웨어 적용하기 {#applying-middleware-to-tenant-aware-routes}

[패널 설정 파일](configuration)에서 `tenantMiddleware()` 메서드에 미들웨어 클래스 배열을 전달하여 모든 테넌트 인식 라우트에 추가 미들웨어를 적용할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMiddleware([
            // ...
        ]);
}
```

기본적으로 미들웨어는 페이지가 처음 로드될 때만 실행되며, 이후 Livewire AJAX 요청에서는 실행되지 않습니다. 모든 요청마다 미들웨어를 실행하려면, `tenantMiddleware()` 메서드의 두 번째 인자로 `true`를 전달하여 영구적으로 만들 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMiddleware([
            // ...
        ], isPersistent: true);
}
```

## 테넌트 라우트 프리픽스 추가하기 {#adding-a-tenant-route-prefix}

기본적으로 URL 구조는 패널 경로 바로 뒤에 테넌트 ID 또는 슬러그가 옵니다. 다른 URL 세그먼트로 프리픽스를 추가하고 싶다면, `tenantRoutePrefix()` 메서드를 사용하세요:

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->path('admin')
        ->tenant(Team::class)
        ->tenantRoutePrefix('team');
}
```

이전에는 테넌트 1의 URL 구조가 `/admin/1`이었습니다. 이제는 `/admin/team/1`이 됩니다.

## 도메인으로 테넌트 식별하기 {#using-a-domain-to-identify-the-tenant}

테넌트를 사용할 때, `/team1/posts`와 같은 라우트 프리픽스 대신 `team1.example.com/posts`와 같은 도메인 또는 서브도메인 라우팅을 사용하고 싶을 수 있습니다. `tenant()` 설정 메서드와 함께 `tenantDomain()` 메서드를 사용하면 됩니다. `tenant` 인자는 테넌트 모델의 슬러그 속성에 해당합니다:

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, slugAttribute: 'slug')
        ->tenantDomain('{tenant:slug}.example.com');
}
```

위 예시에서는 테넌트가 메인 앱 도메인의 서브도메인에 존재합니다. 또한 전체 도메인을 테넌트에서 해석하도록 시스템을 설정할 수도 있습니다:

```php
use App\Models\Team;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenant(Team::class, slugAttribute: 'domain')
        ->tenantDomain('{tenant:domain}');
}
```

이 예시에서 `domain` 속성은 `example.com` 또는 `subdomain.example.com`과 같은 유효한 도메인 호스트를 포함해야 합니다.

> 참고: 전체 도메인에 파라미터를 사용하는 경우(`tenantDomain('{tenant:domain}')`), Filament는 애플리케이션의 모든 `tenant` 파라미터에 대해 `[a-z0-9.\-]+`로 [글로벌 라우트 파라미터 패턴](/laravel/12.x/routing#parameters-global-constraints)을 등록합니다. 이는 Laravel이 기본적으로 라우트 파라미터에 `.` 문자를 허용하지 않기 때문입니다. 이는 테넌시를 사용하는 다른 패널이나, 애플리케이션의 다른 부분에서 `tenant` 라우트 파라미터를 사용할 때 충돌이 발생할 수 있습니다.

## 리소스에 대해 테넌시 비활성화하기 {#disabling-tenancy-for-a-resource}

기본적으로 테넌시가 활성화된 패널 내의 모든 리소스는 현재 테넌트에 범위가 지정됩니다. 테넌트 간에 공유되는 리소스가 있다면, 리소스 클래스에서 `$isScopedToTenant` 정적 속성을 `false`로 설정하여 테넌시를 비활성화할 수 있습니다:

```php
protected static bool $isScopedToTenant = false;
```

### 모든 리소스에 대해 테넌시 비활성화하기 {#disabling-tenancy-for-all-resources}

각 리소스마다 테넌시에 opt-in(선택적 적용)하고 싶다면, 서비스 프로바이더의 `boot()` 메서드나 미들웨어에서 `Resource::scopeToTenant(false)`를 호출하세요:

```php
use Filament\Resources\Resource;

Resource::scopeToTenant(false);
```

이제 각 리소스 클래스에서 `$isScopedToTenant` 정적 속성을 `true`로 설정하여 테넌시에 opt-in할 수 있습니다:

```php
protected static bool $isScopedToTenant = true;
```

## 테넌시 보안 {#tenancy-security}

멀티 테넌시의 보안적 의미와 올바른 구현 방법을 이해하는 것이 중요합니다. 부분적으로 또는 잘못 구현할 경우, 한 테넌트의 데이터가 다른 테넌트에게 노출될 수 있습니다. Filament는 애플리케이션에서 멀티 테넌시를 구현하는 데 도움이 되는 도구를 제공하지만, 이를 어떻게 사용하는지는 여러분에게 달려 있습니다. Filament는 애플리케이션의 보안에 대해 어떠한 보장도 제공하지 않습니다. 애플리케이션의 보안을 보장하는 것은 여러분의 책임입니다.

아래는 Filament가 멀티 테넌시 구현을 돕기 위해 제공하는 기능 목록입니다:

- 리소스를 현재 테넌트에 자동으로 범위 지정. 리소스의 레코드를 가져오는 데 사용되는 기본 Eloquent 쿼리는 자동으로 현재 테넌트에 범위가 지정됩니다. 이 쿼리는 리소스의 리스트 테이블을 렌더링할 때 사용되며, 레코드를 편집하거나 볼 때 현재 URL에서 레코드를 해석하는 데도 사용됩니다. 즉, 사용자가 현재 테넌트에 속하지 않은 레코드를 보려고 시도하면 404 오류가 발생합니다.

- 새 리소스 레코드를 현재 테넌트에 자동으로 연관.

그리고 Filament가 현재 제공하지 않는 기능은 다음과 같습니다:

- 관계 관리자 레코드의 테넌트 범위 지정. 관계 관리자를 사용할 때, 대부분의 경우 쿼리는 현재 테넌트에 범위 지정할 필요가 없습니다. 이미 상위 레코드에 범위가 지정되어 있고, 상위 레코드 자체가 현재 테넌트에 범위가 지정되어 있기 때문입니다. 예를 들어, `Team` 테넌트 모델에 `Author` 리소스가 있고, 해당 리소스에 `posts` 관계 및 관계 관리자가 설정되어 있으며, 게시글이 하나의 저자에만 속한다면 쿼리에 범위를 지정할 필요가 없습니다. 사용자는 어차피 현재 팀에 속한 저자만 볼 수 있고, 따라서 해당 저자에 속한 게시글만 볼 수 있기 때문입니다. 원한다면 [Eloquent 쿼리에 범위 지정](resources/relation-managers#customizing-the-relation-manager-eloquent-query)을 할 수 있습니다.

- 폼 컴포넌트 및 필터 범위 지정. `Select`, `CheckboxList`, `Repeater` 폼 컴포넌트, `SelectFilter` 또는 데이터베이스에서 "옵션"이나 기타 데이터를 자동으로 가져올 수 있는 Filament 컴포넌트(보통 `relationship()` 메서드를 사용하는)는 이 데이터가 범위 지정되지 않습니다. 그 주된 이유는 이러한 기능이 Filament Panel Builder 패키지에 속하지 않는 경우가 많고, 해당 컨텍스트 내에서 사용되고 있다는 사실이나 테넌트가 존재한다는 사실을 알지 못하기 때문입니다. 그리고 테넌트 관계 설정을 저장할 곳도 없습니다. 이러한 컴포넌트를 범위 지정하려면, 쿼리를 현재 테넌트에 범위 지정하는 쿼리 함수를 전달해야 합니다. 예를 들어, `Select` 폼 컴포넌트를 사용하여 관계에서 `author`를 선택한다면 다음과 같이 할 수 있습니다:

```php
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;

Select::make('author_id')
    ->relationship(
        name: 'author',
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->whereBelongsTo(Filament::getTenant()),
    );
```

### 테넌트 인식 미들웨어를 사용하여 글로벌 스코프 적용하기 {#using-tenant-aware-middleware-to-apply-global-scopes}

패널에서 Eloquent 모델에 글로벌 스코프를 적용하는 것이 유용할 수 있습니다. 이렇게 하면 쿼리를 현재 테넌트에 범위 지정하는 것을 잊어버려도, 자동으로 범위가 적용됩니다. 이를 위해 `ApplyTenantScopes`와 같은 새 미들웨어 클래스를 만들 수 있습니다:

```bash
php artisan make:middleware ApplyTenantScopes
```

`handle()` 메서드 내에서 원하는 글로벌 스코프를 적용할 수 있습니다:

```php
use App\Models\Author;
use Closure;
use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ApplyTenantScopes
{
    public function handle(Request $request, Closure $next)
    {
        Author::addGlobalScope(
            fn (Builder $query) => $query->whereBelongsTo(Filament::getTenant()),
        );

        return $next($request);
    }
}
```

이제 [이 미들웨어를 등록](#applying-middleware-to-tenant-aware-routes)하고, `isPersistent`를 `true`로 설정하여 모든 Livewire AJAX 요청에서도 사용되도록 할 수 있습니다:

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->tenantMiddleware([
            ApplyTenantScopes::class,
        ], isPersistent: true);
}
```
