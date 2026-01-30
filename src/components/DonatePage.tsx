import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Heart, Coffee, Github, Share2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const DonatePage = () => {
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
        <h1 className="text-lg font-semibold tracking-tight">Donate</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center py-8">
          <div className="text-6xl mb-4 animate-pulse">❤️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Support BaYin</h2>
          <p className="text-gray-500 dark:text-gray-400">
            If you enjoy using BaYin, consider supporting its development.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid gap-4">
          {/* Coffee */}
          <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <Coffee className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Buy me a coffee</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Your donation helps keep the project alive and motivates further development.
                </p>
                <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-center">
                  <p className="text-sm text-gray-400 font-medium">QR Code Placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Star */}
          <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Github className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Star on GitHub</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Starring the project on GitHub is a great way to show your support and help others find it.
                </p>
                <a
                  href="https://github.com/CallmeLins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <Github className="w-4 h-4" />
                  <span>Go to GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Share with Friends</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tell your friends about BaYin and help our community grow.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500 pt-4">
          Thank you for your support!
        </p>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
