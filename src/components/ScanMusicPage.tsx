import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Folder, ScanSearch, Loader2, X, Music, Check, AlertCircle, CheckCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';
import {
  selectDirectory,
  scanMusicFiles,
  getAndroidMusicDirectories,
  getCurrentPlatform,
} from '../services/scanner';
import type { Platform } from '../services/tauri';

// 本地存储 key
const STORAGE_KEY_DIRS = 'bayin_scan_directories';

// Toast 弹窗组件
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

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : AlertCircle;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <Icon className="w-5 h-5" />
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ScanMusicPage = () => {
  const navigate = useNavigate();
  const {
    isDarkMode,
    skipShortAudio,
    setSkipShortAudio,
    setSongs,
    setAlbums,
    setArtists,
    setHasScanned,
  } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDirs, setSelectedDirs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [platform, setPlatform] = useState<Platform>('browser');
  const [androidDirs, setAndroidDirs] = useState<string[]>([]);

  // 加载保存的目录
  useEffect(() => {
    const savedDirs = localStorage.getItem(STORAGE_KEY_DIRS);
    if (savedDirs) {
      try {
        const dirs = JSON.parse(savedDirs);
        if (Array.isArray(dirs)) {
          setSelectedDirs(dirs);
        }
      } catch (e) {
        console.error('Failed to parse saved directories:', e);
      }
    }
  }, []);

  // 保存目录到本地存储
  useEffect(() => {
    if (selectedDirs.length > 0) {
      localStorage.setItem(STORAGE_KEY_DIRS, JSON.stringify(selectedDirs));
    }
  }, [selectedDirs]);

  // 检测平台并加载 Android 目录
  useEffect(() => {
    const init = async () => {
      const p = await getCurrentPlatform();
      setPlatform(p);

      if (p === 'android') {
        const dirs = await getAndroidMusicDirectories();
        setAndroidDirs(dirs);
      }
    };
    init();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleSelectFolder = async () => {
    try {
      console.log('Selecting folder...');
      const dir = await selectDirectory();
      console.log('Selected:', dir);
      if (dir && !selectedDirs.includes(dir)) {
        setSelectedDirs([...selectedDirs, dir]);
      }
    } catch (e) {
      console.error('Error selecting folder:', e);
      showToast(`选择文件夹失败: ${e}`, 'error');
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

  const handleScan = async () => {
    if (selectedDirs.length === 0) {
      showToast('请先选择至少一个文件夹', 'error');
      return;
    }

    setIsScanning(true);
    showToast('正在扫描...', 'info');

    try {
      const songs = await scanMusicFiles({
        directories: selectedDirs,
        skipShortAudio,
        minDuration: skipShortAudio ? 60 : 0,
      });

      // 转换为 Song 格式并更新 Context
      const convertedSongs = songs.map((s) => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        album: s.album,
        coverUrl: s.coverUrl || '',
        duration: s.duration,
        isHR: s.isHR,
        isSQ: s.isSQ,
        fileSize: s.fileSize,
        filePath: s.filePath,
      }));

      setSongs(convertedSongs);

      // 从歌曲中提取专辑和艺术家
      const albumMap = new Map<
        string,
        { name: string; artist: string; coverUrl: string; count: number }
      >();
      const artistMap = new Map<string, { name: string; coverUrl: string; count: number }>();

      convertedSongs.forEach((song) => {
        // 专辑
        if (!albumMap.has(song.album)) {
          albumMap.set(song.album, {
            name: song.album,
            artist: song.artist,
            coverUrl: song.coverUrl,
            count: 1,
          });
        } else {
          const album = albumMap.get(song.album)!;
          album.count++;
        }

        // 艺术家
        if (!artistMap.has(song.artist)) {
          artistMap.set(song.artist, {
            name: song.artist,
            coverUrl: song.coverUrl,
            count: 1,
          });
        } else {
          const artist = artistMap.get(song.artist)!;
          artist.count++;
        }
      });

      setAlbums(
        Array.from(albumMap.entries()).map(([, a], index) => ({
          id: `album-${index}`,
          name: a.name,
          artist: a.artist,
          coverUrl: a.coverUrl,
          songCount: a.count,
        }))
      );

      setArtists(
        Array.from(artistMap.entries()).map(([, a], index) => ({
          id: `artist-${index}`,
          name: a.name,
          coverUrl: a.coverUrl,
          songCount: a.count,
        }))
      );

      setHasScanned(true);
      showToast(`成功扫描 ${songs.length} 首歌曲`, 'success');

      // 延迟返回首页
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showToast(`扫描失败: ${error}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const isAndroid = platform === 'android';

  return (
    <div
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="min-h-screen"
    >
      {/* Toast 弹窗 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0 z-10"
      >
        <div className="relative flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded lg:hidden ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            扫描音乐
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Folder scan */}
          <div
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}
              >
                <Folder
                  className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">
                  {isAndroid ? '选择音乐目录' : '选择文件夹'}
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isAndroid ? '选择要扫描的音乐目录' : '从指定文件夹扫描音乐'}
                </p>

                {/* Android: 显示常用目录列表 */}
                {isAndroid && androidDirs.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p
                      className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      常用目录:
                    </p>
                    {androidDirs.map((dir) => (
                      <button
                        key={dir}
                        onClick={() => handleToggleAndroidDir(dir)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedDirs.includes(dir)
                            ? isDarkMode
                              ? 'bg-blue-900 border-blue-700'
                              : 'bg-blue-50 border-blue-200'
                            : isDarkMode
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-100 hover:bg-gray-200'
                        } border`}
                      >
                        <div className="flex items-center gap-3">
                          <Music
                            className={`w-5 h-5 ${
                              selectedDirs.includes(dir)
                                ? 'text-blue-500'
                                : isDarkMode
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                            }`}
                          />
                          <span className="text-sm truncate">{dir}</span>
                        </div>
                        {selectedDirs.includes(dir) && (
                          <Check className="w-5 h-5 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* 已选择的自定义文件夹 (非 Android 预设目录) */}
                {selectedDirs.filter((d) => !androidDirs.includes(d)).length > 0 && (
                  <div className="mb-4 space-y-2">
                    {!isAndroid && (
                      <p
                        className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        已选择:
                      </p>
                    )}
                    {selectedDirs
                      .filter((d) => !androidDirs.includes(d))
                      .map((dir) => (
                        <div
                          key={dir}
                          className={`flex items-center justify-between p-2 rounded ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <span className="text-sm truncate flex-1 mr-2">{dir}</span>
                          <button
                            onClick={() => handleRemoveDir(dir)}
                            className={`p-1 rounded hover:bg-opacity-80 ${
                              isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                <button
                  onClick={handleSelectFolder}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {isAndroid
                    ? '浏览其他文件夹'
                    : selectedDirs.length > 0
                      ? '添加更多文件夹'
                      : '选择文件夹'}
                </button>
              </div>
            </div>
          </div>

          {/* Navidrome */}
          <div
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}
              >
                <ScanSearch
                  className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Navidrome 服务器</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  连接到 Navidrome 音乐服务器
                </p>
                <button
                  onClick={() => navigate('/navidrome-config')}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  配置服务器
                </button>
              </div>
            </div>
          </div>

          {/* Skip short audio */}
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">不扫描60秒以下音频</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  跳过过短的音频文件
                </p>
              </div>
              <button
                onClick={() => setSkipShortAudio(!skipShortAudio)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  skipShortAudio
                    ? 'bg-blue-500'
                    : isDarkMode
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    skipShortAudio ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Start scan button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full mt-6 px-6 py-3 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-medium disabled:opacity-50`}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              扫描中...
            </>
          ) : (
            '开始扫描'
          )}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
