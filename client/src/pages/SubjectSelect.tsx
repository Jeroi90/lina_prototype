interface SubjectSelectProps {
  onClose: () => void;
  onSelect: (type: string, productName?: string) => void;
  onBalanceGame?: () => void;
}

export default function SubjectSelect({ onClose, onSelect, onBalanceGame }: SubjectSelectProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        className="w-full max-w-[480px] mx-auto h-[92%] bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        data-testid="subject-select-modal"
      >
        <div className="flex justify-between items-start px-6 pt-7 pb-4 bg-white sticky top-0 z-10 border-b border-gray-50">
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 leading-tight">
              어떤 이야기를
              <br />
              들려주시겠어요?
            </h2>
            <p className="text-[13px] text-gray-500 mt-2">
              고객님의 소중한 경험이 누군가에게 힘이 됩니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-full"
            data-testid="button-close-select"
          >
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 py-6 space-y-8 bg-gray-50/50 pb-20"
          style={{ scrollbarWidth: "none" }}
        >
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-gray-800 text-[15px]">
                <i className="fa-solid fa-comments text-[#00B8A9] mr-1" /> 라운지에서 소통하기
              </h3>
              <span className="bg-[#00B8A9]/10 text-[#00B8A9] text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            </div>

            <div className="space-y-3">
              <LoungeButton
                icon="fa-scale-balanced"
                iconBg="bg-teal-50"
                iconColor="text-[#00B8A9]"
                borderColor="border-teal-100"
                hoverColor="hover:border-[#00B8A9]"
                title="밸런스 게임"
                titleIcon="fa-scale-balanced"
                desc="돈 vs 젊음? 재미있는 선택의 시간"
                onClick={() => onBalanceGame ? onBalanceGame() : onSelect("lounge")}
                testId="button-balance"
              />
              <LoungeButton
                icon="fa-comments"
                iconBg="bg-orange-50"
                iconColor="text-[#F97316]"
                borderColor="border-orange-100"
                hoverColor="hover:border-[#F97316]"
                title="고민 상담소"
                titleIcon="fa-comments"
                desc='"저만 이런가요?" 익명으로 털어놓기'
                onClick={() => onSelect("lounge")}
                testId="button-worry"
              />
              <LoungeButton
                icon="fa-lightbulb"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-500"
                borderColor="border-indigo-100"
                hoverColor="hover:border-indigo-500"
                title="생활의 지혜"
                titleIcon="fa-lightbulb"
                desc="나만 알기 아까운 꿀팁 공유"
                onClick={() => onSelect("lounge")}
                testId="button-wisdom"
              />
            </div>
          </section>

          <div className="h-px bg-gray-200/70" />

          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-4 bg-[#0055B8] rounded-full" />
              <h3 className="font-bold text-gray-800 text-[15px]">
                나의 보험 계약{" "}
                <span className="text-[#0055B8] text-sm font-normal ml-0.5">2건</span>
              </h3>
            </div>

            <div className="space-y-3">
              <InsuranceCard
                status="유지중"
                name="(무)THE건강한치아보험V"
                date="계약일: 2023.05.12 (가입 2년차)"
                buttonText="가입 후기 쓰기"
                buttonIcon="fa-pen"
                buttonBg="bg-[#F5F9FF]"
                buttonColor="text-[#0055B8]"
                hoverBg="group-hover:bg-[#0055B8]"
                hoverText="group-hover:text-white"
                onClick={() => onSelect("product", "(무)THE건강한치아보험V")}
                testId="button-product-dental"
              />
              <InsuranceCard
                status="유지중"
                name="(무)골라담는간편건강보험(갱신형)"
                date="계약일: 2021.11.20 (가입 4년차)"
                buttonText="가입 후기 쓰기"
                buttonIcon="fa-pen"
                buttonBg="bg-[#F5F9FF]"
                buttonColor="text-[#0055B8]"
                hoverBg="group-hover:bg-[#0055B8]"
                hoverText="group-hover:text-white"
                onClick={() => onSelect("product", "(무)골라담는간편건강보험(갱신형)")}
                testId="button-product-health"
              />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-4 bg-orange-500 rounded-full" />
              <h3 className="font-bold text-gray-800 text-[15px]">
                지급 받은 내역{" "}
                <span className="text-orange-500 text-sm font-normal ml-0.5">2건</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group hover:border-orange-400 relative overflow-hidden">
                <div className="absolute right-0 top-0 bg-orange-100 text-orange-600 text-[9px] font-bold px-2 py-1 rounded-bl-lg">
                  후기 미작성
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-100">
                    지급 완료
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-[16px] mb-1 leading-snug">
                  치주질환(잇몸) 치료 급여금
                </h4>
                <p className="text-[11px] text-gray-400 mb-4">지급일: 2024.12.10 (300,000원)</p>
                <button
                  onClick={() => onSelect("claim", "(무)THE건강한치아보험V")}
                  className="w-full py-2.5 rounded-lg bg-orange-50 text-orange-600 font-bold text-[13px] group-hover:bg-orange-500 group-hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  data-testid="button-claim-dental"
                >
                  <i className="fas fa-file-invoice-dollar text-xs" /> 보상 후기 쓰기
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group hover:border-gray-400">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded">
                    작성 완료
                  </span>
                </div>
                <h4 className="font-bold text-gray-700 text-[16px] mb-1 leading-snug">재해골절 진단금</h4>
                <p className="text-[11px] text-gray-400 mb-4">지급일: 2024.01.15 (500,000원)</p>
                <button className="w-full py-2.5 rounded-lg border border-gray-300 bg-white text-gray-600 font-bold text-[13px] group-hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5">
                  <i className="fas fa-eye text-xs" /> 내가 쓴 글 보기
                </button>
              </div>
            </div>
          </section>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

function LoungeButton({
  icon,
  iconBg,
  iconColor,
  borderColor,
  hoverColor,
  title,
  titleIcon,
  desc,
  onClick,
  testId,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  hoverColor: string;
  title: string;
  titleIcon: string;
  desc: string;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white p-4 rounded-2xl shadow-sm border ${borderColor} flex items-center justify-between ${hoverColor} transition-all group active:scale-[0.98]`}
      data-testid={testId}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center ${iconColor} text-xl flex-shrink-0`}>
          <i className={`fa-solid ${icon}`} />
        </div>
        <div className="text-left">
          <h4 className="font-bold text-gray-900 text-[15px]">
            <i className={`fa-solid ${titleIcon} mr-1`} />
            {title}
          </h4>
          <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <i className={`fa-solid fa-chevron-right text-gray-300 text-xs ${hoverColor.replace("hover:border", "group-hover:text")}`} />
    </button>
  );
}

function InsuranceCard({
  status,
  name,
  date,
  buttonText,
  buttonIcon,
  buttonBg,
  buttonColor,
  hoverBg,
  hoverText,
  onClick,
  testId,
}: {
  status: string;
  name: string;
  date: string;
  buttonText: string;
  buttonIcon: string;
  buttonBg: string;
  buttonColor: string;
  hoverBg: string;
  hoverText: string;
  onClick: () => void;
  testId: string;
}) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group hover:border-blue-400">
      <div className="flex justify-between items-start mb-2">
        <span className="bg-blue-50 text-[#0055B8] text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
          {status}
        </span>
      </div>
      <h4 className="font-bold text-gray-900 text-[16px] mb-1 leading-snug">{name}</h4>
      <p className="text-[11px] text-gray-400 mb-4">{date}</p>
      <button
        onClick={onClick}
        className={`w-full py-2.5 rounded-lg ${buttonBg} ${buttonColor} font-bold text-[13px] ${hoverBg} ${hoverText} transition-colors flex items-center justify-center gap-1.5`}
        data-testid={testId}
      >
        <i className={`fas ${buttonIcon} text-xs`} /> {buttonText}
      </button>
    </div>
  );
}
