import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  isHR?: boolean;
  isSQ?: boolean;
  fileSize?: number;
  filePath?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverUrl: string;
  songCount: number;
  year?: number;
}

export interface Artist {
  id: string;
  name: string;
  coverUrl: string;
  songCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  songs: Song[];
}

interface MusicContextType {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  isDarkMode: boolean;
  hasScanned: boolean;
  skipShortAudio: boolean;
  showCoverInList: boolean;
  lyricsFontSize: number;
  lyricsTextAlign: boolean;
  lyricsFontWeight: 'normal' | 'medium' | 'bold';
  queue: Song[];
  currentQueueIndex: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  toggleDarkMode: () => void;
  scanMusic: () => void;
  shufflePlay: (songsToShuffle?: Song[]) => void;
  setSkipShortAudio: (skip: boolean) => void;
  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  updatePlaylist: (id: string, name: string) => void;
  addSongsToPlaylist: (playlistId: string, songIds: string[]) => void;
  deleteSongs: (songIds: string[]) => void;
  setShowCoverInList: (show: boolean) => void;
  setLyricsFontSize: (size: number) => void;
  setLyricsTextAlign: (align: boolean) => void;
  setLyricsFontWeight: (weight: 'normal' | 'medium' | 'bold') => void;
  addToQueue: (songs: Song[]) => void;
  addNextToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [skipShortAudio, setSkipShortAudio] = useState(true);
  const [showCoverInList, setShowCoverInList] = useState(true);
  const [lyricsFontSize, setLyricsFontSize] = useState(16);
  const [lyricsTextAlign, setLyricsTextAlign] = useState(true);
  const [lyricsFontWeight, setLyricsFontWeight] = useState<'normal' | 'medium' | 'bold'>('normal');
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scanMusic = () => {
    // 模拟扫描音乐
    const mockSongs: Song[] = [
      {
        id: '1',
        title: '晴天',
        artist: '周杰伦',
        album: '叶惠美',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        duration: 269,
        isHR: true,
      },
      {
        id: '2',
        title: '稻香',
        artist: '周杰伦',
        album: '魔杰座',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        duration: 223,
        isSQ: true,
      },
      {
        id: '3',
        title: '告白气球',
        artist: '周杰伦',
        album: '周杰伦的床边故事',
        coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        duration: 212,
      },
      {
        id: '4',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        duration: 354,
        isHR: true,
        isSQ: true,
      },
      {
        id: '5',
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        duration: 183,
      },
    ];
    
    const mockAlbums: Album[] = [
      {
        id: '1',
        name: '叶惠美',
        artist: '周杰伦',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        songCount: 1,
        year: 2003,
      },
      {
        id: '2',
        name: '魔杰座',
        artist: '周杰伦',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        songCount: 1,
        year: 2008,
      },
      {
        id: '3',
        name: 'A Night at the Opera',
        artist: 'Queen',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        songCount: 1,
        year: 1975,
      },
    ];
    
    const mockArtists: Artist[] = [
      {
        id: '1',
        name: '周杰伦',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        songCount: 3,
      },
      {
        id: '2',
        name: 'Queen',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        songCount: 1,
      },
      {
        id: '3',
        name: 'John Lennon',
        coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
        songCount: 1,
      },
    ];
    
    setSongs(mockSongs);
    setAlbums(mockAlbums);
    setArtists(mockArtists);
    setHasScanned(true);
  };

  const shufflePlay = (songsToShuffle?: Song[]) => {
    const targetSongs = songsToShuffle || songs;
    if (targetSongs.length > 0) {
      // 随机打乱并添加到队列
      const shuffled = [...targetSongs].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentQueueIndex(0);
      playSong(shuffled[0]);
    }
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songCount: 0,
      songs: [],
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist.id;
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  const updatePlaylist = (id: string, name: string) => {
    setPlaylists(playlists.map(p => p.id === id ? { ...p, name } : p));
  };

  const addSongsToPlaylist = (playlistId: string, songIds: string[]) => {
    setPlaylists(playlists.map(p => p.id === playlistId ? {
      ...p,
      songs: [...p.songs, ...songs.filter(s => songIds.includes(s.id))],
      songCount: p.songCount + songIds.length,
    } : p));
  };

  const deleteSongs = (songIds: string[]) => {
    setSongs(songs.filter(s => !songIds.includes(s.id)));
    setPlaylists(playlists.map(p => ({
      ...p,
      songs: p.songs.filter(s => !songIds.includes(s.id)),
      songCount: p.songs.filter(s => !songIds.includes(s.id)).length,
    })));
  };

  const addToQueue = (songs: Song[]) => {
    setQueue([...queue, ...songs]);
  };

  const addNextToQueue = (song: Song) => {
    setQueue([...queue.slice(0, currentQueueIndex + 1), song, ...queue.slice(currentQueueIndex + 1)]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentQueueIndex + 1) % queue.length;
    setCurrentQueueIndex(nextIndex);
    playSong(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentQueueIndex - 1 + queue.length) % queue.length;
    setCurrentQueueIndex(prevIndex);
    playSong(queue[prevIndex]);
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        albums,
        artists,
        playlists,
        currentSong,
        isPlaying,
        progress,
        isDarkMode,
        hasScanned,
        skipShortAudio,
        showCoverInList,
        lyricsFontSize,
        lyricsTextAlign,
        lyricsFontWeight,
        queue,
        currentQueueIndex,
        playSong,
        togglePlay,
        setProgress,
        toggleDarkMode,
        scanMusic,
        shufflePlay,
        setSkipShortAudio,
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addSongsToPlaylist,
        deleteSongs,
        setShowCoverInList,
        setLyricsFontSize,
        setLyricsTextAlign,
        setLyricsFontWeight,
        addToQueue,
        addNextToQueue,
        removeFromQueue,
        clearQueue,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};