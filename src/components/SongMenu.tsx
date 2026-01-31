import { createPortal } from 'react-dom';
import { ListPlus, PlaySquare, User, Disc, Info, Trash2, X } from 'lucide-react';
import { Song, useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SongMenuProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
}

export const SongMenu = ({ isOpen, song, onClose }: SongMenuProps) => {
  const { addNextToQueue } = useMusic();

  const handlePlayNext = () => {
    if (song) {
      addNextToQueue(song);
    }
    onClose();
  };

  const menuItems = [
    { icon: <ListPlus className="w-5 h-5" />, label: 'Add to Playlist', onClick: onClose },
    { icon: <PlaySquare className="w-5 h-5" />, label: 'Play Next', onClick: handlePlayNext },
    { icon: <User className="w-5 h-5" />, label: 'Go to Artist', onClick: onClose },
    { icon: <Disc className="w-5 h-5" />, label: 'Go to Album', onClick: onClose },
    { icon: <Info className="w-5 h-5" />, label: 'Song Info', onClick: onClose },
    { icon: <Trash2 className="w-5 h-5" />, label: 'Delete from Library', danger: true, onClick: onClose },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && song && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-no-drag
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal / Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.25,
              ease: [0.32, 0.72, 0, 1],
            }}
            className={cn(
              "relative w-full max-w-md overflow-hidden",
              "bg-white/90 dark:bg-[#282828]/90 backdrop-blur-xl saturate-150",
              "rounded-t-2xl sm:rounded-2xl",
              "shadow-2xl border-t sm:border border-black/5 dark:border-white/10",
              "flex flex-col max-h-[85vh]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 flex items-start gap-4 border-b border-black/5 dark:border-white/5">
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-16 h-16 rounded-lg shadow-md object-cover bg-gray-100 dark:bg-white/5"
              />
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="font-semibold text-lg leading-tight truncate text-gray-900 dark:text-white mb-1">
                  {song.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {song.artist} &middot; {song.album}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 opacity-60" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-2 overflow-y-auto scrollbar-thin">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98]",
                    item.danger ? "text-red-500 hover:bg-red-500/10" : "text-gray-700 dark:text-gray-200"
                  )}
                >
                  <span className={cn("opacity-70", item.danger && "opacity-100")}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Cancel Button (Mobile only usually, but good for accessibility) */}
            <div className="p-4 pt-2 sm:hidden">
               <button 
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gray-100 dark:bg-white/10 font-semibold text-gray-900 dark:text-white"
               >
                  Cancel
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};