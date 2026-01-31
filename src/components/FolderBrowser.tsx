import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronRight, ChevronLeft, X, Check, Home } from 'lucide-react';
import { listDirectories, type DirectoryEntry } from '../services/scanner';
import { cn } from '../components/ui/utils';

interface FolderBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

// Android 根目录选项
const ROOT_PATHS = [
  { name: 'Internal Storage', path: '/storage/emulated/0' },
  { name: 'SD Card', path: '/storage/sdcard1' },
  { name: 'External Storage', path: '/sdcard' },
];

export const FolderBrowser = ({ isOpen, onClose, onSelect, initialPath = '/storage/emulated/0' }: FolderBrowserProps) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Load directory contents
  useEffect(() => {
    if (!isOpen) return;

    const loadDirectory = async () => {
      setLoading(true);
      setError(null);
      try {
        const dirs = await listDirectories(currentPath);
        setEntries(dirs);
      } catch (e) {
        setError(`Failed to load: ${e}`);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadDirectory();
  }, [currentPath, isOpen]);

  const navigateTo = (path: string) => {
    setHistory([...history, currentPath]);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (history.length > 0) {
      const previousPath = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentPath(previousPath);
    }
  };

  const goToParent = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      const parentPath = '/' + parts.join('/');
      setHistory([...history, currentPath]);
      setCurrentPath(parentPath);
    }
  };

  const handleSelect = () => {
    onSelect(currentPath);
    onClose();
  };

  // Get display name for current path
  const getDisplayPath = () => {
    if (currentPath === '/storage/emulated/0') return 'Internal Storage';
    if (currentPath.startsWith('/storage/emulated/0/')) {
      return currentPath.replace('/storage/emulated/0/', 'Internal Storage/');
    }
    return currentPath;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-no-drag
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Browser Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "relative w-full max-h-[80vh] overflow-hidden",
              "bg-white dark:bg-[#1e1e1e]",
              "rounded-t-2xl",
              "flex flex-col"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={goBack}
                  disabled={history.length === 0}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    history.length === 0
                      ? "opacity-30"
                      : "hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToParent}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
              <h2 className="font-semibold text-lg">Select Folder</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Path */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400 truncate">
              {getDisplayPath()}
            </div>

            {/* Directory List */}
            <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[50vh]">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  Loading...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-500 px-4">
                  <p className="text-sm text-center">{error}</p>
                  <p className="text-xs mt-2 text-gray-500">Try selecting a different location</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Folder className="w-12 h-12 mb-2 opacity-30" />
                  <p className="text-sm">No subfolders</p>
                </div>
              ) : (
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {entries.map((entry) => (
                    <button
                      key={entry.path}
                      onClick={() => navigateTo(entry.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
                    >
                      <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="truncate flex-1">{entry.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Access */}
            <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/5">
              <p className="text-xs text-gray-500 mb-2">Quick Access</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {ROOT_PATHS.map((root) => (
                  <button
                    key={root.path}
                    onClick={() => {
                      setHistory([...history, currentPath]);
                      setCurrentPath(root.path);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-white/10 text-xs font-medium whitespace-nowrap border border-black/5 dark:border-white/10"
                  >
                    {root.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Button */}
            <div className="p-4 border-t border-black/5 dark:border-white/5">
              <button
                onClick={handleSelect}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Check className="w-5 h-5" />
                Select This Folder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
