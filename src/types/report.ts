/**
 * Report related types
 */

export interface Report {
  id: string;
  experimentId: string;
  title: string;
  description: string;
  type: 'performance' | 'comparison' | 'analysis' | 'summary';
  status: 'draft' | 'published' | 'generating';
  createdAt: string;
  publishedAt?: string;
  createdBy: string;
  tags?: string[];
}

export interface ReportDetail extends Report {
  summary: ReportSummary;
  comparison: ComparisonAnalysis;
  syntheticDataAnalysis: SyntheticDataImpact;
  metricsSummary: {
    avgBleu?: number;
    avgRougeL?: number;
    avgRibes?: number;
    bestModel?: string;
    improvementRate?: number;
  };
  charts: {
    type: 'line' | 'bar' | 'radar' | 'scatter';
    title: string;
    data: any;
  }[];
  conclusions: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface ReportSummary {
  changes: string[];
  improvements: Array<{
    metric: string;
    before: number;
    after: number;
    delta: number;
  }>;
  regressions: Array<{
    metric: string;
    before: number;
    after: number;
    delta: number;
    reason?: string;
  }>;
}

export interface ComparisonAnalysis {
  baselineExperimentId: string;
  currentExperimentId: string;
  differences: {
    config: Record<string, { before: any; after: any }>;
    metrics: Record<string, { before: number; after: number; delta: number }>;
  };
}

export interface SyntheticDataImpact {
  syntheticRatio: number;
  performanceChange: number;
  qualityAssessment: string;
  recommendation: string;
}

export interface ReportFilters {
  type?: string;
  status?: string;
  search?: string;
}
