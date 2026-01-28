import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

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
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="min-h-screen"
    >
      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0"
      >
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium ml-2">开放源代码许可</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h2 className="text-lg font-medium mb-2">八音音乐播放器</h2>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            八音是一款开源音乐播放器，采用MIT许可证发布
          </p>
          <a
            href="https://github.com/CallmeLins"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            查看源代码
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">第三方开源库</h3>
          <div className="space-y-2">
            {licenses.map((lib, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{lib.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {lib.license}
                    </p>
                  </div>
                  <a
                    href={lib.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="font-medium mb-2">感谢开源社区</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            八音的开发离不开这些优秀的开源项目的支持。感谢所有开源贡献者的无私奉献。
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};