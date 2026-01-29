/**
 * 音乐扫描服务
 * 负责扫描本地文件系统获取音乐文件
 */

import { isTauri, mockLog } from './tauri';

export interface ScannedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  fileSize: number;
  coverUrl?: string;
  isHR?: boolean;
  isSQ?: boolean;
}

export interface ScanOptions {
  directories: string[];
  skipShortAudio?: boolean;
  minDuration?: number; // 秒
}

export interface ScanProgress {
  total: number;
  scanned: number;
  currentFile: string;
}

// Mock 数据用于浏览器环境开发
const MOCK_SONGS: ScannedSong[] = [
  {
    id: 'mock-1',
    title: '示例歌曲 1',
    artist: '示例艺术家',
    album: '示例专辑',
    duration: 240,
    filePath: '/mock/path/song1.flac',
    fileSize: 35000000,
    isHR: true,
    isSQ: true,
  },
  {
    id: 'mock-2',
    title: '示例歌曲 2',
    artist: '示例艺术家',
    album: '示例专辑',
    duration: 180,
    filePath: '/mock/path/song2.mp3',
    fileSize: 8000000,
    isHR: false,
    isSQ: false,
  },
];

/**
 * 选择要扫描的目录
 */
export async function selectDirectory(): Promise<string | null> {
  if (isTauri()) {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择音乐文件夹',
    });
    return selected as string | null;
  }

  mockLog('scanner', 'selectDirectory');
  return '/mock/music/directory';
}

/**
 * 扫描指定目录中的音乐文件
 */
export async function scanMusicFiles(
  options: ScanOptions,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScannedSong[]> {
  if (isTauri()) {
    // Tauri 环境：调用 Rust 后端进行扫描
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<ScannedSong[]>('scan_music_files', { options });
  }

  // 浏览器环境：返回 mock 数据
  mockLog('scanner', 'scanMusicFiles', options);

  // 模拟扫描进度
  if (onProgress) {
    for (let i = 0; i <= MOCK_SONGS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onProgress({
        total: MOCK_SONGS.length,
        scanned: i,
        currentFile: MOCK_SONGS[i]?.filePath || '',
      });
    }
  }

  return MOCK_SONGS;
}

/**
 * 获取音乐文件的元数据
 */
export async function getMusicMetadata(filePath: string): Promise<ScannedSong | null> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<ScannedSong | null>('get_music_metadata', { filePath });
  }

  mockLog('scanner', 'getMusicMetadata', filePath);
  return MOCK_SONGS[0] || null;
}
