import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { InviteConfig } from '../types';
import { sounds } from '../utils/audio';
import celebrationImg from '../assets/images/dinner_yes_celebrate_1790794185422.jpg';

interface CelebrationScreenProps {
  invite: InviteConfig;
  onProceedToPlanner: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  invite,
  onProceedToPlanner,
}) => {
  const isMidnight = invite.theme === 'midnight';
  const [countdown, setCountdown] = useState(5);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Play celebratory audio chime
    sounds.playCelebration();

    // Fire fireworks confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const colors = isMidnight
      ? ['#6366f1', '#a855f7', '#38bdf8', '#c084fc', '#818cf8', '#ffffff']
      : ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ec4899', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isMidnight]);

  // Dedicated effect for auto-advance countdown
  useEffect(() => {
    if (countdown <= 0) {
      onProceedToPlanner();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onProceedToPlanner]);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto py-4 sm:py-8 px-2 sm:px-4 animate-fade-in relative z-10">
      <div
        className={`rounded-3xl border shadow-2xl overflow-hidden text-center transition-colors ${
          isMidnight
            ? 'bg-slate-900/90 border-indigo-900/70 shadow-indigo-950/50 text-slate-100'
            : 'bg-white border-rose-100 shadow-rose-950/10 text-stone-900'
        }`}
      >
        {/* Celebration Image */}
        <div
          className={`relative h-48 sm:h-64 w-full overflow-hidden ${
            isMidnight ? 'bg-slate-950' : 'bg-rose-100/50'
          }`}
        >
          {!imgError ? (
            <img
              src={celebrationImg}
              alt="Celebration dinner toast"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 ${
                isMidnight
                  ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-indigo-200'
                  : 'bg-gradient-to-br from-rose-200 via-rose-100 to-amber-100 text-rose-900'
              }`}
            >
              <span className="text-6xl mb-2">🥂🎉✨</span>
              <p className="font-display font-bold text-xl">Celebration time!</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-6">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                isMidnight
                  ? 'bg-slate-900/90 text-indigo-300 border border-indigo-800'
                  : 'bg-white/90 text-rose-700'
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${isMidnight ? 'text-indigo-400' : 'text-rose-500'}`}
              />
              <span>It's a date!</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-1 ${
                isMidnight ? 'bg-indigo-950 text-indigo-400' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  isMidnight ? 'fill-indigo-400 text-indigo-400' : 'fill-rose-600 text-rose-600'
                }`}
              />
            </div>

            <h1
              className={`text-3xl sm:text-4xl font-display font-bold leading-tight ${
                isMidnight ? 'text-white' : 'text-stone-900'
              }`}
            >
              I knew you would say yes!
            </h1>

            <p
              className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed ${
                isMidnight ? 'text-slate-300' : 'text-stone-600'
              }`}
            >
              Best decision ever! Now let's pick the perfect date, time, and delicious food so we can make it unforgettable.
            </p>
          </div>

          {/* Action to proceed to planner */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                sounds.playPop();
                onProceedToPlanner();
              }}
              className={`w-full py-4 px-6 font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-[0.98] cursor-pointer group ${
                isMidnight
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-stone-900 hover:bg-stone-800 text-white shadow-stone-900/20'
              }`}
            >
              <Calendar
                className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  isMidnight ? 'text-indigo-200' : 'text-rose-400'
                }`}
              />
              <span>Decide When to Go</span>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <p
              className={`text-xs ${
                isMidnight ? 'text-slate-500' : 'text-stone-400'
              }`}
            >
              Continuing automatically in {countdown}s... or click above!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
