# 문자열

- [소개](#introduction)
- [사용 가능한 메서드](#available-methods)


## 소개 {#introduction}

Laravel은 문자열 값을 조작하기 위한 다양한 함수를 포함하고 있습니다. 이러한 함수들 중 다수는 프레임워크 자체에서 사용되지만, 필요하다면 여러분의 애플리케이션에서도 자유롭게 사용할 수 있습니다.


## 사용 가능한 메서드 {#available-methods}

<style>
    .collection-method-list > p {
        columns: 10.8em 3; -moz-columns: 10.8em 3; -webkit-columns: 10.8em 3;
    }

    .collection-method-list a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>


### 문자열 {#strings-method-list}

<div class="collection-method-list" markdown="1">

[\__](#method-__)
[class_basename](#method-class-basename)
[e](#method-e)
[preg_replace_array](#method-preg-replace-array)
[Str::after](#method-str-after)
[Str::afterLast](#method-str-after-last)
[Str::apa](#method-str-apa)
[Str::ascii](#method-str-ascii)
[Str::before](#method-str-before)
[Str::beforeLast](#method-str-before-last)
[Str::between](#method-str-between)
[Str::betweenFirst](#method-str-between-first)
[Str::camel](#method-camel-case)
[Str::charAt](#method-char-at)
[Str::chopStart](#method-str-chop-start)
[Str::chopEnd](#method-str-chop-end)
[Str::contains](#method-str-contains)
[Str::containsAll](#method-str-contains-all)
[Str::doesntContain](#method-str-doesnt-contain)
[Str::deduplicate](#method-deduplicate)
[Str::endsWith](#method-ends-with)
[Str::excerpt](#method-excerpt)
[Str::finish](#method-str-finish)
[Str::headline](#method-str-headline)
[Str::inlineMarkdown](#method-str-inline-markdown)
[Str::is](#method-str-is)
[Str::isAscii](#method-str-is-ascii)
[Str::isJson](#method-str-is-json)
[Str::isUlid](#method-str-is-ulid)
[Str::isUrl](#method-str-is-url)
[Str::isUuid](#method-str-is-uuid)
[Str::kebab](#method-kebab-case)
[Str::lcfirst](#method-str-lcfirst)
[Str::length](#method-str-length)
[Str::limit](#method-str-limit)
[Str::lower](#method-str-lower)
[Str::markdown](#method-str-markdown)
[Str::mask](#method-str-mask)
[Str::match](#method-str-match)
[Str::matchAll](#method-str-match-all)
[Str::orderedUuid](#method-str-ordered-uuid)
[Str::padBoth](#method-str-padboth)
[Str::padLeft](#method-str-padleft)
[Str::padRight](#method-str-padright)
[Str::password](#method-str-password)
[Str::plural](#method-str-plural)
[Str::pluralStudly](#method-str-plural-studly)
[Str::position](#method-str-position)
[Str::random](#method-str-random)
[Str::remove](#method-str-remove)
[Str::repeat](#method-str-repeat)
[Str::replace](#method-str-replace)
[Str::replaceArray](#method-str-replace-array)
[Str::replaceFirst](#method-str-replace-first)
[Str::replaceLast](#method-str-replace-last)
[Str::replaceMatches](#method-str-replace-matches)
[Str::replaceStart](#method-str-replace-start)
[Str::replaceEnd](#method-str-replace-end)
[Str::reverse](#method-str-reverse)
[Str::singular](#method-str-singular)
[Str::slug](#method-str-slug)
[Str::snake](#method-snake-case)
[Str::squish](#method-str-squish)
[Str::start](#method-str-start)
[Str::startsWith](#method-starts-with)
[Str::studly](#method-studly-case)
[Str::substr](#method-str-substr)
[Str::substrCount](#method-str-substrcount)
[Str::substrReplace](#method-str-substrreplace)
[Str::swap](#method-str-swap)
[Str::take](#method-take)
[Str::title](#method-title-case)
[Str::toBase64](#method-str-to-base64)
[Str::transliterate](#method-str-transliterate)
[Str::trim](#method-str-trim)
[Str::ltrim](#method-str-ltrim)
[Str::rtrim](#method-str-rtrim)
[Str::ucfirst](#method-str-ucfirst)
[Str::ucsplit](#method-str-ucsplit)
[Str::upper](#method-str-upper)
[Str::ulid](#method-str-ulid)
[Str::unwrap](#method-str-unwrap)
[Str::uuid](#method-str-uuid)
[Str::uuid7](#method-str-uuid7)
[Str::wordCount](#method-str-word-count)
[Str::wordWrap](#method-str-word-wrap)
[Str::words](#method-str-words)
[Str::wrap](#method-str-wrap)
[str](#method-str)
[trans](#method-trans)
[trans_choice](#method-trans-choice)

</div>


### Fluent Strings {#fluent-strings-method-list}

<div class="collection-method-list" markdown="1">

[after](#method-fluent-str-after)  
[afterLast](#method-fluent-str-after-last)  
[apa](#method-fluent-str-apa)  
[append](#method-fluent-str-append)  
[ascii](#method-fluent-str-ascii)  
[basename](#method-fluent-str-basename)  
[before](#method-fluent-str-before)  
[beforeLast](#method-fluent-str-before-last)  
[between](#method-fluent-str-between)  
[betweenFirst](#method-fluent-str-between-first)  
[camel](#method-fluent-str-camel)  
[charAt](#method-fluent-str-char-at)  
[classBasename](#method-fluent-str-class-basename)  
[chopStart](#method-fluent-str-chop-start)  
[chopEnd](#method-fluent-str-chop-end)  
[contains](#method-fluent-str-contains)  
[containsAll](#method-fluent-str-contains-all)  
[decrypt](#method-fluent-str-decrypt)  
[deduplicate](#method-fluent-str-deduplicate)  
[dirname](#method-fluent-str-dirname)  
[encrypt](#method-fluent-str-encrypt)  
[endsWith](#method-fluent-str-ends-with)  
[exactly](#method-fluent-str-exactly)  
[excerpt](#method-fluent-str-excerpt)  
[explode](#method-fluent-str-explode)  
[finish](#method-fluent-str-finish)  
[hash](#method-fluent-str-hash)  
[headline](#method-fluent-str-headline)  
[inlineMarkdown](#method-fluent-str-inline-markdown)  
[is](#method-fluent-str-is)  
[isAscii](#method-fluent-str-is-ascii)  
[isEmpty](#method-fluent-str-is-empty)  
[isNotEmpty](#method-fluent-str-is-not-empty)  
[isJson](#method-fluent-str-is-json)  
[isUlid](#method-fluent-str-is-ulid)  
[isUrl](#method-fluent-str-is-url)  
[isUuid](#method-fluent-str-is-uuid)  
[kebab](#method-fluent-str-kebab)  
[lcfirst](#method-fluent-str-lcfirst)  
[length](#method-fluent-str-length)  
[limit](#method-fluent-str-limit)  
[lower](#method-fluent-str-lower)  
[markdown](#method-fluent-str-markdown)  
[mask](#method-fluent-str-mask)  
[match](#method-fluent-str-match)  
[matchAll](#method-fluent-str-match-all)  
[isMatch](#method-fluent-str-is-match)  
[newLine](#method-fluent-str-new-line)  
[padBoth](#method-fluent-str-padboth)  
[padLeft](#method-fluent-str-padleft)  
[padRight](#method-fluent-str-padright)  
[pipe](#method-fluent-str-pipe)  
[plural](#method-fluent-str-plural)  
[position](#method-fluent-str-position)  
[prepend](#method-fluent-str-prepend)  
[remove](#method-fluent-str-remove)  
[repeat](#method-fluent-str-repeat)  
[replace](#method-fluent-str-replace)  
[replaceArray](#method-fluent-str-replace-array)  
[replaceFirst](#method-fluent-str-replace-first)  
[replaceLast](#method-fluent-str-replace-last)  
[replaceMatches](#method-fluent-str-replace-matches)  
[replaceStart](#method-fluent-str-replace-start)  
[replaceEnd](#method-fluent-str-replace-end)  
[scan](#method-fluent-str-scan)  
[singular](#method-fluent-str-singular)  
[slug](#method-fluent-str-slug)  
[snake](#method-fluent-str-snake)  
[split](#method-fluent-str-split)  
[squish](#method-fluent-str-squish)  
[start](#method-fluent-str-start)  
[startsWith](#method-fluent-str-starts-with)  
[stripTags](#method-fluent-str-strip-tags)  
[studly](#method-fluent-str-studly)  
[substr](#method-fluent-str-substr)  
[substrReplace](#method-fluent-str-substrreplace)  
[swap](#method-fluent-str-swap)  
[take](#method-fluent-str-take)  
[tap](#method-fluent-str-tap)  
[test](#method-fluent-str-test)  
[title](#method-fluent-str-title)  
[toBase64](#method-fluent-str-to-base64)  
[toHtmlString](#method-fluent-str-to-html-string)  
[toUri](#method-fluent-str-to-uri)  
[transliterate](#method-fluent-str-transliterate)  
[trim](#method-fluent-str-trim)  
[ltrim](#method-fluent-str-ltrim)  
[rtrim](#method-fluent-str-rtrim)  
[ucfirst](#method-fluent-str-ucfirst)  
[ucsplit](#method-fluent-str-ucsplit)  
[unwrap](#method-fluent-str-unwrap)  
[upper](#method-fluent-str-upper)  
[when](#method-fluent-str-when)  
[whenContains](#method-fluent-str-when-contains)  
[whenContainsAll](#method-fluent-str-when-contains-all)  
[whenEmpty](#method-fluent-str-when-empty)  
[whenNotEmpty](#method-fluent-str-when-not-empty)  
[whenStartsWith](#method-fluent-str-when-starts-with)  
[whenEndsWith](#method-fluent-str-when-ends-with)  
[whenExactly](#method-fluent-str-when-exactly)  
[whenNotExactly](#method-fluent-str-when-not-exactly)  
[whenIs](#method-fluent-str-when-is)  
[whenIsAscii](#method-fluent-str-when-is-ascii)  
[whenIsUlid](#method-fluent-str-when-is-ulid)  
[whenIsUuid](#method-fluent-str-when-is-uuid)  
[whenTest](#method-fluent-str-when-test)  
[wordCount](#method-fluent-str-word-count)  
[words](#method-fluent-str-words)  
[wrap](#method-fluent-str-wrap)  

</div>


## 문자열 {#strings}


#### `__()` {#method-__}

`__` 함수는 주어진 번역 문자열 또는 번역 키를 [언어 파일](/laravel/12.x/localization)를 사용하여 번역합니다:

```php
echo __('Welcome to our application');

echo __('messages.welcome');
```

지정한 번역 문자열이나 키가 존재하지 않을 경우, `__` 함수는 전달된 값을 그대로 반환합니다. 따라서 위의 예시에서 해당 번역 키가 존재하지 않으면 `__` 함수는 `messages.welcome`을 반환합니다.


#### `class_basename()` {#method-class-basename}

`class_basename` 함수는 주어진 클래스에서 네임스페이스를 제거한 클래스 이름만 반환합니다:

```php
$class = class_basename('Foo\Bar\Baz');

// Baz
```


#### `e()` {#method-e}

`e` 함수는 PHP의 `htmlspecialchars` 함수를 실행하며, 기본적으로 `double_encode` 옵션이 `true`로 설정되어 있습니다:

```php
echo e('<html>foo</html>');

// &lt;html&gt;foo&lt;/html&gt;
```


#### `preg_replace_array()` {#method-preg-replace-array}

`preg_replace_array` 함수는 문자열에서 주어진 패턴을 배열의 값들로 순차적으로 교체합니다:

```php
$string = 'The event will take place between :start and :end';

$replaced = preg_replace_array('/:[a-z_]+/', ['8:30', '9:00'], $string);

// The event will take place between 8:30 and 9:00
```


#### `Str::after()` {#method-str-after}

`Str::after` 메서드는 문자열에서 지정한 값 이후의 모든 내용을 반환합니다. 만약 지정한 값이 문자열 내에 존재하지 않으면 전체 문자열이 반환됩니다:

```php
use Illuminate\Support\Str;

$slice = Str::after('This is my name', 'This is');

// ' my name'
```


#### `Str::afterLast()` {#method-str-after-last}

`Str::afterLast` 메서드는 문자열에서 주어진 값이 마지막으로 등장한 이후의 모든 내용을 반환합니다. 만약 해당 값이 문자열에 존재하지 않으면 전체 문자열을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::afterLast('App\Http\Controllers\Controller', '\\');

// 'Controller'
```


#### `Str::apa()` {#method-str-apa}

`Str::apa` 메서드는 주어진 문자열을 [APA 가이드라인](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)에 따라 제목 표기법(Title Case)으로 변환합니다:

```php
use Illuminate\Support\Str;

$title = Str::apa('Creating A Project');

// 'Creating a Project'
```


#### `Str::ascii()` {#method-str-ascii}

`Str::ascii` 메서드는 문자열을 ASCII 값으로 음역(Transliterate)하려고 시도합니다:

```php
use Illuminate\Support\Str;

$slice = Str::ascii('û');

// 'u'
```


#### `Str::before()` {#method-str-before}

`Str::before` 메서드는 문자열에서 지정한 값 이전의 모든 내용을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::before('This is my name', 'my name');

// 'This is '
```


#### `Str::beforeLast()` {#method-str-before-last}

`Str::beforeLast` 메서드는 문자열에서 주어진 값이 마지막으로 등장하기 전까지의 모든 내용을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::beforeLast('This is my name', 'is');

// 'This '
```


#### `Str::between()` {#method-str-between}

`Str::between` 메서드는 두 값 사이에 있는 문자열의 일부를 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::between('This is my name', 'This', 'name');

// ' is my '
```


#### `Str::betweenFirst()` {#method-str-between-first}

`Str::betweenFirst` 메서드는 두 값 사이에 있는 문자열 중 가장 작은 부분을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::betweenFirst('[a] bc [d]', '[', ']');

// 'a'
```


#### `Str::camel()` {#method-camel-case}

`Str::camel` 메서드는 주어진 문자열을 `camelCase`(카멜 케이스)로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::camel('foo_bar');

// 'fooBar'
```


#### `Str::charAt()` {#method-char-at}

`Str::charAt` 메서드는 지정한 인덱스에 있는 문자를 반환합니다. 만약 인덱스가 범위를 벗어나면 `false`를 반환합니다:

```php
use Illuminate\Support\Str;

$character = Str::charAt('This is my name.', 6);

// 's'
```


#### `Str::chopStart()` {#method-str-chop-start}

`Str::chopStart` 메서드는 주어진 값이 문자열의 시작 부분에 있을 때만, 그 값의 첫 번째 발생을 제거합니다:

```php
use Illuminate\Support\Str;

$url = Str::chopStart('https://laravel.com', 'https://');

// 'laravel.com'
```

두 번째 인수로 배열을 전달할 수도 있습니다. 만약 문자열이 배열에 있는 값 중 하나로 시작한다면, 해당 값이 문자열에서 제거됩니다:

```php
use Illuminate\Support\Str;

$url = Str::chopStart('http://laravel.com', ['https://', 'http://']);

// 'laravel.com'
```


#### `Str::chopEnd()` {#method-str-chop-end}

`Str::chopEnd` 메서드는 주어진 값이 문자열의 끝에 있을 때만 마지막으로 등장하는 해당 값을 제거합니다:

```php
use Illuminate\Support\Str;

$url = Str::chopEnd('app/Models/Photograph.php', '.php');

// 'app/Models/Photograph'
```

두 번째 인수로 배열을 전달할 수도 있습니다. 만약 문자열이 배열 내의 값 중 하나로 끝난다면, 해당 값이 문자열에서 제거됩니다:

```php
use Illuminate\Support\Str;

$url = Str::chopEnd('laravel.com/index.php', ['/index.html', '/index.php']);

// 'laravel.com'
```


#### `Str::contains()` {#method-str-contains}

`Str::contains` 메서드는 주어진 문자열에 특정 값이 포함되어 있는지 확인합니다. 기본적으로 이 메서드는 대소문자를 구분합니다:

```php
use Illuminate\Support\Str;

$contains = Str::contains('This is my name', 'my');

// true
```

배열을 전달하여, 주어진 문자열에 배열 내의 값 중 하나라도 포함되어 있는지 확인할 수도 있습니다:

```php
use Illuminate\Support\Str;

$contains = Str::contains('This is my name', ['my', 'foo']);

// true
```

`ignoreCase` 인수를 `true`로 설정하면 대소문자 구분을 비활성화할 수 있습니다:

```php
use Illuminate\Support\Str;

$contains = Str::contains('This is my name', 'MY', ignoreCase: true);

// true
```


#### `Str::containsAll()` {#method-str-contains-all}

`Str::containsAll` 메서드는 주어진 문자열이 주어진 배열의 모든 값을 포함하고 있는지 확인합니다:

```php
use Illuminate\Support\Str;

$containsAll = Str::containsAll('This is my name', ['my', 'name']);

// true
```

대소문자 구분을 비활성화하려면 `ignoreCase` 인수를 `true`로 설정할 수 있습니다:

```php
use Illuminate\Support\Str;

$containsAll = Str::containsAll('This is my name', ['MY', 'NAME'], ignoreCase: true);

// true
```


#### `Str::doesntContain()` {#method-str-doesnt-contain}

`Str::doesntContain` 메서드는 주어진 문자열에 특정 값이 포함되어 있지 않은지 확인합니다. 기본적으로 이 메서드는 대소문자를 구분합니다:

```php
use Illuminate\Support\Str;

$doesntContain = Str::doesntContain('This is name', 'my');

// true
```

또한, 값의 배열을 전달하여 주어진 문자열에 배열 내의 값들 중 어떤 것도 포함되어 있지 않은지 확인할 수 있습니다:

```php
use Illuminate\Support\Str;

$doesntContain = Str::doesntContain('This is name', ['my', 'foo']);

// true
```

`ignoreCase` 인수를 `true`로 설정하여 대소문자 구분을 비활성화할 수도 있습니다:

```php
use Illuminate\Support\Str;

$doesntContain = Str::doesntContain('This is name', 'MY', ignoreCase: true);

// true
```


#### `Str::deduplicate()` {#method-deduplicate}

`Str::deduplicate` 메서드는 주어진 문자열에서 연속적으로 나타나는 특정 문자를 하나의 문자로 대체합니다. 기본적으로 이 메서드는 공백을 중복 제거합니다:

```php
use Illuminate\Support\Str;

$result = Str::deduplicate('The   Laravel   Framework');

// The Laravel Framework
```

메서드의 두 번째 인수로 중복 제거할 다른 문자를 지정할 수도 있습니다:

```php
use Illuminate\Support\Str;

$result = Str::deduplicate('The---Laravel---Framework', '-');

// The-Laravel-Framework
```


#### `Str::endsWith()` {#method-ends-with}

`Str::endsWith` 메서드는 주어진 문자열이 지정한 값으로 끝나는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::endsWith('This is my name', 'name');

// true
```

또한 값의 배열을 전달하여, 주어진 문자열이 배열 내의 값 중 하나로 끝나는지 확인할 수 있습니다:

```php
use Illuminate\Support\Str;

$result = Str::endsWith('This is my name', ['name', 'foo']);

// true

$result = Str::endsWith('This is my name', ['this', 'foo']);

// false
```


#### `Str::excerpt()` {#method-excerpt}

`Str::excerpt` 메서드는 주어진 문자열에서 특정 구문이 처음 등장하는 부분을 중심으로 발췌(excerpt)하여 반환합니다:

```php
use Illuminate\Support\Str;

$excerpt = Str::excerpt('This is my name', 'my', [
    'radius' => 3
]);

// '...is my na...'
```

`radius` 옵션은 기본값이 `100`이며, 잘린 문자열의 양쪽에 표시할 문자 수를 지정할 수 있습니다.

또한, `omission` 옵션을 사용하여 잘린 문자열 앞뒤에 붙일 문자열을 지정할 수 있습니다:

```php
use Illuminate\Support\Str;

$excerpt = Str::excerpt('This is my name', 'name', [
    'radius' => 3,
    'omission' => '(...) '
]);

// '(...) my name'
```


#### `Str::finish()` {#method-str-finish}

`Str::finish` 메서드는 주어진 문자열이 해당 값으로 끝나지 않을 경우, 해당 값을 문자열 끝에 한 번만 추가합니다:

```php
use Illuminate\Support\Str;

$adjusted = Str::finish('this/string', '/');

// this/string/

$adjusted = Str::finish('this/string/', '/');

// this/string/
```


#### `Str::headline()` {#method-str-headline}

`Str::headline` 메서드는 대소문자, 하이픈(-), 언더스코어(_)로 구분된 문자열을 각 단어의 첫 글자가 대문자인 공백으로 구분된 문자열로 변환합니다:

```php
use Illuminate\Support\Str;

$headline = Str::headline('steve_jobs');

// Steve Jobs

$headline = Str::headline('EmailNotificationSent');

// Email Notification Sent
```


#### `Str::inlineMarkdown()` {#method-str-inline-markdown}

`Str::inlineMarkdown` 메서드는 GitHub 스타일의 마크다운을 [CommonMark](https://commonmark.thephpleague.com/)를 사용하여 인라인 HTML로 변환합니다. 하지만 `markdown` 메서드와 달리, 생성된 모든 HTML을 블록 레벨 요소로 감싸지 않습니다:

```php
use Illuminate\Support\Str;

$html = Str::inlineMarkdown('**Laravel**');

// <strong>Laravel</strong>
```

#### 마크다운 보안

기본적으로 마크다운은 원시 HTML을 지원하므로, 원시 사용자 입력과 함께 사용할 경우 크로스 사이트 스크립팅(XSS) 취약점이 노출될 수 있습니다. [CommonMark 보안 문서](https://commonmark.thephpleague.com/security/)에 따르면, `html_input` 옵션을 사용하여 원시 HTML을 이스케이프하거나 제거할 수 있으며, `allow_unsafe_links` 옵션을 통해 안전하지 않은 링크의 허용 여부를 지정할 수 있습니다. 만약 일부 원시 HTML을 허용해야 한다면, 컴파일된 마크다운을 HTML Purifier를 통해 처리해야 합니다:

```php
use Illuminate\Support\Str;

Str::inlineMarkdown('Inject: <script>alert("Hello XSS!");</script>', [
    'html_input' => 'strip',
    'allow_unsafe_links' => false,
]);

// Inject: alert(&quot;Hello XSS!&quot;);
```


#### `Str::is()` {#method-str-is}

`Str::is` 메서드는 주어진 문자열이 특정 패턴과 일치하는지 확인합니다. 별표(*)는 와일드카드 값으로 사용할 수 있습니다:

```php
use Illuminate\Support\Str;

$matches = Str::is('foo*', 'foobar');

// true

$matches = Str::is('baz*', 'foobar');

// false
```

`ignoreCase` 인수를 `true`로 설정하여 대소문자 구분을 비활성화할 수 있습니다:

```php
use Illuminate\Support\Str;

$matches = Str::is('*.jpg', 'photo.JPG', ignoreCase: true);

// true
```


#### `Str::isAscii()` {#method-str-is-ascii}

`Str::isAscii` 메서드는 주어진 문자열이 7비트 ASCII인지 확인합니다:

```php
use Illuminate\Support\Str;

$isAscii = Str::isAscii('Taylor');

// true

$isAscii = Str::isAscii('ü');

// false
```


#### `Str::isJson()` {#method-str-is-json}

`Str::isJson` 메서드는 주어진 문자열이 유효한 JSON인지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::isJson('[1,2,3]');

// true

$result = Str::isJson('{"first": "John", "last": "Doe"}');

// true

$result = Str::isJson('{first: "John", last: "Doe"}');

// false
```


#### `Str::isUrl()` {#method-str-is-url}

`Str::isUrl` 메서드는 주어진 문자열이 유효한 URL인지 확인합니다:

```php
use Illuminate\Support\Str;

$isUrl = Str::isUrl('http://example.com');

// true

$isUrl = Str::isUrl('laravel');

// false
```

`isUrl` 메서드는 다양한 프로토콜을 유효한 것으로 간주합니다. 그러나, 유효하다고 간주할 프로토콜을 배열로 지정하여 `isUrl` 메서드에 전달할 수도 있습니다:

```php
$isUrl = Str::isUrl('http://example.com', ['http', 'https']);
```


#### `Str::isUlid()` {#method-str-is-ulid}

`Str::isUlid` 메서드는 주어진 문자열이 유효한 ULID인지 확인합니다:

```php
use Illuminate\Support\Str;

$isUlid = Str::isUlid('01gd6r360bp37zj17nxb55yv40');

// true

$isUlid = Str::isUlid('laravel');

// false
```


#### `Str::isUuid()` {#method-str-is-uuid}

`Str::isUuid` 메서드는 주어진 문자열이 유효한 UUID인지 확인합니다:

```php
use Illuminate\Support\Str;

$isUuid = Str::isUuid('a0a2a2d2-0b87-4a18-83f2-2529882be2de');

// true

$isUuid = Str::isUuid('laravel');

// false
```


#### `Str::kebab()` {#method-kebab-case}

`Str::kebab` 메서드는 주어진 문자열을 `kebab-case`로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::kebab('fooBar');

// foo-bar
```


#### `Str::lcfirst()` {#method-str-lcfirst}

`Str::lcfirst` 메서드는 주어진 문자열의 첫 번째 문자를 소문자로 변환하여 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::lcfirst('Foo Bar');

// foo Bar
```


#### `Str::length()` {#method-str-length}

`Str::length` 메서드는 주어진 문자열의 길이를 반환합니다:

```php
use Illuminate\Support\Str;

$length = Str::length('Laravel');

// 7
```


#### `Str::limit()` {#method-str-limit}

`Str::limit` 메서드는 주어진 문자열을 지정한 길이로 잘라냅니다:

```php
use Illuminate\Support\Str;

$truncated = Str::limit('The quick brown fox jumps over the lazy dog', 20);

// The quick brown fox...
```

잘린 문자열 끝에 추가될 문자열을 변경하고 싶다면, 세 번째 인자를 메서드에 전달할 수 있습니다:

```php
$truncated = Str::limit('The quick brown fox jumps over the lazy dog', 20, ' (...)');

// The quick brown fox (...)
```

문자열을 자를 때 단어가 중간에 끊기지 않도록 하려면, `preserveWords` 인자를 사용할 수 있습니다. 이 인자가 `true`일 경우, 가장 가까운 완전한 단어 경계까지 문자열이 잘립니다:

```php
$truncated = Str::limit('The quick brown fox', 12, preserveWords: true);

// The quick...
```


#### `Str::lower()` {#method-str-lower}

`Str::lower` 메서드는 주어진 문자열을 소문자로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::lower('LARAVEL');

// laravel
```


#### `Str::markdown()` {#method-str-markdown}

`Str::markdown` 메서드는 GitHub 스타일의 마크다운을 [CommonMark](https://commonmark.thephpleague.com/)를 사용하여 HTML로 변환합니다:

```php
use Illuminate\Support\Str;

$html = Str::markdown('# Laravel');

// <h1>Laravel</h1>

$html = Str::markdown('# Taylor <b>Otwell</b>', [
    'html_input' => 'strip',
]);

// <h1>Taylor Otwell</h1>
```

#### 마크다운 보안

기본적으로 마크다운은 원시 HTML을 지원하므로, 원시 사용자 입력과 함께 사용할 경우 크로스 사이트 스크립팅(XSS) 취약점에 노출될 수 있습니다. [CommonMark 보안 문서](https://commonmark.thephpleague.com/security/)에 따르면, `html_input` 옵션을 사용하여 원시 HTML을 이스케이프하거나 제거할 수 있으며, `allow_unsafe_links` 옵션을 통해 안전하지 않은 링크의 허용 여부를 지정할 수 있습니다. 만약 일부 원시 HTML을 허용해야 한다면, 컴파일된 마크다운을 HTML Purifier를 통해 처리하는 것이 좋습니다.

```php
use Illuminate\Support\Str;

Str::markdown('Inject: <script>alert("Hello XSS!");</script>', [
    'html_input' => 'strip',
    'allow_unsafe_links' => false,
]);

// <p>Inject: alert(&quot;Hello XSS!&quot;);</p>
```


#### `Str::mask()` {#method-str-mask}

`Str::mask` 메서드는 문자열의 일부를 반복된 문자로 마스킹(가림)하여, 이메일 주소나 전화번호와 같은 문자열의 일부 구간을 숨기고자 할 때 사용할 수 있습니다.

```php
use Illuminate\Support\Str;

$string = Str::mask('taylor@example.com', '*', 3);

// tay***************
```

필요하다면, `mask` 메서드의 세 번째 인자에 음수를 전달할 수 있습니다. 이 경우 문자열의 끝에서부터 지정한 거리만큼 떨어진 위치에서 마스킹을 시작합니다:

```php
$string = Str::mask('taylor@example.com', '*', -15, 3);

// tay***@example.com
```


#### `Str::match()` {#method-str-match}

`Str::match` 메서드는 주어진 정규 표현식 패턴과 일치하는 문자열의 일부를 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::match('/bar/', 'foo bar');

// 'bar'

$result = Str::match('/foo (.*)/', 'foo bar');

// 'bar'
```


#### `Str::matchAll()` {#method-str-match-all}

`Str::matchAll` 메서드는 주어진 정규 표현식 패턴과 일치하는 문자열의 부분들을 포함하는 컬렉션을 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::matchAll('/bar/', 'bar foo bar');

// collect(['bar', 'bar'])
```

표현식 내에 매칭 그룹을 지정하면, Laravel은 첫 번째 매칭 그룹에 해당하는 값들의 컬렉션을 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::matchAll('/f(\w*)/', 'bar fun bar fly');

// collect(['un', 'ly']);
```

일치하는 값이 없으면 빈 컬렉션이 반환됩니다.


#### `Str::orderedUuid()` {#method-str-ordered-uuid}

`Str::orderedUuid` 메서드는 "타임스탬프 우선" UUID를 생성하며, 이는 인덱싱된 데이터베이스 컬럼에 효율적으로 저장될 수 있습니다. 이 메서드를 사용하여 생성된 각 UUID는 이전에 이 메서드로 생성된 UUID 뒤에 정렬됩니다:

```php
use Illuminate\Support\Str;

return (string) Str::orderedUuid();
```


#### `Str::padBoth()` {#method-str-padboth}

`Str::padBoth` 메서드는 PHP의 `str_pad` 함수를 감싸며, 문자열의 양쪽을 다른 문자열로 채워 최종 문자열이 원하는 길이에 도달할 때까지 패딩합니다:

```php
use Illuminate\Support\Str;

$padded = Str::padBoth('James', 10, '_');

// '__James___'

$padded = Str::padBoth('James', 10);

// '  James   '
```


#### `Str::padLeft()` {#method-str-padleft}

`Str::padLeft` 메서드는 PHP의 `str_pad` 함수를 감싸며, 문자열의 왼쪽을 다른 문자열로 채워 최종 문자열이 원하는 길이에 도달할 때까지 패딩합니다:

```php
use Illuminate\Support\Str;

$padded = Str::padLeft('James', 10, '-=');

// '-=-=-James'

$padded = Str::padLeft('James', 10);

// '     James'
```


#### `Str::padRight()` {#method-str-padright}

`Str::padRight` 메서드는 PHP의 `str_pad` 함수를 감싸며, 문자열의 오른쪽을 다른 문자열로 채워 최종 문자열이 원하는 길이에 도달할 때까지 패딩합니다:

```php
use Illuminate\Support\Str;

$padded = Str::padRight('James', 10, '-');

// 'James-----'

$padded = Str::padRight('James', 10);

// 'James     '
```


#### `Str::password()` {#method-str-password}

`Str::password` 메서드는 지정한 길이의 안전하고 무작위인 비밀번호를 생성하는 데 사용할 수 있습니다. 생성된 비밀번호는 문자, 숫자, 기호, 공백의 조합으로 이루어집니다. 기본적으로 비밀번호는 32자 길이로 생성됩니다:

```php
use Illuminate\Support\Str;

$password = Str::password();

// 'EbJo2vE-AS:U,$%_gkrV4n,q~1xy/-_4'

$password = Str::password(12);

// 'qwuar>#V|i]N'
```


#### `Str::plural()` {#method-str-plural}

`Str::plural` 메서드는 단수 형태의 문자열을 복수형으로 변환합니다. 이 함수는 [Laravel의 복수화 도구가 지원하는 모든 언어](/laravel/12.x/localization#pluralization-language)를 지원합니다:

```php
use Illuminate\Support\Str;

$plural = Str::plural('car');

// cars

$plural = Str::plural('child');

// children
```

함수의 두 번째 인수로 정수를 전달하여 문자열의 단수 또는 복수형을 가져올 수 있습니다:

```php
use Illuminate\Support\Str;

$plural = Str::plural('child', 2);

// children

$singular = Str::plural('child', 1);

// child
```


#### `Str::pluralStudly()` {#method-str-plural-studly}

`Str::pluralStudly` 메서드는 StudlyCaps(카멜 케이스의 각 단어가 대문자로 시작하는 형식)로 작성된 단수 단어 문자열을 복수형으로 변환합니다. 이 함수는 [Laravel의 복수화 도구가 지원하는 모든 언어](/laravel/12.x/localization#pluralization-language)를 지원합니다:

```php
use Illuminate\Support\Str;

$plural = Str::pluralStudly('VerifiedHuman');

// VerifiedHumans

$plural = Str::pluralStudly('UserFeedback');

// UserFeedback
```

두 번째 인수로 정수를 전달하여 문자열의 단수 또는 복수형을 가져올 수 있습니다:

```php
use Illuminate\Support\Str;

$plural = Str::pluralStudly('VerifiedHuman', 2);

// VerifiedHumans

$singular = Str::pluralStudly('VerifiedHuman', 1);

// VerifiedHuman
```


#### `Str::position()` {#method-str-position}

`Str::position` 메서드는 문자열에서 특정 하위 문자열이 처음으로 등장하는 위치를 반환합니다. 만약 하위 문자열이 주어진 문자열에 존재하지 않으면, `false`를 반환합니다:

```php
use Illuminate\Support\Str;

$position = Str::position('Hello, World!', 'Hello');

// 0

$position = Str::position('Hello, World!', 'W');

// 7
```


#### `Str::random()` {#method-str-random}

`Str::random` 메서드는 지정된 길이만큼의 랜덤 문자열을 생성합니다. 이 함수는 PHP의 `random_bytes` 함수를 사용합니다:

```php
use Illuminate\Support\Str;

$random = Str::random(40);
```

테스트 중에는 `Str::random` 메서드가 반환하는 값을 "가짜"로 설정하는 것이 유용할 수 있습니다. 이를 위해 `createRandomStringsUsing` 메서드를 사용할 수 있습니다:

```php
Str::createRandomStringsUsing(function () {
    return 'fake-random-string';
});
```

`random` 메서드가 다시 정상적으로 랜덤 문자열을 생성하도록 하려면, `createRandomStringsNormally` 메서드를 호출하면 됩니다:

```php
Str::createRandomStringsNormally();
```


#### `Str::remove()` {#method-str-remove}

`Str::remove` 메서드는 주어진 값 또는 값의 배열을 문자열에서 제거합니다:

```php
use Illuminate\Support\Str;

$string = 'Peter Piper picked a peck of pickled peppers.';

$removed = Str::remove('e', $string);

// Ptr Pipr pickd a pck of pickld ppprs.
```

문자열을 제거할 때 대소문자를 구분하지 않으려면 세 번째 인자로 `false`를 전달할 수 있습니다.


#### `Str::repeat()` {#method-str-repeat}

`Str::repeat` 메서드는 주어진 문자열을 반복합니다:

```php
use Illuminate\Support\Str;

$string = 'a';

$repeat = Str::repeat($string, 5);

// aaaaa
```


#### `Str::replace()` {#method-str-replace}

`Str::replace` 메서드는 문자열 내에서 주어진 문자열을 다른 문자열로 교체합니다:

```php
use Illuminate\Support\Str;

$string = 'Laravel 11.x';

$replaced = Str::replace('11.x', '12.x', $string);

// Laravel 12.x
```

`replace` 메서드는 `caseSensitive` 인자도 받을 수 있습니다. 기본적으로 `replace` 메서드는 대소문자를 구분합니다:

```php
$replaced = Str::replace(
    'php',
    'Laravel',
    'PHP Framework for Web Artisans',
    caseSensitive: false
);

// Laravel Framework for Web Artisans
```


#### `Str::replaceArray()` {#method-str-replace-array}

`Str::replaceArray` 메서드는 문자열에서 주어진 값을 배열을 사용해 순차적으로 교체합니다:

```php
use Illuminate\Support\Str;

$string = 'The event will take place between ? and ?';

$replaced = Str::replaceArray('?', ['8:30', '9:00'], $string);

// The event will take place between 8:30 and 9:00
```


#### `Str::replaceFirst()` {#method-str-replace-first}

`Str::replaceFirst` 메서드는 문자열에서 주어진 값이 처음으로 나타나는 부분만을 다른 값으로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::replaceFirst('the', 'a', 'the quick brown fox jumps over the lazy dog');

// a quick brown fox jumps over the lazy dog
```


#### `Str::replaceLast()` {#method-str-replace-last}

`Str::replaceLast` 메서드는 문자열에서 주어진 값의 마지막 발생을 다른 값으로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::replaceLast('the', 'a', 'the quick brown fox jumps over the lazy dog');

// the quick brown fox jumps over a lazy dog
```


#### `Str::replaceMatches()` {#method-str-replace-matches}

`Str::replaceMatches` 메서드는 주어진 패턴과 일치하는 문자열의 모든 부분을 지정한 문자열로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::replaceMatches(
    pattern: '/[^A-Za-z0-9]++/',
    replace: '',
    subject: '(+1) 501-555-1000'
);

// '15015551000'
```

`replaceMatches` 메서드는 또한 클로저를 인자로 받을 수 있습니다. 이 경우, 주어진 패턴과 일치하는 문자열의 각 부분에 대해 클로저가 호출되며, 클로저 내에서 대체 로직을 수행하고 대체할 값을 반환할 수 있습니다:

```php
use Illuminate\Support\Str;

$replaced = Str::replaceMatches('/\d/', function (array $matches) {
    return '['.$matches[0].']';
}, '123');

// '[1][2][3]'
```


#### `Str::replaceStart()` {#method-str-replace-start}

`Str::replaceStart` 메서드는 주어진 값이 문자열의 시작 부분에 나타날 때만, 그 첫 번째 발생을 다른 값으로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::replaceStart('Hello', 'Laravel', 'Hello World');

// Laravel World

$replaced = Str::replaceStart('World', 'Laravel', 'Hello World');

// Hello World
```


#### `Str::replaceEnd()` {#method-str-replace-end}

`Str::replaceEnd` 메서드는 주어진 값이 문자열의 끝에 나타날 경우에만, 그 마지막 발생을 지정한 값으로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::replaceEnd('World', 'Laravel', 'Hello World');

// Hello Laravel

$replaced = Str::replaceEnd('Hello', 'Laravel', 'Hello World');

// Hello World
```


#### `Str::reverse()` {#method-str-reverse}

`Str::reverse` 메서드는 주어진 문자열을 뒤집습니다:

```php
use Illuminate\Support\Str;

$reversed = Str::reverse('Hello World');

// dlroW olleH
```


#### `Str::singular()` {#method-str-singular}

`Str::singular` 메서드는 문자열을 단수형으로 변환합니다. 이 함수는 [Laravel의 복수화 도구가 지원하는 모든 언어](/laravel/12.x/localization#pluralization-language)를 지원합니다:

```php
use Illuminate\Support\Str;

$singular = Str::singular('cars');

// car

$singular = Str::singular('children');

// child
```


#### `Str::slug()` {#method-str-slug}

`Str::slug` 메서드는 주어진 문자열로부터 URL에 적합한 "슬러그(slug)"를 생성합니다:

```php
use Illuminate\Support\Str;

$slug = Str::slug('Laravel 5 Framework', '-');

// laravel-5-framework
```


#### `Str::snake()` {#method-snake-case}

`Str::snake` 메서드는 주어진 문자열을 `snake_case`로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::snake('fooBar');

// foo_bar

$converted = Str::snake('fooBar', '-');

// foo-bar
```


#### `Str::squish()` {#method-str-squish}

`Str::squish` 메서드는 문자열에서 불필요한 모든 공백을 제거합니다. 단어 사이의 불필요한 공백도 포함됩니다:

```php
use Illuminate\Support\Str;

$string = Str::squish('    laravel    framework    ');

// laravel framework
```


#### `Str::start()` {#method-str-start}

`Str::start` 메서드는 주어진 값이 문자열의 시작에 없을 경우, 해당 값을 한 번만 문자열 앞에 추가합니다:

```php
use Illuminate\Support\Str;

$adjusted = Str::start('this/string', '/');

// /this/string

$adjusted = Str::start('/this/string', '/');

// /this/string
```


#### `Str::startsWith()` {#method-starts-with}

`Str::startsWith` 메서드는 주어진 문자열이 지정한 값으로 시작하는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::startsWith('This is my name', 'This');

// true
```

값의 배열이 전달되면, `startsWith` 메서드는 문자열이 배열에 있는 값 중 하나로 시작하면 `true`를 반환합니다:

```php
$result = Str::startsWith('This is my name', ['This', 'That', 'There']);

// true
```


#### `Str::studly()` {#method-studly-case}

`Str::studly` 메서드는 주어진 문자열을 `StudlyCase`(카멜 케이스의 첫 글자도 대문자인 형태)로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::studly('foo_bar');

// FooBar
```


#### `Str::substr()` {#method-str-substr}

`Str::substr` 메서드는 start와 length 파라미터로 지정된 문자열의 일부를 반환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::substr('The Laravel Framework', 4, 7);

// Laravel
```


#### `Str::substrCount()` {#method-str-substrcount}

`Str::substrCount` 메서드는 주어진 문자열에서 특정 값이 몇 번 등장하는지 반환합니다:

```php
use Illuminate\Support\Str;

$count = Str::substrCount('If you like ice cream, you will like snow cones.', 'like');

// 2
```


#### `Str::substrReplace()` {#method-str-substrreplace}

`Str::substrReplace` 메서드는 문자열의 일부를 지정한 위치(세 번째 인자)에서 시작하여, 네 번째 인자로 지정한 문자 수만큼을 대체합니다. 네 번째 인자에 `0`을 전달하면 기존 문자열을 대체하지 않고, 지정한 위치에 문자열을 삽입합니다:

```php
use Illuminate\Support\Str;

$result = Str::substrReplace('1300', ':', 2);
// 13:

$result = Str::substrReplace('1300', ':', 2, 0);
// 13:00
```


#### `Str::swap()` {#method-str-swap}

`Str::swap` 메서드는 PHP의 `strtr` 함수를 사용하여 주어진 문자열에서 여러 값을 한 번에 치환합니다:

```php
use Illuminate\Support\Str;

$string = Str::swap([
    'Tacos' => 'Burritos',
    'great' => 'fantastic',
], 'Tacos are great!');

// Burritos are fantastic!
```


#### `Str::take()` {#method-take}

`Str::take` 메서드는 문자열의 시작 부분에서 지정한 개수만큼의 문자를 반환합니다:

```php
use Illuminate\Support\Str;

$taken = Str::take('Build something amazing!', 5);

// Build
```


#### `Str::title()` {#method-title-case}

`Str::title` 메서드는 주어진 문자열을 `Title Case`(각 단어의 첫 글자가 대문자인 형태)로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::title('a nice title uses the correct case');

// A Nice Title Uses The Correct Case
```


#### `Str::toBase64()` {#method-str-to-base64}

`Str::toBase64` 메서드는 주어진 문자열을 Base64로 변환합니다:

```php
use Illuminate\Support\Str;

$base64 = Str::toBase64('Laravel');

// TGFyYXZlbA==
```


#### `Str::transliterate()` {#method-str-transliterate}

`Str::transliterate` 메서드는 주어진 문자열을 가장 가까운 ASCII 표현으로 변환하려고 시도합니다:

```php
use Illuminate\Support\Str;

$email = Str::transliterate('ⓣⓔⓢⓣ@ⓛⓐⓡⓐⓥⓔⓛ.ⓒⓞⓜ');

// 'test@laravel.com'
```


#### `Str::trim()` {#method-str-trim}

`Str::trim` 메서드는 주어진 문자열의 시작과 끝에서 공백(또는 다른 문자)을 제거합니다. PHP의 기본 `trim` 함수와 달리, `Str::trim` 메서드는 유니코드 공백 문자도 함께 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::trim(' foo bar ');

// 'foo bar'
```


#### `Str::ltrim()` {#method-str-ltrim}

`Str::ltrim` 메서드는 주어진 문자열의 시작 부분에서 공백(또는 다른 문자들)을 제거합니다. PHP의 기본 `ltrim` 함수와 달리, `Str::ltrim` 메서드는 유니코드 공백 문자도 함께 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::ltrim('  foo bar  ');

// 'foo bar  '
```


#### `Str::rtrim()` {#method-str-rtrim}

`Str::rtrim` 메서드는 주어진 문자열의 끝에서 공백(또는 다른 문자들)을 제거합니다. PHP의 기본 `rtrim` 함수와 달리, `Str::rtrim` 메서드는 유니코드 공백 문자도 함께 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::rtrim('  foo bar  ');

// '  foo bar'
```


#### `Str::ucfirst()` {#method-str-ucfirst}

`Str::ucfirst` 메서드는 주어진 문자열의 첫 번째 문자를 대문자로 변환하여 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::ucfirst('foo bar');

// Foo bar
```


#### `Str::ucsplit()` {#method-str-ucsplit}

`Str::ucsplit` 메서드는 주어진 문자열을 대문자 문자를 기준으로 배열로 분할합니다:

```php
use Illuminate\Support\Str;

$segments = Str::ucsplit('FooBar');

// [0 => 'Foo', 1 => 'Bar']
```


#### `Str::upper()` {#method-str-upper}

`Str::upper` 메서드는 주어진 문자열을 모두 대문자로 변환합니다:

```php
use Illuminate\Support\Str;

$string = Str::upper('laravel');

// LARAVEL
```


#### `Str::ulid()` {#method-str-ulid}

`Str::ulid` 메서드는 ULID(시간 순서가 보장되는 고유 식별자)를 생성합니다:

```php
use Illuminate\Support\Str;

return (string) Str::ulid();

// 01gd6r360bp37zj17nxb55yv40
```

특정 ULID가 생성된 날짜와 시간을 나타내는 `Illuminate\Support\Carbon` 날짜 인스턴스를 얻고 싶다면, Laravel의 Carbon 통합에서 제공하는 `createFromId` 메서드를 사용할 수 있습니다:

```php
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

$date = Carbon::createFromId((string) Str::ulid());
```

테스트 중에 `Str::ulid` 메서드가 반환하는 값을 "가짜"로 설정하고 싶을 때는, `createUlidsUsing` 메서드를 사용할 수 있습니다:

```php
use Symfony\Component\Uid\Ulid;

Str::createUlidsUsing(function () {
    return new Ulid('01HRDBNHHCKNW2AK4Z29SN82T9');
});
```

`ulid` 메서드가 다시 정상적으로 ULID를 생성하도록 하려면, `createUlidsNormally` 메서드를 호출하면 됩니다:

```php
Str::createUlidsNormally();
```


#### `Str::unwrap()` {#method-str-unwrap}

`Str::unwrap` 메서드는 주어진 문자열의 시작과 끝에서 지정한 문자열을 제거합니다:

```php
use Illuminate\Support\Str;

Str::unwrap('-Laravel-', '-');

// Laravel

Str::unwrap('{framework: "Laravel"}', '{', '}');

// framework: "Laravel"
```


#### `Str::uuid()` {#method-str-uuid}

`Str::uuid` 메서드는 UUID(버전 4)를 생성합니다:

```php
use Illuminate\Support\Str;

return (string) Str::uuid();
```

테스트 중에는 `Str::uuid` 메서드가 반환하는 값을 "가짜"로 설정하는 것이 유용할 수 있습니다. 이를 위해 `createUuidsUsing` 메서드를 사용할 수 있습니다:

```php
use Ramsey\Uuid\Uuid;

Str::createUuidsUsing(function () {
    return Uuid::fromString('eadbfeac-5258-45c2-bab7-ccb9b5ef74f9');
});
```

`uuid` 메서드가 다시 정상적으로 UUID를 생성하도록 하려면, `createUuidsNormally` 메서드를 호출하면 됩니다:

```php
Str::createUuidsNormally();
```


#### `Str::uuid7()` {#method-str-uuid7}

`Str::uuid7` 메서드는 UUID(버전 7)를 생성합니다:

```php
use Illuminate\Support\Str;

return (string) Str::uuid7();
```

선택적으로 `DateTimeInterface`를 파라미터로 전달할 수 있으며, 이를 사용하여 순서가 지정된 UUID를 생성할 수 있습니다:

```php
return (string) Str::uuid7(time: now());
```


#### `Str::wordCount()` {#method-str-word-count}

`Str::wordCount` 메서드는 문자열에 포함된 단어의 개수를 반환합니다:

```php
use Illuminate\Support\Str;

Str::wordCount('Hello, world!'); // 2
```


#### `Str::wordWrap()` {#method-str-word-wrap}

`Str::wordWrap` 메서드는 문자열을 지정한 글자 수로 줄바꿈합니다:

```php
use Illuminate\Support\Str;

$text = "The quick brown fox jumped over the lazy dog.";

Str::wordWrap($text, characters: 20, break: "<br />\n");

/*
The quick brown fox<br />
jumped over the lazy<br />
dog.
*/
```


#### `Str::words()` {#method-str-words}

`Str::words` 메서드는 문자열의 단어 수를 제한합니다. 세 번째 인자를 통해 잘린 문자열 끝에 어떤 문자열을 추가할지 지정할 수 있습니다:

```php
use Illuminate\Support\Str;

return Str::words('Perfectly balanced, as all things should be.', 3, ' >>>');

// Perfectly balanced, as >>>
```


#### `Str::wrap()` {#method-str-wrap}

`Str::wrap` 메서드는 주어진 문자열을 추가 문자열 또는 문자열 쌍으로 감쌉니다:

```php
use Illuminate\Support\Str;

Str::wrap('Laravel', '"');

// "Laravel"

Str::wrap('is', before: 'This ', after: ' Laravel!');

// This is Laravel!
```


#### `str()` {#method-str}

`str` 함수는 주어진 문자열의 새로운 `Illuminate\Support\Stringable` 인스턴스를 반환합니다. 이 함수는 `Str::of` 메서드와 동일합니다:

```php
$string = str('Taylor')->append(' Otwell');

// 'Taylor Otwell'
```

만약 `str` 함수에 인자가 제공되지 않으면, 이 함수는 `Illuminate\Support\Str`의 인스턴스를 반환합니다:

```php
$snake = str()->snake('FooBar');

// 'foo_bar'
```


#### `trans()` {#method-trans}

`trans` 함수는 주어진 번역 키를 [언어 파일](/laravel/12.x/localization)를 사용하여 번역합니다:

```php
echo trans('messages.welcome');
```

지정한 번역 키가 존재하지 않을 경우, `trans` 함수는 해당 키 자체를 반환합니다. 따라서 위의 예시에서 번역 키가 존재하지 않으면 `trans` 함수는 `messages.welcome`을 반환합니다.


#### `trans_choice()` {#method-trans-choice}

`trans_choice` 함수는 주어진 번역 키를 복수형 규칙에 따라 번역합니다:

```php
echo trans_choice('messages.notifications', $unreadCount);
```

지정한 번역 키가 존재하지 않을 경우, `trans_choice` 함수는 해당 키를 그대로 반환합니다. 따라서 위의 예시에서 번역 키가 존재하지 않으면 `trans_choice` 함수는 `messages.notifications`를 반환하게 됩니다.


## Fluent Strings {#fluent-strings}

Fluent 문자열은 문자열 값을 다루기 위한 보다 유창하고 객체 지향적인 인터페이스를 제공합니다. 이를 통해 기존의 문자열 연산 방식에 비해 더 읽기 쉬운 문법으로 여러 문자열 연산을 체이닝하여 사용할 수 있습니다.


#### `after` {#method-fluent-str-after}

`after` 메서드는 문자열에서 지정한 값 이후의 모든 내용을 반환합니다. 만약 지정한 값이 문자열 내에 존재하지 않으면 전체 문자열이 반환됩니다:

```php
use Illuminate\Support\Str;

$slice = Str::of('This is my name')->after('This is');

// ' my name'
```


#### `afterLast` {#method-fluent-str-after-last}

`afterLast` 메서드는 문자열에서 주어진 값이 마지막으로 등장한 이후의 모든 내용을 반환합니다. 만약 해당 값이 문자열에 존재하지 않으면 전체 문자열을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::of('App\Http\Controllers\Controller')->afterLast('\\');

// 'Controller'
```


#### `apa` {#method-fluent-str-apa}

`apa` 메서드는 주어진 문자열을 [APA 가이드라인](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)에 따라 타이틀 케이스로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('a nice title uses the correct case')->apa();

// A Nice Title Uses the Correct Case
```


#### `append` {#method-fluent-str-append}

`append` 메서드는 주어진 값을 문자열에 덧붙입니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Taylor')->append(' Otwell');

// 'Taylor Otwell'
```


#### `ascii` {#method-fluent-str-ascii}

`ascii` 메서드는 문자열을 ASCII 값으로 음역(Transliterate)하려고 시도합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('ü')->ascii();

// 'u'
```


#### `basename` {#method-fluent-str-basename}

`basename` 메서드는 주어진 문자열의 마지막 이름 부분(파일명 등)을 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('/foo/bar/baz')->basename();

// 'baz'
```

필요하다면, 마지막 부분에서 제거할 "확장자"를 지정할 수도 있습니다:

```php
use Illuminate\Support\Str;

$string = Str::of('/foo/bar/baz.jpg')->basename('.jpg');

// 'baz'
```


#### `before` {#method-fluent-str-before}

`before` 메서드는 문자열에서 지정한 값 이전의 모든 내용을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::of('This is my name')->before('my name');

// 'This is '
```


#### `beforeLast` {#method-fluent-str-before-last}

`beforeLast` 메서드는 문자열에서 주어진 값이 마지막으로 등장하기 전까지의 모든 내용을 반환합니다:

```php
use Illuminate\Support\Str;

$slice = Str::of('This is my name')->beforeLast('is');

// 'This '
```


#### `between` {#method-fluent-str-between}

`between` 메서드는 두 값 사이에 있는 문자열의 일부를 반환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('This is my name')->between('This', 'name');

// ' is my '
```


#### `betweenFirst` {#method-fluent-str-between-first}

`betweenFirst` 메서드는 두 값 사이에 있는 문자열 중 가장 작은 부분을 반환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('[a] bc [d]')->betweenFirst('[', ']');

// 'a'
```


#### `camel` {#method-fluent-str-camel}

`camel` 메서드는 주어진 문자열을 `camelCase`로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('foo_bar')->camel();

// 'fooBar'
```


#### `charAt` {#method-fluent-str-char-at}

`charAt` 메서드는 지정한 인덱스에 있는 문자를 반환합니다. 만약 인덱스가 범위를 벗어나면 `false`를 반환합니다:

```php
use Illuminate\Support\Str;

$character = Str::of('This is my name.')->charAt(6);

// 's'
```


#### `classBasename` {#method-fluent-str-class-basename}

`classBasename` 메서드는 주어진 클래스의 네임스페이스를 제거한 클래스 이름만 반환합니다:

```php
use Illuminate\Support\Str;

$class = Str::of('Foo\Bar\Baz')->classBasename();

// 'Baz'
```


#### `chopStart` {#method-fluent-str-chop-start}

`chopStart` 메서드는 주어진 값이 문자열의 시작 부분에 있을 때, 그 값의 첫 번째 등장만을 제거합니다:

```php
use Illuminate\Support\Str;

$url = Str::of('https://laravel.com')->chopStart('https://');

// 'laravel.com'
```

배열을 전달할 수도 있습니다. 만약 문자열이 배열에 있는 값들 중 하나로 시작한다면, 해당 값이 문자열에서 제거됩니다:

```php
use Illuminate\Support\Str;

$url = Str::of('http://laravel.com')->chopStart(['https://', 'http://']);

// 'laravel.com'
```


#### `chopEnd` {#method-fluent-str-chop-end}

`chopEnd` 메서드는 주어진 값이 문자열의 끝에 있을 경우, 마지막에 등장하는 해당 값만을 제거합니다:

```php
use Illuminate\Support\Str;

$url = Str::of('https://laravel.com')->chopEnd('.com');

// 'https://laravel'
```

배열을 전달할 수도 있습니다. 만약 문자열이 배열에 있는 값 중 하나로 끝난다면, 해당 값이 문자열에서 제거됩니다:

```php
use Illuminate\Support\Str;

$url = Str::of('http://laravel.com')->chopEnd(['.com', '.io']);

// 'http://laravel'
```


#### `contains` {#method-fluent-str-contains}

`contains` 메서드는 주어진 문자열이 특정 값을 포함하고 있는지 확인합니다. 기본적으로 이 메서드는 대소문자를 구분합니다:

```php
use Illuminate\Support\Str;

$contains = Str::of('This is my name')->contains('my');

// true
```

배열을 전달하여, 주어진 문자열이 배열 내의 값 중 하나라도 포함하는지 확인할 수도 있습니다:

```php
use Illuminate\Support\Str;

$contains = Str::of('This is my name')->contains(['my', 'foo']);

// true
```

`ignoreCase` 인자를 `true`로 설정하면 대소문자를 구분하지 않도록 할 수 있습니다:

```php
use Illuminate\Support\Str;

$contains = Str::of('This is my name')->contains('MY', ignoreCase: true);

// true
```


#### `containsAll` {#method-fluent-str-contains-all}

`containsAll` 메서드는 주어진 문자열이 주어진 배열의 모든 값을 포함하고 있는지 확인합니다:

```php
use Illuminate\Support\Str;

$containsAll = Str::of('This is my name')->containsAll(['my', 'name']);

// true
```

대소문자 구분을 비활성화하려면 `ignoreCase` 인수를 `true`로 설정하면 됩니다:

```php
use Illuminate\Support\Str;

$containsAll = Str::of('This is my name')->containsAll(['MY', 'NAME'], ignoreCase: true);

// true
```


#### `decrypt` {#method-fluent-str-decrypt}

`decrypt` 메서드는 암호화된 문자열을 [복호화](/laravel/12.x/encryption)합니다:

```php
use Illuminate\Support\Str;

$decrypted = $encrypted->decrypt();

// 'secret'
```

`decrypt`의 반대 동작을 원한다면 [encrypt](#method-fluent-str-encrypt) 메서드를 참고하세요.


#### `deduplicate` {#method-fluent-str-deduplicate}

`deduplicate` 메서드는 주어진 문자열에서 연속적으로 나타나는 특정 문자를 하나의 문자로 대체합니다. 기본적으로 이 메서드는 공백을 중복 제거합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('The   Laravel   Framework')->deduplicate();

// The Laravel Framework
```

메서드의 두 번째 인수로 중복 제거할 다른 문자를 지정할 수도 있습니다:

```php
use Illuminate\Support\Str;

$result = Str::of('The---Laravel---Framework')->deduplicate('-');

// The-Laravel-Framework
```


#### `dirname` {#method-fluent-str-dirname}

`dirname` 메서드는 주어진 문자열에서 상위 디렉터리 부분을 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('/foo/bar/baz')->dirname();

// '/foo/bar'
```

필요하다면, 문자열에서 몇 단계의 디렉터리 레벨을 잘라낼지 지정할 수 있습니다:

```php
use Illuminate\Support\Str;

$string = Str::of('/foo/bar/baz')->dirname(2);

// '/foo'
```


#### `encrypt` {#method-fluent-str-encrypt}

`encrypt` 메서드는 문자열을 [암호화](/laravel/12.x/encryption)합니다:

```php
use Illuminate\Support\Str;

$encrypted = Str::of('secret')->encrypt();
```

`encrypt`의 반대 동작을 원한다면 [decrypt](#method-fluent-str-decrypt) 메서드를 참고하세요.


#### `endsWith` {#method-fluent-str-ends-with}

`endsWith` 메서드는 주어진 문자열이 특정 값으로 끝나는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('This is my name')->endsWith('name');

// true
```

또한, 값의 배열을 전달하여 주어진 문자열이 배열 내의 값 중 하나로 끝나는지 확인할 수도 있습니다:

```php
use Illuminate\Support\Str;

$result = Str::of('This is my name')->endsWith(['name', 'foo']);

// true

$result = Str::of('This is my name')->endsWith(['this', 'foo']);

// false
```


#### `exactly` {#method-fluent-str-exactly}

`exactly` 메서드는 주어진 문자열이 다른 문자열과 정확히 일치하는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('Laravel')->exactly('Laravel');

// true
```


#### `excerpt` {#method-fluent-str-excerpt}

`excerpt` 메서드는 문자열에서 지정한 구문이 처음 등장하는 부분을 중심으로 발췌(excerpt)하여 반환합니다:

```php
use Illuminate\Support\Str;

$excerpt = Str::of('This is my name')->excerpt('my', [
    'radius' => 3
]);

// '...is my na...'
```

`radius` 옵션은 기본값이 `100`이며, 잘린 문자열의 양쪽에 표시할 문자 수를 지정할 수 있습니다.

또한, `omission` 옵션을 사용하면 잘린 문자열 앞뒤에 붙는 문자열을 변경할 수 있습니다:

```php
use Illuminate\Support\Str;

$excerpt = Str::of('This is my name')->excerpt('name', [
    'radius' => 3,
    'omission' => '(...) '
]);

// '(...) my name'
```


#### `explode` {#method-fluent-str-explode}

`explode` 메서드는 주어진 구분자로 문자열을 분할하여, 분할된 각 부분을 포함하는 컬렉션을 반환합니다:

```php
use Illuminate\Support\Str;

$collection = Str::of('foo bar baz')->explode(' ');

// collect(['foo', 'bar', 'baz'])
```


#### `finish` {#method-fluent-str-finish}

`finish` 메서드는 주어진 값이 문자열의 끝에 없을 경우, 해당 값을 문자열 끝에 한 번만 추가합니다:

```php
use Illuminate\Support\Str;

$adjusted = Str::of('this/string')->finish('/');

// this/string/

$adjusted = Str::of('this/string/')->finish('/');

// this/string/
```


#### `hash` {#method-fluent-str-hash}

`hash` 메서드는 주어진 [알고리즘](https://www.php.net/manual/en/function.hash-algos.php)을 사용하여 문자열을 해시합니다:

```php
use Illuminate\Support\Str;

$hashed = Str::of('secret')->hash(algorithm: 'sha256');

// '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b'
```


#### `headline` {#method-fluent-str-headline}

`headline` 메서드는 대소문자, 하이픈(-), 또는 언더스코어(_)로 구분된 문자열을 각 단어의 첫 글자가 대문자인 공백으로 구분된 문자열로 변환합니다:

```php
use Illuminate\Support\Str;

$headline = Str::of('taylor_otwell')->headline();

// Taylor Otwell

$headline = Str::of('EmailNotificationSent')->headline();

// Email Notification Sent
```


#### `inlineMarkdown` {#method-fluent-str-inline-markdown}

`inlineMarkdown` 메서드는 GitHub 스타일의 마크다운을 [CommonMark](https://commonmark.thephpleague.com/)를 사용하여 인라인 HTML로 변환합니다. 하지만 `markdown` 메서드와 달리, 생성된 모든 HTML을 블록 레벨 요소로 감싸지 않습니다:

```php
use Illuminate\Support\Str;

$html = Str::of('**Laravel**')->inlineMarkdown();

// <strong>Laravel</strong>
```

#### 마크다운 보안

기본적으로 마크다운은 원시 HTML을 지원하므로, 원시 사용자 입력과 함께 사용할 경우 크로스 사이트 스크립팅(XSS) 취약점이 노출될 수 있습니다. [CommonMark 보안 문서](https://commonmark.thephpleague.com/security/)에 따르면, `html_input` 옵션을 사용하여 원시 HTML을 이스케이프하거나 제거할 수 있으며, `allow_unsafe_links` 옵션을 통해 안전하지 않은 링크의 허용 여부를 지정할 수 있습니다. 만약 일부 원시 HTML을 허용해야 한다면, 컴파일된 마크다운을 HTML Purifier를 통해 처리해야 합니다:

```php
use Illuminate\Support\Str;

Str::of('Inject: <script>alert("Hello XSS!");</script>')->inlineMarkdown([
    'html_input' => 'strip',
    'allow_unsafe_links' => false,
]);

// Inject: alert(&quot;Hello XSS!&quot;);
```


#### `is` {#method-fluent-str-is}

`is` 메서드는 주어진 문자열이 특정 패턴과 일치하는지 확인합니다. 별표(*)는 와일드카드 값으로 사용할 수 있습니다.

```php
use Illuminate\Support\Str;

$matches = Str::of('foobar')->is('foo*');

// true

$matches = Str::of('foobar')->is('baz*');

// false
```


#### `isAscii` {#method-fluent-str-is-ascii}

`isAscii` 메서드는 주어진 문자열이 ASCII 문자열인지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('Taylor')->isAscii();

// true

$result = Str::of('ü')->isAscii();

// false
```


#### `isEmpty` {#method-fluent-str-is-empty}

`isEmpty` 메서드는 주어진 문자열이 비어 있는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('  ')->trim()->isEmpty();

// true

$result = Str::of('Laravel')->trim()->isEmpty();

// false
```


#### `isNotEmpty` {#method-fluent-str-is-not-empty}

`isNotEmpty` 메서드는 주어진 문자열이 비어 있지 않은지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('  ')->trim()->isNotEmpty();

// false

$result = Str::of('Laravel')->trim()->isNotEmpty();

// true
```


#### `isJson` {#method-fluent-str-is-json}

`isJson` 메서드는 주어진 문자열이 유효한 JSON인지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('[1,2,3]')->isJson();

// true

$result = Str::of('{"first": "John", "last": "Doe"}')->isJson();

// true

$result = Str::of('{first: "John", last: "Doe"}')->isJson();

// false
```


#### `isUlid` {#method-fluent-str-is-ulid}

`isUlid` 메서드는 주어진 문자열이 ULID인지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('01gd6r360bp37zj17nxb55yv40')->isUlid();

// true

$result = Str::of('Taylor')->isUlid();

// false
```


#### `isUrl` {#method-fluent-str-is-url}

`isUrl` 메서드는 주어진 문자열이 URL인지 여부를 판단합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('http://example.com')->isUrl();

// true

$result = Str::of('Taylor')->isUrl();

// false
```

`isUrl` 메서드는 다양한 프로토콜을 유효한 것으로 간주합니다. 그러나, 유효하다고 간주할 프로토콜을 배열로 지정하여 `isUrl` 메서드에 전달할 수도 있습니다:

```php
$result = Str::of('http://example.com')->isUrl(['http', 'https']);
```


#### `isUuid` {#method-fluent-str-is-uuid}

`isUuid` 메서드는 주어진 문자열이 UUID인지 여부를 판단합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('5ace9ab9-e9cf-4ec6-a19d-5881212a452c')->isUuid();

// true

$result = Str::of('Taylor')->isUuid();

// false
```


#### `kebab` {#method-fluent-str-kebab}

`kebab` 메서드는 주어진 문자열을 `kebab-case`로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('fooBar')->kebab();

// foo-bar
```


#### `lcfirst` {#method-fluent-str-lcfirst}

`lcfirst` 메서드는 주어진 문자열의 첫 번째 문자를 소문자로 변환하여 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Foo Bar')->lcfirst();

// foo Bar
```


#### `length` {#method-fluent-str-length}

`length` 메서드는 주어진 문자열의 길이를 반환합니다:

```php
use Illuminate\Support\Str;

$length = Str::of('Laravel')->length();

// 7
```


#### `limit` {#method-fluent-str-limit}

`limit` 메서드는 주어진 문자열을 지정한 길이로 잘라냅니다:

```php
use Illuminate\Support\Str;

$truncated = Str::of('The quick brown fox jumps over the lazy dog')->limit(20);

// The quick brown fox...
```

잘린 문자열 끝에 추가할 문자열을 두 번째 인수로 전달할 수도 있습니다:

```php
$truncated = Str::of('The quick brown fox jumps over the lazy dog')->limit(20, ' (...)');

// The quick brown fox (...)
```

문자열을 자를 때 단어가 중간에 끊기지 않도록 하려면 `preserveWords` 인수를 사용할 수 있습니다. 이 인수가 `true`이면, 가장 가까운 완전한 단어 경계까지 문자열이 잘립니다:

```php
$truncated = Str::of('The quick brown fox')->limit(12, preserveWords: true);

// The quick...
```


#### `lower` {#method-fluent-str-lower}

`lower` 메서드는 주어진 문자열을 소문자로 변환합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('LARAVEL')->lower();

// 'laravel'
```


#### `markdown` {#method-fluent-str-markdown}

`markdown` 메서드는 GitHub 스타일의 마크다운을 HTML로 변환합니다:

```php
use Illuminate\Support\Str;

$html = Str::of('# Laravel')->markdown();

// <h1>Laravel</h1>

$html = Str::of('# Taylor <b>Otwell</b>')->markdown([
    'html_input' => 'strip',
]);

// <h1>Taylor Otwell</h1>
```

#### 마크다운 보안

기본적으로 마크다운은 원시 HTML을 지원하므로, 원시 사용자 입력과 함께 사용할 경우 크로스 사이트 스크립팅(XSS) 취약점이 노출될 수 있습니다. [CommonMark 보안 문서](https://commonmark.thephpleague.com/security/)에 따르면, `html_input` 옵션을 사용하여 원시 HTML을 이스케이프하거나 제거할 수 있으며, `allow_unsafe_links` 옵션을 통해 안전하지 않은 링크의 허용 여부를 지정할 수 있습니다. 만약 일부 원시 HTML을 허용해야 한다면, 컴파일된 마크다운을 HTML Purifier를 통해 처리해야 합니다:

```php
use Illuminate\Support\Str;

Str::of('Inject: <script>alert("Hello XSS!");</script>')->markdown([
    'html_input' => 'strip',
    'allow_unsafe_links' => false,
]);

// <p>Inject: alert(&quot;Hello XSS!&quot;);</p>
```


#### `mask` {#method-fluent-str-mask}

`mask` 메서드는 문자열의 일부를 반복되는 문자로 마스킹(가림)하여, 이메일 주소나 전화번호와 같은 문자열의 일부 구간을 숨기는 데 사용할 수 있습니다:

```php
use Illuminate\Support\Str;

$string = Str::of('taylor@example.com')->mask('*', 3);

// tay***************
```

필요하다면, `mask` 메서드의 세 번째 또는 네 번째 인수로 음수를 전달할 수 있습니다. 이 경우 문자열의 끝에서부터 지정한 거리만큼 떨어진 위치에서 마스킹을 시작하게 됩니다:

```php
$string = Str::of('taylor@example.com')->mask('*', -15, 3);

// tay***@example.com

$string = Str::of('taylor@example.com')->mask('*', 4, -4);

// tayl**********.com
```


#### `match` {#method-fluent-str-match}

`match` 메서드는 주어진 정규 표현식 패턴과 일치하는 문자열의 일부를 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('foo bar')->match('/bar/');

// 'bar'

$result = Str::of('foo bar')->match('/foo (.*)/');

// 'bar'
```


#### `matchAll` {#method-fluent-str-match-all}

`matchAll` 메서드는 주어진 정규 표현식 패턴과 일치하는 문자열의 부분들을 포함하는 컬렉션을 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('bar foo bar')->matchAll('/bar/');

// collect(['bar', 'bar'])
```

표현식 내에 매칭 그룹을 지정하면, Laravel은 첫 번째 매칭 그룹에 해당하는 값들의 컬렉션을 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('bar fun bar fly')->matchAll('/f(\w*)/');

// collect(['un', 'ly']);
```

일치하는 값이 없으면 빈 컬렉션이 반환됩니다.


#### `isMatch` {#method-fluent-str-is-match}

`isMatch` 메서드는 문자열이 주어진 정규 표현식과 일치하면 `true`를 반환합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('foo bar')->isMatch('/foo (.*)/');

// true

$result = Str::of('laravel')->isMatch('/foo (.*)/');

// false
```


#### `newLine` {#method-fluent-str-new-line}

`newLine` 메서드는 문자열 끝에 "줄 바꿈" 문자를 추가합니다:

```php
use Illuminate\Support\Str;

$padded = Str::of('Laravel')->newLine()->append('Framework');

// 'Laravel
//  Framework'
```


#### `padBoth` {#method-fluent-str-padboth}

`padBoth` 메서드는 PHP의 `str_pad` 함수를 감싸며, 문자열의 양쪽을 다른 문자열로 채워 최종 문자열이 원하는 길이에 도달할 때까지 패딩합니다:

```php
use Illuminate\Support\Str;

$padded = Str::of('James')->padBoth(10, '_');

// '__James___'

$padded = Str::of('James')->padBoth(10);

// '  James   '
```


#### `padLeft` {#method-fluent-str-padleft}

`padLeft` 메서드는 PHP의 `str_pad` 함수를 감싸며, 문자열의 왼쪽을 다른 문자열로 채워 최종 문자열이 원하는 길이에 도달할 때까지 패딩합니다:

```php
use Illuminate\Support\Str;

$padded = Str::of('James')->padLeft(10, '-=');

// '-=-=-James'

$padded = Str::of('James')->padLeft(10);

// '     James'
```


#### `padRight` {#method-fluent-str-padright}

`padRight` 메서드는 PHP의 `str_pad` 함수를 감싸며, 문자열의 오른쪽을 다른 문자열로 채워 최종 문자열이 원하는 길이에 도달할 때까지 패딩합니다:

```php
use Illuminate\Support\Str;

$padded = Str::of('James')->padRight(10, '-');

// 'James-----'

$padded = Str::of('James')->padRight(10);

// 'James     '
```


#### `pipe` {#method-fluent-str-pipe}

`pipe` 메서드는 현재 문자열 값을 주어진 callable(콜백 함수)에 전달하여 문자열을 변환할 수 있게 해줍니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$hash = Str::of('Laravel')->pipe('md5')->prepend('Checksum: ');

// 'Checksum: a5c95b86291ea299fcbe64458ed12702'

$closure = Str::of('foo')->pipe(function (Stringable $str) {
    return 'bar';
});

// 'bar'
```


#### `plural` {#method-fluent-str-plural}

`plural` 메서드는 단수형 단어 문자열을 복수형으로 변환합니다. 이 함수는 [Laravel의 복수화 도구가 지원하는 모든 언어](/laravel/12.x/localization#pluralization-language)를 지원합니다:

```php
use Illuminate\Support\Str;

$plural = Str::of('car')->plural();

// cars

$plural = Str::of('child')->plural();

// children
```

함수의 두 번째 인수로 정수를 전달하여 문자열의 단수형 또는 복수형을 가져올 수 있습니다:

```php
use Illuminate\Support\Str;

$plural = Str::of('child')->plural(2);

// children

$plural = Str::of('child')->plural(1);

// child
```


#### `position` {#method-fluent-str-position}

`position` 메서드는 문자열에서 특정 하위 문자열이 처음으로 등장하는 위치를 반환합니다. 만약 하위 문자열이 문자열 내에 존재하지 않으면, `false`를 반환합니다:

```php
use Illuminate\Support\Str;

$position = Str::of('Hello, World!')->position('Hello');

// 0

$position = Str::of('Hello, World!')->position('W');

// 7
```


#### `prepend` {#method-fluent-str-prepend}

`prepend` 메서드는 주어진 값을 문자열 앞에 추가합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Framework')->prepend('Laravel ');

// Laravel Framework
```


#### `remove` {#method-fluent-str-remove}

`remove` 메서드는 주어진 값 또는 값의 배열을 문자열에서 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Arkansas is quite beautiful!')->remove('quite');

// Arkansas is beautiful!
```

또한 두 번째 인자로 `false`를 전달하면 문자열을 제거할 때 대소문자를 구분하지 않도록 할 수 있습니다.


#### `repeat` {#method-fluent-str-repeat}

`repeat` 메서드는 주어진 문자열을 반복합니다:

```php
use Illuminate\Support\Str;

$repeated = Str::of('a')->repeat(5);

// aaaaa
```


#### `replace` {#method-fluent-str-replace}

`replace` 메서드는 문자열 내에서 주어진 문자열을 다른 문자열로 교체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('Laravel 6.x')->replace('6.x', '7.x');

// Laravel 7.x
```

`replace` 메서드는 `caseSensitive` 인자도 받을 수 있습니다. 기본적으로 `replace` 메서드는 대소문자를 구분합니다:

```php
$replaced = Str::of('macOS 13.x')->replace(
    'macOS', 'iOS', caseSensitive: false
);
```


#### `replaceArray` {#method-fluent-str-replace-array}

`replaceArray` 메서드는 문자열에서 주어진 값을 배열의 값들로 순차적으로 교체합니다:

```php
use Illuminate\Support\Str;

$string = 'The event will take place between ? and ?';

$replaced = Str::of($string)->replaceArray('?', ['8:30', '9:00']);

// The event will take place between 8:30 and 9:00
```


#### `replaceFirst` {#method-fluent-str-replace-first}

`replaceFirst` 메서드는 문자열에서 주어진 값의 첫 번째 등장만을 다른 값으로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('the quick brown fox jumps over the lazy dog')->replaceFirst('the', 'a');

// a quick brown fox jumps over the lazy dog
```


#### `replaceLast` {#method-fluent-str-replace-last}

`replaceLast` 메서드는 문자열에서 주어진 값의 마지막 발생을 다른 값으로 교체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('the quick brown fox jumps over the lazy dog')->replaceLast('the', 'a');

// the quick brown fox jumps over a lazy dog
```


#### `replaceMatches` {#method-fluent-str-replace-matches}

`replaceMatches` 메서드는 주어진 패턴과 일치하는 문자열의 모든 부분을 지정한 대체 문자열로 교체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('(+1) 501-555-1000')->replaceMatches('/[^A-Za-z0-9]++/', '')

// '15015551000'
```

`replaceMatches` 메서드는 또한 클로저를 인자로 받을 수 있습니다. 이 경우, 패턴과 일치하는 문자열의 각 부분에 대해 클로저가 호출되며, 클로저 내에서 교체 로직을 수행하고 반환된 값으로 해당 부분이 대체됩니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('123')->replaceMatches('/\d/', function (array $matches) {
    return '['.$matches[0].']';
});

// '[1][2][3]'
```


#### `replaceStart` {#method-fluent-str-replace-start}

`replaceStart` 메서드는 주어진 값이 문자열의 시작 부분에 나타날 때만, 그 첫 번째 발생을 다른 값으로 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('Hello World')->replaceStart('Hello', 'Laravel');

// Laravel World

$replaced = Str::of('Hello World')->replaceStart('World', 'Laravel');

// Hello World
```


#### `replaceEnd` {#method-fluent-str-replace-end}

`replaceEnd` 메서드는 주어진 값이 문자열의 끝에 나타날 경우에만, 그 마지막 발생을 대체합니다:

```php
use Illuminate\Support\Str;

$replaced = Str::of('Hello World')->replaceEnd('World', 'Laravel');

// Hello Laravel

$replaced = Str::of('Hello World')->replaceEnd('Hello', 'Laravel');

// Hello World
```


#### `scan` {#method-fluent-str-scan}

`scan` 메서드는 [`sscanf` PHP 함수](https://www.php.net/manual/en/function.sscanf.php)에서 지원하는 형식에 따라 문자열에서 입력을 파싱하여 컬렉션으로 반환합니다:

```php
use Illuminate\Support\Str;

$collection = Str::of('filename.jpg')->scan('%[^.].%s');

// collect(['filename', 'jpg'])
```


#### `singular` {#method-fluent-str-singular}

`singular` 메서드는 문자열을 단수형으로 변환합니다. 이 함수는 [Laravel의 복수화 도구가 지원하는 모든 언어](/laravel/12.x/localization#pluralization-language)를 지원합니다:

```php
use Illuminate\Support\Str;

$singular = Str::of('cars')->singular();

// car

$singular = Str::of('children')->singular();

// child
```


#### `slug` {#method-fluent-str-slug}

`slug` 메서드는 주어진 문자열로부터 URL에 적합한 "슬러그(slug)"를 생성합니다:

```php
use Illuminate\Support\Str;

$slug = Str::of('Laravel Framework')->slug('-');

// laravel-framework
```


#### `snake` {#method-fluent-str-snake}

`snake` 메서드는 주어진 문자열을 `snake_case`로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('fooBar')->snake();

// foo_bar
```


#### `split` {#method-fluent-str-split}

`split` 메서드는 정규 표현식을 사용하여 문자열을 컬렉션으로 분할합니다:

```php
use Illuminate\Support\Str;

$segments = Str::of('one, two, three')->split('/[\s,]+/');

// collect(["one", "two", "three"])
```


#### `squish` {#method-fluent-str-squish}

`squish` 메서드는 문자열에서 불필요한 모든 공백을 제거합니다. 여기에는 단어 사이의 불필요한 공백도 포함됩니다:

```php
use Illuminate\Support\Str;

$string = Str::of('    laravel    framework    ')->squish();

// laravel framework
```


#### `start` {#method-fluent-str-start}

`start` 메서드는 주어진 값이 문자열의 시작 부분에 없을 경우, 해당 값을 문자열의 앞에 한 번만 추가합니다:

```php
use Illuminate\Support\Str;

$adjusted = Str::of('this/string')->start('/');

// /this/string

$adjusted = Str::of('/this/string')->start('/');

// /this/string
```


#### `startsWith` {#method-fluent-str-starts-with}

`startsWith` 메서드는 주어진 문자열이 지정한 값으로 시작하는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('This is my name')->startsWith('This');

// true
```


#### `stripTags` {#method-fluent-str-strip-tags}

`stripTags` 메서드는 문자열에서 모든 HTML 및 PHP 태그를 제거합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('<a href="https://laravel.com">Taylor <b>Otwell</b></a>')->stripTags();

// Taylor Otwell

$result = Str::of('<a href="https://laravel.com">Taylor <b>Otwell</b></a>')->stripTags('<b>');

// Taylor <b>Otwell</b>
```


#### `studly` {#method-fluent-str-studly}

`studly` 메서드는 주어진 문자열을 `StudlyCase`로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('foo_bar')->studly();

// FooBar
```


#### `substr` {#method-fluent-str-substr}

`substr` 메서드는 주어진 시작 위치와 길이 파라미터에 따라 문자열의 일부를 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Laravel Framework')->substr(8);

// Framework

$string = Str::of('Laravel Framework')->substr(8, 5);

// Frame
```


#### `substrReplace` {#method-fluent-str-substrreplace}

`substrReplace` 메서드는 문자열의 일부 구간에 있는 텍스트를 교체합니다. 두 번째 인자로 지정한 위치에서 시작하여, 세 번째 인자로 지정한 문자 수만큼을 교체합니다. 세 번째 인자에 `0`을 전달하면 기존 문자열의 문자를 교체하지 않고, 지정한 위치에 문자열을 삽입합니다.

```php
use Illuminate\Support\Str;

$string = Str::of('1300')->substrReplace(':', 2);

// 13:

$string = Str::of('The Framework')->substrReplace(' Laravel', 3, 0);

// The Laravel Framework
```


#### `swap` {#method-fluent-str-swap}

`swap` 메서드는 PHP의 `strtr` 함수를 사용하여 문자열 내 여러 값을 한 번에 치환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Tacos are great!')
    ->swap([
        'Tacos' => 'Burritos',
        'great' => 'fantastic',
    ]);

// Burritos are fantastic!
```


#### `take` {#method-fluent-str-take}

`take` 메서드는 문자열의 시작 부분에서 지정한 개수만큼의 문자를 반환합니다:

```php
use Illuminate\Support\Str;

$taken = Str::of('Build something amazing!')->take(5);

// Build
```


#### `tap` {#method-fluent-str-tap}

`tap` 메서드는 문자열을 주어진 클로저에 전달하여, 문자열 자체에는 영향을 주지 않으면서 문자열을 확인하고 조작할 수 있도록 해줍니다. 클로저에서 무엇을 반환하든 상관없이, `tap` 메서드는 원본 문자열을 반환합니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('Laravel')
    ->append(' Framework')
    ->tap(function (Stringable $string) {
        dump('String after append: '.$string);
    })
    ->upper();

// LARAVEL FRAMEWORK
```


#### `test` {#method-fluent-str-test}

`test` 메서드는 문자열이 주어진 정규 표현식 패턴과 일치하는지 확인합니다:

```php
use Illuminate\Support\Str;

$result = Str::of('Laravel Framework')->test('/Laravel/');

// true
```


#### `title` {#method-fluent-str-title}

`title` 메서드는 주어진 문자열을 `Title Case`(각 단어의 첫 글자가 대문자인 형태)로 변환합니다:

```php
use Illuminate\Support\Str;

$converted = Str::of('a nice title uses the correct case')->title();

// A Nice Title Uses The Correct Case
```


#### `toBase64` {#method-fluent-str-to-base64}

`toBase64` 메서드는 주어진 문자열을 Base64로 변환합니다:

```php
use Illuminate\Support\Str;

$base64 = Str::of('Laravel')->toBase64();

// TGFyYXZlbA==
```


#### `toHtmlString` {#method-fluent-str-to-html-string}

`toHtmlString` 메서드는 주어진 문자열을 `Illuminate\Support\HtmlString` 인스턴스로 변환합니다. 이렇게 변환된 문자열은 Blade 템플릿에서 렌더링될 때 이스케이프되지 않습니다.

```php
use Illuminate\Support\Str;

$htmlString = Str::of('Nuno Maduro')->toHtmlString();
```


#### `toUri` {#method-fluent-str-to-uri}

`toUri` 메서드는 주어진 문자열을 [Illuminate\Support\Uri](/laravel/12.x/helpers#uri) 인스턴스로 변환합니다:

```php
use Illuminate\Support\Str;

$uri = Str::of('https://example.com')->toUri();
```


#### `transliterate` {#method-fluent-str-transliterate}

`transliterate` 메서드는 주어진 문자열을 가장 가까운 ASCII 표현으로 변환하려고 시도합니다:

```php
use Illuminate\Support\Str;

$email = Str::of('ⓣⓔⓢⓣ@ⓛⓐⓡⓐⓥⓔⓛ.ⓒⓞⓜ')->transliterate()

// 'test@laravel.com'
```


#### `trim` {#method-fluent-str-trim}

`trim` 메서드는 주어진 문자열의 양쪽 공백을 제거합니다. PHP의 기본 `trim` 함수와 달리, Laravel의 `trim` 메서드는 유니코드 공백 문자도 함께 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('  Laravel  ')->trim();

// 'Laravel'

$string = Str::of('/Laravel/')->trim('/');

// 'Laravel'
```


#### `ltrim` {#method-fluent-str-ltrim}

`ltrim` 메서드는 문자열의 왼쪽(앞쪽) 공백을 제거합니다. PHP의 기본 `ltrim` 함수와 달리, Laravel의 `ltrim` 메서드는 유니코드 공백 문자도 함께 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('  Laravel  ')->ltrim();

// 'Laravel  '

$string = Str::of('/Laravel/')->ltrim('/');

// 'Laravel/'
```


#### `rtrim` {#method-fluent-str-rtrim}

`rtrim` 메서드는 주어진 문자열의 오른쪽(끝) 부분의 공백을 제거합니다. PHP의 기본 `rtrim` 함수와 달리, Laravel의 `rtrim` 메서드는 유니코드 공백 문자도 함께 제거합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('  Laravel  ')->rtrim();

// '  Laravel'

$string = Str::of('/Laravel/')->rtrim('/');

// '/Laravel'
```


#### `ucfirst` {#method-fluent-str-ucfirst}

`ucfirst` 메서드는 주어진 문자열의 첫 번째 문자를 대문자로 변환하여 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('foo bar')->ucfirst();

// Foo bar
```


#### `ucsplit` {#method-fluent-str-ucsplit}

`ucsplit` 메서드는 주어진 문자열을 대문자 문자를 기준으로 분할하여 컬렉션으로 반환합니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Foo Bar')->ucsplit();

// collect(['Foo', 'Bar'])
```


#### `unwrap` {#method-fluent-str-unwrap}

`unwrap` 메서드는 주어진 문자열의 시작과 끝에서 지정된 문자열을 제거합니다:

```php
use Illuminate\Support\Str;

Str::of('-Laravel-')->unwrap('-');

// Laravel

Str::of('{framework: "Laravel"}')->unwrap('{', '}');

// framework: "Laravel"
```


#### `upper` {#method-fluent-str-upper}

`upper` 메서드는 주어진 문자열을 모두 대문자로 변환합니다:

```php
use Illuminate\Support\Str;

$adjusted = Str::of('laravel')->upper();

// LARAVEL
```


#### `when` {#method-fluent-str-when}

`when` 메서드는 주어진 조건이 `true`일 때, 전달된 클로저를 실행합니다. 이 클로저는 플루언트 문자열 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('Taylor')
    ->when(true, function (Stringable $string) {
        return $string->append(' Otwell');
    });

// 'Taylor Otwell'
```

필요하다면, `when` 메서드의 세 번째 인자로 또 다른 클로저를 전달할 수 있습니다. 이 클로저는 조건 파라미터가 `false`로 평가될 때 실행됩니다.


#### `whenContains` {#method-fluent-str-when-contains}

`whenContains` 메서드는 문자열에 주어진 값이 포함되어 있을 때, 지정한 클로저를 실행합니다. 이 클로저는 유창한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('tony stark')
    ->whenContains('tony', function (Stringable $string) {
        return $string->title();
    });

// 'Tony Stark'
```

필요하다면, `when` 메서드의 세 번째 인자로 또 다른 클로저를 전달할 수 있습니다. 이 클로저는 문자열에 주어진 값이 포함되어 있지 않을 때 실행됩니다.

또한, 배열을 전달하여 주어진 문자열이 배열 내의 값 중 하나라도 포함하는지 확인할 수도 있습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('tony stark')
    ->whenContains(['tony', 'hulk'], function (Stringable $string) {
        return $string->title();
    });

// Tony Stark
```


#### `whenContainsAll` {#method-fluent-str-when-contains-all}

`whenContainsAll` 메서드는 문자열이 주어진 모든 하위 문자열을 포함하고 있을 때, 지정한 클로저를 실행합니다. 이 클로저는 유창한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('tony stark')
    ->whenContainsAll(['tony', 'stark'], function (Stringable $string) {
        return $string->title();
    });

// 'Tony Stark'
```

필요하다면, `when` 메서드의 세 번째 인자로 또 다른 클로저를 전달할 수 있습니다. 이 클로저는 조건 파라미터가 `false`로 평가될 때 실행됩니다.


#### `whenEmpty` {#method-fluent-str-when-empty}

`whenEmpty` 메서드는 문자열이 비어 있을 때 주어진 클로저를 실행합니다. 클로저가 값을 반환하면, 그 값이 `whenEmpty` 메서드의 반환값이 됩니다. 클로저가 값을 반환하지 않으면, fluent string 인스턴스가 반환됩니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('  ')->trim()->whenEmpty(function (Stringable $string) {
    return $string->prepend('Laravel');
});

// 'Laravel'
```


#### `whenNotEmpty` {#method-fluent-str-when-not-empty}

`whenNotEmpty` 메서드는 문자열이 비어 있지 않을 때 주어진 클로저를 실행합니다. 클로저가 값을 반환하면, 그 값이 `whenNotEmpty` 메서드의 반환값이 됩니다. 클로저가 값을 반환하지 않으면, fluent string 인스턴스가 반환됩니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('Framework')->whenNotEmpty(function (Stringable $string) {
    return $string->prepend('Laravel ');
});

// 'Laravel Framework'
```


#### `whenStartsWith` {#method-fluent-str-when-starts-with}

`whenStartsWith` 메서드는 문자열이 주어진 하위 문자열로 시작할 때, 지정한 클로저를 실행합니다. 이 클로저는 유창한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('disney world')->whenStartsWith('disney', function (Stringable $string) {
    return $string->title();
});

// 'Disney World'
```


#### `whenEndsWith` {#method-fluent-str-when-ends-with}

`whenEndsWith` 메서드는 문자열이 주어진 하위 문자열로 끝날 경우, 지정된 클로저를 실행합니다. 이 클로저는 유창한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('disney world')->whenEndsWith('world', function (Stringable $string) {
    return $string->title();
});

// 'Disney World'
```


#### `whenExactly` {#method-fluent-str-when-exactly}

`whenExactly` 메서드는 주어진 문자열이 정확히 일치할 때 지정한 클로저를 실행합니다. 이 클로저는 fluent string 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('laravel')->whenExactly('laravel', function (Stringable $string) {
    return $string->title();
});

// 'Laravel'
```


#### `whenNotExactly` {#method-fluent-str-when-not-exactly}

`whenNotExactly` 메서드는 주어진 문자열과 정확히 일치하지 않을 경우, 지정한 클로저를 실행합니다. 이 클로저는 유창한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('framework')->whenNotExactly('laravel', function (Stringable $string) {
    return $string->title();
});

// 'Framework'
```


#### `whenIs` {#method-fluent-str-when-is}

`whenIs` 메서드는 문자열이 주어진 패턴과 일치할 때 지정된 클로저를 실행합니다. 별표(*)는 와일드카드 값으로 사용할 수 있습니다. 클로저는 유연한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('foo/bar')->whenIs('foo/*', function (Stringable $string) {
    return $string->append('/baz');
});

// 'foo/bar/baz'
```


#### `whenIsAscii` {#method-fluent-str-when-is-ascii}

`whenIsAscii` 메서드는 문자열이 7비트 ASCII일 경우 주어진 클로저를 실행합니다. 이 클로저는 유창한 문자열(fluent string) 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('laravel')->whenIsAscii(function (Stringable $string) {
    return $string->title();
});

// 'Laravel'
```


#### `whenIsUlid` {#method-fluent-str-when-is-ulid}

`whenIsUlid` 메서드는 문자열이 유효한 ULID일 경우 주어진 클로저를 실행합니다. 이 클로저는 fluent string 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;

$string = Str::of('01gd6r360bp37zj17nxb55yv40')->whenIsUlid(function (Stringable $string) {
    return $string->substr(0, 8);
});

// '01gd6r36'
```


#### `whenIsUuid` {#method-fluent-str-when-is-uuid}

`whenIsUuid` 메서드는 문자열이 유효한 UUID일 경우, 주어진 클로저를 실행합니다. 이 클로저는 fluent string 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('a0a2a2d2-0b87-4a18-83f2-2529882be2de')->whenIsUuid(function (Stringable $string) {
    return $string->substr(0, 8);
});

// 'a0a2a2d2'
```


#### `whenTest` {#method-fluent-str-when-test}

`whenTest` 메서드는 주어진 정규 표현식과 문자열이 일치할 경우, 지정된 클로저를 실행합니다. 이 클로저는 fluent string 인스턴스를 인자로 받습니다:

```php
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

$string = Str::of('laravel framework')->whenTest('/laravel/', function (Stringable $string) {
    return $string->title();
});

// 'Laravel Framework'
```


#### `wordCount` {#method-fluent-str-word-count}

`wordCount` 메서드는 문자열에 포함된 단어의 개수를 반환합니다:

```php
use Illuminate\Support\Str;

Str::of('Hello, world!')->wordCount(); // 2
```


#### `words` {#method-fluent-str-words}

`words` 메서드는 문자열의 단어 수를 제한합니다. 필요하다면, 잘린 문자열 뒤에 추가로 붙일 문자열을 지정할 수 있습니다:

```php
use Illuminate\Support\Str;

$string = Str::of('Perfectly balanced, as all things should be.')->words(3, ' >>>');

// Perfectly balanced, as >>>
```


#### `wrap` {#method-fluent-str-wrap}

`wrap` 메서드는 주어진 문자열을 추가 문자열 또는 문자열 쌍으로 감쌉니다:

```php
use Illuminate\Support\Str;

Str::of('Laravel')->wrap('"');

// "Laravel"

Str::of('is')->wrap(before: 'This ', after: ' Laravel!');

// This is Laravel!
```
