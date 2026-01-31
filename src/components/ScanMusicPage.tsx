import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Folder, ScanSearch, Loader2, X, Music, Check, AlertCircle, CheckCircle, Cloud, FolderSearch } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { FolderBrowser } from './FolderBrowser';
import { useMusic } from '../context/MusicContext';
import { usePlatform } from '../hooks/usePlatform';
import {
  selectDirectory,
  scanMusicFiles,
  getAndroidMusicDirectories,
} from '../services/scanner';
import { fetchNavidromeSongs, type NavidromeConfig } from '../services/navidrome';
import { load } from '../services/storage';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY_DIRS = 'bayin_scan_directories';
const NAVIDROME_CONFIG_KEY = 'navidromeConfig' as const;

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={cn(
        "fixed top-6 left-1/2 z-50 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-xl border flex items-center gap-2.5",
        type === 'success' && "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
        type === 'error' && "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
        type === 'info' && "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
        "bg-white/90 dark:bg-[#1e1e1e]/90" // Fallback background
      )}
    >
      {type === 'success' && <CheckCircle className="w-4 h-4" />}
      {type === 'error' && <AlertCircle className="w-4 h-4" />}
      {type === 'info' && <AlertCircle className="w-4 h-4" />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

export const ScanMusicPage = () => {
  const navigate = useNavigate();
  const {
    skipShortAudio,
    setSkipShortAudio,
    setSongs,
    setAlbums,
    setArtists,
    setHasScanned,
    setMobileSidebarOpen,
  } = useMusic();
  const { platform, isMobile } = usePlatform();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDirs, setSelectedDirs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [androidDirs, setAndroidDirs] = useState<string[]>([]);
  const [navidromeConfig, setNavidromeConfig] = useState<NavidromeConfig | null>(null);
  const [folderBrowserOpen, setFolderBrowserOpen] = useState(false);

  useEffect(() => {
    const savedDirs = localStorage.getItem(STORAGE_KEY_DIRS);
    if (savedDirs) {
      try {
        const dirs = JSON.parse(savedDirs);
        if (Array.isArray(dirs)) setSelectedDirs(dirs);
      } catch (e) {
        console.error('Failed to parse saved directories:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDirs.length > 0) {
      localStorage.setItem(STORAGE_KEY_DIRS, JSON.stringify(selectedDirs));
    }
  }, [selectedDirs]);

  useEffect(() => {
    const init = async () => {
      if (platform === 'android') {
        const dirs = await getAndroidMusicDirectories();
        setAndroidDirs(dirs);
      }
      // Load Navidrome config
      const config = await load<NavidromeConfig | null>(NAVIDROME_CONFIG_KEY as never, null);
      setNavidromeConfig(config);
    };
    init();
  }, [platform]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleSelectFolder = async () => {
    try {
      const dir = await selectDirectory();
      if (dir && !selectedDirs.includes(dir)) {
        setSelectedDirs([...selectedDirs, dir]);
      }
    } catch (e) {
      showToast(`Failed to select folder: ${e}`, 'error');
    }
  };

  const handleToggleAndroidDir = (dir: string) => {
    if (selectedDirs.includes(dir)) {
      setSelectedDirs(selectedDirs.filter((d) => d !== dir));
    } else {
      setSelectedDirs([...selectedDirs, dir]);
    }
  };

  const handleRemoveDir = (dir: string) => {
    const newDirs = selectedDirs.filter((d) => d !== dir);
    setSelectedDirs(newDirs);
    if (newDirs.length === 0) {
      localStorage.removeItem(STORAGE_KEY_DIRS);
    }
  };

  const handleFolderBrowserSelect = (path: string) => {
    if (!selectedDirs.includes(path)) {
      setSelectedDirs([...selectedDirs, path]);
    }
  };

  const handleScan = async () => {
    const hasLocalDirs = selectedDirs.length > 0;
    const hasNavidrome = navidromeConfig && navidromeConfig.serverUrl && navidromeConfig.username && navidromeConfig.password;

    if (!hasLocalDirs && !hasNavidrome) {
      // No sources, clear all songs
      setSongs([]);
      setAlbums([]);
      setArtists([]);
      setHasScanned(true);
      showToast('Library cleared - no sources configured', 'info');
      return;
    }

    setIsScanning(true);
    showToast('Scanning...', 'info');

    try {
      let allSongs: Array<{
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
      }> = [];

      // Scan local directories
      if (hasLocalDirs) {
        const localSongs = await scanMusicFiles({
          directories: selectedDirs,
          skipShortAudio,
          minDuration: skipShortAudio ? 60 : 0,
        });

        allSongs = localSongs.map((s) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          album: s.album,
          coverUrl: s.coverUrl || '',
          duration: s.duration,
          isHr: s.isHr,
          isSq: s.isSq,
          fileSize: s.fileSize,
          filePath: s.filePath,
        }));
      }

      // Fetch from Navidrome
      if (hasNavidrome) {
        const navidromeSongs = await fetchNavidromeSongs(navidromeConfig);
        const convertedNavidromeSongs = navidromeSongs.map((s) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          album: s.album,
          coverUrl: s.coverUrl || '',
          duration: s.duration,
          isHr: s.isHr,
          isSq: s.isSq,
          fileSize: s.fileSize,
          filePath: JSON.stringify({ type: 'navidrome', songId: s.id, config: navidromeConfig }),
        }));
        allSongs = [...allSongs, ...convertedNavidromeSongs];
      }

      setSongs(allSongs);

      const albumMap = new Map<string, { name: string; artist: string; coverUrl: string; count: number }>();
      const artistMap = new Map<string, { name: string; coverUrl: string; count: number }>();

      allSongs.forEach((song) => {
        if (!albumMap.has(song.album)) {
          albumMap.set(song.album, { name: song.album, artist: song.artist, coverUrl: song.coverUrl, count: 1 });
        } else {
          albumMap.get(song.album)!.count++;
        }

        if (!artistMap.has(song.artist)) {
          artistMap.set(song.artist, { name: song.artist, coverUrl: song.coverUrl, count: 1 });
        } else {
          artistMap.get(song.artist)!.count++;
        }
      });

      setAlbums(Array.from(albumMap.entries()).map(([, a], index) => ({
        id: `album-${index}`,
        name: a.name,
        artist: a.artist,
        coverUrl: a.coverUrl,
        songCount: a.count,
      })));

      setArtists(Array.from(artistMap.entries()).map(([, a], index) => ({
        id: `artist-${index}`,
        name: a.name,
        coverUrl: a.coverUrl,
        songCount: a.count,
      })));

      setHasScanned(true);
      showToast(`Successfully scanned ${allSongs.length} songs`, 'success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showToast(`Scan failed: ${error}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const isAndroid = platform === 'android';

  return (
    <div className="relative pb-20">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center justify-between",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Scan Music</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Local Folder Section */}
        <section className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Local Folders</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Select folders to scan for music files</p>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {/* Android Presets */}
            {isAndroid && androidDirs.length > 0 && (
              <div className="space-y-1 mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-1">Common Directories</p>
                {androidDirs.map((dir) => (
                  <button
                    key={dir}
                    onClick={() => handleToggleAndroidDir(dir)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all border",
                      selectedDirs.includes(dir)
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "bg-white/50 dark:bg-white/5 border-transparent hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Music className={cn("w-4 h-4 flex-shrink-0", selectedDirs.includes(dir) ? "text-blue-500" : "text-gray-400")} />
                      <span className="text-sm truncate">{dir}</span>
                    </div>
                    {selectedDirs.includes(dir) && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Custom Folders */}
            {selectedDirs.filter((d) => !androidDirs.includes(d)).length > 0 && (
              <div className="space-y-2 mb-4">
                 {!isAndroid && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-1">Selected</p>}
                 {selectedDirs.filter((d) => !androidDirs.includes(d)).map((dir) => (
                    <div key={dir} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                       <span className="text-sm truncate flex-1 mr-3 text-gray-700 dark:text-gray-300">{dir}</span>
                       <button onClick={() => handleRemoveDir(dir)} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500">
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                 ))}
              </div>
            )}

            {/* Add custom folder button */}
            <button
              onClick={() => isAndroid ? setFolderBrowserOpen(true) : handleSelectFolder()}
              className="w-full py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {isAndroid ? <FolderSearch className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
              {isAndroid ? 'Browse Folders' : 'Add Folder'}
            </button>
          </div>
        </section>

        {/* Navidrome Section */}
        <section className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
           <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={cn(
                   "p-2 rounded-lg",
                   navidromeConfig ? "bg-green-500/10 text-green-500" : "bg-purple-500/10 text-purple-500"
                 )}>
                    {navidromeConfig ? <Cloud className="w-5 h-5" /> : <ScanSearch className="w-5 h-5" />}
                 </div>
                 <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Navidrome Server</h3>
                    {navidromeConfig ? (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Connected: {navidromeConfig.serverUrl}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Not configured</p>
                    )}
                 </div>
              </div>
              <button
                 onClick={() => navigate('/navidrome-config')}
                 className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-sm font-medium transition-colors"
              >
                 Configure
              </button>
           </div>
        </section>

        {/* Settings Section */}
        <section className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
           <div className="p-4 flex items-center justify-between">
              <div>
                 <h3 className="font-medium text-gray-900 dark:text-white">Skip Short Audio</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Ignore files shorter than 60 seconds</p>
              </div>
              <button
                onClick={() => setSkipShortAudio(!skipShortAudio)}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  skipShortAudio ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <div className={cn(
                   "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                   skipShortAudio ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
           </div>
        </section>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={cn(
            "w-full py-4 rounded-2xl font-semibold text-white shadow-lg transition-all active:scale-[0.98]",
            "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
            isScanning && "opacity-70 cursor-not-allowed"
          )}
        >
          {isScanning ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning Library...</span>
            </div>
          ) : (
            'Start Scan'
          )}
        </button>

      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Android Folder Browser */}
      <FolderBrowser
        isOpen={folderBrowserOpen}
        onClose={() => setFolderBrowserOpen(false)}
        onSelect={handleFolderBrowserSelect}
      />
    </div>
  );
};
