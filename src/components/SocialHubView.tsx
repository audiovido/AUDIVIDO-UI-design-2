import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, Home, Users, MessageSquare, Flag, 
  Bell, ChevronDown, Flame, MoreHorizontal, Smile, Send, 
  Play, Pause, Volume2, VolumeX, Pin, Film, Disc3, Check, Sparkles
} from 'lucide-react';
import { AudioSynth } from '../utils/AudioSynth';

interface SocialHubViewProps {
  onNavigateHome: () => void;
  onPlayTrack?: (trackId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  badge?: string;
}

interface EventCard {
  id: string;
  month: string;
  day: string;
  title: string;
  type: 'movie' | 'music';
  subtitle: string;
  description: string;
  coverImage: string;
  hostName: string;
  hostRole: string;
  hostAvatar: string;
  participantsCount: number;
  fireCount: number;
  isRsvpd: boolean;
  hasFired: boolean;
}

export const SocialHubView: React.FC<SocialHubViewProps> = ({ onNavigateHome, onPlayTrack }) => {
  // Navigation active tab (Decluttered to 4 clear primary destinations)
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'clubs' | 'chat' | 'premieres'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Soft atmospheric ambient pad music state (Default: disabled / silent)
  const [isAmbientPadPlaying, setIsAmbientPadPlaying] = useState(false);

  // Cleanup when unmounting Social tab
  useEffect(() => {
    return () => {
      if (AudioSynth.getActiveType() === 'social-pad') {
        AudioSynth.stopAll();
      }
    };
  }, []);

  const handleToggleAmbientPad = () => {
    const newState = AudioSynth.toggleSocialPad();
    setIsAmbientPadPlaying(newState);
  };

  // Live video stream state
  const [isLiveStreamPlaying, setIsLiveStreamPlaying] = useState(true);
  const [isLiveStreamMuted, setIsLiveStreamMuted] = useState(true);

  // Live chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'Suny Suka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'Wow keep it up dude 🔥🔥 The Atmos sound mix is unreal!',
      time: '09:00',
      badge: 'VIP'
    },
    {
      id: 'c2',
      sender: 'Arman Bahir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Amazing visual quality! The 4K stream is crystal clear.',
      time: '09:01'
    },
    {
      id: 'c3',
      sender: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      text: 'Can you breakdown the Hans Zimmer organ motifs next? 😇',
      time: '09:10'
    },
    {
      id: 'c4',
      sender: 'Stevany Poetri',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      text: 'Great quality stream, thanks guys! Best watch party.',
      time: '09:20'
    },
    {
      id: 'c5',
      sender: 'Sarah Houtdshon',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      text: '🙌 Such great sound clarity, gave me real chills!',
      time: '09:22'
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Adam Lalana (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'PRO'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setNewCommentText('');
  };

  // Stories (Live Stream Members)
  const stories = [
    { id: 's1', name: 'Quinn', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', isLive: true },
    { id: 's2', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', isLive: true },
    { id: 's3', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', isLive: false },
    { id: 's4', name: 'Sebastian', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', isLive: true },
    { id: 's5', name: 'Stevy', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', isLive: false },
    { id: 's6', name: 'Jose', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80', isLive: true },
    { id: 's7', name: 'Alita', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', isLive: false },
    { id: 's8', name: 'Andrew', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', isLive: true }
  ];

  // Clean Groups
  const groups = [
    { id: 'g1', name: 'IMAX Cinema Club', category: 'Movie Lounge', members: '4.8k', icon: '🎬' },
    { id: 'g2', name: 'Lo-Fi Vinyl Lounge', category: 'Ambient Beats', members: '6.2k', icon: '🎧' },
    { id: 'g3', name: 'Dolby Atmos Creators', category: 'Spatial Sound', members: '2.9k', icon: '🌌' },
    { id: 'g4', name: 'Sci-Fi Film Directors', category: 'Cinematography', members: '3.1k', icon: '🚀' }
  ];

  // Friends List
  const friends = [
    { id: 'f1', name: 'Eleanor Pena', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', isOnline: false, info: '11 min' },
    { id: 'f2', name: 'Leslie Alexander', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', isOnline: true, info: 'Dunkirk 4K' },
    { id: 'f3', name: 'Brooklyn Simmons', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', isOnline: true, info: 'Cosmic Voyage' },
    { id: 'f4', name: 'Arlene McCoy', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', isOnline: false, info: '11 min' },
    { id: 'f5', name: 'Jerome Bell', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', isOnline: false, info: '9 min' },
    { id: 'f6', name: 'Darlene Robertson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isOnline: true, info: 'IMAX Room' },
    { id: 'f7', name: 'Kathryn Murphy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', isOnline: true, info: 'Lo-Fi Beat' }
  ];

  // Event Cards
  const [eventCards, setEventCards] = useState<EventCard[]>([
    {
      id: 'ev-1',
      month: 'MAY',
      day: '08',
      type: 'movie',
      title: 'Interstellar IMAX Watch Party & Spatial Audio Breakdown',
      subtitle: 'Thu 10:00 · Dolby Atmos Room',
      description: 'Synchronized community screening with live director commentary, acoustic breakdown of Hans Zimmer’s organ score, and real-time chat.',
      coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      hostName: 'Valentino Del More',
      hostRole: 'Film Director & Sound Architect',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      participantsCount: 73,
      fireCount: 12,
      isRsvpd: false,
      hasFired: false
    },
    {
      id: 'ev-2',
      month: 'MAY',
      day: '09',
      type: 'music',
      title: 'Midnight Synthwave & High-Res Vinyl Master Listening Session',
      subtitle: 'Fri 10:00 · 96kHz / 24-bit Feed',
      description: 'Exclusive listening lounge featuring unreleased analog synth stems, real-time multi-track mixing, and interactive artist Q&A.',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      hostName: 'Angelina Joly',
      hostRole: 'Creative Director & Producer',
      hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      participantsCount: 142,
      fireCount: 48,
      isRsvpd: true,
      hasFired: true
    }
  ]);

  const toggleRsvp = (id: string) => {
    setEventCards(prev => prev.map(card => {
      if (card.id === id) {
        const nextRsvp = !card.isRsvpd;
        return {
          ...card,
          isRsvpd: nextRsvp,
          participantsCount: nextRsvp ? card.participantsCount + 1 : card.participantsCount - 1
        };
      }
      return card;
    }));
  };

  const toggleFire = (id: string) => {
    setEventCards(prev => prev.map(card => {
      if (card.id === id) {
        const nextFired = !card.hasFired;
        return {
          ...card,
          hasFired: nextFired,
          fireCount: nextFired ? card.fireCount + 1 : card.fireCount - 1
        };
      }
      return card;
    }));
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.info.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 animate-fadeIn py-2 relative z-20">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: LUMINOUS FROSTED WHITE & PALE SKY BLUE LIQUID GLASS        */}
      {/* ========================================================================= */}
      <header className="w-full social-liquid-glass rounded-2xl sm:rounded-3xl p-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left: Portal Return & Search Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold tracking-wider transition-all cursor-pointer active:scale-95 shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
            title="Return to Cosmic Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PORTAL</span>
          </button>

          {/* Monogram Brand Capsule */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-white via-sky-200 to-sky-400 flex items-center justify-center text-slate-900 font-extrabold text-sm shadow-[0_0_14px_rgba(255,255,255,0.5)]">
            <span>A</span>
          </div>

          {/* Clean Rounded Search Bar */}
          <div className="relative hidden md:flex items-center w-52 lg:w-60">
            <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search streams, friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/25 focus:border-sky-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-300/80 outline-none transition-all font-sans"
            />
          </div>
        </div>

        {/* Center: Clean Decluttered Navigation Pill (4 Clear Primary Destinations) */}
        <nav className="flex items-center gap-1.5 p-1 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl">
          <button 
            onClick={() => setActiveNavTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeNavTab === 'home' 
                ? 'bg-white text-slate-900 shadow-[0_0_12px_rgba(255,255,255,0.6)] font-bold' 
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
            title="Home Feed"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Feed</span>
          </button>

          <button 
            onClick={() => setActiveNavTab('clubs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeNavTab === 'clubs' 
                ? 'bg-white text-slate-900 shadow-[0_0_12px_rgba(255,255,255,0.6)] font-bold' 
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
            title="Clubs & Watch Parties"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clubs</span>
          </button>

          <button 
            onClick={() => setActiveNavTab('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeNavTab === 'chat' 
                ? 'bg-white text-slate-900 shadow-[0_0_12px_rgba(255,255,255,0.6)] font-bold' 
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
            title="Live Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Chat</span>
          </button>

          <button 
            onClick={() => setActiveNavTab('premieres')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeNavTab === 'premieres' 
                ? 'bg-white text-slate-900 shadow-[0_0_12px_rgba(255,255,255,0.6)] font-bold' 
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
            title="Premieres"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Premieres</span>
          </button>
        </nav>

        {/* Right: Ambient Pad Music Toggle, Notifications & User Profile Capsule */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Ambient Pad Toggle Button (Small, chic, with animated soundwave) */}
          <button 
            onClick={handleToggleAmbientPad}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-sm ${
              isAmbientPadPlaying 
                ? 'bg-sky-400/25 border-sky-300/70 text-sky-100 shadow-[0_0_15px_rgba(56,189,248,0.45)]' 
                : 'bg-white/10 hover:bg-white/15 border-white/20 text-slate-300 hover:text-white'
            }`}
            title={isAmbientPadPlaying ? "Mute Ambient Pad Music" : "Play Soft Ambient Pad Music"}
          >
            {isAmbientPadPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 pr-0.5">
                <span className="w-0.5 h-2 bg-sky-300 rounded-full animate-pulse" />
                <span className="w-0.5 h-3.5 bg-cyan-200 rounded-full animate-bounce" style={{ animationDuration: '650ms' }} />
                <span className="w-0.5 h-2.5 bg-sky-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-[11px] font-sans tracking-wide">
              {isAmbientPadPlaying ? 'Ambient Pad' : 'Pad Muted'}
            </span>
          </button>

          <button 
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all cursor-pointer active:scale-95"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-sky-200" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-300 animate-pulse shadow-[0_0_6px_#7dd3fc]" />
          </button>

          <div className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 transition-all cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
              alt="Adam Lalana" 
              className="w-7 h-7 rounded-xl object-cover border border-white/50 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            />
            <span className="text-xs font-semibold text-white hidden lg:inline">Adam Lalana</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. THREE-COLUMN FROSTED GLASS LAYOUT (LUMINOUS WHITE & PALE SKY BLUE)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ======================================================= */}
        {/* COLUMN 1: CLUBS & ONLINE FRIENDS (CLEAN & DECLUTTERED)  */}
        {/* ======================================================= */}
        <aside className="lg:col-span-3 social-liquid-glass rounded-3xl p-5 space-y-6">
          
          {/* Section 1: STREAM CLUBS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-sky-100">
              <span>YOUR CLUBS</span>
              <span className="text-[10px] text-sky-300 cursor-pointer hover:underline font-mono">+ CREATE</span>
            </div>

            <div className="space-y-2">
              {groups.map(grp => (
                <div 
                  key={grp.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-sky-300/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{grp.icon}</span>
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-sky-200 transition-colors line-clamp-1">
                        {grp.name}
                      </h4>
                      <p className="text-[10px] text-sky-200/80 font-sans">{grp.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-sky-100 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                    {grp.members}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/15" />

          {/* Section 2: FRIENDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-sky-100">
              <span>STREAM MATES</span>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {friends.filter(f => f.isOnline).length} ONLINE
              </span>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredFriends.map(fr => (
                <div 
                  key={fr.id}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/15 border border-transparent hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img 
                        src={fr.avatar} 
                        alt={fr.name} 
                        className="w-8 h-8 rounded-xl object-cover border border-white/25 group-hover:border-sky-300 transition-colors"
                      />
                      {fr.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-[0_0_6px_#10b981]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-sky-200 transition-colors">
                        {fr.name}
                      </h4>
                      <p className="text-[10px] text-sky-200/80 font-sans truncate max-w-[120px]">
                        {fr.info}
                      </p>
                    </div>
                  </div>

                  <div>
                    {fr.isOnline ? (
                      <span className="w-2 h-2 rounded-full bg-sky-300 inline-block shadow-[0_0_6px_#7dd3fc]" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-300">{fr.info}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* COLUMN 2: CENTER STORIES & STREAM EVENT CARDS (FROSTED WHITE/BLUE GLASS) */}
        {/* ========================================================================= */}
        <main className="lg:col-span-5 space-y-5">
          
          {/* Top Stories Row */}
          <div className="social-liquid-glass rounded-3xl p-3.5 overflow-hidden">
            <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none">
              {stories.map(st => (
                <div key={st.id} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer">
                  <div className={`p-0.5 rounded-full bg-gradient-to-tr from-white via-sky-300 to-sky-500 shadow-md transition-transform group-hover:scale-108`}>
                    <div className="p-0.5 rounded-full bg-slate-950">
                      <img 
                        src={st.avatar} 
                        alt={st.name} 
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-200 group-hover:text-sky-200 transition-colors font-sans">
                    {st.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Cards (Clean, Luminous, and Simplified) */}
          <div className="space-y-4">
            {eventCards.map(card => (
              <div 
                key={card.id}
                className="social-liquid-glass rounded-3xl p-5 transition-all duration-300 flex flex-col md:flex-row gap-5 group"
              >
                {/* Left Card Visual */}
                <div className="md:w-5/12 h-44 md:h-auto rounded-2xl overflow-hidden relative shrink-0">
                  <img 
                    src={card.coverImage} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[9px] font-mono font-bold tracking-wider text-sky-200 flex items-center gap-1.5">
                    {card.type === 'movie' ? <Film className="w-3 h-3 text-sky-300" /> : <Disc3 className="w-3 h-3 text-amber-300" />}
                    <span>{card.type === 'movie' ? 'CINEMA' : 'MUSIC'}</span>
                  </div>
                </div>

                {/* Right Card Content */}
                <div className="md:w-7/12 flex flex-col justify-between space-y-3">
                  
                  <div>
                    {/* Date Badge & Title Header */}
                    <div className="flex items-start gap-3">
                      
                      {/* Cyan/Blue Rounded Square Date Badge */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-300 via-cyan-400 to-blue-600 text-slate-950 flex flex-col items-center justify-center font-mono shrink-0 shadow-[0_0_12px_rgba(125,211,252,0.5)]">
                        <span className="text-[8.5px] font-black uppercase tracking-wider">{card.month}</span>
                        <span className="text-sm font-black leading-none">{card.day}</span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-sky-200 transition-colors line-clamp-2 font-sans leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-[10px] text-sky-300/90 font-mono mt-0.5">
                          {card.subtitle}
                        </p>
                      </div>

                      <button className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-200 leading-relaxed font-sans mt-2.5 line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Host Info */}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                    <img 
                      src={card.hostAvatar} 
                      alt={card.hostName} 
                      className="w-5 h-5 rounded-full object-cover border border-white/40"
                    />
                    <div className="text-[10.5px]">
                      <span className="font-semibold text-white">{card.hostName}</span>
                      <span className="text-sky-200/80 ml-1.5 text-[9.5px]">
                        {card.hostRole}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Interaction Bar (RSVP & Fire Reaction Only - Clean & Focused) */}
                  <div className="flex items-center justify-between pt-1">
                    
                    {/* RSVP Button */}
                    <button 
                      onClick={() => toggleRsvp(card.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                        card.isRsvpd
                          ? 'bg-white text-slate-950 shadow-[0_0_14px_rgba(255,255,255,0.7)] font-bold'
                          : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
                      <span>{card.participantsCount} Participants</span>
                      {card.isRsvpd && <Check className="w-3.5 h-3.5 ml-0.5" />}
                    </button>

                    {/* Fire Reaction Button */}
                    <button 
                      onClick={() => toggleFire(card.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        card.hasFired 
                          ? 'text-amber-300 bg-amber-400/20 border border-amber-300/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                          : 'text-slate-300 hover:text-amber-300 hover:bg-white/10 border border-transparent'
                      }`}
                      title="React with Fire"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      <span>{card.fireCount}</span>
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </main>

        {/* ========================================================================= */}
        {/* COLUMN 3: RIGHT SIDEBAR - LIVE STREAM & LIVE CHAT (FROSTED GLASS)         */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 space-y-4">
          
          {/* Live Video Stage */}
          <div className="social-liquid-glass rounded-3xl overflow-hidden relative group">
            
            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" 
                alt="Live Streamers" 
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

              {/* Red LIVE Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>LIVE · 3,456</span>
              </div>

              {/* Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button 
                  onClick={() => setIsLiveStreamMuted(!isLiveStreamMuted)}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
                  title={isLiveStreamMuted ? "Unmute" : "Mute"}
                >
                  {isLiveStreamMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-sky-300" />}
                </button>
                <button 
                  onClick={() => setIsLiveStreamPlaying(!isLiveStreamPlaying)}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
                >
                  {isLiveStreamPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>
              </div>

              {/* Floating Viewer Bubble */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                  <span>Alex Just Joining 🎧</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-amber-400/25 border border-amber-300/40 text-amber-200 font-mono text-[10px]">
                  🔥 1.4K
                </div>
              </div>
            </div>

            {/* Live Chat Section */}
            <div className="p-4 space-y-3 bg-white/[0.05]">
              
              {/* Luminous Pale Blue Header */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-sky-400/40 via-blue-500/35 to-cyan-400/30 border border-white/30 text-white shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs">Live Chat</span>
                  <span className="text-[10px] font-mono text-sky-200 bg-white/15 px-2 py-0.5 rounded-full">
                    1.5k online
                  </span>
                </div>
              </div>

              {/* Pinned Message */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/20 text-[10.5px] text-sky-100">
                <Pin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span className="line-clamp-1">
                  <strong>Pinned:</strong> Welcome! Drop your movie & track recommendations.
                </span>
              </div>

              {/* Message Stream */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin text-xs">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="flex items-start justify-between gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-start gap-2">
                      <img 
                        src={msg.avatar} 
                        alt={msg.sender} 
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-white/25"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white text-[11px]">{msg.sender}</span>
                          {msg.badge && (
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/20 text-sky-200 border border-white/30">
                              {msg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-200 font-sans leading-relaxed mt-0.5">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendComment} className="relative flex items-center pt-1">
                <div className="w-full relative flex items-center">
                  <button 
                    type="button" 
                    className="absolute left-3 text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Add your comment..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/25 focus:border-sky-300 rounded-full pl-9 pr-10 py-2 text-xs text-white placeholder-slate-300/80 outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                  />
                  <button 
                    type="submit" 
                    disabled={!newCommentText.trim()}
                    className="absolute right-1.5 w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-108 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.6)] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};
