import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export const MusicLibraryPage = () => {
  const { songs, isDarkMode, hasScanned } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 统计音乐质量
  const getQualityStats = () => {
    let hq = 0, sq = 0, hiRes = 0, other = 0;

    songs.forEach(song => {
      if (song.isHR && song.isSQ) {
        hiRes++;
      } else if (song.isHR) {
        hq++;
      } else if (song.isSQ) {
        sq++;
      } else {
        other++;
      }
    });

    return [
      { name: 'HQ', value: hq, color: '#3b82f6' },
      { name: 'SQ', value: sq, color: '#10b981' },
      { name: 'Hi-Res', value: hiRes, color: '#8b5cf6' },
      { name: '其他', value: other, color: '#6b7280' },
    ].filter(item => item.value > 0);
  };

  const data = getQualityStats();

  return (
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="relative min-h-screen"
    >
      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0 z-10"
      >
        <div className="relative flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded lg:hidden ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">音乐库</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!hasScanned || songs.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {!hasScanned ? '请先扫描音乐' : '音乐库为空'}
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6">音乐质量分布</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Stats */}
            <div className="mt-8 space-y-3">
              {data.map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {item.value} 首
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};