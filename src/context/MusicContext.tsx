import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as audioService from '../services/audio';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  isHr?: boolean;
  isSq?: boolean;
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
  duration: number;
  volume: number;
  isMuted: boolean;
  isDarkMode: boolean;
  hasScanned: boolean;
  skipShortAudio: boolean;
  showCoverInList: boolean;
  lyricsFontSize: number;
  lyricsTextAlign: boolean;
  lyricsFontWeight: 'normal' | 'medium' | 'bold';
  queue: Song[];
  currentQueueIndex: number;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
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
  playFromQueue: (index: number) => void;
  playWithQueue: (song: Song, songList: Song[]) => void;
  setSongs: (songs: Song[]) => void;
  setAlbums: (albums: Album[]) => void;
  setArtists: (artists: Artist[]) => void;
  setHasScanned: (scanned: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bayin_theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [hasScanned, setHasScanned] = useState(false);
  const [skipShortAudio, setSkipShortAudio] = useState(true);
  const [showCoverInList, setShowCoverInList] = useState(true);
  const [lyricsFontSize, setLyricsFontSize] = useState(16);
  const [lyricsTextAlign, setLyricsTextAlign] = useState(true);
  const [lyricsFontWeight, setLyricsFontWeight] = useState<'normal' | 'medium' | 'bold'>('normal');
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Volume state - initialize from localStorage
  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bayin_volume');
      return saved ? parseFloat(saved) : 0.7;
    }
    return 0.7;
  });
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bayin_muted') === 'true';
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('bayin_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('bayin_theme', 'light');
    }
  }, [isDarkMode]);

  // Apply volume to audio element
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume;
    audioService.setVolume(effectiveVolume);
    localStorage.setItem('bayin_volume', volume.toString());
    localStorage.setItem('bayin_muted', isMuted.toString());
  }, [volume, isMuted]);

  // 监听音频时间更新
  useEffect(() => {
    const unsubscribeTime = audioService.onTimeUpdate((time) => {
      setProgressState(time);
    });

    const unsubscribeEnded = audioService.onEnded(() => {
      // 播放结束，自动播放下一首
      if (queue.length > 0) {
        const nextIndex = (currentQueueIndex + 1) % queue.length;
        setCurrentQueueIndex(nextIndex);
        playSongInternal(queue[nextIndex]);
      } else {
        setIsPlaying(false);
      }
    });

    const unsubscribeError = audioService.onError((error) => {
      console.error('Audio error:', error);
      setIsPlaying(false);
    });

    return () => {
      unsubscribeTime();
      unsubscribeEnded();
      unsubscribeError();
    };
  }, [queue, currentQueueIndex]);

  // 内部播放函数
  const playSongInternal = useCallback(async (song: Song) => {
    // 先更新 UI 状态
    setCurrentSong(song);
    setIsPlaying(true);
    setProgressState(0);
    setDuration(song.duration);

    // 如果没有文件路径，只更新 UI，不播放音频
    if (!song.filePath) {
      console.warn('No file path for song:', song.title);
      return;
    }

    try {
      await audioService.play(song.filePath);
      // 获取实际时长
      const state = audioService.getState();
      if (state.duration > 0) {
        setDuration(state.duration);
      }
    } catch (error) {
      console.error('Failed to play song:', error);
      setIsPlaying(false);
    }
  }, []);

  const playSong = useCallback((song: Song) => {
    playSongInternal(song);
  }, [playSongInternal]);

  const togglePlay = useCallback(async () => {
    console.log('togglePlay called, isPlaying:', isPlaying, 'currentSong:', currentSong?.title);

    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
    } else {
      // 如果有当前歌曲但没有在播放，尝试播放
      if (currentSong) {
        try {
          const state = audioService.getState();
          console.log('Audio state:', state, 'filePath:', currentSong.filePath);

          if (currentSong.filePath) {
            // 检查是否需要加载音频（没有源或源文件不同）
            const currentPath = audioService.getCurrentFilePath();
            if (!state.hasSource || currentPath !== currentSong.filePath) {
              // 音频未加载或文件不同，需要重新播放
              console.log('Playing from file:', currentSong.filePath);
              await audioService.play(currentSong.filePath);
            } else {
              // 音频已加载，恢复播放
              console.log('Resuming playback');
              await audioService.resume();
            }
            setIsPlaying(true);
          } else {
            console.warn('No filePath for current song');
          }
        } catch (error) {
          console.error('Failed to play/resume:', error);
          setIsPlaying(false);
        }
      } else {
        console.log('No currentSong to play');
      }
    }
  }, [isPlaying, currentSong]);

  const setProgress = useCallback((value: number) => {
    audioService.seek(value);
    setProgressState(value);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.max(0, Math.min(1, value)));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

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
        isHr: true,
      },
      {
        id: '2',
        title: '稻香',
        artist: '周杰伦',
        album: '魔杰座',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        duration: 223,
        isSq: true,
      },
    ];

    setSongs(mockSongs);
    setHasScanned(true);
  };

  const shufflePlay = useCallback((songsToShuffle?: Song[]) => {
    const targetSongs = songsToShuffle || songs;
    if (targetSongs.length > 0) {
      const shuffled = [...targetSongs].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentQueueIndex(0);
      playSongInternal(shuffled[0]);
    }
  }, [songs, playSongInternal]);

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

  const addToQueue = useCallback((newSongs: Song[]) => {
    setQueue(prev => [...prev, ...newSongs]);
  }, []);

  const addNextToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev.slice(0, currentQueueIndex + 1), song, ...prev.slice(currentQueueIndex + 1)]);
  }, [currentQueueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < currentQueueIndex) {
      setCurrentQueueIndex(prev => prev - 1);
    }
  }, [currentQueueIndex]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentQueueIndex(0);
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentQueueIndex + 1) % queue.length;
    setCurrentQueueIndex(nextIndex);
    playSongInternal(queue[nextIndex]);
  }, [queue, currentQueueIndex, playSongInternal]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = (currentQueueIndex - 1 + queue.length) % queue.length;
    setCurrentQueueIndex(prevIndex);
    playSongInternal(queue[prevIndex]);
  }, [queue, currentQueueIndex, playSongInternal]);

  const playFromQueue = useCallback((index: number) => {
    if (index < 0 || index >= queue.length) return;
    setCurrentQueueIndex(index);
    playSongInternal(queue[index]);
  }, [queue, playSongInternal]);

  const playWithQueue = useCallback((song: Song, songList: Song[]) => {
    // 找到歌曲在列表中的索引
    const index = songList.findIndex(s => s.id === song.id);
    if (index !== -1) {
      setQueue(songList);
      setCurrentQueueIndex(index);
      playSongInternal(song);
    } else {
      // 如果歌曲不在列表中，将其添加到列表末尾
      const newQueue = [...songList, song];
      setQueue(newQueue);
      setCurrentQueueIndex(newQueue.length - 1);
      playSongInternal(song);
    }
  }, [playSongInternal]);

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
        duration,
        volume,
        isMuted,
        isDarkMode,
        hasScanned,
        skipShortAudio,
        showCoverInList,
        lyricsFontSize,
        lyricsTextAlign,
        lyricsFontWeight,
        queue,
        currentQueueIndex,
        isMobileSidebarOpen,
        setMobileSidebarOpen,
        playSong,
        togglePlay,
        setProgress,
        setVolume,
        toggleMute,
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
        playFromQueue,
        playWithQueue,
        setSongs,
        setAlbums,
        setArtists,
        setHasScanned,
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
