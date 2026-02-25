import { useQuery } from "@tanstack/react-query";

interface MyPageProps {
  onBack: () => void;
  onMyReviews: () => void;
  onPush: () => void;
  onPolicy: () => void;
  onTerms: () => void;
}

const menuItems = [
  { id: "reviews", icon: "fa-pen-to-square", label: "내가 작성한 리뷰", color: "text-[#0055B8]", bg: "bg-blue-50" },
  { id: "push", icon: "fa-bell", label: "Push 알림", color: "text-[#F97316]", bg: "bg-orange-50" },
  { id: "policy", icon: "fa-shield-halved", label: "라이나ON 서비스 운영정책", color: "text-[#00B8A9]", bg: "bg-teal-50" },
  { id: "terms", icon: "fa-file-lines", label: "이용약관", color: "text-gray-600", bg: "bg-gray-100" },
];

export default function MyPage({ onBack, onMyReviews, onPush, onPolicy, onTerms }: MyPageProps) {
  const { data: stats } = useQuery<{ posts: number; likes: number; pending: number }>({
    queryKey: ["/api/user/stats"],
  });

  const handlers: Record<string, () => void> = {
    reviews: onMyReviews,
    push: onPush,
    policy: onPolicy,
    terms: onTerms,
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-my"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">나의 이야기</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA]" style={{ scrollbarWidth: "none" }}>
          <section className="bg-white px-5 py-6 mb-2 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                  className="w-16 h-16 rounded-full border border-gray-100 bg-gray-50 object-cover"
                  alt="avatar"
                />
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center border-2 border-white">
                  <i className="fas fa-camera text-[10px]" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900" data-testid="text-my-name">박*윤 님</h2>
                <div className="flex gap-3 text-[12px] text-gray-500 mt-1">
                  <span>작성글 <b className="text-[#0055B8]">{stats?.posts ?? "-"}</b></span>
                  <span className="w-px h-3 bg-gray-300 mt-1" />
                  <span>받은 공감 <b className="text-[#F97316]">{stats?.likes ?? "-"}</b></span>
                </div>
              </div>
            </div>
          </section>

          {/* 작성 대기 중인 이야기 */}
          {stats && stats.pending > 0 && (
            <section className="px-4 pt-4 pb-2">
              <div className="bg-orange-50 rounded-2xl border border-orange-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F97316] flex-shrink-0">
                  <i className="fas fa-clock text-sm" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-bold text-gray-900">작성 대기 중인 이야기</h3>
                  <p className="text-[11px] text-gray-500">심사 대기 중 <b className="text-[#F97316]">{stats.pending}건</b></p>
                </div>
                <i className="fas fa-chevron-right text-[10px] text-gray-300" />
              </div>
            </section>
          )}

          <section className="px-4 py-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {menuItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={handlers[item.id]}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left active:bg-gray-50 transition-colors ${
                    idx < menuItems.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                  data-testid={`menu-${item.id}`}
                >
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color} flex-shrink-0`}>
                    <i className={`fas ${item.icon} text-sm`} />
                  </div>
                  <span className="flex-1 text-[14px] font-medium text-gray-900">{item.label}</span>
                  <i className="fas fa-chevron-right text-[10px] text-gray-300" />
                </button>
              ))}
            </div>
          </section>

          <div className="px-4 py-6 text-center text-[11px] text-gray-400">
            <p>라이나ON v1.0.0</p>
          </div>
        </main>
      </div>
    </div>
  );
}
