const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const model=require('../catalog/model.js');
const root=path.resolve(__dirname,'..');
const context={localStorage:{getItem:()=>null,setItem:()=>{}},structuredClone:global.structuredClone};
const sources=['data/merchants.js','data/cards.js','data/membership.js','app.js'].map(file=>fs.readFileSync(path.join(root,file),'utf8'));
sources[3]=sources[3].replace(/\nsetup\(\);\s*$/,'\n');
vm.runInNewContext(sources.join('\n')+`
globalThis.legacy={
  merchants,cards,sources:cardSourceUrls,secondary:cardGorillaUrls,
  details:Object.fromEntries(cards.map(card=>[card.id,card.benefits.map(b=>({
    id:b.id,title:cardBenefitDisplayText(b),hidden:!!b.hideInDetail,
    tags:(b.detailTags||describeBenefit(b,card)).filter(t=>!card.groupCapColumns||!t.includes('통합 월 한도'))
  }))]))
};`,context);
const seed=model.importLegacy(context.legacy);
fs.mkdirSync(path.join(root,'catalog'),{recursive:true});
fs.writeFileSync(path.join(root,'catalog/pilot.json'),JSON.stringify(seed,null,2)+'\n');
const literal=value=>`'${JSON.stringify(value).replaceAll("'","''")}'::jsonb`;
const sql=[
  '-- Draft catalog seed. Run catalog-schema.sql and register one operator first.',
  '-- Initial import only. An existing card revision raises a conflict and rolls back.',
  'begin;',
  `do $$ declare operator_id uuid; begin
  select user_id into operator_id from public.yocard_catalog_admins order by created_at limit 1;
  if operator_id is null then raise exception 'Register a catalog operator before importing'; end if;
  perform set_config('request.jwt.claim.sub',operator_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',operator_id,'role','authenticated')::text,true);
end $$;`,
  `insert into public.yocard_catalog_targets(id,name,kind,category)
select id,name,kind,category from jsonb_to_recordset(${literal(seed.targets)}) as t(id text,name text,kind text,category text)
on conflict(id) do nothing;`,
  ...seed.documents.map(doc=>`select public.yocard_catalog_save(${literal(doc)},0);`),
  'commit;',''
].join('\n');
fs.writeFileSync(path.join(root,'supabase/catalog-seed.sql'),sql);
console.log(`표본 ${seed.documents.length}장: 원본 ${seed.documents.reduce((n,d)=>n+d.card.source_snapshot.card.benefits.length,0)}행 → 구조화 ${seed.documents.reduce((n,d)=>n+d.benefits.length,0)}규칙; ${seed.targets.length}개 개별 적용 대상`);
