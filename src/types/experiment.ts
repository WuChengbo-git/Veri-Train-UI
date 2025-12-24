/**
 * Experiment related types
 */

export type ExperimentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'stopped';

export interface Experiment {
  id: string;
  name: string;
  task: 'translation';
  direction: string;
  baseModelId: string;
  adapterId?: string;
  datasetId: string;
  status: ExperimentStatus;
  bestScore?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ExperimentDetail extends Experiment {
  config: ExperimentConfig;
  progress?: ExperimentProgress;
  logs: LogEntry[];
  predictions?: PredictionResult;
  evaluation?: EvaluationResult;
}

export interface ExperimentConfig {
  datasetVersion: number;
  promptContractId: string;
  trainingRecipe: TrainingRecipe;
  seed: number;
  environment: Record<string, any>;
}

export interface TrainingRecipe {
  loraConfig?: {
    r: number;
    alpha: number;
    dropout: number;
    targetModules: string[];
  };
  batchSize: number;
  learningRate: number;
  epochs: number;
  warmupSteps: number;
  optimizer: string;
}

export interface ExperimentProgress {
  currentEpoch: number;
  totalEpochs: number;
  currentStep: number;
  totalSteps: number;
  loss: number;
  gpuUtilization: number;
  eta: string;
  lastUpdate: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface PredictionResult {
  testSetId: string;
  decodingConfig: {
    strategy: 'greedy' | 'beam_search';
    beamSize?: number;
    temperature?: number;
  };
  predictions: Array<{
    source: string;
    prediction: string;
    reference: string;
  }>;
  savedAt: string;
}

export interface EvaluationResult {
  id: string;
  experimentId: string;
  tracks: {
    spoken: TrackEvaluation;
    written: TrackEvaluation;
  };
  summary: string;
  createdAt: string;
}

export interface TrackEvaluation {
  bleu: number;
  rougeL: number;
  ribes: number;
  gptEval1: {
    fluency: number;
    adequacy: number;
    accuracy: number;
  };
  gptEval2: {
    mqmScore: number;
    errorDistribution: {
      type: string;
      count: number;
      severity: 'minor' | 'major' | 'critical';
    }[];
  };
  topErrors: Array<{
    source: string;
    prediction: string;
    reference: string;
    errorType: string;
    severity: 'minor' | 'major' | 'critical';
  }>;
}
