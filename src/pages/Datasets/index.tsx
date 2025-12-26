/**
 * 数据集管理页面
 */

import { useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Select, Input } from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDatasetStore } from '@/stores/datasetStore';
import type { Dataset } from '@/types';

const { Title } = Typography;
const { Option } = Select;

console.log('🚨 Datasets 模块已加载');

const Datasets = () => {
  console.log('🔍 Datasets 组件开始渲染');

  const {
    datasets,
    loading,
    currentPage,
    pageSize,
    total,
    fetchDatasets,
    setFilters,
    setPage,
    setPageSize,
  } = useDatasetStore();

  console.log('📊 Datasets 状态:', {
    datasetsCount: datasets.length,
    loading,
    total,
    currentPage,
    pageSize,
  });

  useEffect(() => {
    console.log('🚀 useEffect 触发 - 准备调用 fetchDatasets');
    fetchDatasets().then(() => {
      console.log('✅ fetchDatasets 完成');
    }).catch((err) => {
      console.error('❌ fetchDatasets 错误:', err);
    });
  }, [fetchDatasets]);

  // 状态标签渲染
  const renderStatus = (status: string) => {
    const statusConfig = {
      draft: { color: 'default', icon: <ClockCircleOutlined />, text: 'ドラフト' },
      passed: { color: 'success', icon: <CheckCircleOutlined />, text: '合格' },
      blocked: { color: 'error', icon: <CloseCircleOutlined />, text: 'ブロック' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // 表格列定义
  const columns: ColumnsType<Dataset> = [
    {
      title: 'データセット名',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: 'タイプ',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          human: { color: 'blue', text: '人間作成' },
          synthetic: { color: 'purple', text: '合成' },
          mixed: { color: 'cyan', text: '混合' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '言語方向',
      dataIndex: 'language_direction',
      key: 'language_direction',
      width: 120,
      render: (direction: string) => <Tag>{direction}</Tag>,
    },
    {
      title: 'シーン',
      dataIndex: 'scene',
      key: 'scene',
      width: 120,
      render: (scene: string) => {
        const sceneMap = {
          meeting: { color: 'orange', text: '会議' },
          written: { color: 'green', text: '書面' },
        };
        const config = sceneMap[scene as keyof typeof sceneMap];
        return <Tag color={config?.color}>{config?.text || scene}</Tag>;
      },
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: renderStatus,
    },
    {
      title: 'バージョン',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      render: (version: number) => `v${version}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            詳細
          </Button>
          <Button type="link" size="small">
            Quality Gate
          </Button>
          <Button type="link" size="small" danger>
            削除
          </Button>
        </Space>
      ),
    },
  ];

  console.log('🎨 准备渲染页面，datasets 数量:', datasets.length);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Title level={2}>データセット管理</Title>
      </div>

      {/* フィルター */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="データセット名を検索"
              prefix={<SearchOutlined />}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="タイプ"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ type: value })}
            >
              <Option value="human">人間作成</Option>
              <Option value="synthetic">合成</Option>
              <Option value="mixed">混合</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="言語方向"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ direction: value })}
            >
              <Option value="ja-en">日本語→英語</Option>
              <Option value="en-ja">英語→日本語</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="シーン"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ scene: value })}
            >
              <Option value="meeting">会議</Option>
              <Option value="written">書面</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="ステータス"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ status: value })}
            >
              <Option value="draft">ドラフト</Option>
              <Option value="passed">合格</Option>
              <Option value="blocked">ブロック</Option>
            </Select>
          </Col>
          <Col span={2}>
            <Button type="primary" icon={<PlusOutlined />} block>
              新規作成
            </Button>
          </Col>
        </Row>
      </Card>

      {/* データテーブル */}
      <Card>
        <Table
          columns={columns}
          dataSource={datasets}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `合計 ${total} 件`,
            onChange: (page, pageSize) => {
              setPage(page);
              if (pageSize) setPageSize(pageSize);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Datasets;
