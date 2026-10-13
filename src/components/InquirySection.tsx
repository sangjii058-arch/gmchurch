import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  MessageSquare, 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  Lock, 
  User, 
  Smartphone, 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  Clock, 
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from "lucide-react";

type InquiryCategory = "new_family" | "counseling" | "prayer" | "ministry" | "general";

interface CategoryOption {
  id: InquiryCategory;
  label: string;
  badge: string;
  placeholder: string;
  description: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "new_family",
    label: "새가족 등록·방문",
    badge: "환영합니다",
    placeholder: "방문 예정일이나 가족 구성원, 궁금하신 점을 자유롭게 남겨주세요. (예: 이번 주일 11시 예배에 가족과 함께 처음 방문하려고 합니다.)",
    description: "처음 방문하시는 분들을 따뜻하게 맞이하고 교회 생활 정착을 도와드립니다."
  },
  {
    id: "counseling",
    label: "신앙·심방 상담",
    badge: "1:1 비밀상담",
    placeholder: "삶의 고민, 신앙적인 의문, 또는 목회자 심방이 필요하신 내용을 적어주세요. 담당 교역자만 안전하게 확인합니다.",
    description: "인생의 갈림길과 영적 고민을 담당 교역자와 함께 말씀 안에서 풀어갑니다."
  },
  {
    id: "prayer",
    label: "중보기도 요청",
    badge: "함께 기도합니다",
    placeholder: "함께 기도하기 원하시는 기도 제목을 나눠주세요. 광명교회 중보기도팀과 교역자가 간절한 마음으로 중보합니다.",
    description: "혼자 짊어지기 무거운 짐을 주님 앞에 함께 올려드리며 기도합니다."
  },
  {
    id: "ministry",
    label: "사역·봉사 문의",
    badge: "동역의 기쁨",
    placeholder: "관심 있으신 사역 부서(찬양팀, 교회학교, 방송팀, 봉사부 등)나 참여 희망 내용을 적어주세요.",
    description: "하나님이 주신 은사로 교회를 세우고 이웃을 섬기는 봉사 사역을 안내합니다."
  },
  {
    id: "general",
    label: "일반 행정 문의",
    badge: "안내 지원",
    placeholder: "교회 시설 이용, 증명서 발급, 행사 일정 등 기타 문의사항을 입력해 주세요.",
    description: "교회 운영 및 행정에 관한 전반적인 사항을 친절하게 안내해 드립니다."
  }
];

const FAQS = [
  {
    question: "교회에 처음 방문하려고 하는데 미리 연락을 드려야 하나요?",
    answer: "아닙니다, 사전 연락 없이 주일 예배 시간에 맞춰 언제든 편안히 오셔도 괜찮습니다! 다만 본 문의 폼으로 방문 일정을 미리 남겨주시면, 안내위원이 로비에서 기다리고 있다가 예배실 좌석 안내와 주보 전달 등을 더욱 세심하게 도와드릴 수 있습니다."
  },
  {
    question: "주차 시설과 대중교통 이용은 어떻게 되나요?",
    answer: "광명교회 경내 전용 주차장을 무료로 이용하실 수 있으며, 만차 시 인근 지정 협력 주차 공간을 안내해 드립니다. 대중교통 이용 시 7호선 광명사거리역 및 인근 버스정류장에서 도보로 편리하게 방문하실 수 있습니다."
  },
  {
    question: "어린 영유아나 자녀와 함께 갈 수 있는 공간이 있나요?",
    answer: "네, 본당 2층에 영유아와 부모님을 위한 아늑하고 쾌적한 자모실(수유 공간, 전용 모니터, 바닥 온돌 완비)이 마련되어 있습니다. 또한 연령별 교회학교(유치부, 초등부, 청소년부) 예배가 동시간대에 운영됩니다."
  },
  {
    question: "신앙 상담이나 기도 요청은 비밀이 보장되나요?",
    answer: "철저하게 보장됩니다. 온라인 문의 폼에서 '비공개 상담 요청'을 체크하시면 해당 내용은 외부로 일체 공유되지 않으며, 담임목사님 및 지정 전담 교역자만 단독 열람하여 심방 및 상담을 진행합니다."
  }
];

export default function InquirySection() {
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>("new_family");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredMethod, setPreferredMethod] = useState<"phone" | "sms" | "kakao">("phone");
  const [isPrivate, setIsPrivate] = useState(true);
  const [message, setMessage] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    id: string;
    date: string;
    category: string;
    name: string;
  } | null>(null);

  const currentCategoryObj = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("성함을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      setFormError("연락 받으실 전화번호를 입력해 주세요.");
      return;
    }
    if (!message.trim()) {
      setFormError("문의 또는 나누고 싶으신 내용을 입력해 주세요.");
      return;
    }
    if (!agreePrivacy) {
      setFormError("개인정보 수집 및 안내 이용에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);

    // Mock network transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const receiptNo = `GM-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionReceipt({
        id: receiptNo,
        date: new Date().toLocaleString("ko-KR", { 
          year: "numeric", 
          month: "long", 
          day: "numeric", 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        category: currentCategoryObj.label,
        name: name.trim()
      });
    }, 1200);
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setAgreePrivacy(false);
    setIsSubmitted(false);
    setSubmissionReceipt(null);
    setFormError(null);
  };

  return (
    <section id="inquiry" className="py-24 px-6 bg-gradient-to-b from-surface via-background to-surface relative overflow-hidden">
      {/* Background Accent Deco */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/15 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} className="text-accent" />
            <span>Contact & Counseling</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            온라인 문의 및 신앙상담
          </h2>
          <p className="text-on-surface/75 text-base md:text-lg leading-relaxed font-sans mb-4">
            광명교회는 누구에게나 열려 있습니다. 새가족 등록, 삶의 고민과 신앙상담, 
            함께 기도할 제목이 있으시다면 언제든 따뜻한 마음으로 나누어 주세요.
          </p>
          <div className="inline-block bg-primary/5 border border-primary/10 rounded-2xl px-6 py-3 text-xs md:text-sm text-primary/80 font-serif italic">
            &ldquo;수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라 (마태복음 11:28)&rdquo;
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: 전화 상담 */}
          <div className="bg-surface p-7 rounded-3xl shadow-sm hover:shadow-md transition-all border border-primary/10 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Phone size={26} />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                Direct Call
              </span>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">교역자실 전화 문의</h3>
              <p className="text-on-surface/65 text-sm leading-relaxed mb-4">
                예배 시간, 교회 방문 및 긴급 심방 등 궁금하신 사항을 유선으로 즉시 상담해 드립니다.
              </p>
            </div>
            <div className="pt-4 border-t border-background flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-lg text-primary">02-2612-0691</p>
                <p className="text-[11px] text-on-surface/50">화-토 09:00 - 18:00</p>
              </div>
              <a
                href="tel:02-2612-0691"
                className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm"
              >
                전화 연결
              </a>
            </div>
          </div>

          {/* Card 2: 카카오톡 1:1 상담 */}
          <div className="bg-surface p-7 rounded-3xl shadow-sm hover:shadow-md transition-all border border-primary/10 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-amber-400/20 text-amber-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle size={26} />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                Kakao Talk
              </span>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">카카오톡 채널 상담</h3>
              <p className="text-on-surface/65 text-sm leading-relaxed mb-4">
                통화가 부담스러우시다면 메신저를 통해 편리하게 1:1 채팅으로 안내를 받으실 수 있습니다.
              </p>
            </div>
            <div className="pt-4 border-t border-background flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-primary">광명교회 카카오채널</p>
                <p className="text-[11px] text-on-surface/50">상시 메시지 접수 가능</p>
              </div>
              <button
                onClick={() => alert("카카오톡 플러스친구 [광명교회]를 검색하시거나 채널을 추가해 주세요.")}
                className="bg-[#FEE500] text-[#191919] text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#FEE500]/90 transition-colors shadow-sm"
              >
                채널 바로가기
              </button>
            </div>
          </div>

          {/* Card 3: 중보기도 및 심방 요청 */}
          <div className="bg-surface p-7 rounded-3xl shadow-sm hover:shadow-md transition-all border border-primary/10 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HeartHandshake size={26} />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                Pastoral Care
              </span>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">중보기도 및 심방</h3>
              <p className="text-on-surface/65 text-sm leading-relaxed mb-4">
                어려움 속에 계시거나 축복의 기도가 필요할 때, 담당 교역자가 함께 기도하며 심방합니다.
              </p>
            </div>
            <div className="pt-4 border-t border-background flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-primary">목회자 전용 비밀 접수</p>
                <p className="text-[11px] text-on-surface/50">신앙 및 가정 심방</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory("prayer");
                  document.getElementById("inquiry-form-card")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-accent text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-accent/90 transition-colors shadow-sm"
              >
                기도제목 작성
              </button>
            </div>
          </div>
        </div>

        {/* Main Inquiry Form & FAQ Section */}
        <div id="inquiry-form-card" className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Inquiry Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 bg-surface rounded-3xl p-8 md:p-10 shadow-lg border border-primary/10 relative">
            <AnimatePresence mode="wait">
              {isSubmitted && submissionReceipt ? (
                /* Submission Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-10 text-center flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle2 size={44} className="text-primary animate-bounce" />
                  </div>
                  <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full mb-3">
                    접수 완료: {submissionReceipt.id}
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-primary mb-3">
                    문의가 은혜롭게 접수되었습니다
                  </h3>
                  <p className="text-on-surface/70 text-sm max-w-md mx-auto leading-relaxed mb-8">
                    <span className="font-bold text-primary">{submissionReceipt.name}</span> 성도님(이웃님)의 소중한 말씀이 담당 교역자실로 안전하게 전달되었습니다. 
                    기도하는 마음으로 정성을 다해 신속히 연락드리겠습니다.
                  </p>

                  <div className="bg-background rounded-2xl p-5 w-full max-w-md text-left text-xs space-y-2.5 border border-primary/5 mb-8">
                    <div className="flex justify-between border-b border-primary/5 pb-2">
                      <span className="text-on-surface/50">문의 분류</span>
                      <span className="font-bold text-primary">{submissionReceipt.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary/5 pb-2">
                      <span className="text-on-surface/50">접수 일시</span>
                      <span className="text-on-surface/80">{submissionReceipt.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface/50">보안 등급</span>
                      <span className="text-primary flex items-center gap-1 font-medium">
                        <Lock size={12} className="text-accent" /> 담당 교역자 비공개 처리
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-all shadow-md"
                  >
                    <RefreshCw size={16} /> 추가 문의 작성하기
                  </button>
                </motion.div>
              ) : (
                /* Interactive Form State */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-background">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-primary">온라인 문의 작성</h3>
                      <p className="text-xs text-on-surface/50 mt-1">문의 유형을 선택하시면 전담 교역자에게 배정됩니다.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-primary/70 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                      <ShieldCheck size={14} className="text-accent" />
                      <span>개인정보 안전 암호화</span>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="mb-8">
                    <label className="block text-xs font-bold text-on-surface/60 uppercase tracking-wider mb-2.5">
                      문의 분류 선택
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-primary text-white shadow-md scale-102"
                                : "bg-background text-on-surface/70 hover:bg-primary/5 hover:text-primary border border-primary/5"
                            }`}
                          >
                            <span>{cat.label}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-accent font-medium mt-2.5 flex items-center gap-1">
                      <Sparkles size={13} /> {currentCategoryObj.description}
                    </p>
                  </div>

                  {/* Form Element */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name & Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface/70 mb-1.5">
                          성함 / 교우명 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface/35" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="홍길동"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-primary/15 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface/70 mb-1.5">
                          연락처 (휴대전화) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface/35" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-1234-5678"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-primary/15 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Preferred Contact Method */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface/70 mb-1.5">
                          이메일 주소 <span className="text-xs font-normal text-on-surface/40">(선택)</span>
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface/35" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-primary/15 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface/70 mb-1.5">
                          선호하시는 회신 방법
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "phone", label: "전화 통화" },
                            { id: "sms", label: "문자메시지" },
                            { id: "kakao", label: "카카오톡" },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setPreferredMethod(item.id as any)}
                              className={`py-2.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                                preferredMethod === item.id
                                  ? "bg-accent/15 border-accent text-accent font-bold"
                                  : "bg-background border-primary/10 text-on-surface/70 hover:border-primary/30"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-on-surface/70">
                          문의 및 나눔 내용 <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-on-surface/40">
                          {message.length}자 입력됨
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={currentCategoryObj.placeholder}
                        className="w-full p-3.5 rounded-xl bg-background border border-primary/15 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Privacy Lock Toggle & Agreement Checkbox */}
                    <div className="bg-background rounded-2xl p-4 border border-primary/10 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          id="private-lock-checkbox"
                          type="checkbox"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="mt-1 rounded text-primary focus:ring-primary/30 w-4 h-4 cursor-pointer accent-primary shrink-0"
                        />
                        <label htmlFor="private-lock-checkbox" className="text-xs cursor-pointer select-none">
                          <span className="font-bold text-primary flex items-center gap-1">
                            <Lock size={12} className="text-accent" /> 비공개 상담 및 기도제목으로 접수 (권장)
                          </span>
                          <p className="text-on-surface/60 mt-0.5 text-[11px]">
                            작성하신 내용은 담임목사님 및 지정된 교역자 외에는 절대 공개되지 않습니다.
                          </p>
                        </label>
                      </div>

                      <div className="border-t border-primary/5 pt-2.5">
                        <div className="flex items-center gap-2.5">
                          <input
                            id="privacy-agree-checkbox"
                            type="checkbox"
                            checked={agreePrivacy}
                            onChange={(e) => setAgreePrivacy(e.target.checked)}
                            className="rounded text-primary focus:ring-primary/30 w-4 h-4 cursor-pointer accent-primary shrink-0"
                          />
                          <label htmlFor="privacy-agree-checkbox" className="text-xs text-on-surface/75 cursor-pointer select-none">
                            [필수] 원활한 상담 회신을 위한 개인정보(성함, 연락처) 수집 및 이용에 동의합니다.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Error Banner */}
                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
                      >
                        <AlertCircle size={15} className="shrink-0 text-red-500" />
                        <span>{formError}</span>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-2xl font-serif font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>소중한 문의를 전달 중입니다...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>문의 내용 전송하기</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: FAQ & Office Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pastoral Office Hours Card */}
            <div className="bg-primary text-white rounded-3xl p-7 shadow-md">
              <div className="flex items-center gap-2.5 mb-3 text-accent text-xs font-bold uppercase tracking-wider">
                <Clock size={16} />
                <span>Office & Visiting</span>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">교역자실 및 상담 안내</h3>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-6">
                직접 방문하여 대면 상담을 원하시는 경우, 예배 전후 또는 주중 교역자실 운영 시간에 편안히 방문해 주시기 바랍니다.
              </p>
              
              <div className="space-y-3 border-t border-white/10 pt-4 text-xs font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">화요일 ~ 금요일</span>
                  <span className="font-semibold text-white">09:00 - 18:00 (점심시간 12:00-13:00)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">토요일 (주일 준비)</span>
                  <span className="font-semibold text-white">09:00 - 16:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">주일 (예배 및 교제)</span>
                  <span className="font-semibold text-accent">09:00 - 17:00 (1층 새가족실 상시 개방)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">월요일 및 공휴일</span>
                  <span className="text-white/40">정기 휴무 (긴급 심방 전화 가능)</span>
                </div>
              </div>
            </div>

            {/* FAQ Accordion Card */}
            <div className="bg-surface rounded-3xl p-7 shadow-sm border border-primary/10">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle size={20} className="text-accent" />
                <h3 className="text-xl font-serif font-bold text-primary">자주 묻는 질문 (FAQ)</h3>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index}
                      className="border border-background rounded-2xl overflow-hidden transition-colors bg-background/50 hover:bg-background"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 text-left flex justify-between items-center gap-3 transition-colors"
                      >
                        <span className="text-xs md:text-sm font-bold text-primary flex items-start gap-2">
                          <span className="text-accent font-serif font-black">Q.</span>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          size={16} 
                          className={`text-on-surface/40 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-accent" : ""}`} 
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-1 text-xs text-on-surface/75 leading-relaxed border-t border-primary/5 bg-surface/80">
                              <span className="font-bold text-accent mr-1">A.</span>
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
