import React, { useEffect, useRef } from 'react';

/**
 * CelestialCloudVortex: An ethereal, organic, cloudy aurora tornado/vortex
 * rising through the center of the three liquid glass orbs.
 * Crafted with pure cloudy mists, zero sharp lines or edges, high atmospheric blur,
 * rich emerald-green and cosmic-violet aurora tones, and gentle spiraling particle dust.
 */
export const CelestialCloudVortex: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 700);
    let height = (canvas.height = 550);

    // Dynamic mist particles ascending in a soft funnel spiral
    interface MistParticle {
      angle: number;
      radius: number;
      y: number;
      speedY: number;
      speedAngle: number;
      size: number;
      color: string;
      alpha: number;
      maxAlpha: number;
    }

    const colors = [
      'rgba(16, 185, 129,',   // Rich Emerald Green
      'rgba(52, 211, 153,',   // Pale Seafoam Green
      'rgba(168, 85, 247,',   // Cosmic Violet
      'rgba(192, 132, 252,',  // Bright Lilac
      'rgba(56, 189, 248,',   // Ice Sky Blue
      'rgba(244, 114, 182,'   // Aurora Fuchsia Pink
    ];

    const particles: MistParticle[] = [];
    const PARTICLE_COUNT = 38;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = Math.random() * height;
      // Funnel shape: narrow at bottom (y ~ 440), wide at top (y ~ 80)
      const progress = 1 - Math.max(0, Math.min(1, y / height));
      const baseRadius = 25 + progress * 160;

      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: baseRadius * (0.6 + Math.random() * 0.8),
        y,
        speedY: 0.35 + Math.random() * 0.45,
        speedAngle: (0.008 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : 1),
        size: 14 + Math.random() * 32, // Soft large puffs of mist
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
        maxAlpha: 0.08 + Math.random() * 0.12 // Very gentle, sheer opacity
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      // Draw each ascending mist particle with high feathering
      particles.forEach(p => {
        p.y -= p.speedY;
        p.angle += p.speedAngle;

        // Reset to bottom if it rises above the viewport
        if (p.y < 30) {
          p.y = height - 40;
          p.angle = Math.random() * Math.PI * 2;
        }

        // Calculate funnel radius based on height (narrow at bottom, opening wide at top)
        const progress = 1 - Math.max(0, Math.min(1, p.y / height));
        const targetRadius = 30 + Math.pow(progress, 1.4) * 190;
        
        // Gentle wave modulation
        const currentRadius = targetRadius + Math.sin(time * 2 + p.y * 0.02) * 15;

        // Centered around the vortex axis (x: 350)
        const centerX = 350 + Math.sin(p.y * 0.008 + time) * 18;
        const x = centerX + Math.cos(p.angle) * currentRadius;
        const y = p.y;

        // Fade in from bottom, peak in middle, fade out at top
        const fade = Math.sin(Math.min(Math.PI, Math.max(0, (y / height) * Math.PI)));
        const finalAlpha = p.maxAlpha * fade;

        if (finalAlpha > 0.005) {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size);
          grad.addColorStop(0, `${p.color} ${finalAlpha})`);
          grad.addColorStop(0.5, `${p.color} ${finalAlpha * 0.4})`);
          grad.addColorStop(1, `${p.color} 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-visible flex items-center justify-center">
      {/* 1. Large Procedural Atmospheric Nebula Clouds (Layer 1 - Deep Violet & Magenta Base Flow) */}
      <div 
        className="absolute w-[440px] h-[480px] rounded-full opacity-60 mix-blend-screen filter blur-[55px] animate-vortex-swirl-slow"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(147, 51, 234, 0.45) 0%, rgba(168, 85, 247, 0.3) 35%, rgba(192, 132, 252, 0.15) 60%, transparent 80%)',
          transformOrigin: '50% 65%'
        }}
      />

      {/* 2. Large Procedural Atmospheric Nebula Clouds (Layer 2 - Vibrant Emerald Green Aurora Arm) */}
      <div 
        className="absolute w-[460px] h-[500px] rounded-full opacity-55 mix-blend-screen filter blur-[60px] animate-vortex-swirl-reverse"
        style={{
          background: 'radial-gradient(ellipse at 42% 45%, rgba(16, 185, 129, 0.5) 0%, rgba(52, 211, 153, 0.35) 35%, rgba(5, 150, 105, 0.18) 65%, transparent 80%)',
          transformOrigin: '45% 55%'
        }}
      />

      {/* 3. Central Upward Spiraling Funnel (Layer 3 - Luminous Cyan, Ice Blue & Starlight Core) */}
      <div 
        className="absolute w-[360px] h-[520px] opacity-65 mix-blend-screen filter blur-[45px] animate-vortex-pulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, rgba(56, 189, 248, 0.4) 0%, rgba(125, 211, 252, 0.25) 30%, rgba(167, 243, 208, 0.2) 55%, transparent 75%)',
          transformOrigin: '50% 70%'
        }}
      />

      {/* 4. Fine Organic Cloud Tendrils (SVG Nebula Whirls with Infinite Smooth Rotation) */}
      <svg 
        viewBox="0 0 700 550" 
        className="absolute inset-0 w-full h-full mix-blend-screen opacity-70 filter blur-[28px]"
      >
        <defs>
          {/* Emerald Aurora Mist Gradient */}
          <linearGradient id="vortex-emerald-stream" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0" />
            <stop offset="30%" stopColor="#10B981" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#6EE7B7" stopOpacity="0.6" />
            <stop offset="90%" stopColor="#A7F3D0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Cosmic Violet Mist Gradient */}
          <linearGradient id="vortex-violet-stream" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#581C87" stopOpacity="0" />
            <stop offset="35%" stopColor="#9333EA" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#C084FC" stopOpacity="0.55" />
            <stop offset="90%" stopColor="#E9D5FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Ice Blue Core Swirl Gradient */}
          <linearGradient id="vortex-cyan-stream" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0" />
            <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#BAE6FD" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Cloudy Aurora Swirling Plumes Rising Upward and Fan-Opening Between the 3 Orbs */}
        <g className="animate-vortex-swirl-slow" style={{ transformOrigin: '350px 320px' }}>
          {/* Emerald Tendril reaching towards Audio (Top-Left) */}
          <path 
            d="M 350 430 C 330 360, 240 280, 210 180 C 190 120, 260 70, 310 90 C 350 110, 300 210, 350 280 Z" 
            fill="url(#vortex-emerald-stream)" 
          />

          {/* Cosmic Violet Tendril reaching towards Video (Top-Right) */}
          <path 
            d="M 350 430 C 370 360, 460 280, 490 180 C 510 120, 440 70, 390 90 C 350 110, 400 210, 350 280 Z" 
            fill="url(#vortex-violet-stream)" 
          />

          {/* Central Ice Blue Core Funnel */}
          <path 
            d="M 335 450 C 335 370, 310 260, 350 140 C 390 260, 365 370, 365 450 Z" 
            fill="url(#vortex-cyan-stream)" 
          />
        </g>

        {/* Counter-swirling Sheer Cloud Layer for Volumetric Depth */}
        <g className="animate-vortex-swirl-reverse opacity-75" style={{ transformOrigin: '350px 310px' }}>
          <path 
            d="M 350 400 C 390 340, 430 250, 400 160 C 370 90, 330 90, 300 160 C 270 250, 310 340, 350 400 Z" 
            fill="url(#vortex-violet-stream)" 
          />
          <path 
            d="M 340 420 C 290 350, 260 220, 350 130 C 440 220, 410 350, 360 420 Z" 
            fill="url(#vortex-emerald-stream)" 
          />
        </g>
      </svg>

      {/* 5. Canvas with Micro Mist Puffs & Ethereal Spiral Ascents */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none filter blur-[12px]"
      />
    </div>
  );
};
