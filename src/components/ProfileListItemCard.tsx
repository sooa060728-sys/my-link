'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfileData, ThemeType } from '@/types';
import { ChevronRight, User, Link as LinkIcon, Palette } from 'lucide-react';

interface ProfileListItemCardProps {
  profile: ProfileData;
}

function getThemeLabel(theme: ThemeType): string {
  const labels: Record<ThemeType, string> = {
    light: '라이트',
    dark: '다크',
    neon: '네온',
    pastel: '파스텔',
    minimal: '미니멀',
    gradient: '그라디언트',
  };
  return labels[theme] ?? theme;
}

function getThemeBadgeVariant(theme: ThemeType): 'default' | 'secondary' | 'outline' {
  switch (theme) {
    case 'dark':
    case 'neon':
      return 'default';
    case 'pastel':
    case 'gradient':
      return 'secondary';
    case 'minimal':
    case 'light':
    default:
      return 'outline';
  }
}

export function ProfileListItemCard({ profile }: ProfileListItemCardProps) {
  const activeLinks = profile.links.filter((l) => l.isActive && !l.isHeader);
  const headerCount = profile.links.filter((l) => l.isHeader).length;

  return (
    <Link href={`/${profile.username}`} className="block group">
      <Card className="p-4 border-[#E5E8EB] hover:border-[#B0B8C1] transition-all tds-shadow-1 group-hover:tds-shadow-2 rounded-2xl bg-white">
        <div className="flex items-center gap-3">
          {/* shadcn/ui Avatar */}
          <Avatar size="lg" className="border border-[#E5E8EB]">
            {profile.avatarUrl && (
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            )}
            <AvatarFallback className="bg-[#E8F3FF] text-[#3182F6] font-bold text-base">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* 프로필 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[16px] font-bold text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
                {profile.name}
              </span>
              <Badge variant={getThemeBadgeVariant(profile.theme)} className="text-[11px] px-2 py-0.5 font-semibold shrink-0">
                {getThemeLabel(profile.theme)}
              </Badge>
            </div>
            <p className="text-[13px] text-[#4E5968] truncate mb-2">
              {profile.bio}
            </p>

            {/* 메타 정보 태그 */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[11px] font-medium text-[#6B7684] bg-[#F9FAFB] gap-1 border-[#E5E8EB]">
                <User className="w-3 h-3 text-[#8B95A1]" />
                @{profile.username}
              </Badge>
              <Badge variant="outline" className="text-[11px] font-medium text-[#6B7684] bg-[#F9FAFB] gap-1 border-[#E5E8EB]">
                <LinkIcon className="w-3 h-3 text-[#8B95A1]" />
                링크 {activeLinks.length}개
              </Badge>
              {headerCount > 0 && (
                <Badge variant="outline" className="text-[11px] font-medium text-[#6B7684] bg-[#F9FAFB] gap-1 border-[#E5E8EB]">
                  <Palette className="w-3 h-3 text-[#8B95A1]" />
                  헤더 {headerCount}개
                </Badge>
              )}
              <Badge variant="outline" className="text-[11px] font-medium text-[#6B7684] bg-[#F9FAFB] border-[#E5E8EB]">
                {profile.buttonStyle}
              </Badge>
            </div>
          </div>

          {/* 화살표 */}
          <ChevronRight className="w-5 h-5 text-[#B0B8C1] group-hover:text-[#3182F6] transition-colors shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
