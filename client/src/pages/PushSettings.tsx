import { useState } from "react";

interface PushSettingsProps {
  onBack: () => void;
}

interface ToggleItem {
  id: string;
  label: string;
  desc: string;
  defaultOn: boolean;
}

const pushItems: ToggleItem[] = [
  { id: "reply", label: "내 글에 댓글", desc: "내가 쓴 글에 새 댓글이 달리면 알려드려요", defaultOn: true },
  { id: "like", label: "공감 알림", desc: "내 글에 누군가 공감하면 알려드려요", defaultOn: true },
  { id: "best", label: "BEST 선정 알림", desc: "내 글이 BEST에 선정되면 알려드려요", defaultOn: true },
  { id: "event", label: "이벤트/혜택", desc: "라이나ON 이벤트 및 혜택 소식을 알려드려요", defaultOn: false },
  { id: "balance", label: "밸런스 게임 알림", desc: "새로운 밸런스 게임이 등록되면 알려드려요", defaultOn: true },
];

export default function PushSettings({ onBack }: PushSettingsProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    pushItems.forEach((item) => { init[item.id] = item.defaultOn; });
    return init;
  });

  const toggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-push"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">Push 알림</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-4" style={{ scrollbarWidth: "none" }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {pushItems.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-5 py-4 ${
                  idx < pushItems.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex-1 mr-4">
                  <p className="text-[14px] font-medium text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  className={`w-12 h-7 rounded-full relative transition-colors flex-shrink-0 ${
                    toggles[item.id] ? "bg-[#00B8A9]" : "bg-gray-300"
                  }`}
                  data-testid={`toggle-${item.id}`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      toggles[item.id] ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
