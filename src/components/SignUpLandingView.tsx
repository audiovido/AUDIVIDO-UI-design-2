/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Check, ArrowRight, Sparkles, Download, HelpCircle, 
  Layers, Music, Headphones, Volume2, ShieldCheck, Mail, Lock, User, 
  Apple, Laptop, Smartphone, Radio, Globe, Heart, Play
} from 'lucide-react';

interface SignUpLandingViewProps {
  onNavigateMusic?: () => void;
  onNavigatePortal?: () => void;
}

export const SignUpLandingView: React.FC<SignUpLandingViewProps> = ({
  onNavigateMusic,
  onNavigatePortal
}) => {
  // Modal states
  const [activeModal, setActiveModal] = useState<'signup' | 'download' | 'about' | 'support' | 'features' | null>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    genre: 'Lo-Fi & Chill'
  });
  const [signedInUser, setSignedInUser] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    const name = formData.fullName.trim() || formData.email.split('@')[0];
    setSignedInUser(name);
    setActiveModal(null);
    showToast(authMode === 'signup' ? `Welcome to AudioVido, ${name}! Your Hi-Fi account is active.` : `Welcome back, ${name}!`);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-6rem)] flex items-center justify-center py-6 px-2 sm:px-4 select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-950 text-white border border-blue-500/40 shadow-2xl shadow-blue-500/20 flex items-center gap-3 animate-fadeIn backdrop-blur-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Abstract Background with Geometric Elements & Fluid Line Art (Matches Dribbble Canvas) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-85">
        <svg viewBox="0 0 1200 800" className="w-full h-full max-w-7xl object-cover">
          {/* Subtle Grey Circles & Shapes */}
          <circle cx="120" cy="380" r="45" fill="#E2E8F0" opacity="0.6" />
          <circle cx="980" cy="220" r="28" fill="#CBD5E1" opacity="0.5" />
          <circle cx="1120" cy="580" r="70" fill="#E2E8F0" opacity="0.4" />
          <circle cx="180" cy="720" r="90" fill="#CBD5E1" opacity="0.35" />

          {/* Floating Dark Triangle Accents */}
          <polygon points="780,180 810,140 830,190" fill="#334155" opacity="0.8" />
          <polygon points="920,720 950,680 970,730" fill="#1E293B" opacity="0.85" />
          <polygon points="210,240 235,210 250,250" fill="#475569" opacity="0.6" />

          {/* Flowing Hand-drawn Sketch Lines */}
          <path d="M 80 180 C 180 80, 240 280, 160 360 C 90 430, 130 520, 260 500" fill="none" stroke="#64748B" strokeWidth="1.8" opacity="0.35" />
          <path d="M 850 120 C 920 180, 1020 80, 1080 160 C 1140 240, 1060 320, 1100 420" fill="none" stroke="#64748B" strokeWidth="1.8" opacity="0.35" />
          <path d="M 720 680 C 820 580, 940 760, 1060 690 C 1120 640, 1160 720, 1190 780" fill="none" stroke="#64748B" strokeWidth="1.8" opacity="0.35" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* THE ICONIC LARGE WHITE HERO CARD                                          */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-5xl bg-white text-slate-900 rounded-[32px] sm:rounded-[40px] shadow-[0_25px_80px_rgba(0,0,0,0.35),0_10px_25px_rgba(0,0,0,0.1)] border border-slate-100/90 overflow-hidden p-6 sm:p-10 md:p-14 z-10">
        
        {/* Top Floating User Badge if signed in */}
        {signedInUser && (
          <div className="mb-4 -mt-2 flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">Signed in as <span className="text-blue-600 font-extrabold">{signedInUser}</span></span>
            </div>
            <button 
              onClick={() => {
                setSignedInUser(null);
                showToast('Signed out successfully.');
              }}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* 1. TOP NAVIGATION BAR */}
        <header className="flex items-center justify-between gap-4 pb-6 sm:pb-10">
          
          {/* Brand Logo: Bespoke Double Tilted Blue Rectangles (Exact Dribbble Mark) */}
          <div 
            onClick={onNavigatePortal}
            className="flex items-center gap-3 cursor-pointer group"
            title="AudioVido Music Home"
          >
            <div className="relative w-11 h-10 flex items-center justify-center shrink-0">
              {/* Back Card (Deep Royal Blue) */}
              <div className="absolute left-1 top-1 w-6 h-8 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-950 rounded-[4px] shadow-sm transform -skew-x-12 -rotate-3 transition-transform group-hover:-translate-x-0.5" />
              {/* Front Card (Vibrant Electric Cobalt Cyan) */}
              <div className="absolute left-3.5 top-0 w-6 h-8 bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700 rounded-[4px] shadow-md border-t border-sky-200/50 transform -skew-x-12 rotate-3 transition-transform group-hover:translate-x-0.5" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-900 hidden sm:inline">
              AudioVido
            </span>
          </div>

          {/* Center Links */}
          <nav className="flex items-center gap-5 sm:gap-8 text-xs sm:text-sm font-medium text-slate-600">
            <button 
              onClick={() => setActiveModal('download')} 
              className="hover:text-blue-600 transition-colors cursor-pointer font-sans"
            >
              Download
            </button>
            <button 
              onClick={() => setActiveModal('about')} 
              className="hover:text-blue-600 transition-colors cursor-pointer font-sans"
            >
              About
            </button>
            <button 
              onClick={() => setActiveModal('support')} 
              className="hover:text-blue-600 transition-colors cursor-pointer font-sans"
            >
              Support
            </button>
            <button 
              onClick={() => setActiveModal('features')} 
              className="hover:text-blue-600 transition-colors cursor-pointer font-sans"
            >
              Features
            </button>
          </nav>

          {/* Top Right Black Pill Button */}
          <button 
            onClick={() => {
              setAuthMode('signup');
              setActiveModal('signup');
            }}
            className="px-6 sm:px-8 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs tracking-[0.16em] uppercase shadow-md transition-all cursor-pointer shrink-0"
          >
            SIGN UP
          </button>
        </header>

        {/* 2. HERO CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center pt-2 sm:pt-4">
          
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-sans">
                Discover<br />
                New Music
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-md font-sans">
              Music is a universal language. Musical expression should be just as widespread. We believe it should reach beyond skillset or budget.
            </p>

            <div>
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setActiveModal('signup');
                }}
                className="px-8 sm:px-10 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-xl transition-all cursor-pointer inline-flex items-center gap-3 group/btn"
              >
                <span>SIGN UP</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Explore Hint */}
            {onNavigateMusic && (
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>Already have an account?</span>
                <button 
                  onClick={onNavigateMusic} 
                  className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Stream in Music 2
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Stylized Bespoke Vector Character Listening to Music */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] flex items-center justify-center">
              
              <svg viewBox="0 0 600 450" className="w-full h-full filter drop-shadow-md">
                <defs>
                  {/* Reclining Legs & Pants Gradient */}
                  <linearGradient id="char-pants-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="60%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>

                  {/* Body Torso Gradient */}
                  <linearGradient id="char-torso-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>

                  {/* Cloud Smoke Gradient */}
                  <linearGradient id="cloud-smoke-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                  </linearGradient>

                  {/* iPod Player Body Gradient */}
                  <linearGradient id="ipod-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#93C5FD" />
                  </linearGradient>

                  {/* Dot Pattern for Shirt */}
                  <pattern id="shirt-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1.5" fill="#FFFFFF" opacity="0.9" />
                  </pattern>
                </defs>

                {/* 1. Background Floating Cloud Puffs (Left) */}
                <path d="M 60 270 C 50 240, 80 220, 105 235 C 125 210, 160 225, 160 250 C 180 255, 185 285, 165 295 C 175 320, 140 335, 120 320 C 95 340, 60 325, 65 295 Z" fill="#BFDBFE" opacity="0.75" />
                <path d="M 62 380 C 50 355, 80 340, 100 350 C 115 330, 150 340, 150 365 C 170 370, 175 395, 155 410 C 140 425, 110 420, 95 405 C 75 420, 50 405, 62 380 Z" fill="#93C5FD" opacity="0.85" />

                {/* 2. Reclining Character Legs (Geometric Blue Shapes) */}
                {/* Left Leg Bent Upwards */}
                <polygon points="20 375, 130 365, 230 290, 270 380, 240 390, 120 395, 20 390" fill="url(#char-pants-grad)" />
                {/* Right Leg Resting Flat */}
                <polygon points="120 370, 370 360, 440 385, 410 400, 100 400" fill="#1E40AF" />

                {/* Feet / Shoes */}
                <path d="M 12 375 L 30 375 L 38 395 L 8 395 Z" fill="#60A5FA" />

                {/* 3. Reclining Torso with Textured Blue Dotted Shirt */}
                <polygon points="310 370, 460 300, 420 220, 320 265" fill="url(#char-torso-grad)" />
                <polygon points="310 370, 460 300, 420 220, 320 265" fill="url(#shirt-dots)" />

                {/* Right Arm Reaching Down to Floor Support */}
                <polygon points="450 280, 480 370, 500 410, 485 415, 460 375, 435 295" fill="#3B82F6" />
                {/* Right Hand Support */}
                <path d="M 480 410 C 490 405, 515 415, 505 425 C 495 435, 475 425, 480 410 Z" fill="#2563EB" />

                {/* Left Arm Raised towards Head & Headphone */}
                <polygon points="345 255, 440 235, 455 250, 360 275" fill="#2563EB" />
                <polygon points="440 235, 455 250, 450 300, 435 295" fill="#3B82F6" />
                {/* Left Hand holding Headphone */}
                <path d="M 435 235 C 430 220, 450 215, 455 230 Z" fill="#1D4ED8" />

                {/* Character Head / Profile (Tilted Back in Musical Bliss) */}
                <circle cx="445" cy="270" r="14" fill="#93C5FD" />
                <path d="M 442 260 C 452 260, 458 275, 448 282 Z" fill="#1D4ED8" />

                {/* Earphone / Headphone on Ear */}
                <rect x="450" y="245" width="14" height="20" rx="6" fill="#0F172A" />

                {/* 4. Swirling Musical Smoke Wisps (Rising from Head into Upper Atmosphere) */}
                <path 
                  d="M 460 240 C 470 210, 500 230, 505 195 C 510 160, 470 170, 490 130 C 510 90, 555 100, 550 140 C 545 180, 570 190, 560 225 C 550 260, 510 270, 480 280" 
                  fill="url(#cloud-smoke-grad)" 
                  opacity="0.9" 
                />
                <circle cx="515" cy="155" r="9" fill="#93C5FD" opacity="0.8" />
                <circle cx="475" cy="190" r="5" fill="#BFDBFE" opacity="0.7" />

                {/* 5. Retro-Modern Digital Music Player (iPod / Player on Floor) */}
                <g transform="translate(370, 340)">
                  {/* Player Body */}
                  <rect x="0" y="0" width="48" height="72" rx="10" fill="url(#ipod-body-grad)" stroke="#2563EB" strokeWidth="1.5" filter="drop-shadow(0 6px 12px rgba(37,99,235,0.3))" />
                  {/* Screen with Equalizer Waveform */}
                  <rect x="6" y="7" width="36" height="26" rx="4" fill="#FFFFFF" />
                  {/* Equalizer Bars */}
                  <line x1="12" y1="28" x2="12" y2="18" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="18" y1="28" x2="18" y2="12" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="24" y1="28" x2="24" y2="15" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="30" y1="28" x2="30" y2="10" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="36" y1="28" x2="36" y2="20" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Click Wheel Controller */}
                  <circle cx="24" cy="52" r="12" fill="#1D4ED8" />
                  <circle cx="24" cy="52" r="5" fill="#FFFFFF" />
                </g>

                {/* Headphone Wire Routing from Player to Ear */}
                <path 
                  d="M 394 340 C 360 300, 340 260, 380 220 C 410 190, 460 210, 455 245" 
                  fill="none" 
                  stroke="#0F172A" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 394 340 C 440 370, 480 340, 490 280 C 495 250, 475 245, 460 248" 
                  fill="none" 
                  stroke="#0F172A" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                />

                {/* Decorative Geometric Accents around Player (Triangle & Floating Ring) */}
                <polygon points="480,360 495,330 510,365" fill="#0F172A" />
                <circle cx="485" cy="310" r="4" fill="none" stroke="#64748B" strokeWidth="1.5" />
              </svg>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INTERACTIVE SIGN UP & LOGIN MODAL                                */}
      {/* ========================================================================= */}
      {activeModal === 'signup' && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {authMode === 'signup' ? 'Create AudioVido Account' : 'Sign in to AudioVido'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Access full lossless streaming catalog</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Your Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Hunter"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Favorite Music Style</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Lo-Fi & Chill', 'Rock & Metal', 'Classical & Iranian', 'Synthwave', 'EDM & Party'].map(g => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setFormData({ ...formData, genre: g })}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all ${
                          formData.genre === g 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer mt-2"
              >
                {authMode === 'signup' ? 'Complete Sign Up' : 'Sign In Now'}
              </button>
            </form>

            {/* Social 1-Click Fast Connect */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">Or connect instantly</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setSignedInUser('Google Explorer');
                    setActiveModal(null);
                    showToast('Connected via Google Account!');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  Google
                </button>
                <button 
                  onClick={() => {
                    setSignedInUser('Spotify Listener');
                    setActiveModal(null);
                    showToast('Connected via Spotify Account!');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  Spotify
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DOWNLOAD MODAL                                                   */}
      {/* ========================================================================= */}
      {activeModal === 'download' && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-950">Download AudioVido App</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Experience zero-latency lossless audio streaming on all your devices with offline caching and bit-perfect audio output.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'macOS Studio', icon: Laptop, badge: 'Apple Silicon & Intel', note: 'v2.4 Universal' },
                { name: 'Windows Pro', icon: Laptop, badge: 'Windows 11 / 10 x64', note: 'DirectSound / ASIO' },
                { name: 'iOS & iPadOS', icon: Smartphone, badge: 'App Store', note: 'AirPlay 2 & Spatial' },
                { name: 'Android APK', icon: Smartphone, badge: 'Google Play', note: 'Hi-Res LDAC Audio' }
              ].map(app => (
                <div 
                  key={app.name}
                  onClick={() => {
                    showToast(`Downloading ${app.name} package...`);
                    setActiveModal(null);
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <app.icon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{app.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{app.badge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                showToast('Web App already installed and running active.');
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Continue in Web Studio Mode
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ABOUT MODAL                                                      */}
      {/* ========================================================================= */}
      {activeModal === 'about' && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-4 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-950">About AudioVido Music</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              <strong>AudioVido</strong> is built on the belief that music is the ultimate human connective tissue. Our mission is to bridge world music discovery with cutting-edge web audio synthesis and lossless progressive streaming.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xl font-black text-blue-600">100M+</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold mt-0.5">Global Tracks</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xl font-black text-blue-600">0$</span>
                <span className="text-[10px] text-slate-500 block uppercase font-bold mt-0.5">Subscription Wall</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Engineered with modern Web Audio API, real-time live pipes, and synchronized lyrics architecture.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SUPPORT MODAL                                                    */}
      {/* ========================================================================= */}
      {activeModal === 'support' && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-4 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-950">Audio Support & Help</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900">How does live streaming work?</h4>
                <p className="text-slate-500 text-[11px]">Audio is streamed directly via high-speed progressive pipes without heavy compression artifacts.</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900">Can I search Persian & international artists?</h4>
                <p className="text-slate-500 text-[11px]">Yes! Type any name (e.g. Shajarian, Queen, Coldplay, Eminem) into the Music 2 search bar.</p>
              </div>
            </div>

            <button 
              onClick={() => {
                showToast('Connecting to 24/7 Audio Support engineer...');
                setActiveModal(null);
              }}
              className="w-full py-3 rounded-2xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              Start Live Support Chat
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: FEATURES MODAL                                                   */}
      {/* ========================================================================= */}
      {activeModal === 'features' && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-4 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-950">AudioVido Core Features</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: 'Lossless Audio Stream', desc: 'Progressive 320kbps MP3 audio playback.' },
                { title: 'Zero Clutter Scrubber', desc: 'Instant seek and drag waveform visualizer.' },
                { title: 'Global Multi-Catalog', desc: 'Access 100M+ songs with instant metadata.' },
                { title: 'Social & Cinema Realms', desc: 'Watch trailers and share vibes with community.' }
              ].map(feat => (
                <div key={feat.title} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setActiveModal(null);
                if (onNavigateMusic) onNavigateMusic();
              }}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Try Live in Music 2
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
