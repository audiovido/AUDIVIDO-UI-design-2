import React from 'react';

interface StarData {
  top: string;
  left: string;
  size: number;
  type: 'faint' | 'micro' | 'diamond' | 'cyan' | 'gold' | 'rose' | 'alpha';
  delay: string;
  duration: string;
}

// 135 Ambient Deep-Space Celestial Stars (predominantly faint and muted in the background)
const CELESTIAL_STARS: StarData[] = [
  // Only 2 very subtle major stars (no harsh bloom)
  { top: '12%', left: '84%', size: 2.2, type: 'alpha', delay: '0.8s', duration: '5.2s' },
  { top: '78%', left: '16%', size: 2.0, type: 'alpha', delay: '2.1s', duration: '5.8s' },

  // Subtle core points (diminished brightness, small footprint)
  { top: '8%', left: '38%', size: 1.4, type: 'diamond', delay: '1.2s', duration: '5.0s' },
  { top: '24%', left: '72%', size: 1.3, type: 'diamond', delay: '2.5s', duration: '5.5s' },
  { top: '62%', left: '28%', size: 1.4, type: 'diamond', delay: '0.4s', duration: '4.8s' },
  { top: '86%', left: '68%', size: 1.3, type: 'diamond', delay: '3.1s', duration: '5.4s' },

  // Colored stellar hints (very soft and subtle)
  { top: '16%', left: '19%', size: 1.3, type: 'cyan', delay: '1.5s', duration: '5.6s' },
  { top: '44%', left: '88%', size: 1.3, type: 'cyan', delay: '3.0s', duration: '5.2s' },
  { top: '31%', left: '52%', size: 1.3, type: 'gold', delay: '0.6s', duration: '6.0s' },
  { top: '89%', left: '35%', size: 1.2, type: 'gold', delay: '2.8s', duration: '5.4s' },
  { top: '22%', left: '4%', size: 1.2, type: 'rose', delay: '1.8s', duration: '5.1s' },
  { top: '70%', left: '82%', size: 1.2, type: 'rose', delay: '2.3s', duration: '5.7s' },

  // Dense, Faint, Hazy Deep Space Background Stars (Small, blurred, sitting far behind)
  { top: '2%', left: '14%', size: 1.0, type: 'faint', delay: '0.2s', duration: '6.2s' },
  { top: '3%', left: '32%', size: 0.9, type: 'faint', delay: '1.7s', duration: '5.9s' },
  { top: '3%', left: '58%', size: 1.1, type: 'micro', delay: '2.4s', duration: '6.5s' },
  { top: '4%', left: '76%', size: 0.8, type: 'faint', delay: '0.9s', duration: '7.1s' },
  { top: '5%', left: '92%', size: 1.0, type: 'micro', delay: '3.3s', duration: '5.8s' },
  { top: '6%', left: '4%', size: 0.9, type: 'faint', delay: '1.1s', duration: '6.4s' },
  { top: '7%', left: '46%', size: 1.1, type: 'faint', delay: '2.0s', duration: '5.5s' },
  { top: '9%', left: '26%', size: 0.8, type: 'micro', delay: '0.5s', duration: '6.8s' },
  { top: '9%', left: '68%', size: 1.0, type: 'faint', delay: '3.6s', duration: '5.3s' },
  { top: '11%', left: '8%', size: 1.2, type: 'micro', delay: '1.4s', duration: '6.0s' },
  { top: '11%', left: '52%', size: 0.9, type: 'faint', delay: '2.7s', duration: '7.2s' },
  { top: '13%', left: '34%', size: 1.0, type: 'faint', delay: '0.8s', duration: '5.7s' },
  { top: '14%', left: '64%', size: 0.8, type: 'faint', delay: '3.1s', duration: '6.3s' },
  { top: '15%', left: '95%', size: 1.1, type: 'micro', delay: '1.9s', duration: '5.9s' },
  { top: '17%', left: '15%', size: 0.9, type: 'faint', delay: '0.3s', duration: '6.7s' },
  { top: '17%', left: '43%', size: 1.0, type: 'faint', delay: '2.5s', duration: '6.1s' },
  { top: '18%', left: '78%', size: 0.8, type: 'faint', delay: '3.8s', duration: '7.0s' },
  { top: '20%', left: '28%', size: 1.1, type: 'micro', delay: '1.2s', duration: '5.4s' },
  { top: '20%', left: '60%', size: 0.9, type: 'faint', delay: '2.9s', duration: '6.6s' },
  { top: '21%', left: '88%', size: 1.0, type: 'faint', delay: '0.7s', duration: '5.8s' },
  { top: '23%', left: '10%', size: 0.8, type: 'faint', delay: '3.4s', duration: '7.3s' },
  { top: '24%', left: '36%', size: 1.1, type: 'micro', delay: '1.6s', duration: '6.0s' },
  { top: '25%', left: '55%', size: 0.9, type: 'faint', delay: '2.2s', duration: '5.6s' },
  { top: '26%', left: '82%', size: 1.0, type: 'faint', delay: '0.4s', duration: '6.9s' },
  { top: '27%', left: '22%', size: 0.8, type: 'faint', delay: '3.7s', duration: '6.2s' },
  { top: '28%', left: '67%', size: 1.1, type: 'micro', delay: '1.8s', duration: '5.5s' },
  { top: '29%', left: '94%', size: 0.9, type: 'faint', delay: '2.6s', duration: '7.1s' },
  { top: '30%', left: '6%', size: 1.0, type: 'faint', delay: '0.9s', duration: '5.8s' },
  { top: '31%', left: '40%', size: 0.8, type: 'faint', delay: '3.2s', duration: '6.4s' },
  { top: '32%', left: '74%', size: 1.1, type: 'micro', delay: '1.3s', duration: '5.7s' },
  { top: '33%', left: '18%', size: 0.9, type: 'faint', delay: '2.8s', duration: '6.5s' },
  { top: '34%', left: '49%', size: 1.0, type: 'faint', delay: '0.6s', duration: '7.0s' },
  { top: '35%', left: '86%', size: 0.8, type: 'faint', delay: '3.9s', duration: '5.9s' },
  { top: '37%', left: '12%', size: 1.1, type: 'micro', delay: '1.5s', duration: '6.3s' },
  { top: '37%', left: '62%', size: 0.9, type: 'faint', delay: '2.1s', duration: '5.6s' },
  { top: '38%', left: '30%', size: 1.0, type: 'faint', delay: '0.5s', duration: '6.8s' },
  { top: '39%', left: '96%', size: 0.8, type: 'faint', delay: '3.5s', duration: '7.2s' },
  { top: '40%', left: '24%', size: 1.1, type: 'micro', delay: '1.7s', duration: '5.4s' },
  { top: '41%', left: '54%', size: 0.9, type: 'faint', delay: '2.4s', duration: '6.6s' },
  { top: '42%', left: '79%', size: 1.0, type: 'faint', delay: '0.8s', duration: '5.8s' },
  { top: '43%', left: '7%', size: 0.8, type: 'faint', delay: '3.0s', duration: '6.3s' },
  { top: '44%', left: '38%', size: 1.1, type: 'micro', delay: '1.1s', duration: '5.9s' },
  { top: '45%', left: '70%', size: 0.9, type: 'faint', delay: '2.7s', duration: '7.0s' },
  { top: '46%', left: '16%', size: 1.0, type: 'faint', delay: '0.3s', duration: '6.1s' },
  { top: '47%', left: '46%', size: 0.8, type: 'faint', delay: '3.6s', duration: '6.5s' },
  { top: '48%', left: '84%', size: 1.1, type: 'micro', delay: '1.9s', duration: '5.6s' },
  { top: '49%', left: '29%', size: 0.9, type: 'faint', delay: '2.3s', duration: '6.7s' },
  { top: '50%', left: '64%', size: 1.0, type: 'faint', delay: '0.7s', duration: '5.5s' },
  { top: '51%', left: '92%', size: 0.8, type: 'faint', delay: '3.3s', duration: '7.4s' },
  { top: '52%', left: '11%', size: 1.1, type: 'micro', delay: '1.4s', duration: '6.2s' },
  { top: '53%', left: '41%', size: 0.9, type: 'faint', delay: '2.6s', duration: '5.8s' },
  { top: '54%', left: '76%', size: 1.0, type: 'faint', delay: '0.4s', duration: '6.9s' },
  { top: '55%', left: '21%', size: 0.8, type: 'faint', delay: '3.8s', duration: '6.0s' },
  { top: '56%', left: '57%', size: 1.1, type: 'micro', delay: '1.6s', duration: '5.7s' },
  { top: '57%', left: '87%', size: 0.9, type: 'faint', delay: '2.9s', duration: '7.1s' },
  { top: '58%', left: '5%', size: 1.0, type: 'faint', delay: '0.9s', duration: '6.3s' },
  { top: '59%', left: '33%', size: 0.8, type: 'faint', delay: '3.1s', duration: '5.6s' },
  { top: '60%', left: '69%', size: 1.1, type: 'micro', delay: '1.2s', duration: '6.8s' },
  { top: '61%', left: '17%', size: 0.9, type: 'faint', delay: '2.5s', duration: '5.9s' },
  { top: '62%', left: '50%', size: 1.0, type: 'faint', delay: '0.6s', duration: '6.4s' },
  { top: '63%', left: '95%', size: 0.8, type: 'faint', delay: '3.7s', duration: '7.3s' },
  { top: '64%', left: '26%', size: 1.1, type: 'micro', delay: '1.8s', duration: '5.5s' },
  { top: '65%', left: '73%', size: 0.9, type: 'faint', delay: '2.2s', duration: '6.6s' },
  { top: '66%', left: '8%', size: 1.0, type: 'faint', delay: '0.5s', duration: '5.8s' },
  { top: '67%', left: '44%', size: 0.8, type: 'faint', delay: '3.4s', duration: '7.0s' },
  { top: '68%', left: '81%', size: 1.1, type: 'micro', delay: '1.5s', duration: '6.1s' },
  { top: '69%', left: '19%', size: 0.9, type: 'faint', delay: '2.8s', duration: '5.7s' },
  { top: '70%', left: '61%', size: 1.0, type: 'faint', delay: '0.8s', duration: '6.5s' },
  { top: '71%', left: '37%', size: 0.8, type: 'faint', delay: '3.6s', duration: '7.2s' },
  { top: '72%', left: '90%', size: 1.1, type: 'micro', delay: '1.3s', duration: '5.6s' },
  { top: '73%', left: '14%', size: 0.9, type: 'faint', delay: '2.4s', duration: '6.8s' },
  { top: '74%', left: '53%', size: 1.0, type: 'faint', delay: '0.7s', duration: '5.9s' },
  { top: '75%', left: '78%', size: 0.8, type: 'faint', delay: '3.2s', duration: '6.3s' },
  { top: '76%', left: '3%', size: 1.1, type: 'micro', delay: '1.7s', duration: '5.4s' },
  { top: '77%', left: '31%', size: 0.9, type: 'faint', delay: '2.9s', duration: '7.1s' },
  { top: '78%', left: '66%', size: 1.0, type: 'faint', delay: '0.4s', duration: '5.8s' },
  { top: '79%', left: '93%', size: 0.8, type: 'faint', delay: '3.8s', duration: '6.6s' },
  { top: '80%', left: '23%', size: 1.1, type: 'micro', delay: '1.1s', duration: '6.0s' },
  { top: '81%', left: '48%', size: 0.9, type: 'faint', delay: '2.6s', duration: '5.5s' },
  { top: '82%', left: '85%', size: 1.0, type: 'faint', delay: '0.9s', duration: '6.7s' },
  { top: '83%', left: '11%', size: 0.8, type: 'faint', delay: '3.5s', duration: '7.3s' },
  { top: '84%', left: '59%', size: 1.1, type: 'micro', delay: '1.6s', duration: '5.7s' },
  { top: '85%', left: '39%', size: 0.9, type: 'faint', delay: '2.3s', duration: '6.4s' },
  { top: '86%', left: '97%', size: 1.0, type: 'faint', delay: '0.6s', duration: '5.9s' },
  { top: '87%', left: '20%', size: 0.8, type: 'faint', delay: '3.7s', duration: '6.9s' },
  { top: '88%', left: '72%', size: 1.1, type: 'micro', delay: '1.4s', duration: '5.6s' },
  { top: '89%', left: '6%', size: 0.9, type: 'faint', delay: '2.7s', duration: '7.0s' },
  { top: '90%', left: '54%', size: 1.0, type: 'faint', delay: '0.8s', duration: '6.2s' },
  { top: '91%', left: '81%', size: 0.8, type: 'faint', delay: '3.3s', duration: '5.8s' },
  { top: '92%', left: '27%', size: 1.1, type: 'micro', delay: '1.8s', duration: '6.5s' },
  { top: '93%', left: '63%', size: 0.9, type: 'faint', delay: '2.5s', duration: '5.4s' },
  { top: '94%', left: '15%', size: 1.0, type: 'faint', delay: '0.5s', duration: '6.8s' },
  { top: '95%', left: '44%', size: 0.8, type: 'faint', delay: '3.9s', duration: '7.2s' },
  { top: '96%', left: '91%', size: 1.1, type: 'micro', delay: '1.2s', duration: '5.7s' },
  { top: '97%', left: '34%', size: 0.9, type: 'faint', delay: '2.8s', duration: '6.3s' },
  { top: '98%', left: '75%', size: 1.0, type: 'faint', delay: '0.7s', duration: '5.9s' }
];

export const CosmicNightSky: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      
      {/* 1. Deep Space Cosmic Nebular Dust Clouds */}
      <div className="aurora-cosmic-dust" />

      {/* 2. Multi-layered Wavy Aurora Borealis Polar Curtains */}
      <div className="aurora-curtain-green" />
      <div className="aurora-curtain-purple" />
      <div className="aurora-curtain-blue" />

      {/* 3. Rich Stellar Field - Predominantly Faint, Soft Deep-Background Stars */}
      {CELESTIAL_STARS.map((star, idx) => {
        if (star.type === 'alpha') {
          return (
            <div 
              key={`alpha-${idx}`}
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                top: star.top,
                left: star.left,
                animation: `sparkle-fast ${star.duration} ease-in-out infinite`,
                animationDelay: star.delay
              }}
            >
              {/* Subtle Core Star - Soft luminous ambient glow */}
              <div 
                className="rounded-full bg-white shadow-[0_0_6px_1.5px_rgba(255,255,255,0.65)]" 
                style={{ width: `${star.size}px`, height: `${star.size}px` }} 
              />
              <div 
                className="absolute rounded-full bg-white/20 blur-[2px] pointer-events-none" 
                style={{ width: `${star.size * 2.2}px`, height: `${star.size * 2.2}px` }} 
              />
            </div>
          );
        }

        let typeClass = 'sky-star';
        if (star.type === 'faint') typeClass = 'sky-star star-faint';
        else if (star.type === 'micro') typeClass = 'sky-star star-micro';
        else if (star.type === 'diamond') typeClass = 'sky-star star-diamond';
        else if (star.type === 'cyan') typeClass = 'sky-star star-cyan';
        else if (star.type === 'gold') typeClass = 'sky-star star-gold';
        else if (star.type === 'rose') typeClass = 'sky-star star-rose';

        return (
          <span 
            key={`star-${idx}`}
            className={typeClass}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          />
        );
      })}

      {/* 5. Ultra-fine Ethereal Shooting Stars - Swift 0.55s Transit, Soft & Edge-Free, Rare Passes */}
      {/* Meteor 1: Upper-Left Diagonal (42deg) - Fires softly at second 3 of 24s cycle */}
      <div 
        className="absolute pointer-events-none z-0"
        style={{
          top: '7%',
          left: '14%',
          animation: 'meteor-ethereal-1 24s linear infinite',
          animationDelay: '3s',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="relative h-[0.75px] w-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.25) 65%, rgba(255, 255, 255, 0.75) 96%, transparent 100%)',
            filter: 'blur(0.6px)',
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.35)'
          }}
        />
      </div>

      {/* Meteor 2: Upper-Right Diagonal (138deg) - Fires softly at second 15 of 24s cycle */}
      <div 
        className="absolute pointer-events-none z-0"
        style={{
          top: '11%',
          left: '86%',
          animation: 'meteor-ethereal-2 24s linear infinite',
          animationDelay: '15s',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="relative h-[0.75px] w-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.25) 65%, rgba(255, 255, 255, 0.7) 96%, transparent 100%)',
            filter: 'blur(0.6px)',
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.3)'
          }}
        />
      </div>

    </div>
  );
};
