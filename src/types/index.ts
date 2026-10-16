export type ThemeType = 'light' | 'dark' | 'neon' | 'pastel' | 'minimal' | 'gradient';
export type ButtonStyleType = 'rounded' | 'corner' | 'outline';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  isHeader?: boolean;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: 'instagram' | 'youtube' | 'github' | 'twitter' | 'email' | 'website';
  url: string;
}

export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  theme: ThemeType;
  buttonStyle: ButtonStyleType;
  links: LinkItem[];
  socials: SocialLinkItem[];
  pageViews?: number;
}
