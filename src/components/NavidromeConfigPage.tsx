import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Loader2, CheckCircle, AlertCircle, Server, User, Lock } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import {
  testNavidromeConnection,
  fetchNavidromeSongs,
  type NavidromeConfig,
  type ConnectionTestResult,
} from '../services/navidrome';
import { save, load } from '../services/storage';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAVIDROME_CONFIG_KEY = 'navidromeConfig' as const;

export const NavidromeConfigPage = () => {
  const navigate = useNavigate();
  const { setSongs } = useMusic();
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await load<NavidromeConfig | null>(NAVIDROME_CONFIG_KEY as never, null);
      if (config) {
        setServerUrl(config.serverUrl);
        setUsername(config.username);
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
      setTestResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testNavidromeConnection(config);
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: `Test failed: ${error}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    const config = getConfig();
    if (!config.serverUrl || !config.username) {
      setTestResult({ success: false, message: 'Please fill in server URL and username' });
      return;
    }

    setIsSaving(true);
    try {
      await save(NAVIDROME_CONFIG_KEY as never, {
        serverUrl: config.serverUrl,
        username: config.username,
        password: '',
      });
      setTestResult({ success: true, message: 'Configuration saved' });
    } catch (error) {
      setTestResult({ success: false, message: `Save failed: ${error}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchSongs = async () => {
    const config = getConfig();
    if (!config.serverUrl || !config.username || !config.password) {
      setTestResult({ success: false, message: 'Please fill in all fields' });
      return;
    }

    setIsFetching(true);
    setTestResult(null);

    try {
      const songs = await fetchNavidromeSongs(config);
      setSongs(
        songs.map((s) => ({
          ...s,
          coverUrl: s.coverUrl || '',
          filePath: JSON.stringify({ type: 'navidrome', songId: s.id, config }),
        }))
      );
      setTestResult({ success: true, message: `Successfully fetched ${songs.length} songs` });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setTestResult({ success: false, message: `Fetch failed: ${error}` });
    } finally {
      setIsFetching(false);
    }
  };

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
        <h1 className="text-lg font-semibold tracking-tight">Navidrome Config</h1>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Form Card */}
        <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden p-6 shadow-sm">
           <div className="space-y-4">
              
              {/* Server URL */}
              <div>
                 <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Server URL</label>
                 <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <Server className="w-4 h-4" />
                    </div>
                    <input
                       type="text"
                       value={serverUrl}
                       onChange={(e) => setServerUrl(e.target.value)}
                       placeholder="https://music.example.com"
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                 </div>
              </div>

              {/* Username */}
              <div>
                 <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                 <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <User className="w-4 h-4" />
                    </div>
                    <input
                       type="text"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       placeholder="Username"
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                 </div>
              </div>

              {/* Password */}
              <div>
                 <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                 <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <Lock className="w-4 h-4" />
                    </div>
                    <input
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Password"
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                 </div>
                 <p className="mt-1.5 text-xs text-gray-400">Password is not saved locally for security.</p>
              </div>

              {/* Test Button */}
              <button
                 onClick={handleTest}
                 disabled={isTesting}
                 className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                 {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Connection'}
              </button>

              {/* Result Message */}
              <AnimatePresence>
                 {testResult && (
                    <motion.div
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className={cn(
                          "p-3 rounded-xl text-sm flex items-start gap-2",
                          testResult.success 
                             ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                             : "bg-red-500/10 text-red-600 dark:text-red-400"
                       )}
                    >
                       {testResult.success ? <CheckCircle className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                       <div>
                          <p className="font-medium">{testResult.message}</p>
                          {testResult.serverVersion && (
                             <p className="text-xs opacity-80 mt-0.5">Server v{testResult.serverVersion}</p>
                          )}
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
           <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 font-medium transition-colors flex items-center justify-center gap-2"
           >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Config'}
           </button>
           <button
              onClick={handleFetchSongs}
              disabled={isFetching}
              className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
           >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch Library'}
           </button>
        </div>

      </div>
    </div>
  );
};