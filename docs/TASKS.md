# ✅ [TASKS] 마이링크 (MyLink) 개발 태스크 목록

## 1. 타입 및 로컬 상태 엔지니어링 (Type & Storage Engineering)
- [x] `src/types/index.ts` 타입 정의 업데이트
  - [x] `LinkItem`에 optional `clicks?: number` 속성 추가
  - [x] `ProfileData`에 optional `pageViews?: number` 속성 추가
- [x] `src/lib/profileStorage.ts` 기능 확장
  - [x] `recordPageView(username)` 구현 (프로필 로딩 시 PV 카운팅)
  - [x] `recordLinkClick(username, linkId)` 구현 (링크 클릭시 클릭수 누적)
  - [x] 더미 데이터 연동 및 `localStorage` 자동 시딩

---

## 2. 관리자 대시보드 다이얼로그 모달 구현 (Dashboard & Dialog Forms)
- [x] `src/app/my/page.tsx` 대시보드 UI 개발
  - [x] 상단 아바타 및 헤더 정보 컴포넌트
  - [x] 액션 컨트롤 바 (프로필·테마 / 소셜 링크 / 통계 / 프로필 전환)
- [x] **[Dialog 1] 새 링크/헤더 블록 추가 다이얼로그**
  - [x] 웹사이트 링크 / 섹션 헤더 탭 분리
  - [x] 제목, URL, 아이콘 선택, 공개 여부 설정
  - [x] **입력 유효성 검사 (Input Validation)**: 제목 필수/길이 제한(1~50자), URL 유효성 및 XSS 보안 프로토콜(`javascript:` 등) 방어 검사
- [x] **[Dialog 2] 블록 정보 수정(Edit) 다이얼로그**
  - [x] 기존 데이터 자동 pre-fill
  - [x] 수정 내용 로컬 스토리지 즉시 반영
  - [x] **입력 유효성 검사 (Input Validation)**: 제목 및 URL 유효성 검사 적용
- [x] **[Dialog 3] 프로필 정보 & 테마 스타일 설정 다이얼로그**
  - [x] 닉네임, 한줄 소개, 아바타 URL 편집
  - [x] 테마 프리셋 6종 시각적 선택 칩
  - [x] 버튼 스타일 3종(라운드, 모서리, 아웃라인) 선택
  - [x] **입력 유효성 검사 (Input Validation)**: 닉네임(1~30자 필수), 한줄소개 글자수 제한(150자) 및 실시간 카운터, 아바타 URL 검사
- [x] **[Dialog 4] 소셜 아카이브 링크 관리 다이얼로그**
  - [x] 매체(인스타그램, 유튜브, 깃허브, 트위터, 이메일, 웹사이트) 추가
  - [x] 기존 소셜 링크 삭제
  - [x] **입력 유효성 검사 (Input Validation)**: 매체별 이메일/HTTP/HTTPS URL 유효성 검사
- [x] **[Dialog 5] 통계 & 애널리틱스 다이얼로그**
  - [x] 총 방문수(PV) 및 총 클릭 수 요약 카드
  - [x] 개별 링크별 클릭 수 및 비율 퍼센트 바
  - [x] 통계 데이터 초기화 기능
- [x] **[Dialog 6] 페르소나 / 프로필 스위처 다이얼로그**
  - [x] 샘플 페르소나 3종(`demo`, `creator_hana`, `dev_minjun`, `design_yuna`) 원클릭 전환
  - [x] 신규 커스텀 URL 핸들 입력 및 가입 생성
  - [x] **입력 유효성 검사 (Input Validation)**: 핸들 형식(영문 소문자/숫자/언더바, 3~20자) 검사
- [x] **블록 순서 변경 (Up / Down)**
  - [x] 목록 내 위/아래 위치 이동 및 저장

---

## 3. 공개 프로필 뷰 연동 (Public Profile Integration)
- [x] `src/components/ProfileView.tsx`
  - [x] 마운트 시 `recordPageView` 자동 호출
  - [x] `LinkCard`에 `onLinkClick` 전달하여 클릭 이벤트 추적
- [x] `src/components/LinkCard.tsx`
  - [x] `onClick` 핸들러에서 클릭 카운트 증가 연동

---

## 4. 검증 및 문서화 (Verification & Docs)
- [x] Next.js 16 `npm run build` 빌드 검증 통과
- [x] `GEMINI.md` 한글 가이드라인 작성
- [x] `PLAN.md`, `TASKS.md`, `WALKTHROUGH.md` 문서 작성
