create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

revoke all on table public.user_settings from anon, authenticated;
grant select, insert, update, delete on table public.user_settings to authenticated;

drop policy if exists "Users can read own settings" on public.user_settings;
create policy "Users can read own settings"
on public.user_settings for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings"
on public.user_settings for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings"
on public.user_settings for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own settings" on public.user_settings;
create policy "Users can delete own settings"
on public.user_settings for delete
to authenticated
using ((select auth.uid()) = user_id);
