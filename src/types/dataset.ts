/**
 * Dataset related types
 */

export type DatasetType = 'human' | 'synthetic' | 'mixed';
export type DatasetStatus = 'draft' | 'passed' | 'blocked';
export type LanguageDirection = 'ja-en' | 'en-ja' | 'zh-en' | 'en-zh';
export type Scene = 'meeting' | 'written';

export interface Dataset {
  id: string;
  name: string;
  version: number;
  type: DatasetType;
  languageDirection: LanguageDirection;
  scene: Scene;
  status: DatasetStatus;
  parentId?: string;
  createdAt: string;
}

export interface DatasetDetail extends Dataset {
  overview: DatasetOverview;
  qualityGate: QualityGateResult;
  usageHistory: ExperimentUsage[];
}

export interface DatasetOverview {
  totalCount: number;
  avgSentenceLength: number;
  shortSentenceRatio: number;
  codeSwitch综合: number;
}

export interface QualityGateResult {
  status: 'passed' | 'failed' | 'pending';
  checkedAt?: string;
  metrics: {
    alignmentRate: number;
    duplicateRate: number;
    languageConsistency: number;
  };
  samplingReview?: SamplingReview;
  blockReasons?: string[];
}

export interface SamplingReview {
  reviewedBy: string;
  reviewedAt: string;
  sampleSize: number;
  passRate: number;
  comments: string;
}

export interface ExperimentUsage {
  experimentId: string;
  experimentName: string;
  usedAt: string;
  performance: number;
}

export interface GenerateDatasetConfig {
  task: 'translation';
  direction: LanguageDirection;
  scene: Scene;
  seedSource: {
    type: 'corpus' | 'dataset';
    id?: string;
    file?: File;
  };
  strategy: {
    spokenRatio: number;
    sentenceLengthDistribution: {
      short: number;
      medium: number;
      long: number;
    };
    model: string;
  };
  targetCount: number;
}

export interface GenerateDatasetEstimate {
  totalTokens: number;
  estimatedCost: number;
  estimatedTime: string;
}
