export interface FeedItem {
  id: number;
  type: "claim" | "product" | "lounge";
  cat: string;
  tags: string[];
  title: string;
  desc: string;
  author: string;
  badge: string;
  star: number;
  likes: number;
  comments: number;
  date: string;
  prodName?: string;
}

let nextId = 100;

export function generateId() {
  return nextId++;
}

const claims: Omit<FeedItem, "id" | "author" | "comments" | "date">[] = [
  { type: "claim", cat: "dental", tags: ["dental", "cost"], title: "임플란트 3개 식립, 450만원 지급받은 후기", desc: "치과 공포증 때문에 미루다 큰맘 먹고 갔는데, 비용 걱정 덜어서 다행입니다.", badge: "가입 5년차", star: 5, likes: 342, prodName: "(무)THE건강한치아보험V" },
  { type: "claim", cat: "dental", tags: ["dental"], title: "크라운 치료 2개, 서류제출 5분만에 끝", desc: "점심시간에 병원에서 서류 찍어 올렸는데 오후에 입금됐네요. 속도 무엇?", badge: "가입 2년차", star: 5, likes: 128, prodName: "(무)라이나치아사랑보험" },
  { type: "claim", cat: "dental", tags: ["dental", "cost"], title: "사랑니 발치하고 보존치료까지 싹 다 청구함", desc: "큰 돈은 아니지만 쏠쏠하네요. 치과는 역시 라이나.", badge: "가입 1년차", star: 4, likes: 89, prodName: "(무)스마일치아보험" },
  { type: "claim", cat: "dental", tags: ["dental"], title: "브릿지 치료 보상금 수령, 부모님 해드리길 잘했네요", desc: "어머니 치아가 안 좋으셔서 걱정했는데 보험금으로 해결했습니다.", badge: "가입 4년차", star: 5, likes: 210, prodName: "(무)THE건강한치아보험V" },
  { type: "claim", cat: "dental", tags: ["dental"], title: "임플란트 식립 후기 공유합니다 (청구 팁 포함)", desc: "치조골 이식술 포함해서 청구할 때 꼭 챙겨야 할 서류 알려드려요.", badge: "가입 3년차", star: 5, likes: 450, prodName: "(무)THE건강한치아보험V" },
  { type: "claim", cat: "cancer", tags: ["cancer", "cost"], title: "유방암 2기 진단금 5천만원 수령 후기", desc: "진단금 덕분에 생활비 걱정 없이 항암치료에만 집중할 수 있었습니다. 정말 감사합니다.", badge: "가입 10년차", star: 5, likes: 890, prodName: "(무)라이나암보험" },
  { type: "claim", cat: "cancer", tags: ["cancer"], title: "갑상선암 수술비 청구, 생각보다 간단하네요", desc: "소액암이라 걱정했는데 약관대로 정확히 지급되었습니다.", badge: "가입 3년차", star: 4, likes: 150, prodName: "(무)실버암보험" },
  { type: "claim", cat: "cancer", tags: ["cancer", "cost"], title: "표적항암약물허가치료비 특약, 꼭 넣으세요", desc: "비급여 약제비가 너무 비싼데 이 특약 없었으면 치료 포기할 뻔했습니다.", badge: "가입 2년차", star: 5, likes: 560, prodName: "(무)집중보장암보험" },
  { type: "claim", cat: "brain", tags: ["brain"], title: "급성심근경색 스텐트 시술, 빠른 지급 감사합니다", desc: "응급실 실려가서 정신 없었는데 보험금이라도 빨리 나와서 다행입니다.", badge: "가입 7년차", star: 5, likes: 330, prodName: "(무)라이나뇌심장보험" },
  { type: "claim", cat: "brain", tags: ["brain", "cost"], title: "뇌졸중 재활치료비, 매달 나오니 든든해요", desc: "후유장해 재활이 길어지는데 생활비 명목으로 나오니 부담이 덜합니다.", badge: "가입 4년차", star: 5, likes: 410, prodName: "(무)건강한뇌심장보장보험" },
  { type: "claim", cat: "dementia", tags: ["dementia"], title: "어머니 치매 간병비 보험금 청구 후기", desc: "장기요양등급 판정 받고 바로 청구했습니다. 요양병원비에 보태고 있어요.", badge: "가입 6년차", star: 5, likes: 280, prodName: "(무)전에없던치매보험" },
];

const products: Omit<FeedItem, "id" | "author" | "comments" | "date">[] = [
  { type: "product", cat: "dental", tags: ["dental"], title: "치아보험은 역시 라이나, 5년 갱신 후기", desc: "다른 보험사 갈아타려다 보장금액 비교해보고 다시 연장했습니다.", badge: "가입 5년차", star: 5, likes: 112, prodName: "(무)THE건강한치아보험V" },
  { type: "product", cat: "dental", tags: ["dental"], title: "상담원분이 너무 친절해서 가입함", desc: "보장 내용 꼼꼼하게 설명해주셔서 믿음이 갔어요.", badge: "가입 1개월", star: 5, likes: 45, prodName: "(무)라이나치아사랑보험" },
  { type: "product", cat: "dental", tags: ["dental"], title: "임플란트 개수 제한 없는 게 제일 좋음", desc: "나이 들수록 치아 걱정인데 무제한 보장이라 든든합니다.", badge: "가입 2년차", star: 4, likes: 88, prodName: "(무)THE건강한치아보험V" },
  { type: "product", cat: "cancer", tags: ["cancer"], title: "암보험 리모델링, 라이나로 갈아탔습니다", desc: "기존 보험이 보장이 너무 약해서 해지하고 새로 들었어요. 보험료도 합리적.", badge: "신규가입", star: 5, likes: 205, prodName: "(무)라이나암보험" },
  { type: "product", cat: "cancer", tags: ["cancer"], title: "유병자 암보험 가입 승인! 부모님 선물", desc: "혈압약 드시고 계셔서 걱정했는데 간편심사로 통과됐네요.", badge: "가입 1개월", star: 5, likes: 170, prodName: "(무)실버암보험" },
  { type: "product", cat: "dementia", tags: ["dementia"], title: "치매보험, 내가 걸릴까봐 무서워서 가입", desc: "나중에 자식들한테 짐 되기 싫어서 미리 준비합니다.", badge: "가입 3년차", star: 5, likes: 300, prodName: "(무)전에없던치매보험" },
];

const lounge: Omit<FeedItem, "id" | "author" | "comments" | "date">[] = [
  { type: "lounge", cat: "balance", tags: ["balance"], title: "전세금 3억 지원 vs 내 노후 즐기기", desc: "자녀 결혼 자금, 어디까지 해줄까? 지금 투표하세요!", badge: "참여 5.8k", star: 0, likes: 540 },
  { type: "lounge", cat: "balance", tags: ["balance"], title: "도심 실버타운 vs 전원주택", desc: "은퇴 후 거주지, 병원 가까운 도심? 공기 좋은 시골?", badge: "참여 4.2k", star: 0, likes: 420 },
  { type: "lounge", cat: "balance", tags: ["balance"], title: "각방 쓰며 편하게 vs 한 침대 끈끈하게", desc: "오래된 부부의 현실적인 선택은?", badge: "참여 3.8k", star: 0, likes: 380 },
  { type: "lounge", cat: "balance", tags: ["balance"], title: "미리 증여하고 효도 받기 vs 끝까지 쥐고 있기", desc: "유산 상속, 언제 넘기는 게 정답일까?", badge: "참여 4.9k", star: 0, likes: 490 },
  { type: "lounge", cat: "balance", tags: ["balance"], title: "마음 편한 예금 3% vs 인생 한방 주식/코인", desc: "노후 자금 재테크, 안전 vs 도전 당신의 선택은?", badge: "참여 6.3k", star: 0, likes: 630 },
  { type: "lounge", cat: "worry", tags: ["worry"], title: "요양병원비 형제끼리 어떻게 분담하시나요?", desc: "큰오빠는 형편이 어렵다며 빠지려고 하는데 스트레스 받네요.", badge: "댓글 210", star: 0, likes: 450 },
  { type: "lounge", cat: "tips", tags: ["tips"], title: "병원비 아끼는 꿀팁, 진료비 세부내역서 꼭 챙기세요", desc: "비급여 항목 꼼꼼히 보면 삭감 가능한 부분들이 보입니다.", badge: "스크랩 500", star: 0, likes: 890 },
];

const authors = ["김라이나", "박*윤", "이*진", "최*수", "정*영", "한*미", "오*환", "강*호", "윤*아", "서*연"];
const dates = ["방금 전", "10분 전", "30분 전", "1시간 전", "2시간 전", "3시간 전", "5시간 전", "12시간 전", "1일 전", "2일 전", "3일 전", "1주 전"];

function buildItems(items: Omit<FeedItem, "id" | "author" | "comments" | "date">[]): FeedItem[] {
  return items.map((item, idx) => ({
    ...item,
    id: generateId(),
    author: authors[idx % authors.length],
    comments: Math.floor(Math.random() * 30) + 1,
    date: dates[idx % dates.length],
  }));
}

let feedData: FeedItem[] = [];

export function initFeedData() {
  if (feedData.length > 0) return feedData;
  feedData = [...buildItems(claims), ...buildItems(products), ...buildItems(lounge)];
  return feedData;
}

export function getFeedData() {
  return feedData;
}

export function addFeedItem(item: Omit<FeedItem, "id">) {
  const newItem: FeedItem = { ...item, id: generateId() };
  feedData = [newItem, ...feedData];
  return newItem;
}

export const chipsConfig: Record<string, { id: string; label: string }[]> = {
  recommend: [
    { id: "all", label: "BEST" },
    { id: "cost", label: "병원비_0원" },
    { id: "dental", label: "치아보험" },
    { id: "cancer", label: "암보험" },
    { id: "worry", label: "#고민상담" },
  ],
  claim: [
    { id: "all", label: "전체" },
    { id: "dental", label: "치아" },
    { id: "cancer", label: "암/중대질병" },
    { id: "brain", label: "뇌/심장" },
    { id: "dementia", label: "치매/간병" },
  ],
  product: [
    { id: "all", label: "전체" },
    { id: "dental", label: "치아보험" },
    { id: "cancer", label: "암보험" },
    { id: "dementia", label: "치매/간병" },
  ],
  lounge: [
    { id: "all", label: "전체" },
    { id: "balance", label: "밸런스게임" },
    { id: "worry", label: "고민상담" },
    { id: "tips", label: "생활지혜" },
  ],
};
