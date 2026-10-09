'use client';

import React from 'react';
import { SocialLinkItem } from '../types';
import { Mail, Globe, Video, Share2, Camera, Code } from 'lucide-react';

interface SocialIconsProps {
  socials: SocialLinkItem[];
}

export function SocialIcons({ socials }: SocialIconsProps) {
  if (!socials || socials.length === 0) return null;

  const getIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Camera {...iconProps} />;
      case 'youtube':
        return <Video {...iconProps} />;
      case 'github':
        return <Code {...iconProps} />;
      case 'twitter':
        return <Share2 {...iconProps} />;
      case 'email':
        return <Mail {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6 mb-8 flex-wrap gap-y-2">
      {socials.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-200 active:scale-95"
          aria-label={social.platform}
        >
          {getIcon(social.platform)}
        </a>
      ))}
    </div>
  );
}
