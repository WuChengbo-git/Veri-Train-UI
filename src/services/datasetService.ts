/**
 * Dataset service - handles all dataset-related API calls
 */

import apiClient from './api';
import type {
  Dataset,
  DatasetDetail,
  QualityGateResult,
  GenerateDatasetConfig,
  GenerateDatasetEstimate,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

class DatasetService {
  private readonly basePath = '/datasets';

  /**
   * Get list of datasets with pagination
   */
  async getDatasets(
    params?: PaginationParams & {
      status?: string;
      type?: string;
      scene?: string;
      direction?: string;
    }
  ) {
    return apiClient.get<PaginatedResponse<Dataset>>(this.basePath, { params });
  }

  /**
   * Get dataset detail by ID
   */
  async getDatasetDetail(id: string) {
    return apiClient.get<DatasetDetail>(`${this.basePath}/${id}`);
  }

  /**
   * Upload dataset file
   */
  async uploadDataset(
    file: File,
    metadata: {
      name: string;
      type: 'human' | 'synthetic' | 'mixed';
      languageDirection: string;
      scene: string;
    },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return apiClient.upload<Dataset>(this.basePath, file, onProgress);
  }

  /**
   * Generate dataset - get cost estimate first
   */
  async getGenerateEstimate(config: GenerateDatasetConfig) {
    return apiClient.post<GenerateDatasetEstimate>(`${this.basePath}/generate/estimate`, config);
  }

  /**
   * Generate dataset - execute generation
   */
  async generateDataset(config: GenerateDatasetConfig) {
    return apiClient.post<{ taskId: string }>(`${this.basePath}/generate`, config);
  }

  /**
   * Get quality gate result
   */
  async getQualityGate(id: string) {
    return apiClient.get<QualityGateResult>(`${this.basePath}/${id}/quality-gate`);
  }

  /**
   * Submit human review for dataset
   */
  async submitReview(
    id: string,
    review: {
      sampleSize: number;
      passRate: number;
      comments: string;
    }
  ) {
    return apiClient.post(`${this.basePath}/${id}/review`, review);
  }

  /**
   * Create new version of dataset
   */
  async createVersion(
    id: string,
    changes: {
      description: string;
      modifications: any;
    }
  ) {
    return apiClient.post<Dataset>(`${this.basePath}/${id}/versions`, changes);
  }

  /**
   * Delete dataset
   */
  async deleteDataset(id: string) {
    return apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const datasetService = new DatasetService();
export default datasetService;
