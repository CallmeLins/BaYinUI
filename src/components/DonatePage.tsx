import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Heart, Coffee, Github } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const DonatePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <h1 className="text-lg font-medium ml-2">赞赏</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold mb-3">支持八音的发展</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            如果您喜欢八音，可以通过以下方式支持我们
          </p>
        </div>

        <div className="space-y-3">
          <div
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                } flex-shrink-0`}
              >
                <Coffee className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">请我喝杯咖啡</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  您的赞赏将帮助我们继续开发和改进八音
                </p>
                <div className="text-sm text-center p-4 border rounded-lg border-dashed">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    赞赏二维码将在这里显示
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-purple-900' : 'bg-purple-100'
                } flex-shrink-0`}
              >
                <Github className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">Star 项目</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  在GitHub上为项目点个Star，这是对我们最大的鼓励
                </p>
                <a
                  href="https://github.com/CallmeLins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>前往 GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                } flex-shrink-0`}
              >
                <Heart className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">分享推荐</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  向朋友推荐八音，让更多人享受优质的音乐体验
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            感谢您的支持！
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};