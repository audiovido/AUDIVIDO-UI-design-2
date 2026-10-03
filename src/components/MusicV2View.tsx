/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, 
  Search, Bell, MoreVertical, SlidersHorizontal, Music2, 
  Headphones, Radio, Disc3, Sparkles, Volume2, VolumeX, ChevronDown, ChevronUp,
  ListMusic, Flame, Check, Mic2, Compass, Layers, Monitor,
  Laptop, Share2, Plus, ArrowUpRight, TrendingUp, CheckCircle2,
  X, Clock, Music, Loader2, Globe
} from 'lucide-react';
import { Track } from '../data/auraStore';
import { musicApi } from '../services/musicApiService';
import { AudioSynth } from '../utils/AudioSynth';

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
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  trackProgress: number;
  currentTrackSeconds: number;
  audioDuration?: number;
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
  audioDuration = 30,
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
  const [activeTab, setActiveTab] = useState<'discover' | 'library'>('discover');
  const [isPlayerExpanded, setIsPlayerExpanded] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [libraryCategory, setLibraryCategory] = useState<'Playlists' | 'Artists' | 'Albums' | 'Songs'>('Playlists');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiTracks, setApiTracks] = useState<Track[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState<boolean>(false);
  const [selectedInfoTrack, setSelectedInfoTrack] = useState<Track | null>(null);
  const [showTrackInfoModal, setShowTrackInfoModal] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<string>('My Headphones');
  const [showDeviceMenu, setShowDeviceMenu] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(75);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  const calculateScrubberPct = (clientX: number, target: HTMLElement): number => {
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const clickX = clientX - rect.left;
    return Math.min(100, Math.max(0, (clickX / rect.width) * 100));
  };

  const handlePointerDownScrubber = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!currentTrack) return;
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}
    setIsScrubbing(true);
    const newPct = calculateScrubberPct(e.clientX, target);
    handleSeek(newPct);
  };

  const handlePointerMoveScrubber = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing || !currentTrack) return;
    const newPct = calculateScrubberPct(e.clientX, e.currentTarget);
    handleSeek(newPct);
  };

  const handlePointerUpScrubber = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsScrubbing(false);
  };

  const GENRES = ['All', 'New Release', 'Chill', 'Workout', 'Rock', 'Party', 'Lo-Fi', 'Acoustic'];

  // Synchronize volume level with Web Audio Synth and HTML5 audio player
  useEffect(() => {
    AudioSynth.setVolume(volumeLevel / 100);
    const audioTags = document.querySelectorAll('audio');
    audioTags.forEach(a => {
      a.volume = volumeLevel / 100;
    });
  }, [volumeLevel]);

  // Debounced live Apple iTunes search in Music 2
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setApiTracks([]);
      setIsSearchingApi(false);
      return;
    }

    setIsSearchingApi(true);
    const timer = setTimeout(async () => {
      try {
        const results = await musicApi.searchTracks(q, 'all', 12);
        const mapped: Track[] = results.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          album: item.album,
          artistPhoto: item.coverUrl,
          duration: item.duration,
          durationSeconds: item.durationSeconds,
          previewUrl: item.previewUrl,
          year: item.year,
          source: item.source,
          genre: item.genre,
          vibes: ['Global Stream', item.genre],
          cozyIndex: 85,
          colorFrom: '#10b981',
          colorTo: '#84cc16',
          audioSynthType: 'music',
          artistBio: `Official track "${item.title}" by ${item.artist} from the album "${item.album}" (${item.year || 'Official Release'}). Genre: ${item.genre}. Source: Apple iTunes Global Catalog.`
        }));
        setApiTracks(mapped);
      } catch (err) {
        console.warn('API search error in Music 2:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const isCurrentLiked = currentTrack ? !!likedTracks[currentTrack.id] : false;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn py-2 pb-44 select-none font-sans relative">
      
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR: SAMANTHA (LEFT) | SEARCH (CENTER) | NOTIFICATIONS (RIGHT) */}
      {/* ========================================================================= */}
      <div className="relative z-40 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-[32px] bg-slate-950/85 border border-white/15 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15),_0_15px_40px_rgba(0,0,0,0.85)]">
        
        {/* LEFT ZONE: User Profile Greeting (Samantha) */}
        <div className="flex items-center gap-3.5 shrink-0 self-start md:self-auto">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-lime-400/80 shadow-[0_0_16px_rgba(163,230,53,0.4)] shrink-0 ring-2 ring-lime-500/20">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
              alt="Samantha" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-lime-400 border-2 border-black" />
          </div>
          <div className="text-left">
            <span className="text-xs font-medium text-slate-400 block tracking-wide">Good Morning</span>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Samantha</span>
              <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
            </h2>
          </div>
        </div>

        {/* CENTER ZONE: Search Input (Centered in Bar) */}
        <div className="relative flex-1 max-w-lg w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-400/70 pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, playlists, artists, or genres..."
            className="w-full pl-11 pr-9 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] focus:bg-slate-900 border border-white/10 focus:border-lime-400/70 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.08)] focus:shadow-[0_0_20px_rgba(163,230,53,0.25)]"
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

        {/* RIGHT ZONE: Notification Bell (Far Right with Clean Downward Dropping Modal) */}
        <div className="relative shrink-0 self-end md:self-auto flex items-center justify-end">
          <button 
            onClick={() => setShowNotificationModal(!showNotificationModal)}
            className="relative p-2.5 sm:p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-lime-400/50 text-slate-200 hover:text-white transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
          </button>

          {showNotificationModal && (
            <>
              {/* Transparent click-outside dismiss backdrop */}
              <div 
                className="fixed inset-0 z-[9998] cursor-default" 
                onClick={() => setShowNotificationModal(false)} 
              />
              <div className="absolute top-full mt-3.5 right-0 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm p-4 sm:p-4.5 rounded-3xl bg-slate-950/98 border border-lime-400/50 shadow-[0_30px_70px_rgba(0,0,0,0.95),_0_0_30px_rgba(163,230,53,0.15)] z-[9999] space-y-3 backdrop-blur-3xl animate-fadeIn">
                
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
            </>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-VIEW NAVIGATION (DISCOVER, LIBRARY) IN 3D LIQUID GLASS              */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-start">
        <div className="flex items-center p-1.5 rounded-full bg-slate-900/90 border border-lime-400/25 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15),_0_10px_25px_rgba(0,0,0,0.7)]">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'discover' 
                ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 shadow-[0_0_18px_rgba(163,230,53,0.7)] border border-white/60' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'library' 
                ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 shadow-[0_0_18px_rgba(163,230,53,0.7)] border border-white/60' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Library
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN VIEW CONTENT: DISCOVER / LIBRARY / EXPANDED PLAYER */}
      {/* ========================================================================= */}
      
      {/* --- SUB-VIEW A: DISCOVER (HARMONIOUS 2-COLUMN HERO + LIQUID GLASS PLAYLISTS) --- */}
      {activeTab === 'discover' && (
        <div className="space-y-6">

          {/* LIVE SEARCH RESULTS (APPLE ITUNES API + LOCAL TRACKS) */}
          {searchQuery && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-lime-400/40 backdrop-blur-3xl shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-lime-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Search Results for "{searchQuery}"
                  </h3>
                </div>
                {isSearchingApi ? (
                  <span className="text-[10px] sm:text-xs font-mono text-lime-300 flex items-center gap-1.5 bg-lime-400/10 px-2.5 py-1 rounded-full border border-lime-400/30">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-lime-400" />
                    Searching Global Catalog...
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400">
                    {apiTracks.length > 0 ? `${apiTracks.length} tracks found` : `${filteredTracks.length} tracks`}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(apiTracks.length > 0 ? apiTracks : filteredTracks).map(t => {
                  const isCurrent = currentTrack?.id === t.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedInfoTrack(t);
                        setShowTrackInfoModal(true);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all group cursor-pointer border ${
                        isCurrent 
                          ? 'bg-lime-500/20 border-lime-400/80 shadow-[0_0_20px_rgba(163,230,53,0.35)]' 
                          : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/5 hover:border-lime-400/40'
                      }`}
                      title="Click card to view track details & lyrics"
                    >
                      {/* Artwork with direct Play/Pause icon trigger */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrent) {
                            setIsPlaying(!isPlaying);
                          } else {
                            onSelectTrack(t);
                          }
                        }}
                        className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md cursor-pointer group/art"
                        title={isTrackPlaying ? "Pause" : "Play track"}
                      >
                        <img src={t.artistPhoto} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className={`absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity ${
                          isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover/art:opacity-100'
                        }`}>
                          {isTrackPlaying ? (
                            <Pause className="w-5 h-5 text-lime-400 fill-lime-400" />
                          ) : (
                            <Play className="w-5 h-5 text-lime-400 fill-lime-400" />
                          )}
                        </div>
                      </div>

                      {/* Track Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs sm:text-sm font-bold truncate transition-colors ${isCurrent ? 'text-lime-300' : 'text-white group-hover:text-lime-300'}`}>
                            {t.title}
                          </p>
                          {t.isFullTrack && (
                            <span className="text-[8px] font-mono font-bold bg-lime-400/20 text-lime-300 border border-lime-400/40 px-1 py-0.2 rounded shrink-0">
                              FULL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 truncate font-medium">{t.artist}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono text-lime-400">{t.genre}</span>
                          {t.year && <span className="text-[9px] font-mono text-slate-400">· {t.year}</span>}
                          {t.duration && <span className="text-[9px] font-mono text-slate-400">· {t.duration}</span>}
                        </div>
                      </div>

                      {/* Explicit Play Button on the Right: Directly streams in bottom player */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrent) {
                            setIsPlaying(!isPlaying);
                          } else {
                            onSelectTrack(t);
                          }
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer border ${
                          isTrackPlaying 
                            ? 'bg-lime-400 text-slate-950 border-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.8)]' 
                            : 'bg-lime-400/20 hover:bg-lime-400 text-lime-300 hover:text-slate-950 border-lime-400/30'
                        }`}
                        title={isTrackPlaying ? "Pause" : "Play in bottom player"}
                      >
                        {isTrackPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2-COLUMN MAIN DISCOVERY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            
            {/* LEFT COLUMN: 1) "Feel the vibe" Hero Banner + 2) "Popular Playlists" List */}
            <div className="space-y-5">
              
              {/* 1. "Feel the vibe" Featured Hero Banner */}
              <div className="relative rounded-[32px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-teal-500 via-emerald-400 to-lime-300 shadow-[0_20px_45px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-5 group min-h-[290px]">
                
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
                        setSearchQuery('Michael Jackson Billie Jean');
                      }}
                      className="w-12 h-12 rounded-full bg-slate-950 text-white hover:text-lime-300 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20 group/play"
                      title="Search & Play Worldwide Hits"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5 group-hover/play:fill-lime-300 transition-colors" />
                    </button>
                    <span className="text-xs font-black text-slate-950">Search Global Hits</span>
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

              {/* 2. "Popular Playlists" List (Left Half, Below Feel the Vibe) */}
              <div className="rounded-[32px] p-5 sm:p-6 bg-slate-950/80 border border-white/10 backdrop-blur-3xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <h3 className="text-sm font-black text-lime-400 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-lime-400" />
                    <span>Popular Playlists</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('library')}
                    className="text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
                  >
                    See all ({filteredPlaylists.length})
                  </button>
                </div>

                {/* Playlists List Rows with Medium Sized Album Thumbnails */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredPlaylists.map(playlist => (
                    <div 
                      key={playlist.id}
                      onClick={() => {
                        setSearchQuery(playlist.title);
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-transparent hover:border-lime-400/35 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(163,230,53,0.12)]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Thumbnail: Medium sized (larger than track icons, sleek for lists) */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/10 group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src={playlist.coverUrl} 
                            alt={playlist.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-7 h-7 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center shadow-lg">
                              <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors truncate">
                            {playlist.title}
                          </h4>
                          <p className="text-xs text-slate-400 truncate">
                            {playlist.subtitle}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] font-mono font-bold text-lime-400">
                              {playlist.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              • {playlist.songCount} songs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Heart Action */}
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeTrack(playlist.id, e);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Favorite"
                        >
                          <Heart className={`w-4 h-4 ${likedTracks[playlist.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: "Trending Hits & Worldwide Search" */}
            <div className="rounded-[32px] p-5 sm:p-6 bg-slate-950/85 border border-white/10 backdrop-blur-3xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between space-y-4 min-h-[300px]">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-sm font-black text-lime-400 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Instant Worldwide Search</span>
                </h3>
                <span className="text-xs text-lime-300 font-mono">Live Catalog</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Search any song, artist, or album worldwide. All results feature official HD cover art, full metadata, and authentic 30-second live audio previews:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Billie Jean Michael Jackson",
                    "High Hopes Pink Floyd",
                    "Bohemian Rhapsody Queen",
                    "Viva La Vida Coldplay",
                    "Blinding Lights The Weeknd",
                    "Lose Yourself Eminem",
                    "Interstellar Hans Zimmer",
                    "Someone Like You Adele",
                    "Get Lucky Daft Punk"
                  ].map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-lime-400 hover:text-slate-950 border border-white/10 hover:border-lime-400 text-xs font-semibold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Search className="w-3 h-3 text-lime-400 group-hover:text-slate-950" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-lime-400 font-bold block">
                  Public Music Stream Architecture
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Connected directly to Apple iTunes Global Catalog & Deezer public audio streams. Zero synthetic sound. Real music playback.
                </p>
              </div>

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
                const isCurrent = currentTrack?.id === track.id;
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

      {/* ========================================================================= */}
      {/* 3. LOCKED DOCKED 3D LIQUID GLASS BOTTOM MEDIA CONTROLLER (PINNED ON SCROLL) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-3rem)] max-w-3xl z-50 pointer-events-auto">
        
        {/* ========================================================================= */}
        {/* EXPANDED FULL TRACK INFO & ARTIST SPOTLIGHT (OPENS UPWARDS ON CIRCLE TAP) */}
        {/* ========================================================================= */}
        {isPlayerExpanded && (
          <div className="relative w-full mb-3 p-5 sm:p-6 rounded-[28px] sm:rounded-[36px] backdrop-blur-3xl bg-slate-950/95 border border-lime-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(163,230,53,0.2)] animate-fadeIn">
            
            {/* Top Bar of Expanded Card */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-lime-300">
                  Track Details & Artist Spotlight
                </span>
                <span className="px-2 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-[9.5px] font-mono text-lime-300">
                  Lossless 24-bit/96kHz
                </span>
              </div>
              
              <button
                onClick={() => setIsPlayerExpanded(false)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                title="Collapse Details"
              >
                <ChevronDown className="w-4 h-4 text-lime-300" />
                <span className="hidden sm:inline text-[11px]">Close</span>
              </button>
            </div>

            {/* Main Content: Large Rectangular Artwork (Curved Corners) + Comprehensive Clean Metadata */}
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-7">
              
              {/* Large Interactive Rectangular Artwork with Curved Corners (Click to Collapse) */}
              <div 
                onClick={() => setIsPlayerExpanded(false)}
                className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 border-2 border-lime-300/80 shadow-[0_0_35px_rgba(163,230,53,0.35)] ring-2 ring-lime-500/25 group/bigcov cursor-pointer active:scale-95 transition-all hover:scale-102"
                title="Click artwork to collapse"
              >
                <img 
                  src={currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'} 
                  alt={currentTrack?.title || 'Music'} 
                  className="w-full h-full object-cover group-hover/bigcov:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-lime-400/20 pointer-events-none" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/bigcov:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <ChevronDown className="w-8 h-8 text-lime-300 animate-bounce" />
                </div>
              </div>

              {/* Comprehensive Track Metadata Grid (Clean, Balanced, No Clutter) */}
              <div className="flex-1 min-w-0 space-y-3 text-left w-full">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
                    {currentTrack?.title || 'No Track Selected'}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-lime-300 mt-0.5">
                    {currentTrack?.artist || 'Search any song in the search bar above'}
                  </p>
                </div>

                {/* Tag Pills: Album, Year, Genre, Duration */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Album</span>
                    <span className="text-xs font-bold text-white truncate block mt-0.5" title={currentTrack?.album}>
                      {currentTrack?.album || `${currentTrack?.title || 'Single'} (Album)`}
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Year</span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {currentTrack?.year || '2024'}
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Genre</span>
                    <span className="text-xs font-bold text-lime-300 truncate block mt-0.5">
                      {currentTrack?.genre || 'Worldwide Streaming'}
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Duration</span>
                    <span className="text-xs font-mono font-bold text-white block mt-0.5">
                      {currentTrack ? formatTime(audioDuration || 30) : '0:00'}
                    </span>
                  </div>
                </div>

                {/* Artist Bio / Aesthetic Summary */}
                <div className="pt-2 border-t border-white/10 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">About the Track & Sound</span>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      {currentTrack?.artistBio || (currentTrack ? `Original track "${currentTrack.title}" by ${currentTrack.artist} from the album "${currentTrack.album || currentTrack.title}" (${currentTrack.year || 'Official Release'}). Genre: ${currentTrack.genre || 'Music'}. Streamed in 30s High-Fidelity Audio Preview via Global Music Catalog.` : 'Search any song or artist in the search bar above to stream live audio.')}
                    </p>
                  </div>

                  {currentTrack && (
                    <button
                      onClick={(e) => toggleLikeTrack(currentTrack.id, e)}
                      className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-lime-300 transition-all shrink-0 cursor-pointer"
                      title="Favorite Track"
                    >
                      <Heart className={`w-5 h-5 ${isCurrentLiked ? 'fill-lime-400 text-lime-400 drop-shadow-[0_0_8px_#a3e635]' : ''}`} />
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        <div className="relative w-full px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-[26px] sm:rounded-[32px] backdrop-blur-3xl bg-slate-950/92 border border-lime-400/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.22),_0_20px_50px_rgba(0,0,0,0.9),_0_0_25px_rgba(163,230,53,0.18)] flex items-center justify-between gap-3 sm:gap-5 transition-all duration-300 min-h-[78px] sm:min-h-[86px]">
          
          {/* Inner Rounded Background Layer for Gradients with overflow-hidden */}
          <div className="absolute inset-0 pointer-events-none rounded-[26px] sm:rounded-[32px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-teal-400/80 via-lime-400 to-emerald-400/80" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-lime-400/30 to-teal-500/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/40" />
          </div>

          {/* 1. LEFT ZONE: Current Track Identity with Interactive Circular Cover Art (Tap to Expand Upwards) */}
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 max-w-[140px] sm:max-w-[220px] text-left relative z-10 shrink-0">
            {/* Interactive Circular Cover with luminous indicator */}
            <div 
              onClick={() => {
                if (currentTrack) setIsPlayerExpanded(!isPlayerExpanded);
              }}
              className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 border-2 border-lime-300/80 shadow-[0_0_15px_rgba(163,230,53,0.5)] ring-2 ring-lime-500/30 group/cov transition-all ${
                currentTrack ? 'cursor-pointer hover:scale-105 active:scale-95' : 'opacity-75'
              }`}
              title={currentTrack ? (isPlayerExpanded ? "Click to collapse track details" : "Click to expand full track info") : "Search any song to play"}
            >
              <img 
                src={currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'} 
                alt={currentTrack?.title || 'Music'} 
                className="w-full h-full object-cover group-hover/cov:scale-110 transition-transform duration-500" 
              />
              {currentTrack && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cov:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  {isPlayerExpanded ? (
                    <ChevronDown className="w-4 h-4 text-lime-300 animate-bounce" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-lime-300 animate-bounce" />
                  )}
                </div>
              )}
            </div>

            <div 
              className="min-w-0 flex-1 space-y-0.5 cursor-pointer" 
              onClick={() => {
                if (currentTrack) setIsPlayerExpanded(!isPlayerExpanded);
              }}
            >
              <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans hover:text-lime-300 transition-colors">
                {currentTrack?.title || 'Ready to Stream'}
              </h4>
              <p className="text-[10px] sm:text-xs text-lime-300/85 font-sans font-medium truncate">
                {currentTrack?.artist || 'Search any music above'}
              </p>
            </div>
            {currentTrack && (
              <button
                onClick={(e) => toggleLikeTrack(currentTrack.id, e)}
                className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-lime-400 transition-colors cursor-pointer shrink-0"
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-lime-400 text-lime-400 filter drop-shadow-[0_0_6px_#a3e635]' : ''}`} />
              </button>
            )}
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
                onClick={() => {
                  if (currentTrack) {
                    setIsPlaying(!isPlaying);
                  }
                }}
                disabled={!currentTrack}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-lime-400 via-lime-300 to-emerald-400 text-slate-950 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(163,230,53,0.75)] shrink-0 border border-white ${
                  !currentTrack ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-108 active:scale-95'
                }`}
                title={!currentTrack ? "Search a song to play" : (isPlaying ? "Pause" : "Play")}
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
            <div className="w-full h-6 sm:h-7 flex items-center gap-1.5 sm:gap-2.5">
              <span className="text-[9.5px] sm:text-[11px] font-mono font-bold text-lime-300/90 w-7 sm:w-8 text-right shrink-0 select-none">
                {formatTime(currentTrackSeconds)}
              </span>
              
              <div 
                onPointerDown={handlePointerDownScrubber}
                onPointerMove={handlePointerMoveScrubber}
                onPointerUp={handlePointerUpScrubber}
                onPointerCancel={handlePointerUpScrubber}
                className="flex-1 py-2 sm:py-2.5 cursor-pointer relative group/scrubber select-none touch-none"
                title="Click or drag to seek forward / backward"
              >
                {/* Background track rail */}
                <div className="w-full h-1.5 sm:h-2 bg-white/10 group-hover/scrubber:bg-white/20 rounded-full overflow-hidden transition-colors">
                  <div 
                    className="h-full bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(0, trackProgress))}%` }}
                  />
                </div>
                {/* Glowing Thumb Knob Indicator */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-white shadow-[0_0_12px_#a3e635] pointer-events-none transition-all ${
                    isScrubbing ? 'scale-125 opacity-100 ring-2 ring-lime-400' : 'opacity-0 group-hover/scrubber:opacity-100 group-hover/scrubber:scale-110'
                  }`}
                  style={{ left: `${Math.min(100, Math.max(0, trackProgress))}%` }}
                />
              </div>

              <span className="text-[9.5px] sm:text-[11px] font-mono font-medium text-slate-400 w-7 sm:w-8 text-left shrink-0 select-none">
                {currentTrack ? formatTime(audioDuration || currentTrack.durationSeconds || 180) : '0:00'}
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

            {/* Bottom Item: Clean Borderless Volume with Interactive Ascending Candlestick VU Spectrum (Flush Aligned with Top Button) */}
            <div className="w-full h-5 sm:h-6 flex items-center justify-between gap-1.5 sm:gap-2 px-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <button 
                  onClick={() => setVolumeLevel(v => (v > 0 ? 0 : 75))}
                  className="text-slate-300 hover:text-lime-300 transition-colors cursor-pointer flex items-center justify-center shrink-0 p-0.5"
                  title={volumeLevel === 0 ? "Unmute" : `Mute (${volumeLevel}%)`}
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
                  className="w-full h-1 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-lime-400 transition-all"
                  title={`Volume: ${volumeLevel}%`}
                />
              </div>

              {/* Interactive Ascending Candlestick Volume Visualizer (Baseline aligned with volume track, right edge flush with top card) */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newVol = Math.round(Math.min(100, Math.max(0, (clickX / rect.width) * 100)));
                  setVolumeLevel(newVol);
                }}
                className="flex items-end gap-0.5 sm:gap-1 shrink-0 h-5 pb-[5px] sm:pb-[6px] cursor-pointer group/spectrum select-none"
                title={`Volume: ${volumeLevel}% (Click candles to adjust)`}
              >
                {[
                  { threshold: 8, maxH: 6, color: 'from-lime-400 to-lime-300', shadow: 'shadow-[0_0_6px_rgba(163,230,53,0.7)]' },
                  { threshold: 25, maxH: 8.5, color: 'from-lime-400 to-emerald-400', shadow: 'shadow-[0_0_7px_rgba(163,230,53,0.7)]' },
                  { threshold: 45, maxH: 11, color: 'from-lime-300 to-emerald-400', shadow: 'shadow-[0_0_8px_rgba(52,211,153,0.7)]' },
                  { threshold: 65, maxH: 13.5, color: 'from-emerald-400 to-teal-400', shadow: 'shadow-[0_0_9px_rgba(52,211,153,0.75)]' },
                  { threshold: 82, maxH: 16, color: 'from-teal-400 to-cyan-400', shadow: 'shadow-[0_0_10px_rgba(45,212,191,0.8)]' },
                  { threshold: 95, maxH: 18.5, color: 'from-cyan-400 to-sky-300', shadow: 'shadow-[0_0_12px_rgba(56,189,248,0.85)]' },
                ].map((bar, i) => {
                  const isActive = volumeLevel >= bar.threshold;
                  const volumeRatio = volumeLevel / 100;
                  
                  // Height scales dynamically with volume level and audio playback
                  let height = 2.5;
                  if (volumeLevel > 0) {
                    if (isActive) {
                      const baseH = Math.max(3.5, Math.round(bar.maxH * (0.5 + 0.5 * volumeRatio)));
                      height = baseH;
                    } else {
                      height = 2.5;
                    }
                  }

                  return (
                    <span
                      key={i}
                      className={`w-0.5 sm:w-1 rounded-full transition-all duration-200 ${
                        isActive 
                          ? `bg-gradient-to-t ${bar.color} ${bar.shadow} ${isPlaying ? 'animate-pulse' : ''}` 
                          : 'bg-white/15 opacity-25 group-hover/spectrum:opacity-50'
                      }`}
                      style={{
                        height: `${height}px`,
                        animationDuration: `${500 + i * 110}ms`,
                        animationDelay: `${i * 60}ms`
                      }}
                    />
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FLOATING TRACK DETAILS & INFO MODAL (OPENS ON TRACK CARD TAP)           */}
      {/* ========================================================================= */}
      {showTrackInfoModal && selectedInfoTrack && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fadeIn"
          onClick={() => setShowTrackInfoModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg p-6 sm:p-7 rounded-[32px] bg-slate-950/95 border border-lime-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(163,230,53,0.25)] space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime-300">
                  Track Information & Details
                </span>
              </div>
              <button 
                onClick={() => setShowTrackInfoModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-lime-400/30">
                <img 
                  src={selectedInfoTrack.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'} 
                  alt={selectedInfoTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-white truncate">
                  {selectedInfoTrack.title}
                </h3>
                <p className="text-sm font-bold text-lime-300 truncate">
                  {selectedInfoTrack.artist}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-[10px] font-mono text-lime-300">
                    {selectedInfoTrack.genre || 'Music'}
                  </span>
                  {selectedInfoTrack.isFullTrack && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                      Full Stream 320kbps
                    </span>
                  )}
                  {selectedInfoTrack.duration && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-slate-300">
                      {selectedInfoTrack.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Album</span>
                <span className="font-bold text-white truncate block mt-0.5">{selectedInfoTrack.album || 'Single'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Source / Audio</span>
                <span className="font-bold text-lime-300 truncate block mt-0.5">{selectedInfoTrack.source || 'Global Catalog'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectTrack(selectedInfoTrack);
                  setShowTrackInfoModal(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.6)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Play in Bottom Player
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
