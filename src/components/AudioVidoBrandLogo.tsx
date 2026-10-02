import React from 'react';

interface AudioVidoBrandLogoProps {
  className?: string;
  variant?: 'horizontal' | 'stacked' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const AudioVidoBrandLogo: React.FC<AudioVidoBrandLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md'
}) => {
  // Exact mathematical Lemniscate of Bernoulli path for flawless smooth infinity loop
  const infinityPath = "M 270,75 L 268.1,87.3 L 262.5,98.4 L 254.2,107.2 L 244.1,113.3 L 233.1,116.6 L 222.2,117.4 L 211.6,116.2 L 201.7,113.4 L 192.6,109.5 L 184.3,104.7 L 176.6,99.3 L 169.5,93.5 L 162.8,87.5 L 156.3,81.3 L 150,75 L 143.7,68.7 L 137.2,62.5 L 130.5,56.5 L 123.4,50.7 L 115.7,45.3 L 107.4,40.5 L 98.3,36.6 L 88.4,33.8 L 77.8,32.6 L 66.9,33.4 L 55.9,36.7 L 45.8,42.8 L 37.5,51.6 L 31.9,62.7 L 30,75 L 31.9,87.3 L 37.5,98.4 L 45.8,107.2 L 55.9,113.3 L 66.9,116.6 L 77.8,117.4 L 88.4,116.2 L 98.3,113.4 L 107.4,109.5 L 115.7,104.7 L 123.4,99.3 L 130.5,93.5 L 137.2,87.5 L 143.7,81.3 L 150,75 L 156.3,68.7 L 162.8,62.5 L 169.5,56.5 L 176.6,50.7 L 184.3,45.3 L 192.6,40.5 L 201.7,36.6 L 211.6,33.8 L 222.2,32.6 L 233.1,33.4 L 244.1,36.7 L 254.2,42.8 L 262.5,51.6 L 268.1,62.7 L 270,75 Z";

  // Sizing definitions
  const heights = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12'
  };

  const InfinitySymbolSVG = ({ iconClass = "h-full w-auto" }) => (
    <svg 
      viewBox="15 20 270 110" 
      className={`${iconClass} shrink-0 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="av-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Outer Infinity Gradient: Cyan -> Blue -> Purple -> Magenta -> Orange */}
        <linearGradient id="av-infinity-grad" x1="20" y1="75" x2="280" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="28%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="74%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>

        {/* Specular 3D Highlight Gradient */}
        <linearGradient id="av-sheen-grad" x1="150" y1="20" x2="150" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>

        {/* Equalizer Wave Gradient */}
        <linearGradient id="av-wave-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Play Triangle Gradient */}
        <linearGradient id="av-play-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>

      {/* 1. Ambient Glow Underlayer */}
      <path 
        d={infinityPath} 
        stroke="url(#av-infinity-grad)" 
        strokeWidth="20" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.45"
        filter="url(#av-neon-glow)"
      />

      {/* 2. Main 3D Neon Glass Infinity Tube */}
      <path 
        d={infinityPath} 
        stroke="url(#av-infinity-grad)" 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* 3. Top Specular Glass Reflection Hairline */}
      <path 
        d={infinityPath} 
        stroke="url(#av-sheen-grad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.6"
      />

      {/* --- INSIDE LEFT LOOP: Vertical Audio Soundwave Equalizer --- */}
      <g filter="url(#av-neon-glow)">
        {/* Left outer dot */}
        <circle cx="56" cy="75" r="2.2" fill="#00e5ff" />
        {/* Bar 1 */}
        <rect x="62" y="67" width="3.2" height="16" rx="1.6" fill="url(#av-wave-grad)" />
        {/* Bar 2 */}
        <rect x="69" y="61" width="3.2" height="28" rx="1.6" fill="url(#av-wave-grad)" />
        {/* Bar 3 */}
        <rect x="76" y="55" width="3.2" height="40" rx="1.6" fill="url(#av-wave-grad)" />
        {/* Center Bar 4 (Tallest) */}
        <rect x="83" y="49" width="3.4" height="52" rx="1.7" fill="#38bdf8" />
        {/* Bar 5 */}
        <rect x="90" y="55" width="3.2" height="40" rx="1.6" fill="url(#av-wave-grad)" />
        {/* Bar 6 */}
        <rect x="97" y="61" width="3.2" height="28" rx="1.6" fill="url(#av-wave-grad)" />
        {/* Bar 7 */}
        <rect x="104" y="67" width="3.2" height="16" rx="1.6" fill="url(#av-wave-grad)" />
        {/* Right inner dot */}
        <circle cx="111" cy="75" r="2.2" fill="#38bdf8" />
      </g>

      {/* --- INSIDE RIGHT LOOP: Neon Play Button Triangle --- */}
      <g filter="url(#av-neon-glow)">
        <polygon 
          points="209,56 235,75 209,94" 
          fill="url(#av-play-grad)" 
          stroke="#fda4af" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />
      </g>
    </svg>
  );

  // Icon only
  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center ${heights[size]} ${className}`}>
        <InfinitySymbolSVG />
      </div>
    );
  }

  // Stacked Full Badge (Matches the user's uploaded image exactly)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center p-3 text-center bg-black/90 rounded-2xl select-none ${className}`}>
        <InfinitySymbolSVG iconClass="w-36 sm:w-44 h-auto" />
        
        {/* Stylized AUDIOVIDO Wordmark (A without crossbar: ΛUDIOVIDO) */}
        <div className="mt-3 flex items-center justify-center text-white font-black tracking-[0.22em] text-lg sm:text-2xl font-sans drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
          <span className="text-white">ΛUDIOVIDO</span>
        </div>

        {/* Subtitle: MUSIC & MOVIES */}
        <div className="mt-1 flex items-center justify-center gap-1.5 text-[9px] sm:text-[11px] font-bold font-sans tracking-[0.24em] uppercase">
          <span className="text-cyan-400">MUSIC</span>
          <span className="text-pink-400">&</span>
          <span className="text-orange-400">MOVIES</span>
        </div>

        {/* Subtitle: FREE FOREVER with accent hairlines */}
        <div className="mt-1.5 flex items-center justify-center gap-2 w-full max-w-[180px]">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-400/80" />
          <span className="text-[7.5px] sm:text-[8.5px] font-mono font-medium tracking-[0.2em] text-slate-300">
            FREE FOREVER
          </span>
          <span className="h-[1px] flex-1 bg-gradient-to-r from-pink-400/80 via-pink-400 to-transparent" />
        </div>
      </div>
    );
  }

  // Default: Horizontal Lockup (Pristine for Header Bar - Perfect Symmetry & Optical Alignment)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${heights[size]} ${className}`}>
      {/* 3D Glowing Infinity Symbol */}
      <InfinitySymbolSVG iconClass="h-full w-auto" />

      {/* Primary Wordmark with stylized apex A: ΛUDIOVIDO (Matched height, prominent & symmetric) */}
      <div className="flex items-center text-white font-black tracking-[0.2em] text-[13px] sm:text-[15px] font-sans drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-none select-none">
        <span>ΛUDIOVIDO</span>
      </div>
    </div>
  );
};
export default AudioVidoBrandLogo;
