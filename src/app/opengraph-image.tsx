import { ImageResponse } from 'next/og';
import { OG_COLORS, OG_CONTENT_TYPE, OG_SIZE, OgLogo, loadOgFonts } from '@/lib/og';

/**
 * 일반 경로용 Open Graph 이미지
 * - app 루트에 두면 /, /my, /links, /stats 등 자체 OG 이미지가 없는 모든 경로가 이 이미지를 사용합니다.
 * - 빌드 시 한 번 생성되는 정적 이미지입니다.
 */
export const alt = 'MyLink - 개발자를 위한 모든 링크를 한 페이지에';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const SAMPLE_LINKS = [
  { title: 'GitHub', clicks: 128, highlight: true },
  { title: '기술 블로그', clicks: 74, highlight: false },
  { title: '포트폴리오', clicks: 52, highlight: false },
];

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#FFFFFF',
          fontFamily: 'Pretendard',
          overflow: 'hidden',
        }}
      >
        {/* 배경 블롭 */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 680,
            height: 680,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(24,94,247,0.18) 0%, rgba(24,94,247,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -260,
            left: -200,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(124,77,255,0.14) 0%, rgba(124,77,255,0) 70%)',
          }}
        />

        {/* 좌측: 카피 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 0 64px 80px',
            width: 680,
          }}
        >
          <OgLogo />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                padding: '8px 18px',
                borderRadius: 9999,
                background: OG_COLORS.blueSoft,
                color: OG_COLORS.blue,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 9999, background: OG_COLORS.blue, marginRight: 10 }} />
              개발자를 위한 링크 페이지
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 26,
                fontSize: 84,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: -2.5,
                color: '#111827',
              }}
            >
              <div style={{ display: 'flex' }}>
                <span style={{ marginRight: 22 }}>내</span>
                <span
                  style={{
                    color: OG_COLORS.blue,
                    backgroundImage: 'linear-gradient(transparent 68%, rgba(24,94,247,0.16) 68%)',
                  }}
                >
                  GitHub,
                </span>
              </div>
              <div style={{ display: 'flex' }}>링크 하나로.</div>
            </div>

            <div style={{ display: 'flex', marginTop: 26, fontSize: 28, fontWeight: 500, color: OG_COLORS.grey700 }}>
              블로그, 포트폴리오까지 한 페이지에 담아보세요.
            </div>
          </div>
        </div>

        {/* 우측: 프로필 카드 목업 */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 380,
              padding: 32,
              borderRadius: 40,
              background: '#FFFFFF',
              border: `1px solid ${OG_COLORS.grey200}`,
              boxShadow: '0 30px 70px rgba(25,31,40,0.16), 0 4px 12px rgba(25,31,40,0.06)',
              transform: 'rotate(3deg)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 9999,
                  background: `linear-gradient(135deg, ${OG_COLORS.blue}, #7C4DFF)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: 30,
                  fontWeight: 900,
                }}
              >
                ML
              </div>
              <div style={{ display: 'flex', marginTop: 14, fontSize: 26, fontWeight: 900, color: OG_COLORS.grey900 }}>
                @mylink_dev
              </div>
              <div style={{ display: 'flex', marginTop: 4, fontSize: 17, fontWeight: 500, color: OG_COLORS.grey500 }}>
                프론트엔드 개발자
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              {SAMPLE_LINKS.map((link) => (
                <div
                  key={link.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 60,
                    padding: '0 22px',
                    borderRadius: 20,
                    background: link.highlight ? OG_COLORS.blueSoft : '#F9FAFB',
                    border: `1px solid ${link.highlight ? '#D6E6FF' : OG_COLORS.grey200}`,
                    fontSize: 21,
                    fontWeight: 700,
                    color: link.highlight ? OG_COLORS.blue : OG_COLORS.grey900,
                  }}
                >
                  <span>{link.title}</span>
                  <span style={{ fontSize: 17, fontWeight: 500, color: OG_COLORS.grey500 }}>{link.clicks}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 떠다니는 배지: 총 클릭수 */}
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: 150,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px',
              borderRadius: 22,
              background: '#FFFFFF',
              border: `1px solid ${OG_COLORS.grey200}`,
              boxShadow: '0 12px 32px rgba(25,31,40,0.12)',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: OG_COLORS.blueSoft,
                color: OG_COLORS.blue,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 4,
                paddingBottom: 10,
              }}
            >
              {/* 미니 막대 차트 아이콘 */}
              <div style={{ width: 5, height: 10, borderRadius: 3, background: OG_COLORS.blue }} />
              <div style={{ width: 5, height: 18, borderRadius: 3, background: OG_COLORS.blue }} />
              <div style={{ width: 5, height: 14, borderRadius: 3, background: OG_COLORS.blue }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: OG_COLORS.grey500 }}>총 클릭수</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: OG_COLORS.grey900 }}>254</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
