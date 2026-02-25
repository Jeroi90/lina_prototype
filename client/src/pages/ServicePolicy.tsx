interface ServicePolicyProps {
  onBack: () => void;
}

const sections = [
  {
    title: "1. 서비스 목적",
    content: "라이나ON은 라이나생명 고객님들이 보험 가입 및 보상 경험을 공유하고, 다양한 커뮤니티 활동을 통해 서로 소통할 수 있는 공간입니다.",
  },
  {
    title: "2. 게시글 운영 원칙",
    items: [
      "타인을 비방하거나 명예를 훼손하는 내용은 사전 고지 없이 삭제될 수 있습니다.",
      "허위 사실 유포, 광고성 게시글은 운영정책에 따라 제재됩니다.",
      "개인정보(실명, 연락처, 계좌번호 등)가 포함된 글은 자동으로 마스킹 처리됩니다.",
      "보험금 청구 관련 후기는 사실 확인 절차를 거친 후 게시됩니다.",
    ],
  },
  {
    title: "3. 회원 제재 기준",
    items: [
      "1차 위반: 경고 알림 발송",
      "2차 위반: 7일 게시 제한",
      "3차 위반: 30일 서비스 이용 제한",
      "중대 위반: 영구 이용 정지 및 법적 조치",
    ],
  },
  {
    title: "4. 콘텐츠 저작권",
    content: "회원이 작성한 게시글의 저작권은 작성자에게 있으며, 라이나ON은 서비스 내에서의 노출 및 홍보 목적으로 활용할 수 있습니다.",
  },
  {
    title: "5. 서비스 변경 및 중단",
    content: "라이나ON은 서비스 품질 향상을 위해 사전 고지 후 서비스 내용을 변경하거나 일시적으로 중단할 수 있습니다.",
  },
];

export default function ServicePolicy({ onBack }: ServicePolicyProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-policy"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">서비스 운영정책</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-4" style={{ scrollbarWidth: "none" }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
            <div className="text-center pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-[16px]">라이나ON 서비스 운영정책</h2>
              <p className="text-[11px] text-gray-400 mt-1">최종 수정일: 2025.01.01</p>
            </div>
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900 text-[14px] mb-2">{section.title}</h3>
                {section.content && (
                  <p className="text-[13px] text-gray-600 leading-relaxed">{section.content}</p>
                )}
                {section.items && (
                  <ul className="space-y-1.5 ml-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-[13px] text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-gray-300 flex-shrink-0">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
