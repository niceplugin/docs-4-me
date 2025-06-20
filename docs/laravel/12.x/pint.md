# Laravel Pint












## 소개 {#introduction}

[Laravel Pint](https://github.com/laravel/pint)는 미니멀리스트를 위한 주관적인 PHP 코드 스타일 자동 수정 도구입니다. Pint는 [PHP CS Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer)를 기반으로 하며, 코드 스타일을 깔끔하고 일관되게 유지하는 것을 간단하게 만들어줍니다.

Pint는 모든 새로운 Laravel 애플리케이션에 자동으로 설치되므로 즉시 사용할 수 있습니다. 기본적으로 Pint는 별도의 설정 없이 Laravel의 주관적인 코딩 스타일을 따라 코드 스타일 문제를 자동으로 수정합니다.


## 설치 {#installation}

Pint는 최근 릴리즈된 Laravel 프레임워크에 포함되어 있으므로 별도의 설치가 필요하지 않습니다. 하지만, 구버전 애플리케이션의 경우 Composer를 통해 Laravel Pint를 설치할 수 있습니다:

```shell
composer require laravel/pint --dev
```


## Pint 실행하기 {#running-pint}

프로젝트의 `vendor/bin` 디렉터리에 있는 `pint` 바이너리를 실행하여 Pint가 코드 스타일 문제를 자동으로 수정하도록 할 수 있습니다:

```shell
./vendor/bin/pint
```

특정 파일이나 디렉터리에 대해서만 Pint를 실행할 수도 있습니다:

```shell
./vendor/bin/pint app/Models

./vendor/bin/pint app/Models/User.php
```

Pint는 업데이트한 모든 파일의 상세 목록을 표시합니다. Pint의 변경 사항에 대해 더 자세한 정보를 보고 싶다면, Pint 실행 시 `-v` 옵션을 제공하면 됩니다:

```shell
./vendor/bin/pint -v
```

파일을 실제로 변경하지 않고 코드 스타일 오류만 검사하고 싶다면, `--test` 옵션을 사용할 수 있습니다. 코드 스타일 오류가 발견되면 Pint는 0이 아닌 종료 코드를 반환합니다:

```shell
./vendor/bin/pint --test
```

Git 기준으로 제공된 브랜치와 다른 파일만 Pint가 수정하도록 하려면, `--diff=[branch]` 옵션을 사용할 수 있습니다. 이는 CI 환경(예: GitHub Actions)에서 새로 추가되거나 수정된 파일만 검사하여 시간을 절약하는 데 효과적입니다:

```shell
./vendor/bin/pint --diff=main
```

Git 기준으로 커밋되지 않은 변경 사항이 있는 파일만 Pint가 수정하도록 하려면, `--dirty` 옵션을 사용할 수 있습니다:

```shell
./vendor/bin/pint --dirty
```

코드 스타일 오류가 있는 파일을 수정하되, 오류가 수정된 경우 0이 아닌 종료 코드로 종료하고 싶다면, `--repair` 옵션을 사용할 수 있습니다:

```shell
./vendor/bin/pint --repair
```


## Pint 설정하기 {#configuring-pint}

앞서 언급했듯이, Pint는 별도의 설정이 필요하지 않습니다. 하지만 프리셋, 규칙, 검사할 폴더를 커스터마이즈하고 싶다면, 프로젝트 루트 디렉터리에 `pint.json` 파일을 생성하여 설정할 수 있습니다:

```json
{
    "preset": "laravel"
}
```

또한, 특정 디렉터리의 `pint.json`을 사용하고 싶다면, Pint 실행 시 `--config` 옵션을 제공할 수 있습니다:

```shell
./vendor/bin/pint --config vendor/my-company/coding-style/pint.json
```


### 프리셋 {#presets}

프리셋은 코드 스타일 문제를 수정하는 데 사용할 수 있는 규칙 집합을 정의합니다. 기본적으로 Pint는 `laravel` 프리셋을 사용하며, Laravel의 주관적인 코딩 스타일을 따라 문제를 수정합니다. 하지만, Pint에 `--preset` 옵션을 제공하여 다른 프리셋을 지정할 수도 있습니다:

```shell
./vendor/bin/pint --preset psr12
```

원한다면, 프로젝트의 `pint.json` 파일에서 프리셋을 설정할 수도 있습니다:

```json
{
    "preset": "psr12"
}
```

Pint가 현재 지원하는 프리셋은 다음과 같습니다: `laravel`, `per`, `psr12`, `symfony`, `empty`.


### 규칙 {#rules}

규칙은 Pint가 코드 스타일 문제를 수정할 때 사용할 스타일 가이드라인입니다. 위에서 언급했듯이, 프리셋은 대부분의 PHP 프로젝트에 적합한 사전 정의된 규칙 그룹이므로, 일반적으로 개별 규칙을 신경 쓸 필요가 없습니다.

하지만, 원한다면 `pint.json` 파일에서 특정 규칙을 활성화하거나 비활성화할 수 있으며, `empty` 프리셋을 사용해 규칙을 처음부터 직접 정의할 수도 있습니다:

```json
{
    "preset": "laravel",
    "rules": {
        "simplified_null_return": true,
        "array_indentation": false,
        "new_with_parentheses": {
            "anonymous_class": true,
            "named_class": true
        }
    }
}
```

Pint는 [PHP CS Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer)를 기반으로 만들어졌습니다. 따라서, 프로젝트의 코드 스타일 문제를 수정할 때 PHP CS Fixer의 모든 규칙을 사용할 수 있습니다: [PHP CS Fixer Configurator](https://mlocati.github.io/php-cs-fixer-configurator).


### 파일/폴더 제외하기 {#excluding-files-or-folders}

기본적으로 Pint는 `vendor` 디렉터리를 제외한 프로젝트 내 모든 `.php` 파일을 검사합니다. 더 많은 폴더를 제외하고 싶다면, `exclude` 설정 옵션을 사용할 수 있습니다:

```json
{
    "exclude": [
        "my-specific/folder"
    ]
}
```

특정 이름 패턴을 포함하는 모든 파일을 제외하고 싶다면, `notName` 설정 옵션을 사용할 수 있습니다:

```json
{
    "notName": [
        "*-my-file.php"
    ]
}
```

정확한 경로를 지정하여 파일을 제외하고 싶다면, `notPath` 설정 옵션을 사용할 수 있습니다:

```json
{
    "notPath": [
        "path/to/excluded-file.php"
    ]
}
```


## 지속적 통합 {#continuous-integration}


### GitHub Actions {#running-tests-on-github-actions}

Laravel Pint로 프로젝트 린팅을 자동화하려면, [GitHub Actions](https://github.com/features/actions)를 구성하여 새로운 코드가 GitHub에 푸시될 때마다 Pint가 실행되도록 할 수 있습니다. 먼저, GitHub의 **Settings > Actions > General > Workflow permissions**에서 워크플로우에 "읽기 및 쓰기 권한(Read and write permissions)"을 부여해야 합니다. 그런 다음, 아래와 같이 `.github/workflows/lint.yml` 파일을 생성합니다:

```yaml
name: Fix Code Style

on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        php: [8.4]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php }}
          extensions: json, dom, curl, libxml, mbstring
          coverage: none

      - name: Install Pint
        run: composer global require laravel/pint

      - name: Run Pint
        run: pint

      - name: Commit linted files
        uses: stefanzweifel/git-auto-commit-action@v5
```
