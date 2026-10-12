# YOCARD 동기화 코드 연결

1. Supabase 프로젝트의 SQL Editor에서 `supabase/user-settings.sql`을 실행합니다.
2. Authentication > Sign In / Providers에서 Email 제공자를 활성화합니다.
3. Email 제공자의 Confirm email은 비활성화합니다. 동기화 코드는 실제 이메일 주소를 사용하지 않으므로 확인 메일을 보내지 않습니다.
4. 새 사용자 가입 허용이 활성화되어 있는지 확인합니다.
5. Project Settings > API에서 Project URL과 Publishable key를 확인합니다.
6. `data/supabase-config.js`의 `url`, `publishableKey`에 입력합니다.

사용자는 이메일이나 비밀번호를 입력하지 않습니다. 앱이 16자리 동기화 코드를 생성하고, 내부에서만 코드로부터 Supabase Auth 자격 증명을 결정합니다. 코드는 Supabase에 원문으로 저장되지 않으며 기존 `user_settings` RLS 정책을 그대로 사용합니다.

기존 이메일·Google 로그인 계정의 데이터는 삭제하지 않습니다. 같은 브라우저에 예전 로그인 세션이 남아 있으면 첫 실행 때 설정을 로컬로 가져온 뒤 코드 방식으로 전환할 수 있습니다.

`secret` 또는 예전 `service_role` 키는 브라우저 코드에 넣지 않습니다.
