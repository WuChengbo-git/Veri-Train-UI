import { useEffect } from 'react';
import { Typography, Card, Table, Space, Select, Tag, Button, Statistic, Row, Col } from 'antd';
import {
  PlusOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEvaluationStore } from '../../stores/evaluationStore';
import type { Evaluation } from '../../types/evaluation';

const { Title } = Typography;

const EvaluationPage = () => {
  const {
    evaluations,
    loading,
    currentPage,
    pageSize,
    total,
    fetchEvaluations,
    setFilters,
    setPage,
    setPageSize,
  } = useEvaluationStore();

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  // Track标签渲染
  const renderTrack = (track: string) => {
    const trackConfig = {
      spoken: { color: 'orange', icon: <ThunderboltOutlined />, text: '音声' },
      written: { color: 'green', icon: <FileTextOutlined />, text: '文書' },
    };
    const config = trackConfig[track as keyof typeof trackConfig];
    return config ? (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    ) : (
      <Tag>{track}</Tag>
    );
  };

  // 指标渲染 (带颜色)
  const renderMetric = (value: number | undefined) => {
    if (value === undefined || value === null) return '-';
    const color = value >= 0.7 ? '#52c41a' : value >= 0.5 ? '#faad14' : '#ff4d4f';
    return <span style={{ color, fontWeight: 500 }}>{value.toFixed(2)}</span>;
  };

  // 表格列定义
  const columns: ColumnsType<Evaluation> = [
    {
      title: '実験ID',
      dataIndex: 'experiment_id',
      key: 'experiment_id',
      width: 180,
      render: (id: string) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{id.substring(0, 8)}...</span>,
    },
    {
      title: 'トラック',
      dataIndex: 'track',
      key: 'track',
      width: 100,
      render: renderTrack,
    },
    {
      title: 'BLEU',
      key: 'bleu',
      width: 100,
      render: (_, record) => renderMetric(record.metrics.bleu),
      sorter: (a, b) => (a.metrics.bleu || 0) - (b.metrics.bleu || 0),
    },
    {
      title: 'ROUGE-L',
      key: 'rouge_l',
      width: 100,
      render: (_, record) => renderMetric(record.metrics.rouge_l),
      sorter: (a, b) => (a.metrics.rouge_l || 0) - (b.metrics.rouge_l || 0),
    },
    {
      title: 'RIBES',
      key: 'ribes',
      width: 100,
      render: (_, record) => renderMetric(record.metrics.ribes),
      sorter: (a, b) => (a.metrics.ribes || 0) - (b.metrics.ribes || 0),
    },
    {
      title: 'GPT流暢性',
      key: 'gpt_fluency',
      width: 110,
      render: (_, record) => {
        const fluency = record.metrics.gpt_eval_1?.fluency;
        if (!fluency) return '-';
        const color = fluency >= 4.0 ? '#52c41a' : fluency >= 3.0 ? '#faad14' : '#ff4d4f';
        return <span style={{ color, fontWeight: 500 }}>{fluency.toFixed(1)}/5.0</span>;
      },
    },
    {
      title: 'MQMスコア',
      key: 'mqm_score',
      width: 110,
      render: (_, record) => {
        const mqm = record.metrics.gpt_eval_2?.mqm_score;
        if (!mqm) return '-';
        const color = mqm >= 85 ? '#52c41a' : mqm >= 70 ? '#faad14' : '#ff4d4f';
        return <span style={{ color, fontWeight: 500 }}>{mqm.toFixed(1)}</span>;
      },
    },
    {
      title: 'エラー数',
      key: 'error_count',
      width: 100,
      render: (_, record) => {
        const errors = record.error_analysis.top_errors;
        const totalErrors = errors.reduce((sum, e) => sum + e.count, 0);
        return <span>{totalErrors}</span>;
      },
    },
    {
      title: '評価日時',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('ja-JP'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            詳細
          </Button>
          <Button type="link" size="small">
            比較
          </Button>
        </Space>
      ),
    },
  ];

  // 计算统计信息
  const spokenEvals = evaluations.filter((e) => e.track === 'spoken');
  const writtenEvals = evaluations.filter((e) => e.track === 'written');
  const avgBleu =
    evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + (e.metrics.bleu || 0), 0) / evaluations.length).toFixed(2)
      : '0.00';

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          評価
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          新規評価
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="総評価数" value={total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="音声トラック" value={spokenEvals.length} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="文書トラック" value={writtenEvals.length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均BLEU" value={avgBleu} precision={2} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
      </Row>

      {/* フィルター */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder="トラック"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ track: value })}
            options={[
              { value: 'spoken', label: '音声' },
              { value: 'written', label: '文書' },
            ]}
          />
          <Button
            onClick={() => {
              setFilters({});
              fetchEvaluations();
            }}
          >
            リセット
          </Button>
        </Space>
      </Card>

      {/* テーブル */}
      <Card>
        <Table
          columns={columns}
          dataSource={evaluations}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `合計 ${total} 件`,
            onChange: (page, size) => {
              setPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default EvaluationPage;
