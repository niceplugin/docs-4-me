---
title: 고급 액션
---
# [액션] 고급 액션
## 액션 유틸리티 주입 {#action-utility-injection}

대부분의 액션 설정 메서드는 하드코딩된 값 대신 함수(클로저)를 파라미터로 받습니다:

```php
Action::make('edit')
    ->label('Edit post')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

이것만으로도 다양한 커스터마이징이 가능합니다.

이 패키지는 또한 이러한 함수 내부에서 사용할 수 있는 다양한 유틸리티를 파라미터로 주입할 수 있습니다. 함수형 인자를 받는 모든 커스터마이징 메서드는 유틸리티 주입이 가능합니다.

이렇게 주입되는 유틸리티들은 특정 파라미터 이름을 사용해야 합니다. 그렇지 않으면 Filament가 무엇을 주입해야 하는지 알 수 없습니다.

### 현재 모달 폼 데이터 주입하기 {#injecting-the-current-modal-form-data}

현재 [모달 폼 데이터](modals#modal-forms)에 접근하고 싶다면, `$data` 파라미터를 정의하세요:

```php
function (array $data) {
    // ...
}
```

모달이 아직 제출되지 않았다면 이 값이 비어 있을 수 있다는 점에 유의하세요.

### 현재 인자 주입하기 {#injecting-the-current-arguments}

액션에 전달된 [현재 인자](adding-an-action-to-a-livewire-component#passing-action-arguments)에 접근하고 싶다면, `$arguments` 파라미터를 정의하세요:

```php
function (array $arguments) {
    // ...
}
```

### 현재 Livewire 컴포넌트 인스턴스 주입하기 {#injecting-the-current-livewire-component-instance}

액션이 속한 현재 Livewire 컴포넌트 인스턴스에 접근하고 싶다면, `$livewire` 파라미터를 정의하세요:

```php
use Livewire\Component;

function (Component $livewire) {
    // ...
}
```

### 현재 액션 인스턴스 주입하기 {#injecting-the-current-action-instance}

현재 액션 인스턴스에 접근하고 싶다면, `$action` 파라미터를 정의하세요:

```php
function (Action $action) {
    // ...
}
```

### 여러 유틸리티 주입하기 {#injecting-multiple-utilities}

매개변수는 리플렉션을 사용하여 동적으로 주입되므로, 여러 매개변수를 어떤 순서로든 조합할 수 있습니다:

```php
use Livewire\Component;

function (array $arguments, Component $livewire) {
    // ...
}
```

### 라라벨 컨테이너에서 의존성 주입하기 {#injecting-dependencies-from-laravels-container}

유틸리티와 함께, 라라벨 컨테이너에서 평소처럼 어떤 것이든 주입할 수 있습니다:

```php
use Illuminate\Http\Request;

function (Request $request, array $arguments) {
    // ...
}
```
