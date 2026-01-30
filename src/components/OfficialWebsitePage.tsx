import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ExternalLink, Globe, Github, Mail } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const OfficialWebsitePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    {
      icon: <Github className="w-5 h-5" />,
      title: 'GitHub Repository',
      description: 'View source code, report issues, contribute.',
      url: 'https://github.com/CallmeLins',
      color: 'bg-purple-500',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Project Homepage',
      description: 'Learn more about BaYin.',
      url: 'https://github.com/CallmeLins',
      color: 'bg-blue-500',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Contact',
      description: 'Get in touch via email.',
      url: 'mailto:support@example.com',
      color: 'bg-green-500',
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
        <h1 className="text-lg font-semibold tracking-tight">Official Website</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🎵</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">BaYin Music Player</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Elegant, powerful, open-source.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex items-start gap-4 p-5 rounded-2xl transition-all",
                "bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md",
                "border border-black/5 dark:border-white/10",
                "hover:bg-white/80 dark:hover:bg-[#1e1e1e]/80 hover:shadow-md"
              )}
            >
              <div className={cn("p-3 rounded-xl text-white shadow-sm", link.color)}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{link.title}</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Follow Us */}
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Follow Us</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Star the project on GitHub to get the latest updates.
          </p>
          <a
            href="https://github.com/CallmeLins"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-sm font-medium transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
