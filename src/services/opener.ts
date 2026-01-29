/**
 * 外部链接与文件打开服务
 */

import { isTauri, mockLog } from './tauri';

/**
 * 在默认浏览器中打开 URL
 */
export async function openUrl(url: string): Promise<void> {
  if (isTauri()) {
    const { open } = await import('@tauri-apps/plugin-opener');
    await open(url);
    return;
  }

  mockLog('opener', 'openUrl', url);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * 在系统文件管理器中打开文件所在目录
 */
export async function showInFolder(filePath: string): Promise<void> {
  if (isTauri()) {
    const { revealItemInDir } = await import('@tauri-apps/plugin-opener');
    await revealItemInDir(filePath);
    return;
  }

  mockLog('opener', 'showInFolder', filePath);
  console.log('浏览器环境无法打开文件夹:', filePath);
}
