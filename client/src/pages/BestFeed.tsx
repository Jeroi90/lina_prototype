import { getFeedData, type FeedItem } from "@/lib/feedData";

interface BestFeedProps {
  onBack: () => void;
  onDetail: (item: FeedItem) => void;
}

export default function BestFeed({ onBack, onDetail }: BestFeedProps) {
  const bestItems = getFeedData()
    .filter((item) => item.type === "claim" || item.type === "product")
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-best"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">BEST 후기</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA]" style={{ scrollbarWidth: "none" }}>
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <i className="fa-solid fa-fire text-orange-500" />
              <span className="font-bold text-gray-900 text-[15px]">지금 가장 공감받는 후기</span>
            </div>
            <p className="text-[12px] text-gray-400">실시간 인기 후기 TOP 10</p>
          </div>

          <div className="px-4 pb-8 space-y-3">
            {bestItems.map((item, idx) => (
              <article
                key={item.id}
                onClick={() => onDetail(item)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform flex gap-4"
                data-testid={`best-item-${idx}`}
              >
                <div className="flex-shrink-0 flex flex-col items-center justify-start pt-1">
                  <span className={`text-lg font-black leading-none ${idx < 3 ? "text-orange-500" : "text-gray-300"}`}>
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="bg-red-50 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded">BEST</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100">
                      보상후기
                    </span>
                    <span className="text-[10px] text-gray-400">
                      <i className="fa-solid fa-fire text-orange-400 mr-0.5" />
                      {item.likes.toLocaleString()}명 공감
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-[14px] mb-1 leading-snug line-clamp-1">{item.title}</h3>
                  <p className="text-gray-500 text-[12px] line-clamp-2 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                    <span>{item.author}</span>
                    <span>{item.date}</span>
                    <span className="flex items-center gap-0.5">
                      <i className="far fa-heart text-[10px]" /> {item.likes}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
