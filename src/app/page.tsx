'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

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
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user') {
        alert('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  // 이미 로그인되어 있는 경우
  const handleGoToMyPage = () => {
    setIsRedirecting(true);
    router.push('/my');
  };

  return (
    <div className="min-h-screen bg-white text-[#191F28] font-sans antialiased flex flex-col justify-between selection:bg-[#185EF7]/10 selection:text-[#185EF7]">
      {/* 1. 상단 내비게이션 바 */}
      <header className="w-full h-16 sm:h-20 px-6 sm:px-12 flex items-center justify-between border-b border-transparent">
        {/* 로고 */}
        <div className="flex items-center">
          <span className="font-extrabold text-[20px] sm:text-[22px] text-[#185EF7] tracking-tight">
            MyLink
          </span>
        </div>

        {/* 우측 로그인 / 대시보드 버튼 */}
        <div>
          {loading ? (
            <div className="w-16 h-8 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-[#185EF7]" />
            </div>
          ) : user ? (
            <button
              onClick={handleGoToMyPage}
              disabled={isRedirecting}
              className="h-9 sm:h-10 px-4 sm:px-5 bg-[#185EF7] hover:bg-[#1249C9] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-md transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>이동 중...</span>
                </>
              ) : (
                <span>마이링크 관리</span>
              )}
            </button>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn || isRedirecting}
              className="h-8 sm:h-9 px-4 sm:px-5 bg-[#185EF7] hover:bg-[#1249C9] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn || isRedirecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <span>로그인</span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* 2. 메인 히어로 섹션 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-6 pb-12 sm:pb-16 max-w-4xl mx-auto w-full text-center">
        {/* 메인 타이틀: Development in One Link. */}
        <div className="space-y-3">
          <h1 className="text-[38px] sm:text-[62px] md:text-[68px] font-black tracking-tight text-[#111827] leading-[1.12]">
            Development in <span className="text-[#185EF7]">One</span>
            <br />
            <span className="text-[#185EF7]">Link</span>
            <span className="text-[#111827]">.</span>
          </h1>

          {/* 서브 설명 문구 */}
          <div className="pt-4 text-sm sm:text-base text-[#4E5968] font-normal leading-relaxed">
            <p>GitHub, 블로그, 포트폴리오까지.</p>
            <p>개발자를 위한 모든 링크를 한 페이지에 담아보세요.</p>
          </div>
        </div>

        {/* 중앙 CTA 버튼: Google로 시작하기 */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={user ? handleGoToMyPage : handleGoogleLogin}
            disabled={isLoggingIn || isRedirecting}
            className="w-64 sm:w-72 h-12 sm:h-13 bg-[#185EF7] hover:bg-[#1249C9] active:scale-[0.98] text-white font-semibold text-sm sm:text-[15px] rounded-md shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            {isLoggingIn || isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{user ? '마이링크로 이동 중...' : '로그인 처리 중...'}</span>
              </>
            ) : (
              <>
                {/* Google 화이트 'G' 로고 */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.35 11.1H12v3.16h5.36c-.24 1.4-1.02 2.59-2.18 3.39v2.8h3.53c2.06-1.9 3.25-4.7 3.25-8.05 0-.44-.04-.89-.11-1.3z" fill="#ffffff" />
                  <path d="M12 21c2.43 0 4.47-.8 5.96-2.17l-3.53-2.8c-.81.54-1.84.86-2.93.86-2.25 0-4.16-1.52-4.84-3.57H2.98v2.88C4.46 19.14 7.97 21 12 21z" fill="#ffffff" />
                  <path d="M7.16 13.32c-.17-.52-.27-1.08-.27-1.65 0-.58.1-1.13.27-1.65V7.14H2.98A9.97 9.97 0 0 0 2 11.67c0 1.61.39 3.14 1.07 4.53l4.09-2.88z" fill="#ffffff" />
                  <path d="M12 5.51c1.32 0 2.51.46 3.45 1.35l2.58-2.58C16.46 2.8 14.42 2 12 2 7.97 2 4.46 3.86 2.98 6.81l4.18 2.88c.68-2.05 2.59-3.57 4.84-3.57z" fill="#ffffff" />
                </svg>
                <span>{user ? '마이링크 본 페이지로 이동' : 'Google로 시작하기'}</span>
              </>
            )}
          </button>
        </div>

        {/* 3. 하단 비스듬한 목업 카드 UI (와이어프레임 이미지와 동일) */}
        <div className="mt-14 sm:mt-16 w-full max-w-sm sm:max-w-md mx-auto">
          <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(25,31,40,0.09),0_2px_8px_rgba(25,31,40,0.04)] border border-[#E5E8EB] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            {/* 상단 프로필 스켈레톤 (원형 아바타 + 텍스트 바 2줄) */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#E5E8EB] flex-shrink-0" />
              <div className="space-y-2 flex-1 text-left">
                <div className="h-4 bg-[#E5E8EB] rounded-md w-32" />
                <div className="h-2.5 bg-[#F2F4F6] rounded-md w-20" />
              </div>
            </div>

            {/* 첫 번째 링크 카드: 소프트 블루 블록 (원형 아이콘 + 링크 바) */}
            <div className="h-13 bg-[#EEF5FF] rounded-2xl flex items-center px-4 gap-3 mb-3 border border-[#E0EDFF]">
              <div className="w-4 h-4 rounded-full bg-[#82B1FF] flex-shrink-0" />
              <div className="h-3 bg-[#C8DEFF] rounded-md w-36" />
            </div>

            {/* 두 번째 링크 카드: 소프트 그레이 블록 (원형 아이콘 + 링크 바) */}
            <div className="h-13 bg-[#F9FAFB] rounded-2xl flex items-center px-4 gap-3 border border-[#E5E8EB]">
              <div className="w-4 h-4 rounded-full bg-[#E5E8EB] flex-shrink-0" />
              <div className="h-3 bg-[#E5E8EB] rounded-md w-44" />
            </div>
          </div>
        </div>
      </main>

      {/* 4. 하단 미니 푸터 */}
      <footer className="w-full py-4 text-center text-xs text-[#8B95A1]">
        © {new Date().getFullYear()} MyLink. All rights reserved.
      </footer>
    </div>
  );
}
