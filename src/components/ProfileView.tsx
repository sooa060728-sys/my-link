'use client';

import React, { useState, useEffect } from 'react';
import { getProfileData, recordPageView, INITIAL_PROFILE_DATA } from '../lib/profileStorage';
import { getDummyProfile } from '../lib/dummyData';
import { useLinksQuery, useRecordLinkClickMutation } from '../hooks/useLinks';
import { ProfileData } from '../types';
import { ThemeContainer } from './ThemeContainer';
import { LinkCard } from './LinkCard';
import { SocialIcons } from './SocialIcons';
import { Sparkles } from 'lucide-react';

interface ProfileViewProps {
  username?: string;
  displayName?: string;
  userId?: string;
  initialProfile?: ProfileData;
}

export function ProfileView({ username, displayName, userId, initialProfile }: ProfileViewProps) {
  const profileIdentifier = displayName || username || 'demo';

  // initialProfile이 제공된 경우(예: displayName으로 Firestore 검색 성공) 즉시 반영
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (initialProfile) return initialProfile;
    return getDummyProfile(profileIdentifier) || { ...INITIAL_PROFILE_DATA, username: profileIdentifier };
  });

  // userId가 존재할 경우 users/{userId}/links에서 링크 자동 실시간 캐시 조회
  const { data: cachedLinks = [] } = useLinksQuery(userId || null, profileIdentifier);
  const displayLinks = cachedLinks.length > 0 ? cachedLinks : profile.links;

  // 클릭 카운트 mutation 훅 (Firestore 로그인 유저 / 게스트 모두 처리)
  const recordClickMutation = useRecordLinkClickMutation(userId || null, profileIdentifier);

  useEffect(() => {
    recordPageView(profileIdentifier);
    if (!initialProfile) {
      const loadedData = getProfileData(profileIdentifier);
      if (loadedData) {
        setProfile(loadedData);
      }
    }
  }, [profileIdentifier, initialProfile]);

  const handleLinkClick = (linkId: string) => {
    // Firestore(로그인) 또는 localStorage(게스트) 양쪽 모두에 클릭 카운트 저장
    recordClickMutation.mutate(linkId);
    if (!userId) {
      // 게스트 모드: 로컬 프로필 상태도 즉시 갱신하여 화면 반영
      setProfile(getProfileData(profileIdentifier));
    }
  };

  return (
    <ThemeContainer theme={profile.theme}>
      {/* 뱃지 헤더 */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 mb-6 rounded-full bg-black/10 dark:bg-white/10 text-xs font-semibold backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span>마이링크 (MyLink) 시연 프로필</span>
      </div>

      {/* 프로필 이미지 & 아바타 */}
      <div className="relative mb-4">
        {profile.avatarUrl ? (
          // eslint-disable-next-next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white/20"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white/20">
            {profile.name.charAt(0)}
          </div>
        )}
      </div>

      {/* 이름 & 바이오 */}
      <h1 className="text-2xl font-bold text-center mb-1 tracking-tight">
        {profile.name}
      </h1>
      <p className="text-sm font-normal text-center mb-6 max-w-xs opacity-85 leading-relaxed">
        {profile.bio}
      </p>

      {/* 링크 목록 */}
      <div className="w-full space-y-1">
        {displayLinks.map((link) => (
          <LinkCard
            key={link.id}
            item={link}
            theme={profile.theme}
            buttonStyle={profile.buttonStyle}
            onLinkClick={handleLinkClick}
          />
        ))}
      </div>

      {/* 소셜 매체 아이콘 */}
      <SocialIcons socials={profile.socials} />

      {/* 푸터 */}
      <footer className="mt-auto pt-6 pb-2 text-center text-xs opacity-50 font-medium">
        Powered by <span className="font-bold underline">MyLink</span>
      </footer>
    </ThemeContainer>
  );
}
