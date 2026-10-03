/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, 
  Search, Bell, MoreVertical, SlidersHorizontal, Music2, 
  Headphones, Radio, Disc3, Sparkles, Volume2, VolumeX, ChevronDown, 
  ListMusic, Flame, Check, Mic2, Compass, Layers, Monitor,
  Laptop, Share2, Plus, ArrowUpRight, TrendingUp, CheckCircle2,
  X, Clock, Music
} from 'lucide-react';
import { Track } from '../data/auraStore';

export interface MusicV2Playlist {
  id: string;
  title: string;
  subtitle: string;
  songCount: number;
  coverUrl: string;
  category: string;
  accentColor: string;
  featured?: boolean;
}

export const MUSIC_V2_PLAYLISTS: MusicV2Playlist[] = [
  {
    id: 'pl-chill-study',
    title: 'Chill Study Beats',
    subtitle: 'Lo-Fi & Instrumental Focus',
    songCount: 24,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    category: 'Chill',
    accentColor: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'pl-running-hits',
    title: 'Running Hits',
    subtitle: 'High Energy Cardio & EDM',
    songCount: 30,
    coverUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80',
    category: 'Workout',
    accentColor: 'from-lime-500 to-emerald-600'
  },
  {
    id: 'pl-romantic-evening',
    title: 'Romantic Evening',
    subtitle: 'Acoustic Love & Soul',
    songCount: 18,
    coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    category: 'Chill',
    accentColor: 'from-rose-500 to-pink-700'
  },
  {
    id: 'pl-party-anthems',
    title: 'Party Anthems',
    subtitle: 'Club Bangers & Festival Hits',
    songCount: 50,
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    category: 'Party',
    accentColor: 'from-purple-500 to-indigo-700'
  },
  {
    id: 'pl-acoustic-mornings',
    title: 'Acoustic Mornings',
    subtitle: 'Warm Coffee & Gentle Guitars',
    songCount: 22,
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
    category: 'Acoustic',
    accentColor: 'from-amber-500 to-orange-700'
  },
  {
    id: 'pl-ocean-drive',
    title: 'Ocean Drive',
    subtitle: 'Sunset Melodic Chill Vibes',
    songCount: 36,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    category: 'Chill',
    accentColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'pl-energy-boost',
    title: 'Energy Boost',
    subtitle: 'Power Workout & Synthwave',
    songCount: 42,
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    category: 'Workout',
    accentColor: 'from-emerald-400 to-lime-500'
  },
  {
    id: 'pl-late-night-lofi',
    title: 'Late Night Lo-Fi',
    subtitle: 'Relax & Unwind Beats',
    songCount: 28,
    coverUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    category: 'Lo-Fi',
    accentColor: 'from-violet-500 to-purple-800'
  }
];

interface MusicV2ViewProps {
  currentTrack: Track;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  trackProgress: number;
  currentTrackSeconds: number;
  handleSeek: (pct: number) => void;
  likedTracks: Record<string, boolean>;
  toggleLikeTrack: (trackId: string, e?: React.MouseEvent) => void;
  allTracks: Track[];
  onSelectTrack: (track: Track) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  isShuffle: boolean;
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  isRepeat: boolean;
  setIsRepeat: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MusicV2View({
  currentTrack,
  isPlaying,
  setIsPlaying,
  trackProgress,
  currentTrackSeconds,
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
  setIsRepeat
}: MusicV2ViewProps) {
  // Navigation tabs inside Music 2
  const [activeTab, setActiveTab] = useState<'discover' | 'library' | 'nowPlaying'>('discover');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [libraryCategory, setLibraryCategory] = useState<'Playlists' | 'Artists' | 'Albums' | 'Songs'>('Playlists');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [connectedDevice, setConnectedDevice] = useState<string>('My Headphones');
  const [showDeviceMenu, setShowDeviceMenu] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(75);

  const GENRES = ['All', 'New Release', 'Chill', 'Workout', 'Rock', 'Party', 'Lo-Fi', 'Acoustic'];

  // Format seconds to M:SS
  const formatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  // Filtered playlists
  const filteredPlaylists = MUSIC_V2_PLAYLISTS.filter(pl => {
    const matchesGenre = selectedGenre === 'All' || pl.category.toLowerCase() === selectedGenre.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      pl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pl.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Filtered tracks
  const filteredTracks = allTracks.filter(track => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return track.title.toLowerCase().includes(q) || 
           track.artist.toLowerCase().includes(q) || 
           track.genre.toLowerCase().includes(q);
  });

  const isCurrentLiked = !!likedTracks[currentTrack.id];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn py-2 pb-44 select-none font-sans relative">
      
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR: PROFILE GREETING, DISCOVERY SEARCH & NOTIFICATIONS */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 sm:p-5 rounded-[28px] bg-slate-950/80 border border-white/10 backdrop-blur-3xl shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        
        {/* User Profile Info (Screen 1 Inspiration: Good Morning Samantha) */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-lime-400/80 shadow-[0_0_16px_rgba(163,230,53,0.4)] shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
              alt="Samantha" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-lime-400 border-2 border-black" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 block tracking-wide">Good Morning</span>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Samantha</span>
              <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
            </h2>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-400/70 pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, playlists, artists, or genres..."
            className="w-full pl-11 pr-4 py-2 sm:py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] focus:bg-slate-900 border border-white/10 focus:border-lime-400/70 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none transition-all focus:shadow-[0_0_20px_rgba(163,230,53,0.25)]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded-full bg-white/10 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Actions: View Switcher & Notification Bell */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          
          {/* Sub-view Nav Pills */}
          <div className="flex items-center p-1 rounded-full bg-slate-900/90 border border-white/10">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'discover' 
                  ? 'bg-lime-400 text-slate-950 shadow-[0_0_14px_rgba(163,230,53,0.6)] font-black' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library' 
                  ? 'bg-lime-400 text-slate-950 shadow-[0_0_14px_rgba(163,230,53,0.6)] font-black' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setActiveTab('nowPlaying')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'nowPlaying' 
                  ? 'bg-lime-400 text-slate-950 shadow-[0_0_14px_rgba(163,230,53,0.6)] font-black' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Full Player
            </button>
          </div>

          {/* Notification Bell Dropdown (High z-index, Perfectly Spaced & Styled) */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="relative p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-lime-400/50 text-slate-200 hover:text-white transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
            </button>

            {showNotificationModal && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 p-4 rounded-3xl bg-slate-950 border border-lime-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[100] space-y-3 backdrop-blur-3xl animate-fadeIn">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                      Notifications
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-lime-400/20 border border-lime-400/30 text-lime-300 text-[10px] font-mono font-bold">
                      3 New
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowNotificationModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 hover:border-lime-400/30 transition-all space-y-1.5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-lime-400 font-bold uppercase tracking-wide flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        <span>Fresh Drop</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">20m ago</span>
                    </div>
                    <p className="text-xs text-white font-bold leading-snug">
                      🎧 New Release: "Neon Fields - Better Days" is now live in Synthwave!
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 hover:border-lime-400/30 transition-all space-y-1.5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>Playlist Updated</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">2h ago</span>
                    </div>
                    <p className="text-xs text-white font-bold leading-snug">
                      🔥 "Running Hits" refreshed with 10 high-energy workout tracks.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 hover:border-lime-400/30 transition-all space-y-1.5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wide flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>System</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Yesterday</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-snug">
                      ✨ Hi-Fi Lossless streaming engine active for all audio outputs.
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">AudioVido Notifications</span>
                  <button 
                    onClick={() => setShowNotificationModal(false)}
                    className="text-lime-400 font-bold hover:text-lime-300 transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEW CONTENT: DISCOVER / LIBRARY / EXPANDED PLAYER */}
      {/* ========================================================================= */}
      
      {/* --- SUB-VIEW A: DISCOVER (HARMONIOUS 2-COLUMN HERO + LIQUID GLASS PLAYLISTS) --- */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          
          {/* Genre Filter Pills (Screen 1 Pill Bar) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {GENRES.map(genre => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer select-none active:scale-95 ${
                    isActive 
                      ? 'bg-lime-400 text-slate-950 shadow-[0_0_16px_rgba(163,230,53,0.5)] border border-lime-300 scale-[1.02]' 
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-lime-400/40'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* TOP 2-COLUMN BALANCED HERO: "FEEL THE VIBE" (LEFT) + "TRENDING HITS" (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            
            {/* 1. LEFT: "Feel the vibe" Featured Hero Banner */}
            <div className="relative rounded-[32px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-teal-500 via-emerald-400 to-lime-300 shadow-[0_20px_45px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-5 group min-h-[300px]">
              
              {/* Decorative Holographic Specular Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none" />

              {/* Text Plate on Left */}
              <div className="relative z-10 space-y-2.5 max-w-xs text-center sm:text-left flex-1">
                <span className="text-[10.5px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-black/35 text-white border border-white/20 backdrop-blur-md inline-block">
                  FEATURED FOR YOU
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  Feel the vibe
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-slate-900/85">
                  Fresh playlists curated every week to keep your rhythm flowing smoothly.
                </p>

                {/* Big Circular Dark Play Button */}
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                  <button 
                    onClick={() => {
                      const firstTrack = allTracks[0];
                      if (firstTrack) onSelectTrack(firstTrack);
                    }}
                    className="w-12 h-12 rounded-full bg-slate-950 text-white hover:text-lime-300 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20 group/play"
                    title="Play Featured"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5 group-hover/play:fill-lime-300 transition-colors" />
                  </button>
                  <span className="text-xs font-black text-slate-950">Start Listening</span>
                </div>
              </div>

              {/* Girl with Headphones Cutout Visual Art */}
              <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-2xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.45)] border-2 border-white/40 group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80" 
                  alt="Feel the vibe" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                  <span className="text-[9.5px] font-bold text-white uppercase tracking-wider bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                    Curated Mix #42
                  </span>
                </div>
              </div>

            </div>

            {/* 2. RIGHT: "Trending Hits & Recommended Tracks" (Matching Height & Layout) */}
            <div className="rounded-[32px] p-5 sm:p-6 bg-slate-950/85 border border-white/10 backdrop-blur-3xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between space-y-3 min-h-[300px]">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-sm font-black text-lime-400 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending Hits & Curated Tracks</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{filteredTracks.length} tracks</span>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredTracks.slice(0, 6).map((track, idx) => {
                  const isCurrent = currentTrack.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => onSelectTrack(track)}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                        isCurrent 
                          ? 'bg-lime-400/15 border-lime-400/50 shadow-[0_0_12px_rgba(163,230,53,0.2)]' 
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="w-4 text-center text-[11px] font-mono text-slate-400">
                          {isCurrent && isPlaying ? (
                            <span className="text-lime-400 font-bold animate-pulse">▶</span>
                          ) : (
                            idx + 1
                          )}
                        </span>

                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow border border-white/10">
                          <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className={`text-xs font-bold truncate ${isCurrent ? 'text-lime-300' : 'text-white'}`}>
                            {track.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[9.5px] font-sans px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-slate-300">
                          {track.genre}
                        </span>
                        <button
                          onClick={(e) => toggleLikeTrack(track.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedTracks[track.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <span className="font-mono text-[9.5px] text-slate-400">{track.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                <span className="text-lime-400/90 font-medium">Click track to play immediately</span>
                <button 
                  onClick={() => setActiveTab('library')}
                  className="hover:text-white font-bold text-lime-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View all tracks</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* POPULAR PLAYLISTS SECTION (Redesigned: Clean Liquid Glass Cards, No Tag on Top-Left) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Popular Playlists</span>
                <Flame className="w-4 h-4 text-lime-400" />
              </h3>
              <button 
                onClick={() => setActiveTab('library')}
                className="text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
              >
                See all playlists
              </button>
            </div>

            {/* Playlists Grid in 4 Columns (Sleek Liquid Glass Textured Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredPlaylists.map(playlist => (
                <div 
                  key={playlist.id}
                  onClick={() => {
                    const matched = allTracks.find(t => t.genre.toLowerCase().includes(playlist.category.toLowerCase())) || allTracks[0];
                    if (matched) onSelectTrack(matched);
                  }}
                  className="group relative flex flex-col justify-between p-3.5 rounded-[24px] bg-gradient-to-b from-white/[0.07] via-slate-900/60 to-slate-950/80 hover:from-white/[0.12] hover:to-slate-900/90 border border-white/10 hover:border-lime-400/50 backdrop-blur-2xl transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_35px_rgba(163,230,53,0.15)] space-y-3"
                >
                  {/* Subtle Top Specular Sheen */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-t-[24px]" />

                  {/* Thumbnail Cover with Aspect Ratio (Clean, No Top-Left Pill) */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-white/10 group-hover:scale-102 transition-transform duration-300">
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-colors" />
                    
                    {/* Hover Glowing Play Button */}
                    <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.8)] hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between min-w-0">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-white group-hover:text-lime-300 transition-colors truncate">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {playlist.subtitle}
                      </p>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(playlist.id, e);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 ml-2"
                      title="Favorite"
                    >
                      <Heart className={`w-4 h-4 ${likedTracks[playlist.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-lime-400/80 font-bold border-t border-white/5 pt-2 flex items-center justify-between">
                    <span>{playlist.category}</span>
                    <span className="text-slate-400 font-normal">{playlist.songCount} songs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- SUB-VIEW B: MY LIBRARY (SCREEN 3 IN IMAGE) --- */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          
          {/* Library Category Pill Switcher (Screen 3 Top Pills: Playlists, Artists, Albums, Songs) */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['Playlists', 'Artists', 'Albums', 'Songs'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setLibraryCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    libraryCategory === cat 
                      ? 'bg-lime-400 text-slate-950 shadow-[0_0_16px_rgba(163,230,53,0.55)] font-black border border-lime-300' 
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-white/10 hover:border-lime-400/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold">Sort by: Recently Added ∨</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-[11px]">
                {filteredPlaylists.length} Collections
              </span>
            </div>
          </div>

          {/* Library Playlist Rows (Exact Match to Screen 3 List Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaylists.map(playlist => (
              <div 
                key={playlist.id}
                onClick={() => {
                  const matched = allTracks.find(t => t.genre.toLowerCase().includes(playlist.category.toLowerCase())) || allTracks[0];
                  if (matched) onSelectTrack(matched);
                }}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-lime-400/40 transition-all cursor-pointer shadow-lg hover:shadow-lime-500/10"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border border-white/10 group-hover:scale-105 transition-transform">
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors truncate">
                      {playlist.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {playlist.subtitle}
                    </p>
                    <span className="text-[11px] font-mono text-lime-400 font-bold block">
                      {playlist.songCount} songs
                    </span>
                  </div>
                </div>

                {/* Round Play Button on Right (Matching Screen 3) */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const matched = allTracks.find(t => t.genre.toLowerCase().includes(playlist.category.toLowerCase())) || allTracks[0];
                      if (matched) onSelectTrack(matched);
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-lime-400 hover:text-slate-950 text-white flex items-center justify-center transition-all cursor-pointer group-hover:scale-110 shadow-md"
                    title="Play Playlist"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>

                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* All Individual Songs Table in Library */}
          <div className="rounded-[28px] p-5 bg-slate-950/80 border border-white/10 space-y-3">
            <h3 className="text-sm font-black text-lime-400 uppercase tracking-wider flex items-center gap-2">
              <Disc3 className="w-4 h-4" />
              <span>All Tracks in Library</span>
            </h3>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredTracks.map((track, idx) => {
                const isCurrent = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      isCurrent 
                        ? 'bg-lime-400/15 border-lime-400/50 shadow-[0_0_15px_rgba(163,230,53,0.2)]' 
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-6 text-center text-xs font-mono text-slate-400">
                        {isCurrent && isPlaying ? (
                          <span className="text-lime-400 font-bold animate-pulse">▶</span>
                        ) : (
                          idx + 1
                        )}
                      </span>

                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow border border-white/10">
                        <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h5 className={`text-xs font-bold truncate ${isCurrent ? 'text-lime-300' : 'text-white'}`}>
                          {track.title}
                        </h5>
                        <p className="text-[10.5px] text-slate-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-slate-300">
                        {track.genre}
                      </span>
                      <button
                        onClick={(e) => toggleLikeTrack(track.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedTracks[track.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <span className="font-mono text-[10px] text-slate-400">{track.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* --- SUB-VIEW C: FULL NOW PLAYING IMMERSIVE PLAYER (SCREEN 2 IN IMAGE) --- */}
      {activeTab === 'nowPlaying' && (
        <div className="max-w-2xl mx-auto rounded-[36px] p-6 sm:p-8 bg-slate-950 border border-white/15 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-6">
          
          {/* Top Bar: Now Playing with Collapse Chevron */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveTab('discover')}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            <span className="text-xs font-black uppercase tracking-[0.2em] text-lime-400">
              Now Playing
            </span>

            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Large Hero Album Cover */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.9)] border-2 border-white/20">
            <img 
              src={currentTrack.artistPhoto || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80'} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Neon Glow Script Title like in image ("Better Days") */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono text-lime-300 font-bold tracking-widest uppercase">
                  {currentTrack.genre}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-xl tracking-tight">
                  {currentTrack.title}
                </h2>
              </div>

              {/* Wave Equalizer */}
              <div className="flex items-end gap-1 h-6 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20">
                <span className={`w-1.5 bg-lime-400 rounded-full transition-all ${isPlaying ? 'h-5 animate-pulse' : 'h-2'}`} />
                <span className={`w-1.5 bg-lime-300 rounded-full transition-all ${isPlaying ? 'h-4 animate-bounce' : 'h-3'}`} />
                <span className={`w-1.5 bg-emerald-400 rounded-full transition-all ${isPlaying ? 'h-6 animate-pulse' : 'h-1.5'}`} />
              </div>
            </div>
          </div>

          {/* Song Title, Artist & Like */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">{currentTrack.title}</h3>
              <p className="text-sm font-bold text-lime-300">{currentTrack.artist}</p>
            </div>

            <button 
              onClick={(e) => toggleLikeTrack(currentTrack.id, e)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-all"
            >
              <Heart className={`w-6 h-6 ${isCurrentLiked ? 'fill-lime-400 text-lime-400 filter drop-shadow-[0_0_10px_#a3e635]' : 'text-slate-400 hover:text-white'}`} />
            </button>
          </div>

          {/* Draggable Progress Bar */}
          <div className="space-y-2">
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                handleSeek(pct);
              }}
              className="relative w-full h-2.5 rounded-full bg-white/15 hover:h-3 transition-all cursor-pointer overflow-hidden group/scrub2"
            >
              <div 
                className="h-full bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 rounded-full relative"
                style={{ width: `${trackProgress}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#a3e635]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
              <span>{formatTime(currentTrackSeconds)}</span>
              <span>{currentTrack.duration || '3:48'}</span>
            </div>
          </div>

          {/* Full Large Transport Controls */}
          <div className="flex items-center justify-between px-4 pt-2">
            <button 
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${isShuffle ? 'text-lime-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button 
              onClick={onPrevTrack}
              className="p-3 text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <SkipBack className="w-7 h-7 fill-white" />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-18 h-18 rounded-full bg-gradient-to-tr from-lime-400 via-lime-300 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.8),inset_0_2px_4px_rgba(255,255,255,0.9)] border-2 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-slate-950 stroke-slate-950" />
              ) : (
                <Play className="w-8 h-8 fill-slate-950 stroke-slate-950 ml-1" />
              )}
            </button>

            <button 
              onClick={onNextTrack}
              className="p-3 text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <SkipForward className="w-7 h-7 fill-white" />
            </button>

            <button 
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${isRepeat ? 'text-lime-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Playing on Headphones routing pill */}
          <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-lime-400" />
              <span className="text-xs font-bold text-white">Playing on {connectedDevice}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-lime-400 rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-lime-300 rounded-full animate-bounce" />
              <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOCKED DOCKED 3D LIQUID GLASS BOTTOM MEDIA CONTROLLER (PINNED ON SCROLL) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-3rem)] max-w-3xl z-50 pointer-events-auto">
        <div className="relative w-full px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-[26px] sm:rounded-[32px] backdrop-blur-3xl bg-slate-950/92 border border-lime-400/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.22),_0_20px_50px_rgba(0,0,0,0.9),_0_0_25px_rgba(163,230,53,0.18)] flex items-center justify-between gap-3 sm:gap-5 transition-all duration-300 min-h-[78px] sm:min-h-[86px]">
          
          {/* Inner Rounded Background Layer for Gradients with overflow-hidden */}
          <div className="absolute inset-0 pointer-events-none rounded-[26px] sm:rounded-[32px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-teal-400/80 via-lime-400 to-emerald-400/80" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-lime-400/30 to-teal-500/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/40" />
          </div>

          {/* 1. LEFT ZONE: Current Track Identity with Circular Cover Art (Prominent, Sharp, Larger) */}
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 max-w-[130px] sm:max-w-[210px] text-left relative z-10 shrink-0">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 border-2 border-lime-300/70 shadow-[0_0_15px_rgba(163,230,53,0.4)] relative ring-1 ring-lime-500/30 group/cov">
              <img 
                src={currentTrack.artistPhoto || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80'} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                {currentTrack.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-lime-300/85 font-sans font-medium truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={(e) => toggleLikeTrack(currentTrack.id, e)}
              className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-lime-400 transition-colors cursor-pointer shrink-0"
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-lime-400 text-lime-400 filter drop-shadow-[0_0_6px_#a3e635]' : ''}`} />
            </button>
          </div>

          {/* 2. CENTER ZONE: Transport Controls (Top) & Interactive Time Scrubber (Bottom) */}
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-md flex flex-col items-center gap-1.5 sm:gap-2 px-1 sm:px-3 relative z-10">
            
            {/* Transport Buttons Cradle */}
            <div className="relative flex items-center gap-1 sm:gap-2.5 px-3 sm:px-4 py-1 rounded-full bg-slate-900/85 border border-lime-400/35 backdrop-blur-xl shadow-[0_4px_22px_rgba(163,230,53,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.15)]">
              {/* Shuffle Button */}
              <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`hidden sm:inline-flex p-1.5 rounded-full transition-all cursor-pointer ${
                  isShuffle ? 'text-lime-300 bg-lime-400/20 shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'text-slate-400 hover:text-white'
                }`}
                title={isShuffle ? "Shuffle On" : "Shuffle Off"}
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={onPrevTrack}
                className="p-1 sm:p-1.5 rounded-full text-slate-300 hover:text-lime-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                title="Previous track"
              >
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </button>

              {/* Big Glowing Lime Play/Pause Button */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-lime-400 via-lime-300 to-emerald-400 text-slate-950 flex items-center justify-center hover:scale-108 active:scale-95 transition-all shadow-[0_0_20px_rgba(163,230,53,0.75)] cursor-pointer group/playbtn shrink-0 border border-white"
                title={isPlaying ? "Pause" : "Play"}
              >
                <span className={`absolute -inset-1 rounded-full border border-lime-300/40 pointer-events-none ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-slate-950 text-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
                )}
              </button>

              <button 
                onClick={onNextTrack}
                className="p-1 sm:p-1.5 rounded-full text-slate-300 hover:text-lime-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                title="Next track"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </button>

              {/* Repeat Button */}
              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`hidden sm:inline-flex p-1.5 rounded-full transition-all cursor-pointer ${
                  isRepeat ? 'text-lime-300 bg-lime-400/20 shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'text-slate-400 hover:text-white'
                }`}
                title={isRepeat ? "Repeat On" : "Repeat Off"}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Track Progress Scrubber with Precision Synchronized Time */}
            <div className="w-full h-5 sm:h-6 flex items-center gap-1.5 sm:gap-2.5">
              <span className="text-[9.5px] sm:text-[11px] font-mono font-bold text-lime-300/90 w-7 sm:w-8 text-right shrink-0 select-none">
                {formatTime(currentTrackSeconds)}
              </span>
              
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                  handleSeek(newPct);
                }}
                className="flex-1 h-1.5 sm:h-2 bg-white/10 hover:bg-white/20 rounded-full overflow-hidden cursor-pointer relative group/scrubber transition-all"
              >
                <div 
                  className="h-full bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 rounded-full relative transition-all duration-150" 
                  style={{ width: `${Math.min(100, Math.max(0, trackProgress))}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#a3e635] opacity-0 group-hover/scrubber:opacity-100 transition-opacity" />
                </div>
              </div>

              <span className="text-[9.5px] sm:text-[11px] font-mono font-medium text-slate-400 w-7 sm:w-8 text-left shrink-0 select-none">
                {currentTrack.duration || '3:48'}
              </span>
            </div>

          </div>

          {/* 3. RIGHT ZONE: Connected Device Selector (Top) + Clean Borderless Volume with Dynamic Responsive Jumping Lines (Bottom) */}
          <div className="flex flex-col items-stretch justify-between self-stretch shrink-0 relative z-20 py-0.5 gap-1.5 w-[140px] sm:w-[175px]">
            
            {/* Top Item: Headphones Device Selector Pill (Clean & Polished) */}
            <div className="relative w-full">
              <button
                onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 border border-lime-400/30 text-[10px] sm:text-xs font-bold text-white transition-all cursor-pointer shadow-[0_2px_10px_rgba(163,230,53,0.15)]"
                title="Audio Output Device"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Headphones className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span className="truncate text-lime-200 text-[10.5px] sm:text-[11.5px] font-sans">
                    {connectedDevice}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* Device Selector Menu Dropdown (Fully visible, Floating Above with high z-index) */}
              {showDeviceMenu && (
                <div className="absolute bottom-full mb-3 right-0 w-52 sm:w-56 p-2 rounded-2xl bg-slate-950 border border-lime-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-[100] space-y-1 backdrop-blur-3xl animate-fadeIn">
                  <div className="text-[9.5px] font-bold text-lime-400 uppercase tracking-wider px-2 py-1 border-b border-white/10 flex items-center justify-between">
                    <span>Audio Output</span>
                    <button 
                      onClick={() => setShowDeviceMenu(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {['My Headphones', 'Studio Monitors (Hi-Fi)', 'Living Room Soundbar', 'MacBook Speakers'].map(dev => (
                    <button
                      key={dev}
                      onClick={() => {
                        setConnectedDevice(dev);
                        setShowDeviceMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                        connectedDevice === dev 
                          ? 'bg-lime-400 text-slate-950 font-bold shadow-sm' 
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{dev}</span>
                      {connectedDevice === dev && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Item: Clean Borderless Volume with Height-Responsive Animated Lines */}
            <div className="w-full h-5 sm:h-6 flex items-center justify-between gap-1.5 sm:gap-2 px-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <button 
                  onClick={() => setVolumeLevel(v => (v > 0 ? 0 : 75))}
                  className="text-slate-300 hover:text-lime-300 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title={volumeLevel === 0 ? "Unmute" : "Mute"}
                >
                  {volumeLevel === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-lime-400" />
                  )}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volumeLevel}
                  onChange={(e) => setVolumeLevel(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-lime-400"
                  title={`Volume: ${volumeLevel}%`}
                />
              </div>

              {/* 3 Animated Green Equalizer Jumping Bars (Height dynamically scales with Volume Level!) */}
              <div className="flex items-end gap-1 shrink-0 pl-1 h-5">
                <span 
                  className={`w-0.5 bg-lime-400 rounded-full transition-all duration-200 ${isPlaying && volumeLevel > 0 ? 'animate-pulse' : ''}`}
                  style={{ 
                    height: `${volumeLevel === 0 ? 2 : Math.max(3, Math.round(13 * (volumeLevel / 100)))}px`,
                    opacity: volumeLevel === 0 ? 0.3 : 0.6 + (volumeLevel / 250)
                  }} 
                />
                <span 
                  className={`w-0.5 bg-lime-300 rounded-full transition-all duration-200 ${isPlaying && volumeLevel > 0 ? 'animate-bounce' : ''}`}
                  style={{ 
                    height: `${volumeLevel === 0 ? 2 : Math.max(4, Math.round(19 * (volumeLevel / 100)))}px`,
                    opacity: volumeLevel === 0 ? 0.3 : 0.7 + (volumeLevel / 250)
                  }} 
                />
                <span 
                  className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying && volumeLevel > 0 ? 'animate-pulse' : ''}`}
                  style={{ 
                    height: `${volumeLevel === 0 ? 2 : Math.max(3, Math.round(15 * (volumeLevel / 100)))}px`,
                    opacity: volumeLevel === 0 ? 0.3 : 0.6 + (volumeLevel / 250)
                  }} 
                />
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
