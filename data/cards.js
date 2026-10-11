// 카드 혜택 데이터
// 날짜별 변동 규칙은 함수가 아니라 rateSchedule 같은 선언형 값으로 기록합니다.

function defaultBenefitType(id) {
  if (id.startsWith('nori-') || id.startsWith('hana-') || id.startsWith('kbank-') || id.startsWith('simple-')) return '캐시백';
  return '할인';
}

function b(id, merchants, label, options={}) { return { id, merchants, label, reward:'discount', benefitType:defaultBenefitType(id), ...options }; }

const cards = [
  {
    id: 'nori', issuer: 'KB국민카드', name: '노리2 체크카드(KB Pay)', kind: '캐시백형',
    source: '카드고릴라 2422 · KB국민카드 공식 안내',
    groups: { nori: [[200000, 20000], [400000, 30000], [600000, 40000], [800000, 50000]] },
    benefits: [
      b('nori-coffee', ['starbucks','coffeebean'], '스타벅스·커피빈 10%', { rate:.10, monthlyCap:3000, group:'nori', allowBelowGroup:true }),
      b('nori-mobile', ['googleplay','appstore'], '구글·앱스토어 10%', { rate:.10, minSpend:200000, monthlyCap:5000, group:'nori' }),
      b('nori-ticket', ['interpark'], '인터파크 티켓 10%', { rate:.10, minSpend:200000, monthlyCap:7000, group:'nori' }),
      b('nori-beauty', ['oliveyoung','hairsalon'], '올리브영·미용실 5%', { rate:.05, minSpend:200000, monthlyCap:2000, group:'nori' }),
      b('nori-store', ['gs25','cu'], 'GS25·CU 5%', { rate:.05, minSpend:200000, monthlyCap:2000, group:'nori' }),
      b('nori-sub', ['netflix','youtube'], '넷플릭스·유튜브 프리미엄 1,000원', { flat:1000, minAmount:10000, minSpend:200000, monthlyCap:2000, monthlyCount:2, group:'nori' }),
      b('nori-delivery', ['baemin','yogiyo'], '배달의민족·요기요 1,000원', { flat:1000, minAmount:10000, minSpend:200000, monthlyCap:1000, monthlyCount:1, group:'nori' }),
      b('nori-phone', ['skt','kt','lgu','liivm'], 'SKT·KT·LG U+·Liiv M 자동이체 2,500원', { flat:2500, minAmount:50000, minSpend:200000, monthlyCap:2500, monthlyCount:1, payment:'autopay', group:'nori' }),
      b('nori-cgv', ['cgv'], 'CGV 4,000원', { flat:4000, minAmount:10000, minSpend:200000, monthlyCap:8000, monthlyCount:2, group:'nori' }),
      b('nori-park', ['everland','lotteworld'], '에버랜드·롯데월드 15,000원', { flat:15000, minAmount:30000, minSpend:200000, monthlyCap:15000, monthlyCount:1, group:'nori' }),
      b('nori-kb-off', ['*'], 'KB Pay 오프라인 2% 추가', { rate:.02, minSpend:300000, monthlyCap:3000, payment:'kbpay', channel:'offline', group:'nori', stack:true, domesticOnly:true, detailTitle:'KB Pay · 2%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','오프라인 월 한도 3,000원 (통합한도 적용)','온라인 월 한도 2,000원 (통합한도 적용)','국내 이용만 적용'] }),
      b('nori-kb-on', ['*'], 'KB Pay 온라인 2% 추가', { rate:.02, minSpend:300000, monthlyCap:2000, payment:'kbpay', channel:'online', group:'nori', stack:true, domesticOnly:true, hideInDetail:true })
    ]
  },
  {
    id: 'soltravel', issuer: '신한카드', name: 'SOL트래블 체크', kind: '캐시백형', source: '카드고릴라 2667 · 신한카드 공식 안내', groups:{}, benefits:[
      b('sol-cu-event', ['cu'], 'CU 간편식·즉석원두커피 5% 할인', { rate:.05, txnCap:2000, requiresEvent:true, scopeLabel:'간편식·즉석원두커피', outsideScopeLabel:'그 외 CU 상품', channel:'offline', benefitType:'할인', membershipStacking:{ 'skt-cu':{ discount:'allowed' } }, detailTitle:'CU 간편식·즉석원두커피 · 5%', detailTags:['전월 실적 조건 없음','건당 이용 조건 없음','건당 한도 2,000원','월 한도 없음 (통합한도 미적용)','T멤버십 CU 할인과 중복 적용 가능'] }),
      b('sol-store', ['seveneleven','cu','gs25','emart24'], 'CU·GS25·세븐일레븐·이마트24 5%', { rate:.05, minSpend:300000, monthlyCap:3000, monthlyCount:3, dailyCount:1, benefitType:'캐시백' }),
      b('sol-transit', ['transit'], '시내버스·시외버스·지하철·공항버스·공항철도 1%', { rate:.01, minSpend:300000, monthlyCap:3000, benefitType:'캐시백', displayMerchants:['시내버스','시외버스','지하철','공항버스','공항철도'], conditionNote:'후불교통 터치(RF) 거래만 적용 · 고속버스 제외' }),
      b('sol-overseas-transit', ['overseas-transit'], '해외 대중교통 1%', { rate:.01, monthlyCap:3000, benefitType:'캐시백', conditionNote:'Mastercard 컨택리스 방식의 버스·지하철·트램 등만 적용 · 택시 제외' }),
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
      b('hana-cu', ['cu'], 'CU 음료·아이스크림·간편식 10%', { rate:.10, monthlyCap:50000, requiresEvent:true, scopeLabel:'음료·아이스크림·간편식', outsideScopeLabel:'그 외 T멤버십 적용 상품', membershipStacking:{ 'skt-cu':{ discount:'allowed' } }, detailTitle:'CU 음료·아이스크림·간편식 · 10%', detailTags:['전월 실적 조건 없음','건당 이용 조건 없음','월 한도 50,000원 (통합한도 미적용)','T멤버십 CU 할인과 중복 적용 가능'] }),
      b('hana-cgv-snack', ['cgv'], 'CGV 팝콘 스몰세트 무료', { flat:8000, requiresMilitary:true, monthlyCount:1, annualCount:6, benefitType:null, unsupported:true, resultText:'팝콘 세트 무료', membershipStacking:{ 'skt-cgv':{ discount:'blocked' } }, conditionNote:'CGV 매점 또는 공식 앱·웹에서 팝콘 스몰세트 1개 제공' }),
      b('hana-digital', ['appstore','googleplay','youtube','naverwebtoon','netflix','naverplusmembership','coupangwow'], 'App Store·구글플레이·유튜브 프리미엄·네이버웹툰·넷플릭스·네이버플러스 멤버십·쿠팡와우 멤버십 10%', { rate:.10, monthlyCap:2000, requiresMilitary:true, displayMerchants:['애플 App Store','구글플레이','유튜브 프리미엄','네이버웹툰','넷플릭스','네이버플러스 멤버십','쿠팡와우 멤버십'], conditionNote:'대상별 정기결제·결제수단 제외 조건 확인 필요' }),
      b('hana-transit', ['transit'], '버스·지하철 20%', { rate:.20, minSpend:100000, monthlyCap:10000, group:'hana' }),
      b('hana-hotel', ['military-hotel'], '국군복지단 호텔·콘도 20%', { rate:.20, minSpend:100000, monthlyCap:10000, group:'hana' }),
      b('hana-park', ['everland','lotteworld'], '에버랜드·롯데월드 이용권 50%', { rate:.50, minSpend:100000, monthlyCount:1, benefitType:'할인', channel:'offline', conditionNote:'이용권 1인 1매 구매에만 적용' }),
      b('hana-starbucks', ['starbucks'], '스타벅스 20%', { rate:.20, minAmount:10000, txnCap:4000, minSpend:100000, group:'hana' }),
      b('hana-restaurant', ['outback','vips'], '아웃백·VIPS 20%', { rate:.20, minAmount:10000, monthlyCap:20000, minSpend:100000, group:'hana' }),
      b('hana-fastfood', ['lotteria','mcdonalds','burgerking','momstouch','kfc','subway'], '롯데리아·맥도날드·버거킹·맘스터치·KFC·써브웨이 5%', { rate:.05, minAmount:10000, monthlyCap:2000, minSpend:100000, group:'hana', membershipStacking:{ 'skt-lotteria':{ discount:'allowed' } }, displayMerchants:['롯데리아','맥도날드','버거킹','맘스터치','KFC','써브웨이'], conditionNote:'롯데리아 T멤버십 지정 세트 할인과 함께 적용 가능 · T멤버십 할인 후 승인금액 기준 캐시백 예상' }),
      b('hana-shopping', ['musinsa','29cm','gmarket','auction','11st'], '무신사·29CM·G마켓·옥션·11번가 10%', { rate:.10, minAmount:10000, monthlyCap:5000, minSpend:100000, group:'hana', channel:'online' }),
      b('hana-test', ['language-test'], 'TOEIC·OPIc·TEPS·JPT·HSK 5%', { rate:.05, monthlyCap:5000, minSpend:100000, group:'hana', displayMerchants:['TOEIC','OPIc','TEPS','JPT','HSK'], conditionNote:'공식 사이트를 통한 응시료 결제만 적용' }),
      b('hana-book', ['kyobo','aladin'], '교보문고·알라딘 5%', { rate:.05, monthlyCap:5000, minSpend:100000, group:'hana' }),
      b('hana-rail', ['rail'], 'KTX·SRT·ITX·고속버스·시외버스 5%', { rate:.05, monthlyCap:2000, minSpend:100000, group:'hana', displayMerchants:['KTX','SRT','ITX','고속버스','시외버스'], conditionNote:'공식 홈페이지·앱 또는 오프라인 결제만 적용' }),
      b('hana-delivery-desire', ['baemin','yogiyo','coupangeats'], '배달의민족·요기요·쿠팡이츠 20%', { rate:.20, monthlyCap:5000, requiresMilitary:true }),
      b('hana-taxi-desire', ['taxi'], '군 급여이체 택시 20%', { rate:.20, monthlyCap:5000, requiresMilitary:true })
    ]
  },
  {
    id: 'deepdream', issuer: '신한카드', name: 'Deep Dream 체크', kind: '적립형', source: '카드고릴라 281 · 신한카드 공식 안내', membershipDiscountBlocked:true,
    groups:{ dream:[[200000,5000],[400000,15000],[800000,30000]] }, groupLabels:{ dream:'더해드림·챙겨드림 통합 적립 한도' }, benefits:[
      b('dream-base', ['*'], '모두드림 0.2%', { rate:.002, reward:'point', unlimited:true, fallback:true }),
      b('dream-mart', ['emart','lottemart','homeplus','hanaro','traders','vicmarket'], '이마트·홈플러스·롯데마트·농협 하나로마트·클럽·이마트 트레이더스·롯데 VIC마켓 0.6%', { rate:.006, reward:'point', minSpend:200000, group:'dream', replaces:'dream-base', displayMerchants:['이마트','홈플러스','롯데마트','농협 하나로마트·클럽','이마트 트레이더스','롯데 VIC마켓'], conditionNote:'오프라인 쇼핑 결제만 적용 · SSM·온라인 매장 제외' }),
      b('dream-retail', ['cu','gs25','seveneleven','oliveyoung','daiso'], 'CU·GS25·세븐일레븐·올리브영·다이소 0.6%', { rate:.006, reward:'point', minSpend:200000, group:'dream', replaces:'dream-base', displayMerchants:['CU','GS25','세븐일레븐','올리브영','다이소'], conditionNote:'온라인·백화점·할인점 입점 매장 제외' }),
      b('dream-enjoy', ['cgv','lottecinema','coffee','starbucks','coffeebean','twosome','megacoffee','compose','paikdabang','gongcha','paulbassett','dunkin'], 'CGV·롯데시네마·커피 업종 0.6%', { rate:.006, reward:'point', minSpend:200000, group:'dream', replaces:'dream-base', displayMerchants:['CGV','롯데시네마','커피 업종'], conditionNote:'영화는 공식 앱·웹 또는 현장 결제 · 커피는 카드사 등록 업종 가맹점만 적용' }),
      b('dream-overseas', ['overseas'], '해외 일시불 0.6%', { rate:.006, reward:'point', minSpend:200000, group:'dream', replaces:'dream-base' }),
      b('dream-phone', ['skt','kt','lgu'], 'SKT·KT·LG U+ 자동이체 0.6%', { rate:.006, reward:'point', minSpend:200000, group:'dream', replaces:'dream-base', conditionNote:'순수 통신요금 자동이체만 적용 · 알뜰폰 제외' }),
      b('dream-top-area', [], 'DREAM 영역 중 최다 이용 영역 1.0%', { reward:'point', minSpend:200000, group:'dream', unsupported:true, detailTitle:'DREAM 영역 중 최다 이용 영역 · 1.0%', detailTags:['전월 실적 200,000원 이상','당월 가장 많이 이용한 DREAM 영역 1개에 적용','더해드림 0.6%에 추가 0.4% 적립','익월 15일 자동 적립','월 통합 한도 적용'] }),
      b('dream-taxi', ['taxi'], '택시 3·6·9회째 1,000P', { reward:'point', minSpend:200000, unsupported:true, resultText:'해당 회차 1,000P', conditionNote:'당월 3·6·9번째 택시 이용·오프라인 현장 결제만 적용', detailTitle:'택시 · 1,000P', detailTags:['전월 실적 200,000원 이상','당월 3·6·9번째 이용 때마다 1,000P 적립','오프라인 현장 결제만 적용'] }),
      b('dream-gas', ['gas','gs-caltex','skenergy','s-oil','hyundaioilbank'], '주말 주유 리터당 40P', { reward:'point', minSpend:200000, unsupported:true, resultText:'리터당 40P', replaces:'dream-base', blocksFallback:true, conditionNote:'토·일 주유만·실제 주유량에 따라 적립액 확정·LPG 제외', detailTitle:'주말 주유소 · 리터당 40P', detailTags:['전월 실적 200,000원 이상','토·일 주유소 업종만 적용','당월 주유금액 200,000원까지 적용','모두드림과 중복 적립 불가','LPG 충전 제외'] }),
      b('dream-welcome', [], '신규 발급 반겨드림 3,000P', { reward:'point', unsupported:true, detailTitle:'신규 발급 반겨드림 · 3,000P', detailTags:['카드 사용 등록일 포함 90일 안에 800,000원 이상 이용 시','90일이 속하는 달의 익월 15일 적립','최초 발급 시 1회만 제공'] }),
      b('dream-bank-fee', [], '신한은행 수수료 월 10회 면제', { unsupported:true, benefitType:null, detailTitle:'신한은행 수수료 · 월 10회 면제', detailTags:['전월 실적 200,000원 이상','신한은행 결제계좌 지정 필요','다른 은행 이체·CD/ATM 현금인출 수수료 대상'] })
    ], note:'더해드림은 DREAM 영역 0.6%를 계산하고, 당월 최다 이용 영역의 추가 0.4%는 월말 확정 후 익월 15일 적립됩니다. 주유는 리터당 적립이라 실제 주유량·유가가 필요해 자동 금액 계산에서는 제외했습니다.'
  },
  {
    id: 'kakaobank', issuer: '카카오뱅크', name: '프렌즈 체크카드', kind: '캐시백형', source: '카카오뱅크 공식 안내 · 캐시백 프로모션 2026 (2026.02.01~2027.01.31)', groups:{ kbankPromo:[[300000,1000]] }, groupLabels:{ kbankPromo:'GS25·커피 통합 한도' }, benefits:[
      b('kbank-base', ['*'], '조건 없는 기본 캐시백', { rateSchedule:{ type:'weekday', weekday:.002, weekend:.004 }, dynamicRateLabel:'0.2~0.4%', unlimited:true, fallback:true, conditionNote:'평일 0.2% · 주말 0.4%' }),
      b('kbank-baemin', ['baemin'], '배달의민족 1,000원', { flat:1000, minAmount:20000, minSpend:300000, monthlyCount:1, conditionNote:'배민페이 또는 카카오뱅크 카드 직접 결제만 적용' }),
      b('kbank-gs25', ['gs25'], 'GS25 100원', { flat:100, minAmount:5000, minSpend:300000, monthlyCount:10, group:'kbankPromo', conditionNote:'오프라인 결제만 적용' }),
      b('kbank-coffee', ['compose','megacoffee','paikdabang'], '컴포즈커피·메가MGC커피·빽다방 100원', { flat:100, minAmount:2000, minSpend:300000, monthlyCount:10, group:'kbankPromo', conditionNote:'오프라인 결제만 적용' }),
      b('kbank-daiso', ['daiso'], '다이소 1,000원', { flat:1000, minAmount:20000, minSpend:300000, monthlyCount:1 }),
      b('kbank-coupang', ['coupang'], '쿠팡 3,000원', { flat:3000, minAmount:50000, minSpend:300000, monthlyCount:1 }),
      b('kbank-ably', ['ably'], '에이블리 2,000원', { flat:2000, minAmount:50000, minSpend:300000, monthlyCount:1 }),
      b('kbank-gas', ['gs-caltex'], 'GS칼텍스 3,000원', { flat:3000, minAmount:50000, minSpend:300000, monthlyCount:1 }),
      b('kbank-phone', ['skt','kt','lgu'], 'SKT·KT·LG U+ 자동이체 3,000원', { flat:3000, minAmount:50000, minSpend:300000, monthlyCount:1, payment:'autopay', conditionNote:'알뜰폰 제외 · 카드 자동이체 등록 건만 적용' }),
      b('kbank-academy', ['academy'], '학원업종 10,000원', { flat:10000, minAmount:200000, minSpend:300000, monthlyCount:1, conditionNote:'학원·자동차학원·독서실 업종만 적용' }),
      b('kbank-taxi', ['taxi'], '택시 1,000원', { flat:1000, minAmount:30000, minSpend:300000, monthlyCount:1 }),
      b('kbank-transit', ['transit'], '버스·지하철 4,000원', { flat:4000, minSpend:300000, monthlyCount:1, unsupported:true, resultText:'월 누적 충족 시 4,000원', conditionNote:'월 누적 이용금액 50,000원 이상 시 · 후불교통 버스·지하철만 적용' })
    ]
  },
  {
    id: 'kakaopay', issuer: '신한카드', name: '카카오페이 신한 체크카드', kind: '적립형', source: '카드고릴라 286 · 신한카드 공식 안내',
    groups:{ kakao:[[300000,5000],[500000,7000],[700000,10000],[1000000,13000]] }, benefits:[
      b('kakao-pay', ['*'], '카카오페이 결제 2%', { rate:.02, reward:'point', payment:'kakaopay', monthlyCap:10000, fallback:true, domesticOnly:true, displayMerchants:['카카오페이'] }),
      b('kakao-transit', ['transit'], '버스·지하철 3%', { rate:.03, reward:'point', minSpend:300000, monthlyCap:5000, group:'kakao' }),
      b('kakao-phone', ['skt','kt','lgu'], 'SKT·KT·LG U+ 자동이체 3%', { rate:.03, reward:'point', minSpend:300000, minAmount:50000, monthlyCap:5000, payment:'autopay', group:'kakao' }),
      b('kakao-cgv', ['cgv'], 'CGV 최대 3,000P', { flat:3000, reward:'point', minSpend:300000, monthlyCount:1, group:'kakao', membershipStacking:{ 'skt-cgv':{ discount:'blocked' } }, conditionNote:'CGV 앱·홈페이지 직접 예매 또는 극장 현장 결제만 적용 · T멤버십 앱 무비 예매 제외' }),
      b('kakao-overseas', ['overseas'], '해외 가맹점 1%', { rate:.01, reward:'point' })
    ], note:'국내 혜택이 겹치면 교통·통신·영화가 우선이며 중복 적립되지 않습니다.'
  },
  {
    id: 'simple', issuer: '하나카드', name: '더 심플 체크카드', kind: '캐시백형', source: '카드고릴라 2810 · 하나카드 상품설명서', groups:{}, benefits:[
      b('simple-phone', ['skt','kt','lgu','mvno'], 'SKT·KT·LG U+·알뜰폰 자동이체 5,000원', { flat:5000, minAmount:10000, minSpend:300000, monthlyCap:5000, payment:'autopay' }),
      b('simple-coffee', ['starbucks','coffeebean','twosome'], '스타벅스·커피빈·투썸플레이스 5%', { rate:.05, minAmount:10000, minSpend:300000, monthlyCap:2000, channel:'offline' })
    ]
  },
  {
    id: 'samsungmoney', issuer: 'Samsung Wallet · 우리카드 제휴', name: '삼성월렛 머니', kind: '적립형', source: '삼성전자 Samsung Wallet 공식 안내', requiredPayment:'samsungmoney', groups:{}, benefits:[
      b('samsungmoney-offline', ['*'], '오프라인 0.5% 기본 적립', { rate:.005, reward:'point', payment:'samsungmoney', channel:'offline', domesticOnly:true, unlimited:true, fallback:true }),
      b('samsungmoney-online', ['naverplus','hmall','lotteon','cjonstyle','wconcept'], '네이버플러스 스토어·H몰·롯데ON·CJ온스타일·W컨셉 1.5% 기본 적립', { rate:.015, reward:'point', payment:'samsungmoney', channel:'online', domesticOnly:true, unlimited:true })
    ], note:'온라인은 삼성월렛 머니를 지원하는 제휴처에서만 사용할 수 있습니다. 우리은행 계좌 연결 및 월별 이벤트 추가 적립은 변경·조기 종료될 수 있어 현재 자동 계산에서 제외했습니다.'
  },
  {
    id: 'love', issuer: '신한카드', name: '신한카드 LOVE', kind: '할인형', source: '신한카드 LOVE 공식 안내',
    groups:{ love:[[200000,5000],[300000,10000],[500000,20000],[800000,30000],[1500000,50000]] }, benefits:[
      b('love-offline-shop', ['lotte-department','hyundai-department','shinsegae-department','galleria-department','emart','lottemart','homeplus'], '롯데·현대·신세계·갤러리아백화점·이마트·롯데마트·홈플러스 5%', { rate:.05, minSpend:200000, txnAmountCap:100000, txnCap:5000, monthlyCount:2, group:'love', displayMerchants:['롯데·현대·신세계·갤러리아백화점','이마트·롯데마트·홈플러스'], conditionNote:'오프라인 매장만 적용 · SSM·상품권 구매 제외' }),
      b('love-online-shop', ['gshome'], 'GS홈쇼핑 5%', { rate:.05, minSpend:200000, txnAmountCap:100000, txnCap:5000, dailyCount:1, monthlyCount:2, group:'love' }),
      b('love-gas', ['gs-caltex'], 'GS칼텍스 리터당 60원', { rate:60 / 1700, valueLabel:'리터당 60원', minSpend:200000, txnAmountCap:100000, monthlyCap:10588, dailyCount:2, group:'love', conditionNote:'리터당 60원 할인·LPG 제외·경유/등유는 휘발유 기준 적용', detailTitle:'GS칼텍스 · 리터당 60원', detailTags:['전월 실적 200,000원 이상','일 2회','혜택 계산 대상 결제금액 건당 최대 100,000원','월 주유금액 300,000원까지 적용','LPG 제외 · 경유·등유는 휘발유 기준 적용','기준유가에 따라 실제 할인액이 달라질 수 있음'] }),
      b('love-starbucks', ['starbucks'], '스타벅스 20%', { rate:.20, minSpend:200000, txnAmountCap:10000, txnCap:2000, dailyCount:1, monthlyCount:5, group:'love', membershipDiscountBlocked:true, conditionNote:'통신사 카드·쿠폰과 중복 할인 불가' }),
      b('love-restaurant20', ['outback','pariscroissant','cafemamas'], '아웃백·파리크라상·카페마마스 20%', { rate:.20, minSpend:200000, txnAmountCap:100000, monthlyCount:2, countGroup:'love-family-restaurant', group:'love', membershipDiscountBlocked:true, displayMerchants:['아웃백','파리크라상','카페마마스'], conditionNote:'패밀리 레스토랑 통합 월 2회 · 단품 메뉴만 적용 · 타 쿠폰·통신사 카드와 중복 할인 불가' }),
      b('love-restaurant30', ['bulgogibrothers','jeiljemyunso'], '불고기브라더스·제일제면소 30%', { rate:.30, minSpend:200000, txnAmountCap:100000, monthlyCount:2, countGroup:'love-family-restaurant', group:'love', membershipDiscountBlocked:true, displayMerchants:['불고기브라더스','제일제면소'], conditionNote:'패밀리 레스토랑 통합 월 2회 · 단품 메뉴만 적용 · 타 쿠폰·통신사 카드와 중복 할인 불가' }),
      b('love-cgv', ['cgv','megabox'], 'CGV·메가박스 최대 7,000원', { flat:7000, minSpend:200000, monthlyCount:1, group:'love', membershipStacking:{ 'skt-cgv':{ discount:'blocked' }, 'skt-megabox':{ discount:'blocked' } }, conditionNote:'공식 홈페이지·앱 예매만 적용(메가박스) · T멤버십 앱 무비 예매 제외' }),
      b('love-lg', ['lgelectronics'], 'LG전자·하이프라자 5%', { rate:.05, minSpend:200000, txnAmountCap:100000, txnCap:5000, dailyCount:1, monthlyCount:2, group:'love', channel:'offline' }),
      b('love-beautyplex', ['beautyplex'], '뷰티플렉스 10%', { rate:.10, minSpend:200000, txnAmountCap:100000, txnCap:10000, dailyCount:1, monthlyCount:2, group:'love', channel:'offline' }),
      b('love-everland', ['everland','lotteworld','seoulland'], '에버랜드·롯데월드·서울랜드 50%', { rate:.50, minSpend:300000, dailyCount:1, annualCount:3, benefitType:'할인' }),
      b('love-caribbean', ['caribbean'], '캐리비안베이 30%', { rate:.30, minSpend:300000, dailyCount:1, annualCount:3, benefitType:'할인' }),
      b('love-sports', [], 'LG 스포츠 홈경기 할인', { unsupported:true, benefitType:null, detailTitle:'LG트윈스·LG세이커스 홈경기 · 2,000~3,000원', detailTags:['LG트윈스 잠실 홈경기 본인 2,000원 할인','LG세이커스 창원 홈경기 일반석 본인 3,000원 할인','LG트윈스는 현장·온라인 예매 통합 일 1회'] }),
      b('love-point', [], 'LOVE 포인트 0.2%', { rate:.002, reward:'point', unsupported:true, detailTitle:'모든 가맹점 · 0.2%', detailTags:['신한은행 또는 신한금융투자 CMA 결제계좌 연결 필요','Love 할인·무이자할부 적용 거래는 적립 제외','전월 실적 조건 없음 · 적립 한도 없음'] }),
      b('love-point-plus', [], '신한은행 금융거래 추가 포인트', { reward:'point', unsupported:true, detailTitle:'신한은행 금융거래 · 추가 0.1~0.5%', detailTags:['금융거래 인정 항목 1개 이상: 0.1% 추가','3개 이상: 0.2% 추가 · 5개 이상: 0.5% 추가','신한은행 금융상품별 잔액 조건 충족 필요'] })
    ], note:'GS칼텍스 주유 할인은 카드사 기준유가로 환산됩니다. 계산기에서는 리터당 60원 혜택을 약 1,700원 기준유가로 환산한 예상 할인액으로 안내합니다.'
  }
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
  love: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1226051_2207.html'
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
