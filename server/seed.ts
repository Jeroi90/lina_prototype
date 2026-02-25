import { db } from "./storage";
import { feedItems, balanceGames } from "@shared/schema";

const authors = ["김라이나", "박*윤", "이*진", "최*수", "정*영", "한*미", "오*환", "강*호", "윤*아", "서*연"];
const dates = ["방금 전", "10분 전", "30분 전", "1시간 전", "2시간 전", "3시간 전", "5시간 전", "12시간 전", "1일 전", "2일 전", "3일 전", "1주 전"];

const claimData = [
  { type: "claim", cat: "dental", tags: '["dental","cost"]', title: "임플란트 3개 식립, 450만원 지급받은 후기", desc: "치과 공포증 때문에 미루다 큰맘 먹고 갔는데, 비용 걱정 덜어서 다행입니다.", badge: "가입 5년차", star: 5, likes: 342, prodName: "(무)THE건강한치아보험V" },
  { type: "claim", cat: "dental", tags: '["dental"]', title: "크라운 치료 2개, 서류제출 5분만에 끝", desc: "점심시간에 병원에서 서류 찍어 올렸는데 오후에 입금됐네요. 속도 무엇?", badge: "가입 2년차", star: 5, likes: 128, prodName: "(무)라이나치아사랑보험" },
  { type: "claim", cat: "dental", tags: '["dental","cost"]', title: "사랑니 발치하고 보존치료까지 싹 다 청구함", desc: "큰 돈은 아니지만 쏠쏠하네요. 치과는 역시 라이나.", badge: "가입 1년차", star: 4, likes: 89, prodName: "(무)스마일치아보험" },
  { type: "claim", cat: "dental", tags: '["dental"]', title: "브릿지 치료 보상금 수령, 부모님 해드리길 잘했네요", desc: "어머니 치아가 안 좋으셔서 걱정했는데 보험금으로 해결했습니다.", badge: "가입 4년차", star: 5, likes: 210, prodName: "(무)THE건강한치아보험V" },
  { type: "claim", cat: "dental", tags: '["dental"]', title: "임플란트 식립 후기 공유합니다 (청구 팁 포함)", desc: "치조골 이식술 포함해서 청구할 때 꼭 챙겨야 할 서류 알려드려요.", badge: "가입 3년차", star: 5, likes: 450, prodName: "(무)THE건강한치아보험V" },
  { type: "claim", cat: "cancer", tags: '["cancer","cost"]', title: "유방암 2기 진단금 5천만원 수령 후기", desc: "진단금 덕분에 생활비 걱정 없이 항암치료에만 집중할 수 있었습니다. 정말 감사합니다.", badge: "가입 10년차", star: 5, likes: 890, prodName: "(무)라이나암보험" },
  { type: "claim", cat: "cancer", tags: '["cancer"]', title: "갑상선암 수술비 청구, 생각보다 간단하네요", desc: "소액암이라 걱정했는데 약관대로 정확히 지급되었습니다.", badge: "가입 3년차", star: 4, likes: 150, prodName: "(무)실버암보험" },
  { type: "claim", cat: "cancer", tags: '["cancer","cost"]', title: "표적항암약물허가치료비 특약, 꼭 넣으세요", desc: "비급여 약제비가 너무 비싼데 이 특약 없었으면 치료 포기할 뻔했습니다.", badge: "가입 2년차", star: 5, likes: 560, prodName: "(무)집중보장암보험" },
  { type: "claim", cat: "brain", tags: '["brain"]', title: "급성심근경색 스텐트 시술, 빠른 지급 감사합니다", desc: "응급실 실려가서 정신 없었는데 보험금이라도 빨리 나와서 다행입니다.", badge: "가입 7년차", star: 5, likes: 330, prodName: "(무)라이나뇌심장보험" },
  { type: "claim", cat: "brain", tags: '["brain","cost"]', title: "뇌졸중 재활치료비, 매달 나오니 든든해요", desc: "후유장해 재활이 길어지는데 생활비 명목으로 나오니 부담이 덜합니다.", badge: "가입 4년차", star: 5, likes: 410, prodName: "(무)건강한뇌심장보장보험" },
  { type: "claim", cat: "dementia", tags: '["dementia"]', title: "어머니 치매 간병비 보험금 청구 후기", desc: "장기요양등급 판정 받고 바로 청구했습니다. 요양병원비에 보태고 있어요.", badge: "가입 6년차", star: 5, likes: 280, prodName: "(무)전에없던치매보험" },
];

const productData = [
  { type: "product", cat: "dental", tags: '["dental"]', title: "치아보험은 역시 라이나, 5년 갱신 후기", desc: "다른 보험사 갈아타려다 보장금액 비교해보고 다시 연장했습니다.", badge: "가입 5년차", star: 5, likes: 112, prodName: "(무)THE건강한치아보험V" },
  { type: "product", cat: "dental", tags: '["dental"]', title: "상담원분이 너무 친절해서 가입함", desc: "보장 내용 꼼꼼하게 설명해주셔서 믿음이 갔어요.", badge: "가입 1개월", star: 5, likes: 45, prodName: "(무)라이나치아사랑보험" },
  { type: "product", cat: "dental", tags: '["dental"]', title: "임플란트 개수 제한 없는 게 제일 좋음", desc: "나이 들수록 치아 걱정인데 무제한 보장이라 든든합니다.", badge: "가입 2년차", star: 4, likes: 88, prodName: "(무)THE건강한치아보험V" },
  { type: "product", cat: "cancer", tags: '["cancer"]', title: "암보험 리모델링, 라이나로 갈아탔습니다", desc: "기존 보험이 보장이 너무 약해서 해지하고 새로 들었어요. 보험료도 합리적.", badge: "신규가입", star: 5, likes: 205, prodName: "(무)라이나암보험" },
  { type: "product", cat: "cancer", tags: '["cancer"]', title: "유병자 암보험 가입 승인! 부모님 선물", desc: "혈압약 드시고 계셔서 걱정했는데 간편심사로 통과됐네요.", badge: "가입 1개월", star: 5, likes: 170, prodName: "(무)실버암보험" },
  { type: "product", cat: "dementia", tags: '["dementia"]', title: "치매보험, 내가 걸릴까봐 무서워서 가입", desc: "나중에 자식들한테 짐 되기 싫어서 미리 준비합니다.", badge: "가입 3년차", star: 5, likes: 300, prodName: "(무)전에없던치매보험" },
];

const loungeData = [
  { type: "lounge", cat: "balance", tags: '["balance"]', title: "전세금 3억 지원 vs 내 노후 즐기기", desc: "자녀 결혼 자금, 어디까지 해줄까? 지금 투표하세요!", badge: "참여 5.8k", star: 0, likes: 540 },
  { type: "lounge", cat: "balance", tags: '["balance"]', title: "도심 실버타운 vs 전원주택", desc: "은퇴 후 거주지, 병원 가까운 도심? 공기 좋은 시골?", badge: "참여 4.2k", star: 0, likes: 420 },
  { type: "lounge", cat: "balance", tags: '["balance"]', title: "각방 쓰며 편하게 vs 한 침대 끈끈하게", desc: "오래된 부부의 현실적인 선택은?", badge: "참여 3.8k", star: 0, likes: 380 },
  { type: "lounge", cat: "balance", tags: '["balance"]', title: "미리 증여하고 효도 받기 vs 끝까지 쥐고 있기", desc: "유산 상속, 언제 넘기는 게 정답일까?", badge: "참여 4.9k", star: 0, likes: 490 },
  { type: "lounge", cat: "balance", tags: '["balance"]', title: "마음 편한 예금 3% vs 인생 한방 주식/코인", desc: "노후 자금 재테크, 안전 vs 도전 당신의 선택은?", badge: "참여 6.3k", star: 0, likes: 630 },
  { type: "lounge", cat: "worry", tags: '["worry"]', title: "요양병원비 형제끼리 어떻게 분담하시나요?", desc: "큰오빠는 형편이 어렵다며 빠지려고 하는데 스트레스 받네요.", badge: "댓글 210", star: 0, likes: 450 },
  { type: "lounge", cat: "tips", tags: '["tips"]', title: "병원비 아끼는 꿀팁, 진료비 세부내역서 꼭 챙기세요", desc: "비급여 항목 꼼꼼히 보면 삭감 가능한 부분들이 보입니다.", badge: "스크랩 500", star: 0, likes: 890 },
];

const balanceGameData = [
  {
    tag: "Q1. 자녀 결혼 자금",
    title: "자녀 결혼,\n어디까지 해줄까?",
    image: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=600&q=80",
    optionALabel: "전세금 3억\n지원해주기", optionASub: "(노후 쪼들리더라도)",
    optionBLabel: "지원 없이\n알아서 하게", optionBSub: "(내 노후 즐기기)",
    resultALabel: "지원해준다", resultAPct: 48,
    resultBLabel: "내 노후 우선", resultBPct: 52,
    participants: "5,820명 참여",
    commentPlaceholder: "자녀 결혼 자금, 솔직한 생각은?",
    commentsJson: JSON.stringify([
      { name: "김*수", time: "10분 전", type: "B", text: "3억 지원하고 나면 남는 게 없어요. 내 노후가 더 급합니다.", likes: 210 },
      { name: "이*영", time: "1시간 전", type: "A", text: "요즘 전세금이 얼마인데... 부모가 안 도와주면 결혼 자체를 못 해요.", likes: 185 },
      { name: "최*철", time: "3시간 전", type: "B", text: "저도 아무 지원 없이 시작했어요. 스스로 일궈야 더 소중한 법입니다.", likes: 124 },
    ]),
  },
  {
    tag: "Q2. 은퇴 후 거주지",
    title: "은퇴 후,\n어디서 살까?",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
    optionALabel: "병원 가깝고\n편리한 도심", optionASub: "(실버타운)",
    optionBLabel: "공기 좋고\n텃밭 가꾸는", optionBSub: "(전원주택)",
    resultALabel: "도심 실버타운", resultAPct: 51,
    resultBLabel: "전원주택", resultBPct: 49,
    participants: "4,150명 참여",
    commentPlaceholder: "도심 vs 시골, 당신의 선택은?",
    commentsJson: JSON.stringify([
      { name: "박*호", time: "5분 전", type: "A", text: "나이 들면 응급실 5분 거리가 최고의 복지입니다.", likes: 155 },
      { name: "최*자", time: "20분 전", type: "B", text: "도시 공기 마시다 병 걸려요. 시골에서 텃밭 가꾸며 건강하게 사는 게 진짜 노후죠.", likes: 142 },
      { name: "정*수", time: "2시간 전", type: "A", text: "전원주택 살아봤는데 겨울에 외로움 장난 아닙니다.", likes: 98 },
    ]),
  },
  {
    tag: "Q3. 부부 관계",
    title: "오래된 부부,\n어떻게 살까?",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    optionALabel: "각방 쓰며\n편하게 살기", optionASub: "(터치 안 하기)",
    optionBLabel: "싸워도 한 침대\n끈끈하게", optionBSub: "(부부애 유지)",
    resultALabel: "각방 독립", resultAPct: 47,
    resultBLabel: "한 침대 부부애", resultBPct: 53,
    participants: "3,780명 참여",
    commentPlaceholder: "부부 사이, 솔직한 생각은?",
    commentsJson: JSON.stringify([
      { name: "강*미", time: "30분 전", type: "A", text: "30년 같이 살았으면 충분히 사랑 확인했잖아요. 각방이 서로를 위한 배려입니다.", likes: 178 },
      { name: "윤*구", time: "1시간 전", type: "B", text: "각방 쓰기 시작하면 마음도 멀어져요. 불편해도 함께여야 부부죠.", likes: 165 },
    ]),
  },
  {
    tag: "Q4. 유산 상속",
    title: "재산,\n언제 넘길까?",
    image: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=600&q=80",
    optionALabel: "미리 증여하고\n효도 받기", optionASub: "(기대하기)",
    optionBLabel: "죽을 때까지\n쥐고 있기", optionBSub: "(나중에 상속)",
    resultALabel: "미리 증여", resultAPct: 38,
    resultBLabel: "끝까지 보유", resultBPct: 62,
    participants: "4,920명 참여",
    commentPlaceholder: "상속 vs 증여, 당신의 생각은?",
    commentsJson: JSON.stringify([
      { name: "임*숙", time: "방금 전", type: "B", text: "미리 줬다가 요양원 보내는 자식들 뉴스에 나오잖아요. 쥐고 있어야 대접받아요.", likes: 230 },
      { name: "한*구", time: "40분 전", type: "A", text: "살아있을 때 주는 게 세금도 아끼고, 자식들 필요할 때 도와주는 거죠.", likes: 115 },
    ]),
  },
  {
    tag: "Q5. 재테크",
    title: "노후 자금,\n어떻게 굴릴까?",
    image: "https://images.unsplash.com/photo-1501139083538-0139583c61ee?auto=format&fit=crop&w=600&q=80",
    optionALabel: "마음 편한\n예금/채권", optionASub: "(수익률 3%)",
    optionBLabel: "인생은 한방!\n주식/코인", optionBSub: "(수익률 -50%~+200%)",
    resultALabel: "안전한 예금", resultAPct: 52,
    resultBLabel: "공격적 투자", resultBPct: 48,
    participants: "6,340명 참여",
    commentPlaceholder: "안전 vs 도전, 당신의 투자 성향은?",
    commentsJson: JSON.stringify([
      { name: "오*철", time: "10분 전", type: "A", text: "노후 자금으로 주식 하는 건 도박이에요. 3%라도 원금 보장이 최고입니다.", likes: 190 },
      { name: "조*희", time: "2시간 전", type: "B", text: "예금 3%면 물가 오르는 것도 못 따라가요. 일부는 투자해야 돈이 불어납니다.", likes: 175 },
    ]),
  },
];

export function seedDatabase() {
  // Check if data already exists
  const existingItems = db.select().from(feedItems).all();
  if (existingItems.length > 0) {
    return; // Already seeded
  }

  console.log("Seeding database with initial data...");

  // Seed feed items
  const allItems = [...claimData, ...productData, ...loungeData];
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    db.insert(feedItems).values({
      type: item.type,
      cat: item.cat,
      tags: item.tags,
      title: item.title,
      desc: item.desc,
      author: authors[i % authors.length],
      badge: item.badge,
      star: item.star,
      likes: item.likes,
      comments: Math.floor(Math.random() * 30) + 1,
      date: dates[i % dates.length],
      prodName: (item as any).prodName || null,
      status: "live",
      userId: null,
    }).run();
  }

  // Seed balance games
  for (const game of balanceGameData) {
    db.insert(balanceGames).values(game).run();
  }

  console.log(`Seeded ${allItems.length} feed items and ${balanceGameData.length} balance games.`);
}
