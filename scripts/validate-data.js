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
const source = dataSource + '\n;globalThis.__yocardData = { merchants, cards, membershipBenefits };';

const context = {};
vm.runInNewContext(source, context, { filename:'yocard-data.js' });

const { merchants, cards, membershipBenefits } = context.__yocardData;
const errors = [];

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
checkUnique(membershipBenefits, '멤버십 혜택');

const cardBenefits = cards.flatMap(card => card.benefits || []);
checkUnique(cardBenefits, '카드 혜택');

const merchantIds = new Set(merchants.map(merchant => merchant.id));
checkMerchantReferences(cardBenefits, merchantIds, '카드 혜택');
checkMerchantReferences(membershipBenefits, merchantIds, '멤버십 혜택');

const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(/\nsetup\(\);\s*$/, '\n');
const appContext = {
  localStorage:{ getItem:() => null, setItem:() => {} },
  structuredClone:global.structuredClone
};
vm.runInNewContext(dataSource + '\n' + appSource + `
  const __input = { merchant:'starbucks', amount:10000, payment:'auto', channel:'offline', eventItem:false, membershipEligible:false };
  const __results = calculate(__input);
  globalThis.__yocardAppProbe = {
    cardCount:__results.length,
    hanaValue:__results.find(result => result.card.id === 'hana')?.value,
    noriValue:__results.find(result => result.card.id === 'nori')?.value
  };
`, appContext, { filename:'yocard-app.js' });

const probe = appContext.__yocardAppProbe;
if (probe.cardCount !== cards.length) errors.push(`추천 계산: 카드 ${cards.length}개 중 ${probe.cardCount}개만 계산됐습니다.`);
if (probe.hanaValue !== 2000) errors.push(`추천 계산: 스타벅스 10,000원 나라사랑카드 예상값이 ${probe.hanaValue}원입니다.`);
if (probe.noriValue !== 1000) errors.push(`추천 계산: 스타벅스 10,000원 노리2 예상값이 ${probe.noriValue}원입니다.`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`데이터 정상: 구매처 ${merchants.length}개, 카드 ${cards.length}개, 카드 혜택 ${cardBenefits.length}개, 멤버십 혜택 ${membershipBenefits.length}개`);
}
