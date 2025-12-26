/**
 * Simple Mock API Server for Development
 *
 * Usage: node mock-server.js
 *
 * This server provides mock data for Reports and Settings pages
 * while the backend is being developed.
 */

const http = require('http');
const url = require('url');

const PORT = 8001;

// Mock Data
const mockReports = Array.from({ length: 6 }, (_, i) => ({
  id: `report-${String(i + 1).padStart(3, '0')}`,
  experimentId: `exp-${String(i + 1).padStart(3, '0')}`,
  title: [
    'モデル性能比較レポート - 2024年12月',
    '音声認識モデル パフォーマンス分析',
    '翻訳品質評価レポート（下書き）',
    '合成データ影響分析',
    '週次サマリーレポート - Week 51',
    'GPT評価結果レポート（生成中）'
  ][i],
  description: [
    '複数のモデルを比較した性能分析レポート',
    '音声認識モデルの詳細なパフォーマンス分析',
    '機械翻訳の品質を詳細に評価したレポート',
    '合成データがモデル性能に与える影響の分析',
    '第51週の実験結果サマリー',
    'GPT-4を使用した評価結果のレポート'
  ][i],
  type: ['comparison', 'performance', 'analysis', 'analysis', 'summary', 'analysis'][i],
  status: ['published', 'published', 'draft', 'published', 'published', 'generating'][i],
  createdAt: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
  publishedAt: i < 2 || i === 3 || i === 4 ? new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000 + 3600000).toISOString() : null,
  createdBy: ['山田太郎', '佐藤花子', '鈴木一郎', '田中美咲', '自動生成', '自動生成'][i],
  tags: [
    ['comparison', 'performance'],
    ['performance', 'speech'],
    ['analysis', 'translation'],
    ['synthetic', 'analysis'],
    ['summary', 'weekly'],
    ['gpt', 'evaluation']
  ][i]
}));

const mockSystemSettings = {
  general: {
    language: 'ja',
    timezone: 'Asia/Tokyo',
    theme: 'light',
    notifications_enabled: true
  },
  training: {
    default_epochs: 10,
    default_batch_size: 32,
    default_learning_rate: 0.001,
    auto_save_checkpoints: true,
    checkpoint_interval: 5,
    early_stopping_enabled: true,
    early_stopping_patience: 3
  },
  evaluation: {
    default_metrics: ['bleu', 'rouge_l', 'ribes'],
    enable_gpt_eval: true,
    gpt_model: 'gpt-4-turbo',
    enable_human_eval: false,
    confidence_threshold: 0.8
  },
  storage: {
    data_retention_days: 90,
    auto_cleanup_enabled: true,
    max_storage_gb: 1000,
    current_usage_gb: 456.78
  },
  api: {
    base_url: 'http://10.36.94.98:8000/api/v1',
    timeout_seconds: 30,
    retry_attempts: 3,
    rate_limit_per_minute: 100
  },
  security: {
    two_factor_enabled: false,
    session_timeout_minutes: 30,
    password_expiry_days: 90,
    ip_whitelist: ['10.36.94.0/24', '192.168.1.0/24']
  }
};

const mockUserPreferences = {
  user_id: 'user-001',
  email: 'user@example.com',
  display_name: '山田太郎',
  avatar_url: 'https://example.com/avatar.jpg',
  email_notifications: true,
  desktop_notifications: true,
  weekly_summary: true,
  preferred_language: 'ja',
  items_per_page: 20,
  default_view: 'table'
};

// Request Handler
const requestHandler = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  // Routes
  if (pathname === '/api/v1/reports' && req.method === 'GET') {
    const page = parseInt(parsedUrl.query.page) || 1;
    const pageSize = parseInt(parsedUrl.query.pageSize) || 10;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      items: mockReports,
      total: mockReports.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(mockReports.length / pageSize)
    }));
  }
  else if (pathname.match(/^\/api\/v1\/reports\//) && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const report = mockReports.find(r => r.id === id);

    if (report) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(report));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Report not found' }));
    }
  }
  else if (pathname === '/api/v1/settings/system' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockSystemSettings));
  }
  else if (pathname === '/api/v1/settings/system' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const updates = JSON.parse(body);
      Object.assign(mockSystemSettings, updates);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockSystemSettings));
    });
  }
  else if (pathname === '/api/v1/settings/preferences' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockUserPreferences));
  }
  else if (pathname === '/api/v1/settings/preferences' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const updates = JSON.parse(body);
      Object.assign(mockUserPreferences, updates);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockUserPreferences));
    });
  }
  else if (pathname === '/api/v1/settings/test-connection' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      latency: Math.floor(Math.random() * 100) + 20
    }));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `エンドポイント ${pathname} はまだ実装されていません。docs/API_MOCK_DATA.md を参照してください。`
    }));
  }
};

// Create Server
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log('🚀 Mock API Server started!');
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log(`🔗 CORS enabled for all origins`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/v1/reports');
  console.log('  GET  /api/v1/reports/:id');
  console.log('  GET  /api/v1/settings/system');
  console.log('  PUT  /api/v1/settings/system');
  console.log('  GET  /api/v1/settings/preferences');
  console.log('  PUT  /api/v1/settings/preferences');
  console.log('  POST /api/v1/settings/test-connection');
  console.log('');
  console.log('💡 Tip: Update your .env file to use this server:');
  console.log(`   VITE_API_BASE_URL=http://localhost:${PORT}/api/v1`);
});
