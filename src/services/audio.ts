/**
 * 音频播放服务
 * 封装音频播放功能，支持 Tauri 和浏览器环境
 */

import { isTauri, mockLog } from './tauri';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hasSource: boolean;
}

// 单例 Audio 元素
let audioElement: HTMLAudioElement | null = null;
// 缓存当前加载的文件路径
let currentFilePath: string | null = null;

function getAudioElement(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
  }
  return audioElement;
}

/**
 * 将本地文件路径转换为可播放的 URL
 */
export async function getPlayableUrl(filePath: string): Promise<string> {
  if (isTauri()) {
    try {
      const { convertFileSrc } = await import('@tauri-apps/api/core');
      // 确保路径格式正确（Windows 路径）
      const normalizedPath = filePath.replace(/\\/g, '/');
      const url = convertFileSrc(normalizedPath);
      console.log('convertFileSrc result:', url);
      return url;
    } catch (error) {
      console.error('convertFileSrc failed:', error);
      throw error;
    }
  }

  mockLog('audio', 'getPlayableUrl', filePath);
  // 浏览器环境返回示例音频（可以替换为真实的测试音频 URL）
  return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
}

/**
 * 加载并播放音频文件
 */
export async function play(filePath: string): Promise<void> {
  const audio = getAudioElement();

  // 只有当文件路径改变时才重新加载
  if (currentFilePath !== filePath) {
    const url = await getPlayableUrl(filePath);
    console.log('Loading audio:', filePath, '->', url);

    // 创建一个 Promise 来等待音频加载
    const loadPromise = new Promise<void>((resolve, reject) => {
      const onCanPlay = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        resolve();
      };
      const onError = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
        const errorMsg = audio.error?.message || 'Unknown audio error';
        console.error('Audio load error:', errorMsg);
        reject(new Error(`无法加载音频: ${errorMsg}`));
      };
      audio.addEventListener('canplay', onCanPlay);
      audio.addEventListener('error', onError);
    });

    audio.src = url;
    audio.load();
    currentFilePath = filePath;

    // 等待加载完成或超时
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('音频加载超时')), 10000);
    });

    await Promise.race([loadPromise, timeoutPromise]);
  }

  console.log('Playing audio');
  await audio.play();
}

/**
 * 暂停播放
 */
export function pause(): void {
  const audio = getAudioElement();
  console.log('Pausing audio');
  audio.pause();
}

/**
 * 继续播放
 */
export async function resume(): Promise<void> {
  const audio = getAudioElement();

  // 检查是否有音频源
  if (!audio.src || audio.src === '' || audio.src === window.location.href) {
    console.warn('No audio source to resume');
    throw new Error('No audio source loaded');
  }

  console.log('Resuming audio');
  await audio.play();
}

/**
 * 停止播放
 */
export function stop(): void {
  const audio = getAudioElement();
  audio.pause();
  audio.currentTime = 0;
}

/**
 * 跳转到指定时间
 */
export function seek(time: number): void {
  const audio = getAudioElement();
  audio.currentTime = time;
}

/**
 * 设置音量 (0-1)
 */
export function setVolume(volume: number): void {
  const audio = getAudioElement();
  audio.volume = Math.max(0, Math.min(1, volume));
}

/**
 * 获取当前音频状态
 */
export function getState(): AudioState {
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
 */
export function onTimeUpdate(callback: (currentTime: number) => void): () => void {
  const audio = getAudioElement();
  const handler = () => callback(audio.currentTime);
  audio.addEventListener('timeupdate', handler);
  return () => audio.removeEventListener('timeupdate', handler);
}

/**
 * 监听播放结束
 */
export function onEnded(callback: () => void): () => void {
  const audio = getAudioElement();
  audio.addEventListener('ended', callback);
  return () => audio.removeEventListener('ended', callback);
}

/**
 * 监听播放错误
 */
export function onError(callback: (error: Error) => void): () => void {
  const audio = getAudioElement();
  const handler = () => callback(new Error(audio.error?.message || 'Audio error'));
  audio.addEventListener('error', handler);
  return () => audio.removeEventListener('error', handler);
}
