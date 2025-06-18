---
title: 스텁
---
# [핵심개념] 스텁
## 스텁 퍼블리싱하기 {#publishing-the-stubs}

Filament이 생성하는 파일을 커스터마이즈하고 싶다면, "스텁(stub)" 파일을 애플리케이션에 퍼블리싱할 수 있습니다. 이 스텁 파일들은 원하는 대로 수정할 수 있는 템플릿 파일입니다.

스텁 파일을 `stubs/filament` 디렉터리에 퍼블리싱하려면, 다음 명령어를 실행하세요:

```bash
php artisan vendor:publish --tag=filament-stubs
```