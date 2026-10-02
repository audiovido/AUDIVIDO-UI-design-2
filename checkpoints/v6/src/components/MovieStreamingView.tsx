import React from 'react';
import { 
  ArrowLeft, Search, Bookmark, ChevronLeft, ChevronRight, Share2, 
  MoreHorizontal, MessageSquare, Heart, Play, Pause, Volume2, VolumeX, 
  Maximize2, Minimize2, Settings, User, Bell, HelpCircle, LogOut, 
  Plus, Check, Sparkles, X, Compass as BrowseIcon 
} from 'lucide-react';
import { Movie, Actor, MovieReview, AURA_MOVIES, MOVIE_FREAK_OF_MONTH } from '../data/auraStore';

interface MovieStreamingViewProps {
  handleTravel: (world: 'portal' | 'music' | 'movie' | 'community') => void;
  currentMovie: Movie;
  setCurrentMovie: (movie: Movie) => void;
  actorsList: Actor[];
  toggleFollowActor: (actorId: string, actorName: string, e?: React.MouseEvent) => void;
  watchlistIds: Record<string, boolean>;
  toggleWatchlist: (movieId: string, e?: React.MouseEvent) => void;
  movieSearch: string;
  setMovieSearch: (search: string) => void;
  movieFilterCategory: string;
  setMovieFilterCategory: (category: string) => void;
  activeMovieMenuModal: 'settings' | 'account' | 'notifications' | 'help' | null;
  setActiveMovieMenuModal: (modal: 'settings' | 'account' | 'notifications' | 'help' | null) => void;
  activeMenuSelection: string;
  setActiveMenuSelection: (sel: string) => void;
  isMovieVideoPlaying: boolean;
  setIsMovieVideoPlaying: (playing: boolean) => void;
  moviePlaySeconds: number;
  setMoviePlaySeconds: (sec: number | ((prev: number) => number)) => void;
  isMovieMuted: boolean;
  setIsMovieMuted: (muted: boolean) => void;
  isMovieFullscreen: boolean;
  setIsMovieFullscreen: (fs: boolean) => void;
  likedReviewIds: Record<string, boolean>;
  toggleLikeReview: (reviewId: string) => void;
  bookmarkedReviewIds: Record<string, boolean>;
  toggleBookmarkReview: (reviewId: string) => void;
  movieToast: string | null;
  showMovieToast: (msg: string) => void;
  newReviewText: string;
  setNewReviewText: (text: string) => void;
  handleAddReview: (e: React.FormEvent) => void;
  movieReviewsMap: Record<string, MovieReview[]>;
  formatMovieTime: (seconds: number) => string;
}

export function MovieStreamingView({
  handleTravel,
  currentMovie,
  setCurrentMovie,
  actorsList,
  toggleFollowActor,
  watchlistIds,
  toggleWatchlist,
  movieSearch,
  setMovieSearch,
  movieFilterCategory,
  setMovieFilterCategory,
  activeMovieMenuModal,
  setActiveMovieMenuModal,
  activeMenuSelection,
  setActiveMenuSelection,
  isMovieVideoPlaying,
  setIsMovieVideoPlaying,
  moviePlaySeconds,
  setMoviePlaySeconds,
  isMovieMuted,
  setIsMovieMuted,
  isMovieFullscreen,
  setIsMovieFullscreen,
  likedReviewIds,
  toggleLikeReview,
  bookmarkedReviewIds,
  toggleBookmarkReview,
  movieToast,
  showMovieToast,
  newReviewText,
  setNewReviewText,
  handleAddReview,
  movieReviewsMap,
  formatMovieTime
}: MovieStreamingViewProps) {

  const filteredMovies = AURA_MOVIES.filter(movie => {
    if (movieSearch.trim()) {
      const q = movieSearch.toLowerCase();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchCast = movie.cast?.some(c => c.toLowerCase().includes(q));
      const matchGenre = movie.genre.toLowerCase().includes(q);
      if (!matchTitle && !matchCast && !matchGenre) return false;
    }
    if (movieFilterCategory === 'action') {
      return movie.genres?.includes('Action') || movie.genres?.includes('Sci-fi') || movie.genres?.includes('Sci-Fi');
    }
    if (movieFilterCategory === 'animation') {
      return movie.genres?.includes('Animation');
    }
    if (movieFilterCategory === 'drama') {
      return movie.genres?.includes('Drama') || movie.genres?.includes('History') || movie.genres?.includes('Comedy');
    }
    if (movieFilterCategory === 'watchlist') {
      return !!watchlistIds[movie.id];
    }
    return true;
  });

  return (
    <div className="w-full max-w-6xl space-y-6 animate-fadeIn py-2 pb-36 relative">
      
      {/* Top Standard Movie Streaming Navigation Bar (Rounded Pills & Curves, Harmonious with Music) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-full bg-slate-950/45 border border-white/10 backdrop-blur-2xl shrink-0 shadow-lg">
        
        {/* Left Navigation: Return to Portal + Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            onClick={() => handleTravel('portal')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-all cursor-pointer active:scale-95"
            title="Return to Home Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>

          <button 
            onClick={() => setMovieFilterCategory('all')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              movieFilterCategory === 'all'
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-pink-200 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <BrowseIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>Explore</span>
          </button>

          <button 
            onClick={() => setMovieFilterCategory('action')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              movieFilterCategory === 'action'
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-pink-200 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            Action & Sci-Fi
          </button>

          <button 
            onClick={() => setMovieFilterCategory('animation')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              movieFilterCategory === 'animation'
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-pink-200 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            Animation
          </button>

          <button 
            onClick={() => setMovieFilterCategory('drama')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              movieFilterCategory === 'drama'
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-pink-200 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            Drama & Classics
          </button>

          <button 
            onClick={() => setMovieFilterCategory('watchlist')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              movieFilterCategory === 'watchlist'
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-pink-200 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-pink-400" />
            <span>Watchlist</span>
            {Object.values(watchlistIds).filter(Boolean).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
                {Object.values(watchlistIds).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Right: Live Search & Format Badge */}
        <div className="flex items-center gap-2.5 flex-1 max-w-sm justify-end">
          <div className="relative w-full max-w-[210px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              value={movieSearch}
              onChange={(e) => setMovieSearch(e.target.value)}
              placeholder="Search movies, cast..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-slate-900/60 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all font-sans"
            />
            {movieSearch && (
              <button onClick={() => setMovieSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-purple-500/30 text-[10px] font-mono text-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_6px_#ec4899]" />
            <span>4K DOLBY CINEMA</span>
          </div>
        </div>
      </div>

      {/* Toast Notification Bar */}
      {movieToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 text-pink-200 border border-pink-500/40 shadow-[0_0_24px_rgba(236,72,153,0.35)] backdrop-blur-xl text-xs font-semibold animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>{movieToast}</span>
        </div>
      )}

      {/* Core 3-Column Paperpillar Movie Streaming Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT (Poster Spotlight & Best Actors) */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-5 flex flex-col">
          
          {/* 1.1 Poster Spotlight Card (Spider-Man or Active Movie) */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950/80 border border-purple-500/25 shadow-[0_12px_40px_rgba(168,85,247,0.18)] hover:border-pink-500/40 transition-all duration-500 flex flex-col justify-end min-h-[440px] group">
            {/* Background Artwork */}
            <img 
              src={currentMovie.posterUrl || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80'} 
              alt={currentMovie.title} 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle Neon Blur Gradient Overlays (Purple & Pink Glow) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-pink-950/40 mix-blend-color-dodge opacity-60 pointer-events-none" />
            
            {/* Ambient Rim Lighting */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge: Quiet Unboxed Indicator */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-pink-300 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_6px_#f43f5e]" />
              <span>PREMIERE SPOTLIGHT</span>
            </div>

            {/* Poster Content Info & Actions */}
            <div className="relative z-10 p-5 space-y-3.5">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {currentMovie.title}
                </h2>
                {/* Genres rendered as clean unboxed text with bullets */}
                <p className="text-xs text-slate-300 font-medium tracking-wide">
                  {currentMovie.genres?.join(' · ') || currentMovie.genre}
                </p>
              </div>

              {/* Dual Action Buttons matching Paperpillar Design */}
              <div className="flex flex-col gap-2 pt-1">
                {/* Primary White Watch Pill */}
                <button 
                  onClick={() => {
                    setIsMovieVideoPlaying(true);
                    showMovieToast(`Now streaming ${currentMovie.title}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-100 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.3)] active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>Watch</span>
                </button>

                {/* Secondary Translucent Watch Later Pill */}
                <button 
                  onClick={(e) => toggleWatchlist(currentMovie.id, e)}
                  className="w-full py-2.5 px-4 rounded-full bg-black/50 hover:bg-black/70 text-white font-medium border border-white/20 flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-95 transition-all text-xs cursor-pointer hover:border-pink-500/40"
                >
                  {watchlistIds[currentMovie.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-pink-200">In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-slate-300" />
                      <span>Add to watch later</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 1.2 Best Actors Card */}
          <div className="rounded-3xl bg-slate-950/65 border border-purple-500/20 backdrop-blur-2xl p-5 shadow-[0_10px_35px_rgba(168,85,247,0.12)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">Best Actors</h3>
              <button 
                onClick={() => showMovieToast('Showing verified Hollywood & Global icons')}
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="space-y-3">
              {actorsList.slice(0, 3).map((actor, idx) => (
                <div key={actor.id} className="flex items-center justify-between gap-2.5 py-0.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-slate-500 font-semibold w-3.5">{idx + 1}.</span>
                    <img 
                      src={actor.avatar} 
                      alt={actor.name} 
                      className="w-9 h-9 rounded-full object-cover border border-purple-500/30 shrink-0 shadow-sm" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{actor.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{actor.handle}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleFollowActor(actor.id, actor.name, e)}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      actor.isFollowing 
                        ? 'bg-white/10 text-slate-300 border border-white/15 hover:bg-white/15' 
                        : 'bg-white text-slate-950 hover:bg-slate-100 shadow-[0_2px_10px_rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {actor.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER (Recommended Movies & Reviews with Arc) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-5 flex flex-col">
          
          {/* 2.1 Recommended Movies Horizontal Showcase */}
          <div className="rounded-3xl bg-slate-950/65 border border-purple-500/20 backdrop-blur-2xl p-5 shadow-[0_10px_35px_rgba(168,85,247,0.12)] space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">Recommended Movies</h3>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => showMovieToast('Browsing earlier recommendations')}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  title="Previous"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showMovieToast('Browsing next recommendations')}
                  className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  title="Next"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Movie Poster Cards */}
            <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-purple-900/50">
              {filteredMovies.map((movie) => (
                <div 
                  key={movie.id}
                  onClick={() => {
                    setCurrentMovie(movie);
                    showMovieToast(`Loaded ${movie.title}`);
                  }}
                  className={`group relative shrink-0 w-24 sm:w-26 cursor-pointer space-y-1.5 transition-all ${
                    currentMovie.id === movie.id ? 'scale-102' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className={`relative h-32 rounded-2xl overflow-hidden border transition-all ${
                    currentMovie.id === movie.id 
                      ? 'border-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.4)]' 
                      : 'border-white/10 group-hover:border-purple-500/40'
                  }`}>
                    <img 
                      src={movie.posterUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Rating chip on top right */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[9.5px] font-bold text-amber-300">
                      <span>★</span>
                      <span>{movie.score}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 px-0.5">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-pink-200 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {movie.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2.2 Reviews Card with Semicircular Neon Arc Gauge */}
          <div className="rounded-3xl bg-slate-950/65 border border-purple-500/20 backdrop-blur-2xl p-5 shadow-[0_10px_35px_rgba(168,85,247,0.12)] space-y-4">
            
            {/* Reviews Header with Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">Reviews</h3>
              <div className="flex items-center gap-2 text-slate-400">
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    showMovieToast('Review share link copied!');
                  }}
                  className="hover:text-pink-300 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => toggleBookmarkReview(currentMovie.id)}
                  className={`transition-colors cursor-pointer ${
                    bookmarkedReviewIds[currentMovie.id] ? 'text-pink-400' : 'hover:text-pink-300'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showMovieToast('Reviews sorted by Top Helpful')}
                  className="hover:text-pink-300 transition-colors cursor-pointer"
                  title="More options"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Semicircular Glowing Neon Arc Gauge */}
            <div className="relative flex flex-col items-center justify-center pt-2">
              <svg viewBox="0 0 200 115" className="w-52 h-30 filter drop-shadow-[0_0_16px_rgba(168,85,247,0.45)]">
                <defs>
                  <linearGradient id="neon-gauge-purple-pink" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="45%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                {/* Inactive Background Track */}
                <path 
                  d="M 25 105 A 75 75 0 0 1 175 105" 
                  fill="none" 
                  stroke="#1E1B4B" 
                  strokeWidth="9" 
                  strokeLinecap="round" 
                />
                {/* Active Glowing Neon Arc */}
                <path 
                  d="M 25 105 A 75 75 0 0 1 175 105" 
                  fill="none" 
                  stroke="url(#neon-gauge-purple-pink)" 
                  strokeWidth="9" 
                  strokeLinecap="round" 
                  strokeDasharray="235.6" 
                  strokeDashoffset={235.6 * (1 - ((currentMovie.score || 7.8) / 10))}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Score Center Text */}
              <div className="absolute bottom-2 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
                  {currentMovie.score || 7.8}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {currentMovie.ratedCount || '122K Rated'}
                </span>
              </div>
            </div>

            {/* 3 Platform Critic Badges (Rotten Tomatoes, IMDb, JustWatch) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-all text-center">
                <div className="flex items-center gap-1 text-xs font-bold text-white">
                  <span className="text-rose-500 text-sm">🍅</span>
                  <span>{currentMovie.rottenTomatoes || 97}%</span>
                </div>
                <span className="text-[9.5px] text-slate-400 mt-0.5">Rotten Tomatoes</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all text-center">
                <div className="flex items-center gap-1 text-xs font-bold text-white">
                  <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px]">IMDb</span>
                  <span>{currentMovie.imdb || 8.4}</span>
                </div>
                <span className="text-[9.5px] text-slate-400 mt-0.5">IMDb</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all text-center">
                <div className="flex items-center gap-1 text-xs font-bold text-white">
                  <span className="text-teal-400 text-sm">▶</span>
                  <span>{currentMovie.justWatch || 97}%</span>
                </div>
                <span className="text-[9.5px] text-slate-400 mt-0.5">JustWatch</span>
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Critic Reviews Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white tracking-wide">Critic Reviews</h4>
                <button 
                  onClick={() => showMovieToast('Showing 1,420 Verified Reviews')}
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
                >
                  See all
                </button>
              </div>

              {/* Review Cards list */}
              <div className="space-y-3">
                {(movieReviewsMap[currentMovie.id] || currentMovie.reviews || []).slice(0, 2).map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.avatar} alt={rev.author} className="w-7 h-7 rounded-full object-cover border border-purple-500/30" />
                        <div>
                          <h5 className="text-xs font-bold text-white leading-none">{rev.author}</h5>
                          <span className="text-[10px] text-slate-400">{rev.time}</span>
                        </div>
                      </div>
                      {/* 5 Stars */}
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {rev.text}
                    </p>

                    {/* Interactive Reaction Counters */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <button 
                        onClick={() => showMovieToast(`Replying to ${rev.author}`)}
                        className="flex items-center gap-1 hover:text-pink-300 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{rev.comments}</span>
                      </button>
                      <button 
                        onClick={() => toggleLikeReview(rev.id)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${
                          likedReviewIds[rev.id] ? 'text-pink-400' : 'hover:text-pink-300'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedReviewIds[rev.id] ? 'fill-pink-400' : ''}`} />
                        <span>{rev.likes + (likedReviewIds[rev.id] ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Inline Review Form */}
              <form onSubmit={handleAddReview} className="flex gap-2 pt-1">
                <input 
                  type="text" 
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Write a quick critic review..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-full bg-slate-900/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/60 font-sans"
                />
                <button 
                  type="submit" 
                  disabled={!newReviewText.trim()}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-xs disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                >
                  Post
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT (Cinema Video Player, Freak & Menu) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-5 flex flex-col">
          
          {/* 3.1 Video Cinema Player & Cast Card (Kong: Skull Island / Active Movie) */}
          <div className="rounded-3xl bg-slate-950/65 border border-purple-500/20 backdrop-blur-2xl p-5 shadow-[0_12px_40px_rgba(168,85,247,0.18)] hover:border-pink-500/40 transition-all duration-500 space-y-4">
            
            {/* Top Video Player Toolbar */}
            <div className="flex items-center justify-between gap-3 px-1">
              {/* Play/Pause Button */}
              <button 
                onClick={() => {
                  setIsMovieVideoPlaying(!isMovieVideoPlaying);
                  showMovieToast(isMovieVideoPlaying ? 'Video Paused' : 'Video Playing');
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 active:scale-95"
              >
                {isMovieVideoPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                )}
              </button>

              {/* Timeline Seek Bar */}
              <div className="flex-1 flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-slate-300 font-semibold min-w-[50px]">
                  {formatMovieTime(moviePlaySeconds)}
                </span>
                
                <div className="relative flex-1 flex items-center">
                  <input 
                    type="range"
                    min="0"
                    max="7200"
                    value={moviePlaySeconds}
                    onChange={(e) => setMoviePlaySeconds(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none"
                  />
                </div>

                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  {currentMovie.duration}
                </span>
              </div>

              {/* Mute & Fullscreen Actions */}
              <div className="flex items-center gap-1.5 text-slate-300">
                <button 
                  onClick={() => {
                    setIsMovieMuted(!isMovieMuted);
                    showMovieToast(isMovieMuted ? 'Audio Unmuted' : 'Audio Muted');
                  }}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                  title={isMovieMuted ? 'Unmute' : 'Mute'}
                >
                  {isMovieMuted ? <VolumeX className="w-3.5 h-3.5 text-pink-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button 
                  onClick={() => {
                    setIsMovieFullscreen(!isMovieFullscreen);
                    showMovieToast(isMovieFullscreen ? 'Exited Fullscreen' : 'Cinema Theater Mode');
                  }}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                  title="Toggle Theater Mode"
                >
                  {isMovieFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-pink-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Cinematic Video Viewport */}
            <div className={`relative rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_0_50px_rgba(168,85,247,0.3)] transition-all ${
              isMovieFullscreen ? 'aspect-[2.39/1]' : 'aspect-video'
            }`}>
              <img 
                src={currentMovie.backdropUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80'} 
                alt={currentMovie.title} 
                className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                  isMovieVideoPlaying ? 'scale-103' : 'scale-100'
                }`}
              />

              {/* Dynamic Ambient Neon Edge Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Simulated Cinema Screen Glare & Lighting Flare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 via-transparent to-pink-500/20 pointer-events-none" />

              {/* Pause State Center Overlay */}
              {!isMovieVideoPlaying && (
                <div 
                  onClick={() => {
                    setIsMovieVideoPlaying(true);
                    showMovieToast(`Playing ${currentMovie.title}`);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.6)] group-hover:scale-110 active:scale-95 transition-all">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Active Subtitle Cue Simulation */}
              {isMovieVideoPlaying && (
                <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                  <span className="px-3 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-xs font-medium font-sans border border-white/10 shadow-lg">
                    [Dynamic 4K Dolby Atmos Master Stream]
                  </span>
                </div>
              )}
            </div>

            {/* Movie Title & Synopsis */}
            <div className="space-y-1.5 pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                {currentMovie.title}
              </h2>
              <p className="text-xs text-pink-300 font-medium">
                {currentMovie.genres?.join(' · ') || currentMovie.genre}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {currentMovie.description}
              </p>
            </div>

            {/* Cast Members Row */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cast</h4>
              
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {(currentMovie.castMembers || [
                  { name: 'Brie Larson', role: 'Mason Weaver', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Samuel L. Jackson', role: 'Preston Packard', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Tom Hiddleston', role: 'Captain James', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
                  { name: 'John Goodman', role: 'Bill Randa', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' }
                ]).map((c, i) => (
                  <div 
                    key={i} 
                    onClick={() => showMovieToast(`Cast Spotlight: ${c.name} as ${c.role}`)}
                    className="shrink-0 flex flex-col items-center text-center w-18 cursor-pointer group"
                  >
                    <img 
                      src={c.photo} 
                      alt={c.name} 
                      className="w-11 h-11 rounded-full object-cover border border-purple-500/30 group-hover:border-pink-400 group-hover:scale-108 transition-all shadow-md"
                    />
                    <span className="text-[11px] font-bold text-white truncate w-full mt-1.5 group-hover:text-pink-200">
                      {c.name}
                    </span>
                    <span className="text-[9.5px] text-slate-400 truncate w-full">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3.2 Split Bottom Row: Movie Freak of the Month + Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Bottom-Left: Movie Freak of the Month */}
            <div className="rounded-3xl bg-slate-950/65 border border-purple-500/20 backdrop-blur-2xl p-4.5 shadow-[0_10px_35px_rgba(168,85,247,0.12)] flex flex-col justify-between space-y-3 hover:border-pink-500/40 transition-all duration-300">
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-slate-400">Browse More</span>
                <span className="text-pink-400 font-bold tracking-tight">Movie Freak of the Month</span>
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="relative">
                  <img 
                    src={MOVIE_FREAK_OF_MONTH.avatar} 
                    alt={MOVIE_FREAK_OF_MONTH.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.4)]"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {MOVIE_FREAK_OF_MONTH.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {MOVIE_FREAK_OF_MONTH.followers}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => showMovieToast('Opening Underworld Kings curated 4K cinema list')}
                className="w-full py-2 px-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold transition-all cursor-pointer text-center active:scale-95"
              >
                View Curated Room
              </button>
            </div>

            {/* Bottom-Right: Movie Streaming Settings Menu */}
            <div className="rounded-3xl bg-slate-950/65 border border-purple-500/20 backdrop-blur-2xl p-4.5 shadow-[0_10px_35px_rgba(168,85,247,0.12)] space-y-2.5 hover:border-pink-500/40 transition-all duration-300">
              <h3 className="text-sm font-bold text-white px-1">Menu</h3>

              <div className="space-y-1">
                {/* App Settings (Active Highlighted Pill) */}
                <button 
                  onClick={() => {
                    setActiveMenuSelection('settings');
                    setActiveMovieMenuModal('settings');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeMenuSelection === 'settings'
                      ? 'bg-white text-slate-950 shadow-[0_2px_12px_rgba(255,255,255,0.25)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    <span>App Settings</span>
                  </div>
                </button>

                {/* Account */}
                <button 
                  onClick={() => {
                    setActiveMenuSelection('account');
                    setActiveMovieMenuModal('account');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeMenuSelection === 'account'
                      ? 'bg-white text-slate-950 shadow-[0_2px_12px_rgba(255,255,255,0.25)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Account</span>
                  </div>
                </button>

                {/* Notification */}
                <button 
                  onClick={() => {
                    setActiveMenuSelection('notifications');
                    setActiveMovieMenuModal('notifications');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeMenuSelection === 'notifications'
                      ? 'bg-white text-slate-950 shadow-[0_2px_12px_rgba(255,255,255,0.25)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notification</span>
                  </div>
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    10
                  </span>
                </button>

                {/* Help */}
                <button 
                  onClick={() => {
                    setActiveMenuSelection('help');
                    setActiveMovieMenuModal('help');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeMenuSelection === 'help'
                      ? 'bg-white text-slate-950 shadow-[0_2px_12px_rgba(255,255,255,0.25)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Help</span>
                  </div>
                </button>

                {/* Log out */}
                <button 
                  onClick={() => {
                    handleTravel('portal');
                    showMovieToast('Session saved. Welcome back anytime.');
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Interactive Menu Modal Dialogs */}
      {activeMovieMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-purple-500/40 p-6 shadow-[0_0_50px_rgba(168,85,247,0.35)] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {activeMovieMenuModal === 'settings' && <><Settings className="w-4 h-4 text-pink-400" /> App Streaming Settings</>}
                {activeMovieMenuModal === 'account' && <><User className="w-4 h-4 text-pink-400" /> Aura Cinephile Account</>}
                {activeMovieMenuModal === 'notifications' && <><Bell className="w-4 h-4 text-pink-400" /> Notifications (10)</>}
                {activeMovieMenuModal === 'help' && <><HelpCircle className="w-4 h-4 text-pink-400" /> Help & Streaming Support</>}
              </h3>
              <button 
                onClick={() => setActiveMovieMenuModal(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeMovieMenuModal === 'settings' && (
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Video Quality Preset</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white font-sans focus:outline-none focus:border-pink-500">
                    <option>4K Ultra HD (HDR10+ / Dolby Vision) — Recommended</option>
                    <option>1080p FHD (High Bitrate)</option>
                    <option>720p HD (Data Saver)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Spatial Audio Output</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white font-sans focus:outline-none focus:border-pink-500">
                    <option>Dolby Atmos Binaural Spatial Audio</option>
                    <option>7.1 Surround Master Sound</option>
                    <option>Stereo Enhanced Studio Headphones</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Subtitles & Closed Captions</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white font-sans focus:outline-none focus:border-pink-500">
                    <option>English [CC]</option>
                    <option>Persian / فارسی</option>
                    <option>Spanish / Español</option>
                    <option>Off</option>
                  </select>
                </div>
              </div>
            )}

            {activeMovieMenuModal === 'account' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-12 h-12 rounded-full border border-pink-500" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Aura Starry Member</h4>
                    <p className="text-[11px] text-slate-400">arm.shokri@gmail.com</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[9.5px] font-mono font-bold">
                      PREMIUM VIP PASS
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-slate-300">
                  <div className="flex justify-between"><span>Watch Time This Month:</span> <strong className="text-white">48h 20m</strong></div>
                  <div className="flex justify-between"><span>Active Displays:</span> <strong className="text-white">Home Living Cinema (4K OLED)</strong></div>
                </div>
              </div>
            )}

            {activeMovieMenuModal === 'notifications' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {[
                  'New 4K IMAX remaster of "Spider-Man: Into the Spider-Verse" is now live.',
                  'Denzel Washington added to featured spotlight.',
                  'Underworld Kings published a new curated sci-fi playlist.',
                  'Your friend Clara watched "Kong: Skull Island".',
                  'Weekly cinema premiere schedule updated.',
                  'Dolby Atmos sound spatial calibration updated for your room.',
                  'New critic review on "Dunkirk" from Jordan Vance.',
                  'Watchlist synchronization complete across all devices.',
                  'Aura cinema preset auto-tuned for twilight viewing.',
                  'Welcome to Aura Starry Movie Streaming Hub!'
                ].map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            {activeMovieMenuModal === 'help' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">How do I stream in 4K HDR?</h4>
                  <p className="text-slate-400">All streams automatically adjust to the maximum resolution of your display with zero buffering.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h4 className="font-bold text-white">How does the Watchlist work?</h4>
                  <p className="text-slate-400">Click &ldquo;Add to watch later&rdquo; on any poster or movie card. Your watchlist is synced instantly.</p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={() => {
                  setActiveMovieMenuModal(null);
                  showMovieToast('Settings updated');
                }}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-[0_0_16px_rgba(236,72,153,0.35)] cursor-pointer active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
