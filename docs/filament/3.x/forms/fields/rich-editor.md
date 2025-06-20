---
title: 리치 에디터
---
# [폼.필드] RichEditor

## 개요 {#overview}

리치 에디터를 사용하면 HTML 콘텐츠를 편집하고 미리 볼 수 있으며, 이미지를 업로드할 수도 있습니다.

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
```

<AutoScreenshot name="forms/fields/rich-editor/simple" alt="Rich editor" version="3.x" />

## 보안 {#security}

기본적으로 에디터는 원시 HTML을 출력하고, 이를 백엔드로 전송합니다. 공격자는 컴포넌트의 값을 가로채어 다른 원시 HTML 문자열을 백엔드로 보낼 수 있습니다. 따라서 리치 에디터에서 HTML을 출력할 때는 반드시 이를 정제(sanitize)해야 하며, 그렇지 않으면 사이트가 크로스 사이트 스크립팅(XSS) 취약점에 노출될 수 있습니다.

Filament가 `TextColumn` 및 `TextEntry`와 같은 컴포넌트에서 데이터베이스의 원시 HTML을 출력할 때는, 위험한 JavaScript를 제거하기 위해 이를 정제합니다. 그러나 리치 에디터의 HTML을 직접 Blade 뷰에서 출력하는 경우, 이를 정제하는 것은 개발자의 책임입니다. 한 가지 방법으로 Filament의 `sanitizeHtml()` 헬퍼를 사용할 수 있으며, 이는 위에서 언급한 컴포넌트에서 HTML을 정제할 때 사용하는 동일한 도구입니다:

```blade
{!! str($record->content)->sanitizeHtml() !!}
```

## 툴바 버튼 커스터마이징 {#customizing-the-toolbar-buttons}

에디터의 툴바 버튼은 `toolbarButtons()` 메서드를 사용하여 설정할 수 있습니다. 여기 표시된 옵션들이 기본값입니다. 이 외에도 `'h1'` 옵션을 사용할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->toolbarButtons([
        'attachFiles',
        'blockquote',
        'bold',
        'bulletList',
        'codeBlock',
        'h2',
        'h3',
        'italic',
        'link',
        'orderedList',
        'redo',
        'strike',
        'underline',
        'undo',
    ])
```

또는, `disableToolbarButtons()` 메서드를 사용하여 특정 버튼을 비활성화할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->disableToolbarButtons([
        'blockquote',
        'strike',
    ])
```

모든 툴바 버튼을 비활성화하려면, `toolbarButtons([])`로 빈 배열을 설정하거나 `disableAllToolbarButtons()`를 사용할 수 있습니다.

## 에디터에 이미지 업로드하기 {#uploading-images-to-the-editor}

설정 메서드를 사용하여 이미지 업로드 방식을 커스터마이즈할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->fileAttachmentsDisk('s3')
    ->fileAttachmentsDirectory('attachments')
    ->fileAttachmentsVisibility('private')
```

## Grammarly 검사 비활성화하기 {#disabling-grammarly-checks}

사용자가 Grammarly를 설치한 경우, 에디터의 내용을 분석하지 못하도록 하려면 `disableGrammarly()` 메서드를 사용할 수 있습니다:

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->disableGrammarly()
```
