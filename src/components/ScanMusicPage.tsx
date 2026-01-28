import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Folder, ScanSearch } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const ScanMusicPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, scanMusic, skipShortAudio, setSkipShortAudio } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScan = () => {
    scanMusic();
    navigate('/');
  };

  return (
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="min-h-screen"
    >
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
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">扫描音乐</h1>
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
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <Folder className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">选择文件夹</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  从指定文件夹扫描音乐
                </p>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  选择文件夹
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
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <ScanSearch className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
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
          className={`w-full mt-6 px-6 py-3 rounded-lg ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-medium`}
        >
          开始扫描
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};