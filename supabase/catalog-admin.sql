-- Run as the project owner in Supabase SQL Editor after creating an operator
-- in Authentication > Users. This grants catalog access only, not user_settings.
-- Replace the email literal below with the operator's exact email address.
do $$
declare operator_id uuid;
begin
  select id into operator_id from auth.users where lower(email)=lower('관리자 이메일을 여기에 입력');
  if operator_id is null then raise exception '관리자 이메일을 찾지 못했습니다. Authentication에서 계정을 먼저 만들어 주세요.'; end if;
  insert into public.yocard_catalog_admins(user_id) values(operator_id) on conflict do nothing;
end $$;
