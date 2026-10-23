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
- [x] **[Dialog 1] 새 링크/헤더 블록 추가 다이얼로그 (React Hook Form + Zod)**
  - [x] 웹사이트 링크 / 섹션 헤더 탭 분리
  - [x] 제목, URL, 아이콘 선택, 공개 여부 설정
  - [x] **Zod 스키마 & RHF 폼 검증**: 제목 필수/길이 제한(1~50자), URL 유효성 및 XSS 보안 프로토콜(`javascript:` 등) 방어 검사
- [x] **블록 정보 인라인 수정(Inline Edit) UI (React Hook Form + Zod + Firestore)**
  - [x] 카드 내 인라인 편집 폼 전환 및 기존 데이터 자동 pre-fill
  - [x] 수정 내용 파이어베이스 Firestore(`users/anonymous/links`) 및 로컬 스토리지 즉시 반영
  - [x] **동일한 Zod 스키마 & RHF 폼 검증**: 제목(1~50자), URL 유효성 및 XSS 보안 프로토콜 검사
  - [x] 링크 카드에 수정/삭제 액션 버튼 상시 표시 (Always Visible)
- [x] **[Dialog 2] 블록 삭제 확인 모달 (Delete Confirmation Dialog with Firestore)**
  - [x] 제목: "정말 삭제하시겠습니까?"
  - [x] 삭제 대상 링크 이름 표시
  - [x] 빨간색 경고 문구: "이 작업은 되돌릴 수 없습니다"
  - [x] 버튼: [취소], [삭제하기]
  - [x] 파이어베이스 Firestore(`users/anonymous/links`) 실시간 삭제 연동 및 로컬 스토리지 동기화
- [x] **[Dialog 3] 프로필 정보 & 테마 스타일 설정 다이얼로그 (React Hook Form + Zod)**
  - [x] 닉네임, 한줄 소개, 아바타 URL 편집
  - [x] 테마 프리셋 6종 시각적 선택 칩
  - [x] 버튼 스타일 3종(라운드, 모서리, 아웃라인) 선택
  - [x] **Zod 스키마 & RHF 폼 검증**: 닉네임(1~30자 필수), 한줄소개 글자수 제한(150자) 및 실시간 카운터, 아바타 URL 검사
- [x] **[Dialog 4] 소셜 아카이브 링크 관리 다이얼로그 (React Hook Form + Zod)**
  - [x] 매체(인스타그램, 유튜브, 깃허브, 트위터, 이메일, 웹사이트) 추가
  - [x] 기존 소셜 링크 삭제
  - [x] **Zod 스키마 & RHF 폼 검증**: 매체별 이메일/HTTP/HTTPS URL 유효성 검사
- [x] **[Dialog 5] 통계 & 애널리틱스 다이얼로그**
  - [x] 총 방문수(PV) 및 총 클릭 수 요약 카드
  - [x] 개별 링크별 클릭 수 및 비율 퍼센트 바
  - [x] 통계 데이터 초기화 기능
- [x] **[Dialog 6] 페르소나 / 프로필 스위처 다이얼로그 (React Hook Form + Zod)**
  - [x] 샘플 페르소나 3종(`demo`, `creator_hana`, `dev_minjun`, `design_yuna`) 원클릭 전환
  - [x] 신규 커스텀 URL 핸들 입력 및 가입 생성
  - [x] **Zod 스키마 & RHF 폼 검증**: 핸들 형식(영문 소문자/숫자/언더바, 3~20자) 검사
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

## 4. 구글 소셜 로그인 & Firestore users/{user.uid}/links 개인화
- [x] **Firebase Auth 구글 소셜 로그인 연동**
  - [x] `src/lib/firebase.ts`: `loginWithGoogle`, `logoutFirebase`, `saveUserProfileToFirestore`, `getUserProfileFromFirestore` 구현
  - [x] `src/context/AuthContext.tsx`: 전역 인증 상태 관리 (`AuthProvider`, `useAuth`)
  - [x] `src/app/layout.tsx`: `AuthProvider` 전역 래핑
- [x] **공통 상단 헤더 컴포넌트 (`src/components/Header.tsx`)**
  - [x] 구글 소셜 로그인 버튼 및 로딩 피드백
  - [x] 로그인 상태 시 구글 프로필 사진, 닉네임, 이메일, 로그아웃 버튼 노출
  - [x] 개인화된 Firestore 경로 (`users/{user.uid}/links`) 뱃지 및 원클릭 복사 기능
- [x] **Firestore users/{user.uid}/links 개인화 저장 및 실시간 동기화**
  - [x] `users/anonymous/links`에서 `users/{user.uid}/links`로 마이그레이션
  - [x] 블록 추가, 인라인 수정, 순서 변경, 삭제 확인 모달 모두 개인화된 컬렉션 경로에 저장
  - [x] `src/app/my/page.tsx` 대시보드 화면 상단에 Firestore 유저 정보 및 경로 상세 표시
- [x] **로그인 상태에 따른 화면 분기 처리 (`src/app/my/page.tsx`)**
  - [x] **미로그인 상태**: 로그인 유도 배너, 설명 문구, 주요 혜택 카드 3종, 중앙 Google 로그인 버튼 노출
  - [x] **로그인 상태**: 개인화된 유저 정보 카드 및 링크 CRUD 대시보드 활성화
- [x] **와이어프레임 1:1 오프닝 랜딩 페이지 (`src/app/page.tsx`)**
  - [x] `Development in One Link.` 메인 타이포그래피 & 카피라이팅 구현
  - [x] 상단 헤더: `MyLink` 로고 + `로그인` 버튼
  - [x] 중앙 CTA: `Google로 시작하기` 버튼 (구글 로그인 팝업 트리거)
  - [x] 하단 목업 카드: 아바타/텍스트 스켈레톤 + 활성 파란 링크 바 + 회색 링크 바 3D 틸트 카드
  - [x] 로그인 완료 시 마이링크 본 페이지(`/my`)로 자동 리다이렉트 연동
- [x] **Base UI (`@base-ui/react`) 표준 규격 검증 완료**

---

## 5. 검증 및 문서화 (Verification & Docs)
- [x] Next.js 16 `npm run build` 빌드 검증 통과 (Turbopack)
- [x] `GEMINI.md` 한글 가이드라인 작성
- [x] `PLAN.md`, `TASKS.md`, `WALKTHROUGH.md` 문서 최신화
