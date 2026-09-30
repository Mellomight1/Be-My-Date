import React from 'react';
import { Utensils, Volume2, VolumeX, Sparkles, RotateCcw, Share2 } from 'lucide-react';
import { AppTheme } from '../types';

interface HeaderProps {
  theme: AppTheme;
  onReset: () => void;
  onOpenCustomize: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onReset,
  onOpenCustomize,
  soundEnabled,
  onToggleSound,
}) => {
  const isMidnight = theme === 'midnight';

  return (
    <header
      className={`w-full backdrop-blur-md border-b sticky top-0 z-40 transition-colors ${
        isMidnight
          ? 'bg-slate-950/85 border-indigo-900/50 text-slate-100'
          : 'bg-white/90 border-rose-100 text-stone-900'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Brand title */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 group text-left rounded-lg cursor-pointer shrink-0"
          title="Back to start"
        >
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 ${
              isMidnight
                ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                : 'bg-rose-500 text-white shadow-rose-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span
            className={`font-display text-base sm:text-xl font-bold tracking-tight transition-colors truncate max-w-[140px] sm:max-w-none ${
              isMidnight ? 'group-hover:text-indigo-400' : 'group-hover:text-rose-600'
            }`}
          >
            Dinner Date
          </span>
        </button>

        {/* Zone 2: Navigation / Info */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <span
            className={`flex items-center gap-1.5 font-medium ${
              isMidnight ? 'text-slate-400' : 'text-stone-500'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${isMidnight ? 'text-indigo-400' : 'text-rose-500'}`}
            />
            <span>The invitation with a 100% acceptance rate</span>
          </span>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isMidnight
                ? 'border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300'
                : 'border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600'
            }`}
            title={soundEnabled ? 'Mute playful sound effects' : 'Turn on sound effects'}
          >
            {soundEnabled ? (
              <Volume2
                className={`w-4 h-4 ${isMidnight ? 'text-indigo-400' : 'text-rose-500'}`}
              />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Share & Personalize Button */}
          <button
            onClick={onOpenCustomize}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
              isMidnight
                ? 'text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/80 border-indigo-800/70'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Invite</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isMidnight
                ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                : 'border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800'
            }`}
            title="Restart experience"
            aria-label="Restart experience"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
