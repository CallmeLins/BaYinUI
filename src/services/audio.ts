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
}

// 单例 Audio 元素
let audioElement: HTMLAudioElement | null = null;

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
    const { convertFileSrc } = await import('@tauri-apps/api/core');
    return convertFileSrc(filePath);
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
  const url = await getPlayableUrl(filePath);

  if (audio.src !== url) {
    audio.src = url;
    audio.load();
  }

  await audio.play();
}

/**
 * 暂停播放
 */
export function pause(): void {
  const audio = getAudioElement();
  audio.pause();
}

/**
 * 继续播放
 */
export async function resume(): Promise<void> {
  const audio = getAudioElement();
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
  return {
    isPlaying: !audio.paused,
    currentTime: audio.currentTime,
    duration: audio.duration || 0,
    volume: audio.volume,
  };
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
