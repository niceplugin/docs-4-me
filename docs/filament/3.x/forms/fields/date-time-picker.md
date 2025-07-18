---
title: 날짜-시간 선택기
---
# [폼.필드] DateTimePicker

## 개요 {#overview}

날짜-시간 선택기는 날짜 및/또는 시간을 선택할 수 있는 인터랙티브한 인터페이스를 제공합니다.

```php
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TimePicker;

DateTimePicker::make('published_at')
DatePicker::make('date_of_birth')
TimePicker::make('alarm_at')
```

<AutoScreenshot name="forms/fields/date-time-picker/simple" alt="날짜 시간 선택기" version="3.x" />

## 저장 형식 커스터마이징 {#customizing-the-storage-format}

필드가 데이터베이스에 저장될 때의 형식을 `format()` 메서드를 사용하여 커스터마이즈할 수 있습니다. 이 메서드는 [PHP 날짜 형식 토큰](https://www.php.net/manual/en/datetime.format.php)을 사용하는 문자열 날짜 형식을 받습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->format('d/m/Y')
```

## 초 입력 비활성화 {#disabling-the-seconds-input}

시간 선택기를 사용할 때, `seconds(false)` 메서드를 사용하여 초 입력을 비활성화할 수 있습니다:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->seconds(false)
```

<AutoScreenshot name="forms/fields/date-time-picker/without-seconds" alt="초가 없는 날짜 시간 선택기" version="3.x" />

## 타임존 {#timezones}

사용자가 자신의 타임존에서 날짜를 관리할 수 있도록 하려면, `timezone()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->timezone('America/New_York')
```

날짜는 여전히 앱에 설정된 타임존을 사용하여 저장되지만, 날짜는 새로운 타임존으로 로드되고, 폼이 저장될 때 다시 변환됩니다.

## JavaScript 날짜 선택기 활성화 {#enabling-the-javascript-date-picker}

기본적으로 Filament는 네이티브 HTML5 날짜 선택기를 사용합니다. `native(false)` 메서드를 사용하여 더 커스터마이즈 가능한 JavaScript 날짜 선택기를 활성화할 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
```

<AutoScreenshot name="forms/fields/date-time-picker/javascript" alt="JavaScript 기반 날짜 시간 선택기" version="3.x" />

JavaScript 날짜 선택기는 접근성이 보장되지만, 네이티브 날짜 선택기와 동일한 방식으로 전체 키보드 입력을 지원하지 않습니다. 전체 키보드 입력이 필요하다면 네이티브 날짜 선택기를 사용해야 합니다.

### 표시 형식 커스터마이징 {#customizing-the-display-format}

필드가 데이터베이스에 저장될 때 사용되는 형식과 별도로, 필드의 표시 형식을 커스터마이즈할 수 있습니다. 이를 위해 `displayFormat()` 메서드를 사용하며, 이 또한 [PHP 날짜 형식 토큰](https://www.php.net/manual/en/datetime.format.php)을 사용하는 문자열 날짜 형식을 받습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
    ->displayFormat('d/m/Y')
```

<AutoScreenshot name="forms/fields/date-time-picker/display-format" alt="커스텀 표시 형식의 날짜 시간 선택기" version="3.x" />

렌더링 시 사용할 로케일을 앱 설정과 다르게 지정하고 싶다면, `locale()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
    ->displayFormat('d F Y')
    ->locale('fr')
```

### 시간 입력 간격 설정 {#configuring-the-time-input-intervals}

`hoursStep()`, `minutesStep()`, `secondsStep()` 메서드를 사용하여 시/분/초를 증가/감소시키는 입력 간격을 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->native(false)
    ->hoursStep(2)
    ->minutesStep(15)
    ->secondsStep(10)
```

### 한 주의 시작 요일 설정 {#configuring-the-first-day-of-the-week}

일부 국가에서는 한 주의 시작 요일이 월요일이 아닙니다. 날짜 선택기에서 한 주의 시작 요일을 커스터마이즈하려면, 컴포넌트에서 `firstDayOfWeek()` 메서드를 사용하세요. 0부터 7까지의 값이 허용되며, 1은 월요일, 7 또는 0은 일요일입니다:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->native(false)
    ->firstDayOfWeek(7)
```

<AutoScreenshot name="forms/fields/date-time-picker/week-starts-on-sunday" alt="일요일이 한 주의 시작인 날짜 시간 선택기" version="3.x" />

보다 의미 있게 한 주의 시작 요일을 설정할 수 있는 편리한 헬퍼 메서드도 있습니다:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('published_at')
    ->native(false)
    ->weekStartsOnMonday()

DateTimePicker::make('published_at')
    ->native(false)
    ->weekStartsOnSunday()
```

### 특정 날짜 비활성화 {#disabling-specific-dates}

특정 날짜가 선택되지 않도록 하려면:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('date')
    ->native(false)
    ->disabledDates(['2000-01-03', '2000-01-15', '2000-01-20'])
```

<AutoScreenshot name="forms/fields/date-time-picker/disabled-dates" alt="특정 날짜가 비활성화된 날짜 시간 선택기" version="3.x" />

### 날짜 선택 시 선택기 닫기 {#closing-the-picker-when-a-date-is-selected}

날짜를 선택했을 때 선택기를 닫으려면, `closeOnDateSelection()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\DateTimePicker;

DateTimePicker::make('date')
    ->native(false)
    ->closeOnDateSelection()
```

## datalist로 날짜 자동완성 {#autocompleting-dates-with-a-datalist}

[JavaScript 날짜 선택기](#enabling-the-javascript-date-picker)를 사용하지 않는 한, `datalist()` 메서드를 사용하여 날짜 선택기에 [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) 옵션을 지정할 수 있습니다:

```php
use Filament\Forms\Components\TimePicker;

TimePicker::make('appointment_at')
    ->datalist([
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
    ])
```

datalist는 사용자가 선택기를 사용할 때 자동완성 옵션을 제공합니다. 하지만 이는 단순히 추천일 뿐이며, 사용자는 여전히 입력란에 임의의 값을 입력할 수 있습니다. 사용자를 미리 정의된 옵션으로만 엄격하게 제한하고 싶다면, [select 필드](select)를 참고하세요.

## 필드 옆에 접두/접미 텍스트 추가 {#adding-affix-text-aside-the-field}

`prefix()`와 `suffix()` 메서드를 사용하여 입력란 앞뒤에 텍스트를 배치할 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date')
    ->prefix('Starts')
    ->suffix('at midnight')
```

<AutoScreenshot name="forms/fields/date-time-picker/affix" alt="접두/접미가 있는 날짜 시간 선택기" version="3.x" />

### 아이콘을 접두/접미로 사용하기 {#using-icons-as-affixes}

[아이콘](https://blade-ui-kit.com/blade-icons?set=1#search)을 입력란 앞뒤에 배치하려면, `prefixIcon()`과 `suffixIcon()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\TimePicker;

TimePicker::make('at')
    ->prefixIcon('heroicon-m-play')
```

<AutoScreenshot name="forms/fields/date-time-picker/prefix-icon" alt="접두 아이콘이 있는 날짜 시간 선택기" version="3.x" />

#### 접두/접미 아이콘 색상 설정 {#setting-the-affix-icons-color}

접두/접미 아이콘은 기본적으로 회색이지만, `prefixIconColor()`와 `suffixIconColor()` 메서드를 사용하여 다른 색상으로 설정할 수 있습니다:

```php
use Filament\Forms\Components\TimePicker;

TimePicker::make('at')
    ->prefixIcon('heroicon-m-check-circle')
    ->prefixIconColor('success')
```

## 필드를 읽기 전용으로 만들기 {#making-the-field-read-only}

[필드 비활성화](getting-started#disabling-a-field)와 혼동하지 마세요. `readonly()` 메서드를 사용하여 필드를 "읽기 전용"으로 만들 수 있습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->readonly()
```

이 설정은 네이티브 날짜 선택기에서만 적용된다는 점에 유의하세요. [JavaScript 날짜 선택기](#enabling-the-javascript-date-picker)를 사용하는 경우 [`disabled()`](getting-started#disabling-a-field)를 사용해야 합니다.

[`disabled()`](getting-started#disabling-a-field)와 비교했을 때 몇 가지 차이점이 있습니다:

- `readOnly()`를 사용할 때, 폼이 제출되면 필드가 여전히 서버로 전송됩니다. 브라우저 콘솔이나 JavaScript를 통해 변경될 수 있습니다. 이를 방지하려면 [`dehydrated(false)`](/filament/3.x/forms/advanced#preventing-a-field-from-being-dehydrated)를 사용할 수 있습니다.
- `readOnly()`를 사용할 때는 불투명도 감소와 같은 스타일 변화가 없습니다.
- `readOnly()`를 사용할 때 필드는 여전히 포커스가 가능합니다.

## 날짜-시간 선택기 유효성 검사 {#date-time-picker-validation}

[유효성 검사](../validation) 페이지에 나열된 모든 규칙 외에도, 날짜-시간 선택기에만 적용되는 추가 규칙이 있습니다.

### 최대/최소 날짜 유효성 검사 {#max-date-min-date-validation}

선택기에서 선택할 수 있는 최소 및 최대 날짜를 제한할 수 있습니다. `minDate()`와 `maxDate()` 메서드는 `DateTime` 인스턴스(예: `Carbon`) 또는 문자열을 받습니다:

```php
use Filament\Forms\Components\DatePicker;

DatePicker::make('date_of_birth')
    ->native(false)
    ->minDate(now()->subYears(150))
    ->maxDate(now())
```
