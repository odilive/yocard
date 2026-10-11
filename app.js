const won = new Intl.NumberFormat('ko-KR');
const today = new Date();
const period = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const dayKey = today.toISOString().slice(0, 10);

const merchants = [
  ['starbucks', '스타벅스', '카페'], ['megacoffee', '메가MGC커피', '카페'], ['compose', '컴포즈커피', '카페'], ['paikdabang', '빽다방', '카페'], ['twosome', '투썸플레이스', '카페'], ['coffeebean', '커피빈', '카페'], ['gongcha', '공차', '카페'], ['paulbassett', '폴 바셋', '카페'], ['dunkin', '던킨', '카페'], ['baskin', '배스킨라빈스', '카페'], ['angelinus', '엔제리너스', '카페'], ['baekmidang', '백미당', '카페'], ['droptop', '드롭탑', '카페'], ['artisee', '아티제', '카페'], ['pascucci', '파스쿠찌', '카페'], ['theventi', '더벤티', '카페'], ['misterhealing', '미스터힐링', '카페'], ['coffee', '기타 카페', '카페'],
  ['parisbaguette', '파리바게뜨', '베이커리'], ['touslesjours', '뚜레쥬르', '베이커리'], ['pariscroissant', '파리크라상', '베이커리'], ['billyangel', '빌리엔젤', '베이커리'], ['breadnco', '브레댄코', '베이커리'], ['openbakery', '열린베이커리', '베이커리'],
  ['cu', 'CU', '편의점'], ['gs25', 'GS25', '편의점'], ['seveneleven', '세븐일레븐', '편의점'], ['emart24', '이마트24', '편의점'],
  ['naverplus', '네이버플러스 스토어', '온라인쇼핑'], ['coupang', '쿠팡', '온라인쇼핑'], ['gmarket', 'G마켓', '온라인쇼핑'], ['11st', '11번가', '온라인쇼핑'], ['musinsa', '무신사', '온라인쇼핑'], ['29cm', '29CM', '온라인쇼핑'], ['ably', '에이블리', '온라인쇼핑'], ['auction', '옥션', '온라인쇼핑'], ['lotteon', '롯데ON', '온라인쇼핑'], ['hmall', 'H몰', '온라인쇼핑'], ['cjonstyle', 'CJ온스타일', '온라인쇼핑'], ['wconcept', 'W컨셉', '온라인쇼핑'],
  ['googleplay', '구글플레이스토어', '구독·디지털'], ['appstore', '앱스토어', '구독·디지털'], ['netflix', '넷플릭스', '구독·디지털'], ['youtube', '유튜브 프리미엄', '구독·디지털'], ['naverwebtoon', '네이버웹툰', '구독·디지털'], ['naverplusmembership', '네이버플러스 멤버십', '구독·디지털'], ['coupangwow', '쿠팡와우 멤버십', '구독·디지털'],
  ['baemin', '배달의민족', '배달'], ['yogiyo', '요기요', '배달'], ['coupangeats', '쿠팡이츠', '배달'],
  ['cgv', 'CGV', '영화·문화'], ['lottecinema', '롯데시네마', '영화·문화'], ['megabox', '메가박스', '영화·문화'], ['interpark', '인터파크 티켓', '영화·문화'],
  ['oliveyoung', '올리브영', '생활·뷰티'], ['daiso', '다이소', '생활·뷰티'], ['hairsalon', '미용실', '생활·뷰티'],
  ['skt', 'SKT 통신요금', '통신'], ['kt', 'KT 통신요금', '통신'], ['lgu', 'LG U+ 통신요금', '통신'], ['liivm', 'Liiv M 통신요금', '통신'], ['mvno', '기타 알뜰폰 통신요금', '통신'],
  ['transit', '버스·지하철', '교통·주유'], ['taxi', '택시', '교통·주유'], ['rail', 'KTX·SRT·ITX', '교통·주유'], ['overseas-transit', '해외 대중교통', '해외'],
  ['gs-caltex', 'GS칼텍스', '교통·주유'], ['skenergy', 'SK에너지', '교통·주유'], ['s-oil', 'S-OIL', '교통·주유'], ['hyundaioilbank', '현대오일뱅크', '교통·주유'], ['gas', '기타 주유소', '교통·주유'],
  ['everland', '에버랜드', '놀이공원'], ['lotteworld', '롯데월드', '놀이공원'], ['seoulland', '서울랜드', '놀이공원'], ['caribbean', '캐리비안베이', '놀이공원'],
  ['outback', '아웃백', '외식'], ['vips', 'VIPS', '외식'], ['yugane', '유가네닭갈비', '외식'], ['madforgarlic', '매드포갈릭', '외식'], ['ontheborder', '온더보더', '외식'], ['lagrillia', '라그릴리아', '외식'], ['saboten', '사보텐', '외식'], ['crabhouse', '크래버대게나라', '외식'], ['tacobell', '타코벨', '외식'], ['salady', '샐러디', '외식'], ['hibarin', '히바린', '외식'], ['dowonstyle', '도원스타일', '외식'], ['cafemamas', '카페마마스', '외식'], ['bulgogibrothers', '불고기브라더스', '외식'], ['jeiljemyunso', '제일제면소', '외식'],
  ['lotteria', '롯데리아', '패스트푸드'], ['mcdonalds', '맥도날드', '패스트푸드'], ['burgerking', '버거킹', '패스트푸드'], ['momstouch', '맘스터치', '패스트푸드'], ['kfc', 'KFC', '패스트푸드'], ['subway', '써브웨이', '패스트푸드'],
  ['domino', '도미노피자', '패스트푸드'], ['pizzahut', '피자헛', '패스트푸드'], ['papajohns', '파파존스피자', '패스트푸드'],
  ['bhc', 'bhc', '패스트푸드'], ['mexicana', '멕시카나', '패스트푸드'], ['misterpizza', '미스터피자', '패스트푸드'], ['banolimpizza', '반올림피자', '패스트푸드'], ['pizzaalvolo', '피자알볼로', '패스트푸드'], ['bbq', 'BBQ', '패스트푸드'], ['kyochon', '교촌치킨', '패스트푸드'], ['goobne', '굽네치킨', '패스트푸드'], ['nene', '네네치킨', '패스트푸드'], ['cheogajip', '처갓집양념치킨', '패스트푸드'],
  ['emart', '이마트', '대형마트'], ['lottemart', '롯데마트', '대형마트'], ['homeplus', '홈플러스', '대형마트'], ['hanaro', '농협 하나로마트·클럽', '대형마트'], ['traders', '이마트 트레이더스', '대형마트'], ['vicmarket', '롯데 VIC마켓', '대형마트'],
  ['lotte-department', '롯데백화점', '백화점'], ['hyundai-department', '현대백화점', '백화점'], ['shinsegae-department', '신세계백화점', '백화점'], ['galleria-department', '갤러리아백화점', '백화점'], ['gshome', 'GS홈쇼핑', '온라인쇼핑'], ['lgelectronics', 'LG전자·하이프라자', '생활·뷰티'], ['beautyplex', '뷰티플렉스', '생활·뷰티'],
  ['px', '군마트(PX)', '군복지'], ['military-hotel', '국군복지단 호텔·콘도', '군복지'], ['language-test', '어학시험', '교육·서점'], ['academy', '학원', '교육·서점'], ['kyobo', '교보문고', '교육·서점'], ['aladin', '알라딘', '교육·서점'],
  ['overseas', '해외 일반 가맹점', '해외'], ['other', '그 외 일반 가맹점', '기타']
].map(([id, label, category]) => ({ id, label, category }));

// 계산기 선택창은 카드사 분류가 아니라, 실제 결제처를 떠올리기 쉬운 순서로 고정한다.
const merchantCategoryOrder = ['카페','베이커리','편의점','패스트푸드','외식','배달','생활·뷰티','온라인쇼핑','대형마트','백화점','통신','구독·디지털','영화·문화','놀이공원','교통·주유','교육·서점','군복지','해외','기타'];
const categoryAliases = {
  '구독':'구독·디지털', '디지털':'구독·디지털',
  '생활':'생활·뷰티', '뷰티':'생활·뷰티',
  '영화':'영화·문화', '문화':'영화·문화',
  '교통':'교통·주유', '주유':'교통·주유',
  '교육':'교육·서점', '서점':'교육·서점'
};

// 금액 미정일 때 혜택의 상대적인 크기를 비교하기 위한 카테고리별 기준금액이다.
const categorySampleAmounts = {
  '카페':12000, '편의점':10000, '베이커리':15000, '온라인쇼핑':30000,
  '배달':20000, '구독·디지털':15000, '영화·문화':30000, '생활·뷰티':30000, '교통·주유':50000, '통신':60000,
  '외식':50000, '대형마트':80000, '백화점':80000, '패스트푸드':30000,
  '놀이공원':50000, '교육·서점':100000, '군복지':50000, '해외':50000
};

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
      b('kbank-base', ['*'], '조건 없는 기본 캐시백', { dynamicRate:() => [0,6].includes(today.getDay()) ? .004 : .002, unlimited:true, fallback:true }),
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
      b('love-gas', ['gs-caltex'], 'GS칼텍스 리터당 60원', { rate:60 / 1700, minSpend:200000, txnAmountCap:100000, monthlyCap:10588, dailyCount:2, group:'love', detailTitle:'GS칼텍스 · 리터당 60원', detailTags:['전월 실적 200,000원 이상','일 2회','혜택 계산 대상 결제금액 건당 최대 100,000원','월 주유금액 300,000원까지 적용','LPG 제외 · 경유·등유는 휘발유 기준 적용','기준유가에 따라 실제 할인액이 달라질 수 있음'] }),
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

const membershipGradeLabels = { vip:'VIP', gold:'GOLD', silver:'SILVER' };
const membershipProvider = { id:'skt-membership', issuer:'SK텔레콤', name:'T멤버십', kind:'통신사 멤버십' };
const membershipSourceUrl = 'https://m.tworld.co.kr/membership/benefit/brand';
const membershipCheckedAt = '2026-10-11';
const membershipCategoryUrls = {
  bakery:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/list-tab1.do?mediumCategoryId=53',
  dining:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/list-tab1.do?mediumCategoryId=54',
  cafe:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/list-tab1.do?mediumCategoryId=55',
  fastfood:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/list-tab1.do?mediumCategoryId=56',
  themepark:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/list-tab1.do?mediumCategoryId=110',
  all:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/list-tab2.do'
};
const membershipBenefits = [
  // 베이커리 6곳
  mb('skt-paris', ['parisbaguette'], '파리바게뜨 1천원당 50원 할인', { membershipCategory:'베이커리', unitBase:1000, unitValue:50, unitValueByGrade:{vip:100,gold:100}, labelByGrade:{vip:'파리바게뜨 1천원당 100원 할인',gold:'파리바게뜨 1천원당 100원 할인'}, minAmount:1000, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:20000,gold:20000}, conditionNote:'1일 1회·타 적립/쿠폰 중복 불가·일부 특수매장 제외', conditionNoteByGrade:{vip:'모바일카드 기준(플라스틱카드는 50원)·1일 1회·타 적립/쿠폰 중복 불가',gold:'모바일카드 기준(플라스틱카드는 50원)·1일 1회·타 적립/쿠폰 중복 불가'}, sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1053' }),
  mb('skt-tous', ['touslesjours'], '뚜레쥬르 1천원당 50원 할인', { membershipCategory:'베이커리', unitBase:1000, unitValue:50, unitValueByGrade:{vip:150,gold:150}, labelByGrade:{vip:'뚜레쥬르 1천원당 150원 할인',gold:'뚜레쥬르 1천원당 150원 할인'}, minAmount:1000, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:30000,gold:30000}, conditionNote:'1일 1회·온라인몰 및 일부 특수매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1084' }),
  mb('skt-pariscroissant', ['pariscroissant'], '파리크라상 1천원당 50원 할인', { membershipCategory:'베이커리', unitBase:1000, unitValue:50, unitValueByGrade:{vip:100,gold:100}, labelByGrade:{vip:'파리크라상 1천원당 100원 할인',gold:'파리크라상 1천원당 100원 할인'}, minAmount:1000, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:20000,gold:20000}, conditionNote:'1일 1회·타 적립/쿠폰 중복 불가·일부 특수매장 제외', conditionNoteByGrade:{vip:'모바일카드 기준(플라스틱카드는 50원)·1일 1회·타 적립/쿠폰 중복 불가',gold:'모바일카드 기준(플라스틱카드는 50원)·1일 1회·타 적립/쿠폰 중복 불가'}, sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1121' }),
  mb('skt-billyangel', ['billyangel'], '빌리엔젤 음료 15% 할인', { membershipCategory:'베이커리', rate:.15, requiresMembershipEligible:true, scopeLabel:'음료(병음료 제외)', outsideScopeLabel:'케이크 등 그 외 상품', dailyCount:1, channel:'offline', alwaysDiscount:true, conditionNote:'음료만 적용·다른 쿠폰/할인 중복 불가·일부 매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1151' }),
  mb('skt-breadnco', ['breadnco'], '브레댄코 10% 할인', { membershipCategory:'베이커리', rate:.10, minAmount:1000, dailyCount:1, dailyCap:20000, txnAmountCap:200000, channel:'offline', alwaysDiscount:true, conditionNote:'매장 결제만·다른 쿠폰/할인 중복 불가·일부 매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=62' }),
  mb('skt-openbakery', ['openbakery'], '열린베이커리 10% 할인', { membershipCategory:'베이커리', rate:.10, dailyCount:1, channel:'offline', alwaysDiscount:true, conditionNote:'매장 현장 결제만 적용', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1097' }),

  // 외식 13곳
  mb('skt-outback', ['outback'], '아웃백 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'아웃백 15% 할인',gold:'아웃백 15% 할인'}, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:20000,gold:20000}, monthlyCount:4, conditionNote:'1일 1회·월 4회', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1173' }),
  mb('skt-lotteria', ['lotteria'], '롯데리아 지정 버거세트 5종 1천원당 150원 할인', { membershipCategory:'외식', unitBase:1000, unitValue:150, requiresMembershipEligible:true, scopeLabel:'지정 버거세트 5종', outsideScopeLabel:'그 외 롯데리아 메뉴', eligibleTitle:'지정 버거세트 5종을 주문해요', eligibleHelp:'한우불고기·빅불·핫크리스피버거·새우버거·데리버거 세트만 적용', dailyCount:1, dailyCap:30000, channel:'offline', conditionNote:'지정 세트 5종·매장 주문만·배달/픽업 제외·타 쿠폰/행사 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1094' }),
  mb('skt-vips', ['vips'], 'VIPS 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'VIPS 15% 할인',gold:'VIPS 15% 할인'}, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:30000,gold:30000}, discountExclusiveWithCard:true, conditionNote:'1일 1회·신용카드 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=918' }),
  mb('skt-yugane', ['yugane'], '유가네닭갈비 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.10,gold:.10}, labelByGrade:{vip:'유가네닭갈비 10% 할인',gold:'유가네닭갈비 10% 할인'}, dailyCount:1, dailyCap:4000, channel:'offline', conditionNote:'매장 현장 결제만·포장/배달 주문 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5279' }),
  mb('skt-madforgarlic', ['madforgarlic'], '매드포갈릭 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'매드포갈릭 15% 할인',gold:'매드포갈릭 15% 할인'}, dailyCount:1, dailyCap:5000, dailyCapByGrade:{vip:15000,gold:15000}, txnAmountCap:100000, channel:'offline', conditionNote:'매장·포장 주문 적용, 배달 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5461' }),
  mb('skt-ontheborder', ['ontheborder'], '온더보더 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.15}, labelByGrade:{vip:'온더보더 15% 할인'}, dailyCount:1, dailyCap:5000, dailyCapByGrade:{vip:15000}, txnAmountCap:100000, conditionNote:'주류·런치·세트 메뉴 제외·다른 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5525' }),
  mb('skt-lagrillia', ['lagrillia'], '라그릴리아 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.10,gold:.10}, labelByGrade:{vip:'라그릴리아 10% 할인',gold:'라그릴리아 10% 할인'}, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:20000,gold:20000}, channel:'offline', conditionNote:'주류·세트·행사 메뉴 제외·다른 쿠폰/제휴 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=124' }),
  mb('skt-saboten', ['saboten'], '사보텐 10% 할인', { membershipCategory:'외식', rate:.10, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'사보텐 15% 할인',gold:'사보텐 15% 할인'}, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:15000,gold:15000}, txnAmountCap:100000, alwaysDiscount:true, conditionNote:'상품권·도시락 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5778' }),
  mb('skt-crabhouse', ['crabhouse'], '크래버대게나라 5% 할인', { membershipCategory:'외식', rate:.05, rateByGrade:{vip:.08}, labelByGrade:{vip:'크래버대게나라 8% 할인'}, dailyCount:1, alwaysDiscount:true, conditionNote:'최소 주문금액·최대 할인금액 제한 없음', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5242' }),
  mb('skt-tacobell', ['tacobell'], '타코벨 10% 할인', { membershipCategory:'외식', rate:.10, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'타코벨 15% 할인',gold:'타코벨 15% 할인'}, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:15000,gold:15000}, txnAmountCap:100000, alwaysDiscount:true, conditionNote:'상품권 구매 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5780' }),
  mb('skt-salady', ['salady'], '샐러디 모든 메뉴 10% 할인', { membershipCategory:'외식', rate:.10, dailyCount:1, dailyCap:20000, alwaysDiscount:true, conditionNote:'T멤버십 앱 쿠폰 이용·일 1장 다운로드', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5246' }),
  mb('skt-hibarin', ['hibarin'], '히바린 10% 할인', { membershipCategory:'외식', rate:.10, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'히바린 15% 할인',gold:'히바린 15% 할인'}, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:15000,gold:15000}, txnAmountCap:100000, alwaysDiscount:true, conditionNote:'상품권·도시락 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5779' }),
  mb('skt-dowonstyle', ['dowonstyle'], '도원스타일 10% 할인', { membershipCategory:'외식', rate:.10, minAmount:30000, dailyCount:1, dailyCap:30000, alwaysDiscount:true, conditionNote:'다른 쿠폰·할인·상품권·프로모션 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5968' }),

  // 카페 12곳
  mb('skt-baskin', ['baskin'], '배스킨라빈스 싱글레귤러 1,200원 할인', { membershipCategory:'카페', flat:1200, flatByGrade:{vip:2000}, labelByGrade:{vip:'배스킨라빈스 싱글레귤러 2,000원 할인'}, requiresMembershipEligible:true, scopeLabel:'싱글레귤러', outsideScopeLabel:'그 외 배스킨라빈스 상품', eligibleTitle:'싱글레귤러를 구매해요', eligibleHelp:'다른 사이즈·제품은 이 상시 혜택의 대상이 아닙니다.', monthlyCount:1, conditionNote:'싱글레귤러 지정 상품·일부 매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=998' }),
  mb('skt-gongcha', ['gongcha'], '공차 10% 할인', { membershipCategory:'카페', rate:.10, dailyCount:1, dailyCap:20000, conditionNote:'제조 음료만·타 할인/쿠폰 중복 불가·일부 특수매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=771' }),
  mb('skt-paul', ['paulbassett'], '폴 바셋 시그니처 커피 4종 10% 할인', { membershipCategory:'카페', rate:.10, requiresMembershipEligible:true, scopeLabel:'시그니처 커피 4종', outsideScopeLabel:'그 외 폴 바셋 메뉴', eligibleTitle:'시그니처 커피 4종을 주문해요', eligibleHelp:'룽고·카페라떼·락토프리 카페라떼·카페 오트만 적용', dailyCount:1, dailyCap:20000, conditionNote:'시그니처 4종·딜리버리/네이버 주문 제외·다른 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=67' }),
  mb('skt-dunkin', ['dunkin'], '던킨 제조 커피·도넛 5% 할인', { membershipCategory:'카페', rate:.05, rateByGrade:{vip:.15,gold:.15}, labelByGrade:{vip:'던킨 제조 커피·도넛 15% 할인',gold:'던킨 제조 커피·도넛 15% 할인'}, requiresMembershipEligible:true, scopeLabel:'제조 커피·도넛', outsideScopeLabel:'그 외 던킨 상품', eligibleTitle:'제조 커피 또는 도넛을 주문해요', eligibleHelp:'베이글·디저트·병/캔/팩 음료·콤보/세트는 제외', dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:30000,gold:30000}, channel:'offline', conditionNote:'매장 주문만·다른 쿠폰/행사 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=992' }),
  mb('skt-mega', ['megacoffee'], '메가MGC커피 10% 할인', { membershipCategory:'카페', rate:.10, rateByGrade:{vip:.20}, labelByGrade:{vip:'메가MGC커피 20% 할인'}, txnAmountCap:10000, dailyCap:1000, dailyCapByGrade:{vip:2000}, monthlyCount:4, channel:'offline', excludesEvent:true, scopeLabel:'행사 메뉴를 제외한 전 메뉴', outsideScopeLabel:'행사 메뉴', discountExclusiveWithCard:true, conditionNote:'키오스크/카운터 주문·월 4회·하루 구매 1만원까지', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5393' }),
  mb('skt-angelinus', ['angelinus'], '엔제리너스 15% 할인', { membershipCategory:'카페', rate:.15, rateByGrade:{vip:.20,gold:.20}, labelByGrade:{vip:'엔제리너스 20% 할인',gold:'엔제리너스 20% 할인'}, dailyCount:1, dailyCap:30000, dailyCapByGrade:{vip:40000,gold:40000}, conditionNote:'대상 상품·일부 특수매장·중복 할인 조건 확인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=887' }),
  mb('skt-baekmidang', ['baekmidang'], '백미당 모든 상품 10% 할인', { membershipCategory:'카페', rate:.10, dailyCap:20000, monthlyCount:1, alwaysDiscount:true, conditionNote:'T멤버십 앱에서 월 1장 쿠폰 발급 후 매장 직원에게 제시', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5763' }),
  mb('skt-droptop', ['droptop'], '드롭탑 10% 할인', { membershipCategory:'카페', rate:.10, dailyCount:1, dailyCap:20000, conditionNote:'드롭탑 앱에 T멤버십 카드 번호 등록·타 할인/세트 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5051' }),
  mb('skt-artisee', ['artisee'], '아티제 아메리카노·카페라떼 10% 할인', { membershipCategory:'카페', rate:.10, requiresMembershipEligible:true, scopeLabel:'아메리카노·카페라떼 S/R', outsideScopeLabel:'그 외 아티제 상품', dailyCount:1, dailyCap:30000, channel:'offline', alwaysDiscount:true, conditionNote:'매장 주문만·배달/픽업 제외·일부 특수매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5614' }),
  mb('skt-pascucci', ['pascucci'], '파스쿠찌 10% 할인', { membershipCategory:'카페', rate:.10, dailyCount:1, dailyCap:20000, channel:'offline', conditionNote:'세트·브런치·할인 제품 제외·타 쿠폰/제휴 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5569' }),
  mb('skt-theventi', ['theventi'], '더벤티 10% 할인', { membershipCategory:'카페', rate:.10, dailyCount:1, dailyCap:10000, channel:'offline', conditionNote:'키오스크/카운터 주문만·앱 주문 및 일부 메뉴 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5408' }),
  mb('skt-misterhealing', ['misterhealing'], '미스터힐링 8% 할인', { membershipCategory:'카페', rate:.08, dailyCount:1, dailyCap:16000, conditionNote:'타 쿠폰·행사·제휴카드 중복 불가·일부 매장 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=1093' }),

  // 패스트푸드(공식 분류: 피자/치킨) 8곳
  mb('skt-domino', ['domino'], '도미노피자 20% 할인', { membershipCategory:'패스트푸드', rate:.20, rateByGrade:{vip:.30}, labelByGrade:{vip:'도미노피자 30% 할인'}, dailyCount:1, dailyCap:40000, dailyCapByGrade:{vip:60000}, conditionNote:'도미노피자 웹·앱 주문·세트·특가제품 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=14' }),
  mb('skt-pizzahut', ['pizzahut'], '피자헛 20% 할인', { membershipCategory:'패스트푸드', rate:.20, rateByGrade:{vip:.30}, labelByGrade:{vip:'피자헛 30% 할인'}, dailyCount:1, dailyCap:40000, dailyCapByGrade:{vip:60000}, conditionNote:'주문 채널·제외 메뉴 조건 확인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=888' }),
  mb('skt-papajohns', ['papajohns'], '파파존스피자 15% 할인', { membershipCategory:'패스트푸드', rate:.15, rateByGrade:{vip:.30}, labelByGrade:{vip:'파파존스피자 30% 할인'}, dailyCount:1, dailyCap:30000, dailyCapByGrade:{vip:60000}, conditionNote:'온라인·오프라인 주문 조건과 제외 메뉴 확인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=329' }),
  mb('skt-bhc', ['bhc'], 'bhc 4,000원 할인', { membershipCategory:'패스트푸드', flat:4000, minAmount:20000, monthlyCount:2, alwaysDiscount:true, conditionNote:'T멤버십 앱 쿠폰을 bhc 앱에 등록·배달비 제외 치킨 메뉴 포함 2만원 이상', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5814' }),
  mb('skt-mexicana', ['mexicana'], '멕시카나 3,000원 할인', { membershipCategory:'패스트푸드', flat:3000, monthlyCount:2, alwaysDiscount:true, conditionNote:'T멤버십 앱에서 쿠폰 발급 후 멕시카나 앱 주문·쿠폰 2장 동시 사용 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5216' }),
  mb('skt-misterpizza', ['misterpizza'], '미스터피자 15% 할인', { membershipCategory:'패스트푸드', rate:.15, rateByGrade:{vip:.25}, labelByGrade:{vip:'미스터피자 25% 할인'}, dailyCount:1, dailyCap:40000, dailyCapByGrade:{vip:60000}, conditionNote:'미스터피자 앱 또는 매장 주문·온라인/오프라인 조건 확인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5497' }),
  mb('skt-banolim', ['banolimpizza'], '반올림피자 20% 할인', { membershipCategory:'패스트푸드', rate:.20, dailyCount:1, dailyCap:30000, txnAmountCap:150000, conditionNote:'반올림피자 웹·앱 주문·세트·사이드·배달비 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5543' }),
  mb('skt-pizzaalvolo', ['pizzaalvolo'], '피자알볼로 배달 15%·포장 20% 할인', { membershipCategory:'패스트푸드', rate:.20, minAmount:20000, dailyCount:1, dailyCap:100000, dailyCapByGrade:{vip:150000}, isMaximum:true, conditionNote:'피자알볼로 앱 주문·배달 15%·포장 20%·세트·행사상품·배달료 제외', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5818' }),

  // 편의점 3곳
  mb('skt-cu', ['cu'], 'CU 1천원당 50원 할인', { membershipCategory:'편의점', unitBase:1000, unitValue:50, unitValueByGrade:{vip:100,gold:100}, labelByGrade:{vip:'CU 1천원당 100원 할인',gold:'CU 1천원당 100원 할인'}, minAmount:1000, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:20000,gold:20000}, conditionNote:'담배·주류 등 제외 · 카드 혜택과의 중복 여부는 카드별 약관에 따름', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=146' }),
  mb('skt-seven', ['seveneleven'], '세븐일레븐 1천원당 50원 할인', { membershipCategory:'편의점', unitBase:1000, unitValue:50, unitValueByGrade:{vip:100,gold:100}, labelByGrade:{vip:'세븐일레븐 1천원당 100원 할인',gold:'세븐일레븐 1천원당 100원 할인'}, minAmount:1000, dailyCount:1, dailyCap:10000, dailyCapByGrade:{vip:20000,gold:20000}, scopeLabel:'T멤버십 할인 대상 상품·매장', outsideScopeLabel:'그 외 상품·매장', conditionNote:'대상 상품·매장 및 제외 품목 확인', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=924' }),
  mb('skt-gs25', ['gs25'], 'GS25 화요일 프레시푸드 1천원당 200원 할인', { membershipCategory:'편의점', unitBase:1000, unitValue:200, minAmount:1000, weekday:2, dailyCount:1, dailyCap:20000, txnAmountCap:100000, scopeLabel:'화요일 프레시푸드', outsideScopeLabel:'화요일 프레시푸드 외 결제', alwaysDiscount:true, exclusiveWithCard:true, conditionNote:'매주 화요일·프레시푸드 대상·행사상품 제외·다른 쿠폰·혜택 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5321' }),

  // 공식 쇼핑 제휴처 중 앱에서 다룰 대형마트 1곳
  mb('skt-emart', ['emart'], '이마트 3% 할인', { membershipCategory:'대형마트', rate:.03, dynamicRateByGrade:{vip:() => (today.getMonth() + 1) % 2 === 0 ? .07 : .03}, dynamicRateLabelByGrade:{vip:'짝수월 7%·홀수월 3%'}, labelByGrade:{vip:'이마트 짝수월 7%·홀수월 3% 할인'}, txnAmountCap:100000, scopeLabel:'T멤버십 앱 이마트 금액권 구매', outsideScopeLabel:'이마트 매장 일반 결제', exclusiveWithCard:true, conditionNote:'T멤버십 앱 금액권 구매·1일 구매한도 10만원·GOLD/SILVER 연 300만원·매장 일반 결제 제외', conditionNoteByGrade:{vip:'T멤버십 앱 금액권 구매·1일 구매한도 10만원·짝수월 월 10만원·홀수월 연 200만원·매장 일반 결제 제외'}, sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=72' }),

  // 공식 영화/공연/전시 제휴처 중 앱에서 다룰 영화관 2곳
  mb('skt-cgv', ['cgv'], 'CGV 영화관람권 최대 4,000원 할인', { membershipCategory:'영화', formula:'movie', minAmount:11000, dailyCount:1, scopeLabel:'T멤버십 앱 2D 일반영화 예매', outsideScopeLabel:'그 외 CGV 결제', discountExclusiveWithCard:true, alwaysDiscount:true, conditionNote:'T멤버십 앱 무비 예매·1회 최대 5석·타 할인 중복 불가', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=973' }),
  mb('skt-megabox', ['megabox'], '메가박스 영화관람권 최대 4,000원 할인', { membershipCategory:'영화', formula:'movie', minAmount:11000, dailyCount:1, scopeLabel:'T멤버십 앱 영화 예매', outsideScopeLabel:'그 외 메가박스 결제', alwaysDiscount:true, conditionNote:'T멤버십 앱 예매·1일 1회·1회 최대 5석', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=968' }),

  // 공식 테마파크 제휴처 중 앱에서 다룰 놀이공원 4곳
  mb('skt-everland', ['everland'], '에버랜드 본인 40%·동반 3인 30% 할인', { membershipCategory:'놀이공원', rate:.40, dailyCount:1, alwaysDiscount:true, exclusiveWithCard:true, conditionNote:'종일권 본인 1인 40%·동반 최대 3인 30%·T멤버십 앱 쿠폰 스마트 예약', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5244' }),
  mb('skt-seoulland', ['seoulland'], '서울랜드 본인 40%·동반 1인 30% 할인', { membershipCategory:'놀이공원', rate:.40, dailyCount:1, exclusiveWithCard:true, conditionNote:'파크이용권 본인 40%·동반 1인 30%·최대 2매', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=311' }),
  mb('skt-lotteworld', ['lotteworld'], '롯데월드 본인 40%·동반 3인 20% 할인', { membershipCategory:'놀이공원', rate:.40, labelByGrade:{vip:'롯데월드 본인 40%·동반 3인 30% 할인',gold:'롯데월드 본인 40%·동반 3인 30% 할인'}, dailyCount:1, alwaysDiscount:true, exclusiveWithCard:true, conditionNote:'종합이용권 본인 40%·동반 최대 3인 20%·온라인 예매 또는 현장 할인', conditionNoteByGrade:{vip:'종합이용권 본인 40%·동반 최대 3인 30%·온라인 예매 또는 현장 할인',gold:'종합이용권 본인 40%·동반 최대 3인 30%·온라인 예매 또는 현장 할인'}, sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=996' }),
  mb('skt-caribbean', ['caribbean'], '캐리비안베이 본인 40%·동반 3인 30% 할인', { membershipCategory:'놀이공원', rate:.40, dailyCount:1, alwaysDiscount:true, exclusiveWithCard:true, conditionNote:'종일권 본인 1인 40%·동반 최대 3인 30%·T멤버십 앱 쿠폰 스마트 예약', sourceUrl:'https://sktmembership.tworld.co.kr/mps/pc-bff/benefitbrand/detail.do?brandId=5225' })
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

function defaultBenefitType(id) {
  if (id.startsWith('nori-') || id.startsWith('hana-') || id.startsWith('kbank-') || id.startsWith('simple-')) return '캐시백';
  return '할인';
}

function b(id, merchants, label, options={}) { return { id, merchants, label, reward:'discount', benefitType:defaultBenefitType(id), ...options }; }
function mb(id, merchants, label, options={}) { return { id, merchants, label, reward:'discount', provider:'skt', ...options }; }

const initialState = { period, spends:{}, usage:{}, counts:{}, dailyUsage:{}, dailyCounts:{}, carrier:'skt', membershipGrade:'silver', ownedCards:cards.map(card => card.id), favorites:[] };
let state = loadState();
let lastResults = [];
let cardPickerQuery = '';
let cardSearchSubmitted = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('card-advisor-state-v1'));
    if (!saved) return structuredClone(initialState);
    const savedState = { ...saved };
    delete savedState.membershipMode;
    const profile = {
      carrier: saved.carrier === 'none' ? 'none' : 'skt',
      membershipGrade: ['vip','gold','silver','none'].includes(saved.membershipGrade) ? saved.membershipGrade : 'silver',
      ownedCards: Array.isArray(saved.ownedCards)
        ? [...new Set(saved.ownedCards)].filter(cardId => cards.some(card => card.id === cardId))
        : cards.filter(card => saved.cardEnabled?.[card.id] !== false).map(card => card.id),
      favorites: Array.isArray(saved.favorites) ? saved.favorites.map(key => {
        if (typeof key !== 'string' || !key.startsWith('category:')) return key;
        const category = key.slice('category:'.length);
        return `category:${categoryAliases[category] || category}`;
      }) : []
    };
    if (saved.period !== period) return { ...structuredClone(initialState), ...profile, spends:saved.spends || {} };
    return { ...structuredClone(initialState), ...savedState, ...profile };
  } catch { return structuredClone(initialState); }
}
function saveState() { localStorage.setItem('card-advisor-state-v1', JSON.stringify(state)); }
function tierValue(tiers, spend) { return [...tiers].reverse().find(([min]) => spend >= min)?.[1] || 0; }
function usage(id) { return state.usage[id] || 0; }
function count(id) { return state.counts[id] || 0; }
function benefitCount(benefit) { return count(benefit.countGroup || benefit.id); }
function dailyUsage(id) { return state.dailyUsage[`${dayKey}:${id}`] || 0; }
function dailyCount(id) { return state.dailyCounts[`${dayKey}:${id}`] || 0; }
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
      dynamicRate:benefit.dynamicRateByGrade?.[grade] || benefit.dynamicRate,
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
  if (benefit.dynamicRate) return benefit.dynamicRateLabel || '0.2~0.4%';
  if (benefit.rate) return `${benefit.rate * 100}%`;
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
  return benefit.flat ? Math.min(benefit.flat, amount) : Math.floor(baseAmount * (rate || 0));
}

function assessMembershipBenefit(benefit, input) {
  const reasons = [];
  if (!matches(benefit, input.merchant)) return null;
  if (benefit.requiresMembershipEligible && !input.membershipEligible) reasons.push(benefit.eligibleTitle || 'T멤버십 대상 상품 확인 필요');
  if (benefit.minAmount && input.amount < benefit.minAmount) reasons.push(`최소 결제금액 ${won.format(benefit.minAmount)}원 이상 필요`);
  if (benefit.channel && input.channel !== benefit.channel) reasons.push(`${benefit.channel === 'online' ? '온라인' : '오프라인'} 이용만 적용`);
  if (benefit.excludesEvent && input.eventItem) reasons.push('행사상품은 멤버십 할인 제외');
  if (benefit.monthlyCount && benefitCount(benefit) >= benefit.monthlyCount) reasons.push('이번 달 이용 횟수 소진');
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
  const hasCardBenefit = cards.some(card => isCardEnabled(card.id) && card.benefits.some(benefit =>
    benefit.merchants.includes(merchantId) || (merchantId === 'other' && benefit.merchants.includes('*'))
  ));
  const hasMembershipBenefit = activeMembershipBenefits().some(benefit => benefit.merchants.includes(merchantId));
  return hasCardBenefit || hasMembershipBenefit;
}

function merchantAvailableForSelection(merchant) {
  return merchantAllowedByProfile(merchant.id) && merchantHasRegisteredBenefit(merchant.id);
}

function matches(benefit, merchantId) { return benefit.merchants.includes('*') || benefit.merchants.includes(merchantId); }

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
  if (benefit.monthlyCount && benefitCount(benefit) >= benefit.monthlyCount) reasons.push('이번 달 이용 횟수 소진');
  if (benefit.dailyCount && dailyCount(benefit.id) >= benefit.dailyCount) reasons.push('오늘 이용 횟수 소진');
  if (benefit.specialCount && !benefit.specialCount.includes(benefitCount(benefit) + 1)) reasons.push(`${benefit.specialCount.join('·')}번째 이용에 적용`);
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
    const groupCap = tierValue(tiers, calculationSpend);
    if (groupCap > 0 || !benefit.allowBelowGroup) value = Math.min(value, Math.max(0, groupCap - usage(`${card.id}:group:${benefit.group}`)));
  }
  if (value <= 0) reasons.push('이번 달 한도 소진');
  return { benefit, tier, value, reasons };
}

function calculate(input) {
  const automaticPayment = !input.payment || input.payment === 'auto';
  return cards.filter(card => isCardEnabled(card.id) && (automaticPayment || (input.payment === 'samsungmoney' ? card.id === 'samsungmoney' : card.id !== 'samsungmoney'))).map(card => {
    let items = card.benefits.map(benefit => assessBenefit(card, benefit, input)).filter(Boolean);
    const positive = items.filter(x => x.value > 0);
    const replacements = new Set(items.filter(x => x.value > 0 || x.benefit.blocksFallback).map(x => x.benefit.replaces).filter(Boolean));
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
    const replacements = new Set(items.filter(item => item.value > 0 || item.benefit.blocksFallback).map(item => item.benefit.replaces).filter(Boolean));
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

function paymentLabel(id) { return ({card:'일반 카드',kbpay:'KB Pay',kakaopay:'카카오페이',samsungmoney:'삼성월렛 머니',autopay:'자동이체'})[id] || id; }
function channelForMerchant(merchantId) {
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

function membershipResultHtml(assessment, bestCard, stacksWithMembership) {
  if (!assessment) return '';
  const { benefit, value, reasons } = assessment;
  const rewardUnit = '원';
  const comparison = value > 0 && bestCard?.value > 0
    ? value > bestCard.value ? '이 결제에서는 멤버십 혜택이 카드 단독 혜택보다 큽니다.' : '아래 카드 단독 혜택도 함께 비교하세요.'
    : '';
  const stacking = stacksWithMembership
    ? '이 카드 혜택과의 중복 적용이 확인됐습니다.'
    : '중복 가능 여부가 확인된 카드 조합만 합산 추천합니다.';
  const detail = value > 0
    ? `${won.format(value)}${rewardUnit} 예상 · ${benefit.conditionNote ? `${benefit.conditionNote} · ` : ''}${stacking}`
    : `${reasons.join(' · ')}${benefit.conditionNote ? ` · ${benefit.conditionNote}` : ''} · 공식 조건을 확인하세요.`;
  return `<aside class="membership-callout${value > bestCard?.value ? ' is-best' : ''}"><div><span class="membership-kicker">SKT · ${membershipGradeLabels[state.membershipGrade]}</span><h3>${escapeHtml(membershipLabel(benefit))}</h3><p>${escapeHtml(detail)}${comparison ? ` ${escapeHtml(comparison)}` : ''}</p></div><div class="membership-actions">${value > 0 ? '<button class="button button-membership" id="confirmMembership" type="button">T멤버십 사용했어요</button>' : ''}<a href="${benefit.sourceUrl || membershipSourceUrl}" target="_blank" rel="noreferrer">공식 조건 ↗</a></div></aside>`;
}

function amountConditionText(benefit) {
  const conditions = [];
  if (benefit.rateTiers) {
    benefit.rateTiers.forEach(tier => {
      const range = tier.minAmount ? `${won.format(tier.minAmount)}원 이상` : `${won.format(tier.maxAmountExclusive)}원 미만`;
      conditions.push(`${range} ${Math.round(tier.rate * 100)}%`);
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
  return cards.flatMap(card => {
    if (!isCardEnabled(card.id) || card.id === selectedCardId) return [];
    return card.benefits.flatMap(benefit => {
      if (benefit.unsupported || benefit.requiresMilitary || !benefit.merchants.includes(input.merchant) || (benefit.channel && benefit.channel !== input.channel)) return [];
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
  return calculate(input).map(result => {
    const items = result.items.filter(item => item.benefit.merchants.includes(input.merchant));
    return { ...result, items, eligible:items.filter(item => item.value > 0), value:items.reduce((sum, item) => sum + item.value, 0) };
  }).filter(result => result.items.length).sort((a,b) => b.value - a.value || a.card.name.localeCompare(b.card.name, 'ko'));
}

function categorySampleAmount(category) {
  return categorySampleAmounts[category] || 10000;
}

function categoryPotential(merchant, category) {
  const sampleInput = { merchant:merchant.id, amount:categorySampleAmount(category), payment:'auto', channel:channelForMerchant(merchant.id), eventItem:false, membershipEligible:false };
  const cardPotentials = cards.flatMap(card => card.benefits
    .filter(benefit => isCardEnabled(card.id) && !benefit.requiresMilitary && benefit.merchants.includes(merchant.id) && (!benefit.channel || benefit.channel === sampleInput.channel))
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
      .filter(benefit => benefit.merchants.includes(input.merchant) && (!benefit.channel || benefit.channel === input.channel))
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
  if (benefit.conditionNote) conditions.push(benefit.conditionNote);
  return conditions;
}

function strategyScore(benefit, input) {
  const sample = input.amount || categorySampleAmount(input.category || merchants.find(item => item.id === input.merchant)?.category);
  return nominalBenefitValue(benefit, sample) || benefitRate(benefit, sample) * sample || benefit.flat || benefit.unitValue || 0;
}

function merchantStrategies(input, merchant) {
  const merchantInput = { ...input, merchant:merchant.id, channel:channelForMerchant(merchant.id) };
  const cardStrategies = cards.flatMap(card => card.benefits
    .filter(benefit => isCardEnabled(card.id) && benefit.merchants.includes(merchant.id))
    .map(benefit => {
      const strategyInput = { ...merchantInput, eventItem:!!benefit.requiresEvent, membershipEligible:!!benefit.requiresMembershipEligible };
      const assessment = merchantInput.amount ? assessBenefit(card, benefit, strategyInput, { ignorePerformance:true, ignorePersonal:true }) : null;
      const performanceMet = !benefit.minSpend || (state.spends[card.id] || 0) >= benefit.minSpend;
      const personalMet = !benefit.requiresMilitary;
      const active = performanceMet && personalMet;
      return { key:`card:${card.id}:${benefit.id}`, merchant, card, benefit, assessment, active, value:assessment?.value || 0, score:strategyScore(benefit, merchantInput), conditions:strategyConditions(card, benefit, merchantInput), scenarioLabel:benefit.scopeLabel ? `${benefit.scopeLabel}인 경우` : '' };
    })
  );
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
  const now = rank(strategies.filter(strategy => strategy.active))[0];
  const later = rank(strategies.filter(strategy => !strategy.active))[0];
  const fallbackNow = rank(strategies.filter(strategy => strategy.active && strategy.fallbackScenario))[0];
  const fallbackLater = rank(strategies.filter(strategy => !strategy.active && strategy.fallbackScenario))[0];
  return [...new Map([now, later, fallbackNow, fallbackLater].filter(Boolean).map(strategy => [strategy.key, strategy])).values()];
}

function groupedStrategies(input) {
  const targets = input.category ? merchants.filter(merchant => merchant.category === input.category && merchantAvailableForSelection(merchant)) : [merchants.find(merchant => merchant.id === input.merchant)].filter(Boolean);
  const strategies = targets.flatMap(merchant => merchantStrategies(input, merchant));
  const selected = targets.flatMap(merchant => selectMerchantStrategies(strategies.filter(strategy => strategy.merchant.id === merchant.id), input));
  if (!input.category) return selected;
  const merged = new Map();
  selected.forEach(strategy => {
    const groupKey = `${strategy.active}:${strategy.key}:${strategy.scenarioLabel || ''}`;
    const group = merged.get(groupKey) || { ...strategy, merchants:[] };
    group.merchants.push(strategy.merchant);
    merged.set(groupKey, group);
  });
  return [...merged.values()];
}

function strategyTitle(strategy) {
  return strategy.card.name;
}

function strategyBenefitText(strategy) {
  const cardText = strategy.membershipBenefit ? membershipLabel(strategy.membershipBenefit) : cardBenefitDisplayText(strategy.benefit);
  return cardText;
}

function strategyValueText(strategy, input) {
  if (!input.amount) {
    if (strategy.combination) {
      return `${benefitValueLabel(strategy.membership.membershipBenefit)} + ${benefitValueLabel(strategy.benefit)}`;
    }
    return benefitValueLabel(strategy.benefit);
  }
  const cannotCalculate = strategy.benefit.unsupported;
  if (cannotCalculate) return strategy.benefit.resultText || '자동 계산 불가';
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
    const targetAndScenario = strategy.scenarioLabel ? `${target} · ${strategy.scenarioLabel}` : target;
    const value = strategyValueText(strategy, input);
    const conditions = [...new Set(strategy.conditions)].join(' · ') || '별도 이용 조건 없음';
    const isMembershipOnly = strategy.card.id === membershipProvider.id;
    const detailAttribute = isMembershipOnly ? 'data-result-membership-detail' : `data-result-card-detail="${escapeHtml(strategy.card.id)}"`;
    const detailLabel = isMembershipOnly ? `${strategy.card.name} 혜택 보기` : `${strategy.card.name} 전체 혜택 보기`;
    const cardTitle = `<button class="strategy-detail-link" type="button" ${detailAttribute} aria-label="${escapeHtml(detailLabel)}"><span>${escapeHtml(strategyTitle(strategy))}</span><span aria-hidden="true">↗</span></button>`;
    const membershipAddon = strategy.combination ? `<button class="membership-addon" type="button" data-result-membership-detail aria-label="T멤버십 전체 혜택 보기"><span>+ T멤버십</span>${escapeHtml(membershipLabel(strategy.membership.membershipBenefit))}<span class="detail-arrow" aria-hidden="true">↗</span></button>` : '';
    const valueBreakdown = strategy.combination && input.amount && !strategy.benefit.unsupported
      ? `<p class="strategy-breakdown">카드 ${won.format(strategy.assessment?.value || 0)}원 + T멤버십 ${won.format(strategy.membership.assessment?.value || 0)}원</p>`
      : '';
    const totalLabel = strategy.combination ? '<span class="strategy-total-label">총 혜택</span>' : '';
    return `<article class="strategy-row${strategy.combination ? ' is-combination' : ''}"><div class="strategy-main"><span class="strategy-target">${escapeHtml(targetAndScenario)}</span><h3>${cardTitle}</h3><p>${escapeHtml(strategyBenefitText(strategy))}</p>${membershipAddon}${valueBreakdown}</div><strong>${totalLabel}${escapeHtml(value)}</strong><small class="strategy-conditions">${escapeHtml(conditions)}</small></article>`;
  };
  const section = (title, note, items, empty, type) => `<section class="strategy-section strategy-section-${type}"><div class="strategy-section-heading"><span class="strategy-section-state">${type === 'current' ? '현재 적용' : '현재 적용 불가'}</span><div><h3>${title}</h3><p>${note}</p></div></div>${items.length ? items.map(row).join('') : `<p class="strategy-empty">${empty}</p>`}</section>`;
  const targetName = input.category || merchants.find(merchant => merchant.id === input.merchant)?.label || '구매처';
  container.innerHTML = `<div class="recommendation strategy-results"><span class="best-label">${escapeHtml(targetName)} · ${input.amount ? `${won.format(input.amount)}원` : '금액 미정'}</span>${section('지금 받을 수 있는 혜택', '현재 전월 실적으로 바로 적용돼요.', now, '현재 설정에서 바로 적용되는 혜택이 없어요.', 'current')} ${section('전월 실적을 채우면 받을 수 있어요', '아래 혜택은 아직 결제에 적용되지 않아요.', later, '추가로 충족할 전월 실적 조건이 없어요.', 'later')}</div>`;
  container.querySelectorAll('[data-result-card-detail]').forEach(button => button.addEventListener('click', () => openCardDetail(button.dataset.resultCardDetail)));
  container.querySelectorAll('[data-result-membership-detail]').forEach(button => button.addEventListener('click', openMembershipDetail));
}

function renderResults(input) {
  lastResults = [];
  renderUnifiedResults(input);
  updateFavoriteToggle();
}

function openCardDetail(cardId) {
  const card = cards.find(item => item.id === cardId);
  if (!card) return;
  document.querySelector('#cardDetailTitle').textContent = card.name;
  document.querySelector('#cardDetailMeta').textContent = `${card.issuer} · ${card.kind}`;

  const groupEntries = Object.entries(card.groups || {});
  const groupHtml = groupEntries.length ? `<section class="rule-section"><h3>통합 한도</h3>${groupEntries.map(([groupId, tiers]) => `${card.groupLabels?.[groupId] ? `<h4>${escapeHtml(card.groupLabels[groupId])}</h4>` : ''}<table class="tier-table"><thead><tr><th>전월 실적</th><th>월 통합 한도</th></tr></thead><tbody>${tiers.map(([spend, cap]) => `<tr><td>${won.format(spend)}원 이상</td><td>${won.format(cap)}원</td></tr>`).join('')}</tbody></table>`).join('')}</section>` : '';
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
    const fixedAmountLabel = benefit.flat ? ` (${won.format(benefit.flat * benefit.monthlyCount)}원)` : '';
    tags.push(`월 ${benefit.monthlyCount}회${fixedAmountLabel}${benefit.group ? ' (통합한도 적용)' : ''}`);
    if (benefit.monthlyCap && !monthlyCapIsDerivedFromCount) tags.push(`월 한도 ${won.format(benefit.monthlyCap)}원 (${benefit.group ? '통합한도 적용' : '통합한도 미적용'})`);
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
  if (benefit.unlimited) tags.push(`기본 ${benefit.reward === 'point' ? '적립' : '캐시백'} 한도 없음`);
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
  if (!list.querySelector('[data-owned-card]')) list.innerHTML = '<p class="status-empty">보유 카드가 없어요. 위의 카드 추가 버튼에서 카드를 선택해 주세요.</p>';
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
  document.querySelector('#carrier').value = state.carrier || 'unset';
  document.querySelector('#membershipGrade').value = state.membershipGrade || 'silver';
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
  });
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
      : groups['카페'] ? '카페' : categories[0] || '';
  categorySelect.innerHTML = categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  categorySelect.value = selectedCategory;
  const categoryMerchants = groups[selectedCategory] || [];
  merchantSelect.innerHTML = `<option value="">${escapeHtml(selectedCategory)} 전체</option>${categoryMerchants.map(merchant => `<option value="${merchant.id}">${escapeHtml(merchant.label)}</option>`).join('')}`;
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
  const active = state.favorites.includes(currentFavoriteKey());
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
  document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#amount').value = button.dataset.amount === 'unknown' ? '' : won.format(Number(button.dataset.amount));
    renderResults(inputValues());
  }));
  document.querySelector('#recommendForm').addEventListener('submit', e => { e.preventDefault(); renderResults(inputValues()); });
  document.querySelectorAll('#recommendForm input').forEach(el => el.addEventListener('change', () => { updateConditional(); renderResults(inputValues()); }));
  document.querySelector('#merchantCategory').addEventListener('change', () => { renderMerchantOptions(); renderResults(inputValues()); });
  document.querySelector('#merchant').addEventListener('change', () => { updateConditional(); renderResults(inputValues()); });
  document.querySelector('#openStatus').addEventListener('click', () => { renderStatusForm(); const dialog = document.querySelector('#statusDialog'); dialog.showModal(); dialog.querySelector('.dialog-card').scrollTop = 0; });
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
  document.querySelector('#resetUsage').addEventListener('click', () => { state.usage={}; state.counts={}; state.dailyUsage={}; state.dailyCounts={}; saveState(); showToast('이번 달 혜택 기록을 초기화했어요.'); renderResults(inputValues()); });
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
        updateConditional();
        const values=inputValues(); renderResults(values); const best=lastResults[0];
        return { card:best?.card.name || null, paymentMethod:best ? recommendedPayment(best) : null, estimatedBenefit:best?.value || 0, benefitUnit:best?.eligible.every(x=>x.benefit.reward==='point')?'point':'won' };
      }
    });
  } catch (error) { console.warn('WebMCP registration unavailable', error); }
}

setup();
