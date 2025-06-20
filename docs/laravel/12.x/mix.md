# Laravel Mix




## 소개 {#introduction}

[Laravel Mix](https://github.com/laravel-mix/laravel-mix)는 [Laracasts](https://laracasts.com)의 창립자 Jeffrey Way가 개발한 패키지로, 여러 일반적인 CSS 및 JavaScript 전처리기를 사용하여 Laravel 애플리케이션의 [webpack](https://webpack.js.org) 빌드 단계를 정의할 수 있는 유연한 API를 제공합니다.

즉, Mix를 사용하면 애플리케이션의 CSS와 JavaScript 파일을 손쉽게 컴파일하고 최소화할 수 있습니다. 간단한 메서드 체이닝을 통해 자산 파이프라인을 유연하게 정의할 수 있습니다. 예를 들면 다음과 같습니다:

```js
mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css');
```

webpack과 자산 컴파일을 처음 시작할 때 혼란스럽거나 부담스러웠던 경험이 있다면, Laravel Mix를 분명히 좋아하게 될 것입니다. 하지만 애플리케이션을 개발할 때 반드시 Mix를 사용할 필요는 없으며, 원하는 자산 파이프라인 도구를 자유롭게 사용할 수 있고, 아예 사용하지 않아도 됩니다.

> [!NOTE]
> Vite가 새로운 Laravel 설치에서 Laravel Mix를 대체했습니다. Mix 문서는 [공식 Laravel Mix](https://laravel-mix.com/) 웹사이트를 참고하세요. Vite로 전환하고 싶다면 [Vite 마이그레이션 가이드](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-laravel-mix-to-vite)를 참고하세요.
