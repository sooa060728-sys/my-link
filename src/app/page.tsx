"use client";

import { useState } from "react";
import {
  ChevronRight,
  Mail,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  Briefcase,
  FolderGit2,
  Bell,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "tech" | "experience">("projects");

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const techStack = [
    { name: "Next.js 16", category: "프레임워크", level: "숙련", highlight: true },
    { name: "React 19", category: "라이브러리", level: "숙련", highlight: true },
    { name: "TypeScript", category: "언어", level: "우수", highlight: false },
    { name: "Tailwind CSS v4", category: "스타일링", level: "숙련", highlight: true },
    { name: "Zustand & TanStack", category: "상태 관리", level: "우수", highlight: false },
    { name: "Figma Design System", category: "디자인 시스템", level: "우수", highlight: false },
  ];

  const projects = [
    {
      id: "mylink",
      title: "MyLink 바이오 링크 서비스",
      subtitle: "멀티링크 프로필 생성 및 커스텀 분석 서비스이에요.",
      tags: ["Next.js 16", "React 19", "Tailwind CSS"],
      badge: "대표 프로젝트",
      url: "https://github.com/sooa060728-sys",
      iconBg: "bg-[#E8F3FF] text-[#3182F6]",
    },
    {
      id: "ai-assistant",
      title: "AI 코드 어시스턴트 대시보드",
      subtitle: "AI 프롬프트 생성과 리팩토링 관리 인터페이스이에요.",
      tags: ["React", "TypeScript", "Vite"],
      badge: "신규 서비스",
      url: "https://github.com/sooa060728-sys",
      iconBg: "bg-[#F2F4F6] text-[#191F28]",
    },
    {
      id: "design-system",
      title: "Vibe UI 디자인 시스템",
      subtitle: "접근성과 반응형 라이브러리를 위한 컴포넌트 킷이에요.",
      tags: ["Storybook", "Framer Motion"],
      badge: "오픈소스",
      url: "https://github.com/sooa060728-sys",
      iconBg: "bg-[#F2F4F6] text-[#191F28]",
    },
  ];

  const experiences = [
    {
      period: "2024년 - 현재",
      role: "프론트엔드 리드 개발자",
      company: "Tech Innovation Corp",
      description: "Next.js 아키텍처 설계와 렌더링 성능 45% 개선을 달성했어요.",
    },
    {
      period: "2023년 - 2024년",
      role: "UI/UX 프론트엔드 개발자",
      company: "Creative Studio",
      description: "반응형 웹 인터페이스와 디자인 시스템 컴포넌트를 구축했어요.",
    },
    {
      period: "2022년 - 2023년",
      role: "오픈소스 및 바이브 코딩 기여",
      company: "개인 프로젝트",
      description: "다양한 웹 툴 개발과 GitHub 오픈소스 생태계에 활발히 참여했어요.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased pb-28">
      
      {/* 1. Top App Bar (상단 앱 바 - 56pt) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E8EB] h-14 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 토스 스타일 심볼 & 타이틀 */}
          <div className="w-7 h-7 rounded-lg bg-[#3182F6] flex items-center justify-center text-white font-black text-xs">
            toss
          </div>
          <span className="font-bold text-[17px] text-[#191F28] tracking-tight">
            이수아의 프로필
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-[#F2F4F6] transition-colors"
            title="링크 공유"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 복사 완료 토스트 피드백 */}
      {copied && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#191F28] text-white px-5 py-3 rounded-2xl tds-shadow-toast text-[15px] font-semibold flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#20874E] flex items-center justify-center text-white text-xs">
            ✓
          </div>
          <span>프로필 링크가 복사되었어요!</span>
        </div>
      )}

      {/* 메인 콘텐츠 컨테이너 */}
      <main className="mx-auto max-w-xl px-4 pt-6 space-y-4">
        
        {/* 2. Hero Header Card (radius-3xl / 24px - 토스 표준 대형 카드) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E8EB] tds-shadow-1 space-y-5">
          
          {/* 아바타 & 상태 정보 */}
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#F2F4F6] bg-[#F9FAFB]">
                <img
                  src="/images/avatar.jpg"
                  alt="이수아 프로필"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#20874E] border-2 border-white" title="현재 연락 가능" />
            </div>

            <span className="inline-flex items-center gap-1.5 bg-[#E8F3FF] text-[#3182F6] font-semibold text-xs px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              연락 가능해요
            </span>
          </div>

          {/* 타이틀 & 대화형 해요체 소개 카피 */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#191F28]">
              안녕하세요! 프론트엔드 개발자 이수아이에요 💙
            </h1>
            <p className="text-[15px] text-[#4E5968] leading-relaxed">
              웹 기술로 가치 있는 사용자 경험을 만들어가요. 직관적인 UI 디자인과 쾌적한 웹 성능을 구축하고 있어요.
            </p>
          </div>

          {/* 주요 통계 리스트 수치 */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB] text-center">
            <div>
              <div className="text-xs text-[#8B95A1] font-medium mb-0.5">완료 프로젝트</div>
              <div className="text-lg font-bold text-[#3182F6] tabular-nums">12개</div>
            </div>
            <div className="border-x border-[#E5E8EB]">
              <div className="text-xs text-[#8B95A1] font-medium mb-0.5">개발 경력</div>
              <div className="text-lg font-bold text-[#191F28] tabular-nums">3년+</div>
            </div>
            <div>
              <div className="text-xs text-[#8B95A1] font-medium mb-0.5">커밋 기록</div>
              <div className="text-lg font-bold text-[#191F28] tabular-nums">1.2k+</div>
            </div>
          </div>

          {/* 단일 Toss Blue Primary Action Button (TDS 규율: 화면당 1개) */}
          <a
            href="mailto:contact@example.com"
            className="w-full h-14 bg-[#3182F6] hover:bg-[#1B64DA] active:scale-[0.98] text-white font-bold text-[17px] rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Mail className="w-5 h-5" />
            <span>이메일로 문의하기</span>
          </a>

        </div>

        {/* 3. Segmented Control (분절형 탭 필터) */}
        <div className="bg-[#E5E8EB] p-1 rounded-full flex gap-1">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-2.5 rounded-full text-[15px] font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-white text-[#191F28] tds-shadow-1"
                : "text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            대표 프로젝트
          </button>
          <button
            onClick={() => setActiveTab("tech")}
            className={`flex-1 py-2.5 rounded-full text-[15px] font-semibold transition-all ${
              activeTab === "tech"
                ? "bg-white text-[#191F28] tds-shadow-1"
                : "text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            기술 스택
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex-1 py-2.5 rounded-full text-[15px] font-semibold transition-all ${
              activeTab === "experience"
                ? "bg-white text-[#191F28] tds-shadow-1"
                : "text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            경력 & 이력
          </button>
        </div>

        {/* 4. 탭 1: 대표 프로젝트 (TDS Standard List-Row 패턴) */}
        {activeTab === "projects" && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-[#8B95A1] px-1 pt-1">
              확인하고 싶은 프로젝트를 선택해 보세요
            </div>

            {projects.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl p-4 border border-[#E5E8EB] hover:border-[#B0B8C1] transition-all tds-shadow-1 group"
              >
                <div className="flex items-center justify-between gap-3">
                  
                  {/* 44px 표준 아이콘 슬롯 */}
                  <div className={`w-11 h-11 rounded-2xl ${project.iconBg} flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                    <FolderGit2 className="w-5 h-5" />
                  </div>

                  {/* 타이틀 및 설명 스택 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[17px] font-bold text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
                        {project.title}
                      </span>
                      <span className="text-[11px] font-semibold bg-[#F2F4F6] text-[#6B7684] px-2 py-0.5 rounded-md flex-shrink-0">
                        {project.badge}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#4E5968] truncate mb-2">
                      {project.subtitle}
                    </p>

                    {/* 태그 목록 */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[12px] font-medium text-[#6B7684] bg-[#F9FAFB] px-2 py-0.5 rounded-md border border-[#E5E8EB]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 우측 화살표 슬롯 */}
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1] group-hover:text-[#3182F6] transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 5. 탭 2: 기술 스택 (TDS Clean Card Grid) */}
        {activeTab === "tech" && (
          <div className="bg-white rounded-3xl p-5 border border-[#E5E8EB] tds-shadow-1 space-y-4">
            <div className="text-[17px] font-bold text-[#191F28] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#3182F6]" />
              주요 기술 역량이에요
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] flex items-center justify-between"
                >
                  <div>
                    <div className="text-[15px] font-bold text-[#191F28]">
                      {tech.name}
                    </div>
                    <div className="text-xs text-[#8B95A1]">
                      {tech.category}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      tech.highlight
                        ? "bg-[#E8F3FF] text-[#3182F6]"
                        : "bg-[#F2F4F6] text-[#6B7684]"
                    }`}
                  >
                    {tech.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. 탭 3: 경력 & 이력 (TDS Timeline View) */}
        {activeTab === "experience" && (
          <div className="bg-white rounded-3xl p-5 border border-[#E5E8EB] tds-shadow-1 space-y-5">
            <div className="text-[17px] font-bold text-[#191F28] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#3182F6]" />
              경력 및 성장 이력이에요
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#3182F6] bg-[#E8F3FF] px-2.5 py-0.5 rounded-full">
                      {exp.period}
                    </span>
                    <span className="text-xs font-medium text-[#8B95A1]">
                      {exp.company}
                    </span>
                  </div>
                  <div className="text-[16px] font-bold text-[#191F28]">
                    {exp.role}
                  </div>
                  <p className="text-[14px] text-[#4E5968]">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. 소셜 & 깃허브 하단 셀 섹션 */}
        <div className="bg-white rounded-3xl p-4 border border-[#E5E8EB] tds-shadow-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#191F28] text-white flex items-center justify-center font-bold text-sm">
              GH
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#191F28]">
                GitHub 오픈소스 프로필
              </div>
              <div className="text-xs text-[#8B95A1]">
                sooa060728-sys
              </div>
            </div>
          </div>

          <a
            href="https://github.com/sooa060728-sys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#3182F6] bg-[#E8F3FF] hover:bg-[#D4E8FF] px-3.5 py-2 rounded-full transition-colors flex items-center gap-1"
          >
            <span>방문하기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 푸터 카피라이트 */}
        <footer className="pt-6 pb-4 text-center text-xs text-[#8B95A1] space-y-1">
          <div className="flex items-center justify-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#20874E]" />
            <span>토스 디자인 시스템(TDS) 가이드라인 준수</span>
          </div>
          <p>© {new Date().getFullYear()} 이수아 (Sooa Lee). All rights reserved.</p>
        </footer>

      </main>

      {/* 8. Floating Bottom CTA (화면 하단 고정 56pt 버튼 + 보호 그라디언트) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 tds-cta-gradient z-40 flex justify-center">
        <div className="w-full max-w-xl">
          <button
            onClick={handleCopyLink}
            className="w-full h-14 bg-[#191F28] hover:bg-[#333D4B] active:scale-[0.98] text-white font-bold text-[17px] rounded-full transition-all tds-shadow-2 flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? "프로필 링크가 복사되었어요!" : "프로필 링크 복사하기"}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
