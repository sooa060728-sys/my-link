'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Eye,
  Globe,
  Video,
  BookOpen,
  Mail,
  Code,
  Camera,
  Share2,
  Heading,
  CheckCircle2,
  XCircle,
  Pencil,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Palette,
  Users,
  RotateCcw,
  Layers,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Database,
  Lock,
  Sparkles,
  ShieldCheck,
  Copy,
  LogOut,
} from 'lucide-react';
import { getProfileData, saveProfileData } from '@/lib/profileStorage';
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeLinksFromFirestore,
  checkDisplayNameAvailability,
} from '@/lib/firebase';
import { DUMMY_PROFILES } from '@/lib/dummyData';
import { ProfileData, LinkItem as ProfileLinkItem, ThemeType, ButtonStyleType, SocialLinkItem } from '@/types';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  blockSchema,
  profileSchema,
  socialSchema,
  usernameSchema,
  BlockFormValues,
  ProfileFormValues,
  SocialFormValues,
  UsernameFormValues,
} from '@/lib/schemas';

const AVATAR_PRESETS = [
  { label: '개발자 봇', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev_hero' },
  { label: '크리에이터', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator_star' },
  { label: '디자이너', url: 'https://api.dicebear.com/7.x/personas/svg?seed=art_yuna' },
  { label: '캐주얼 픽셀', url: 'https://api.dicebear.com/7.x/micah/svg?seed=casual_sky' },
];

const ICON_OPTIONS = [
  { value: 'Globe', label: '웹사이트', icon: Globe },
  { value: 'Youtube', label: '유튜브', icon: Video },
  { value: 'Github', label: '깃허브', icon: Code },
  { value: 'Instagram', label: '인스타그램', icon: Camera },
  { value: 'Twitter', label: '트위터', icon: Share2 },
  { value: 'BookOpen', label: '블로그/글', icon: BookOpen },
  { value: 'Mail', label: '이메일', icon: Mail },
];

const THEME_OPTIONS: { value: ThemeType; label: string; bg: string; border: string; text: string }[] = [
  { value: 'light', label: 'Light (라이트)', bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-900' },
  { value: 'dark', label: 'Dark (다크)', bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-white' },
  { value: 'neon', label: 'Neon (네온)', bg: 'bg-emerald-950', border: 'border-emerald-500', text: 'text-emerald-400' },
  { value: 'pastel', label: 'Pastel (파스텔)', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-900' },
  { value: 'minimal', label: 'Minimal (미니멀)', bg: 'bg-stone-900', border: 'border-stone-700', text: 'text-stone-100' },
  { value: 'gradient', label: 'Gradient (그라디언트)', bg: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500', border: 'border-blue-400', text: 'text-white' },
];

const BUTTON_STYLE_OPTIONS: { value: ButtonStyleType; label: string; shape: string }[] = [
  { value: 'rounded', label: '라운드 (Round)', shape: 'rounded-full' },
  { value: 'corner', label: '모서리 (Square)', shape: 'rounded-2xl' },
  { value: 'outline', label: '아웃라인 (Outline)', shape: 'rounded-xl border-2' },
];

const SOCIAL_PLATFORM_OPTIONS = [
  { value: 'instagram', label: '인스타그램', icon: Camera },
  { value: 'youtube', label: '유튜브', icon: Video },
  { value: 'github', label: '깃허브', icon: Code },
  { value: 'twitter', label: '트위터', icon: Share2 },
  { value: 'email', label: '이메일', icon: Mail },
  { value: 'website', label: '웹사이트', icon: Globe },
];

function formatUpdatedAt(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    if (isToday) {
      return `오늘 ${hours}:${minutes}`;
    }
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}.${day} ${hours}:${minutes}`;
  } catch {
    return '';
  }
}

export default function MyPage() {
  const {
    user,
    firestoreUser,
    loading: authLoading,
    isLoggingIn,
    login,
    logout,
    updateUserProfileData,
  } = useAuth();

  const [username, setUsername] = useState('demo');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [copiedPath, setCopiedPath] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // 다이얼로그 열림/닫힘 상태
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isSocialsDialogOpen, setIsSocialsDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [isSwitcherDialogOpen, setIsSwitcherDialogOpen] = useState(false);

  // 프로필 수정 및 Display Name 중복 검사 상태
  const [displayNameCheckStatus, setDisplayNameCheckStatus] = useState<
    'idle' | 'checking' | 'available' | 'duplicate' | 'same_as_current' | 'invalid'
  >('idle');
  const [displayNameCheckMessage, setDisplayNameCheckMessage] = useState<string>('');
  const [lastCheckedDisplayName, setLastCheckedDisplayName] = useState<string>('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false);

  // 인라인 수정 대상 링크 ID
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // 삭제 확인 모달 대상 링크 및 삭제 진행 상태
  const [deletingLink, setDeletingLink] = useState<ProfileLinkItem | null>(null);
  const [isDeletingInFirestore, setIsDeletingInFirestore] = useState(false);

  // 로딩 & 동기화 상태 관리
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [isUpdatingBlock, setIsUpdatingBlock] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'idle'>('idle');

  // 1) React Hook Form + Zod: 블록 추가 폼
  const addBlockForm = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      blockType: 'link',
      title: '',
      url: '',
      icon: 'Globe',
      isActive: true,
    },
  });

  // 2) React Hook Form + Zod: 블록 수정 폼
  const editBlockForm = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      blockType: 'link',
      title: '',
      url: '',
      icon: 'Globe',
      isActive: true,
    },
  });

  // 3) React Hook Form + Zod: 프로필 설정 폼
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      avatarUrl: '',
      theme: 'light',
      buttonStyle: 'rounded',
    },
  });

  // 4) React Hook Form + Zod: 소셜 링크 추가 폼
  const socialForm = useForm<SocialFormValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      platform: 'instagram',
      url: '',
    },
  });

  // 5) React Hook Form + Zod: 페르소나/핸들 생성 폼
  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: '',
    },
  });

  // 로그인 상태 변경 시 username 및 기본 프로필 설정
  useEffect(() => {
    if (user) {
      // 로그인된 경우 user.uid 기반 또는 이메일 접두사 핸들 사용
      const defaultUsername = user.email ? user.email.split('@')[0] : user.uid.slice(0, 8);
      setUsername(defaultUsername);
    } else if (isGuestMode) {
      setUsername('demo');
    }
  }, [user, isGuestMode]);

  // Firestore 링크 실시간 연동 (users/{user.uid}/links) 또는 게스트 모드 로컬 로드
  useEffect(() => {
    // 인증 확인 중이면 진행하지 않음
    if (authLoading) return;

    if (!user) {
      if (isGuestMode) {
        const guestData = getProfileData(username);
        setProfile(guestData);
        setIsLoadingLinks(false);
        setSyncStatus('synced');
      } else {
        setIsLoadingLinks(false);
        setSyncStatus('idle');
      }
      return;
    }

    const currentUid = user.uid;
    setIsLoadingLinks(true);
    setSyncStatus('syncing');

    // 로컬 스토리지에 저장된 기본 프로필 정보 로드 (Firestore 유저 정보 우선 적용)
    const data = getProfileData(username);
    const initialProfile: ProfileData = {
      ...data,
      name: firestoreUser?.displayName || data.name || user.displayName || '구글 사용자',
      bio: firestoreUser?.bio !== undefined ? firestoreUser.bio : data.bio || '',
      avatarUrl: firestoreUser?.photoURL || data.avatarUrl || user.photoURL || '',
      username: username,
    };
    setProfile(initialProfile);

    // Firestore(users/{user.uid}/links)에서 최신순 정렬 링크 실시간 구독
    const unsubscribe = subscribeLinksFromFirestore(
      (firestoreLinks) => {
        setProfile((prev) => (prev ? { ...prev, links: firestoreLinks } : {
          ...initialProfile,
          links: firestoreLinks,
        }));
        setIsLoadingLinks(false);
        setSyncStatus('synced');
      },
      (error) => {
        console.error(`Firestore (users/${currentUid}/links) 구독 에러:`, error);
        setIsLoadingLinks(false);
        setSyncStatus('idle');
      },
      currentUid
    );

    return () => unsubscribe();
  }, [user, username, authLoading, isGuestMode, firestoreUser]);

  // Firestore 유저 프로필(displayName, photoURL, bio) 실시간 상태 동기화
  useEffect(() => {
    if (user && firestoreUser) {
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          name: firestoreUser.displayName || prev.name,
          bio: firestoreUser.bio !== undefined ? firestoreUser.bio : prev.bio,
          avatarUrl: firestoreUser.photoURL || prev.avatarUrl,
        };
      });
    }
  }, [user, firestoreUser]);

  // Firestore 컬렉션 경로 복사 함수
  const handleCopyFirestorePath = () => {
    if (!user) return;
    const path = `users/${user.uid}/links`;
    navigator.clipboard.writeText(path);
    setCopiedPath(true);
    toast.success('Firestore 경로가 복사되었어요!', { description: path });
    setTimeout(() => setCopiedPath(false), 2000);
  };

  // --- 1. 링크 추가 제출 (RHF + Zod + Firestore users/{user.uid}/links) ---
  const onAddBlockSubmit = async (data: BlockFormValues) => {
    if (!profile || isSubmittingBlock) return;
    setIsSubmittingBlock(true);
    setSyncStatus('syncing');

    let formattedUrl = data.url?.trim() || '';
    if (data.blockType === 'link' && formattedUrl) {
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
    }

    const now = new Date().toISOString();
    const newLink: ProfileLinkItem = {
      id: Date.now().toString(),
      title: data.title.trim(),
      url: data.blockType === 'link' ? formattedUrl : '',
      icon: data.blockType === 'link' ? data.icon : undefined,
      isActive: data.isActive ?? true,
      isHeader: data.blockType === 'header',
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (user) {
        // Firestore (users/{user.uid}/links) 저장
        await Promise.all([
          addLinkToFirestore(newLink, user.uid),
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]);
      }
      setSyncStatus('synced');

      const updatedProfile: ProfileData = {
        ...profile,
        links: [newLink, ...profile.links],
      };

      setProfile(updatedProfile);
      saveProfileData(username, updatedProfile);
      addBlockForm.reset({ blockType: 'link', title: '', url: '', icon: 'Globe', isActive: true });
      setIsAddDialogOpen(false);
      toast.success('새 블록이 성공적으로 추가되었어요!');
    } catch (e) {
      console.error('링크 저장 처리 에러:', e);
      setSyncStatus('idle');
      toast.error('블록 추가에 실패했습니다.');
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // --- 2. 링크 인라인 수정 시작/취소 & 제출 (RHF + Zod + Firestore users/{user.uid}/links) ---
  const handleStartInlineEdit = (link: ProfileLinkItem) => {
    setEditingLinkId(link.id);
    editBlockForm.reset({
      blockType: link.isHeader ? 'header' : 'link',
      title: link.title,
      url: link.url || '',
      icon: link.icon || 'Globe',
      isActive: link.isActive,
    });
  };

  const handleCancelInlineEdit = () => {
    setEditingLinkId(null);
    editBlockForm.reset();
  };

  const onEditBlockSubmit = async (data: BlockFormValues) => {
    if (!editingLinkId || !profile || isUpdatingBlock) return;
    setIsUpdatingBlock(true);
    setSyncStatus('syncing');

    let formattedUrl = data.url?.trim() || '';
    if (data.blockType === 'link' && formattedUrl) {
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
    }

    const now = new Date().toISOString();
    const updatedLinkData: Partial<ProfileLinkItem> = {
      title: data.title.trim(),
      url: data.blockType === 'link' ? formattedUrl : '',
      icon: data.blockType === 'link' ? data.icon : undefined,
      isActive: data.isActive ?? true,
      isHeader: data.blockType === 'header',
      updatedAt: now,
    };

    try {
      if (user) {
        // Firestore 업데이트 (users/{user.uid}/links/{editingLinkId})
        await Promise.all([
          updateLinkInFirestore(editingLinkId, updatedLinkData, user.uid),
          new Promise((resolve) => setTimeout(resolve, 350)),
        ]);
      }
      setSyncStatus('synced');
    } catch (e) {
      console.error('링크 업데이트 에러:', e);
      setSyncStatus('idle');
    } finally {
      setIsUpdatingBlock(false);
    }

    const updatedProfile: ProfileData = {
      ...profile,
      links: profile.links.map((link) =>
        link.id === editingLinkId
          ? {
              ...link,
              ...updatedLinkData,
            }
          : link
      ),
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    editBlockForm.reset();
    setEditingLinkId(null);
    toast.success('블록 정보가 수정되었어요!');
  };

  // --- 3. 링크 삭제 확인 모달 실행 (Firestore users/{user.uid}/links) ---
  const handleConfirmDelete = async () => {
    if (!deletingLink || !profile || isDeletingInFirestore) return;
    const targetId = deletingLink.id;
    setIsDeletingInFirestore(true);
    setSyncStatus('syncing');

    try {
      if (user) {
        // Firestore 삭제 (users/{user.uid}/links/{targetId})
        await deleteLinkFromFirestore(targetId, user.uid);
      }
      setSyncStatus('synced');
      toast.success('선택하신 블록이 삭제되었어요.');
    } catch (e) {
      console.error('링크 삭제 에러:', e);
      setSyncStatus('idle');
      toast.error('블록 삭제에 실패했습니다.');
    } finally {
      setIsDeletingInFirestore(false);
    }

    const updatedProfile: ProfileData = {
      ...profile,
      links: profile.links.filter((link) => link.id !== targetId),
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    setDeletingLink(null);
    if (editingLinkId === targetId) {
      setEditingLinkId(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    if (!profile) return;
    const targetLink = profile.links.find((l) => l.id === id);
    if (!targetLink) return;
    const newActiveState = !targetLink.isActive;
    const now = new Date().toISOString();

    if (user) {
      // Firestore 업데이트
      updateLinkInFirestore(id, { isActive: newActiveState, updatedAt: now }, user.uid).catch((e) =>
        console.error('Firestore 활성화 토글 에러:', e)
      );
    }

    const updatedProfile: ProfileData = {
      ...profile,
      links: profile.links.map((link) =>
        link.id === id ? { ...link, isActive: newActiveState, updatedAt: now } : link
      ),
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    toast.info(newActiveState ? '블록이 공개 상태로 전환되었어요.' : '블록이 비공개 처리되었어요.');
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    if (!profile) return;
    const newLinks = [...profile.links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const [movedItem] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, movedItem);

    const updatedProfile: ProfileData = {
      ...profile,
      links: newLinks,
    };
    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
  };

  // --- 4. 프로필 정보 & 테마 수정 (RHF + Zod + 중복 검사 + Firestore 연동) ---
  const handleOpenProfileDialog = () => {
    const currentName = firestoreUser?.displayName || profile?.name || user?.displayName || '';
    const currentBio = firestoreUser?.bio || profile?.bio || '';
    const currentAvatar = firestoreUser?.photoURL || profile?.avatarUrl || user?.photoURL || '';

    profileForm.reset({
      name: currentName,
      bio: currentBio,
      avatarUrl: currentAvatar,
      theme: profile?.theme || 'light',
      buttonStyle: profile?.buttonStyle || 'rounded',
    });

    setDisplayNameCheckStatus('same_as_current');
    setDisplayNameCheckMessage('현재 사용 중인 본인의 닉네임입니다.');
    setLastCheckedDisplayName(currentName.trim());
    setIsProfileDialogOpen(true);
  };

  const handleCheckDisplayName = async () => {
    const rawName = profileForm.getValues('name');
    const inputName = rawName?.trim() || '';

    if (!inputName) {
      setDisplayNameCheckStatus('invalid');
      setDisplayNameCheckMessage('닉네임(Display Name)을 입력해 주세요.');
      toast.error('닉네임을 입력해 주세요.');
      return;
    }

    if (inputName.length < 2) {
      setDisplayNameCheckStatus('invalid');
      setDisplayNameCheckMessage('닉네임은 2자 이상이어야 합니다.');
      toast.error('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    if (inputName.length > 20) {
      setDisplayNameCheckStatus('invalid');
      setDisplayNameCheckMessage('닉네임은 20자 이하이어야 합니다.');
      toast.error('닉네임은 20자 이하이어야 합니다.');
      return;
    }

    const validRegex = /^[a-zA-Z0-9가-힣_\-\s()]+$/;
    if (!validRegex.test(inputName)) {
      setDisplayNameCheckStatus('invalid');
      setDisplayNameCheckMessage('한글, 영문, 숫자, 언더바(_), 하이픈(-), 괄호(), 공백만 사용할 수 있어요.');
      toast.error('허용되지 않는 특수문자가 포함되어 있습니다.');
      return;
    }

    const currentMyName = (firestoreUser?.displayName || user?.displayName || profile?.name || '').trim();
    if (inputName === currentMyName) {
      setDisplayNameCheckStatus('same_as_current');
      setDisplayNameCheckMessage('현재 사용 중인 본인의 닉네임입니다.');
      setLastCheckedDisplayName(inputName);
      toast.info('현재 사용 중인 본인의 닉네임이에요.');
      return;
    }

    setDisplayNameCheckStatus('checking');
    setDisplayNameCheckMessage('중복 여부를 확인하는 중...');

    try {
      const result = await checkDisplayNameAvailability(inputName, user?.uid);
      setLastCheckedDisplayName(inputName);

      if (result.available) {
        setDisplayNameCheckStatus('available');
        setDisplayNameCheckMessage(result.message);
        toast.success(result.message);
      } else {
        setDisplayNameCheckStatus('duplicate');
        setDisplayNameCheckMessage(result.message);
        toast.error(result.message);
      }
    } catch (e) {
      console.error('중복 검사 오류:', e);
      setDisplayNameCheckStatus('idle');
      toast.error('중복 확인 중 네트워크 오류가 발생했습니다.');
    }
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!profile || isSubmittingProfile) return;

    const trimmedName = data.name.trim();
    const currentMyName = (firestoreUser?.displayName || user?.displayName || profile?.name || '').trim();

    // 닉네임이 이전과 달라졌는데 아직 중복 검사를 통과하지 않은 경우 자동 중복 검사 수행
    if (trimmedName !== currentMyName && (displayNameCheckStatus !== 'available' || lastCheckedDisplayName !== trimmedName)) {
      setDisplayNameCheckStatus('checking');
      setDisplayNameCheckMessage('중복 여부를 확인하는 중...');
      const checkRes = await checkDisplayNameAvailability(trimmedName, user?.uid);
      setLastCheckedDisplayName(trimmedName);

      if (!checkRes.available) {
        setDisplayNameCheckStatus('duplicate');
        setDisplayNameCheckMessage(checkRes.message);
        toast.error('이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.');
        return;
      }
      setDisplayNameCheckStatus('available');
    }

    setIsSubmittingProfile(true);

    try {
      const updatedBio = (data.bio || '').trim();
      const updatedAvatar = (data.avatarUrl || '').trim();

      // 1. Firebase Auth 및 Firestore 동시 업데이트
      if (user) {
        await updateUserProfileData({
          displayName: trimmedName,
          photoURL: updatedAvatar,
          bio: updatedBio,
        });
      }

      // 2. 로컬 스토리지 및 로컬 상태 동기화
      const updatedProfile: ProfileData = {
        ...profile,
        name: trimmedName,
        bio: updatedBio,
        avatarUrl: updatedAvatar,
        theme: data.theme,
        buttonStyle: data.buttonStyle,
      };

      setProfile(updatedProfile);
      saveProfileData(username, updatedProfile);
      setIsProfileDialogOpen(false);
      toast.success('프로필 정보가 성공적으로 변경되었어요!');
    } catch (e) {
      console.error('프로필 저장 에러:', e);
      toast.error('프로필 정보를 저장하지 못했습니다.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // --- 5. 소셜 링크 추가 제출 (RHF + Zod) ---
  const onAddSocialSubmit = (data: SocialFormValues) => {
    if (!profile) return;

    let formattedUrl = data.url.trim();
    if (data.platform === 'email') {
      if (!formattedUrl.startsWith('mailto:')) {
        formattedUrl = `mailto:${formattedUrl}`;
      }
    } else {
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
    }

    const newSocialItem: SocialLinkItem = {
      id: Date.now().toString(),
      platform: data.platform,
      url: formattedUrl,
    };

    const updatedProfile: ProfileData = {
      ...profile,
      socials: [...(profile.socials || []), newSocialItem],
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    socialForm.reset({ platform: 'instagram', url: '' });
  };

  const handleDeleteSocialLink = (id: string) => {
    if (!profile) return;
    const updatedProfile: ProfileData = {
      ...profile,
      socials: (profile.socials || []).filter((s) => s.id !== id),
    };
    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
  };

  // --- 6. 통계 리셋 ---
  const handleResetAnalytics = () => {
    if (!profile) return;
    const updatedProfile: ProfileData = {
      ...profile,
      pageViews: 0,
      links: profile.links.map((link) => ({ ...link, clicks: 0 })),
    };
    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
  };

  // --- 7. 페르소나 / 프로필 스위처 (RHF + Zod) ---
  const handleSwitchProfile = (targetUsername: string) => {
    setUsername(targetUsername);
    const data = getProfileData(targetUsername);
    setProfile(data);
    usernameForm.reset({ username: '' });
    setIsSwitcherDialogOpen(false);
  };

  const onCreateUsernameSubmit = (data: UsernameFormValues) => {
    const cleanUsername = data.username.toLowerCase().trim();
    handleSwitchProfile(cleanUsername);
  };

  const links = profile?.links || [];
  const socials = profile?.socials || [];
  const totalPageViews = profile?.pageViews || 0;
  const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased">
      {/* 1. 상단 공통 헤더 (구글 소셜 로그인 / 사용자 정보 연동) */}
      <Header />

      <main className="py-8 px-4 sm:px-6 pb-24">
        <div className="mx-auto max-w-lg space-y-5">

          {/* 인증 로딩 상태 */}
          {authLoading ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E5E8EB] shadow-xs text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#3182F6] mx-auto" />
              <p className="text-sm font-semibold text-[#6B7684]">
                로그인 및 사용자 정보를 확인하고 있어요...
              </p>
            </div>
          ) : !user && !isGuestMode ? (
            /* =========================================================================
             * 2. [미로그인 화면]: 로그인 이후에 사용할 수 있도록 설명 문구 & 로그인 안내 페이지
             * ========================================================================= */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* 메인 로그인 유도 히어로 카드 */}
              <div className="bg-white rounded-3xl p-7 border border-[#E5E8EB] shadow-xs space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center mx-auto shadow-xs">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F3FF] text-[#3182F6]">
                    <Sparkles className="w-3.5 h-3.5" />
                    로그인이 필요한 서비스예요
                  </span>
                  <h1 className="text-2xl font-extrabold text-[#191F28] tracking-tight">
                    나만의 개인화 링크를 시작해 보세요
                  </h1>
                  <p className="text-sm text-[#4E5968] leading-relaxed max-w-sm mx-auto">
                    마이링크는 Google 소셜 로그인 후 사용자의 고유 계정 경로인{' '}
                    <span className="font-mono font-bold text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.5 rounded">
                      users/{'{user.uid}'}/links
                    </span>
                    에 개인화된 링크 데이터를 안전하게 저장하고 관리해요.
                  </p>
                </div>

                {/* Google 소셜 로그인 & 게스트 체험 버튼 */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => login()}
                    disabled={isLoggingIn}
                    className="w-full h-14 bg-[#191F28] hover:bg-[#333D4B] active:scale-[0.98] text-white font-bold text-[16px] rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span>Google 로그인 진행 중...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Google 계정으로 3초 만에 시작하기</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3 py-0.5">
                    <div className="h-px bg-[#E5E8EB] flex-1" />
                    <span className="text-xs text-[#8B95A1] font-medium">또는</span>
                    <div className="h-px bg-[#E5E8EB] flex-1" />
                  </div>

                  {/* 게스트 데모 체험 버튼 */}
                  <button
                    type="button"
                    onClick={() => setIsGuestMode(true)}
                    className="w-full h-12 bg-[#F2F8FF] hover:bg-[#E8F3FF] active:scale-[0.98] border border-[#D5E5FB] text-[#185EF7] font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4 text-[#185EF7]" />
                    <span>로그인 없이 데모 모드로 프로필 수정 & 대시보드 체험하기</span>
                  </button>

                  <p className="text-[12px] text-[#8B95A1]">
                    Google 로그인 시 Firestore 클라우드와 영구 동기화되며, 데모 모드는 로컬(localStorage)에 보관돼요.
                  </p>
                </div>
              </div>

              {/* 기능 상세 안내 카드 3종 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#191F28] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#3182F6]" />
                  <span>로그인 후 이용할 수 있는 주요 기능</span>
                </h3>

                <div className="space-y-3">
                  {/* 기능 1 */}
                  <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#191F28]">
                        개인화된 Firestore 클라우드 저장
                      </h4>
                      <p className="text-xs text-[#6B7684] mt-0.5 leading-relaxed">
                        사용자별 고유 UID를 통해 <code className="text-[#3182F6] font-semibold">users/{'{uid}'}/links</code>에 링크가 안전하게 저장되고 기기 간 실시간 동기화돼요.
                      </p>
                    </div>
                  </div>

                  {/* 기능 2 */}
                  <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F0F0FF] text-[#5B5FC7] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#191F28]">
                        다양한 블록 CRUD 및 테마 커스텀
                      </h4>
                      <p className="text-xs text-[#6B7684] mt-0.5 leading-relaxed">
                        웹사이트 링크, 섹션 구분 헤더, 소셜 매체 아이콘을 다이얼로그 모달로 직관적으로 관리할 수 있어요.
                      </p>
                    </div>
                  </div>

                  {/* 기능 3 */}
                  <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E8F8EE] text-[#20874E] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#191F28]">
                        실시간 방문자 및 클릭수 애널리틱스
                      </h4>
                      <p className="text-xs text-[#6B7684] mt-0.5 leading-relaxed">
                        공개 프로필의 총 누적 PV 및 링크별 개별 클릭 수를 실시간 차트와 퍼센트 바로 확인할 수 있어요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 시연용 프로필 둘러보기 링크 */}
                <div className="pt-2 border-t border-[#F2F4F6] text-center">
                  <Link
                    href="/links"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3182F6] hover:underline py-1"
                  >
                    <span>로그인 전 시연용 샘플 프로필 둘러보기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
             * 3. [로그인 완료 화면]: users/{user.uid}/links 개인화된 링크 관리 대시보드
             * ========================================================================= */
            <div className="space-y-5 animate-in fade-in duration-300">

              {/* 3.0 게스트 데모 모드 안내 카드 (미로그인 상태) */}
              {!user && isGuestMode && (
                <div className="bg-[#EEF5FF] rounded-3xl p-5 border border-[#D5E5FB] shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D5E5FB]/60">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#185EF7]" />
                      <span className="text-xs font-bold text-[#191F28]">
                        게스트 데모 체험 모드
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#185EF7] bg-white px-2 py-0.5 rounded-full border border-[#D5E5FB]">
                      로컬 저장소 (localStorage) 연동
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-[#4E5968] leading-relaxed">
                      현재 브라우저에 실시간 저장되며, 프로필 수정·닉네임 중복 확인·블록 추가 기능을 모두 즉시 테스트할 수 있어요.
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => login()}
                        className="px-3 py-1.5 bg-[#185EF7] hover:bg-[#004FE2] active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Google 로그인 연동</span>
                      </button>
                      <button
                        onClick={() => setIsGuestMode(false)}
                        className="px-3 py-1.5 bg-white hover:bg-[#F2F4F6] text-[#6B7684] hover:text-[#191F28] font-bold text-xs rounded-xl border border-[#D5E5FB] transition-all cursor-pointer"
                      >
                        <span>체험 종료</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3.1 개인화된 Firestore 유저 정보 카드 (로그인된 경우 표시) */}
              {user && (
                <div className="bg-white rounded-3xl p-5 border border-[#E5E8EB] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F6]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#20874E] animate-pulse" />
                      <span className="text-xs font-bold text-[#191F28]">
                        개인화된 Firestore 계정 연결됨
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#8B95A1]">
                      Google 소셜 인증
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {firestoreUser?.photoURL || user.photoURL ? (
                        // eslint-disable-next-next/no-img-element
                        <img
                          src={firestoreUser?.photoURL || user.photoURL || ''}
                          alt={firestoreUser?.displayName || user.displayName || '프로필'}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#3182F6] shadow-xs flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#3182F6] text-white flex items-center justify-center font-bold text-xl shadow-xs flex-shrink-0">
                          {(firestoreUser?.displayName || user.displayName || 'U').charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-[#191F28] truncate">
                            {firestoreUser?.displayName || user.displayName || '구글 사용자'}
                          </h2>
                          <span className="text-[10px] bg-[#E8F3FF] text-[#3182F6] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            인증 완료
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7684] truncate">{user.email}</p>
                        <p className="text-[11px] text-[#8B95A1] font-mono mt-0.5 truncate">
                          UID: {user.uid}
                        </p>
                      </div>
                    </div>

                    {/* 프로필 수정 및 로그아웃 버튼 */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={handleOpenProfileDialog}
                        className="px-3 py-1.5 text-[#3182F6] hover:bg-[#E8F3FF] bg-[#F2F8FF] border border-[#D5E5FB] rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95"
                        title="프로필 수정"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>프로필 수정</span>
                      </button>

                      <button
                        onClick={() => logout()}
                        className="p-2 text-[#8B95A1] hover:text-[#F04452] hover:bg-[#FFF0F0] rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                        title="로그아웃"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">로그아웃</span>
                      </button>
                    </div>
                  </div>

                  {/* Firestore 컬렉션 경로 표시 배너 */}
                  <div className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E8EB] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#4E5968] flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#3182F6]" />
                        <span>개인화 저장 경로</span>
                      </span>
                      <span className="text-[10px] text-[#8B95A1]">실시간 동기화 (onSnapshot)</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#E5E8EB] gap-2">
                      <span className="font-mono text-xs text-[#3182F6] font-semibold truncate">
                        users/{user.uid}/links
                      </span>
                      <button
                        onClick={handleCopyFirestorePath}
                        className="text-xs text-[#4E5968] hover:text-[#3182F6] flex items-center gap-1 font-semibold flex-shrink-0 cursor-pointer"
                        title="경로 복사"
                      >
                        {copiedPath ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#20874E]" />
                            <span className="text-[#20874E] text-[11px]">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 통계 요약 칩 */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
                      <div className="text-[10px] text-[#8B95A1]">등록 링크</div>
                      <div className="text-sm font-bold text-[#3182F6] tabular-nums">
                        {links.length}개
                      </div>
                    </div>
                    <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
                      <div className="text-[10px] text-[#8B95A1]">누적 클릭수</div>
                      <div className="text-sm font-bold text-[#191F28] tabular-nums">
                        {totalClicks}회
                      </div>
                    </div>
                    <div className="p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
                      <div className="text-[10px] text-[#8B95A1]">총 방문수(PV)</div>
                      <div className="text-sm font-bold text-[#191F28] tabular-nums">
                        {totalPageViews}회
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3.2 대시보드 프로필 헤더 & 액션 버튼 */}
              <header className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E8EB] shadow-xs space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* 클릭 가능한 아바타 (호버 시 수정 아이콘 안내) */}
                    <button
                      type="button"
                      onClick={handleOpenProfileDialog}
                      className="relative group rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#185EF7] focus:ring-offset-2 flex-shrink-0"
                      title="프로필 정보 및 닉네임 수정"
                    >
                      {profile?.avatarUrl ? (
                        // eslint-disable-next-next/no-img-element
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#185EF7] group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#185EF7] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                          {(profile?.name || user?.displayName || 'M').charAt(0)}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-[#E5E8EB] text-[#185EF7] shadow-xs group-hover:scale-110 transition-transform">
                        <Pencil className="w-3 h-3" />
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#191F28] truncate">
                          {profile?.name || user?.displayName || '마이링크'}
                        </h1>
                        <span className="text-[11px] bg-[#EEF5FF] text-[#185EF7] font-semibold px-2 py-0.5 rounded-full border border-[#D5E5FB] flex-shrink-0">
                          @{profile?.username || username}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7684] truncate mt-0.5" title={profile?.bio || '개인 링크 인 바이오 서비스'}>
                        {profile?.bio || '개인 링크 인 바이오 서비스'}
                      </p>
                    </div>
                  </div>

                  {/* 헤더 주요 액션 버튼 (프로필 수정 + 공개 보기) - 글자 잘림 및 줄바꿈 방지 */}
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleOpenProfileDialog}
                      className="flex-1 sm:flex-none h-10 px-4 bg-[#185EF7] hover:bg-[#004FE2] active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
                      title="프로필 정보 및 표시 이름(Display Name) 수정"
                    >
                      <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="whitespace-nowrap">프로필 수정</span>
                    </button>

                    <Link
                      href={`/${profile?.username || username}`}
                      target="_blank"
                      className="flex-1 sm:flex-none h-10 px-3.5 bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-95 text-[#333D4B] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap flex-shrink-0"
                      title="새 탭에서 공개 프로필 보기"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#6B7684] flex-shrink-0" />
                      <span className="whitespace-nowrap">공개 보기</span>
                      <ExternalLink className="w-3 h-3 text-[#8B95A1] flex-shrink-0" />
                    </Link>
                  </div>
                </div>

                {/* 대시보드 컨트롤 바 (다이얼로그 버튼 모음) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E5E8EB]">
                  {/* 1. 프로필 & 테마 수정 다이얼로그 */}
                  <button
                    onClick={handleOpenProfileDialog}
                    className="p-2.5 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F0F0FF] hover:border-[#5B5FC7] text-[#191F28] hover:text-[#5B5FC7] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>프로필·테마</span>
                  </button>

                  {/* 2. 소셜 아이콘 관리 다이얼로그 */}
                  <button
                    onClick={() => {
                      socialForm.reset({ platform: 'instagram', url: '' });
                      setIsSocialsDialogOpen(true);
                    }}
                    className="p-2.5 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F0F0FF] hover:border-[#5B5FC7] text-[#191F28] hover:text-[#5B5FC7] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>소셜 링크({socials.length})</span>
                  </button>

                  {/* 3. 통계 분석 다이얼로그 */}
                  <button
                    onClick={() => setIsAnalyticsDialogOpen(true)}
                    className="p-2.5 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F0F0FF] hover:border-[#5B5FC7] text-[#191F28] hover:text-[#5B5FC7] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#3182F6]" />
                    <span>통계 ({totalClicks}클릭)</span>
                  </button>

                  {/* 4. 프로필/페르소나 스위처 다이얼로그 */}
                  <button
                    onClick={() => {
                      usernameForm.reset({ username: '' });
                      setIsSwitcherDialogOpen(true);
                    }}
                    className="p-2.5 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F0F0FF] hover:border-[#5B5FC7] text-[#191F28] hover:text-[#5B5FC7] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>프로필 전환</span>
                  </button>
                </div>
              </header>

              {/* 3.3 링크 & 헤더 블록 섹션 (Firestore users/{user.uid}/links) */}
              <section className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#191F28] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#5B5FC7]" />
                        <span>링크 & 헤더 블록</span>
                      </h2>
                      {/* 실시간 동기화 상태 뱃지 */}
                      {syncStatus === 'syncing' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F3FF] text-[#3182F6] animate-pulse">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          <span>동기화 중...</span>
                        </span>
                      )}
                      {syncStatus === 'synced' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F8EE] text-[#00A854]">
                          <Check className="w-2.5 h-2.5" />
                          <span>Firestore 동기화됨</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B95A1] mt-0.5">
                      {user ? (
                        <>
                          Firestore <code className="font-mono text-[#3182F6]">users/{user.uid.slice(0, 6)}.../links</code>에 안전하게 보관돼요.
                        </>
                      ) : (
                        <>
                          로컬 브라우저 <code className="font-mono text-[#3182F6]">localStorage</code>에 안전하게 보관돼요.
                        </>
                      )}
                    </p>
                  </div>

                  {/* 다이얼로그 트리거: 링크 추가 */}
                  <button
                    onClick={() => {
                      addBlockForm.reset({ blockType: 'link', title: '', url: '', icon: 'Globe', isActive: true });
                      setIsAddDialogOpen(true);
                    }}
                    className="h-10 px-4 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>블록 추가</span>
                  </button>
                </div>

                {/* 블록 목록 / 로딩 스켈레톤 */}
                {isLoadingLinks ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#8B95A1]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5B5FC7]" />
                      <span>Firestore에서 개인화된 링크 목록을 불러오는 중...</span>
                    </div>
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="bg-[#F9FAFB] rounded-2xl p-3.5 border border-[#E5E8EB] flex items-center justify-between gap-3 animate-pulse"
                      >
                        <div className="w-6 h-12 bg-[#E5E8EB] rounded-lg" />
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-[#E5E8EB]" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-4 bg-[#E5E8EB] rounded w-2/5" />
                            <div className="h-3 bg-[#E5E8EB] rounded w-3/5" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-7 h-7 bg-[#E5E8EB] rounded-lg" />
                          <div className="w-7 h-7 bg-[#E5E8EB] rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : links.length === 0 ? (
                  <div className="bg-[#F9FAFB] rounded-2xl p-8 text-center text-[#8B95A1] text-sm border border-dashed border-[#E5E8EB] space-y-2">
                    <div className="text-2xl">✨</div>
                    <p className="font-semibold text-[#191F28]">등록된 링크 블록이 없어요</p>
                    <p className="text-xs text-[#8B95A1]">
                      위의 &apos;블록 추가&apos; 버튼을 눌러 나만의 첫 링크를 등록해 보세요!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {links.map((link, idx) => (
                      <React.Fragment key={link.id}>
                        {editingLinkId === link.id ? (
                          /* 인라인 편집 UI (동일한 Zod 검증 및 Firebase 연동) */
                          <form
                            onSubmit={editBlockForm.handleSubmit(onEditBlockSubmit)}
                            className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#5B5FC7] shadow-md space-y-4 transition-all animate-in fade-in duration-200"
                          >
                            {/* 상단 인라인 편집 헤더 배너 */}
                            <div className="flex items-center justify-between pb-2 border-b border-[#F2F4F6]">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B5FC7]">
                                <Pencil className="w-3.5 h-3.5" />
                                <span>블록 인라인 편집</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-[#8B95A1]">
                                {link.updatedAt && (
                                  <span className="flex items-center gap-1" title={`수정 일시: ${new Date(link.updatedAt).toLocaleString('ko-KR')}`}>
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>수정: {formatUpdatedAt(link.updatedAt)}</span>
                                  </span>
                                )}
                                <span className="font-mono">ID: {link.id}</span>
                              </div>
                            </div>

                            {/* 블록 타입 (웹사이트 링크 vs 섹션 헤더) */}
                            <div className="flex rounded-xl bg-[#F2F4F6] p-1 gap-1">
                              <button
                                type="button"
                                onClick={() => editBlockForm.setValue('blockType', 'link')}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  editBlockForm.watch('blockType') === 'link'
                                    ? 'bg-white text-[#5B5FC7] shadow-xs'
                                    : 'text-[#6B7684] hover:text-[#191F28]'
                                }`}
                              >
                                <LinkIcon className="w-3.5 h-3.5" />
                                <span>웹사이트 링크</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => editBlockForm.setValue('blockType', 'header')}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  editBlockForm.watch('blockType') === 'header'
                                    ? 'bg-white text-[#5B5FC7] shadow-xs'
                                    : 'text-[#6B7684] hover:text-[#191F28]'
                                }`}
                              >
                                <Heading className="w-3.5 h-3.5" />
                                <span>섹션 헤더</span>
                              </button>
                            </div>

                            {/* 제목 입력 필드 */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <label htmlFor={`edit-inline-title-${link.id}`} className="text-xs font-bold text-[#333D4B]">
                                  제목 <span className="text-[#5B5FC7]">*</span>
                                </label>
                                <span className="text-[10px] text-[#8B95A1]">
                                  {editBlockForm.watch('title')?.length || 0}/50자
                                </span>
                              </div>
                              <input
                                id={`edit-inline-title-${link.id}`}
                                type="text"
                                placeholder={editBlockForm.watch('blockType') === 'link' ? '예: 유튜브 채널 바로가기' : '예: 📌 주요 소셜 매체'}
                                {...editBlockForm.register('title')}
                                className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                                  editBlockForm.formState.errors.title
                                    ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                                    : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                                }`}
                              />
                              {editBlockForm.formState.errors.title && (
                                <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>{editBlockForm.formState.errors.title.message}</span>
                                </div>
                              )}
                            </div>

                            {/* URL 필드 (링크 블록일 때만 노출) */}
                            {editBlockForm.watch('blockType') === 'link' && (
                              <div className="flex flex-col gap-1.5">
                                <label htmlFor={`edit-inline-url-${link.id}`} className="text-xs font-bold text-[#333D4B]">
                                  웹사이트 URL 주소 <span className="text-[#5B5FC7]">*</span>
                                </label>
                                <input
                                  id={`edit-inline-url-${link.id}`}
                                  type="text"
                                  placeholder="예: https://youtube.com/@mychannel"
                                  {...editBlockForm.register('url')}
                                  className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                                    editBlockForm.formState.errors.url
                                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                                  }`}
                                />
                                {editBlockForm.formState.errors.url && (
                                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{editBlockForm.formState.errors.url.message}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 아이콘 선택 (링크 블록일 때만 노출) */}
                            {editBlockForm.watch('blockType') === 'link' && (
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#333D4B]">아이콘 선택</label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                                  {ICON_OPTIONS.map((opt) => {
                                    const IconComp = opt.icon;
                                    const isSelected = editBlockForm.watch('icon') === opt.value;
                                    return (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => editBlockForm.setValue('icon', opt.value)}
                                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs gap-1 cursor-pointer ${
                                          isSelected
                                            ? 'border-[#5B5FC7] bg-[#F0F0FF] text-[#5B5FC7] font-bold'
                                            : 'border-[#E5E8EB] bg-[#F9FAFB] text-[#6B7684] hover:bg-[#F2F4F6]'
                                        }`}
                                      >
                                        <IconComp className="w-4 h-4" />
                                        <span className="text-[10px] truncate max-w-full">{opt.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 공개 상태 토글 */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E8EB]">
                              <div>
                                <div className="text-xs font-bold text-[#191F28]">공개 상태로 설정</div>
                                <div className="text-[11px] text-[#8B95A1]">체크 해제 시 공개 프로필에서 숨겨집니다</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={editBlockForm.watch('isActive')}
                                onChange={(e) => editBlockForm.setValue('isActive', e.target.checked)}
                                className="w-4 h-4 accent-[#5B5FC7] cursor-pointer"
                              />
                            </div>

                            {/* 하단 인라인 액션 버튼 */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2F4F6]">
                              <button
                                type="button"
                                onClick={handleCancelInlineEdit}
                                disabled={isUpdatingBlock}
                                className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer disabled:opacity-50"
                              >
                                취소
                              </button>
                              <button
                                type="submit"
                                disabled={isUpdatingBlock}
                                className="h-9 px-5 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                {isUpdatingBlock ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>저장 중...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>저장하기</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* 일반 카드 뷰: 상시 표시되는 수정/삭제 버튼 제공 */
                          <div
                            className={`bg-white rounded-2xl p-3.5 sm:p-4 border flex items-center justify-between gap-3 shadow-xs transition-all ${
                              link.isActive ? 'border-[#E5E8EB] hover:border-[#B0B8C1]' : 'border-[#E5E8EB] opacity-60 bg-[#F9FAFB]'
                            }`}
                          >
                            {/* 순서 이동 버튼 (Up / Down) */}
                            <div className="flex flex-col gap-0.5 flex-shrink-0">
                              <button
                                onClick={() => handleMoveLink(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-[#8B95A1] hover:text-[#5B5FC7] disabled:opacity-20 transition-colors cursor-pointer"
                                title="위로 이동"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveLink(idx, 'down')}
                                disabled={idx === links.length - 1}
                                className="p-1 text-[#8B95A1] hover:text-[#5B5FC7] disabled:opacity-20 transition-colors cursor-pointer"
                                title="아래로 이동"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* 블록 정보 */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  link.isHeader
                                    ? 'bg-[#E8F3FF] text-[#3182F6]'
                                    : 'bg-[#F0F0FF] text-[#5B5FC7]'
                                }`}
                              >
                                {link.isHeader ? <Heading className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-[14px] text-[#191F28] truncate">
                                    {link.title}
                                  </h4>
                                  {link.isHeader && (
                                    <span className="text-[10px] font-semibold bg-[#E8F3FF] text-[#3182F6] px-1.5 py-0.5 rounded flex-shrink-0">
                                      헤더
                                    </span>
                                  )}
                                  {!link.isActive && (
                                    <span className="text-[10px] font-semibold bg-[#F2F4F6] text-[#8B95A1] px-1.5 py-0.5 rounded flex-shrink-0">
                                      비활성
                                    </span>
                                  )}
                                </div>
                                {link.url ? (
                                  <div className="flex items-center gap-2 text-xs text-[#8B95A1] truncate flex-wrap">
                                    <span className="truncate max-w-[200px]">{link.url}</span>
                                    {link.clicks !== undefined && (
                                      <span className="text-[10px] text-[#3182F6] font-semibold bg-[#E8F3FF] px-1.5 py-0.2 rounded-full flex-shrink-0">
                                        {link.clicks}클릭
                                      </span>
                                    )}
                                    {link.updatedAt && (
                                      <span
                                        className="inline-flex items-center gap-1 text-[10px] text-[#8B95A1] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md flex-shrink-0 font-medium"
                                        title={`수정 일시: ${new Date(link.updatedAt).toLocaleString('ko-KR')}`}
                                      >
                                        <Clock className="w-2.5 h-2.5 text-[#8B95A1]" />
                                        <span>수정 {formatUpdatedAt(link.updatedAt)}</span>
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-xs text-[#8B95A1] flex-wrap">
                                    <span>섹션 구분 헤더</span>
                                    {link.updatedAt && (
                                      <span
                                        className="inline-flex items-center gap-1 text-[10px] text-[#8B95A1] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md flex-shrink-0 font-medium"
                                        title={`수정 일시: ${new Date(link.updatedAt).toLocaleString('ko-KR')}`}
                                      >
                                        <Clock className="w-2.5 h-2.5 text-[#8B95A1]" />
                                        <span>수정 {formatUpdatedAt(link.updatedAt)}</span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 블록 액션 버튼들 (수정, 활성화 토글, 삭제) */}
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {/* 1. 인라인 수정 버튼 */}
                              <button
                                type="button"
                                onClick={() => handleStartInlineEdit(link)}
                                className="h-8 px-2.5 rounded-lg border border-[#DCDCFB] bg-[#F0F0FF] hover:bg-[#E2E2FF] text-[#5B5FC7] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="인라인 수정"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>수정</span>
                              </button>

                              {/* 2. 활성화 토글 버튼 */}
                              <button
                                type="button"
                                onClick={() => handleToggleActive(link.id)}
                                className={`h-8 px-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                  link.isActive
                                    ? 'border-[#C8E6C9] bg-[#E8F7EE] text-[#20874E] hover:bg-[#D7F0E0]'
                                    : 'border-[#E5E8EB] bg-[#F2F4F6] text-[#8B95A1] hover:bg-[#E5E8EB]'
                                }`}
                                title={link.isActive ? '비활성화하기' : '활성화하기'}
                              >
                                {link.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              </button>

                              {/* 3. 삭제 버튼 */}
                              <button
                                type="button"
                                onClick={() => setDeletingLink(link)}
                                className="h-8 px-2.5 rounded-lg border border-[#FFD0DE] bg-[#FFF0F5] hover:bg-[#FFE0EB] text-[#E90064] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="링크 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>삭제</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* --- 1. 새 링크/헤더 블록 추가 다이얼로그 (React Hook Form + Zod) --- */}
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { if (!isSubmittingBlock) setIsAddDialogOpen(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 링크/헤더 블록 추가</DialogTitle>
              <DialogDescription>
                개인화된 Firestore(users/{user?.uid ? user.uid.slice(0, 6) + '...' : 'uid'}/links)에 저장돼요.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={addBlockForm.handleSubmit(onAddBlockSubmit)} className="flex flex-col gap-4">
              {/* 블록 타입 선택 */}
              <div className="flex rounded-xl bg-[#F2F4F6] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => addBlockForm.setValue('blockType', 'link')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    addBlockForm.watch('blockType') === 'link'
                      ? 'bg-white text-[#5B5FC7] shadow-xs'
                      : 'text-[#6B7684] hover:text-[#191F28]'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>웹사이트 링크</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlockForm.setValue('blockType', 'header')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    addBlockForm.watch('blockType') === 'header'
                      ? 'bg-white text-[#5B5FC7] shadow-xs'
                      : 'text-[#6B7684] hover:text-[#191F28]'
                  }`}
                >
                  <Heading className="w-3.5 h-3.5" />
                  <span>섹션 헤더</span>
                </button>
              </div>

              {/* 제목 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="add-title" className="text-xs font-bold text-[#333D4B]">
                    제목 <span className="text-[#5B5FC7]">*</span>
                  </label>
                  <span className="text-[10px] text-[#8B95A1]">
                    {addBlockForm.watch('title')?.length || 0}/50자
                  </span>
                </div>
                <input
                  id="add-title"
                  type="text"
                  placeholder={addBlockForm.watch('blockType') === 'link' ? '예: 유튜브 채널 바로가기' : '예: 📌 주요 소셜 매체'}
                  {...addBlockForm.register('title')}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                    addBlockForm.formState.errors.title
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                  }`}
                />
                {addBlockForm.formState.errors.title && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{addBlockForm.formState.errors.title.message}</span>
                  </div>
                )}
              </div>

              {/* URL (링크 타입일 때만) */}
              {addBlockForm.watch('blockType') === 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="add-url" className="text-xs font-bold text-[#333D4B]">
                    웹사이트 URL 주소 <span className="text-[#5B5FC7]">*</span>
                  </label>
                  <input
                    id="add-url"
                    type="text"
                    placeholder="예: https://youtube.com/@mychannel"
                    {...addBlockForm.register('url')}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                      addBlockForm.formState.errors.url
                        ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                        : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                    }`}
                  />
                  {addBlockForm.formState.errors.url && (
                    <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{addBlockForm.formState.errors.url.message}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 아이콘 선택 (링크 타입일 때만) */}
              {addBlockForm.watch('blockType') === 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333D4B]">아이콘 선택</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const IconComp = opt.icon;
                      const isSelected = addBlockForm.watch('icon') === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => addBlockForm.setValue('icon', opt.value)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs gap-1 cursor-pointer ${
                            isSelected
                              ? 'border-[#5B5FC7] bg-[#F0F0FF] text-[#5B5FC7] font-bold'
                              : 'border-[#E5E8EB] bg-[#F9FAFB] text-[#6B7684] hover:bg-[#F2F4F6]'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span className="text-[10px] truncate max-w-full">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 활성화 여부 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E8EB]">
                <div>
                  <div className="text-xs font-bold text-[#191F28]">공개 상태로 설정</div>
                  <div className="text-[11px] text-[#8B95A1]">체크 해제 시 공개 프로필에서 숨겨집니다</div>
                </div>
                <input
                  type="checkbox"
                  checked={addBlockForm.watch('isActive')}
                  onChange={(e) => addBlockForm.setValue('isActive', e.target.checked)}
                  className="w-4 h-4 accent-[#5B5FC7] cursor-pointer"
                />
              </div>

              <DialogFooter>
                <DialogClose
                  disabled={isSubmittingBlock}
                  className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </DialogClose>
                <button
                  type="submit"
                  disabled={isSubmittingBlock}
                  className="h-9 px-5 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isSubmittingBlock ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>저장 중...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>블록 추가하기</span>
                    </>
                  )}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- 2. 프로필 & 테마 설정 다이얼로그 (React Hook Form + Zod + 중복 확인) --- */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#185EF7]" />
                <span>프로필 정보 수정</span>
              </DialogTitle>
              <DialogDescription>
                표시 이름(Display Name) 중복 확인과 아바타, 소개글 및 테마를 설정하세요.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-4">
              {/* 1. 프로필 아바타 미리보기 및 추천 프리셋 */}
              <div className="p-3.5 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB] flex flex-col items-center gap-3">
                <div className="relative group">
                  {profileForm.watch('avatarUrl') ? (
                    // eslint-disable-next-next/no-img-element
                    <img
                      src={profileForm.watch('avatarUrl')}
                      alt="아바타 미리보기"
                      className="w-20 h-20 rounded-full object-cover border-3 border-[#185EF7] shadow-sm bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#185EF7] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                      {(profileForm.watch('name') || user?.displayName || 'M').charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-[#E5E8EB] text-[#185EF7] shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="w-full space-y-2 text-center">
                  <div className="text-[11px] font-bold text-[#6B7684]">
                    추천 아바타 캐릭터 선택
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => profileForm.setValue('avatarUrl', preset.url)}
                        className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          profileForm.watch('avatarUrl') === preset.url
                            ? 'border-[#185EF7] bg-[#EEF5FF] ring-2 ring-[#185EF7]/20'
                            : 'border-[#E5E8EB] bg-white hover:bg-[#F2F4F6]'
                        }`}
                      >
                        {/* eslint-disable-next-next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-[10px] font-semibold text-[#4E5968] truncate max-w-full">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {user?.photoURL && profileForm.watch('avatarUrl') !== user.photoURL && (
                    <button
                      type="button"
                      onClick={() => profileForm.setValue('avatarUrl', user.photoURL || '')}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#185EF7] hover:underline pt-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Google 계정 원래 사진으로 복원</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2. 닉네임 (Display Name) + 실시간 중복 확인 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="profile-name" className="text-xs font-bold text-[#333D4B]">
                    닉네임 / 표시 이름 (Display Name) <span className="text-[#185EF7]">*</span>
                  </label>
                  <span className="text-[10px] text-[#8B95A1]">
                    {profileForm.watch('name')?.length || 0}/20자
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="profile-name"
                    type="text"
                    placeholder="예: 마이링크 크리에이터"
                    {...profileForm.register('name', {
                      onChange: (e) => {
                        const val = e.target.value.trim();
                        const currentMyName = (firestoreUser?.displayName || profile?.name || user?.displayName || '').trim();
                        if (val === currentMyName && val !== '') {
                          setDisplayNameCheckStatus('same_as_current');
                          setDisplayNameCheckMessage('현재 사용 중인 본인의 닉네임입니다.');
                        } else if (val !== lastCheckedDisplayName) {
                          setDisplayNameCheckStatus('idle');
                          setDisplayNameCheckMessage('');
                        }
                      },
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCheckDisplayName();
                      }
                    }}
                    className={`flex-1 px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                      profileForm.formState.errors.name || displayNameCheckStatus === 'duplicate' || displayNameCheckStatus === 'invalid'
                        ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                        : displayNameCheckStatus === 'available' || displayNameCheckStatus === 'same_as_current'
                        ? 'border-[#20874E] focus:ring-1 focus:ring-[#20874E]'
                        : 'border-[#E5E8EB] focus:border-[#185EF7] focus:ring-1 focus:ring-[#185EF7]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleCheckDisplayName}
                    disabled={displayNameCheckStatus === 'checking'}
                    className="h-9.5 px-3.5 rounded-xl bg-[#185EF7] hover:bg-[#004FE2] active:scale-95 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-xs transition-all"
                  >
                    {displayNameCheckStatus === 'checking' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>확인 중</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>중복 확인</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 중복 확인 피드백 상태 배너 */}
                <div className="mt-0.5">
                  {displayNameCheckStatus === 'available' && (
                    <div className="p-2 rounded-xl bg-[#E8F8EE] border border-[#BCE8CB] flex items-center gap-1.5 text-xs text-[#20874E] font-medium animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{displayNameCheckMessage || '사용 가능한 멋진 닉네임이에요!'}</span>
                    </div>
                  )}

                  {displayNameCheckStatus === 'same_as_current' && (
                    <div className="p-2 rounded-xl bg-[#EEF5FF] border border-[#D5E5FB] flex items-center gap-1.5 text-xs text-[#185EF7] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{displayNameCheckMessage || '현재 사용 중인 본인의 닉네임입니다.'}</span>
                    </div>
                  )}

                  {displayNameCheckStatus === 'duplicate' && (
                    <div className="p-2 rounded-xl bg-[#FFF0F0] border border-[#FFD0D0] flex items-center gap-1.5 text-xs text-[#E90064] font-medium animate-in fade-in">
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{displayNameCheckMessage || '이미 다른 사용자가 사용 중인 닉네임입니다.'}</span>
                    </div>
                  )}

                  {displayNameCheckStatus === 'invalid' && (
                    <div className="p-2 rounded-xl bg-[#FFF0F0] border border-[#FFD0D0] flex items-center gap-1.5 text-xs text-[#E90064] font-medium animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{displayNameCheckMessage}</span>
                    </div>
                  )}

                  {displayNameCheckStatus === 'idle' && (
                    <p className="text-[11px] text-[#8B95A1] flex items-center gap-1">
                      <span>영문, 한글, 숫자 2~20자 (닉네임 변경 후 우측 중복 확인을 눌러주세요)</span>
                    </p>
                  )}

                  {profileForm.formState.errors.name && (
                    <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{profileForm.formState.errors.name.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. 한줄 소개 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="profile-bio" className="text-xs font-bold text-[#333D4B]">
                    한줄 소개 (Bio)
                  </label>
                  <span className="text-[10px] text-[#8B95A1]">
                    {profileForm.watch('bio')?.length || 0}/150자
                  </span>
                </div>
                <textarea
                  id="profile-bio"
                  rows={2}
                  placeholder="예: 디자인과 개발을 사랑하는 프론트엔드 엔지니어예요."
                  {...profileForm.register('bio')}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                    profileForm.formState.errors.bio
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#185EF7] focus:ring-1 focus:ring-[#185EF7]'
                  }`}
                />
                {profileForm.formState.errors.bio && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{profileForm.formState.errors.bio.message}</span>
                  </div>
                )}
              </div>

              {/* 4. 아바타 이미지 직접 URL 입력 */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="profile-avatar" className="text-xs font-bold text-[#333D4B]">
                  프로필 아바타 직접 URL 입력
                </label>
                <input
                  id="profile-avatar"
                  type="text"
                  placeholder="예: https://images.unsplash.com/..."
                  {...profileForm.register('avatarUrl')}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                    profileForm.formState.errors.avatarUrl
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#185EF7] focus:ring-1 focus:ring-[#185EF7]'
                  }`}
                />
                {profileForm.formState.errors.avatarUrl && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{profileForm.formState.errors.avatarUrl.message}</span>
                  </div>
                )}
              </div>

              {/* 5. 테마 프리셋 6종 선택 */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-bold text-[#333D4B]">테마 프리셋 (6종)</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_OPTIONS.map((themeOpt) => {
                    const isSelected = profileForm.watch('theme') === themeOpt.value;
                    return (
                      <button
                        key={themeOpt.value}
                        type="button"
                        onClick={() => profileForm.setValue('theme', themeOpt.value)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#185EF7] ring-2 ring-[#185EF7]/20 bg-[#EEF5FF]'
                            : 'border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F2F4F6]'
                        }`}
                      >
                        <span className="text-xs font-bold text-[#191F28]">{themeOpt.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full ${themeOpt.bg} border ${themeOpt.border} shadow-2xs`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. 버튼 스타일 3종 선택 */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-bold text-[#333D4B]">버튼 스타일 (3종)</label>
                <div className="grid grid-cols-3 gap-2">
                  {BUTTON_STYLE_OPTIONS.map((btnOpt) => {
                    const isSelected = profileForm.watch('buttonStyle') === btnOpt.value;
                    return (
                      <button
                        key={btnOpt.value}
                        type="button"
                        onClick={() => profileForm.setValue('buttonStyle', btnOpt.value)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border-[#185EF7] ring-2 ring-[#185EF7]/20 bg-[#EEF5FF] text-[#185EF7] font-bold'
                            : 'border-[#E5E8EB] bg-[#F9FAFB] text-[#6B7684] hover:bg-[#F2F4F6]'
                        }`}
                      >
                        <div className={`w-12 h-3.5 bg-[#185EF7]/30 border border-[#185EF7] ${btnOpt.shape}`} />
                        <span className="text-[11px] font-semibold">{btnOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <DialogClose
                  disabled={isSubmittingProfile}
                  className="h-9.5 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer disabled:opacity-50"
                >
                  취소
                </DialogClose>
                <button
                  type="submit"
                  disabled={isSubmittingProfile || displayNameCheckStatus === 'checking'}
                  className="h-9.5 px-5 bg-[#185EF7] hover:bg-[#004FE2] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>저장 중...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>프로필 저장</span>
                    </>
                  )}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- 3. 소셜 링크 관리 다이얼로그 (React Hook Form + Zod) --- */}
        <Dialog open={isSocialsDialogOpen} onOpenChange={setIsSocialsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>소셜 아카이브 링크 관리</DialogTitle>
              <DialogDescription>
                인스타그램, 유튜브, 깃허브 등 소셜 링크를 추가하고 삭제할 수 있어요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 소셜 링크 추가 폼 */}
              <form onSubmit={socialForm.handleSubmit(onAddSocialSubmit)} className="space-y-3 p-3.5 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB]">
                <div className="text-xs font-bold text-[#191F28]">새 소셜 링크 추가</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#6B7684]">플랫폼</label>
                    <select
                      {...socialForm.register('platform')}
                      className="px-2.5 py-1.5 rounded-xl border border-[#E5E8EB] bg-white text-xs text-[#191F28] focus:outline-none focus:border-[#5B5FC7]"
                    >
                      {SOCIAL_PLATFORM_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#6B7684]">URL 주소</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      {...socialForm.register('url')}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs placeholder-[#8B95A1] focus:outline-none ${
                        socialForm.formState.errors.url
                          ? 'border-[#E90064]'
                          : 'border-[#E5E8EB] focus:border-[#5B5FC7]'
                      }`}
                    />
                  </div>
                </div>

                {socialForm.formState.errors.url && (
                  <div className="text-[11px] text-[#E90064] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{socialForm.formState.errors.url.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-8 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>소셜 링크 추가</span>
                </button>
              </form>

              {/* 현재 등록된 소셜 링크 목록 */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <div className="text-xs font-bold text-[#191F28] px-1">등록된 소셜 링크 ({socials.length})</div>
                {socials.length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#8B95A1] bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E8EB]">
                    등록된 소셜 링크가 없습니다.
                  </div>
                ) : (
                  socials.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E5E8EB] text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-bold text-[#5B5FC7] uppercase text-[10px] bg-[#F0F0FF] px-2 py-0.5 rounded-md">
                          {s.platform}
                        </span>
                        <span className="text-[#4E5968] truncate max-w-[200px]">{s.url}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSocialLink(s.id)}
                        className="text-[#E90064] hover:bg-[#FFF0F5] p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="소셜 링크 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                닫기
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- 4. 통계 & 애널리틱스 다이얼로그 --- */}
        <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>대시보드 통계 & 애널리틱스</DialogTitle>
              <DialogDescription>
                방문자 수(PV) 및 개별 링크 클릭 통계를 확인하고 성과를 분석해 보세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 상단 통계 카드 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#F0F0FF] border border-[#DCDCFB] text-center">
                  <div className="text-xs text-[#5B5FC7] font-semibold">총 프로필 방문 (PV)</div>
                  <div className="text-2xl font-black text-[#5B5FC7] mt-1 tabular-nums">
                    {totalPageViews}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#E8F3FF] border border-[#CDE3FF] text-center">
                  <div className="text-xs text-[#3182F6] font-semibold">총 링크 클릭 수</div>
                  <div className="text-2xl font-black text-[#3182F6] mt-1 tabular-nums">
                    {totalClicks}
                  </div>
                </div>
              </div>

              {/* 개별 링크 클릭 통계 리스트 */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                <div className="text-xs font-bold text-[#191F28] px-1">링크별 클릭 통계</div>
                {links.filter((l) => !l.isHeader).length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#8B95A1] bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E8EB]">
                    등록된 웹사이트 링크가 없습니다.
                  </div>
                ) : (
                  links
                    .filter((l) => !l.isHeader)
                    .map((link) => {
                      const clicks = link.clicks || 0;
                      const percentage = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
                      return (
                        <div
                          key={link.id}
                          className="p-2.5 rounded-xl bg-white border border-[#E5E8EB] space-y-1.5"
                        >
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-[#191F28] truncate max-w-[220px]">
                              {link.title}
                            </span>
                            <span className="font-semibold text-[#3182F6] tabular-nums">
                              {clicks}회 ({percentage}%)
                            </span>
                          </div>
                          {/* 프로그레스 바 */}
                          <div className="w-full h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#3182F6] rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-between items-center sm:justify-between pt-2">
              <button
                type="button"
                onClick={handleResetAnalytics}
                className="text-xs font-semibold text-[#8B95A1] hover:text-[#E90064] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>통계 초기화</span>
              </button>
              <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                닫기
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- 5. 프로필 / 페르소나 스위처 다이얼로그 (React Hook Form + Zod) --- */}
        <Dialog open={isSwitcherDialogOpen} onOpenChange={setIsSwitcherDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>프로필 / 페르소나 전환</DialogTitle>
              <DialogDescription>
                더미 페르소나를 선택하거나 새로운 URL 핸들을 생성하여 프로필을 즉시 전환해 보세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 신규 핸들 생성 폼 */}
              <form onSubmit={usernameForm.handleSubmit(onCreateUsernameSubmit)} className="space-y-2.5 p-3.5 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB]">
                <div className="text-xs font-bold text-[#191F28]">새 URL 핸들 생성</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="영문 소문자, 숫자, 밑줄 (예: my_brand)"
                      {...usernameForm.register('username')}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs placeholder-[#8B95A1] focus:outline-none ${
                        usernameForm.formState.errors.username
                          ? 'border-[#E90064]'
                          : 'border-[#E5E8EB] focus:border-[#5B5FC7]'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-8 px-3.5 bg-[#5B5FC7] hover:bg-[#4B4FA7] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex-shrink-0"
                  >
                    전환
                  </button>
                </div>
                {usernameForm.formState.errors.username && (
                  <div className="text-[11px] text-[#E90064] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{usernameForm.formState.errors.username.message}</span>
                  </div>
                )}
              </form>

              {/* 페르소나 목록 */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#191F28] px-1">기본 시연 페르소나 선택</div>
                <div className="grid grid-cols-1 gap-2">
                  {/* 기본 demo */}
                  <button
                    type="button"
                    onClick={() => handleSwitchProfile('demo')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      username === 'demo'
                        ? 'border-[#5B5FC7] bg-[#F0F0FF] text-[#5B5FC7] font-bold ring-1 ring-[#5B5FC7]'
                        : 'border-[#E5E8EB] bg-white hover:bg-[#F9FAFB] text-[#191F28]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">기본 시연 프로필 (@demo)</div>
                      <div className="text-[11px] text-[#8B95A1]">이수아의 프로필</div>
                    </div>
                    {username === 'demo' && <Check className="w-4 h-4 text-[#5B5FC7]" />}
                  </button>

                  {/* 더미 3종 */}
                  {DUMMY_PROFILES.map((p) => {
                    const isSelected = username === p.username;
                    return (
                      <button
                        key={p.username}
                        type="button"
                        onClick={() => handleSwitchProfile(p.username)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#5B5FC7] bg-[#F0F0FF] text-[#5B5FC7] font-bold ring-1 ring-[#5B5FC7]'
                            : 'border-[#E5E8EB] bg-white hover:bg-[#F9FAFB] text-[#191F28]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{p.name} (@{p.username})</div>
                          <div className="text-[11px] text-[#8B95A1]">{p.bio}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#5B5FC7]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                닫기
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- 6. 링크 삭제 확인 다이얼로그 (Firestore users/{user.uid}/links) --- */}
        <Dialog open={!!deletingLink} onOpenChange={(open) => { if (!open && !isDeletingInFirestore) setDeletingLink(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-[#E90064] flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-[#E90064]" />
                <span>블록을 삭제하시겠어요?</span>
              </DialogTitle>
              <DialogDescription className="pt-1.5">
                선택하신 &apos;<span className="font-bold text-[#191F28]">{deletingLink?.title}</span>&apos; 블록이 Firestore에서 영구적으로 삭제돼요.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-3 flex gap-2">
              <DialogClose
                disabled={isDeletingInFirestore}
                className="flex-1 h-9 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer disabled:opacity-50"
              >
                취소
              </DialogClose>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingInFirestore}
                className="flex-1 h-9 bg-[#E90064] hover:bg-[#D00057] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeletingInFirestore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <span>삭제하기</span>
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
