import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { LinkItem } from '@/types';

// 파이어베이스 환경설정 객체
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCJI0bJ71PxKeYh4Z1zRFj4GCNj2W1tEIE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "my-shcool-link.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "my-shcool-link",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "my-shcool-link.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "83454724913",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:83454724913:web:eb16232429dfb86f5b7e10",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-MHKLD0FK6T"
};

// Next.js (App Router / SSR) 환경에서 파이어베이스 앱 중복 생성 방지
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 파이어베이스 주요 서비스 인스턴스
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Google 인증 프로바이더 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics는 클라이언트 사이드 브라우저 환경에서만 지원되므로 조건부 초기화
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

/**
 * 구글 소셜 로그인
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await saveUserProfileToFirestore(user);
    return user;
  } catch (error) {
    console.error('Google 로그인 실패:', error);
    throw error;
  }
}

/**
 * 로그아웃
 */
export async function logoutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
}

/**
 * 유저 프로필 정보를 Firestore users/{user.uid}에 저장/동기화
 */
export async function saveUserProfileToFirestore(user: User) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (docSnap.exists()) {
      const existing = docSnap.data();
      const userData: Record<string, any> = {
        uid: user.uid,
        email: user.email || existing.email || '',
        displayName: existing.displayName || user.displayName || '마이링크 사용자',
        photoURL: existing.photoURL || user.photoURL || '',
        lastLoginAt: now,
      };
      await setDoc(userRef, userData, { merge: true });
      return { ...existing, ...userData };
    } else {
      const userData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '마이링크 사용자',
        photoURL: user.photoURL || '',
        lastLoginAt: now,
        createdAt: now,
      };
      await setDoc(userRef, userData, { merge: true });
      return userData;
    }
  } catch (error) {
    console.error('Firestore users/{uid} 저장 실패:', error);
  }
}

/**
 * Firestore users/{uid} 경로에서 유저 정보 불러오기
 */
export async function getUserProfileFromFirestore(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Firestore users/{uid} 조회 실패:', error);
    return null;
  }
}

/**
 * displayName으로 Firestore users 컬렉션에서 유저 검색
 * @param displayName 검색할 사용자 닉네임 (URL 인코딩된 문자열 대응)
 */
export async function getUserByDisplayName(displayName: string) {
  const decoded = decodeURIComponent(displayName).trim();
  if (!decoded) return null;

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('displayName', '==', decoded), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        displayName: data.displayName || decoded,
        photoURL: data.photoURL || '',
        bio: data.bio || '',
        email: data.email || '',
        theme: data.theme || 'gradient',
        buttonStyle: data.buttonStyle || 'rounded',
        socials: data.socials || [],
        ...data,
      };
    }
  } catch (error) {
    console.error(`Firestore users 컬렉션 displayName(${decoded}) 검색 실패:`, error);
  }

  return null;
}

/**
 * Display Name(닉네임) 중복 검사 함수
 * Firestore users 컬렉션 및 시스템 예약 닉네임에서 동일한 displayName이 존재하는지 확인합니다.
 * @param displayName 확인할 닉네임
 * @param currentUid 현재 로그인한 사용자의 UID (자신의 기존 닉네임은 사용 가능 처리)
 */
export async function checkDisplayNameAvailability(
  displayName: string,
  currentUid?: string
): Promise<{ available: boolean; message: string }> {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return { available: false, message: '닉네임을 입력해 주세요.' };
  }

  if (trimmed.length < 2) {
    return { available: false, message: '닉네임은 2자 이상이어야 합니다.' };
  }

  if (trimmed.length > 20) {
    return { available: false, message: '닉네임은 20자 이하이어야 합니다.' };
  }

  const validRegex = /^[a-zA-Z0-9가-힣_\-\s()]+$/;
  if (!validRegex.test(trimmed)) {
    return {
      available: false,
      message: '한글, 영문, 숫자, 언더바(_), 하이픈(-), 괄호(), 공백만 사용할 수 있어요.',
    };
  }

  // 시연용 더미 페르소나 및 시스템 예약 닉네임 중복 방지 (오프라인/게스트 시연 지원)
  const reservedDummyNames = ['하나 (hana)', '민준 (minjun)', '유나 (yuna)'];
  if (reservedDummyNames.includes(trimmed.toLowerCase())) {
    return {
      available: false,
      message: '이미 다른 사용자가 사용 중인 닉네임입니다.',
    };
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('displayName', '==', trimmed));
    const snapshot = await getDocs(q);

    // 검색된 문서 중 현재 사용자가 아닌 다른 사용자가 있는지 검사
    const duplicateDoc = snapshot.docs.find((d) => d.id !== currentUid);
    if (duplicateDoc) {
      return {
        available: false,
        message: '이미 다른 사용자가 사용 중인 닉네임입니다.',
      };
    }

    return {
      available: true,
      message: '사용 가능한 멋진 닉네임이에요!',
    };
  } catch (error) {
    console.warn('Firestore Display Name 중복 검사 에러 (단일 쿼리 실패 등):', error);
    // 권한 오류나 기타 네트워크 지연 시 통과 처리하되 경고 로그
    return {
      available: true,
      message: '사용 가능한 닉네임입니다.',
    };
  }
}

/**
 * 프로필 정보(displayName, photoURL, bio)를 Firebase Auth 및 Firestore에 동시 업데이트
 */
export async function updateUserProfile(
  uid: string,
  updates: { displayName?: string; photoURL?: string; bio?: string }
) {
  try {
    const trimmedDisplayName = updates.displayName !== undefined ? updates.displayName.trim() : undefined;
    const trimmedPhotoURL = updates.photoURL !== undefined ? updates.photoURL.trim() : undefined;
    const trimmedBio = updates.bio !== undefined ? updates.bio.trim() : undefined;

    // 1. Firebase Auth currentUser 프로필 업데이트
    if (auth.currentUser && auth.currentUser.uid === uid) {
      const authUpdates: { displayName?: string | null; photoURL?: string | null } = {};
      if (trimmedDisplayName !== undefined) {
        authUpdates.displayName = trimmedDisplayName;
      }
      if (trimmedPhotoURL !== undefined) {
        authUpdates.photoURL = trimmedPhotoURL;
      }

      await updateProfile(auth.currentUser, authUpdates);
    }

    // 2. Firestore users/{uid} 문서 업데이트
    const userRef = doc(db, 'users', uid);
    const now = new Date().toISOString();
    const docUpdates: Record<string, any> = {
      updatedAt: now,
    };

    if (trimmedDisplayName !== undefined) docUpdates.displayName = trimmedDisplayName;
    if (trimmedPhotoURL !== undefined) docUpdates.photoURL = trimmedPhotoURL;
    if (trimmedBio !== undefined) docUpdates.bio = trimmedBio;

    await setDoc(userRef, docUpdates, { merge: true });
    return true;
  } catch (error) {
    console.error('Firestore users/{uid} 프로필 업데이트 실패:', error);
    throw error;
  }
}

/**
 * 대상 UID 가져오기 헬퍼 (명시적 userId 우선, 없으면 currentUser, 기본값 anonymous)
 */
function resolveUserId(userId?: string): string {
  if (userId && userId.trim()) return userId.trim();
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  return 'anonymous';
}

/**
 * 링크 추가 시 Firestore 경로(users/{userId}/links)에 저장하는 함수
 */
export async function addLinkToFirestore(link: LinkItem, userId?: string) {
  const uid = resolveUserId(userId);
  try {
    const linksCollectionRef = collection(db, 'users', uid, 'links');
    const docRef = doc(linksCollectionRef, link.id);

    const now = new Date().toISOString();
    const linkData: Record<string, any> = {
      id: link.id,
      title: link.title,
      url: link.url || '',
      isActive: link.isActive,
      isHeader: link.isHeader || false,
      clicks: link.clicks || 0,
      createdAt: link.createdAt || now,
      updatedAt: link.updatedAt || now,
    };

    if (link.icon) {
      linkData.icon = link.icon;
    }

    await setDoc(docRef, linkData);
    console.log(`Firestore (users/${uid}/links) 저장 성공:`, link.id);
    return link.id;
  } catch (error) {
    console.error(`Firestore (users/${uid}/links) 링크 저장 실패:`, error);
    throw error;
  }
}

/**
 * 링크 수정 시 Firestore 경로(users/{userId}/links)에 업데이트하는 함수
 */
export async function updateLinkInFirestore(id: string, updates: Partial<LinkItem>, userId?: string) {
  const uid = resolveUserId(userId);
  try {
    const docRef = doc(db, 'users', uid, 'links', id);
    const updateData: Record<string, any> = {
      ...updates,
      updatedAt: updates.updatedAt || new Date().toISOString(),
    };
    
    // undefined 속성 제거
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(docRef, updateData);
    console.log(`Firestore (users/${uid}/links) 업데이트 성공:`, id);
  } catch (error) {
    console.error(`Firestore (users/${uid}/links) 링크 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * 링크 삭제 시 Firestore 경로(users/{userId}/links)에서 제거하는 함수
 */
export async function deleteLinkFromFirestore(id: string, userId?: string) {
  const uid = resolveUserId(userId);
  try {
    const docRef = doc(db, 'users', uid, 'links', id);
    await deleteDoc(docRef);
    console.log(`Firestore (users/${uid}/links) 삭제 성공:`, id);
  } catch (error) {
    console.error(`Firestore (users/${uid}/links) 링크 삭제 실패:`, error);
    throw error;
  }
}

/**
 * Firestore(users/{userId}/links)에서 최신순(createdAt desc)으로 링크 목록 불러오기
 */
export async function getLinksFromFirestore(userId?: string): Promise<LinkItem[]> {
  const uid = resolveUserId(userId);
  try {
    const linksRef = collection(db, 'users', uid, 'links');
    let querySnapshot;
    try {
      const q = query(linksRef, orderBy('createdAt', 'desc'));
      querySnapshot = await getDocs(q);
    } catch {
      querySnapshot = await getDocs(linksRef);
    }

    const links: (LinkItem & { createdAt?: string })[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      links.push({
        id: data.id || docSnap.id,
        title: data.title || '',
        url: data.url || '',
        icon: data.icon,
        isActive: data.isActive ?? true,
        isHeader: data.isHeader ?? false,
        clicks: data.clicks ?? 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    links.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return links;
  } catch (error) {
    console.error(`Firestore (users/${uid}/links) 링크 목록 불러오기 실패:`, error);
    return [];
  }
}

/**
 * Firestore(users/{userId}/links) 실시간 구독 (최신순 createdAt desc)
 */
export function subscribeLinksFromFirestore(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: any) => void,
  userId?: string
): Unsubscribe {
  const uid = resolveUserId(userId);
  const linksRef = collection(db, 'users', uid, 'links');

  const processSnapshot = (querySnapshot: any) => {
    const links: (LinkItem & { createdAt?: string })[] = [];
    querySnapshot.forEach((docSnap: any) => {
      const data = docSnap.data();
      links.push({
        id: data.id || docSnap.id,
        title: data.title || '',
        url: data.url || '',
        icon: data.icon,
        isActive: data.isActive ?? true,
        isHeader: data.isHeader ?? false,
        clicks: data.clicks ?? 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    links.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    onUpdate(links);
  };

  const q = query(linksRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    processSnapshot,
    (err) => {
      console.warn(`orderBy index issue in users/${uid}/links, fallbacking to unindexed collection snapshot:`, err);
      if (onError) onError(err);
      return onSnapshot(linksRef, processSnapshot, onError);
    }
  );
}

export { app, auth, db, storage, analytics, onAuthStateChanged };
