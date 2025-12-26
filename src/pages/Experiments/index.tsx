import { useEffect } from 'react';
import { Typography, Card, Table, Space, Input, Select, Tag, Button, Progress } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useExperimentStore } from '../../stores/experimentStore';
import type { Experiment } from '../../types/experiment';

const { Title } = Typography;
const { Search } = Input;

const Experiments = () => {
  const {
    experiments,
    loading,
    currentPage,
    pageSize,
    total,
    fetchExperiments,
    setFilters,
    setPage,
    setPageSize,
  } = useExperimentStore();

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  // 状态标签渲染
  const renderStatus = (status: string) => {
    const statusConfig = {
      pending: { color: 'default', icon: <ClockCircleOutlined />, text: '待機中' },
      running: { color: 'processing', icon: <LoadingOutlined />, text: '実行中' },
      completed: { color: 'success', icon: <CheckCircleOutlined />, text: '完了' },
      failed: { color: 'error', icon: <CloseCircleOutlined />, text: '失敗' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 表格列定义
  const columns: ColumnsType<Experiment> = [
    {
      title: '実験名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: 'タスク',
      dataIndex: 'task',
      key: 'task',
      width: 100,
      render: (task: string) => <Tag color="blue">{task === 'translation' ? '翻訳' : task}</Tag>,
    },
    {
      title: '言語方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 100,
      render: (dir: string) => <Tag>{dir.toUpperCase()}</Tag>,
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderStatus,
    },
    {
      title: '進捗',
      key: 'progress',
      width: 150,
      render: (_, record) => {
        if (record.status === 'running') {
          // 随机进度 (实际应从API获取)
          const progress = Math.floor(Math.random() * 100);
          return <Progress percent={progress} size="small" />;
        }
        if (record.status === 'completed') {
          return <Progress percent={100} size="small" status="success" />;
        }
        if (record.status === 'failed') {
          return <Progress percent={0} size="small" status="exception" />;
        }
        return <Progress percent={0} size="small" />;
      },
    },
    {
      title: 'スコア',
      dataIndex: 'best_score',
      key: 'best_score',
      width: 100,
      render: (score: number | null) => {
        if (score === null || score === undefined) return '-';
        const color = score >= 0.7 ? 'green' : score >= 0.5 ? 'orange' : 'red';
        return <span style={{ color, fontWeight: 500 }}>{score.toFixed(2)}</span>;
      },
    },
    {
      title: '開始時刻',
      dataIndex: 'started_at',
      key: 'started_at',
      width: 180,
      render: (date: string | null) =>
        date ? new Date(date).toLocaleString('ja-JP') : '-',
    },
    {
      title: '完了時刻',
      dataIndex: 'completed_at',
      key: 'completed_at',
      width: 180,
      render: (date: string | null) =>
        date ? new Date(date).toLocaleString('ja-JP') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            詳細
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" icon={<PlayCircleOutlined />}>
              開始
            </Button>
          )}
          {record.status === 'running' && (
            <Button type="link" size="small" danger>
              停止
            </Button>
          )}
          <Button type="link" size="small" danger>
            削除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          実験管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          新規作成
        </Button>
      </div>

      {/* フィルター */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="実験名で検索"
            allowClear
            style={{ width: 250 }}
            onSearch={(value) => setFilters({ search: value })}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="ステータス"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ status: value })}
            options={[
              { value: 'pending', label: '待機中' },
              { value: 'running', label: '実行中' },
              { value: 'completed', label: '完了' },
              { value: 'failed', label: '失敗' },
            ]}
          />
          <Button
            onClick={() => {
              setFilters({});
              fetchExperiments();
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
          dataSource={experiments}
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

export default Experiments;
