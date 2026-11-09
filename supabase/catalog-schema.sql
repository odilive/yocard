-- YOCARD pilot catalog. Drafts only: does not read or modify user_settings.
begin;

create table if not exists public.yocard_catalog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.yocard_catalog_admins enable row level security;
revoke all on public.yocard_catalog_admins from public, anon, authenticated;
grant select on public.yocard_catalog_admins to authenticated;
drop policy if exists own_catalog_admin on public.yocard_catalog_admins;
create policy own_catalog_admin on public.yocard_catalog_admins for select to authenticated using (user_id=(select auth.uid()));

create or replace function public.yocard_is_catalog_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.yocard_catalog_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.yocard_is_catalog_admin() from public, anon;
grant execute on function public.yocard_is_catalog_admin() to authenticated;

create table if not exists public.yocard_catalog_targets (
  id text primary key,
  name text not null check (length(trim(name))>0),
  kind text not null check (kind in ('brand','industry','service','all','generic')),
  category text not null default ''
);
create table if not exists public.yocard_catalog_cards (
  id text primary key,
  name text not null check (length(trim(name))>0),
  issuer text not null check (length(trim(issuer))>0),
  kind text not null,
  reward_medium text not null,
  note text not null default '',
  review_status text not null default 'pending' check (review_status in ('pending','needs_review','reviewed')),
  review_note text not null default '',
  revision integer not null default 0 check (revision>=0),
  sources jsonb not null default '[]' check (jsonb_typeof(sources)='array'),
  source_snapshot jsonb not null check (jsonb_typeof(source_snapshot)='object'),
  valid_from date,
  valid_through date,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  check (valid_from is null or valid_through is null or valid_through>=valid_from)
);
create table if not exists public.yocard_catalog_benefits (
  id text primary key,
  card_id text not null references public.yocard_catalog_cards(id),
  display_name text not null check (length(trim(display_name))>0),
  reward_kind text not null check (reward_kind in ('discount','cashback','point','service')),
  rule_type text not null check (rule_type in ('percent','fixed','tiered','accumulated','service')),
  rate_percent numeric,
  reward_amount numeric,
  reward_unit text not null check (reward_unit in ('KRW','POINT','STAR','ITEM')),
  unit_amount numeric,
  min_spend_state text not null check (min_spend_state in ('value','none','unknown')),
  min_spend numeric,
  min_amount_state text not null check (min_amount_state in ('value','none','unknown')),
  min_amount numeric,
  channel text not null check (channel in ('any','online','offline')),
  payment_method text not null default '',
  product_scope text not null default '',
  notes text not null default '',
  eligibility_rules jsonb not null default '[]' check (jsonb_typeof(eligibility_rules)='array'),
  membership_policy jsonb not null default '{}' check (jsonb_typeof(membership_policy)='object'),
  rule_config jsonb not null check (jsonb_typeof(rule_config)='object' and rule_config->>'version'='1'),
  review_status text not null check (review_status in ('pending','needs_review','reviewed')),
  review_note text not null default '',
  sort_order integer not null,
  unique(card_id,id),
  check (rate_percent is null or rate_percent between 0 and 100),
  check (reward_amount is null or reward_amount>=0),
  check ((min_spend_state='value' and min_spend is not null and min_spend>=0) or (min_spend_state<>'value' and min_spend is null)),
  check ((min_amount_state='value' and min_amount is not null and min_amount>=0) or (min_amount_state<>'value' and min_amount is null)),
  check (rule_type<>'percent' or rate_percent is not null),
  check (rule_type<>'fixed' or reward_amount is not null),
  check (rule_type<>'accumulated' or (unit_amount is not null and unit_amount>0 and reward_amount is not null and rule_config->>'period'='month' and jsonb_typeof(rule_config->'carry_over')='boolean'))
);
create table if not exists public.yocard_catalog_benefit_targets (
  card_id text not null,
  benefit_id text not null,
  target_id text not null references public.yocard_catalog_targets(id),
  effect text not null check (effect in ('include','exclude')),
  primary key(benefit_id,target_id,effect),
  foreign key(card_id,benefit_id) references public.yocard_catalog_benefits(card_id,id) on delete cascade
);
create table if not exists public.yocard_catalog_limits (
  id text primary key,
  card_id text not null references public.yocard_catalog_cards(id),
  name text not null,
  scope text not null check (scope in ('shared','benefit')),
  period text not null check (period in ('transaction','day','month','half_year','year')),
  metric text not null check (metric in ('reward','spend','count')),
  unit text not null,
  state text not null check (state in ('value','unlimited','unknown')),
  tiers jsonb not null check (jsonb_typeof(tiers)='array' and (state<>'value' or jsonb_array_length(tiers)>0)),
  parent_id text,
  sort_order integer not null,
  unique(card_id,id),
  check ((metric='count' and unit='COUNT') or (metric='spend' and unit='KRW') or (metric='reward' and unit in ('KRW','POINT','STAR','ITEM'))),
  foreign key(card_id,parent_id) references public.yocard_catalog_limits(card_id,id) deferrable initially deferred,
  check (id<>parent_id)
);
create table if not exists public.yocard_catalog_limit_benefits (
  card_id text not null,
  limit_id text not null,
  benefit_id text not null,
  primary key(limit_id,benefit_id),
  foreign key(card_id,limit_id) references public.yocard_catalog_limits(card_id,id) on delete cascade,
  foreign key(card_id,benefit_id) references public.yocard_catalog_benefits(card_id,id) on delete cascade
);
create table if not exists public.yocard_catalog_relations (
  card_id text not null,
  benefit_id text not null,
  related_id text not null,
  kind text not null check (kind in ('add','replace','exclude')),
  primary key(benefit_id,related_id,kind),
  foreign key(card_id,benefit_id) references public.yocard_catalog_benefits(card_id,id) on delete cascade,
  foreign key(card_id,related_id) references public.yocard_catalog_benefits(card_id,id) on delete cascade,
  check (benefit_id<>related_id)
);
create table if not exists public.yocard_catalog_sections (
  id text primary key,
  card_id text not null references public.yocard_catalog_cards(id),
  title text not null,
  sort_order integer not null,
  unique(card_id,id)
);
create table if not exists public.yocard_catalog_section_benefits (
  card_id text not null,
  section_id text not null,
  benefit_id text not null,
  primary key(section_id,benefit_id),
  foreign key(card_id,section_id) references public.yocard_catalog_sections(card_id,id) on delete cascade,
  foreign key(card_id,benefit_id) references public.yocard_catalog_benefits(card_id,id) on delete cascade
);
create table if not exists public.yocard_catalog_revisions (
  card_id text not null references public.yocard_catalog_cards(id),
  revision integer not null,
  actor_id uuid not null references auth.users(id),
  saved_at timestamptz not null default now(),
  snapshot jsonb not null,
  primary key(card_id,revision)
);

-- Reads require an explicit operator grant; no client can update rows directly.
do $$ declare t text; begin
  foreach t in array array['targets','cards','benefits','benefit_targets','limits','limit_benefits','relations','sections','section_benefits','revisions'] loop
    execute format('alter table public.%I enable row level security','yocard_catalog_'||t);
    execute format('revoke all on public.%I from public, anon, authenticated','yocard_catalog_'||t);
    execute format('grant select on public.%I to authenticated','yocard_catalog_'||t);
    execute format('drop policy if exists catalog_operator_read on public.%I','yocard_catalog_'||t);
    execute format('create policy catalog_operator_read on public.%I for select to authenticated using ((select public.yocard_is_catalog_admin()))','yocard_catalog_'||t);
  end loop;
end $$;

create or replace function public.yocard_catalog_card(p_card_id text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare c public.yocard_catalog_cards; result jsonb;
begin
  if not public.yocard_is_catalog_admin() then raise exception 'Catalog administrator required' using errcode='42501'; end if;
  select * into c from public.yocard_catalog_cards where id=p_card_id;
  if not found then return null; end if;
  select jsonb_build_object(
    'schema_version',1,'card',to_jsonb(c),
    'benefits',coalesce((select jsonb_agg(to_jsonb(b)||jsonb_build_object('targets',coalesce((select jsonb_agg(jsonb_build_object('target_id',t.target_id,'effect',t.effect) order by t.target_id,t.effect) from public.yocard_catalog_benefit_targets t where t.benefit_id=b.id),'[]')) order by b.sort_order) from public.yocard_catalog_benefits b where b.card_id=p_card_id),'[]'),
    'limits',coalesce((select jsonb_agg(to_jsonb(l)||jsonb_build_object('benefit_ids',coalesce((select jsonb_agg(x.benefit_id order by x.benefit_id) from public.yocard_catalog_limit_benefits x where x.limit_id=l.id),'[]')) order by l.sort_order) from public.yocard_catalog_limits l where l.card_id=p_card_id),'[]'),
    'relations',coalesce((select jsonb_agg(jsonb_build_object('benefit_id',r.benefit_id,'related_id',r.related_id,'kind',r.kind) order by r.benefit_id,r.related_id,r.kind) from public.yocard_catalog_relations r where r.card_id=p_card_id),'[]'),
    'sections',coalesce((select jsonb_agg(to_jsonb(s)||jsonb_build_object('benefit_ids',coalesce((select jsonb_agg(x.benefit_id order by x.benefit_id) from public.yocard_catalog_section_benefits x where x.section_id=s.id),'[]')) order by s.sort_order) from public.yocard_catalog_sections s where s.card_id=p_card_id),'[]')
  ) into result;
  return result;
end $$;
revoke all on function public.yocard_catalog_card(text) from public, anon;
grant execute on function public.yocard_catalog_card(text) to authenticated;

create or replace function public.yocard_catalog_save(p_document jsonb, p_expected_revision integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  c jsonb := p_document->'card'; cid text := c->>'id';
  old_card public.yocard_catalog_cards; v_revision integer; source_data jsonb;
  item jsonb; child jsonb; tier jsonb; previous numeric; low numeric; high numeric; seen boolean;
  new_card public.yocard_catalog_cards; b public.yocard_catalog_benefits; l public.yocard_catalog_limits; s public.yocard_catalog_sections;
begin
  if not public.yocard_is_catalog_admin() then raise exception 'Catalog administrator required' using errcode='42501'; end if;
  if (p_document->>'schema_version') is distinct from '1' or cid is null or p_expected_revision is null then raise exception 'Invalid catalog document' using errcode='23514'; end if;
  -- Serializes saves including the first insert, without serializing other cards.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('yocard-catalog:'||cid));
  select * into old_card from public.yocard_catalog_cards where id=cid for update;
  if coalesce(old_card.revision,0)<>p_expected_revision then raise exception 'CATALOG_CONFLICT: reload the latest card' using errcode='40001'; end if;
  source_data := coalesce(old_card.source_snapshot,c->'source_snapshot');
  v_revision := coalesce(old_card.revision,0)+1;
  if jsonb_typeof(p_document->'benefits') is distinct from 'array' or jsonb_array_length(p_document->'benefits')=0 then raise exception 'Benefits required' using errcode='23514'; end if;
  if jsonb_typeof(p_document->'limits') is distinct from 'array' or jsonb_typeof(p_document->'relations') is distinct from 'array' or jsonb_typeof(p_document->'sections') is distinct from 'array' then raise exception 'Invalid catalog collections' using errcode='23514'; end if;
  new_card:=jsonb_populate_record(null::public.yocard_catalog_cards,c||jsonb_build_object('source_snapshot',source_data,'revision',v_revision,'updated_at',now(),'updated_by',auth.uid()));
  insert into public.yocard_catalog_cards select (new_card).* on conflict(id) do update set
    name=excluded.name,issuer=excluded.issuer,kind=excluded.kind,reward_medium=excluded.reward_medium,note=excluded.note,
    review_status=excluded.review_status,review_note=excluded.review_note,sources=excluded.sources,revision=excluded.revision,
    valid_from=excluded.valid_from,valid_through=excluded.valid_through,updated_at=excluded.updated_at,updated_by=excluded.updated_by;
  delete from public.yocard_catalog_sections where card_id=cid;
  delete from public.yocard_catalog_relations where card_id=cid;
  delete from public.yocard_catalog_limits where card_id=cid;
  delete from public.yocard_catalog_benefits where card_id=cid;
  for item in select value from jsonb_array_elements(p_document->'benefits') loop
    b:=jsonb_populate_record(null::public.yocard_catalog_benefits,item||jsonb_build_object('card_id',cid));
    if jsonb_typeof(item->'targets') is distinct from 'array' then raise exception 'Targets array required' using errcode='23514'; end if;
    for child in select value from jsonb_array_elements(b.eligibility_rules) loop
      if child->>'type' is distinct from 'military_salary' or jsonb_typeof(child->'value') is distinct from 'boolean' then raise exception 'Unsupported eligibility rule' using errcode='23514'; end if;
    end loop;
    if b.rule_type='tiered' then
      if jsonb_typeof(b.rule_config->'tiers') is distinct from 'array' or jsonb_array_length(b.rule_config->'tiers')=0 then raise exception 'Amount tiers required' using errcode='23514'; end if;
      previous:=null; seen:=false;
      for tier in select value from jsonb_array_elements(b.rule_config->'tiers') loop
        low:=(tier->>'min_amount')::numeric; high:=(tier->>'max_amount_exclusive')::numeric;
        if low is null or low<0 or (high is not null and high<=low) or (tier->>'rate_percent')::numeric is null or (tier->>'rate_percent')::numeric not between 0 and 100 or (seen and (previous is null or low<previous)) then raise exception 'Invalid or overlapping amount tiers' using errcode='23514'; end if;
        if (tier->>'daily_cap')::numeric<0 or (tier->>'monthly_cap')::numeric<0 then raise exception 'Invalid tier cap' using errcode='23514'; end if;
        previous:=high; seen:=true;
      end loop;
    end if;
    insert into public.yocard_catalog_benefits select (b).*;
    for child in select value from jsonb_array_elements(item->'targets') loop
      insert into public.yocard_catalog_benefit_targets(card_id,benefit_id,target_id,effect) values(cid,b.id,child->>'target_id',child->>'effect');
    end loop;
  end loop;
  for item in select value from jsonb_array_elements(p_document->'limits') loop
    l:=jsonb_populate_record(null::public.yocard_catalog_limits,item||jsonb_build_object('card_id',cid));
    previous:=null;
    for tier in select value from jsonb_array_elements(l.tiers) loop
      low:=(tier->>'min_spend')::numeric; high:=(tier->>'cap')::numeric;
      if low is null or high is null or low<0 or high<0 or (l.metric='count' and high<>trunc(high)) or (previous is not null and low<=previous) then raise exception 'Invalid limit tiers' using errcode='23514'; end if;
      previous:=low;
    end loop;
    insert into public.yocard_catalog_limits select (l).*;
    for child in select value from jsonb_array_elements(item->'benefit_ids') loop
      insert into public.yocard_catalog_limit_benefits values(cid,l.id,child#>>'{}');
      if l.metric='reward' and exists(select 1 from public.yocard_catalog_benefits where id=child#>>'{}' and card_id=cid and reward_unit<>l.unit) then raise exception 'Reward and limit units differ' using errcode='23514'; end if;
    end loop;
  end loop;
  if exists(with recursive walk(id,parent_id,path,cycle) as (
    select id,parent_id,array[id],false from public.yocard_catalog_limits where card_id=cid
    union all select p.id,p.parent_id,w.path||p.id,p.id=any(w.path) from walk w join public.yocard_catalog_limits p on p.id=w.parent_id and p.card_id=cid where not w.cycle
  ) select 1 from walk where cycle) then raise exception 'Limit cycle' using errcode='23514'; end if;
  for item in select value from jsonb_array_elements(p_document->'relations') loop
    insert into public.yocard_catalog_relations values(cid,item->>'benefit_id',item->>'related_id',item->>'kind');
  end loop;
  for item in select value from jsonb_array_elements(p_document->'sections') loop
    s:=jsonb_populate_record(null::public.yocard_catalog_sections,item||jsonb_build_object('card_id',cid));
    insert into public.yocard_catalog_sections select (s).*;
    for child in select value from jsonb_array_elements(item->'benefit_ids') loop
      insert into public.yocard_catalog_section_benefits values(cid,s.id,child#>>'{}');
    end loop;
  end loop;
  -- No original source row may silently disappear during operator edits.
  for item in select value from jsonb_array_elements(source_data->'mappings') loop
    for child in select value from jsonb_array_elements(item->'benefit_ids') loop
      if not exists(select 1 from public.yocard_catalog_benefits where card_id=cid and id=child#>>'{}') then raise exception 'Original source mapping lost' using errcode='23514'; end if;
    end loop;
  end loop;
  insert into public.yocard_catalog_revisions(card_id,revision,actor_id,snapshot) values(cid,v_revision,auth.uid(),public.yocard_catalog_card(cid));
  return public.yocard_catalog_card(cid);
end $$;
revoke all on function public.yocard_catalog_save(jsonb,integer) from public, anon;
grant execute on function public.yocard_catalog_save(jsonb,integer) to authenticated;

create index if not exists yocard_catalog_benefits_card_idx on public.yocard_catalog_benefits(card_id);
create index if not exists yocard_catalog_target_search_idx on public.yocard_catalog_benefit_targets(target_id);
commit;
