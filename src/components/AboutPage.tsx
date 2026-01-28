import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, ChevronRight, Users, FileText, Shield, Code, Heart, Globe } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const AboutPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const aboutItems = [
    { icon: <Users className="w-5 h-5" />, label: '制作人员', path: '/about/creators' },
    { icon: <FileText className="w-5 h-5" />, label: '软件使用条款', path: '/about/terms' },
    { icon: <Shield className="w-5 h-5" />, label: '隐私协议', path: '/about/privacy' },
    { icon: <Code className="w-5 h-5" />, label: '开放源代码许可', path: '/about/licenses' },
    { icon: <Heart className="w-5 h-5" />, label: '赞赏', path: '/about/donate' },
    { icon: <Globe className="w-5 h-5" />, label: '官方网站', path: '/about/website' },
  ];

  return (
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="relative min-h-screen"
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
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">关于</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* App info */}
      <div className={`p-6 text-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="text-4xl mb-2">🎵</div>
        <h2 className="text-xl font-bold mb-1">八音</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          版本 1.0.0
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {aboutItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center justify-between px-4 py-4 border-b ${
              isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};