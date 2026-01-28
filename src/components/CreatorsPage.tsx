import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Github, Code } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const CreatorsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const creators = [
    {
      name: 'Lins',
      role: '开发者',
      avatar: '👨‍💻',
      github: 'https://github.com/CallmeLins',
      description: '八音音乐播放器的创建者和主要开发者',
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
          <h1 className="text-lg font-medium ml-2">制作人员</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {creators.map((creator, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">{creator.avatar}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{creator.name}</h2>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {creator.role}
                </p>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {creator.description}
                </p>
                <a
                  href={creator.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Thanks section */}
        <div
          className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="text-lg font-medium mb-3">特别感谢</h3>
          <div className="space-y-2">
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              感谢所有为八音做出贡献的开发者和用户
            </p>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <a
                href="https://github.com/CallmeLins"
                target="_blank"
                rel="noopener noreferrer"
                className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}
              >
                查看所有贡献者
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};