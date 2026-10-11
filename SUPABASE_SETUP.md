# YOCARD 계정 및 설정 동기화 연결

1. Supabase 프로젝트의 SQL Editor에서 `supabase/user-settings.sql`을 실행합니다.
2. Authentication의 URL Configuration에 아래 주소를 추가합니다.
   - Site URL: `https://odilive.github.io/yocard/`
   - Redirect URLs: `https://odilive.github.io/yocard/`
   - 로컬 테스트가 필요하면 사용하는 localhost 주소도 Redirect URLs에 추가합니다.
3. Project Settings > API에서 Project URL과 Publishable key를 확인합니다.
4. `data/supabase-config.js`의 `url`, `publishableKey`에 입력합니다.

Authentication > Providers > Email에서 이메일·비밀번호 로그인을 사용합니다. 이메일 확인을 켜 두면 신규 회원은 가입 확인 메일을 한 번 확인한 뒤 로그인할 수 있습니다.

기존 이메일 링크 로그인으로 생성된 계정은 로그인 화면의 `비밀번호를 잊으셨나요?`를 눌러 비밀번호를 설정하면 같은 계정과 저장된 설정을 그대로 사용할 수 있습니다.

`secret` 또는 예전 `service_role` 키는 브라우저 코드에 넣지 않습니다.
