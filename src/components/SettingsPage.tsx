import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Palette, HelpCircle, Download, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, setMobileSidebarOpen } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const settingsItems = [
    { icon: <Palette className="w-5 h-5" />, label: 'User Interface', path: '/settings/interface', color: 'bg-blue-500' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Feedback', path: '/settings/help', color: 'bg-purple-500' },
    { icon: <Download className="w-5 h-5" />, label: 'Software Update', path: '/settings/update', color: 'bg-green-500' },
  ];

  return (
    <div className="relative pb-20">
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
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
          {settingsItems.map((item, index) => (
            <div key={index} className="relative">
               <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-4 transition-colors",
                    "hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-md text-white shadow-sm", item.color)}>
                       {item.icon}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                {/* Separator */}
                {index < settingsItems.length - 1 && (
                   <div className="absolute bottom-0 left-14 right-0 h-[1px] bg-black/5 dark:bg-white/5" />
                )}
            </div>
          ))}
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};