import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, ChevronRight, Palette, HelpCircle, Download } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const settingsItems = [
    { icon: <Palette className="w-5 h-5" />, label: '用户界面', path: '/settings/interface' },
    { icon: <HelpCircle className="w-5 h-5" />, label: '帮助与反馈', path: '/settings/help' },
    { icon: <Download className="w-5 h-5" />, label: '更新软件', path: '/settings/update' },
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
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">设置</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {settingsItems.map((item, index) => (
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