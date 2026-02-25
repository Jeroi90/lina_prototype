interface TermsProps {
  onBack: () => void;
}

const sections = [
  {
    title: "제1조 (목적)",
    content: "이 약관은 라이나생명보험(주)(이하 \"회사\")가 운영하는 라이나ON 서비스(이하 \"서비스\")의 이용조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항 등을 규정함을 목적으로 합니다.",
  },
  {
    title: "제2조 (용어의 정의)",
    items: [
      "\"서비스\"란 회사가 제공하는 보험 후기 커뮤니티 서비스를 말합니다.",
      "\"이용자\"란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 고객을 말합니다.",
      "\"게시물\"이란 이용자가 서비스에 게시한 글, 사진, 댓글 등 일체의 정보를 말합니다.",
    ],
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    items: [
      "이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.",
      "회사는 관련 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.",
      "변경된 약관은 공지한 날로부터 7일 후부터 효력이 발생합니다.",
    ],
  },
  {
    title: "제4조 (서비스의 제공)",
    items: [
      "보험 가입 및 보상 후기 작성/조회",
      "밸런스 게임 참여",
      "커뮤니티 소통 (댓글, 공감)",
      "Push 알림 서비스",
    ],
  },
  {
    title: "제5조 (이용자의 의무)",
    items: [
      "이용자는 서비스 이용 시 관계법령, 이 약관의 규정, 이용안내 등을 준수하여야 합니다.",
      "이용자는 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 하여서는 안 됩니다.",
      "이용자는 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 상업적으로 이용하여서는 안 됩니다.",
    ],
  },
  {
    title: "제6조 (개인정보 보호)",
    content: "회사는 이용자의 개인정보를 보호하기 위하여 관련 법령이 정하는 바에 따라 개인정보처리방침을 수립하여 공시합니다.",
  },
];

export default function Terms({ onBack }: TermsProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100 flex items-center justify-between px-4 h-14">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-full"
            onClick={onBack}
            data-testid="button-back-terms"
          >
            <i className="fas fa-arrow-left text-lg" />
          </button>
          <h1 className="text-[16px] font-bold text-gray-900">이용약관</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] px-4 py-4" style={{ scrollbarWidth: "none" }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
            <div className="text-center pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-[16px]">라이나ON 이용약관</h2>
              <p className="text-[11px] text-gray-400 mt-1">시행일: 2025.01.01</p>
            </div>
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900 text-[14px] mb-2">{section.title}</h3>
                {section.content && (
                  <p className="text-[13px] text-gray-600 leading-relaxed">{section.content}</p>
                )}
                {section.items && (
                  <ol className="space-y-1.5 ml-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-[13px] text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
