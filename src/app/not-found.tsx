import Link from 'next/link';
import { Header } from '@/components/Header';
import { UserX, Home, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E8EB] shadow-xs text-center space-y-6">
          {/* 아이콘 */}
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F2] text-[#F04452] flex items-center justify-center mx-auto shadow-xs">
            <UserX className="w-8 h-8" />
          </div>

          {/* 문구 */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F4F6] text-[#6B7684]">
              404 Not Found
            </span>
            <h1 className="text-2xl font-black text-[#191F28] tracking-tight">
              사용자를 찾을 수 없어요
            </h1>
            <p className="text-sm text-[#4E5968] leading-relaxed max-w-xs mx-auto">
              입력하신 닉네임(Display Name)의 사용자가 존재하지 않거나, 주소가 변경되었을 수 있어요.
            </p>
          </div>

          {/* 이동 버튼들 */}
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/my"
              className="w-full h-12 bg-[#185EF7] hover:bg-[#004FE2] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>내 링크 관리 대시보드로 이동</span>
            </Link>

            <Link
              href="/"
              className="w-full h-12 bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-[0.98] text-[#333D4B] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#6B7684]" />
              <span>메인 홈으로 가기</span>
            </Link>

            <Link
              href="/links"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-[#8B95A1] hover:text-[#185EF7] py-1 transition-colors"
            >
              <span>시연용 샘플 프로필 둘러보기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
