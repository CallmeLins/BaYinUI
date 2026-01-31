import { useState, useEffect } from 'react';
import { getPlatform, type Platform } from '../services/tauri';

/**
 * 各平台安全区域 insets（单位 px）
 * 后续适配新平台时在此扩展
 */
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** 各平台的 inset 预设值 */
const PLATFORM_INSETS: Record<Platform, SafeAreaInsets> = {
  android: { top: 28, bottom: 0, left: 0, right: 0 },
  ios:     { top: 54, bottom: 34, left: 0, right: 0 },   // iPhone 刘海屏 / 灵动岛
  windows: { top: 0,  bottom: 0,  left: 0, right: 0 },
  macos:   { top: 0,  bottom: 0,  left: 0, right: 0 },
  linux:   { top: 0,  bottom: 0,  left: 0, right: 0 },
  browser: { top: 0,  bottom: 0,  left: 0, right: 0 },
};

export interface PlatformInfo {
  /** 当前操作系统 */
  platform: Platform;
  /** 是否为移动端 */
  isMobile: boolean;
  /** 是否为桌面端 */
  isDesktop: boolean;
  /** 安全区域 insets */
  insets: SafeAreaInsets;
  /** 平台是否已检测完成 */
  ready: boolean;
}

/**
 * 统一平台检测 Hook
 *
 * 用法：
 * ```ts
 * const { platform, isMobile, isDesktop, insets, ready } = usePlatform();
 * ```
 */
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<Platform>('browser');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getPlatform().then((p) => {
      setPlatform(p);
      setReady(true);
    });
  }, []);

  const isMobile = platform === 'android' || platform === 'ios';
  const isDesktop = platform === 'windows' || platform === 'macos' || platform === 'linux';
  const insets = PLATFORM_INSETS[platform];

  return { platform, isMobile, isDesktop, insets, ready };
}
