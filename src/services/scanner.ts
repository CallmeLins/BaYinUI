/**
 * 音乐扫描服务
 * 负责扫描本地文件系统获取音乐文件
 */

import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { isTauri, mockLog, getPlatform, type Platform } from './tauri';

export interface ScannedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  fileSize: number;
  coverUrl?: string;
  isHr?: boolean;
  isSq?: boolean;
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
    isHr: true,
    isSq: true,
  },
  {
    id: 'mock-2',
    title: '示例歌曲 2',
    artist: '示例艺术家',
    album: '示例专辑',
    duration: 180,
    filePath: '/mock/path/song2.mp3',
    fileSize: 8000000,
    isHr: false,
    isSq: false,
  },
];

// Android 常用音乐目录
const ANDROID_MUSIC_DIRECTORIES = [
  '/storage/emulated/0/Music',
  '/storage/emulated/0/Download',
  '/storage/emulated/0/DCIM',
  '/sdcard/Music',
  '/sdcard/Download',
];

/**
 * 获取当前平台
 */
export async function getCurrentPlatform(): Promise<Platform> {
  return getPlatform();
}

/**
 * 获取 Android 默认音乐目录
 */
export async function getAndroidMusicDirectories(): Promise<string[]> {
  if (isTauri()) {
    try {
      return await invoke<string[]>('get_android_music_directories');
    } catch {
      // 如果后端命令不存在，返回默认目录
      return ANDROID_MUSIC_DIRECTORIES;
    }
  }
  return ANDROID_MUSIC_DIRECTORIES;
}

/**
 * 选择要扫描的目录
 */
export async function selectDirectory(): Promise<string | null> {
  if (!isTauri()) {
    mockLog('scanner', 'selectDirectory');
    return '/mock/music/directory';
  }

  try {
    console.log('Opening folder dialog...');
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择音乐文件夹',
    });
    console.log('Selected directory:', selected);
    return selected as string | null;
  } catch (e) {
    console.error('Folder selection failed:', e);
    return null;
  }
}

/**
 * 扫描指定目录中的音乐文件
 */
export async function scanMusicFiles(
  options: ScanOptions,
  _onProgress?: (progress: ScanProgress) => void
): Promise<ScannedSong[]> {
  if (isTauri()) {
    return invoke<ScannedSong[]>('scan_music_files', { options });
  }

  // 浏览器环境：返回 mock 数据
  mockLog('scanner', 'scanMusicFiles', options);
  return MOCK_SONGS;
}

/**
 * 获取音乐文件的元数据
 */
export async function getMusicMetadata(filePath: string): Promise<ScannedSong | null> {
  if (isTauri()) {
    return invoke<ScannedSong | null>('get_music_metadata', { filePath });
  }

  mockLog('scanner', 'getMusicMetadata', filePath);
  return MOCK_SONGS[0] || null;
}

/**
 * 获取歌曲歌词
 * 返回原始歌词文本（LRC 格式或纯文本）
 */
export async function getLyrics(filePath: string): Promise<string | null> {
  if (isTauri()) {
    return invoke<string | null>('get_lyrics', { filePath });
  }

  mockLog('scanner', 'getLyrics', filePath);
  // Mock 歌词
  return `[00:00.00]示例歌词
[00:05.00]这是第一行歌词
[00:10.00]这是第二行歌词
[00:15.00]这是第三行歌词
[00:20.00]这是第四行歌词`;
}

export interface LyricLine {
  time: number;
  text: string;
}

/**
 * 解析 LRC 格式歌词
 */
export function parseLrcLyrics(lrcContent: string): LyricLine[] {
  const lines = lrcContent.split('\n');
  const result: LyricLine[] = [];

  // LRC 时间标签正则: [mm:ss.xx] 或 [mm:ss]
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const line of lines) {
    // 跳过元数据标签 [ti:], [ar:], [al:] 等
    if (/^\[[a-z]{2}:/.test(line)) {
      continue;
    }

    const times: number[] = [];
    let match;
    let lastIndex = 0;

    while ((match = timeRegex.exec(line)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
      times.push(minutes * 60 + seconds + ms / 1000);
      lastIndex = match.index + match[0].length;
    }

    // 获取歌词文本
    const text = line.slice(lastIndex).trim();

    if (times.length > 0 && text) {
      // 同一行可能有多个时间标签
      for (const time of times) {
        result.push({ time, text });
      }
    }
  }

  // 按时间排序
  result.sort((a, b) => a.time - b.time);

  return result;
}
