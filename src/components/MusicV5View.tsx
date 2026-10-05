/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, Play, Film, MessageSquare, Bot, Monitor, Smartphone, Tablet, 
  Sparkles, Layers, ArrowRight, Heart, Volume2, Flame, User, Radio, Disc, 
  Tv, Eye, Check, ExternalLink, RefreshCw, X, Send, Sliders
} from 'lucide-react';
import { Track } from '../data/auraStore';

interface MusicV5ViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  trackProgress: number;
  currentTrackSeconds: number;
  audioDuration: number;
  handleSeek: (percent: number) => void;
  likedTracks: Record<string, boolean>;
  toggleLikeTrack: (id: string) => void;
  allTracks: Track[];
  onSelectTrack: (track: Track) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onNavigateWorld?: (world: string) => void;
}

export const MusicV5View: React.FC<MusicV5ViewProps> = ({
  currentTrack,
  isPlaying,
  setIsPlaying,
  trackProgress,
  handleSeek,
  likedTracks,
  toggleLikeTrack,
  allTracks,
  onSelectTrack,
  onNavigateWorld
}) => {
  // Active Scenario Tab inside Music 5:
  // 1. 'welcome': Welcome Experience & AURA AI Companion
  // 2. 'music-house': Music World - The Listening House
  // 3. 'cinema-house': Movie World - The Home Cinema
  // 4. 'responsive-suite': Responsive Device Suite (Mobile / iPad / MacBook)
  const [activeScenario, setActiveScenario] = useState<'welcome' | 'music-house' | 'cinema-house' | 'responsive-suite'>('welcome');

  // Sub-device selector for Responsive Suite
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'ipad' | 'macbook'>('macbook');
  const [deviceRealm, setDeviceRealm] = useState<'music' | 'movie'>('music');

  // AURA AI interactive prompt state
  const [aiMessage, setAiMessage] = useState<string>('Welcome to AudioVido. Where do you want to go tonight?');
  const [aiInput, setAiInput] = useState<string>('');

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAiAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const query = aiInput.trim();
    setAiInput('');
    setAiMessage(`AURA AI: Analyzing your vibe for "${query}"... Tuning into cozy acoustic harmonics.`);
    showToast(`AURA AI Recommendation activated for "${query}"`);
  };

  // Track fallbacks
  const activeTitle = currentTrack?.title || 'Coffee Bars & Warm Cabin';
  const activeArtist = currentTrack?.artist || 'Aura Ensemble';
  const activeCover = (currentTrack as any)?.coverUrl || currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop';

  return (
    <div className="relative w-full min-h-[calc(100vh-5.5rem)] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-black/90 text-white border border-blue-400/50 shadow-2xl shadow-blue-500/20 flex items-center gap-2.5 animate-fadeIn backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Outer Dark Marble & Charcoal Atmospheric Background (Matches Reference Canvas) */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2600&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1550px] min-h-[820px] h-[calc(100vh-6.5rem)] flex flex-col justify-between p-3 sm:p-5 text-white">
        
        {/* --- TOP SCENARIO NAVIGATION BAR (Matches Reference Board Columns) --- */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-2 sm:px-6 pt-1 pb-3 border-b border-white/10">
          
          {/* Brand Logo & Music 5 Badge */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-8 flex items-center justify-center shrink-0">
              <div className="absolute left-0 top-0 w-5 h-7 bg-blue-600 rounded transform -skew-x-12 -rotate-3" />
              <div className="absolute left-2 top-0 w-5 h-7 bg-cyan-400 rounded transform -skew-x-12 rotate-3" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wider uppercase">AUDIOVIDO</h2>
              <span className="text-[10px] font-mono text-cyan-300 block">MUSIC 5 ECOSYSTEM</span>
            </div>
          </div>

          {/* Scenario Tabs Bar */}
          <nav className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 gap-1 overflow-x-auto">
            
            {/* 1. Welcome Experience */}
            <button
              onClick={() => setActiveScenario('welcome')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeScenario === 'welcome' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-300/40' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-300" />
              <span>1. WELCOME & AI</span>
            </button>

            {/* 2. Music World */}
            <button
              onClick={() => setActiveScenario('music-house')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeScenario === 'music-house' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md border border-amber-200/40' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-amber-300" />
              <span>2. MUSIC WORLD</span>
            </button>

            {/* 3. Movie World */}
            <button
              onClick={() => setActiveScenario('cinema-house')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeScenario === 'cinema-house' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md border border-pink-300/40' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-pink-300" />
              <span>3. MOVIE WORLD</span>
            </button>

            {/* 4. Responsive Device Suite */}
            <button
              onClick={() => setActiveScenario('responsive-suite')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeScenario === 'responsive-suite' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md border border-emerald-200/40' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-300" />
              <span>4. RESPONSIVE SUITE</span>
            </button>

          </nav>

        </header>

        {/* --- SCENARIO CONTENT CANVAS --- */}
        <div className="flex-1 my-3 overflow-hidden flex flex-col items-center justify-center">
          
          {/* ===================================================================== */}
          {/* SCENARIO 1: WELCOME EXPERIENCE & AURA AI COMPANION                   */}
          {/* ===================================================================== */}
          {activeScenario === 'welcome' && (
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-fadeIn">
              
              {/* Left Column: Welcome Banner & Dual Portal Launcher */}
              <div className="md:col-span-7 space-y-5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block mb-1">
                    WELCOME EXPERIENCE
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Welcome to AudioVido
                  </h1>
                  <p className="text-sm text-slate-400 font-light mt-1">
                    Your entertainment home for high-fidelity audio & 4K home cinema.
                  </p>
                </div>

                {/* Dual Portal Launcher (ENTER MUSIC | AURA | ENTER MOVIES) */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                    Two Clear Choices
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ENTER MUSIC */}
                    <button
                      onClick={() => setActiveScenario('music-house')}
                      className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-left transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Play className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <ArrowRight className="w-4 h-4 text-amber-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h4 className="text-sm font-extrabold text-white">ENTER MUSIC</h4>
                      <p className="text-[11px] text-amber-200/70 mt-0.5">The Listening House & Equalizer</p>
                    </button>

                    {/* ENTER MOVIES */}
                    <button
                      onClick={() => setActiveScenario('cinema-house')}
                      className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-pink-400/40 text-left transition-all cursor-pointer group shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Film className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                        <ArrowRight className="w-4 h-4 text-pink-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h4 className="text-sm font-extrabold text-white">ENTER MOVIES</h4>
                      <p className="text-[11px] text-pink-200/70 mt-0.5">The Home Cinema & 4K Trailers</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: AURA AI Companion Interactive Widget */}
              <div className="md:col-span-5 bg-gradient-to-b from-slate-900/90 to-blue-950/90 backdrop-blur-2xl border border-blue-400/40 rounded-[32px] p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_#38bdf8]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">AURA AI Companion</h3>
                    <span className="text-[10px] text-cyan-300 font-mono block">INTELLIGENT AUDIO ASSISTANT</span>
                  </div>
                </div>

                {/* AI Dialogue Bubble */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-200 leading-relaxed space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 block uppercase">AURA</span>
                  <p>{aiMessage}</p>
                </div>

                {/* AI Prompt Input */}
                <form onSubmit={handleAiAsk} className="space-y-2">
                  <div className="relative">
                    <input 
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask AURA for a mood, artist or movie..."
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-all"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Play Cozy Acoustic', 'Recommend Sci-Fi Movie', 'Set Fireplace Sound'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setAiInput(preset);
                          setAiMessage(`AURA AI: Selected "${preset}". Preparing custom streaming stream.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-[10.5px] text-white/70 hover:text-cyan-300 border border-white/10 transition-all cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* SCENARIO 2: MUSIC WORLD - THE LISTENING HOUSE                        */}
          {/* ===================================================================== */}
          {activeScenario === 'music-house' && (
            <div className="w-full max-w-5xl bg-black/45 backdrop-blur-2xl border border-amber-400/40 rounded-[34px] p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-amber-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">MUSIC WORLD: THE LISTENING HOUSE</h2>
                    <span className="text-xs text-amber-300/80 font-mono block">Acoustic Solitude & Hi-Fi Audio</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    showToast(isPlaying ? 'Audio paused' : `Playing ${activeTitle}`);
                  }}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {isPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'PAUSE STREAM' : 'PLAY COZY STREAM'}</span>
                </button>
              </div>

              {/* Music Player & Equalizer Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={activeCover} alt="Cover" className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{activeTitle}</h4>
                      <p className="text-xs text-white/60">{activeArtist}</p>
                      <span className="text-[10px] text-amber-300 font-mono">320kbps Lossless Stream</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${trackProgress}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-amber-300">MUSIC SOCIAL CLUB</h4>
                  <p className="text-xs text-slate-300">
                    Join live listening parties with friends in the cozy cabin room.
                  </p>
                  <button 
                    onClick={() => {
                      if (onNavigateWorld) onNavigateWorld('community');
                      showToast('Entering Music Social Club...');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-white border border-white/15 cursor-pointer"
                  >
                    Join Listening Party
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SCENARIO 3: MOVIE WORLD - THE HOME CINEMA                            */}
          {/* ===================================================================== */}
          {activeScenario === 'cinema-house' && (
            <div className="w-full max-w-5xl bg-black/45 backdrop-blur-2xl border border-pink-400/40 rounded-[34px] p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Film className="w-6 h-6 text-pink-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">MOVIE WORLD: THE HOME CINEMA</h2>
                    <span className="text-xs text-pink-300/80 font-mono block">4K HDR Cinema Theater</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (onNavigateWorld) onNavigateWorld('movie');
                    showToast('Opening 4K Cinema Theater...');
                  }}
                  className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Tv className="w-4 h-4" />
                  <span>OPEN CINEMA WORLD</span>
                </button>
              </div>

              {/* Movie Player Banner */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-4">
                <div className="w-20 h-24 rounded-xl bg-purple-900/60 overflow-hidden border border-white/20 shrink-0">
                  <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop" alt="Poster" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-pink-400 uppercase">FEATURED TRAILER</span>
                  <h3 className="text-base font-black text-white">The Last Horizon</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    In a futuristic sanctuary, humanity rediscovers loss, love, and resonance through ancient acoustics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SCENARIO 4: RESPONSIVE DEVICE SUITE (MOBILE / IPAD / MACBOOK)         */}
          {/* ===================================================================== */}
          {activeScenario === 'responsive-suite' && (
            <div className="w-full max-w-5xl bg-black/45 backdrop-blur-2xl border border-emerald-400/40 rounded-[34px] p-6 sm:p-8 shadow-2xl space-y-5 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white">RESPONSIVE DESIGN DEVICE SUITE</h2>
                  <span className="text-xs text-emerald-300/80 font-mono block">Multi-Device Preview Simulator</span>
                </div>

                {/* Device Selector */}
                <div className="flex items-center p-1 bg-white/10 rounded-2xl border border-white/15 gap-1">
                  <button
                    onClick={() => setDeviceMode('mobile')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      deviceMode === 'mobile' ? 'bg-emerald-500 text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                  <button
                    onClick={() => setDeviceMode('ipad')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      deviceMode === 'ipad' ? 'bg-emerald-500 text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>iPad</span>
                  </button>
                  <button
                    onClick={() => setDeviceMode('macbook')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      deviceMode === 'macbook' ? 'bg-emerald-500 text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>MacBook</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Screen Box */}
              <div className="flex items-center justify-center py-4">
                {deviceMode === 'mobile' && (
                  <div className="w-[280px] h-[520px] rounded-[36px] bg-slate-950 border-4 border-slate-700 p-3 shadow-2xl flex flex-col justify-between text-left space-y-3">
                    <div className="text-center pb-2 border-b border-white/10">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Mobile AudioVido</span>
                    </div>
                    <img src={activeCover} alt="Cover" className="w-full h-40 rounded-2xl object-cover" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{activeTitle}</h4>
                      <p className="text-[10px] text-slate-400">{activeArtist}</p>
                    </div>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
                    >
                      {isPlaying ? 'Pause' : 'Play Mobile Stream'}
                    </button>
                  </div>
                )}

                {deviceMode === 'ipad' && (
                  <div className="w-[480px] h-[340px] rounded-[28px] bg-slate-950 border-4 border-slate-700 p-4 shadow-2xl flex flex-col justify-between text-left">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-emerald-400">iPad Tablet Edition</span>
                      <span className="text-[10px] font-mono text-white/50">Fluid Touch Layout</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 my-2">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <h4 className="text-xs font-bold text-white">{activeTitle}</h4>
                        <p className="text-[10px] text-slate-400">{activeArtist}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <h4 className="text-xs font-bold text-emerald-300">Cozy Cabin Equalizer</h4>
                        <span className="text-[10px] text-slate-400">5-Band DSP Active</span>
                      </div>
                    </div>
                  </div>
                )}

                {deviceMode === 'macbook' && (
                  <div className="w-full max-w-2xl h-[340px] rounded-2xl bg-slate-950 border-2 border-slate-700 p-5 shadow-2xl flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-emerald-400">MacBook Pro Widescreen Studio</span>
                      <span className="text-[10px] font-mono text-white/50">4K Spatial Audio</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-white/5 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-cyan-400">MUSIC WORLD</span>
                        <p className="text-xs text-white">Listening House</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-pink-400">MOVIE WORLD</span>
                        <p className="text-xs text-white">4K Cinema Room</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-purple-400">SOCIAL CLUB</span>
                        <p className="text-xs text-white">Listening Parties</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
