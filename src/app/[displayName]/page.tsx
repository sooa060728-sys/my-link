import { notFound } from 'next/navigation';
import { getUserByDisplayName } from '@/lib/firebase';
import { ProfileView } from '@/components/ProfileView';
import { DUMMY_PROFILES } from '@/lib/dummyData';
import { getProfileData } from '@/lib/profileStorage';
import { ProfileData } from '@/types';

interface DisplayNamePageProps {
  params: Promise<{ displayName: string }>;
}

/**
 * [displayName] 동적 라우팅 페이지
 * - Firestore users 컬렉션에서 displayName으로 사용자 검색
 * - 검색된 사용자의 users/{userId}/links 경로에서 링크 목록 실시간 로드
 * - 일치하는 사용자가 없을 경우 404 Not Found 페이지 반환
 */
export default async function DisplayNameProfilePage({ params }: DisplayNamePageProps) {
  const { displayName } = await params;
  const decodedDisplayName = decodeURIComponent(displayName || '').trim();

  if (!decodedDisplayName) {
    notFound();
  }

  // 1. Firestore users 컬렉션에서 displayName으로 사용자 검색
  const firestoreUser = await getUserByDisplayName(decodedDisplayName);

  let targetUserId: string | undefined = undefined;
  let profileData: ProfileData | null = null;

  if (firestoreUser) {
    targetUserId = firestoreUser.uid;
    profileData = {
      username: firestoreUser.displayName || decodedDisplayName,
      name: firestoreUser.displayName || decodedDisplayName,
      bio: firestoreUser.bio || '개인 링크 인 바이오 서비스',
      avatarUrl: firestoreUser.photoURL || '',
      theme: (firestoreUser.theme as any) || 'gradient',
      buttonStyle: (firestoreUser.buttonStyle as any) || 'rounded',
      links: [], // useLinksQuery(targetUserId)에서 users/{targetUserId}/links 자동 로드
      socials: firestoreUser.socials || [],
    };
  } else {
    // 2. 시연용 더미 페르소나 매칭 (fallback: name 또는 username 일치 여부)
    const lower = decodedDisplayName.toLowerCase();
    const dummy = DUMMY_PROFILES.find(
      (p) =>
        p.name.toLowerCase() === lower ||
        p.username.toLowerCase() === lower ||
        p.name.toLowerCase().includes(lower)
    );

    if (dummy) {
      profileData = dummy;
    } else if (lower === 'demo') {
      profileData = getProfileData('demo');
    }
  }

  // 3. 일치하는 사용자가 없을 경우 404 페이지 트리거
  if (!profileData) {
    notFound();
  }

  return (
    <ProfileView
      displayName={decodedDisplayName}
      userId={targetUserId}
      initialProfile={profileData}
    />
  );
}
