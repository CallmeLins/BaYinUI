import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

export const MusicLibraryPage = () => {
  const { songs, isDarkMode, hasScanned, setMobileSidebarOpen } = useMusic();

  const getQualityStats = () => {
    let hq = 0, sq = 0, hiRes = 0, other = 0;

    songs.forEach(song => {
      if (song.isHr && song.isSq) {
        hiRes++;
      } else if (song.isHr) {
        hq++;
      } else if (song.isSq) {
        sq++;
      } else {
        other++;
      }
    });

    return [
      { name: 'Hi-Res', value: hiRes, color: '#8b5cf6' }, // Purple
      { name: 'SQ', value: sq, color: '#10b981' }, // Green
      { name: 'HQ', value: hq, color: '#3b82f6' }, // Blue
      { name: 'Other', value: other, color: '#9ca3af' }, // Gray
    ].filter(item => item.value > 0);
  };

  const data = getQualityStats();

  return (
    <div className="relative pb-20">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center justify-between",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Library Stats</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {!hasScanned || songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No music data available.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Scan your library to see statistics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-2xl",
                "bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md",
                "border border-black/5 dark:border-white/10 shadow-sm"
              )}
            >
              <h2 className="text-lg font-medium mb-6">Audio Quality Distribution</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              {data.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-xl",
                    "bg-white/40 dark:bg-[#1e1e1e]/40 backdrop-blur-sm",
                    "border border-black/5 dark:border-white/5",
                    "hover:bg-white/60 dark:hover:bg-[#1e1e1e]/60 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full shadow-[0_0_8px]"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                    />
                    <span className="font-medium text-lg">{item.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tracking-tight">{item.value}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">songs</span>
                  </div>
                </motion.div>
              ))}
              
              {/* Total Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  "mt-auto flex items-center justify-between p-6 rounded-xl",
                  "bg-gradient-to-br from-blue-500/10 to-purple-500/10",
                  "border border-blue-500/20"
                )}
              >
                 <span className="font-medium text-lg text-blue-600 dark:text-blue-400">Total Library</span>
                 <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{songs.length}</span>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};