import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import { 
  ArrowLeft, Search, Bookmark, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  Plus, Check, Film, Loader2, Subtitles, SlidersHorizontal,
  Flame, SkipBack, SkipForward, Tv, Clapperboard, CheckCircle2,
  Clock
} from 'lucide-react';
import { Movie, Actor, MovieReview } from '../data/auraStore';
import { 
  MediaCatalogItem, 
  PlayableStreamManifest, 
  ParsedSubtitleCue, 
  StreamQualityLevel, 
  EpisodeMetadata 
} from '../types/streaming';
import { searchAggregator, CURATED_FEATURED_CINEMA } from '../services/SearchAggregatorService';
import { streamResolver } from '../services/StreamResolverService';
import { subtitleSyncService } from '../services/SubtitleSyncService';

interface MovieStreamingViewProps {
  handleTravel: (world: any) => void;
  currentMovie: Movie;
  setCurrentMovie: (movie: Movie) => void;
  actorsList?: Actor[];
  toggleFollowActor?: (actorId: string, actorName: string, e?: React.MouseEvent) => void;
  watchlistIds: Record<string, boolean>;
  toggleWatchlist: (movieId: string, e?: React.MouseEvent) => void;
  movieSearch: string;
  setMovieSearch: (search: string) => void;
  movieFilterCategory: string;
  setMovieFilterCategory: (category: string) => void;
  activeMovieMenuModal?: 'settings' | 'account' | 'notifications' | 'help' | null;
  setActiveMovieMenuModal?: (modal: 'settings' | 'account' | 'notifications' | 'help' | null) => void;
  activeMenuSelection?: string;
  setActiveMenuSelection?: (sel: string) => void;
  isMovieVideoPlaying: boolean;
  setIsMovieVideoPlaying: (playing: boolean) => void;
  moviePlaySeconds: number;
  setMoviePlaySeconds: (sec: number | ((prev: number) => number)) => void;
  isMovieMuted: boolean;
  setIsMovieMuted: (muted: boolean) => void;
  isMovieFullscreen: boolean;
  setIsMovieFullscreen: (fs: boolean) => void;
  likedReviewIds?: Record<string, boolean>;
  toggleLikeReview?: (reviewId: string) => void;
  bookmarkedReviewIds?: Record<string, boolean>;
  toggleBookmarkReview?: (reviewId: string) => void;
  movieToast?: string | null;
  showMovieToast: (msg: string) => void;
  newReviewText?: string;
  setNewReviewText?: (text: string) => void;
  handleAddReview?: (e: React.FormEvent) => void;
  movieReviewsMap?: Record<string, MovieReview[]>;
  formatMovieTime: (seconds: number) => string;
}

export function MovieStreamingView({
  handleTravel,
  currentMovie,
  setCurrentMovie,
  watchlistIds,
  toggleWatchlist,
  movieSearch,
  setMovieSearch,
  movieFilterCategory,
  setMovieFilterCategory,
  isMovieVideoPlaying,
  setIsMovieVideoPlaying,
  moviePlaySeconds,
  setMoviePlaySeconds,
  isMovieMuted,
  setIsMovieMuted,
  isMovieFullscreen,
  setIsMovieFullscreen,
  showMovieToast,
  formatMovieTime
}: MovieStreamingViewProps) {

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  // Search & Catalog State
  const [catalogResults, setCatalogResults] = useState<MediaCatalogItem[]>(CURATED_FEATURED_CINEMA);
  const [activeMediaItem, setActiveMediaItem] = useState<MediaCatalogItem>(CURATED_FEATURED_CINEMA[0]);
  const [isSearchingCatalog, setIsSearchingCatalog] = useState<boolean>(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);

  // Active Stream Manifest
  const [activeManifest, setActiveManifest] = useState<PlayableStreamManifest | null>(null);
  const [hasStreamStarted, setHasStreamStarted] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(7320);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [videoVolume, setVideoVolume] = useState<number>(85);
  const [needsGestureUnmute, setNeedsGestureUnmute] = useState<boolean>(false);

  // Scrubber hover state
  const [scrubHoverTime, setScrubHoverTime] = useState<number | null>(null);
  const [scrubHoverX, setScrubHoverX] = useState<number | null>(null);

  // Controls Visibility & Autohide State (2.5 seconds inactivity fade)
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const hideControlsTimerRef = useRef<number | null>(null);

  // Subtitle Synchronization State & Popup Menu
  const [activeSubtitleLang, setActiveSubtitleLang] = useState<'fa' | 'en' | 'off'>('off');
  const [showSubtitleMenu, setShowSubtitleMenu] = useState<boolean>(false);
  const [parsedCues, setParsedCues] = useState<ParsedSubtitleCue[]>([]);
  const [activeCue, setActiveCue] = useState<ParsedSubtitleCue | null>(null);
  const [subtitleOffsetSeconds, setSubtitleOffsetSeconds] = useState<number>(0);

  // Quality Profiles & Popup Menu
  const [availableQualities, setAvailableQualities] = useState<StreamQualityLevel[]>([]);
  const [currentQualityIndex, setCurrentQualityIndex] = useState<number>(-1);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);

  // TV Shows: Seasons & Episodes
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeMetadata | null>(null);

  // Autohide controller
  const handleUserActivity = useCallback(() => {
    setIsControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (isMovieVideoPlaying) {
      hideControlsTimerRef.current = window.setTimeout(() => {
        setIsControlsVisible(false);
        setShowSubtitleMenu(false);
        setShowQualityMenu(false);
      }, 2500);
    }
  }, [isMovieVideoPlaying]);

  useEffect(() => {
    if (!isMovieVideoPlaying) {
      setIsControlsVisible(true);
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    } else {
      handleUserActivity();
    }
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isMovieVideoPlaying, handleUserActivity]);

  // Real-time Canvas Ambilight Glow
  const updateAmbientGlow = useCallback(() => {
    const video = videoRef.current;
    const canvas = ambientCanvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (ctx && video.readyState >= 2) {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch {
        // Safe catch
      }
    }
  }, []);

  // Frame presentation synchronization loop for HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let callbackId: number;
    let animFrameId: number;

    const onFrame = () => {
      updateAmbientGlow();
      const curr = video.currentTime;
      setMoviePlaySeconds(curr);

      if (parsedCues.length > 0) {
        const found = subtitleSyncService.getActiveCue(parsedCues, curr + subtitleOffsetSeconds);
        setActiveCue(found);
      } else {
        setActiveCue(null);
      }

      if (video.buffered.length > 0) {
        try {
          const maxBuffered = video.buffered.end(video.buffered.length - 1);
          setBufferedEnd(maxBuffered);
        } catch {
          // Safe catch
        }
      }

      if ('requestVideoFrameCallback' in video) {
        callbackId = (video as any).requestVideoFrameCallback(onFrame);
      } else {
        animFrameId = requestAnimationFrame(onFrame);
      }
    };

    if ('requestVideoFrameCallback' in video) {
      callbackId = (video as any).requestVideoFrameCallback(onFrame);
    } else {
      animFrameId = requestAnimationFrame(onFrame);
    }

    return () => {
      if ('cancelVideoFrameCallback' in video && callbackId) {
        (video as any).cancelVideoFrameCallback(callbackId);
      }
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, [parsedCues, setMoviePlaySeconds, updateAmbientGlow, subtitleOffsetSeconds]);

  // Search Aggregation Pipeline
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setIsSearchingCatalog(true);
      const results = await searchAggregator.searchCatalog(movieSearch, movieFilterCategory);
      if (isMounted) {
        setCatalogResults(results);
        setIsSearchingCatalog(false);
      }
    };

    const timer = setTimeout(fetchCatalog, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [movieSearch, movieFilterCategory]);

  // Load Subtitle track when activeSubtitleLang changes or title/media changes
  useEffect(() => {
    if (activeSubtitleLang === 'off') {
      setParsedCues([]);
      setActiveCue(null);
      return;
    }

    let isSubscribed = true;
    const cleanImdb = activeMediaItem.id.startsWith('tt') ? activeMediaItem.id : activeMediaItem.imdbId;

    subtitleSyncService.getSubtitlesForTitle(
      activeMediaItem.title,
      activeSubtitleLang,
      cleanImdb,
      selectedSeason,
      currentEpisode?.episodeNumber
    ).then(cues => {
      if (isSubscribed) {
        setParsedCues(cues);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [activeSubtitleLang, activeMediaItem.title, activeMediaItem.imdbId, activeMediaItem.id, selectedSeason, currentEpisode?.episodeNumber]);

  // Stream Resolver & HLS.js Mount Engine
  const mountAndPlayManifest = useCallback((manifest: PlayableStreamManifest, targetDuration?: number) => {
    setActiveManifest(manifest);
    setHasStreamStarted(true);
    setIsMovieVideoPlaying(true);
    setAvailableQualities(manifest.qualities || []);

    const effectiveDur = targetDuration || manifest.durationSeconds || 7200;
    setVideoDuration(effectiveDur);

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const fallbackMp4Url = 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4';

    if (manifest.protocol === 'hls' && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;
      hls.loadSource(manifest.sourceUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const mappedQualities: StreamQualityLevel[] = data.levels.map((lvl, idx) => ({
          height: lvl.height,
          bitrate: lvl.bitrate,
          label: `${lvl.height}p`,
          index: idx,
        }));
        setAvailableQualities(mappedQualities);
        triggerPlay(video);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('HLS error, switching to direct MP4 stream:', data);
          hls.destroy();
          hlsRef.current = null;
          video.src = fallbackMp4Url;
          video.load();
          triggerPlay(video);
        }
      });
    } else {
      video.src = manifest.sourceUrl || fallbackMp4Url;
      video.load();
      triggerPlay(video);
    }

    function triggerPlay(v: HTMLVideoElement) {
      v.play().then(() => {
        setIsMovieVideoPlaying(true);
        setNeedsGestureUnmute(false);
      }).catch(() => {
        v.muted = true;
        setIsMovieMuted(true);
        setNeedsGestureUnmute(true);
        v.play().then(() => setIsMovieVideoPlaying(true)).catch(() => {});
      });
    }
  }, [setIsMovieMuted, setIsMovieVideoPlaying]);

  // Select and stream a movie or TV show
  const selectAndPlayMedia = async (item: MediaCatalogItem) => {
    setActiveMediaItem(item);
    setIsSearchDropdownOpen(false);

    setCurrentMovie({
      id: item.id,
      title: item.title,
      genre: item.genres.join(' / '),
      genres: item.genres,
      year: String(item.releaseYear),
      duration: item.runtimeFormatted || item.duration || '02:00:00',
      rating: String(item.rating),
      score: String(item.rating),
      director: item.directors[0] || 'Studio Director',
      posterUrl: item.posterUrl,
      backdropUrl: item.backdropUrl,
      description: item.overview
    } as any);

    showMovieToast(`Playing: ${item.title}`);
    videoContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 1. Resolve authentic direct stream manifest and mount in HTML5 video
    const manifest = await streamResolver.resolveStreamManifest(item);
    mountAndPlayManifest(manifest, item.runtimeSeconds);

    // 2. Fetch deep details and episodes hierarchy asynchronously
    searchAggregator.resolveMediaDetails(item).then(detailed => {
      setActiveMediaItem(detailed);
      if (detailed.seasons && detailed.seasons.length > 0) {
        setSelectedSeason(detailed.seasons[0].seasonNumber);
        if (detailed.seasons[0].episodes.length > 0) {
          setCurrentEpisode(detailed.seasons[0].episodes[0]);
        }
      } else {
        setCurrentEpisode(null);
      }
    });
  };

  // Select and stream an episode
  const selectAndPlayEpisode = async (episode: EpisodeMetadata) => {
    setCurrentEpisode(episode);
    showMovieToast(`Streaming S${episode.seasonNumber}·E${episode.episodeNumber}: ${episode.title}`);
    videoContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const episodeManifest = await streamResolver.resolveEpisodeStream(activeMediaItem, episode);
    mountAndPlayManifest(episodeManifest, (episode.runtimeMinutes || 45) * 60);
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!hasStreamStarted) {
      selectAndPlayMedia(activeMediaItem);
      return;
    }

    const nextState = !isMovieVideoPlaying;
    setIsMovieVideoPlaying(nextState);

    const video = videoRef.current;
    if (video) {
      if (nextState) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    showMovieToast(nextState ? 'Playback Resumed' : 'Playback Paused');
  };

  // Previous video logic
  const handlePrevVideo = () => {
    if (moviePlaySeconds > 5) {
      handleSeek(0);
      return;
    }
    if (activeMediaItem.seasons && currentEpisode) {
      const allEps = activeMediaItem.seasons.flatMap(s => s.episodes);
      const currIdx = allEps.findIndex(e => e.id === currentEpisode.id);
      if (currIdx > 0) {
        selectAndPlayEpisode(allEps[currIdx - 1]);
        return;
      }
    }
    if (catalogResults.length > 0) {
      const idx = catalogResults.findIndex(m => m.id === activeMediaItem.id);
      const prevIdx = (idx - 1 + catalogResults.length) % catalogResults.length;
      selectAndPlayMedia(catalogResults[prevIdx]);
    } else {
      handleSeek(0);
    }
  };

  // Next video logic
  const handleNextVideo = () => {
    if (activeMediaItem.seasons && currentEpisode) {
      const allEps = activeMediaItem.seasons.flatMap(s => s.episodes);
      const currIdx = allEps.findIndex(e => e.id === currentEpisode.id);
      if (currIdx < allEps.length - 1) {
        selectAndPlayEpisode(allEps[currIdx + 1]);
        return;
      }
    }
    if (catalogResults.length > 0) {
      const idx = catalogResults.findIndex(m => m.id === activeMediaItem.id);
      const nextIdx = (idx + 1) % catalogResults.length;
      selectAndPlayMedia(catalogResults[nextIdx]);
    } else {
      showMovieToast('End of Catalog');
    }
  };

  // Timeline scrubber seek
  const handleSeek = (newSeconds: number) => {
    setMoviePlaySeconds(newSeconds);
    if (videoRef.current) {
      videoRef.current.currentTime = newSeconds;
    }
  };

  // Scrubber interactive track click & drag
  const handleScrubberRailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.floor(ratio * (videoDuration || 1));
    handleSeek(targetSeconds);
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, moveX / rect.width));
    const targetSeconds = Math.floor(ratio * (videoDuration || 1));
    setScrubHoverX(moveX);
    setScrubHoverTime(targetSeconds);
  };

  const handleScrubberMouseLeave = () => {
    setScrubHoverX(null);
    setScrubHoverTime(null);
  };

  // Quality switch handler (Real Resolution Switch)
  const handleQualityChange = (index: number) => {
    setCurrentQualityIndex(index);
    setShowQualityMenu(false);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
    }
    const q = availableQualities.find(q => q.index === index);
    const qLabel = index === -1 ? 'Auto (Adaptive)' : q?.label || 'HD';
    showMovieToast(`Quality: ${qLabel}`);
  };

  // Subtitle switch handler
  const handleSubtitleChange = (lang: 'fa' | 'en' | 'off') => {
    setActiveSubtitleLang(lang);
    setShowSubtitleMenu(false);
    if (lang === 'fa') {
      showMovieToast('زیرنویس فارسی فعال شد');
    } else if (lang === 'en') {
      showMovieToast('English Subtitles Active');
    } else {
      showMovieToast('Subtitles: Off');
    }
  };

  // Audio unmute gesture
  const handleUnmuteGesture = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setIsMovieMuted(false);
    setNeedsGestureUnmute(false);
    showMovieToast('Audio Unmuted');
  };

  // Toggle native fullscreen
  const toggleNativeFullscreen = () => {
    const container = videoContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsMovieFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsMovieFullscreen(false)).catch(() => {});
    }
  };

  // Sync volume & mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMovieMuted;
      videoRef.current.volume = isMovieMuted ? 0 : videoVolume / 100;
    }
  }, [isMovieMuted, videoVolume]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsMovieFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsMovieFullscreen]);

  // Filter episodes for selected season
  const currentSeasonEpisodes = useMemo(() => {
    if (!activeMediaItem.seasons) return [];
    const found = activeMediaItem.seasons.find(s => s.seasonNumber === selectedSeason);
    return found ? found.episodes : [];
  }, [activeMediaItem.seasons, selectedSeason]);

  // Progress metrics (0% to 100%)
  const playedPercent = Math.min(100, Math.max(0, (moviePlaySeconds / (videoDuration || 1)) * 100));
  const bufferedPercent = Math.min(100, Math.max(0, (bufferedEnd / (videoDuration || 1)) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 animate-fadeIn py-2 pb-44 px-2 sm:px-4 font-sans relative select-none">

      {/* ========================================================================= */}
      {/* GLOBAL FULLSCREEN BACKDROP FOR SEARCH DROPDOWN - BLURS & DIMS BACKGROUND */}
      {/* ========================================================================= */}
      {isSearchDropdownOpen && movieSearch.trim().length > 0 && (
        <div 
          className="fixed inset-0 z-[9980] cursor-default bg-black/65 backdrop-blur-[3px] animate-fadeIn" 
          onClick={() => setIsSearchDropdownOpen(false)} 
        />
      )}

      {/* ========================================================================= */}
      {/* 1. TOP CINEMA NAVIGATION: FULL-WIDTH SEARCH BAR EXTENDING TO "ALL" BUTTON */}
      {/* ========================================================================= */}
      <div className={`sticky top-16 ${isSearchDropdownOpen && movieSearch.trim().length > 0 ? 'z-[9990]' : 'z-40'} p-2.5 sm:p-3.5 rounded-3xl sm:rounded-[32px] bg-slate-950/95 border border-purple-500/35 backdrop-blur-3xl shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3`}>
        
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
          {/* Back to Home Portal */}
          <button 
            onClick={() => handleTravel('portal')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-white/5 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-rose-600/30 text-purple-200 border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shrink-0 active:scale-95"
            title="Return to Home Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">Home</span>
          </button>

          {/* Full-width Search Input extending seamlessly to category pills */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80 pointer-events-none" />
            <input 
              type="text"
              value={movieSearch}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onChange={(e) => {
                setMovieSearch(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              placeholder="Search movies, TV series, trailers..."
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] focus:bg-slate-900 border border-white/15 focus:border-purple-400 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.08)] focus:shadow-[0_0_24px_rgba(168,85,247,0.4)]"
            />
            {movieSearch && (
              <button 
                onClick={() => {
                  setMovieSearch('');
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded-full bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Floating Dropdown Results Panel - Ranked with Elegant Movie/Series Badges & Duration in Front */}
            {isSearchDropdownOpen && movieSearch.trim().length > 0 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2.5 left-0 right-0 z-[9995] bg-slate-950/98 border border-purple-500/60 rounded-3xl p-3 sm:p-4 shadow-[0_30px_80px_rgba(0,0,0,0.98),_0_0_35px_rgba(168,85,247,0.3)] backdrop-blur-3xl space-y-2 animate-fadeIn max-h-96 overflow-hidden flex flex-col"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 px-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <Film className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-white truncate">
                      Search Results for "{movieSearch}"
                    </span>
                  </div>
                  {isSearchingCatalog ? (
                    <span className="text-[10px] font-mono text-purple-300 flex items-center gap-1.5 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-400/30 shrink-0">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                      Searching...
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {catalogResults.length} found
                    </span>
                  )}
                </div>

                {/* Vertical Ranked List with Chic Badges and Exact Duration in Front */}
                <div className="space-y-1.5 overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {catalogResults.map((m, idx) => {
                    const isSeries = m.type === 'series';

                    return (
                      <div
                        key={m.id || idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAndPlayMedia(m);
                        }}
                        className={`flex items-center justify-between p-2 sm:p-2.5 rounded-2xl transition-all cursor-pointer group border ${
                          activeMediaItem.id === m.id 
                            ? 'bg-purple-600/25 border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.35)]' 
                            : 'bg-white/[0.03] hover:bg-purple-500/15 border-white/5 hover:border-purple-400/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="relative w-11 h-15 rounded-xl overflow-hidden shrink-0 shadow border border-white/10 bg-slate-900">
                            <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                                {m.title}
                              </h4>
                              
                              {/* Chic, Minimalist Badge: Movie / Series */}
                              <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wider shrink-0 border ${
                                isSeries 
                                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/40' 
                                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                              }`}>
                                {isSeries ? 'Series' : 'Movie'}
                              </span>

                              {/* Exact Duration in Front with Clock Icon */}
                              <span className="text-[10.5px] font-mono font-bold text-purple-200/90 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                                <Clock className="w-3 h-3 text-purple-400" />
                                <span>{m.runtimeFormatted || m.duration || 'Feature'}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10.5px] text-slate-400 truncate mt-1">
                              <span>{m.releaseYear || '2024'}</span>
                              <span>·</span>
                              <span>{m.genres?.slice(0, 2).join(' · ') || 'Cinema'}</span>
                              <span>·</span>
                              <span className="text-amber-300 font-mono">★ {m.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 transition-all shadow-md bg-gradient-to-tr from-purple-600 to-rose-600 group-hover:scale-110 text-white">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'movie', label: 'Movies' },
            { id: 'series', label: 'Series' },
            { id: 'animation', label: 'Anime' },
            { id: 'watchlist', label: 'Watchlist', icon: Bookmark }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMovieFilterCategory(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                movieFilterCategory === tab.id
                  ? 'bg-gradient-to-r from-purple-600 via-rose-600 to-pink-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)] border border-white/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {tab.icon && <tab.icon className="w-3 h-3 text-rose-400" />}
              <span>{tab.label}</span>
              {tab.id === 'watchlist' && Object.values(watchlistIds).filter(Boolean).length > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {Object.values(watchlistIds).filter(Boolean).length}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. GRAND 3D OLED MASTER THEATER DISPLAY (SEAMLESS FULLSCREEN & AUTOHIDE)  */}
      {/* ========================================================================= */}
      <div 
        ref={videoContainerRef}
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
        className={`relative w-full mx-auto transition-all ${
          isMovieFullscreen 
            ? `fixed inset-0 z-[10000] w-screen h-screen bg-black overflow-hidden flex items-center justify-center p-0 rounded-none border-none shadow-none ${!isControlsVisible && isMovieVideoPlaying ? 'cursor-none' : 'cursor-default'}` 
            : 'rounded-3xl sm:rounded-[44px] p-2 sm:p-4 bg-gradient-to-b from-neutral-900 via-slate-950 to-neutral-950 border-2 border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.98),_0_0_50px_rgba(168,85,247,0.2)]'
        }`}
        style={{ perspective: isMovieFullscreen ? 'none' : '1200px' }}
      >
        {/* Dynamic Canvas Ambilight Glow behind the TV frame */}
        {!isMovieFullscreen && (
          <canvas
            ref={ambientCanvasRef}
            width={16}
            height={9}
            className="absolute -inset-2 -z-10 w-full h-full rounded-[50px] pointer-events-none transform scale-105 blur-3xl opacity-75 transition-opacity duration-500"
          />
        )}

        {/* Video Viewport: Native HTML5 Video Player */}
        <div className={`relative overflow-hidden bg-black transition-all ${
          isMovieFullscreen 
            ? 'w-full h-full flex items-center justify-center' 
            : 'w-full aspect-video rounded-2xl sm:rounded-3xl ring-1 ring-white/15 shadow-[inset_0_4px_24px_rgba(0,0,0,0.98)]'
        }`}>
          
          {/* TV Screen Glass Sheen Glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/30 pointer-events-none z-10" />

          {/* Native HTML5 Video Element with HLS.js streaming engine */}
          <video 
            ref={videoRef}
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            onPlay={() => setIsMovieVideoPlaying(true)}
            onPause={() => setIsMovieVideoPlaying(false)}
            onDurationChange={() => {
              if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
                setVideoDuration(videoRef.current.duration);
              }
            }}
            onEnded={() => {
              setIsMovieVideoPlaying(false);
              showMovieToast('Advancing to next video...');
              handleNextVideo();
            }}
            className={`w-full h-full ${isMovieFullscreen ? 'object-contain' : 'object-cover'} object-center bg-black`}
          />

          {/* Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Standby Display Overlay when stream has not started */}
          {!hasStreamStarted && (
            <div 
              onClick={togglePlayPause}
              className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-slate-900/95 to-black text-center p-4 sm:p-6 cursor-pointer group z-20"
            >
              <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-purple-600 via-rose-600 to-pink-500 text-white flex items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.85)] group-hover:scale-108 active:scale-95 transition-all border border-white/25 mb-3">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-wider uppercase mb-1">
                Ready to Stream
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-md px-2">
                Click to stream {activeMediaItem.title}
              </p>
            </div>
          )}

          {/* Gesture Unmute Button */}
          {hasStreamStarted && needsGestureUnmute && (
            <button
              onClick={handleUnmuteGesture}
              className="absolute top-4 left-4 z-30 px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all cursor-pointer animate-pulse"
            >
              Sound Muted (Tap to Unmute)
            </button>
          )}

          {/* Real-time Subtitle Cue (Clean Persian RTL & English Typography) */}
          {hasStreamStarted && activeCue && activeSubtitleLang !== 'off' && (
            <div 
              className="absolute bottom-20 sm:bottom-24 left-0 right-0 z-30 flex justify-center pointer-events-none px-4 animate-fadeIn"
              style={{
                direction: activeSubtitleLang === 'fa' ? 'rtl' : 'ltr',
                unicodeBidi: 'isolate'
              }}
            >
              <span 
                className="text-white text-xs sm:text-base font-semibold px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl text-center max-w-2xl leading-relaxed"
                style={{
                  fontFamily: activeSubtitleLang === 'fa' ? 'Vazirmatn, Tahoma, sans-serif' : 'system-ui, sans-serif',
                  textShadow: '0px 2px 4px rgba(0,0,0,0.95), 0px 0px 8px rgba(0,0,0,0.8)'
                }}
              >
                {activeCue.text}
              </span>
            </div>
          )}

          {/* Bottom Screen Hover Sensor for instant reveal */}
          <div 
            onMouseEnter={() => setIsControlsVisible(true)}
            onTouchStart={() => setIsControlsVisible(true)}
            className="absolute bottom-0 left-0 right-0 h-28 pointer-events-auto z-25"
          />

          {/* ========================================================================= */}
          {/* FLOATING CONTROLS HUD (WORKS SEAMLESSLY BOTH IN NORMAL AND FULLSCREEN)    */}
          {/* ========================================================================= */}
          <div className={`absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 w-[95%] sm:w-[92%] max-w-4xl z-30 flex flex-col gap-2.5 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-950/90 sm:bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] transition-all duration-500 ease-in-out ${
            isMovieVideoPlaying && !isControlsVisible 
              ? 'opacity-0 translate-y-8 pointer-events-none' 
              : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}>
            
            {/* Precise Timeline Scrubber Rail */}
            <div className="flex items-center gap-2.5 w-full">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-purple-300 min-w-[50px] text-right shrink-0">
                {formatMovieTime(moviePlaySeconds)}
              </span>

              <div 
                ref={railRef}
                onClick={handleScrubberRailClick}
                onMouseMove={handleScrubberMouseMove}
                onMouseLeave={handleScrubberMouseLeave}
                className="relative flex-1 flex items-center h-5 cursor-pointer group/rail"
              >
                {/* Floating Tooltip */}
                {scrubHoverTime !== null && scrubHoverX !== null && (
                  <div 
                    className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/95 border border-purple-500/50 text-[10px] font-mono font-bold text-purple-200 pointer-events-none shadow-lg z-40"
                    style={{ left: `${scrubHoverX}px` }}
                  >
                    {formatMovieTime(scrubHoverTime)}
                  </div>
                )}

                {/* Base Track */}
                <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/15 relative overflow-hidden backdrop-blur-sm">
                  {/* Buffer Progress */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-white/30 rounded-full transition-all duration-300 pointer-events-none"
                    style={{ width: `${bufferedPercent}%` }}
                  />
                  {/* Played Progress */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500 rounded-full pointer-events-none shadow-[0_0_12px_rgba(225,29,72,0.8)]"
                    style={{ width: `${playedPercent}%` }}
                  />
                </div>

                {/* Glowing Thumb Handle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9),_0_0_20px_rgba(225,29,72,0.8)] border-2 border-rose-500 pointer-events-none transition-transform group-hover/rail:scale-125"
                  style={{ left: `${playedPercent}%` }}
                />
              </div>

              <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-400 min-w-[50px] shrink-0">
                {formatMovieTime(videoDuration)}
              </span>
            </div>

            {/* Responsive Transport Controls */}
            <div className="flex items-center justify-between w-full gap-2 pt-0.5">
              
              {/* Left: Volume & Mute */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => setIsMovieMuted(!isMovieMuted)}
                  className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer border border-white/10"
                  title={isMovieMuted ? "Unmute" : "Mute"}
                >
                  {isMovieMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={isMovieMuted ? 0 : videoVolume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVideoVolume(val);
                    if (isMovieMuted) setIsMovieMuted(false);
                    if (videoRef.current) {
                      videoRef.current.volume = val / 100;
                    }
                  }}
                  className="w-12 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500 hidden xs:inline"
                />
              </div>

              {/* Center: Core Playback Actions */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <button 
                  onClick={handlePrevVideo}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-rose-600/30 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-95"
                  title="Previous"
                >
                  <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </button>

                <button 
                  onClick={togglePlayPause}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-600 via-rose-600 to-pink-500 hover:from-purple-500 hover:to-rose-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.7)] active:scale-95 border border-white/25"
                  title={isMovieVideoPlaying ? "Pause" : "Play"}
                >
                  {isMovieVideoPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />}
                </button>

                <button 
                  onClick={handleNextVideo}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-rose-600/30 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 active:scale-95"
                  title="Next"
                >
                  <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </button>
              </div>

              {/* Right: Subtitle, Quality & Fullscreen */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                
                {/* Subtitles Button & Popup Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSubtitleMenu(!showSubtitleMenu);
                      setShowQualityMenu(false);
                    }}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
                      activeSubtitleLang !== 'off' 
                        ? 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]' 
                        : 'bg-white/10 text-slate-300 border-white/10 hover:text-white'
                    }`}
                    title="Subtitles Menu"
                  >
                    <Subtitles className="w-3 h-3 text-rose-400" />
                    <span>
                      {activeSubtitleLang === 'fa' ? 'فارسی' : activeSubtitleLang === 'en' ? 'EN' : 'CC'}
                    </span>
                  </button>

                  {/* Subtitle Selection Popup */}
                  {showSubtitleMenu && (
                    <div className="absolute bottom-full mb-2 right-0 z-50 bg-slate-950/98 border border-rose-500/50 rounded-2xl p-2 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl w-44 space-y-1.5 animate-fadeIn">
                      <div className="text-[10px] font-bold text-slate-400 px-1 border-b border-white/10 pb-1">
                        انتخاب زیرنویس
                      </div>

                      <button
                        onClick={() => handleSubtitleChange('off')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          activeSubtitleLang === 'off' 
                            ? 'bg-rose-600/30 text-rose-300 font-bold border border-rose-400/30' 
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>خاموش (Off)</span>
                        {activeSubtitleLang === 'off' && <CheckCircle2 className="w-3 h-3 text-rose-400" />}
                      </button>

                      <button
                        onClick={() => handleSubtitleChange('fa')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          activeSubtitleLang === 'fa' 
                            ? 'bg-rose-600/30 text-rose-300 font-bold border border-rose-400/30' 
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">فارسی (Persian)</span>
                        {activeSubtitleLang === 'fa' && <CheckCircle2 className="w-3 h-3 text-rose-400" />}
                      </button>

                      <button
                        onClick={() => handleSubtitleChange('en')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          activeSubtitleLang === 'en' 
                            ? 'bg-rose-600/30 text-rose-300 font-bold border border-rose-400/30' 
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>English (EN)</span>
                        {activeSubtitleLang === 'en' && <CheckCircle2 className="w-3 h-3 text-rose-400" />}
                      </button>

                      {/* Subtitle Fine-Tune Sync Offset Adjuster */}
                      {activeSubtitleLang !== 'off' && (
                        <div className="pt-1.5 border-t border-white/10 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                            <span>تنظیم زمان سینک</span>
                            <span className="font-mono text-rose-300">{subtitleOffsetSeconds > 0 ? `+${subtitleOffsetSeconds}s` : `${subtitleOffsetSeconds}s`}</span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <button
                              onClick={() => setSubtitleOffsetSeconds(prev => prev - 1)}
                              className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-slate-200 cursor-pointer"
                            >
                              -1s
                            </button>
                            <button
                              onClick={() => setSubtitleOffsetSeconds(0)}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono text-slate-400 cursor-pointer"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => setSubtitleOffsetSeconds(prev => prev + 1)}
                              className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-slate-200 cursor-pointer"
                            >
                              +1s
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quality Switcher Button & Popup Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowQualityMenu(!showQualityMenu);
                      setShowSubtitleMenu(false);
                    }}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border bg-white/10 text-purple-300 border-white/10 hover:border-purple-400/50 active:scale-95"
                    title="Stream Quality"
                  >
                    <SlidersHorizontal className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                    <span>
                      {currentQualityIndex === -1 ? 'Auto' : availableQualities.find(q => q.index === currentQualityIndex)?.label.split(' ')[0] || '1080p'}
                    </span>
                  </button>

                  {/* Quality Popup */}
                  {showQualityMenu && (
                    <div className="absolute bottom-full mb-2 right-0 z-50 bg-slate-950/98 border border-purple-500/50 rounded-2xl p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl w-38 space-y-1 animate-fadeIn">
                      <button
                        onClick={() => handleQualityChange(-1)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          currentQualityIndex === -1 
                            ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-400/30' 
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>Auto (ABR)</span>
                        {currentQualityIndex === -1 && <CheckCircle2 className="w-3 h-3 text-purple-400" />}
                      </button>

                      {availableQualities.map(q => (
                        <button
                          key={q.index}
                          onClick={() => handleQualityChange(q.index)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                            currentQualityIndex === q.index 
                              ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-400/30' 
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{q.label}</span>
                          {currentQualityIndex === q.index && <CheckCircle2 className="w-3 h-3 text-purple-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button 
                  onClick={toggleNativeFullscreen}
                  className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-rose-600 hover:text-white text-slate-200 flex items-center justify-center cursor-pointer transition-all border border-white/15 active:scale-95"
                  title="Toggle Fullscreen"
                >
                  {isMovieFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. SEASONS & EPISODES EXPLORER (FOR TV SHOWS & ANIME)                     */}
      {/* ========================================================================= */}
      {activeMediaItem.seasons && activeMediaItem.seasons.length > 0 && (
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/85 border border-purple-500/30 backdrop-blur-2xl shadow-xl space-y-3.5">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Seasons & Episodes
              </h3>
            </div>

            {/* Season Selector Tabs */}
            {activeMediaItem.seasons.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {activeMediaItem.seasons.map(s => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setSelectedSeason(s.seasonNumber)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      selectedSeason === s.seasonNumber
                        ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Season {s.seasonNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Episode Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
            {currentSeasonEpisodes.map(ep => {
              const isEpActive = currentEpisode?.id === ep.id && hasStreamStarted;
              return (
                <div
                  key={ep.id}
                  onClick={() => selectAndPlayEpisode(ep)}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-2 ${
                    isEpActive 
                      ? 'bg-gradient-to-br from-purple-900/40 to-rose-900/30 border-rose-500 shadow-[0_0_18px_rgba(225,29,72,0.3)]' 
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-purple-400/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/10">
                      {ep.thumbnailUrl ? (
                        <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Clapperboard className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-rose-400 shrink-0">
                          E{ep.episodeNumber}
                        </span>
                        <h4 className={`text-xs font-bold truncate ${isEpActive ? 'text-rose-300' : 'text-white group-hover:text-purple-300'}`}>
                          {ep.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{ep.overview || `Runtime: ${ep.runtimeMinutes} min`}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span>{ep.runtimeMinutes} min</span>
                    {isEpActive && isMovieVideoPlaying && (
                      <span className="text-rose-400 font-bold animate-pulse">Now Playing ▶</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. METADATA STRIP & WATCHLIST ACTION                                      */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {activeMediaItem.title}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-[10px] sm:text-[11px] font-bold">
              ★ {activeMediaItem.rating || '8.8'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border ${
              activeMediaItem.type === 'series' 
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/40' 
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
            }`}>
              {activeMediaItem.type === 'series' ? 'Series' : 'Movie'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-slate-300">
              {activeMediaItem.releaseYear || '2024'}
            </span>
            {activeMediaItem.runtimeFormatted && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-purple-200 text-[10px] font-mono font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{activeMediaItem.runtimeFormatted}</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
            {activeMediaItem.overview || 'High definition master stream featuring uncompressed visual telemetry and spatial audio.'}
          </p>

          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400 font-mono flex-wrap">
            <span>Director: {activeMediaItem.directors?.join(', ') || 'Global Director'}</span>
            <span>·</span>
            <span>Duration: {activeMediaItem.runtimeFormatted || activeMediaItem.duration || 'Feature'}</span>
          </div>
        </div>

        {/* Watchlist Action Pill */}
        <button 
          onClick={(e) => toggleWatchlist(activeMediaItem.id, e)}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 ${
            watchlistIds[activeMediaItem.id]
              ? 'bg-rose-500/20 text-rose-300 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
              : 'bg-white hover:bg-slate-100 text-slate-950 shadow-[0_4px_18px_rgba(255,255,255,0.2)]'
          }`}
        >
          {watchlistIds[activeMediaItem.id] ? (
            <>
              <Check className="w-3.5 h-3.5 text-rose-400" />
              <span>In Watchlist</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-slate-950" />
              <span>Add to Watchlist</span>
            </>
          )}
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 5. RECOMMENDED MOVIES SHOWCASE (CLEAN CARDS & ZERO CLUTTER)                */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-3.5">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Trending Cinema & Streams
            </h3>
          </div>
          <span className="text-[11px] font-mono text-purple-300 font-bold">
            {catalogResults.length} Available
          </span>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {catalogResults.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => selectAndPlayMedia(movie)}
              className={`group relative shrink-0 w-28 sm:w-36 cursor-pointer space-y-1.5 transition-all ${
                activeMediaItem.id === movie.id ? 'scale-102' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className={`relative h-38 sm:h-44 rounded-2xl overflow-hidden border transition-all ${
                activeMediaItem.id === movie.id 
                  ? 'border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.5)]' 
                  : 'border-white/10 group-hover:border-purple-400/50'
              }`}>
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[8.5px] font-mono font-bold text-white uppercase">
                  {movie.type === 'series' ? 'SERIES' : 'MOVIE'}
                </div>

                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9.5px] sm:text-[10px] text-white font-mono">
                  <span className="text-amber-300">★ {movie.rating}</span>
                  <span>{movie.runtimeFormatted || movie.releaseYear || '2024'}</span>
                </div>
              </div>

              <div className="space-y-0.5 px-0.5">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                  {movie.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate font-sans">
                  {movie.genres?.slice(0, 2).join(' · ') || 'Cinema'}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
