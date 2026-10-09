'use client';

import React from 'react';
import { DUMMY_PROFILES } from '@/lib/dummyData';
import { INITIAL_PROFILE_DATA } from '@/lib/profileStorage';
import { ProfileData } from '@/types';
import { ProfileListItemCard } from '@/components/ProfileListItemCard';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const allProfiles: ProfileData[] = [INITIAL_PROFILE_DATA, ...DUMMY_PROFILES];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased">
      {/* 상단 앱 바 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E8EB] h-14 px-4 sm:px-6 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#3182F6] flex items-center justify-center text-white font-black text-[10px]">
            ML
          </div>
          <span className="font-bold text-[17px] text-[#191F28] tracking-tight">
            마이링크 프로필 목록
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 pt-6 pb-12 space-y-4">
        {/* 안내 배너 (shadcn/ui Card 사용) */}
        <Card className="rounded-3xl border-[#E5E8EB] tds-shadow-1 bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3182F6]" />
            <h1 className="text-[17px] font-bold text-[#191F28]">
              시연용 프로필 링크 목록
            </h1>
          </div>
          <p className="text-[14px] text-[#4E5968] leading-relaxed">
            더미 데이터로 생성된 프로필이에요. 각 프로필을 클릭하면 링크 목록이
            포함된 공개 프로필 페이지로 이동해요.
          </p>

          {/* 통계 요약 */}
          <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB] text-center">
            <div>
              <div className="text-xs text-[#8B95A1] font-medium mb-0.5">
                전체 프로필
              </div>
              <div className="text-lg font-bold text-[#3182F6] tabular-nums">
                {allProfiles.length}개
              </div>
            </div>
            <div className="border-x border-[#E5E8EB]">
              <div className="text-xs text-[#8B95A1] font-medium mb-0.5">
                전체 링크
              </div>
              <div className="text-lg font-bold text-[#191F28] tabular-nums">
                {allProfiles.reduce((sum, p) => sum + p.links.length, 0)}개
              </div>
            </div>
            <div>
              <div className="text-xs text-[#8B95A1] font-medium mb-0.5">
                테마 종류
              </div>
              <div className="text-lg font-bold text-[#191F28] tabular-nums">
                {new Set(allProfiles.map((p) => p.theme)).size}종
              </div>
            </div>
          </div>
        </Card>

        {/* 프로필 카드 목록 */}
        <div className="text-xs font-semibold text-[#8B95A1] px-1 pt-1">
          프로필을 선택하면 링크 페이지로 이동해요
        </div>

        <div className="space-y-3">
          {allProfiles.map((profile) => (
            <ProfileListItemCard key={profile.username} profile={profile} />
          ))}
        </div>

        {/* 푸터 */}
        <footer className="pt-6 pb-4 text-center text-xs text-[#8B95A1] space-y-1">
          <p>더미 데이터로 생성된 시연용 프로필이에요.</p>
          <p>© {new Date().getFullYear()} MyLink. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
