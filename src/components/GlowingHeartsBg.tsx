import React, { useMemo } from 'react';
import { AppTheme } from '../types';

interface GlowingHeartsBgProps {
  theme: AppTheme;
}

interface HeartParticle {
  id: number;
  left: number; // percentage 0-100
  size: number; // px 9 to 24
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
  glowColor: string;
}

export const GlowingHeartsBg: React.FC<GlowingHeartsBgProps> = ({ theme }) => {
  const isMidnight = theme === 'midnight';

  // Pre-calculate randomized particles
  const particles: HeartParticle[] = useMemo(() => {
    const list: HeartParticle[] = [];
    const count = 34; // dreamy density of luminous glowing hearts

    // Vibrant glowing romantic palette
    const colors = isMidnight
      ? ['#f43f5e', '#fb7185', '#ec4899', '#a855f7', '#c084fc', '#818cf8', '#f472b6']
      : ['#f43f5e', '#fb7185', '#f59e0b', '#ec4899', '#fda4af'];

    for (let i = 0; i < count; i++) {
      const left = Math.floor(Math.random() * 96) + 2;
      const size = Math.floor(Math.random() * 15) + 10; // 10px to 25px
      const duration = Math.floor(Math.random() * 9) + 7; // 7s to 16s float time
      const delay = -(Math.random() * 16); // staggered initial phase
      const opacity = isMidnight ? 0.55 + Math.random() * 0.45 : 0.4 + Math.random() * 0.45;
      const glowColor = colors[i % colors.length];

      list.push({ id: i, left, size, duration, delay, opacity, glowColor });
    }
    return list;
  }, [isMidnight]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-40px] select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            animation: `floatUpGlow ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            filter: isMidnight
              ? `drop-shadow(0 0 5px ${p.glowColor}) drop-shadow(0 0 12px ${p.glowColor})`
              : `drop-shadow(0 0 6px ${p.glowColor})`,
            color: p.glowColor,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
    </div>
  );
};
