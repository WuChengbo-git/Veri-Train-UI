/**
 * Evaluation相关类型定义
 */

export interface Evaluation {
  id: string;
  experiment_id: string;
  track: 'spoken' | 'written';
  metrics: {
    bleu?: number;
    rouge_l?: number;
    ribes?: number;
    gpt_eval_1?: {
      fluency: number;
      adequacy: number;
      accuracy: number;
    };
    gpt_eval_2?: {
      mqm_score: number;
      error_distribution: Record<string, number>;
    };
  };
  error_analysis: {
    top_errors: Array<{
      type: string;
      count: number;
      severity: string;
    }>;
    error_type_distribution: Record<string, number>;
  };
  created_at: string;
  updated_at: string;
}
