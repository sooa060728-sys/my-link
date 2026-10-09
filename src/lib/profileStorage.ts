import { ProfileData } from '../types';
import { getDummyProfile } from './dummyData';

export const INITIAL_PROFILE_DATA: ProfileData = {
  username: 'demo',
  name: '홍길동 (Gildong)',
  bio: '✨ 대표 크리에이터 & 디자이너 | 제 모든 소셜 링크와 포트폴리오를 한곳에서 만나보세요!',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  theme: 'gradient',
  buttonStyle: 'rounded',
  links: [
    {
      id: '1',
      title: '📌 주요 활동 채널',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: '2',
      title: '🌐 공식 웹사이트 & 포트폴리오',
      url: 'https://github.com',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: '3',
      title: '🎬 유튜브 구독하기',
      url: 'https://youtube.com',
      icon: 'Youtube',
      isActive: true,
    },
    {
      id: '4',
      title: '💬 소통 & 문의하기',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: '5',
      title: '📝 기술 블로그 (Velog)',
      url: 'https://velog.io',
      icon: 'BookOpen',
      isActive: true,
    },
    {
      id: '6',
      title: '✉️ 비즈니스 이메일 문의',
      url: 'mailto:contact@example.com',
      icon: 'Mail',
      isActive: true,
    },
  ],
  socials: [
    { id: 's1', platform: 'instagram', url: 'https://instagram.com' },
    { id: 's2', platform: 'youtube', url: 'https://youtube.com' },
    { id: 's3', platform: 'github', url: 'https://github.com' },
    { id: 's4', platform: 'twitter', url: 'https://twitter.com' },
    { id: 's5', platform: 'email', url: 'mailto:contact@example.com' },
  ],
};

const STORAGE_KEY_PREFIX = 'mylink_profile_';

export function getProfileData(username: string): ProfileData {
  if (typeof window === 'undefined') {
    const dummyProfile = getDummyProfile(username);
    if (dummyProfile) return dummyProfile;
    return { ...INITIAL_PROFILE_DATA, username };
  }

  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${username.toLowerCase()}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read profile data from localStorage:', e);
  }

  // 더미 데이터에서 조회
  const dummyProfile = getDummyProfile(username);
  if (dummyProfile) {
    saveProfileData(username, dummyProfile);
    return dummyProfile;
  }

  // 기본 데이터 저장 및 반환
  const defaultProfile = { ...INITIAL_PROFILE_DATA, username };
  saveProfileData(username, defaultProfile);
  return defaultProfile;
}

export function saveProfileData(username: string, data: ProfileData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${username.toLowerCase()}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save profile data to localStorage:', e);
  }
}

export function recordPageView(username: string): void {
  if (typeof window === 'undefined') return;
  const profile = getProfileData(username);
  profile.pageViews = (profile.pageViews || 0) + 1;
  saveProfileData(username, profile);
}

export function recordLinkClick(username: string, linkId: string): void {
  if (typeof window === 'undefined') return;
  const profile = getProfileData(username);
  profile.links = profile.links.map((link) =>
    link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
  );
  saveProfileData(username, profile);
}

