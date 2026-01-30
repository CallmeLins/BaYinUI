import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const TermsPage = () => {
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
        <h1 className="text-lg font-semibold tracking-tight">Terms of Use</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-8 shadow-sm">
           <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
             Last Updated: January 2024
           </div>

           <div className="space-y-8">
             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 Welcome to BaYin. By using this software, you agree to comply with these terms of use. If you do not agree to these terms, please do not use the software.
               </p>
             </section>

             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. License</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 BaYin is open-source software licensed under the MIT License. You are free to use, copy, modify, and distribute this software in accordance with the license terms.
               </p>
             </section>

             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. User Responsibilities</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 You are responsible for ensuring that you have the legal right to play the music files you use with this software. BaYin is not responsible for user content.
               </p>
             </section>

             <section>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Disclaimer</h2>
               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                 This software is provided "as is", without warranty of any kind, express or implied. The developers are not liable for any damages arising from the use of this software.
               </p>
             </section>
           </div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
