import { useState } from "react";
import { type FeedItem } from "@/lib/feedData";
import { useFeedItems, useDeleteFeedItem } from "@/hooks/use-feed";
import { useBalanceGames } from "@/hooks/use-balance-games";
import type { BalanceGame } from "@/lib/balanceGameData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MyReviewsProps {
  onBack: () => void;
  onDetail: (item: FeedItem) => void;
  onBalanceGame: (idx: number) => void;
}

export default function MyReviews({ onBack, onDetail, onBalanceGame }: MyReviewsProps) {
  const [tab, setTab] = useState<"review" | "balance">("review");
  const { data: feedData = [] } = useFeedItems();
  const { data: balanceData = [] } = useBalanceGames();

  const myReviews = feedData
    .filter((item) => item.type === "claim" || item.type === "product")
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-myreviews"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">내가 작성한 리뷰</h1>
          <div className="w-10" />
        </header>

        <div className="flex border-b border-gray-100 bg-white">
          <button
            onClick={() => setTab("review")}
            className={`flex-1 py-3 text-[14px] border-b-2 transition-colors ${
              tab === "review"
                ? "text-gray-900 font-extrabold border-gray-900"
                : "text-gray-400 border-transparent"
            }`}
            data-testid="tab-my-review"
          >
            보상/가입 후기
          </button>
          <button
            onClick={() => setTab("balance")}
            className={`flex-1 py-3 text-[14px] border-b-2 transition-colors ${
              tab === "balance"
                ? "text-gray-900 font-extrabold border-gray-900"
                : "text-gray-400 border-transparent"
            }`}
            data-testid="tab-my-balance"
          >
            밸런스 게임
          </button>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-4" style={{ scrollbarWidth: "none" }}>
          {tab === "review" ? (
            <ReviewTab items={myReviews} onDetail={onDetail} />
          ) : (
            <BalanceTab games={balanceData} onBalanceGame={onBalanceGame} />
          )}
        </main>
      </div>
    </div>
  );
}

function ReviewTab({ items, onDetail }: { items: FeedItem[]; onDetail: (item: FeedItem) => void }) {
  const [deleteTarget, setDeleteTarget] = useState<FeedItem | null>(null);
  const deleteMutation = useDeleteFeedItem();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300 text-3xl">
          <i className="fas fa-pen-nib" />
        </div>
        <p className="text-gray-800 font-bold text-lg mb-1">작성한 글이 없어요</p>
        <p className="text-gray-400 text-sm">첫 번째 이야기를 들려주시겠어요?</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isClaimType = item.type === "claim";
          const borderColor = isClaimType ? "border-orange-100 hover:border-orange-300" : "border-blue-100 hover:border-blue-300";
          const badgeBg = isClaimType ? "bg-orange-50 text-[#F97316] border-orange-100" : "bg-blue-50 text-[#0055B8] border-blue-100";
          const badgeIcon = isClaimType ? "fa-file-invoice-dollar" : "fa-shield-halved";
          const badgeText = isClaimType ? "보상후기" : "가입후기";

          return (
            <article
              key={item.id}
              onClick={() => onDetail(item)}
              className={`bg-white rounded-2xl p-5 border ${borderColor} shadow-sm cursor-pointer active:scale-[0.98] transition-all`}
              data-testid={`my-review-${idx}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`${badgeBg} text-[10px] font-bold px-2 py-0.5 rounded border`}>
                    <i className={`fas ${badgeIcon}`} /> {badgeText}
                  </span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-8 h-8 flex items-center justify-center -mr-2 -mt-2 text-gray-300 rounded-full hover:bg-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-ellipsis-v text-sm" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[120px]">
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item);
                      }}
                    >
                      <i className="fas fa-trash-can mr-2 text-[12px]" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-snug line-clamp-1">{item.title}</h3>
              <p className="text-gray-600 text-[13px] line-clamp-2 leading-relaxed">{item.desc}</p>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                {item.prodName && (
                  <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                    <i className="fas fa-gift text-gray-300" /> {item.prodName}
                  </span>
                )}
                <div className="flex gap-2 text-[11px] text-gray-400 ml-auto">
                  <span><i className="far fa-heart" /> {item.likes}</span>
                  <span><i className="far fa-comment-dots" /> {item.comments}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-[320px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">리뷰 삭제</DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500">
              "{deleteTarget?.title}"을(를) 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
                }
              }}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BalanceTab({ games, onBalanceGame }: { games: BalanceGame[]; onBalanceGame: (idx: number) => void }) {
  return (
    <div className="space-y-3">
      {games.map((game, idx) => (
        <div
          key={game.id}
          onClick={() => onBalanceGame(idx)}
          className="bg-white rounded-2xl overflow-hidden border border-teal-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-teal-300"
          data-testid={`my-balance-${idx}`}
        >
          <div className="h-[100px] relative">
            <img src={game.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end pb-3 px-4">
              <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow-md whitespace-pre-line">{game.title}</h3>
            </div>
            <div className="absolute top-2 left-3 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[9px] font-bold border border-white/30">
              {game.tag}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="font-bold text-[#00B8A9]">A. {game.optionA.label.split("\n")[0]}</span>
              <span className="text-gray-300 font-black text-[10px]">VS</span>
              <span className="font-bold text-[#F97316]">B. {game.optionB.label.split("\n")[0]}</span>
            </div>
            <span className="text-[10px] text-gray-400">{game.participants}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
