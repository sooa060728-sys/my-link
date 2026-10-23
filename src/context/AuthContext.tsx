'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutFirebase,
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
  updateUserProfile,
} from '@/lib/firebase';

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  firestoreUser: FirestoreUserProfile | null;
  loading: boolean;
  isLoggingIn: boolean;
  login: () => Promise<User | null>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserProfileData: (updates: { displayName?: string; photoURL?: string; bio?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firestoreUser: null,
  loading: true,
  isLoggingIn: false,
  login: async () => null,
  logout: async () => {},
  refreshUserProfile: async () => {},
  updateUserProfileData: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const fetchFirestoreProfile = async (uid: string) => {
    try {
      const data = await getUserProfileFromFirestore(uid);
      if (data) {
        setFirestoreUser(data as FirestoreUserProfile);
      }
    } catch (e) {
      console.error('Firestore 유저 정보 불러오기 에러:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await saveUserProfileToFirestore(currentUser);
        await fetchFirestoreProfile(currentUser.uid);
      } else {
        setFirestoreUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (): Promise<User | null> => {
    setIsLoggingIn(true);
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
      if (loggedUser) {
        await fetchFirestoreProfile(loggedUser.uid);
      }
      return loggedUser;
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutFirebase();
      setUser(null);
      setFirestoreUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (user?.uid) {
      await fetchFirestoreProfile(user.uid);
    }
  };

  const updateUserProfileData = async (updates: { displayName?: string; photoURL?: string; bio?: string }) => {
    if (!user) return;
    await updateUserProfile(user.uid, updates);
    if (auth.currentUser) {
      // User 객체 얕은 복사로 강제 리렌더링 유발
      setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
    }
    await fetchFirestoreProfile(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firestoreUser,
        loading,
        isLoggingIn,
        login,
        logout,
        refreshUserProfile,
        updateUserProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
