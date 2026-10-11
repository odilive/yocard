const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const files = [
  'data/merchants.js',
  'data/cards.js',
  'data/membership.js'
];

const dataSource = files
  .map(file => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');
const source = dataSource + '\n;globalThis.__yocardData = { merchants, cards, defaultOwnedCardIds, membershipBenefits };';

const context = {};
vm.runInNewContext(source, context, { filename:'yocard-data.js' });

const { merchants, cards, defaultOwnedCardIds, membershipBenefits } = context.__yocardData;
const errors = [];

function checkCardRewardMediums(items) {
  for (const card of items) {
    if (!card.rewardMedium?.trim()) {
      errors.push(`${card.id}: 카드 혜택 지급수단(rewardMedium)이 없습니다.`);
    }
  }
}

function checkUnique(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item.id) errors.push(`${label}: id가 없는 항목이 있습니다.`);
    else if (seen.has(item.id)) errors.push(`${label}: 중복 id ${item.id}`);
    seen.add(item.id);
  }
}

function checkMerchantReferences(benefits, knownMerchants, label) {
  for (const benefit of benefits) {
    if (!Array.isArray(benefit.merchants)) {
      errors.push(`${label} ${benefit.id}: 구매처 목록 형식이 올바르지 않습니다.`);
      continue;
    }
    for (const merchantId of benefit.merchants) {
      if (merchantId !== '*' && !knownMerchants.has(merchantId)) {
        errors.push(`${label} ${benefit.id}: 없는 구매처 id ${merchantId}`);
      }
    }
  }
}

checkUnique(merchants, '구매처');
checkUnique(cards, '카드');
checkCardRewardMediums(cards);
checkUnique(membershipBenefits, '멤버십 혜택');
for (const cardId of defaultOwnedCardIds) {
  if (!cards.some(card => card.id === cardId)) errors.push(`기본 보유 카드: 없는 카드 id ${cardId}`);
}

const cardBenefits = cards.flatMap(card => card.benefits || []);
checkUnique(cardBenefits, '카드 혜택');

const merchantIds = new Set(merchants.map(merchant => merchant.id));
const merchantCategories = new Set(merchants.map(merchant => merchant.category));
checkMerchantReferences(cardBenefits, merchantIds, '카드 혜택');
checkMerchantReferences(membershipBenefits, merchantIds, '멤버십 혜택');

for (const card of cards) {
  const benefitIds = new Set(card.benefits.map(benefit => benefit.id));
  for (const benefit of card.benefits) {
    for (const category of benefit.merchantCategories || []) {
      if (!merchantCategories.has(category)) errors.push(`카드 혜택 ${benefit.id}: 없는 구매처 분류 ${category}`);
    }
    const replacements = Array.isArray(benefit.replaces) ? benefit.replaces : benefit.replaces ? [benefit.replaces] : [];
    for (const replacement of replacements) {
      if (!benefitIds.has(replacement)) errors.push(`카드 혜택 ${benefit.id}: 같은 카드에 없는 대체 혜택 ${replacement}`);
    }
    if (benefit.promotion?.through && !/^\d{4}-\d{2}-\d{2}$/.test(benefit.promotion.through)) {
      errors.push(`카드 혜택 ${benefit.id}: 프로모션 종료일 형식이 올바르지 않습니다.`);
    }
  }
}

const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(/\nsetup\(\);\s*$/, '\n');
const appContext = {
  localStorage:{ getItem:() => null, setItem:() => {} },
  structuredClone:global.structuredClone
};
vm.runInNewContext(dataSource + '\n' + appSource + `
  const __input = { merchant:'starbucks', amount:10000, payment:'auto', channel:'offline', eventItem:false, membershipEligible:false };
  const __results = calculate(__input);
  state.ownedCards.push('coupang-wow-card', 'gaon-biz');
  state.spends['gaon-biz'] = 500000;
  const __calculateCard = (cardId, merchant, amount, channel) => calculate({ merchant, amount, payment:'auto', channel, eventItem:false, membershipEligible:false }).find(result => result.card.id === cardId)?.value;
  const __coupangBenefit = cards.find(card => card.id === 'coupang-wow-card').benefits.find(benefit => benefit.id === 'coupang-wow-core');
  const __gaonCard = cards.find(card => card.id === 'gaon-biz');
  const __gaonBusiness = __gaonCard.benefits.find(benefit => benefit.id === 'gaon-business');
  globalThis.__yocardAppProbe = {
    defaultCardCount:__results.length,
    hanaValue:__results.find(result => result.card.id === 'hana')?.value,
    noriValue:__results.find(result => result.card.id === 'nori')?.value,
    coupangValue:__calculateCard('coupang-wow-card', 'coupang', 100000, 'online'),
    coupangExpected:activePromotion(__coupangBenefit) ? 4000 : 2000,
    gaonOnline300k:__calculateCard('gaon-biz', 'naverplus', 300000, 'online'),
    gaonOnline600k:__calculateCard('gaon-biz', 'naverplus', 600000, 'online'),
    gaonOnline1m:__calculateCard('gaon-biz', 'naverplus', 1000000, 'online'),
    gaonOnline10m:__calculateCard('gaon-biz', 'naverplus', 10000000, 'online'),
    coupangTitle:benefitDisplayTitle(__coupangBenefit),
    gaonTitle:benefitDisplayTitle(__gaonBusiness),
    gaonTags:describeBenefit(__gaonBusiness, __gaonCard)
  };
`, appContext, { filename:'yocard-app.js' });

const probe = appContext.__yocardAppProbe;
if (probe.defaultCardCount !== defaultOwnedCardIds.length) errors.push(`추천 계산: 기본 보유 카드 ${defaultOwnedCardIds.length}개 중 ${probe.defaultCardCount}개만 계산됐습니다.`);
if (probe.hanaValue !== 2000) errors.push(`추천 계산: 스타벅스 10,000원 나라사랑카드 예상값이 ${probe.hanaValue}원입니다.`);
if (probe.noriValue !== 1000) errors.push(`추천 계산: 스타벅스 10,000원 노리2 예상값이 ${probe.noriValue}원입니다.`);
if (probe.coupangValue !== probe.coupangExpected) errors.push(`추천 계산: 쿠팡 100,000원 쿠팡 와우 카드 예상값이 ${probe.coupangValue}원입니다.`);
if (probe.gaonOnline300k !== 2700) errors.push(`추천 계산: 온라인 300,000원 가온 Biz카드 예상값이 ${probe.gaonOnline300k}원입니다.`);
if (probe.gaonOnline600k !== 5400) errors.push(`추천 계산: 온라인 600,000원 가온 Biz카드 예상값이 ${probe.gaonOnline600k}원입니다.`);
if (probe.gaonOnline1m !== 13000) errors.push(`추천 계산: 온라인 1,000,000원 가온 Biz카드 예상값이 ${probe.gaonOnline1m}원입니다.`);
if (probe.gaonOnline10m !== 80000) errors.push(`추천 계산: 온라인 10,000,000원 가온 Biz카드 예상값이 ${probe.gaonOnline10m}원입니다.`);
if (!probe.coupangTitle.includes(probe.coupangExpected === 4000 ? '4%' : '2%')) errors.push(`상세 표시: 쿠팡 와우 카드 제목이 현재 적립률과 다릅니다: ${probe.coupangTitle}`);
if (!probe.gaonTitle.includes('0.9%')) errors.push(`상세 표시: 가온 Biz카드 사업지원 제목이 올바르지 않습니다: ${probe.gaonTitle}`);
if (!probe.gaonTags.some(tag => tag.includes('추가 적립 월 한도 50,000원'))) errors.push('상세 표시: 가온 Biz카드 추가 적립 한도가 없습니다.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`데이터 정상: 구매처 ${merchants.length}개, 카드 ${cards.length}개, 카드 혜택 ${cardBenefits.length}개, 멤버십 혜택 ${membershipBenefits.length}개`);
}
