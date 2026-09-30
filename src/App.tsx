/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { InvitationCard } from './components/InvitationCard';
import { CelebrationScreen } from './components/CelebrationScreen';
import { DatePlanner } from './components/DatePlanner';
import { CreateInviteModal } from './components/CreateInviteModal';
import { GlowingHeartsBg } from './components/GlowingHeartsBg';
import { InviteConfig, AppTheme } from './types';
import { sounds } from './utils/audio';

export default function App() {
  const [step, setStep] = useState<'invitation' | 'celebration' | 'planner'>('invitation');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Initialize invite from URL parameters if available
  const [invite, setInvite] = useState<InviteConfig>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to') || '';
      const from = params.get('from') || '';
      const msg = params.get('msg') || '';
      const rawTheme = params.get('theme');
      const theme: AppTheme = rawTheme === 'sunset' ? 'sunset' : 'midnight';
      return {
        recipientName: to,
        senderName: from,
        customMessage: msg,
        theme,
      };
    }
    return {
      recipientName: '',
      senderName: '',
      customMessage: '',
      theme: 'midnight',
    };
  });

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) {
      sounds.playPop();
    }
  };

  const handleReset = () => {
    sounds.playPop();
    setStep('invitation');
  };

  const isMidnight = invite.theme === 'midnight';

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-colors duration-500 ${
        isMidnight
          ? 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-slate-100'
          : 'bg-gradient-to-b from-rose-50/70 via-amber-50/30 to-rose-100/50 text-stone-800'
      }`}
    >
      {/* Tiny glowing floating hearts in the background */}
      <GlowingHeartsBg theme={invite.theme} />

      {/* Top Bar Header */}
      <Header
        theme={invite.theme}
        onReset={handleReset}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col justify-center items-center py-2 sm:py-6 px-2 sm:px-4 relative z-10 w-full max-w-md mx-auto">
        {step === 'invitation' && (
          <InvitationCard
            invite={invite}
            onAccept={() => setStep('celebration')}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />
        )}

        {step === 'celebration' && (
          <CelebrationScreen
            invite={invite}
            onProceedToPlanner={() => setStep('planner')}
          />
        )}

        {step === 'planner' && (
          <DatePlanner
            invite={invite}
            onBackToCard={() => setStep('invitation')}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`w-full py-4 text-center text-xs border-t transition-colors relative z-10 ${
          isMidnight
            ? 'text-slate-500 border-indigo-900/40'
            : 'text-stone-500 border-rose-100/70'
        }`}
      >
        <p>Made with love & gentle persuasion · 100% chance of a good time</p>
      </footer>

      {/* Personalize Invite Modal */}
      <CreateInviteModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        invite={invite}
        onSave={(newConfig) => setInvite(newConfig)}
      />
    </div>
  );
}
