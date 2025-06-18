---
title: 클러스터
---
# [패널] 클러스터
## 개요 {#overview}

클러스터는 패널 내에서 [리소스](resources)와 [커스텀 페이지](pages)를 함께 그룹화할 수 있는 계층적 구조입니다. 클러스터는 패널을 논리적인 섹션으로 구성하는 데 유용하며, 패널의 사이드바 크기를 줄이는 데 도움이 됩니다.

클러스터를 사용할 때는 다음과 같은 일들이 발생합니다:

- 클러스터 내 첫 번째 리소스나 페이지로 연결되는 새로운 네비게이션 항목이 네비게이션에 추가됩니다.
- 해당 리소스나 페이지의 개별 네비게이션 항목은 메인 네비게이션에서 더 이상 보이지 않습니다.
- 클러스터 내 각 리소스나 페이지에 클러스터에 속한 리소스나 페이지의 네비게이션 항목을 포함하는 새로운 하위 네비게이션 UI가 추가됩니다.
- 클러스터 내의 리소스와 페이지는 클러스터 이름이 접두사로 붙은 새로운 URL을 갖게 됩니다. [리소스](resources/getting-started#generating-urls-to-resource-pages)와 [페이지](pages#generating-urls-to-pages)에 대한 URL을 올바르게 생성하고 있다면, 이 변경 사항은 자동으로 처리됩니다.
- 클러스터의 이름이 클러스터 내 모든 리소스와 페이지의 브레드크럼에 표시됩니다. 이를 클릭하면 클러스터 내 첫 번째 리소스나 페이지로 이동합니다.

## 클러스터 생성하기 {#creating-a-cluster}

첫 번째 클러스터를 생성하기 전에, 패널에 클러스터 클래스가 어디에 위치해야 하는지 알려주어야 합니다. [설정](configuration)에서 `discoverResources()`와 `discoverPages()`와 같은 메서드와 함께, `discoverClusters()`를 사용할 수 있습니다:

```php
public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
        ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
        ->discoverClusters(in: app_path('Filament/Clusters'), for: 'App\\Filament\\Clusters');
}
```

이제 `php artisan make:filament-cluster` 명령어로 클러스터를 생성할 수 있습니다:

```bash
php artisan make:filament-cluster Settings
```

이 명령어는 `app/Filament/Clusters` 디렉터리에 새로운 클러스터 클래스를 생성합니다:

```php
<?php

namespace App\Filament\Clusters;

use Filament\Clusters\Cluster;

class Settings extends Cluster
{
    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';
}
```

[`$navigationIcon`](navigation#customizing-a-navigation-items-icon) 속성은 기본적으로 정의되어 있습니다. 이는 대부분 바로 커스터마이즈하고 싶을 것이기 때문입니다. 그 외의 모든 [네비게이션 속성과 메서드](navigation)도 사용할 수 있으며, [`$navigationLabel`](navigation#customizing-a-navigation-items-label), [`$navigationSort`](navigation#sorting-navigation-items), [`$navigationGroup`](navigation#grouping-navigation-items) 등이 있습니다. 이 속성들은 리소스나 페이지의 네비게이션 항목을 커스터마이즈하는 것과 동일하게, 클러스터의 메인 네비게이션 항목을 커스터마이즈하는 데 사용됩니다.

## 클러스터에 리소스와 페이지 추가하기 {#adding-resources-and-pages-to-a-cluster}

리소스나 페이지를 클러스터에 추가하려면, 해당 리소스 또는 페이지 클래스에서 `$cluster` 프로퍼티를 정의하고, [생성한](#creating-a-cluster) 클러스터 클래스 값으로 설정하면 됩니다:

```php
use App\Filament\Clusters\Settings;

protected static ?string $cluster = Settings::class;
```

## 클러스터를 사용하는 패널의 코드 구조 권장 사항 {#code-structure-recommendations-for-panels-using-clusters}

클러스터를 사용할 때는 모든 리소스와 페이지를 클러스터와 동일한 이름의 디렉터리로 이동하는 것이 권장됩니다. 예를 들어, `Settings`라는 클러스터를 사용하는 패널의 디렉터리 구조는 다음과 같습니다. 이 구조에는 `ColorResource`와 두 개의 커스텀 페이지가 포함되어 있습니다:

```
.
+-- Clusters
|   +-- Settings.php
|   +-- Settings
|   |   +-- Pages
|   |   |   +-- ManageBranding.php
|   |   |   +-- ManageNotifications.php
|   |   +-- Resources
|   |   |   +-- ColorResource.php
|   |   |   +-- ColorResource
|   |   |   |   +-- Pages
|   |   |   |   |   +-- CreateColor.php
|   |   |   |   |   +-- EditColor.php
|   |   |   |   |   +-- ListColors.php
```

이것은 권장 사항일 뿐 필수는 아닙니다. 클러스터 내의 리소스와 페이지가 [`$cluster`](#adding-resources-and-pages-to-a-cluster) 속성을 사용하기만 하면, 원하는 대로 패널 구조를 구성할 수 있습니다. 이 구조는 패널을 더 체계적으로 관리하는 데 도움이 되는 제안일 뿐입니다.

패널에 클러스터가 존재하고, `make:filament-resource` 또는 `make:filament-page` 명령어로 새로운 리소스나 페이지를 생성할 때, 위의 가이드라인에 따라 클러스터 디렉터리 내에 생성할 것인지 묻게 됩니다. 만약 그렇게 선택하면, Filament가 해당 리소스나 페이지 클래스에 올바른 `$cluster` 속성도 자동으로 할당해줍니다. 그렇지 않은 경우에는 [직접 `$cluster` 속성을 정의](#adding-resources-and-pages-to-a-cluster)해야 합니다.

## 클러스터 브레드크럼 커스터마이징 {#customizing-the-cluster-breadcrumb}

클러스터의 이름은 클러스터 내 모든 리소스와 페이지의 브레드크럼에 표시됩니다.

클러스터 클래스에서 `$clusterBreadcrumb` 속성을 사용하여 브레드크럼 이름을 커스터마이징할 수 있습니다:

```php
protected static ?string $clusterBreadcrumb = 'cluster';
```

또는, `getClusterBreadcrumb()` 메서드를 사용하여 동적으로 브레드크럼 이름을 정의할 수도 있습니다:

```php
public static function getClusterBreadcrumb(): string
{
    return __('filament/clusters/cluster.name');
}
```
