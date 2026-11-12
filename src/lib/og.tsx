import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ThemeType } from '@/types';

/* =========================================================================
 * Open Graph 이미지 공통 설정
 * - app/opengraph-image.tsx (일반 경로)
 * - app/[displayName]/opengraph-image.tsx (동적 프로필 경로)
 * ========================================================================= */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// TDS 브랜드 컬러
export const OG_COLORS = {
  blue: '#185EF7',
  blueSoft: '#EEF5FF',
  violet: '#5B3CF5',
  grey900: '#191F28',
  grey700: '#4E5968',
  grey500: '#8B95A1',
  grey200: '#E5E8EB',
  grey100: '#F2F4F6',
  white: '#FFFFFF',
};

/**
 * Pretendard 폰트 로드 (한글 포함 subset, woff)
 * - assets/fonts 폴더의 파일을 읽어 ImageResponse에 넘깁니다.
 * - Satori는 woff2를 지원하지 않아 woff를 사용합니다.
 */
export async function loadOgFonts() {
  const dir = join(process.cwd(), 'assets/fonts');
  const [medium, bold, black] = await Promise.all([
    readFile(join(dir, 'Pretendard-Medium.subset.woff')),
    readFile(join(dir, 'Pretendard-Bold.subset.woff')),
    readFile(join(dir, 'Pretendard-Black.subset.woff')),
  ]);

  return [
    { name: 'Pretendard', data: medium, weight: 500 as const, style: 'normal' as const },
    { name: 'Pretendard', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Pretendard', data: black, weight: 900 as const, style: 'normal' as const },
  ];
}

/** 이모지·특수 기호 제거 (OG 이미지에서 깨지지 않도록) */
export function stripEmoji(text: string) {
  return text
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 글자 수 제한 */
export function clamp(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/* =========================================================================
 * 프로필 테마별 OG 팔레트 (ThemeContainer의 6가지 테마와 같은 색감)
 * ========================================================================= */
export interface OgThemePalette {
  background: string;
  text: string;
  sub: string;
  linkBg: string;
  linkBorder: string;
  linkText: string;
  accent: string;
  chipBg: string;
  chipText: string;
}

export const OG_THEMES: Record<ThemeType, OgThemePalette> = {
  light: {
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF5FF 100%)',
    text: '#0F172A',
    sub: '#64748B',
    linkBg: '#FFFFFF',
    linkBorder: '#E2E8F0',
    linkText: '#0F172A',
    accent: '#185EF7',
    chipBg: '#FFFFFF',
    chipText: '#185EF7',
  },
  dark: {
    background: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
    text: '#F1F5F9',
    sub: '#94A3B8',
    linkBg: '#1E293B',
    linkBorder: '#334155',
    linkText: '#F1F5F9',
    accent: '#60A5FA',
    chipBg: '#1E293B',
    chipText: '#F1F5F9',
  },
  neon: {
    background: 'linear-gradient(135deg, #030712 0%, #052E1F 100%)',
    text: '#34D399',
    sub: 'rgba(52, 211, 153, 0.65)',
    linkBg: '#0B1220',
    linkBorder: 'rgba(52, 211, 153, 0.6)',
    linkText: '#34D399',
    accent: '#34D399',
    chipBg: '#0B1220',
    chipText: '#34D399',
  },
  pastel: {
    background: 'linear-gradient(135deg, #FFE4E6 0%, #F3E8FF 50%, #E0F2FE 100%)',
    text: '#1E293B',
    sub: '#64748B',
    linkBg: 'rgba(255, 255, 255, 0.75)',
    linkBorder: '#FFFFFF',
    linkText: '#1E293B',
    accent: '#A855F7',
    chipBg: 'rgba(255, 255, 255, 0.8)',
    chipText: '#7C3AED',
  },
  minimal: {
    background: '#F5F5F4',
    text: '#1C1917',
    sub: '#78716C',
    linkBg: 'transparent',
    linkBorder: '#1C1917',
    linkText: '#1C1917',
    accent: '#1C1917',
    chipBg: '#1C1917',
    chipText: '#F5F5F4',
  },
  gradient: {
    background: 'linear-gradient(135deg, #7E22CE 0%, #4F46E5 50%, #EC4899 100%)',
    text: '#FFFFFF',
    sub: 'rgba(255, 255, 255, 0.75)',
    linkBg: 'rgba(255, 255, 255, 0.15)',
    linkBorder: 'rgba(255, 255, 255, 0.35)',
    linkText: '#FFFFFF',
    accent: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.18)',
    chipText: '#FFFFFF',
  },
};

/** MyLink 로고 (ML 배지 + 워드마크) */
export function OgLogo({
  color = OG_COLORS.blue,
  textColor,
  badgeTextColor = '#FFFFFF',
}: {
  color?: string;
  textColor?: string;
  badgeTextColor?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: badgeTextColor,
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        <span style={{ color: badgeTextColor }}>ML</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: textColor ?? color, letterSpacing: -0.5 }}>MyLink</div>
    </div>
  );
}
