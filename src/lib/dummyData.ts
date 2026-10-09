import { ProfileData } from '../types';

/**
 * 더미 데이터 모음
 * - 링크 목록 시연·테스트용 샘플 프로필 데이터
 * - 크리에이터 / 개발자 / 디자이너 3가지 페르소나
 */

// ──────────────────────────────────────────────
// 1. 크리에이터 프로필
// ──────────────────────────────────────────────
export const CREATOR_PROFILE: ProfileData = {
  username: 'creator_hana',
  name: '하나 (Hana)',
  bio: '🎨 크리에이터 & 유튜버 | 일상 브이로그 · 여행 · 맛집 콘텐츠를 만들고 있어요!',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  theme: 'pastel',
  buttonStyle: 'rounded',
  links: [
    {
      id: 'c-h1',
      title: '📌 콘텐츠 채널',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'c-1',
      title: '🎬 유튜브 채널 구독하기',
      url: 'https://youtube.com/@hana_creator',
      icon: 'Youtube',
      isActive: true,
    },
    {
      id: 'c-2',
      title: '📸 인스타그램 팔로우',
      url: 'https://instagram.com/hana_creator',
      icon: 'Instagram',
      isActive: true,
    },
    {
      id: 'c-3',
      title: '🐦 트위터 (X)',
      url: 'https://twitter.com/hana_creator',
      icon: 'Twitter',
      isActive: true,
    },
    {
      id: 'c-h2',
      title: '🛍️ 협업 & 비즈니스',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'c-4',
      title: '💌 비즈니스 문의 (이메일)',
      url: 'mailto:hana@example.com',
      icon: 'Mail',
      isActive: true,
    },
    {
      id: 'c-5',
      title: '🛒 쿠팡 파트너스 추천 리스트',
      url: 'https://link.coupang.com/hana',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'c-6',
      title: '📝 네이버 블로그',
      url: 'https://blog.naver.com/hana_creator',
      icon: 'BookOpen',
      isActive: true,
    },
    {
      id: 'c-7',
      title: '🎵 틱톡 팔로우하기',
      url: 'https://tiktok.com/@hana_creator',
      icon: 'Globe',
      isActive: false, // 비활성 링크 예시
    },
  ],
  socials: [
    { id: 'cs1', platform: 'instagram', url: 'https://instagram.com/hana_creator' },
    { id: 'cs2', platform: 'youtube', url: 'https://youtube.com/@hana_creator' },
    { id: 'cs3', platform: 'twitter', url: 'https://twitter.com/hana_creator' },
    { id: 'cs4', platform: 'email', url: 'mailto:hana@example.com' },
  ],
};

// ──────────────────────────────────────────────
// 2. 개발자 프로필
// ──────────────────────────────────────────────
export const DEVELOPER_PROFILE: ProfileData = {
  username: 'dev_minjun',
  name: '김민준 (Minjun)',
  bio: '💻 풀스택 개발자 | Next.js · TypeScript · Rust 를 즐겨 사용합니다. 오픈소스 기여 활동 중!',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  theme: 'dark',
  buttonStyle: 'corner',
  links: [
    {
      id: 'd-h1',
      title: '🔗 개발 프로필',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'd-1',
      title: '🐙 GitHub 프로필',
      url: 'https://github.com/minjun-dev',
      icon: 'Github',
      isActive: true,
    },
    {
      id: 'd-2',
      title: '📝 기술 블로그 (Velog)',
      url: 'https://velog.io/@minjun',
      icon: 'BookOpen',
      isActive: true,
    },
    {
      id: 'd-3',
      title: '💼 LinkedIn 프로필',
      url: 'https://linkedin.com/in/minjun-dev',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'd-h2',
      title: '🚀 프로젝트 & 포트폴리오',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'd-4',
      title: '🌐 포트폴리오 웹사이트',
      url: 'https://minjun.dev',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'd-5',
      title: '📦 npm 패키지 – react-smooth-dnd',
      url: 'https://www.npmjs.com/package/react-smooth-dnd',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'd-6',
      title: '🎯 LeetCode 프로필',
      url: 'https://leetcode.com/minjun-dev',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'd-h3',
      title: '💬 연락처',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'd-7',
      title: '✉️ 이메일로 연락하기',
      url: 'mailto:minjun@example.dev',
      icon: 'Mail',
      isActive: true,
    },
    {
      id: 'd-8',
      title: '💬 Discord 서버 참여',
      url: 'https://discord.gg/minjun-dev',
      icon: 'Globe',
      isActive: true,
    },
  ],
  socials: [
    { id: 'ds1', platform: 'github', url: 'https://github.com/minjun-dev' },
    { id: 'ds2', platform: 'twitter', url: 'https://twitter.com/minjun_dev' },
    { id: 'ds3', platform: 'website', url: 'https://minjun.dev' },
    { id: 'ds4', platform: 'email', url: 'mailto:minjun@example.dev' },
  ],
};

// ──────────────────────────────────────────────
// 3. 디자이너 프로필
// ──────────────────────────────────────────────
export const DESIGNER_PROFILE: ProfileData = {
  username: 'design_yuna',
  name: '박유나 (Yuna)',
  bio: '🎨 UI/UX 디자이너 | 사용자 중심의 아름다운 경험을 설계합니다. Figma & Framer 전문',
  avatarUrl:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
  theme: 'neon',
  buttonStyle: 'outline',
  links: [
    {
      id: 'g-h1',
      title: '✨ 포트폴리오',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'g-1',
      title: '🎨 Dribbble 포트폴리오',
      url: 'https://dribbble.com/yuna-design',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'g-2',
      title: '🖼️ Behance 프로젝트',
      url: 'https://behance.net/yuna-design',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'g-3',
      title: '📐 Figma 커뮤니티 프로필',
      url: 'https://figma.com/@yuna',
      icon: 'Globe',
      isActive: true,
    },
    {
      id: 'g-h2',
      title: '📚 학습 & 공유',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'g-4',
      title: '🎓 디자인 강의 (클래스101)',
      url: 'https://class101.net/yuna',
      icon: 'BookOpen',
      isActive: true,
    },
    {
      id: 'g-5',
      title: '📝 디자인 블로그 (brunch)',
      url: 'https://brunch.co.kr/@yuna-design',
      icon: 'BookOpen',
      isActive: true,
    },
    {
      id: 'g-6',
      title: '🎬 디자인 프로세스 유튜브',
      url: 'https://youtube.com/@yuna-design',
      icon: 'Youtube',
      isActive: true,
    },
    {
      id: 'g-h3',
      title: '📩 문의',
      url: '',
      isActive: true,
      isHeader: true,
    },
    {
      id: 'g-7',
      title: '📸 인스타그램 작업 기록',
      url: 'https://instagram.com/yuna.design',
      icon: 'Instagram',
      isActive: true,
    },
    {
      id: 'g-8',
      title: '✉️ 프로젝트 문의 메일',
      url: 'mailto:yuna@example.design',
      icon: 'Mail',
      isActive: true,
    },
  ],
  socials: [
    { id: 'gs1', platform: 'instagram', url: 'https://instagram.com/yuna.design' },
    { id: 'gs2', platform: 'youtube', url: 'https://youtube.com/@yuna-design' },
    { id: 'gs3', platform: 'website', url: 'https://dribbble.com/yuna-design' },
    { id: 'gs4', platform: 'email', url: 'mailto:yuna@example.design' },
  ],
};

// ──────────────────────────────────────────────
// 전체 더미 프로필 목록
// ──────────────────────────────────────────────
export const DUMMY_PROFILES: ProfileData[] = [
  CREATOR_PROFILE,
  DEVELOPER_PROFILE,
  DESIGNER_PROFILE,
];

/**
 * username 으로 더미 프로필을 조회합니다.
 * 일치하는 항목이 없으면 undefined 를 반환합니다.
 */
export function getDummyProfile(username: string): ProfileData | undefined {
  return DUMMY_PROFILES.find(
    (p) => p.username.toLowerCase() === username.toLowerCase(),
  );
}
