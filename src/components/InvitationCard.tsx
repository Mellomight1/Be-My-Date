import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle, Share2 } from 'lucide-react';
import { InviteConfig } from '../types';
import { sounds } from '../utils/audio';
import heroImage from '../assets/images/dinner_invite_hero_1790794171665.jpg';

interface InvitationCardProps {
  invite: InviteConfig;
  onAccept: () => void;
  onOpenCustomize?: () => void;
}

const DECLINE_LABELS = [
  'No',
  'Wait, are you sure? 🥺',
  'Think about the dessert! 🍰',
  'Nice try! Too slow 🏃💨',
  'Error 404: "No" not found 🤖',
  'The button is taking a nap 😴',
  'What about your favorite food? 🍷',
  'Resistance is futile 😉',
  'Did you mean to click YES?',
  'You cannot escape dinner! 🚀',
  'I can do this all evening 🥰',
];

const DODGE_COMMENTARY = [
  'Oops, it slipped away!',
  'Almost had it!',
  'Too fast for human fingers!',
  'That button has Olympic reflexes.',
  'Physics has left the chat.',
  'Destiny says dinner is happening.',
];

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invite,
  onAccept,
  onOpenCustomize,
}) => {
  const isMidnight = invite.theme === 'midnight';

  const [dodges, setDodges] = useState(0);
  const [commentary, setCommentary] = useState<string | null>(null);
  const [hasStartedDodging, setHasStartedDodging] = useState(false);
  const [declinePos, setDeclinePos] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);

  const declineBtnRef = useRef<HTMLButtonElement>(null);

  // Evasive dodge function: free across the ENTIRE smartphone screen!
  const dodgeButton = useCallback(() => {
    sounds.playWhoosh();
    setHasStartedDodging(true);

    const randomComment = DODGE_COMMENTARY[Math.floor(Math.random() * DODGE_COMMENTARY.length)];
    setCommentary(randomComment);
    setDodges((prev) => prev + 1);

    // Free screen-wide movement across the smartphone viewport
    const btnWidth = declineBtnRef.current?.offsetWidth || 150;
    const btnHeight = declineBtnRef.current?.offsetHeight || 44;

    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 390;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 844;

    const minX = 16;
    const maxX = Math.max(minX + 20, viewportW - btnWidth - 16);

    const minY = 76; // keep comfortably below top header
    const maxY = Math.max(minY + 20, viewportH - btnHeight - 32); // keep above bottom edge

    const newX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const newY = Math.floor(Math.random() * (maxY - minY)) + minY;

    setDeclinePos({ x: newX, y: newY });
  }, []);

  // Screen-wide proximity detection (on desktop cursor or stylus hover)
  useEffect(() => {
    if (!hasStartedDodging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!declineBtnRef.current) return;
      const rect = declineBtnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      // If finger or pointer gets within 65px, it dodges away
      if (dist < 65) {
        dodgeButton();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [hasStartedDodging, dodgeButton]);

  const currentLabelIndex = Math.min(dodges, DECLINE_LABELS.length - 1);
  const declineLabel = DECLINE_LABELS[currentLabelIndex];

  // Yes button scale grows as dodges increase (from 1.0 to 1.35)
  const yesScale = 1 + Math.min(dodges * 0.05, 0.35);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto py-2 sm:py-6 px-1 sm:px-2 relative z-10">
      <div
        className={`rounded-3xl border shadow-xl overflow-hidden transition-all ${
          isMidnight
            ? 'bg-slate-900/95 border-indigo-900/70 shadow-indigo-950/40 text-slate-100'
            : 'bg-white/95 border-rose-100 shadow-rose-950/10 text-stone-900'
        }`}
      >
        {/* Visual Hero Banner */}
        <div
          className={`relative h-48 sm:h-64 w-full overflow-hidden ${
            isMidnight ? 'bg-slate-950' : 'bg-rose-100/60'
          }`}
        >
          {!imgError ? (
            <img
              src={heroImage}
              alt="Romantic candlelit dinner invitation table"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
                isMidnight
                  ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-indigo-200'
                  : 'bg-gradient-to-br from-rose-100 via-amber-50 to-rose-200 text-rose-800'
              }`}
            >
              <span className="text-5xl mb-2">🕯️🍷🍝</span>
              <p className="font-display font-semibold text-lg">An invitation for dinner</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex items-end p-5">
            <div className="text-white">
              <p
                className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${
                  isMidnight ? 'text-indigo-300' : 'text-rose-200'
                }`}
              >
                Official Invitation
              </p>
              <h2 className="text-xl sm:text-2xl font-bold font-display leading-tight text-white drop-shadow-sm">
                {invite.recipientName ? `Hey ${invite.recipientName},` : 'Hey there,'}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-5">
          <div className="text-center space-y-1.5">
            <h1
              className={`text-2xl sm:text-3xl font-bold font-display leading-tight ${
                isMidnight ? 'text-white' : 'text-stone-900'
              }`}
            >
              Will you go to dinner with me?
            </h1>
            <p
              className={`text-xs sm:text-sm max-w-xs mx-auto leading-relaxed ${
                isMidnight ? 'text-slate-300' : 'text-stone-600'
              }`}
            >
              {invite.customMessage ||
                'I promise delicious food, wonderful conversation, dessert of your choice, and lots of laughs.'}
            </p>
            {invite.senderName && (
              <p
                className={`text-xs font-semibold pt-0.5 ${
                  isMidnight ? 'text-indigo-400' : 'text-rose-600'
                }`}
              >
                — Sent with warmth by {invite.senderName}
              </p>
            )}
          </div>

          {/* Dodge commentary ticker */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {commentary && (
                <motion.div
                  key={dodges}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${
                    isMidnight
                      ? 'text-indigo-300 bg-indigo-950/90 border-indigo-800'
                      : 'text-rose-600 bg-rose-50 border-rose-200'
                  }`}
                >
                  <Sparkles
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isMidnight ? 'text-indigo-400' : 'text-rose-500'
                    }`}
                  />
                  <span>{commentary}</span>
                  <span
                    className={`font-mono text-[10px] ${
                      isMidnight ? 'text-slate-400' : 'text-stone-400'
                    }`}
                  >
                    ({dodges} {dodges === 1 ? 'try' : 'tries'})
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Zone (No bounding border! Completely free and open) */}
          <div className="pt-2 flex flex-col items-center justify-center gap-3.5">
            {/* The "YES" Button - Centered Hero */}
            <motion.button
              onClick={() => {
                sounds.playPop();
                onAccept();
              }}
              animate={{ scale: yesScale }}
              whileHover={{ scale: yesScale * 1.04 }}
              whileTap={{ scale: yesScale * 0.96 }}
              className={`w-full min-h-[52px] px-6 py-3.5 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2.5 transition-colors cursor-pointer text-base sm:text-lg ${
                isMidnight
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40 focus-visible:ring-4 focus-visible:ring-indigo-400'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 focus-visible:ring-4 focus-visible:ring-rose-300'
              }`}
            >
              <Heart className="w-5 h-5 fill-white text-white animate-pulse shrink-0" />
              <span>Yes, absolutely!</span>
            </motion.button>

            {/* Initial static placement of "No" before first tap */}
            {!hasStartedDodging && (
              <button
                ref={declineBtnRef}
                onMouseEnter={dodgeButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  dodgeButton();
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  dodgeButton();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dodgeButton();
                }}
                className={`w-full min-h-[46px] px-5 py-2.5 border font-medium rounded-2xl shadow-xs transition-all cursor-pointer text-sm whitespace-nowrap flex items-center justify-center ${
                  isMidnight
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                {declineLabel}
              </button>
            )}

            <p
              className={`text-[11px] text-center tracking-wide ${
                isMidnight ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              {dodges === 0
                ? 'Choose an option to respond'
                : 'Notice: The "No" button has gone rogue across the screen! 🏃💨'}
            </p>
          </div>

          {/* Reassurance note */}
          <div
            className={`flex items-center justify-center gap-1.5 text-[11px] text-center pt-1 ${
              isMidnight ? 'text-slate-400' : 'text-stone-500'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 opacity-70" />
            <span>Guaranteed memorable evening & great food</span>
          </div>

          {/* Share trigger button */}
          {onOpenCustomize && (
            <div
              className={`pt-2.5 border-t text-center ${
                isMidnight ? 'border-slate-800' : 'border-stone-100'
              }`}
            >
              <button
                type="button"
                onClick={onOpenCustomize}
                className={`text-xs font-semibold inline-flex items-center gap-1.5 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  isMidnight
                    ? 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/60'
                    : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Want to ask someone out? Personalize & Share Link</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* When dodging has started: Free-flying button anywhere across the smartphone screen! */}
      {hasStartedDodging && (
        <motion.button
          ref={declineBtnRef}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 60,
          }}
          animate={{
            x: declinePos.x,
            y: declinePos.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 24,
            mass: 0.5,
          }}
          onMouseEnter={dodgeButton}
          onPointerDown={(e) => {
            e.preventDefault();
            dodgeButton();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            dodgeButton();
          }}
          onClick={(e) => {
            e.preventDefault();
            dodgeButton();
          }}
          className={`min-h-[44px] px-4 py-2.5 border-2 font-medium text-xs sm:text-sm rounded-xl shadow-xl cursor-pointer whitespace-nowrap active:scale-95 ${
            isMidnight
              ? 'bg-slate-900/95 border-indigo-400 text-indigo-200 shadow-indigo-950/80 hover:bg-indigo-950'
              : 'bg-white/95 border-rose-400 text-rose-800 shadow-rose-950/20 hover:bg-rose-50'
          }`}
        >
          {declineLabel}
        </motion.button>
      )}
    </div>
  );
};
