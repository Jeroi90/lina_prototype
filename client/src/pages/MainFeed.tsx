import { useState, useEffect, useRef, useCallback } from "react";
import { type FeedItem, initFeedData, getFeedData, chipsConfig } from "@/lib/feedData";
import { balanceGames } from "@/lib/balanceGameData";

interface MainFeedProps {
  onWrite: () => void;
  onDetail: (item: FeedItem) => void;
  onBalanceGame: (activeIdx: number) => void;
  onBestAll?: () => void;
  onMyPage?: () => void;
}

function BannerSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const banners = [
    {
      gradient: "from-[#F97316] to-[#F59E0B]",
      icon: "fa-gift",
      tag: "Monthly Event",
      alertMsg: "우수후기 이벤트 페이지로 이동",
      btnText: "이벤트 참여하기",
      btnColor: "text-[#F97316]",
      render: () => (
        <h2 className="font-bold text-xl leading-snug mb-1">
          매월 쏟아지는 행운!<br />
          보험금 지급 경험 나누고<br />
          <span className="text-yellow-200">배민 / 커피쿠폰</span> 받자
        </h2>
      ),
    },
    {
      gradient: "from-[#4A7C59] to-[#8B6914]",
      icon: "fa-leaf",
      tag: "Healing Camp",
      alertMsg: "바랑재 오프라인 행사 페이지로 이동",
      btnText: "신청하러 가기",
      btnColor: "text-[#4A7C59]",
      render: () => (
        <h2 className="font-bold text-xl leading-snug mb-1">
          한옥 호텔 '바랑재' - 나를 돌보는 하루<br />
          암/심뇌질환 환우 가족을 위한<br />
          <span className="text-green-200">특별한 치유 여행</span>
        </h2>
      ),
    },
    {
      gradient: "from-teal-600 to-purple-600",
      icon: "fa-scale-balanced",
      tag: "Balance Game",
      alertMsg: "밸런스 게임 페이지로 이동",
      btnText: "투표하러 가기",
      btnColor: "text-teal-600",
      render: () => (
        <h2 className="font-bold text-xl leading-snug mb-1">
          이건 진짜 못 고르겠다!<br />
          4050의 뜨거운 논쟁<br />
          <span className="text-teal-200">지금 참여하기</span>
        </h2>
      ),
    },
    {
      gradient: "from-blue-600 to-indigo-600",
      icon: "fa-tooth",
      tag: "Dental Map",
      alertMsg: "우리 동네 치과 지도 페이지로 이동",
      btnText: "내 주변 치과 찾기",
      btnColor: "text-blue-600",
      render: () => (
        <h2 className="font-bold text-xl leading-snug mb-1">
          우리 동네 '임플란트' 얼마일까?<br />
          라이나 데이터로 만든<br />
          <span className="text-blue-200">투명한 가격 지도</span>
        </h2>
      ),
    },
  ];

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onScroll = () => {
      const gapW = 12;
      const cardW = el.querySelector<HTMLElement>('.snap-start')?.offsetWidth || 300;
      const scrollPos = el.scrollLeft;
      const idx = Math.round(scrollPos / (cardW + gapW));
      setActiveIdx(Math.max(0, Math.min(idx, banners.length - 1)));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative bg-white pt-5 pb-2 overflow-hidden">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-3 snap-x px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch", scrollPaddingLeft: "16px", scrollPaddingRight: "16px" }}
        data-testid="banner-slider"
      >
        {banners.map((b, i) => (
          <div
            key={i}
            className={`snap-start flex-shrink-0 w-[82%] rounded-2xl bg-gradient-to-br ${b.gradient} p-6 text-white relative overflow-hidden shadow-lg flex flex-col justify-center`}
            style={{ minHeight: "170px" }}
          >
            <div className="absolute right-[-15px] bottom-[-15px] opacity-10 text-[100px]">
              <i className={`fa-solid ${b.icon}`} />
            </div>
            <span className="inline-block px-2.5 py-1 bg-white/20 rounded-md text-[10px] font-bold w-fit mb-2.5 backdrop-blur-sm tracking-wide">
              {b.tag}
            </span>
            {b.render()}
            <button
              onClick={() => alert(b.alertMsg)}
              className={`mt-3 bg-white ${b.btnColor} text-xs font-bold py-2 px-4 rounded-full w-fit shadow-sm active:scale-[0.97] transition-transform`}
              data-testid={`button-banner-${i}`}
            >
              {b.btnText} <i className="fa-solid fa-chevron-right ml-1" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-3" data-testid="banner-indicators">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeIdx ? "w-5 h-1.5 bg-[#F97316]" : "w-1.5 h-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function BestSection({ onBestAll, onDetail }: { onBestAll?: () => void; onDetail: (item: FeedItem) => void }) {
  const items = getFeedData()
    .filter((item) => item.type === "claim" || item.type === "product")
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <section className="py-4 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-bold text-gray-900 text-[15px]" data-testid="text-best-title">
          <i className="fa-solid fa-fire text-orange-500 mr-1" /> 지금 가장 공감받는 후기
        </h2>
        <button
          onClick={onBestAll}
          className="text-[12px] text-[#0055B8] font-medium flex items-center gap-0.5"
          data-testid="button-best-all"
        >
          전체 보기 <i className="fas fa-chevron-right text-[9px]" />
        </button>
      </div>
      <div
        className="flex overflow-x-auto gap-3 px-5 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onDetail(item)}
            className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#0055B8] transition-colors"
            data-testid={`card-best-${item.id}`}
          >
            <div className="flex items-center gap-1 mb-2">
              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">BEST</span>
              <span className="text-[10px] text-gray-400">
                <i className="fa-solid fa-fire text-orange-400 mr-0.5" />
                {item.likes.toLocaleString()}명이 공감
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{item.title}</h3>
            <p className="text-gray-500 text-xs line-clamp-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BalanceSection({ onBalanceGame }: { onBalanceGame: (idx: number) => void }) {
  return (
    <section className="py-5 bg-teal-50/50 border-b border-gray-100">
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-[15px] flex items-center gap-2">
          <i className="fa-solid fa-scale-balanced text-[#00B8A9]" /> 밸런스 게임
        </h2>
      </div>
      <div className="flex overflow-x-auto gap-3 px-5 snap-x pb-2" style={{ scrollbarWidth: "none" }}>
        {balanceGames.map((g, i) => (
          <div
            key={g.id}
            onClick={() => onBalanceGame(i)}
            className="flex-shrink-0 w-[280px] snap-center rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.97] transition-transform bg-white"
            data-testid={`card-balance-${i}`}
          >
            <div className="h-[130px] bg-gray-50 relative">
              <img src={g.image} alt="" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                <h3 className="text-white text-lg font-black px-4 leading-tight drop-shadow-md text-center whitespace-pre-line">{g.title}</h3>
              </div>
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[9px] font-bold border border-white/30">{g.tag}</div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-[#00B8A9] text-[13px]">A. {g.optionA.label.split("\n")[0]}</span>
                <span className="text-gray-300 font-black text-[10px]">VS</span>
                <span className="font-bold text-[#F97316] text-[13px]">B. {g.optionB.label.split("\n")[0]}</span>
              </div>
              <div className="text-center text-[10px] text-gray-400 font-medium">{g.participants}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeedCard({ item, onClick }: { item: FeedItem; onClick: () => void }) {
  let headerIcon: string, headerText: string, headerColor: string, headerBg: string;

  if (item.type === "claim") {
    headerIcon = "fa-file-invoice-dollar";
    headerText = "보상후기";
    headerColor = "text-[#F97316]";
    headerBg = "bg-orange-50";
  } else if (item.type === "product") {
    headerIcon = "fa-shield-halved";
    headerText = "상품리뷰";
    headerColor = "text-[#0055B8]";
    headerBg = "bg-blue-50";
  } else {
    headerIcon = item.cat === "balance" ? "fa-scale-balanced" : item.cat === "tips" ? "fa-lightbulb" : "fa-comments";
    headerText = item.cat === "balance" ? "밸런스게임" : item.cat === "tips" ? "생활지혜" : "고민상담";
    headerColor = "text-[#00B8A9]";
    headerBg = "bg-[#E6FFFA]";
  }

  return (
    <article
      className="bg-white p-5 border-b border-gray-100 last:border-0 shadow-sm animate-[fadeIn_0.5s_ease-out] cursor-pointer active:bg-gray-50 transition-colors"
      onClick={onClick}
      data-testid={`card-feed-${item.id}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${headerBg} ${headerColor} text-[10px] font-bold`}>
          <i className={`fa-solid ${headerIcon}`} /> {headerText}
        </span>
        {item.type === "lounge" ? (
          <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.badge}</span>
        ) : (
          <div className="flex text-yellow-400 text-xs gap-0.5">
            {Array.from({ length: item.star }).map((_, i) => (
              <i key={i} className="fa-solid fa-star" />
            ))}
          </div>
        )}
      </div>
      {item.prodName && (
        <div className="text-[11px] text-gray-400 mb-1 flex items-center gap-1">
          <i className="fa-solid fa-gift" /> {item.prodName}
        </div>
      )}
      {item.type !== "lounge" && (
        <div className="text-[11px] text-gray-400 mb-1 font-medium tracking-tight">{item.badge}</div>
      )}
      <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-snug line-clamp-1">{item.title}</h3>
      <p className="text-gray-600 text-[13px] leading-relaxed line-clamp-2 mb-3">{item.desc}</p>
      <div className="flex items-center justify-between text-gray-400 text-[11px] pt-3 border-t border-gray-50">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <i className="fa-regular fa-heart" /> {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-regular fa-comment-dots" /> {item.comments}
          </span>
        </div>
        <span className="text-gray-300">{item.date}</span>
      </div>
    </article>
  );
}

export default function MainFeed({ onWrite, onDetail, onBalanceGame, onBestAll, onMyPage }: MainFeedProps) {
  const [currentTab, setCurrentTab] = useState("recommend");
  const [currentCat, setCurrentCat] = useState("all");
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    initFeedData();
    setRefreshKey((k) => k + 1);
  }, []);

  const tabs = [
    { id: "recommend", label: "추천" },
    { id: "claim", label: "보상후기" },
    { id: "product", label: "상품리뷰" },
    { id: "lounge", label: "라운지" },
  ];

  const switchTab = useCallback((tab: string) => {
    setCurrentTab(tab);
    setCurrentCat("all");
  }, []);

  const getFiltered = useCallback(() => {
    const data = getFeedData();
    if (currentTab === "recommend") {
      if (currentCat === "all") {
        return data.slice().sort((a, b) => b.likes - a.likes).slice(0, 10);
      }
      return data.filter((item) => item.tags.includes(currentCat) || item.cat === currentCat);
    }
    let filtered = data.filter((item) => item.type === currentTab);
    if (currentCat !== "all") {
      filtered = filtered.filter((item) => item.cat === currentCat || item.tags.includes(currentCat));
    }
    return filtered;
  }, [currentTab, currentCat]);

  const filtered = getFiltered();
  const chips = chipsConfig[currentTab] || [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="h-14 px-5 flex items-center justify-between bg-white/95 backdrop-blur-md z-30 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-[#0055B8] font-bold text-xl tracking-tight" data-testid="text-logo">Story</span>
        </div>
        <div className="flex items-center gap-4 text-gray-700">
          <button aria-label="Search" data-testid="button-search">
            <i className="fa-solid fa-magnifying-glass text-lg" />
          </button>
          <button aria-label="Profile" data-testid="button-profile" onClick={onMyPage}>
            <i className="fa-regular fa-user text-lg" />
          </button>
        </div>
      </header>

      <BannerSlider />
      <BestSection onBestAll={onBestAll} onDetail={onDetail} />
      <BalanceSection onBalanceGame={onBalanceGame} />

      <div className="sticky top-14 bg-white z-30 shadow-sm transition-all duration-300">
        <div className="flex border-b border-gray-100" data-testid="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex-1 py-3 text-[14px] transition-colors border-b-2 ${
                currentTab === tab.id
                  ? "text-gray-900 font-extrabold border-gray-900"
                  : "text-gray-400 border-transparent"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto bg-white" style={{ scrollbarWidth: "none" }}>
          {chips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setCurrentCat(chip.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                currentCat === chip.id
                  ? "bg-gray-800 text-white border-gray-800 font-bold"
                  : "bg-white border-gray-200 text-gray-500"
              }`}
              data-testid={`chip-${chip.id}`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 bg-[#F8F9FA] pb-24 min-h-[400px]" data-testid="feed-container">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">조건에 맞는 이야기가 없습니다.</div>
        ) : (
          filtered.map((item) => (
            <FeedCard key={item.id} item={item} onClick={() => onDetail(item)} />
          ))
        )}
      </main>

      <div className="fixed bottom-6 w-full max-w-[480px] pointer-events-none z-20 flex justify-end pr-5">
        <button
          onClick={onWrite}
          className="pointer-events-auto flex items-center gap-2 bg-[#0055B8] hover:bg-[#003E85] text-white px-5 py-3.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 group"
          data-testid="button-write"
        >
          <i className="fa-solid fa-pen-to-square text-lg group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-sm">이야기 쓰기</span>
        </button>
      </div>
    </div>
  );
}
