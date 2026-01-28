import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const UserInterfacePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    isDarkMode,
    toggleDarkMode,
    showCoverInList,
    setShowCoverInList,
    lyricsFontSize,
    setLyricsFontSize,
    lyricsTextAlign,
    setLyricsTextAlign,
    lyricsFontWeight,
    setLyricsFontWeight,
  } = useMusic();

  return (
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="min-h-screen"
    >
      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0"
      >
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium ml-2">用户界面</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Theme section */}
        <div>
          <h2 className="text-lg font-medium mb-3">主题</h2>
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">深色模式</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  使用深色主题保护眼睛
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Lyrics section */}
        <div>
          <h2 className="text-lg font-medium mb-3">歌词界面设置</h2>
          <div
            className={`rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Font size */}
            <div className="p-4 border-b border-gray-200">
              <label className="block mb-3">
                <span className="font-medium">字体大小</span>
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lyricsFontSize}px
                </span>
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={lyricsFontSize}
                onChange={(e) => setLyricsFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Text align */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">歌词文本居中对齐</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    歌词显示在屏幕中央
                  </p>
                </div>
                <button
                  onClick={() => setLyricsTextAlign(!lyricsTextAlign)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    lyricsTextAlign ? 'bg-blue-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      lyricsTextAlign ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Font weight */}
            <div className="p-4">
              <label className="block mb-3 font-medium">字体粗细</label>
              <div className="flex gap-2">
                {[
                  { value: 'normal', label: '常规' },
                  { value: 'medium', label: '中等' },
                  { value: 'bold', label: '粗体' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLyricsFontWeight(option.value as any)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      lyricsFontWeight === option.value
                        ? isDarkMode
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-blue-500 border-blue-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Song list section */}
        <div>
          <h2 className="text-lg font-medium mb-3">歌曲列表设置</h2>
          <div
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">在列表中显示歌曲封面</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  在所有歌曲列表中显示封面图
                </p>
              </div>
              <button
                onClick={() => setShowCoverInList(!showCoverInList)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showCoverInList ? 'bg-blue-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    showCoverInList ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};