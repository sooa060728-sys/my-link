'use client';

import React from 'react';
import { LinkItem, ThemeType, ButtonStyleType } from '../types';
import { Globe, BookOpen, Mail, ExternalLink, Link as LinkIcon, Video, Share2, Camera, Code, Pencil, Trash2 } from 'lucide-react';

interface LinkCardProps {
  item: LinkItem;
  theme: ThemeType;
  buttonStyle: ButtonStyleType;
  onLinkClick?: (id: string) => void;
  onEdit?: (item: LinkItem) => void;
  onDelete?: (item: LinkItem) => void;
  showActions?: boolean;
}

export function LinkCard({ item, theme, buttonStyle, onLinkClick, onEdit, onDelete, showActions }: LinkCardProps) {
  if (!item.isActive) return null;

  if (item.isHeader) {
    return (
      <div className="w-full pt-4 pb-2 text-center">
        <h3 className="text-sm font-bold tracking-wider uppercase opacity-80">
          {item.title}
        </h3>
      </div>
    );
  }

  const renderIcon = () => {
    const iconProps = { className: "w-5 h-5 shrink-0" };
    switch (item.icon?.toLowerCase()) {
      case 'globe':
        return <Globe {...iconProps} />;
      case 'youtube':
        return <Video {...iconProps} />;
      case 'bookopen':
        return <BookOpen {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'github':
        return <Code {...iconProps} />;
      case 'instagram':
        return <Camera {...iconProps} />;
      case 'twitter':
        return <Share2 {...iconProps} />;
      default:
        return <LinkIcon {...iconProps} />;
    }
  };

  const getButtonStyleClasses = () => {
    const radius = buttonStyle === 'rounded' ? 'rounded-full' : buttonStyle === 'corner' ? 'rounded-2xl' : 'rounded-xl';

    if (buttonStyle === 'outline') {
      switch (theme) {
        case 'dark':
          return `${radius} border-2 border-slate-700 hover:border-slate-400 bg-slate-900/60 text-slate-100`;
        case 'neon':
          return `${radius} border-2 border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]`;
        case 'pastel':
          return `${radius} border-2 border-purple-300 hover:border-purple-500 bg-white/70 text-slate-800`;
        case 'gradient':
          return `${radius} border-2 border-white/60 hover:bg-white/10 text-white`;
        case 'minimal':
          return `${radius} border-2 border-stone-800 hover:bg-stone-900 hover:text-white text-stone-900`;
        case 'light':
        default:
          return `${radius} border-2 border-slate-300 hover:border-slate-500 bg-white text-slate-900`;
      }
    }

    switch (theme) {
      case 'dark':
        return `${radius} bg-slate-900/80 hover:bg-slate-800 text-slate-100 shadow-md border border-slate-800`;
      case 'neon':
        return `${radius} bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]`;
      case 'pastel':
        return `${radius} bg-white/80 hover:bg-white text-purple-950 shadow-sm backdrop-blur-md border border-purple-100`;
      case 'minimal':
        return `${radius} bg-stone-900 hover:bg-stone-800 text-stone-100 shadow-sm`;
      case 'gradient':
        return `${radius} bg-white/20 hover:bg-white/30 text-white shadow-lg backdrop-blur-md border border-white/20`;
      case 'light':
      default:
        return `${radius} bg-white hover:bg-slate-100 text-slate-900 shadow-md border border-slate-200/60`;
    }
  };

  return (
    <a
      href={item.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick?.(item.id)}
      className={`w-full py-4 px-6 mb-3 flex items-center justify-between font-medium text-base transition-all duration-200 active:scale-[0.98] ${getButtonStyleClasses()}`}
    >
      <span className="flex items-center space-x-3 overflow-hidden">
        {renderIcon()}
        <span className="truncate font-semibold">{item.title}</span>
      </span>
      <div className="flex items-center space-x-2 shrink-0 ml-2">
        {(onEdit || onDelete || showActions) && (
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-current transition-colors cursor-pointer"
                title="수정"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        <ExternalLink className="w-4 h-4 opacity-50 shrink-0" />
      </div>
    </a>
  );
}
