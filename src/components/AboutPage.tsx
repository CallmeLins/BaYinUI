import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, ChevronRight, Users, FileText, Shield, Code, Heart, Globe } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';

export const AboutPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, setMobileSidebarOpen } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const aboutItems = [
    { icon: <Users className="w-5 h-5" />, label: 'Creators', path: '/about/creators', color: 'bg-blue-500' },
    { icon: <FileText className="w-5 h-5" />, label: 'Terms of Use', path: '/about/terms', color: 'bg-gray-500' },
    { icon: <Shield className="w-5 h-5" />, label: 'Privacy Policy', path: '/about/privacy', color: 'bg-green-500' },
    { icon: <Code className="w-5 h-5" />, label: 'Open Source Licenses', path: '/about/licenses', color: 'bg-orange-500' },
    { icon: <Heart className="w-5 h-5" />, label: 'Donate', path: '/about/donate', color: 'bg-red-500' },
    { icon: <Globe className="w-5 h-5" />, label: 'Official Website', path: '/about/website', color: 'bg-purple-500' },
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
          <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        </div>
      </div>

      {/* App Info */}
      <div className="flex flex-col items-center justify-center py-8 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[22px] shadow-2xl flex items-center justify-center mb-4 text-5xl">
          🎵
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">BaYin</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Version 1.0.0</p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
          {aboutItems.map((item, index) => (
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
                {index < aboutItems.length - 1 && (
                   <div className="absolute bottom-0 left-14 right-0 h-[1px] bg-black/5 dark:bg-white/5" />
                )}
            </div>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
           © 2024 BaYin Music. All rights reserved.
        </p>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};