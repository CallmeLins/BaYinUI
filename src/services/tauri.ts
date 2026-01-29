/**
 * Tauri 环境检测与基础工具
 */

// 检测是否在 Tauri 环境中运行
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// 平台类型
export type Platform = 'android' | 'ios' | 'windows' | 'macos' | 'linux' | 'browser';

// 获取当前平台
export const getPlatform = async (): Promise<Platform> => {
  if (!isTauri()) {
    return 'browser';
  }
  try {
    const { platform } = await import('@tauri-apps/plugin-os');
    const p = await platform();
    if (p === 'android') return 'android';
    if (p === 'ios') return 'ios';
    if (p === 'windows') return 'windows';
    if (p === 'macos') return 'macos';
    if (p === 'linux') return 'linux';
    return 'browser';
  } catch {
    return 'browser';
  }
};

// 检测是否为移动平台
export const isMobile = async (): Promise<boolean> => {
  const platform = await getPlatform();
  return platform === 'android' || platform === 'ios';
};

// 环境类型
export type Environment = 'tauri' | 'browser';

export const getEnvironment = (): Environment => {
  return isTauri() ? 'tauri' : 'browser';
};

// 日志工具：在浏览器环境下打印 mock 警告
export const mockLog = (service: string, method: string, ...args: unknown[]) => {
  if (!isTauri()) {
    console.log(`[Mock] ${service}.${method}`, ...args);
  }
};
