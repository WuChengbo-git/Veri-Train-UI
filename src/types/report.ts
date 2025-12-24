/**
 * Report related types
 */

export interface Report {
  id: string;
  experimentId: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
  publishedAt?: string;
}

export interface ReportDetail extends Report {
  summary: ReportSummary;
  comparison: ComparisonAnalysis;
  syntheticDataAnalysis: SyntheticDataImpact;
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
