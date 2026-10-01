const won = new Intl.NumberFormat('ko-KR');
const today = new Date();
const period = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const dayKey = today.toISOString().slice(0, 10);

const merchants = [
  ['starbucks', '스타벅스', '카페'], ['coffeebean', '커피빈', '카페'], ['twosome', '투썸플레이스', '카페'],
  ['megacoffee', '메가MGC커피', '카페'], ['gongcha', '공차', '카페'], ['paulbassett', '폴 바셋', '카페'], ['dunkin', '던킨', '카페'], ['baskin', '배스킨라빈스', '카페'],
  ['parisbaguette', '파리바게뜨', '베이커리'], ['touslesjours', '뚜레쥬르', '베이커리'],
  ['cu', 'CU', '편의점'], ['gs25', 'GS25', '편의점'], ['seveneleven', '세븐일레븐', '편의점'], ['emart24', '이마트24', '편의점'],
  ['coupang', '쿠팡', '온라인쇼핑'], ['naverplus', '네이버플러스 스토어', '온라인쇼핑'], ['hmall', 'H몰', '온라인쇼핑'], ['lotteon', '롯데ON', '온라인쇼핑'], ['cjonstyle', 'CJ온스타일', '온라인쇼핑'], ['wconcept', 'W컨셉', '온라인쇼핑'], ['musinsa', '무신사', '온라인쇼핑'], ['29cm', '29CM', '온라인쇼핑'], ['gmarket', 'G마켓', '온라인쇼핑'], ['auction', '옥션', '온라인쇼핑'], ['11st', '11번가', '온라인쇼핑'],
  ['googleplay', '구글플레이스토어', '디지털'], ['appstore', '앱스토어', '디지털'], ['netflix', '넷플릭스', '구독'], ['youtube', '유튜브 프리미엄', '구독'], ['naverwebtoon', '네이버웹툰', '구독'], ['naverplusmembership', '네이버플러스 멤버십', '구독'], ['coupangwow', '쿠팡와우 멤버십', '구독'],
  ['baemin', '배달의민족', '배달'], ['yogiyo', '요기요', '배달'], ['coupangeats', '쿠팡이츠', '배달'],
  ['cgv', 'CGV', '영화'], ['megabox', '메가박스', '영화'], ['interpark', '인터파크 티켓', '문화'],
  ['oliveyoung', '올리브영', '뷰티'], ['daiso', '다이소', '생활'], ['hairsalon', '미용실', '뷰티'],
  ['skt', 'SKT 통신요금', '통신'], ['kt', 'KT 통신요금', '통신'], ['lgu', 'LG U+ 통신요금', '통신'], ['liivm', 'Liiv M 통신요금', '통신'], ['mvno', '기타 알뜰폰 통신요금', '통신'],
  ['transit', '버스·지하철', '교통'], ['rail', 'KTX·SRT·ITX', '교통'], ['taxi', '택시', '교통'], ['overseas-transit', '해외 대중교통', '해외'],
  ['everland', '에버랜드', '놀이공원'], ['lotteworld', '롯데월드', '놀이공원'], ['seoulland', '서울랜드', '놀이공원'], ['caribbean', '캐리비안베이', '놀이공원'],
  ['outback', '아웃백', '외식'], ['vips', 'VIPS', '외식'], ['lotteria', '롯데리아', '외식'], ['burger', '패스트푸드', '외식'],
  ['domino', '도미노피자', '피자·치킨'], ['pizzahut', '피자헛', '피자·치킨'], ['papajohns', '파파존스피자', '피자·치킨'],
  ['emart', '이마트', '대형마트'], ['lottemart', '롯데마트', '대형마트'], ['homeplus', '홈플러스', '대형마트'], ['department', '백화점', '쇼핑'], ['gshome', 'GS홈쇼핑', '온라인쇼핑'],
  ['px', '군마트(PX)', '군복지'], ['military-hotel', '국군복지단 호텔·콘도', '군복지'], ['language-test', '어학시험', '교육'], ['bookstore', '교보문고·알라딘', '서점'],
  ['overseas', '해외 일반 가맹점', '해외'], ['other', '그 외 일반 가맹점', '기타']
].map(([id, label, category]) => ({ id, label, category }));

const guideCategories = [
  { id:'카페', amount:12000 }, { id:'편의점', amount:10000 }, { id:'베이커리', amount:15000 },
  { id:'온라인쇼핑', amount:30000 }, { id:'배달', amount:20000 }, { id:'영화', amount:15000 }, { id:'교통', amount:50000 },
  { id:'통신', amount:60000 }, { id:'외식', amount:50000 }, { id:'대형마트', amount:80000 },
  { id:'피자·치킨', amount:30000 }, { id:'놀이공원', amount:50000 }, { id:'군복지', amount:50000 }, { id:'해외', amount:50000 }
];

const cards = [
  {
    id: 'nori', issuer: 'KB국민카드', name: '노리2 체크카드(KB Pay)', kind: '할인형',
    source: '카드고릴라 2422 · KB국민카드 공식 안내',
    groups: { nori: [[200000, 20000], [400000, 30000], [600000, 40000], [800000, 50000]] },
    benefits: [
      b('nori-coffee', ['starbucks','coffeebean'], '스타벅스·커피빈 10%', { rate:.10, monthlyCap:3000, group:'nori', allowBelowGroup:true }),
      b('nori-mobile', ['googleplay','appstore'], '구글·앱스토어 10%', { rate:.10, minSpend:200000, monthlyCap:5000, group:'nori' }),
      b('nori-ticket', ['interpark'], '인터파크 티켓 10%', { rate:.10, minSpend:200000, monthlyCap:7000, group:'nori' }),
      b('nori-beauty', ['oliveyoung','hairsalon'], '뷰티 5%', { rate:.05, minSpend:200000, monthlyCap:2000, group:'nori' }),
      b('nori-store', ['gs25','cu'], 'GS25·CU 5%', { rate:.05, minSpend:200000, monthlyCap:2000, group:'nori' }),
      b('nori-sub', ['netflix','youtube'], '구독 1,000원', { flat:1000, minAmount:10000, minSpend:200000, monthlyCap:2000, monthlyCount:2, group:'nori' }),
      b('nori-delivery', ['baemin','yogiyo'], '배달 1,000원', { flat:1000, minAmount:10000, minSpend:200000, monthlyCap:1000, monthlyCount:1, group:'nori' }),
      b('nori-phone', ['skt','kt','lgu','liivm'], '통신 자동이체 2,500원', { flat:2500, minAmount:50000, minSpend:200000, monthlyCap:2500, monthlyCount:1, payment:'autopay', group:'nori' }),
      b('nori-cgv', ['cgv'], 'CGV 4,000원', { flat:4000, minAmount:10000, minSpend:200000, monthlyCap:8000, monthlyCount:2, group:'nori' }),
      b('nori-park', ['everland','lotteworld'], '놀이공원 15,000원', { flat:15000, minAmount:30000, minSpend:200000, monthlyCap:15000, monthlyCount:1, group:'nori' }),
      b('nori-kb-off', ['*'], 'KB Pay 오프라인 2% 추가', { rate:.02, minSpend:300000, monthlyCap:3000, payment:'kbpay', channel:'offline', group:'nori', stack:true, domesticOnly:true, detailTitle:'KB Pay · 2%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','오프라인 월 한도 3,000원 (통합한도 적용)','온라인 월 한도 2,000원 (통합한도 적용)','국내 이용만 적용'] }),
      b('nori-kb-on', ['*'], 'KB Pay 온라인 2% 추가', { rate:.02, minSpend:300000, monthlyCap:2000, payment:'kbpay', channel:'online', group:'nori', stack:true, domesticOnly:true, hideInDetail:true })
    ]
  },
  {
    id: 'soltravel', issuer: '신한카드', name: 'SOL트래블 체크', kind: '할인형', source: '카드고릴라 2667 · 신한카드 공식 안내', groups:{}, benefits:[
      b('sol-cu-event', ['cu'], 'CU 간편식·즉석원두커피 5% 할인', { rate:.05, txnCap:2000, requiresEvent:true, channel:'offline', benefitType:'할인', detailTitle:'CU 간편식·즉석원두커피 · 5%', detailTags:['전월 실적 조건 없음','건당 이용 조건 없음','건당 한도 2,000원','월 한도 없음 (통합한도 미적용)'] }),
      b('sol-store', ['seveneleven','cu','gs25','emart24'], '국내 4대 편의점 5%', { rate:.05, minSpend:300000, monthlyCap:3000, monthlyCount:3, dailyCount:1, benefitType:'할인' }),
      b('sol-transit', ['transit'], '국내 대중교통 1%', { rate:.01, minSpend:300000, monthlyCap:3000, benefitType:'할인', displayMerchants:['시내버스','시외버스','지하철','공항버스','공항철도'], conditionNote:'후불교통 터치(RF) 거래만 적용 · 고속버스 제외' }),
      b('sol-overseas-transit', ['overseas-transit'], '해외 대중교통 1%', { rate:.01, monthlyCap:3000, benefitType:'할인', conditionNote:'Mastercard 컨택리스 방식의 버스·지하철·트램 등만 적용 · 택시 제외' }),
      b('sol-lounge', [], '더라운지 공항라운지 본인 무료 입장', { minSpend:300000, annualCount:2, benefitType:null, detailTitle:'더라운지 공항라운지 · 본인 무료 입장', detailTags:['전월 실적 300,000원 이상','반기별 1회 · 연 2회','더라운지 앱에서 이용권 발급 필요','회원 본인만 이용 가능'] })
    ]
  },
  {
    id: 'hana', issuer: '하나카드', name: '하나 나라사랑카드', kind: '캐시백형', source: '카드고릴라 2934 · 하나카드 상품설명서',
    groups:{ hana:[[100000,5000],[200000,10000],[300000,20000],[500000,30000],[1000000,50000]] },
    benefits:[
      b('hana-px', ['px'], '군마트(PX) 20~30% 캐시백', { rateTiers:[
        { id:'under-30k', maxAmountExclusive:30000, rate:.30, dailyCap:5000, monthlyCap:10000 },
        { id:'30k-or-more', minAmount:30000, rate:.20, dailyCap:20000, monthlyCap:100000 }
      ] }),
      b('hana-shop-easy', ['coupang','naverplus'], '쿠팡·네이버플러스 스토어 20%', { rate:.20, monthlyCap:3000, dailyCap:1000, channel:'online' }),
      b('hana-cu', ['cu'], 'CU 음료·아이스크림·간편식 10%', { rate:.10, monthlyCap:50000, requiresEvent:true, detailTitle:'CU 음료·아이스크림·간편식 · 10%', detailTags:['전월 실적 조건 없음','건당 이용 조건 없음','월 한도 50,000원 (통합한도 미적용)'] }),
      b('hana-cgv-snack', ['cgv'], 'CGV 팝콘 스몰세트 무료', { flat:8000, requiresMilitary:true, monthlyCount:1, annualCount:6, benefitType:null, unsupported:true, conditionNote:'CGV 매점 또는 공식 앱·웹에서 팝콘 스몰세트 1개 제공' }),
      b('hana-digital', ['appstore','googleplay','youtube','naverwebtoon','netflix','naverplusmembership','coupangwow'], '디지털 라이프 10%', { rate:.10, monthlyCap:2000, requiresMilitary:true, displayMerchants:['애플 App Store','구글플레이','유튜브 프리미엄','네이버웹툰','넷플릭스','네이버플러스 멤버십','쿠팡와우 멤버십'], conditionNote:'대상별 정기결제·결제수단 제외 조건 확인 필요' }),
      b('hana-transit', ['transit'], '버스·지하철 20%', { rate:.20, minSpend:100000, monthlyCap:10000, group:'hana' }),
      b('hana-hotel', ['military-hotel'], '국군복지단 호텔·콘도 20%', { rate:.20, minSpend:100000, monthlyCap:10000, group:'hana' }),
      b('hana-park', ['everland','lotteworld'], '놀이공원 이용권 50%', { rate:.50, minSpend:100000, monthlyCount:1, benefitType:'할인', channel:'offline', conditionNote:'이용권 1인 1매 구매에만 적용' }),
      b('hana-starbucks', ['starbucks'], '스타벅스 20%', { rate:.20, minAmount:10000, txnCap:4000, minSpend:100000, group:'hana' }),
      b('hana-restaurant', ['outback','vips'], '아웃백·VIPS 20%', { rate:.20, minAmount:10000, monthlyCap:20000, minSpend:100000, group:'hana' }),
      b('hana-fastfood', ['burger'], '패스트푸드 5%', { rate:.05, minAmount:10000, monthlyCap:2000, minSpend:100000, group:'hana', displayMerchants:['롯데리아','맥도날드','버거킹','맘스터치','KFC','써브웨이'] }),
      b('hana-shopping', ['musinsa','29cm','gmarket','auction','11st'], '온라인쇼핑 10%', { rate:.10, minAmount:10000, monthlyCap:5000, minSpend:100000, group:'hana', channel:'online' }),
      b('hana-test', ['language-test'], '어학시험 5%', { rate:.05, monthlyCap:5000, minSpend:100000, group:'hana', displayMerchants:['TOEIC','OPIc','TEPS','JPT','HSK'], conditionNote:'공식 사이트를 통한 응시료 결제만 적용' }),
      b('hana-book', ['bookstore'], '교보문고·알라딘 5%', { rate:.05, monthlyCap:5000, minSpend:100000, group:'hana' }),
      b('hana-rail', ['rail'], '광역교통 5%', { rate:.05, monthlyCap:2000, minSpend:100000, group:'hana', displayMerchants:['KTX','SRT','ITX','고속버스','시외버스'], conditionNote:'공식 홈페이지·앱 또는 오프라인 결제만 적용' }),
      b('hana-delivery-desire', ['baemin','yogiyo','coupangeats'], '군 급여이체 딜리버리 20%', { rate:.20, monthlyCap:5000, requiresMilitary:true }),
      b('hana-taxi-desire', ['taxi'], '군 급여이체 택시 20%', { rate:.20, monthlyCap:5000, requiresMilitary:true })
    ]
  },
  {
    id: 'deepdream', issuer: '신한카드', name: 'Deep Dream 체크', kind: '적립형', source: '카드고릴라 281 · 신한카드 공식 안내',
    groups:{ dream:[[200000,5000],[400000,15000],[800000,30000]] }, benefits:[
      b('dream-base', ['*'], '모두드림 0.2%', { rate:.002, reward:'point', fallback:true }),
      b('dream-area', ['emart','lottemart','homeplus','cu','gs25','seveneleven','oliveyoung','daiso','cgv','starbucks','coffeebean','twosome','overseas','skt','kt','lgu'], 'DREAM 영역 0.6%', { rate:.006, reward:'point', minSpend:200000, group:'dream', replaces:'dream-base' }),
      b('dream-taxi', ['taxi'], '택시 3·6·9회째 1,000P', { flat:1000, reward:'point', minSpend:200000, specialCount:[3,6,9] }),
      b('dream-gas', ['gas'], '주말 주유 리터당 40P', { reward:'point', unsupported:true })
    ], note:'가장 많이 쓴 DREAM 영역의 1% 적립은 월말 확정이므로 추천에는 보장되는 0.6%만 반영합니다.'
  },
  {
    id: 'kakaobank', issuer: '카카오뱅크', name: '프렌즈 체크카드', kind: '캐시백형', source: '카드고릴라 435 · 카카오뱅크 공식 안내', groups:{}, benefits:[
      b('kbank-base', ['*'], '조건 없는 기본 캐시백', { dynamicRate:() => [0,6].includes(today.getDay()) ? .004 : .002, fallback:true })
    ]
  },
  {
    id: 'kakaopay', issuer: '신한카드', name: '카카오페이 신한 체크카드', kind: '적립형', source: '카드고릴라 286 · 신한카드 공식 안내',
    groups:{ kakao:[[300000,5000],[500000,7000],[700000,10000],[1000000,13000]] }, benefits:[
      b('kakao-pay', ['*'], '카카오페이 결제 2%', { rate:.02, reward:'point', payment:'kakaopay', monthlyCap:10000, fallback:true, domesticOnly:true, displayMerchants:['카카오페이'] }),
      b('kakao-transit', ['transit'], '대중교통 3%', { rate:.03, reward:'point', minSpend:300000, monthlyCap:5000, group:'kakao' }),
      b('kakao-phone', ['skt','kt','lgu'], '이동통신 자동이체 3%', { rate:.03, reward:'point', minSpend:300000, minAmount:50000, monthlyCap:5000, payment:'autopay', group:'kakao' }),
      b('kakao-cgv', ['cgv'], 'CGV 최대 3,000P', { flat:3000, reward:'point', minSpend:300000, monthlyCount:1, group:'kakao' }),
      b('kakao-overseas', ['overseas'], '해외 가맹점 1%', { rate:.01, reward:'point' })
    ], note:'국내 혜택이 겹치면 교통·통신·영화가 우선이며 중복 적립되지 않습니다.'
  },
  {
    id: 'simple', issuer: '하나카드', name: '더 심플 체크카드', kind: '캐시백형', source: '카드고릴라 2810 · 하나카드 상품설명서', groups:{}, benefits:[
      b('simple-phone', ['skt','kt','lgu','mvno'], '통신 자동이체 5,000원', { flat:5000, minAmount:10000, minSpend:300000, monthlyCap:5000, payment:'autopay' }),
      b('simple-coffee', ['starbucks','coffeebean','twosome'], '커피 5%', { rate:.05, minAmount:10000, minSpend:300000, monthlyCap:2000, channel:'offline' })
    ]
  },
  {
    id: 'samsungmoney', issuer: 'Samsung Wallet · 우리카드 제휴', name: '삼성월렛 머니', kind: '적립형', source: '삼성전자 Samsung Wallet 공식 안내', requiredPayment:'samsungmoney', groups:{}, benefits:[
      b('samsungmoney-offline', ['*'], '오프라인 0.5% 기본 적립', { rate:.005, reward:'point', payment:'samsungmoney', channel:'offline', domesticOnly:true, unlimited:true, fallback:true }),
      b('samsungmoney-online', ['naverplus','hmall','lotteon','cjonstyle','wconcept'], '지원 온라인처 1.5% 기본 적립', { rate:.015, reward:'point', payment:'samsungmoney', channel:'online', domesticOnly:true, unlimited:true })
    ], note:'온라인은 삼성월렛 머니를 지원하는 제휴처에서만 사용할 수 있습니다. 우리은행 계좌 연결 및 월별 이벤트 추가 적립은 변경·조기 종료될 수 있어 현재 자동 계산에서 제외했습니다.'
  },
  {
    id: 'love', issuer: '신한카드', name: '신한카드 LOVE', kind: '할인형', source: '카드고릴라 2 · 신한카드 공식 안내',
    groups:{ love:[[200000,5000],[300000,10000],[500000,20000],[800000,30000],[1500000,50000]] }, benefits:[
      b('love-shop', ['department','emart','lottemart','homeplus','gshome'], '쇼핑 5%', { rate:.05, minSpend:200000, txnCap:5000, monthlyCount:2, group:'love' }),
      b('love-starbucks', ['starbucks'], '스타벅스 20%', { rate:.20, minSpend:200000, txnCap:2000, dailyCount:1, monthlyCount:5, group:'love' }),
      b('love-outback', ['outback'], '아웃백 20%', { rate:.20, minSpend:200000, txnAmountCap:100000, monthlyCount:2, group:'love' }),
      b('love-cgv', ['cgv','megabox'], '영화 최대 7,000원', { flat:7000, minSpend:200000, monthlyCount:1, group:'love' }),
      b('love-park', ['everland','lotteworld','seoulland'], '테마파크 50%', { rate:.50, minSpend:300000, dailyCount:1, group:'love' })
    ], note:'주유는 유가 기준 계산이 필요해 현재 추천 순위에서 제외했습니다.'
  }
];

const membershipProvider = { id:'skt-membership', issuer:'SK텔레콤', name:'T 멤버십 SILVER', kind:'통신사 멤버십' };
const membershipSourceUrl = 'https://m.tworld.co.kr/membership/benefit/brand';
const membershipCheckedAt = '2026-09-27';
const membershipBenefits = [
  mb('skt-cu', ['cu'], 'CU 1천원당 50원 할인', { unitBase:1000, unitValue:50, minAmount:1000, dailyCount:1, dailyCap:10000, excludesEvent:true, exclusiveWithCard:true, conditionNote:'행사상품·담배·주류 등 제외' }),
  mb('skt-seven', ['seveneleven'], '세븐일레븐 1천원당 50원 할인', { unitBase:1000, unitValue:50, minAmount:1000, guideOnly:true, conditionNote:'대상 상품과 매장 조건 확인' }),
  mb('skt-gs25', ['gs25'], 'GS25 화요일 프레시푸드 1천원당 200원 할인', { unitBase:1000, unitValue:200, minAmount:1000, weekday:2, guideOnly:true, alwaysDiscount:true, conditionNote:'매주 화요일·프레시푸드 대상' }),
  mb('skt-mega', ['megacoffee'], '메가MGC커피 10% 할인', { rate:.10, txnAmountCap:10000, dailyCap:1000, monthlyCount:4, channel:'offline', excludesEvent:true, conditionNote:'전 메뉴(행사 메뉴 제외)·키오스크/카운터 주문·월 4회·하루 구매 1만원까지', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5393' }),
  mb('skt-gongcha', ['gongcha'], '공차 10% 할인', { rate:.10, dailyCount:1, dailyCap:20000, conditionNote:'본인 1일 1회·일 최대 2만원 할인·일부 특수매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=771' }),
  mb('skt-paul', ['paulbassett'], '폴 바셋 시그니처 커피 4종 10% 할인', { rate:.10, requiresMembershipEligible:true, eligibleTitle:'시그니처 커피 4종을 주문해요', eligibleHelp:'룽고·카페라떼·락토프리 카페라떼·카페 오트만 적용', dailyCount:1, dailyCap:20000, conditionNote:'시그니처 4종·1일 1회·딜리버리/네이버 주문 제외·다른 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=67' }),
  mb('skt-dunkin', ['dunkin'], '던킨 제조 커피·도넛 5% 할인', { rate:.05, requiresMembershipEligible:true, eligibleTitle:'제조 커피 또는 도넛을 주문해요', eligibleHelp:'베이글·디저트·병/캔/팩 음료·콤보/세트는 제외', dailyCount:1, dailyCap:10000, channel:'offline', conditionNote:'제조 커피·도넛만·매장 주문·1일 1회·다른 쿠폰/행사 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=992' }),
  mb('skt-baskin', ['baskin'], '배스킨라빈스 싱글레귤러 1,200원 할인', { flat:1200, requiresMembershipEligible:true, eligibleTitle:'싱글레귤러를 구매해요', eligibleHelp:'다른 사이즈·제품은 이 상시 혜택의 대상이 아닙니다.', conditionNote:'싱글레귤러 지정 상품·일부 매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=998' }),
  mb('skt-paris', ['parisbaguette'], '파리바게뜨 1천원당 50원 할인', { unitBase:1000, unitValue:50, minAmount:1000, dailyCount:1, dailyCap:10000, conditionNote:'1천원 이상·1일 1회·타 적립/쿠폰 중복 불가·일부 특수매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1053' }),
  mb('skt-tous', ['touslesjours'], '뚜레쥬르 1천원당 50원 할인', { unitBase:1000, unitValue:50, minAmount:1000, dailyCount:1, dailyCap:10000, conditionNote:'1천원 단위·1일 1회·일부 매장/상품 제외 가능', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1084' }),
  mb('skt-outback', ['outback'], '아웃백 5% 할인', { rate:.05, dailyCount:1, dailyCap:10000, monthlyCount:4, conditionNote:'1일 1회·월 4회·일 최대 1만원 할인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1173' }),
  mb('skt-vips', ['vips'], 'VIPS 5% 할인', { rate:.05, dailyCount:1, dailyCap:10000, exclusiveWithCard:true, conditionNote:'1일 1회·신용카드 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=918' }),
  mb('skt-lotteria', ['lotteria'], '롯데리아 지정 버거세트 5종 1천원당 150원 할인', { unitBase:1000, unitValue:150, requiresMembershipEligible:true, eligibleTitle:'지정 버거세트 5종을 주문해요', eligibleHelp:'한우불고기·빅불·핫크리스피버거·새우버거·데리버거 세트만 적용', dailyCount:1, dailyCap:30000, channel:'offline', conditionNote:'지정 세트 5종·매장 주문만·배달/픽업 제외·타 쿠폰/행사 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1094' }),
  mb('skt-domino', ['domino'], '도미노피자 20% 할인', { rate:.20, guideOnly:true, channel:'online', conditionNote:'도미노피자 Web/App에서 일회용 바코드 번호 입력·세부 제외 메뉴 확인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=14' }),
  mb('skt-pizzahut', ['pizzahut'], '피자헛 20% 할인', { rate:.20, guideOnly:true, conditionNote:'주문 채널·제외 메뉴 확인' }),
  mb('skt-papajohns', ['papajohns'], '파파존스피자 15% 할인', { rate:.15, guideOnly:true, conditionNote:'주문 채널·제외 메뉴 확인' }),
  mb('skt-cgv', ['cgv'], 'CGV 영화관람권 최대 4,000원 할인', { formula:'movie', minAmount:11000, dailyCount:1, exclusiveWithCard:true, alwaysDiscount:true, conditionNote:'T멤버십 앱 무비 예매·2D 일반영화·타 할인 중복 불가' }),
  mb('skt-megabox', ['megabox'], '메가박스 영화관람권 최대 4,000원 할인', { formula:'movie', minAmount:11000, dailyCount:1, alwaysDiscount:true, conditionNote:'T멤버십 앱 예매·1일 1회' }),
  mb('skt-emart', ['emart'], '이마트 3% 할인', { rate:.03, guideOnly:true, conditionNote:'구매 한도·횟수와 제외 품목 확인' }),
  mb('skt-11st', ['11st'], '11번가 T멤버십 표시 상품 최대 11% 할인', { rate:.11, guideOnly:true, isMaximum:true, requiresMembershipEligible:true, eligibleTitle:'T멤버십 적용 대상 상품이에요', eligibleHelp:'11번가 앱의 상품 상세에서 T멤버십 적용 표시와 실제 할인율을 확인', channel:'online', conditionNote:'11번가 앱·T멤버십 적용 상품만·상품별 할인율/한도 상이·예산 소진 시 종료', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1083' }),
  mb('skt-lotteworld', ['lotteworld'], '롯데월드 본인 40%·동반 3인 20% 할인', { rate:.40, guideOnly:true, alwaysDiscount:true, conditionNote:'종합이용권 현장 할인' })
];

const cardSourceUrls = {
  nori: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?cooperationcode=07964&mainCC=a',
  soltravel: 'https://www.shinhancard.com/pconts/html/card/travel/travel_supersol.html',
  hana: 'https://www.hanacard.co.kr/OPI41000000D.web?CD_PD_SEQ=18813&mID=PI41018813P&schID=pcd',
  deepdream: 'https://www.shinhancard.com/pconts/html/card/apply/check/1188313_2206.html',
  kakaobank: 'https://www.kakaobank.com/products/checkcard',
  kakaopay: 'https://www.shinhancard.com/pconts/html/card/apply/check/1196087_2206.html',
  simple: 'https://m.hanacard.co.kr/leaflet/15/15245_20250703.pdf',
  samsungmoney: 'https://www.samsung.com/sec/apps/samsung-wallet/',
  love: 'https://www.shinhancard.com/pconts/html/card/apply/family/1188506_2215.html'
};

const cardGorillaUrls = {
  nori: 'https://www.card-gorilla.com/card/detail/2422',
  soltravel: 'https://www.card-gorilla.com/card/detail/2667',
  hana: 'https://www.card-gorilla.com/card/detail/2934',
  deepdream: 'https://www.card-gorilla.com/card/detail/281',
  kakaobank: 'https://www.card-gorilla.com/card/detail/435',
  kakaopay: 'https://www.card-gorilla.com/card/detail/286',
  simple: 'https://www.card-gorilla.com/card/detail/2810',
  love: 'https://www.card-gorilla.com/card/detail/2'
};

const cardReferenceUrls = {
  samsungmoney: 'https://r1.community.samsung.com/t5/samsung-wallet/%EC%82%BC%EC%84%B1%EC%9B%94%EB%A0%9B%EB%A8%B8%EB%8B%88-%EA%B2%B0%EC%A0%9C-%ED%98%9C%ED%83%9D/td-p/37921928'
};

function defaultBenefitType(id) {
  if (id.startsWith('hana-') || id.startsWith('kbank-') || id.startsWith('simple-')) return '캐시백';
  return '할인';
}

function b(id, merchants, label, options={}) { return { id, merchants, label, reward:'discount', benefitType:defaultBenefitType(id), ...options }; }
function mb(id, merchants, label, options={}) { return { id, merchants, label, reward:'discount', provider:'skt', grade:'silver', ...options }; }

const initialState = { period, spends:{}, usage:{}, counts:{}, dailyUsage:{}, dailyCounts:{}, militarySalary:false, carrier:'skt', membershipGrade:'silver', membershipMode:'discount', phoneAmount:'unset', transitMode:'unset', cardEnabled:{} };
let state = loadState();
let lastResults = [];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('card-advisor-state-v1'));
    if (!saved) return structuredClone(initialState);
    const profile = {
      militarySalary: !!saved.militarySalary,
      carrier: saved.carrier && saved.carrier !== 'unset' ? saved.carrier : 'skt',
      membershipGrade: saved.membershipGrade || 'silver',
      membershipMode: saved.membershipMode || 'discount',
      phoneAmount: saved.phoneAmount || 'unset',
      transitMode: saved.transitMode || 'unset',
      cardEnabled: saved.cardEnabled || {}
    };
    if (saved.period !== period) return { ...structuredClone(initialState), ...profile, spends:saved.spends || {} };
    return { ...structuredClone(initialState), ...saved, ...profile };
  } catch { return structuredClone(initialState); }
}
function saveState() { localStorage.setItem('card-advisor-state-v1', JSON.stringify(state)); }
function tierValue(tiers, spend) { return [...tiers].reverse().find(([min]) => spend >= min)?.[1] || 0; }
function usage(id) { return state.usage[id] || 0; }
function count(id) { return state.counts[id] || 0; }
function dailyUsage(id) { return state.dailyUsage[`${dayKey}:${id}`] || 0; }
function dailyCount(id) { return state.dailyCounts[`${dayKey}:${id}`] || 0; }
function isCardEnabled(cardId) { return state.cardEnabled?.[cardId] !== false; }

function activeMembershipBenefits() {
  if (state.carrier !== 'skt' || state.membershipGrade !== 'silver') return [];
  return membershipBenefits;
}

function membershipLabel(benefit) {
  if (state.membershipMode === 'point' && !benefit.alwaysDiscount) return benefit.label.replace(/할인/g, '적립');
  return benefit.label;
}

function rateTierFor(benefit, amount) {
  if (!benefit.rateTiers) return null;
  return benefit.rateTiers.find(tier =>
    (!tier.minAmount || amount >= tier.minAmount) &&
    (!tier.maxAmountExclusive || amount < tier.maxAmountExclusive)
  ) || null;
}

function benefitRate(benefit, amount) {
  const tier = rateTierFor(benefit, amount);
  return tier?.rate ?? (benefit.dynamicRate ? benefit.dynamicRate() : benefit.rate);
}

function benefitLimit(benefit, tier, property) {
  return tier?.[property] ?? benefit[property];
}

function benefitUsageKey(benefit, tier) {
  return tier ? `${benefit.id}:${tier.id}` : benefit.id;
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
  if (benefit.rateTiers) {
    const rates = benefit.rateTiers.map(tier => tier.rate * 100);
    return `${Math.min(...rates)}~${Math.max(...rates)}%`;
  }
  if (benefit.dynamicRate) return '0.2~0.4%';
  if (benefit.rate) return `${benefit.rate * 100}%`;
  if (benefit.flat) return `${won.format(benefit.flat)}원`;
  if (benefit.unitBase && benefit.unitValue) return `${won.format(benefit.unitBase)}원당 ${won.format(benefit.unitValue)}원`;
  if (benefit.formula === 'movie') return '최대 4,000원';
  return benefit.label;
}

function benefitDisplayTitle(benefit) {
  return `${benefitPlaceLabel(benefit)} · ${benefitValueLabel(benefit)}`;
}

function rawBenefitValue(benefit, amount) {
  if (benefit.formula === 'movie') return Math.min(4000, Math.max(0, amount - 10000));
  if (benefit.unitBase && benefit.unitValue) return Math.floor(amount / benefit.unitBase) * benefit.unitValue;
  const tier = rateTierFor(benefit, amount);
  const rate = benefitRate(benefit, amount);
  const txnAmountCap = benefitLimit(benefit, tier, 'txnAmountCap');
  const baseAmount = txnAmountCap ? Math.min(amount, txnAmountCap) : amount;
  return benefit.flat ? Math.min(benefit.flat, amount) : Math.floor(baseAmount * (rate || 0));
}

function assessMembershipBenefit(benefit, input, { allowGuideOnly=false }={}) {
  const reasons = [];
  if (!matches(benefit, input.merchant)) return null;
  if (benefit.guideOnly && !allowGuideOnly) reasons.push('세부 상품·이용 조건 확인 필요');
  if (benefit.requiresMembershipEligible && !input.membershipEligible) reasons.push(benefit.eligibleTitle || 'T멤버십 대상 상품 확인 필요');
  if (benefit.minAmount && input.amount < benefit.minAmount) reasons.push(`최소 결제금액 ${won.format(benefit.minAmount)}원 이상 필요`);
  if (benefit.weekday !== undefined && today.getDay() !== benefit.weekday) reasons.push('화요일에만 적용');
  if (benefit.channel && input.channel !== benefit.channel) reasons.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 이용만 적용`);
  if (benefit.excludesEvent && input.eventItem) reasons.push('행사상품은 멤버십 할인 제외');
  if (benefit.monthlyCount && count(benefit.id) >= benefit.monthlyCount) reasons.push('이번 달 이용 횟수 소진');
  if (benefit.dailyCount && dailyCount(benefit.id) >= benefit.dailyCount) reasons.push('오늘 이용 횟수 소진');
  if (reasons.length) return { benefit, value:0, reasons };
  let value = rawBenefitValue(benefit, input.amount);
  if (benefit.dailyCap) value = Math.min(value, Math.max(0, benefit.dailyCap - dailyUsage(benefit.id)));
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

function merchantAllowedByProfile(merchantId) {
  const merchant = merchants.find(item => item.id === merchantId);
  if (!merchant) return true;
  if (merchant.category === '통신') {
    if (state.carrier === 'none') return false;
    if (state.carrier && state.carrier !== 'unset') return merchantId === state.carrier;
  }
  if (merchantId === 'transit' && ['kpass','none'].includes(state.transitMode)) return false;
  return true;
}

function matches(benefit, merchantId) { return benefit.merchants.includes('*') || benefit.merchants.includes(merchantId); }

function assessBenefit(card, benefit, input) {
  const reasons = [];
  if (!isCardEnabled(card.id)) return null;
  if (!merchantAllowedByProfile(input.merchant)) return null;
  if (benefit.requiresMilitary && !state.militarySalary) return null;
  if (!matches(benefit, input.merchant)) return null;
  const tier = rateTierFor(benefit, input.amount);
  if (benefit.rateTiers && !tier) return null;
  if (benefit.unsupported) return { benefit, value:0, reasons:['현재 자동 계산을 지원하지 않는 혜택'] };
  const spend = state.spends[card.id] || 0;
  if (benefit.minSpend && spend < benefit.minSpend) reasons.push(`전월 실적 ${won.format(benefit.minSpend)}원 필요`);
  if (benefit.minAmount && input.amount < benefit.minAmount) reasons.push(`최소 결제금액 ${won.format(benefit.minAmount)}원 이상 필요`);
  if (benefit.maxAmountExclusive && input.amount >= benefit.maxAmountExclusive) reasons.push(`결제금액 ${won.format(benefit.maxAmountExclusive)}원 미만일 때 적용`);
  if (benefit.payment && input.payment !== benefit.payment) reasons.push(`${paymentLabel(benefit.payment)} 결제 필요`);
  if (benefit.domesticOnly && merchants.find(merchant => merchant.id === input.merchant)?.category === '해외') reasons.push('국내 이용에만 적용');
  if (benefit.channel && input.channel !== benefit.channel) reasons.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 결제에만 적용`);
  if (benefit.requiresEvent && !input.eventItem) reasons.push('행사 대상 품목 선택 필요');
  if (benefit.monthlyCount && count(benefit.id) >= benefit.monthlyCount) reasons.push('이번 달 이용 횟수 소진');
  if (benefit.dailyCount && dailyCount(benefit.id) >= benefit.dailyCount) reasons.push('오늘 이용 횟수 소진');
  if (benefit.specialCount && !benefit.specialCount.includes(count(benefit.id) + 1)) reasons.push(`${benefit.specialCount.join('·')}번째 이용에 적용`);
  if (reasons.length) return { benefit, value:0, reasons };

  const rate = benefitRate(benefit, input.amount);
  const txnAmountCap = benefitLimit(benefit, tier, 'txnAmountCap');
  const txnCap = benefitLimit(benefit, tier, 'txnCap');
  const monthlyCap = benefitLimit(benefit, tier, 'monthlyCap');
  const dailyCap = benefitLimit(benefit, tier, 'dailyCap');
  const usageKey = benefitUsageKey(benefit, tier);
  let baseAmount = txnAmountCap ? Math.min(input.amount, txnAmountCap) : input.amount;
  let value = benefit.flat ? Math.min(benefit.flat, input.amount) : Math.floor(baseAmount * (rate || 0));
  if (txnCap) value = Math.min(value, txnCap);
  if (monthlyCap) value = Math.min(value, Math.max(0, monthlyCap - usage(usageKey)));
  if (dailyCap) value = Math.min(value, Math.max(0, dailyCap - dailyUsage(usageKey)));
  if (benefit.group) {
    const tiers = card.groups[benefit.group];
    const groupCap = tierValue(tiers, spend);
    if (groupCap > 0 || !benefit.allowBelowGroup) value = Math.min(value, Math.max(0, groupCap - usage(`${card.id}:group:${benefit.group}`)));
  }
  if (value <= 0) reasons.push('이번 달 한도 소진');
  return { benefit, tier, value, reasons };
}

function calculate(input) {
  return cards.filter(card => isCardEnabled(card.id) && (input.payment === 'samsungmoney' ? card.id === 'samsungmoney' : card.id !== 'samsungmoney')).map(card => {
    let items = card.benefits.map(benefit => assessBenefit(card, benefit, input)).filter(Boolean);
    const positive = items.filter(x => x.value > 0);
    const replacements = new Set(positive.map(x => x.benefit.replaces).filter(Boolean));
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

function hasPerformanceSettings() {
  return Object.keys(state.spends || {}).length > 0;
}

function guideRequiredSpend(card, benefit) {
  let required = benefit.minSpend || 0;
  if (benefit.group && !benefit.allowBelowGroup) required = Math.max(required, card.groups[benefit.group]?.[0]?.[0] || 0);
  return required;
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

function guideCandidates(categoryId) {
  const config = guideCategories.find(category => category.id === categoryId);
  const categoryMerchants = merchants.filter(merchant => merchant.category === categoryId && merchantAllowedByProfile(merchant.id));
  const result = [];

  cards.filter(card => isCardEnabled(card.id)).forEach(card => card.benefits.forEach(benefit => {
    if (benefit.unsupported) return;
    if (benefit.requiresMilitary && !state.militarySalary) return;
    if (benefit.domesticOnly && categoryId === '해외') return;
    const specificMerchants = benefit.merchants.includes('*') ? categoryMerchants : categoryMerchants.filter(merchant => benefit.merchants.includes(merchant.id));
    if (!specificMerchants.length) return;

    const phoneAmount = ({under10000:9999, '10000':30000, '50000':60000})[state.phoneAmount];
    let amount = categoryId === '통신' && phoneAmount ? phoneAmount : config.amount;
    amount = Math.max(amount, benefit.minAmount && (!phoneAmount || benefit.minAmount <= phoneAmount) ? benefit.minAmount : 0);
    if (categoryId === '통신' && phoneAmount && benefit.minAmount && phoneAmount < benefit.minAmount) return;
    if (benefit.maxAmountExclusive) amount = Math.min(amount, benefit.maxAmountExclusive - 1);
    if (amount <= 0 || nominalBenefitValue(benefit, amount) <= 0) return;

    const merchant = specificMerchants[0];
    const input = {
      merchant: merchant.id,
      amount,
      payment: benefit.payment || 'card',
      channel: benefit.channel || (categoryId === '온라인쇼핑' ? 'online' : 'offline'),
      eventItem: !!benefit.requiresEvent
    };
    const assessment = assessBenefit(card, benefit, input);
    const requiredSpend = guideRequiredSpend(card, benefit);
    const isGeneric = benefit.merchants.includes('*');
    const names = specificMerchants.map(item => item.label);
    const placeLabel = isGeneric ? `${categoryId} 어디서나` : names.length > 3 ? `${names.slice(0, 2).join(' · ')} 외 ${names.length - 2}곳` : names.join(' · ');

    result.push({
      card, benefit, amount, requiredSpend, placeLabel, isGeneric,
      potentialValue: nominalBenefitValue(benefit, amount),
      active: !!assessment && assessment.value > 0,
      currentValue: assessment?.value || 0,
      blockedReasons: assessment?.reasons || []
    });
  }));

  activeMembershipBenefits().forEach(benefit => {
    const specificMerchants = categoryMerchants.filter(merchant => benefit.merchants.includes(merchant.id));
    if (!specificMerchants.length) return;
    let amount = Math.max(config.amount, benefit.minAmount || 0);
    const merchant = specificMerchants[0];
    const input = { merchant:merchant.id, amount, payment:'card', channel:benefit.channel || (categoryId === '온라인쇼핑' ? 'online' : 'offline'), eventItem:false, membershipEligible:true };
    const assessment = assessMembershipBenefit(benefit, input, { allowGuideOnly:true });
    const placeLabel = specificMerchants.map(item => item.label).join(' · ');
    result.push({
      card:{ ...membershipProvider, name:`T 멤버십 ${state.membershipGrade.toUpperCase()}` },
      benefit:{ ...benefit, label:membershipLabel(benefit) },
      amount,
      requiredSpend:0,
      placeLabel,
      isGeneric:false,
      isMembership:true,
      potentialValue:nominalBenefitValue(benefit, amount),
      active:!!assessment && assessment.value > 0,
      currentValue:assessment?.value || 0,
      blockedReasons:assessment?.reasons || []
    });
  });

  const configured = hasPerformanceSettings();
  return result.sort((a, b) => {
    if (configured && a.active !== b.active) return Number(b.active) - Number(a.active);
    const aValue = configured && a.active ? a.currentValue : a.potentialValue;
    const bValue = configured && b.active ? b.currentValue : b.potentialValue;
    return bValue - aValue || Number(a.isGeneric) - Number(b.isGeneric) || a.requiredSpend - b.requiredSpend;
  });
}

function shortSpend(amount) {
  return amount >= 10000 && amount % 10000 === 0 ? `${won.format(amount / 10000)}만원` : `${won.format(amount)}원`;
}

function guideStatus(candidate) {
  const configured = hasPerformanceSettings();
  if (candidate.isMembership && candidate.benefit.guideOnly) return { text:'조건 확인', locked:true };
  if (candidate.isMembership && candidate.active) return { text:'멤버십 가능', locked:false };
  if (candidate.benefit.requiresMilitary && !state.militarySalary) return { text:'군 급여이체 시', locked:true };
  if (candidate.active) return { text:'현재 가능', locked:false };
  if (candidate.requiredSpend) {
    return { text:`${shortSpend(candidate.requiredSpend)} 실적 시`, locked:true };
  }
  if (!configured) return { text:'조건 확인', locked:true };
  return { text:'한도·횟수 확인', locked:true };
}

function guideHeadline(candidate) {
  const conditions = [];
  const tier = rateTierFor(candidate.benefit, candidate.amount);
  if (tier?.minAmount) conditions.push(`결제금액 ${won.format(tier.minAmount)}원 이상`);
  else if (tier?.maxAmountExclusive) conditions.push(`결제금액 ${won.format(tier.maxAmountExclusive)}원 미만`);
  if (candidate.benefit.minAmount) conditions.push(`최소 결제 ${won.format(candidate.benefit.minAmount)}원`);
  if (candidate.benefit.maxAmountExclusive) conditions.push(`결제금액 ${won.format(candidate.benefit.maxAmountExclusive)}원 미만`);
  if (candidate.benefit.requiresEvent) conditions.push('행사상품');
  return `${candidate.placeLabel}${conditions.length ? ` · ${conditions.join(' · ')}` : ''}`;
}

function guideRuleTags(candidate) {
  const benefit = candidate.benefit;
  const tags = [];
  const tier = rateTierFor(benefit, candidate.amount);
  if (tier?.minAmount) tags.push(`결제금액 ${won.format(tier.minAmount)}원 이상`);
  else if (tier?.maxAmountExclusive) tags.push(`결제금액 ${won.format(tier.maxAmountExclusive)}원 미만`);
  if (benefit.minAmount) tags.push(`최소 결제 ${won.format(benefit.minAmount)}원`);
  if (benefit.maxAmountExclusive) tags.push(`결제금액 ${won.format(benefit.maxAmountExclusive)}원 미만`);
  if (candidate.requiredSpend) tags.push(`전월 ${shortSpend(candidate.requiredSpend)}`); else tags.push('실적 조건 없음');
  if (benefit.txnCap) tags.push(`건당 한도 ${won.format(benefit.txnCap)}원`);
  if (benefit.txnAmountCap) tags.push(`혜택 계산 대상 최대 ${won.format(benefit.txnAmountCap)}원`);
  if (benefit.dailyCap) tags.push(`일 최대 ${won.format(benefit.dailyCap)}원`);
  if (benefit.monthlyCap) tags.push(`월 최대 ${won.format(benefit.monthlyCap)}원`);
  if (benefit.monthlyCount) tags.push(`월 ${benefit.monthlyCount}회`);
  if (benefit.dailyCount) tags.push(`일 ${benefit.dailyCount}회`);
  if (benefit.payment) tags.push(paymentLabel(benefit.payment));
  if (benefit.channel) tags.push(benefit.channel === 'online' ? '온라인' : '오프라인');
  if (benefit.requiresEvent) tags.push('행사 대상 품목');
  if (benefit.requiresMilitary) tags.push('군 급여이체');
  if (benefit.group) tags.push('통합 한도 적용');
  if (candidate.isMembership) tags.unshift('SKT SILVER');
  if (candidate.isMembership) tags.push('T멤버십 바코드·앱 사용');
  if (benefit.requiresMembershipEligible) tags.push(benefit.eligibleTitle || '지정 대상 상품만');
  if (benefit.conditionNote) tags.push(benefit.conditionNote);
  if (benefit.exclusiveWithCard) tags.push('카드 할인과 중복 불가');
  if (benefit.isMaximum) tags.push('표시율은 최대치');
  return tags;
}

function renderGuide() {
  const configured = hasPerformanceSettings();
  const profileNotes = [];
  if (state.transitMode === 'kpass') profileNotes.push('K-패스 반영');
  if (state.carrier && !['unset','none'].includes(state.carrier)) profileNotes.push(`${merchants.find(item => item.id === state.carrier)?.label || state.carrier} 반영`);
  if (state.carrier === 'skt' && state.membershipGrade === 'silver') profileNotes.push(`T멤버십 SILVER ${state.membershipMode === 'point' ? '적립형' : '할인형'}`);
  if (state.phoneAmount && !['unset','none'].includes(state.phoneAmount)) profileNotes.push(`통신비 ${state.phoneAmount === 'under10000' ? '1만원 미만' : state.phoneAmount === '10000' ? '1만~5만원' : '5만원 이상'}`);
  document.querySelector('#guideState').innerHTML = configured
    ? `<strong>${today.getMonth() + 1}월 실적 반영 중</strong>현재 입력한 실적 구간과 남은 한도로 추천합니다.${profileNotes.length ? `<br>${escapeHtml(profileNotes.join(' · '))}` : ''}`
    : `<strong>전월 실적 설정 전</strong>조건을 충족했을 때 받을 수 있는 대표 혜택을 보여줍니다.${profileNotes.length ? `<br>${escapeHtml(profileNotes.join(' · '))}` : ''}`;

  const cardsHtml = guideCategories.map(category => {
    const candidates = guideCandidates(category.id);
    const best = candidates[0];
    if (category.id === '교통' && state.transitMode === 'kpass') {
      return `<button class="guide-card" type="button" data-guide-category="교통" aria-label="교통 생활 가이드 보기"><div class="guide-card-top"><span class="guide-category">교통</span><span class="guide-status">설정 반영</span></div><h3>버스·지하철은 K-패스</h3><p>일반 카드의 국내 대중교통 혜택은 추천에서 제외했습니다.</p><span class="guide-card-more">철도·택시 혜택도 보기 →</span></button>`;
    }
    if (!best) return '';
    const status = guideStatus(best);
    return `<button class="guide-card" type="button" data-guide-category="${escapeHtml(category.id)}" aria-label="${escapeHtml(category.id)} 생활 가이드 보기"><div class="guide-card-top"><span class="guide-category">${escapeHtml(category.id)}</span><span class="guide-status${status.locked ? ' locked' : ''}">${escapeHtml(status.text)}</span></div><h3>${escapeHtml(guideHeadline(best))}</h3><p>${escapeHtml(best.card.name)} · ${escapeHtml(best.benefit.label)}</p><span class="guide-card-more">조건과 차선책 보기 →</span></button>`;
  }).join('');
  document.querySelector('#guideGrid').innerHTML = cardsHtml;
  document.querySelectorAll('[data-guide-category]').forEach(button => button.addEventListener('click', () => openGuideDetail(button.dataset.guideCategory)));
}

function openGuideDetail(categoryId) {
  const candidates = guideCandidates(categoryId).slice(0, 6);
  document.querySelector('#guideDetailTitle').textContent = `${categoryId} 생활 가이드`;
  let meta = hasPerformanceSettings()
    ? '현재 입력한 실적과 기록된 월 한도를 우선 반영한 순서입니다.'
    : '전월 실적이 아직 없어 혜택을 받을 수 있다고 가정한 대표 순서입니다.';
  if (categoryId === '교통' && state.transitMode === 'kpass') meta += ' K-패스 사용으로 버스·지하철 카드 혜택은 제외했습니다.';
  document.querySelector('#guideDetailMeta').textContent = meta;
  const transitNotice = categoryId === '교통' && state.transitMode === 'kpass' ? '<div class="verification-note">버스·지하철은 K-패스를 사용하는 것으로 반영했습니다. 아래에는 KTX·SRT·택시처럼 별도로 비교할 교통 혜택만 표시합니다.</div>' : '';
  const membershipNotice = candidates.some(candidate => candidate.isMembership) ? `<div class="verification-note membership-source-note">T멤버십 혜택은 ${membershipCheckedAt} 공식 안내 확인 기준입니다. 상품·매장별 제외 조건이 있으므로 결제 전 바코드 화면을 확인하세요. <a href="${membershipSourceUrl}" target="_blank" rel="noreferrer">공식 혜택 보기 ↗</a></div>` : '';
  document.querySelector('#guideDetailContent').innerHTML = transitNotice + membershipNotice + candidates.map((candidate, index) => {
    const status = guideStatus(candidate);
    const tags = guideRuleTags(candidate);
    return `<article class="guide-rule${index === 0 ? ' is-primary' : ''}"><div class="guide-rule-head"><div><h3>${index === 0 ? '우선 기억할 곳 · ' : ''}${escapeHtml(guideHeadline(candidate))}</h3><p>${escapeHtml(candidate.card.name)}로 ${escapeHtml(candidate.benefit.label)}</p></div><span class="guide-status${status.locked ? ' locked' : ''}">${escapeHtml(status.text)}</span></div><div class="guide-rule-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div></article>`;
  }).join('');
  document.querySelector('#guideDialog').showModal();
  document.querySelector('#guideDialog .dialog-card').scrollTop = 0;
}

function formatValue(result) {
  const hasPointOnly = result.eligible.length && result.eligible.every(x => x.benefit.reward === 'point');
  return `${won.format(result.value)}${hasPointOnly ? 'P' : '원'}`;
}
function paymentLabel(id) { return ({card:'일반 카드',kbpay:'KB Pay',kakaopay:'카카오페이',samsungmoney:'삼성월렛 머니',autopay:'자동이체'})[id] || id; }
function inputValues() {
  return {
    merchant: document.querySelector('#merchant').value,
    amount: Number(document.querySelector('#amount').value.replace(/[^0-9]/g,'')) || 0,
    payment: document.querySelector('input[name="payment"]:checked').value,
    channel: document.querySelector('input[name="channel"]:checked').value,
    eventItem: document.querySelector('#eventItem').checked,
    membershipEligible: document.querySelector('#membershipEligible').checked
  };
}

function membershipResultHtml(assessment, bestCard) {
  if (!assessment) return '';
  const { benefit, value, reasons } = assessment;
  const rewardUnit = state.membershipMode === 'point' && !benefit.alwaysDiscount ? 'P' : '원';
  const comparison = value > 0 && bestCard?.value > 0
    ? value > bestCard.value ? '이 결제에서는 멤버십 혜택이 카드 단독 혜택보다 큽니다.' : '아래 카드 단독 혜택도 함께 비교하세요.'
    : '';
  const stacking = benefit.exclusiveWithCard
    ? '카드 할인과 중복되지 않으므로 둘 중 큰 혜택을 선택하세요.'
    : '카드 혜택과의 중복 여부는 매장·상품 조건을 확인하세요.';
  const detail = value > 0
    ? `${won.format(value)}${rewardUnit} 예상 · ${benefit.conditionNote ? `${benefit.conditionNote} · ` : ''}${stacking}`
    : `${reasons.join(' · ')}${benefit.conditionNote ? ` · ${benefit.conditionNote}` : ''} · 공식 조건을 확인하세요.`;
  return `<aside class="membership-callout${value > bestCard?.value ? ' is-best' : ''}"><div><span class="membership-kicker">SKT · SILVER</span><h3>${escapeHtml(membershipLabel(benefit))}</h3><p>${escapeHtml(detail)}${comparison ? ` ${escapeHtml(comparison)}` : ''}</p></div><div class="membership-actions">${value > 0 ? '<button class="button button-membership" id="confirmMembership" type="button">T멤버십 사용했어요</button>' : ''}<a href="${benefit.sourceUrl || membershipSourceUrl}" target="_blank" rel="noreferrer">공식 조건 ↗</a></div></aside>`;
}

function renderResults(input) {
  lastResults = calculate(input);
  const container = document.querySelector('#results');
  const best = lastResults[0];
  const membership = input.amount ? bestMembershipBenefit(input) : null;
  if (!input.amount) {
    container.innerHTML = `<div class="empty-result"><strong>적용 가능한 혜택이 없어요.</strong><br>결제 방식이나 전월 실적을 확인해 주세요.</div>`;
    renderDetails();
    return;
  }
  const membershipHtml = membershipResultHtml(membership, best);
  if (!best || best.value <= 0) {
    container.innerHTML = `${membershipHtml}<div class="empty-result"><strong>적용 가능한 카드 혜택은 없어요.</strong><br>통신사 멤버십 조건과 결제 방식을 확인해 주세요.</div>`;
    document.querySelector('#confirmMembership')?.addEventListener('click', () => recordMembership(membership));
    renderDetails();
    return;
  }
  const merchant = merchants.find(m => m.id === input.merchant);
  const benefitLines = best.eligible.map(x => `<li>${escapeHtml(x.benefit.label)} · ${won.format(x.value)}${x.benefit.reward === 'point' ? 'P' : '원'}</li>`).join('');
  const alternatives = lastResults.filter(x => x.value > 0).slice(1,4).map(x => `<div class="alternative"><span>${escapeHtml(x.card.name)}</span><strong>${formatValue(x)}</strong></div>`).join('');
  container.innerHTML = `${membershipHtml}
    <div class="recommendation">
      <span class="best-label">BEST · ${escapeHtml(merchant.label)}</span>
      <h3 class="best-card-name">${escapeHtml(best.card.name)}</h3>
      <div class="saving-block">
        <div class="saving-amount"><span>예상 혜택</span><strong>${formatValue(best)}</strong></div>
        <div class="effective-price">체감 결제액 ${won.format(Math.max(0, input.amount - best.value))}원 · 1P=1원 환산</div>
      </div>
      <ul class="benefit-lines">${benefitLines}</ul>
      <button class="button button-primary confirm-button" type="button" id="confirmPayment">이 카드로 결제했어요</button>
      ${alternatives ? `<div class="alternatives"><h3>다른 카드</h3>${alternatives}</div>` : ''}
    </div>`;
  document.querySelector('#confirmMembership')?.addEventListener('click', () => recordMembership(membership));
  document.querySelector('#confirmPayment').addEventListener('click', () => recordPayment(best));
  renderDetails();
}

function recordMembership(assessment) {
  if (!assessment?.value) return;
  const { benefit, value } = assessment;
  state.usage[benefit.id] = usage(benefit.id) + value;
  state.counts[benefit.id] = count(benefit.id) + 1;
  state.dailyUsage[`${dayKey}:${benefit.id}`] = dailyUsage(benefit.id) + value;
  state.dailyCounts[`${dayKey}:${benefit.id}`] = dailyCount(benefit.id) + 1;
  saveState();
  showToast('T멤버십 혜택 사용을 기록했어요.');
  renderResults(inputValues());
  renderGuide();
}

function recordPayment(result) {
  result.eligible.forEach(({benefit, tier, value}) => {
    const usageKey = benefitUsageKey(benefit, tier);
    state.usage[usageKey] = usage(usageKey) + value;
    state.counts[benefit.id] = count(benefit.id) + 1;
    state.dailyUsage[`${dayKey}:${usageKey}`] = dailyUsage(usageKey) + value;
    state.dailyCounts[`${dayKey}:${benefit.id}`] = dailyCount(benefit.id) + 1;
    if (benefit.group) {
      const groupKey = `${result.card.id}:group:${benefit.group}`;
      state.usage[groupKey] = usage(groupKey) + value;
    }
  });
  saveState();
  showToast(`${result.card.name} 혜택 사용을 기록했어요.`);
  renderResults(inputValues());
  renderGuide();
  renderWallet();
}

function renderDetails() {
  const root = document.querySelector('#detailsList');
  const membership = bestMembershipBenefit(inputValues());
  const membershipDetail = membership ? `<article class="detail-item membership-detail"><div class="detail-item-head"><h3>T 멤버십 SILVER</h3><strong>${membership.value ? `${won.format(membership.value)}${state.membershipMode === 'point' && !membership.benefit.alwaysDiscount ? 'P' : '원'}` : '조건 확인'}</strong></div><ul><li><b>${escapeHtml(membershipLabel(membership.benefit))}</b> — ${escapeHtml(membership.value ? (membership.benefit.exclusiveWithCard ? '카드 할인과 중복 불가' : '카드 혜택과 중복 여부 확인') : membership.reasons.join(', '))}</li></ul></article>` : '';
  root.innerHTML = membershipDetail + lastResults.map(result => {
    const lines = result.items.length ? result.items.map(item => {
      const status = item.value > 0 ? `${won.format(item.value)}${item.benefit.reward === 'point' ? 'P' : '원'} 적용` : item.reasons.join(', ');
      return `<li><b>${escapeHtml(item.benefit.label)}</b> — ${escapeHtml(status)}</li>`;
    }).join('') : '<li>이 결제처에 해당하는 혜택 없음</li>';
    return `<article class="detail-item"><div class="detail-item-head"><h3>${escapeHtml(result.card.name)}</h3><strong>${result.value ? formatValue(result) : '적용 없음'}</strong></div><ul>${lines}</ul>${result.card.note ? `<ul><li>${escapeHtml(result.card.note)}</li></ul>` : ''}</article>`;
  }).join('');
}

function renderWallet() {
  document.querySelector('#walletTitle').textContent = `등록된 결제수단 ${cards.length}개`;
  document.querySelector('#walletGrid').innerHTML = cards.map(card => {
    const spend = state.spends[card.id] || 0;
    const spendSet = Object.prototype.hasOwnProperty.call(state.spends, card.id);
    const enabled = isCardEnabled(card.id);
    const performanceText = performanceThresholds(card).length ? `실적 ${spendSet ? (spend ? `${won.format(spend/10000)}만+` : '최저 구간') : '미설정'}` : '실적 조건 없음';
    return `<button class="wallet-card${enabled ? '' : ' disabled-card'}" type="button" data-card-id="${card.id}" aria-label="${escapeHtml(card.name)} 혜택 상세 보기"><div><div class="issuer">${escapeHtml(card.issuer)}</div><h3>${escapeHtml(card.name)}</h3></div><div class="wallet-meta"><span>${escapeHtml(card.kind)} · 혜택 보기</span><span class="status-pill">${enabled ? performanceText : '추천 제외'}</span></div></button>`;
  }).join('');
  document.querySelectorAll('[data-card-id]').forEach(button => button.addEventListener('click', () => openCardDetail(button.dataset.cardId)));
}

function openCardDetail(cardId) {
  const card = cards.find(item => item.id === cardId);
  if (!card) return;
  document.querySelector('#cardDetailTitle').textContent = card.name;
  document.querySelector('#cardDetailMeta').textContent = `${card.issuer} · ${card.kind}`;

  const groupEntries = Object.entries(card.groups || {});
  const groupHtml = groupEntries.length ? `<section class="rule-section"><h3>통합 한도</h3>${groupEntries.map(([groupId, tiers]) => `<table class="tier-table"><thead><tr><th>전월 실적</th><th>월 통합 한도</th></tr></thead><tbody>${tiers.map(([spend, cap]) => `<tr><td>${won.format(spend)}원 이상</td><td>${won.format(cap)}원</td></tr>`).join('')}</tbody></table>`).join('')}</section>` : '';
  const detailBenefits = card.benefits.filter(benefit => !benefit.hideInDetail);
  const benefitsHtml = detailBenefits.map(benefit => {
    const tags = benefit.detailTags || describeBenefit(benefit, card);
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
  document.querySelector('#cardDetailContent').innerHTML = `<div class="verification-note">카드사 상품 안내를 바탕으로 정리한 주요 혜택과 적용 조건입니다. 실제 적용은 카드사의 가맹점 분류와 세부 약관에 따릅니다.</div>${groupHtml}<section class="rule-section"><h3>정리된 혜택 ${detailBenefits.length}개</h3><div class="benefit-rule-list">${benefitsHtml}</div></section>${note}<section class="rule-section"><h3>정보 출처</h3><p>${escapeHtml(card.source)}</p><div class="source-links"><a class="source-link" href="${sourceUrl}" target="_blank" rel="noreferrer">공식 안내 열기 <span aria-hidden="true">↗</span></a>${referenceLink}</div></section>`;
  document.querySelector('#cardDialog').showModal();
  document.querySelector('#cardDialog .dialog-card').scrollTop = 0;
}

function describeBenefit(benefit, card) {
  const tags = [];
  if (benefit.minSpend) tags.push(`전월 실적 ${won.format(benefit.minSpend)}원 이상`); else tags.push('전월 실적 조건 없음');
  if (benefit.rateTiers) {
    const rangeLabel = tier => tier.minAmount ? `${won.format(tier.minAmount)}원 이상` : `${won.format(tier.maxAmountExclusive)}원 미만`;
    benefit.rateTiers.forEach(tier => {
      const limits = [tier.dailyCap && `일 한도 ${won.format(tier.dailyCap)}원`, tier.monthlyCap && `월 한도 ${won.format(tier.monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`].filter(Boolean);
      tags.push(`결제금액 ${rangeLabel(tier)} · ${tier.rate * 100}%${limits.length ? ` · ${limits.join(' · ')}` : ''}`);
    });
  }
  if (benefit.minAmount) tags.push(`건당 이용금액 ${won.format(benefit.minAmount)}원 이상`);
  else if (benefit.maxAmountExclusive) tags.push(`건당 이용금액 ${won.format(benefit.maxAmountExclusive)}원 미만`);
  else tags.push('건당 이용 조건 없음');
  if (benefit.txnCap) tags.push(`건당 한도 ${won.format(benefit.txnCap)}원`);
  if (benefit.txnAmountCap) tags.push(`혜택 계산 대상 결제금액 최대 ${won.format(benefit.txnAmountCap)}원`);
  if (!benefit.rateTiers && benefit.dailyCap) tags.push(`일 한도 ${won.format(benefit.dailyCap)}원`);
  if (benefit.dailyCount) tags.push(`일 ${benefit.dailyCount}회`);
  const monthlyCapIsDerivedFromCount = benefit.flat && benefit.monthlyCount && benefit.monthlyCap === benefit.flat * benefit.monthlyCount;
  if (benefit.monthlyCount) {
    tags.push(`월 ${benefit.monthlyCount}회${benefit.group ? ' (통합한도 적용)' : ''}`);
    if (benefit.monthlyCap && !monthlyCapIsDerivedFromCount) tags.push(`월 한도 ${won.format(benefit.monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`);
    else if (!benefit.monthlyCap && !benefit.group) tags.push('월 한도 없음 (통합한도 미적용)');
  } else if (benefit.monthlyCap) tags.push(`월 한도 ${won.format(benefit.monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`);
  else if (benefit.group) tags.push('월 한도 통합한도 적용');
  else tags.push('월 한도 없음 (통합한도 미적용)');
  if (benefit.annualCount) tags.push(`연 ${benefit.annualCount}회`);
  if (benefit.specialCount) tags.push(`월 ${benefit.specialCount.join('·')}번째 결제`);
  if (benefit.dynamicRate) tags.push('결제일 기준 평일·주말 적용');
  const paymentShownInTitle = benefit.payment && (benefit.detailTitle?.startsWith(paymentLabel(benefit.payment)) || benefit.displayMerchants?.includes(paymentLabel(benefit.payment)));
  if (benefit.payment && !paymentShownInTitle) tags.push(`${paymentLabel(benefit.payment)}만 적용`);
  if (benefit.channel) tags.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 결제만 적용`);
  if (benefit.domesticOnly) tags.push('국내 이용만 적용');
  if (benefit.requiresEvent) tags.push('행사 대상 품목만 적용');
  if (benefit.requiresMilitary) tags.push('군 급여이체 조건 필요');
  if (benefit.conditionNote) tags.push(benefit.conditionNote);
  if (benefit.unlimited) tags.push('기본 적립 한도 없음');
  if (benefit.replaces) tags.push('상위 적립률 적용 시 기본 적립 대체');
  return tags;
}

function performanceThresholds(card) {
  const values = new Set();
  card.benefits.forEach(benefit => { if (benefit.minSpend) values.add(benefit.minSpend); });
  Object.values(card.groups || {}).flat().forEach(([minimum]) => values.add(minimum));
  return [...values].sort((a, b) => a - b);
}

function savedPerformanceTier(card) {
  if (!Object.prototype.hasOwnProperty.call(state.spends, card.id)) return '';
  const saved = Number(state.spends[card.id]) || 0;
  const thresholds = performanceThresholds(card);
  return String([...thresholds].reverse().find(value => saved >= value) || 0);
}

function renderStatusForm() {
  document.querySelector('#carrier').value = state.carrier || 'unset';
  document.querySelector('#membershipGrade').value = state.membershipGrade || 'silver';
  document.querySelector('#membershipMode').value = state.membershipMode || 'discount';
  document.querySelector('#phoneAmount').value = state.phoneAmount || 'unset';
  document.querySelector('#transitMode').value = state.transitMode || 'unset';
  document.querySelector('#statusList').innerHTML = cards.map(card => {
    const thresholds = performanceThresholds(card);
    const performanceControl = thresholds.length
      ? `<select id="spend-${card.id}" data-card="${card.id}"><option value="">미설정</option><option value="0">${shortSpend(thresholds[0])} 미만</option>${thresholds.map(value => `<option value="${value}">${shortSpend(value)} 이상</option>`).join('')}</select>`
      : '<div class="no-performance">실적 조건 없음</div>';
    const militaryOption = card.id === 'hana' ? `<label class="status-check"><input id="militarySalary" type="checkbox" ${state.militarySalary ? 'checked' : ''}><span>군 급여이체 적용</span></label>` : '';
    return `<div class="status-row"><div class="status-card-main"><div class="status-card-name">${escapeHtml(card.name)}<small>${escapeHtml(card.issuer)}</small></div><div class="status-inline-options"><label class="status-check"><input type="checkbox" data-card-enabled="${card.id}" ${isCardEnabled(card.id) ? 'checked' : ''}><span>추천에 포함</span></label>${militaryOption}</div></div><div class="status-controls"><label for="spend-${card.id}">전월 실적</label>${performanceControl}</div></div>`;
  }).join('');
  document.querySelectorAll('#statusList select[data-card]').forEach(select => { select.value = savedPerformanceTier(cards.find(card => card.id === select.dataset.card)); });
}

function bindMoneyInput(input) {
  input.addEventListener('input', () => {
    const n = input.value.replace(/[^0-9]/g,'');
    input.value = n ? won.format(Number(n)) : '';
  });
}

function saveStatus() {
  document.querySelectorAll('#statusList select[data-card]').forEach(select => {
    if (select.value === '') delete state.spends[select.dataset.card];
    else state.spends[select.dataset.card] = Number(select.value);
  });
  document.querySelectorAll('[data-card-enabled]').forEach(input => { state.cardEnabled[input.dataset.cardEnabled] = input.checked; });
  state.militarySalary = !!document.querySelector('#militarySalary')?.checked;
  state.carrier = document.querySelector('#carrier').value;
  state.membershipGrade = document.querySelector('#membershipGrade').value;
  state.membershipMode = document.querySelector('#membershipMode').value;
  state.phoneAmount = document.querySelector('#phoneAmount').value;
  if (state.carrier === 'none' || state.phoneAmount === 'none') { state.carrier = 'none'; state.phoneAmount = 'none'; state.membershipGrade = 'none'; }
  state.transitMode = document.querySelector('#transitMode').value;
  saveState();
  renderMerchantOptions();
  renderWallet();
  renderGuide();
  renderResults(inputValues());
  showToast('전월 실적을 저장했어요.');
}

function updateConditional() {
  const merchantId = document.querySelector('#merchant').value;
  const showEvent = merchantId === 'cu' || merchantId === 'megacoffee';
  const eventRow = document.querySelector('#eventItemRow');
  eventRow.hidden = !showEvent;
  eventRow.classList.toggle('is-hidden', !showEvent);
  eventRow.style.display = showEvent ? '' : 'none';
  if (showEvent) {
    document.querySelector('#eventItemTitle').textContent = merchantId === 'cu' ? 'CU 행사상품이에요' : '메가커피 행사 메뉴예요';
    document.querySelector('#eventItemHelp').textContent = merchantId === 'cu' ? '카드 행사 혜택과 T멤버십 제외 여부를 함께 판정합니다.' : '행사 메뉴는 T멤버십 할인·적립 대상에서 제외됩니다.';
  } else document.querySelector('#eventItem').checked = false;

  const eligibleBenefit = activeMembershipBenefits().find(benefit => benefit.merchants.includes(merchantId) && benefit.requiresMembershipEligible);
  const eligibleRow = document.querySelector('#membershipEligibleRow');
  eligibleRow.hidden = !eligibleBenefit;
  eligibleRow.classList.toggle('is-hidden', !eligibleBenefit);
  eligibleRow.style.display = eligibleBenefit ? '' : 'none';
  if (eligibleBenefit) {
    document.querySelector('#membershipEligibleTitle').textContent = eligibleBenefit.eligibleTitle;
    document.querySelector('#membershipEligibleHelp').textContent = eligibleBenefit.eligibleHelp;
  } else document.querySelector('#membershipEligible').checked = false;
}

function renderMerchantOptions() {
  const select = document.querySelector('#merchant');
  const previous = select.value;
  const available = merchants.filter(merchant => merchantAllowedByProfile(merchant.id));
  const groups = Object.groupBy ? Object.groupBy(available, merchant => merchant.category) : available.reduce((all, merchant) => ((all[merchant.category] ||= []).push(merchant), all), {});
  select.innerHTML = Object.entries(groups).map(([category, list]) => `<optgroup label="${escapeHtml(category)}">${list.map(merchant => `<option value="${merchant.id}">${escapeHtml(merchant.label)}</option>`).join('')}</optgroup>`).join('');
  select.value = available.some(merchant => merchant.id === previous) ? previous : available.some(merchant => merchant.id === 'starbucks') ? 'starbucks' : available[0]?.id || '';
  updateConditional();
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
  bindMoneyInput(document.querySelector('#amount'));
  document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => { document.querySelector('#amount').value = won.format(Number(button.dataset.amount)); renderResults(inputValues()); }));
  document.querySelector('#recommendForm').addEventListener('submit', e => { e.preventDefault(); renderResults(inputValues()); });
  document.querySelectorAll('#recommendForm input, #recommendForm select').forEach(el => el.addEventListener('change', () => { updateConditional(); renderResults(inputValues()); }));
  document.querySelector('#merchant').addEventListener('change', updateConditional);
  document.querySelector('#openStatus').addEventListener('click', () => { renderStatusForm(); const dialog = document.querySelector('#statusDialog'); dialog.showModal(); dialog.querySelector('.dialog-card').scrollTop = 0; });
  document.querySelector('#statusForm').addEventListener('submit', e => { if (e.submitter?.value === 'cancel') return; e.preventDefault(); saveStatus(); document.querySelector('#statusDialog').close(); });
  document.querySelector('#resetUsage').addEventListener('click', () => { state.usage={}; state.counts={}; state.dailyUsage={}; state.dailyCounts={}; saveState(); showToast('이번 달 혜택 기록을 초기화했어요.'); renderResults(inputValues()); renderGuide(); });
  document.querySelector('#openDetails').addEventListener('click', () => document.querySelector('#detailsDialog').showModal());
  document.querySelector('#closeDetails').addEventListener('click', () => document.querySelector('#detailsDialog').close());
  document.querySelector('#closeCardDetail').addEventListener('click', () => document.querySelector('#cardDialog').close());
  document.querySelector('#closeGuideDetail').addEventListener('click', () => document.querySelector('#guideDialog').close());
  renderGuide();
  renderWallet();
  updateConditional();
  renderResults(inputValues());
  registerWebMCP();
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
      description:'구매처와 결제 금액, 결제 방식을 화면에 적용하고 현재 실적과 한도를 반영한 추천 카드를 반환합니다.',
      inputSchema:{ type:'object', properties:{ merchant:{type:'string', enum:merchants.map(m=>m.id)}, amount:{type:'number', minimum:1}, payment:{type:'string', enum:['card','kbpay','kakaopay','samsungmoney','autopay']}, channel:{type:'string', enum:['online','offline']}, eventItem:{type:'boolean'}, membershipEligible:{type:'boolean'} }, required:['merchant','amount'], additionalProperties:false },
      annotations:{ readOnlyHint:true, untrustedContentHint:false },
      execute(input) {
        if (!merchants.some(m=>m.id===input.merchant) || !merchantAllowedByProfile(input.merchant) || !Number.isFinite(input.amount) || input.amount <= 0) throw new Error('현재 개인 설정에서 사용할 수 있는 구매처와 결제 금액이 필요합니다.');
        document.querySelector('#merchant').value=input.merchant;
        document.querySelector('#amount').value=won.format(Math.floor(input.amount));
        const payment=document.querySelector(`input[name="payment"][value="${input.payment || 'card'}"]`); if(payment) payment.checked=true;
        const channel=document.querySelector(`input[name="channel"][value="${input.channel || 'offline'}"]`); if(channel) channel.checked=true;
        document.querySelector('#eventItem').checked=!!input.eventItem;
        document.querySelector('#membershipEligible').checked=!!input.membershipEligible;
        updateConditional();
        const values=inputValues(); renderResults(values); const best=lastResults[0];
        return { card:best?.card.name || null, estimatedBenefit:best?.value || 0, benefitUnit:best?.eligible.every(x=>x.benefit.reward==='point')?'point':'won' };
      }
    });
  } catch (error) { console.warn('WebMCP registration unavailable', error); }
}

setup();
