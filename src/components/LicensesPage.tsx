import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ExternalLink, Code } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const LicensesPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const licenses = [
    {
      name: 'React',
      license: 'MIT License',
      link: 'https://github.com/facebook/react/blob/main/LICENSE',
    },
    {
      name: 'React Router',
      license: 'MIT License',
      link: 'https://github.com/remix-run/react-router/blob/main/LICENSE.md',
    },
    {
      name: 'Lucide React',
      license: 'ISC License',
      link: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
    },
    {
      name: 'Recharts',
      license: 'MIT License',
      link: 'https://github.com/recharts/recharts/blob/master/LICENSE',
    },
    {
      name: 'Tailwind CSS',
      license: 'MIT License',
      link: 'https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE',
    },
  ];

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
        <h1 className="text-lg font-semibold tracking-tight">Open Source Licenses</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Main License */}
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">BaYin Music Player</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            BaYin is open-source software released under the MIT License.
          </p>
          <a
            href="https://github.com/CallmeLins/BaYin?tab=Apache-2.0-1-ov-file"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:underline"
          >
            <Code className="w-4 h-4" />
            View Source Code
          </a>
        </div>

        {/* Third Party Licenses */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Third-Party Libraries</h3>
          <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
            {licenses.map((lib, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{lib.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lib.license}</p>
                </div>
                <a
                  href={lib.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                {index < licenses.length - 1 && (
                   <div className="absolute bottom-0 left-4 right-0 h-[1px] bg-black/5 dark:bg-white/5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
