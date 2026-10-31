// Theme + static data for the music app. The first three tracks use local audio
// files; remaining tracks are demo audio.

export const COLORS = {
  bg: '#0B0B0D',
  surface: '#17171A',
  surface2: '#222226',
  chip: '#232327',
  red: '#FF1F2D',
  redSoft: 'rgba(255,31,45,0.14)',
  text: '#FFFFFF',
  sub: '#A8A8B0',
  muted: '#6E6E78',
  border: '#2A2A30',
};

export function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

const song = (id, title, artist, duration, c1, c2, audio, image) => ({
  id,
  title,
  artist,
  duration, // placeholder only — the player uses the real length of the loaded audio
  colors: [c1, c2],
  image: image || `https://picsum.photos/seed/${id}-art/500/500`,
  audio: audio || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${id.replace('s', '')}.mp3`,
});

// The first three tracks are bundled local MP3s with the supplied artwork.
export const SONGS = [
  song('s1', 'Calm Down', 'Rema', 225, '#FF5A36', '#5B1A6B', require('../../assets/audio/Calm_Down.mp3'), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6dSRYpX6ebdGBNFdXICuWxKqJWBUhk2WJ_baiy9s-sA&s=10'),
  song('s2', 'Akhiyaan Gulaab', 'Mitraz', 198, '#1E88E5', '#6A1B9A', require('../../assets/audio/Akhiyaan_Gulaab.mp3'), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwg5N6-yX3T1yZbwHemzvv4c8iAipXQf9oAU7nPmdUgw&s=10'),
  song('s3', 'Gehra Hua', 'Arijit Singh', 242, '#D32F2F', '#3E1010', require('../../assets/audio/Gehra_Hua.mp3'), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN96u1ujw5b66XHLQoPT2lkRaVXkzUZIs1fetrn01hgQ&s=10'),
  song('s4', 'Golden Hour', 'Mira Sol', 187, '#F9A825', '#C2410C'),
  song('s5', 'Paper Planes', 'The Hollow Kites', 213, '#26A69A', '#1E3A5F'),
  song('s6', 'Cold Coffee', 'Aria Lane', 176, '#8D6E63', '#2D2A26'),
  song('s7', 'City Rain', 'Noor & Dev', 231, '#5C6BC0', '#1A1F3C'),
  song('s8', 'Afterglow', 'Luna Park', 205, '#EC407A', '#4A1942'),
  song('s9', 'Ocean Drive', 'Reef Riders', 219, '#29B6F6', '#0D3B66'),
  song('s10', 'Static Hearts', 'Violet Static', 194, '#AB47BC', '#2A1038'),
  song('s11', 'Home Again', 'Sam Rowan', 248, '#FF8A65', '#4E2A1E'),
  song('s12', 'Wild Parade', 'Electric Zoo', 172, '#FFCA28', '#7A1F5C'),
];

export const songsById = (ids) => ids.map((id) => SONGS.find((s) => s.id === id)).filter(Boolean);

export const QUICK_PICKS = songsById(['s1', 's2', 's3']);

export const MIXES = [
  { id: 'mx1', name: 'Chill Mix', colors: ['#7C3AED', '#1E3A8A'], image: 'https://picsum.photos/seed/mix-chill/400/400', songIds: ['s1', 's5', 's6', 's7', 's9', 's11'] },
  { id: 'mx2', name: 'Workout Mix', colors: ['#F97316', '#9F1239'], image: 'https://picsum.photos/seed/mix-workout/400/400', songIds: ['s2', 's3', 's8', 's10', 's12'] },
  { id: 'mx3', name: 'Focus Mix', colors: ['#0891B2', '#1E293B'], image: 'https://picsum.photos/seed/mix-focus/400/400', songIds: ['s5', 's6', 's7', 's9', 's1'] },
];

export const PLAYLISTS = [
  { id: 'pl_liked', name: 'Liked Music', count: '235 songs', liked: true, songIds: ['s1', 's2', 's3', 's4', 's8', 's11'] },
  { id: 'pl_fav', name: 'My Favorites', count: '42 songs', colors: ['#0EA5E9', '#7C3AED'], image: 'https://picsum.photos/seed/pl-fav/300/300', songIds: ['s4', 's8', 's2', 's10'] },
  { id: 'pl_chill', name: 'Chill Vibes', count: '58 songs', colors: ['#F59E0B', '#7C2D12'], image: 'https://picsum.photos/seed/pl-chill/300/300', songIds: ['s1', 's5', 's6', 's7', 's9', 's11', 's3', 's4', 's2', 's8'] },
  { id: 'pl_work', name: 'Workout', count: '37 songs', colors: ['#EF4444', '#1F2937'], image: 'https://picsum.photos/seed/pl-work/300/300', songIds: ['s12', 's10', 's2', 's3'] },
  { id: 'pl_road', name: 'Road Trip', count: '66 songs', colors: ['#14B8A6', '#1E3A8A'], image: 'https://picsum.photos/seed/pl-road/300/300', songIds: ['s9', 's4', 's11', 's7'] },
  { id: 'pl_study', name: 'Study Music', count: '54 songs', colors: ['#84CC16', '#365314'], image: 'https://picsum.photos/seed/pl-study/300/300', songIds: ['s6', 's5', 's7', 's1'] },
  { id: 'pl_party', name: 'Party Hits', count: '28 songs', colors: ['#EC4899', '#581C87'], image: 'https://picsum.photos/seed/pl-party/300/300', songIds: ['s12', 's8', 's10', 's2'] },
];

export const TRENDING_ARTISTS = [
  { id: 'a1', name: 'Kabir Vale', colors: ['#6D28D9', '#1E1B4B'], image: 'https://picsum.photos/seed/artist-kabir/300/400' },
  { id: 'a2', name: 'Nova Rey', colors: ['#0369A1', '#0F172A'], image: 'https://picsum.photos/seed/artist-nova/300/400' },
  { id: 'a3', name: 'Mira Sol', colors: ['#BE185D', '#4C0519'], image: 'https://picsum.photos/seed/artist-mira/300/400' },
];

export const ARTISTS = [
  { id: 'a1', name: 'Kabir Vale', subs: '2.4M subscribers', colors: ['#6D28D9', '#1E1B4B'], image: 'https://picsum.photos/seed/artist-kabir/300/300' },
  { id: 'a2', name: 'Nova Rey', subs: '1.8M subscribers', colors: ['#0369A1', '#0F172A'], image: 'https://picsum.photos/seed/artist-nova/300/300' },
  { id: 'a3', name: 'Mira Sol', subs: '3.1M subscribers', colors: ['#BE185D', '#4C0519'], image: 'https://picsum.photos/seed/artist-mira/300/300' },
  { id: 'a4', name: 'Aria Lane', subs: '920K subscribers', colors: ['#92400E', '#1C1917'], image: 'https://picsum.photos/seed/artist-aria/300/300' },
  { id: 'a5', name: 'Luna Park', subs: '1.2M subscribers', colors: ['#DB2777', '#312E81'], image: 'https://picsum.photos/seed/artist-luna/300/300' },
];

export const ALBUMS = [
  { id: 'al1', name: 'Blue Hour', artist: 'Nova Rey', colors: ['#2563EB', '#1E1B4B'], image: 'https://picsum.photos/seed/album-blue/400/400', songIds: ['s2', 's9'] },
  { id: 'al2', name: 'Late Bloom', artist: 'Mira Sol', colors: ['#F59E0B', '#9F1239'], image: 'https://picsum.photos/seed/album-late/400/400', songIds: ['s4', 's8'] },
  { id: 'al3', name: 'Slow Static', artist: 'Violet Static', colors: ['#A855F7', '#1F1235'], image: 'https://picsum.photos/seed/album-slow/400/400', songIds: ['s10', 's12'] },
  { id: 'al4', name: 'Rooftops', artist: 'Aria Lane', colors: ['#A16207', '#1C1917'], image: 'https://picsum.photos/seed/album-roof/400/400', songIds: ['s6', 's11'] },
];

export const CATEGORIES = [
  { id: 'cat1', label: 'Charts', icon: 'chart-line', colors: ['#06B6D4', '#1D4ED8'] },
  { id: 'cat2', label: 'New releases', icon: 'new-box', colors: ['#F97316', '#7E22CE'] },
  { id: 'cat3', label: 'Pop', icon: 'microphone-variant', colors: ['#EC4899', '#7C3AED'] },
  { id: 'cat4', label: 'Bollywood', icon: 'drama-masks', colors: ['#EF4444', '#9F1239'] },
  { id: 'cat5', label: 'Workout', icon: 'dumbbell', colors: ['#14B8A6', '#1D4ED8'] },
  { id: 'cat6', label: 'Romance', icon: 'heart', colors: ['#F43F5E', '#9F1239'] },
  { id: 'cat7', label: 'Hip Hop', icon: 'headphones', colors: ['#F97316', '#92400E'] },
  { id: 'cat8', label: 'Chill', icon: 'weather-night', colors: ['#3B82F6', '#1E3A8A'] },
  { id: 'cat9', label: 'Rock', icon: 'guitar-electric', colors: ['#EF4444', '#7E22CE'] },
  { id: 'cat10', label: 'Indie', icon: 'guitar-acoustic', colors: ['#F59E0B', '#9A3412'] },
];

export const LYRICS = [
  'Sun is sinking low on the city line',
  'Amber in the windows, nothing on my mind',
  'Headphones on, let the world go slow',
  'Every little worry fades with the afterglow',
  '',
  'So take me where the evening goes',
  'Past the rooftops, past the rows',
  'Hold the moment, let it ride',
  'We are golden, side by side',
  '',
  'Sunset vibes, sunset vibes',
  'Carry me on the warm night skies',
];
