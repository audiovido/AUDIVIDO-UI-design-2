/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Music, Film, Users, Play, Pause, SkipForward, SkipBack, 
  Search, Heart, Flame, Send, Calendar, Check, Radio, VolumeX, Volume2,
  Compass, ArrowLeft, Tv, Library, Compass as BrowseIcon, FolderHeart, Clock, Disc, Upload,
  Shuffle, Repeat, Star, Share2, Bookmark, MoreHorizontal, Maximize2, Minimize2,
  Settings, User, Bell, HelpCircle, LogOut, MessageSquare, Plus, ExternalLink,
  ChevronRight, ChevronLeft, CheckCircle2, Sliders, ThumbsUp, Eye, ShieldCheck, X
} from 'lucide-react';
import { 
  Track, Movie, MovieReview, Actor, SocialPost, LiveStream, AuraEvent, 
  AURA_TRACKS, AURA_MOVIES, AURA_STREAMS, INITIAL_ACTORS, MOVIE_FREAK_OF_MONTH,
  getAvatarColors, INITIAL_SOCIAL_POSTS, INITIAL_AURA_EVENTS
} from './data/auraStore';
import { AudioSynth } from './utils/AudioSynth';
import { CosmicNightSky } from './components/CosmicNightSky';
import { MovieStreamingView } from './components/MovieStreamingView';
import { SocialHubView } from './components/SocialHubView';

// --- BESPOKE 3D SCULPTED EMBLEMS (STANDARD, HARMONIOUS & PROFESSIONAL) ---
function AudioEmblem3D() {
  return (
    <div className="relative w-[70px] h-[70px] sm:w-[78px] sm:h-[78px] flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_24px_rgba(52,211,153,0.55)]">
        <defs>
          {/* Classic Dual-Spring Steel Headband with Emerald Sheen */}
          <linearGradient id="pro-classic-steel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#E2E8F0" />
            <stop offset="60%" stopColor="#6EE7B7" />
            <stop offset="90%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>

          {/* Classic Ribbed Studio Leather Cushion (Subtle Obsidian Depth) */}
          <linearGradient id="pro-classic-leather" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3F3F46" />
            <stop offset="40%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          {/* Precision Steel Slider Gimbal */}
          <linearGradient id="pro-classic-gimbal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Classic Round Studio Earcup Outer Shell (Emerald & Polished Chrome) */}
          <radialGradient id="pro-classic-cup-shell" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#D1FAE5" />
            <stop offset="55%" stopColor="#10B981" />
            <stop offset="85%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* Tactile Leather Earpad Rim (Balanced Subtle Black Contrast) */}
          <radialGradient id="pro-classic-earpad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#52525B" />
            <stop offset="50%" stopColor="#27272A" />
            <stop offset="85%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </radialGradient>

          {/* Classic Center Acoustic Mesh & Glowing Core */}
          <radialGradient id="pro-classic-mesh" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </radialGradient>

          {/* Ambient Aurora Halo (Emerald + Cyan + Starlight) */}
          <radialGradient id="pro-classic-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#34D399" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.18" />
            <stop offset="90%" stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Halo */}
        <circle cx="50" cy="50" r="44" fill="url(#pro-classic-halo)" />

        {/* Ground Depth Shadow */}
        <ellipse cx="50" cy="85" rx="30" ry="4.5" fill="#000000" opacity="0.38" filter="blur(4px)" />

        {/* 1. Classic Twin-Arch Tension Steel Headband */}
        <path 
          d="M18 52 C18 15, 82 15, 82 52" 
          fill="none" 
          stroke="url(#pro-classic-steel)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
        />
        {/* Specular Steel Highlight */}
        <path 
          d="M30 24 C38 16, 62 16, 70 24" 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="1.6" 
          strokeLinecap="round" 
          opacity="0.9" 
          filter="blur(0.4px)" 
        />

        {/* Classic Suspended Padded Headband Cushion (Tangible Studio Leather with subtle ribs) */}
        <path 
          d="M26 48 C26 22, 74 22, 74 48" 
          fill="none" 
          stroke="url(#pro-classic-leather)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />
        {/* Stitching / Rib Accents on Cushion */}
        <path 
          d="M32 30 C38 23, 62 23, 68 30" 
          fill="none" 
          stroke="rgba(255,255,255,0.22)" 
          strokeWidth="1" 
          strokeDasharray="2.5 2.5" 
        />

        {/* 2. Classic Calibrated Slider Gimbals (Machined Steel with Notch Markings) */}
        <g>
          <rect x="15" y="45" width="6" height="11" rx="2" fill="url(#pro-classic-gimbal)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <line x1="16.5" y1="48" x2="19.5" y2="48" stroke="#18181B" strokeWidth="0.8" />
          <line x1="16.5" y1="51" x2="19.5" y2="51" stroke="#18181B" strokeWidth="0.8" />
          <line x1="16.5" y1="54" x2="19.5" y2="54" stroke="#18181B" strokeWidth="0.8" />
        </g>
        <g>
          <rect x="79" y="45" width="6" height="11" rx="2" fill="url(#pro-classic-gimbal)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <line x1="80.5" y1="48" x2="83.5" y2="48" stroke="#18181B" strokeWidth="0.8" />
          <line x1="80.5" y1="51" x2="83.5" y2="51" stroke="#18181B" strokeWidth="0.8" />
          <line x1="80.5" y1="54" x2="83.5" y2="54" stroke="#18181B" strokeWidth="0.8" />
        </g>

        {/* 3. Left Classic Studio Earcup (Circular Tangible Over-Ear with Leather Ring & Emerald Rim) */}
        <g transform="translate(19.5, 63) rotate(-6)">
          {/* Outer Polished Emerald & Chrome Housing */}
          <rect 
            x="-11" 
            y="-15" 
            width="22" 
            height="30" 
            rx="10" 
            fill="url(#pro-classic-cup-shell)" 
            stroke="#FFFFFF" 
            strokeWidth="1.2" 
            filter="drop-shadow(0 4px 10px rgba(0,0,0,0.55))" 
          />
          {/* Tactile Black Leather Cushion Ring (Balanced Subtle Black Depth) */}
          <rect x="-8.5" y="-12.5" width="17" height="25" rx="7.5" fill="url(#pro-classic-earpad)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          {/* Center Acoustic Mesh Basin */}
          <ellipse cx="0" cy="0" rx="5.5" ry="8.5" fill="url(#pro-classic-mesh)" />
          {/* Classic Concentric Steel Audio Ring */}
          <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="none" stroke="#6EE7B7" strokeWidth="0.9" opacity="0.9" />
          {/* Starlight Audio Core */}
          <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" filter="drop-shadow(0 0 4px #34D399)" />
          {/* Chrome Specular Reflection Bevel */}
          <path d="M-8 -13 L-4 -13 L-7 11 L-9 11 Z" fill="#FFFFFF" opacity="0.38" filter="blur(0.5px)" />
        </g>

        {/* 4. Right Classic Studio Earcup (Circular Tangible Over-Ear with Leather Ring & Emerald Rim) */}
        <g transform="translate(80.5, 63) rotate(6)">
          {/* Outer Polished Emerald & Chrome Housing */}
          <rect 
            x="-11" 
            y="-15" 
            width="22" 
            height="30" 
            rx="10" 
            fill="url(#pro-classic-cup-shell)" 
            stroke="#FFFFFF" 
            strokeWidth="1.2" 
            filter="drop-shadow(0 4px 10px rgba(0,0,0,0.55))" 
          />
          {/* Tactile Black Leather Cushion Ring (Balanced Subtle Black Depth) */}
          <rect x="-8.5" y="-12.5" width="17" height="25" rx="7.5" fill="url(#pro-classic-earpad)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          {/* Center Acoustic Mesh Basin */}
          <ellipse cx="0" cy="0" rx="5.5" ry="8.5" fill="url(#pro-classic-mesh)" />
          {/* Classic Concentric Steel Audio Ring */}
          <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="none" stroke="#6EE7B7" strokeWidth="0.9" opacity="0.9" />
          {/* Starlight Audio Core */}
          <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" filter="drop-shadow(0 0 4px #34D399)" />
          {/* Chrome Specular Reflection Bevel */}
          <path d="M4 -13 L8 -13 L6 11 L4 11 Z" fill="#FFFFFF" opacity="0.38" filter="blur(0.5px)" />
        </g>
      </svg>
    </div>
  );
}

function VideoEmblem3D() {
  return (
    <div className="relative w-[70px] h-[70px] sm:w-[78px] sm:h-[78px] flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_24px_rgba(168,85,247,0.55)]">
        <defs>
          {/* Cosmic Violet Modern Cinema Chassis */}
          <linearGradient id="pro-cinema-modern-chassis" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#E9D5FF" />
            <stop offset="55%" stopColor="#A855F7" />
            <stop offset="85%" stopColor="#6B21A8" />
            <stop offset="100%" stopColor="#2E1065" />
          </linearGradient>

          {/* OLED Cinema Screen Surface */}
          <radialGradient id="pro-cinema-screen-oled" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#7E22CE" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#3B0764" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0B0217" stopOpacity="1" />
          </radialGradient>

          {/* Cosmic Violet Aurora Halo */}
          <radialGradient id="pro-video-violet-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#C084FC" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#7E22CE" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Cosmic Violet Video Halo */}
        <circle cx="50" cy="50" r="44" fill="url(#pro-video-violet-halo)" />

        {/* Floating Depth Shadow */}
        <ellipse cx="50" cy="85" rx="30" ry="4.5" fill="#000000" opacity="0.4" filter="blur(4px)" />

        {/* 1. Modern Ultra-Thin Widescreen Floating Chassis */}
        <rect 
          x="16" 
          y="26" 
          width="68" 
          height="46" 
          rx="10" 
          fill="url(#pro-cinema-modern-chassis)" 
          stroke="rgba(255,255,255,0.4)" 
          strokeWidth="1.2" 
          filter="drop-shadow(0 6px 16px rgba(59,7,100,0.55))" 
        />
        
        {/* Top Bevel Specular Sheen (Curved Crystal Reflection) */}
        <path d="M20 28 C20 26.8, 80 26.8, 80 28 L76 32 L24 32 Z" fill="#FFFFFF" opacity="0.65" filter="blur(0.5px)" />

        {/* 2. Inner Ultra-Slim Cinema Bezel */}
        <rect x="20.5" y="30.5" width="59" height="37" rx="6" fill="#080210" stroke="rgba(192,132,252,0.4)" strokeWidth="0.8" />

        {/* 3. Deep OLED Screen Glass Surface */}
        <rect x="22" y="32" width="56" height="34" rx="4.5" fill="url(#pro-cinema-screen-oled)" />

        {/* Subtle Curved Screen Specular Reflection */}
        <path d="M23 33 L46 33 L32 65 L23 65 Z" fill="#FFFFFF" opacity="0.16" filter="blur(0.8px)" />

        {/* 4. Crisp Starlight Cinema Play Icon */}
        <path 
          d="M46 42 L58 49 L46 56 Z" 
          fill="#FFFFFF" 
          filter="drop-shadow(0 0 8px rgba(255,255,255,0.95)) drop-shadow(0 0 14px rgba(192,132,252,0.8))" 
        />

        {/* Modern Minimalist Floating Studio Stand Base */}
        <path d="M44 72 L42 77 L58 77 L56 72 Z" fill="#6B21A8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <ellipse cx="50" cy="77" rx="14" ry="2" fill="#2E1065" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

        {/* Micro Power Node in Corner */}
        <circle cx="74" cy="69" r="1.2" fill="#E879F9" filter="drop-shadow(0 0 3px #C084FC)" />
      </svg>
    </div>
  );
}

function SocialEmblem3D() {
  return (
    <div className="relative w-[70px] h-[70px] sm:w-[78px] sm:h-[78px] flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_24px_rgba(125,211,252,0.65)]">
        <defs>
          {/* Luminous Frosted White & Pale Sky Blue Center Avatar */}
          <linearGradient id="pro-avatar-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="20%" stopColor="#E0F2FE" stopOpacity="0.98" />
            <stop offset="55%" stopColor="#BAE6FD" stopOpacity="0.95" />
            <stop offset="82%" stopColor="#7DD3FC" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
          </linearGradient>

          {/* Secondary Avatar Glass for Flanking Figures - Crisp & Distinct */}
          <linearGradient id="pro-avatar-flank" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#F0F9FF" stopOpacity="0.96" />
            <stop offset="60%" stopColor="#BAE6FD" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.88" />
          </linearGradient>

          {/* Luminous Pale Sky Blue Aurora Halo */}
          <radialGradient id="pro-social-aurora-halo" cx="50%" cy="52%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#E0F2FE" stopOpacity="0.40" />
            <stop offset="65%" stopColor="#7DD3FC" stopOpacity="0.25" />
            <stop offset="90%" stopColor="#0284C7" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Aurora Halo */}
        <circle cx="50" cy="52" r="44" fill="url(#pro-social-aurora-halo)" />

        {/* Floating Depth Shadow */}
        <ellipse cx="50" cy="87" rx="30" ry="4.5" fill="#000000" opacity="0.35" filter="blur(4px)" />

        {/* Connected Neural Constellation Beam */}
        <path d="M26 53 Q 50 65 74 53" fill="none" stroke="#7DD3FC" strokeWidth="2.2" opacity="0.95" filter="drop-shadow(0 0 4px #38BDF8)" />
        <circle cx="26" cy="53" r="2.5" fill="#FFFFFF" filter="drop-shadow(0 0 3px #BAE6FD)" />
        <circle cx="50" cy="59" r="2.8" fill="#FFFFFF" filter="drop-shadow(0 0 4px #E0F2FE)" />
        <circle cx="74" cy="53" r="2.5" fill="#FFFFFF" filter="drop-shadow(0 0 3px #BAE6FD)" />

        {/* 1. LEFT FLANKING FIGURE (Crisply Visible & Distinct) */}
        <g filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
          <circle cx="26" cy="38" r="8.5" fill="url(#pro-avatar-flank)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
          <ellipse cx="24" cy="35" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.85" />
          <path d="M12 73 C12 56, 40 56, 40 73 Z" fill="url(#pro-avatar-flank)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <path d="M15 70 C17 60, 36 60, 38 70" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
        </g>

        {/* 2. RIGHT FLANKING FIGURE (Crisply Visible & Distinct) */}
        <g filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
          <circle cx="74" cy="38" r="8.5" fill="url(#pro-avatar-flank)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
          <ellipse cx="72" cy="35" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.85" />
          <path d="M60 73 C60 56, 88 56, 88 73 Z" fill="url(#pro-avatar-flank)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <path d="M62 70 C64 60, 83 60, 85 70" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
        </g>

        {/* 3. CENTER PRIMARY FIGURE (Volumetric 3D Foreground Leader) */}
        <g filter="drop-shadow(0 6px 12px rgba(0,0,0,0.45))">
          <circle cx="50" cy="32" r="11" fill="url(#pro-avatar-glass)" stroke="#FFFFFF" strokeWidth="1.2" />
          <ellipse cx="46.5" cy="28" rx="5" ry="2.8" fill="#FFFFFF" opacity="0.95" />
          <path d="M31 75 C31 53, 69 53, 69 75 Z" fill="url(#pro-avatar-glass)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.1" />
          <circle cx="50" cy="62" r="2.5" fill="#FFFFFF" filter="drop-shadow(0 0 5px #BAE6FD)" />
          <path d="M34 71 C38 56, 62 56, 66 71" fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  // Real Audio Player Reference & Local File Support
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string>('/audio/coffee_bars.mp3');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Navigation State: 'portal' | 'music' | 'movie' | 'community'
  const [currentWorld, setCurrentWorld] = useState<'portal' | 'music' | 'movie' | 'community'>('portal');
  
  // Transition triggers
  const [isTraveling, setIsTraveling] = useState<boolean>(false);
  const [travelDestination, setTravelDestination] = useState<string>('');

  // Sub-navigation Tabs inside other worlds
  const [movieTab, setMovieTab] = useState<'catalog' | 'player' | 'connect'>('catalog');
  const [communityTab, setCommunityTab] = useState<'chat' | 'realms' | 'live' | 'events'>('chat');

  // Cinema Hardware & Filter states
  const [projectorRatio, setProjectorRatio] = useState<'16:9' | '2.39:1'>('2.39:1');
  const [isShutterOpen, setIsShutterOpen] = useState<boolean>(true);
  const [cinemaPreset, setCinemaPreset] = useState<'blackout' | 'velvet' | 'twilight' | 'lounge'>('velvet');
  const [movieGenreFilter, setMovieGenreFilter] = useState<string>('all');

  // Sandro-inspired Left Sidebar active filter state
  const [activeMusicCategory, setActiveMusicCategory] = useState<'all' | 'lofi' | 'ambient' | 'fireplace'>('all');

  // Unified Playing State
  const [currentTrack, setCurrentTrack] = useState<Track>(AURA_TRACKS[0]);
  const [likedTracks, setLikedTracks] = useState<Record<string, boolean>>({ 'track-coffee-bars': true, 'track-1': true });
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [turntableSpeed, setTurntableSpeed] = useState<'33' | '45'>('33');
  const [turntablePitch, setTurntablePitch] = useState<number>(0);

  const toggleLikeTrack = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedTracks(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };

  const [currentMovie, setCurrentMovie] = useState<Movie>(AURA_MOVIES[0]);
  const [actorsList, setActorsList] = useState<Actor[]>(INITIAL_ACTORS);
  const [watchlistIds, setWatchlistIds] = useState<Record<string, boolean>>({
    'movie-spiderman': true
  });
  const [movieFilterCategory, setMovieFilterCategory] = useState<string>('all');
  const [activeMovieMenuModal, setActiveMovieMenuModal] = useState<'settings' | 'account' | 'notifications' | 'help' | null>(null);
  const [activeMenuSelection, setActiveMenuSelection] = useState<string>('settings');
  const [isMovieVideoPlaying, setIsMovieVideoPlaying] = useState<boolean>(false);
  const [moviePlaySeconds, setMoviePlaySeconds] = useState<number>(0);
  const [isMovieMuted, setIsMovieMuted] = useState<boolean>(false);
  const [isMovieFullscreen, setIsMovieFullscreen] = useState<boolean>(false);
  const [likedReviewIds, setLikedReviewIds] = useState<Record<string, boolean>>({ 'rev-1': true });
  const [bookmarkedReviewIds, setBookmarkedReviewIds] = useState<Record<string, boolean>>({});
  const [movieToast, setMovieToast] = useState<string | null>(null);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [movieReviewsMap, setMovieReviewsMap] = useState<Record<string, MovieReview[]>>({});

  const showMovieToast = (msg: string) => {
    setMovieToast(msg);
    setTimeout(() => {
      setMovieToast(null);
    }, 2800);
  };

  const toggleWatchlist = (movieId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willAdd = !watchlistIds[movieId];
    setWatchlistIds(prev => ({
      ...prev,
      [movieId]: willAdd
    }));
    showMovieToast(willAdd ? 'Added to Watch Later' : 'Removed from Watch Later');
  };

  const toggleFollowActor = (actorId: string, actorName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActorsList(prev => prev.map(act => {
      if (act.id === actorId) {
        const nextState = !act.isFollowing;
        showMovieToast(nextState ? `Following ${actorName}` : `Unfollowed ${actorName}`);
        return { ...act, isFollowing: nextState };
      }
      return act;
    }));
  };

  const toggleLikeReview = (reviewId: string) => {
    setLikedReviewIds(prev => {
      const nextState = !prev[reviewId];
      showMovieToast(nextState ? 'Liked review' : 'Unliked review');
      return { ...prev, [reviewId]: nextState };
    });
  };

  const toggleBookmarkReview = (reviewId: string) => {
    setBookmarkedReviewIds(prev => {
      const nextState = !prev[reviewId];
      showMovieToast(nextState ? 'Review bookmarked' : 'Bookmark removed');
      return { ...prev, [reviewId]: nextState };
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev: MovieReview = {
      id: `rev-${Date.now()}`,
      author: 'You (Aura Critic)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      time: 'Just now',
      rating: newReviewRating,
      text: newReviewText.trim(),
      likes: 1,
      comments: 0
    };
    setMovieReviewsMap(prev => ({
      ...prev,
      [currentMovie.id]: [newRev, ...(prev[currentMovie.id] || currentMovie.reviews || [])]
    }));
    setNewReviewText('');
    showMovieToast('Review submitted successfully!');
  };

  // Movie playback timer simulation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isMovieVideoPlaying) {
      timer = setInterval(() => {
        setMoviePlaySeconds(prev => (prev >= 7200 ? 0 : prev + 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMovieVideoPlaying]);

  const formatMovieTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingFireplace, setIsPlayingFireplace] = useState<boolean>(false);
  const [trackProgress, setTrackProgress] = useState<number>(35); // %
  const [movieProgress, setMovieProgress] = useState<number>(60); // %

  // Glass Connect Controllers
  const [lightDimmers, setLightDimmers] = useState<number>(100); 
  const [lightWarmth, setLightWarmth] = useState<number>(20); 
  const [ambientVolume, setAmbientVolume] = useState<number>(60); 

  // Interactive feeds
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [eventsList, setEventsList] = useState<AuraEvent[]>(INITIAL_AURA_EVENTS);
  const [movieSearch, setMovieSearch] = useState<string>('');
  const [musicSearch, setMusicSearch] = useState<string>('');
  const [musicNavTab, setMusicNavTab] = useState<'explore' | 'library'>('explore');
  const [chatMessageText, setChatMessageText] = useState<string>('');
  const [attachedTrackId, setAttachedTrackId] = useState<string>('');

  // Canvas refs
  const freqCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const movieCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const movieAnimFrame = useRef<number | null>(null);
  const musicAnimFrame = useRef<number | null>(null);

  // Custom audio file upload handler (e.g. for user's uploaded "1 minute final.mp3")
  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCurrentTrack(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Your Uploaded Music (Local File)'
      }));
      setIsPlaying(true);
      AudioSynth.stopAll();
      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.play().catch(e => console.log('Audio playback started:', e));
        }
      }, 60);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current && audioPlayerRef.current.duration) {
      const pct = (audioPlayerRef.current.currentTime / audioPlayerRef.current.duration) * 100;
      setTrackProgress(pct);
    }
  };

  const handleSeek = (newPct: number) => {
    setTrackProgress(newPct);
    if (audioPlayerRef.current && audioPlayerRef.current.duration) {
      audioPlayerRef.current.currentTime = (newPct / 100) * audioPlayerRef.current.duration;
    }
  };

  // Sync volume with Web Audio synth & HTML5 Audio
  useEffect(() => {
    AudioSynth.setVolume(ambientVolume / 100);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = ambientVolume / 100;
    }
  }, [ambientVolume]);

  // Sync playing states with real audio and ambient generators
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (isPlaying) {
      if (currentWorld === 'music') {
        if (customAudioUrl && customAudioUrl.startsWith('blob:') && audio) {
          AudioSynth.stopAll();
          AudioSynth.connectMediaElement(audio);
          audio.play().catch(e => console.log('Audio autoplay handled:', e));
        } else {
          if (audio) audio.pause();
          AudioSynth.playTrack(currentTrack.audioSynthType || 'aura-lofi');
        }
      } else if (currentWorld === 'movie') {
        if (audio) audio.pause();
        AudioSynth.playTrack('movie');
      } else {
        if (audio) audio.pause();
        AudioSynth.playTrack('music');
      }
    } else {
      if (audio) audio.pause();
      AudioSynth.stopAll();
      setIsPlayingFireplace(false);
    }
  }, [isPlaying, currentWorld, currentTrack, customAudioUrl]);

  // Track progress timers for non-audio sources
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentWorld !== 'music') {
      interval = setInterval(() => {
        setTrackProgress(p => (p >= 100 ? 0 : p + 0.6));
        setMovieProgress(p => (p >= 100 ? 0 : p + 0.35));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentWorld]);

  // --- TRANSITIONAL ZOOM PORTAL TRAVEL ---
  const handleTravel = (destination: 'portal' | 'music' | 'movie' | 'community') => {
    setIsTraveling(true);
    setTravelDestination(destination);

    if (destination !== 'portal') {
      if (destination === 'music') {
        // Normal music tab entry: Needle points down in silver rest, disc still, music waits for selection
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
        AudioSynth.stopAll();
        setIsPlaying(false);
      } else if (destination === 'movie') {
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
        AudioSynth.playTrack('movie');
        setIsPlaying(true);
      } else {
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
        AudioSynth.playTrack('music');
        setIsPlaying(true);
      }
    } else {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setIsPlaying(false);
      AudioSynth.stopAll();
    }

    setTimeout(() => {
      setCurrentWorld(destination);
      setIsTraveling(false);
      setTravelDestination('');
    }, 800);
  };

  const handleMuteAll = () => {
    setIsPlaying(false);
    AudioSynth.stopAll();
    setIsPlayingFireplace(false);
  };

  const handleToggleFireplace = () => {
    if (isPlayingFireplace) {
      AudioSynth.stopAll();
      setIsPlayingFireplace(false);
      setIsPlaying(false);
    } else {
      AudioSynth.playTrack('fireplace');
      setIsPlayingFireplace(true);
      setIsPlaying(true);
      setAmbientVolume(70);
    }
  };

  // --- POST ACTION FORM ---
  const handleSendPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author: 'Aura Explorer',
      handle: '@explorer',
      avatarSeed: 'guest',
      content: chatMessageText,
      timestamp: 'Just now',
      reactions: { love: 0, fire: 0, star: 0 },
      hasReacted: { love: false, fire: false, star: false },
      attachedTrackId: attachedTrackId || undefined
    };

    setSocialPosts([newPost, ...socialPosts]);
    setChatMessageText('');
    setAttachedTrackId('');
  };

  const handlePostReact = (postId: string, type: 'love' | 'fire' | 'star') => {
    setSocialPosts(posts => 
      posts.map(p => {
        if (p.id !== postId) return p;
        const active = p.hasReacted[type];
        return {
          ...p,
          reactions: { ...p.reactions, [type]: active ? p.reactions[type] - 1 : p.reactions[type] + 1 },
          hasReacted: { ...p.hasReacted, [type]: !active }
        };
      })
    );
  };

  const handleToggleRSVP = (eventId: string) => {
    setEventsList(evs => 
      evs.map(ev => {
        if (ev.id !== eventId) return ev;
        const going = ev.rsvpStatus === 'going';
        return {
          ...ev,
          rsvpStatus: going ? 'not_going' : 'going',
          attendeesCount: going ? ev.attendeesCount - 1 : ev.attendeesCount + 1
        };
      })
    );
  };

  const selectAndPlayTrack = (track: Track) => {
    setCurrentTrack(track);
    if (audioPlayerRef.current && customAudioUrl.startsWith('blob:') && track.id === 'track-coffee-bars') {
      AudioSynth.stopAll();
      audioPlayerRef.current.play().catch(e => console.log('Audio play error:', e));
    } else {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      AudioSynth.playTrack(track.audioSynthType);
    }
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      const remainingTracks = AURA_TRACKS.filter(t => t.id !== currentTrack.id);
      const randomTrack = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
      selectAndPlayTrack(randomTrack || AURA_TRACKS[0]);
    } else {
      const currentIdx = AURA_TRACKS.findIndex(t => t.id === currentTrack.id);
      const nextIdx = (currentIdx + 1) % AURA_TRACKS.length;
      selectAndPlayTrack(AURA_TRACKS[nextIdx]);
    }
  };

  const handlePrevTrack = () => {
    const currentIdx = AURA_TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (currentIdx - 1 + AURA_TRACKS.length) % AURA_TRACKS.length;
    selectAndPlayTrack(AURA_TRACKS[prevIdx]);
  };

  const selectAndPlayMovie = (movie: Movie) => {
    setCurrentMovie(movie);
    setMovieTab('player');
    AudioSynth.playTrack('movie');
    setIsPlaying(true);
  };

  const filteredMovies = AURA_MOVIES.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
      m.genre.toLowerCase().includes(movieSearch.toLowerCase());
    const matchesGenre = movieGenreFilter === 'all' || 
      m.genre.toLowerCase().includes(movieGenreFilter.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  // Filter track catalog list based on category, library tab, and search query
  const getFilteredTracks = () => {
    let tracks = AURA_TRACKS;
    if (musicNavTab === 'library') {
      tracks = tracks.filter(t => likedTracks[t.id]);
    } else if (activeMusicCategory !== 'all') {
      if (activeMusicCategory === 'lofi') tracks = tracks.filter(t => t.genre.toLowerCase().includes('lofi') || t.title.toLowerCase().includes('lofi') || t.genre.toLowerCase().includes('chill'));
      if (activeMusicCategory === 'ambient') tracks = tracks.filter(t => t.genre.toLowerCase().includes('ambient') || t.genre.toLowerCase().includes('drone'));
      if (activeMusicCategory === 'fireplace') tracks = tracks.filter(t => t.audioSynthType === 'fireplace');
    }
    if (musicSearch.trim()) {
      const q = musicSearch.toLowerCase();
      tracks = tracks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) || 
        t.genre.toLowerCase().includes(q)
      );
    }
    return tracks;
  };

  // --- CANVAS: DYNAMIC AUDIO-REACTIVE ANALOG FREQUENCY WAVEFORM ---
  useEffect(() => {
    if (currentWorld !== 'music') {
      if (musicAnimFrame.current) cancelAnimationFrame(musicAnimFrame.current);
      return;
    }

    const canvas = freqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 70;

    let phase = 0;

    const renderCozySinewave = () => {
      // Pure transparent background so the soft aurora mist floats seamlessly in the bottom bar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const freqData = AudioSynth.getFrequencyData();
      const timeData = AudioSynth.getTimeDomainData();

      // Extract real audio frequency bands
      let bassEnergy = 0;
      let midEnergy = 0;
      let trebleEnergy = 0;

      if (freqData && isPlaying) {
        // Bass bins 0..7
        for (let i = 0; i < 8; i++) bassEnergy += freqData[i] || 0;
        bassEnergy = bassEnergy / (8 * 255); // 0 to 1

        // Mid bins 8..31
        for (let i = 8; i < 32; i++) midEnergy += freqData[i] || 0;
        midEnergy = midEnergy / (24 * 255);

        // Treble bins 32..63
        for (let i = 32; i < 64; i++) trebleEnergy += freqData[i] || 0;
        trebleEnergy = trebleEnergy / (32 * 255);
      }

      // Dynamic phase speed based on music rhythm and frequency energy
      const waveSpeed = isPlaying ? (0.025 + bassEnergy * 0.08 + midEnergy * 0.035) : 0.006;
      phase += waveSpeed;

      // Authentic Northern Lights (Aurora Borealis) waveform layers: Emerald Green, Cosmic Violet/Purple, and Deep Dark Tones
      const layers = [
        { 
          stroke: 'rgba(52, 211, 153, 0.95)',  // Aurora Emerald Green
          glow: 'rgba(16, 185, 129, 0.9)', 
          blur: 10,
          width: 2.4, 
          mult: 1.0, 
          freqShift: 0 
        },
        { 
          stroke: 'rgba(192, 132, 252, 0.92)', // Cosmic Northern Violet / Purple
          glow: 'rgba(168, 85, 247, 0.85)', 
          blur: 8,
          width: 1.9, 
          mult: 0.8, 
          freqShift: 1.35 
        },
        { 
          stroke: 'rgba(5, 150, 105, 0.75)',   // Deep Dark Aurora Emerald / Forest
          glow: 'rgba(4, 120, 87, 0.65)', 
          blur: 6,
          width: 1.4, 
          mult: 0.6, 
          freqShift: 2.7 
        },
        { 
          stroke: 'rgba(126, 34, 206, 0.65)',  // Deep Velvet Dark Purple / Cosmic Night
          glow: 'rgba(88, 28, 135, 0.55)', 
          blur: 4,
          width: 1.2, 
          mult: 0.45, 
          freqShift: 4.1 
        }
      ];

      layers.forEach((layer) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = layer.width;
        ctx.strokeStyle = layer.stroke;
        ctx.shadowColor = layer.glow;
        ctx.shadowBlur = layer.blur;

        const dynamicAmp = isPlaying ? (5 + bassEnergy * 24 * layer.mult + midEnergy * 8) : 2.5;

        for (let x = 0; x < canvas.width; x++) {
          const sampleIdx = timeData ? Math.floor((x / canvas.width) * timeData.length) : 0;
          const rawWave = (timeData && isPlaying) ? ((timeData[sampleIdx] - 128) / 128) * 14 * layer.mult : 0;

          const freqOffset = Math.sin(x * (0.02 + trebleEnergy * 0.015) + phase + layer.freqShift) * dynamicAmp;
          const harmonic = Math.sin(x * 0.045 + phase * 1.6) * (bassEnergy * 8);

          const y = canvas.height / 2 + freqOffset + rawWave + harmonic;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // Frequency peak spark particles jumping to beats (Aurora starlight sparkles in emerald & violet)
      if (isPlaying && bassEnergy > 0.06) {
        const count = Math.min(8, Math.floor(3 + bassEnergy * 8));
        for (let p = 0; p < count; p++) {
          const isGreen = p % 2 === 0;
          ctx.fillStyle = isGreen ? `rgba(52, 211, 153, ${0.5 + bassEnergy * 0.5})` : `rgba(192, 132, 252, ${0.5 + bassEnergy * 0.5})`;
          ctx.shadowColor = isGreen ? '#34d399' : '#c084fc';
          ctx.shadowBlur = 6;
          const px = (phase * 35 + p * (canvas.width / count)) % canvas.width;
          const py = canvas.height / 2 + Math.sin(px * 0.03 + phase) * (6 + bassEnergy * 16) + (isGreen ? -1 : 1) * (bassEnergy * 6);
          ctx.beginPath();
          ctx.arc(px, py, 1.2 + bassEnergy * 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      musicAnimFrame.current = requestAnimationFrame(renderCozySinewave);
    };

    renderCozySinewave();
    return () => {
      if (musicAnimFrame.current) cancelAnimationFrame(musicAnimFrame.current);
    };
  }, [currentWorld, isPlaying]);

  // --- CANVAS: CINEMATIC SPACE CRUISER (MOVIE WORLD) ---
  useEffect(() => {
    if (currentWorld !== 'movie' || movieTab !== 'player') {
      if (movieAnimFrame.current) cancelAnimationFrame(movieAnimFrame.current);
      return;
    }

    const canvas = movieCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 750;
    canvas.height = 420;

    const stars: { x: number; y: number; z: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        speed: 1.6 + Math.random() * 2.6,
        size: 0.5 + Math.random() * 1.8
      });
    }

    let angle = 0;
    let sparks: { x: number; y: number; size: number; alpha: number; speedX: number; speedY: number }[] = [];

    const renderSpaceCinema = () => {
      ctx.fillStyle = 'rgba(3, 1, 7, 0.22)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 20,
        canvas.width / 2, canvas.height / 2, 260
      );
      nebula.addColorStop(0, 'rgba(3, 242, 165, 0.1)'); 
      nebula.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)'); 
      nebula.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.z -= star.speed;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const px = (star.x / star.z) * canvas.width * 0.75 + canvas.width / 2;
        const py = (star.y / star.z) * canvas.height * 0.75 + canvas.height / 2;
        const r = (1 - star.z / canvas.width) * star.size * 2.2;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(3, 242, 165, ${0.3 + (1 - star.z / canvas.width) * 0.7})`;
          ctx.fill();
        }
      });

      angle += 0.012;
      const shipX = canvas.width / 2 + Math.sin(angle) * 140;
      const shipY = canvas.height / 2 + Math.cos(angle * 1.5) * 35;

      if (isPlaying) {
        sparks.push({
          x: shipX - 30,
          y: shipY + (Math.random() * 4 - 2),
          size: 1 + Math.random() * 3.5,
          alpha: 1.0,
          speedX: -2.8 - Math.random() * 2.5,
          speedY: Math.random() * 1.2 - 0.6
        });
      }

      sparks = sparks.filter(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.045;
        if (p.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 63, 94, ${p.alpha})`; 
        ctx.fill();
        return true;
      });

      ctx.save();
      ctx.translate(shipX, shipY);
      ctx.rotate(Math.cos(angle) * 0.18); 

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(35, 0); 
      ctx.lineTo(-15, -12); 
      ctx.lineTo(-10, -3);
      ctx.lineTo(-18, 0); 
      ctx.lineTo(-10, 3);
      ctx.lineTo(-15, 12); 
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#06b6d4'; 
      ctx.beginPath();
      ctx.moveTo(15, -2);
      ctx.lineTo(24, 0);
      ctx.lineTo(15, 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#03f2a5'; 
      ctx.fillRect(-18, -13, 3, 2);
      ctx.fillRect(-18, 11, 3, 2);

      ctx.restore();

      movieAnimFrame.current = requestAnimationFrame(renderSpaceCinema);
    };

    renderSpaceCinema();
    return () => {
      if (movieAnimFrame.current) cancelAnimationFrame(movieAnimFrame.current);
    };
  }, [currentWorld, movieTab, isPlaying]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden select-none aurora-bg transition-colors duration-1000">
      
      {/* GLOBAL COSMIC NIGHT SKY & AURORA BOREALIS & DYNAMIC METEORS */}
      <CosmicNightSky isPortal={currentWorld === 'portal'} />

      {/* --- TOP BRANDING NAV BAR (COMPACT & COLORFUL) --- */}
      <header className="relative z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 shrink-0">
        
        {/* Brand Home Capsule */}
        <button 
          onClick={() => handleTravel('portal')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/15 border border-emerald-500/30 text-xs font-black tracking-widest text-white font-mono hover:border-emerald-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">AURA</span>
        </button>

        {/* Space-Efficient Harmonious Jewel Navigation Chips */}
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
          <button 
            onClick={() => handleTravel('portal')} 
            className={`jewel-chip ${currentWorld === 'portal' ? 'jewel-chip-active-emerald' : 'text-slate-300'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#10b981]" />
            <span>PORTAL</span>
          </button>
          <button 
            onClick={() => handleTravel('music')} 
            className={`jewel-chip ${currentWorld === 'music' ? 'jewel-chip-active-emerald-teal' : 'text-slate-300'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399]" />
            <span>AUDIO</span>
          </button>
          <button 
            onClick={() => handleTravel('movie')} 
            className={`jewel-chip ${currentWorld === 'movie' ? 'jewel-chip-active-violet' : 'text-slate-300'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shadow-[0_0_6px_#c084fc]" />
            <span>VIDEO</span>
          </button>
          <button 
            onClick={() => handleTravel('community')} 
            className={`jewel-chip ${currentWorld === 'community' ? 'jewel-chip-active-frost-white' : 'text-slate-300'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block shadow-[0_0_6px_#ffffff]" />
            <span>SOCIAL</span>
          </button>
        </nav>

        {/* Compact Right Control Pill */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMuteAll}
            className="p-1.5 px-2.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-white transition-all text-[10px] font-mono flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Mute sounds"
          >
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-[9px] font-bold">MUTE</span>
          </button>
        </div>
      </header>

      {/* Real HTML5 Audio Player */}
      <audio 
        ref={audioPlayerRef} 
        src={customAudioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => setIsPlaying(false)} 
        className="hidden" 
        preload="auto" 
      />

      {/* --- MASTER VIEWPORT CONTEXT --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center items-center relative z-10">

        {/* ========================================================= */}
        {/* === VIEW 1: PORTAL MAIN MENU (STABLE TRIAD LIQUID GLASS ORBS) === */}
        {/* ========================================================= */}
        {currentWorld === 'portal' && (
          <div className="w-full max-w-4xl animate-fadeIn flex flex-col items-center justify-center min-h-[600px] relative">
            
            {/* Majestic Authoritative Downward-Pointing Triad Layout */}
            <div className="relative w-full max-w-[700px] h-[550px] flex items-center justify-center">

              {/* 1. TOP-LEFT: AUDIO ORB (Emerald & Pale Teal Liquid Glass with Bright Studio Headphones & Breathing Aurora Corona) */}
              <div className="absolute top-[3%] left-[5%] sm:left-[7%] flex flex-col items-center float-node-audio z-20 group">
                <div className="relative flex items-center justify-center">
                  <div className="bubble-ground-shadow" />
                  {/* Living Breathing Aurora Corona Flares (Soft Pulsing Aurora Ethereal Emission) */}
                  <div className="absolute -inset-5 sm:-inset-6 rounded-full bg-gradient-to-tr from-emerald-400/30 via-teal-300/25 to-white/20 aurora-corona-pulse-1" />
                  <div className="absolute -inset-7 sm:-inset-8 rounded-full bg-gradient-to-br from-teal-400/20 via-cyan-300/15 to-emerald-500/15 aurora-corona-pulse-2" />
                  <button 
                    onClick={() => handleTravel('music')}
                    className="w-48 h-48 sm:w-[216px] sm:h-[216px] rounded-full liquid-glass-orb orb-theme-audio hover:scale-106 active:scale-95 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl transition-all duration-500"
                  >
                    {/* Plasma Flow */}
                    <div className="orb-plasma-liquid bg-gradient-to-tr from-emerald-400/25 via-teal-300/30 to-transparent" />
                    
                    {/* Harmonious Optical Ax-to-Ax Alignment */}
                    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pt-1.5 pb-2">
                      <div className="transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1">
                        <AudioEmblem3D />
                      </div>
                      <div className="mt-2 flex flex-col items-center justify-center">
                        <span className="text-[14px] sm:text-[15.5px] font-black tracking-[0.26em] uppercase font-sans bg-gradient-to-b from-white via-emerald-100 to-teal-200/90 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(16,185,129,0.85)] pl-0.5 select-none transition-all duration-300 group-hover:tracking-[0.3em] group-hover:drop-shadow-[0_2px_14px_rgba(52,211,153,1)]">
                          AUDIO
                        </span>
                        <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent mt-1.5 opacity-75 group-hover:w-14 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. TOP-RIGHT: VIDEO ORB (Cosmic Violet Liquid Glass with Modern Cinema Display & Breathing Aurora Corona) */}
              <div className="absolute top-[3%] right-[5%] sm:right-[7%] flex flex-col items-center float-node-video z-20 group">
                <div className="relative flex items-center justify-center">
                  <div className="bubble-ground-shadow" />
                  {/* Living Breathing Aurora Corona Flares (Soft Pulsing Cosmic Violet Ethereal Emission) */}
                  <div className="absolute -inset-5 sm:-inset-6 rounded-full bg-gradient-to-tr from-purple-500/30 via-violet-400/25 to-white/20 aurora-corona-pulse-1" />
                  <div className="absolute -inset-7 sm:-inset-8 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-400/15 to-purple-600/15 aurora-corona-pulse-2" />
                  <button 
                    onClick={() => handleTravel('movie')}
                    className="w-48 h-48 sm:w-[216px] sm:h-[216px] rounded-full liquid-glass-orb orb-theme-video hover:scale-106 active:scale-95 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl transition-all duration-500"
                  >
                    <div className="orb-plasma-liquid bg-gradient-to-tr from-purple-400/25 via-violet-300/30 to-transparent" />
                    
                    {/* Harmonious Optical Ax-to-Ax Alignment */}
                    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pt-1.5 pb-2">
                      <div className="transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1">
                        <VideoEmblem3D />
                      </div>
                      <div className="mt-2 flex flex-col items-center justify-center">
                        <span className="text-[14px] sm:text-[15.5px] font-black tracking-[0.26em] uppercase font-sans bg-gradient-to-b from-white via-purple-100 to-purple-300/90 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.85)] pl-0.5 select-none transition-all duration-300 group-hover:tracking-[0.3em] group-hover:drop-shadow-[0_2px_14px_rgba(192,132,252,1)]">
                          VIDEO
                        </span>
                        <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-1.5 opacity-75 group-hover:w-14 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. BOTTOM-CENTER: SOCIAL HUB ORB (Luminous Frosted White & Pale Sky Blue Liquid Glass with Breathing Aurora Corona) */}
              <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex flex-col items-center float-node-social z-20 group">
                <div className="relative flex items-center justify-center">
                  <div className="bubble-ground-shadow" />
                  {/* Living Breathing Aurora Corona Flares (Soft Pulsing Pale Sky Blue & White Ethereal Emission) */}
                  <div className="absolute -inset-5 sm:-inset-6 rounded-full bg-gradient-to-tr from-white/35 via-sky-200/35 to-blue-300/25 aurora-corona-pulse-1" />
                  <div className="absolute -inset-7 sm:-inset-8 rounded-full bg-gradient-to-br from-sky-400/20 via-cyan-200/20 to-white/25 aurora-corona-pulse-2" />
                  <button 
                    onClick={() => handleTravel('community')}
                    className="w-48 h-48 sm:w-[216px] sm:h-[216px] rounded-full liquid-glass-orb orb-theme-social hover:scale-106 active:scale-95 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl transition-all duration-500"
                  >
                    <div className="orb-plasma-liquid bg-gradient-to-tr from-white/30 via-sky-200/30 to-transparent" />
                    
                    {/* Harmonious Optical Ax-to-Ax Alignment */}
                    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pt-1.5 pb-2">
                      <div className="transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1">
                        <SocialEmblem3D />
                      </div>
                      <div className="mt-2 flex flex-col items-center justify-center">
                        <span className="text-[14px] sm:text-[15.5px] font-black tracking-[0.26em] uppercase font-sans bg-gradient-to-b from-white via-sky-100 to-sky-200 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(125,211,252,0.85)] pl-0.5 select-none transition-all duration-300 group-hover:tracking-[0.3em] group-hover:drop-shadow-[0_2px_14px_rgba(56,189,248,1)]">
                          SOCIAL
                        </span>
                        <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent mt-1.5 opacity-85 group-hover:w-14 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.85)]" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* === VIEW 2: STANDALONE WIDESCREEN MUSIC WORLD (AUDIO) === */}
        {/* ========================================================= */}
        {currentWorld === 'music' && (
          <div className="w-full max-w-6xl space-y-6 animate-fadeIn py-2 pb-36 relative">
            
            {/* Top Standard Music Streaming Navigation Bar (Rounded Pills & Full Curves) */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-full bg-slate-950/35 border border-white/10 backdrop-blur-2xl shrink-0 shadow-lg">
              
              {/* Left Navigation: Explore, Stations Filter Pills, Library */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button 
                  onClick={() => { setMusicNavTab('explore'); setActiveMusicCategory('all'); }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    musicNavTab === 'explore' && activeMusicCategory === 'all'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <BrowseIcon className="w-3.5 h-3.5" />
                  <span>Explore</span>
                </button>

                <button 
                  onClick={() => { setMusicNavTab('explore'); setActiveMusicCategory('lofi'); }} 
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    musicNavTab === 'explore' && activeMusicCategory === 'lofi' 
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  Lo-Fi Beats
                </button>

                <button 
                  onClick={() => { setMusicNavTab('explore'); setActiveMusicCategory('ambient'); }} 
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    musicNavTab === 'explore' && activeMusicCategory === 'ambient' 
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  Ambient Space
                </button>

                <button 
                  onClick={() => { setMusicNavTab('explore'); setActiveMusicCategory('fireplace'); }} 
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    musicNavTab === 'explore' && activeMusicCategory === 'fireplace' 
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  Hearth Fireside
                </button>

                <button 
                  onClick={() => setMusicNavTab('library')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    musicNavTab === 'library'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <FolderHeart className="w-3.5 h-3.5" />
                  <span>My Library</span>
                </button>
              </div>

              {/* Center/Right: Live Music Search Bar & My Profile Button */}
              <div className="flex items-center gap-2.5 flex-1 max-w-sm justify-end">
                <div className="relative w-full max-w-[210px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    type="text"
                    value={musicSearch}
                    onChange={(e) => setMusicSearch(e.target.value)}
                    placeholder="Search tracks, artists..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                  />
                  {musicSearch && (
                    <button 
                      onClick={() => setMusicSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* My Profile Button Capsule */}
                <button 
                  onClick={() => handleTravel('community')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
                  title="My Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-slate-950 shadow-sm">
                    A
                  </div>
                  <span className="hidden sm:inline">My Profile</span>
                </button>
              </div>

            </div>

            {/* Main Streaming Grid: Bold Hero Turntable Deck on Left, Up Next Queue Sidebar on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
              
              {/* LEFT: Curated Amber Hero Deck with BOLD Gramophone (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                
                {/* Hero Card */}
                <div className="relative rounded-[36px] bg-gradient-to-tr from-amber-600/85 via-amber-700/80 to-orange-500/85 p-7 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl h-full">
                  
                  {/* Subtle vector stardust nodes overlay */}
                  <div className="absolute inset-0 bg-radial-nodes opacity-15 pointer-events-none" />
                  
                  {/* Discreet Round Upload MP3 Button in Top Corner */}
                  <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 text-amber-100 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md flex items-center gap-1.5 group"
                      title="Upload custom MP3"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline text-[10.5px] font-mono font-medium">IMPORT MP3</span>
                    </button>
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="audio/*" 
                      onChange={handleCustomAudioUpload} 
                      className="hidden" 
                    />
                  </div>

                  {/* Left Column: Clean Song Specification & Information Showcase */}
                  <div className="relative z-10 space-y-4 max-w-sm text-left flex-1 flex flex-col justify-between py-1">
                    
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-amber-200/80 uppercase block">SONG SPECIFICATIONS</span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans drop-shadow-sm leading-tight mt-1">
                          {currentTrack.title}
                        </h2>
                      </div>

                      {/* Clean Music Information Grid */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
                          <span className="text-[9.5px] font-mono text-amber-200/75 uppercase tracking-wider block">ARTIST</span>
                          <span className="text-xs sm:text-sm font-bold text-white truncate block mt-0.5">{currentTrack.artist}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
                          <span className="text-[9.5px] font-mono text-amber-200/75 uppercase tracking-wider block">ALBUM</span>
                          <span className="text-xs sm:text-sm font-bold text-white truncate block mt-0.5">
                            {currentTrack.id === 'track-coffee-bars' && customAudioUrl.startsWith('blob:') ? 'Local Master' : 'Aura Sessions Vol. 1'}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
                          <span className="text-[9.5px] font-mono text-amber-200/75 uppercase tracking-wider block">GENRE</span>
                          <span className="text-xs sm:text-sm font-bold text-white truncate block mt-0.5">{currentTrack.genre}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
                          <span className="text-[9.5px] font-mono text-amber-200/75 uppercase tracking-wider block">FORMAT · LENGTH</span>
                          <span className="text-xs sm:text-sm font-bold text-white truncate block mt-0.5">
                            Vinyl 33 · {currentTrack.duration}
                          </span>
                        </div>
                      </div>

                      {/* Vibes Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {currentTrack.vibes.map(v => (
                          <span key={v} className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-[10px] font-medium text-amber-100">
                            #{v}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: ELEGANT SQUARE 3D LIQUID GLASS VINYL TURNTABLE (GRAMOPHONE) */}
                  <div className="turntable-3d-deck rounded-[34px] w-64 h-64 sm:w-72 sm:h-72 md:w-[306px] md:h-[306px] aspect-square p-3.5 flex items-center justify-center shrink-0 relative overflow-hidden group select-none shadow-[0_30px_70px_rgba(0,0,0,0.95),inset_0_2px_3px_rgba(255,255,255,0.7)]">
                    
                    {/* Inner Refractive 3D Liquid Glass Plinth Slab with Beveled Rim */}
                    <div className="turntable-glass-plinth rounded-[28px]" />

                    {/* --- 1. 3D CIRCULAR SUNKEN RECESSED PLATTER WELL (Under the Disc) --- */}
                    <div className="absolute left-[44%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[196px] h-[196px] sm:w-[222px] sm:h-[222px] rounded-full platter-well-3d flex items-center justify-center pointer-events-none">
                      {/* Concentric Lathe Machining Groove Rings in the Platter Basin */}
                      <div className="absolute inset-2 rounded-full border border-stone-800/60 pointer-events-none" />
                      <div className="absolute inset-5 rounded-full border border-stone-800/40 pointer-events-none" />
                      <div className="absolute inset-9 rounded-full border border-stone-800/25 pointer-events-none" />
                    </div>

                    {/* --- 2. 3D DIE-CAST PLATTER & GROOVED HIGH-GLOSS VINYL RECORD --- */}
                    <div className="absolute left-[44%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                      
                      {/* Heavy 3D Die-Cast Aluminum Platter with Chamfered Stroboscopic Rim */}
                      <div className="platter-chassis w-[178px] h-[178px] sm:w-[202px] sm:h-[202px] flex items-center justify-center relative">
                        
                        {/* Outer Strobe Dot Ring */}
                        <div className="strobe-dot-ring" />

                        {/* High-Gloss Grooved Vinyl Record with Anisotropic Twin-Sheen Reflection */}
                        <div 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className={`w-[162px] h-[162px] sm:w-[184px] sm:h-[184px] rounded-full relative flex items-center justify-center shadow-2xl cursor-pointer ${
                            isPlaying ? 'vinyl-active-spin' : ''
                          }`}
                          style={{
                            backgroundImage: `
                              radial-gradient(circle, #09090b 24%, #18181b 36%, #09090b 42%, #27272a 48%, #09090b 54%, #1f1f23 60%, #09090b 68%, #27272a 76%, #050507 100%),
                              conic-gradient(from 45deg, rgba(255,255,255,0.18) 0deg, transparent 40deg, transparent 140deg, rgba(255,255,255,0.18) 180deg, transparent 220deg, transparent 320deg, rgba(255,255,255,0.18) 360deg)
                            `,
                            backgroundBlendMode: 'screen, normal'
                          }}
                          title={isPlaying ? "Click to Pause" : "Click to Play"}
                        >
                          {/* Micro-Grooves Concentric Rings */}
                          <div className="absolute inset-2 rounded-full border border-stone-700/50 pointer-events-none" />
                          <div className="absolute inset-5 rounded-full border border-stone-800/60 pointer-events-none" />
                          <div className="absolute inset-8 rounded-full border border-stone-700/40 pointer-events-none" />
                          <div className="absolute inset-12 rounded-full border border-stone-800/50 pointer-events-none" />

                          {/* Pure Standard Vinyl Center Label (Minimalist, Luxurious, Matching Track Colors) */}
                          <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr ${currentTrack.colorFrom} ${currentTrack.colorTo} border border-amber-300/70 flex flex-col items-center justify-center shadow-xl relative z-10 text-center select-none`}>
                            {/* Inner Gold Foil Hairline Ring */}
                            <div className="absolute inset-1 rounded-full border border-amber-200/50 pointer-events-none" />
                            {/* Solid Polished Brass & Steel Spindle Pin */}
                            <div className="w-3.5 h-3.5 rounded-full bg-stone-950 border border-white/60 flex items-center justify-center shadow-inner">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow" />
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* --- 3. TACTILE METALLIC START / STOP PUSHBUTTON (Front-Left Corner, Clean & Standard) --- */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-30 px-3 py-1.5 rounded-full bg-gradient-to-b from-stone-800 via-stone-900 to-black border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:border-amber-400/60 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer group/btn"
                      title={isPlaying ? "Stop Turntable" : "Start Turntable"}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isPlaying ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-stone-600'}`} />
                      <span className="text-[9px] font-mono font-bold tracking-wider text-stone-200 group-hover/btn:text-white uppercase select-none">
                        {isPlaying ? 'STOP' : 'START'}
                      </span>
                    </button>

                    {/* --- 4. ARTICULATED TONEARM & POLISHED SILVER REST CRADLE --- */}
                    
                    {/* Polished Machined Silver Tonearm Rest Cradle (قسمت نقره‌ای - Positioned naturally close beside the disc) */}
                    <div className="absolute top-[128px] right-[34px] sm:right-[38px] z-15 flex flex-col items-center pointer-events-none">
                      {/* Silver Machined Pillar */}
                      <div className="w-2 h-4 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-500 rounded-xs shadow-[0_2px_5px_rgba(0,0,0,0.85)] border-x border-white/80" />
                      {/* Silver Cradle Fork */}
                      <div className="w-4.5 h-1.5 bg-gradient-to-r from-stone-300 via-white to-stone-300 rounded-full border border-stone-300 shadow-sm" />
                    </div>

                    {/* Slim Luxury Classic Brass & Chrome Tonearm Assembly (Brought comfortably closer to disc) */}
                    <div 
                      className="absolute top-3 right-5 sm:top-3.5 sm:right-6 w-14 h-34 origin-[34px_18px] transition-transform duration-[850ms] cubic-bezier(0.25, 0.8, 0.25, 1) pointer-events-none z-25"
                      style={{
                        transform: isPlaying ? 'rotate(30deg)' : 'rotate(0deg)'
                      }}
                    >
                      {/* Gimbal Pivot Base with Concentric Bearing Rings & Ruby Jewel Bearing */}
                      <div className="absolute top-1 right-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-800 border border-amber-300 shadow-xl flex items-center justify-center">
                        <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-stone-800 to-stone-950 border border-amber-500/50 flex items-center justify-center">
                          {/* Ruby Jewel Bearing Core */}
                          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]" />
                        </div>
                      </div>

                      {/* Cylindrical Numbered Brass Counterweight extending behind gimbal */}
                      <div className="absolute -top-1 right-4.5 w-3.5 h-3 bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 rounded-2xs border border-amber-300 shadow" />

                      {/* Polished Champagne Brass & Chrome Tonearm Tube */}
                      <svg viewBox="0 0 40 100" className="absolute top-3.5 right-1 w-10 h-28 overflow-visible filter drop-shadow-[2px_4px_6px_rgba(0,0,0,0.85)]">
                        <path 
                          d="M27 0 L27 80 L23 95" 
                          fill="none" 
                          stroke="url(#brass-chrome-tonearm)" 
                          strokeWidth="2.8" 
                          strokeLinecap="round" 
                        />
                        <defs>
                          <linearGradient id="brass-chrome-tonearm" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="40%" stopColor="#ffffff" />
                            <stop offset="75%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#78350f" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Precision Angled Headshell & Cartridge with Diamond Stylus Needle */}
                      <div className="absolute bottom-0 right-[15px] w-3.5 h-6 bg-gradient-to-b from-stone-950 via-stone-800 to-black border border-amber-500/50 rounded-2xs shadow-2xl flex flex-col justify-between p-0.5">
                        <div className="w-2 h-1 bg-amber-400 rounded-2xs mx-auto" />
                        {/* Illuminated Stylus Cueing Spotlight (Shines directly ON the vinyl record grooves when playing!) */}
                        <div className={`w-1.5 h-1.5 rounded-full mx-auto transition-opacity ${isPlaying ? 'bg-amber-300 shadow-[0_0_8px_4px_rgba(251,191,36,0.95)] opacity-100' : 'bg-stone-700 opacity-20'}`} />
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT SIDEBAR: UP NEXT QUEUE (4 Columns) */}
              <div className="lg:col-span-4 rounded-[32px] p-5 sm:p-6 bg-slate-950/35 backdrop-blur-2xl border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-widest text-amber-400 font-mono uppercase">UP NEXT</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{getFilteredTracks().length} TRACKS</span>
                </div>

                {/* Track List */}
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {getFilteredTracks().map((track, idx) => {
                    const isCurrent = currentTrack.id === track.id;
                    const isLiked = likedTracks[track.id];
                    return (
                      <div 
                        key={track.id}
                        onClick={() => selectAndPlayTrack(track)}
                        className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer border ${
                          isCurrent 
                            ? 'bg-amber-500/15 border-amber-400/35 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                            : 'bg-white/5 hover:bg-white/10 border-transparent hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Index or Live Equalizer */}
                          <div className="w-5 text-center shrink-0">
                            {isCurrent && isPlaying ? (
                              <span className="flex items-end justify-center gap-0.5 h-3">
                                <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse" />
                                <span className="w-0.5 h-3 bg-amber-300 rounded-full animate-pulse delay-75" />
                                <span className="w-0.5 h-1.5 bg-yellow-200 rounded-full animate-pulse delay-150" />
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            )}
                          </div>

                          {/* Cover Art */}
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${track.colorFrom} ${track.colorTo} flex items-center justify-center shrink-0 shadow-md relative overflow-hidden`}>
                            <Music className="w-4 h-4 text-white/60" />
                          </div>

                          {/* Title & Artist */}
                          <div className="min-w-0 flex-1">
                            <h5 className={`text-xs font-bold truncate transition-colors ${isCurrent ? 'text-amber-300' : 'text-white group-hover:text-amber-200'}`}>
                              {track.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 truncate">{track.artist}</p>
                          </div>
                        </div>

                        {/* Right Actions: Heart & Duration */}
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <button
                            onClick={(e) => toggleLikeTrack(track.id, e)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Favorite"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
                          </button>
                          <span className="text-[10px] font-mono text-slate-400">{track.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtle Bottom Vibes Line */}
                <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-amber-400 font-mono font-medium">VIBES:</span>
                  <div className="flex items-center gap-1.5 truncate">
                    {currentTrack.vibes.map((v, i) => (
                      <React.Fragment key={v}>
                        {i > 0 && <span className="opacity-40">·</span>}
                        <span>{v}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* --- LOCKED DOCKED 3D LIQUID GLASS BOTTOM MEDIA CONTROLLER (ALWAYS VISIBLE & PINNED) --- */}
            <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3.5rem)] max-w-2xl z-50 pointer-events-auto">
              <div className="relative w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full backdrop-blur-3xl bg-stone-950/92 border border-white/20 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.28),_inset_0_-1px_2px_rgba(0,0,0,0.5),_0_20px_50px_rgba(0,0,0,0.85),_0_0_35px_rgba(245,158,11,0.12)] flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 overflow-hidden">
                
                {/* Background Ambient Audio-Reactive Aurora Ribbon (Fine Curved Lines with Luminous Halo) */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
                  <canvas 
                    ref={freqCanvasRef} 
                    className={`w-full h-full block transition-opacity duration-500 ${isPlaying ? 'opacity-55' : 'opacity-15'}`} 
                  />
                  {/* Soft Specular Glass Reflection Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none rounded-full" />
                </div>

                {/* 1. LEFT ZONE: Current Track Identity (Clean & Minimal - No Border Box) */}
                <div className="min-w-0 max-w-[130px] sm:max-w-[170px] text-left relative z-10 shrink-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-300 font-medium truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>

                {/* 2. CENTER ZONE: Transport Controls & Interactive Scrubber (Balanced Standard Spacing) */}
                <div className="flex-1 min-w-0 max-w-sm sm:max-w-md flex flex-col items-center gap-2.5 sm:gap-3 px-1 sm:px-2 relative z-10">
                  {/* Subtle frosted glass grouping cradle around buttons for high visual clarity */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]">
                    {/* Shuffle Button */}
                    <button 
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        isShuffle ? 'text-amber-300 bg-amber-400/20' : 'text-stone-400 hover:text-white'
                      }`}
                      title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={handlePrevTrack}
                      className="p-1.5 rounded-full text-stone-300 hover:text-amber-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                      title="Previous track"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-slate-950 flex items-center justify-center hover:scale-108 active:scale-95 transition-all shadow-[0_0_18px_rgba(245,158,11,0.7)] cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4.5 h-4.5 fill-slate-950 text-slate-950" />
                      ) : (
                        <Play className="w-4.5 h-4.5 fill-slate-950 text-slate-950 ml-0.5" />
                      )}
                    </button>

                    <button 
                      onClick={handleNextTrack}
                      className="p-1.5 rounded-full text-stone-300 hover:text-amber-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                      title="Next track"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Repeat Button */}
                    <button 
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        isRepeat ? 'text-amber-300 bg-amber-400/20' : 'text-stone-400 hover:text-white'
                      }`}
                      title={isRepeat ? "Repeat On" : "Repeat Off"}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Track Progress Scrubber with Balanced Dimension & Spacing */}
                  <div className="w-full flex items-center gap-2.5">
                    <span className="text-[8.5px] font-mono text-stone-400 w-7 text-right shrink-0">
                      {Math.floor(trackProgress * 0.05)}:{(Math.floor(trackProgress * 3) % 60).toString().padStart(2, '0')}
                    </span>
                    
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                        handleSeek(newPct);
                      }}
                      className="flex-1 h-1.5 bg-white/10 hover:bg-white/20 rounded-full overflow-hidden cursor-pointer relative group/scrubber transition-all"
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 rounded-full relative transition-all duration-200" 
                        style={{ width: `${trackProgress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fef08a] opacity-0 group-hover/scrubber:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    <span className="text-[8px] font-mono text-stone-400 w-7 text-left shrink-0">
                      {currentTrack.duration}
                    </span>
                  </div>
                </div>

                {/* 3. RIGHT ZONE: Integrated Master Volume Slider */}
                <div className="flex justify-end items-center gap-2 shrink-0 relative z-10">
                  {/* Master Volume Controller */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]">
                    <button 
                      onClick={() => setAmbientVolume(v => (v > 0 ? 0 : 70))}
                      className="text-stone-300 hover:text-amber-300 transition-colors cursor-pointer"
                      title={ambientVolume === 0 ? "Unmute" : "Mute"}
                    >
                      {ambientVolume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(Number(e.target.value))}
                      className="w-12 sm:w-16 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      title={`Volume: ${ambientVolume}%`}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* === VIEW 3: STANDALONE WIDESCREEN MOVIE STREAMING HUB === */}
        {/* ========================================================= */}
        {currentWorld === 'movie' && (
          <MovieStreamingView 
            handleTravel={handleTravel}
            currentMovie={currentMovie}
            setCurrentMovie={setCurrentMovie}
            actorsList={actorsList}
            toggleFollowActor={toggleFollowActor}
            watchlistIds={watchlistIds}
            toggleWatchlist={toggleWatchlist}
            movieSearch={movieSearch}
            setMovieSearch={setMovieSearch}
            movieFilterCategory={movieFilterCategory}
            setMovieFilterCategory={setMovieFilterCategory}
            activeMovieMenuModal={activeMovieMenuModal}
            setActiveMovieMenuModal={setActiveMovieMenuModal}
            activeMenuSelection={activeMenuSelection}
            setActiveMenuSelection={setActiveMenuSelection}
            isMovieVideoPlaying={isMovieVideoPlaying}
            setIsMovieVideoPlaying={setIsMovieVideoPlaying}
            moviePlaySeconds={moviePlaySeconds}
            setMoviePlaySeconds={setMoviePlaySeconds}
            isMovieMuted={isMovieMuted}
            setIsMovieMuted={setIsMovieMuted}
            isMovieFullscreen={isMovieFullscreen}
            setIsMovieFullscreen={setIsMovieFullscreen}
            likedReviewIds={likedReviewIds}
            toggleLikeReview={toggleLikeReview}
            bookmarkedReviewIds={bookmarkedReviewIds}
            toggleBookmarkReview={toggleBookmarkReview}
            movieToast={movieToast}
            showMovieToast={showMovieToast}
            newReviewText={newReviewText}
            setNewReviewText={setNewReviewText}
            handleAddReview={handleAddReview}
            movieReviewsMap={movieReviewsMap}
            formatMovieTime={formatMovieTime}
          />
        )}
        {/* ========================================================= */}
        {/* === VIEW 4: STANDALONE WIDESCREEN COMMUNITY HUB (SOCIAL HUB) === */}
        {/* ========================================================= */}
        {currentWorld === 'community' && (
          <SocialHubView 
            onNavigateHome={() => handleTravel('portal')} 
            onPlayTrack={(trackId) => {
              const trk = AURA_TRACKS.find(t => t.id === trackId);
              if (trk) selectAndPlayTrack(trk);
            }}
          />
        )}

      </main>

      <footer className="relative z-10 w-full bg-slate-950/20 border-t border-white/5 py-4 text-center text-[9px] text-slate-600 font-mono tracking-widest mt-auto shrink-0">
        &copy; 2026 AURA SYSTEMS INC. LIQUID GLASS ENGINE.
      </footer>

    </div>
  );
}
