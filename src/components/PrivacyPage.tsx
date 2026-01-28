import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const PrivacyPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <h1 className="text-lg font-medium ml-2">隐私协议</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          最后更新：2024年1月
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. 信息收集</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            八音是一款完全本地运行的音乐播放器，我们不会收集、存储或传输您的任何个人信息。所有数据都存储在您的设备上。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. 本地存储</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            八音使用本地存储来保存您的应用设置、歌单和播放历史。这些数据仅存储在您的设备上，不会被上传到任何服务器。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. Navidrome集成</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            如果您选择连接Navidrome服务器，您的服务器凭据将仅用于与您指定的服务器通信，不会被分享给第三方。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. 第三方服务</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            八音不使用任何第三方分析或跟踪服务。我们尊重您的隐私，不会收集使用数据。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">5. 数据安全</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            由于所有数据都存储在您的设备上，数据安全取决于您设备的安全措施。请确保您的设备受到适当保护。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. 儿童隐私</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            八音不会有意收集13岁以下儿童的个人信息。本应用适合所有年龄段用户使用。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">7. 联系我们</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            如对本隐私政策有任何疑问，请通过GitHub与我们联系。
          </p>
        </section>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};