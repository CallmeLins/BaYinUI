import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';

export const TermsPage = () => {
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
          <h1 className="text-lg font-medium ml-2">软件使用条款</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          最后更新：2024年1月
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. 接受条款</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            欢迎使用八音音乐播放器。使用本软件即表示您同意遵守这些使用条款。如果您不同意这些条款，请不要使用本软件。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. 许可授权</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            八音是一款开源软件，根据相应的开源许可证授权使用。您可以自由使用、复制、修改和分发本软件，但需遵守相关许可证的条款。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. 用户责任</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            您有责任确保您使用本软件播放的音乐文件具有合法的版权或使用权。八音不对用户使用的内容承担责任。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. 免责声明</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            本软件按"现状"提供，不提供任何形式的明示或暗示保证。开发者不对使用本软件造成的任何直接或间接损失负责。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">5. 更新和修改</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            我们保留随时修改这些条款的权利。继续使用本软件即表示您接受修改后的条款。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. 联系我们</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            如对这些条款有任何疑问，请通过GitHub联系我们。
          </p>
        </section>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};