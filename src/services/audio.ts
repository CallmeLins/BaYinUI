/**
 * 音频播放服务
 * 封装音频播放功能，支持 Tauri 和浏览器环境
 * Android 使用原生 MediaPlayer，桌面使用 HTMLAudioElement
 */

import { isTauri, mockLog, getPlatform } from './tauri';
import { getNavidromeStreamUrl } from './navidrome';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hasSource: boolean;
}

// Navidrome 文件路径格式
interface NavidromeFilePath {
  type: 'navidrome';
  songId: string;
  config: {
    serverUrl: string;
    username: string;
    password: string;
  };
}

// AndroidBridge 类型定义
interface AndroidBridgeAudio {
  playAudio: (filePath: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  seekAudio: (positionSeconds: number) => void;
  setVolume: (volume: number) => void;
  isPlaying: () => boolean;
  getCurrentPosition: () => number;
  getDuration: () => number;
}

// 单例 Audio 元素（桌面平台）
let audioElement: HTMLAudioElement | null = null;
// 缓存当前加载的文件路径
let currentFilePath: string | null = null;
// 是否使用 Android 原生播放器
let useAndroidPlayer = false;
// Android 播放器状态
let androidState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1.0,
};
// 回调函数
let timeUpdateCallbacks: ((time: number) => void)[] = [];
let endedCallbacks: (() => void)[] = [];
let errorCallbacks: ((error: Error) => void)[] = [];
let androidListenersInitialized = false;

// 初始化 Android 事件监听（只初始化一次）
function initAndroidEventListeners() {
  if (typeof window === 'undefined') return;
  if (androidListenersInitialized) return;
  androidListenersInitialized = true;

  console.log('Initializing Android audio event listeners');

  // 进度更新事件
  window.addEventListener('android-audio-progress', ((event: CustomEvent) => {
    const { currentTime, duration } = event.detail;
    androidState.currentTime = currentTime;
    androidState.duration = duration;
    androidState.isPlaying = true;
    timeUpdateCallbacks.forEach(cb => cb(currentTime));
  }) as EventListener);

  // 播放结束事件
  window.addEventListener('android-audio-ended', () => {
    console.log('android-audio-ended');
    androidState.isPlaying = false;
    endedCallbacks.forEach(cb => cb());
  });

  // 播放错误事件
  window.addEventListener('android-audio-error', ((event: CustomEvent) => {
    const { message } = event.detail;
    console.log('android-audio-error:', message);
    androidState.isPlaying = false;
    errorCallbacks.forEach(cb => cb(new Error(message)));
  }) as EventListener);
}

// 早期初始化：在模块加载时检测平台并初始化
if (typeof window !== 'undefined') {
  // 立即初始化 Android 事件监听器（即使还不确定是否是 Android）
  // 这样可以确保在 play() 调用之前回调就已经可以工作
  initAndroidEventListeners();

  // 检查是否是 Android 平台
  getPlatform().then(platform => {
    if (platform === 'android' && 'AndroidBridge' in window) {
      console.log('Android platform detected, enabling native player');
      useAndroidPlayer = true;
    }
  });
}

// 检查并初始化 Android 播放器
async function checkAndroidPlayer(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const platform = await getPlatform();
  if (platform === 'android' && 'AndroidBridge' in window) {
    useAndroidPlayer = true;
    return true;
  }
  return false;
}

function getAndroidBridge(): AndroidBridgeAudio | null {
  if (typeof window !== 'undefined' && 'AndroidBridge' in window) {
    return (window as unknown as { AndroidBridge: AndroidBridgeAudio }).AndroidBridge;
  }
  return null;
}

function getAudioElement(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
  }
  return audioElement;
}

/**
 * 检查是否为 Navidrome 文件路径
 */
function parseNavidromeFilePath(filePath: string): NavidromeFilePath | null {
  try {
    const parsed = JSON.parse(filePath);
    if (parsed && parsed.type === 'navidrome' && parsed.songId && parsed.config) {
      return parsed as NavidromeFilePath;
    }
  } catch {
    // 不是 JSON，是普通文件路径
  }
  return null;
}

/**
 * 将本地文件路径转换为可播放的 URL（仅用于桌面平台）
 */
export async function getPlayableUrl(filePath: string): Promise<string> {
  // 检查是否为 Navidrome 歌曲
  const navidromeInfo = parseNavidromeFilePath(filePath);
  if (navidromeInfo) {
    console.log('Getting Navidrome stream URL for songId:', navidromeInfo.songId);
    try {
      const streamUrl = await getNavidromeStreamUrl(navidromeInfo.config, navidromeInfo.songId);
      console.log('Navidrome stream URL:', streamUrl);
      return streamUrl;
    } catch (error) {
      console.error('Failed to get Navidrome stream URL:', error);
      throw error;
    }
  }

  // 本地文件 - 桌面平台
  if (isTauri()) {
    try {
      const { convertFileSrc } = await import('@tauri-apps/api/core');
      // 确保路径格式正确（Windows 路径）
      const normalizedPath = filePath.replace(/\\/g, '/');
      const url = convertFileSrc(normalizedPath);
      console.log('convertFileSrc result:', url);
      return url;
    } catch (error) {
      console.error('getPlayableUrl failed:', error);
      throw error;
    }
  }

  mockLog('audio', 'getPlayableUrl', filePath);
  // 浏览器环境返回示例音频
  return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
}

/**
 * 加载并播放音频文件
 */
export async function play(filePath: string): Promise<void> {
  console.log('play called:', filePath);

  // 检查是否使用 Android 原生播放器
  const isAndroid = await checkAndroidPlayer();

  if (isAndroid) {
    const bridge = getAndroidBridge();
    if (bridge) {
      // 检查是否为 Navidrome 歌曲
      const navidromeInfo = parseNavidromeFilePath(filePath);
      if (navidromeInfo) {
        // Navidrome 歌曲需要获取流 URL，然后使用 HTMLAudioElement 播放
        // 因为 Android MediaPlayer 可能无法直接播放需要认证的 HTTP 流
        const url = await getNavidromeStreamUrl(navidromeInfo.config, navidromeInfo.songId);
        const audio = getAudioElement();
        audio.src = url;
        currentFilePath = filePath;
        await audio.play();
        return;
      }

      // 本地文件使用 Android MediaPlayer
      console.log('Using Android MediaPlayer for:', filePath);
      bridge.playAudio(filePath);
      currentFilePath = filePath;
      androidState.isPlaying = true;
      return;
    }
  }

  // 桌面平台或浏览器：使用 HTMLAudioElement
  const audio = getAudioElement();

  // 只有当文件路径改变时才重新加载
  if (currentFilePath !== filePath) {
    const url = await getPlayableUrl(filePath);
    console.log('Loading audio:', filePath, '->', url);

    // 创建一个 Promise 来等待音频加载
    const loadPromise = new Promise<void>((resolve, reject) => {
      const onCanPlay = () => {
        console.log('Audio can play now');
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        resolve();
      };
      const onLoadedMetadata = () => {
        console.log('Audio metadata loaded, duration:', audio.duration);
      };
      const onError = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        const errorCode = audio.error?.code;
        const errorMsg = audio.error?.message || 'Unknown audio error';
        console.error('Audio load error:', errorCode, errorMsg);
        reject(new Error(`无法加载音频: ${errorMsg} (code: ${errorCode})`));
      };
      audio.addEventListener('canplay', onCanPlay);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('error', onError);
    });

    audio.src = url;
    audio.load();
    currentFilePath = filePath;

    // 等待加载完成或超时（30 秒）
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('音频加载超时')), 30000);
    });

    await Promise.race([loadPromise, timeoutPromise]);
  }

  console.log('Playing audio');
  await audio.play();
}

/**
 * 暂停播放
 */
export async function pause(): Promise<void> {
  console.log('Pausing audio, useAndroidPlayer:', useAndroidPlayer);

  if (useAndroidPlayer && currentFilePath && !parseNavidromeFilePath(currentFilePath)) {
    // Android 本地文件使用原生暂停
    const bridge = getAndroidBridge();
    if (bridge) {
      bridge.pauseAudio();
      androidState.isPlaying = false;
      return;
    }
  }

  const audio = getAudioElement();
  audio.pause();
}

/**
 * 继续播放
 */
export async function resume(): Promise<void> {
  console.log('Resuming audio, useAndroidPlayer:', useAndroidPlayer);

  if (useAndroidPlayer && currentFilePath && !parseNavidromeFilePath(currentFilePath)) {
    // Android 本地文件使用原生恢复
    const bridge = getAndroidBridge();
    if (bridge) {
      bridge.resumeAudio();
      androidState.isPlaying = true;
      return;
    }
  }

  const audio = getAudioElement();

  // 检查是否有音频源
  if (!audio.src || audio.src === '' || audio.src === window.location.href) {
    console.warn('No audio source to resume');
    throw new Error('No audio source loaded');
  }

  await audio.play();
}

/**
 * 停止播放
 */
export function stop(): void {
  if (useAndroidPlayer) {
    const bridge = getAndroidBridge();
    if (bridge) {
      bridge.stopAudio();
      androidState.isPlaying = false;
      androidState.currentTime = 0;
      currentFilePath = null;
      return;
    }
  }

  const audio = getAudioElement();
  audio.pause();
  audio.currentTime = 0;
  currentFilePath = null;
}

/**
 * 跳转到指定时间
 */
export function seek(time: number): void {
  if (useAndroidPlayer) {
    const bridge = getAndroidBridge();
    if (bridge) {
      bridge.seekAudio(time);
      androidState.currentTime = time;
      return;
    }
  }

  const audio = getAudioElement();
  audio.currentTime = time;
}

/**
 * 设置音量 (0-1)
 */
export function setVolume(volume: number): void {
  const normalizedVolume = Math.max(0, Math.min(1, volume));

  if (useAndroidPlayer) {
    const bridge = getAndroidBridge();
    if (bridge) {
      bridge.setVolume(normalizedVolume);
      androidState.volume = normalizedVolume;
      return;
    }
  }

  const audio = getAudioElement();
  audio.volume = normalizedVolume;
}

/**
 * 获取当前音频状态
 */
export function getState(): AudioState {
  if (useAndroidPlayer) {
    return {
      isPlaying: androidState.isPlaying,
      currentTime: androidState.currentTime,
      duration: androidState.duration,
      volume: androidState.volume,
      hasSource: currentFilePath !== null,
    };
  }

  const audio = getAudioElement();
  const duration = audio.duration;
  const hasSource = audio.src && audio.src !== '' && audio.src !== window.location.href;

  return {
    isPlaying: !audio.paused,
    currentTime: audio.currentTime,
    duration: isNaN(duration) ? 0 : duration,
    volume: audio.volume,
    hasSource: !!hasSource,
  };
}

/**
 * 获取当前加载的文件路径
 */
export function getCurrentFilePath(): string | null {
  return currentFilePath;
}

/**
 * 监听播放时间更新
 * 注意：回调会同时注册到 Android 回调数组和 HTMLAudioElement
 * 这样无论最终使用哪种播放器，回调都能正常工作
 */
export function onTimeUpdate(callback: (currentTime: number) => void): () => void {
  // 总是添加到回调数组（供 Android 使用）
  timeUpdateCallbacks.push(callback);

  // 同时也监听 HTMLAudioElement（供桌面和 Navidrome 使用）
  const audio = getAudioElement();
  const handler = () => callback(audio.currentTime);
  audio.addEventListener('timeupdate', handler);

  // 返回清理函数
  return () => {
    timeUpdateCallbacks = timeUpdateCallbacks.filter(cb => cb !== callback);
    audio.removeEventListener('timeupdate', handler);
  };
}

/**
 * 监听播放结束
 */
export function onEnded(callback: () => void): () => void {
  // 总是添加到回调数组（供 Android 使用）
  endedCallbacks.push(callback);

  // 同时也监听 HTMLAudioElement
  const audio = getAudioElement();
  audio.addEventListener('ended', callback);

  return () => {
    endedCallbacks = endedCallbacks.filter(cb => cb !== callback);
    audio.removeEventListener('ended', callback);
  };
}

/**
 * 监听播放错误
 */
export function onError(callback: (error: Error) => void): () => void {
  // 总是添加到回调数组（供 Android 使用）
  errorCallbacks.push(callback);

  // 同时也监听 HTMLAudioElement
  const audio = getAudioElement();
  const handler = () => callback(new Error(audio.error?.message || 'Audio error'));
  audio.addEventListener('error', handler);

  return () => {
    errorCallbacks = errorCallbacks.filter(cb => cb !== callback);
    audio.removeEventListener('error', handler);
  };
}
