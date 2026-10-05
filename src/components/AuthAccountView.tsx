/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, CheckCircle2, ShieldCheck, Mail, Key, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { SignUpLandingView } from './SignUpLandingView';
import { SignInAuraNodesView } from './SignInAuraNodesView';
import { Track } from '../data/auraStore';

interface AuthAccountViewProps {
  initialMode?: 'signin' | 'signup';
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  trackProgress: number;
  handleSeek: (percent: number) => void;
  onNavigateWorld: (world: string) => void;
}

export const AuthAccountView: React.FC<AuthAccountViewProps> = ({
  initialMode = 'signin',
  currentTrack,
  isPlaying,
  setIsPlaying,
  trackProgress,
  handleSeek,
  onNavigateWorld
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>(initialMode);

  return (
    <div className="w-full min-h-[calc(100dvh-5.5rem)] flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 select-none overflow-x-hidden">
      
      {/* Top Consolidated Mode Switcher Capsule */}
      <div className="sticky top-2 z-40 my-2 p-1.5 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl flex items-center gap-2 max-w-xs sm:max-w-sm w-full">
        
        {/* Sign In Button Tab */}
        <button
          onClick={() => setAuthTab('signin')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            authTab === 'signin'
              ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.6)] scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <LogIn className="w-4 h-4 shrink-0" />
          <span>SIGN IN</span>
        </button>

        {/* Sign Up Button Tab */}
        <button
          onClick={() => setAuthTab('signup')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            authTab === 'signup'
              ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>SIGN UP</span>
        </button>

      </div>

      {/* Render Active View Container */}
      <div className="w-full flex-1 flex items-center justify-center">
        {authTab === 'signin' ? (
          <SignInAuraNodesView 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            trackProgress={trackProgress}
            handleSeek={handleSeek}
            onNavigateWorld={onNavigateWorld}
          />
        ) : (
          <SignUpLandingView 
            onNavigateMusic={() => onNavigateWorld('music2')}
            onNavigatePortal={() => onNavigateWorld('portal')}
          />
        )}
      </div>

    </div>
  );
};
