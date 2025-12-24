/**
 * Model Store - 管理模型相关状态
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Model, ModelDetail } from '@/types';
import { modelService } from '@/services';

interface ModelState {
  // 状态
  models: Model[];
  selectedModel: ModelDetail | null;
  loading: boolean;
  error: string | null;

  // 分页
  currentPage: number;
  pageSize: number;
  total: number;

  // 过滤
  filters: {
    status?: string;
    type?: string;
    search?: string;
  };

  // Actions
  fetchModels: () => Promise<void>;
  fetchModelDetail: (id: string) => Promise<void>;
  setSelectedModel: (model: ModelDetail | null) => void;
  setFilters: (filters: Partial<ModelState['filters']>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  runProbe: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useModelStore = create<ModelState>()(
  immer((set, get) => ({
    // 初始状态
    models: [],
    selectedModel: null,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 20,
    total: 0,
    filters: {},

    // 获取模型列表
    fetchModels: async () => {
      set({ loading: true, error: null });
      try {
        const { currentPage, pageSize, filters } = get();
        const response = await modelService.getModels({
          page: currentPage,
          pageSize,
          ...filters,
        });

        set({
          models: response.items,
          total: response.total,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'モデル一覧の取得に失敗しました',
          loading: false,
        });
      }
    },

    // 获取模型详情
    fetchModelDetail: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const model = await modelService.getModelDetail(id);
        set({
          selectedModel: model,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'モデル詳細の取得に失敗しました',
          loading: false,
        });
      }
    },

    // 设置选中的模型
    setSelectedModel: (model) => {
      set({ selectedModel: model });
    },

    // 设置过滤条件
    setFilters: (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        state.currentPage = 1; // 重置到第一页
      });
      get().fetchModels();
    },

    // 设置当前页
    setPage: (page) => {
      set({ currentPage: page });
      get().fetchModels();
    },

    // 设置每页大小
    setPageSize: (pageSize) => {
      set({ pageSize, currentPage: 1 });
      get().fetchModels();
    },

    // 运行基线探测
    runProbe: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const probe = await modelService.runBaselineProbe(id);
        set((state) => {
          if (state.selectedModel && state.selectedModel.id === id) {
            state.selectedModel.baselineProbe = probe;
          }
          state.loading = false;
        });
      } catch (error: any) {
        set({
          error: error.message || 'ベースライン検証の実行に失敗しました',
          loading: false,
        });
      }
    },

    // 清除错误
    clearError: () => {
      set({ error: null });
    },
  }))
);
