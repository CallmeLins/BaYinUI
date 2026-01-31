import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Folder, ScanSearch, Loader2, X, Music, Check, AlertCircle, CheckCircle, Cloud, FolderSearch, Shield } from 'lucide-react';
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
const STORAGE_KEY_SONGS = 'bayin_scan_results';
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
        "fixed top-10 left-1/2 z-50 shadow-lg backdrop-blur-xl border flex items-center gap-2.5 max-w-[90vw]",
        // Mobile: wider, more padding; Desktop: rounded pill
        "px-5 py-3 rounded-2xl",
        type === 'success' && "bg-green-500/15 border-green-500/20 text-green-700 dark:text-green-400",
        type === 'error' && "bg-red-500/15 border-red-500/20 text-red-700 dark:text-red-400",
        type === 'info' && "bg-blue-500/15 border-blue-500/20 text-blue-700 dark:text-blue-400",
        "bg-white/95 dark:bg-[#1e1e1e]/95"
      )}
    >
      {type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
      {type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

/** 权限说明弹窗 */
const PermissionDialog = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">存储权限说明</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            读取共享存储中的音频文件（不包含对照片、视频的读取，若见系统请求说明中包含，为 Android 12 及以下系统未细分权限故而统一描述），授权后才可获取音频文件信息。
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            若同意此对话后未见系统授权询问，可能是本软件的此权限被设定为"拒绝并不再提示"，请手动前往系统设置更改。
          </p>
        </div>
        <div className="flex border-t border-black/5 dark:border-white/10">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-medium text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            取消
          </button>
          <div className="w-px bg-black/5 dark:bg-white/10" />
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 text-sm font-semibold text-blue-500 hover:bg-blue-500/5 transition-colors"
          >
            同意并继续
          </button>
        </div>
      </motion.div>
    </div>
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
  const [showPermDialog, setShowPermDialog] = useState(false);

  // Load saved directories
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

  // Save directories when changed
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

  const handleScanClick = async () => {
    // Android: check permission first, only show dialog if not granted
    if (platform === 'android') {
      // 定义 AndroidBridge 类型
      type AndroidBridgeType = {
        requestPermission: () => void;
        checkPermission: () => boolean;
        openSettings: () => void;
      };

      // 检查 AndroidBridge 是否可用
      if (typeof window !== 'undefined' && 'AndroidBridge' in window) {
        const bridge = (window as unknown as { AndroidBridge: AndroidBridgeType }).AndroidBridge;
        const hasPermission = bridge.checkPermission();
        console.log('handleScanClick checkPermission:', hasPermission);

        if (hasPermission) {
          // 已有权限，直接扫描
          doScan();
          return;
        }
      }
      // 没有权限或无法检测，显示权限说明对话框
      setShowPermDialog(true);
    } else {
      doScan();
    }
  };

  const handlePermConfirm = async () => {
    setShowPermDialog(false);

    // 定义 AndroidBridge 类型
    type AndroidBridgeType = {
      requestPermission: () => void;
      checkPermission: () => boolean;
      openSettings: () => void;
    };

    // 等待 AndroidBridge 可用（可能有延迟）
    const waitForBridge = async (maxWait = 3000): Promise<AndroidBridgeType | null> => {
      const start = Date.now();
      while (Date.now() - start < maxWait) {
        if (typeof window !== 'undefined' && 'AndroidBridge' in window) {
          console.log('AndroidBridge found');
          return (window as unknown as { AndroidBridge: AndroidBridgeType }).AndroidBridge;
        }
        await new Promise(r => setTimeout(r, 100));
      }
      console.log('AndroidBridge not found after', maxWait, 'ms');
      return null;
    };

    const bridge = await waitForBridge();

    if (bridge) {
      try {
        // 检查是否已有权限
        const hasPermission = bridge.checkPermission();
        console.log('checkPermission result:', hasPermission);

        if (!hasPermission) {
          console.log('Requesting permission...');
          // 请求权限
          bridge.requestPermission();

          // 等待权限结果
          const result = await new Promise<boolean>((resolve) => {
            const handler = (event: Event) => {
              const customEvent = event as CustomEvent<{ granted: boolean }>;
              console.log('Permission result received:', customEvent.detail);
              window.removeEventListener('android-permission-result', handler);
              resolve(customEvent.detail?.granted ?? false);
            };
            window.addEventListener('android-permission-result', handler);

            // 超时保护（30秒）
            setTimeout(() => {
              window.removeEventListener('android-permission-result', handler);
              console.log('Permission request timeout');
              resolve(false);
            }, 30000);
          });

          console.log('Final permission result:', result);

          if (!result) {
            // 权限被拒绝，提示用户可以去设置中开启
            showToast('请在系统设置中授予存储权限', 'error');
            return;
          }
        }
      } catch (e) {
        console.error('AndroidBridge permission request failed:', e);
      }
    } else {
      console.log('AndroidBridge not available, proceeding anyway');
    }

    doScan();
  };

  const doScan = async () => {
    const hasLocalDirs = selectedDirs.length > 0;
    const hasNavidrome = navidromeConfig && navidromeConfig.serverUrl && navidromeConfig.username && navidromeConfig.password;

    if (!hasLocalDirs && !hasNavidrome) {
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

      const albumsArr = Array.from(albumMap.entries()).map(([, a], index) => ({
        id: `album-${index}`,
        name: a.name,
        artist: a.artist,
        coverUrl: a.coverUrl,
        songCount: a.count,
      }));

      const artistsArr = Array.from(artistMap.entries()).map(([, a], index) => ({
        id: `artist-${index}`,
        name: a.name,
        coverUrl: a.coverUrl,
        songCount: a.count,
      }));

      setAlbums(albumsArr);
      setArtists(artistsArr);
      setHasScanned(true);

      // Persist scan results to localStorage for auto-load next time
      try {
        localStorage.setItem(STORAGE_KEY_SONGS, JSON.stringify({
          songs: allSongs,
          albums: albumsArr,
          artists: artistsArr,
        }));
      } catch (e) {
        console.warn('Failed to persist scan results:', e);
      }

      showToast(`成功扫描到 ${allSongs.length} 首歌曲`, 'success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showToast(`扫描失败: ${error}`, 'error');
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

      {/* Permission Dialog */}
      <PermissionDialog
        isOpen={showPermDialog}
        onConfirm={handlePermConfirm}
        onCancel={() => setShowPermDialog(false)}
      />

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
          onClick={handleScanClick}
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
