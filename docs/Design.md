# 🎨 [Design] shadcn/ui 기반 토스 디자인 시스템 (TDS) 가이드라인

본 문서는 **shadcn/ui** 컴포넌트 시스템을 **토스 디자인 시스템(TDS, Toss Design System)**의 시각적/상호작용 원칙에 맞추어 확장 및 구축하기 위한 설계 지침서입니다.

---

## 1. 디자인 철학 (Design Principles)

1. **Simplicity & Clarity (명확함과 단순함)**
   - 군더더기 없는 대담한 타이포그래피, 직관적인 시각적 위계(Visual Hierarchy), 깔끔한 여백을 제공합니다.
2. **Smooth Interactivity (부드러운 상호작용)**
   - 터치 및 클릭 시 빠른 반응과 자연스러운 트랜지션, 둥근 모서리(Border Radius) 및 입체감 있는 섀도우(Elevation)를 적용합니다.
3. **Consistent Theme Tokens (일관된 디자인 토큰)**
   - shadcn/ui의 시맨틱 컬러 토큰(`--primary`, `--background`, `--card`, `--radius` 등)을 토스 브랜드 컬러(Toss Blue `#3182f6`) 및 회색조 팔레트와 1:1 매핑하여 통합 관리합니다.

---

## 2. 디자인 토큰 정의 (Design Tokens)

### 2.1 컬러 팔레트 (Color Palette)

#### 🔵 Brand & Primary Colors
| 토큰명 | Hex 코드 | 설명 | shadcn/ui 매핑 |
| :--- | :--- | :--- | :--- |
| `tds-blue-500` | `#3182f6` | 토스 시그니처 블루 | `--primary` |
| `tds-blue-600` | `#1b64da` | Primary Hover / Active | `--primary-hover` |
| `tds-blue-50` | `#e8f3ff` | Light Sub / Soft Tint | `--primary-subtle` / `--accent` |

#### 🔘 Neutral & Grayscale
| 토큰명 | Hex 코드 | 설명 | shadcn/ui 매핑 |
| :--- | :--- | :--- | :--- |
| `tds-grey-900` | `#191f28` | Primary Text | `--foreground`, `--card-foreground` |
| `tds-grey-800` | `#333d4b` | Sub Heading Text | - |
| `tds-grey-700` | `#4e5968` | Body & Label Text | `--muted-foreground` |
| `tds-grey-600` | `#6b7684` | Icon / Secondary Text | - |
| `tds-grey-500` | `#8b95a1` | Placeholder / Disabled Text | - |
| `tds-grey-400` | `#b0b8c1` | Inactive Icon / Border Soft | - |
| `tds-grey-300` | `#d1d6db` | Divider / Border | `--border`, `--input` |
| `tds-grey-200` | `#e5e8eb` | Soft Line Divider | - |
| `tds-grey-100` | `#f2f4f6` | Default Page Background | `--background` |
| `tds-grey-50` | `#f9fafb` | Card Surface Light Background | `--card` |

#### 🔴 Functional / Feedback Colors
| 토큰명 | Hex 코드 | 설명 | shadcn/ui 매핑 |
| :--- | :--- | :--- | :--- |
| `tds-red-500` | `#f04452` | Error / Danger / Delete | `--destructive` |
| `tds-green-500` | `#20874e` | Success / Positive State | - |
| `tds-yellow-500` | `#ffc342` | Warning / Alert | - |

---

### 2.2 타이포그래피 (Typography)

- **Primary Font Family**: `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif`
- **숫자 데이터**: `tabular-nums` (고정 폭 숫자 적용)

| 스타일명 | Font Size | Line Height | Font Weight | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| `Display Title` | 28px (1.75rem) | 1.3 | Bold (700) | 대시보드 메인 타이틀 |
| `Section Title` | 22px (1.375rem) | 1.35 | Bold (700) / SemiBold (600) | 카드 및 모달 섹션 헤딩 |
| `Subtitle` | 17px (1.0625rem) | 1.4 | SemiBold (600) | 서브 타이틀 및 강조 텍스트 |
| `Body Bold` | 15px (0.9375rem) | 1.45 | SemiBold (600) | 주요 본문 / 버튼 텍스트 |
| `Body Regular` | 15px (0.9375rem) | 1.45 | Regular (400) | 기본 본문 텍스트 |
| `Caption` | 13px (0.8125rem) | 1.4 | Regular (400) | 바텀 캡션 / 날짜 / 힌트 텍스트 |

---

### 2.3 레이아웃 & 그림자 (Elevation & Radius)

#### 📐 Border Radius
- **기본 Radius**: `12px` (`0.75rem` / `var(--radius)`)
- **버튼**: `12px` (`rounded-xl`) 또는 Pill 스타일 `9999px` (`rounded-full`)
- **카드/모달**: `16px` (`rounded-2xl`) ~ `24px` (`rounded-3xl`)

#### 🌫️ Shadow & Elevation (그림자)
| 클래스명 | Box Shadow 정의 | 적용 대상 |
| :--- | :--- | :--- |
| `shadow-tds-1` | `0 1px 2px rgba(25, 31, 40, 0.04), 0 1px 1px rgba(25, 31, 40, 0.04)` | 기본 카드 / 리스트 아이템 |
| `shadow-tds-2` | `0 4px 12px rgba(25, 31, 40, 0.06), 0 1px 2px rgba(25, 31, 40, 0.04)` | 호버 상태 카드 / 드롭다운 |
| `shadow-tds-3` | `0 12px 32px rgba(25, 31, 40, 0.10), 0 2px 6px rgba(25, 31, 40, 0.06)` | 다이얼로그 모달 / 바텀시트 |
| `shadow-tds-toast` | `0 8px 24px rgba(25, 31, 40, 0.16)` | 플로팅 토스트 메시지 |

---

## 3. shadcn/ui 컴포넌트별 TDS 맞춤 커스텀 규칙

### 3.1 Button (`src/components/ui/button.tsx`)
- **Default (Primary)**: 배경 `#3182f6` (`bg-primary`), 텍스트 `#ffffff`, active 시 Scale 피드백(`active:scale-[0.98] transition-transform`)
- **Secondary**: 배경 `#e8f3ff` (`bg-tds-blue-50`), 텍스트 `#3182f6` (`text-tds-blue-500`)
- **Muted / Ghost**: 배경 `#f2f4f6`, 텍스트 `#4e5968`
- **Destructive**: 배경 `#f04452`, 텍스트 `#ffffff`

### 3.2 Card (`src/components/ui/card.tsx`)
- **배경**: `#ffffff`, **Border**: `none` 또는 `#e5e8eb` 1px border
- **Shadow**: `shadow-tds-1` 기본 적용, 호버 시 `shadow-tds-2`
- **Radius**: `16px` (`rounded-2xl`)

### 3.3 Input / Form (`src/components/ui/input.tsx`)
- **배경**: `#f9fafb` (`tds-grey-50`)
- **Focus Ring**: `#3182f6` 2px 아웃라인 (`focus:ring-2 focus:ring-[#3182f6]`)
- **Radius**: `12px` (`rounded-xl`)

### 3.4 Dialog / Sheet (모달 & 바텀시트)
- **Overlay**: `rgba(0, 0, 0, 0.5)` 반투명 블러
- **Radius**: 데스크톱 `20px`, 모바일 바텀시트 상단 `24px`
- **Shadow**: `shadow-tds-3`

---

## 4. CSS 및 globals.css 매핑 가이드

[globals.css](file:///Users/isua/Desktop/my-link/src/app/globals.css)에서 shadcn/ui 기본 시맨틱 변수가 TDS 디자인 토큰을 가리키도록 설정되어 있습니다.

```css
:root {
  --background: #f2f4f6;
  --foreground: #191f28;
  --card: #ffffff;
  --card-foreground: #191f28;
  --primary: #3182f6;
  --primary-foreground: #ffffff;
  --secondary: #e8f3ff;
  --secondary-foreground: #3182f6;
  --muted: #f2f4f6;
  --muted-foreground: #4e5968;
  --destructive: #f04452;
  --border: #e5e8eb;
  --input: #e5e8eb;
  --ring: #3182f6;
  --radius: 0.75rem; /* 12px */
}
```
