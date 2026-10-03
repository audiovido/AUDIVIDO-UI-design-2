/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Music, Film, Users, Play, Pause, SkipForward, SkipBack, 
  Search, Heart, Flame, Send, Calendar, Check, Radio, VolumeX, Volume2,
  Compass, ArrowLeft, Tv, Library, Compass as BrowseIcon, FolderHeart, Clock, Disc, Disc3, ListMusic, Upload,
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
import { AudioVidoBrandLogo } from './components/AudioVidoBrandLogo';
import { MusicV2View } from './components/MusicV2View';
import { musicApi } from './services/musicApiService';

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
  // Navigation State: 'portal' | 'music' | 'movie' | 'community' | 'music2'
  const [currentWorld, setCurrentWorld] = useState<'portal' | 'music' | 'movie' | 'community' | 'music2'>('portal');
  
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

  // Unified Playing State (Empty / silent by default - no default hardcoded tracks)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [likedTracks, setLikedTracks] = useState<Record<string, boolean>>({});
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

  // Helper to parse duration string (e.g. '1:00', '4:20') into total seconds
  const parseDurationToSeconds = (durStr: string): number => {
    if (!durStr) return 180;
    const parts = durStr.split(':').map(Number);
    if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
    if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    return 180;
  };

  // Helper to format seconds into M:SS or MM:SS
  const formatSecondsToDisplay = (sec: number): string => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingFireplace, setIsPlayingFireplace] = useState<boolean>(false);
  const [trackProgress, setTrackProgress] = useState<number>(0); // %
  const [currentTrackSeconds, setCurrentTrackSeconds] = useState<number>(0); // elapsed seconds
  const [audioDuration, setAudioDuration] = useState<number>(180); // actual playable audio duration in seconds
  const [isScrubbingApp, setIsScrubbingApp] = useState<boolean>(false);
  const [movieProgress, setMovieProgress] = useState<number>(60); // %

  // Helper to parse duration string like "3:45" or "5:42" into seconds
  const parseDurationStringToSeconds = (durStr?: string): number => {
    if (!durStr) return 180;
    const parts = durStr.split(':').map(p => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    return 180;
  };

  // Glass Connect Controllers
  const [lightDimmers, setLightDimmers] = useState<number>(100); 
  const [lightWarmth, setLightWarmth] = useState<number>(20); 
  const [ambientVolume, setAmbientVolume] = useState<number>(60); 

  // Interactive feeds
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [eventsList, setEventsList] = useState<AuraEvent[]>(INITIAL_AURA_EVENTS);
  const [movieSearch, setMovieSearch] = useState<string>('');
  const [musicSearch, setMusicSearch] = useState<string>('');
  const [musicNavTab, setMusicNavTab] = useState<'library' | 'likes' | 'playlists'>('library');
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
      setCurrentTrack({
        id: `uploaded-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Your Uploaded Music (Local File)',
        album: 'Local Upload',
        duration: '3:00',
        durationSeconds: 180,
        genre: 'Custom Audio',
        vibes: ['Local Master'],
        cozyIndex: 90,
        colorFrom: 'from-emerald-500',
        colorTo: 'to-teal-600',
        audioSynthType: 'music',
        previewUrl: url,
        artistPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
      });
      setCurrentTrackSeconds(0);
      setTrackProgress(0);
      setAudioDuration(180);
      setIsPlaying(true);
      AudioSynth.stopAll();
      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.currentTime = 0;
          audioPlayerRef.current.play().catch(e => console.log('Audio playback started:', e));
        }
      }, 60);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      const cur = audioPlayerRef.current.currentTime;
      const rawDur = audioPlayerRef.current.duration;
      const dur = (rawDur && !isNaN(rawDur) && isFinite(rawDur) && rawDur > 0)
        ? rawDur
        : (audioDuration || currentTrack?.durationSeconds || 180);
      
      if (!isScrubbingApp) {
        setCurrentTrackSeconds(cur);
        if (dur > 0) {
          setTrackProgress(Math.min(100, Math.max(0, (cur / dur) * 100)));
        }
      }
      if (rawDur && !isNaN(rawDur) && isFinite(rawDur) && rawDur > 0 && Math.abs(rawDur - audioDuration) > 0.5) {
        setAudioDuration(rawDur);
      }
    }
  };

  const handleSeek = (newPct: number) => {
    const clampedPct = Math.min(100, Math.max(0, newPct));
    setTrackProgress(clampedPct);
    const audio = audioPlayerRef.current;
    const rawDur = audio?.duration;
    const totalSec = (rawDur && !isNaN(rawDur) && isFinite(rawDur) && rawDur > 0)
      ? rawDur
      : (audioDuration || currentTrack?.durationSeconds || 180);
    const targetSec = (clampedPct / 100) * totalSec;
    setCurrentTrackSeconds(targetSec);
    if (audio) {
      audio.currentTime = targetSec;
    }
  };

  const calculateScrubberPctApp = (clientX: number, target: HTMLElement): number => {
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const clickX = clientX - rect.left;
    return Math.min(100, Math.max(0, (clickX / rect.width) * 100));
  };

  const handlePointerDownScrubberApp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!currentTrack) return;
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}
    setIsScrubbingApp(true);
    const newPct = calculateScrubberPctApp(e.clientX, target);
    handleSeek(newPct);
  };

  const handlePointerMoveScrubberApp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingApp || !currentTrack) return;
    const newPct = calculateScrubberPctApp(e.clientX, e.currentTarget);
    handleSeek(newPct);
  };

  const handlePointerUpScrubberApp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingApp) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsScrubbingApp(false);
  };

  // Sync volume with Web Audio synth & HTML5 Audio
  useEffect(() => {
    AudioSynth.setVolume(ambientVolume / 100);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = ambientVolume / 100;
    }
  }, [ambientVolume]);

  // Sync playing states with real HTML5 audio player
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;
    if (isPlaying && currentTrack) {
      if (currentTrack.previewUrl && !currentTrack.previewUrl.startsWith('/api/resolve-stream')) {
        if (!audio.src || !audio.src.includes(currentTrack.previewUrl)) {
          audio.src = currentTrack.previewUrl;
          audio.load();
        }
        audio.play().catch(e => {
          if (e.name !== 'AbortError') console.warn('HTML5 audio play error:', e);
        });
      } else {
        // Resolve stream dynamically if not resolved yet
        musicApi.resolveFullTrackAudio(currentTrack.title, currentTrack.artist).then(res => {
          if (res?.streamUrl) {
            audio.src = res.streamUrl;
            audio.load();
            if (res.durationSeconds) setAudioDuration(res.durationSeconds);
            currentTrack.previewUrl = res.streamUrl;
            currentTrack.isFullTrack = true;
            audio.play().catch(e => {
              if (e.name !== 'AbortError') console.warn('HTML5 audio play error after resolve:', e);
            });
          }
        }).catch(err => console.warn('Failed to resolve audio on play:', err));
      }
    } else {
      audio.pause();
      setIsPlayingFireplace(false);
    }
  }, [isPlaying, currentTrack]);

  // Track progress timers for non-audio sources (movie world)
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentWorld !== 'music' && currentWorld !== 'music2') {
      interval = setInterval(() => {
        setTrackProgress(p => (p >= 100 ? 0 : p + 0.6));
        setMovieProgress(p => (p >= 100 ? 0 : p + 0.35));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentWorld]);

  // --- TRANSITIONAL ZOOM PORTAL TRAVEL ---
  const handleTravel = (destination: 'portal' | 'music' | 'movie' | 'community' | 'music2') => {
    setIsTraveling(true);
    setTravelDestination(destination);

    // Completely silent by default: Never auto-play audio on page navigation.
    // Audio will only play when user explicitly searches/selects a song and hits play.
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    AudioSynth.stopAll();
    setIsPlaying(false);
    setIsPlayingFireplace(false);

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

  const selectAndPlayTrack = async (track: Track) => {
    setCurrentTrack(track);
    setCurrentTrackSeconds(0);
    setTrackProgress(0);

    const initialDur = track.durationSeconds || (track.duration ? parseDurationStringToSeconds(track.duration) : 180);
    setAudioDuration(initialDur);

    let streamUrl = track.previewUrl || '';

    // If track doesn't have a direct full stream or has an unresolved API endpoint, resolve high-fidelity stream
    if (!streamUrl || streamUrl.startsWith('/api/resolve-stream') || (!track.isFullTrack && !streamUrl.startsWith('blob:') && !streamUrl.includes('/api/audio-proxy'))) {
      try {
        const fullRes = await musicApi.resolveFullTrackAudio(track.title, track.artist);
        if (fullRes?.streamUrl) {
          streamUrl = fullRes.streamUrl;
          if (fullRes.durationSeconds) {
            setAudioDuration(fullRes.durationSeconds);
            track.durationSeconds = fullRes.durationSeconds;
          }
          track.previewUrl = streamUrl;
          track.isFullTrack = true;
          setCurrentTrack({ ...track, previewUrl: streamUrl, isFullTrack: true });
        }
      } catch (err) {
        console.warn('Full stream lookup:', err);
      }
    }

    const audio = audioPlayerRef.current;
    if (audio && streamUrl && !streamUrl.startsWith('/api/resolve-stream')) {
      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
      }
      audio.currentTime = 0;
      setIsPlaying(true);
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        if (err.name !== 'AbortError') {
          console.warn('Direct stream play error:', err);
        }
      });
    } else if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleNextTrack = () => {
    if (!currentTrack || AURA_TRACKS.length === 0) return;
    if (isShuffle) {
      const remainingTracks = AURA_TRACKS.filter(t => t.id !== currentTrack?.id);
      const randomTrack = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
      if (randomTrack) selectAndPlayTrack(randomTrack);
    } else {
      const currentIdx = AURA_TRACKS.findIndex(t => t.id === currentTrack?.id);
      const nextIdx = (currentIdx + 1) % AURA_TRACKS.length;
      if (AURA_TRACKS[nextIdx]) selectAndPlayTrack(AURA_TRACKS[nextIdx]);
    }
  };

  const handlePrevTrack = () => {
    if (!currentTrack || AURA_TRACKS.length === 0) return;
    const currentIdx = AURA_TRACKS.findIndex(t => t.id === currentTrack?.id);
    const prevIdx = (currentIdx - 1 + AURA_TRACKS.length) % AURA_TRACKS.length;
    if (AURA_TRACKS[prevIdx]) selectAndPlayTrack(AURA_TRACKS[prevIdx]);
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

  // Filter track catalog list based on category, library tab, likes, playlists and search query
  const getFilteredTracks = () => {
    let tracks = AURA_TRACKS;
    if (musicNavTab === 'likes') {
      tracks = tracks.filter(t => likedTracks[t.id]);
    } else if (musicNavTab === 'playlists') {
      if (activeMusicCategory === 'lofi') tracks = tracks.filter(t => t.genre.toLowerCase().includes('lofi') || t.title.toLowerCase().includes('lofi') || t.genre.toLowerCase().includes('chill'));
      if (activeMusicCategory === 'ambient') tracks = tracks.filter(t => t.genre.toLowerCase().includes('ambient') || t.genre.toLowerCase().includes('drone'));
      if (activeMusicCategory === 'fireplace') tracks = tracks.filter(t => t.audioSynthType === 'fireplace');
    } else if (musicNavTab === 'library') {
      tracks = AURA_TRACKS;
    }
    if (musicSearch.trim()) {
      const q = musicSearch.toLowerCase();
      tracks = tracks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) || 
        t.genre.toLowerCase().includes(q) ||
        t.vibes.some(v => v.toLowerCase().includes(q))
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

    canvas.width = 100;
    canvas.height = 100;

    let phase = 0;

    const renderCozySinewave = () => {
      // Pure transparent background so the soft aurora mist floats seamlessly in the circular visualizer orb
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
      const waveSpeed = isPlaying ? (0.035 + bassEnergy * 0.09 + midEnergy * 0.04) : 0.008;
      phase += waveSpeed;

      // Authentic Northern Lights (Aurora Borealis) waveform layers: Emerald Green, Cosmic Violet/Purple, and Deep Dark Tones
      const layers = [
        { 
          stroke: 'rgba(52, 211, 153, 0.95)',  // Aurora Emerald Green
          glow: 'rgba(16, 185, 129, 0.9)', 
          blur: 8,
          width: 2.2, 
          mult: 1.0, 
          freqShift: 0 
        },
        { 
          stroke: 'rgba(192, 132, 252, 0.92)', // Cosmic Northern Violet / Purple
          glow: 'rgba(168, 85, 247, 0.85)', 
          blur: 7,
          width: 1.8, 
          mult: 0.8, 
          freqShift: 1.35 
        },
        { 
          stroke: 'rgba(5, 150, 105, 0.75)',   // Deep Dark Aurora Emerald
          glow: 'rgba(4, 120, 87, 0.65)', 
          blur: 5,
          width: 1.4, 
          mult: 0.6, 
          freqShift: 2.7 
        },
        { 
          stroke: 'rgba(126, 34, 206, 0.65)',  // Deep Velvet Dark Purple
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

        const dynamicAmp = isPlaying ? (4 + bassEnergy * 16 * layer.mult + midEnergy * 6) : 2.5;

        for (let x = 0; x < canvas.width; x++) {
          const sampleIdx = timeData ? Math.floor((x / canvas.width) * timeData.length) : 0;
          const rawWave = (timeData && isPlaying) ? ((timeData[sampleIdx] - 128) / 128) * 8 * layer.mult : 0;

          const freqOffset = Math.sin(x * (0.06 + trebleEnergy * 0.02) + phase + layer.freqShift) * dynamicAmp;
          const harmonic = Math.sin(x * 0.09 + phase * 1.6) * (bassEnergy * 6);

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
        const count = Math.min(6, Math.floor(2 + bassEnergy * 6));
        for (let p = 0; p < count; p++) {
          const isGreen = p % 2 === 0;
          ctx.fillStyle = isGreen ? `rgba(52, 211, 153, ${0.6 + bassEnergy * 0.4})` : `rgba(192, 132, 252, ${0.6 + bassEnergy * 0.4})`;
          ctx.shadowColor = isGreen ? '#34d399' : '#c084fc';
          ctx.shadowBlur = 5;
          const px = (phase * 25 + p * (canvas.width / count)) % canvas.width;
          const py = canvas.height / 2 + Math.sin(px * 0.06 + phase) * (4 + bassEnergy * 10) + (isGreen ? -1 : 1) * (bassEnergy * 4);
          ctx.beginPath();
          ctx.arc(px, py, 1.2 + bassEnergy * 1.5, 0, Math.PI * 2);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-clip select-none aurora-bg transition-colors duration-1000">
      
      {/* GLOBAL COSMIC NIGHT SKY & AURORA BOREALIS & DYNAMIC METEORS */}
      <CosmicNightSky isPortal={currentWorld === 'portal'} />

      {/* --- TOP BRANDING NAV BAR (PERMANENTLY FIXED & LOCKED AT TOP OF SCREEN) --- */}
      <header className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between px-3 sm:px-6 py-2.5 bg-slate-950/90 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.9)] shrink-0 gap-2 transition-all">
        
        {/* Left: Brand Portal Gateway Button */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => handleTravel('portal')}
            className={`flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all cursor-pointer select-none active:translate-y-[1px] active:scale-[0.98] group shrink-0 ${
              currentWorld === 'portal'
                ? 'bg-slate-950/90 border-amber-300 shadow-[0_0_24px_rgba(56,189,248,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-[1.02]'
                : 'bg-black/60 hover:bg-slate-950/90 border-white/20 hover:border-cyan-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
            }`}
            title="Portal Gateway (AUDIOVIDO)"
          >
            <AudioVidoBrandLogo size="sm" variant="horizontal" />
          </button>
        </div>

        {/* Center: Tactile 3D Realm Navigation Bar (AUDIO, VIDEO, SOCIAL, MUSIC 2, MUSIC 4) Centered in Screen */}
        <div className="flex-1 flex items-center justify-center">
          <nav className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-slate-950/90 border border-white/20 rounded-full backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.22)] shrink-0">
            {/* 1. AUDIO */}
            <button 
              onClick={() => handleTravel('music')} 
              className={`relative px-2.5 sm:px-5 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs font-black font-sans tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-2 select-none active:translate-y-[1px] ${
                currentWorld === 'music' 
                  ? 'bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 text-slate-950 shadow-[0_4px_18px_rgba(16,185,129,0.65),inset_0_1.5px_1px_rgba(255,255,255,0.9),inset_0_-2.5px_3px_rgba(0,0,0,0.4)] border border-emerald-100 scale-[1.02]' 
                  : 'text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-emerald-400/40'
              }`}
              title="Audio Realm"
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all shrink-0 ${
                currentWorld === 'music' 
                  ? 'bg-slate-950 shadow-sm' 
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`} />
              <span>AUDIO</span>
            </button>

            {/* 2. VIDEO */}
            <button 
              onClick={() => handleTravel('movie')} 
              className={`relative px-2.5 sm:px-5 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs font-black font-sans tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-2 select-none active:translate-y-[1px] ${
                currentWorld === 'movie' 
                  ? 'bg-gradient-to-b from-violet-300 via-purple-400 to-indigo-500 text-slate-950 shadow-[0_4px_18px_rgba(168,85,247,0.65),inset_0_1.5px_1px_rgba(255,255,255,0.9),inset_0_-2.5px_3px_rgba(0,0,0,0.4)] border border-purple-100 scale-[1.02]' 
                  : 'text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400/40'
              }`}
              title="Video Realm"
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all shrink-0 ${
                currentWorld === 'movie' 
                  ? 'bg-slate-950 shadow-sm' 
                  : 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
              }`} />
              <span>VIDEO</span>
            </button>

            {/* 3. SOCIAL */}
            <button 
              onClick={() => handleTravel('community')} 
              className={`relative px-2.5 sm:px-5 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs font-black font-sans tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-2 select-none active:translate-y-[1px] ${
                currentWorld === 'community' 
                  ? 'bg-gradient-to-b from-sky-200 via-sky-300 to-blue-400 text-slate-950 shadow-[0_4px_18px_rgba(56,189,248,0.65),inset_0_1.5px_1px_rgba(255,255,255,0.9),inset_0_-2.5px_3px_rgba(0,0,0,0.4)] border border-sky-100 scale-[1.02]' 
                  : 'text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-sky-400/40'
              }`}
              title="Social Realm"
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all shrink-0 ${
                currentWorld === 'community' 
                  ? 'bg-slate-950 shadow-sm' 
                  : 'bg-sky-300 shadow-[0_0_8px_#38bdf8]'
              }`} />
              <span>SOCIAL</span>
            </button>

            {/* 4. MUSIC 2 (Electric Lime Modern Streaming Hub) */}
            <button 
              onClick={() => handleTravel('music2')} 
              className={`relative px-2.5 sm:px-5 py-1 sm:py-2 rounded-full text-[10px] sm:text-xs font-black font-sans tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 sm:gap-2 select-none active:translate-y-[1px] ${
                currentWorld === 'music2' 
                  ? 'bg-gradient-to-b from-lime-300 via-lime-400 to-emerald-500 text-slate-950 shadow-[0_4px_18px_rgba(163,230,53,0.65),inset_0_1.5px_1px_rgba(255,255,255,0.9),inset_0_-2.5px_3px_rgba(0,0,0,0.4)] border border-lime-100 scale-[1.02]' 
                  : 'text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-lime-400/40'
              }`}
              title="Music 2 Streaming (Pulse Studio)"
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all shrink-0 ${
                currentWorld === 'music2' 
                  ? 'bg-slate-950 shadow-sm' 
                  : 'bg-lime-400 shadow-[0_0_8px_#a3e635]'
              }`} />
              <span>MUSIC 2</span>
            </button>
          </nav>
        </div>

        {/* Right Symmetrical Balance Spacer */}
        <div className="hidden md:flex items-center shrink-0 w-[140px] pointer-events-none" />
      </header>

      {/* Real HTML5 Audio Player for Web Streaming Previews & Uploads */}
      <audio 
        ref={audioPlayerRef} 
        src={currentTrack?.previewUrl || customAudioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={() => {
          if (audioPlayerRef.current) {
            const raw = audioPlayerRef.current.duration;
            if (raw && !isNaN(raw) && isFinite(raw) && raw > 0) {
              setAudioDuration(raw);
            }
          }
        }}
        onDurationChange={() => {
          if (audioPlayerRef.current) {
            const raw = audioPlayerRef.current.duration;
            if (raw && !isNaN(raw) && isFinite(raw) && raw > 0) {
              setAudioDuration(raw);
            }
          }
        }}
        onEnded={() => {
          if (isRepeat) {
            if (audioPlayerRef.current) {
              audioPlayerRef.current.currentTime = 0;
              audioPlayerRef.current.play().catch(e => console.warn(e));
            }
          } else {
            handleNextTrack();
          }
        }} 
        className="hidden" 
        preload="auto" 
      />

      {/* --- MASTER VIEWPORT CONTEXT (WITH TOP PADDING FOR FIXED LOCKED HEADER) --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 flex flex-col justify-center items-center relative z-10">

        {/* ========================================================= */}
        {/* === VIEW 1: PORTAL MAIN MENU (3 HIGH-PERFORMANCE LIQUID GLASS CARDS) === */}
        {/* ========================================================= */}
        {currentWorld === 'portal' && (
          <div className="w-full max-w-6xl animate-fadeIn flex flex-col items-center justify-center min-h-[560px] py-4 relative">
            
            {/* 3 Vertical Liquid Glass Cards: Left = Audio, Center = Social, Right = Video */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
              
              {/* 1. LEFT CARD: AUDIO STREAMING (Emerald Theme) */}
              <div 
                onClick={() => {
                  AudioSynth.playClick();
                  handleTravel('music');
                }}
                className="portal-card-audio rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 flex flex-col justify-between cursor-pointer group active:scale-[0.98] select-none relative overflow-hidden"
              >
                <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none group-hover:bg-emerald-400/30 transition-all duration-500" />
                
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-sans font-bold tracking-[0.14em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                      HI-RES AUDIO
                    </span>
                    <span className="text-xs font-sans text-emerald-300/80 font-medium">96kHz/24-bit</span>
                  </div>

                  <div className="flex items-center justify-center py-2 transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1">
                    <AudioEmblem3D />
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-[0.14em] uppercase text-white group-hover:text-emerald-300 transition-colors font-sans">
                      AUDIO
                    </h2>
                    <p className="text-xs text-emerald-200/90 font-sans font-medium tracking-wide">
                      Spatial Sound & Vinyl Stems
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-emerald-500/20 text-xs text-slate-200 font-sans leading-relaxed">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>Lossless Dolby Atmos & Hi-Res Flac</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>Custom Synthesizer & Multi-Stems</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>Curated Ambient & Lo-Fi Stations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-xs font-sans text-emerald-300/90 font-medium px-1">
                    <span>🟢 4,280 Listening</span>
                    <span>12 Stations</span>
                  </div>
                  <button 
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs font-sans tracking-[0.14em] uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_28px_rgba(16,185,129,0.8)] transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>ENTER AUDIO</span>
                  </button>
                </div>
              </div>

              {/* 2. CENTER CARD: SOCIAL HUB (Frosted White & Pale Sky-Blue Theme) */}
              <div 
                onClick={() => {
                  AudioSynth.playClick();
                  handleTravel('community');
                }}
                className="portal-card-social rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 flex flex-col justify-between cursor-pointer group active:scale-[0.98] select-none relative overflow-hidden md:-translate-y-2 hover:md:-translate-y-4"
              >
                <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-sky-400/20 blur-3xl pointer-events-none group-hover:bg-sky-400/35 transition-all duration-500" />
                
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-sky-300/50 text-white text-[10px] font-sans font-bold tracking-[0.14em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                      LIVE COMMUNITY
                    </span>
                    <span className="text-xs font-sans text-sky-200 font-medium">1.5K Online</span>
                  </div>

                  <div className="flex items-center justify-center py-2 transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1">
                    <SocialEmblem3D />
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-[0.14em] uppercase text-white group-hover:text-sky-200 transition-colors font-sans">
                      SOCIAL
                    </h2>
                    <p className="text-xs text-sky-200/90 font-sans font-medium tracking-wide">
                      Co-Watching, Clubs & Live Chat
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-sky-300/20 text-xs text-slate-100 font-sans leading-relaxed">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-300 shrink-0" />
                      <span>Synchronized 4K Watch Parties</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-300 shrink-0" />
                      <span>Real-time Interactive Live Chat & Stems</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-300 shrink-0" />
                      <span>Creator Cinema & Vinyl Lounges</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-xs font-sans text-sky-200/95 font-medium px-1">
                    <span>🟢 18 Active Rooms</span>
                    <span>4.8K Members</span>
                  </div>
                  <button 
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-white via-sky-100 to-sky-300 hover:from-white hover:to-sky-200 text-slate-950 font-bold text-xs font-sans tracking-[0.14em] uppercase flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,255,255,0.7)] group-hover:shadow-[0_0_32px_rgba(125,211,252,0.9)] transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-slate-950" />
                    <span>ENTER SOCIAL</span>
                  </button>
                </div>
              </div>

              {/* 3. RIGHT CARD: VIDEO STREAMING (Cosmic Violet Theme) */}
              <div 
                onClick={() => {
                  AudioSynth.playClick();
                  handleTravel('movie');
                }}
                className="portal-card-video rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 flex flex-col justify-between cursor-pointer group active:scale-[0.98] select-none relative overflow-hidden"
              >
                <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-purple-500/20 blur-3xl pointer-events-none group-hover:bg-purple-500/35 transition-all duration-500" />
                
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-sans font-bold tracking-[0.14em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_#c084fc]" />
                      4K CINEMA
                    </span>
                    <span className="text-xs font-sans text-purple-300/80 font-medium">60 FPS</span>
                  </div>

                  <div className="flex items-center justify-center py-2 transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1">
                    <VideoEmblem3D />
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-[0.14em] uppercase text-white group-hover:text-purple-300 transition-colors font-sans">
                      VIDEO
                    </h2>
                    <p className="text-xs text-purple-200/90 font-sans font-medium tracking-wide">
                      IMAX Enhanced & Masterpieces
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-purple-500/20 text-xs text-slate-200 font-sans leading-relaxed">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span>Ultra-HD 4K HDR & IMAX Ratio</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span>Spatial Surround & Multi-Audio Track</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span>Curated Directors & Film Premieres</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-xs font-sans text-purple-300/90 font-medium px-1">
                    <span>🟢 3,456 Watching</span>
                    <span>Dolby Vision</span>
                  </div>
                  <button 
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-xs font-sans tracking-[0.14em] uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_28px_rgba(168,85,247,0.8)] transition-all cursor-pointer"
                  >
                    <Film className="w-4 h-4 text-white" />
                    <span>ENTER VIDEO</span>
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

            {/* Main Streaming Grid: Bold Hero Turntable Deck & Sound Library on Left (8 Cols), Suggestions Sidebar on Right (4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: 8 Columns containing Wood Hero Console + Aurora Green Sound Library beneath it */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* 1. Hero Card - Vintage Polished Acoustic Rubberwood / Mahogany Veneer Console */}
                <div className="vintage-acoustic-wood-chassis relative rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden backdrop-blur-xl">
                  
                  {/* Polished Lacquer Mirror Top Reflection Line */}
                  <div className="wood-lacquer-reflection" />

                  {/* Subtle Woodgrain & Acoustic Starlight Nodes Overlay */}
                  <div className="absolute inset-0 bg-radial-nodes opacity-15 pointer-events-none" />

                  {/* Warm Brass / Golden Inlay Accent Inner Rim */}
                  <div className="absolute inset-0 rounded-[28px] sm:rounded-[32px] border border-amber-300/30 pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_3px_rgba(0,0,0,0.6)]" />

                  {/* Left Column: Symmetrical & Balanced Track Presentation Plate */}
                  <div className="relative z-10 flex flex-col justify-between self-stretch flex-1 min-w-0 py-0.5 space-y-5">
                    
                    {/* Top Row: Artist Avatar in Top Corner + Title, Artist & Album */}
                    <div className="flex items-start gap-4">
                      {/* Artist / Album Cover Art with Circular Gold-Beveled Frame */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 shadow-[0_10px_25px_rgba(0,0,0,0.85)] border-2 border-amber-300/60 ring-2 ring-amber-500/20 group">
                        <img 
                          src={currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'} 
                          alt={currentTrack?.artist || 'Music'} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        {isPlaying && (
                          <div className="absolute bottom-1 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black shadow-[0_0_8px_#34d399]" />
                        )}
                      </div>

                      {/* Song Title, Artist & Album Clean Typography */}
                      <div className="space-y-1 min-w-0 flex-1 pt-0.5">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-amber-50 font-sans drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] truncate">
                          {currentTrack?.title || 'No Track Selected'}
                        </h2>

                        <p className="text-sm sm:text-base text-amber-200 font-sans font-bold truncate drop-shadow-sm">
                          {currentTrack?.artist || 'Search any song in Music 2 to play'}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-amber-100/75 font-medium truncate pt-0.5">
                          <Disc3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{currentTrack?.album || 'Ready to Stream'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Controls Row: Coherent Uniform Audio Plaque Buttons */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="px-3 py-1.5 rounded-full wood-chassis-badge text-[11px] font-sans font-bold text-amber-200 tracking-wide">
                        {currentTrack?.genre || 'Global Catalog'}
                      </span>

                      <span className="px-3 py-1.5 rounded-full wood-chassis-badge text-[10.5px] font-mono font-bold text-amber-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                        <span>HI-RES AUDIO</span>
                      </span>

                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="wood-chassis-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-amber-200 hover:text-white text-[11px] font-sans font-bold tracking-wider active:translate-y-[1px] cursor-pointer"
                        title="Upload local MP3 file"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-300" />
                        <span>IMPORT MP3</span>
                      </button>
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleCustomAudioUpload} 
                        className="hidden" 
                      />
                    </div>

                  </div>

                  {/* Right Column: COMPACT ELEGANT 3D VINYL TURNTABLE (GRAMOPHONE) */}
                  <div className="turntable-3d-deck rounded-[26px] w-[275px] sm:w-[285px] h-[225px] sm:h-[235px] p-2 flex items-center justify-center shrink-0 relative overflow-hidden group select-none shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_3px_rgba(255,255,255,0.7)]">
                    
                    {/* Inner Refractive 3D Liquid Glass Plinth Slab with Beveled Rim */}
                    <div className="turntable-glass-plinth rounded-[24px]" />

                    {/* --- 1. 3D CIRCULAR SUNKEN RECESSED PLATTER WELL (Under the Disc) --- */}
                    <div 
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-[166px] h-[166px] rounded-full platter-well-3d flex items-center justify-center pointer-events-none"
                      style={{ left: '112px', top: '122px' }}
                    >
                      <div className="absolute inset-2 rounded-full border border-stone-800/60 pointer-events-none" />
                      <div className="absolute inset-4 rounded-full border border-stone-800/40 pointer-events-none" />
                      <div className="absolute inset-7 rounded-full border border-stone-800/25 pointer-events-none" />
                    </div>

                    {/* --- 2. 3D DIE-CAST PLATTER & GROOVED HIGH-GLOSS VINYL RECORD --- */}
                    <div 
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
                      style={{ left: '112px', top: '122px' }}
                    >
                      <div className="platter-chassis w-[152px] h-[152px] flex items-center justify-center relative">
                        <div className="strobe-dot-ring" />

                        <div 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className={`w-[140px] h-[140px] rounded-full relative flex items-center justify-center shadow-2xl cursor-pointer ${
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
                          <div className="absolute inset-2 rounded-full border border-stone-700/50 pointer-events-none" />
                          <div className="absolute inset-4 rounded-full border border-stone-800/60 pointer-events-none" />
                          <div className="absolute inset-7 rounded-full border border-stone-700/40 pointer-events-none" />
                          <div className="absolute inset-10 rounded-full border border-stone-800/50 pointer-events-none" />

                          <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${currentTrack ? `${currentTrack.colorFrom} ${currentTrack.colorTo}` : 'from-emerald-500 to-teal-700'} border border-amber-300/70 flex flex-col items-center justify-center shadow-xl relative z-10 text-center select-none`}>
                            <div className="absolute inset-0.5 rounded-full border border-amber-200/50 pointer-events-none" />
                            <div className="w-3 h-3 rounded-full bg-stone-950 border border-white/60 flex items-center justify-center shadow-inner">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow" />
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* --- 3. TACTILE METALLIC START / STOP PUSHBUTTON --- */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-30 px-2.5 py-1 rounded-full bg-gradient-to-b from-stone-800 via-stone-900 to-black border border-white/30 shadow-[0_4px_10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:border-amber-400/60 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer group/btn"
                      title={isPlaying ? "Stop Turntable" : "Start Turntable"}
                    >
                      <div className={`w-2 h-2 rounded-full transition-colors ${isPlaying ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-stone-600'}`} />
                      <span className="text-[8.5px] font-sans font-bold tracking-wider text-stone-200 group-hover/btn:text-white uppercase select-none">
                        {isPlaying ? 'STOP' : 'START'}
                      </span>
                    </button>

                    {/* --- 4. STATIONARY POLISHED MACHINED SILVER TONARMARM REST CRADLE --- */}
                    <div 
                      className="absolute pointer-events-none z-20 flex flex-col items-center"
                      style={{ 
                        left: '208px', 
                        top: '158px',
                        transform: 'translate(-50%, -50%)'
                      }}
                      title="Tonearm Silver Rest Cradle"
                    >
                      <div className="w-5 h-2 rounded-full bg-gradient-to-r from-stone-300 via-white to-stone-300 border border-stone-200 shadow-[0_2px_4px_rgba(0,0,0,0.85)] flex items-center justify-center relative">
                        <div className="w-3 h-1 bg-stone-700/80 rounded-full" />
                      </div>
                      <div className="w-1.5 h-4.5 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-500 rounded-b shadow-[0_2px_4px_rgba(0,0,0,0.9)] border-x border-white/70" />
                      <div className="w-3.5 h-1 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 rounded-full shadow" />
                    </div>

                    {/* --- 5. ARTICULATED TONEARM ASSEMBLY --- */}
                    <div 
                      className="absolute pointer-events-none z-30"
                      style={{
                        left: '232px',
                        top: '40px',
                        transform: isPlaying ? 'rotate(25deg)' : 'rotate(0deg)',
                        transformOrigin: '0px 0px',
                        transition: 'transform 850ms cubic-bezier(0.25, 0.8, 0.25, 1)'
                      }}
                    >
                      <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-800 border border-amber-300 shadow-xl flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-stone-800 to-stone-950 border border-amber-500/50 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                        </div>
                      </div>

                      <div className="absolute -top-2.5 left-2.5 w-3.5 h-3 bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 rounded-2xs border border-amber-300 shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

                      <svg 
                        className="absolute -left-[50px] -top-[10px] w-[100px] h-[150px] overflow-visible pointer-events-none filter drop-shadow-[2px_3px_5px_rgba(0,0,0,0.85)]" 
                        viewBox="-50 -10 100 150"
                      >
                        <path 
                          d="M 0 0 C 0 32, 8 60, -8 88 C -16 104, -20 112, -24 118" 
                          fill="none" 
                          stroke="url(#brass-chrome-tonearm-deck-compact)" 
                          strokeWidth="2.8" 
                          strokeLinecap="round" 
                        />
                        <defs>
                          <linearGradient id="brass-chrome-tonearm-deck-compact" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="35%" stopColor="#ffffff" />
                            <stop offset="70%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#78350f" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div 
                        className="absolute w-3.5 h-6 bg-gradient-to-b from-stone-950 via-stone-900 to-black border border-amber-500/60 rounded-xs shadow-[0_4px_10px_rgba(0,0,0,0.95)] flex flex-col justify-between p-0.5"
                        style={{
                          left: '-24px',
                          top: '118px',
                          transform: 'translate(-50%, -50%) rotate(-14deg)'
                        }}
                      >
                        <div className="flex items-center justify-between px-0.5">
                          <div className="w-1.5 h-0.5 bg-amber-400 rounded-2xs" />
                          <div className="w-1 h-1.5 bg-gradient-to-r from-amber-300 to-amber-600 rounded-2xs -mr-0.5" />
                        </div>
                        <div className="flex items-center justify-center pt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isPlaying 
                              ? 'bg-amber-300 shadow-[0_0_8px_3px_rgba(251,191,36,0.95)] opacity-100 scale-110' 
                              : 'bg-stone-700 opacity-25'
                          }`} />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* 2. COMPACT AURORA GREEN 3D LIQUID GLASS SOUND LIBRARY (Aligned Right Edge, Space Efficient) */}
                <div className="liquid-glass-aurora-card relative rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 border border-emerald-400/35 backdrop-blur-3xl overflow-hidden space-y-4 transition-all">
                  
                  {/* Aurora Borealis Shimmer, Liquid Waves & Specular Edge Light */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-300/90 to-transparent pointer-events-none" />
                  <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
                  <div className="absolute inset-0 bg-radial-nodes opacity-10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/30 pointer-events-none" />

                  {/* Unified Header Bar: Navigation Tabs & Quick Actions */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-emerald-400/20">
                    
                    {/* 3D Liquid Glass Rounded Navigation Pills */}
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-0.5 sm:pb-0 scrollbar-none shrink-0">
                      
                      {/* 1. MY LIBRARY */}
                      <button 
                        onClick={() => setMusicNavTab('library')}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold font-sans tracking-wider uppercase transition-all duration-200 cursor-pointer select-none active:translate-y-[1px] whitespace-nowrap shrink-0 ${
                          musicNavTab === 'library'
                            ? 'bg-gradient-to-b from-emerald-400/40 via-emerald-500/30 to-teal-600/25 text-emerald-100 border border-emerald-300/70 shadow-[0_4px_18px_rgba(16,185,129,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.45)] scale-[1.02]'
                            : 'text-emerald-200/75 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-emerald-500/20 hover:border-emerald-400/40'
                        }`}
                        title="Explore Sound Library"
                      >
                        <FolderHeart className={`w-3.5 h-3.5 ${musicNavTab === 'library' ? 'text-emerald-300' : 'text-emerald-400/70'}`} />
                        <span>MY LIBRARY</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-100 border border-emerald-400/40">
                          {AURA_TRACKS.length}
                        </span>
                      </button>

                      {/* 2. MY LIKES */}
                      <button 
                        onClick={() => setMusicNavTab('likes')}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold font-sans tracking-wider uppercase transition-all duration-200 cursor-pointer select-none active:translate-y-[1px] whitespace-nowrap shrink-0 ${
                          musicNavTab === 'likes'
                            ? 'bg-gradient-to-b from-rose-500/40 via-rose-600/30 to-pink-700/25 text-rose-100 border border-rose-300/70 shadow-[0_4px_18px_rgba(244,63,94,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.45)] scale-[1.02]'
                            : 'text-emerald-200/75 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-emerald-500/20 hover:border-rose-400/40'
                        }`}
                        title="My Liked Tracks"
                      >
                        <Heart className={`w-3.5 h-3.5 ${musicNavTab === 'likes' ? 'text-rose-300 fill-rose-400' : 'text-rose-400/70'}`} />
                        <span>MY LIKES</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/25 text-rose-100 border border-rose-400/40">
                          {Object.values(likedTracks).filter(Boolean).length}
                        </span>
                      </button>

                      {/* 3. MY PLAYLISTS */}
                      <button 
                        onClick={() => setMusicNavTab('playlists')}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold font-sans tracking-wider uppercase transition-all duration-200 cursor-pointer select-none active:translate-y-[1px] whitespace-nowrap shrink-0 ${
                          musicNavTab === 'playlists'
                            ? 'bg-gradient-to-b from-teal-400/40 via-emerald-500/30 to-teal-700/25 text-teal-100 border border-teal-300/70 shadow-[0_4px_18px_rgba(45,212,191,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.45)] scale-[1.02]'
                            : 'text-emerald-200/75 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-emerald-500/20 hover:border-teal-400/40'
                        }`}
                        title="Curated Playlists"
                      >
                        <Disc3 className={`w-3.5 h-3.5 ${musicNavTab === 'playlists' ? 'text-teal-300' : 'text-teal-400/70'}`} />
                        <span>MY PLAYLISTS</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-100 border border-emerald-400/40">
                          4
                        </span>
                      </button>

                    </div>

                    {/* Right Contextual Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {musicNavTab === 'library' && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-100 text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          <Upload className="w-3 h-3 text-emerald-300" />
                          <span>Add MP3</span>
                        </button>
                      )}

                      {musicNavTab === 'likes' && Object.values(likedTracks).filter(Boolean).length > 0 && (
                        <button
                          onClick={() => {
                            const firstLiked = AURA_TRACKS.find(t => likedTracks[t.id]);
                            if (firstLiked) selectAndPlayTrack(firstLiked);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play Likes</span>
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Integrated Space-Efficient Track List (Zero Wasted Space) */}
                  <div className="relative z-10">
                    {/* 1. MY LIBRARY LIST */}
                    {musicNavTab === 'library' && (
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                        {AURA_TRACKS.map(track => {
                          const isCurrent = currentTrack?.id === track.id;
                          const isLiked = likedTracks[track.id];
                          return (
                            <div 
                              key={track.id}
                              onClick={() => selectAndPlayTrack(track)}
                              className={`group flex items-center justify-between py-2 px-3 rounded-2xl transition-all cursor-pointer border ${
                                isCurrent 
                                  ? 'bg-emerald-500/25 border-emerald-300/70 shadow-[0_0_16px_rgba(16,185,129,0.3)]' 
                                  : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/15 hover:border-emerald-400/40'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow border border-emerald-300/40 group-hover:scale-105 transition-transform relative">
                                  <img 
                                    src={track.artistPhoto} 
                                    alt={track.title} 
                                    className="w-full h-full object-cover" 
                                  />
                                  {isCurrent && isPlaying && (
                                    <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className={`text-xs font-bold truncate transition-colors ${isCurrent ? 'text-emerald-200' : 'text-white group-hover:text-emerald-100'}`}>
                                    {track.title}
                                  </h4>
                                  <p className="text-[10.5px] text-emerald-200/70 truncate">{track.artist}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0 ml-2">
                                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-black/40 border border-emerald-400/20 text-[10px] font-sans text-emerald-200">
                                  {track.genre}
                                </span>
                                <button
                                  onClick={(e) => toggleLikeTrack(track.id, e)}
                                  className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Like"
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-emerald-400/50 group-hover:text-emerald-200'}`} />
                                </button>
                                <span className="font-mono text-[10px] text-emerald-100/80 w-8 text-right">{track.duration}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. MY LIKES LIST */}
                    {musicNavTab === 'likes' && (
                      <div>
                        {Object.values(likedTracks).filter(Boolean).length > 0 ? (
                          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                            {AURA_TRACKS.filter(t => likedTracks[t.id]).map(track => {
                              const isCurrent = currentTrack?.id === track.id;
                              return (
                                <div 
                                  key={track.id}
                                  onClick={() => selectAndPlayTrack(track)}
                                  className={`group flex items-center justify-between py-2 px-3 rounded-2xl border transition-all cursor-pointer ${
                                    isCurrent 
                                      ? 'bg-rose-500/25 border-rose-400/60 shadow-[0_0_16px_rgba(244,63,94,0.3)]' 
                                      : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/15 hover:border-emerald-400/40'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow border border-rose-300/40 group-hover:scale-105 transition-transform relative">
                                      <img 
                                        src={track.artistPhoto} 
                                        alt={track.title} 
                                        className="w-full h-full object-cover" 
                                      />
                                      {isCurrent && isPlaying && (
                                        <div className="absolute inset-0 bg-rose-950/60 flex items-center justify-center">
                                          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185] animate-ping" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                                      <p className="text-[10.5px] text-emerald-200/70 truncate">{track.artist}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2.5 shrink-0 ml-2">
                                    <button
                                      onClick={(e) => toggleLikeTrack(track.id, e)}
                                      className="p-1 text-rose-500 hover:text-rose-400 cursor-pointer"
                                      title="Unlike"
                                    >
                                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                                    </button>
                                    <span className="text-[10px] font-mono text-emerald-100/80 w-8 text-right">{track.duration}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 space-y-2">
                            <Heart className="w-6 h-6 text-rose-400 mx-auto" />
                            <h4 className="text-xs font-bold text-white">No Liked Tracks Yet</h4>
                            <p className="text-[11px] text-emerald-200/70">Click the heart on any track to pin it here.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. MY PLAYLISTS LIST */}
                    {musicNavTab === 'playlists' && (
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                        {getFilteredTracks().map(track => {
                          const isCurrent = currentTrack?.id === track.id;
                          const isLiked = likedTracks[track.id];
                          return (
                            <div 
                              key={track.id}
                              onClick={() => selectAndPlayTrack(track)}
                              className={`group flex items-center justify-between py-2 px-3 rounded-2xl border transition-all cursor-pointer ${
                                isCurrent 
                                  ? 'bg-emerald-500/25 border-emerald-300/70 shadow-[0_0_16px_rgba(16,185,129,0.3)]' 
                                  : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/15 hover:border-emerald-400/40'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow border border-teal-300/40 group-hover:scale-105 transition-transform relative">
                                  <img 
                                    src={track.artistPhoto} 
                                    alt={track.title} 
                                    className="w-full h-full object-cover" 
                                  />
                                  {isCurrent && isPlaying && (
                                    <div className="absolute inset-0 bg-teal-950/60 flex items-center justify-center">
                                      <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-ping" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                                  <p className="text-[10.5px] text-emerald-200/70 truncate">{track.artist}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0 ml-2">
                                <button
                                  onClick={(e) => toggleLikeTrack(track.id, e)}
                                  className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Favorite"
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-emerald-400/50'}`} />
                                </button>
                                <span className="text-[10px] font-mono text-emerald-100/80 w-8 text-right">{track.duration}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* RIGHT SIDEBAR: SUGGESTIONS QUEUE (4 Columns, Aligned Alongside) */}
              <div className="lg:col-span-4 rounded-[28px] sm:rounded-[36px] p-4 sm:p-5 bg-slate-950/50 backdrop-blur-3xl border border-white/15 flex flex-col justify-between space-y-3.5 shadow-2xl">
                
                {/* Header: Renamed to SUGGESTIONS without track count */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-[0.16em] text-amber-300 font-sans uppercase">SUGGESTIONS</span>
                  </div>
                </div>

                {/* Track List - Rounded & Compact */}
                <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin flex-1">
                  {getFilteredTracks().map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isLiked = likedTracks[track.id];
                    return (
                      <div 
                        key={track.id}
                        onClick={() => selectAndPlayTrack(track)}
                        className={`group flex items-center justify-between py-2 px-3.5 rounded-full transition-all cursor-pointer border ${
                          isCurrent 
                            ? 'bg-amber-500/20 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                            : 'bg-white/[0.04] hover:bg-white/[0.09] border-transparent hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
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

                          {/* Cover Art - Rounded Full with Artist Photo */}
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm relative border border-white/25 group-hover:border-amber-300/60 transition-colors">
                            <img 
                              src={track.artistPhoto} 
                              alt={track.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                            />
                            {isCurrent && isPlaying && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                              </div>
                            )}
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

              </div>

            </div>

            {/* --- LOCKED DOCKED 3D LIQUID GLASS BOTTOM MEDIA CONTROLLER (ALWAYS VISIBLE & PINNED) --- */}
            <div className="fixed bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-3.5rem)] max-w-2xl z-50 pointer-events-auto">
              <div className="relative w-full px-3 sm:px-6 py-2 sm:py-3 rounded-[24px] sm:rounded-[30px] backdrop-blur-3xl bg-slate-950/92 border border-white/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.22),_0_20px_50px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 overflow-hidden">
                
                {/* Brand-Colored Subtle Hairline Accents on Controller Background */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-400/80 via-cyan-300/60 to-purple-400/80 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/25 via-transparent to-emerald-500/25 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/35 pointer-events-none rounded-[24px] sm:rounded-[30px]" />

                {/* 1. LEFT ZONE: Current Track Identity with Circular Cover Art */}
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 max-w-[95px] sm:max-w-[190px] text-left relative z-10 shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-amber-300/40 shadow-sm relative ring-1 ring-amber-500/20">
                    <img 
                      src={currentTrack?.artistPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'} 
                      alt={currentTrack?.title || 'Music'} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] sm:text-sm font-bold text-white truncate font-sans">
                      {currentTrack?.title || 'No Track Selected'}
                    </h4>
                    <p className="text-[9.5px] sm:text-xs text-slate-300 font-sans font-medium truncate">
                      {currentTrack?.artist || 'Search music in Music 2'}
                    </p>
                  </div>
                </div>

                {/* 2. CENTER ZONE: Transport Controls & Interactive Scrubber (Balanced Standard Spacing) */}
                <div className="flex-1 min-w-0 max-w-xs sm:max-w-md flex flex-col items-center gap-1 sm:gap-2 px-0.5 sm:px-2 relative z-10">
                  {/* Subtle frosted glass grouping cradle with delicate cloudy diffused neon halo around transport buttons */}
                  <div className="relative group/player-cradle">
                    {/* Soft cloudy, delicate diffused neon ambient halo */}
                    <div className="player-neon-cloud" />

                    <div className="relative flex items-center gap-1 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-950/75 border border-amber-400/35 backdrop-blur-xl shadow-[0_4px_22px_rgba(245,158,11,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.18)]">
                      {/* Shuffle Button (Hidden on Mobile for Optimal Spacing) */}
                      <button 
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`hidden sm:inline-flex p-1.5 rounded-full transition-all cursor-pointer ${
                          isShuffle ? 'text-amber-300 bg-amber-400/20 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-stone-400 hover:text-white'
                        }`}
                        title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={handlePrevTrack}
                        className="p-1 sm:p-1.5 rounded-full text-stone-300 hover:text-amber-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                        title="Previous track"
                      >
                        <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-slate-950 flex items-center justify-center hover:scale-108 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.75)] cursor-pointer group/playbtn shrink-0"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {/* Concentric subtle play ring */}
                        <span className={`absolute -inset-1 rounded-full border border-yellow-300/40 pointer-events-none ${isPlaying ? 'animate-pulse' : ''}`} />
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-slate-950 text-slate-950" />
                        ) : (
                          <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
                        )}
                      </button>

                      <button 
                        onClick={handleNextTrack}
                        className="p-1 sm:p-1.5 rounded-full text-stone-300 hover:text-amber-300 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                        title="Next track"
                      >
                        <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      {/* Repeat Button (Hidden on Mobile for Optimal Spacing) */}
                      <button 
                        onClick={() => setIsRepeat(!isRepeat)}
                        className={`hidden sm:inline-flex p-1.5 rounded-full transition-all cursor-pointer ${
                          isRepeat ? 'text-amber-300 bg-amber-400/20 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-stone-400 hover:text-white'
                        }`}
                        title={isRepeat ? "Repeat On" : "Repeat Off"}
                      >
                        <Repeat className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Track Progress Scrubber with Precision Synchronized Time */}
                  <div className="w-full h-6 sm:h-7 flex items-center gap-1.5 sm:gap-2.5">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-200/90 w-7 sm:w-8 text-right shrink-0 select-none">
                      {formatSecondsToDisplay(currentTrackSeconds)}
                    </span>
                    
                    <div 
                      onPointerDown={handlePointerDownScrubberApp}
                      onPointerMove={handlePointerMoveScrubberApp}
                      onPointerUp={handlePointerUpScrubberApp}
                      onPointerCancel={handlePointerUpScrubberApp}
                      className="flex-1 py-2 sm:py-2.5 cursor-pointer relative group/scrubber select-none touch-none"
                      title="Click or drag to seek forward / backward"
                    >
                      {/* Rail */}
                      <div className="w-full h-1.5 sm:h-2 bg-white/10 group-hover/scrubber:bg-white/20 rounded-full overflow-hidden transition-colors">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 rounded-full" 
                          style={{ width: `${Math.min(100, Math.max(0, trackProgress))}%` }}
                        />
                      </div>
                      {/* Knob */}
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-white shadow-[0_0_12px_#fef08a] pointer-events-none transition-all ${
                          isScrubbingApp ? 'scale-125 opacity-100 ring-2 ring-amber-400' : 'opacity-0 group-hover/scrubber:opacity-100 group-hover/scrubber:scale-110'
                        }`}
                        style={{ left: `${Math.min(100, Math.max(0, trackProgress))}%` }}
                      />
                    </div>

                    <span className="text-[9px] sm:text-[10px] font-mono font-medium text-stone-400 w-7 sm:w-8 text-left shrink-0 select-none">
                      {currentTrack ? formatSecondsToDisplay(audioDuration || currentTrack.durationSeconds || 180) : '0:00'}
                    </span>
                  </div>
                </div>

                {/* 3. RIGHT ZONE: Enriched Wave Orb (Matches Transport Cradle Height) + Volume Aligned with Scrubber */}
                <div className="flex flex-col items-center justify-between self-stretch shrink-0 relative z-10 py-0.5">
                  
                  {/* Circular Button for Dynamic Wavy Visualizer (Enlarged to match transport buttons cradle) */}
                  <div 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-emerald-400/45 bg-slate-950/90 shadow-[0_0_15px_rgba(52,211,153,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)] relative flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
                    title="Audio-Reactive Frequency Waveform (Northern Aurora Engine)"
                  >
                    <canvas 
                      ref={freqCanvasRef} 
                      className={`w-full h-full block transition-opacity duration-300 ${isPlaying ? 'opacity-95' : 'opacity-40'}`} 
                    />
                    {/* Glass Specular Rim */}
                    <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
                  </div>

                  {/* Volume Control - Perfectly Aligned Horizontally with the Time Scrubber Line */}
                  <div className="h-5 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]">
                    <button 
                      onClick={() => setAmbientVolume(v => (v > 0 ? 0 : 70))}
                      className="text-stone-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-center"
                      title={ambientVolume === 0 ? "Unmute" : "Mute"}
                    >
                      {ambientVolume === 0 ? (
                        <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                      )}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(Number(e.target.value))}
                      className="hidden sm:inline-block w-12 sm:w-14 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-400"
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

        {/* ========================================================= */}
        {/* === VIEW 5: STANDALONE WIDESCREEN MUSIC 2 (PULSE STREAMING) === */}
        {/* ========================================================= */}
        {currentWorld === 'music2' && (
          <MusicV2View 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            trackProgress={trackProgress}
            currentTrackSeconds={currentTrackSeconds}
            audioDuration={audioDuration}
            handleSeek={handleSeek}
            likedTracks={likedTracks}
            toggleLikeTrack={toggleLikeTrack}
            allTracks={AURA_TRACKS}
            onSelectTrack={(track) => selectAndPlayTrack(track)}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            isShuffle={isShuffle}
            setIsShuffle={setIsShuffle}
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
          />
        )}

      </main>

    </div>
  );
}
