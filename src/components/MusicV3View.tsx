/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Heart, Compass, User, Shield, Settings, LogOut,
  Search, Bell, ChevronDown, ChevronRight, Play, Pause,
  SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle,
  X, Loader2
} from 'lucide-react';
import { Track, AURA_TRACKS } from '../data/auraStore';
import { musicApi, LyricResult } from '../services/musicApiService';
import { AudioSynth } from '../utils/AudioSynth';

export interface MusicV3Artist {
  id: string;
  name: string;
  listeners: string;
  avatar: string;
  query: string;
  genre: string;
}

export interface MusicV3Highlight {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  query: string;
  duration: string;
  durationSeconds: number;
  genre: string;
  year: string;
}

const TOP_ARTISTS_INITIAL: MusicV3Artist[] = [
  {
    id: 'art-rosalia',
    name: 'Rosalia',
    listeners: '3.7M Listeners',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    query: 'Rosalia Despecha',
    genre: 'Latin Pop / Avant-Garde'
  },
  {
    id: 'art-kendrick',
    name: 'Kendrick Lamar',
    listeners: '2.3M Listeners',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    query: 'Kendrick Lamar HUMBLE',
    genre: 'Hip-Hop / Rap'
  },
  {
    id: 'art-travis',
    name: 'Travis Scott',
    listeners: '1.7M Listeners',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    query: 'Travis Scott SICKO MODE',
    genre: 'Trap / Hip-Hop'
  },
  {
    id: 'art-billie',
    name: 'Billie Eilish',
    listeners: '4.5M Listeners',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    query: 'Billie Eilish Birds of a Feather',
    genre: 'Alternative Pop'
  },
  {
    id: 'art-beyonce',
    name: 'Beyonce',
    listeners: '8.4M Listeners',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    query: 'Beyonce Texas Hold Em',
    genre: 'Pop / R&B / Country'
  },
  {
    id: 'art-taylor',
    name: 'Taylor Swift',
    listeners: '6.2M Listeners',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    query: 'Taylor Swift Cruel Summer',
    genre: 'Pop / Synth-Pop'
  }
];

const LISTENING_HIGHLIGHTS_INITIAL: MusicV3Highlight[] = [
  {
    id: 'hl-starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy (Deluxe)',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=85',
    query: 'The Weeknd Starboy',
    duration: '3:50',
    durationSeconds: 230,
    genre: 'R&B / Synthwave',
    year: '2016'
  },
  {
    id: 'hl-fame',
    title: 'Fame',
    artist: 'Ariana Grande',
    album: 'Eternal Sunshine',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=85',
    query: 'Ariana Grande we cant be friends',
    duration: '3:28',
    durationSeconds: 208,
    genre: 'Pop / R&B',
    year: '2024'
  },
  {
    id: 'hl-butterfly',
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    album: 'To Pimp a Butterfly',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=85',
    query: 'Kendrick Lamar Alright',
    duration: '3:39',
    durationSeconds: 219,
    genre: 'Conscious Hip-Hop',
    year: '2015'
  },
  {
    id: 'hl-cowboy',
    title: 'Cowboy Carter',
    artist: 'Beyonce',
    album: 'Cowboy Carter',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=85',
    query: 'Beyonce Texas Hold Em',
    duration: '3:53',
    durationSeconds: 233,
    genre: 'Country / Pop',
    year: '2024'
  }
];

const HERO_FEATURED_TRACK: Track = {
  id: 'lunio-hero-gaga',
  title: 'Bad Romance',
  artist: 'Lady Gaga',
  album: 'The Fame Monster (Deluxe)',
  artistPhoto: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85',
  duration: '4:54',
  durationSeconds: 294,
  genre: 'Electro-Pop / Dance',
  vibes: ['Workout', 'Party', 'Pop'],
  cozyIndex: 85,
  colorFrom: 'from-red-600',
  colorTo: 'to-rose-900',
  audioSynthType: 'music',
  previewUrl: '/api/resolve-stream?q=Lady%20Gaga%20Bad%20Romance',
  year: '2024',
  source: 'Studio Master'
};

// Predictive lead-time offset (in seconds) so each lyric line highlights slightly BEFORE the singer voices it
const LYRIC_LEAD_TIME_SECONDS = 0.75;

interface MusicV3ViewProps {
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
  onNavigateWorld?: (world: string) => void;
}

export function MusicV3View({
  currentTrack,
  isPlaying,
  setIsPlaying,
  trackProgress,
  currentTrackSeconds,
  audioDuration = 192,
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
  onNavigateWorld
}: MusicV3ViewProps) {
  // Left Sidebar Navigation State
  const [activeNav, setActiveNav] = useState<'home' | 'likes' | 'explore' | 'artists' | 'albums' | 'settings'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resolvedQuery, setResolvedQuery] = useState<string>('');
  const [apiTracks, setApiTracks] = useState<Track[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState<boolean>(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const searchRequestIdRef = useRef<number>(0);

  // Enriched real artwork & tracks from iTunes/Deezer on mount
  const [topArtists, setTopArtists] = useState<MusicV3Artist[]>(TOP_ARTISTS_INITIAL);
  const [highlights, setHighlights] = useState<MusicV3Highlight[]>(LISTENING_HIGHLIGHTS_INITIAL);
  const [heroCutoutUrl, setHeroCutoutUrl] = useState<string>('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85');

  // Modals & Popovers
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState<boolean>(false);
  const [lyricsData, setLyricsData] = useState<LyricResult | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);

  // Refs for smooth auto-scrolling synced lyrics
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const lyricLineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const userScrollingLyricsRef = useRef<boolean>(false);
  const userScrollTimeoutRef = useRef<number | null>(null);

  // Volume & Scrubbing
  const [volumeLevel, setVolumeLevel] = useState<number>(80);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Persistent Liked Tracks Repository (shared with Music 2 in localStorage)
  const [savedLibraryTracks, setSavedLibraryTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('audiovido_saved_liked_tracks_catalog_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [AURA_TRACKS[0], AURA_TRACKS[4], AURA_TRACKS[8]];
  });

  // Automatically open the split Cover + Lyrics Showcase whenever a track starts playing
  useEffect(() => {
    if (currentTrack && isPlaying) {
      setIsPlayerExpanded(true);
    }
  }, [currentTrack?.id, isPlaying]);

  const handleToggleLike = (track: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleLikeTrack(track.id, e);
    setSavedLibraryTracks(prev => {
      const exists = prev.some(t => t.id === track.id);
      const next = exists ? prev.filter(t => t.id !== track.id) : [track, ...prev];
      try {
        localStorage.setItem('audiovido_saved_liked_tracks_catalog_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Default Display Track for the Bottom Bar (matches screenshot "Born To Die - Lana Del Rey" when idle)
  const displayTrack: Track = currentTrack || {
    id: 'lunio-default-lana',
    title: 'Born To Die',
    artist: 'Lana Del Rey',
    album: 'Born To Die (The Paradise Edition)',
    artistPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    duration: '3:12',
    durationSeconds: 192,
    genre: 'Alternative Pop',
    vibes: ['Chill', 'Sadcore'],
    cozyIndex: 95,
    colorFrom: 'from-red-600',
    colorTo: 'to-rose-800',
    audioSynthType: 'music',
    previewUrl: '/api/resolve-stream?q=Lana%20Del%20Rey%20Born%20To%20Die'
  };

  // Fetch real high-res covers for Top Artists & Listening Highlights on mount
  useEffect(() => {
    let isMounted = true;

    const enrichInitialCatalog = async () => {
      try {
        const updatedHighlights = await Promise.all(
          LISTENING_HIGHLIGHTS_INITIAL.map(async (item) => {
            try {
              const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(item.query)}&entity=song&limit=1`);
              if (!res.ok) return item;
              const data = await res.json();
              const match = data?.results?.[0];
              if (match?.artworkUrl100) {
                return {
                  ...item,
                  coverUrl: match.artworkUrl100.replace('100x100bb', '600x600bb'),
                  durationSeconds: match.trackTimeMillis ? Math.round(match.trackTimeMillis / 1000) : item.durationSeconds
                };
              }
            } catch {}
            return item;
          })
        );
        if (isMounted) setHighlights(updatedHighlights);

        const updatedArtists = await Promise.all(
          TOP_ARTISTS_INITIAL.map(async (art) => {
            try {
              const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(art.name)}&entity=song&limit=1`);
              if (!res.ok) return art;
              const data = await res.json();
              const match = data?.results?.[0];
              if (match?.artworkUrl100) {
                return {
                  ...art,
                  avatar: match.artworkUrl100.replace('100x100bb', '400x400bb')
                };
              }
            } catch {}
            return art;
          })
        );
        if (isMounted) setTopArtists(updatedArtists);

        try {
          const gagaRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent('Lady Gaga Bad Romance')}&entity=song&limit=1`);
          if (gagaRes.ok) {
            const gData = await gagaRes.json();
            const gMatch = gData?.results?.[0];
            if (gMatch?.artworkUrl100 && isMounted) {
              setHeroCutoutUrl(gMatch.artworkUrl100.replace('100x100bb', '600x600bb'));
            }
          }
        } catch {}
      } catch {}
    };

    enrichInitialCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize Volume
  useEffect(() => {
    AudioSynth.setVolume(volumeLevel / 100);
    const audioTags = document.querySelectorAll('audio');
    audioTags.forEach(a => {
      a.volume = volumeLevel / 100;
    });
  }, [volumeLevel]);

  // Execute full-track search (SoundCloud + JioSaavn 320k + Audius + YouTube Music) for the complete typed query
  const runCompleteQuerySearch = React.useCallback(async (rawQuery: string, reqId: number) => {
    const q = rawQuery.trim();
    if (!q || q.length < 2) {
      if (reqId === searchRequestIdRef.current) {
        setApiTracks([]);
        setResolvedQuery('');
        setIsSearchingApi(false);
      }
      return;
    }

    try {
      const results = await musicApi.searchTracks(q, 'all', 16);
      // Strictly ignore if user typed more characters while this request was in flight
      if (reqId !== searchRequestIdRef.current) return;

      const mapped: Track[] = results.map((item) => ({
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
        cozyIndex: 90,
        colorFrom: 'from-red-500',
        colorTo: 'to-rose-700',
        audioSynthType: 'music',
        isFullTrack: true
      }));

      setApiTracks(mapped);
      setResolvedQuery(q);
    } catch (err) {
      if (reqId === searchRequestIdRef.current) {
        console.warn('Music 3 search error:', err);
      }
    } finally {
      if (reqId === searchRequestIdRef.current) {
        setIsSearchingApi(false);
      }
    }
  }, []);

  // Wait until the user finishes typing the complete word/phrase up to the last letter (600ms debounce + strict cancellation)
  useEffect(() => {
    const q = searchQuery.trim();
    const nextReqId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = nextReqId;

    if (!q || q.length < 2) {
      setApiTracks([]);
      setResolvedQuery('');
      setIsSearchingApi(false);
      return;
    }

    setIsSearchingApi(true);
    setApiTracks([]);

    const timer = window.setTimeout(() => {
      runCompleteQuerySearch(q, nextReqId);
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery, runCompleteQuerySearch]);

  // Load real full synced lyrics whenever track changes (immediately clear previous song's lyrics)
  useEffect(() => {
    const target = currentTrack || displayTrack;
    if (!target) return;
    let isSubscribed = true;
    setLyricsData(null);
    setIsLoadingLyrics(true);
    lyricLineRefs.current = [];
    if (lyricsContainerRef.current) {
      lyricsContainerRef.current.scrollTop = 0;
    }

    musicApi
      .fetchLyrics(target.title, target.artist)
      .then((res) => {
        if (isSubscribed) {
          setLyricsData(res);
          setIsLoadingLyrics(false);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setLyricsData(null);
          setIsLoadingLyrics(false);
        }
      });
    return () => {
      isSubscribed = false;
    };
  }, [currentTrack?.id, currentTrack?.title, currentTrack?.artist]);

  // Build Complete Full-Length Timestamped Lyrics Array exclusively from the active song's real lyrics
  const effectiveDuration = Math.max(60, audioDuration || displayTrack.durationSeconds || 192);
  const fullSyncedLines = React.useMemo(() => {
    if (lyricsData?.syncedLyrics && lyricsData.syncedLyrics.length > 0) {
      return lyricsData.syncedLyrics;
    }
    if (lyricsData?.plainLyrics && lyricsData.plainLyrics.length > 0) {
      const total = lyricsData.plainLyrics.length;
      const step = effectiveDuration / Math.max(1, total);
      return lyricsData.plainLyrics.map((text, idx) => ({
        time: Math.round(idx * step * 10) / 10,
        text
      }));
    }
    return [];
  }, [lyricsData, effectiveDuration]);

  // Determine the currently active lyric line index WITH PREDICTIVE LEAD-TIME (+0.75s)
  // so the line becomes bold slightly BEFORE the singer voices it
  const activeLyricIndex = React.useMemo(() => {
    if (!fullSyncedLines.length) return 0;
    const adjustedTime = (currentTrack ? currentTrackSeconds : 0) + LYRIC_LEAD_TIME_SECONDS;
    let activeIdx = 0;
    for (let i = 0; i < fullSyncedLines.length; i++) {
      if (adjustedTime >= fullSyncedLines[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }
    return activeIdx;
  }, [fullSyncedLines, currentTrackSeconds, currentTrack]);

  // Smoothly auto-scroll the active lyric line into the upper-middle focus zone of the right-hand lyrics panel
  useEffect(() => {
    if (!isPlayerExpanded || userScrollingLyricsRef.current) return;
    const container = lyricsContainerRef.current;
    const activeEl = lyricLineRefs.current[activeLyricIndex];
    if (container && activeEl) {
      const targetScrollTop =
        activeEl.offsetTop - container.clientHeight * 0.3 + activeEl.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }, [activeLyricIndex, isPlayerExpanded]);

  const handleUserLyricsScroll = () => {
    userScrollingLyricsRef.current = true;
    if (userScrollTimeoutRef.current) {
      window.clearTimeout(userScrollTimeoutRef.current);
    }
    userScrollTimeoutRef.current = window.setTimeout(() => {
      userScrollingLyricsRef.current = false;
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  // Play helper for Highlights & Top Artists
  const playHighlightItem = (hl: MusicV3Highlight) => {
    const track: Track = {
      id: hl.id,
      title: hl.title,
      artist: hl.artist,
      album: hl.album,
      artistPhoto: hl.coverUrl,
      duration: hl.duration,
      durationSeconds: hl.durationSeconds,
      genre: hl.genre,
      vibes: ['Highlight', hl.genre],
      cozyIndex: 92,
      colorFrom: 'from-red-600',
      colorTo: 'to-rose-800',
      audioSynthType: 'music',
      previewUrl: `/api/resolve-stream?q=${encodeURIComponent(hl.query)}`,
      year: hl.year,
      source: 'Studio Master',
      isFullTrack: true
    };
    onSelectTrack(track);
    setIsPlaying(true);
    setIsPlayerExpanded(true);
  };

  const playArtistTopTrack = async (artist: MusicV3Artist) => {
    const tempTrack: Track = {
      id: `lunio-art-${artist.id}`,
      title: `${artist.name} Essentials`,
      artist: artist.name,
      album: `${artist.name} Top Hits`,
      artistPhoto: artist.avatar,
      duration: '3:30',
      durationSeconds: 210,
      genre: artist.genre,
      vibes: ['Top Artist', artist.genre],
      cozyIndex: 90,
      colorFrom: 'from-red-600',
      colorTo: 'to-rose-800',
      audioSynthType: 'music',
      previewUrl: `/api/resolve-stream?q=${encodeURIComponent(artist.query)}`,
      year: '2024',
      source: 'Artist Radio',
      isFullTrack: true
    };

    try {
      const results = await musicApi.searchTracks(artist.query, 'all', 5);
      if (results.length > 0) {
        const best = results[0];
        onSelectTrack({
          id: best.id,
          title: best.title,
          artist: best.artist,
          album: best.album,
          artistPhoto: best.coverUrl || artist.avatar,
          duration: best.duration,
          durationSeconds: best.durationSeconds,
          genre: best.genre || artist.genre,
          vibes: ['Top Artist', best.genre || 'Pop'],
          cozyIndex: 92,
          colorFrom: 'from-red-600',
          colorTo: 'to-rose-800',
          audioSynthType: 'music',
          previewUrl: best.previewUrl,
          year: best.year || '2024',
          source: best.source,
          isFullTrack: true
        });
        setIsPlaying(true);
        setIsPlayerExpanded(true);
        return;
      }
    } catch {}

    onSelectTrack(tempTrack);
    setIsPlaying(true);
    setIsPlayerExpanded(true);
  };

  // Scrubber Pointer Handlers
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
    handleSeek(calculateScrubberPct(e.clientX, target));
  };

  const handlePointerMoveScrubber = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing || !currentTrack) return;
    handleSeek(calculateScrubberPct(e.clientX, e.currentTarget));
  };

  const handlePointerUpScrubber = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsScrubbing(false);
  };

  // Liked Songs Merged List
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

  const isCurrentLiked = currentTrack ? !!likedTracks[currentTrack.id] : true;

  const searchResultsList = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    // If API tracks for the current query are ready, return them
    if (apiTracks.length > 0 && resolvedQuery.toLowerCase() === q) {
      return apiTracks;
    }
    // While waiting for user to finish typing or API to resolve, do not show stale partial API tracks
    if (isSearchingApi) {
      return [];
    }
    return allTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.album && t.album.toLowerCase().includes(q))
    );
  }, [apiTracks, allTracks, searchQuery, resolvedQuery, isSearchingApi]);

  return (
    <div className="w-full max-w-[1280px] mx-auto my-1 sm:my-2 animate-fadeIn select-none font-sans">
      {/* Click-outside backdrop when search dropdown is open */}
      {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] animate-fadeIn"
          onClick={() => setIsSearchDropdownOpen(false)}
        />
      )}

      {/* MAIN LIGHT-CREAM ROUNDED APPLICATION SHELL */}
      <div className="relative w-full min-h-[760px] rounded-[28px] sm:rounded-[42px] bg-[#F4F3F1] text-[#141416] shadow-[0_30px_90px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-white/80 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-7 overflow-visible">

        {/* =================================================================== */}
        {/* LEFT SIDEBAR: CLEAN VERTICAL CIRCULAR ICON BUTTONS                  */}
        {/* =================================================================== */}
        <aside className="flex md:flex-col items-center justify-center md:justify-between md:w-[60px] shrink-0 gap-3 md:py-2 z-30">
          <nav className="flex md:flex-col items-center justify-center gap-2.5 sm:gap-3.5 md:my-auto w-full md:w-auto">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'likes', icon: Heart, label: 'Liked Songs' },
              { id: 'explore', icon: Compass, label: 'Explore & Vibes' },
              { id: 'artists', icon: User, label: 'Top Artists' },
              { id: 'albums', icon: Shield, label: 'Albums Vault' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id as any)}
                  title={item.label}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#E61E2A] text-white shadow-[0_8px_20px_rgba(230,30,42,0.4)] scale-105'
                      : 'bg-white text-[#18181B] hover:bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-105'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isActive && item.id === 'likes' ? 'fill-white' : item.id === 'likes' ? 'fill-[#18181B]' : ''}`} />
                </button>
              );
            })}
          </nav>

          {/* Bottom Utility Icons: Settings & Return to Portal */}
          <div className="hidden md:flex flex-col items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              title="Audio Settings"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'settings'
                  ? 'bg-[#E61E2A] text-white shadow-[0_8px_20px_rgba(230,30,42,0.35)]'
                  : 'bg-white text-[#18181B] hover:bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateWorld && onNavigateWorld('portal')}
              title="Return to AudioVido Portal"
              className="w-11 h-11 rounded-full bg-white text-[#18181B] hover:bg-red-50 hover:text-[#E61E2A] flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MAIN WORKSPACE CONTENT AREA                                         */}
        {/* =================================================================== */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-6">
          
          {/* 1. TOP HEADER ROW: 3-ZONE SYMMETRICAL BAR WITH CENTERED SEARCH ON ALL DEVICES */}
          <header className="grid grid-cols-1 md:grid-cols-12 items-center gap-3.5 sm:gap-4 relative z-50">
            
            {/* Left 3 Cols: "Hello, Alex!" + Mobile Right Icons */}
            <div className="md:col-span-3 flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight text-[#141416] leading-none whitespace-nowrap">
                Hello, <span className="text-[#E61E2A]">Alex!</span>
              </h1>

              {/* Mobile-only Notification & Profile triggers */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                    setIsSearchDropdownOpen(false);
                  }}
                  className="w-10 h-10 rounded-full bg-white text-[#141416] flex items-center justify-center shadow-sm cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 fill-[#141416]" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E61E2A] ring-2 ring-white" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-white shadow-sm cursor-pointer"
                  title="Profile"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Alex"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* CENTER 6 COLS: PROMINENT CENTERED SEARCH BAR (Mobile, Tablet & Laptop) */}
            <div className="md:col-span-6 flex items-center justify-center w-full">
              <div className="relative w-full max-w-xl mx-auto">
                <Search className="w-4.5 h-4.5 text-[#E61E2A] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onFocus={() => {
                    setIsSearchDropdownOpen(true);
                    setShowNotifications(false);
                    setShowProfileMenu(false);
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    setIsSearchDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const q = searchQuery.trim();
                      if (q.length >= 2 && resolvedQuery.toLowerCase() !== q.toLowerCase()) {
                        const reqId = searchRequestIdRef.current + 1;
                        searchRequestIdRef.current = reqId;
                        setIsSearchingApi(true);
                        runCompleteQuerySearch(q, reqId);
                      } else if (searchResultsList.length > 0) {
                        onSelectTrack(searchResultsList[0]);
                        setIsPlaying(true);
                        setIsPlayerExpanded(true);
                        setIsSearchDropdownOpen(false);
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }
                    }
                    if (e.key === 'Escape') {
                      setIsSearchDropdownOpen(false);
                    }
                  }}
                  placeholder="Search songs, artists, or albums..."
                  className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-full bg-white text-[#141416] placeholder-neutral-400 text-[16px] sm:text-sm font-semibold shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-neutral-200/80 focus:border-[#E61E2A] focus:ring-4 focus:ring-[#E61E2A]/15 focus:outline-none transition-all select-text"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      searchRequestIdRef.current += 1;
                      setSearchQuery('');
                      setResolvedQuery('');
                      setApiTracks([]);
                      setIsSearchingApi(false);
                      setIsSearchDropdownOpen(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* FLOATING RESPONSIVE SEARCH DROPDOWN */}
                {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full mt-2.5 left-0 right-0 w-full bg-white rounded-[26px] p-3 sm:p-4 shadow-[0_28px_70px_rgba(0,0,0,0.24)] border border-neutral-200 z-[100] space-y-2.5 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 px-1 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Search className="w-3.5 h-3.5 text-[#E61E2A] shrink-0" />
                        <span className="text-xs font-extrabold text-neutral-900 truncate">
                          Results for "{searchQuery}"
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isSearchingApi && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E61E2A] bg-red-50 px-2.5 py-0.5 rounded-full">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Searching...</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsSearchDropdownOpen(false)}
                          className="text-neutral-400 hover:text-neutral-800 p-1 rounded-full hover:bg-neutral-100 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[340px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                      {searchResultsList.length === 0 && isSearchingApi ? (
                        <div className="py-8 flex flex-col items-center justify-center gap-2 text-center text-xs text-neutral-500 font-semibold">
                          <Loader2 className="w-5 h-5 animate-spin text-[#E61E2A]" />
                          <span>Searching full tracks for "{searchQuery}"...</span>
                        </div>
                      ) : searchResultsList.length === 0 && !isSearchingApi ? (
                        <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                          No matching tracks found. Try another song or artist name.
                        </div>
                      ) : (
                        searchResultsList.map((t, idx) => {
                          const isCurr = currentTrack?.id === t.id;
                          return (
                            <div
                              key={t.id || idx}
                              onClick={() => {
                                onSelectTrack(t);
                                setIsPlaying(true);
                                setIsPlayerExpanded(true);
                                setIsSearchDropdownOpen(false);
                              }}
                              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all gap-3 border ${
                                isCurr
                                  ? 'bg-red-50/90 border-[#E61E2A]/40 shadow-sm'
                                  : 'bg-neutral-50/70 hover:bg-neutral-100 border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 shadow-sm bg-neutral-200">
                                  <img
                                    src={t.artistPhoto}
                                    alt={t.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <h4 className={`text-sm sm:text-[15px] font-extrabold leading-snug break-words line-clamp-1 ${
                                    isCurr ? 'text-[#E61E2A]' : 'text-[#141416]'
                                  }`}>
                                    {t.title}
                                  </h4>
                                  <p className="text-xs text-neutral-500 font-semibold truncate">
                                    {t.artist} {t.album ? `· ${t.album}` : ''}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0">
                                <span className="text-xs font-mono font-semibold text-neutral-500 tabular-nums">
                                  {t.duration}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-[#E61E2A] text-white flex items-center justify-center shadow-sm shrink-0">
                                  {isCurr && isPlaying ? (
                                    <Pause className="w-3.5 h-3.5 fill-white" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT 3 COLS (Desktop/Tablet): Notification Bell + User Profile */}
            <div className="hidden md:flex md:col-span-3 items-center justify-end gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                    setIsSearchDropdownOpen(false);
                  }}
                  className="w-11 h-11 rounded-full bg-white text-[#141416] hover:bg-neutral-100 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.05)] cursor-pointer relative transition-transform active:scale-95"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5 fill-[#141416]" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E61E2A] ring-2 ring-white" />
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white hover:bg-neutral-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] cursor-pointer transition-all"
                  title="Alex's Profile & Library"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Alex"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Shared Notifications & Profile Popovers */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-neutral-100 z-50 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-extrabold text-neutral-900">Notifications</span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => {
                      onSelectTrack(HERO_FEATURED_TRACK);
                      setIsPlaying(true);
                      setIsPlayerExpanded(true);
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-2xl bg-neutral-50 hover:bg-red-50/60 cursor-pointer transition-colors"
                  >
                    <p className="font-bold text-neutral-900">🔥 Lady Gaga dropped a new single</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">Tap to stream in lossless studio quality.</p>
                  </div>
                  <div
                    onClick={() => {
                      playHighlightItem(highlights[0]);
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-2xl bg-neutral-50 hover:bg-red-50/60 cursor-pointer transition-colors"
                  >
                    <p className="font-bold text-neutral-900">🎧 Starboy Deluxe Remastered</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">The Weeknd's top hits are trending today.</p>
                  </div>
                </div>
              </div>
            )}

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-neutral-100 z-50 space-y-1 animate-fadeIn">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="text-xs font-extrabold text-neutral-900">Alex Rivera</p>
                  <p className="text-[11px] text-neutral-500">{likedSongsList.length} Liked Songs</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('likes');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                >
                  <span>My Liked Songs</span>
                  <Heart className="w-3.5 h-3.5 text-[#E61E2A] fill-[#E61E2A]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('explore');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center justify-between cursor-pointer"
                >
                  <span>Explore Playlists</span>
                  <Compass className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>
            )}
          </header>

          {/* =================================================================== */}
          {/* VIEW A: HOME DASHBOARD                                              */}
          {/* =================================================================== */}
          {activeNav === 'home' && (
            <div className="space-y-7 animate-fadeIn">
              
              {/* TOP SPLIT: Left Crimson Hero Card + Right "Your Top Artists" */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* LEFT 7 COLS: Deep Crimson Hero Banner */}
                <div className="lg:col-span-7 flex">
                  <div
                    onClick={() => {
                      onSelectTrack(HERO_FEATURED_TRACK);
                      setIsPlaying(true);
                      setIsPlayerExpanded(true);
                    }}
                    className="relative w-full rounded-[28px] sm:rounded-[34px] bg-gradient-to-br from-[#4E070B] via-[#7A0C14] to-[#9E141E] text-white p-6 sm:p-8 min-h-[250px] sm:min-h-[280px] flex flex-col justify-between shadow-[0_22px_45px_rgba(122,12,20,0.32)] cursor-pointer group overflow-hidden"
                  >
                    <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-[#E61E2A]/35 blur-2xl pointer-events-none" />
                    <div className="absolute right-0 bottom-0 top-0 w-[48%] pointer-events-none overflow-hidden rounded-r-[34px]">
                      <img
                        src={heroCutoutUrl}
                        alt="Featured Artist"
                        className="w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-transform duration-500"
                        style={{
                          maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
                          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)'
                        }}
                      />
                    </div>

                    <div className="relative z-10 max-w-[62%] space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95">
                        <span>🔥 New Release</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold leading-[1.15] tracking-tight text-white">
                        Turn Up the Volume with Gaga
                      </h2>

                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-[260px]">
                        Step into her world of bold sound and fearless style.
                      </p>
                    </div>

                    <div className="relative z-10 pt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTrack(HERO_FEATURED_TRACK);
                          setIsPlaying(true);
                          setIsPlayerExpanded(true);
                        }}
                        className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-[#141416] font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-transform active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#141416] text-[#141416]" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT 5 COLS: "Your Top Artists" 2x3 Grid */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-500">
                      Your Top Artists
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveNav('artists')}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#141416] hover:text-[#E61E2A] transition-colors cursor-pointer"
                    >
                      <span>See More</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 my-auto">
                    {topArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => playArtistTopTrack(artist)}
                        className="group flex items-center justify-between p-2 rounded-2xl hover:bg-white/90 hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm">
                            <img
                              src={artist.avatar}
                              alt={artist.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-extrabold text-[#141416] group-hover:text-[#E61E2A] transition-colors truncate">
                              {artist.name}
                            </h4>
                            <p className="text-xs text-neutral-500 font-medium truncate">
                              {artist.listeners}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#E61E2A] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* MIDDLE SECTION: "Listening Highlights" 4 Large Rounded Album Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-500">
                    Listening Highlights
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveNav('explore')}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#141416] hover:text-[#E61E2A] transition-colors cursor-pointer"
                  >
                    <span>See More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {highlights.map((hl) => {
                    const isPlayingThis = currentTrack?.id === hl.id && isPlaying;
                    return (
                      <div
                        key={hl.id}
                        onClick={() => playHighlightItem(hl)}
                        className="group cursor-pointer space-y-2.5"
                      >
                        <div className="relative aspect-[1.08/1] w-full rounded-[24px] sm:rounded-[30px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.12)] bg-neutral-900">
                          <img
                            src={hl.coverUrl}
                            alt={hl.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3.5">
                            <div className="w-11 h-11 rounded-full bg-[#E61E2A] text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                              {isPlayingThis ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-1">
                          <h4 className="text-sm sm:text-base font-extrabold text-[#141416] group-hover:text-[#E61E2A] transition-colors truncate">
                            {hl.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-neutral-500 font-medium truncate">
                            {hl.artist}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW B: LIKED SONGS (HEART ICON IN LEFT SIDEBAR)                    */}
          {/* =================================================================== */}
          {activeNav === 'likes' && (
            <div className="space-y-5 animate-fadeIn flex-1">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E61E2A]/10 text-[#E61E2A] flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-[#E61E2A]" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#141416]">Liked Songs</h2>
                    <p className="text-xs text-neutral-500">{likedSongsList.length} saved tracks in your library</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('home')}
                  className="px-4 py-2 rounded-full bg-white text-xs font-bold text-neutral-700 hover:text-[#E61E2A] shadow-sm cursor-pointer"
                >
                  Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {likedSongsList.map((track) => {
                  const isCurr = currentTrack?.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        onSelectTrack(track);
                        setIsPlaying(true);
                        setIsPlayerExpanded(true);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border transition-all cursor-pointer ${
                        isCurr ? 'border-[#E61E2A] ring-2 ring-[#E61E2A]/15' : 'border-transparent hover:border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={track.artistPhoto}
                          alt={track.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-sm font-extrabold truncate ${isCurr ? 'text-[#E61E2A]' : 'text-[#141416]'}`}>
                            {track.title}
                          </h4>
                          <p className="text-xs text-neutral-500 truncate">{track.artist} · {track.album || 'Single'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(track, e)}
                          className="p-1.5 text-[#E61E2A] hover:scale-110 transition-transform cursor-pointer"
                          title="Unlike"
                        >
                          <Heart className="w-4 h-4 fill-[#E61E2A]" />
                        </button>
                        <span className="text-xs font-mono text-neutral-400">{track.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW C: EXPLORE & CURATED CATALOG (COMPASS ICON)                    */}
          {/* =================================================================== */}
          {activeNav === 'explore' && (
            <div className="space-y-5 animate-fadeIn flex-1">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#141416]">Explore Global Catalog</h2>
                  <p className="text-xs text-neutral-500">Curated studio masters & trending streams</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('home')}
                  className="px-4 py-2 rounded-full bg-white text-xs font-bold text-neutral-700 hover:text-[#E61E2A] shadow-sm cursor-pointer"
                >
                  Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                {allTracks.map((track) => {
                  const isCurr = currentTrack?.id === track.id;
                  const isLiked = !!likedTracks[track.id];
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        onSelectTrack(track);
                        setIsPlaying(true);
                        setIsPlayerExpanded(true);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl bg-white shadow-sm border transition-all cursor-pointer ${
                        isCurr ? 'border-[#E61E2A] ring-2 ring-[#E61E2A]/15' : 'border-transparent hover:border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={track.artistPhoto}
                          alt={track.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-xs sm:text-sm font-extrabold truncate ${isCurr ? 'text-[#E61E2A]' : 'text-[#141416]'}`}>
                            {track.title}
                          </h4>
                          <p className="text-[11px] text-neutral-500 truncate">{track.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(track, e)}
                          className="p-1 text-neutral-400 hover:text-[#E61E2A] cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#E61E2A] text-[#E61E2A]' : ''}`} />
                        </button>
                        <span className="text-[11px] font-mono text-neutral-400">{track.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW D: TOP ARTISTS DIRECTORY (USER ICON)                           */}
          {/* =================================================================== */}
          {(activeNav === 'artists' || activeNav === 'albums' || activeNav === 'settings') && (
            <div className="space-y-5 animate-fadeIn flex-1">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#141416]">
                    {activeNav === 'artists' ? 'Featured Artists' : activeNav === 'albums' ? 'Highlighted Albums' : 'Studio Audio Settings'}
                  </h2>
                  <p className="text-xs text-neutral-500">Click any artist or album to stream immediately</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('home')}
                  className="px-4 py-2 rounded-full bg-white text-xs font-bold text-neutral-700 hover:text-[#E61E2A] shadow-sm cursor-pointer"
                >
                  Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topArtists.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => playArtistTopTrack(art)}
                    className="p-4 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
                  >
                    <img
                      src={art.avatar}
                      alt={art.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-[#141416] group-hover:text-[#E61E2A] truncate">{art.name}</h4>
                      <p className="text-xs text-neutral-500">{art.listeners}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{art.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* BOTTOM SECTION: 50/50 SPLIT ARTWORK + LYRICS SHOWCASE & PILL PLAYER */}
          {/* =================================================================== */}
          <div className="relative z-30 pt-1 space-y-4">
            
            {/* SYMMETRICAL 50/50 SPLIT SHOWCASE CARD:
                - LEFT HALF: Large Framed Music Cover Art + Song Title, Artist & Album
                - RIGHT HALF: Clean, Pure Synchronized Lyrics (Zero clutter, no timestamps, predictive early bolding) */}
            {isPlayerExpanded && (
              <div className="relative w-full rounded-[30px] sm:rounded-[36px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.09)] border border-neutral-200/80 p-4 sm:p-6 md:p-7 transition-all animate-fadeIn">
                
                {/* Minimal Close Button in Top-Right Corner */}
                <button
                  type="button"
                  onClick={() => setIsPlayerExpanded(false)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-[#141416] flex items-center justify-center cursor-pointer transition-colors"
                  title="Close showcase"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 items-stretch">
                  
                  {/* LEFT HALF (6 Cols): Large Framed Cover Art Card with Song Title, Artist & Album */}
                  <div className="md:col-span-6 flex">
                    <div className="relative w-full h-[230px] sm:h-[260px] md:h-[280px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_14px_35px_rgba(0,0,0,0.18)] group bg-neutral-900 flex flex-col justify-end">
                      <img
                        src={displayTrack.artistPhoto}
                        alt={displayTrack.title}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Smooth bottom gradient scrim for crystal-clear title & album legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                      {/* Like Heart Badge on Cover Top-Left */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(displayTrack, e)}
                        className="absolute top-3.5 left-3.5 z-10 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer border border-white/20"
                        title="Like Song"
                      >
                        <Heart className={`w-4.5 h-4.5 ${isCurrentLiked ? 'fill-[#E61E2A] text-[#E61E2A]' : 'text-white'}`} />
                      </button>

                      {/* Song Name, Artist & Album inside the Left Framed Card */}
                      <div className="relative z-10 p-5 sm:p-6 space-y-1">
                        <h3 className="text-xl sm:text-2xl md:text-[26px] font-black text-white tracking-tight leading-tight truncate drop-shadow-sm">
                          {displayTrack.title}
                        </h3>
                        <p className="text-sm sm:text-base font-bold text-[#FF4D58] truncate">
                          {displayTrack.artist}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-white/80 truncate pt-0.5">
                          {displayTrack.album || 'Studio Master Album'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT HALF (6 Cols): Clean, Symmetrical Live-Synced Lyrics Stage (Zero extra header text, zero timestamps) */}
                  <div className="md:col-span-6 flex flex-col justify-center h-[230px] sm:h-[260px] md:h-[280px]">
                    {isLoadingLyrics ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 text-center px-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#E61E2A]" />
                        <p className="text-xs font-bold text-neutral-500 truncate max-w-full">
                          {displayTrack.title} · {displayTrack.artist}
                        </p>
                      </div>
                    ) : fullSyncedLines.length === 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                        <p className="text-base sm:text-lg font-extrabold text-[#141416] break-words" dir="auto">
                          {displayTrack.title}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-[#E61E2A]" dir="auto">
                          {displayTrack.artist}
                        </p>
                        <p className="text-xs text-neutral-400 font-medium pt-1">
                          Instrumental / No synced vocal lyrics found for this track
                        </p>
                      </div>
                    ) : (
                      <div
                        ref={lyricsContainerRef}
                        onScroll={handleUserLyricsScroll}
                        onWheel={handleUserLyricsScroll}
                        onTouchMove={handleUserLyricsScroll}
                        className="relative w-full h-full overflow-y-auto px-3 sm:px-5 py-10 space-y-4 sm:space-y-4.5 scroll-smooth scrollbar-thin select-text"
                        style={{
                          maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)'
                        }}
                      >
                        {fullSyncedLines.map((line, idx) => {
                          const distance = Math.abs(idx - activeLyricIndex);
                          const isCurrentLine = idx === activeLyricIndex;
                          const isNearLine = distance === 1;
                          const isSecondNearLine = distance === 2;

                          return (
                            <button
                              key={`${displayTrack.id}-${idx}-${line.time}`}
                              ref={(el) => {
                                lyricLineRefs.current[idx] = el;
                              }}
                              type="button"
                              dir="auto"
                              onClick={() => {
                                if (!currentTrack) {
                                  onSelectTrack(displayTrack);
                                  setIsPlaying(true);
                                }
                                const pct = (line.time / effectiveDuration) * 100;
                                handleSeek(pct);
                              }}
                              className={`w-full text-start transition-all duration-200 block cursor-pointer rounded-2xl px-3.5 py-2 ${
                                isCurrentLine
                                  ? 'text-[#E61E2A] font-black text-lg sm:text-xl md:text-[22px] leading-snug bg-red-50/80 scale-[1.01]'
                                  : isNearLine
                                  ? 'text-[#141416] font-bold text-base sm:text-[17px] leading-snug opacity-85 hover:opacity-100'
                                  : isSecondNearLine
                                  ? 'text-neutral-500 font-semibold text-sm sm:text-[15px] leading-snug opacity-55 hover:opacity-85'
                                  : 'text-neutral-400 font-medium text-sm leading-snug opacity-35 hover:opacity-70'
                              }`}
                            >
                              <span className="break-words block">{line.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* White Rounded Pill Player Bar (Symmetrical, Harmonious & Clean) */}
            <div className="w-full rounded-[26px] sm:rounded-full bg-white px-4 sm:px-6 py-3 sm:py-3.5 shadow-[0_12px_35px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 md:gap-5">
              
              {/* 1. Left + Transport */}
              <div className="flex items-center justify-between md:justify-start gap-3 sm:gap-5 min-w-0">
                <div
                  onClick={() => setIsPlayerExpanded(!isPlayerExpanded)}
                  className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial md:w-[210px] cursor-pointer group"
                  title="Click to toggle album & lyrics view"
                >
                  <img
                    src={displayTrack.artistPhoto}
                    alt={displayTrack.title}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 shadow-sm transition-transform duration-500 ${
                      isPlaying ? 'scale-105' : ''
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-[#141416] group-hover:text-[#E61E2A] transition-colors truncate">
                      {displayTrack.title}
                    </h4>
                    <p className="text-xs text-neutral-500 font-semibold truncate">
                      {displayTrack.artist}
                    </p>
                  </div>
                </div>

                {/* Transport Controls: Prev | Pause/Play | Next */}
                <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={onPrevTrack}
                    className="text-[#141416] hover:text-[#E61E2A] transition-colors cursor-pointer active:scale-90 p-1"
                    title="Previous"
                  >
                    <SkipBack className="w-4.5 h-4.5 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!currentTrack) {
                        onSelectTrack(displayTrack);
                        setIsPlaying(true);
                        setIsPlayerExpanded(true);
                      } else {
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#141416] hover:bg-[#E61E2A] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onNextTrack}
                    className="text-[#141416] hover:text-[#E61E2A] transition-colors cursor-pointer active:scale-90 p-1"
                    title="Next"
                  >
                    <SkipForward className="w-4.5 h-4.5 fill-current" />
                  </button>
                </div>
              </div>

              {/* 2. Center Red Progress Bar with Elapsed & Total Time */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs font-bold text-neutral-500 tabular-nums w-9 text-right shrink-0">
                  {currentTrack ? formatTime(currentTrackSeconds) : '1:25'}
                </span>

                <div
                  onPointerDown={handlePointerDownScrubber}
                  onPointerMove={handlePointerMoveScrubber}
                  onPointerUp={handlePointerUpScrubber}
                  onPointerCancel={handlePointerUpScrubber}
                  className="flex-1 py-2 cursor-pointer group/bar select-none touch-none"
                >
                  <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden relative">
                    <div
                      className="h-full bg-[#E61E2A] rounded-full transition-all duration-100"
                      style={{ width: `${currentTrack ? Math.min(100, Math.max(0, trackProgress)) : 45}%` }}
                    />
                  </div>
                </div>

                <span className="text-xs font-bold text-neutral-500 tabular-nums w-9 shrink-0">
                  {currentTrack ? formatTime(audioDuration || currentTrack.durationSeconds || 192) : '3:12'}
                </span>
              </div>

              {/* 3. Right: Volume Bar + Red Heart + Repeat + Shuffle */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-neutral-100">
                {/* Speaker + Short Red Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVolumeLevel(v => (v > 0 ? 0 : 80))}
                    className="text-[#141416] hover:text-[#E61E2A] cursor-pointer"
                    title="Mute / Unmute"
                  >
                    {volumeLevel === 0 ? (
                      <VolumeX className="w-4.5 h-4.5 text-neutral-400" />
                    ) : (
                      <Volume2 className="w-4.5 h-4.5 fill-[#141416]" />
                    )}
                  </button>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
                      setVolumeLevel(pct);
                    }}
                    className="w-16 h-2 rounded-full bg-neutral-200 overflow-hidden cursor-pointer relative"
                    title={`Volume: ${volumeLevel}%`}
                  >
                    <div
                      className="h-full bg-[#E61E2A] rounded-full"
                      style={{ width: `${volumeLevel}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(displayTrack, e)}
                    className="text-[#E61E2A] hover:scale-110 transition-transform cursor-pointer"
                    title="Like Song"
                  >
                    <Heart className={`w-4.5 h-4.5 ${isCurrentLiked ? 'fill-[#E61E2A] text-[#E61E2A]' : 'text-neutral-400'}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`transition-colors cursor-pointer ${
                      isRepeat ? 'text-[#E61E2A]' : 'text-neutral-600 hover:text-[#141416]'
                    }`}
                    title="Repeat"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`transition-colors cursor-pointer ${
                      isShuffle ? 'text-[#E61E2A]' : 'text-neutral-600 hover:text-[#141416]'
                    }`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
