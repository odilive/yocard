(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./model.js'):root.YocardCatalog);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.YocardCatalogView=api;
})(typeof globalThis==='object'?globalThis:this,function(M){
  'use strict';
  const rewardKinds={discount:'할인',cashback:'캐시백',point:'적립',service:'서비스'};
  const unit=(value,id)=>`${M.number(value)}${M.units[id]||id}`;
  function title(b,targets){
    if(b.payment_method&&b.targets.some(t=>t.effect==='include'&&t.target_id==='*'))return M.paymentLabels[b.payment_method]||b.payment_method;
    return b.targets.some(t=>t.effect==='include')?M.targetText(b,targets):b.display_name;
  }
  function reward(b){
    if(b.rule_type==='tiered'){
      const rates=b.rule_config.tiers.map(t=>t.rate_percent);
      const min=Math.min(...rates),max=Math.max(...rates);return min===max?`${M.number(min)}%`:`${M.number(min)}~${M.number(max)}%`;
    }
    return M.rewardText(b);
  }
  function range(t){
    if(!t.min_amount&&t.max_amount_exclusive!=null)return `${unit(t.max_amount_exclusive,'KRW')} 미만`;
    if(t.max_amount_exclusive==null)return `${unit(t.min_amount,'KRW')} 이상`;
    return `${unit(t.min_amount,'KRW')} 이상 ~ ${unit(t.max_amount_exclusive,'KRW')} 미만`;
  }
  function limitName(l){
    const period=M.periodLabels[l.period];
    return l.metric==='count'?`${period} 이용 횟수`:l.metric==='spend'?`${period} 혜택 대상 결제금액`:`${period} 한도`;
  }
  function limitValue(l){
    if(l.state==='unlimited')return '한도 없음';
    if(l.state==='unknown')return '미확인';
    return l.tiers.map(t=>`${l.tiers.length>1||t.min_spend?`전월 실적 ${unit(t.min_spend,'KRW')} 이상: `:''}${unit(t.cap,l.unit)}`).join(' / ');
  }
  function limitAt(l,spend){
    if(l.state!=='value')return limitValue(l);
    const tier=[...l.tiers].reverse().find(t=>spend>=t.min_spend);
    return tier?unit(tier.cap,l.unit):'해당 실적 구간 없음';
  }
  function fields(doc,b,targets){
    const list=[{label:'전월 실적',value:M.conditionText(b,'min_spend'),unknown:b.min_spend_state==='unknown'},
      {label:'건당 이용 조건',value:M.conditionText(b,'min_amount'),unknown:b.min_amount_state==='unknown'}];
    const order={transaction:0,day:1,month:2,half_year:3,year:4};
    const individual=doc.limits.filter(l=>l.scope==='benefit'&&l.benefit_ids.includes(b.id)).sort((a,c)=>order[a.period]-order[c.period]||({reward:0,count:1,spend:2}[a.metric]-{reward:0,count:1,spend:2}[c.metric]));
    const shared=doc.limits.filter(l=>l.scope==='shared'&&l.benefit_ids.includes(b.id));
    for(const l of individual)list.push({label:limitName(l),value:limitValue(l),limitId:l.id,unknown:l.state==='unknown'});
    if(shared.length)list.push({label:'통합한도',value:shared.map(l=>l.name).join(' · '),sharedIds:shared.map(l=>l.id)});
    if(b.rule_config.group_qualification_exception)list.push({label:'실적 예외',value:'통합한도 실적 미달 구간에서도 이 혜택 제공'});
    if(b.payment_method)list.push({label:'결제 방식',value:M.paymentLabels[b.payment_method]||b.payment_method});
    if(b.channel!=='any')list.push({label:'이용 경로',value:b.channel==='online'?'온라인':'오프라인'});
    if(b.product_scope)list.push({label:'대상 상품',value:b.product_scope});
    const exclusions=b.targets.filter(t=>t.effect==='exclude').map(t=>targets.find(x=>x.id===t.target_id)?.name||t.target_id);
    if(exclusions.length)list.push({label:'제외 대상',value:exclusions.join(' · ')});
    if(b.eligibility_rules.some(r=>r.type==='military_salary'&&r.value))list.push({label:'필요 자격',value:'군 급여이체'});
    if(b.rule_type==='accumulated'){
      list.push({label:'적립 기준',value:`월 이용금액 누적 ${unit(b.unit_amount,'KRW')}마다 ${unit(b.reward_amount,b.reward_unit)}`});
      list.push({label:'잔여금액',value:b.rule_config.carry_over?'다음 달로 이월':'이월하지 않음'});
    }
    return list;
  }
  function notes(doc,b){
    const lines=b.notes.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    return [...new Set(lines.filter(line=>{
      // Suppress only exact kinds of imported prose now represented by live fields.
      if(b.rule_type==='accumulated'&&(/^당월 이용금액 누적 .+마다 별 .+$/.test(line)||/^.+ 미만 잔여금액은 다음 달로 이월$/.test(line)))return false;
      if(/^적립 한도 없음$/.test(line)&&doc.limits.some(l=>l.state==='unlimited'&&l.benefit_ids.includes(b.id)))return false;
      if(/^기본·특별 적립률에 .+ 추가$/.test(line)&&doc.relations.some(r=>r.benefit_id===b.id&&r.kind==='add'))return false;
      return true;
    }))];
  }
  function relations(doc,b,targets){
    const result=[];
    const get=id=>doc.benefits.find(x=>x.id===id);
    const qualifier=x=>[
      x.payment_method&&(M.paymentLabels[x.payment_method]||x.payment_method)+' 결제',
      x.min_spend_state==='value'&&`전월 실적 ${unit(x.min_spend,'KRW')} 이상`,
      x.min_amount_state==='value'&&`건당 ${unit(x.min_amount,'KRW')} 이상`
    ].filter(Boolean).join(' · ');
    const replaced=doc.relations.filter(r=>r.benefit_id===b.id&&r.kind==='replace').map(r=>get(r.related_id)).filter(Boolean);
    if(replaced.length)result.push(`${replaced.map(x=>`${x.targets.some(t=>t.target_id==='*')?'기본 혜택':title(x,targets)} ${reward(x)}`).join(' · ')} 대신 적용`);
    const bonuses=doc.relations.filter(r=>r.related_id===b.id&&r.kind==='add').map(r=>get(r.benefit_id)).filter(Boolean);
    const seen=new Set();
    for(const bonus of bonuses){
      const text=`${qualifier(bonus)||title(bonus,targets)} 시 ${reward(bonus)} 추가 ${rewardKinds[bonus.reward_kind]||'제공'} (각 혜택 한도 적용)`;
      if(!seen.has(text)){seen.add(text);result.push(text);}
    }
    const added=doc.relations.filter(r=>r.benefit_id===b.id&&r.kind==='add').map(r=>get(r.related_id)).filter(Boolean);
    if(added.length)result.push(`기본·대상별 혜택에 ${reward(b)} 추가 ${rewardKinds[b.reward_kind]||'제공'}`);
    for(const r of doc.relations.filter(r=>r.kind==='exclude'&&(r.benefit_id===b.id||r.related_id===b.id))){const other=get(r.benefit_id===b.id?r.related_id:r.benefit_id);if(other)result.push(`${title(other,targets)} ${reward(other)}와 중복 적용 불가`);}
    for(const [id,policy] of Object.entries(b.membership_policy?.exceptions||{})){
      const status=policy.discount;if(!['allowed','blocked'].includes(status))continue;
      const merchant=targets.find(t=>t.id===id.replace(/^skt-/,''));
      result.push(`T멤버십${merchant?' '+merchant.name:''} 할인과 ${status==='allowed'?'함께 사용 가능':'중복 적용 불가'}`);
    }
    return [...new Set(result)];
  }
  function groups(doc,targets){
    const seen=new Set();const result=[];
    const append=(id,ids)=>{
      const benefits=ids.map(bid=>doc.benefits.find(b=>b.id===bid)).filter(b=>b&&!seen.has(b.id)).sort((a,b)=>a.sort_order-b.sort_order);
      if(!benefits.length)return;
      benefits.forEach(b=>seen.add(b.id));
      const titles=[...new Set(benefits.map(b=>title(b,targets)))];
      const rewards=[...new Set(benefits.map(reward))];
      result.push({id,benefits,title:titles.join(' · '),reward:rewards.length===1?rewards[0]:null});
    };
    for(const s of [...doc.sections].sort((a,b)=>a.sort_order-b.sort_order))append(s.id,s.benefit_ids);
    for(const b of doc.benefits)append(b.id,[b.id]);
    return result;
  }
  return {rewardKinds,title,reward,range,limitName,limitValue,limitAt,fields,notes,relations,groups};
});
