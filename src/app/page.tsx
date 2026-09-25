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
  const [activeTab, setActiveTab] = useState<"projects" | "experience">("projects");

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const techStack = [
    { name: "Next.js 16", category: "Framework", level: "Expert" },
    { name: "React 19", category: "Library", level: "Expert" },
    { name: "TypeScript", category: "Language", level: "Advanced" },
    { name: "Tailwind CSS v4", category: "Styling", level: "Expert" },
    { name: "State Mgmt", category: "Zustand / TanStack", level: "Advanced" },
    { name: "UI/UX Design", category: "Figma", level: "Intermediate" },
  ];

  const stats = [
    { label: "총 프로젝트", value: "12+", icon: FolderGit2 },
    { label: "개발 경력", value: "3년+", icon: Briefcase },
    { label: "주요 기여", value: "1.2k+", icon: Code2 },
    { label: "커뮤니티 스타", value: "340+", icon: Award },
  ];

  const projects = [
    {
      id: "mylink",
      title: "MyLink - 퍼스널 바이오 링크 플랫폼",
      description:
        "개발자와 크리에이터를 위한 반응형 멀티링크 프로필 생성 서비스입니다. 커스텀 테마, 실시간 통계 분석 및 모바일 최적화 레이아웃을 제공합니다.",
      image: "/images/project1.jpg",
      tags: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript"],
      demoUrl: "https://github.com/sooa060728-sys",
      githubUrl: "https://github.com/sooa060728-sys",
      featured: true,
    },
    {
      id: "ai-assistant",
      title: "AI 코드 어시스턴트 대시보드",
      description:
        "AI 프롬프트 생성 및 코드 리팩토링 작업을 관리하는 웹 대시보드 인터페이스. 다크 모드, 코드 하이라이팅 및 실시간 응답 차트 지원.",
      image: "/images/project2.jpg",
      tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      demoUrl: "https://github.com/sooa060728-sys",
      githubUrl: "https://github.com/sooa060728-sys",
      featured: true,
    },
    {
      id: "design-system",
      title: "Vibe UI 디자인 시스템 컴포넌트",
      description:
        "접근성과 반응형 웹 규격을 준수하는 재사용 가능한 UI 컴포넌트 라이브러리. 다채로운 애니메이션과 테마 커스텀 기능 포함.",
      image: "/images/project3.jpg",
      tags: ["React", "Storybook", "Tailwind CSS", "Framer Motion"],
      demoUrl: "https://github.com/sooa060728-sys",
      githubUrl: "https://github.com/sooa060728-sys",
      featured: false,
    },
  ];

  const experiences = [
    {
      period: "2024 - 현재",
      role: "프론트엔드 리드 개발자",
      company: "Tech Innovation Corp",
      description: "Next.js 기반 웹 서비스 프론트엔드 아키텍처 설계 및 웹 성능 45% 개선 달성.",
    },
    {
      period: "2023 - 2024",
      role: "UI/UX 프론트엔드 개발자",
      company: "Creative Studio",
      description: "반응형 웹 인터페이스 개발, 사용자 중심 디자인 시스템 구축 및 컴포넌트 라이브러리 개발.",
    },
    {
      period: "2022 - 2023",
      role: "오픈소스 기여 & 바이브 코딩 프로젝트",
      company: "Personal & Community",
      description: "다양한 웹 툴 및 반응형 템플릿 개발, GitHub 커뮤니티 오픈소스 프로젝트 활발한 참여.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white pb-16">
      {/* 1. 상단 커버 배너 영역 */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <img
          src="/images/cover.jpg"
          alt="Profile Cover Banner"
          className="h-full w-full object-cover object-center opacity-85 mix-blend-overlay transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/30 dark:from-zinc-950" />

        {/* 상단 뱃지 및 액션 */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/20 shadow-lg">
            <MapPin className="h-3.5 w-3.5 text-pink-400" />
            서울, 대한민국
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Available for Work
          </span>
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 2. 프로필 헤더 카드가 커버 위로 부분 오버랩 */}
        <div className="relative -mt-20 sm:-mt-24 mb-8">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              {/* 좌측: 아바타 + 기본 정보 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-end gap-5 text-center sm:text-left">
                {/* 아바타 이미지 */}
                <div className="relative group flex-shrink-0">
                  <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/25 transition-transform duration-300 group-hover:scale-105">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src="/images/avatar.jpg"
                        alt="이수아 프로필"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-full bg-indigo-600 p-2 text-white shadow-md ring-4 ring-white dark:ring-zinc-900">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>

                {/* 이름 & 소개 */}
                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      이수아
                    </h1>
                    <span className="text-sm font-semibold text-slate-400 dark:text-zinc-500">
                      (Sooa Lee)
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                      <Sparkles className="h-3 w-3" /> Junior Frontend Dev
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                    웹 기술로 가치 있는 사용자 경험을 만들어가는 프론트엔드 개발자입니다. 
                    직관적인 UI 디자인과 쾌적한 반응형 인터랙션을 지향합니다.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-indigo-500" /> Web & Mobile Tech
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-purple-500" /> UI Systems
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Vibe Coding Enthusiast
                    </span>
                  </div>
                </div>
              </div>

              {/* 우측: 액션 버튼 그룹 */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 pt-2 md:pt-0">
                <a
                  href="https://github.com/sooa060728-sys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="mailto:contact@example.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span>이메일 문의</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  title="프로필 링크 복사"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Share2 className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 3. 스탯 요약 그리드 (4개 카드로 구성) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    {stat.label}
                  </span>
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. 메인 2컬럼 레이아웃 (반응형: lg 기준 Sidebar + Main Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 사이드바 (Left Column) */}
          <div className="space-y-6">
            
            {/* 내 소개 (About Me) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-4">
                <Heart className="h-4 w-4 text-pink-500" />
                About Me
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                사용자가 첫눈에 매료되고 편안하게 사용할 수 있는 웹 인터페이스를 구현하는 것을 좋아합니다. 
                최신 Next.js 프레임워크와 반응형 CSS 설계를 활용하여 빠르게 작동하는 모던 아키텍처 구축에 흥미를 갖고 있습니다.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap gap-1.5">
                {["#Frontend", "#ResponsiveDesign", "#UI/UX", "#NextJS16", "#CleanCode"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 주요 기술 스택 (Tech Stack) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-4">
                <Code2 className="h-4 w-4 text-indigo-500" />
                Tech Stack
              </h2>
              <div className="space-y-3">
                {techStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        {tech.name}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500">
                        {tech.category}
                      </div>
                    </div>
                    <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                      {tech.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 빠른 링크 / 소셜 채널 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-4">
                <Globe className="h-4 w-4 text-emerald-500" />
                Social Channels
              </h2>
              <div className="space-y-2.5">
                <a
                  href="https://github.com/sooa060728-sys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                      <GithubIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        GitHub
                      </div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500">
                        sooa060728-sys
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>

                <a
                  href="mailto:contact@example.com"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500 text-white">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        Email Contact
                      </div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500">
                        contact@example.com
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </a>
              </div>
            </div>

          </div>

          {/* 메인 콘텐츠 영역 (Right Column: 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 탭 헤더 */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold transition-all relative ${
                    activeTab === "projects"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <FolderGit2 className="h-4 w-4" />
                  <span>대표 프로젝트</span>
                  <span className="ml-1 rounded-full bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {projects.length}
                  </span>
                  {activeTab === "projects" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("experience")}
                  className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold transition-all relative ${
                    activeTab === "experience"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>경력 & 활동</span>
                  {activeTab === "experience" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* 탭 1: 프로젝트 갤러리 */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/80 flex flex-col md:flex-row"
                  >
                    {/* 프로젝트 썸네일 이미지 */}
                    <div className="relative h-48 md:h-auto md:w-2/5 overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-zinc-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                      {project.featured && (
                        <span className="absolute top-3 left-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* 프로젝트 정보 */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                        {/* 태그 목록 */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* 링크 버튼 */}
                        <div className="flex items-center gap-3">
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <span>자세히 보기</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            <span>Source Code</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 탭 2: 경력 & 활동 타임라인 */}
            {activeTab === "experience" && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-3 space-y-8 py-2">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 sm:pl-8 group">
                      {/* 타임라인 포인트 노드 */}
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-indigo-600 ring-4 ring-indigo-100 dark:border-zinc-900 dark:ring-indigo-950 transition-transform group-hover:scale-125" />
                      
                      <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-1">
                        {exp.period}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {exp.role} <span className="text-slate-400 font-normal">@ {exp.company}</span>
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 5. 푸터 하단 */}
        <footer className="mt-16 border-t border-slate-200/80 dark:border-zinc-800/80 pt-8 text-center text-xs text-slate-400 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} 이수아 (Sooa Lee). Designed & Built with Next.js & Tailwind CSS.</p>
        </footer>
      </main>
    </div>
  );
}
