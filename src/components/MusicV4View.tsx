/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, Library, ListMusic, Music2, Disc, Radio, Flame,
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX,
  Heart, Menu, Settings, MoreHorizontal, Send, MessageSquare, Sparkles, X, 
  Compass, Plus, Sliders, Layers, Headphones, Music, User, Share2, Filter, Check, TrendingUp
} from 'lucide-react';
import { Track } from '../data/auraStore';

interface MusicV4ViewProps {
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
  trackTitle: string;
  artist: string;
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

interface UserPlaylist {
  id: string;
  name: string;
  trackCount: number;
  coverUrl: string;
  genre: string;
}

export const MusicV4View: React.FC<MusicV4ViewProps> = ({
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
  // Navigation & Sub-views inside Music 4
  const [activeNav, setActiveNav] = useState<'home' | 'search' | 'library' | 'user-playlists' | 'named-playlists' | 'ronno' | 'banii' | 'navin'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All');

  // Interactive Volumes & Ambiance Controls
  const [musicVolume, setMusicVolume] = useState<number>(85);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  const [ambianceVolume, setAmbianceVolume] = useState<number>(65);
  const [isFireplaceActive, setIsFireplaceActive] = useState<boolean>(true);

  // Equalizer & DSP Presets
  const [activeEqPreset, setActiveEqPreset] = useState<'cozy' | 'acoustic' | 'bass' | 'vocal'>('cozy');
  const [showEqModal, setShowEqModal] = useState<boolean>(false);
  const [eqBands, setEqBands] = useState({ 60: 4, 250: 2, 1000: 0, 4000: 3, 12000: 5 });

  // Custom User Playlists
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([
    { id: 'up-1', name: 'Cabin Night Chill', trackCount: 18, coverUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=300&auto=format&fit=crop', genre: 'Ambient' },
    { id: 'up-2', name: 'Focus & Code Flow', trackCount: 24, coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop', genre: 'Lo-Fi' },
    { id: 'up-3', name: 'Persian Acoustic Masters', trackCount: 15, coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop', genre: 'Traditional' }
  ]);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState<boolean>(false);

  // Search Results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Social feed & Friend activity
  const [commentInput, setCommentInput] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const [friendActivities] = useState<FriendActivityItem[]>([
    {
      id: 'fa-1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      action: 'Listening to',
      trackTitle: 'Sunset Horizon',
      artist: 'Aura Ensemble',
      subtext: 'Aura Lossless • 320kbps',
      timeAgo: '08m',
      badgeType: 'spotify'
    },
    {
      id: 'fa-2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      action: 'Shared track',
      trackTitle: 'Lo-Fi Night Study',
      artist: 'Navin Beats',
      subtext: 'Added to Cabin Chill',
      timeAgo: '58m',
      badgeType: 'heart'
    },
    {
      id: 'fa-3',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      action: 'Jamming to',
      trackTitle: 'Shajarian Tasnif',
      artist: 'Mohammadreza Shajarian',
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
      title: 'Midnight Resonance in Music 4',
      text: 'The 5-band equalizer with fireplace crackles creates the most immersive studio sound stage.',
      date: 'Nov 11',
      likes: 28,
      comments: 7
    },
    {
      id: 'fp-2',
      author: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      title: 'Ronno House Station',
      text: 'Deep house beats paired with dual neon sine curves look incredible in this cabin space.',
      date: 'Nov 11',
      likes: 19,
      comments: 4
    }
  ]);

  // Search API execution
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
        console.warn('Search fetch error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle create new playlist
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPl: UserPlaylist = {
      id: `up-${Date.now()}`,
      name: newPlaylistName.trim(),
      trackCount: 0,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
      genre: 'Custom Mix'
    };
    setUserPlaylists([newPl, ...userPlaylists]);
    setNewPlaylistName('');
    setShowCreatePlaylistModal(false);
    showToast(`Playlist "${newPl.name}" created!`);
  };

  // Add comment handler
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newPost: FeedPost = {
      id: `fp-${Date.now()}`,
      author: 'You (Cabin Studio)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      title: currentTrack?.title || 'Music 4 Session',
      text: commentInput.trim(),
      date: 'Just now',
      likes: 1,
      comments: 0,
      liked: true
    };
    setFeedPosts([newPost, ...feedPosts]);
    setCommentInput('');
    showToast('Comment posted to community feed!');
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Track fallbacks
  const activeTitle = currentTrack?.title || 'Coffee Bars & Warm Cabin';
  const activeArtist = currentTrack?.artist || 'Aura Ensemble';
  const activeAlbum = currentTrack?.album || 'Acoustic Solitude';
  const activeCover = (currentTrack as any)?.coverUrl || currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop';
  const isCurrentLiked = currentTrack ? !!likedTracks[currentTrack.id] : false;

  const currentDurationSec = currentTrack?.durationSeconds || audioDuration || 215;
  const currentProgSec = currentTrackSeconds || (trackProgress / 100) * currentDurationSec;

  return (
    <div className="relative w-full min-h-[calc(100vh-5.5rem)] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-black/90 text-white border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 flex items-center gap-2.5 animate-fadeIn backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PHOTOREALISTIC WARM COZY CABIN BACKGROUND WITH FIREPLACE & AMBER GLOW  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2600&auto=format&fit=crop')`,
            filter: 'brightness(0.68) saturate(1.15)'
          }}
        />
        {/* Ambient Fireplace Glow */}
        <div className="absolute right-0 bottom-0 w-[600px] h-[500px] bg-gradient-to-tl from-amber-600/35 via-orange-500/20 to-transparent pointer-events-none blur-3xl animate-pulse" />
        {/* Floor Lamp Amber Light */}
        <div className="absolute left-[20%] top-[30%] w-[400px] h-[400px] bg-amber-400/15 rounded-full pointer-events-none blur-3xl" />
        {/* Window Dusk Light */}
        <div className="absolute left-[30%] top-0 w-[450px] h-[300px] bg-blue-500/10 pointer-events-none blur-2xl" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/60 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION CONTAINER (FULL-SCREEN RESPONSIVE LAYOUT)            */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1550px] min-h-[820px] h-[calc(100vh-6.5rem)] flex flex-col justify-between p-3 sm:p-5 text-white">
        
        {/* --- TOP HEADER ROW --- */}
        <div className="flex items-center justify-between px-2 sm:px-6 pt-1 pb-3">
          
          {/* Left Brand Badge */}
          <div className="w-[140px] hidden sm:flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-300/90 uppercase font-bold">MUSIC 4 STUDIO</span>
          </div>

          {/* Center Title: "MUSIC WORLD" */}
          <div className="flex-1 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.28em] text-white uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              MUSIC WORLD
            </h1>
          </div>

          {/* Right Header Controls: Fireplace, Profile, Menu, Settings */}
          <div className="flex items-center gap-3 w-[140px] justify-end">
            
            {/* DSP Equalizer Modal Trigger */}
            <button
              onClick={() => setShowEqModal(true)}
              className="p-2 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 hover:bg-purple-500/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.4)]"
              title="5-Band DSP Graphic Equalizer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Fireplace Toggle */}
            <button
              onClick={() => {
                setIsFireplaceActive(!isFireplaceActive);
                showToast(isFireplaceActive ? 'Fireplace audio muted' : 'Fireplace ambiance active');
              }}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFireplaceActive 
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                  : 'bg-black/30 border-white/10 text-white/50 hover:text-white'
              }`}
              title={isFireplaceActive ? 'Fireplace Ambiance: Active' : 'Fireplace Ambiance: Muted'}
            >
              <Flame className="w-4 h-4" />
            </button>

            {/* Profile Avatar */}
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

            {/* Menu */}
            <button 
              onClick={() => setActiveNav(activeNav === 'home' ? 'search' : 'home')}
              className="p-2 rounded-full bg-black/35 hover:bg-black/60 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Settings */}
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
          {/* 3. LEFT GLASSMORPHIC SIDEBAR (100% WORKING MENUS & PLAYLISTS)          */}
          {/* ===================================================================== */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between bg-black/45 backdrop-blur-2xl border border-white/10 rounded-[28px] sm:rounded-[34px] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
            
            {/* Top Navigation Links */}
            <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-22rem)] pr-1">
              
              {/* 1. Home */}
              <button
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
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

              {/* 2. Search */}
              <button
                onClick={() => setActiveNav('search')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
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

              {/* 3. My Library */}
              <button
                onClick={() => setActiveNav('library')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
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

              {/* Playlists Divider */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 block mb-1">
                  PLAYLISTS & STATIONS
                </span>

                {/* 4. User Playlists */}
                <button
                  onClick={() => setActiveNav('user-playlists')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeNav === 'user-playlists' 
                      ? 'bg-white/15 text-cyan-300 font-bold border-l-2 border-cyan-400 pl-3.5' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ListMusic className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">User Playlists</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">{userPlaylists.length}</span>
                </button>

                {/* 5. Named Playlists */}
                <button
                  onClick={() => setActiveNav('named-playlists')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeNav === 'named-playlists' 
                      ? 'bg-white/15 text-cyan-300 font-bold border-l-2 border-cyan-400 pl-3.5' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Disc className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">Named Playlists</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">8</span>
                </button>

                {/* 6. Ronno Station */}
                <button
                  onClick={() => setActiveNav('ronno')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeNav === 'ronno' 
                      ? 'bg-white/15 text-pink-300 font-bold border-l-2 border-pink-400 pl-3.5' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Radio className="w-3.5 h-3.5 shrink-0 text-pink-400" />
                    <span className="truncate">Ronno</span>
                  </div>
                  <span className="text-[10px] text-pink-300/80 font-mono">Electronic</span>
                </button>

                {/* 7. Banii Music Station */}
                <button
                  onClick={() => setActiveNav('banii')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeNav === 'banii' 
                      ? 'bg-white/15 text-emerald-300 font-bold border-l-2 border-emerald-400 pl-3.5' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Music2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="truncate">Banii Music</span>
                  </div>
                  <span className="text-[10px] text-emerald-300/80 font-mono">Iranian</span>
                </button>

                {/* 8. Now Navin Station */}
                <button
                  onClick={() => setActiveNav('navin')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeNav === 'navin' 
                      ? 'bg-white/15 text-amber-300 font-bold border-l-2 border-amber-400 pl-3.5' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Compass className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span className="truncate">Now Navin</span>
                  </div>
                  <span className="text-[10px] text-amber-300/80 font-mono">Lo-Fi</span>
                </button>

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
                    <img src={activeCover} alt="Realm" className="w-full h-full object-cover" />
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
                  <p className="text-xs font-bold text-white truncate">{activeTitle}</p>
                  <p className="text-[11px] text-white/50 truncate">{activeArtist}</p>
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
          {/* 4. CENTER AREA: FLOATING TRACK DISPLAY CARD & INTERACTIVE SUB-VIEWS   */}
          {/* ===================================================================== */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between items-center px-1 sm:px-4 py-2 relative min-h-0">
            
            {/* Top Center Floating Frosted Glass Card with Cyan & Purple Neon Glow */}
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-cyan-400/40 rounded-[26px] p-4 sm:p-5 shadow-[0_0_35px_rgba(34,211,238,0.25),0_15px_30px_rgba(0,0,0,0.6)] flex items-center gap-4 sm:gap-6 animate-fadeIn shrink-0">
              
              {/* Dual Artwork Thumbnails Side by Side */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md transform hover:scale-105 transition-transform">
                  <img src={activeCover} alt="Album Cover" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md transform hover:scale-105 transition-transform hidden sm:block">
                  <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop" alt="Album Secondary" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Track Metadata */}
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase block">
                  {activeArtist}
                </span>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                  {activeTitle}
                </h2>
                <p className="text-xs text-white/60 truncate font-light">
                  {activeAlbum}
                </p>
              </div>

              {/* Quick Play Trigger */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* DYNAMIC INTERACTIVE CENTER VIEWS BASED ON ACTIVE NAV */}
            <div className="w-full max-w-lg my-2 flex-1 overflow-y-auto pr-1">
              
              {/* SUB-VIEW 1: SEARCH PAGE */}
              {activeNav === 'search' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="relative">
                    <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search songs, artists, acoustic streams..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder-white/40 outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
                      autoFocus
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isSearching ? (
                    <div className="py-6 text-center text-xs text-cyan-300 flex items-center justify-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>Resolving audio streams...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1.5">
                      {searchResults.slice(0, 6).map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            onSelectTrack(item);
                            setActiveNav('home');
                            showToast(`Playing ${item.title}`);
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
                      <span className="text-[10px] uppercase font-bold text-white/40 block">Top Trending Searches:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Mohammadreza Shajarian', 'Bill Withers', 'Lo-Fi Chill', 'Hans Zimmer', 'Coldplay'].map(tag => (
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

              {/* SUB-VIEW 2: MY LIBRARY PAGE */}
              {activeNav === 'library' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">My Saved Library</h3>
                    <span className="text-[10px] font-mono text-white/50">{Object.keys(likedTracks).length} Saved</span>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {allTracks.map((t) => {
                      const isLiked = !!likedTracks[t.id];
                      return (
                        <div 
                          key={t.id}
                          onClick={() => onSelectTrack(t)}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                            currentTrack?.id === t.id ? 'bg-purple-500/20 border border-purple-400/40 text-purple-300' : 'hover:bg-white/5 text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeTrack(t.id);
                              }}
                              className="text-white/40 hover:text-rose-400"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
                            </button>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{t.title}</p>
                              <p className="text-[10px] text-white/50 truncate">{t.artist}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-white/40">{t.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 3: USER PLAYLISTS PAGE */}
              {activeNav === 'user-playlists' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Your Playlists</h3>
                    <button 
                      onClick={() => setShowCreatePlaylistModal(true)}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 text-[11px] font-bold border border-cyan-400/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Create New
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
                    {userPlaylists.map(pl => (
                      <div 
                        key={pl.id}
                        onClick={() => {
                          showToast(`Opened playlist "${pl.name}"`);
                        }}
                        className="p-2.5 rounded-2xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={pl.coverUrl} alt={pl.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300">{pl.name}</h4>
                            <span className="text-[10px] text-white/50 block">{pl.trackCount} tracks • {pl.genre}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 4: NAMED PLAYLISTS PAGE */}
              {activeNav === 'named-playlists' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Editorial Mixes</h3>
                    <span className="text-[10px] font-mono text-white/50">Curated</span>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {['Cabin Fireside Chill', 'Traditional Masterpieces', 'Lo-Fi Focus & Study', 'Deep Electronic Pulse'].map((name, i) => (
                      <div 
                        key={name}
                        onClick={() => showToast(`Playing "${name}" mix`)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-transparent hover:border-cyan-400/40 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Disc className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-white">{name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/40">Mix #{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 5: RONNO ELECTRONIC STATION */}
              {activeNav === 'ronno' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-pink-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-pink-500/20">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-pink-300">Ronno Electronic Station</h3>
                    </div>
                    <span className="text-[10px] font-mono text-pink-300/80">124 BPM</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    Deep House, Ambient Synthwave, and Progressive Chill beats crafted for high-definition listening.
                  </p>
                  <button 
                    onClick={() => {
                      const trk = allTracks.find(t => t.genre.toLowerCase().includes('electronic') || t.genre.toLowerCase().includes('lo-fi')) || allTracks[0];
                      if (trk) onSelectTrack(trk);
                      showToast('Tuned into Ronno Live Electronic Stream');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    Tune In Live
                  </button>
                </div>
              )}

              {/* SUB-VIEW 6: BANII MUSIC IRANIAN STATION */}
              {activeNav === 'banii' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Banii Iranian & World Acoustics</h3>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300/80">Hi-Res 24-bit</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    Timeless Iranian traditional masterpieces, Setar solos, and acoustic world folk compositions.
                  </p>
                  <button 
                    onClick={() => {
                      const trk = allTracks.find(t => t.artist.toLowerCase().includes('shajarian') || t.genre.toLowerCase().includes('iranian')) || allTracks[0];
                      if (trk) onSelectTrack(trk);
                      showToast('Playing Banii Acoustic Masterpiece');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    Play Banii Featured Selection
                  </button>
                </div>
              )}

              {/* SUB-VIEW 7: NOW NAVIN LO-FI STATION */}
              {activeNav === 'navin' && (
                <div className="bg-black/55 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">Now Navin Lo-Fi Beats</h3>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300/80">Study Mode</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    Calm study beats and relaxing soundscapes for deep concentration and cabin comfort.
                  </p>
                  <button 
                    onClick={() => {
                      const trk = allTracks.find(t => t.title.toLowerCase().includes('coffee') || t.title.toLowerCase().includes('lo-fi')) || allTracks[0];
                      if (trk) onSelectTrack(trk);
                      showToast('Now Navin Lo-Fi Stream Active');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
                  >
                    Start Focus Flow
                  </button>
                </div>
              )}

            </div>

            {/* =================================================================== */}
            {/* 5. BOTTOM FLOATING MASTER EQUALIZER & DUAL NEON WAVEFORM PLAYER     */}
            {/* =================================================================== */}
            <div className="w-full max-w-2xl bg-black/45 backdrop-blur-2xl border border-white/15 rounded-[32px] p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] space-y-3 shrink-0">
              
              {/* Header inside player: Timers & Equalizer Badge */}
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-mono tracking-wider text-cyan-300/80 uppercase">
                  {formatTime(currentProgSec)} / {formatTime(currentDurationSec)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono text-purple-300/80 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30 uppercase">
                    DSP EQ: {activeEqPreset}
                  </span>
                  <MoreHorizontal className="w-4 h-4 text-white/40 cursor-pointer" onClick={() => setShowEqModal(true)} />
                </div>
              </div>

              {/* Main Visualizer Row: Left Slider | Dual Neon Waveform | Right Slider */}
              <div className="flex items-center gap-3 sm:gap-5">
                
                {/* Left Vertical Slider: Music Volume (Cyan Neon Fill) */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const percent = Math.round(100 - (clickY / rect.height) * 100);
                      setMusicVolume(Math.min(100, Math.max(0, percent)));
                      if (isMusicMuted) setIsMusicMuted(false);
                    }}
                    className="relative w-4 sm:w-5 h-20 sm:h-24 bg-white/10 rounded-full overflow-hidden border border-cyan-400/40 cursor-pointer p-0.5"
                    title={`Music Volume: ${isMusicMuted ? 0 : musicVolume}%`}
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500 via-sky-400 to-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee] transition-all absolute bottom-0 left-0 right-0"
                      style={{ height: `${isMusicMuted ? 0 : musicVolume}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => setIsMusicMuted(!isMusicMuted)}
                    className="text-cyan-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMusicMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
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
                      <linearGradient id="wave-cyan-v4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
                      </linearGradient>

                      <linearGradient id="wave-magenta-v4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C084FC" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#E879F9" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>

                    {/* Equalizer Ticks */}
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

                    {/* Sine Curve 1: Magenta / Pink */}
                    <path
                      d="M 10 70 Q 100 70, 160 30 T 260 30 Q 320 70, 390 70"
                      fill="none"
                      stroke="url(#wave-magenta-v4)"
                      strokeWidth="2.8"
                      className={isPlaying ? "animate-pulse" : ""}
                      style={{ filter: 'drop-shadow(0 0 6px #f43f5e)' }}
                    />

                    {/* Sine Curve 2: Cyan / Sky Blue */}
                    <path
                      d="M 10 70 Q 120 70, 200 20 Q 280 70, 390 70"
                      fill="none"
                      stroke="url(#wave-cyan-v4)"
                      strokeWidth="3.2"
                      style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }}
                    />

                    {/* Interactive Horizontal Progress Line */}
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

                    {/* Scrubber Ball */}
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

                {/* Right Vertical Slider: Fireplace Ambiance Volume (Purple/Cyan Neon Fill) */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const percent = Math.round(100 - (clickY / rect.height) * 100);
                      setAmbianceVolume(Math.min(100, Math.max(0, percent)));
                      if (!isFireplaceActive) setIsFireplaceActive(true);
                    }}
                    className="relative w-4 sm:w-5 h-20 sm:h-24 bg-white/10 rounded-full overflow-hidden border border-purple-400/40 cursor-pointer p-0.5"
                    title={`Fireplace Ambiance: ${isFireplaceActive ? ambianceVolume : 0}%`}
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 via-pink-400 to-cyan-300 rounded-full shadow-[0_0_12px_#c084fc] transition-all absolute bottom-0 left-0 right-0"
                      style={{ height: `${isFireplaceActive ? ambianceVolume : 0}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => setIsFireplaceActive(!isFireplaceActive)}
                    className="text-amber-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Bottom Row of Controls */}
              <div className="flex items-center justify-between px-2 sm:px-6 pt-0.5">
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    isRepeat ? 'text-cyan-300 scale-110 shadow-[0_0_8px_#22d3ee]' : 'text-white/50 hover:text-white'
                  }`}
                  title="Repeat Track"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    isShuffle ? 'text-pink-400 scale-110 shadow-[0_0_8px_#f43f5e]' : 'text-white/50 hover:text-white'
                  }`}
                  title="Shuffle Playlist"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={onPrevTrack}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Master Play/Pause Button */}
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

                <button
                  onClick={onNextTrack}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

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

                <button
                  onClick={() => setShowEqModal(true)}
                  className="p-2 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
                  title="Graphic Equalizer"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 6. RIGHT GLASSMORPHIC PANEL (FRIEND ACTIVITY & LIVE COMMUNITY FEED)    */}
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
                      <p className="text-[11px] text-white/70 truncate">
                        {fa.action} <span className="text-cyan-300 font-semibold">{fa.trackTitle}</span>
                      </p>
                      <span className="text-[9.5px] text-cyan-400/80 block truncate font-mono">{fa.subtext}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feed Section */}
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
                        onClick={() => {
                          setFeedPosts(posts => posts.map(p => p.id === post.id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));
                        }}
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

      {/* ========================================================================= */}
      {/* MODAL 1: 5-BAND DSP GRAPHIC EQUALIZER MODAL                               */}
      {/* ========================================================================= */}
      {showEqModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowEqModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-950 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-white"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold">5-Band Studio Equalizer</h3>
              </div>
              <button onClick={() => setShowEqModal(false)} className="p-1 rounded-full text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2">
              {[
                { id: 'cozy', label: 'Cozy Cabin' },
                { id: 'acoustic', label: 'Acoustic Folk' },
                { id: 'bass', label: 'Deep Bass' },
                { id: 'vocal', label: 'Vocal Clarity' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveEqPreset(p.id as any);
                    showToast(`Switched EQ to ${p.label}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeEqPreset === p.id 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 5 Vertical Sliders */}
            <div className="grid grid-cols-5 gap-3 pt-2">
              {[
                { hz: '60Hz', key: 60 },
                { hz: '250Hz', key: 250 },
                { hz: '1kHz', key: 1000 },
                { hz: '4kHz', key: 4000 },
                { hz: '12kHz', key: 12000 }
              ].map((band, idx) => {
                const val = (eqBands as any)[band.key] || 0;
                return (
                  <div key={band.hz} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-purple-300">+{val}dB</span>
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickY = e.clientY - rect.top;
                        const db = Math.round(12 - (clickY / rect.height) * 24);
                        setEqBands({ ...eqBands, [band.key]: Math.min(12, Math.max(-12, db)) });
                      }}
                      className="relative w-4 h-32 bg-white/10 rounded-full overflow-hidden border border-purple-400/30 cursor-pointer"
                    >
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-pink-400 rounded-full absolute bottom-0 left-0 right-0 transition-all"
                        style={{ height: `${((val + 12) / 24) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/60">{band.hz}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowEqModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Apply Studio DSP Profile
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE NEW PLAYLIST MODAL                                        */}
      {/* ========================================================================= */}
      {showCreatePlaylistModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowCreatePlaylistModal(false)}
        >
          <form 
            onSubmit={handleCreatePlaylist}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-white"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold">Create New Custom Playlist</h3>
              <button type="button" onClick={() => setShowCreatePlaylistModal(false)} className="p-1 rounded-full text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Playlist Title</label>
              <input 
                type="text" 
                required
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="e.g. Midnight Acoustic Lounge"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-all"
                autoFocus
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Create Playlist
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
