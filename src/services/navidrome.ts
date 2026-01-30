/**
 * Navidrome 服务
 * 负责与 Navidrome/Subsonic 服务器通信
 */

import { isTauri, mockLog } from './tauri';
import type { ScannedSong } from './scanner';

export interface NavidromeConfig {
  serverUrl: string;
  username: string;
  password: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  serverVersion?: string;
}

// Mock 数据
const MOCK_SONGS: ScannedSong[] = [
  {
    id: 'navidrome-1',
    title: 'Navidrome 示例歌曲 1',
    artist: '云端艺术家',
    album: '云端专辑',
    duration: 300,
    filePath: '',
    fileSize: 45000000,
    coverUrl: undefined,
    isHr: true,
    isSq: true,
  },
  {
    id: 'navidrome-2',
    title: 'Navidrome 示例歌曲 2',
    artist: '云端艺术家',
    album: '云端专辑',
    duration: 240,
    filePath: '',
    fileSize: 12000000,
    coverUrl: undefined,
    isHr: false,
    isSq: false,
  },
];

/**
 * 测试 Navidrome 服务器连接
 */
export async function testNavidromeConnection(
  config: NavidromeConfig
): Promise<ConnectionTestResult> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<ConnectionTestResult>('test_navidrome_connection', { config });
  }

  mockLog('navidrome', 'testConnection', config);
  // 模拟测试
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (config.serverUrl && config.username && config.password) {
    return {
      success: true,
      message: '连接成功',
      serverVersion: '1.16.1 (mock)',
    };
  }
  return {
    success: false,
    message: '请填写完整信息',
  };
}

/**
 * 从 Navidrome 获取所有歌曲
 */
export async function fetchNavidromeSongs(config: NavidromeConfig): Promise<ScannedSong[]> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<ScannedSong[]>('fetch_navidrome_songs', { config });
  }

  mockLog('navidrome', 'fetchSongs', config);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return MOCK_SONGS;
}

/**
 * 获取 Navidrome 歌曲流 URL
 */
export async function getNavidromeStreamUrl(
  config: NavidromeConfig,
  songId: string
): Promise<string> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<string>('get_navidrome_stream_url', { config, songId });
  }

  mockLog('navidrome', 'getStreamUrl', songId);
  return `https://mock-server.com/rest/stream?id=${songId}`;
}

/**
 * 获取 Navidrome 歌曲歌词
 */
export async function getNavidromeLyrics(
  config: NavidromeConfig,
  songId: string
): Promise<string | null> {
  if (isTauri()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<string | null>('get_navidrome_lyrics', { config, songId });
  }

  mockLog('navidrome', 'getLyrics', songId);
  return `[00:00.00]Navidrome 示例歌词
[00:05.00]这是第一行歌词
[00:10.00]这是第二行歌词`;
}
