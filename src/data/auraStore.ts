/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Aura Store - Central static repository and helper schemas

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artistPhoto?: string;
  duration: string;
  durationSeconds?: number;
  genre: string;
  vibes: string[];
  cozyIndex: number; // 0-100 rating for warm wood cabins
  colorFrom: string;
  colorTo: string;
  audioSynthType: 'music' | 'fireplace' | 'aura-lofi';
  previewUrl?: string;
  year?: string;
  source?: string;
  artistBio?: string;
  isFullTrack?: boolean;
}

export interface MovieCast {
  name: string;
  role: string;
  photo: string;
}

export interface MovieReview {
  id: string;
  author: string;
  avatar: string;
  time: string;
  rating: number;
  text: string;
  likes: number;
  comments: number;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  genres?: string[];
  year: number;
  rating: string;
  duration: string;
  description: string;
  posterGradient: string;
  posterUrl?: string;
  backdropUrl?: string;
  videoColor: string; // Dynamic glow surrounding the screen
  director: string;
  cast: string[];
  castMembers?: MovieCast[];
  score?: number;
  ratedCount?: string;
  rottenTomatoes?: number;
  imdb?: number;
  justWatch?: number;
  reviews?: MovieReview[];
}

export interface Actor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isFollowing: boolean;
  famousFor: string;
}

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatarSeed: string; // Determines styling
  content: string;
  timestamp: string;
  reactions: {
    love: number;
    fire: number;
    star: number;
  };
  hasReacted: {
    love: boolean;
    fire: boolean;
    star: boolean;
  };
  attachedTrackId?: string;
}

export interface LiveStream {
  id: string;
  channel: string;
  streamer: string;
  viewers: number;
  category: 'Music' | 'Cinema' | 'Chat';
  gradient: string;
  avatarSeed: string;
}

export interface AuraEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  attendeesCount: number;
  rsvpStatus: 'not_going' | 'going';
  description: string;
}

export const AURA_TRACKS: Track[] = [
  // Chill Vibe
  {
    id: 'track-chill-1',
    title: 'Midnight Study Session',
    artist: 'Lofi Fruits Music',
    album: 'Chill Study Beats Vol. 1',
    duration: '2:45',
    durationSeconds: 165,
    genre: 'Lo-Fi / Chill',
    vibes: ['Chill', 'Study', 'Focus'],
    cozyIndex: 95,
    colorFrom: 'from-emerald-500',
    colorTo: 'to-teal-700',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Lofi%20Fruits%20Midnight%20Study',
    year: '2024',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-chill-2',
    title: 'Coffee & Rainy Windows',
    artist: 'Chillhop Essentials',
    album: 'Autumn Memories',
    duration: '3:12',
    durationSeconds: 192,
    genre: 'Lo-Fi / Instrumental',
    vibes: ['Chill', 'Rain', 'Warm'],
    cozyIndex: 92,
    colorFrom: 'from-teal-500',
    colorTo: 'to-cyan-700',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Chillhop%20Rainy%20Windows',
    year: '2023',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-chill-3',
    title: 'Tokyo Night Walk',
    artist: 'Kupla & Jinsang',
    album: 'Shibuya Neon',
    duration: '2:58',
    durationSeconds: 178,
    genre: 'Chillhop',
    vibes: ['Chill', 'Night', 'Soul'],
    cozyIndex: 88,
    colorFrom: 'from-lime-500',
    colorTo: 'to-emerald-700',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Kupla%20Jinsang%20Tokyo',
    year: '2024',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-chill-4',
    title: 'Warm Blanket Glow',
    artist: 'Idealism',
    album: 'Hiraeth EP',
    duration: '2:30',
    durationSeconds: 150,
    genre: 'Ambient Lo-Fi',
    vibes: ['Chill', 'Peace', 'Acoustic'],
    cozyIndex: 96,
    colorFrom: 'from-emerald-400',
    colorTo: 'to-green-600',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Idealism%20Warm%20Blanket',
    year: '2023',
    source: 'Curated Hi-Fi'
  },

  // Relax Vibe
  {
    id: 'track-relax-1',
    title: 'Ocean Sunset Whispers',
    artist: 'Tycho',
    album: 'Dive Extended',
    duration: '3:45',
    durationSeconds: 225,
    genre: 'Ambient / Sunset',
    vibes: ['Relax', 'Ocean', 'Sunset'],
    cozyIndex: 90,
    colorFrom: 'from-cyan-500',
    colorTo: 'to-blue-700',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Tycho%20Dive%20Ambient',
    year: '2024',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-relax-2',
    title: 'Deep Forest Solitude',
    artist: 'Brian Eno',
    album: 'Atmospheres Vol. 4',
    duration: '4:20',
    durationSeconds: 260,
    genre: 'Ambient Drone',
    vibes: ['Relax', 'Meditation', 'Space'],
    cozyIndex: 85,
    colorFrom: 'from-violet-500',
    colorTo: 'to-purple-800',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Brian%20Eno%20Atmospheres',
    year: '2022',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-relax-3',
    title: 'Starlit Horizon',
    artist: 'Bonobo',
    album: 'Migration Echoes',
    duration: '3:50',
    durationSeconds: 230,
    genre: 'Melodic Chill',
    vibes: ['Relax', 'Cosmic', 'Atmospheric'],
    cozyIndex: 89,
    colorFrom: 'from-purple-500',
    colorTo: 'to-indigo-800',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Bonobo%20Migration%20Horizon',
    year: '2023',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-relax-4',
    title: 'Gentle Acoustic Dawn',
    artist: 'Acoustic Haven',
    album: 'Sunrise Strings',
    duration: '3:05',
    durationSeconds: 185,
    genre: 'Acoustic / Folk',
    vibes: ['Relax', 'Morning', 'Acoustic'],
    cozyIndex: 94,
    colorFrom: 'from-amber-500',
    colorTo: 'to-orange-700',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Acoustic%20Haven%20Dawn',
    year: '2024',
    source: 'Curated Hi-Fi'
  },

  // Workout Vibe
  {
    id: 'track-workout-1',
    title: 'Cyberpunk Nitro Run',
    artist: 'Carpenter Brut',
    album: 'Turbo Drive 2088',
    duration: '3:30',
    durationSeconds: 210,
    genre: 'Synthwave / Workout',
    vibes: ['Workout', 'Energy', 'Nitro'],
    cozyIndex: 70,
    colorFrom: 'from-rose-500',
    colorTo: 'to-red-700',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Carpenter%20Brut%20Turbo',
    year: '2024',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-workout-2',
    title: 'Peak Cardio Pulse',
    artist: 'The Prodigy',
    album: 'Invaders Must Die',
    duration: '3:55',
    durationSeconds: 235,
    genre: 'High Energy EDM',
    vibes: ['Workout', 'Cardio', 'Pulse'],
    cozyIndex: 65,
    colorFrom: 'from-lime-500',
    colorTo: 'to-emerald-600',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=The%20Prodigy%20Invaders%20Workout',
    year: '2023',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-workout-3',
    title: 'Hyperdrive Velocity',
    artist: 'Kavinsky',
    album: 'Reborn Fast',
    duration: '3:15',
    durationSeconds: 195,
    genre: 'Electronic Drive',
    vibes: ['Workout', 'Speed', 'Electro'],
    cozyIndex: 72,
    colorFrom: 'from-amber-500',
    colorTo: 'to-yellow-600',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Kavinsky%20Nightcall%20Speed',
    year: '2024',
    source: 'Curated Hi-Fi'
  },
  {
    id: 'track-workout-4',
    title: 'Titan Force 180',
    artist: 'Daft Punk',
    album: 'Alive Workout Special',
    duration: '4:02',
    durationSeconds: 242,
    genre: 'Electro House',
    vibes: ['Workout', 'Power', 'Club'],
    cozyIndex: 68,
    colorFrom: 'from-emerald-400',
    colorTo: 'to-lime-500',
    audioSynthType: 'music',
    artistPhoto: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    previewUrl: '/api/resolve-stream?q=Daft%20Punk%20Harder%20Better',
    year: '2023',
    source: 'Curated Hi-Fi'
  }
];

export const AURA_MOVIES: Movie[] = [
  {
    id: 'movie-spiderman',
    title: 'Spider-Man: Into the Spider-Verse',
    genre: 'Animation · Action · Comedy',
    genres: ['Animation', 'Action', 'Comedy'],
    year: 2018,
    rating: 'PG',
    duration: '1h 57m',
    score: 7.8,
    ratedCount: '122K Rated',
    rottenTomatoes: 97,
    imdb: 8.4,
    justWatch: 97,
    description: 'Teenager Miles Morales becomes the new Spider-Man and joins other alternate-universe Spider-Heroes from parallel dimensions to stop a threat to all reality.',
    posterGradient: 'from-purple-950 via-fuchsia-950 to-slate-950',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80',
    videoColor: 'rgba(236, 72, 153, 0.5)',
    director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Jake Johnson', 'Mahershala Ali'],
    castMembers: [
      { name: 'Shameik Moore', role: 'Miles Morales', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' },
      { name: 'Jake Johnson', role: 'Peter B. Parker', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80' },
      { name: 'Mahershala Ali', role: 'Uncle Aaron', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Alfonso Rosser',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        time: '7 months ago',
        rating: 5,
        text: 'Spider-Man: Into The Spider-Verse Redefines The Superhero Genre With Stunning Visuals And A Compelling Narrative',
        likes: 128,
        comments: 14
      },
      {
        id: 'rev-2',
        author: 'Craig Mango',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        time: '2 years ago',
        rating: 5,
        text: 'A visual milestone. Every single frame could hang in a modern gallery. Magnificent pacing and heartbeat.',
        likes: 95,
        comments: 8
      }
    ]
  },
  {
    id: 'movie-kong',
    title: 'Kong: Skull Island',
    genre: 'Drama · Action · Sci-fi',
    genres: ['Drama', 'Action', 'Sci-fi'],
    year: 2017,
    rating: 'PG-13',
    duration: '1h 58m',
    score: 7.2,
    ratedCount: '94K Rated',
    rottenTomatoes: 75,
    imdb: 7.0,
    justWatch: 82,
    description: "A crew that reaches Skull Island to map it, is attacked by a humongous ape. The survivors then regroup to find out more about the ape, the island's natives and underground monsters.",
    posterGradient: 'from-amber-950 via-rose-950 to-slate-950',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
    videoColor: 'rgba(244, 63, 94, 0.45)',
    director: 'Jordan Vogt-Roberts',
    cast: ['Brie Larson', 'Samuel L. Jackson', 'Tom Hiddleston', 'John Goodman', 'Toby Kebbell'],
    castMembers: [
      { name: 'Brie Larson', role: 'Mason Weaver', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' },
      { name: 'Samuel L. Jackson', role: 'Preston Packard', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80' },
      { name: 'Tom Hiddleston', role: 'Captain James', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80' },
      { name: 'John Goodman', role: 'Bill Randa', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80' },
      { name: 'Toby Kebbell', role: 'Jack Chapman', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Jordan Vance',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        time: '1 year ago',
        rating: 4,
        text: 'Spectacular monster mayhem with thrilling 70s rock aesthetics and breathtaking visual scale.',
        likes: 64,
        comments: 5
      }
    ]
  },
  {
    id: 'movie-dunkirk',
    title: 'Dunkirk',
    genre: 'War · Action · History',
    genres: ['Action', 'Drama', 'History'],
    year: 2017,
    rating: 'PG-13',
    duration: '1h 46m',
    score: 7.8,
    ratedCount: '160K Rated',
    rottenTomatoes: 92,
    imdb: 7.8,
    justWatch: 89,
    description: 'Allied soldiers from Belgium, the British Empire, and France are surrounded by the German Army and evacuated during a fierce World War II battle.',
    posterGradient: 'from-sky-950 via-slate-900 to-black',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    videoColor: 'rgba(56, 189, 248, 0.45)',
    director: 'Christopher Nolan',
    cast: ['Fionn Whitehead', 'Tom Hardy', 'Mark Rylance', 'Harry Styles'],
    castMembers: [
      { name: 'Fionn Whitehead', role: 'Tommy', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80' },
      { name: 'Tom Hardy', role: 'Farrier', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' },
      { name: 'Mark Rylance', role: 'Mr. Dawson', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80' }
    ]
  },
  {
    id: 'movie-martian',
    title: 'The Martian',
    genre: 'Adventure · Drama · Sci-Fi',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    year: 2015,
    rating: 'PG-13',
    duration: '2h 31m',
    score: 8.0,
    ratedCount: '210K Rated',
    rottenTomatoes: 91,
    imdb: 8.0,
    justWatch: 93,
    description: 'During a mission to Mars, astronaut Mark Watney is presumed dead after a fierce storm and left behind by his crew.',
    posterGradient: 'from-amber-950 via-orange-950 to-black',
    posterUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    videoColor: 'rgba(249, 115, 22, 0.45)',
    director: 'Ridley Scott',
    cast: ['Matt Damon', 'Jessica Chastain', 'Kristen Wiig'],
    castMembers: [
      { name: 'Matt Damon', role: 'Mark Watney', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80' },
      { name: 'Jessica Chastain', role: 'Melissa Lewis', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' }
    ]
  },
  {
    id: 'movie-schmidt',
    title: 'About Schmidt',
    genre: 'Comedy · Drama',
    genres: ['Comedy', 'Drama'],
    year: 2002,
    rating: 'R',
    duration: '2h 5m',
    score: 7.2,
    ratedCount: '58K Rated',
    rottenTomatoes: 85,
    imdb: 7.2,
    justWatch: 80,
    description: "A retired insurance actuary embarks on a soul-searching road trip in his motorhome to his daughter's wedding.",
    posterGradient: 'from-emerald-950 via-teal-950 to-black',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
    videoColor: 'rgba(16, 185, 129, 0.45)',
    director: 'Alexander Payne',
    cast: ['Jack Nicholson', 'Kathy Bates', 'Hope Davis'],
    castMembers: [
      { name: 'Jack Nicholson', role: 'Warren Schmidt', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80' },
      { name: 'Kathy Bates', role: 'Roberta Hertzel', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80' }
    ]
  },
  {
    id: 'movie-bladerunner',
    title: 'Blade Runner 2049',
    genre: 'Action · Drama · Sci-Fi',
    genres: ['Action', 'Drama', 'Sci-Fi'],
    year: 2017,
    rating: 'R',
    duration: '2h 44m',
    score: 8.1,
    ratedCount: '190K Rated',
    rottenTomatoes: 88,
    imdb: 8.0,
    justWatch: 91,
    description: 'Young Blade Runner K unearths a long-buried secret that leads him to track down former Blade Runner Rick Deckard.',
    posterGradient: 'from-violet-950 via-pink-950 to-slate-950',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80',
    videoColor: 'rgba(168, 85, 247, 0.45)',
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
    castMembers: [
      { name: 'Ryan Gosling', role: 'Officer K', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80' },
      { name: 'Ana de Armas', role: 'Joi', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' }
    ]
  }
];

export const INITIAL_ACTORS: Actor[] = [
  {
    id: 'actor-1',
    name: 'Denzel Washington',
    handle: '@denzelwashington',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    isFollowing: false,
    famousFor: 'Gladiator II, Training Day'
  },
  {
    id: 'actor-2',
    name: 'Meryl Streep',
    handle: '@meryl',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    isFollowing: true,
    famousFor: 'The Devil Wears Prada, Sophie’s Choice'
  },
  {
    id: 'actor-3',
    name: 'Tom Hanks',
    handle: '@tomhanks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    isFollowing: false,
    famousFor: 'Forrest Gump, Cast Away'
  },
  {
    id: 'actor-4',
    name: 'Brie Larson',
    handle: '@brielarson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    isFollowing: false,
    famousFor: 'Kong: Skull Island, Room'
  },
  {
    id: 'actor-5',
    name: 'Samuel L. Jackson',
    handle: '@samuelljackson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    isFollowing: true,
    famousFor: 'Pulp Fiction, Avengers'
  }
];

export const MOVIE_FREAK_OF_MONTH = {
  name: 'Underworld Kings',
  handle: '@underworld_kings',
  role: 'Cinematic Curator & Director',
  followers: '78K followers',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
  curatedCount: 42,
  badge: 'Movie Freak of the Month'
};

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: 'Sarah Cooper',
    handle: '@sarah_cooper',
    avatarSeed: 'sarah',
    content: 'Guys, check out this track "Solar Flare Symphony" in the Realms Explorer right now! The stellar chords are so spacious, feels like floating in a warm nebula. ✨🌌',
    timestamp: '12m ago',
    reactions: { love: 42, fire: 18, star: 9 },
    hasReacted: { love: false, fire: false, star: false },
    attachedTrackId: 'track-2'
  },
  {
    id: 'post-2',
    author: 'Marcus Wood',
    handle: '@marcus_wood',
    avatarSeed: 'marcus',
    content: 'Just synced the Cabin Audio system to "Fireside Pine Wood Crackle" while the projector is showing "Cabin in the Stars". Absolute peak relaxation levels achieved. 🪵🏡🔥',
    timestamp: '45m ago',
    reactions: { love: 28, fire: 34, star: 12 },
    hasReacted: { love: true, fire: false, star: false },
    attachedTrackId: 'track-3'
  },
  {
    id: 'post-3',
    author: 'Clara Vance',
    handle: '@clara_vance',
    avatarSeed: 'clara',
    content: 'Aura Connect allows us to dim the lights directly from our active playlists. The visual harmony between movies and the physical living room lights is genius.',
    timestamp: '2h ago',
    reactions: { love: 15, fire: 8, star: 24 },
    hasReacted: { love: false, fire: false, star: true }
  }
];

export const AURA_STREAMS: LiveStream[] = [
  {
    id: 'stream-1',
    channel: 'Deep Chill Space Beats',
    streamer: 'DJ Polaris',
    viewers: 1420,
    category: 'Music',
    gradient: 'from-violet-600 via-purple-700 to-pink-600',
    avatarSeed: 'polaris'
  },
  {
    id: 'stream-2',
    channel: 'Saturn Biome Cam 4K',
    streamer: 'Space Explorer',
    viewers: 890,
    category: 'Cinema',
    gradient: 'from-amber-600 via-orange-700 to-yellow-600',
    avatarSeed: 'saturn'
  },
  {
    id: 'stream-3',
    channel: 'Aura Social Chillout Node',
    streamer: 'Stellar Community',
    viewers: 2150,
    category: 'Chat',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    avatarSeed: 'social'
  }
];

export const INITIAL_AURA_EVENTS: AuraEvent[] = [
  {
    id: 'event-1',
    title: 'Aura Sounds Collective Party',
    date: 'Nov 11',
    time: '11:15 PM',
    attendeesCount: 312,
    rsvpStatus: 'going',
    description: 'Join the collaborative curation room for a synchronized ambient synth session and live visual projections.'
  },
  {
    id: 'event-2',
    title: 'Cabin in the Stars Premiere',
    date: 'Nov 15',
    time: '8:00 PM',
    attendeesCount: 145,
    rsvpStatus: 'not_going',
    description: 'Exclusively streaming for our member events hub. Direct live stream Q&A with director Marcus Wood.'
  },
  {
    id: 'event-3',
    title: 'Solar Wind Meditations',
    date: 'Nov 18',
    time: '10:00 PM',
    attendeesCount: 88,
    rsvpStatus: 'not_going',
    description: 'An ethereal multi-node meditative spatial sound wave therapy. Lay back and adjust your Light Dimmers to 10%.'
  }
];

// Helper to draw clean avatar colors
export function getAvatarColors(seed: string) {
  switch (seed) {
    case 'sarah':
      return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', text: 'Sarah' };
    case 'marcus':
      return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: 'Marcus' };
    case 'clara':
      return { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', text: 'Clara' };
    case 'polaris':
      return { bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', text: 'Polaris' };
    case 'saturn':
      return { bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', text: 'Saturn' };
    default:
      return { bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', text: 'User' };
  }
}
