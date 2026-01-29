/**
 * Services 统一导出
 *
 * 使用方式:
 * import { audio, scanner, storage, opener, isTauri } from '@/services';
 *
 * // 播放音乐
 * await audio.play('/path/to/music.flac');
 *
 * // 扫描音乐
 * const songs = await scanner.scanMusicFiles({ directories: ['/music'] });
 *
 * // 保存设置
 * await storage.saveSettings({ isDarkMode: true });
 *
 * // 打开链接
 * await opener.openUrl('https://example.com');
 */

// 环境检测
export { isTauri, getEnvironment, type Environment } from './tauri';

// 音频播放
export * as audio from './audio';

// 音乐扫描
export * as scanner from './scanner';

// 持久化存储
export * as storage from './storage';

// 外部链接
export * as opener from './opener';
