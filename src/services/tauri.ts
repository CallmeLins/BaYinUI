/**
 * Tauri 环境检测与基础工具
 */

// 检测是否在 Tauri 环境中运行
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI__' in window;
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
