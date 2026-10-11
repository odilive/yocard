# YOCARD Google 로그인 및 설정 동기화 연결

1. Supabase 프로젝트의 SQL Editor에서 `supabase/user-settings.sql`을 실행합니다.
2. Authentication의 URL Configuration에 아래 주소를 추가합니다.
   - Site URL: `https://odilive.github.io/yocard/`
   - Redirect URLs: `https://odilive.github.io/yocard/`
   - 로컬 테스트가 필요하면 사용하는 localhost 주소도 Redirect URLs에 추가합니다.
3. Project Settings > API에서 Project URL과 Publishable key를 확인합니다.
4. `data/supabase-config.js`의 `url`, `publishableKey`에 입력합니다.

## Google 로그인 연결

1. Google Cloud Console에서 프로젝트를 만들고 Google Auth Platform을 설정합니다.
2. Audience는 외부 사용자가 로그인할 수 있도록 구성합니다.
3. Data Access에는 `openid`, `userinfo.email`, `userinfo.profile` 범위만 사용합니다.
4. OAuth 클라이언트 유형은 `웹 애플리케이션`으로 만듭니다.
5. 승인된 JavaScript 원본에 `https://odilive.github.io`를 추가합니다.
6. 승인된 리디렉션 URI에 아래 Supabase 콜백 주소를 추가합니다.
   - `https://ftdaxsikxzeqsgbjdmab.supabase.co/auth/v1/callback`
7. 생성된 Client ID와 Client Secret을 Supabase의 Authentication > Sign In / Providers > Google에 입력하고 Google 제공자를 활성화합니다.

Google Client Secret은 Supabase 대시보드에만 입력하고 저장소나 브라우저 코드에 넣지 않습니다.

기존 이메일 링크 계정과 Google 계정의 확인된 이메일 주소가 같으면 Supabase가 같은 사용자로 자동 연결하므로 기존 설정을 이어서 사용할 수 있습니다.

`secret` 또는 예전 `service_role` 키는 브라우저 코드에 넣지 않습니다.
