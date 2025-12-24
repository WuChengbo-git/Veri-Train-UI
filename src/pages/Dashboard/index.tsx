/**
 * Dashboard - ダッシュボードページ
 * 回答する質問: "現在システムで何が起きているか?どこを最初に見るべきか?"
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, List, Tag, Button, Alert, Space, Typography } from 'antd';
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useExperimentStore, useDatasetStore } from '@/stores';
import type { Experiment, Dataset } from '@/types';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();

  // Store状態
  const { experiments, fetchExperiments } = useExperimentStore();
  const { datasets, fetchDatasets } = useDatasetStore();

  // 初期データ読み込み
  useEffect(() => {
    fetchExperiments();
    fetchDatasets();
  }, []);

  // 実験ステータス別の統計
  const experimentStats = {
    running: experiments.filter((e) => e.status === 'running').length,
    completed: experiments.filter((e) => e.status === 'completed').length,
    failed: experiments.filter((e) => e.status === 'failed').length,
    total: experiments.length,
  };

  // 最近の実験(最新5件)
  const recentExperiments = [...experiments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // 最近生成されたデータセット(最新5件)
  const recentDatasets = [...datasets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // システム警告(ダミーデータ - 実際はAPIから取得)
  const systemAlerts = [
    {
      type: 'warning' as const,
      message: 'データセット "meeting-ja-en-v3" の品質ゲートが失敗しました',
      action: () => navigate('/datasets/1'),
    },
    {
      type: 'error' as const,
      message: '実験 "exp-2024-001" が異常終了しました',
      action: () => navigate('/experiments/1'),
    },
  ];

  // 実験ステータスのアイコンとカラー
  const getStatusConfig = (status: Experiment['status']) => {
    switch (status) {
      case 'running':
        return { icon: <SyncOutlined spin />, color: 'processing' };
      case 'completed':
        return { icon: <CheckCircleOutlined />, color: 'success' };
      case 'failed':
        return { icon: <CloseCircleOutlined />, color: 'error' };
      default:
        return { icon: <ExperimentOutlined />, color: 'default' };
    }
  };

  // データセットタイプのカラー
  const getDatasetTypeColor = (type: Dataset['type']) => {
    switch (type) {
      case 'human':
        return 'blue';
      case 'synthetic':
        return 'purple';
      case 'mixed':
        return 'orange';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <Title level={2}>ダッシュボード</Title>

      {/* システム警告 */}
      {systemAlerts.length > 0 && (
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
          {systemAlerts.map((alert, index) => (
            <Alert
              key={index}
              type={alert.type}
              message={alert.message}
              showIcon
              icon={<WarningOutlined />}
              action={
                <Button size="small" onClick={alert.action}>
                  確認
                </Button>
              }
            />
          ))}
        </Space>
      )}

      {/* 統計カード */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="実行中の実験"
              value={experimentStats.running}
              prefix={<SyncOutlined spin />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="完了した実験"
              value={experimentStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="失敗した実験"
              value={experimentStats.failed}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="総実験数"
              value={experimentStats.total}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近の実験 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近の実験"
            extra={
              <Button type="link" onClick={() => navigate('/experiments')}>
                すべて表示
              </Button>
            }
          >
            <List
              dataSource={recentExperiments}
              renderItem={(experiment) => {
                const statusConfig = getStatusConfig(experiment.status);
                return (
                  <List.Item
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        onClick={() => navigate(`/experiments/${experiment.id}`)}
                      >
                        詳細
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          {experiment.name}
                          <Tag icon={statusConfig.icon} color={statusConfig.color}>
                            {experiment.status}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">{experiment.direction}</Text>
                          {experiment.bestScore && (
                            <Text>
                              ベストスコア: {experiment.bestScore.toFixed(2)}
                              {/* トレンド表示のダミー */}
                              <ArrowUpOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* 最近のデータセット */}
        <Col xs={24} lg={12}>
          <Card
            title="最近のデータセット"
            extra={
              <Button type="link" onClick={() => navigate('/datasets')}>
                すべて表示
              </Button>
            }
          >
            <List
              dataSource={recentDatasets}
              renderItem={(dataset) => (
                <List.Item
                  actions={[
                    <Button
                      key="view"
                      type="link"
                      onClick={() => navigate(`/datasets/${dataset.id}`)}
                    >
                      詳細
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {dataset.name}
                        <Tag color={getDatasetTypeColor(dataset.type)}>{dataset.type}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Tag>{dataset.languageDirection}</Tag>
                        <Tag>{dataset.scene}</Tag>
                        <Tag
                          color={
                            dataset.status === 'passed'
                              ? 'success'
                              : dataset.status === 'blocked'
                              ? 'error'
                              : 'default'
                          }
                        >
                          {dataset.status}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
