(async function() {
  'use strict';
  const M=window.YocardCatalog;
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key='yocard-catalog-drafts-v1';
  let seed,targets=[],documents=[],saved=new Map(),histories={},selected='',tab='benefits',filter='all',query='',mode='local',client=null,editing=null,editingLimit=null,busy=false,toastTimer;
  const current=()=>documents.find(d=>d.card.id===selected);
  const dirty=doc=>JSON.stringify(doc)!==JSON.stringify(saved.get(doc.card.id));
  function notify(message,error=false){const node=$('#feedback');node.textContent=message;node.classList.toggle('error',error);node.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{node.hidden=true;},7000);}
  function options(items,value){return Object.entries(items).map(([id,label])=>`<option value="${esc(id)}" ${id===value?'selected':''}>${esc(label)}</option>`).join('');}
  function input(name,label,value,type='text',extra=''){return `<label>${esc(label)}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;}
  function select(name,label,items,value){return `<label>${esc(label)}<select name="${name}">${options(items,value)}</select></label>`;}
  function stateInput(name,label,b){return `<label>${esc(label)}<span class="condition-pair"><select name="${name}_state">${options({value:'금액 지정',none:'조건 없음',unknown:'미확인'},b[`${name}_state`])}</select><input name="${name}" type="number" min="0" step="1" value="${esc(b[name]??'')}" placeholder="원" ${b[`${name}_state`]==='value'?'':'disabled'}></span></label>`;}
  function originals(doc,b){const ids=doc.card.source_snapshot.mappings.filter(m=>m.benefit_ids.includes(b.id)).map(m=>m.legacy_id);return doc.card.source_snapshot.details.filter(d=>ids.includes(d.id));}
  function limitText(limit){return limit.state==='unlimited'?'한도 없음':limit.state==='unknown'?'미확인':limit.tiers.map(t=>`${t.min_spend?`전월 ${M.number(t.min_spend)}원 이상 → `:''}${M.number(t.cap)}${M.units[limit.unit]}`).join(' / ');}
  function sourceLink(url,label){try{const u=new URL(url);if(!['http:','https:'].includes(u.protocol))return '';}catch{return '';}return `<a class="link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}

  function loadLocal(){
    let stored;
    try{stored=JSON.parse(localStorage.getItem(key));}catch{}
    const valid=stored?.schema_version===1&&Array.isArray(stored.documents)&&stored.documents.length&&stored.documents.every(d=>M.validateDocument(d,seed.targets).length===0);
    documents=M.clone(valid?stored.documents:seed.documents);targets=M.clone(seed.targets);histories=valid?stored.histories||{}:{};
    saved=new Map(documents.map(d=>[d.card.id,M.clone(d)]));mode='local';
    if(!current())selected=documents[0]?.card.id||'';
    render();
    if(stored&&!valid)notify('저장된 초안의 형식을 확인하지 못해 표본을 열었습니다. 기존 저장값은 덮어쓰지 않았습니다.',true);
  }
  function render(){
    $('#modeLabel').textContent=mode==='cloud'?'Supabase 연결됨':'로컬 검수';
    $('#modeDescription').textContent=mode==='cloud'?'관리자 전용 카드 DB의 초안을 편집합니다.':'변경사항은 이 브라우저에 저장됩니다.';
    $('#connect').textContent=mode==='cloud'?'연결 해제':'Supabase 연결';
    $('#connect').disabled=busy;
    renderSidebar();renderMain();
  }
  function matches(doc,b){return !query||[doc.card.name,doc.card.issuer,b?.display_name||'',b?M.targetText(b,targets):'',...(b?[]:doc.benefits.map(x=>M.targetText(x,targets)))].join(' ').toLowerCase().includes(query);}
  function renderSidebar(){
    const cards=documents.filter(d=>matches(d));
    $('#cardCount').textContent=`${cards.length}장`;
    $('#cards').innerHTML=cards.length?cards.map(doc=>`<button type="button" class="card-link ${doc.card.id===selected?'active':''}" data-card="${esc(doc.card.id)}" ${busy?'disabled':''} ${doc.card.id===selected?'aria-current="true"':''}><span>${esc(doc.card.name)}${dirty(doc)?' ·':''}</span><small>${esc(doc.card.issuer)} · ${doc.benefits.length}개 규칙</small></button>`).join(''):'<p class="empty">검색 결과가 없어요.</p>';
  }
  function renderMain(){
    $('#mainPanel').inert=busy;
    const doc=current();
    if(!doc){$('#mainPanel').innerHTML='<p class="empty">등록된 카드 초안이 없습니다. 초기 데이터 가져오기 절차를 확인해 주세요.</p>';return;}
    const reviewed=doc.benefits.filter(b=>b.review_status==='reviewed').length;
    $('#mainPanel').innerHTML=`<div class="card-header"><div><span class="eyebrow">CARD CATALOG · DRAFT</span><h2>${esc(doc.card.name)}</h2><p class="card-meta">${esc(doc.card.issuer)} · ${esc(doc.card.kind)} · ${esc(doc.card.reward_medium)}</p></div><div class="header-actions"><span class="save-state ${dirty(doc)?'dirty':''}">${dirty(doc)?'저장하지 않은 변경':'저장됨'} · v${doc.card.revision}</span><button id="saveCard" class="primary" type="button" ${busy?'disabled':''}>${busy?'저장 중…':'카드 초안 저장'}</button></div></div>
    <p class="intro-note">기존 정리와 적용 규칙을 비교하며 검수하세요. 미확인 조건은 그대로 표시하고, 검수 완료한 항목을 구분해 둘 수 있어요.</p>
    <div class="metrics"><div class="metric"><span>혜택 규칙</span><strong>${doc.benefits.length}</strong></div><div class="metric"><span>검수 완료</span><strong>${reviewed}</strong></div><div class="metric"><span>공유 한도</span><strong>${doc.limits.filter(l=>l.scope==='shared').length}</strong></div></div>
    <nav class="tabs" aria-label="카드 관리 메뉴">${Object.entries({benefits:'혜택',limits:'한도',relations:'혜택 관계',sources:'카드·출처',history:'변경 이력'}).map(([id,name])=>`<button type="button" class="${tab===id?'active':''}" data-tab="${id}" aria-pressed="${tab===id}">${name}</button>`).join('')}</nav><div id="tabContent"></div>`;
    renderTab();
  }
  function renderTab(){
    const doc=current();if(!doc)return;
    const root=$('#tabContent');
    if(tab==='benefits'){
      const list=doc.benefits.filter(b=>matches(doc,b)&&(filter==='all'||b.review_status===filter));
      root.innerHTML=`<div class="list-toolbar"><p>브랜드별 적용 범위와 지급 규칙</p><select id="reviewFilter" aria-label="검수 상태 필터">${options({all:'전체 상태',...M.reviewLabels},filter)}</select></div>${list.map(b=>{
        const types=[...new Set(b.targets.filter(t=>t.effect==='include').map(t=>M.targetKinds[targets.find(x=>x.id===t.target_id)?.kind]||'대상'))];
        const linked=doc.limits.filter(l=>l.benefit_ids.includes(b.id)&&l.scope==='shared');
        const route=[b.payment_method&&(M.paymentLabels[b.payment_method]||b.payment_method),b.channel==='online'?'온라인':b.channel==='offline'?'오프라인':'',b.product_scope,doc.relations.some(r=>r.benefit_id===b.id&&r.kind==='add')?'추가 지급':''].filter(Boolean).join(' · ');
        return `<article class="benefit-row" data-benefit-row="${esc(b.id)}"><div><div class="benefit-target-type">${esc(types.join(' · ')||'서비스')} · ${esc(M.ruleTypes[b.rule_type])}</div><h3 class="benefit-title">${esc(b.targets.length?M.targetText(b,targets):b.display_name)}</h3></div><strong class="benefit-reward">${esc(M.rewardText(b))}</strong><div class="benefit-bottom"><span class="badge ${b.review_status}">${M.reviewLabels[b.review_status]}</span><span class="benefit-summary">전월 실적 ${esc(M.conditionText(b,'min_spend'))} · 건당 ${esc(M.conditionText(b,'min_amount'))}${route?`<br>${esc(route)}`:''}</span></div>${linked.length?`<p class="benefit-review-line">${esc(linked.map(l=>l.name).join(' · '))}</p>`:''}<button class="edit-button" data-edit="${esc(b.id)}" type="button">비교·수정 ↗</button></article>`;
      }).join('')||'<p class="empty">조건에 맞는 혜택이 없어요.</p>'}`;
    }else if(tab==='limits'){
      root.innerHTML=`<p class="version-note">공유 한도는 여러 혜택이 함께 사용합니다. 건당 혜택 상한과 결제금액 상한을 구분해 검수하세요.</p>${doc.limits.map(l=>`<article class="panel"><span class="eyebrow">${l.scope==='shared'?'공유 한도':'개별 한도'} · ${M.periodLabels[l.period]} · ${M.metricLabels[l.metric]}</span><h3>${esc(l.name)}</h3><p>${esc(limitText(l))}</p>${l.parent_id?`<p>상위 한도: ${esc(doc.limits.find(x=>x.id===l.parent_id)?.name||l.parent_id)}</p>`:''}<p>연결된 혜택 ${l.benefit_ids.length}개</p><button type="button" data-limit="${esc(l.id)}">연결·수치 수정</button></article>`).join('')||'<p class="empty">명시된 한도 규칙이 없습니다. 이 사실만으로 무제한으로 확정하지 않습니다.</p>'}`;
    }else if(tab==='relations'){
      root.innerHTML=`<article class="panel"><h3>함께 적용되는 방식</h3><p>추가 지급은 기본·특별 혜택에 더하고, 대체 혜택은 기존 혜택 대신 적용합니다. 관계 자체의 수정은 다음 검수 단계에서 확장할 수 있습니다.</p>${doc.relations.map(r=>`<div class="relation-item"><span class="badge">${({add:'추가',replace:'대체',exclude:'중복 불가'})[r.kind]}</span> ${esc(M.targetText(doc.benefits.find(b=>b.id===r.benefit_id),targets))} → ${esc(M.targetText(doc.benefits.find(b=>b.id===r.related_id),targets))}</div>`).join('')||'<p class="empty">명시된 관계가 없습니다.</p>'}</article>`;
    }else if(tab==='sources'){
      root.innerHTML=`<form id="metadataForm" class="panel source-form"><h3>카드 기본 정보</h3><div class="field-grid">${input('name','카드명',doc.card.name,'text','required')}${input('issuer','카드사',doc.card.issuer,'text','required')}${input('reward_medium','대표 지급수단',doc.card.reward_medium)}${select('review_status','카드 검수 상태',M.reviewLabels,doc.card.review_status)}</div><label>카드 공통 조건<textarea name="note">${esc(doc.card.note)}</textarea></label><label>검수 메모<textarea name="review_note">${esc(doc.card.review_note)}</textarea></label><button type="submit">기본 정보 초안에 적용</button></form><article class="panel"><h3>정보 출처</h3>${doc.card.sources.map(s=>`<p>${sourceLink(s.url,s.kind==='official'?'공식 안내':'보조 자료')} · ${s.checked_at?esc(s.checked_at)+' 확인':'공식 재확인 전'}</p>`).join('')}<p class="section-note">표본은 기존 코드에서 옮긴 초안입니다. 가져온 날짜를 약관 확인일로 간주하지 않습니다.</p></article>`;
    }else if(tab==='history'){
      root.innerHTML='<p class="version-note">카드 초안을 저장할 때마다 버전을 기록합니다.</p><div id="historyItems"></div>';
      renderHistory(doc);
    }
  }
  async function renderHistory(doc){
    let entries=histories[doc.card.id]||[];
    if(mode==='cloud'){
      const {data,error}=await client.from('yocard_catalog_revisions').select('revision,saved_at').eq('card_id',doc.card.id).order('revision',{ascending:false}).limit(30);
      if(error){notify('변경 이력을 읽지 못했습니다.',true);return;}entries=data;
    }
    if(tab!=='history'||current()?.card.id!==doc.card.id)return;
    $('#historyItems').innerHTML=entries.length?entries.map(h=>`<article class="panel"><h3>버전 ${h.revision}</h3><p>${esc(new Date(h.saved_at).toLocaleString('ko-KR'))}${h.change_count!=null?` · 변경 ${h.change_count}개`:''}</p></article>`).join(''):'<p class="empty">아직 저장한 변경 이력이 없어요.</p>';
  }
  function renderTargets(){
    $('#targetChips').innerHTML=editing.targets.map((t,i)=>`<span class="target-chip ${t.effect==='exclude'?'excluded':''}">${t.effect==='exclude'?'제외 · ':''}${esc(targets.find(x=>x.id===t.target_id)?.name||t.target_id)}<button type="button" data-remove-target="${i}" aria-label="적용 대상 제거">×</button></span>`).join('');
    $('#targetOptions').innerHTML='';
  }
  function renderTargetOptions(){
    const text=$('#targetQuery').value.trim().toLowerCase();
    const effect=$('#targetEffect').value;
    const list=text?targets.filter(t=>[t.name,t.category].join(' ').toLowerCase().includes(text)&&!editing.targets.some(x=>x.target_id===t.id&&x.effect===effect)).slice(0,15):[];
    $('#targetOptions').innerHTML=list.map(t=>`<button type="button" data-add-target="${esc(t.id)}">${esc(t.name)} <small>${M.targetKinds[t.kind]} · ${esc(t.category)}</small></button>`).join('')||(text?'<p class="section-note">추가할 대상이 없습니다.</p>':'');
  }
  function tierRows(tiers){return tiers.map((t,i)=>`<div class="row-grid" data-tier="${i}">${input('tier_min','결제금액 이상',t.min_amount,'number','min="0" required')}${input('tier_max','결제금액 미만',t.max_amount_exclusive??'','number','min="0" placeholder="상한 없음"')}${input('tier_rate','혜택률 %',t.rate_percent,'number','min="0" max="100" step="0.00001" required')}${input('tier_daily','일 한도',t.daily_cap??'','number','min="0" placeholder="미확인"')}${input('tier_monthly','월 한도',t.monthly_cap??'','number','min="0" placeholder="미확인"')}<button type="button" data-remove-tier="${i}" aria-label="금액 구간 제거">×</button></div>`).join('');}
  function ruleFields(){
    const b=editing;
    $('#ruleFields').innerHTML=b.rule_type==='percent'?input('rate_percent','혜택률 (%)',b.rate_percent,'number','min="0" max="100" step="0.00001" required'):b.rule_type==='fixed'?input('reward_amount','건당 지급량',b.reward_amount,'number','min="0" step="0.0001" required'):b.rule_type==='accumulated'?`<div class="field-grid">${input('unit_amount','누적 기준금액 (원)',b.unit_amount,'number','min="1" required')}${input('reward_amount','기준금액당 지급량',b.reward_amount,'number','min="0" step="0.0001" required')}${select('carry_over','다음 달 잔여금액 이월',{yes:'이월',no:'이월 안 함'},b.rule_config.carry_over?'yes':'no')}</div>`:b.rule_type==='tiered'?`<p class="section-note">하한은 포함, 상한은 미포함입니다. 금액 구간끼리 겹치지 않게 입력하세요.</p><div id="amountTiers">${tierRows(b.rule_config.tiers||[])}</div><button type="button" id="addTier">+ 금액 구간</button>`:'<p class="section-note">서비스 내용과 횟수는 설명·한도 항목에서 관리합니다. 현금 지급액으로 환산하지 않습니다.</p>';
  }
  function openEditor(id){
    editing=M.clone(current().benefits.find(b=>b.id===id));
    const b=editing;
    $('#editorTitle').textContent=M.targetText(b,targets);
    $('#editorBody').innerHTML=`<section class="editor-section"><h3>적용 대상</h3><div id="targetChips" class="target-chips"></div><div class="target-search"><input id="targetQuery" type="search" placeholder="브랜드·업종을 검색하세요" aria-label="적용 대상 검색"><select id="targetEffect" aria-label="포함 또는 제외"><option value="include">적용 대상</option><option value="exclude">제외 대상</option></select><button id="findTarget" type="button">검색</button></div><div id="targetOptions" class="target-options"></div><p class="section-note">브랜드는 각각 연결됩니다. 업종 전체·전체 가맹점은 별도 범위입니다.</p></section>
    <section class="editor-section"><h3>지급 방식과 계산</h3><div class="field-grid">${select('reward_kind','지급 방식',{discount:'할인',cashback:'캐시백',point:'적립',service:'서비스'},b.reward_kind)}${select('reward_unit','지급 단위',{KRW:'원',POINT:'포인트',STAR:'스타벅스 별',ITEM:'상품·서비스 수량'},b.reward_unit)}${select('rule_type','계산 방식',M.ruleTypes,b.rule_type)}</div><div id="ruleFields" style="margin-top:16px"></div></section>
    <section class="editor-section"><h3>적용 조건</h3><div class="field-grid">${stateInput('min_spend','전월 실적',b)}${stateInput('min_amount','건당 최소 결제금액',b)}${select('channel','결제 채널',{any:'온·오프라인 구분 없음',online:'온라인',offline:'오프라인'},b.channel)}${select('payment_method','필요 결제수단',{'':'지정 없음',...M.paymentLabels},b.payment_method)}${input('product_scope','대상 상품·메뉴',b.product_scope)}</div>${b.eligibility_rules.some(x=>x.type==='military_salary')?'<p class="section-note">군 급여이체 자격이 필요한 혜택입니다.</p>':''}<label style="margin-top:16px">세부 조건·설명<textarea name="notes">${esc(b.notes)}</textarea></label></section>
    <section class="editor-section"><h3>연결된 한도</h3><p class="section-note">한도 수치는 카드의 ‘한도’ 탭에서 수정합니다.</p><div class="check-list">${current().limits.map(l=>`<label><input type="checkbox" name="limit_id" value="${esc(l.id)}" ${l.benefit_ids.includes(b.id)?'checked':''}>${esc(l.name)} · ${esc(limitText(l))}</label>`).join('')||'<p class="section-note">명시된 한도가 없습니다.</p>'}</div></section>
    <section class="editor-section"><h3>기존 정리와 비교</h3>${originals(current(),b).map(o=>`<div class="original"><strong>${esc(o.title)}</strong><ul>${o.tags.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</section>
    <section class="editor-section"><h3>검수</h3><div class="field-grid">${select('review_status','검수 상태',M.reviewLabels,b.review_status)}</div><label style="margin-top:14px">검수 메모<textarea name="review_note" placeholder="확인한 내용이나 다시 볼 조건을 기록하세요">${esc(b.review_note)}</textarea></label></section>`;
    renderTargets();ruleFields();$('#editor').showModal();
  }
  function numeric(form,name){const text=form.elements.namedItem(name)?.value;return text===''||text==null?null:Number(text);}
  function readAmountTiers(){return [...document.querySelectorAll('[data-tier]')].map(row=>{const get=name=>{const value=row.querySelector(`[name="${name}"]`).value;return value===''?null:Number(value);};return {min_amount:get('tier_min'),max_amount_exclusive:get('tier_max'),rate_percent:get('tier_rate'),daily_cap:get('tier_daily'),monthly_cap:get('tier_monthly')};});}
  function readRuleFields(){
    const form=$('#editForm');
    if(editing.rule_type==='percent')editing.rate_percent=numeric(form,'rate_percent');
    if(['fixed','accumulated'].includes(editing.rule_type))editing.reward_amount=numeric(form,'reward_amount');
    if(editing.rule_type==='tiered')editing.rule_config.tiers=readAmountTiers();
    if(editing.rule_type==='accumulated'){editing.unit_amount=numeric(form,'unit_amount');editing.rule_config.period='month';editing.rule_config.carry_over=form.elements.namedItem('carry_over').value==='yes';}
  }
  function applyBenefit(event){
    event.preventDefault();readRuleFields();
    const form=event.currentTarget;const updated=M.clone(editing);
    for(const name of ['reward_kind','reward_unit','channel','payment_method','product_scope','notes','review_status','review_note'])updated[name]=form.elements.namedItem(name).value;
    for(const name of ['min_spend','min_amount']){updated[`${name}_state`]=form.elements.namedItem(`${name}_state`).value;updated[name]=updated[`${name}_state`]==='value'?numeric(form,name):null;}
    if(updated.rule_type!=='percent')updated.rate_percent=null;
    if(!['fixed','accumulated'].includes(updated.rule_type))updated.reward_amount=null;
    if(updated.rule_type!=='accumulated'){updated.unit_amount=null;delete updated.rule_config.period;delete updated.rule_config.carry_over;}
    if(updated.rule_type!=='tiered')delete updated.rule_config.tiers;
    const draft=M.clone(current());
    const index=draft.benefits.findIndex(b=>b.id===updated.id);const old=draft.benefits[index];
    const substantive=M.changes({...old,review_status:null,review_note:null},{...updated,review_status:null,review_note:null}).length;
    if(substantive&&old.review_status==='reviewed'&&updated.review_status==='reviewed')updated.review_status='pending';
    draft.benefits[index]=updated;
    const connected=new Set([...form.querySelectorAll('[name="limit_id"]:checked')].map(x=>x.value));
    for(const l of draft.limits)l.benefit_ids=connected.has(l.id)?[...new Set([...l.benefit_ids,updated.id])]:l.benefit_ids.filter(id=>id!==updated.id);
    const errors=M.validateDocument(draft,targets);if(errors.length){notify(errors[0],true);return;}
    draft.card.review_status='pending';documents[documents.findIndex(d=>d.card.id===selected)]=draft;
    $('#editor').close();editing=null;render();notify('혜택 수정 내용을 초안에 적용했습니다. 카드 초안을 저장해 주세요.');
  }
  function openLimit(id){
    editingLimit=M.clone(current().limits.find(l=>l.id===id));const l=editingLimit;
    $('#limitEditorBody').innerHTML=`<div class="field-grid">${input('name','한도 이름',l.name,'text','required')}${select('state','한도 상태',{value:'금액·횟수 지정',unlimited:'한도 없음',unknown:'미확인'},l.state)}${select('period','기간',M.periodLabels,l.period)}${select('metric','제한하는 값',M.metricLabels,l.metric)}${select('unit','한도 단위',{KRW:'원',POINT:'포인트',STAR:'별',ITEM:'상품 수량',COUNT:'회'},l.unit)}${select('parent_id','상위 공유 한도',{'':'없음',...Object.fromEntries(current().limits.filter(x=>x.id!==l.id&&x.scope==='shared').map(x=>[x.id,x.name]))},l.parent_id||'')}</div><section><h3>실적별 한도</h3><p class="section-note">실적 구간은 작은 금액부터 입력합니다. 한도 수치는 위에서 선택한 단위를 사용합니다.</p><div id="limitTiers" class="limit-tiers"></div><button type="button" id="addLimitTier">+ 실적 구간</button></section><section><h3>함께 사용하는 혜택</h3><div class="check-list">${current().benefits.map(b=>`<label><input name="benefit_id" type="checkbox" value="${esc(b.id)}" ${l.benefit_ids.includes(b.id)?'checked':''}>${esc(M.targetText(b,targets))} · ${esc(M.rewardText(b))}</label>`).join('')}</div></section>`;
    renderLimitTiers();$('#limitEditor').showModal();
  }
  function renderLimitTiers(){ $('#limitTiers').innerHTML=editingLimit.tiers.map((t,i)=>`<div class="row-grid" data-limit-tier="${i}">${input('limit_min','전월 실적 이상',t.min_spend,'number','min="0" required')}${input('limit_cap','한도',t.cap,'number','min="0" required')}<button type="button" data-remove-limit-tier="${i}" aria-label="실적 구간 제거">×</button></div>`).join(''); }
  function readLimitTiers(){return [...document.querySelectorAll('[data-limit-tier]')].map(row=>({min_spend:Number(row.querySelector('[name="limit_min"]').value),cap:Number(row.querySelector('[name="limit_cap"]').value)}));}
  $('#limitForm').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;const l=M.clone(editingLimit);
    for(const name of ['name','state','period','metric'])l[name]=form.elements.namedItem(name).value;
    l.parent_id=form.elements.namedItem('parent_id').value||null;l.unit=l.metric==='count'?'COUNT':l.metric==='spend'?'KRW':form.elements.namedItem('unit').value;l.tiers=readLimitTiers();
    l.benefit_ids=[...form.querySelectorAll('[name="benefit_id"]:checked')].map(x=>x.value);
    const doc=M.clone(current());doc.limits[doc.limits.findIndex(x=>x.id===l.id)]=l;
    const errors=M.validateDocument(doc,targets);if(errors.length){notify(errors[0],true);return;}
    for(const b of doc.benefits)if(l.benefit_ids.includes(b.id)||editingLimit.benefit_ids.includes(b.id))b.review_status='pending';
    doc.card.review_status='pending';documents[documents.findIndex(d=>d.card.id===selected)]=doc;
    $('#limitEditor').close();editingLimit=null;render();notify('한도 변경을 초안에 적용했습니다.');
  });
  async function saveCard(){
    const doc=M.clone(current());if(!dirty(doc)){notify('저장할 변경사항이 없습니다.');return;}
    const errors=M.validateDocument(doc,targets);if(errors.length){notify(errors[0],true);return;}
    busy=true;render();
    try{
      if(mode==='cloud'){
        const {data,error}=await client.rpc('yocard_catalog_save',{p_document:doc,p_expected_revision:saved.get(doc.card.id).card.revision});
        if(error){if(error.code==='40001')throw new Error('다른 창에서 먼저 수정한 카드입니다. 내보내기로 초안을 보관한 뒤 DB에 다시 연결해 주세요.');throw new Error(error.message);}
        documents[documents.findIndex(d=>d.card.id===doc.card.id)]=data;saved.set(doc.card.id,M.clone(data));
      }else{
        const count=M.changes(saved.get(doc.card.id),doc).length;
        doc.card.revision++;
        const nextDocs=documents.map(d=>d.card.id===doc.card.id?doc:M.clone(saved.get(d.card.id)));
        const nextHistory=M.clone(histories);nextHistory[doc.card.id]=[{revision:doc.card.revision,saved_at:new Date().toISOString(),change_count:count},...(nextHistory[doc.card.id]||[])].slice(0,20);
        localStorage.setItem(key,JSON.stringify({schema_version:1,documents:nextDocs,histories:nextHistory}));
        histories=nextHistory;documents[documents.findIndex(d=>d.card.id===doc.card.id)]=doc;saved.set(doc.card.id,M.clone(doc));
      }
      notify(mode==='cloud'?'Supabase에 카드 초안을 저장했습니다.':'이 브라우저에 카드 초안을 저장했습니다.');
    }catch(error){notify(`저장하지 못했습니다. ${error.message}`,true);}finally{busy=false;render();}
  }
  function exportDraft(){const blob=new Blob([JSON.stringify({schema_version:1,targets,documents},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`yocard-catalog-draft-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function readAll(table,columns,order){
    const rows=[];for(let offset=0;;offset+=500){const {data,error}=await client.from(table).select(columns).order(order).range(offset,offset+499);if(error)throw error;rows.push(...data);if(data.length<500)return rows;}
  }
  async function connectCloud(){
    const {data:permission,error}=await client.rpc('yocard_is_catalog_admin');
    if(error)throw new Error('DB 테이블과 관리자 권한 설정을 먼저 적용해 주세요.');
    if(!permission)throw new Error('이 계정에 카드 관리자 권한이 없습니다.');
    const [rows,remoteTargets]=await Promise.all([readAll('yocard_catalog_cards','id','id'),readAll('yocard_catalog_targets','*','id')]);
    if(!rows.length)throw new Error('카드 DB가 비어 있습니다. 초기 데이터 SQL을 먼저 실행해 주세요.');
    const remote=await Promise.all(rows.map(async row=>{const {data,error}=await client.rpc('yocard_catalog_card',{p_card_id:row.id});if(error)throw error;return data;}));
    for(const doc of remote){const errors=M.validateDocument(doc,remoteTargets);if(errors.length)throw new Error(errors[0]);}
    documents=remote;targets=remoteTargets;saved=new Map(documents.map(d=>[d.card.id,M.clone(d)]));mode='cloud';histories={};if(!current())selected=documents[0].card.id;render();$('#connectionDialog').close();
  }
  $('#loginForm').addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget;const button=form.querySelector('[type="submit"]');$('#loginFeedback').textContent='';
    if(!client){$('#loginFeedback').textContent='연결 모듈을 불러오지 못했습니다. 네트워크를 확인해 주세요.';return;}
    if(documents.some(d=>dirty(d))&&!confirm('저장하지 않은 로컬 변경이 있습니다. 먼저 내보내기로 보관하는 것을 권장합니다. DB 데이터로 전환할까요?'))return;
    button.disabled=true;
    try{const {error}=await client.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});form.elements.password.value='';if(error)throw new Error('이메일 또는 비밀번호를 확인해 주세요.');await connectCloud();notify('관리자 카드 DB에 연결했습니다.');}
    catch(error){$('#loginFeedback').textContent=error.message;}finally{button.disabled=false;}
  });
  async function useLocal(){if(busy)return;if(documents.some(d=>dirty(d))&&!confirm('저장하지 않은 변경이 있습니다. 로컬 초안으로 전환할까요?'))return;if(client)await client.auth.signOut();$('#connectionDialog').close();loadLocal();}
  $('#useLocal').addEventListener('click',useLocal);
  $('#connect').addEventListener('click',()=>{if(mode==='cloud')useLocal();else $('#connectionDialog').showModal();});
  $('#search').addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();renderSidebar();if(tab==='benefits')renderTab();});
  $('#cards').addEventListener('click',event=>{const button=event.target.closest('[data-card]');if(button){selected=button.dataset.card;render();}});
  $('#mainPanel').addEventListener('click',event=>{
    const tabButton=event.target.closest('[data-tab]');if(tabButton){tab=tabButton.dataset.tab;renderMain();return;}
    const edit=event.target.closest('[data-edit]');if(edit){openEditor(edit.dataset.edit);return;}
    const limit=event.target.closest('[data-limit]');if(limit){openLimit(limit.dataset.limit);return;}
    if(event.target.closest('#saveCard'))saveCard();
  });
  $('#mainPanel').addEventListener('change',event=>{if(event.target.id==='reviewFilter'){filter=event.target.value;renderTab();}});
  $('#mainPanel').addEventListener('submit',event=>{
    if(event.target.id!=='metadataForm')return;event.preventDefault();if(busy)return;const form=event.target;const doc=current();
    for(const name of ['name','issuer','reward_medium','note','review_note','review_status'])doc.card[name]=form.elements.namedItem(name).value;
    render();notify('카드 기본 정보를 초안에 적용했습니다.');
  });
  $('#editForm').addEventListener('submit',applyBenefit);
  $('#editForm').addEventListener('change',event=>{
    if(event.target.name==='rule_type'){readRuleFields();editing.rule_type=event.target.value;editing.rule_config.version=1;if(editing.rule_type==='tiered')editing.rule_config.tiers ||= [{min_amount:0,max_amount_exclusive:null,rate_percent:0,daily_cap:null,monthly_cap:null}];ruleFields();}
    if(['min_spend_state','min_amount_state'].includes(event.target.name)){const field=event.target.name.replace('_state','');const input=$('#editForm').elements.namedItem(field);input.disabled=event.target.value!=='value';}
    if(event.target.id==='targetEffect')renderTargetOptions();
  });
  $('#editForm').addEventListener('input',event=>{if(event.target.id==='targetQuery')renderTargetOptions();});
  $('#editForm').addEventListener('click',event=>{
    const remove=event.target.closest('[data-remove-target]');if(remove){editing.targets.splice(Number(remove.dataset.removeTarget),1);renderTargets();return;}
    const add=event.target.closest('[data-add-target]');if(add){editing.targets.push({target_id:add.dataset.addTarget,effect:$('#targetEffect').value});$('#targetQuery').value='';renderTargets();return;}
    if(event.target.closest('#findTarget'))renderTargetOptions();
    const removeTier=event.target.closest('[data-remove-tier]');if(removeTier){editing.rule_config.tiers=readAmountTiers();editing.rule_config.tiers.splice(Number(removeTier.dataset.removeTier),1);ruleFields();}
    if(event.target.closest('#addTier')){editing.rule_config.tiers=readAmountTiers();editing.rule_config.tiers.push({min_amount:0,max_amount_exclusive:null,rate_percent:0,daily_cap:null,monthly_cap:null});ruleFields();}
  });
  $('#limitForm').addEventListener('click',event=>{
    const remove=event.target.closest('[data-remove-limit-tier]');if(remove){editingLimit.tiers=readLimitTiers();editingLimit.tiers.splice(Number(remove.dataset.removeLimitTier),1);renderLimitTiers();}
    if(event.target.closest('#addLimitTier')){editingLimit.tiers=readLimitTiers();editingLimit.tiers.push({min_spend:0,cap:0});renderLimitTiers();}
  });
  document.addEventListener('click',event=>{const close=event.target.closest('[data-close]');if(close)document.getElementById(close.dataset.close).close();});
  for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  $('#export').addEventListener('click',exportDraft);
  $('#import').addEventListener('change',async event=>{
    try{
      const file=event.target.files[0];if(!file)return;if(busy)throw new Error('카드 저장이 끝난 뒤 가져와 주세요.');if(file.size>5*1024*1024)throw new Error('5MB 이하의 초안 파일을 선택해 주세요.');
      const data=JSON.parse(await file.text());if(data.schema_version!==1||!Array.isArray(data.documents)||!data.documents.length)throw new Error('초안 파일 형식이 맞지 않습니다.');
      for(const doc of data.documents){const errors=M.validateDocument(doc,seed.targets);if(errors.length)throw new Error(errors[0]);}
      if(new Set(data.documents.map(d=>d.card.id)).size!==data.documents.length)throw new Error('중복 카드가 있습니다.');
      if(!confirm('가져온 파일을 로컬 검수 초안으로 엽니다. 현재 변경사항을 먼저 내보냈나요?'))return;
      localStorage.setItem(key,JSON.stringify({schema_version:1,documents:data.documents,histories:{}}));
      if(client)await client.auth.signOut();mode='local';targets=M.clone(seed.targets);documents=M.clone(data.documents);saved=new Map(documents.map(d=>[d.card.id,M.clone(d)]));histories={};selected=documents[0].card.id;render();notify('가져온 초안을 이 브라우저에 저장했습니다.');
    }catch(error){notify(`가져오지 못했습니다. ${error.message}`,true);}finally{event.target.value='';}
  });
  window.addEventListener('beforeunload',event=>{if(documents.some(d=>dirty(d))){event.preventDefault();event.returnValue='';}});
  try{
    const response=await fetch('./catalog/pilot.json');if(!response.ok)throw new Error('표본 파일을 읽지 못했습니다.');seed=await response.json();
    selected=new URLSearchParams(location.search).get('card')||seed.documents[0].card.id;loadLocal();
    const config=window.YOCARD_SUPABASE;
    if(config?.url&&config?.publishableKey&&window.supabase){client=window.supabase.createClient(config.url,config.publishableKey,{auth:{storageKey:'yocard-catalog-admin-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});}
  }catch(error){$('#mainPanel').innerHTML=`<p class="empty">${esc(error.message)} 로컬 서버에서 관리자 페이지를 열어 주세요.</p>`;}
})();
