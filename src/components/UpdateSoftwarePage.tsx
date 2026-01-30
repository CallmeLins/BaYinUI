import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const UpdateSoftwarePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative pb-20">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center gap-4",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Software Update</h1>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-white/10 rounded-[22px] mx-auto mb-6 shadow-xl flex items-center justify-center">
           <span className="text-4xl">🎵</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">BaYin</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Version 1.0.0</p>
        
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 mb-8">
           <p className="text-sm text-gray-600 dark:text-gray-300">
              Your software is up to date.
           </p>
        </div>

        <button
          className={cn(
            "px-6 py-3 rounded-xl font-medium text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mx-auto",
            "bg-blue-500 hover:bg-blue-600"
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Check for Updates
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
