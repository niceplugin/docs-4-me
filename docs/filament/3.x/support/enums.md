---
title: Enums
---
# [핵심개념] 열거형(Enums)
## 개요 {#overview}

Enum은 고정된 상수 집합을 나타내는 특별한 PHP 클래스입니다. 이는 요일, 한 해의 월, 카드 덱의 무늬와 같이 가능한 값의 수가 제한된 개념을 모델링할 때 유용합니다.

Enum의 "case"는 enum 클래스의 인스턴스이므로, enum에 인터페이스를 추가하는 것은 매우 유용합니다. Filament는 enum에 추가할 수 있는 다양한 인터페이스를 제공하여, enum을 사용할 때의 경험을 향상시켜줍니다.

> Eloquent 모델에서 enum을 속성으로 사용할 때, [정확하게 캐스팅되었는지 확인](/laravel/12.x/eloquent-mutators#enum-casting)해 주세요.

## Enum 라벨 {#enum-labels}

`HasLabel` 인터페이스는 enum 인스턴스를 텍스트 라벨로 변환합니다. 이는 UI에서 사람이 읽을 수 있는 enum 값을 표시할 때 유용합니다.

```php
use Filament\Support\Contracts\HasLabel;

enum Status: string implements HasLabel
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getLabel(): ?string
    {
        return $this->name;
        
        // 또는
    
        return match ($this) {
            self::Draft => 'Draft',
            self::Reviewing => 'Reviewing',
            self::Published => 'Published',
            self::Rejected => 'Rejected',
        };
    }
}
```

### 폼 필드 옵션에서 enum 라벨 사용하기 {#using-the-enum-label-with-form-field-options}

`HasLabel` 인터페이스는 enum에서 옵션 배열을 생성하는 데 사용할 수 있으며, enum의 값이 키가 되고 enum의 라벨이 값이 됩니다. 이는 [`Select`](../forms/fields/select) 및 [`CheckboxList`](../forms/fields/checkbox-list)와 같은 Form Builder 필드, 그리고 Table Builder의 [`SelectColumn`](../tables/columns/select) 및 [`SelectFilter`](../tables/filters/select)에 적용됩니다:

```php
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Filters\SelectFilter;

Select::make('status')
    ->options(Status::class)

CheckboxList::make('status')
    ->options(Status::class)

Radio::make('status')
    ->options(Status::class)

SelectColumn::make('status')
    ->options(Status::class)

SelectFilter::make('status')
    ->options(Status::class)
```

이 예시들에서 `Status::class`는 `HasLabel`을 구현한 enum 클래스이며, 옵션은 다음과 같이 생성됩니다:

```php
[
    'draft' => 'Draft',
    'reviewing' => 'Reviewing',
    'published' => 'Published',
    'rejected' => 'Rejected',
]
```

### 테이블의 텍스트 컬럼에서 enum 라벨 사용하기 {#using-the-enum-label-with-a-text-column-in-your-table}

Table Builder에서 [`TextColumn`](../tables/columns/text)을 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasLabel` 인터페이스를 사용하여 enum의 원시 값 대신 라벨을 표시합니다.

### 테이블에서 그룹 타이틀로 enum 라벨 사용하기 {#using-the-enum-label-as-a-group-title-in-your-table}

Table Builder에서 [그룹화](../tables/grouping)를 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasLabel` 인터페이스를 사용하여 enum의 원시 값 대신 라벨을 표시합니다. 라벨은 [각 그룹의 타이틀](../tables/grouping#setting-a-group-title)로 표시됩니다.

### 인포리스트의 텍스트 항목에서 enum 라벨 사용하기 {#using-the-enum-label-with-a-text-entry-in-your-infolist}

Infolist Builder에서 [`TextEntry`](../infolists/entries/text)를 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasLabel` 인터페이스를 사용하여 enum의 원시 값 대신 라벨을 표시합니다.

## Enum 색상 {#enum-colors}

`HasColor` 인터페이스는 enum 인스턴스를 [색상](colors)으로 변환합니다. 이는 UI에서 색상이 적용된 enum 값을 표시할 때 유용합니다.

```php
use Filament\Support\Contracts\HasColor;

enum Status: string implements HasColor
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Reviewing => 'warning',
            self::Published => 'success',
            self::Rejected => 'danger',
        };
    }
}
```

### 테이블의 텍스트 컬럼에서 enum 색상 사용하기 {#using-the-enum-color-with-a-text-column-in-your-table}

Table Builder에서 [`TextColumn`](../tables/columns/text)을 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasColor` 인터페이스를 사용하여 enum 라벨을 해당 색상으로 표시합니다. 컬럼에서 [`badge()`](../tables/columns/text#displaying-as-a-badge) 메서드를 사용하는 것이 가장 좋습니다.

### 인포리스트의 텍스트 항목에서 enum 색상 사용하기 {#using-the-enum-color-with-a-text-entry-in-your-infolist}

Infolist Builder에서 [`TextEntry`](../infolists/entries/text)를 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasColor` 인터페이스를 사용하여 enum 라벨을 해당 색상으로 표시합니다. 항목에서 [`badge()`](../infolists/entries/text#displaying-as-a-badge) 메서드를 사용하는 것이 가장 좋습니다.

### 폼의 토글 버튼 필드에서 enum 색상 사용하기 {#using-the-enum-color-with-a-toggle-buttons-field-in-your-form}

Form Builder에서 [`ToggleButtons`](../forms/fields/toggle-buttons)를 사용하고, 옵션에 enum을 사용하도록 설정된 경우, Filament는 자동으로 `HasColor` 인터페이스를 사용하여 enum 라벨을 해당 색상으로 표시합니다.

## Enum 아이콘 {#enum-icons}

`HasIcon` 인터페이스는 enum 인스턴스를 [아이콘](icons)으로 변환합니다. 이는 UI에서 enum 값 옆에 아이콘을 표시할 때 유용합니다.

```php
use Filament\Support\Contracts\HasIcon;

enum Status: string implements HasIcon
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getIcon(): ?string
    {
        return match ($this) {
            self::Draft => 'heroicon-m-pencil',
            self::Reviewing => 'heroicon-m-eye',
            self::Published => 'heroicon-m-check',
            self::Rejected => 'heroicon-m-x-mark',
        };
    }
}
```

### 테이블의 텍스트 컬럼에서 enum 아이콘 사용하기 {#using-the-enum-icon-with-a-text-column-in-your-table}

Table Builder에서 [`TextColumn`](../tables/columns/text)을 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasIcon` 인터페이스를 사용하여 enum의 라벨 옆에 아이콘을 표시합니다. 컬럼에서 [`badge()`](../tables/columns/text#displaying-as-a-badge) 메서드를 사용하는 것이 가장 좋습니다.

### 인포리스트의 텍스트 항목에서 enum 아이콘 사용하기 {#using-the-enum-icon-with-a-text-entry-in-your-infolist}

Infolist Builder에서 [`TextEntry`](../infolists/entries/text)를 사용하고, Eloquent 모델에서 enum으로 캐스팅된 경우, Filament는 자동으로 `HasIcon` 인터페이스를 사용하여 enum의 라벨 옆에 아이콘을 표시합니다. 항목에서 [`badge()`](../infolists/entries/text#displaying-as-a-badge) 메서드를 사용하는 것이 가장 좋습니다.

### 폼의 토글 버튼 필드에서 enum 아이콘 사용하기 {#using-the-enum-icon-with-a-toggle-buttons-field-in-your-form}

Form Builder에서 [`ToggleButtons`](../forms/fields/toggle-buttons)를 사용하고, 옵션에 enum을 사용하도록 설정된 경우, Filament는 자동으로 `HasIcon` 인터페이스를 사용하여 enum의 라벨 옆에 아이콘을 표시합니다.

## Enum 설명 {#enum-descriptions}

`HasDescription` 인터페이스는 enum 인스턴스를 텍스트 설명으로 변환하며, 종종 [라벨](#enum-labels) 아래에 표시됩니다. 이는 UI에서 사람이 이해하기 쉬운 설명을 표시할 때 유용합니다.

```php
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasLabel;

enum Status: string implements HasLabel, HasDescription
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getLabel(): ?string
    {
        return $this->name;
    }
    
    public function getDescription(): ?string
    {
        return match ($this) {
            self::Draft => '아직 작성이 완료되지 않았습니다.',
            self::Reviewing => '스태프가 읽을 준비가 되었습니다.',
            self::Published => '스태프가 승인하였으며 웹사이트에 공개되었습니다.',
            self::Rejected => '스태프가 웹사이트에 적합하지 않다고 판단하였습니다.',
        };
    }
}
```

### 폼 필드 설명에서 enum 설명 사용하기 {#using-the-enum-description-with-form-field-descriptions}

`HasDescription` 인터페이스는 enum에서 설명 배열을 생성하는 데 사용할 수 있으며, enum의 값이 키가 되고 enum의 설명이 값이 됩니다. 이는 [`Radio`](../forms/fields/radio#setting-option-descriptions) 및 [`CheckboxList`](../forms/fields/checkbox-list#setting-option-descriptions)와 같은 Form Builder 필드에 적용됩니다:

```php
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options(Status::class)

CheckboxList::make('status')
    ->options(Status::class)
```
