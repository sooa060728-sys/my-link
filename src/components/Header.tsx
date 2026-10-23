'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  User as UserIcon,
  Copy,
  Check,
  Loader2,
  Database,
  ExternalLink,
  Settings,
  Sparkles,
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { user, firestoreUser, loading, isLoggingIn, login, logout } = useAuth();
  const [copiedUid, setCopiedUid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleCopyPath = () => {
    if (!user) return;
    const path = `users/${user.uid}/links`;
    navigator.clipboard.writeText(path);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleLogin = async () => {
    try {
      const loggedUser = await login();
      if (loggedUser && pathname !== '/my') {
        router.push('/my');
      }
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user') {
        alert('구글 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E8EB] h-15 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
        {/* 좌측: 로고 및 내비게이션 링크 */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#3182F6] flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
              ML
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] text-[#191F28] tracking-tight flex items-center gap-1">
                마이링크
                <span className="text-[10px] font-bold text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.2 rounded-md">
                  MyLink
                </span>
              </span>
            </div>
          </Link>

          {/* 중앙 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-[#F2F4F6] text-[#191F28] font-bold'
                  : 'text-[#6B7684] hover:text-[#191F28] hover:bg-[#F9FAFB]'
              }`}
            >
              홈
            </Link>
            <Link
              href="/my"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                pathname === '/my'
                  ? 'bg-[#E8F3FF] text-[#3182F6] font-bold'
                  : 'text-[#6B7684] hover:text-[#191F28] hover:bg-[#F9FAFB]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>내 링크 관리</span>
            </Link>
            <Link
              href="/links"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                pathname === '/links'
                  ? 'bg-[#F2F4F6] text-[#191F28] font-bold'
                  : 'text-[#6B7684] hover:text-[#191F28] hover:bg-[#F9FAFB]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3182F6]" />
              <span>시연 프로필</span>
            </Link>
          </nav>
        </div>

        {/* 우측: 구글 로그인 / 사용자 인증 상태 영역 */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-[#8B95A1] py-2 px-3">
              <Loader2 className="w-4 h-4 animate-spin text-[#3182F6]" />
              <span>인증 확인 중...</span>
            </div>
          ) : user ? (
            /* 로그인 완료 상태 */
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Firestore 경로 칩 (데스크톱) */}
                <button
                  onClick={handleCopyPath}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F9FAFB] hover:bg-[#F2F4F6] border border-[#E5E8EB] rounded-lg text-[11px] font-mono text-[#4E5968] transition-colors cursor-pointer group"
                  title="클릭하여 Firestore 컬렉션 경로 복사"
                >
                  <Database className="w-3.5 h-3.5 text-[#3182F6]" />
                  <span>users/{user.uid.slice(0, 6)}.../links</span>
                  {copiedUid ? (
                    <Check className="w-3 h-3 text-[#20874E]" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#B0B8C1] group-hover:text-[#4E5968]" />
                  )}
                </button>

                {/* 유저 프로필 카드 버튼 */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl hover:bg-[#F2F4F6] transition-colors border border-transparent hover:border-[#E5E8EB] cursor-pointer"
                >
                  {user.photoURL ? (
                    // eslint-disable-next-next/no-img-element
                    <img
                      src={user.photoURL}
                      alt={user.displayName || '사용자'}
                      className="w-8 h-8 rounded-full object-cover border border-[#E5E8EB]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#3182F6] text-white flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-[#191F28] leading-tight truncate max-w-[100px]">
                      {user.displayName || '구글 사용자'}
                    </span>
                    <span className="text-[10px] text-[#8B95A1] leading-tight truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                </button>

                {/* 간편 로그아웃 버튼 (모바일/데스크톱 공통) */}
                <button
                  onClick={handleLogout}
                  className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-[#6B7684] hover:text-[#F04452] hover:bg-[#FFF0F0] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
              </div>

              {/* 유저 상세 드롭다운 메뉴 (모달/팝오버) */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E5E8EB] shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F2F4F6]">
                    {user.photoURL ? (
                      // eslint-disable-next-next/no-img-element
                      <img
                        src={user.photoURL}
                        alt="프로필"
                        className="w-11 h-11 rounded-full object-cover border border-[#E5E8EB]"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#3182F6] text-white flex items-center justify-center font-bold text-sm">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#191F28] truncate">
                        {user.displayName || '구글 사용자'}
                      </div>
                      <div className="text-xs text-[#8B95A1] truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Firestore 개인화 경로 안내 */}
                  <div className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E8EB] space-y-1">
                    <div className="text-[11px] font-bold text-[#4E5968] flex items-center gap-1">
                      <Database className="w-3 h-3 text-[#3182F6]" />
                      <span>개인화된 Firestore 저장 경로</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#6B7684] break-all bg-white p-1.5 rounded-md border border-[#E5E8EB] flex items-center justify-between gap-1">
                      <span>users/{user.uid}/links</span>
                      <button
                        onClick={handleCopyPath}
                        className="text-[#3182F6] hover:text-[#1B64DA] p-0.5"
                        title="경로 복사"
                      >
                        {copiedUid ? (
                          <Check className="w-3 h-3 text-[#20874E]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <Link
                      href="/my"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#191F28] hover:bg-[#F2F4F6] rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-[#3182F6]" />
                        <span>내 링크 관리 대시보드</span>
                      </span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#F04452] hover:bg-[#FFF0F0] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Google 계정 로그아웃</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 미로그인 상태: Google 소셜 로그인 버튼 */
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="h-10 px-4 bg-white hover:bg-[#F9FAFB] active:scale-[0.98] border border-[#D1D6DB] hover:border-[#B0B8C1] text-[#191F28] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#3182F6]" />
                  <span>로그인 진행 중...</span>
                </>
              ) : (
                <>
                  {/* Google 공식 4색 심볼 SVG */}
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google로 로그인</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
