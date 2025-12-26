/**
 * Settings相关类型定义
 */

export interface SystemSettings {
  general: {
    language: 'ja' | 'en' | 'zh';
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications_enabled: boolean;
  };
  training: {
    default_epochs: number;
    default_batch_size: number;
    default_learning_rate: number;
    auto_save_checkpoints: boolean;
    checkpoint_interval: number;
    early_stopping_enabled: boolean;
    early_stopping_patience: number;
  };
  evaluation: {
    default_metrics: string[];
    enable_gpt_eval: boolean;
    gpt_model: string;
    enable_human_eval: boolean;
    confidence_threshold: number;
  };
  storage: {
    data_retention_days: number;
    auto_cleanup_enabled: boolean;
    max_storage_gb: number;
    current_usage_gb: number;
  };
  api: {
    base_url: string;
    timeout_seconds: number;
    retry_attempts: number;
    rate_limit_per_minute: number;
  };
  security: {
    two_factor_enabled: boolean;
    session_timeout_minutes: number;
    password_expiry_days: number;
    ip_whitelist: string[];
  };
}

export interface UserPreferences {
  user_id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  email_notifications: boolean;
  desktop_notifications: boolean;
  weekly_summary: boolean;
  preferred_language: 'ja' | 'en' | 'zh';
  items_per_page: number;
  default_view: 'table' | 'grid';
}
