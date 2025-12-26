/**
 * Reports Store
 */

import { create } from 'zustand';
import { reportApi } from '@/services/reportApi';
import type { Report, ReportDetail, ReportFilters } from '@/types/report';

interface ReportState {
  // 状态
  reports: Report[];
  currentReport: ReportDetail | null;
  loading: boolean;
  error: string | null;

  // 分页
  currentPage: number;
  pageSize: number;
  total: number;

  // 过滤器
  filters: ReportFilters;

  // 操作
  fetchReports: () => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
  createReport: (data: {
    title: string;
    description: string;
    type: string;
    experimentId: string;
  }) => Promise<void>;
  updateReport: (id: string, data: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  publishReport: (id: string) => Promise<void>;
  exportReport: (id: string, format: 'pdf' | 'docx' | 'html') => Promise<void>;

  // 设置状态
  setFilters: (filters: Partial<ReportFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  clearError: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  // 初始状态
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  filters: {},

  // 获取报告列表
  fetchReports: async () => {
    set({ loading: true, error: null });
    try {
      const { currentPage, pageSize, filters } = get();
      const response = await reportApi.getReports({
        page: currentPage,
        pageSize,
        filters,
      });
      set({
        reports: response.items,
        total: response.total,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || '获取报告列表失败',
        loading: false,
      });
    }
  },

  // 获取报告详情
  fetchReportById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const report = await reportApi.getReportById(id);
      set({
        currentReport: report,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || '获取报告详情失败',
        loading: false,
      });
    }
  },

  // 创建报告
  createReport: async (data) => {
    set({ loading: true, error: null });
    try {
      await reportApi.createReport(data);
      set({ loading: false });
      // 重新获取列表
      await get().fetchReports();
    } catch (error: any) {
      set({
        error: error.message || '创建报告失败',
        loading: false,
      });
    }
  },

  // 更新报告
  updateReport: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await reportApi.updateReport(id, data);
      set({ loading: false });
      // 重新获取列表
      await get().fetchReports();
    } catch (error: any) {
      set({
        error: error.message || '更新报告失败',
        loading: false,
      });
    }
  },

  // 删除报告
  deleteReport: async (id) => {
    set({ loading: true, error: null });
    try {
      await reportApi.deleteReport(id);
      set({ loading: false });
      // 重新获取列表
      await get().fetchReports();
    } catch (error: any) {
      set({
        error: error.message || '删除报告失败',
        loading: false,
      });
    }
  },

  // 发布报告
  publishReport: async (id) => {
    set({ loading: true, error: null });
    try {
      await reportApi.publishReport(id);
      set({ loading: false });
      // 重新获取列表
      await get().fetchReports();
    } catch (error: any) {
      set({
        error: error.message || '发布报告失败',
        loading: false,
      });
    }
  },

  // 导出报告
  exportReport: async (id, format) => {
    set({ loading: true, error: null });
    try {
      const blob = await reportApi.exportReport(id, format);
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || '导出报告失败',
        loading: false,
      });
    }
  },

  // 设置过滤器
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1, // 重置到第一页
    }));
    get().fetchReports();
  },

  // 设置页码
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchReports();
  },

  // 设置每页数量
  setPageSize: (pageSize) => {
    set({ pageSize, currentPage: 1 });
    get().fetchReports();
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));
