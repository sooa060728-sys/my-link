"use client";

import { useState } from "react";
import {
  ChevronRight,
  Search,
  User,
  Mail,
  HelpCircle,
  Bell,
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [selectedPoll, setSelectedPoll] = useState("nextjs");
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const newsList = [
    {
      id: 1,
      category: "ANNOUNCEMENT",
      title: "MyLink 2.0 Release: Next.js 16 & React 19 Architecture Launched",
      date: "09.25.2026",
    },
    {
      id: 2,
      category: "SYSTEMS",
      title: "Vibe UI Component Kit Achieves 100% Performance Score",
      date: "09.20.2026",
    },
    {
      id: 3,
      category: "COMMUNITY",
      title: "Player's Choice Award: Front-End Developer Sooa Lee Featured",
      date: "09.15.2026",
    },
  ];

  const featuredSites = [
    {
      title: "MyLink Bio Platform",
      url: "www.mylink.dev",
      image: "/images/project1.jpg",
      rating: "E",
    },
    {
      title: "AI Code Assistant",
      url: "www.aistudio.dev",
      image: "/images/project2.jpg",
      rating: "E",
    },
    {
      title: "Vibe UI Kit",
      url: "www.vibe-ui.com",
      image: "/images/project3.jpg",
      rating: "E",
    },
    {
      title: "Console Hardware UI",
      url: "www.nintendo2001.dev",
      image: "/images/cover.jpg",
      rating: "T",
    },
  ];

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans antialiased selection:bg-[#f68d1f] selection:text-white p-2 sm:p-4 md:p-6">
      
      {/* 고정 폭 캔버스 메인 컨테이너 (~820px 마스크 콘솔 섀시) */}
      <div className="mx-auto max-w-[840px] bg-[#7a8aba] bevel-plate p-2 sm:p-3 shadow-2xl relative">
        
        {/* 1. Masthead (마스헤드: 마스코트 말풍선 + 검색 영역) */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2 px-2 pt-1">
          {/* 좌측: 마리오/캐릭터 마스코트 & 말풍선 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#e60012] border-2 border-white flex items-center justify-center font-black text-white text-xl shadow-md">
                M
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#f68d1f] text-white text-[9px] font-bold px-1 rounded border border-black">
                2001
              </span>
            </div>
            
            {/* 말풍선 */}
            <div className="relative bg-white text-[#21242e] border-2 border-[#3d4f97] rounded-xl px-3 py-1.5 shadow">
              <div className="text-[11px] font-bold leading-tight uppercase tracking-wider">
                Welcome to Nintendo.com / Sooa.dev! 🎮
              </div>
              <div className="text-[10px] text-[#60619c]">
                Brushed Periwinkle Hardware Edition
              </div>
              {/* 말풍선 꼬리 */}
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#3d4f97]" />
            </div>
          </div>

          {/* 우측: 2001형 검색 모듈 */}
          <div className="flex items-center gap-1.5 bg-[#9fbee7] bevel-inset p-1.5 rounded">
            <span className="text-[11px] font-bold text-[#21242e] uppercase tracking-wider pl-1">
              SEARCH:
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Game or System..."
              className="w-28 sm:w-36 h-5 bg-white text-[11px] text-[#21242e] px-1.5 border border-[#3d4f97] outline-none"
            />
            <select className="h-5 bg-white text-[10px] font-bold text-[#21242e] border border-[#3d4f97] px-1">
              <option>ALL</option>
              <option>GAMES</option>
              <option>SYSTEMS</option>
            </select>
            <button className="bg-[#ecab37] hover:bg-[#e48600] text-[#21242e] font-black text-[10px] uppercase px-2 py-0.5 bevel-chip active:translate-y-0.5">
              GO
            </button>
          </div>
        </header>

        {/* 2. Dual Navigation Bar (이중 네비게이션 바) */}
        <div className="mb-3">
          {/* Primary Carbon Nav Bar */}
          <nav className="carbon-slab text-white flex flex-wrap items-center justify-between px-3 py-1.5 border-t-2 border-l-2 border-[#545a6e] border-b-2 border-r-2 border-black shadow">
            
            {/* Nintendo Racetrack Logo Pill */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full px-3 py-0.5 border-2 border-[#e60012] flex items-center justify-center">
                <span className="text-[#e60012] font-black italic text-xs tracking-tighter uppercase">
                  Nintendo®
                </span>
              </div>

              {/* Gold Section Navigation Words */}
              <div className="flex items-center gap-3 sm:gap-5 text-[13px] font-bold uppercase tracking-wide">
                <a href="#games" className="text-[#e48600] hover:text-white transition-colors">
                  GAMES
                </a>
                <a href="#systems" className="text-[#e48600] hover:text-white transition-colors">
                  SYSTEMS
                </a>
                <a href="#news" className="text-[#e48600] hover:text-white transition-colors">
                  NEWS
                </a>
                <a href="#profile" className="text-[#e48600] hover:text-white transition-colors underline decoration-2 underline-offset-4">
                  PROFILE
                </a>
                <a href="#downloads" className="text-[#e48600] hover:text-white transition-colors">
                  DOWNLOADS
                </a>
              </div>
            </div>

            {/* Right Amber Utility Chips */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="bg-[#ecab37] text-[#21242e] text-[10px] font-extrabold uppercase px-2 py-0.5 bevel-chip hover:bg-[#e48600]">
                CODE BANK
              </button>
              <button className="bg-[#ecab37] text-[#21242e] text-[10px] font-extrabold uppercase px-2 py-0.5 bevel-chip hover:bg-[#e48600]">
                GAME FINDER
              </button>
            </div>
          </nav>

          {/* Secondary Subnav Strip (Pale Sky) */}
          <div className="bg-[#9fbee7] border-b-2 border-r-2 border-[#3d4f97] border-l-2 border-[#a4b4e4] px-3 py-1 flex items-center justify-between text-[11px] font-bold text-[#21242e]">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="hover:underline cursor-pointer">PARENTS</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">CUSTOMER SERVICE</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">CORPORATE</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">GLOBAL</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">PRIVACY POLICY</span>
            </div>
            <div className="hidden md:block text-[#3d4f97] font-mono text-[10px]">
              VER: 2001.09.25
            </div>
          </div>
        </div>

        {/* 3. Main Layout Body with Left Rotated Rail & 2-Column Split */}
        <div className="flex gap-2">
          
          {/* Left Rail Rotated Tabs */}
          <div className="hidden sm:flex flex-col gap-1 w-7 flex-shrink-0 pt-2">
            {["TOP TEN", "PROJECTS", "PLAYER'S CHOICE", "ESRB RATINGS"].map((tab, idx) => (
              <div
                key={idx}
                className="carbon-slab text-[#9fbee7] border border-black text-[9px] font-bold py-3 px-0.5 text-center cursor-pointer hover:bg-[#353a4a] transition-colors"
                style={{ writingMode: "vertical-rl", textTransform: "uppercase" }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* 메인 2컬럼 레이아웃 */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Left 2-Thirds Content Column */}
            <div className="md:col-span-2 space-y-3">
              
              {/* A. Photographic Hero Field Plate */}
              <div className="bg-[#acace7] bevel-plate p-4 sm:p-5 relative overflow-hidden chamfered">
                <div className="absolute inset-0 bg-gradient-to-r from-[#acace7] via-transparent to-black/20" />
                <div className="relative z-10 space-y-2">
                  <div className="inline-block bg-[#f68d1f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black">
                    FEATURED PROFILE HERO // 2001
                  </div>
                  
                  {/* Box-Art Display Title */}
                  <h2 className="box-art-text text-3xl sm:text-4xl tracking-tight leading-none uppercase">
                    SOOA LEE // FRONTEND
                  </h2>
                  
                  <p className="text-[12px] font-bold text-[#21242e] max-w-md leading-snug">
                    "Gorgeous graphics, great sound, built on Next.js 16 & React 19 architecture." 
                    웹 기술로 가치 있는 사용자 경험을 만들어가는 프론트엔드 개발자입니다.
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="https://github.com/sooa060728-sys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#f68d1f] hover:bg-[#e48600] text-white text-[11px] font-black uppercase px-4 py-2 rounded-full bevel-orange shadow active:translate-y-0.5"
                    >
                      <span>EXPLORE PROJECTS</span>
                      <div className="w-5 h-5 rounded-full bg-white text-[#f68d1f] flex items-center justify-center font-bold">
                        ➔
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* B. Official News List Panel */}
              <div className="bg-[#8ba1d4] bevel-plate p-3">
                {/* Panel Header Bar */}
                <div className="bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1.5 mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#21242e] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-[#f68d1f]">≡</span> OFFICIAL NEWS & ANNOUNCEMENTS
                  </span>
                  <span className="text-[10px] font-bold text-[#3d4f97]">UPDATED DAILY</span>
                </div>

                {/* News Rows on Platinum Gray */}
                <div className="space-y-1.5">
                  {newsList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#dedede] bevel-inset p-2 flex items-center justify-between gap-2 hover:bg-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="bg-[#3d4f97] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                          {item.category}
                        </span>
                        <a
                          href="https://github.com/sooa060728-sys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] font-bold text-[#3d4f97] group-hover:text-[#e60012] truncate"
                        >
                          {item.title}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-[#60619c] font-mono hidden sm:inline">
                          {item.date}
                        </span>
                        <div className="w-4 h-4 bg-[#f68d1f] text-white text-[10px] font-black rounded flex items-center justify-center group-hover:bg-[#e48600]">
                          &gt;
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* C. Featured Projects 2x2 Grid */}
              <div className="bg-[#8ba1d4] bevel-plate p-3">
                <div className="bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1.5 mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#21242e] uppercase tracking-wider">
                    ≡ FEATURED PROJECTS & TITLES
                  </span>
                  <span className="text-[10px] font-bold text-[#3d4f97]">SELECT TITLE</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {featuredSites.map((site, idx) => (
                    <div
                      key={idx}
                      className="bg-[#dedede] bevel-plate p-2 flex gap-2 items-center hover:border-[#f68d1f] transition-all cursor-pointer"
                    >
                      {/* Fixed thumbnail frame */}
                      <div className="w-[85px] h-[55px] bg-[#21242e] border border-[#3d4f97] flex-shrink-0 overflow-hidden relative">
                        <img
                          src={site.image}
                          alt={site.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 bg-white text-[#21242e] font-black text-[9px] px-1 border border-black rounded-xs">
                          {site.rating}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-[#21242e] leading-tight truncate">
                          {site.title}
                        </div>
                        <div className="text-[9px] font-mono text-[#3d4f97] truncate">
                          {site.url}
                        </div>
                        <span className="inline-block mt-1 bg-[#ecab37] text-[#21242e] font-black text-[9px] px-1 rounded bevel-chip">
                          PLAY IT ON NEXT.JS
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* D. Player's Poll Panel */}
              <div className="bg-[#8ba1d4] bevel-plate p-3">
                <div className="bg-[#7a8aba] border-b-2 border-[#3d4f97] pb-1.5 mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#21242e] uppercase tracking-wider">
                    ≡ PLAYER'S POLL // WEEKLY VOTE
                  </span>
                  <span className="text-[10px] font-bold text-[#e60012]">LIVE</span>
                </div>

                <div className="bg-[#c0d5e6] bevel-inset p-3 rounded">
                  <p className="text-[12px] font-bold text-[#21242e] mb-2">
                    Q: Which Front-End Architecture provides the best web-console experience?
                  </p>

                  <div className="space-y-1.5 mb-3">
                    {[
                      { id: "nextjs", label: "Next.js 16 App Router (Turbopack)" },
                      { id: "react", label: "React 19 Concurrent UI Components" },
                      { id: "tailwind", label: "Tailwind CSS v4 Neobrutalist Hardware" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2 text-[11px] font-bold text-[#21242e] cursor-pointer hover:text-[#3d4f97]"
                      >
                        <input
                          type="radio"
                          name="poll"
                          value={opt.id}
                          checked={selectedPoll === opt.id}
                          onChange={(e) => setSelectedPoll(e.target.value)}
                          className="accent-[#f68d1f]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#9fbee7]">
                    <button
                      onClick={() => setPollSubmitted(true)}
                      className="bg-[#f68d1f] hover:bg-[#e48600] text-white text-[11px] font-black uppercase px-4 py-1 bevel-orange active:translate-y-0.5"
                    >
                      {pollSubmitted ? "VOTE RECORDED! ✓" : "SUBMIT VOTE"}
                    </button>
                    <span className="text-[10px] font-bold text-[#60619c]">
                      TOTAL VOTES: 1,482
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 1-Third Action Rail */}
            <div className="space-y-3">
              
              {/* Carbon Action Buttons Slabs */}
              <div className="space-y-1.5">
                {[
                  { label: "LOGIN / ACCOUNT", icon: User },
                  { label: "SUBSCRIBE NEWSLETTER", icon: Mail },
                  { label: "DEVELOPER HELP & FAQ", icon: HelpCircle },
                  { label: "SYSTEM STATUS: ONLINE", icon: Sparkles },
                ].map((btn, idx) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full carbon-slab text-white text-[11px] font-black uppercase tracking-wider py-2 px-3 border-t border-l border-[#545a6e] border-b-2 border-r-2 border-black flex items-center justify-between hover:bg-[#353a4a] transition-colors active:translate-y-0.5"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#ecab37]" />
                        {btn.label}
                      </span>
                      <span className="text-[#f68d1f] font-bold">➔</span>
                    </button>
                  );
                })}
              </div>

              {/* Info Box: What Is Sooa.dev */}
              <div className="bg-white bevel-plate p-3">
                <div className="bg-[#ecab37] text-[#21242e] font-black text-[10px] uppercase px-2 py-1 mb-2 bevel-chip flex items-center justify-between">
                  <span>WHAT IS — SOOA.DEV?</span>
                  <span>INFO</span>
                </div>
                <p className="text-[11px] font-bold text-[#21242e] leading-relaxed">
                  Sooa.dev는 웹 기술을 콘솔 하드웨어 감성으로 승화시킨 프론트엔드 포트폴리오 스튜디오입니다. 
                  Next.js 16과 React 19를 기반으로 최상의 인터랙티브 웹 경험을 제공합니다.
                </p>
              </div>

              {/* GBA Side Promo Card */}
              <div className="bg-[#acace7] bevel-plate p-3">
                <div className="text-[10px] font-black text-[#3d4f97] uppercase mb-1">
                  HARDWARE HIGHLIGHT
                </div>
                <div className="box-art-text text-xl uppercase leading-none mb-2">
                  GAME BOY ADVANCE
                </div>
                <div className="bg-[#21242e] border border-[#3d4f97] h-24 overflow-hidden mb-2 relative">
                  <img
                    src="/images/cover.jpg"
                    alt="Hardware Render"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-1 right-1 bg-[#f68d1f] text-white text-[9px] font-bold px-1 rounded">
                    32-BIT POWER
                  </div>
                </div>
                <a
                  href="https://github.com/sooa060728-sys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[#ecab37] text-[#21242e] text-[10px] font-black uppercase py-1 bevel-chip hover:bg-[#e48600]"
                >
                  VIEW SPECS & SOURCE ➔
                </a>
              </div>

              {/* Player's Choice Badge Box */}
              <div className="bg-[#dedede] bevel-inset p-3 text-center">
                <div className="text-[10px] font-black text-[#60619c] uppercase tracking-wider mb-1">
                  QUALITY SEAL
                </div>
                <div className="inline-block bg-[#e60012] text-white font-black text-[12px] px-3 py-1 rounded-full border-2 border-white shadow">
                  PLAYER'S CHOICE
                </div>
                <p className="text-[10px] text-[#21242e] font-bold mt-1.5">
                  Over 1,000,000 Users Served
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* 4. Footer (푸터 카본 슬래브) */}
        <footer className="mt-4 carbon-slab text-white border-t-2 border-l-2 border-[#545a6e] border-b-2 border-r-2 border-black p-3 flex flex-col sm:flex-row items-center justify-between gap-3 chamfered">
          <div className="text-[10px] text-[#9fbee7] font-mono leading-tight text-center sm:text-left">
            <div>©1997–2001 Nintendo / Sooa Lee. All Rights Reserved.</div>
            <div>Trademarks belong to their respective owners. Powered by Next.js 16.</div>
          </div>

          {/* ESRB Privacy Certified Badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#ecab37] text-[#21242e] font-black text-[10px] px-2 py-1 rounded border border-black bevel-chip flex items-center gap-1">
              <span>ESRB</span>
              <span>—</span>
              <span>PRIVACY CERTIFIED</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
