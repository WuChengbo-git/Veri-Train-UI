/**
 * API related types
 */

export interface APIResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  status?: string;
  type?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
}

export interface ExperimentProgressMessage {
  type: 'experiment_progress';
  experimentId: string;
  data: {
    epoch: number;
    step: number;
    loss: number;
    gpuUtil: number;
    eta: string;
  };
}

export interface ExperimentStatusMessage {
  type: 'experiment_status';
  experimentId: string;
  status: 'running' | 'completed' | 'failed' | 'stopped';
  metrics?: Record<string, number>;
}

export interface QualityGateMessage {
  type: 'quality_gate';
  datasetId: string;
  result: 'passed' | 'failed';
  details: Record<string, any>;
}

export interface NotificationMessage {
  type: 'notification';
  level: 'info' | 'warning' | 'error';
  message: string;
  action?: {
    label: string;
    url: string;
  };
}

export type WSMessage =
  | ExperimentProgressMessage
  | ExperimentStatusMessage
  | QualityGateMessage
  | NotificationMessage;
