/**
 * Settings Store
 */

import { create } from 'zustand';
import { settingsApi } from '@/services/settingsApi';
import type { SystemSettings, UserPreferences } from '@/types/settings';

interface SettingsState {
  // 状态
  systemSettings: SystemSettings | null;
  userPreferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  saveSuccess: boolean;

  // 操作
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (data: Partial<SystemSettings>) => Promise<void>;
  fetchUserPreferences: () => Promise<void>;
  updateUserPreferences: (data: Partial<UserPreferences>) => Promise<void>;
  resetSystemSettings: () => Promise<void>;
  testApiConnection: (url: string) => Promise<{ success: boolean; latency: number }>;
  cleanupStorage: () => Promise<{ deletedItems: number; freedSpace: number }>;
  clearError: () => void;
  clearSaveSuccess: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // 初始状态
  systemSettings: null,
  userPreferences: null,
  loading: false,
  error: null,
  saveSuccess: false,

  // 获取系统设置
  fetchSystemSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await settingsApi.getSystemSettings();
      set({
        systemSettings: settings,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || '获取系统设置失败',
        loading: false,
      });
    }
  },

  // 更新系统设置
  updateSystemSettings: async (data) => {
    set({ loading: true, error: null, saveSuccess: false });
    try {
      const settings = await settingsApi.updateSystemSettings(data);
      set({
        systemSettings: settings,
        loading: false,
        saveSuccess: true,
      });
    } catch (error: any) {
      set({
        error: error.message || '更新系统设置失败',
        loading: false,
        saveSuccess: false,
      });
    }
  },

  // 获取用户偏好设置
  fetchUserPreferences: async () => {
    set({ loading: true, error: null });
    try {
      const preferences = await settingsApi.getUserPreferences();
      set({
        userPreferences: preferences,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || '获取用户偏好设置失败',
        loading: false,
      });
    }
  },

  // 更新用户偏好设置
  updateUserPreferences: async (data) => {
    set({ loading: true, error: null, saveSuccess: false });
    try {
      const preferences = await settingsApi.updateUserPreferences(data);
      set({
        userPreferences: preferences,
        loading: false,
        saveSuccess: true,
      });
    } catch (error: any) {
      set({
        error: error.message || '更新用户偏好设置失败',
        loading: false,
        saveSuccess: false,
      });
    }
  },

  // 重置系统设置
  resetSystemSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await settingsApi.resetSystemSettings();
      set({
        systemSettings: settings,
        loading: false,
        saveSuccess: true,
      });
    } catch (error: any) {
      set({
        error: error.message || '重置系统设置失败',
        loading: false,
      });
    }
  },

  // 测试API连接
  testApiConnection: async (url: string) => {
    set({ loading: true, error: null });
    try {
      const result = await settingsApi.testApiConnection(url);
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({
        error: error.message || 'API连接测试失败',
        loading: false,
      });
      throw error;
    }
  },

  // 清理存储
  cleanupStorage: async () => {
    set({ loading: true, error: null });
    try {
      const result = await settingsApi.cleanupStorage();
      set({ loading: false });
      // 重新获取系统设置以更新存储使用情况
      await get().fetchSystemSettings();
      return result;
    } catch (error: any) {
      set({
        error: error.message || '清理存储失败',
        loading: false,
      });
      throw error;
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 清除保存成功状态
  clearSaveSuccess: () => {
    set({ saveSuccess: false });
  },
}));
