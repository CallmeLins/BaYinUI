import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const PrivacyPage = () => {
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
        <h1 className="text-lg font-semibold tracking-tight">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-8 shadow-sm">
           <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
             Last Updated: January 2024
           </div>

           <div className="space-y-8">
             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Data Collection</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 BaYin is a local-first application. We do not collect, store, or transmit any of your personal data. All your data remains on your device.
               </p>
             </section>

             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Local Storage</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 We use local storage to save your application settings, playlists, and playback history. This data is strictly local and is never uploaded to any server.
               </p>
             </section>

             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Navidrome Integration</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 If you choose to connect to a Navidrome server, your credentials are used solely to communicate with your specified server and are not shared with any third parties.
               </p>
             </section>

             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Third-Party Services</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 BaYin does not use any third-party analytics or tracking services. We respect your privacy and do not track your usage.
               </p>
             </section>
           </div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
