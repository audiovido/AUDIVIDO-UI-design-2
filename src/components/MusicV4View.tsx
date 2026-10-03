import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, 
  Volume2, VolumeX, Volume1, Search, Home, Library, Music, 
  MoreVertical, ChevronDown, ChevronLeft, ChevronRight, ListMusic, 
  Sparkles, Disc3, Radio, Share2, Download, Check, Plus, 
  Settings, Grid, List, Clock, Zap, ArrowLeft, Cast, 
  Flame, TrendingUp, X, Filter, Layers, ExternalLink, Maximize2,
  Minimize2, Mic2, User, Bell, Sliders, ShieldCheck,
  Globe, Database, Loader2, Info, CheckCircle2
} from 'lucide-react';
import { AudioSynth } from '../utils/AudioSynth';
import { musicApi, LyricResult } from '../services/musicApiService';

export interface ResoTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  genre: string;
  audioSynthType?: 'aura-lofi' | 'fireplace' | 'movie' | 'music' | 'social-pad';
  previewUrl?: string;
  lyrics?: string[];
  syncedLyrics?: { time: number; text: string }[];
  isTopChart?: boolean;
  chartRank?: number;
  isFavorite?: boolean;
  isDownloaded?: boolean;
  plays?: string;
  source?: 'iTunes' | 'Deezer' | 'Curated' | 'Saavn' | 'Audius' | 'SoundCloud' | 'YouTubeMusic';
  year?: string;
}

export interface ResoPlaylist {
  id: string;
  title: string;
  creator: string;
  songCount: number;
  duration: string;
  coverUrl: string;
  description: string;
  gradient: string;
  tracks: string[]; // Track IDs
  isDownloaded?: boolean;
  isLiked?: boolean;
}

export const RESO_TRACKS: ResoTrack[] = [];

export const RESO_PLAYLISTS: ResoPlaylist[] = [
  {
    id: 'pl-chill-vibes',
    title: 'Chill Vibes',
    creator: 'Reso',
    songCount: 50,
    duration: '4h 12m',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    description: 'Relax, unwind, and let the good vibes play. A mix of chill beats, lo-fi, and feel-good sounds.',
    gradient: 'from-fuchsia-600 via-pink-600 to-amber-500',
    tracks: ['reso-1', 'reso-2', 'reso-3', 'reso-4', 'reso-5', 'reso-6', 'reso-7', 'reso-8'],
    isDownloaded: true,
    isLiked: true
  },
  {
    id: 'pl-late-night',
    title: 'Late Night Drives',
    creator: 'Reso',
    songCount: 70,
    duration: '5h 45m',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    description: 'Synthwave highways, illuminated skylines, and endless melodic cruising.',
    gradient: 'from-purple-900 via-indigo-800 to-pink-600',
    tracks: ['reso-1', 'reso-7', 'reso-3', 'reso-5'],
    isDownloaded: true
  },
  {
    id: 'pl-focus-flow',
    title: 'Focus Flow',
    creator: 'Reso',
    songCount: 42,
    duration: '3h 30m',
    coverUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&auto=format&fit=crop&q=80',
    description: 'Clean acoustic frequencies and lo-fi textures for deep focus and study.',
    gradient: 'from-teal-600 via-cyan-600 to-emerald-500',
    tracks: ['reso-2', 'reso-6', 'reso-1', 'reso-3']
  },
  {
    id: 'pl-workout',
    title: 'Workout Energy',
    creator: 'Reso',
    songCount: 37,
    duration: '2h 50m',
    coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    description: 'High-BPM electro, cyber bass, and driving rhythms for peak physical performance.',
    gradient: 'from-rose-600 via-orange-600 to-amber-500',
    tracks: ['reso-4', 'reso-8', 'reso-11', 'reso-9']
  },
  {
    id: 'pl-indie-essentials',
    title: 'Indie Essentials',
    creator: 'Reso',
    songCount: 58,
    duration: '4h 15m',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80',
    description: 'Dreamy guitar reverbs, poetic lyrics, and timeless indie anthems.',
    gradient: 'from-blue-600 via-purple-600 to-pink-500',
    tracks: ['reso-3', 'reso-4', 'reso-6', 'reso-12']
  },
  {
    id: 'pl-road-trip',
    title: 'Road Trip',
    creator: 'Reso',
    songCount: 46,
    duration: '3h 40m',
    coverUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    description: 'Open roads, golden sunsets, and songs to sing along at the top of your lungs.',
    gradient: 'from-amber-600 via-red-600 to-pink-600',
    tracks: ['reso-2', 'reso-4', 'reso-9', 'reso-10']
  },
  {
    id: 'pl-love-songs',
    title: 'Love Songs',
    creator: 'Reso',
    songCount: 39,
    duration: '3h 10m',
    coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
    description: 'Soulful ballads, acoustic intimacy, and romantic midnight melodies.',
    gradient: 'from-pink-600 via-rose-600 to-purple-700',
    tracks: ['reso-6', 'reso-7', 'reso-1', 'reso-8']
  },
  {
    id: 'pl-study-mode',
    title: 'Study Mode',
    creator: 'Reso',
    songCount: 32,
    duration: '2h 45m',
    coverUrl: 'https://images.unsplash.com/photo-1507842229452-7b068d374465?w=800&auto=format&fit=crop&q=80',
    description: 'Binaural lo-fi beats, gentle ambient rainfall, and peaceful study atmosphere.',
    gradient: 'from-indigo-900 via-purple-800 to-teal-700',
    tracks: ['reso-1', 'reso-2', 'reso-5', 'reso-7']
  }
];

interface MusicV4ViewProps {
  onNavigatePortal: () => void;
}

const EMPTY_RESO_TRACK: ResoTrack = {
  id: '',
  title: 'No Track Selected',
  artist: 'Search any music to stream',
  album: 'Global Catalog',
  duration: '0:00',
  durationSeconds: 0,
  coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  genre: 'Music',
  audioSynthType: 'music'
};

export const MusicV4View: React.FC<MusicV4ViewProps> = ({ onNavigatePortal }) => {
  // Navigation View State
  const [activeNav, setActiveNav] = useState<'home' | 'search' | 'library' | 'charts' | 'made_for_you' | 'playlist'>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('pl-chill-vibes');

  // Library Sub-tab state
  const [libraryFilter, setLibraryFilter] = useState<'playlists' | 'artists' | 'albums' | 'downloaded'>('playlists');
  const [libraryLayout, setLibraryLayout] = useState<'grid' | 'list'>('grid');

  // Audio Playback Engine States
  const [currentTrack, setCurrentTrack] = useState<ResoTrack>(EMPTY_RESO_TRACK);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likedTrackIds, setLikedTrackIds] = useState<Record<string, boolean>>({});
  const [downloadedTrackIds, setDownloadedTrackIds] = useState<Record<string, boolean>>({});

  // Right Side Panel Drawer: 'nowplaying' | 'lyrics' | 'queue' | 'none'
  const [rightPanel, setRightPanel] = useState<'nowplaying' | 'lyrics' | 'queue'>('nowplaying');
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState<boolean>(true);

  // Modals & Popovers
  const [showDeviceModal, setShowDeviceModal] = useState<boolean>(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState<boolean>(false);
  const [showApiModal, setShowApiModal] = useState<boolean>(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Multi-Engine API State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchEngine, setSearchEngine] = useState<'all' | 'itunes' | 'deezer'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [apiSearchResults, setApiSearchResults] = useState<ResoTrack[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState<boolean>(false);
  const [savedLibraryTracks, setSavedLibraryTracks] = useState<any[]>(() => musicApi.getSavedLibraryTracks());

  // Real-time Lyrics from LRCLIB API
  const [lyricsData, setLyricsData] = useState<LyricResult | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);

  // Real HTML5 Audio Stream for iTunes & Deezer Previews
  const audioStreamRef = useRef<HTMLAudioElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add a track to User's Cloud Library
  const handleAddToLibrary = (track: ResoTrack, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const success = musicApi.saveTrackToLibrary({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      durationSeconds: track.durationSeconds,
      coverUrl: track.coverUrl,
      previewUrl: track.previewUrl,
      genre: track.genre,
      year: track.year,
      source: (track.source as any) || 'iTunes'
    });
    if (success) {
      setSavedLibraryTracks(musicApi.getSavedLibraryTracks());
      showToast(`Added "${track.title}" to My Library 🎵`);
    } else {
      showToast(`"${track.title}" is already in your Library`);
    }
  };

  const handleRemoveFromLibrary = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    musicApi.removeTrackFromLibrary(trackId);
    setSavedLibraryTracks(musicApi.getSavedLibraryTracks());
    showToast('Removed track from My Library');
  };

  // Sync volume with audio stream element & synth
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume / 100;
    if (audioStreamRef.current) {
      audioStreamRef.current.volume = effectiveVol;
    }
    AudioSynth.setVolume(effectiveVol);
  }, [volume, isMuted]);

  // Fetch real lyrics from LRCLIB whenever currentTrack changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLyrics(true);

    musicApi.fetchLyrics(currentTrack.title, currentTrack.artist).then(res => {
      if (isMounted) {
        setLyricsData(res);
        setIsLoadingLyrics(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingLyrics(false);
    });

    return () => { isMounted = false; };
  }, [currentTrack.title, currentTrack.artist]);

  // Live Debounced Multi-Engine Search (Apple iTunes + Deezer API)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setApiSearchResults([]);
      setIsSearchingApi(false);
      return;
    }

    setIsSearchingApi(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const results = await musicApi.searchTracks(q, searchEngine, 24);
        const mapped: ResoTrack[] = results.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          album: item.album,
          duration: item.duration,
          durationSeconds: item.durationSeconds,
          coverUrl: item.coverUrl,
          previewUrl: item.previewUrl,
          genre: item.genre,
          source: item.source,
          year: item.year,
          plays: item.plays,
          audioSynthType: 'music'
        }));
        setApiSearchResults(mapped);
      } catch (err) {
        console.warn('Live API search error:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 380);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchEngine]);

  // Playback Timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds(prev => {
          if (prev >= currentTrack.durationSeconds) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (!currentTrack || !currentTrack.id) {
      showToast('Search any song above to stream live music');
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      if (audioStreamRef.current) {
        audioStreamRef.current.pause();
      }
      showToast('Playback Paused');
    } else {
      setIsPlaying(true);
      if (currentTrack.previewUrl && audioStreamRef.current) {
        audioStreamRef.current.play().catch(e => {
          console.warn('Audio stream error:', e);
        });
      }
      showToast(`Playing: ${currentTrack.title}`);
    }
  };

  const playSpecificTrack = (track: ResoTrack, playlistId?: string) => {
    if (!track || !track.id) return;
    setCurrentTrack(track);
    setPlaybackSeconds(0);
    setIsPlaying(true);
    if (playlistId) setSelectedPlaylistId(playlistId);

    if (track.previewUrl && audioStreamRef.current) {
      audioStreamRef.current.src = track.previewUrl;
      audioStreamRef.current.currentTime = 0;
      audioStreamRef.current.play().catch(e => {
        console.warn('Audio stream play warning:', e);
      });
      showToast(`Streaming HQ Preview: ${track.title} • ${track.artist}`);
    } else {
      if (audioStreamRef.current) audioStreamRef.current.pause();
      showToast(`Selected: ${track.title} • ${track.artist}`);
    }
  };

  const handleNextTrack = () => {
    const listToUse = apiSearchResults.length > 0 ? apiSearchResults : RESO_TRACKS;
    if (listToUse.length === 0) return;
    const currentIndex = listToUse.findIndex(t => t.id === currentTrack.id);
    let nextIndex = (currentIndex + 1) % listToUse.length;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * listToUse.length);
    }
    const nextTrack = listToUse[nextIndex];
    if (nextTrack) playSpecificTrack(nextTrack);
  };

  const handlePreviousTrack = () => {
    const listToUse = apiSearchResults.length > 0 ? apiSearchResults : RESO_TRACKS;
    if (listToUse.length === 0) return;
    const currentIndex = listToUse.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + listToUse.length) % listToUse.length;
    const prevTrack = listToUse[prevIndex];
    if (prevTrack) playSpecificTrack(prevTrack);
  };

  const toggleLike = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedTrackIds(prev => {
      const nextState = !prev[trackId];
      showToast(nextState ? 'Added to Liked Songs ❤️' : 'Removed from Liked Songs');
      return { ...prev, [trackId]: nextState };
    });
  };

  const toggleDownload = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadedTrackIds(prev => {
      const nextState = !prev[trackId];
      showToast(nextState ? 'Downloaded for Offline Hi-Fi ⚡' : 'Removed from Downloads');
      return { ...prev, [trackId]: nextState };
    });
  };

  const handleSeek = (fraction: number) => {
    const targetSeconds = Math.floor(fraction * currentTrack.durationSeconds);
    setPlaybackSeconds(targetSeconds);
    if (audioStreamRef.current && currentTrack.previewUrl) {
      audioStreamRef.current.currentTime = Math.min(targetSeconds, 29.5);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTracks = RESO_TRACKS.filter(track => {
    const matchesQuery = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || track.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesQuery && matchesGenre;
  });

  const selectedPlaylist = RESO_PLAYLISTS.find(p => p.id === selectedPlaylistId) || RESO_PLAYLISTS[0];
  const playlistTracks = RESO_TRACKS.filter(t => selectedPlaylist.tracks.includes(t.id));
  const progressPct = (playbackSeconds / currentTrack.durationSeconds) * 100;

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[640px] bg-[#08030f] text-slate-100 flex flex-col font-sans select-none overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      
      {/* Background Ambient Glow matching Reso Neon Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-pink-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[180px]" />
      </div>

      {/* --- TOAST NOTIFICATION POPUP --- */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-pink-500/50 shadow-[0_10px_30px_rgba(236,72,153,0.4)] text-xs font-bold text-white flex items-center gap-2 animate-bounce backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MASTER 3-COLUMN DESKTOP & TABLET STREAMING LAYOUT                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: LEFT NAVIGATION SIDEBAR                                         */}
        {/* ========================================================================= */}
        <aside className="w-60 lg:w-64 bg-[#0a0414]/90 border-r border-white/10 flex flex-col justify-between shrink-0 p-4">
          
          {/* Top Brand Logo & Tagline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Reso Neon Soundwave Logo Mark */}
                <div className="flex items-end gap-0.5 h-6 px-2 py-1 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <span className="w-1 h-3 bg-pink-400 rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-purple-300 rounded-full animate-bounce" style={{ animationDuration: '650ms' }} />
                  <span className="w-1 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-4 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 tracking-tight leading-none">
                    Reso
                  </span>
                  <span className="text-[8px] font-mono tracking-[0.2em] text-pink-400/80 uppercase mt-0.5">
                    MUSIC 4
                  </span>
                </div>
              </div>

              <button 
                onClick={onNavigatePortal}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title="Return to Portal Gateway"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Main Navigation Menu Links */}
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'home' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Feed</span>
              </button>

              <button 
                onClick={() => setActiveNav('search')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'search' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search & Explore</span>
              </button>

              <button 
                onClick={() => setActiveNav('library')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'library' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Library className="w-4 h-4" />
                <span>Your Library</span>
              </button>

              <button 
                onClick={() => setActiveNav('charts')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'charts' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Top Charts (Global 100)</span>
              </button>
            </nav>

            {/* Playlists Quick Access Header */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Curated Playlists</span>
                <button 
                  onClick={() => setShowCreatePlaylistModal(true)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-slate-400 hover:text-pink-300 transition-colors"
                  title="Create Playlist"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Playlist List */}
              <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {RESO_PLAYLISTS.map(pl => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylistId(pl.id);
                      setActiveNav('playlist');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-left transition-all truncate cursor-pointer ${
                      activeNav === 'playlist' && selectedPlaylistId === pl.id
                        ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shrink-0" />
                    <span className="truncate">{pl.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Audio Engine Status Capsule */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-pink-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LOSSLESS 24-BIT
              </span>
              <span className="text-[9px] text-slate-400 font-mono">96kHz</span>
            </div>
            <p className="text-[10px] text-slate-300/80 leading-tight">
              Spatial Dolby Audio Engine Active
            </p>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* COLUMN 2: CENTER MAIN CONTENT WORKSPACE                                   */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-8 space-y-8 bg-gradient-to-b from-[#0c0418] via-[#080210] to-[#05010a]">
          
          {/* Top Search & Profile Bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search songs, artists, albums, playlists..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeNav !== 'search' && e.target.value) setActiveNav('search');
                }}
                className="w-full bg-white/[0.06] focus:bg-white/10 border border-white/10 focus:border-pink-500/60 rounded-2xl pl-11 pr-10 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Genre Chips */}
            <div className="hidden xl:flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['All', 'Synthwave', 'Chill', 'Dream Pop', 'Indie', 'Pop', 'Soul'].map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGenre === genre
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Music APIs Explorer Button */}
            <button 
              onClick={() => setShowApiModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-400/40 text-pink-300 hover:text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] cursor-pointer shrink-0"
              title="Music APIs Explorer & Guide (Apple iTunes, LRCLIB, Deezer)"
            >
              <Globe className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span className="hidden sm:inline">Music APIs</span>
            </button>

            {/* User Profile & Notification */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => showToast('No new notifications')}
                className="p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer relative"
              >
                <Bell className="w-4 h-4 text-pink-400" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              </button>

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.06] border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full object-cover border border-pink-400 shadow-sm"
                />
                <span className="text-xs font-bold text-white hidden sm:inline">Music Lover</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW RENDERER BASED ON ACTIVE NAV                                         */}
          {/* ========================================================================= */}

          {/* --- 1. HOME VIEW --- */}
          {activeNav === 'home' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* HERO SPOTLIGHT BANNER: CHILL VIBES (MATCHING IMAGE SCREEN 3 PALM TREES & SUNSET) */}
              <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-pink-950/80 to-amber-950/60 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {/* Background Artwork Blend */}
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80" 
                  alt="Sunset Palm" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] font-bold tracking-widest uppercase">
                      FEATURED PLAYLIST
                    </span>
                    <span className="text-xs text-slate-300">75 tracks • 4h 12m</span>
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Chill Vibes
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-lg leading-relaxed">
                      Relax, unwind, and let the good vibes play. A master mix of chill beats, lo-fi, and feel-good atmospheric sounds.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => {
                        const firstTrack = playlistTracks[0] || RESO_TRACKS[0];
                        playSpecificTrack(firstTrack, 'pl-chill-vibes');
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs shadow-[0_0_25px_rgba(236,72,153,0.5)] active:scale-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>PAUSE PLAYLIST</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>PLAY CHILL VIBES</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => {
                        setIsShuffle(!isShuffle);
                        showToast(!isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                      title="Shuffle"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedPlaylistId('pl-chill-vibes');
                        setActiveNav('playlist');
                      }}
                      className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      VIEW TRACKLIST
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 1: RECENTLY PLAYED CAROUSEL (FROM IMAGE SCREEN 1) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                    <span>Recently Played</span>
                    <Sparkles className="w-4 h-4 text-pink-400" />
                  </h2>
                  <button 
                    onClick={() => setActiveNav('library')}
                    className="text-xs font-bold text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    See all
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                  {RESO_PLAYLISTS.slice(0, 6).map(pl => (
                    <div 
                      key={pl.id}
                      onClick={() => {
                        setSelectedPlaylistId(pl.id);
                        setActiveNav('playlist');
                      }}
                      className="group flex flex-col p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-pink-500/40 transition-all cursor-pointer shadow-md"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 shadow-md">
                        <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/50">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-white truncate group-hover:text-pink-300 transition-colors">{pl.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Playlist • {pl.songCount} songs</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: MADE FOR YOU (VIBRANT WAVES FROM IMAGE SCREEN 1) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white tracking-wide">Made For You</h2>
                  <button 
                    onClick={() => setActiveNav('made_for_you')}
                    className="text-xs font-bold text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    Explore all mixes
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Discover Weekly */}
                  <div 
                    onClick={() => {
                      setSelectedPlaylistId('pl-chill-vibes');
                      setActiveNav('playlist');
                    }}
                    className="p-5 rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 cursor-pointer active:scale-98 transition-all shadow-[0_15px_35px_rgba(79,70,229,0.35)] border border-white/20 group flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-200 tracking-wider uppercase">Weekly Mix #01</span>
                      <Disc3 className="w-5 h-5 text-white/90 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight mb-1">Discover Weekly</h3>
                      <p className="text-xs text-white/80">Tailored to your cosmic listening patterns</p>
                    </div>
                  </div>

                  {/* Card 2: Focus Flow */}
                  <div 
                    onClick={() => {
                      setSelectedPlaylistId('pl-focus-flow');
                      setActiveNav('playlist');
                    }}
                    className="p-5 rounded-3xl bg-gradient-to-br from-pink-600 via-rose-600 to-amber-500 cursor-pointer active:scale-98 transition-all shadow-[0_15px_35px_rgba(236,72,153,0.35)] border border-white/20 group flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-pink-200 tracking-wider uppercase">Deep Focus</span>
                      <Sparkles className="w-5 h-5 text-white/90" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight mb-1">Focus Flow</h3>
                      <p className="text-xs text-white/80">Acoustic & binaural chill frequencies</p>
                    </div>
                  </div>

                  {/* Card 3: Chill Mix */}
                  <div 
                    onClick={() => {
                      setSelectedPlaylistId('pl-late-night');
                      setActiveNav('playlist');
                    }}
                    className="p-5 rounded-3xl bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 cursor-pointer active:scale-98 transition-all shadow-[0_15px_35px_rgba(6,182,212,0.35)] border border-white/20 group flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-cyan-200 tracking-wider uppercase">Synth & Drive</span>
                      <Radio className="w-5 h-5 text-white/90" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white leading-tight mb-1">Chill Mix</h3>
                      <p className="text-xs text-white/80">Late night cruising beats & ambient synth</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TOP CHARTS NUMBERED TABLE (MATCHING IMAGE SCREEN 1) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white tracking-wide">Top Trending Tracks</h2>
                  <button 
                    onClick={() => setActiveNav('charts')}
                    className="text-xs font-bold text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    View Chart
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {RESO_TRACKS.slice(0, 8).map((track, idx) => {
                    const isThisPlaying = isPlaying && currentTrack.id === track.id;

                    return (
                      <div 
                        key={track.id}
                        onClick={() => playSpecificTrack(track)}
                        className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer group ${
                          isThisPlaying 
                            ? 'bg-pink-500/15 border border-pink-500/40 shadow-sm' 
                            : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="w-5 text-center text-xs font-mono font-bold text-slate-400 group-hover:text-pink-400">
                            {idx + 1}
                          </span>
                          <img src={track.coverUrl} alt={track.title} className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0" />
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold truncate ${isThisPlaying ? 'text-pink-300' : 'text-white group-hover:text-pink-200'}`}>
                              {track.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{track.artist} • {track.plays} plays</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-slate-400">{track.duration}</span>
                          <button 
                            onClick={(e) => toggleLike(track.id, e)}
                            className="p-1.5 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${likedTrackIds[track.id] ? 'fill-pink-500 text-pink-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* --- 2. SEARCH & EXPLORE VIEW (POWERED BY APPLE ITUNES SEARCH API & LRCLIB) --- */}
          {activeNav === 'search' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header with API Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
                    <span>Global Music Search</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold">
                      LIVE API ACTIVE
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Powered by Apple iTunes Search API (Global Catalog & Previews) & LRCLIB (Synchronized Lyrics)
                  </p>
                </div>

                <button 
                  onClick={() => setShowApiModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-400/40 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Info className="w-4 h-4 text-pink-400" />
                  <span>Public APIs Guide</span>
                </button>
              </div>

              {/* Multi-Engine Selector (Apple iTunes vs Deezer vs All) */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 w-fit">
                <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">Search Engine:</span>
                <button
                  onClick={() => setSearchEngine('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    searchEngine === 'all'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🌐 Multi-Engine (iTunes + Deezer)
                </button>
                <button
                  onClick={() => setSearchEngine('itunes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    searchEngine === 'itunes'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🍎 Apple iTunes
                </button>
                <button
                  onClick={() => setSearchEngine('deezer')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    searchEngine === 'deezer'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🎧 Deezer API
                </button>
              </div>

              {/* Instant Test Search Chips (Directly from User Brief) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Instant One-Click Public Catalog Tests:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {[
                    'Queen', 'Coldplay', 'Eminem', 'Taylor Swift', 
                    'The Weeknd', 'Billie Eilish', 'Daft Punk', 'Imagine Dragons', 'Hans Zimmer'
                  ].map(artistTag => (
                    <button
                      key={artistTag}
                      onClick={() => setSearchQuery(artistTag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                        searchQuery.toLowerCase() === artistTag.toLowerCase()
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white shadow-md shadow-pink-500/40 scale-105'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {artistTag}
                    </button>
                  ))}
                </div>
              </div>

              {searchQuery ? (
                <div className="space-y-4">
                  {/* Live Search Status Banner */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      {isSearchingApi ? (
                        <>
                          <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                          <span>Searching via <strong>{searchEngine === 'all' ? 'iTunes & Deezer' : searchEngine === 'itunes' ? 'Apple iTunes' : 'Deezer'}</strong> for "{searchQuery}"...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>
                            Showing {apiSearchResults.length > 0 ? apiSearchResults.length : filteredTracks.length} live tracks for <strong>"{searchQuery}"</strong>
                          </span>
                        </>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      Live Internet Audio Stream Active
                    </span>
                  </div>

                  {/* Track Results List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(apiSearchResults.length > 0 ? apiSearchResults : filteredTracks).map(track => {
                      const isThisPlaying = isPlaying && currentTrack.id === track.id;
                      const isSaved = savedLibraryTracks.some(t => t.id === track.id || (t.title === track.title && t.artist === track.artist));

                      return (
                        <div 
                          key={track.id}
                          onClick={() => playSpecificTrack(track)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer group ${
                            isThisPlaying 
                              ? 'bg-pink-500/20 border border-pink-500/50 shadow-lg shadow-pink-500/20' 
                              : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-white/10">
                              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                              </div>
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <h4 className={`text-xs font-bold truncate ${isThisPlaying ? 'text-pink-300' : 'text-white group-hover:text-pink-200'}`}>
                                {track.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate">
                                {track.artist} • {track.album}
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                  track.source === 'Deezer' 
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' 
                                    : 'bg-pink-500/20 text-pink-300 border border-pink-400/30'
                                }`}>
                                  {track.source === 'Deezer' ? '🎧 Deezer' : '🍎 Apple'}
                                </span>
                                {track.previewUrl && (
                                  <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                    HQ 30s Stream
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono text-slate-400 mr-1">{track.duration}</span>
                            
                            {/* Add to Library Button */}
                            <button
                              onClick={(e) => handleAddToLibrary(track, e)}
                              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                isSaved 
                                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' 
                                  : 'bg-white/5 border-white/10 hover:bg-pink-500/20 hover:border-pink-400/40 text-slate-300 hover:text-pink-300'
                              }`}
                              title={isSaved ? "Saved in My Library" : "Add to My Library"}
                            >
                              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>

                            {/* Favorite Heart */}
                            <button 
                              onClick={(e) => toggleLike(track.id, e)}
                              className="p-1.5 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                            >
                              <Heart className={`w-4 h-4 ${likedTrackIds[track.id] ? 'fill-pink-500 text-pink-500' : ''}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Public Music APIs Architectural Overview Cards */}
                  <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Integrated Public Music APIs (No Key / Instant Access)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Apple iTunes Search API */}
                      <div className="p-4 rounded-3xl bg-gradient-to-br from-pink-950/60 to-purple-950/40 border border-pink-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Apple iTunes Search API (Live)
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            Integrated & Live
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Worldwide music database with instant full metadata, crystal-clear 600x600 artwork, and official 30-second audio stream previews. No registration or API key required.
                        </p>
                      </div>

                      {/* 2. LRCLIB Synced Lyrics API */}
                      <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/60 to-indigo-950/40 border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            LRCLIB Synced Lyrics API (Live)
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            Integrated & Live
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Open community-driven lyrics database delivering timestamped LRC karaoke lyrics and plain text with zero API keys or rate-limit barriers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Browse Moods & Genres Grid */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Browse Moods & Genres</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'Lo-Fi Chill', gradient: 'from-purple-900 to-indigo-700' },
                        { name: 'Synthwave Night', gradient: 'from-pink-600 to-purple-800' },
                        { name: 'Dream Pop', gradient: 'from-blue-600 to-teal-700' },
                        { name: 'Workout Energy', gradient: 'from-rose-600 to-amber-600' },
                        { name: 'Acoustic Soul', gradient: 'from-emerald-700 to-teal-800' },
                        { name: 'Top Billboard', gradient: 'from-amber-600 to-red-700' },
                        { name: 'Late Night Drives', gradient: 'from-indigo-900 to-pink-700' },
                        { name: 'Focus Study', gradient: 'from-teal-800 to-blue-900' }
                      ].map(cat => (
                        <div 
                          key={cat.name}
                          onClick={() => setSearchQuery(cat.name)}
                          className={`p-5 rounded-3xl bg-gradient-to-br ${cat.gradient} h-32 flex flex-col justify-between cursor-pointer active:scale-95 transition-all shadow-lg border border-white/10 hover:border-white/30 group`}
                        >
                          <span className="text-sm font-black text-white group-hover:text-pink-200 transition-colors">{cat.name}</span>
                          <Music className="w-6 h-6 text-white/50 self-end group-hover:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- 3. YOUR LIBRARY VIEW (MATCHING IMAGE SCREEN 4) --- */}
          {(activeNav === 'library' || activeNav === 'made_for_you' || activeNav === 'charts') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Your Music Library</h1>
                  <p className="text-xs text-slate-400 mt-0.5">8 Curated Playlists • 346 Tracks • 24h of Audio</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                    <button 
                      onClick={() => setLibraryLayout('grid')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        libraryLayout === 'grid' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setLibraryLayout('list')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        libraryLayout === 'list' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowCreatePlaylistModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs shadow-md shadow-pink-500/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Playlist</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                {(['playlists', 'artists', 'albums', 'downloaded'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLibraryFilter(tab)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      libraryFilter === tab 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* My Saved Online Tracks (Persisted from Deezer / iTunes APIs) */}
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-pink-500/30 backdrop-blur-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>My Saved Online Tracks</span>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold">
                          {savedLibraryTracks.length} Saved
                        </span>
                      </h2>
                      <p className="text-[11px] text-slate-400">Added from Apple iTunes & Deezer Live APIs • Playable over the Internet</p>
                    </div>
                  </div>

                  {savedLibraryTracks.length > 0 && (
                    <button
                      onClick={() => {
                        const first = savedLibraryTracks[0];
                        if (first) {
                          playSpecificTrack({
                            id: first.id,
                            title: first.title,
                            artist: first.artist,
                            album: first.album,
                            duration: first.duration,
                            durationSeconds: first.durationSeconds,
                            coverUrl: first.coverUrl,
                            previewUrl: first.previewUrl,
                            genre: first.genre,
                            source: first.source,
                            year: first.year,
                            plays: first.plays
                          });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/30 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play All Saved</span>
                    </button>
                  )}
                </div>

                {savedLibraryTracks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
                    {savedLibraryTracks.map((t: any) => {
                      const isThisPlaying = isPlaying && currentTrack.id === t.id;

                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            playSpecificTrack({
                              id: t.id,
                              title: t.title,
                              artist: t.artist,
                              album: t.album,
                              duration: t.duration,
                              durationSeconds: t.durationSeconds,
                              coverUrl: t.coverUrl,
                              previewUrl: t.previewUrl,
                              genre: t.genre,
                              source: t.source,
                              year: t.year,
                              plays: t.plays
                            });
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer group ${
                            isThisPlaying
                              ? 'bg-pink-500/20 border border-pink-400/50 shadow-md'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={t.coverUrl} alt={t.title} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0">
                              <h4 className={`text-xs font-bold truncate ${isThisPlaying ? 'text-pink-300' : 'text-white group-hover:text-pink-200'}`}>
                                {t.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate">{t.artist} • {t.album}</p>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                  t.source === 'Deezer' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-pink-500/20 text-pink-300'
                                }`}>
                                  {t.source === 'Deezer' ? '🎧 Deezer' : '🍎 Apple'}
                                </span>
                                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                  Live Audio
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono text-slate-400">{t.duration}</span>
                            <button
                              onClick={(e) => handleRemoveFromLibrary(t.id, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Remove from My Library"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-2">
                    <Music className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">No tracks added to your cloud library yet</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Search for any artist or song (e.g. Queen, Coldplay, Eminem, Taylor Swift) in the Search tab and click <Plus className="w-3 h-3 inline mx-0.5 text-pink-400" /> to add it here!
                    </p>
                    <button
                      onClick={() => setActiveNav('search')}
                      className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Go to Search
                    </button>
                  </div>
                )}
              </div>

              {/* Grid of Playlists */}
              {libraryLayout === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {RESO_PLAYLISTS.map(pl => (
                    <div 
                      key={pl.id}
                      onClick={() => {
                        setSelectedPlaylistId(pl.id);
                        setActiveNav('playlist');
                      }}
                      className="group flex flex-col rounded-3xl bg-white/[0.03] hover:bg-white/[0.08] p-3 border border-white/5 hover:border-pink-500/40 transition-all cursor-pointer shadow-lg"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-md">
                        <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {pl.isDownloaded && (
                          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-emerald-500/90 text-white shadow-sm">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl shadow-pink-500/50">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate group-hover:text-pink-300 transition-colors">
                            {pl.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">{pl.songCount} songs • by {pl.creator}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {RESO_PLAYLISTS.map(pl => (
                    <div 
                      key={pl.id}
                      onClick={() => {
                        setSelectedPlaylistId(pl.id);
                        setActiveNav('playlist');
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-pink-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={pl.coverUrl} alt={pl.title} className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate group-hover:text-pink-300 transition-colors">{pl.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{pl.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">{pl.songCount} songs</span>
                        {pl.isDownloaded && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- 4. PLAYLIST DETAIL VIEW (MATCHING IMAGE SCREEN 3) --- */}
          {activeNav === 'playlist' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Banner */}
              <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-pink-950/80 to-amber-950/60 border border-white/15">
                <img 
                  src={selectedPlaylist.coverUrl} 
                  alt={selectedPlaylist.title} 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <img 
                    src={selectedPlaylist.coverUrl} 
                    alt={selectedPlaylist.title} 
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-2xl border border-white/20 shrink-0"
                  />

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30">
                      PLAYLIST
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {selectedPlaylist.title}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="font-bold text-white">by {selectedPlaylist.creator}</span>
                      <span>•</span>
                      <span>{selectedPlaylist.songCount} tracks • {selectedPlaylist.duration}</span>
                    </div>
                    <p className="text-xs text-slate-300/90 max-w-xl">
                      {selectedPlaylist.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const firstTrack = playlistTracks[0] || RESO_TRACKS[0];
                    playSpecificTrack(firstTrack);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/40 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>PLAY ALL</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => {
                    setIsShuffle(!isShuffle);
                    showToast(!isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isShuffle 
                      ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => showToast('Downloaded entire playlist for offline listening ⚡')}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Tracklist Table */}
              <div className="space-y-1.5">
                {playlistTracks.map((track, idx) => {
                  const isThisPlaying = isPlaying && currentTrack.id === track.id;

                  return (
                    <div 
                      key={track.id}
                      onClick={() => playSpecificTrack(track)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer group ${
                        isThisPlaying 
                          ? 'bg-pink-500/15 border border-pink-500/40 shadow-sm' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="w-5 text-center text-xs font-mono font-bold text-slate-400 group-hover:text-pink-400">
                          {isThisPlaying ? (
                            <div className="flex items-end gap-0.5 h-3 justify-center">
                              <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-pulse" />
                              <span className="w-0.5 h-3 bg-pink-300 rounded-full animate-bounce" style={{ animationDuration: '500ms' }} />
                            </div>
                          ) : (
                            idx + 1
                          )}
                        </span>

                        <img src={track.coverUrl} alt={track.title} className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0" />

                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate ${isThisPlaying ? 'text-pink-300' : 'text-white group-hover:text-pink-200'}`}>
                            {track.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{track.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-slate-400">{track.duration}</span>
                        <button 
                          onClick={(e) => toggleLike(track.id, e)}
                          className="p-1.5 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${likedTrackIds[track.id] ? 'fill-pink-500 text-pink-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </main>

        {/* ========================================================================= */}
        {/* COLUMN 3: RIGHT PANEL (NOW PLAYING, INTERACTIVE WAVEFORM & LIVE LYRICS)    */}
        {/* ========================================================================= */}
        {isRightPanelExpanded && (
          <aside className="hidden xl:flex w-80 lg:w-88 bg-[#0a0414]/95 border-l border-white/10 flex-col justify-between shrink-0 p-5 overflow-y-auto no-scrollbar">
            
            {/* Top Switcher: Now Playing vs Lyrics vs Queue */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.06] border border-white/10">
                  <button 
                    onClick={() => setRightPanel('nowplaying')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rightPanel === 'nowplaying' 
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Player
                  </button>
                  <button 
                    onClick={() => setRightPanel('lyrics')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rightPanel === 'lyrics' 
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ♫ Lyrics
                  </button>
                  <button 
                    onClick={() => setRightPanel('queue')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rightPanel === 'queue' 
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Queue
                  </button>
                </div>

                <button 
                  onClick={() => setIsRightPanelExpanded(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Minimize Panel"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              {/* TAB 1: NOW PLAYING VIEW (WITH EXACT WAVEFORM SCRUBBER FROM IMAGE SCREEN 2) */}
              {rightPanel === 'nowplaying' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Hero Artwork with Ambient Glow */}
                  <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/40 via-purple-600/40 to-amber-500/30 rounded-3xl blur-xl -z-10 animate-pulse" />
                    <img 
                      src={currentTrack.coverUrl} 
                      alt={currentTrack.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-black text-pink-300 tracking-wider">
                      Reso
                    </div>
                  </div>

                  {/* Title, Artist & Like */}
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-lg font-black text-white truncate">{currentTrack.title}</h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{currentTrack.artist}</p>
                    </div>
                    <button 
                      onClick={(e) => toggleLike(currentTrack.id, e)}
                      className="p-2 text-slate-400 hover:text-pink-400 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${likedTrackIds[currentTrack.id] ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>
                  </div>

                  {/* INTERACTIVE DYNAMIC WAVEFORM SCRUBBER (EXACT SCREEN 2) */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{formatTime(playbackSeconds)}</span>
                      <span className="text-pink-400 font-bold">WAVE AUDIO</span>
                      <span>{currentTrack.duration}</span>
                    </div>

                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const fraction = Math.max(0, Math.min(1, clickX / rect.width));
                        handleSeek(fraction);
                      }}
                      className="h-10 flex items-center justify-between gap-1 cursor-pointer group py-1"
                    >
                      {/* 36 Dynamic Audio Waveform Bars */}
                      {Array.from({ length: 36 }).map((_, i) => {
                        const barFraction = i / 36;
                        const isPlayed = barFraction <= (progressPct / 100);
                        const waveHeight = Math.sin(i * 0.45) * 14 + 16 + (i % 3 === 0 ? 6 : 0);

                        return (
                          <div 
                            key={i}
                            style={{ height: `${waveHeight}px` }}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              isPlayed 
                                ? 'bg-gradient-to-t from-amber-400 via-pink-500 to-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]' 
                                : 'bg-white/15 group-hover:bg-white/25'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Media Controls */}
                  <div className="flex items-center justify-between px-2 pt-1">
                    <button 
                      onClick={() => {
                        setIsShuffle(!isShuffle);
                        showToast(!isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
                      }}
                      className={`p-2 transition-all cursor-pointer ${
                        isShuffle ? 'text-pink-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={handlePreviousTrack}
                      className="p-2 text-slate-300 hover:text-white active:scale-90 transition-all"
                    >
                      <SkipBack className="w-5 h-5 fill-current" />
                    </button>

                    <button 
                      onClick={togglePlayPause}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:shadow-[0_0_30px_rgba(244,63,94,0.85)] active:scale-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </button>

                    <button 
                      onClick={handleNextTrack}
                      className="p-2 text-slate-300 hover:text-white active:scale-90 transition-all"
                    >
                      <SkipForward className="w-5 h-5 fill-current" />
                    </button>

                    <button 
                      onClick={() => {
                        setIsRepeat(!isRepeat);
                        showToast(!isRepeat ? 'Repeat ON' : 'Repeat OFF');
                      }}
                      className={`p-2 transition-all cursor-pointer ${
                        isRepeat ? 'text-pink-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: LIVE SYNCHRONIZED KARAOKE LYRICS VIEW (POWERED BY LRCLIB API) */}
              {rightPanel === 'lyrics' && (
                <div className="space-y-4 animate-fadeIn h-96 overflow-y-auto no-scrollbar py-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold mb-3">
                    <Mic2 className="w-4 h-4 text-pink-400" />
                    <span className="text-white">Live Karaoke Lyrics</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[9px] font-mono">
                      LRCLIB API
                    </span>
                  </div>

                  {isLoadingLyrics ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                      <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
                      <p className="text-xs">Searching LRCLIB for synchronized lyrics...</p>
                    </div>
                  ) : lyricsData?.syncedLyrics && lyricsData.syncedLyrics.length > 0 ? (
                    <div className="space-y-2 px-2">
                      {lyricsData.syncedLyrics.map((line, idx) => {
                        const nextTime = lyricsData.syncedLyrics![idx + 1]?.time ?? 999999;
                        const isCurrentLine = playbackSeconds >= line.time && playbackSeconds < nextTime;

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSeek(line.time / currentTrack.durationSeconds)}
                            className={`transition-all duration-300 rounded-xl px-3 py-2 cursor-pointer ${
                              isCurrentLine
                                ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/25 to-pink-500/20 border border-pink-400/50 scale-[1.03] text-pink-300 font-black shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span className="text-sm sm:text-base leading-relaxed block">
                              {line.text}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400/70 mt-0.5 block">
                              {Math.floor(line.time / 60)}:{(Math.floor(line.time % 60)).toString().padStart(2, '0')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : lyricsData?.plainLyrics && lyricsData.plainLyrics.length > 0 ? (
                    <div className="space-y-2.5 px-2">
                      {lyricsData.plainLyrics.map((line, idx) => (
                        <p 
                          key={idx}
                          className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : lyricsData?.instrumental ? (
                    <div className="py-16 text-center space-y-2 text-slate-400">
                      <Disc3 className="w-8 h-8 text-pink-400 mx-auto animate-spin" />
                      <p className="text-sm font-bold text-white">Instrumental Track</p>
                      <p className="text-xs text-slate-400">No lyrical vocals in this production.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 px-2">
                      {(currentTrack.lyrics || [
                        "Instrumental melody playing...",
                        "Feel the synthesized rhythm and warm ambient pads...",
                        "Pure sonic atmosphere by Reso..."
                      ]).map((line, idx) => (
                        <p 
                          key={idx}
                          className={`text-sm sm:text-base font-bold transition-all py-1.5 ${
                            idx === 2 ? 'text-pink-300 scale-105 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]' : 'text-slate-400 hover:text-white cursor-pointer'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: UP NEXT QUEUE */}
              {rightPanel === 'queue' && (
                <div className="space-y-2 animate-fadeIn max-h-96 overflow-y-auto no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Up Next in Queue</span>
                  {RESO_TRACKS.map((t, idx) => (
                    <div 
                      key={t.id}
                      onClick={() => playSpecificTrack(t)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        currentTrack.id === t.id ? 'bg-pink-500/20 border border-pink-400/50' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}</span>
                        <img src={t.coverUrl} alt={t.title} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{t.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{t.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{t.duration}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Bottom Connect Modal Shortcut */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <button 
                onClick={() => setShowDeviceModal(true)}
                className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
              >
                <Cast className="w-4 h-4" />
                <span>AirPlay Reso Hi-Fi</span>
              </button>
              <span className="font-mono text-emerald-400">Connected</span>
            </div>
          </aside>
        )}

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM PERSISTENT PLAYER BAR (FULL-WIDTH GLASSMORPHIC STREAMING BAR)      */}
      {/* ========================================================================= */}
      <footer className="h-20 bg-[#0a0314]/95 border-t border-white/10 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0 relative z-30">
        
        {/* Left: Current Playing Info */}
        <div className="flex items-center gap-3.5 min-w-0 w-1/4">
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-12 h-12 rounded-xl object-cover shadow-md border border-white/15 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{currentTrack.title}</h4>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentTrack.artist}</p>
          </div>
          <button 
            onClick={(e) => toggleLike(currentTrack.id, e)}
            className="p-1.5 text-slate-400 hover:text-pink-400 transition-colors shrink-0"
          >
            <Heart className={`w-4 h-4 ${likedTrackIds[currentTrack.id] ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setIsShuffle(!isShuffle);
                showToast(!isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
              }}
              className={`p-1.5 transition-all cursor-pointer ${
                isShuffle ? 'text-pink-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button 
              onClick={handlePreviousTrack}
              className="p-1.5 text-slate-300 hover:text-white active:scale-90 transition-all"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button 
              onClick={togglePlayPause}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.6)] active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            <button 
              onClick={handleNextTrack}
              className="p-1.5 text-slate-300 hover:text-white active:scale-90 transition-all"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button 
              onClick={() => {
                setIsRepeat(!isRepeat);
                showToast(!isRepeat ? 'Repeat ON' : 'Repeat OFF');
              }}
              className={`p-1.5 transition-all cursor-pointer ${
                isRepeat ? 'text-pink-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrubber Bar */}
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>{formatTime(playbackSeconds)}</span>
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const fraction = Math.max(0, Math.min(1, clickX / rect.width));
                handleSeek(fraction);
              }}
              className="relative flex-1 h-1.5 bg-white/15 hover:h-2 rounded-full cursor-pointer transition-all group"
            >
              <div 
                style={{ width: `${progressPct}%` }}
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full group-hover:shadow-[0_0_10px_rgba(236,72,153,0.8)]"
              />
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Right: Volume & Utilities */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <button 
            onClick={() => {
              setRightPanel('lyrics');
              setIsRightPanelExpanded(true);
            }}
            className="p-2 text-slate-400 hover:text-pink-400 transition-colors hidden sm:inline"
            title="Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          <button 
            onClick={() => {
              setRightPanel('queue');
              setIsRightPanelExpanded(true);
            }}
            className="p-2 text-slate-400 hover:text-pink-400 transition-colors hidden sm:inline"
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolume(val);
                if (isMuted) setIsMuted(false);
                AudioSynth.setVolume(val / 100);
              }}
              className="w-16 sm:w-20 h-1 bg-white/20 rounded-full appearance-none accent-pink-500 cursor-pointer"
            />
          </div>

          <button 
            onClick={() => setIsRightPanelExpanded(!isRightPanelExpanded)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all ml-1 hidden xl:inline"
            title={isRightPanelExpanded ? "Collapse Side Panel" : "Expand Side Panel"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </footer>

      {/* ========================================================================= */}
      {/* DEVICE / AIRPLAY MODAL                                                    */}
      {/* ========================================================================= */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-cyan-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cast className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Connect Audio Device</h3>
              </div>
              <button 
                onClick={() => setShowDeviceModal(false)}
                className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: 'This Device (Lossless Web Studio)', status: 'Connected • 24-bit/96kHz', active: true },
                { name: 'Reso Atmos Studio Monitors', status: 'Available on Wi-Fi' },
                { name: 'Cosmic Wireless Earbuds Pro', status: 'Bluetooth Low Latency' }
              ].map(dev => (
                <div 
                  key={dev.name}
                  onClick={() => {
                    showToast(`Switched audio output to: ${dev.name}`);
                    setShowDeviceModal(false);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    dev.active 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{dev.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{dev.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE NEW PLAYLIST MODAL                                                 */}
      {/* ========================================================================= */}
      {showCreatePlaylistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-pink-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Create New Playlist</h3>
              <button 
                onClick={() => setShowCreatePlaylistModal(false)}
                className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input 
              type="text"
              placeholder="Playlist title (e.g. Midnight Drive Mix)"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-pink-400 mb-4"
            />

            <button 
              onClick={() => {
                if (newPlaylistTitle.trim()) {
                  showToast(`Created playlist: ${newPlaylistTitle}`);
                  setNewPlaylistTitle('');
                  setShowCreatePlaylistModal(false);
                }
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/40 active:scale-95 transition-all cursor-pointer"
            >
              Create Playlist
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PUBLIC MUSIC APIS GUIDE & EXPLORER MODAL                                  */}
      {/* ========================================================================= */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-pink-500/40 p-6 shadow-2xl space-y-6 my-8 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-pink-400 animate-pulse" />
                <div>
                  <h3 className="text-base font-black text-white">Music APIs Architecture Guide</h3>
                  <p className="text-[11px] text-slate-400">Classification & Integration Details for Global Music Search</p>
                </div>
              </div>
              <button 
                onClick={() => setShowApiModal(false)}
                className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category 1: Public / No-Key APIs (Instantly Usable) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ۱. سرویس‌های باز بدون نیاز به کلید (استفاده فوری و فعال در برنامه)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Ready & Live
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Apple iTunes Search API */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Apple iTunes Search API</span>
                    <span className="text-[10px] text-emerald-300 font-mono">CORS Open • Active Live</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    پایگاه داده آزاد آیتونز و اپل موزیک. کاملاً رایگان و بدون نیاز به کلید. بازگرداننده متادیتای قطعه، نام خواننده، آلبوم، کاور ۶۰۰×۶۰۰ و پیش‌نمایش صوتی ۳۰ ثانیه‌ای با فرمت استریم رسمی.
                  </p>
                  <code className="block text-[10px] font-mono text-pink-300/90 bg-black/40 p-1.5 rounded-lg mt-1 overflow-x-auto">
                    https://itunes.apple.com/search?term=coldplay&entity=song&limit=10
                  </code>
                </div>

                {/* LRCLIB API */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">LRCLIB API (متن شعر همگام‌شده)</span>
                    <span className="text-[10px] text-purple-300 font-mono">Synced LRC • Active Live</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    سرویس کاملاً رایگان و آزاد برای دریافت متن آهنگ و لیریکس کارائوکه با زمان‌بندی همگام (Synced LRC). بدون محدودیت سختگیرانه و بدون نیاز به توکن.
                  </p>
                  <code className="block text-[10px] font-mono text-purple-300/90 bg-black/40 p-1.5 rounded-lg mt-1 overflow-x-auto">
                    https://lrclib.net/api/get?track_name=imagine&artist_name=john%20lennon
                  </code>
                </div>

                {/* Deezer API */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Deezer API</span>
                    <span className="text-[10px] text-cyan-300 font-mono">No Key Required</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    کاتالوگ جامع جهانی دیزر با متادیتای کامل (خواننده، آلبوم، کاور، مدت‌زمان) و لینک پیش‌نمایش MP3 ۳۰ ثانیه‌ای بدون احراز هویت.
                  </p>
                  <code className="block text-[10px] font-mono text-cyan-300/90 bg-black/40 p-1.5 rounded-lg mt-1 overflow-x-auto">
                    https://api.deezer.com/search?q=queen
                  </code>
                </div>

                {/* MusicBrainz API */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">MusicBrainz API (پایگاه متن‌باز جهانی)</span>
                    <span className="text-[10px] text-amber-300 font-mono">Open Encyclopedia</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    بزرگترین دانشنامه متادیتای آزاد با کدهای استاندارد بین‌المللی ISRC و شناسه‌های استاندارد.
                  </p>
                </div>
              </div>
            </div>

            {/* Category 2: Platforms with API Key */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-pink-400" />
                ۲. پلتفرم‌های اصلی (نیازمند ثبت‌نام و دریافت API Key)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="font-bold text-white block">Spotify Web API</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">نیازمند ساخت پروژه در Spotify Dashboard و دریافت OAuth Client Credentials.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="font-bold text-white block">YouTube Data API v3</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">نیازمند فعال‌سازی در Google Cloud Console و سهمیه کوئری روزانه.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="font-bold text-white block">Last.fm API</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">مناسب بیوگرافی و قطعات مشابه؛ دریافت API Key رایگان در چند ثانیه.</p>
                </div>
              </div>
            </div>

            {/* One-Click Live Test Action Buttons */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <span className="text-xs font-bold text-white block">
                تست فوری جستجو با APIهای زنده:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Queen', 'Coldplay', 'Eminem', 'Taylor Swift', 'The Weeknd'].map(artist => (
                  <button
                    key={artist}
                    onClick={() => {
                      setSearchQuery(artist);
                      setActiveNav('search');
                      setShowApiModal(false);
                      showToast(`Searching live for: ${artist}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    جستجوی «{artist}»
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Real HTML5 Audio Stream for iTunes Previews */}
      <audio 
        ref={audioStreamRef} 
        onEnded={handleNextTrack} 
        className="hidden" 
        preload="auto" 
      />

    </div>
  );
};

export default MusicV4View;
