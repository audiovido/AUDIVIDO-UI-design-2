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
  X, Clock, Music, Loader2, Globe, Library, Disc, Calendar, User, ChevronLeft
} from 'lucide-react';
import { Track, AURA_TRACKS } from '../data/auraStore';
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
  trackId?: string;
}

export const MUSIC_V2_PLAYLISTS: MusicV2Playlist[] = [
  // --- CHILL VIBE PLAYLISTS ---
  {
    id: 'pl-chill-study',
    title: 'Chill Study Beats',
    subtitle: 'Lo-Fi & Instrumental Focus',
    songCount: 24,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    category: 'Chill',
    accentColor: 'from-emerald-500 to-teal-700',
    trackId: 'track-chill-1'
  },
  {
    id: 'pl-chill-rain',
    title: 'Rainy Cafe Lo-Fi',
    subtitle: 'Coffee, Rain & Warm Guitars',
    songCount: 18,
    coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    category: 'Chill',
    accentColor: 'from-teal-500 to-cyan-700',
    trackId: 'track-chill-2'
  },
  {
    id: 'pl-chill-tokyo',
    title: 'Tokyo Night Walk',
    subtitle: 'Shibuya Neon & Soul Beats',
    songCount: 20,
    coverUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    category: 'Chill',
    accentColor: 'from-lime-500 to-emerald-700',
    trackId: 'track-chill-3'
  },

  // --- RELAX VIBE PLAYLISTS ---
  {
    id: 'pl-relax-sunset',
    title: 'Ocean Sunset Whispers',
    subtitle: 'Ambient Melodic Waves & Serenity',
    songCount: 30,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    category: 'Relax',
    accentColor: 'from-cyan-500 to-blue-600',
    trackId: 'track-relax-1'
  },
  {
    id: 'pl-relax-forest',
    title: 'Deep Forest Solitude',
    subtitle: 'Calming Nature Drone & Mindfulness',
    songCount: 22,
    coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    category: 'Relax',
    accentColor: 'from-violet-500 to-purple-800',
    trackId: 'track-relax-2'
  },
  {
    id: 'pl-relax-stars',
    title: 'Starlit Horizon Sanctuary',
    subtitle: 'Cosmic Relaxation & Deep Sleep',
    songCount: 26,
    coverUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    category: 'Relax',
    accentColor: 'from-purple-500 to-indigo-700',
    trackId: 'track-relax-3'
  },

  // --- WORKOUT VIBE PLAYLISTS ---
  {
    id: 'pl-workout-cyber',
    title: 'Cyberpunk Nitro Run',
    subtitle: 'High Energy Cardio & 130 BPM Drive',
    songCount: 32,
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    category: 'Workout',
    accentColor: 'from-rose-500 to-red-700',
    trackId: 'track-workout-1'
  },
  {
    id: 'pl-workout-pulse',
    title: 'Peak Cardio Pulse',
    subtitle: 'High Energy EDM & Festival Bangers',
    songCount: 28,
    coverUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80',
    category: 'Workout',
    accentColor: 'from-lime-500 to-emerald-600',
    trackId: 'track-workout-2'
  },
  {
    id: 'pl-workout-titan',
    title: 'Titan Force 180',
    subtitle: 'Heavy Lifting & Hard Electro Bass',
    songCount: 35,
    coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    category: 'Workout',
    accentColor: 'from-emerald-400 to-lime-500',
    trackId: 'track-workout-4'
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
  // Sub-tabs in Samantha's Library
  const [libraryCategory, setLibraryCategory] = useState<'Liked Songs' | 'Playlists' | 'Artists' | 'Suggestions'>('Liked Songs');
  const [activeVibe, setActiveVibe] = useState<'chill' | 'relax' | 'workout'>('chill');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persistent liked tracks repository (saved in localStorage across sessions)
  const [savedLibraryTracks, setSavedLibraryTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('audiovido_saved_liked_tracks_catalog_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    // Seed with initial tracks matching initial liked tracks (Chill, Relax, Workout flagship tracks)
    return [AURA_TRACKS[0], AURA_TRACKS[4], AURA_TRACKS[8]];
  });

  const handleToggleLikeTrack = (track: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleLikeTrack(track.id, e);
    setSavedLibraryTracks(prev => {
      const exists = prev.some(t => t.id === track.id);
      let next: Track[];
      if (exists) {
        next = prev.filter(t => t.id !== track.id);
      } else {
        next = [track, ...prev];
      }
      try {
        localStorage.setItem('audiovido_saved_liked_tracks_catalog_v2', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  // Immediate selection, playback, and dismissal of search overlay (preserves user query)
  const handlePlayFromSearch = (track: Track) => {
    onSelectTrack(track);
    setIsPlaying(true);
    setIsSearchDropdownOpen(false);
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const [apiTracks, setApiTracks] = useState<Track[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState<boolean>(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
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
          artistBio: `Official track "${item.title}" by ${item.artist} from the album "${item.album}" (${item.year || 'Official Release'}). Genre: ${item.genre}. Source: Apple iTunes Catalog.`
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

  // Complete persistent collection of liked tracks
  const likedSongsList = React.useMemo(() => {
    const list: Track[] = [];
    const seen = new Set<string>();

    savedLibraryTracks.forEach(t => {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        list.push(t);
      }
    });

    allTracks.forEach(t => {
      if (likedTracks[t.id] && !seen.has(t.id)) {
        seen.add(t.id);
        list.push(t);
      }
    });

    return list;
  }, [savedLibraryTracks, allTracks, likedTracks]);

  // Dynamically aggregated Albums from liked and saved songs
  const albumGroups = React.useMemo(() => {
    const map = new Map<string, { album: string; artist: string; cover: string; year: string; tracks: Track[] }>();
    const sourceTracks = likedSongsList.length > 0 ? likedSongsList : allTracks;
    sourceTracks.forEach(t => {
      const albumName = t.album || `${t.title} - Single`;
      if (!map.has(albumName)) {
        map.set(albumName, {
          album: albumName,
          artist: t.artist,
          cover: t.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
          year: t.year || '2024',
          tracks: []
        });
      }
      map.get(albumName)!.tracks.push(t);
    });
    return Array.from(map.values());
  }, [likedSongsList, allTracks]);

  // Dynamically aggregated Artists from liked and saved songs
  const artistGroups = React.useMemo(() => {
    const map = new Map<string, { artist: string; photo: string; genres: string[]; tracks: Track[] }>();
    const sourceTracks = likedSongsList.length > 0 ? likedSongsList : allTracks;
    sourceTracks.forEach(t => {
      if (!map.has(t.artist)) {
        map.set(t.artist, {
          artist: t.artist,
          photo: t.artistPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          genres: [],
          tracks: []
        });
      }
      const g = map.get(t.artist)!;
      g.tracks.push(t);
      if (t.genre && !g.genres.includes(t.genre)) {
        g.genres.push(t.genre);
      }
    });
    return Array.from(map.values());
  }, [likedSongsList, allTracks]);

  // Curated Suggestions for Samantha: tracks not yet in liked songs
  const suggestedTracks = React.useMemo(() => {
    const likedSet = new Set(likedSongsList.map(t => t.id));
    const unliked = AURA_TRACKS.filter(t => !likedSet.has(t.id));
    return unliked.length > 0 ? unliked : AURA_TRACKS.slice(0, 8);
  }, [likedSongsList]);

  const isCurrentLiked = currentTrack ? !!likedTracks[currentTrack.id] : false;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 animate-fadeIn py-2 pb-44 select-none font-sans relative box-border">
      
      {/* Fullscreen Backdrop for Floating Search Dropdown - Blurs & Dims background exactly like bottom player */}
      {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
        <div 
          className="fixed inset-0 z-[9980] cursor-default bg-black/60 backdrop-blur-[3px] animate-fadeIn" 
          onClick={() => setIsSearchDropdownOpen(false)} 
        />
      )}

      {/* ========================================================================= */}
      {/* 1. TOP APP BAR & NAVIGATION CONSOLE (CLEAN, 100% RESPONSIVE, ZERO OVERLAP) */}
      {/* ========================================================================= */}
      <div className={`relative ${isSearchDropdownOpen && searchQuery.trim().length > 0 ? 'z-[9990]' : 'z-30'} flex flex-col gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-3xl sm:rounded-[36px] bg-slate-950/95 border border-white/20 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15),_0_20px_50px_rgba(0,0,0,0.9)]`}>
        
        {/* ROW 1: USER PROFILE GREETING (SAMANTHA) + SEARCH INPUT + NOTIFICATION BELL */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 w-full">
          
          {/* LEFT ZONE: Samantha Profile & Personal Library View Trigger (In-Place Page Switch) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'library' ? 'discover' : 'library');
              setIsSearchDropdownOpen(false);
              setShowNotificationModal(false);
            }}
            className={`flex items-center gap-2.5 sm:gap-3 shrink-0 p-1 sm:p-1.5 -ml-1 sm:-ml-1.5 rounded-2xl sm:rounded-3xl transition-all cursor-pointer group active:scale-95 text-left border select-none ${
              activeTab === 'library'
                ? 'bg-lime-400/20 border-lime-400/60 shadow-[0_0_22px_rgba(163,230,53,0.35)] ring-1 ring-lime-400/40'
                : 'hover:bg-white/[0.08] border-transparent hover:border-lime-400/30'
            }`}
            title="Samantha · My Profile & Personal Library"
          >
            <div className={`relative w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 shadow-[0_0_20px_rgba(163,230,53,0.5)] shrink-0 ring-2 transition-transform duration-300 group-hover:scale-105 ${
              activeTab === 'library' ? 'border-lime-300 ring-lime-400' : 'border-lime-400 ring-lime-500/30'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                alt="Samantha" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden xs:block">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-lime-300 transition-colors font-sans">
                Samantha
              </h2>
              <span className="text-[10px] text-lime-400 font-bold font-sans">
                {likedSongsList.length} Liked Tracks
              </span>
            </div>
          </button>

          {/* CENTER ZONE: Search Input */}
          <div className="relative flex-1 min-w-0">
            <div className="relative w-full">
              <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-400/70 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onFocus={() => {
                  setIsSearchDropdownOpen(true);
                  setShowNotificationModal(false);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                  setShowNotificationModal(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const results = apiTracks.length > 0 ? apiTracks : filteredTracks;
                    if (results.length > 0) {
                      handlePlayFromSearch(results[0]);
                    }
                  }
                  if (e.key === 'Escape') {
                    setIsSearchDropdownOpen(false);
                    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }
                }}
                placeholder="Search here"
                className="w-full pl-10 sm:pl-11 pr-8 sm:pr-9 py-2 sm:py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] focus:bg-slate-900 border border-white/15 focus:border-lime-400 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.08)] focus:shadow-[0_0_24px_rgba(163,230,53,0.3)]"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchDropdownOpen(false);
                    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded-full bg-white/10 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* FLOATING DROPDOWN SEARCH RESULTS & SUGGESTIONS PANEL */}
            {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2.5 left-0 right-0 max-w-full z-[9995] bg-slate-950/98 border border-lime-400/60 rounded-3xl p-3 sm:p-4 shadow-[0_30px_80px_rgba(0,0,0,0.95),_0_0_35px_rgba(163,230,53,0.25)] backdrop-blur-3xl space-y-2.5 animate-fadeIn overflow-hidden box-border"
              >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-1 min-w-0 gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Search className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      <span className="text-xs font-bold text-white truncate">
                        Search Results for "{searchQuery}"
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSearchingApi ? (
                        <span className="text-[10px] font-mono text-lime-300 flex items-center gap-1.5 bg-lime-400/10 px-2.5 py-0.5 rounded-full border border-lime-400/30">
                          <Loader2 className="w-3 h-3 animate-spin text-lime-400" />
                          <span className="hidden xs:inline">Searching...</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          {(apiTracks.length > 0 ? apiTracks : filteredTracks).length} matches
                        </span>
                      )}
                      <button 
                        onClick={() => {
                          setIsSearchDropdownOpen(false);
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                        title="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Suggestions Quick Vibes Row */}
                  <div className="flex items-center gap-1.5 py-1 px-1 overflow-x-auto scrollbar-none border-b border-white/5 max-w-full">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">Suggestions:</span>
                    {(['Chill', 'Relax', 'Workout'] as const).map(vibeName => (
                      <button
                        key={vibeName}
                        onClick={() => {
                          setSearchQuery(vibeName);
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-lime-400/20 text-slate-300 hover:text-lime-300 text-[10px] font-semibold border border-white/10 hover:border-lime-400/30 transition-all cursor-pointer shrink-0"
                      >
                        {vibeName}
                      </button>
                    ))}
                  </div>

                  {/* Vertical Ranked List */}
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                    {(apiTracks.length > 0 ? apiTracks : filteredTracks).map((t, idx) => {
                      const isCurrent = currentTrack?.id === t.id;
                      const isTrackPlaying = isCurrent && isPlaying;
                      return (
                        <div
                          key={t.id || idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayFromSearch(t);
                          }}
                          className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all group cursor-pointer border min-w-0 gap-3 backdrop-blur-md ${
                            isCurrent 
                              ? 'bg-lime-500/20 border-lime-400/80 shadow-[0_0_16px_rgba(163,230,53,0.3)]' 
                              : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-lime-400/40'
                          }`}
                        >
                          {/* LEFT: Single Play Button / Artwork Thumbnail */}
                          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 shadow-md border border-lime-400/40 ring-2 ring-lime-500/15 group-hover:scale-105 transition-transform flex items-center justify-center">
                            <img src={t.artistPhoto} alt={t.title} className="w-full h-full object-cover rounded-full" />
                            <div className={`absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity rounded-full ${
                              isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                              {isTrackPlaying ? (
                                <Pause className="w-4 h-4 text-lime-400 fill-lime-400" />
                              ) : (
                                <Play className="w-4 h-4 text-lime-400 fill-lime-400 ml-0.5" />
                              )}
                            </div>
                          </div>

                          {/* RIGHT (REST OF ROW): Track Name & Artist Name with ample space */}
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                                isCurrent ? 'text-lime-300' : 'text-white group-hover:text-lime-300'
                              }`}>
                                {t.title}
                              </h4>
                              {idx === 0 && (
                                <span className="text-[8px] font-mono font-bold bg-lime-400/20 text-lime-300 border border-lime-400/40 px-1 py-0.2 rounded shrink-0 hidden xs:inline">
                                  BEST MATCH
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-400 truncate font-medium">
                              {t.artist}
                            </p>
                          </div>

                          {/* RIGHT EDGE: Time / Duration */}
                          <div className="shrink-0 flex items-center gap-1.5 pl-2">
                            <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-400 group-hover:text-lime-300 transition-colors">
                              {t.duration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
            )}
          </div>

          {/* RIGHT ZONE: Notification Bell (Visible on desktop; on mobile it is in the top header next to menu) */}
          <div className="hidden md:flex relative shrink-0 items-center justify-end">
            <button 
              onClick={() => {
                const next = !showNotificationModal;
                setShowNotificationModal(next);
                if (next) setIsSearchDropdownOpen(false);
              }}
              className="relative p-2 sm:p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-lime-400/50 text-slate-200 hover:text-white transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95"
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
                <div className="absolute top-full mt-3.5 right-0 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm p-4 rounded-3xl bg-slate-950/98 border border-lime-400/50 shadow-[0_30px_70px_rgba(0,0,0,0.95),_0_0_30px_rgba(163,230,53,0.15)] z-[9999] space-y-3 backdrop-blur-3xl animate-fadeIn">
                  
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

      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEW CONTENT: DISCOVER / LIBRARY / EXPANDED PLAYER                */}
      {/* ========================================================================= */}
      
      {/* --- SUB-VIEW A: DISCOVER (3 CLEAN 3D VIBE SPHERES HORIZONTAL + WORKING VIBE PLAYLIST) --- */}
      {activeTab === 'discover' && (() => {
        const VIBES_CONFIG = [
          {
            id: 'chill' as const,
            title: 'Chill',
            vibe: 'Lo-Fi Beats',
            activeRing: 'border-2 sm:border-[3px] border-emerald-300 ring-4 ring-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.6),0_15px_35px_rgba(0,0,0,0.9)] scale-105',
            inactiveRing: 'border-2 border-white/40 ring-1 ring-white/10 hover:border-emerald-300 hover:ring-emerald-400/30 shadow-[0_12px_30px_rgba(0,0,0,0.8)] hover:scale-102 opacity-85 hover:opacity-100',
            trackId: 'track-chill-1',
            image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=85',
            accentColor: 'text-emerald-300',
          },
          {
            id: 'relax' as const,
            title: 'Relax',
            vibe: 'Ambient & Soul',
            activeRing: 'border-2 sm:border-[3px] border-sky-300 ring-4 ring-sky-400/50 shadow-[0_0_30px_rgba(56,189,248,0.6),0_15px_35px_rgba(0,0,0,0.9)] scale-105',
            inactiveRing: 'border-2 border-white/40 ring-1 ring-white/10 hover:border-sky-300 hover:ring-sky-400/30 shadow-[0_12px_30px_rgba(0,0,0,0.8)] hover:scale-102 opacity-85 hover:opacity-100',
            trackId: 'track-relax-1',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85',
            accentColor: 'text-sky-300',
          },
          {
            id: 'workout' as const,
            title: 'Workout',
            vibe: 'Cardio & Energy',
            activeRing: 'border-2 sm:border-[3px] border-lime-300 ring-4 ring-lime-400/50 shadow-[0_0_30px_rgba(163,230,53,0.6),0_15px_35px_rgba(0,0,0,0.9)] scale-105',
            inactiveRing: 'border-2 border-white/40 ring-1 ring-white/10 hover:border-lime-300 hover:ring-lime-400/30 shadow-[0_12px_30px_rgba(0,0,0,0.8)] hover:scale-102 opacity-85 hover:opacity-100',
            trackId: 'track-workout-1',
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=85',
            accentColor: 'text-lime-300',
          }
        ];

        const renderVibeSphere = (vibe: typeof VIBES_CONFIG[number]) => {
          const isActive = activeVibe === vibe.id;
          return (
            <div
              key={vibe.id}
              onClick={() => {
                setActiveVibe(vibe.id);
                const target = AURA_TRACKS.find(t => t.id === vibe.trackId) || AURA_TRACKS.find(t => t.vibes.some(v => v.toLowerCase() === vibe.id));
                if (target) {
                  onSelectTrack(target);
                  setIsPlaying(true);
                }
              }}
              className={`relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-end p-2 xs:p-2.5 sm:p-4 text-center select-none shrink-0 active:scale-95 ${
                isActive ? vibe.activeRing : vibe.inactiveRing
              }`}
            >
              <img 
                src={vibe.image} 
                alt={vibe.title} 
                className="absolute inset-0 w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-500 pointer-events-none brightness-105 contrast-105" 
              />
              <div className="absolute inset-x-0 bottom-0 h-14 sm:h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-full pointer-events-none" />
              
              {/* 3D Bubble Specular Light Effect */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.08)_30%,transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_3px_8px_rgba(255,255,255,0.45),inset_0_-6px_14px_rgba(0,0,0,0.7)] pointer-events-none" />

              {isActive && (
                <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 z-20 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-lime-400/60 shadow-[0_0_10px_rgba(163,230,53,0.5)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-lime-300 uppercase tracking-wider hidden xs:inline">Active</span>
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5 w-full pointer-events-none">
                <h3 className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] group-hover:text-lime-300 transition-colors">
                  {vibe.title}
                </h3>
                <span className={`px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-slate-950/70 backdrop-blur-sm border border-white/20 text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase ${vibe.accentColor} shadow-sm truncate max-w-[90%]`}>
                  {vibe.vibe}
                </span>
              </div>
            </div>
          );
        };

        const renderVibePlaylistContent = (vibeId: 'chill' | 'relax' | 'workout') => {
          const vibeTracks = AURA_TRACKS.filter(t => t.vibes.some(v => v.toLowerCase() === vibeId));

          return (
            <div className="w-full space-y-4 animate-fadeIn">
              {/* Curated Songs List for the Selected Vibe */}
              <div className="rounded-[28px] p-4 sm:p-6 bg-slate-950/85 border border-white/10 backdrop-blur-3xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-lime-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                      {vibeId.toUpperCase()} VIBE PLAYLIST
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {vibeTracks.length} Tracks
                    </span>
                  </div>

                  {/* Functional Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (vibeTracks.length > 0) {
                          onSelectTrack(vibeTracks[0]);
                          setIsPlaying(true);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_2px_12px_rgba(163,230,53,0.4)] hover:shadow-[0_0_20px_rgba(163,230,53,0.7)] transition-all cursor-pointer active:scale-95 border border-lime-200"
                    >
                      <Play className="w-3 h-3 fill-slate-950 text-slate-950" />
                      <span>Play All</span>
                    </button>

                    <button
                      onClick={() => {
                        if (vibeTracks.length > 0) {
                          const rand = vibeTracks[Math.floor(Math.random() * vibeTracks.length)];
                          onSelectTrack(rand);
                          setIsPlaying(true);
                        }
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer active:scale-95"
                      title="Shuffle this playlist"
                    >
                      <Shuffle className="w-3 h-3 text-lime-400" />
                      <span className="hidden xs:inline">Shuffle</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {vibeTracks.map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isTrackPlaying = isCurrent && isPlaying;
                    const isLiked = savedLibraryTracks.some(t => t.id === track.id) || !!likedTracks[track.id];

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          onSelectTrack(track);
                          setIsPlaying(true);
                        }}
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer border group ${
                          isCurrent 
                            ? 'bg-lime-400/20 border-lime-400/60 shadow-[0_0_18px_rgba(163,230,53,0.25)]' 
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-lime-400/35'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                          <span className="w-5 text-center text-xs font-mono text-slate-400">
                            {isTrackPlaying ? (
                              <span className="text-lime-400 font-bold animate-pulse">▶</span>
                            ) : (
                              idx + 1
                            )}
                          </span>

                          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-lime-400/40 ring-2 ring-lime-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                            <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover rounded-full" />
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity rounded-full ${
                              isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                              <Play className="w-3.5 h-3.5 fill-lime-400 text-lime-400 ml-0.5" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors font-sans ${isCurrent ? 'text-lime-300' : 'text-white group-hover:text-lime-300'}`}>
                              {track.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-400 truncate font-sans">
                              {track.artist} · <span className="text-slate-500">{track.album}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-3">
                          <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-lime-300 hidden sm:inline">
                            {track.genre}
                          </span>
                          <button
                            onClick={(e) => handleToggleLikeTrack(track, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title={isLiked ? "Saved in Library" : "Save to Library"}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]' : ''}`} />
                          </button>
                          <span className="font-sans text-xs text-slate-400 w-10 text-right">{track.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        };

        return (
          <div className="space-y-6 pt-1">
            {/* 3 HORIZONTAL 3D VIBE SPHERES (CHILL, RELAX, WORKOUT) IN ONE ROW */}
            <div className="flex flex-row items-center justify-center gap-2.5 xs:gap-3.5 sm:gap-6 md:gap-8 w-full max-w-full py-2">
              {VIBES_CONFIG.map(vibe => renderVibeSphere(vibe))}
            </div>

            {/* CURATED VIBE PLAYLIST FOR SELECTED VIBE (UNDERNEATH THE 3 CIRCLES) */}
            {renderVibePlaylistContent(activeVibe)}
          </div>
        );
      })()}

      {/* --- SUB-VIEW B: SAMANTHA'S PERSONAL LIBRARY & PROFILE (IN-PLACE FULL VIEW REPLACING VIBE SPHERES) --- */}
      {activeTab === 'library' && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* SAMANTHA PROFILE BANNER WITH CONCISE REAL STATS & "BACK TO DISCOVER" BUTTON */}
          <div className="relative p-4 sm:p-6 rounded-[28px] sm:rounded-[36px] bg-slate-950/90 border border-lime-400/35 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1.5px_2px_rgba(255,255,255,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Samantha Profile Identity & Concise Real Stats (Matched typography, zero clutter) */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.5)] shrink-0 ring-4 ring-lime-400/20">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                  alt="Samantha" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                  Samantha
                </h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-sans font-bold text-lime-300">
                  <span>{likedSongsList.length} Liked Tracks</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{MUSIC_V2_PLAYLISTS.length + 1} Playlists</span>
                </div>
              </div>
            </div>

            {/* Right: Prominent "Back to Discover" Button */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(163,230,53,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white"
                title="Back to Discover (Chill, Relax, Workout Vibes)"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
                <span>Back to Discover</span>
              </button>
            </div>

          </div>

          {/* Library Category Pill Switcher: Liked Songs, Playlists, Artists, Suggestions */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-3 sm:p-4 rounded-3xl bg-slate-950/90 border border-lime-400/30 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {(['Liked Songs', 'Playlists', 'Artists', 'Suggestions'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setLibraryCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                    libraryCategory === cat 
                      ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 shadow-[0_4px_16px_rgba(163,230,53,0.65),inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.35)] border border-lime-200 scale-[1.02]' 
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-lime-400/40 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.08)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold">
                {libraryCategory === 'Liked Songs' && `${likedSongsList.length} Liked Songs`}
                {libraryCategory === 'Playlists' && `${MUSIC_V2_PLAYLISTS.length + 1} Playlists`}
                {libraryCategory === 'Artists' && `${artistGroups.length} Artists`}
                {libraryCategory === 'Suggestions' && `${suggestedTracks.length} Recommendations`}
              </span>
              {libraryCategory === 'Liked Songs' && likedSongsList.length > 0 && (
                <button
                  onClick={() => {
                    if (likedSongsList.length > 0) {
                      onSelectTrack(likedSongsList[0]);
                      setIsPlaying(true);
                    }
                  }}
                  className="px-3 py-1 rounded-full bg-lime-400/20 hover:bg-lime-400 text-lime-300 hover:text-slate-950 border border-lime-400/40 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play All</span>
                </button>
              )}
            </div>
          </div>

          {/* 1. LIKED SONGS TAB */}
          {libraryCategory === 'Liked Songs' && (
            <div className="rounded-[28px] p-5 sm:p-6 bg-slate-950/85 border border-lime-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Your Liked Songs
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Saved persistently in your personal library ({likedSongsList.length} tracks)
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
                  {likedSongsList.length} Saved
                </span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {likedSongsList.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                      <Heart className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">No liked songs yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Tap the heart icon on any song from Chill, Relax, or Workout vibes, or search to save tracks permanently here!
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="px-4 py-2 rounded-full bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.4)]"
                    >
                      Explore Vibes
                    </button>
                  </div>
                ) : (
                  likedSongsList.map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isTrackPlaying = isCurrent && isPlaying;
                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          onSelectTrack(track);
                          setIsPlaying(true);
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border group ${
                          isCurrent 
                            ? 'bg-lime-400/20 border-lime-400/60 shadow-[0_0_18px_rgba(163,230,53,0.25)]' 
                            : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-lime-400/40'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <span className="w-5 text-center text-xs font-mono text-slate-400">
                            {isTrackPlaying ? (
                              <span className="text-lime-400 font-bold animate-pulse">▶</span>
                            ) : (
                              idx + 1
                            )}
                          </span>

                          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow border border-white/10 group-hover:scale-105 transition-transform">
                            <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                              isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                              {isTrackPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-lime-400 text-lime-400 ml-0.5" />
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h5 className={`text-xs sm:text-sm font-bold truncate transition-colors ${isCurrent ? 'text-lime-300' : 'text-white group-hover:text-lime-300'}`}>
                              {track.title}
                            </h5>
                            <p className="text-[11px] text-slate-400 truncate">
                              {track.artist} · <span className="font-mono text-slate-500">{track.album || 'Single'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-lime-300 hidden sm:inline">
                            {track.genre}
                          </span>
                          <button
                            onClick={(e) => handleToggleLikeTrack(track, e)}
                            className="p-1.5 text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove from favorites"
                          >
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                          </button>
                          <span className="font-mono text-xs text-slate-400 w-10 text-right">{track.duration}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 2. PLAYLISTS TAB */}
          {libraryCategory === 'Playlists' && (
            <div className="rounded-[28px] p-5 sm:p-6 bg-slate-950/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-400">
                    <ListMusic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Playlists Collection
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Curated & personal playlists ({MUSIC_V2_PLAYLISTS.length + 1} playlists)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Special Favorites Playlist Card */}
                <div 
                  onClick={() => {
                    if (likedSongsList.length > 0) {
                      onSelectTrack(likedSongsList[0]);
                      setIsPlaying(true);
                    }
                  }}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 hover:from-rose-900/70 hover:to-purple-900/70 border border-rose-500/30 hover:border-rose-400/60 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform">
                      <Heart className="w-8 h-8 fill-white text-white filter drop-shadow-md" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                        Your Liked Songs Playlist
                      </h4>
                      <p className="text-xs text-slate-300 truncate">
                        All tracks marked with a heart across sessions
                      </p>
                      <span className="text-[11px] font-mono text-rose-300 font-bold block">
                        {likedSongsList.length} saved songs
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <button 
                      className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center transition-all cursor-pointer group-hover:scale-110 shadow-md"
                      title="Play Liked Songs"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* All Curated Playlists */}
                {MUSIC_V2_PLAYLISTS.map(playlist => (
                  <div 
                    key={playlist.id}
                    onClick={() => {
                      const matched = AURA_TRACKS.find(t => t.id === playlist.trackId) || 
                                      AURA_TRACKS.find(t => t.genre.toLowerCase().includes(playlist.category.toLowerCase())) || 
                                      AURA_TRACKS[0];
                      if (matched) {
                        onSelectTrack(matched);
                        setIsPlaying(true);
                      }
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
                          {playlist.songCount} songs · {playlist.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const matched = AURA_TRACKS.find(t => t.id === playlist.trackId) || 
                                          AURA_TRACKS.find(t => t.genre.toLowerCase().includes(playlist.category.toLowerCase())) || 
                                          AURA_TRACKS[0];
                          if (matched) {
                            onSelectTrack(matched);
                            setIsPlaying(true);
                          }
                        }}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-lime-400 hover:text-slate-950 text-white flex items-center justify-center transition-all cursor-pointer group-hover:scale-110 shadow-md"
                        title="Play Playlist"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ARTISTS TAB */}
          {libraryCategory === 'Artists' && (
            <div className="rounded-[28px] p-5 sm:p-6 bg-slate-950/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Mic2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Library Artists
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Artists from your liked songs and library ({artistGroups.length} artists)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {artistGroups.map((artist, idx) => (
                  <div
                    key={`${artist.artist}-${idx}`}
                    onClick={() => {
                      if (artist.tracks.length > 0) {
                        onSelectTrack(artist.tracks[0]);
                        setIsPlaying(true);
                      }
                    }}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-lime-400/40 transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg border-2 border-white/15 group-hover:border-lime-400 group-hover:scale-105 transition-all">
                      <img src={artist.photo} alt={artist.artist} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5 w-full">
                      <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors truncate">
                        {artist.artist}
                      </h4>
                      <p className="text-[11px] font-mono text-lime-400">
                        {artist.tracks.length} {artist.tracks.length === 1 ? 'track' : 'tracks'}
                      </p>
                      {artist.genres.length > 0 && (
                        <p className="text-[10px] text-slate-400 truncate">
                          {artist.genres.slice(0, 2).join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUGGESTIONS TAB (CURATED RECOMMENDATIONS FOR SAMANTHA) */}
          {libraryCategory === 'Suggestions' && (
            <div className="rounded-[28px] p-5 sm:p-6 bg-slate-950/85 border border-lime-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.4)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Suggested For You
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Curated recommendations tailored to your taste ({suggestedTracks.length} tracks)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (suggestedTracks.length > 0) {
                      onSelectTrack(suggestedTracks[0]);
                      setIsPlaying(true);
                    }
                  }}
                  className="px-3 py-1 rounded-full bg-lime-400 text-slate-950 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:bg-lime-300 shadow-md"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Suggestions</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {suggestedTracks.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const isLiked = !!likedTracks[track.id];

                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        onSelectTrack(track);
                        setIsPlaying(true);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border group ${
                        isCurrent 
                          ? 'bg-lime-400/20 border-lime-400/60 shadow-[0_0_18px_rgba(163,230,53,0.25)]' 
                          : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-lime-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <span className="w-5 text-center text-xs font-mono text-slate-400">
                          {isTrackPlaying ? (
                            <span className="text-lime-400 font-bold animate-pulse">▶</span>
                          ) : (
                            idx + 1
                          )}
                        </span>

                        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow border border-white/10 group-hover:scale-105 transition-transform">
                          <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                            isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            {isTrackPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-lime-400 text-lime-400 ml-0.5" />
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className={`text-xs sm:text-sm font-bold truncate transition-colors ${isCurrent ? 'text-lime-300' : 'text-white group-hover:text-lime-300'}`}>
                            {track.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 truncate">
                            {track.artist} · <span className="font-mono text-slate-500">{track.album || 'Single'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-lime-300 hidden sm:inline">
                          {track.genre}
                        </span>
                        <button
                          onClick={(e) => handleToggleLikeTrack(track, e)}
                          className="p-1.5 transition-colors cursor-pointer"
                          title={isLiked ? "Remove from favorites" : "Save to library"}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]' : 'text-slate-400 hover:text-rose-400'}`} />
                        </button>
                        <span className="font-mono text-xs text-slate-400 w-10 text-right">{track.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOCKED DOCKED 3D LIQUID GLASS BOTTOM MEDIA CONTROLLER (PINNED ON SCROLL) */}
      {/* ========================================================================= */}
      {/* Fullscreen Backdrop for Expanded Player Panel - Closes when clicking anywhere outside */}
      {isPlayerExpanded && (
        <div 
          className="fixed inset-0 z-[980] cursor-default bg-black/50 backdrop-blur-[2px] animate-fadeIn" 
          onClick={() => setIsPlayerExpanded(false)} 
        />
      )}

      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-3rem)] max-w-3xl z-[990] pointer-events-auto">
        
        {/* ========================================================================= */}
        {/* EXPANDED FULL-CARD TRACK POSTER (FULL PHOTO BACKGROUND, MINIMAL & SLEEK)  */}
        {/* ========================================================================= */}
        {isPlayerExpanded && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-[995] w-full mb-2 sm:mb-3 h-80 sm:h-96 md:h-[440px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/20 sm:border-lime-400/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(163,230,53,0.2)] animate-fadeIn select-none"
          >
            {/* FULL BACKGROUND PHOTO OF THE CURRENT MUSIC */}
            <img 
              src={currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85'} 
              alt={currentTrack?.title || 'Music Track'} 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.9] contrast-105 pointer-events-none" 
            />

            {/* Gradient Overlays for High Legibility & Cinematic Mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-black/50 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18)_0%,transparent_50%)] pointer-events-none" />

            {/* TOP-LEFT: PROMINENT LIKE (HEART) BUTTON */}
            {currentTrack && (
              <button
                type="button"
                onClick={(e) => handleToggleLikeTrack(currentTrack, e)}
                className={`absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-2xl border transition-all cursor-pointer shadow-[0_6px_25px_rgba(0,0,0,0.8)] active:scale-90 ${
                  isCurrentLiked
                    ? 'bg-rose-500/90 text-white border-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.7)]'
                    : 'bg-black/60 hover:bg-black/85 text-white border-white/20 hover:border-white/40'
                }`}
                title={isCurrentLiked ? "Remove from Liked Songs" : "Like this Track"}
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isCurrentLiked ? 'fill-white text-white filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : ''}`} />
              </button>
            )}

            {/* TOP-RIGHT: MINIMAL CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setIsPlayerExpanded(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/85 border border-white/20 text-white hover:text-lime-300 transition-all cursor-pointer backdrop-blur-2xl shadow-lg active:scale-90"
              title="Close view"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* BOTTOM: ONLY TRACK NAME, ARTIST NAME, ALBUM NAME & YEAR */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent flex flex-col justify-end space-y-1.5 z-10 pointer-events-none">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] truncate font-sans">
                {currentTrack?.title || 'No Track Selected'}
              </h3>
              <p className="text-base sm:text-xl font-bold text-lime-300 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] truncate font-sans">
                {currentTrack?.artist || 'Unknown Artist'}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs sm:text-sm text-slate-300 font-sans font-medium">
                <span className="truncate max-w-[240px] sm:max-w-md">
                  {currentTrack?.album || `${currentTrack?.title || 'Single'} (Album)`}
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-slate-300 font-bold">
                  {currentTrack?.year || '2024'}
                </span>
              </div>
            </div>

          </div>
        )}

        <div className="relative w-full px-3 sm:px-6 py-2 sm:py-3.5 rounded-[24px] sm:rounded-[32px] backdrop-blur-3xl bg-slate-950/92 border border-lime-400/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.22),_0_20px_50px_rgba(0,0,0,0.9),_0_0_25px_rgba(163,230,53,0.18)] flex items-center justify-between gap-2 sm:gap-5 transition-all duration-300 min-h-[66px] sm:min-h-[86px]">
          
          {/* Inner Rounded Background Layer for Gradients with overflow-hidden */}
          <div className="absolute inset-0 pointer-events-none rounded-[24px] sm:rounded-[32px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-teal-400/80 via-lime-400 to-emerald-400/80" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-lime-400/30 to-teal-500/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/40" />
          </div>

          {/* 1. LEFT ZONE: Current Track Identity with Interactive Circular Cover Art (Tap to Expand Upwards) */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 max-w-[100px] sm:max-w-[220px] text-left relative z-10 shrink-0">
            {/* Interactive Circular Cover with luminous indicator */}
            <div 
              onClick={() => {
                if (currentTrack) setIsPlayerExpanded(!isPlayerExpanded);
              }}
              className={`relative w-8 h-8 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 border-2 border-lime-300/80 shadow-[0_0_15px_rgba(163,230,53,0.5)] ring-2 ring-lime-500/30 group/cov transition-all ${
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
                    <ChevronDown className="w-3.5 h-3.5 text-lime-300 animate-bounce" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-lime-300 animate-bounce" />
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
              <h4 className="text-[11px] sm:text-sm font-bold text-white truncate font-sans hover:text-lime-300 transition-colors">
                {currentTrack?.title || 'Ready to Stream'}
              </h4>
              <p className="text-[9.5px] sm:text-xs text-lime-300/85 font-sans font-medium truncate">
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
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-md flex flex-col items-center gap-1 sm:gap-2 px-1 sm:px-3 relative z-10">
            
            {/* Transport Buttons Cradle */}
            <div className="relative flex items-center gap-1 sm:gap-2.5 px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full bg-slate-900/85 border border-lime-400/35 backdrop-blur-xl shadow-[0_4px_22px_rgba(163,230,53,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.15)]">
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

          {/* 3. RIGHT ZONE: Compact Mobile Volume Button vs Full Desktop Device/Volume Controls */}
          {/* Mobile Right Zone: Single Compact Circular Mute/Unmute Button (Takes only 36px) */}
          <div className="sm:hidden flex items-center justify-end shrink-0 relative z-20 pl-1">
            <button 
              onClick={() => setVolumeLevel(v => (v > 0 ? 0 : 75))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-lime-300 transition-colors cursor-pointer flex items-center justify-center border border-white/15 shadow-sm active:scale-90"
              title={volumeLevel === 0 ? "Unmute" : `Mute (${volumeLevel}%)`}
            >
              {volumeLevel === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-lime-400" />
              )}
            </button>
          </div>

          {/* Desktop Right Zone: Connected Device Selector (Top) + Volume with Dynamic VU Candlesticks (Bottom) */}
          <div className="hidden sm:flex flex-col items-stretch justify-between self-stretch shrink-0 relative z-20 py-0.5 gap-1.5 w-[160px] sm:w-[175px]">
            
            {/* Top Item: Headphones Device Selector Pill (Clean & Polished) */}
            <div className="relative w-full">
              <button
                onClick={() => {
                  const next = !showDeviceMenu;
                  setShowDeviceMenu(next);
                  if (next) {
                    setIsSearchDropdownOpen(false);
                    setShowNotificationModal(false);
                  }
                }}
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
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fadeIn"
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
