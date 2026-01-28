import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ExternalLink, Globe, Github, Mail } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const OfficialWebsitePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    {
      icon: <Github className="w-5 h-5" />,
      title: 'GitHub 仓库',
      description: '查看源代码，报告问题，参与开发',
      url: 'https://github.com/CallmeLins',
      color: 'purple',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '项目主页',
      description: '了解更多关于八音的信息',
      url: 'https://github.com/CallmeLins',
      color: 'blue',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: '联系方式',
      description: '通过邮件与我们取得联系',
      url: 'mailto:support@example.com',
      color: 'green',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600',
      blue: isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600',
      green: isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
          <h1 className="text-lg font-medium ml-2">官方网站</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🎵</div>
          <h2 className="text-2xl font-bold mb-2">八音音乐播放器</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            优雅、强大、开源的音乐播放器
          </p>
        </div>

        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${getColorClasses(link.color)} flex-shrink-0`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{link.title}</h3>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {link.description}
                </p>
              </div>
            </div>
          </a>
        ))}

        <div
          className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="font-medium mb-3">关注我们</h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            在GitHub上关注项目，获取最新更新和动态
          </p>
          <div className="flex gap-3">
            <a
              href="https://github.com/CallmeLins"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};