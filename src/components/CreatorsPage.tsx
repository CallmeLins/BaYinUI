import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Github, Code } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const CreatorsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const creators = [
    {
      name: 'Lins',
      role: 'Lead Developer',
      avatar: '👨‍💻',
      github: 'https://github.com/CallmeLins',
      description: 'Creator and main developer of BaYin Music Player.',
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
        <h1 className="text-lg font-semibold tracking-tight">Creators</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-6">
        {creators.map((creator, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-sm"
          >
            <div className="flex items-start gap-5">
              <div className="text-6xl bg-gray-100 dark:bg-white/10 rounded-full w-20 h-20 flex items-center justify-center shadow-inner">
                 {creator.avatar}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{creator.name}</h2>
                <p className="text-sm font-medium text-blue-500 mb-2">{creator.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  {creator.description}
                </p>
                <a
                  href={creator.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Thanks section */}
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Special Thanks</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Thanks to all contributors and users who have helped make BaYin better.
          </p>
          <a
            href="https://github.com/CallmeLins"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-500 hover:underline text-sm font-medium"
          >
            <Code className="w-4 h-4" />
            View all contributors
          </a>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
