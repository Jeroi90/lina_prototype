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
