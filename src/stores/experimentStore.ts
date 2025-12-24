/**
 * Experiment Store - 管理实验相关状态
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Experiment, ExperimentDetail, ExperimentProgress } from '@/types';
import { experimentService } from '@/services';

interface ExperimentState {
  // 状态
  experiments: Experiment[];
  selectedExperiment: ExperimentDetail | null;
  loading: boolean;
  error: string | null;

  // 实时进度 (从WebSocket更新)
  progressMap: Map<string, ExperimentProgress>;

  // 分页
  currentPage: number;
  pageSize: number;
  total: number;

  // 过滤
  filters: {
    status?: string;
    modelId?: string;
    search?: string;
  };

  // Actions
  fetchExperiments: () => Promise<void>;
  fetchExperimentDetail: (id: string) => Promise<void>;
  setSelectedExperiment: (experiment: ExperimentDetail | null) => void;
  setFilters: (filters: Partial<ExperimentState['filters']>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  createExperiment: (data: any) => Promise<Experiment>;
  startExperiment: (id: string) => Promise<void>;
  stopExperiment: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: ExperimentProgress) => void;
  updateStatus: (id: string, status: Experiment['status']) => void;
  clearError: () => void;
}

export const useExperimentStore = create<ExperimentState>()(
  immer((set, get) => ({
    // 初始状态
    experiments: [],
    selectedExperiment: null,
    loading: false,
    error: null,
    progressMap: new Map(),
    currentPage: 1,
    pageSize: 20,
    total: 0,
    filters: {},

    // 获取实验列表
    fetchExperiments: async () => {
      set({ loading: true, error: null });
      try {
        const { currentPage, pageSize, filters } = get();
        const response = await experimentService.getExperiments({
          page: currentPage,
          pageSize,
          ...filters,
        });

        set({
          experiments: response.items,
          total: response.total,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || '実験一覧の取得に失敗しました',
          loading: false,
        });
      }
    },

    // 获取实验详情
    fetchExperimentDetail: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const experiment = await experimentService.getExperimentDetail(id);
        set({
          selectedExperiment: experiment,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || '実験詳細の取得に失敗しました',
          loading: false,
        });
      }
    },

    // 设置选中的实验
    setSelectedExperiment: (experiment) => {
      set({ selectedExperiment: experiment });
    },

    // 设置过滤条件
    setFilters: (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        state.currentPage = 1;
      });
      get().fetchExperiments();
    },

    // 设置当前页
    setPage: (page) => {
      set({ currentPage: page });
      get().fetchExperiments();
    },

    // 设置每页大小
    setPageSize: (pageSize) => {
      set({ pageSize, currentPage: 1 });
      get().fetchExperiments();
    },

    // 创建实验
    createExperiment: async (data) => {
      set({ loading: true, error: null });
      try {
        const experiment = await experimentService.createExperiment(data);
        set({ loading: false });

        // 刷新列表
        await get().fetchExperiments();

        return experiment;
      } catch (error: any) {
        set({
          error: error.message || '実験の作成に失敗しました',
          loading: false,
        });
        throw error;
      }
    },

    // 启动实验
    startExperiment: async (id: string) => {
      set({ loading: true, error: null });
      try {
        await experimentService.startExperiment(id);
        set({ loading: false });

        // 刷新详情
        await get().fetchExperimentDetail(id);
      } catch (error: any) {
        set({
          error: error.message || '実験の開始に失敗しました',
          loading: false,
        });
      }
    },

    // 停止实验
    stopExperiment: async (id: string) => {
      set({ loading: true, error: null });
      try {
        await experimentService.stopExperiment(id);
        set({ loading: false });

        // 刷新详情
        await get().fetchExperimentDetail(id);
      } catch (error: any) {
        set({
          error: error.message || '実験の停止に失敗しました',
          loading: false,
        });
      }
    },

    // 更新进度 (从WebSocket调用)
    updateProgress: (id, progress) => {
      set((state) => {
        state.progressMap.set(id, progress);

        // 如果是当前选中的实验,也更新详情
        if (state.selectedExperiment && state.selectedExperiment.id === id) {
          state.selectedExperiment.progress = progress;
        }

        // 更新列表中的状态
        const expIndex = state.experiments.findIndex((e) => e.id === id);
        if (expIndex !== -1) {
          state.experiments[expIndex].status = 'running';
        }
      });
    },

    // 更新状态 (从WebSocket调用)
    updateStatus: (id, status) => {
      set((state) => {
        // 更新列表中的状态
        const expIndex = state.experiments.findIndex((e) => e.id === id);
        if (expIndex !== -1) {
          state.experiments[expIndex].status = status;
        }

        // 如果是当前选中的实验,也更新详情
        if (state.selectedExperiment && state.selectedExperiment.id === id) {
          state.selectedExperiment.status = status;
        }

        // 如果完成或失败,清除进度
        if (status === 'completed' || status === 'failed' || status === 'stopped') {
          state.progressMap.delete(id);
        }
      });
    },

    // 清除错误
    clearError: () => {
      set({ error: null });
    },
  }))
);
