---
title: ViewAction
---
# [액션.내장된액션] ViewAction
## 개요 {#overview}

Filament에는 Eloquent 레코드를 조회할 수 있는 내장된 액션이 포함되어 있습니다. 트리거 버튼을 클릭하면 모달이 열리고 그 안에 정보가 표시됩니다. Filament는 폼 필드를 사용하여 이 정보를 구조화합니다. 모든 폼 필드는 비활성화되어 있어 사용자가 수정할 수 없습니다. 다음과 같이 사용할 수 있습니다:

```php
use Filament\Actions\ViewAction;
use Filament\Forms\Components\TextInput;

ViewAction::make()
    ->record($this->post)
    ->form([
        TextInput::make('title')
            ->required()
            ->maxLength(255),
        // ...
    ])
```

테이블 행을 조회하고 싶다면, 대신 `Filament\Tables\Actions\ViewAction`을 사용할 수 있습니다:

```php
use Filament\Forms\Components\TextInput;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->actions([
            ViewAction::make()
                ->form([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255),
                    // ...
                ]),
        ]);
}
```

## 폼에 데이터를 채우기 전에 데이터 커스터마이징하기 {#customizing-data-before-filling-the-form}

레코드의 데이터를 폼에 채우기 전에 수정하고 싶을 수 있습니다. 이를 위해 `mutateRecordDataUsing()` 메서드를 사용하여 `$data` 배열을 수정하고, 수정된 버전을 폼에 채우기 전에 반환할 수 있습니다:

```php
ViewAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```