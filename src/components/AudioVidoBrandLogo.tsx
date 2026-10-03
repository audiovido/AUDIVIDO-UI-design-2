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
  // Pure circular two-ring infinity geometry with smooth, organic center junction
  // Left circle: Center (56, 50), Radius: 32. Right circle: Center (124, 50), Radius: 32. Crossover: (90, 50)
  const fullInfinityPath = 
    "M 56,18 " +
    "C 38.3,18 24,32.3 24,50 " +
    "C 24,67.7 38.3,82 56,82 " +
    "C 74,82 80,64 90,50 " +
    "C 100,36 106,18 124,18 " +
    "C 141.7,18 156,32.3 156,50 " +
    "C 156,67.7 141.7,82 124,82 " +
    "C 106,82 100,64 90,50 " +
    "C 80,36 74,18 56,18 Z";

  // Exact 3D crossover strand (bottom-left to top-right) with soft shadow
  const crossoverOverlayStrand = 
    "M 74,68 C 81,59 86,52 90,50 C 94,48 99,41 106,32";

  // Sizing definitions
  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16'
  };

  const InfinitySymbolSVG = ({ iconClass = "h-full w-auto" }) => (
    <svg 
      viewBox="12 8 156 84" 
      className={`${iconClass} shrink-0 drop-shadow-[0_0_16px_rgba(56,189,248,0.5)]`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Ambient Neon Glow Filter */}
        <filter id="av-neon-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 3D Crossover Soft Drop Shadow */}
        <filter id="av-crossover-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-2" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
        </filter>

        {/* Continuous Fluid Rainbow Neon Gradient: Cyan -> Blue -> Purple -> Magenta -> Coral Orange */}
        <linearGradient id="av-infinity-tube-grad" x1="24" y1="50" x2="156" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="22%" stopColor="#0077ff" />
          <stop offset="42%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="68%" stopColor="#ec4899" />
          <stop offset="86%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ff5722" />
        </linearGradient>

        {/* Top 3D Specular Glass Reflection Sheen */}
        <linearGradient id="av-infinity-sheen" x1="90" y1="16" x2="90" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>

        {/* Dynamic Streaming Audio Equalizer Cyan to Electric Blue Gradient */}
        <linearGradient id="av-soundwave-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Play Triangle Pink to Coral Orange Gradient */}
        <linearGradient id="av-play-triangle-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c026d3" />
          <stop offset="35%" stopColor="#ec4899" />
          <stop offset="75%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>

      {/* 1. Ambient Glow Underlayer */}
      <path 
        d={fullInfinityPath} 
        stroke="url(#av-infinity-tube-grad)" 
        strokeWidth="15" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.32"
        filter="url(#av-neon-glow)"
      />

      {/* 2. Main Continuous 3D Neon Glass Infinity Tube */}
      <path 
        d={fullInfinityPath} 
        stroke="url(#av-infinity-tube-grad)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* 3. 3D Overlapping Strand at Center Crossing */}
      <path 
        d={crossoverOverlayStrand} 
        stroke="url(#av-infinity-tube-grad)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        filter="url(#av-crossover-shadow)" 
      />

      {/* 4. Top Specular Glass Reflection Sheen */}
      <path 
        d={fullInfinityPath} 
        stroke="url(#av-infinity-sheen)" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.75" 
      />

      {/* ========================================================================= */}
      {/* --- INSIDE LEFT LOOP: DYNAMIC MUSIC STREAMING EQUALIZER (NON-PYRAMID) --- */}
      {/* ========================================================================= */}
      <g filter="url(#av-neon-glow)">
        {/* Dynamic streaming music spectrum bars with rhythm and realistic audio envelope */}
        <rect x="41.0" y="43.0" width="2.4" height="14" rx="1.2" fill="url(#av-soundwave-grad)" />
        <rect x="46.0" y="36.0" width="2.5" height="28" rx="1.25" fill="url(#av-soundwave-grad)" />
        <rect x="51.0" y="41.0" width="2.4" height="18" rx="1.2" fill="url(#av-soundwave-grad)" />
        
        {/* Center Peak Streaming Bar (Bright Luminous Cyan Core) */}
        <rect x="56.0" y="33.0" width="2.6" height="34" rx="1.3" fill="#00f5ff" />
        
        <rect x="61.0" y="38.0" width="2.5" height="24" rx="1.25" fill="url(#av-soundwave-grad)" />
        <rect x="66.0" y="42.0" width="2.4" height="16" rx="1.2" fill="url(#av-soundwave-grad)" />
        <rect x="71.0" y="37.0" width="2.5" height="26" rx="1.25" fill="url(#av-soundwave-grad)" />
      </g>

      {/* ========================================================================= */}
      {/* --- INSIDE RIGHT LOOP: CLEAN ROUNDED NEON PLAY TRIANGLE --- */}
      {/* ========================================================================= */}
      <g filter="url(#av-neon-glow)">
        {/* Play Triangle with smooth rounded vertices (Centered at x=124, y=50) */}
        <polygon 
          points="116,39 135,50 116,61" 
          fill="url(#av-play-triangle-grad)" 
          stroke="#fda4af" 
          strokeWidth="1.2" 
          strokeLinejoin="round" 
          strokeLinecap="round" 
        />
        {/* Inner Specular Inset Highlight */}
        <polygon 
          points="118,42 130,50 118,58" 
          fill="#ffffff" 
          opacity="0.25" 
        />
        {/* Subtle Starlight Sparkle */}
        <circle cx="121" cy="48" r="1.1" fill="#ffffff" opacity="0.9" />
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

  // Stacked Full Badge (Exact poster layout)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center bg-black rounded-3xl select-none ${className}`}>
        {/* 3D Glowing Infinity Symbol */}
        <InfinitySymbolSVG iconClass="w-48 sm:w-56 h-auto" />
        
        {/* Primary Wordmark with stylized apex A: Λ U D I O V I D O */}
        <div className="mt-5 flex items-center justify-center text-white font-black tracking-[0.24em] text-xl sm:text-3xl font-sans drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
          <span>Λ U D I O V I D O</span>
        </div>

        {/* Subtitle: M U S I C   &   M O V I E S */}
        <div className="mt-2 flex items-center justify-center gap-2.5 text-[10px] sm:text-xs font-bold font-sans tracking-[0.28em] uppercase">
          <span className="text-[#00e5ff]">M U S I C</span>
          <span className="text-[#ec4899]">&</span>
          <span className="text-[#f97316]">M O V I E S</span>
        </div>

        {/* Subtitle: FREE FOREVER with colorful accent hairlines */}
        <div className="mt-2 flex items-center justify-center gap-2.5 w-full max-w-[220px]">
          <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#00e5ff] to-[#00e5ff]" />
          <span className="text-[8px] sm:text-[9.5px] font-mono font-bold tracking-[0.26em] text-slate-200">
            FREE FOREVER
          </span>
          <span className="h-[1.5px] flex-1 bg-gradient-to-r from-[#ec4899] via-[#ec4899] to-transparent" />
        </div>
      </div>
    );
  }

  // Default: Horizontal Lockup (Pristine for Header Bar - Perfect Symmetry & Optical Alignment)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${heights[size]} ${className}`}>
      {/* 3D Glowing Infinity Symbol */}
      <InfinitySymbolSVG iconClass="h-full w-auto" />

      {/* Primary Wordmark with stylized apex A: ΛUDIOVIDO */}
      <div className="flex items-center text-white font-black tracking-[0.22em] text-[13.5px] sm:text-[15.5px] font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-none select-none">
        <span>ΛUDIOVIDO</span>
      </div>
    </div>
  );
};
export default AudioVidoBrandLogo;
