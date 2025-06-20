# 브로드캐스팅











































## 소개 {#introduction}

많은 현대 웹 애플리케이션에서는 WebSocket을 사용하여 실시간, 라이브 업데이트 UI를 구현합니다. 서버에서 데이터가 업데이트되면, 일반적으로 WebSocket 연결을 통해 메시지가 전송되어 클라이언트에서 처리됩니다. WebSocket은 UI에 반영되어야 하는 데이터 변경을 위해 애플리케이션 서버를 계속 폴링하는 것보다 더 효율적인 대안을 제공합니다.

예를 들어, 애플리케이션이 사용자의 데이터를 CSV 파일로 내보내고 이메일로 전송할 수 있다고 가정해봅시다. 하지만 이 CSV 파일을 생성하는 데 몇 분이 걸리므로, [큐 작업](/laravel/12.x/queues) 내에서 CSV를 생성하고 메일로 보냅니다. CSV가 생성되어 사용자에게 메일로 전송되면, `App\Events\UserDataExported` 이벤트를 브로드캐스트하여 애플리케이션의 JavaScript에서 수신할 수 있습니다. 이벤트가 수신되면, 사용자가 페이지를 새로고침하지 않아도 CSV가 이메일로 전송되었다는 메시지를 표시할 수 있습니다.

이러한 기능을 쉽게 구축할 수 있도록, Laravel은 서버 사이드 Laravel [이벤트](/laravel/12.x/events)를 WebSocket 연결을 통해 "브로드캐스트"하는 기능을 제공합니다. Laravel 이벤트를 브로드캐스트하면 서버 사이드 Laravel 애플리케이션과 클라이언트 사이드 JavaScript 애플리케이션 간에 동일한 이벤트 이름과 데이터를 공유할 수 있습니다.

브로드캐스팅의 핵심 개념은 간단합니다: 클라이언트는 프론트엔드에서 이름이 지정된 채널에 연결하고, Laravel 애플리케이션은 백엔드에서 이 채널로 이벤트를 브로드캐스트합니다. 이 이벤트에는 프론트엔드에서 사용할 수 있도록 원하는 추가 데이터를 포함할 수 있습니다.


#### 지원 드라이버 {#supported-drivers}

기본적으로 Laravel은 선택할 수 있는 세 가지 서버 사이드 브로드캐스팅 드라이버를 제공합니다: [Laravel Reverb](https://reverb.laravel.com), [Pusher Channels](https://pusher.com/channels), [Ably](https://ably.com).

> [!NOTE]
> 이벤트 브로드캐스팅을 시작하기 전에, [이벤트와 리스너](/laravel/12.x/events)에 대한 Laravel 문서를 먼저 읽어보시기 바랍니다.


## 빠른 시작 {#quickstart}

기본적으로, 새로운 Laravel 애플리케이션에서는 브로드캐스팅이 활성화되어 있지 않습니다. `install:broadcasting` Artisan 명령어를 사용하여 브로드캐스팅을 활성화할 수 있습니다:

```shell
php artisan install:broadcasting
```

`install:broadcasting` 명령어는 사용할 이벤트 브로드캐스팅 서비스를 선택하도록 안내합니다. 또한, `config/broadcasting.php` 설정 파일과 애플리케이션의 브로드캐스트 권한 라우트 및 콜백을 등록할 수 있는 `routes/channels.php` 파일을 생성합니다.

Laravel은 기본적으로 여러 브로드캐스트 드라이버를 지원합니다: [Laravel Reverb](/laravel/12.x/reverb), [Pusher Channels](https://pusher.com/channels), [Ably](https://ably.com), 그리고 로컬 개발 및 디버깅을 위한 `log` 드라이버가 있습니다. 또한, 테스트 중 브로드캐스팅을 비활성화할 수 있는 `null` 드라이버도 포함되어 있습니다. 각 드라이버에 대한 설정 예시는 `config/broadcasting.php` 파일에 포함되어 있습니다.

애플리케이션의 모든 이벤트 브로드캐스팅 설정은 `config/broadcasting.php` 파일에 저장됩니다. 이 파일이 애플리케이션에 없다면 걱정하지 마세요. `install:broadcasting` Artisan 명령어를 실행하면 생성됩니다.


#### 다음 단계 {#quickstart-next-steps}

이벤트 브로드캐스팅을 활성화했다면, [브로드캐스트 이벤트 정의](#defining-broadcast-events)와 [이벤트 리스닝](#listening-for-events)에 대해 더 배워볼 준비가 된 것입니다. Laravel의 React 또는 Vue [스타터 키트](/laravel/12.x/starter-kits)를 사용 중이라면, Echo의 [useEcho hook](#using-react-or-vue)을 사용하여 이벤트를 리스닝할 수 있습니다.

> [!NOTE]
> 이벤트를 브로드캐스트하기 전에, 먼저 [큐 워커](/laravel/12.x/queues)를 설정하고 실행해야 합니다. 모든 이벤트 브로드캐스팅은 큐 작업을 통해 처리되므로, 브로드캐스트로 인해 애플리케이션의 응답 시간이 심각하게 영향을 받지 않습니다.


## 서버 사이드 설치 {#server-side-installation}

Laravel의 이벤트 브로드캐스팅을 사용하려면, Laravel 애플리케이션 내에서 몇 가지 설정을 하고 몇 가지 패키지를 설치해야 합니다.

이벤트 브로드캐스팅은 서버 사이드 브로드캐스팅 드라이버에 의해 수행되며, 이 드라이버가 Laravel 이벤트를 브라우저 클라이언트에서 Laravel Echo(JavaScript 라이브러리)가 수신할 수 있도록 브로드캐스트합니다. 걱정하지 마세요. 설치 과정을 단계별로 안내해 드리겠습니다.


### Reverb {#reverb}

Reverb를 이벤트 브로드캐스터로 사용하면서 Laravel의 브로드캐스팅 기능을 빠르게 활성화하려면, `install:broadcasting` Artisan 명령어에 `--reverb` 옵션을 추가하여 실행하세요. 이 명령어는 Reverb에 필요한 Composer 및 NPM 패키지를 설치하고, 애플리케이션의 `.env` 파일에 적절한 변수를 추가합니다:

```shell
php artisan install:broadcasting --reverb
```


#### 수동 설치 {#reverb-manual-installation}

`install:broadcasting` 명령어를 실행하면 [Laravel Reverb](/laravel/12.x/reverb) 설치를 안내받게 됩니다. 물론, Composer 패키지 매니저를 사용하여 Reverb를 수동으로 설치할 수도 있습니다:

```shell
composer require laravel/reverb
```

패키지 설치 후, Reverb의 설치 명령어를 실행하여 설정을 게시하고, 필요한 환경 변수를 추가하며, 애플리케이션에서 이벤트 브로드캐스팅을 활성화할 수 있습니다:

```shell
php artisan reverb:install
```

자세한 Reverb 설치 및 사용법은 [Reverb 문서](/laravel/12.x/reverb)에서 확인할 수 있습니다.


### Pusher Channels {#pusher-channels}

Pusher를 이벤트 브로드캐스터로 사용하면서 Laravel의 브로드캐스팅 기능을 빠르게 활성화하려면, `install:broadcasting` Artisan 명령어에 `--pusher` 옵션을 추가하여 실행하세요. 이 명령어는 Pusher 자격 증명을 입력받고, Pusher PHP 및 JavaScript SDK를 설치하며, 애플리케이션의 `.env` 파일에 적절한 변수를 추가합니다:

```shell
php artisan install:broadcasting --pusher
```


#### 수동 설치 {#pusher-manual-installation}

Pusher 지원을 수동으로 설치하려면, Composer 패키지 매니저를 사용하여 Pusher Channels PHP SDK를 설치해야 합니다:

```shell
composer require pusher/pusher-php-server
```

다음으로, `config/broadcasting.php` 설정 파일에서 Pusher Channels 자격 증명을 설정해야 합니다. 이 파일에는 이미 Pusher Channels 설정 예시가 포함되어 있어, 키, 시크릿, 애플리케이션 ID를 빠르게 지정할 수 있습니다. 일반적으로, Pusher Channels 자격 증명은 애플리케이션의 `.env` 파일에 설정합니다:

```ini
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_APP_KEY="your-pusher-key"
PUSHER_APP_SECRET="your-pusher-secret"
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME="https"
PUSHER_APP_CLUSTER="mt1"
```

`config/broadcasting.php` 파일의 `pusher` 설정에서는 클러스터 등 Channels에서 지원하는 추가 `options`도 지정할 수 있습니다.

그런 다음, 애플리케이션의 `.env` 파일에서 `BROADCAST_CONNECTION` 환경 변수를 `pusher`로 설정하세요:

```ini
BROADCAST_CONNECTION=pusher
```

마지막으로, [Laravel Echo](#client-side-installation)를 설치 및 설정하여 클라이언트 사이드에서 브로드캐스트 이벤트를 수신할 준비를 하세요.


### Ably {#ably}

> [!NOTE]
> 아래 문서는 Ably를 "Pusher 호환" 모드로 사용하는 방법을 설명합니다. 하지만 Ably 팀은 Ably의 고유 기능을 활용할 수 있는 브로드캐스터와 Echo 클라이언트를 권장하며 직접 관리합니다. Ably가 관리하는 드라이버 사용에 대한 자세한 내용은 [Ably의 Laravel 브로드캐스터 문서](https://github.com/ably/laravel-broadcaster)를 참고하세요.

[Ably](https://ably.com)를 이벤트 브로드캐스터로 사용하면서 Laravel의 브로드캐스팅 기능을 빠르게 활성화하려면, `install:broadcasting` Artisan 명령어에 `--ably` 옵션을 추가하여 실행하세요. 이 명령어는 Ably 자격 증명을 입력받고, Ably PHP 및 JavaScript SDK를 설치하며, 애플리케이션의 `.env` 파일에 적절한 변수를 추가합니다:

```shell
php artisan install:broadcasting --ably
```

**계속하기 전에, Ably 애플리케이션 설정에서 Pusher 프로토콜 지원을 활성화해야 합니다. 이 기능은 Ably 애플리케이션 설정 대시보드의 "Protocol Adapter Settings" 부분에서 활성화할 수 있습니다.**


#### 수동 설치 {#ably-manual-installation}

Ably 지원을 수동으로 설치하려면, Composer 패키지 매니저를 사용하여 Ably PHP SDK를 설치해야 합니다:

```shell
composer require ably/ably-php
```

다음으로, `config/broadcasting.php` 설정 파일에서 Ably 자격 증명을 설정해야 합니다. 이 파일에는 이미 Ably 설정 예시가 포함되어 있어, 키를 빠르게 지정할 수 있습니다. 일반적으로 이 값은 `ABLY_KEY` [환경 변수](/laravel/12.x/configuration#environment-configuration)를 통해 설정해야 합니다:

```ini
ABLY_KEY=your-ably-key
```

그런 다음, 애플리케이션의 `.env` 파일에서 `BROADCAST_CONNECTION` 환경 변수를 `ably`로 설정하세요:

```ini
BROADCAST_CONNECTION=ably
```

마지막으로, [Laravel Echo](#client-side-installation)를 설치 및 설정하여 클라이언트 사이드에서 브로드캐스트 이벤트를 수신할 준비를 하세요.


## 클라이언트 사이드 설치 {#client-side-installation}


### Reverb {#client-reverb}

[Laravel Echo](https://github.com/laravel/echo)는 서버 사이드 브로드캐스팅 드라이버가 브로드캐스트하는 채널을 구독하고 이벤트를 리스닝하는 작업을 쉽게 만들어주는 JavaScript 라이브러리입니다.

`install:broadcasting` Artisan 명령어로 Laravel Reverb를 설치하면, Reverb와 Echo의 스캐폴딩 및 설정이 자동으로 애플리케이션에 주입됩니다. 하지만 Laravel Echo를 수동으로 설정하고 싶다면 아래 지침을 따르세요.


#### 수동 설치 {#reverb-client-manual-installation}

애플리케이션 프론트엔드에서 Laravel Echo를 수동으로 설정하려면, 먼저 Reverb가 WebSocket 구독, 채널, 메시지에 Pusher 프로토콜을 사용하므로 `pusher-js` 패키지를 설치해야 합니다:

```shell
npm install --save-dev laravel-echo pusher-js
```

Echo가 설치되면, 애플리케이션의 JavaScript에서 새로운 Echo 인스턴스를 생성할 준비가 된 것입니다. 좋은 위치는 Laravel 프레임워크에 포함된 `resources/js/bootstrap.js` 파일의 하단입니다:
::: code-group
```js [JavaScript]
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

```js [React]
import { configureEcho } from "@laravel/echo-react";

configureEcho({
    broadcaster: "reverb",
    // key: import.meta.env.VITE_REVERB_APP_KEY,
    // wsHost: import.meta.env.VITE_REVERB_HOST,
    // wsPort: import.meta.env.VITE_REVERB_PORT,
    // wssPort: import.meta.env.VITE_REVERB_PORT,
    // forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    // enabledTransports: ['ws', 'wss'],
});
```

```js [Vue]
import { configureEcho } from "@laravel/echo-vue";

configureEcho({
    broadcaster: "reverb",
    // key: import.meta.env.VITE_REVERB_APP_KEY,
    // wsHost: import.meta.env.VITE_REVERB_HOST,
    // wsPort: import.meta.env.VITE_REVERB_PORT,
    // wssPort: import.meta.env.VITE_REVERB_PORT,
    // forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    // enabledTransports: ['ws', 'wss'],
});
```
:::
다음으로, 애플리케이션의 에셋을 컴파일해야 합니다:

```shell
npm run build
```

> [!WARNING]
> Laravel Echo의 `reverb` 브로드캐스터는 laravel-echo v1.16.0 이상이 필요합니다.


### Pusher Channels {#client-pusher-channels}

[Laravel Echo](https://github.com/laravel/echo)는 서버 사이드 브로드캐스팅 드라이버가 브로드캐스트하는 채널을 구독하고 이벤트를 리스닝하는 작업을 쉽게 만들어주는 JavaScript 라이브러리입니다.

`install:broadcasting --pusher` Artisan 명령어로 브로드캐스팅 지원을 설치하면, Pusher와 Echo의 스캐폴딩 및 설정이 자동으로 애플리케이션에 주입됩니다. 하지만 Laravel Echo를 수동으로 설정하고 싶다면 아래 지침을 따르세요.


#### 수동 설치 {#pusher-client-manual-installation}

애플리케이션 프론트엔드에서 Laravel Echo를 수동으로 설정하려면, WebSocket 구독, 채널, 메시지에 Pusher 프로토콜을 사용하는 `laravel-echo`와 `pusher-js` 패키지를 설치해야 합니다:

```shell
npm install --save-dev laravel-echo pusher-js
```

Echo가 설치되면, 애플리케이션의 `resources/js/bootstrap.js` 파일에서 새로운 Echo 인스턴스를 생성할 준비가 된 것입니다:
::: code-group
```js [JavaScript]
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});
```

```js [React]
import { configureEcho } from "@laravel/echo-react";

configureEcho({
    broadcaster: "pusher",
    // key: import.meta.env.VITE_PUSHER_APP_KEY,
    // cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    // forceTLS: true,
    // wsHost: import.meta.env.VITE_PUSHER_HOST,
    // wsPort: import.meta.env.VITE_PUSHER_PORT,
    // wssPort: import.meta.env.VITE_PUSHER_PORT,
    // enabledTransports: ["ws", "wss"],
});
```

```js [Vue]
import { configureEcho } from "@laravel/echo-vue";

configureEcho({
    broadcaster: "pusher",
    // key: import.meta.env.VITE_PUSHER_APP_KEY,
    // cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    // forceTLS: true,
    // wsHost: import.meta.env.VITE_PUSHER_HOST,
    // wsPort: import.meta.env.VITE_PUSHER_PORT,
    // wssPort: import.meta.env.VITE_PUSHER_PORT,
    // enabledTransports: ["ws", "wss"],
});
```
:::
다음으로, 애플리케이션의 `.env` 파일에 Pusher 환경 변수에 대한 적절한 값을 정의해야 합니다. 이 변수들이 `.env` 파일에 없다면 추가하세요:

```ini
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_APP_KEY="your-pusher-key"
PUSHER_APP_SECRET="your-pusher-secret"
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME="https"
PUSHER_APP_CLUSTER="mt1"

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

Echo 설정을 애플리케이션의 필요에 맞게 조정한 후, 애플리케이션의 에셋을 컴파일할 수 있습니다:

```shell
npm run build
```

> [!NOTE]
> 애플리케이션의 JavaScript 에셋 컴파일에 대해 더 알고 싶다면 [Vite](/laravel/12.x/vite) 문서를 참고하세요.


#### 기존 클라이언트 인스턴스 사용하기 {#using-an-existing-client-instance}

이미 사전 설정된 Pusher Channels 클라이언트 인스턴스가 있고 Echo에서 이를 사용하고 싶다면, `client` 설정 옵션을 통해 Echo에 전달할 수 있습니다:

```js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const options = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY
}

window.Echo = new Echo({
    ...options,
    client: new Pusher(options.key, options)
});
```


### Ably {#client-ably}

> [!NOTE]
> 아래 문서는 Ably를 "Pusher 호환" 모드로 사용하는 방법을 설명합니다. 하지만 Ably 팀은 Ably의 고유 기능을 활용할 수 있는 브로드캐스터와 Echo 클라이언트를 권장하며 직접 관리합니다. Ably가 관리하는 드라이버 사용에 대한 자세한 내용은 [Ably의 Laravel 브로드캐스터 문서](https://github.com/ably/laravel-broadcaster)를 참고하세요.

[Laravel Echo](https://github.com/laravel/echo)는 서버 사이드 브로드캐스팅 드라이버가 브로드캐스트하는 채널을 구독하고 이벤트를 리스닝하는 작업을 쉽게 만들어주는 JavaScript 라이브러리입니다.

`install:broadcasting --ably` Artisan 명령어로 브로드캐스팅 지원을 설치하면, Ably와 Echo의 스캐폴딩 및 설정이 자동으로 애플리케이션에 주입됩니다. 하지만 Laravel Echo를 수동으로 설정하고 싶다면 아래 지침을 따르세요.


#### 수동 설치 {#ably-client-manual-installation}

애플리케이션 프론트엔드에서 Laravel Echo를 수동으로 설정하려면, WebSocket 구독, 채널, 메시지에 Pusher 프로토콜을 사용하는 `laravel-echo`와 `pusher-js` 패키지를 설치해야 합니다:

```shell
npm install --save-dev laravel-echo pusher-js
```

**계속하기 전에, Ably 애플리케이션 설정에서 Pusher 프로토콜 지원을 활성화해야 합니다. 이 기능은 Ably 애플리케이션 설정 대시보드의 "Protocol Adapter Settings" 부분에서 활성화할 수 있습니다.**

Echo가 설치되면, 애플리케이션의 `resources/js/bootstrap.js` 파일에서 새로운 Echo 인스턴스를 생성할 준비가 된 것입니다:
::: code-group
```js [JavaScript]
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_ABLY_PUBLIC_KEY,
    wsHost: 'realtime-pusher.ably.io',
    wsPort: 443,
    disableStats: true,
    encrypted: true,
});
```

```js [React]
import { configureEcho } from "@laravel/echo-react";

configureEcho({
    broadcaster: "ably",
    // key: import.meta.env.VITE_ABLY_PUBLIC_KEY,
    // wsHost: "realtime-pusher.ably.io",
    // wsPort: 443,
    // disableStats: true,
    // encrypted: true,
});
```

```js [Vue]
import { configureEcho } from "@laravel/echo-vue";

configureEcho({
    broadcaster: "ably",
    // key: import.meta.env.VITE_ABLY_PUBLIC_KEY,
    // wsHost: "realtime-pusher.ably.io",
    // wsPort: 443,
    // disableStats: true,
    // encrypted: true,
});
```
:::
Ably Echo 설정에서 `VITE_ABLY_PUBLIC_KEY` 환경 변수를 참조하는 것을 볼 수 있습니다. 이 변수의 값은 Ably 공개 키여야 하며, 공개 키는 Ably 키에서 `:` 문자 앞부분입니다.

Echo 설정을 필요에 맞게 조정한 후, 애플리케이션의 에셋을 컴파일할 수 있습니다:

```shell
npm run dev
```

> [!NOTE]
> 애플리케이션의 JavaScript 에셋 컴파일에 대해 더 알고 싶다면 [Vite](/laravel/12.x/vite) 문서를 참고하세요.


## 개념 개요 {#concept-overview}

Laravel의 이벤트 브로드캐스팅을 사용하면, 드라이버 기반 WebSocket 접근 방식을 통해 서버 사이드 Laravel 이벤트를 클라이언트 사이드 JavaScript 애플리케이션으로 브로드캐스트할 수 있습니다. 현재 Laravel은 [Laravel Reverb](https://reverb.laravel.com), [Pusher Channels](https://pusher.com/channels), [Ably](https://ably.com) 드라이버를 제공합니다. 이벤트는 [Laravel Echo](#client-side-installation) JavaScript 패키지를 사용하여 클라이언트 사이드에서 쉽게 소비할 수 있습니다.

이벤트는 "채널"을 통해 브로드캐스트되며, 공개 또는 비공개로 지정할 수 있습니다. 애플리케이션의 모든 방문자는 인증이나 권한 없이 공개 채널을 구독할 수 있지만, 비공개 채널을 구독하려면 사용자가 인증되고 해당 채널을 리스닝할 권한이 있어야 합니다.


### 예제 애플리케이션 사용하기 {#using-example-application}

이벤트 브로드캐스팅의 각 구성요소를 자세히 살펴보기 전에, 전자상거래 스토어를 예시로 하여 전체적인 흐름을 살펴보겠습니다.

애플리케이션에 사용자가 자신의 주문 배송 상태를 볼 수 있는 페이지가 있다고 가정해봅시다. 또한, 애플리케이션에서 배송 상태가 업데이트될 때마다 `OrderShipmentStatusUpdated` 이벤트가 발생한다고 가정합니다:

```php
use App\Events\OrderShipmentStatusUpdated;

OrderShipmentStatusUpdated::dispatch($order);
```


#### `ShouldBroadcast` 인터페이스 {#the-shouldbroadcast-interface}

사용자가 자신의 주문을 보고 있을 때, 상태 업데이트를 보기 위해 페이지를 새로고침하게 하고 싶지 않습니다. 대신, 업데이트가 생성될 때마다 애플리케이션에 브로드캐스트하고 싶습니다. 따라서 `OrderShipmentStatusUpdated` 이벤트에 `ShouldBroadcast` 인터페이스를 지정해야 합니다. 이렇게 하면 이벤트가 발생할 때 Laravel이 이벤트를 브로드캐스트하도록 지시합니다:

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderShipmentStatusUpdated implements ShouldBroadcast
{
    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    public $order;
}
```

`ShouldBroadcast` 인터페이스는 이벤트에 `broadcastOn` 메서드를 정의하도록 요구합니다. 이 메서드는 이벤트가 브로드캐스트될 채널을 반환하는 역할을 합니다. 이 메서드의 빈 스텁이 이미 생성된 이벤트 클래스에 정의되어 있으므로, 세부 내용을 채우기만 하면 됩니다. 주문의 생성자만 상태 업데이트를 볼 수 있도록, 주문에 연결된 비공개 채널에 이벤트를 브로드캐스트하겠습니다:

```php
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;

/**
 * Get the channel the event should broadcast on.
 */
public function broadcastOn(): Channel
{
    return new PrivateChannel('orders.'.$this->order->id);
}
```

이벤트를 여러 채널에 브로드캐스트하고 싶다면, 대신 `array`를 반환할 수 있습니다:

```php
use Illuminate\Broadcasting\PrivateChannel;

/**
 * Get the channels the event should broadcast on.
 *
 * @return array<int, \Illuminate\Broadcasting\Channel>
 */
public function broadcastOn(): array
{
    return [
        new PrivateChannel('orders.'.$this->order->id),
        // ...
    ];
}
```


#### 채널 권한 부여 {#example-application-authorizing-channels}

비공개 채널을 리스닝하려면 사용자가 권한을 가져야 한다는 점을 기억하세요. 애플리케이션의 `routes/channels.php` 파일에서 채널 권한 규칙을 정의할 수 있습니다. 이 예제에서는 비공개 `orders.1` 채널을 리스닝하려는 사용자가 실제로 해당 주문의 생성자인지 확인해야 합니다:

```php
use App\Models\Order;
use App\Models\User;

Broadcast::channel('orders.{orderId}', function (User $user, int $orderId) {
    return $user->id === Order::findOrNew($orderId)->user_id;
});
```

`channel` 메서드는 두 개의 인자를 받습니다: 채널 이름과 사용자가 채널을 리스닝할 권한이 있는지 `true` 또는 `false`를 반환하는 콜백입니다.

모든 권한 콜백은 현재 인증된 사용자를 첫 번째 인자로, 추가 와일드카드 파라미터를 그 다음 인자로 받습니다. 이 예제에서는 `{orderId}` 플레이스홀더를 사용하여 채널 이름의 "ID" 부분이 와일드카드임을 나타냅니다.


#### 이벤트 브로드캐스트 리스닝 {#listening-for-event-broadcasts}

이제 남은 것은 JavaScript 애플리케이션에서 이벤트를 리스닝하는 것입니다. [Laravel Echo](#client-side-installation)를 사용하여 이를 수행할 수 있습니다. Laravel Echo의 내장 React 및 Vue hook을 사용하면 쉽게 시작할 수 있으며, 기본적으로 이벤트의 모든 public 속성이 브로드캐스트 이벤트에 포함됩니다:
::: code-group
```js [React]
import { useEcho } from "@laravel/echo-react";

useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);
```

```vue [Vue]
<script setup lang="ts">
import { useEcho } from "@laravel/echo-vue";

useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);
</script>
```
:::

## 브로드캐스트 이벤트 정의 {#defining-broadcast-events}

특정 이벤트를 브로드캐스트해야 함을 Laravel에 알리려면, 이벤트 클래스에 `Illuminate\Contracts\Broadcasting\ShouldBroadcast` 인터페이스를 구현해야 합니다. 이 인터페이스는 프레임워크에서 생성된 모든 이벤트 클래스에 이미 import되어 있으므로, 쉽게 추가할 수 있습니다.

`ShouldBroadcast` 인터페이스는 단일 메서드 `broadcastOn`을 구현하도록 요구합니다. `broadcastOn` 메서드는 이벤트가 브로드캐스트될 채널 또는 채널 배열을 반환해야 합니다. 채널은 `Channel`, `PrivateChannel`, `PresenceChannel` 인스턴스여야 합니다. `Channel` 인스턴스는 모든 사용자가 구독할 수 있는 공개 채널을 나타내고, `PrivateChannel`과 `PresenceChannel`은 [채널 권한 부여](#authorizing-channels)가 필요한 비공개 채널을 나타냅니다:

```php
<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class ServerCreated implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public User $user,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->user->id),
        ];
    }
}
```

`ShouldBroadcast` 인터페이스를 구현한 후에는 [이벤트를 발생](/laravel/12.x/events)시키기만 하면 됩니다. 이벤트가 발생하면, [큐 작업](/laravel/12.x/queues)을 통해 지정한 브로드캐스트 드라이버로 이벤트가 자동으로 브로드캐스트됩니다.


### 브로드캐스트 이름 {#broadcast-name}

기본적으로 Laravel은 이벤트의 클래스 이름을 사용하여 이벤트를 브로드캐스트합니다. 하지만, 이벤트에 `broadcastAs` 메서드를 정의하여 브로드캐스트 이름을 커스터마이징할 수 있습니다:

```php
/**
 * The event's broadcast name.
 */
public function broadcastAs(): string
{
    return 'server.created';
}
```

`broadcastAs` 메서드를 사용하여 브로드캐스트 이름을 커스터마이징했다면, 리스너를 등록할 때 앞에 `.` 문자를 붙여야 합니다. 이렇게 하면 Echo가 애플리케이션의 네임스페이스를 이벤트 앞에 붙이지 않도록 지시합니다:

```javascript
.listen('.server.created', function (e) {
    // ...
});
```


### 브로드캐스트 데이터 {#broadcast-data}

이벤트가 브로드캐스트될 때, 모든 `public` 속성이 자동으로 직렬화되어 이벤트의 페이로드로 브로드캐스트됩니다. 이를 통해 JavaScript 애플리케이션에서 모든 public 데이터를 접근할 수 있습니다. 예를 들어, 이벤트에 Eloquent 모델을 담은 public `$user` 속성 하나만 있다면, 이벤트의 브로드캐스트 페이로드는 다음과 같습니다:

```json
{
    "user": {
        "id": 1,
        "name": "Patrick Stewart"
        ...
    }
}
```

하지만, 브로드캐스트 페이로드를 더 세밀하게 제어하고 싶다면, 이벤트에 `broadcastWith` 메서드를 추가할 수 있습니다. 이 메서드는 이벤트 페이로드로 브로드캐스트할 데이터 배열을 반환해야 합니다:

```php
/**
 * Get the data to broadcast.
 *
 * @return array<string, mixed>
 */
public function broadcastWith(): array
{
    return ['id' => $this->user->id];
}
```


### 브로드캐스트 큐 {#broadcast-queue}

기본적으로, 각 브로드캐스트 이벤트는 `queue.php` 설정 파일에 지정된 기본 큐 커넥션의 기본 큐에 배치됩니다. 이벤트 클래스에 `connection`과 `queue` 속성을 정의하여 브로드캐스터가 사용할 큐 커넥션과 이름을 커스터마이징할 수 있습니다:

```php
/**
 * The name of the queue connection to use when broadcasting the event.
 *
 * @var string
 */
public $connection = 'redis';

/**
 * The name of the queue on which to place the broadcasting job.
 *
 * @var string
 */
public $queue = 'default';
```

또는, 이벤트에 `broadcastQueue` 메서드를 정의하여 큐 이름을 커스터마이징할 수 있습니다:

```php
/**
 * The name of the queue on which to place the broadcasting job.
 */
public function broadcastQueue(): string
{
    return 'default';
}
```

기본 큐 드라이버 대신 `sync` 큐를 사용하여 이벤트를 브로드캐스트하고 싶다면, `ShouldBroadcast` 대신 `ShouldBroadcastNow` 인터페이스를 구현하면 됩니다:

```php
<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class OrderShipmentStatusUpdated implements ShouldBroadcastNow
{
    // ...
}
```


### 브로드캐스트 조건 {#broadcast-conditions}

특정 조건이 true일 때만 이벤트를 브로드캐스트하고 싶을 때가 있습니다. 이벤트 클래스에 `broadcastWhen` 메서드를 추가하여 이러한 조건을 정의할 수 있습니다:

```php
/**
 * Determine if this event should broadcast.
 */
public function broadcastWhen(): bool
{
    return $this->order->value > 100;
}
```


#### 브로드캐스팅과 데이터베이스 트랜잭션 {#broadcasting-and-database-transactions}

브로드캐스트 이벤트가 데이터베이스 트랜잭션 내에서 디스패치될 때, 큐가 데이터베이스 트랜잭션이 커밋되기 전에 작업을 처리할 수 있습니다. 이 경우, 트랜잭션 중에 모델이나 데이터베이스 레코드에 가한 업데이트가 아직 데이터베이스에 반영되지 않았을 수 있습니다. 또한, 트랜잭션 내에서 생성된 모델이나 레코드가 데이터베이스에 존재하지 않을 수도 있습니다. 이벤트가 이러한 모델에 의존한다면, 브로드캐스트 작업이 처리될 때 예기치 않은 오류가 발생할 수 있습니다.

큐 커넥션의 `after_commit` 설정 옵션이 `false`로 되어 있더라도, 이벤트 클래스에 `ShouldDispatchAfterCommit` 인터페이스를 구현하여 모든 열린 데이터베이스 트랜잭션이 커밋된 후에 브로드캐스트 이벤트가 디스패치되도록 지정할 수 있습니다:

```php
<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Queue\SerializesModels;

class ServerCreated implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    use SerializesModels;
}
```

> [!NOTE]
> 이러한 문제를 우회하는 방법에 대해 더 알고 싶다면, [큐 작업과 데이터베이스 트랜잭션](/laravel/12.x/queues#jobs-and-database-transactions) 문서를 참고하세요.


## 채널 권한 부여 {#authorizing-channels}

비공개 채널은 현재 인증된 사용자가 실제로 해당 채널을 리스닝할 수 있는지 권한을 부여해야 합니다. 이는 채널 이름과 함께 Laravel 애플리케이션에 HTTP 요청을 보내고, 애플리케이션이 사용자가 해당 채널을 리스닝할 수 있는지 판단하도록 함으로써 이루어집니다. [Laravel Echo](#client-side-installation)를 사용할 때, 비공개 채널 구독 권한을 위한 HTTP 요청은 자동으로 이루어집니다.

브로드캐스팅이 활성화되면, Laravel은 권한 요청을 처리하기 위해 `/broadcasting/auth` 라우트를 자동으로 등록합니다. `/broadcasting/auth` 라우트는 자동으로 `web` 미들웨어 그룹에 배치됩니다.


### 권한 콜백 정의 {#defining-authorization-callbacks}

다음으로, 현재 인증된 사용자가 특정 채널을 리스닝할 수 있는지 실제로 판단하는 로직을 정의해야 합니다. 이 작업은 `install:broadcasting` Artisan 명령어로 생성된 `routes/channels.php` 파일에서 수행합니다. 이 파일에서 `Broadcast::channel` 메서드를 사용하여 채널 권한 콜백을 등록할 수 있습니다:

```php
use App\Models\User;

Broadcast::channel('orders.{orderId}', function (User $user, int $orderId) {
    return $user->id === Order::findOrNew($orderId)->user_id;
});
```

`channel` 메서드는 두 개의 인자를 받습니다: 채널 이름과 사용자가 채널을 리스닝할 권한이 있는지 `true` 또는 `false`를 반환하는 콜백입니다.

모든 권한 콜백은 현재 인증된 사용자를 첫 번째 인자로, 추가 와일드카드 파라미터를 그 다음 인자로 받습니다. 이 예제에서는 `{orderId}` 플레이스홀더를 사용하여 채널 이름의 "ID" 부분이 와일드카드임을 나타냅니다.

애플리케이션의 브로드캐스트 권한 콜백 목록은 `channel:list` Artisan 명령어로 확인할 수 있습니다:

```shell
php artisan channel:list
```


#### 권한 콜백 모델 바인딩 {#authorization-callback-model-binding}

HTTP 라우트와 마찬가지로, 채널 라우트도 암시적 및 명시적 [라우트 모델 바인딩](/laravel/12.x/routing#route-model-binding)을 활용할 수 있습니다. 예를 들어, 문자열이나 숫자형 주문 ID 대신 실제 `Order` 모델 인스턴스를 요청할 수 있습니다:

```php
use App\Models\Order;
use App\Models\User;

Broadcast::channel('orders.{order}', function (User $user, Order $order) {
    return $user->id === $order->user_id;
});
```

> [!WARNING]
> HTTP 라우트 모델 바인딩과 달리, 채널 모델 바인딩은 자동 [암시적 모델 바인딩 스코핑](/laravel/12.x/routing#implicit-model-binding-scoping)을 지원하지 않습니다. 하지만 대부분의 채널은 단일 모델의 고유 기본 키로 스코프할 수 있으므로, 이는 거의 문제가 되지 않습니다.


#### 권한 콜백 인증 {#authorization-callback-authentication}

비공개 및 프레즌스 브로드캐스트 채널은 애플리케이션의 기본 인증 가드를 통해 현재 사용자를 인증합니다. 사용자가 인증되지 않은 경우, 채널 권한은 자동으로 거부되며 권한 콜백이 실행되지 않습니다. 하지만 필요하다면 여러 개의 커스텀 가드를 지정하여 요청을 인증할 수 있습니다:

```php
Broadcast::channel('channel', function () {
    // ...
}, ['guards' => ['web', 'admin']]);
```


### 채널 클래스 정의 {#defining-channel-classes}

애플리케이션에서 다양한 채널을 소비한다면, `routes/channels.php` 파일이 복잡해질 수 있습니다. 따라서, 클로저 대신 채널 클래스를 사용할 수 있습니다. 채널 클래스를 생성하려면 `make:channel` Artisan 명령어를 사용하세요. 이 명령어는 `App/Broadcasting` 디렉터리에 새로운 채널 클래스를 생성합니다.

```shell
php artisan make:channel OrderChannel
```

다음으로, `routes/channels.php` 파일에서 채널을 등록하세요:

```php
use App\Broadcasting\OrderChannel;

Broadcast::channel('orders.{order}', OrderChannel::class);
```

마지막으로, 채널 클래스의 `join` 메서드에 채널 권한 로직을 작성할 수 있습니다. 이 `join` 메서드는 일반적으로 채널 권한 클로저에 작성했던 동일한 로직을 포함합니다. 또한, 채널 모델 바인딩도 활용할 수 있습니다:

```php
<?php

namespace App\Broadcasting;

use App\Models\Order;
use App\Models\User;

class OrderChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct() {}

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, Order $order): array|bool
    {
        return $user->id === $order->user_id;
    }
}
```

> [!NOTE]
> Laravel의 다른 클래스와 마찬가지로, 채널 클래스도 [서비스 컨테이너](/laravel/12.x/container)에 의해 자동으로 해석됩니다. 따라서, 생성자에서 필요한 의존성을 타입힌트로 지정할 수 있습니다.


## 이벤트 브로드캐스팅 {#broadcasting-events}

이벤트를 정의하고 `ShouldBroadcast` 인터페이스를 지정했다면, 이벤트의 디스패치 메서드를 사용하여 이벤트를 발생시키기만 하면 됩니다. 이벤트 디스패처는 이벤트에 `ShouldBroadcast` 인터페이스가 지정된 것을 감지하고, 이벤트를 브로드캐스트하기 위해 큐에 등록합니다:

```php
use App\Events\OrderShipmentStatusUpdated;

OrderShipmentStatusUpdated::dispatch($order);
```


### 다른 사용자에게만 브로드캐스트 {#only-to-others}

이벤트 브로드캐스팅을 사용하는 애플리케이션을 구축할 때, 때때로 현재 사용자를 제외한 모든 구독자에게 이벤트를 브로드캐스트해야 할 때가 있습니다. `broadcast` 헬퍼와 `toOthers` 메서드를 사용하여 이를 구현할 수 있습니다:

```php
use App\Events\OrderShipmentStatusUpdated;

broadcast(new OrderShipmentStatusUpdated($update))->toOthers();
```

`toOthers` 메서드를 언제 사용해야 하는지 더 잘 이해하려면, 사용자가 작업 이름을 입력하여 새 작업을 생성할 수 있는 작업 목록 애플리케이션을 상상해봅시다. 작업을 생성하려면, 애플리케이션이 `/task` URL로 요청을 보내고, 작업 생성 이벤트를 브로드캐스트하며, 새 작업의 JSON 표현을 반환할 수 있습니다. JavaScript 애플리케이션이 엔드포인트의 응답을 받으면, 다음과 같이 작업 목록에 새 작업을 직접 추가할 수 있습니다:

```js
axios.post('/task', task)
    .then((response) => {
        this.tasks.push(response.data);
    });
```

하지만, 작업 생성도 브로드캐스트된다는 점을 기억하세요. JavaScript 애플리케이션이 이 이벤트를 리스닝하여 작업을 목록에 추가한다면, 엔드포인트와 브로드캐스트 양쪽에서 작업이 추가되어 중복될 수 있습니다. `toOthers` 메서드를 사용하여 현재 사용자에게는 이벤트를 브로드캐스트하지 않도록 하면 이 문제를 해결할 수 있습니다.

> [!WARNING]
> `toOthers` 메서드를 호출하려면, 이벤트에 `Illuminate\Broadcasting\InteractsWithSockets` 트레이트가 포함되어 있어야 합니다.


#### 설정 {#only-to-others-configuration}

Laravel Echo 인스턴스를 초기화하면, 소켓 ID가 연결에 할당됩니다. JavaScript 애플리케이션에서 글로벌 [Axios](https://github.com/axios/axios) 인스턴스를 사용하여 HTTP 요청을 보낸다면, 소켓 ID가 모든 요청의 `X-Socket-ID` 헤더에 자동으로 첨부됩니다. 그런 다음, `toOthers` 메서드를 호출하면 Laravel이 헤더에서 소켓 ID를 추출하여 해당 소켓 ID를 가진 연결에는 브로드캐스트하지 않도록 브로드캐스터에 지시합니다.

글로벌 Axios 인스턴스를 사용하지 않는 경우, JavaScript 애플리케이션에서 모든 요청에 `X-Socket-ID` 헤더를 수동으로 추가해야 합니다. `Echo.socketId` 메서드를 사용하여 소켓 ID를 가져올 수 있습니다:

```js
var socketId = Echo.socketId();
```


### 커넥션 커스터마이징 {#customizing-the-connection}

애플리케이션이 여러 브로드캐스트 커넥션과 상호작용하고, 기본 커넥션이 아닌 다른 브로드캐스터로 이벤트를 브로드캐스트하고 싶다면, `via` 메서드를 사용하여 이벤트를 보낼 커넥션을 지정할 수 있습니다:

```php
use App\Events\OrderShipmentStatusUpdated;

broadcast(new OrderShipmentStatusUpdated($update))->via('pusher');
```

또는, 이벤트 생성자 내에서 `broadcastVia` 메서드를 호출하여 이벤트의 브로드캐스트 커넥션을 지정할 수 있습니다. 이때, 이벤트 클래스에 `InteractsWithBroadcasting` 트레이트가 포함되어 있는지 확인하세요:

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderShipmentStatusUpdated implements ShouldBroadcast
{
    use InteractsWithBroadcasting;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        $this->broadcastVia('pusher');
    }
}
```


### 익명 이벤트 {#anonymous-events}

때로는 별도의 이벤트 클래스를 만들지 않고, 간단한 이벤트를 애플리케이션 프론트엔드로 브로드캐스트하고 싶을 수 있습니다. 이를 위해 `Broadcast` 파사드를 사용하여 "익명 이벤트"를 브로드캐스트할 수 있습니다:

```php
Broadcast::on('orders.'.$order->id)->send();
```

위 예제는 다음과 같은 이벤트를 브로드캐스트합니다:

```json
{
    "event": "AnonymousEvent",
    "data": "[]",
    "channel": "orders.1"
}
```

`as`와 `with` 메서드를 사용하여 이벤트 이름과 데이터를 커스터마이징할 수 있습니다:

```php
Broadcast::on('orders.'.$order->id)
    ->as('OrderPlaced')
    ->with($order)
    ->send();
```

위 예제는 다음과 같은 이벤트를 브로드캐스트합니다:

```json
{
    "event": "OrderPlaced",
    "data": "{ id: 1, total: 100 }",
    "channel": "orders.1"
}
```

익명 이벤트를 비공개 또는 프레즌스 채널에 브로드캐스트하려면, `private` 및 `presence` 메서드를 사용할 수 있습니다:

```php
Broadcast::private('orders.'.$order->id)->send();
Broadcast::presence('channels.'.$channel->id)->send();
```

`send` 메서드를 사용하여 익명 이벤트를 브로드캐스트하면, 이벤트가 [큐](/laravel/12.x/queues)에 디스패치되어 처리됩니다. 즉시 이벤트를 브로드캐스트하고 싶다면, `sendNow` 메서드를 사용할 수 있습니다:

```php
Broadcast::on('orders.'.$order->id)->sendNow();
```

현재 인증된 사용자를 제외한 모든 채널 구독자에게 이벤트를 브로드캐스트하려면, `toOthers` 메서드를 호출할 수 있습니다:

```php
Broadcast::on('orders.'.$order->id)
    ->toOthers()
    ->send();
```


### 브로드캐스트 예외 처리 {#rescuing-broadcasts}

애플리케이션의 큐 서버가 사용 불가이거나, Laravel이 이벤트를 브로드캐스트하는 중 오류가 발생하면, 예외가 발생하여 최종 사용자가 애플리케이션 오류를 보게 될 수 있습니다. 이벤트 브로드캐스팅은 종종 애플리케이션의 핵심 기능에 보조적인 역할을 하므로, 이러한 예외가 사용자 경험을 방해하지 않도록 이벤트에 `ShouldRescue` 인터페이스를 구현할 수 있습니다.

`ShouldRescue` 인터페이스를 구현한 이벤트는 브로드캐스트 시 Laravel의 [rescue 헬퍼 함수](/laravel/12.x/helpers#method-rescue)를 자동으로 사용합니다. 이 헬퍼는 예외를 잡아 애플리케이션의 예외 핸들러에 로깅하고, 사용자의 워크플로우를 방해하지 않고 애플리케이션이 정상적으로 계속 실행되도록 합니다:

```php
<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldRescue;

class ServerCreated implements ShouldBroadcast, ShouldRescue
{
    // ...
}
```


## 브로드캐스트 수신 {#receiving-broadcasts}


### 이벤트 리스닝 {#listening-for-events}

[Laravel Echo를 설치 및 인스턴스화](#client-side-installation)했다면, 이제 Laravel 애플리케이션에서 브로드캐스트되는 이벤트를 리스닝할 준비가 된 것입니다. 먼저, `channel` 메서드를 사용하여 채널 인스턴스를 가져오고, `listen` 메서드를 호출하여 특정 이벤트를 리스닝하세요:

```js
Echo.channel(`orders.${this.order.id}`)
    .listen('OrderShipmentStatusUpdated', (e) => {
        console.log(e.order.name);
    });
```

비공개 채널에서 이벤트를 리스닝하려면, 대신 `private` 메서드를 사용하세요. 한 채널에서 여러 이벤트를 리스닝하려면, `listen` 메서드 호출을 계속 체이닝할 수 있습니다:

```js
Echo.private(`orders.${this.order.id}`)
    .listen(/* ... */)
    .listen(/* ... */)
    .listen(/* ... */);
```


#### 이벤트 리스닝 중지 {#stop-listening-for-events}

채널을 [나가지 않고](#leaving-a-channel) 특정 이벤트 리스닝만 중지하고 싶다면, `stopListening` 메서드를 사용할 수 있습니다:

```js
Echo.private(`orders.${this.order.id}`)
    .stopListening('OrderShipmentStatusUpdated');
```


### 채널 나가기 {#leaving-a-channel}

채널을 나가려면, Echo 인스턴스에서 `leaveChannel` 메서드를 호출하세요:

```js
Echo.leaveChannel(`orders.${this.order.id}`);
```

채널과 그에 연결된 비공개 및 프레즌스 채널까지 모두 나가고 싶다면, `leave` 메서드를 호출하세요:

```js
Echo.leave(`orders.${this.order.id}`);
```

### 네임스페이스 {#namespaces}

위 예제에서 이벤트 클래스의 전체 `App\Events` 네임스페이스를 지정하지 않은 것을 눈치챘을 수 있습니다. 이는 Echo가 이벤트가 `App\Events` 네임스페이스에 있다고 자동으로 가정하기 때문입니다. 하지만 Echo 인스턴스 생성 시 `namespace` 설정 옵션을 전달하여 루트 네임스페이스를 설정할 수 있습니다:

```js
window.Echo = new Echo({
    broadcaster: 'pusher',
    // ...
    namespace: 'App.Other.Namespace'
});
```

또는, Echo를 사용하여 이벤트를 구독할 때 이벤트 클래스 앞에 `.`을 붙여 항상 전체 클래스 이름을 지정할 수 있습니다:

```js
Echo.channel('orders')
    .listen('.Namespace\\Event\\Class', (e) => {
        // ...
    });
```


### React 또는 Vue 사용하기 {#using-react-or-vue}

Laravel Echo는 이벤트 리스닝을 쉽게 해주는 React 및 Vue hook을 제공합니다. 시작하려면, 비공개 이벤트를 리스닝하는 데 사용되는 `useEcho` hook을 호출하세요. `useEcho` hook은 컴포넌트가 언마운트될 때 자동으로 채널을 나갑니다:
::: code-group
```js [React]
import { useEcho } from "@laravel/echo-react";

useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);
```

```vue [Vue]
<script setup lang="ts">
import { useEcho } from "@laravel/echo-vue";

useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);
</script>
```
:::
여러 이벤트를 리스닝하려면, `useEcho`에 이벤트 배열을 전달하세요:

```js
useEcho(
    `orders.${orderId}`,
    ["OrderShipmentStatusUpdated", "OrderShipped"],
    (e) => {
        console.log(e.order);
    },
);
```

브로드캐스트 이벤트 페이로드 데이터의 형태를 지정하여 타입 안정성과 편집 편의성을 높일 수도 있습니다:

```ts
type OrderData = {
    order: {
        id: number;
        user: {
            id: number;
            name: string;
        };
        created_at: string;
    };
};

useEcho<OrderData>(`orders.${orderId}`, "OrderShipmentStatusUpdated", (e) => {
    console.log(e.order.id);
    console.log(e.order.user.id);
});
```

`useEcho` hook은 컴포넌트가 언마운트될 때 자동으로 채널을 나가지만, 반환된 함수를 사용하여 필요할 때 프로그래밍적으로 채널 리스닝을 중지/시작할 수 있습니다:
::: code-group
```js [React]
import { useEcho } from "@laravel/echo-react";

const { leaveChannel, leave, stopListening, listen } = useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);

// Stop listening without leaving channel...
stopListening();

// Start listening again...
listen();

// Leave channel...
leaveChannel();

// Leave a channel and also its associated private and presence channels...
leave();
```

```vue [Vue]
<script setup lang="ts">
import { useEcho } from "@laravel/echo-vue";

const { leaveChannel, leave, stopListening, listen } = useEcho(
    `orders.${orderId}`,
    "OrderShipmentStatusUpdated",
    (e) => {
        console.log(e.order);
    },
);

// Stop listening without leaving channel...
stopListening();

// Start listening again...
listen();

// Leave channel...
leaveChannel();

// Leave a channel and also its associated private and presence channels...
leave();
</script>
```
:::

#### 공개 채널 연결 {#react-vue-connecting-to-public-channels}

공개 채널에 연결하려면, `useEchoPublic` hook을 사용할 수 있습니다:
::: code-group
```js [React]
import { useEchoPublic } from "@laravel/echo-react";

useEchoPublic("posts", "PostPublished", (e) => {
    console.log(e.post);
});
```

```vue [Vue]
<script setup lang="ts">
import { useEchoPublic } from "@laravel/echo-vue";

useEchoPublic("posts", "PostPublished", (e) => {
    console.log(e.post);
});
</script>
```
:::

#### 프레즌스 채널 연결 {#react-vue-connecting-to-presence-channels}

프레즌스 채널에 연결하려면, `useEchoPresence` hook을 사용할 수 있습니다:
::: code-group
```js [React]
import { useEchoPresence } from "@laravel/echo-react";

useEchoPresence("posts", "PostPublished", (e) => {
    console.log(e.post);
});
```

```vue [Vue]
<script setup lang="ts">
import { useEchoPresence } from "@laravel/echo-vue";

useEchoPresence("posts", "PostPublished", (e) => {
    console.log(e.post);
});
</script>
```
:::

## 프레즌스 채널 {#presence-channels}

프레즌스 채널은 비공개 채널의 보안 위에, 채널에 누가 구독 중인지 알 수 있는 기능을 추가로 제공합니다. 이를 통해 같은 페이지를 보고 있는 사용자를 알리거나, 채팅방의 참여자를 나열하는 등 강력하고 협업적인 애플리케이션 기능을 쉽게 구축할 수 있습니다.


### 프레즌스 채널 권한 부여 {#authorizing-presence-channels}

모든 프레즌스 채널은 비공개 채널이기도 하므로, 사용자가 [접근 권한을 가져야](#authorizing-channels) 합니다. 하지만 프레즌스 채널의 권한 콜백을 정의할 때는, 사용자가 채널에 참여할 권한이 있다면 `true`를 반환하는 대신 사용자에 대한 데이터 배열을 반환해야 합니다.

권한 콜백에서 반환된 데이터는 JavaScript 애플리케이션의 프레즌스 채널 이벤트 리스너에서 사용할 수 있습니다. 사용자가 프레즌스 채널에 참여할 권한이 없다면, `false` 또는 `null`을 반환해야 합니다:

```php
use App\Models\User;

Broadcast::channel('chat.{roomId}', function (User $user, int $roomId) {
    if ($user->canJoinRoom($roomId)) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
```


### 프레즌스 채널 참여 {#joining-presence-channels}

프레즌스 채널에 참여하려면, Echo의 `join` 메서드를 사용할 수 있습니다. `join` 메서드는 `PresenceChannel` 구현체를 반환하며, `listen` 메서드 외에도 `here`, `joining`, `leaving` 이벤트를 구독할 수 있습니다.

```js
Echo.join(`chat.${roomId}`)
    .here((users) => {
        // ...
    })
    .joining((user) => {
        console.log(user.name);
    })
    .leaving((user) => {
        console.log(user.name);
    })
    .error((error) => {
        console.error(error);
    });
```

`here` 콜백은 채널에 성공적으로 참여하면 즉시 실행되며, 현재 채널에 구독 중인 다른 모든 사용자의 정보 배열을 받습니다. `joining` 메서드는 새 사용자가 채널에 참여할 때 실행되고, `leaving` 메서드는 사용자가 채널을 떠날 때 실행됩니다. `error` 메서드는 인증 엔드포인트가 200이 아닌 HTTP 상태 코드를 반환하거나, 반환된 JSON을 파싱하는 데 문제가 있을 때 실행됩니다.


### 프레즌스 채널로 브로드캐스트 {#broadcasting-to-presence-channels}

프레즌스 채널도 공개 또는 비공개 채널처럼 이벤트를 수신할 수 있습니다. 예를 들어, 채팅방의 프레즌스 채널에 `NewMessage` 이벤트를 브로드캐스트하고 싶을 수 있습니다. 이를 위해 이벤트의 `broadcastOn` 메서드에서 `PresenceChannel` 인스턴스를 반환하면 됩니다:

```php
/**
 * Get the channels the event should broadcast on.
 *
 * @return array<int, \Illuminate\Broadcasting\Channel>
 */
public function broadcastOn(): array
{
    return [
        new PresenceChannel('chat.'.$this->message->room_id),
    ];
}
```

다른 이벤트와 마찬가지로, `broadcast` 헬퍼와 `toOthers` 메서드를 사용하여 현재 사용자를 제외할 수 있습니다:

```php
broadcast(new NewMessage($message));

broadcast(new NewMessage($message))->toOthers();
```

다른 유형의 이벤트와 마찬가지로, Echo의 `listen` 메서드를 사용하여 프레즌스 채널로 전송된 이벤트를 리스닝할 수 있습니다:

```js
Echo.join(`chat.${roomId}`)
    .here(/* ... */)
    .joining(/* ... */)
    .leaving(/* ... */)
    .listen('NewMessage', (e) => {
        // ...
    });
```


## 모델 브로드캐스팅 {#model-broadcasting}

> [!WARNING]
> 아래 모델 브로드캐스팅 문서를 읽기 전에, Laravel의 모델 브로드캐스팅 서비스의 일반 개념과 브로드캐스트 이벤트를 수동으로 생성 및 리스닝하는 방법을 먼저 숙지하시기 바랍니다.

애플리케이션의 [Eloquent 모델](/laravel/12.x/eloquent)이 생성, 수정, 삭제될 때 이벤트를 브로드캐스트하는 경우가 많습니다. 물론, [Eloquent 모델 상태 변경에 대한 커스텀 이벤트를 수동으로 정의](/laravel/12.x/eloquent#events)하고, 해당 이벤트에 `ShouldBroadcast` 인터페이스를 지정하여 쉽게 구현할 수 있습니다.

하지만, 애플리케이션에서 다른 용도로 이 이벤트를 사용하지 않는다면, 단순히 브로드캐스트만을 위해 이벤트 클래스를 만드는 것이 번거로울 수 있습니다. 이를 해결하기 위해, Laravel은 Eloquent 모델이 상태 변경 시 자동으로 브로드캐스트하도록 지정할 수 있습니다.

시작하려면, Eloquent 모델에 `Illuminate\Database\Eloquent\BroadcastsEvents` 트레이트를 사용해야 합니다. 또한, 모델에 `broadcastOn` 메서드를 정의하여, 모델 이벤트가 브로드캐스트될 채널 배열을 반환해야 합니다:

```php
<?php

namespace App\Models;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use BroadcastsEvents, HasFactory;

    /**
     * Get the user that the post belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the channels that model events should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel|\Illuminate\Database\Eloquent\Model>
     */
    public function broadcastOn(string $event): array
    {
        return [$this, $this->user];
    }
}
```

모델에 이 트레이트를 포함하고 브로드캐스트 채널을 정의하면, 모델 인스턴스가 생성, 수정, 삭제, 휴지통 이동, 복원될 때마다 자동으로 이벤트가 브로드캐스트됩니다.

또한, `broadcastOn` 메서드가 문자열 `$event` 인자를 받는 것을 볼 수 있습니다. 이 인자는 모델에서 발생한 이벤트 유형을 담고 있으며, 값은 `created`, `updated`, `deleted`, `trashed`, `restored` 중 하나입니다. 이 변수를 검사하여 특정 이벤트에 대해 모델이 브로드캐스트할 채널(있다면)을 결정할 수 있습니다:

```php
/**
 * Get the channels that model events should broadcast on.
 *
 * @return array<string, array<int, \Illuminate\Broadcasting\Channel|\Illuminate\Database\Eloquent\Model>>
 */
public function broadcastOn(string $event): array
{
    return match ($event) {
        'deleted' => [],
        default => [$this, $this->user],
    };
}
```


#### 모델 브로드캐스팅 이벤트 생성 커스터마이징 {#customizing-model-broadcasting-event-creation}

가끔 Laravel이 내부적으로 모델 브로드캐스팅 이벤트를 생성하는 방식을 커스터마이징하고 싶을 수 있습니다. 이를 위해 Eloquent 모델에 `newBroadcastableEvent` 메서드를 정의할 수 있습니다. 이 메서드는 `Illuminate\Database\Eloquent\BroadcastableModelEventOccurred` 인스턴스를 반환해야 합니다:

```php
use Illuminate\Database\Eloquent\BroadcastableModelEventOccurred;

/**
 * Create a new broadcastable model event for the model.
 */
protected function newBroadcastableEvent(string $event): BroadcastableModelEventOccurred
{
    return (new BroadcastableModelEventOccurred(
        $this, $event
    ))->dontBroadcastToCurrentUser();
}
```


### 모델 브로드캐스팅 규칙 {#model-broadcasting-conventions}


#### 채널 규칙 {#model-broadcasting-channel-conventions}

위 모델 예제의 `broadcastOn` 메서드가 `Channel` 인스턴스를 반환하지 않고, Eloquent 모델을 직접 반환한 것을 볼 수 있습니다. 모델의 `broadcastOn` 메서드에서 Eloquent 모델 인스턴스를 반환(또는 배열에 포함)하면, Laravel은 모델의 클래스 이름과 기본 키 식별자를 채널 이름으로 사용하여 자동으로 비공개 채널 인스턴스를 생성합니다.

예를 들어, `id`가 `1`인 `App\Models\User` 모델은 `App.Models.User.1`이라는 이름의 `Illuminate\Broadcasting\PrivateChannel` 인스턴스로 변환됩니다. 물론, 모델의 `broadcastOn` 메서드에서 Eloquent 모델 인스턴스 대신 완전한 `Channel` 인스턴스를 반환하여 채널 이름을 완전히 제어할 수도 있습니다:

```php
use Illuminate\Broadcasting\PrivateChannel;

/**
 * Get the channels that model events should broadcast on.
 *
 * @return array<int, \Illuminate\Broadcasting\Channel>
 */
public function broadcastOn(string $event): array
{
    return [
        new PrivateChannel('user.'.$this->id)
    ];
}
```

모델의 `broadcastOn` 메서드에서 채널 인스턴스를 명시적으로 반환할 계획이라면, 채널 생성자에 Eloquent 모델 인스턴스를 전달할 수 있습니다. 이 경우, Laravel은 위에서 설명한 모델 채널 규칙을 사용하여 Eloquent 모델을 채널 이름 문자열로 변환합니다:

```php
return [new Channel($this->user)];
```

모델의 채널 이름을 확인해야 한다면, 어떤 모델 인스턴스에서든 `broadcastChannel` 메서드를 호출할 수 있습니다. 예를 들어, 이 메서드는 `id`가 `1`인 `App\Models\User` 모델에 대해 `App.Models.User.1` 문자열을 반환합니다:

```php
$user->broadcastChannel();
```


#### 이벤트 규칙 {#model-broadcasting-event-conventions}

모델 브로드캐스트 이벤트는 애플리케이션의 `App\Events` 디렉터리에 "실제" 이벤트가 존재하지 않으므로, 규칙에 따라 이름과 페이로드가 할당됩니다. Laravel의 규칙은 모델의 클래스 이름(네임스페이스 제외)과 브로드캐스트를 트리거한 모델 이벤트 이름을 사용하여 이벤트를 브로드캐스트하는 것입니다.

예를 들어, `App\Models\Post` 모델이 업데이트되면, 클라이언트 사이드 애플리케이션에 `PostUpdated`라는 이벤트와 다음과 같은 페이로드가 브로드캐스트됩니다:

```json
{
    "model": {
        "id": 1,
        "title": "My first post"
        ...
    },
    ...
    "socket": "someSocketId"
}
```

`App\Models\User` 모델이 삭제되면, `UserDeleted`라는 이벤트가 브로드캐스트됩니다.

원한다면, 모델에 `broadcastAs`와 `broadcastWith` 메서드를 추가하여 커스텀 브로드캐스트 이름과 페이로드를 정의할 수 있습니다. 이 메서드들은 발생 중인 모델 이벤트/작업의 이름을 받아, 각 모델 작업에 대해 이벤트 이름과 페이로드를 커스터마이징할 수 있습니다. `broadcastAs` 메서드에서 `null`을 반환하면, Laravel은 위에서 설명한 모델 브로드캐스팅 이벤트 이름 규칙을 사용합니다:

```php
/**
 * The model event's broadcast name.
 */
public function broadcastAs(string $event): string|null
{
    return match ($event) {
        'created' => 'post.created',
        default => null,
    };
}

/**
 * Get the data to broadcast for the model.
 *
 * @return array<string, mixed>
 */
public function broadcastWith(string $event): array
{
    return match ($event) {
        'created' => ['title' => $this->title],
        default => ['model' => $this],
    };
}
```


### 모델 브로드캐스트 리스닝 {#listening-for-model-broadcasts}

모델에 `BroadcastsEvents` 트레이트를 추가하고, `broadcastOn` 메서드를 정의했다면, 이제 클라이언트 사이드 애플리케이션에서 브로드캐스트된 모델 이벤트를 리스닝할 준비가 된 것입니다. 시작하기 전에, [이벤트 리스닝](#listening-for-events)에 대한 전체 문서를 참고하면 좋습니다.

먼저, `private` 메서드를 사용하여 채널 인스턴스를 가져오고, `listen` 메서드를 호출하여 특정 이벤트를 리스닝하세요. 일반적으로, `private` 메서드에 전달하는 채널 이름은 Laravel의 [모델 브로드캐스팅 규칙](#model-broadcasting-conventions)에 따라야 합니다.

채널 인스턴스를 얻었다면, `listen` 메서드를 사용하여 특정 이벤트를 리스닝할 수 있습니다. 모델 브로드캐스트 이벤트는 애플리케이션의 `App\Events` 디렉터리에 "실제" 이벤트가 존재하지 않으므로, [이벤트 이름](#model-broadcasting-event-conventions) 앞에 `.`을 붙여 네임스페이스에 속하지 않음을 나타내야 합니다. 각 모델 브로드캐스트 이벤트에는 모델의 모든 브로드캐스트 가능한 속성을 담은 `model` 속성이 있습니다:

```js
Echo.private(`App.Models.User.${this.user.id}`)
    .listen('.UserUpdated', (e) => {
        console.log(e.model);
    });
```


#### React 또는 Vue에서 사용하기 {#model-broadcasts-with-react-or-vue}

React 또는 Vue를 사용한다면, Laravel Echo에 포함된 `useEchoModel` hook을 사용하여 모델 브로드캐스트를 쉽게 리스닝할 수 있습니다:
::: code-group
```js [React]
import { useEchoModel } from "@laravel/echo-react";

useEchoModel("App.Models.User", userId, ["UserUpdated"], (e) => {
    console.log(e.model);
});
```

```vue [Vue]
<script setup lang="ts">
import { useEchoModel } from "@laravel/echo-vue";

useEchoModel("App.Models.User", userId, ["UserUpdated"], (e) => {
    console.log(e.model);
});
</script>
```
:::
모델 이벤트 페이로드 데이터의 형태를 지정하여 타입 안정성과 편집 편의성을 높일 수도 있습니다:

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

useEchoModel<User, "App.Models.User">("App.Models.User", userId, ["UserUpdated"], (e) => {
    console.log(e.model.id);
    console.log(e.model.name);
});
```


## 클라이언트 이벤트 {#client-events}

> [!NOTE]
> [Pusher Channels](https://pusher.com/channels)를 사용할 때, [애플리케이션 대시보드](https://dashboard.pusher.com/)의 "App Settings" 섹션에서 "Client Events" 옵션을 활성화해야 클라이언트 이벤트를 전송할 수 있습니다.

때로는 Laravel 애플리케이션을 거치지 않고, 다른 연결된 클라이언트에게 이벤트를 브로드캐스트하고 싶을 수 있습니다. 이는 "입력 중" 알림처럼, 특정 화면에서 다른 사용자가 메시지를 입력 중임을 알리고 싶을 때 특히 유용합니다.

클라이언트 이벤트를 브로드캐스트하려면, Echo의 `whisper` 메서드를 사용할 수 있습니다:
::: code-group
```js [JavaScript]
Echo.private(`chat.${roomId}`)
    .whisper('typing', {
        name: this.user.name
    });
```

```js [React]
import { useEcho } from "@laravel/echo-react";

const { channel } = useEcho(`chat.${roomId}`, ['update'], (e) => {
    console.log('Chat event received:', e);
});

channel().whisper('typing', { name: user.name });
```

```vue [Vue]
<script setup lang="ts">
import { useEcho } from "@laravel/echo-vue";

const { channel } = useEcho(`chat.${roomId}`, ['update'], (e) => {
    console.log('Chat event received:', e);
});

channel().whisper('typing', { name: user.name });
</script>
```
:::
클라이언트 이벤트를 리스닝하려면, `listenForWhisper` 메서드를 사용할 수 있습니다:
::: code-group
```js [JavaScript]
Echo.private(`chat.${roomId}`)
    .listenForWhisper('typing', (e) => {
        console.log(e.name);
    });
```

```js [React]
import { useEcho } from "@laravel/echo-react";

const { channel } = useEcho(`chat.${roomId}`, ['update'], (e) => {
    console.log('Chat event received:', e);
});

channel().listenForWhisper('typing', (e) => {
    console.log(e.name);
});
```

```vue [Vue]
<script setup lang="ts">
import { useEcho } from "@laravel/echo-vue";

const { channel } = useEcho(`chat.${roomId}`, ['update'], (e) => {
    console.log('Chat event received:', e);
});

channel().listenForWhisper('typing', (e) => {
    console.log(e.name);
});
</script>
```
:::

## 알림 {#notifications}

이벤트 브로드캐스팅을 [알림](/laravel/12.x/notifications)과 결합하면, JavaScript 애플리케이션이 페이지를 새로고침하지 않고도 새로운 알림을 실시간으로 받을 수 있습니다. 시작하기 전에, [브로드캐스트 알림 채널](/laravel/12.x/notifications#broadcast-notifications) 사용에 대한 문서를 꼭 읽어보세요.

알림이 브로드캐스트 채널을 사용하도록 설정했다면, Echo의 `notification` 메서드를 사용하여 브로드캐스트 이벤트를 리스닝할 수 있습니다. 채널 이름은 알림을 받는 엔티티의 클래스 이름과 일치해야 합니다:
::: code-group
```js [JavaScript]
Echo.private(`App.Models.User.${userId}`)
    .notification((notification) => {
        console.log(notification.type);
    });
```

```js [React]
import { useEchoModel } from "@laravel/echo-react";

const { channel } = useEchoModel('App.Models.User', userId);

channel().notification((notification) => {
    console.log(notification.type);
});
```

```vue [Vue]
<script setup lang="ts">
import { useEchoModel } from "@laravel/echo-vue";

const { channel } = useEchoModel('App.Models.User', userId);

channel().notification((notification) => {
    console.log(notification.type);
});
</script>
```
:::
이 예제에서는, `broadcast` 채널을 통해 `App\Models\User` 인스턴스에 전송된 모든 알림이 콜백에서 수신됩니다. `App.Models.User.{id}` 채널에 대한 채널 권한 콜백이 애플리케이션의 `routes/channels.php` 파일에 포함되어 있습니다.
