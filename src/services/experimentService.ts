/**
 * Experiment service - handles all experiment-related API calls
 */

import apiClient from './api';
import type {
  Experiment,
  ExperimentDetail,
  ExperimentConfig,
  LogEntry,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

class ExperimentService {
  private readonly basePath = '/experiments';

  /**
   * Get list of experiments with pagination
   */
  async getExperiments(params?: PaginationParams & { status?: string; modelId?: string }) {
    return apiClient.get<PaginatedResponse<Experiment>>(this.basePath, { params });
  }

  /**
   * Get experiment detail by ID
   */
  async getExperimentDetail(id: string) {
    return apiClient.get<ExperimentDetail>(`${this.basePath}/${id}`);
  }

  /**
   * Create new experiment
   */
  async createExperiment(data: {
    name: string;
    task: 'translation';
    direction: string;
    baseModelId: string;
    adapterId?: string;
    datasetId: string;
    config: ExperimentConfig;
  }) {
    return apiClient.post<Experiment>(this.basePath, data);
  }

  /**
   * Start experiment
   */
  async startExperiment(id: string) {
    return apiClient.post<Experiment>(`${this.basePath}/${id}/start`);
  }

  /**
   * Stop experiment
   */
  async stopExperiment(id: string) {
    return apiClient.post<Experiment>(`${this.basePath}/${id}/stop`);
  }

  /**
   * Get experiment logs
   */
  async getLogs(id: string, params?: { limit?: number; offset?: number }) {
    return apiClient.get<LogEntry[]>(`${this.basePath}/${id}/logs`, { params });
  }

  /**
   * Delete experiment
   */
  async deleteExperiment(id: string) {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  /**
   * Clone experiment with modifications
   */
  async cloneExperiment(id: string, modifications?: Partial<ExperimentConfig>) {
    return apiClient.post<Experiment>(`${this.basePath}/${id}/clone`, { modifications });
  }
}

export const experimentService = new ExperimentService();
export default experimentService;
