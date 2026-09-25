"use client";

import { useState } from "react";
import {
  Mail,
  ExternalLink,
  MapPin,
  Sparkles,
  Code2,
  FolderGit2,
  Award,
  Layers,
  CheckCircle2,
  Share2,
  Check,
  Heart,
  Globe,
  Briefcase,
  Terminal,
  Zap,
  Star,
  ArrowUpRight,
  Smile,
} from "lucide-react";

// GitHub SVG Component
function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "tech" | "experience">("projects");

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const techStack = [
    { name: "Next.js 16", category: "Framework", level: "EXPERT 🔥", bg: "bg-yellow-300" },
    { name: "React 19", category: "Library", level: "EXPERT 🔥", bg: "bg-sky-300" },
    { name: "TypeScript", category: "Language", level: "ADVANCED ⚡", bg: "bg-blue-300" },
    { name: "Tailwind CSS v4", category: "Styling", level: "EXPERT 🔥", bg: "bg-teal-300" },
    { name: "State Mgmt", category: "Zustand / TanStack", level: "ADVANCED ⚡", bg: "bg-pink-300" },
    { name: "UI/UX Design", category: "Figma System", level: "PRO 🎨", bg: "bg-purple-300" },
  ];

  const stats = [
    { label: "PROJECTS", value: "12+", icon: FolderGit2, bg: "bg-yellow-300" },
    { label: "EXP YEARS", value: "3 YRS+", icon: Briefcase, bg: "bg-pink-300" },
    { label: "COMMITS", value: "1.2K+", icon: Code2, bg: "bg-sky-300" },
    { label: "STARS", value: "340+", icon: Star, bg: "bg-emerald-300" },
  ];

  const projects = [
    {
      id: "mylink",
      title: "MyLink // 퍼스널 바이오 링크 플랫폼",
      subtitle: "CUSTOM LINK IN BIO BUILDER",
      description:
        "개발자와 크리에이터를 위한 반응형 멀티링크 프로필 생성 서비스입니다. 네오 브루탈리즘 테마, 실시간 통계 분석 및 모바일 최적화 레이아웃을 제공합니다.",
      image: "/images/project1.jpg",
      tags: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript"],
      demoUrl: "https://github.com/sooa060728-sys",
      githubUrl: "https://github.com/sooa060728-sys",
      badgeBg: "bg-yellow-300",
      headerBg: "bg-yellow-400",
    },
    {
      id: "ai-assistant",
      title: "AI Code Assistant // AI 프롬프트 대시보드",
      subtitle: "INTELLIGENT CODE STUDIO",
      description:
        "AI 프롬프트 생성 및 코드 리팩토링 작업을 관리하는 웹 대시보드 인터페이스. 브루탈 모드, 코드 하이라이팅 및 실시간 응답 차트를 지원합니다.",
      image: "/images/project2.jpg",
      tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      demoUrl: "https://github.com/sooa060728-sys",
      githubUrl: "https://github.com/sooa060728-sys",
      badgeBg: "bg-pink-300",
      headerBg: "bg-pink-400",
    },
    {
      id: "design-system",
      title: "Vibe UI // 디자인 시스템 컴포넌트",
      subtitle: "NEOBRUTALISM COMPONENT KIT",
      description:
        "접근성과 반응형 웹 규격을 준수하는 재사용 가능한 UI 컴포넌트 라이브러리. 강렬한 테두리와 커스텀 그림자 시스템 포함.",
      image: "/images/project3.jpg",
      tags: ["React", "Storybook", "Tailwind CSS", "Framer Motion"],
      demoUrl: "https://github.com/sooa060728-sys",
      githubUrl: "https://github.com/sooa060728-sys",
      badgeBg: "bg-sky-300",
      headerBg: "bg-sky-400",
    },
  ];

  const experiences = [
    {
      period: "2024 - PRESENT",
      role: "FRONTEND LEAD",
      company: "Tech Innovation Corp",
      description: "Next.js 기반 웹 서비스 프론트엔드 아키텍처 설계 및 웹 성능 45% 개선 달성.",
      tagBg: "bg-yellow-300",
    },
    {
      period: "2023 - 2024",
      role: "UI/UX FRONTEND DEV",
      company: "Creative Studio",
      description: "반응형 웹 인터페이스 개발, 사용자 중심 디자인 시스템 구축 및 컴포넌트 라이브러리 개발.",
      tagBg: "bg-pink-300",
    },
    {
      period: "2022 - 2023",
      role: "OPENSOURCE & VIBE CODING",
      company: "Personal & Community",
      description: "다양한 웹 툴 및 반응형 템플릿 개발, GitHub 커뮤니티 오픈소스 프로젝트 활발한 참여.",
      tagBg: "bg-sky-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black font-sans selection:bg-yellow-300 selection:text-black dark:bg-zinc-950 dark:text-zinc-100 pb-20">
      
      {/* 1. 상단 굵은 마키(Marquee) 띠 */}
      <div className="w-full bg-yellow-300 border-b-4 border-black py-2 overflow-hidden flex items-center shadow-[0_4px_0_0_#000] dark:bg-yellow-400 dark:text-black">
        <div className="whitespace-nowrap flex items-center gap-6 animate-none font-mono font-black text-sm tracking-widest uppercase px-4">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 fill-black" /> SOOA LEE // PORTFOLIO 2026
          </span>
          <span>★</span>
          <span>VIBE CODING & FRONTEND ARCHITECTURE</span>
          <span>★</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 border border-black animate-pulse" />
            AVAILABLE FOR HIRE
          </span>
          <span>★</span>
          <span>NEXT.JS 16 & REACT 19</span>
          <span>★</span>
          <span>NEOBRUTALISM EDITION</span>
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        
        {/* 2. 레트로 OS 윈도우 스타일 프로필 헤더 카드 */}
        <div className="mb-10 rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] dark:bg-zinc-900 dark:border-white dark:shadow-[8px_8px_0px_0px_#fff] overflow-hidden">
          
          {/* 윈도우 컨트롤 상단바 */}
          <div className="bg-sky-300 border-b-4 border-black p-3.5 flex items-center justify-between dark:bg-sky-400 dark:text-black">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-red-400 border-2 border-black shadow-[1px_1px_0px_0px_#000]" />
              <span className="h-4 w-4 rounded-full bg-yellow-400 border-2 border-black shadow-[1px_1px_0px_0px_#000]" />
              <span className="h-4 w-4 rounded-full bg-emerald-400 border-2 border-black shadow-[1px_1px_0px_0px_#000]" />
              <span className="ml-2 font-mono text-xs font-black tracking-wider uppercase">
                PROFILE_SYSTEM_V2.6.EXE
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-extrabold bg-black text-white px-3 py-1 rounded border-2 border-black">
              <Terminal className="h-3.5 w-3.5" /> SYS_READY
            </div>
          </div>

          {/* 프로필 카드 내부 */}
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* 프로필 아바타 + 스티커 */}
              <div className="relative flex-shrink-0">
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl border-4 border-black bg-yellow-300 p-1.5 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
                  <img
                    src="/images/avatar.jpg"
                    alt="이수아 프로필"
                    className="h-full w-full object-cover rounded-xl border-2 border-black"
                  />
                  {/* 회전 스티커 태그 */}
                  <div className="absolute -top-3 -right-3 rotate-12 bg-pink-400 border-3 border-black text-black font-black text-xs px-2.5 py-1 rounded-md shadow-[3px_3px_0px_0px_#000]">
                    SOOA! 🚀
                  </div>
                  {/* 상태 조종 뱃지 */}
                  <div className="absolute -bottom-3 -left-3 -rotate-6 bg-emerald-300 border-3 border-black text-black font-extrabold text-xs px-2.5 py-1 rounded-md shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 border border-black animate-ping" />
                    ONLINE
                  </div>
                </div>
              </div>

              {/* 기본 정보 & 태그 */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
                    이수아
                  </h1>
                  <span className="inline-block bg-yellow-300 text-black border-2 border-black px-3 py-1 font-mono font-bold text-xs shadow-[3px_3px_0px_0px_#000] rotate-1">
                    SOOA LEE
                  </span>
                  <span className="inline-block bg-pink-300 text-black border-2 border-black px-3 py-1 font-mono font-bold text-xs shadow-[3px_3px_0px_0px_#000] -rotate-1">
                    FE DEV ⚡
                  </span>
                </div>

                <p className="text-base font-bold leading-relaxed text-black dark:text-zinc-200 max-w-2xl bg-slate-50 dark:bg-zinc-800 p-3.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                  👋 웹 기술로 강렬하고 가치 있는 사용자 경험을 제작하는 프론트엔드 개발자입니다. 
                  직관적인 UI와 반응형 인터랙션에 진심을 담아 바이브 코딩합니다.
                </p>

                {/* 네오브루탈 스티커 뱃지 */}
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 font-mono text-xs font-black">
                  <span className="bg-sky-200 text-black border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                    📍 SEOUL, KR
                  </span>
                  <span className="bg-purple-200 text-black border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                    💻 NEXT.JS 16
                  </span>
                  <span className="bg-emerald-200 text-black border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_#000]">
                    🎨 TAILWIND V4
                  </span>
                </div>

                {/* 액션 버튼 그룹 (하드 오프셋 그림자 & 클릭 서입 애니메이션) */}
                <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <a
                    href="https://github.com/sooa060728-sys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black font-black text-sm px-5 py-3 rounded-xl border-3 border-black shadow-[5px_5px_0px_0px_#FFE600] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#FFE600] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GITHUB PROFILES</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <a
                    href="mailto:contact@example.com"
                    className="inline-flex items-center gap-2 bg-pink-300 text-black font-black text-sm px-5 py-3 rounded-xl border-3 border-black shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none"
                  >
                    <Mail className="h-4 w-4" />
                    <span>CONTACT ME</span>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 bg-yellow-300 text-black font-black text-sm px-4 py-3 rounded-xl border-3 border-black shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none"
                    title="프로필 링크 복사"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-800" />
                        <span>COPIED! ⚡</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        <span>SHARE</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* 3. 네오브루탈 4색 스탯 카드 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.bg} border-4 border-black p-4.5 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] text-black transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded border border-black">
                    {stat.label}
                  </span>
                  <div className="p-1.5 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                    <Icon className="h-4 w-4 text-black" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-black pt-1">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. 스티커 네오브루탈 탭 바 */}
        <div className="mb-8 flex flex-wrap items-center gap-3 border-b-4 border-black pb-4">
          <button
            onClick={() => setActiveTab("projects")}
            className={`font-mono font-black text-sm px-5 py-3 rounded-xl border-3 border-black transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] ${
              activeTab === "projects"
                ? "bg-yellow-300 text-black translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]"
                : "bg-white text-black hover:bg-yellow-100 dark:bg-zinc-800 dark:text-white"
            }`}
          >
            📁 PROJECTS ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab("tech")}
            className={`font-mono font-black text-sm px-5 py-3 rounded-xl border-3 border-black transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] ${
              activeTab === "tech"
                ? "bg-sky-300 text-black translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]"
                : "bg-white text-black hover:bg-sky-100 dark:bg-zinc-800 dark:text-white"
            }`}
          >
            ⚡ TECH STACK
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`font-mono font-black text-sm px-5 py-3 rounded-xl border-3 border-black transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] ${
              activeTab === "experience"
                ? "bg-pink-300 text-black translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]"
                : "bg-white text-black hover:bg-pink-100 dark:bg-zinc-800 dark:text-white"
            }`}
          >
            📜 EXPERIENCE & TIMELINE
          </button>
        </div>

        {/* 5. 탭 1: 프로젝트 갤러리 */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border-4 border-black bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000]"
              >
                {/* 카드 상단 윈도우바 */}
                <div className={`${project.headerBg} border-b-4 border-black p-3.5 flex items-center justify-between text-black`}>
                  <span className="font-mono text-xs font-black tracking-wider uppercase truncate">
                    {project.subtitle}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="h-3 w-3 rounded-full bg-black" />
                    <span className="h-3 w-3 rounded-full bg-white border border-black" />
                  </div>
                </div>

                {/* 이미지 영역 */}
                <div className="relative h-52 w-full border-b-4 border-black bg-slate-100 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`${project.badgeBg} text-black font-mono font-black text-xs px-3 py-1 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_#000]`}>
                      FEATURED PROJECT 🚀
                    </span>
                  </div>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-black dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-700 dark:text-zinc-300 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t-3 border-black">
                    {/* 태그 목록 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-yellow-100 text-black border-2 border-black font-mono font-extrabold text-xs px-2.5 py-1 rounded-md shadow-[2px_2px_0px_0px_#000]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-3">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-yellow-300 text-black font-black text-xs px-4 py-2.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000]"
                      >
                        <span>LIVE DEMO</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black font-black text-xs px-4 py-2.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000]"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>SOURCE CODE</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. 탭 2: 기술 스택 (Tech Stack) */}
        {activeTab === "tech" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className={`${tech.bg} rounded-2xl border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] text-black transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black uppercase bg-black text-white px-2.5 py-1 rounded border border-black">
                    {tech.category}
                  </span>
                  <span className="bg-white font-mono text-xs font-black px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    {tech.level}
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight">{tech.name}</h3>
                <div className="mt-4 bg-white border-2 border-black p-2 rounded-lg text-xs font-mono font-bold flex items-center justify-between">
                  <span>PROFICIENCY LEVEL</span>
                  <span className="text-emerald-700">100% MATCH</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. 탭 3: 경력 & 타임라인 */}
        {activeTab === "experience" && (
          <div className="rounded-2xl border-4 border-black bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] mb-12">
            <h2 className="font-mono font-black text-xl text-black dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              CAREER & TIMELINE HISTORY
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border-3 border-black p-5 bg-slate-50 dark:bg-zinc-800 shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`${exp.tagBg} font-mono font-black text-xs text-black px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_#000]`}>
                      {exp.period}
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-500 dark:text-zinc-400">
                      @ {exp.company}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-black dark:text-white mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. 하단 네오브루탈 풋터 */}
        <footer className="mt-16 border-t-4 border-black pt-8 text-center font-mono font-extrabold text-xs text-black dark:text-zinc-300 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Smile className="h-4 w-4 text-yellow-500" />
            <span>DESIGNED & BUILT WITH NEOBRUTALISM STYLE // NEXT.JS 16 & TAILWIND V4</span>
          </div>
          <p>© {new Date().getFullYear()} SOOA LEE. ALL RIGHTS RESERVED.</p>
        </footer>

      </main>
    </div>
  );
}
