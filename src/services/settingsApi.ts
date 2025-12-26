/**
 * Settings API
 */

import apiClient from './api';
import type { SystemSettings, UserPreferences } from '@/types/settings';

export const settingsApi = {
  /**
   * 获取系统设置
   */
  getSystemSettings: async (): Promise<SystemSettings> => {
    return apiClient.get('/settings/system');
  },

  /**
   * 更新系统设置
   */
  updateSystemSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    return apiClient.put('/settings/system', data);
  },

  /**
   * 获取用户偏好设置
   */
  getUserPreferences: async (): Promise<UserPreferences> => {
    return apiClient.get('/settings/preferences');
  },

  /**
   * 更新用户偏好设置
   */
  updateUserPreferences: async (data: Partial<UserPreferences>): Promise<UserPreferences> => {
    return apiClient.put('/settings/preferences', data);
  },

  /**
   * 重置系统设置为默认值
   */
  resetSystemSettings: async (): Promise<SystemSettings> => {
    return apiClient.post('/settings/system/reset');
  },

  /**
   * 测试API连接
   */
  testApiConnection: async (url: string): Promise<{ success: boolean; latency: number }> => {
    return apiClient.post('/settings/test-connection', { url });
  },

  /**
   * 清理存储
   */
  cleanupStorage: async (): Promise<{ deletedItems: number; freedSpace: number }> => {
    return apiClient.post('/settings/cleanup-storage');
  },
};
