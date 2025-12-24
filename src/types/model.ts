/**
 * Model related types
 */

export type ModelType = 'base' | 'adapter';
export type ModelStatus = 'available' | 'deprecated' | 'training';

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  baseModelId?: string;
  status: ModelStatus;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ModelDetail extends Model {
  baselineProbe?: BaselineProbe;
  promptContracts: PromptContract[];
  evaluationSummary?: EvaluationSummary;
  metadata: {
    parameters?: string;
    tokenizer?: string;
    source?: string;
  };
}

export interface BaselineProbe {
  isMultiCandidate: boolean;
  hasExplanation: boolean;
  followsOutputContract: boolean;
  probedAt: string;
  details: Record<string, any>;
}

export interface PromptContract {
  id: string;
  name: string;
  version: number;
  template: string;
  createdAt: string;
}

export interface EvaluationSummary {
  lastEvaluatedAt: string;
  avgBLEU: number;
  avgROUGE: number;
  avgRIBES: number;
  trackResults: {
    spoken: TrackMetrics;
    written: TrackMetrics;
  };
}

export interface TrackMetrics {
  bleu: number;
  rougeL: number;
  ribes: number;
  gptScores: GPTScores;
}

export interface GPTScores {
  fluency: number;
  adequacy: number;
  accuracy: number;
  mqm: MQMScore;
}

export interface MQMScore {
  total: number;
  errors: ErrorDistribution;
}

export interface ErrorDistribution {
  accuracy: number;
  fluency: number;
  terminology: number;
  style: number;
  locale: number;
}
