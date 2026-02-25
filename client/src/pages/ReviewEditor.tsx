import { useState, useRef, useCallback, useEffect } from "react";
import { addFeedItem, type FeedItem } from "@/lib/feedData";

interface ReviewEditorProps {
  type: string;
  productName?: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ratingTexts = ["", "많이 아쉬웠어요 😥", "조금 아쉬워요", "보통이에요 🙂", "좋았어요 😊", "최고에요! 👍"];

const positiveChips1 = [
  { emoji: "💸", label: "치료비 부담 해결" },
  { emoji: "💊", label: "약값/검사비 활용" },
  { emoji: "🛒", label: "생활비 보탬" },
  { emoji: "🥣", label: "간병/요양비 사용" },
];
const positiveChips2 = [
  { emoji: "🏥", label: "수술/시술 완료" },
  { emoji: "💉", label: "꾸준한 통원 치료 중" },
  { emoji: "🔍", label: "조기 발견하여 관리" },
  { emoji: "💪", label: "건강하게 회복 완료" },
];
const negativeChips = [
  { emoji: "🐢", label: "지급이 너무 늦어요" },
  { emoji: "📉", label: "금액이 적어요" },
  { emoji: "📄", label: "서류 복잡" },
  { emoji: "🎧", label: "연결 안됨" },
];

const autoTexts = [
  "양치할 때마다 잇몸에서 피가 나고 붓기가 심해서 치과를 가게 되었습니다. 처음엔 대수롭지 않게 여겼는데, 진단 결과 잇몸 염증이 심해 수술이 필요하다는 이야기를 듣고 덜컥 겁이 났습니다.",
  "잇몸 절개 수술을 받고 약 3주간 통원 치료를 꾸준히 받았습니다. 다행히 수술 경과가 좋아서 지금은 통증도 사라지고 식사도 편하게 잘 하고 있습니다. 건강해진 느낌이라 너무 좋아요.",
  "치과 치료비는 비급여 항목이 많아 비용 부담이 컸는데, 청구한 다음 날 바로 입금되어서 정말 놀랐습니다. 덕분에 치료비 걱정 없이 치료에만 전념할 수 있었어요.",
  "치아는 아플 때 바로 가야 합니다. 비용 걱정 때문에 미루지 마시고, 든든한 보험 믿고 얼른 치료받으세요! 건강이 최고입니다.",
];

export default function ReviewEditor({ type, productName, onClose, onSubmit }: ReviewEditorProps) {
  const [rating, setRating] = useState(0);
  const [selectedChips1, setSelectedChips1] = useState<string[]>([]);
  const [selectedChips2, setSelectedChips2] = useState<string[]>([]);
  const [texts, setTexts] = useState(["", "", "", ""]);
  const [showStep2, setShowStep2] = useState(false);
  const [showStep3, setShowStep3] = useState(false);
  const [showHospital, setShowHospital] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [typingIdx, setTypingIdx] = useState<number | null>(null);
  const [eventChecked, setEventChecked] = useState(true);

  const [hospitalToggle, setHospitalToggle] = useState(false);
  const [hospitalRating, setHospitalRating] = useState(0);
  const [hospitalReview, setHospitalReview] = useState("");

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState<boolean | null>(null);
  const [consentSensitive, setConsentSensitive] = useState<boolean | null>(null);
  const [consentMarketing, setConsentMarketing] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [showCareModal, setShowCareModal] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedHospitalTags, setSelectedHospitalTags] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const typingTimerRef = useRef<number | null>(null);
  const termScrollRef = useRef<HTMLDivElement>(null);

  const isNegative = rating > 0 && rating <= 2;
  const currentChips = isNegative ? negativeChips : positiveChips1;
  const mode = rating <= 2 ? "negative" : "positive";

  const hasChips1 = selectedChips1.length > 0;
  const hasChips2 = isNegative || selectedChips2.length > 0;
  const hasTexts = isNegative
    ? texts[0].length >= 10 && texts[1].length >= 10
    : texts[0].length >= 10 && texts[1].length >= 10 && texts[2].length >= 10 && texts[3].length >= 10;
  const hasConsent = consentPrivacy === true && consentSensitive === true;
  const hasTitle = reviewTitle.trim().length >= 2;
  const canSubmit = rating > 0 && hasChips1 && hasChips2 && hasTexts && hasTitle && hasConsent;

  const headerTitle = type === "claim" ? "회복 후기 작성" : type === "product" ? "상품 후기 작성" : "이야기 작성";

  const handleRating = useCallback(
    (score: number) => {
      const prevMode = rating <= 2 ? "negative" : "positive";
      const newMode = score <= 2 ? "negative" : "positive";
      setRating(score);
      if (prevMode !== newMode || rating === 0) {
        setSelectedChips1([]);
        setSelectedChips2([]);
        setTexts(["", "", "", ""]);
        setReviewTitle("");
        setShowStep2(false);
        setShowStep3(false);
        setShowHospital(false);
        setShowConsent(false);
        setHospitalToggle(false);
        setHospitalRating(0);
        setHospitalReview("");
        setSelectedHospitalTags([]);
      }
    },
    [rating]
  );

  const toggleChip = useCallback(
    (chipLabel: string, group: 1 | 2 = 1) => {
      if (group === 1) {
        setSelectedChips1((prev) =>
          prev.includes(chipLabel) ? prev.filter((c) => c !== chipLabel) : [...prev, chipLabel]
        );
        if (!isNegative) {
          setShowStep2(true);
        } else {
          setShowStep3(true);
          setShowConsent(true);
        }
      } else {
        setSelectedChips2((prev) =>
          prev.includes(chipLabel) ? prev.filter((c) => c !== chipLabel) : [...prev, chipLabel]
        );
        setShowStep3(true);
        setShowHospital(true);
        setShowConsent(true);
      }
    },
    [isNegative]
  );

  const startAutoType = useCallback(
    (idx: number) => {
      if (texts[idx].length > 0 || typingIdx !== null) return;
      setTypingIdx(idx);
      const fullText = autoTexts[idx] || autoTexts[0];
      let charIdx = 0;

      const typeChar = () => {
        if (charIdx < fullText.length) {
          charIdx++;
          setTexts((prev) => {
            const updated = [...prev];
            updated[idx] = fullText.slice(0, charIdx);
            return updated;
          });
          typingTimerRef.current = window.setTimeout(typeChar, 15);
        } else {
          setTypingIdx(null);
        }
      };
      typeChar();
    },
    [texts, typingIdx]
  );

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const handleTermScroll = useCallback(() => {
    const el = termScrollRef.current;
    if (!el) return;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setScrollProgress(Math.min(pct, 100));
  }, []);

  const handleSubmit = useCallback(() => {
    if (isNegative) {
      setShowCareModal(true);
      return;
    }

    const catMap: Record<string, string> = {
      "(무)THE건강한치아보험V": "dental",
      "(무)라이나치아사랑보험": "dental",
      "(무)스마일치아보험": "dental",
      "(무)라이나암보험": "cancer",
      "(무)실버암보험": "cancer",
      "(무)집중보장암보험": "cancer",
      "(무)라이나뇌심장보험": "brain",
      "(무)건강한뇌심장보장보험": "brain",
      "(무)전에없던치매보험": "dementia",
    };
    const cat = productName ? (catMap[productName] || "dental") : "dental";

    const chipToTag: Record<string, string> = {
      "치료비 부담 해결": "cost",
      "약값/검사비 활용": "cost",
      "생활비 보탬": "cost",
      "간병/요양비 사용": "cost",
      "수술/시술 완료": "recovery",
      "꾸준한 통원 치료 중": "treatment",
      "조기 발견하여 관리": "early",
      "건강하게 회복 완료": "recovery",
      "지급이 너무 늦어요": "delay",
      "금액이 적어요": "amount",
      "서류 복잡": "docs",
      "연결 안됨": "support",
    };
    const tags = [cat, ...selectedChips1.map((c) => chipToTag[c] || c), ...selectedChips2.map((c) => chipToTag[c] || c)].filter((v, i, a) => a.indexOf(v) === i);

    const newItem: Omit<FeedItem, "id"> = {
      type: type as "claim" | "product" | "lounge",
      cat,
      tags,
      title: reviewTitle.trim(),
      desc: texts[0].slice(0, 80) + (texts[0].length > 80 ? "..." : ""),
      author: "박*윤",
      badge: "방금 작성",
      star: rating,
      likes: 0,
      comments: 0,
      date: "방금 전",
      prodName: productName,
    };

    addFeedItem(newItem);
    alert("소중한 후기가 성공적으로 등록되었습니다!\n참여해 주셔서 감사합니다.");
    onSubmit();
  }, [type, productName, selectedChips1, selectedChips2, texts, rating, isNegative, reviewTitle, onSubmit]);

  const handleCareCallback = useCallback(() => {
    setShowCareModal(false);
    alert("상담 예약 완료");
  }, []);

  const handleCareSkip = useCallback(() => {
    setShowCareModal(false);

    const catMap: Record<string, string> = {
      "(무)THE건강한치아보험V": "dental",
      "(무)라이나치아사랑보험": "dental",
      "(무)스마일치아보험": "dental",
    };
    const cat = productName ? (catMap[productName] || "dental") : "dental";
    const chipToTag: Record<string, string> = {
      "지급이 너무 늦어요": "delay",
      "금액이 적어요": "amount",
      "서류 복잡": "docs",
      "연결 안됨": "support",
    };
    const tags = [cat, ...selectedChips1.map((c) => chipToTag[c] || c)].filter((v, i, a) => a.indexOf(v) === i);

    const newItem: Omit<FeedItem, "id"> = {
      type: type as "claim" | "product" | "lounge",
      cat,
      tags,
      title: reviewTitle.trim(),
      desc: texts[0].slice(0, 80) + (texts[0].length > 80 ? "..." : ""),
      author: "박*윤",
      badge: "방금 작성",
      star: rating,
      likes: 0,
      comments: 0,
      date: "방금 전",
      prodName: productName,
    };

    addFeedItem(newItem);
    alert("등록 완료");
    onSubmit();
  }, [type, productName, selectedChips1, texts, rating, reviewTitle, onSubmit]);

  const confirmConsentModal = useCallback(() => {
    setShowConsentModal(false);
  }, []);

  const textLabels = isNegative
    ? ["구체적으로 어떤 상황이었나요?", "라이나에게 바라는 점?"]
    : ["어디가 아프셨나요?", "치료 과정과 현재 상태는요?", "보험금 지급이 도움이 되셨나요?", "라이나 가족들에게 한마디!"];

  const textPlaceholders = isNegative
    ? ["내용을 입력해주세요.", "내용을 입력해주세요."]
    : [
        "예) 빙판길에서 넘어져 손목을 다쳤어요. / 건강검진 중 용종이 발견되었어요.",
        "예) 수술 후 일주일 정도 입원 치료를 받았고, 지금은 퇴원해서 많이 회복되었습니다.",
        "예) 급하게 목돈이 필요했는데, 청구 다음날 바로 입금되어 병원비 결제에 큰 도움이 됐어요.",
        "예) 아프면 참지 말고 바로 병원에 가세요! 보험이 있으니 정말 든든하네요.",
      ];

  const accentColor = isNegative ? "#DC2626" : "#F97316";
  const modalCanConfirm = consentPrivacy !== null && consentSensitive !== null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full max-w-[480px] mx-auto flex flex-col h-full bg-white shadow-2xl relative">
        <header className="h-14 px-5 flex items-center justify-between border-b border-gray-100 bg-white z-10 sticky top-0">
          <button
            className="w-8 h-8 flex items-center justify-start text-gray-800"
            onClick={onClose}
            data-testid="button-close-editor"
          >
            <i className="fas fa-times text-lg" />
          </button>
          <h1 className="font-bold text-[17px] tracking-tight" data-testid="text-editor-title">
            {headerTitle}
          </h1>
          <div className="w-8" />
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pb-32 bg-[#F8F9FA] scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {type === "claim" && (
            <section className="px-5 py-5 bg-white border-b border-gray-100 mb-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316] flex-shrink-0">
                  <i className="fas fa-file-invoice-dollar text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] text-gray-500 font-bold block mb-0.5 tracking-tight">
                        보험금 지급 항목
                      </span>
                      <h2 className="font-bold text-gray-900 text-[15px] leading-tight mb-1">
                        치주질환(잇몸) 치료 급여금
                      </h2>
                    </div>
                    <span className="bg-blue-50 text-[#0055B8] text-[10px] font-bold px-2 py-1 rounded-md border border-blue-100 flex items-center shadow-sm">
                      <i className="fas fa-bolt mr-1" />
                      24시간 내 지급
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">지급일 2024.12.10</p>
                </div>
              </div>
            </section>
          )}

          <section className="px-5 py-8 bg-white mb-2 text-center animate-[fadeIn_0.5s_ease-out]">
            <label className="block font-bold text-[18px] mb-4 text-gray-900">
              {type === "claim"
                ? "보험금을 지급 받으신 후"
                : type === "product"
                ? "이 상품에 대한"
                : "여러분의"}
              <br />
              기분을 알려주세요.
            </label>
            <div className="flex justify-center gap-3 mb-4" data-testid="star-container">
              {[1, 2, 3, 4, 5].map((s) => (
                <i
                  key={s}
                  onClick={() => handleRating(s)}
                  className={`fa-solid fa-star text-4xl cursor-pointer transition-transform active:scale-90 p-1 ${
                    s <= rating ? "text-yellow-400" : "text-gray-200"
                  }`}
                  data-testid={`star-${s}`}
                />
              ))}
            </div>
            <div className="h-6">
              {rating > 0 && (
                <span
                  className="text-[14px] font-bold transition-all duration-300"
                  style={{ color: accentColor }}
                  data-testid="text-rating"
                >
                  {ratingTexts[rating]}
                </span>
              )}
            </div>
          </section>

          {rating > 0 && (
            <>
              {/* Step 1 - Tags */}
              <section className="px-5 py-6 bg-white mb-2 animate-[fadeIn_0.5s_ease-out]">
                <label className="block font-bold text-[15px] mb-3">
                  <span style={{ color: accentColor }} className="mr-1">
                    Step 1.
                  </span>{" "}
                  {isNegative ? (
                    "어떤 점이 불편하셨나요?"
                  ) : (
                    <>이번 보험금 지급이<br />어떤 도움이 되었나요?</>
                  )}
                  {!isNegative && (
                    <span className="text-gray-400 text-[11px] font-normal ml-1">
                      <br />(여러개 선택할 수 있어요)
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentChips.map((chip) => {
                    const isActive = selectedChips1.includes(chip.label);
                    const activeClass = isNegative
                      ? "bg-red-50 border-red-500 text-red-700 font-bold shadow-sm"
                      : "bg-orange-50 border-[#F97316] text-orange-700 font-bold shadow-sm";
                    return (
                      <button
                        key={chip.label}
                        onClick={() => toggleChip(chip.label, 1)}
                        className={`px-3 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                          isActive ? activeClass : "border-gray-200 bg-white text-gray-600"
                        } ${isNegative && !isActive ? "hover:border-red-300" : ""}`}
                        data-testid={`chip-tag-${chip.label}`}
                      >
                        {chip.emoji} {chip.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Step 2 - Positive only */}
              {!isNegative && showStep2 && (
                <section className="px-5 py-6 bg-white mb-2 animate-[fadeIn_0.5s_ease-out]">
                  <label className="block font-bold text-[15px] mb-3">
                    <span style={{ color: accentColor }} className="mr-1">
                      Step 2.
                    </span>{" "}
                    현재 치료 상황은
                    <br />
                    어떠신가요?
                    <span className="text-gray-400 text-[11px] font-normal ml-1">
                      <br />(여러개 선택할 수 있어요)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {positiveChips2.map((chip) => {
                      const isActive = selectedChips2.includes(chip.label);
                      return (
                        <button
                          key={chip.label}
                          onClick={() => toggleChip(chip.label, 2)}
                          className={`px-3 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                            isActive
                              ? "bg-orange-50 border-[#F97316] text-orange-700 font-bold shadow-sm"
                              : "border-gray-200 bg-white text-gray-600"
                          }`}
                          data-testid={`chip-tag2-${chip.label}`}
                        >
                          {chip.emoji} {chip.label}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Step 3 (or Step 2 for negative) - Text areas */}
              {showStep3 && (
                <section className="px-5 py-6 bg-white mb-2 animate-[fadeIn_0.5s_ease-out]">
                  <h3 className="font-bold text-[16px] mb-1">
                    <span style={{ color: accentColor }} className="mr-1">
                      Step {isNegative ? "2" : "3"}.
                    </span>{" "}
                    {isNegative ? "상세 내용을 남겨주세요" : "이야기를 좀더 자세히 들려주세요"}
                  </h3>
                  <p className="text-[12px] text-gray-400 mb-4">최소 10자 이상 작성해 주세요.</p>

                  {/* Disclaimer - different for positive/negative */}
                  {isNegative ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                      <h4 className="text-[12px] font-bold text-red-700 mb-2">
                        <i className="fas fa-exclamation-triangle" /> 작성 전 확인
                      </h4>
                      <ul className="text-[11px] text-gray-600 list-disc list-inside">
                        <li>비방/욕설 금지</li>
                        <li>허위 사실 금지</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                      <h4 className="text-[12px] font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                        <i className="fas fa-exclamation-circle text-orange-400" /> 작성 시 유의사항
                      </h4>
                      <ul className="text-[11px] text-gray-500 space-y-1.5 list-disc list-inside leading-snug">
                        <li>개인정보(주민번호, 전화번호 등)는 절대 입력하지 마세요.</li>
                        <li>의료법상 특정 병원의 홍보나 유인 알선으로 오인될 수 있는 내용은 임의 수정될 수 있습니다.</li>
                        <li>작성된 내용은 라이나생명의 서비스 개선 및 홍보 목적으로 활용될 수 있습니다.</li>
                      </ul>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-[13px] font-bold text-gray-800 mb-2">
                      제목을 입력해주세요
                    </label>
                    <p className="text-[11px] text-gray-400 mb-2">
                      나의 경험을 한 줄로 요약해보세요.
                    </p>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder={isNegative ? "예) 보험금 청구가 너무 어려웠어요" : "예) 잇몸 수술 후 보험금 덕분에 힘이 됐어요"}
                      maxLength={40}
                      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                        reviewTitle.length > 0 && reviewTitle.trim().length < 2
                          ? "border-red-300 bg-red-50"
                          : isNegative
                          ? "focus:border-red-500 focus:shadow-[0_0_0_1px_#DC2626]"
                          : "focus:border-[#F97316] focus:shadow-[0_0_0_1px_#F97316]"
                      }`}
                      data-testid="input-review-title"
                    />
                    <div className="text-right text-[10px] text-gray-400 mt-1">
                      <span>{reviewTitle.length}</span>/40자
                    </div>
                  </div>

                  {textLabels.slice(0, isNegative ? 2 : 4).map((label, idx) => {
                    const isLastPositive = idx === 3 && !isNegative;
                    return (
                      <div key={idx} className="mb-6 relative pl-8">
                        <div
                          className="absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: isNegative ? "#FEE2E2" : isLastPositive ? "#CCFBF1" : "#FFEDD5",
                            color: isNegative ? "#DC2626" : isLastPositive ? "#0055B8" : "#F97316",
                          }}
                        >
                          {isLastPositive ? <i className="fas fa-heart" /> : idx + 1}
                        </div>
                        <label className="block text-[13px] font-bold text-gray-800 mb-2 pt-1">{label}</label>
                        <textarea
                          ref={(el) => { textRefs.current[idx] = el; }}
                          value={texts[idx]}
                          onChange={(e) => {
                            const newTexts = [...texts];
                            newTexts[idx] = e.target.value;
                            setTexts(newTexts);
                          }}
                          onFocus={() => startAutoType(idx)}
                          placeholder={textPlaceholders[idx]}
                          maxLength={1000}
                          className={`w-full min-h-[80px] bg-gray-50 border border-gray-200 rounded-xl p-3 text-[14px] resize-none overflow-hidden placeholder-gray-400 leading-relaxed focus:outline-none transition-colors ${
                            texts[idx].length > 0 && texts[idx].length < 10
                              ? "border-red-300 bg-red-50"
                              : isNegative
                              ? "focus:border-red-500 focus:shadow-[0_0_0_1px_#DC2626]"
                              : "focus:border-[#F97316] focus:shadow-[0_0_0_1px_#F97316]"
                          }`}
                          style={{ height: "auto", minHeight: "80px" }}
                          data-testid={`textarea-${idx}`}
                        />
                        <div className="text-right text-[10px] text-gray-400 mt-1">
                          <span>{texts[idx].length}</span>/1000자 (최소 10자)
                        </div>
                      </div>
                    );
                  })}

                  {/* BEST Event Checkbox - positive mode only */}
                  {!isNegative && (
                    <div className="mt-4 flex items-start gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                      <input
                        type="checkbox"
                        id="chk-event"
                        checked={eventChecked}
                        onChange={(e) => setEventChecked(e.target.checked)}
                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded accent-[#F97316]"
                        data-testid="checkbox-event"
                      />
                      <label htmlFor="chk-event" className="text-[13px] text-gray-800 font-bold leading-snug cursor-pointer">
                        라이나ON BEST 후기 이벤트 참가
                        <span className="block text-[11px] text-gray-500 font-normal mt-0.5">
                          체크 시 작성하신 후기로 매월 진행하는 BEST 후기 선발 이벤트에 참여하게 됩니다.
                          배달의민족 쿠폰 / 커피쿠폰을 이벤트 리워드로 드려요.
                        </span>
                        <button
                          onClick={(e) => { e.preventDefault(); alert("이벤트 상세 페이지로 이동"); }}
                          className="text-[11px] text-[#0055B8] underline mt-1 font-medium"
                          data-testid="button-event-detail"
                        >
                          우수 후기 혜택 자세히 보기 &gt;
                        </button>
                      </label>
                    </div>
                  )}
                </section>
              )}

              {/* Hospital Review Section - positive mode only */}
              {!isNegative && showHospital && (
                <section className="px-5 py-6 bg-white mb-2 animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#F97316] font-bold text-lg">Plus.</span>
                        <h3 className="font-bold text-[16px] text-gray-900">병원 후기</h3>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">선택</span>
                      </div>
                      <p className="text-[12px] text-gray-500 mt-1 font-medium">다녀오신 병원은 어떠셨나요?</p>
                    </div>
                    <div
                      className="relative inline-block w-12 h-6 cursor-pointer"
                      onClick={() => setHospitalToggle(!hospitalToggle)}
                      data-testid="toggle-hospital"
                    >
                      <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${hospitalToggle ? "bg-[#F97316]" : "bg-gray-300"}`} />
                      <div className={`absolute top-0 w-6 h-6 rounded-full bg-white border-4 transition-all duration-200 ${hospitalToggle ? "right-0 border-[#F97316]" : "left-0 border-gray-300"}`} />
                    </div>
                  </div>

                  {hospitalToggle && (
                    <div className="mt-5 pt-5 border-t border-gray-100 space-y-5 animate-[fadeIn_0.3s_ease-out]">
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg z-10 shadow-sm">
                          <i className="fas fa-bolt mr-1" /> 라이나 서류제로 병원
                        </div>
                        <div className="flex items-start gap-3 mt-4 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 text-xl">
                            <i className="fas fa-hospital-alt" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-[16px]">신촌세브란스병원</h4>
                            <p className="text-[12px] text-gray-500 mt-0.5 font-medium">서울 서대문구 연세로 50-1</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-800 mb-2">진료 만족도</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <i
                              key={s}
                              onClick={() => setHospitalRating(s)}
                              className={`fa-solid fa-star text-2xl cursor-pointer p-1 ${
                                s <= hospitalRating ? "text-yellow-400" : "text-gray-200"
                              }`}
                              data-testid={`hospital-star-${s}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-[13px] font-bold text-gray-800">이 병원의 장점은? <span className="text-xs font-normal text-gray-400 ml-1">(중복 선택)</span></p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { icon: "fa-file-alt", label: "서류발급이 빨라요" },
                            { icon: "fa-coins", label: "과잉진료가 없어요" },
                            { icon: "fa-user-md", label: "설명이 꼼꼼해요" },
                            { icon: "fa-syringe", label: "안 아프게 치료해요" },
                            { icon: "fa-bolt", label: "예약/대기가 짧아요" },
                            { icon: "fa-hospital", label: "시설이 쾌적해요" },
                          ].map((tag) => {
                            const selected = selectedHospitalTags.includes(tag.label);
                            return (
                              <button
                                key={tag.label}
                                onClick={() =>
                                  setSelectedHospitalTags((prev) =>
                                    prev.includes(tag.label)
                                      ? prev.filter((t) => t !== tag.label)
                                      : [...prev, tag.label]
                                  )
                                }
                                className={`px-3 py-2 border rounded-lg text-xs transition-all ${
                                  selected
                                    ? "bg-orange-50 border-[#F97316] text-[#F97316] font-bold"
                                    : "bg-white border-gray-200 text-gray-500"
                                }`}
                                data-testid={`hospital-tag-${tag.label}`}
                              >
                                <i className={`fas ${tag.icon} mr-1`} /> {tag.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={hospitalReview}
                        onChange={(e) => setHospitalReview(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-400"
                        placeholder="병원에 대한 한줄평을 남겨주세요."
                        data-testid="input-hospital-review"
                      />
                    </div>
                  )}
                </section>
              )}

              {/* Consent Section */}
              {showConsent && (
                <section className="px-5 py-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                    <h4 className="text-[14px] font-bold text-gray-900 flex justify-between items-center">
                      약관 동의
                      <span
                        onClick={() => setShowConsentModal(true)}
                        className="text-[12px] text-[#F97316] underline font-normal cursor-pointer"
                        data-testid="button-consent-detail"
                      >
                        전체보기
                      </span>
                    </h4>

                    <div className="space-y-4 cursor-pointer" onClick={() => setShowConsentModal(true)} data-testid="consent-area">
                      <div className="flex items-center gap-3 pointer-events-none">
                        <input
                          type="checkbox"
                          checked={consentPrivacy === true}
                          readOnly
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded accent-[#F97316]"
                        />
                        <span className="text-[13px] text-gray-800 font-medium leading-snug">
                          <span className="text-orange-600 font-bold">[필수]</span> 개인정보 수집 및 이용 동의
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pointer-events-none">
                        <input
                          type="checkbox"
                          checked={consentSensitive === true}
                          readOnly
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded accent-[#F97316]"
                        />
                        <span className="text-[13px] text-gray-800 font-medium leading-snug">
                          <span className="text-orange-600 font-bold">[필수]</span> 민감정보 수집 및 이용 동의
                        </span>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="pointer-events-none">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={consentMarketing}
                            readOnly
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded accent-[#F97316]"
                          />
                          <span className="text-[13px] text-gray-800 font-medium leading-snug">
                            <span className="text-gray-400 font-bold">[선택]</span> 마케팅 활용 및 광고성 정보 수신
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 pl-7 mt-1 leading-snug">
                          🎁 이벤트 당첨 소식과 라이나ON 의 새로운 이벤트,콘텐츠를 앱푸시로 간편하게 받아보세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-5 pb-8 z-20 shadow-[0_-5px_30px_rgba(0,0,0,0.04)]">
          <button
            onClick={canSubmit ? handleSubmit : undefined}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-xl font-bold text-[16px] transition-all ${
              canSubmit
                ? isNegative
                  ? "bg-[#DC2626] text-white shadow-lg active:scale-[0.98]"
                  : "bg-[#F97316] text-white shadow-lg active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            data-testid="button-submit"
          >
            {canSubmit
              ? isNegative
                ? "의견 보내기"
                : "후기 등록하기"
              : "필수 항목을 모두 입력해주세요"}
          </button>
        </div>

        {/* Unified Consent Modal */}
        {showConsentModal && (
          <div className="absolute inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/60 transition-opacity"
              onClick={() => { setShowConsentModal(false); }}
            />
            <div className="absolute bottom-0 w-full bg-white rounded-t-[24px] h-[90%] flex flex-col animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              <div className="relative shrink-0 bg-white rounded-t-[24px] z-10 border-b border-gray-100">
                <div className="h-16 flex items-center justify-between px-5">
                  <h3 className="font-bold text-[17px] text-gray-900">약관 전체 동의</h3>
                  <button
                    onClick={() => setShowConsentModal(false)}
                    className="text-gray-400 p-2"
                    data-testid="button-close-consent-modal"
                  >
                    <i className="fas fa-times text-xl" />
                  </button>
                </div>
                <div className="h-1 bg-gray-100 w-full absolute bottom-0 left-0">
                  <div
                    className="h-full bg-[#F97316] transition-[width] duration-100"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>

              <div
                ref={termScrollRef}
                onScroll={handleTermScroll}
                className="flex-1 overflow-y-auto p-5 pb-10 bg-gray-50 space-y-8"
                style={{ scrollbarWidth: "none" }}
              >
                {/* Privacy */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-[15px] text-gray-900">
                      개인정보 수집 및 이용 동의 <span className="text-[#F97316] text-xs ml-1">[필수]</span>
                    </h4>
                  </div>
                  <div className="text-[12px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 h-40 overflow-y-auto mb-4" style={{ scrollbarWidth: "none" }}>
                    1. 목적: 후기 서비스 운영, 경품 발송<br />
                    2. 항목: 성명, 전화번호, 후기 내용<br />
                    3. 보유기간: 서비스 종료 시까지
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConsentPrivacy(false)}
                      className={`flex-1 py-3 rounded-xl border text-[13px] font-bold transition-colors ${
                        consentPrivacy === false
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-500 bg-white"
                      }`}
                      data-testid="btn-privacy-disagree"
                    >
                      동의하지 않음
                    </button>
                    <button
                      onClick={() => setConsentPrivacy(true)}
                      className={`flex-1 py-3 rounded-xl border text-[13px] font-bold transition-colors ${
                        consentPrivacy === true
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-500 bg-white"
                      }`}
                      data-testid="btn-privacy-agree"
                    >
                      동의
                    </button>
                  </div>
                </div>

                {/* Sensitive */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-[15px] text-gray-900">
                      민감정보 수집 및 이용 동의 <span className="text-[#F97316] text-xs ml-1">[필수]</span>
                    </h4>
                  </div>
                  <div className="text-[12px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 h-40 overflow-y-auto mb-4" style={{ scrollbarWidth: "none" }}>
                    1. 목적: 맞춤형 후기 제공<br />
                    2. 항목: 진단명, 치료 내용 등<br />
                    3. 보유기간: 서비스 종료 시까지
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConsentSensitive(false)}
                      className={`flex-1 py-3 rounded-xl border text-[13px] font-bold transition-colors ${
                        consentSensitive === false
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-500 bg-white"
                      }`}
                      data-testid="btn-sensitive-disagree"
                    >
                      동의하지 않음
                    </button>
                    <button
                      onClick={() => setConsentSensitive(true)}
                      className={`flex-1 py-3 rounded-xl border text-[13px] font-bold transition-colors ${
                        consentSensitive === true
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-500 bg-white"
                      }`}
                      data-testid="btn-sensitive-agree"
                    >
                      동의
                    </button>
                  </div>
                </div>

                {/* Marketing */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="mb-3">
                    <h4 className="font-bold text-[15px] text-gray-900">
                      마케팅 활용 및 광고 수신 동의 <span className="text-gray-400 text-xs ml-1">[선택]</span>
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1">🎁 당첨 소식과 경품 지급을 위해 동의가 필요해요.</p>
                  </div>
                  <div className="text-[12px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 h-32 overflow-y-auto mb-4" style={{ scrollbarWidth: "none" }}>
                    1. 목적: 혜택 정보 안내<br />
                    2. 항목: 연락처, 앱 푸시 토큰<br />
                    3. 보유기간: 철회 시까지
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConsentMarketing(false)}
                      className={`flex-1 py-3 rounded-xl border text-[13px] font-bold transition-colors ${
                        !consentMarketing
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-500 bg-white"
                      }`}
                      data-testid="btn-marketing-disagree"
                    >
                      동의하지 않음
                    </button>
                    <button
                      onClick={() => setConsentMarketing(true)}
                      className={`flex-1 py-3 rounded-xl border text-[13px] font-bold transition-colors ${
                        consentMarketing
                          ? "bg-[#F97316] text-white border-[#F97316]"
                          : "border-gray-200 text-gray-500 bg-white"
                      }`}
                      data-testid="btn-marketing-agree"
                    >
                      동의
                    </button>
                  </div>
                </div>

                <div className="h-10" />
              </div>

              <div className="p-5 border-t border-gray-100 bg-white pb-8">
                <button
                  onClick={modalCanConfirm ? confirmConsentModal : undefined}
                  disabled={!modalCanConfirm}
                  className={`w-full py-4 font-bold rounded-xl text-[15px] transition-all ${
                    modalCanConfirm
                      ? "bg-[#F97316] text-white shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  data-testid="button-confirm-consent"
                >
                  {modalCanConfirm ? "확인 및 닫기" : "필수 항목을 선택해주세요"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Care Modal - negative mode submission */}
        {showCareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCareModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[340px] text-center animate-[fadeIn_0.2s_ease-out]">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto mb-4 text-xl">
                <i className="fas fa-headset" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">불편을 드려 죄송합니다</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-6">전문 상담사의 안내가 필요하신가요?</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCareCallback}
                  className="w-full py-3 bg-[#DC2626] text-white font-bold rounded-xl text-sm shadow-md active:scale-[0.98] transition-transform"
                  data-testid="button-care-callback"
                >
                  네, 상담 요청할게요
                </button>
                <button
                  onClick={handleCareSkip}
                  className="w-full py-3 bg-white text-gray-500 font-medium rounded-xl text-sm border border-gray-200 active:scale-[0.98] transition-transform"
                  data-testid="button-care-skip"
                >
                  괜찮습니다
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
