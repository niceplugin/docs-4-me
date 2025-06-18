---
title: 시작하기
---
# [핵심개념.플러그인] 시작하기

<LaracastsBanner
    title="플러그인 설정하기"
    description="Laracasts에서 Filament를 위한 고급 컴포넌트 빌드(Build Advanced Components for Filament) 시리즈를 시청하세요. 플러그인 시작 방법을 배울 수 있습니다. 이 페이지의 텍스트 기반 가이드도 전체적인 개요를 제공할 수 있습니다."
    url="https://laracasts.com/series/build-advanced-components-for-filament/episodes/12"
    series="building-advanced-components"
/>

## 개요 {#overview}

Filament는 훌륭한 앱을 만들기 위해 필요한 거의 모든 도구를 기본적으로 제공하지만, 때로는 앱에만 필요한 기능을 추가하거나 다른 개발자들이 자신의 앱에 포함할 수 있는 재배포 가능한 패키지로 기능을 추가해야 할 때가 있습니다. 이를 위해 Filament는 기능을 확장할 수 있는 플러그인 시스템을 제공합니다.

본격적으로 시작하기 전에, 플러그인이 사용될 수 있는 다양한 컨텍스트를 이해하는 것이 중요합니다. 주요 컨텍스트는 두 가지입니다:

1. **패널 플러그인**: [패널 빌더](/filament/3.x/panels/installation)와 함께 사용되는 플러그인입니다. 일반적으로 패널 내부에서만 기능을 추가하거나, 자체적으로 완전한 패널로 사용될 때 사용됩니다. 예시는 다음과 같습니다:
   1. 대시보드에 위젯 형태로 특정 기능을 추가하는 플러그인
   2. 블로그나 사용자 관리 기능처럼 앱에 리소스/기능 집합을 추가하는 플러그인
2. **독립형 플러그인**: 패널 빌더 외의 모든 컨텍스트에서 사용되는 플러그인입니다. 예시는 다음과 같습니다:
   1. [폼 빌더](/filament/3.x/forms/installation)에서 사용할 수 있는 커스텀 필드를 추가하는 플러그인
   2. [테이블 빌더](/filament/3.x/tables/installation)에 커스텀 컬럼이나 필터를 추가하는 플러그인

이 두 가지는 플러그인을 만들 때 염두에 두어야 할 서로 다른 개념적 컨텍스트이지만, 동일한 플러그인 내에서 함께 사용할 수도 있습니다. 반드시 상호 배타적일 필요는 없습니다.

## 중요한 개념 {#important-concepts}

플러그인 제작의 세부 사항을 살펴보기 전에 이해해야 할 몇 가지 중요한 개념이 있습니다. 플러그인을 만들기 전에 다음 내용을 숙지하는 것이 좋습니다:

1. [라라벨 패키지 개발](https://laravel.com/docs/packages)
2. [Spatie 패키지 도구](https://github.com/spatie/laravel-package-tools)
3. [Filament 에셋 관리](/filament/3.x/support/assets)

### 플러그인 객체 {#the-plugin-object}

Filament v3에서는 플러그인을 구성하기 위해 Plugin 객체라는 개념이 도입되었습니다. 이 객체는 `Filament\Contracts\Plugin` 인터페이스를 구현하는 간단한 PHP 클래스입니다. 이 클래스는 플러그인을 구성하는 데 사용되며, 플러그인의 주요 진입점입니다. 또한 플러그인에서 사용할 수 있는 리소스와 아이콘을 등록하는 데에도 사용됩니다.

플러그인 객체는 매우 유용하지만, 플러그인을 만들 때 반드시 필요한 것은 아닙니다. [패널 플러그인 만들기](/filament/3.x/support/plugins/build-a-panel-plugin) 튜토리얼에서 볼 수 있듯이, 플러그인 객체를 사용하지 않고도 플러그인을 만들 수 있습니다.

> **정보**
> 플러그인 객체는 패널 프로바이더에만 사용됩니다. 독립형 플러그인은 이 객체를 사용하지 않습니다. 독립형 플러그인의 모든 구성은 플러그인의 서비스 프로바이더에서 처리해야 합니다.

### 에셋 등록하기 {#registering-assets}

모든 [에셋 등록](/filament/3.x/support/assets)(CSS, JS, Alpine 컴포넌트 포함)은 플러그인의 서비스 프로바이더의 `packageBooted()` 메서드에서 이루어져야 합니다. 이렇게 하면 Filament가 에셋을 에셋 매니저에 등록하고 필요할 때 로드할 수 있습니다.

## 플러그인 생성하기 {#creating-a-plugin}

플러그인을 처음부터 직접 만들 수도 있지만, 빠르게 시작하려면 [Filament Plugin Skeleton](https://github.com/filamentphp/plugin-skeleton)을 사용하는 것을 추천합니다. 이 스켈레톤에는 빠르게 시작하는 데 필요한 모든 기본 코드가 포함되어 있습니다.

### 사용법 {#usage}

스켈레톤을 사용하려면, GitHub 저장소로 이동하여 "Use this template" 버튼을 클릭하세요. 그러면 스켈레톤 코드가 포함된 새 저장소가 본인 계정에 생성됩니다. 그 후, 해당 저장소를 자신의 컴퓨터로 클론할 수 있습니다. 코드를 컴퓨터에 받은 후, 프로젝트의 루트 디렉터리로 이동하여 다음 명령어를 실행하세요:

```bash
php ./configure.php
```

이 명령어를 실행하면 플러그인 구성을 위한 일련의 질문이 표시됩니다. 모든 질문에 답변하면, 스크립트가 새로운 플러그인 구조를 생성해줍니다. 이제 Filament를 위한 멋진 새로운 확장 기능을 만들기 시작할 수 있습니다.

## 기존 플러그인 업그레이드 {#upgrading-existing-plugins}

각 플러그인은 사용 범위와 기능이 크게 다르기 때문에, 기존 플러그인을 업그레이드하는 데 있어 모든 상황에 맞는 하나의 방법은 존재하지 않습니다. 하지만 모든 플러그인에 공통적으로 적용되는 한 가지 사항은 `PluginServiceProvider`의 사용 중단입니다.

플러그인 서비스 프로바이더에서, 이제는 PackageServiceProvider를 확장하도록 변경해야 합니다. 또한 서비스 프로바이더에 정적 `$name` 프로퍼티를 추가해야 합니다. 이 프로퍼티는 Filament에 플러그인을 등록하는 데 사용됩니다. 아래는 서비스 프로바이더가 어떻게 보일 수 있는지에 대한 예시입니다:

```php
class MyPluginServiceProvider extends PackageServiceProvider
{
    public static string $name = 'my-plugin';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name);
    }
}
```

### 유용한 링크 {#helpful-links}

플러그인을 업그레이드하기 전에 이 가이드를 전체적으로 읽어보시기 바랍니다. 이 가이드는 개념을 이해하고 플러그인을 어떻게 구축하는지에 도움이 됩니다.

1. [Filament 에셋 관리](/filament/3.x/support/assets)
2. [패널 플러그인 개발](/filament/3.x/panels/plugins)
3. [아이콘 관리](/filament/3.x/support/icons)
4. [색상 관리](/filament/3.x/support/colors)
5. [스타일 커스터마이징](/filament/3.x/support/style-customization)
6. 