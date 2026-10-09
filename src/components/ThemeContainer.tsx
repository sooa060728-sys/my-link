'use client';

import React from 'react';
import { ThemeType } from '../types';

interface ThemeContainerProps {
  theme: ThemeType;
  children: React.ReactNode;
}

export function ThemeContainer({ theme, children }: ThemeContainerProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-950 text-slate-100';
      case 'neon':
        return 'bg-gray-950 text-emerald-400 font-mono';
      case 'pastel':
        return 'bg-gradient-to-br from-rose-100 via-purple-100 to-sky-100 text-slate-800';
      case 'minimal':
        return 'bg-stone-100 text-stone-900 font-sans';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 text-white';
      case 'light':
      default:
        return 'bg-slate-50 text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 flex justify-center py-10 px-4 ${getThemeStyles()}`}>
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
