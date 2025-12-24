/**
 * Models - モデル管理ページ
 * 回答する質問: "今使えるモデルは何か?その本質的な振る舞いは?"
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tag, Input, Select, Typography, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useModelStore } from '@/stores';
import type { Model } from '@/types';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

const Models = () => {
  const navigate = useNavigate();

  // Store状態
  const {
    models,
    loading,
    currentPage,
    pageSize,
    total,
    fetchModels,
    setFilters,
    setPage,
    setPageSize,
  } = useModelStore();

  // 初期データ読み込み
  useEffect(() => {
    fetchModels();
  }, []);

  // テーブルのカラム定義
  const columns: ColumnsType<Model> = [
    {
      title: 'モデル名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Model) => (
        <Button type="link" onClick={() => navigate(`/models/${record.id}`)}>
          {name}
        </Button>
      ),
    },
    {
      title: 'タイプ',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: Model['type']) => (
        <Tag color={type === 'base' ? 'blue' : 'purple'}>
          {type === 'base' ? 'ベースモデル' : 'アダプター'}
        </Tag>
      ),
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Model['status']) => (
        <Tag
          color={
            status === 'available' ? 'success' : status === 'deprecated' ? 'default' : 'processing'
          }
        >
          {status === 'available'
            ? '利用可能'
            : status === 'deprecated'
            ? '非推奨'
            : 'トレーニング中'}
        </Tag>
      ),
    },
    {
      title: '作成日',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '更新日',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: Model) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/models/${record.id}`)}>
            詳細
          </Button>
        </Space>
      ),
    },
  ];

  // フィルター変更ハンドラー
  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>モデル管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/models/new')}>
          新規モデル
        </Button>
      </div>

      {/* フィルター */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="モデル名で検索"
            allowClear
            style={{ width: 250 }}
            onSearch={(value) => handleFilterChange('search', value)}
            prefix={<SearchOutlined />}
          />

          <Select
            placeholder="タイプ"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange('type', value)}
            options={[
              { label: 'ベースモデル', value: 'base' },
              { label: 'アダプター', value: 'adapter' },
            ]}
          />

          <Select
            placeholder="ステータス"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { label: '利用可能', value: 'available' },
              { label: '非推奨', value: 'deprecated' },
              { label: 'トレーニング中', value: 'training' },
            ]}
          />

          <Button icon={<ReloadOutlined />} onClick={() => fetchModels()}>
            更新
          </Button>
        </Space>
      </Card>

      {/* テーブル */}
      <Table
        columns={columns}
        dataSource={models}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `全 ${total} 件`,
          onChange: (page, pageSize) => {
            setPage(page);
            if (pageSize) setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default Models;
