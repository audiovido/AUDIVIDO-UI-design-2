/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, Music, Film, Users, Folder, Settings, Calendar,
  Play, Pause, SkipBack, SkipForward, Sliders, LogIn, Lock, Mail,
  User, Sparkles, CheckCircle2, ArrowRight, X, Key, ShieldCheck, Eye, EyeOff
} from 'lucide-react';
import { Track } from '../data/auraStore';

interface SignInAuraNodesViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  trackProgress: number;
  handleSeek: (percent: number) => void;
  onNavigateWorld: (world: string) => void;
}

export const SignInAuraNodesView: React.FC<SignInAuraNodesViewProps> = ({
  currentTrack,
  isPlaying,
  setIsPlaying,
  trackProgress,
  handleSeek,
  onNavigateWorld
}) => {
  // Navigation & Active Node Mode
  const [activeSidebarNav, setActiveSidebarNav] = useState<'home' | 'discover' | 'music' | 'movies' | 'social' | 'library' | 'settings'>('home');
  const [selectedNode, setSelectedNode] = useState<'music' | 'video' | 'community' | null>(null);

  // Sign In Form States
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; avatar: string } | null>(null);

  // Live Time clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('11:15');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Sign In submit handler
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      setIsAuthenticated(true);
      const nameFromEmail = email.split('@')[0];
      const capitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      setUserProfile({
        name: capitalized,
        email: email.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      });
      showToast(`Welcome back, ${capitalized}! Access granted to AURA NODES.`);
    }, 800);
  };

  // Quick One-Click Google Auth Simulator
  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      setIsAuthenticated(true);
      setUserProfile({
        name: 'Arman Shokri',
        email: 'arm.shokri@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      });
      showToast('Successfully authenticated via Google Workspace OAuth!');
    }, 600);
  };

  const communityMembers = [
    { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
    { name: 'Liam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { name: 'Selson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
    { name: 'Edge', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' }
  ];

  return (
    <div className="relative w-full min-h-[calc(100vh-5.5rem)] flex items-center justify-center p-2 sm:p-4 select-none overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-slate-900/95 text-white border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 flex items-center gap-3 animate-fadeIn backdrop-blur-2xl">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. METALLIC CHARCOAL / SLATE BACKDROP WITH GLOWING CONSTELLATION NETWORK */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        {/* Subtle Metallic Grain & Glow */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2600&auto=format&fit=crop')` }}
        />

        {/* Ambient Node Glowing Orbs in Background */}
        <div className="absolute left-[20%] top-[30%] w-[500px] h-[500px] bg-rose-500/10 rounded-full pointer-events-none blur-3xl animate-pulse" />
        <div className="absolute right-[20%] top-[30%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full pointer-events-none blur-3xl animate-pulse" />
        <div className="absolute left-[38%] bottom-[15%] w-[450px] h-[450px] bg-purple-500/15 rounded-full pointer-events-none blur-3xl" />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/80 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN TABLET / DESKTOP DASHBOARD CONTAINER                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1550px] min-h-[820px] h-[calc(100vh-6.5rem)] bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-[36px] shadow-[0_30px_80px_rgba(0,0,0,0.85)] flex overflow-hidden text-white">
        
        {/* --- LEFT VERTICAL NAVIGATION SIDEBAR (EXACT MATCH TO REF) --- */}
        <aside className="w-[100px] sm:w-[110px] bg-slate-950/60 border-r border-white/10 flex flex-col items-center justify-between py-6 shrink-0 z-20">
          
          {/* Top Logo Mark */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center cursor-pointer">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
          </div>

          {/* Navigation Items Stack */}
          <div className="space-y-4 w-full px-2">
            {[
              { id: 'home', label: 'HOME', icon: Home },
              { id: 'discover', label: 'DISCOVER', icon: Compass },
              { id: 'music', label: 'MUSIC', icon: Music },
              { id: 'movies', label: 'MOVIES', icon: Film },
              { id: 'social', label: 'SOCIAL CLUB', icon: Users },
              { id: 'library', label: 'LIBRARY', icon: Folder },
              { id: 'settings', label: 'SETTINGS', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSidebarNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSidebarNav(item.id as any);
                    if (item.id === 'music') onNavigateWorld('music');
                    else if (item.id === 'movies') onNavigateWorld('movie');
                    else if (item.id === 'social') onNavigateWorld('community');
                    showToast(`Navigated to ${item.label}`);
                  }}
                  className={`w-full flex flex-col items-center gap-1 py-2 rounded-2xl transition-all cursor-pointer group ${
                    isActive 
                      ? 'bg-white/15 text-cyan-300 font-bold border-l-2 border-cyan-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span className="text-[8.5px] font-bold tracking-wider uppercase text-center">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Lock / Sign In Status Badge */}
          <div className="flex flex-col items-center gap-1">
            <div className={`p-2 rounded-full border transition-all ${isAuthenticated ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'}`}>
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-[8px] font-mono uppercase text-slate-400">
              {isAuthenticated ? 'AUTH OK' : 'LOCKED'}
            </span>
          </div>

        </aside>

        {/* --- MAIN CENTER & RIGHT CANVAS --- */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden">
          
          {/* TOP BAR: AURA NODES Title & Date */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10">
            <div className="w-[120px]" />

            {/* Title: AURA NODES */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-light tracking-[0.25em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                AURA NODES
              </h1>
            </div>

            {/* Date Widget */}
            <div className="w-[120px] flex items-center justify-end gap-2 text-slate-300 font-mono text-xs sm:text-sm">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Nov 11</span>
            </div>
          </div>

          {/* SVG Glowing Constellation Network Lines connecting the 3 Nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line-glow-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="line-glow-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Interconnecting Network Waves */}
            <path d="M 300 220 Q 500 120, 700 220" fill="none" stroke="url(#line-glow-cyan)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
            <path d="M 300 220 Q 400 380, 500 420" fill="none" stroke="url(#line-glow-pink)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 700 220 Q 600 380, 500 420" fill="none" stroke="url(#line-glow-cyan)" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Fine Constellation Particles */}
            {Array.from({ length: 18 }).map((_, i) => (
              <circle
                key={i}
                cx={200 + (i * 35)}
                cy={150 + Math.sin(i * 0.8) * 60}
                r={1.5 + (i % 3)}
                fill="#38BDF8"
                opacity={0.3 + (i % 5) * 0.15}
              />
            ))}
          </svg>

          {/* ===================================================================== */}
          {/* 3. THREE MAIN CIRCULAR PORTAL NODE ORBS (MUSIC, VIDEO, COMMUNITY)      */}
          {/* ===================================================================== */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center">
            
            {/* --- LEFT NODE ORB: MUSIC --- */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div 
                onClick={() => {
                  setSelectedNode('music');
                  onNavigateWorld('music');
                  showToast('Entering Music World Node');
                }}
                className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-pink-400 to-purple-500 shadow-[0_0_35px_rgba(244,63,94,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Node Image Backdrop */}
                <div 
                  className="w-full h-full rounded-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 flex flex-col items-center justify-center p-6 text-center relative"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60 rounded-full" />
                  
                  {/* Text Overlay */}
                  <div className="relative z-10 space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase drop-shadow-md">
                      MUSIC
                    </h2>
                    <h3 className="text-xs font-bold text-rose-300">Nova Sounds</h3>
                    <p className="text-[10px] text-slate-300 font-light leading-tight">
                      Re-localized data and analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- CENTER BOTTOM NODE ORB: COMMUNITY --- */}
            <div className="md:col-span-4 flex flex-col items-center justify-end pt-8 md:pt-16">
              <div 
                onClick={() => {
                  setSelectedNode('community');
                  onNavigateWorld('community');
                  showToast('Entering Community Hub Node');
                }}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-indigo-400 to-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Vortex Cosmic Background */}
                <div 
                  className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-radial-vortex opacity-80 animate-spin-slow" />
                  
                  <div className="relative z-10 space-y-2 w-full">
                    <h2 className="text-base sm:text-lg font-black tracking-widest text-white uppercase drop-shadow-md">
                      COMMUNITY
                    </h2>

                    {/* Member Avatars Ring Around Orbs */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {communityMembers.map((m, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border border-white/30 shadow-md" />
                          <span className="text-[8px] font-mono text-slate-300">{m.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Central Play Orb Capsule */}
                    <div className="pt-2 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[1.5px] shadow-[0_0_15px_#22d3ee] flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-300">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-300 mt-1 block">Aura Flow Hub</span>
                      <span className="text-[9px] text-slate-400 font-mono">Central Player • Re-Localized</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT NODE ORB: VIDEO --- */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div 
                onClick={() => {
                  setSelectedNode('video');
                  onNavigateWorld('movie');
                  showToast('Entering Video Cinema Node');
                }}
                className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-sky-400 to-blue-600 shadow-[0_0_35px_rgba(34,211,238,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Node Image Backdrop */}
                <div 
                  className="w-full h-full rounded-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 flex flex-col items-center justify-center p-6 text-center relative"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60 rounded-full" />
                  
                  {/* Text Overlay */}
                  <div className="relative z-10 space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase drop-shadow-md">
                      VIDEO
                    </h2>
                    <h3 className="text-xs font-bold text-cyan-300">Digital Nomads</h3>
                    <p className="text-[10px] text-slate-300 font-light leading-tight">
                      Clean English content and analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. OVERLAY / FLOATING SIGN IN AUTHENTICATION CARD                    */}
          {/* ===================================================================== */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-md p-2">
            <div className="bg-slate-950/90 backdrop-blur-2xl border border-cyan-400/40 rounded-[32px] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.2)] text-white space-y-5 animate-fadeIn">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wider">AURA SIGN IN</h3>
                    <span className="text-[10px] font-mono text-cyan-300/80 block">AUTHENTICATE ACCESS</span>
                  </div>
                </div>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/40">
                    LOGGED IN
                  </span>
                )}
              </div>

              {isAuthenticated && userProfile ? (
                /* Authenticated User Status Card */
                <div className="space-y-4 text-center py-2">
                  <div className="relative w-16 h-16 rounded-full mx-auto border-2 border-cyan-400 overflow-hidden shadow-[0_0_15px_#22d3ee]">
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{userProfile.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">{userProfile.email}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-emerald-300 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Aura Lossless Audio & 4K Cinema Unlocked</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setUserProfile(null);
                      showToast('Signed out of Aura Nodes');
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-300 text-xs font-bold border border-white/15 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                /* Interactive Sign In Form */
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. arm.shokri@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Security Password
                      </label>
                      <button 
                        type="button" 
                        onClick={() => showToast('Password reset link dispatched')}
                        className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-white/10 border-white/20 text-cyan-400 focus:ring-0" 
                      />
                      <span className="text-[11px]">Remember on this device</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSigningIn ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>VERIFYING CREDENTIALS...</span>
                      </>
                    ) : (
                      <>
                        <span>SIGN IN TO AURA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Google OAuth Quick Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign In with Google</span>
                  </button>

                </form>
              )}

            </div>
          </div>

          {/* ===================================================================== */}
          {/* 5. BOTTOM MASTER FLOATING CONTROL DOCK (EXACT MATCH TO REF)          */}
          {/* ===================================================================== */}
          <div className="relative z-10 w-full max-w-xl mx-auto bg-slate-950/80 backdrop-blur-2xl border border-white/15 rounded-full p-2.5 px-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-between">
            
            {/* Control Buttons */}
            <div className="flex items-center gap-4 mx-auto">
              {/* Play / Stop Mini */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>

              {/* Prev */}
              <button className="p-2 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer">
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              {/* Master Glowing Play/Pause Circle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-400 to-purple-500 p-[1.5px] shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-300">
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </div>
              </button>

              {/* Next */}
              <button className="p-2 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer">
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              {/* DSP Equalizer / Settings */}
              <button className="p-2 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer">
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Right Clock */}
            <div className="text-xs font-mono text-slate-300 font-bold pr-2">
              {currentTimeStr}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
