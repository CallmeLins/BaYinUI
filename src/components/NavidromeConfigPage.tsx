import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const NavidromeConfigPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useMusic();
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTest = () => {
    // 模拟测试连接
    if (serverUrl && username && password) {
      setTestResult('连接成功');
    } else {
      setTestResult('请填写完整信息');
    }
  };

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
          <h1 className="text-lg font-medium ml-2">Navidrome 配置</h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div>
          <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            服务器地址
          </label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="https://your-server.com"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } outline-none focus:border-blue-500`}
          />
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            用户名
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="输入用户名"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } outline-none focus:border-blue-500`}
          />
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } outline-none focus:border-blue-500`}
          />
        </div>

        <button
          onClick={handleTest}
          className={`w-full px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          测试连接
        </button>

        {testResult && (
          <div
            className={`p-4 rounded-lg ${
              testResult.includes('成功')
                ? 'bg-green-500 bg-opacity-20 text-green-500'
                : 'bg-red-500 bg-opacity-20 text-red-500'
            }`}
          >
            {testResult}
          </div>
        )}

        <button
          className={`w-full px-4 py-2 rounded-lg ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          保存配置
        </button>
      </div>
    </div>
  );
};