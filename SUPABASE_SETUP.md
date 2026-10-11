# YOCARD 설정 동기화 연결

1. Supabase 프로젝트의 SQL Editor에서 `supabase/user-settings.sql`을 실행합니다.
2. Authentication의 URL Configuration에 아래 주소를 추가합니다.
   - Site URL: `https://odilive.github.io/yocard/`
   - Redirect URLs: `https://odilive.github.io/yocard/`
   - 로컬 테스트가 필요하면 사용하는 localhost 주소도 Redirect URLs에 추가합니다.
3. Project Settings > API에서 Project URL과 Publishable key를 확인합니다.
4. `data/supabase-config.js`의 `url`, `publishableKey`에 입력합니다.

`secret` 또는 예전 `service_role` 키는 브라우저 코드에 넣지 않습니다.
