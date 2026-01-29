/**
 * 持久化存储服务
 * 用于保存用户设置、播放历史等数据
 */

import { isTauri, mockLog } from './tauri';

// 存储键名常量
export const STORAGE_KEYS = {
  SETTINGS: 'settings',
  PLAYLISTS: 'playlists',
  PLAY_HISTORY: 'playHistory',
  SCAN_DIRECTORIES: 'scanDirectories',
  LAST_PLAYED: 'lastPlayed',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Tauri Store 实例缓存
let storeInstance: Awaited<ReturnType<typeof import('@tauri-apps/plugin-store').load>> | null =
  null;

async function getStore() {
  if (!storeInstance && isTauri()) {
    const { load } = await import('@tauri-apps/plugin-store');
    storeInstance = await load('bayin-store.json', { autoSave: true });
  }
  return storeInstance;
}

/**
 * 保存数据
 */
export async function save<T>(key: StorageKey, value: T): Promise<void> {
  if (isTauri()) {
    const store = await getStore();
    await store?.set(key, value);
    await store?.save();
    return;
  }

  mockLog('storage', 'save', key, value);
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 读取数据
 */
export async function load<T>(key: StorageKey, defaultValue: T): Promise<T> {
  if (isTauri()) {
    const store = await getStore();
    const value = await store?.get<T>(key);
    return value ?? defaultValue;
  }

  mockLog('storage', 'load', key);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

/**
 * 删除数据
 */
export async function remove(key: StorageKey): Promise<void> {
  if (isTauri()) {
    const store = await getStore();
    await store?.delete(key);
    await store?.save();
    return;
  }

  mockLog('storage', 'remove', key);
  localStorage.removeItem(key);
}

/**
 * 清空所有数据
 */
export async function clear(): Promise<void> {
  if (isTauri()) {
    const store = await getStore();
    await store?.clear();
    await store?.save();
    return;
  }

  mockLog('storage', 'clear');
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// ============ 便捷方法 ============

export interface AppSettings {
  isDarkMode: boolean;
  skipShortAudio: boolean;
  showCoverInList: boolean;
  lyricsFontSize: number;
  lyricsTextAlign: boolean;
  lyricsFontWeight: 'normal' | 'medium' | 'bold';
  volume: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: false,
  skipShortAudio: true,
  showCoverInList: true,
  lyricsFontSize: 24,
  lyricsTextAlign: true,
  lyricsFontWeight: 'normal',
  volume: 1,
};

export async function loadSettings(): Promise<AppSettings> {
  return load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await loadSettings();
  await save(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
}
