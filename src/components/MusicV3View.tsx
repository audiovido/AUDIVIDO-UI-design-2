/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Library, ListMusic, Music2, Disc, Radio, Flame,
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, 
  Heart, Menu, Settings, MoreHorizontal, Send, MessageSquare, Sparkles, X, Compass
} from 'lucide-react';
import { Track } from '../data/auraStore';

interface MusicV3ViewProps {
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
  isShuffle: boolean;
  setIsShuffle: (val: boolean) => void;
  isRepeat: boolean;
  setIsRepeat: (val: boolean) => void;
  onNavigatePortal?: () => void;
}

interface FriendActivityItem {
  id: string;
  name: string;
  avatar: string;
  action: string;
  subtext: string;
  timeAgo: string;
  badgeType?: 'spotify' | 'heart' | 'flame';
}

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  text: string;
  date: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

export const MusicV3View: React.FC<MusicV3ViewProps> = ({
  currentTrack,
  isPlaying,
  setIsPlaying,
  trackProgress,
  currentTrackSeconds,
  audioDuration,
  handleSeek,
  likedTracks,
  toggleLikeTrack,
  allTracks,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setIsRepeat,
  onNavigatePortal
}) => {
  // Navigation & Sub-views
  const [activeNav, setActiveNav] = useState<'home' | 'search' | 'library' | 'playlist'>('home');
  const [activePlaylistName, setActivePlaylistName] = useState<string>('User Playlists');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Audio Volumes & Ambiance
  const [musicVolume, setMusicVolume] = useState<number>(85);
  const [ambianceVolume, setAmbianceVolume] = useState<number>(60);
  const [isFireplaceActive, setIsFireplaceActive] = useState<boolean>(true);

  // Search Results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Social interactive feed
  const [commentInput, setCommentInput] = useState<string>('');
  const [friendActivities] = useState<FriendActivityItem[]>([
    {
      id: 'fa-1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      action: 'Listening to Sunset Horizon',
      subtext: 'Aura Lossless • 320kbps',
      timeAgo: '08m',
      badgeType: 'spotify'
    },
    {
      id: 'fa-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      action: 'Shared Lo-Fi Night Study',
      subtext: 'Added to Cabin Chill',
      timeAgo: '58m',
      badgeType: 'heart'
    },
    {
      id: 'fa-3',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      action: 'Jamming to Shajarian Tasnif',
      subtext: 'High-Fidelity Stream',
      timeAgo: '4h',
      badgeType: 'flame'
    }
  ]);

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 'fp-1',
      author: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      title: 'Midnight Resonance',
      text: 'The warm acoustics in this wooden hall with fireplace crackles make this track unforgettable.',
      date: 'Nov 11',
      likes: 24,
      comments: 6
    },
    {
      id: 'fp-2',
      author: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      title: 'Cabin Session #4',
      text: 'Live vinyl stream playing right now with dual equalizer harmonics.',
      date: 'Nov 11',
      likes: 18,
      comments: 3
    }
  ]);

  // Playlist data map
  const PLAYLIST_CATEGORIES = [
    { id: 'user', name: 'User Playlists', count: 14, icon: ListMusic },
    { id: 'named', name: 'Named Playlists', count: 8, icon: Disc },
    { id: 'ronno', name: 'Ronno', count: 22, sub: 'Deep Chill & House', icon: Radio },
    { id: 'banii', name: 'Banii Music', count: 35, sub: 'Iranian & World Acoustics', icon: Music2 },
    { id: 'navin', name: 'Now Navin', count: 19, sub: 'Lo-Fi Beats & Ambient', icon: Compass }
  ];

  // Live YouTube/SoundCloud search trigger
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/ytmusic-search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (e) {
        console.warn('Search fetch failed:', e);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle post new comment in right sidebar
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const activeTitle = currentTrack?.title || 'Cabin Session';
    const newPost: FeedPost = {
      id: `fp-${Date.now()}`,
      author: 'You (Cabin Listener)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      title: activeTitle,
      text: commentInput.trim(),
      date: 'Just now',
      likes: 1,
      comments: 0,
      liked: true
    };
    setFeedPosts([newPost, ...feedPosts]);
    setCommentInput('');
  };

  const handleLikePost = (postId: string) => {
    setFeedPosts(posts => posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Active track info & cover fallback
  const activeTrackTitle = currentTrack?.title || 'Coffee Bars & Warm Cabin';
  const activeTrackArtist = currentTrack?.artist || 'Aura Ensemble';
  const activeTrackAlbum = currentTrack?.album || 'Acoustic Solitude';
  const activeTrackCover = (currentTrack as any)?.coverUrl || currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop';
  const isCurrentLiked = currentTrack ? !!likedTracks[currentTrack.id] : false;

  const currentDurationSec = currentTrack?.durationSeconds || audioDuration || 215;
  const currentProgSec = currentTrackSeconds || (trackProgress / 100) * currentDurationSec;

  return (
    <div className="relative w-full min-h-[calc(100vh-5.5rem)] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* 1. PHOTOREALISTIC WARM COZY CABIN BACKGROUND WITH FIREPLACE & AMBER GLOW  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        {/* Cinematic Wood Cabin Living Room Backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2600&auto=format&fit=crop')`,
            filter: 'brightness(0.68) saturate(1.15)'
          }}
        />

        {/* Ambient Warm Fireplace Radiance (Bottom Right Hearth Glow) */}
        <div className="absolute right-0 bottom-0 w-[600px] h-[500px] bg-gradient-to-tl from-amber-600/35 via-orange-500/20 to-transparent pointer-events-none blur-3xl animate-pulse" />
        
        {/* Soft Floor Lamp Warm Amber Light (Left) */}
        <div className="absolute left-[20%] top-[30%] w-[400px] h-[400px] bg-amber-400/15 rounded-full pointer-events-none blur-3xl" />

        {/* Mountain Forest Window Dusk Cool Blue Contrast (Top Center/Left) */}
        <div className="absolute left-[30%] top-0 w-[450px] h-[300px] bg-blue-500/10 pointer-events-none blur-2xl" />

        {/* Cinematic Dark Vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/60 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION CONTAINER (FULL-SCREEN RESPONSIVE LAYOUT)            */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1550px] min-h-[820px] h-[calc(100vh-6.5rem)] flex flex-col justify-between p-3 sm:p-5 text-white">
        
        {/* --- TOP HEADER ROW --- */}
        <div className="flex items-center justify-between px-2 sm:px-6 pt-1 pb-3">
          
          {/* Left Spacer / Branding Indicator */}
          <div className="w-[120px] hidden sm:flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300/80 uppercase">AURA HI-FI</span>
          </div>

          {/* Center Title: "MUSIC WORLD" */}
          <div className="flex-1 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.28em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              MUSIC WORLD
            </h1>
          </div>

          {/* Right Header Controls: Profile, Hamburger, Settings */}
          <div className="flex items-center gap-3 w-[120px] justify-end">
            
            {/* Fireplace Toggle */}
            <button
              onClick={() => setIsFireplaceActive(!isFireplaceActive)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFireplaceActive 
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                  : 'bg-black/30 border-white/10 text-white/50 hover:text-white'
              }`}
              title={isFireplaceActive ? 'Fireplace Ambiance: Active' : 'Fireplace Ambiance: Muted'}
            >
              <Flame className="w-4 h-4" />
            </button>

            {/* Profile Avatar with Purple Glow */}
            <div 
              onClick={() => setActiveNav('library')}
              className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[1.5px] cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform"
              title="User Profile & Settings"
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            {/* Menu Button */}
            <button 
              onClick={() => setActiveNav(activeNav === 'home' ? 'search' : 'home')}
              className="p-2 rounded-full bg-black/35 hover:bg-black/60 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button 
              onClick={() => setActiveNav('library')}
              className="p-2 rounded-full bg-black/35 hover:bg-black/60 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- MAIN GRID: LEFT SIDEBAR | CENTER FLOATING AREA | RIGHT SIDEBAR --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 flex-1 items-stretch py-2 min-h-0">
          
          {/* ===================================================================== */}
          {/* 3. LEFT GLASSMORPHIC SIDEBAR (NAV & PLAYLISTS & NOW PLAYING MINI)      */}
          {/* ===================================================================== */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between bg-black/45 backdrop-blur-2xl border border-white/10 rounded-[28px] sm:rounded-[34px] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
            
            {/* Top Navigation Links */}
            <div className="space-y-3">
              
              {/* Home Link (Glowing Active State with Cyan/Pink Glow) */}
              <button
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                  activeNav === 'home'
                    ? 'bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-cyan-500/25 border border-pink-400/50 text-white shadow-[0_0_20px_rgba(236,72,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${activeNav === 'home' ? 'bg-cyan-500/30 text-cyan-300' : 'text-white/60'}`}>
                  <Home className="w-4 h-4" />
                </div>
                <span>Home</span>
              </button>

              {/* Search Link */}
              <button
                onClick={() => setActiveNav('search')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                  activeNav === 'search'
                    ? 'bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-cyan-500/25 border border-cyan-400/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="p-1.5 rounded-xl text-white/60">
                  <Search className="w-4 h-4" />
                </div>
                <span>Search</span>
              </button>

              {/* My Library Link */}
              <button
                onClick={() => setActiveNav('library')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
                  activeNav === 'library'
                    ? 'bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-cyan-500/25 border border-purple-400/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="p-1.5 rounded-xl text-white/60">
                  <Library className="w-4 h-4" />
                </div>
                <span>My Library</span>
              </button>

              {/* Playlists Divider & List */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 block mb-1">
                  COLLECTIONS
                </span>

                {PLAYLIST_CATEGORIES.map(p => {
                  const Icon = p.icon;
                  const isActive = activeNav === 'playlist' && activePlaylistName === p.name;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePlaylistName(p.name);
                        setActiveNav('playlist');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white/15 text-cyan-300 font-bold border-l-2 border-cyan-400 pl-3.5' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">{p.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Left Miniature Portal Widget & Now Playing Info */}
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              
              {/* Rotating Mini Cosmic Portal Card */}
              <div 
                onClick={onNavigatePortal}
                className="relative w-full aspect-[2.2/1] rounded-2xl overflow-hidden border border-white/15 bg-slate-950/70 p-2 flex items-center justify-center cursor-pointer group shadow-lg"
                title="Enter Dimensional Portal"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-emerald-900/40 opacity-70 group-hover:opacity-100 transition-opacity" />
                
                {/* 3 Dimensional Realms Orbs */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-cyan-400/60 overflow-hidden shadow-[0_0_10px_#22d3ee] animate-spin-slow">
                    <img src={activeTrackCover} alt="Realm" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-9 h-9 rounded-full border border-pink-400/60 overflow-hidden shadow-[0_0_10px_#f43f5e] -ml-2">
                    <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop" alt="Realm" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-emerald-400/60 overflow-hidden shadow-[0_0_10px_#34d399] -ml-2">
                    <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop" alt="Realm" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-300/80 group-hover:text-cyan-200">
                  PORTAL ↗
                </div>
              </div>

              {/* Now Playing Title & Like */}
              <div className="flex items-center justify-between px-1">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/90 block">Now Playing</span>
                  <p className="text-xs font-bold text-white truncate">{activeTrackTitle}</p>
                  <p className="text-[11px] text-white/50 truncate">{activeTrackArtist}</p>
                </div>
                {currentTrack && (
                  <button
                    onClick={() => toggleLikeTrack(currentTrack.id)}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      isCurrentLiked 
                        ? 'text-rose-400 scale-110' 
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. CENTER AREA: FLOATING TRACK DISPLAY CARD & DUAL WAVEFORM EQUALIZER */}
          {/* ===================================================================== */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between items-center px-1 sm:px-4 py-2 relative">
            
            {/* Top Center Floating Frosted Glass Card with Cyan & Purple Neon Glow */}
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-cyan-400/40 rounded-[26px] p-4 sm:p-5 shadow-[0_0_35px_rgba(34,211,238,0.25),0_15px_30px_rgba(0,0,0,0.6)] flex items-center gap-4 sm:gap-6 animate-fadeIn">
              
              {/* Dual Artwork Thumbnails Side by Side */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Artwork 1: Mountain Dusk Horizon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md transform hover:scale-105 transition-transform">
                  <img 
                    src={activeTrackCover} 
                    alt="Album Cover" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {/* Artwork 2: Moody Silhouette */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md transform hover:scale-105 transition-transform hidden sm:block">
                  <img 
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop" 
                    alt="Album Secondary" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Track Metadata */}
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase block">
                  {activeTrackArtist}
                </span>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                  {activeTrackTitle}
                </h2>
                <p className="text-xs text-white/60 truncate font-light">
                  {activeTrackAlbum}
                </p>
              </div>

              {/* Quick Play Trigger from Card */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Dynamic Content Switching: Search View / Playlist View / Main Visualizer */}
            {activeNav === 'search' && (
              <div className="w-full max-w-lg bg-black/55 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl my-3 max-h-[340px] overflow-y-auto space-y-3 animate-fadeIn">
                <div className="relative">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search millions of songs, artists, albums..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isSearching ? (
                  <div className="py-6 text-center text-xs text-cyan-300 flex items-center justify-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>Searching lossless audio stream database...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {searchResults.slice(0, 5).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          onSelectTrack(item);
                          setActiveNav('home');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-transparent hover:border-cyan-400/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.coverUrl} alt="Cover" className="w-9 h-9 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300">{item.title}</h4>
                            <p className="text-[10px] text-white/60 truncate">{item.artist}</p>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Popular in Cabin Chill:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Bill Withers', 'Mohammadreza Shajarian', 'Coldplay', 'Lo-Fi Chill', 'Hans Zimmer'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-cyan-500/20 text-xs text-white/80 hover:text-cyan-300 border border-white/10 transition-all cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeNav === 'playlist' && (
              <div className="w-full max-w-lg bg-black/55 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl my-3 max-h-[340px] overflow-y-auto space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">{activePlaylistName}</h3>
                  <span className="text-[11px] text-white/50">{allTracks.length} Tracks</span>
                </div>
                <div className="space-y-1">
                  {allTracks.map((t, idx) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTrack(t)}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                        currentTrack?.id === t.id 
                          ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold' 
                          : 'hover:bg-white/5 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-white/40 w-4">{idx + 1}</span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{t.title}</p>
                          <p className="text-[10px] text-white/50 truncate">{t.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-white/40">{t.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* 5. BOTTOM FLOATING MASTER EQUALIZER & DUAL NEON WAVEFORM PLAYER     */}
            {/* =================================================================== */}
            <div className="w-full max-w-2xl bg-black/45 backdrop-blur-2xl border border-white/15 rounded-[32px] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] space-y-4">
              
              {/* Header inside player: 3 dots & Timers */}
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-mono tracking-wider text-cyan-300/80 uppercase">
                  {formatTime(currentProgSec)} / {formatTime(currentDurationSec)}
                </span>
                <div className="flex items-center gap-1 text-white/40">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Main Visualizer Row: Left Slider | Dual Neon Waveform | Right Slider */}
              <div className="flex items-center gap-3 sm:gap-5">
                
                {/* Left Vertical Slider: Music Volume (Cyan Neon Fill) */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const percent = Math.round(100 - (clickY / rect.height) * 100);
                      setMusicVolume(Math.min(100, Math.max(0, percent)));
                    }}
                    className="relative w-4 sm:w-5 h-20 sm:h-24 bg-white/10 rounded-full overflow-hidden border border-cyan-400/40 cursor-pointer p-0.5"
                    title={`Music Volume: ${musicVolume}%`}
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500 via-sky-400 to-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee] transition-all absolute bottom-0 left-0 right-0"
                      style={{ height: `${musicVolume}%` }}
                    />
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                </div>

                {/* Center: Dual Neon Sine Waveform Visualizer & Interactive Progress Line */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                    handleSeek(percent);
                  }}
                  className="flex-1 relative h-20 sm:h-24 bg-black/30 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center cursor-pointer group"
                >
                  <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
                    <defs>
                      <linearGradient id="wave-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
                      </linearGradient>

                      <linearGradient id="wave-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C084FC" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#E879F9" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>

                    {/* Equalizer Ticks on Floor */}
                    {Array.from({ length: 40 }).map((_, i) => {
                      const h = 4 + Math.sin(i * 0.35) * (isPlaying ? 12 : 6);
                      return (
                        <line
                          key={i}
                          x1={10 + i * 9.8}
                          y1={75}
                          x2={10 + i * 9.8}
                          y2={75 - h}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                          opacity="0.25"
                        />
                      );
                    })}

                    {/* Sine Curve 1: Magenta / Pink Glowing Harmonic Wave */}
                    <path
                      d="M 10 70 Q 100 70, 160 30 T 260 30 Q 320 70, 390 70"
                      fill="none"
                      stroke="url(#wave-magenta)"
                      strokeWidth="2.8"
                      className={isPlaying ? "animate-pulse" : ""}
                      style={{ filter: 'drop-shadow(0 0 6px #f43f5e)' }}
                    />

                    {/* Sine Curve 2: Cyan / Sky Blue Main Resonator Wave */}
                    <path
                      d="M 10 70 Q 120 70, 200 20 Q 280 70, 390 70"
                      fill="none"
                      stroke="url(#wave-cyan)"
                      strokeWidth="3.2"
                      style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }}
                    />

                    {/* Interactive Horizontal Progress Baseline */}
                    <line x1="10" y1="70" x2="390" y2="70" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
                    <line 
                      x1="10" 
                      y1="70" 
                      x2={10 + (380 * (trackProgress / 100))} 
                      y2="70" 
                      stroke="#38BDF8" 
                      strokeWidth="2.5" 
                      style={{ filter: 'drop-shadow(0 0 4px #38bdf8)' }}
                    />

                    {/* Scrubber Ball Head */}
                    <circle
                      cx={10 + (380 * (trackProgress / 100))}
                      cy="70"
                      r="5"
                      fill="#FFFFFF"
                      stroke="#22D3EE"
                      strokeWidth="2"
                      style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
                    />
                  </svg>
                </div>

                {/* Right Vertical Slider: Fireplace & Ambiance Volume (Purple/Cyan Neon Fill) */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const percent = Math.round(100 - (clickY / rect.height) * 100);
                      setAmbianceVolume(Math.min(100, Math.max(0, percent)));
                    }}
                    className="relative w-4 sm:w-5 h-20 sm:h-24 bg-white/10 rounded-full overflow-hidden border border-purple-400/40 cursor-pointer p-0.5"
                    title={`Fireplace & Room Ambiance: ${ambianceVolume}%`}
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 via-pink-400 to-cyan-300 rounded-full shadow-[0_0_12px_#c084fc] transition-all absolute bottom-0 left-0 right-0"
                      style={{ height: `${ambianceVolume}%` }}
                    />
                  </div>
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                </div>

              </div>

              {/* Bottom Row of Audio Control Buttons */}
              <div className="flex items-center justify-between px-2 sm:px-6 pt-1">
                
                {/* Repeat Toggle */}
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    isRepeat ? 'text-cyan-300 scale-110 shadow-[0_0_8px_#22d3ee]' : 'text-white/50 hover:text-white'
                  }`}
                  title="Repeat Track"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Shuffle Toggle */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    isShuffle ? 'text-pink-400 scale-110 shadow-[0_0_8px_#f43f5e]' : 'text-white/50 hover:text-white'
                  }`}
                  title="Shuffle Playlist"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Previous Track */}
                <button
                  onClick={onPrevTrack}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Master Play / Pause Button with Pulsing Cyan/Magenta Aura */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-pink-500 p-[1.5px] shadow-[0_0_28px_rgba(34,211,238,0.55),0_0_15px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white">
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-cyan-300" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-cyan-300 ml-0.5" />
                    )}
                  </div>
                </button>

                {/* Next Track */}
                <button
                  onClick={onNextTrack}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                {/* Like / Heart */}
                {currentTrack && (
                  <button
                    onClick={() => toggleLikeTrack(currentTrack.id)}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      isCurrentLiked ? 'text-rose-400 scale-110' : 'text-white/50 hover:text-white'
                    }`}
                    title="Like Track"
                  >
                    <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-current' : ''}`} />
                  </button>
                )}

                {/* Crossfade / Settings */}
                <button
                  onClick={() => setActiveNav('library')}
                  className="p-2 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
                  title="Audio DSP Equalizer"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 6. RIGHT GLASSMORPHIC PANEL (FRIEND ACTIVITY, FEEDS & DISCUSSIONS)    */}
          {/* ===================================================================== */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between bg-black/45 backdrop-blur-2xl border border-white/10 rounded-[28px] sm:rounded-[34px] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              
              {/* Header: Friend Activity */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs sm:text-sm font-bold tracking-wide text-white">Friend Activity</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Friend Activity List */}
              <div className="space-y-3">
                {friendActivities.map(fa => (
                  <div key={fa.id} className="flex items-start gap-2.5 group">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
                      <img src={fa.avatar} alt={fa.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{fa.name}</span>
                        <span className="text-[10px] font-mono text-white/40">{fa.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-white/70 truncate">{fa.action}</p>
                      <span className="text-[9.5px] text-cyan-400/80 block truncate font-mono">{fa.subtext}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feed & Community Discussions */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                  COMMUNITY REVIEWS & FEED
                </span>

                {feedPosts.map(post => (
                  <div key={post.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={post.avatar} alt={post.author} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[11px] font-bold text-white truncate">{post.author}</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/40">{post.date}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-cyan-300 truncate">{post.title}</h4>
                    <p className="text-[10.5px] text-white/70 leading-relaxed line-clamp-2">{post.text}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-white/50">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${post.liked ? 'text-rose-400' : 'hover:text-rose-300'}`}
                      >
                        <Heart className={`w-3 h-3 ${post.liked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Recommendation & Chat Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Recommend track or drop a note..."
                  className="w-full pl-3 pr-8 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition-opacity cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
