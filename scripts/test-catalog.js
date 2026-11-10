const assert=require('node:assert/strict');
const fs=require('node:fs');
const model=require('../catalog/model.js');
const view=require('../catalog/presentation.js');
const seed=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../catalog/pilot.json'),'utf8'));
assert.equal(seed.documents.length,5);
let count=0;
for(const doc of seed.documents){
  assert.deepEqual(model.validateDocument(doc,seed.targets),[]);
  const mappings=doc.card.source_snapshot.mappings;
  const source=doc.card.source_snapshot.card.benefits;
  assert.equal(mappings.length,source.length);
  assert.deepEqual(mappings.map(m=>m.legacy_id).sort(),source.map(b=>b.id).sort());
  assert.equal(new Set(mappings.map(m=>m.legacy_id)).size,source.length);
  for(const b of doc.benefits)assert(mappings.some(m=>m.benefit_ids.includes(b.id)),`Missing source mapping ${b.id}`);
  count+=source.length;
}
assert.equal(count,63);
const find=id=>seed.documents.find(doc=>doc.card.id===id);
const nori=find('nori');
assert(nori.benefits.find(b=>b.id==='nori-coffee').targets.some(t=>t.target_id==='starbucks'));
assert(nori.benefits.find(b=>b.id==='nori-coffee').targets.some(t=>t.target_id==='coffeebean'));
assert(nori.sections.find(s=>s.benefit_ids.includes('nori-kb-on')).benefit_ids.includes('nori-kb-off'));
const woori=find('woori-point');
assert.equal(woori.benefits.length,11);
assert.equal(woori.benefits.find(b=>b.id==='woori-point-pay-info').rate_percent,3);
assert.equal(woori.relations.filter(r=>r.kind==='add').length,7);
assert.equal(woori.limits.find(l=>l.scope==='shared').unit,'POINT');
assert.equal(woori.limits.find(l=>l.id==='woori-point-base:unlimited').state,'unlimited');
assert(woori.card.source_snapshot.mappings.find(m=>m.legacy_id==='woori-point-pay-cafe3').benefit_ids.includes('woori-point-pay-info'));
const happy=find('samsung-happiness-v2');
assert.equal(happy.limits.filter(l=>l.scope==='shared').length,4);
assert.equal(happy.limits.find(l=>l.id.endsWith(':shopping')).parent_id,'samsung-happiness-v2:samsungHappy');
const stars=find('starbucks-hyundai').benefits[0];
assert.equal(stars.reward_unit,'STAR');assert.equal(stars.unit_amount,30000);assert.equal(stars.rule_config.carry_over,true);
assert.equal(find('hana').benefits.find(b=>b.id==='hana-test').targets.length,5);
assert(find('hana').benefits.find(b=>b.id==='hana-test').targets.some(t=>t.target_id==='toeic'));
const invalid=model.clone(find('hana'));
invalid.benefits.find(b=>b.id==='hana-px').rule_config.tiers[1].min_amount=29000;
assert(model.validateDocument(invalid,seed.targets).some(e=>e.includes('겹칩니다')));
const original=model.clone(nori);const changed=model.clone(nori);changed.benefits[0].rate_percent=12;
assert(model.changes(original,changed).length>0);
assert.equal(nori.benefits[0].rate_percent,10);
// Reading a card must not require opening an editor or lose a linked rule.
for(const doc of seed.documents){
  const shown=view.groups(doc,seed.targets).flatMap(g=>g.benefits.map(b=>b.id));
  assert.deepEqual(shown.sort(),doc.benefits.map(b=>b.id).sort());
  for(const b of doc.benefits){
    const fields=view.fields(doc,b,seed.targets);
    const shownLimits=fields.filter(f=>f.limitId).map(f=>f.limitId);
    assert.deepEqual(shownLimits.sort(),doc.limits.filter(l=>l.scope==='benefit'&&l.benefit_ids.includes(b.id)).map(l=>l.id).sort());
    assert(fields.some(f=>f.label==='전월 실적'));assert(fields.some(f=>f.label==='건당 이용 조건'));
  }
}
assert(view.fields(nori,nori.benefits[0],seed.targets).some(f=>f.label==='월 한도'&&f.value==='3,000원'));
assert.equal(view.title(nori.benefits.find(b=>b.id==='nori-kb-off'),seed.targets),'KB Pay');
const px=find('hana').benefits.find(b=>b.id==='hana-px');
assert.equal(view.reward(px),'20~30%');
assert.equal(view.range(px.rule_config.tiers[0]),'30,000원 미만');
assert(view.relations(woori,woori.benefits.find(b=>b.id==='woori-point-cafe3'),seed.targets).some(t=>t.includes('0.8%')&&t.includes('대신')));
assert(view.relations(woori,woori.benefits.find(b=>b.id==='woori-point-cafe3'),seed.targets).some(t=>t.includes('3% 추가')));
const changedStar=model.clone(find('starbucks-hyundai'));changedStar.benefits[0].unit_amount=60000;
assert(view.fields(changedStar,changedStar.benefits[0],seed.targets).some(f=>f.value.includes('60,000원')));
assert(!view.notes(changedStar,changedStar.benefits[0]).some(t=>t.includes('30,000원')));
assert.equal(view.limitAt(woori.limits.find(l=>l.scope==='shared'),300000),'10,000P');
const reordered=model.clone(happy);reordered.sections.forEach(section=>section.benefit_ids.reverse());
assert.deepEqual(view.groups(reordered,seed.targets).map(g=>g.benefits.map(b=>b.id)),view.groups(happy,seed.targets).map(g=>g.benefits.map(b=>b.id)));
console.log(`카탈로그 정상: 원본 ${count}행 전부 연결, 56개 규칙, 브랜드·공유한도·추가적립·단위 검증 통과`);
