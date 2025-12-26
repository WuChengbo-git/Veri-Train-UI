import { useEffect } from 'react';
import {
  Typography,
  Card,
  Table,
  Space,
  Select,
  Tag,
  Button,
  Input,
  Row,
  Col,
  Statistic,
  Dropdown,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  RadarChartOutlined,
  DownloadOutlined,
  ExportOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { useReportStore } from '../../stores/reportStore';
import type { Report } from '../../types/report';

const { Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const ReportsPage = () => {
  const {
    reports,
    loading,
    currentPage,
    pageSize,
    total,
    fetchReports,
    setFilters,
    setPage,
    setPageSize,
    deleteReport,
    publishReport,
    exportReport,
  } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 类型图标映射
  const typeIconMap = {
    performance: <BarChartOutlined />,
    comparison: <LineChartOutlined />,
    analysis: <RadarChartOutlined />,
    summary: <FileTextOutlined />,
  };

  // 类型标签渲染
  const renderType = (type: string) => {
    const typeConfig = {
      performance: { color: 'blue', text: 'パフォーマンス' },
      comparison: { color: 'green', text: '比較' },
      analysis: { color: 'purple', text: '分析' },
      summary: { color: 'orange', text: 'サマリー' },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return config ? (
      <Tag color={config.color} icon={typeIconMap[type as keyof typeof typeIconMap]}>
        {config.text}
      </Tag>
    ) : (
      <Tag>{type}</Tag>
    );
  };

  // 状态标签渲染
  const renderStatus = (status: string) => {
    const statusConfig = {
      draft: { color: 'default', text: '下書き' },
      generating: { color: 'processing', text: '生成中' },
      published: { color: 'success', text: '公開済み' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? <Tag color={config.color}>{config.text}</Tag> : <Tag>{status}</Tag>;
  };

  // 导出操作菜单
  const getExportMenu = (reportId: string): MenuProps => ({
    items: [
      {
        key: 'pdf',
        label: 'PDF形式でエクスポート',
        icon: <DownloadOutlined />,
        onClick: () => exportReport(reportId, 'pdf'),
      },
      {
        key: 'docx',
        label: 'Word形式でエクスポート',
        icon: <DownloadOutlined />,
        onClick: () => exportReport(reportId, 'docx'),
      },
      {
        key: 'html',
        label: 'HTML形式でエクスポート',
        icon: <DownloadOutlined />,
        onClick: () => exportReport(reportId, 'html'),
      },
    ],
  });

  // 删除确认
  const handleDelete = (id: string, title: string) => {
    confirm({
      title: 'レポートを削除しますか？',
      content: `"${title}" を削除してもよろしいですか？この操作は元に戻せません。`,
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: () => deleteReport(id),
    });
  };

  // 表格列定义
  const columns: ColumnsType<Report> = [
    {
      title: 'タイトル',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
      render: (title: string, record) => (
        <Space>
          {typeIconMap[record.type as keyof typeof typeIconMap]}
          <a>{title}</a>
        </Space>
      ),
    },
    {
      title: '説明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'タイプ',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: renderType,
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatus,
    },
    {
      title: '作成者',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
    },
    {
      title: '作成日時',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('ja-JP'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            詳細
          </Button>
          {record.status === 'draft' && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />}>
                編集
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => publishReport(record.id)}
              >
                公開
              </Button>
            </>
          )}
          <Dropdown menu={getExportMenu(record.id)}>
            <Button type="link" size="small" icon={<ExportOutlined />}>
              エクスポート
            </Button>
          </Dropdown>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.title)}
          >
            削除
          </Button>
        </Space>
      ),
    },
  ];

  // 计算统计信息
  const draftReports = reports.filter((r) => r.status === 'draft');
  const publishedReports = reports.filter((r) => r.status === 'published');
  const generatingReports = reports.filter((r) => r.status === 'generating');

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          レポート
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          新規レポート
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="総レポート数" value={total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="下書き"
              value={draftReports.length}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="生成中"
              value={generatingReports.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="公開済み"
              value={publishedReports.length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* フィルター */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="レポートを検索"
            allowClear
            style={{ width: 250 }}
            onSearch={(value) => setFilters({ search: value })}
          />
          <Select
            placeholder="タイプ"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ type: value })}
            options={[
              { value: 'performance', label: 'パフォーマンス' },
              { value: 'comparison', label: '比較' },
              { value: 'analysis', label: '分析' },
              { value: 'summary', label: 'サマリー' },
            ]}
          />
          <Select
            placeholder="ステータス"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ status: value })}
            options={[
              { value: 'draft', label: '下書き' },
              { value: 'generating', label: '生成中' },
              { value: 'published', label: '公開済み' },
            ]}
          />
          <Button
            onClick={() => {
              setFilters({});
              fetchReports();
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
          dataSource={reports}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
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

export default ReportsPage;
