import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

import { collection, doc, setDoc } from 'firebase/firestore';
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
 * 링크 추가 시 Firestore 경로(users/anonymous/links)에 저장하는 함수
 */
export async function addLinkToFirestore(link: LinkItem) {
  try {
    const linksCollectionRef = collection(db, 'users', 'anonymous', 'links');
    const docRef = doc(linksCollectionRef, link.id);

    const linkData: Record<string, any> = {
      id: link.id,
      title: link.title,
      url: link.url || '',
      isActive: link.isActive,
      isHeader: link.isHeader || false,
      clicks: link.clicks || 0,
      createdAt: new Date().toISOString(),
    };

    if (link.icon) {
      linkData.icon = link.icon;
    }

    await setDoc(docRef, linkData);
    console.log('Firestore (users/anonymous/links) 저장 성공:', link.id);
    return link.id;
  } catch (error) {
    console.error('Firestore 링크 저장 실패:', error);
    throw error;
  }
}

export { app, auth, db, storage, analytics };

