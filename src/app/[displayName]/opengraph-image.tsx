import { ImageResponse } from 'next/og';
import { getLinksFromFirestore, getUserByDisplayName } from '@/lib/firebase';
import { DUMMY_PROFILES } from '@/lib/dummyData';
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OG_THEMES,
  OgLogo,
  OgThemePalette,
  clamp,
  loadOgFonts,
  stripEmoji,
} from '@/lib/og';
import type { LinkItem, ThemeType } from '@/types';

/**
 * 동적 경로(/[displayName])용 Open Graph 이미지
 * - 요청이 들어올 때 프로필 정보를 읽어 사용자별 이미지를 그립니다.
 * - 사용자가 고른 프로필 테마(6종) 색감을 그대로 반영합니다.
 */
export const alt = 'MyLink 프로필';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface OgProfile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  theme: ThemeType;
  links: LinkItem[];
}

const VALID_THEMES: ThemeType[] = ['light', 'dark', 'neon', 'pastel', 'minimal', 'gradient'];

/** 페이지(page.tsx)와 같은 순서로 프로필 찾기: Firestore 사용자 → 시연용 더미 프로필 */
async function resolveProfile(displayName: string): Promise<OgProfile | null> {
  const firestoreUser = await getUserByDisplayName(displayName);

  if (firestoreUser) {
    const links = await getLinksFromFirestore(firestoreUser.uid);
    const theme = VALID_THEMES.includes(firestoreUser.theme) ? (firestoreUser.theme as ThemeType) : 'gradient';
    return {
      name: firestoreUser.displayName || displayName,
      handle: displayName,
      bio: firestoreUser.bio || '개인 링크 인 바이오 서비스',
      avatarUrl: firestoreUser.photoURL || '',
      theme,
      links,
    };
  }

  const lower = displayName.toLowerCase();
  const dummy = DUMMY_PROFILES.find(
    (p) => p.name.toLowerCase() === lower || p.username.toLowerCase() === lower || p.name.toLowerCase().includes(lower)
  );
  if (dummy) {
    return {
      name: dummy.name,
      handle: dummy.username,
      bio: dummy.bio,
      avatarUrl: dummy.avatarUrl,
      theme: dummy.theme,
      links: dummy.links,
    };
  }

  return null;
}

/** 아바타 이미지를 미리 받아 data URL로 변환 (실패하면 빈 문자열 → 이니셜로 대체) */
async function toDataUrl(url: string): Promise<string> {
  if (!url) return '';
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return '';
    const type = res.headers.get('content-type') || 'image/jpeg';
    if (!/^image\/(png|jpe?g|gif|svg\+xml)/.test(type)) return '';
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buffer.toString('base64')}`;
  } catch {
    return '';
  }
}

/** 아바타: 사진이 있으면 사진, 없으면 이름 첫 글자 */
function Avatar({ profile, palette }: { profile: OgProfile; palette: OgThemePalette }) {
  const ring = {
    width: 176,
    height: 176,
    borderRadius: 9999,
    padding: 6,
    background: palette.linkBg === 'transparent' ? palette.text : 'rgba(255,255,255,0.6)',
    display: 'flex',
  } as const;

  if (profile.avatarUrl) {
    return (
      <div style={ring}>
        <img
          src={profile.avatarUrl}
          alt=""
          width={164}
          height={164}
          style={{ width: 164, height: 164, borderRadius: 9999, objectFit: 'cover' }}
        />
      </div>
    );
  }

  const initial = stripEmoji(profile.name).charAt(0).toUpperCase() || 'M';
  return (
    <div style={ring}>
      <div
        style={{
          width: 164,
          height: 164,
          borderRadius: 9999,
          background: 'linear-gradient(135deg, #185EF7, #7C4DFF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: 72,
          fontWeight: 900,
        }}
      >
        {initial}
      </div>
    </div>
  );
}

/** 프로필을 찾지 못했을 때의 기본 이미지 */
function FallbackImage({ handle }: { handle: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: 'linear-gradient(135deg, #185EF7 0%, #5B3CF5 100%)',
        fontFamily: 'Pretendard',
        color: '#FFFFFF',
      }}
    >
      <OgLogo color="#FFFFFF" textColor="#FFFFFF" badgeTextColor="#185EF7" />
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, letterSpacing: -1.5 }}>
        {clamp(`/${handle}`, 24)}
      </div>
      <div style={{ display: 'flex', fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
        개발자를 위한 모든 링크를 한 페이지에
      </div>
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  const { displayName } = await params;
  const decoded = decodeURIComponent(displayName || '').trim();

  const [fonts, profile] = await Promise.all([loadOgFonts(), decoded ? resolveProfile(decoded) : null]);

  if (!profile) {
    return new ImageResponse(<FallbackImage handle={decoded || 'mylink'} />, { ...size, fonts });
  }

  profile.avatarUrl = await toDataUrl(profile.avatarUrl);
  const palette = OG_THEMES[profile.theme] ?? OG_THEMES.gradient;
  const activeLinks = profile.links.filter((l) => l.isActive && !l.isHeader && l.title);
  const previewLinks = activeLinks.slice(0, 3);
  const name = clamp(stripEmoji(profile.name) || profile.handle, 16);
  const bio = clamp(stripEmoji(profile.bio), 58);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: palette.background,
          fontFamily: 'Pretendard',
          padding: '56px 72px',
          position: 'relative',
        }}
      >
        {/* 장식용 원 */}
        <div
          style={{
            position: 'absolute',
            top: -140,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: palette.accent,
            opacity: 0.12,
          }}
        />

        {/* 본문: 좌측 프로필 / 우측 링크 */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 64 }}>
          {/* 좌측 프로필 */}
          <div style={{ display: 'flex', flexDirection: 'column', width: 560 }}>
            <Avatar profile={profile} palette={palette} />
            <div
              style={{
                display: 'flex',
                marginTop: 28,
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.1,
                color: palette.text,
              }}
            >
              {name}
            </div>
            <div style={{ display: 'flex', marginTop: 10, fontSize: 26, fontWeight: 700, color: palette.sub }}>
              @{clamp(profile.handle, 24)}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 18,
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.45,
                color: palette.text,
                opacity: 0.85,
              }}
            >
              {bio}
            </div>
          </div>

          {/* 우측 링크 미리보기 */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
            {previewLinks.length > 0 ? (
              previewLinks.map((link, i) => (
                <div
                  key={link.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 76,
                    padding: '0 28px',
                    borderRadius: 24,
                    background: palette.linkBg,
                    border: `2px solid ${palette.linkBorder}`,
                    color: palette.linkText,
                    fontSize: 26,
                    fontWeight: 700,
                    boxShadow: palette.linkBg === 'transparent' ? 'none' : '0 8px 24px rgba(0,0,0,0.08)',
                    opacity: 1 - i * 0.12,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 9999,
                      background: palette.accent,
                      marginRight: 18,
                    }}
                  />
                  {clamp(stripEmoji(link.title), 18)}
                </div>
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 180,
                  borderRadius: 24,
                  border: `2px dashed ${palette.linkBorder}`,
                  color: palette.sub,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                곧 링크가 추가될 예정이에요
              </div>
            )}
            {activeLinks.length > previewLinks.length && (
              <div style={{ display: 'flex', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: palette.sub }}>
                + {activeLinks.length - previewLinks.length}개 링크 더 보기
              </div>
            )}
          </div>
        </div>

        {/* 하단 브랜드 바 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px 10px 10px',
              borderRadius: 9999,
              background: palette.chipBg,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: '#185EF7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              ML
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: palette.chipText }}>MyLink</span>
          </div>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: palette.sub }}>
            링크 {activeLinks.length}개 · 내 모든 링크를 한 곳에
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
