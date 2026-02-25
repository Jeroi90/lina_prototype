export interface BalanceGame {
  id: string;
  tag: string;
  title: string;
  image: string;
  optionA: { label: string; sub?: string };
  optionB: { label: string; sub?: string };
  resultA: { label: string; pct: number };
  resultB: { label: string; pct: number };
  participants: string;
  commentPlaceholder: string;
  comments: BalanceComment[];
}

export interface BalanceComment {
  name: string;
  time: string;
  type: "A" | "B";
  text: string;
  likes: number;
  isNew?: boolean;
}

export const balanceGames: BalanceGame[] = [
  {
    id: "card-1",
    tag: "Q1. 자녀 결혼 자금",
    title: "자녀 결혼,\n어디까지 해줄까?",
    image: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=600&q=80",
    optionA: { label: "전세금 3억\n지원해주기", sub: "(노후 쪼들리더라도)" },
    optionB: { label: "지원 없이\n알아서 하게", sub: "(내 노후 즐기기)" },
    resultA: { label: "지원해준다", pct: 48 },
    resultB: { label: "내 노후 우선", pct: 52 },
    participants: "5,820명 참여",
    commentPlaceholder: "자녀 결혼 자금, 솔직한 생각은?",
    comments: [
      { name: "김*수", time: "10분 전", type: "B", text: "3억 지원하고 나면 남는 게 없어요. 내 노후가 더 급합니다. 자식도 결국 이해해줄 거예요.", likes: 210 },
      { name: "이*영", time: "1시간 전", type: "A", text: "요즘 전세금이 얼마인데... 부모가 안 도와주면 결혼 자체를 못 해요. 해줄 수 있을 때 해줘야죠.", likes: 185 },
      { name: "최*철", time: "3시간 전", type: "B", text: "저도 아무 지원 없이 시작했어요. 스스로 일궈야 더 소중한 법입니다.", likes: 124 },
    ],
  },
  {
    id: "card-2",
    tag: "Q2. 은퇴 후 거주지",
    title: "은퇴 후,\n어디서 살까?",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
    optionA: { label: "병원 가깝고\n편리한 도심", sub: "(실버타운)" },
    optionB: { label: "공기 좋고\n텃밭 가꾸는", sub: "(전원주택)" },
    resultA: { label: "도심 실버타운", pct: 51 },
    resultB: { label: "전원주택", pct: 49 },
    participants: "4,150명 참여",
    commentPlaceholder: "도심 vs 시골, 당신의 선택은?",
    comments: [
      { name: "박*호", time: "5분 전", type: "A", text: "나이 들면 응급실 5분 거리가 최고의 복지입니다. 텃밭은 주말농장으로 충분해요.", likes: 155 },
      { name: "최*자", time: "20분 전", type: "B", text: "도시 공기 마시다 병 걸려요. 시골에서 텃밭 가꾸며 건강하게 사는 게 진짜 노후죠.", likes: 142 },
      { name: "정*수", time: "2시간 전", type: "A", text: "전원주택 살아봤는데 겨울에 외로움 장난 아닙니다. 결국 도심으로 돌아왔어요.", likes: 98 },
    ],
  },
  {
    id: "card-3",
    tag: "Q3. 부부 관계",
    title: "오래된 부부,\n어떻게 살까?",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    optionA: { label: "각방 쓰며\n편하게 살기", sub: "(터치 안 하기)" },
    optionB: { label: "싸워도 한 침대\n끈끈하게", sub: "(부부애 유지)" },
    resultA: { label: "각방 독립", pct: 47 },
    resultB: { label: "한 침대 부부애", pct: 53 },
    participants: "3,780명 참여",
    commentPlaceholder: "부부 사이, 솔직한 생각은?",
    comments: [
      { name: "강*미", time: "30분 전", type: "A", text: "30년 같이 살았으면 충분히 사랑 확인했잖아요. 코골이 때문에 각방이 서로를 위한 배려입니다.", likes: 178 },
      { name: "윤*구", time: "1시간 전", type: "B", text: "각방 쓰기 시작하면 마음도 멀어져요. 불편해도 함께여야 부부죠.", likes: 165 },
    ],
  },
  {
    id: "card-4",
    tag: "Q4. 유산 상속",
    title: "재산,\n언제 넘길까?",
    image: "https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=600&q=80",
    optionA: { label: "미리 증여하고\n효도 받기", sub: "(기대하기)" },
    optionB: { label: "죽을 때까지\n쥐고 있기", sub: "(나중에 상속)" },
    resultA: { label: "미리 증여", pct: 38 },
    resultB: { label: "끝까지 보유", pct: 62 },
    participants: "4,920명 참여",
    commentPlaceholder: "상속 vs 증여, 당신의 생각은?",
    comments: [
      { name: "임*숙", time: "방금 전", type: "B", text: "미리 줬다가 효도는커녕 요양원 보내는 자식들 뉴스에 나오잖아요. 쥐고 있어야 대접받아요.", likes: 230 },
      { name: "한*구", time: "40분 전", type: "A", text: "살아있을 때 주는 게 세금도 아끼고, 자식들 필요할 때 도와주는 거죠.", likes: 115 },
      { name: "서*연", time: "3시간 전", type: "B", text: "부모 재산 기대하는 자식은 어차피 효도 안 합니다. 차라리 내가 쓰고 갈래요.", likes: 198 },
    ],
  },
  {
    id: "card-5",
    tag: "Q5. 재테크",
    title: "노후 자금,\n어떻게 굴릴까?",
    image: "https://images.unsplash.com/photo-1501139083538-0139583c61ee?auto=format&fit=crop&w=600&q=80",
    optionA: { label: "마음 편한\n예금/채권", sub: "(수익률 3%)" },
    optionB: { label: "인생은 한방!\n주식/코인", sub: "(수익률 -50%~+200%)" },
    resultA: { label: "안전한 예금", pct: 52 },
    resultB: { label: "공격적 투자", pct: 48 },
    participants: "6,340명 참여",
    commentPlaceholder: "안전 vs 도전, 당신의 투자 성향은?",
    comments: [
      { name: "오*철", time: "10분 전", type: "A", text: "노후 자금으로 주식 하는 건 도박이에요. 3%라도 원금 보장이 최고입니다.", likes: 190 },
      { name: "조*희", time: "2시간 전", type: "B", text: "예금 3%면 물가 오르는 것도 못 따라가요. 일부는 투자해야 돈이 불어납니다.", likes: 175 },
      { name: "김*호", time: "5시간 전", type: "A", text: "코인으로 노후자금 날린 선배 봤어요. 마음의 평화가 수익률보다 중요합니다.", likes: 145 },
    ],
  },
];
