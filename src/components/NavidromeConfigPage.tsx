import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import {
  testNavidromeConnection,
  fetchNavidromeSongs,
  type NavidromeConfig,
  type ConnectionTestResult,
} from '../services/navidrome';
import { save, load } from '../services/storage';

const NAVIDROME_CONFIG_KEY = 'navidromeConfig' as const;

export const NavidromeConfigPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, setSongs } = useMusic();
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // 加载已保存的配置
  useEffect(() => {
    const loadConfig = async () => {
      const config = await load<NavidromeConfig | null>(NAVIDROME_CONFIG_KEY as never, null);
      if (config) {
        setServerUrl(config.serverUrl);
        setUsername(config.username);
        // 密码不从存储中加载（安全考虑）
      }
    };
    loadConfig();
  }, []);

  const getConfig = (): NavidromeConfig => ({
    serverUrl: serverUrl.trim(),
    username: username.trim(),
    password,
  });

  const handleTest = async () => {
    const config = getConfig();
    if (!config.serverUrl || !config.username || !config.password) {
      setTestResult({
        success: false,
        message: '请填写完整信息',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testNavidromeConnection(config);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `测试失败: ${error}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    const config = getConfig();
    if (!config.serverUrl || !config.username) {
      setTestResult({
        success: false,
        message: '请填写服务器地址和用户名',
      });
      return;
    }

    setIsSaving(true);
    try {
      // 只保存 serverUrl 和 username，密码不持久化
      await save(NAVIDROME_CONFIG_KEY as never, {
        serverUrl: config.serverUrl,
        username: config.username,
        password: '', // 不保存密码
      });
      setTestResult({
        success: true,
        message: '配置已保存',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `保存失败: ${error}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchSongs = async () => {
    const config = getConfig();
    if (!config.serverUrl || !config.username || !config.password) {
      setTestResult({
        success: false,
        message: '请填写完整信息',
      });
      return;
    }

    setIsFetching(true);
    setTestResult(null);

    try {
      const songs = await fetchNavidromeSongs(config);
      // 将歌曲添加到 MusicContext
      setSongs(
        songs.map((s) => ({
          ...s,
          coverUrl: s.coverUrl || '',
          // 对于 Navidrome 歌曲，保存配置信息用于后续流式播放
          filePath: JSON.stringify({ type: 'navidrome', songId: s.id, config }),
        }))
      );
      setTestResult({
        success: true,
        message: `成功获取 ${songs.length} 首歌曲`,
      });
      // 延迟返回，让用户看到结果
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setTestResult({
        success: false,
        message: `获取失败: ${error}`,
      });
    } finally {
      setIsFetching(false);
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
          <label
            className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
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
          <label
            className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
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
          <label
            className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
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
          <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            密码不会被保存，每次需要重新输入
          </p>
        </div>

        <button
          onClick={handleTest}
          disabled={isTesting}
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          } disabled:opacity-50`}
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              测试中...
            </>
          ) : (
            '测试连接'
          )}
        </button>

        {testResult && (
          <div
            className={`p-4 rounded-lg ${
              testResult.success
                ? 'bg-green-500 bg-opacity-20 text-green-500'
                : 'bg-red-500 bg-opacity-20 text-red-500'
            }`}
          >
            <p>{testResult.message}</p>
            {testResult.serverVersion && (
              <p className="text-sm mt-1 opacity-80">服务器版本: {testResult.serverVersion}</p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              '保存配置'
            )}
          </button>

          <button
            onClick={handleFetchSongs}
            disabled={isFetching}
            className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white disabled:opacity-50`}
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                获取中...
              </>
            ) : (
              '获取音乐库'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
