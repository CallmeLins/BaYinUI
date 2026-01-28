import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Mail, MessageSquare, Bug, Lightbulb, Book } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const HelpFeedbackPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const helpItems = [
    {
      icon: <Book className="w-5 h-5" />,
      title: '使用指南',
      description: '了解如何使用八音的各项功能',
    },
    {
      icon: <Bug className="w-5 h-5" />,
      title: '报告问题',
      description: '遇到bug或错误？告诉我们',
      link: 'https://github.com/CallmeLins/issues',
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: '功能建议',
      description: '分享您对新功能的想法',
      link: 'https://github.com/CallmeLins/issues',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: '社区讨论',
      description: '加入我们的社区，与其他用户交流',
      link: 'https://github.com/CallmeLins/discussions',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: '联系我们',
      description: '通过邮件与我们取得联系',
      email: 'support@example.com',
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
          <h1 className="text-lg font-medium ml-2">帮助与反馈</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {helpItems.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex gap-3">
              <div
                className={`w-10 h-10 rounded-full ${
                  isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                } flex items-center justify-center flex-shrink-0`}
              >
                <div className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                  {item.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    } hover:underline`}
                  >
                    前往 →
                  </a>
                )}
                {item.email && (
                  <a
                    href={`mailto:${item.email}`}
                    className={`text-sm ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    } hover:underline`}
                  >
                    {item.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="p-4">
        <h2 className="text-lg font-medium mb-3">常见问题</h2>
        <div className="space-y-3">
          {[
            {
              q: '如何导入音乐？',
              a: '前往扫描音乐页面，选择文件夹或配置Navidrome服务器即可导入音乐。',
            },
            {
              q: '支持哪些音频格式？',
              a: '八音支持MP3、FLAC、APE、WAV、M4A等常见音频格式。',
            },
            {
              q: '如何创建歌单？',
              a: '进入歌单页面，点击右上角菜单按钮，选择新建歌单即可。',
            },
          ].map((faq, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className="font-medium mb-2">{faq.q}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};