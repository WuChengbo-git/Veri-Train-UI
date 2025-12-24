/**
 * Model service - handles all model-related API calls
 */

import apiClient from './api';
import type { Model, ModelDetail, BaselineProbe, PaginatedResponse, PaginationParams } from '@/types';

class ModelService {
  private readonly basePath = '/models';

  /**
   * Get list of models with pagination
   */
  async getModels(params?: PaginationParams & { status?: string; type?: string }) {
    return apiClient.get<PaginatedResponse<Model>>(this.basePath, { params });
  }

  /**
   * Get model detail by ID
   */
  async getModelDetail(id: string) {
    return apiClient.get<ModelDetail>(`${this.basePath}/${id}`);
  }

  /**
   * Run baseline behavior probe on model
   */
  async runBaselineProbe(id: string) {
    return apiClient.post<BaselineProbe>(`${this.basePath}/${id}/probe`);
  }

  /**
   * Get model evaluation history
   */
  async getModelEvaluations(id: string) {
    return apiClient.get(`${this.basePath}/${id}/evaluations`);
  }

  /**
   * Create new model (upload or register)
   */
  async createModel(data: {
    name: string;
    type: 'base' | 'adapter';
    baseModelId?: string;
    config: Record<string, any>;
  }) {
    return apiClient.post<Model>(this.basePath, data);
  }

  /**
   * Update model status
   */
  async updateModelStatus(id: string, status: 'available' | 'deprecated') {
    return apiClient.patch<Model>(`${this.basePath}/${id}/status`, { status });
  }

  /**
   * Delete model
   */
  async deleteModel(id: string) {
    return apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const modelService = new ModelService();
export default modelService;
