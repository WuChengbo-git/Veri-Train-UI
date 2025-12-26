/**
 * Reports API
 */

import apiClient from './api';
import type { Report, ReportDetail, ReportFilters } from '@/types/report';
import type { PaginatedResponse } from '@/types';

export const reportApi = {
  /**
   * 获取报告列表
   */
  getReports: async (params?: {
    page?: number;
    pageSize?: number;
    filters?: ReportFilters;
  }): Promise<PaginatedResponse<Report>> => {
    return apiClient.get('/reports', { params });
  },

  /**
   * 获取报告详情
   */
  getReportById: async (id: string): Promise<ReportDetail> => {
    return apiClient.get(`/reports/${id}`);
  },

  /**
   * 创建新报告
   */
  createReport: async (data: {
    title: string;
    description: string;
    type: string;
    experimentId: string;
  }): Promise<Report> => {
    return apiClient.post('/reports', data);
  },

  /**
   * 更新报告
   */
  updateReport: async (id: string, data: Partial<Report>): Promise<Report> => {
    return apiClient.put(`/reports/${id}`, data);
  },

  /**
   * 删除报告
   */
  deleteReport: async (id: string): Promise<void> => {
    return apiClient.delete(`/reports/${id}`);
  },

  /**
   * 发布报告
   */
  publishReport: async (id: string): Promise<Report> => {
    return apiClient.post(`/reports/${id}/publish`);
  },

  /**
   * 导出报告
   */
  exportReport: async (id: string, format: 'pdf' | 'docx' | 'html'): Promise<Blob> => {
    return apiClient.get(`/reports/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
  },
};
