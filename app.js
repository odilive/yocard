const won = new Intl.NumberFormat('ko-KR');
const today = new Date();
const period = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const guestStorageKey = 'card-advisor-state-v1';
const syncCodeStorageKey = 'yocard-sync-code-v1';
const settingsSchemaVersion = 1;
const syncCodeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const isFirstVisit = !localStorage.getItem(guestStorageKey) && !localStorage.getItem(syncCodeStorageKey);

const initialState = {
  period,
  spends:{ nori:0, hana:100000, kakaobank:300000 },
  carrier:'skt',
  membershipGrade:'silver',
  ownedCards:[...defaultOwnedCardIds],
  favorites:['category:편의점','category:온라인쇼핑','category:기타 가맹점']
};
let state = loadState();
let lastResults = [];
let cardPickerQuery = '';
let cardSearchSubmitted = false;
let cloudClient = null;
let cloudUser = null;
let syncCode = '';
let syncCodeHash = '';
let cloudReady = false;
let cloudSaveTimer = null;

function normalizeSavedState(saved) {
  if (!saved || typeof saved !== 'object') return structuredClone(initialState);
  const savedState = { ...saved };
  delete savedState.membershipMode;
  delete savedState.usage;
  delete savedState.counts;
  delete savedState.dailyUsage;
  delete savedState.dailyCounts;
  const profile = {
    carrier: saved.carrier === 'skt' ? 'skt' : 'none',
    membershipGrade: ['vip','gold','silver','none'].includes(saved.membershipGrade) ? saved.membershipGrade : 'none',
    ownedCards: Array.isArray(saved.ownedCards)
      ? [...new Set(saved.ownedCards)].filter(cardId => cards.some(card => card.id === cardId))
      : saved.cardEnabled && typeof saved.cardEnabled === 'object'
        ? cards.filter(card => saved.cardEnabled[card.id] !== false).map(card => card.id)
        : [],
    favorites: Array.isArray(saved.favorites) ? [...new Set(saved.favorites.flatMap(key => {
      if (key === 'category:교통·주유') return ['category:교통','category:주유·충전'];
      if (key === 'category:교육·서점') return ['category:교육','category:서점'];
      if (typeof key !== 'string' || !key.startsWith('category:')) return key;
      const category = key.slice('category:'.length);
      return `category:${categoryAliases[category] || category}`;
    }))] : []
  };
  if (saved.period !== period) return { ...structuredClone(initialState), ...profile, spends:saved.spends || {} };
  return { ...structuredClone(initialState), ...savedState, ...profile };
}

function loadState(storageKey=guestStorageKey) {
  try { return normalizeSavedState(JSON.parse(localStorage.getItem(storageKey))); }
  catch { return structuredClone(initialState); }
}

function currentStorageKey() { return syncCodeHash ? `${guestStorageKey}:sync:${syncCodeHash}` : guestStorageKey; }

function saveState({ skipCloud=false }={}) {
  localStorage.setItem(currentStorageKey(), JSON.stringify(state));
  if (!skipCloud) queueCloudSave();
}
function tierValue(tiers, spend) { return [...tiers].reverse().find(([min]) => spend >= min)?.[1] || 0; }
function isCardOwned(cardId) { return state.ownedCards.includes(cardId); }
function isCardEnabled(cardId) { return isCardOwned(cardId); }

function activeMembershipBenefits() {
  if (state.carrier !== 'skt' || !membershipGradeLabels[state.membershipGrade]) return [];
  return membershipBenefitsForGrade(state.membershipGrade);
}

function membershipBenefitsForGrade(grade) {
  return membershipBenefits.map(benefit => {
    const gradeValue = property => benefit[`${property}ByGrade`]?.[grade] ?? benefit[property];
    return {
      ...benefit,
      label:benefit.labelByGrade?.[grade] || benefit.label,
      rate:gradeValue('rate'),
      unitValue:gradeValue('unitValue'),
      flat:gradeValue('flat'),
      dailyCap:gradeValue('dailyCap'),
      txnAmountCap:gradeValue('txnAmountCap'),
      conditionNote:gradeValue('conditionNote'),
      rateSchedule:benefit.rateScheduleByGrade?.[grade] || benefit.rateSchedule,
      dynamicRateLabel:benefit.dynamicRateLabelByGrade?.[grade] || benefit.dynamicRateLabel
    };
  });
}

function currentMembershipProvider(grade=state.membershipGrade) {
  const gradeLabel = membershipGradeLabels[grade] || membershipGradeLabels.silver;
  return { ...membershipProvider, name:`T멤버십 ${gradeLabel}` };
}

function membershipLabel(benefit) {
  return benefit.label;
}

function rateTierFor(benefit, amount) {
  if (!benefit.rateTiers) return null;
  return benefit.rateTiers.find(tier =>
    (!tier.minAmount || amount >= tier.minAmount) &&
    (!tier.maxAmountExclusive || amount < tier.maxAmountExclusive)
  ) || null;
}

function scheduledBenefitRate(schedule) {
  if (!schedule) return undefined;
  if (schedule.type === 'weekday') return [0,6].includes(today.getDay()) ? schedule.weekend : schedule.weekday;
  if (schedule.type === 'monthParity') return (today.getMonth() + 1) % 2 === 0 ? schedule.even : schedule.odd;
  return undefined;
}

function dateKey(date=today) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function activePromotion(benefit) {
  if (!benefit.promotion) return null;
  const current = dateKey();
  if (benefit.promotion.from && current < benefit.promotion.from) return null;
  if (benefit.promotion.through && current > benefit.promotion.through) return null;
  return benefit.promotion;
}

function effectiveBenefitProperty(benefit, property) {
  const promotion = activePromotion(benefit);
  return promotion?.[property] ?? benefit[property];
}

function percentNumber(rate) { return Number((rate * 100).toFixed(2)); }
function percentLabel(rate) { return `${percentNumber(rate)}%`; }

function benefitRate(benefit, amount) {
  const tier = rateTierFor(benefit, amount);
  return tier?.rate ?? scheduledBenefitRate(benefit.rateSchedule) ?? effectiveBenefitProperty(benefit, 'rate');
}

function benefitLimit(benefit, tier, property) {
  return tier?.[property] ?? effectiveBenefitProperty(benefit, property);
}

function benefitPlaceLabel(benefit) {
  if (benefit.displayMerchants) return benefit.displayMerchants.join(' · ');
  return benefit.merchants.includes('*')
    ? '모든 가맹점'
    : benefit.merchants.map(id => {
      const merchant = merchants.find(item => item.id === id);
      return merchant?.category === '통신' ? merchant.label.replace(/ 통신요금$/, '') : merchant?.label || id;
    }).join(' · ');
}

function benefitValueLabel(benefit) {
  if (benefit.valueLabel) return benefit.valueLabel;
  if (benefit.rateTiers) {
    const rates = benefit.rateTiers.map(tier => percentNumber(tier.rate));
    return `${Math.min(...rates)}~${Math.max(...rates)}%`;
  }
  if (activePromotion(benefit)?.rate) return percentLabel(activePromotion(benefit).rate);
  if (benefit.rateSchedule) return benefit.dynamicRateLabel || '변동 적립률';
  if (benefit.rate) return percentLabel(benefit.rate);
  if (benefit.flat) return `${won.format(benefit.flat)}원`;
  if (benefit.unitBase && benefit.unitValue) return `${won.format(benefit.unitBase)}원당 ${won.format(benefit.unitValue)}원`;
  if (benefit.formula === 'movie') return '최대 4,000원';
  return benefit.label;
}

function benefitDisplayTitle(benefit) {
  return `${benefitPlaceLabel(benefit)} · ${benefitValueLabel(benefit)}`;
}

function cardBenefitDisplayText(benefit) {
  return benefit.detailTitle || benefitDisplayTitle(benefit);
}

function rawBenefitValue(benefit, amount) {
  if (benefit.formula === 'movie') return Math.min(4000, Math.max(0, amount - 10000));
  if (benefit.unitBase && benefit.unitValue) return Math.floor(amount / benefit.unitBase) * benefit.unitValue;
  const tier = rateTierFor(benefit, amount);
  const rate = benefitRate(benefit, amount);
  const txnAmountCap = benefitLimit(benefit, tier, 'txnAmountCap');
  const baseAmount = txnAmountCap ? Math.min(amount, txnAmountCap) : amount;
  const baseRate = benefitLimit(benefit, tier, 'baseRate');
  const additionalRate = benefitLimit(benefit, tier, 'additionalRate');
  if (baseRate != null && additionalRate != null) {
    const baseValue = Math.floor(baseAmount * baseRate);
    const additionalCap = benefitLimit(benefit, tier, 'additionalMonthlyCap');
    const additionalValue = Math.floor(baseAmount * additionalRate);
    return baseValue + (additionalCap ? Math.min(additionalValue, additionalCap) : additionalValue);
  }
  return benefit.flat ? Math.min(benefit.flat, amount) : Math.floor(baseAmount * (rate || 0));
}

function assessMembershipBenefit(benefit, input) {
  const reasons = [];
  if (!matches(benefit, input.merchant)) return null;
  if (benefit.requiresMembershipEligible && !input.membershipEligible) reasons.push(benefit.eligibleTitle || 'T멤버십 대상 상품 확인 필요');
  if (benefit.minAmount && input.amount < benefit.minAmount) reasons.push(`최소 결제금액 ${won.format(benefit.minAmount)}원 이상 필요`);
  if (benefit.channel && input.channel !== benefit.channel) reasons.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 이용만 적용`);
  if (benefit.excludesEvent && input.eventItem) reasons.push('행사상품은 멤버십 할인 제외');
  if (reasons.length) return { benefit, value:0, reasons };
  let value = rawBenefitValue(benefit, input.amount);
  if (benefit.dailyCap) value = Math.min(value, benefit.dailyCap);
  if (value <= 0) reasons.push('현재 적용 가능한 혜택 없음');
  return { benefit, value, reasons };
}

function bestMembershipBenefit(input, options={}) {
  const matchesForInput = activeMembershipBenefits()
    .map(benefit => assessMembershipBenefit(benefit, input, options))
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
  return matchesForInput[0] || null;
}

function membershipStackStatus(assessment, card, benefit) {
  if (!assessment?.value) return 'needs-check';
  // T멤버십 약관이 해당 혜택을 카드와 함께 쓸 수 없다고 명시한 경우.
  if (assessment.benefit.exclusiveWithCard) return 'blocked';
  // '카드 할인'만 금지한 문구는 즉시·청구 할인에만 적용한다.
  // 캐시백·포인트 적립은 같은 문구만으로 불가라고 단정하지 않는다.
  const isCardDiscount = benefit?.benefitType === '할인' && benefit?.reward !== 'point';
  if (assessment.benefit.discountExclusiveWithCard && isCardDiscount) return 'blocked';

  // 카드·브랜드별로 확인된 예외를 가장 먼저 적용한다.
  const rule = benefit?.membershipStacking?.[assessment.benefit.id];
  if (rule?.discount) return rule.discount;

  // Deep Dream처럼 카드 약관에서 ‘할인 적용 거래’를 적립 제외로 정한 경우는 합산하지 않는다.
  if (card?.membershipDiscountBlocked || benefit?.membershipDiscountBlocked) return 'blocked';

  // 결제 후 제공되는 캐시백·포인트 적립은 T멤버십 할인과 함께 적용한다.
  if (benefit?.benefitType === '캐시백' || benefit?.reward === 'point') return 'allowed';

  // 근거가 없는 즉시·청구 할인은 불확실한 조합으로 노출하지 않는다.
  return 'blocked';
}

function canStackMembership(assessment, card, benefit) {
  return membershipStackStatus(assessment, card, benefit) === 'allowed';
}

function membershipAdjustedInput(input, assessment) {
  // T멤버십 할인 후 실제 카드 승인금액을 기준으로 카드 혜택을 계산한다.
  const discountedAmount = Math.max(0, input.amount - assessment.value);
  return { ...input, amount: discountedAmount };
}

function merchantAllowedByProfile(merchantId) {
  // 통신사 설정은 멤버십 혜택에만 사용한다. 통신요금 구매처는 검색 화면에서 직접 선택한다.
  return true;
}

function merchantHasRegisteredBenefit(merchantId) {
  const merchant = merchants.find(item => item.id === merchantId);
  const hasCardBenefit = cards.some(card => isCardEnabled(card.id) && card.benefits.some(benefit =>
    merchant && visibleBenefitMatch(benefit, merchant)
  ));
  const hasMembershipBenefit = activeMembershipBenefits().some(benefit => benefit.merchants.includes(merchantId));
  return hasCardBenefit || hasMembershipBenefit;
}

function merchantAvailableForSelection(merchant) {
  return merchantAllowedByProfile(merchant.id) && merchantHasRegisteredBenefit(merchant.id);
}

function matches(benefit, merchantId) {
  if (benefit.excludesMerchants?.includes(merchantId)) return false;
  if (benefit.merchants.includes('*') || benefit.merchants.includes(merchantId)) return true;
  const category = merchants.find(merchant => merchant.id === merchantId)?.category;
  return !!category && benefit.merchantCategories?.includes(category);
}

function visibleBenefitMatch(benefit, merchant) {
  if (benefit.excludesMerchants?.includes(merchant.id)) return false;
  const direct = benefit.merchants.includes(merchant.id) || benefit.merchantCategories?.includes(merchant.category);
  const genericMerchant = ['other-offline','other-online'].includes(merchant.id);
  return direct || (benefit.merchants.includes('*') && (genericMerchant || benefit.showAtSpecific));
}

function replacementIds(benefit) {
  if (!benefit.replaces) return [];
  return Array.isArray(benefit.replaces) ? benefit.replaces : [benefit.replaces];
}

function assessBenefit(card, benefit, input, { ignorePerformance=false, ignorePersonal=false }={}) {
  const reasons = [];
  if (!isCardEnabled(card.id)) return null;
  if (!merchantAllowedByProfile(input.merchant)) return null;
  if (benefit.requiresMilitary && !ignorePersonal) return null;
  if (!matches(benefit, input.merchant)) return null;
  const tier = rateTierFor(benefit, input.amount);
  if (benefit.rateTiers && !tier) return null;
  if (benefit.unsupported) return { benefit, value:0, reasons:['현재 자동 계산을 지원하지 않는 혜택'] };
  const spend = state.spends[card.id] || 0;
  const assumedGroupSpend = benefit.group && !benefit.allowBelowGroup ? card.groups[benefit.group]?.[0]?.[0] || 0 : 0;
  const calculationSpend = ignorePerformance ? Math.max(spend, benefit.minSpend || 0, assumedGroupSpend) : spend;
  if (!ignorePerformance && benefit.minSpend && spend < benefit.minSpend) reasons.push(`전월 실적 ${won.format(benefit.minSpend)}원 필요`);
  if (benefit.minAmount && input.amount < benefit.minAmount) reasons.push(`최소 결제금액 ${won.format(benefit.minAmount)}원 이상 필요`);
  if (benefit.maxAmountExclusive && input.amount >= benefit.maxAmountExclusive) reasons.push(`결제금액 ${won.format(benefit.maxAmountExclusive)}원 미만일 때 적용`);
  if (benefit.payment && input.payment && input.payment !== 'auto' && input.payment !== benefit.payment) reasons.push(`${paymentLabel(benefit.payment)} 결제 필요`);
  if (benefit.domesticOnly && merchants.find(merchant => merchant.id === input.merchant)?.category === '해외') reasons.push('국내 이용에만 적용');
  if (benefit.channel && input.channel !== benefit.channel) reasons.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 결제에만 적용`);
  if (benefit.requiresEvent && !input.eventItem) reasons.push('행사 대상 품목 선택 필요');
  if (reasons.length) return { benefit, value:0, reasons };

  const rate = benefitRate(benefit, input.amount);
  const baseRate = benefitLimit(benefit, tier, 'baseRate');
  const additionalRate = benefitLimit(benefit, tier, 'additionalRate');
  const hasRateComponents = baseRate != null && additionalRate != null;
  const txnAmountCap = benefitLimit(benefit, tier, 'txnAmountCap');
  const txnCap = benefitLimit(benefit, tier, 'txnCap');
  const monthlyCap = benefit.monthlyCapTiers
    ? tierValue(benefit.monthlyCapTiers, calculationSpend)
    : benefitLimit(benefit, tier, 'monthlyCap');
  const dailyCap = benefitLimit(benefit, tier, 'dailyCap');
  let baseAmount = txnAmountCap ? Math.min(input.amount, txnAmountCap) : input.amount;
  let value = hasRateComponents ? rawBenefitValue(benefit, input.amount) : benefit.flat ? Math.min(benefit.flat, input.amount) : Math.floor(baseAmount * (rate || 0));
  if (txnCap) value = Math.min(value, txnCap);
  if (monthlyCap) value = Math.min(value, monthlyCap);
  if (dailyCap) value = Math.min(value, dailyCap);
  if (benefit.group && !hasRateComponents) {
    const tiers = card.groups[benefit.group];
    const groupCap = tierValue(tiers, calculationSpend);
    if (groupCap > 0 || !benefit.allowBelowGroup) value = Math.min(value, groupCap);
  }
  if (value <= 0) reasons.push('현재 적용 가능한 혜택 없음');
  return { benefit, tier, value, reasons };
}

function calculate(input) {
  const automaticPayment = !input.payment || input.payment === 'auto';
  return cards.filter(card => isCardEnabled(card.id) && (automaticPayment || (input.payment === 'samsungmoney' ? card.id === 'samsungmoney' : card.id !== 'samsungmoney'))).map(card => {
    let items = card.benefits.map(benefit => assessBenefit(card, benefit, input)).filter(Boolean);
    const positive = items.filter(x => x.value > 0);
    const replacements = new Set(items.filter(x => x.value > 0 || x.benefit.blocksFallback).flatMap(x => replacementIds(x.benefit)));
    items = items.filter(x => !replacements.has(x.benefit.id));

    // 카카오페이 카드는 국내 중복 혜택을 허용하지 않고, 교통·통신·영화가 우선.
    if (card.id === 'kakaopay') {
      const priority = items.find(x => x.value > 0 && ['kakao-transit','kakao-phone','kakao-cgv'].includes(x.benefit.id));
      if (priority) items = items.filter(x => x.benefit.id !== 'kakao-pay');
    }
    const value = items.reduce((sum, x) => sum + x.value, 0);
    return { card, value, items, eligible:items.filter(x => x.value > 0) };
  }).sort((a,b) => b.value - a.value || a.card.name.localeCompare(b.card.name, 'ko'));
}

function calculateMembershipCombinations(input, membership) {
  if (!membership?.value) return [];
  const automaticPayment = !input.payment || input.payment === 'auto';
  const adjustedInput = membershipAdjustedInput(input, membership);
  return cards.filter(card => isCardEnabled(card.id) && (automaticPayment || (input.payment === 'samsungmoney' ? card.id === 'samsungmoney' : card.id !== 'samsungmoney'))).map(card => {
    let items = card.benefits
      .filter(benefit => canStackMembership(membership, card, benefit))
      .map(benefit => assessBenefit(card, benefit, adjustedInput))
      .filter(Boolean);
    const replacements = new Set(items.filter(item => item.value > 0 || item.benefit.blocksFallback).flatMap(item => replacementIds(item.benefit)));
    items = items.filter(item => !replacements.has(item.benefit.id));
    const value = items.reduce((sum, item) => sum + item.value, 0);
    return { card, value, items, eligible:items.filter(item => item.value > 0), membership, input:adjustedInput };
  }).filter(result => result.value > 0).sort((a,b) => b.value - a.value || a.card.name.localeCompare(b.card.name, 'ko'));
}

function nominalBenefitValue(benefit, amount) {
  if (benefit.minAmount && amount < benefit.minAmount) return 0;
  if (benefit.maxAmountExclusive && amount >= benefit.maxAmountExclusive) return 0;
  const tier = rateTierFor(benefit, amount);
  if (benefit.rateTiers && !tier) return 0;
  let value = rawBenefitValue(benefit, amount);
  if (benefitLimit(benefit, tier, 'txnCap')) value = Math.min(value, benefitLimit(benefit, tier, 'txnCap'));
  if (benefitLimit(benefit, tier, 'monthlyCap')) value = Math.min(value, benefitLimit(benefit, tier, 'monthlyCap'));
  if (benefitLimit(benefit, tier, 'dailyCap')) value = Math.min(value, benefitLimit(benefit, tier, 'dailyCap'));
  return value;
}

function shortSpend(amount) {
  return amount >= 10000 && amount % 10000 === 0 ? `${won.format(amount / 10000)}만원` : `${won.format(amount)}원`;
}

function paymentLabel(id) { return ({card:'일반 카드',kbpay:'KB Pay',nhpay:'NH pay',kakaopay:'카카오페이',samsungmoney:'삼성월렛 머니',autopay:'자동이체','woori-point-pay':'네이버페이·카카오페이·PAYCO·SSGPAY','kbank-soho-online-pay':'카카오페이·네이버페이 등 온라인 간편결제'})[id] || id; }
function channelForMerchant(merchantId) {
  if (merchantId === 'other-online') return 'online';
  if (merchantId === 'other-offline') return 'offline';
  const category = merchants.find(merchant => merchant.id === merchantId)?.category;
  return ['온라인쇼핑','구독·디지털'].includes(category) ? 'online' : 'offline';
}
function recommendedPayment(result) {
  const methods = new Set(result.eligible.map(item => item.benefit.payment).filter(Boolean));
  if (result.card.requiredPayment) methods.add(result.card.requiredPayment);
  return methods.size ? [...methods].map(paymentLabel).join(' + ') : '일반 카드';
}
function recommendedChannel(result) {
  const channels = [...new Set(result.eligible.map(item => item.benefit.channel).filter(Boolean))];
  if (!channels.length) return '';
  return channels.map(channel => channel === 'online' ? '온라인 결제' : '오프라인 결제').join(' 또는 ');
}
function inputValues() {
  const category = document.querySelector('#merchantCategory').value;
  const merchant = document.querySelector('#merchant').value;
  return {
    merchant,
    category: merchant ? '' : category,
    amount: Number(document.querySelector('#amount').value.replace(/[^0-9]/g,'')) || 0,
    payment: 'auto',
    channel: merchant ? channelForMerchant(merchant) : ['온라인쇼핑','구독·디지털'].includes(category) ? 'online' : 'offline',
    eventItem:false,
    membershipEligible:false
  };
}

function amountConditionText(benefit) {
  const conditions = [];
  if (benefit.rateTiers) {
    benefit.rateTiers.forEach(tier => {
      const range = tier.minAmount ? `${won.format(tier.minAmount)}원 이상` : `${won.format(tier.maxAmountExclusive)}원 미만`;
      conditions.push(`${range} ${percentLabel(tier.rate)}`);
    });
  } else if (benefit.minAmount) {
    conditions.push(`건당 ${won.format(benefit.minAmount)}원 이상`);
  } else {
    conditions.push('건당 이용 조건 없음');
  }
  if (benefit.minSpend) conditions.push(`전월 실적 ${won.format(benefit.minSpend)}원 이상`);
  if (benefit.payment) conditions.push(`${paymentLabel(benefit.payment)} 결제`);
  if (benefit.channel) conditions.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 결제`);
  if (benefit.requiresEvent) conditions.push(benefit.scopeLabel || '행사 대상 품목');
  if (benefit.requiresMembershipEligible) conditions.push(benefit.eligibleTitle || '지정 대상 상품');
  if (benefit.requiresMilitary) conditions.push('군 급여이체');
  if (benefit.conditionNote) conditions.push(benefit.conditionNote);
  return conditions.join(' · ');
}

function shortAmountCondition(benefit, amount) {
  const tier = rateTierFor(benefit, amount);
  if (tier?.minAmount) return `건당 ${shortSpend(tier.minAmount)} 이상`;
  if (tier?.maxAmountExclusive) return `건당 ${shortSpend(tier.maxAmountExclusive)} 미만`;
  if (benefit.minAmount) return `건당 ${shortSpend(benefit.minAmount)} 이상`;
  return '';
}

function blockedCardAlternative(input, selectedCardId) {
  const merchant = merchants.find(item => item.id === input.merchant);
  return cards.flatMap(card => {
    if (!isCardEnabled(card.id) || card.id === selectedCardId) return [];
    return card.benefits.flatMap(benefit => {
      if (benefit.unsupported || benefit.requiresMilitary || !merchant || !visibleBenefitMatch(benefit, merchant) || (benefit.channel && benefit.channel !== input.channel)) return [];
      const nextTier = benefit.rateTiers?.map(tier => tier.minAmount || 0).filter(value => value > input.amount).sort((a,b) => a - b)[0];
      const minimum = benefit.minAmount > input.amount ? benefit.minAmount : nextTier;
      const spend = state.spends[card.id] || 0;
      const needsSpend = benefit.minSpend && spend < benefit.minSpend ? benefit.minSpend : 0;
      if (!minimum && !needsSpend) return [];
      const conditions = [];
      if (needsSpend) conditions.push(`전월 ${shortSpend(needsSpend)} 이상`);
      if (minimum) conditions.push(`건당 ${shortSpend(minimum)} 이상`);
      const rate = benefitRate(benefit, minimum || input.amount) || 0;
      return [{ card, benefit, value:nominalBenefitValue(benefit, input.amount), conditions:conditions.join(' · '), score:rate || benefit.flat || 0 }];
    });
  }).sort((a,b) => b.score - a.score)[0];
}

function specificCardResults(input) {
  const merchant = merchants.find(entry => entry.id === input.merchant);
  return calculate(input).map(result => {
    const items = result.items.filter(item => merchant && visibleBenefitMatch(item.benefit, merchant));
    return { ...result, items, eligible:items.filter(item => item.value > 0), value:items.reduce((sum, item) => sum + item.value, 0) };
  }).filter(result => result.items.length).sort((a,b) => b.value - a.value || a.card.name.localeCompare(b.card.name, 'ko'));
}

function categorySampleAmount(category) {
  return categorySampleAmounts[category] || 10000;
}

function categoryPotential(merchant, category) {
  const sampleInput = { merchant:merchant.id, amount:categorySampleAmount(category), payment:'auto', channel:channelForMerchant(merchant.id), eventItem:false, membershipEligible:false };
  const cardPotentials = cards.flatMap(card => card.benefits
    .filter(benefit => isCardEnabled(card.id) && !benefit.requiresMilitary && visibleBenefitMatch(benefit, merchant) && (!benefit.channel || benefit.channel === sampleInput.channel))
    .map(benefit => ({ card, benefit, value:nominalBenefitValue(benefit, sampleInput.amount) }))
  );
  const provider = currentMembershipProvider();
  const membershipPotentials = activeMembershipBenefits()
    .filter(benefit => benefit.merchants.includes(merchant.id) && (!benefit.channel || benefit.channel === sampleInput.channel))
    .map(benefit => ({ card:provider, benefit:{ ...benefit, label:membershipLabel(benefit) }, value:nominalBenefitValue(benefit, sampleInput.amount) }));
  return [...cardPotentials, ...membershipPotentials].sort((a,b) => b.value - a.value)[0];
}

function renderCategoryComparison(input) {
  const container = document.querySelector('#results');
  const categoryMerchants = merchants.filter(merchant => merchant.category === input.category && merchantAllowedByProfile(merchant.id));
  const entries = categoryMerchants.map(merchant => {
    if (input.amount) {
      const merchantInput = { ...input, merchant:merchant.id, channel:channelForMerchant(merchant.id) };
      const results = specificCardResults(merchantInput);
      const best = results.find(result => result.value > 0);
      const membership = bestMembershipBenefit(merchantInput);
      const membershipIsBest = membership?.value > (best?.value || 0);
      const blocked = blockedCardAlternative(merchantInput, best?.card.id || '');
      return membershipIsBest
        ? { merchant, card:currentMembershipProvider(), value:membership.value, detail:membershipLabel(membership.benefit), active:true }
        : best
        ? { merchant, card:best.card, value:best.value, detail:best.eligible[0] ? cardBenefitDisplayText(best.eligible[0].benefit) : '', active:true }
        : blocked ? { merchant, card:blocked.card, detail:blocked.conditions, active:false }
        : null;
    }
    const potential = categoryPotential(merchant, input.category);
    return potential ? { merchant, card:potential.card, detail:`${cardBenefitDisplayText(potential.benefit)} · ${amountConditionText(potential.benefit)}`, active:false } : null;
  }).filter(Boolean).sort((a,b) => Number(b.active) - Number(a.active) || (b.value || 0) - (a.value || 0));
  const lines = entries.slice(0, 10).map(entry => `<div class="alternative category-comparison${entry.active ? '' : ' alternative-threshold'}"><span><strong>${escapeHtml(entry.merchant.label)}</strong><small>${escapeHtml(entry.card.name)} · ${escapeHtml(entry.detail)}</small></span><strong>${entry.active ? `${won.format(entry.value)}원` : '조건 확인'}</strong></div>`).join('');
  container.innerHTML = `<div class="recommendation amount-guide"><span class="best-label">${escapeHtml(input.category)} 전체 비교</span><h3 class="best-card-name">내 카드로 유리한 브랜드</h3><p class="combination-note">${input.amount ? '입력한 금액과 현재 실적을 반영한 결과입니다.' : '금액 미정: 브랜드별 대표 혜택과 조건을 비교합니다.'}</p><div class="alternatives category-comparisons">${lines || '<p class="empty-result">비교할 브랜드별 혜택이 아직 없어요.</p>'}</div></div>`;
}

function renderAmountGuide(input) {
  const container = document.querySelector('#results');
  const merchant = merchants.find(item => item.id === input.merchant);
  const cardItems = cards.flatMap(card => {
    if (!isCardEnabled(card.id)) return [];
    return card.benefits
      .filter(benefit => merchant && visibleBenefitMatch(benefit, merchant) && (!benefit.channel || benefit.channel === input.channel))
      .map(benefit => ({ card, benefit }));
  });
  const provider = currentMembershipProvider();
  const membershipItems = activeMembershipBenefits()
    .filter(benefit => benefit.merchants.includes(input.merchant) && (!benefit.channel || benefit.channel === input.channel))
    .map(benefit => ({ card:provider, benefit:{ ...benefit, label:membershipLabel(benefit) }, membership:true }));
  const items = [...cardItems, ...membershipItems];
  const list = items.length
    ? `<ul class="benefit-lines amount-guide-lines">${items.map(item => `<li><strong>${escapeHtml(item.card.name)} · ${escapeHtml(item.membership ? membershipLabel(item.benefit) : cardBenefitDisplayText(item.benefit))}</strong><small>${escapeHtml(amountConditionText(item.benefit))}</small></li>`).join('')}</ul>`
    : '<p class="empty-result">등록된 결제수단 중 이 구매처에 바로 적용되는 혜택은 아직 없어요.</p>';
  container.innerHTML = `<div class="recommendation amount-guide"><span class="best-label">조건 안내 · ${escapeHtml(merchant?.label || '구매처')}</span><h3 class="best-card-name">금액을 입력하면 예상 혜택을 계산해요</h3><p class="combination-note">아래는 해당 결제처에서 확인할 카드별 결제금액·실적 조건입니다. 금액 없이도 조건을 비교할 수 있어요.</p>${list}</div>`;
}

function strategyConditions(card, benefit, input, { includeSpend=true }={}) {
  const conditions = [];
  if (includeSpend && benefit.minSpend) conditions.push(`전월 ${shortSpend(benefit.minSpend)} 이상`);
  const amountCondition = shortAmountCondition(benefit, input.amount || categorySampleAmount(input.category || merchants.find(item => item.id === input.merchant)?.category));
  if (amountCondition) conditions.push(amountCondition);
  if (benefit.payment) conditions.push(`${paymentLabel(benefit.payment)} 결제`);
  if (benefit.channel) conditions.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 결제`);
  if (benefit.requiresEvent) conditions.push(benefit.scopeLabel || '행사 대상 품목');
  if (benefit.requiresMembershipEligible) conditions.push(benefit.eligibleTitle || '지정 상품');
  if (benefit.excludesEvent) conditions.push('행사 메뉴 제외');
  if (benefit.weekday === 2) conditions.push('매주 화요일');
  if (benefit.requiresMilitary) conditions.push('군 급여이체');
  if (activePromotion(benefit)?.tag) conditions.push(activePromotion(benefit).tag);
  if (benefit.conditionNote) conditions.push(benefit.conditionNote);
  return conditions;
}

function strategyScore(benefit, input) {
  const sample = input.amount || categorySampleAmount(input.category || merchants.find(item => item.id === input.merchant)?.category);
  return nominalBenefitValue(benefit, sample) || benefitRate(benefit, sample) * sample || benefit.flat || benefit.unitValue || 0;
}

function merchantStrategies(input, merchant) {
  const merchantInput = { ...input, merchant:merchant.id, channel:channelForMerchant(merchant.id) };
  const cardStrategies = cards.flatMap(card => {
    const strategies = card.benefits.filter(benefit =>
      isCardEnabled(card.id) &&
      visibleBenefitMatch(benefit, merchant) &&
      (!benefit.channel || benefit.channel === merchantInput.channel)
    )
    .map(benefit => {
      const strategyInput = { ...merchantInput, eventItem:!!benefit.requiresEvent, membershipEligible:!!benefit.requiresMembershipEligible };
      const assessment = merchantInput.amount ? assessBenefit(card, benefit, strategyInput, { ignorePerformance:true, ignorePersonal:true }) : null;
      const performanceMet = !benefit.minSpend || (state.spends[card.id] || 0) >= benefit.minSpend;
      const personalMet = !benefit.requiresMilitary;
      const active = performanceMet && personalMet;
      return { key:`card:${card.id}:${benefit.id}`, merchant, card, benefit, assessment, active, value:assessment?.value || 0, score:strategyScore(benefit, merchantInput), conditions:strategyConditions(card, benefit, merchantInput), scenarioLabel:benefit.scopeLabel ? `${benefit.scopeLabel}인 경우` : '' };
    });
    if (!merchantInput.amount) return strategies;
    const replacements = new Set(strategies.filter(strategy => strategy.assessment?.value > 0 || strategy.benefit.blocksFallback).flatMap(strategy => replacementIds(strategy.benefit)));
    return strategies.filter(strategy => !replacements.has(strategy.benefit.id));
  });
  const provider = currentMembershipProvider();
  const membershipStrategies = activeMembershipBenefits().filter(benefit => benefit.merchants.includes(merchant.id)).map(benefit => {
    const strategyInput = { ...merchantInput, eventItem:false, membershipEligible:!!benefit.requiresMembershipEligible };
    const assessment = merchantInput.amount ? assessMembershipBenefit(benefit, strategyInput) : null;
    const active = true;
    return { key:`membership:${benefit.id}`, merchant, card:provider, benefit:{ ...benefit, label:membershipLabel(benefit) }, membershipBenefit:benefit, assessment, active, value:assessment?.value || 0, score:strategyScore(benefit, merchantInput), conditions:strategyConditions(provider, benefit, merchantInput, { includeSpend:false }), scenarioLabel:benefit.scopeLabel ? `${benefit.scopeLabel}인 경우` : '' };
  });
  const combinations = membershipStrategies.flatMap(membership => cardStrategies.flatMap(cardStrategy => {
    const stackAssessment = { benefit:membership.membershipBenefit, value:1 };
    if (!canStackMembership(stackAssessment, cardStrategy.card, cardStrategy.benefit)) return [];
    const combinationInput = { ...merchantInput, eventItem:!!cardStrategy.benefit.requiresEvent, membershipEligible:!!membership.membershipBenefit.requiresMembershipEligible };
    const membershipAssessment = merchantInput.amount ? assessMembershipBenefit(membership.membershipBenefit, combinationInput) : null;
    const adjustedInput = merchantInput.amount && membershipAssessment?.value ? membershipAdjustedInput(combinationInput, membershipAssessment) : combinationInput;
    const adjusted = merchantInput.amount ? assessBenefit(cardStrategy.card, cardStrategy.benefit, adjustedInput, { ignorePerformance:true, ignorePersonal:true }) : null;
    const active = cardStrategy.active;
    const scopeLabel = [...new Set([membership.membershipBenefit.scopeLabel, cardStrategy.benefit.scopeLabel].filter(Boolean))].join(' · ');
    return [{ key:`combo:${membership.membershipBenefit.id}:${cardStrategy.card.id}:${cardStrategy.benefit.id}`, merchant, card:cardStrategy.card, benefit:cardStrategy.benefit, membership:{ ...membership, assessment:membershipAssessment }, assessment:adjusted, active, value:(membershipAssessment?.value || 0) + (adjusted?.value || 0), score:membership.score + cardStrategy.score, conditions:[...membership.conditions, ...cardStrategy.conditions], combination:true, scenarioLabel:scopeLabel ? `${scopeLabel}인 경우` : '', cardValue:cardStrategy.assessment?.value || 0 }];
  }));
  const standaloneCards = cardStrategies.flatMap(cardStrategy => {
    const related = combinations.find(item => item.card.id === cardStrategy.card.id && item.benefit.id === cardStrategy.benefit.id);
    if (!related) {
      const narrowerMembership = membershipStrategies.find(item => item.membershipBenefit.outsideScopeLabel);
      if (!narrowerMembership) return [cardStrategy];
      return [{ ...cardStrategy, scenarioLabel:`${narrowerMembership.membershipBenefit.outsideScopeLabel}에도 적용`, fallbackScenario:true }];
    }
    const outsideScope = related.membership.membershipBenefit.outsideScopeLabel;
    return outsideScope ? [{ ...cardStrategy, scenarioLabel:`${outsideScope}인 경우`, fallbackScenario:true }] : [];
  });
  const standaloneMemberships = membershipStrategies.flatMap(membership => {
    const related = combinations.filter(item => item.membership.membershipBenefit.id === membership.membershipBenefit.id);
    if (!related.length) return [membership];
    const scopedFallback = related.find(item => item.benefit.outsideScopeLabel);
    if (scopedFallback) return [{ ...membership, scenarioLabel:`${scopedFallback.benefit.outsideScopeLabel}인 경우`, fallbackScenario:true }];
    const cardAppliesNow = related.some(item => item.active && (!merchantInput.amount || item.cardValue > 0));
    if (cardAppliesNow) return [];
    const membershipScope = membership.membershipBenefit.scopeLabel;
    return [{ ...membership, scenarioLabel:membershipScope ? `${membershipScope}이지만 카드 조건을 충족하지 못한 경우` : '카드 혜택 조건을 충족하지 못한 경우' }];
  });
  return [...combinations, ...standaloneCards, ...standaloneMemberships];
}

function selectMerchantStrategies(strategies, input) {
  const rank = list => [...list].sort((a,b) => (input.amount ? b.value - a.value : b.score - a.score));
  return rank(strategies);
}

function strategyMembershipBenefit(strategy) {
  return strategy.membershipBenefit || strategy.membership?.membershipBenefit || null;
}

function categoryStrategyGroupKey(strategy, input) {
  const membershipBenefit = strategyMembershipBenefit(strategy);
  const cardKey = strategy.membershipBenefit
    ? 'membership-only'
    : `${strategy.card.id}:${strategy.benefit.id}:${benefitValueLabel(strategy.benefit)}`;
  const membershipKey = membershipBenefit
    ? `${benefitValueLabel(membershipBenefit)}:${membershipBenefit.isMaximum ? 'maximum' : 'fixed'}`
    : 'no-membership';
  const calculatedKey = input.amount
    ? `${strategy.value}:${strategy.assessment?.value || 0}:${strategy.membership?.assessment?.value || 0}`
    : 'amount-unknown';
  return `${strategy.active}:${strategy.combination ? 'combination' : 'single'}:${strategy.fallbackScenario ? 'fallback' : 'standard'}:${cardKey}:${membershipKey}:${calculatedKey}`;
}

function groupedStrategies(input) {
  const targets = input.category ? merchants.filter(merchant => merchant.category === input.category && merchantAvailableForSelection(merchant)) : [merchants.find(merchant => merchant.id === input.merchant)].filter(Boolean);
  const strategies = targets.flatMap(merchant => merchantStrategies(input, merchant));
  const selected = targets.flatMap(merchant => selectMerchantStrategies(strategies.filter(strategy => strategy.merchant.id === merchant.id), input));
  if (!input.category) return selected;
  const merged = new Map();
  selected.forEach(strategy => {
    const groupKey = categoryStrategyGroupKey(strategy, input);
    const group = merged.get(groupKey) || { ...strategy, merchants:[] };
    if (!group.merchants.some(merchant => merchant.id === strategy.merchant.id)) group.merchants.push(strategy.merchant);
    merged.set(groupKey, group);
  });
  return [...merged.values()].map(strategy => ({
    ...strategy,
    categoryGrouped:true,
    categoryMembershipGrouped:!!strategyMembershipBenefit(strategy) && strategy.merchants.length > 1
  }));
}

function strategyTitle(strategy) {
  return strategy.card.name;
}

function conciseBenefitValue(benefit) {
  const label = benefitValueLabel(benefit);
  return benefit.reward === 'point' ? `${label} 적립` : label;
}

function strategyValueText(strategy, input) {
  if (strategy.benefit.unsupported) return strategy.benefit.resultText || strategy.benefit.label;
  if (!input.amount) {
    if (strategy.combination) {
      return `${conciseBenefitValue(strategy.membership.membershipBenefit)} + ${conciseBenefitValue(strategy.benefit)}`;
    }
    return conciseBenefitValue(strategy.benefit);
  }
  const unit = !strategy.combination && strategy.benefit.reward === 'point' ? 'P' : '원';
  const maximum = strategy.benefit.isMaximum || (strategy.combination && strategy.membership.membershipBenefit.isMaximum);
  return `${maximum ? '최대 ' : ''}${won.format(strategy.value || 0)}${unit}`;
}

function renderUnifiedResults(input) {
  const container = document.querySelector('#results');
  const strategies = groupedStrategies(input);
  const order = list => list.sort((a,b) => (input.amount ? b.value - a.value : b.score - a.score));
  const now = order(strategies.filter(strategy => strategy.active));
  const later = order(strategies.filter(strategy => !strategy.active));
  const row = strategy => {
    const target = strategy.merchants?.map(merchant => merchant.label).join(' · ') || strategy.merchant.label;
    const targetAndScenario = strategy.scenarioLabel && !strategy.categoryMembershipGrouped ? `${target} · ${strategy.scenarioLabel}` : target;
    const value = strategyValueText(strategy, input);
    const groupedConditions = strategy.categoryMembershipGrouped
      ? [
          ...(strategy.combination ? strategyConditions(strategy.card, strategy.benefit, input) : []),
          'T멤버십 브랜드별 대상 상품·이용 횟수·한도는 세부 브랜드 선택 시 확인'
        ]
      : strategy.conditions;
    const conditions = [...new Set(groupedConditions)].join(' · ') || '별도 이용 조건 없음';
    const isMembershipOnly = strategy.card.id === membershipProvider.id;
    const detailAttribute = isMembershipOnly ? 'data-result-membership-detail' : `data-result-card-detail="${escapeHtml(strategy.card.id)}"`;
    const detailLabel = isMembershipOnly ? `${strategy.card.name} 혜택 보기` : `${strategy.card.name} 전체 혜택 보기`;
    const cardTitle = `<button class="strategy-detail-link" type="button" ${detailAttribute} aria-label="${escapeHtml(detailLabel)}"><span>${escapeHtml(strategyTitle(strategy))}</span><span aria-hidden="true">↗</span></button>`;
    const rowMembershipBenefit = strategyMembershipBenefit(strategy);
    const membershipText = strategy.categoryMembershipGrouped
      ? `${benefitValueLabel(rowMembershipBenefit)} 할인`
      : membershipLabel(rowMembershipBenefit || {});
    const membershipAddon = strategy.combination ? `<button class="membership-addon" type="button" data-result-membership-detail aria-label="T멤버십 전체 혜택 보기"><span>+ T멤버십</span>${escapeHtml(membershipText)}<span class="detail-arrow" aria-hidden="true">↗</span></button>` : '';
    const valueBreakdown = strategy.combination && input.amount && !strategy.benefit.unsupported
      ? `<p class="strategy-breakdown">카드 ${won.format(strategy.assessment?.value || 0)}원 + T멤버십 ${won.format(strategy.membership.assessment?.value || 0)}원</p>`
      : '';
    const totalLabel = strategy.combination ? '<span class="strategy-total-label">총 혜택</span>' : '';
    return `<article class="strategy-row${strategy.combination ? ' is-combination' : ''}"><div class="strategy-main"><span class="strategy-target">${escapeHtml(targetAndScenario)}</span><h3>${cardTitle}</h3>${valueBreakdown}</div><strong>${totalLabel}${escapeHtml(value)}</strong>${membershipAddon}<small class="strategy-conditions">${escapeHtml(conditions)}</small></article>`;
  };
  const section = (title, note, items, empty, type) => {
    const content = items.length ? items.map(row).join('') : `<p class="strategy-empty">${empty}</p>`;
    return `<section class="strategy-section strategy-section-${type}"><div class="strategy-section-heading"><span class="strategy-section-state">${type === 'current' ? '현재 적용' : '현재 적용 불가'}</span><div><h3>${title}</h3><p>${note}</p></div></div>${content}</section>`;
  };
  const targetName = input.category || merchants.find(merchant => merchant.id === input.merchant)?.label || '구매처';
  container.innerHTML = `<div class="recommendation strategy-results"><span class="best-label">${escapeHtml(targetName)} · ${input.amount ? `${won.format(input.amount)}원` : '금액 미정'}</span>${section('지금 받을 수 있는 혜택', '현재 전월 실적으로 바로 적용돼요.', now, '현재 설정에서 바로 적용되는 혜택이 없어요.', 'current')} ${section('전월 실적을 채우면 받을 수 있어요', '아래 혜택은 아직 결제에 적용되지 않아요.', later, '추가로 충족할 전월 실적 조건이 없어요.', 'later')}</div>`;
  container.querySelectorAll('[data-result-card-detail]').forEach(button => button.addEventListener('click', () => openCardDetail(button.dataset.resultCardDetail)));
  container.querySelectorAll('[data-result-membership-detail]').forEach(button => button.addEventListener('click', openMembershipDetail));
}

function renderResults(input) {
  lastResults = [];
  if (!input.category && !input.merchant) {
    document.querySelector('#results').innerHTML = '<div class="result-start"><strong>구매처를 선택해 주세요.</strong><p>카테고리와 세부 브랜드를 고르면 받을 수 있는 혜택을 비교해 드려요.</p></div>';
    updateFavoriteToggle();
    return;
  }
  renderUnifiedResults(input);
  updateFavoriteToggle();
}

function renderGroupLimitColumns(columns) {
  const thresholds = [...new Set(columns.flatMap(column => column.tiers.map(([spend]) => spend)))].sort((a, b) => a - b);
  const tableClass = columns.length > 1 ? 'tier-table tier-table-wide' : 'tier-table';
  return `<div class="tier-table-wrap"><table class="${tableClass}"><thead><tr><th>전월 실적</th>${columns.map(column => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr></thead><tbody>${thresholds.map(spend => `<tr><td>${spend ? `${won.format(spend)}원 이상` : '조건 없음'}</td>${columns.map(column => `<td>${won.format(tierValue(column.tiers, spend))}원</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function renderGroupLimitTable(card, groupId, tiers) {
  return renderGroupLimitColumns([
    { label:card.groupLabels?.[groupId] || '월 통합 한도', tiers },
    ...(card.groupCapColumns?.[groupId] || [])
  ]);
}

function openCardDetail(cardId) {
  const card = cards.find(item => item.id === cardId);
  if (!card) return;
  document.querySelector('#cardDetailTitle').textContent = card.name;
  const rewardKindLabel = card.rewardMedium ? `${card.kind}(${card.rewardMedium})` : card.kind;
  document.querySelector('#cardDetailMeta').textContent = [card.issuer, rewardKindLabel]
    .filter(Boolean)
    .join(' · ');

  const groupEntries = Object.entries(card.groups || {});
  const groupTables = card.combineGroupLimitTables
    ? renderGroupLimitColumns(groupEntries.map(([groupId, tiers]) => ({ label:card.groupLabels?.[groupId] || '월 통합 한도', tiers })))
    : groupEntries.map(([groupId, tiers]) => renderGroupLimitTable(card, groupId, tiers)).join('');
  const groupHtml = groupEntries.length ? `<section class="rule-section"><h3>월 한도</h3>${groupTables}</section>` : '';
  const detailBenefits = card.benefits.filter(benefit => !benefit.hideInDetail);
  const benefitsHtml = detailBenefits.map(benefit => {
    const rawTags = benefit.detailTags || describeBenefit(benefit, card);
    const tags = card.groupCapColumns ? rawTags.filter(tag => !tag.includes('통합 월 한도')) : rawTags;
    const rewardName = benefit.reward === 'point' ? '적립' : benefit.benefitType;
    const rewardBadge = rewardName ? `<span class="reward-badge">${escapeHtml(rewardName)}</span>` : '';
    return `<article class="benefit-rule"><div class="benefit-rule-head"><h4>${escapeHtml(benefit.detailTitle || benefitDisplayTitle(benefit))}</h4>${rewardBadge}</div><div class="rule-tags">${tags.map(tag => `<span${tag === '전월 실적 조건 없음' ? ' class="no-performance-condition"' : ''}>${escapeHtml(tag)}</span>`).join('')}</div></article>`;
  }).join('');
  const note = card.note ? `<div class="verification-note">${escapeHtml(card.note)}</div>` : '';
  const sourceUrl = cardSourceUrls[card.id];
  const gorillaUrl = cardGorillaUrls[card.id];
  const referenceUrl = gorillaUrl || cardReferenceUrls[card.id];
  const referenceLabel = gorillaUrl ? '카드고릴라에서 대조하기' : 'Samsung Members 혜택 안내';
  const referenceLink = referenceUrl ? `<a class="source-link secondary" href="${referenceUrl}" target="_blank" rel="noreferrer">${referenceLabel} <span aria-hidden="true">↗</span></a>` : '';
  const additionalSources = typeof cardAdditionalSourceUrls === 'undefined' ? [] : cardAdditionalSourceUrls[card.id] || [];
  const additionalLinks = additionalSources.map(source => `<a class="source-link secondary" href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} <span aria-hidden="true">↗</span></a>`).join('');
  document.querySelector('#cardDetailContent').innerHTML = `<div class="verification-note">카드사 상품 안내를 바탕으로 정리한 주요 혜택과 적용 조건입니다. 실제 적용은 카드사의 가맹점 분류와 세부 약관에 따릅니다.</div>${groupHtml}<section class="rule-section"><h3>정리된 혜택 ${detailBenefits.length}개</h3><div class="benefit-rule-list">${benefitsHtml}</div></section>${note}<section class="rule-section"><h3>정보 출처</h3><p>${escapeHtml(card.source)}</p><div class="source-links"><a class="source-link" href="${sourceUrl}" target="_blank" rel="noreferrer">공식 안내 열기 <span aria-hidden="true">↗</span></a>${referenceLink}${additionalLinks}</div></section>`;
  document.querySelector('#cardDialog').showModal();
  document.querySelector('#cardDialog .dialog-card').scrollTop = 0;
}

function describeMembershipBenefit(benefit) {
  const tags = [];
  if (benefit.minAmount) tags.push(`이용금액 ${won.format(benefit.minAmount)}원 이상`);
  else tags.push('이용금액 조건 없음');
  if (benefit.txnAmountCap) tags.push(`혜택 계산 대상 결제금액 최대 ${won.format(benefit.txnAmountCap)}원`);
  if (benefit.dailyCap) tags.push(`일 한도 ${won.format(benefit.dailyCap)}원`);
  if (benefit.dailyCount) tags.push(`일 ${benefit.dailyCount}회`);
  if (benefit.monthlyCount) tags.push(`월 ${benefit.monthlyCount}회`);
  if (benefit.weekday === 2) tags.push('매주 화요일');
  if (benefit.channel) tags.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 이용`);
  if (benefit.requiresMembershipEligible) tags.push(`${benefit.scopeLabel || '지정 상품·메뉴'}만 적용`);
  if (benefit.excludesEvent) tags.push('행사 메뉴 제외');
  if (benefit.conditionNote) tags.push(benefit.conditionNote);
  return tags;
}

function openMembershipDetail() {
  const selectedGrade = document.querySelector('#membershipGrade')?.value;
  const grade = membershipGradeLabels[selectedGrade]
    ? selectedGrade
    : membershipGradeLabels[state.membershipGrade] ? state.membershipGrade : 'silver';
  const provider = currentMembershipProvider(grade);
  const displayBenefits = membershipBenefitsForGrade(grade);
  document.querySelector('#cardDetailTitle').textContent = provider.name;
  document.querySelector('#cardDetailMeta').textContent = `${provider.issuer} · ${provider.kind} · ${membershipCheckedAt} 확인`;
  const renderBenefit = benefit => {
    const tags = describeMembershipBenefit(benefit);
    const rewardName = '할인';
    const sourceUrl = benefit.sourceUrl || membershipSourceUrl;
    return `<article class="benefit-rule"><div class="benefit-rule-head"><h4>${escapeHtml(membershipLabel(benefit))}</h4><span class="reward-badge">${rewardName}</span></div><div class="rule-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div><a class="benefit-source-link" href="${sourceUrl}" target="_blank" rel="noreferrer">공식 조건 확인 <span aria-hidden="true">↗</span></a></article>`;
  };
  const categoryOrder = ['베이커리','외식','카페','패스트푸드','편의점','대형마트','영화','놀이공원'];
  const categoryHtml = categoryOrder.map(category => {
    const benefits = displayBenefits.filter(benefit => benefit.membershipCategory === category);
    return `<section class="rule-section"><h3>${escapeHtml(category)} ${benefits.length}곳</h3><div class="benefit-rule-list">${benefits.map(renderBenefit).join('')}</div></section>`;
  }).join('');
  document.querySelector('#cardDetailContent').innerHTML = `<div class="verification-note">주요 T멤버십 혜택을 선별해 정리했습니다. 실제 적용 조건은 이용 전에 공식 안내를 확인해 주세요.</div>${categoryHtml}<section class="rule-section"><h3>정보 출처</h3><p>SKT T멤버십 공식 혜택 안내 · 총 ${membershipBenefits.length}곳 · ${membershipCheckedAt} 확인</p><div class="source-links"><a class="source-link" href="${membershipCategoryUrls.all}" target="_blank" rel="noreferrer">전체 공식 안내 열기 <span aria-hidden="true">↗</span></a></div></section>`;
  document.querySelector('#cardDialog').showModal();
  document.querySelector('#cardDialog .dialog-card').scrollTop = 0;
}

function describeBenefit(benefit, card) {
  const tags = [];
  const txnCap = benefitLimit(benefit, null, 'txnCap');
  const txnAmountCap = benefitLimit(benefit, null, 'txnAmountCap');
  const dailyCap = benefitLimit(benefit, null, 'dailyCap');
  const monthlyCap = benefitLimit(benefit, null, 'monthlyCap');
  const additionalMonthlyCap = benefitLimit(benefit, null, 'additionalMonthlyCap');
  if (benefit.minSpend) tags.push(`전월 실적 ${won.format(benefit.minSpend)}원 이상`); else tags.push('전월 실적 조건 없음');
  if (benefit.rateTiers) {
    const rangeLabel = tier => tier.minAmount ? `${won.format(tier.minAmount)}원 이상` : `${won.format(tier.maxAmountExclusive)}원 미만`;
    benefit.rateTiers.forEach(tier => {
      const limits = [tier.dailyCap && `일 한도 ${won.format(tier.dailyCap)}원`, tier.monthlyCap && `월 한도 ${won.format(tier.monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`].filter(Boolean);
      tags.push(`결제금액 ${rangeLabel(tier)} · ${percentLabel(tier.rate)}${limits.length ? ` · ${limits.join(' · ')}` : ''}`);
    });
  }
  if (benefit.minAmount) tags.push(`건당 이용금액 ${won.format(benefit.minAmount)}원 이상`);
  else if (benefit.maxAmountExclusive) tags.push(`건당 이용금액 ${won.format(benefit.maxAmountExclusive)}원 미만`);
  else tags.push('건당 이용 조건 없음');
  if (txnCap) tags.push(`건당 한도 ${won.format(txnCap)}원`);
  if (txnAmountCap) tags.push(`혜택 계산 대상 결제금액 최대 ${won.format(txnAmountCap)}원`);
  if (!benefit.rateTiers && dailyCap) tags.push(`일 한도 ${won.format(dailyCap)}원`);
  if (benefit.dailyCount) tags.push(`일 ${benefit.dailyCount}회`);
  const monthlyCapIsDerivedFromCount = benefit.flat && benefit.monthlyCount && monthlyCap === benefit.flat * benefit.monthlyCount;
  if (benefit.monthlyCount) {
    const fixedAmountLabel = benefit.flat ? ` (${won.format(benefit.flat * benefit.monthlyCount)}원)` : '';
    tags.push(`월 ${benefit.monthlyCount}회${fixedAmountLabel}${benefit.group ? ' (통합한도 적용)' : ''}`);
    if (monthlyCap && !monthlyCapIsDerivedFromCount) tags.push(`월 한도 ${won.format(monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`);
  } else if (monthlyCap) tags.push(`월 한도 ${won.format(monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`);
  else if (additionalMonthlyCap) { /* 아래에서 추가 적립 한도로 구분해 표시 */ }
  else if (benefit.group) tags.push('월 한도 통합한도 적용');
  else tags.push('월 한도 없음 (통합한도 미적용)');
  if (additionalMonthlyCap) tags.push(`추가 적립 월 한도 ${won.format(additionalMonthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`);
  if (benefit.annualCount) tags.push(`연 ${benefit.annualCount}회`);
  if (benefit.specialCount) tags.push(`월 ${benefit.specialCount.join('·')}번째 결제`);
  if (benefit.rateSchedule?.type === 'weekday') tags.push('결제일 기준 평일·주말 적용');
  const paymentShownInTitle = benefit.payment && (benefit.detailTitle?.startsWith(paymentLabel(benefit.payment)) || benefit.displayMerchants?.includes(paymentLabel(benefit.payment)));
  if (benefit.payment && !paymentShownInTitle) tags.push(`${paymentLabel(benefit.payment)}만 적용`);
  if (benefit.channel) tags.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 결제만 적용`);
  if (benefit.domesticOnly) tags.push('국내 이용만 적용');
  if (benefit.requiresEvent) tags.push('행사 대상 품목만 적용');
  if (benefit.requiresMilitary) tags.push('군 급여이체 조건 필요');
  if (activePromotion(benefit)?.tag) tags.push(activePromotion(benefit).tag);
  else if (benefit.promotion?.through) tags.push(`${benefit.promotion.through.replaceAll('-', '.')} 프로모션 종료 · 현재 기본 적립률 적용`);
  if (benefit.conditionNote) tags.push(benefit.conditionNote);
  if (benefit.unlimited) tags.push(`기본 ${benefit.reward === 'point' ? '적립' : '캐시백'} 한도 없음`);
  if (benefit.replaces) tags.push('상위 적립률 적용 시 기본 적립 대체');
  return tags;
}

function performanceThresholds(card) {
  const values = new Set();
  card.benefits.forEach(benefit => { if (benefit.minSpend) values.add(benefit.minSpend); });
  Object.values(card.groups || {}).flat().forEach(([minimum]) => { if (minimum > 0) values.add(minimum); });
  return [...values].sort((a, b) => a - b);
}

function savedPerformanceTier(card) {
  if (!Object.prototype.hasOwnProperty.call(state.spends, card.id)) return '';
  const saved = Number(state.spends[card.id]) || 0;
  const thresholds = performanceThresholds(card);
  return String([...thresholds].reverse().find(value => saved >= value) || 0);
}

function statusCardRow(card) {
  const thresholds = performanceThresholds(card);
  const performanceControl = thresholds.length
    ? `<select id="spend-${card.id}" data-card="${card.id}"><option value="">미설정</option><option value="0">${shortSpend(thresholds[0])} 미만</option>${thresholds.map(value => `<option value="${value}">${shortSpend(value)} 이상</option>`).join('')}</select>`
    : '<div class="no-performance">실적 조건 없음</div>';
  return `<div class="status-row" data-owned-card="${card.id}"><button class="status-remove-card" type="button" data-remove-owned-card="${card.id}" aria-label="${escapeHtml(card.name)} 보유 카드에서 제거" title="보유 카드에서 제거">×</button><div class="status-card-main"><button class="status-card-name" type="button" data-card-detail="${card.id}" aria-label="${escapeHtml(card.name)} 전체 혜택 보기"><span><strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(card.issuer)} · ${escapeHtml(card.kind)}</small></span></button></div><div class="status-controls"><label for="spend-${card.id}">전월 실적</label>${performanceControl}</div></div>`;
}

function ownedCardIdsInForm() {
  return [...document.querySelectorAll('#statusList [data-owned-card]')].map(row => row.dataset.ownedCard);
}

function ensureStatusEmptyMessage() {
  const list = document.querySelector('#statusList');
  if (!list.querySelector('[data-owned-card]')) list.innerHTML = '<p class="status-empty">아직 추가한 카드가 없어요. 위 검색창에서 보유 카드를 찾아 추가해 주세요.</p>';
}

function bindStatusCardRow(row) {
  row.querySelector('[data-card-detail]')?.addEventListener('click', buttonEvent => openCardDetail(buttonEvent.currentTarget.dataset.cardDetail));
  row.querySelector('[data-remove-owned-card]')?.addEventListener('click', () => {
    row.remove();
    ensureStatusEmptyMessage();
    renderCardPickerList();
  });
}

function cardCatalogSearchText(card) {
  const benefitText = card.benefits.flatMap(benefit => [
    benefit.label,
    benefit.detailTitle,
    benefit.conditionNote,
    ...(benefit.displayMerchants || []),
    ...benefit.merchants.map(merchantId => merchants.find(merchant => merchant.id === merchantId)?.label)
  ]).filter(Boolean);
  return [card.name, card.issuer, card.kind, ...benefitText].join(' ').toLocaleLowerCase('ko-KR');
}

function renderCardPickerList() {
  const root = document.querySelector('#cardPickerList');
  if (!root) return;
  const count = document.querySelector('#cardPickerCount');
  root.hidden = !cardSearchSubmitted;
  count.hidden = !cardSearchSubmitted;
  if (!cardSearchSubmitted) {
    root.innerHTML = '';
    count.textContent = '';
    return;
  }
  const owned = new Set(ownedCardIdsInForm());
  const filtered = cards.filter(card => cardCatalogSearchText(card).includes(cardPickerQuery));
  count.textContent = `검색 결과 ${filtered.length}개`;
  root.innerHTML = filtered.length
    ? filtered.map(card => {
      const isOwned = owned.has(card.id);
      return `<article class="card-picker-item${isOwned ? ' is-owned' : ''}"><button class="card-picker-main" type="button" data-picker-card-detail="${card.id}" aria-label="${escapeHtml(card.name)} 전체 혜택 보기"><strong>${escapeHtml(card.name)}</strong><small>${escapeHtml(card.issuer)} · ${escapeHtml(card.kind)}</small></button><button class="card-picker-add" type="button" ${isOwned ? 'disabled aria-disabled="true"' : `data-add-owned-card="${card.id}"`}>${isOwned ? '✓ 추가됨' : '추가'}</button></article>`;
    }).join('')
    : '<p class="card-picker-empty">검색 조건에 맞는 카드가 없어요.</p>';
  root.querySelectorAll('[data-add-owned-card]').forEach(button => button.addEventListener('click', () => {
    const card = cards.find(item => item.id === button.dataset.addOwnedCard);
    if (!card) return;
    const list = document.querySelector('#statusList');
    list.querySelector('.status-empty')?.remove();
    list.insertAdjacentHTML('beforeend', statusCardRow(card));
    const row = list.querySelector(`[data-owned-card="${card.id}"]`);
    bindStatusCardRow(row);
    const select = row.querySelector('select[data-card]');
    if (select) select.value = savedPerformanceTier(card);
    renderCardPickerList();
  }));
  root.querySelectorAll('[data-picker-card-detail]').forEach(button => button.addEventListener('click', () => openCardDetail(button.dataset.pickerCardDetail)));
}

function applyCardSearch() {
  cardPickerQuery = document.querySelector('#cardSearch').value.trim().toLocaleLowerCase('ko-KR');
  cardSearchSubmitted = !!cardPickerQuery;
  renderCardPickerList();
}

function renderStatusForm() {
  document.querySelector('#carrier').value = state.carrier || 'none';
  document.querySelector('#membershipGrade').value = state.membershipGrade || 'none';
  const ownedCards = cards.filter(card => isCardOwned(card.id));
  const list = document.querySelector('#statusList');
  list.innerHTML = ownedCards.map(card => statusCardRow(card)).join('');
  ensureStatusEmptyMessage();
  list.querySelectorAll('select[data-card]').forEach(select => { select.value = savedPerformanceTier(cards.find(card => card.id === select.dataset.card)); });
  list.querySelectorAll('[data-owned-card]').forEach(bindStatusCardRow);
  document.querySelector('#cardSearch').value = '';
  cardPickerQuery = '';
  cardSearchSubmitted = false;
  renderCardPickerList();
}

function bindMoneyInput(input) {
  input.addEventListener('input', () => {
    const n = input.value.replace(/[^0-9]/g,'');
    input.value = n ? won.format(Number(n)) : '';
    updateAmountReset();
  });
}

function updateAmountReset() {
  const input = document.querySelector('#amount');
  const button = document.querySelector('#resetAmount');
  if (input && button) button.disabled = !input.value.replace(/[^0-9]/g,'');
}

function saveStatus() {
  state.ownedCards = ownedCardIdsInForm();
  document.querySelectorAll('#statusList select[data-card]').forEach(select => {
    if (select.value === '') delete state.spends[select.dataset.card];
    else state.spends[select.dataset.card] = Number(select.value);
  });
  cards.filter(card => !state.ownedCards.includes(card.id)).forEach(card => { delete state.spends[card.id]; });
  state.carrier = document.querySelector('#carrier').value;
  state.membershipGrade = document.querySelector('#membershipGrade').value;
  if (state.carrier === 'none') state.membershipGrade = 'none';
  saveState();
  renderMerchantOptions();
  renderFavorites();
  renderResults(inputValues());
  showToast('내 카드와 설정을 저장했어요.');
}

function updateConditional() {
  // 상품·메뉴 조건은 체크박스로 받지 않고, 결과의 결제 전략별 안내에 표시한다.
}

function renderMerchantOptions() {
  const categorySelect = document.querySelector('#merchantCategory');
  const merchantSelect = document.querySelector('#merchant');
  const previousCategory = categorySelect.value;
  const previousMerchant = merchantSelect.value;
  const available = merchants.filter(merchantAvailableForSelection);
  const groups = Object.groupBy ? Object.groupBy(available, merchant => merchant.category) : available.reduce((all, merchant) => ((all[merchant.category] ||= []).push(merchant), all), {});
  const categories = merchantCategoryOrder.filter(category => groups[category]);
  const merchantCategory = available.find(merchant => merchant.id === previousMerchant)?.category;
  const selectedCategory = groups[previousCategory]
    ? previousCategory
    : groups[merchantCategory]
      ? merchantCategory
      : '';
  categorySelect.innerHTML = `<option value="">카테고리를 선택하세요</option>${categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('')}`;
  categorySelect.value = selectedCategory;
  const categoryMerchants = groups[selectedCategory] || [];
  merchantSelect.disabled = !selectedCategory;
  merchantSelect.innerHTML = selectedCategory
    ? `<option value="">${escapeHtml(selectedCategory)} 전체</option>${categoryMerchants.map(merchant => `<option value="${merchant.id}">${escapeHtml(merchant.label)}</option>`).join('')}`
    : '<option value="">카테고리를 먼저 선택하세요</option>';
  merchantSelect.value = categoryMerchants.some(merchant => merchant.id === previousMerchant) ? previousMerchant : '';
  updateConditional();
}

function favoriteLabel(key) {
  if (key.startsWith('category:')) return `${key.slice('category:'.length)} 전체`;
  return merchants.find(merchant => merchant.id === key)?.label || key;
}

function validFavorite(key) {
  if (typeof key !== 'string') return false;
  if (key.startsWith('category:')) {
    const category = key.slice('category:'.length);
    return merchantCategoryOrder.includes(category) && merchants.some(merchant => merchant.category === category && merchantAvailableForSelection(merchant));
  }
  const merchant = merchants.find(item => item.id === key);
  return !!merchant && merchantAvailableForSelection(merchant);
}

function currentFavoriteKey() {
  const merchant = document.querySelector('#merchant').value;
  return merchant || `category:${document.querySelector('#merchantCategory').value}`;
}

function selectFavorite(key) {
  const categorySelect = document.querySelector('#merchantCategory');
  const merchantSelect = document.querySelector('#merchant');
  if (key.startsWith('category:')) {
    categorySelect.value = key.slice('category:'.length);
    merchantSelect.value = '';
  } else {
    const merchant = merchants.find(item => item.id === key);
    if (!merchant) return false;
    categorySelect.value = merchant.category;
  }
  renderMerchantOptions();
  if (!key.startsWith('category:')) merchantSelect.value = key;
  return key.startsWith('category:')
    ? categorySelect.value === key.slice('category:'.length) && merchantSelect.value === ''
    : merchantSelect.value === key;
}

function updateFavoriteToggle() {
  const button = document.querySelector('#toggleFavorite');
  if (!button) return;
  const key = currentFavoriteKey();
  const available = validFavorite(key);
  const active = available && state.favorites.includes(key);
  button.hidden = !available;
  button.classList.toggle('is-active', active);
  button.setAttribute('aria-pressed', String(active));
  button.innerHTML = `<span aria-hidden="true">${active ? '★' : '☆'}</span><span>${active ? '즐겨찾기됨' : '즐겨찾기'}</span>`;
}

function renderFavorites() {
  const root = document.querySelector('#favoritesList');
  if (!root) return;
  const favorites = [...new Set(state.favorites.filter(validFavorite))];
  if (favorites.length !== state.favorites.length) {
    state.favorites = favorites;
    saveState();
  }
  root.innerHTML = favorites.length
    ? favorites.map(key => `<div class="favorite-item"><button class="favorite-chip" type="button" data-favorite-open="${escapeHtml(key)}">${escapeHtml(favoriteLabel(key))}</button><button class="favorite-remove" type="button" data-favorite-remove="${escapeHtml(key)}" aria-label="${escapeHtml(favoriteLabel(key))} 즐겨찾기 삭제">×</button></div>`).join('')
    : '<p class="favorite-empty">추천 결과에서 별을 누르면 자주 찾는 구매처가 여기에 표시됩니다.</p>';
  document.querySelectorAll('[data-favorite-open]').forEach(button => button.addEventListener('click', () => {
    if (!selectFavorite(button.dataset.favoriteOpen)) return;
    document.querySelector('#amount').value = '';
    updateAmountReset();
    updateConditional();
    renderResults(inputValues());
  }));
  document.querySelectorAll('[data-favorite-remove]').forEach(button => button.addEventListener('click', () => {
    state.favorites = state.favorites.filter(key => key !== button.dataset.favoriteRemove);
    saveState();
    renderFavorites();
  }));
  updateFavoriteToggle();
}

function toggleCurrentFavorite() {
  const key = currentFavoriteKey();
  if (!validFavorite(key)) return;
  const active = state.favorites.includes(key);
  state.favorites = active ? state.favorites.filter(item => item !== key) : [...state.favorites, key];
  saveState();
  renderFavorites();
  showToast(active ? `${favoriteLabel(key)} 즐겨찾기를 해제했어요.` : `${favoriteLabel(key)} 즐겨찾기에 추가했어요.`);
}

function renderStateFromStorage() {
  renderMerchantOptions();
  renderFavorites();
  updateConditional();
  renderResults(inputValues());
  if (document.querySelector('#statusDialog')?.open) renderStatusForm();
}

function accountSyncConfigured() {
  const config = window.YOCARD_SUPABASE || {};
  return !!(config.url && config.publishableKey && window.supabase?.createClient);
}

function formatSyncCode(value) {
  const compact = String(value || '')
    .toUpperCase()
    .replace(/[^A-Z2-9]/g, '')
    .replace(/[IO]/g, '')
    .slice(0, 16);
  return compact.match(/.{1,4}/g)?.join('-') || '';
}

function normalizeSyncCode(value) {
  const formatted = formatSyncCode(value);
  return formatted.replaceAll('-', '').length === 16 ? formatted : '';
}

function generateSyncCode() {
  const random = new Uint32Array(16);
  crypto.getRandomValues(random);
  const compact = [...random].map(value => syncCodeAlphabet[value % syncCodeAlphabet.length]).join('');
  return formatSyncCode(compact);
}

async function hashSyncCode(code) {
  const compact = normalizeSyncCode(code).replaceAll('-', '');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(compact));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

async function syncCodeCredentials(code) {
  const normalized = normalizeSyncCode(code);
  const compact = normalized.replaceAll('-', '');
  const hash = await hashSyncCode(normalized);
  return {
    hash,
    email:`sync-${hash.slice(0, 32)}@yocard.invalid`,
    password:`Yocard!${compact}${hash.slice(0, 8)}`
  };
}

async function syncCodeSignupReady() {
  const config = window.YOCARD_SUPABASE || {};
  try {
    const response = await fetch(`${config.url}/auth/v1/settings`, {
      headers:{ apikey:config.publishableKey }
    });
    if (!response.ok) return null;
    const settings = await response.json();
    return settings.external?.email === true
      && settings.mailer_autoconfirm === true
      && settings.disable_signup !== true;
  } catch {
    return null;
  }
}

function setAccountSyncStatus(message, isError=false) {
  const status = document.querySelector('#accountSyncStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function setAccountSyncFeedback(message='', isError=false) {
  const feedback = document.querySelector('#accountSyncFeedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = !message;
  feedback.classList.toggle('is-error', isError);
}

function renderAccountSync() {
  const signedOut = document.querySelector('#accountSyncSignedOut');
  const signedIn = document.querySelector('#accountSyncSignedIn');
  const description = document.querySelector('#accountSyncDescription');
  const createButton = document.querySelector('#createSyncCode');
  const connectButton = document.querySelector('#connectSyncCode');
  const warning = document.querySelector('#syncCodeWarning');
  if (!signedOut || !signedIn) return;

  if (!accountSyncConfigured()) {
    signedOut.hidden = false;
    signedIn.hidden = true;
    warning.hidden = true;
    createButton.disabled = true;
    connectButton.disabled = true;
    description.textContent = 'Supabase 연결 정보를 입력하면 설정 동기화를 사용할 수 있습니다.';
    return;
  }

  createButton.disabled = false;
  connectButton.disabled = false;
  signedOut.hidden = !!syncCodeHash;
  signedIn.hidden = !syncCodeHash;
  warning.hidden = !syncCodeHash;
  description.textContent = syncCodeHash
    ? '이 기기의 설정을 다른 기기와 함께 사용 중입니다.'
    : '다른 기기에서 사용하던 설정을 불러올 수 있습니다.';
  if (syncCodeHash) {
    document.querySelector('#syncCodeLabel').textContent = syncCode;
    setAccountSyncStatus(cloudReady ? '동기화 완료' : '설정을 불러오는 중');
  }
}

async function pushCloudState() {
  if (!cloudClient || !cloudUser || !syncCodeHash || !cloudReady) return;
  setAccountSyncStatus('저장 중');
  const { error } = await cloudClient.from('user_settings').upsert({
    user_id:cloudUser.id,
    settings:state,
    schema_version:settingsSchemaVersion,
    updated_at:new Date().toISOString()
  }, { onConflict:'user_id' });
  setAccountSyncStatus(error ? '동기화 실패' : '동기화 완료', !!error);
}

function queueCloudSave() {
  if (!cloudClient || !cloudUser || !syncCodeHash || !cloudReady) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(pushCloudState, 450);
}

async function loadCloudState(user, code, hash, { allowCached=false, createIfMissing=false }={}) {
  const userStorageKey = `${guestStorageKey}:sync:${hash}`;
  const cachedState = localStorage.getItem(userStorageKey) ? loadState(userStorageKey) : null;
  const { data, error } = await cloudClient
    .from('user_settings')
    .select('settings,schema_version,updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    if (!allowCached || !cachedState) return false;
    cloudUser = user;
    syncCode = code;
    syncCodeHash = hash;
    cloudReady = true;
    state = cachedState;
    renderStateFromStorage();
    renderAccountSync();
    setAccountSyncStatus('오프라인 · 이 기기 설정 사용 중', true);
    return true;
  }

  if (!data?.settings && !createIfMissing) return false;
  if (!data?.settings) {
    const { error:insertError } = await cloudClient.from('user_settings').upsert({
      user_id:user.id,
      settings:state,
      schema_version:settingsSchemaVersion,
      updated_at:new Date().toISOString()
    }, { onConflict:'user_id' });
    if (insertError) return false;
  } else {
    state = normalizeSavedState(data.settings);
  }

  cloudUser = user;
  syncCode = code;
  syncCodeHash = hash;
  localStorage.setItem(syncCodeStorageKey, code);
  cloudReady = true;
  saveState({ skipCloud:true });
  renderStateFromStorage();
  renderAccountSync();
  return true;
}

async function createSyncProfile() {
  if (!cloudClient) return;
  const button = document.querySelector('#createSyncCode');
  setAccountSyncFeedback();
  button.disabled = true;
  const signupReady = await syncCodeSignupReady();
  if (signupReady !== true) {
    button.disabled = false;
    setAccountSyncFeedback(
      signupReady === false
        ? '운영 준비가 아직 끝나지 않았어요. Supabase에서 Confirm email을 꺼 주세요.'
        : '동기화 설정을 확인하지 못했어요. 네트워크 연결을 확인해 주세요.',
      true
    );
    return;
  }
  if (cloudUser) await cloudClient.auth.signOut({ scope:'local' });
  const code = generateSyncCode();
  const credentials = await syncCodeCredentials(code);
  const { data, error } = await cloudClient.auth.signUp({
    email:credentials.email,
    password:credentials.password,
    options:{ data:{ account_type:'sync_code' } }
  });
  if (error || !data.session || !data.user) {
    button.disabled = false;
    const needsSetup = !error && data.user && !data.session;
    setAccountSyncFeedback(
      needsSetup
        ? 'Supabase에서 이메일 확인을 꺼야 코드를 만들 수 있어요.'
        : '코드를 만들지 못했어요. 잠시 후 다시 시도해 주세요.',
      true
    );
    return;
  }
  const loaded = await loadCloudState(data.user, code, credentials.hash, { createIfMissing:true });
  button.disabled = false;
  if (!loaded) {
    await cloudClient.auth.signOut({ scope:'local' });
    setAccountSyncFeedback('첫 설정을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.', true);
    return;
  }
  showToast('동기화 코드를 만들었어요.');
}

async function connectSyncProfile() {
  if (!cloudClient) return;
  const input = document.querySelector('#syncCodeInput');
  const code = normalizeSyncCode(input.value);
  if (!code) {
    setAccountSyncFeedback('16자리 동기화 코드를 확인해 주세요.', true);
    input.focus();
    return;
  }
  const button = document.querySelector('#connectSyncCode');
  setAccountSyncFeedback();
  button.disabled = true;
  if (cloudUser) await cloudClient.auth.signOut({ scope:'local' });
  const credentials = await syncCodeCredentials(code);
  const { data, error } = await cloudClient.auth.signInWithPassword({
    email:credentials.email,
    password:credentials.password
  });
  const connected = !error && data.user
    ? await loadCloudState(data.user, code, credentials.hash)
    : false;
  button.disabled = false;
  if (!connected) {
    if (data?.session) await cloudClient.auth.signOut({ scope:'local' });
    setAccountSyncFeedback('일치하는 코드를 찾지 못했어요. 코드를 다시 확인해 주세요.', true);
    return;
  }
  input.value = '';
  showToast('이 기기를 동기화 코드에 연결했어요.');
}

async function copySyncProfileCode() {
  if (!syncCode) return;
  try {
    await navigator.clipboard.writeText(syncCode);
    showToast('동기화 코드를 복사했어요.');
  } catch {
    setAccountSyncFeedback(`동기화 코드: ${syncCode}`);
  }
}

async function disconnectSyncProfile() {
  clearTimeout(cloudSaveTimer);
  localStorage.setItem(guestStorageKey, JSON.stringify(state));
  if (cloudClient && cloudUser) await cloudClient.auth.signOut({ scope:'local' });
  localStorage.removeItem(syncCodeStorageKey);
  cloudUser = null;
  syncCode = '';
  syncCodeHash = '';
  cloudReady = false;
  renderAccountSync();
  setAccountSyncFeedback('이 기기의 연결만 해제했어요. 서버의 설정은 그대로 남아 있습니다.');
}

async function importLegacyAccountState(user) {
  const { data, error } = await cloudClient
    .from('user_settings')
    .select('settings')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || !data?.settings) return;
  state = normalizeSavedState(data.settings);
  localStorage.setItem(guestStorageKey, JSON.stringify(state));
  renderStateFromStorage();
}

async function initCloudSync() {
  renderAccountSync();
  if (!accountSyncConfigured()) return;
  const config = window.YOCARD_SUPABASE;
  cloudClient = window.supabase.createClient(config.url, config.publishableKey, {
    auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:false }
  });
  const storedCode = normalizeSyncCode(localStorage.getItem(syncCodeStorageKey));
  if (!storedCode) {
    localStorage.removeItem(syncCodeStorageKey);
    const { data } = await cloudClient.auth.getSession();
    if (data.session?.user) {
      await importLegacyAccountState(data.session.user);
      await cloudClient.auth.signOut({ scope:'local' });
    }
    renderAccountSync();
    return;
  }
  const credentials = await syncCodeCredentials(storedCode);
  let { data } = await cloudClient.auth.getSession();
  let session = data.session;
  if (session?.user?.email !== credentials.email) {
    if (session) await cloudClient.auth.signOut({ scope:'local' });
    const result = await cloudClient.auth.signInWithPassword({
      email:credentials.email,
      password:credentials.password
    });
    session = result.data.session;
  }
  const connected = session?.user
    ? await loadCloudState(session.user, storedCode, credentials.hash, { allowCached:true })
    : false;
  if (!connected) {
    if (session) await cloudClient.auth.signOut({ scope:'local' });
    localStorage.removeItem(syncCodeStorageKey);
    cloudUser = null;
    syncCode = '';
    syncCodeHash = '';
    cloudReady = false;
    renderAccountSync();
    setAccountSyncFeedback('저장된 동기화 코드의 설정을 찾지 못했어요. 다시 연결해 주세요.', true);
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function setup() {
  document.querySelector('#periodLabel').textContent = `${today.getFullYear()}년 ${today.getMonth()+1}월`;
  renderMerchantOptions();
  if (isFirstVisit) {
    document.querySelector('#merchantCategory').value = '카페';
    renderMerchantOptions();
    document.querySelector('#merchant').value = 'starbucks';
  }
  const amountInput = document.querySelector('#amount');
  bindMoneyInput(amountInput);
  document.querySelectorAll('[data-amount-add]').forEach(button => button.addEventListener('click', () => {
    const current = Number(amountInput.value.replace(/[^0-9]/g,'')) || 0;
    amountInput.value = won.format(current + Number(button.dataset.amountAdd));
    updateAmountReset();
    renderResults(inputValues());
  }));
  document.querySelector('#resetAmount').addEventListener('click', () => {
    amountInput.value = '';
    updateAmountReset();
    renderResults(inputValues());
  });
  updateAmountReset();
  document.querySelector('#recommendForm').addEventListener('submit', e => { e.preventDefault(); renderResults(inputValues()); });
  document.querySelectorAll('#recommendForm input').forEach(el => el.addEventListener('change', () => { updateConditional(); renderResults(inputValues()); }));
  document.querySelector('#merchantCategory').addEventListener('change', () => { renderMerchantOptions(); renderResults(inputValues()); });
  document.querySelector('#merchant').addEventListener('change', () => { updateConditional(); renderResults(inputValues()); });
  document.querySelector('#openStatus').addEventListener('click', () => { renderStatusForm(); const dialog = document.querySelector('#statusDialog'); dialog.showModal(); dialog.querySelector('.dialog-card').scrollTop = 0; });
  document.querySelector('#createSyncCode').addEventListener('click', createSyncProfile);
  document.querySelector('#connectSyncCode').addEventListener('click', connectSyncProfile);
  document.querySelector('#copySyncCode').addEventListener('click', copySyncProfileCode);
  document.querySelector('#disconnectSyncCode').addEventListener('click', disconnectSyncProfile);
  document.querySelector('#syncCodeInput').addEventListener('input', event => {
    event.currentTarget.value = formatSyncCode(event.currentTarget.value);
    setAccountSyncFeedback();
  });
  document.querySelector('#syncCodeInput').addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    connectSyncProfile();
  });
  document.querySelector('#applyCardSearch').addEventListener('click', applyCardSearch);
  document.querySelector('#cardSearch').addEventListener('input', event => {
    if (event.currentTarget.value.trim()) return;
    cardPickerQuery = '';
    cardSearchSubmitted = false;
    renderCardPickerList();
  });
  document.querySelector('#cardSearch').addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    applyCardSearch();
  });
  document.querySelector('#statusForm').addEventListener('submit', e => { if (e.submitter?.value === 'cancel') return; e.preventDefault(); saveStatus(); document.querySelector('#statusDialog').close(); });
  document.querySelector('#toggleFavorite').addEventListener('click', toggleCurrentFavorite);
  document.querySelector('#openMembershipDetail').addEventListener('click', openMembershipDetail);
  document.querySelector('#closeCardDetail').addEventListener('click', () => document.querySelector('#cardDialog').close());
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));
  renderFavorites();
  updateConditional();
  renderResults(inputValues());
  registerWebMCP();
  initCloudSync();
  window.addEventListener('pageshow', () => setTimeout(() => {
    updateConditional();
    renderResults(inputValues());
  }, 120));
}

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    context.registerTool({
      name:'get_card_recommendation', title:'결제 카드 추천',
      description:'구매처와 결제 금액을 바탕으로 현재 실적·한도를 반영해 최적 카드와 필요한 결제 방식을 반환합니다.',
      inputSchema:{ type:'object', properties:{ merchant:{type:'string', enum:merchants.map(m=>m.id)}, amount:{type:'number', minimum:1} }, required:['merchant','amount'], additionalProperties:false },
      annotations:{ readOnlyHint:true, untrustedContentHint:false },
      execute(input) {
        if (!merchants.some(m=>m.id===input.merchant) || !merchantAllowedByProfile(input.merchant) || !Number.isFinite(input.amount) || input.amount <= 0) throw new Error('현재 개인 설정에서 사용할 수 있는 구매처와 결제 금액이 필요합니다.');
        const merchant = merchants.find(item => item.id === input.merchant);
        document.querySelector('#merchantCategory').value=merchant.category;
        renderMerchantOptions();
        document.querySelector('#merchant').value=input.merchant;
        document.querySelector('#amount').value=won.format(Math.floor(input.amount));
        updateAmountReset();
        updateConditional();
        const values=inputValues(); renderResults(values); const best=lastResults[0];
        return { card:best?.card.name || null, paymentMethod:best ? recommendedPayment(best) : null, estimatedBenefit:best?.value || 0, benefitUnit:best?.eligible.every(x=>x.benefit.reward==='point')?'point':'won' };
      }
    });
  } catch (error) { console.warn('WebMCP registration unavailable', error); }
}

setup();
