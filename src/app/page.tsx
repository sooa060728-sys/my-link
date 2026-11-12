'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Loader2,
  ArrowRight,
  BarChart3,
  Palette,
  Zap,
  Link2,
  LogIn,
  Plus,
  Share2,
  Code2,
  PenLine,
  Briefcase,
  MousePointerClick,
  Flame,
  Sparkles,
} from 'lucide-react';
import { ThemeType } from '@/types';

/* =========================================================================
 * 데이터 정의
 * ========================================================================= */

// 헤드라인에서 돌아가며 바뀌는 단어
const ROTATING_WORDS = ['GitHub', '블로그', '포트폴리오', '이력서'];

// 목업 프로필에 들어갈 샘플 링크
const SAMPLE_LINKS = [
  { id: 'github', title: 'GitHub', icon: Code2, initialClicks: 128 },
  { id: 'blog', title: '기술 블로그', icon: PenLine, initialClicks: 74 },
  { id: 'portfolio', title: '포트폴리오', icon: Briefcase, initialClicks: 52 },
];

// 테마 미리보기 (ThemeContainer의 실제 테마와 같은 색감)
const THEMES: { id: ThemeType; label: string; swatch: string; card: string; link: string; text: string; sub: string }[] = [
  {
    id: 'light',
    label: '라이트',
    swatch: 'bg-slate-50 border-slate-300',
    card: 'bg-slate-50',
    link: 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100',
    text: 'text-slate-900',
    sub: 'text-slate-500',
  },
  {
    id: 'dark',
    label: '다크',
    swatch: 'bg-slate-950 border-slate-700',
    card: 'bg-slate-950',
    link: 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700',
    text: 'text-slate-100',
    sub: 'text-slate-400',
  },
  {
    id: 'neon',
    label: '네온',
    swatch: 'bg-gray-950 border-emerald-400',
    card: 'bg-gray-950 font-mono',
    link: 'bg-gray-900 border-emerald-400/60 text-emerald-400 hover:bg-emerald-400/10',
    text: 'text-emerald-400',
    sub: 'text-emerald-400/60',
  },
  {
    id: 'pastel',
    label: '파스텔',
    swatch: 'bg-gradient-to-br from-rose-200 via-purple-200 to-sky-200 border-purple-200',
    card: 'bg-gradient-to-br from-rose-100 via-purple-100 to-sky-100',
    link: 'bg-white/70 border-white text-slate-800 hover:bg-white',
    text: 'text-slate-800',
    sub: 'text-slate-500',
  },
  {
    id: 'minimal',
    label: '미니멀',
    swatch: 'bg-stone-100 border-stone-400',
    card: 'bg-stone-100',
    link: 'bg-transparent border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-100',
    text: 'text-stone-900',
    sub: 'text-stone-500',
  },
  {
    id: 'gradient',
    label: '그라데이션',
    swatch: 'bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 border-indigo-400',
    card: 'bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500',
    link: 'bg-white/15 border-white/30 text-white hover:bg-white/25',
    text: 'text-white',
    sub: 'text-white/70',
  },
];

const FEATURES = [
  {
    icon: Link2,
    title: '링크 하나로 끝',
    desc: '흩어진 GitHub, 블로그, 포트폴리오를 나만의 주소 한 곳에 모아요.',
    tint: 'bg-[#E8F3FF] text-[#3182F6]',
  },
  {
    icon: BarChart3,
    title: '클릭 통계',
    desc: '어떤 링크가 인기 있는지 차트로 한눈에 확인해요.',
    tint: 'bg-[#E5F6EC] text-[#20874E]',
  },
  {
    icon: Palette,
    title: '6가지 테마',
    desc: '라이트부터 네온까지, 내 분위기에 맞게 골라 입혀요.',
    tint: 'bg-[#F3EEFF] text-[#7C4DFF]',
  },
  {
    icon: Zap,
    title: '실시간 반영',
    desc: '수정하면 바로 저장되고, 다른 기기에서도 곧바로 보여요.',
    tint: 'bg-[#FFF6E0] text-[#E0A100]',
  },
];

const STEPS = [
  { icon: LogIn, title: 'Google로 로그인', desc: '회원가입 없이 3초면 시작해요.' },
  { icon: Plus, title: '링크 추가', desc: '제목과 주소만 넣으면 끝이에요.' },
  { icon: Share2, title: '내 주소 공유', desc: '프로필 링크를 어디든 붙여넣어요.' },
];

/* =========================================================================
 * 헤드라인 회전 단어
 * ========================================================================= */
function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block align-bottom">
      <span key={index} className="ml-word-in inline-block text-[#185EF7]">
        {ROTATING_WORDS[index]}
      </span>
      {/* 형광펜 밑줄 */}
      <span className="absolute left-0 right-0 bottom-[0.08em] h-[0.22em] -z-10 rounded-full bg-[#185EF7]/15" />
    </span>
  );
}

/* =========================================================================
 * 인터랙티브 프로필 목업 (테마 변경 + 클릭 카운트)
 * ========================================================================= */
function ProfileMockup() {
  const [themeId, setThemeId] = useState<ThemeType>('light');
  const [clicks, setClicks] = useState<Record<string, number>>(() =>
    Object.fromEntries(SAMPLE_LINKS.map((l) => [l.id, l.initialClicks]))
  );
  const [pops, setPops] = useState<{ id: number; linkId: string }[]>([]);
  const popIdRef = useRef(0);

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);
  const topLinkId = Object.entries(clicks).sort((a, b) => b[1] - a[1])[0][0];

  const handleLinkClick = (linkId: string) => {
    setClicks((prev) => ({ ...prev, [linkId]: prev[linkId] + 1 }));
    const popId = ++popIdRef.current;
    setPops((prev) => [...prev, { id: popId, linkId }]);
    setTimeout(() => setPops((prev) => prev.filter((p) => p.id !== popId)), 900);
  };

  return (
    <div className="w-full max-w-[340px] sm:max-w-sm mx-auto">
      <div className="relative">
        {/* 떠다니는 배지: 총 클릭수 */}
        <div className="ml-float absolute -left-3 sm:-left-10 top-16 z-20 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 tds-shadow-3 border border-[#E5E8EB]">
          <div className="w-8 h-8 rounded-xl bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center">
            <MousePointerClick className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-[10px] font-medium text-[#8B95A1]">총 클릭수</div>
            <div className="text-sm font-extrabold text-[#191F28] tabular-nums">{totalClicks.toLocaleString()}</div>
          </div>
        </div>

        {/* 떠다니는 배지: 인기 링크 */}
        <div className="ml-float-delay absolute -right-2 sm:-right-8 bottom-20 z-20 flex items-center gap-1.5 rounded-full bg-[#191F28] px-3 py-1.5 text-white tds-shadow-3">
          <Flame className="w-3.5 h-3.5 text-[#FFC342]" />
          <span className="text-[11px] font-bold">
            인기 · {SAMPLE_LINKS.find((l) => l.id === topLinkId)?.title}
          </span>
        </div>

        {/* 프로필 카드 */}
        <div
          className={`relative rounded-[28px] p-5 sm:p-6 border border-black/5 shadow-[0_24px_60px_rgba(25,31,40,0.14),0_2px_8px_rgba(25,31,40,0.05)] transition-colors duration-500 lg:rotate-2 lg:hover:rotate-0 lg:transition-transform ${theme.card}`}
        >
          <div className="flex flex-col items-center text-center pt-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3182F6] to-[#7C4DFF] flex items-center justify-center text-white text-xl font-black ring-4 ring-white/60">
              ML
            </div>
            <div className={`mt-3 font-extrabold text-base ${theme.text}`}>@mylink_dev</div>
            <div className={`text-xs mt-0.5 ${theme.sub}`}>프론트엔드 개발자 · 코드로 이야기해요</div>
          </div>

          <div className="mt-5 space-y-2.5">
            {SAMPLE_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative w-full h-12 rounded-2xl border flex items-center px-4 gap-3 text-sm font-semibold transition-all active:scale-[0.97] cursor-pointer ${theme.link}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{link.title}</span>
                  <span className="text-[11px] font-medium opacity-60 tabular-nums">{clicks[link.id]}</span>

                  {pops
                    .filter((p) => p.linkId === link.id)
                    .map((p) => (
                      <span
                        key={p.id}
                        className="ml-pop pointer-events-none absolute left-1/2 -top-1 text-xs font-black text-[#3182F6]"
                      >
                        +1
                      </span>
                    ))}
                </button>
              );
            })}
          </div>

          <p className={`mt-4 text-[11px] text-center ${theme.sub}`}>👆 링크를 눌러 보세요</p>
        </div>
      </div>

      {/* 테마 선택 칩 */}
      <div className="mt-7">
        <div className="text-xs font-semibold text-[#8B95A1] mb-2.5 text-center">테마를 바꿔 보세요</div>
        <div className="flex flex-wrap justify-center gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setThemeId(t.id)}
              aria-pressed={themeId === t.id}
              className={`flex items-center gap-1.5 rounded-full border pl-1.5 pr-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                themeId === t.id
                  ? 'border-[#185EF7] bg-[#EEF5FF] text-[#185EF7]'
                  : 'border-[#E5E8EB] bg-white text-[#4E5968] hover:border-[#B0B8C1]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border ${t.swatch}`} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * Google 로고
 * ========================================================================= */
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.35 11.1H12v3.16h5.36c-.24 1.4-1.02 2.59-2.18 3.39v2.8h3.53c2.06-1.9 3.25-4.7 3.25-8.05 0-.44-.04-.89-.11-1.3z" fill="#ffffff" />
      <path d="M12 21c2.43 0 4.47-.8 5.96-2.17l-3.53-2.8c-.81.54-1.84.86-2.93.86-2.25 0-4.16-1.52-4.84-3.57H2.98v2.88C4.46 19.14 7.97 21 12 21z" fill="#ffffff" />
      <path d="M7.16 13.32c-.17-.52-.27-1.08-.27-1.65 0-.58.1-1.13.27-1.65V7.14H2.98A9.97 9.97 0 0 0 2 11.67c0 1.61.39 3.14 1.07 4.53l4.09-2.88z" fill="#ffffff" />
      <path d="M12 5.51c1.32 0 2.51.46 3.45 1.35l2.58-2.58C16.46 2.8 14.42 2 12 2 7.97 2 4.46 3.86 2.98 6.81l4.18 2.88c.68-2.05 2.59-3.57 4.84-3.57z" fill="#ffffff" />
    </svg>
  );
}

/* =========================================================================
 * 랜딩 페이지
 * ========================================================================= */
export default function LandingPage() {
  const router = useRouter();
  const { user, loading, isLoggingIn, login } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 로그인에 성공하면 마이링크 본 페이지(/my)로 자동 이동
  const handleGoogleLogin = async () => {
    try {
      const loggedUser = await login();
      if (loggedUser) {
        setIsRedirecting(true);
        router.push('/my');
      }
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== 'auth/popup-closed-by-user') {
        alert('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  // 이미 로그인되어 있는 경우
  const handleGoToMyPage = () => {
    setIsRedirecting(true);
    router.push('/my');
  };

  const isBusy = isLoggingIn || isRedirecting;
  const handlePrimaryCta = user ? handleGoToMyPage : handleGoogleLogin;

  // 메인 CTA 버튼 (히어로 / 하단 배너에서 재사용)
  const renderPrimaryCta = (variant: 'blue' | 'white' = 'blue') => (
    <button
      onClick={handlePrimaryCta}
      disabled={isBusy}
      className={`w-full sm:w-auto h-12 sm:h-13 px-7 font-bold text-sm sm:text-[15px] rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] disabled:opacity-60 ${
        variant === 'blue'
          ? 'bg-[#185EF7] hover:bg-[#1249C9] text-white shadow-[0_8px_20px_rgba(24,94,247,0.28)]'
          : 'bg-white hover:bg-[#F2F4F6] text-[#185EF7] shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
      }`}
    >
      {isBusy ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{user ? '마이링크로 이동 중...' : '로그인 처리 중...'}</span>
        </>
      ) : user ? (
        <>
          <span>내 마이링크 관리하기</span>
          <ArrowRight className="w-4 h-4" />
        </>
      ) : (
        <>
          {variant === 'blue' ? <GoogleIcon /> : <Sparkles className="w-4 h-4" />}
          <span>Google로 무료 시작하기</span>
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-[#191F28] font-sans antialiased flex flex-col selection:bg-[#185EF7]/10 selection:text-[#185EF7] overflow-x-hidden">
      {/* 1. 상단 내비게이션 바 */}
      <header className="sticky top-0 z-40 w-full h-16 sm:h-18 px-5 sm:px-10 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[#F2F4F6]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#185EF7] flex items-center justify-center text-white font-black text-xs">
            ML
          </div>
          <span className="font-extrabold text-[19px] sm:text-[21px] text-[#185EF7] tracking-tight">MyLink</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/links"
            className="hidden sm:inline-flex h-9 px-3.5 items-center text-sm font-semibold text-[#4E5968] hover:text-[#191F28] hover:bg-[#F2F4F6] rounded-xl transition-colors"
          >
            시연 프로필
          </Link>
          {loading ? (
            <div className="w-16 h-9 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-[#185EF7]" />
            </div>
          ) : (
            <button
              onClick={handlePrimaryCta}
              disabled={isBusy}
              className="h-9 px-4 sm:px-5 bg-[#185EF7] hover:bg-[#1249C9] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>{user ? '마이링크 관리' : '로그인'}</span>}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* 2. 히어로 섹션: 모바일 1열 → 데스크톱 2열 */}
        <section className="relative">
          {/* 배경 장식 블롭 */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-[#185EF7]/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-[#7C4DFF]/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-10 pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* 좌측: 카피 + CTA */}
            <div className="text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-bold text-[#185EF7]">
                <Sparkles className="w-3.5 h-3.5" />
                개발자를 위한 링크 페이지
              </span>

              <h1 className="mt-5 text-[40px] sm:text-[56px] lg:text-[64px] font-black tracking-tight leading-[1.12] text-[#111827] isolate">
                내 <RotatingWord />
                <br />
                <span className="text-[#111827]">링크 하나로.</span>
              </h1>

              <p className="mt-5 text-[15px] sm:text-[17px] text-[#4E5968] leading-relaxed max-w-md mx-auto lg:mx-0">
                GitHub, 블로그, 포트폴리오까지.
                <br className="hidden sm:block" /> 개발자를 위한 모든 링크를 한 페이지에 담아보세요.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start max-w-xs sm:max-w-none mx-auto lg:mx-0">
                {renderPrimaryCta()}
                <Link
                  href="/links"
                  className="w-full sm:w-auto h-12 sm:h-13 px-6 rounded-2xl bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#333D4B] font-bold text-sm sm:text-[15px] flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  예시 프로필 구경하기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 신뢰 지표 */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-left">
                {[
                  { value: '3초', label: '가입 시간' },
                  { value: '6종', label: '테마' },
                  { value: '0원', label: '이용 요금' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-lg sm:text-xl font-extrabold text-[#191F28]">{s.value}</div>
                    <div className="text-xs text-[#8B95A1]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 인터랙티브 목업 */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <ProfileMockup />
            </div>
          </div>
        </section>

        {/* 3. 기능 소개: 모바일 1열 → 태블릿 2열 → 데스크톱 4열 */}
        <section className="bg-[#F9FAFB] border-y border-[#F2F4F6]">
          <div className="mx-auto max-w-6xl px-5 sm:px-10 py-16 sm:py-20">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-[26px] sm:text-[34px] font-extrabold tracking-tight">
                필요한 건 <span className="text-[#185EF7]">다 있어요</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#6B7684]">링크를 모으는 것부터 반응을 확인하는 것까지.</p>
            </div>

            <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group bg-white rounded-3xl p-6 border border-[#E5E8EB] tds-shadow-1 hover:shadow-[0_12px_28px_rgba(25,31,40,0.08)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${f.tint} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="mt-4 text-[17px] font-bold">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-[#6B7684] leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. 시작 방법 3단계: 모바일 세로 → 데스크톱 가로 */}
        <section className="mx-auto max-w-6xl px-5 sm:px-10 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-[26px] sm:text-[34px] font-extrabold tracking-tight">
              시작은 <span className="text-[#185EF7]">3단계</span>면 충분해요
            </h2>
          </div>

          <ol className="mt-10 sm:mt-12 grid md:grid-cols-3 gap-4 md:gap-6 relative">
            {/* 데스크톱 연결선 */}
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-[#D1D6DB]" />
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="relative flex md:flex-col items-center md:text-center gap-4 md:gap-0 bg-white md:bg-transparent rounded-3xl p-5 md:p-0 border md:border-0 border-[#E5E8EB]"
                >
                  <div className="relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-[#185EF7] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(24,94,247,0.25)]">
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-[#185EF7] text-[#185EF7] text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="md:mt-4">
                    <h3 className="text-[17px] font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm text-[#6B7684]">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 5. 하단 CTA 배너 */}
        <section className="px-5 sm:px-10 pb-16 sm:pb-20">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#185EF7] to-[#5B3CF5] px-6 py-12 sm:px-12 sm:py-16 text-center text-white">
            <div className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-[26px] sm:text-[36px] font-extrabold tracking-tight leading-tight">
                지금 바로
                <br className="sm:hidden" /> 나만의 링크를 만들어 보세요
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80">무료로, 회원가입 없이, 3초 만에.</p>
              <div className="mt-8 flex justify-center max-w-xs sm:max-w-none mx-auto">
                {renderPrimaryCta('white')}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. 하단 미니 푸터 */}
      <footer className="w-full border-t border-[#F2F4F6] py-6 px-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-[#8B95A1]">
        <span>© {new Date().getFullYear()} MyLink. All rights reserved.</span>
        <span className="hidden sm:inline">·</span>
        <Link href="/links" className="hover:text-[#4E5968]">
          시연 프로필
        </Link>
      </footer>
    </div>
  );
}
