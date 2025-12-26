/**
 * Evaluation Store - Zustand状态管理
 */

import { create } from 'zustand';
import { apiClient } from '../services/api';
import type { Evaluation } from '../types/evaluation';

interface EvaluationFilters {
  track?: string;
  experiment_id?: string;
}

interface EvaluationStore {
  // 状态
  evaluations: Evaluation[];
  loading: boolean;
  error: string | null;

  // 分页
  currentPage: number;
  pageSize: number;
  total: number;

  // 过滤
  filters: EvaluationFilters;

  // Actions
  fetchEvaluations: () => Promise<void>;
  setFilters: (filters: Partial<EvaluationFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export const useEvaluationStore = create<EvaluationStore>((set, get) => ({
  // 初始状态
  evaluations: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 20,
  total: 0,
  filters: {},

  // 获取评测列表
  fetchEvaluations: async () => {
    set({ loading: true, error: null });
    try {
      const { currentPage, pageSize, filters } = get();
      const params = {
        page: currentPage,
        page_size: pageSize,
        ...filters,
      };

      const response = await apiClient.get('/evaluations', { params });

      // 检查响应数据格式
      if (response && response.data) {
        set({
          evaluations: response.data.items || [],
          total: response.data.total || 0,
          loading: false,
        });
      } else {
        // 如果响应格式不正确，使用空数组
        set({
          evaluations: [],
          total: 0,
          loading: false,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch evaluations:', error);
      set({
        evaluations: [],
        total: 0,
        error: error?.message || 'データの取得に失敗しました',
        loading: false
      });
    }
  },

  // 设置过滤条件
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // 重置到第一页
    }));
    get().fetchEvaluations();
  },

  // 设置当前页
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchEvaluations();
  },

  // 设置每页大小
  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
    get().fetchEvaluations();
  },

  // 重置
  reset: () => {
    set({
      evaluations: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      filters: {},
    });
  },
}));
