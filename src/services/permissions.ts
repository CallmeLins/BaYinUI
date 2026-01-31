/**
 * Android 权限请求服务
 */

import { isTauri, getPlatform } from './tauri';

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * 检查并请求音频文件读取权限（Android）
 * 返回 true 表示权限已授予，false 表示权限被拒绝
 */
export async function checkAndRequestAudioPermission(): Promise<boolean> {
  const platform = await getPlatform();

  // 非 Android 平台直接返回 true
  if (platform !== 'android') {
    return true;
  }

  if (!isTauri()) {
    return true;
  }

  try {
    // 尝试使用 Tauri 的 fs 插件检查权限
    // 如果能成功列出目录，说明有权限
    const { exists } = await import('@tauri-apps/plugin-fs');
    const testPath = '/storage/emulated/0/Music';

    try {
      await exists(testPath);
      return true;
    } catch {
      // 权限可能被拒绝
      return false;
    }
  } catch (e) {
    console.error('Permission check failed:', e);
    return false;
  }
}

/**
 * 权限说明文本
 */
export const PERMISSION_EXPLANATION = {
  title: '存储权限说明',
  message: `读取共享存储中的音频文件（不包含对照片、视频的读取，若见系统请求说明中包含，为 Android 12 及以下系统未细分权限故而统一描述），授权后才可获取音频文件信息。

若同意此对话后未见系统授权询问，可能是本软件的此权限被设定为"拒绝并不再提示"，请手动前往系统设置更改。`,
  confirmText: '同意并继续',
  cancelText: '取消',
};
