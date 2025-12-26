# Mock API Data for Reports and Settings

这个文档包含了 Reports 和 Settings 页面所需的 Mock API 数据格式。后端开发人员应该参考这些格式来实现真实的 API。

## Reports API

### GET /api/v1/reports
获取报告列表（分页）

**Query Parameters:**
- `page`: 页码（默认: 1）
- `pageSize`: 每页数量（默认: 10）
- `filters[type]`: 报告类型过滤（可选）
- `filters[status]`: 状态过滤（可选）
- `filters[search]`: 搜索关键词（可选）

**Response:**
```json
{
  "data": [
    {
      "id": "report-001",
      "experimentId": "exp-001",
      "title": "モデル性能比較レポート - 2024年12月",
      "description": "複数のモデルを比較した性能分析レポート",
      "type": "comparison",
      "status": "published",
      "createdAt": "2024-12-20T10:00:00Z",
      "publishedAt": "2024-12-21T15:30:00Z",
      "createdBy": "山田太郎",
      "tags": ["comparison", "performance"]
    },
    {
      "id": "report-002",
      "experimentId": "exp-002",
      "title": "音声認識モデル パフォーマンス分析",
      "description": "音声認識モデルの詳細なパフォーマンス分析",
      "type": "performance",
      "status": "published",
      "createdAt": "2024-12-18T14:30:00Z",
      "publishedAt": "2024-12-19T09:00:00Z",
      "createdBy": "佐藤花子",
      "tags": ["performance", "speech"]
    },
    {
      "id": "report-003",
      "experimentId": "exp-003",
      "title": "翻訳品質評価レポート（下書き）",
      "description": "機械翻訳の品質を詳細に評価したレポート",
      "type": "analysis",
      "status": "draft",
      "createdAt": "2024-12-25T08:15:00Z",
      "createdBy": "鈴木一郎",
      "tags": ["analysis", "translation"]
    },
    {
      "id": "report-004",
      "experimentId": "exp-004",
      "title": "合成データ影響分析",
      "description": "合成データがモデル性能に与える影響の分析",
      "type": "analysis",
      "status": "published",
      "createdAt": "2024-12-15T11:20:00Z",
      "publishedAt": "2024-12-16T16:45:00Z",
      "createdBy": "田中美咲",
      "tags": ["synthetic", "analysis"]
    },
    {
      "id": "report-005",
      "experimentId": "exp-005",
      "title": "週次サマリーレポート - Week 51",
      "description": "第51週の実験結果サマリー",
      "type": "summary",
      "status": "published",
      "createdAt": "2024-12-22T16:00:00Z",
      "publishedAt": "2024-12-22T17:00:00Z",
      "createdBy": "自動生成",
      "tags": ["summary", "weekly"]
    },
    {
      "id": "report-006",
      "experimentId": "exp-006",
      "title": "GPT評価結果レポート（生成中）",
      "description": "GPT-4を使用した評価結果のレポート",
      "type": "analysis",
      "status": "generating",
      "createdAt": "2024-12-26T09:00:00Z",
      "createdBy": "自動生成",
      "tags": ["gpt", "evaluation"]
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 10
}
```

### GET /api/v1/reports/:id
获取报告详情

**Response:**
```json
{
  "id": "report-001",
  "experimentId": "exp-001",
  "title": "モデル性能比較レポート - 2024年12月",
  "description": "複数のモデルを比較した性能分析レポート",
  "type": "comparison",
  "status": "published",
  "createdAt": "2024-12-20T10:00:00Z",
  "publishedAt": "2024-12-21T15:30:00Z",
  "createdBy": "山田太郎",
  "tags": ["comparison", "performance"],
  "summary": {
    "changes": [
      "モデルAからモデルBへの更新",
      "学習率を0.001から0.0001に変更",
      "バッチサイズを32から64に増加"
    ],
    "improvements": [
      {
        "metric": "BLEU",
        "before": 0.65,
        "after": 0.72,
        "delta": 0.07
      },
      {
        "metric": "ROUGE-L",
        "before": 0.58,
        "after": 0.68,
        "delta": 0.10
      }
    ],
    "regressions": []
  },
  "comparison": {
    "baselineExperimentId": "exp-baseline",
    "currentExperimentId": "exp-001",
    "differences": {
      "config": {
        "learning_rate": { "before": 0.001, "after": 0.0001 },
        "batch_size": { "before": 32, "after": 64 }
      },
      "metrics": {
        "bleu": { "before": 0.65, "after": 0.72, "delta": 0.07 },
        "rouge_l": { "before": 0.58, "after": 0.68, "delta": 0.10 }
      }
    }
  },
  "syntheticDataAnalysis": {
    "syntheticRatio": 0.3,
    "performanceChange": 0.05,
    "qualityAssessment": "良好",
    "recommendation": "合成データの比率を維持することを推奨"
  },
  "metricsSummary": {
    "avgBleu": 0.72,
    "avgRougeL": 0.68,
    "avgRibes": 0.75,
    "bestModel": "transformer-large",
    "improvementRate": 0.12
  },
  "charts": [
    {
      "type": "line",
      "title": "トレーニング進捗",
      "data": {
        "labels": ["Epoch 1", "Epoch 2", "Epoch 3", "Epoch 4", "Epoch 5"],
        "datasets": [
          {
            "label": "BLEU",
            "data": [0.45, 0.58, 0.65, 0.70, 0.72]
          }
        ]
      }
    }
  ],
  "conclusions": [
    "モデルBはモデルAと比較して12%の性能向上を示した",
    "学習率の調整が最も大きな影響を与えた",
    "合成データの使用は品質に悪影響を与えなかった"
  ],
  "recommendations": [
    "本番環境でモデルBの使用を推奨",
    "さらなる性能向上のため、データの多様性を増やすことを検討",
    "定期的な再トレーニングスケジュールの確立"
  ],
  "nextSteps": [
    "本番環境へのデプロイ準備",
    "A/Bテストの実施",
    "モニタリングシステムの構築"
  ]
}
```

### POST /api/v1/reports
新規報告作成

**Request Body:**
```json
{
  "title": "新しいレポート",
  "description": "レポートの説明",
  "type": "performance",
  "experimentId": "exp-001"
}
```

**Response:**
```json
{
  "id": "report-new",
  "experimentId": "exp-001",
  "title": "新しいレポート",
  "description": "レポートの説明",
  "type": "performance",
  "status": "draft",
  "createdAt": "2024-12-26T10:30:00Z",
  "createdBy": "current-user"
}
```

### POST /api/v1/reports/:id/publish
报告发布

**Response:**
```json
{
  "id": "report-003",
  "status": "published",
  "publishedAt": "2024-12-26T10:35:00Z"
}
```

### DELETE /api/v1/reports/:id
删除报告

**Response:** 204 No Content

### GET /api/v1/reports/:id/export?format=pdf
导出报告

**Query Parameters:**
- `format`: pdf | docx | html

**Response:** Binary file (Blob)

---

## Settings API

### GET /api/v1/settings/system
获取系统设置

**Response:**
```json
{
  "general": {
    "language": "ja",
    "timezone": "Asia/Tokyo",
    "theme": "light",
    "notifications_enabled": true
  },
  "training": {
    "default_epochs": 10,
    "default_batch_size": 32,
    "default_learning_rate": 0.001,
    "auto_save_checkpoints": true,
    "checkpoint_interval": 5,
    "early_stopping_enabled": true,
    "early_stopping_patience": 3
  },
  "evaluation": {
    "default_metrics": ["bleu", "rouge_l", "ribes"],
    "enable_gpt_eval": true,
    "gpt_model": "gpt-4-turbo",
    "enable_human_eval": false,
    "confidence_threshold": 0.8
  },
  "storage": {
    "data_retention_days": 90,
    "auto_cleanup_enabled": true,
    "max_storage_gb": 1000,
    "current_usage_gb": 456.78
  },
  "api": {
    "base_url": "http://10.36.94.98:8000/api/v1",
    "timeout_seconds": 30,
    "retry_attempts": 3,
    "rate_limit_per_minute": 100
  },
  "security": {
    "two_factor_enabled": false,
    "session_timeout_minutes": 30,
    "password_expiry_days": 90,
    "ip_whitelist": ["10.36.94.0/24", "192.168.1.0/24"]
  }
}
```

### PUT /api/v1/settings/system
更新系统设置

**Request Body:** (部分或全部设置)
```json
{
  "general": {
    "language": "en",
    "theme": "dark"
  }
}
```

**Response:** 同 GET 响应格式

### GET /api/v1/settings/preferences
获取用户偏好设置

**Response:**
```json
{
  "user_id": "user-001",
  "email": "user@example.com",
  "display_name": "山田太郎",
  "avatar_url": "https://example.com/avatar.jpg",
  "email_notifications": true,
  "desktop_notifications": true,
  "weekly_summary": true,
  "preferred_language": "ja",
  "items_per_page": 20,
  "default_view": "table"
}
```

### PUT /api/v1/settings/preferences
更新用户偏好设置

**Request Body:** (部分或全部设置)
```json
{
  "display_name": "山田次郎",
  "items_per_page": 50
}
```

**Response:** 同 GET 响应格式

### POST /api/v1/settings/system/reset
重置系统设置为默认值

**Response:** 同 GET /api/v1/settings/system

### POST /api/v1/settings/test-connection
测试API连接

**Request Body:**
```json
{
  "url": "http://10.36.94.98:8000/api/v1"
}
```

**Response:**
```json
{
  "success": true,
  "latency": 45
}
```

### POST /api/v1/settings/cleanup-storage
清理存储空间

**Response:**
```json
{
  "deletedItems": 156,
  "freedSpace": 12.5
}
```

---

## 实现建议

1. **分页**: 所有列表 API 应该支持分页，使用 `page` 和 `pageSize` 参数
2. **过滤**: Reports API 应该支持按类型、状态和搜索关键词过滤
3. **权限**: Settings API 应该检查用户权限，只有管理员可以修改系统设置
4. **验证**: 所有 PUT/POST 请求应该验证输入数据的有效性
5. **错误处理**: 返回适当的 HTTP 状态码和错误消息
6. **异步操作**: 报告生成和导出可能是耗时操作，考虑使用异步任务队列

## 错误响应格式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "type",
      "reason": "Invalid report type"
    }
  }
}
```
