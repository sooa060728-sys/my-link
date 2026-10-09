'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  Palette,
  Users,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
} from 'lucide-react';
import { getProfileData, saveProfileData } from '@/lib/profileStorage';
import { DUMMY_PROFILES } from '@/lib/dummyData';
import { ProfileData, LinkItem as ProfileLinkItem, ThemeType, ButtonStyleType, SocialLinkItem } from '@/types';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

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

// --- 유효성 검사 헬퍼 함수 ---
const isValidHttpUrl = (str: string): boolean => {
  const trimmed = str.trim();
  if (!trimmed) return false;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return false;
  
  let targetUrl = trimmed;
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }
  
  try {
    const urlObj = new URL(targetUrl);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidEmail = (email: string): boolean => {
  const cleanEmail = email.replace(/^mailto:/i, '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
};

const isValidUsername = (handle: string): boolean => {
  return /^[a-z0-9_]{3,20}$/i.test(handle.trim());
};

export default function MyPage() {
  const [username, setUsername] = useState('demo');
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // 다이얼로그 제어 상태
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isSocialsDialogOpen, setIsSocialsDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [isSwitcherDialogOpen, setIsSwitcherDialogOpen] = useState(false);

  // 링크 추가/수정 폼 상태
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [blockType, setBlockType] = useState<'link' | 'header'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Globe');
  const [isActive, setIsActive] = useState(true);

  // 프로필 설정 폼 상태
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [profileTheme, setProfileTheme] = useState<ThemeType>('light');
  const [profileButtonStyle, setProfileButtonStyle] = useState<ButtonStyleType>('rounded');

  // 소셜 링크 폼 상태
  const [newSocialPlatform, setNewSocialPlatform] = useState<string>('instagram');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // 스위처 폼 상태
  const [newUsernameInput, setNewUsernameInput] = useState('');

  // 폼 검증 에러 상태
  const [addFormError, setAddFormError] = useState<{ title?: string; url?: string } | null>(null);
  const [editFormError, setEditFormError] = useState<{ title?: string; url?: string } | null>(null);
  const [profileFormError, setProfileFormError] = useState<{ name?: string; bio?: string; avatarUrl?: string } | null>(null);
  const [socialFormError, setSocialFormError] = useState<string | null>(null);
  const [switcherFormError, setSwitcherFormError] = useState<string | null>(null);

  // 로컬스토리지에서 프로필 불러오기
  useEffect(() => {
    const data = getProfileData(username);
    setProfile(data);
  }, [username]);

  // 링크 추가/수정 폼 초기화
  const resetLinkForm = () => {
    setEditingLinkId(null);
    setBlockType('link');
    setTitle('');
    setUrl('');
    setIcon('Globe');
    setIsActive(true);
    setAddFormError(null);
    setEditFormError(null);
  };

  // --- 1. 링크 추가 핸들러 ---
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError(null);
    if (!profile) return;

    const cleanTitle = title.trim();
    let cleanUrl = url.trim();

    const errors: { title?: string; url?: string } = {};

    if (!cleanTitle) {
      errors.title = '제목을 입력해 주세요.';
    } else if (cleanTitle.length > 50) {
      errors.title = '제목은 50자 이하로 입력해 주세요.';
    }

    if (blockType === 'link') {
      if (!cleanUrl) {
        errors.url = 'URL 주소를 입력해 주세요.';
      } else if (!isValidHttpUrl(cleanUrl)) {
        errors.url = '올바른 웹사이트 URL 주소를 입력해 주세요. (예: https://example.com)';
      } else {
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = `https://${cleanUrl}`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setAddFormError(errors);
      return;
    }

    const newLink: ProfileLinkItem = {
      id: Date.now().toString(),
      title: cleanTitle,
      url: blockType === 'link' ? cleanUrl : '',
      icon: blockType === 'link' ? icon : undefined,
      isActive,
      isHeader: blockType === 'header',
      clicks: 0,
    };

    const updatedProfile: ProfileData = {
      ...profile,
      links: [newLink, ...profile.links],
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    resetLinkForm();
    setIsAddDialogOpen(false);
  };

  // --- 2. 링크 수정 열기 & 제출 핸들러 ---
  const handleOpenEditDialog = (link: ProfileLinkItem) => {
    setEditingLinkId(link.id);
    setBlockType(link.isHeader ? 'header' : 'link');
    setTitle(link.title);
    setUrl(link.url || '');
    setIcon(link.icon || 'Globe');
    setIsActive(link.isActive);
    setEditFormError(null);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError(null);
    if (!editingLinkId || !profile) return;

    const cleanTitle = title.trim();
    let cleanUrl = url.trim();

    const errors: { title?: string; url?: string } = {};

    if (!cleanTitle) {
      errors.title = '제목을 입력해 주세요.';
    } else if (cleanTitle.length > 50) {
      errors.title = '제목은 50자 이하로 입력해 주세요.';
    }

    if (blockType === 'link') {
      if (!cleanUrl) {
        errors.url = 'URL 주소를 입력해 주세요.';
      } else if (!isValidHttpUrl(cleanUrl)) {
        errors.url = '올바른 웹사이트 URL 주소를 입력해 주세요. (예: https://example.com)';
      } else {
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = `https://${cleanUrl}`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setEditFormError(errors);
      return;
    }

    const updatedProfile: ProfileData = {
      ...profile,
      links: profile.links.map((link) =>
        link.id === editingLinkId
          ? {
              ...link,
              title: cleanTitle,
              url: blockType === 'link' ? cleanUrl : '',
              icon: blockType === 'link' ? icon : undefined,
              isActive,
              isHeader: blockType === 'header',
            }
          : link
      ),
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    resetLinkForm();
    setIsEditDialogOpen(false);
  };

  // --- 3. 링크 삭제 & 토글 & 순서 이동 ---
  const handleDelete = (id: string) => {
    if (!profile) return;
    const updatedProfile: ProfileData = {
      ...profile,
      links: profile.links.filter((link) => link.id !== id),
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
  };

  const handleToggleActive = (id: string) => {
    if (!profile) return;
    const updatedProfile: ProfileData = {
      ...profile,
      links: profile.links.map((link) =>
        link.id === id ? { ...link, isActive: !link.isActive } : link
      ),
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
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

  // --- 4. 프로필 정보 & 테마 수정 열기 & 제출 ---
  const handleOpenProfileDialog = () => {
    if (!profile) return;
    setProfileName(profile.name || '');
    setProfileBio(profile.bio || '');
    setProfileAvatarUrl(profile.avatarUrl || '');
    setProfileTheme(profile.theme || 'light');
    setProfileButtonStyle(profile.buttonStyle || 'rounded');
    setProfileFormError(null);
    setIsProfileDialogOpen(true);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFormError(null);
    if (!profile) return;

    const cleanName = profileName.trim();
    const cleanBio = profileBio.trim();
    const cleanAvatar = profileAvatarUrl.trim();

    const errors: { name?: string; bio?: string; avatarUrl?: string } = {};

    if (!cleanName) {
      errors.name = '프로필 이름을 입력해 주세요.';
    } else if (cleanName.length > 30) {
      errors.name = '프로필 이름은 30자 이하로 입력해 주세요.';
    }

    if (cleanBio.length > 150) {
      errors.bio = '한줄 소개는 150자 이하로 작성해 주세요.';
    }

    if (cleanAvatar && !isValidHttpUrl(cleanAvatar)) {
      errors.avatarUrl = '올바른 이미지 URL 주소를 입력해 주세요. (http:// 또는 https://)';
    }

    if (Object.keys(errors).length > 0) {
      setProfileFormError(errors);
      return;
    }

    const updatedProfile: ProfileData = {
      ...profile,
      name: cleanName,
      bio: cleanBio,
      avatarUrl: cleanAvatar,
      theme: profileTheme,
      buttonStyle: profileButtonStyle,
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    setIsProfileDialogOpen(false);
  };

  // --- 5. 소셜 링크 관리 다이얼로그 핸들러 ---
  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    setSocialFormError(null);
    if (!profile) return;

    const rawUrl = newSocialUrl.trim();
    if (!rawUrl) {
      setSocialFormError('소셜 URL 주소 또는 이메일을 입력해 주세요.');
      return;
    }

    let formattedUrl = rawUrl;
    if (newSocialPlatform === 'email') {
      if (!isValidEmail(rawUrl)) {
        setSocialFormError('올바른 이메일 형식을 입력해 주세요. (예: contact@example.com)');
        return;
      }
      if (!formattedUrl.startsWith('mailto:')) {
        formattedUrl = `mailto:${formattedUrl}`;
      }
    } else {
      if (!isValidHttpUrl(rawUrl)) {
        setSocialFormError('올바른 소셜 웹사이트 URL 주소를 입력해 주세요. (예: https://instagram.com/myaccount)');
        return;
      }
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
    }

    const newSocialItem: SocialLinkItem = {
      id: Date.now().toString(),
      platform: newSocialPlatform as SocialLinkItem['platform'],
      url: formattedUrl,
    };

    const updatedProfile: ProfileData = {
      ...profile,
      socials: [...(profile.socials || []), newSocialItem],
    };

    setProfile(updatedProfile);
    saveProfileData(username, updatedProfile);
    setNewSocialUrl('');
    setSocialFormError(null);
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

  // --- 7. 페르소나/프로필 스위처 ---
  const handleSwitchProfile = (targetUsername: string) => {
    setUsername(targetUsername);
    const data = getProfileData(targetUsername);
    setProfile(data);
    setSwitcherFormError(null);
    setIsSwitcherDialogOpen(false);
  };

  const handleCreateCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSwitcherFormError(null);

    const cleanUsername = newUsernameInput.trim().toLowerCase();
    if (!cleanUsername) {
      setSwitcherFormError('생성할 커스텀 핸들을 입력해 주세요.');
      return;
    }

    if (!isValidUsername(cleanUsername)) {
      setSwitcherFormError('핸들은 3~20자의 영문 소문자, 숫자, 언더바(_)만 사용 가능합니다.');
      return;
    }

    handleSwitchProfile(cleanUsername);
    setNewUsernameInput('');
  };

  const links = profile?.links || [];
  const socials = profile?.socials || [];
  const totalPageViews = profile?.pageViews || 0;
  const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans antialiased py-8 px-4 sm:px-6 pb-20">
      <div className="mx-auto max-w-lg space-y-5">

        {/* 상단: 대시보드 헤더 & 액션 버튼 */}
        <header className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {profile?.avatarUrl ? (
                // eslint-disable-next-next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#5B5FC7]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#5B5FC7] text-white flex items-center justify-center font-bold text-xl">
                  {profile?.name ? profile.name.charAt(0) : 'M'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-xl font-bold tracking-tight text-[#191F28]">
                    {profile?.name || '마이링크'}
                  </h1>
                  <span className="text-xs bg-[#F0F0FF] text-[#5B5FC7] font-semibold px-2 py-0.5 rounded-full border border-[#DCDCFB]">
                    @{profile?.username || username}
                  </span>
                </div>
                <p className="text-xs text-[#6B7684] line-clamp-1 mt-0.5">
                  {profile?.bio || '개인 링크 인 바이오 서비스'}
                </p>
              </div>
            </div>

            {/* 공개 미리보기 버튼 */}
            <Link
              href={`/${profile?.username || username}`}
              target="_blank"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#5B5FC7] hover:bg-[#4B4FA7] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>공개 보기 (/{profile?.username || username})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
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
                setSocialFormError(null);
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
                setSwitcherFormError(null);
                setIsSwitcherDialogOpen(true);
              }}
              className="p-2.5 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F0F0FF] hover:border-[#5B5FC7] text-[#191F28] hover:text-[#5B5FC7] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>프로필 전환</span>
            </button>
          </div>
        </header>

        {/* 링크 & 헤더 블록 섹션 */}
        <section className="bg-white rounded-3xl p-6 border border-[#E5E8EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#191F28] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5B5FC7]" />
                <span>링크 & 헤더 블록</span>
              </h2>
              <p className="text-xs text-[#8B95A1]">버튼을 눌러 다이얼로그 폼으로 새 블록을 추가하세요.</p>
            </div>

            {/* 다이얼로그 트리거: 링크 추가 */}
            <button
              onClick={() => {
                resetLinkForm();
                setIsAddDialogOpen(true);
              }}
              className="h-10 px-4 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>블록 추가</span>
            </button>
          </div>

          {/* 블록 목록 */}
          {links.length === 0 ? (
            <div className="bg-[#F9FAFB] rounded-2xl p-8 text-center text-[#8B95A1] text-sm border border-dashed border-[#E5E8EB]">
              등록된 블록이 없습니다. 위의 &apos;블록 추가&apos; 버튼을 눌러 새 블록을 만들어 보세요!
            </div>
          ) : (
            <div className="space-y-2.5">
              {links.map((link, idx) => (
                <div
                  key={link.id}
                  className={`bg-white rounded-2xl p-3.5 border flex items-center justify-between gap-3 shadow-xs transition-all ${
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
                        <div className="flex items-center gap-2 text-xs text-[#8B95A1] truncate">
                          <span className="truncate">{link.url}</span>
                          {link.clicks !== undefined && (
                            <span className="text-[10px] text-[#3182F6] font-semibold bg-[#E8F3FF] px-1.5 py-0.2 rounded-full flex-shrink-0">
                              {link.clicks}클릭
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#8B95A1]">섹션 구분 헤더</span>
                      )}
                    </div>
                  </div>

                  {/* 블록 액션 (수정, 활성화 토글, 삭제) */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* 수정 다이얼로그 버튼 */}
                    <button
                      onClick={() => handleOpenEditDialog(link)}
                      className="p-1.5 text-[#6B7684] hover:text-[#5B5FC7] hover:bg-[#F0F0FF] rounded-lg transition-colors cursor-pointer"
                      title="블록 수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* 활성화 토글 */}
                    <button
                      onClick={() => handleToggleActive(link.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        link.isActive
                          ? 'text-[#20874E] hover:bg-[#E8F7EE]'
                          : 'text-[#8B95A1] hover:bg-[#F2F4F6]'
                      }`}
                      title={link.isActive ? '비활성화' : '활성화'}
                    >
                      {link.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>

                    {/* 삭제 */}
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1.5 text-[#8B95A1] hover:text-[#E90064] hover:bg-[#FFF0F0] rounded-lg transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- 1. 새 링크/헤더 블록 추가 다이얼로그 --- */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 링크/헤더 블록 추가</DialogTitle>
              <DialogDescription>
                프로필에 새로 노출할 웹사이트 링크 또는 구분선 헤더 블록을 등록해 보세요.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              {/* 블록 타입 선택 */}
              <div className="flex rounded-xl bg-[#F2F4F6] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setBlockType('link');
                    setAddFormError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockType === 'link'
                      ? 'bg-white text-[#5B5FC7] shadow-xs'
                      : 'text-[#6B7684] hover:text-[#191F28]'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>웹사이트 링크</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBlockType('header');
                    setAddFormError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockType === 'header'
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
                  <span className="text-[10px] text-[#8B95A1]">{title.length}/50자</span>
                </div>
                <input
                  id="add-title"
                  type="text"
                  placeholder={blockType === 'link' ? '예: 유튜브 채널 바로가기' : '예: 📌 주요 소셜 매체'}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (addFormError?.title) setAddFormError({ ...addFormError, title: undefined });
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                    addFormError?.title
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                  }`}
                />
                {addFormError?.title && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{addFormError.title}</span>
                  </div>
                )}
              </div>

              {/* URL (링크 타입일 때만) */}
              {blockType === 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="add-url" className="text-xs font-bold text-[#333D4B]">
                    웹사이트 URL 주소 <span className="text-[#5B5FC7]">*</span>
                  </label>
                  <input
                    id="add-url"
                    type="text"
                    placeholder="예: https://youtube.com/@mychannel"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (addFormError?.url) setAddFormError({ ...addFormError, url: undefined });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                      addFormError?.url
                        ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                        : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                    }`}
                  />
                  {addFormError?.url && (
                    <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{addFormError.url}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 아이콘 선택 (링크 타입일 때만) */}
              {blockType === 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333D4B]">아이콘 선택</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const IconComp = opt.icon;
                      const isSelected = icon === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setIcon(opt.value)}
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
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#5B5FC7] cursor-pointer"
                />
              </div>

              <DialogFooter>
                <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                  취소
                </DialogClose>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>추가하기</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- 2. 블록 정보 수정 다이얼로그 --- */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>블록 정보 수정</DialogTitle>
              <DialogDescription>
                선택한 링크 또는 헤더 블록의 정보를 수정하세요.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              {/* 블록 타입 */}
              <div className="flex rounded-xl bg-[#F2F4F6] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setBlockType('link');
                    setEditFormError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockType === 'link'
                      ? 'bg-white text-[#5B5FC7] shadow-xs'
                      : 'text-[#6B7684] hover:text-[#191F28]'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>웹사이트 링크</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBlockType('header');
                    setEditFormError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    blockType === 'header'
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
                  <label htmlFor="edit-title" className="text-xs font-bold text-[#333D4B]">
                    제목 <span className="text-[#5B5FC7]">*</span>
                  </label>
                  <span className="text-[10px] text-[#8B95A1]">{title.length}/50자</span>
                </div>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (editFormError?.title) setEditFormError({ ...editFormError, title: undefined });
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                    editFormError?.title
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                  }`}
                />
                {editFormError?.title && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{editFormError.title}</span>
                  </div>
                )}
              </div>

              {/* URL */}
              {blockType === 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-url" className="text-xs font-bold text-[#333D4B]">
                    URL 주소 <span className="text-[#5B5FC7]">*</span>
                  </label>
                  <input
                    id="edit-url"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (editFormError?.url) setEditFormError({ ...editFormError, url: undefined });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm placeholder-[#8B95A1] focus:outline-none transition-all ${
                      editFormError?.url
                        ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                        : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                    }`}
                  />
                  {editFormError?.url && (
                    <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{editFormError.url}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 아이콘 */}
              {blockType === 'link' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#333D4B]">아이콘 지정</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const IconComp = opt.icon;
                      const isSelected = icon === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setIcon(opt.value)}
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

              {/* 활성화 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E8EB]">
                <div>
                  <div className="text-xs font-bold text-[#191F28]">공개 상태로 설정</div>
                  <div className="text-[11px] text-[#8B95A1]">비활성화 시 숨겨집니다</div>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#5B5FC7] cursor-pointer"
                />
              </div>

              <DialogFooter>
                <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                  취소
                </DialogClose>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>저장하기</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- 3. 프로필 & 테마 설정 다이얼로그 --- */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>프로필 정보 & 테마 스타일 설정</DialogTitle>
              <DialogDescription>
                PRD DASH-02 & THEME-01~03 요구사항에 따른 프로필 정보와 프리셋 테마를 커스텀해 보세요.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* 이름 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="p-name" className="text-xs font-bold text-[#333D4B]">
                    프로필 이름/닉네임 <span className="text-[#5B5FC7]">*</span>
                  </label>
                  <span className="text-[10px] text-[#8B95A1]">{profileName.length}/30자</span>
                </div>
                <input
                  id="p-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => {
                    setProfileName(e.target.value);
                    if (profileFormError?.name) setProfileFormError({ ...profileFormError, name: undefined });
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none transition-all ${
                    profileFormError?.name
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                  }`}
                />
                {profileFormError?.name && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{profileFormError.name}</span>
                  </div>
                )}
              </div>

              {/* 한줄 소개 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="p-bio" className="text-xs font-bold text-[#333D4B]">
                    한줄 소개 (Bio)
                  </label>
                  <span className="text-[10px] text-[#8B95A1]">{profileBio.length}/150자</span>
                </div>
                <textarea
                  id="p-bio"
                  rows={2}
                  value={profileBio}
                  onChange={(e) => {
                    setProfileBio(e.target.value);
                    if (profileFormError?.bio) setProfileFormError({ ...profileFormError, bio: undefined });
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none transition-all ${
                    profileFormError?.bio
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                  }`}
                />
                {profileFormError?.bio && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{profileFormError.bio}</span>
                  </div>
                )}
              </div>

              {/* 아바타 이미지 URL */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="p-avatar" className="text-xs font-bold text-[#333D4B]">
                  프로필 아바타 이미지 URL
                </label>
                <input
                  id="p-avatar"
                  type="text"
                  value={profileAvatarUrl}
                  onChange={(e) => {
                    setProfileAvatarUrl(e.target.value);
                    if (profileFormError?.avatarUrl) setProfileFormError({ ...profileFormError, avatarUrl: undefined });
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none transition-all ${
                    profileFormError?.avatarUrl
                      ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                      : 'border-[#E5E8EB] focus:border-[#5B5FC7] focus:ring-1 focus:ring-[#5B5FC7]'
                  }`}
                />
                {profileFormError?.avatarUrl && (
                  <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{profileFormError.avatarUrl}</span>
                  </div>
                )}
              </div>

              {/* 테마 프리셋 선택 (6종) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#333D4B]">
                  테마 프리셋 6종 (THEME-01)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEME_OPTIONS.map((themeOpt) => {
                    const isSelected = profileTheme === themeOpt.value;
                    return (
                      <button
                        key={themeOpt.value}
                        type="button"
                        onClick={() => setProfileTheme(themeOpt.value)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'border-[#5B5FC7] bg-[#F0F0FF] ring-2 ring-[#5B5FC7]'
                            : 'border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F2F4F6]'
                        }`}
                      >
                        <div className={`w-full h-7 rounded-lg ${themeOpt.bg} border ${themeOpt.border} flex items-center justify-center text-[10px] font-bold ${themeOpt.text}`}>
                          Aa
                        </div>
                        <span className="text-[11px] font-bold truncate max-w-full text-[#191F28]">
                          {themeOpt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 버튼 스타일 선택 (3종) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#333D4B]">
                  버튼 스타일 선택 (THEME-02)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BUTTON_STYLE_OPTIONS.map((btnOpt) => {
                    const isSelected = profileButtonStyle === btnOpt.value;
                    return (
                      <button
                        key={btnOpt.value}
                        type="button"
                        onClick={() => setProfileButtonStyle(btnOpt.value)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'border-[#5B5FC7] bg-[#F0F0FF] ring-2 ring-[#5B5FC7]'
                            : 'border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F2F4F6]'
                        }`}
                      >
                        <div className={`w-full h-7 ${btnOpt.shape} bg-[#5B5FC7] text-white flex items-center justify-center text-[10px] font-bold`}>
                          버튼
                        </div>
                        <span className="text-[11px] font-bold truncate text-[#191F28]">
                          {btnOpt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="mt-2">
                <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                  취소
                </DialogClose>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#5B5FC7] hover:bg-[#4B4FA7] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>설정 적용하기</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- 4. 소셜 링크 관리 다이얼로그 --- */}
        <Dialog open={isSocialsDialogOpen} onOpenChange={setIsSocialsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>소셜 아카이브 링크 관리 (PAGE-03)</DialogTitle>
              <DialogDescription>
                프로필 하단 소셜 아이콘 바에 표시할 인스타그램, 유튜브, 깃허브 등 매체를 관리하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 등록된 소셜 링크 리스트 */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#333D4B]">
                  현재 등록된 소셜 링크 ({socials.length}개)
                </div>
                {socials.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#F9FAFB] text-xs text-[#8B95A1] text-center border border-[#E5E8EB]">
                    등록된 소셜 링크가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {socials.map((s) => {
                      const matched = SOCIAL_PLATFORM_OPTIONS.find((p) => p.value === s.platform);
                      const IconComp = matched ? matched.icon : Globe;
                      return (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB] text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-[#F0F0FF] text-[#5B5FC7] flex items-center justify-center flex-shrink-0">
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-[#191F28] capitalize flex-shrink-0">
                              {s.platform}:
                            </span>
                            <span className="text-[#6B7684] truncate">{s.url}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSocialLink(s.id)}
                            className="p-1 text-[#8B95A1] hover:text-[#E90064] hover:bg-[#FFF0F0] rounded-lg transition-colors cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 소셜 링크 추가 폼 */}
              <form onSubmit={handleAddSocialLink} className="p-3.5 rounded-2xl bg-[#F0F0FF] border border-[#DCDCFB] space-y-3">
                <div className="text-xs font-bold text-[#5B5FC7]">새 소셜 링크 추가</div>
                <div className="grid grid-cols-3 gap-2">
                  {SOCIAL_PLATFORM_OPTIONS.map((opt) => {
                    const isSelected = newSocialPlatform === opt.value;
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setNewSocialPlatform(opt.value);
                          setSocialFormError(null);
                        }}
                        className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#5B5FC7] text-[#5B5FC7] shadow-xs'
                            : 'bg-white/50 border-[#E5E8EB] text-[#6B7684]'
                        }`}
                      >
                        <IconComp className="w-3 h-3" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={
                        newSocialPlatform === 'email'
                          ? '예: contact@example.com'
                          : '예: https://instagram.com/myaccount'
                      }
                      value={newSocialUrl}
                      onChange={(e) => {
                        setNewSocialUrl(e.target.value);
                        if (socialFormError) setSocialFormError(null);
                      }}
                      className={`flex-1 px-3 py-1.5 rounded-xl border bg-white text-xs placeholder-[#8B95A1] focus:outline-none transition-all ${
                        socialFormError
                          ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                          : 'border-[#E5E8EB] focus:border-[#5B5FC7]'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#5B5FC7] hover:bg-[#4B4FA7] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>추가</span>
                    </button>
                  </div>
                  {socialFormError && (
                    <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{socialFormError}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <DialogFooter>
              <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                닫기
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- 5. 통계 분석 다이얼로그 (STAT-01 ~ 03) --- */}
        <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3182F6]" />
                <span>대시보드 통계 & 애널리틱스</span>
              </DialogTitle>
              <DialogDescription>
                PRD STAT-01 ~ 03 요구사항: 로컬 스토리지에 수집된 프로필 방문수(PV) 및 개별 링크 클릭 추이를 확인하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 통계 요약 카드 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#E8F3FF] border border-[#BBE0FF] text-center">
                  <div className="text-xs font-bold text-[#3182F6] mb-1">총 프로필 방문수 (PV)</div>
                  <div className="text-2xl font-extrabold text-[#191F28] tabular-nums">
                    {totalPageViews}회
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F0F0FF] border border-[#DCDCFB] text-center">
                  <div className="text-xs font-bold text-[#5B5FC7] mb-1">총 링크 클릭 수</div>
                  <div className="text-2xl font-extrabold text-[#191F28] tabular-nums">
                    {totalClicks}회
                  </div>
                </div>
              </div>

              {/* 링크별 개별 클릭 수 리스트 */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#333D4B]">
                  개별 링크 클릭 수 집계 (STAT-02)
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {links.filter((l) => !l.isHeader).map((link) => {
                    const clickCount = link.clicks || 0;
                    const percent = totalClicks > 0 ? Math.round((clickCount / totalClicks) * 100) : 0;
                    return (
                      <div key={link.id} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB] space-y-1.5 text-xs">
                        <div className="flex justify-between font-bold text-[#191F28]">
                          <span className="truncate max-w-[240px]">{link.title}</span>
                          <span className="text-[#3182F6] tabular-nums">{clickCount}회 ({percent}%)</span>
                        </div>
                        {/* 클릭 비율 바 */}
                        <div className="w-full h-2 rounded-full bg-[#E5E8EB] overflow-hidden">
                          <div
                            className="h-full bg-[#3182F6] rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 통계 초기화 버튼 */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleResetAnalytics}
                  className="px-3 py-1.5 text-xs font-semibold text-[#E90064] hover:bg-[#FFF0F0] rounded-lg border border-[#FFD0D0] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>통계 데이터 초기화</span>
                </button>
              </div>
            </div>

            <DialogFooter>
              <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                닫기
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- 6. 페르소나 / 프로필 스위처 다이얼로그 --- */}
        <Dialog open={isSwitcherDialogOpen} onOpenChange={setIsSwitcherDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>시연용 페르소나 / 프로필 전환</DialogTitle>
              <DialogDescription>
                PRD §3.3 더미 데이터 페르소나 또는 새 커스텀 핸들로 로컬 상태를 자유롭게 전환하세요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 프리셋 더미 페르소나 선택 */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#333D4B]">더미 페르소나 3종 선택</div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchProfile('demo')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      username === 'demo'
                        ? 'border-[#5B5FC7] bg-[#F0F0FF] ring-1 ring-[#5B5FC7]'
                        : 'border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F2F4F6]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#191F28]">홍길동 (@demo)</div>
                      <div className="text-[11px] text-[#6B7684]">기본 대표 크리에이터 프로필</div>
                    </div>
                    {username === 'demo' && <Check className="w-4 h-4 text-[#5B5FC7]" />}
                  </button>

                  {DUMMY_PROFILES.map((p) => {
                    const isCurrent = username.toLowerCase() === p.username.toLowerCase();
                    return (
                      <button
                        key={p.username}
                        type="button"
                        onClick={() => handleSwitchProfile(p.username)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-[#5B5FC7] bg-[#F0F0FF] ring-1 ring-[#5B5FC7]'
                            : 'border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#F2F4F6]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-[#191F28]">
                            {p.name} (@{p.username})
                          </div>
                          <div className="text-[11px] text-[#6B7684]">
                            테마: {p.theme} | 링크 {p.links.length}개
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-[#5B5FC7]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 커스텀 핸들 생성 */}
              <form onSubmit={handleCreateCustomProfile} className="pt-2 border-t border-[#E5E8EB] space-y-2">
                <div className="text-xs font-bold text-[#333D4B]">새 커스텀 핸들(URL)로 가입/생성</div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="예: my_new_handle"
                      value={newUsernameInput}
                      onChange={(e) => {
                        setNewUsernameInput(e.target.value);
                        if (switcherFormError) setSwitcherFormError(null);
                      }}
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs placeholder-[#8B95A1] focus:outline-none transition-all ${
                        switcherFormError
                          ? 'border-[#E90064] focus:ring-1 focus:ring-[#E90064]'
                          : 'border-[#E5E8EB] focus:border-[#5B5FC7]'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5B5FC7] hover:bg-[#4B4FA7] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      생성 및 전환
                    </button>
                  </div>
                  {switcherFormError && (
                    <div className="text-xs text-[#E90064] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{switcherFormError}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <DialogFooter>
              <DialogClose className="h-9 px-4 rounded-xl border border-[#E5E8EB] text-xs font-semibold text-[#6B7684] hover:bg-[#F2F4F6] transition-colors cursor-pointer">
                닫기
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
