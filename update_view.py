with open('src/components/MusicV2View.tsx', 'r') as f:
    code = f.read()

# 1. Add User to lucide-react imports if not present
if 'User,' not in code and ', User' not in code:
    code = code.replace("Library, Disc, Calendar", "Library, Disc, Calendar, User")

# 2. Add showProfileLibraryModal state
state_marker = "const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);"
if "showProfileLibraryModal" not in code:
    code = code.replace(
        state_marker,
        state_marker + "\n  const [showProfileLibraryModal, setShowProfileLibraryModal] = useState<boolean>(false);"
    )

# 3. Replace Top Console (from line '{/* 1. TOP APP BAR & NAVIGATION CONSOLE' down to '2. MAIN VIEW CONTENT')
top_bar_start = '{/* 1. TOP APP BAR & NAVIGATION CONSOLE (CLEAN, 100% RESPONSIVE, ZERO OVERLAP) */}'
main_view_start = '{/* 2. MAIN VIEW CONTENT: DISCOVER / LIBRARY / EXPANDED PLAYER                */}'

idx_top = code.find(top_bar_start)
idx_main = code.find(main_view_start)

assert idx_top != -1, "idx_top not found"
assert idx_main != -1, "idx_main not found"

new_top_console = '''{/* 1. TOP APP BAR & NAVIGATION CONSOLE (CLEAN, 100% RESPONSIVE, ZERO OVERLAP) */}
      {/* ========================================================================= */}
      <div className={`relative ${isSearchDropdownOpen && searchQuery.trim().length > 0 ? 'z-[9990]' : 'z-30'} flex flex-col gap-3 p-3.5 sm:p-5 rounded-3xl sm:rounded-[36px] bg-slate-950/95 border border-white/20 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15),_0_20px_50px_rgba(0,0,0,0.9)]`}>
        
        {/* ROW 1: EXPANDED SEARCH BAR (STRETCHING FROM FAR LEFT) + NOTIFICATION BELL */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 w-full">
          
          {/* SEARCH INPUT & DEDICATED SEARCH HERE BUTTON (FULL HORIZONTAL REACH FROM LEFT) */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
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
                  className="w-full pl-10 sm:pl-11 pr-8 sm:pr-9 py-2.5 sm:py-3 rounded-full bg-white/[0.07] hover:bg-white/[0.12] focus:bg-slate-900 border border-white/15 focus:border-lime-400 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.08)] focus:shadow-[0_0_24px_rgba(163,230,53,0.3)]"
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

              {/* DEDICATED SEARCH BUTTON LABELED "Search here" */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchDropdownOpen(true);
                  setShowNotificationModal(false);
                  const results = apiTracks.length > 0 ? apiTracks : filteredTracks;
                  if (results.length > 0 && searchQuery.trim().length > 0) {
                    handlePlayFromSearch(results[0]);
                  }
                }}
                className="relative px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 text-xs sm:text-sm font-black shrink-0 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(163,230,53,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_0_22px_rgba(163,230,53,0.7)] transition-all cursor-pointer active:scale-95 border border-lime-200 select-none"
                title="Search here"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5]" />
                <span className="hidden xs:inline">Search here</span>
              </button>
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

          {/* RIGHT ZONE: Notification Bell */}
          <div className="relative shrink-0 flex items-center justify-end">
            <button 
              onClick={() => {
                const next = !showNotificationModal;
                setShowNotificationModal(next);
                if (next) setIsSearchDropdownOpen(false);
              }}
              className="relative p-2.5 sm:p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-lime-400/50 text-slate-200 hover:text-white transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
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

        {/* ROW 2: SAMANTHA PROFILE & LIBRARY INTERACTIVE BAR (ENLARGED PHOTO, INTRODUCED BELOW SEARCH BAR) */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2.5 border-t border-white/10 w-full">
          {/* LEFT: Larger Samantha Photo & Introduction (Clickable to open My Profile & Library) */}
          <button
            type="button"
            onClick={() => setShowProfileLibraryModal(true)}
            className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer text-left transition-all active:scale-[0.98]"
            title="Click to view My Profile & Library"
          >
            {/* Enlarged Avatar with Glow and Online Indicator */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-lime-300 ring-2 sm:ring-4 ring-lime-500/25 shadow-[0_0_20px_rgba(163,230,53,0.45)] group-hover:scale-105 group-hover:ring-lime-400/50 transition-all shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                alt="Samantha" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-lime-400 border-2 border-slate-950 shadow-[0_0_8px_#a3e635]" />
            </div>

            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Welcome Back,
                </span>
                <span className="px-2 py-0.2 rounded-full bg-lime-400/15 border border-lime-400/35 text-[9px] font-mono text-lime-300 font-bold">
                  Hi-Fi VIP
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white group-hover:text-lime-300 tracking-tight flex items-center gap-1.5 transition-colors">
                <span>Samantha</span>
                <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
              </h2>
            </div>
          </button>

          {/* RIGHT: Interactive Library Quick Access Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowProfileLibraryModal(true)}
              className="relative px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 text-slate-950 text-xs sm:text-sm font-black font-sans uppercase tracking-[0.1em] shadow-[0_4px_18px_rgba(163,230,53,0.65),inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.35)] border border-lime-100 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              title="Open My Library & Profile"
            >
              <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
              <span>My Profile & Library</span>
              {likedSongsList.length > 0 && (
                <span className="bg-slate-950 text-lime-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {likedSongsList.length}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* SAMANTHA PROFILE & LIBRARY FLYOUT MODAL */}
      {showProfileLibraryModal && (
        <>
          <div 
            className="fixed inset-0 z-[9998] cursor-default bg-black/60 backdrop-blur-md animate-fadeIn" 
            onClick={() => setShowProfileLibraryModal(false)} 
          />
          <div 
            onClick={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[500px] max-w-lg p-5 sm:p-6 rounded-[32px] bg-slate-950/98 border border-lime-400/50 shadow-[0_30px_90px_rgba(0,0,0,0.95),_0_0_40px_rgba(163,230,53,0.3)] z-[9999] space-y-4 backdrop-blur-3xl animate-fadeIn max-h-[85vh] overflow-y-auto"
          >
            {/* Header with Samantha Avatar & Status */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.5)] ring-2 ring-lime-500/30 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                    alt="Samantha" 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-lime-400 border-2 border-slate-950 shadow-[0_0_8px_#a3e635]" />
                </div>
                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-white">Samantha</h3>
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  </div>
                  <p className="text-xs text-lime-300 font-mono font-medium">VIP Hi-Fi Member · Lossless Studio</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileLibraryModal(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats Grid: Liked Songs, Saved Albums, Artists */}
            <div className="grid grid-cols-3 gap-2.5">
              <div 
                onClick={() => {
                  setLibraryCategory('Songs');
                  setActiveTab('library');
                  setShowProfileLibraryModal(false);
                }}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-lime-400/40 transition-all text-center cursor-pointer group"
              >
                <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1 group-hover:scale-110 transition-transform fill-rose-500/20" />
                <span className="text-base font-black text-white block group-hover:text-lime-300 transition-colors">
                  {likedSongsList.length}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Liked Songs
                </span>
              </div>

              <div 
                onClick={() => {
                  setLibraryCategory('Albums');
                  setActiveTab('library');
                  setShowProfileLibraryModal(false);
                }}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-lime-400/40 transition-all text-center cursor-pointer group"
              >
                <Disc className="w-4 h-4 text-lime-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-base font-black text-white block group-hover:text-lime-300 transition-colors">
                  {albumGroups.length}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Albums
                </span>
              </div>

              <div 
                onClick={() => {
                  setLibraryCategory('Artists');
                  setActiveTab('library');
                  setShowProfileLibraryModal(false);
                }}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-lime-400/40 transition-all text-center cursor-pointer group"
              >
                <Mic2 className="w-4 h-4 text-teal-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-base font-black text-white block group-hover:text-lime-300 transition-colors">
                  {artistGroups.length}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Artists
                </span>
              </div>
            </div>

            {/* Quick Play Liked Songs Section */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>My Liked Collection</span>
                </span>
                {likedSongsList.length > 0 && (
                  <button
                    onClick={() => {
                      if (likedSongsList.length > 0) {
                        onSelectTrack(likedSongsList[0]);
                        setIsPlaying(true);
                      }
                      setShowProfileLibraryModal(false);
                    }}
                    className="text-[11px] font-bold text-lime-300 hover:text-white flex items-center gap-1 bg-lime-400/20 px-2.5 py-0.5 rounded-full border border-lime-400/40 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play All</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {likedSongsList.slice(0, 6).map(track => (
                  <div
                    key={track.id}
                    onClick={() => {
                      onSelectTrack(track);
                      setIsPlaying(true);
                      setShowProfileLibraryModal(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-lime-400/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-lime-400/40">
                        <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <h5 className="text-xs font-bold text-white group-hover:text-lime-300 truncate font-sans">
                          {track.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate font-sans">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {track.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action: View Full Library Page */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-sans">
                Lossless 24-bit/96kHz Master Active
              </span>
              <button 
                onClick={() => {
                  setActiveTab('library');
                  setShowProfileLibraryModal(false);
                }}
                className="px-4 py-1.5 rounded-full bg-lime-400/20 hover:bg-lime-400 text-lime-300 hover:text-slate-950 border border-lime-400/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span>View Full Library</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </>
      )}

      '''

code = code[:idx_top] + new_top_console + code[idx_main:]

# 4. Now update SUB-VIEW A: DISCOVER
# Replace the Discover view block
disc_start_marker = "{/* --- SUB-VIEW A: DISCOVER"
disc_end_marker = "{/* --- SUB-VIEW B: MY LIBRARY"

idx_disc_start = code.find(disc_start_marker)
idx_disc_end = code.find(disc_end_marker)

assert idx_disc_start != -1, "idx_disc_start not found"
assert idx_disc_end != -1, "idx_disc_end not found"

new_discover_view = '''{/* --- SUB-VIEW A: DISCOVER (3 HORIZONTAL 3D VIBE SPHERES + CHILL VIBE PLAYLIST) --- */}
      {activeTab === 'discover' && (() => {
        const VIBES_CONFIG = [
          {
            id: 'chill' as const,
            title: 'Chill',
            vibe: 'Lo-Fi Beats',
            activeRing: 'border-2 border-emerald-300 ring-2 sm:ring-4 ring-emerald-400/50 shadow-[0_0_25px_rgba(52,211,153,0.5),0_15px_35px_rgba(0,0,0,0.9)] scale-[1.04]',
            inactiveRing: 'border border-white/40 ring-1 ring-white/15 hover:border-emerald-300 hover:ring-emerald-400/30 shadow-[0_12px_30px_rgba(0,0,0,0.8)] hover:scale-[1.02]',
            trackId: 'track-chill-1',
            image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=85',
            accentColor: 'text-emerald-300',
          },
          {
            id: 'relax' as const,
            title: 'Relax',
            vibe: 'Ambient & Soul',
            activeRing: 'border-2 border-sky-300 ring-2 sm:ring-4 ring-sky-400/50 shadow-[0_0_25px_rgba(56,189,248,0.5),0_15px_35px_rgba(0,0,0,0.9)] scale-[1.04]',
            inactiveRing: 'border border-white/40 ring-1 ring-white/15 hover:border-sky-300 hover:ring-sky-400/30 shadow-[0_12px_30px_rgba(0,0,0,0.8)] hover:scale-[1.02]',
            trackId: 'track-relax-1',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85',
            accentColor: 'text-sky-300',
          },
          {
            id: 'workout' as const,
            title: 'Workout',
            vibe: 'Cardio & Energy',
            activeRing: 'border-2 border-lime-300 ring-2 sm:ring-4 ring-lime-400/50 shadow-[0_0_25px_rgba(163,230,53,0.5),0_15px_35px_rgba(0,0,0,0.9)] scale-[1.04]',
            inactiveRing: 'border border-white/40 ring-1 ring-white/15 hover:border-lime-300 hover:ring-lime-400/30 shadow-[0_12px_30px_rgba(0,0,0,0.8)] hover:scale-[1.02]',
            trackId: 'track-workout-1',
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=85',
            accentColor: 'text-lime-300',
          }
        ];

        const vibeTracks = AURA_TRACKS.filter(t => t.vibes.some(v => v.toLowerCase() === activeVibe));

        return (
          <div className="space-y-5 pt-1">
            {/* 1. HORIZONTAL ROW OF 3 3D VIBE SPHERES (SIDE BY SIDE AT TOP, SLIGHTLY COMPACT) */}
            <div className="flex flex-row items-center justify-center gap-2.5 xs:gap-4 sm:gap-6 md:gap-8 py-2 w-full">
              {VIBES_CONFIG.map(vibe => {
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
                    className={`relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-end p-2 sm:p-4 text-center select-none active:scale-[0.96] ${
                      isActive ? vibe.activeRing : vibe.inactiveRing
                    }`}
                  >
                    {/* Vibrant Full Image */}
                    <img 
                      src={vibe.image} 
                      alt={vibe.title} 
                      className="absolute inset-0 w-full h-full object-cover rounded-full group-hover:scale-106 transition-transform duration-500 pointer-events-none brightness-105 contrast-100" 
                    />

                    {/* Bottom Vignette for text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-14 sm:h-20 bg-gradient-to-t from-black/85 via-black/35 to-transparent rounded-b-full pointer-events-none" />

                    {/* 3D Glass Bubble Specular Reflection */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.08)_28%,transparent_55%)] pointer-events-none" />
                    
                    {/* 3D Sphere Inner Curved Bevel Shadow */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_3px_10px_rgba(255,255,255,0.4),inset_0_-6px_14px_rgba(0,0,0,0.65)] pointer-events-none" />

                    {/* Active Indicator Badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-lime-400/60 shadow-[0_0_10px_rgba(163,230,53,0.5)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_#a3e635]" />
                        <span className="text-[8px] sm:text-[9px] font-mono font-bold text-lime-300 uppercase tracking-wider hidden xs:inline">Active</span>
                      </div>
                    )}

                    {/* Text Details (Title + Subtitle) */}
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5 w-full pointer-events-none">
                      <h3 className="text-xs xs:text-sm sm:text-lg md:text-xl font-black text-white tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] group-hover:text-lime-300 transition-colors font-sans">
                        {vibe.title}
                      </h3>
                      <span className={`px-1.5 xs:px-2 py-0.2 sm:py-0.5 rounded-full bg-slate-950/70 backdrop-blur-sm border border-white/15 text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-mono font-bold tracking-wider uppercase ${vibe.accentColor} shadow-sm truncate max-w-full`}>
                        {vibe.vibe}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. CURATED SONGS LIST FOR THE SELECTED VIBE (CIRCULAR PLAY ON LEFT & LIKE ON RIGHT) */}
            <div className="rounded-[28px] p-4 sm:p-6 bg-slate-950/85 border border-white/10 backdrop-blur-3xl shadow-[0_20px_45px_rgba(0,0,0,0.85)] space-y-3.5 animate-fadeIn">
              
              {/* Header with Title & Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-lime-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                    {activeVibe.toUpperCase()} VIBE PLAYLIST
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ({vibeTracks.length} tracks)
                  </span>
                </div>

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
                    title="Shuffle playlist"
                  >
                    <Shuffle className="w-3 h-3 text-lime-400" />
                    <span className="hidden xs:inline">Shuffle</span>
                  </button>
                </div>
              </div>

              {/* Songs List: Circular Artwork with Play on Left, Like on Right */}
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

                        {/* LEFT: Circular artwork with Play Button Overlay */}
                        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-lime-400/40 ring-2 ring-lime-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                          <img src={track.artistPhoto} alt={track.title} className="w-full h-full object-cover rounded-full" />
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity rounded-full ${
                            isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <Play className="w-3.5 h-3.5 fill-lime-400 text-lime-400 ml-0.5" />
                          </div>
                        </div>

                        {/* CENTER: Track Title & Artist */}
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors font-sans ${isCurrent ? 'text-lime-300' : 'text-white group-hover:text-lime-300'}`}>
                            {track.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-400 truncate font-sans">
                            {track.artist} · <span className="text-slate-500">{track.album}</span>
                          </p>
                        </div>
                      </div>

                      {/* RIGHT: Genre tag, Like Button, and Duration */}
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
      })()}

      '''

code = code[:idx_disc_start] + new_discover_view + code[idx_disc_end:]

# 5. In Sub-View B (Library), add a Back button to return to Vibe Explorer
lib_subview_start = "{/* --- SUB-VIEW B: MY LIBRARY (SONGS LEFT, ALBUMS & ARTISTS CENTER, PLAYLISTS RIGHT) --- */}\n      {activeTab === 'library' && ("
lib_subview_replace = '''{/* --- SUB-VIEW B: MY LIBRARY (SONGS LEFT, ALBUMS & ARTISTS CENTER, PLAYLISTS RIGHT) --- */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <button
              onClick={() => setActiveTab('discover')}
              className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              <span>← Back to Vibe Explorer</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">My Personal Collection</span>
          </div>'''

code = code.replace(lib_subview_start, lib_subview_replace)

with open('src/components/MusicV2View.tsx', 'w') as f:
    f.write(code)

print("Updated successfully!")
