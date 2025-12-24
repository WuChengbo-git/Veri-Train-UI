/**
 * Global Store - 管理全局状态(通知、用户信息等)
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  createdAt: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface GlobalState {
  // 用户
  user: User | null;
  isAuthenticated: boolean;

  // 通知
  notifications: Notification[];
  unreadCount: number;

  // UI状态
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';

  // WebSocket连接状态
  wsConnected: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setWSConnected: (connected: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
  immer((set) => ({
    // 初始状态
    user: null,
    isAuthenticated: false,
    notifications: [],
    unreadCount: 0,
    sidebarCollapsed: false,
    theme: 'light',
    wsConnected: false,

    // 设置用户
    setUser: (user) => {
      set({ user });
    },

    // 设置认证状态
    setAuthenticated: (isAuthenticated) => {
      set({ isAuthenticated });
    },

    // 添加通知
    addNotification: (notification) => {
      set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
          read: false,
        };

        state.notifications.unshift(newNotification);
        state.unreadCount += 1;

        // 只保留最近100条通知
        if (state.notifications.length > 100) {
          state.notifications = state.notifications.slice(0, 100);
        }
      });
    },

    // 标记通知为已读
    markNotificationAsRead: (id) => {
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
    },

    // 标记所有通知为已读
    markAllNotificationsAsRead: () => {
      set((state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });
    },

    // 清空通知
    clearNotifications: () => {
      set({
        notifications: [],
        unreadCount: 0,
      });
    },

    // 切换侧边栏
    toggleSidebar: () => {
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      });
    },

    // 设置侧边栏状态
    setSidebarCollapsed: (collapsed) => {
      set({ sidebarCollapsed: collapsed });
    },

    // 设置主题
    setTheme: (theme) => {
      set({ theme });
      // 也可以在这里更新localStorage
      localStorage.setItem('theme', theme);
    },

    // 设置WebSocket连接状态
    setWSConnected: (connected) => {
      set({ wsConnected: connected });
    },
  }))
);
