# Precognition















## 소개 {#introduction}

Laravel Precognition은 미래의 HTTP 요청 결과를 미리 예측할 수 있게 해줍니다. Precognition의 주요 사용 사례 중 하나는 프론트엔드 JavaScript 애플리케이션에서 백엔드 검증 규칙을 중복하지 않고도 "실시간" 검증을 제공할 수 있다는 점입니다. Precognition은 Laravel의 Inertia 기반 [스타터 키트](/laravel/12.x/starter-kits)와 특히 잘 어울립니다.

Laravel이 "precognitive request"를 받으면, 해당 라우트의 모든 미들웨어를 실행하고 라우트 컨트롤러의 의존성을 해결하며, [폼 요청](/laravel/12.x/validation#form-request-validation) 검증도 수행합니다. 하지만 실제로 라우트의 컨트롤러 메서드는 실행하지 않습니다.


## 실시간 검증 {#live-validation}


### Vue 사용하기 {#using-vue}

Laravel Precognition을 사용하면 프론트엔드 Vue 애플리케이션에서 검증 규칙을 중복하지 않고도 사용자에게 실시간 검증 경험을 제공할 수 있습니다. 작동 방식을 보여주기 위해, 애플리케이션 내에서 새 사용자를 생성하는 폼을 만들어보겠습니다.

먼저, 라우트에서 Precognition을 활성화하려면 `HandlePrecognitiveRequests` 미들웨어를 라우트 정의에 추가해야 합니다. 또한 라우트의 검증 규칙을 담을 [폼 요청](/laravel/12.x/validation#form-request-validation)을 생성해야 합니다:

```php
use App\Http\Requests\StoreUserRequest;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

Route::post('/users', function (StoreUserRequest $request) {
    // ...
})->middleware([HandlePrecognitiveRequests::class]);
```

다음으로, NPM을 통해 Vue용 Laravel Precognition 프론트엔드 헬퍼를 설치합니다:

```shell
npm install laravel-precognition-vue
```

Laravel Precognition 패키지를 설치한 후, Precognition의 `useForm` 함수를 사용해 폼 객체를 생성할 수 있습니다. HTTP 메서드(`post`), 대상 URL(`/users`), 초기 폼 데이터를 전달합니다.

이제 실시간 검증을 활성화하려면 각 입력의 `change` 이벤트에서 폼의 `validate` 메서드를 호출하고 입력의 이름을 전달하세요:

```vue
<script setup>
import { useForm } from 'laravel-precognition-vue';

const form = useForm('post', '/users', {
    name: '',
    email: '',
});

const submit = () => form.submit();
</script>

<template>
    <form @submit.prevent="submit">
        <label for="name">Name</label>
        <input
            id="name"
            v-model="form.name"
            @change="form.validate('name')"
        />
        <div v-if="form.invalid('name')">
            {{ form.errors.name }}
        </div>

        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            v-model="form.email"
            @change="form.validate('email')"
        />
        <div v-if="form.invalid('email')">
            {{ form.errors.email }}
        </div>

        <button :disabled="form.processing">
            Create User
        </button>
    </form>
</template>
```

이제 사용자가 폼을 입력할 때, Precognition은 라우트의 폼 요청에 정의된 검증 규칙을 기반으로 실시간 검증 결과를 제공합니다. 폼 입력값이 변경되면, 디바운스된 "precognitive" 검증 요청이 Laravel 애플리케이션으로 전송됩니다. 폼의 `setValidationTimeout` 함수를 호출하여 디바운스 타임아웃을 설정할 수 있습니다:

```js
form.setValidationTimeout(3000);
```

검증 요청이 진행 중일 때는 폼의 `validating` 속성이 `true`가 됩니다:

```html
<div v-if="form.validating">
    Validating...
</div>
```

검증 요청 또는 폼 제출 중 반환된 모든 검증 오류는 자동으로 폼의 `errors` 객체에 채워집니다:

```html
<div v-if="form.invalid('email')">
    {{ form.errors.email }}
</div>
```

폼에 오류가 있는지 여부는 폼의 `hasErrors` 속성으로 확인할 수 있습니다:

```html
<div v-if="form.hasErrors">
    <!-- ... -->
</div>
```

입력이 검증을 통과했는지 또는 실패했는지 여부는 입력의 이름을 폼의 `valid` 및 `invalid` 함수에 각각 전달하여 확인할 수 있습니다:

```html
<span v-if="form.valid('email')">
    ✅
</span>

<span v-else-if="form.invalid('email')">
    ❌
</span>
```

> [!WARNING]
> 폼 입력은 변경되고 검증 응답을 받은 후에만 유효 또는 무효로 표시됩니다.

Precognition으로 폼의 일부 입력만 검증하는 경우, 오류를 수동으로 지우는 것이 유용할 수 있습니다. 폼의 `forgetError` 함수를 사용하면 됩니다:

```html
<input
    id="avatar"
    type="file"
    @change="(e) => {
        form.avatar = e.target.files[0]

        form.forgetError('avatar')
    }"
/>
```

앞서 본 것처럼, 입력의 `change` 이벤트에 연결하여 사용자가 상호작용할 때 개별 입력을 검증할 수 있습니다. 하지만 사용자가 아직 상호작용하지 않은 입력도 검증해야 할 수 있습니다. 이는 "마법사" 형태의 폼을 만들 때 흔히 발생하는데, 다음 단계로 이동하기 전에 사용자가 상호작용했는지 여부와 상관없이 모든 표시된 입력을 검증하고 싶을 때입니다.

Precognition에서 이를 위해서는 `validate` 메서드를 호출할 때 검증할 필드 이름을 `only` 설정 키에 전달하면 됩니다. 검증 결과는 `onSuccess` 또는 `onValidationError` 콜백으로 처리할 수 있습니다:

```html
<button
    type="button"
    @click="form.validate({
        only: ['name', 'email', 'phone'],
        onSuccess: (response) => nextStep(),
        onValidationError: (response) => /* ... */,
    })"
>Next Step</button>
```

물론, 폼 제출 응답에 따라 코드를 실행할 수도 있습니다. 폼의 `submit` 함수는 Axios 요청 프로미스를 반환합니다. 이를 통해 응답 페이로드에 접근하거나, 성공적으로 제출된 후 폼 입력을 리셋하거나, 실패한 요청을 처리할 수 있습니다:

```js
const submit = () => form.submit()
    .then(response => {
        form.reset();

        alert('User created.');
    })
    .catch(error => {
        alert('An error occurred.');
    });
```

폼 제출 요청이 진행 중인지 여부는 폼의 `processing` 속성을 확인하여 알 수 있습니다:

```html
<button :disabled="form.processing">
    Submit
</button>
```


### Vue와 Inertia 사용하기 {#using-vue-and-inertia}

> [!NOTE]
> Vue와 Inertia로 Laravel 애플리케이션을 개발할 때 빠르게 시작하고 싶다면 [스타터 키트](/laravel/12.x/starter-kits) 중 하나를 사용하는 것을 고려해보세요. Laravel의 스타터 키트는 새로운 Laravel 애플리케이션을 위한 백엔드 및 프론트엔드 인증 스캐폴딩을 제공합니다.

Vue와 Inertia에서 Precognition을 사용하기 전에 [Vue에서 Precognition 사용하기](#using-vue) 문서를 먼저 참고하세요. Vue와 Inertia를 함께 사용할 때는 NPM을 통해 Inertia 호환 Precognition 라이브러리를 설치해야 합니다:

```shell
npm install laravel-precognition-vue-inertia
```

설치가 완료되면, Precognition의 `useForm` 함수는 위에서 설명한 검증 기능이 추가된 Inertia [form helper](https://inertiajs.com/forms#form-helper)를 반환합니다.

form helper의 `submit` 메서드는 간소화되어 HTTP 메서드나 URL을 지정할 필요가 없습니다. 대신 Inertia의 [visit options](https://inertiajs.com/manual-visits)을 첫 번째이자 유일한 인자로 전달할 수 있습니다. 또한, `submit` 메서드는 위의 Vue 예제처럼 Promise를 반환하지 않습니다. 대신, `submit` 메서드에 전달하는 visit options에서 Inertia가 지원하는 [이벤트 콜백](https://inertiajs.com/manual-visits#event-callbacks)을 사용할 수 있습니다:

```vue
<script setup>
import { useForm } from 'laravel-precognition-vue-inertia';

const form = useForm('post', '/users', {
    name: '',
    email: '',
});

const submit = () => form.submit({
    preserveScroll: true,
    onSuccess: () => form.reset(),
});
</script>
```


### React 사용하기 {#using-react}

Laravel Precognition을 사용하면 프론트엔드 React 애플리케이션에서 검증 규칙을 중복하지 않고도 사용자에게 실시간 검증 경험을 제공할 수 있습니다. 작동 방식을 보여주기 위해, 애플리케이션 내에서 새 사용자를 생성하는 폼을 만들어보겠습니다.

먼저, 라우트에서 Precognition을 활성화하려면 `HandlePrecognitiveRequests` 미들웨어를 라우트 정의에 추가해야 합니다. 또한 라우트의 검증 규칙을 담을 [폼 요청](/laravel/12.x/validation#form-request-validation)을 생성해야 합니다:

```php
use App\Http\Requests\StoreUserRequest;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

Route::post('/users', function (StoreUserRequest $request) {
    // ...
})->middleware([HandlePrecognitiveRequests::class]);
```

다음으로, NPM을 통해 React용 Laravel Precognition 프론트엔드 헬퍼를 설치합니다:

```shell
npm install laravel-precognition-react
```

Laravel Precognition 패키지를 설치한 후, Precognition의 `useForm` 함수를 사용해 폼 객체를 생성할 수 있습니다. HTTP 메서드(`post`), 대상 URL(`/users`), 초기 폼 데이터를 전달합니다.

실시간 검증을 활성화하려면 각 입력의 `change`와 `blur` 이벤트를 감지해야 합니다. `change` 이벤트 핸들러에서는 `setData` 함수를 사용해 입력의 이름과 새 값을 전달하여 폼 데이터를 설정합니다. 그런 다음, `blur` 이벤트 핸들러에서 폼의 `validate` 메서드를 호출하고 입력의 이름을 전달합니다:

```jsx
import { useForm } from 'laravel-precognition-react';

export default function Form() {
    const form = useForm('post', '/users', {
        name: '',
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        form.submit();
    };

    return (
        <form onSubmit={submit}>
            <label htmlFor="name">Name</label>
            <input
                id="name"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                onBlur={() => form.validate('name')}
            />
            {form.invalid('name') && <div>{form.errors.name}</div>}

            <label htmlFor="email">Email</label>
            <input
                id="email"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
                onBlur={() => form.validate('email')}
            />
            {form.invalid('email') && <div>{form.errors.email}</div>}

            <button disabled={form.processing}>
                Create User
            </button>
        </form>
    );
};
```

이제 사용자가 폼을 입력할 때, Precognition은 라우트의 폼 요청에 정의된 검증 규칙을 기반으로 실시간 검증 결과를 제공합니다. 폼 입력값이 변경되면, 디바운스된 "precognitive" 검증 요청이 Laravel 애플리케이션으로 전송됩니다. 폼의 `setValidationTimeout` 함수를 호출하여 디바운스 타임아웃을 설정할 수 있습니다:

```js
form.setValidationTimeout(3000);
```

검증 요청이 진행 중일 때는 폼의 `validating` 속성이 `true`가 됩니다:

```jsx
{form.validating && <div>Validating...</div>}
```

검증 요청 또는 폼 제출 중 반환된 모든 검증 오류는 자동으로 폼의 `errors` 객체에 채워집니다:

```jsx
{form.invalid('email') && <div>{form.errors.email}</div>}
```

폼에 오류가 있는지 여부는 폼의 `hasErrors` 속성으로 확인할 수 있습니다:

```jsx
{form.hasErrors && <div><!-- ... --></div>}
```

입력이 검증을 통과했는지 또는 실패했는지 여부는 입력의 이름을 폼의 `valid` 및 `invalid` 함수에 각각 전달하여 확인할 수 있습니다:

```jsx
{form.valid('email') && <span>✅</span>}

{form.invalid('email') && <span>❌</span>}
```

> [!WARNING]
> 폼 입력은 변경되고 검증 응답을 받은 후에만 유효 또는 무효로 표시됩니다.

Precognition으로 폼의 일부 입력만 검증하는 경우, 오류를 수동으로 지우는 것이 유용할 수 있습니다. 폼의 `forgetError` 함수를 사용하면 됩니다:

```jsx
<input
    id="avatar"
    type="file"
    onChange={(e) => {
        form.setData('avatar', e.target.value);

        form.forgetError('avatar');
    }}
/>
```

앞서 본 것처럼, 입력의 `blur` 이벤트에 연결하여 사용자가 상호작용할 때 개별 입력을 검증할 수 있습니다. 하지만 사용자가 아직 상호작용하지 않은 입력도 검증해야 할 수 있습니다. 이는 "마법사" 형태의 폼을 만들 때 흔히 발생하는데, 다음 단계로 이동하기 전에 사용자가 상호작용했는지 여부와 상관없이 모든 표시된 입력을 검증하고 싶을 때입니다.

Precognition에서 이를 위해서는 `validate` 메서드를 호출할 때 검증할 필드 이름을 `only` 설정 키에 전달하면 됩니다. 검증 결과는 `onSuccess` 또는 `onValidationError` 콜백으로 처리할 수 있습니다:

```jsx
<button
    type="button"
    onClick={() => form.validate({
        only: ['name', 'email', 'phone'],
        onSuccess: (response) => nextStep(),
        onValidationError: (response) => /* ... */,
    })}
>Next Step</button>
```

물론, 폼 제출 응답에 따라 코드를 실행할 수도 있습니다. 폼의 `submit` 함수는 Axios 요청 프로미스를 반환합니다. 이를 통해 응답 페이로드에 접근하거나, 성공적으로 제출된 후 폼 입력을 리셋하거나, 실패한 요청을 처리할 수 있습니다:

```js
const submit = (e) => {
    e.preventDefault();

    form.submit()
        .then(response => {
            form.reset();

            alert('User created.');
        })
        .catch(error => {
            alert('An error occurred.');
        });
};
```

폼 제출 요청이 진행 중인지 여부는 폼의 `processing` 속성을 확인하여 알 수 있습니다:

```html
<button disabled={form.processing}>
    Submit
</button>
```


### React와 Inertia 사용하기 {#using-react-and-inertia}

> [!NOTE]
> React와 Inertia로 Laravel 애플리케이션을 개발할 때 빠르게 시작하고 싶다면 [스타터 키트](/laravel/12.x/starter-kits) 중 하나를 사용하는 것을 고려해보세요. Laravel의 스타터 키트는 새로운 Laravel 애플리케이션을 위한 백엔드 및 프론트엔드 인증 스캐폴딩을 제공합니다.

React와 Inertia에서 Precognition을 사용하기 전에 [React에서 Precognition 사용하기](#using-react) 문서를 먼저 참고하세요. React와 Inertia를 함께 사용할 때는 NPM을 통해 Inertia 호환 Precognition 라이브러리를 설치해야 합니다:

```shell
npm install laravel-precognition-react-inertia
```

설치가 완료되면, Precognition의 `useForm` 함수는 위에서 설명한 검증 기능이 추가된 Inertia [form helper](https://inertiajs.com/forms#form-helper)를 반환합니다.

form helper의 `submit` 메서드는 간소화되어 HTTP 메서드나 URL을 지정할 필요가 없습니다. 대신 Inertia의 [visit options](https://inertiajs.com/manual-visits)을 첫 번째이자 유일한 인자로 전달할 수 있습니다. 또한, `submit` 메서드는 위의 React 예제처럼 Promise를 반환하지 않습니다. 대신, `submit` 메서드에 전달하는 visit options에서 Inertia가 지원하는 [이벤트 콜백](https://inertiajs.com/manual-visits#event-callbacks)을 사용할 수 있습니다:

```js
import { useForm } from 'laravel-precognition-react-inertia';

const form = useForm('post', '/users', {
    name: '',
    email: '',
});

const submit = (e) => {
    e.preventDefault();

    form.submit({
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
```


### Alpine과 Blade 사용하기 {#using-alpine}

Laravel Precognition을 사용하면 프론트엔드 Alpine 애플리케이션에서 검증 규칙을 중복하지 않고도 사용자에게 실시간 검증 경험을 제공할 수 있습니다. 작동 방식을 보여주기 위해, 애플리케이션 내에서 새 사용자를 생성하는 폼을 만들어보겠습니다.

먼저, 라우트에서 Precognition을 활성화하려면 `HandlePrecognitiveRequests` 미들웨어를 라우트 정의에 추가해야 합니다. 또한 라우트의 검증 규칙을 담을 [폼 요청](/laravel/12.x/validation#form-request-validation)을 생성해야 합니다:

```php
use App\Http\Requests\CreateUserRequest;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

Route::post('/users', function (CreateUserRequest $request) {
    // ...
})->middleware([HandlePrecognitiveRequests::class]);
```

다음으로, NPM을 통해 Alpine용 Laravel Precognition 프론트엔드 헬퍼를 설치합니다:

```shell
npm install laravel-precognition-alpine
```

그런 다음, `resources/js/app.js` 파일에서 Alpine에 Precognition 플러그인을 등록합니다:

```js
import Alpine from 'alpinejs';
import Precognition from 'laravel-precognition-alpine';

window.Alpine = Alpine;

Alpine.plugin(Precognition);
Alpine.start();
```

Laravel Precognition 패키지를 설치하고 등록한 후, Precognition의 `$form` "매직"을 사용해 폼 객체를 생성할 수 있습니다. HTTP 메서드(`post`), 대상 URL(`/users`), 초기 폼 데이터를 전달합니다.

실시간 검증을 활성화하려면 폼의 데이터를 해당 입력에 바인딩하고 각 입력의 `change` 이벤트를 감지해야 합니다. `change` 이벤트 핸들러에서 폼의 `validate` 메서드를 호출하고 입력의 이름을 전달합니다:

```html
<form x-data="{
    form: $form('post', '/register', {
        name: '',
        email: '',
    }),
}">
    @csrf
    <label for="name">Name</label>
    <input
        id="name"
        name="name"
        x-model="form.name"
        @change="form.validate('name')"
    />
    <template x-if="form.invalid('name')">
        <div x-text="form.errors.name"></div>
    </template>

    <label for="email">Email</label>
    <input
        id="email"
        name="email"
        x-model="form.email"
        @change="form.validate('email')"
    />
    <template x-if="form.invalid('email')">
        <div x-text="form.errors.email"></div>
    </template>

    <button :disabled="form.processing">
        Create User
    </button>
</form>
```

이제 사용자가 폼을 입력할 때, Precognition은 라우트의 폼 요청에 정의된 검증 규칙을 기반으로 실시간 검증 결과를 제공합니다. 폼 입력값이 변경되면, 디바운스된 "precognitive" 검증 요청이 Laravel 애플리케이션으로 전송됩니다. 폼의 `setValidationTimeout` 함수를 호출하여 디바운스 타임아웃을 설정할 수 있습니다:

```js
form.setValidationTimeout(3000);
```

검증 요청이 진행 중일 때는 폼의 `validating` 속성이 `true`가 됩니다:

```html
<template x-if="form.validating">
    <div>Validating...</div>
</template>
```

검증 요청 또는 폼 제출 중 반환된 모든 검증 오류는 자동으로 폼의 `errors` 객체에 채워집니다:

```html
<template x-if="form.invalid('email')">
    <div x-text="form.errors.email"></div>
</template>
```

폼에 오류가 있는지 여부는 폼의 `hasErrors` 속성으로 확인할 수 있습니다:

```html
<template x-if="form.hasErrors">
    <div><!-- ... --></div>
</template>
```

입력이 검증을 통과했는지 또는 실패했는지 여부는 입력의 이름을 폼의 `valid` 및 `invalid` 함수에 각각 전달하여 확인할 수 있습니다:

```html
<template x-if="form.valid('email')">
    <span>✅</span>
</template>

<template x-if="form.invalid('email')">
    <span>❌</span>
</template>
```

> [!WARNING]
> 폼 입력은 변경되고 검증 응답을 받은 후에만 유효 또는 무효로 표시됩니다.

앞서 본 것처럼, 입력의 `change` 이벤트에 연결하여 사용자가 상호작용할 때 개별 입력을 검증할 수 있습니다. 하지만 사용자가 아직 상호작용하지 않은 입력도 검증해야 할 수 있습니다. 이는 "마법사" 형태의 폼을 만들 때 흔히 발생하는데, 다음 단계로 이동하기 전에 사용자가 상호작용했는지 여부와 상관없이 모든 표시된 입력을 검증하고 싶을 때입니다.

Precognition에서 이를 위해서는 `validate` 메서드를 호출할 때 검증할 필드 이름을 `only` 설정 키에 전달하면 됩니다. 검증 결과는 `onSuccess` 또는 `onValidationError` 콜백으로 처리할 수 있습니다:

```html
<button
    type="button"
    @click="form.validate({
        only: ['name', 'email', 'phone'],
        onSuccess: (response) => nextStep(),
        onValidationError: (response) => /* ... */,
    })"
>Next Step</button>
```

폼 제출 요청이 진행 중인지 여부는 폼의 `processing` 속성을 확인하여 알 수 있습니다:

```html
<button :disabled="form.processing">
    Submit
</button>
```


#### 이전 폼 데이터 다시 채우기 {#repopulating-old-form-data}

위에서 설명한 사용자 생성 예제에서는 Precognition을 사용해 실시간 검증을 수행하고 있지만, 폼 제출은 전통적인 서버 사이드 폼 제출 방식으로 처리하고 있습니다. 따라서 폼은 서버 사이드 폼 제출에서 반환된 "이전" 입력값과 검증 오류로 채워져야 합니다:

```html
<form x-data="{
    form: $form('post', '/register', {
        name: '{{ old('name') }}',
        email: '{{ old('email') }}',
    }).setErrors({{ Js::from($errors->messages()) }}),
}">
```

또는, XHR을 통해 폼을 제출하고 싶다면 폼의 `submit` 함수를 사용할 수 있습니다. 이 함수는 Axios 요청 프로미스를 반환합니다:

```html
<form
    x-data="{
        form: $form('post', '/register', {
            name: '',
            email: '',
        }),
        submit() {
            this.form.submit()
                .then(response => {
                    this.form.reset();

                    alert('User created.')
                })
                .catch(error => {
                    alert('An error occurred.');
                });
        },
    }"
    @submit.prevent="submit"
>
```


### Axios 설정하기 {#configuring-axios}

Precognition 검증 라이브러리는 [Axios](https://github.com/axios/axios) HTTP 클라이언트를 사용해 애플리케이션 백엔드로 요청을 전송합니다. 필요하다면 Axios 인스턴스를 애플리케이션에 맞게 커스터마이즈할 수 있습니다. 예를 들어, `laravel-precognition-vue` 라이브러리를 사용할 때, `resources/js/app.js` 파일에서 각 요청에 추가 헤더를 설정할 수 있습니다:

```js
import { client } from 'laravel-precognition-vue';

client.axios().defaults.headers.common['Authorization'] = authToken;
```

또는, 이미 애플리케이션에 맞게 설정된 Axios 인스턴스가 있다면 Precognition이 해당 인스턴스를 사용하도록 지정할 수 있습니다:

```js
import Axios from 'axios';
import { client } from 'laravel-precognition-vue';

window.axios = Axios.create()
window.axios.defaults.headers.common['Authorization'] = authToken;

client.use(window.axios)
```

> [!WARNING]
> Inertia 버전의 Precognition 라이브러리는 검증 요청에만 설정된 Axios 인스턴스를 사용합니다. 폼 제출은 항상 Inertia가 전송합니다.


## 검증 규칙 커스터마이징 {#customizing-validation-rules}

요청의 `isPrecognitive` 메서드를 사용하여 precognitive 요청 중에 실행되는 검증 규칙을 커스터마이즈할 수 있습니다.

예를 들어, 사용자 생성 폼에서 비밀번호가 "유출되지 않았는지"는 최종 폼 제출 시에만 검증하고 싶을 수 있습니다. precognitive 검증 요청에서는 비밀번호가 필수이고 최소 8자임만 검증합니다. `isPrecognitive` 메서드를 사용해 폼 요청에 정의된 규칙을 커스터마이즈할 수 있습니다:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    protected function rules()
    {
        return [
            'password' => [
                'required',
                $this->isPrecognitive()
                    ? Password::min(8)
                    : Password::min(8)->uncompromised(),
            ],
            // ...
        ];
    }
}
```


## 파일 업로드 처리 {#handling-file-uploads}

기본적으로, Laravel Precognition은 precognitive 검증 요청 중에 파일을 업로드하거나 검증하지 않습니다. 이는 대용량 파일이 불필요하게 여러 번 업로드되는 것을 방지하기 위함입니다.

이러한 동작 때문에, [해당 폼 요청의 검증 규칙을 커스터마이즈](#customizing-validation-rules)하여 전체 폼 제출 시에만 필드가 필수임을 지정해야 합니다:

```php
/**
 * Get the validation rules that apply to the request.
 *
 * @return array
 */
protected function rules()
{
    return [
        'avatar' => [
            ...$this->isPrecognitive() ? [] : ['required'],
            'image',
            'mimes:jpg,png',
            'dimensions:ratio=3/2',
        ],
        // ...
    ];
}
```

모든 검증 요청에 파일을 포함하고 싶다면, 클라이언트 측 폼 인스턴스에서 `validateFiles` 함수를 호출하면 됩니다:

```js
form.validateFiles();
```


## 부수 효과 관리 {#managing-side-effects}

라우트에 `HandlePrecognitiveRequests` 미들웨어를 추가할 때, precognitive 요청 중에 _다른_ 미들웨어에서 발생하는 부수 효과를 건너뛰어야 하는지 고려해야 합니다.

예를 들어, 각 사용자가 애플리케이션과 상호작용한 횟수를 증가시키는 미들웨어가 있을 수 있습니다. 하지만 precognitive 요청은 상호작용으로 간주하고 싶지 않을 수 있습니다. 이를 위해, 상호작용 카운트를 증가시키기 전에 요청의 `isPrecognitive` 메서드를 확인할 수 있습니다:

```php
<?php

namespace App\Http\Middleware;

use App\Facades\Interaction;
use Closure;
use Illuminate\Http\Request;

class InteractionMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->isPrecognitive()) {
            Interaction::incrementFor($request->user());
        }

        return $next($request);
    }
}
```


## 테스트 {#testing}

테스트에서 precognitive 요청을 보내고 싶다면, Laravel의 `TestCase`에는 `Precognition` 요청 헤더를 추가하는 `withPrecognition` 헬퍼가 포함되어 있습니다.

또한, precognitive 요청이 성공적이었는지(예: 검증 오류가 반환되지 않았는지) 확인하고 싶다면, 응답에서 `assertSuccessfulPrecognition` 메서드를 사용할 수 있습니다:
::: code-group
```php [Pest]
it('validates registration form with precognition', function () {
    $response = $this->withPrecognition()
        ->post('/register', [
            'name' => 'Taylor Otwell',
        ]);

    $response->assertSuccessfulPrecognition();

    expect(User::count())->toBe(0);
});
```

```php [PHPUnit]
public function test_it_validates_registration_form_with_precognition()
{
    $response = $this->withPrecognition()
        ->post('/register', [
            'name' => 'Taylor Otwell',
        ]);

    $response->assertSuccessfulPrecognition();
    $this->assertSame(0, User::count());
}
```
:::