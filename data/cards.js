// 카드 혜택 데이터
// 날짜별 변동 규칙은 함수가 아니라 rateSchedule 같은 선언형 값으로 기록합니다.
// 상세 표시 원칙: 지정 브랜드 혜택은 브랜드를 모두 나열합니다. 일반 업종만으로 구성된 혜택은
// 같은 공식 영역·혜택률·이용 조건일 때 합치고, 계산 조건이 다른 항목은 숨김 계산 항목으로 분리합니다.

function defaultBenefitType(id) {
  if (id.startsWith('nori-') || id.startsWith('hana-') || id.startsWith('kbank-') || id.startsWith('simple-')) return '캐시백';
  return '할인';
}

function b(id, merchants, label, options={}) { return { id, merchants, label, reward:'discount', benefitType:defaultBenefitType(id), ...options }; }

const cards = [
  {
    id: 'nori', issuer: 'KB국민카드', name: '노리2 체크카드(KB Pay)', kind: '캐시백형', rewardMedium: '결제계좌',
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
    id: 'coupang-wow-card', issuer: 'KB국민카드', name: '쿠팡 와우 카드', kind: '적립형', rewardMedium: '쿠팡캐시',
    source: 'KB국민카드 공식 안내 · 카드고릴라 2609 · 2026년 10월 프로모션', groups:{}, benefits:[
      b('coupang-wow-core', ['coupang','coupangeats','coupangplay'], '쿠팡·쿠팡이츠·쿠팡플레이 2%', {
        rate:.02, reward:'point', monthlyCap:20000,
        promotion:{ through:'2026-10-31', rate:.04, monthlyCap:40000, tag:'2026년 10월 31일까지 기본 2% + 추가 2%' },
        displayMerchants:['쿠팡','쿠팡이츠','쿠팡플레이'],
        conditionNote:'쿠팡플레이는 플레이스토어·앱스토어 결제 제외'
      }),
      b('coupang-wow-convenience', ['cu','gs25','seveneleven','emart24'], 'CU·GS25·세븐일레븐·이마트24 0.2%', {
        rate:.002, reward:'point', monthlyCap:2000, channel:'offline', replaces:'coupang-wow-general',
        promotion:{ through:'2026-10-31', rate:.024, monthlyCap:24000, tag:'2026년 10월 31일까지 기본 0.2% + 추가 2.2%' },
        conditionNote:'오프라인 매장만 · 카드 직접 결제·KB Pay·삼성페이 적용 · 다른 간편결제와 편의점 택배·앱 결제 제외 · 편의점·그 외 가맹점 프로모션 합산 월 이용금액 1,000,000원까지'
      }),
      b('coupang-wow-general', ['*'], '쿠팡 외 국내·외 가맹점 0.2%', {
        rate:.002, reward:'point', monthlyCap:2000, fallback:true,
        excludesMerchants:['coupang','coupangeats','coupangplay'],
        promotion:{ through:'2026-10-31', rate:.012, monthlyCap:12000, tag:'2026년 10월 31일까지 기본 0.2% + 추가 1%' },
        displayMerchants:['쿠팡 외 국내·외 가맹점'],
        conditionNote:'편의점·그 외 가맹점 프로모션 합산 월 이용금액 1,000,000원까지'
      })
    ], note:'카드 발급에는 쿠팡 와우 멤버십 가입이 필요합니다. 기간 한정 프로모션은 종료일 이후 기본 적립률로 자동 계산됩니다.'
  },
  {
    id: 'gaon-biz', issuer: 'KB국민카드', name: '가온 Biz카드', kind: '적립형', rewardMedium: '포인트리',
    source: 'KB국민카드 공식 안내 · 카드고릴라 1294',
    groups:{ gaonExtra:[[500000,50000]] }, groupLabels:{ gaonExtra:'사업지원영역·고액결제 통합 적립 한도' }, benefits:[
      b('gaon-domestic', ['*'], '국내 가맹점 0.3%', {
        rate:.003, reward:'point', minSpend:500000, minAmount:10000, unlimited:true, fallback:true, domesticOnly:true
      }),
      b('gaon-overseas', ['overseas'], '해외 이용금액 2%', {
        rate:.02, reward:'point', minSpend:500000, minAmount:10000, monthlyCap:10000,
        conditionNote:'해외직구 포함 · 해외 이용은 추가적립 미적용'
      }),
      b('gaon-business', ['gs-caltex','skenergy','s-oil','hyundaioilbank','gas','skt','kt','lgu','liivm','mvno','other-online'], '주유·통신·전자상거래 0.9%', {
        rate:.009, baseRate:.003, additionalRate:.006, additionalMonthlyCap:50000,
        reward:'point', minSpend:500000, minAmount:10000, group:'gaonExtra',
        merchantCategories:['온라인쇼핑'], replaces:'gaon-domestic',
        displayMerchants:['주유','통신','전자상거래'],
        conditionNote:'기본 0.3% + 사업지원영역 추가 0.6% · KB국민카드 업종 분류 기준'
      }),
      b('gaon-large', ['*'], '국내 고액결제 0.9~1.3%', {
        reward:'point', minSpend:500000, additionalMonthlyCap:50000, group:'gaonExtra', domesticOnly:true, showAtSpecific:true,
        rateTiers:[
          { id:'500k-to-1m', minAmount:500000, maxAmountExclusive:1000000, rate:.009, baseRate:.003, additionalRate:.006 },
          { id:'1m-or-more', minAmount:1000000, rate:.013, baseRate:.003, additionalRate:.01 }
        ],
        replaces:['gaon-domestic','gaon-business'],
        displayMerchants:['국내 고액결제'],
        conditionNote:'기본 0.3% 포함 최종 적립률 · 사업지원영역 추가적립과 중복되지 않고 고액결제 적립 우선'
      }),
      b('gaon-mybiz', [], '마이비즈 사업지원 서비스', {
        reward:'point', benefitType:null, unsupported:true,
        detailTitle:'마이비즈 · 사업지원 서비스',
        detailTags:['전자세금계산서 무료 발행','카드 이용내역의 과세정보·부가가치세액 자동 분류','부가세 신고용 전자파일 생성 지원','최종 세금신고와 환급 검토 책임은 본인에게 있음']
      })
    ], note:'사업지원영역 추가적립을 받은 이용금액은 다음 달 전월 실적에서 제외됩니다. 최초 사용등록일부터 다음 달 말일까지는 전월 실적이 없어도 기본 적립이 제공됩니다.'
  },
  {
    id: 'nh-flex', issuer: 'NH농협카드', name: '올바른 FLEX 카드', kind: '할인형', rewardMedium: '청구할인',
    source: 'NH농협카드 공식 안내 · 카드고릴라 666',
    groups:{
      nhFlexLife:[[300000,5000]],
      nhFlexTransport:[[300000,5000]],
      nhFlexShopping:[[300000,5000]]
    },
    groupLabels:{
      nhFlexLife:'구독·배달 통합 월 한도',
      nhFlexTransport:'교통·통신 통합 월 한도',
      nhFlexShopping:'온라인쇼핑·편의점 통합 월 한도'
    },
    combineGroupLimitTables:true,
    benefits:[
      b('nh-flex-starbucks', ['starbucks'], '스타벅스 50%', { rate:.50, minSpend:300000, txnCap:5000, monthlyCap:10000, dailyCount:1, monthlyCount:2, conditionNote:'사이렌오더 포함 · 상품권·선불카드 구입 및 충전 제외' }),
      b('nh-flex-streaming', ['youtube','netflix','melon'], '유튜브 프리미엄·넷플릭스·멜론 20%', { rate:.20, minSpend:300000, minAmount:7000, monthlyCount:1, group:'nhFlexLife', payment:'autopay', conditionNote:'각 서비스 월 1회 · 공식 홈페이지·앱에 등록한 정기결제만 적용 · 간편결제·인앱결제·일회성 결제 제외' }),
      b('nh-flex-delivery', ['baemin','yogiyo'], '배달의민족·요기요 10%', { rate:.10, minSpend:300000, minAmount:15000, dailyCount:1, group:'nhFlexLife', conditionNote:'공식 앱에서 카드로 결제한 건만 적용 · 간편결제·현장결제 제외' }),
      b('nh-flex-movie', ['cgv','lottecinema'], 'CGV·롯데시네마 30%', { rate:.30, minSpend:300000, minAmount:10000, monthlyCap:5000, conditionNote:'공식 홈페이지·앱 및 현장 결제만 적용 · 예매 대행·매점 결제 제외' }),
      b('nh-flex-transit', ['transit'], '버스·지하철 7%', { rate:.07, minSpend:300000, group:'nhFlexTransport', conditionNote:'후불교통 RF 이용만 적용 · 시외·고속버스 제외' }),
      b('nh-flex-telecom', ['skt','kt','lgu'], 'SKT·KT·LG U+ 7%', { rate:.07, minSpend:300000, monthlyCount:1, group:'nhFlexTransport', payment:'autopay', conditionNote:'통신 3사 통합 월 1회 · 알뜰폰 제외' }),
      b('nh-flex-online', ['coupang','gmarket','11st','tmon','nonghyupmall'], '쿠팡·G마켓·11번가·티몬·농협몰 5%', { rate:.05, minSpend:300000, minAmount:20000, dailyCount:1, group:'nhFlexShopping', channel:'online' }),
      b('nh-flex-store', ['cu','gs25'], 'CU·GS25 5%', { rate:.05, minSpend:300000, minAmount:5000, dailyCount:1, group:'nhFlexShopping', channel:'offline' }),
      b('nh-flex-pay', ['*'], 'NH pay 1,000원', { flat:1000, minSpend:300000, minAmount:20000, dailyCount:1, monthlyCount:2, monthlyCap:2000, payment:'nhpay', stack:true, domesticOnly:true, detailTitle:'NH pay · 1,000원', detailTags:['전월 실적 300,000원 이상','건당 20,000원 이상','일 1회','월 2회 (2,000원 · 통합한도 미적용)','국내 온·오프라인 NH pay 결제만 적용','다른 올바른 FLEX 카드 할인과 중복 적용 가능'] }),
      b('nh-flex-lounge', [], '공항 라운지 연 1회', { minSpend:300000, annualCount:1, benefitType:null, unsupported:true, detailTitle:'인천·김포·김해공항 라운지 · 무료 입장', detailTags:['전월 실적 300,000원 이상','본인 연 1회','카드 수령 등록일이 속한 달에는 제공되지 않음','대상 라운지는 NH농협카드 공식 안내 확인'] })
    ], note:'모든 할인 서비스는 전월 실적 300,000원 이상부터 제공되며, 할인받은 결제금액은 다음 달 전월 실적에서 제외됩니다.'
  },
  {
    id: 'woori-point', issuer: '우리카드', name: '카드의정석 POINT', kind: '적립형', rewardMedium: '모아포인트', source: '카드고릴라 84 · 우리카드 상품 안내',
    groups:{ wooriPoint:[[300000,10000],[600000,20000],[1200000,50000]] }, groupLabels:{ wooriPoint:'특별·간편결제 추가 적립 통합 한도' }, benefits:[
      b('woori-point-base', ['*'], '국내 가맹점 0.8%', { rate:.008, reward:'point', minAmount:10000, minSpend:300000, unlimited:true, fallback:true, domesticOnly:true, detailTitle:'국내 모든 가맹점 · 0.8%', detailTags:['전월 실적 300,000원 이상','건당 10,000원 이상','월 한도 없음 (통합한도 미적용)'] }),
      b('woori-point-telecom5', ['skt','kt','lgu','cjhello','ktm','uplusmvno'], 'SKT·KT·LG U+·CJ헬로모바일·KT M모바일·U+알뜰모바일 5%', { rate:.05, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:['woori-point-base','woori-point-pay-base'], conditionNote:'휴대전화 요금만 적용 · 인터넷·유선전화 등 결합상품 제외' }),
      b('woori-point-mobility5', ['transit','ev-ministry','ev-happy','ev-kepco','ev-chargingmate'], '대중교통·전기차 충전 5%', { rate:.05, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:['woori-point-base','woori-point-pay-base'], displayMerchants:['버스·지하철','환경부·한국전기차충전·한국전력·KT 차징메이트'] }),
      b('woori-point-cafe3', ['starbucks','angelinus','ediya'], '스타벅스·엔제리너스·이디야 3%', { rate:.03, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', conditionNote:'상품권·선불카드 구입·충전 및 백화점·대형마트 입점 매장 제외' }),
      b('woori-point-movie3', ['cgv','lottecinema'], 'CGV·롯데시네마 3%', { rate:.03, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', conditionNote:'예매 대행사이트 결제 제외' }),
      b('woori-point-department1', ['shinsegae-department','hyundai-department','lotte-department'], '신세계·현대·롯데백화점 1%', { rate:.01, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', conditionNote:'온라인 결제 제외' }),
      b('woori-point-mart1', ['emart','homeplus','lottemart','vicmarket','traders'], '이마트·홈플러스·롯데마트·VIC마켓·트레이더스 1%', { rate:.01, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', conditionNote:'온라인 결제 제외' }),
      b('woori-point-online1', ['11st','gmarket','auction','lotteon','coupang','tmon','wemakeprice'], '11번가·G마켓·옥션·롯데ON·쿠팡·티몬·위메프 1%', { rate:.01, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', channel:'online' }),
      b('woori-point-gas1', ['gs-caltex','skenergy','s-oil','hyundaioilbank'], 'SK에너지·GS칼텍스·S-OIL·현대오일뱅크 1%', { rate:.01, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', conditionNote:'LPG 충전 제외' }),
      b('woori-point-overseas1', ['overseas','overseas-transit'], '해외 가맹점 1%', { rate:.01, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', replaces:'woori-point-base', displayMerchants:['해외 가맹점'] }),
      b('woori-point-pay-base', ['*'], '간편결제 이용 시 총 3.8%', { rate:.038, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', domesticOnly:true, replaces:'woori-point-base', hideInDetail:true }),
      b('woori-point-pay-cafe3', ['starbucks','angelinus','ediya'], '간편결제 이용 시 총 6%', { rate:.06, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', replaces:['woori-point-base','woori-point-pay-base','woori-point-cafe3'], hideInDetail:true }),
      b('woori-point-pay-movie3', ['cgv','lottecinema'], '간편결제 이용 시 총 6%', { rate:.06, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', replaces:['woori-point-base','woori-point-pay-base','woori-point-movie3'], hideInDetail:true }),
      b('woori-point-pay-department1', ['shinsegae-department','hyundai-department','lotte-department'], '간편결제 이용 시 총 4%', { rate:.04, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', replaces:['woori-point-base','woori-point-pay-base','woori-point-department1'], hideInDetail:true }),
      b('woori-point-pay-mart1', ['emart','homeplus','lottemart','vicmarket','traders'], '간편결제 이용 시 총 4%', { rate:.04, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', replaces:['woori-point-base','woori-point-pay-base','woori-point-mart1'], hideInDetail:true }),
      b('woori-point-pay-online1', ['11st','gmarket','auction','lotteon','coupang','tmon','wemakeprice'], '간편결제 이용 시 총 4%', { rate:.04, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', channel:'online', replaces:['woori-point-base','woori-point-pay-base','woori-point-online1'], hideInDetail:true }),
      b('woori-point-pay-gas1', ['gs-caltex','skenergy','s-oil','hyundaioilbank'], '간편결제 이용 시 총 4%', { rate:.04, reward:'point', minAmount:10000, minSpend:300000, group:'wooriPoint', payment:'woori-point-pay', replaces:['woori-point-base','woori-point-pay-base','woori-point-gas1'], hideInDetail:true }),
      b('woori-point-pay-info', [], '주요 간편결제 3% 추가', { reward:'point', unsupported:true, detailTitle:'네이버페이·카카오페이·PAYCO·SSGPAY · 3% 추가', detailTags:['전월 실적 300,000원 이상','건당 10,000원 이상','카드 등록 후 온라인·오프라인 간편결제 시 적용','기본·특별 적립률에 3% 추가','특별·추가 적립 통합 월 한도 적용'] })
    ], note:'모든 적립은 건당 10,000원 이상 결제부터 적용됩니다. 기본 0.8%는 한도 없이 적립되고, 특별 적립과 간편결제 추가 적립은 전월 30만원·60만원·120만원 구간에 따라 월 1만·2만·5만점 통합한도가 적용됩니다.'
  },
  {
    id: 'starbucks-hyundai', issuer: '현대카드', name: '스타벅스 현대카드', kind: '적립형', rewardMedium: '스타벅스 별',
    source: '현대카드 공식 가이드북 · 카드고릴라 673', groups:{}, benefits:[
      b('starbucks-hyundai-stars', ['*'], '누적 30,000원당 스타벅스 별 1개', {
        reward:'point', minSpend:300000, unsupported:true, fallback:true,
        resultText:'누적 30,000원당 스타벅스 별 1개',
        detailTitle:'국내외 가맹점 · 누적 30,000원당 별 1개',
        detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','적립 한도 없음','당월 이용금액 누적 30,000원마다 별 1개','30,000원 미만 잔여금액은 다음 달로 이월','매출전표 매입 후 1~2영업일 이내 적립','스타벅스 선불카드 충전금액도 적립 대상']
      })
    ], note:'2025년 10월 15일부터 신규·교체·추가 발급은 종료됐지만 기존 카드는 유효기간까지 이용할 수 있습니다. 신규 발급자는 발급월 다음 달까지 전월 실적 조건 없이 혜택이 제공됩니다.'
  },
  {
    id: 'amex-platinum', issuer: '현대카드', name: 'American Express The Platinum Card®', kind: '적립형', rewardMedium: '멤버십 리워즈(MR)', source: '카드고릴라 2280 · 현대카드 공식 상품 안내', groups:{}, benefits:[
      b('amex-platinum-base', ['*'], '국내외 가맹점 1,000원당 1.5MR', { rate:.015, reward:'point', unlimited:true, fallback:true, valueLabel:'1,000원당 1.5MR', conditionNote:'추천 금액은 1MR≈10원으로 환산', detailTitle:'국내외 모든 가맹점 · 1,000원당 1.5MR', detailTags:['전월 실적 조건 없음','건당 이용 조건 없음','적립 한도 없음','결제일 또는 이용대금 입금 완료 후 2~10일 이내 적립'] }),
      b('amex-platinum-2x', ['overseas','overseas-transit','luxury-hotel'], '해외 가맹점·국내 특급호텔 1,000원당 3MR', { rate:.03, reward:'point', minSpend:500000, unlimited:true, replaces:'amex-platinum-base', valueLabel:'1,000원당 3MR', conditionNote:'추천 금액은 1MR≈10원으로 환산', detailTitle:'해외 가맹점·국내 특급호텔 · 1,000원당 3MR', detailTags:['전월 실적 500,000원 이상','건당 이용 조건 없음','적립 한도 없음','전월 실적 미충족 시 기본 1.5MR 적용','해외 원화결제는 특별 적립 제외'] }),
      b('amex-platinum-3x', ['golf','dutyfree'], '골프·골프연습장·면세점 1,000원당 4.5MR', { rate:.045, reward:'point', minSpend:500000, unlimited:true, replaces:'amex-platinum-base', valueLabel:'1,000원당 4.5MR', conditionNote:'추천 금액은 1MR≈10원으로 환산', detailTitle:'골프·골프연습장·면세점 · 1,000원당 4.5MR', detailTags:['전월 실적 500,000원 이상','건당 이용 조건 없음','적립 한도 없음','전월 실적 미충족 시 기본 1.5MR 적용'] }),
      b('amex-platinum-annual', [], '연간 100,000MR 스페셜 적립', { reward:'point', unsupported:true, detailTitle:'연간 스페셜 적립 · 100,000MR', detailTags:['1차년도: 연간 이용금액 1,000,000원 이상','2차년도부터: 전년도 이용금액 36,000,000원 이상','연회비 납부 완료 및 정상 카드 보유 필요','기준 달성 다음 달 적립'] }),
      b('amex-platinum-airport', [], '공항 라운지·공항 편의 서비스', { unsupported:true, benefitType:null, detailTitle:'공항 서비스 · 라운지·발레파킹·리무진·공항철도', detailTags:['공항 라운지 일 1회 · 연 10회','공항·호텔 발레파킹 통합 월 5회','리무진·공항철도 일 1회 · 연 12회','무료 커피 월 1회 · 연 12회','Books Store 할인 일 1회 · 연 12회','선택 서비스는 전월 실적 500,000원 이상'] }),
      b('amex-platinum-global-lounge', [], 'Global Lounge Collection', { unsupported:true, benefitType:null, detailTitle:'Global Lounge Collection · 무료 입장', detailTags:['The Centurion® Lounge','International American Express Lounge','Delta Sky Club® Lounge','실물 카드·여권·당일 탑승권 제시','세부 이용 조건은 Amex 공식 안내 확인'] }),
      b('amex-platinum-hotel', [], '호텔·레스토랑 프리미엄 서비스', { unsupported:true, benefitType:null, detailTitle:'호텔·레스토랑 · 프리미엄 서비스', detailTags:['Fine Hotels + Resorts™','The Hotel Collection','호텔 멤버십 골드 등급','Be My Guest 월 1회 · 연 3회','Be My Guest는 전월 실적 500,000원 이상'] }),
      b('amex-platinum-metal', [], '메탈 플레이트', { unsupported:true, benefitType:null, detailTitle:'메탈 플레이트 · 기본 제공', detailTags:['본인 회원에게 메탈 플레이트 제공','재발급·가족카드 메탈 플레이트는 별도 수수료 확인 필요'] })
    ], note:'추천 금액은 카드 안내의 100,000MR=약 1,000,000원 기준으로 1MR을 약 10원으로 환산한 비교값입니다. 실제 가치는 항공사 마일리지·호텔 포인트 등 사용처와 전환 비율에 따라 달라집니다.'
  },
  {
    id: 'samsung-happiness-v2', issuer: '삼성카드', name: '국민행복 삼성카드 V2', kind: '할인형', rewardMedium: '결제일 할인', source: '카드고릴라 718 · 삼성카드 공식 안내',
    groups:{ samsungHappy:[[300000,10000],[600000,20000],[1000000,40000]] }, groupLabels:{ samsungHappy:'전체 통합 한도' }, groupCapColumns:{ samsungHappy:[
      { label:'쇼핑', tiers:[[300000,4000],[600000,8000],[1000000,16000]] },
      { label:'보육', tiers:[[300000,4000],[600000,8000],[1000000,16000]] },
      { label:'생활요금', tiers:[[300000,4000],[600000,8000],[1000000,16000]] }
    ] }, benefits:[
      b('samsung-happy-department', ['shinsegae-department','lotte-department','hyundai-department','galleria-department','donga-department','daegu-department','akplaza','nc-yuseong','shinsegae-outlet','hyundai-outlet'], '신세계·롯데·현대·갤러리아·동아·대구·AK플라자·NC 유성점·신세계사이먼·현대프리미엄아울렛 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', displayMerchants:['신세계백화점','롯데백화점','현대백화점','갤러리아백화점','동아백화점','대구백화점','AK플라자','NC백화점 유성점','신세계사이먼 프리미엄 아울렛','현대프리미엄아울렛'], channel:'offline', conditionNote:'오프라인 일반 결제만 적용', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','쇼핑 혜택 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','오프라인 일반 결제만 적용'] }),
      b('samsung-happy-mart', ['emart','traders','lottemart','homeplus'], '이마트·트레이더스·롯데마트·홈플러스 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', detailTitle:'이마트·트레이더스·롯데마트·홈플러스 · 7%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','쇼핑 혜택 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원'] }),
      b('samsung-happy-online', ['samsungcard-shopping','gmarket','auction','11st','interpark-shopping','coupang','tmon','wemakeprice','ssg','lotteon'], '삼성카드 쇼핑·G마켓·옥션·11번가·인터파크·쿠팡·티몬·위메프·SSG.COM·롯데ON 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', channel:'online', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','쇼핑 혜택 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원'] }),
      b('samsung-happy-daiso', ['daiso'], '다이소 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', channel:'offline', conditionNote:'오프라인 일반 결제만 적용', detailTitle:'다이소 · 7%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','쇼핑 혜택 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','오프라인 일반 결제만 적용'] }),
      b('samsung-happy-fresh', ['marketkurly','oasis'], '마켓컬리·오아시스마켓 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', channel:'online', conditionNote:'공식 앱·홈페이지 결제만 적용', detailTitle:'마켓컬리·오아시스마켓 · 7%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','쇼핑 혜택 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','공식 앱·홈페이지 결제만 적용'] }),
      b('samsung-happy-care', ['hospital','pharmacy','postpartum-care','academy','workbook','daycare','kindergarten'], '병·의원·약국·산후조리원·학원·학습지·어린이집·유치원 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', conditionNote:'병·의원·약국·산후조리원·학원은 오프라인 일반 결제만 · 어린이집·유치원 정부지원금 이용금액 제외', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','의료·교육·보육·주유 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','병·의원·약국·산후조리원·학원은 오프라인 일반 결제만','어린이집·유치원 정부지원금 이용금액 제외'] }),
      b('samsung-happy-book', ['yes24','interpark-books','aladin','kyobo'], 'YES24·인터파크 도서·알라딘·교보문고 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', channel:'online', conditionNote:'공식 앱·홈페이지 결제만 적용', detailTitle:'YES24·인터파크 도서·알라딘·교보문고 · 7%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','의료·교육·보육·주유 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','공식 앱·홈페이지 결제만 적용'] }),
      b('samsung-happy-gas', ['skenergy','gs-caltex','s-oil'], 'SK에너지·GS칼텍스·S-OIL 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', conditionNote:'LPG 충전 제외', detailTitle:'SK에너지·GS칼텍스·S-OIL · 7%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','의료·교육·보육·주유 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','LPG 충전 제외'] }),
      b('samsung-happy-living', ['apartment-fee','city-gas','electricity','social-insurance','coway','skmagic'], '아파트 관리비·도시가스·전기요금·4대 사회보험·보험료·코웨이·SK매직 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', payment:'autopay', conditionNote:'관리비·공과금·4대 사회보험·렌탈은 자동납부 연결 건만 · 보험료는 일반 납부와 자동납부 모두 적용', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','생활요금·보험 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','관리비·공과금·4대 사회보험·렌탈은 자동납부 연결 건만','보험료는 일반 납부와 자동납부 모두 적용'] }),
      b('samsung-happy-telecom', ['skt','skb','kt','lgu'], 'SKT·SK브로드밴드·KT·LG U+ 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', payment:'autopay', conditionNote:'자동납부 연결 건만 적용', detailTitle:'SKT·SK브로드밴드·KT·LG U+ · 7%', detailTags:['전월 실적 300,000원 이상','건당 이용 조건 없음','생활요금·보험 통합 월 한도 4,000~16,000원','7% 할인 서비스 통합 월 한도 10,000~40,000원','자동납부 연결 건만 적용'] }),
      b('samsung-happy-insurance', ['insurance'], '보험료 7%', { rate:.07, minSpend:300000, monthlyCapTiers:[[300000,4000],[600000,8000],[1000000,16000]], group:'samsungHappy', conditionNote:'일반 납부와 자동납부 모두 적용 · 카드 납부 가능 여부는 보험사별 확인', hideInDetail:true }),
      b('samsung-happy-streaming', ['netflix','wavve','tving','watcha','melon','flo'], '넷플릭스·웨이브·티빙·왓챠·멜론·FLO 3,000원', { flat:3000, minAmount:5000, minSpend:300000, monthlyCap:3000, monthlyCount:1, payment:'autopay', conditionNote:'공식 홈페이지·앱 정기결제만 · 간편결제 및 앱스토어 인앱 결제 제외' }),
      b('samsung-happy-overseas', ['overseas','overseas-transit'], '해외 가맹점·해외 직접구매 1.5%', { rate:.015, monthlyCap:500000, displayMerchants:['해외 가맹점','해외 직접구매'], conditionNote:'해외겸용 카드 이용 시 적용' }),
      b('samsung-happy-voucher', [], '정부지원 국가바우처', { unsupported:true, benefitType:null, detailTitle:'정부지원 국가바우처 · 이용 가능', detailTags:['임신·출산 진료비','보육료·유아학비','첫만남 이용권 등','지원 대상·금액·사용처는 정부 정책과 바우처별 기준 적용'] }),
      b('samsung-happy-shinsegae', [], '신세계백화점 제휴 서비스', { unsupported:true, benefitType:null, detailTitle:'신세계백화점 · 제휴 서비스', detailTags:['신세계백화점 할인쿠폰','신세계포인트 적립','세부 조건은 신세계백화점·신세계포인트 공식 안내 확인'] })
    ], note:'7% 할인 서비스 적용 금액과 어린이집·유치원 이용금액 등은 전월 실적에서 제외됩니다. 국가바우처 이용과 카드 자체 할인은 별도 기준이므로 구분해 확인해야 합니다.'
  },
  {
    id: 'soltravel', issuer: '신한카드', name: 'SOL트래블 체크', kind: '캐시백형', rewardMedium: '결제계좌', source: '카드고릴라 2667 · 신한카드 공식 안내', groups:{}, benefits:[
      b('sol-cu-event', ['cu'], 'CU 간편식·즉석원두커피 5% 할인', { rate:.05, txnCap:2000, requiresEvent:true, scopeLabel:'간편식·즉석원두커피', outsideScopeLabel:'그 외 CU 상품', channel:'offline', benefitType:'할인', membershipStacking:{ 'skt-cu':{ discount:'allowed' } }, detailTitle:'CU 간편식·즉석원두커피 · 5%', detailTags:['전월 실적 조건 없음','건당 이용 조건 없음','건당 한도 2,000원','월 한도 없음 (통합한도 미적용)','T멤버십 CU 할인과 중복 적용 가능'] }),
      b('sol-store', ['seveneleven','cu','gs25','emart24'], 'CU·GS25·세븐일레븐·이마트24 5%', { rate:.05, minSpend:300000, monthlyCap:3000, monthlyCount:3, dailyCount:1, benefitType:'캐시백' }),
      b('sol-transit', ['transit'], '시내버스·시외버스·지하철·공항버스·공항철도 1%', { rate:.01, minSpend:300000, monthlyCap:3000, benefitType:'캐시백', displayMerchants:['시내버스','시외버스','지하철','공항버스','공항철도'], conditionNote:'후불교통 터치(RF) 거래만 적용 · 고속버스 제외' }),
      b('sol-overseas-transit', ['overseas-transit'], '해외 대중교통 1%', { rate:.01, monthlyCap:3000, benefitType:'캐시백', conditionNote:'Mastercard 컨택리스 방식의 버스·지하철·트램 등만 적용 · 택시 제외' }),
      b('sol-lounge', [], '더라운지 공항라운지 본인 무료 입장', { minSpend:300000, annualCount:2, benefitType:null, detailTitle:'더라운지 공항라운지 · 본인 무료 입장', detailTags:['전월 실적 300,000원 이상','반기별 1회 · 연 2회','더라운지 앱에서 이용권 발급 필요','회원 본인만 이용 가능'] })
    ]
  },
  {
    id: 'hana', issuer: '하나카드', name: '하나 나라사랑카드', kind: '캐시백형', rewardMedium: '결제계좌', source: '카드고릴라 2934 · 하나카드 상품설명서',
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
    id: 'deepdream', issuer: '신한카드', name: 'Deep Dream 체크', kind: '적립형', rewardMedium: '마이신한포인트', source: '카드고릴라 281 · 신한카드 공식 안내', membershipDiscountBlocked:true,
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
    id: 'kakaobank', issuer: '카카오뱅크', name: '프렌즈 체크카드', kind: '캐시백형', rewardMedium: '결제계좌', source: '카카오뱅크 공식 안내 · 캐시백 프로모션 2026 (2026.02.01~2027.01.31)', groups:{ kbankPromo:[[300000,1000]] }, groupLabels:{ kbankPromo:'GS25·커피 통합 한도' }, benefits:[
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
    id: 'kakaobank-soho', issuer: '카카오뱅크', name: '카카오뱅크 개인사업자 체크카드', kind: '캐시백형', rewardMedium: '결제계좌',
    source: '카카오뱅크 공식 안내 · 카드고릴라 2421',
    groups:{ kbankSoho:[[0,10000],[500000,20000],[1000000,50000]] },
    groupLabels:{ kbankSoho:'월 통합 캐시백 한도' },
    benefits:[
      b('kbank-soho-food', [], '음식점·주점·카페·베이커리 업종 0.3%', { rate:.003, group:'kbankSoho', merchantCategories:['외식','패스트푸드','카페','베이커리'], displayMerchants:['음식점·주점·카페·베이커리 업종'], conditionNote:'KB국민카드 가맹점 업종 분류 기준 · 백화점·할인점·아울렛·쇼핑몰·공항·호텔·리조트·역사·푸드코트 입점 매장 제외' }),
      b('kbank-soho-online-pay', ['other-online'], '온라인 간편결제 0.3%', { rate:.003, group:'kbankSoho', payment:'kbank-soho-online-pay', channel:'online', domesticOnly:true, displayMerchants:['온라인 간편결제'], conditionNote:'카카오페이·네이버페이·쿠페이·PAYCO·스마일페이·SK페이·SSG페이·배민페이의 국내 온라인 결제만 적용' }),
      b('kbank-soho-mart', ['emart','traders','homeplus','lottemart','hanaro','baemin-store'], '이마트·트레이더스·홈플러스·롯데마트·하나로마트·배민상회 3%', { rate:.03, group:'kbankSoho', conditionNote:'온라인쇼핑·상품권·건물 내 임대매장·SSM 이용 제외' }),
      b('kbank-soho-gas', ['gs-caltex','skenergy','s-oil','hyundaioilbank','gas','lpg'], '주유소·LPG 충전소 3%', { rate:.03, group:'kbankSoho', displayMerchants:['모든 주유소','LPG 충전소'] }),
      b('kbank-soho-telecom', ['skt','kt','lgu'], 'SKT·KT·LG U+ 휴대전화·유선전화·IPTV·인터넷 3%', { rate:.03, group:'kbankSoho', payment:'autopay', detailTitle:'SKT·KT·LG U+ 휴대전화·유선전화·IPTV·인터넷 · 3%', conditionNote:'자동결제 등록 건만 적용 · 결합상품 포함 · 약정요금 대납·지점 월납·알뜰폰 제외' }),
      b('kbank-soho-rental', ['coway','cuckoo','chung-ho','skmagic','wells','cesco'], '코웨이·쿠쿠·청호나이스·SK매직·웰스·세스코 3%', { rate:.03, group:'kbankSoho', payment:'autopay', conditionNote:'월 이용료·렌탈료 자동결제만 적용 · PG 및 일부 간편결제 제외' }),
      b('kbank-soho-overseas', ['overseas','overseas-transit'], '해외 결제 3%', { rate:.03, group:'kbankSoho', displayMerchants:['해외 온·오프라인 결제'] })
    ], note:'생활업종 0.3%와 사업업종 3%가 겹치면 더 유리한 혜택 하나만 적용됩니다. 캐시백은 다음 달 10일 결제계좌로 입금되며, 신규 발급 후 다음 달 말까지는 실적과 관계없이 월 20,000원 한도가 제공됩니다.'
  },
  {
    id: 'kakaopay', issuer: '신한카드', name: '카카오페이 신한 체크카드', kind: '적립형', rewardMedium: '카카오페이머니', source: '카드고릴라 286 · 신한카드 공식 안내',
    groups:{ kakao:[[300000,5000],[500000,7000],[700000,10000],[1000000,13000]] }, benefits:[
      b('kakao-pay', ['*'], '카카오페이 결제 2%', { rate:.02, reward:'point', payment:'kakaopay', monthlyCap:10000, fallback:true, domesticOnly:true, displayMerchants:['카카오페이'] }),
      b('kakao-transit', ['transit'], '버스·지하철 3%', { rate:.03, reward:'point', minSpend:300000, monthlyCap:5000, group:'kakao' }),
      b('kakao-phone', ['skt','kt','lgu'], 'SKT·KT·LG U+ 자동이체 3%', { rate:.03, reward:'point', minSpend:300000, minAmount:50000, monthlyCap:5000, payment:'autopay', group:'kakao' }),
      b('kakao-cgv', ['cgv'], 'CGV 최대 3,000P', { flat:3000, reward:'point', minSpend:300000, monthlyCount:1, group:'kakao', membershipStacking:{ 'skt-cgv':{ discount:'blocked' } }, conditionNote:'CGV 앱·홈페이지 직접 예매 또는 극장 현장 결제만 적용 · T멤버십 앱 무비 예매 제외' }),
      b('kakao-overseas', ['overseas'], '해외 가맹점 1%', { rate:.01, reward:'point' })
    ], note:'국내 혜택이 겹치면 교통·통신·영화가 우선이며 중복 적립되지 않습니다. 카카오페이 미가입·정보 불일치 등으로 카카오페이머니 적립이 불가능하면 마이신한포인트로 적립됩니다.'
  },
  {
    id: 'simple', issuer: '하나카드', name: '더 심플 체크카드', kind: '캐시백형', rewardMedium: '결제계좌', source: '카드고릴라 2810 · 하나카드 상품설명서', groups:{}, benefits:[
      b('simple-phone', ['skt','kt','lgu','mvno'], 'SKT·KT·LG U+·알뜰폰 자동이체 5,000원', { flat:5000, minAmount:10000, minSpend:300000, monthlyCap:5000, payment:'autopay' }),
      b('simple-coffee', ['starbucks','coffeebean','twosome'], '스타벅스·커피빈·투썸플레이스 5%', { rate:.05, minAmount:10000, minSpend:300000, monthlyCap:2000, channel:'offline' })
    ]
  },
  {
    id: 'samsungmoney', issuer: 'Samsung Wallet · 우리카드 제휴', name: '삼성월렛 머니', kind: '적립형', rewardMedium: '삼성월렛 포인트', source: '삼성전자 Samsung Wallet 공식 안내', requiredPayment:'samsungmoney', groups:{}, benefits:[
      b('samsungmoney-offline', ['*'], '오프라인 0.5% 기본 적립', { rate:.005, reward:'point', payment:'samsungmoney', channel:'offline', domesticOnly:true, unlimited:true, fallback:true }),
      b('samsungmoney-online', ['naverplus','hmall','lotteon','cjonstyle','wconcept'], '네이버플러스 스토어·H몰·롯데ON·CJ온스타일·W컨셉 1.5% 기본 적립', { rate:.015, reward:'point', payment:'samsungmoney', channel:'online', domesticOnly:true, unlimited:true })
    ], note:'온라인은 삼성월렛 머니를 지원하는 제휴처에서만 사용할 수 있습니다. 우리은행 계좌 연결 및 월별 이벤트 추가 적립은 변경·조기 종료될 수 있어 현재 자동 계산에서 제외했습니다.'
  },
  {
    id: 'love', issuer: '신한카드', name: '신한카드 LOVE', kind: '할인형', rewardMedium: 'LOVE포인트 병행', source: '신한카드 LOVE 공식 안내',
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

// 신규 방문자는 대표 카드 조합으로 앱의 추천 방식을 먼저 확인할 수 있다.
// 저장된 로컬 설정이나 동기화 코드가 있으면 해당 설정이 항상 우선한다.
const defaultOwnedCardIds = ['nori','hana','soltravel','deepdream','kakaobank','kakaopay'];

const cardSourceUrls = {
  'nh-flex': 'https://card.nonghyup.com/servlet/IpCc2021R.act?CD_WRS_SQNO=90010051',
  'woori-point': 'https://pc.wooricard.com/dcpc/yh1/crd/crd01/H1CRD201S00.do?recomNo=834629',
  'starbucks-hyundai': 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc?cardWcd=SBHC',
  'amex-platinum': 'https://www.hyundaicard.com/docfiles/resources/pc/html/carDtl/AMPT_PC.html',
  'samsung-happiness-v2': 'https://www.samsungcard.com/home/Card/Cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1688&site=GP007474&webViewFirstPage=true',
  nori: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?cooperationcode=07964&mainCC=a',
  'coupang-wow-card': 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09293',
  'gaon-biz': 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?cooperationcode=09176&mainCC=a',
  soltravel: 'https://www.shinhancard.com/pconts/html/card/travel/travel_supersol.html',
  hana: 'https://www.hanacard.co.kr/OPI41000000D.web?CD_PD_SEQ=18813&mID=PI41018813P&schID=pcd',
  deepdream: 'https://www.shinhancard.com/pconts/html/card/apply/check/1188313_2206.html',
  kakaobank: 'https://www.kakaobank.com/products/checkcard',
  'kakaobank-soho': 'https://www.kakaobank.com/products/sohoCheckCard',
  kakaopay: 'https://www.shinhancard.com/pconts/html/card/apply/check/1196087_2206.html',
  simple: 'https://m.hanacard.co.kr/leaflet/15/15245_20250703.pdf',
  samsungmoney: 'https://www.samsung.com/sec/apps/samsung-wallet/',
  love: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1226051_2207.html'
};

const cardGorillaUrls = {
  'nh-flex': 'https://www.card-gorilla.com/card/detail/666',
  'woori-point': 'https://www.card-gorilla.com/card/detail/84',
  'starbucks-hyundai': 'https://www.card-gorilla.com/card/detail/673',
  'amex-platinum': 'https://www.card-gorilla.com/card/detail/2280',
  'samsung-happiness-v2': 'https://www.card-gorilla.com/card/detail/718',
  nori: 'https://www.card-gorilla.com/card/detail/2422',
  'coupang-wow-card': 'https://www.card-gorilla.com/card/detail/2609',
  'gaon-biz': 'https://www.card-gorilla.com/card/detail/1294',
  soltravel: 'https://www.card-gorilla.com/card/detail/2667',
  hana: 'https://www.card-gorilla.com/card/detail/2934',
  deepdream: 'https://www.card-gorilla.com/card/detail/281',
  kakaobank: 'https://www.card-gorilla.com/card/detail/435',
  'kakaobank-soho': 'https://www.card-gorilla.com/card/detail/2421',
  kakaopay: 'https://www.card-gorilla.com/card/detail/286',
  simple: 'https://www.card-gorilla.com/card/detail/2810',
  love: 'https://www.card-gorilla.com/card/detail/2'
};

const cardReferenceUrls = {
  samsungmoney: 'https://r1.community.samsung.com/t5/samsung-wallet/%EC%82%BC%EC%84%B1%EC%9B%94%EB%A0%9B%EB%A8%B8%EB%8B%88-%EA%B2%B0%EC%A0%9C-%ED%98%9C%ED%83%9D/td-p/37921928'
};

const cardAdditionalSourceUrls = {
  'starbucks-hyundai': [
    { label:'스타벅스 현대카드 공식 가이드북', url:'https://www.hyundaicard.com/upload/card/T_AZG-20240910-1651-46_%EC%8A%A4%ED%83%80%EB%B2%85%EC%8A%A4%20%EB%B0%9C%EA%B8%89%ED%8C%A8%ED%82%A4%EC%A7%80_%EA%B0%80%EC%9D%B4%EB%93%9C%EB%B6%81_V3_%EA%B3%B5%EC%8B%9C%EC%8B%A4%EC%9A%A9.pdf' }
  ],
  'coupang-wow-card': [
    { label:'2026년 10월 프로모션 공식 안내', url:'https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?eventNum=1000647&mainCC=a' }
  ]
};
