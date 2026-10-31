'use client';

import React, { useState, useEffect } from 'react';
import { getProfileData, recordPageView, recordLinkClick, INITIAL_PROFILE_DATA } from '../lib/profileStorage';
import { getDummyProfile } from '../lib/dummyData';
import { subscribeLinksFromFirestore } from '../lib/firebase';
import { ProfileData, LinkItem } from '../types';
import { ThemeContainer } from './ThemeContainer';
import { LinkCard } from './LinkCard';
import { SocialIcons } from './SocialIcons';
import { Sparkles } from 'lucide-react';

interface ProfileViewProps {
  username: string;
}

export function ProfileView({ username }: ProfileViewProps) {
  // SSR과 클라이언트 첫 렌더링의 불일치(Hydration Mismatch)를 방지하기 위해 동일한 초기 더미 데이터를 사용하고,
  // 마운트 후 useEffect에서 localStorage 및 최신 데이터를 반영합니다.
  const [profile, setProfile] = useState<ProfileData>(() => {
    return getDummyProfile(username) || { ...INITIAL_PROFILE_DATA, username };
  });

  useEffect(() => {
    recordPageView(username);
    const loadedData = getProfileData(username);
    if (loadedData) {
      setProfile(loadedData);
    }

    const unsubscribe = subscribeLinksFromFirestore((firestoreLinks: LinkItem[]) => {
      if (firestoreLinks.length > 0) {
        setProfile((prev: ProfileData) => ({ ...prev, links: firestoreLinks }));
      }
    });

    return () => unsubscribe();
  }, [username]);

  const handleLinkClick = (linkId: string) => {
    recordLinkClick(username, linkId);
    setProfile(getProfileData(username));
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
        {profile.links.map((link) => (
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
