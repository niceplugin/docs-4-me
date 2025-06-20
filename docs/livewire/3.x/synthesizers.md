# 신디사이저 (Synthesizer)
Livewire 컴포넌트는 요청 간에 JSON으로 탈수화(직렬화)되었다가 다시 PHP 컴포넌트로 수화(역직렬화)되기 때문에, 컴포넌트의 프로퍼티는 JSON으로 직렬화할 수 있어야 합니다.

PHP는 기본적으로 대부분의 원시 값을 쉽게 JSON으로 직렬화합니다. 그러나 Livewire 컴포넌트가 더 정교한 프로퍼티 타입(예: 모델, 컬렉션, 카본 인스턴스, 스트링어블 등)을 지원하려면 더 견고한 시스템이 필요합니다.

따라서 Livewire는 사용자가 원하는 모든 커스텀 프로퍼티 타입을 지원할 수 있도록 "Synthesizers"라는 확장 지점을 제공합니다.

> [!tip] 먼저 수화(hydration)를 이해하세요
> Synthesizer를 사용하기 전에 Livewire의 수화 시스템을 완전히 이해하는 것이 도움이 됩니다. [수화 문서](/livewire/3.x/hydration)를 읽어보세요.

## Synthesizer 이해하기 {#understanding-synthesizers}

커스텀 Synthesizer를 만들기 전에, 먼저 Livewire가 [Laravel Stringables](https://laravel.com/docs/strings)를 지원하기 위해 사용하는 내부 Synthesizer를 살펴보겠습니다.

예를 들어, 애플리케이션에 다음과 같은 `CreatePost` 컴포넌트가 있다고 가정해봅시다:

```php
class CreatePost extends Component
{
    public $title = '';
}
```

요청 간에 Livewire는 이 컴포넌트의 상태를 다음과 같은 JSON 객체로 직렬화할 수 있습니다:

```js
state: { title: '' },
```

이제, `$title` 프로퍼티 값이 일반 문자열이 아니라 stringable인 좀 더 발전된 예제를 생각해봅시다:

```php
class CreatePost extends Component
{
    public $title = '';

    public function mount()
    {
        $this->title = str($this->title);
    }
}
```

이제 이 컴포넌트의 상태를 나타내는 탈수화된 JSON에는 일반 빈 문자열 대신 [메타데이터 튜플](/livewire/3.x/hydration#deeply-nested-tuples)이 포함됩니다:

```js
state: { title: ['', { s: 'str' }] },
```

Livewire는 이제 이 튜플을 사용하여 다음 요청 시 `$title` 프로퍼티를 다시 stringable로 수화할 수 있습니다.

Synthesizer의 외부 효과를 살펴보았으니, 이제 Livewire의 내부 stringable synth의 실제 소스 코드를 살펴보겠습니다:

```php
use Illuminate\Support\Stringable;

class StringableSynth extends Synth
{
    public static $key = 'str';

    public static function match($target)
    {
        return $target instanceof Stringable;
    }

    public function dehydrate($target)
    {
        return [$target->__toString(), []];
    }

    public function hydrate($value)
    {
        return str($value);
    }
}
```

이제 하나씩 살펴보겠습니다.

먼저 `$key` 프로퍼티입니다:

```php
public static $key = 'str';
```

모든 synth는 정적 `$key` 프로퍼티를 포함해야 하며, Livewire는 이를 사용하여 `['', { s: 'str' }]`와 같은 [메타데이터 튜플](/livewire/3.x/hydration#deeply-nested-tuples)을 stringable로 다시 변환합니다. 각 메타데이터 튜플에는 이 키를 참조하는 `s` 키가 있다는 점을 알 수 있습니다.

반대로, Livewire가 프로퍼티를 탈수화할 때, synth의 정적 `match()` 함수를 사용하여 현재 프로퍼티(`$target`이 프로퍼티의 현재 값임)를 탈수화할 적합한 Synthesizer인지 식별합니다:

```php
public static function match($target)
{
    return $target instanceof Stringable;
}
```

`match()`가 true를 반환하면, `dehydrate()` 메서드가 프로퍼티의 PHP 값을 입력으로 받아 JSON으로 변환 가능한 [메타데이터](/livewire/3.x/hydration#deeply-nested-tuples) 튜플을 반환하는 데 사용됩니다:

```php
public function dehydrate($target)
{
    return [$target->__toString(), []];
}
```

이제, 다음 요청이 시작될 때, 이 Synthesizer가 튜플의 `{ s: 'str' }` 키에 의해 매칭되면, `hydrate()` 메서드가 호출되어 프로퍼티의 원시 JSON 표현을 전달받고, 프로퍼티에 할당할 수 있는 완전한 PHP 호환 값을 반환해야 합니다.

```php
public function hydrate($value)
{
    return str($value);
}
```

## 커스텀 Synthesizer 등록하기 {#registering-a-custom-synthesizer}

커스텀 프로퍼티를 지원하기 위해 직접 Synthesizer를 작성하는 방법을 보여주기 위해, 다음의 `UpdateProperty` 컴포넌트를 예시로 사용하겠습니다:

```php
class UpdateProperty extends Component
{
    public Address $address;

    public function mount()
    {
        $this->address = new Address();
    }
}
```

다음은 `Address` 클래스의 소스입니다:

```php
namespace App\Dtos\Address;

class Address
{
    public $street = '';
    public $city = '';
    public $state = '';
    public $zip = '';
}
```

`Address` 타입의 프로퍼티를 지원하려면, 다음과 같은 Synthesizer를 사용할 수 있습니다:

```php
use App\Dtos\Address;

class AddressSynth extends Synth
{
    public static $key = 'address';

    public static function match($target)
    {
        return $target instanceof Address;
    }

    public function dehydrate($target)
    {
        return [[
            'street' => $target->street,
            'city' => $target->city,
            'state' => $target->state,
            'zip' => $target->zip,
        ], []];
    }

    public function hydrate($value)
    {
        $instance = new Address;

        $instance->street = $value['street'];
        $instance->city = $value['city'];
        $instance->state = $value['state'];
        $instance->zip = $value['zip'];

        return $instance;
    }
}
```

애플리케이션에서 전역적으로 사용할 수 있도록 하려면, 서비스 프로바이더의 boot 메서드에서 Livewire의 `propertySynthesizer` 메서드를 사용하여 synthesizer를 등록할 수 있습니다:

```php
class AppServiceProvider extends ServiceProvider
{
    /**
     * 애플리케이션 서비스를 부트스트랩합니다.
     */
    public function boot(): void
    {
        Livewire::propertySynthesizer(AddressSynth::class);
    }
}
```

## 데이터 바인딩 지원하기 {#supporting-data-binding}

위의 `UpdateProperty` 예제에서처럼, `Address` 객체의 프로퍼티에 직접 `wire:model` 바인딩을 지원하고 싶을 수 있습니다. Synthesizer는 `get()` 및 `set()` 메서드를 사용하여 이를 지원할 수 있습니다:

```php
use App\Dtos\Address;

class AddressSynth extends Synth
{
    public static $key = 'address';

    public static function match($target)
    {
        return $target instanceof Address;
    }

    public function dehydrate($target)
    {
        return [[
            'street' => $target->street,
            'city' => $target->city,
            'state' => $target->state,
            'zip' => $target->zip,
        ], []];
    }

    public function hydrate($value)
    {
        $instance = new Address;

        $instance->street = $value['street'];
        $instance->city = $value['city'];
        $instance->state = $value['state'];
        $instance->zip = $value['zip'];

        return $instance;
    }

    public function get(&$target, $key) // [!code highlight:9]
    {
        return $target->{$key};
    }

    public function set(&$target, $key, $value)
    {
        $target->{$key} = $value;
    }
}
```
