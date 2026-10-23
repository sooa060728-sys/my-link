'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  LogOut,
  Copy,
  Check,
  Loader2,
  Database,
  ExternalLink,
  Settings,
  Sparkles,
  Share2,
  BarChart3,
  Layers,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { subscribeLinksFromFirestore } from '@/lib/firebase';
import { getProfileData } from '@/lib/profileStorage';
import { LinkItem } from '@/types';

export function Header() {
  const router = useRouter();
  const { user, firestoreUser, loading, isLoggingIn, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 드롭다운에 표시할 사용자 통계 정보
  const [linksCount, setLinksCount] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [pageViews, setPageViews] = useState<number>(0);

  const username = user?.email ? user.email.split('@')[0] : 'demo';

  // Firestore 링크 구독하여 실시간 통계 업데이트
  useEffect(() => {
    if (!user) return;
    const profile = getProfileData(username);
    setPageViews(profile.pageViews || 0);

    const unsubscribe = subscribeLinksFromFirestore(
      (firestoreLinks: LinkItem[]) => {
        setLinksCount(firestoreLinks.length);
        const clicks = firestoreLinks.reduce((acc, l) => acc + (l.clicks || 0), 0);
        setTotalClicks(clicks);
      },
      undefined,
      user.uid
    );

    return () => unsubscribe();
  }, [user, username]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 공개 프로필 링크 복사
  const handleCopyProfileLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const publicUrl = `${origin}/${username}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('프로필 링크가 복사되었어요!', {
      description: publicUrl,
    });
  };

  // Firestore 경로 복사
  const handleCopyFirestorePath = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const path = `users/${user.uid}/links`;
    navigator.clipboard.writeText(path);
    toast.success('Firestore 경로가 복사되었어요!', {
      description: path,
    });
  };

  const handleLogin = async () => {
    try {
      const loggedUser = await login();
      if (loggedUser) {
        toast.success(`${loggedUser.displayName || '구글 사용자'}님, 환영해요!`, {
          description: '마이링크 본 페이지로 이동합니다.',
        });
        if (pathname !== '/my') {
          router.push('/my');
        }
      }
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user') {
        toast.error('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await logout();
      toast.info('로그아웃되었습니다.', {
        description: '오프닝 랜딩 페이지로 이동합니다.',
      });
      router.push('/');
    } catch (e) {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E8EB] h-15 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
        {/* 좌측: 로고 및 내비게이션 링크 */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#185EF7] flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
              ML
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] text-[#191F28] tracking-tight flex items-center gap-1">
                마이링크
                <span className="text-[10px] font-bold text-[#185EF7] bg-[#EEF5FF] px-1.5 py-0.2 rounded-md">
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
                  ? 'bg-[#EEF5FF] text-[#185EF7] font-bold'
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
              <Sparkles className="w-3.5 h-3.5 text-[#185EF7]" />
              <span>시연 프로필</span>
            </Link>
          </nav>
        </div>

        {/* 우측: 구글 로그인 / 사용자 인증 상태 영역 */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-[#8B95A1] py-2 px-3">
              <Loader2 className="w-4 h-4 animate-spin text-[#185EF7]" />
              <span>인증 확인 중...</span>
            </div>
          ) : user ? (
            /* =========================================================================
             * 로그인 완료 상태: 프로필 드롭다운 트리거 & 확장형 팝오버 메뉴
             * ========================================================================= */
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* 데스크톱: Firestore 경로 칩 (원클릭 복사) */}
                <button
                  onClick={handleCopyFirestorePath}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F9FAFB] hover:bg-[#F2F4F6] border border-[#E5E8EB] rounded-lg text-[11px] font-mono text-[#4E5968] transition-colors cursor-pointer group"
                  title="클릭하여 Firestore 컬렉션 경로 복사"
                >
                  <Database className="w-3.5 h-3.5 text-[#185EF7]" />
                  <span>users/{user.uid.slice(0, 6)}.../links</span>
                  <Copy className="w-3 h-3 text-[#B0B8C1] group-hover:text-[#4E5968]" />
                </button>

                {/* 유저 프로필 버튼 (클릭 시 확장 드롭다운 열림) */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl transition-all border cursor-pointer ${
                    isMenuOpen
                      ? 'bg-[#F2F4F6] border-[#D1D6DB]'
                      : 'border-transparent hover:bg-[#F2F4F6] hover:border-[#E5E8EB]'
                  }`}
                >
                  <div className="relative">
                    {firestoreUser?.photoURL || user.photoURL ? (
                      // eslint-disable-next-next/no-img-element
                      <img
                        src={firestoreUser?.photoURL || user.photoURL || ''}
                        alt={firestoreUser?.displayName || user.displayName || '사용자'}
                        className="w-8 h-8 rounded-full object-cover border border-[#E5E8EB]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#185EF7] text-white flex items-center justify-center font-bold text-xs">
                        {(firestoreUser?.displayName || user.displayName || 'U').charAt(0)}
                      </div>
                    )}
                    {/* 활성 표시 초록 점 */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#20874E] border-2 border-white" />
                  </div>

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-[#191F28] leading-tight truncate max-w-[100px]">
                      {firestoreUser?.displayName || user.displayName || '구글 사용자'}
                    </span>
                    <span className="text-[10px] text-[#8B95A1] leading-tight truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#8B95A1] transition-transform duration-200 ${
                      isMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* 간편 로그아웃 아이콘 버튼 */}
                <button
                  onClick={handleLogout}
                  className="p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-[#6B7684] hover:text-[#F04452] hover:bg-[#FFF0F0] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* =======================================================================
               * 확장형 프로필 드롭다운 메뉴 (TDS 스타일 레이아웃)
               * ======================================================================= */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-[#E5E8EB] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3.5 text-left">
                  
                  {/* 1. 사용자 기본 정보 및 Google 인증 뱃지 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F2F4F6]">
                    <div className="relative flex-shrink-0">
                      {firestoreUser?.photoURL || user.photoURL ? (
                        // eslint-disable-next-next/no-img-element
                        <img
                          src={firestoreUser?.photoURL || user.photoURL || ''}
                          alt="프로필"
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-[#185EF7]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#185EF7] text-white flex items-center justify-center font-bold text-base">
                          {(firestoreUser?.displayName || user.displayName || 'U').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-[#191F28] truncate">
                          {firestoreUser?.displayName || user.displayName || '구글 사용자'}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#20874E] bg-[#E8F8EE] px-1.5 py-0.2 rounded-full">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>인증됨</span>
                        </span>
                      </div>
                      <div className="text-xs text-[#8B95A1] truncate mt-0.5">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* 2. 내 공개 프로필 빠른 링크 & 공유 (Quick Share) */}
                  <div className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#4E5968]">
                      <span className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-[#185EF7]" />
                        <span>내 공개 프로필 주소</span>
                      </span>
                      <span className="text-[10px] text-[#8B95A1]">원클릭 공유</span>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2.5 py-2 rounded-xl border border-[#E5E8EB] gap-2">
                      <span className="font-mono text-xs text-[#191F28] font-bold truncate">
                        /{username}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* URL 복사 버튼 */}
                        <button
                          onClick={handleCopyProfileLink}
                          className="p-1 text-[#6B7684] hover:text-[#185EF7] hover:bg-[#EEF5FF] rounded-lg transition-colors cursor-pointer"
                          title="프로필 링크 복사"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {/* 새 탭에서 열기 */}
                        <Link
                          href={`/${username}`}
                          target="_blank"
                          onClick={() => setIsMenuOpen(false)}
                          className="p-1 text-[#6B7684] hover:text-[#185EF7] hover:bg-[#EEF5FF] rounded-lg transition-colors cursor-pointer"
                          title="새 탭에서 열기"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 3. 실시간 성과 요약 미니 스냅샷 (Analytics 3-Grid) */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#4E5968] flex items-center gap-1.5 px-0.5">
                      <BarChart3 className="w-3.5 h-3.5 text-[#185EF7]" />
                      <span>실시간 링크 성과</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
                        <div className="text-[10px] text-[#8B95A1] font-medium">등록 링크</div>
                        <div className="text-sm font-black text-[#185EF7] tabular-nums mt-0.5">
                          {linksCount}개
                        </div>
                      </div>
                      <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
                        <div className="text-[10px] text-[#8B95A1] font-medium">누적 클릭</div>
                        <div className="text-sm font-black text-[#191F28] tabular-nums mt-0.5">
                          {totalClicks}회
                        </div>
                      </div>
                      <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
                        <div className="text-[10px] text-[#8B95A1] font-medium">총 방문(PV)</div>
                        <div className="text-sm font-black text-[#191F28] tabular-nums mt-0.5">
                          {pageViews}회
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Firestore 개인화 저장 경로 배너 */}
                  <div className="p-2.5 rounded-2xl bg-[#EEF5FF] border border-[#D5E5FF] flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#185EF7] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-[#185EF7]">
                          개인화 Firestore 저장소
                        </div>
                        <div className="text-[10px] font-mono text-[#4E5968] truncate max-w-[180px]">
                          users/{user.uid}/links
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyFirestorePath}
                      className="px-2 py-1 text-[11px] font-bold text-[#185EF7] hover:bg-white rounded-lg transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
                      title="경로 복사"
                    >
                      복사
                    </button>
                  </div>

                  {/* 5. 메뉴 링크 & 로그아웃 */}
                  <div className="space-y-1 pt-1 border-t border-[#F2F4F6]">
                    <Link
                      href="/my"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#191F28] hover:bg-[#F2F4F6] rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[#185EF7]" />
                        <span>내 링크 관리 대시보드</span>
                      </span>
                      <span className="text-[10px] text-[#8B95A1]">/my</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#F04452] hover:bg-[#FFF0F0] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Google 계정 로그아웃</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
             * 미로그인 상태: Google 로그인 버튼
             * ========================================================================= */
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="h-10 px-4 bg-white hover:bg-[#F9FAFB] active:scale-[0.98] border border-[#D1D6DB] hover:border-[#B0B8C1] text-[#191F28] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#185EF7]" />
                  <span>로그인 진행 중...</span>
                </>
              ) : (
                <>
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
