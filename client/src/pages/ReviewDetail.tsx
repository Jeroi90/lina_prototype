import { useState } from "react";
import { useFeedItem, useLikeFeedItem, useFeedComments, useAddFeedComment } from "@/hooks/use-feed";
import type { FeedCommentAPI } from "@/hooks/use-feed";

interface ReviewDetailProps {
  itemId: number;
  onBack: () => void;
}

export default function ReviewDetail({ itemId, onBack }: ReviewDetailProps) {
  const { data: item, isLoading } = useFeedItem(itemId);
  const { data: comments = [] } = useFeedComments(itemId);
  const likeMutation = useLikeFeedItem();
  const addCommentMutation = useAddFeedComment();
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (!isLiked && item) {
      setIsLiked(true);
      likeMutation.mutate(item.id);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: item?.title, text: item?.desc, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate(
      { feedItemId: itemId, text: commentText.trim() },
      { onSuccess: () => setCommentText("") },
    );
  };

  if (isLoading || !item) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-[fadeIn_0.3s_ease-out]">
        <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
          <header className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-100 flex items-center justify-between px-4 h-14">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full">
              <i className="fas fa-arrow-left text-lg" />
            </button>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-10" />
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  let headerIcon: string, headerText: string, headerColor: string;
  if (item.type === "claim") {
    headerIcon = "fa-file-invoice-dollar";
    headerText = "회복 이야기";
    headerColor = "text-[#F97316]";
  } else if (item.type === "product") {
    headerIcon = "fa-shield-halved";
    headerText = "상품 리뷰";
    headerColor = "text-[#0055B8]";
  } else {
    headerIcon = "fa-comments";
    headerText = "라운지";
    headerColor = "text-[#00B8A9]";
  }

  const likeCount = item.likes + (isLiked ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
            data-testid="button-back-detail"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900" data-testid="text-detail-title">
            {headerText}
          </h1>
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
            data-testid="button-share"
          >
            <i className="fas fa-share-nodes text-lg" />
          </button>
        </header>

        <main className="overflow-y-auto pb-32" style={{ scrollbarWidth: "none" }}>
          <section className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                  <i className="fas fa-user" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-[14px] font-bold text-gray-900">{item.author} 님</h2>
                    <span className="text-[11px] text-gray-400">· {item.badge}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{item.date} 작성</span>
                </div>
              </div>
              {item.star > 0 && (
                <div className="flex flex-col items-end">
                  <div className="flex text-yellow-400 text-sm gap-0.5">
                    {Array.from({ length: item.star }).map((_, i) => (
                      <i key={i} className="fas fa-star" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-0.5">
                    {item.star === 5
                      ? "매우 만족"
                      : item.star === 4
                      ? "만족"
                      : item.star === 3
                      ? "보통"
                      : "아쉬움"}
                  </span>
                </div>
              )}
            </div>
          </section>

          {item.prodName && (
            <section className="px-5 mb-6">
              <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center ${headerColor} flex-shrink-0 shadow-sm`}>
                  <i className={`fas ${headerIcon}`} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                    {item.type === "claim" ? "지급 항목" : "가입 상품"}
                  </span>
                  <h3 className="font-bold text-gray-900 text-[14px] mb-1">{item.prodName}</h3>
                  {item.type === "claim" && (
                    <span className="bg-blue-50 text-[#0055B8] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 flex items-center w-fit">
                      <i className="fas fa-bolt mr-1" />
                      24시간 내 지급
                    </span>
                  )}
                </div>
              </div>
            </section>
          )}

          {item.type !== "lounge" && (
            <section className="px-5 mb-6">
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(item.tags) ? item.tags : []).map((tag: string, i: number) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border ${
                      item.type === "claim"
                        ? "bg-orange-50 text-[#F97316] border-orange-100"
                        : "bg-blue-50 text-[#0055B8] border-blue-100"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="h-px bg-gray-100 mx-5 mb-6" />

          <section className="px-5 text-[15px] text-gray-800 leading-[1.7] space-y-8 animate-[fadeIn_0.4s_ease-out]">
            <div>
              <h4 className="font-bold text-gray-900 text-[17px] mb-4 leading-snug">{item.title}</h4>
              <p className="text-gray-700 leading-[1.8] text-[15px] whitespace-pre-line">{item.desc}</p>
              {item.type === "claim" && (
                <p className="text-gray-600 leading-[1.8] text-[15px] mt-4">
                  치료 과정에서 보험금 청구를 진행했고, 덕분에 비용 부담을 줄일 수 있었습니다. 라이나 가족들에게도 도움이 되길 바랍니다.
                </p>
              )}
              {item.type === "product" && (
                <p className="text-gray-600 leading-[1.8] text-[15px] mt-4">
                  가입 후 보장 내용에 대해 꼼꼼하게 설명 들었고, 실제로 청구 과정도 간단해서 매우 만족하고 있습니다. 주변에도 적극 추천하고 있어요.
                </p>
              )}
              {item.type === "lounge" && (
                <p className="text-gray-600 leading-[1.8] text-[15px] mt-4">
                  여러분의 의견이 궁금합니다. 댓글로 자유롭게 이야기 나눠주세요!
                </p>
              )}
            </div>
          </section>

          <section className="px-5 py-8 pb-4 flex justify-center">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full border font-bold text-[14px] transition-all hover:bg-gray-50 active:scale-95 shadow-sm ${
                isLiked
                  ? "bg-orange-50 border-[#F97316] text-[#F97316]"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
              data-testid="button-like"
            >
              <i
                className={`${isLiked ? "fas" : "far"} fa-heart text-lg transition-transform ${
                  isLiked ? "animate-[pop_0.3s_ease]" : ""
                }`}
              />
              도움이 되었어요 <span data-testid="text-like-count">{likeCount}</span>
            </button>
          </section>

          {item.type === "claim" && (
            <section className="px-5 mt-4 mb-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-teal-50 text-teal-600 text-[9px] font-bold px-3 py-1 rounded-bl-lg border-l border-b border-teal-100">
                  다녀온 병원
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 text-xl flex-shrink-0">
                    <i className="fas fa-hospital-alt" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">신촌세브란스병원</h4>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                      <span>서울 서대문구</span>
                      <span className="w-px h-2 bg-gray-300 mx-1" />
                      <span className="text-teal-600 font-bold">
                        <i className="fas fa-bolt mr-1" />
                        서류제로 병원
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex text-yellow-400 text-xs">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i key={i} className="fas fa-star" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 ml-1">5.0</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-[12px] text-gray-600 leading-snug">
                  "대기 시간은 좀 길었지만 의료진분들이 너무 친절하게 설명해 주셔서 안심이 되었습니다."
                </div>
              </div>
            </section>
          )}

          {/* Comments Section */}
          <section className="px-5 mt-4 mb-6">
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4">
                댓글 <span className="text-[#0055B8]">{comments.length}</span>
              </h3>

              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-[13px]">
                  <i className="far fa-comment-dots text-2xl mb-2 block" />
                  첫 번째 댓글을 남겨보세요!
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {comments.map((c: FeedCommentAPI) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <i className="fas fa-user text-[10px]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-bold text-gray-800">{c.author}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-600 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Comment input + CTA */}
        <div className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {item.type === "claim" && (
            <div className="px-4 pt-3">
              <button className="w-full py-3 rounded-xl bg-[#F97316] text-white font-bold text-[14px] shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]" data-testid="button-check-product">
                <i className="fas fa-shield-halved" /> 이 고객이 가입한 상품 확인하기
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-3 pb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="댓글을 입력해주세요..."
              className="flex-1 h-10 px-4 bg-gray-100 rounded-full text-[13px] outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              data-testid="input-comment"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim() || addCommentMutation.isPending}
              className="h-10 px-4 bg-[#0055B8] text-white rounded-full text-[13px] font-bold disabled:opacity-40 transition-all active:scale-95"
              data-testid="button-submit-comment"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
