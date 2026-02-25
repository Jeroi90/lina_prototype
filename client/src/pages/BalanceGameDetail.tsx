import { useState, useRef, useEffect, useCallback } from "react";
import { balanceGames, type BalanceComment } from "@/lib/balanceGameData";

interface BalanceGameDetailProps {
  initialCardIdx: number;
  onBack: () => void;
}

export default function BalanceGameDetail({ initialCardIdx, onBack }: BalanceGameDetailProps) {
  const [activeIdx, setActiveIdx] = useState(initialCardIdx);
  const [flippedCards, setFlippedCards] = useState<Record<string, "A" | "B">>({});
  const [localComments, setLocalComments] = useState<Record<string, BalanceComment[]>>(() => {
    const init: Record<string, BalanceComment[]> = {};
    balanceGames.forEach((g) => { init[g.id] = [...g.comments]; });
    return init;
  });
  const [sortMode, setSortMode] = useState<"latest" | "popular">("latest");
  const [filterMode, setFilterMode] = useState<"all" | "A" | "B">("all");
  const [commentText, setCommentText] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);
  const scrolling = useRef(false);

  const game = balanceGames[activeIdx];

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(".card-wrapper")?.clientWidth || 340;
    const gap = 16;
    const scrollTarget = activeIdx * (cardWidth + gap);
    el.scrollTo({ left: scrollTarget, behavior: "instant" });
  }, []);

  const handleSliderScroll = useCallback(() => {
    if (scrolling.current) return;
    const el = sliderRef.current;
    if (!el) return;
    const cardEl = el.querySelector(".card-wrapper") as HTMLElement;
    if (!cardEl) return;
    const cardWidth = cardEl.offsetWidth;
    const gap = 16;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    const clamped = Math.max(0, Math.min(idx, balanceGames.length - 1));
    if (clamped !== activeIdx) {
      setActiveIdx(clamped);
      setSortMode("latest");
      setFilterMode("all");
      setCommentText("");
    }
  }, [activeIdx]);

  const vote = useCallback((cardId: string, choice: "A" | "B") => {
    if (flippedCards[cardId]) return;
    setFlippedCards((prev) => ({ ...prev, [cardId]: choice }));
  }, [flippedCards]);

  const submitComment = useCallback(() => {
    if (!commentText.trim()) return;
    const cardId = game.id;
    const newComment: BalanceComment = {
      name: "나",
      time: "방금 전",
      type: flippedCards[cardId] || "B",
      text: commentText.trim(),
      likes: 0,
      isNew: true,
    };
    setLocalComments((prev) => ({
      ...prev,
      [cardId]: [newComment, ...(prev[cardId] || [])],
    }));
    setCommentText("");
    if (sortMode === "popular") setSortMode("latest");
  }, [commentText, game.id, flippedCards, sortMode]);

  const getFilteredComments = useCallback(() => {
    let list = [...(localComments[game.id] || [])];
    if (filterMode !== "all") list = list.filter((c) => c.type === filterMode);
    if (sortMode === "popular") list.sort((a, b) => b.likes - a.likes);
    return list;
  }, [localComments, game.id, filterMode, sortMode]);

  const comments = getFilteredComments();

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-balance"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">밸런스 게임</h1>
          <button className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full">
            <i className="fas fa-share-nodes text-lg" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] relative flex flex-col" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 pt-6 pb-2 text-center flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-[11px] font-bold rounded-full mb-2">
              <i className="fas fa-check-double text-[#00B8A9] mr-1" /> 나의 속마음 알아보기
            </span>
          </div>

          <section className="relative w-full py-4 overflow-hidden flex-shrink-0">
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              className="flex gap-4 overflow-x-auto px-8 pb-8 pt-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {balanceGames.map((g, i) => {
                const isFlipped = !!flippedCards[g.id];
                return (
                  <div
                    key={g.id}
                    className="card-wrapper w-full min-w-[300px] max-w-[340px] h-[480px] snap-center"
                    style={{ perspective: "1000px" }}
                    data-testid={`detail-card-${i}`}
                  >
                    <div
                      className="relative w-full h-full text-center transition-all duration-500"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                      }}
                    >
                      {/* Front */}
                      <div
                        className="absolute w-full h-full rounded-3xl overflow-hidden bg-white flex flex-col border border-gray-100 shadow-xl"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="h-1/2 bg-gray-50 relative">
                          <img src={g.image} alt="" className="w-full h-full object-cover opacity-90" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-6">
                            <h2 className="text-white text-2xl font-black px-4 leading-tight drop-shadow-md whitespace-pre-line">{g.title}</h2>
                          </div>
                          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] font-bold border border-white/30">
                            {g.tag}
                          </div>
                        </div>
                        <div className="h-1/2 p-5 flex flex-col gap-3 justify-center bg-white">
                          <button
                            onClick={() => vote(g.id, "A")}
                            className="flex-1 bg-[#E6FFFA] border-2 border-transparent hover:border-[#00B8A9] rounded-xl flex items-center justify-between px-5 transition-all"
                            data-testid={`vote-a-${i}`}
                          >
                            <span className="font-bold text-[#00B8A9] text-lg text-left whitespace-pre-line">
                              A. {g.optionA.label}
                              {g.optionA.sub && <span className="text-sm font-normal block">{g.optionA.sub}</span>}
                            </span>
                            <i className="far fa-circle text-[#00B8A9] text-xl" />
                          </button>
                          <div className="text-center text-gray-300 font-black text-sm my-[-5px]">VS</div>
                          <button
                            onClick={() => vote(g.id, "B")}
                            className="flex-1 bg-[#FFF7ED] border-2 border-transparent hover:border-[#F97316] rounded-xl flex items-center justify-between px-5 transition-all"
                            data-testid={`vote-b-${i}`}
                          >
                            <span className="font-bold text-[#F97316] text-lg text-left whitespace-pre-line">
                              B. {g.optionB.label}
                              {g.optionB.sub && <span className="text-sm font-normal block">{g.optionB.sub}</span>}
                            </span>
                            <i className="far fa-circle text-[#F97316] text-xl" />
                          </button>
                        </div>
                      </div>

                      {/* Back */}
                      <div
                        className="absolute w-full h-full rounded-3xl overflow-hidden bg-white border border-gray-100 flex flex-col shadow-xl"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        <div className="bg-gray-50 p-6 pb-4 border-b border-gray-100">
                          <h3 className="font-bold text-gray-900 text-lg mb-4 text-left">
                            투표 결과 <span className="text-xs font-normal text-gray-500 ml-1">{g.participants}</span>
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-[#00B8A9]">{g.resultA.label}</span>
                                <span className="text-gray-800">{g.resultA.pct}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <BarFill color="#00B8A9" pct={g.resultA.pct} active={isFlipped} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-[#F97316]">{g.resultB.label}</span>
                                <span className="text-gray-800">{g.resultB.pct}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <BarFill color="#F97316" pct={g.resultB.pct} active={isFlipped} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 p-5 bg-white flex flex-col">
                          <textarea
                            value={activeIdx === i ? commentText : ""}
                            onChange={(e) => { if (activeIdx === i) setCommentText(e.target.value); }}
                            className="w-full flex-1 bg-gray-50 rounded-xl p-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-900 resize-none mb-3"
                            placeholder={g.commentPlaceholder}
                            data-testid={`comment-input-${i}`}
                          />
                          <button
                            onClick={() => { if (activeIdx === i) submitComment(); }}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl active:bg-gray-800 transition-colors"
                            data-testid={`button-submit-comment-${i}`}
                          >
                            의견 등록
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-1.5 mt-[-10px]">
              {balanceGames.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIdx ? "bg-gray-800" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </section>

          <section className="px-5 pb-8 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4 pt-2">
              <div className="flex gap-2 text-xs text-gray-400 items-center">
                <button
                  onClick={() => setSortMode("latest")}
                  className={`transition-colors ${sortMode === "latest" ? "font-bold text-gray-900" : "font-normal text-gray-400"}`}
                  data-testid="sort-latest"
                >
                  최신순
                </button>
                <span className="text-[10px] text-gray-300">|</span>
                <button
                  onClick={() => setSortMode("popular")}
                  className={`transition-colors ${sortMode === "popular" ? "font-bold text-gray-900" : "font-normal text-gray-400"}`}
                  data-testid="sort-popular"
                >
                  인기순
                </button>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium shadow-sm transition-all border ${
                    filterMode === "all"
                      ? "bg-gray-900 text-white border-gray-900 font-bold"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                  data-testid="filter-all"
                >
                  전체
                </button>
                <button
                  onClick={() => setFilterMode("A")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium shadow-sm transition-all border ${
                    filterMode === "A"
                      ? "bg-[#00B8A9] text-white border-[#00B8A9] font-bold"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                  data-testid="filter-a"
                >
                  A 선택
                </button>
                <button
                  onClick={() => setFilterMode("B")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium shadow-sm transition-all border ${
                    filterMode === "B"
                      ? "bg-[#F97316] text-white border-[#F97316] font-bold"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                  data-testid="filter-b"
                >
                  B 선택
                </button>
              </div>
            </div>

            <div className="space-y-3 pb-8">
              {comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">해당하는 의견이 없습니다.</div>
              ) : (
                comments.map((c, ci) => (
                  <div
                    key={ci}
                    className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 ${c.isNew ? "animate-[fadeIn_0.3s_ease-out]" : ""}`}
                    data-testid={`comment-${ci}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${c.name}`}
                        alt="avatar"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-900">{c.name}</span>
                        <span className="text-[10px] text-gray-400">{c.time}</span>
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border mb-1.5 ${
                          c.type === "A"
                            ? "text-[#00B8A9] bg-teal-50 border-teal-100"
                            : "text-[#F97316] bg-orange-50 border-orange-100"
                        }`}
                      >
                        {c.type === "A" ? "A 선택" : "B 선택"}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-400 gap-3">
                        <button className="flex items-center gap-1 transition-colors">
                          <i className="far fa-heart" /> {c.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function BarFill({ color, pct, active }: { color: string; pct: number; active: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setWidth(pct), 300);
      return () => clearTimeout(timer);
    } else {
      setWidth(0);
    }
  }, [active, pct]);

  return (
    <div
      className="h-3 rounded-full transition-[width] duration-1000 ease-out"
      style={{ width: `${width}%`, backgroundColor: color }}
    />
  );
}
