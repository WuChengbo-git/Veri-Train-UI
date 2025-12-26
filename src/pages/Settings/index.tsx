import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Tabs,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  InputNumber,
  message,
  Divider,
  Progress,
  Tag,
  Row,
  Col,
  Statistic,
  Modal,
  Alert,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  GlobalOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SafetyOutlined,
  UserOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useSettingsStore } from '../../stores/settingsStore';

const { Title } = Typography;
const { confirm } = Modal;

const SettingsPage = () => {
  const {
    systemSettings,
    userPreferences,
    loading,
    error,
    saveSuccess,
    fetchSystemSettings,
    updateSystemSettings,
    fetchUserPreferences,
    updateUserPreferences,
    resetSystemSettings,
    testApiConnection,
    cleanupStorage,
    clearError,
    clearSaveSuccess,
  } = useSettingsStore();

  const [systemForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    latency: number;
  } | null>(null);

  useEffect(() => {
    fetchSystemSettings();
    fetchUserPreferences();
  }, [fetchSystemSettings, fetchUserPreferences]);

  useEffect(() => {
    if (systemSettings) {
      systemForm.setFieldsValue(systemSettings);
    }
  }, [systemSettings, systemForm]);

  useEffect(() => {
    if (userPreferences) {
      userForm.setFieldsValue(userPreferences);
    }
  }, [userPreferences, userForm]);

  useEffect(() => {
    if (saveSuccess) {
      message.success('設定を保存しました');
      clearSaveSuccess();
    }
  }, [saveSuccess, clearSaveSuccess]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  // 保存系统设置
  const handleSaveSystemSettings = async () => {
    try {
      const values = await systemForm.validateFields();
      await updateSystemSettings(values);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  // 保存用户偏好
  const handleSaveUserPreferences = async () => {
    try {
      const values = await userForm.validateFields();
      await updateUserPreferences(values);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  // 重置系统设置
  const handleResetSettings = () => {
    confirm({
      title: 'システム設定をリセットしますか？',
      content: 'すべての設定がデフォルト値に戻ります。この操作は元に戻せません。',
      okText: 'リセット',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: resetSystemSettings,
    });
  };

  // 测试API连接
  const handleTestConnection = async () => {
    try {
      const apiUrl = systemForm.getFieldValue(['api', 'base_url']);
      if (!apiUrl) {
        message.warning('APIのURLを入力してください');
        return;
      }
      setTestingConnection(true);
      const result = await testApiConnection(apiUrl);
      setConnectionResult(result);
      if (result.success) {
        message.success(`接続成功！レイテンシ: ${result.latency}ms`);
      } else {
        message.error('接続に失敗しました');
      }
    } catch (err) {
      message.error('接続テストに失敗しました');
    } finally {
      setTestingConnection(false);
    }
  };

  // 清理存储
  const handleCleanupStorage = () => {
    confirm({
      title: 'ストレージをクリーンアップしますか？',
      content: '古いデータや不要なファイルが削除されます。',
      okText: 'クリーンアップ',
      okType: 'primary',
      cancelText: 'キャンセル',
      onOk: async () => {
        try {
          const result = await cleanupStorage();
          message.success(
            `${result.deletedItems}個のアイテムを削除し、${(result.freedSpace / 1024).toFixed(2)}GB の容量を解放しました`
          );
        } catch (err) {
          // Error handled by store
        }
      },
    });
  };

  // 计算存储使用率
  const storageUsagePercent = systemSettings
    ? Math.round((systemSettings.storage.current_usage_gb / systemSettings.storage.max_storage_gb) * 100)
    : 0;

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <GlobalOutlined /> 一般
        </span>
      ),
      children: (
        <Form form={systemForm} layout="vertical">
          <Card title="基本設定" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="言語" name={['general', 'language']}>
                  <Select
                    options={[
                      { value: 'ja', label: '日本語' },
                      { value: 'en', label: 'English' },
                      { value: 'zh', label: '中文' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="タイムゾーン" name={['general', 'timezone']}>
                  <Select
                    options={[
                      { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
                      { value: 'UTC', label: 'UTC' },
                      { value: 'America/New_York', label: 'America/New_York (EST)' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="テーマ" name={['general', 'theme']}>
                  <Select
                    options={[
                      { value: 'light', label: 'ライト' },
                      { value: 'dark', label: 'ダーク' },
                      { value: 'auto', label: '自動' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="通知を有効にする"
                  name={['general', 'notifications_enabled']}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSystemSettings} loading={loading}>
              保存
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleResetSettings}>
              デフォルトに戻す
            </Button>
          </Space>
        </Form>
      ),
    },
    {
      key: 'training',
      label: (
        <span>
          <ExperimentOutlined /> トレーニング
        </span>
      ),
      children: (
        <Form form={systemForm} layout="vertical">
          <Card title="トレーニングのデフォルト設定" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="デフォルトエポック数" name={['training', 'default_epochs']}>
                  <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="デフォルトバッチサイズ" name={['training', 'default_batch_size']}>
                  <InputNumber min={1} max={512} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="デフォルト学習率" name={['training', 'default_learning_rate']}>
                  <InputNumber min={0.00001} max={1} step={0.00001} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="チェックポイント設定" style={{ marginBottom: 16 }}>
            <Form.Item
              label="自動チェックポイント保存"
              name={['training', 'auto_save_checkpoints']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item label="チェックポイント間隔（エポック数）" name={['training', 'checkpoint_interval']}>
              <InputNumber min={1} max={100} style={{ width: 200 }} />
            </Form.Item>
          </Card>

          <Card title="早期停止設定" style={{ marginBottom: 16 }}>
            <Form.Item
              label="早期停止を有効にする"
              name={['training', 'early_stopping_enabled']}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item label="忍耐エポック数" name={['training', 'early_stopping_patience']}>
              <InputNumber min={1} max={50} style={{ width: 200 }} />
            </Form.Item>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSystemSettings} loading={loading}>
              保存
            </Button>
          </Space>
        </Form>
      ),
    },
    {
      key: 'evaluation',
      label: (
        <span>
          <CheckCircleOutlined /> 評価
        </span>
      ),
      children: (
        <Form form={systemForm} layout="vertical">
          <Card title="評価指標設定" style={{ marginBottom: 16 }}>
            <Form.Item label="デフォルト指標" name={['evaluation', 'default_metrics']}>
              <Select
                mode="multiple"
                options={[
                  { value: 'bleu', label: 'BLEU' },
                  { value: 'rouge_l', label: 'ROUGE-L' },
                  { value: 'ribes', label: 'RIBES' },
                  { value: 'meteor', label: 'METEOR' },
                  { value: 'ter', label: 'TER' },
                ]}
              />
            </Form.Item>
            <Form.Item label="信頼度閾値" name={['evaluation', 'confidence_threshold']}>
              <InputNumber min={0} max={1} step={0.01} style={{ width: 200 }} />
            </Form.Item>
          </Card>

          <Card title="GPT評価設定" style={{ marginBottom: 16 }}>
            <Form.Item label="GPT評価を有効にする" name={['evaluation', 'enable_gpt_eval']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="GPTモデル" name={['evaluation', 'gpt_model']}>
              <Select
                options={[
                  { value: 'gpt-4', label: 'GPT-4' },
                  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                ]}
              />
            </Form.Item>
          </Card>

          <Card title="人間評価設定" style={{ marginBottom: 16 }}>
            <Form.Item label="人間評価を有効にする" name={['evaluation', 'enable_human_eval']} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSystemSettings} loading={loading}>
              保存
            </Button>
          </Space>
        </Form>
      ),
    },
    {
      key: 'storage',
      label: (
        <span>
          <DatabaseOutlined /> ストレージ
        </span>
      ),
      children: (
        <Form form={systemForm} layout="vertical">
          <Card title="ストレージ使用状況" style={{ marginBottom: 16 }}>
            <Statistic
              title="使用中のストレージ"
              value={systemSettings?.storage.current_usage_gb || 0}
              suffix={`/ ${systemSettings?.storage.max_storage_gb || 0} GB`}
            />
            <Progress
              percent={storageUsagePercent}
              status={storageUsagePercent > 80 ? 'exception' : 'normal'}
              style={{ marginTop: 16 }}
            />
            {storageUsagePercent > 80 && (
              <Alert
                message="ストレージ容量が不足しています"
                description="不要なデータを削除するか、ストレージ容量を増やしてください。"
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>

          <Card title="ストレージ設定" style={{ marginBottom: 16 }}>
            <Form.Item label="データ保持期間（日数）" name={['storage', 'data_retention_days']}>
              <InputNumber min={1} max={365} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="自動クリーンアップ" name={['storage', 'auto_cleanup_enabled']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="最大ストレージ容量（GB）" name={['storage', 'max_storage_gb']}>
              <InputNumber min={10} max={10000} style={{ width: 200 }} />
            </Form.Item>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSystemSettings} loading={loading}>
              保存
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleCleanupStorage} danger>
              今すぐクリーンアップ
            </Button>
          </Space>
        </Form>
      ),
    },
    {
      key: 'api',
      label: (
        <span>
          <ApiOutlined /> API
        </span>
      ),
      children: (
        <Form form={systemForm} layout="vertical">
          <Card title="API設定" style={{ marginBottom: 16 }}>
            <Form.Item label="ベースURL" name={['api', 'base_url']}>
              <Input placeholder="https://api.example.com" />
            </Form.Item>
            <Form.Item label="タイムアウト（秒）" name={['api', 'timeout_seconds']}>
              <InputNumber min={1} max={300} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="リトライ回数" name={['api', 'retry_attempts']}>
              <InputNumber min={0} max={10} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="レート制限（回/分）" name={['api', 'rate_limit_per_minute']}>
              <InputNumber min={1} max={1000} style={{ width: 200 }} />
            </Form.Item>

            <Divider />

            <Space>
              <Button icon={<CheckOutlined />} onClick={handleTestConnection} loading={testingConnection}>
                接続テスト
              </Button>
              {connectionResult && (
                <Tag color={connectionResult.success ? 'success' : 'error'}>
                  {connectionResult.success
                    ? `成功 (${connectionResult.latency}ms)`
                    : '失敗'}
                </Tag>
              )}
            </Space>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSystemSettings} loading={loading}>
              保存
            </Button>
          </Space>
        </Form>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SafetyOutlined /> セキュリティ
        </span>
      ),
      children: (
        <Form form={systemForm} layout="vertical">
          <Card title="認証設定" style={{ marginBottom: 16 }}>
            <Form.Item label="二要素認証" name={['security', 'two_factor_enabled']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="セッションタイムアウト（分）" name={['security', 'session_timeout_minutes']}>
              <InputNumber min={5} max={1440} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="パスワード有効期限（日数）" name={['security', 'password_expiry_days']}>
              <InputNumber min={0} max={365} style={{ width: 200 }} />
            </Form.Item>
          </Card>

          <Card title="IPホワイトリスト" style={{ marginBottom: 16 }}>
            <Form.Item label="許可するIPアドレス" name={['security', 'ip_whitelist']}>
              <Select mode="tags" placeholder="IPアドレスを入力してEnterを押してください" />
            </Form.Item>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSystemSettings} loading={loading}>
              保存
            </Button>
          </Space>
        </Form>
      ),
    },
    {
      key: 'user',
      label: (
        <span>
          <UserOutlined /> ユーザー設定
        </span>
      ),
      children: (
        <Form form={userForm} layout="vertical">
          <Card title="プロフィール" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="表示名" name="display_name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="メールアドレス" name="email">
                  <Input type="email" disabled />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="通知設定" style={{ marginBottom: 16 }}>
            <Form.Item label="メール通知" name="email_notifications" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="デスクトップ通知" name="desktop_notifications" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="週次サマリー" name="weekly_summary" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>

          <Card title="表示設定" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="優先言語" name="preferred_language">
                  <Select
                    options={[
                      { value: 'ja', label: '日本語' },
                      { value: 'en', label: 'English' },
                      { value: 'zh', label: '中文' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="1ページあたりのアイテム数" name="items_per_page">
                  <Select
                    options={[
                      { value: 10, label: '10件' },
                      { value: 20, label: '20件' },
                      { value: 50, label: '50件' },
                      { value: 100, label: '100件' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="デフォルトビュー" name="default_view">
              <Select
                options={[
                  { value: 'table', label: 'テーブル' },
                  { value: 'grid', label: 'グリッド' },
                ]}
              />
            </Form.Item>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveUserPreferences} loading={loading}>
              保存
            </Button>
          </Space>
        </Form>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 16 }}>
        設定
      </Title>
      <Tabs items={tabItems} />
    </div>
  );
};

export default SettingsPage;
