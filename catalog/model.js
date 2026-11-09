(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.YocardCatalog = api;
})(typeof globalThis === 'object' ? globalThis : this, function() {
  'use strict';
  const pilotIds = ['nori','hana','woori-point','samsung-happiness-v2','starbucks-hyundai'];
  const ruleTypes = { percent:'비율', fixed:'정액', tiered:'결제금액별 비율', accumulated:'누적금액별 적립', service:'서비스 제공' };
  const reviewLabels = { pending:'검수 전', needs_review:'재확인 필요', reviewed:'검수 완료' };
  const targetKinds = { brand:'브랜드', industry:'업종', service:'서비스 범위', all:'전체 가맹점', generic:'일반 가맹점' };
  const metricLabels = { reward:'혜택 금액', spend:'이용금액', count:'이용 횟수' };
  const periodLabels = { transaction:'건당', day:'일', month:'월', half_year:'반기', year:'연' };
  const units = { KRW:'원', POINT:'P', STAR:'개', ITEM:'개', COUNT:'회' };
  const paymentLabels = { kbpay:'KB Pay', autopay:'자동납부', 'woori-point-pay':'네이버페이·카카오페이·PAYCO·SSGPAY' };
  const clone = value => JSON.parse(JSON.stringify(value));
  const number = value => new Intl.NumberFormat('ko-KR',{maximumFractionDigits:5}).format(value);
  const nonNegative = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  function valueState(value, explicitNone=false) { return value != null ? {state:'value',value} : {state:explicitNone?'none':'unknown',value:null}; }

  function importLegacy(catalog) {
    const documents = [];
    const industryIds = new Set(['coffee','hairsalon','academy','hospital','pharmacy','postpartum-care','daycare','kindergarten','workbook','gas','lpg','golf','luxury-hotel','dutyfree']);
    const serviceIds = new Set(['transit','rail','language-test','overseas','overseas-transit','apartment-fee','city-gas','electricity','social-insurance','insurance','mvno']);
    const targets = catalog.merchants.map(m => ({id:m.id,name:m.label,kind:industryIds.has(m.id)?'industry':serviceIds.has(m.id)?'service':m.id.startsWith('other-')?'generic':'brand',category:m.category}));
    targets.push({id:'*',name:'전체 가맹점',kind:'all',category:''});
    for(const [id,name] of [['toeic','TOEIC'],['opic','OPIc'],['teps','TEPS'],['jpt','JPT'],['hsk','HSK']])targets.push({id,name,kind:'brand',category:'교육'});
    for(const [id,name] of [['rail-ktx','KTX'],['rail-srt','SRT'],['rail-itx','ITX'],['express-bus','고속버스'],['intercity-bus','시외버스']])targets.push({id,name,kind:'service',category:'교통'});
    for (const source of catalog.cards.filter(c => pilotIds.includes(c.id))) {
      const card = {
        id:source.id,name:source.name,issuer:source.issuer,kind:source.kind,reward_medium:source.rewardMedium,
        note:source.note || '',review_status:'pending',review_note:'',revision:0,
        sources:[{kind:'official',url:catalog.sources[source.id],checked_at:null}, ...(catalog.secondary[source.id]?[{kind:'secondary',url:catalog.secondary[source.id],checked_at:null}]:[])],
        source_snapshot:{card:clone(source),details:clone(catalog.details[source.id]),mappings:[]},
        valid_from:null,valid_through:null
      };
      const doc = {schema_version:1,card,benefits:[],limits:[],relations:[],sections:[]};
      const addLimit = (id,name,scope,period,metric,tiers,benefitIds=[],parentId=null) => {
        const found = doc.limits.find(l => l.id === id);
        if (found) { found.benefit_ids = [...new Set([...found.benefit_ids,...benefitIds])]; return found; }
        const rewardUnit=card.reward_medium==='스타벅스 별'?'STAR':card.kind==='적립형'?'POINT':'KRW';
        const limit = {id,card_id:card.id,name,scope,period,metric,unit:metric==='count'?'COUNT':metric==='spend'?'KRW':rewardUnit,state:'value',tiers,benefit_ids:benefitIds,parent_id:parentId,sort_order:doc.limits.length};
        doc.limits.push(limit); return limit;
      };
      for (const [group,tiers] of Object.entries(source.groups || {})) addLimit(`${card.id}:${group}`,source.groupLabels?.[group] || '월 통합 한도','shared','month','reward',tiers.map(([min_spend,cap])=>({min_spend,cap})));
      const happy = id => /department|mart|online|daiso|fresh/.test(id)?'shopping':/care|book|gas/.test(id)?'care':'living';
      if (card.id === 'samsung-happiness-v2') for (const [id,name] of [['shopping','쇼핑'],['care','보육'],['living','생활요금']]) addLimit(`${card.id}:${id}`,`${name} 통합 월 한도`,'shared','month','reward',[{min_spend:300000,cap:4000},{min_spend:600000,cap:8000},{min_spend:1000000,cap:16000}],[],`${card.id}:samsungHappy`);
      for (const [index,old] of source.benefits.entries()) {
        if (card.id === 'woori-point' && old.hideInDetail) {
          const parent = old.id === 'woori-point-pay-base' ? 'woori-point-base' : old.replaces.find(id=>!['woori-point-base','woori-point-pay-base'].includes(id));
          card.source_snapshot.mappings.push({legacy_id:old.id,benefit_ids:[parent,'woori-point-pay-info'],meaning:'기본 또는 특별 적립에 간편결제 3% 추가'});
          continue;
        }
        const detail = catalog.details[card.id].find(d => d.id === old.id);
        const performance = valueState(old.minSpend,old.detailTags?.some(t=>t==='전월 실적 조건 없음') || !!old.allowBelowGroup);
        const minimum = valueState(old.minAmount,old.detailTags?.some(t=>t==='건당 이용 조건 없음'));
        const isStars = old.id === 'starbucks-hyundai-stars';
        const isBonus = old.id === 'woori-point-pay-info';
        if (isBonus) { performance.state='value'; performance.value=300000; minimum.state='value'; minimum.value=10000; }
        const benefit = {
          id:old.id,card_id:card.id,display_name:detail?.title || old.detailTitle || old.label,
          reward_kind:old.reward==='point'?'point':old.benefitType==='캐시백'?'cashback':old.benefitType==='할인'?'discount':'service',
          rule_type:isStars?'accumulated':isBonus?'percent':old.rateTiers?'tiered':old.rate!=null?'percent':old.flat!=null&&!old.unsupported?'fixed':'service',
          rate_percent:isBonus?3:old.rate!=null?Number((old.rate*100).toFixed(5)):null,
          reward_amount:isStars?1:old.flat!=null&&!old.unsupported?old.flat:null,
          reward_unit:isStars?'STAR':old.reward==='point'?'POINT':old.benefitType?'KRW':'ITEM',
          unit_amount:isStars?30000:null,
          min_spend_state:performance.state,min_spend:performance.value,min_amount_state:minimum.state,min_amount:minimum.value,
          channel:old.channel || 'any',payment_method:isBonus?'woori-point-pay':old.payment || '',
          product_scope:old.scopeLabel || '',notes:old.conditionNote || '',
          eligibility_rules:old.requiresMilitary?[{type:'military_salary',value:true}]:[],
          membership_policy:{status:'unknown',exceptions:clone(old.membershipStacking || {}),source:'현재 코드의 정책; 공식 재확인 전'},
          rule_config:{version:1,...(old.rateTiers?{tiers:old.rateTiers.map(t=>({min_amount:t.minAmount || 0,max_amount_exclusive:t.maxAmountExclusive || null,rate_percent:t.rate*100,daily_cap:t.dailyCap ?? null,monthly_cap:t.monthlyCap ?? null}))}:{}),...(isStars?{period:'month',carry_over:true}:{}),...(old.allowBelowGroup?{group_qualification_exception:true}:{})},
          review_status:'pending',review_note:'',sort_order:index,
          targets:(isBonus?[{target_id:'*',effect:'include'}]:old.merchants.map(target_id=>({target_id,effect:'include'}))).concat((old.excludesMerchants||[]).map(target_id=>({target_id,effect:'exclude'})))
        };
        if (old.id === 'hana-cgv-snack') { benefit.reward_kind='service'; benefit.rule_type='service'; benefit.reward_unit='ITEM'; benefit.notes = [benefit.notes,'팝콘 스몰세트 1개 무료. 기존 flat 8,000원은 현금 지급액으로 이관하지 않음.'].filter(Boolean).join('\n'); }
        if (old.id === 'hana-test')benefit.targets=['toeic','opic','teps','jpt','hsk'].map(target_id=>({target_id,effect:'include'}));
        if (old.id === 'hana-rail')benefit.targets=['rail-ktx','rail-srt','rail-itx','express-bus','intercity-bus'].map(target_id=>({target_id,effect:'include'}));
        if (old.detailTags) benefit.notes = [...new Set([benefit.notes,...old.detailTags.filter(t=>!/^전월 실적|^건당|^일 |^월 |^오프라인 월|^온라인 월/.test(t))].filter(Boolean))].join('\n');
        doc.benefits.push(benefit);
        card.source_snapshot.mappings.push({legacy_id:old.id,benefit_ids:[benefit.id],meaning:'독립 규칙 보존'});
        let group = old.group;
        if (isBonus) group='wooriPoint';
        if (group) doc.limits.find(l=>l.id===`${card.id}:${group}`).benefit_ids.push(benefit.id);
        if (card.id === 'samsung-happiness-v2' && group) doc.limits.find(l=>l.id===`${card.id}:${happy(old.id)}`).benefit_ids.push(benefit.id);
        for (const [field,period,metric] of [['txnCap','transaction','reward'],['txnAmountCap','transaction','spend'],['dailyCap','day','reward'],['monthlyCap','month','reward'],['dailyCount','day','count'],['monthlyCount','month','count'],['annualCount','year','count']]) {
          if (old[field]!=null) addLimit(`${benefit.id}:${field}`,`${periodLabels[period]} ${metricLabels[metric]} 한도`,'benefit',period,metric,[{min_spend:0,cap:old[field]}],[benefit.id]);
        }
        if (old.monthlyCapTiers && card.id!=='samsung-happiness-v2') addLimit(`${benefit.id}:tiers`,'실적별 월 한도','benefit','month','reward',old.monthlyCapTiers.map(([min_spend,cap])=>({min_spend,cap})),[benefit.id]);
        if(old.unlimited || old.detailTags?.includes('적립 한도 없음')){
          const unlimited=addLimit(`${benefit.id}:unlimited`,'적립 한도 없음','benefit','month','reward',[],[benefit.id]);unlimited.state='unlimited';
        }
        for (const related_id of (Array.isArray(old.replaces)?old.replaces:old.replaces?[old.replaces]:[])) {
          if (!related_id.startsWith('woori-point-pay-')) doc.relations.push({benefit_id:benefit.id,related_id,kind:'replace'});
        }
        const parentId = old.id==='nori-kb-on'?'nori-kb-off':old.id==='samsung-happy-insurance'?'samsung-happy-living':old.id;
        let section = doc.sections.find(s=>s.id===`${card.id}:section:${parentId}`);
        if (!section) { section={id:`${card.id}:section:${parentId}`,card_id:card.id,title:detail?.title||old.label,benefit_ids:[],sort_order:index}; doc.sections.push(section); }
        section.benefit_ids.push(benefit.id);
      }
      if (card.id==='woori-point') for (const id of ['woori-point-base','woori-point-cafe3','woori-point-movie3','woori-point-department1','woori-point-mart1','woori-point-online1','woori-point-gas1']) doc.relations.push({benefit_id:'woori-point-pay-info',related_id:id,kind:'add'});
      if (card.id==='nori') for (const bonus of ['nori-kb-off','nori-kb-on']) for (const base of doc.benefits.filter(b=>!b.id.startsWith('nori-kb-'))) doc.relations.push({benefit_id:bonus,related_id:base.id,kind:'add'});
      documents.push(doc);
    }
    const result = {schema_version:1,targets,documents};
    for (const doc of documents) { const errors=validateDocument(doc,targets); if(errors.length) throw new Error(errors.join('\n')); }
    return result;
  }

  function validateDocument(doc,targets) {
    const errors=[];
    const knownTargets=new Set(targets.map(t=>t.id));
    const ids=new Set((doc.benefits || []).map(b=>b.id));
    const assert=(condition,message)=>{ if(!condition)errors.push(message); };
    assert(doc.schema_version===1,'지원하지 않는 데이터 버전');
    assert(doc.card?.id && doc.card?.name?.trim() && doc.card?.issuer?.trim(),'카드 식별자·이름·카드사는 필수입니다.');
    assert(Object.hasOwn(reviewLabels,doc.card?.review_status),'카드 검수 상태 오류');
    assert(Array.isArray(doc.benefits) && ids.size===doc.benefits.length,'혜택 목록의 ID가 중복됩니다.');
    for (const b of doc.benefits || []) {
      const label=b.id;
      assert(b.card_id===doc.card.id,`${label}: 다른 카드의 규칙입니다.`);
      assert(Object.hasOwn(ruleTypes,b.rule_type),`${label}: 계산 유형 오류`);
      assert(Object.hasOwn(reviewLabels,b.review_status),`${label}: 검수 상태 오류`);
      assert(['discount','cashback','point','service'].includes(b.reward_kind),`${label}: 지급 방식 오류`);
      assert(['KRW','POINT','STAR','ITEM'].includes(b.reward_unit),`${label}: 지급 단위 오류`);
      assert(['any','online','offline'].includes(b.channel),`${label}: 결제 채널 오류`);
      for (const key of ['min_spend','min_amount']) assert(['value','none','unknown'].includes(b[`${key}_state`]) && (b[`${key}_state`]==='value'?nonNegative(b[key]):b[key]===null),`${label}: ${key} 상태와 숫자가 맞지 않습니다.`);
      if(b.rule_type==='percent') assert(nonNegative(b.rate_percent)&&b.rate_percent<=100,`${label}: 비율은 0~100입니다.`);
      if(b.rule_type==='fixed') assert(nonNegative(b.reward_amount),`${label}: 정액을 입력하세요.`);
      if(b.rule_type==='accumulated') assert(nonNegative(b.unit_amount)&&b.unit_amount>0&&nonNegative(b.reward_amount)&&b.rule_config?.period==='month'&&typeof b.rule_config?.carry_over==='boolean',`${label}: 누적 기준금액·지급량·기간·이월 여부를 확인하세요.`);
      assert(b.rule_config?.version===1,`${label}: 규칙 버전 오류`);
      if(b.rule_type==='tiered') {
        const tiers=b.rule_config?.tiers;
        assert(Array.isArray(tiers)&&tiers.length>0,`${label}: 금액 구간이 없습니다.`);
        for(const [i,t] of (tiers||[]).entries()) {
          assert(nonNegative(t.min_amount)&&nonNegative(t.rate_percent)&&t.rate_percent<=100&&(t.max_amount_exclusive===null||nonNegative(t.max_amount_exclusive)&&t.max_amount_exclusive>t.min_amount),`${label}: 구간 ${i+1} 오류`);
          if(i>0)assert(tiers[i-1].max_amount_exclusive!==null && t.min_amount>=tiers[i-1].max_amount_exclusive,`${label}: 금액 구간이 겹칩니다.`);
          for(const k of ['daily_cap','monthly_cap'])assert(t[k]===null||nonNegative(t[k]),`${label}: 구간 한도 오류`);
        }
      }
      assert(Array.isArray(b.targets),`${label}: 적용 대상 목록 오류`);
      assert(Array.isArray(b.eligibility_rules)&&b.eligibility_rules.every(r=>r.type==='military_salary'&&typeof r.value==='boolean'),`${label}: 자격 규칙 오류`);
      for(const t of b.targets||[])assert(knownTargets.has(t.target_id)&&['include','exclude'].includes(t.effect),`${label}: 등록되지 않은 적용 대상`);
      assert(new Set((b.targets||[]).map(t=>`${t.target_id}:${t.effect}`)).size===(b.targets||[]).length,`${label}: 적용 대상 중복`);
    }
    const limits=new Map((doc.limits||[]).map(l=>[l.id,l]));
    assert(limits.size===(doc.limits||[]).length,'한도 ID 중복');
    for(const l of doc.limits||[]) {
      assert(l.card_id===doc.card.id && Object.hasOwn(periodLabels,l.period) && Object.hasOwn(metricLabels,l.metric),`${l.id}: 한도 종류 오류`);
      assert(['shared','benefit'].includes(l.scope)&&['value','unlimited','unknown'].includes(l.state),`${l.id}: 한도 상태 오류`);
      assert(l.metric==='count'?l.unit==='COUNT':l.metric==='spend'?l.unit==='KRW':['KRW','POINT','STAR','ITEM'].includes(l.unit),`${l.id}: 한도 단위 오류`);
      if(l.metric==='reward')assert(l.benefit_ids.every(id=>doc.benefits.find(b=>b.id===id)?.reward_unit===l.unit),`${l.id}: 연결된 혜택과 한도 단위가 다릅니다.`);
      assert(Array.isArray(l.tiers) && (l.state!=='value'||l.tiers.length>0),`${l.id}: 한도 구간 오류`);
      for(const [i,t] of (l.tiers||[]).entries()) assert(nonNegative(t.min_spend)&&nonNegative(t.cap)&&(l.metric!=='count'||Number.isInteger(t.cap))&&(i===0||t.min_spend>l.tiers[i-1].min_spend),`${l.id}: 한도 구간 순서·금액·횟수 오류`);
      assert(l.benefit_ids.every(id=>ids.has(id)),`${l.id}: 다른 카드 또는 없는 혜택 연결`);
      if(l.parent_id)assert(limits.has(l.parent_id)&&l.parent_id!==l.id,`${l.id}: 상위 한도 오류`);
      const visited=new Set([l.id]); let parent=l.parent_id;
      while(parent&&limits.has(parent)){if(visited.has(parent)){errors.push(`${l.id}: 한도 순환 연결`);break;}visited.add(parent);parent=limits.get(parent).parent_id;}
    }
    for(const r of doc.relations||[])assert(ids.has(r.benefit_id)&&ids.has(r.related_id)&&r.benefit_id!==r.related_id&&['add','replace','exclude'].includes(r.kind),'혜택 관계 오류');
    for(const s of doc.sections||[])assert(s.card_id===doc.card.id&&s.benefit_ids.every(id=>ids.has(id)),'표시 묶음 연결 오류');
    for(const mapping of doc.card.source_snapshot?.mappings||[])assert(mapping.benefit_ids.length>0&&mapping.benefit_ids.every(id=>ids.has(id)),`${mapping.legacy_id}: 원본 연결 누락`);
    return errors;
  }
  function rewardText(b) {
    if(b.rule_type==='percent')return `${number(b.rate_percent)}%`;
    if(b.rule_type==='fixed')return `${number(b.reward_amount)}${units[b.reward_unit]||b.reward_unit}`;
    if(b.rule_type==='tiered')return b.rule_config.tiers.map(t=>`${t.min_amount?number(t.min_amount)+'원 이상':number(t.max_amount_exclusive)+'원 미만'} ${number(t.rate_percent)}%`).join(' / ');
    if(b.rule_type==='accumulated')return `누적 ${number(b.unit_amount)}원당 ${b.reward_unit==='STAR'?'별 ':''}${number(b.reward_amount)}${units[b.reward_unit]}`;
    return '서비스';
  }
  function targetText(b,targets){return b.targets.filter(t=>t.effect==='include').map(t=>targets.find(x=>x.id===t.target_id)?.name||t.target_id).join(' · ')||'적용 범위 검토 필요';}
  function conditionText(b,key){return b[`${key}_state`]==='value'?`${number(b[key])}원 이상`:b[`${key}_state`]==='none'?'조건 없음':'미확인';}
  function changes(before,after){
    const result=[];
    const walk=(a,b,p)=>{
      if(JSON.stringify(a)===JSON.stringify(b))return;
      if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b))for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p?`${p}.${k}`:k);
      else result.push({path:p,before:a??null,after:b??null});
    };walk(before,after,'');return result;
  }
  return {pilotIds,ruleTypes,reviewLabels,targetKinds,periodLabels,metricLabels,paymentLabels,units,clone,number,importLegacy,validateDocument,rewardText,targetText,conditionText,changes};
});
