/**
 * Dataset Store - 管理数据集相关状态
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Dataset, DatasetDetail, GenerateDatasetConfig } from '@/types';
import { datasetService } from '@/services';

interface DatasetState {
  // 状态
  datasets: Dataset[];
  selectedDataset: DatasetDetail | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;

  // 分页
  currentPage: number;
  pageSize: number;
  total: number;

  // 过滤
  filters: {
    status?: string;
    type?: string;
    scene?: string;
    direction?: string;
    search?: string;
  };

  // 生成数据集相关
  generateConfig: GenerateDatasetConfig | null;
  generateEstimate: {
    totalTokens: number;
    estimatedCost: number;
    estimatedTime: string;
  } | null;

  // Actions
  fetchDatasets: () => Promise<void>;
  fetchDatasetDetail: (id: string) => Promise<void>;
  setSelectedDataset: (dataset: DatasetDetail | null) => void;
  setFilters: (filters: Partial<DatasetState['filters']>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  uploadDataset: (
    file: File,
    metadata: {
      name: string;
      type: 'human' | 'synthetic' | 'mixed';
      languageDirection: string;
      scene: string;
    }
  ) => Promise<void>;
  setGenerateConfig: (config: GenerateDatasetConfig | null) => void;
  getGenerateEstimate: (config: GenerateDatasetConfig) => Promise<void>;
  generateDataset: (config: GenerateDatasetConfig) => Promise<string>;
  clearError: () => void;
}

export const useDatasetStore = create<DatasetState>()(
  immer((set, get) => ({
    // 初始状态
    datasets: [],
    selectedDataset: null,
    loading: false,
    error: null,
    uploadProgress: 0,
    currentPage: 1,
    pageSize: 20,
    total: 0,
    filters: {},
    generateConfig: null,
    generateEstimate: null,

    // 获取数据集列表
    fetchDatasets: async () => {
      set({ loading: true, error: null });
      try {
        const { currentPage, pageSize, filters } = get();
        const response = await datasetService.getDatasets({
          page: currentPage,
          pageSize,
          ...filters,
        });

        set({
          datasets: response.items,
          total: response.total,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'データセット一覧の取得に失敗しました',
          loading: false,
        });
      }
    },

    // 获取数据集详情
    fetchDatasetDetail: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const dataset = await datasetService.getDatasetDetail(id);
        set({
          selectedDataset: dataset,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'データセット詳細の取得に失敗しました',
          loading: false,
        });
      }
    },

    // 设置选中的数据集
    setSelectedDataset: (dataset) => {
      set({ selectedDataset: dataset });
    },

    // 设置过滤条件
    setFilters: (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        state.currentPage = 1;
      });
      get().fetchDatasets();
    },

    // 设置当前页
    setPage: (page) => {
      set({ currentPage: page });
      get().fetchDatasets();
    },

    // 设置每页大小
    setPageSize: (pageSize) => {
      set({ pageSize, currentPage: 1 });
      get().fetchDatasets();
    },

    // 上传数据集
    uploadDataset: async (file, metadata) => {
      set({ loading: true, error: null, uploadProgress: 0 });
      try {
        await datasetService.uploadDataset(file, metadata, (progress) => {
          set({ uploadProgress: progress });
        });

        set({
          loading: false,
          uploadProgress: 100,
        });

        // 刷新列表
        await get().fetchDatasets();
      } catch (error: any) {
        set({
          error: error.message || 'データセットのアップロードに失敗しました',
          loading: false,
          uploadProgress: 0,
        });
      }
    },

    // 设置生成配置
    setGenerateConfig: (config) => {
      set({ generateConfig: config });
    },

    // 获取生成估算
    getGenerateEstimate: async (config) => {
      set({ loading: true, error: null });
      try {
        const estimate = await datasetService.getGenerateEstimate(config);
        set({
          generateEstimate: estimate,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'コスト見積もりの取得に失敗しました',
          loading: false,
        });
      }
    },

    // 生成数据集
    generateDataset: async (config) => {
      set({ loading: true, error: null });
      try {
        const result = await datasetService.generateDataset(config);
        set({ loading: false });
        return result.taskId;
      } catch (error: any) {
        set({
          error: error.message || 'データセット生成の開始に失敗しました',
          loading: false,
        });
        throw error;
      }
    },

    // 清除错误
    clearError: () => {
      set({ error: null });
    },
  }))
);
