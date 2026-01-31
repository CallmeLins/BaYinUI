import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Mail, MessageSquare, Bug, Lightbulb, Book, ChevronRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const HelpFeedbackPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const helpItems = [
    {
      icon: <Book className="w-5 h-5" />,
      title: 'User Guide',
      description: 'Learn how to use BaYin features',
      color: 'bg-blue-500',
    },
    {
      icon: <Bug className="w-5 h-5" />,
      title: 'Report Issue',
      description: 'Found a bug? Let us know',
      link: 'https://github.com/CallmeLins/BaYin/issues',
      color: 'bg-red-500',
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Feature Request',
      description: 'Share your ideas for new features',
      link: 'https://github.com/CallmeLins/BaYin/issues',
      color: 'bg-yellow-500',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Community',
      description: 'Join discussions with other users',
      link: 'https://github.com/CallmeLins/BaYin/discussions',
      color: 'bg-purple-500',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Contact Us',
      description: 'Get in touch via email',
      email: 'support@example.com',
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
        <h1 className="text-lg font-semibold tracking-tight">Help & Feedback</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Resources Group */}
        <section>
           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Resources</h2>
           <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
              {helpItems.map((item, index) => (
                 <div key={index} className="relative">
                    <a
                       href={item.link || (item.email ? `mailto:${item.email}` : '#')}
                       target={item.link ? "_blank" : undefined}
                       rel={item.link ? "noopener noreferrer" : undefined}
                       className={cn(
                         "w-full flex items-center justify-between px-4 py-4 transition-colors",
                         "hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10"
                       )}
                    >
                       <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-lg text-white shadow-sm", item.color)}>
                             {item.icon}
                          </div>
                          <div>
                             <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                             <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-gray-400" />
                    </a>
                    {index < helpItems.length - 1 && (
                       <div className="absolute bottom-0 left-16 right-0 h-[1px] bg-black/5 dark:bg-white/5" />
                    )}
                 </div>
              ))}
           </div>
        </section>

        {/* FAQ Group */}
        <section>
           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">FAQ</h2>
           <div className="space-y-4 px-2">
              {[
                {
                  q: 'How do I import music?',
                  a: 'Go to the Scan Music page, select a folder or configure a Navidrome server to import your library.',
                },
                {
                  q: 'Which audio formats are supported?',
                  a: 'BaYin supports MP3, FLAC, APE, WAV, M4A, and other common audio formats.',
                },
                {
                  q: 'How do I create a playlist?',
                  a: 'Go to the Playlists page, click the + button in the top right corner to create a new playlist.',
                },
              ].map((faq, index) => (
                 <div key={index} className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-5">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                 </div>
              ))}
           </div>
        </section>

      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
